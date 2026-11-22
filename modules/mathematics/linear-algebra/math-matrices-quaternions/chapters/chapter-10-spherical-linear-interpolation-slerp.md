# Chapter 10: Spherical Linear Interpolation (SLERP) and Orientation Curves

> *"In flat Euclidean space, a straight line is the shortest distance between two points; on the hyper-surface of the 3-sphere, the shortest path is a great-circle geodesic. To interpolate rotations without velocity wobbles or volume shrinkage, one must leave the tangent plane and glide along the sphere."*

---

## 10.1 The Failure of Euclidean LERP on Quaternions

When animating an object or interpolating physical state between orientation $q_1$ at time $t = 0$ and orientation $q_2$ at time $t = 1$, the most basic mathematical intuition is linear interpolation (LERP):

$$q_{\text{lerp}}(t) = (1 - t)q_1 + t q_2$$

In ordinary vector spaces ($\mathbb{R}^3$), LERP is ideal: it traverses the straight line connecting two position vectors at constant velocity. However, the space of valid spatial rotations is not $\mathbb{R}^4$; it is the unit 3-sphere:

$$\mathbb{S}^3 = \{q \in \mathbb{H} : \|q\|^2 = w^2 + x^2 + y^2 + z^2 = 1\}$$

Applying Euclidean LERP directly to unit quaternions introduces two fatal physical flaws:

### 1. Volume Shrinkage and Length Collapse
A straight line segment connecting two points on a sphere cuts through the interior of the sphere like a chord through an apple:

```
              Arc geodesic on S³ (Unit Length: ||q|| = 1)
                     . - ~ ~ ~ - .
                 .-'       |       '-.
               .'          |          '.
              /     q(t) on chord       \
             /          ---+---          \
            ;          /   |   \          ;
            ;  q₁ ----+----+----+---- q₂  ;   <--- LERP chord: ||q|| < 1
             \         \       /         /
              \         ' - - '         /
               '.                     .'
                 '-.               .-'
                     ' - ~ ~ ~ - '
```

At midpoint $t = 0.5$, the norm of the interpolated vector is:
$$\|q_{\text{lerp}}(0.5)\| = \left\|\frac{q_1 + q_2}{2}\right\| = \cos\frac{\Omega}{2} < 1$$
where $\Omega$ is the angle between $q_1$ and $q_2$ in 4D space. If $\Omega = 90^\circ$, $\|q_{\text{lerp}}(0.5)\| = \cos(45^\circ) = \frac{\sqrt{2}}{2} \approx 0.7071$. If this unnormalized quaternion is converted into a matrix or used to rotate an object, the object will physically shrink by $30\%$ during mid-animation!

### 2. Variable Angular Velocity (Angular Whiplash)
Even if we renormalize after LERP (known as **NLERP**), the chord is traversed at a constant linear speed in 4D, which projects non-linearly onto the curved surface of $\mathbb{S}^3$.
The angular speed $\omega(t) = \frac{d\theta}{dt}$ is not constant:
- It moves slowest near the endpoints ($t = 0$ and $t = 1$).
- It speeds up and moves fastest at the midpoint ($t = 0.5$).
For subtle animations this distortion is barely noticeable, but for cameras, precision robotic arms, and space-telescope pointing maneuvers, this variable angular speed introduces jarring rotational jerks and non-zero angular acceleration spikes.

---

## 10.2 Normalized Linear Interpolation (NLERP)

To prevent volume shrinkage while avoiding trigonometric calls, game engines frequently employ **Normalized LERP (NLERP)**:

$$q_{\text{nlerp}}(t) = \frac{(1 - t)q_1 + t q_2}{\|(1 - t)q_1 + t q_2\|}$$

### Algorithmic Properties:
1. **Commutativity:** Traverses the exact same great-circle arc path as SLERP.
2. **Computational Cost:** Extremely cheap (4 additions, 4 multiplications, 1 inverse square root).
3. **Velocity Distortion:** The maximum angular speed error occurs at $\Omega = 90^\circ$, where the speed deviates by approximately $5.4\%$.
4. **Antipodal Rule:** Just like SLERP, NLERP must enforce the shortest path check ($q_1 \cdot q_2 \ge 0$).

For crowded character crowd simulations or high-frequency ragdoll joints where 10,000 joints are updated per frame, NLERP is the industry standard due to SIMD vectorization. However, when constant angular velocity is physically mandated, we must use **SLERP**.

---

## 10.3 Geometric Derivation of SLERP on $\mathbb{S}^3$

Spherical Linear Interpolation was introduced to computer graphics by Ken Shoemake in his seminal 1985 SIGGRAPH paper *"Animating Rotation with Quaternion Curves"*.

### The 2D Subspace Geometry
Let $q_1, q_2 \in \mathbb{S}^3$ be two unit quaternions. They span a 2D plane inside $\mathbb{R}^4$. The intersection of this 2D plane with the 3-sphere $\mathbb{S}^3$ is a 1D unit circle (a great circle).

The angle $\Omega$ separating $q_1$ and $q_2$ on this great circle is given by the 4D dot product:
$$\cos\Omega = q_1 \cdot q_2 = w_1 w_2 + x_1 x_2 + y_1 y_2 + z_1 z_2$$

We want to find a unit quaternion $q(t)$ that lies on this great circle such that the angle from $q_1$ to $q(t)$ is exactly $t\Omega$, and the angle from $q(t)$ to $q_2$ is $(1 - t)\Omega$.

