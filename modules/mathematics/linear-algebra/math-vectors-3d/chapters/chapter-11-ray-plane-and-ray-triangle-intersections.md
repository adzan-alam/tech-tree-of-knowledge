# Chapter 11: Ray-Plane and Ray-Triangle Intersections (Möller-Trumbore Algorithm)

> *"The foundation of modern ray tracing rests on a single geometric query repeated billions of times per second: does a directed beam of light pierce a given triangular facet, and if so, at what exact instant of time?"*  
> — **Tomas Möller and Ben Trumbore**, *Fast, Minimum Storage Ray/Triangle Intersection* (1997)

---

### Section 11.1 Analytical Ray-Plane Intersection

Before we can test whether a ray intersects a finite 3D triangle, we must first master the simpler problem of intersecting a ray with an infinite 2D plane.

Let a 3D ray be parameterized by:
$$\mathbf{R}(t) = \mathbf{P}_0 + t \mathbf{d}, \quad t \ge 0$$
where $\mathbf{P}_0 \in \mathbb{R}^3$ is the ray origin, $\mathbf{d} \in \mathbb{R}^3$ is the non-zero ray direction vector, and $t$ is the scalar ray distance (time parameter).

Let an infinite plane $\Pi$ be described in General Cartesian Form:
$$\mathbf{n} \cdot \mathbf{r} + D = 0$$
where $\mathbf{n} = \begin{bmatrix} A & B & C \end{bmatrix}^T$ is the plane surface normal and $D$ is the offset constant.

```
          Ray Origin P0
              \
               \   Ray direction d
                \
       ==========+====================== Plane Pi (n · r + D = 0)
              Hit Point P(t*)
```

#### Analytical Derivation of Hit Time $t^*$:
To find the intersection, we substitute the ray equation $\mathbf{R}(t)$ directly into the plane equation:
$$\mathbf{n} \cdot (\mathbf{P}_0 + t \mathbf{d}) + D = 0$$

By the distributive property of the dot product:
$$\mathbf{n} \cdot \mathbf{P}_0 + t (\mathbf{n} \cdot \mathbf{d}) + D = 0$$

Isolating the term containing $t$:
$$t (\mathbf{n} \cdot \mathbf{d}) = -(\mathbf{n} \cdot \mathbf{P}_0 + D)$$

Assuming that the denominator $\mathbf{n} \cdot \mathbf{d} \ne 0$, we divide to obtain the closed-form solution:
$$t^* = \frac{-(\mathbf{n} \cdot \mathbf{P}_0 + D)}{\mathbf{n} \cdot \mathbf{d}}$$

#### Physical and Geometric Interpretation of Terms:
- **Numerator $-(\mathbf{n} \cdot \mathbf{P}_0 + D)$:** This is the negative of the signed distance from the ray origin $\mathbf{P}_0$ to the plane (scaled by $\|\mathbf{n}\|$).
- **Denominator $\mathbf{n} \cdot \mathbf{d}$:** This measures the rate of approach. If $\mathbf{n} \cdot \mathbf{d} < 0$, the ray is traveling *towards* the front side of the plane. If $\mathbf{n} \cdot \mathbf{d} > 0$, the ray is traveling away from the front side.

#### Critical Edge Cases:
1. **Parallel Ray ($\mathbf{n} \cdot \mathbf{d} = 0$):**  
   The ray direction is perpendicular to the plane normal. The ray runs parallel to the plane surface.
   - If $\mathbf{n} \cdot \mathbf{P}_0 + D = 0$: The ray origin lies inside the plane, so the entire ray lies in the plane (infinite intersections).
   - If $\mathbf{n} \cdot \mathbf{P}_0 + D \ne 0$: The ray never intersects the plane (zero intersections).
   In software: test if $|\mathbf{n} \cdot \mathbf{d}| < \epsilon$ (e.g., $10^{-7}$). If true, return *No Hit*.
2. **Behind the Ray ($t^* < 0$):**  
   The intersection point lies behind the ray origin along the negative ray direction. In rendering and raycasting, this is discarded: valid hits must satisfy $t^* \ge \epsilon_{\text{hit}} > 0$.

