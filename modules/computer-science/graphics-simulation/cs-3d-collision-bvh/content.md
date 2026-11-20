# 3D Collision Detection and Bounding Volume Hierarchies (BVH)

---

## 1. The Epistemological Challenge: The Curse of Dimensionality in 3D Space

### 1.1 From 2D Pixels to 3D Polygon Meshes
In 2D physics simulations, broadphase spatial grids work remarkably well because space scales quadratically ($\mathcal{O}(L^2)$).

In modern 3D graphics and physical simulations (such as autonomous driving simulators, robotic arm workspaces, or modern video games), environments contain **millions of 3D polygonal triangles**.  
Furthermore, 3D space scales cubically ($\mathcal{O}(L^3)$). A uniform grid with 1,000 divisions per axis requires **1,000,000,000 cells**—consuming gigabytes of memory, with $99.9\%$ of cells remaining completely empty.

Testing a single ray (from a LiDAR sensor or physical bullet) against 1,000,000 triangles at 60 FPS would require 60,000,000 intersection checks per frame!  
We must organize spatial geometry hierarchically so that ray and physics queries execute in **logarithmic time ($\mathcal{O}(\log N)$)**.

---

## 2. Bounding Volume Hierarchies (BVH)

A **Bounding Volume Hierarchy (BVH)** is a balanced tree data structure where:
1. Every **leaf node** wraps one or more geometric primitives (triangles, spheres).
2. Every **internal node** stores an Axis-Aligned Bounding Box (AABB) that tightly encloses all geometry contained within its child subtrees.
3. The **root node** encloses the entire physical world.

```
                  [ Root AABB (Encloses All) ]
                          /          \
            [ Left Child AABB ]   [ Right Child AABB ]
                /        \             /         \
            [ Leaf 1 ] [ Leaf 2 ]  [ Leaf 3 ]  [ Leaf 4 ]
            (Triangle) (Triangle)  (Triangle)  (Triangle)
```

### 2.1 The Surface Area Heuristic (SAH)
How do we decide where to split a set of primitives to build the most efficient search tree?  
The **Surface Area Heuristic (SAH)** models the statistical probability that a random ray will strike a bounding box, which is directly proportional to the **surface area** of the box ($SA$):

$$ C = C_{\text{trav}} + P_L \cdot C_L + P_R \cdot C_R = C_{\text{trav}} + \frac{SA(L)}{SA(P)} N_L C_{\text{isect}} + \frac{SA(R)}{SA(P)} N_R C_{\text{isect}} $$
where:
- $C_{\text{trav}}$: Cost of traversing an internal tree node.
- $C_{\text{isect}}$: Cost of testing a ray-primitive intersection.
- $SA(L), SA(R), SA(P)$: Surface areas of left child, right child, and parent boxes.
- $N_L, N_R$: Number of primitives in the left and right children.

By testing candidate split planes along X, Y, and Z axes and choosing the split that **minimizes cost $C$**, SAH builds trees that allow ray queries to prune $99.99\%$ of the world geometry in a few pointer hops!

---

## 3. High-Performance 3D Narrowphase Primitives

### 3.1 3D Ray-AABB Slab Intersection (Kay-Kajiya)
An AABB is the intersection of three pairs of parallel infinite planes ("slabs") along X, Y, and Z.
For a 3D ray $\vec{R}(t) = \vec{P} + t \vec{D}$:
$$ t_{1, i} = \frac{\text{box}_{\min, i} - P_i}{D_i}, \quad t_{2, i} = \frac{\text{box}_{\max, i} - P_i}{D_i} \quad \text{for } i \in \{x, y, z\} $$
$$ t_{\text{enter}} = \max(\min(t_{1, x}, t_{2, x}), \min(t_{1, y}, t_{2, y}), \min(t_{1, z}, t_{2, z})) $$
$$ t_{\text{exit}} = \min(\max(t_{1, x}, t_{2, x}), \max(t_{1, y}, t_{2, y}), \max(t_{1, z}, t_{2, z})) $$

