# Chapter 4: Convexity, Minkowski Portals, and the Hyperplane Separation Theorem

> *"Convexity is the great dividing line in computational geometry. A convex shape has no indentations, no pockets, no self-shadows: any line segment connecting two internal points is guaranteed to remain entirely within the shape. Across this mathematical landscape, the Hyperplane Separation Theorem grants an extraordinary gift: if two convex bodies do not touch, there exists an infinite line that slides cleanly between them."*

---

### Conceptual Architecture: The Convex Foundation of Collision Theory

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             CONVEXITY DEFINITION & TEST                                  │
│                 ∀ x, y ∈ C,  ∀ λ ∈ [0, 1]  ===>  (1 - λ)x + λy ∈ C                       │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Non-Convex Geometry
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                      CONVEX DECOMPOSITION ARCHITECTURE                                   │
│   • Ear-Clipping & Approximate Convex Decomposition (HACD)                               │
│   • Concave objects split into compound unions of convex sub-hulls: C = ⋃ C_k            │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Pairwise Interaction
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   THE MINKOWSKI DIFFERENCE:  A ⊖ B = { a - b }                           │
│   • Convexity Invariant: If A and B are convex, (A ⊖ B) is STRICTLY CONVEX               │
│   • Support Mapping Property: S_{A ⊖ B}(d) = S_A(d) - S_B(-d)                            │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Separation Test
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   THE HYPERPLANE SEPARATION THEOREM (MINKOWSKI, 1910)                     │
│                                                                                          │
│    Disjoint Convex Sets A ∩ B = ∅  <===>  Origin is Outside: 0 ∉ (A ⊖ B)                 │
│                                    <===>  ∃ Separating Axis n:                           │
│                                           max_{a ∈ A}(a · n) < min_{b ∈ B}(b · n)        │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.1 The Geometry and Algebra of Convex Sets

In classical Euclidean geometry, a set $\mathcal{C} \subset \mathbb{R}^d$ is **convex** if it contains the entire line segment connecting any two of its points:
$$\forall \mathbf{x}, \mathbf{y} \in \mathcal{C}, \quad \forall \lambda \in [0, 1]: \quad (1 - \lambda)\mathbf{x} + \lambda \mathbf{y} \in \mathcal{C}$$

```
Visualizing Convex vs Non-Convex Geometry

      Convex Set (Disk / Polygon)                Non-Convex Set (L-Shape / Crescent)
            ┌──────────────┐                                ┌──────────────┐
            │   x          │                                │   x          │
            │    \         │                                │    \         │
            │     \        │                                │     \ OUTSIDE!
            │      y       │                                │      *───────┘
            └──────────────┘                                │       \
                                                            │        y
        Segment xy is ENTIRELY inside!                      └──────────────┘
                                                        Segment xy leaves the set!
```

### 4.1.1 Essential Invariants of Convex Sets
Convex sets possess unique mathematical properties that underpin all narrow-phase collision algorithms:
1. **Intersection Invariant:** If $\mathcal{C}_1$ and $\mathcal{C}_2$ are convex sets, their intersection $\mathcal{C}_1 \cap \mathcal{C}_2$ is guaranteed to be convex (or empty).
2. **Affine Preservation:** If $\mathcal{C}$ is convex and $\mathbf{T}(\mathbf{x}) = \mathbf{A}\mathbf{x} + \mathbf{b}$ is an affine transformation (such as scaling, translation, or rotation), the image $\mathbf{T}(\mathcal{C})$ is convex.
3. **Minkowski Invariant:** If $\mathcal{A}$ and $\mathcal{B}$ are convex sets, both their Minkowski sum $\mathcal{A} \oplus \mathcal{B}$ and Minkowski difference $\mathcal{A} \ominus \mathcal{B}$ are **strictly convex**.

### 4.1.2 The Concavity Dilemma: Convex Decomposition
Non-convex (concave) shapes violate these guarantees: their Minkowski differences develop holes, non-convex pockets, and multiple disconnected local minima.
To simulate arbitrary complex concave meshes (such as an automotive chassis, an indented hollow bowl, or an architectural tunnel), real-time physics engines never test concave shapes directly.

Instead, concave geometry undergoes **Convex Decomposition**:
$$\mathcal{G}_{\text{concave}} = \bigcup_{k=1}^K \mathcal{C}_k$$
where each sub-part $\mathcal{C}_k$ is a strictly convex polyhedron (convex hull).
Testing whether dynamic body $\mathcal{A}$ collides with concave body $\mathcal{B}$ reduces to evaluating:
$$\mathcal{A} \cap \mathcal{B} \ne \emptyset \iff \bigvee_{k=1}^K (\mathcal{A} \cap \mathcal{C}_k \ne \emptyset)$$
The collision pipeline evaluates fast convex-vs-convex algorithms across the constituent sub-hulls, combining the resulting contact manifolds into a unified physical constraint.

---

## 4.2 Support Functions and Extremal Support Mappings

To test or measure convex sets without iterating through thousands of internal points, computational geometers utilize the **Support Function**.

### 4.2.1 Mathematical Formulation of Support Functions
Let $\mathcal{C} \subset \mathbb{R}^d$ be a non-empty closed convex set. For any directional search vector $\mathbf{d} \in \mathbb{R}^d$ ($\mathbf{d} \ne \mathbf{0}$):

1. **The Scalar Support Function** ($h_{\mathcal{C}}(\mathbf{d})$):
   The maximum projected scalar value of any point in $\mathcal{C}$ along direction $\mathbf{d}$:
   $$h_{\mathcal{C}}(\mathbf{d}) \equiv \sup_{\mathbf{x} \in \mathcal{C}} (\mathbf{x} \cdot \mathbf{d})$$
2. **The Support Mapping (Support Point)** ($S_{\mathcal{C}}(\mathbf{d})$):
   A boundary point in $\mathcal{C}$ that achieves this maximum projection:
   $$S_{\mathcal{C}}(\mathbf{d}) \equiv \arg\max_{\mathbf{x} \in \mathcal{C}} (\mathbf{x} \cdot \mathbf{d})$$
   $$h_{\mathcal{C}}(\mathbf{d}) = S_{\mathcal{C}}(\mathbf{d}) \cdot \mathbf{d}$$

```
Support Mapping Geometry: S_C(d) is the Farthest Point Along Vector d

                          d (Search Vector)
                         ▲
                        /
                       /
       Supporting     /               S_C(d) (Extreme Support Point)
       Hyperplane    /                 *
       ─────────────/──────────────────┼────────────────────────
                   /                  / \
                  /                  /   \
                 /                  /  C  \
                /                  /_______\
```

### 4.2.2 Support Mappings for Canonical Primitives
1. **Circular Disk** $\mathcal{C}(\mathbf{c}, r)$:
   For any direction $\mathbf{d} \ne \mathbf{0}$, the farthest point on a circle is reached by traveling from center $\mathbf{c}$ along unit vector $\hat{\mathbf{d}} = \mathbf{d}/\|\mathbf{d}\|$ by radius $r$:
   $$S_{\text{circle}}(\mathbf{d}) = \mathbf{c} + r \frac{\mathbf{d}}{\|\mathbf{d}\|}$$
2. **Convex Polygon** with vertices $\{\mathbf{v}_1, \dots, \mathbf{v}_M\}$:
   Because the objective function $f(\mathbf{x}) = \mathbf{x} \cdot \mathbf{d}$ is linear, its maximum over a convex polygon must occur at one of the extremal vertices:
   $$S_{\text{polygon}}(\mathbf{d}) = \arg\max_{\mathbf{v}_i} (\mathbf{v}_i \cdot \mathbf{d})$$
   This requires evaluating only $M$ dot products ($\mathcal{O}(M)$ brute force) or $\mathcal{O}(\log M)$ using hill-climbing binary search on sorted edge angles.
