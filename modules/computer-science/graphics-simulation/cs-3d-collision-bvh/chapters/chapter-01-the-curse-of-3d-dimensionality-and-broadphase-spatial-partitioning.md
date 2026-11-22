# Chapter 1: The Curse of 3D Dimensionality and Broadphase Spatial Partitioning

> *"In two dimensions, we may still imagine filling space with small squares; in three dimensions, space is an immense void wherein matter is the rarest exception. To search every cubic micron for another atom is folly; we must partition the void."*
> — **Christer Ericson**, *Real-Time Collision Detection* (2004)

---

## 1.1 The $\mathcal{O}(N^2)$ All-Pairs Bottleneck

In a physical simulation or interactive 3D virtual environment, collision detection is the primary computational bottleneck. Before a physics solver can apply Newton-Euler impulse dynamics, contact constraints, or Coulomb friction (as established in `phys-rigid-body-3d`), it must answer a deceptively simple question: **which pairs of objects are touching?**

### 1.1.1 The Combinatorial Explosion

Consider a simulation populated by $N$ independent rigid bodies. In the absence of spatial intelligence, the naive brute-force algorithm tests every object against every other object:

$$\text{Pairs}(N) = \binom{N}{2} = \frac{N(N - 1)}{2} = \frac{1}{2}N^2 - \frac{1}{2}N$$

```
All-Pairs Comparison Matrix (N = 6):
        Body 1   Body 2   Body 3   Body 4   Body 5   Body 6
Body 1    --       X        X        X        X        X
Body 2             --       X        X        X        X
Body 3                      --       X        X        X
Body 4                               --       X        X
Body 5                                        --       X
Body 6                                                 --
Total pairwise narrowphase checks: (6 * 5) / 2 = 15 checks
```

As the object count $N$ increases, this quadratic growth $\mathcal{O}(N^2)$ quickly consumes all CPU cycles:

| Object Count $N$ | Total Pairwise Comparisons $\binom{N}{2}$ | Time at $100\text{ ns}$ per Check | Frame Budget ($60\text{ FPS} = 16.6\text{ ms}$) |
| :--- | :--- | :--- | :--- |
| **$10$** | $45$ | $4.5\ \mu\text{s}$ | $0.027\%$ of budget |
| **$100$** | $4{,}950$ | $0.495\text{ ms}$ | $2.98\%$ of budget |
| **$1{,}000$** | $499{,}500$ | $49.95\text{ ms}$ | **$300\%$ (Framerate drops to $20\text{ FPS}$)** |
| **$10{,}000$** | $49{,}995{,}000$ | $5{,}000\text{ ms}$ ($5\text{ seconds}$) | **$30{,}000\%$ (Catastrophic Freeze)** |
| **$100{,}000$** | $4{,}999{,}950{,}000$ | $500\text{ seconds}$ ($8.3\text{ minutes}$) | **Complete Engine Paralysis** |

### 1.1.2 The Hardware Reality: Cache Thrashing and Memory Latency

The catastrophic failure of the naive all-pairs algorithm is magnified on modern computing architectures by the **von Neumann memory wall**:
1. **L1/L2 Cache Eviction:** Randomly fetching geometric vertex data and transformation matrices for $50{,}000{,}000$ pairs causes massive cache miss rates ($>95\%$). The CPU spends over $90\%$ of its cycles stalled, waiting hundreds of nanoseconds for main DRAM memory access.
2. **Branch Misprediction:** Narrowphase intersection tests (such as ray-triangle, GJK simplex searches, or 15-axis SAT tests) contain numerous conditional branches (`if (overlap) ...`). Random pairs in distant corners of the world result in unpredictable branching, constantly flushing CPU instruction pipelines.

To achieve real-time performance ($60\text{ to }144\text{ Hz}$), a 3D engine must decompose collision detection into a **two-phase architecture**:
1. **Broadphase:** An ultra-fast, conservative spatial pruning stage running in $\mathcal{O}(N \log N)$ or $\mathcal{O}(N)$ time that eliminates distant object pairs using simple, cache-friendly bounding volumes.
2. **Narrowphase:** An exact, geometrically rigorous algorithm (GJK, EPA, SAT, Möller-Trumbore) executed **only** on the tiny subset of candidate pairs that pass the broadphase filter.

---

## 1.2 The Curse of Dimensionality: 2D Grids vs. 3D Spatial Voxels

In 2D physics engines (such as Box2D), broadphase acceleration is often achieved using a **uniform spatial grid**. The 2D world is partitioned into a regular lattice of square cells of size $S$. Each object is inserted into the cells it overlaps, and collisions are checked only among objects sharing a common cell.

However, moving from 2D flatland to 3D physical space triggers the **Curse of Dimensionality**.

```
    2D Uniform Grid: O(K^2) Cells              3D Voxel Grid: O(K^3) Cells
       +---+---+---+---+---+                      +---+---+---+
       |   |   | * |   |   |                     /   /   /   /|
       +---+---+---+---+---+                    +---+---+---+ |
       |   | * | * |   |   |                    |   | * |   |/|
       +---+---+---+---+---+                    +---+---+---+ +
       |   |   |   |   |   |                    |   |   | * |/
       +---+---+---+---+---+                    +---+---+---+
    K = 5 -> 25 cells                        K = 5 -> 125 cells!
    K = 1,000 -> 1,000,000 cells             K = 1,000 -> 1,000,000,000 cells!
```

### 1.2.1 Cubic Volume Scaling

Let a cubic simulation domain have side length $L = 1{,}000\text{ meters}$. We choose a cell size $S = 1\text{ meter}$ to match typical object scales.
- In **2D**, the domain requires:
  $$\text{Cells}_{\text{2D}} = \left(\frac{L}{S}\right)^2 = (1{,}000)^2 = 1{,}000{,}000\text{ cells}$$
  At $8\text{ bytes}$ per cell pointer, the grid requires **$8\text{ Megabytes}$** of RAM—easily fitting into modern CPU cache and RAM.
- In **3D**, the domain requires:
  $$\text{Cells}_{\text{3D}} = \left(\frac{L}{S}\right)^3 = (1{,}000)^3 = 1{,}000{,}000{,}000\text{ cells}$$
  At $8\text{ bytes}$ per cell pointer, the grid requires **$8\text{ Gigabytes}$** of RAM just to allocate empty pointers!

### 1.2.2 The Emptiness of Physical Space

Physical space is not uniformly dense. In an open-world simulation, a planetary surface, or an aerospace environment:
- Thousands of objects cluster densely on the terrain surface ($z \approx 0$).
- Space above the terrain is pure vacuum.
- Deep underground is solid, unpopulated matter.

In a 3D uniform voxel grid of $10^9$ cells containing $10^4$ objects, **$99.999\%$ of all cells are completely empty**. Allocating memory for empty vacuum wastes memory and bandwidth.

Furthermore, uniform grids suffer from the **Scale Disparity Dilemma**:
- If cell size $S$ is tuned for tiny objects (e.g., $10\text{ cm}$ pebbles), a large object (e.g., a $100\text{ m}$ airplane) overlaps $1{,}000{,}000$ cells, causing memory allocation explosions during insertion.
- If cell size $S$ is tuned for large objects ($S = 100\text{ m}$), hundreds of small objects land in the same cell, collapsing broadphase back into an $\mathcal{O}(N^2)$ all-pairs bottleneck inside that cell!

