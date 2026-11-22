# Chapter 5: The Separating Axis Theorem (SAT) for 2D Convex Polygons

> *"The Hyperplane Separation Theorem tells us that an infinite number of separating axes might exist. But for convex polygons, a magnificent combinatorial simplification occurs: we do not need to search infinite directions. If two polygons are separated, they MUST be separated along an axis perpendicular to one of their own edges. This is the Separating Axis Theorem — the computational workhorse of 2D rigid body physics."*

---

### Conceptual Architecture: The 2D SAT Algorithmic Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             INPUT: TWO CONVEX POLYGONS A & B                             │
│                    Polygon A: M_A vertices   |   Polygon B: M_B vertices                 │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Extract Perpendicular Edge Normals
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   CANDIDATE SEPARATING AXES: AT MOST M_A + M_B AXES                      │
│   • Edge vectors: e_i = v_{i+1} - v_i                                                    │
│   • Perpendicular Normal: n_i = [ e_{i, y}, -e_{i, x} ]^T / ||e_i||                      │
│   • Prune antiparallel / redundant collinear axes                                        │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Loop Over Each Candidate Axis n_k
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                 1D ORTHOGONAL PROJECTION & INTERVAL OVERLAP TEST                         │
│                                                                                          │
│   • Project Polygon A: I_A = [ min(v_A · n_k), max(v_A · n_k) ]                          │
│   • Project Polygon B: I_B = [ min(v_B · n_k), max(v_B · n_k) ]                          │
│   • Calculate Overlap: overlap = min(max_A, max_B) - max(min_A, min_B)                   │
│                                                                                          │
│             overlap ≤ 0.0                        overlap > 0.0                           │
│        ────────────────────────►            ──────────────────────►                      │
│            EARLY EXIT!                           Record Overlap & Axis;                  │
│       Shapes are SEPARATED!                      Continue Loop                           │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ All Axes Overlap (Collision Confirmed!)
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                 MINIMUM TRANSLATION VECTOR (MTV) DETERMINATION                           │
│                                                                                          │
│   • Penetration Depth δ:   Minimum overlap found across all candidate axes               │
│   • Contact Normal n:      Candidate axis that yielded the minimum overlap               │
│   • Direction Sanity:      If (c_B - c_A) · n < 0  ===>  Invert normal: n = -n           │
│   • Separation Vector:     MTV = δ · n                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.1 The Finite Axis Theorem for Convex Polygons

In Chapter 4, the Hyperplane Separation Theorem established that two disjoint convex sets can be separated by a line. However, a naive search over the continuous unit circle $S^1$ requires infinite checks.

For convex polygons bounded by flat edges, the universe of candidate separating axes collapses to a small, strictly finite set:

> **The Separating Axis Theorem (SAT) for 2D Polygons:**
> Two 2D convex polygons $\mathcal{A}$ and $\mathcal{B}$ with edge sets $\mathcal{E}_A$ and $\mathcal{E}_B$ are separated if and only if there exists a separating axis perpendicular to **at least one edge of either Polygon $\mathcal{A}$ or Polygon $\mathcal{B}$**:
> $$\text{Candidate Axes } \mathcal{N} = \{ \hat{\mathbf{n}}_e : e \in \mathcal{E}_A \} \cup \{ \hat{\mathbf{n}}_e : e \in \mathcal{E}_B \}$$
> $$\mathcal{A} \cap \mathcal{B} = \emptyset \iff \exists \hat{\mathbf{n}} \in \mathcal{N} \text{ such that } I_{\mathcal{A}}(\hat{\mathbf{n}}) \cap I_{\mathcal{B}}(\hat{\mathbf{n}}) = \emptyset$$

```
Candidate Axes are Perpendicular to Polygon Faces

             Polygon A (Triangle)                Polygon B (Box)
                     ▲                                  ▲
                    / \                               ┌─┼─┐
            n_A1 ◄──   ──► n_A2                  n_B1 ◄─│ │─► n_B2
                   /___\                              └─┼─┘
                     │                                  ▼
                     ▼ n_A3
         Total Candidate Axes = 3 (from A) + 2 unique (from B) = 5 Axes Total!
```

### 5.1.1 Why Edge Normals Suffice
Consider the Minkowski difference $\mathcal{A} \ominus \mathcal{B}$.
As proven in Chapter 4, $\mathcal{A}$ and $\mathcal{B}$ are separated if and only if the origin $\mathbf{0} \notin (\mathcal{A} \ominus \mathcal{B})$.
Because $\mathcal{A} \ominus \mathcal{B}$ is a convex polygon, if the origin lies outside, there must exist at least one boundary edge of $\mathcal{A} \ominus \mathcal{B}$ that separates $\mathbf{0}$ from the interior.
The edges of $\mathcal{A} \ominus \mathcal{B}$ are formed exclusively by the edges of $\mathcal{A}$ and the inverted edges of $\mathcal{B}$.
Therefore, the normal to the separating edge of $\mathcal{A} \ominus \mathcal{B}$ **must be parallel to an edge normal of either Polygon $\mathcal{A}$ or Polygon $\mathcal{B}$**.

---

## 5.2 Extracting Candidate Edge Normals

Let a convex polygon be defined by $M$ vertices arranged in counter-clockwise (CCW) winding order:
$$\mathcal{V} = \{ \mathbf{v}_0, \mathbf{v}_1, \dots, \mathbf{v}_{M-1} \}$$

### 5.2.1 The Perpendicular Vector Operator
For each directed edge connecting vertex $\mathbf{v}_i$ to vertex $\mathbf{v}_{i+1}$ (with index wrapping $\mathbf{v}_M \equiv \mathbf{v}_0$):
$$\mathbf{e}_i = \mathbf{v}_{i+1} - \mathbf{v}_i = \begin{bmatrix} e_{i, x} \\ e_{i, y} \end{bmatrix}$$

The outward-pointing normal in a CCW winding coordinate system is obtained by rotating the edge vector $90^\circ$ clockwise (the 2D perpendicular operator):
$$\mathbf{n}_i = \begin{bmatrix} +e_{i, y} \\ -e_{i, x} \end{bmatrix}$$

Normalizing to unit length:
$$\hat{\mathbf{n}}_i = \frac{\mathbf{n}_i}{\|\mathbf{n}_i\|} = \frac{1}{\sqrt{e_{i, y}^2 + e_{i, x}^2}} \begin{bmatrix} +e_{i, y} \\ -e_{i, x} \end{bmatrix}$$

### 5.2.2 Redundant Axis Pruning
For an axis $\hat{\mathbf{n}}$, projecting points onto $-\hat{\mathbf{n}}$ yields the exact same 1D interval, merely inverted in sign:
$$I(-\hat{\mathbf{n}}) = [-s_{\max}, -s_{\min}]$$
The overlap magnitude is strictly identical:
$$\text{overlap}(-\hat{\mathbf{n}}) \equiv \text{overlap}(+\hat{\mathbf{n}})$$

Therefore, any candidate axis that is parallel or anti-parallel to an already tested axis must be pruned:
- For an Axis-Aligned Bounding Box (AABB) or rectangle, the 4 edges yield only **2 unique axes** ($[1, 0]^T$ and $[0, 1]^T$).
- For a regular hexagon (6 edges), opposite edges are parallel, reducing candidate axes from 6 to **3 unique axes**.
- For two colliding rectangles, the total number of candidate axes is at most $2 + 2 = 4$ axes!

---

## 5.3 1D Interval Projection & Overlap Computation

Given a candidate unit axis $\hat{\mathbf{n}}$:

