# Chapter 3: Primitive Narrow-Phase Geometry: Circle-Circle, Circle-Line, and Circle-AABB

> *"A broad-phase algorithm only tells you where collisions might be lurking. The narrow-phase is the surgical blade: it computes the exact millimeter of penetration, the immutable perpendicular normal of repulsive thrust, and the exact physical contact point where kinetic energy transforms into compressive impulse."*

---

### Conceptual Architecture: Narrow-Phase Geometric Manifold Synthesis

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             NARROW-PHASE GEOMETRIC INPUT                                 │
│                   Candidate Pair: Shape A (Transform A) + Shape B (Transform B)          │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Feature Classification
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   PRIMITIVE INTERSECTION CLASSIFICATION MATRIX                           │
├──────────────────────┬───────────────────────────────┬───────────────────────────────────┤
│ Circle vs Circle     │ Circle vs Segment / Line      │ Circle vs Axis-Aligned Box (AABB) │
├──────────────────────┼───────────────────────────────┼───────────────────────────────────┤
│ • Center delta vector│ • Clamped projection param t  │ • Voronoi Feature Regions         │
│ • Distance d = ||Δc||│ • Closest point p(t)          │ • Arvo's Clamped Closest Point    │
│ • Penetration δ=R-d  │ • Distance d = ||c - p(t)||   │ • Deep Interior Shallowest Exit   │
└──────────────────────┴───────────────────────────────┴───────────────────────────────────┘
                                              │ Exact Geometry Output
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                        THE PHYSICAL CONTACT MANIFOLD TUPLE                               │
│                                                                                          │
│   • Contact Normal n:     Unit vector perpendicular to collision interface (A -> B)      │
│   • Penetration Depth δ:  Scalar overlap distance (m) to be separated (δ ≥ 0)           │
│   • Contact Point p:      World-space coordinate where contact forces act                │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.1 The Geometry of Circle-Circle Collisions

The circular disk (and spherical ball in 3D) is the most fundamental primitive in computational physics due to its perfect radial symmetry.

### 3.1.1 Analytical Derivation of the Contact Manifold
Consider two solid circles in $\mathbb{R}^2$:
- Circle 1: Center $\mathbf{c}_1 = [c_{1, x}, c_{1, y}]^T$, radius $r_1$
- Circle 2: Center $\mathbf{c}_2 = [c_{2, x}, c_{2, y}]^T$, radius $r_2$

```
Circle-Circle Geometric Interaction

              c_1 (Circle 1)
               *─────────────┐
                \             │ r_1
                 \             │
                  \   δ   p    │
                   \ ┌───┐*────┼─────────────* c_2 (Circle 2)
                    \│   │     │            /
                     └───┴─────┘           / r_2
                         Overlapping      /
                            Zone         /
```

1. **Center Displacement Vector:**
   $$\mathbf{d}_{12} = \mathbf{c}_2 - \mathbf{c}_1 = \begin{bmatrix} c_{2, x} - c_{1, x} \\ c_{2, y} - c_{1, y} \end{bmatrix}$$
2. **Euclidean Center Distance:**
   $$d = \|\mathbf{d}_{12}\| = \sqrt{(c_{2, x} - c_{1, x})^2 + (c_{2, y} - c_{1, y})^2}$$
3. **Collision Predicate:**
   Two circles overlap if and only if:
   $$d < r_1 + r_2$$
4. **Penetration Depth ($\delta$):**
   The scalar distance by which the circles violate non-penetration:
   $$\delta = (r_1 + r_2) - d > 0$$
5. **Unit Contact Normal ($\mathbf{n}$):**
   The directed unit vector pointing from Circle 1 into Circle 2:
   $$\mathbf{n} = \frac{\mathbf{d}_{12}}{d} = \frac{\mathbf{c}_2 - \mathbf{c}_1}{\|\mathbf{c}_2 - \mathbf{c}_1\|}$$
6. **World Contact Point ($\mathbf{p}$):**
   The physical point of impact is located midway through the overlapping region along the normal axis:
   $$\mathbf{p} = \mathbf{c}_1 + \left( r_1 - \frac{\delta}{2} \right) \mathbf{n} = \mathbf{c}_2 - \left( r_2 - \frac{\delta}{2} \right) \mathbf{n}$$

### 3.1.2 The Concentric Degeneracy Singularity
A critical edge case occurs when two circle centers coincide identically:
$$\mathbf{c}_1 = \mathbf{c}_2 \implies d = \|\mathbf{c}_2 - \mathbf{c}_1\| = 0.0$$

In this state:
$$\mathbf{n} = \frac{\mathbf{0}}{0} \implies \text{Division by Zero! Produces NaN / NaN}$$
Penetration depth is maximal: $\delta = r_1 + r_2$.
To prevent an immediate engine crash, production physics engines implement a fallback branch:
```typescript
if (d < 1e-8) {
  // Arbitrary stable unit normal (e.g. vertical or horizontal thrust)
  normal = { x: 1.0, y: 0.0 };
  penetration = r1 + r2;
  contactPoint = { x: c1.x + r1, y: c1.y };
}
```

---

## 3.2 Circle vs Line Segment Narrow-Phase

In physical simulations, static arena boundaries, terrain ramps, and rigid containment barriers are modeled as collections of connected 2D directed line segments.

### 3.2.1 Parameterized Segment Formulation
A line segment $\mathcal{S}$ is defined by two endpoints $\mathbf{a}, \mathbf{b} \in \mathbb{R}^2$:
$$\mathbf{s}(t) = \mathbf{a} + t (\mathbf{b} - \mathbf{a}), \quad t \in [0, 1]$$
where $t$ is the dimensionless scalar parameter.
- $t = 0$: Endpoint $\mathbf{a}$
- $t = 1$: Endpoint $\mathbf{b}$
- $t \in (0, 1)$: Interior points along the segment

Let segment direction vector be $\mathbf{u} = \mathbf{b} - \mathbf{a}$, with squared length $L^2 = \|\mathbf{u}\|^2 = \mathbf{u} \cdot \mathbf{u}$.

### 3.2.2 Clamped Orthogonal Projection
To test collision with a circle of center $\mathbf{c}$ and radius $r$, we must find the point $\mathbf{p}^* \in \mathcal{S}$ that minimizes Euclidean distance to $\mathbf{c}$:
$$\mathbf{p}^* = \arg\min_{\mathbf{p} \in \mathcal{S}} \|\mathbf{c} - \mathbf{p}\|$$

Vector from segment start $\mathbf{a}$ to circle center $\mathbf{c}$:
$$\mathbf{v} = \mathbf{c} - \mathbf{a}$$

Projecting $\mathbf{v}$ onto segment vector $\mathbf{u}$ using the scalar dot product:
$$t_{\text{proj}} = \frac{\mathbf{v} \cdot \mathbf{u}}{\|\mathbf{u}\|^2} = \frac{(\mathbf{c} - \mathbf{a}) \cdot (\mathbf{b} - \mathbf{a})}{(\mathbf{b} - \mathbf{a}) \cdot (\mathbf{b} - \mathbf{a})}$$

Because the line segment is bounded within $t \in [0, 1]$, we apply **scalar clamping**:
$$t^* = \text{clamp}(t_{\text{proj}}, 0.0, 1.0) = \max(0.0, \, \min(1.0, t_{\text{proj}}))$$

```
Voronoi Region Decomposition for a Line Segment

    Region I (t < 0)       Region II (0 <= t <= 1)      Region III (t > 0)
    Closest to a           Closest to interior face     Closest to b
          ▲                          ▲                        ▲
          │       Normal n           │                        │
          │            ▲             │                        │
       ---*────────────┼─────────────*---
          a                          b
```

