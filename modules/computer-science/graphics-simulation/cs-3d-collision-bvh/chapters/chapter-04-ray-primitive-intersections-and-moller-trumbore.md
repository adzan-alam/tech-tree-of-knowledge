# Chapter 4: Ray-Primitive Intersections: Spheres, Capsules, and Möller-Trumbore Triangles

> *"In the geometry of light and sight, a ray is a single line of thought sent forth into the dark. If it meets a sphere, it strikes a smooth contour; if it meets a polygon, it pierces three points of weight. To compute this without storing the plane is the highest triumph of linear algebra."*
> — **Tomas Möller & Ben Trumbore**, *Fast, Minimum Storage Ray/Triangle Intersection* (1997)

---

## 4.1 Parametric Ray Geometry

In 3D computer graphics, physics simulation, autonomous LIDAR sensing, and robotic perception, the fundamental querying probe is the **geometric ray**.

```
                           THE PARAMETRIC RAY
                              D (Unit Direction Vector)
                             --->
         * ----------------------------------------------------->
         O (Ray Origin, t = 0)         P(t) = O + t * D
```

A semi-infinite ray is mathematically defined as an affine map from the non-negative real half-line $\mathbb{R}_{\ge 0}$ into Euclidean 3-space $\mathbb{R}^3$:

$$\mathbf{P}(t) = \mathbf{O} + t \mathbf{D}, \quad t \in [0, +\infty)$$

where:
- $\mathbf{O} = (O_x, O_y, O_z)^T \in \mathbb{R}^3$ is the **Ray Origin** (the camera pinhole, photon emitter, or LIDAR laser diode).
- $\mathbf{D} = (D_x, D_y, D_z)^T \in \mathbb{R}^3$ is the **Normalized Ray Direction Vector** ($\|\mathbf{D}\| = \sqrt{D_x^2 + D_y^2 + D_z^2} = 1$).
- $t \in \mathbb{R}_{\ge 0}$ is the **Ray Parameter**, which physically represents the linear Euclidean distance traveled from $\mathbf{O}$ along $\mathbf{D}$.

For finite line segments (such as ballistic bullet paths over time step $\Delta t$), the domain of $t$ is clamped to an interval $[t_{\min}, t_{\max}]$, where $t_{\min} \ge 0$ and $t_{\max} = \|\mathbf{v}\| \Delta t$.

---

## 4.2 Analytical Ray-Sphere Intersection

The sphere is the simplest non-planar geometric primitive in $\mathbb{R}^3$. Defined by its center $\mathbf{c} \in \mathbb{R}^3$ and radius $R > 0$, the implicit equation of its surface is:

$$\|\mathbf{x} - \mathbf{c}\|^2 = R^2 \iff (\mathbf{x} - \mathbf{c}) \cdot (\mathbf{x} - \mathbf{c}) = R^2$$

```
                      RAY-SPHERE GEOMETRY
                                    .-----.
                                  .'   |   `.
                        c         /    |     \
                        *        |     | R    |
                       /|        |     |      |
                      / |         \    |     /
                  v  /  | d        `.  |   .'
                    /   |            `-+---'
                   /    |             /
                  *-----+------------*---------------------> D
                  O    t_proj       P(t_1)     P(t_2)
                       <--------->  <---->
                         t_proj     t_half
```

### 4.2.1 Algebraic Quadratic Formulation

Substitute the ray equation $\mathbf{P}(t) = \mathbf{O} + t \mathbf{D}$ into the sphere equation:

$$((\mathbf{O} + t \mathbf{D}) - \mathbf{c}) \cdot ((\mathbf{O} + t \mathbf{D}) - \mathbf{c}) = R^2$$

Let $\boldsymbol{\Delta} = \mathbf{O} - \mathbf{c}$ be the displacement vector from the sphere center to the ray origin. Expanding the dot product yields:

$$(t \mathbf{D} + \boldsymbol{\Delta}) \cdot (t \mathbf{D} + \boldsymbol{\Delta}) = R^2$$

$$(\mathbf{D} \cdot \mathbf{D}) t^2 + 2(\mathbf{D} \cdot \boldsymbol{\Delta}) t + (\boldsymbol{\Delta} \cdot \boldsymbol{\Delta} - R^2) = 0$$

Because $\mathbf{D}$ is normalized ($\mathbf{D} \cdot \mathbf{D} = \|\mathbf{D}\|^2 = 1$), this reduces to a standard quadratic equation in $t$:

$$a t^2 + b t + c = 0$$

where:
$$a = 1.0$$
$$b = 2(\mathbf{D} \cdot \boldsymbol{\Delta})$$
$$c = \|\boldsymbol{\Delta}\|^2 - R^2$$

The discriminant $\Delta_{\text{quad}}$ dictates the intersection topology:
$$\Delta_{\text{quad}} = b^2 - 4ac = 4(\mathbf{D} \cdot \boldsymbol{\Delta})^2 - 4(\|\boldsymbol{\Delta}\|^2 - R^2)$$

Dividing by 4 yields the simplified discriminant $\Delta^*$:
$$\Delta^* = (\mathbf{D} \cdot \boldsymbol{\Delta})^2 - (\|\boldsymbol{\Delta}\|^2 - R^2)$$

- **$\Delta^* < 0$:** The quadratic equation has no real roots. The ray completely misses the sphere.
- **$\Delta^* = 0$:** The ray grazes the sphere tangentially at a single point ($t = -\mathbf{D} \cdot \boldsymbol{\Delta}$).
- **$\Delta^* > 0$:** The ray pierces the sphere at two distinct points:
  $$t_1 = -(\mathbf{D} \cdot \boldsymbol{\Delta}) - \sqrt{\Delta^*}, \quad t_2 = -(\mathbf{D} \cdot \boldsymbol{\Delta}) + \sqrt{\Delta^*}$$

### 4.2.2 Geometric Early-Out Formulation

In performance-critical engines, we avoid computing the full quadratic discriminant if the sphere lies entirely behind the ray origin:
1. Compute vector from ray origin to sphere center: $\mathbf{v} = \mathbf{c} - \mathbf{O} = -\boldsymbol{\Delta}$.
2. Project $\mathbf{v}$ onto ray direction: $t_{\text{proj}} = \mathbf{v} \cdot \mathbf{D}$.
   - If $t_{\text{proj}} < 0$ AND $\|\mathbf{v}\|^2 > R^2$, the sphere is entirely behind the ray origin $\implies$ **Return false immediately!**
3. Compute squared perpendicular distance from sphere center to ray line:
   $$d^2 = \|\mathbf{v}\|^2 - t_{\text{proj}}^2$$
   - If $d^2 > R^2$, the ray misses the sphere $\implies$ **Return false immediately!**
4. Compute half-chord distance $t_{\text{half}} = \sqrt{R^2 - d^2}$.
5. Near and far intersection parameters:
   $$t_1 = t_{\text{proj}} - t_{\text{half}}, \quad t_2 = t_{\text{proj}} + t_{\text{half}}$$
   If $t_1 \ge 0$, entry point is $t = t_1$. If $t_1 < 0$ (ray originated inside the sphere), exit point is $t = t_2$.

### 4.2.3 Surface Normal at Hit Point

For any hit point $\mathbf{P}(t)$, the outward unit surface normal is radial:

$$\hat{\mathbf{n}} = \frac{\mathbf{P}(t) - \mathbf{c}}{R}$$

---

## 4.3 Analytical Ray-Cylinder and Ray-Capsule Intersections

### 4.3.1 Infinite Cylinder Along an Arbitrary Axis

An infinite cylinder of radius $R$ is defined by a point $\mathbf{A} \in \mathbb{R}^3$ on its central axis and a unit axis vector $\hat{\mathbf{a}} \in \mathbb{R}^3$ ($\|\hat{\mathbf{a}}\| = 1$).
A point $\mathbf{x} \in \mathbb{R}^3$ lies on the cylinder if its perpendicular distance to the central line equals $R$:

$$\|(\mathbf{x} - \mathbf{A}) - ((\mathbf{x} - \mathbf{A}) \cdot \hat{\mathbf{a}}) \hat{\mathbf{a}}\|^2 = R^2$$

Substitute $\mathbf{x} = \mathbf{O} + t \mathbf{D}$ and define $\boldsymbol{\Delta} = \mathbf{O} - \mathbf{A}$.
Project both $\mathbf{D}$ and $\boldsymbol{\Delta}$ onto the plane perpendicular to axis $\hat{\mathbf{a}}$:
$$\mathbf{D}_\perp = \mathbf{D} - (\mathbf{D} \cdot \hat{\mathbf{a}})\hat{\mathbf{a}}$$
$$\boldsymbol{\Delta}_\perp = \boldsymbol{\Delta} - (\boldsymbol{\Delta} \cdot \hat{\mathbf{a}})\hat{\mathbf{a}}$$

The equation simplifies to an exact 2D circle intersection in the perpendicular subspace:

$$\|\mathbf{D}_\perp t + \boldsymbol{\Delta}_\perp\|^2 = R^2$$

$$(\mathbf{D}_\perp \cdot \mathbf{D}_\perp) t^2 + 2(\mathbf{D}_\perp \cdot \boldsymbol{\Delta}_\perp) t + (\|\boldsymbol{\Delta}_\perp\|^2 - R^2) = 0$$

Solve the quadratic for $t$. For a **finite capped cylinder** of length $L$, the hit parameter $t$ is validated only if the axial projection falls within the cylinder segment:

$$0 \le (\mathbf{P}(t) - \mathbf{A}) \cdot \hat{\mathbf{a}} \le L$$

If the ray misses the lateral wall, it is tested against the two circular endcap disks at $s = 0$ and $s = L$.

```
                       RAY-CAPSULE GEOMETRY
                       
                     .-------.  <-- Hemispherical Endcap (Center B, Radius R)
                    /    * B  \
                   |     |     |
                   |     |     | <-- Cylindrical Body (Radius R)
                   |     |     |
                    \    * A  /
                     `-------'  <-- Hemispherical Endcap (Center A, Radius R)
```