### 5.3.1 Interval Projection
We project every vertex of Polygon $\mathcal{A}$ and Polygon $\mathcal{B}$ onto $\hat{\mathbf{n}}$ using scalar dot products:
$$s_{\min, \mathcal{A}} = \min_{0 \le i < M_A} (\mathbf{a}_i \cdot \hat{\mathbf{n}}), \quad s_{\max, \mathcal{A}} = \max_{0 \le i < M_A} (\mathbf{a}_i \cdot \hat{\mathbf{n}})$$
$$s_{\min, \mathcal{B}} = \min_{0 \le j < M_B} (\mathbf{b}_j \cdot \hat{\mathbf{n}}), \quad s_{\max, \mathcal{B}} = \max_{0 \le j < M_B} (\mathbf{b}_j \cdot \hat{\mathbf{n}})$$

The 1D projection intervals are $I_{\mathcal{A}} = [s_{\min, \mathcal{A}}, s_{\max, \mathcal{A}}]$ and $I_{\mathcal{B}} = [s_{\min, \mathcal{B}}, s_{\max, \mathcal{B}}]$.

### 5.3.2 Scalar Overlap Metric
The scalar overlap along axis $\hat{\mathbf{n}}$ is:
$$\text{overlap}(\hat{\mathbf{n}}) = \min(s_{\max, \mathcal{A}}, \, s_{\max, \mathcal{B}}) - \max(s_{\min, \mathcal{A}}, \, s_{\min, \mathcal{B}})$$

- **Early Exit Condition:**
  $$\text{If } \text{overlap}(\hat{\mathbf{n}}) \le 0: \quad \text{RETURN FALSE (SEPARATED)}$$
  The moment any axis yields an overlap $\le 0$, the algorithm terminates immediately. No further axes are evaluated.

---

## 5.4 The Minimum Translation Vector (MTV)

If the algorithm evaluates all $M_A + M_B$ candidate axes and finds that $\text{overlap}(\hat{\mathbf{n}}_k) > 0$ for every single axis, the polygons are **guaranteed to collide**.

To resolve the collision physically, we must determine the **Minimum Translation Vector (MTV)**: the smallest displacement vector that, when applied to Polygon $\mathcal{B}$, will separate it from Polygon $\mathcal{A}$.

```
The Minimum Translation Vector (MTV) Concept

           Candidate Axis 1: Overlap = 1.8 m
           Candidate Axis 2: Overlap = 0.4 m  <=== MINIMUM OVERLAP! (MTV Axis)
           Candidate Axis 3: Overlap = 2.5 m
           
           Penetration Depth δ = 0.4 m
           Contact Normal n = Axis 2
           MTV = δ · n = 0.4 · Axis 2
```

### 5.4.1 Finding the Minimum Penetration Axis
1. Identify the candidate axis $\hat{\mathbf{n}}^*$ that minimizes the scalar overlap:
   $$\delta = \min_{k} \text{overlap}(\hat{\mathbf{n}}_k)$$
   $$\hat{\mathbf{n}}_{\text{min}} = \arg\min_{k} \text{overlap}(\hat{\mathbf{n}}_k)$$
   The minimum overlap $\delta$ is the **Penetration Depth**.

2. **Normal Direction Alignment Rule:**
   By convention, the contact normal $\mathbf{n}$ must point outward from Polygon $\mathcal{A}$ into Polygon $\mathcal{B}$.
   Compute the vector connecting the geometric centers of the two polygons:
   $$\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A$$
   We evaluate the directional dot product:
   $$\text{If } \mathbf{d}_{\text{centers}} \cdot \hat{\mathbf{n}}_{\text{min}} < 0: \quad \mathbf{n} = -\hat{\mathbf{n}}_{\text{min}}, \quad \text{Else: } \mathbf{n} = +\hat{\mathbf{n}}_{\text{min}}$$

3. **Formulating the MTV:**
   $$\mathbf{MTV} = \delta \mathbf{n}$$
   Translating Polygon $\mathcal{B}$ by $+\mathbf{MTV}$ (or Polygon $\mathcal{A}$ by $-\mathbf{MTV}$) separates the two bodies with the minimum possible kinematic perturbation.

---

## 5.5 Hybrid SAT: Circles vs Convex Polygons

When testing a circular disk against a convex polygon, circles have no flat edges, and thus have no discrete edge normals.

### 5.5.1 The Vertex-to-Center Voronoi Axis
For a Circle vs Polygon test, testing only the polygon's edge normals is **insufficient**: a circle can collide with a sharp corner vertex of the polygon without penetrating any of the extended edge planes!

```
Why Polygon Edge Normals Alone Fail for Circles

                    \  Circle c
                     \  ●
                      \
                     ┌─* Corner Vertex v_k
                     │  \
                     │   \ Polygon Edge
                     
  Polygon edge normals project overlap falsely!
  The true separating axis is the vector from corner vertex v_k to circle center c!
```

To guarantee mathematical correctness, **Hybrid SAT** evaluates:
1. All outward edge normals of the convex polygon ($M$ axes).
2. **PLUS one extra axis:** The normalized vector from the polygon's closest vertex $\mathbf{v}^*$ to the circle center $\mathbf{c}$:
   $$\hat{\mathbf{n}}_{\text{corner}} = \frac{\mathbf{c} - \mathbf{v}^*}{\|\mathbf{c} - \mathbf{v}^*\|}$$
   where $\mathbf{v}^* = \arg\min_{\mathbf{v}_i} \|\mathbf{c} - \mathbf{v}_i\|$.

Total axes evaluated for Circle vs $M$-gon: exactly $M + 1$ axes.

---

## 5.6 Progressive Numerical Worked Examples

---

### Worked Example 5.1: Extracting Outward Edge Normals of a Triangle
**Problem Statement:** A 2D triangle $\mathcal{A}$ has vertices arranged in counter-clockwise (CCW) order:
$\mathbf{v}_0 = [0.0, 0.0]^T\text{ m}, \mathbf{v}_1 = [4.0, 0.0]^T\text{ m}, \mathbf{v}_2 = [0.0, 3.0]^T\text{ m}$.
1. Formulate the three directed edge vectors $\mathbf{e}_0, \mathbf{e}_1, \mathbf{e}_2$.
2. Compute the perpendicular outward normal vectors $\mathbf{n}_0, \mathbf{n}_1, \mathbf{n}_2$.
3. Normalize each normal to unit length $\hat{\mathbf{n}}_0, \hat{\mathbf{n}}_1, \hat{\mathbf{n}}_2$.
4. Verify that each normal points outward by testing the centroid $\mathbf{c} = \frac{1}{3}\sum \mathbf{v}_i$.

**Step-by-Step Mathematical Solution:**

**Step 1: Directed edge vectors.**
- Edge 0 ($\mathbf{v}_0 \to \mathbf{v}_1$):
  $$\mathbf{e}_0 = \mathbf{v}_1 - \mathbf{v}_0 = \begin{bmatrix} 4.0 - 0.0 \\ 0.0 - 0.0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 0.0 \end{bmatrix}\text{ m}$$
- Edge 1 ($\mathbf{v}_1 \to \mathbf{v}_2$):
  $$\mathbf{e}_1 = \mathbf{v}_2 - \mathbf{v}_1 = \begin{bmatrix} 0.0 - 4.0 \\ 3.0 - 0.0 \end{bmatrix} = \begin{bmatrix} -4.0 \\ +3.0 \end{bmatrix}\text{ m}$$
- Edge 2 ($\mathbf{v}_2 \to \mathbf{v}_0$):
  $$\mathbf{e}_2 = \mathbf{v}_0 - \mathbf{v}_2 = \begin{bmatrix} 0.0 - 0.0 \\ 0.0 - 3.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -3.0 \end{bmatrix}\text{ m}$$

**Step 2: Perpendicular outward normals.**
Using the CCW 2D perp operator $\mathbf{n} = [e_y, -e_x]^T$:
- For $\mathbf{e}_0 = [4.0, 0.0]^T$:
  $$\mathbf{n}_0 = \begin{bmatrix} 0.0 \\ -4.0 \end{bmatrix}\text{ m}$$