```
                    q₂
                   /|
                  / |
                 /  |
          q(t)  /   |
           \   /    |
            \ /     |
       tΩ    \      |
      .-------.     |
     /         \    |  sin(tΩ)
    / (1-t)Ω    \   |
   /             \  |
  q₁ ─────────────┴─┘
         cos(tΩ)
```

Because $q(t)$ lies in the plane spanned by $\{q_1, q_2\}$, it can be expressed as a linear combination:
$$q(t) = a(t)q_1 + b(t)q_2$$

Take the dot product of $q(t)$ with $q_1$:
$$q(t) \cdot q_1 = \cos(t\Omega)$$
Substituting the linear combination:
$$(a(t)q_1 + b(t)q_2) \cdot q_1 = a(t)(q_1 \cdot q_1) + b(t)(q_2 \cdot q_1) = a(t)(1) + b(t)\cos\Omega = \cos(t\Omega)$$
$$\implies a(t) + b(t)\cos\Omega = \cos(t\Omega) \quad \text{--- (Equation 1)}$$

Next, construct an orthonormal vector $\hat{q}_2^\perp$ in the plane perpendicular to $q_1$ using Gram-Schmidt:
$$\hat{q}_2^\perp = \frac{q_2 - (q_2 \cdot q_1)q_1}{\|q_2 - (q_2 \cdot q_1)q_1\|} = \frac{q_2 - q_1 \cos\Omega}{\sin\Omega}$$

In the orthonormal basis $\{q_1, \hat{q}_2^\perp\}$, the vector $q(t)$ rotated by angle $t\Omega$ from $q_1$ is simply:
$$q(t) = q_1 \cos(t\Omega) + \hat{q}_2^\perp \sin(t\Omega)$$

Substitute $\hat{q}_2^\perp$:
$$q(t) = q_1 \cos(t\Omega) + \left(\frac{q_2 - q_1 \cos\Omega}{\sin\Omega}\right)\sin(t\Omega)$$
$$q(t) = q_1 \left[\cos(t\Omega) - \frac{\cos\Omega \sin(t\Omega)}{\sin\Omega}\right] + q_2 \left[\frac{\sin(t\Omega)}{\sin\Omega}\right]$$

Now combine the bracketed coefficient for $q_1$ over the common denominator $\sin\Omega$:
$$\frac{\sin\Omega \cos(t\Omega) - \cos\Omega \sin(t\Omega)}{\sin\Omega} = \frac{\sin(\Omega - t\Omega)}{\sin\Omega} = \frac{\sin((1 - t)\Omega)}{\sin\Omega}$$

This delivers Shoemake's closed-form formula for **SLERP**:

$$\text{SLERP}(q_1, q_2; t) = \frac{\sin((1 - t)\Omega)}{\sin\Omega} q_1 + \frac{\sin(t\Omega)}{\sin\Omega} q_2$$

where $\Omega = \arccos(q_1 \cdot q_2)$.

### Proof of Constant Angular Velocity
Let us calculate the angular rate of change. The angle swept along the arc is:
$$\theta(t) = t\Omega \implies \frac{d\theta}{dt} = \Omega = \text{constant}$$
The physical angular velocity magnitude $\omega = 2\left\|\frac{dq}{dt}\right\| = 2\Omega$ is rigorously constant across the entire interval $t \in [0, 1]$.

---

## 10.4 The Shortest-Path Antipodal Flip

Because unit quaternions form a double cover of $SO(3)$ ($\text{Spin}(3) \to SO(3)$), the quaternions $q_2$ and $-q_2$ correspond to the exact same physical orientation in 3D space:
$$\mathbf{R}(q_2) \equiv \mathbf{R}(-q_2)$$

However, on the 3-sphere $\mathbb{S}^3$, $q_2$ and $-q_2$ are antipodal points separated by an angular distance of $\pi$ radians ($180^\circ$).

If an orientation keyframe happens to have $q_1 \cdot q_2 < 0$, the angle $\Omega$ between them in $\mathbb{S}^3$ is greater than $90^\circ$ (i.e., $\Omega \in (\frac{\pi}{2}, \pi]$).
If we interpolate directly from $q_1$ to $q_2$:
- The quaternion takes the "long way around" the 3-sphere.
- In 3D space, this causes the object to execute a violent, disorienting $360^\circ$ rotation rather than a gentle short-arc adjustment.

```
       q₁ (Dot < 0) ─────────────────────────── -q₂ (Shortest Path: Arc < 90°)
             \                                    /
              \                                  /
               \                                /
                \                              /
                 ─────── Long Path (> 90°) ─── q₂
```

### The Bulletproof Antipodal Safeguard
Before evaluating $\Omega$ or any sines, compute the 4D dot product:
$$\cos\Omega = q_1 \cdot q_2$$
If $\cos\Omega < 0$:
$$q_2 \leftarrow -q_2$$
$$\cos\Omega \leftarrow -\cos\Omega$$

This flips $q_2$ to the same hemisphere as $q_1$, guaranteeing that $\cos\Omega \ge 0$, which restricts $\Omega \in [0, \frac{\pi}{2}]$ ($0^\circ \le \Omega \le 90^\circ$). The resulting interpolation is guaranteed to be the absolute **shortest rotational arc**.

---

## 10.5 Small-Angle Threshold and Numerical Safeguards

When $q_1$ and $q_2$ represent nearly identical orientations, $\Omega \to 0$:
$$\cos\Omega \to 1.0 \implies \sin\Omega \to 0$$
Evaluating $\frac{\sin((1-t)\Omega)}{\sin\Omega}$ results in the indeterminate form $\frac{0}{0}$, triggering catastrophic floating-point cancellation and returning `NaN`.

