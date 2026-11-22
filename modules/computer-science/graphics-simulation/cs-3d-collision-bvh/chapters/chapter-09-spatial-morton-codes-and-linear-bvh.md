# Chapter 9: Spatial Morton Codes and Linear BVH (LBVH)

> *"Space is threefold; the memory of silicon is onefold. By weaving the three threads of length, breadth, and height into a single braided line of bits, the entire cosmos of geometry is ordered by the simple counting of zeroes."*
> — **Guy M. Morton**, *A Computer Oriented Geodetic Data Base and a New Technique in File Sequencing* (IBM Canada, 1966)

---

## 9.1 Space-Filling Curves and Dimension Reduction

In Chapter 8, we derived the Surface Area Heuristic (SAH), which constructs optimal bounding volume hierarchies for ray tracing and physics collision queries. However, both exhaustive sweep and binned SAH builders share a fundamental algorithmic trait: they are **hierarchically recursive**. A parent node must be partitioned before its children can be discovered.

On modern massively parallel computing architectures (such as NVIDIA/AMD GPUs with $10{,}000+$ concurrent CUDA cores or multi-core SIMD CPUs), recursive, stateful CPU algorithms fail to utilize parallel execution hardware.

To construct BVHs over millions of primitives in **milliseconds**, computer scientists turned to **Space-Filling Curves** and the **Linear Bounding Volume Hierarchy (LBVH)**.

```
                  THE 2D Z-ORDER (MORTON) CURVE
                  
       y=3 (11)  +--->---+   +--->---+     Notice the recursive "Z" pattern:
                 |       |   |       |     - Subdivides space quadratically
       y=2 (10)  +---<---+   +---<---+     - Preserves spatial locality:
                     |           |           Points close on the 1D curve
       y=1 (01)  +--->---+   +--->---+       are close in 2D/3D space!
                 |       |   |       |
       y=0 (00)  *---<---+   +---<---+
                x=0 x=1 x=2 x=3
                (00)(01)(10)(11)
```

### 9.1.1 The Dimension Reduction Problem

Let $\mathcal{P} \subset \mathbb{R}^3$ be a set of $N$ geometric primitives in three-dimensional space.
We wish to construct a bijective mapping $f: \mathbb{R}^3 \to \mathbb{R}^1$ that maps every 3D coordinate point $(x, y, z)$ into a single scalar index $z \in \mathbb{N}$ such that **spatial proximity is preserved**:

$$\|\mathbf{p}_A - \mathbf{p}_B\|_{\mathbb{R}^3} \approx 0 \iff |f(\mathbf{p}_A) - f(\mathbf{p}_B)|_{\mathbb{R}^1} \approx 0$$

Three major space-filling curves accomplish this mapping:
1. **Peano Curve (1890):** The first continuous space-filling curve; uses base-3 ternary arithmetic.
2. **Hilbert Curve (1891):** Optimal spatial locality preservation, but requires expensive coordinate rotation and reflection calculations at every recursive depth.
3. **Morton Curve (Z-Order Curve, 1966):** Constructed via simple **bitwise interleaving of binary coordinates**. It can be evaluated in **single-cycle bitwise ALU instructions**!

---

## 9.2 Mathematical Construction of 30-Bit and 63-Bit Morton Codes

A 3D Morton code interweaves the binary bits of three integer coordinate components $(X, Y, Z)$ into a single composite integer key.

```
Bit Interleaving Concept:
  X coordinate:  . . . . . . . . . . . . . x_2 x_1 x_0
  Y coordinate:  . . . . . . . . . . . . . y_2 y_1 y_0
  Z coordinate:  . . . . . . . . . . . . . z_2 z_1 z_0
  
  Morton Code:   z_2 y_2 x_2   z_1 y_1 x_1   z_0 y_0 x_0
                 (Bit 8..6)    (Bit 5..3)    (Bit 2..0)
```

### 9.2.1 Coordinate Normalization and Quantization

Let the scene bounding box spanning all primitive centroids have bounds $[\mathbf{min}, \mathbf{max}] \subset \mathbb{R}^3$.
For any primitive centroid $\mathbf{c} = (c_x, c_y, c_z)^T$:

1. **Normalize coordinates to unit cube $[0, 1]^3$:**
   $$u_x = \frac{c_x - \min_x}{\max_x - \min_x}, \quad u_y = \frac{c_y - \min_y}{\max_y - \min_y}, \quad u_z = \frac{c_z - \min_z}{\max_z - \min_z}$$
   Clamp $u_i \in [0.0, 1.0]$.
2. **Quantize into Fixed-Point Integers:**
   - **For 30-Bit Morton Codes (10 bits per axis $\implies 1024^3$ grid):**
     $$X = \min(1023, \, \lfloor u_x \cdot 1024.0 \rfloor) \in [0, 1023]$$
     $$Y = \min(1023, \, \lfloor u_y \cdot 1024.0 \rfloor) \in [0, 1023]$$
     $$Z = \min(1023, \, \lfloor u_z \cdot 1024.0 \rfloor) \in [0, 1023]$$
   - **For 63-Bit Morton Codes (21 bits per axis $\implies 2{,}097{,}152^3$ grid):**
     $$X = \min(2097151, \, \lfloor u_x \cdot 2097152.0 \rfloor) \in [0, 2^{21} - 1]$$

### 9.2.2 Fast Bit Expansion via Magic Bitmasks

To interleave the bits of $X, Y, Z$ without a loop, we "dilate" each 10-bit integer by inserting two zero bits between every original bit:

$$X = (x_9 x_8 \dots x_1 x_0)_2 \longrightarrow X_{\text{dilated}} = (0 0 x_9 \, 0 0 x_8 \dots 0 0 x_1 \, 0 0 x_0)_2$$

This dilation is accomplished in exactly **5 bitwise operations** using binary magic bitmasks:

```typescript
// FAST BIT DILATION FOR 10-BIT INTEGER (EXPANDS TO 30 BITS)
function expandBits10(v: number): number {
  v = (v * 0x00010001) & 0xFF0000FF;
  v = (v * 0x00000101) & 0x0F00F00F;
  v = (v * 0x00000011) & 0xC30C30C3;
  v = (v * 0x00000005) & 0x49249249;
  return v;
}

// STANDARD SHIFT-MASK EXPANSION (IMMUNE TO 32-BIT OVERFLOW)
function expandBits(v: number): number {
  v = (v | (v << 16)) & 0x030000FF;
  v = (v | (v << 8))  & 0x0300F00F;
  v = (v | (v << 4))  & 0x030C30C3;
  v = (v | (v << 2))  & 0x09249249;
  return v;
}
```

Once dilated, the 30-bit Morton code is assembled in a single line:

$$\boxed{\text{Morton}(X, Y, Z) = (X_{\text{dilated}} \ll 0) \lor (Y_{\text{dilated}} \ll 1) \lor (Z_{\text{dilated}} \ll 2)}$$

---

## 9.3 Radix Sorting: Linear-Time Spatial Ordering

Once a 30-bit Morton code is assigned to each of the $N$ primitives, the entire spatial hierarchy problem is transformed into a **1D integer sorting problem**:

```
Primitive Centroids in 3D Space:     (Arbitrary Random Layout)
                  |
         Compute Morton Codes
                  |
1D Integer Array: [ 842, 12, 9051, 104, 3, 4019, ... ]
                  |
        GPU Radix Sort (30-bit)  --> O(N) Linear Time!
                  |
Sorted 1D Array:  [ 3, 12, 104, 842, 4019, 9051, ... ]
                  |
                  v
Spatially clustered primitives ready for parallel hierarchy generation!
```

### 9.3.1 Radix Sort Complexity

Unlike comparison-based algorithms (QuickSort, MergeSort) which require $\mathcal{O}(N \log N)$ time, **Radix Sort** processes integer keys digit-by-digit:
- Using a radix of $b = 8$ bits (256 buckets), a 32-bit integer is sorted in exactly $4$ linear passes.
- Using a radix of $b = 10$ bits (1024 buckets), a 30-bit Morton code is sorted in exactly **3 passes**!

Total runtime:
$$\text{Time} = \mathcal{O}\left( \frac{W}{b} \cdot N \right) = \mathcal{O}(3N) = \mathcal{O}(N)$$

On modern GPUs, an array of $1{,}000{,}000$ primitives is sorted in **less than $1\text{ millisecond}$** using parallel prefix-sum (scan) primitives (e.g., CUB or Vulkan compute shaders).