- For $\mathbf{e}_1 = [-4.0, 3.0]^T$:
  $$\mathbf{n}_1 = \begin{bmatrix} +3.0 \\ -(-4.0) \end{bmatrix} = \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix}\text{ m}$$
- For $\mathbf{e}_2 = [0.0, -3.0]^T$:
  $$\mathbf{n}_2 = \begin{bmatrix} -3.0 \\ -(0.0) \end{bmatrix} = \begin{bmatrix} -3.0 \\ 0.0 \end{bmatrix}\text{ m}$$

**Step 3: Unit normalization.**
- $\hat{\mathbf{n}}_0 = \frac{[0, -4]^T}{4.0} = \begin{bmatrix} 0.0 \\ -1.0 \end{bmatrix}$ (Points straight down along negative $y$)
- $\hat{\mathbf{n}}_1 = \frac{[3, 4]^T}{\sqrt{3^2 + 4^2}} = \frac{[3, 4]^T}{5.0} = \begin{bmatrix} 0.60 \\ 0.80 \end{bmatrix}$ (Points up-right perpendicular to hypotenuse)
- $\hat{\mathbf{n}}_2 = \frac{[-3, 0]^T}{3.0} = \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix}$ (Points straight left along negative $x$)

**Step 4: Centroid outward verification.**
Centroid: $\mathbf{c} = \frac{1}{3} ([0, 0]^T + [4, 0]^T + [0, 3]^T) = [4/3, 1.0]^T \approx [1.333, 1.0]^T\text{ m}$.
For an edge with vertex $\mathbf{v}_i$ and outward normal $\hat{\mathbf{n}}_i$, the vector from centroid to vertex $(\mathbf{v}_i - \mathbf{c})$ must point in the same general direction as the normal: $(\mathbf{v}_i - \mathbf{c}) \cdot \hat{\mathbf{n}}_i > 0$.
- For Edge 0 ($\mathbf{v}_0 = [0, 0]^T$):
  $$(\mathbf{v}_0 - \mathbf{c}) \cdot \hat{\mathbf{n}}_0 = \begin{bmatrix} -1.333 \\ -1.0 \end{bmatrix} \cdot \begin{bmatrix} 0 \\ -1 \end{bmatrix} = +1.0 > 0 \quad (\text{Outward confirmed})$$
- For Edge 1 ($\mathbf{v}_1 = [4, 0]^T$):
  $$(\mathbf{v}_1 - \mathbf{c}) \cdot \hat{\mathbf{n}}_1 = \begin{bmatrix} 2.667 \\ -1.0 \end{bmatrix} \cdot \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = 1.60 - 0.80 = +0.80 > 0 \quad (\text{Outward confirmed})$$
- For Edge 2 ($\mathbf{v}_2 = [0, 3]^T$):
  $$(\mathbf{v}_2 - \mathbf{c}) \cdot \hat{\mathbf{n}}_2 = \begin{bmatrix} -1.333 \\ 2.0 \end{bmatrix} \cdot \begin{bmatrix} -1 \\ 0 \end{bmatrix} = +1.333 > 0 \quad (\text{Outward confirmed})$$

---

### Worked Example 5.2: Early Exit on First Candidate Axis
**Problem Statement:** Two rectangular crates are positioned in a game environment:
- Crate $\mathcal{A}$: Centered at $[2.0, 3.0]^T\text{ m}$, half-extents $[1.5, 1.0]^T\text{ m}$ ($x \in [0.5, 3.5], y \in [2.0, 4.0]$)
- Crate $\mathcal{B}$: Centered at $[8.0, 3.5]^T\text{ m}$, half-extents $[1.0, 1.0]^T\text{ m}$ ($x \in [7.0, 9.0], y \in [2.5, 4.5]$)
1. List the candidate axes for this pair.
2. Evaluate the 1D interval projection and overlap along the first candidate axis $\hat{\mathbf{n}}_1 = [1.0, 0.0]^T$.
3. Demonstrate the early-exit condition and conclude collision state.

**Step-by-Step Mathematical Solution:**

**Step 1: Candidate axes.**
Both crates are axis-aligned rectangles.
Edges of $\mathcal{A}$ are parallel to $x$ and $y$ axes $\implies$ normals are $[1, 0]^T$ and $[0, 1]^T$.
Edges of $\mathcal{B}$ are parallel to $x$ and $y$ axes $\implies$ normals are $[1, 0]^T$ and $[0, 1]^T$.
Total candidate axes after pruning:
$$\mathcal{N} = \{ \hat{\mathbf{n}}_1 = [1.0, 0.0]^T, \, \hat{\mathbf{n}}_2 = [0.0, 1.0]^T \}$$

**Step 2: Testing Candidate Axis 1 ($\hat{\mathbf{n}}_1 = [1.0, 0.0]^T$).**
Project Crate $\mathcal{A}$:
$$s_{\min, A} = 0.50\text{ m}, \quad s_{\max, A} = 3.50\text{ m} \implies I_{\mathcal{A}} = [0.50, 3.50]$$
Project Crate $\mathcal{B}$:
$$s_{\min, B} = 7.00\text{ m}, \quad s_{\max, B} = 9.00\text{ m} \implies I_{\mathcal{B}} = [7.00, 9.00]$$

Compute overlap:
$$\text{overlap} = \min(s_{\max, A}, s_{\max, B}) - \max(s_{\min, A}, s_{\min, B}) = \min(3.50, 9.00) - \max(0.50, 7.00) = 3.50 - 7.00 = -3.50\text{ m}$$

**Step 3: Early exit execution.**
Because $\text{overlap} = -3.50\text{ m} \le 0.0$, **Axis $\hat{\mathbf{n}}_1$ is a separating axis!**
The algorithm executes an immediate early exit:
- Candidate Axis 2 ($\hat{\mathbf{n}}_2 = [0, 1]^T$) is **NEVER EVALUATED**.
- The function returns `false` (no collision) in fewer than 10 CPU clock cycles.

---

### Worked Example 5.3: SAT Between Square and Rotated 45-Degree Diamond
**Problem Statement:** A physics simulation tests collision between:
- Square $\mathcal{A}$: Axis-aligned, centered at $[0, 0]^T$ with vertices $[\pm 2, \pm 2]^T$ (Half-extents $[2, 2]$)
- Diamond $\mathcal{B}$: Centered at $[3.0, 0.0]^T$, obtained by rotating a square of half-extent $\sqrt{2}\approx 1.414\text{ m}$ by $45^\circ$.
  Vertices of $\mathcal{B}$:
  $\mathbf{b}_0 = [3 + 2, 0] = [5.0, 0.0]^T$
  $\mathbf{b}_1 = [3, 0 + 2] = [3.0, 2.0]^T$
  $\mathbf{b}_2 = [3 - 2, 0] = [1.0, 0.0]^T$
  $\mathbf{b}_3 = [3, 0 - 2] = [3.0, -2.0]^T$
1. List all unique candidate separating axes from both shapes.
2. Evaluate projection intervals and overlaps across all candidate axes.
3. Determine whether the shapes collide.
4. If colliding, compute the penetration depth $\delta$ and Minimum Translation Vector (MTV).

**Step-by-Step Mathematical Solution:**

**Step 1: Listing unique candidate axes.**
- From Square $\mathcal{A}$ (axis-aligned):
  $$\hat{\mathbf{n}}_1 = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}, \quad \hat{\mathbf{n}}_2 = \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix}$$
