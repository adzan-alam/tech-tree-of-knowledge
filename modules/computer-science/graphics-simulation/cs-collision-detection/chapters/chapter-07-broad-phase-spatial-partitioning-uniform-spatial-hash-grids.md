# Chapter 7: Broad-Phase Spatial Partitioning: Uniform Spatial Hash Grids

> *"If you test every object against every other object, space is treated as an unstructured void, and computation scales with the square of entity count. But physical reality is strictly local: an apple falling in London cannot collide with a teacup in Tokyo. By discretizing the spatial continuum into a lattice of hashed bins, we tame the quadratic monster into linear time."*

---

### Conceptual Architecture: The Spatial Hash Grid Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   CONTINUOUS 2D SIMULATION WORLD: N ENTITIES                             │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Cell Dimension Δs = 2 · r_max
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STEP 1: CONTINUOUS-TO-DISCRETE LATTICE MAPPING                              │
│                                                                                          │
│   • Integer Cell Indices: i = ⌊ x / Δs ⌋,   j = ⌊ y / Δs ⌋  (Floor handles negatives!)   │
│   • 32-Bit Bit-Packing:   Key = ((i & 0xFFFF) << 16) | (j & 0xFFFF)                      │
│   • Prime Hashing:        Hash = ((i · p_1) ⊕ (j · p_2)) mod M                           │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Entity AABB Grid Footprints
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STEP 2: MULTI-CELL INSERTION & CONTIGUOUS CACHE PACKING                     │
│                                                                                          │
│   • AABB Cell Range: i ∈ [ ⌊min_x/Δs⌋, ⌊max_x/Δs⌋ ],  j ∈ [ ⌊min_y/Δs⌋, ⌊max_y/Δs⌋ ]     │
│   • Two-Pass Prefix Sum Array: Zero heap allocations, 100% L1/L2 cache hit rate          │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Raw Pair Matches in Cells
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STEP 3: DUPLICATE PAIR DEDUPLICATION                                        │
│                                                                                          │
│   • Large objects occupy multiple adjacent cells!                                        │
│   • Deduplication: Hash set of 64-bit packed IDs: PairID = (min(id_A, id_B) << 32)       │
│                                                          | max(id_A, id_B)               │
│   • Emits EXACTLY ONE check per interacting entity pair!                                 │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Candidate Pairs: k ≈ O(N)
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                      FORWARD CANDIDATES TO NARROW-PHASE SAT                              │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.1 The Spatial Locality Principle & Grid Mechanics

In any physical simulation, interactions are fundamentally **spatially bounded**: a body with maximum bounding radius $r_{\max}$ can only collide with bodies located within distance $2 r_{\max}$.

A **Uniform Spatial Grid** partitions continuous Euclidean space $\mathbb{R}^2$ into a regular, non-overlapping tessellation of square bins (cells) of uniform side length $\Delta s > 0$.

### 7.1.1 The Golden Cell Size Heuristic
The selection of the grid cell size $\Delta s$ dictates the performance and memory footprint of the broad phase:

```
Cell Size Tuning Trade-Offs

   A. Cell Size Too Small (Δs << 2 r_max):     B. Cell Size Optimal (Δs ≈ 2 r_max):
      ┌───┬───┬───┬───┐                           ┌───────┬───────┐
      │   │ *─┼─* │   │                           │  *──* │       │
      ├───┼───┼───┼───┤                           │  │  │ │       │
      │   │ *─┼─* │   │                           │  *──* │       │
      └───┴───┴───┴───┘                           └───────┴───────┘
      Single entity spans dozens of cells!        Entity spans at most 1 to 4 cells!
      Massive insertion & memory overhead.        Optimal culling & minimum duplicates.

   C. Cell Size Too Large (Δs >> 2 r_max):
      ┌───────────────────────────────┐
      │   ●   ●   ●   ●   ●   ●   ●   │
      │   ●   ●   ●   ●   ●   ●   ●   │  Too many bodies crowd into each cell!
      └───────────────────────────────┘  Reverts to O(N^2) pairwise brute force!
```

1. **The Theoretical Lower Bound:**
   If $\Delta s < 2 r_{\max}$, a single large body spans dozens of grid cells, exploding insertion costs and generating massive duplicate pair checks.
2. **The Theoretical Upper Bound:**
   If $\Delta s \gg 2 r_{\max}$, each cell becomes an enormous bucket containing hundreds of distant bodies, degenerating back into $\mathcal{O}(N^2)$ brute-force comparisons.

The mathematically optimal cell size for a particle system with maximum radius $r_{\max}$ is:
$$\Delta s \approx 2 r_{\max} \quad \text{to} \quad 4 r_{\max}$$

---

## 7.2 Continuous-to-Discrete Lattice Mapping

To insert an entity at floating-point world coordinate $\mathbf{x} = [x, y]^T \in \mathbb{R}^2$ into the grid, we must map continuous space to a pair of discrete integer cell coordinates $(i, j) \in \mathbb{Z}^2$.

### 7.2.1 The Negative Coordinate Floor Trap
A notorious bug in naive physics engine implementations is integer truncation toward zero:
```c
// BUGGY IMPLEMENTATION!
int i = (int)(x / cell_size);
```
In C, C++, and JavaScript bitwise operations (`| 0`), casting a negative float truncates toward zero:
- $+0.8 / 1.0 = +0.8 \to 0$
- $-0.8 / 1.0 = -0.8 \to 0$

Both $+0.8$ and $-0.8$ map into cell index `0`! Cell `0` becomes double the size of all other cells, corrupting neighbor queries and causing objects crossing $x = 0$ to vanish from the grid.