3. **Axis-Aligned Bounding Box (AABB)** with center $\mathbf{c}$ and half-extents $\mathbf{e}$:
   $$S_{\text{AABB}}(\mathbf{d}) = \mathbf{c} + \begin{bmatrix} \text{sgn}(d_x) e_x \\ \text{sgn}(d_y) e_y \end{bmatrix}$$
   This requires zero multiplications, executing in 2 clock cycles via sign-bit checks!

---

## 4.3 The Minkowski Difference of Convex Polygons

In Chapter 1, we established the Origin Inclusion Theorem:
$$\mathcal{A} \cap \mathcal{B} \ne \emptyset \iff \mathbf{0} \in (\mathcal{A} \ominus \mathcal{B})$$

When $\mathcal{A}$ and $\mathcal{B}$ are convex polygons with $M_A$ and $M_B$ vertices respectively:
$$\mathcal{A} = \text{Conv}(\{\mathbf{a}_1, \dots, \mathbf{a}_{M_A}\}), \quad \mathcal{B} = \text{Conv}(\{\mathbf{b}_1, \dots, \mathbf{b}_{M_B}\})$$

### 4.3.1 Pairwise Vertex Expansion
The Minkowski difference set is the convex hull of all pairwise vertex differences:
$$\mathcal{A} \ominus \mathcal{B} = \text{Conv}\left( \{ \mathbf{a}_i - \mathbf{b}_j : i \in \{1, \dots, M_A\}, j \in \{1, \dots, M_B\} \} \right)$$

Although there are $M_A \times M_B$ total pairwise combinations, the boundary of the resulting convex polygon $\partial(\mathcal{A} \ominus \mathcal{B})$ possesses **at most $M_A + M_B$ extremal vertices**:
$$\text{Vertices}(\mathcal{A} \ominus \mathcal{B}) \le M_A + M_B$$

The edges of $\mathcal{A} \ominus \mathcal{B}$ consist exclusively of the edges of $\mathcal{A}$ and the inverted edges of $\mathcal{B}$, sorted cyclically by polar angle.

### 4.3.2 The Minkowski Support Identity
The crowning computational breakthrough of the support mapping is its linearity over Minkowski subtraction:
> **Theorem (Minkowski Difference Support Identity):**
> For any direction $\mathbf{d} \in \mathbb{R}^d$:
> $$S_{\mathcal{A} \ominus \mathcal{B}}(\mathbf{d}) = S_{\mathcal{A}}(\mathbf{d}) - S_{\mathcal{B}}(-\mathbf{d})$$

**Proof:**
By definition of the support function:
$$h_{\mathcal{A} \ominus \mathcal{B}}(\mathbf{d}) = \sup_{\mathbf{p} \in (\mathcal{A} \ominus \mathcal{B})} (\mathbf{p} \cdot \mathbf{d}) = \sup_{\mathbf{a} \in \mathcal{A}, \mathbf{b} \in \mathcal{B}} ((\mathbf{a} - \mathbf{b}) \cdot \mathbf{d}) = \sup_{\mathbf{a} \in \mathcal{A}, \mathbf{b} \in \mathcal{B}} (\mathbf{a} \cdot \mathbf{d} - \mathbf{b} \cdot \mathbf{d})$$
Using the identity $-\mathbf{b} \cdot \mathbf{d} = \mathbf{b} \cdot (-\mathbf{d})$:
$$h_{\mathcal{A} \ominus \mathcal{B}}(\mathbf{d}) = \sup_{\mathbf{a} \in \mathcal{A}} (\mathbf{a} \cdot \mathbf{d}) + \sup_{\mathbf{b} \in \mathcal{B}} (\mathbf{b} \cdot (-\mathbf{d})) = h_{\mathcal{A}}(\mathbf{d}) + h_{\mathcal{B}}(-\mathbf{d})$$
Because the suprema are attained independently, the extreme support point of the Minkowski difference is:
$$S_{\mathcal{A} \ominus \mathcal{B}}(\mathbf{d}) = S_{\mathcal{A}}(\mathbf{d}) - S_{\mathcal{B}}(-\mathbf{d}) \quad \blacksquare$$

**Significance in Simulation:**
This identity proves that **we never need to construct the full Minkowski difference explicitly!**
To sample any boundary point of $\mathcal{A} \ominus \mathcal{B}$ in direction $\mathbf{d}$, we simply query shape $\mathcal{A}$ in direction $\mathbf{d}$, query shape $\mathcal{B}$ in the opposite direction $-\mathbf{d}$, and subtract the two vectors. This is the mathematical foundation of the Gilbert-Johnson-Keerthi (GJK) collision algorithm.

---

## 4.4 The Hyperplane Separation Theorem (HST)

Formulated by Hermann Minkowski in 1910 and foundational to functional analysis, optimization theory, and computational geometry, the Hyperplane Separation Theorem establishes the geometric boundary between separation and intersection.

### 4.4.1 Formal Mathematical Formulation
> **The Hyperplane Separation Theorem (Minkowski, 1910):**
> Let $\mathcal{A}, \mathcal{B} \subset \mathbb{R}^d$ be two non-empty, disjoint, closed convex sets ($\mathcal{A} \cap \mathcal{B} = \emptyset$).
> Then there exists a non-zero normal vector $\mathbf{n} \in \mathbb{R}^d$ ($\mathbf{n} \ne \mathbf{0}$) and a real scalar constant $c \in \mathbb{R}$ such that the hyperplane $\mathcal{H} = \{ \mathbf{x} \in \mathbb{R}^d : \mathbf{x} \cdot \mathbf{n} = c \}$ strictly separates $\mathcal{A}$ and $\mathcal{B}$:
> $$\forall \mathbf{a} \in \mathcal{A}, \quad \mathbf{a} \cdot \mathbf{n} < c$$
> $$\forall \mathbf{b} \in \mathcal{B}, \quad \mathbf{b} \cdot \mathbf{n} > c$$

```
Hyperplane Separation in 2D Space

                 Set A
                 ┌────┐
                 │ A  │               Separating Line H: x · n = c
                 └────┘             /
                         \         /           Set B
                          \       /            ┌──────────┐
                           \     /             │          │
                            \   /              │    B     │
                             \ /               │          │
                              *                └──────────┘
                            n (Separating Normal)
```

In 2D space ($d = 2$), a hyperplane is a straight line $A x + B y = c$. In 3D space ($d = 3$), a hyperplane is a flat plane $A x + B y + C z = d$.

### 4.4.2 The 1D Interval Projection Interpretation
Projecting a 2D convex polygon $\mathcal{A}$ onto a 1D axis defined by unit vector $\hat{\mathbf{n}}$ collapses the 2D polygon into a closed 1D scalar interval $I_{\mathcal{A}}(\hat{\mathbf{n}})$:
$$I_{\mathcal{A}}(\hat{\mathbf{n}}) = [s_{\min, \mathcal{A}}, \, s_{\max, \mathcal{A}}]$$
where:
$$s_{\min, \mathcal{A}} = \min_{\mathbf{a} \in \mathcal{A}} (\mathbf{a} \cdot \hat{\mathbf{n}}), \quad s_{\max, \mathcal{A}} = \max_{\mathbf{a} \in \mathcal{A}} (\mathbf{a} \cdot \hat{\mathbf{n}})$$

Similarly for set $\mathcal{B}$:
$$I_{\mathcal{B}}(\hat{\mathbf{n}}) = [s_{\min, \mathcal{B}}, \, s_{\max, \mathcal{B}}]$$

```
1D Projection Interval States on Axis n

  Case 1: Disjoint Intervals (SEPARATED!)
  |------- I_A -------|
                          |------- I_B -------|
  s_max,A < s_min,B  ===> Axis n is a SEPARATING AXIS! Shapes CANNOT collide!

  Case 2: Overlapping Intervals
  |------- I_A -------|
                |------- I_B -------|
  Overlap exists on this axis. Must test remaining candidate axes!
```

Two intervals $I_{\mathcal{A}}$ and $I_{\mathcal{B}}$ are disjoint if and only if:
$$s_{\max, \mathcal{A}} < s_{\min, \mathcal{B}} \quad \text{or} \quad s_{\max, \mathcal{B}} < s_{\min, \mathcal{A}}$$