---

## 1.3 Flat vs. Hierarchical Spatial Partitioning

To resolve the spatial scaling dilemma, computer scientists devised two distinct paradigms: **Flat Spatial Partitioning** and **Hierarchical Spatial Partitioning**.

```
                           SPATIAL PARTITIONING
                                    |
          +-------------------------+-------------------------+
          |                                                   |
    FLAT PARTITIONING                               HIERARCHICAL TREES
    (Space-Centric)                                  (Object-Centric)
          |                                                   |
  +-------+-------+                                   +-------+-------+
  |               |                                   |               |
Uniform Grid   Spatial Hash                      Octrees / kd-Trees  BVH Trees
[Dense Array]  [Sparse Hash Table]               [Space Division]    [Volume Division]
```

### 1.3.1 Spatial Hashing (Compact Flat Partitioning)

Rather than allocating a dense 3D matrix of size $K \times K \times K$, **Spatial Hashing** maps 3D grid cell coordinates $(i, j, k) \in \mathbb{Z}^3$ into a fixed-size 1D hash table of size $M$ via a prime hash function:

$$\text{hash}(i, j, k) = ((i \cdot p_1) \oplus (j \cdot p_2) \oplus (k \cdot p_3)) \pmod M$$

where $p_1 = 73856093$, $p_2 = 19349663$, $p_3 = 83492791$ are large prime numbers, and $\oplus$ is the bitwise XOR operator.

- **Advantage:** Memory consumption scales linearly with the number of occupied cells $\mathcal{O}(N_{\text{occupied}})$, independent of world dimensions.
- **Drawback:** Spatial hashing remains bound to a single global cell size $S$, failing when objects vary widely in scale (pebbles vs. mountains). Moreover, hash collisions create false positive candidate pairs.

### 1.3.2 Space-Centric Trees: Octrees and kd-Trees

Instead of dividing space uniformly, space-centric trees adaptively subdivide regions of space containing high object density:
1. **Octree:** The root represents the entire bounding cube of the world. If a node contains more than $M_{\text{max}}$ objects, it subdivides into exactly **8 equal octants** ($2 \times 2 \times 2$).
2. **kd-Tree ($k$-dimensional tree):** A binary space partitioning tree where each node splits space along a single coordinate axis ($x$, then $y$, then $z$) at an arbitrary plane coordinate.

**The Fatal Flaw of Space-Centric Trees for Collision Detection:**
In both Octrees and kd-Trees, the **partitioning planes are fixed in space**. When a rigid body straddles a splitting plane, it cannot belong cleanly to one child. It must either:
- Be duplicated across multiple child nodes (wasting memory and causing duplicate collision pair reports).
- Be stored in the non-leaf parent node (causing top-heavy trees where large numbers of objects accumulate at the root, degrading traversal to $\mathcal{O}(N)$).

### 1.3.3 Object-Centric Trees: Bounding Volume Hierarchies (BVH)

To overcome the straddling problem, modern real-time physics engines (Bullet, PhysX, Havok, Box2D) and ray-tracing hardware (NVIDIA RTX, Intel Embree) rely on **Bounding Volume Hierarchies (BVH)**.

In a BVH:
1. Space is **not** partitioned by arbitrary planes. Instead, **objects are clustered into bounding volumes**.
2. Every leaf node encloses one or more physical primitives.
3. Every internal node encloses the **union of the bounding volumes of its children**.
4. Bounding volumes at the same tree level are **allowed to overlap in space**.
5. An object belongs to **exactly one leaf node**—it is never clipped, duplicated, or straddled across boundaries.

```
BVH Hierarchy:
                     [ Root AABB: All Objects ]
                            /          \
              [ Child AABB: L ]      [ Child AABB: R ]
                 /         \             /         \
             Leaf 1      Leaf 2       Leaf 3      Leaf 4
           (Sphere A)  (Box B)      (Mesh C)    (Capsule D)
```

---

## 1.4 Bounding Volume Taxonomy: Tightness vs. Computational Cost

A bounding volume is a geometrically simple closed surface that completely encloses a complex 3D object. Broadphase collision detection tests bounding volumes against one another instead of the underlying geometry.

Selecting the optimal bounding volume requires balancing two competing metrics:
1. **Tightness of Fit:** How closely the volume conforms to the actual object geometry. Loose volumes enclose excess empty space, generating false positive candidate pairs.
2. **Intersection Test Cost:** The number of CPU clock cycles required to determine whether two bounding volumes intersect.

```
TIGHTNESS OF FIT vs. INTERSECTION TEST COST:
=============================================================================
Volume Type        Fit Quality       Overlap Test Cost       Memory per Node
-----------------------------------------------------------------------------
Bounding Sphere    Poorest           Cheapest (1 dist check) 16 bytes (pos + r)
AABB               Moderate          Very Cheap (6 comps)    24 bytes (min, max)
k-DOP (e.g. 14-DOP)Good              Moderate (14 comps)     56 bytes
OBB                Very Good         Expensive (15-axis SAT) 60 bytes (c, u, e)
Convex Hull        Best              Very Expensive (GJK)    Variable (verts)
=============================================================================
```

```
Bounding Volume Comparison for an Elongated Capsule:

  Bounding Sphere:         AABB (Axis-Aligned):         OBB (Oriented):
      .-------.                 +---------------+             .---------.
    .'    |    `.               |       /       |            /    /|     \
   /      |      \              |      /        |           |    / |      |
  |     (===)     |             |     /         |           |   (===)     |
   \      |      /              |    /          |            \     |     /
    `.    |    .'               |   /           |             `---------'
      `-------'                 +---------------+        (Rotates with object;
  (Huge empty space)       (Moderate empty space)         Minimal empty space)
```

### 1.4.1 Bounding Sphere
Defined by center $\mathbf{c} \in \mathbb{R}^3$ and radius $R \in \mathbb{R}$:
$$\text{Sphere} = \{ \mathbf{x} \in \mathbb{R}^3 \mid \|\mathbf{x} - \mathbf{c}\| \le R \}$$
- **Intersection Condition:** Two spheres $A$ and $B$ intersect if and only if the squared distance between centers is less than or equal to the squared sum of their radii:
  $$\|\mathbf{c}_A - \mathbf{c}_B\|^2 \le (R_A + R_B)^2$$
- **Advantages:** Perfectly rotation-invariant! When an object rotates, its bounding sphere does not change at all. The overlap test requires only 9 FLOPs (3 subtractions, 3 multiplications, 2 additions, 1 comparison).
- **Disadvantages:** Terrible fit for elongated, planar, or rod-like objects. A slender rod of length $10\text{ m}$ and thickness $0.1\text{ m}$ has volume $\approx 0.08\text{ m}^3$, but its bounding sphere has volume $\frac{4}{3}\pi (5)^3 \approx 524\text{ m}^3$—enclosing **$6{,}500\times$ more empty space than actual object volume**!