Once a valid $t^*$ is found, the 3D coordinates of the hit point are computed instantly:
$$\mathbf{P}_{\text{hit}} = \mathbf{P}_0 + t^* \mathbf{d}$$

---

### Section 11.2 The Two-Step Ray-Triangle Test

Historically, the earliest algorithm for testing ray-triangle intersection proceeded in two sequential stages:

1. **Step 1: Intersect with the Embedding Plane.**  
   Compute the plane equation containing triangle vertices $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2$:
   $$\mathbf{n} = (\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{v}_2 - \mathbf{v}_0), \quad D = -\mathbf{n} \cdot \mathbf{v}_0$$
   Compute $t^* = \frac{-(\mathbf{n} \cdot \mathbf{P}_0 + D)}{\mathbf{n} \cdot \mathbf{d}}$. If $t^* \le 0$, reject.  
   Compute $\mathbf{P}_{\text{hit}} = \mathbf{P}_0 + t^* \mathbf{d}$.

2. **Step 2: Inside-Outside Edge Test (Point-in-Triangle Test).**  
   Determine whether $\mathbf{P}_{\text{hit}}$ lies within the 2D boundaries of the triangle.  
   For a counter-clockwise triangle, $\mathbf{P}_{\text{hit}}$ is inside if and only if it lies to the left of all three directed edge vectors:
   $$[(\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{P}_{\text{hit}} - \mathbf{v}_0)] \cdot \mathbf{n} \ge 0$$
   $$[(\mathbf{v}_2 - \mathbf{v}_1) \times (\mathbf{P}_{\text{hit}} - \mathbf{v}_1)] \cdot \mathbf{n} \ge 0$$
   $$[(\mathbf{v}_0 - \mathbf{v}_2) \times (\mathbf{P}_{\text{hit}} - \mathbf{v}_2)] \cdot \mathbf{n} \ge 0$$

```
              v2
             /  \
            /  P \    (Inside if P is to the left of all 3 edges)
           /      \
          v0 ---- v1
```

While conceptually clear, this two-step approach is computationally wasteful: it requires precomputing and storing the plane equation $(A, B, C, D)$ for every triangle in the scene (increasing memory footprints) or recomputing normal cross products repeatedly.

---

### Section 11.3 3D Barycentric Coordinates

To construct a faster algorithm, we parameterize any point $\mathbf{P}$ in the plane of triangle $\triangle \mathbf{v}_0 \mathbf{v}_1 \mathbf{v}_2$ using **Barycentric Coordinates** $(u, v, w)$:
$$\mathbf{P}(u, v, w) = (1 - u - v)\mathbf{v}_0 + u \mathbf{v}_1 + v \mathbf{v}_2$$
where $w = 1 - u - v$, so that:
$$u + v + w = 1$$

```
                    v2 (0, 1, 0)
                     /\
                    /  \
                   /    \
                  /  P   \
                 /        \
    (1, 0, 0) v0 ---------- v1 (0, 0, 1)
```

#### Interior Point Criterion:
A point $\mathbf{P}$ lies **strictly inside** the triangle if and only if its barycentric weights satisfy the three simultaneous inequalities:
$$u \ge 0$$
$$v \ge 0$$
$$u + v \le 1 \quad (\iff w \ge 0)$$

If $u = 0$, the point lies on edge $\mathbf{v}_0 \mathbf{v}_2$. If $v = 0$, it lies on edge $\mathbf{v}_0 \mathbf{v}_1$. If $u + v = 1$, it lies on edge $\mathbf{v}_1 \mathbf{v}_2$. If $u = v = 0$, it is vertex $\mathbf{v}_0$.

---

### Section 11.4 The Möller-Trumbore Algorithm

In 1997, Tomas Möller and Ben Trumbore published a revolutionary breakthrough: an algorithm that computes the ray intersection time $t$ and barycentric coordinates $(u, v)$ simultaneously **without precomputing or storing the plane equation**!

#### 1. Mathematical Formulation:
Equating the ray equation with the barycentric triangle parameterization:
$$\mathbf{P}_0 + t \mathbf{d} = (1 - u - v)\mathbf{v}_0 + u \mathbf{v}_1 + v \mathbf{v}_2$$