The Hyperplane Separation Theorem can be stated in its most practical algorithmic form:
> **Theorem (Separating Axis Predicate):**
> Two convex bodies $\mathcal{A}$ and $\mathcal{B}$ are separated if and only if there exists **at least one axis $\hat{\mathbf{n}}$** along which their 1D projected intervals are disjoint:
> $$\mathcal{A} \cap \mathcal{B} = \emptyset \iff \exists \hat{\mathbf{n}} \text{ such that } I_{\mathcal{A}}(\hat{\mathbf{n}}) \cap I_{\mathcal{B}}(\hat{\mathbf{n}}) = \emptyset$$

If we test an axis and discover that the 1D intervals do not touch, **we immediately terminate testing**: the shapes are guaranteed not to collide! This enables early-exit performance optimizations in narrow-phase solvers.

---

## 4.5 Progressive Numerical Worked Examples

---

### Worked Example 4.1: Algebraic Convexity Verification
**Problem Statement:** Prove algebraically whether the following two 2D point sets are convex or non-convex:
1. Set 1 (Solid unit disk): $\mathcal{S}_1 = \{ \mathbf{x} \in \mathbb{R}^2 : \|\mathbf{x}\| \le 1.0 \}$.
2. Set 2 (L-shaped polygon): Vertices at $[0, 0]^T, [3, 0]^T, [3, 1]^T, [1, 1]^T, [1, 3]^T, [0, 3]^T$.

**Step-by-Step Mathematical Solution:**

**Step 1: Testing Set 1 (Solid disk).**
Let $\mathbf{x}, \mathbf{y} \in \mathcal{S}_1$. By definition:
$$\|\mathbf{x}\| \le 1.0 \quad \text{and} \quad \|\mathbf{y}\| \le 1.0$$
Consider any convex combination $\mathbf{z} = (1 - \lambda)\mathbf{x} + \lambda \mathbf{y}$ where $\lambda \in [0, 1]$.
Evaluating the norm of $\mathbf{z}$ using the Triangle Inequality:
$$\|\mathbf{z}\| = \|(1 - \lambda)\mathbf{x} + \lambda \mathbf{y}\| \le \|(1 - \lambda)\mathbf{x}\| + \|\lambda \mathbf{y}\|$$
Since $\lambda \ge 0$ and $1 - \lambda \ge 0$:
$$\|\mathbf{z}\| \le (1 - \lambda) \|\mathbf{x}\| + \lambda \|\mathbf{y}\|$$
Substituting $\|\mathbf{x}\| \le 1$ and $\|\mathbf{y}\| \le 1$:
$$\|\mathbf{z}\| \le (1 - \lambda)(1.0) + \lambda(1.0) = 1 - \lambda + \lambda = 1.0$$
Because $\|\mathbf{z}\| \le 1.0$, $\mathbf{z} \in \mathcal{S}_1$ for all $\lambda \in [0, 1]$.
**Conclusion:** $\mathcal{S}_1$ is **strictly convex**.

**Step 2: Testing Set 2 (L-shaped polygon).**
To prove non-convexity, we need find only **one counter-example** pair of points $\mathbf{x}, \mathbf{y} \in \mathcal{S}_2$ whose line segment leaves the set.
Let $\mathbf{x} = [0.5, 2.5]^T$ (inside the vertical leg: $x \in [0, 1], y \in [0, 3]$).
Let $\mathbf{y} = [2.5, 0.5]^T$ (inside the horizontal leg: $x \in [0, 3], y \in [0, 1]$).
Both $\mathbf{x} \in \mathcal{S}_2$ and $\mathbf{y} \in \mathcal{S}_2$.
Now evaluate the midpoint ($\lambda = 0.5$):
$$\mathbf{m} = \frac{\mathbf{x} + \mathbf{y}}{2} = \begin{bmatrix} \frac{0.5 + 2.5}{2} \\ \frac{2.5 + 0.5}{2} \end{bmatrix} = \begin{bmatrix} 1.50 \\ 1.50 \end{bmatrix}$$
Does $\mathbf{m} \in \mathcal{S}_2$?
In the L-shaped polygon, any point with $x > 1.0$ must satisfy $y \le 1.0$.
Here $x = 1.50 > 1.0$, but $y = 1.50 > 1.0$.
Point $\mathbf{m}$ lies in the empty inner reflex pocket!
$\mathbf{m} \notin \mathcal{S}_2$.
**Conclusion:** The L-shape is **non-convex**.

---

### Worked Example 4.2: Explicit Construction of Minkowski Difference $\mathcal{A} \ominus \mathcal{B}$
**Problem Statement:** Two 2D triangles are defined by their vertices:
- Triangle $\mathcal{A}$: $\mathbf{a}_1 = [1, 1]^T, \mathbf{a}_2 = [3, 1]^T, \mathbf{a}_3 = [2, 4]^T$
- Triangle $\mathcal{B}$: $\mathbf{b}_1 = [2, 2]^T, \mathbf{b}_2 = [4, 2]^T, \mathbf{b}_3 = [3, 5]^T$
1. Calculate all $3 \times 3 = 9$ pairwise difference vectors $\mathbf{d}_{ij} = \mathbf{a}_i - \mathbf{b}_j$.
2. Identify the convex hull vertices forming the outer boundary of $\mathcal{A} \ominus \mathcal{B}$.
3. Check whether the origin $\mathbf{0} = [0, 0]^T$ belongs to $\mathcal{A} \ominus \mathcal{B}$ and conclude collision status.

**Step-by-Step Mathematical Solution:**

**Step 1: Calculating 9 pairwise differences.**
- Subtracting $\mathbf{b}_1 = [2, 2]^T$:
  $$\mathbf{d}_{11} = \mathbf{a}_1 - \mathbf{b}_1 = [1 - 2, 1 - 2]^T = [-1, -1]^T$$
  $$\mathbf{d}_{21} = \mathbf{a}_2 - \mathbf{b}_1 = [3 - 2, 1 - 2]^T = [+1, -1]^T$$
  $$\mathbf{d}_{31} = \mathbf{a}_3 - \mathbf{b}_1 = [2 - 2, 4 - 2]^T = [0, +2]^T$$
- Subtracting $\mathbf{b}_2 = [4, 2]^T$:
  $$\mathbf{d}_{12} = \mathbf{a}_1 - \mathbf{b}_2 = [1 - 4, 1 - 2]^T = [-3, -1]^T$$
  $$\mathbf{d}_{22} = \mathbf{a}_2 - \mathbf{b}_2 = [3 - 4, 1 - 2]^T = [-1, -1]^T \quad (\text{Duplicate})$$
  $$\mathbf{d}_{32} = \mathbf{a}_3 - \mathbf{b}_2 = [2 - 4, 4 - 2]^T = [-2, +2]^T$$
- Subtracting $\mathbf{b}_3 = [3, 5]^T$:
  $$\mathbf{d}_{13} = \mathbf{a}_1 - \mathbf{b}_3 = [1 - 3, 1 - 5]^T = [-2, -4]^T$$
  $$\mathbf{d}_{23} = \mathbf{a}_2 - \mathbf{b}_3 = [3 - 3, 1 - 5]^T = [0, -4]^T$$
  $$\mathbf{d}_{33} = \mathbf{a}_3 - \mathbf{b}_3 = [2 - 3, 4 - 5]^T = [-1, -1]^T \quad (\text{Duplicate})$$

**Step 2: Convex hull boundary vertices.**
The unique difference points are:
$\mathcal{P} = \{ [-1, -1], [1, -1], [0, 2], [-3, -1], [-2, 2], [-2, -4], [0, -4] \}$.
Scanning coordinates to find the convex polygon boundary:
- Extreme points:
  - Bottom-most: $[-2, -4]^T$ and $[0, -4]^T$
  - Right-most: $[1, -1]^T$
  - Top-most: $[0, 2]^T$ and $[-2, 2]^T$
  - Left-most: $[-3, -1]^T$

