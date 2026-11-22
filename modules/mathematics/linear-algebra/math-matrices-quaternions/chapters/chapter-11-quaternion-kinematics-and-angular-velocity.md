# Chapter 11: Quaternion Kinematics and Angular Velocity Integration

> *"A static orientation is merely a photograph; physics is the motion picture. The differential calculus of quaternions reveals how an infinitesimal torque twists space itself, translating angular momentum into continuous orientation trajectories without a single trigonometric singularity."*

---

## 11.1 The Time Derivative of a Unit Quaternion

In Newtonian and relativistic mechanics, a rigid body in 3D space possesses six degrees of freedom: three translational and three rotational. While translational kinematics is described by the familiar velocity equation $\dot{\mathbf{x}} = \mathbf{v}$, rotational kinematics requires a differential equation that evolves an attitude quaternion $q(t) \in \mathbb{S}^3$ under an instantaneous angular velocity vector $\boldsymbol{\omega}(t) \in \mathbb{R}^3$.

```
           World Frame                                Body Frame
           (Spatial / Inertial)                       (Co-moving / Principal)
                 Z                                             z_b
                 │                                             │
                 │                                             │  ω_body
                 │       ω_world                              ┌┴─┐
                 │          \                                 │  │
                 │           \                                └──┘
                 └──────────── X                    ─────────── x_b
                /                                  /
               Y                                  y_b
```

### Rigorous Derivation via Infinitesimal Rotation

Let $q(t)$ be the unit quaternion that rotates a vector from the body-fixed reference frame to the inertial world frame at time $t$:
$$\mathbf{v}_{\text{world}}(t) = q(t) \, \mathbf{v}_{\text{body}} \, q^*(t)$$

Consider an infinitesimal time step $\Delta t$. During this interval, the body rotates by an infinitesimal angle:
$$\Delta\theta = \|\boldsymbol{\omega}(t)\| \Delta t$$
around the instantaneous axis of rotation:
$$\hat{\mathbf{n}} = \frac{\boldsymbol{\omega}(t)}{\|\boldsymbol{\omega}(t)\|}$$

The incremental rotation quaternion $\Delta q$ that transforms the orientation from time $t$ to $t + \Delta t$ is:
$$\Delta q = \left(\cos\frac{\Delta\theta}{2}, \; \hat{\mathbf{n}}\sin\frac{\Delta\theta}{2}\right)$$

Recall the Taylor series expansions for $\cos$ and $\sin$ around zero:
$$\cos\frac{\Delta\theta}{2} = 1 - \frac{1}{2}\left(\frac{\Delta\theta}{2}\right)^2 + O(\Delta t^4) = 1 + O(\Delta t^2)$$
$$\sin\frac{\Delta\theta}{2} = \frac{\Delta\theta}{2} - \frac{1}{6}\left(\frac{\Delta\theta}{2}\right)^3 + O(\Delta t^5) = \frac{\|\boldsymbol{\omega}\|\Delta t}{2} + O(\Delta t^3)$$

Substituting these first-order approximations:
$$\Delta q = \left(1, \; \frac{\boldsymbol{\omega}\Delta t}{2}\right) = 1 + \frac{1}{2}\boldsymbol{\omega}_q \Delta t$$
where $\boldsymbol{\omega}_q = (0, \boldsymbol{\omega}) = 0 + \omega_x \mathbf{i} + \omega_y \mathbf{j} + \omega_z \mathbf{k}$ is the pure imaginary quaternion representing angular velocity.

### Spatial (World-Frame) vs Body-Frame Angular Velocity

The orientation at time $t + \Delta t$ depends on whether the angular velocity is expressed in the **inertial world frame** or the **body-fixed frame**:

#### 1. World-Frame Angular Velocity ($\boldsymbol{\omega}_{\text{world}}$):
An incremental rotation expressed in world coordinates acts on the *left* of the current orientation:
$$q(t + \Delta t) = \Delta q \, q(t) = \left(1 + \frac{1}{2}\boldsymbol{\omega}_{q,\text{world}} \Delta t\right) q(t) = q(t) + \frac{1}{2}\boldsymbol{\omega}_{q,\text{world}} \, q(t) \, \Delta t$$

Subtracting $q(t)$, dividing by $\Delta t$, and taking the limit $\Delta t \to 0$:
$$\dot{q}(t) = \lim_{\Delta t \to 0} \frac{q(t + \Delta t) - q(t)}{\Delta t} = \frac{1}{2}\boldsymbol{\omega}_{q,\text{world}} \, q(t)$$

#### 2. Body-Frame Angular Velocity ($\boldsymbol{\omega}_{\text{body}}$):
An incremental rotation expressed in local body coordinates acts on the *right* of the current orientation:
$$q(t + \Delta t) = q(t) \, \Delta q_{\text{body}} = q(t)\left(1 + \frac{1}{2}\boldsymbol{\omega}_{q,\text{body}} \Delta t\right) = q(t) + \frac{1}{2} q(t) \, \boldsymbol{\omega}_{q,\text{body}} \, \Delta t$$

Taking the limit $\Delta t \to 0$:
$$\dot{q}(t) = \frac{1}{2} q(t) \, \boldsymbol{\omega}_{q,\text{body}}$$

### The Frame Equivalence Theorem
Notice that the two formulations are completely identical under coordinate transformation:
$$\boldsymbol{\omega}_{\text{world}} = q \, \boldsymbol{\omega}_{\text{body}} \, q^* \iff \boldsymbol{\omega}_{\text{world}} \, q = q \, \boldsymbol{\omega}_{\text{body}}$$
Dividing by 2 yields $\frac{1}{2}\boldsymbol{\omega}_{\text{world}} q = \frac{1}{2} q \boldsymbol{\omega}_{\text{body}} = \dot{q}$. The mathematics is universally consistent.

---

## 11.2 Matrix Form of Quaternion Kinematics