### 4.3.2 Capsule Intersection

A capsule is the Minkowski sum of a finite line segment $\mathbf{A}\mathbf{B}$ and a sphere of radius $R$. It consists of a cylindrical sleeve of length $L = \|\mathbf{B} - \mathbf{A}\|$ capped by two hemispherical caps centered at $\mathbf{A}$ and $\mathbf{B}$.

Testing a ray against a capsule:
1. Test ray against the infinite cylinder sharing segment $\mathbf{A}\mathbf{B}$'s axis.
   If a valid root $t$ satisfies $0 \le (\mathbf{P}(t) - \mathbf{A}) \cdot \hat{\mathbf{a}} \le L$, it strikes the cylindrical body!
2. If the cylindrical test misses or hits outside $[0, L]$, test the ray against:
   - Full Sphere at $\mathbf{A}$ with radius $R$.
   - Full Sphere at $\mathbf{B}$ with radius $R$.
3. The smallest positive valid $t$ across all three sub-tests represents the true capsule entry point.

---

## 4.4 Ray-Plane and Ray-Disk Intersections

### 4.4.1 Ray-Plane Intersection

An infinite 3D plane is defined by a point $\mathbf{P}_0 \in \mathbb{R}^3$ lying on the plane and a unit normal vector $\hat{\mathbf{n}} \in \mathbb{R}^3$:

$$(\mathbf{x} - \mathbf{P}_0) \cdot \hat{\mathbf{n}} = 0 \iff \mathbf{x} \cdot \hat{\mathbf{n}} + d = 0 \quad (\text{where } d = -\mathbf{P}_0 \cdot \hat{\mathbf{n}})$$

Substitute the ray equation $\mathbf{x} = \mathbf{O} + t \mathbf{D}$:

$$((\mathbf{O} + t \mathbf{D}) - \mathbf{P}_0) \cdot \hat{\mathbf{n}} = 0$$

$$(\mathbf{O} - \mathbf{P}_0) \cdot \hat{\mathbf{n}} + t (\mathbf{D} \cdot \hat{\mathbf{n}}) = 0$$

$$\boxed{t = \frac{(\mathbf{P}_0 - \mathbf{O}) \cdot \hat{\mathbf{n}}}{\mathbf{D} \cdot \hat{\mathbf{n}}}}$$

- If $|\mathbf{D} \cdot \hat{\mathbf{n}}| < 10^{-8}$, the ray is parallel to the plane.
  - If $(\mathbf{P}_0 - \mathbf{O}) \cdot \hat{\mathbf{n}} = 0$, the ray lies entirely inside the plane.
  - Otherwise, the ray never intersects the plane.
- If $t < 0$, the intersection point lies behind the ray origin.

### 4.4.2 Ray-Disk Intersection

A circular disk of radius $R$ centered at $\mathbf{c} \in \mathbb{R}^3$ with normal $\hat{\mathbf{n}}$:
1. Compute ray-plane intersection $t$ with $\mathbf{P}_0 = \mathbf{c}$.
2. If $t < 0$, miss.
3. Compute hit point: $\mathbf{P} = \mathbf{O} + t \mathbf{D}$.
4. Distance check:
   $$\|\mathbf{P} - \mathbf{c}\|^2 \le R^2$$
   If true, the ray hits the disk at $t$; if false, it misses.

---

## 4.5 The Möller-Trumbore Ray-Triangle Intersection Algorithm

Triangles are the universal atomic primitive of 3D computer graphics and complex collision meshes. In a scene containing $10{,}000{,}000$ triangles, testing ray-triangle intersection is executed billions of times per second.

