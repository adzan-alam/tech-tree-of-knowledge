# Chapter 5: Vector Projections, Orthogonal Decompositions, and Gram-Schmidt in 3D

> *"The mind cannot conceive of any change of coordinate system without the operation of projecting the old upon the new, resolving the complex whole into its independent, orthogonal limbs."*  
> — **Arthur Cayley**, *Collected Mathematical Papers* (1889)

---

### Section 5.1 Scalar Projection (Component) of $\mathbf{u}$ onto $\mathbf{v}$

When analyzing physical systems in three dimensions—such as an aircraft experiencing a crosswind, a robotic manipulator pushing against a surface, or light reflecting off a faceted prism—we frequently need to answer a fundamental question:  
*How much of vector $\mathbf{u}$ acts in the direction of vector $\mathbf{v}$?*

Let $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$, with $\mathbf{v} \ne \mathbf{0}$. Let $\theta$ be the spatial angle between them ($0 \le \theta \le \pi$).

```
                u
               /|
              / |
             /  |
            /   |
           /    |
          /     |
         +------+----------> v
         0    proj_v(u)
         |------|
         comp_v(u)
```

The **scalar projection** (also termed the *scalar component*) of $\mathbf{u}$ onto $\mathbf{v}$, denoted $\text{comp}_{\mathbf{v}}(\mathbf{u})$, is the signed length of the shadow cast by $\mathbf{u}$ onto the infinite line containing $\mathbf{v}$:
$$\text{comp}_{\mathbf{v}}(\mathbf{u}) \equiv \|\mathbf{u}\| \cos\theta$$

Recalling from Chapter 4 that $\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$, we can isolate $\|\mathbf{u}\| \cos\theta$ by dividing both sides by $\|\mathbf{v}\|$:
$$\text{comp}_{\mathbf{v}}(\mathbf{u}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|}$$

Notice that if we define the normalized unit vector in the direction of $\mathbf{v}$ as $\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$, the scalar projection simplifies beautifully to:
$$\text{comp}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} \cdot \hat{\mathbf{v}}$$

#### Properties of the Scalar Projection:
1. **Signed Nature:**
   - If $0 \le \theta < \frac{\pi}{2}$ (acute), $\cos\theta > 0$, so $\text{comp}_{\mathbf{v}}(\mathbf{u}) > 0$ (points in the direction of $\mathbf{v}$).
   - If $\theta = \frac{\pi}{2}$ (orthogonal), $\cos\theta = 0$, so $\text{comp}_{\mathbf{v}}(\mathbf{u}) = 0$.
   - If $\frac{\pi}{2} < \theta \le \pi$ (obtuse), $\cos\theta < 0$, so $\text{comp}_{\mathbf{v}}(\mathbf{u}) < 0$ (points opposite to $\mathbf{v}$).
2. **Units:** The scalar projection carries the same physical units as $\mathbf{u}$ (e.g., Newtons if $\mathbf{u}$ is a force vector, or meters per second if $\mathbf{u}$ is velocity).

---

### Section 5.2 Vector Projection: Parallel Component $\mathbf{u}_{\parallel}$

While the scalar projection $\text{comp}_{\mathbf{v}}(\mathbf{u})$ gives the *magnitude and sign*, the **vector projection** of $\mathbf{u}$ onto $\mathbf{v}$, denoted $\text{proj}_{\mathbf{v}}(\mathbf{u})$ or $\mathbf{u}_{\parallel}$, is an actual 3D vector. It points in the direction of $\mathbf{v}$ (or opposite to $\mathbf{v}$ if the scalar projection is negative) with length equal to $|\text{comp}_{\mathbf{v}}(\mathbf{u})|$.

To construct this vector, we simply multiply the scalar projection by the unit direction vector $\hat{\mathbf{v}}$:
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\text{comp}_{\mathbf{v}}(\mathbf{u})\right) \hat{\mathbf{v}} = (\mathbf{u} \cdot \hat{\mathbf{v}}) \hat{\mathbf{v}}$$

Substituting $\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$:
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\mathbf{u} \cdot \frac{\mathbf{v}}{\|\mathbf{v}\|}\right) \frac{\mathbf{v}}{\|\mathbf{v}\|} = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}\right) \mathbf{v}$$

Recalling that $\|\mathbf{v}\|^2 = \mathbf{v} \cdot \mathbf{v}$:
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v}$$

#### Computational Efficiency:
Notice that this closed-form expression $\left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right)\mathbf{v}$ requires **zero square roots**!
Square roots (`Math.sqrt` or `sqrtf`) are computationally expensive (taking 10–15 CPU clock cycles). Computing $\text{proj}_{\mathbf{v}}(\mathbf{u})$ directly requires only two dot products (6 multiplications, 4 additions), one floating-point division, and one scalar-vector multiply (3 multiplications). This optimization is vital in high-frequency physics engines executing millions of projection operations per second.

---

### Section 5.3 Vector Rejection: Perpendicular Component $\mathbf{u}_{\perp}$

Every vector $\mathbf{u} \in \mathbb{R}^3$ can be decomposed uniquely into the sum of two orthogonal vectors relative to a reference direction $\mathbf{v}$:
$$\mathbf{u} = \mathbf{u}_{\parallel} + \mathbf{u}_{\perp}$$
where:
- $\mathbf{u}_{\parallel} = \text{proj}_{\mathbf{v}}(\mathbf{u})$ is parallel to $\mathbf{v}$.
- $\mathbf{u}_{\perp}$ is perpendicular (orthogonal) to $\mathbf{v}$.

The perpendicular component $\mathbf{u}_{\perp}$ is called the **vector rejection** of $\mathbf{u}$ from $\mathbf{v}$, denoted $\text{perp}_{\mathbf{v}}(\mathbf{u})$:
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \equiv \mathbf{u} - \text{proj}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} - \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v}$$

#### Rigorous Proof of Orthogonality:
We must prove that $\text{perp}_{\mathbf{v}}(\mathbf{u})$ is strictly orthogonal to $\mathbf{v}$, i.e., $\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = 0$:

$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = \left(\mathbf{u} - \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v}\right) \cdot \mathbf{v}$$

By bilinearity of the dot product:
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = \mathbf{u} \cdot \mathbf{v} - \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) (\mathbf{v} \cdot \mathbf{v})$$

The scalar $(\mathbf{v} \cdot \mathbf{v})$ in the denominator cancels with $(\mathbf{v} \cdot \mathbf{v})$ in the numerator:
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = \mathbf{u} \cdot \mathbf{v} - \mathbf{u} \cdot \mathbf{v} = 0 \quad \blacksquare$$