In numerical computation, it is often useful to represent quaternion differentiation as a $4 \times 4$ matrix-vector multiplication.

Let $q = \begin{bmatrix} w \\ x \\ y \\ z \end{bmatrix}$ and let $\boldsymbol{\omega} = \begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix}$ be the world-frame angular velocity.
Expanding the Hamilton product $\boldsymbol{\omega}_q \, q$:

$$\begin{aligned}
\boldsymbol{\omega}_q \, q &= (0 + \omega_x \mathbf{i} + \omega_y \mathbf{j} + \omega_z \mathbf{k})(w + x\mathbf{i} + y\mathbf{j} + z\mathbf{k}) \\
&= [ - (\omega_x x + \omega_y y + \omega_z z) ] \\
&\quad + [ w \omega_x + \omega_y z - \omega_z y ]\mathbf{i} \\
&\quad + [ w \omega_y + \omega_z x - \omega_x z ]\mathbf{j} \\
&\quad + [ w \omega_z + \omega_x y - \omega_y x ]\mathbf{k}
\end{aligned}$$

Writing this in matrix form:

$$\dot{q} = \frac{1}{2} \boldsymbol{\Omega}(\boldsymbol{\omega}) \, q$$

where the $4 \times 4$ skew-symmetric matrix $\boldsymbol{\Omega}(\boldsymbol{\omega})$ is:

$$\boldsymbol{\Omega}(\boldsymbol{\omega}) = \begin{bmatrix} 
0 & -\omega_x & -\omega_y & -\omega_z \\ 
\omega_x & 0 & -\omega_z & \omega_y \\ 
\omega_y & \omega_z & 0 & -\omega_x \\ 
\omega_z & -\omega_y & \omega_x & 0 
\end{bmatrix}$$

### Skew-Symmetry and Geometric Invariance
Notice that $\boldsymbol{\Omega}(\boldsymbol{\omega})$ is strictly skew-symmetric:
$$\boldsymbol{\Omega}(\boldsymbol{\omega})^T = -\boldsymbol{\Omega}(\boldsymbol{\omega})$$

This property has a profound geometric consequence. Let us compute the rate of change of the squared norm $\|q(t)\|^2 = q^T q$:
$$\frac{d}{dt}\|q\|^2 = \frac{d}{dt}(q^T q) = \dot{q}^T q + q^T \dot{q} = \left(\frac{1}{2}\boldsymbol{\Omega} q\right)^T q + q^T \left(\frac{1}{2}\boldsymbol{\Omega} q\right) = \frac{1}{2} q^T (\boldsymbol{\Omega}^T + \boldsymbol{\Omega}) q$$

Since $\boldsymbol{\Omega}^T + \boldsymbol{\Omega} = \mathbf{0}$:
$$\frac{d}{dt}\|q(t)\|^2 \equiv 0$$

In the continuous analytical domain, the velocity vector $\dot{q}$ is **strictly orthogonal** to the position vector $q$ on $\mathbb{S}^3$:
$$q \cdot \dot{q} = 0$$
The derivative lies entirely in the **tangent space** $T_q \mathbb{S}^3$. A continuous quaternion trajectory never departs the surface of the 3-sphere!

---

## 11.3 Numerical Integration in 3D Physics Engines

While continuous calculus guarantees $\|q(t)\| = 1$, discrete numerical computers advance time in finite steps $\Delta t$ ($1/60\text{ s}$ or $1/240\text{ s}$). We now analyze the numerical schemes used in real-time simulators.

### 1. Explicit Forward Euler Integration (Naive)
$$q_{n+1} = q_n + \Delta t \, \dot{q}_n = q_n + \frac{\Delta t}{2} \boldsymbol{\omega}_q \, q_n$$

#### Analytical Norm Expansion (Radial Drift):
$$\begin{aligned}
\|q_{n+1}\|^2 &= \left\| q_n + \frac{\Delta t}{2} \boldsymbol{\omega}_q q_n \right\|^2 \\
&= q_n^T q_n + \Delta t (q_n \cdot \dot{q}_n) + \frac{\Delta t^2}{4} \|\boldsymbol{\omega}_q q_n\|^2 \\
&= 1 + 0 + \frac{\Delta t^2}{4} \|\boldsymbol{\omega}_q\|^2 \|q_n\|^2 \\
&= 1 + \frac{\Delta t^2}{4} \|\boldsymbol{\omega}\|^2 > 1
\end{aligned}$$

At every single integration step, explicit Euler integration increases the quaternion's norm by a factor of $\sqrt{1 + \frac{\Delta t^2}{4}\|\boldsymbol{\omega}\|^2}$.
For a spinning turbine with $\|\boldsymbol{\omega}\| = 100\text{ rad/s}$ and $\Delta t = 0.0166\text{ s}$, after 10 seconds (600 frames), the quaternion norm grows to:
$$\|q\| \approx (1 + 0.174)^{600} \to 1.2 \times 10^{42}$$
The simulation explodes into floating-point overflow!

### 2. Renormalized Euler Integration (Standard Engine Baseline)
To counteract this growth, engines normalize after the update:
$$q_{n+1}^* = q_n + \frac{\Delta t}{2} \boldsymbol{\omega}_q \, q_n$$
$$q_{n+1} = \frac{q_{n+1}^*}{\|q_{n+1}^*\|}$$

This is computationally cheap and prevents explosive instability, but introduces phase lag (the physical angle rotated is slightly underestimated at high angular velocities).

### 3. Closed-Form Exponential Map Integration (Symplectic / Exact)
If the angular velocity $\boldsymbol{\omega}$ is assumed constant over the interval $[t, t + \Delta t]$, the differential equation $\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q$ can be solved **analytically and exactly**:

$$q_{n+1} = \exp\left(\frac{1}{2} \boldsymbol{\omega}_q \Delta t\right) q_n$$