Prior to 1997, the standard algorithm required two distinct steps:
1. Compute the plane equation of the triangle $(\mathbf{P} - \mathbf{V}_0) \cdot \hat{\mathbf{n}} = 0$.
2. Intersect the ray with the plane to find $\mathbf{P}(t)$.
3. Project the 3D triangle and point $\mathbf{P}$ into a 2D coordinate plane ($xy$, $yz$, or $zx$) and execute 2D point-in-polygon edge tests.

This approach suffered from two major flaws:
- It required storing or precomputing the plane normal $\hat{\mathbf{n}}$ and distance $d$ for every triangle, consuming millions of bytes of RAM.
- It required conditional projection branches that stalled CPU pipelines.

In 1997, Swedish computer scientist Tomas Möller and American researcher Ben Trumbore published their landmark algorithm, which **computes the intersection directly in 3D barycentric space using Cramer's rule without ever calculating or storing the plane equation**.

```
                   MÖLLER-TRUMBORE BARYCENTRIC GEOMETRY
                                  V_2
                                   *
                                  / \
                                 /   \
                             E_2/     \
                               /   *   \  P(u, v) = (1 - u - v)V_0 + u V_1 + v V_2
                              /  Hit    \
                             /           \
                            *-------------*
                           V_0     E_1     V_1
```

### 4.5.1 Barycentric Parameterization of a Triangle

Let a triangle be defined by three non-collinear vertices $\mathbf{V}_0, \mathbf{V}_1, \mathbf{V}_2 \in \mathbb{R}^3$.
Any point $\mathbf{T}(u, v)$ on the surface of the triangle can be expressed uniquely using **barycentric coordinates** $(w, u, v)$:

$$\mathbf{T}(u, v) = w \mathbf{V}_0 + u \mathbf{V}_1 + v \mathbf{V}_2, \quad \text{where } w = 1 - u - v$$

$$\mathbf{T}(u, v) = (1 - u - v)\mathbf{V}_0 + u \mathbf{V}_1 + v \mathbf{V}_2 = \mathbf{V}_0 + u (\mathbf{V}_1 - \mathbf{V}_0) + v (\mathbf{V}_2 - \mathbf{V}_0)$$

Define the edge vectors:
$$\mathbf{E}_1 = \mathbf{V}_1 - \mathbf{V}_0, \quad \mathbf{E}_2 = \mathbf{V}_2 - \mathbf{V}_0$$

$$\mathbf{T}(u, v) = \mathbf{V}_0 + u \mathbf{E}_1 + v \mathbf{E}_2$$

The domain of valid interior points on the triangle is defined by three linear inequalities:

$$\boxed{u \ge 0, \quad v \ge 0, \quad u + v \le 1}$$

- If $u = 0, v = 0$, the point is vertex $\mathbf{V}_0$.
- If $u = 1, v = 0$, the point is vertex $\mathbf{V}_1$.
- If $u = 0, v = 1$, the point is vertex $\mathbf{V}_2$.
- If $u + v = 1$, the point lies along the edge $\mathbf{V}_1\mathbf{V}_2$.

### 4.5.2 Setting Up the Linear System

To find the intersection between ray $\mathbf{P}(t) = \mathbf{O} + t \mathbf{D}$ and triangle $\mathbf{T}(u, v)$, we equate them:

$$\mathbf{O} + t \mathbf{D} = \mathbf{V}_0 + u \mathbf{E}_1 + v \mathbf{E}_2$$

Rearrange terms with unknowns $(t, u, v)$ on the left side:

$$-t \mathbf{D} + u \mathbf{E}_1 + v \mathbf{E}_2 = \mathbf{O} - \mathbf{V}_0$$

Define the origin displacement vector:
$$\mathbf{T}_{\text{ray}} = \mathbf{O} - \mathbf{V}_0$$

This yields a non-homogeneous $3 \times 3$ linear matrix equation:

$$\begin{pmatrix} -\mathbf{D} & \mathbf{E}_1 & \mathbf{E}_2 \end{pmatrix} \begin{pmatrix} t \\ u \\ v \end{pmatrix} = \mathbf{T}_{\text{ray}}$$

### 4.5.3 Cramer's Rule and Scalar Triple Products

By **Cramer's Rule**, the solution to the matrix equation $\mathbf{M} \mathbf{x} = \mathbf{T}_{\text{ray}}$ is:

$$t = \frac{\det(\mathbf{T}_{\text{ray}}, \mathbf{E}_1, \mathbf{E}_2)}{\det(-\mathbf{D}, \mathbf{E}_1, \mathbf{E}_2)}, \quad u = \frac{\det(-\mathbf{D}, \mathbf{T}_{\text{ray}}, \mathbf{E}_2)}{\det(-\mathbf{D}, \mathbf{E}_1, \mathbf{E}_2)}, \quad v = \frac{\det(-\mathbf{D}, \mathbf{E}_1, \mathbf{T}_{\text{ray}})}{\det(-\mathbf{D}, \mathbf{E}_1, \mathbf{E}_2)}$$

Recall that the determinant of three column vectors is the **scalar triple product**:
$$\det(\mathbf{a}, \mathbf{b}, \mathbf{c}) = (\mathbf{a} \times \mathbf{b}) \cdot \mathbf{c} = \mathbf{a} \cdot (\mathbf{b} \times \mathbf{c})$$

Denominator Determinant:
$$\det(\mathbf{M}) = \det(-\mathbf{D}, \mathbf{E}_1, \mathbf{E}_2) = (-\mathbf{D}) \cdot (\mathbf{E}_1 \times \mathbf{E}_2) = \mathbf{D} \cdot (\mathbf{E}_2 \times \mathbf{E}_1) = (\mathbf{D} \times \mathbf{E}_2) \cdot \mathbf{E}_1$$

Define vector $\mathbf{P}_{\text{vec}}$:
$$\mathbf{P}_{\text{vec}} = \mathbf{D} \times \mathbf{E}_2$$

Then:
$$\det = \mathbf{P}_{\text{vec}} \cdot \mathbf{E}_1$$

If $\det = 0$, the ray direction $\mathbf{D}$ is completely coplanar with $\mathbf{E}_1$ and $\mathbf{E}_2$ (the ray is parallel to the triangle plane).
- In backface-culling mode: If $\det < 10^{-8}$, the ray is either parallel or striking the back of the triangle $\implies$ **Return false immediately!**
- In double-sided mode: If $|\det| < 10^{-8}$, parallel $\implies$ **Return false immediately!**

Inverse determinant:
$$\text{invDet} = \frac{1}{\det}$$

Numerator for $u$:
$$\det(-\mathbf{D}, \mathbf{T}_{\text{ray}}, \mathbf{E}_2) = \mathbf{T}_{\text{ray}} \cdot (\mathbf{D} \times \mathbf{E}_2) = \mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}$$