---

## 9.4 The Tero Karras Parallel BVH Algorithm (NVIDIA, 2012)

Historically, once primitives were sorted along a space-filling curve, constructing the tree still required recursive top-down splitting.

In 2012, NVIDIA researcher **Tero Karras** published a groundbreaking paper: *Maximizing Parallelism in the Construction of BVHs, Octrees, and kd-Trees* (High Performance Graphics 2012). Karras proved that:
1. In a sorted array of $N$ Morton codes, **the exact topology of every internal node can be computed completely independently in parallel**.
2. No recursion is required.
3. Every internal node $i \in \{0, \dots, N - 2\}$ runs the exact same code on a separate GPU thread with **zero communication or locks**!

```
                  KARRAS PARALLEL TREE GENERATION
                  
Sorted Morton Codes:    k_0     k_1     k_2     k_3     k_4     k_5
                       [   ]   [   ]   [   ]   [   ]   [   ]   [   ]
                         \       /       \       /       \       /
Thread 0, 1, 2, 3, 4:     Node 0          Node 1          Node 2
                            \               /               /
                             \             /               /
                              \           /               /
                                 Node 3                  /
                                   \                    /
                                    \                  /
                                           ROOT
```

### 9.4.1 The Common Prefix Metric $\delta(i, j)$

Let $k_i$ and $k_j$ be the sorted Morton codes at indices $i$ and $j$.
The geometric similarity between two keys is defined by the number of leading identical bits:

$$\boxed{\delta(i, j) = \text{clz}(k_i \oplus k_j)}$$

where:
- $\oplus$ is the bitwise XOR operator (which produces $0$ where bits match, and $1$ where they differ).
- $\text{clz}$ is the **Count Leading Zeros** hardware CPU/GPU instruction (`__builtin_clz` in C++, `Math.clz32` in modern JavaScript/TypeScript).

If $k_i == k_j$ (identical keys), we break ties by appending the primitive index:
$$\delta(i, j) = 32 + \text{clz}(i \oplus j)$$
This ensures that $\delta(i, j)$ is strictly well-defined for all pairs.

### 9.4.2 Step 1: Determining Node Range $[l, r]$ for Thread $i$

For each internal node $i \in \{0, \dots, N - 2\}$:
1. Compare common prefix with left and right neighbors:
   $$\delta_{\text{left}} = \delta(i, i - 1), \quad \delta_{\text{right}} = \delta(i, i + 1)$$
2. Determine direction of the range $d \in \{-1, +1\}$:
   $$d = \text{sign}(\delta(i, i + 1) - \delta(i, i - 1))$$
   - If $\delta(i, i + 1) > \delta(i, i - 1)$, the keys cluster to the right ($d = +1$).
   - If $\delta(i, i + 1) \le \delta(i, i - 1)$, the keys cluster to the left ($d = -1$).
3. Minimum common prefix for the node:
   $$\delta_{\min} = \delta(i, i - d)$$
4. Compute the upper bound of range length $l_{\max}$ using exponential search:
   Find power of two $2^k$ such that $\delta(i, i + 2^k \cdot d) \le \delta_{\min}$.
5. Find exact range boundary $j$ using binary search on $\delta(i, i + t \cdot d) > \delta_{\min}$.
6. The primitive range belonging to node $i$ is:
   $$[l, r] = [\min(i, j), \, \max(i, j)]$$

### 9.4.3 Step 2: Finding the Split Position $\gamma \in [l, r - 1]$

To divide range $[l, r]$ into Left child $[l, \gamma]$ and Right child $[\gamma + 1, r]$:
1. Target prefix:
   $$\delta_{\text{node}} = \delta(l, r)$$
2. Find split point $\gamma$ such that $\delta(l, \gamma) > \delta_{\text{node}}$ using binary search:
   $$\gamma = \arg\max_{t \in [l, r - 1]} (\delta(l, t) > \delta_{\text{node}})$$
3. Assign children:
   - **Left Child:**
     If $\gamma == l$: Left child is **Leaf $l$**!
     Else: Left child is **Internal Node $\gamma$**.
   - **Right Child:**
     If $\gamma + 1 == r$: Right child is **Leaf $r$**!
     Else: Right child is **Internal Node $\gamma + 1$**.

