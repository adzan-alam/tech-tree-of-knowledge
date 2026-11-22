# Chapter 5: The Gilbert-Johnson-Keerthi (GJK) Algorithm in 3D

> *"In the geometry of shapes, the difference between two bodies is itself a body. If that difference envelops the origin, the bodies touch; if the origin lies without, the shortest path from the boundary to the void measures their separation."*
> — **Elmer G. Gilbert, Daniel W. Johnson, & S. Sathiya Keerthi**, *A Fast Procedure for Computing the Distance Between Complex Objects in Three-Dimensional Space* (IEEE J. Robotics and Automation, 1988)

---

## 5.1 Convex Sets and Support Mappings

In classical collision detection, polygon-polygon and mesh-mesh intersection algorithms often suffer from combinatorial complexity scaling with the product of vertex counts $\mathcal{O}(N_A \cdot N_B)$. In 1988, roboticists Elmer Gilbert, Daniel Johnson, and S. Sathiya Keerthi revolutionized computational geometry by formulating the **GJK Algorithm**.

GJK solves the collision and distance problem for **any pair of convex shapes** in sub-linear time—typically converging in only $3\text{ to }6$ iterations regardless of geometric complexity!

### 5.1.1 The Axiom of Convexity

A geometric subset $\mathcal{C} \subset \mathbb{R}^3$ is defined as **strictly convex** if, for every pair of points $\mathbf{x}, \mathbf{y} \in \mathcal{C}$, the entire straight-line segment connecting them is contained wholly within $\mathcal{C}$:

$$\forall \mathbf{x}, \mathbf{y} \in \mathcal{C}, \quad \forall \lambda \in [0, 1] \implies (1 - \lambda)\mathbf{x} + \lambda \mathbf{y} \in \mathcal{C}$$

Convex shapes encompass spheres, ellipsoids, boxes, cylinders, capsules, cones, convex polyhedra, and arbitrary convex hulls.

```
       Convex Shape:                   Non-Convex (Concave) Shape:
          .-------.                          .-------.
        .'         `.                      .'    /\   `.
       /   x-----y   \                    /     /  \    \
      |   (Segment    |                  |  x--/----\--y |  (Segment leaves
       \   inside)   /                    \   / Cavity\ /    shape!)
        `.         .'                      `./         `'
          `-------'
```

### 5.1.2 The Support Function and Support Mapping

The mathematical engine powering GJK is the **Support Mapping** (also known as the extreme point mapping or Gilbert mapping).

Let $\mathcal{C} \subset \mathbb{R}^3$ be a closed convex set, and let $\mathbf{d} \in \mathbb{R}^3$ ($\|\mathbf{d}\| \neq 0$) be an arbitrary query direction vector.

The **Support Function** $h_{\mathcal{C}}(\mathbf{d})$ returns the maximum projected scalar distance of any point in $\mathcal{C}$ along direction $\mathbf{d}$:

$$h_{\mathcal{C}}(\mathbf{d}) = \max_{\mathbf{x} \in \mathcal{C}} (\mathbf{x} \cdot \mathbf{d})$$

The **Support Mapping** $S_{\mathcal{C}}(\mathbf{d})$ returns the actual geometric point on the boundary of $\mathcal{C}$ that achieves this maximum:

$$\boxed{S_{\mathcal{C}}(\mathbf{d}) = \arg\max_{\mathbf{x} \in \mathcal{C}} (\mathbf{x} \cdot \mathbf{d})}$$

```
                          THE SUPPORT MAPPING
                                            d (Search Direction)
                                           --->
                                  .-------.
                                .'         * S_C(d) (Extreme Point)
                               /            |
                              |   Shape C   | Supporting Hyperplane
                               \            | (perpendicular to d)
                                `.         .'
                                  `-------'
```

### 5.1.3 Closed-Form Support Mappings for Canonical Primitives

The genius of GJK is that shapes do not need to be represented as meshes with topological edge/face tables. A shape is fully defined by its 1-line mathematical support function!

#### 1. Sphere (Center $\mathbf{c}$, Radius $R$)
The extreme point in direction $\mathbf{d}$ lies along the ray from the center:
$$\boxed{S_{\text{sphere}}(\mathbf{d}) = \mathbf{c} + R \frac{\mathbf{d}}{\|\mathbf{d}\|}}$$

#### 2. Axis-Aligned Box (Center $\mathbf{c}$, Half-Extents $\mathbf{e}$)
The extreme point is the corner whose signs match the signs of $\mathbf{d}$:
$$\boxed{S_{\text{aabb}}(\mathbf{d}) = \mathbf{c} + \begin{pmatrix} \text{sign}(d_x) e_x \\ \text{sign}(d_y) e_y \\ \text{sign}(d_z) e_z \end{pmatrix}}$$

#### 3. Oriented Bounding Box (Center $\mathbf{c}$, Axes $\mathbf{u}_i$, Half-Extents $e_i$)
Project $\mathbf{d}$ onto each local axis:
$$\boxed{S_{\text{obb}}(\mathbf{d}) = \mathbf{c} + \sum_{i=0}^2 \text{sign}(\mathbf{d} \cdot \mathbf{u}_i) e_i \mathbf{u}_i}$$

#### 4. Capsule (Line Segment $\mathbf{A}\mathbf{B}$, Radius $R$)
Choose whichever endpoint projects further along $\mathbf{d}$, then add spherical radius:
$$\mathbf{P}_{\text{base}} = (\mathbf{A} \cdot \mathbf{d} > \mathbf{B} \cdot \mathbf{d}) \, ? \, \mathbf{A} : \mathbf{B}$$
$$\boxed{S_{\text{capsule}}(\mathbf{d}) = \mathbf{P}_{\text{base}} + R \frac{\mathbf{d}}{\|\mathbf{d}\|}}$$

#### 5. Convex Polyhedron / Convex Hull ($N$ Vertices $\{\mathbf{V}_1, \dots, \mathbf{V}_N\}$)
Evaluate the dot product across all vertices:
$$\boxed{S_{\text{poly}}(\mathbf{d}) = \arg\max_{\mathbf{V}_k} (\mathbf{V}_k \cdot \mathbf{d})}$$
(Using hill-climbing on adjacency graphs, this evaluates in $\mathcal{O}(1)$ amortized time!).

---

## 5.2 The Minkowski Difference

How do we reduce a complex 3D collision check between two arbitrary moving, rotating bodies $A$ and $B$ into a simple point test?
Through the **Minkowski Difference**.

### 5.2.1 Definition of the Minkowski Difference

The Minkowski Sum of two sets $A, B \subset \mathbb{R}^3$ is the set of all pairwise vector sums:
$$A \oplus B = \{ \mathbf{a} + \mathbf{b} \mid \mathbf{a} \in A, \, \mathbf{b} \in B \}$$

The **Minkowski Difference** (often denoted $A \ominus B$) is the Minkowski sum of $A$ and the reflected set $-B = \{ -\mathbf{b} \mid \mathbf{b} \in B \}$:

$$\boxed{A \ominus B = \{ \mathbf{a} - \mathbf{b} \mid \mathbf{a} \in A, \, \mathbf{b} \in B \}}$$

```
                      THE MINKOWSKI DIFFERENCE CONCEPT
       
        Body A                    Body B             Minkowski Difference (A - B)
       +------+                  .------.                   .------------.
       |  *   |                 /   *    \                .'              `.
       +------+                 `--------'               /        *         \
                                                        |      ORIGIN (0)    |
                                                         \                  /
                                                          `.              .'
                                                            `------------'
                                                   Origin 0 is INSIDE A - B!
                                                   ==> A and B are COLLIDING!
```

