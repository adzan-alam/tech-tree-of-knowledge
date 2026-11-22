# Chapter 07: Two-Dimensional Oblique Collisions and Planar Scattering

> "In collisions where bodies do not strike head-on along their centers of mass, the motion divides cleanly into two independent universes: along the tangent of contact, nature behaves as if nothing happened; along the common normal, the full drama of impulse, momentum conservation, and restitution unfolds."  
> — Classical Impact Mechanics Principle

---

## 1. Introduction: The Transition from Collinear to Planar Impact

In Chapters 5 and 6, we analyzed collisions restricted strictly to a single spatial dimension—the collinear line of centres. In that idealized world, velocity vectors were either parallel or anti-parallel, reducing vector algebra to scalar arithmetic with signs. However, the physical universe operates in three spatial dimensions, and collisions in nature, sports, astronomy, and microscopic physics are almost never perfectly head-on.

When a cue ball strikes an object ball off-center, when gas molecules scatter off one another inside a pressure vessel, when micrometeoroids glance off the hull of an orbital satellite, or when alpha particles deflect past atomic nuclei, the velocity vectors before and after the collision span a two-dimensional plane. Such interactions are known as **oblique collisions** or **glancing impacts**.

The transition from 1D to 2D collisions introduces geometric richness:
1. **Impact Parameter ($b$):** The perpendicular distance of closest approach if the bodies had continued undeflected.
2. **Contact Geometry:** The instantaneous surface of contact and the **Line of Impact** (the common normal).
3. **Scattering Angles:** The directional deflection of both projectile and target relative to the initial trajectory.
4. **Kinematic Decoupling:** The fundamental separation between normal forces (which compress and restore the bodies) and tangential forces (governed by friction or surface slip).

In this chapter, we develop the universal mathematical framework for solving arbitrary two-dimensional collisions between rigid and deformable bodies. We prove one of the most elegant theorems in classical mechanics—the **$90^\circ$ Scattering Theorem** for identical elastic spheres—and explore the kinematic transformations between the Laboratory Frame and the Center of Mass Frame in two dimensions.

---

## 2. The Anatomy of an Oblique Impact: Normal and Tangential Coordinate Systems

To resolve a two-dimensional collision, we must establish a localized coordinate system aligned with the physics of the contact rather than arbitrary Cartesian laboratory axes $(x, y)$.

```
                      Plane of Contact (Tangential axis t)
                                     |
                                     |
              Sphere 1 (m1)          |          Sphere 2 (m2)
                 ( O1 )-------------(*)-------------( O2 )
                                     |
                                     |
                                     v
                      Line of Impact (Normal axis n)
```

### 2.1 The Line of Impact ($\hat{n}$) and the Plane of Contact ($\hat{t}$)

When two smooth, spherical bodies (or curved surfaces) collide:
- The **Point of Contact** ($C$) is the unique point where the surfaces touch at the instant of maximum compression.
- The **Line of Impact** (unit normal $\hat{n}$) is the line perpendicular to the tangent plane at $C$. For spherical particles of radii $R_1$ and $R_2$ centered at positions $\vec{r}_1$ and $\vec{r}_2$, the normal vector points directly along the line connecting their centers:
$$\hat{n} = \frac{\vec{r}_2 - \vec{r}_1}{\|\vec{r}_2 - \vec{r}_1\|}$$
- The **Plane of Contact** (or Tangential Axis $\hat{t}$) is orthogonal to $\hat{n}$. In two dimensions, $\hat{t}$ is obtained by rotating $\hat{n}$ by $90^\circ$ counterclockwise:
$$\hat{t} = (-n_y, n_x)$$
such that $\hat{n} \cdot \hat{t} = 0$ and $\|\hat{n}\| = \|\hat{t}\| = 1$.

### 2.2 The Decoupling Principle for Smooth (Frictionless) Surfaces

During the brief duration of the collision $\Delta t \to 0$, the normal force $F_n(t)$ reaches enormous magnitudes, delivering a normal impulse:
$$J_n = \int_{t_i}^{t_f} F_n(t)\,dt \gg 0$$

What happens along the tangential direction $\hat{t}$? For smooth surfaces with zero friction ($\mu = 0$):
$$F_t(t) = 0 \implies J_t = \int_{t_i}^{t_f} F_t(t)\,dt = 0$$

Because there is zero tangential force acting on either particle, Newton's Second Law guarantees that the tangential momentum of *each individual body* is strictly conserved independently!

$$\Delta p_{1t} = m_1 (v_{1t, f} - v_{1t, i}) = 0 \implies v_{1t, f} = v_{1t, i}$$
$$\Delta p_{2t} = m_2 (v_{2t, f} - v_{2t, i}) = 0 \implies v_{2t, f} = v_{2t, i}$$

This is the **Tangential Invariance Theorem**: *In any frictionless collision, the tangential velocity component of each colliding body is completely unaltered by the collision.*

### 2.3 The Normal Dynamics and Coefficient of Restitution

Along the normal axis $\hat{n}$, the bodies interact through mutual contact forces governed by Newton's Third Law ($F_{21, n} = -F_{12, n}$). Consequently:
1. **Total Normal Momentum is Conserved:**
   $$m_1 v_{1n, i} + m_2 v_{2n, i} = m_1 v_{1n, f} + m_2 v_{2n, f}$$

2. **Normal Velocity Separation Follows Newton's Restitution Law:**
   $$v_{2n, f} - v_{1n, f} = -e (v_{2n, i} - v_{1n, i})$$
   where $e \in [0, 1]$ is the coefficient of restitution along the normal axis.

Notice the profound simplification: along $\hat{n}$, the problem is mathematically identical to a **one-dimensional collision**! We have already solved this system in Chapter 6:

$$v_{1n, f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1n, i} + \frac{(1 + e) m_2}{m_1 + m_2} v_{2n, i}$$
$$v_{2n, f} = \frac{(1 + e) m_1}{m_1 + m_2} v_{1n, i} + \frac{m_2 - e m_1}{m_1 + m_2} v_{2n, i}$$

### 2.4 The Master Recipe for Solving Any 2D Collision

Given initial velocities $\vec{v}_{1i}, \vec{v}_{2i}$, masses $m_1, m_2$, restitution $e$, and the normal orientation unit vector $\hat{n}$:
1. **Compute Tangential Unit Vector:** $\hat{t} = (-n_y, n_x)$.
2. **Decompose Velocities into Normal and Tangential Components:**
   $$v_{1n, i} = \vec{v}_{1i} \cdot \hat{n}, \quad v_{1t, i} = \vec{v}_{1i} \cdot \hat{t}$$
   $$v_{2n, i} = \vec{v}_{2i} \cdot \hat{n}, \quad v_{2t, i} = \vec{v}_{2i} \cdot \hat{t}$$
3. **Apply Decoupled Solutions:**
   - Tangential components: $v_{1t, f} = v_{1t, i}$ and $v_{2t, f} = v_{2t, i}$.
   - Normal components: Solve 1D equations for $v_{1n, f}$ and $v_{2n, f}$.
4. **Reconstruct Vector Velocities in Laboratory Coordinates:**
   $$\vec{v}_{1f} = v_{1n, f}\hat{n} + v_{1t, f}\hat{t}$$
   $$\vec{v}_{2f} = v_{2n, f}\hat{n} + v_{2t, f}\hat{t}$$

This modular algorithm forms the computational foundation of every rigid-body physics engine.

---

## 3. Geometry of Sphere-Sphere Collisions and the Impact Parameter

Consider two spherical particles of radii $R_1$ and $R_2$. Let particle 2 be initially stationary at the origin $(0, 0)$, while particle 1 travels in the $+x$ direction with speed $v_0$ along a trajectory with horizontal centerline offset by a vertical distance $b$.

```
                         y
                         ^
                         |           Line of Impact n
        m1               |             ^
     (  v0  ) ---------->+             /  alpha
    ---------------------+------------*--------> x
                         |        C  /
                       b |          /
                         |       ( m2 )
                         v      Origin
```

### 3.1 The Impact Parameter ($b$)

The parameter $b$ is called the **impact parameter**.
- If $b = 0$, the collision is purely **head-on** ($\hat{n} = \hat{i}$, $\hat{t} = \hat{j}$).
- If $|b| > R_1 + R_2$, the spheres do not touch; no collision occurs.
- If $0 < |b| < R_1 + R_2$, an **oblique collision** occurs.