Using the quaternionic exponential map:
$$\exp\left(\frac{1}{2} \boldsymbol{\omega}_q \Delta t\right) = \left(\cos\frac{\|\boldsymbol{\omega}\|\Delta t}{2}, \; \frac{\boldsymbol{\omega}}{\|\boldsymbol{\omega}\|}\sin\frac{\|\boldsymbol{\omega}\|\Delta t}{2}\right)$$

#### Advantages:
1. **Analytically Norm-Preserving:** $\left\|\exp\left(\frac{1}{2}\boldsymbol{\omega}_q \Delta t\right)\right\| \equiv 1$. No artificial energy gain or numerical damping.
2. **Infinite Stability:** Stable for arbitrary time steps $\Delta t$, even if $\Delta t = 10\text{ seconds}$.
3. **Exact Kinematics:** Traverses the exact circular rotation geodesic on $SO(3)$.

---

## 11.4 Drift Elimination and High-Performance Renormalization

Even when using exponential integration, finite 32-bit floating-point roundoff errors gradually accumulate over millions of simulation steps, causing $\|q\|$ to slowly drift away from 1.0 ($1.0000004 \to 1.00002 \to \dots$).

### Fast Taylor Renormalization
Instead of computing an expensive full square root and division:
$$\|q\| = \sqrt{w^2 + x^2 + y^2 + z^2}, \quad q \leftarrow \frac{q}{\|q\|}$$
we can exploit the fact that the drift $\epsilon = \|q\|^2 - 1$ is tiny ($|\epsilon| < 10^{-4}$).

The reciprocal square root function $f(y) = \frac{1}{\sqrt{y}}$ evaluated at $y = 1 + \epsilon$ has the Taylor expansion:
$$\frac{1}{\sqrt{1 + \epsilon}} = (1 + \epsilon)^{-1/2} = 1 - \frac{1}{2}\epsilon + \frac{3}{8}\epsilon^2 - O(\epsilon^3) \approx \frac{1}{2}(3 - \|q\|^2)$$

#### The Ultra-Fast Normalization Algorithm:
```typescript
const lengthSq = q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z;
// If drift is small, one iteration of Taylor expansion eliminates division:
const factor = 0.5 * (3.0 - lengthSq);
q.w *= factor;
q.x *= factor;
q.y *= factor;
q.z *= factor;
```
This routine runs in **1 clock cycle** using SIMD fused-multiply-add (FMA) instructions, completely eliminating normalization overhead from the physics loop.

---

## 11.5 The 6-DOF Rigid Body State Vector and Rotational Dynamics

In a complete 3D rigid body simulator, kinematics is coupled with Newton-Euler rotational dynamics:

### The Complete State Vector
$$\mathbf{Y}(t) = \begin{bmatrix} \mathbf{x}(t) \\ q(t) \\ \mathbf{P}(t) \\ \mathbf{L}(t) \end{bmatrix} \in \mathbb{R}^{13}$$

1. **Position:** $\mathbf{x} \in \mathbb{R}^3$ (center of mass in world frame).
2. **Orientation:** $q \in \mathbb{S}^3 \subset \mathbb{H}$ (unit quaternion).
3. **Linear Momentum:** $\mathbf{P} \in \mathbb{R}^3$ ($\mathbf{P} = M \mathbf{v}$).
4. **Angular Momentum:** $\mathbf{L} \in \mathbb{R}^3$ (angular momentum in world frame).

### The Dynamic Derivative Vector
$$\frac{d}{dt}\mathbf{Y}(t) = \begin{bmatrix} \dot{\mathbf{x}}(t) \\ \dot{q}(t) \\ \dot{\mathbf{P}}(t) \\ \dot{\mathbf{L}}(t) \end{bmatrix} = \begin{bmatrix} \mathbf{v}(t) \\ \frac{1}{2}\boldsymbol{\omega}_q(t) q(t) \\ \mathbf{F}_{\text{net}}(t) \\ \boldsymbol{\tau}_{\text{net}}(t) \end{bmatrix}$$

### Coupling Angular Momentum to Angular Velocity:
In the body frame, the mass distribution is fixed, so the body inertia tensor $\mathbf{I}_{\text{body}} \in \mathbb{R}^{3 \times 3}$ is a constant symmetric positive-definite matrix.
In the world frame, the inertia tensor rotates continuously:
$$\mathbf{I}_{\text{world}}(t) = \mathbf{R}(q) \, \mathbf{I}_{\text{body}} \, \mathbf{R}(q)^T$$
$$\mathbf{I}_{\text{world}}^{-1}(t) = \mathbf{R}(q) \, \mathbf{I}_{\text{body}}^{-1} \, \mathbf{R}(q)^T$$

The instantaneous world-frame angular velocity is obtained directly from angular momentum:
$$\boldsymbol{\omega}(t) = \mathbf{I}_{\text{world}}^{-1}(t) \, \mathbf{L}(t)$$

### Rotational Kinetic Energy:
$$T_{\text{rot}} = \frac{1}{2} \boldsymbol{\omega}^T \mathbf{L} = \frac{1}{2} \mathbf{L}^T \mathbf{I}_{\text{world}}^{-1} \mathbf{L} = \text{invariant under free rotation}$$

---

## 11.6 10 Step-by-Step Worked Examples

### Worked Example 11.1: Hand Calculation of Quaternion Derivative $\dot{q}$
**Problem:** At time $t = 0$, a satellite is in the identity orientation $q = (1, 0, 0, 0)$. It is tumbling with world angular velocity $\boldsymbol{\omega} = (0.2, -0.4, 0.8)\text{ rad/s}$. Compute $\dot{q}$ and verify that $q \cdot \dot{q} = 0$.
**Solution:**
1. Quaternionic embedding:
   $$\boldsymbol{\omega}_q = (0, 0.2, -0.4, 0.8)$$
2. Derivative equation:
   $$\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q = \frac{1}{2}(0, 0.2, -0.4, 0.8)(1, 0, 0, 0)$$
