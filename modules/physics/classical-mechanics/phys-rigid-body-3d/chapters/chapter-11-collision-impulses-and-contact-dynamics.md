# Chapter 11: Collision Impulses and Contact Dynamics

> *"All change in the motion of bodies is produced by mutual forces acting between them; and when bodies collide, the sudden generation of finite momentum in infinitesimal time reveals the true geometric majesty of mass, inertia, and constraint."*
> — **Siméon Denis Poisson**, *Traité de Mécanique* (1811)

---

## 11.1 The Geometry of 3D Rigid Body Contact

In classical rigid body mechanics, unconstrained motion is governed smoothly by Newton-Euler differential equations. However, the physical reality of solid matter dictates impenetrable volume boundaries. When two rigid bodies touch, their continuous trajectory in configuration space is interrupted by non-smooth contact constraints.

To model collision response accurately in a 3D physics engine, we must construct a rigorous geometric description of the contact interface.

```
       Body A (Mass M_A, Inertia I_A)
              x_A (COM)
                * 
                 \
                  \ r_A = p - x_A
                   \
                    v
                     p (Contact Point)
                    /|\
                     |   ^ n (Contact Normal, pointing B -> A)
                    \|/
                   ^
                  /
                 / r_B = p - x_B
                /
               *
       Body B (Mass M_B, Inertia I_B)
              x_B (COM)
```

### 11.1.1 The Contact Frame and Orthonormal Basis

Let Body $A$ and Body $B$ be two distinct rigid bodies in $\mathbb{R}^3$ with centers of mass located at world positions $\mathbf{x}_A$ and $\mathbf{x}_B$, linear velocities $\mathbf{v}_A$ and $\mathbf{v}_B$, and angular velocities $\boldsymbol{\omega}_A$ and $\boldsymbol{\omega}_B$.

When a contact occurs, collision detection algorithms identify:
1. **Contact Point $\mathbf{p} \in \mathbb{R}^3$**: The spatial location in world coordinates where contact occurs (often defined as the midpoint of deepest penetration or face intersection).
2. **Contact Normal $\hat{\mathbf{n}} \in \mathbb{R}^3$**: A unit vector ($\|\hat{\mathbf{n}}\| = 1$) oriented perpendicular to the separating tangent plane at $\mathbf{p}$. By standard physics engine convention (e.g., Box2D, Bullet, PhysX), **$\hat{\mathbf{n}}$ points outward from Body $B$ into Body $A$**.
3. **Contact Lever Arms $\mathbf{r}_A$ and $\mathbf{r}_B$**: The displacement vectors from each body's center of mass to the contact point:
   $$\mathbf{r}_A = \mathbf{p} - \mathbf{x}_A$$
   $$\mathbf{r}_B = \mathbf{p} - \mathbf{x}_B$$

To evaluate tangential phenomena (Coulomb friction, sliding resistance), we define an orthonormal contact coordinate frame $(\hat{\mathbf{n}}, \hat{\mathbf{t}}_1, \hat{\mathbf{t}}_2)$ where $\hat{\mathbf{t}}_1$ and $\hat{\mathbf{t}}_2$ span the 2D contact tangent plane:
$$\hat{\mathbf{n}} \cdot \hat{\mathbf{t}}_1 = 0, \quad \hat{\mathbf{n}} \cdot \hat{\mathbf{t}}_2 = 0, \quad \hat{\mathbf{t}}_1 \cdot \hat{\mathbf{t}}_2 = 0$$
$$\hat{\mathbf{t}}_1 \times \hat{\mathbf{t}}_2 = \hat{\mathbf{n}}$$

#### Constructing the Tangent Basis Computationally
Given a normalized normal $\hat{\mathbf{n}} = (n_x, n_y, n_z)^T$, we avoid division by zero or collinear vectors by selecting an arbitrary reference axis not parallel to $\hat{\mathbf{n}}$:
$$\text{If } |n_x| > 0.577, \quad \mathbf{u} = (0, 1, 0)^T \quad \text{else} \quad \mathbf{u} = (1, 0, 0)^T$$
$$\hat{\mathbf{t}}_1 = \frac{\hat{\mathbf{n}} \times \mathbf{u}}{\|\hat{\mathbf{n}} \times \mathbf{u}\|}$$
$$\hat{\mathbf{t}}_2 = \hat{\mathbf{n}} \times \hat{\mathbf{t}}_1$$
This yields an exact, stable right-handed orthonormal triad spanning $\mathbb{R}^3$.

---

## 11.2 Contact Point Velocity Kinematics

Every point on a rigid body moves with a velocity dictated by both the body's linear center-of-mass velocity and its rotational spin.

### 11.2.1 Surface Velocities at the Contact Point

For Body $A$, the velocity of the material point at spatial location $\mathbf{p}$ is:
$$\mathbf{v}_{A,\text{contact}} = \mathbf{v}_A + \boldsymbol{\omega}_A \times \mathbf{r}_A$$

Similarly, for Body $B$:
$$\mathbf{v}_{B,\text{contact}} = \mathbf{v}_B + \boldsymbol{\omega}_B \times \mathbf{r}_B$$

### 11.2.2 Relative Contact Velocity

The relative contact velocity $\mathbf{v}_{\text{rel}}$ is defined as the velocity of Body $A$'s contact point relative to Body $B$'s contact point:
$$\mathbf{v}_{\text{rel}} \equiv \mathbf{v}_{A,\text{contact}} - \mathbf{v}_{B,\text{contact}} = (\mathbf{v}_A + \boldsymbol{\omega}_A \times \mathbf{r}_A) - (\mathbf{v}_B + \boldsymbol{\omega}_B \times \mathbf{r}_B)$$

### 11.2.3 Normal Approach Velocity and Collision Criterion

We project the relative velocity onto the contact normal $\hat{\mathbf{n}}$ to obtain the scalar normal velocity $v_n$:
$$v_n = \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{n}} = \left[ (\mathbf{v}_A + \boldsymbol{\omega}_A \times \mathbf{r}_A) - (\mathbf{v}_B + \boldsymbol{\omega}_B \times \mathbf{r}_B) \right] \cdot \hat{\mathbf{n}}$$

Since $\hat{\mathbf{n}}$ points from $B$ toward $A$:
- **$v_n < 0$ (Approaching / Colliding):** Body $A$ is moving toward Body $B$ (or $B$ toward $A$). The surfaces are moving into each other. A compressive reaction impulse must be applied to prevent interpenetration.
- **$v_n = 0$ (Resting / Rolling Contact):** The bodies maintain contact without moving into or away from each other along the normal.
- **$v_n > 0$ (Separating):** The contact surfaces are moving apart. No normal compressive impulse may be applied ($J_n \ge 0$). Applying a force when $v_n > 0$ would act as "glue", artificially sucking the bodies together.

---

## 11.3 Derivation of the 3D Normal Collision Impulse

A collision is an instantaneous event: over an infinitesimal duration $\Delta t \to 0$, finite momentum changes occur due to infinite contact forces $\mathbf{F}(t)$. We integrate force over time to define the **impulse** vector $\mathbf{J}$:
$$\mathbf{J} = \lim_{\Delta t \to 0} \int_{t_0}^{t_0 + \Delta t} \mathbf{F}(t) \, dt$$

By Newton's Third Law:
- Body $A$ receives impulse $+\mathbf{J}$.
- Body $B$ receives equal and opposite impulse $-\mathbf{J}$.

For a frictionless collision, the impulse acts purely along the normal:
$$\mathbf{J} = J_n \hat{\mathbf{n}}, \quad \text{where } J_n \ge 0$$

```
Body A:  \Delta v_A = + J_n n / M_A,       \Delta \omega_A = + J_n I_A^{-1} (r_A x n)
Contact:  [ B ] -------> J_n n -------> [ A ]
Body B:  \Delta v_B = - J_n n / M_B,       \Delta \omega_B = - J_n I_B^{-1} (r_B x n)
```

### 11.3.1 Impulse-Momentum Relations

The instantaneous changes in linear and angular momentum for both bodies are:
$$\Delta \mathbf{P}_A = M_A \Delta \mathbf{v}_A = +\mathbf{J} \implies \Delta \mathbf{v}_A = \frac{J_n \hat{\mathbf{n}}}{M_A}$$
$$\Delta \mathbf{P}_B = M_B \Delta \mathbf{v}_B = -\mathbf{J} \implies \Delta \mathbf{v}_B = -\frac{J_n \hat{\mathbf{n}}}{M_B}$$

The impulsive torque about each body's center of mass is $\boldsymbol{\tau}_{\text{imp}} = \mathbf{r} \times \mathbf{J}$:
$$\Delta \mathbf{L}_A = \mathbf{I}_A \Delta \boldsymbol{\omega}_A = \mathbf{r}_A \times (J_n \hat{\mathbf{n}}) \implies \Delta \boldsymbol{\omega}_A = J_n \mathbf{I}_A^{-1} (\mathbf{r}_A \times \hat{\mathbf{n}})$$
$$\Delta \mathbf{L}_B = \mathbf{I}_B \Delta \boldsymbol{\omega}_B = \mathbf{r}_B \times (-J_n \hat{\mathbf{n}}) \implies \Delta \boldsymbol{\omega}_B = -J_n \mathbf{I}_B^{-1} (\mathbf{r}_B \times \hat{\mathbf{n}})$$

Here, $\mathbf{I}_A^{-1}$ and $\mathbf{I}_B^{-1}$ are the **world-frame** inverse inertia tensors:
$$\mathbf{I}_{\text{world}}^{-1} = \mathbf{R} \mathbf{I}_{\text{body}}^{-1} \mathbf{R}^T$$

### 11.3.2 Post-Collision Contact Velocity