### 1.4.2 Axis-Aligned Bounding Box (AABB)
Defined by minimum and maximum coordinate vectors $\mathbf{min}, \mathbf{max} \in \mathbb{R}^3$:
$$\text{AABB} = \{ \mathbf{x} \in \mathbb{R}^3 \mid \min_i \le x_i \le \max_i, \quad i \in \{x, y, z\} \}$$
- **Intersection Condition:** Two AABBs $A$ and $B$ intersect if and only if they overlap along all three principal axes simultaneously:
  $$\text{Overlap} \iff (A_{\min, x} \le B_{\max, x} \land A_{\max, x} \ge B_{\min, x}) \land (A_{\min, y} \le B_{\max, y} \land A_{\max, y} \ge B_{\min, y}) \land (A_{\min, z} \le B_{\max, z} \land A_{\max, z} \ge B_{\min, z})$$
- **Advantages:** Overlap check requires only 6 scalar comparisons and zero multiplications! Extremely cache-coherent and SIMD-friendly.
- **Disadvantages:** Not rotation-invariant. When an elongated object rotates, its world-space AABB expands and contracts, necessitating dynamic refitting.

### 1.4.3 Oriented Bounding Box (OBB)
Defined by center $\mathbf{c} \in \mathbb{R}^3$, three orthonormal orientation axes $(\mathbf{u}_0, \mathbf{u}_1, \mathbf{u}_2)$, and half-extents $\mathbf{e} = (e_0, e_1, e_2) \in \mathbb{R}^3$:
$$\text{OBB} = \{ \mathbf{c} + h_0 \mathbf{u}_0 + h_1 \mathbf{u}_1 + h_2 \mathbf{u}_2 \mid |h_i| \le e_i \}$$
- **Intersection Condition:** Evaluated via the **15-Axis Separating Axis Theorem (SAT)**.
- **Advantages:** Tightest possible box fit. Rotates rigidly with the body, eliminating empty space.
- **Disadvantages:** High computational cost (evaluating up to 15 projection axes and $\sim 200$ FLOPs per pair).

### 1.4.4 Discrete Oriented Polytopes ($k$-DOP)
A convex bounding volume formed by bounding slabs defined by $k/2$ fixed normal directions.
- For $k = 6$: Directions are the coordinate axes $(\pm x, \pm y, \pm z)$—equivalent to an AABB.
- For $k = 14$: Adds 8 diagonal directions $(\pm 1, \pm 1, \pm 1)$—bevelling the 8 corners of the box.
- For $k = 26$: Adds 12 edge directions $(\pm 1, \pm 1, 0)$—tightly bounding complex organic meshes.

---

## 1.5 The Conservative Bounding Invariant

The entire mathematical architecture of broadphase collision detection rests upon a single, inviolable foundational law:

$$\boxed{\text{Object}_A \cap \text{Object}_B \neq \emptyset \implies \text{BV}_A \cap \text{BV}_B \neq \emptyset}$$

By contrapositive, this implies:

$$\boxed{\text{BV}_A \cap \text{BV}_B = \emptyset \implies \text{Object}_A \cap \text{Object}_B = \emptyset}$$

### 1.5.1 The Asymmetry of Errors

Broadphase algorithms operate under strict error asymmetry:

```
+-----------------------------------------------------------------------------+
|                      BROADPHASE ERROR CLASSIFICATION                        |
+-----------------------------------------------------------------------------+
| 1. FALSE POSITIVE (BV intersects, but Objects do NOT):                      |
|    - Consequence: A harmless temporary waste of narrowphase CPU cycles.     |
|    - Acceptable? YES (Engine remains mathematically sound and robust).      |
+-----------------------------------------------------------------------------+
| 2. FALSE NEGATIVE (Objects intersect, but BV reports NO overlap):           |
|    - Consequence: Objects pass through each other undetected ("Ghosting").  |
|    - Acceptable? NEVER (Fatal simulation failure, physics crash).           |
+-----------------------------------------------------------------------------+
```

Every bounding volume construction algorithm must guarantee that the volume is **strictly conservative**: it must contain every single vertex and surface point of the enclosed geometric primitive at all times.

---

## 1.6 Ten Step-by-Step Worked Examples

### Worked Example 1.1: Combinatorial Scaling and All-Pairs Failure
**Problem:** A physics simulation runs at $60\text{ FPS}$ ($16.667\text{ ms}$ per frame). A narrowphase collision test between two arbitrary convex hulls takes on average $1.2\ \mu\text{s}$ ($1.2 \times 10^{-6}\text{ seconds}$) of CPU time.
Calculate the maximum number of objects $N_{\text{max}}$ that can be simulated using an all-pairs naive check if collision detection is allowed to consume at most $50\%$ of the total frame time budget ($8.333\text{ ms}$).

**Solution:**
1. Available time budget:
   $$T_{\text{avail}} = 8.333\text{ ms} = 8.333 \times 10^{-3}\text{ seconds}$$
2. Maximum allowable number of pairwise tests $P_{\text{max}}$:
   $$P_{\text{max}} = \frac{T_{\text{avail}}}{t_{\text{test}}} = \frac{8.333 \times 10^{-3}\text{ s}}{1.2 \times 10^{-6}\text{ s/test}} \approx 6{,}944.4\text{ tests}$$
3. All-pairs test count relation:
   $$\binom{N}{2} = \frac{N(N - 1)}{2} \le 6{,}944$$
   $$N^2 - N - 13{,}888 = 0$$
4. Solving the quadratic equation for $N$:
   $$N = \frac{1 + \sqrt{1 - 4(1)(-13888)}}{2} = \frac{1 + \sqrt{1 + 55552}}{2} = \frac{1 + \sqrt{55553}}{2} = \frac{1 + 235.697}{2} \approx 118.35$$
5. Rounding down to the nearest integer:
   $$N_{\text{max}} = 118\text{ objects}$$
   Without broadphase spatial partitioning, an all-pairs system drops frames with just $119$ objects!

---

### Worked Example 1.2: 3D Spatial Grid Memory vs. Spatial Hash Memory
**Problem:** A flight simulation spans a cubic airspace of dimensions $20\text{ km} \times 20\text{ km} \times 20\text{ km}$ ($20{,}000\text{ m}$ on each side). The grid cell resolution is set to $S = 25\text{ m}$.
The simulation contains $N = 2{,}500$ aircraft, each occupying on average $4$ grid cells.
(a) Calculate the total memory required to store a dense 3D uniform pointer array (at $8\text{ bytes}$ per pointer).
(b) Calculate the memory required to store the active cells in a dynamic spatial hash table where each entry requires $32\text{ bytes}$.

**Solution:**
1. **(a) Dense Uniform Grid:**
   Number of cells per dimension:
   $$K = \frac{20{,}000\text{ m}}{25\text{ m}} = 800\text{ cells}$$
   Total cells in 3D:
   $$\text{Cells}_{\text{total}} = K^3 = (800)^3 = 512{,}000{,}000\text{ cells}$$
   Memory footprint:
   $$\text{RAM}_{\text{dense}} = 512{,}000{,}000 \times 8\text{ bytes} = 4{,}096{,}000{,}000\text{ bytes} \approx 4.096\text{ GB}$$
