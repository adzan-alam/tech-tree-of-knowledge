# Chapter 6: Contact Manifold Generation: Reference Edges, Incident Edges, and Sutherland-Hodgman Clipping

> *"Separation is merely half the battle. Knowing that two bodies overlap by three centimeters along the vertical axis is useless if you do not know WHERE they touch. Without contact points, an engine cannot compute torque, cannot balance stacks of blocks, and cannot stop an overturned vehicle from violently spinning into oblivion. Contact manifold generation is the geometric art of finding the exact physical footprints of touch."*

---

### Conceptual Architecture: The Contact Manifold Synthesis Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   INPUT: COLLIDING POLYGONS A & B + SAT COLLISION NORMAL n               │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Identify Reference and Incident Bodies
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STEP 1: REFERENCE & INCIDENT FEATURE CLASSIFICATION                         │
│                                                                                          │
│   • Reference Edge e_ref: Edge on Reference Body whose normal is most aligned with n     │
│   • Incident Edge e_inc:  Edge on Incident Body whose normal is most anti-aligned (-n)   │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Incident Edge Vertices: {v_1, v_2}
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STEP 2: SUTHERLAND-HODGMAN CLIPPING (SIDE PLANES)                           │
│                                                                                          │
│   • Clip e_inc against Side Plane 1 (Perpendicular to e_ref at start vertex):            │
│       t = (n_side1 · (p_side1 - v_1)) / (n_side1 · (v_2 - v_1))                          │
│   • Clip resulting vertices against Side Plane 2 (Perpendicular to e_ref at end vertex)  │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Clipped Vertices
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STEP 3: REFERENCE FACE DEPTH CULLING                                        │
│                                                                                          │
│   • For each clipped vertex v_k:                                                         │
│       separation = (v_k - p_ref) · n_ref                                                 │
│       If separation ≤ 0: KEEP!  Local penetration depth: δ_k = -separation               │
│       If separation > 0: DISCARD (Lies outside the reference body)                       │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Final Contact Points {p_k, δ_k}
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   OUTPUT: PRODUCTION CONTACT MANIFOLD                                    │
│   • 1 Contact Point (Vertex-to-Face Impact) OR 2 Contact Points (Face-to-Face Stacking)  │
│   • Torque Lever Arms: r_A = p_k - c_A,  r_B = p_k - c_B                                 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.1 The Critical Need for Contact Manifolds

In Chapter 5, the Separating Axis Theorem (SAT) successfully computed the **Minimum Translation Vector (MTV)**:
$$\mathbf{MTV} = \delta \mathbf{n}$$
The MTV tells the physics engine:
1. **How far** the bodies have penetrated ($\delta$).
2. **In what direction** they must be separated ($\mathbf{n}$).

However, the MTV contains **zero information about where the contact occurs in world space**.

### 6.1.1 The Torque Deficiency
Consider Newton-Euler rotational dynamics for rigid bodies:
$$\tau_{\text{net}} = I \alpha = \sum_{k} (\mathbf{r}_k \times \mathbf{F}_k)$$
where $\mathbf{r}_k = \mathbf{p}_k - \mathbf{c}$ is the moment lever arm vector from the body's center of mass $\mathbf{c}$ to the world contact point $\mathbf{p}_k$, and $\times$ in 2D is the scalar perp-dot cross product:
$$\mathbf{r} \times \mathbf{F} = r_x F_y - r_y F_x$$

If the physics engine does not know the contact point $\mathbf{p}_k$:
- It cannot compute the moment arm $\mathbf{r}_k$.
- It cannot apply rotational impulses or torque.
- A projectile striking the far tip of a propeller would cause the propeller to translate purely linearly without spinning!

### 6.1.2 The Single-Point Stacking Disaster
Suppose a heavy rectangular crate rests flat on a floor.
If the collision engine reports only a single contact point at the center of the bottom face:

```
Single-Point Contact Instability vs Two-Point Manifold Stability

  A. Single Contact Point (UNSTABLE!):       B. Two Contact Points (STABLE!):
            ┌──────────────┐                          ┌──────────────┐
            │   Crate      │                          │   Crate      │
            │     * c      │                          │     * c      │
            └──────┬───────┘                          └──────┬───────┘
                   * Single contact point                    *       * Two points
            ───────────────────────                   ───────┴───────┴──────
            Rotational tipping occurs!                Stable support polygon!
```

Any microscopic numerical disturbance (floating-point asymmetry, sub-millimeter horizontal drift) tilts the crate slightly. With only one contact point acting as a pivot, the normal force creates an unphysical torque that tips the crate over.
A flat crate resting on a flat floor requires **at least two contact points** to form a stable support polygon (a 1D contact line segment in 2D space) that counteracts overturning moments.

---

## 6.2 Reference and Incident Feature Identification

When two convex polygons $\mathcal{A}$ and $\mathcal{B}$ collide with SAT contact normal $\mathbf{n}$ (directed from $\mathcal{A}$ to $\mathcal{B}$):

```
Reference and Incident Feature Identification

                     Body A (Reference Body)
                      ┌──────────────────┐
                      │                  │
                      │  Reference Edge  │
                      └───*──────────*───┘ ◄── n_ref ≈ n (Aligned)
                          │          │
                          ▼          ▼
                      ┌───*──────────*───┐ ◄── n_inc ≈ -n (Anti-Aligned)
                      │  Incident Edge   │
                      │                  │
                      │                  │
                      └──────────────────┘
                     Body B (Incident Body)
```

### 6.2.1 Step 1: Assigning Reference and Incident Bodies
The **Reference Body** is the body whose edge provided the minimum penetration axis $\mathbf{n}$.
- If the SAT axis came from an edge of Polygon $\mathcal{A}$:
  - Body $\mathcal{A}$ is the **Reference Body**.
  - Body $\mathcal{B}$ is the **Incident Body**.
  - Reference normal $\mathbf{n}_{\text{ref}} = \mathbf{n}$.
- If the SAT axis came from an edge of Polygon $\mathcal{B}$:
  - Body $\mathcal{B}$ is the **Reference Body**.
  - Body $\mathcal{A}$ is the **Incident Body**.
  - Reference normal $\mathbf{n}_{\text{ref}} = -\mathbf{n}$.

The edge on the reference body corresponding to this axis is the **Reference Edge** $\mathbf{e}_{\text{ref}}$ with endpoints $\mathbf{p}_1, \mathbf{p}_2$.

### 6.2.2 Step 2: Finding the Incident Edge
The **Incident Edge** is the edge on the incident body that faces directly toward the reference edge.
Mathematically, it is the edge on the incident body whose outward normal $\mathbf{n}_{\text{inc}, k}$ has the **maximum negative dot product** with the reference normal $\mathbf{n}_{\text{ref}}$ (i.e. is most anti-parallel):
$$\mathbf{e}_{\text{inc}} = \arg\min_{e \in \text{Edges}(\text{Incident})} (\mathbf{n}_e \cdot \mathbf{n}_{\text{ref}})$$