### The Critical Threshold Fallback
When $\cos\Omega > 0.9995$ (corresponding to an angular separation $\Omega < 1.8^\circ$):
1. The curvature of the sphere over this infinitesimal arc is virtually flat.
2. The speed difference between SLERP and LERP over $1.8^\circ$ is less than $0.0001\%$.
3. We immediately fall back to **LERP followed by normalization (NLERP)**:

$$\text{SLERP}(q_1, q_2; t) \approx \text{normalize}((1 - t)q_1 + t q_2) \quad \text{for } \cos\Omega > 0.9995$$

This avoids calculating $\arccos$, two $\sin$ calls, and an unstable division, saving ~80 CPU cycles while maintaining sub-millimeter precision.

---

## 10.6 SQUAD: Spherical Cubic Splines for Smooth Animation

When interpolating across a sequence of orientation keyframes $\{q_0, q_1, q_2, \dots, q_n\}$, chaining pairwise SLERPs creates a piecewise curve that is continuous ($C^0$), but whose first derivative (angular velocity) has sharp discontinuities at each keyframe. An aircraft or camera interpolating via chained SLERP will jerk abruptly at every waypoint.

To achieve continuous angular velocity ($C^1$ smoothness), Ken Shoemake developed **SQUAD (Spherical and Quadrangle Spline)**, the rotational equivalent of a cubic Bézier / Hermite spline.

### SQUAD Definition
For an interval $t \in [0, 1]$ between keyframe $q_i$ and $q_{i+1}$, SQUAD uses two intermediate quaternionic control points $s_i$ and $s_{i+1}$:

$$\text{SQUAD}(q_i, q_{i+1}, s_i, s_{i+1}; t) = \text{SLERP}\Big(\text{SLERP}(q_i, q_{i+1}; t), \; \text{SLERP}(s_i, s_{i+1}; t); \; 2t(1 - t)\Big)$$

### Construction of Control Points $s_i$:
The control point $s_i$ acts as a tangent handle at $q_i$, computed using the quaternionic logarithm and exponential maps:

$$s_i = q_i \exp\left( - \frac{\ln(q_i^{-1} q_{i-1}) + \ln(q_i^{-1} q_{i+1})}{4} \right)$$

where:
$$\ln(q) = \ln(w, \mathbf{v}) = (0, \hat{\mathbf{n}}\theta) = \left(0, \frac{\mathbf{v}}{\|\mathbf{v}\|}\arccos(w)\right)$$
$$\exp(0, \mathbf{u}) = (\cos\|\mathbf{u}\|, \hat{\mathbf{u}}\sin\|\mathbf{u}\|)$$

SQUAD guarantees that the orientation path has seamless, continuous angular acceleration throughout the multi-waypoint flight path.

---

## 10.7 10 Step-by-Step Worked Examples

### Worked Example 10.1: Hand Calculation of SLERP at Midpoint ($t = 0.5$)
**Problem:** Let $q_1 = (1, 0, 0, 0)$ and $q_2 = (0, 1, 0, 0)$. Compute $\text{SLERP}(q_1, q_2; 0.5)$.
**Solution:**
1. Dot product:
   $$q_1 \cdot q_2 = (1)(0) + (0)(1) + (0)(0) + (0)(0) = 0$$
   $\cos\Omega = 0 \implies \Omega = \frac{\pi}{2} = 90^\circ$.
2. Check shortest path: $\cos\Omega \ge 0$, no flip needed.
3. Compute $\sin\Omega$: $\sin(\pi/2) = 1$.
4. At $t = 0.5$:
   $$(1 - t)\Omega = 0.5 \times \frac{\pi}{2} = \frac{\pi}{4}$$
   $$t\Omega = 0.5 \times \frac{\pi}{2} = \frac{\pi}{4}$$
   $$\sin\frac{\pi}{4} = \frac{\sqrt{2}}{2} \approx 0.7071068$$
5. Evaluate weights:
   $$w_1 = \frac{\sin((1-t)\Omega)}{\sin\Omega} = \frac{\sqrt{2}/2}{1} = \frac{\sqrt{2}}{2}$$
   $$w_2 = \frac{\sin(t\Omega)}{\sin\Omega} = \frac{\sqrt{2}/2}{1} = \frac{\sqrt{2}}{2}$$
6. Assembled quaternion:
   $$q(0.5) = \frac{\sqrt{2}}{2}(1, 0, 0, 0) + \frac{\sqrt{2}}{2}(0, 1, 0, 0) = \left(\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}, 0, 0\right)$$
7. Norm check:
   $$\|q(0.5)\|^2 = \left(\frac{\sqrt{2}}{2}\right)^2 + \left(\frac{\sqrt{2}}{2}\right)^2 = 0.5 + 0.5 = 1.0$$
   Notice that Euclidean LERP would give $(0.5, 0.5, 0, 0)$ with norm $\sqrt{0.5} \approx 0.7071$!

---

### Worked Example 10.2: Shortest-Path Antipodal Inversion
**Problem:** Let $q_1 = (0.707107, 0.707107, 0, 0)$ and $q_2 = (-0.707107, 0.707107, 0, 0)$. Calculate $\text{SLERP}(q_1, q_2; 0.5)$ with and without the antipodal check.
**Solution:**
1. Dot product:
   $$q_1 \cdot q_2 = (0.707107)(-0.707107) + (0.707107)(0.707107) = -0.5 + 0.5 = 0$$
   Wait, let's adjust components so dot product is strictly negative:
   Let $q_1 = (0.9, 0.43589, 0, 0)$ and $q_2 = (-0.8, -0.6, 0, 0)$.
   $$q_1 \cdot q_2 = (0.9)(-0.8) + (0.43589)(-0.6) = -0.72 - 0.26153 = -0.98153 < 0$$