**The Mathematically Correct Floor Mapping:**
The conversion must strictly use the mathematical floor function $\lfloor \cdot \rfloor$:
$$i = \left\lfloor \frac{x}{\Delta s} \right\rfloor, \quad j = \left\lfloor \frac{y}{\Delta s} \right\rfloor$$
- For $x = +0.8\text{ m}$ ($\Delta s = 1.0$): $\lfloor 0.8 \rfloor = 0$
- For $x = -0.8\text{ m}$ ($\Delta s = 1.0$): $\lfloor -0.8 \rfloor = -1$
Every cell spans exactly $[k \Delta s, (k + 1)\Delta s)$, preserving translational symmetry across the origin.

---

## 7.3 Spatial Hash Functions & Bit-Packing

In an open-world simulation, entities can roam across vast distances ($x, y \in [-10^5, +10^5]$). Storing a 2D array of $200,000 \times 200,000$ cells requires 160 gigabytes of memory, which is completely unfeasible.

We have two primary mathematical architectures to map 2D integer cell coordinates $(i, j)$ into memory:

### 7.3.1 Architecture A: Coordinate Bit-Packing (Bounded Worlds)
If the coordinate indices can be bounded within a 16-bit signed integer range ($-32,768 \le i, j \le 32,767$):
We mask and bit-shift the two 16-bit integers into a single 32-bit unsigned integer key:
$$\text{Key}(i, j) = ((i \ \& \ \text{0xFFFF}) \ll 16) \ \vert \ (j \ \& \ \text{0xFFFF})$$

This key is **100% collision-free**: every unique 2D cell coordinate maps to a distinct 32-bit integer, which can be stored in a standard fast hash table (`std::unordered_map` or JavaScript `Map`).

### 7.3.2 Architecture B: Prime Hashing (Unbounded Worlds)
Matthias Teschner et al. (2003) formulated a spatial hash function that maps infinite 2D/3D integer coordinates into a fixed-size hash table of $M$ buckets using large prime multipliers:
$$\text{Hash}(i, j) = \left( (i \cdot p_1) \oplus (j \cdot p_2) \right) \bmod M$$
where canonical primes are:
$$p_1 = 73,856,093, \quad p_2 = 19,349,663$$
and $M$ is typically chosen as a power of two or a prime number (e.g., $M = 2^{16} = 65,536$).
When $M = 2^K$, the modulo operation reduces to an ultra-fast bitwise AND:
$$\text{Hash}(i, j) = \left( (i \cdot 73856093) \oplus (j \cdot 19349663) \right) \ \& \ (M - 1)$$
This executes in just 4 CPU clock cycles with zero divisions.

---

## 7.4 Multi-Cell Footprints & Duplicate Pair Elimination

Because physical entities have finite geometric extent, an entity rarely fits inside a single cell; its bounding box $[\mathbf{min}, \mathbf{max}]$ generally straddles multiple adjacent grid bins.

### 7.4.1 Bounding Grid Footprint Range
For an entity with AABB $\mathbf{min} = [x_{\min}, y_{\min}]^T$ and $\mathbf{max} = [x_{\max}, y_{\max}]^T$:
$$i_{\min} = \left\lfloor \frac{x_{\min}}{\Delta s} \right\rfloor, \quad i_{\max} = \left\lfloor \frac{x_{\max}}{\Delta s} \right\rfloor$$
$$j_{\min} = \left\lfloor \frac{y_{\min}}{\Delta s} \right\rfloor, \quad j_{\max} = \left\lfloor \frac{y_{\max}}{\Delta s} \right\rfloor$$

The entity is inserted into every cell $(i, j)$ in the rectangular Cartesian product:
$$\text{Cells}(A) = \{ (i, j) : i_{\min} \le i \le i_{\max} \land j_{\min} \le j \le j_{\max} \}$$
The total number of cells occupied is $(i_{\max} - i_{\min} + 1) \times (j_{\max} - j_{\min} + 1)$. For a well-tuned grid ($\Delta s \ge 2 r_{\max}$), this footprint is almost always $1, 2,$ or $4$ cells.

```
Multi-Cell Overlap and the Duplicate Pair Hazard

   ┌───────────────┬───────────────┐
   │ Cell (0, 1)   │ Cell (1, 1)   │
   │      ┌────────┼────────┐      │
   │      │ Body A │ Body B │      │
   ├──────┼────────┼────────┼──────┤
   │      │        │        │      │
   │      └────────┼────────┘      │
   │ Cell (0, 0)   │ Cell (1, 0)   │
   └───────────────┴───────────────┘
   Body A and Body B meet in Cell (0,0), Cell (1,0), Cell (0,1), and Cell (1,1)!
   Without deduplication, pair (A, B) is checked 4 times!
```

### 7.4.2 The 64-Bit Packed Pair Deduplication Invariant
If two entities $A$ and $B$ both span multiple shared cells, an un-indexed grid loop will encounter the pair $(A, B)$ multiple times, wasting narrow-phase compute cycles.

To ensure **every unique interacting pair is evaluated exactly once**, high-performance engines maintain a candidate pair set.
Each unique unordered pair of entity IDs $(id_A, id_B)$ is uniquely hashed into a 64-bit unsigned integer:
$$id_{\text{first}} = \min(id_A, id_B), \quad id_{\text{second}} = \max(id_A, id_B)$$
$$\text{PairKey} = (id_{\text{first}} \ll 32) \ \vert \ id_{\text{second}}$$

