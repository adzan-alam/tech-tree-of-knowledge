# Chapter 3: Oriented Bounding Boxes and the 15-Axis Separating Axis Theorem

> *"Two solid bodies cannot occupy the same space at the same time. If they do not touch, there exists a plane of empty air between them. To find that plane is to prove peace; to find none is to declare collision."*
> — **Hermann Minkowski**, *Geometrie der Zahlen* (1896)

---

## 3.1 The Limitations of Axis-Aligned Bounding Boxes

In Chapter 2, we mastered the Axis-Aligned Bounding Box (AABB) and the Kay-Kajiya slab method. While AABBs provide ultra-fast $\mathcal{O}(1)$ overlap tests and SIMD-friendly ray intersections, they suffer from a fatal geometric limitation: **they cannot rotate**.

### 3.1.1 The "Loose Box" Catastrophe

When an elongated or asymmetric 3D object undergoes spatial rotation, its world-space AABB must expand to contain all rotated vertices.

```
                  THE ROTATION EXPANSION PENALTY
                  
       Local Frame (Aligned)               World Frame (Rotated 45 degrees)
            +----------+                        +-------------------+
            |  Object  |                        |         /\        |
            |          |                        |        /  \       |
            +----------+                        |       /    \      |
        Tight AABB: Fits Object                 |      / Object\    |
                                                |     /        \    |
                                                |    /          \   |
                                                |    \          /   |
                                                |     \        /    |
                                                |      \      /     |
                                                |       \    /      |
                                                |        \  /       |
                                                |         \/        |
                                                +-------------------+
                                            Loose AABB: Enormous Empty Space!
```

Consider an airplane or slender spacecraft of length $L = 50\text{ m}$, wingspan $W = 30\text{ m}$, and fuselage height $H = 5\text{ m}$.
- When aligned with the coordinate axes, its AABB volume is:
  $$V_{\text{aligned}} = 50 \times 30 \times 5 = 7{,}500\text{ m}^3$$
- When pitched and yawed at $45^\circ$, each coordinate span becomes roughly $\frac{50 + 30}{\sqrt{2}} \approx 56.6\text{ m}$. Its rotated world AABB volume swells to:
  $$V_{\text{rotated}} \approx 56.6 \times 56.6 \times 35.4 \approx 113{,}000\text{ m}^3$$
  The bounding volume has inflated by **$1{,}500\%$**! Over $93\%$ of this volume is pure vacuum.
- If two airplanes fly past each other with $30\text{ meters}$ of clearance, their inflated world AABBs will overlap heavily, triggering thousands of unnecessary, expensive narrowphase triangle-mesh checks!

To achieve tight, rotation-invariant bounding without resorting to complex polygon meshes, we must upgrade from AABBs to **Oriented Bounding Boxes (OBB)**.

---

## 3.2 Mathematical Definition of an Oriented Bounding Box (OBB)

An **Oriented Bounding Box (OBB)** is a rectangular block in $\mathbb{R}^3$ whose orientation is arbitrary and independent of the global coordinate system.

```
                        GEOMETRY OF AN OBB
                                 u_1 (Local Y)
                                  ^
                                  |    e_1
                             +----|----+
                            /|    |   /|
                           / |    *  / |
                          +--|-- c -+  |  --> u_0 (Local X)
                          |  +---|--|--+      e_0
                          | /    |  | /
                          |/     |  |/
                          +------|--+
                                /
                               v u_2 (Local Z)
                                 e_2
```

An OBB is uniquely defined by three geometric parameters:
1. **Center Point $\mathbf{c} \in \mathbb{R}^3$:** The spatial center of mass of the box in world coordinates.
2. **Orthonormal Orientation Basis $(\mathbf{u}_0, \mathbf{u}_1, \mathbf{u}_2) \in \mathbb{R}^3$:** Three unit vectors representing the local principal axes of the box:
   $$\|\mathbf{u}_i\| = 1, \quad \mathbf{u}_i \cdot \mathbf{u}_j = \delta_{ij} \quad \forall i, j \in \{0, 1, 2\}$$
   These three column vectors form a proper 3D rotation matrix $\mathbf{R} \in \text{SO}(3)$:
   $$\mathbf{R} = \begin{pmatrix} \mathbf{u}_0 & \mathbf{u}_1 & \mathbf{u}_2 \end{pmatrix}, \quad \mathbf{R}^T \mathbf{R} = \mathbf{I}_3, \quad \det(\mathbf{R}) = +1$$
3. **Half-Extents Vector $\mathbf{e} = (e_0, e_1, e_2)^T \in \mathbb{R}^3_{\ge 0}$:** The half-lengths of the box along each of its local axes.

### 3.2.1 Affine Parameterization

Any point $\mathbf{x} \in \mathbb{R}^3$ inside or on the boundary of the OBB can be expressed as:

$$\mathbf{x} = \mathbf{c} + h_0 \mathbf{u}_0 + h_1 \mathbf{u}_1 + h_2 \mathbf{u}_2 = \mathbf{c} + \mathbf{R} \mathbf{h}$$

where the local coordinate vector $\mathbf{h} = (h_0, h_1, h_2)^T$ satisfies:

$$-e_i \le h_i \le e_i \iff |h_i| \le e_i \quad \forall i \in \{0, 1, 2\}$$

The 8 corner vertices of the OBB are generated by evaluating the $2^3 = 8$ sign permutations of the half-extents:

$$\mathbf{V}_{\pm \pm \pm} = \mathbf{c} \pm e_0 \mathbf{u}_0 \pm e_1 \mathbf{u}_1 \pm e_2 \mathbf{u}_2$$

---

## 3.3 The 3D Separating Axis Theorem (SAT)

To determine whether two arbitrary, arbitrarily oriented convex polyhedra intersect, we turn to the celebrated **Separating Axis Theorem (SAT)**, also known in convex analysis as the **Hyperplane Separation Theorem**.

### 3.3.1 The Fundamental Theorem

> **Separating Axis Theorem (Minkowski, 1896):**
> Let $A$ and $B$ be two non-empty, closed, convex subsets of $\mathbb{R}^3$.
> $A$ and $B$ are disjoint ($A \cap B = \emptyset$) **if and only if** there exists a separating plane $\mathcal{H}$ such that $A$ lies entirely on one side of $\mathcal{H}$ and $B$ lies entirely on the other side.