The convex hull boundary vertices in counter-clockwise order are:
$$\mathbf{v}_1 = [0, -4]^T, \quad \mathbf{v}_2 = [1, -1]^T, \quad \mathbf{v}_3 = [0, 2]^T, \quad \mathbf{v}_4 = [-2, 2]^T, \quad \mathbf{v}_5 = [-3, -1]^T, \quad \mathbf{v}_6 = [-2, -4]^T$$
Notice that $\mathcal{A} \ominus \mathcal{B}$ forms a symmetric 6-sided hexagon ($M_A + M_B = 3 + 3 = 6$ vertices).

**Step 3: Origin inclusion test.**
Look at the point $[-1, -1]^T$ computed in Step 1: it lies strictly in the interior of the hexagon.
Is $\mathbf{0} = [0, 0]^T$ inside the hexagon?
Line segment connecting $\mathbf{v}_2 = [1, -1]^T$ and $\mathbf{v}_3 = [0, 2]^T$:
Edge equation: from $[1, -1]$ to $[0, 2]$, vector is $[-1, 3]^T$.
Left normal to this edge: $\mathbf{n} = [3, 1]^T$.
Testing origin: $\mathbf{0} \cdot [3, 1]^T = 0$.
Testing vertex on edge: $\mathbf{v}_3 \cdot [3, 1]^T = (0)(3) + (2)(1) = 2.0$.
Since $0 \le 2.0$, the origin lies on the interior side of edge $\mathbf{v}_2 \mathbf{v}_3$.
Testing all other edges reveals that $\mathbf{0} = [0, 0]^T$ is **strictly inside the hexagon $\mathcal{A} \ominus \mathcal{B}$**.
**Conclusion:** By the Origin Inclusion Theorem, **Triangle $\mathcal{A}$ and Triangle $\mathcal{B}$ OVERLAP.**
Direct check: at $[2.5, 2.5]^T$, both triangles contain the point.

---

### Worked Example 4.3: Support Function Evaluation for a Regular Pentagon
**Problem Statement:** A regular pentagon $\mathcal{C}$ with circumradius $R = 2.0\text{ m}$ centered at the origin has vertices:
$\mathbf{v}_k = [R \cos(\theta_k), R \sin(\theta_k)]^T$ for $\theta_k = \frac{2\pi k}{5}$, $k \in \{0, 1, 2, 3, 4\}$.
Numerical coordinates:
- $\mathbf{v}_0 = [2.000, 0.000]^T$ ($\theta = 0^\circ$)
- $\mathbf{v}_1 = [0.618, 1.902]^T$ ($\theta = 72^\circ$)
- $\mathbf{v}_2 = [-1.618, 1.176]^T$ ($\theta = 144^\circ$)
- $\mathbf{v}_3 = [-1.618, -1.176]^T$ ($\theta = 216^\circ$)
- $\mathbf{v}_4 = [0.618, -1.902]^T$ ($\theta = 288^\circ$)

Evaluate the support point $S_{\mathcal{C}}(\mathbf{d})$ and support value $h_{\mathcal{C}}(\mathbf{d})$ for search vector $\mathbf{d} = [1.0, 2.0]^T$.

**Step-by-Step Mathematical Solution:**

**Step 1: Compute dot product for each vertex.**
We evaluate $f(\mathbf{v}_k) = \mathbf{v}_k \cdot \mathbf{d} = v_{k, x}(1.0) + v_{k, y}(2.0)$:
- For $\mathbf{v}_0$: $(2.000)(1.0) + (0.000)(2.0) = 2.0000$
- For $\mathbf{v}_1$: $(0.6180)(1.0) + (1.9021)(2.0) = 0.6180 + 3.8042 = 4.4222$
- For $\mathbf{v}_2$: $(-1.6180)(1.0) + (1.1756)(2.0) = -1.6180 + 2.3512 = 0.7332$
- For $\mathbf{v}_3$: $(-1.6180)(1.0) + (-1.1756)(2.0) = -1.6180 - 2.3512 = -3.9692$
- For $\mathbf{v}_4$: $(0.6180)(1.0) + (-1.9021)(2.0) = 0.6180 - 3.8042 = -3.1862$

**Step 2: Find the maximum projection.**
Comparing values:
$$\max(2.0000, 4.4222, 0.7332, -3.9692, -3.1862) = 4.4222$$
The maximum occurs at vertex $\mathbf{v}_1 = [0.618, 1.902]^T$.

**Step 3: Result.**
- Support Point: $S_{\mathcal{C}}(\mathbf{d}) = \mathbf{v}_1 = [0.618, 1.902]^T\text{ m}$
- Support Value: $h_{\mathcal{C}}(\mathbf{d}) = 4.4222\text{ m}^2$

---

### Worked Example 4.4: Support Mapping Over Minkowski Difference
**Problem Statement:** For the pentagon $\mathcal{C}$ from Example 4.3 and a circle $\mathcal{B}$ with center $\mathbf{c}_B = [3.0, 1.0]^T\text{ m}$ and radius $r = 1.0\text{ m}$:
Use the Minkowski Support Identity $S_{\mathcal{C} \ominus \mathcal{B}}(\mathbf{d}) = S_{\mathcal{C}}(\mathbf{d}) - S_{\mathcal{B}}(-\mathbf{d})$ to find the extreme point of their Minkowski difference in direction $\mathbf{d} = [1.0, 2.0]^T$.

**Step-by-Step Mathematical Solution:**

**Step 1: Retrieve $S_{\mathcal{C}}(\mathbf{d})$.**
From Example 4.3, for $\mathbf{d} = [1.0, 2.0]^T$:
$$S_{\mathcal{C}}(\mathbf{d}) = [0.6180, 1.9021]^T\text{ m}$$

**Step 2: Compute $S_{\mathcal{B}}(-\mathbf{d})$.**
The opposite search vector is $-\mathbf{d} = [-1.0, -2.0]^T$.
Magnitude: $\|-\mathbf{d}\| = \sqrt{(-1.0)^2 + (-2.0)^2} = \sqrt{1 + 4} = \sqrt{5} \approx 2.23607$.
Unit direction:
$$\widehat{-\mathbf{d}} = \frac{1}{\sqrt{5}} \begin{bmatrix} -1.0 \\ -2.0 \end{bmatrix} \approx \begin{bmatrix} -0.447214 \\ -0.894427 \end{bmatrix}$$
For circle $\mathcal{B}$ (center $\mathbf{c}_B = [3.0, 1.0]^T$, radius $r = 1.0$):
$$S_{\mathcal{B}}(-\mathbf{d}) = \mathbf{c}_B + r \widehat{-\mathbf{d}} = \begin{bmatrix} 3.0 \\ 1.0 \end{bmatrix} + 1.0 \begin{bmatrix} -0.447214 \\ -0.894427 \end{bmatrix} = \begin{bmatrix} 2.552786 \\ 0.105573 \end{bmatrix}\text{ m}$$

**Step 3: Subtract to obtain $S_{\mathcal{C} \ominus \mathcal{B}}(\mathbf{d})$.**
$$S_{\mathcal{C} \ominus \mathcal{B}}(\mathbf{d}) = S_{\mathcal{C}}(\mathbf{d}) - S_{\mathcal{B}}(-\mathbf{d}) = \begin{bmatrix} 0.618034 \\ 1.902113 \end{bmatrix} - \begin{bmatrix} 2.552786 \\ 0.105573 \end{bmatrix} = \begin{bmatrix} 0.618034 - 2.552786 \\ 1.902113 - 0.105573 \end{bmatrix} = \begin{bmatrix} -1.934752 \\ +1.796540 \end{bmatrix}\text{ m}$$
This single vector evaluation sampled the exact farthest boundary point of the complex curved Minkowski shape without constructing any polygons!

---