The unique closest point on the segment is:
$$\mathbf{p}^* = \mathbf{a} + t^* (\mathbf{b} - \mathbf{a})$$

Distance vector from closest point to circle center:
$$\mathbf{d} = \mathbf{c} - \mathbf{p}^*$$
$$\text{dist} = \|\mathbf{d}\| = \sqrt{d_x^2 + d_y^2}$$

### 3.2.3 Collision Predicate and Contact Manifold
1. **Overlap Condition:**
   $$\text{dist} < r$$
2. **Penetration Depth:**
   $$\delta = r - \text{dist}$$
3. **Contact Normal (pointing from Segment into Circle):**
   $$\mathbf{n} = \frac{\mathbf{c} - \mathbf{p}^*}{\text{dist}}$$
4. **Contact Point:**
   $$\mathbf{p}_{\text{contact}} = \mathbf{p}^*$$

---

## 3.3 Circle vs Axis-Aligned Bounding Box (AABB)

Testing a circular entity against an AABB is one of the most frequent geometric queries in games, robotics navigation, and discrete particle simulations.

```
Voronoi Feature Regions for an Axis-Aligned Bounding Box

      Top-Left Corner       Top Face Region        Top-Right Corner
             \                     │                     /
              \                    │                    /
               ┌───────────────────┼───────────────────┐
               │ y_max             │                   │
               │                   │                   │
  Left Face ───┼─                  │                  ─┼─── Right Face
  Region       │                   │                   │    Region
               │ y_min             │                   │
               └───────────────────┼───────────────────┘
              /                    │                    \
             /                     │                     \
    Bottom-Left Corner    Bottom Face Region    Bottom-Right Corner
```

An AABB partitioned by its boundaries forms **9 distinct Voronoi feature regions**:
- 1 Central interior region
- 4 Edge face regions (Left, Right, Bottom, Top)
- 4 Corner vertex regions (Top-Left, Top-Right, Bottom-Left, Bottom-Right)

### 3.3.1 Arvo's Clamped Closest Point Algorithm
James Arvo (1990) formulated an ultra-fast algorithm to find the closest point $\mathbf{p}^*$ on or inside an AABB to any point $\mathbf{c} \in \mathbb{R}^2$ by executing independent scalar clamping on each coordinate axis:
$$p_x^* = \text{clamp}(c_x, \min_x, \max_x) = \max(\min_x, \, \min(\max_x, c_x))$$
$$p_y^* = \text{clamp}(c_y, \min_y, \max_y) = \max(\min_y, \, \min(\max_y, c_y))$$
$$\mathbf{p}^* = \begin{bmatrix} p_x^* \\ p_y^* \end{bmatrix}$$

Vector from closest point to circle center:
$$\mathbf{d} = \mathbf{c} - \mathbf{p}^*$$
$$\text{distSq} = d_x^2 + d_y^2$$

If $\text{distSq} < r^2$, a collision exists!

### 3.3.2 Deep Penetration: The Internal Center Singularity
When the circle center $\mathbf{c}$ penetrates *inside* the interior of the AABB:
$$\min_x \le c_x \le \max_x \quad \text{and} \quad \min_y \le c_y \le \max_y$$
Applying Arvo's clamping yields:
$$p_x^* = c_x, \quad p_y^* = c_y \implies \mathbf{p}^* = \mathbf{c} \implies \mathbf{d} = \mathbf{0}$$

Here, $\|\mathbf{d}\| = 0.0$. Naively computing $\mathbf{n} = \mathbf{d}/\|\mathbf{d}\|$ triggers a division by zero!
Furthermore, the circle is trapped inside the box, so the contact normal must push the circle out along the **shallowest exit path**.

To resolve this, we compute distances from center $\mathbf{c}$ to all four faces of the AABB:
$$\Delta x_{\text{left}} = c_x - \min_x \quad (> 0)$$
$$\Delta x_{\text{right}} = \max_x - c_x \quad (> 0)$$
$$\Delta y_{\text{bottom}} = c_y - \min_y \quad (> 0)$$
$$\Delta y_{\text{top}} = \max_y - c_y \quad (> 0)$$

We locate the minimum among these four positive clearances:
$$\Delta_{\min} = \min(\Delta x_{\text{left}}, \Delta x_{\text{right}}, \Delta y_{\text{bottom}}, \Delta y_{\text{top}})$$

The shallowest exit determines the contact normal and penetration depth:
- If $\Delta_{\min} == \Delta x_{\text{left}}$:
  $$\mathbf{n} = [-1.0, 0.0]^T, \quad \delta = r + \Delta x_{\text{left}}, \quad \mathbf{p} = [\min_x, c_y]^T$$
- If $\Delta_{\min} == \Delta x_{\text{right}}$:
  $$\mathbf{n} = [+1.0, 0.0]^T, \quad \delta = r + \Delta x_{\text{right}}, \quad \mathbf{p} = [\max_x, c_y]^T$$
- If $\Delta_{\min} == \Delta y_{\text{bottom}}$:
  $$\mathbf{n} = [0.0, -1.0]^T, \quad \delta = r + \Delta y_{\text{bottom}}, \quad \mathbf{p} = [c_x, \min_y]^T$$
- If $\Delta_{\min} == \Delta y_{\text{top}}$:
  $$\mathbf{n} = [0.0, +1.0]^T, \quad \delta = r + \Delta y_{\text{top}}, \quad \mathbf{p} = [c_x, \max_y]^T$$

This guarantees that deeply penetrating entities are repelled along the path of least mechanical resistance, preventing instability and visual tunneling.

---

## 3.4 Progressive Numerical Worked Examples

---

### Worked Example 3.1: Circle-Circle Contact Manifold Generation
**Problem Statement:** In a physics engine, two colliding discs have the following parameters:
- Disc 1: Center $\mathbf{c}_1 = [2.0, 3.0]^T\text{ m}$, radius $r_1 = 1.0\text{ m}$
- Disc 2: Center $\mathbf{c}_2 = [3.2, 4.6]^T\text{ m}$, radius $r_2 = 1.5\text{ m}$
1. Calculate the center displacement vector $\mathbf{d}_{12}$ and Euclidean distance $d$.
2. Compute the sum of radii $r_{\text{sum}}$ and evaluate collision status.
3. Compute the penetration depth $\delta$.
4. Determine the unit contact normal $\mathbf{n}_{1 \to 2}$ directed from Disc 1 to Disc 2.
5. Compute the world-space contact point $\mathbf{p}_{\text{contact}}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Center displacement vector and distance.**
$$\mathbf{d}_{12} = \mathbf{c}_2 - \mathbf{c}_1 = \begin{bmatrix} 3.2 - 2.0 \\ 4.6 - 3.0 \end{bmatrix} = \begin{bmatrix} 1.20 \\ 1.60 \end{bmatrix}\text{ m}$$
$$d = \|\mathbf{d}_{12}\| = \sqrt{1.20^2 + 1.60^2} = \sqrt{1.44 + 2.56} = \sqrt{4.00} = 2.000\text{ meters}$$

**Step 2: Collision predicate evaluation.**
$$r_{\text{sum}} = r_1 + r_2 = 1.0 + 1.5 = 2.500\text{ m}$$
Because $d = 2.000\text{ m} < r_{\text{sum}} = 2.500\text{ m}$, **the discs are in active collision!**

**Step 3: Penetration depth.**
$$\delta = r_{\text{sum}} - d = 2.500 - 2.000 = 0.500\text{ meters}$$