3. Since $q = 1$, $\boldsymbol{\omega}_q q = \boldsymbol{\omega}_q$.
   $$\dot{q} = \frac{1}{2}(0, 0.2, -0.4, 0.8) = (0, 0.1, -0.2, 0.4)$$
4. Orthogonality check:
   $$q \cdot \dot{q} = (1)(0) + (0)(0.1) + (0)(-0.2) + (0)(0.4) = 0$$
   The derivative is strictly orthogonal to the quaternion.

---

### Worked Example 11.2: Explicit Euler Step vs Renormalization
**Problem:** Continuing Worked Example 11.1, integrate one time-step $\Delta t = 0.1\text{ s}$ using explicit Euler. Calculate the unnormalized quaternion $q^*$, its norm, and the renormalized result $q_1$.
**Solution:**
1. Unnormalized step:
   $$q^* = q_0 + \Delta t \dot{q} = (1, 0, 0, 0) + 0.1(0, 0.1, -0.2, 0.4) = (1, 0.01, -0.02, 0.04)$$
2. Compute norm squared:
   $$\|q^*\|^2 = 1^2 + 0.01^2 + (-0.02)^2 + 0.04^2 = 1 + 0.0001 + 0.0004 + 0.0016 = 1.0021$$
   $$\|q^*\| = \sqrt{1.0021} \approx 1.001049$$
   Notice that $\|q^*\| > 1$, showing outward radial drift.
3. Renormalize:
   $$q_1 = \frac{q^*}{\|q^*\|} = \frac{(1, 0.01, -0.02, 0.04)}{1.001049} \approx (0.998952, 0.009990, -0.019979, 0.039958)$$
4. Check:
   $$0.998952^2 + 0.009990^2 + (-0.019979)^2 + 0.039958^2 = 0.997905 + 0.000100 + 0.000399 + 0.001597 = 1.000001$$

---

### Worked Example 11.3: Exponential Map Integration
**Problem:** For the same satellite in Worked Example 11.1, integrate $\Delta t = 0.1\text{ s}$ using the exact exponential map. Compare with Example 11.2.
**Solution:**
1. Magnitude of angular velocity:
   $$\|\boldsymbol{\omega}\| = \sqrt{0.2^2 + (-0.4)^2 + 0.8^2} = \sqrt{0.04 + 0.16 + 0.64} = \sqrt{0.84} \approx 0.916515\text{ rad/s}$$
2. Half-angle of rotation:
   $$\frac{\theta}{2} = \frac{\|\boldsymbol{\omega}\|\Delta t}{2} = \frac{(0.916515)(0.1)}{2} = 0.045826\text{ rad}$$
3. Evaluate trig functions:
   $$\cos(0.045826) \approx 0.998951$$
   $$\sin(0.045826) \approx 0.045794$$
4. Normalized axis:
   $$\hat{\mathbf{n}} = \frac{\boldsymbol{\omega}}{\|\boldsymbol{\omega}\|} = \frac{(0.2, -0.4, 0.8)}{0.916515} \approx (0.218218, -0.436436, 0.872872)$$
5. Incremental quaternion:
   $$\Delta q = \left(\cos\frac{\theta}{2}, \hat{\mathbf{n}}\sin\frac{\theta}{2}\right) = (0.998951, 0.009993, -0.019986, 0.039972)$$
6. Update orientation:
   $$q_1 = \Delta q \, q_0 = \Delta q (1, 0, 0, 0) = (0.998951, 0.009993, -0.019986, 0.039972)$$
7. Comparison:
   Renormalized Euler from Ex 11.2: $(0.998952, 0.009990, -0.019979, 0.039958)$.
   The discrepancy is in the 6th decimal place ($< 1.5 \times 10^{-5}$ rad), proving Euler's accuracy for small time steps, but exponential map requires no renormalization.

---

### Worked Example 11.4: Body-Frame Angular Velocity Derivative
**Problem:** A spinning top has orientation $q = (0.707107, 0, 0.707107, 0)$. Its gyroscope measures angular velocity in the **body frame** as $\boldsymbol{\omega}_{\text{body}} = (0, 0, 10)\text{ rad/s}$. Compute $\dot{q}$.
**Solution:**
1. Body-frame kinematics formula:
   $$\dot{q} = \frac{1}{2} q \, \boldsymbol{\omega}_{q,\text{body}}$$
2. Pure quaternion: $\boldsymbol{\omega}_{q,\text{body}} = (0, 0, 0, 10)$.
3. Hamilton product $q \, \boldsymbol{\omega}_{q,\text{body}}$:
   $$q = 0.707107 + 0.707107\mathbf{j}$$
   $$\boldsymbol{\omega}_{q,\text{body}} = 10\mathbf{k}$$
   $$q \, \boldsymbol{\omega}_{q,\text{body}} = (0.707107 + 0.707107\mathbf{j})(10\mathbf{k}) = 7.07107\mathbf{k} + 7.07107(\mathbf{j}\mathbf{k})$$
   Since $\mathbf{j}\mathbf{k} = \mathbf{i}$:
   $$q \, \boldsymbol{\omega}_{q,\text{body}} = 7.07107\mathbf{i} + 7.07107\mathbf{k} = (0, 7.07107, 0, 7.07107)$$
4. Multiply by $\frac{1}{2}$:
   $$\dot{q} = (0, 3.535535, 0, 3.535535)$$
5. Orthogonality check:
   $$q \cdot \dot{q} = (0.707107)(0) + 0(3.535535) + (0.707107)(0) + 0(3.535535) = 0$$

---