- From Diamond $\mathcal{B}$:
  Edge from $\mathbf{b}_2 = [1, 0]^T$ to $\mathbf{b}_1 = [3, 2]^T$: $\mathbf{e} = [2, 2]^T$.
  Normal perp: $[2, -2]^T \implies \hat{\mathbf{n}}_3 = \frac{[1, -1]^T}{\sqrt{2}} \approx \begin{bmatrix} 0.707107 \\ -0.707107 \end{bmatrix}$.
  Edge from $\mathbf{b}_1 = [3, 2]^T$ to $\mathbf{b}_0 = [5, 0]^T$: $\mathbf{e} = [2, -2]^T$.
  Normal perp: $[-2, -2]^T \implies \hat{\mathbf{n}}_4 = \frac{[1, 1]^T}{\sqrt{2}} \approx \begin{bmatrix} 0.707107 \\ 0.707107 \end{bmatrix}$.

Total candidate axes to evaluate: 4 axes ($\hat{\mathbf{n}}_1, \hat{\mathbf{n}}_2, \hat{\mathbf{n}}_3, \hat{\mathbf{n}}_4$).

**Step 2: Evaluating each candidate axis.**

- **Axis 1: $\hat{\mathbf{n}}_1 = [1.0, 0.0]^T$ ($x$-axis):**
  $I_{\mathcal{A}} = [-2.0, +2.0]$
  $I_{\mathcal{B}} = [1.0, 5.0]$
  $$\text{overlap}_1 = \min(2.0, 5.0) - \max(-2.0, 1.0) = 2.0 - 1.0 = +1.000\text{ m} > 0 \quad (\text{Overlap})$$

- **Axis 2: $\hat{\mathbf{n}}_2 = [0.0, 1.0]^T$ ($y$-axis):**
  $I_{\mathcal{A}} = [-2.0, +2.0]$
  $I_{\mathcal{B}} = [-2.0, +2.0]$
  $$\text{overlap}_2 = \min(2.0, 2.0) - \max(-2.0, -2.0) = 2.0 - (-2.0) = +4.000\text{ m} > 0 \quad (\text{Overlap})$$

- **Axis 3: $\hat{\mathbf{n}}_3 = [0.7071, -0.7071]^T$:**
  - Projecting Square $\mathcal{A}$ ($[\pm 2, \pm 2]^T$):
    - $[2, 2] \cdot \hat{\mathbf{n}}_3 = 0.7071(2) - 0.7071(2) = 0$
    - $[2, -2] \cdot \hat{\mathbf{n}}_3 = 0.7071(2) - 0.7071(-2) = 1.4142 + 1.4142 = +2.8284$
    - $[-2, 2] \cdot \hat{\mathbf{n}}_3 = -2.8284$
    - $[-2, -2] \cdot \hat{\mathbf{n}}_3 = 0$
    $I_{\mathcal{A}} = [-2.8284, +2.8284]$
  - Projecting Diamond $\mathcal{B}$:
    - $\mathbf{b}_0 = [5, 0] \cdot \hat{\mathbf{n}}_3 = 0.7071(5) = +3.5355$
    - $\mathbf{b}_1 = [3, 2] \cdot \hat{\mathbf{n}}_3 = 0.7071(3 - 2) = +0.7071$
    - $\mathbf{b}_2 = [1, 0] \cdot \hat{\mathbf{n}}_3 = 0.7071(1) = +0.7071$
    - $\mathbf{b}_3 = [3, -2] \cdot \hat{\mathbf{n}}_3 = 0.7071(3 - (-2)) = 0.7071(5) = +3.5355$
    $I_{\mathcal{B}} = [+0.7071, +3.5355]$
  $$\text{overlap}_3 = \min(2.8284, 3.5355) - \max(-2.8284, 0.7071) = 2.8284 - 0.7071 = +2.1213\text{ m} > 0 \quad (\text{Overlap})$$

- **Axis 4: $\hat{\mathbf{n}}_4 = [0.7071, 0.7071]^T$:**
  By symmetry with Axis 3:
  $I_{\mathcal{A}} = [-2.8284, +2.8284]$
  For $\mathcal{B}$: $\mathbf{b}_2 = [1, 0] \implies 0.7071$, $\mathbf{b}_0 = [5, 0] \implies 3.5355$.
  $I_{\mathcal{B}} = [+0.7071, +3.5355]$
  $$\text{overlap}_4 = 2.8284 - 0.7071 = +2.1213\text{ m} > 0 \quad (\text{Overlap})$$

**Step 3 & 4: Collision status and MTV.**
All 4 candidate axes show positive overlap! **The shapes COLLIDE.**
Comparing overlaps:
$$\delta = \min(1.000, 4.000, 2.1213, 2.1213) = 1.000\text{ meter} \quad (\text{Axis 1: } \hat{\mathbf{n}}_1 = [1, 0]^T)$$
Check normal direction:
$$\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A = [3.0, 0.0]^T - [0.0, 0.0]^T = [3.0, 0.0]^T$$
$$\mathbf{d}_{\text{centers}} \cdot \hat{\mathbf{n}}_1 = [3.0, 0.0] \cdot [1.0, 0.0]^T = +3.0 > 0 \implies \mathbf{n} = [1.0, 0.0]^T$$
Minimum Translation Vector:
$$\mathbf{MTV} = \delta \mathbf{n} = 1.000 \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 1.000 \\ 0.000 \end{bmatrix}\text{ m}$$
Shifting Diamond $\mathcal{B}$ by $+1.0\text{ m}$ to the right places its tip at $x = 2.0\text{ m}$, touching Square $\mathcal{A}$'s right face at an exact point with zero penetration.

---

### Worked Example 5.4: Hybrid SAT for Circle vs Triangle
**Problem Statement:** A circle of radius $r = 1.0\text{ m}$ is at center $\mathbf{c} = [3.5, 3.5]^T\text{ m}$.
A triangle $\mathcal{A}$ has vertices $\mathbf{a}_0 = [0, 0]^T, \mathbf{a}_1 = [4, 0]^T, \mathbf{a}_2 = [0, 3]^T$.
1. Find the vertex of the triangle closest to the circle center.
2. List all 4 candidate axes for this hybrid test (3 edge normals + 1 corner axis).
3. Evaluate the 1D projection overlap on all 4 axes.
4. Determine if the circle collides with the triangle.

**Step-by-Step Mathematical Solution:**

**Step 1: Finding the closest polygon vertex.**
Distances from circle center $\mathbf{c} = [3.5, 3.5]^T$ to vertices:
- To $\mathbf{a}_0 = [0, 0]$: $d_0^2 = 3.5^2 + 3.5^2 = 12.25 + 12.25 = 24.50$
- To $\mathbf{a}_1 = [4, 0]$: $d_1^2 = (3.5 - 4)^2 + (3.5 - 0)^2 = (-0.5)^2 + 3.5^2 = 0.25 + 12.25 = 12.50$
- To $\mathbf{a}_2 = [0, 3]$: $d_2^2 = (3.5 - 0)^2 + (3.5 - 3)^2 = 3.5^2 + 0.5^2 = 12.25 + 0.25 = 12.50$
Both $\mathbf{a}_1$ and $\mathbf{a}_2$ have distance $d^2 = 12.50 \implies d \approx 3.5355\text{ m}$.
Select $\mathbf{v}^* = \mathbf{a}_1 = [4, 0]^T$ (or hypotenuse corner).

**Step 2: Candidate axes.**
- Triangle edge normals (from Example 5.1):
  $$\hat{\mathbf{n}}_0 = [0.0, -1.0]^T, \quad \hat{\mathbf{n}}_1 = [0.60, 0.80]^T, \quad \hat{\mathbf{n}}_2 = [-1.0, 0.0]^T$$
- Corner axis (from $\mathbf{a}_1$ to $\mathbf{c}$):
  $$\mathbf{u} = \mathbf{c} - \mathbf{a}_1 = [3.5 - 4.0, 3.5 - 0.0]^T = [-0.50, 3.50]^T$$
  $$\|\mathbf{u}\| = \sqrt{(-0.5)^2 + 3.5^2} = \sqrt{0.25 + 12.25} = \sqrt{12.50} \approx 3.53553$$
  $$\hat{\mathbf{n}}_{\text{corner}} = \frac{[-0.50, 3.50]^T}{3.53553} \approx \begin{bmatrix} -0.141421 \\ +0.989949 \end{bmatrix}$$