### Worked Example 4.5: Separating Hyperplane Derivation for Disjoint Squares
**Problem Statement:** Two unit squares are placed in the 2D plane:
- Square $\mathcal{A}$: Centered at $\mathbf{c}_A = [0.0, 0.0]^T$ with vertices $[\pm 1, \pm 1]^T$ ($x \in [-1, 1], y \in [-1, 1]$)
- Square $\mathcal{B}$: Centered at $\mathbf{c}_B = [5.0, 3.0]^T$ with vertices $[5 \pm 1, 3 \pm 1]^T$ ($x \in [4, 6], y \in [2, 4]$)
1. Project both squares onto the $x$-axis ($\hat{\mathbf{n}}_x = [1, 0]^T$) and determine their intervals.
2. Check if the $x$-axis is a separating axis.
3. Formulate the equation of the vertical separating line $x = c$.
4. Project onto the $y$-axis ($\hat{\mathbf{n}}_y = [0, 1]^T$) and determine if it is also a separating axis.

**Step-by-Step Mathematical Solution:**

**Step 1: Projection onto $x$-axis ($\hat{\mathbf{n}}_x = [1, 0]^T$).**
- For Square $\mathcal{A}$:
  $$s_{\min, A} = \min_{\mathbf{v} \in \mathcal{A}} (v_x) = -1.0, \quad s_{\max, A} = \max_{\mathbf{v} \in \mathcal{A}} (v_x) = +1.0 \implies I_{\mathcal{A}}(\hat{\mathbf{n}}_x) = [-1.0, +1.0]$$
- For Square $\mathcal{B}$:
  $$s_{\min, B} = \min_{\mathbf{v} \in \mathcal{B}} (v_x) = 4.0, \quad s_{\max, B} = \max_{\mathbf{v} \in \mathcal{B}} (v_x) = 6.0 \implies I_{\mathcal{B}}(\hat{\mathbf{n}}_x) = [4.0, 6.0]$$

**Step 2: Separating axis check.**
$$s_{\max, A} = +1.0 < s_{\min, B} = 4.0$$
The intervals $[-1.0, 1.0]$ and $[4.0, 6.0]$ are disjoint! The gap between them is $4.0 - 1.0 = 3.0\text{ m}$.
Therefore, $\hat{\mathbf{n}}_x = [1, 0]^T$ is a **valid separating axis**.

**Step 3: Equation of separating line.**
Any constant $c \in (s_{\max, A}, s_{\min, B}) = (1.0, 4.0)$ defines a valid separating line.
Selecting the midpoint $c = \frac{1.0 + 4.0}{2} = 2.50$:
$$\mathcal{H}: \quad x = 2.50\text{ m} \quad (\text{or } [1, 0]^T \cdot \mathbf{x} = 2.50)$$
All points in $\mathcal{A}$ have $x \le 1.0 < 2.5$, and all points in $\mathcal{B}$ have $x \ge 4.0 > 2.5$. The line cleanly separates the two sets.

**Step 4: Projection onto $y$-axis ($\hat{\mathbf{n}}_y = [0, 1]^T$).**
- For Square $\mathcal{A}$: $I_{\mathcal{A}}(\hat{\mathbf{n}}_y) = [-1.0, +1.0]$
- For Square $\mathcal{B}$: $I_{\mathcal{B}}(\hat{\mathbf{n}}_y) = [2.0, 4.0]$
Here $s_{\max, A} = +1.0 < s_{\min, B} = 2.0$.
The gap along the $y$-axis is $2.0 - 1.0 = 1.0\text{ m}$.
The $y$-axis is **also a separating axis**! (Midpoint line: $y = 1.50\text{ m}$).

---

### Worked Example 4.6: Convex Decomposition of a U-Shaped Arena
**Problem Statement:** A 2D hollow containment arena has an outer box of $10\text{ m} \times 10\text{ m}$ ($x \in [0, 10], y \in [0, 10]$) with a central U-shaped opening of $6\text{ m} \times 8\text{ m}$ open at the top ($y = 10$).
Its solid geometry consists of a floor of thickness $2\text{ m}$ ($y \in [0, 2]$) and two vertical walls of thickness $2\text{ m}$ on the left ($x \in [0, 2], y \in [2, 10]$) and right ($x \in [8, 10], y \in [2, 10]$).
1. Show why treating the entire arena as a single non-convex polygon would fail under standard SAT.
2. Decompose the arena into three non-overlapping convex AABBs.
3. List the bounding vectors $(\mathbf{min}_k, \mathbf{max}_k)$ for each convex component.

**Step-by-Step Mathematical Solution:**

**Step 1: Why non-convex SAT fails.**
If treated as a single polygon, the convex hull of the U-shape would stretch across the open top from $[0, 10]^T$ to $[10, 10]^T$, creating a false "roof" across the opening. Any object inside the arena's open interior would be reported as colliding with the arena's convex hull, preventing entry through the opening.

**Step 2 & 3: Convex AABB decomposition.**
The U-shape decomposes naturally into 3 convex rectangular parts:
1. **Part 1 (Floor Slab):**
   $$\mathbf{min}_1 = [0.0, 0.0]^T\text{ m}, \quad \mathbf{max}_1 = [10.0, 2.0]^T\text{ m}$$
   Dimensions: $10.0\text{ m} \times 2.0\text{ m}$.
2. **Part 2 (Left Vertical Pillar):**
   $$\mathbf{min}_2 = [0.0, 2.0]^T\text{ m}, \quad \mathbf{max}_2 = [2.0, 10.0]^T\text{ m}$$
   Dimensions: $2.0\text{ m} \times 8.0\text{ m}$.
3. **Part 3 (Right Vertical Pillar):**
   $$\mathbf{min}_3 = [8.0, 2.0]^T\text{ m}, \quad \mathbf{max}_3 = [10.0, 10.0]^T\text{ m}$$
   Dimensions: $2.0\text{ m} \times 8.0\text{ m}$.

The physics engine tests incoming bodies against each of the three convex parts independently. An entity inside the central opening ($x \in [2, 8], y \in [2, 10]$) intersects none of the parts, moving freely through the cavity as expected.

---

### Worked Example 4.7: Minimum Euclidean Distance via Minkowski Boundary
**Problem Statement:** Two disjoint horizontal line segments are:
$\mathcal{A}$: from $[0, 0]^T$ to $[4, 0]^T$
$\mathcal{B}$: from $[1, 3]^T$ to $[6, 3]^T$
1. Construct the Minkowski difference $\mathcal{A} \ominus \mathcal{B}$.
2. Compute the minimum Euclidean distance from the origin $\mathbf{0}$ to the boundary of $\mathcal{A} \ominus \mathcal{B}$.
3. Verify that this equals the physical separation distance between the two segments.

**Step-by-Step Mathematical Solution:**

**Step 1: Constructing $\mathcal{A} \ominus \mathcal{B}$.**
Endpoints of $\mathcal{A}$: $\mathbf{a}_1 = [0, 0]^T, \mathbf{a}_2 = [4, 0]^T$.
Endpoints of $\mathcal{B}$: $\mathbf{b}_1 = [1, 3]^T, \mathbf{b}_2 = [6, 3]^T$.
Inverted segment $-\mathcal{B}$: from $[-6, -3]^T$ to $[-1, -3]^T$.
Minkowski difference $\mathcal{A} \ominus \mathcal{B} = \mathcal{A} \oplus (-\mathcal{B})$:
Adding interval $[0, 4]$ on $x$ to interval $[-6, -1]$ on $x$:
$$x \in [0 + (-6), \, 4 + (-1)] = [-6.0, \, +3.0]\text{ m}$$
In $y$: $0 + (-3) = -3.0\text{ m}$.
Therefore, $\mathcal{A} \ominus \mathcal{B}$ is a horizontal line segment at $y = -3.0\text{ m}$ extending from $x = -6.0\text{ m}$ to $x = +3.0\text{ m}$.