When iterating through entities within a cell:
1. Formulate $\text{PairKey}$.
2. Query the hash set of processed pairs.
3. If $\text{PairKey}$ has already been added, **skip it**.
4. If not present, insert $\text{PairKey}$ and forward the pair to narrow-phase SAT.

---

## 7.5 Two-Pass Contiguous Array Grid Architecture

Standard hash tables with linked lists (`std::list`, node chaining) suffer from extreme memory fragmentation: every cell insertion allocates a small heap node, and traversing cell buckets triggers severe L1/L2 cache misses.

Production game engines (such as Box2D and PhysX) utilize a **Two-Pass Prefix-Sum Flat Buffer** that operates with zero memory allocations per tick and guarantees $100\%$ contiguous memory reads:

```
Two-Pass Flat Buffer Memory Layout

  1. Cell Counts Array (Size M):
     [ 2, 0, 3, 1, ... ]  (Count of entities per cell)
     
  2. Prefix Sum Offsets Array (Size M + 1):
     [ 0, 2, 2, 5, 6, ... ]  (Starting index in contiguous entity buffer)
     
  3. Contiguous Entity Buffer (Size Total Insertions):
     [ Ent_0, Ent_1 | Ent_2, Ent_3, Ent_4 | Ent_5 ... ]
     ^ Cell 0       ^ Cell 2               ^ Cell 3
     
  ALL MEMORY READS ARE 100% LINEAR AND STREAM THROUGH CPU L1 CACHE!
```

1. **Pass 1 (Counting):** Loop through all entities; calculate footprint cells; increment `cell_counts[cell_hash]`.
2. **Prefix Sum (Offsets):** Compute running sum of counts to establish the exact slice bounds for every cell in a single pre-allocated flat array.
3. **Pass 2 (Populate):** Re-loop through entities; append entity references into the flat array at `cell_offsets[cell_hash]++`.
4. **Collision Query:** Loop linearly through each non-empty slice of the flat array; check entities sharing that contiguous memory range.

This data-oriented architecture runs up to $12\times$ faster than pointer-based hash tables, processing hundreds of thousands of particle checks per millisecond.

---

## 7.6 Progressive Numerical Worked Examples

---

### Worked Example 7.1: Continuous Coordinate Mapping and Negative Floor Trap
**Problem Statement:** A spatial grid has cell size $\Delta s = 2.50\text{ m}$.
Convert the following six world-space coordinates into their integer cell coordinates $(i, j)$:
1. $\mathbf{x}_1 = [6.20, 4.10]^T\text{ m}$
2. $\mathbf{x}_2 = [0.00, 0.00]^T\text{ m}$
3. $\mathbf{x}_3 = [-0.10, 3.80]^T\text{ m}$
4. $\mathbf{x}_4 = [-2.50, -2.50]^T\text{ m}$
5. $\mathbf{x}_5 = [-2.51, -5.00]^T\text{ m}$
6. $\mathbf{x}_6 = [-7.49, -7.50]^T\text{ m}$

Show the result using mathematically correct floor $\lfloor x / \Delta s \rfloor$ versus buggy truncation `(int)(x / cell_size)`.

**Step-by-Step Mathematical Solution:**

**Step 1: Evaluating with true mathematical floor $\lfloor x / 2.5 \rfloor$.**
- $\mathbf{x}_1 = [6.20, 4.10]^T$:
  $i = \lfloor 6.20 / 2.5 \rfloor = \lfloor 2.48 \rfloor = 2$
  $j = \lfloor 4.10 / 2.5 \rfloor = \lfloor 1.64 \rfloor = 1 \implies \mathbf{(2, 1)}$
- $\mathbf{x}_2 = [0.00, 0.00]^T$:
  $i = \lfloor 0.0 \rfloor = 0, j = \lfloor 0.0 \rfloor = 0 \implies \mathbf{(0, 0)}$
- $\mathbf{x}_3 = [-0.10, 3.80]^T$:
  $i = \lfloor -0.10 / 2.5 \rfloor = \lfloor -0.04 \rfloor = -1$
  $j = \lfloor 3.80 / 2.5 \rfloor = \lfloor 1.52 \rfloor = 1 \implies \mathbf{(-1, 1)}$
- $\mathbf{x}_4 = [-2.50, -2.50]^T$:
  $i = \lfloor -2.50 / 2.5 \rfloor = \lfloor -1.00 \rfloor = -1$
  $j = \lfloor -2.50 / 2.5 \rfloor = \lfloor -1.00 \rfloor = -1 \implies \mathbf{(-1, -1)}$
- $\mathbf{x}_5 = [-2.51, -5.00]^T$:
  $i = \lfloor -2.51 / 2.5 \rfloor = \lfloor -1.004 \rfloor = -2$
  $j = \lfloor -5.00 / 2.5 \rfloor = \lfloor -2.00 \rfloor = -2 \implies \mathbf{(-2, -2)}$
- $\mathbf{x}_6 = [-7.49, -7.50]^T$:
  $i = \lfloor -7.49 / 2.5 \rfloor = \lfloor -2.996 \rfloor = -3$
  $j = \lfloor -7.50 / 2.5 \rfloor = \lfloor -3.00 \rfloor = -3 \implies \mathbf{(-3, -3)}$

**Step 2: Comparison with buggy integer truncation `(int)`.**
Look at $\mathbf{x}_3 = [-0.10, 3.80]^T$:
`int_i = (int)(-0.10 / 2.5) = (int)(-0.04) = 0`!
Truncation maps $-0.10$ into cell `0` instead of `-1`. This falsely merges $[-2.5, 0]$ into the positive cell $[0, 2.5]$, doubling the cell's volume to $5.0\text{ m}$ across the origin.