### Worked Example 11.5: Transforming Inertia Tensor to World Frame
**Problem:** A box of mass $M = 12\text{ kg}$ with dimensions $a = 2\text{ m}, b = 1\text{ m}, c = 3\text{ m}$ has principal moments of inertia:
$$I_{xx} = \frac{1}{12}M(b^2 + c^2) = \frac{1}{12}(12)(1 + 9) = 10\text{ kg}\cdot\text{m}^2$$
$$I_{yy} = \frac{1}{12}M(a^2 + c^2) = \frac{1}{12}(12)(4 + 9) = 13\text{ kg}\cdot\text{m}^2$$
$$I_{zz} = \frac{1}{12}M(a^2 + b^2) = \frac{1}{12}(12)(4 + 1) = 5\text{ kg}\cdot\text{m}^2$$
The box is rotated by $90^\circ$ about the $Z$-axis: $q = (0.707107, 0, 0, 0.707107)$. Compute $\mathbf{I}_{\text{world}}^{-1}$.
**Solution:**
1. Body inverse inertia:
   $$\mathbf{I}_{\text{body}}^{-1} = \text{diag}(1/10, 1/13, 1/5) = \text{diag}(0.10, 0.076923, 0.20)$$
2. Rotation matrix for $90^\circ$ around $Z$:
   $$\mathbf{R} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
3. World inverse inertia tensor:
   $$\mathbf{I}_{\text{world}}^{-1} = \mathbf{R} \, \mathbf{I}_{\text{body}}^{-1} \, \mathbf{R}^T$$
   $$\mathbf{R} \mathbf{I}_{\text{body}}^{-1} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.10 & 0 & 0 \\ 0 & 0.076923 & 0 \\ 0 & 0 & 0.20 \end{bmatrix} = \begin{bmatrix} 0 & -0.076923 & 0 \\ 0.10 & 0 & 0 \\ 0 & 0 & 0.20 \end{bmatrix}$$
   $$(\mathbf{R} \mathbf{I}_{\text{body}}^{-1}) \mathbf{R}^T = \begin{bmatrix} 0 & -0.076923 & 0 \\ 0.10 & 0 & 0 \\ 0 & 0 & 0.20 \end{bmatrix} \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0.076923 & 0 & 0 \\ 0 & 0.10 & 0 \\ 0 & 0 & 0.20 \end{bmatrix}$$
4. Notice that rotating $90^\circ$ swapped the $X$ and $Y$ principal axes in world space: the $X$-axis now has inverse moment $1/13$ and the $Y$-axis has $1/10$.

---

### Worked Example 11.6: Computing World Torque from an Off-Center Impulse
**Problem:** A rocket floating in zero-gravity with center of mass at $\mathbf{x} = (10, 5, 0)$ is struck at contact point $\mathbf{p} = (12, 5, 0)$ by an impulse $\mathbf{J} = (0, 50, 0)\text{ N}\cdot\text{s}$. Compute the resulting angular momentum step $\Delta \mathbf{L}$.
**Solution:**
1. Lever arm vector in world frame:
   $$\mathbf{r} = \mathbf{p} - \mathbf{x} = (12 - 10, 5 - 5, 0 - 0) = (2, 0, 0)\text{ m}$$
2. Angular impulse formula:
   $$\Delta \mathbf{L} = \mathbf{r} \times \mathbf{J} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 50 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 2 \times 50 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 100 \end{bmatrix}\text{ N}\cdot\text{m}\cdot\text{s}$$
3. The rocket gains $+100\text{ N}\cdot\text{m}\cdot\text{s}$ of angular momentum about its vertical $Z$-axis.

---

### Worked Example 11.7: Runge-Kutta 4th Order (RK4) Quaternion Integration
**Problem:** Set up the RK4 integration formulas for $q(t)$ given a time-varying angular velocity function $\boldsymbol{\omega}(t)$.
**Solution:**
Let $f(q, \boldsymbol{\omega}) = \frac{1}{2}\boldsymbol{\omega}_q q$.
1. Stage 1:
   $$k_1 = \frac{1}{2} \boldsymbol{\omega}_q(t_n) \, q_n$$
2. Stage 2:
   $$q_{(2)} = \text{normalize}\left(q_n + \frac{\Delta t}{2} k_1\right)$$
   $$k_2 = \frac{1}{2} \boldsymbol{\omega}_q(t_n + 0.5\Delta t) \, q_{(2)}$$
3. Stage 3:
   $$q_{(3)} = \text{normalize}\left(q_n + \frac{\Delta t}{2} k_2\right)$$
   $$k_3 = \frac{1}{2} \boldsymbol{\omega}_q(t_n + 0.5\Delta t) \, q_{(3)}$$
4. Stage 4:
   $$q_{(4)} = \text{normalize}\left(q_n + \Delta t \, k_3\right)$$
   $$k_4 = \frac{1}{2} \boldsymbol{\omega}_q(t_n + \Delta t) \, q_{(4)}$$
5. Final accumulation:
   $$q_{n+1} = \text{normalize}\left( q_n + \frac{\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4) \right)$$
6. RK4 provides $O(\Delta t^4)$ phase precision, making it the preferred integrator for aerospace trajectories and high-precision flight dynamics.

---

### Worked Example 11.8: Verifying Fast Taylor Normalization
**Problem:** A physics simulation step produces a slightly drifted quaternion $q = (0.9995, 0.02, -0.01, 0.02)$. Compare standard normalization with the fast Taylor approximation $q \leftarrow q \cdot [0.5(3 - \|q\|^2)]$.
**Solution:**
1. Compute length squared:
   $$\|q\|^2 = 0.9995^2 + 0.02^2 + (-0.01)^2 + 0.02^2 = 0.99900025 + 0.0004 + 0.0001 + 0.0004 = 0.99990025$$
2. Exact normalization:
   $$\|q\| = \sqrt{0.99990025} \approx 0.99995012$$
   $$\frac{1}{\|q\|} \approx 1.00004988$$
   $$w_{\text{exact}} = 0.9995 \times 1.00004988 \approx 0.99954986$$
3. Taylor approximation factor:
   $$\text{factor} = 0.5 \times (3.0 - 0.99990025) = 0.5 \times 2.00009975 = 1.000049875$$
   $$w_{\text{taylor}} = 0.9995 \times 1.000049875 \approx 0.99954985$$
