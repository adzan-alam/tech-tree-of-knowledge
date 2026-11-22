# Chapter 6: Expanding Polytope Algorithm (EPA) and Contact Manifold Generation

> *"GJK tells us that two worlds have collided; EPA reveals the depth of their transgression. By expanding the simplex into a faceted crystal of support points, we discover the exact minimum vector that restores separation."*
> — **Gino van den Bergen**, *Collision Detection in Interactive 3D Environments* (2003)

---

## 6.1 The Penetration Problem in Rigid Body Physics

In Chapter 5, we derived the Gilbert-Johnson-Keerthi (GJK) algorithm and proved that two convex bodies $A$ and $B$ collide if and only if the origin lies strictly inside their Minkowski difference:

$$\mathbf{0} \in (A \ominus B) \iff A \cap B \neq \emptyset$$

While GJK provides an exceptionally fast boolean answer (`colliding` vs. `separated`), **it fails completely when interpenetration occurs**.

### 6.1.1 Why GJK Cannot Determine Penetration Depth

When two bodies interpenetrate, the origin $\mathbf{0}$ is swallowed into the interior of the Minkowski difference $A \ominus B$. The terminal GJK simplex is a tetrahedron $\mathbf{A}\mathbf{B}\mathbf{C}\mathbf{D}$ enclosing the origin.

```
       GJK Terminates with Origin Inside:       What Physics Engines Require:
               .------------.                          .------------.
             .'      D       `.                      .'      D       `.
            /       /|\        \                    /       /|\        \
           /       / | \        \                  /       / | \        \
          |       /  *0 \        |                |       /  *0--> n     |
          |      /  / C  \       |                |      /  / C \ | d    |
           \    /--+------\     /                  \    /--+-----\v     /
            `. A           B  .'                    `. A         * B  .'
              `--------------'                        `--------------'
                                               Closest boundary point w*
                                               Penetration depth d = ||w*||
                                               Contact normal n = w* / ||w*||