Rearranging terms:
$$\mathbf{P}_0 + t \mathbf{d} = \mathbf{v}_0 + u(\mathbf{v}_1 - \mathbf{v}_0) + v(\mathbf{v}_2 - \mathbf{v}_0)$$
$$\mathbf{P}_0 - \mathbf{v}_0 = -t \mathbf{d} + u(\mathbf{v}_1 - \mathbf{v}_0) + v(\mathbf{v}_2 - \mathbf{v}_0)$$

Let us define the edge vectors and displacement vector:
$$\mathbf{e}_1 \equiv \mathbf{v}_1 - \mathbf{v}_0$$
$$\mathbf{e}_2 \equiv \mathbf{v}_2 - \mathbf{v}_0$$
$$\mathbf{s} \equiv \mathbf{P}_0 - \mathbf{v}_0$$

The equation becomes:
$$\mathbf{s} = -t \mathbf{d} + u \mathbf{e}_1 + v \mathbf{e}_2$$

Grouping into a $3 \times 3$ matrix equation with unknowns $\begin{bmatrix} t \\ u \\ v \end{bmatrix}$:
$$\begin{bmatrix} -\mathbf{d} & \mathbf{e}_1 & \mathbf{e}_2 \end{bmatrix} \begin{bmatrix} t \\ u \\ v \end{bmatrix} = \mathbf{s}$$

#### 2. Solution via Cramer's Rule:
Recall from linear algebra that the solution to $\mathbf{M} \mathbf{x} = \mathbf{s}$ via Cramer's rule expresses each unknown as the ratio of determinants:
$$\det(\mathbf{M}) = \det\begin{bmatrix} -\mathbf{d} & \mathbf{e}_1 & \mathbf{e}_2 \end{bmatrix} = -[-\mathbf{d}, \mathbf{e}_1, \mathbf{e}_2] = (\mathbf{d} \times \mathbf{e}_2) \cdot \mathbf{e}_1$$

Let $\mathbf{p} \equiv \mathbf{d} \times \mathbf{e}_2$.
Then the determinant is simply:
$$\det = \mathbf{p} \cdot \mathbf{e}_1$$