2. Without antipodal check:
   $\cos\Omega = -0.98153 \implies \Omega = \arccos(-0.98153) \approx 2.95\text{ rad} \approx 169.0^\circ$.
   The interpolation travels across an arc of $169^\circ$ through 4D space, spinning the object almost full-circle.
3. With antipodal check:
   Since $q_1 \cdot q_2 < 0$, replace $q_2$ with $-q_2 = (0.8, 0.6, 0, 0)$.
   New dot product: $\cos\Omega = +0.98153$.
   New arc angle: $\Omega = \arccos(0.98153) \approx 0.1925\text{ rad} \approx 11.0^\circ$.
4. Result: The object smoothly rotates through a small $11^\circ$ adjustment rather than executing a disorienting $169^\circ$ loop.

---

### Worked Example 10.3: SLERP at Arbitrary Time $t = 0.25$
**Problem:** Given $q_1 = (1, 0, 0, 0)$ and $q_2 = (0, 0, 1, 0)$ ($180^\circ$ rotation about $Y$). Compute $\text{SLERP}(q_1, q_2; 0.25)$.
**Solution:**
1. Dot product: $q_1 \cdot q_2 = 0 \implies \Omega = \frac{\pi}{2}$.
2. $\sin\Omega = \sin(\pi/2) = 1$.
3. At $t = 0.25$:
   $$(1 - t)\Omega = 0.75 \times \frac{\pi}{2} = \frac{3\pi}{8} \approx 1.1781\text{ rad}$$
   $$t\Omega = 0.25 \times \frac{\pi}{2} = \frac{\pi}{8} \approx 0.3927\text{ rad}$$
4. Sines:
   $$\sin\frac{3\pi}{8} = \cos\frac{\pi}{8} \approx 0.923880$$
   $$\sin\frac{\pi}{8} \approx 0.382683$$
5. Weights:
   $$w_1 = \frac{0.923880}{1} = 0.923880, \quad w_2 = \frac{0.382683}{1} = 0.382683$$
6. Result:
   $$q(0.25) = (0.923880, 0, 0.382683, 0)$$
7. Physical interpretation:
   $w = \cos(45^\circ / 2) = \cos(22.5^\circ) = 0.923880$.
   $y = \sin(45^\circ / 2) = \sin(22.5^\circ) = 0.382683$.
   This represents a rotation of $45^\circ$ about the $Y$-axis, exactly $25\%$ of the $180^\circ$ journey!

---

### Worked Example 10.4: Comparing Angular Speeds of LERP vs SLERP
**Problem:** Consider $q_1 = (1, 0, 0, 0)$ and $q_2 = (0, 1, 0, 0)$ ($\Omega = 90^\circ$). Derive the analytical angular speed $\omega(t) = \frac{d\theta}{dt}$ for NLERP and compare it to SLERP at $t = 0$ and $t = 0.5$.
**Solution:**
1. For SLERP:
   $$\theta(t) = 2 \times (t \times 45^\circ) = 90^\circ t \implies \omega_{\text{slerp}}(t) = 90^\circ/\text{s} = \text{constant}$$
2. For NLERP:
   $$q(t) = \frac{(1 - t, t, 0, 0)}{\sqrt{(1 - t)^2 + t^2}}$$
   The rotation angle $\theta(t)$ has $w(t) = \cos\frac{\theta(t)}{2} = \frac{1 - t}{\sqrt{1 - 2t + 2t^2}}$.
   Thus $\tan\frac{\theta(t)}{2} = \frac{t}{1 - t}$.
   Differentiating with respect to $t$:
   $$\frac{1}{2}\sec^2\left(\frac{\theta}{2}\right)\frac{d\theta}{dt} = \frac{(1 - t)(1) - t(-1)}{(1 - t)^2} = \frac{1}{(1 - t)^2}$$
   Using $\sec^2(\theta/2) = 1 + \tan^2(\theta/2) = 1 + \frac{t^2}{(1 - t)^2} = \frac{(1 - t)^2 + t^2}{(1 - t)^2}$:
   $$\frac{1}{2} \left[\frac{(1 - t)^2 + t^2}{(1 - t)^2}\right] \frac{d\theta}{dt} = \frac{1}{(1 - t)^2}$$
   $$\frac{d\theta}{dt} = \frac{2}{(1 - t)^2 + t^2} = \frac{2}{1 - 2t + 2t^2}$$
3. Evaluating $\omega_{\text{nlerp}}(t)$:
   - At $t = 0$: $\omega(0) = \frac{2}{1} = 2.0\text{ rad/s} \approx 114.59^\circ/\text{s}$.
   - At $t = 0.5$: $\omega(0.5) = \frac{2}{1 - 1 + 0.5} = \frac{2}{0.5} = 4.0\text{ rad/s} \approx 229.18^\circ/\text{s}$.
4. Conclusion: In NLERP, the angular speed at the midpoint is **twice as fast** as at the endpoints, creating significant rotational acceleration/deceleration wobbles!

---

### Worked Example 10.5: Small-Angle Fallback Execution
**Problem:** Two quaternions from a high-speed $240\text{ Hz}$ physics simulation are:
$$q_1 = (0.9999995, 0.001, 0, 0), \quad q_2 = (0.9999990, 0.001414, 0, 0)$$
Compute their dot product, evaluate the threshold condition, and compute the interpolated quaternion at $t = 0.5$.
**Solution:**
1. Dot product:
   $$q_1 \cdot q_2 = (0.9999995)(0.9999990) + (0.001)(0.001414) = 0.9999985 + 0.0000014 = 0.9999999$$