### 3.2 Determining the Collision Angle ($\alpha$)

At the exact instant of first contact, the distance between the two spherical centers is exactly:
$$d = R_1 + R_2$$

From the right triangle formed by the center of sphere 2, the horizontal flight line of sphere 1, and the contact normal:
$$\sin\alpha = \frac{b}{R_1 + R_2}$$
$$\cos\alpha = \sqrt{1 - \left(\frac{b}{R_1 + R_2}\right)^2}$$

The normal unit vector pointing from sphere 1 to sphere 2 is:
$$\hat{n} = \cos\alpha\,\hat{i} - \sin\alpha\,\hat{j}$$

The tangential unit vector is:
$$\hat{t} = \sin\alpha\,\hat{i} + \cos\alpha\,\hat{j}$$

Thus, simply knowing the geometric impact parameter $b$ and radii $R_1, R_2$ completely specifies the normal-tangential transformation matrix!

---

## 4. The Famous $90^\circ$ Scattering Theorem

One of the most celebrated and ubiquitous phenomena in classical mechanics is the scattering behavior of identical billiard balls.

### 4.1 Theorem Statement

> **The $90^\circ$ Scattering Theorem:**  
> When a moving particle of mass $m$ undergoes a perfectly elastic ($e = 1$) oblique collision with an identical stationary particle of mass $m$ ($m_1 = m_2 = m$, $\vec{v}_{2i} = \vec{0}$), their post-collision trajectories are strictly perpendicular ($\vec{v}_{1f} \perp \vec{v}_{2f}$), meaning the angle between their final velocity vectors is exactly:
> $$\theta_1 + \theta_2 = 90^\circ = \frac{\pi}{2}\text{ rad}$$
> (provided $v_{1f} \ne 0$).

### 4.2 Vector Proof (Coordinate-Free Derivation)

The beauty of this theorem lies in its pure vector derivation, requiring zero coordinate decomposition.

1. **Conservation of Linear Momentum:**
   Because the system is isolated, total momentum before equals total momentum after:
   $$m\vec{v}_{1i} + m\vec{v}_{2i} = m\vec{v}_{1f} + m\vec{v}_{2f}$$
   Since $\vec{v}_{2i} = \vec{0}$ and $m_1 = m_2 = m$, we cancel $m$:
   $$\vec{v}_{1i} = \vec{v}_{1f} + \vec{v}_{2f}$$

2. **Square Both Sides (Vector Dot Product):**
   $$\|\vec{v}_{1i}\|^2 = (\vec{v}_{1f} + \vec{v}_{2f}) \cdot (\vec{v}_{1f} + \vec{v}_{2f})$$
   $$v_{1i}^2 = v_{1f}^2 + v_{2f}^2 + 2 (\vec{v}_{1f} \cdot \vec{v}_{2f}) \quad \text{--- (Equation A)}$$

3. **Conservation of Kinetic Energy ($e = 1$):**
   Because the collision is perfectly elastic, kinetic energy is strictly conserved:
   $$\frac{1}{2}m v_{1i}^2 = \frac{1}{2}m v_{1f}^2 + \frac{1}{2}m v_{2f}^2$$
   Canceling $\frac{1}{2}m$:
   $$v_{1i}^2 = v_{1f}^2 + v_{2f}^2 \quad \text{--- (Equation B)}$$

4. **Subtract Equation B from Equation A:**
   $$0 = 2 (\vec{v}_{1f} \cdot \vec{v}_{2f})$$
   $$\vec{v}_{1f} \cdot \vec{v}_{2f} = 0$$

5. **Geometric Conclusion:**
   Since the dot product of the non-zero final velocity vectors is identically zero:
   $$v_{1f} v_{2f} \cos(\theta_{\text{total}}) = 0 \implies \cos(\theta_{\text{total}}) = 0 \implies \theta_{\text{total}} = 90^\circ$$

$$\blacksquare$$

### 4.3 Why Does This Breakdown in Real Billiards?

Every skilled pool player knows that real billiard balls do not always separate at exactly $90^\circ$. Why?
1. **Inelasticity ($e < 1$):** If kinetic energy is lost, $v_{1i}^2 > v_{1f}^2 + v_{2f}^2$. Substituting into Equation A yields $\vec{v}_{1f} \cdot \vec{v}_{2f} > 0$, meaning the scattering angle is **strictly acute** ($\theta_{\text{total}} < 90^\circ$).
2. **Rotational Spin (English) and Friction:** Real billiard balls have rotational inertia ($I = \frac{2}{5} m R^2$). Friction between the balls (tangential impulse $J_t \ne 0$) and friction with the felt table introduces spin-induced curve (squirt and swerve).
3. **Mass Inequality ($m_1 \ne m_2$):**
   - If $m_1 > m_2$ (heavier projectile): $\theta_{\text{total}} < 90^\circ$ (forward-focused scattering).
   - If $m_1 < m_2$ (lighter projectile): $\theta_{\text{total}} > 90^\circ$ (the projectile can bounce backwards into the obtuse hemisphere).

---

## 5. Oblique Collisions with a Rigid, Immovable Boundary

When a ball strikes a flat, rigid surface (such as a floor, wall, or cushion), the boundary can be modeled as a body of infinite mass ($m_2 \to \infty$) anchored to the earth ($v_{2i} = 0, v_{2f} = 0$).

```
                      Normal axis n
                            ^
                            |
           Incident \       |       / Reflected
            vector   \      |      /   vector
              v_i     \     |     /    v_f
                       \ theta_i / theta_r
             -----------+---+---+------------ Wall (Tangential axis t)
```

Let the wall lie along the tangential axis $\hat{t}$, with the normal $\hat{n}$ pointing outward into the open domain.
- Let the incident velocity make an angle $\theta_i$ with the surface normal $\hat{n}$.
  $$v_{n, i} = -v_i \cos\theta_i, \quad v_{t, i} = v_i \sin\theta_i$$

### 5.1 Frictionless Rebound Dynamics

Along the frictionless wall:
- Tangential component is unchanged:
  $$v_{t, f} = v_{t, i} = v_i \sin\theta_i$$
- Normal component rebounds with coefficient of restitution $e$:
  $$v_{n, f} = -e v_{n, i} = +e v_i \cos\theta_i$$

### 5.2 Angle of Reflection and Speed Loss

The final speed $v_f$ is:
$$v_f = \sqrt{v_{t, f}^2 + v_{n, f}^2} = v_i \sqrt{\sin^2\theta_i + e^2 \cos^2\theta_i}$$

The reflection angle $\theta_r$ with the normal is:
$$\tan\theta_r = \frac{v_{t, f}}{v_{n, f}} = \frac{v_i \sin\theta_i}{e v_i \cos\theta_i} = \frac{1}{e} \tan\theta_i$$