#### The Pythagorean Verification:
Since $\mathbf{u}_{\parallel}$ and $\mathbf{u}_{\perp}$ are strictly orthogonal, the Pythagorean theorem must hold:
$$\|\mathbf{u}\|^2 = \|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2$$
*Proof:*
$$\|\mathbf{u}\|^2 = (\mathbf{u}_{\parallel} + \mathbf{u}_{\perp}) \cdot (\mathbf{u}_{\parallel} + \mathbf{u}_{\perp}) = \|\mathbf{u}_{\parallel}\|^2 + 2(\mathbf{u}_{\parallel} \cdot \mathbf{u}_{\perp}) + \|\mathbf{u}_{\perp}\|^2$$
Since $\mathbf{u}_{\parallel} \parallel \mathbf{v}$ and $\mathbf{u}_{\perp} \perp \mathbf{v}$, their dot product is identically zero:
$$\|\mathbf{u}\|^2 = \|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2 \quad \blacksquare$$

---

### Section 5.4 Physics Applications: Incline Planes and Contact Friction Resolution

In classical mechanics and game physics engines, contact manifolds require decomposing forces and velocities relative to surface contact normals:

```
               \  F_total
                \
                 \
       -----------+------------ Normal n
                 /|
        F_normal/ |
               /  | F_tangent
              v   v
       ======================== Surface Plane
```