### 9.4.4 Step 3: Parallel Bottom-Up Bounding Box Reduction

Once all node topologies (pointers) are set, bounding boxes are computed from the leaves up to the root:
1. Each of the $N$ threads starts at Leaf $i$.
2. It walks up to its parent using an **atomic flag array**:
   ```typescript
   let current = leafParents[i];
   while (current !== null) {
     const flag = atomicIncrement(nodeFlags[current]);
     if (flag === 1) {
       // First thread to arrive: TERMINATE!
       // (The other sibling child has not finished yet).
       break;
     }
     // Second thread to arrive: BOTH children are done!
     // Compute parent bounding box from left and right children:
     nodes[current].aabb = union(nodes[current].left.aabb, nodes[current].right.aabb);
     current = nodes[current].parent; // Continue walking up to root
   }
   ```
This lock-free atomic reduction computes all bounding boxes in $\mathcal{O}(\log N)$ parallel steps!

---

## 9.5 Hierarchy Quality Comparison: LBVH vs. SAH BVH

```
+-----------------------------------------------------------------------------+
|                      LBVH vs. FULL SAH BVH COMPARISON                       |
+-----------------------------------------------------------------------------+
| Metric                 | Binned SAH BVH            | Linear BVH (LBVH)      |
+------------------------+---------------------------+------------------------+
| Build Algorithm        | Top-Down Recursive Greedy | 1D Radix Sort + Karras |
| Parallel Scalability   | Moderate (CPU Threads)    | Extreme (GPU 10,000c)  |
| Build Time (1M prims)  | ~80 ms (CPU)              | ~1.2 ms (GPU)          |
| Ray Traversal Quality  | 100% (Baseline Best)      | 75% - 85% of SAH       |
| Primary Application    | High-end Offline Tracing  | Real-Time Dynamic Game |
|                        | Production Ray Tracing    | Physics & Deform Meshes|
+-----------------------------------------------------------------------------+
```

While pure LBVH builds $\mathbf{50\times\text{ to }100\times}$ faster than CPU SAH builders, its ray traversal efficiency is $\sim 15\%\text{ to }25\%$ slower due to space-filling curve quantization artifacts.

Modern engines combine both approaches into **Hierarchical LBVH (HLBVH)**:
- Run fast GPU LBVH to cluster millions of primitives into $1{,}000$ clusters.
- Run high-quality SAH on top of the clusters to build the top levels of the tree!

---

## 9.6 Ten Step-by-Step Worked Examples

### Worked Example 9.1: Bitwise Dilation of a 4-Bit Integer
**Problem:** Given the 4-bit integer $X = 11_{10} = 1011_2$, dilate its bits by inserting two zeros between every bit to form a 12-bit integer:
$$X_{\text{dilated}} = (001 \, 000 \, 001 \, 001)_2$$
Verify the arithmetic.

**Solution:**
1. Original bits:
   $$x_3 = 1, \quad x_2 = 0, \quad x_1 = 1, \quad x_0 = 1$$
2. Insert two zeros between each:
   $$\text{Bit 11..9: } 00x_3 = 001$$
   $$\text{Bit 8..6: } 00x_2 = 000$$
   $$\text{Bit 5..3: } 00x_1 = 001$$
   $$\text{Bit 2..0: } 00x_0 = 001$$
3. Combine bits:
   $$X_{\text{dilated}} = 001000001001_2$$
4. Decimal conversion:
   $$2^9 + 2^3 + 2^0 = 512 + 8 + 1 = 521_{10}$$
   The dilated integer is $521$.

---

### Worked Example 9.2: Complete 3D Morton Code Assembly
**Problem:** A primitive centroid has normalized coordinates:
$u_x = 0.5, u_y = 0.25, u_z = 0.75$.
Quantize to 3 bits per axis ($B = 8$ grid) and compute the 9-bit Morton code.

**Solution:**
1. Quantization ($0 \le X, Y, Z < 8$):
   $$X = \lfloor 0.5 \times 8 \rfloor = 4_{10} = 100_2$$
   $$Y = \lfloor 0.25 \times 8 \rfloor = 2_{10} = 010_2$$
   $$Z = \lfloor 0.75 \times 8 \rfloor = 6_{10} = 110_2$$