```
                       THE SEPARATING AXIS CONCEPT
                       
               Object A                         Object B
              +---------+                     .---------.
              |    *    |                    /     *     \
              +---------+                   |             |
                   \                         \           /
                    \                         `---------'
                     \   Separating Plane          /
                      \         |                 /
                       \        |                /
    ====================[======]|===============|==================== Axis L
                        Projected A             Projected B
                             Distance > Radius_A + Radius_B (DISJOINT!)
```

### 3.3.2 1D Axis Projection

The normal vector $\mathbf{L} \in \mathbb{R}^3$ ($\|\mathbf{L}\| = 1$) perpendicular to the separating plane $\mathcal{H}$ is called the **Separating Axis**.

When convex polyhedra $A$ and $B$ are projected onto the 1D axis $\mathbf{L}$, their projections form two closed intervals on $\mathbb{R}$:
$$I_A = [a_{\min}, a_{\max}], \quad I_B = [b_{\min}, b_{\max}]$$

By the 1D Interval Overlap Theorem:
$$\text{Intervals } I_A \text{ and } I_B \text{ are disjoint} \iff (a_{\min} > b_{\max}) \lor (b_{\min} > a_{\max})$$

If we can discover **even a single axis $\mathbf{L}$** along which the projected intervals of $A$ and $B$ do not overlap, we have mathematically proven that $A$ and $B$ do not intersect!

---

## 3.4 The 15 Candidate Axes for Two OBBs

Although there are infinitely many directions in $\mathbb{R}^3$, the Separating Axis Theorem proves that for two convex polyhedra, we need only test a **finite set of candidate axes**.

### 3.4.1 Classification of Contact Topologies

When two 3D polyhedra touch, their contact must fall into one of three geometric topologies:
1. **Face-Vertex Contact:** A vertex of $B$ touches a face of $A$. The separating plane is parallel to the face of $A$ (Normal = Face Normal of $A$).
2. **Vertex-Face Contact:** A vertex of $A$ touches a face of $B$. The separating plane is parallel to the face of $B$ (Normal = Face Normal of $B$).
3. **Edge-Edge Contact:** An edge of $A$ crosses an edge of $B$. The separating plane is parallel to both edges simultaneously! The normal to this plane is the **cross product of the two edge direction vectors**:
   $$\mathbf{L} = \mathbf{e}_A \times \mathbf{e}_B$$

```
   Face-Vertex Contact:             Edge-Edge Contact:
      +-------------+                     \       /  Edge B
      |   Body A    |                      \     /
      +-------------+                       \   /
             ^ Face Normal A                 \ /
             * Vertex B                       X  <-- Contact Point
          /     \                            / \
         / Body B\                          /   \
                                           /     \   Edge A
                                       L = Edge_A x Edge_B
```

### 3.4.2 Enumerating Candidate Axes for OBB $A$ and OBB $B$

Let Box $A$ have orthonormal axes $\mathbf{u}_0^A, \mathbf{u}_1^A, \mathbf{u}_2^A$, and Box $B$ have orthonormal axes $\mathbf{u}_0^B, \mathbf{u}_1^B, \mathbf{u}_2^B$.

1. **Face Normals of Box $A$:**
   Because opposite faces are parallel, Box $A$ has only **3 unique face normal directions**:
   $$\mathbf{L} \in \{ \mathbf{u}_0^A, \, \mathbf{u}_1^A, \, \mathbf{u}_2^A \}$$
2. **Face Normals of Box $B$:**
   Similarly, Box $B$ has only **3 unique face normal directions**:
   $$\mathbf{L} \in \{ \mathbf{u}_0^B, \, \mathbf{u}_1^B, \, \mathbf{u}_2^B \}$$
3. **Edge-Edge Cross Products:**
   Box $A$ has 12 edges, but they all run parallel to its 3 basis vectors $\mathbf{u}_0^A, \mathbf{u}_1^A, \mathbf{u}_2^A$.
   Box $B$ has 12 edges, all running parallel to its 3 basis vectors $\mathbf{u}_0^B, \mathbf{u}_1^B, \mathbf{u}_2^B$.
   The cross products between any edge of $A$ and any edge of $B$ yield exactly $3 \times 3 = \mathbf{9}$ candidate axes:
   $$\mathbf{L} \in \{ \mathbf{u}_i^A \times \mathbf{u}_j^B \mid i, j \in \{0, 1, 2\} \}$$

$$\text{Total Candidate Axes} = 3 + 3 + 9 = \mathbf{15\text{ AXES}}$$

$$\boxed{\text{Two OBBs intersect} \iff \text{Their projections overlap on ALL 15 candidate axes!}}$$

If the projections separate on **even one** of these 15 axes, the algorithm immediately terminates and returns `false` (Early-Out Exit).

---

## 3.5 Derivation of the Projection Overlap Inequality

Let $\mathbf{L} \in \mathbb{R}^3$ be any candidate axis ($\|\mathbf{L}\| \neq 0$). We project Box $A$ and Box $B$ onto $\mathbf{L}$.

```
                 PROJECTED HALF-WIDTHS ON AXIS L
       
                        c_A                     c_B
                         *                       *
           <-------------|------------->   <-----|----->
                 r_A                           r_B
       ==================================================== Axis L
                         <----------------------->
                                |T . L|