### 5.2.2 The Fundamental Collision Invariant

> **Theorem (Minkowski Collision Condition):**
> Two sets $A$ and $B$ intersect if and only if their Minkowski difference contains the origin $\mathbf{0} = (0, 0, 0)^T$:
> $$\boxed{A \cap B \neq \emptyset \iff \mathbf{0} \in (A \ominus B)}$$

**Proof:**
- If $A \cap B \neq \emptyset$, there exists at least one common spatial point $\mathbf{p}$ such that $\mathbf{p} \in A$ and $\mathbf{p} \in B$.
- Form the difference vector: $\mathbf{w} = \mathbf{p} - \mathbf{p} = \mathbf{0}$.
- Because $\mathbf{p} \in A$ and $\mathbf{p} \in B$, $\mathbf{w} \in (A \ominus B)$. Hence $\mathbf{0} \in (A \ominus B)$.
- Conversely, if $\mathbf{0} \in (A \ominus B)$, there exist $\mathbf{a} \in A$ and $\mathbf{b} \in B$ such that $\mathbf{a} - \mathbf{b} = \mathbf{0} \implies \mathbf{a} = \mathbf{b}$. Thus $A$ and $B$ share a point. $\blacksquare$

Furthermore, the minimum Euclidean distance between the sets equals the distance from the origin to the boundary of $A \ominus B$:

$$\text{dist}(A, B) = \min_{\mathbf{a} \in A, \mathbf{b} \in B} \|\mathbf{a} - \mathbf{b}\| = \min_{\mathbf{w} \in (A \ominus B)} \|\mathbf{w}\|$$

### 5.2.3 Linearity of Support Mappings: The Breakthrough

Constructing the explicit 3D boundary mesh of $A \ominus B$ requires $\mathcal{O}(N_A \cdot N_B)$ polygon clipping operations, which is prohibitively slow for real-time physics.

Gilbert, Johnson, and Keerthi proved that **we never need to construct $A \ominus B$ explicitly**! The support mapping of $A \ominus B$ along any direction $\mathbf{d}$ is obtained by querying the two individual shapes independently:

$$S_{A \ominus B}(\mathbf{d}) = \arg\max_{\mathbf{w} \in (A \ominus B)} (\mathbf{w} \cdot \mathbf{d}) = \arg\max_{\mathbf{a} \in A, \mathbf{b} \in B} ((\mathbf{a} - \mathbf{b}) \cdot \mathbf{d})$$

$$= \arg\max_{\mathbf{a} \in A} (\mathbf{a} \cdot \mathbf{d}) - \arg\min_{\mathbf{b} \in B} (\mathbf{b} \cdot \mathbf{d}) = \arg\max_{\mathbf{a} \in A} (\mathbf{a} \cdot \mathbf{d}) - \arg\max_{\mathbf{b} \in B} (\mathbf{b} \cdot (-\mathbf{d}))$$

$$\boxed{S_{A \ominus B}(\mathbf{d}) = S_A(\mathbf{d}) - S_B(-\mathbf{d})}$$

This linear decomposition reduces finding an extreme point of the combined Minkowski difference into **two trivial, independent primitive queries**!

---

## 5.3 Simplexes in $\mathbb{R}^3$

Instead of exploring the entire infinite volume of $A \ominus B$, GJK iteratively builds a sequence of **simplexes** inside $A \ominus B$ that search for the origin.

A **$k$-simplex** is the simplest geometric polytope in $\mathbb{R}^n$ formed by the convex hull of $k + 1$ affinely independent points:

```
                           SIMPLEX HIERARCHY
                           
     0-Simplex (Point)       1-Simplex (Line)       2-Simplex (Triangle)
            *                      *                      * C
            A                     / \                    / \
                                 /   \                  /   \
                                *-----*                *-----*
                                A     B                A     B
                                
                                3-Simplex (Tetrahedron)
                                          * D
                                         /|\
                                        / | \
                                       /  *  \
                                      /  / C  \
                                     *--+------*
                                     A         B
```

- **0-Simplex (1 point):** A single point $\mathbf{A} \in \mathbb{R}^3$.
- **1-Simplex (2 points):** A line segment connecting $\mathbf{A}$ and $\mathbf{B}$.
- **2-Simplex (3 points):** A flat triangle $\triangle \mathbf{A}\mathbf{B}\mathbf{C}$.
- **3-Simplex (4 points):** A solid 3D tetrahedron $\mathbf{A}\mathbf{B}\mathbf{C}\mathbf{D}$ enclosing volumetric space.