2. Bit components:
   - $X = (x_2, x_1, x_0) = (1, 0, 0)$
   - $Y = (y_2, y_1, y_0) = (0, 1, 0)$
   - $Z = (z_2, z_1, z_0) = (1, 1, 0)$
3. Interleave $(z_i, y_i, x_i)$ from most significant ($i = 2$) to least significant ($i = 0$):
   - Triad 2 ($i = 2$): $(z_2, y_2, x_2) = (1, 0, 1)$
   - Triad 1 ($i = 1$): $(z_1, y_1, x_1) = (1, 1, 0)$
   - Triad 0 ($i = 0$): $(z_0, y_0, x_0) = (0, 0, 0)$
4. Concatenated 9-bit Morton code:
   $$\text{Morton} = (101 \, 110 \, 000)_2$$
   Decimal value:
   $$2^8 + 2^6 + 2^5 + 2^4 = 256 + 64 + 32 + 16 = 368_{10}$$

---

### Worked Example 9.3: Count Leading Zeros and Common Prefix $\delta(i, j)$
**Problem:** Two sorted 8-bit Morton codes are $k_1 = 108_{10} = 01101100_2$ and $k_2 = 110_{10} = 01101110_2$.
Compute the bitwise XOR and the common prefix metric $\delta(1, 2)$ in an 8-bit register.

**Solution:**
1. Compute bitwise XOR:
   $$k_1 \oplus k_2 = 01101100_2 \oplus 01101110_2 = 00000010_2$$
2. Inspect bits from left to right:
   Bit 7: 0
   Bit 6: 0
   Bit 5: 0
   Bit 4: 0
   Bit 3: 0
   Bit 2: 0
   Bit 1: 1 (First difference!)
3. Count of leading zeros:
   $$\delta(1, 2) = \text{clz}(00000010_2) = 6\text{ leading zeros}$$
   The two keys share a common 6-bit prefix!

---

### Worked Example 9.4: Karras Range Search Trace (Thread 0)
**Problem:** An array of 4 sorted Morton codes is:
$k_0 = 0010_2$, $k_1 = 0011_2$, $k_2 = 1100_2$, $k_3 = 1101_2$.
For Thread $i = 0$, determine the range direction $d$ and range $[l, r]$.

**Solution:**
1. Key at $i = 0$: $k_0 = 0010_2$.
2. Left neighbor $i - 1 = -1$ (does not exist):
   $$\delta(0, -1) = -1$$
3. Right neighbor $i + 1 = 1$:
   $$k_0 \oplus k_1 = 0010 \oplus 0011 = 0001_2 \implies \delta(0, 1) = 3\text{ leading zeros}$$
4. Direction $d$:
   $$d = \text{sign}(\delta(0, 1) - \delta(0, -1)) = \text{sign}(3 - (-1)) = \text{sign}(+4) = +1$$
   The cluster expands to the right!
5. Minimum prefix:
   $$\delta_{\min} = \delta(0, -1) = -1$$
6. Search range boundary:
   Compare $k_0$ with all right elements:
   - $\delta(0, 1) = 3 > -1$ (Matches).
   - $\delta(0, 2) = \text{clz}(0010 \oplus 1100) = \text{clz}(1110) = 0 > -1$ (Matches).
   - $\delta(0, 3) = \text{clz}(0010 \oplus 1101) = \text{clz}(1111) = 0 > -1$ (Matches).
   - Right bound reaches end of array: $j = 3$.
7. The range for Root Node 0 is $[l, r] = [0, 3]$ (the entire array!).

---

### Worked Example 9.5: Karras Split Point $\gamma$ Calculation
**Problem:** In Example 9.4, for node with range $[l, r] = [0, 3]$:
$k_0 = 0010_2, k_1 = 0011_2, k_2 = 1100_2, k_3 = 1101_2$.
Find the split point $\gamma$ that partitions $[0, 3]$ into Left child $[0, \gamma]$ and Right child $[\gamma + 1, 3]$.

**Solution:**
1. Compute node prefix:
   $$\delta_{\text{node}} = \delta(l, r) = \delta(0, 3) = \text{clz}(0010 \oplus 1101) = \text{clz}(1111) = 0$$
   The node prefix length is $0$ (the root level).