**Step 2: Distance from origin to $\mathcal{A} \ominus \mathcal{B}$.**
The origin is at $[0, 0]^T$.
The segment is located at $y = -3.0\text{ m}$ with $x \in [-6, 3]$.
Since $x = 0$ falls within $[-6, 3]$, the closest point on the segment to $[0, 0]^T$ is $[0, -3.0]^T$.
$$\text{dist}(\mathbf{0}, \mathcal{A} \ominus \mathcal{B}) = \|[0, 0]^T - [0, -3.0]^T\| = 3.000\text{ meters}$$

**Step 3: Physical verification.**
Segment $\mathcal{A}$ lies along $y = 0$ ($x \in [0, 4]$).
Segment $\mathcal{B}$ lies along $y = 3$ ($x \in [1, 6]$).
Their $x$-intervals overlap in $[1, 4]$.
The perpendicular vertical distance between the two parallel segments is $|3.0 - 0.0| = 3.000\text{ meters}$.
The distance from the origin to the Minkowski difference matches the true physical separation distance identically!

---

### Worked Example 4.8: Projection Interval and Gap Calculation along an Arbitrary Axis
**Problem Statement:** Two convex bodies $\mathcal{A}$ and $\mathcal{B}$ are tested along diagonal test axis $\hat{\mathbf{n}} = [0.80, 0.60]^T$ ($\|\hat{\mathbf{n}}\| = 1.0$).
- Body $\mathcal{A}$ (triangle): Vertices $[1, 1]^T, [3, 2]^T, [2, 4]^T$.
- Body $\mathcal{B}$ (circle): Center $\mathbf{c}_B = [8, 9]^T$, radius $r = 1.5\text{ m}$.
1. Compute the projected 1D interval $I_{\mathcal{A}}(\hat{\mathbf{n}})$.
2. Compute the projected 1D interval $I_{\mathcal{B}}(\hat{\mathbf{n}})$.
3. Determine whether $\hat{\mathbf{n}}$ is a separating axis, and calculate the separation gap.

**Step-by-Step Mathematical Solution:**

**Step 1: Projecting Triangle $\mathcal{A}$.**
Evaluate dot product $\mathbf{v} \cdot \hat{\mathbf{n}} = 0.80 v_x + 0.60 v_y$ for each vertex:
- Vertex 1: $0.80(1.0) + 0.60(1.0) = 0.80 + 0.60 = 1.40\text{ m}$
- Vertex 2: $0.80(3.0) + 0.60(2.0) = 2.40 + 1.20 = 3.60\text{ m}$
- Vertex 3: $0.80(2.0) + 0.60(4.0) = 1.60 + 2.40 = 4.00\text{ m}$
Minimum is $1.40\text{ m}$, maximum is $4.00\text{ m}$:
$$I_{\mathcal{A}}(\hat{\mathbf{n}}) = [1.400, 4.000]\text{ m}$$

**Step 2: Projecting Circle $\mathcal{B}$.**
For a circle with center $\mathbf{c}_B$ and radius $r$, the projection onto unit vector $\hat{\mathbf{n}}$ is simply:
$$s_{\text{center}} = \mathbf{c}_B \cdot \hat{\mathbf{n}} = 0.80(8.0) + 0.60(9.0) = 6.40 + 5.40 = 11.80\text{ m}$$
The interval extends by radius $r = 1.50\text{ m}$ on either side:
$$s_{\min, B} = 11.80 - 1.50 = 10.30\text{ m}$$
$$s_{\max, B} = 11.80 + 1.50 = 13.30\text{ m}$$
$$I_{\mathcal{B}}(\hat{\mathbf{n}}) = [10.300, 13.300]\text{ m}$$

**Step 3: Gap calculation.**
Comparing intervals:
$$s_{\max, A} = 4.00\text{ m} < s_{\min, B} = 10.30\text{ m}$$
$$\text{Gap} = s_{\min, B} - s_{\max, A} = 10.30 - 4.00 = 6.300\text{ meters}$$
Because the gap is strictly positive ($6.30\text{ m} > 0$), $\hat{\mathbf{n}} = [0.80, 0.60]^T$ is a **separating axis**. The shapes are guaranteed not to intersect.

---

### Worked Example 4.9: Support Function of a Transformed Convex Body
**Problem Statement:** A convex shape $\mathcal{C}$ has known support mapping $S_{\mathcal{C}}(\mathbf{d})$.
The shape is placed into the simulation world via rigid transformation $\mathbf{x} = \mathbf{R} \mathbf{x}' + \mathbf{p}_0$, where $\mathbf{R} \in \text{SO}(2)$ is a rotation matrix and $\mathbf{p}_0$ is translation.
1. Prove analytically that the world-space support mapping is:
   $$S_{\text{world}}(\mathbf{d}) = \mathbf{R} S_{\mathcal{C}}(\mathbf{R}^T \mathbf{d}) + \mathbf{p}_0$$
2. Let $\mathcal{C}$ be an AABB with half-extents $\mathbf{e} = [2, 1]^T$. Let $\mathbf{p}_0 = [5, 4]^T$ and $\theta = 90^\circ$ ($\mathbf{R} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$).
   Compute the world support point for direction $\mathbf{d} = [1, 0]^T$.

**Step-by-Step Mathematical Solution:**