**Step 4: Unit contact normal $\mathbf{n}_{1 \to 2}$.**
$$\mathbf{n}_{1 \to 2} = \frac{\mathbf{d}_{12}}{d} = \frac{1}{2.000} \begin{bmatrix} 1.20 \\ 1.60 \end{bmatrix} = \begin{bmatrix} 0.600 \\ 0.800 \end{bmatrix}$$
Verify unit length: $\sqrt{0.6^2 + 0.8^2} = \sqrt{0.36 + 0.64} = 1.000$.

**Step 5: World-space contact point.**
$$\mathbf{p}_{\text{contact}} = \mathbf{c}_1 + \left(r_1 - \frac{\delta}{2}\right) \mathbf{n}_{1 \to 2} = \begin{bmatrix} 2.0 \\ 3.0 \end{bmatrix} + \left(1.0 - \frac{0.50}{2}\right) \begin{bmatrix} 0.60 \\ 0.80 \end{bmatrix}$$
$$\mathbf{p}_{\text{contact}} = \begin{bmatrix} 2.0 \\ 3.0 \end{bmatrix} + 0.75 \begin{bmatrix} 0.60 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 2.0 + 0.45 \\ 3.0 + 0.60 \end{bmatrix} = \begin{bmatrix} 2.450 \\ 3.600 \end{bmatrix}\text{ m}$$
Verifying from Disc 2 side:
$$\mathbf{p}_{\text{contact}} = \mathbf{c}_2 - \left(r_2 - \frac{\delta}{2}\right) \mathbf{n} = \begin{bmatrix} 3.2 \\ 4.6 \end{bmatrix} - \left(1.5 - 0.25\right) \begin{bmatrix} 0.60 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 3.2 - 0.75 \\ 4.6 - 1.00 \end{bmatrix} = \begin{bmatrix} 2.450 \\ 3.600 \end{bmatrix}\text{ m}$$
Both formulations match to machine precision.

---

### Worked Example 3.2: Circle-Circle Concentric Singularity Resolution
**Problem Statement:** Two spawn nodes instantiate two identical spherical particles of radius $r = 0.50\text{ m}$ at the exact same coordinate:
$\mathbf{c}_1 = [10.0, 10.0]^T\text{ m}$ and $\mathbf{c}_2 = [10.0, 10.0]^T\text{ m}$.
1. Compute the distance $d$ and state the arithmetic problem that occurs if naive normalization is attempted.
2. Formulate the fallback manifold using an arbitrary horizontal resolution rule ($\mathbf{n}_{\text{fallback}} = [1, 0]^T$).
3. Compute the penetration depth and contact point.
4. If each body has mass $m = 1.0\text{ kg}$ and the engine applies linear positional separation $\Delta \mathbf{x} = \pm \frac{1}{2} \delta \mathbf{n}$, compute the separated positions $\mathbf{c}_1'$ and $\mathbf{c}_2'$.

**Step-by-Step Mathematical Solution:**

**Step 1: Distance and singularity.**
$$\mathbf{d} = \mathbf{c}_2 - \mathbf{c}_1 = [10.0 - 10.0, 10.0 - 10.0]^T = [0.0, 0.0]^T$$
$$d = \|\mathbf{d}\| = 0.0\text{ m}$$
Attempting to normalize:
$$\mathbf{n} = \frac{[0, 0]^T}{0.0} = [\text{NaN}, \text{NaN}]^T$$
This invalidates all physics matrices.

**Step 2: Fallback normal.**
The engine detects $d < 10^{-6}\text{ m}$ and activates the fallback branch:
$$\mathbf{n} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}$$

**Step 3: Penetration depth and contact point.**
$$\delta = r_1 + r_2 - d = 0.50 + 0.50 - 0.0 = 1.000\text{ meters}$$
$$\mathbf{p}_{\text{contact}} = \mathbf{c}_1 + \left(r_1 - \frac{\delta}{2}\right) \mathbf{n} = \begin{bmatrix} 10.0 \\ 10.0 \end{bmatrix} + (0.50 - 0.50) \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 10.0 \\ 10.0 \end{bmatrix}\text{ m}$$

**Step 4: Positional separation.**
$$\Delta \mathbf{x}_1 = -\frac{1}{2} \delta \mathbf{n} = -0.50 \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -0.50 \\ 0.0 \end{bmatrix}\text{ m}$$
$$\Delta \mathbf{x}_2 = +\frac{1}{2} \delta \mathbf{n} = +0.50 \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} +0.50 \\ 0.0 \end{bmatrix}\text{ m}$$
Updated centers:
$$\mathbf{c}_1' = \mathbf{c}_1 + \Delta \mathbf{x}_1 = [10.0 - 0.5, 10.0]^T = [9.50, 10.0]^T\text{ m}$$
$$\mathbf{c}_2' = \mathbf{c}_2 + \Delta \mathbf{x}_2 = [10.0 + 0.5, 10.0]^T = [10.50, 10.0]^T\text{ m}$$
New separation distance: $\|\mathbf{c}_2' - \mathbf{c}_1'\| = 10.50 - 9.50 = 1.000\text{ m} \equiv r_1 + r_2$.
The singularity is resolved smoothly without numerical collapse.

---

### Worked Example 3.3: Point-to-Segment Projection and Clamping
**Problem Statement:** A containment wall is represented by line segment from $\mathbf{a} = [1.0, 1.0]^T\text{ m}$ to $\mathbf{b} = [7.0, 4.0]^T\text{ m}$.
A ball of radius $r = 1.20\text{ m}$ has center at $\mathbf{c} = [3.0, 6.0]^T\text{ m}$.
1. Compute the segment direction vector $\mathbf{u} = \mathbf{b} - \mathbf{a}$ and its squared length $\|\mathbf{u}\|^2$.
2. Compute the vector $\mathbf{v} = \mathbf{c} - \mathbf{a}$ and the unconstrained projection parameter $t_{\text{proj}}$.
3. Clamp $t_{\text{proj}}$ to find $t^*$ and the closest point $\mathbf{p}^*$ on the segment.
4. Calculate the Euclidean distance $d = \|\mathbf{c} - \mathbf{p}^*\|$.
5. Determine whether the ball collides with the wall segment, and if so, calculate penetration depth $\delta$ and normal $\mathbf{n}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Segment direction vector.**
$$\mathbf{u} = \mathbf{b} - \mathbf{a} = \begin{bmatrix} 7.0 - 1.0 \\ 4.0 - 1.0 \end{bmatrix} = \begin{bmatrix} 6.00 \\ 3.00 \end{bmatrix}\text{ m}$$
$$\|\mathbf{u}\|^2 = u_x^2 + u_y^2 = 6.0^2 + 3.0^2 = 36.0 + 9.0 = 45.00\text{ m}^2$$

**Step 2: Vector $\mathbf{v}$ and unconstrained projection parameter.**
$$\mathbf{v} = \mathbf{c} - \mathbf{a} = \begin{bmatrix} 3.0 - 1.0 \\ 6.0 - 1.0 \end{bmatrix} = \begin{bmatrix} 2.00 \\ 5.00 \end{bmatrix}\text{ m}$$
$$\mathbf{v} \cdot \mathbf{u} = (2.0)(6.0) + (5.0)(3.0) = 12.0 + 15.0 = 27.00\text{ m}^2$$
$$t_{\text{proj}} = \frac{\mathbf{v} \cdot \mathbf{u}}{\|\mathbf{u}\|^2} = \frac{27.00}{45.00} = 0.600$$