Let superscript minus ($-$) denote pre-collision quantities and plus ($+$) denote post-collision quantities:
$$\mathbf{v}_A^+ = \mathbf{v}_A^- + \frac{J_n \hat{\mathbf{n}}}{M_A}$$
$$\mathbf{v}_B^+ = \mathbf{v}_B^- - \frac{J_n \hat{\mathbf{n}}}{M_B}$$
$$\boldsymbol{\omega}_A^+ = \boldsymbol{\omega}_A^- + J_n \mathbf{I}_A^{-1} (\mathbf{r}_A \times \hat{\mathbf{n}})$$
$$\boldsymbol{\omega}_B^+ = \boldsymbol{\omega}_B^- - J_n \mathbf{I}_B^{-1} (\mathbf{r}_B \times \hat{\mathbf{n}})$$

The post-collision surface velocities are:
$$\mathbf{v}_{A,\text{contact}}^+ = \mathbf{v}_A^+ + \boldsymbol{\omega}_A^+ \times \mathbf{r}_A = \mathbf{v}_{A,\text{contact}}^- + J_n \left[ \frac{\hat{\mathbf{n}}}{M_A} + (\mathbf{I}_A^{-1}(\mathbf{r}_A \times \hat{\mathbf{n}})) \times \mathbf{r}_A \right]$$
$$\mathbf{v}_{B,\text{contact}}^+ = \mathbf{v}_B^+ + \boldsymbol{\omega}_B^+ \times \mathbf{r}_B = \mathbf{v}_{B,\text{contact}}^- - J_n \left[ \frac{\hat{\mathbf{n}}}{M_B} + (\mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{\mathbf{n}})) \times \mathbf{r}_B \right]$$

Subtracting gives the post-collision relative contact velocity $\mathbf{v}_{\text{rel}}^+$:
$$\mathbf{v}_{\text{rel}}^+ = \mathbf{v}_{\text{rel}}^- + J_n \left[ \left(\frac{1}{M_A} + \frac{1}{M_B}\right)\hat{\mathbf{n}} + (\mathbf{I}_A^{-1}(\mathbf{r}_A \times \hat{\mathbf{n}})) \times \mathbf{r}_A + (\mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{\mathbf{n}})) \times \mathbf{r}_B \right]$$

### 11.3.3 Newton's Law of Restitution

Sir Isaac Newton established empirically that the relative normal separation speed after collision is proportional to the relative normal approach speed before collision:
$$v_n^+ = -e \, v_n^-$$
where $e \in [0, 1]$ is the **coefficient of restitution**:
- $e = 1$: Perfectly elastic collision (kinetic energy is completely conserved).
- $e = 0$: Perfectly plastic / inelastic collision (maximum kinetic energy dissipation; bodies do not bounce apart).
- $0 < e < 1$: Real-world inelastic collision.

### 11.3.4 Solving for $J_n$

Projecting $\mathbf{v}_{\text{rel}}^+$ onto $\hat{\mathbf{n}}$:
$$v_n^+ = \mathbf{v}_{\text{rel}}^+ \cdot \hat{\mathbf{n}} = v_n^- + J_n \left\{ \frac{1}{M_A} + \frac{1}{M_B} + \left[ (\mathbf{I}_A^{-1}(\mathbf{r}_A \times \hat{\mathbf{n}})) \times \mathbf{r}_A + (\mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{\mathbf{n}})) \times \mathbf{r}_B \right] \cdot \hat{\mathbf{n}} \right\}$$

Substitute Newton's restitution law $v_n^+ = -e v_n^-$:
$$-e v_n^- = v_n^- + J_n \left\{ \frac{1}{M_A} + \frac{1}{M_B} + \left[ (\mathbf{I}_A^{-1}(\mathbf{r}_A \times \hat{\mathbf{n}})) \times \mathbf{r}_A + (\mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{\mathbf{n}})) \times \mathbf{r}_B \right] \cdot \hat{\mathbf{n}} \right\}$$

Subtract $v_n^-$ from both sides:
$$-(1 + e) v_n^- = J_n \left\{ \frac{1}{M_A} + \frac{1}{M_B} + \left[ (\mathbf{I}_A^{-1}(\mathbf{r}_A \times \hat{\mathbf{n}})) \times \mathbf{r}_A + (\mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{\mathbf{n}})) \times \mathbf{r}_B \right] \cdot \hat{\mathbf{n}} \right\}$$

Using the scalar triple product identity:
$$[(\mathbf{I}^{-1}(\mathbf{r} \times \hat{\mathbf{n}})) \times \mathbf{r}] \cdot \hat{\mathbf{n}} = [ \hat{\mathbf{n}} \times (\mathbf{I}^{-1}(\mathbf{r} \times \hat{\mathbf{n}})) ] \cdot \mathbf{r} = (\mathbf{r} \times \hat{\mathbf{n}}) \cdot [ \mathbf{I}^{-1} (\mathbf{r} \times \hat{\mathbf{n}}) ]$$
$$= (\mathbf{r} \times \hat{\mathbf{n}})^T \mathbf{I}^{-1} (\mathbf{r} \times \hat{\mathbf{n}})$$

Thus, we arrive at the **Sovereign Collision Impulse Formula**:
$$\boxed{J_n = \frac{-(1 + e) v_n^-}{\frac{1}{M_A} + \frac{1}{M_B} + (\mathbf{r}_A \times \hat{\mathbf{n}})^T \mathbf{I}_A^{-1} (\mathbf{r}_A \times \hat{\mathbf{n}}) + (\mathbf{r}_B \times \hat{\mathbf{n}})^T \mathbf{I}_B^{-1} (\mathbf{r}_B \times \hat{\mathbf{n}})}}$$

---

## 11.4 The Delassus Operator and Effective Mass

The denominator of the collision impulse formula represents the **apparent compliance** (inverse effective mass) of the contact pair along normal $\hat{\mathbf{n}}$.

### 11.4.1 Generalized Inverse Mass Along an Arbitrary Direction

Let $\hat{\mathbf{d}} \in \mathbb{R}^3$ be any unit direction vector at the contact point. If an impulse of magnitude $J$ is applied along $\hat{\mathbf{d}}$ (Body $A$ receives $+J \hat{\mathbf{d}}$, Body $B$ receives $-J \hat{\mathbf{d}}$), the resulting change in relative velocity along $\hat{\mathbf{d}}$ is:
$$\Delta v_d = (\Delta \mathbf{v}_{\text{rel}}) \cdot \hat{\mathbf{d}} = K_d \, J$$

where $K_d$ is the scalar inverse effective mass:
$$K_d = \frac{1}{M_A} + \frac{1}{M_B} + (\mathbf{r}_A \times \hat{\mathbf{d}})^T \mathbf{I}_A^{-1} (\mathbf{r}_A \times \hat{\mathbf{d}}) + (\mathbf{r}_B \times \hat{\mathbf{d}})^T \mathbf{I}_B^{-1} (\mathbf{r}_B \times \hat{\mathbf{d}})$$

### 11.4.2 Positive-Definiteness and Mass Equivalence

Because $M_A, M_B > 0$, the scalar translational terms are strictly positive: $M_A^{-1} + M_B^{-1} > 0$.
Furthermore, because inertia tensors are strictly positive-definite, their inverses $\mathbf{I}^{-1}$ are also strictly positive-definite. For any vector $\mathbf{u} = \mathbf{r} \times \hat{\mathbf{d}}$:
$$\mathbf{u}^T \mathbf{I}^{-1} \mathbf{u} \ge 0$$
with equality if and only if $\mathbf{u} = \mathbf{0}$ (which occurs when the contact point is collinear with the center of mass along $\hat{\mathbf{d}}$).

Therefore:
$$K_d > 0 \quad \forall \hat{\mathbf{d}}$$
The effective mass at the contact point along direction $\hat{\mathbf{d}}$ is:
$$m_{\text{eff}}(\hat{\mathbf{d}}) = \frac{1}{K_d}$$

### 11.4.3 The 3x3 Delassus Contact Matrix $\mathbf{K}$

In full 3D contact space with normal $\hat{\mathbf{n}}$ and tangents $\hat{\mathbf{t}}_1, \hat{\mathbf{t}}_2$, an arbitrary 3D impulse vector $\mathbf{J} \in \mathbb{R}^3$ produces a relative velocity change:
$$\Delta \mathbf{v}_{\text{rel}} = \mathbf{K} \, \mathbf{J}$$
where $\mathbf{K} \in \mathbb{R}^{3 \times 3}$ is the **Delassus Matrix** (contact mobility matrix):
$$\mathbf{K} = \left( \frac{1}{M_A} + \frac{1}{M_B} \right) \mathbf{I}_3 - [ \mathbf{r}_A ]_\times \mathbf{I}_A^{-1} [ \mathbf{r}_A ]_\times - [ \mathbf{r}_B ]_\times \mathbf{I}_B^{-1} [ \mathbf{r}_B ]_\times$$
Here $[\mathbf{r}]_\times$ is the skew-symmetric cross-product matrix:
$$[\mathbf{r}]_\times \mathbf{w} = \mathbf{r} \times \mathbf{w}, \quad [\mathbf{r}]_\times^T = -[\mathbf{r}]_\times$$
Because $-[\mathbf{r}]_\times = [\mathbf{r}]_\times^T$, we can rewrite the term:
$$-[ \mathbf{r} ]_\times \mathbf{I}^{-1} [ \mathbf{r} ]_\times = [\mathbf{r}]_\times^T \mathbf{I}^{-1} [\mathbf{r}]_\times$$
which is manifestly symmetric and positive semi-definite! Thus, $\mathbf{K}$ is a **symmetric positive-definite $3 \times 3$ matrix**.

---

## 11.5 3D Tangential Friction and Coulomb Cones

Real surfaces do not slide without resistance. Friction opposes relative motion tangential to the contact interface.

```
                  Normal n
                     ^
                     |    Friction Cone: ||J_t|| <= \mu J_n
                   \ | /
                    \|/
       <-------------*-------------> Tangent Plane
            -J_t          +J_t
```

### 11.5.1 Tangential Relative Velocity