**Step 1: Analytical proof.**
World-space support point maximizes $\mathbf{x} \cdot \mathbf{d}$:
$$S_{\text{world}}(\mathbf{d}) = \arg\max_{\mathbf{x}} (\mathbf{x} \cdot \mathbf{d}) = \arg\max_{\mathbf{x}' \in \mathcal{C}} ((\mathbf{R} \mathbf{x}' + \mathbf{p}_0) \cdot \mathbf{d})$$
Using the transpose property of dot products ($\mathbf{R}\mathbf{u} \cdot \mathbf{v} = \mathbf{u} \cdot \mathbf{R}^T \mathbf{v}$):
$$(\mathbf{R} \mathbf{x}' + \mathbf{p}_0) \cdot \mathbf{d} = \mathbf{x}' \cdot (\mathbf{R}^T \mathbf{d}) + \mathbf{p}_0 \cdot \mathbf{d}$$
The constant $\mathbf{p}_0 \cdot \mathbf{d}$ does not change the argmax.
Therefore:
$$\mathbf{x}_{\max}' = S_{\mathcal{C}}(\mathbf{R}^T \mathbf{d})$$
Transforming back to world space:
$$S_{\text{world}}(\mathbf{d}) = \mathbf{R} \mathbf{x}_{\max}' + \mathbf{p}_0 = \mathbf{R} S_{\mathcal{C}}(\mathbf{R}^T \mathbf{d}) + \mathbf{p}_0 \quad \blacksquare$$

**Step 2: Numerical evaluation.**
Given $\mathbf{R} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$, $\mathbf{R}^T = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$.
Local search vector:
$$\mathbf{d}_{\text{local}} = \mathbf{R}^T \mathbf{d} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -1 \end{bmatrix}$$
Query local support mapping for AABB ($\mathbf{e} = [2, 1]^T$):
$$S_{\mathcal{C}}(\mathbf{d}_{\text{local}}) = \begin{bmatrix} \text{sgn}(0) e_x \\ \text{sgn}(-1) e_y \end{bmatrix} = \begin{bmatrix} 0 \\ -1(1) \end{bmatrix} = \begin{bmatrix} \text{any } x \in [-2, 2] \\ -1.0 \end{bmatrix}$$
Taking $x = 0$ (or boundary corner $[2, -1]^T$):
$$\mathbf{x}_{\max}' = \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix}$$
Transform to world space:
$$S_{\text{world}} = \mathbf{R} \mathbf{x}_{\max}' + \mathbf{p}_0 = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix} + \begin{bmatrix} 5.0 \\ 4.0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} + \begin{bmatrix} 5.0 \\ 4.0 \end{bmatrix} = \begin{bmatrix} 6.0 \\ 6.0 \end{bmatrix}\text{ m}$$
Notice that $x = 6.0\text{ m}$ is indeed the maximum extent along the positive $x$-axis.

---

### Worked Example 4.10: Extreme Boundary Touch and Origin Invariance
**Problem Statement:** Two unit squares touch at an exact vertical interface:
- Square $\mathcal{A}$: $[-1, 0] \times [-1, 1]$ (right edge at $x = 0$)
- Square $\mathcal{B}$: $[0, 1] \times [-1, 1]$ (left edge at $x = 0$)
1. Formulate the Minkowski difference set $\mathcal{A} \ominus \mathcal{B}$.
2. Verify that the origin $\mathbf{0} = [0, 0]^T$ lies on the boundary $\partial(\mathcal{A} \ominus \mathcal{B})$.
3. Project both squares onto the horizontal axis $\hat{\mathbf{n}} = [1, 0]^T$ and calculate the separation gap.
4. Explain how a numerical engine distinguishes between zero-distance touch and active penetration.

**Step-by-Step Mathematical Solution:**

**Step 1: Constructing $\mathcal{A} \ominus \mathcal{B}$.**
Square $\mathcal{A}$: $x \in [-1, 0], y \in [-1, 1]$.
Square $\mathcal{B}$: $x \in [0, 1], y \in [-1, 1] \implies -\mathcal{B}: x \in [-1, 0], y \in [-1, 1]$.
Minkowski difference $\mathcal{A} \oplus (-\mathcal{B})$:
$$x \in [-1 + (-1), \, 0 + 0] = [-2.0, \, 0.0]\text{ m}$$
$$y \in [-1 + (-1), \, 1 + 1] = [-2.0, \, +2.0]\text{ m}$$
$$\mathcal{A} \ominus \mathcal{B} = [-2.0, 0.0] \times [-2.0, 2.0]\text{ m}$$

**Step 2: Origin location.**
The origin $\mathbf{0} = [0, 0]^T$ has $x = 0.0$ and $y = 0.0$.
In the set $[-2.0, 0.0] \times [-2.0, 2.0]$, the maximum $x$-coordinate is exactly $0.0$.
The origin lies **strictly on the right vertical boundary face** of $\mathcal{A} \ominus \mathcal{B}$!
$$\mathbf{0} \in \partial(\mathcal{A} \ominus \mathcal{B})$$

**Step 3: 1D projection onto $\hat{\mathbf{n}} = [1, 0]^T$.**
- $I_{\mathcal{A}} = [-1.0, 0.0]$
- $I_{\mathcal{B}} = [0.0, 1.0]$
$$s_{\max, A} = 0.0, \quad s_{\min, B} = 0.0$$
$$\text{Gap} = s_{\min, B} - s_{\max, A} = 0.0 - 0.0 \equiv 0.000\text{ meters}$$

**Step 4: Engine interpretation.**
When the gap is identically $0.0$ (or within tolerance $\pm \epsilon$), the bodies are in **kissing contact** (tangential touch).
- If relative normal velocity $v_{\text{rel}} = (\mathbf{v}_B - \mathbf{v}_A) \cdot \mathbf{n} > 0$, the bodies are separating: zero impulse is applied.
- If $v_{\text{rel}} \le 0$, the bodies are moving toward or resting against each other: contact constraint impulses are activated to prevent impending penetration on the next tick.

---

## 4.6 Chapter Mastery Exercises

### Exercise 4.1 (Tier 1): Convexity of an Ellipse
Prove that the solid 2D ellipse $\mathcal{E} = \{ [x, y]^T \in \mathbb{R}^2 : \frac{x^2}{a^2} + \frac{y^2}{b^2} \le 1 \}$ is a convex set.

### Exercise 4.2 (Tier 1): Support Function of an Oriented Segment
A line segment runs from $\mathbf{a} = [1, 2]^T$ to $\mathbf{b} = [5, 4]^T$. Find the support point $S(\mathbf{d})$ for direction $\mathbf{d} = [-1, 1]^T$.

### Exercise 4.3 (Tier 2): Support Point of a 2D Box
An AABB centered at the origin has half-extents $\mathbf{e} = [3.0, 5.0]^T$. Calculate $S_{\text{box}}(\mathbf{d})$ and $h_{\text{box}}(\mathbf{d})$ for $\mathbf{d} = [4.0, -3.0]^T$.

### Exercise 4.4 (Tier 2): Projecting a Circle onto an Arbitrary Axis
Prove analytically that for a circle with center $\mathbf{c}$ and radius $r$, its projected interval onto unit vector $\hat{\mathbf{n}}$ is always $[\mathbf{c} \cdot \hat{\mathbf{n}} - r, \, \mathbf{c} \cdot \hat{\mathbf{n}} + r]$.

### Exercise 4.5 (Tier 3): Separating Axis for Disjoint Triangles
Triangle 1 has vertices $[0, 0], [2, 0], [1, 2]$. Triangle 2 has vertices $[4, 0], [6, 0], [5, 2]$.
1. Project both triangles onto $\hat{\mathbf{n}} = [1, 0]^T$ and find their intervals.
2. State the separating gap distance.

### Exercise 4.6 (Tier 3): Number of Vertices in Minkowski Difference
Polygon $\mathcal{A}$ is a hexagon ($M_A = 6$). Polygon $\mathcal{B}$ is an octagon ($M_B = 8$). What is the maximum theoretical number of vertices on the boundary of their Minkowski difference $\mathcal{A} \ominus \mathcal{B}$?

### Exercise 4.7 (Tier 4): Non-Convex Decomposition Count
A star-shaped polygon has 5 outer points and 5 inner reflex vertices (10 vertices total). What is the minimum number of convex triangles required to decompose this shape?

### Exercise 4.8 (Tier 4): Support Function Duality
Prove that the support function satisfies positive homogeneity:
$$h_{\mathcal{C}}(\alpha \mathbf{d}) = \alpha h_{\mathcal{C}}(\mathbf{d}) \quad \forall \alpha > 0$$

### Exercise 4.9 (Tier 5): The GJK Simplex Invariant
In the Gilbert-Johnson-Keerthi (GJK) algorithm, a 2D simplex consists of at most 3 vertices (a triangle) enclosing or not enclosing the origin. Prove that if $\mathbf{0} \in \mathcal{A} \ominus \mathcal{B}$, there exists a subset of at most 3 vertices in $\mathcal{A} \ominus \mathcal{B}$ whose convex hull contains the origin (Carathéodory's Theorem in 2D).

### Exercise 4.10 (Tier 5): Separating Axis Non-Uniqueness
Prove that for any two strictly separated convex polygons $\mathcal{A}$ and $\mathcal{B}$ with positive distance $d > 0$, there exists an infinite family of distinct unit vectors $\hat{\mathbf{n}}$ that satisfy the Hyperplane Separation condition.

---

## 4.7 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 4.1
Define $f(\mathbf{x}) = \frac{x^2}{a^2} + \frac{y^2}{b^2}$.
Let $\mathbf{x}, \mathbf{y} \in \mathcal{E}$, meaning $f(\mathbf{x}) \le 1$ and $f(\mathbf{y}) \le 1$.
The function $f(\mathbf{x}) = \mathbf{x}^T \mathbf{M} \mathbf{x}$ where $\mathbf{M} = \text{diag}(1/a^2, 1/b^2)$.
Because $a > 0$ and $b > 0$, matrix $\mathbf{M}$ is symmetric positive-definite.
The quadratic form $f(\mathbf{x})$ is strictly convex:
$$\forall \lambda \in [0, 1]: \quad f((1 - \lambda)\mathbf{x} + \lambda \mathbf{y}) \le (1 - \lambda) f(\mathbf{x}) + \lambda f(\mathbf{y})$$
Substituting $f(\mathbf{x}) \le 1$ and $f(\mathbf{y}) \le 1$:
$$f((1 - \lambda)\mathbf{x} + \lambda \mathbf{y}) \le (1 - \lambda)(1) + \lambda(1) = 1.0$$
Therefore, $(1 - \lambda)\mathbf{x} + \lambda \mathbf{y} \in \mathcal{E}$. The solid ellipse is convex. $\blacksquare$

---

### Solution to Exercise 4.2
Endpoints: $\mathbf{a} = [1, 2]^T, \mathbf{b} = [5, 4]^T$. Direction $\mathbf{d} = [-1, 1]^T$.
Evaluate dot products:
$$\mathbf{a} \cdot \mathbf{d} = (1)(-1) + (2)(1) = -1 + 2 = +1.0$$
$$\mathbf{b} \cdot \mathbf{d} = (5)(-1) + (4)(1) = -5 + 4 = -1.0$$
Comparing values: $+1.0 > -1.0$.
The maximum occurs at endpoint $\mathbf{a}$.
$$S(\mathbf{d}) = \mathbf{a} = [1.0, 2.0]^T\text{ m}$$

---

### Solution to Exercise 4.3
Center $\mathbf{c} = [0, 0]^T$, half-extents $\mathbf{e} = [3.0, 5.0]^T$. Direction $\mathbf{d} = [4.0, -3.0]^T$.
$$S_{\text{box}}(\mathbf{d}) = \begin{bmatrix} \text{sgn}(d_x) e_x \\ \text{sgn}(d_y) e_y \end{bmatrix} = \begin{bmatrix} \text{sgn}(+4.0)(3.0) \\ \text{sgn}(-3.0)(5.0) \end{bmatrix} = \begin{bmatrix} +3.0 \\ -5.0 \end{bmatrix}\text{ m}$$
Support value:
$$h_{\text{box}}(\mathbf{d}) = S_{\text{box}}(\mathbf{d}) \cdot \mathbf{d} = (3.0)(4.0) + (-5.0)(-3.0) = 12.0 + 15.0 = 27.00$$

---

### Solution to Exercise 4.4
Any point on a circle can be written as $\mathbf{p} = \mathbf{c} + r \mathbf{u}$ where $\|\mathbf{u}\| \le 1$.
Projecting $\mathbf{p}$ onto unit vector $\hat{\mathbf{n}}$ ($\|\hat{\mathbf{n}}\| = 1$):
$$\mathbf{p} \cdot \hat{\mathbf{n}} = (\mathbf{c} + r \mathbf{u}) \cdot \hat{\mathbf{n}} = \mathbf{c} \cdot \hat{\mathbf{n}} + r (\mathbf{u} \cdot \hat{\mathbf{n}})$$
By the Cauchy-Schwarz inequality, $|\mathbf{u} \cdot \hat{\mathbf{n}}| \le \|\mathbf{u}\| \|\hat{\mathbf{n}}\| \le (1)(1) = 1$.
The maximum occurs when $\mathbf{u} = \hat{\mathbf{n}}$ ($\mathbf{u} \cdot \hat{\mathbf{n}} = +1$):
$$s_{\max} = \mathbf{c} \cdot \hat{\mathbf{n}} + r$$
The minimum occurs when $\mathbf{u} = -\hat{\mathbf{n}}$ ($\mathbf{u} \cdot \hat{\mathbf{n}} = -1$):
$$s_{\min} = \mathbf{c} \cdot \hat{\mathbf{n}} - r$$
Therefore, $I(\hat{\mathbf{n}}) = [\mathbf{c} \cdot \hat{\mathbf{n}} - r, \, \mathbf{c} \cdot \hat{\mathbf{n}} + r]$. $\blacksquare$

---

### Solution to Exercise 4.5
Axis $\hat{\mathbf{n}} = [1, 0]^T$ projects the $x$-coordinates directly:
1. **Intervals:**
   - Triangle 1: $x \in [0, 2] \implies I_1 = [0.0, 2.0]\text{ m}$.
   - Triangle 2: $x \in [4, 6] \implies I_2 = [4.0, 6.0]\text{ m}$.
2. **Separating gap:**
   $$\text{Gap} = s_{\min, 2} - s_{\max, 1} = 4.0 - 2.0 = 2.000\text{ meters}$$
The axis $\hat{\mathbf{n}} = [1, 0]^T$ is a separating axis with a $2.0\text{ m}$ gap.

---

### Solution to Exercise 4.6
From Section 4.3.1, for any two convex polygons in 2D with $M_A$ and $M_B$ vertices, the number of distinct edge directions on the boundary of their Minkowski difference is at most the sum of the number of edges:
$$\text{Max Vertices} \le M_A + M_B = 6 + 8 = 14\text{ vertices}$$
(Equality holds when no edges of $\mathcal{A}$ are parallel to any edges of $\mathcal{B}$).

---

### Solution to Exercise 4.7
A 10-vertex simple polygon can be triangulated into $N - 2$ triangles using standard ear-clipping triangulation:
$$N_{\text{triangles}} = N - 2 = 10 - 2 = 8\text{ triangles}$$
Alternatively, connecting the central centroid to the 5 outer points partitions the star into 5 convex kites. The minimum decomposition into convex polygons is **5 convex polygons** (or 8 triangles).

---

### Solution to Exercise 4.8
By definition:
$$h_{\mathcal{C}}(\alpha \mathbf{d}) = \sup_{\mathbf{x} \in \mathcal{C}} (\mathbf{x} \cdot (\alpha \mathbf{d}))$$
Using the scalar linearity of the dot product:
$$\mathbf{x} \cdot (\alpha \mathbf{d}) = \alpha (\mathbf{x} \cdot \mathbf{d})$$
Because $\alpha > 0$ is a positive constant, it factors out of the supremum:
$$\sup_{\mathbf{x} \in \mathcal{C}} (\alpha (\mathbf{x} \cdot \mathbf{d})) = \alpha \sup_{\mathbf{x} \in \mathcal{C}} (\mathbf{x} \cdot \mathbf{d}) = \alpha h_{\mathcal{C}}(\mathbf{d})$$
Thus, the support function is positively homogeneous of degree 1. $\blacksquare$

---

### Solution to Exercise 4.9
Carathéodory's Theorem states that if a point $\mathbf{x} \in \mathbb{R}^d$ lies in the convex hull of a set $\mathcal{P}$, then $\mathbf{x}$ can be written as the convex combination of at most $d + 1$ points from $\mathcal{P}$.
In 2D space ($d = 2$):
$$d + 1 = 2 + 1 = 3\text{ points}$$
Since $\mathcal{A} \ominus \mathcal{B}$ is a 2D convex set, if $\mathbf{0} \in (\mathcal{A} \ominus \mathcal{B})$, there exist at most 3 vertices $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3 \in \mathcal{A} \ominus \mathcal{B}$ such that:
$$\mathbf{0} \in \text{Conv}(\{\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3\})$$
This 3-vertex simplex is a triangle, proving that GJK never needs to maintain more than a 2-simplex (triangle) in 2D to verify collision. $\blacksquare$

---

### Solution to Exercise 4.10
Let $\mathcal{A}$ and $\mathcal{B}$ be separated by minimum distance $d > 0$.
Let $\mathbf{a}^* \in \mathcal{A}$ and $\mathbf{b}^* \in \mathcal{B}$ be the unique pair of closest boundary points:
$$\|\mathbf{b}^* - \mathbf{a}^*\| = d > 0$$
Let $\hat{\mathbf{n}}_0 = \frac{\mathbf{b}^* - \mathbf{a}^*}{d}$ be the optimal separating axis.
The projection gap along $\hat{\mathbf{n}}_0$ is exactly $d > 0$.
Because the projection mapping $f(\hat{\mathbf{n}}) = \min_{\mathbf{b}} (\mathbf{b} \cdot \hat{\mathbf{n}}) - \max_{\mathbf{a}} (\mathbf{a} \cdot \hat{\mathbf{n}})$ is continuous in $\hat{\mathbf{n}}$ on the unit circle $S^1$, and $f(\hat{\mathbf{n}}_0) = d > 0$, by the intermediate value theorem there exists an open neighborhood $\mathcal{U} \subset S^1$ around $\hat{\mathbf{n}}_0$ where $f(\hat{\mathbf{n}}) > 0$.
Every unit vector in this open arc $\mathcal{U}$ is a valid separating axis.
Because an open arc on $S^1$ contains uncountably infinitely many vectors, the separating axis is non-unique. $\blacksquare$