---

### Worked Example 7.2: Choosing the Optimal Cell Size $\Delta s$
**Problem Statement:** A simulation models a mixture of $N = 10,000$ particles:
- $90\%$ of particles are small pebbles of radius $r_{\min} = 0.10\text{ m}$.
- $10\%$ of particles are boulders of radius $r_{\max} = 1.00\text{ m}$.
1. Evaluate the trade-offs of setting $\Delta s = 2 r_{\min} = 0.20\text{ m}$.
2. Evaluate the trade-offs of setting $\Delta s = 2 r_{\max} = 2.00\text{ m}$.
3. Calculate how many cells a boulder spans when $\Delta s = 0.20\text{ m}$ versus $\Delta s = 2.00\text{ m}$.
4. State the recommended cell size configuration for this bi-modal distribution.

**Step-by-Step Mathematical Solution:**

**Step 1: Analysis for $\Delta s = 0.20\text{ m}$ (pebble-sized cells).**
A pebble has diameter $0.20\text{ m}$ and spans $1$ to $4$ cells.
However, a boulder of radius $r = 1.0\text{ m}$ has diameter $2.0\text{ m}$.
Width in cells: $\frac{2.0\text{ m}}{0.20\text{ m/cell}} = 10\text{ cells}$.
A single boulder covers a footprint of:
$$\text{Footprint} = 11 \times 11 = 121\text{ cells!}$$
Each boulder must be inserted into 121 separate cell buckets. For 1,000 boulders, that requires $121,000$ insertions per frame, flooding memory and triggering massive duplicate pair filtering.

**Step 2: Analysis for $\Delta s = 2.00\text{ m}$ (boulder-sized cells).**
A boulder has diameter $2.0\text{ m}$ and spans at most $2 \times 2 = 4\text{ cells}$.
A pebble of radius $0.10\text{ m}$ spans $1$ cell.
However, a cell of $2.0\text{ m} \times 2.0\text{ m}$ has area $4.0\text{ m}^2$. If pebbles are densely packed, a single cell could hold hundreds of pebbles, increasing pairwise checks within that cell.

**Step 3 & 4: Recommendation.**
In practice, broad-phase performance is far more sensitive to excessive multi-cell insertion overhead than to small internal cluster checks.
Setting $\Delta s = 2 r_{\max} = 2.00\text{ m}$ ensures that **every object in the entire world spans at most 4 cells**, guaranteeing an $\mathcal{O}(N)$ insertion bound.
(For extreme multi-scale environments with $r_{\max} / r_{\min} > 50$, a multi-level hierarchical grid with 2 discrete cell tiers is used).

---

### Worked Example 7.3: Teschner Prime Spatial Hash Calculation
**Problem Statement:** An unbounded simulation world uses the Teschner prime spatial hash with table size $M = 2048$ buckets ($M = 2^{11}$):
$$\text{hash}(i, j) = \left( (i \cdot 73856093) \oplus (j \cdot 19349663) \right) \ \& \ (M - 1)$$
Compute the exact hash bucket index for cell coordinates:
$(i, j) = (14, -8)$.

**Step-by-Step Mathematical Solution:**

**Step 1: Compute $i \cdot p_1$ in 32-bit signed arithmetic.**
$$i = 14, \quad p_1 = 73,856,093$$
$$14 \times 73,856,093 = 1,033,985,302$$
In hexadecimal: `0x3DA1E716`.

**Step 2: Compute $j \cdot p_2$ in 32-bit signed arithmetic.**
$$j = -8, \quad p_2 = 19,349,663$$
$$-8 \times 19,349,663 = -154,797,304$$
In 32-bit two's complement unsigned representation:
$$2^{32} - 154,797,304 = 4,294,967,296 - 154,797,304 = 4,140,169,992$$
In hexadecimal: `0xF6C9F208`.

**Step 3: Bitwise XOR ($\oplus$).**
$$1,033,985,302 \oplus 4,140,169,992 = \text{0x3DA1E716} \oplus \text{0xF6C9F208}$$
Bitwise evaluation:
`0x3DA1E716` = `0011 1101 1010 0001 1110 0111 0001 0110`
`0xF6C9F208` = `1111 0110 1100 1001 1111 0010 0000 1000`
XOR result:
`0xCB68151E` = `1100 1011 0110 1000 0001 0101 0001 1110` = $3,412,596,000$

**Step 4: Bitwise mask with $(M - 1)$.**
$M = 2048 \implies M - 1 = 2047 = \text{0x000007FF}$ (lower 11 bits).
$$\text{hash} = \text{0xCB68151E} \ \& \ \text{0x000007FF} = \text{0x0000051E}$$
In decimal:
$$\text{0x51E} = 5 \times 16^2 + 1 \times 16^1 + 14 \times 16^0 = 5(256) + 16 + 14 = 1280 + 30 = 1310$$
Cell $(14, -8)$ maps to **Bucket 1310**.

---

### Worked Example 7.4: 32-Bit Coordinate Bit-Packing and Unpacking
**Problem Statement:** In a bounded grid, cell coordinates $(i, j)$ with $i, j \in [-32768, 32767]$ are packed into a single 32-bit integer:
$$\text{Key} = ((i \ \& \ \text{0xFFFF}) \ll 16) \ \vert \ (j \ \& \ \text{0xFFFF})$$
1. Pack cell coordinates $(i, j) = (-5, 12)$ into a 32-bit key.
2. Given a packed key `0x000EFFF9`, unpack the coordinates and recover the original $(i, j)$.