```

At this moment:
1. The distance from the origin to the simplex is **zero**.
2. The distance between the closest points is **zero**.
3. GJK cannot determine whether the bodies are overlapping by $0.001\text{ millimeters}$ or by $10\text{ meters}$!
4. GJK cannot determine **which direction** to push the bodies to resolve the collision.

### 6.1.2 The Minimum Translation Vector (MTV)

To resolve interpenetration with minimum kinetic energy disturbance, a physics solver requires the **Minimum Translation Vector (MTV)**: the smallest translation vector $\mathbf{v}_{\text{mtv}}$ that, when applied to Body $A$, completely separates the two bodies:

$$\mathbf{v}_{\text{mtv}} = d \, \hat{\mathbf{n}}$$

where:
- $d \ge 0$ is the **Penetration Depth** (scalar distance).
- $\hat{\mathbf{n}} \in \mathbb{R}^3$ is the **Contact Normal** ($\|\hat{\mathbf{n}}\| = 1$), pointing outward from Body $B$ into Body $A$.

Geometrically, the MTV is the shortest vector from the origin $\mathbf{0}$ to the **boundary** $\partial(A \ominus B)$ of the Minkowski difference:

$$\boxed{\mathbf{w}^* = \arg\min_{\mathbf{w} \in \partial(A \ominus B)} \|\mathbf{w}\|, \quad d = \|\mathbf{w}^*\|, \quad \hat{\mathbf{n}} = \frac{\mathbf{w}^*}{\|\mathbf{w}^*\|}}$$

To calculate this vector efficiently without constructing the full Minkowski difference mesh, Dutch computer scientist Gino van den Bergen formulated the **Expanding Polytope Algorithm (EPA)**.

---

## 6.2 The Expanding Polytope Algorithm (EPA) Architecture

EPA takes the terminal 3-simplex (tetrahedron) produced by GJK that encloses the origin, and iteratively expands it into a convex polytope that approaches the true boundary of $A \ominus B$.

```
+-----------------------------------------------------------------------------------+
|                        EPA ALGORITHM EXECUTION FLOW                               |
+-----------------------------------------------------------------------------------+
| 1. INITIALIZATION:                                                                |
|    - Polytope P = 4 triangular faces of terminal GJK tetrahedron                  |
|    - For each face f: Compute outward unit normal n_f and distance d_f = V_0 . n_f|
| 2. EXPANSION LOOP:                                                                |
|    a. Find face f_min with MINIMUM distance to origin: d_min = min(d_f)           |
|    b. Query support point along face normal: w = S_A(n_min) - S_B(-n_min)         |
|    c. CONVERGENCE TEST:                                                           |
|       If (w . n_min - d_min < epsilon):                                           |
|          --> TERMINATE! Depth = d_min, Normal = n_min.                            |
|    d. SILHOUETTE EDGE EXTRACTION:                                                 |
|       - Find all faces visible from w: (w - V_0) . n_f > 0                        |
|       - Extract boundary edges shared by exactly one visible and one hidden face  |
|       - Remove all visible faces from P                                           |
|    e. POLYTOPE RECONSTRUCTION:                                                    |
|       - For each silhouette edge (E_0, E_1):                                      |
|            Create new triangular face (E_0, E_1, w) with outward normal           |
|            Insert into P                                                          |
+-----------------------------------------------------------------------------------+
```

### 6.2.1 Data Structures: Triangular Faces and Half-Edges

The expanding polytope $\mathcal{P}$ is maintained as a collection of oriented triangular faces. Each face $f$ stores:
1. Three vertex coordinates: $\mathbf{V}_0, \mathbf{V}_1, \mathbf{V}_2 \in \mathbb{R}^3$ (ordered counterclockwise when viewed from outside).
2. Outward unit normal vector:
   $$\hat{\mathbf{n}}_f = \frac{(\mathbf{V}_1 - \mathbf{V}_0) \times (\mathbf{V}_2 - \mathbf{V}_0)}{\|(\mathbf{V}_1 - \mathbf{V}_0) \times (\mathbf{V}_2 - \mathbf{V}_0)\|}$$
3. Signed perpendicular distance from the origin to the face plane:
   $$d_f = \mathbf{V}_0 \cdot \hat{\mathbf{n}}_f$$

Because the tetrahedron encloses the origin, the outward normal points away from the origin, ensuring that $d_f > 0$.

### 6.2.2 The Convergence Criterion

At each iteration, EPA selects the face $f_{\min}$ closest to the origin:
$$d_{\min} = \min_{f \in \mathcal{P}} d_f$$

We query the Minkowski support mapping along this face's outward normal:
$$\mathbf{w} = S_{A \ominus B}(\hat{\mathbf{n}}_{f_{\min}}) = S_A(\hat{\mathbf{n}}_{f_{\min}}) - S_B(-\hat{\mathbf{n}}_{f_{\min}})$$

The scalar projection of $\mathbf{w}$ onto the normal $\hat{\mathbf{n}}_{f_{\min}}$ represents the true boundary extent of $A \ominus B$ in that direction:
$$d_{\text{boundary}} = \mathbf{w} \cdot \hat{\mathbf{n}}_{f_{\min}}$$

We test the difference:
$$\boxed{\Delta d = d_{\text{boundary}} - d_{\min} = (\mathbf{w} \cdot \hat{\mathbf{n}}_{f_{\min}}) - d_{\min} < \epsilon}$$

If $\Delta d < \epsilon$ (where $\epsilon \approx 10^{-4}\text{ m}$ is the numerical precision tolerance):
- The face $f_{\min}$ is already coplanar with the true boundary of the Minkowski difference!
- No further expansion can occur in that direction.
- EPA terminates with exact parameters:
  $$\boxed{d = d_{\min}, \quad \hat{\mathbf{n}} = \hat{\mathbf{n}}_{f_{\min}}}$$

### 6.2.3 Silhouette Edge Extraction and Polytope Rebuilding

If $\Delta d \ge \epsilon$, the point $\mathbf{w}$ lies outside the polytope. We must expand the polytope by adding $\mathbf{w}$ as a new vertex.

To preserve convexity:
1. **Identify Visible Faces:** A face $f$ is visible from $\mathbf{w}$ if $\mathbf{w}$ lies in front of the face plane:
   $$(\mathbf{w} - \mathbf{V}_{f, 0}) \cdot \hat{\mathbf{n}}_f > 0$$
2. **Find Silhouette Edges:** A directed edge $\mathbf{E} = (\mathbf{e}_0, \mathbf{e}_1)$ is a **silhouette edge** if it is shared by:
   - One visible face (which will be deleted).
   - One hidden face (which will be retained).
3. **Delete Visible Faces:** All visible faces are purged from the polytope mesh.
4. **Construct New Faces:** For every silhouette edge $(\mathbf{e}_0, \mathbf{e}_1)$, we create a new triangular face connecting the edge to the new support vertex:
   $$\text{New Face} = (\mathbf{e}_0, \, \mathbf{e}_1, \, \mathbf{w})$$
   Compute its normal $\hat{\mathbf{n}}_{\text{new}}$ and distance $d_{\text{new}} = \mathbf{e}_0 \cdot \hat{\mathbf{n}}_{\text{new}}$.

The polytope volume expands monotonically. Because $A \ominus B$ is bounded and convex, EPA provably converges to the exact boundary in a finite number of steps (typically $2\text{ to }5$ iterations).

---

## 6.3 Extracting Contact Witness Points on Bodies A and B

Knowing the penetration depth $d$ and normal $\hat{\mathbf{n}}$ is not enough: a physics engine needs the **exact world-space contact points $\mathbf{p}_A$ and $\mathbf{p}_B$** on the surfaces of the two colliding bodies to compute lever arms $\mathbf{r}_A = \mathbf{p}_A - \mathbf{x}_A$ and contact torques.

```
       Minkowski Space:                             World Space:
       Closest point w* on Face W_0, W_1, W_2      Witness points on surfaces
              w* = sum(lambda_k * W_k)              p_A = sum(lambda_k * a_k)
                                                    p_B = sum(lambda_k * b_k)
              Body A o------------o Body B          p_A - p_B = d * n
                      \          /
                       \        /
                        \      /
                         \    /
                          \  /
                           \/