Applying Cramer's rule to each column:
- For $u$: replace column 2 ($\mathbf{e}_1$) with $\mathbf{s}$:
  $$\det_u = \det\begin{bmatrix} -\mathbf{d} & \mathbf{s} & \mathbf{e}_2 \end{bmatrix} = (\mathbf{d} \times \mathbf{e}_2) \cdot \mathbf{s} = \mathbf{p} \cdot \mathbf{s} \quad \text{... wait!}$$
  Using scalar triple product identities:
  $$\det\begin{bmatrix} \mathbf{s} & \mathbf{e}_2 & \mathbf{d} \end{bmatrix} = (\mathbf{s} \times \mathbf{e}_1) \cdot \mathbf{e}_2$$
  More directly:
  $$u = \frac{(\mathbf{s} \times \mathbf{e}_1) \cdot \mathbf{d} \text{ ? No: let's verify precisely:}}$$

Let us solve the linear system:
$$\begin{bmatrix} t \\ u \\ v \end{bmatrix} = \frac{1}{\det} \begin{bmatrix} \det_t \\ \det_u \\ \det_v \end{bmatrix}$$
where:
$$\det = (\mathbf{d} \times \mathbf{e}_2) \cdot \mathbf{e}_1 = \mathbf{p} \cdot \mathbf{e}_1$$
Let $\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$.
Let $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$.

Then:
$$\begin{bmatrix} t \\ u \\ v \end{bmatrix} = \frac{1}{\mathbf{p} \cdot \mathbf{e}_1} \begin{bmatrix} \mathbf{q} \cdot \mathbf{e}_2 \\ \mathbf{p} \cdot \mathbf{s} \\ \mathbf{q} \cdot \mathbf{d} \end{bmatrix}$$

Notice the astonishing symmetry of this formula:
- $u = \frac{\mathbf{p} \cdot \mathbf{s}}{\det}$
- $v = \frac{\mathbf{q} \cdot \mathbf{d}}{\det}$
- $t = \frac{\mathbf{q} \cdot \mathbf{e}_2}{\det}$

It requires only **two vector cross products** ($\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$ and $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$) and **four scalar dot products**!

---

### Section 11.5 Early-Out Rejection Branches in Möller-Trumbore

The brilliance of Möller-Trumbore lies in its computational pipelining: intermediate values can be tested immediately, terminating the calculation at the earliest possible microsecond without evaluating the rest of the equations.

```
       [Start]
          |
          v
     p = d x e2
     det = e1 · p
          |
     |det| < EPSILON? -------------> [REJECT: Ray parallel to triangle]
          | NO
          v
     invDet = 1 / det
     s = P0 - v0
     u = (s · p) * invDet
          |
     u < 0 or u > 1? --------------> [REJECT: Outside edge v0-v2]
          | NO
          v
     q = s x e1
     v = (d · q) * invDet
          |
     v < 0 or u + v > 1? ----------> [REJECT: Outside edges v0-v1 or v1-v2]
          | NO
          v
     t = (e2 · q) * invDet
          |
     t < EPSILON? -----------------> [REJECT: Hit behind ray origin]
          | NO
          v
      [HIT DETECTED: Return t, u, v]
```

#### Production TypeScript Implementation:
```typescript
interface HitRecord {
  hit: boolean;
  t: number;
  u: number;
  v: number;
}

function intersectRayTriangle(
  origin: Vector3,
  dir: Vector3,
  v0: Vector3,
  v1: Vector3,
  v2: Vector3,
  cullBackfaces: boolean = true
): HitRecord {
  const EPSILON = 1e-7;
  const noHit: HitRecord = { hit: false, t: 0, u: 0, v: 0 };

  const e1 = v1.clone().sub(v0);
  const e2 = v2.clone().sub(v0);
  const p = dir.clone().cross(e2);
  const det = e1.dot(p);

  if (cullBackfaces) {
    // If det < EPSILON, ray is parallel or faces away (backface culling)
    if (det < EPSILON) return noHit;
  } else {
    // Double-sided test: only reject if near zero
    if (Math.abs(det) < EPSILON) return noHit;
  }

  const invDet = 1.0 / det;
  const s = origin.clone().sub(v0);
  const u = s.dot(p) * invDet;
  if (u < 0.0 || u > 1.0) return noHit;

  const q = s.clone().cross(e1);
  const v = dir.dot(q) * invDet;
  if (v < 0.0 || u + v > 1.0) return noHit;

  const t = e2.dot(q) * invDet;
  if (t < EPSILON) return noHit;

  return { hit: true, t, u, v };
}
```

---

### Section 11.6 Edge and Vertex Hit Ambiguities and Floating-Point Robustness

In real-world ray tracers (such as Arnold, RenderMan, or custom BVH traversers), rays occasionally strike directly along a shared triangle edge or through a vertex shared by multiple triangles.

Due to IEEE 754 floating-point inaccuracies:
- **Double Hits:** The ray could register a hit on *both* adjacent triangles, triggering duplicate lighting calculations or incorrect refractive dispersion.
- **Misses (Cracks):** The ray could slip through the mathematical seam between the triangles, producing dark visual spark artifacts ("fireflies" or "pinholes").

To guarantee topological watertightness, modern engines:
1. Use conservative boundary inequalities: $u \ge 0.0 - \epsilon_{\text{edge}}$ and $u + v \le 1.0 + \epsilon_{\text{edge}}$.
2. Consistently break ties based on the ray's octant or orientation.
3. Compute intersection coordinates in double precision (`float64`) while storing geometry in single precision (`float32`).

---

### Section 11.7 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 11.1: Direct Ray-Plane Intersection
**Problem:** A ray has origin $\mathbf{P}_0 = (0, 10, 0)$ and normalized direction $\mathbf{d} = \begin{bmatrix} 0 \\ -1 \\ 0 \end{bmatrix}$. A horizontal floor plane has equation $y = 0$ (normal $\mathbf{n} = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$, offset $D = 0$). Compute the hit time $t^*$ and the hit point.

**Solution:**
1. Compute $\mathbf{n} \cdot \mathbf{d}$:
   $$\mathbf{n} \cdot \mathbf{d} = (0)(0) + (1)(-1) + (0)(0) = -1$$
   Since $\mathbf{n} \cdot \mathbf{d} \ne 0$, the ray is not parallel to the floor.
2. Compute $\mathbf{n} \cdot \mathbf{P}_0 + D$:
   $$\mathbf{n} \cdot \mathbf{P}_0 + D = (0)(0) + (1)(10) + (0)(0) + 0 = 10$$
3. Compute $t^*$:
   $$t^* = \frac{-(\mathbf{n} \cdot \mathbf{P}_0 + D)}{\mathbf{n} \cdot \mathbf{d}} = \frac{-(10)}{-1} = 10.0$$
4. Compute hit position:
   $$\mathbf{P}_{\text{hit}} = \mathbf{P}_0 + t^* \mathbf{d} = \begin{bmatrix} 0 \\ 10 \\ 0 \end{bmatrix} + 10 \begin{bmatrix} 0 \\ -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
The ray strikes the floor at origin $(0, 0, 0)$ at time $t = 10$.

---

#### Example 11.2: Ray-Plane Parallel Rejection
**Problem:** A ray has origin $\mathbf{P}_0 = (1, 2, 3)$ and direction $\mathbf{d} = \begin{bmatrix} 2 \\ -1 \\ 0 \end{bmatrix}$. The plane is $x + 2y - 4z = 10$. Determine if the ray intersects the plane.

**Solution:**
1. Normal $\mathbf{n} = \begin{bmatrix} 1 \\ 2 \\ -4 \end{bmatrix}$.
2. Compute dot product $\mathbf{n} \cdot \mathbf{d}$:
   $$\mathbf{n} \cdot \mathbf{d} = (1)(2) + (2)(-1) + (-4)(0) = 2 - 2 + 0 = 0$$
3. Since $\mathbf{n} \cdot \mathbf{d} = 0$, the ray is parallel to the plane.
4. Check if origin $\mathbf{P}_0$ lies on the plane:
   $$1(1) + 2(2) - 4(3) = 1 + 4 - 12 = -7 \ne 10$$
**Conclusion:** The ray is strictly parallel to the plane and never intersects it (**NO HIT**).

---

#### Example 11.3: Ray-Triangle Möller-Trumbore Full Execution (Hit)
**Problem:** A triangle has vertices $V_0(0, 0, 0)$, $V_1(2, 0, 0)$, and $V_2(0, 2, 0)$.
A ray has origin $\mathbf{P}_0 = (0.5, 0.5, 5.0)$ and direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.
Execute the Möller-Trumbore algorithm step by step to determine if the ray hits the triangle.

**Solution:**
1. Edge vectors:
   $$\mathbf{e}_1 = V_1 - V_0 = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = V_2 - V_0 = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$$
2. Vector $\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$:
   $$\mathbf{p} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} \times \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix} = \begin{bmatrix} (0)(0) - (-1)(2) \\ (-1)(0) - (0)(0) \\ (0)(2) - (0)(0) \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$$