By Carathéodory's Theorem, if the origin $\mathbf{0}$ lies inside $A \ominus B$, it can always be enclosed by a simplex of at most $d + 1 = 4$ vertices in $\mathbb{R}^3$!

---

## 5.4 The GJK Loop Architecture

```
+-----------------------------------------------------------------------------------+
|                            THE GJK SIMPLEX LOOP                                   |
+-----------------------------------------------------------------------------------+
| 1. Pick initial search direction d_0 = center_B - center_A                        |
| 2. Fetch first support point: A = S_A(d_0) - S_B(-d_0)                            |
| 3. Simplex W = { A }                                                              |
| 4. Update direction: d = -A (pointing from A toward origin)                       |
| 5. REPEAT:                                                                        |
|    a. A = S_A(d) - S_B(-d)                                                        |
|    b. ADVANCEMENT TEST: If (A . d <= 0) --> RETURN FALSE (Separated!)             |
|    c. W = W U { A }                                                               |
|    d. [DoSimplex]:                                                                |
|       - Find Voronoi feature of W closest to origin 0                             |
|       - Reduce W to the minimal sub-simplex containing closest point              |
|       - If origin is enclosed inside 3-Simplex (Tetrahedron) --> RETURN TRUE!     |
|       - Else: Set d = normal from closest feature toward origin                   |
+-----------------------------------------------------------------------------------+
```

### 5.4.1 The Advancement Termination Test

At each step, GJK fetches a new support point $\mathbf{A} = S_{A \ominus B}(\mathbf{d})$ along the current search direction $\mathbf{d}$ (which points toward the origin).

$$\mathbf{A} \cdot \mathbf{d} \le 0 \implies \text{DISJOINT (No Collision!)}$$

**Why?**
The support point $\mathbf{A}$ is the *furthest* point in $A \ominus B$ along direction $\mathbf{d}$. If even the furthest point fails to cross the plane passing through the origin perpendicular to $\mathbf{d}$ ($\mathbf{A} \cdot \mathbf{d} \le 0$), then the entire set $A \ominus B$ lies behind that plane!
The origin can never be reached along direction $\mathbf{d}$, proving that $\mathbf{0} \notin (A \ominus B)$. GJK terminates immediately!

---

## 5.5 Comprehensive Voronoi Region Sub-Simplex Analysis (`DoSimplex`)

The heart of GJK is the `DoSimplex` subroutine. Given a simplex $W$ containing $2, 3,\text{ or } 4$ vertices, `DoSimplex`:
1. Identifies which geometric feature (vertex, edge, or face) of $W$ is closest to the origin $\mathbf{0}$.
2. Discards all vertices not belonging to that closest feature (preventing simplexes from growing beyond 4 vertices).
3. Updates the search direction $\mathbf{d}$ to point from that closest feature directly toward the origin.

### 5.5.1 The 1-Simplex (Line Segment $\mathbf{A}\mathbf{B}$)

The simplex contains two vertices: newly added vertex $\mathbf{A}$ and previous vertex $\mathbf{B}$.
Direction of segment: $\mathbf{A}\mathbf{B} = \mathbf{B} - \mathbf{A}$.
Vector from $\mathbf{A}$ toward origin: $\mathbf{A}\mathbf{O} = -\mathbf{A}$.

```
                 VORONOI REGIONS OF A LINE SEGMENT
                 
          Region A            Region AB           Region B (Impossible)
       <-------------[ A ]===================[ B ]------------->
                      *           *
                    d = AO   d = (AB x AO) x AB
```

Because $\mathbf{A}$ was just added as the extreme point along direction $\mathbf{d}$, the origin can never lie in the Voronoi region of $\mathbf{B}$. We only evaluate:
1. **Segment AB Region:**
   If $(\mathbf{A}\mathbf{B} \cdot \mathbf{A}\mathbf{O}) > 0$, the origin projects onto the interior of segment $\mathbf{A}\mathbf{B}$.
   - Retain simplex $W = \{ \mathbf{A}, \mathbf{B} \}$.
   - New search direction is the vector perpendicular to $\mathbf{A}\mathbf{B}$ pointing toward $\mathbf{A}\mathbf{O}$:
     $$\boxed{\mathbf{d} = (\mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{O}) \times \mathbf{A}\mathbf{B}}$$
2. **Vertex A Region:**
   If $(\mathbf{A}\mathbf{B} \cdot \mathbf{A}\mathbf{O}) \le 0$, the origin is closest to vertex $\mathbf{A}$.
   - Discard $\mathbf{B}$: $W = \{ \mathbf{A} \}$.
   - New search direction: $\mathbf{d} = \mathbf{A}\mathbf{O} = -\mathbf{A}$.

### 5.5.2 The 2-Simplex (Triangle $\mathbf{A}\mathbf{B}\mathbf{C}$)

The simplex contains three vertices: newly added $\mathbf{A}$, and previous $\mathbf{B}, \mathbf{C}$.
Triangle face normal: $\mathbf{n}_{\text{ABC}} = \mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{C}$.
Vector to origin: $\mathbf{A}\mathbf{O} = -\mathbf{A}$.

```
                      VORONOI REGIONS OF A TRIANGLE
                                     A
                                    / \
                                   /   \
                             Edge /     \ Edge
                              AB / Face  \ AC
                                /   ABC   \
                               B-----------C
                                  Edge BC (Impossible)
```

Again, the origin cannot lie behind edge $\mathbf{B}\mathbf{C}$. We evaluate:
1. **Edge AB Region:**
   Check edge normal pointing outward from the triangle: $\mathbf{n}_{\text{AB}} = \mathbf{n}_{\text{ABC}} \times \mathbf{A}\mathbf{B}$.
   If $(\mathbf{n}_{\text{AB}} \cdot \mathbf{A}\mathbf{O}) > 0$:
   - Discard $\mathbf{C}$: $W = \{ \mathbf{A}, \mathbf{B} \}$.
   - $\mathbf{d} = (\mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{O}) \times \mathbf{A}\mathbf{B}$.