```

### 6.3.1 Barycentric Decomposition of the Closest Point

Let the terminal EPA face have vertices $\mathbf{W}_0, \mathbf{W}_1, \mathbf{W}_2 \in \mathbb{R}^3$.
The point on this face closest to the origin is its perpendicular projection:
$$\mathbf{w}^* = d \, \hat{\mathbf{n}}$$

Because $\mathbf{w}^*$ lies on the triangular face, it can be uniquely expressed in barycentric coordinates $(\lambda_0, \lambda_1, \lambda_2)$:
$$\mathbf{w}^* = \lambda_0 \mathbf{W}_0 + \lambda_1 \mathbf{W}_1 + \lambda_2 \mathbf{W}_2, \quad \text{where } \lambda_0 + \lambda_1 + \lambda_2 = 1, \quad \lambda_k \ge 0$$

### 6.3.2 Tracing Back to Individual Primitive Coordinates

Every vertex $\mathbf{W}_k$ in the Minkowski difference was originally computed from individual support mappings:
$$\mathbf{W}_k = \mathbf{a}_k - \mathbf{b}_k$$
where $\mathbf{a}_k = S_A(\hat{\mathbf{n}}_k) \in A$ and $\mathbf{b}_k = S_B(-\hat{\mathbf{n}}_k) \in B$.

By linearity, we substitute these into the barycentric expansion:
$$\mathbf{w}^* = \lambda_0 (\mathbf{a}_0 - \mathbf{b}_0) + \lambda_1 (\mathbf{a}_1 - \mathbf{b}_1) + \lambda_2 (\mathbf{a}_2 - \mathbf{b}_2)$$
$$= (\lambda_0 \mathbf{a}_0 + \lambda_1 \mathbf{a}_1 + \lambda_2 \mathbf{a}_2) - (\lambda_0 \mathbf{b}_0 + \lambda_1 \mathbf{b}_1 + \lambda_2 \mathbf{b}_2)$$

Thus, the exact contact witness points on the physical surfaces of Body $A$ and Body $B$ are:

$$\boxed{\mathbf{p}_A = \sum_{k=0}^2 \lambda_k \mathbf{a}_k, \quad \mathbf{p}_B = \sum_{k=0}^2 \lambda_k \mathbf{b}_k}$$

Verification:
$$\mathbf{p}_A - \mathbf{p}_B = \mathbf{w}^* = d \, \hat{\mathbf{n}}$$
The vector separating the two witness points matches the Minimum Translation Vector exactly!

---

## 6.4 Contact Manifold Generation: Sutherland-Hodgman Polygon Clipping

EPA produces a **single contact point** $(\mathbf{p}, \hat{\mathbf{n}}, d)$.
However, in rigid body dynamics, single-point contacts are insufficient for resting planar stability!

```
       Single Contact Point:                     4-Point Contact Manifold:
       (Box on Table - Tipping Instability)      (Box on Table - Stable Rest)
                 +-------+                                 +-------+
                 |  Box  |                                 |  Box  |
                 +-------+                                 +-------+
                     * (Pivots and wobbles!)               *       * (Stable balance!)
       =============================             =============================
```

When a box rests flat on a table, its bottom face touches the table across an entire 2D rectangular area. A single contact point would cause the box to unrealistically pivot and wobble about that one point.
To achieve resting stability, the engine must construct a **Contact Manifold** comprising up to 4 support vertices.

### 6.4.1 Step 1: Identifying Reference Face and Incident Face

Given the contact normal $\hat{\mathbf{n}}$ from EPA:
1. **Reference Face:** The face on Body $A$ or Body $B$ whose normal is **most antiparallel to $\hat{\mathbf{n}}$**:
   $$\text{Face}_A^* = \arg\min_f (\hat{\mathbf{n}}_f^A \cdot \hat{\mathbf{n}}), \quad \text{Face}_B^* = \arg\max_f (\hat{\mathbf{n}}_f^B \cdot \hat{\mathbf{n}})$$
   The body whose face normal aligns most closely with $\hat{\mathbf{n}}$ is designated the **Reference Body**; the opposing body is designated the **Incident Body**.
2. Let Body $A$ be the Reference Body with reference polygon $\mathcal{P}_{\text{ref}}$ and reference normal $\hat{\mathbf{n}}_{\text{ref}} = \hat{\mathbf{n}}$.
3. Let Body $B$ be the Incident Body with incident polygon $\mathcal{P}_{\text{inc}}$.

```
             REFERENCE FACE vs. INCIDENT FACE
                                +---------------+
                                | Incident Box  |
                                +---------------+
                                     /     \    <-- Incident Face P_inc
                       Side Plane   /       \   Side Plane
                            |      /         \      |
                            v     *-----------*     v
       ===========================|===========|===========================
                                  | Reference |
                                  |   Face    |
                                  +-----------+