**Step 3: Overlap on Edge Normal $\hat{\mathbf{n}}_1 = [0.60, 0.80]^T$.**
Let us test the hypotenuse normal $\hat{\mathbf{n}}_1 = [0.60, 0.80]^T$:
- Projecting Triangle $\mathcal{A}$:
  - $\mathbf{a}_0 = [0, 0] \implies 0.00$
  - $\mathbf{a}_1 = [4, 0] \implies 0.60(4) = 2.40\text{ m}$
  - $\mathbf{a}_2 = [0, 3] \implies 0.80(3) = 2.40\text{ m}$
  $I_{\mathcal{A}}(\hat{\mathbf{n}}_1) = [0.00, 2.40]\text{ m}$
- Projecting Circle:
  Center projection: $\mathbf{c} \cdot \hat{\mathbf{n}}_1 = 0.60(3.5) + 0.80(3.5) = 2.10 + 2.80 = 4.90\text{ m}$.
  With radius $r = 1.0\text{ m}$:
  $I_{\text{circle}}(\hat{\mathbf{n}}_1) = [4.90 - 1.0, \, 4.90 + 1.0] = [3.90, 5.90]\text{ m}$.

Evaluate overlap:
$$\text{overlap} = \min(2.40, 5.90) - \max(0.00, 3.90) = 2.40 - 3.90 = -1.50\text{ meters}$$

**Step 4: Conclusion.**
Because $\text{overlap} = -1.50\text{ m} \le 0$, the hypotenuse edge normal $\hat{\mathbf{n}}_1$ is a **separating axis**.
**Result:** The circle and triangle **DO NOT COLLIDE.** The algorithm exits immediately without testing remaining axes.

---

### Worked Example 5.5: Normal Alignment and Direction Inversion
**Problem Statement:** An engine executes SAT between:
- Body $\mathcal{A}$: Centered at $\mathbf{c}_A = [1.0, 2.0]^T\text{ m}$
- Body $\mathcal{B}$: Centered at $\mathbf{c}_B = [5.0, 2.0]^T\text{ m}$
The minimum overlap axis found during the loop is $\hat{\mathbf{n}}_{\min} = [-1.0, 0.0]^T$ with penetration $\delta = 0.35\text{ m}$.
1. Compute the center displacement vector $\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A$.
2. Evaluate the directional dot product $\mathbf{d}_{\text{centers}} \cdot \hat{\mathbf{n}}_{\min}$.
3. Apply the normal orientation rule to establish the correct physical contact normal $\mathbf{n}_{A \to B}$.
4. Compute the Minimum Translation Vector (MTV) applied to Body $\mathcal{B}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Center displacement vector.**
$$\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A = \begin{bmatrix} 5.0 - 1.0 \\ 2.0 - 2.0 \end{bmatrix} = \begin{bmatrix} +4.00 \\ 0.00 \end{bmatrix}\text{ m}$$

**Step 2: Directional dot product.**
$$\mathbf{d}_{\text{centers}} \cdot \hat{\mathbf{n}}_{\min} = \begin{bmatrix} 4.0 \\ 0.0 \end{bmatrix} \cdot \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix} = (4.0)(-1.0) + (0.0)(0.0) = -4.00 < 0$$

**Step 3: Normal orientation rule.**
Because the dot product is negative ($-4.0 < 0$), the raw axis $\hat{\mathbf{n}}_{\min}$ is pointing from Body $\mathcal{B}$ back toward Body $\mathcal{A}$!
To ensure the normal points from Body $\mathcal{A}$ into Body $\mathcal{B}$:
$$\mathbf{n}_{A \to B} = -\hat{\mathbf{n}}_{\min} = -\begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} +1.00 \\ 0.00 \end{bmatrix}$$

**Step 4: Minimum Translation Vector.**
$$\mathbf{MTV} = \delta \mathbf{n}_{A \to B} = 0.35 \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} +0.35 \\ 0.00 \end{bmatrix}\text{ m}$$
Applying this translation pushes Body $\mathcal{B}$ to the right ($+x$), away from Body $\mathcal{A}$, resolving the penetration properly.

---

### Worked Example 5.6: SAT Between Triangle and Rectangle
**Problem Statement:** A moving wedge (triangle $\mathcal{A}$) strikes a rectangular barricade (rectangle $\mathcal{B}$):
- Triangle $\mathcal{A}$: $\mathbf{a}_0 = [0, 0]^T, \mathbf{a}_1 = [2, 0]^T, \mathbf{a}_2 = [1, 2]^T$ (Centroid $\mathbf{c}_A = [1.0, 0.667]^T$)
- Rectangle $\mathcal{B}$: $[1.5, 1.0]^T$ to $[3.5, 3.0]^T$ (Centroid $\mathbf{c}_B = [2.5, 2.0]^T$)
1. Extract all unique candidate axes from both shapes.
2. Evaluate 1D interval projections and calculate overlaps for each axis.
3. Identify the minimum penetration axis, penetration depth $\delta$, and contact normal $\mathbf{n}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Extract candidate axes.**
- From Rectangle $\mathcal{B}$ (axis-aligned):
  $$\hat{\mathbf{n}}_1 = [1, 0]^T, \quad \hat{\mathbf{n}}_2 = [0, 1]^T$$
- From Triangle $\mathcal{A}$:
  - Edge 0: from $[0, 0]$ to $[2, 0]$ $\implies [2, 0]^T \implies$ normal is $[0, -1]^T$ (parallel to $\hat{\mathbf{n}}_2$, redundant!).
  - Edge 1: from $[2, 0]$ to $[1, 2]$ $\implies \mathbf{e} = [-1, 2]^T \implies \mathbf{n} = [2, 1]^T$.
    $$\hat{\mathbf{n}}_3 = \frac{[2, 1]^T}{\sqrt{5}} \approx \begin{bmatrix} 0.894427 \\ 0.447214 \end{bmatrix}$$
  - Edge 2: from $[1, 2]$ to $[0, 0]$ $\implies \mathbf{e} = [-1, -2]^T \implies \mathbf{n} = [-2, 1]^T$.
    $$\hat{\mathbf{n}}_4 = \frac{[-2, 1]^T}{\sqrt{5}} \approx \begin{bmatrix} -0.894427 \\ 0.447214 \end{bmatrix}$$
Total non-redundant candidate axes: 3 axes ($\hat{\mathbf{n}}_1, \hat{\mathbf{n}}_2, \hat{\mathbf{n}}_3$).

**Step 2: Interval projections and overlaps.**
- **Axis 1: $\hat{\mathbf{n}}_1 = [1, 0]^T$:**
  $I_{\mathcal{A}} = [0.0, 2.0]\text{ m}$
  $I_{\mathcal{B}} = [1.5, 3.5]\text{ m}$
  $$\text{overlap}_1 = \min(2.0, 3.5) - \max(0.0, 1.5) = 2.0 - 1.5 = +0.500\text{ m}$$

- **Axis 2: $\hat{\mathbf{n}}_2 = [0, 1]^T$:**
  $I_{\mathcal{A}} = [0.0, 2.0]\text{ m}$
  $I_{\mathcal{B}} = [1.0, 3.0]\text{ m}$
  $$\text{overlap}_2 = \min(2.0, 3.0) - \max(0.0, 1.0) = 2.0 - 1.0 = +1.000\text{ m}$$