**Intersection Condition:**
$$ t_{\text{enter}} \le t_{\text{exit}} \quad \text{and} \quad t_{\text{exit}} \ge 0 $$

---

### 3.2 The Möller-Trumbore Fast Ray-Triangle Algorithm
In 1997, Tomas Möller and Ben Trumbore invented an algorithm to intersect a ray with a triangle $V_0, V_1, V_2$ **without ever precomputing the plane equation of the triangle**.

Any point $T(u, v)$ on the triangle can be written in **Barycentric Coordinates**:
$$ T(u, v) = (1 - u - v)V_0 + u V_1 + v V_2 = V_0 + u(V_1 - V_0) + v(V_2 - V_0) $$
where $u \ge 0, v \ge 0$, and $u + v \le 1$.

Equating the ray equation to the triangle point:
$$ P + t D = V_0 + u(V_1 - V_0) + v(V_2 - V_0) $$
Let $\vec{e}_1 = V_1 - V_0$, $\vec{e}_2 = V_2 - V_0$, and $\vec{s} = P - V_0$:
$$ [-D, \vec{e}_1, \vec{e}_2] \begin{bmatrix} t \\ u \\ v \end{bmatrix} = \vec{s} $$

Solving this linear system using **Cramer's Rule**:
$$ \begin{bmatrix} t \\ u \\ v \end{bmatrix} = \frac{1}{\det[-D, \vec{e}_1, \vec{e}_2]} \begin{bmatrix} \det[\vec{s}, \vec{e}_1, \vec{e}_2] \\ \det[-D, \vec{s}, \vec{e}_2] \\ \det[-D, \vec{e}_1, \vec{s}] \end{bmatrix} $$
Using vector identities:
$$ \det[-D, \vec{e}_1, \vec{e}_2] = (D \times \vec{e}_2) \cdot \vec{e}_1 = \vec{p}_{\text{vec}} \cdot \vec{e}_1 $$
$$ u = \frac{\vec{s} \cdot \vec{p}_{\text{vec}}}{\vec{p}_{\text{vec}} \cdot \vec{e}_1}, \quad v = \frac{D \cdot (\vec{s} \times \vec{e}_1)}{\vec{p}_{\text{vec}} \cdot \vec{e}_1}, \quad t = \frac{\vec{e}_2 \cdot (\vec{s} \times \vec{e}_1)}{\vec{p}_{\text{vec}} \cdot \vec{e}_1} $$

If $u \in [0, 1]$, $v \in [0, 1]$, $u + v \le 1$, and $t > 0$, the ray hits the triangle at distance $t$!

---

### 3.3 The 15-Axis Separating Axis Theorem (SAT) for 3D OBBs
An Oriented Bounding Box (OBB) is a box that can rotate freely in 3D space.  
By the Separating Axis Theorem, two non-intersecting convex 3D boxes must have a separating plane perpendicular to one of **15 potential axes**:

| Axis Type | Description | Count |
| :--- | :--- | :--- |
| **Face Normals of Box A** | $\hat{u}_1, \hat{u}_2, \hat{u}_3$ | 3 axes |
| **Face Normals of Box B** | $\hat{v}_1, \hat{v}_2, \hat{v}_3$ | 3 axes |
| **Edge Cross Products** | $\hat{u}_i \times \hat{v}_j$ for all $i, j \in \{1, 2, 3\}$ | $3 \times 3 = 9$ axes |
| **Total Test Axes** | | **15 axes** |

If the 1D projected intervals of the two boxes do not overlap on *even a single one* of these 15 axes, the boxes do not collide (early exit!). If all 15 axes overlap, the boxes are colliding.

---

## 4. Multi-Tiered Worked Examples