#### 1. Contact Force Resolution
When an external force $\mathbf{F}_{\text{ext}}$ acts on a rigid body resting on an arbitrary 3D collision plane with unit surface normal $\hat{\mathbf{n}}$:
1. The **normal force component** pushing directly into the surface is:
   $$\mathbf{F}_n = (\mathbf{F}_{\text{ext}} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
2. The **tangential shear force component** attempting to slide the body along the surface is:
   $$\mathbf{F}_t = \mathbf{F}_{\text{ext}} - \mathbf{F}_n = \mathbf{F}_{\text{ext}} - (\mathbf{F}_{\text{ext}} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
3. Coulomb Friction Law:
   The maximum static friction before sliding occurs is:
   $$F_{\text{friction, max}} = \mu_s \|\mathbf{F}_n\|$$
   - If $\|\mathbf{F}_t\| \le \mu_s \|\mathbf{F}_n\|$, the body remains stationary (static friction balances $\mathbf{F}_t$).
   - If $\|\mathbf{F}_t\| > \mu_s \|\mathbf{F}_n\|$, the body slips, and kinetic friction acts antiparallel to the tangential sliding velocity:
     $$\mathbf{F}_{\text{kinetic}} = -\mu_k \|\mathbf{F}_n\| \frac{\mathbf{v}_t}{\|\mathbf{v}_t\|}$$

#### 2. Elastic Collision Velocity Reflection
When a particle with velocity $\mathbf{v}$ collides with a rigid immovable plane having unit normal $\hat{\mathbf{n}}$ and coefficient of restitution $e \in [0, 1]$:
$$\mathbf{v}_n = (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
$$\mathbf{v}_t = \mathbf{v} - \mathbf{v}_n$$
The post-collision velocity is:
$$\mathbf{v}' = \mathbf{v}_t - e \mathbf{v}_n = (\mathbf{v} - \mathbf{v}_n) - e \mathbf{v}_n = \mathbf{v} - (1 + e)(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
For a perfectly elastic collision ($e = 1$):
$$\mathbf{v}' = \mathbf{v} - 2(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
This is the famous vector reflection formula used in optics raytracing and physics simulators worldwide.

---

### Section 5.5 The Gram-Schmidt Orthonormalization Process in $\mathbb{R}^3$

Given any three linearly independent vectors $\{\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3\}$ spanning $\mathbb{R}^3$, how do we construct a mutually perpendicular set of unit vectors $\{\mathbf{q}_1, \mathbf{q}_2, \mathbf{q}_3\}$ that spans the exact same space?

This algorithm is the **Gram-Schmidt Orthonormalization Process**. It proceeds inductively by stripping away parallel projections at each stage:

```
Step 1: Choose v1
        u1 = v1
        q1 = u1 / ||u1||

Step 2: Strip projection of v2 onto q1
        u2 = v2 - (v2 · q1) q1
        q2 = u2 / ||u2||

Step 3: Strip projections of v3 onto q1 AND q2
        u3 = v3 - (v3 · q1) q1 - (v3 · q2) q2
        q3 = u3 / ||u3||
```

#### Detailed Mathematical Steps:

1. **Step 1 (First Basis Vector):**
   Take the first vector as our reference direction:
   $$\mathbf{u}_1 = \mathbf{v}_1$$
   Normalize to unit length:
   $$\mathbf{q}_1 = \frac{\mathbf{u}_1}{\|\mathbf{u}_1\|}$$

2. **Step 2 (Second Basis Vector):**
   Project $\mathbf{v}_2$ onto $\mathbf{q}_1$ and subtract (reject):
   $$\mathbf{u}_2 = \mathbf{v}_2 - \text{proj}_{\mathbf{q}_1}(\mathbf{v}_2) = \mathbf{v}_2 - (\mathbf{v}_2 \cdot \mathbf{q}_1)\mathbf{q}_1$$
   Notice that $\mathbf{u}_2 \cdot \mathbf{q}_1 = \mathbf{v}_2 \cdot \mathbf{q}_1 - (\mathbf{v}_2 \cdot \mathbf{q}_1)(\mathbf{q}_1 \cdot \mathbf{q}_1) = 0$.
   Normalize:
   $$\mathbf{q}_2 = \frac{\mathbf{u}_2}{\|\mathbf{u}_2\|}$$

3. **Step 3 (Third Basis Vector):**
   $\mathbf{v}_3$ has components along both $\mathbf{q}_1$ and $\mathbf{q}_2$. We subtract both projections:
   $$\mathbf{u}_3 = \mathbf{v}_3 - \text{proj}_{\mathbf{q}_1}(\mathbf{v}_3) - \text{proj}_{\mathbf{q}_2}(\mathbf{v}_3) = \mathbf{v}_3 - (\mathbf{v}_3 \cdot \mathbf{q}_1)\mathbf{q}_1 - (\mathbf{v}_3 \cdot \mathbf{q}_2)\mathbf{q}_2$$
   Let us verify that $\mathbf{u}_3$ is orthogonal to $\mathbf{q}_1$:
   $$\mathbf{u}_3 \cdot \mathbf{q}_1 = \mathbf{v}_3 \cdot \mathbf{q}_1 - (\mathbf{v}_3 \cdot \mathbf{q}_1)(\mathbf{q}_1 \cdot \mathbf{q}_1) - (\mathbf{v}_3 \cdot \mathbf{q}_2)(\mathbf{q}_2 \cdot \mathbf{q}_1) = (\mathbf{v}_3 \cdot \mathbf{q}_1) - (\mathbf{v}_3 \cdot \mathbf{q}_1) - 0 = 0$$
   Similarly, $\mathbf{u}_3 \cdot \mathbf{q}_2 = 0$.
   Normalize:
   $$\mathbf{q}_3 = \frac{\mathbf{u}_3}{\|\mathbf{u}_3\|}$$

The resulting set $\{\mathbf{q}_1, \mathbf{q}_2, \mathbf{q}_3\}$ forms an **orthonormal basis** of $\mathbb{R}^3$:
$$\mathbf{q}_i \cdot \mathbf{q}_j = \delta_{ij} = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \ne j \end{cases}$$

---

### Section 5.6 Camera "Look-At" Matrix Basis Construction

In 3D graphics rendering (OpenGL, Vulkan, DirectX, WebGL), setting up a virtual camera requires transforming world coordinates into the camera's local coordinate frame. This is established via a "Look-At" construction.

Given:
- Camera eye position in world space: $\mathbf{P}_{\text{eye}}$
- Target point the camera is looking at: $\mathbf{P}_{\text{target}}$
- Approximate "World Up" hint vector: $\mathbf{v}_{\text{up, world}}$ (usually $\begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$ or $\begin{bmatrix} 0 & 0 & 1 \end{bmatrix}^T$)

```
          v_up,world
             ^
             |    P_eye
             |   /  \
             |  /    \  z_cam (backward) = normalize(P_eye - P_target)
             | /      \
             +---------> P_target
```

To construct the camera's orthonormal basis vectors $\{\hat{\mathbf{r}}, \hat{\mathbf{u}}, \hat{\mathbf{f}}\}$ (Right, Up, Forward):
1. **Forward Vector $\hat{\mathbf{f}}$ (or viewing direction):**
   In right-handed camera conventions (like OpenGL), the camera looks down its negative $z$-axis. So the camera's local positive $z$-axis points backward:
   $$\mathbf{z}_{\text{cam}} = \frac{\mathbf{P}_{\text{eye}} - \mathbf{P}_{\text{target}}}{\|\mathbf{P}_{\text{eye}} - \mathbf{P}_{\text{target}}\|}$$
2. **Right Vector $\hat{\mathbf{r}}$ ($x_{\text{cam}}$):**
   The camera right vector must be perpendicular to both the viewing axis $\mathbf{z}_{\text{cam}}$ and the approximate world up vector:
   $$\mathbf{x}_{\text{cam}} = \frac{\mathbf{v}_{\text{up, world}} \times \mathbf{z}_{\text{cam}}}{\|\mathbf{v}_{\text{up, world}} \times \mathbf{z}_{\text{cam}}\|}$$
3. **True Orthogonal Camera Up Vector $\hat{\mathbf{u}}$ ($y_{\text{cam}}$):**
   Because the user-supplied $\mathbf{v}_{\text{up, world}}$ is rarely exactly perpendicular to $\mathbf{z}_{\text{cam}}$, we obtain the true camera up vector via vector rejection or cross product:
   $$\mathbf{y}_{\text{cam}} = \mathbf{z}_{\text{cam}} \times \mathbf{x}_{\text{cam}}$$
   Or via Gram-Schmidt rejection:
   $$\mathbf{y}_{\text{cam}} = \frac{\mathbf{v}_{\text{up, world}} - (\mathbf{v}_{\text{up, world}} \cdot \mathbf{z}_{\text{cam}})\mathbf{z}_{\text{cam}}}{\|\mathbf{v}_{\text{up, world}} - (\mathbf{v}_{\text{up, world}} \cdot \mathbf{z}_{\text{cam}})\mathbf{z}_{\text{cam}}\|}$$

---

### Section 5.7 Numerical Drift and Re-Orthonormalization in Game Loops

In 3D physics and flight simulators, orientation matrices are continuously integrated over thousands of frames:
$$\mathbf{R}(t + \Delta t) \approx \mathbf{R}(t) + \boldsymbol{\Omega} \mathbf{R}(t) \Delta t$$
Because floating-point arithmetic introduces tiny truncation errors at each step, after thousands of ticks the column vectors of $\mathbf{R}$ drift:
- Their lengths deviate from 1.0 (shear and scale distortion).
- Their mutual dot products deviate from 0.0 (skew and non-orthogonality).

If left uncorrected, spaceships distort into trapezoids, collision detection fails, and physics objects explode.

#### Modified Gram-Schmidt Re-Orthonormalization
To prevent drift, engines periodically (e.g., every frame or every 10 frames) apply a lightweight Gram-Schmidt re-orthonormalization to the column vectors $\mathbf{c}_0, \mathbf{c}_1, \mathbf{c}_2$ of the rotation matrix:
```typescript
function reorthonormalizeMatrix(c0: Vector3, c1: Vector3, c2: Vector3): void {
  // 1. Normalize primary axis (c0)
  c0.normalize();
  
  // 2. Make c1 perpendicular to c0, then normalize
  const dot01 = c0.dot(c1);
  c1.x -= dot01 * c0.x;
  c1.y -= dot01 * c0.y;
  c1.z -= dot01 * c0.z;
  c1.normalize();
  
  // 3. Make c2 perpendicular to both c0 and c1 (or take cross product c0 x c1)
  const dot02 = c0.dot(c2);
  const dot12 = c1.dot(c2);
  c2.x -= (dot02 * c0.x + dot12 * c1.x);
  c2.y -= (dot02 * c0.y + dot12 * c1.y);
  c2.z -= (dot02 * c0.z + dot12 * c1.z);
  c2.normalize();
}
```

---

### Section 5.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 5.1: Scalar and Vector Projection Calculation
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 4 \\ 2 \\ -4 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$:
1. Find the scalar projection $\text{comp}_{\mathbf{v}}(\mathbf{u})$.
2. Find the vector projection $\text{proj}_{\mathbf{v}}(\mathbf{u})$.
3. Find the vector rejection $\text{perp}_{\mathbf{v}}(\mathbf{u})$.
4. Verify that $\text{proj}_{\mathbf{v}}(\mathbf{u}) \cdot \text{perp}_{\mathbf{v}}(\mathbf{u}) = 0$.

**Solution:**
1. Compute $\mathbf{u} \cdot \mathbf{v}$ and $\|\mathbf{v}\|$:
   $$\mathbf{u} \cdot \mathbf{v} = (4)(1) + (2)(2) + (-4)(2) = 4 + 4 - 8 = 0$$
   Wait! The dot product is exactly 0!
   $$\|\mathbf{v}\| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{9} = 3$$
   Therefore:
   $$\text{comp}_{\mathbf{v}}(\mathbf{u}) = \frac{0}{3} = 0$$
2. Vector projection:
   $$\text{proj}_{\mathbf{v}}(\mathbf{u}) = 0 \cdot \hat{\mathbf{v}} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
3. Vector rejection:
   $$\text{perp}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} - \mathbf{0} = \mathbf{u} = \begin{bmatrix} 4 \\ 2 \\ -4 \end{bmatrix}$$
4. Verification:
   $$\mathbf{0} \cdot \mathbf{u} = 0 \quad \checkmark$$
Because the vectors are already orthogonal, $\mathbf{u}$ has zero component along $\mathbf{v}$.

---

#### Example 5.2: Non-Zero Projection and Decomposition
**Problem:** Let $\mathbf{u} = \begin{bmatrix} 3 \\ 6 \\ 2 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 2 \\ 1 \\ -2 \end{bmatrix}$. Compute $\mathbf{u}_{\parallel}$ and $\mathbf{u}_{\perp}$ relative to $\mathbf{v}$, and verify the Pythagorean relation $\|\mathbf{u}\|^2 = \|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2$.

**Solution:**
1. Compute $\mathbf{u} \cdot \mathbf{v}$ and $\mathbf{v} \cdot \mathbf{v}$:
   $$\mathbf{u} \cdot \mathbf{v} = (3)(2) + (6)(1) + (2)(-2) = 6 + 6 - 4 = 8$$
   $$\mathbf{v} \cdot \mathbf{v} = 2^2 + 1^2 + (-2)^2 = 4 + 1 + 4 = 9$$
2. Compute parallel component:
   $$\mathbf{u}_{\parallel} = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v} = \frac{8}{9} \begin{bmatrix} 2 \\ 1 \\ -2 \end{bmatrix} = \begin{bmatrix} 16/9 \\ 8/9 \\ -16/9 \end{bmatrix}$$
3. Compute perpendicular component:
   $$\mathbf{u}_{\perp} = \mathbf{u} - \mathbf{u}_{\parallel} = \begin{bmatrix} 3 - 16/9 \\ 6 - 8/9 \\ 2 - (-16/9) \end{bmatrix} = \begin{bmatrix} 11/9 \\ 46/9 \\ 34/9 \end{bmatrix}$$
4. Check orthogonality:
   $$\mathbf{u}_{\parallel} \cdot \mathbf{u}_{\perp} = \left(\frac{16}{9}\right)\left(\frac{11}{9}\right) + \left(\frac{8}{9}\right)\left(\frac{46}{9}\right) + \left(-\frac{16}{9}\right)\left(\frac{34}{9}\right)$$
   $$= \frac{176 + 368 - 544}{81} = \frac{544 - 544}{81} = 0 \quad \checkmark$$
5. Pythagorean verification:
   $$\|\mathbf{u}\|^2 = 3^2 + 6^2 + 2^2 = 9 + 36 + 4 = 49$$
   $$\|\mathbf{u}_{\parallel}\|^2 = \left(\frac{8}{9}\right)^2 \|\mathbf{v}\|^2 = \frac{64}{81} \times 9 = \frac{64}{9}$$
   $$\|\mathbf{u}_{\perp}\|^2 = \frac{11^2 + 46^2 + 34^2}{81} = \frac{121 + 2116 + 1156}{81} = \frac{3393}{81} = \frac{377}{9}$$
   $$\|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2 = \frac{64}{9} + \frac{377}{9} = \frac{441}{9} = 49 = \|\mathbf{u}\|^2 \quad \checkmark$$

---

#### Example 5.3: Distance from a Point to an Arbitrary 3D Line
**Problem:** Find the perpendicular distance from point $P(4, 1, -2)$ to the 3D line passing through origin $O(0, 0, 0)$ with direction $\mathbf{d} = \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix}$.