$$\boxed{u = (\mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}) \cdot \text{invDet}}$$

**Early-Out Check 1:** If $u < 0$ or $u > 1$, the hit point lies outside the triangle's barycentric domain $\implies$ **Return false immediately!**

Numerator for $v$:
$$\det(-\mathbf{D}, \mathbf{E}_1, \mathbf{T}_{\text{ray}}) = \mathbf{D} \cdot (\mathbf{T}_{\text{ray}} \times \mathbf{E}_1)$$

Define vector $\mathbf{Q}_{\text{vec}}$:
$$\mathbf{Q}_{\text{vec}} = \mathbf{T}_{\text{ray}} \times \mathbf{E}_1$$

$$\boxed{v = (\mathbf{D} \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet}}$$

**Early-Out Check 2:** If $v < 0$ or $u + v > 1$, the hit point lies outside the triangle $\implies$ **Return false immediately!**

Numerator for $t$:
$$\det(\mathbf{T}_{\text{ray}}, \mathbf{E}_1, \mathbf{E}_2) = \mathbf{E}_2 \cdot (\mathbf{T}_{\text{ray}} \times \mathbf{E}_1) = \mathbf{E}_2 \cdot \mathbf{Q}_{\text{vec}}$$

$$\boxed{t = (\mathbf{E}_2 \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet}}$$

**Early-Out Check 3:** If $t < 10^{-8}$, the triangle lies behind the ray origin $\implies$ **Return false immediately!**

If all three checks pass, **the ray intersects the triangle at distance $t$ with barycentric coordinates $(u, v)$!**

---

## 4.6 Ten Step-by-Step Worked Examples

### Worked Example 4.1: Möller-Trumbore Central Hit
**Problem:** A triangle has vertices:
$\mathbf{V}_0 = (0, 0, 0)^T$, $\mathbf{V}_1 = (3, 0, 0)^T$, $\mathbf{V}_2 = (0, 3, 0)^T$ (lying in the xy-plane).
A ray has origin $\mathbf{O} = (1, 1, 5)^T$ and direction $\mathbf{D} = (0, 0, -1)^T$ (pointing straight down).
Execute the Möller-Trumbore algorithm step by step to find $(t, u, v)$ and the world hit point.

**Solution:**
1. **Edge Vectors:**
   $$\mathbf{E}_1 = \mathbf{V}_1 - \mathbf{V}_0 = (3, 0, 0)^T - (0, 0, 0)^T = (3, 0, 0)^T$$
   $$\mathbf{E}_2 = \mathbf{V}_2 - \mathbf{V}_0 = (0, 3, 0)^T - (0, 0, 0)^T = (0, 3, 0)^T$$
2. **Ray Displacement:**
   $$\mathbf{T}_{\text{ray}} = \mathbf{O} - \mathbf{V}_0 = (1, 1, 5)^T - (0, 0, 0)^T = (1, 1, 5)^T$$
3. **Vector $\mathbf{P}_{\text{vec}}$:**
   $$\mathbf{P}_{\text{vec}} = \mathbf{D} \times \mathbf{E}_2 = \begin{pmatrix} 0 \\ 0 \\ -1 \end{pmatrix} \times \begin{pmatrix} 0 \\ 3 \\ 0 \end{pmatrix} = \begin{pmatrix} (0)(0) - (-1)(3) \\ (-1)(0) - (0)(0) \\ (0)(3) - (0)(0) \end{pmatrix} = \begin{pmatrix} 3 \\ 0 \\ 0 \end{pmatrix}$$
4. **Determinant:**
   $$\det = \mathbf{E}_1 \cdot \mathbf{P}_{\text{vec}} = (3, 0, 0)^T \cdot (3, 0, 0)^T = 3(3) + 0 + 0 = 9.0$$
   Since $\det = 9.0 > 0$, the ray is not parallel and hits the front face.
   $$\text{invDet} = \frac{1}{9.0} \approx 0.11111$$
5. **Barycentric $u$:**
   $$u = (\mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}) \cdot \text{invDet} = \left[ (1, 1, 5)^T \cdot (3, 0, 0)^T \right] \cdot \frac{1}{9.0} = (3) \cdot \frac{1}{9.0} = \frac{1}{3} \approx 0.33333$$
   Check: $0 \le u \le 1$ (TRUE).
6. **Vector $\mathbf{Q}_{\text{vec}}$:**
   $$\mathbf{Q}_{\text{vec}} = \mathbf{T}_{\text{ray}} \times \mathbf{E}_1 = \begin{pmatrix} 1 \\ 1 \\ 5 \end{pmatrix} \times \begin{pmatrix} 3 \\ 0 \\ 0 \end{pmatrix} = \begin{pmatrix} (1)(0) - (5)(0) \\ (5)(3) - (1)(0) \\ (1)(0) - (1)(3) \end{pmatrix} = \begin{pmatrix} 0 \\ 15 \\ -3 \end{pmatrix}$$