**Step 3: Clamping and closest point.**
Since $0.0 \le 0.600 \le 1.0$, $t^* = 0.600$ (falls squarely on the interior face, Region II).
$$\mathbf{p}^* = \mathbf{a} + t^* \mathbf{u} = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix} + 0.600 \begin{bmatrix} 6.0 \\ 3.0 \end{bmatrix} = \begin{bmatrix} 1.0 + 3.60 \\ 1.0 + 1.80 \end{bmatrix} = \begin{bmatrix} 4.600 \\ 2.800 \end{bmatrix}\text{ m}$$

**Step 4: Distance calculation.**
Distance vector from $\mathbf{p}^*$ to circle center $\mathbf{c}$:
$$\mathbf{d} = \mathbf{c} - \mathbf{p}^* = \begin{bmatrix} 3.00 - 4.600 \\ 6.00 - 2.800 \end{bmatrix} = \begin{bmatrix} -1.600 \\ +3.200 \end{bmatrix}\text{ m}$$
$$d^2 = (-1.60)^2 + (3.20)^2 = 2.56 + 10.24 = 12.80\text{ m}^2$$
$$d = \sqrt{12.80} \approx 3.5777\text{ meters}$$

**Step 5: Collision status.**
Ball radius is $r = 1.20\text{ m}$.
Because $d = 3.5777\text{ m} > r = 1.20\text{ m}$, **the ball DOES NOT collide with the segment.**
Separation distance is $3.5777 - 1.20 = 2.378\text{ meters}$.

---

### Worked Example 3.4: Circle-to-Segment Endpoint Corner Collision
**Problem Statement:** For the same segment ($\mathbf{a} = [1, 1]^T, \mathbf{b} = [7, 4]^T$), suppose the ball of radius $r = 1.20\text{ m}$ is located at $\mathbf{c} = [8.0, 5.0]^T\text{ m}$ (near endpoint $\mathbf{b}$).
1. Compute the unconstrained projection parameter $t_{\text{proj}}$.
2. Apply clamping and state which Voronoi region contains the closest point.
3. Compute the closest point $\mathbf{p}^*$ and distance $d$.
4. Evaluate collision status and compute the contact manifold tuple $(\mathbf{n}, \delta, \mathbf{p}_{\text{contact}})$.

**Step-by-Step Mathematical Solution:**

**Step 1: Projection parameter.**
$$\mathbf{u} = [6.0, 3.0]^T, \quad \|\mathbf{u}\|^2 = 45.0$$
$$\mathbf{v} = \mathbf{c} - \mathbf{a} = \begin{bmatrix} 8.0 - 1.0 \\ 5.0 - 1.0 \end{bmatrix} = \begin{bmatrix} 7.0 \\ 4.0 \end{bmatrix}\text{ m}$$
$$\mathbf{v} \cdot \mathbf{u} = (7.0)(6.0) + (4.0)(3.0) = 42.0 + 12.0 = 54.0$$
$$t_{\text{proj}} = \frac{54.0}{45.0} = 1.200$$

**Step 2: Clamping and Voronoi feature.**
Because $t_{\text{proj}} = 1.200 > 1.0$, the projection overshoots past the end of the segment!
$$t^* = \text{clamp}(1.200, 0.0, 1.0) = 1.000$$
The closest feature is **Endpoint $\mathbf{b}$ (Region III)**.

**Step 3: Closest point and distance.**
$$\mathbf{p}^* = \mathbf{a} + 1.0(\mathbf{u}) = \mathbf{b} = \begin{bmatrix} 7.000 \\ 4.000 \end{bmatrix}\text{ m}$$
Distance vector:
$$\mathbf{d} = \mathbf{c} - \mathbf{p}^* = \begin{bmatrix} 8.0 - 7.0 \\ 5.0 - 4.0 \end{bmatrix} = \begin{bmatrix} 1.000 \\ 1.000 \end{bmatrix}\text{ m}$$
$$d = \sqrt{1.0^2 + 1.0^2} = \sqrt{2.0} \approx 1.4142\text{ meters}$$

**Step 4: Collision status and manifold.**
Radius $r = 1.20\text{ m}$.
$d = 1.4142\text{ m} > 1.20\text{ m} \implies$ Still outside by $0.214\text{ m}$.
Now suppose the ball moves slightly closer to $\mathbf{c} = [7.6, 4.8]^T\text{ m}$:
$$\mathbf{d}' = [7.6 - 7.0, 4.8 - 4.0]^T = [0.60, 0.80]^T\text{ m}$$
$$d' = \sqrt{0.6^2 + 0.8^2} = 1.000\text{ m} < r = 1.20\text{ m} \quad (\text{COLLISION!})$$
Manifold for $\mathbf{c} = [7.6, 4.8]^T$:
- Penetration: $\delta = 1.20 - 1.00 = 0.200\text{ m}$.
- Contact normal: $\mathbf{n} = \frac{[0.6, 0.8]^T}{1.0} = [0.60, 0.80]^T$.
- Contact point: $\mathbf{p}_{\text{contact}} = \mathbf{p}^* = \mathbf{b} = [7.00, 4.00]^T\text{ m}$.

---

### Worked Example 3.5: Circle-AABB External Face Collision
**Problem Statement:** An AABB is fixed at $\mathbf{min} = [0.0, 0.0]^T\text{ m}$ and $\mathbf{max} = [4.0, 3.0]^T\text{ m}$.
A circle of radius $r = 1.0\text{ m}$ has center $\mathbf{c} = [4.50, 1.80]^T\text{ m}$.
1. Use Arvo's algorithm to compute the closest point $\mathbf{p}^*$ on the AABB.
2. Identify which Voronoi feature region contains $\mathbf{p}^*$ (edge vs corner).
3. Compute distance vector $\mathbf{d}$ and distance magnitude $d$.
4. Determine penetration depth $\delta$, contact normal $\mathbf{n}$, and contact point.

**Step-by-Step Mathematical Solution:**

**Step 1: Arvo's clamped closest point.**
$$p_x^* = \text{clamp}(c_x, \min_x, \max_x) = \text{clamp}(4.50, 0.0, 4.0) = 4.00\text{ m}$$
$$p_y^* = \text{clamp}(c_y, \min_y, \max_y) = \text{clamp}(1.80, 0.0, 3.0) = 1.80\text{ m}$$
$$\mathbf{p}^* = \begin{bmatrix} 4.00 \\ 1.80 \end{bmatrix}\text{ m}$$

**Step 2: Voronoi feature identification.**
$p_x^* = 4.00 = \max_x$ (on the right boundary), while $p_y^* = 1.80$ lies strictly between $\min_y$ and $\max_y$ ($0.0 < 1.80 < 3.0$).
This is the **Right Vertical Face Region**.

**Step 3: Distance calculation.**
$$\mathbf{d} = \mathbf{c} - \mathbf{p}^* = \begin{bmatrix} 4.50 - 4.00 \\ 1.80 - 1.80 \end{bmatrix} = \begin{bmatrix} 0.500 \\ 0.000 \end{bmatrix}\text{ m}$$
$$d = \|\mathbf{d}\| = 0.500\text{ meters}$$

**Step 4: Contact manifold.**
Because $d = 0.500\text{ m} < r = 1.000\text{ m}$, collision is active!
- Penetration depth:
  $$\delta = r - d = 1.000 - 0.500 = 0.500\text{ meters}$$
- Contact normal (pointing from AABB into Circle):
  $$\mathbf{n} = \frac{\mathbf{d}}{d} = \frac{[0.50, 0.0]^T}{0.50} = \begin{bmatrix} 1.000 \\ 0.000 \end{bmatrix}$$