**Solution:**
Let $\mathbf{p} = \vec{OP} = \begin{bmatrix} 4 \\ 1 \\ -2 \end{bmatrix}$.
The vector projection of $\mathbf{p}$ onto the line direction $\mathbf{d}$ represents the vector from $O$ to the closest point on the line $Q$:
$$\vec{OQ} = \text{proj}_{\mathbf{d}}(\mathbf{p}) = \left(\frac{\mathbf{p} \cdot \mathbf{d}}{\mathbf{d} \cdot \mathbf{d}}\right) \mathbf{d}$$
1. Compute dot products:
   $$\mathbf{p} \cdot \mathbf{d} = (4)(1) + (1)(2) + (-2)(-1) = 4 + 2 + 2 = 8$$
   $$\mathbf{d} \cdot \mathbf{d} = 1^2 + 2^2 + (-1)^2 = 1 + 4 + 1 = 6$$
2. Compute $\vec{OQ}$:
   $$\vec{OQ} = \frac{8}{6} \mathbf{d} = \frac{4}{3} \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix} = \begin{bmatrix} 4/3 \\ 8/3 \\ -4/3 \end{bmatrix}$$
3. The displacement vector from line to $P$ is the rejection $\mathbf{p}_{\perp}$:
   $$\mathbf{p}_{\perp} = \mathbf{p} - \vec{OQ} = \begin{bmatrix} 4 - 4/3 \\ 1 - 8/3 \\ -2 - (-4/3) \end{bmatrix} = \begin{bmatrix} 8/3 \\ -5/3 \\ -2/3 \end{bmatrix}$$
4. The perpendicular distance is $\|\mathbf{p}_{\perp}\|$:
   $$\text{dist} = \sqrt{\left(\frac{8}{3}\right)^2 + \left(-\frac{5}{3}\right)^2 + \left(-\frac{2}{3}\right)^2} = \sqrt{\frac{64 + 25 + 4}{9}} = \sqrt{\frac{93}{9}} = \frac{\sqrt{93}}{3} \approx 3.21455$$

---

#### Example 5.4: Resolving Gravity on an Arbitrary 3D Incline
**Problem:** A block of mass $m = 10 \text{ kg}$ rests on an inclined surface with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0.36 \\ 0.48 \\ 0.80 \end{bmatrix}$ in a coordinate system where gravity acts along the negative $z$-axis: $\mathbf{g} = \begin{bmatrix} 0 \\ 0 \\ -9.81 \end{bmatrix} \text{ m/s}^2$.
Find the normal force vector $\mathbf{F}_n$ and the tangential downslope sliding force vector $\mathbf{F}_t$.

**Solution:**
1. Gravitational force vector:
   $$\mathbf{F}_g = m\mathbf{g} = 10 \begin{bmatrix} 0 \\ 0 \\ -9.81 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ -98.1 \end{bmatrix} \text{ N}$$
2. Verify unit normal:
   $$\|\hat{\mathbf{n}}\|^2 = 0.36^2 + 0.48^2 + 0.80^2 = 0.1296 + 0.2304 + 0.6400 = 1.0000 \quad \checkmark$$
3. Scalar projection of $\mathbf{F}_g$ along normal $\hat{\mathbf{n}}$:
   $$\mathbf{F}_g \cdot \hat{\mathbf{n}} = (0)(0.36) + (0)(0.48) + (-98.1)(0.80) = -78.48 \text{ N}$$
   The normal force $\mathbf{F}_n$ exerted by the surface opposes this penetration:
   $$\mathbf{F}_{\text{normal}} = -(\mathbf{F}_g \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} = -(-78.48) \begin{bmatrix} 0.36 \\ 0.48 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 28.2528 \\ 37.6704 \\ 62.7840 \end{bmatrix} \text{ N}$$