7. **Barycentric $v$:**
   $$v = (\mathbf{D} \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = \left[ (0, 0, -1)^T \cdot (0, 15, -3)^T \right] \cdot \frac{1}{9.0} = (-1)(-3) \cdot \frac{1}{9.0} = \frac{3}{9.0} = \frac{1}{3} \approx 0.33333$$
   Check: $v \ge 0$ (TRUE) and $u + v = \frac{1}{3} + \frac{1}{3} = \frac{2}{3} \le 1.0$ (TRUE).
8. **Ray Parameter $t$:**
   $$t = (\mathbf{E}_2 \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = \left[ (0, 3, 0)^T \cdot (0, 15, -3)^T \right] \cdot \frac{1}{9.0} = (3)(15) \cdot \frac{1}{9.0} = \frac{45}{9.0} = 5.0$$
   Check: $t = 5.0 > 0$ (TRUE).
9. **Hit Verification:**
   World coordinates of hit point:
   $$\mathbf{P}(5.0) = \mathbf{O} + 5.0 \mathbf{D} = (1, 1, 5)^T + 5(0, 0, -1)^T = (1, 1, 0)^T$$
   Using barycentric formula:
   $$\mathbf{T}\left(\frac{1}{3}, \frac{1}{3}\right) = \left(1 - \frac{2}{3}\right)\mathbf{V}_0 + \frac{1}{3}\mathbf{V}_1 + \frac{1}{3}\mathbf{V}_2 = \frac{1}{3}(0, 0, 0) + \frac{1}{3}(3, 0, 0) + \frac{1}{3}(0, 3, 0) = (1, 1, 0)^T$$
   Matches exactly!

---

### Worked Example 4.2: Möller-Trumbore Miss Outside Hypotenuse
**Problem:** For the same triangle as Example 4.1, test a ray with origin $\mathbf{O} = (2, 2, 5)^T$ and direction $\mathbf{D} = (0, 0, -1)^T$.

**Solution:**
1. $\mathbf{E}_1 = (3, 0, 0)^T$, $\mathbf{E}_2 = (0, 3, 0)^T$, $\mathbf{P}_{\text{vec}} = (3, 0, 0)^T$, $\det = 9.0$, $\text{invDet} = 1/9$.
2. $\mathbf{T}_{\text{ray}} = \mathbf{O} - \mathbf{V}_0 = (2, 2, 5)^T$.
3. Compute $u$:
   $$u = (\mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}) \cdot \text{invDet} = \left[ (2, 2, 5) \cdot (3, 0, 0) \right] \cdot \frac{1}{9} = \frac{6}{9} = \frac{2}{3} \approx 0.6667$$
   Check: $0 \le u \le 1$ (Passes).
4. Compute $\mathbf{Q}_{\text{vec}}$:
   $$\mathbf{Q}_{\text{vec}} = \mathbf{T}_{\text{ray}} \times \mathbf{E}_1 = \begin{pmatrix} 2 \\ 2 \\ 5 \end{pmatrix} \times \begin{pmatrix} 3 \\ 0 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 15 \\ -6 \end{pmatrix}$$
5. Compute $v$:
   $$v = (\mathbf{D} \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = [(-1)(-6)] \cdot \frac{1}{9} = \frac{6}{9} = \frac{2}{3} \approx 0.6667$$
   Check: $v \ge 0$ (Passes).
6. **Check $u + v$:**
   $$u + v = \frac{2}{3} + \frac{2}{3} = \frac{4}{3} \approx 1.3333 > 1.0 \quad (\mathbf{VIOLATION!})$$
   The point $(2, 2, 0)^T$ lies outside the hypotenuse edge!
   The algorithm terminates and immediately returns `false`!

---

### Worked Example 4.3: Ray-Sphere Direct Algebraic Solution
**Problem:** A sphere has center $\mathbf{c} = (0, 0, 10)^T$ and radius $R = 2.0\text{ m}$.
A ray origin is at $\mathbf{O} = (0, 1, 0)^T$ with direction $\mathbf{D} = (0, 0, 1)^T$ (traveling down $+z$).
Find the exact hit parameter $t$ and surface normal $\hat{\mathbf{n}}$.

**Solution:**
1. Displacement vector $\boldsymbol{\Delta} = \mathbf{O} - \mathbf{c} = (0, 1, 0)^T - (0, 0, 10)^T = (0, 1, -10)^T$.
2. Direction vector is normalized: $\|\mathbf{D}\| = 1 \implies a = 1.0$.
3. Coefficients:
   $$b = 2(\mathbf{D} \cdot \boldsymbol{\Delta}) = 2[(0)(0) + (0)(1) + (1)(-10)] = 2(-10) = -20.0$$
   $$c = \|\boldsymbol{\Delta}\|^2 - R^2 = (0^2 + 1^2 + (-10)^2) - 2^2 = (1 + 100) - 4 = 101 - 4 = 97.0$$
4. Discriminant:
   $$\Delta = b^2 - 4ac = (-20)^2 - 4(1)(97) = 400 - 388 = 12.0$$
   Since $\Delta = 12.0 > 0$, two intersection points exist!
   $$\sqrt{\Delta} = \sqrt{12} = 2\sqrt{3} \approx 3.4641$$
5. Roots:
   $$t_1 = \frac{-b - \sqrt{\Delta}}{2a} = \frac{20 - 3.4641}{2} = \frac{16.5359}{2} \approx 8.26795$$
   $$t_2 = \frac{-b + \sqrt{\Delta}}{2a} = \frac{20 + 3.4641}{2} = \frac{23.4641}{2} \approx 11.73205$$
6. First hit is at $t = 8.268\text{ m}$.
   Hit point coordinates:
   $$\mathbf{P}(8.268) = (0, 1, 0)^T + 8.268(0, 0, 1)^T = (0, 1, 8.268)^T$$
7. Surface normal:
   $$\hat{\mathbf{n}} = \frac{\mathbf{P} - \mathbf{c}}{R} = \frac{(0, 1, 8.268)^T - (0, 0, 10)^T}{2} = \frac{(0, 1, -1.732)^T}{2} = (0, 0.5, -0.866)^T$$
   Length check: $\sqrt{0^2 + 0.5^2 + (-0.866)^2} = \sqrt{0.25 + 0.75} = 1.0$. Perfectly normalized!

---

### Worked Example 4.4: Ray Grazing Sphere (Tangential Contact)
**Problem:** A sphere has center $\mathbf{c} = (3, 0, 0)^T$ and radius $R = 3.0\text{ m}$.
A ray origin is at $\mathbf{O} = (0, 3, -10)^T$ with direction $\mathbf{D} = (0, 0, 1)^T$.
Determine whether the ray intersects the sphere.

**Solution:**
1. Displacement $\boldsymbol{\Delta} = \mathbf{O} - \mathbf{c} = (0 - 3, 3 - 0, -10 - 0)^T = (-3, 3, -10)^T$.
2. Direction $\mathbf{D} = (0, 0, 1)^T$.
3. Compute $b$ and $c$:
   $$b = 2(\mathbf{D} \cdot \boldsymbol{\Delta}) = 2(-10) = -20.0$$
   $$c = \|\boldsymbol{\Delta}\|^2 - R^2 = [(-3)^2 + 3^2 + (-10)^2] - 3^2 = (9 + 9 + 100) - 9 = 109.0$$
4. Discriminant:
   $$\Delta = b^2 - 4ac = (-20)^2 - 4(1)(109) = 400 - 436 = -36.0$$
   Because $\Delta = -36.0 < 0$, the ray completely **MISSES** the sphere!
   Even though the y-coordinate matches the radius ($y = 3$), the x-offset of $-3$ puts the closest approach distance at $\sqrt{(-3)^2 + 3^2} = \sqrt{18} \approx 4.24\text{ m} > R = 3.0\text{ m}$.

---

### Worked Example 4.5: Ray-Plane Oblique Intersection
**Problem:** A flat ground plane has point $\mathbf{P}_0 = (0, 0, 0)^T$ and normal $\hat{\mathbf{n}} = (0, 1, 0)^T$ (facing straight up).
A ray originates from an aerial drone at $\mathbf{O} = (10, 50, 20)^T$ with direction $\mathbf{D} = \frac{1}{\sqrt{3}}(1, -1, 1)^T$.
Find the ground impact point $\mathbf{P}_{\text{impact}}$.

**Solution:**
1. Normal dot direction:
   $$\mathbf{D} \cdot \hat{\mathbf{n}} = \left( \frac{1}{\sqrt{3}}, -\frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}} \right) \cdot (0, 1, 0) = -\frac{1}{\sqrt{3}} \approx -0.57735$$
   Since $\mathbf{D} \cdot \hat{\mathbf{n}} < 0$, the ray is pointing downward into the plane.