- Contact point:
  $$\mathbf{p}_{\text{contact}} = \mathbf{p}^* = \begin{bmatrix} 4.000 \\ 1.800 \end{bmatrix}\text{ m}$$

---

### Worked Example 3.6: Circle-AABB Corner Vertex Collision
**Problem Statement:** For the same AABB ($\mathbf{min} = [0, 0]^T, \mathbf{max} = [4, 3]^T$), the circle of radius $r = 1.0\text{ m}$ is at center $\mathbf{c} = [4.60, 3.80]^T\text{ m}$ (near the top-right corner).
1. Compute the closest point $\mathbf{p}^*$ on the AABB using Arvo's clamp.
2. Confirm that $\mathbf{p}^*$ is the top-right corner vertex.
3. Compute distance vector $\mathbf{d}$ and magnitude $d$.
4. Evaluate collision and generate the contact manifold.

**Step-by-Step Mathematical Solution:**

**Step 1: Clamped projection.**
$$p_x^* = \text{clamp}(4.60, 0.0, 4.0) = 4.00\text{ m}$$
$$p_y^* = \text{clamp}(3.80, 0.0, 3.0) = 3.00\text{ m}$$
$$\mathbf{p}^* = \begin{bmatrix} 4.00 \\ 3.00 \end{bmatrix}\text{ m}$$

**Step 2: Feature verification.**
$p_x^* = \max_x$ and $p_y^* = \max_y$. $\mathbf{p}^*$ is exactly the **Top-Right Corner Vertex**.

**Step 3: Distance calculation.**
$$\mathbf{d} = \mathbf{c} - \mathbf{p}^* = \begin{bmatrix} 4.60 - 4.00 \\ 3.80 - 3.00 \end{bmatrix} = \begin{bmatrix} 0.600 \\ 0.800 \end{bmatrix}\text{ m}$$
$$d = \sqrt{0.60^2 + 0.80^2} = \sqrt{0.36 + 0.64} = \sqrt{1.00} = 1.000\text{ meter}$$

**Step 4: Collision manifold.**
With $r = 1.0\text{ m}$ and $d = 1.000\text{ m}$:
$$\delta = r - d = 1.000 - 1.000 = 0.000\text{ m}$$
The circle is grazing the corner in exact point-contact.
If the center moves $0.10\text{ m}$ closer along the diagonal to $\mathbf{c} = [4.54, 3.72]^T$:
$$\mathbf{d}' = [0.54, 0.72]^T \implies d' = \sqrt{0.54^2 + 0.72^2} = 0.900\text{ m}$$
$$\delta = 1.000 - 0.900 = 0.100\text{ m}$$
$$\mathbf{n} = \frac{[0.54, 0.72]^T}{0.90} = \begin{bmatrix} 0.600 \\ 0.800 \end{bmatrix}$$
$$\mathbf{p}_{\text{contact}} = [4.000, 3.000]^T\text{ m}$$

---

### Worked Example 3.7: Circle-AABB Deep Internal Penetration Resolution
**Problem Statement:** Due to a high-speed physics tunneling step, a ball of radius $r = 1.0\text{ m}$ has its center trapped deeply inside an AABB:
$\mathbf{min} = [0.0, 0.0]^T\text{ m}, \mathbf{max} = [10.0, 6.0]^T\text{ m}$, circle center $\mathbf{c} = [2.0, 4.5]^T\text{ m}$.
1. Show that Arvo's clamp returns $\mathbf{p}^* = \mathbf{c}$ and $\mathbf{d} = \mathbf{0}$.
2. Compute the distances from $\mathbf{c}$ to all four faces of the AABB.
3. Identify the shallowest exit face.
4. Construct the correct contact normal $\mathbf{n}$, penetration depth $\delta$, and contact point $\mathbf{p}_{\text{contact}}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Failure of standard clamp inside.**
$$p_x^* = \text{clamp}(2.0, 0.0, 10.0) = 2.0\text{ m}$$
$$p_y^* = \text{clamp}(4.5, 0.0, 6.0) = 4.5\text{ m}$$
$$\mathbf{p}^* = [2.0, 4.5]^T \implies \mathbf{d} = \mathbf{c} - \mathbf{p}^* = [0.0, 0.0]^T \implies \|\mathbf{d}\| = 0$$

**Step 2: Distances to four faces.**
- Left face ($x = 0.0$): $\Delta x_{\text{left}} = c_x - \min_x = 2.0 - 0.0 = 2.00\text{ m}$
- Right face ($x = 10.0$): $\Delta x_{\text{right}} = \max_x - c_x = 10.0 - 2.0 = 8.00\text{ m}$
- Bottom face ($y = 0.0$): $\Delta y_{\text{bottom}} = c_y - \min_y = 4.5 - 0.0 = 4.50\text{ m}$
- Top face ($y = 6.0$): $\Delta y_{\text{top}} = \max_y - c_y = 6.0 - 4.5 = 1.50\text{ m}$

**Step 3: Shallowest exit identification.**
Comparing distances:
$$\Delta_{\min} = \min(2.00, 8.00, 4.50, 1.50) = 1.50\text{ m} \quad (\text{Top Face!})$$
The circle is closest to the top boundary ($y = 6.0$).

**Step 4: Contact manifold generation.**
- To push the ball upward out of the box through the top face, the normal pointing from the box into the ball is directed in the positive $y$-direction:
  $$\mathbf{n} = \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix}$$
- Penetration depth must include both the radius and the distance to the boundary:
  $$\delta = r + \Delta_{\min} = 1.0 + 1.50 = 2.500\text{ meters}$$
- Contact point on the top face:
  $$\mathbf{p}_{\text{contact}} = \begin{bmatrix} c_x \\ \max_y \end{bmatrix} = \begin{bmatrix} 2.000 \\ 6.000 \end{bmatrix}\text{ m}$$
Applying positional correction $\Delta \mathbf{y} = +\delta \mathbf{n} = [0, 2.5]^T$ shifts the center to $\mathbf{c}' = [2.0, 4.5 + 2.5]^T = [2.0, 7.0]^T$, placing the bottom edge of the ball at $y = 6.0$, resting cleanly on top of the AABB!

---

### Worked Example 3.8: Circle vs 2D Infinite Plane
**Problem Statement:** A 2D flat incline is modeled by an infinite line passing through point $\mathbf{p}_0 = [0.0, 2.0]^T\text{ m}$ with unit normal $\hat{\mathbf{n}} = [0.60, 0.80]^T$.
A ball of radius $r = 0.80\text{ m}$ has center $\mathbf{c} = [3.0, 4.0]^T\text{ m}$.
1. Formulate the signed distance function $h(\mathbf{c}) = (\mathbf{c} - \mathbf{p}_0) \cdot \hat{\mathbf{n}}$.
2. Compute $h(\mathbf{c})$ and interpret its sign.
3. Check whether the ball collides with the plane, and compute penetration depth $\delta$.
4. Find the exact contact point $\mathbf{p}_{\text{contact}}$ on the plane.

**Step-by-Step Mathematical Solution:**

**Step 1: Signed distance function.**
$$\mathbf{v} = \mathbf{c} - \mathbf{p}_0 = \begin{bmatrix} 3.0 - 0.0 \\ 4.0 - 2.0 \end{bmatrix} = \begin{bmatrix} 3.0 \\ 2.0 \end{bmatrix}\text{ m}$$
$$h(\mathbf{c}) = \mathbf{v} \cdot \hat{\mathbf{n}} = (3.0)(0.60) + (2.0)(0.80) = 1.80 + 1.60 = +3.400\text{ meters}$$