2. **(b) Sparse Spatial Hash Table:**
   Total occupied cell instances:
   $$\text{Occupied Cells} \le 2{,}500 \times 4 = 10{,}000\text{ entries}$$
   Even with a load factor of $0.5$ (allocating a hash table of size $M = 20{,}000$ buckets):
   $$\text{RAM}_{\text{hash}} = 20{,}000 \times 32\text{ bytes} = 640{,}000\text{ bytes} = 640\text{ KB}$$
3. **Memory Savings Ratio:**
   $$\text{Ratio} = \frac{4{,}096{,}000\text{ KB}}{640\text{ KB}} = 6{,}400\times\text{ memory reduction!}$$

---

### Worked Example 1.3: Optimal Bounding Sphere for a Set of 3D Vertices (Ritter's Algorithm)
**Problem:** A geometric mesh has six vertices:
$\mathbf{V}_1 = (-2, 0, 0)^T$, $\mathbf{V}_2 = (4, 0, 0)^T$, $\mathbf{V}_3 = (1, 3, 0)^T$, $\mathbf{V}_4 = (1, -2, 0)^T$, $\mathbf{V}_5 = (0, 1, 2)^T$, $\mathbf{V}_6 = (1, 0, -3)^T$.
Apply Jack Ritter's linear-time bounding sphere algorithm to construct a conservative bounding sphere.

**Solution:**
1. **Step 1: Find two points furthest apart along principal axes:**
   - X-span: $\mathbf{V}_1 = (-2, 0, 0)^T$ to $\mathbf{V}_2 = (4, 0, 0)^T$, distance $\Delta x = 6$.
   - Y-span: $\mathbf{V}_4 = (1, -2, 0)^T$ to $\mathbf{V}_3 = (1, 3, 0)^T$, distance $\Delta y = 5$.
   - Z-span: $\mathbf{V}_6 = (1, 0, -3)^T$ to $\mathbf{V}_5 = (0, 1, 2)^T$, distance $\Delta z = 5$.
   Maximum span is along X between $\mathbf{V}_1$ and $\mathbf{V}_2$.
2. **Step 2: Construct initial sphere spanning $\mathbf{V}_1$ and $\mathbf{V}_2$:**
   Center:
   $$\mathbf{c}_0 = \frac{\mathbf{V}_1 + \mathbf{V}_2}{2} = \frac{(-2 + 4, 0, 0)^T}{2} = (1, 0, 0)^T$$
   Radius:
   $$R_0 = \frac{\|\mathbf{V}_2 - \mathbf{V}_1\|}{2} = \frac{6}{2} = 3.0$$
   $R_0^2 = 9.0$.
3. **Step 3: Test remaining vertices and expand sphere if necessary:**
   - $\mathbf{V}_3 = (1, 3, 0)^T$:
     $$\|\mathbf{V}_3 - \mathbf{c}_0\|^2 = (1 - 1)^2 + (3 - 0)^2 + (0 - 0)^2 = 0 + 9 + 0 = 9.0 \le R_0^2 \implies \text{Inside!}$$
   - $\mathbf{V}_4 = (1, -2, 0)^T$:
     $$\|\mathbf{V}_4 - \mathbf{c}_0\|^2 = (1 - 1)^2 + (-2 - 0)^2 + 0 = 4.0 \le 9.0 \implies \text{Inside!}$$
   - $\mathbf{V}_5 = (0, 1, 2)^T$:
     $$\|\mathbf{V}_5 - \mathbf{c}_0\|^2 = (0 - 1)^2 + (1 - 0)^2 + (2 - 0)^2 = 1 + 1 + 4 = 6.0 \le 9.0 \implies \text{Inside!}$$
   - $\mathbf{V}_6 = (1, 0, -3)^T$:
     $$\|\mathbf{V}_6 - \mathbf{c}_0\|^2 = (1 - 1)^2 + (0 - 0)^2 + (-3 - 0)^2 = 9.0 \le 9.0 \implies \text{Inside!}$$
4. All vertices are enclosed! The conservative bounding sphere is centered at $\mathbf{c} = (1, 0, 0)^T$ with radius $R = 3.0$.

---

### Worked Example 1.4: Sphere-Sphere Broadphase Overlap Test
**Problem:** Two moving rigid bodies have bounding spheres:
Sphere $A$: Center $\mathbf{c}_A = (3.5, 2.0, -1.0)^T$, radius $R_A = 1.8\text{ m}$.
Sphere $B$: Center $\mathbf{c}_B = (1.0, 4.0, 0.5)^T$, radius $R_B = 1.5\text{ m}$.
Determine algebraically whether their bounding spheres overlap, and calculate the separation or penetration distance.

**Solution:**
1. Displacement vector between centers:
   $$\mathbf{d} = \mathbf{c}_A - \mathbf{c}_B = \begin{pmatrix} 3.5 - 1.0 \\ 2.0 - 4.0 \\ -1.0 - 0.5 \end{pmatrix} = \begin{pmatrix} 2.5 \\ -2.0 \\ -1.5 \end{pmatrix}\text{ m}$$
2. Squared Euclidean distance $\|\mathbf{d}\|^2$:
   $$\|\mathbf{d}\|^2 = (2.5)^2 + (-2.0)^2 + (-1.5)^2 = 6.25 + 4.00 + 2.25 = 12.50\text{ m}^2$$
3. Sum of radii and squared radius sum:
   $$R_{\text{sum}} = R_A + R_B = 1.8 + 1.5 = 3.3\text{ m}$$
   $$R_{\text{sum}}^2 = (3.3)^2 = 10.89\text{ m}^2$$
4. Overlap comparison:
   $$\|\mathbf{d}\|^2 = 12.50 > R_{\text{sum}}^2 = 10.89$$
   Because $\|\mathbf{d}\|^2 > R_{\text{sum}}^2$, **the bounding spheres do NOT intersect!**
5. Actual distance:
   $$d = \sqrt{12.50} \approx 3.5355\text{ m}$$
   Separation distance:
   $$s = d - R_{\text{sum}} = 3.5355 - 3.3000 = +0.2355\text{ m}$$
   The bodies are safely separated by at least $23.55\text{ cm}$. Narrowphase collision checks are skipped entirely!

---

### Worked Example 1.5: Constructing an AABB from a Transformed OBB
**Problem:** A cuboid rigid body has local half-extents $\mathbf{e} = (2.0, 1.0, 0.5)^T\text{ m}$. In world space, its center is at $\mathbf{c} = (5.0, 3.0, -2.0)^T\text{ m}$, and its orientation is rotated by $45^\circ$ ($\pi/4$) around the z-axis:
$$\mathbf{R} = \begin{pmatrix} \cos 45^\circ & -\sin 45^\circ & 0 \\ \sin 45^\circ & \cos 45^\circ & 0 \\ 0 & 0 & 1 \end{pmatrix} = \begin{pmatrix} \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 0 \\ \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 0 & 0 & 1 \end{pmatrix} \approx \begin{pmatrix} 0.7071 & -0.7071 & 0 \\ 0.7071 & 0.7071 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
Calculate the exact world-space AABB half-extents $\mathbf{e}_{\text{world}}$ and the bounding intervals $[\mathbf{min}, \mathbf{max}]$.