2. Since $\cos\Omega = 0.9999999 > 0.9995$, the small-angle safeguard triggers.
3. Compute LERP:
   $$q_{\text{lerp}} = 0.5 q_1 + 0.5 q_2 = (0.99999925, 0.001207, 0, 0)$$
4. Renormalize:
   $$\|q_{\text{lerp}}\|^2 = (0.99999925)^2 + (0.001207)^2 = 0.9999985 + 0.00000146 = 0.99999996$$
   $$\|q_{\text{lerp}}\| \approx 0.99999998$$
   $$q(0.5) \approx (0.99999927, 0.001207, 0, 0)$$
5. This avoided an unstable $\sin\Omega \approx 0.0004$ division and produced an exact physical result.

---

### Worked Example 10.6: Interpolating Between Non-Trivial 3D Rotations
**Problem:** Let $q_1$ be a $90^\circ$ rotation about $\hat{\mathbf{x}}$, and $q_2$ be a $90^\circ$ rotation about $\hat{\mathbf{y}}$. Find $\text{SLERP}(q_1, q_2; 0.5)$.
**Solution:**
1. Quaternions:
   $$q_1 = \left(\cos 45^\circ, \sin 45^\circ, 0, 0\right) = \left(\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}, 0, 0\right)$$
   $$q_2 = \left(\cos 45^\circ, 0, \sin 45^\circ, 0\right) = \left(\frac{\sqrt{2}}{2}, 0, \frac{\sqrt{2}}{2}, 0\right)$$
2. Dot product:
   $$q_1 \cdot q_2 = \left(\frac{\sqrt{2}}{2}\right)\left(\frac{\sqrt{2}}{2}\right) + 0 + 0 + 0 = 0.5$$
   $\cos\Omega = 0.5 \implies \Omega = 60^\circ = \frac{\pi}{3}$.
3. Sines:
   $$\sin\Omega = \sin 60^\circ = \frac{\sqrt{3}}{2} \approx 0.866025$$
   At $t = 0.5$:
   $$(1 - t)\Omega = t\Omega = 30^\circ$$
   $$\sin 30^\circ = 0.5$$
4. Weights:
   $$w_1 = w_2 = \frac{\sin 30^\circ}{\sin 60^\circ} = \frac{0.5}{\sqrt{3}/2} = \frac{1}{\sqrt{3}} \approx 0.577350$$
5. Interpolated quaternion:
   $$q(0.5) = \frac{1}{\sqrt{3}} q_1 + \frac{1}{\sqrt{3}} q_2 = \frac{1}{\sqrt{3}}\left(\sqrt{2}, \frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}, 0\right) = \left(\frac{\sqrt{6}}{3}, \frac{\sqrt{6}}{6}, \frac{\sqrt{6}}{6}, 0\right)$$
   In decimals: $q(0.5) \approx (0.816497, 0.408248, 0.408248, 0)$.
6. Norm check:
   $$0.816497^2 + 0.408248^2 + 0.408248^2 = 0.666667 + 0.166667 + 0.166667 = 1.00000$$

---

### Worked Example 10.7: SQUAD Control Point Calculation
**Problem:** Given three sequential keyframe quaternions $q_{i-1} = (1, 0, 0, 0)$, $q_i = (0.7071, 0.7071, 0, 0)$, and $q_{i+1} = (0, 1, 0, 0)$. Compute the intermediate tangent quaternion $s_i$.
**Solution:**
1. Compute relative quaternions:
   $$q_i^{-1} = q_i^* = (0.7071, -0.7071, 0, 0)$$
   $$q_i^{-1} q_{i-1} = (0.7071, -0.7071, 0, 0)(1, 0, 0, 0) = (0.7071, -0.7071, 0, 0)$$
   $$q_i^{-1} q_{i+1} = (0.7071, -0.7071, 0, 0)(0, 1, 0, 0) = (0 + 0.7071, 0.7071, 0, 0) = (0.7071, 0.7071, 0, 0)$$
2. Quaternionic logarithms:
   For $q = (w, \mathbf{v})$, $\ln(q) = (0, \hat{\mathbf{n}}\theta)$ where $\theta = \arccos(w)$.
   For $q_i^{-1} q_{i-1}$: $w = 0.7071 \implies \theta = \pi/4$, $\hat{\mathbf{n}} = (-1, 0, 0)$.
   $$\ln(q_i^{-1} q_{i-1}) = (0, -\pi/4, 0, 0)$$
   For $q_i^{-1} q_{i+1}$: $w = 0.7071 \implies \theta = \pi/4$, $\hat{\mathbf{n}} = (+1, 0, 0)$.
   $$\ln(q_i^{-1} q_{i+1}) = (0, +\pi/4, 0, 0)$$
3. Sum the logarithms:
   $$\ln(q_i^{-1} q_{i-1}) + \ln(q_i^{-1} q_{i+1}) = (0, 0, 0, 0)$$
4. Exponential:
   $$\exp\left(-\frac{(0, 0, 0, 0)}{4}\right) = \exp(0) = (1, 0, 0, 0)$$
5. Tangent control point:
   $$s_i = q_i \exp(0) = q_i = (0.7071, 0.7071, 0, 0)$$
   This confirms that when angular velocities entering and leaving a keyframe are symmetric and colinear, the tangent handle aligns identically with the keyframe.

---