**Step-by-Step Mathematical Solution:**

**Step 1: Packing $(i, j) = (-5, 12)$.**
- $i = -5$: In 16-bit two's complement:
  $$65536 - 5 = 65531 = \text{0xFFFB}$$
- $j = 12$: In 16-bit:
  $$12 = \text{0x000C}$$
- Bit-shift and OR:
  $$\text{Key} = (\text{0xFFFB} \ll 16) \ \vert \ \text{0x000C} = \text{0xFFFB0000} \ \vert \ \text{0x0000000C} = \text{0xFFFB000C}$$
In decimal (unsigned 32-bit):
$$\text{0xFFFB000C} = 4,294,639,628$$

**Step 2: Unpacking key `0x000EFFF9`.**
- Extract upper 16 bits for $i$:
  $$\text{raw\_i} = (\text{0x000EFFF9} \gg 16) \ \& \ \text{0xFFFF} = \text{0x000E} = 14$$
  Since $14 < 32768$, $i = +14$.
- Extract lower 16 bits for $j$:
  $$\text{raw\_j} = \text{0x000EFFF9} \ \& \ \text{0xFFFF} = \text{0xFFF9} = 65529$$
  Since $65529 \ge 32768$, convert from two's complement:
  $$j = 65529 - 65536 = -7$$
The unpacked coordinates are **$(i, j) = (14, -7)$**.

---

### Worked Example 7.5: Entity AABB Grid Footprint Traversal
**Problem Statement:** An entity has an AABB defined by:
$\mathbf{min} = [3.20, -1.80]^T\text{ m}$ and $\mathbf{max} = [7.10, 2.30]^T\text{ m}$.
The spatial grid has cell size $\Delta s = 2.00\text{ m}$.
1. Compute the cell index ranges $[i_{\min}, i_{\max}]$ and $[j_{\min}, j_{\max}]$.
2. Calculate the total number of cells occupied.
3. Explicitly enumerate all $(i, j)$ cell coordinates in this footprint.

**Step-by-Step Mathematical Solution:**

**Step 1: Cell index ranges.**
- For $x$:
  $$i_{\min} = \lfloor 3.20 / 2.00 \rfloor = \lfloor 1.60 \rfloor = 1$$
  $$i_{\max} = \lfloor 7.10 / 2.00 \rfloor = \lfloor 3.55 \rfloor = 3$$
- For $y$:
  $$j_{\min} = \lfloor -1.80 / 2.00 \rfloor = \lfloor -0.90 \rfloor = -1$$
  $$j_{\max} = \lfloor 2.30 / 2.00 \rfloor = \lfloor 1.15 \rfloor = 1$$

**Step 2: Total cell count.**
$$N_x = i_{\max} - i_{\min} + 1 = 3 - 1 + 1 = 3\text{ cells}$$
$$N_y = j_{\max} - j_{\min} + 1 = 1 - (-1) + 1 = 3\text{ cells}$$
$$\text{Total Cells} = N_x \times N_y = 3 \times 3 = 9\text{ cells}$$

**Step 3: Enumeration of cell coordinates.**
$$\{ (1, -1), (2, -1), (3, -1), \, (1, 0), (2, 0), (3, 0), \, (1, 1), (2, 1), (3, 1) \}$$
The entity is inserted into these 9 grid buckets.

---

### Worked Example 7.6: Duplicate Pair Elimination via 64-Bit Keys
**Problem Statement:** Two entities overlap in multiple grid cells:
- Entity $A$ (ID: 42) occupies cells: `{(1, 1), (1, 2), (2, 1), (2, 2)}`
- Entity $B$ (ID: 17) occupies cells: `{(1, 2), (2, 2), (3, 2)}`
1. List all shared cells where both entities are present.
2. Show how a naive cell-by-cell loop tests the pair multiple times.
3. Formulate the canonical 64-bit pair key for this pair.
4. Demonstrate how a hash set ensures the narrow-phase test is executed exactly once.

**Step-by-Step Mathematical Solution:**

**Step 1: Shared cells.**
Comparing the two sets:
- $(1, 1)$: Only A
- $(1, 2)$: In both A and B!
- $(2, 1)$: Only A
- $(2, 2)$: In both A and B!
- $(3, 2)$: Only B
Shared cells: **Cell $(1, 2)$ and Cell $(2, 2)$**.

**Step 2: Naive loop duplicate.**
- When iterating entities in Cell $(1, 2)$, the engine sees Entity 42 and Entity 17 $\implies$ tests `(42, 17)`.
- When iterating entities in Cell $(2, 2)$, the engine sees Entity 42 and Entity 17 $\implies$ tests `(42, 17)` a second time!
The expensive narrow-phase SAT test is duplicated.

**Step 3: Canonical 64-bit pair key.**
$$id_{\text{first}} = \min(42, 17) = 17$$
$$id_{\text{second}} = \max(42, 17) = 42$$
$$\text{PairKey} = (17 \ll 32) \ \vert \ 42 = (17 \times 4,294,967,296) + 42 = 73,014,444,074$$

**Step 4: Hash set deduplication.**
- In Cell $(1, 2)$: Query set for `73014444074`. Not found! Add to set, and execute SAT test.
- In Cell $(2, 2)$: Query set for `73014444074`. **Found!** Skip pair immediately without running SAT.
Result: The narrow phase runs exactly once.

---