**Solution:**
1. **The Absolute Matrix Theorem for AABB Transformation:**
   For any rotated box with local half-extents $\mathbf{e}$ and rotation matrix $\mathbf{R}$, the world-space AABB half-extents are given by:
   $$\mathbf{e}_{\text{world}} = |\mathbf{R}| \, \mathbf{e}$$
   where $|\mathbf{R}|$ is the matrix containing the absolute values of the entries of $\mathbf{R}$:
   $$|\mathbf{R}| = \begin{pmatrix} |R_{00}| & |R_{01}| & |R_{02}| \\ |R_{10}| & |R_{11}| & |R_{12}| \\ |R_{20}| & |R_{21}| & |R_{22}| \end{pmatrix} = \begin{pmatrix} \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
2. Compute components of $\mathbf{e}_{\text{world}}$:
   $$e_{\text{world}, x} = \frac{\sqrt{2}}{2} e_x + \frac{\sqrt{2}}{2} e_y + 0 \cdot e_z = \frac{\sqrt{2}}{2}(2.0) + \frac{\sqrt{2}}{2}(1.0) = \frac{\sqrt{2}}{2}(3.0) \approx 2.1213\text{ m}$$
   $$e_{\text{world}, y} = \frac{\sqrt{2}}{2} e_x + \frac{\sqrt{2}}{2} e_y + 0 \cdot e_z = \frac{\sqrt{2}}{2}(3.0) \approx 2.1213\text{ m}$$
   $$e_{\text{world}, z} = 0 \cdot e_x + 0 \cdot e_y + 1 \cdot e_z = 0.5\text{ m}$$
   $$\mathbf{e}_{\text{world}} = (2.1213, 2.1213, 0.5000)^T\text{ m}$$
3. World AABB bounds $[\mathbf{min}, \mathbf{max}]$:
   $$\mathbf{min} = \mathbf{c} - \mathbf{e}_{\text{world}} = \begin{pmatrix} 5.0 - 2.1213 \\ 3.0 - 2.1213 \\ -2.0 - 0.5000 \end{pmatrix} = \begin{pmatrix} 2.8787 \\ 0.8787 \\ -2.5000 \end{pmatrix}\text{ m}$$
   $$\mathbf{max} = \mathbf{c} + \mathbf{e}_{\text{world}} = \begin{pmatrix} 5.0 + 2.1213 \\ 3.0 + 2.1213 \\ -2.0 + 0.5000 \end{pmatrix} = \begin{pmatrix} 7.1213 \\ 5.1213 \\ -1.5000 \end{pmatrix}\text{ m}$$
   Notice that in the local frame, the box width was $4.0\text{ m}$ ($e_x = 2.0$), but the rotated world AABB has width $2 \times 2.1213 = 4.2426\text{ m}$. The difference represents conservative enclosing padding!

---

### Worked Example 1.6: AABB-AABB Broadphase Overlap Test
**Problem:** Test whether the following two 3D AABBs intersect:
- Box $A$: $\mathbf{min}_A = (-1.0, 2.0, 0.0)^T$, $\mathbf{max}_A = (3.0, 6.0, 4.0)^T$.
- Box $B$: $\mathbf{min}_B = (2.5, 5.0, 3.5)^T$, $\mathbf{max}_B = (5.0, 8.0, 7.0)^T$.

**Solution:**
1. **X-Axis Overlap Test:**
   Interval $A_x = [-1.0, 3.0]$, Interval $B_x = [2.5, 5.0]$.
   Condition: $A_{\min, x} \le B_{\max, x}$ AND $A_{\max, x} \ge B_{\min, x}$.
   $$-1.0 \le 5.0 \quad (\text{TRUE})$$
   $$3.0 \ge 2.5 \quad (\text{TRUE})$$
   Overlap exists on X! Overlap interval: $[\max(-1, 2.5), \min(3, 5)] = [2.5, 3.0]$.
2. **Y-Axis Overlap Test:**
   Interval $A_y = [2.0, 6.0]$, Interval $B_y = [5.0, 8.0]$.
   $$2.0 \le 8.0 \quad (\text{TRUE})$$
   $$6.0 \ge 5.0 \quad (\text{TRUE})$$
   Overlap exists on Y! Overlap interval: $[5.0, 6.0]$.
3. **Z-Axis Overlap Test:**
   Interval $A_z = [0.0, 4.0]$, Interval $B_z = [3.5, 7.0]$.
   $$0.0 \le 7.0 \quad (\text{TRUE})$$
   $$4.0 \ge 3.5 \quad (\text{TRUE})$$
   Overlap exists on Z! Overlap interval: $[3.5, 4.0]$.
4. **Conclusion:**
   Because overlap occurs on **all three axes**, **Box $A$ and Box $B$ INTERSECT!**
   The intersection volume is a sub-AABB bounded by $[2.5, 3.0] \times [5.0, 6.0] \times [3.5, 4.0]$ with volume $V = (0.5)(1.0)(0.5) = 0.25\text{ m}^3$.
   This pair is flagged as a candidate for narrowphase collision detection.

---

### Worked Example 1.7: AABB Union (Merging Two Nodes in a BVH)
**Problem:** In a Bounding Volume Hierarchy, an internal node is formed as the parent of two child nodes with AABBs:
Child 1: $\mathbf{min}_1 = (-4.0, 1.0, 2.0)^T$, $\mathbf{max}_1 = (-1.0, 5.0, 6.0)^T$.
Child 2: $\mathbf{min}_2 = (0.0, -2.0, 1.0)^T$, $\mathbf{max}_2 = (3.0, 3.0, 4.0)^T$.
Determine the minimum and maximum coordinates of the parent AABB, and calculate the volume expansion ratio relative to the sum of the child volumes.

**Solution:**
1. Parent bounding box is the component-wise minimum of mins, and maximum of maxes:
   $$\mathbf{min}_{\text{parent}} = \min(\mathbf{min}_1, \mathbf{min}_2) = \begin{pmatrix} \min(-4.0, 0.0) \\ \min(1.0, -2.0) \\ \min(2.0, 1.0) \end{pmatrix} = \begin{pmatrix} -4.0 \\ -2.0 \\ 1.0 \end{pmatrix}$$
   $$\mathbf{max}_{\text{parent}} = \max(\mathbf{max}_1, \mathbf{max}_2) = \begin{pmatrix} \max(-1.0, 3.0) \\ \max(5.0, 3.0) \\ \max(6.0, 4.0) \end{pmatrix} = \begin{pmatrix} 3.0 \\ 5.0 \\ 6.0 \end{pmatrix}$$
2. Volume of Child 1:
   $$\Delta \mathbf{x}_1 = (-1 - (-4), 5 - 1, 6 - 2) = (3, 4, 4) \implies V_1 = 3 \times 4 \times 4 = 48.0\text{ m}^3$$