2. Distance parameter $t$:
   $$t = \frac{(\mathbf{P}_0 - \mathbf{O}) \cdot \hat{\mathbf{n}}}{\mathbf{D} \cdot \hat{\mathbf{n}}} = \frac{((0, 0, 0) - (10, 50, 20)) \cdot (0, 1, 0)}{-1/\sqrt{3}} = \frac{-50}{-1/\sqrt{3}} = 50\sqrt{3} \approx 86.6025\text{ m}$$
3. Impact Point:
   $$\mathbf{P}_{\text{impact}} = \mathbf{O} + t \mathbf{D} = \begin{pmatrix} 10 \\ 50 \\ 20 \end{pmatrix} + 50\sqrt{3} \begin{pmatrix} 1/\sqrt{3} \\ -1/\sqrt{3} \\ 1/\sqrt{3} \end{pmatrix} = \begin{pmatrix} 10 + 50 \\ 50 - 50 \\ 20 + 50 \end{pmatrix} = \begin{pmatrix} 60 \\ 0 \\ 70 \end{pmatrix}\text{ m}$$
   The impact occurs at coordinates $(60, 0, 70)^T$ on the ground plane!

---

### Worked Example 4.6: Möller-Trumbore Backface Culling
**Problem:** A triangle has vertices $\mathbf{V}_0 = (0, 0, 0)^T$, $\mathbf{V}_1 = (3, 0, 0)^T$, $\mathbf{V}_2 = (0, 3, 0)^T$.
Its counterclockwise normal is $\hat{\mathbf{n}} = \frac{\mathbf{E}_1 \times \mathbf{E}_2}{\|\mathbf{E}_1 \times \mathbf{E}_2\|} = (0, 0, 1)^T$ (pointing $+z$).
A ray originates from below at $\mathbf{O} = (1, 1, -5)^T$ and travels up with direction $\mathbf{D} = (0, 0, 1)^T$.
Trace how Möller-Trumbore handles backface culling.

**Solution:**
1. Compute $\mathbf{P}_{\text{vec}} = \mathbf{D} \times \mathbf{E}_2$:
   $$\mathbf{P}_{\text{vec}} = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} \times \begin{pmatrix} 0 \\ 3 \\ 0 \end{pmatrix} = \begin{pmatrix} -3 \\ 0 \\ 0 \end{pmatrix}$$
2. Compute $\det = \mathbf{E}_1 \cdot \mathbf{P}_{\text{vec}}$:
   $$\det = (3, 0, 0)^T \cdot (-3, 0, 0)^T = -9.0$$