Let the two endpoints of the incident edge in world space be $\mathbf{v}_1$ and $\mathbf{v}_2$.

---

## 6.3 Sutherland-Hodgman Polygon Edge Clipping

Originally developed by Ivan Sutherland and Gary Hodgman in 1974 for computer graphics viewport clipping, the **Sutherland-Hodgman Algorithm** clips a polygon against a set of infinite half-planes in successive passes.

In rigid body collision detection, we clip the 2-vertex incident edge segment $\mathbf{v}_1 \mathbf{v}_2$ against the **two side boundary planes of the reference edge**.

```
Reference Edge Clipping Planes

                 Side Plane 1                 Side Plane 2
                 Normal: -t_ref               Normal: +t_ref
                      │                            │
                      ▼                            ▼
                 ─────*────────────────────────────*─────
                     p_1      Reference Edge      p_2
                               Normal: n_ref
```

### 6.3.1 Formulating the Side Clipping Planes
Let the reference edge run from vertex $\mathbf{p}_1$ to vertex $\mathbf{p}_2$:
$$\mathbf{e}_{\text{ref}} = \mathbf{p}_2 - \mathbf{p}_1$$
Unit tangent vector along the edge:
$$\hat{\mathbf{t}}_{\text{ref}} = \frac{\mathbf{e}_{\text{ref}}}{\|\mathbf{e}_{\text{ref}}\|}$$

1. **Side Plane 1 (at vertex $\mathbf{p}_1$):**
   - Anchor point: $\mathbf{p}_1$
   - Outward-facing side normal (pointing away from edge): $\hat{\mathbf{n}}_{\text{side}, 1} = -\hat{\mathbf{t}}_{\text{ref}}$
2. **Side Plane 2 (at vertex $\mathbf{p}_2$):**
   - Anchor point: $\mathbf{p}_2$
   - Outward-facing side normal: $\hat{\mathbf{n}}_{\text{side}, 2} = +\hat{\mathbf{t}}_{\text{ref}}$

### 6.3.2 The Line-Plane Clipping Formula
Given a clipping plane with anchor $\mathbf{p}_{\text{plane}}$ and inward normal $\hat{\mathbf{n}}_{\text{inward}}$:
The signed distance of any point $\mathbf{v}$ from the plane is:
$$d(\mathbf{v}) = (\mathbf{v} - \mathbf{p}_{\text{plane}}) \cdot \hat{\mathbf{n}}_{\text{inward}}$$
- If $d(\mathbf{v}) \ge 0$: The point is inside (accepted).
- If $d(\mathbf{v}) < 0$: The point is outside (culled).

When a directed segment $\mathbf{v}_1 \mathbf{v}_2$ crosses the clipping plane (one endpoint inside, one endpoint outside), the intersection point is computed via linear interpolation:
$$t = \frac{d(\mathbf{v}_1)}{d(\mathbf{v}_1) - d(\mathbf{v}_2)} = \frac{(\mathbf{v}_1 - \mathbf{p}_{\text{plane}}) \cdot \hat{\mathbf{n}}_{\text{inward}}}{[(\mathbf{v}_1 - \mathbf{p}_{\text{plane}}) - (\mathbf{v}_2 - \mathbf{p}_{\text{plane}})] \cdot \hat{\mathbf{n}}_{\text{inward}}}$$
$$\mathbf{v}_{\text{clipped}} = \mathbf{v}_1 + t (\mathbf{v}_2 - \mathbf{v}_1)$$

The algorithm executes two successive passes:
- **Pass 1:** Clip incident edge against Side Plane 1.
- **Pass 2:** Clip resulting points against Side Plane 2.

---

## 6.4 Reference Face Depth Culling

After side-plane clipping, we obtain up to two candidate contact points $\{\mathbf{v}_1', \mathbf{v}_2'\}$.
However, some of these points might lie in front of the reference edge (outside the reference body).

```
Depth Culling Against Reference Edge Face

        Reference Body Interior (Inside: Keep!)
        ──────────────────────┬────────────────────── Reference Edge
                              │ n_ref (Outward Normal)
                              ▼
        Separation > 0 (Outside: Discard!)
        * Candidate point outside ==> Culled!
```