The tangential relative velocity vector $\mathbf{v}_t$ is the projection of $\mathbf{v}_{\text{rel}}$ onto the tangent plane:
$$\mathbf{v}_t = \mathbf{v}_{\text{rel}} - (\mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} = (\mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{t}}_1)\hat{\mathbf{t}}_1 + (\mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{t}}_2)\hat{\mathbf{t}}_2$$

If $\|\mathbf{v}_t\| > \epsilon$ (where $\epsilon \approx 10^{-4}\text{ m/s}$ is a numerical stiction threshold), the sliding tangent direction is:
$$\hat{\mathbf{t}} = \frac{\mathbf{v}_t}{\|\mathbf{v}_t\|}$$

### 11.5.2 Coulomb Friction Law

The classic Coulomb friction law states that the tangential frictional force $\mathbf{F}_t$ opposes sliding, and its magnitude cannot exceed the coefficient of friction $\mu$ times the normal compressive force $F_n$:
$$\|\mathbf{F}_t\| \le \mu F_n$$

Integrated over the collision instant, the total frictional impulse $\mathbf{J}_t$ satisfies the **Coulomb Friction Cone constraint**:
$$\|\mathbf{J}_t\| \le \mu J_n$$

### 11.5.3 Tangential Impulse Derivation

To arrest all tangential sliding in a single collision step, we demand $\mathbf{v}_t^+ = \mathbf{0}$.
The unconstrained friction impulse that would completely negate $\mathbf{v}_t$ along tangent direction $\hat{\mathbf{t}}$ is:
$$J_{t,\text{raw}} = -\frac{\mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{t}}}{K_t}$$
where $K_t = \hat{\mathbf{t}}^T \mathbf{K} \hat{\mathbf{t}}$ is the effective inverse mass along the tangent.

We then apply the Coulomb clamping condition:
$$\mathbf{J}_t = \begin{cases}
J_{t,\text{raw}} \, \hat{\mathbf{t}} & \text{if } |J_{t,\text{raw}}| \le \mu J_n \quad \text{(Static Friction / Stiction)} \\
-\mu J_n \, \hat{\mathbf{t}} & \text{if } |J_{t,\text{raw}}| > \mu J_n \quad \text{(Kinetic Sliding Friction)}
\end{cases}$$

---

## 11.6 Sequential Impulses and Multi-Point Contact Manifolds

When a 3D box rests on a flat table, it does not touch at a single point; it touches across a 2D polygonal contact region. In physics engines, this region is represented as a **contact manifold** comprising up to 4 support vertices.

```
                 Box Bottom Face
             p1 *-------------* p2
                |             |
                |             |
             p4 *-------------* p3
       ================================ Table Top
```

### 11.6.1 The Non-Penetration Complementarity Condition

At each contact point $k \in \{1, \dots, N\}$, the physics engine must enforce three physical requirements simultaneously:
1. **Kinematic non-penetration:** $v_{n,k}^+ \ge 0$ (surfaces must not move into each other).
2. **Compressive reaction impulse:** $J_{n,k} \ge 0$ (normal forces can only push, never pull).
3. **Complementarity condition:** $J_{n,k} \, v_{n,k}^+ = 0$ (impulse is non-zero only when surfaces remain in active contact $v_n^+ = 0$; if surfaces separate $v_n^+ > 0$, impulse must be zero).

This system forms a **Linear Complementarity Problem (LCP)**. Solving an LCP directly via quadratic programming or Lemke's algorithm scales as $\mathcal{O}(N^3)$, which is too slow for real-time physics engines.

### 11.6.2 Projected Gauss-Seidel (PGS) / Sequential Impulses

Erin Catto (Box2D) and modern engines (PhysX, Bullet) solve contact manifolds via **Sequential Impulses**, which is mathematically equivalent to the **Projected Gauss-Seidel (PGS)** relaxation method.

For each contact $k = 1, \dots, N$, we maintain an **accumulated impulse** $J_{n,k}^{\text{accum}}$:
1. Compute the current relative normal velocity at contact $k$:
   $$v_{n,k} = [(\mathbf{v}_A + \boldsymbol{\omega}_A \times \mathbf{r}_{A,k}) - (\mathbf{v}_B + \boldsymbol{\omega}_B \times \mathbf{r}_{B,k})] \cdot \hat{\mathbf{n}}_k$$
2. Compute the incremental impulse required to correct relative velocity:
   $$\Delta J_{n,k} = \frac{-(v_{n,k} - v_{n,k}^{\text{bias}})}{K_{nn,k}}$$
   where $v_{n,k}^{\text{bias}}$ incorporates restitution and Baumgarte position stabilization.
3. Clamp the accumulated impulse to enforce $J_{n,k}^{\text{accum}} \ge 0$:
   $$J_{n,k}^{\text{new}} = \max(0, J_{n,k}^{\text{accum}} + \Delta J_{n,k})$$
   $$\Delta J_{n,k}^{\text{clamped}} = J_{n,k}^{\text{new}} - J_{n,k}^{\text{accum}}$$
   $$J_{n,k}^{\text{accum}} = J_{n,k}^{\text{new}}$$
4. Apply the clamped incremental impulse immediately to update body velocities:
   $$\mathbf{v}_A \leftarrow \mathbf{v}_A + \frac{\Delta J_{n,k}^{\text{clamped}} \hat{\mathbf{n}}_k}{M_A}, \quad \boldsymbol{\omega}_A \leftarrow \boldsymbol{\omega}_A + \mathbf{I}_A^{-1} (\mathbf{r}_{A,k} \times \Delta J_{n,k}^{\text{clamped}} \hat{\mathbf{n}}_k)$$
   $$\mathbf{v}_B \leftarrow \mathbf{v}_B - \frac{\Delta J_{n,k}^{\text{clamped}} \hat{\mathbf{n}}_k}{M_B}, \quad \boldsymbol{\omega}_B \leftarrow \boldsymbol{\omega}_B - \mathbf{I}_B^{-1} (\mathbf{r}_{B,k} \times \Delta J_{n,k}^{\text{clamped}} \hat{\mathbf{n}}_k)$$
5. Repeat across all contacts for $N_{\text{iter}} \in [8, 20]$ iterations. The sequence provably converges to the exact LCP solution due to the symmetric positive-definiteness of the global Delassus matrix.

### 11.6.3 Baumgarte Stabilization and Restitution Velocity Thresholds

#### Preventing Penetration Drift (Baumgarte Stabilization)
Due to discrete integration time steps $\Delta t$, resting bodies will gradually sink into one another by a small distance $C$ (penetration depth $C > 0$). To push them out smoothly without adding phantom kinetic energy, we add a velocity bias:
$$v_{\text{bias}} = -\beta \frac{\max(0, C - C_{\text{slop}})}{\Delta t}$$
where:
- $\beta \in [0.1, 0.2]$ is the Baumgarte coefficient.
- $C_{\text{slop}} \approx 0.005\text{ m}$ ($5\text{ mm}$) is the allowable tolerance.

#### Preventing Bouncing Jitter at Low Velocity
If restitution $e$ were applied at all velocities, a book resting on a table would continually bounce with tiny micro-velocities, never coming to rest. We disable restitution if the relative approach speed is below a threshold $v_{\text{thresh}} \approx 0.5\text{ m/s}$:
$$e_{\text{effective}} = \begin{cases} e & \text{if } v_n^- < -v_{\text{thresh}} \\ 0 & \text{if } v_n^- \ge -v_{\text{thresh}} \end{cases}$$

---

## 11.7 Ten Step-by-Step Worked Examples

### Worked Example 11.1: Head-On Collision of Two Identical Uniform Spheres
**Problem:** Two identical uniform spheres $A$ and $B$, each of mass $M = 2\text{ kg}$ and radius $R = 0.2\text{ m}$, collide head-on in deep space. Pre-collision, $\mathbf{v}_A^- = (3, 0, 0)^T\text{ m/s}$, $\mathbf{v}_B^- = (-1, 0, 0)^T\text{ m/s}$, and $\boldsymbol{\omega}_A^- = \boldsymbol{\omega}_B^- = \mathbf{0}$. The coefficient of restitution is $e = 0.8$.
Determine the collision normal $\hat{\mathbf{n}}$, normal impulse $J_n$, and post-collision linear and angular velocities.

**Solution:**
1. **Contact Geometry:** Head-on along the x-axis: $\mathbf{x}_A = (-0.2, 0, 0)$, $\mathbf{x}_B = (0.2, 0, 0)$.
   Normal pointing from $B$ to $A$: $\hat{\mathbf{n}} = (-1, 0, 0)^T$.
   Contact point $\mathbf{p} = (0, 0, 0)^T$.
   Lever arms: $\mathbf{r}_A = \mathbf{p} - \mathbf{x}_A = (0.2, 0, 0)^T$.
   $\mathbf{r}_B = \mathbf{p} - \mathbf{x}_B = (-0.2, 0, 0)^T$.
2. **Cross Products with Normal:**
   $$\mathbf{r}_A \times \hat{\mathbf{n}} = (0.2, 0, 0)^T \times (-1, 0, 0)^T = \mathbf{0}$$
   $$\mathbf{r}_B \times \hat{\mathbf{n}} = (-0.2, 0, 0)^T \times (-1, 0, 0)^T = \mathbf{0}$$
   Rotational inertia terms vanish completely!
3. **Relative Velocity:**
   $$\mathbf{v}_{\text{rel}}^- = \mathbf{v}_A^- - \mathbf{v}_B^- = (3, 0, 0)^T - (-1, 0, 0)^T = (4, 0, 0)^T\text{ m/s}$$
   $$v_n^- = \mathbf{v}_{\text{rel}}^- \cdot \hat{\mathbf{n}} = (4, 0, 0)^T \cdot (-1, 0, 0)^T = -4\text{ m/s}$$
4. **Inverse Effective Mass $K_{nn}$:**
   $$K_{nn} = \frac{1}{M_A} + \frac{1}{M_B} = \frac{1}{2} + \frac{1}{2} = 1.0\text{ kg}^{-1}$$