```

### 6.4.2 Step 2: Sutherland-Hodgman Polygon Clipping

The incident polygon $\mathcal{P}_{\text{inc}}$ is clipped against the **side planes** of the reference face.

For each edge of the reference face:
1. Define side plane normal $\hat{\mathbf{n}}_{\text{side}}$ pointing inward toward the reference face.
2. Clip the polygon against the half-space $\mathbf{x} \cdot \hat{\mathbf{n}}_{\text{side}} + d_{\text{side}} \ge 0$:
   - For every edge $\mathbf{V}_1 \mathbf{V}_2$ of the polygon:
     - If both $\mathbf{V}_1, \mathbf{V}_2$ are inside: Keep $\mathbf{V}_2$.
     - If $\mathbf{V}_1$ is inside and $\mathbf{V}_2$ is outside: Compute intersection $\mathbf{I}$, keep $\mathbf{I}$.
     - If $\mathbf{V}_1$ is outside and $\mathbf{V}_2$ is inside: Compute intersection $\mathbf{I}$, keep $\mathbf{I}$ and $\mathbf{V}_2$.
     - If both are outside: Discard both.

### 6.4.3 Step 3: Reference Plane Penetration Clipping

After clipping against all side planes, clip the remaining vertices against the **reference face plane**:
- For each clipped vertex $\mathbf{p}$:
  $$\text{Depth} = (\mathbf{p}_{\text{ref}} - \mathbf{p}) \cdot \hat{\mathbf{n}}_{\text{ref}}$$
  - If $\text{Depth} > 0$: The point penetrates into Body $A$! Keep as a valid contact point.
  - If $\text{Depth} \le 0$: The point is above the face; discard.

### 6.4.4 Step 4: Manifold Reduction to 4 Maximal-Area Points

If clipping produces more than 4 points, we reduce them to a **4-point manifold** using Erin Catto's area-maximization heuristic:
1. Point 1: The point of deepest penetration.
2. Point 2: The point furthest from Point 1.
3. Point 3: The point forming the largest triangle area with Points 1 and 2.
4. Point 4: The point forming the largest triangle area on the opposite side of edge 1–2.

This reduced 4-point manifold provides the exact support basis required by the sequential impulse solver from `phys-rigid-body-3d` Chapter 11!

---

## 6.5 Ten Step-by-Step Worked Examples

### Worked Example 6.1: Full EPA Trace on Penetrating Spheres
**Problem:** Two spheres in $\mathbb{R}^3$:
Sphere $A$: Center $(0, 0, 0)^T$, radius $R_A = 2.0$.
Sphere $B$: Center $(3, 0, 0)^T$, radius $R_B = 1.5$.
Theoretical penetration along x-axis is $d = (R_A + R_B) - 3.0 = 3.5 - 3.0 = 0.5\text{ m}$.
Trace the EPA iteration to compute penetration depth $d$ and contact normal $\hat{\mathbf{n}}$.

**Solution:**
1. From GJK, we obtain an initial tetrahedron enclosing the origin with an initial closest face along the x-axis:
   $\hat{\mathbf{n}}_{\text{face}} = (-1, 0, 0)^T$.
   Suppose the face distance from origin is $d_0 = 0.2\text{ m}$.
2. Query Minkowski support point along $\hat{\mathbf{n}}_{\text{face}} = (-1, 0, 0)^T$:
   $$S_A(-1, 0, 0) = (0, 0, 0) + 2.0(-1, 0, 0) = (-2, 0, 0)^T$$
   $$S_B(+1, 0, 0) = (3, 0, 0) + 1.5(1, 0, 0) = (4.5, 0, 0)^T$$
   $$\mathbf{w} = S_A - S_B = (-2, 0, 0)^T - (4.5, 0, 0)^T = (-6.5, 0, 0)^T \quad \text{Wait: normal points } B \to A.$$
   Let's use normal pointing from $B$ to $A$: $\hat{\mathbf{n}} = (-1, 0, 0)^T$.
   Displacement of sphere centers is $\mathbf{c}_A - \mathbf{c}_B = (-3, 0, 0)^T$.
   Extreme point along $-\hat{\mathbf{i}}$:
   $$\mathbf{w}^* = (\mathbf{c}_A - \mathbf{c}_B) + (R_A + R_B)\hat{\mathbf{n}} = (-3, 0, 0)^T + 3.5(-1, 0, 0)^T \dots \text{No:}$$
   Let $A \ominus B$ be analyzed:
   $A$ is centered at $(0, 0, 0)^T$, radius $2.0$.
   $B$ is centered at $(3, 0, 0)^T$, radius $1.5$.
   $A \ominus B$ is a sphere centered at $\mathbf{c}_A - \mathbf{c}_B = (-3, 0, 0)^T$ with radius $R_A + R_B = 3.5$.
3. The boundary of $A \ominus B$ along the x-axis:
   Center at $-3.0$, radius $3.5$.
   The boundary points are at $-3 - 3.5 = -6.5$ and $-3 + 3.5 = +0.5$!
4. The point on the boundary closest to the origin $\mathbf{0}$ is at $x = +0.5$!
   $$\mathbf{w}^* = (+0.5, 0, 0)^T$$
5. Distance from origin:
   $$d = \|\mathbf{w}^*\| = 0.5\text{ m}$$
   Normal pointing from origin to boundary:
   $$\hat{\mathbf{n}} = (+1, 0, 0)^T \quad (\text{or } (-1, 0, 0)^T \text{ depending on sign convention}).$$
   EPA terminates with exact penetration depth $d = 0.5\text{ m}$!

---

### Worked Example 6.2: Barycentric Witness Point Reconstruction
**Problem:** In a 2D slice of EPA, the closest face of $A \ominus B$ to the origin is a line segment with vertices:
$\mathbf{W}_0 = (-2, 1)^T$, $\mathbf{W}_1 = (2, 1)^T$.
The origin is at $(0, 0)^T$.
The original support points were:
$\mathbf{a}_0 = (1, 3)^T, \mathbf{b}_0 = (3, 2)^T \implies \mathbf{a}_0 - \mathbf{b}_0 = (-2, 1)^T = \mathbf{W}_0$.
$\mathbf{a}_1 = (5, 3)^T, \mathbf{b}_1 = (3, 2)^T \implies \mathbf{a}_1 - \mathbf{b}_1 = (2, 1)^T = \mathbf{W}_1$.
Find the closest point $\mathbf{w}^*$, barycentric weights, and the contact witness points $\mathbf{p}_A$ and $\mathbf{p}_B$.

**Solution:**
1. The line segment spans from $(-2, 1)$ to $(2, 1)$ at height $y = 1.0$.
   The perpendicular projection of the origin $(0, 0)$ onto this segment is:
   $$\mathbf{w}^* = (0, 1)^T$$
   Penetration depth $d = 1.0$. Normal $\hat{\mathbf{n}} = (0, 1)^T$.
2. Barycentric weights:
   $$\mathbf{w}^* = \lambda_0 \mathbf{W}_0 + \lambda_1 \mathbf{W}_1 \implies \begin{pmatrix} 0 \\ 1 \end{pmatrix} = \lambda_0 \begin{pmatrix} -2 \\ 1 \end{pmatrix} + \lambda_1 \begin{pmatrix} 2 \\ 1 \end{pmatrix}$$
   $$-2\lambda_0 + 2\lambda_1 = 0 \implies \lambda_0 = \lambda_1$$
   $$\lambda_0 + \lambda_1 = 1 \implies \lambda_0 = 0.5, \quad \lambda_1 = 0.5$$
3. Witness Point on Body $A$:
   $$\mathbf{p}_A = \lambda_0 \mathbf{a}_0 + \lambda_1 \mathbf{a}_1 = 0.5 \begin{pmatrix} 1 \\ 3 \end{pmatrix} + 0.5 \begin{pmatrix} 5 \\ 3 \end{pmatrix} = \begin{pmatrix} 0.5 + 2.5 \\ 1.5 + 1.5 \end{pmatrix} = \begin{pmatrix} 3.0 \\ 3.0 \end{pmatrix}$$
4. Witness Point on Body $B$:
   $$\mathbf{p}_B = \lambda_0 \mathbf{b}_0 + \lambda_1 \mathbf{b}_1 = 0.5 \begin{pmatrix} 3 \\ 2 \end{pmatrix} + 0.5 \begin{pmatrix} 3 \\ 2 \end{pmatrix} = \begin{pmatrix} 3.0 \\ 2.0 \end{pmatrix}$$
5. Verification:
   $$\mathbf{p}_A - \mathbf{p}_B = \begin{pmatrix} 3.0 \\ 3.0 \end{pmatrix} - \begin{pmatrix} 3.0 \\ 2.0 \end{pmatrix} = \begin{pmatrix} 0.0 \\ 1.0 \end{pmatrix} = d \, \hat{\mathbf{n}}$$
   Matches $\mathbf{w}^* = (0, 1)^T$ exactly!

---

### Worked Example 6.3: Sutherland-Hodgman 2D Line Clipping on Reference Face
**Problem:** A 2D box $A$ rests on the ground. Its top face (Reference Face) spans from $x = -2$ to $x = +2$ at $y = 0$.
An incident edge of Box $B$ spans from $\mathbf{V}_1 = (-3, -0.5)^T$ to $\mathbf{V}_2 = (1, -0.5)^T$ (penetrating $0.5\text{ m}$ below the surface).
Clip segment $\mathbf{V}_1\mathbf{V}_2$ against the left side plane $x \ge -2$ and right side plane $x \le +2$.

**Solution:**
1. **Clip against Left Side Plane ($x \ge -2$):**
   $\mathbf{V}_1 = (-3, -0.5)^T$ has $x = -3 < -2$ (Outside).
   $\mathbf{V}_2 = (1, -0.5)^T$ has $x = 1 \ge -2$ (Inside).
   Calculate intersection point $\mathbf{I}_1$ where $x = -2$:
   Interpolation parameter:
   $$t = \frac{-2 - x_1}{x_2 - x_1} = \frac{-2 - (-3)}{1 - (-3)} = \frac{1}{4} = 0.25$$
   $$y = y_1 + t(y_2 - y_1) = -0.5 + 0.25(-0.5 - (-0.5)) = -0.5$$
   Intersection: $\mathbf{I}_1 = (-2, -0.5)^T$.
   Clipped segment: $[\mathbf{I}_1, \mathbf{V}_2] = [(-2, -0.5)^T, (1, -0.5)^T]$.
2. **Clip against Right Side Plane ($x \le +2$):**
   $\mathbf{I}_1$ has $x = -2 \le 2$ (Inside).
   $\mathbf{V}_2$ has $x = 1 \le 2$ (Inside).
   Both points are inside; nothing is clipped.
3. **Reference Face Plane Clip ($y \le 0$):**
   Both points have $y = -0.5 < 0$ (penetrating by $0.5\text{ m}$).
4. Resulting 2-point contact manifold:
   $$\mathbf{C}_1 = (-2.0, -0.5)^T, \quad \text{Depth} = 0.5\text{ m}$$
   $$\mathbf{C}_2 = (1.0, -0.5)^T, \quad \text{Depth} = 0.5\text{ m}$$

---

### Worked Example 6.4: Silhouette Edge Extraction in EPA
**Problem:** A triangular mesh polytope in EPA has 4 faces. A new support point $\mathbf{w}$ is added.
Faces 1 and 2 are visible from $\mathbf{w}$; Faces 3 and 4 are hidden.
Face 1 has edges: $(e_1, e_2, e_3)$.
Face 2 has edges: $(e_3, e_4, e_5)$.
Face 3 has edges: $(e_1, e_6, e_7)$.
Face 4 has edges: $(e_4, e_7, e_8)$.
Identify the silhouette edges that will form new triangular faces with $\mathbf{w}$.

**Solution:**
1. A silhouette edge must be shared by **exactly one visible face and one hidden face**.
2. Examine each edge:
   - $e_3$: Shared by Face 1 (Visible) and Face 2 (Visible) $\implies$ Internal edge! **DELETED**.
   - $e_1$: Shared by Face 1 (Visible) and Face 3 (Hidden) $\implies$ **SILHOUETTE EDGE!**
   - $e_2$: Shared only by Face 1 and unlisted hidden face $\implies$ **SILHOUETTE EDGE!**
   - $e_4$: Shared by Face 2 (Visible) and Face 4 (Hidden) $\implies$ **SILHOUETTE EDGE!**
   - $e_5$: Shared by Face 2 and unlisted hidden face $\implies$ **SILHOUETTE EDGE!**
3. Visible Faces 1 and 2 are deleted. New triangular faces are formed:
   $$(e_1, \mathbf{w}), \quad (e_2, \mathbf{w}), \quad (e_4, \mathbf{w}), \quad (e_5, \mathbf{w})$$
   The polytope remains strictly 2-manifold and convex!

---

### Worked Example 6.5: Degenerate Simplex Recovery in EPA
**Problem:** When GJK terminates, the origin lies on a 2-simplex (triangle) rather than inside a 3-simplex (tetrahedron).
Explain why EPA cannot begin with a flat triangle, and show how to construct an initial tetrahedron.

**Solution:**
1. A flat 2-simplex has zero volume in $\mathbb{R}^3$. All its face normals lie perpendicular to the triangle plane.
2. If EPA started with a flat triangle, the distance to the origin would be zero, but there is no interior space to expand.
3. **Recovery Procedure:**
   Query support mapping in both positive and negative normal directions:
   $$\mathbf{d}_1 = \hat{\mathbf{n}}_{\text{triangle}}, \quad \mathbf{d}_2 = -\hat{\mathbf{n}}_{\text{triangle}}$$
   $$\mathbf{w}_1 = S_{A \ominus B}(\mathbf{d}_1), \quad \mathbf{w}_2 = S_{A \ominus B}(\mathbf{d}_2)$$
4. Add $\mathbf{w}_1$ or $\mathbf{w}_2$ to the triangle to form a valid, non-degenerate 3-simplex (tetrahedron) with non-zero volume enclosing the origin!

---

### Worked Example 6.6: Face Normal Orientation Check
**Problem:** An EPA face has vertices $\mathbf{V}_0 = (1, 0, 0)^T$, $\mathbf{V}_1 = (0, 1, 0)^T$, $\mathbf{V}_2 = (0, 0, 1)^T$.
Verify that its normal points away from the origin $\mathbf{0} = (0, 0, 0)^T$.

**Solution:**
1. Edge vectors:
   $$\mathbf{E}_1 = \mathbf{V}_1 - \mathbf{V}_0 = (-1, 1, 0)^T, \quad \mathbf{E}_2 = \mathbf{V}_2 - \mathbf{V}_0 = (-1, 0, 1)^T$$
2. Cross product:
   $$\mathbf{N} = \mathbf{E}_1 \times \mathbf{E}_2 = \begin{pmatrix} -1 \\ 1 \\ 0 \end{pmatrix} \times \begin{pmatrix} -1 \\ 0 \\ 1 \end{pmatrix} = \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$$
3. Unit normal:
   $$\hat{\mathbf{n}} = \frac{1}{\sqrt{3}}(1, 1, 1)^T$$
4. Distance from origin:
   $$d = \mathbf{V}_0 \cdot \hat{\mathbf{n}} = (1, 0, 0)^T \cdot \frac{1}{\sqrt{3}}(1, 1, 1)^T = \frac{1}{\sqrt{3}} \approx 0.57735$$
   Because $d = +0.57735 > 0$, the normal vector points **AWAY from the origin**, confirming correct counterclockwise winding!

---

### Worked Example 6.7: Penetration Depth of Intersecting Cubes
**Problem:** Cube $A$ has side length $2\text{ m}$ centered at $(0, 0, 0)^T$.
Cube $B$ has side length $2\text{ m}$ centered at $(1.6, 0, 0)^T$.
Determine the penetration depth $d$ and contact normal $\hat{\mathbf{n}}$ via EPA.

**Solution:**
1. Right face of Cube $A$ is at $x = +1.0$.
2. Left face of Cube $B$ is at $x = 1.6 - 1.0 = +0.6$.
3. Overlap along X:
   $$d_x = 1.0 - 0.6 = 0.4\text{ m}$$
4. Overlap along Y: Both span $[-1, 1]$, overlap is $2.0\text{ m}$.
5. Overlap along Z: Both span $[-1, 1]$, overlap is $2.0\text{ m}$.
6. Minimum penetration is along X:
   $$d = 0.4\text{ m}, \quad \hat{\mathbf{n}} = (1, 0, 0)^T$$
   EPA terminates on the x-face with depth $0.4\text{ m}$.

---

### Worked Example 6.8: Erin Catto's Manifold Reduction Algorithm
**Problem:** Polygon clipping on a tilted box contact yields 6 contact points on the ground plane ($z = 0$):
$\mathbf{P}_1 = (0, 0)$, $\mathbf{P}_2 = (1, 0)$, $\mathbf{P}_3 = (2, 1)$, $\mathbf{P}_4 = (1.5, 2)$, $\mathbf{P}_5 = (0, 2)$, $\mathbf{P}_6 = (-1, 1)$.
All points have equal penetration depth.
Select the optimal 4 points that maximize the convex hull area of the contact patch.

**Solution:**
1. **Point 1:** Pick extreme point along any axis, e.g. minimum x:
   $$\mathbf{P}_{\text{first}} = \mathbf{P}_6 = (-1, 1)$$
2. **Point 2:** Pick point furthest from $\mathbf{P}_6$:
   Distances from $(-1, 1)$:
   $\|\mathbf{P}_3 - \mathbf{P}_6\|^2 = (2 - (-1))^2 + (1 - 1)^2 = 3^2 + 0 = 9.0$.
   $\mathbf{P}_3 = (2, 1)$ is the furthest point!
   Edge 1–2 is line segment from $(-1, 1)$ to $(2, 1)$.
3. **Point 3:** Pick point forming largest triangle area above edge 1–2 (maximum positive cross product / perpendicular distance):
   $\mathbf{P}_4 = (1.5, 2)$ and $\mathbf{P}_5 = (0, 2)$ both have $y = 2$ (height 1 above segment).
   Triangle area with $\mathbf{P}_5$: Base $= 3$, Height $= 1 \implies \text{Area} = 1.5$.
   Choose $\mathbf{P}_5 = (0, 2)$.
4. **Point 4:** Pick point forming largest triangle area below edge 1–2:
   Points below segment: $\mathbf{P}_1 = (0, 0)$ and $\mathbf{P}_2 = (1, 0)$ (both have $y = 0$, height 1 below segment).
   Choose $\mathbf{P}_1 = (0, 0)$.
5. Selected 4-point manifold:
   $$\{ (-1, 1), \, (2, 1), \, (0, 2), \, (0, 0) \}$$
   This quad maximizes contact stability across the entire footprint!

---

### Worked Example 6.9: EPA Upper Bound on Polytope Vertices
**Problem:** In production game physics, why must the maximum number of EPA iterations be strictly capped, and what is a typical vertex limit?

**Solution:**
1. For curved smooth surfaces (e.g. sphere-sphere or cylinder-cylinder), the boundary of $A \ominus B$ is smooth and non-polygonal.
2. EPA adds a new triangular facet on every iteration, approaching the curved boundary as an inscribed polygonal prism:
   $$\Delta d \approx \mathcal{O}\left(\frac{1}{N^2}\right)$$
3. Without a hard iteration limit, EPA would execute hundreds of iterations seeking mathematical convergence, destroying framerate.
4. Production engines cap EPA at **$32\text{ to }64$ vertices** (or $16\text{ to }20$ iterations), which guarantees sub-millimeter accuracy within $10\ \mu\text{s}$.

---

### Worked Example 6.10: Speculative Contacts Alternative to EPA
**Problem:** In low-cost physics engines, explain why "Speculative Contacts" are sometimes used instead of EPA when objects are separated by a small margin.

**Solution:**
1. EPA is computationally expensive ($\sim 100\text{ to }200$ FLOPs per iteration).
2. When bodies are moving fast toward each other but have not yet penetrated ($v_n < 0$), speculative contacts create a virtual contact constraint before collision occurs:
   $$d_{\text{speculative}} = \text{dist}(A, B) - v_n \Delta t$$
3. The impulse solver arrests the relative velocity during the step, preventing interpenetration entirely and avoiding the need to run EPA!

---

## 6.6 Ten Granular Solved Exercises

### Exercise 6.1: Convexity Invariant of Polytope Expansion
**Problem:** Prove that if a polytope $\mathcal{P}$ is convex and $\mathbf{w}$ is an external point, removing all visible faces and connecting $\mathbf{w}$ to the silhouette edges preserves convexity.

**Solution:**
1. A face $f$ is visible from $\mathbf{w}$ iff $\mathbf{w}$ lies in the positive half-space of $f$.
2. The union of the visible faces forms a star-shaped surface from $\mathbf{w}$.
3. Removing the visible faces leaves a cavity bounded by the silhouette edges.
4. Connecting $\mathbf{w}$ to each silhouette edge creates new planar faces whose normals strictly face away from the interior of $\mathcal{P}$, satisfying the half-space intersection definition of a convex polytope. $\blacksquare$

---

### Exercise 6.2: Silhouette Edge Duplicate Rejection
**Problem:** In code, how is an edge hash table used to filter out internal visible edges in $\mathcal{O}(N)$ time?

**Solution:**
For each visible face with directed edges $(v_0, v_1), (v_1, v_2), (v_2, v_0)$:
- Insert edge into a hash set.
- If the reverse edge $(v_1, v_0)$ already exists in the set, remove both (they represent an internal edge between two visible faces).
- After processing all visible faces, only true silhouette edges remain in the set!

---

### Exercise 6.3: Sphere-Box Incident Face Selection
**Problem:** A sphere strikes a box. Which object is the Reference Body, and which is the Incident Body?

**Solution:**
1. The sphere has no flat faces; its normal is continuous at every surface point.
2. The box has 6 flat planar faces.
3. The box must always be the **Reference Body** (providing the reference clipping plane), and the sphere is the **Incident Body** (providing a single incident contact point).

---

### Exercise 6.4: Maximum Contact Points in a 3D Polyhedral Manifold
**Problem:** Why is 4 contact points the universal standard for 3D physics engines (e.g. Bullet, PhysX, Box2D)?

**Solution:**
1. In 3D space, any 2D planar polygon can be supported stably by its 3 or 4 extreme vertices.
2. Enforcing 4 constraints provides 4 independent non-penetration impulses, perfectly preventing pitch, roll, and translation sinking.
3. Solving $N = 4$ constraints in an LCP sequential impulse solver requires only 4 iterations per contact pair, maintaining high cache locality and real-time 60 FPS performance.

---

### Exercise 6.5: Deep Penetration Tunneling Failure of EPA
**Problem:** If Body $A$ passes completely through Body $B$ in a single frame so that its center is on the far side of $B$, what failure mode occurs in EPA?

**Solution:**
EPA finds the *closest* boundary point to the origin in $A \ominus B$.
If Body $A$ has tunneled more than halfway through Body $B$, the closest boundary lies on the **wrong side**!
EPA will command a normal that pushes Body $A$ out through the far side of $B$ (accelerating it forward) rather than pushing it backward. This is why Continuous Collision Detection (CCD) is required for supersonic objects.

---

### Exercise 6.6: Planar Polygon Normal from Vertices
**Problem:** Write Newell's method formula for computing the robust outward normal of a polygon with $N$ vertices.

**Solution:**
$$\mathbf{n} = \sum_{i=0}^{N-1} \begin{pmatrix} (y_i - y_{i+1})(z_i + z_{i+1}) \\ (z_i - z_{i+1})(x_i + x_{i+1}) \\ (x_i - x_{i+1})(y_i + y_{i+1}) \end{pmatrix}$$
where indices wrap modulo $N$. Newell's method is immune to non-planar vertex warpage!

---

### Exercise 6.7: Contact Distance Threshold for Persistent Manifolds
**Problem:** What is the "manifold persistence threshold" in real-time engines?

**Solution:**
Instead of recomputing polygon clipping every frame, engines keep contact points across frames if the contact point moves by less than $\Delta x_{\text{thresh}} \approx 0.02\text{ m}$ and normal changes by less than $\theta_{\text{thresh}} \approx 5^\circ$. This "contact caching" amortizes clipping costs to near zero!

---

### Exercise 6.8: Numerical Threshold for EPA Termination
**Problem:** If the EPA termination tolerance is set too small ($\epsilon = 10^{-15}$), what numerical failure occurs?

**Solution:**
Floating-point rounding prevents $d_{\text{boundary}} - d_{\min}$ from ever reaching $10^{-15}$. EPA will run until it hits its maximum iteration limit every frame, severely degrading CPU framerates. Setting $\epsilon \in [10^{-4}, 10^{-5}]$ ensures rapid convergence.

---

### Exercise 6.9: Penetration Depth of Nested Spheres
**Problem:** Sphere $A$ (radius $5\text{ m}$, center $(0,0,0)^T$) completely encloses Sphere $B$ (radius $1\text{ m}$, center $(1,0,0)^T$). Find the penetration depth and normal to push $B$ outside $A$.

**Solution:**
Distance between centers is $1.0\text{ m}$.
Distance to boundary of $A$ along x-axis is $5 - (1 + 1) = 3.0\text{ m}$.
Penetration depth $d = 3.0\text{ m}$, normal $\hat{\mathbf{n}} = (-1, 0, 0)^T$.

---

### Exercise 6.10: Memory Size of an EPA Polytope
**Problem:** If an EPA polytope has a hard cap of 64 vertices and 124 triangular faces, calculate its maximum memory footprint.

**Solution:**
- 64 vertices $\times 12\text{ bytes}$ (`Vector3`) $= 768\text{ bytes}$.
- 124 faces $\times (3 \times 4\text{ bytes indices} + 12\text{ bytes normal} + 4\text{ bytes dist}) = 124 \times 28 = 3{,}472\text{ bytes}$.
Total: **$\approx 4.24\text{ Kilobytes}$**! Easily fits entirely inside the CPU's ultra-fast L1 Data Cache ($32\text{ KB}$)!

---

## 6.7 Chapter Summary and Bridge to Chapter 7

In this chapter, we completed the narrowphase collision resolution pipeline:
1. **The Penetration Problem:** Identified why GJK cannot resolve overlapping contacts.
2. **The Expanding Polytope Algorithm (EPA):** Formulated the iterative polytope expansion algorithm to find the Minimum Translation Vector ($d, \hat{\mathbf{n}}$).
3. **Barycentric Witness Reconstruction:** Extracted the physical surface contact points $\mathbf{p}_A$ and $\mathbf{p}_B$ from Minkowski face weights.
4. **Contact Manifolds:** Implemented Sutherland-Hodgman polygon clipping and 4-point manifold reduction for resting planar stability.

Now that we have mastered both broadphase box pruning (Chapters 1–3) and narrowphase geometric intersection (Chapters 4–6), we confront the ultimate architectural challenge of scaling collision detection to millions of triangles and thousands of dynamic objects: **Bounding Volume Hierarchies (BVH)**.
In **Chapter 7: Bounding Volume Hierarchies (BVH): Tree Topologies and Construction**, we investigate the data structures, memory layouts, and topological heuristics that organize 3D space into logarithmic trees.