For each candidate point $\mathbf{v}_k'$:
1. Compute the signed perpendicular distance (separation) from the reference edge plane:
   $$\text{separation}_k = (\mathbf{v}_k' - \mathbf{p}_1) \cdot \mathbf{n}_{\text{ref}}$$
2. **Depth Filter:**
   - If $\text{separation}_k \le 0$:
     The point penetrates into the reference body!
     **Keep this contact point.**
     Local penetration depth:
     $$\delta_k = -\text{separation}_k \ge 0$$
     World contact point:
     $$\mathbf{p}_{\text{contact}, k} = \mathbf{v}_k'$$
   - If $\text{separation}_k > 0$:
     The point lies in front of the reference face (no physical penetration).
     **Discard this point.**

---

## 6.5 Progressive Numerical Worked Examples

---

### Worked Example 6.1: Identifying Reference and Incident Edges
**Problem Statement:** A rectangular block $\mathcal{A}$ rests on a flat horizontal floor $\mathcal{B}$:
- Block $\mathcal{A}$: Centered at $\mathbf{c}_A = [5.0, 2.0]^T\text{ m}$, width $4.0\text{ m}$, height $2.0\text{ m}$.
  Vertices: $\mathbf{a}_0 = [3, 1]^T, \mathbf{a}_1 = [7, 1]^T, \mathbf{a}_2 = [7, 3]^T, \mathbf{a}_3 = [3, 3]^T$.
- Floor $\mathcal{B}$: A large static AABB with $y \in [-2.0, 1.05]^T\text{ m}$ (slight overlap of $0.05\text{ m}$).
  Top edge of floor runs from $\mathbf{b}_0 = [0.0, 1.05]^T$ to $\mathbf{b}_1 = [10.0, 1.05]^T$.

SAT detects collision with normal $\mathbf{n} = [0.0, 1.0]^T$ (pointing upward from floor $\mathcal{B}$ into block $\mathcal{A}$).
1. Determine which body is the Reference Body and which is the Incident Body.
2. Formulate the Reference Edge endpoints and reference normal.
3. Evaluate edge normals of the Incident Body to identify the Incident Edge.

**Step-by-Step Mathematical Solution:**

**Step 1: Assigning reference and incident bodies.**
The SAT normal $\mathbf{n} = [0.0, 1.0]^T$ corresponds to the top edge of Floor $\mathcal{B}$ (Edge from $[0, 1.05]$ to $[10, 1.05]$ has normal $[0, 1]^T$).
Therefore:
- **Reference Body:** Floor $\mathcal{B}$
- **Incident Body:** Block $\mathcal{A}$
- Reference normal: $\mathbf{n}_{\text{ref}} = [0.0, 1.0]^T$

**Step 2: Reference edge.**
The reference edge is the top surface of the floor:
$$\mathbf{p}_1 = [0.0, 1.05]^T\text{ m}, \quad \mathbf{p}_2 = [10.0, 1.05]^T\text{ m}$$

**Step 3: Finding the incident edge on Block $\mathcal{A}$.**
We inspect the four edges of Block $\mathcal{A}$ and compute dot products with reference normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$:
- Bottom Edge ($\mathbf{a}_0 \to \mathbf{a}_1$: $[3, 1] \to [7, 1]$):
  Normal points down: $\mathbf{n}_0 = [0.0, -1.0]^T$.
  $$\mathbf{n}_0 \cdot \mathbf{n}_{\text{ref}} = (0)(0) + (-1)(1) = -1.000$$
- Right Edge ($\mathbf{a}_1 \to \mathbf{a}_2$: $[7, 1] \to [7, 3]$):
  Normal points right: $\mathbf{n}_1 = [1.0, 0.0]^T \implies \mathbf{n}_1 \cdot \mathbf{n}_{\text{ref}} = 0.0$.
- Top Edge ($\mathbf{a}_2 \to \mathbf{a}_3$: $[7, 3] \to [3, 3]$):
  Normal points up: $\mathbf{n}_2 = [0.0, 1.0]^T \implies \mathbf{n}_2 \cdot \mathbf{n}_{\text{ref}} = +1.000$.
- Left Edge ($\mathbf{a}_3 \to \mathbf{a}_0$: $[3, 3] \to [3, 1]$):
  Normal points left: $\mathbf{n}_3 = [-1.0, 0.0]^T \implies \mathbf{n}_3 \cdot \mathbf{n}_{\text{ref}} = 0.0$.

The minimum dot product is $-1.000$ (most anti-parallel to $\mathbf{n}_{\text{ref}}$).
The **Incident Edge** is the bottom edge of Block $\mathcal{A}$:
$$\mathbf{v}_1 = [3.0, 1.00]^T\text{ m}, \quad \mathbf{v}_2 = [7.0, 1.00]^T\text{ m}$$

---

### Worked Example 6.2: Sutherland-Hodgman Side Plane 1 Clipping
**Problem Statement:** An incident edge has endpoints $\mathbf{v}_1 = [1.0, 0.8]^T\text{ m}$ and $\mathbf{v}_2 = [6.0, 0.9]^T\text{ m}$.
The reference edge runs from $\mathbf{p}_1 = [2.0, 1.0]^T\text{ m}$ to $\mathbf{p}_2 = [5.0, 1.0]^T\text{ m}$ with reference normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$.
1. Compute the reference tangent vector $\hat{\mathbf{t}}_{\text{ref}}$ and the inward normal $\hat{\mathbf{n}}_{\text{inward}, 1}$ for Side Plane 1 at $\mathbf{p}_1$.
2. Compute the signed distances $d(\mathbf{v}_1)$ and $d(\mathbf{v}_2)$ from Side Plane 1.
3. Compute the clipped intersection point $\mathbf{v}_1'$ and output the remaining incident points.

**Step-by-Step Mathematical Solution:**

**Step 1: Side plane 1 geometry.**
Reference edge vector:
$$\mathbf{e}_{\text{ref}} = \mathbf{p}_2 - \mathbf{p}_1 = [5.0 - 2.0, 1.0 - 1.0]^T = [3.0, 0.0]^T\text{ m}$$
Unit tangent:
$$\hat{\mathbf{t}}_{\text{ref}} = \frac{[3, 0]^T}{3.0} = [1.0, 0.0]^T$$
Side Plane 1 anchor is $\mathbf{p}_1 = [2.0, 1.0]^T$.
Inward normal points along the reference edge ($+\hat{\mathbf{t}}_{\text{ref}}$):
$$\hat{\mathbf{n}}_{\text{inward}, 1} = +\hat{\mathbf{t}}_{\text{ref}} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}$$

**Step 2: Signed distances to Side Plane 1.**
$$d(\mathbf{v}_1) = (\mathbf{v}_1 - \mathbf{p}_1) \cdot \hat{\mathbf{n}}_{\text{inward}, 1} = \begin{bmatrix} 1.0 - 2.0 \\ 0.8 - 1.0 \end{bmatrix} \cdot \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = [-1.0, -0.2]^T \cdot [1, 0]^T = -1.000\text{ m}$$
Because $d(\mathbf{v}_1) = -1.0 < 0$, $\mathbf{v}_1$ lies **OUTSIDE** Side Plane 1!

$$d(\mathbf{v}_2) = (\mathbf{v}_2 - \mathbf{p}_1) \cdot \hat{\mathbf{n}}_{\text{inward}, 1} = \begin{bmatrix} 6.0 - 2.0 \\ 0.9 - 1.0 \end{bmatrix} \cdot \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = [+4.0, -0.1]^T \cdot [1, 0]^T = +4.000\text{ m}$$
Because $d(\mathbf{v}_2) = +4.0 \ge 0$, $\mathbf{v}_2$ lies **INSIDE** Side Plane 1!