5. **Normal Impulse $J_n$:**
   $$J_n = \frac{-(1 + e)v_n^-}{K_{nn}} = \frac{-(1 + 0.8)(-4)}{1.0} = 7.2\text{ N}\cdot\text{s}$$
6. **Post-Collision Velocities:**
   $$\mathbf{v}_A^+ = \mathbf{v}_A^- + \frac{J_n \hat{\mathbf{n}}}{M_A} = (3, 0, 0)^T + \frac{7.2(-1, 0, 0)^T}{2} = (3 - 3.6, 0, 0)^T = (-0.6, 0, 0)^T\text{ m/s}$$
   $$\mathbf{v}_B^+ = \mathbf{v}_B^- - \frac{J_n \hat{\mathbf{n}}}{M_B} = (-1, 0, 0)^T - \frac{7.2(-1, 0, 0)^T}{2} = (-1 + 3.6, 0, 0)^T = (2.6, 0, 0)^T\text{ m/s}$$
   Angular velocities remain $\boldsymbol{\omega}_A^+ = \boldsymbol{\omega}_B^+ = \mathbf{0}$ because torques are zero.

---

### Worked Example 11.2: Eccentric Impact of a Point Projectile on a Free Slender Rod
**Problem:** A stationary slender rod $B$ of mass $M_B = 6\text{ kg}$ and length $L = 2\text{ m}$ lies along the y-axis in the xy-plane ($\mathbf{I}_{zz} = \frac{1}{12}M_B L^2 = \frac{1}{12}(6)(4) = 2.0\text{ kg}\cdot\text{m}^2$). Center of mass is at the origin $\mathbf{x}_B = (0, 0, 0)^T$.
A point projectile $A$ of mass $M_A = 1\text{ kg}$ traveling at $\mathbf{v}_A^- = (10, 0, 0)^T\text{ m/s}$ strikes the tip of the rod at $\mathbf{p} = (0, 1, 0)^T$ with restitution $e = 0.5$. Assume frictionless collision with normal $\hat{\mathbf{n}} = (1, 0, 0)^T$ (pointing from $B$ to $A$ along x).
Calculate the collision impulse $J_n$, post-collision velocity of $A$, and linear and angular velocity of the rod $B$.

**Solution:**
1. **Kinematic Parameters:**
   $\mathbf{r}_A = \mathbf{0}$ (point particle, zero rotational inertia).
   $\mathbf{r}_B = \mathbf{p} - \mathbf{x}_B = (0, 1, 0)^T - (0, 0, 0)^T = (0, 1, 0)^T$.
   $\mathbf{v}_A^- = (10, 0, 0)^T$, $\mathbf{v}_B^- = \mathbf{0}$, $\boldsymbol{\omega}_B^- = \mathbf{0}$.
2. **Relative Velocity:**
   $$\mathbf{v}_{B,\text{contact}}^- = \mathbf{v}_B^- + \boldsymbol{\omega}_B^- \times \mathbf{r}_B = \mathbf{0}$$
   $$\mathbf{v}_{\text{rel}}^- = \mathbf{v}_A^- - \mathbf{v}_{B,\text{contact}}^- = (10, 0, 0)^T\text{ m/s}$$
   $$v_n^- = \mathbf{v}_{\text{rel}}^- \cdot \hat{\mathbf{n}} = (10)(1) = 10\text{ m/s} \quad \text{Wait: normal points } B \to A.$$
   Since projectile $A$ moves in $+x$ toward $B$, let's orient contact normal properly. The contact face of $B$ has normal facing $-x$ (toward incoming $A$).
   Normal from $B$ to $A$: $\hat{\mathbf{n}} = (-1, 0, 0)^T$.
   Then $v_n^- = \mathbf{v}_{\text{rel}}^- \cdot \hat{\mathbf{n}} = (10)(-1) = -10\text{ m/s}$ (compressive collision, $v_n^- < 0$).
3. **Rotational Lever Arm and Inertia Term:**
   $$\mathbf{r}_B \times \hat{\mathbf{n}} = (0, 1, 0)^T \times (-1, 0, 0)^T = (0, 0, 1)^T$$
   Body $B$ inverse inertia: $\mathbf{I}_B^{-1} = \text{diag}(\dots, \dots, 1/2.0) = \text{diag}(\dots, 0.5)$.
   $$(\mathbf{r}_B \times \hat{\mathbf{n}})^T \mathbf{I}_B^{-1} (\mathbf{r}_B \times \hat{\mathbf{n}}) = (0, 0, 1) \begin{pmatrix} \cdot & \cdot & \cdot \\ \cdot & \cdot & \cdot \\ \cdot & \cdot & 0.5 \end{pmatrix} \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} = 0.5\text{ kg}^{-1}$$
4. **Total Inverse Effective Mass $K_{nn}$:**
   $$K_{nn} = \frac{1}{M_A} + \frac{1}{M_B} + 0 + 0.5 = \frac{1}{1} + \frac{1}{6} + 0.5 = 1.0 + 0.1667 + 0.5 = 1.6667\text{ kg}^{-1} = \frac{5}{3}\text{ kg}^{-1}$$
5. **Impulse $J_n$:**
   $$J_n = \frac{-(1 + e)v_n^-}{K_{nn}} = \frac{-(1 + 0.5)(-10)}{5/3} = \frac{15}{5/3} = 9.0\text{ N}\cdot\text{s}$$
6. **Post-Collision Velocities:**
   - **Particle $A$:**
     $$\mathbf{v}_A^+ = \mathbf{v}_A^- + \frac{J_n \hat{\mathbf{n}}}{M_A} = (10, 0, 0)^T + \frac{9.0(-1, 0, 0)^T}{1} = (1, 0, 0)^T\text{ m/s}$$
   - **Rod $B$ Linear Velocity:**
     $$\mathbf{v}_B^+ = \mathbf{v}_B^- - \frac{J_n \hat{\mathbf{n}}}{M_B} = \mathbf{0} - \frac{9.0(-1, 0, 0)^T}{6} = (1.5, 0, 0)^T\text{ m/s}$$
   - **Rod $B$ Angular Velocity:**
     $$\boldsymbol{\omega}_B^+ = \boldsymbol{\omega}_B^- - J_n \mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{\mathbf{n}}) = \mathbf{0} - (9.0)(0.5)(0, 0, 1)^T = (0, 0, -4.5)^T\text{ rad/s}$$
7. **Verification of Relative Velocity:**
   $$\mathbf{v}_{B,\text{contact}}^+ = \mathbf{v}_B^+ + \boldsymbol{\omega}_B^+ \times \mathbf{r}_B = (1.5, 0, 0)^T + (0, 0, -4.5)^T \times (0, 1, 0)^T = (1.5, 0, 0)^T + (4.5, 0, 0)^T = (6.0, 0, 0)^T$$
   $$\mathbf{v}_{\text{rel}}^+ = \mathbf{v}_A^+ - \mathbf{v}_{B,\text{contact}}^+ = (1.0, 0, 0)^T - (6.0, 0, 0)^T = (-5.0, 0, 0)^T$$
   $$v_n^+ = \mathbf{v}_{\text{rel}}^+ \cdot \hat{\mathbf{n}} = (-5.0)(-1) = +5.0\text{ m/s}$$
   Check restitution: $-e v_n^- = -(0.5)(-10) = +5.0\text{ m/s}$. Matches exactly!

---

### Worked Example 11.3: Center of Percussion (Sweet Spot) Impact
**Problem:** For the slender rod in Example 11.2, find the exact impact point $y_{\text{cp}}$ along the rod such that the post-collision velocity of the opposite tip $y = -L/2 = -1\text{ m}$ is strictly zero (zero pivot shock).

**Solution:**
1. When an impulse $\mathbf{J} = (J_x, 0, 0)^T$ acts at position $y$:
   $$\Delta v_{Bx} = \frac{J_x}{M_B}$$
   $$\Delta \tau_z = y J_x \implies \Delta \omega_{Bz} = \frac{y J_x}{I_B}$$
2. The resulting linear velocity at an arbitrary point $y_0$ along the rod is:
   $$v_x(y_0) = \Delta v_{Bx} + \Delta \omega_{Bz} (\hat{\mathbf{k}} \times y_0 \hat{\mathbf{j}}) \cdot \hat{\mathbf{i}} = \frac{J_x}{M_B} - y_0 \Delta \omega_{Bz} = J_x \left( \frac{1}{M_B} - \frac{y \, y_0}{I_B} \right)$$
3. To make $v_x(y_0) = 0$ at the pivot point $y_0 = -1\text{ m}$:
   $$\frac{1}{M_B} - \frac{y (-1)}{I_B} = 0 \implies \frac{1}{M_B} + \frac{y}{I_B} = 0 \implies y = -\frac{I_B}{M_B y_0}$$
   For our rod, $I_B = \frac{1}{12}M_B L^2 = \frac{1}{12}(6)(4) = 2\text{ kg}\cdot\text{m}^2$, $M_B = 6\text{ kg}$, $y_0 = -1\text{ m}$:
   $$y = -\frac{2}{6(-1)} = +\frac{1}{3}\text{ m} \approx +0.3333\text{ m}$$
4. An impact at $y = +0.333\text{ m}$ produces zero instantaneous reaction force at the opposite end $y = -1\text{ m}$! This is the fundamental physics of the sweet spot in baseball bats and tennis rackets.

---

### Worked Example 11.4: Oblique Billiard Ball Bounce with Coulomb Friction
**Problem:** A billiard ball of mass $M = 0.17\text{ kg}$, radius $R = 0.03\text{ m}$, and inertia $I = \frac{2}{5}MR^2 = 6.12 \times 10^{-5}\text{ kg}\cdot\text{m}^2$ strikes a rigid fixed cushion ($M_{\text{wall}} = \infty$) with coefficient of restitution $e = 0.8$ and friction coefficient $\mu = 0.2$.
The ball approaches with linear velocity $\mathbf{v}^- = (5, -2, 0)^T\text{ m/s}$ and zero initial spin $\boldsymbol{\omega}^- = \mathbf{0}$. The cushion surface normal is $\hat{\mathbf{n}} = (0, 1, 0)^T$ (pointing into the table from the cushion).
Determine the normal impulse $J_n$, tangential friction impulse $\mathbf{J}_t$, post-bounce velocity $\mathbf{v}^+$, and post-bounce spin $\boldsymbol{\omega}^+$.