4. Tangential downslope force $\mathbf{F}_t$:
   $$\mathbf{F}_t = \mathbf{F}_g - (\mathbf{F}_g \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0 \\ -98.1 \end{bmatrix} - (-78.48) \begin{bmatrix} 0.36 \\ 0.48 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 0 + 28.2528 \\ 0 + 37.6704 \\ -98.1 + 62.7840 \end{bmatrix} = \begin{bmatrix} 28.2528 \\ 37.6704 \\ -35.3160 \end{bmatrix} \text{ N}$$
5. Magnitude checks:
   $$\|\mathbf{F}_g\| = 98.1 \text{ N}$$
   $$\|\mathbf{F}_n\| = 78.48 \text{ N}$$
   $$\|\mathbf{F}_t\| = \sqrt{28.2528^2 + 37.6704^2 + (-35.3160)^2} = \sqrt{798.22 + 1419.06 + 1247.22} = \sqrt{3464.50} \approx 58.86 \text{ N}$$
   $$\sqrt{\|\mathbf{F}_n\|^2 + \|\mathbf{F}_t\|^2} = \sqrt{78.48^2 + 58.86^2} = \sqrt{6159.11 + 3464.50} = \sqrt{9623.61} = 98.1 \text{ N} \quad \checkmark$$

---

#### Example 5.5: Full Gram-Schmidt Orthonormalization in $\mathbb{R}^3$
**Problem:** Construct an orthonormal basis $\{\mathbf{q}_1, \mathbf{q}_2, \mathbf{q}_3\}$ from the linearly independent vectors:
$$\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}, \quad \mathbf{v}_3 = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix}$$

**Solution:**
**Step 1:**
$$\mathbf{u}_1 = \mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$$
$$\|\mathbf{u}_1\| = \sqrt{1^2 + 1^2 + 0^2} = \sqrt{2}$$
$$\mathbf{q}_1 = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$

**Step 2:**
$$\mathbf{v}_2 \cdot \mathbf{q}_1 = (1)\left(\frac{1}{\sqrt{2}}\right) + (0)\left(\frac{1}{\sqrt{2}}\right) + (1)(0) = \frac{1}{\sqrt{2}}$$
$$\mathbf{u}_2 = \mathbf{v}_2 - (\mathbf{v}_2 \cdot \mathbf{q}_1)\mathbf{q}_1 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} - \frac{1}{\sqrt{2}} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} - \begin{bmatrix} 1/2 \\ 1/2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/2 \\ -1/2 \\ 1 \end{bmatrix}$$
$$\|\mathbf{u}_2\| = \sqrt{(1/2)^2 + (-1/2)^2 + 1^2} = \sqrt{\frac{1}{4} + \frac{1}{4} + 1} = \sqrt{\frac{6}{4}} = \frac{\sqrt{6}}{2}$$
$$\mathbf{q}_2 = \frac{\mathbf{u}_2}{\|\mathbf{u}_2\|} = \frac{2}{\sqrt{6}} \begin{bmatrix} 1/2 \\ -1/2 \\ 1 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{6} \\ -1/\sqrt{6} \\ 2/\sqrt{6} \end{bmatrix}$$

**Step 3:**
$$\mathbf{v}_3 \cdot \mathbf{q}_1 = (0)\left(\frac{1}{\sqrt{2}}\right) + (1)\left(\frac{1}{\sqrt{2}}\right) + (1)(0) = \frac{1}{\sqrt{2}}$$
$$\mathbf{v}_3 \cdot \mathbf{q}_2 = (0)\left(\frac{1}{\sqrt{6}}\right) + (1)\left(-\frac{1}{\sqrt{6}}\right) + (1)\left(\frac{2}{\sqrt{6}}\right) = \frac{1}{\sqrt{6}}$$
Now subtract both projections from $\mathbf{v}_3$:
$$\mathbf{u}_3 = \mathbf{v}_3 - (\mathbf{v}_3 \cdot \mathbf{q}_1)\mathbf{q}_1 - (\mathbf{v}_3 \cdot \mathbf{q}_2)\mathbf{q}_2$$
$$= \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix} - \frac{1}{\sqrt{2}} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} - \frac{1}{\sqrt{6}} \begin{bmatrix} 1/\sqrt{6} \\ -1/\sqrt{6} \\ 2/\sqrt{6} \end{bmatrix}$$
$$= \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1/2 \\ 1/2 \\ 0 \end{bmatrix} - \begin{bmatrix} 1/6 \\ -1/6 \\ 2/6 \end{bmatrix} = \begin{bmatrix} 0 - 3/6 - 1/6 \\ 1 - 3/6 + 1/6 \\ 1 - 0 - 2/6 \end{bmatrix} = \begin{bmatrix} -4/6 \\ 4/6 \\ 4/6 \end{bmatrix} = \begin{bmatrix} -2/3 \\ 2/3 \\ 2/3 \end{bmatrix}$$
$$\|\mathbf{u}_3\| = \sqrt{(-2/3)^2 + (2/3)^2 + (2/3)^2} = \sqrt{\frac{4+4+4}{9}} = \sqrt{\frac{12}{9}} = \frac{2\sqrt{3}}{3}$$
$$\mathbf{q}_3 = \frac{3}{2\sqrt{3}} \begin{bmatrix} -2/3 \\ 2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} -1/\sqrt{3} \\ 1/\sqrt{3} \\ 1/\sqrt{3} \end{bmatrix}$$

**Verification:**
- $\mathbf{q}_1 \cdot \mathbf{q}_2 = \frac{1}{\sqrt{12}} - \frac{1}{\sqrt{12}} + 0 = 0 \quad \checkmark$
- $\mathbf{q}_1 \cdot \mathbf{q}_3 = -\frac{1}{\sqrt{6}} + \frac{1}{\sqrt{6}} + 0 = 0 \quad \checkmark$
- $\mathbf{q}_2 \cdot \mathbf{q}_3 = -\frac{1}{\sqrt{18}} - \frac{1}{\sqrt{18}} + \frac{2}{\sqrt{18}} = 0 \quad \checkmark$
- All magnitudes equal 1.0 $\checkmark$.

---

#### Example 5.6: Camera Look-At Frame Construction
**Problem:** Construct the camera basis vectors $\hat{\mathbf{r}}$ (right), $\hat{\mathbf{u}}$ (up), and $\hat{\mathbf{f}}$ (forward) for a virtual camera positioned at $\mathbf{P}_{\text{eye}} = (0, 5, 10)$, gazing at target $\mathbf{P}_{\text{target}} = (0, 0, 0)$, with world up reference $\mathbf{v}_{\text{up, world}} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$.

**Solution:**
1. Compute camera view direction (looking from eye to target):
   $$\mathbf{d} = \mathbf{P}_{\text{target}} - \mathbf{P}_{\text{eye}} = \begin{bmatrix} 0 - 0 \\ 0 - 5 \\ 0 - 10 \end{bmatrix} = \begin{bmatrix} 0 \\ -5 \\ -10 \end{bmatrix}$$
   $$\|\mathbf{d}\| = \sqrt{0 + 25 + 100} = \sqrt{125} = 5\sqrt{5}$$
   $$\hat{\mathbf{f}} = \frac{\mathbf{d}}{\|\mathbf{d}\|} = \begin{bmatrix} 0 \\ -1/\sqrt{5} \\ -2/\sqrt{5} \end{bmatrix}$$