3. Notice that $\det = -9.0 < 0$!
   - In **Backface Culling Mode:** If $\det < 10^{-8}$, the triangle is facing away from the ray. The algorithm immediately aborts and returns `false`!
   - In **Double-Sided Mode:** We do not abort on negative $\det$. Instead, we compute $\text{invDet} = \frac{1}{-9.0} = -\frac{1}{9.0}$.
     $\mathbf{T}_{\text{ray}} = (1, 1, -5)^T$.
     $u = (\mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}) \cdot \text{invDet} = (-3) \cdot (-1/9) = +1/3$.
     $\mathbf{Q}_{\text{vec}} = \mathbf{T}_{\text{ray}} \times \mathbf{E}_1 = (0, -15, -3)^T$.
     $v = (\mathbf{D} \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = (-3) \cdot (-1/9) = +1/3$.
     $t = (\mathbf{E}_2 \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = (-45) \cdot (-1/9) = +5.0$.
     Double-sided mode correctly finds the hit at $t = 5.0$!

---

### Worked Example 4.7: Barycentric Interpolation of Vertex Normals (Phong Shading)
**Problem:** A triangle has vertex normals:
$\mathbf{N}_0 = (0, 0, 1)^T$, $\mathbf{N}_1 = (0.7071, 0, 0.7071)^T$, $\mathbf{N}_2 = (0, 0.7071, 0.7071)^T$.
A ray hits the triangle at barycentric coordinates $u = 0.25, v = 0.50$.
Compute the interpolated surface normal $\hat{\mathbf{n}}_{\text{interp}}$ and normalize it.

**Solution:**
1. Compute the third barycentric coordinate $w$:
   $$w = 1 - u - v = 1 - 0.25 - 0.50 = 0.25$$
2. Barycentric interpolation formula:
   $$\mathbf{N}_{\text{unnorm}} = w \mathbf{N}_0 + u \mathbf{N}_1 + v \mathbf{N}_2$$
   Substitute values:
   $$\mathbf{N}_{\text{unnorm}} = 0.25 \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} + 0.25 \begin{pmatrix} 0.7071 \\ 0 \\ 0.7071 \end{pmatrix} + 0.50 \begin{pmatrix} 0 \\ 0.7071 \\ 0.7071 \end{pmatrix}$$
   $$\mathbf{N}_{\text{unnorm}} = \begin{pmatrix} 0 + 0.176775 + 0 \\ 0 + 0 + 0.35355 \\ 0.25 + 0.176775 + 0.35355 \end{pmatrix} = \begin{pmatrix} 0.176775 \\ 0.353550 \\ 0.780325 \end{pmatrix}$$
3. Normalize:
   $$\|\mathbf{N}_{\text{unnorm}}\| = \sqrt{(0.1768)^2 + (0.3536)^2 + (0.7803)^2} = \sqrt{0.03125 + 0.1250 + 0.6089} = \sqrt{0.76515} \approx 0.87473$$
   $$\hat{\mathbf{n}}_{\text{interp}} = \frac{1}{0.87473} \begin{pmatrix} 0.176775 \\ 0.353550 \\ 0.780325 \end{pmatrix} = \begin{pmatrix} 0.2021 \\ 0.4042 \\ 0.8921 \end{pmatrix}$$
   This interpolated normal gives smooth organic curves across discrete polygonal meshes!

---

### Worked Example 4.8: Ray-Capsule Distance to Segment
**Problem:** A capsule has radius $R = 1.0\text{ m}$ and segment core connecting $\mathbf{A} = (0, -2, 0)^T$ to $\mathbf{B} = (0, 2, 0)^T$ along the y-axis (length $L = 4.0\text{ m}$).
A horizontal ray has origin $\mathbf{O} = (5, 0, 0)^T$ and direction $\mathbf{D} = (-1, 0, 0)^T$ (shooting directly at the center along $-x$).
Find the hit parameter $t$.

**Solution:**
1. The capsule axis vector is $\hat{\mathbf{a}} = (0, 1, 0)^T$.
2. Ray direction is $\mathbf{D} = (-1, 0, 0)^T$.
   $\mathbf{D} \cdot \hat{\mathbf{a}} = 0$. The ray is perpendicular to the cylinder axis.
3. $\mathbf{D}_\perp = \mathbf{D} = (-1, 0, 0)^T$.
4. $\boldsymbol{\Delta} = \mathbf{O} - \mathbf{A} = (5, 0, 0)^T - (0, -2, 0)^T = (5, 2, 0)^T$.
   $\boldsymbol{\Delta}_\perp = \boldsymbol{\Delta} - (\boldsymbol{\Delta} \cdot \hat{\mathbf{a}})\hat{\mathbf{a}} = (5, 2, 0)^T - (2)(0, 1, 0)^T = (5, 0, 0)^T$.
5. Cylinder equation:
   $$\|\mathbf{D}_\perp t + \boldsymbol{\Delta}_\perp\|^2 = R^2 \implies (-t + 5)^2 = 1.0^2 \implies 5 - t = \pm 1.0 \implies t = 4.0\text{ or } 6.0$$
6. First root is $t = 4.0$.
   Hit point: $\mathbf{P}(4.0) = (5 - 4, 0, 0)^T = (1, 0, 0)^T$.
7. Check axial segment constraint:
   $$(\mathbf{P} - \mathbf{A}) \cdot \hat{\mathbf{a}} = ((1, 0, 0) - (0, -2, 0)) \cdot (0, 1, 0) = (1, 2, 0) \cdot (0, 1, 0) = 2.0$$
   $2.0 \in [0, 4.0]$ (Passes!). The ray hits the cylindrical body at $t = 4.0\text{ m}$.

---

### Worked Example 4.9: Degenerate Triangle Handling
**Problem:** A triangle is collinear: $\mathbf{V}_0 = (0, 0, 0)^T$, $\mathbf{V}_1 = (1, 1, 1)^T$, $\mathbf{V}_2 = (2, 2, 2)^T$.
Show how Möller-Trumbore rejects this degenerate triangle gracefully.

**Solution:**
1. Edge vectors:
   $$\mathbf{E}_1 = (1, 1, 1)^T, \quad \mathbf{E}_2 = (2, 2, 2)^T = 2\mathbf{E}_1$$
2. Vector $\mathbf{P}_{\text{vec}} = \mathbf{D} \times \mathbf{E}_2 = 2(\mathbf{D} \times \mathbf{E}_1)$.
3. Determinant:
   $$\det = \mathbf{E}_1 \cdot \mathbf{P}_{\text{vec}} = 2 \mathbf{E}_1 \cdot (\mathbf{D} \times \mathbf{E}_1) = 0$$
   Because the cross product of any vector with $\mathbf{E}_1$ is perpendicular to $\mathbf{E}_1$, the dot product $\mathbf{E}_1 \cdot (\mathbf{D} \times \mathbf{E}_1) \equiv 0$ identically!
4. The condition $|\det| < \epsilon$ immediately triggers, and the algorithm safely aborts with `false`, preventing division by zero!

---

### Worked Example 4.10: Ray Piercing Triangle Vertex Exactly
**Problem:** A ray has origin $\mathbf{O} = (0, 0, 10)^T$ and direction $\mathbf{D} = (0, 0, -1)^T$.
A triangle has vertices $\mathbf{V}_0 = (0, 0, 0)^T$, $\mathbf{V}_1 = (4, 0, 0)^T$, $\mathbf{V}_2 = (0, 4, 0)^T$.
The ray points directly at vertex $\mathbf{V}_0$. Show that Möller-Trumbore evaluates $u = 0, v = 0, t = 10$.

**Solution:**
1. $\mathbf{E}_1 = (4, 0, 0)^T$, $\mathbf{E}_2 = (0, 4, 0)^T$, $\mathbf{D} = (0, 0, -1)^T$.
   $\mathbf{P}_{\text{vec}} = \mathbf{D} \times \mathbf{E}_2 = (4, 0, 0)^T$.
   $\det = \mathbf{E}_1 \cdot \mathbf{P}_{\text{vec}} = 16.0$, $\text{invDet} = 1/16$.
2. $\mathbf{T}_{\text{ray}} = \mathbf{O} - \mathbf{V}_0 = (0, 0, 10)^T$.
3. Compute $u$:
   $$u = (\mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}) \cdot \text{invDet} = [(0, 0, 10) \cdot (4, 0, 0)] \cdot \frac{1}{16} = 0 \cdot \frac{1}{16} = 0.0$$