2. We seek the split point $\gamma \in [0, 2]$ such that $\delta(0, \gamma) > \delta_{\text{node}} = 0$:
   - For $t = 0$: $\delta(0, 0) = \infty > 0$.
   - For $t = 1$: $\delta(0, 1) = \text{clz}(0010 \oplus 0011) = 3 > 0$.
   - For $t = 2$: $\delta(0, 2) = \text{clz}(0010 \oplus 1100) = 0 \not> 0$.
3. The furthest index where $\delta(0, t) > 0$ is $t = 1$.
   Therefore:
   $$\gamma = 1$$
4. Children assignment:
   - Left Child range: $[0, 1]$. Since $l = 0 \neq \gamma = 1$, Left child is **Internal Node 0**.
   - Right Child range: $[2, 3]$. Since $\gamma + 1 = 2 \neq r = 3$, Right child is **Internal Node 2**.
   The root splits perfectly into $\{0, 1\}$ and $\{2, 3\}$!

---

### Worked Example 9.6: Spatial Locality of Morton Curve
**Problem:** Two points in $[0, 1]^2$ are $\mathbf{A} = (0.49, 0.49)$ and $\mathbf{B} = (0.51, 0.51)$.
Their Euclidean distance is $\|\mathbf{A} - \mathbf{B}\| = \sqrt{0.02^2 + 0.02^2} \approx 0.028$ (very close!).
Quantize to 4 bits ($X, Y \in [0, 15]$) and show how the Morton codes illustrate the "boundary jump" phenomenon.

**Solution:**
1. Quantization ($B = 16$):
   $$\mathbf{A}: X_A = \lfloor 0.49 \times 16 \rfloor = 7 = 0111_2, \quad Y_A = \lfloor 0.49 \times 16 \rfloor = 7 = 0111_2$$
   $$\mathbf{B}: X_B = \lfloor 0.51 \times 16 \rfloor = 8 = 1000_2, \quad Y_B = \lfloor 0.51 \times 16 \rfloor = 8 = 1000_2$$
2. Interleaved Morton codes:
   $$\text{Morton}_A = (y_3 x_3 y_2 x_2 y_1 x_1 y_0 x_0)_2 = 00111111_2 = 63_{10}$$
   $$\text{Morton}_B = 11000000_2 = 192_{10}$$
3. Difference in Morton space:
   $$|\text{Morton}_A - \text{Morton}_B| = 192 - 63 = 129$$
   Even though $\mathbf{A}$ and $\mathbf{B}$ are separated by only $0.028$ in space, they cross the primary quadrant boundary ($x = 0.5, y = 0.5$).
   In Morton space, their keys are separated by 129 units! This boundary jump is the primary cause of LBVH quality degradation compared to SAH.

---

### Worked Example 9.7: GPU Radix Sort Prefix Sum
**Problem:** An array of 4 items has keys: $K = [2, 1, 2, 0]$.
Trace the first pass of an LSD Radix Sort using 2-bit digits ($D \in \{0, 1, 2, 3\}$).

**Solution:**
1. Count histogram:
   - Bucket 0: 1 item (key 0)
   - Bucket 1: 1 item (key 1)
   - Bucket 2: 2 items (keys 2, 2)
   - Bucket 3: 0 items
   $$\text{Histogram} = [1, 1, 2, 0]$$
2. Prefix sum (Offsets in output array):
   $$\text{Offsets} = [0, 1, 2, 4]$$
3. Scatter items into output array:
   - $K[0] = 2 \implies$ Place at Offset[2] ($= 2$). Increment Offset[2] $\to 3$.
   - $K[1] = 1 \implies$ Place at Offset[1] ($= 1$). Increment Offset[1] $\to 2$.
   - $K[2] = 2 \implies$ Place at Offset[2] ($= 3$). Increment Offset[2] $\to 4$.
   - $K[3] = 0 \implies$ Place at Offset[0] ($= 0$). Increment Offset[0] $\to 1$.
4. Output array:
   $$K_{\text{sorted}} = [0, 1, 2, 2]$$
   Sorted in a single linear pass without comparisons!

---

### Worked Example 9.8: Quantization Error vs Grid Resolution
**Problem:** Compare the grid cell resolution in physical space for a 30-bit Morton code vs a 63-bit Morton code in a world spanning $L = 10{,}000\text{ meters}$.