**Step 2: Sign interpretation.**
Because $h(\mathbf{c}) = +3.400\text{ m} > 0$, the circle center lies on the positive half-space (the "outside" front of the plane) at perpendicular distance $3.40\text{ m}$.

**Step 3: Collision check.**
Collision requires $h(\mathbf{c}) < r$:
$$3.400\text{ m} < 0.800\text{ m} \quad (\text{FALSE! No collision.})$$
Now suppose the ball rolls down to $\mathbf{c}' = [1.0, 2.0]^T\text{ m}$:
$$\mathbf{v}' = [1.0 - 0.0, 2.0 - 2.0]^T = [1.0, 0.0]^T\text{ m}$$
$$h(\mathbf{c}') = [1.0, 0.0] \cdot [0.60, 0.80]^T = 0.600\text{ meters}$$
Here $h(\mathbf{c}') = 0.600\text{ m} < r = 0.800\text{ m} \implies$ **Collision!**
Penetration depth:
$$\delta = r - h(\mathbf{c}') = 0.800 - 0.600 = 0.200\text{ meters}$$

**Step 4: Contact point on plane.**
Projecting center directly down along the negative normal:
$$\mathbf{p}_{\text{contact}} = \mathbf{c}' - h(\mathbf{c}') \hat{\mathbf{n}} = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} - 0.600 \begin{bmatrix} 0.60 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 1.0 - 0.36 \\ 2.0 - 0.48 \end{bmatrix} = \begin{bmatrix} 0.640 \\ 1.520 \end{bmatrix}\text{ m}$$

---

### Worked Example 3.9: Segment-Segment Intersection via 2D Cross Products
**Problem Statement:** Two moving rods in a mechanical linkage are modeled as line segments:
- Segment 1: $\mathbf{a}_1 = [1.0, 1.0]^T, \mathbf{b}_1 = [7.0, 5.0]^T$
- Segment 2: $\mathbf{a}_2 = [2.0, 6.0]^T, \mathbf{b}_2 = [5.0, 0.0]^T$
1. Formulate the 2D cross product operator $\mathbf{u} \times \mathbf{v} = u_x v_y - u_y v_x$.
2. Formulate the parametric ray-segment intersection equations.
3. Compute parameters $t$ and $u$.
4. Determine if the segments intersect, and compute the intersection point $\mathbf{p}_{\text{int}}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Direction vectors.**
$$\mathbf{r} = \mathbf{b}_1 - \mathbf{a}_1 = [7.0 - 1.0, 5.0 - 1.0]^T = [6.0, 4.0]^T\text{ m}$$
$$\mathbf{s} = \mathbf{b}_2 - \mathbf{a}_2 = [5.0 - 2.0, 0.0 - 6.0]^T = [3.0, -6.0]^T\text{ m}$$
$$\mathbf{a}_2 - \mathbf{a}_1 = [2.0 - 1.0, 6.0 - 1.0]^T = [1.0, 5.0]^T\text{ m}$$

**Step 2: Cross products.**
$$\mathbf{r} \times \mathbf{s} = r_x s_y - r_y s_x = (6.0)(-6.0) - (4.0)(3.0) = -36.0 - 12.0 = -48.00$$
$$(\mathbf{a}_2 - \mathbf{a}_1) \times \mathbf{s} = (1.0)(-6.0) - (5.0)(3.0) = -6.0 - 15.0 = -21.00$$
$$(\mathbf{a}_2 - \mathbf{a}_1) \times \mathbf{r} = (1.0)(4.0) - (5.0)(6.0) = 4.0 - 30.0 = -26.00$$

**Step 3: Parametric solutions $t$ and $u$.**
$$t = \frac{(\mathbf{a}_2 - \mathbf{a}_1) \times \mathbf{s}}{\mathbf{r} \times \mathbf{s}} = \frac{-21.00}{-48.00} = \frac{7}{16} = 0.4375$$
$$u = \frac{(\mathbf{a}_2 - \mathbf{a}_1) \times \mathbf{r}}{\mathbf{r} \times \mathbf{s}} = \frac{-26.00}{-48.00} = \frac{13}{24} \approx 0.54167$$

**Step 4: Intersection check and point.**
Segments intersect if and only if $0 \le t \le 1$ and $0 \le u \le 1$:
$$0.4375 \in [0, 1] \quad (\text{TRUE})$$
$$0.54167 \in [0, 1] \quad (\text{TRUE})$$
**The two segments intersect!**
Intersection point:
$$\mathbf{p}_{\text{int}} = \mathbf{a}_1 + t \mathbf{r} = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix} + 0.4375 \begin{bmatrix} 6.0 \\ 4.0 \end{bmatrix} = \begin{bmatrix} 1.0 + 2.625 \\ 1.0 + 1.750 \end{bmatrix} = \begin{bmatrix} 3.625 \\ 2.750 \end{bmatrix}\text{ m}$$

---

### Worked Example 3.10: Complete Boundary Contact Solver Trace
**Problem Statement:** A billiard ball of radius $r = 0.20\text{ m}$ is bouncing inside a table enclosed by four boundary segments:
- Floor: $[0, 0]^T$ to $[10, 0]^T$
- Right wall: $[10, 0]^T$ to $[10, 6]^T$
- Ceiling: $[10, 6]^T$ to $[0, 6]^T$
- Left wall: $[0, 6]^T$ to $[0, 0]^T$

Current ball center is at $\mathbf{c} = [0.12, 5.85]^T\text{ m}$ (in the top-left corner).
1. Test collision against all 4 boundary walls.
2. Identify all active collisions and generate their contact manifolds.
3. Compute the combined positional correction to restore the ball inside the legal playfield.

**Step-by-Step Mathematical Solution:**

**Step 1: Distance queries to 4 walls.**
- **Left wall ($x = 0$):**
  $d_x = c_x - 0 = 0.12\text{ m}$.
  Since $d_x = 0.12\text{ m} < r = 0.20\text{ m}$, **Collision active!**
  Penetration: $\delta_{\text{left}} = 0.20 - 0.12 = 0.080\text{ m} = 8.0\text{ cm}$.
  Normal (pushing right): $\mathbf{n}_{\text{left}} = [1.0, 0.0]^T$.

- **Ceiling ($y = 6$):**
  $d_y = 6.0 - c_y = 6.0 - 5.85 = 0.15\text{ m}$.
  Since $d_y = 0.15\text{ m} < r = 0.20\text{ m}$, **Collision active!**
  Penetration: $\delta_{\text{top}} = 0.20 - 0.15 = 0.050\text{ m} = 5.0\text{ cm}$.
  Normal (pushing down): $\mathbf{n}_{\text{top}} = [0.0, -1.0]^T$.

- **Floor ($y = 0$):**
  $d_y = 5.85 - 0 = 5.85\text{ m} \gg 0.20\text{ m}$ (Clear).
- **Right wall ($x = 10$):**
  $d_x = 10.0 - 0.12 = 9.88\text{ m} \gg 0.20\text{ m}$ (Clear).

**Step 2: Active contact manifolds.**
1. Manifold 1 (Left wall): Normal $\mathbf{n}_1 = [1, 0]^T$, Penetration $\delta_1 = 0.080\text{ m}$, Point $\mathbf{p}_1 = [0.0, 5.85]^T$.
2. Manifold 2 (Ceiling): Normal $\mathbf{n}_2 = [0, -1]^T$, Penetration $\delta_2 = 0.050\text{ m}$, Point $\mathbf{p}_2 = [0.12, 6.0]^T$.