3. Volume of Child 2:
   $$\Delta \mathbf{x}_2 = (3 - 0, 3 - (-2), 4 - 1) = (3, 5, 3) \implies V_2 = 3 \times 5 \times 3 = 45.0\text{ m}^3$$
   $$V_{\text{sum}} = V_1 + V_2 = 48.0 + 45.0 = 93.0\text{ m}^3$$
4. Volume of Parent:
   $$\Delta \mathbf{x}_{\text{parent}} = (3 - (-4), 5 - (-2), 6 - 1) = (7, 7, 5) \implies V_{\text{parent}} = 7 \times 7 \times 5 = 245.0\text{ m}^3$$
5. Volume Expansion Ratio:
   $$\text{Ratio} = \frac{V_{\text{parent}}}{V_{\text{sum}}} = \frac{245.0}{93.0} \approx 2.634$$
   The parent box contains $245 - 93 = 152\text{ m}^3$ of "dead space" (empty volume between the two children). Minimizing this dead space is the exact objective of BVH tree optimization heuristics!

---

### Worked Example 1.8: Spatial Hash Function Collision Probability
**Problem:** A spatial hash table uses $M = 1{,}000{,}003$ buckets (a prime number). A scene distributes $N = 50{,}000$ active occupied cells into the table.
Assuming a uniform distribution of hash outputs, calculate the probability that at least two cells collide in the same hash bucket, and compute the expected number of collisions.

**Solution:**
1. This is the classic **Generalized Birthday Problem**:
   Number of items: $N = 50{,}000$.
   Number of buckets: $M = 1{,}000{,}003$.
2. The probability of zero collisions (every item in a unique bucket) is:
   $$P(\text{no collisions}) \approx \exp\left( -\frac{N(N - 1)}{2M} \right)$$
   Compute the exponent:
   $$\frac{N(N - 1)}{2M} \approx \frac{(50{,}000)^2}{2(1{,}000{,}003)} = \frac{2.5 \times 10^9}{2.000006 \times 10^6} \approx 1{,}249.997$$
   $$P(\text{no collisions}) \approx e^{-1250} \approx 0.0$$
   The probability of having at least one hash collision is $1 - e^{-1250} \approx 100\%$!
3. Expected number of pairs that hash to the same bucket:
   $$E[\text{colliding pairs}] = \frac{\binom{N}{2}}{M} = \frac{1.25 \times 10^9}{1{,}000{,}003} \approx 1{,}250\text{ pairs}$$
   Out of $50{,}000$ cells, roughly $1{,}250$ cell pairs will falsely collide in the hash table. Broadphase must verify that the actual integer cell coordinates $(i_1, j_1, k_1) == (i_2, j_2, k_2)$ match before generating candidate contact pairs!

---

### Worked Example 1.9: Bounding Volume Tightness Comparison: Cylinder in Sphere vs. AABB vs. OBB
**Problem:** A uniform solid cylinder has radius $R = 0.5\text{ m}$ and length $L = 4.0\text{ m}$ (slender pipe). The cylinder axis is tilted at $45^\circ$ in the xy-plane.
Calculate the volume of:
(a) The cylinder itself.
(b) Its Oriented Bounding Box (OBB).
(c) Its Axis-Aligned Bounding Box (AABB).
(d) Its Bounding Sphere.
Quantify the "empty space efficiency" (Ratio of Volume to Actual Cylinder Volume).

**Solution:**
1. **(a) Actual Cylinder Volume:**
   $$V_{\text{cyl}} = \pi R^2 L = \pi (0.5)^2 (4.0) = \pi (0.25)(4.0) = \pi \approx 3.1416\text{ m}^3$$
2. **(b) Oriented Bounding Box (OBB):**
   The OBB aligns with the cylinder's symmetry axis.
   Dimensions: Length along axis is $L = 4.0\text{ m}$. Width and height along transverse axes are $2R = 1.0\text{ m}$ each.
   $$V_{\text{OBB}} = 4.0 \times 1.0 \times 1.0 = 4.0\text{ m}^3$$
   Efficiency Ratio:
   $$\frac{V_{\text{OBB}}}{V_{\text{cyl}}} = \frac{4.0}{\pi} \approx 1.273 \quad (\text{Only } 27.3\% \text{ empty space})$$
3. **(c) Axis-Aligned Bounding Box (AABB):**
   When tilted $45^\circ$ in xy-plane:
   - Span along X: $L \cos 45^\circ + 2R \sin 45^\circ = 4.0(0.7071) + 1.0(0.7071) = 2.8284 + 0.7071 = 3.5355\text{ m}$.
   - Span along Y: Same by symmetry $= 3.5355\text{ m}$.
   - Span along Z: $2R = 1.0\text{ m}$.
   $$V_{\text{AABB}} = 3.5355 \times 3.5355 \times 1.0 = 12.50\text{ m}^3$$
   Efficiency Ratio:
   $$\frac{V_{\text{AABB}}}{V_{\text{cyl}}} = \frac{12.50}{3.1416} \approx 3.979 \quad (300\% \text{ empty space})$$
4. **(d) Bounding Sphere:**
   The sphere must encompass the diagonal of the cylinder:
   $$R_{\text{sphere}} = \sqrt{\left(\frac{L}{2}\right)^2 + R^2} = \sqrt{2.0^2 + 0.5^2} = \sqrt{4.0 + 0.25} = \sqrt{4.25} \approx 2.0616\text{ m}$$
   $$V_{\text{sphere}} = \frac{4}{3} \pi R_{\text{sphere}}^3 = \frac{4}{3} \pi (2.0616)^3 \approx \frac{4}{3} \pi (8.7616) \approx 36.70\text{ m}^3$$
   Efficiency Ratio:
   $$\frac{V_{\text{sphere}}}{V_{\text{cyl}}} = \frac{36.70}{3.1416} \approx 11.68 \quad (\mathbf{1{,}068\%} \text{ empty space!})$$
   The bounding sphere encloses nearly $12\times$ more volume than the cylinder!

---

### Worked Example 1.10: Pruning Efficiency of a Hierarchical BVH vs. All-Pairs
**Problem:** A physics simulation contains $N = 10{,}000$ uniformly distributed objects in space. A balanced binary BVH of depth $D = \log_2(10{,}000) \approx 14$ is built over the scene.
On average, an object's bounding box overlaps with only $2$ other objects in the entire scene.
Calculate:
(a) Total narrowphase tests required under naive all-pairs.
(b) Total tree traversal box-box tests required to query all $10{,}000$ objects against the BVH.
(c) The algorithmic speedup factor.

**Solution:**
1. **(a) Naive All-Pairs:**
   $$\text{Tests}_{\text{naive}} = \frac{N(N - 1)}{2} = \frac{10{,}000 \times 9{,}999}{2} = 49{,}995{,}000\text{ tests}$$