### Worked Example 7.7: Two-Pass Prefix-Sum Contiguous Array Construction
**Problem Statement:** Six entities are inserted into a 4-cell grid:
- Cell 0 receives: Entity 0, Entity 3
- Cell 1 receives: (empty)
- Cell 2 receives: Entity 1, Entity 2, Entity 4
- Cell 3 receives: Entity 5
1. Construct the `cell_counts` array of size 4.
2. Construct the `cell_offsets` prefix-sum array of size 5.
3. Construct the final contiguous `entity_buffer` array.
4. Show how an iterator queries all entities in Cell 2 in a single contiguous memory slice.

**Step-by-Step Mathematical Solution:**

**Step 1: `cell_counts` array.**
$$\text{cell\_counts} = [2, 0, 3, 1]$$
Total entity references: $2 + 0 + 3 + 1 = 6$.

**Step 2: `cell_offsets` prefix-sum array.**
Initialize `cell_offsets[0] = 0`.
$$\text{cell\_offsets}[1] = \text{cell\_offsets}[0] + \text{cell\_counts}[0] = 0 + 2 = 2$$
$$\text{cell\_offsets}[2] = \text{cell\_offsets}[1] + \text{cell\_counts}[1] = 2 + 0 = 2$$
$$\text{cell\_offsets}[3] = \text{cell\_offsets}[2] + \text{cell\_counts}[2] = 2 + 3 = 5$$
$$\text{cell\_offsets}[4] = \text{cell\_offsets}[3] + \text{cell\_counts}[3] = 5 + 1 = 6$$
$$\text{cell\_offsets} = [0, 2, 2, 5, 6]$$

**Step 3: Contiguous entity buffer.**
Populating entries sequentially:
$$\text{entity\_buffer} = [ \underbrace{0, 3}_{\text{Cell 0}}, \ \underbrace{1, 2, 4}_{\text{Cell 2}}, \ \underbrace{5}_{\text{Cell 3}} ]$$

**Step 4: Querying Cell 2.**
To read all entities in Cell 2:
$$\text{start} = \text{cell\_offsets}[2] = 2$$
$$\text{end} = \text{cell\_offsets}[3] = 5$$
Length: $5 - 2 = 3\text{ entities}$.
The engine slices `entity_buffer[2..5]`, reading `[1, 2, 4]` directly from contiguous cache memory with zero pointer dereferences!

---

### Worked Example 7.8: Hash Collision Handling in Fixed-Size Tables
**Problem Statement:** A fixed-size hash table has $M = 16$ buckets.
Two distant cells map to the exact same bucket:
- Cell $A = (3, 4) \implies \text{Hash} = 7$
- Cell $B = (19, 12) \implies \text{Hash} = 7$
Entity 10 is inside Cell $A$. Entity 99 is inside Cell $B$.
1. If the engine iterates Bucket 7 naively, what false candidate pair is generated?
2. How does storing the full cell coordinate $(i, j)$ alongside the entity reference in the bucket prevent this false pair?

**Step-by-Step Mathematical Solution:**

**Step 1: Naive bucket collision.**
If buckets store only entity IDs:
Bucket 7 contains `[Entity 10, Entity 99]`.
The engine tests `(Entity 10, Entity 99)` for collision.
However, Entity 10 is near world coordinate $(3 \times 2, 4 \times 2) = (6, 8)$, while Entity 99 is near $(19 \times 2, 12 \times 2) = (38, 24)$.
They are separated by over $35\text{ meters}$! This is a **hash collision false pair**.

**Step 2: Coordinate tagging resolution.**
Each bucket entry stores a tuple `(entity_id, cell_i, cell_j)`:
Bucket 7 stores:
- `Entry 1: (id: 10, i: 3, j: 4)`
- `Entry 2: (id: 99, i: 19, j: 12)`
Before emitting a candidate pair, the engine checks:
$$\text{if } (\text{entry}_1.i == \text{entry}_2.i \land \text{entry}_1.j == \text{entry}_2.j)$$
Because $(3, 4) \ne (19, 12)$, the engine recognizes that the two entities belong to different spatial cells and skips the pair immediately without invoking narrow-phase SAT.

---

### Worked Example 7.9: Complexity Benchmarking: Brute Force vs Spatial Grid
**Problem Statement:** A simulation contains $N = 1000$ circular particles of radius $r = 0.50\text{ m}$ uniformly distributed in a $40\text{ m} \times 40\text{ m}$ square arena.
The spatial grid cell size is $\Delta s = 2.0\text{ m}$ (total $20 \times 20 = 400\text{ cells}$).
1. Calculate the number of pairs tested by naive all-pairs brute force.
2. Calculate the average particle density per cell $\bar{n} = N / N_{\text{cells}}$.
3. Calculate the average pairwise checks per cell $\binom{\bar{n}}{2}$, and total pairwise checks across all 400 cells.
4. Compute the speedup factor of the spatial grid over brute force.

**Step-by-Step Mathematical Solution:**

**Step 1: Naive all-pairs checks.**
$$P_{\text{naive}} = \frac{N(N - 1)}{2} = \frac{1000 \times 999}{2} = 499,500\text{ checks}$$

**Step 2: Average density per cell.**
$$\bar{n} = \frac{1000\text{ particles}}{400\text{ cells}} = 2.50\text{ particles/cell}$$

**Step 3: Pairwise checks per cell and total checks.**
Within each cell:
$$P_{\text{cell}} = \frac{\bar{n}(\bar{n} - 1)}{2} = \frac{2.5(1.5)}{2} = \frac{3.75}{2} = 1.875\text{ checks/cell}$$
Summing across all $N_{\text{cells}} = 400$ cells:
$$P_{\text{grid}} = 400 \times 1.875 = 750\text{ checks}$$
Accounting for multi-cell boundary overlap (particles spanning adjacent cells, average factor of $\approx 2.0\times$):
$$P_{\text{grid, realistic}} \approx 750 \times 2 = 1,500\text{ candidate pair checks}$$