4. Compute $\mathbf{Q}_{\text{vec}} = \mathbf{T}_{\text{ray}} \times \mathbf{E}_1 = (0, 40, 0)^T$.
5. Compute $v$:
   $$v = (\mathbf{D} \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = [(0, 0, -1) \cdot (0, 40, 0)] \cdot \frac{1}{16} = 0.0$$
6. Compute $t$:
   $$t = (\mathbf{E}_2 \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet} = [(0, 4, 0) \cdot (0, 40, 0)] \cdot \frac{1}{16} = \frac{160}{16} = 10.0$$
   Coordinates $(u, v) = (0, 0)$ and $t = 10.0$ represent an exact vertex hit!

---

## 4.7 Ten Granular Solved Exercises

### Exercise 4.1: Triangle Area via Cross Product
**Problem:** Prove that the determinant $\det = (\mathbf{D} \times \mathbf{E}_2) \cdot \mathbf{E}_1$ in Möller-Trumbore is directly proportional to the surface area of the triangle.

**Solution:**
1. The surface area of a triangle with edge vectors $\mathbf{E}_1, \mathbf{E}_2$ is:
   $$\text{Area} = \frac{1}{2} \|\mathbf{E}_1 \times \mathbf{E}_2\|$$
2. Using the scalar triple product permutation:
   $$\det = (\mathbf{D} \times \mathbf{E}_2) \cdot \mathbf{E}_1 = -\mathbf{D} \cdot (\mathbf{E}_1 \times \mathbf{E}_2) = -(\mathbf{D} \cdot \hat{\mathbf{n}}) \|\mathbf{E}_1 \times \mathbf{E}_2\| = -2 \, \text{Area} \, (\mathbf{D} \cdot \hat{\mathbf{n}})$$
3. The determinant is exactly twice the geometric area of the triangle multiplied by the cosine of the incidence angle! $\blacksquare$

---

### Exercise 4.2: FLOP Count for Möller-Trumbore
**Problem:** Count the total number of floating-point operations (additions, subtractions, multiplications, divisions) required by Möller-Trumbore in the case of a successful intersection.

**Solution:**
1. $\mathbf{E}_1, \mathbf{E}_2$: $2 \times 3 = 6$ subtractions.
2. $\mathbf{P}_{\text{vec}} = \mathbf{D} \times \mathbf{E}_2$: 6 multiplications, 3 subtractions.
3. $\det = \mathbf{E}_1 \cdot \mathbf{P}_{\text{vec}}$: 3 multiplications, 2 additions.
4. $\text{invDet} = 1 / \det$: 1 division.
5. $\mathbf{T}_{\text{ray}} = \mathbf{O} - \mathbf{V}_0$: 3 subtractions.
6. $u = (\mathbf{T}_{\text{ray}} \cdot \mathbf{P}_{\text{vec}}) \cdot \text{invDet}$: 3 mult, 2 add, 1 mult $= 4$ mult, 2 add.
7. $\mathbf{Q}_{\text{vec}} = \mathbf{T}_{\text{ray}} \times \mathbf{E}_1$: 6 mult, 3 sub.
8. $v = (\mathbf{D} \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet}$: 3 mult, 2 add, 1 mult $= 4$ mult, 2 add.
9. $t = (\mathbf{E}_2 \cdot \mathbf{Q}_{\text{vec}}) \cdot \text{invDet}$: 3 mult, 2 add, 1 mult $= 4$ mult, 2 add.
Total: **27 multiplications, 1 division, 17 subtractions, 8 additions = 53 FLOPs!**

---

### Exercise 4.3: Ray-Disk Boundary Precision
**Problem:** A ray strikes a disk at distance $r = \sqrt{x^2 + y^2}$. If $r^2 - R^2 = 10^{-15}$, how should a physics engine classify this hit to prevent numerical cracking?

**Solution:**
In floating-point math, boundary points should use an inclusive epsilon:
$$\text{dist}^2 \le R^2 + \epsilon \quad (\text{where } \epsilon \approx 10^{-7})$$
This guarantees that rays striking adjacent clipped polygons do not fall through microscopic boundary cracks.

---

### Exercise 4.4: Inward vs. Outward Sphere Normals
**Problem:** When a ray originates inside a glass sphere (refraction / ray tracing), how must the surface normal $\hat{\mathbf{n}}$ be oriented?

**Solution:**
If the ray originates inside the sphere ($t_1 < 0$ and $t_2 > 0$):
$$\mathbf{P} = \mathbf{O} + t_2 \mathbf{D}$$
The geometric surface normal points outward: $\hat{\mathbf{n}}_{\text{geom}} = \frac{\mathbf{P} - \mathbf{c}}{R}$.
For optical shading, the shading normal must face toward the incoming ray:
$$\hat{\mathbf{n}}_{\text{shading}} = -\hat{\mathbf{n}}_{\text{geom}}$$

---

### Exercise 4.5: Triangle Edge Clamping for Shadow Rays
**Problem:** In shadow ray testing, we only need to know IF any geometry occludes the light source between $t \in [t_{\min}, t_{\max}]$. Show how Möller-Trumbore is modified for shadow queries.

**Solution:**
Instead of storing $t$, we simply return `true` at the first triangle satisfying $t_{\min} \le t \le t_{\max}$, immediately terminating further scene traversal.

---

### Exercise 4.6: Ray-Infinite Cylinder Degeneracy
**Problem:** What occurs in ray-cylinder intersection if $\mathbf{D}_\perp = \mathbf{0}$?

**Solution:**
If $\mathbf{D}_\perp = \mathbf{0}$, the ray direction $\mathbf{D}$ is perfectly parallel to the cylinder axis $\hat{\mathbf{a}}$ ($\mathbf{D} = \pm \hat{\mathbf{a}}$).
The quadratic equation $a t^2 + b t + c = 0$ has $a = 0$.
The ray is either permanently inside the cylinder (if $\|\boldsymbol{\Delta}_\perp\| \le R$) or permanently outside (if $\|\boldsymbol{\Delta}_\perp\| > R$), hitting only the endcap disks.

---

### Exercise 4.7: Barycentric Coordinates Outside $[0, 1]$
**Problem:** If a ray-plane hit yields $(u, v) = (-0.1, 0.4)$, describe geometrically where the hit lies relative to the triangle edges.

**Solution:**
Because $u < 0$, the hit point lies on the opposite side of edge $\mathbf{V}_0\mathbf{V}_2$ away from vertex $\mathbf{V}_1$.

---

### Exercise 4.8: Segment-Sphere Intersection Condition
**Problem:** A line segment has endpoints $\mathbf{A}$ and $\mathbf{B}$. Write the test condition ensuring that a sphere intersection falls on the segment.

**Solution:**
Let $L = \|\mathbf{B} - \mathbf{A}\|$ and $\mathbf{D} = (\mathbf{B} - \mathbf{A})/L$.
The segment intersects the sphere if and only if at least one sphere root $t \in [0, L]$, or the sphere center distance to the segment is $\le R$.

---

### Exercise 4.9: Water-Tight Ray Tracing (Woop's Algorithm Comparison)
**Problem:** Why can adjacent triangles in a mesh exhibit watertightness leaks (rays slipping through shared edges) under naive floating-point evaluation?

**Solution:**
When two adjacent triangles share edge $\mathbf{A}\mathbf{B}$, Triangle 1 evaluates the edge as $\mathbf{B} - \mathbf{A}$, while Triangle 2 evaluates it as $\mathbf{A} - \mathbf{B}$.
Due to non-associative floating-point rounding, the computed edge determinants can differ by 1 unit in the last place (ULP), creating a 1-bit hole. Modern engines enforce bit-identical edge permutation to guarantee watertightness.

---

### Exercise 4.10: Transforming Ray Direction into Local Mesh Coordinates
**Problem:** A mesh is scaled non-uniformly by matrix $\mathbf{S} = \text{diag}(2, 1, 0.5)$. How does the ray direction vector transform?

**Solution:**
Points and ray directions transform via the inverse scale:
$$\mathbf{D}_{\text{local}} = \mathbf{S}^{-1} \mathbf{D}_{\text{world}} = \left( \frac{D_x}{2}, D_y, 2 D_z \right)^T$$
Notice that $\mathbf{D}_{\text{local}}$ is no longer normalized! The hit parameter $t$ scales proportionally, maintaining exact world-space distance invariance.

---

## 4.8 Chapter Summary and Bridge to Chapter 5

In this chapter, we solved narrowphase ray queries:
1. **Ray Parameterization:** Defined the semi-infinite ray $\mathbf{P}(t) = \mathbf{O} + t \mathbf{D}$.
2. **Ray-Sphere & Ray-Capsule:** Solved quadratic discriminant equations and distance-to-segment tests.
3. **Ray-Plane & Ray-Disk:** Derived instantaneous algebraic dot product intersections.
4. **The Möller-Trumbore Algorithm:** Formulated the zero-plane-storage Cramer's rule solution for ray-triangle intersection.

However, raycasts only test 1D lines against surfaces. When two solid 3D convex polyhedra collide, we need a general, universal algorithm to detect overlap. In **Chapter 5: The Gilbert-Johnson-Keerthi (GJK) Algorithm in 3D**, we enter the heart of 3D narrowphase collision detection.