Notice the profound implications:
- **If $e = 1$ (Elastic Reflection):**
  $$\tan\theta_r = \tan\theta_i \implies \theta_r = \theta_i, \quad v_f = v_i$$
  The angle of incidence equals the angle of reflection (Snell's optical law for specular reflection).
- **If $e < 1$ (Inelastic Reflection):**
  $$\frac{1}{e} > 1 \implies \tan\theta_r > \tan\theta_i \implies \theta_r > \theta_i$$
  Because the normal velocity is attenuated while the tangential velocity is preserved, the post-collision trajectory is **refracted toward the surface of the wall**!
- **If $e = 0$ (Completely Inelastic Normal Collision):**
  $$\theta_r = 90^\circ$$
  The object completely loses all normal motion and slides flat along the wall at speed $v_{t, i}$.

---

## 6. Two-Dimensional Collisions in the Center-of-Mass Frame

Analyzing 2D collisions in the Laboratory frame can involve tedious trigonometric bookkeeping. In contrast, transforming into the **Center of Mass (C-Frame)** reveals stunning symmetry.

### 6.1 The C-Frame Transformation in 2D

The center of mass velocity is:
$$\vec{V}_{\text{CM}} = \frac{m_1 \vec{v}_{1i} + m_2 \vec{v}_{2i}}{m_1 + m_2}$$

Velocities in the C-frame (denoted with primes) are:
$$\vec{u}'_{1i} = \vec{v}_{1i} - \vec{V}_{\text{CM}}, \quad \vec{u}'_{2i} = \vec{v}_{2i} - \vec{V}_{\text{CM}}$$

By definition of the zero-momentum frame:
$$m_1 \vec{u}'_{1i} + m_2 \vec{u}'_{2i} = \vec{0} \implies \vec{u}'_{2i} = -\frac{m_1}{m_2}\vec{u}'_{1i}$$

In the C-frame, the two particles always approach each other along **exact opposite directions** on a single straight line, regardless of their laboratory approach angles!

### 6.2 Elastic Scattering in the C-Frame

For an elastic collision ($e = 1$):
1. The speeds of both particles are preserved in the C-frame:
   $$\|\vec{u}'_{1f}\| = \|\vec{u}'_{1i}\|, \quad \|\vec{u}'_{2f}\| = \|\vec{u}'_{2i}\|$$
2. The particles merely rotate their mutual axis of motion by an angle $\theta^*$ (the C-frame scattering angle):
   $$\vec{u}'_{1f} = \|\vec{u}'_{1i}\| (\cos\theta^* \hat{u}'_{\parallel} + \sin\theta^* \hat{u}'_{\perp})$$
   $$\vec{u}'_{2f} = -\|\vec{u}'_{2i}\| (\cos\theta^* \hat{u}'_{\parallel} + \sin\theta^* \hat{u}'_{\perp})$$

To find laboratory velocities, we simply add back the constant center-of-mass velocity:
$$\vec{v}_{1f} = \vec{u}'_{1f} + \vec{V}_{\text{CM}}, \quad \vec{v}_{2f} = \vec{u}'_{2f} + \vec{V}_{\text{CM}}$$

### 6.3 Maximum Deflection Angle for Heavy Projectiles

When a projectile of mass $m_1$ strikes a stationary lighter target $m_2$ ($m_1 > m_2$), the center of mass moves faster than the C-frame recoil speed of the projectile. 

As a result, in the Laboratory frame, particle 1 cannot be scattered backward! There exists a strict **maximum scattering angle** $\theta_{1, \max}$:

$$\sin(\theta_{1, \max}) = \frac{m_2}{m_1}$$

- For $m_1 = 2 m_2$, $\sin\theta_{1, \max} = 0.5 \implies \theta_{1, \max} = 30^\circ$.
- No matter how glancing the impact, the heavy projectile can never deviate by more than $30^\circ$ from its original path!

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 7.1: Frictionless Oblique Wall Impact with Known Restitution
*A hockey puck slides on frictionless ice at $v_i = 25.0\text{ m/s}$ toward a rigid rink cushion, striking it at an angle of incidence $\theta_i = 30.0^\circ$ measured relative to the normal of the cushion. The coefficient of restitution between the puck and cushion is $e = 0.600$. Determine: (a) the normal and tangential post-impact velocity components, (b) the rebound speed $v_f$, and (c) the angle of reflection $\theta_r$.*

#### Solution
1. **Given:**
   - $v_i = 25.0\text{ m/s}$
   - $\theta_i = 30.0^\circ$ (relative to normal $\hat{n}$)
   - $e = 0.600$
2. **Decompose Initial Velocity:**
   - $v_{n, i} = -v_i \cos(30.0^\circ) = -25.0 \times 0.866025 = -21.6506\text{ m/s}$
   - $v_{t, i} = v_i \sin(30.0^\circ) = 25.0 \times 0.500000 = 12.5000\text{ m/s}$
3. **Part (a): Compute Post-Impact Components:**
   - Frictionless cushion $\implies v_{t, f} = v_{t, i} = +12.5\text{ m/s}$.
   - Restitution along normal $\implies v_{n, f} = -e v_{n, i} = -(0.600) \times (-21.6506\text{ m/s}) = +12.9904\text{ m/s}$.
4. **Part (b): Rebound Speed $v_f$:**
   $$v_f = \sqrt{v_{n, f}^2 + v_{t, f}^2} = \sqrt{(12.9904)^2 + (12.5000)^2} = \sqrt{168.75 + 156.25} = \sqrt{325.0} = 18.0278\text{ m/s}$$
   $$\mathbf{v_f \approx 18.0\text{ m/s}}$$
5. **Part (c): Reflection Angle $\theta_r$:**
   $$\tan\theta_r = \frac{v_{t, f}}{v_{n, f}} = \frac{12.5000}{12.9904} \approx 0.96225$$
   $$\theta_r = \arctan(0.96225) \approx 43.898^\circ \approx \mathbf{43.9^\circ}$$
6. **Sanity Check:**
   Since $e < 1$, $\theta_r > \theta_i$ ($43.9^\circ > 30.0^\circ$). The trajectory refracted towards the surface as predicted by theory.

---

### Worked Example 7.2: Elastic Collision Between Identical Spheres ($90^\circ$ Verification)
*Billiard ball A ($m_A = 0.170\text{ kg}$) moves at $\vec{v}_A = 4.00\,\hat{i}\text{ m/s}$ and strikes identical stationary ball B ($m_B = 0.170\text{ kg}$) off-center. After the collision, ball B moves at an angle of $-30.0^\circ$ relative to the $+x$ axis. Assuming a perfectly elastic collision ($e = 1.000$): (a) find the post-collision speed of ball B, (b) find the post-collision velocity vector of ball A, and (c) verify that $\vec{v}_A \cdot \vec{v}_B = 0$.*

#### Solution
1. **Given:**
   - $m_A = m_B = 0.170\text{ kg}$
   - $\vec{v}_{Ai} = (4.00, 0)\text{ m/s}$
   - $\vec{v}_{Bi} = (0, 0)\text{ m/s}$
   - Ball B's direction: $\theta_B = -30.0^\circ$
   - $e = 1.000$
2. **Apply the $90^\circ$ Scattering Theorem:**
   - Since $m_A = m_B$, $v_{Bi} = 0$, and $e = 1.00$, the angle between $\vec{v}_{Af}$ and $\vec{v}_{Bf}$ is exactly $90.0^\circ$.
   - Therefore, ball A must deflect at $\theta_A = 90.0^\circ - 30.0^\circ = +60.0^\circ$ relative to the $+x$ axis!
3. **Set Up Velocity Vector Projections:**
   - In the right-triangle formed by the velocity vectors:
     $$v_{Bf} = v_{Ai} \cos(30.0^\circ) = 4.00 \times \frac{\sqrt{3}}{2} \approx 3.4641\text{ m/s}$$
     $$v_{Af} = v_{Ai} \sin(30.0^\circ) = 4.00 \times 0.500 = 2.0000\text{ m/s}$$
4. **Vector Components:**
   - Ball B ($\theta_B = -30.0^\circ$):
     $$\vec{v}_{Bf} = (3.4641 \cos(-30^\circ))\hat{i} + (3.4641 \sin(-30^\circ))\hat{j} = (3.4641 \times 0.8660)\hat{i} - (3.4641 \times 0.500)\hat{j} = (3.00\,\hat{i} - 1.732\,\hat{j})\text{ m/s}$$
   - Ball A ($\theta_A = +60.0^\circ$):
     $$\vec{v}_{Af} = (2.00 \cos(60^\circ))\hat{i} + (2.00 \sin(60^\circ))\hat{j} = (2.00 \times 0.500)\hat{i} + (2.00 \times 0.8660)\hat{j} = (1.00\,\hat{i} + 1.732\,\hat{j})\text{ m/s}$$
5. **Momentum Verification:**
   - Total initial: $\vec{P}_i = 0.170 \times (4.00\,\hat{i}) = 0.680\,\hat{i}\text{ kg}\cdot\text{m/s}$.
   - Total final: $m(\vec{v}_{Af} + \vec{v}_{Bf}) = 0.170 \times [(1.00 + 3.00)\hat{i} + (1.732 - 1.732)\hat{j}] = 0.170 \times 4.00\,\hat{i} = 0.680\,\hat{i}\text{ kg}\cdot\text{m/s}$. (Exact match).
6. **Dot Product Verification:**
   $$\vec{v}_{Af} \cdot \vec{v}_{Bf} = (1.00)(3.00) + (1.732)(-1.732) = 3.00 - 3.00 = 0$$
   $$\mathbf{\vec{v}_{Af} \cdot \vec{v}_{Bf} = 0 \quad (\text{Orthogonal})}$$

---

### Worked Example 7.3: Inelastic Two-Sphere Collision via Normal-Tangential Decomposition
*Sphere 1 ($m_1 = 2.00\text{ kg}$) moving at $\vec{v}_1 = (10.0\,\hat{i})\text{ m/s}$ collides with sphere 2 ($m_2 = 3.00\text{ kg}$) which is initially at rest. At the moment of contact, the unit normal pointing from sphere 1 to sphere 2 is $\hat{n} = 0.800\,\hat{i} + 0.600\,\hat{j}$. The coefficient of restitution is $e = 0.500$. Find the final velocity vectors of both spheres.*

#### Solution
1. **Define Unit Vectors:**
   - Normal: $\hat{n} = (0.800, 0.600)$
   - Tangent (counterclockwise): $\hat{t} = (-0.600, 0.800)$
   - Verify dot product: $\hat{n} \cdot \hat{t} = (0.8)(-0.6) + (0.6)(0.8) = 0$.
2. **Decompose Initial Velocities:**
   - Sphere 1: $\vec{v}_{1i} = (10.0, 0)\text{ m/s}$
     $$v_{1n, i} = \vec{v}_{1i} \cdot \hat{n} = 10.0 \times 0.800 = +8.00\text{ m/s}$$
     $$v_{1t, i} = \vec{v}_{1i} \cdot \hat{t} = 10.0 \times (-0.600) = -6.00\text{ m/s}$$
   - Sphere 2: $\vec{v}_{2i} = (0, 0)\text{ m/s}$
     $$v_{2n, i} = 0, \quad v_{2t, i} = 0$$
3. **Tangential Invariance:**
   $$v_{1t, f} = v_{1t, i} = -6.00\text{ m/s}$$
   $$v_{2t, f} = v_{2t, i} = 0\text{ m/s}$$
4. **Normal 1D Collision with $e = 0.500$:**
   - Mass sum: $m_1 + m_2 = 2.00 + 3.00 = 5.00\text{ kg}$.
   $$v_{1n, f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1n, i} + \frac{(1+e) m_2}{m_1 + m_2} v_{2n, i} = \frac{2.00 - (0.500)(3.00)}{5.00} (8.00) + 0$$
   $$v_{1n, f} = \frac{2.00 - 1.50}{5.00} (8.00) = \frac{0.50}{5.00} \times 8.00 = +0.800\text{ m/s}$$
   $$v_{2n, f} = \frac{(1+e) m_1}{m_1 + m_2} v_{1n, i} + \frac{m_2 - e m_1}{m_1 + m_2} v_{2n, i} = \frac{(1.500)(2.00)}{5.00} (8.00) + 0 = \frac{3.00}{5.00} \times 8.00 = +4.80\text{ m/s}$$
5. **Reconstruct Cartesian Velocity Vectors:**
   - Sphere 1:
     $$\vec{v}_{1f} = v_{1n, f} \hat{n} + v_{1t, f} \hat{t} = 0.800 (0.800\,\hat{i} + 0.600\,\hat{j}) - 6.00 (-0.600\,\hat{i} + 0.800\,\hat{j})$$
     $$v_{1fx} = (0.800 \times 0.800) - (6.00 \times -0.600) = 0.640 + 3.600 = +4.24\text{ m/s}$$
     $$v_{1fy} = (0.800 \times 0.600) - (6.00 \times 0.800) = 0.480 - 4.800 = -4.32\text{ m/s}$$
     $$\mathbf{\vec{v}_{1f} = (4.24\,\hat{i} - 4.32\,\hat{j})\text{ m/s}}$$
   - Sphere 2:
     $$\vec{v}_{2f} = v_{2n, f} \hat{n} + v_{2t, f} \hat{t} = 4.80 (0.800\,\hat{i} + 0.600\,\hat{j}) + 0$$
     $$\mathbf{\vec{v}_{2f} = (3.84\,\hat{i} + 2.88\,\hat{j})\text{ m/s}}$$
6. **Total Momentum Verification:**
   - $\vec{P}_{fx} = m_1 v_{1fx} + m_2 v_{2fx} = 2.00(4.24) + 3.00(3.84) = 8.48 + 11.52 = 20.0\text{ kg}\cdot\text{m/s}$.
   - $\vec{P}_{fy} = m_1 v_{1fy} + m_2 v_{2fy} = 2.00(-4.32) + 3.00(2.88) = -8.64 + 8.64 = 0.00\text{ kg}\cdot\text{m/s}$.
   - $\vec{P}_i = (20.0\,\hat{i})\text{ kg}\cdot\text{m/s}$. Momentum is conserved to machine precision!

---

### Worked Example 7.4: Impact Parameter and Scattering Angles in Hard-Sphere Collisions
*Two identical smooth billiard spheres of radius $R = 3.00\text{ cm}$ and mass $m = 0.160\text{ kg}$ collide. Sphere 2 is at rest. Sphere 1 approaches with speed $v_0 = 5.00\text{ m/s}$ at an impact parameter $b = 3.60\text{ cm}$. Assuming $e = 1.000$, calculate: (a) the collision normal angle $\alpha$, (b) the scattering angle of sphere 1, and (c) the post-collision speed of both spheres.*

#### Solution
1. **Given:**
   - $R_1 = R_2 = R = 0.0300\text{ m} \implies R_1 + R_2 = 0.0600\text{ m}$
   - $b = 0.0360\text{ m}$
   - $v_0 = 5.00\text{ m/s}$
   - $e = 1.000$
2. **Part (a): Find Collision Normal Angle $\alpha$:**
   $$\sin\alpha = \frac{b}{R_1 + R_2} = \frac{0.0360}{0.0600} = 0.6000$$
   $$\alpha = \arcsin(0.6000) \approx 36.870^\circ$$
   $$\cos\alpha = \sqrt{1 - (0.600)^2} = 0.8000$$
3. **Decompose Motion Along Normal and Tangent:**
   - Sphere 2 is pushed purely along the normal $\hat{n}$ because it starts from rest and receives zero tangential impulse:
     $$\mathbf{\theta_2 = -\alpha = -36.87^\circ}$$
   - From the $90^\circ$ theorem, sphere 1 must scatter at:
     $$\mathbf{\theta_1 = 90.00^\circ - 36.87^\circ = +53.13^\circ}$$
4. **Part (c): Speeds:**
   - The normal velocity component of sphere 1 before impact is:
     $$v_{1n, i} = v_0 \cos\alpha = 5.00 \times 0.800 = 4.00\text{ m/s}$$
   - In an identical-mass elastic collision along the normal, velocities exchange completely:
     $$v_{2n, f} = v_{1n, i} = 4.00\text{ m/s}, \quad v_{1n, f} = 0\text{ m/s}$$
   - The tangential component of sphere 1 is:
     $$v_{1t, f} = v_{1t, i} = v_0 \sin\alpha = 5.00 \times 0.600 = 3.00\text{ m/s}$$
   - Final speeds:
     $$\mathbf{v_{2f} = v_{2n, f} = 4.00\text{ m/s}}$$
     $$\mathbf{v_{1f} = \sqrt{v_{1n, f}^2 + v_{1t, f}^2} = \sqrt{0^2 + 3.00^2} = 3.00\text{ m/s}}$$
5. **Kinetic Energy Check:**
   - $K_i = \frac{1}{2}(0.160)(5.00)^2 = 2.00\text{ J}$.
   - $K_f = \frac{1}{2}(0.160)[(3.00)^2 + (4.00)^2] = \frac{1}{2}(0.160)[9 + 16] = \frac{1}{2}(0.160)(25) = 2.00\text{ J}$. Perfectly conserved!

---

### Worked Example 7.5: Corner Bounce (Double Oblique Reflection)
*A steel ball bearing with $e = 0.800$ enters a square corner formed by two perpendicular rigid walls (Wall 1 along the $x$-axis, Wall 2 along the $y$-axis). The ball approaches Wall 1 with velocity $\vec{v}_i = (6.00\,\hat{i} - 8.00\,\hat{j})\text{ m/s}$, strikes Wall 1 first, and then immediately strikes Wall 2. Determine: (a) the velocity vector after the first bounce, (b) the velocity vector after the second bounce, and (c) the total kinetic energy retained by the ball after both bounces.*

#### Solution
1. **Given:**
   - $\vec{v}_i = (6.00\,\hat{i} - 8.00\,\hat{j})\text{ m/s}$
   - $e = 0.800$
2. **First Bounce on Wall 1 ($x$-axis, normal $\hat{n}_1 = +\hat{j}$):**
   - Tangential axis is along $\hat{i} \implies v_{x1} = v_{xi} = +6.00\text{ m/s}$.
   - Normal axis is along $\hat{j} \implies v_{y1} = -e v_{yi} = -(0.800)(-8.00) = +6.40\text{ m/s}$.
   - Post-first bounce velocity:
     $$\mathbf{\vec{v}_1 = (6.00\,\hat{i} + 6.40\,\hat{j})\text{ m/s}}$$
3. **Second Bounce on Wall 2 ($y$-axis, normal $\hat{n}_2 = -\hat{i}$):**
   - The ball travels toward the right and hits Wall 2.
   - Normal axis is along $\hat{i} \implies v_{x2} = -e v_{x1} = -(0.800)(6.00) = -4.80\text{ m/s}$.
   - Tangential axis is along $\hat{j} \implies v_{y2} = v_{y1} = +6.40\text{ m/s}$.
   - Post-second bounce velocity:
     $$\mathbf{\vec{v}_2 = (-4.80\,\hat{i} + 6.40\,\hat{j})\text{ m/s}}$$
4. **Kinetic Energy Fraction:**
   - $v_i^2 = 6.00^2 + (-8.00)^2 = 36.0 + 64.0 = 100.0\text{ m}^2/\text{s}^2$.
   - $v_2^2 = (-4.80)^2 + 6.40^2 = 23.04 + 40.96 = 64.00\text{ m}^2/\text{s}^2$.
   - Energy fraction retained:
     $$\frac{K_2}{K_i} = \frac{v_2^2}{v_i^2} = \frac{64.00}{100.00} = 0.640 = \mathbf{64.0\%}$$
5. **Insight:**
   Notice that $0.640 = e^2 = (0.800)^2$. Because each orthogonal velocity component ($v_x$ and $v_y$) underwent exactly one reflection with restitution $e$, both components were attenuated by a factor of $e$, so the overall speed scaled exactly by $e$!

---

### Worked Example 7.6: Heavy Projectile Maximum Deflection Angle
*A heavy ion of mass $m_1 = 4.00\text{ u}$ (alpha particle) moving at $v_0 = 1.20 \times 10^6\text{ m/s}$ undergoes an elastic collision ($e = 1.000$) with a stationary proton $m_2 = 1.00\text{ u}$. (a) Calculate the theoretical maximum deflection angle $\theta_{1, \max}$ of the alpha particle in the laboratory frame. (b) If the alpha particle scatters at its maximum deflection angle, find its final speed.*

#### Solution
1. **Given:**
   - $m_1 = 4.00\text{ u}$
   - $m_2 = 1.00\text{ u}$
   - $v_0 = 1.20 \times 10^6\text{ m/s}$
   - $e = 1.000$
2. **Part (a): Compute Maximum Deflection Angle:**
   $$\sin(\theta_{1, \max}) = \frac{m_2}{m_1} = \frac{1.00}{4.00} = 0.2500$$
   $$\theta_{1, \max} = \arcsin(0.2500) \approx 14.4775^\circ \approx \mathbf{14.5^\circ}$$
3. **Part (b): Velocity at Maximum Deflection:**
   - In the velocity triangle between $\vec{V}_{\text{CM}}$, $\vec{u}'_{1f}$, and $\vec{v}_{1f}$, maximum deflection occurs when $\vec{v}_{1f}$ is tangent to the circle of radius $u'_{1f}$.
   - This means $\vec{v}_{1f}$ is perpendicular to $\vec{u}'_{1f}$!
   - Center of mass velocity:
     $$V_{\text{CM}} = \frac{m_1}{m_1 + m_2} v_0 = \frac{4.00}{5.00} v_0 = 0.800 v_0$$
   - C-frame speed of particle 1:
     $$u'_{1} = v_0 - V_{\text{CM}} = 0.200 v_0$$
   - From the right triangle:
     $$v_{1f} = \sqrt{V_{\text{CM}}^2 - (u'_{1})^2} = v_0 \sqrt{0.800^2 - 0.200^2} = v_0 \sqrt{0.640 - 0.040} = v_0 \sqrt{0.600}$$
     $$v_{1f} = 1.20 \times 10^6 \times \sqrt{0.600} \approx 1.20 \times 10^6 \times 0.774597 \approx \mathbf{9.30 \times 10^5\text{ m/s}}$$

---

### Worked Example 7.7: Oblique Traffic Accident Reconstruction
*At an intersection, Car A ($m_A = 1200\text{ kg}$) traveling due East at unknown speed $v_A$ collides with Car B ($m_B = 1600\text{ kg}$) traveling due North at $v_B = 15.0\text{ m/s}$. The cars lock together upon impact ($e = 0$) and skid as a single entangled mass. The police accident investigator measures the skid mark direction to be $\theta = 35.0^\circ$ North of East. (a) Determine the initial speed of Car A. (b) Calculate the total kinetic energy dissipated in the crash.*

#### Solution
1. **Given:**
   - $m_A = 1200\text{ kg}$, $\vec{v}_A = v_A \hat{i}$
   - $m_B = 1600\text{ kg}$, $\vec{v}_B = 15.0\,\hat{j}\text{ m/s}$
   - Collision is completely inelastic ($e = 0$) $\implies$ joint velocity $\vec{V}_f = V_f \cos(35^\circ)\hat{i} + V_f \sin(35^\circ)\hat{j}$
2. **Conservation of Linear Momentum:**
   - $x$-axis: $m_A v_A = (m_A + m_B) V_f \cos(35.0^\circ)$
   - $y$-axis: $m_B v_B = (m_A + m_B) V_f \sin(35.0^\circ)$
3. **Divide $y$-equation by $x$-equation:**
   $$\frac{m_B v_B}{m_A v_A} = \frac{\sin(35.0^\circ)}{\cos(35.0^\circ)} = \tan(35.0^\circ)$$
   $$v_A = \frac{m_B v_B}{m_A \tan(35.0^\circ)} = \frac{1600 \times 15.0}{1200 \times \tan(35.0^\circ)} = \frac{24000}{1200 \times 0.700208} = \frac{20.0}{0.700208} \approx \mathbf{28.56\text{ m/s}}$$
   (Equivalent to $\approx 102.8\text{ km/h}$).
4. **Find Final Velocity $V_f$:**
   $$V_f = \frac{m_B v_B}{(m_A + m_B) \sin(35.0^\circ)} = \frac{1600 \times 15.0}{2800 \times 0.573576} = \frac{24000}{1606.01} \approx 14.944\text{ m/s}$$
5. **Part (b): Kinetic Energy Dissipation:**
   - Initial KE:
     $$K_i = \frac{1}{2} m_A v_A^2 + \frac{1}{2} m_B v_B^2 = \frac{1}{2}(1200)(28.563)^2 + \frac{1}{2}(1600)(15.0)^2 = 489,500 + 180,000 = 669,500\text{ J}$$
   - Final KE:
     $$K_f = \frac{1}{2} (m_A + m_B) V_f^2 = \frac{1}{2}(2800)(14.944)^2 = 1400 \times 223.32 = 312,650\text{ J}$$
   - Energy Dissipated:
     $$\Delta K_{\text{loss}} = 669,500 - 312,650 = \mathbf{356,850\text{ J} \approx 3.57 \times 10^5\text{ J}}$$

---

### Worked Example 7.8: Spacecraft 2D Gravitational Slingshot (Planetary Flyby)
*A robotic probe of mass $m = 850\text{ kg}$ approaches Jupiter ($M = 1.90 \times 10^{27}\text{ kg}$) along the $-x$ direction with speed $v_{\infty} = 12.0\text{ km/s}$ relative to the Sun. Jupiter orbits the Sun along the $+y$ direction with orbital speed $V_J = 13.0\text{ km/s}$. The trajectory is designed such that in Jupiter's rest frame, the spacecraft is deflected elastically by $\theta^* = 90.0^\circ$ into the direction of Jupiter's orbital motion ($+y$). Find: (a) the spacecraft's speed in Jupiter's frame, and (b) the spacecraft's final heliocentric speed after exiting Jupiter's sphere of influence.*

#### Solution
1. **Given:**
   - Sun frame: $\vec{v}_i = (-12.0\,\hat{i})\text{ km/s}$, $\vec{V}_J = (+13.0\,\hat{j})\text{ km/s}$
   - In Jupiter's frame, gravitational interaction is conservative $\implies$ elastic scattering ($e = 1.00$).
2. **Transform to Jupiter's Rest Frame:**
   $$\vec{u}_i = \vec{v}_i - \vec{V}_J = -12.0\,\hat{i} - 13.0\,\hat{j}\text{ km/s}$$
   $$u_i = \sqrt{(-12.0)^2 + (-13.0)^2} = \sqrt{144 + 169} = \sqrt{313} \approx \mathbf{17.69\text{ km/s}}$$
3. **Scattering in Jupiter's Frame:**
   - Speed is preserved: $u_f = u_i = 17.69\text{ km/s}$.
   - The probe is turned into the $+y$ direction:
     $$\vec{u}_f = (+17.69\,\hat{j})\text{ km/s}$$
4. **Transform Back to Heliocentric (Sun) Frame:**
   $$\vec{v}_f = \vec{u}_f + \vec{V}_J = 17.69\,\hat{j} + 13.00\,\hat{j} = \mathbf{+30.69\,\hat{j}\text{ km/s}}$$
   $$\mathbf{v_f \approx 30.7\text{ km/s}}$$
5. **Physical Insight:**
   The spacecraft gained $(30.7 - 12.0) = 18.7\text{ km/s}$ of heliocentric speed without firing an engine! The energy was extracted from Jupiter's orbital kinetic energy.

---

### Worked Example 7.9: Oblique Impact with Surface Friction
*A tennis ball of mass $m = 0.058\text{ kg}$ strikes a clay court with speed $v_i = 20.0\text{ m/s}$ at an angle $\theta_i = 45.0^\circ$ to the court surface (so $\theta_i = 45.0^\circ$ to normal). The normal coefficient of restitution is $e = 0.700$. Due to rough clay friction, the tangential impulse is related to the normal impulse by $J_t = \mu_k J_n$, where $\mu_k = 0.300$. Determine: (a) the normal impulse $J_n$, (b) the post-bounce velocity components, and (c) the rebound angle $\theta_r$ relative to the surface.*

#### Solution
1. **Given:**
   - $m = 0.058\text{ kg}$
   - $v_{n, i} = -20.0 \cos(45^\circ) = -14.142\text{ m/s}$
   - $v_{t, i} = +20.0 \sin(45^\circ) = +14.142\text{ m/s}$
   - $e = 0.700$, $\mu_k = 0.300$
2. **Normal Dynamics:**
   $$v_{n, f} = -e v_{n, i} = -(0.700)(-14.142) = \mathbf{+9.899\text{ m/s}}$$
   $$J_n = m(v_{n, f} - v_{n, i}) = 0.058 \times (9.899 - (-14.142)) = 0.058 \times 24.041 \approx \mathbf{1.3944\text{ N}\cdot\text{s}}$$
3. **Tangential Dynamics with Friction:**
   $$J_t = -\mu_k J_n = -(0.300)(1.3944) = -0.4183\text{ N}\cdot\text{s}$$
   $$\Delta v_t = \frac{J_t}{m} = \frac{-0.4183}{0.058} = -7.212\text{ m/s}$$
   $$v_{t, f} = v_{t, i} + \Delta v_t = 14.142 - 7.212 = \mathbf{+6.930\text{ m/s}}$$
4. **Rebound Angle Relative to Court Surface:**
   $$\tan(\phi_r) = \frac{v_{n, f}}{v_{t, f}} = \frac{9.899}{6.930} \approx 1.4284$$
   $$\phi_r = \arctan(1.4284) \approx \mathbf{55.0^\circ}$$
   (The ball bounces steeper relative to the ground because friction slowed its forward progress).

---

### Worked Example 7.10: 2D Multi-Body Glancing Cascade
*On a frictionless air table, disc 1 ($m_1 = 1.00\text{ kg}$) moving at $\vec{v}_1 = (12.0\,\hat{i})\text{ m/s}$ strikes stationary disc 2 ($m_2 = 1.00\text{ kg}$) elastically ($e = 1.00$). The contact normal is oriented at $45.0^\circ$ to the $x$-axis. Immediately after this collision, disc 2 slides forward and strikes stationary disc 3 ($m_3 = 2.00\text{ kg}$) head-on elastically. Find the final velocities of all three discs.*

#### Solution
1. **First Collision (Disc 1 on Disc 2):**
   - Both discs have $m = 1.00\text{ kg}$, $e = 1.00$, disc 2 initially at rest.
   - Normal axis $\hat{n} = \cos(45^\circ)\hat{i} + \sin(45^\circ)\hat{j} = (0.7071, 0.7071)$.
   - Tangent axis $\hat{t} = (-0.7071, 0.7071)$.
   - Initial velocity disc 1: $v_{1n, i} = 12.0 \times 0.7071 = 8.4853\text{ m/s}$, $v_{1t, i} = 12.0 \times (-0.7071) = -8.4853\text{ m/s}$.
   - Because $m_1 = m_2$ and $e = 1.00$, normal velocities exchange:
     $$v_{1n, f} = 0, \quad v_{2n, f} = 8.4853\text{ m/s}$$
     $$v_{1t, f} = v_{1t, i} = -8.4853\text{ m/s}, \quad v_{2t, f} = 0$$
   - Disc 1 final velocity:
     $$\vec{v}_{1f} = v_{1t, f}\hat{t} = -8.4853(-0.7071\,\hat{i} + 0.7071\,\hat{j}) = \mathbf{(6.00\,\hat{i} - 6.00\,\hat{j})\text{ m/s}}$$
   - Disc 2 velocity before hitting disc 3:
     $$\vec{v}_{2} = v_{2n, f}\hat{n} = 8.4853(0.7071\,\hat{i} + 0.7071\,\hat{j}) = (6.00\,\hat{i} + 6.00\,\hat{j})\text{ m/s}$$
     $$v_2 = \sqrt{6^2 + 6^2} = \sqrt{72} \approx 8.4853\text{ m/s}$$
2. **Second Collision (Disc 2 on Disc 3, Head-On Elastic):**
   - $m_2 = 1.00\text{ kg}$, $m_3 = 2.00\text{ kg}$, $v_{3i} = 0$, $e = 1.00$.
   - Using 1D elastic collision formulas along the line of motion of disc 2:
     $$v_{2f} = \frac{m_2 - m_3}{m_2 + m_3} v_2 = \frac{1.00 - 2.00}{3.00} (8.4853) = -\frac{1}{3}(8.4853) = -2.8284\text{ m/s}$$
     $$v_{3f} = \frac{2 m_2}{m_2 + m_3} v_2 = \frac{2(1.00)}{3.00} (8.4853) = +\frac{2}{3}(8.4853) = +5.6569\text{ m/s}$$
   - Converting to Cartesian vectors along the unit vector $\hat{u} = \frac{1}{\sqrt{2}}(\hat{i} + \hat{j})$:
     $$\vec{v}_{2f} = -2.8284 \left(\frac{\hat{i} + \hat{j}}{\sqrt{2}}\right) = \mathbf{(-2.00\,\hat{i} - 2.00\,\hat{j})\text{ m/s}}$$
     $$\vec{v}_{3f} = +5.6569 \left(\frac{\hat{i} + \hat{j}}{\sqrt{2}}\right) = \mathbf{(+4.00\,\hat{i} + 4.00\,\hat{j})\text{ m/s}}$$
3. **Total Momentum Verification:**
   - $\vec{P}_{total} = 1.00(6.00\,\hat{i} - 6.00\,\hat{j}) + 1.00(-2.00\,\hat{i} - 2.00\,\hat{j}) + 2.00(4.00\,\hat{i} + 4.00\,\hat{j})$
   - $P_x = 6.00 - 2.00 + 8.00 = 12.0\text{ kg}\cdot\text{m/s}$.
   - $P_y = -6.00 - 2.00 + 8.00 = 0.00\text{ kg}\cdot\text{m/s}$.
   - Initial was $1.00 \times 12.0\,\hat{i} = 12.0\,\hat{i}\text{ kg}\cdot\text{m/s}$. Exact match!

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 7.1:** Explain physically why the tangential velocity of a smooth sphere remains completely unchanged during an oblique impact with another smooth sphere, even if the normal impact is completely inelastic ($e = 0$).  
**Exercise 7.2:** Under what exact conditions will two colliding particles separate at an angle strictly greater than $90^\circ$ after an elastic collision where one particle was initially stationary?

### Tier 2: Quantitative Mechanics
**Exercise 7.3:** A ball bearing strikes a smooth flat floor at an angle of $60.0^\circ$ to the vertical normal with a speed of $18.0\text{ m/s}$. The coefficient of restitution is $e = 0.750$. Calculate the magnitude of the rebound velocity and the rebound angle relative to the vertical normal.  
**Exercise 7.4:** Two identical pucks on an air hockey table collide elastically. Puck 1 is moving at $6.00\text{ m/s}$ along $+x$, while Puck 2 is at rest. After the collision, Puck 1 moves at $45.0^\circ$ to the $x$-axis. Determine the post-collision speed of both pucks.

### Tier 3: Multi-Stage Dynamics
**Exercise 7.5:** A particle of mass $m_1 = 3.00\text{ kg}$ traveling at $\vec{v}_1 = (8.00\,\hat{i})\text{ m/s}$ strikes particle $m_2 = 1.00\text{ kg}$ traveling at $\vec{v}_2 = (4.00\,\hat{j})\text{ m/s}$. The collision is completely inelastic ($e = 0$). Calculate the final composite velocity vector $\vec{V}_f$ and the mechanical energy lost during the impact.  
**Exercise 7.6:** Two smooth spherical marbles of equal radius $R = 2.00\text{ cm}$ and equal mass $m = 0.050\text{ kg}$ collide. Marble 2 is stationary. Marble 1 moves at $v_0 = 3.00\text{ m/s}$ with an impact parameter $b = 2.00\text{ cm}$. Assuming $e = 0.800$, calculate the final velocity vectors of both marbles in Cartesian coordinates.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 7.7:** A projectile of mass $m_1 = 5.00\text{ kg}$ strikes a stationary target of mass $m_2 = 2.00\text{ kg}$ elastically ($e = 1.00$). Determine the maximum possible laboratory scattering angle $\theta_{1, \max}$ for $m_1$.  
**Exercise 7.8:** A ball rebounds elastically between two parallel vertical walls separated by a distance $W = 4.00\text{ m}$. If the ball is launched from Wall 1 at speed $v_0 = 10.0\text{ m/s}$ at an angle of $30.0^\circ$ above the horizontal floor (into the space between walls), and all wall collisions have $e = 1.00$ while gravity acts downward with $g = 9.80\text{ m/s}^2$, find how many wall bounces occur before the ball hits the floor.

### Tier 5: Olympiad / Research Challenge
**Exercise 7.9:** A sphere of mass $M$ and radius $R$ rests on a frictionless horizontal table. A second identical sphere of mass $M$ and radius $R$ slides toward it at speed $v_0$ with impact parameter $b$. Find an analytical expression for the final kinetic energy of the target sphere as a function of $b$, $R$, and $e$.  
**Exercise 7.10:** Prove analytically that for an oblique collision between two smooth bodies with restitution $e < 1$ where the target is initially stationary and masses are equal ($m_1 = m_2$), the scalar product $\vec{v}_{1f} \cdot \vec{v}_{2f} = \frac{1 - e}{2} v_{2f}^2 \ge 0$, and derive the exact formula for the scattering angle $\theta_{\text{total}} = \theta_1 + \theta_2$ in terms of $e$ and the normal collision angle $\alpha$.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 7.1
Newton's Second Law states that $\frac{d\vec{p}}{dt} = \sum \vec{F}$. In an oblique impact between smooth (frictionless) surfaces, the contact force $\vec{F}_c(t)$ is strictly normal to the tangent plane of contact ($\vec{F}_c \parallel \hat{n}$). Because $\vec{F}_c \cdot \hat{t} = 0$, the net tangential force on each body is identically zero at every instant during the collision. Integrating over the collision duration $\Delta t$, the tangential impulse is:
$$J_t = \int_0^{\Delta t} F_t(t)\,dt = 0$$
By the Impulse-Momentum Theorem, $m \Delta v_t = J_t = 0 \implies v_{tf} = v_{ti}$. This holds regardless of whether the normal deformation is elastic ($e = 1$), inelastic ($0 < e < 1$), or completely plastic ($e = 0$), because the restitution parameter $e$ governs normal restitution only.

---

### Solution to Exercise 7.2
In an elastic collision ($e = 1$) with a stationary target ($\vec{v}_{2i} = \vec{0}$), the dot product of the final velocities is:
$$\vec{v}_{1f} \cdot \vec{v}_{2f} = \frac{m_2 - m_1}{2 m_1} v_{2f}^2$$
For the separation angle $\theta_{\text{total}} = \theta_1 + \theta_2$ to be strictly greater than $90^\circ$ ($\cos\theta_{\text{total}} < 0$), the dot product must be negative:
$$\vec{v}_{1f} \cdot \vec{v}_{2f} < 0 \implies m_2 - m_1 < 0 \implies \mathbf{m_1 < m_2}$$
Thus, an angle greater than $90^\circ$ occurs if and only if the projectile is **lighter** than the target ($m_1 < m_2$). The lighter projectile rebounds into the backward hemisphere.

---

### Solution to Exercise 7.3
1. **Initial Velocities:**
   - $\theta_i = 60.0^\circ$ to normal $\hat{n}$.
   - $v_{n, i} = -18.0 \cos(60.0^\circ) = -18.0 \times 0.500 = -9.00\text{ m/s}$.
   - $v_{t, i} = 18.0 \sin(60.0^\circ) = 18.0 \times 0.866025 = 15.5885\text{ m/s}$.
2. **Post-Bounce Components ($e = 0.750$):**
   - $v_{t, f} = v_{t, i} = 15.5885\text{ m/s}$.
   - $v_{n, f} = -e v_{n, i} = -(0.750)(-9.00) = +6.75\text{ m/s}$.
3. **Rebound Magnitude:**
   $$v_f = \sqrt{v_{t, f}^2 + v_{n, f}^2} = \sqrt{(15.5885)^2 + (6.75)^2} = \sqrt{243.0 + 45.5625} = \sqrt{288.5625} \approx \mathbf{16.99\text{ m/s}}$$
4. **Rebound Angle to Normal:**
   $$\tan\theta_r = \frac{v_{t, f}}{v_{n, f}} = \frac{15.5885}{6.75} \approx 2.3094 \implies \theta_r = \arctan(2.3094) \approx \mathbf{66.6^\circ}$$

---

### Solution to Exercise 7.4
1. **Given:** $m_1 = m_2$, $\vec{v}_{2i} = \vec{0}$, $e = 1.00$, $\theta_1 = 45.0^\circ$.
2. **Apply $90^\circ$ Theorem:**
   - The two identical pucks must scatter at right angles: $\theta_1 + \theta_2 = 90.0^\circ$.
   - Since $\theta_1 = +45.0^\circ$, Puck 2 must scatter at $\theta_2 = -45.0^\circ$.
3. **Compute Speeds:**
   - In the velocity vector triangle:
     $$v_{1f} = v_0 \cos(45.0^\circ) = 6.00 \times \frac{\sqrt{2}}{2} \approx \mathbf{4.24\text{ m/s}}$$
     $$v_{2f} = v_0 \sin(45.0^\circ) = 6.00 \times \frac{\sqrt{2}}{2} \approx \mathbf{4.24\text{ m/s}}$$
   - Both pucks depart at identical speeds of $4.24\text{ m/s}$ along symmetric $45^\circ$ angles.

---

### Solution to Exercise 7.5
1. **Initial Momentum:**
   - $\vec{P}_i = m_1 \vec{v}_1 + m_2 \vec{v}_2 = 3.00(8.00\,\hat{i}) + 1.00(4.00\,\hat{j}) = (24.0\,\hat{i} + 4.00\,\hat{j})\text{ kg}\cdot\text{m/s}$.
2. **Total Mass:**
   - $M = m_1 + m_2 = 3.00 + 1.00 = 4.00\text{ kg}$.
3. **Composite Velocity:**
   $$\vec{V}_f = \frac{\vec{P}_i}{M} = \frac{24.0\,\hat{i} + 4.00\,\hat{j}}{4.00} = \mathbf{(6.00\,\hat{i} + 1.00\,\hat{j})\text{ m/s}}$$
   $$V_f = \sqrt{6.00^2 + 1.00^2} = \sqrt{37.0} \approx 6.0828\text{ m/s}$$
4. **Kinetic Energy Loss:**
   - $K_i = \frac{1}{2}(3.00)(8.00)^2 + \frac{1}{2}(1.00)(4.00)^2 = \frac{1}{2}(3)(64) + \frac{1}{2}(1)(16) = 96.0 + 8.0 = 104.0\text{ J}$.
   - $K_f = \frac{1}{2}(4.00)(37.0) = 74.0\text{ J}$.
   - $\Delta K_{\text{loss}} = 104.0 - 74.0 = \mathbf{30.0\text{ J}}$.

---

### Solution to Exercise 7.6
1. **Geometry of Impact:**
   - $R_1 + R_2 = 0.0200 + 0.0200 = 0.0400\text{ m}$.
   - $b = 0.0200\text{ m}$.
   - $\sin\alpha = \frac{b}{R_1 + R_2} = \frac{0.0200}{0.0400} = 0.500 \implies \alpha = 30.0^\circ$.
   - $\cos\alpha = \frac{\sqrt{3}}{2} \approx 0.8660$.
2. **Unit Vectors:**
   - $\hat{n} = \cos(30^\circ)\hat{i} - \sin(30^\circ)\hat{j} = (0.8660, -0.5000)$.
   - $\hat{t} = \sin(30^\circ)\hat{i} + \cos(30^\circ)\hat{j} = (0.5000, 0.8660)$.
3. **Decompose Initial Velocity ($\vec{v}_{1i} = 3.00\,\hat{i}\text{ m/s}$):**
   - $v_{1n, i} = 3.00 \times 0.8660 = 2.5981\text{ m/s}$.
   - $v_{1t, i} = 3.00 \times 0.5000 = 1.5000\text{ m/s}$.
   - $v_{2n, i} = 0, \quad v_{2t, i} = 0$.
4. **Normal Dynamics with $m_1 = m_2$ and $e = 0.800$:**
   $$v_{1n, f} = \frac{1 - e}{2} v_{1n, i} = \frac{1 - 0.800}{2} (2.5981) = 0.100 \times 2.5981 = +0.2598\text{ m/s}$$
   $$v_{2n, f} = \frac{1 + e}{2} v_{1n, i} = \frac{1 + 0.800}{2} (2.5981) = 0.900 \times 2.5981 = +2.3383\text{ m/s}$$
   $$v_{1t, f} = 1.5000\text{ m/s}, \quad v_{2t, f} = 0$$
5. **Reconstruct Vectors:**
   - Marble 1:
     $$\vec{v}_{1f} = 0.2598(0.8660\,\hat{i} - 0.5000\,\hat{j}) + 1.5000(0.5000\,\hat{i} + 0.8660\,\hat{j})$$
     $$v_{1fx} = (0.2598 \times 0.8660) + (1.5000 \times 0.5000) = 0.2250 + 0.7500 = +0.975\text{ m/s}$$
     $$v_{1fy} = (0.2598 \times -0.5000) + (1.5000 \times 0.8660) = -0.1299 + 1.2990 = +1.169\text{ m/s}$$
     $$\mathbf{\vec{v}_{1f} = (0.975\,\hat{i} + 1.169\,\hat{j})\text{ m/s}}$$
   - Marble 2:
     $$\vec{v}_{2f} = 2.3383(0.8660\,\hat{i} - 0.5000\,\hat{j}) = \mathbf{(2.025\,\hat{i} - 1.169\,\hat{j})\text{ m/s}}$$

---

### Solution to Exercise 7.7
For an elastic collision between a projectile of mass $m_1$ and a stationary target $m_2$ with $m_1 > m_2$:
$$\sin(\theta_{1, \max}) = \frac{m_2}{m_1} = \frac{2.00}{5.00} = 0.4000$$
$$\theta_{1, \max} = \arcsin(0.4000) \approx \mathbf{23.58^\circ \approx 23.6^\circ}$$

---

### Solution to Exercise 7.8
1. **Initial Flight Dynamics:**
   - $v_{0x} = 10.0 \cos(30.0^\circ) = 8.6603\text{ m/s}$ (directed towards Wall 2).
   - $v_{0y} = 10.0 \sin(30.0^\circ) = 5.0000\text{ m/s}$.
2. **Total Time in Air Before Floor Impact:**
   - $y(t) = v_{0y} t - \frac{1}{2} g t^2 = 0 \implies t_{\text{air}} = \frac{2 v_{0y}}{g} = \frac{2 \times 5.000}{9.80} \approx 1.0204\text{ s}$.
3. **Horizontal Motion Between Walls:**
   - The walls are vertical, so elastic wall bounces reverse $v_x \to -v_x$ without changing $|v_x| = 8.6603\text{ m/s}$.
   - Distance between walls $W = 4.00\text{ m}$.
   - Time to reach first wall (Wall 2): $t_1 = \frac{W}{v_{0x}} = \frac{4.00}{8.6603} \approx 0.4619\text{ s}$.
   - Time to rebound and reach Wall 1 again: $t_2 = t_1 + \frac{W}{v_{0x}} = 2 \times 0.4619 = 0.9238\text{ s}$.
   - Time to reach Wall 2 a second time: $t_3 = 3 \times 0.4619 = 1.3856\text{ s}$.
4. **Compare Times:**
   - $t_1 = 0.462\text{ s} < t_{\text{air}}$ (Bounce 1 occurs).
   - $t_2 = 0.924\text{ s} < t_{\text{air}}$ (Bounce 2 occurs).
   - $t_3 = 1.386\text{ s} > t_{\text{air}} = 1.020\text{ s}$ (Hits floor before third bounce).
   - Total wall bounces: $\mathbf{2\text{ bounces}}$.

---

### Solution to Exercise 7.9
1. **Geometry:** $\sin\alpha = \frac{b}{2R}$, $\cos\alpha = \sqrt{1 - \frac{b^2}{4R^2}}$.
2. **Initial Normal Velocity:** $v_{1n, i} = v_0 \cos\alpha$.
3. **Post-Collision Normal Velocity of Target ($M_1 = M_2 = M$):**
   $$v_{2n, f} = \frac{1+e}{2} v_{1n, i} = \frac{1+e}{2} v_0 \cos\alpha$$
4. **Because target receives zero tangential impulse, its total speed is $v_{2f} = v_{2n, f}$:**
   $$K_{2f} = \frac{1}{2} M v_{2f}^2 = \frac{1}{2} M \left[\frac{1+e}{2} v_0 \cos\alpha\right]^2 = \frac{1}{8} M (1+e)^2 v_0^2 \cos^2\alpha$$
5. **Substitute $\cos^2\alpha = 1 - \frac{b^2}{4R^2}$:**
   $$\mathbf{K_{2f}(b) = \frac{1}{8} M (1+e)^2 v_0^2 \left(1 - \frac{b^2}{4R^2}\right)}$$

---

### Solution to Exercise 7.10
1. **Dot Product Proof:**
   - Final velocities:
     $\vec{v}_{1f} = v_{1n, f}\hat{n} + v_{1t, i}\hat{t}$
     $\vec{v}_{2f} = v_{2n, f}\hat{n}$ (since $v_{2t, f} = 0$).
   - Dot product:
     $\vec{v}_{1f} \cdot \vec{v}_{2f} = v_{1n, f} v_{2n, f}$.
   - For $m_1 = m_2$, $v_{1n, f} = \frac{1-e}{2} v_{1n, i}$ and $v_{2n, f} = \frac{1+e}{2} v_{1n, i}$.
   - Therefore:
     $$\vec{v}_{1f} \cdot \vec{v}_{2f} = \left(\frac{1-e}{2} v_{1n, i}\right) v_{2n, f} = \frac{1-e}{1+e} v_{2n, f}^2 \ge 0$$
2. **Scattering Angle:**
   - Sphere 2 moves along the normal $\hat{n} \implies \theta_2 = -\alpha$.
   - For sphere 1:
     $$\tan\theta_1 = \frac{v_{1y, f}}{v_{1x, f}} = \frac{\tan\alpha}{e + (1+e)\tan^2\alpha}$$
   - The total angle $\theta_{\text{total}} = \theta_1 + \alpha$ satisfies:
     $$\mathbf{\tan(\theta_{\text{total}}) = \frac{(1+e)\tan\alpha}{(1-e) - e(1+e)\tan^2\alpha}}$$
   - When $e \to 1$, the denominator approaches 0, yielding $\theta_{\text{total}} \to 90^\circ$!