**Step 3: Combined positional correction.**
The ball must be pushed simultaneously out of both the left wall and the ceiling:
$$\Delta \mathbf{c} = \delta_1 \mathbf{n}_1 + \delta_2 \mathbf{n}_2 = 0.080 \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} + 0.050 \begin{bmatrix} 0.0 \\ -1.0 \end{bmatrix} = \begin{bmatrix} +0.080 \\ -0.050 \end{bmatrix}\text{ m}$$
Corrected center:
$$\mathbf{c}' = \mathbf{c} + \Delta \mathbf{c} = \begin{bmatrix} 0.12 + 0.080 \\ 5.85 - 0.050 \end{bmatrix} = \begin{bmatrix} 0.200 \\ 5.800 \end{bmatrix}\text{ m}$$
At new center $\mathbf{c}' = [0.20, 5.80]^T$, distance to left wall is $0.20\text{ m} \equiv r$, and distance to ceiling is $6.0 - 5.80 = 0.20\text{ m} \equiv r$. The ball sits in perfect tangential corner contact.

---

## 3.5 Chapter Mastery Exercises

### Exercise 3.1 (Tier 1): Contact Normal Inversion
Two circles $A$ and $B$ collide. Prove that the contact normal pointing from $A$ to $B$ ($\mathbf{n}_{A \to B}$) is the exact negation of the contact normal pointing from $B$ to $A$ ($\mathbf{n}_{B \to A}$).

### Exercise 3.2 (Tier 1): Concentric Circles with Unequal Radii
Circle 1 has center $[0, 0]$ and radius $r_1 = 3.0\text{ m}$. Circle 2 has center $[0, 0]$ and radius $r_2 = 1.0\text{ m}$. Calculate the penetration depth $\delta$.

### Exercise 3.3 (Tier 2): Projection Beyond Segment
A line segment runs from $\mathbf{a} = [0, 0]^T$ to $\mathbf{b} = [4, 0]^T$. A circle center is at $\mathbf{c} = [-2, 3]^T$. Compute $t_{\text{proj}}$, $t^*$, and the closest point $\mathbf{p}^*$.

### Exercise 3.4 (Tier 2): Circle Touching AABB Edge
An AABB has $\mathbf{min} = [2, 2]^T, \mathbf{max} = [6, 8]^T$. A circle of radius $r = 1.5\text{ m}$ has center at $\mathbf{c} = [0.5, 5.0]^T$.
1. Compute the closest point on the AABB.
2. Determine if the circle touches or overlaps the AABB.

### Exercise 3.5 (Tier 3): Arvo's Algorithm on Diagonal Corner
An AABB has $\mathbf{min} = [0, 0]^T, \mathbf{max} = [2, 2]^T$. A circle with radius $r = 1.0\text{ m}$ is at center $\mathbf{c} = [2.5, 2.5]^T$.
Calculate the penetration depth $\delta$ and unit contact normal $\mathbf{n}$.

### Exercise 3.6 (Tier 3): Perpendicular Distance to a Line
Derive the standard formula for the perpendicular distance from point $\mathbf{c} = [c_x, c_y]^T$ to the line $A x + B y + C = 0$ using vector dot products.

### Exercise 3.7 (Tier 4): Deep AABB Penetration Tie-Breaker
A circle of radius $r = 1.0\text{ m}$ is placed at the exact geometric center of a square AABB $\mathbf{min} = [0, 0]^T, \mathbf{max} = [4, 4]^T$ so that $\mathbf{c} = [2.0, 2.0]^T$.
1. Compute the clearances to all four faces.
2. Explain how a simulation engine breaks the 4-way tie deterministically.

### Exercise 3.8 (Tier 4): Continuous Circle-Line Intersection Time
A circle of radius $r = 0.5\text{ m}$ starts at $\mathbf{c}_0 = [0, 2]^T$ with velocity $\mathbf{v} = [4, -3]^T\text{ m/s}$. It travels toward the horizontal floor $y = 0$.
Calculate the exact Time-of-Impact (TOI) $t^*$ when the circle first touches the floor.

### Exercise 3.9 (Tier 5): Deriving the Circle-Segment Normal Continuity
Prove that as a circle slides from the interior face of a line segment into the endpoint Voronoi corner region, the contact normal $\mathbf{n}(t)$ varies continuously without jumping discontinuously.

### Exercise 3.10 (Tier 5): The Capsule-to-Capsule Distance Metric
Formulate the distance algorithm between two line segments $\mathcal{S}_1(\mathbf{a}_1, \mathbf{b}_1)$ and $\mathcal{S}_2(\mathbf{a}_2, \mathbf{b}_2)$ to perform narrow-phase collision detection between two 2D capsules of radii $r_1$ and $r_2$.

---

## 3.6 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 3.1
Let Circle A have center $\mathbf{c}_A$ and Circle B have center $\mathbf{c}_B$.
The normal pointing from $A$ into $B$ is:
$$\mathbf{n}_{A \to B} = \frac{\mathbf{c}_B - \mathbf{c}_A}{\|\mathbf{c}_B - \mathbf{c}_A\|}$$
The normal pointing from $B$ into $A$ is:
$$\mathbf{n}_{B \to A} = \frac{\mathbf{c}_A - \mathbf{c}_B}{\|\mathbf{c}_A - \mathbf{c}_B\|} = \frac{-(\mathbf{c}_B - \mathbf{c}_A)}{\|\mathbf{c}_B - \mathbf{c}_A\|} = -\mathbf{n}_{A \to B}$$
This directly satisfies Newton's third law ($\mathbf{F}_{BA} = -\mathbf{F}_{AB}$). $\blacksquare$

---

### Solution to Exercise 3.2
Centers coincide: $\mathbf{c}_1 = \mathbf{c}_2 = [0, 0]^T \implies d = 0.0\text{ m}$.
Penetration depth:
$$\delta = (r_1 + r_2) - d = (3.0 + 1.0) - 0.0 = 4.00\text{ meters}$$

---

### Solution to Exercise 3.3
Segment: $\mathbf{a} = [0, 0]^T, \mathbf{b} = [4, 0]^T \implies \mathbf{u} = [4, 0]^T, \|\mathbf{u}\|^2 = 16.0$.
Circle center: $\mathbf{c} = [-2, 3]^T \implies \mathbf{v} = \mathbf{c} - \mathbf{a} = [-2, 3]^T$.
$$t_{\text{proj}} = \frac{\mathbf{v} \cdot \mathbf{u}}{\|\mathbf{u}\|^2} = \frac{(-2)(4) + (3)(0)}{16.0} = \frac{-8.0}{16.0} = -0.50$$
Clamping to $[0, 1]$:
$$t^* = \text{clamp}(-0.50, 0.0, 1.0) = 0.00$$
Closest point: $\mathbf{p}^* = \mathbf{a} = [0.0, 0.0]^T$.

---

### Solution to Exercise 3.4
AABB: $\mathbf{min} = [2, 2], \mathbf{max} = [6, 8]$. Circle: $\mathbf{c} = [0.5, 5.0], r = 1.5$.
1. **Closest point $\mathbf{p}^*$:**
   $$p_x^* = \text{clamp}(0.5, 2.0, 6.0) = 2.0\text{ m}$$
   $$p_y^* = \text{clamp}(5.0, 2.0, 8.0) = 5.0\text{ m}$$
   $$\mathbf{p}^* = [2.0, 5.0]^T\text{ m}$$