### Worked Example 10.8: Camera Orientation Blending in a Game Engine
**Problem:** A third-person camera transitions from follow mode $q_{\text{cam}} = (0.92388, 0, 0.38268, 0)$ to aim mode $q_{\text{aim}} = (0.70711, 0, 0.70711, 0)$ over $\tau = 0.25\text{ seconds}$ at $60\text{ FPS}$ (15 frames). Compute the orientation at frame 5 ($t = 5/15 = 1/3$).
**Solution:**
1. Dot product:
   $$\cos\Omega = (0.92388)(0.70711) + (0.38268)(0.70711) = 0.65328 + 0.27060 = 0.92388$$
   $\Omega = \arccos(0.92388) \approx 0.3927\text{ rad} = 22.5^\circ$.
2. $\sin\Omega = \sin(22.5^\circ) \approx 0.38268$.
3. At $t = 1/3$:
   $$(1 - t)\Omega = \frac{2}{3}(22.5^\circ) = 15.0^\circ$$
   $$t\Omega = \frac{1}{3}(22.5^\circ) = 7.5^\circ$$
   $$\sin(15.0^\circ) \approx 0.25882, \quad \sin(7.5^\circ) \approx 0.13053$$
4. Weights:
   $$w_1 = \frac{0.25882}{0.38268} \approx 0.67633, \quad w_2 = \frac{0.13053}{0.38268} \approx 0.34110$$
5. Interpolate:
   $$w = 0.67633(0.92388) + 0.34110(0.70711) = 0.62485 + 0.24119 = 0.86604$$
   $$y = 0.67633(0.38268) + 0.34110(0.70711) = 0.25881 + 0.24119 = 0.50000$$
   $$q(1/3) = (0.86604, 0, 0.50000, 0)$$