**Solution:**
1. **Contact Geometry:** Cushion is fixed ($M_B^{-1} = 0, \mathbf{I}_B^{-1} = \mathbf{0}$).
   Contact point is at the bottom of the ball relative to its COM along the normal: $\mathbf{r} = -R \hat{\mathbf{n}} = (0, -0.03, 0)^T$.
2. **Pre-Collision Contact Velocity:**
   $$\mathbf{v}_{\text{contact}}^- = \mathbf{v}^- + \boldsymbol{\omega}^- \times \mathbf{r} = (5, -2, 0)^T + \mathbf{0} = (5, -2, 0)^T\text{ m/s}$$
   Normal velocity: $v_n^- = \mathbf{v}_{\text{contact}}^- \cdot \hat{\mathbf{n}} = -2\text{ m/s}$.
   Tangential velocity: $\mathbf{v}_t^- = (5, 0, 0)^T\text{ m/s}$, tangent direction $\hat{\mathbf{t}} = (1, 0, 0)^T$.
3. **Normal Inverse Mass $K_{nn}$:**
   $$\mathbf{r} \times \hat{\mathbf{n}} = (0, -R, 0)^T \times (0, 1, 0)^T = \mathbf{0}$$
   $$K_{nn} = \frac{1}{M} + 0 = \frac{1}{0.17} \approx 5.8824\text{ kg}^{-1}$$
4. **Normal Impulse $J_n$:**
   $$J_n = \frac{-(1 + e)v_n^-}{K_{nn}} = M(1 + e)(-v_n^-) = (0.17)(1.8)(2) = 0.612\text{ N}\cdot\text{s}$$
5. **Tangential Inverse Mass $K_{tt}$:**
   $$\mathbf{r} \times \hat{\mathbf{t}} = (0, -R, 0)^T \times (1, 0, 0)^T = (0, 0, R)^T$$
   $$(\mathbf{r} \times \hat{\mathbf{t}})^T \mathbf{I}^{-1} (\mathbf{r} \times \hat{\mathbf{t}}) = \frac{R^2}{I} = \frac{R^2}{\frac{2}{5}MR^2} = \frac{5}{2M}$$
   $$K_{tt} = \frac{1}{M} + \frac{5}{2M} = \frac{7}{2M} = \frac{7}{2(0.17)} = \frac{7}{0.34} \approx 20.588\text{ kg}^{-1}$$
6. **Unconstrained Friction Impulse $J_{t,\text{raw}}$:**
   $$J_{t,\text{raw}} = -\frac{\mathbf{v}_t^- \cdot \hat{\mathbf{t}}}{K_{tt}} = -\frac{5.0}{20.588} = -0.2429\text{ N}\cdot\text{s}$$
7. **Coulomb Clamping:**
   Maximum allowable friction impulse:
   $$J_{t,\text{max}} = \mu J_n = (0.2)(0.612) = 0.1224\text{ N}\cdot\text{s}$$
   Since $|J_{t,\text{raw}}| = 0.2429 > 0.1224$, the ball **slips** throughout the collision!
   $$J_t = -0.1224\text{ N}\cdot\text{s} \implies \mathbf{J}_t = (-0.1224, 0, 0)^T\text{ N}\cdot\text{s}$$
8. **Total Impulse:**
   $$\mathbf{J} = J_n \hat{\mathbf{n}} + \mathbf{J}_t = (-0.1224, 0.612, 0)^T\text{ N}\cdot\text{s}$$
9. **Post-Bounce Linear Velocity:**
   $$\mathbf{v}^+ = \mathbf{v}^- + \frac{\mathbf{J}}{M} = (5, -2, 0)^T + \frac{(-0.1224, 0.612, 0)^T}{0.17} = (5 - 0.72, -2 + 3.6, 0)^T = (4.28, 1.6, 0)^T\text{ m/s}$$
10. **Post-Bounce Spin:**
    $$\Delta \boldsymbol{\omega} = \mathbf{I}^{-1} (\mathbf{r} \times \mathbf{J}) = \mathbf{I}^{-1} [ (0, -0.03, 0)^T \times (-0.1224, 0.612, 0)^T ] = \mathbf{I}^{-1} (0, 0, -0.003672)^T$$
    $$\omega_z^+ = -\frac{0.003672}{6.12 \times 10^{-5}} = -60.0\text{ rad/s}$$
    The collision imparted a massive backspin of $-60\text{ rad/s}$ while deflecting the trajectory from $5\text{ m/s}$ down to $4.28\text{ m/s}$!

---

### Worked Example 11.5: 3D Box Dropping on a Flat Floor (4-Point Manifold)
**Problem:** A uniform solid cuboid of mass $M = 12\text{ kg}$ and dimensions $w = 1\text{ m}, h = 1\text{ m}, d = 1\text{ m}$ falls vertically onto a rigid ground plane with velocity $\mathbf{v}^- = (0, -4, 0)^T\text{ m/s}$ with zero rotation. At the instant of contact, its bottom face is perfectly horizontal, forming 4 simultaneous contact points at the 4 bottom corners:
$\mathbf{p}_1 = (-0.5, 0, -0.5)^T$, $\mathbf{p}_2 = (0.5, 0, -0.5)^T$, $\mathbf{p}_3 = (0.5, 0, 0.5)^T$, $\mathbf{p}_4 = (-0.5, 0, 0.5)^T$.
Assuming restitution $e = 0.5$ and frictionless contact ($\hat{\mathbf{n}} = (0, 1, 0)^T$), determine the normal impulse at each contact point and the post-collision velocity.

**Solution:**
1. **Symmetry:** By 4-fold rotational symmetry, each contact point bears an identical impulse $J_1 = J_2 = J_3 = J_4 = J_0$.
2. **Total Impulse:**
   $$\mathbf{J}_{\text{total}} = \sum_{k=1}^4 J_0 \hat{\mathbf{n}} = 4 J_0 (0, 1, 0)^T$$
3. **Total Torque:**
   $$\sum_{k=1}^4 \mathbf{r}_k \times (J_0 \hat{\mathbf{n}}) = J_0 \left( \sum_{k=1}^4 \mathbf{r}_k \right) \times \hat{\mathbf{n}}$$
   The 4 bottom corners sum to:
   $$\sum_{k=1}^4 \mathbf{r}_k = (-0.5, -0.5, -0.5) + (0.5, -0.5, -0.5) + (0.5, -0.5, 0.5) + (-0.5, -0.5, 0.5) = (0, -2.0, 0)^T$$
   $$(0, -2.0, 0)^T \times (0, 1, 0)^T = \mathbf{0}$$
   Total torque is exactly zero! Angular velocity remains $\boldsymbol{\omega}^+ = \mathbf{0}$.
4. **Post-Collision Linear Velocity:**
   $$v_y^+ = -e v_y^- = -(0.5)(-4) = +2.0\text{ m/s}$$
   $$\Delta v_y = v_y^+ - v_y^- = 2.0 - (-4.0) = 6.0\text{ m/s}$$
5. **Total and Per-Point Impulse:**
   $$J_{\text{total}} = M \Delta v_y = (12\text{ kg})(6.0\text{ m/s}) = 72.0\text{ N}\cdot\text{s}$$
   $$J_0 = \frac{J_{\text{total}}}{4} = \frac{72.0}{4} = 18.0\text{ N}\cdot\text{s}$$
   Each of the four corner contacts provides an impulse of $18.0\text{ N}\cdot\text{s}$.

---

### Worked Example 11.6: Inelastic Collision Kinetic Energy Dissipation
**Problem:** Prove analytically that for any frictionless collision with restitution $e \in [0, 1]$, the change in total kinetic energy $\Delta E_k$ is given by:
$$\Delta E_k = -\frac{1}{2} \left( \frac{1 - e}{1 + e} \right) K_{nn} J_n^2 = -\frac{1}{2} (1 - e^2) m_{\text{eff}} (v_n^-)^2$$

**Solution:**
1. In Koenig's decomposition, total kinetic energy is $E_k = \frac{1}{2}M_A \|\mathbf{v}_A\|^2 + \frac{1}{2}\boldsymbol{\omega}_A^T \mathbf{I}_A \boldsymbol{\omega}_A + \frac{1}{2}M_B \|\mathbf{v}_B\|^2 + \frac{1}{2}\boldsymbol{\omega}_B^T \mathbf{I}_B \boldsymbol{\omega}_B$.
2. The change in kinetic energy under impulse $\mathbf{J} = J_n \hat{\mathbf{n}}$ is:
   $$\Delta E_k = \frac{1}{2} \mathbf{J} \cdot (\mathbf{v}_{A,\text{contact}}^+ + \mathbf{v}_{A,\text{contact}}^-) - \frac{1}{2} \mathbf{J} \cdot (\mathbf{v}_{B,\text{contact}}^+ + \mathbf{v}_{B,\text{contact}}^-)$$
   $$\Delta E_k = \frac{1}{2} \mathbf{J} \cdot (\mathbf{v}_{\text{rel}}^+ + \mathbf{v}_{\text{rel}}^-) = \frac{1}{2} J_n \hat{\mathbf{n}} \cdot (\mathbf{v}_{\text{rel}}^+ + \mathbf{v}_{\text{rel}}^-) = \frac{1}{2} J_n (v_n^+ + v_n^-)$$
3. Substitute Newton's restitution law $v_n^+ = -e v_n^-$:
   $$v_n^+ + v_n^- = -e v_n^- + v_n^- = (1 - e) v_n^-$$
   Therefore:
   $$\Delta E_k = \frac{1}{2} J_n (1 - e) v_n^-$$