2. The backward camera $z$-axis in OpenGL conventions:
   $$\hat{\mathbf{z}}_{\text{cam}} = -\hat{\mathbf{f}} = \begin{bmatrix} 0 \\ 1/\sqrt{5} \\ 2/\sqrt{5} \end{bmatrix}$$
3. Compute the right vector $\hat{\mathbf{r}}$ via cross product $\mathbf{v}_{\text{up, world}} \times \hat{\mathbf{z}}_{\text{cam}}$:
   $$\mathbf{r} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 1/\sqrt{5} \\ 2/\sqrt{5} \end{bmatrix} = \begin{bmatrix} (1)(2/\sqrt{5}) - (0)(1/\sqrt{5}) \\ (0)(0) - (0)(2/\sqrt{5}) \\ (0)(1/\sqrt{5}) - (1)(0) \end{bmatrix} = \begin{bmatrix} 2/\sqrt{5} \\ 0 \\ 0 \end{bmatrix}$$
   Normalize $\mathbf{r}$:
   $$\|\mathbf{r}\| = 2/\sqrt{5} \implies \hat{\mathbf{r}} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
4. Compute the true camera up vector $\hat{\mathbf{u}}$:
   $$\hat{\mathbf{u}} = \hat{\mathbf{z}}_{\text{cam}} \times \hat{\mathbf{r}} = \begin{bmatrix} 0 \\ 1/\sqrt{5} \\ 2/\sqrt{5} \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} (1/\sqrt{5})(0) - (2/\sqrt{5})(0) \\ (2/\sqrt{5})(1) - (0)(0) \\ (0)(0) - (1/\sqrt{5})(1) \end{bmatrix} = \begin{bmatrix} 0 \\ 2/\sqrt{5} \\ -1/\sqrt{5} \end{bmatrix}$$
5. Verification:
   $$\|\hat{\mathbf{u}}\| = \sqrt{0 + \frac{4}{5} + \frac{1}{5}} = 1.0$$
   $$\hat{\mathbf{r}} \cdot \hat{\mathbf{u}} = 0$$
   $$\hat{\mathbf{u}} \cdot \hat{\mathbf{z}}_{\text{cam}} = (0)(0) + \left(\frac{2}{\sqrt{5}}\right)\left(\frac{1}{\sqrt{5}}\right) + \left(-\frac{1}{\sqrt{5}}\right)\left(\frac{2}{\sqrt{5}}\right) = \frac{2}{5} - \frac{2}{5} = 0 \quad \checkmark$$

---

#### Example 5.7: Elastic Reflection of a Velocity Vector
**Problem:** A billiard ball moving in 3D with velocity $\mathbf{v} = \begin{bmatrix} 5 \\ -4 \\ 3 \end{bmatrix} \text{ m/s}$ bounces off a cushion plane with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$. The coefficient of restitution is $e = 0.8$. Find the rebound velocity $\mathbf{v}'$.

**Solution:**
1. Component along normal:
   $$v_n = \mathbf{v} \cdot \hat{\mathbf{n}} = (5)(0) + (-4)(1) + (3)(0) = -4 \text{ m/s}$$
   Notice $v_n < 0$, which confirms the ball is approaching the surface.
2. Normal velocity vector:
   $$\mathbf{v}_n = v_n \hat{\mathbf{n}} = -4 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -4 \\ 0 \end{bmatrix}$$
3. Tangential velocity vector:
   $$\mathbf{v}_t = \mathbf{v} - \mathbf{v}_n = \begin{bmatrix} 5 \\ -4 \\ 3 \end{bmatrix} - \begin{bmatrix} 0 \\ -4 \\ 0 \end{bmatrix} = \begin{bmatrix} 5 \\ 0 \\ 3 \end{bmatrix}$$
4. Rebound velocity:
   $$\mathbf{v}' = \mathbf{v}_t - e \mathbf{v}_n = \begin{bmatrix} 5 \\ 0 \\ 3 \end{bmatrix} - (0.8) \begin{bmatrix} 0 \\ -4 \\ 0 \end{bmatrix} = \begin{bmatrix} 5 \\ 3.2 \\ 3 \end{bmatrix} \text{ m/s}$$

---

#### Example 5.8: Closest Approach of a Particle to a Ray
**Problem:** A laser beam travels along ray $\mathbf{R}(t) = \mathbf{P}_0 + t \hat{\mathbf{d}}$ with $\mathbf{P}_0 = (1, 2, 3)$ and $\hat{\mathbf{d}} = \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix}$ ($t \ge 0$). A target drone is at $\mathbf{T}(4, 1, 3)$. Find the ray parameter $t^*$ where the laser is closest to the drone, and find the minimum distance.

**Solution:**
1. Vector from ray origin to drone:
   $$\mathbf{w} = \mathbf{T} - \mathbf{P}_0 = \begin{bmatrix} 4 - 1 \\ 1 - 2 \\ 3 - 3 \end{bmatrix} = \begin{bmatrix} 3 \\ -1 \\ 0 \end{bmatrix}$$
2. The parameter $t^*$ is the scalar projection of $\mathbf{w}$ onto $\hat{\mathbf{d}}$:
   $$t^* = \mathbf{w} \cdot \hat{\mathbf{d}} = (3)(0.6) + (-1)(0.8) + (0)(0) = 1.8 - 0.8 = 1.0$$
   Since $t^* = 1.0 \ge 0$, the closest point lies on the forward ray.
3. The closest point on the ray is:
   $$\mathbf{P}(1.0) = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} + 1.0 \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1.6 \\ 2.8 \\ 3.0 \end{bmatrix}$$
4. The minimum distance is the length of the vector rejection:
   $$\mathbf{d}_{\min} = \mathbf{T} - \mathbf{P}(1.0) = \begin{bmatrix} 4 - 1.6 \\ 1 - 2.8 \\ 3 - 3.0 \end{bmatrix} = \begin{bmatrix} 2.4 \\ -1.8 \\ 0 \end{bmatrix}$$
   $$\|\mathbf{d}_{\min}\| = \sqrt{2.4^2 + (-1.8)^2 + 0^2} = \sqrt{5.76 + 3.24} = \sqrt{9.00} = 3.0 \text{ units}$$

---

#### Example 5.9: Projection Matrix Operator Formulation
**Problem:** Find the $3 \times 3$ matrix $\mathbf{P}$ that projects any vector in $\mathbb{R}^3$ orthogonally onto the line spanned by the unit vector $\hat{\mathbf{n}} = \begin{bmatrix} 1/3 \\ 2/3 \\ 2/3 \end{bmatrix}$.