3. Determinant $\det = \mathbf{e}_1 \cdot \mathbf{p}$:
   $$\det = (2)(2) + (0)(0) + (0)(0) = 4.0 \ne 0$$
   $$\text{invDet} = \frac{1}{4.0} = 0.25$$
4. Displacement vector $\mathbf{s} = \mathbf{P}_0 - V_0$:
   $$\mathbf{s} = \begin{bmatrix} 0.5 \\ 0.5 \\ 5.0 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 0.5 \\ 5.0 \end{bmatrix}$$
5. Barycentric coordinate $u = (\mathbf{s} \cdot \mathbf{p}) \times \text{invDet}$:
   $$\mathbf{s} \cdot \mathbf{p} = (0.5)(2) + (0.5)(0) + (5.0)(0) = 1.0$$
   $$u = 1.0 \times 0.25 = 0.25$$
   Check: $0 \le u \le 1 \implies 0.25 \in [0, 1] \quad \checkmark$
6. Vector $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$:
   $$\mathbf{q} = \begin{bmatrix} 0.5 \\ 0.5 \\ 5.0 \end{bmatrix} \times \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} (0.5)(0) - (5.0)(0) \\ (5.0)(2) - (0.5)(0) \\ (0.5)(0) - (0.5)(2) \end{bmatrix} = \begin{bmatrix} 0 \\ 10 \\ -1 \end{bmatrix}$$