**Step 3: Linear interpolation of clipped vertex $\mathbf{v}_1'$.**
The segment crosses Side Plane 1:
$$t = \frac{d(\mathbf{v}_1)}{d(\mathbf{v}_1) - d(\mathbf{v}_2)} = \frac{-1.000}{-1.000 - 4.000} = \frac{-1.000}{-5.000} = 0.200$$
Interpolating the clipped point:
$$\mathbf{v}_1' = \mathbf{v}_1 + t (\mathbf{v}_2 - \mathbf{v}_1) = \begin{bmatrix} 1.0 \\ 0.8 \end{bmatrix} + 0.200 \begin{bmatrix} 6.0 - 1.0 \\ 0.9 - 0.8 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 0.8 \end{bmatrix} + 0.200 \begin{bmatrix} 5.0 \\ 0.1 \end{bmatrix}$$
$$\mathbf{v}_1' = \begin{bmatrix} 1.0 + 1.00 \\ 0.8 + 0.02 \end{bmatrix} = \begin{bmatrix} 2.000 \\ 0.820 \end{bmatrix}\text{ m}$$
Notice that $x = 2.00\text{ m}$ matches $\mathbf{p}_1$ exactly!
Output after Pass 1: $\{\mathbf{v}_1' = [2.0, 0.82]^T, \, \mathbf{v}_2 = [6.0, 0.90]^T\}$.

---

### Worked Example 6.3: Sutherland-Hodgman Side Plane 2 Clipping
**Problem Statement:** Take the output from Example 6.2 ($\mathbf{v}_1' = [2.0, 0.82]^T\text{ m}$ and $\mathbf{v}_2 = [6.0, 0.90]^T\text{ m}$) and clip it against Side Plane 2 at $\mathbf{p}_2 = [5.0, 1.0]^T\text{ m}$.
1. Formulate the inward normal $\hat{\mathbf{n}}_{\text{inward}, 2}$ for Side Plane 2.
2. Compute the signed distances $d(\mathbf{v}_1')$ and $d(\mathbf{v}_2)$.
3. Compute the clipped intersection point $\mathbf{v}_2'$ and output the final clipped points.

**Step-by-Step Mathematical Solution:**

**Step 1: Side plane 2 inward normal.**
Side Plane 2 is anchored at $\mathbf{p}_2 = [5.0, 1.0]^T$.
The inward normal points back toward $\mathbf{p}_1$ (negative tangent direction):
$$\hat{\mathbf{n}}_{\text{inward}, 2} = -\hat{\mathbf{t}}_{\text{ref}} = \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix}$$

**Step 2: Signed distances to Side Plane 2.**
$$d(\mathbf{v}_1') = (\mathbf{v}_1' - \mathbf{p}_2) \cdot \hat{\mathbf{n}}_{\text{inward}, 2} = \begin{bmatrix} 2.0 - 5.0 \\ 0.82 - 1.0 \end{bmatrix} \cdot \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix} = [-3.0, -0.18]^T \cdot [-1, 0]^T = +3.000\text{ m}$$
Because $d(\mathbf{v}_1') = +3.0 \ge 0$, $\mathbf{v}_1'$ is **INSIDE**.

$$d(\mathbf{v}_2) = (\mathbf{v}_2 - \mathbf{p}_2) \cdot \hat{\mathbf{n}}_{\text{inward}, 2} = \begin{bmatrix} 6.0 - 5.0 \\ 0.90 - 1.0 \end{bmatrix} \cdot \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix} = [+1.0, -0.10]^T \cdot [-1, 0]^T = -1.000\text{ m}$$
Because $d(\mathbf{v}_2) = -1.0 < 0$, $\mathbf{v}_2$ lies **OUTSIDE** Side Plane 2!

**Step 3: Interpolating clipped vertex $\mathbf{v}_2'$.**
The segment crosses Side Plane 2:
$$t = \frac{d(\mathbf{v}_1')}{d(\mathbf{v}_1') - d(\mathbf{v}_2)} = \frac{3.000}{3.000 - (-1.000)} = \frac{3.000}{4.000} = 0.750$$
Interpolating between $\mathbf{v}_1'$ and $\mathbf{v}_2$:
$$\mathbf{v}_2' = \mathbf{v}_1' + t (\mathbf{v}_2 - \mathbf{v}_1') = \begin{bmatrix} 2.0 \\ 0.82 \end{bmatrix} + 0.750 \begin{bmatrix} 6.0 - 2.0 \\ 0.90 - 0.82 \end{bmatrix} = \begin{bmatrix} 2.0 \\ 0.82 \end{bmatrix} + 0.750 \begin{bmatrix} 4.0 \\ 0.08 \end{bmatrix}$$
$$\mathbf{v}_2' = \begin{bmatrix} 2.0 + 3.00 \\ 0.82 + 0.06 \end{bmatrix} = \begin{bmatrix} 5.000 \\ 0.880 \end{bmatrix}\text{ m}$$
Notice that $x = 5.00\text{ m}$ matches $\mathbf{p}_2$ exactly!
Output after Pass 2: The clipped incident segment spans exactly between the lateral limits of the reference edge:
$$\{\mathbf{v}_1' = [2.000, 0.820]^T, \, \mathbf{v}_2' = [5.000, 0.880]^T\}$$

---

### Worked Example 6.4: Reference Face Depth Culling
**Problem Statement:** Take the two side-clipped points from Example 6.3:
$\mathbf{v}_1' = [2.0, 0.82]^T\text{ m}$ and $\mathbf{v}_2' = [5.0, 0.88]^T\text{ m}$.
The reference edge lies on the line passing through $\mathbf{p}_1 = [2.0, 1.0]^T\text{ m}$ with outward normal $\mathbf{n}_{\text{ref}} = [0.0, 1.0]^T$.
1. Compute the signed separation for both candidate points.
2. Filter the points to verify whether they penetrate the reference face.
3. For each valid point, compute the local penetration depth $\delta_k$.
4. State the final contact manifold.

**Step-by-Step Mathematical Solution:**

**Step 1: Signed separations.**
- For point 1 ($\mathbf{v}_1' = [2.0, 0.82]^T$):
  $$\text{sep}_1 = (\mathbf{v}_1' - \mathbf{p}_1) \cdot \mathbf{n}_{\text{ref}} = \begin{bmatrix} 2.0 - 2.0 \\ 0.82 - 1.0 \end{bmatrix} \cdot \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix} = [0.0, -0.18]^T \cdot [0, 1]^T = -0.180\text{ meters}$$
- For point 2 ($\mathbf{v}_2' = [5.0, 0.88]^T$):
  $$\text{sep}_2 = (\mathbf{v}_2' - \mathbf{p}_1) \cdot \mathbf{n}_{\text{ref}} = \begin{bmatrix} 5.0 - 2.0 \\ 0.88 - 1.0 \end{bmatrix} \cdot \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix} = [3.0, -0.12]^T \cdot [0, 1]^T = -0.120\text{ meters}$$

**Step 2: Depth filtering.**
- Since $\text{sep}_1 = -0.180\text{ m} \le 0.0$, Point 1 penetrates the reference face: **ACCEPTED!**
- Since $\text{sep}_2 = -0.120\text{ m} \le 0.0$, Point 2 penetrates the reference face: **ACCEPTED!**

**Step 3: Local penetration depths.**
$$\delta_1 = -\text{sep}_1 = -(-0.180) = +0.180\text{ meters} = 18.0\text{ cm}$$
$$\delta_2 = -\text{sep}_2 = -(-0.120) = +0.120\text{ meters} = 12.0\text{ cm}$$

**Step 4: Final contact manifold.**
The collision produces a stable **2-point contact manifold**:
- Normal: $\mathbf{n} = [0.0, 1.0]^T$
- Contact Point 1: $\mathbf{p}_1 = [2.000, 0.820]^T\text{ m}$ with $\delta_1 = 0.180\text{ m}$
- Contact Point 2: $\mathbf{p}_2 = [5.000, 0.880]^T\text{ m}$ with $\delta_2 = 0.120\text{ m}$

---

### Worked Example 6.5: Vertex-to-Face Single Contact Point Manifold
**Problem Statement:** A rectangular block tilted at an angle drops corner-first onto a flat floor:
- Floor (Reference Body): Top face along $y = 0.0$, reference normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$, edge from $\mathbf{p}_1 = [-10, 0]^T$ to $\mathbf{p}_2 = [10, 0]^T$.
- Tilted Block (Incident Body): The corner vertex strikes the floor at $\mathbf{v}_1 = [2.0, -0.10]^T\text{ m}$ (penetrating by $10\text{ cm}$).
  The adjacent incident edge runs from $\mathbf{v}_1 = [2.0, -0.10]^T$ up to $\mathbf{v}_2 = [3.0, 0.40]^T\text{ m}$ (in the air above the floor).
1. Perform side-plane clipping and state the intermediate points.
2. Perform reference face depth culling.
3. Show that depth culling reduces the manifold from 2 candidate points to exactly 1 contact point.

**Step-by-Step Mathematical Solution:**

**Step 1: Side plane clipping.**
The floor extends horizontally from $x = -10$ to $x = +10$.
Both incident vertices have $x$-coordinates $x_1 = 2.0\text{ m}$ and $x_2 = 3.0\text{ m}$.
Since $2.0 \in [-10, 10]$ and $3.0 \in [-10, 10]$, both points lie strictly within the lateral bounds of Side Plane 1 and Side Plane 2.
Side-plane clipping passes both vertices unaltered:
$$\mathbf{v}_1' = [2.0, -0.10]^T\text{ m}, \quad \mathbf{v}_2' = [3.0, 0.40]^T\text{ m}$$

**Step 2: Reference face depth culling.**
Floor plane is at $y = 0.0$ with normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$:
$$\text{sep}_1 = (\mathbf{v}_1' - [0, 0]) \cdot [0, 1]^T = y_1' = -0.10\text{ meters}$$
$$\text{sep}_2 = (\mathbf{v}_2' - [0, 0]) \cdot [0, 1]^T = y_2' = +0.40\text{ meters}$$

**Step 3: Depth filtering.**
- For Point 1: $\text{sep}_1 = -0.10\text{ m} \le 0 \implies$ **ACCEPTED!**
  Penetration: $\delta_1 = -(-0.10) = 0.100\text{ meters}$.
  Contact point: $\mathbf{p}_1 = [2.0, -0.10]^T\text{ m}$.
- For Point 2: $\text{sep}_2 = +0.40\text{ m} > 0 \implies$ **DISCARDED!** (Point 2 is suspended $40\text{ cm}$ in the air above the floor).

**Result:** The manifold contains **exactly 1 contact point** at $[2.0, -0.10]^T$ with penetration $\delta = 0.10\text{ m}$. This properly models a single-corner vertex-to-face impact.

---

### Worked Example 6.6: Moment Arm Vectors and Torque Generation
**Problem Statement:** For the single-point contact in Example 6.5:
- Contact point: $\mathbf{p} = [2.0, 0.0]^T\text{ m}$
- Center of mass of block: $\mathbf{c}_A = [1.5, 1.2]^T\text{ m}$
- Mass of block: $m = 10.0\text{ kg}$, moment of inertia: $I = 2.50\text{ kg}\cdot\text{m}^2$
- Upward ground normal impulse: $\mathbf{J}_n = [0.0, 40.0]^T\text{ N}\cdot\text{s}$
1. Compute the lever arm moment vector $\mathbf{r}_A = \mathbf{p} - \mathbf{c}_A$.
2. Calculate the rotational torque impulse $\Delta L = \mathbf{r}_A \times \mathbf{J}_n$ using the 2D cross product.
3. Compute the resulting change in angular velocity $\Delta \omega$.

**Step-by-Step Mathematical Solution:**

**Step 1: Moment arm vector.**
$$\mathbf{r}_A = \mathbf{p} - \mathbf{c}_A = \begin{bmatrix} 2.0 - 1.5 \\ 0.0 - 1.2 \end{bmatrix} = \begin{bmatrix} +0.50 \\ -1.20 \end{bmatrix}\text{ m}$$

**Step 2: Rotational torque impulse.**
Using the 2D cross product $\mathbf{r} \times \mathbf{J} = r_x J_y - r_y J_x$:
$$\Delta L = (0.50)(40.0) - (-1.20)(0.0) = +20.00 - 0.0 = +20.00\text{ N}\cdot\text{s}\cdot\text{m} = +20.00\text{ kg}\cdot\text{m}^2/\text{s}$$

**Step 3: Change in angular velocity.**
$$\Delta \omega = \frac{\Delta L}{I} = \frac{+20.00\text{ kg}\cdot\text{m}^2/\text{s}}{2.50\text{ kg}\cdot\text{m}^2} = +8.00\text{ rad/s}$$
Because the contact point was to the right of the center of mass ($r_x = +0.50\text{ m}$), the upward ground impulse induces a positive counter-clockwise rotation of $+8.0\text{ rad/s}$, naturally righting the tilted box!

---

### Worked Example 6.7: Contact Point Deduplication and Clustering
**Problem Statement:** A narrow-phase collision algorithm produces two contact points that are nearly identical due to a sub-millimeter edge segment:
- Point 1: $\mathbf{p}_1 = [4.000, 2.000]^T\text{ m}, \delta_1 = 0.040\text{ m}$
- Point 2: $\mathbf{p}_2 = [4.003, 2.002]^T\text{ m}, \delta_2 = 0.041\text{ m}$
A physics engine enforces a minimum cluster distance threshold of $\epsilon_{\text{cluster}} = 0.010\text{ m}$ ($10\text{ mm}$) to prevent singular constraint matrices.
1. Calculate the Euclidean distance between $\mathbf{p}_1$ and $\mathbf{p}_2$.
2. Check if the points should be merged.
3. Compute the averaged merged contact point and merged penetration depth.

**Step-by-Step Mathematical Solution:**

**Step 1: Distance between points.**
$$\Delta x = 4.003 - 4.000 = 0.003\text{ m}$$
$$\Delta y = 2.002 - 2.000 = 0.002\text{ m}$$
$$d = \sqrt{0.003^2 + 0.002^2} = \sqrt{0.000009 + 0.000004} = \sqrt{0.000013} \approx 0.003606\text{ m} \approx 3.61\text{ mm}$$

**Step 2: Cluster threshold check.**
$$d = 0.00361\text{ m} < \epsilon_{\text{cluster}} = 0.01000\text{ m} \quad \text{TRUE!}$$
The two points are separated by only $3.6\text{ mm}$, well below the $10\text{ mm}$ cluster limit.
**Action:** Merge the two points into a single composite contact point.

**Step 3: Merged contact point.**
$$\mathbf{p}_{\text{merged}} = \frac{\mathbf{p}_1 + \mathbf{p}_2}{2} = \begin{bmatrix} \frac{4.000 + 4.003}{2} \\ \frac{2.000 + 2.002}{2} \end{bmatrix} = \begin{bmatrix} 4.0015 \\ 2.0010 \end{bmatrix}\text{ m}$$
$$\delta_{\text{merged}} = \max(\delta_1, \delta_2) = \max(0.040, 0.041) = 0.041\text{ m}$$
The manifold collapses to 1 stable point, preventing redundant constraint rows and numerical ill-conditioning in the LCP solver.

---

### Worked Example 6.8: Two-Point Stacking Torque Equilibrium
**Problem Statement:** A crate of width $W = 2.0\text{ m}$ and mass $m = 20.0\text{ kg}$ rests on a floor.
The contact manifold has two symmetric contact points located at the bottom corners:
$\mathbf{p}_1 = [-1.0, 0.0]^T\text{ m}$ and $\mathbf{p}_2 = [+1.0, 0.0]^T\text{ m}$ relative to its center of mass $\mathbf{c} = [0.0, 1.0]^T\text{ m}$.
The normal force is distributed equally between the two points: $F_{n, 1} = F_{n, 2} = \frac{1}{2} mg = 98.1\text{ N}$ directed in $+y$.
An external horizontal wind force $F_{\text{wind}} = 30.0\text{ N}$ acts at height $y = 1.0\text{ m}$ (center of mass).
1. Compute the overturning moment $\tau_{\text{wind}}$ created by the wind force about the floor.
2. Formulate the restoring torque equation provided by the contact normal force pair:
   $$\tau_{\text{normal}} = r_{1, x} F_{n, 1} + r_{2, x} F_{n, 2}$$
3. Calculate the adjusted normal forces $F_{n, 1}$ and $F_{n, 2}$ required to maintain static rotational equilibrium ($\tau_{\text{net}} = 0$).

**Step-by-Step Mathematical Solution:**

**Step 1: Overturning wind moment.**
The wind acts at height $h = 1.0\text{ m}$ with magnitude $F_{\text{wind}} = 30.0\text{ N}$ in $+x$.
Moment about the center base $[0, 0]$:
$$\tau_{\text{wind}} = -F_{\text{wind}} \times h = -30.0\text{ N} \times 1.0\text{ m} = -30.00\text{ N}\cdot\text{m} \quad (\text{Clockwise tipping})$$

**Step 2: Normal force torque.**
Lever arms from base center:
$r_{1, x} = -1.0\text{ m}$ (left corner), $r_{2, x} = +1.0\text{ m}$ (right corner).
Both normal forces act upward ($+y$):
$$\tau_{\text{normal}} = r_{1, x} F_{n, 1} + r_{2, x} F_{n, 2} = (-1.0) F_{n, 1} + (+1.0) F_{n, 2} = F_{n, 2} - F_{n, 1}$$

**Step 3: Rotational equilibrium system.**
For static equilibrium:
1. Vertical force balance:
   $$F_{n, 1} + F_{n, 2} = mg = 20.0 \times 9.81 = 196.20\text{ N}$$
2. Torque balance:
   $$\tau_{\text{net}} = \tau_{\text{normal}} + \tau_{\text{wind}} = 0 \implies F_{n, 2} - F_{n, 1} - 30.0 = 0 \implies F_{n, 2} - F_{n, 1} = 30.00\text{ N}\cdot\text{m}$$

Adding the two equations:
$$2 F_{n, 2} = 196.20 + 30.00 = 226.20 \implies F_{n, 2} = 113.10\text{ Newtons}$$
Subtracting:
$$F_{n, 1} = 196.20 - 113.10 = 83.10\text{ Newtons}$$
*Physical Insight:* The right contact point absorbs more load ($113.1\text{ N}$) than the left contact point ($83.1\text{ N}$) to counteract the wind. Because both forces remain strictly positive ($F_{n, 1} > 0$), the crate does not tip over! This demonstrates why 2-point contact manifolds are indispensable for resting physics.

---

### Worked Example 6.9: Incident Edge Inversion Under Symmetric Normal
**Problem Statement:** Two identical unit squares centered at $\mathbf{c}_A = [0, 0]^T$ and $\mathbf{c}_B = [1.8, 0]^T$ collide along the $x$-axis.
SAT yields normal $\mathbf{n} = [1.0, 0.0]^T$.
1. Identify the Reference Edge on Square $\mathcal{A}$.
2. Identify all candidate incident edges on Square $\mathcal{B}$.
3. Show why the left vertical face of Square $\mathcal{B}$ uniquely minimizes the directional dot product.

**Step-by-Step Mathematical Solution:**

**Step 1: Reference edge on Square $\mathcal{A}$.**
Square $\mathcal{A}$ has vertices $[\pm 1, \pm 1]$.
Edges:
- Right edge ($x = 1.0$): from $[1, -1]^T$ to $[1, 1]^T$.
  Outward normal is $\mathbf{n}_{\text{right}} = [1.0, 0.0]^T$.
  $\mathbf{n}_{\text{right}} \cdot \mathbf{n} = [1, 0] \cdot [1, 0] = +1.000$ (Maximally aligned).
Reference Edge: from $[1, -1]^T$ to $[1, 1]^T$.

**Step 2: Candidate incident edges on Square $\mathcal{B}$.**
Square $\mathcal{B}$ has center at $[1.8, 0]^T$, vertices $[1.8 \pm 1, \pm 1]^T = [0.8, \pm 1]^T$ and $[2.8, \pm 1]^T$.
Edges:
- Left edge ($x = 0.8$): normal is $[-1.0, 0.0]^T$.
- Top edge ($y = 1.0$): normal is $[0.0, 1.0]^T$.
- Right edge ($x = 2.8$): normal is $[+1.0, 0.0]^T$.
- Bottom edge ($y = -1.0$): normal is $[0.0, -1.0]^T$.

**Step 3: Dot products with reference normal $\mathbf{n}_{\text{ref}} = [1, 0]^T$.**
- Left edge: $[-1, 0] \cdot [1, 0] = -1.000$
- Top edge: $[0, 1] \cdot [1, 0] = 0.000$
- Right edge: $[1, 0] \cdot [1, 0] = +1.000$
- Bottom edge: $[0, -1] \cdot [1, 0] = 0.000$
The minimum value is $-1.000$ (Left Edge).
The Incident Edge is uniquely identified as the left vertical face running from $[0.8, 1]^T$ to $[0.8, -1]^T$.

---

### Worked Example 6.10: End-to-End Trace from SAT to 2-Point Contact Manifold
**Problem Statement:** Complete a full, rigorous execution of the contact manifold generation algorithm for two overlapping rectangular bodies:
- Body $\mathcal{A}$ (Floor): Static box with vertices $[0, 0]^T, [8, 0]^T, [8, 2]^T, [0, 2]^T$.
- Body $\mathcal{B}$ (Moving crate): Vertices $[2, 1.9]^T, [6, 1.9]^T, [6, 4.9]^T, [2, 4.9]^T$.
SAT has confirmed collision with minimum overlap axis $\mathbf{n} = [0.0, 1.0]^T$ and penetration depth $\delta = 0.10\text{ m}$.
1. Identify the Reference Edge and Incident Edge.
2. Perform Sutherland-Hodgman clipping against Side Plane 1 and Side Plane 2.
3. Perform Reference Face depth culling.
4. Output the final contact manifold.

**Step-by-Step Mathematical Solution:**

**Step 1: Feature identification.**
SAT normal is $\mathbf{n} = [0, 1]^T$.
- **Reference Body:** Body $\mathcal{A}$ (Floor), reference normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$.
  Reference edge is the top surface ($y = 2.0$):
  $$\mathbf{p}_1 = [0.0, 2.0]^T\text{ m}, \quad \mathbf{p}_2 = [8.0, 2.0]^T\text{ m}$$
- **Incident Body:** Body $\mathcal{B}$ (Crate).
  The bottom edge has normal $[0, -1]^T$, which minimizes $\mathbf{n}_e \cdot \mathbf{n}_{\text{ref}} = -1.0$.
  Incident edge endpoints:
  $$\mathbf{v}_1 = [2.0, 1.90]^T\text{ m}, \quad \mathbf{v}_2 = [6.0, 1.90]^T\text{ m}$$

**Step 2: Side plane clipping.**
Reference edge extends from $x = 0.0$ to $x = 8.0$.
Incident edge spans $x \in [2.0, 6.0]$.
Both $x_1 = 2.0$ and $x_2 = 6.0$ lie strictly between $0.0$ and $8.0$.
Neither point violates Side Plane 1 ($x \ge 0$) or Side Plane 2 ($x \le 8$).
Clipped points remain unchanged:
$$\mathbf{v}_1' = [2.0, 1.90]^T\text{ m}, \quad \mathbf{v}_2' = [6.0, 1.90]^T\text{ m}$$

**Step 3: Reference face depth culling.**
Reference face is at $y = 2.0$ with normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$.
- Point 1: $\text{sep}_1 = (1.90 - 2.00) = -0.10\text{ m} \le 0 \implies \mathbf{ACCEPTED!}$
  Penetration: $\delta_1 = -(-0.10) = 0.100\text{ m}$.
- Point 2: $\text{sep}_2 = (1.90 - 2.00) = -0.10\text{ m} \le 0 \implies \mathbf{ACCEPTED!}$
  Penetration: $\delta_2 = -(-0.10) = 0.100\text{ m}$.

**Step 4: Contact manifold result.**
- Contact Normal: $\mathbf{n} = [0.0, 1.0]^T$
- Contact Count: 2
- Contact Point 1: $\mathbf{p}_1 = [2.000, 1.900]^T\text{ m}$ with $\delta_1 = 0.100\text{ m}$
- Contact Point 2: $\mathbf{p}_2 = [6.000, 1.900]^T\text{ m}$ with $\delta_2 = 0.100\text{ m}$
The manifold is complete and mathematically verified.

---

## 6.6 Chapter Mastery Exercises

### Exercise 6.1 (Tier 1): Incident Normal Dot Product
An incident body has edge normals:
$\mathbf{n}_0 = [0, -1]^T, \mathbf{n}_1 = [1, 0]^T, \mathbf{n}_2 = [0, 1]^T, \mathbf{n}_3 = [-1, 0]^T$.
If the reference normal is $\mathbf{n}_{\text{ref}} = [0.707, 0.707]^T$, which edge is the Incident Edge?

### Exercise 6.2 (Tier 1): Side Plane Inward Normal Direction
Given a reference edge running from $\mathbf{p}_1 = [1, 3]^T$ to $\mathbf{p}_2 = [1, 9]^T$, compute the inward normal vector for Side Plane 1 (at $\mathbf{p}_1$).

### Exercise 6.3 (Tier 2): Single Contact Point Depth
A single contact point on an incident body has coordinate $\mathbf{v} = [4.0, 2.92]^T\text{ m}$.
The reference face is horizontal at $y = 3.00\text{ m}$ with upward normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$. Compute the local penetration depth $\delta$.

### Exercise 6.4 (Tier 2): Culling Discard Criterion
A candidate contact point after side clipping has world coordinate $[5.0, 3.05]^T$.
The reference face is at $y = 3.00$ with upward normal $[0, 1]^T$. Show why this point must be discarded.

### Exercise 6.5 (Tier 3): Side Plane Clipping Along an Inclined Edge
A reference edge runs from $[0, 0]^T$ to $[4, 3]^T$ ($\|\mathbf{e}\| = 5.0\text{ m}$).
Compute the unit tangent $\hat{\mathbf{t}}_{\text{ref}}$ and the inward normals for both side clipping planes.

### Exercise 6.6 (Tier 3): Moment Arm Cross Product in 2D
Let contact point be $\mathbf{p} = [5.0, 2.0]^T\text{ m}$ and center of mass be $\mathbf{c} = [3.0, 2.0]^T\text{ m}$.
If contact normal force is $\mathbf{F} = [-10.0, 50.0]^T\text{ N}$, compute the torque $\tau = \mathbf{r} \times \mathbf{F}$.

### Exercise 6.7 (Tier 4): Symmetric Two-Point Manifold Stacking Condition
Prove that for a box of mass $m$ and width $W$ resting on a horizontal surface with two symmetric contact points at $[\pm W/2, 0]^T$ from the center of mass, the crate can withstand a maximum horizontal tipping force $F_{\text{tip}} = mg \frac{W}{2h}$ applied at height $h$ before the uphill contact point force drops to zero.

### Exercise 6.8 (Tier 4): Merging Contact Points Below Precision Epsilon
Given two candidate points separated by distance $d = 1.5\times 10^{-4}\text{ m}$, explain why retaining both points in a sequential impulse solver causes matrix ill-conditioning.

### Exercise 6.9 (Tier 5): The 3D Contact Manifold (Contact Polygons)
In 3D rigid body physics, the intersection of two colliding polyhedral faces forms a 2D planar polygon.
Explain why 3D physics engines clip this polygon down to a maximum of 4 contact points (a quad) to maintain bounded performance in the constraint solver.

### Exercise 6.10 (Tier 5): Continuous Manifold Warm Starting
Explain how caching the accumulated normal impulse $\lambda_n$ and friction impulse $\lambda_t$ for each contact point across frames (warm starting) relies on persistent contact feature IDs (matching reference edge ID and incident vertex ID).

---

## 6.7 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 6.1
Reference normal: $\mathbf{n}_{\text{ref}} = [0.7071, 0.7071]^T$.
We evaluate dot products $\mathbf{n}_k \cdot \mathbf{n}_{\text{ref}}$:
- $\mathbf{n}_0 = [0, -1]^T \implies (0)(0.7071) + (-1)(0.7071) = -0.7071$
- $\mathbf{n}_1 = [1, 0]^T \implies (1)(0.7071) + (0)(0.7071) = +0.7071$
- $\mathbf{n}_2 = [0, 1]^T \implies (0)(0.7071) + (1)(0.7071) = +0.7071$
- $\mathbf{n}_3 = [-1, 0]^T \implies (-1)(0.7071) + (0)(0.7071) = -0.7071$
Both Edge 0 and Edge 3 tie at $-0.7071$.
In the event of a tie, the edge facing closest to the centroid displacement vector $-\mathbf{d}_{\text{centers}}$ is selected. Either edge 0 or 3 is a valid incident edge candidate.

---

### Solution to Exercise 6.2
Reference edge: from $\mathbf{p}_1 = [1, 3]^T$ to $\mathbf{p}_2 = [1, 9]^T$.
Edge vector: $\mathbf{e}_{\text{ref}} = [1 - 1, 9 - 3]^T = [0, 6]^T$.
Unit tangent: $\hat{\mathbf{t}}_{\text{ref}} = [0, 1]^T$.
Side Plane 1 is anchored at $\mathbf{p}_1 = [1, 3]^T$.
The inward normal points along the reference edge toward $\mathbf{p}_2$:
$$\hat{\mathbf{n}}_{\text{inward}, 1} = +\hat{\mathbf{t}}_{\text{ref}} = \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix}$$

---

### Solution to Exercise 6.3
Point: $\mathbf{v} = [4.0, 2.92]^T\text{ m}$.
Reference face plane: passes through $[0, 3.00]^T$ with normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$.
Signed separation:
$$\text{separation} = (\mathbf{v} - \mathbf{p}_{\text{ref}}) \cdot \mathbf{n}_{\text{ref}} = \begin{bmatrix} 4.0 - 0.0 \\ 2.92 - 3.00 \end{bmatrix} \cdot \begin{bmatrix} 0 \\ 1 \end{bmatrix} = 2.92 - 3.00 = -0.080\text{ m}$$
Because separation is negative ($-0.080\text{ m} \le 0$), the point penetrates.
Local penetration depth:
$$\delta = -\text{separation} = -(-0.080) = 0.080\text{ meters} = 8.0\text{ cm}$$

---

### Solution to Exercise 6.4
Point: $\mathbf{v} = [5.0, 3.05]^T\text{ m}$.
Reference face at $y = 3.00\text{ m}$ with normal $\mathbf{n}_{\text{ref}} = [0, 1]^T$.
Separation:
$$\text{separation} = 3.05 - 3.00 = +0.050\text{ meters}$$
Because $\text{separation} = +0.050\text{ m} > 0$, the candidate point lies strictly in front of the reference face (in the air, outside the reference body). It does not penetrate, and therefore must be discarded to prevent pulling forces.

---

### Solution to Exercise 6.5
Endpoints: $\mathbf{p}_1 = [0, 0]^T, \mathbf{p}_2 = [4, 3]^T$.
Edge vector: $\mathbf{e}_{\text{ref}} = [4 - 0, 3 - 0]^T = [4, 3]^T\text{ m}$.
Length: $\|\mathbf{e}_{\text{ref}}\| = \sqrt{4^2 + 3^2} = 5.0\text{ m}$.
Unit tangent:
$$\hat{\mathbf{t}}_{\text{ref}} = \frac{[4, 3]^T}{5.0} = \begin{bmatrix} 0.80 \\ 0.60 \end{bmatrix}$$
- Side Plane 1 (at $\mathbf{p}_1 = [0, 0]^T$):
  Inward normal: $\hat{\mathbf{n}}_{\text{inward}, 1} = +\hat{\mathbf{t}}_{\text{ref}} = [0.80, 0.60]^T$.
- Side Plane 2 (at $\mathbf{p}_2 = [4, 3]^T$):
  Inward normal: $\hat{\mathbf{n}}_{\text{inward}, 2} = -\hat{\mathbf{t}}_{\text{ref}} = [-0.80, -0.60]^T$.

---

### Solution to Exercise 6.6
Contact point $\mathbf{p} = [5.0, 2.0]^T$, center $\mathbf{c} = [3.0, 2.0]^T$.
Lever arm:
$$\mathbf{r} = \mathbf{p} - \mathbf{c} = [5.0 - 3.0, 2.0 - 2.0]^T = [2.0, 0.0]^T\text{ m}$$
Force: $\mathbf{F} = [-10.0, 50.0]^T\text{ N}$.
2D torque:
$$\tau = r_x F_y - r_y F_x = (2.0)(50.0) - (0.0)(-10.0) = 100.0 - 0.0 = +100.00\text{ N}\cdot\text{m}$$
The torque induces a counter-clockwise angular acceleration of $100\text{ N}\cdot\text{m}$.

---

### Solution to Exercise 6.7
Taking moments about the center of mass $\mathbf{c}$ at rotational equilibrium:
The horizontal force $F$ at height $h$ creates clockwise torque: $\tau_{\text{ext}} = -F h$.
The two normal forces $F_1$ (left at $-W/2$) and $F_2$ (right at $+W/2$) create torque:
$$\tau_{\text{normal}} = \left(-\frac{W}{2}\right) F_1 + \left(+\frac{W}{2}\right) F_2 = \frac{W}{2} (F_2 - F_1)$$
For equilibrium:
$$\frac{W}{2} (F_2 - F_1) - F h = 0 \implies F_2 - F_1 = \frac{2 F h}{W}$$
Vertical force balance: $F_1 + F_2 = mg \implies F_2 = mg - F_1$.
Substituting:
$$(mg - F_1) - F_1 = \frac{2 F h}{W} \implies mg - 2 F_1 = \frac{2 F h}{W} \implies 2 F_1 = mg - \frac{2 F h}{W}$$
$$F_1 = \frac{1}{2} mg - \frac{F h}{W}$$
Tipping occurs the exact instant the uphill contact point loses contact ($F_1 = 0$):
$$\frac{1}{2} mg - \frac{F_{\text{tip}} h}{W} = 0 \implies F_{\text{tip}} = \frac{mg W}{2h} \quad \blacksquare$$

---

### Solution to Exercise 6.8
When two contact points are nearly identical ($d \approx 1.5\times 10^{-4}\text{ m}$), their contact normal vectors and moment arms $\mathbf{r}_1, \mathbf{r}_2$ are virtually collinear:
$$\mathbf{r}_1 \approx \mathbf{r}_2$$
In the constraint Jacobian matrix $\mathbf{J}$, the constraint rows for the two contacts become linearly dependent:
$$\mathbf{J}_1 \approx \mathbf{J}_2$$
In the effective mass matrix $\mathbf{K} = \mathbf{J} \mathbf{M}^{-1} \mathbf{J}^T$, this near-linear dependency causes the determinant $\det(\mathbf{K}) \to 0$, producing a condition number $\kappa(\mathbf{K}) \gg 10^8$.
Iterative solvers (Projected Gauss-Seidel) struggle with extreme numerical oscillation, dividing by near-zero pivots and causing resting objects to jitter violently. Merging points below $\epsilon$ restores full linear independence.

---

### Solution to Exercise 6.9
In 3D space, clipping two intersecting polygonal faces (e.g. two 8-sided polygons) can produce a contact polygon with 8 to 16 vertices.
Solving an LCP constraint system scales quadratically with the number of constraints per island ($\mathcal{O}(K^2)$).
By Carathéodory's theorem and convex geometry, any 2D planar contact polygon can be conservatively bounded by a 4-vertex quadrilateral (the 4 points that maximize projected surface area).
Clipping to 4 contact points provides full 3D resting stability (resisting pitch, roll, and yaw torques) while capping constraint rows to exactly 4 per face collision, guaranteeing bounded $60\text{ Hz}$ execution.

---

### Solution to Exercise 6.10
Iterative sequential impulse solvers converge much faster if initialized with the impulse solution from the previous frame ($\lambda_0 = \lambda_{\text{accumulated}}$).
However, for this cache to be valid, the engine must know that contact point $k$ in frame $n+1$ represents the **exact same physical contact feature** as in frame $n$.
By generating a unique 32-bit **Contact Feature ID**:
$$\text{FeatureID} = (\text{ReferenceEdgeID} \ll 16) \,|\, (\text{IncidentVertexID})$$
The engine matches contact points across ticks even as bodies move. When a feature ID matches, the cached normal impulse $\lambda_n$ is immediately applied at the start of the tick, eliminating settling bounce and stabilizing tall stacks of resting objects. $\blacksquare$