**Step 4: Speedup factor.**
$$\text{Speedup} = \frac{P_{\text{naive}}}{P_{\text{grid, realistic}}} = \frac{499,500}{1,500} \approx 333\times$$
The spatial grid reduces collision checks from half a million to just 1,500, executing **over 330 times faster**!

---

### Worked Example 7.10: Complete Spatial Hash Grid Simulation Step
**Problem Statement:** An engine executes one complete broad-phase tick for three particles with cell size $\Delta s = 1.0\text{ m}$:
- Particle 0: center $[0.5, 0.5]^T$, radius $0.2\text{ m}$ (AABB: $[0.3, 0.3]^T$ to $[0.7, 0.7]^T$)
- Particle 1: center $[0.8, 0.5]^T$, radius $0.2\text{ m}$ (AABB: $[0.6, 0.3]^T$ to $[1.0, 0.7]^T$)
- Particle 2: center $[4.5, 4.5]^T$, radius $0.2\text{ m}$ (AABB: $[4.3, 4.3]^T$ to $[4.7, 4.7]^T$)
1. Determine the footprint cells for each particle.
2. Insert particles into the grid buckets.
3. Query buckets and emit the deduplicated candidate pair list.

**Step-by-Step Mathematical Solution:**

**Step 1: Particle footprint cells.**
- Particle 0:
  $x \in [0.3, 0.7] \implies i \in [\lfloor 0.3 \rfloor, \lfloor 0.7 \rfloor] = [0, 0]$
  $y \in [0.3, 0.7] \implies j \in [\lfloor 0.3 \rfloor, \lfloor 0.7 \rfloor] = [0, 0]$
  Footprint: `{(0, 0)}`
- Particle 1:
  $x \in [0.6, 1.0] \implies i \in [\lfloor 0.6 \rfloor, \lfloor 1.0 \rfloor] = [0, 1]$
  $y \in [0.3, 0.7] \implies j \in [0, 0]$
  Footprint: `{(0, 0), (1, 0)}` (Spans cell boundary at $x = 1.0$!)
- Particle 2:
  $x \in [4.3, 4.7] \implies i \in [4, 4]$
  $y \in [4.3, 4.7] \implies j \in [4, 4]$
  Footprint: `{(4, 4)}`

**Step 2: Populating grid buckets.**
- Cell `(0, 0)`: Contains `[Particle 0, Particle 1]`
- Cell `(1, 0)`: Contains `[Particle 1]`
- Cell `(4, 4)`: Contains `[Particle 2]`

**Step 3: Pair extraction and deduplication.**
- In Cell `(0, 0)`: Pairs are `(Particle 0, Particle 1)`.
  Packed key: $(0 \ll 32) \,|\, 1 = 1$. Added to candidate set.
- In Cell `(1, 0)`: Only 1 particle $\implies$ zero pairs.
- In Cell `(4, 4)`: Only 1 particle $\implies$ zero pairs.

**Final Broad-Phase Output:** Exactly **1 candidate pair** `(0, 1)`.
Particle 2 is completely isolated and requires zero narrow-phase testing.

---

## 7.7 Chapter Mastery Exercises

### Exercise 7.1 (Tier 1): Cell Coordinate Calculation
With cell size $\Delta s = 4.0\text{ m}$, compute $(i, j)$ for point $\mathbf{p} = [-12.5, 7.9]^T\text{ m}$.

### Exercise 7.2 (Tier 1): AABB Footprint Cell Count
An AABB spans $x \in [1.2, 5.8]$ and $y \in [-3.1, 0.5]$ with cell size $\Delta s = 2.0\text{ m}$.
How many total grid cells does this entity occupy?

### Exercise 7.3 (Tier 2): Prime Hashing Collision Avoidance
Explain why prime numbers (such as $73,856,093$) are chosen as multipliers in spatial hashing rather than powers of two.

### Exercise 7.4 (Tier 2): Bounded Coordinate Key Unpacking
A packed 32-bit key is `0xFFFE0005`. Unpack the signed 16-bit cell coordinates $(i, j)$.

### Exercise 7.5 (Tier 3): Memory Scaling with Entity Count
If an engine uses a dense 2D array of $500 \times 500$ pointer buckets (8 bytes each), compute the baseline memory consumption of the grid regardless of entity count.

### Exercise 7.6 (Tier 3): Prefix Sum Array Offset Verification
Given cell counts $[4, 1, 0, 3, 2]$, construct the prefix-sum array and specify the index range for Cell 3.

### Exercise 7.7 (Tier 4): Optimal Table Size Selection
For a world with $N = 5,000$ entities where each entity occupies an average of $2$ cells, what is the minimum recommended hash table size $M$ to keep the average load factor below $0.5$?

### Exercise 7.8 (Tier 4): Handling Moving Entities in Spatial Grids
When an entity moves from cell $(i_1, j_1)$ to $(i_2, j_2)$, describe the operations required to update its grid presence, and explain why Fat AABBs reduce this update frequency.

### Exercise 7.9 (Tier 5): Parallel Spatial Grid Insertion
In multi-threaded physics engines, multiple worker threads insert entities into the grid simultaneously. Explain how spatial coloring or atomic prefix sums prevent race conditions without global mutex locking.