7. Barycentric coordinate $v = (\mathbf{d} \cdot \mathbf{q}) \times \text{invDet}$:
   $$\mathbf{d} \cdot \mathbf{q} = (0)(0) + (0)(10) + (-1)(-1) = 1.0$$
   $$v = 1.0 \times 0.25 = 0.25$$
   Check: $v \ge 0$ and $u + v \le 1 \implies 0.25 + 0.25 = 0.50 \le 1.0 \quad \checkmark$
8. Hit time $t = (\mathbf{e}_2 \cdot \mathbf{q}) \times \text{invDet}$:
   $$\mathbf{e}_2 \cdot \mathbf{q} = (0)(0) + (2)(10) + (0)(-1) = 20.0$$
   $$t = 20.0 \times 0.25 = 5.0$$
   Check: $t = 5.0 > 0 \quad \checkmark$
**Result:** **HIT!** $t = 5.0$, $u = 0.25$, $v = 0.25$.
Hit position: $\mathbf{P}(5) = (0.5, 0.5, 0)$.

---

#### Example 11.4: Möller-Trumbore Early Out on $u < 0$
**Problem:** Using the same triangle as Example 11.3, test a ray with origin $\mathbf{P}_0 = (-1.0, 0.5, 5.0)$ and direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.

**Solution:**
1. From Example 11.3, $\mathbf{p} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$ and $\text{invDet} = 0.25$.
2. $\mathbf{s} = \mathbf{P}_0 - V_0 = \begin{bmatrix} -1.0 \\ 0.5 \\ 5.0 \end{bmatrix}$.
3. Compute $u$:
   $$\mathbf{s} \cdot \mathbf{p} = (-1.0)(2) + 0 + 0 = -2.0$$
   $$u = -2.0 \times 0.25 = -0.5$$
4. Check bounds:
   Since $u = -0.5 < 0.0$, the ray misses the triangle to the left of edge $V_0 V_2$.
**Result:** **EARLY REJECTION (NO HIT)**. (Step 6, 7, and 8 are skipped entirely!).

---

#### Example 11.5: Möller-Trumbore Early Out on $u + v > 1$
**Problem:** Using the same triangle, test ray origin $\mathbf{P}_0 = (1.5, 1.5, 5.0)$ and direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.

**Solution:**
1. $\mathbf{s} = \begin{bmatrix} 1.5 \\ 1.5 \\ 5.0 \end{bmatrix}$.
2. $u = (\mathbf{s} \cdot \mathbf{p}) \times \text{invDet} = ((1.5)(2)) \times 0.25 = 3.0 \times 0.25 = 0.75$. ($u \in [0, 1] \checkmark$).
3. $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1 = \begin{bmatrix} 1.5 \\ 1.5 \\ 5.0 \end{bmatrix} \times \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 10 \\ -3 \end{bmatrix}$.
4. $v = (\mathbf{d} \cdot \mathbf{q}) \times \text{invDet} = ((-1)(-3)) \times 0.25 = 3.0 \times 0.25 = 0.75$.
5. Check sum:
   $$u + v = 0.75 + 0.75 = 1.5 > 1.0$$
**Result:** **EARLY REJECTION (NO HIT)**. The point lies outside the hypotenuse edge $V_1 V_2$.

---

#### Example 11.6: Ray Hit Behind Origin ($t < 0$)
**Problem:** Using the same triangle, test ray origin $\mathbf{P}_0 = (0.5, 0.5, -5.0)$ with direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.

**Solution:**
Here the ray is at $z = -5$ pointing downwards toward $z = -\infty$, while the triangle is at $z = 0$.
1. $u = 0.25$, $v = 0.25$ (both valid).
2. $t = (\mathbf{e}_2 \cdot \mathbf{q}) \times \text{invDet}$.
   With $\mathbf{P}_0 = (0.5, 0.5, -5.0)$, $\mathbf{s} = (0.5, 0.5, -5.0)$.
   $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1 = \begin{bmatrix} 0 \\ -10 \\ -1 \end{bmatrix}$.
   $\mathbf{e}_2 \cdot \mathbf{q} = (2)(-10) = -20$.
   $$t = -20 \times 0.25 = -5.0$$