- **Axis 3: $\hat{\mathbf{n}}_3 = [0.8944, 0.4472]^T$:**
  - Projecting $\mathcal{A}$:
    - $[0, 0] \implies 0.0$
    - $[2, 0] \implies 0.8944(2) = 1.7889$
    - $[1, 2] \implies 0.8944(1) + 0.4472(2) = 0.8944 + 0.8944 = 1.7889$
    $I_{\mathcal{A}} = [0.0, 1.7889]$
  - Projecting $\mathcal{B}$ ($[1.5, 1.0], [3.5, 1.0], [3.5, 3.0], [1.5, 3.0]$):
    - $\min$ is at $[1.5, 1.0]$: $0.8944(1.5) + 0.4472(1.0) = 1.3416 + 0.4472 = 1.7889$
    - $\max$ is at $[3.5, 3.0]$: $0.8944(3.5) + 0.4472(3.0) = 3.1305 + 1.3416 = 4.4721$
    $I_{\mathcal{B}} = [1.7889, 4.4721]$
  $$\text{overlap}_3 = \min(1.7889, 4.4721) - \max(0.0, 1.7889) = 1.7889 - 1.7889 = 0.000\text{ m}$$

**Step 3: Contact analysis.**
Overlap along Axis 3 is identically $0.000\text{ m}$!
The shapes are touching along Edge 1 in exact tangential grazing contact ($\delta = 0.0$). The minimum separation axis is $\hat{\mathbf{n}}_3$.

---

### Worked Example 5.7: Fast SAT Axis Reduction for Regular Hexagon
**Problem Statement:** A regular hexagonal tile has 6 edges.
1. Show why a pair of identical regular hexagons would naively require $6 + 6 = 12$ candidate axis tests.
2. Calculate the true number of unique candidate axes by exploiting antiparallel edge symmetry.
3. If both hexagons have the same orientation, what is the total number of candidate axes?

**Step-by-Step Mathematical Solution:**

**Step 1: Naive axis count.**
Polygon $\mathcal{A}$ has 6 edges $\implies 6$ edge normals.
Polygon $\mathcal{B}$ has 6 edges $\implies 6$ edge normals.
Naive total: $6 + 6 = 12$ axes.

**Step 2: Antiparallel reduction.**
For a regular hexagon centered at the origin, edge $i$ and edge $i + 3$ are parallel and face in opposite directions:
$$\mathbf{n}_{i+3} = -\mathbf{n}_i$$
As proven in Section 5.2.2, projecting onto $-\mathbf{n}$ yields the exact same overlap as $+\mathbf{n}$.
Therefore, each regular hexagon contributes only:
$$N_{\text{unique}} = \frac{6}{2} = 3\text{ unique axes}$$
For two arbitrarily oriented regular hexagons:
$$\text{Max Unique Axes} = 3 + 3 = 6\text{ axes}$$
This cuts the number of required SAT projection loops in half ($50\%$ computational savings).

**Step 3: Aligned hexagons.**
If both hexagons share the same orientation, their edge normals are parallel ($\mathcal{N}_A \parallel \mathcal{N}_B$).
Total candidate axes to test collapses to **exactly 3 axes**!

---

### Worked Example 5.8: Grazing Vertex-on-Edge Contact
**Problem Statement:** Two unit squares are positioned such that the top-right corner of Square $\mathcal{A}$ ($[1, 1]^T$) touches the midpoint of the bottom edge of Square $\mathcal{B}$ ($[1, 1]^T$):
- Square $\mathcal{A}$: $[-1, 1] \times [-1, 1]$
- Square $\mathcal{B}$: $[0, 2] \times [1, 3]$
1. Project both squares onto $\hat{\mathbf{n}}_y = [0, 1]^T$.
2. Compute the overlap and identify the contact state.
3. Explain why the contact normal is strictly $[0, 1]^T$.

**Step-by-Step Mathematical Solution:**

**Step 1: Projection onto $\hat{\mathbf{n}}_y = [0, 1]^T$.**
- Square $\mathcal{A}$: $y \in [-1, 1] \implies I_{\mathcal{A}} = [-1.0, +1.0]$
- Square $\mathcal{B}$: $y \in [1, 3] \implies I_{\mathcal{B}} = [+1.0, +3.0]$

**Step 2: Overlap evaluation.**
$$\text{overlap} = \min(1.0, 3.0) - \max(-1.0, 1.0) = 1.0 - 1.0 = 0.000\text{ meters}$$
Because overlap is zero, this represents **kissing point contact** (tangential touch).

**Step 3: Contact normal determination.**
On the $x$-axis ($\hat{\mathbf{n}}_x = [1, 0]^T$):
- $I_{\mathcal{A}} = [-1.0, 1.0]$
- $I_{\mathcal{B}} = [0.0, 2.0]$
$$\text{overlap}_x = \min(1.0, 2.0) - \max(-1.0, 0.0) = 1.0 - 0.0 = 1.000\text{ m}$$
Comparing overlaps:
$$\min(\text{overlap}_x, \text{overlap}_y) = \min(1.0, 0.0) = 0.000\text{ m} \quad (\text{Axis: } \hat{\mathbf{n}}_y)$$
The minimum overlap is along the $y$-axis. The contact normal is strictly $\mathbf{n} = [0, 1]^T$ (pushing Square $\mathcal{B}$ upward along $+y$).

---

### Worked Example 5.9: Penetration Depth and MTV for Deep Overlap
**Problem Statement:** An oriented box $\mathcal{A}$ and box $\mathcal{B}$ have overlaps on their 4 candidate axes:
- Axis 1: $\hat{\mathbf{n}}_1 = [1.00, 0.00]^T$, overlap $= 1.40\text{ m}$
- Axis 2: $\hat{\mathbf{n}}_2 = [0.00, 1.00]^T$, overlap $= 0.25\text{ m}$
- Axis 3: $\hat{\mathbf{n}}_3 = [0.707, 0.707]^T$, overlap $= 0.85\text{ m}$
- Axis 4: $\hat{\mathbf{n}}_4 = [-0.707, 0.707]^T$, overlap $= 1.10\text{ m}$

Centroid of $\mathcal{A}$ is $\mathbf{c}_A = [0.0, 0.0]^T$; centroid of $\mathcal{B}$ is $\mathbf{c}_B = [0.2, -1.5]^T$.
1. Identify the minimum penetration axis and penetration depth $\delta$.
2. Check the directional dot product $(\mathbf{c}_B - \mathbf{c}_A) \cdot \hat{\mathbf{n}}_{\min}$.
3. Establish the correct contact normal $\mathbf{n}$ and write down the $\mathbf{MTV}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Minimum penetration axis.**
$$\delta = \min(1.40, 0.25, 0.85, 1.10) = 0.250\text{ meters}$$
The minimum penetration occurs on **Axis 2**: $\hat{\mathbf{n}}_2 = [0.0, 1.0]^T$.

**Step 2: Directional alignment check.**
$$\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A = \begin{bmatrix} 0.2 - 0.0 \\ -1.5 - 0.0 \end{bmatrix} = \begin{bmatrix} 0.20 \\ -1.50 \end{bmatrix}\text{ m}$$
$$\mathbf{d}_{\text{centers}} \cdot \hat{\mathbf{n}}_2 = \begin{bmatrix} 0.20 \\ -1.50 \end{bmatrix} \cdot \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix} = -1.50 < 0$$

**Step 3: Normal inversion and MTV.**
Because the dot product is negative ($-1.50 < 0$), $\hat{\mathbf{n}}_2$ points upward ($+y$), whereas Body $\mathcal{B}$ lies downward ($-y$).
Inverting normal:
$$\mathbf{n}_{A \to B} = -\hat{\mathbf{n}}_2 = -\begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -1.0 \end{bmatrix}$$
Minimum Translation Vector:
$$\mathbf{MTV} = \delta \mathbf{n}_{A \to B} = 0.250 \begin{bmatrix} 0.0 \\ -1.0 \end{bmatrix} = \begin{bmatrix} 0.000 \\ -0.250 \end{bmatrix}\text{ m}$$
Translating Body $\mathcal{B}$ downward by $0.25\text{ m}$ separates the two bodies cleanly.