2. **Edge AC Region:**
   Check edge normal pointing outward: $\mathbf{n}_{\text{AC}} = \mathbf{A}\mathbf{C} \times \mathbf{n}_{\text{ABC}}$.
   If $(\mathbf{n}_{\text{AC}} \cdot \mathbf{A}\mathbf{O}) > 0$:
   - Discard $\mathbf{B}$: $W = \{ \mathbf{A}, \mathbf{C} \}$.
   - $\mathbf{d} = (\mathbf{A}\mathbf{C} \times \mathbf{A}\mathbf{O}) \times \mathbf{A}\mathbf{C}$.
3. **Face ABC Region:**
   If both edge tests fail, the origin projects inside the triangle face!
   - Determine whether the origin is above or below the triangle:
     If $(\mathbf{n}_{\text{ABC}} \cdot \mathbf{A}\mathbf{O}) > 0$:
     - Retain $W = \{ \mathbf{A}, \mathbf{B}, \mathbf{C} \}$, $\mathbf{d} = \mathbf{n}_{\text{ABC}}$.
     Else:
     - Retain $W = \{ \mathbf{A}, \mathbf{C}, \mathbf{B} \}$ (swap winding to keep normal pointing toward origin), $\mathbf{d} = -\mathbf{n}_{\text{ABC}}$.

### 5.5.3 The 3-Simplex (Tetrahedron $\mathbf{A}\mathbf{B}\mathbf{C}\mathbf{D}$)

The simplex contains four vertices: $\mathbf{A}, \mathbf{B}, \mathbf{C}, \mathbf{D}$.
The tetrahedron has four triangular faces:
1. Face $ABC$ (Normal $\mathbf{n}_{\text{ABC}}$ pointing outward).
2. Face $ACD$ (Normal $\mathbf{n}_{\text{ACD}}$ pointing outward).
3. Face $ADB$ (Normal $\mathbf{n}_{\text{ADB}}$ pointing outward).
4. Face $BCD$ (Facing away from newly added $\mathbf{A}$; origin cannot lie outside it).

Test origin against the three outward face normals:
- If $(\mathbf{n}_{\text{ABC}} \cdot \mathbf{A}\mathbf{O}) > 0$: Discard $\mathbf{D}$. $W = \{ \mathbf{A}, \mathbf{B}, \mathbf{C} \}$, $\mathbf{d} = \mathbf{n}_{\text{ABC}}$.
- If $(\mathbf{n}_{\text{ACD}} \cdot \mathbf{A}\mathbf{O}) > 0$: Discard $\mathbf{B}$. $W = \{ \mathbf{A}, \mathbf{C}, \mathbf{D} \}$, $\mathbf{d} = \mathbf{n}_{\text{ACD}}$.
- If $(\mathbf{n}_{\text{ADB}} \cdot \mathbf{A}\mathbf{O}) > 0$: Discard $\mathbf{C}$. $W = \{ \mathbf{A}, \mathbf{D}, \mathbf{B} \}$, $\mathbf{d} = \mathbf{n}_{\text{ADB}}$.
- **Otherwise:** The origin lies behind all three faces! It is **strictly inside the tetrahedron**!

$$\boxed{\text{Origin enclosed in 3-Simplex} \implies \mathbf{0} \in (A \ominus B) \implies \text{COLLISION DETECTED!}}$$

The algorithm terminates immediately and returns `true`!

---

## 5.6 Ten Step-by-Step Worked Examples

### Worked Example 5.1: Complete GJK Trace for Colliding Spheres
**Problem:** Two spheres in $\mathbb{R}^3$:
Sphere $A$: Center $\mathbf{c}_A = (0, 0, 0)^T$, radius $R_A = 2.0$.
Sphere $B$: Center $\mathbf{c}_B = (3, 0, 0)^T$, radius $R_B = 1.5$.
Since $\|\mathbf{c}_B - \mathbf{c}_A\| = 3.0 \le R_A + R_B = 3.5$, the spheres overlap.
Trace GJK from initial direction $\mathbf{d}_0 = \mathbf{c}_B - \mathbf{c}_A = (1, 0, 0)^T$ until collision is declared.

**Solution:**
1. **Initial Support Point along $\mathbf{d}_0 = (1, 0, 0)^T$:**
   $$S_A(\mathbf{d}_0) = \mathbf{c}_A + R_A \frac{\mathbf{d}_0}{\|\mathbf{d}_0\|} = (0, 0, 0)^T + 2.0(1, 0, 0)^T = (2, 0, 0)^T$$
   $$S_B(-\mathbf{d}_0) = \mathbf{c}_B + R_B \frac{-\mathbf{d}_0}{\|-\mathbf{d}_0\|} = (3, 0, 0)^T + 1.5(-1, 0, 0)^T = (1.5, 0, 0)^T$$
   First Minkowski point $\mathbf{A}_1$:
   $$\mathbf{A}_1 = S_A(\mathbf{d}_0) - S_B(-\mathbf{d}_0) = (2, 0, 0)^T - (1.5, 0, 0)^T = (0.5, 0, 0)^T$$
   Simplex $W = \{ \mathbf{A}_1 \}$.
2. **Next Direction:**
   $$\mathbf{d}_1 = -\mathbf{A}_1 = (-0.5, 0, 0)^T \to (-1, 0, 0)^T$$
3. **Second Support Point along $\mathbf{d}_1 = (-1, 0, 0)^T$:**
   $$S_A(\mathbf{d}_1) = (0, 0, 0) + 2.0(-1, 0, 0) = (-2, 0, 0)^T$$
   $$S_B(-\mathbf{d}_1) = (3, 0, 0) + 1.5(1, 0, 0) = (4.5, 0, 0)^T$$
   $$\mathbf{A}_2 = S_A(\mathbf{d}_1) - S_B(-\mathbf{d}_1) = (-2, 0, 0)^T - (4.5, 0, 0)^T = (-6.5, 0, 0)^T$$
4. **Advancement Test:**
   $$\mathbf{A}_2 \cdot \mathbf{d}_1 = (-6.5)(-1) = +6.5 > 0 \quad (\text{Passes!})$$
   Add $\mathbf{A}_2$ to simplex: $W = \{ \mathbf{A}_2, \mathbf{A}_1 \} = \{ (-6.5, 0, 0)^T, (0.5, 0, 0)^T \}$.