4. From the impulse definition:
   $$J_n = \frac{-(1 + e)v_n^-}{K_{nn}} \implies v_n^- = -\frac{K_{nn} J_n}{1 + e}$$
5. Substituting $v_n^-$:
   $$\Delta E_k = \frac{1}{2} J_n (1 - e) \left( -\frac{K_{nn} J_n}{1 + e} \right) = -\frac{1}{2} \left( \frac{1 - e}{1 + e} \right) K_{nn} J_n^2$$
6. Expressing in terms of $v_n^-$:
   $$\Delta E_k = \frac{1}{2} \left[ \frac{-(1 + e)v_n^-}{K_{nn}} \right] (1 - e) v_n^- = -\frac{1}{2} \frac{1 - e^2}{K_{nn}} (v_n^-)^2 = -\frac{1}{2}(1 - e^2) m_{\text{eff}} (v_n^-)^2$$
   - For $e = 1$ (elastic): $1 - e^2 = 0 \implies \Delta E_k = 0$ (energy strictly conserved).
   - For $e = 0$ (plastic): $\Delta E_k = -\frac{1}{2} m_{\text{eff}} (v_n^-)^2 \le 0$ (maximum dissipation). $\blacksquare$

---

### Worked Example 11.7: Tipping Block Impact on an Edge
**Problem:** A uniform cuboid of mass $M = 10\text{ kg}$, height $H = 1.2\text{ m}$, width $W = 0.6\text{ m}$, and depth $D = 0.6\text{ m}$ is tilted by an angle $\theta = 15^\circ$ and released from rest. It impacts the ground along one bottom edge ($x = W/2 = 0.3\text{ m}$).
Given that the moment of inertia about the impact edge is $I_{\text{edge}} = I_{\text{cm}} + M d^2$, and the impact with the ground is completely inelastic ($e = 0$), calculate the instantaneous angular velocity $\omega^+$ immediately after the impact edge strikes the ground.

**Solution:**
1. Just prior to impact, let the body have angular velocity $\omega^-$ rotating toward the ground about its COM.
2. During the instantaneous impact along the edge, an impulsive reaction $\mathbf{J}$ acts at the edge $\mathbf{p}_{\text{edge}}$.
3. Taking angular momentum about the edge $\mathbf{p}_{\text{edge}}$:
   $$\boldsymbol{\tau}_{\text{edge}} = (\mathbf{p}_{\text{edge}} - \mathbf{p}_{\text{edge}}) \times \mathbf{J} = \mathbf{0}$$
   **Angular momentum about the impact edge is conserved during the collision!**
4. Pre-impact angular momentum about the edge:
   $$L_{\text{edge}}^- = I_{\text{cm}} \omega^- + M (\mathbf{r}_{\text{cm}} \times \mathbf{v}_{\text{cm}}^-) \cdot \hat{\mathbf{k}}$$
5. Post-impact angular momentum about the edge (where the edge becomes the instantaneous axis of rotation):
   $$L_{\text{edge}}^+ = I_{\text{edge}} \omega^+$$
6. By conservation $L_{\text{edge}}^+ = L_{\text{edge}}^-$:
   $$\omega^+ = \frac{L_{\text{edge}}^-}{I_{\text{edge}}}$$
   This elegant result bypasses solving for the internal impulsive forces directly!

---

### Worked Example 11.8: Asymmetric Delassus Matrix Formulation
**Problem:** A body $A$ with mass $M_A = 2\text{ kg}$ and diagonal inertia tensor $\mathbf{I}_A = \text{diag}(1, 2, 4)\text{ kg}\cdot\text{m}^2$ makes contact with a fixed environment at point $\mathbf{r}_A = (1, 1, 0)^T\text{ m}$. Compute the full $3 \times 3$ Delassus matrix $\mathbf{K}$.

**Solution:**
1. Inverse mass: $M_A^{-1} = 0.5\text{ kg}^{-1}$.
2. Inverse inertia: $\mathbf{I}_A^{-1} = \text{diag}(1.0, 0.5, 0.25)\text{ kg}^{-1}\cdot\text{m}^{-2}$.
3. Skew-symmetric matrix $[\mathbf{r}_A]_\times$ for $\mathbf{r}_A = (1, 1, 0)^T$:
   $$[\mathbf{r}_A]_\times = \begin{pmatrix} 0 & 0 & 1 \\ 0 & 0 & -1 \\ -1 & 1 & 0 \end{pmatrix}$$
4. Compute $[\mathbf{r}_A]_\times^T \mathbf{I}_A^{-1} [\mathbf{r}_A]_\times$:
   $$[\mathbf{r}_A]_\times^T = \begin{pmatrix} 0 & 0 & -1 \\ 0 & 0 & 1 \\ 1 & -1 & 0 \end{pmatrix}$$
   $$\mathbf{I}_A^{-1} [\mathbf{r}_A]_\times = \begin{pmatrix} 1.0 & 0 & 0 \\ 0 & 0.5 & 0 \\ 0 & 0 & 0.25 \end{pmatrix} \begin{pmatrix} 0 & 0 & 1 \\ 0 & 0 & -1 \\ -1 & 1 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 0 & 1.0 \\ 0 & 0 & -0.5 \\ -0.25 & 0.25 & 0 \end{pmatrix}$$
   $$[\mathbf{r}_A]_\times^T (\mathbf{I}_A^{-1} [\mathbf{r}_A]_\times) = \begin{pmatrix} 0 & 0 & -1 \\ 0 & 0 & 1 \\ 1 & -1 & 0 \end{pmatrix} \begin{pmatrix} 0 & 0 & 1.0 \\ 0 & 0 & -0.5 \\ -0.25 & 0.25 & 0 \end{pmatrix} = \begin{pmatrix} 0.25 & -0.25 & 0 \\ -0.25 & 0.25 & 0 \\ 0 & 0 & 1.5 \end{pmatrix}$$
5. Full Delassus Matrix:
   $$\mathbf{K} = \frac{1}{M_A} \mathbf{I}_3 + [\mathbf{r}_A]_\times^T \mathbf{I}_A^{-1} [\mathbf{r}_A]_\times = \begin{pmatrix} 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \\ 0 & 0 & 0.5 \end{pmatrix} + \begin{pmatrix} 0.25 & -0.25 & 0 \\ -0.25 & 0.25 & 0 \\ 0 & 0 & 1.5 \end{pmatrix} = \begin{pmatrix} 0.75 & -0.25 & 0 \\ -0.25 & 0.75 & 0 \\ 0 & 0 & 2.0 \end{pmatrix}$$
   Notice that $\mathbf{K}$ is symmetric, and its eigenvalues are $\lambda_1 = 0.5, \lambda_2 = 1.0, \lambda_3 = 2.0$, all strictly positive!

---

### Worked Example 11.9: Projected Gauss-Seidel 1-Iteration Convergence Trace
**Problem:** Two contact constraints have Delassus matrix $\mathbf{K} = \begin{pmatrix} 2.0 & 0.5 \\ 0.5 & 2.0 \end{pmatrix}$ and pre-collision velocities $\mathbf{v}^- = (-4.0, -3.0)^T$. Assuming $e = 0$, trace the first iteration of PGS with clamped non-negative impulses $J_1, J_2 \ge 0$.

**Solution:**
1. Target velocities: $v_1^+ = 0, v_2^+ = 0$. Initial impulses: $J_1^{(0)} = 0, J_2^{(0)} = 0$.
2. **Solve Constraint 1:**
   $$\Delta J_1 = \frac{-(v_1^- + K_{12} J_2^{(0)})}{K_{11}} = \frac{-(-4.0 + 0.5(0))}{2.0} = \frac{4.0}{2.0} = +2.0$$
   $$J_1^{(1)} = \max(0, 0 + 2.0) = 2.0\text{ N}\cdot\text{s}$$
3. **Solve Constraint 2 (using updated $J_1^{(1)}$):**
   $$\Delta J_2 = \frac{-(v_2^- + K_{21} J_1^{(1)})}{K_{22}} = \frac{-(-3.0 + 0.5(2.0))}{2.0} = \frac{-(-2.0)}{2.0} = +1.0$$
   $$J_2^{(1)} = \max(0, 0 + 1.0) = 1.0\text{ N}\cdot\text{s}$$
4. At the end of iteration 1, $\mathbf{J}^{(1)} = (2.0, 1.0)^T$.
   Residual velocities: $\mathbf{v}^{(1)} = \mathbf{v}^- + \mathbf{K}\mathbf{J}^{(1)} = \begin{pmatrix} -4.0 \\ -3.0 \end{pmatrix} + \begin{pmatrix} 2.0 & 0.5 \\ 0.5 & 2.0 \end{pmatrix}\begin{pmatrix} 2.0 \\ 1.0 \end{pmatrix} = \begin{pmatrix} -4.0 + 4.5 \\ -3.0 + 3.0 \end{pmatrix} = \begin{pmatrix} +0.5 \\ 0.0 \end{pmatrix}$.
   In a single iteration, Constraint 2 is satisfied exactly, and Constraint 1 has dropped from $-4.0$ to $+0.5$!

---

### Worked Example 11.10: Baumgarte Stabilization Tuning for Numerical Stability
**Problem:** A physics simulation runs at fixed time step $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$. An unyielding floor supports a resting sphere with penetration $C = 0.01\text{ m}$ (1 cm) due to gravity $g = 9.81\text{ m/s}^2$.
If Baumgarte parameter is set to $\beta = 0.2$, calculate the bias velocity $v_{\text{bias}}$, the resulting impulse, and show why $\beta > 1.0$ would cause explosive numerical instability.

**Solution:**
1. **Bias Velocity:**
   $$v_{\text{bias}} = -\beta \frac{C}{\Delta t} = -0.2 \frac{0.01}{0.01667} = -0.2 (0.6) = -0.12\text{ m/s}$$
2. The impulse solver treats this bias as a virtual approach speed of $0.12\text{ m/s}$, commanding an upward separating velocity of $+0.12\text{ m/s}$.
3. Over the next step $\Delta t$, the position change is $\Delta y = v_{\text{bias}} \Delta t = (+0.12)(0.01667) = +0.002\text{ m}$ (2 mm).
   The penetration depth decreases from $10\text{ mm}$ to $8\text{ mm}$ geometrically.