**Solution:**
The vector projection is $\text{proj}_{\hat{\mathbf{n}}}(\mathbf{x}) = (\mathbf{x} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$.
In matrix form:
$$\text{proj}_{\hat{\mathbf{n}}}(\mathbf{x}) = \hat{\mathbf{n}} (\hat{\mathbf{n}}^T \mathbf{x}) = (\hat{\mathbf{n}} \hat{\mathbf{n}}^T) \mathbf{x}$$
The projection matrix is the outer product $\mathbf{P} = \hat{\mathbf{n}} \hat{\mathbf{n}}^T$:
$$\mathbf{P} = \begin{bmatrix} 1/3 \\ 2/3 \\ 2/3 \end{bmatrix} \begin{bmatrix} 1/3 & 2/3 & 2/3 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix} \begin{bmatrix} 1 & 2 & 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 1 & 2 & 2 \\ 2 & 4 & 4 \\ 2 & 4 & 4 \end{bmatrix}$$
*Verification of idempotency ($\mathbf{P}^2 = \mathbf{P}$):*
$$\mathbf{P}^2 = (\hat{\mathbf{n}} \hat{\mathbf{n}}^T)(\hat{\mathbf{n}} \hat{\mathbf{n}}^T) = \hat{\mathbf{n}} (\hat{\mathbf{n}}^T \hat{\mathbf{n}}) \hat{\mathbf{n}}^T = \hat{\mathbf{n}} (1) \hat{\mathbf{n}}^T = \mathbf{P} \quad \checkmark$$

---

#### Example 5.10: Re-Orthonormalizing a Drifted Transformation Matrix
**Problem:** Due to numerical accumulation, a transformation matrix has column vectors:
$$\mathbf{c}_0 = \begin{bmatrix} 1.002 \\ 0.001 \\ -0.001 \end{bmatrix}, \quad \mathbf{c}_1 = \begin{bmatrix} 0.003 \\ 0.998 \\ 0.002 \end{bmatrix}$$
Perform one step of Gram-Schmidt to re-orthonormalize $\mathbf{c}_0$ and $\mathbf{c}_1$.

**Solution:**
1. Re-normalize $\mathbf{c}_0$:
   $$\|\mathbf{c}_0\| = \sqrt{(1.002)^2 + (0.001)^2 + (-0.001)^2} = \sqrt{1.004004 + 0.000001 + 0.000001} \approx 1.002001$$
   $$\mathbf{q}_0 = \frac{\mathbf{c}_0}{\|\mathbf{c}_0\|} \approx \begin{bmatrix} 0.999999 \\ 0.000998 \\ -0.000998 \end{bmatrix}$$
2. Remove projection of $\mathbf{c}_1$ onto $\mathbf{q}_0$:
   $$\mathbf{c}_1 \cdot \mathbf{q}_0 \approx (0.003)(1.0) + (0.998)(0.000998) + (0.002)(-0.000998) \approx 0.003 + 0.000996 - 0.000002 = 0.003994$$
   $$\mathbf{u}_1 = \mathbf{c}_1 - (\mathbf{c}_1 \cdot \mathbf{q}_0)\mathbf{q}_0 = \begin{bmatrix} 0.003 \\ 0.998 \\ 0.002 \end{bmatrix} - 0.003994 \begin{bmatrix} 1.0 \\ 0.001 \\ -0.001 \end{bmatrix} \approx \begin{bmatrix} -0.000994 \\ 0.997996 \\ 0.002004 \end{bmatrix}$$
3. Re-normalize $\mathbf{u}_1$:
   $$\|\mathbf{u}_1\| \approx \sqrt{(-0.001)^2 + (0.998)^2 + (0.002)^2} \approx 0.998$$
   $$\mathbf{q}_1 = \frac{\mathbf{u}_1}{\|\mathbf{u}_1\|} \approx \begin{bmatrix} -0.000996 \\ 0.999998 \\ 0.002008 \end{bmatrix}$$
Now $\mathbf{q}_0$ and $\mathbf{q}_1$ are unit length and strictly orthogonal ($\mathbf{q}_0 \cdot \mathbf{q}_1 = 0$).

---

### Section 5.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 5.1
**Problem:** Find the scalar projection of $\mathbf{a} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}$ onto $\mathbf{b} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.
**Solution:**
$$\mathbf{a} \cdot \mathbf{b} = (2)(1) + (-1)(1) + (4)(1) = 2 - 1 + 4 = 5$$
$$\|\mathbf{b}\| = \sqrt{1^2 + 1^2 + 1^2} = \sqrt{3}$$
$$\text{comp}_{\mathbf{b}}(\mathbf{a}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|} = \frac{5}{\sqrt{3}} = \frac{5\sqrt{3}}{3} \approx 2.88675$$

---

#### Exercise 5.2
**Problem:** Find the vector projection of $\mathbf{u} = \begin{bmatrix} 5 \\ 0 \\ -2 \end{bmatrix}$ onto $\mathbf{v} = \begin{bmatrix} 2 \\ 3 \\ 6 \end{bmatrix}$.
**Solution:**
$$\mathbf{u} \cdot \mathbf{v} = (5)(2) + (0)(3) + (-2)(6) = 10 + 0 - 12 = -2$$
$$\mathbf{v} \cdot \mathbf{v} = 2^2 + 3^2 + 6^2 = 4 + 9 + 36 = 49$$
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v} = -\frac{2}{49} \begin{bmatrix} 2 \\ 3 \\ 6 \end{bmatrix} = \begin{bmatrix} -4/49 \\ -6/49 \\ -12/49 \end{bmatrix}$$

---

#### Exercise 5.3
**Problem:** If $\text{proj}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u}$, what can you deduce about the geometric relationship between $\mathbf{u}$ and $\mathbf{v}$?
**Solution:**
By definition, $\mathbf{u} = \mathbf{u}_{\parallel} + \mathbf{u}_{\perp}$.
If $\text{proj}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u}_{\parallel} = \mathbf{u}$, then:
$$\mathbf{u}_{\perp} = \mathbf{u} - \mathbf{u}_{\parallel} = \mathbf{0}$$
Since $\mathbf{u}_{\parallel} = c \mathbf{v}$ for scalar $c = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}$, it follows that $\mathbf{u} = c \mathbf{v}$.
Therefore, $\mathbf{u}$ and $\mathbf{v}$ are **collinear** (parallel or antiparallel).

---

#### Exercise 5.4
**Problem:** Find the vector rejection of $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$ from $\mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$.
**Solution:**
Here $\mathbf{v} = \mathbf{k}$ is the standard unit vector along the $z$-axis.
$$\mathbf{u} \cdot \mathbf{v} = (1)(0) + (2)(0) + (3)(1) = 3$$
$$\mathbf{v} \cdot \mathbf{v} = 1$$
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = 3 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$$
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} - \text{proj}_{\mathbf{v}}(\mathbf{u}) = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 0 \end{bmatrix}$$
Notice this simply removes the $z$-component, projecting $\mathbf{u}$ onto the $xy$-plane.