2. **Overlap check:**
   $$\mathbf{d} = \mathbf{c} - \mathbf{p}^* = [0.5 - 2.0, 5.0 - 5.0]^T = [-1.5, 0.0]^T\text{ m}$$
   $$d = \|\mathbf{d}\| = 1.50\text{ m}$$
   Since $d = 1.50\text{ m} \equiv r = 1.50\text{ m}$, the circle touches the left edge at point $[2.0, 5.0]^T$ with zero penetration ($\delta = 0.0$).

---

### Solution to Exercise 3.5
AABB: $\mathbf{min} = [0, 0], \mathbf{max} = [2, 2]$. Circle: $\mathbf{c} = [2.5, 2.5], r = 1.0$.
1. **Closest point:**
   $$p_x^* = \text{clamp}(2.5, 0.0, 2.0) = 2.0\text{ m}$$
   $$p_y^* = \text{clamp}(2.5, 0.0, 2.0) = 2.0\text{ m} \implies \mathbf{p}^* = [2.0, 2.0]^T\text{ m}$$
2. **Distance vector:**
   $$\mathbf{d} = \mathbf{c} - \mathbf{p}^* = [2.5 - 2.0, 2.5 - 2.0]^T = [0.50, 0.50]^T\text{ m}$$
   $$d = \sqrt{0.50^2 + 0.50^2} = \sqrt{0.25 + 0.25} = \sqrt{0.50} \approx 0.707107\text{ m}$$
3. **Penetration and normal:**
   $$\delta = r - d = 1.000000 - 0.707107 \approx 0.292893\text{ m} \approx 0.293\text{ m}$$
   $$\mathbf{n} = \frac{\mathbf{d}}{d} = \frac{[0.50, 0.50]^T}{\sqrt{0.50}} = \begin{bmatrix} \frac{\sqrt{2}}{2} \\ \frac{\sqrt{2}}{2} \end{bmatrix} \approx \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix}$$

---

### Solution to Exercise 3.6
The implicit line equation is $A x + B y + C = 0$.
The normal vector to the line is $\mathbf{N} = [A, B]^T$, with unit normal $\hat{\mathbf{n}} = \frac{[A, B]^T}{\sqrt{A^2 + B^2}}$.
Any point $\mathbf{p}_0 = [x_0, y_0]^T$ on the line satisfies $A x_0 + B y_0 + C = 0 \implies A x_0 + B y_0 = -C$.
The perpendicular distance from point $\mathbf{c} = [c_x, c_y]^T$ to the line is the magnitude of the projection of $(\mathbf{c} - \mathbf{p}_0)$ onto $\hat{\mathbf{n}}$:
$$d = |(\mathbf{c} - \mathbf{p}_0) \cdot \hat{\mathbf{n}}| = \left| (c_x - x_0) \frac{A}{\sqrt{A^2 + B^2}} + (c_y - y_0) \frac{B}{\sqrt{A^2 + B^2}} \right|$$
$$= \frac{|A c_x + B c_y - (A x_0 + B y_0)|}{\sqrt{A^2 + B^2}} = \frac{|A c_x + B c_y - (-C)|}{\sqrt{A^2 + B^2}} = \frac{|A c_x + B c_y + C|}{\sqrt{A^2 + B^2}}$$
This is the standard distance formula derived via vector projection. $\blacksquare$

---

### Solution to Exercise 3.7
1. **Clearances to four faces:**
   - Left ($x=0$): $\Delta x_L = 2.0 - 0 = 2.0\text{ m}$
   - Right ($x=4$): $\Delta x_R = 4 - 2.0 = 2.0\text{ m}$
   - Bottom ($y=0$): $\Delta y_B = 2.0 - 0 = 2.0\text{ m}$
   - Top ($y=4$): $\Delta y_T = 4 - 2.0 = 2.0\text{ m}$
   All four clearances are identical ($\Delta_{\min} = 2.0\text{ m}$).
2. **Deterministic tie-breaking:**
   A physics engine must avoid non-deterministic behavior that depends on floating-point jitter. It employs a strict hierarchical precedence rule:
   `if (left <= right && left <= bottom && left <= top) choose left;`
   By convention, ties are broken in favor of vertical gravity opposition (pushing upward $+y$) or along the dominant axis of velocity $-\mathbf{v}$.

---

### Solution to Exercise 3.8
Floor equation: $y = 0$.
The bottom edge of the circle is at $y_{\text{bottom}}(t) = y(t) - r = c_y(t) - 0.5$.
Continuous motion:
$$c_y(t) = c_{y, 0} + v_y t = 2.0 - 3.0 t$$
Touchdown occurs when $y_{\text{bottom}}(t^*) = 0$:
$$c_y(t^*) - 0.5 = 0 \implies 2.0 - 3.0 t^* - 0.5 = 0$$
$$1.5 - 3.0 t^* = 0 \implies 3.0 t^* = 1.5 \implies t^* = \frac{1.5}{3.0} = 0.500\text{ seconds}$$
At $t^* = 0.50\text{ s}$, the circle touches the floor at $x = 0 + 4(0.50) = 2.0\text{ m}$.

---

### Solution to Exercise 3.9
Let segment be along $x$-axis from $[0, 0]$ to $[L, 0]$.
1. For $0 \le x \le L$ (interior face), closest point is $\mathbf{p}^*(x) = [x, 0]^T$.
   Vector $\mathbf{d} = [x, y]^T - [x, 0]^T = [0, y]^T$.
   Unit normal is $\mathbf{n}(x) = [0, 1]^T$ (for $y > 0$).
2. As $x \to L^+$, we cross into endpoint $\mathbf{b} = [L, 0]^T$ Voronoi region:
   Closest point remains $\mathbf{p}^* = [L, 0]^T$.
   Vector $\mathbf{d} = [L + \epsilon, y]^T - [L, 0]^T = [\epsilon, y]^T$.
   Taking the limit as $\epsilon \to 0^+$:
   $$\lim_{\epsilon \to 0^+} \mathbf{n} = \lim_{\epsilon \to 0^+} \frac{[\epsilon, y]^T}{\sqrt{\epsilon^2 + y^2}} = \frac{[0, y]^T}{y} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$
The limit from the right matches the face normal from the left identically. The contact normal field $\mathbf{n}(\mathbf{c})$ is continuous everywhere outside the segment. $\blacksquare$

---

### Solution to Exercise 3.10
Two capsules of radii $r_1$ and $r_2$ have central line segments $\mathcal{S}_1(\mathbf{a}_1, \mathbf{b}_1)$ and $\mathcal{S}_2(\mathbf{a}_2, \mathbf{b}_2)$.
1. Compute the minimum distance between the two 3D/2D line segments:
   $$d_{\text{segments}} = \min_{s, t \in [0, 1]} \|\mathbf{s}_1(s) - \mathbf{s}_2(t)\|$$
2. Let $(\mathbf{p}_1^*, \mathbf{p}_2^*)$ be the pair of closest points on the two segments.
3. Overlap condition:
   $$d_{\text{segments}} < r_1 + r_2$$
4. Contact manifold parameters:
   - Penetration depth: $\delta = (r_1 + r_2) - d_{\text{segments}}$
   - Contact normal: $\mathbf{n} = \frac{\mathbf{p}_2^* - \mathbf{p}_1^*}{d_{\text{segments}}}$
   - Contact point: $\mathbf{p}_{\text{contact}} = \mathbf{p}_1^* + (r_1 - \frac{\delta}{2})\mathbf{n}$.
This reduces capsule-capsule narrow-phase collision to standard segment-segment closest point computation. $\blacksquare$