### Level 1: 3D AABB Overlap Query
- Box A: $[0, 4] \times [0, 4] \times [0, 4]$
- Box B: $[3, 7] \times [2, 6] \times [1, 5]$
Determine whether Box A and Box B overlap, and calculate the overlapping volume.

**Step-by-step Solution:**
1. Check overlap on X-axis:
   $\max(0, 3) \le \min(4, 7) \implies 3 \le 4$ (Overlap: $[3, 4]$, length $\Delta x = 1$)
2. Check overlap on Y-axis:
   $\max(0, 2) \le \min(4, 6) \implies 2 \le 4$ (Overlap: $[2, 4]$, length $\Delta y = 2$)
3. Check overlap on Z-axis:
   $\max(0, 1) \le \min(4, 5) \implies 1 \le 4$ (Overlap: $[1, 4]$, length $\Delta z = 3$)
Since all 3 axes overlap, **the boxes collide!**
Overlapping intersection volume:
$$ V_{\text{overlap}} = \Delta x \times \Delta y \times \Delta z = 1 \times 2 \times 3 = \mathbf{6.0 \text{ m}^3} $$

---

### Level 2: Möller-Trumbore Ray-Triangle Hit Calculation
A triangle has vertices $V_0(0, 0, 0)$, $V_1(2, 0, 0)$, $V_2(0, 2, 0)$ in the XY-plane.  
A ray fires from origin $P(0.5, 0.5, 5)$ along direction $\vec{D} = (0, 0, -1)$ straight down.
1. Determine if the ray hits the triangle.
2. Find the barycentric coordinates $(u, v)$ and hit distance $t$.

**Step-by-step Solution:**
1. Edge vectors:
   $$ \vec{e}_1 = V_1 - V_0 = (2, 0, 0), \quad \vec{e}_2 = V_2 - V_0 = (0, 2, 0) $$
2. Vector $\vec{p}_{\text{vec}} = \vec{D} \times \vec{e}_2$:
   $$ \vec{p}_{\text{vec}} = (0, 0, -1) \times (0, 2, 0) = (2, 0, 0) $$
3. Determinant:
   $$ \det = \vec{e}_1 \cdot \vec{p}_{\text{vec}} = (2)(2) + (0)(0) + (0)(0) = 4.0 \neq 0 \quad (\text{Not parallel}) $$
4. Vector $\vec{s} = P - V_0 = (0.5, 0.5, 5.0)$:
5. Barycentric coordinate $u$:
   $$ u = \frac{\vec{s} \cdot \vec{p}_{\text{vec}}}{\det} = \frac{(0.5)(2) + 0 + 0}{4.0} = \frac{1.0}{4.0} = \mathbf{0.25} $$
6. Vector $\vec{q}_{\text{vec}} = \vec{s} \times \vec{e}_1$:
   $$ \vec{q}_{\text{vec}} = (0.5, 0.5, 5.0) \times (2, 0, 0) = (0, 10.0, -1.0) $$
7. Barycentric coordinate $v$:
   $$ v = \frac{\vec{D} \cdot \vec{q}_{\text{vec}}}{\det} = \frac{(0)(0) + (0)(10) + (-1)(-1.0)}{4.0} = \frac{1.0}{4.0} = \mathbf{0.25} $$
8. Validity test:
   $u = 0.25 \ge 0$, $v = 0.25 \ge 0$, $u + v = 0.50 \le 1.0$. **Hit confirmed!**
9. Distance $t$:
   $$ t = \frac{\vec{e}_2 \cdot \vec{q}_{\text{vec}}}{\det} = \frac{(0)(0) + (2)(10.0) + (0)(-1.0)}{4.0} = \frac{20.0}{4.0} = \mathbf{5.0 \text{ m}} $$
The ray strikes the triangle exactly at $(0.5, 0.5, 0)$ at distance $t = 5.0$.

---

## 5. Production-Ready Computational Engine: Möller-Trumbore Raycaster