5. **1-Simplex Evaluation:**
   The line segment spans from $-6.5$ to $+0.5$ on the x-axis.
   Notice that $0.0 \in [-6.5, 0.5]$! The origin lies directly on the 1D simplex segment $\mathbf{A}_2\mathbf{A}_1$!
   $$\mathbf{0} \in (A \ominus B) \implies \mathbf{COLLISION!}$$
   GJK converges in just 2 iterations!

---

### Worked Example 5.2: Complete GJK Trace for Disjoint Boxes
**Problem:** Two 3D AABBs:
Box $A$: Center $(0, 0, 0)^T$, half-extents $(1, 1, 1)^T$.
Box $B$: Center $(5, 0, 0)^T$, half-extents $(1, 1, 1)^T$.
Trace GJK and show how the advancement test terminates with `false`.

**Solution:**
1. Initial direction $\mathbf{d}_0 = \mathbf{c}_B - \mathbf{c}_A = (5, 0, 0)^T \to (1, 0, 0)^T$.
2. Support points along $\mathbf{d}_0 = (1, 0, 0)^T$:
   $$S_A(1, 0, 0) = (1, 1, 1)^T \quad (\text{or } (1, 0, 0)^T)$$
   $$S_B(-1, 0, 0) = (5 - 1, 0, 0)^T = (4, 0, 0)^T$$
   $$\mathbf{A}_1 = (1, 0, 0)^T - (4, 0, 0)^T = (-3, 0, 0)^T$$
   Simplex $W = \{ (-3, 0, 0)^T \}$.
3. Direction toward origin:
   $$\mathbf{d}_1 = -\mathbf{A}_1 = -(-3, 0, 0)^T = (3, 0, 0)^T \to (1, 0, 0)^T$$
4. Support point along $\mathbf{d}_1 = (1, 0, 0)^T$:
   Notice $\mathbf{d}_1$ is identical to $\mathbf{d}_0$!
   $$\mathbf{A}_2 = S_A(\mathbf{d}_1) - S_B(-\mathbf{d}_1) = (-3, 0, 0)^T$$
5. Advancement test:
   $$\mathbf{A}_2 \cdot \mathbf{d}_1 = (-3, 0, 0)^T \cdot (1, 0, 0)^T = -3.0$$
   Because $\mathbf{A}_2 \cdot \mathbf{d}_1 = -3.0 \le 0$, the support point did not pass the origin!
   **Algorithm terminates: DISJOINT (Return false).**
   Terminated in only 1 iteration!

---

### Worked Example 5.3: Triangle Simplex Voronoi Region Determination
**Problem:** A 2-simplex has vertices $\mathbf{A} = (0, 2, 0)^T$, $\mathbf{B} = (-2, -1, 0)^T$, $\mathbf{C} = (2, -1, 0)^T$ in the xy-plane.
Determine the Voronoi region of the origin $\mathbf{O} = (0, 0, 0)^T$.

**Solution:**
1. Edge vectors:
   $$\mathbf{A}\mathbf{B} = \mathbf{B} - \mathbf{A} = (-2, -3, 0)^T, \quad \mathbf{A}\mathbf{C} = \mathbf{C} - \mathbf{A} = (2, -3, 0)^T$$
   Vector to origin: $\mathbf{A}\mathbf{O} = -\mathbf{A} = (0, -2, 0)^T$.
2. Triangle normal:
   $$\mathbf{n}_{\text{ABC}} = \mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{C} = \begin{pmatrix} -2 \\ -3 \\ 0 \end{pmatrix} \times \begin{pmatrix} 2 \\ -3 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ (-2)(-3) - (-3)(2) \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 6 + 6 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 12 \end{pmatrix}$$