4. Error:
   $$|w_{\text{exact}} - w_{\text{taylor}}| \approx 1 \times 10^{-8}$$
   The Taylor series matches exact normalization to 8 significant digits with zero square roots or divisions!

---

### Worked Example 11.9: Dzhanibekov Effect (Tennis Racket Instability)
**Problem:** In zero gravity, a rigid body with principal moments $I_1 < I_2 < I_3$ spins around its intermediate axis $I_2$. Explain why quaternion kinematics coupled with Euler's equations causes periodic $180^\circ$ orientation flips.
**Solution:**
1. Euler's equations of rotational motion:
   $$I_1 \dot{\omega}_1 = (I_2 - I_3)\omega_2 \omega_3$$
   $$I_2 \dot{\omega}_2 = (I_3 - I_1)\omega_3 \omega_1$$
   $$I_3 \dot{\omega}_3 = (I_1 - I_2)\omega_1 \omega_2$$
2. Let the body spin predominantly about the intermediate axis $\hat{\mathbf{e}}_2$ with a small perturbation $(\delta\omega_1, \Omega, \delta\omega_3)$.
3. Linearizing around $\omega_2 \approx \Omega$:
   $$\ddot{\delta\omega}_1 = \frac{(I_2 - I_3)(I_1 - I_2)\Omega^2}{I_1 I_3} \delta\omega_1$$
4. Since $I_1 < I_2 < I_3$:
   $(I_2 - I_3) < 0$ and $(I_1 - I_2) < 0$, so their product is **strictly positive**:
   $$\gamma^2 = \frac{(I_3 - I_2)(I_2 - I_1)\Omega^2}{I_1 I_3} > 0 \implies \ddot{\delta\omega}_1 = +\gamma^2 \delta\omega_1$$
5. The differential equation has exponential solutions $e^{+\gamma t}$. Perturbations grow exponentially!
6. When integrated in a physics engine with quaternion state $\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q$, this hyperbolic instability causes the object to execute rapid $180^\circ$ tumbling flips indefinitely.

---

### Worked Example 11.10: Gyroscopic Precession Kinematics
**Problem:** A heavy gyroscope spins at $\omega_s = 300\text{ rad/s}$ about its symmetry axis $\hat{\mathbf{z}}_{\text{body}}$. A steady gravity torque $\boldsymbol{\tau} = (15, 0, 0)\text{ N}\cdot\text{m}$ acts on it. Find the steady-state precession angular velocity vector $\boldsymbol{\Omega}_p$.
**Solution:**
1. Spin angular momentum:
   Let $I_s = 0.05\text{ kg}\cdot\text{m}^2$.
   $$\mathbf{L} \approx I_s \boldsymbol{\omega}_s = 0.05 \times 300\hat{\mathbf{z}} = 15\hat{\mathbf{z}}\text{ N}\cdot\text{m}\cdot\text{s}$$
2. Newton-Euler law:
   $$\dot{\mathbf{L}} = \boldsymbol{\tau}_{\text{net}}$$
3. For steady precession at rate $\boldsymbol{\Omega}_p$, $\dot{\mathbf{L}} = \boldsymbol{\Omega}_p \times \mathbf{L}$.
   $$\boldsymbol{\Omega}_p \times \mathbf{L} = \boldsymbol{\tau}$$
4. Let $\boldsymbol{\Omega}_p = \Omega_p \hat{\mathbf{y}}$:
   $$\Omega_p \hat{\mathbf{y}} \times 15\hat{\mathbf{z}} = 15\Omega_p \hat{\mathbf{x}} = 15\hat{\mathbf{x}} \implies \Omega_p = 1.0\text{ rad/s}$$
5. The gyroscope precesses around the $Y$-axis at $1.0\text{ rad/s} \approx 57.3^\circ/\text{s}$.
6. In the physics engine, the quaternion update will naturally track this 3D conical precession without any hard-coded gyroscopic rules.

---

## 11.7 10 Granular Solved Exercises

### Exercise 11.1
**Problem:** Prove algebraically that $\boldsymbol{\Omega}(\boldsymbol{\omega}) q$ equals the vector component of the pure quaternion product $\boldsymbol{\omega}_q q$.
**Solution:**
1. Let $\boldsymbol{\omega}_q = (0, \boldsymbol{\omega})$ and $q = (w, \mathbf{v})$.
2. Quaternion multiplication rule:
   $$\boldsymbol{\omega}_q q = (0 \cdot w - \boldsymbol{\omega} \cdot \mathbf{v}, \; 0 \cdot \mathbf{v} + w\boldsymbol{\omega} + \boldsymbol{\omega} \times \mathbf{v}) = (-\boldsymbol{\omega} \cdot \mathbf{v}, \; w\boldsymbol{\omega} + \boldsymbol{\omega} \times \mathbf{v})$$
3. Evaluate the scalar component:
   $$-\boldsymbol{\omega} \cdot \mathbf{v} = -(\omega_x x + \omega_y y + \omega_z z)$$
   This matches row 1 of $\boldsymbol{\Omega}(\boldsymbol{\omega}) q$: $[0, -\omega_x, -\omega_y, -\omega_z] \cdot [w, x, y, z]^T$.
4. Evaluate vector component $w\boldsymbol{\omega} + \boldsymbol{\omega} \times \mathbf{v}$:
   $$w\begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix} + \begin{bmatrix} \omega_y z - \omega_z y \\ \omega_z x - \omega_x z \\ \omega_x y - \omega_y x \end{bmatrix} = \begin{bmatrix} \omega_x w - \omega_z y + \omega_y z \\ \omega_y w + \omega_z x - \omega_x z \\ \omega_z w - \omega_y x + \omega_x y \end{bmatrix}$$
   These correspond exactly to rows 2, 3, and 4 of $\boldsymbol{\Omega}(\boldsymbol{\omega}) q$.