### Exercise 7.10 (Tier 5): Hierarchical Multi-Level Grids
For a world containing both bullets ($r = 0.05\text{ m}$) and starships ($r = 50.0\text{ m}$), formulate the dual-grid hierarchy and define the rule for detecting cross-tier collisions between fine and coarse levels.

---

## 7.8 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 7.1
$\Delta s = 4.0\text{ m}$, $\mathbf{p} = [-12.5, 7.9]^T\text{ m}$.
$$i = \left\lfloor \frac{-12.5}{4.0} \right\rfloor = \lfloor -3.125 \rfloor = -4$$
$$j = \left\lfloor \frac{7.9}{4.0} \right\rfloor = \lfloor 1.975 \rfloor = 1$$
Cell coordinates: **$(-4, 1)$**.

---

### Solution to Exercise 7.2
$\Delta s = 2.0\text{ m}$.
$x \in [1.2, 5.8] \implies i \in [\lfloor 1.2/2 \rfloor, \lfloor 5.8/2 \rfloor] = [\lfloor 0.6 \rfloor, \lfloor 2.9 \rfloor] = [0, 2] \implies 2 - 0 + 1 = 3\text{ cells}$.
$y \in [-3.1, 0.5] \implies j \in [\lfloor -3.1/2 \rfloor, \lfloor 0.5/2 \rfloor] = [\lfloor -1.55 \rfloor, \lfloor 0.25 \rfloor] = [-2, 0] \implies 0 - (-2) + 1 = 3\text{ cells}$.
Total cells occupied: $3 \times 3 = \mathbf{9\text{ cells}}$.

---

### Solution to Exercise 7.3
If multipliers were powers of two (e.g. $2^{10} = 1024$), multiplying by $i$ would simply bit-shift $i$ to the left.
In bitwise operations, regular grid step patterns (like moving from $i$ to $i+1$) would only toggle the same subset of bits, causing systematic destructive interference and catastrophic clustering in the lower bits of the hash table.
Large prime numbers have no common factors with the table size $M$ or coordinate step sizes, ensuring pseudo-random avalanche dispersion of bits across the entire bucket space.

---

### Solution to Exercise 7.4
Key: `0xFFFE0005`.
- Upper 16 bits ($i$): `0xFFFE` = $65534$.
  Since $65534 \ge 32768$: $i = 65534 - 65536 = -2$.
- Lower 16 bits ($j$): `0x0005` = $+5$.
Unpacked coordinates: **$(i, j) = (-2, 5)$**.

---

### Solution to Exercise 7.5
Number of cells: $500 \times 500 = 250,000\text{ cells}$.
Each bucket pointer requires 8 bytes:
$$\text{Memory} = 250,000 \times 8\text{ bytes} = 2,000,000\text{ bytes} \approx 2.0\text{ MB}$$
This 2.0 MB baseline is allocated even if the world contains zero entities.

---

### Solution to Exercise 7.6
Counts: $[4, 1, 0, 3, 2]$.
Prefix sums:
- `offsets[0] = 0`
- `offsets[1] = 0 + 4 = 4`
- `offsets[2] = 4 + 1 = 5`
- `offsets[3] = 5 + 0 = 5`
- `offsets[4] = 5 + 3 = 8`
- `offsets[5] = 8 + 2 = 10`
Prefix sum array: `[0, 4, 5, 5, 8, 10]`.
For Cell 3: `start = offsets[3] = 5`, `end = offsets[4] = 8`.
Index range in flat entity buffer: **indices 5 to 7** (length 3).

---

### Solution to Exercise 7.7
Total entity insertions: $N \times 2 = 5000 \times 2 = 10,000\text{ entries}$.
To maintain load factor $\lambda = \frac{\text{Entries}}{M} \le 0.5$:
$$M \ge \frac{10000}{0.5} = 20,000\text{ buckets}$$
Choosing the nearest power of two for fast bitwise masking:
$$M = 2^{15} = \mathbf{32,768\text{ buckets}}$$

---

### Solution to Exercise 7.8
When an entity moves:
1. Recompute its current cell footprint.
2. If the new footprint equals the old footprint, do nothing.
3. If changed, remove references from old cells and insert into new cells.
**Fat AABBs:** By expanding the bounding box by velocity displacement $\mathbf{v} \Delta t$ and skin margin $\sigma$, the entity remains inside its expanded box for multiple ticks, eliminating footprint recomputation until the skin margin is fully breached.

---

### Solution to Exercise 7.9
In parallel execution:
1. **Pass 1 (Local Counting):** Each thread counts insertions for its assigned entity chunk into a thread-local count array.
2. **Reduction:** Thread counts are reduced into a global offset array using parallel prefix sum (`std::inclusive_scan`).
3. **Pass 2 (Atomic Insertion):** Each thread writes entity indices into pre-allocated slice ranges using atomic fetch-and-add (`fetch_add`) on the cell offset pointer.
Zero global mutex locks are acquired, enabling linear multi-core scaling.

---

### Solution to Exercise 7.10
A **Multi-Level Spatial Grid** maintains multiple discrete grid tiers:
- Tier 0 (Fine): $\Delta s_0 = 0.10\text{ m}$ (for bullets and debris)
- Tier 1 (Coarse): $\Delta s_1 = 10.0\text{ m}$ (for ships and terrain)
Objects are placed into the tier corresponding to their bounding diameter:
$$\text{Tier}(r) = \lfloor \log_2(2r / \Delta s_0) \rfloor$$
Cross-tier collisions: A coarse entity queries all sub-cells in Tier 0 covered by its footprint, ensuring small and large objects collide without flooding either grid tier. $\blacksquare$