---

### Worked Example 5.10: Complete SAT Collision Solver Routine Trace
**Problem Statement:** Trace a complete SAT collision query between:
- Body $\mathcal{A}$ (Square): Vertices $[0, 0]^T, [2, 0]^T, [2, 2]^T, [0, 2]^T$ (Center $[1, 1]^T$)
- Body $\mathcal{B}$ (Triangle): Vertices $[1.5, 1.0]^T, [3.5, 1.0]^T, [2.5, 3.0]^T$ (Center $[2.5, 1.667]^T$)
1. Extract the 4 unique candidate axes.
2. Evaluate 1D interval projections and calculate overlaps.
3. Formulate the complete contact manifold output tuple $(\text{colliding}, \delta, \mathbf{n}, \mathbf{MTV})$.

**Step-by-Step Mathematical Solution:**

**Step 1: Candidate axes.**
- From Square $\mathcal{A}$:
  $$\hat{\mathbf{n}}_1 = [1, 0]^T, \quad \hat{\mathbf{n}}_2 = [0, 1]^T$$
- From Triangle $\mathcal{B}$:
  - Bottom edge ($[1.5, 1] \to [3.5, 1]$): normal is $[0, -1]^T$ (parallel to $\hat{\mathbf{n}}_2$).
  - Right edge ($[3.5, 1] \to [2.5, 3]$): $\mathbf{e} = [-1, 2]^T \implies \hat{\mathbf{n}}_3 = \frac{[2, 1]^T}{\sqrt{5}} \approx [0.8944, 0.4472]^T$.
  - Left edge ($[2.5, 3] \to [1.5, 1]$): $\mathbf{e} = [-1, -2]^T \implies \hat{\mathbf{n}}_4 = \frac{[-2, 1]^T}{\sqrt{5}} \approx [-0.8944, 0.4472]^T$.

**Step 2: Overlap evaluations.**
- **Axis 1 ($\hat{\mathbf{n}}_1 = [1, 0]^T$):**
  $I_{\mathcal{A}} = [0.0, 2.0]\text{ m}$
  $I_{\mathcal{B}} = [1.5, 3.5]\text{ m}$
  $$\text{overlap}_1 = 2.0 - 1.5 = 0.500\text{ m}$$

- **Axis 2 ($\hat{\mathbf{n}}_2 = [0, 1]^T$):**
  $I_{\mathcal{A}} = [0.0, 2.0]\text{ m}$
  $I_{\mathcal{B}} = [1.0, 3.0]\text{ m}$
  $$\text{overlap}_2 = 2.0 - 1.0 = 1.000\text{ m}$$

- **Axis 3 ($\hat{\mathbf{n}}_3 = [0.8944, 0.4472]^T$):**
  - Projecting Square $\mathcal{A}$ ($[0,0], [2,0], [2,2], [0,2]$):
    $\min$ at $[0, 0] \implies 0.00$
    $\max$ at $[2, 2] \implies 0.8944(2) + 0.4472(2) = 2.6833\text{ m}$
    $I_{\mathcal{A}} = [0.00, 2.6833]$
  - Projecting Triangle $\mathcal{B}$:
    - $[1.5, 1.0] \implies 0.8944(1.5) + 0.4472(1.0) = 1.7889$
    - $[3.5, 1.0] \implies 0.8944(3.5) + 0.4472(1.0) = 3.5777$
    - $[2.5, 3.0] \implies 0.8944(2.5) + 0.4472(3.0) = 3.5777$
    $I_{\mathcal{B}} = [1.7889, 3.5777]$
  $$\text{overlap}_3 = \min(2.6833, 3.5777) - \max(0.0, 1.7889) = 2.6833 - 1.7889 = 0.8944\text{ m}$$

- **Axis 4 ($\hat{\mathbf{n}}_4 = [-0.8944, 0.4472]^T$):**
  - Projecting Square $\mathcal{A}$:
    - $[2, 0] \implies -1.7889$
    - $[0, 2] \implies +0.8944$
    $I_{\mathcal{A}} = [-1.7889, 0.8944]$
  - Projecting Triangle $\mathcal{B}$:
    - $[3.5, 1.0] \implies -0.8944(3.5) + 0.4472(1.0) = -3.1305 + 0.4472 = -2.6833$
    - $[1.5, 1.0] \implies -0.8944(1.5) + 0.4472(1.0) = -1.3416 + 0.4472 = -0.8944$
    - $[2.5, 3.0] \implies -0.8944(2.5) + 0.4472(3.0) = -2.2361 + 1.3416 = -0.8944$
    $I_{\mathcal{B}} = [-2.6833, -0.8944]$
  $$\text{overlap}_4 = \min(0.8944, -0.8944) - \max(-1.7889, -2.6833) = -0.8944 - (-1.7889) = +0.8945\text{ m}$$

**Step 3: Minimum overlap and contact output.**
Overlaps:
$$\delta = \min(0.500, 1.000, 0.8944, 0.8945) = 0.500\text{ m} \quad (\text{Axis 1: } \hat{\mathbf{n}}_1 = [1, 0]^T)$$
Direction check:
$$\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A = [2.5 - 1.0, 1.667 - 1.0]^T = [1.5, 0.667]^T$$
$$\mathbf{d}_{\text{centers}} \cdot [1, 0]^T = +1.5 > 0 \implies \mathbf{n} = [1.0, 0.0]^T$$
Complete manifold output:
- `colliding`: `true`
- Penetration depth $\delta = 0.500\text{ meters}$
- Contact normal $\mathbf{n} = [1.000, 0.000]^T$
- Minimum Translation Vector $\mathbf{MTV} = [0.500, 0.000]^T\text{ m}$

---

## 5.7 Chapter Mastery Exercises

### Exercise 5.1 (Tier 1): Normal of a Vertical Edge
A polygon edge runs from $[5, 2]^T$ to $[5, 8]^T$ in CCW order. Compute its outward unit normal $\hat{\mathbf{n}}$.

### Exercise 5.2 (Tier 1): Overlap Calculation from 1D Intervals
Given intervals $I_{\mathcal{A}} = [3.2, 7.8]$ and $I_{\mathcal{B}} = [6.0, 10.5]$ on a unit axis:
1. Compute the scalar overlap.
2. State whether this axis separates the shapes.

### Exercise 5.3 (Tier 2): Total Axis Count for Two Pentagons
Two arbitrary convex pentagons ($M_A = 5, M_B = 5$) test for collision under SAT.
What is the maximum number of dot product operations evaluated if no separating axis is found?

### Exercise 5.4 (Tier 2): Early Exit Probability
In a broad-phase candidate pair that turns out to be false positive (disjoint), why does SAT exit on average in fewer than 2 axis tests?

### Exercise 5.5 (Tier 3): Hybrid SAT Axis Count for Circle vs Octagon
A circular projectile tests against an octagonal barrier ($M = 8$).
How many candidate separating axes must be evaluated in the worst-case overlapping scenario?

### Exercise 5.6 (Tier 3): Diamond vs Diamond Axis Symmetry
Two identical squares rotated by $45^\circ$ test for collision. How many unique candidate axes exist?

### Exercise 5.7 (Tier 4): Minimum Translation Vector on an Incline
Two boxes overlap. The minimum overlap axis is $\hat{\mathbf{n}} = [0.60, 0.80]^T$ with overlap $\delta = 0.15\text{ m}$.
Center $A$ is at $[0, 0]^T$, center $B$ is at $[2, 3]^T$.
Calculate the $\mathbf{MTV}$ to separate Body $B$ from Body $A$.