**Solution:**
1. **30-Bit Code (10 bits per axis):**
   Grid cells per dimension: $2^{10} = 1{,}024$ cells.
   Cell width:
   $$\Delta x_{30} = \frac{10{,}000\text{ m}}{1{,}024} \approx 9.765\text{ meters}$$
   Any two objects closer than $\approx 10\text{ meters}$ receive identical Morton coordinates!
2. **63-Bit Code (21 bits per axis):**
   Grid cells per dimension: $2^{21} = 2{,}097{,}152$ cells.
   Cell width:
   $$\Delta x_{63} = \frac{10{,}000\text{ m}}{2{,}097{,}152} \approx 0.004768\text{ meters} = 4.77\text{ millimeters!}$$
   A 63-bit code resolves positions down to $4.7\text{ mm}$ over a $10\text{ km}$ world!

---

### Worked Example 9.9: Karras Algorithm Memory Allocation
**Problem:** For $N = 1{,}000{,}000$ primitives, calculate the total memory required by the Karras algorithm to store:
(a) Morton codes array (32-bit integers).
(b) Primitive indices array (32-bit integers).
(c) Internal node array ($N - 1$ nodes, each storing left child, right child, and parent pointer as 32-bit integers).
(d) Atomic flag array ($N - 1$ 32-bit integers).

**Solution:**
1. Morton codes: $10^6 \times 4\text{ bytes} = 4\text{ MB}$.
2. Primitive indices: $10^6 \times 4\text{ bytes} = 4\text{ MB}$.
3. Internal nodes: $(10^6 - 1) \times 3 \times 4\text{ bytes} \approx 12\text{ MB}$.
4. Atomic flags: $(10^6 - 1) \times 4\text{ bytes} \approx 4\text{ MB}$.
Total Working Memory:
$$\text{RAM} = 4 + 4 + 12 + 4 = 24.0\text{ Megabytes}$$
The entire GPU working buffer for 1 million primitives fits into $24\text{ MB}$ of VRAM!

---

### Worked Example 9.10: Lock-Free Atomic Tree Reduction
**Problem:** In the bottom-up bounding box aggregation pass, Thread A handles the left child and Thread B handles the right child of internal node $K$.
Explain step by step how an atomic increment flag `atomicAdd(&flags[K], 1)` coordinates the two threads without race conditions or deadlocks.

**Solution:**
1. Node flag is initialized to `0`: `flags[K] = 0`.
2. Suppose Thread A finishes its subtree first. It executes:
   `val = atomicAdd(&flags[K], 1);`
   Hardware increments `flags[K]` from $0$ to $1$ atomically.
   Thread A receives return value `val = 0`.
   Since `val == 0`, Thread A knows it is the **first thread to arrive**. Its sibling (Thread B) is still working. Thread A exits the loop and terminates!
3. Later, Thread B finishes the right subtree. It executes:
   `val = atomicAdd(&flags[K], 1);`
   Hardware increments `flags[K]` from $1$ to $2$.
   Thread B receives return value `val = 1`.
   Since `val == 1`, Thread B knows **both children are completely finished**!
4. Thread B merges the left and right bounding boxes into node $K$, and continues walking up to the grandparent.
   Result: Perfect synchronization with zero mutexes or locks!

---

## 9.7 Ten Granular Solved Exercises

### Exercise 9.1: Invariance of Morton Order Under Uniform Scaling
**Problem:** If the entire scene is scaled uniformly by factor $S > 0$, prove that the Morton codes and sorted order of primitive centroids remain unchanged.

**Solution:**
1. Scaled coordinates: $\mathbf{x}' = S \mathbf{x}$.
2. Scaled bounds: $\min' = S \min, \max' = S \max$.
3. Normalized coordinates:
   $$u_x' = \frac{S c_x - S \min_x}{S \max_x - S \min_x} = \frac{S(c_x - \min_x)}{S(\max_x - \min_x)} = u_x$$
4. Normalized coordinates are identical, so integer quantizations and Morton codes are invariant. $\blacksquare$

---

### Exercise 9.2: Hardware Instruction for CLZ
**Problem:** What hardware instruction does x86-64 provide for Count Leading Zeros?

**Solution:**
x86-64 provides the `LZCNT` (Leading Zero Count) instruction, introduced in the BMI1 instruction set, executing in 1 clock cycle.

---