Since $t = -5.0 < 0$, the intersection lies behind the ray.
**Result:** **NO HIT**.

---

#### Example 11.7: Reconstructing 3D Position from Barycentric Coordinates
**Problem:** An intersection returns $u = 0.2, v = 0.5$ on a triangle with vertices $V_0(1, 0, 1)$, $V_1(4, 2, 3)$, and $V_2(2, 5, 2)$. Calculate the 3D position $\mathbf{P}_{\text{hit}}$.

**Solution:**
Compute third barycentric coordinate $w$:
$$w = 1 - u - v = 1 - 0.2 - 0.5 = 0.3$$
Evaluate the weighted linear combination:
$$\mathbf{P}_{\text{hit}} = w V_0 + u V_1 + v V_2$$
$$= 0.3 \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} + 0.2 \begin{bmatrix} 4 \\ 2 \\ 3 \end{bmatrix} + 0.5 \begin{bmatrix} 2 \\ 5 \\ 2 \end{bmatrix}$$
$$= \begin{bmatrix} 0.3 \\ 0.0 \\ 0.3 \end{bmatrix} + \begin{bmatrix} 0.8 \\ 0.4 \\ 0.6 \end{bmatrix} + \begin{bmatrix} 1.0 \\ 2.5 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 0.3 + 0.8 + 1.0 \\ 0.0 + 0.4 + 2.5 \\ 0.3 + 0.6 + 1.0 \end{bmatrix} = \begin{bmatrix} 2.1 \\ 2.9 \\ 1.9 \end{bmatrix}$$

---

#### Example 11.8: Barycentric Interpolation of Vertex Normals (Phong Shading)
**Problem:** At the hit point from Example 11.7 ($w = 0.3, u = 0.2, v = 0.5$), the triangle has vertex normals:
$$\hat{\mathbf{n}}_0 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \hat{\mathbf{n}}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \hat{\mathbf{n}}_2 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
Calculate the interpolated and re-normalized surface normal $\hat{\mathbf{n}}_{\text{shading}}$.

**Solution:**
1. Linear interpolation:
   $$\mathbf{N} = w \hat{\mathbf{n}}_0 + u \hat{\mathbf{n}}_1 + v \hat{\mathbf{n}}_2 = 0.3 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} + 0.2 \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + 0.5 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0.2 \\ 0.3 \\ 0.5 \end{bmatrix}$$
2. Normalize:
   $$\|\mathbf{N}\| = \sqrt{0.2^2 + 0.3^2 + 0.5^2} = \sqrt{0.04 + 0.09 + 0.25} = \sqrt{0.38} \approx 0.616441$$
   $$\hat{\mathbf{n}}_{\text{shading}} = \frac{1}{\sqrt{0.38}} \begin{bmatrix} 0.2 \\ 0.3 \\ 0.5 \end{bmatrix} \approx \begin{bmatrix} 0.3244 \\ 0.4867 \\ 0.8111 \end{bmatrix}$$

---

#### Example 11.9: Ray-Plane Intersection with Oblique Ray
**Problem:** A ray has origin $\mathbf{P}_0 = (2, 3, 4)$ and direction $\mathbf{d} = \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}$. The plane is $2x + y - z = 5$. Find the exact hit point.

**Solution:**
1. Normal $\mathbf{n} = \begin{bmatrix} 2 \\ 1 \\ -1 \end{bmatrix}$, $D = -5$.
2. $\mathbf{n} \cdot \mathbf{d} = (2)(1) + (1)(-1) + (-1)(2) = 2 - 1 - 2 = -1$.
3. $\mathbf{n} \cdot \mathbf{P}_0 + D = (2)(2) + (1)(3) + (-1)(4) - 5 = 4 + 3 - 4 - 5 = -2$.
4. $t^* = \frac{-(-2)}{-1} = \frac{2}{-1} = -2.0$.
Since $t^* = -2.0 < 0$, the intersection occurs behind the ray origin.
**Result:** No forward hit.

---