2. **(b) BVH Tree Traversal:**
   For each object, searching down the binary tree to find overlapping leaves requires testing bounding boxes at each level of the tree.
   Depth of tree $D \approx 14$ levels.
   At each level, 2 child boxes are tested:
   $$\text{Tests per object} \approx 2 \times D = 2 \times 14 = 28\text{ box tests}$$
   For all $10{,}000$ objects:
   $$\text{Total Traversal Tests} \approx 10{,}000 \times 28 = 280{,}000\text{ box tests}$$
   Narrowphase tests: Each object overlaps $2$ others, yielding $\frac{10{,}000 \times 2}{2} = 10{,}000$ narrowphase tests.
   Total tests:
   $$\text{Tests}_{\text{BVH}} = 280{,}000\text{ (cheap AABB)} + 10{,}000\text{ (narrowphase)} = 290{,}000\text{ operations}$$
3. **(c) Speedup Factor:**
   $$\text{Speedup} = \frac{49{,}995{,}000}{290{,}000} \approx 172.4\times\text{ faster!}$$
   The frame calculation time drops from $50\text{ seconds}$ to $290\text{ milliseconds}$, transforming an impossible simulation into smooth execution!

---

## 1.7 Ten Granular Solved Exercises

### Exercise 1.1: Exact All-Pairs Test Count for Asymmetric Filtering
**Problem:** In a scene with $N_d = 500$ dynamic moving objects and $N_s = 5{,}000$ static stationary environment meshes (rocks, walls), how many pairwise collision tests are required if collisions between two static objects are strictly skipped?

**Solution:**
1. Collisions between two static objects ($S \leftrightarrow S$) can never occur since neither object moves: $\binom{N_s}{2}$ tests are skipped.
2. Dynamic objects must be tested against other dynamic objects ($D \leftrightarrow D$):
   $$P_{DD} = \binom{N_d}{2} = \frac{500 \times 499}{2} = 124{,}750\text{ tests}$$
3. Dynamic objects must be tested against static objects ($D \leftrightarrow S$):
   $$P_{DS} = N_d \times N_s = 500 \times 5{,}000 = 2{,}500{,}000\text{ tests}$$
4. Total required tests:
   $$P_{\text{total}} = 124{,}750 + 2{,}500{,}000 = 2{,}624{,}750\text{ tests}$$
   Compare this to testing all $5{,}500$ objects naively: $\binom{5500}{2} = 15{,}122{,}250$ tests. Skipping static-static pairs eliminates over $82.6\%$ of all checks!

---

### Exercise 1.2: Minimum Bounding Sphere from 4 Tetrahedral Vertices
**Problem:** A regular tetrahedron has vertices at $\mathbf{V}_1 = (1, 1, 1)^T$, $\mathbf{V}_2 = (1, -1, -1)^T$, $\mathbf{V}_3 = (-1, 1, -1)^T$, $\mathbf{V}_4 = (-1, -1, 1)^T$.
Find the exact center and radius of the minimum enclosing bounding sphere.

**Solution:**
1. By symmetry, the geometric centroid is:
   $$\mathbf{c} = \frac{1}{4} \sum_{i=1}^4 \mathbf{V}_i = \frac{1}{4} \begin{pmatrix} 1 + 1 - 1 - 1 \\ 1 - 1 + 1 - 1 \\ 1 - 1 - 1 + 1 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$$
2. Distance from center to each vertex:
   $$R = \|\mathbf{V}_i - \mathbf{c}\| = \sqrt{(\pm 1)^2 + (\pm 1)^2 + (\pm 1)^2} = \sqrt{1 + 1 + 1} = \sqrt{3} \approx 1.7320$$
3. The minimum bounding sphere is centered at $(0, 0, 0)^T$ with radius $R = \sqrt{3}$.

---

### Exercise 1.3: 1D Sweep-and-Prune Interval Sorting Complexity
**Problem:** In the classic Sweep-and-Prune (SAP) broadphase algorithm, $N$ bounding intervals along the x-axis are sorted. Explain why SAP achieves $\mathcal{O}(N)$ amortized time during continuous simulation frames even though general sorting is $\mathcal{O}(N \log N)$.

**Solution:**
1. Between consecutive physics time steps $\Delta t \approx 0.016\text{ s}$, physical objects move only small continuous distances.
2. The list of interval endpoints from frame $t$ is **nearly sorted** at frame $t + \Delta t$.
3. By applying **Insertion Sort**, which has a best-case time complexity of $\mathcal{O}(N)$ on nearly sorted arrays (with only $\mathcal{O}(1)$ local element swaps), the list is resorted in linear time.
4. Hence, SAP achieves $\mathcal{O}(N + K)$ amortized runtime, where $K$ is the number of overlapping pairs.

---

### Exercise 1.4: Surface Area of an AABB
**Problem:** Express the total surface area $\text{SA}$ of an AABB defined by minimum and maximum vectors $\mathbf{min}, \mathbf{max} \in \mathbb{R}^3$, and calculate its value for $\mathbf{min} = (-2, 0, 1)^T$, $\mathbf{max} = (4, 3, 5)^T$.

**Solution:**
1. Extents along axes:
   $$d_x = \max_x - \min_x = 4 - (-2) = 6$$
   $$d_y = \max_y - \min_y = 3 - 0 = 3$$
   $$d_z = \max_z - \min_z = 5 - 1 = 4$$
2. Surface area formula:
   $$\text{SA} = 2(d_x d_y + d_y d_z + d_z d_x)$$
3. Compute value:
   $$\text{SA} = 2(6 \times 3 + 3 \times 4 + 4 \times 6) = 2(18 + 12 + 24) = 2(54) = 108\text{ units}^2$$

---

### Exercise 1.5: False Positive Rate of Bounding Spheres vs. AABBs for Cubes
**Problem:** A unit cube has side length $s = 1.0\text{ m}$.
Calculate the volume of:
(a) The cube.
(b) The tightest enclosing AABB.
(c) The tightest enclosing bounding sphere.
Determine the ratio of false positive volume for the sphere.

**Solution:**
1. Volume of cube: $V_{\text{cube}} = s^3 = 1.0\text{ m}^3$.
2. Enclosing AABB: Because the cube is axis-aligned, the tightest AABB matches the cube exactly: $V_{\text{AABB}} = 1.0\text{ m}^3$. Zero false positive volume!
3. Enclosing bounding sphere:
   The sphere diameter is the cube space diagonal:
   $$D = \sqrt{s^2 + s^2 + s^2} = \sqrt{3} \approx 1.7320\text{ m} \implies R = \frac{\sqrt{3}}{2} \approx 0.8660\text{ m}$$
   Volume of sphere:
   $$V_{\text{sphere}} = \frac{4}{3} \pi R^3 = \frac{4}{3} \pi \left(\frac{\sqrt{3}}{2}\right)^3 = \frac{4}{3} \pi \left(\frac{3\sqrt{3}}{8}\right) = \frac{\pi \sqrt{3}}{2} \approx \frac{3.14159 \times 1.73205}{2} \approx 2.7207\text{ m}^3$$
4. False positive volume:
   $$V_{\text{fp}} = V_{\text{sphere}} - V_{\text{cube}} = 2.7207 - 1.0 = 1.7207\text{ m}^3$$
   The bounding sphere contains $172\%$ excess volume that will trigger false positive broadphase candidate pairs!

---