### Exercise 9.3: Tie-Breaking in Identical Morton Codes
**Problem:** If two primitives have identical centroids (identical Morton codes $k_i == k_j$), why does $\delta(i, j) = 32 + \text{clz}(i \oplus j)$ break ties deterministically?

**Solution:**
Because array indices $i \neq j$ are strictly unique, $i \oplus j \neq 0$. Adding 32 places the tie-breaker below any actual bit match while ensuring strict inequality $\delta(i, j) > 32$.

---

### Exercise 9.4: Radix Sort Cache Coherence
**Problem:** In GPU radix sort, why are local block histograms stored in shared memory (`__shared__`)?

**Solution:**
Shared memory on GPUs operates as a low-latency user-managed L1 cache ($1\text{ to }2$ cycles), avoiding high-latency global VRAM round-trips during histogram bin counting.

---

### Exercise 9.5: Hilbert vs Morton Curve Locality Comparison
**Problem:** Why does the Hilbert curve achieve better spatial locality than the Morton curve?

**Solution:**
The Hilbert curve is continuous (it never makes diagonal or long-distance jumps across quadrant boundaries), whereas the Morton curve contains discontinuous jumps across the center plane.

---

### Exercise 9.6: Morton Code Bit Reversal
**Problem:** If the bit order in the dilation is changed from $(Z, Y, X)$ to $(X, Y, Z)$, how does the spatial traversal order change?

**Solution:**
The traversal hierarchy changes its primary subdivision axis from Z to X, producing an isomorphic space-filling curve rotated by $90^\circ$.

---

### Exercise 9.7: Karras Direction Formula Proof
**Problem:** Prove that $d = \text{sign}(\delta(i, i+1) - \delta(i, i-1))$ correctly points toward the side with the higher common prefix.

**Solution:**
If $\delta(i, i+1) > \delta(i, i-1)$, key $i$ shares more identical leading bits with $i+1$ than with $i-1$. Therefore, key $i$ belongs to the same hierarchical subtree as $i+1$, requiring search direction $d = +1$. $\blacksquare$

---

### Exercise 9.8: Leaf Offset vs Pointer Bit Packing
**Problem:** In 32-bit indices, how can the most significant bit (MSB) distinguish between leaf nodes and internal nodes?

**Solution:**
Set `node.childIndex = isLeaf ? (primIndex | 0x80000000) : internalNodeIndex`.
Testing `if (childIndex & 0x80000000)` checks leaf status in a single bitwise instruction!

---

### Exercise 9.9: SIMD Vectorized Morton Encoding
**Problem:** How can 4 primitive centroids be encoded into Morton codes simultaneously using 128-bit SIMD registers?

**Solution:**
Load four X, Y, Z coordinates into three SSE registers (`__m128`). Perform bit shifts and bitwise ORs across the vectors in parallel, generating 4 Morton codes in $\sim 15$ SIMD instructions.

---

### Exercise 9.10: Re-Fitting vs Re-Building with LBVH
**Problem:** Why do dynamic game physics engines prefer rebuilding an entire GPU LBVH from scratch every frame rather than refitting bounding boxes?

**Solution:**
Because generating Morton codes and running GPU Radix Sort takes $<1\text{ ms}$ for $100{,}000$ objects, rebuilding from scratch avoids the tree degradation and bounding box bloat caused by refitting!

---

## 9.8 Chapter Summary and Bridge to Chapter 10

In this chapter, we explored the high-performance frontier of parallel spatial partitioning:
1. **Dimension Reduction:** Mapped 3D space to 1D using the Morton space-filling curve.
2. **Bitwise Dilation:** Implemented magic bitmask algorithms to interleave coordinates in microseconds.
3. **Linear Radix Sort:** Transformed hierarchical clustering into an $\mathcal{O}(N)$ integer sort.
4. **The Tero Karras Algorithm:** Formulated the lock-free parallel tree construction algorithm using common prefix metrics $\delta(i, j)$ and atomic bottom-up reductions.

However, in interactive simulations and physics engines, many objects move continuously frame-to-frame. Rebuilding the entire tree every frame—even on a GPU—wastes energy. In **Chapter 10: Dynamic Bounding Volume Trees and Tree Refitting**, we investigate how physics engines maintain and adapt dynamic trees in real-time through incremental refitting, node fattening margins, and tree rotations.