---

### Exercise 11.2
**Problem:** If a rigid body has angular velocity $\boldsymbol{\omega} = (0, 0, 0)$, what is $\dot{q}$? What does this mean physically?
**Solution:**
1. If $\boldsymbol{\omega} = \mathbf{0}$, then $\boldsymbol{\omega}_q = (0, 0, 0, 0)$.
2. $\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q = \frac{1}{2}(0) q = (0, 0, 0, 0)$.
3. The derivative is identically zero.
4. Physically, this means the body is in static equilibrium or pure translation; its spatial orientation does not change over time.

---

### Exercise 11.3
**Problem:** Given $q_0 = (0, 1, 0, 0)$ and constant $\boldsymbol{\omega} = (0, 2, 0)\text{ rad/s}$. Using exact exponential integration, find $q(t)$ at $t = \pi/4\text{ s}$.
**Solution:**
1. Magnitude: $\|\boldsymbol{\omega}\| = 2\text{ rad/s}$, axis $\hat{\mathbf{n}} = (0, 1, 0)$.
2. At $t = \pi/4$:
   $$\Delta\theta = \|\boldsymbol{\omega}\|t = 2 \times \frac{\pi}{4} = \frac{\pi}{2}$$
   $$\frac{\Delta\theta}{2} = \frac{\pi}{4}$$
3. Exponential quaternion:
   $$\Delta q = \left(\cos\frac{\pi}{4}, (0, 1, 0)\sin\frac{\pi}{4}\right) = \left(\frac{\sqrt{2}}{2}, 0, \frac{\sqrt{2}}{2}, 0\right)$$
4. Final orientation:
   $$q(t) = \Delta q \, q_0 = \left(\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}\mathbf{j}\right)(\mathbf{i}) = \frac{\sqrt{2}}{2}\mathbf{i} + \frac{\sqrt{2}}{2}(\mathbf{j}\mathbf{i}) = \frac{\sqrt{2}}{2}\mathbf{i} - \frac{\sqrt{2}}{2}\mathbf{k}$$
   $$q(t) = \left(0, \frac{\sqrt{2}}{2}, 0, -\frac{\sqrt{2}}{2}\right)$$.

---

### Exercise 11.4
**Problem:** Show that the kinetic energy of rotation $T = \frac{1}{2}\boldsymbol{\omega}^T \mathbf{I} \boldsymbol{\omega}$ can be evaluated equivalently in the body frame as $T = \frac{1}{2}\boldsymbol{\omega}_{\text{body}}^T \mathbf{I}_{\text{body}} \boldsymbol{\omega}_{\text{body}}$.
**Solution:**
1. The relationship between frames is $\boldsymbol{\omega}_{\text{world}} = \mathbf{R} \boldsymbol{\omega}_{\text{body}}$ and $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$.
2. Substitute into world kinetic energy:
   $$T = \frac{1}{2}(\mathbf{R} \boldsymbol{\omega}_{\text{body}})^T (\mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T) (\mathbf{R} \boldsymbol{\omega}_{\text{body}})$$
   $$= \frac{1}{2} \boldsymbol{\omega}_{\text{body}}^T \mathbf{R}^T \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T \mathbf{R} \boldsymbol{\omega}_{\text{body}}$$
3. Since $\mathbf{R} \in SO(3)$, $\mathbf{R}^T \mathbf{R} = \mathbf{I}_3$:
   $$T = \frac{1}{2} \boldsymbol{\omega}_{\text{body}}^T \mathbf{I}_{\text{body}} \boldsymbol{\omega}_{\text{body}}$$
4. Rotational kinetic energy is a scalar invariant of the motion.

---

### Exercise 11.5
**Problem:** In explicit Euler integration, explain why the phase error causes an object to rotate *faster* or *slower* than its true physical speed.
**Solution:**
1. The unnormalized update is $q^* = q_0 + \frac{\Delta t}{2}\boldsymbol{\omega}_q q_0$.
2. The angle of $q^*$ from $q_0$ in the tangent plane is $\tan\frac{\Delta\theta^*}{2} = \frac{\|\boldsymbol{\omega}\|\Delta t}{2}$.
3. For the true physical rotation, the angle is $\frac{\Delta\theta_{\text{true}}}{2} = \frac{\|\boldsymbol{\omega}\|\Delta t}{2}$.
4. Since $\tan(x) > x$ for all $x > 0$:
   $$\frac{\Delta\theta^*}{2} = \arctan\left(\frac{\|\boldsymbol{\omega}\|\Delta t}{2}\right) < \frac{\|\boldsymbol{\omega}\|\Delta t}{2}$$
5. When renormalized, the effective angle rotated per time step is $\Delta\theta_{\text{effective}} = 2\arctan\left(\frac{\|\boldsymbol{\omega}\|\Delta t}{2}\right) < \|\boldsymbol{\omega}\|\Delta t$.
6. Therefore, explicit renormalized Euler integration **underestimates** angular velocity, causing the body to spin slightly slower than physical reality.

---

### Exercise 11.6
**Problem:** Derive the second derivative $\ddot{q}(t)$ of a unit quaternion in terms of angular velocity $\boldsymbol{\omega}$ and angular acceleration $\boldsymbol{\alpha} = \dot{\boldsymbol{\omega}}$.
**Solution:**
1. Differentiate $\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q$ using the product rule:
   $$\ddot{q} = \frac{d}{dt}\left(\frac{1}{2}\boldsymbol{\omega}_q q\right) = \frac{1}{2}\dot{\boldsymbol{\omega}}_q q + \frac{1}{2}\boldsymbol{\omega}_q \dot{q}$$