4. **Instability Analysis:**
   Let penetration error be $e_k$. The update equation is $e_{k+1} = e_k - \beta e_k = (1 - \beta) e_k$.
   - If $0 < \beta < 1$: $|1 - \beta| < 1$, error decays monotonically to 0.
   - If $\beta = 1$: Error drops to 0 in 1 step (deadbeat control, highly sensitive to noise).
   - If $1 < \beta < 2$: $-1 < 1 - \beta < 0$, error oscillates with decaying amplitude.
   - If $\beta > 2$: $|1 - \beta| > 1$, error **diverges exponentially**, causing the body to launch into the stratosphere! Hence $\beta \in [0.1, 0.2]$ provides stable, overdamped penetration resolution.

---

## 11.8 Ten Granular Solved Exercises

### Exercise 11.1: Perfectly Elastic Collision of a Spinning Disk with a Smooth Wall
**Problem:** A thin uniform circular disk of mass $M = 3\text{ kg}$ and radius $R = 0.5\text{ m}$ ($I = \frac{1}{2}MR^2 = 0.375\text{ kg}\cdot\text{m}^2$) slides on a frictionless horizontal plane. It has linear velocity $\mathbf{v}^- = (2, -3, 0)^T\text{ m/s}$ and spin $\boldsymbol{\omega}^- = (0, 0, 10)^T\text{ rad/s}$. It strikes a frictionless wall lying along the x-axis (normal $\hat{\mathbf{n}} = (0, 1, 0)^T$) with restitution $e = 1.0$.
Determine the collision impulse and post-collision linear and angular velocities.

**Solution:**
1. Contact point: $\mathbf{r} = (0, -R, 0)^T = (0, -0.5, 0)^T$.
2. Contact velocity:
   $$\mathbf{v}_{\text{contact}}^- = \mathbf{v}^- + \boldsymbol{\omega}^- \times \mathbf{r} = (2, -3, 0)^T + (0, 0, 10)^T \times (0, -0.5, 0)^T = (2, -3, 0)^T + (5, 0, 0)^T = (7, -3, 0)^T$$
3. Normal velocity:
   $$v_n^- = \mathbf{v}_{\text{contact}}^- \cdot \hat{\mathbf{n}} = -3\text{ m/s}$$
4. Normal inverse effective mass:
   $$\mathbf{r} \times \hat{\mathbf{n}} = (0, -0.5, 0)^T \times (0, 1, 0)^T = \mathbf{0}$$
   $$K_{nn} = \frac{1}{M} = \frac{1}{3}\text{ kg}^{-1}$$
5. Impulse:
   $$J_n = \frac{-(1 + 1)(-3)}{1/3} = \frac{6}{1/3} = 18.0\text{ N}\cdot\text{s}$$
6. Post-collision velocities:
   $$\mathbf{v}^+ = \mathbf{v}^- + \frac{J_n \hat{\mathbf{n}}}{M} = (2, -3, 0)^T + \frac{18(0, 1, 0)^T}{3} = (2, -3 + 6, 0)^T = (2, 3, 0)^T\text{ m/s}$$
   $$\boldsymbol{\omega}^+ = \boldsymbol{\omega}^- + \mathbf{I}^{-1}(\mathbf{r} \times J_n \hat{\mathbf{n}}) = (0, 0, 10)^T + \mathbf{0} = (0, 0, 10)^T\text{ rad/s}$$
   Because the wall is frictionless, torque is zero, and spin is unaffected.

---

### Exercise 11.2: General Kinetic Energy Loss Derivation for Inelastic Collisions
**Problem:** Consider a general 3D collision between bodies $A$ and $B$ with restitution $e = 0.6$. If the normal approach speed is $v_n^- = -5.0\text{ m/s}$ and effective mass is $m_{\text{eff}} = 4.0\text{ kg}$, calculate the exact kinetic energy lost during impact.

**Solution:**
1. Using the formula derived in Worked Example 11.6:
   $$\Delta E_k = -\frac{1}{2}(1 - e^2) m_{\text{eff}} (v_n^-)^2$$
2. Substitute parameters:
   $$1 - e^2 = 1 - (0.6)^2 = 1 - 0.36 = 0.64$$
   $$(v_n^-)^2 = (-5.0)^2 = 25.0\text{ m}^2/\text{s}^2$$
   $$\Delta E_k = -\frac{1}{2} (0.64) (4.0) (25.0) = -0.32 \times 100.0 = -32.0\text{ J}$$
   Exactly $32.0\text{ Joules}$ of kinetic energy is converted into heat, acoustic deformation, and structural strain.

---

### Exercise 11.3: Striking a Free Floating Beam at Arbitrary Offset
**Problem:** A uniform beam of mass $M$ and length $L$ rests in space. A transverse impulse $J$ is delivered perpendicular to the beam at distance $x$ from the center of mass. Express the post-impact velocity of both endpoints ($y = \pm L/2$) as a function of $x$.

**Solution:**
1. Center of mass velocity: $v_{\text{cm}} = \frac{J}{M}$.
2. Angular velocity: $\omega = \frac{\tau}{I} = \frac{x J}{\frac{1}{12}M L^2} = \frac{12 x J}{M L^2}$.
3. Velocity at any coordinate $y$ along the beam:
   $$v(y) = v_{\text{cm}} + \omega y = \frac{J}{M} + \frac{12 x y J}{M L^2} = \frac{J}{M} \left( 1 + \frac{12 x y}{L^2} \right)$$
4. For endpoint $y = +L/2$:
   $$v(+L/2) = \frac{J}{M} \left( 1 + \frac{6x}{L} \right)$$
5. For endpoint $y = -L/2$:
   $$v(-L/2) = \frac{J}{M} \left( 1 - \frac{6x}{L} \right)$$
   Notice: If $x = L/6$, $v(-L/2) = 0$!

---

### Exercise 11.4: Bowling Ball Sliding-to-Rolling Transition Time
**Problem:** A bowling ball of mass $M = 5\text{ kg}$ and radius $R = 0.11\text{ m}$ ($I = \frac{2}{5}MR^2$) is launched onto an alley with initial forward speed $v_0 = 8\text{ m/s}$ and zero spin $\omega_0 = 0$. The coefficient of kinetic friction with the lane is $\mu_k = 0.15$.
Calculate the time $t_{\text{roll}}$ elapsed until pure rolling begins, and the final velocity $v_{\text{roll}}$.

**Solution:**
1. Friction force acting backward on the contact patch: $F_f = \mu_k M g$.
2. Linear deceleration:
   $$a = -\frac{F_f}{M} = -\mu_k g \implies v(t) = v_0 - \mu_k g t$$
3. Torque about COM:
   $$\tau = F_f R = \mu_k M g R \implies \alpha = \frac{\mu_k M g R}{\frac{2}{5}MR^2} = \frac{5 \mu_k g}{2 R} \implies \omega(t) = \frac{5 \mu_k g}{2 R} t$$
4. Pure rolling condition occurs when contact point velocity reaches zero:
   $$v(t_{\text{roll}}) = R \omega(t_{\text{roll}})$$
   $$v_0 - \mu_k g t_{\text{roll}} = R \left( \frac{5 \mu_k g}{2 R} t_{\text{roll}} \right) = \frac{5}{2} \mu_k g t_{\text{roll}}$$
   $$v_0 = \frac{7}{2} \mu_k g t_{\text{roll}} \implies t_{\text{roll}} = \frac{2 v_0}{7 \mu_k g}$$
5. Numerical values with $g = 9.81\text{ m/s}^2$:
   $$t_{\text{roll}} = \frac{2(8)}{7(0.15)(9.81)} = \frac{16}{10.3005} \approx 1.553\text{ seconds}$$
6. Final rolling speed:
   $$v_{\text{roll}} = v_0 - \mu_k g t_{\text{roll}} = v_0 - \mu_k g \left(\frac{2 v_0}{7 \mu_k g}\right) = \frac{5}{7} v_0 = \frac{5}{7}(8) \approx 5.714\text{ m/s}$$
   Notice that $v_{\text{roll}}$ is completely independent of mass, radius, and friction coefficient!

---

### Exercise 11.5: Effective Mass Comparison Across Geometric Features
**Problem:** A uniform cube of mass $M = 6\text{ kg}$ and side length $s = 1\text{ m}$ has principal inertia $I = \frac{1}{6}M s^2 = 1.0\text{ kg}\cdot\text{m}^2$. Compare the effective mass $m_{\text{eff}}$ when struck along normal $\hat{\mathbf{n}} = (0, 1, 0)^T$ at:
(a) The face center: $\mathbf{r}_{\text{face}} = (0, 0.5, 0)^T$.
(b) The edge midpoint: $\mathbf{r}_{\text{edge}} = (0.5, 0.5, 0)^T$.
(c) The corner: $\mathbf{r}_{\text{corner}} = (0.5, 0.5, 0.5)^T$.

**Solution:**
1. $M^{-1} = \frac{1}{6} \approx 0.1667\text{ kg}^{-1}$. Inverse inertia: $\mathbf{I}^{-1} = \text{diag}(1, 1, 1)\text{ kg}^{-1}\cdot\text{m}^{-2}$.
2. **(a) Face Center:**
   $$\mathbf{r} \times \hat{\mathbf{n}} = (0, 0.5, 0)^T \times (0, 1, 0)^T = \mathbf{0}$$
   $$K = M^{-1} = 0.1667 \implies m_{\text{eff}} = M = 6.0\text{ kg}$$