3. Outward normal of edge AB:
   $$\mathbf{n}_{\text{AB}} = \mathbf{n}_{\text{ABC}} \times \mathbf{A}\mathbf{B} = \begin{pmatrix} 0 \\ 0 \\ 12 \end{pmatrix} \times \begin{pmatrix} -2 \\ -3 \\ 0 \end{pmatrix} = \begin{pmatrix} 36 \\ -24 \\ 0 \end{pmatrix}$$
   Test $\mathbf{n}_{\text{AB}} \cdot \mathbf{A}\mathbf{O}$:
   $$\mathbf{n}_{\text{AB}} \cdot \mathbf{A}\mathbf{O} = (36)(0) + (-24)(-2) + 0 = +48.0 > 0 \implies \text{Wait: let's check sign!}$$
   Let's sketch: $\mathbf{A} = (0, 2)$, $\mathbf{B} = (-2, -1)$. The vector $\mathbf{A}\mathbf{B}$ points down and left.
   Outward normal from triangle should point up and left.
   Here $\mathbf{n}_{\text{AB}} = (36, -24, 0)^T$ points right and down, which is *inward* toward C!
   Correct outward formula: $\mathbf{n}_{\text{AB}} = \mathbf{A}\mathbf{B} \times \mathbf{n}_{\text{ABC}} = (-36, 24, 0)^T$.
   Dot product:
   $$\mathbf{n}_{\text{AB,out}} \cdot \mathbf{A}\mathbf{O} = (-36)(0) + (24)(-2) = -48.0 \le 0 \implies \text{Origin is INSIDE edge AB!}$$
4. Outward normal of edge AC:
   $$\mathbf{n}_{\text{AC,out}} = \mathbf{n}_{\text{ABC}} \times \mathbf{A}\mathbf{C} = (36, 24, 0)^T$$
   Dot product:
   $$\mathbf{n}_{\text{AC,out}} \cdot \mathbf{A}\mathbf{O} = (36)(0) + (24)(-2) = -48.0 \le 0 \implies \text{Origin is INSIDE edge AC!}$$
5. Both edge tests are negative! The origin projects **INSIDE Face ABC**!
   New direction: $\mathbf{d} = \mathbf{n}_{\text{ABC}} = (0, 0, 1)^T$.

---

### Worked Example 5.4: 3D Tetrahedron Enclosing the Origin
**Problem:** A 3-simplex has vertices:
$\mathbf{A} = (0, 0, 2)^T$, $\mathbf{B} = (2, 0, -1)^T$, $\mathbf{C} = (-1, \sqrt{3}, -1)^T$, $\mathbf{D} = (-1, -\sqrt{3}, -1)^T$.
Show algebraically that the origin $\mathbf{O} = (0, 0, 0)^T$ is strictly inside this tetrahedron.

**Solution:**
1. Notice the centroid of the base $\triangle \mathbf{B}\mathbf{C}\mathbf{D}$:
   $$\mathbf{c}_{\text{base}} = \frac{\mathbf{B} + \mathbf{C} + \mathbf{D}}{3} = \frac{(2 - 1 - 1, 0 + \sqrt{3} - \sqrt{3}, -1 - 1 - 1)^T}{3} = (0, 0, -1)^T$$
   The base lies in the plane $z = -1$.
2. Vertex $\mathbf{A}$ is on the $+z$ axis at $z = +2$.
3. The origin $\mathbf{O} = (0, 0, 0)^T$ lies on the line segment connecting $\mathbf{c}_{\text{base}} = (0, 0, -1)^T$ and $\mathbf{A} = (0, 0, 2)^T$:
   $$\mathbf{O} = \frac{2}{3} \mathbf{c}_{\text{base}} + \frac{1}{3} \mathbf{A} = \frac{2}{3}(0, 0, -1)^T + \frac{1}{3}(0, 0, 2)^T = (0, 0, 0)^T$$
   Because $\mathbf{O}$ is a convex combination of the base centroid and the apex vertex with strictly positive weights $\lambda = (2/9, 2/9, 2/9, 1/3)$, the origin is **STRICTLY INTERIOR** to the tetrahedron!
   GJK declares collision and terminates!

---

### Worked Example 5.5: Support Function of a Slanted Capsule
**Problem:** A capsule has radius $R = 0.5\text{ m}$ and segment core from $\mathbf{A} = (1, 1, 0)^T$ to $\mathbf{B} = (3, 5, 2)^T$.
Compute the support point $S_{\text{capsule}}(\mathbf{d})$ along direction $\mathbf{d} = (1, 2, 2)^T$.

**Solution:**
1. Direction vector norm:
   $$\|\mathbf{d}\| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3.0$$
   Normalized direction:
   $$\hat{\mathbf{d}} = \frac{\mathbf{d}}{\|\mathbf{d}\|} = \left(\frac{1}{3}, \frac{2}{3}, \frac{2}{3}\right)^T$$
2. Test segment endpoints:
   $$\mathbf{A} \cdot \mathbf{d} = (1)(1) + (1)(2) + (0)(2) = 1 + 2 + 0 = 3.0$$
   $$\mathbf{B} \cdot \mathbf{d} = (3)(1) + (5)(2) + (2)(2) = 3 + 10 + 4 = 17.0$$
   Since $\mathbf{B} \cdot \mathbf{d} = 17.0 > \mathbf{A} \cdot \mathbf{d} = 3.0$, vertex $\mathbf{B}$ is chosen as the base.
3. Add spherical expansion:
   $$S(\mathbf{d}) = \mathbf{B} + R \hat{\mathbf{d}} = \begin{pmatrix} 3 \\ 5 \\ 2 \end{pmatrix} + 0.5 \begin{pmatrix} 1/3 \\ 2/3 \\ 2/3 \end{pmatrix} = \begin{pmatrix} 3 + 0.1667 \\ 5 + 0.3333 \\ 2 + 0.3333 \end{pmatrix} = \begin{pmatrix} 3.1667 \\ 5.3333 \\ 2.3333 \end{pmatrix}\text{ m}$$

---

### Worked Example 5.6: Vector Triple Product Perpendicular Identity
**Problem:** In the 1-simplex case, prove that the vector $\mathbf{d} = (\mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{O}) \times \mathbf{A}\mathbf{B}$ is strictly perpendicular to $\mathbf{A}\mathbf{B}$ and points toward $\mathbf{A}\mathbf{O}$.

**Solution:**
1. Use the vector triple product identity $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = (\mathbf{u} \cdot \mathbf{w})\mathbf{v} - (\mathbf{u} \cdot \mathbf{v})\mathbf{w}$.
2. Let $\mathbf{u} = \mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{O}$, so $\mathbf{d} = \mathbf{u} \times \mathbf{A}\mathbf{B} = -\mathbf{A}\mathbf{B} \times \mathbf{u}$:
   $$\mathbf{d} = (\mathbf{A}\mathbf{B} \times \mathbf{A}\mathbf{O}) \times \mathbf{A}\mathbf{B} = (\mathbf{A}\mathbf{B} \cdot \mathbf{A}\mathbf{B}) \mathbf{A}\mathbf{O} - (\mathbf{A}\mathbf{B} \cdot \mathbf{A}\mathbf{O}) \mathbf{A}\mathbf{B}$$
3. Take the dot product with $\mathbf{A}\mathbf{B}$:
   $$\mathbf{d} \cdot \mathbf{A}\mathbf{B} = \|\mathbf{A}\mathbf{B}\|^2 (\mathbf{A}\mathbf{O} \cdot \mathbf{A}\mathbf{B}) - (\mathbf{A}\mathbf{B} \cdot \mathbf{A}\mathbf{O}) \|\mathbf{A}\mathbf{B}\|^2 = 0$$
   The vector $\mathbf{d}$ is strictly perpendicular to segment $\mathbf{A}\mathbf{B}$!
4. Take the dot product with $\mathbf{A}\mathbf{O}$:
   $$\mathbf{d} \cdot \mathbf{A}\mathbf{O} = \|\mathbf{A}\mathbf{B}\|^2 \|\mathbf{A}\mathbf{O}\|^2 - (\mathbf{A}\mathbf{B} \cdot \mathbf{A}\mathbf{O})^2$$
   By the Cauchy-Schwarz inequality, $\|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2 = \|\mathbf{u} \times \mathbf{v}\|^2 > 0$ for non-collinear vectors.
   Therefore $\mathbf{d} \cdot \mathbf{A}\mathbf{O} > 0$, proving it points toward the origin! $\blacksquare$

---

### Worked Example 5.7: Minkowski Difference of Two Cubes
**Problem:** Box $A$ has side length $2\text{ m}$ centered at origin ($[-1, 1]^3$).
Box $B$ has side length $2\text{ m}$ centered at $(3, 0, 0)^T$ ($[2, 4] \times [-1, 1] \times [-1, 1]$).
Describe the exact geometric shape and dimensions of $A \ominus B$.

**Solution:**
1. Any point $\mathbf{w} \in A \ominus B$ is $\mathbf{w} = \mathbf{a} - \mathbf{b}$ where $\mathbf{a} \in A, \mathbf{b} \in B$.
2. For each coordinate:
   - X: $w_x \in [-1 - 4, 1 - 2] = [-5, -1]$.
   - Y: $w_y \in [-1 - 1, 1 - (-1)] = [-2, 2]$.
   - Z: $w_z \in [-1 - 1, 1 - (-1)] = [-2, 2]$.
3. The Minkowski difference $A \ominus B$ is another cuboid:
   $$A \ominus B = [-5, -1] \times [-2, 2] \times [-2, 2]$$
4. Dimensions: Width along X is $4\text{ m}$, width along Y is $4\text{ m}$, width along Z is $4\text{ m}$.
5. Notice that the origin $\mathbf{0} = (0, 0, 0)^T$ has $x = 0 \notin [-5, -1]$.
   The distance from the origin to $A \ominus B$ along X is $1.0\text{ m}$, which matches the exact gap between Box $A$ ($x \le 1$) and Box $B$ ($x \ge 2$)!

---

### Worked Example 5.8: GJK Degeneracy: Origin Lies Exactly on a Face
**Problem:** In a GJK iteration, the simplex triangle $\mathbf{A}\mathbf{B}\mathbf{C}$ lies in the plane $z = 0$, and the origin $\mathbf{0}$ lies directly on the interior of the triangle face.
How does GJK proceed when $\mathbf{A}\mathbf{O} \cdot \mathbf{n}_{\text{ABC}} = 0$?

**Solution:**
1. If $\mathbf{A}\mathbf{O} \cdot \mathbf{n}_{\text{ABC}} = 0$, the origin is coplanar with the triangle face.
2. In this degenerate case, the origin lies on the boundary or interior of the 2-simplex.
3. If the origin is strictly inside the triangle, the bodies are touching in a grazing contact.
4. GJK selects the face normal $\mathbf{d} = \mathbf{n}_{\text{ABC}}$ as the search direction to fetch a 4th point $\mathbf{D}$. If $\mathbf{D} \cdot \mathbf{d} > 0$, the tetrahedron will enclose the origin; if not, grazing contact is declared!

---

### Worked Example 5.9: Numerical Cycling Avoidance
**Problem:** Explain how numerical round-off error can cause GJK to oscillate endlessly between two sub-simplexes, and state the standard convergence threshold.

**Solution:**
1. When bodies are deeply penetrating or touching closely, support point $\mathbf{A}_{k}$ may be nearly identical to a previously visited vertex $\mathbf{A}_{k-2}$.
2. The search direction $\mathbf{d}$ toggles back and forth without progressing.
3. Standard remedies:
   - Cap maximum GJK iterations to $N_{\text{max}} = 20\text{ to }32$.
   - Require significant advancement: $\mathbf{A} \cdot \mathbf{d} > \epsilon \cdot \|\mathbf{d}\|$ (where $\epsilon \approx 10^{-5}$).
   - If a duplicate support point is returned, terminate with the current simplex state.

---

### Worked Example 5.10: Transforming Support Queries for Moving Bodies
**Problem:** Body $A$ has world position $\mathbf{x}_A$ and rotation matrix $\mathbf{R}_A$.
Show how to evaluate the support mapping $S_A(\mathbf{d}_{\text{world}})$ using the body's local support function $S_{\text{local}}(\mathbf{d}_{\text{local}})$.

**Solution:**
1. Transform query direction into local frame:
   $$\mathbf{d}_{\text{local}} = \mathbf{R}_A^T \mathbf{d}_{\text{world}}$$
2. Query local extreme point:
   $$\mathbf{p}_{\text{local}} = S_{\text{local}}(\mathbf{d}_{\text{local}})$$
3. Transform local point back to world space:
   $$S_A(\mathbf{d}_{\text{world}}) = \mathbf{x}_A + \mathbf{R}_A \mathbf{p}_{\text{local}}$$
   This universal formula allows calculating support mappings for any arbitrarily translated and rotated body!

---

## 5.7 Ten Granular Solved Exercises

### Exercise 5.1: Support Function of an Ellipsoid
**Problem:** An ellipsoid is defined by $\left(\frac{x}{a}\right)^2 + \left(\frac{y}{b}\right)^2 + \left(\frac{z}{c}\right)^2 \le 1$.
Derive its closed-form support mapping $S(\mathbf{d})$.

**Solution:**
1. The ellipsoid is an affine transformation of the unit sphere: $\mathbf{x} = \mathbf{M} \mathbf{u}$ where $\mathbf{M} = \text{diag}(a, b, c)$ and $\|\mathbf{u}\| \le 1$.
2. Extreme point:
   $$\max (\mathbf{M}\mathbf{u} \cdot \mathbf{d}) = \max (\mathbf{u} \cdot \mathbf{M}^T \mathbf{d})$$
3. On the unit sphere, the extreme point along direction $\mathbf{M}\mathbf{d}$ is $\mathbf{u} = \frac{\mathbf{M}\mathbf{d}}{\|\mathbf{M}\mathbf{d}\|}$.
4. Therefore:
   $$S(\mathbf{d}) = \mathbf{M} \mathbf{u} = \frac{\mathbf{M}^2 \mathbf{d}}{\|\mathbf{M}\mathbf{d}\|} = \frac{(a^2 d_x, \, b^2 d_y, \, c^2 d_z)^T}{\sqrt{a^2 d_x^2 + b^2 d_y^2 + c^2 d_z^2}}$$

---

### Exercise 5.2: Invariance of Minkowski Difference Under Global Translation
**Problem:** If both bodies $A$ and $B$ are translated by the same vector $\mathbf{v}$, prove that $A \ominus B$ is invariant.

**Solution:**
1. Translated sets: $A' = \{ \mathbf{a} + \mathbf{v} \}$, $B' = \{ \mathbf{b} + \mathbf{v} \}$.
2. Minkowski difference:
   $$A' \ominus B' = \{ (\mathbf{a} + \mathbf{v}) - (\mathbf{b} + \mathbf{v}) \} = \{ \mathbf{a} - \mathbf{b} \} = A \ominus B$$
   The Minkowski difference depends only on relative displacement, proving translation invariance! $\blacksquare$

---

### Exercise 5.3: Minimum Support Mapping of a Point
**Problem:** What is the support mapping of a single point mass located at $\mathbf{p} \in \mathbb{R}^3$?

**Solution:**
For any direction $\mathbf{d}$:
$$S_{\text{point}}(\mathbf{d}) = \mathbf{p}$$

---

### Exercise 5.4: Convergence Rate of GJK for Polyhedra
**Problem:** Why is GJK guaranteed to terminate in finite steps for two polyhedra with $N_A$ and $N_B$ vertices?

**Solution:**
1. The Minkowski difference of two polyhedra is another polyhedron with at most $N_A \cdot N_B$ vertices.
2. A simplex can only be formed from subsets of these discrete vertices.
3. At every iteration where the origin is not enclosed, the new support point strictly reduces the distance from the simplex to the origin.
4. Because the set of candidate simplexes is finite and distance decreases monotonically, GJK cannot cycle indefinitely; it must terminate in finite steps!

---

### Exercise 5.5: Support Function of a Cylinder
**Problem:** A cylinder has radius $R$, height $H$, with axis along $\hat{\mathbf{k}}$ centered at the origin.
Derive its support mapping $S(\mathbf{d})$.

**Solution:**
1. Z-component: $S_z = \text{sign}(d_z) \frac{H}{2}$.
2. XY-plane component: A circle of radius $R$:
   $$\mathbf{d}_{xy} = (d_x, d_y, 0)^T \implies S_{xy} = R \frac{\mathbf{d}_{xy}}{\|\mathbf{d}_{xy}\|}$$
3. Total:
   $$S(\mathbf{d}) = \left( R \frac{d_x}{\sqrt{d_x^2 + d_y^2}}, \, R \frac{d_y}{\sqrt{d_x^2 + d_y^2}}, \, \text{sign}(d_z)\frac{H}{2} \right)^T$$

---

### Exercise 5.6: Initial Search Direction Optimization (Temporal Coherence)
**Problem:** In continuous simulation, why should the initial direction $\mathbf{d}_0$ at frame $t + \Delta t$ be chosen as the separating normal from frame $t$?

**Solution:**
Due to small movements between frames, the separating vector from the previous frame is almost certainly still separating. Using it as $\mathbf{d}_0$ allows GJK to terminate in **exactly 1 iteration** on $>90\%$ of non-colliding frames!

---

### Exercise 5.7: Simplex Winding Reversal
**Problem:** In `DoSimplex` for a triangle, why must the winding order of vertices be swapped if $\mathbf{n}_{\text{ABC}} \cdot \mathbf{A}\mathbf{O} < 0$?

**Solution:**
Swapping vertices $\mathbf{B}$ and $\mathbf{C}$ reverses the cross product: $\mathbf{A}\mathbf{C} \times \mathbf{A}\mathbf{B} = -\mathbf{n}_{\text{ABC}}$.
This ensures the normal always points toward the half-space containing the origin, keeping outward normal tests consistent when expanding to a tetrahedron.

---

### Exercise 5.8: Degenerate Support Mapping Along Zero Vector
**Problem:** What occurs if GJK queries $S(\mathbf{d})$ with $\mathbf{d} = (0, 0, 0)^T$?

**Solution:**
$\mathbf{0}$ has no defined direction ($\|\mathbf{0}\| = 0$). Dividing by $\|\mathbf{d}\|$ yields `NaN`.
Robust engines check `if (d.lengthSq() < 1e-12) d = Vector3(1, 0, 0);` to supply an arbitrary fallback axis.

---

### Exercise 5.9: Maximum Simplex Vertices in Memory
**Problem:** What is the maximum number of vertices the GJK simplex array must allocate?

**Solution:**
In $\mathbb{R}^3$, the maximum simplex is a tetrahedron, requiring **at most 4 vertices** (stored as an array of 4 `Vector3` structs, totaling 48 bytes).

---

### Exercise 5.10: Distance Output from Non-Colliding GJK
**Problem:** When GJK terminates with `false` (disjoint), how does it calculate the exact minimum separation distance?

**Solution:**
When GJK terminates, the final simplex $W$ contains the closest feature to the origin.
The Euclidean distance from the origin to that sub-simplex is the exact minimum distance between $A$ and $B$:
$$\text{dist}(A, B) = \min_{\mathbf{w} \in W} \|\mathbf{w}\|$$

---

## 5.8 Chapter Summary and Bridge to Chapter 6

In this chapter, we mastered the Gilbert-Johnson-Keerthi algorithm:
1. **Convex Geometry:** Formulated support mappings $S(\mathbf{d}) = \arg\max (\mathbf{x} \cdot \mathbf{d})$.
2. **The Minkowski Difference:** Proved that collision is equivalent to $\mathbf{0} \in (A \ominus B)$.
3. **Linear Support Decomposition:** $S_{A \ominus B}(\mathbf{d}) = S_A(\mathbf{d}) - S_B(-\mathbf{d})$.
4. **The GJK Simplex Engine:** Derived the complete 1-simplex, 2-simplex, and 3-simplex Voronoi region algorithms.

However, GJK has a major limitation: when objects collide, it returns only a binary boolean `true`. It cannot determine **how deep the penetration is** or **which way to push the bodies apart**!
In **Chapter 6: Expanding Polytope Algorithm (EPA) and Contact Manifold Generation**, we extend GJK into the penetrating domain to compute exact penetration depths, contact normals, and Sutherland-Hodgman contact manifolds.