---

#### Exercise 5.5
**Problem:** Prove that for any two non-zero vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$, the scalar projection satisfies $\|\text{proj}_{\mathbf{v}}(\mathbf{u})\| = |\text{comp}_{\mathbf{v}}(\mathbf{u})|$.
**Solution:**
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}\right)\mathbf{v}$$
Taking the norm of both sides:
$$\|\text{proj}_{\mathbf{v}}(\mathbf{u})\| = \left|\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}\right| \|\mathbf{v}\| = \frac{|\mathbf{u} \cdot \mathbf{v}|}{\|\mathbf{v}\|^2} \|\mathbf{v}\| = \frac{|\mathbf{u} \cdot \mathbf{v}|}{\|\mathbf{v}\|}$$
Since $\text{comp}_{\mathbf{v}}(\mathbf{u}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|}$, we have:
$$|\text{comp}_{\mathbf{v}}(\mathbf{u})| = \frac{|\mathbf{u} \cdot \mathbf{v}|}{\|\mathbf{v}\|}$$
Thus, $\|\text{proj}_{\mathbf{v}}(\mathbf{u})\| = |\text{comp}_{\mathbf{v}}(\mathbf{u})| \quad \blacksquare$

---

#### Exercise 5.6
**Problem:** Perform the Gram-Schmidt process on the basis:
$$\mathbf{v}_1 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}, \quad \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
**Solution:**
1. Step 1:
   $$\mathbf{u}_1 = \mathbf{v}_1 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}$$
   $$\|\mathbf{u}_1\| = \sqrt{0 + 9 + 16} = 5$$
   $$\mathbf{q}_1 = \begin{bmatrix} 0 \\ 3/5 \\ 4/5 \end{bmatrix}$$
2. Step 2:
   $$\mathbf{v}_2 \cdot \mathbf{q}_1 = (1)(0) + (0)(3/5) + (0)(4/5) = 0$$
   $$\mathbf{u}_2 = \mathbf{v}_2 - 0 \cdot \mathbf{q}_1 = \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   $$\|\mathbf{u}_2\| = 1 \implies \mathbf{q}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
The two vectors were already orthogonal!

---

#### Exercise 5.7
**Problem:** In a physics engine, an incoming photon with velocity $\mathbf{v} = \begin{bmatrix} 3 \\ -4 \\ -5 \end{bmatrix}$ strikes a reflective mirror with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$. Compute the reflected velocity vector.
**Solution:**
Using the reflection formula $\mathbf{v}' = \mathbf{v} - 2(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$:
1. $\mathbf{v} \cdot \hat{\mathbf{n}} = (3)(0) + (-4)(0) + (-5)(1) = -5$
2. $\mathbf{v}' = \begin{bmatrix} 3 \\ -4 \\ -5 \end{bmatrix} - 2(-5) \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ -4 \\ -5 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 10 \end{bmatrix} = \begin{bmatrix} 3 \\ -4 \\ 5 \end{bmatrix}$
The horizontal components ($x, y$) are completely unchanged, while the vertical velocity ($z$) is inverted.

---

#### Exercise 5.8
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 2 \\ 4 \\ 4 \end{bmatrix}$, decompose $\mathbf{u}$ into components parallel and perpendicular to the direction $\mathbf{d} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$.
**Solution:**
$$\mathbf{u}_{\parallel} = (\mathbf{u} \cdot \mathbf{d})\mathbf{d} = (2)(1) \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$$
$$\mathbf{u}_{\perp} = \mathbf{u} - \mathbf{u}_{\parallel} = \begin{bmatrix} 2 \\ 4 \\ 4 \end{bmatrix} - \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 4 \\ 4 \end{bmatrix}$$
Check: $\mathbf{u}_{\parallel} \cdot \mathbf{u}_{\perp} = (2)(0) + (0)(4) + (0)(4) = 0 \quad \checkmark$

---

#### Exercise 5.9
**Problem:** Let $\mathbf{P}_{\text{plane}}$ be a plane through the origin with unit normal $\hat{\mathbf{n}}$. Derive the matrix formula for projecting any vector $\mathbf{x}$ onto this plane.
**Solution:**
Any vector $\mathbf{x}$ can be decomposed as:
$$\mathbf{x} = \mathbf{x}_{\parallel \mathbf{n}} + \mathbf{x}_{\text{plane}}$$
Therefore:
$$\mathbf{x}_{\text{plane}} = \mathbf{x} - \mathbf{x}_{\parallel \mathbf{n}} = \mathbf{x} - (\mathbf{x} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
In matrix notation:
$$\mathbf{x}_{\text{plane}} = \mathbf{I}\mathbf{x} - (\hat{\mathbf{n}}\hat{\mathbf{n}}^T)\mathbf{x} = (\mathbf{I} - \hat{\mathbf{n}}\hat{\mathbf{n}}^T)\mathbf{x}$$
Thus, the plane projection matrix is:
$$\mathbf{P}_{\text{plane}} = \mathbf{I} - \hat{\mathbf{n}}\hat{\mathbf{n}}^T = \begin{bmatrix} 1 - n_x^2 & -n_x n_y & -n_x n_z \\ -n_y n_x & 1 - n_y^2 & -n_y n_z \\ -n_z n_x & -n_z n_y & 1 - n_z^2 \end{bmatrix} \quad \blacksquare$$

---

#### Exercise 5.10
**Problem:** A physics constraint solver must remove any velocity component of a sliding box along the constraint normal $\hat{\mathbf{n}} = \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix}$. If current velocity is $\mathbf{v} = \begin{bmatrix} 10 \\ 0 \\ 5 \end{bmatrix} \text{ m/s}$, calculate the projected velocity that satisfies the constraint.
**Solution:**
$$\mathbf{v}_{\text{constrained}} = \mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
1. Dot product:
   $$\mathbf{v} \cdot \hat{\mathbf{n}} = (10)(0.6) + (0)(0.8) + (5)(0) = 6.0 \text{ m/s}$$
2. Normal velocity:
   $$\mathbf{v}_n = 6.0 \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 3.6 \\ 4.8 \\ 0 \end{bmatrix}$$
3. Constrained tangential velocity:
   $$\mathbf{v}_{\text{constrained}} = \begin{bmatrix} 10 \\ 0 \\ 5 \end{bmatrix} - \begin{bmatrix} 3.6 \\ 4.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 6.4 \\ -4.8 \\ 5.0 \end{bmatrix} \text{ m/s}$$
*Verification:*
$$\mathbf{v}_{\text{constrained}} \cdot \hat{\mathbf{n}} = (6.4)(0.6) + (-4.8)(0.8) + (5.0)(0) = 3.84 - 3.84 + 0 = 0 \quad \checkmark$$
The velocity along the constraint normal has been completely eliminated.