3. **(b) Edge Midpoint:**
   $$\mathbf{r} \times \hat{\mathbf{n}} = (0.5, 0.5, 0)^T \times (0, 1, 0)^T = (0, 0, 0.5)^T$$
   $$(\mathbf{r} \times \hat{\mathbf{n}})^T \mathbf{I}^{-1} (\mathbf{r} \times \hat{\mathbf{n}}) = (0.5)^2 (1.0) = 0.25$$
   $$K = \frac{1}{6} + 0.25 = 0.1667 + 0.25 = 0.4167\text{ kg}^{-1} \implies m_{\text{eff}} = \frac{1}{0.4167} = 2.40\text{ kg}$$
4. **(c) Corner:**
   $$\mathbf{r} \times \hat{\mathbf{n}} = (0.5, 0.5, 0.5)^T \times (0, 1, 0)^T = (-0.5, 0, 0.5)^T$$
   $$(\mathbf{r} \times \hat{\mathbf{n}})^T \mathbf{I}^{-1} (\mathbf{r} \times \hat{\mathbf{n}}) = (-0.5)^2(1) + (0.5)^2(1) = 0.25 + 0.25 = 0.50$$
   $$K = \frac{1}{6} + 0.50 = 0.6667\text{ kg}^{-1} \implies m_{\text{eff}} = \frac{1}{0.6667} = 1.50\text{ kg}$$
   Striking the corner feels $4\times$ lighter than striking the face center because rotational inertia absorbs the impulse!

---

### Exercise 11.6: 3-Sphere Collision Chain with Variable Restitutions
**Problem:** Three identical spheres $A, B, C$ of mass $M$ are aligned on a frictionless line. Sphere $A$ moves with velocity $v_0$ toward stationary $B$. Restitution between $A$ and $B$ is $e_{AB}$, and between $B$ and $C$ is $e_{BC}$. Find the final velocity of sphere $C$.

**Solution:**
1. Collision between $A$ and $B$:
   $$v_A^+ = \frac{1 - e_{AB}}{2} v_0, \quad v_B^+ = \frac{1 + e_{AB}}{2} v_0$$
2. Sphere $B$ then strikes stationary sphere $C$:
   $$v_C^+ = \frac{1 + e_{BC}}{2} v_B^+ = \left( \frac{1 + e_{BC}}{2} \right) \left( \frac{1 + e_{AB}}{2} \right) v_0 = \frac{(1 + e_{AB})(1 + e_{BC})}{4} v_0$$
3. If both are elastic ($e_{AB} = e_{BC} = 1$):
   $$v_C^+ = \frac{(2)(2)}{4} v_0 = v_0$$
   (Newton's cradle perfect momentum transfer).

---

### Exercise 11.7: Hinge Reaction Impulse on a Swinging Door
**Problem:** A uniform door of mass $M = 20\text{ kg}$ and width $W = 0.8\text{ m}$ swings open at angular velocity $\omega_0 = 2\text{ rad/s}$ about a vertical hinge axis at $x = 0$. It is suddenly stopped by a doorstop at distance $d$ from the hinge ($e = 0$). Find the reaction impulse $\mathbf{J}_{\text{hinge}}$ on the hinge as a function of $d$, and find the value of $d$ that eliminates hinge shock.

**Solution:**
1. Moment of inertia about the hinge: $I_{\text{hinge}} = \frac{1}{3}M W^2$.
2. Total angular momentum before collision: $L_{\text{hinge}} = I_{\text{hinge}} \omega_0 = \frac{1}{3}M W^2 \omega_0$.
3. When stopped by impulse $J_{\text{stop}}$ at distance $d$:
   $$\Delta L_{\text{hinge}} = -d J_{\text{stop}} = -I_{\text{hinge}} \omega_0 \implies J_{\text{stop}} = \frac{I_{\text{hinge}} \omega_0}{d} = \frac{M W^2 \omega_0}{3 d}$$
4. Linear momentum conservation of the door:
   $$P^- = M v_{\text{cm}}^- = M \left(\frac{W}{2}\right) \omega_0 = \frac{1}{2} M W \omega_0$$
   $$P^+ = 0 \implies \Delta P = -\frac{1}{2} M W \omega_0$$
5. Net impulse on door is $\Delta P = -(J_{\text{stop}} + J_{\text{hinge}})$:
   $$J_{\text{hinge}} = \frac{1}{2} M W \omega_0 - J_{\text{stop}} = M W \omega_0 \left( \frac{1}{2} - \frac{W}{3d} \right)$$
6. For zero hinge shock ($J_{\text{hinge}} = 0$):
   $$\frac{1}{2} - \frac{W}{3d} = 0 \implies d = \frac{2}{3} W$$
   For $W = 0.8\text{ m}$, $d = \frac{2}{3}(0.8) \approx 0.533\text{ m}$.

---

### Exercise 11.8: Pyramidal Friction Cone Approximation
**Problem:** Explain why game physics engines approximate the circular Coulomb cone $\|\mathbf{J}_t\| \le \mu J_n$ with a 4-sided pyramid, write the constraint equations, and quantify the maximum friction force overestimation.

**Solution:**
1. A circular cone constraint $\|\mathbf{J}_t\| = \sqrt{J_{t1}^2 + J_{t2}^2} \le \mu J_n$ is a non-linear second-order cone constraint (SOCP), which cannot be solved directly in a linear PGS solver.
2. By projecting along two orthogonal tangent directions $\hat{\mathbf{t}}_1, \hat{\mathbf{t}}_2$, we enforce two independent linear box constraints:
   $$|J_{t1}| \le \mu J_n, \quad |J_{t2}| \le \mu J_n$$
3. This creates a square cross-section (pyramid) rather than a circular cone.
4. Along the diagonals ($J_{t1} = J_{t2} = \mu J_n$), the effective friction magnitude is:
   $$\|\mathbf{J}_t\| = \sqrt{(\mu J_n)^2 + (\mu J_n)^2} = \sqrt{2} \mu J_n \approx 1.414 \mu J_n$$
5. The maximum friction overestimation is $\sqrt{2} - 1 \approx 41.4\%$. Engines mitigate this by scaling the bounds by $1/\sqrt{2}$ or dynamically aligning $\hat{\mathbf{t}}_1$ with the sliding velocity vector $\mathbf{v}_t$.

---

### Exercise 11.9: Angular Momentum Conservation About Contact Point
**Problem:** Prove that during any frictionless collision between a rigid body and a stationary flat plane, the body's angular momentum about the contact point $\mathbf{p}$ is strictly conserved.

**Solution:**
1. Angular momentum of body $A$ about contact point $\mathbf{p}$ is:
   $$\mathbf{L}_p = \mathbf{r}_A \times \mathbf{P}_A + \mathbf{I}_A \boldsymbol{\omega}_A$$
   where $\mathbf{r}_A = \mathbf{p} - \mathbf{x}_A$.
2. The change in $\mathbf{L}_p$ across the collision is:
   $$\Delta \mathbf{L}_p = \mathbf{r}_A \times \Delta \mathbf{P}_A + \mathbf{I}_A \Delta \boldsymbol{\omega}_A$$
3. Substituting the impulse formulas $\Delta \mathbf{P}_A = \mathbf{J}$ and $\mathbf{I}_A \Delta \boldsymbol{\omega}_A = \mathbf{r}_A \times \mathbf{J}$:
   $$\Delta \mathbf{L}_p = \mathbf{r}_A \times \mathbf{J} - (\mathbf{r}_A \times \mathbf{J}) = \mathbf{0}$$
4. Therefore, $\mathbf{L}_p^+ = \mathbf{L}_p^-$. Angular momentum about the contact point is an exact invariant! $\blacksquare$

---

### Exercise 11.10: Maximum Allowable Baumgarte Parameter
**Problem:** In a stiff spring-damper analogy of Baumgarte stabilization, show that the discrete update equation $x_{k+1} = (1 - \beta) x_k$ becomes unstable when $\beta > 2$. Determine the optimal critically damped parameter $\beta^*$ to eliminate penetration without ringing.

**Solution:**
1. The error recurrence is $e_{k+1} = (1 - \beta) e_k \implies e_k = (1 - \beta)^k e_0$.
2. The root of the characteristic equation is $\lambda = 1 - \beta$.
3. For asymptotic stability in the complex plane, $|\lambda| < 1$:
   $$-1 < 1 - \beta < 1 \implies 0 < \beta < 2$$
4. If $\beta = 1$, $\lambda = 0$, giving deadbeat response (error reaches 0 in 1 step). However, in multi-contact systems with coupling, $\beta = 1$ causes stiff overshoots.
5. In practice, setting $\beta \in [0.1, 0.2]$ provides smooth, non-oscillatory exponential convergence with decay rate $\approx (0.8)^k$, completely suppressing numerical energy spikes.

---

## 11.9 Chapter Summary and Bridge to Chapter 12

In this chapter, we completed the mechanical theory of contact and collisions:
1. **Contact Geometry:** Formalized the contact triad $(\hat{\mathbf{n}}, \hat{\mathbf{t}}_1, \hat{\mathbf{t}}_2)$ and lever arms $\mathbf{r}_A, \mathbf{r}_B$.
2. **Velocity Kinematics:** Derived surface point velocities $\mathbf{v}_{\text{contact}} = \mathbf{v}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}$ and the relative approach velocity $v_n$.
3. **The 3D Collision Impulse:** Derived the fundamental scalar impulse formula $J_n$ using Newton's restitution law and positive-definite tensor quadratic forms.
4. **The Delassus Matrix:** Established the $3 \times 3$ contact mobility operator $\mathbf{K} = \frac{1}{M}\mathbf{I}_3 + [\mathbf{r}]_\times^T \mathbf{I}^{-1} [\mathbf{r}]_\times$.
5. **Coulomb Friction:** Derived 3D friction cone clamping and static/kinetic transitions.
6. **Sequential Impulses:** Formulated the Projected Gauss-Seidel solver for multi-point contact manifolds with Baumgarte stabilization.

With Chapters 1 through 11 providing the theoretical and mathematical bedrock, we are ready for **Chapter 12: Production TypeScript Rigid Body Engine and the Grand Gauntlet**, where we synthesize all concepts into a complete, high-performance 3D rigid body physics engine and solve 10 landmark civilizational engineering challenges.