### Exercise 1.6: Dynamic AABB Expansion by Linear Velocity (Swept AABB)
**Problem:** An AABB at time $t$ has bounds $[\mathbf{min}, \mathbf{max}]$. The body moves with constant linear velocity $\mathbf{v} = (10, -5, 2)^T\text{ m/s}$ over a time step $\Delta t = 0.02\text{ s}$.
Derive the formulas for the swept AABB bounds $[\mathbf{min}_{\text{swept}}, \mathbf{max}_{\text{swept}}]$ that guarantee zero tunneling during the step.

**Solution:**
1. Displacement vector over time step:
   $$\mathbf{d} = \mathbf{v} \Delta t = (10 \times 0.02, -5 \times 0.02, 2 \times 0.02)^T = (0.20, -0.10, 0.04)^T\text{ m}$$
2. For each coordinate axis $i \in \{x, y, z\}$:
   $$\min_{\text{swept}, i} = \min(\min_i, \min_i + d_i)$$
   $$\max_{\text{swept}, i} = \max(\max_i, \max_i + d_i)$$
3. Expressed directly:
   $$\mathbf{min}_{\text{swept}} = \mathbf{min} + \min(\mathbf{0}, \mathbf{d})$$
   $$\mathbf{max}_{\text{swept}} = \mathbf{max} + \max(\mathbf{0}, \mathbf{d})$$
   For our velocity:
   $$\mathbf{min}_{\text{swept}} = (\min_x, \min_y - 0.10, \min_z)^T$$
   $$\mathbf{max}_{\text{swept}} = (\max_x + 0.20, \max_y, \max_z + 0.04)^T$$
   This enlarged box is guaranteed to contain the moving object throughout the entire continuous interval $[t, t + \Delta t]$!

---

### Exercise 1.7: Bitwise Coordinate Interleaving for 3D Morton Codes
**Problem:** Given integer grid coordinates $x = 5$ and $y = 3$, express both in binary and show their 2D bitwise interleaved Morton code $Z(x, y)$.

**Solution:**
1. Binary representations (4 bits):
   $$x = 5_{10} = 0101_2$$
   $$y = 3_{10} = 0011_2$$
2. Interleaving bits such that $y$ occupies odd bits and $x$ occupies even bits:
   $$\text{Bit 7: } y_3 = 0$$
   $$\text{Bit 6: } x_3 = 0$$
   $$\text{Bit 5: } y_2 = 0$$
   $$\text{Bit 4: } x_2 = 1$$
   $$\text{Bit 3: } y_1 = 1$$
   $$\text{Bit 2: } x_1 = 0$$
   $$\text{Bit 1: } y_0 = 1$$
   $$\text{Bit 0: } x_0 = 1$$
3. Assembled binary Morton code:
   $$Z(5, 3) = 00011011_2 = 16 + 8 + 2 + 1 = 27_{10}$$

---

### Exercise 1.8: Octree Maximum Tree Depth Calculation
**Problem:** A 3D Octree encloses a world of side length $L = 1{,}024\text{ meters}$. Subdivisions terminate when leaf nodes reach a minimum cell width $w_{\text{min}} = 1.0\text{ meter}$.
Calculate the maximum possible tree depth $D_{\text{max}}$ and the maximum number of leaf nodes at this depth.

**Solution:**
1. At depth $d$, each node has side length:
   $$w(d) = \frac{L}{2^d}$$
2. Set $w(d) = w_{\text{min}}$:
   $$\frac{1{,}024}{2^d} = 1.0 \implies 2^d = 1{,}024 \implies d = 10$$
   Maximum depth is $D_{\text{max}} = 10$ levels.
3. In an Octree, each internal node splits into $8 = 2^3$ children.
   Maximum number of leaf nodes at depth 10:
   $$N_{\text{leaves}} = 8^{10} = (2^3)^{10} = 2^{30} = 1{,}073{,}741{,}824\text{ leaves} \approx 1.07\text{ billion cells}$$

---

### Exercise 1.9: Point-in-AABB Containment Test
**Problem:** Given an AABB with $\mathbf{min} = (-3, -1, 2)^T$ and $\mathbf{max} = (2, 5, 8)^T$, determine whether the point $\mathbf{P} = (0.5, 4.8, 1.9)^T$ lies strictly inside, on the boundary, or outside the AABB.

**Solution:**
1. Check coordinate bounds:
   - X: $-3 \le 0.5 \le 2$ $\implies$ Inside.
   - Y: $-1 \le 4.8 \le 5$ $\implies$ Inside.
   - Z: $2 \le 1.9 \le 8$ $\implies$ **FALSE!** ($1.9 < 2.0$).
2. Because the Z coordinate fails the lower bound, point $\mathbf{P}$ lies **OUTSIDE** the AABB.

---

### Exercise 1.10: Memory Overhead of BVH Node Pointers vs. Linear Indices
**Problem:** In 64-bit systems, pointers take $8\text{ bytes}$. A binary BVH node has:
- AABB: $2 \times \text{Vector3} = 6 \times 4\text{ bytes} = 24\text{ bytes}$.
- Two child pointers: $2 \times 8 = 16\text{ bytes}$.
- Total node size $= 40\text{ bytes}$ (padded to $48\text{ bytes}$ for 16-byte alignment).
Show how a **Linear BVH** using 32-bit integer array indices reduces node size and improves cache density.

**Solution:**
1. By storing all nodes in a flat contiguous array, memory addresses are replaced by 32-bit integer indices ($4\text{ bytes}$ each).
2. Furthermore, in a depth-first traversal layout, the left child is always immediately adjacent at `index + 1`, requiring **only one child index** (the right child at $4\text{ bytes}$):
   - AABB: $24\text{ bytes}$.
   - Right child index: $4\text{ bytes}$.
   - Primitive count / leaf flag: $4\text{ bytes}$.
   - Total node size $= 32\text{ bytes}$.
3. Exactly two 32-byte nodes fit cleanly into a single 64-byte CPU cache line (L1 cache)!
   Memory reduction: $\frac{48 - 32}{48} = 33.3\%$ memory savings, while completely eliminating pointer chasing and L1 cache line splits.

---

## 1.8 Chapter Summary and Bridge to Chapter 2

In this opening chapter, we diagnosed the foundational crisis of 3D spatial computation:
1. **The $\mathcal{O}(N^2)$ Bottleneck:** Without spatial acceleration, pairwise testing collapses frame rates with just over $100$ objects.
2. **The Curse of Dimensionality:** 3D space is predominantly empty void; uniform grids suffer from cubic memory explosion ($\mathcal{O}(K^3)$), while spatial hashing eliminates empty storage at the expense of scale rigidity.
3. **Bounding Volumes:** Established the trade-off hierarchy between spheres, AABBs, OBBs, and $k$-DOPs.
4. **The Conservative Bounding Invariant:** Broadphase must never produce false negatives.

In **Chapter 2: Axis-Aligned Bounding Boxes (AABB) and the Kay-Kajiya Slab Method**, we delve deep into the most ubiquitous bounding volume in computer graphics and physics engines, deriving the exact algebraic and vector geometry of the slab intersection test with IEEE 754 floating-point robustness.