#### Example 11.10: Single-Sided vs Double-Sided Culling
**Problem:** A ray hits the back side of a triangle ($\det = \mathbf{e}_1 \cdot \mathbf{p} = -3.5 < 0$).
Explain why a single-sided test rejects the triangle, and how a double-sided test proceeds.

**Solution:**
- **Single-Sided:** If backface culling is enabled, any triangle whose normal faces away from the ray direction has $\det < 0$. The test `if (det < EPSILON) return false;` immediately discards the triangle. This halves the rendering cost for closed 3D meshes.
- **Double-Sided:** If rendering thin two-sided surfaces (like leaves, paper, or clothing), we allow $\det < 0$. We only reject if $|\det| < \epsilon$. We compute $\text{invDet} = \frac{1}{\det}$ (which will be negative). Both the numerator and denominator in Cramer's rule have negative signs, which cancel out, yielding positive valid $u, v, t$ parameters!

---

### Section 11.8 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 11.1
**Problem:** What are the barycentric coordinates of vertex $\mathbf{v}_1$ in triangle $(\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2)$?
**Solution:**
$u = 1, v = 0, w = 0$.

---

#### Exercise 11.2
**Problem:** If $u = 0.4$ and $v = 0.7$ for a point in the plane of a triangle, does the point lie inside the triangle?
**Solution:**
Check sum: $u + v = 0.4 + 0.7 = 1.1 > 1.0$.
No, the point lies outside the triangle.

---

#### Exercise 11.3
**Problem:** Find the intersection of ray $\mathbf{P}_0 = (0, 0, 10), \mathbf{d} = (0, 0, -2)$ with the plane $z = 0$.
**Solution:**
$z(t) = 10 - 2t = 0 \implies 2t = 10 \implies t = 5$.
Hit point: $(0, 0, 0)$.

---

#### Exercise 11.4
**Problem:** In the Möller-Trumbore algorithm, what does the scalar $\det = \mathbf{e}_1 \cdot (\mathbf{d} \times \mathbf{e}_2)$ represent geometrically?
**Solution:**
It represents $-(\mathbf{n} \cdot \mathbf{d})$, which is proportional to the cosine of the angle between the ray direction and the triangle face normal multiplied by twice the triangle area.

---

#### Exercise 11.5
**Problem:** Why is `Math.abs(det) < 1e-7` checked before computing `1.0 / det`?
**Solution:**
To prevent division by zero or floating-point overflow (`Infinity`) when the ray is parallel or nearly parallel to the triangle plane.

---

#### Exercise 11.6
**Problem:** A ray strikes a triangle at its exact centroid. What are the barycentric coordinates $(w, u, v)$?
**Solution:**
$w = \frac{1}{3}, u = \frac{1}{3}, v = \frac{1}{3}$.

---

#### Exercise 11.7
**Problem:** If a ray origin lies directly on the plane of the triangle ($t = 0$), why do ray tracers typically require $t > \epsilon_{\text{min}}$ (e.g., $10^{-4}$)?
**Solution:**
To prevent **shadow acne / self-intersection**: when a ray is spawned from a surface point to test visibility to a light source, floating-point roundoff can cause the ray to immediately re-intersect the very same triangle it originated from.

---

#### Exercise 11.8
**Problem:** How many cross products are evaluated in the Möller-Trumbore algorithm if the ray misses the bounding box or fails on $u$?
**Solution:**
Exactly **one** cross product ($\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$). The second cross product ($\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$) is never computed!

---

#### Exercise 11.9
**Problem:** If triangle vertices are given in clockwise order, how does that affect the sign of $\det$ in Möller-Trumbore?
**Solution:**
The cross product $\mathbf{e}_1 \times \mathbf{e}_2$ will point in the opposite direction, inverting the sign of $\det$. If backface culling is enabled, front-facing rays will be erroneously culled unless the winding order convention is adjusted.

---

#### Exercise 11.10
**Problem:** What is the maximum number of times a straight line can intersect a single flat triangle in $\mathbb{R}^3$?
**Solution:**
If the line does not lie in the plane of the triangle, it can intersect at most **one** point. If the line lies in the plane of the triangle, it can intersect along a line segment (infinitely many points).