### Exercise 5.8 (Tier 4): Detecting Edge-on-Edge Parallel Alignment
Suppose Polygon $\mathcal{A}$ and Polygon $\mathcal{B}$ share a candidate axis $\hat{\mathbf{n}}_A \parallel \hat{\mathbf{n}}_B$.
Explain why this axis represents a potential face-to-face contact manifold rather than a point contact.

### Exercise 5.9 (Tier 5): Fast Dot Product Vectorization in SAT
Write out the pseudo-code for SIMD vectorization of the vertex projection loop:
$$s_{\min} = \min_{i=0}^{M-1} (\mathbf{v}_i \cdot \hat{\mathbf{n}})$$
Show how 4 vertices can be projected simultaneously using 128-bit SIMD registers.

### Exercise 5.10 (Tier 5): The 3D SAT Axis Explosion
In 3D polyhedral SAT, candidate axes include face normals of both polyhedra PLUS cross products of all edge pairs:
$$\mathcal{N}_{3D} = \mathcal{F}_A \cup \mathcal{F}_B \cup \{ \mathbf{e}_A \times \mathbf{e}_B \}$$
For two general 3D boxes (6 faces, 12 edges each), calculate the total candidate axis count and explain why physics engines prefer GJK/EPA over 3D SAT.

---

## 5.8 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 5.1
Vertices: $\mathbf{v}_1 = [5, 2]^T, \mathbf{v}_2 = [5, 8]^T$.
Edge vector: $\mathbf{e} = \mathbf{v}_2 - \mathbf{v}_1 = [5 - 5, 8 - 2]^T = [0, 6]^T$.
CCW 2D perpendicular normal:
$$\mathbf{n} = \begin{bmatrix} e_y \\ -e_x \end{bmatrix} = \begin{bmatrix} 6.0 \\ -0.0 \end{bmatrix} = \begin{bmatrix} 6.0 \\ 0.0 \end{bmatrix}$$
Unit normal:
$$\hat{\mathbf{n}} = \frac{[6, 0]^T}{6.0} = \begin{bmatrix} 1.000 \\ 0.000 \end{bmatrix}$$
The normal points outward to the right ($+x$).

---

### Solution to Exercise 5.2
$I_{\mathcal{A}} = [3.2, 7.8], I_{\mathcal{B}} = [6.0, 10.5]$.
1. **Overlap calculation:**
   $$\text{overlap} = \min(s_{\max, A}, s_{\max, B}) - \max(s_{\min, A}, s_{\min, B}) = \min(7.8, 10.5) - \max(3.2, 6.0) = 7.8 - 6.0 = 1.80\text{ meters}$$
2. **Separation state:**
   Because $\text{overlap} = 1.80 > 0$, this axis does NOT separate the shapes (they overlap by $1.80\text{ m}$ on this axis).

---

### Solution to Exercise 5.3
Each pentagon has 5 vertices and 5 edges.
Total candidate axes: $M_A + M_B = 5 + 5 = 10$ axes.
On each axis, we project all 5 vertices of $\mathcal{A}$ ($5$ dot products) and all 5 vertices of $\mathcal{B}$ ($5$ dot products) $= 10$ dot products per axis.
Over 10 axes:
$$\text{Total Dot Products} = 10\text{ axes} \times 10\text{ dot products/axis} = 100\text{ dot products}$$

---

### Solution to Exercise 5.4
When two bodies are separated in space, their centroids are displaced along a dominant spatial direction $\mathbf{d}$.
The candidate edge normals facing this displacement direction typically exhibit the largest negative overlaps.
Statistically, testing axes sorted by proximity to the inter-centroid vector $\mathbf{c}_B - \mathbf{c}_A$ reveals a separating axis ($I_A \cap I_B = \emptyset$) on the **very first or second test in over $90\%$ of non-colliding cases**, achieving an empirical average complexity of $\mathcal{O}(1)$ for disjoint broad-phase pairs.

---

### Solution to Exercise 5.5
For an octagon ($M = 8$) and a circle:
- 8 outward edge normals of the octagon
- PLUS 1 axis connecting closest octagon vertex to circle center
$$\text{Total Axes} = 8 + 1 = 9\text{ candidate axes}$$

---

### Solution to Exercise 5.6
A diamond is a square rotated by $45^\circ$.
Opposite edges are parallel: each diamond has only $4 / 2 = 2$ unique edge normals ($[0.707, 0.707]^T$ and $[-0.707, 0.707]^T$).
Because both diamonds share the same $45^\circ$ orientation, their edge normals are identical.
Total unique candidate axes: **exactly 2 axes**.

---

### Solution to Exercise 5.7
Given $\hat{\mathbf{n}} = [0.60, 0.80]^T$, $\delta = 0.15\text{ m}$.
Center vector: $\mathbf{d}_{\text{centers}} = \mathbf{c}_B - \mathbf{c}_A = [2 - 0, 3 - 0]^T = [2.0, 3.0]^T\text{ m}$.
Dot product:
$$\mathbf{d}_{\text{centers}} \cdot \hat{\mathbf{n}} = (2.0)(0.60) + (3.0)(0.80) = 1.20 + 2.40 = +3.60 > 0$$
Since positive, normal $\mathbf{n} = \hat{\mathbf{n}} = [0.60, 0.80]^T$.
$$\mathbf{MTV} = \delta \mathbf{n} = 0.15 \begin{bmatrix} 0.60 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 0.090 \\ 0.120 \end{bmatrix}\text{ m}$$

---

### Solution to Exercise 5.8
When $\hat{\mathbf{n}}_A$ is parallel or antiparallel to $\hat{\mathbf{n}}_B$, the two edges generating those normals are mutually parallel.
If the minimum penetration occurs along this axis, the two polygons are colliding face-to-face rather than vertex-to-face.
The resulting geometric intersection is a line segment rather than a single point, producing a **2-point contact manifold** capable of transmitting stable rotational resting torque.

---

### Solution to Exercise 5.9
Using 128-bit SIMD registers (processing two 2D vectors $[x_0, y_0, x_1, y_1]$ per register):
```typescript
// Pseudo-SIMD Projection Loop
__m128 nx = _mm_set1_ps(n.x);
__m128 ny = _mm_set1_ps(n.y);
__m128 min_val = _mm_set1_ps(1e9f);
__m128 max_val = _mm_set1_ps(-1e9f);

for (let i = 0; i < vertexCount; i += 4) {
  __m128 vx = _mm_load_ps(&vertices_x[i]);
  __m128 vy = _mm_load_ps(&vertices_y[i]);
  __m128 dots = _mm_add_ps(_mm_mul_ps(vx, nx), _mm_mul_ps(vy, ny));
  min_val = _mm_min_ps(min_val, dots);
  max_val = _mm_max_ps(max_val, dots);
}
// Horizontal reduction across 4 SIMD lanes yields s_min and s_max
```
This evaluates 4 vertex projections in parallel within 3 CPU clock cycles.

---

### Solution to Exercise 5.10
In 3D, candidate separating axes include:
- Face normals of Box A: $3$ unique axes (opposite faces parallel)
- Face normals of Box B: $3$ unique axes
- Edge cross products: $3$ unique edge directions in A $\times$ $3$ unique edge directions in B:
  $$3 \times 3 = 9\text{ edge-edge cross axes}$$
$$\text{Total Candidate Axes} = 3 + 3 + 9 = 15\text{ candidate axes}$$
For general polyhedra with $F_A, F_B$ faces and $E_A, E_B$ edges, the axis count is $F_A + F_B + E_A E_B$, which easily exceeds 100 to 500 axes.
Because 3D SAT exhibits quadratic combinatorial growth on edges ($E_A E_B$), modern 3D physics engines abandon SAT in favor of **GJK (Gilbert-Johnson-Keerthi)** and **EPA (Expanding Polytope Algorithm)**, which converge to the minimum distance in $\mathcal{O}(1)$ iterations regardless of edge counts. $\blacksquare$