```typescript
export interface RayHit {
  hit: boolean;
  t: number;
  u: number;
  v: number;
  point: { x: number; y: number; z: number };
}

export class RaycastEngine {
  /**
   * High-speed Möller-Trumbore ray-triangle intersection test.
   */
  public static intersectRayTriangle(
    origin: { x: number; y: number; z: number },
    dir: { x: number; y: number; z: number },
    v0: { x: number; y: number; z: number },
    v1: { x: number; y: number; z: number },
    v2: { x: number; y: number; z: number },
    epsilon = 1e-8
  ): RayHit {
    const noHit: RayHit = { hit: false, t: 0, u: 0, v: 0, point: { x: 0, y: 0, z: 0 } };

    // Edge vectors e1 = v1 - v0, e2 = v2 - v0
    const e1x = v1.x - v0.x;
    const e1y = v1.y - v0.y;
    const e1z = v1.z - v0.z;

    const e2x = v2.x - v0.x;
    const e2y = v2.y - v0.y;
    const e2z = v2.z - v0.z;

    // pvec = dir x e2
    const pvecX = dir.y * e2z - dir.z * e2y;
    const pvecY = dir.z * e2x - dir.x * e2z;
    const pvecZ = dir.x * e2y - dir.y * e2x;

    const det = e1x * pvecX + e1y * pvecY + e1z * pvecZ;

    // Ray is parallel to triangle plane if det is near zero
    if (Math.abs(det) < epsilon) return noHit;
    const invDet = 1 / det;

    // s = origin - v0
    const sx = origin.x - v0.x;
    const sy = origin.y - v0.y;
    const sz = origin.z - v0.z;

    // u = (s · pvec) * invDet
    const u = (sx * pvecX + sy * pvecY + sz * pvecZ) * invDet;
    if (u < 0 || u > 1) return noHit;

    // qvec = s x e1
    const qvecX = sy * e1z - sz * e1y;
    const qvecY = sz * e1x - sx * e1z;
    const qvecZ = sx * e1y - sy * e1x;

    // v = (dir · qvec) * invDet
    const v = (dir.x * qvecX + dir.y * qvecY + dir.z * qvecZ) * invDet;
    if (v < 0 || u + v > 1) return noHit;

    // t = (e2 · qvec) * invDet
    const t = (e2x * qvecX + e2y * qvecY + e2z * qvecZ) * invDet;
    if (t < epsilon) return noHit; // Hit behind ray origin

    return {
      hit: true,
      t,
      u,
      v,
      point: {
        x: origin.x + t * dir.x,
        y: origin.y + t * dir.y,
        z: origin.z + t * dir.z
      }
    };
  }
}
```

---

## 6. Socratic Self-Check & Verification

1. **Question:** Why does the Möller-Trumbore algorithm avoid computing the normal and plane equation of the triangle?
   - **Answer:** Precomputing and storing plane equations for 1,000,000 triangles consumes $16 \text{ MB}$ of additional memory and causes CPU cache thrashing. Möller-Trumbore solves the intersection directly from vertex positions using Cramer's rule on-the-fly, reducing memory overhead to the absolute minimum.
2. **Question:** Why are 15 axes required to test intersection between two 3D Oriented Bounding Boxes (OBBs), while only 4 axes are needed in 2D?
   - **Answer:** In 2D, two convex polygons can only separate along face normals ($2 + 2 = 4$). In 3D, two rotated boxes can contact edge-to-edge (like two crossing pencils). Separating edge-to-edge contacts requires testing the cross product of every edge of Box A with every edge of Box B ($3 \times 3 = 9$ additional axes), totaling $3 + 3 + 9 = 15$ axes.
3. **Question:** What is the core principle behind the Surface Area Heuristic (SAH) in BVH construction?
   - **Answer:** By geometric probability (Crofton's formula), the probability that a uniformly distributed random ray strikes a convex volume is proportional to its surface area. SAH partitions primitives to minimize total expected surface area and intersection cost across child nodes.