2. Substitute $\dot{\boldsymbol{\omega}}_q = \boldsymbol{\alpha}_q = (0, \boldsymbol{\alpha})$ and $\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q$:
   $$\ddot{q} = \frac{1}{2}\boldsymbol{\alpha}_q q + \frac{1}{4}\boldsymbol{\omega}_q (\boldsymbol{\omega}_q q) = \frac{1}{2}\boldsymbol{\alpha}_q q + \frac{1}{4}(\boldsymbol{\omega}_q)^2 q$$
3. Since $\boldsymbol{\omega}_q = (0, \boldsymbol{\omega})$ is a pure quaternion, its square is a negative scalar:
   $$(\boldsymbol{\omega}_q)^2 = -\|\boldsymbol{\omega}\|^2$$
4. Thus:
   $$\ddot{q} = \frac{1}{2}\boldsymbol{\alpha}_q q - \frac{1}{4}\|\boldsymbol{\omega}\|^2 q$$
5. The first term is tangential acceleration; the second term is centripetal acceleration pointing directly inward toward the origin of $\mathbb{R}^4$.

---

### Exercise 11.7
**Problem:** Verify that $q \cdot \ddot{q} = -\frac{1}{4}\|\boldsymbol{\omega}\|^2 = -\|\dot{q}\|^2$.
**Solution:**
1. From Exercise 11.6: $\ddot{q} = \frac{1}{2}\boldsymbol{\alpha}_q q - \frac{1}{4}\|\boldsymbol{\omega}\|^2 q$.
2. Take the inner product with $q$:
   $$q \cdot \ddot{q} = \frac{1}{2} q \cdot (\boldsymbol{\alpha}_q q) - \frac{1}{4}\|\boldsymbol{\omega}\|^2 (q \cdot q)$$
3. The term $q \cdot (\boldsymbol{\alpha}_q q) = 0$ because $\boldsymbol{\alpha}_q q$ is orthogonal to $q$.
4. Since $q \cdot q = 1$:
   $$q \cdot \ddot{q} = -\frac{1}{4}\|\boldsymbol{\omega}\|^2$$
5. Now evaluate $\|\dot{q}\|^2$:
   $$\|\dot{q}\|^2 = \left\|\frac{1}{2}\boldsymbol{\omega}_q q\right\|^2 = \frac{1}{4}\|\boldsymbol{\omega}_q\|^2 \|q\|^2 = \frac{1}{4}\|\boldsymbol{\omega}\|^2$$
6. Therefore, $q \cdot \ddot{q} = -\|\dot{q}\|^2$. This is the exact 4D analogue of circular motion in 2D ($x \ddot{x} + y \ddot{y} = -v^2$).

---

### Exercise 11.8
**Problem:** In a physics engine running at $60\text{ Hz}$ ($\Delta t = 0.01667\text{ s}$), a body has $\boldsymbol{\omega} = (0, 0, 50)\text{ rad/s}$. What is the percentage error in angular displacement between Euler integration and exact exponential integration?
**Solution:**
1. True angular displacement:
   $$\Delta\theta_{\text{true}} = \|\boldsymbol{\omega}\|\Delta t = 50 \times 0.016667 = 0.83333\text{ rad} \approx 47.746^\circ$$
2. Euler effective displacement:
   $$\Delta\theta_{\text{euler}} = 2\arctan\left(\frac{0.83333}{2}\right) = 2\arctan(0.416667) = 2(0.394791) = 0.78958\text{ rad} \approx 45.240^\circ$$
3. Absolute error:
   $$|0.83333 - 0.78958| = 0.04375\text{ rad} \approx 2.506^\circ$$
4. Percentage error:
   $$\frac{0.04375}{0.83333} \times 100\% \approx 5.25\%$$
5. At high rotation rates, Euler integration introduces over $5\%$ velocity lag per step, which is why fast-spinning projectiles require sub-stepping or exponential integrators.

---

### Exercise 11.9
**Problem:** What is the condition for angular momentum $\mathbf{L}$ and angular velocity $\boldsymbol{\omega}$ to be parallel vectors?
**Solution:**
1. The relationship is $\mathbf{L} = \mathbf{I} \boldsymbol{\omega}$.
2. $\mathbf{L} \parallel \boldsymbol{\omega} \iff \mathbf{I} \boldsymbol{\omega} = \lambda \boldsymbol{\omega}$ for some scalar $\lambda > 0$.
3. This is the definition of an eigenvector equation for the symmetric matrix $\mathbf{I}$.
4. Therefore, $\mathbf{L}$ and $\boldsymbol{\omega}$ are strictly parallel if and only if the body is rotating about one of its **principal axes of inertia**.
5. When rotating around any non-principal axis, $\mathbf{L}$ and $\boldsymbol{\omega}$ point in different directions, causing gyroscopic torque and precession.

---

### Exercise 11.10
**Problem:** Write down the update equation for orientation when angular acceleration is non-zero using a second-order Taylor expansion of $q(t + \Delta t)$.
**Solution:**
1. Taylor series of $q(t + \Delta t)$:
   $$q(t + \Delta t) = q(t) + \Delta t \dot{q}(t) + \frac{\Delta t^2}{2}\ddot{q}(t) + O(\Delta t^3)$$
2. Substitute $\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q$ and $\ddot{q} = \frac{1}{2}\boldsymbol{\alpha}_q q - \frac{1}{4}\|\boldsymbol{\omega}\|^2 q$:
   $$q(t + \Delta t) \approx q(t) + \frac{\Delta t}{2}\boldsymbol{\omega}_q q + \frac{\Delta t^2}{4}\boldsymbol{\alpha}_q q - \frac{\Delta t^2}{8}\|\boldsymbol{\omega}\|^2 q$$
   $$= \left[ \left(1 - \frac{\Delta t^2 \|\boldsymbol{\omega}\|^2}{8}\right) + \frac{\Delta t}{2}\boldsymbol{\omega}_q + \frac{\Delta t^2}{4}\boldsymbol{\alpha}_q \right] q(t)$$
3. Renormalizing this polynomial update yields second-order accurate orientation integration incorporating angular acceleration directly.