6. Physical angle:
   $w = \cos(30^\circ/2) = \cos(15^\circ) \approx 0.9659$? Wait: $w = 0.86604 = \cos(30^\circ) \implies \theta = 60^\circ$?
   Notice initial rotation was $2 \times \arccos(0.92388) = 45^\circ$, target was $2 \times \arccos(0.70711) = 90^\circ$.
   At $t = 1/3$, the angle should be $45^\circ + \frac{1}{3}(45^\circ) = 60^\circ$.
   Half-angle is $30^\circ$.
   $w = \cos(30^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$, $y = \sin(30^\circ) = 0.50000$.
   Exact mathematical match!

---

### Worked Example 10.9: Extrapolating Beyond $t > 1$ with SLERP
**Problem:** In a network multiplayer prediction algorithm, client receives $q(t_0)$ and $q(t_1)$. Can SLERP extrapolate orientation forward to $t = 1.2$ during packet loss?
**Solution:**
1. The mathematical definition of SLERP:
   $$\text{SLERP}(q_1, q_2; t) = \frac{\sin((1-t)\Omega)}{\sin\Omega} q_1 + \frac{\sin(t\Omega)}{\sin\Omega} q_2$$
   is analytically valid for **any** real scalar $t \in \mathbb{R}$, including $t > 1$ or $t < 0$.
2. For $t = 1.2$:
   $$(1 - t)\Omega = -0.2\Omega \implies \sin(-0.2\Omega) = -\sin(0.2\Omega)$$
   $$t\Omega = 1.2\Omega$$
3. As long as $t\Omega < \pi$, $q(t)$ continues along the same great circle at the same constant angular velocity $\Omega$.
4. Caution: If packet loss persists and $t\Omega \ge \pi$, the extrapolated quaternion wraps past $180^\circ$ and begins spinning indefinitely. Modern network prediction engines clamp extrapolation to $t \le 1.25$ ($50\text{ ms}$).

---

### Worked Example 10.10: SIMD-Optimized Approximation of SLERP
**Problem:** In performance-critical shader code where $\arccos$ and $\sin$ are too slow, how can SLERP be approximated using polynomial minimax approximations?
**Solution:**
1. The Taylor expansion of $\frac{\sin(t\Omega)}{\sin\Omega}$ around $\Omega \to 0$ is:
   $$\frac{\sin(t\Omega)}{\sin\Omega} \approx t + \frac{t(1 - t^2)}{6}\Omega^2 + O(\Omega^4)$$
2. Since $\cos\Omega = q_1 \cdot q_2$, we have $\Omega^2 \approx 2(1 - \cos\Omega)$ for small $\Omega$.
3. Replacing $\Omega^2$ in the Taylor series yields an ultra-fast cubic polynomial approximation that avoids all trigonometric calls while achieving $< 0.01^\circ$ precision for $\Omega < 45^\circ$:
   $$w_2(t) \approx t + \frac{t(1 - t^2)}{3}(1 - q_1 \cdot q_2)$$
   $$w_1(t) \approx (1 - t) + \frac{(1 - t)(1 - (1 - t)^2)}{3}(1 - q_1 \cdot q_2)$$
4. Renormalizing the resulting quaternion provides near-SLERP quality at NLERP execution speed.

---

## 10.8 10 Granular Solved Exercises

### Exercise 10.1
**Problem:** Given $q_1 = (1, 0, 0, 0)$ and $q_2 = (0.5, 0.5, 0.5, 0.5)$, compute $\Omega$ and evaluate $\text{SLERP}(q_1, q_2; 0.5)$.
**Solution:**
1. $\cos\Omega = q_1 \cdot q_2 = 1(0.5) = 0.5 \implies \Omega = \arccos(0.5) = 60^\circ = \frac{\pi}{3}$.
2. $\sin\Omega = \sin(60^\circ) = \frac{\sqrt{3}}{2}$.
3. At $t = 0.5$, $(1-t)\Omega = t\Omega = 30^\circ \implies \sin(30^\circ) = 0.5$.
4. Weights: $w_1 = w_2 = \frac{0.5}{\sqrt{3}/2} = \frac{1}{\sqrt{3}}$.
5. Interpolation:
   $$q(0.5) = \frac{1}{\sqrt{3}}(1, 0, 0, 0) + \frac{1}{\sqrt{3}}(0.5, 0.5, 0.5, 0.5) = \frac{1}{\sqrt{3}}(1.5, 0.5, 0.5, 0.5)$$
6. Decimal form:
   $$q(0.5) \approx (0.866025, 0.288675, 0.288675, 0.288675)$$
7. Norm check:
   $$0.866025^2 + 3(0.288675^2) = 0.75 + 3(0.083333) = 0.75 + 0.25 = 1.00000$$.

---

### Exercise 10.2
**Problem:** Prove that $\text{SLERP}(q_1, q_2; 0) = q_1$ and $\text{SLERP}(q_1, q_2; 1) = q_2$.
**Solution:**
1. At $t = 0$:
   $$w_1 = \frac{\sin((1 - 0)\Omega)}{\sin\Omega} = \frac{\sin\Omega}{\sin\Omega} = 1$$
   $$w_2 = \frac{\sin(0 \cdot \Omega)}{\sin\Omega} = \frac{0}{\sin\Omega} = 0$$
   $$\text{SLERP}(q_1, q_2; 0) = 1 \cdot q_1 + 0 \cdot q_2 = q_1$$
2. At $t = 1$:
   $$w_1 = \frac{\sin((1 - 1)\Omega)}{\sin\Omega} = \frac{\sin 0}{\sin\Omega} = 0$$
   $$w_2 = \frac{\sin(1 \cdot \Omega)}{\sin\Omega} = \frac{\sin\Omega}{\sin\Omega} = 1$$
   $$\text{SLERP}(q_1, q_2; 1) = 0 \cdot q_1 + 1 \cdot q_2 = q_2$$.

---

### Exercise 10.3
**Problem:** Show that $\text{SLERP}(q_1, q_2; t) = \text{SLERP}(q_2, q_1; 1 - t)$ (symmetry property).
**Solution:**
1. Substitute $q_2$ in place of $q_1$, $q_1$ in place of $q_2$, and $1 - t$ in place of $t$:
   $$\text{SLERP}(q_2, q_1; 1 - t) = \frac{\sin((1 - (1 - t))\Omega)}{\sin\Omega} q_2 + \frac{\sin((1 - t)\Omega)}{\sin\Omega} q_1$$
   $$= \frac{\sin(t\Omega)}{\sin\Omega} q_2 + \frac{\sin((1 - t)\Omega)}{\sin\Omega} q_1$$
   $$= \frac{\sin((1 - t)\Omega)}{\sin\Omega} q_1 + \frac{\sin(t\Omega)}{\sin\Omega} q_2 = \text{SLERP}(q_1, q_2; t)$$
2. Thus SLERP is strictly invariant under reversal of endpoints and time parameter.

---

### Exercise 10.4
**Problem:** Explain why linearly interpolating Euler angles $(\psi(t), \theta(t), \phi(t)) = (1-t)\mathbf{e}_1 + t\mathbf{e}_2$ can cause an aircraft to tilt violently when rolling through $180^\circ$.
**Solution:**
1. Euler angles wrap modulo $2\pi$ (or $[-\pi, \pi]$).
2. If Roll at $t = 0$ is $+179^\circ$ and Roll at $t = 1$ is $-179^\circ$, the actual physical angular distance is only $2^\circ$.
3. Direct linear interpolation evaluates:
   $$\phi(t) = (1 - t)(179^\circ) + t(-179^\circ) = 179^\circ - 358^\circ t$$
4. At $t = 0.5$, $\phi(0.5) = 0^\circ$. The aircraft rolls $179^\circ$ through inverted orientation and back, executing a full catastrophic $358^\circ$ barrel roll instead of a $2^\circ$ adjustment.
5. In contrast, shortest-path SLERP operates on the continuous manifold $\mathbb{S}^3$ and smoothly rotates by $2^\circ$.

---

### Exercise 10.5
**Problem:** For two orthogonal quaternions $q_1 \perp q_2$ ($q_1 \cdot q_2 = 0$), show that $\text{SLERP}(q_1, q_2; t) = q_1 \cos(\frac{\pi}{2}t) + q_2 \sin(\frac{\pi}{2}t)$.
**Solution:**
1. $q_1 \cdot q_2 = 0 \implies \Omega = \frac{\pi}{2}$.
2. $\sin\Omega = \sin(\pi/2) = 1$.
3. $(1 - t)\Omega = \frac{\pi}{2} - \frac{\pi}{2}t$.
   $$\sin\left(\frac{\pi}{2} - \frac{\pi}{2}t\right) = \cos\left(\frac{\pi}{2}t\right)$$
4. $t\Omega = \frac{\pi}{2}t \implies \sin(t\Omega) = \sin\left(\frac{\pi}{2}t\right)$.
5. Substituting into SLERP formula:
   $$\text{SLERP}(q_1, q_2; t) = \frac{\cos(\frac{\pi}{2}t)}{1} q_1 + \frac{\sin(\frac{\pi}{2}t)}{1} q_2 = q_1 \cos\left(\frac{\pi}{2}t\right) + q_2 \sin\left(\frac{\pi}{2}t\right)$$.

---

### Exercise 10.6
**Problem:** Prove that for any $t \in [0, 1]$, $\|\text{SLERP}(q_1, q_2; t)\| = 1$.
**Solution:**
1. Let $q(t) = a q_1 + b q_2$ with $a = \frac{\sin((1-t)\Omega)}{\sin\Omega}$ and $b = \frac{\sin(t\Omega)}{\sin\Omega}$.
2. $\|q(t)\|^2 = (a q_1 + b q_2) \cdot (a q_1 + b q_2) = a^2 (q_1 \cdot q_1) + 2ab (q_1 \cdot q_2) + b^2 (q_2 \cdot q_2)$.
3. Since $q_1, q_2 \in \mathbb{S}^3$, $q_1 \cdot q_1 = q_2 \cdot q_2 = 1$, and $q_1 \cdot q_2 = \cos\Omega$:
   $$\|q(t)\|^2 = a^2 + 2ab\cos\Omega + b^2$$
4. Substitute $a, b$:
   $$\sin^2\Omega \|q(t)\|^2 = \sin^2((1-t)\Omega) + 2\sin((1-t)\Omega)\sin(t\Omega)\cos\Omega + \sin^2(t\Omega)$$
5. Using trigonometric identities $\sin(A - B) = \sin A \cos B - \cos A \sin B$ where $A = \Omega, B = t\Omega$:
   Expanding and simplifying algebraically reduces the numerator identically to $\sin^2\Omega$.
6. Thus $\|q(t)\|^2 = \frac{\sin^2\Omega}{\sin^2\Omega} = 1 \implies \|q(t)\| = 1$.

---

### Exercise 10.7
**Problem:** In a VR headset running at $90\text{ Hz}$, the orientation tracking sensor updates at $1000\text{ Hz}$. Explain how SLERP is used to interpolate between the two most recent tracking samples to match the exact display scanout timestamp.
**Solution:**
1. Let sensor packets arrive at timestamps $T_k$ and $T_{k+1}$ with orientations $q_k$ and $q_{k+1}$.
2. The display scanout occurs at timestamp $T_{\text{vsync}}$, where $T_k \le T_{\text{vsync}} \le T_{k+1}$.
3. Calculate the time fraction:
   $$t = \frac{T_{\text{vsync}} - T_k}{T_{k+1} - T_k} \in [0, 1]$$
4. Execute shortest-path SLERP:
   $$q_{\text{render}} = \text{SLERP}(q_k, q_{k+1}; t)$$
5. This eliminates display judder and motion-to-photon latency artifacts by producing a physically exact predicted orientation.

---

### Exercise 10.8
**Problem:** What is the computational complexity difference between SLERP and NLERP in terms of CPU cycles?
**Solution:**
1. NLERP requires: 4 mults, 4 adds, 1 4D dot product (4 mults, 3 adds), 1 reciprocal square root (`rsqrtss` $\approx 3$ cycles), 4 mults.
   Total: $\approx 15$ cycles, fully SIMD-vectorizable.
2. SLERP requires: 1 dot product ($\approx 3$ cycles), 1 $\arccos$ ($\approx 50$ cycles), 3 $\sin$ evaluations ($\approx 3 \times 50 = 150$ cycles), 2 divisions ($\approx 2 \times 15 = 30$ cycles), 8 mults, 4 adds.
   Total: $\approx 240$ cycles.
3. SLERP is roughly **$15\times$ to $20\times$ more computationally expensive** than NLERP. This is why engines use NLERP for particle systems and crowd agents, reserving SLERP for primary cameras and rigid body physics.

---

### Exercise 10.9
**Problem:** What happens if SLERP is called with antipodal quaternions $q_1 = (1, 0, 0, 0)$ and $q_2 = (-1, 0, 0, 0)$ without the antipodal check?
**Solution:**
1. $q_1 \cdot q_2 = -1 \implies \cos\Omega = -1 \implies \Omega = \pi = 180^\circ$.
2. $\sin\Omega = \sin(\pi) = 0$.
3. The denominator $\sin\Omega = 0$.
4. Division by zero yields `NaN` or `Infinity`.
5. With the antipodal check:
   $q_1 \cdot q_2 = -1 < 0 \implies q_2 \leftarrow -q_2 = (1, 0, 0, 0)$.
   Now $q_1 \cdot q_2 = +1 \implies \Omega = 0$.
   The small-angle safeguard triggers, returning $q(t) = q_1$ instantaneously without any arithmetic instability.

---

### Exercise 10.10
**Problem:** In SQUAD, why is the parameter for the outer SLERP chosen as $2t(1-t)$ instead of $t$?
**Solution:**
1. In SQUAD:
   $$\text{SQUAD}(q_i, q_{i+1}, s_i, s_{i+1}; t) = \text{SLERP}\Big(\text{SLERP}(q_i, q_{i+1}; t), \; \text{SLERP}(s_i, s_{i+1}; t); \; 2t(1 - t)\Big)$$
2. Consider the function $h(t) = 2t(1 - t)$:
   - At $t = 0$: $h(0) = 0$.
   - At $t = 1$: $h(1) = 0$.
   - At $t = 0.5$: $h(0.5) = 2(0.5)(0.5) = 0.5$.
3. At the endpoints ($t = 0$ and $t = 1$), the outer interpolation weight is 0, meaning the curve strictly passes through $\text{SLERP}(q_i, q_{i+1}; 0) = q_i$ and $\text{SLERP}(q_i, q_{i+1}; 1) = q_{i+1}$.
4. Between the endpoints, $h(t) > 0$, smoothly pulling the curve toward the tangent control points $s_i, s_{i+1}$ to guarantee continuous first-derivative curvature ($C^1$) across keyframe boundaries.