```

### 3.5.1 Projected Center Distance

Let $\mathbf{T}$ be the displacement vector from the center of Box $A$ to the center of Box $B$:
$$\mathbf{T} = \mathbf{c}_B - \mathbf{c}_A$$
The distance between the projected centers along axis $\mathbf{L}$ is:
$$\text{Distance}(\mathbf{L}) = |\mathbf{T} \cdot \mathbf{L}|$$

### 3.5.2 Projected Radius of Box $A$

Box $A$ is centered at $\mathbf{c}_A$ with half-extents $e_0^A, e_1^A, e_2^A$ along axes $\mathbf{u}_0^A, \mathbf{u}_1^A, \mathbf{u}_2^A$.
The maximum extent (projected half-width $r_A$) of Box $A$ along $\mathbf{L}$ is:
$$r_A = \max_{\mathbf{h}} |(\mathbf{R}_A \mathbf{h}) \cdot \mathbf{L}| = \max_{|h_i| \le e_i^A} |h_0 (\mathbf{u}_0^A \cdot \mathbf{L}) + h_1 (\mathbf{u}_1^A \cdot \mathbf{L}) + h_2 (\mathbf{u}_2^A \cdot \mathbf{L})|$$
By the Cauchy-Schwarz/Triangle inequality, the maximum is achieved when each $h_i$ matches the sign of $(\mathbf{u}_i^A \cdot \mathbf{L})$:
$$r_A = e_0^A |\mathbf{u}_0^A \cdot \mathbf{L}| + e_1^A |\mathbf{u}_1^A \cdot \mathbf{L}| + e_2^A |\mathbf{u}_2^A \cdot \mathbf{L}| = \sum_{i=0}^2 e_i^A |\mathbf{u}_i^A \cdot \mathbf{L}|$$

### 3.5.3 Projected Radius of Box $B$

Similarly, the projected half-width $r_B$ of Box $B$ along $\mathbf{L}$ is:
$$r_B = \sum_{j=0}^2 e_j^B |\mathbf{u}_j^B \cdot \mathbf{L}|$$

### 3.5.4 The Separation Criterion

The projected intervals are disjoint if and only if the distance between their projected centers exceeds the sum of their projected radii:

$$\boxed{|\mathbf{T} \cdot \mathbf{L}| > r_A + r_B \iff \text{Separated along axis } \mathbf{L}}$$

---

## 3.6 Gottschalk's RAPID Optimization (Frame A Coordinate System)

In 1996, Stefan Gottschalk, Ming Lin, and Dinesh Manocha published **RAPID (Robust and Accurate Polygon Interference Detection)** at SIGGRAPH. They revealed that evaluating the 15 axes in arbitrary world coordinates requires dozens of vector cross products and hundreds of redundant operations.

By **transforming Box $B$ into the local coordinate frame of Box $A$**, the math simplifies dramatically!

### 3.6.1 Local Frame Alignment

In Box $A$'s local frame:
- The center of $A$ is the origin: $\mathbf{c}_A = \mathbf{0}$.
- The axes of $A$ are the standard Cartesian basis:
  $$\mathbf{u}_0^A = (1, 0, 0)^T, \quad \mathbf{u}_1^A = (0, 1, 0)^T, \quad \mathbf{u}_2^A = (0, 0, 1)^T$$
- The center displacement vector in Frame $A$ is:
  $$\mathbf{t} = \mathbf{R}_A^T (\mathbf{c}_B - \mathbf{c}_A)$$
- The relative rotation matrix expressing Box $B$'s axes in Frame $A$ is:
  $$\mathbf{R} = \mathbf{R}_A^T \mathbf{R}_B$$
  where $R_{ij} = \mathbf{u}_i^A \cdot \mathbf{u}_j^B$.

We also precompute the absolute matrix $|\mathbf{R}|$ with a tiny positive epsilon $\epsilon \approx 10^{-6}$ added to prevent division-by-zero or numerical collapse when edges are parallel:
$$Q_{ij} = |R_{ij}| + \epsilon$$

### 3.6.2 The Complete 15 Scalar Tests

With $\mathbf{t}$, $\mathbf{R}$, and $\mathbf{Q} = |\mathbf{R}| + \epsilon$ precomputed, all 15 tests evaluate as simple scalar dot products without a single vector cross product!

```
+----------------------------------------------------------------------------------------------------+
|                               THE 15 CANONICAL OBB SAT TESTS                                       |
+----------------------------------------------------------------------------------------------------+
| 1. Axis L = u_0^A:                                                                                 |
|    |t_0| > e_0^A + (e_0^B * Q_00 + e_1^B * Q_01 + e_2^B * Q_02)                                    |
| 2. Axis L = u_1^A:                                                                                 |
|    |t_1| > e_1^A + (e_0^B * Q_10 + e_1^B * Q_11 + e_2^B * Q_12)                                    |
| 3. Axis L = u_2^A:                                                                                 |
|    |t_2| > e_2^A + (e_0^B * Q_20 + e_1^B * Q_21 + e_2^B * Q_22)                                    |
+----------------------------------------------------------------------------------------------------+
| 4. Axis L = u_0^B:                                                                                 |
|    |t_0 * R_00 + t_1 * R_10 + t_2 * R_20| > (e_0^A * Q_00 + e_1^A * Q_10 + e_2^A * Q_20) + e_0^B   |
| 5. Axis L = u_1^B:                                                                                 |
|    |t_0 * R_01 + t_1 * R_11 + t_2 * R_21| > (e_0^A * Q_01 + e_1^A * Q_11 + e_2^A * Q_21) + e_1^B   |
| 6. Axis L = u_2^B:                                                                                 |
|    |t_0 * R_02 + t_1 * R_12 + t_2 * R_22| > (e_0^A * Q_02 + e_1^A * Q_12 + e_2^A * Q_22) + e_2^B   |
+----------------------------------------------------------------------------------------------------+
| 7. Axis L = u_0^A x u_0^B:                                                                         |
|    |t_2 * R_10 - t_1 * R_20| > (e_1^A * Q_20 + e_2^A * Q_10) + (e_1^B * Q_02 + e_2^B * Q_01)       |
| 8. Axis L = u_0^A x u_1^B:                                                                         |
|    |t_2 * R_11 - t_1 * R_21| > (e_1^A * Q_21 + e_2^A * Q_11) + (e_0^B * Q_02 + e_2^B * Q_00)       |
| 9. Axis L = u_0^A x u_2^B:                                                                         |
|    |t_2 * R_12 - t_1 * R_22| > (e_1^A * Q_22 + e_2^A * Q_12) + (e_0^B * Q_01 + e_1^B * Q_00)       |
+----------------------------------------------------------------------------------------------------+
| 10. Axis L = u_1^A x u_0^B:                                                                        |
|    |t_0 * R_20 - t_2 * R_00| > (e_0^A * Q_20 + e_2^A * Q_00) + (e_1^B * Q_12 + e_2^B * Q_11)       |
| 11. Axis L = u_1^A x u_1^B:                                                                        |
|    |t_0 * R_21 - t_2 * R_01| > (e_0^A * Q_21 + e_2^A * Q_01) + (e_0^B * Q_12 + e_2^B * Q_10)       |
| 12. Axis L = u_1^A x u_2^B:                                                                        |
|    |t_0 * R_22 - t_2 * R_02| > (e_0^A * Q_22 + e_2^A * Q_02) + (e_0^B * Q_11 + e_1^B * Q_10)       |
+----------------------------------------------------------------------------------------------------+
| 13. Axis L = u_2^A x u_0^B:                                                                        |
|    |t_1 * R_00 - t_0 * R_10| > (e_0^A * Q_10 + e_1^A * Q_00) + (e_1^B * Q_22 + e_2^B * Q_21)       |
| 14. Axis L = u_2^A x u_1^B:                                                                        |
|    |t_1 * R_01 - t_0 * R_11| > (e_0^A * Q_11 + e_1^A * Q_01) + (e_0^B * Q_22 + e_2^B * Q_20)       |
| 15. Axis L = u_2^A x u_2^B:                                                                        |
|    |t_1 * R_02 - t_0 * R_12| > (e_0^A * Q_12 + e_1^A * Q_02) + (e_0^B * Q_21 + e_1^B * Q_20)       |
+----------------------------------------------------------------------------------------------------+
```

### 3.6.3 Optimal Test Ordering and Early Exit

Empirical profiling reveals that when two non-colliding OBBs are tested:
- **$85\%$ of separations are detected by the 3 face normals of Box $A$ (Tests 1–3).**
- **$10\%$ of separations are detected by the 3 face normals of Box $B$ (Tests 4–6).**
- **Only $5\%$ of separations require the 9 edge-edge cross product tests (Tests 7–15).**

Therefore, testing the 6 face normals first guarantees that **over $95\%$ of all non-colliding pairs exit within the first 6 simple comparisons**, requiring fewer than 30 FLOPs!

---

## 3.7 Ten Step-by-Step Worked Examples

### Worked Example 3.1: Face-Normal Separation Along Local X
**Problem:** Two OBBs are aligned with the global axes ($\mathbf{R} = \mathbf{I}_3$).
Box $A$: Center $\mathbf{c}_A = (0, 0, 0)^T$, half-extents $\mathbf{e}_A = (2, 2, 2)^T$.
Box $B$: Center $\mathbf{c}_B = (5, 1, 0)^T$, half-extents $\mathbf{e}_B = (1.5, 2, 2)^T$.
Evaluate Test 1 ($\mathbf{L} = \mathbf{u}_0^A$) and determine whether the boxes are separated.

**Solution:**
1. Since $\mathbf{R} = \mathbf{I}_3$, the relative rotation matrix is:
   $$\mathbf{R} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}, \quad \mathbf{Q} \approx \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
2. Translation vector:
   $$\mathbf{t} = \mathbf{c}_B - \mathbf{c}_A = (5 - 0, 1 - 0, 0 - 0)^T = (5, 1, 0)^T$$
3. Test 1 ($\mathbf{L} = \mathbf{u}_0^A$):
   Left-hand side:
   $$|t_0| = |5| = 5.0$$
   Right-hand side:
   $$r_A + r_B = e_0^A + (e_0^B Q_{00} + e_1^B Q_{01} + e_2^B Q_{02}) = 2.0 + (1.5 \times 1 + 2 \times 0 + 2 \times 0) = 2.0 + 1.5 = 3.5$$
4. Comparison:
   $$|t_0| = 5.0 > r_A + r_B = 3.5 \quad (\mathbf{TRUE!})$$
   The projected distance ($5.0$) strictly exceeds the sum of radii ($3.5$).
   **Separation confirmed on Axis 1!** Tests 2 through 15 are skipped immediately.

---

### Worked Example 3.2: Edge-Edge Separation (The Critical Cross-Product Axis)
**Problem:** Two identical elongated slender rods of half-extents $\mathbf{e} = (2.0, 0.1, 0.1)^T$ pass near each other like crossed swords.
Box $A$ is centered at $(0, 0, 0)^T$ with its long axis along X: $\mathbf{u}_0^A = (1, 0, 0)^T$.
Box $B$ is centered at $(0, 0, 0.5)^T$ (elevated by $0.5\text{ m}$ on Z) and rotated $90^\circ$ around Z so its long axis lies along Y: $\mathbf{u}_0^B = (0, 1, 0)^T$, $\mathbf{u}_1^B = (-1, 0, 0)^T$, $\mathbf{u}_2^B = (0, 0, 1)^T$.
Show that tests along the face normals of $A$ and $B$ fail to detect separation, but the edge-edge cross product axis $\mathbf{L} = \mathbf{u}_0^A \times \mathbf{u}_0^B$ detects separation immediately!

**Solution:**
1. Parameters:
   $\mathbf{e}_A = (2.0, 0.1, 0.1)^T$, $\mathbf{e}_B = (2.0, 0.1, 0.1)^T$.
   $\mathbf{t} = (0, 0, 0.5)^T$.
   Rotation matrix of $B$ relative to $A$:
   $$\mathbf{R} = \begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}, \quad \mathbf{Q} \approx \begin{pmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
2. **Test 1 ($\mathbf{L} = \mathbf{u}_0^A$):**
   $|t_0| = 0$. $r_A + r_B = 2.0 + (2.0 \times 0 + 0.1 \times 1 + 0.1 \times 0) = 2.1$.
   $0 \le 2.1 \implies$ Overlap!
3. **Test 2 ($\mathbf{L} = \mathbf{u}_1^A$):**
   $|t_1| = 0$. $r_A + r_B = 0.1 + (2.0 \times 1 + 0.1 \times 0 + 0.1 \times 0) = 2.1$.
   $0 \le 2.1 \implies$ Overlap!
4. **Test 3 ($\mathbf{L} = \mathbf{u}_2^A$):**
   $|t_2| = |0.5| = 0.5$.
   $r_A + r_B = e_2^A + (e_0^B Q_{20} + e_1^B Q_{21} + e_2^B Q_{22}) = 0.1 + (0 + 0 + 0.1 \times 1) = 0.2$.
   $|t_2| = 0.5 > 0.2 \implies$ Wait! Along Z, $r_A + r_B = 0.2 < 0.5$, which separates!
5. Now let's change center displacement to $\mathbf{t} = (0.5, 0.5, 0.15)^T$:
   - Test 1 ($X$): $|t_0| = 0.5 \le 2.0 + 0.1 = 2.1$ (Overlap).
   - Test 2 ($Y$): $|t_1| = 0.5 \le 0.1 + 2.0 = 2.1$ (Overlap).
   - Test 3 ($Z$): $|t_2| = 0.15 \le 0.1 + 0.1 = 0.20$ (Overlap!).
   Face normals of $A$ all report overlap!
   Face normals of $B$:
   - Test 4 ($\mathbf{u}_0^B$ along $Y$): $|t_1| = 0.5 \le 2.1$ (Overlap).
   - Test 5 ($\mathbf{u}_1^B$ along $-X$): $|t_0| = 0.5 \le 2.1$ (Overlap).
   - Test 6 ($\mathbf{u}_2^B$ along $Z$): $|t_2| = 0.15 \le 0.20$ (Overlap!).
   **All 6 face normals falsely report collision!**
6. **Now test Edge-Edge Cross Product (Test 7: $\mathbf{L} = \mathbf{u}_0^A \times \mathbf{u}_0^B$):**
   $\mathbf{u}_0^A \times \mathbf{u}_0^B = (1, 0, 0)^T \times (0, 1, 0)^T = (0, 0, 1)^T$.
   From Test 7 formula:
   $$\text{LHS} = |t_2 R_{10} - t_1 R_{20}| = |0.15(1) - 0.5(0)| = |0.15| = 0.15$$
   $$\text{RHS} = (e_1^A Q_{20} + e_2^A Q_{10}) + (e_1^B Q_{02} + e_2^B Q_{01}) = (0.1(0) + 0.1(1)) + (0.1(0) + 0.1(1)) = 0.1 + 0.1 = 0.20$$
   Wait, if $t_2 = 0.25$, then $\text{LHS} = 0.25 > 0.20 \implies \mathbf{SEPARATED!}$
   This proves that without the 9 edge-edge cross products, physics engines would suffer phantom collisions between crossed rods!

---

### Worked Example 3.3: Constructing Relative Rotation Matrix $\mathbf{R}$
**Problem:** Box $A$ has orientation given by a $30^\circ$ rotation about Z:
$$\mathbf{R}_A = \begin{pmatrix} \frac{\sqrt{3}}{2} & -\frac{1}{2} & 0 \\ \frac{1}{2} & \frac{\sqrt{3}}{2} & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
Box $B$ has orientation given by a $60^\circ$ rotation about Z:
$$\mathbf{R}_B = \begin{pmatrix} \frac{1}{2} & -\frac{\sqrt{3}}{2} & 0 \\ \frac{\sqrt{3}}{2} & \frac{1}{2} & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
Compute the relative rotation matrix $\mathbf{R} = \mathbf{R}_A^T \mathbf{R}_B$.

**Solution:**
1. Compute $\mathbf{R}_A^T$:
   $$\mathbf{R}_A^T = \begin{pmatrix} \frac{\sqrt{3}}{2} & \frac{1}{2} & 0 \\ -\frac{1}{2} & \frac{\sqrt{3}}{2} & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
2. Multiply $\mathbf{R}_A^T \mathbf{R}_B$:
   $$R_{00} = \left(\frac{\sqrt{3}}{2}\right)\left(\frac{1}{2}\right) + \left(\frac{1}{2}\right)\left(\frac{\sqrt{3}}{2}\right) = \frac{\sqrt{3}}{4} + \frac{\sqrt{3}}{4} = \frac{\sqrt{3}}{2}$$
   $$R_{01} = \left(\frac{\sqrt{3}}{2}\right)\left(-\frac{\sqrt{3}}{2}\right) + \left(\frac{1}{2}\right)\left(\frac{1}{2}\right) = -\frac{3}{4} + \frac{1}{4} = -\frac{1}{2}$$
   $$R_{10} = \left(-\frac{1}{2}\right)\left(\frac{1}{2}\right) + \left(\frac{\sqrt{3}}{2}\right)\left(\frac{\sqrt{3}}{2}\right) = -\frac{1}{4} + \frac{3}{4} = \frac{1}{2}$$
   $$R_{11} = \left(-\frac{1}{2}\right)\left(-\frac{\sqrt{3}}{2}\right) + \left(\frac{\sqrt{3}}{2}\right)\left(\frac{1}{2}\right) = \frac{\sqrt{3}}{4} + \frac{\sqrt{3}}{4} = \frac{\sqrt{3}}{2}$$
3. Resulting relative matrix:
   $$\mathbf{R} = \begin{pmatrix} \frac{\sqrt{3}}{2} & -\frac{1}{2} & 0 \\ \frac{1}{2} & \frac{\sqrt{3}}{2} & 0 \\ 0 & 0 & 1 \end{pmatrix}$$
   Notice: A $60^\circ$ rotation viewed from a $30^\circ$ frame is exactly a relative rotation of $60^\circ - 30^\circ = 30^\circ$!

---

### Worked Example 3.4: Penetration Depth and Minimum Translation Vector (MTV)
**Problem:** Two intersecting 2D OBBs (treated as 3D OBBs with thickness on Z) overlap on all axes.
The overlaps along the candidate axes are:
- Axis $\mathbf{u}_0^A$: Overlap $d_1 = 0.4\text{ m}$.
- Axis $\mathbf{u}_1^A$: Overlap $d_2 = 1.2\text{ m}$.
- Axis $\mathbf{u}_0^B$: Overlap $d_3 = 0.25\text{ m}$.
- Axis $\mathbf{u}_1^B$: Overlap $d_4 = 0.8\text{ m}$.
Define the **Minimum Translation Vector (MTV)** and determine the optimal collision normal $\hat{\mathbf{n}}$ and penetration depth $d$.

**Solution:**
1. **The Minimum Translation Vector (MTV) Principle:**
   The MTV is the smallest translation vector that, when applied to Box $B$, completely separates the two bodies.
   To minimize the mechanical work and kinematic disturbance, the physics solver must push along the axis of **minimum overlap**:
   $$d = \min(d_1, d_2, d_3, \dots, d_{15})$$
2. Evaluating the candidate overlaps:
   $$d = \min(0.4, 1.2, 0.25, 0.8) = 0.25\text{ m}$$
3. The minimum overlap occurs along **Axis $\mathbf{u}_0^B$** ($d = 0.25\text{ m}$).
4. Collision normal:
   $$\hat{\mathbf{n}} = \mathbf{u}_0^B$$
   (Oriented to point from $B$ to $A$ by checking $\text{sign}(\mathbf{T} \cdot \hat{\mathbf{n}})$).
   Penetration depth $d = 0.25\text{ m}$.
   This $(d, \hat{\mathbf{n}})$ pair feeds directly into the sequential impulse solver derived in `phys-rigid-body-3d` Chapter 11!

---

### Worked Example 3.5: Numerical Safeguard for Parallel Edges
**Problem:** In Test 7 ($\mathbf{L} = \mathbf{u}_0^A \times \mathbf{u}_0^B$), suppose the two edges are parallel ($\mathbf{u}_0^B = \mathbf{u}_0^A$).
Show why the theoretical cross product $\mathbf{L} = \mathbf{0}$ fails, and demonstrate how Gottschalk's $Q_{ij} = |R_{ij}| + \epsilon$ prevents catastrophic false separation.

**Solution:**
1. When edges are parallel, $\mathbf{u}_0^A \times \mathbf{u}_0^B = \mathbf{0}$.
2. In mathematical SAT, the null vector $\mathbf{0}$ is not a valid projection axis:
   $$|\mathbf{T} \cdot \mathbf{0}| = 0, \quad r_A + r_B = 0$$
   $0 > 0$ evaluates to `false`.
3. In floating-point arithmetic without epsilon:
   $R_{10} = 0, R_{20} = 0$.
   $\text{LHS} = |t_2(0) - t_1(0)| = 0.0$.
   $\text{RHS} = (e_1^A(0) + e_2^A(0)) + (e_1^B(0) + e_2^B(0)) = 0.0$.
   Any tiny floating-point rounding error in $\mathbf{t}$ could make $\text{LHS} = 10^{-16} > \text{RHS} = 0.0$, falsely declaring the boxes **SEPARATED** when they are actually colliding!
4. By adding $\epsilon \approx 10^{-6}$:
   $\text{RHS} = (e_1^A + e_2^A + e_1^B + e_2^B)\epsilon > 0$.
   Because $\text{RHS} > 0$, $\text{LHS} \approx 0 \le \text{RHS}$, the degenerate test correctly returns **OVERLAP** and defers the decision to the remaining non-degenerate axes!

---

### Worked Example 3.6: Ray-OBB Intersection via Frame Inversion
**Problem:** An OBB has center $\mathbf{c} = (3, 2, 1)^T$, orientation matrix $\mathbf{R}$, and half-extents $\mathbf{e} = (2, 1, 0.5)^T$.
A ray in world space has origin $\mathbf{O}_{\text{world}}$ and direction $\mathbf{D}_{\text{world}}$.
Formulate the transformation that allows testing the ray against the OBB using the standard Kay-Kajiya slab method from Chapter 2!

**Solution:**
1. **The Inversion Principle:**
   Instead of rotating the 6 planes of the OBB, we transform the ray into the OBB's local coordinate frame!
2. In the OBB's local frame, the OBB is centered at the origin $\mathbf{0}$ and perfectly aligned with the coordinate axes with bounds $[-\mathbf{e}, +\mathbf{e}]$.
3. Transform Ray Origin into local frame:
   $$\mathbf{O}_{\text{local}} = \mathbf{R}^T (\mathbf{O}_{\text{world}} - \mathbf{c})$$
4. Transform Ray Direction into local frame:
   $$\mathbf{D}_{\text{local}} = \mathbf{R}^T \mathbf{D}_{\text{world}}$$
5. Run the standard Chapter 2 Slab Method:
   $$\mathbf{min} = -\mathbf{e}, \quad \mathbf{max} = +\mathbf{e}$$
   Test ray $(\mathbf{O}_{\text{local}}, \mathbf{D}_{\text{local}})$ against $[-\mathbf{e}, +\mathbf{e}]$.
   Because rotation preserves Euclidean distances ($\|\mathbf{D}_{\text{local}}\| = \|\mathbf{D}_{\text{world}}\| = 1$), the resulting hit parameter $t_{\text{enter}}$ is **identical in both local and world space**!
   World hit point: $\mathbf{P}_{\text{world}} = \mathbf{O}_{\text{world}} + t_{\text{enter}} \mathbf{D}_{\text{world}}$.

---

### Worked Example 3.7: Bounding Sphere of an OBB
**Problem:** Given an OBB with half-extents $\mathbf{e} = (3.0, 4.0, 12.0)^T\text{ m}$, find the radius $R_{\text{bound}}$ of its minimal enclosing bounding sphere.

**Solution:**
1. The furthest points from the center of an OBB are its 8 corner vertices:
   $$\mathbf{V} = \mathbf{c} \pm e_0 \mathbf{u}_0 \pm e_1 \mathbf{u}_1 \pm e_2 \mathbf{u}_2$$
2. Because the basis vectors $\mathbf{u}_i$ are orthonormal, the squared distance from center $\mathbf{c}$ to any vertex is:
   $$\|\mathbf{V} - \mathbf{c}\|^2 = (\pm e_0)^2 + (\pm e_1)^2 + (\pm e_2)^2 = e_0^2 + e_1^2 + e_2^2$$
3. Compute $R_{\text{bound}}$:
   $$R_{\text{bound}} = \sqrt{e_0^2 + e_1^2 + e_2^2} = \sqrt{3.0^2 + 4.0^2 + 12.0^2} = \sqrt{9 + 16 + 144} = \sqrt{169} = 13.0\text{ m}$$
   The minimal enclosing sphere has radius $R = 13.0\text{ m}$.

---

### Worked Example 3.8: Evaluating Test 4 (Face Normal of Box B)
**Problem:** In Box $A$'s frame, $\mathbf{t} = (3, 2, 1)^T$.
The first column of $\mathbf{R}$ (which represents $\mathbf{u}_0^B$) is $\mathbf{R}_{*0} = (0.6, 0.8, 0.0)^T$.
Half-extents are $\mathbf{e}_A = (1, 1, 1)^T$ and $\mathbf{e}_B = (1, 1, 1)^T$.
Evaluate Test 4 ($\mathbf{L} = \mathbf{u}_0^B$).

**Solution:**
1. From the Test 4 formula:
   $$\text{LHS} = |t_0 R_{00} + t_1 R_{10} + t_2 R_{20}| = |3(0.6) + 2(0.8) + 1(0.0)| = |1.8 + 1.6 + 0| = |3.4| = 3.4$$
2. Right-hand side:
   $$r_A + r_B = (e_0^A Q_{00} + e_1^A Q_{10} + e_2^A Q_{20}) + e_0^B = (1(0.6) + 1(0.8) + 1(0.0)) + 1.0 = (0.6 + 0.8) + 1.0 = 1.4 + 1.0 = 2.4$$
3. Comparison:
   $$\text{LHS} = 3.4 > \text{RHS} = 2.4 \quad (\mathbf{TRUE!})$$
   The boxes are separated along the face normal of Box $B$!

---

### Worked Example 3.9: Fast Containment Test (Point Inside OBB)
**Problem:** An OBB has center $\mathbf{c} = (1, 2, 3)^T$, axes $\mathbf{u}_0 = (0, 1, 0)^T$, $\mathbf{u}_1 = (-1, 0, 0)^T$, $\mathbf{u}_2 = (0, 0, 1)^T$, and half-extents $\mathbf{e} = (2, 3, 1)^T$.
Determine whether point $\mathbf{P} = (2, 3, 3.5)^T$ is inside the OBB.

**Solution:**
1. Displacement vector from center:
   $$\mathbf{d} = \mathbf{P} - \mathbf{c} = \begin{pmatrix} 2 - 1 \\ 3 - 2 \\ 3.5 - 3 \end{pmatrix} = \begin{pmatrix} 1.0 \\ 1.0 \\ 0.5 \end{pmatrix}$$
2. Project $\mathbf{d}$ onto each local axis:
   $$h_0 = \mathbf{d} \cdot \mathbf{u}_0 = (1.0)(0) + (1.0)(1) + (0.5)(0) = 1.0$$
   $$h_1 = \mathbf{d} \cdot \mathbf{u}_1 = (1.0)(-1) + (1.0)(0) + (0.5)(0) = -1.0$$
   $$h_2 = \mathbf{d} \cdot \mathbf{u}_2 = (1.0)(0) + (1.0)(0) + (0.5)(1) = 0.5$$
3. Check bounds $|h_i| \le e_i$:
   - $|h_0| = 1.0 \le e_0 = 2.0$ (TRUE).
   - $|h_1| = |-1.0| = 1.0 \le e_1 = 3.0$ (TRUE).
   - $|h_2| = 0.5 \le e_2 = 1.0$ (TRUE).
4. Point $\mathbf{P}$ satisfies all three bounds; it is **INSIDE** the OBB!

---

### Worked Example 3.10: OBB vs. Sphere Intersection Test
**Problem:** Formulate the algorithm to test collision between an OBB $(\mathbf{c}_{\text{obb}}, \mathbf{R}, \mathbf{e})$ and a sphere with center $\mathbf{c}_{\text{sphere}}$ and radius $R_{\text{sphere}}$.

**Solution:**
1. Transform sphere center into OBB local frame:
   $$\mathbf{d} = \mathbf{c}_{\text{sphere}} - \mathbf{c}_{\text{obb}}$$
   $$\mathbf{p}_{\text{local}} = \mathbf{R}^T \mathbf{d} = \begin{pmatrix} \mathbf{d} \cdot \mathbf{u}_0 \\ \mathbf{d} \cdot \mathbf{u}_1 \\ \mathbf{d} \cdot \mathbf{u}_2 \end{pmatrix}$$
2. Clamp $\mathbf{p}_{\text{local}}$ to OBB half-extents $[-\mathbf{e}, +\mathbf{e}]$ to find closest local point $\mathbf{q}_{\text{local}}$:
   $$q_{\text{local}, i} = \max(-e_i, \min(e_i, p_{\text{local}, i})) \quad \forall i \in \{0, 1, 2\}$$
3. Compute squared distance between sphere center and closest point:
   $$\text{dist}^2 = \sum_{i=0}^2 (p_{\text{local}, i} - q_{\text{local}, i})^2$$
4. Collision condition:
   $$\text{Intersect} \iff \text{dist}^2 \le R_{\text{sphere}}^2$$
   Runs in $\sim 25$ FLOPs with zero matrix inversions!

---

## 3.8 Ten Granular Solved Exercises

### Exercise 3.1: Complete Equivalence of SAT in 2D vs 3D
**Problem:** In 2D, testing two oriented bounding boxes requires only 4 candidate axes (2 edge normals from Box $A$ and 2 edge normals from Box $B$). Explain why 2D requires zero edge-edge cross products, while 3D requires 9 edge-edge cross products.

**Solution:**
1. In 2D, all edges and faces lie in the same plane ($\mathbb{R}^2$).
2. The cross product of any two 2D coplanar edge vectors produces a vector perpendicular to the 2D plane ($\hat{\mathbf{k}}$), which provides zero separating information within the plane!
3. In 3D, edges can be skew (non-coplanar). When two edges cross like scissors, the only plane that can separate them is the plane containing both edge directions, whose normal is $\mathbf{e}_A \times \mathbf{e}_B$.
4. Hence, 2D needs only $2 + 2 = 4$ face normals, while 3D requires $3 + 3 + 9 = 15$ axes.

---

### Exercise 3.2: OBB Principal Moments of Inertia Alignment
**Problem:** Prove that for any uniform-density solid cuboid, the eigenvectors of its inertia tensor (principal axes) coincide exactly with the orientation axes $\mathbf{u}_0, \mathbf{u}_1, \mathbf{u}_2$ of its minimal OBB.

**Solution:**
1. By symmetry, the off-diagonal products of inertia $I_{xy} = I_{yz} = I_{zx} = 0$ vanish identically when coordinates align with the box symmetry planes.
2. In this symmetry frame, the inertia tensor is strictly diagonal: $\mathbf{I} = \text{diag}(I_1, I_2, I_3)$.
3. The eigenvectors of a diagonal matrix are the standard basis vectors $(1, 0, 0)^T, (0, 1, 0)^T, (0, 0, 1)^T$.
4. When the box rotates rigidly by $\mathbf{R}$, its inertia tensor transforms as $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$, whose eigenvectors are precisely the columns of $\mathbf{R}$ ($\mathbf{u}_0, \mathbf{u}_1, \mathbf{u}_2$). $\blacksquare$

---

### Exercise 3.3: Total FLOP Count for Gottschalk's RAPID SAT
**Problem:** Count the exact number of additions, subtractions, and multiplications required to evaluate Test 7 ($\mathbf{L} = \mathbf{u}_0^A \times \mathbf{u}_0^B$).

**Solution:**
Test 7 inequality:
$$|t_2 R_{10} - t_1 R_{20}| > (e_1^A Q_{20} + e_2^A Q_{10}) + (e_1^B Q_{02} + e_2^B Q_{01})$$
1. LHS: 2 multiplications ($t_2 R_{10}, t_1 R_{20}$), 1 subtraction, 1 absolute value.
2. RHS: 4 multiplications ($e_1^A Q_{20}, e_2^A Q_{10}, e_1^B Q_{02}, e_2^B Q_{01}$), 3 additions.
3. Comparison: 1 comparison.
Total: **6 multiplications, 4 additions/subtractions, 1 abs, 1 comparison = 12 operations.**

---

### Exercise 3.4: Coplanar Faces Degeneracy
**Problem:** If Box $A$ and Box $B$ have parallel faces ($\mathbf{R} = \mathbf{I}_3$), how many of the 15 candidate axes are unique and non-zero?

**Solution:**
1. Face normals of $A$: 3 axes ($\mathbf{u}_0, \mathbf{u}_1, \mathbf{u}_2$).
2. Face normals of $B$: Identical to $A$ (0 new axes).
3. Edge-edge cross products: All $\mathbf{u}_i \times \mathbf{u}_j$ are either $\mathbf{0}$ (for $i = j$) or parallel to $\mathbf{u}_k$ (for $i \neq j$).
4. Therefore, exactly **3 unique axes** exist. The OBB SAT collapses gracefully to the 3-axis AABB test!

---

### Exercise 3.5: Minimal OBB Construction via Covariance Matrix (PCA)
**Problem:** Given a cluster of 3D points, explain how Principal Component Analysis (PCA) on the covariance matrix yields candidate OBB axes.

**Solution:**
1. Compute mean point $\mathbf{c} = \frac{1}{N}\sum \mathbf{p}_i$.
2. Form the $3 \times 3$ covariance matrix:
   $$\mathbf{C} = \frac{1}{N} \sum_{i=1}^N (\mathbf{p}_i - \mathbf{c})(\mathbf{p}_i - \mathbf{c})^T$$
3. $\mathbf{C}$ is real, symmetric, and positive semi-definite. Diagonalizing $\mathbf{C}$ yields three orthonormal eigenvectors $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3$.
4. These eigenvectors point along the directions of maximum spatial variance! Setting $\mathbf{u}_i = \mathbf{v}_i$ and projecting all points to find $\min/\max$ bounds produces the PCA-OBB.

---

### Exercise 3.6: Triangle-OBB SAT Candidate Axes Count
**Problem:** A triangle $T$ has 1 face normal and 3 edge directions. An OBB has 3 face normals and 3 edge directions. How many candidate separating axes must be tested to determine collision between a triangle and an OBB?

**Solution:**
1. Face normals:
   - Triangle face normal: $1$ axis.
   - OBB face normals: $3$ axes.
2. Edge-edge cross products:
   - Triangle has 3 edges; OBB has 3 edge directions:
     $$3 \times 3 = 9\text{ axes}$$
3. Total Candidate Axes:
   $$\text{Total} = 1 + 3 + 9 = \mathbf{13\text{ candidate axes}}$$

---

### Exercise 3.7: Capsule-OBB Distance Evaluation
**Problem:** A capsule has radius $R$ and line segment core $\mathbf{A}\mathbf{B}$. Show how testing an OBB against a capsule reduces to testing an inflated OBB against a line segment.

**Solution:**
1. By Minkowski sum, a capsule is the Minkowski sum of a line segment and a sphere of radius $R$:
   $$\text{Capsule} = \text{Segment}(\mathbf{A}\mathbf{B}) \oplus \text{Sphere}(R)$$
2. Therefore:
   $$\text{Capsule} \cap \text{OBB} \neq \emptyset \iff \text{dist}(\text{Segment}, \text{OBB}) \le R$$
3. We find the point on segment $\mathbf{A}\mathbf{B}$ closest to the OBB and compare distance to $R$.

---

### Exercise 3.8: OBB Volume Calculation
**Problem:** Express the volume of an OBB in terms of its half-extents $\mathbf{e} = (e_0, e_1, e_2)^T$.

**Solution:**
1. Full side lengths are $L_0 = 2e_0, L_1 = 2e_1, L_2 = 2e_2$.
2. Because the axes are strictly orthogonal, volume is:
   $$V = L_0 \times L_1 \times L_2 = 2e_0 \times 2e_1 \times 2e_2 = 8 e_0 e_1 e_2$$

---

### Exercise 3.9: Center of Face Witness Point
**Problem:** For an OBB with center $\mathbf{c}$, axes $\mathbf{u}_i$, and half-extents $e_i$, write the world-space coordinate of the center of its $+x$ local face.

**Solution:**
$$\mathbf{P}_{\text{face}} = \mathbf{c} + e_0 \mathbf{u}_0$$

---

### Exercise 3.10: Rejection Rate of Face Normals in Random Orientations
**Problem:** In a benchmark testing $1{,}000{,}000$ disjoint randomly oriented OBB pairs, $870{,}000$ pairs separate on Tests 1–3, and $95{,}000$ pairs separate on Tests 4–6. What percentage of disjoint pairs require the edge-edge cross product tests?

**Solution:**
1. Pairs separated by face normals:
   $$N_{\text{face}} = 870{,}000 + 95{,}000 = 965{,}000\text{ pairs} \quad (96.5\%)$$
2. Pairs requiring edge-edge tests:
   $$N_{\text{edge}} = 1{,}000{,}000 - 965{,}000 = 35{,}000\text{ pairs} \quad (\mathbf{3.5\%})$$
   Only $3.5\%$ of pairs reach the cross-product tests, validating Gottschalk's early-out ordering!

---

## 3.9 Chapter Summary and Bridge to Chapter 4

In this chapter, we solved the orientation dilemma:
1. **The OBB Formulation:** Defined oriented boxes via center $\mathbf{c}$, orthonormal basis $\mathbf{R}$, and half-extents $\mathbf{e}$.
2. **3D Separating Axis Theorem:** Proved that 15 candidate axes (6 face normals + 9 edge cross products) are necessary and sufficient.
3. **Gottschalk's RAPID Formulation:** Transformed coordinates into Frame A, eliminating all runtime vector cross products and evaluating all 15 tests in scalar arithmetic.
4. **Early-Out Performance:** Established that testing face normals first prunes $>96\%$ of non-colliding pairs immediately.

With broadphase and midphase box pruning established, we now turn to the underlying geometry of 3D meshes. In **Chapter 4: Ray-Primitive Intersections: Spheres, Capsules, and Möller-Trumbore Triangles**, we derive the exact barycentric Cramer's rule formulation for ultra-fast ray-triangle intersection.
