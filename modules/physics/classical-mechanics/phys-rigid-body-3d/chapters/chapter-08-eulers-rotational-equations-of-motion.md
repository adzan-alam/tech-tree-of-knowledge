# Chapter 8: Euler's Rotational Equations of Motion

> *"In the seventeenth century, Newton gave the world the laws of translational flux. In the eighteenth century, Leonhard Euler peered into the heart of spinning solids, discovering the sublime non-linear equations that govern every tumbling spacecraft, spinning top, and celestial body."*

---

## 8.1 The Rotating Frame Derivative Theorem (Transport Theorem)

To write down the equations of motion of a rigid body, we face a mathematical dilemma:
- In the **Inertial World Frame**, Newton's rotational law $\boldsymbol{\tau} = \dot{\mathbf{L}}$ holds cleanly, but the Inertia Tensor $\mathbf{I}_{\text{world}}(t)$ changes continuously as the body rotates, creating a difficult moving-boundary problem.
- In the **Body-Fixed Principal Frame**, the Inertia Tensor is constant and diagonal ($\mathbf{I} = \text{diag}(I_1, I_2, I_3)$), but the reference frame is **rotating at instantaneous angular velocity $\boldsymbol{\omega}$**, which is non-inertial.

To bridge this gap, we must determine how the time derivative of an arbitrary spatial vector $\mathbf{A}(t)$ measured by an observer in the inertial frame relates to the time derivative measured by an observer sitting inside the rotating frame.

```
                  Rotating Reference Frame Kinematics
                  
             Inertial Observer (World)          Co-Moving Observer (Body)
                        Z                                 e₃
                        │                                 │
                        │    (dA/dt)_space                │   (dA/dt)_body
                        │          │                      │        │
                        └──────────┼── X                  └────────┼── e₁
                       /           ▼                     /         ▼
                      Y         ω × A                   e₂     (Apparent Rate)
```

### Rigorous Derivation of the Transport Theorem
Let $\mathbf{A}(t)$ be an arbitrary vector. In the rotating body frame with orthonormal basis vectors $\{\hat{\mathbf{e}}_1(t), \hat{\mathbf{e}}_2(t), \hat{\mathbf{e}}_3(t)\}$, the vector is expressed as:

$$\mathbf{A}(t) = A_1(t)\hat{\mathbf{e}}_1(t) + A_2(t)\hat{\mathbf{e}}_2(t) + A_3(t)\hat{\mathbf{e}}_3(t)$$

Now take the time derivative from the perspective of an **inertial space observer** who sees both the components *and* the unit vectors changing:

$$\left(\frac{d\mathbf{A}}{dt}\right)_{\text{space}} = \sum_{k=1}^3 \left(\frac{dA_k}{dt}\right)\hat{\mathbf{e}}_k + \sum_{k=1}^3 A_k \left(\frac{d\hat{\mathbf{e}}_k}{dt}\right)$$

1. The first summation represents the rate of change of the coordinates as perceived by someone **inside the rotating body frame**:
   $$\sum_{k=1}^3 \left(\frac{dA_k}{dt}\right)\hat{\mathbf{e}}_k = \left(\frac{d\mathbf{A}}{dt}\right)_{\text{body}}$$
2. In the second summation, each unit vector $\hat{\mathbf{e}}_k$ is fixed to the rigid body, so its velocity in space is given by Poisson's kinematic formula:
   $$\frac{d\hat{\mathbf{e}}_k}{dt} = \boldsymbol{\omega} \times \hat{\mathbf{e}}_k$$
   Substituting this into the second summation:
   $$\sum_{k=1}^3 A_k \left(\frac{d\hat{\mathbf{e}}_k}{dt}\right) = \sum_{k=1}^3 A_k (\boldsymbol{\omega} \times \hat{\mathbf{e}}_k) = \boldsymbol{\omega} \times \left(\sum_{k=1}^3 A_k \hat{\mathbf{e}}_k\right) = \boldsymbol{\omega} \times \mathbf{A}$$

Combining both terms yields the celebrated **Transport Theorem**:

$$\left(\frac{d\mathbf{A}}{dt}\right)_{\text{space}} = \left(\frac{d\mathbf{A}}{dt}\right)_{\text{body}} + \boldsymbol{\omega} \times \mathbf{A}$$

This universal kinematic identity holds for **any** vector quantity $\mathbf{A}$ (velocity, momentum, force, magnetic field, etc.).

---

## 8.2 Detailed Derivation of Euler's Rotational Equations

Now, apply the Transport Theorem directly to the **Angular Momentum Vector** $\mathbf{L}$:

$$\left(\frac{d\mathbf{L}}{dt}\right)_{\text{space}} = \left(\frac{d\mathbf{L}}{dt}\right)_{\text{body}} + \boldsymbol{\omega} \times \mathbf{L}$$

By Newton's rotational law, the space derivative $\left(\frac{d\mathbf{L}}{dt}\right)_{\text{space}}$ equals the net external torque $\boldsymbol{\tau}$ acting on the body:

$$\boldsymbol{\tau} = \left(\frac{d\mathbf{L}}{dt}\right)_{\text{body}} + \boldsymbol{\omega} \times \mathbf{L}$$

### Evaluating Components in the Principal Body Frame
In the body frame, the coordinate axes align with the **Principal Axes of Inertia**:
$$\mathbf{I}_{\text{body}} = \text{diag}(I_1, I_2, I_3)$$
$$\mathbf{L} = \begin{bmatrix} I_1 \omega_1 \\ I_2 \omega_2 \\ I_3 \omega_3 \end{bmatrix}, \quad \boldsymbol{\omega} = \begin{bmatrix} \omega_1 \\ \omega_2 \\ \omega_3 \end{bmatrix}$$

Because the principal moments of inertia $I_1, I_2, I_3$ are constant in the body frame, the body time derivative is simply:

$$\left(\frac{d\mathbf{L}}{dt}\right)_{\text{body}} = \begin{bmatrix} I_1 \dot{\omega}_1 \\ I_2 \dot{\omega}_2 \\ I_3 \dot{\omega}_3 \end{bmatrix}$$

Now, compute the cross-product vector $\boldsymbol{\omega} \times \mathbf{L}$:

$$\boldsymbol{\omega} \times \mathbf{L} = \begin{bmatrix} \omega_1 \\ \omega_2 \\ \omega_3 \end{bmatrix} \times \begin{bmatrix} I_1 \omega_1 \\ I_2 \omega_2 \\ I_3 \omega_3 \end{bmatrix} = \begin{bmatrix} \omega_2 (I_3 \omega_3) - \omega_3 (I_2 \omega_2) \\ \omega_3 (I_1 \omega_1) - \omega_1 (I_3 \omega_3) \\ \omega_1 (I_2 \omega_2) - \omega_2 (I_1 \omega_1) \end{bmatrix} = \begin{bmatrix} (I_3 - I_2)\omega_2 \omega_3 \\ (I_1 - I_3)\omega_3 \omega_1 \\ (I_2 - I_1)\omega_1 \omega_2 \end{bmatrix}$$

Substituting this into $\boldsymbol{\tau} = \left(\frac{d\mathbf{L}}{dt}\right)_{\text{body}} + \boldsymbol{\omega} \times \mathbf{L}$ gives:

$$\begin{aligned}
\tau_1 &= I_1 \dot{\omega}_1 + (I_3 - I_2)\omega_2 \omega_3 \\
\tau_2 &= I_2 \dot{\omega}_2 + (I_1 - I_3)\omega_3 \omega_1 \\
\tau_3 &= I_3 \dot{\omega}_3 + (I_2 - I_1)\omega_1 \omega_2
\end{aligned}$$

Rearranging into the standard classical format delivers **Euler's Equations of Rotational Motion (1758)**:

$$\begin{aligned}
I_1 \dot{\omega}_1 - (I_2 - I_3)\omega_2 \omega_3 &= \tau_1 \\
I_2 \dot{\omega}_2 - (I_3 - I_1)\omega_3 \omega_1 &= \tau_2 \\
I_3 \dot{\omega}_3 - (I_1 - I_2)\omega_1 \omega_2 &= \tau_3
\end{aligned}$$

---

## 8.3 Torque-Free Motion and the Non-Linear Cross-Coupling

Consider an object tumbling in outer space in the complete absence of external torque:

$$\boldsymbol{\tau} = \mathbf{0} \iff \tau_1 = \tau_2 = \tau_3 = 0$$

Euler's equations reduce to:

$$\begin{aligned}
I_1 \dot{\omega}_1 &= (I_2 - I_3)\omega_2 \omega_3 \\
I_2 \dot{\omega}_2 &= (I_3 - I_1)\omega_3 \omega_1 \\
I_3 \dot{\omega}_3 &= (I_1 - I_2)\omega_1 \omega_2
\end{aligned}$$

### The Stunning Complexity of Torque-Free Rotation:
In linear translational mechanics, if the net external force is zero ($\mathbf{F} = \mathbf{0}$), linear acceleration is zero ($\dot{\mathbf{v}} = \mathbf{0}$), and the body coasts along a straight line at constant velocity.

In rotational mechanics, **even when the net torque is zero ($\boldsymbol{\tau} = \mathbf{0}$), the angular acceleration is NOT zero ($\dot{\boldsymbol{\omega}} \ne \mathbf{0}$)!**

Look at the right-hand side of Euler's equations:
- $\dot{\omega}_1$ is driven by the product $\omega_2 \omega_3$.
- $\dot{\omega}_2$ is driven by the product $\omega_3 \omega_1$.
- $\dot{\omega}_3$ is driven by the product $\omega_1 \omega_2$.

This is a system of **coupled, non-linear ordinary differential equations**. The rotation around any one axis continuously pumps angular velocity into the other two orthogonal axes through internal gyroscopic cross-coupling!

---

## 8.4 The First Integrals of Motion: Energy and Momentum Conservation

Despite the non-linear coupling of Euler's equations, torque-free motion possesses two strict conservation laws (first integrals) that constrain the trajectory in phase space:

### 1. Conservation of Rotational Kinetic Energy
Multiply the first equation by $\omega_1$, the second by $\omega_2$, and the third by $\omega_3$:

$$\begin{aligned}
I_1 \omega_1 \dot{\omega}_1 &= (I_2 - I_3)\omega_1 \omega_2 \omega_3 \\
I_2 \omega_2 \dot{\omega}_2 &= (I_3 - I_1)\omega_1 \omega_2 \omega_3 \\
I_3 \omega_3 \dot{\omega}_3 &= (I_1 - I_2)\omega_1 \omega_2 \omega_3
\end{aligned}$$

Add all three equations together:

$$I_1 \omega_1 \dot{\omega}_1 + I_2 \omega_2 \dot{\omega}_2 + I_3 \omega_3 \dot{\omega}_3 = \Big[ (I_2 - I_3) + (I_3 - I_1) + (I_1 - I_2) \Big] \omega_1 \omega_2 \omega_3$$

Notice that the bracketed sum cancels out identically:
$$(I_2 - I_3) + (I_3 - I_1) + (I_1 - I_2) \equiv 0$$

Therefore:
$$\frac{d}{dt}\left( \frac{1}{2}I_1 \omega_1^2 + \frac{1}{2}I_2 \omega_2^2 + \frac{1}{2}I_3 \omega_3^2 \right) = 0$$

$$2T_{\text{rot}} = I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2 = 2T_0 = \text{constant}$$

In phase space $(\omega_1, \omega_2, \omega_3)$, this equation defines an ellipsoid called the **Kinetic Energy Ellipsoid**. The angular velocity vector must permanently remain on the surface of this ellipsoid.

### 2. Conservation of Total Angular Momentum Magnitude
Multiply the first equation by $I_1 \omega_1$, the second by $I_2 \omega_2$, and the third by $I_3 \omega_3$:

$$\begin{aligned}
I_1^2 \omega_1 \dot{\omega}_1 &= I_1(I_2 - I_3)\omega_1 \omega_2 \omega_3 \\
I_2^2 \omega_2 \dot{\omega}_2 &= I_2(I_3 - I_1)\omega_1 \omega_2 \omega_3 \\
I_3^2 \omega_3 \dot{\omega}_3 &= I_3(I_1 - I_2)\omega_1 \omega_2 \omega_3
\end{aligned}$$

Summing the three equations:

$$I_1^2 \omega_1 \dot{\omega}_1 + I_2^2 \omega_2 \dot{\omega}_2 + I_3^2 \omega_3 \dot{\omega}_3 = \Big[ I_1 I_2 - I_1 I_3 + I_2 I_3 - I_2 I_1 + I_3 I_1 - I_3 I_2 \Big] \omega_1 \omega_2 \omega_3 = 0$$

Therefore:
$$\frac{d}{dt}\left( \frac{1}{2}(I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2) \right) = 0$$

$$\|\mathbf{L}\|^2 = I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2 = L_0^2 = \text{constant}$$

This equation defines another ellipsoid in $(\omega_1, \omega_2, \omega_3)$ space: the **Angular Momentum Ellipsoid**.

### Poinsot's Intersecting Ellipsoids:
Because both $T_{\text{rot}}$ and $\|\mathbf{L}\|^2$ are strictly conserved simultaneously, the angular velocity vector $\boldsymbol{\omega}(t)$ is geometrically constrained to move along the **curve of intersection between the Energy Ellipsoid and the Momentum Ellipsoid**! This trajectory is known as the **Polhode**.

---

## 8.5 Analytical Solution for the Torque-Free Symmetric Top

When an object possesses an axis of rotational symmetry, Euler's equations admit an exact, beautiful analytical closed-form solution.

Let the body be a **Symmetric Top**:
$$I_1 = I_2 \ne I_3$$

Substitute $I_1 = I_2$ into Euler's equations ($\boldsymbol{\tau} = \mathbf{0}$):

$$\begin{aligned}
I_1 \dot{\omega}_1 &= (I_1 - I_3)\omega_2 \omega_3 \\
I_1 \dot{\omega}_2 &= -(I_1 - I_3)\omega_1 \omega_3 \\
I_3 \dot{\omega}_3 &= (I_1 - I_1)\omega_1 \omega_2 = 0
\end{aligned}$$

### The Three Steps to the Exact Solution:
1. **Third Axis Spin is Constant:**
   $$\dot{\omega}_3 = 0 \implies \omega_3(t) = \Omega_3 = \text{constant}$$
   The spin rate around the symmetry axis never changes!
2. **Harmonic Coupling of Transverse Axes:**
   Define the constant **Precession Frequency** $\Omega_p$:
   $$\Omega_p = \left(\frac{I_1 - I_3}{I_1}\right) \Omega_3$$
   Then the first two equations become:
   $$\dot{\omega}_1 = \Omega_p \omega_2$$
   $$\dot{\omega}_2 = -\Omega_p \omega_1$$
3. **Harmonic Oscillator Solution:**
   Differentiating the first equation: $\ddot{\omega}_1 = \Omega_p \dot{\omega}_2 = \Omega_p(-\Omega_p \omega_1) = -\Omega_p^2 \omega_1$.
   This is the standard simple harmonic oscillator:
   $$\omega_1(t) = \omega_\perp \cos(\Omega_p t + \delta)$$
   $$\omega_2(t) = -\omega_\perp \sin(\Omega_p t + \delta)$$
   where $\omega_\perp = \sqrt{\omega_1^2 + \omega_2^2}$ is the constant transverse wobble amplitude.

### Physical Interpretation:
In the body frame, the angular velocity vector $\boldsymbol{\omega}$ traces out a perfect circle of radius $\omega_\perp$ around the symmetry axis $\hat{\mathbf{e}}_3$ at constant angular rate $\Omega_p$. This phenomenon is called **Torque-Free Precession** (or **Regular Precession**).
- For an **Oblate Top** ($I_3 > I_1$, like Earth or a frisbee), $\Omega_p < 0$: the precession is **retrograde** (in the opposite direction to the spin). This explains the famous **Chandler Wobble** of Earth's poles ($433$-day period)!
- For a **Prolate Top** ($I_3 < I_1$, like an American football), $\Omega_p > 0$: the precession is **prograde** (in the same direction as the spin).

---

## 8.6 10 Step-by-Step Worked Examples

### Worked Example 8.1: Calculating Euler Accelerations Hand by Hand
**Problem:** A spacecraft has principal moments $I_1 = 100, I_2 = 200, I_3 = 300\text{ kg}\cdot\text{m}^2$. At an instant in torque-free flight, its angular velocity in the body frame is $\boldsymbol{\omega} = (1.0, 2.0, 3.0)\text{ rad/s}$. Calculate the instantaneous angular acceleration components $(\dot{\omega}_1, \dot{\omega}_2, \dot{\omega}_3)$.
**Solution:**
1. Write down Euler's torque-free equations:
   $$\dot{\omega}_1 = \frac{I_2 - I_3}{I_1}\omega_2 \omega_3$$
   $$\dot{\omega}_2 = \frac{I_3 - I_1}{I_2}\omega_3 \omega_1$$
   $$\dot{\omega}_3 = \frac{I_1 - I_2}{I_3}\omega_1 \omega_2$$
2. Compute the inertia ratios:
   $$\frac{I_2 - I_3}{I_1} = \frac{200 - 300}{100} = \frac{-100}{100} = -1.0$$
   $$\frac{I_3 - I_1}{I_2} = \frac{300 - 100}{200} = \frac{200}{200} = +1.0$$
   $$\frac{I_1 - I_2}{I_3} = \frac{100 - 200}{300} = \frac{-100}{300} = -\frac{1}{3} \approx -0.3333$$
3. Compute products of angular velocities:
   $$\omega_2 \omega_3 = 2.0 \times 3.0 = 6.0\text{ rad}^2/\text{s}^2$$
   $$\omega_3 \omega_1 = 3.0 \times 1.0 = 3.0\text{ rad}^2/\text{s}^2$$
   $$\omega_1 \omega_2 = 1.0 \times 2.0 = 2.0\text{ rad}^2/\text{s}^2$$
4. Evaluate accelerations:
   $$\dot{\omega}_1 = (-1.0)(6.0) = -6.0\text{ rad/s}^2$$
   $$\dot{\omega}_2 = (+1.0)(3.0) = +3.0\text{ rad/s}^2$$
   $$\dot{\omega}_3 = \left(-\frac{1}{3}\right)(2.0) = -\frac{2}{3} \approx -0.667\text{ rad/s}^2$$
5. Result: Even though no thrusters are firing ($\boldsymbol{\tau} = \mathbf{0}$), the satellite experiences instantaneous angular accelerations of $(-6.0, 3.0, -0.667)\text{ rad/s}^2$!

---

### Worked Example 8.2: Verifying Energy Conservation in Example 8.1
**Problem:** Using the state and accelerations from Example 8.1, verify that the rate of change of rotational kinetic energy $\frac{dT}{dt}$ is identically zero.
**Solution:**
1. Kinetic energy formula: $T = \frac{1}{2}(I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2)$.
2. Differentiate with respect to time:
   $$\frac{dT}{dt} = I_1 \omega_1 \dot{\omega}_1 + I_2 \omega_2 \dot{\omega}_2 + I_3 \omega_3 \dot{\omega}_3$$
3. Substitute the numerical values:
   $$I_1 \omega_1 \dot{\omega}_1 = (100)(1.0)(-6.0) = -600\text{ W}$$
   $$I_2 \omega_2 \dot{\omega}_2 = (200)(2.0)(+3.0) = +1200\text{ W}$$
   $$I_3 \omega_3 \dot{\omega}_3 = (300)(3.0)\left(-\frac{2}{3}\right) = -600\text{ W}$$
4. Sum the three power terms:
   $$\frac{dT}{dt} = -600 + 1200 - 600 = 0.0\text{ W}$$
5. Rotational kinetic energy is rigorously conserved to zero decimal places.

---

### Worked Example 8.3: Verifying Angular Momentum Magnitude Conservation
**Problem:** For the same state in Example 8.1, verify that $\frac{d}{dt}\|\mathbf{L}\|^2 = 0$.
**Solution:**
1. $\|\mathbf{L}\|^2 = I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2$.
2. Differentiate:
   $$\frac{d}{dt}\left(\frac{1}{2}\|\mathbf{L}\|^2\right) = I_1^2 \omega_1 \dot{\omega}_1 + I_2^2 \omega_2 \dot{\omega}_2 + I_3^2 \omega_3 \dot{\omega}_3$$
3. Compute terms:
   $$I_1^2 \omega_1 \dot{\omega}_1 = (100^2)(1.0)(-6.0) = 10000(1)(-6) = -60,000$$
   $$I_2^2 \omega_2 \dot{\omega}_2 = (200^2)(2.0)(+3.0) = 40000(2)(3) = +240,000$$
   $$I_3^2 \omega_3 \dot{\omega}_3 = (300^2)(3.0)\left(-\frac{2}{3}\right) = 90000(3)\left(-\frac{2}{3}\right) = -180,000$$
4. Sum:
   $$\frac{d}{dt}\left(\frac{1}{2}\|\mathbf{L}\|^2\right) = -60,000 + 240,000 - 180,000 = 0$$
5. Angular momentum magnitude is strictly conserved.

---

### Worked Example 8.4: Precession Frequency of a Thrown Football
**Problem:** A quarterback throws an American football (prolate symmetric top) with spin rate $\Omega_3 = 600\text{ RPM}$ around its long axis. Its principal moments are $I_1 = I_2 = 0.0040\text{ kg}\cdot\text{m}^2$ and $I_3 = 0.0016\text{ kg}\cdot\text{m}^2$. Calculate its torque-free wobble precession frequency $\Omega_p$.
**Solution:**
1. Convert spin rate to rad/s:
   $$\Omega_3 = \frac{600 \times 2\pi}{60} = 20\pi \approx 62.832\text{ rad/s}$$
2. Precession frequency formula:
   $$\Omega_p = \left(\frac{I_1 - I_3}{I_1}\right) \Omega_3$$
3. Compute inertia ratio:
   $$\frac{I_1 - I_3}{I_1} = \frac{0.0040 - 0.0016}{0.0040} = \frac{0.0024}{0.0040} = 0.60$$
4. Compute $\Omega_p$:
   $$\Omega_p = 0.60 \times 62.832 \approx 37.70\text{ rad/s}$$
   In RPM: $\frac{37.70 \times 60}{2\pi} = 360\text{ RPM}$.
5. Result: The nose of the football wobbles around its spin axis at $360\text{ RPM}$ in the prograde direction.

---

### Worked Example 8.5: Chandler Wobble of the Earth
**Problem:** Modeling Earth as a rigid oblate symmetric top with $(I_3 - I_1)/I_1 \approx 0.00327$ and daily rotation rate $\Omega_3 = 2\pi\text{ rad/day}$. Compute the theoretical Euler wobble period and compare it to the observed Chandler wobble (433 days).
**Solution:**
1. Precession frequency:
   $$\Omega_p = \left(\frac{I_1 - I_3}{I_1}\right) \Omega_3 = -0.00327 \times (2\pi\text{ rad/day})$$
2. Period of wobble:
   $$T_p = \frac{2\pi}{|\Omega_p|} = \frac{2\pi}{0.00327 \times (2\pi/\text{day})} = \frac{1}{0.00327}\text{ days} \approx 305.8\text{ days}$$
3. Euler's rigid model predicts a period of approximately **$306\text{ days}$**.
4. Discrepancy: The observed Chandler period is **$433\text{ days}$**.
   The difference ($433$ vs $306$) exists because the Earth is not a perfectly rigid body: its liquid mantle and deformable crust yield elastically under rotational stress, reducing its effective dynamic rigidity.

---

### Worked Example 8.6: Constant-Spin Steady State
**Problem:** Show from Euler's equations that a pure rotation about any single principal axis ($\boldsymbol{\omega} = (\Omega_0, 0, 0)$) is an exact equilibrium solution.
**Solution:**
1. Let $\omega_1 = \Omega_0$, $\omega_2 = 0$, $\omega_3 = 0$.
2. Evaluate Euler's equations with $\boldsymbol{\tau} = \mathbf{0}$:
   $$I_1 \dot{\omega}_1 = (I_2 - I_3)(0)(0) = 0 \implies \dot{\omega}_1 = 0$$
   $$I_2 \dot{\omega}_2 = (I_3 - I_1)(0)(\Omega_0) = 0 \implies \dot{\omega}_2 = 0$$
   $$I_3 \dot{\omega}_3 = (I_1 - I_2)(\Omega_0)(0) = 0 \implies \dot{\omega}_3 = 0$$
3. Since all time derivatives $\dot{\boldsymbol{\omega}} = \mathbf{0}$, the state remains constant for all time.
4. Thus, pure rotation about any principal axis is an exact dynamical equilibrium. (Whether it is a *stable* equilibrium is the subject of Chapter 9!).

---

### Worked Example 8.7: Motor Spin-Up Under Euler Cross-Coupling
**Problem:** A satellite with $I_1 = 50, I_2 = 100, I_3 = 150\text{ kg}\cdot\text{m}^2$ is tumbling with $\omega_2 = 0.5\text{ rad/s}$ and $\omega_3 = 0.2\text{ rad/s}$. A thruster fires along the $x$-axis providing torque $\tau_1 = 10\text{ N}\cdot\text{m}$. What is the resulting angular acceleration $\dot{\omega}_1$?
**Solution:**
1. Euler's first equation:
   $$I_1 \dot{\omega}_1 - (I_2 - I_3)\omega_2 \omega_3 = \tau_1$$
2. Solve for $\dot{\omega}_1$:
   $$\dot{\omega}_1 = \frac{\tau_1 + (I_2 - I_3)\omega_2 \omega_3}{I_1}$$
3. Numerical values:
   $$\tau_1 = 10\text{ N}\cdot\text{m}$$
   $$(I_2 - I_3)\omega_2 \omega_3 = (100 - 150)(0.5)(0.2) = (-50)(0.1) = -5.0\text{ N}\cdot\text{m}$$
4. Compute acceleration:
   $$\dot{\omega}_1 = \frac{10 - 5.0}{50} = \frac{5.0}{50} = 0.10\text{ rad/s}^2$$
5. Notice that without cross-coupling, the acceleration would be $\frac{10}{50} = 0.20\text{ rad/s}^2$. The internal gyroscopic torque reduced the effective motor acceleration by **$50\%$**!

---

### Worked Example 8.8: Kinetic Energy and Momentum Ratio Metric
**Problem:** For torque-free motion of an asymmetric body, show that the parameter $\sigma = \frac{2T}{\|\mathbf{L}\|^2}$ is strictly bounded between $1/I_3$ and $1/I_1$.
**Solution:**
1. Recall the expressions:
   $$2T = I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2$$
   $$\|\mathbf{L}\|^2 = I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2$$
2. Express in terms of angular momentum components $L_k = I_k \omega_k$:
   $$2T = \frac{L_1^2}{I_1} + \frac{L_2^2}{I_2} + \frac{L_3^2}{I_3}$$
   $$\|\mathbf{L}\|^2 = L_1^2 + L_2^2 + L_3^2$$
3. Since $I_1 < I_2 < I_3$, we have $\frac{1}{I_3} < \frac{1}{I_2} < \frac{1}{I_1}$.
4. Therefore:
   $$2T \ge \frac{1}{I_3}(L_1^2 + L_2^2 + L_3^2) = \frac{\|\mathbf{L}\|^2}{I_3} \implies \frac{2T}{\|\mathbf{L}\|^2} \ge \frac{1}{I_3}$$
   $$2T \le \frac{1}{I_1}(L_1^2 + L_2^2 + L_3^2) = \frac{\|\mathbf{L}\|^2}{I_1} \implies \frac{2T}{\|\mathbf{L}\|^2} \le \frac{1}{I_1}$$
5. Thus $\frac{1}{I_3} \le \frac{2T}{\|\mathbf{L}\|^2} \le \frac{1}{I_1}$.
   The minimum energy state for given momentum is pure spin around the major axis ($I_3$); the maximum energy state is pure spin around the minor axis ($I_1$).

---

### Worked Example 8.9: Symplectic First-Order Euler Update Step
**Problem:** In a physics engine, a rigid body with $I_1 = 2, I_2 = 4, I_3 = 5$ has angular velocity $\boldsymbol{\omega} = (1, 1, 1)$ at $t = 0$. Using time-step $\Delta t = 0.01\text{ s}$, compute the angular velocity at $t = \Delta t$ using explicit Euler on Euler's equations.
**Solution:**
1. Compute accelerations:
   $$\dot{\omega}_1 = \frac{I_2 - I_3}{I_1}\omega_2 \omega_3 = \frac{4 - 5}{2}(1)(1) = -0.5\text{ rad/s}^2$$
   $$\dot{\omega}_2 = \frac{I_3 - I_1}{I_2}\omega_3 \omega_1 = \frac{5 - 2}{4}(1)(1) = +0.75\text{ rad/s}^2$$
   $$\dot{\omega}_3 = \frac{I_1 - I_2}{I_3}\omega_1 \omega_2 = \frac{2 - 4}{5}(1)(1) = -0.4\text{ rad/s}^2$$
2. Euler update step $\boldsymbol{\omega}_{n+1} = \boldsymbol{\omega}_n + \Delta t \dot{\boldsymbol{\omega}}_n$:
   $$\omega_1(0.01) = 1.0 + 0.01(-0.5) = 0.995\text{ rad/s}$$
   $$\omega_2(0.01) = 1.0 + 0.01(+0.75) = 1.0075\text{ rad/s}$$
   $$\omega_3(0.01) = 1.0 + 0.01(-0.4) = 0.996\text{ rad/s}$$
3. Result: $\boldsymbol{\omega}(0.01) = (0.995, 1.0075, 0.996)\text{ rad/s}$.

---

### Worked Example 8.10: Energy Dissipation and the Major Axis Rule
**Problem:** Real spacecraft have flexible antennas and fuel slosh that slowly dissipate kinetic energy through friction ($T \downarrow$) while angular momentum is conserved ($\|\mathbf{L}\| = \text{const}$). Using Example 8.8, prove that all tumbling satellites eventually end up spinning about their major axis of inertia $I_3$ (Explorer 1 anomaly).
**Solution:**
1. By conservation of angular momentum in the absence of external torque: $\|\mathbf{L}\| = \text{const}$.
2. Internal viscous friction and structural vibration dissipate mechanical energy:
   $$\frac{dT}{dt} < 0$$
3. From Example 8.8:
   $$2T = \frac{L_1^2}{I_1} + \frac{L_2^2}{I_2} + \frac{L_3^2}{I_3} \ge \frac{\|\mathbf{L}\|^2}{I_3}$$
4. The system seeks the **absolute lowest energy state** compatible with its constant angular momentum $\|\mathbf{L}\|$.
5. The minimum possible kinetic energy occurs when $L_1 = 0, L_2 = 0$, and $L_3 = \|\mathbf{L}\|$:
   $$T_{\min} = \frac{\|\mathbf{L}\|^2}{2 I_3}$$
6. Therefore, the satellite must inevitably transition into a pure spin around its **Major Axis of Inertia ($I_3$)**!
7. *Historical Note:* The first US satellite, **Explorer 1 (1958)**, was launched spinning around its long slender pencil axis ($I_1$, the minor axis). Engineers believed it was dynamically stable. Within hours, tiny flexible whip antennas dissipated energy, causing the satellite to unexpectedly tumble and transition into a flat spin about its transverse major axis ($I_3$)!

---

## 8.7 10 Granular Solved Exercises

### Exercise 8.1
**Problem:** Why are Euler's equations formulated in the principal body frame rather than an arbitrary non-principal body frame?
**Solution:**
1. In an arbitrary non-principal body frame, the Inertia Tensor has off-diagonal products of inertia: $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$.
2. Differentiating in the body frame would yield $\dot{\mathbf{L}} = \mathbf{I}\dot{\boldsymbol{\omega}}$, leading to equations where every acceleration $\dot{\omega}_k$ is coupled to every other acceleration ($\mathbf{I}\dot{\boldsymbol{\omega}} + \boldsymbol{\omega} \times (\mathbf{I}\boldsymbol{\omega}) = \boldsymbol{\tau}$).
3. Inverting this coupled $3 \times 3$ matrix on every step is algebraically complex.
4. Aligning with the principal axes diagonalizes $\mathbf{I}$, decoupling the accelerations: $I_k \dot{\omega}_k$ appears alone on the left-hand side of each equation.

---

### Exercise 8.2
**Problem:** In a spherical top ($I_1 = I_2 = I_3 = I_0$), what do Euler's torque-free equations reduce to?
**Solution:**
1. In a spherical top, $I_2 - I_3 = 0, I_3 - I_1 = 0, I_1 - I_2 = 0$.
2. All non-linear gyroscopic terms vanish identically:
   $$I_0 \dot{\omega}_1 = 0 \implies \dot{\omega}_1 = 0$$
   $$I_0 \dot{\omega}_2 = 0 \implies \dot{\omega}_2 = 0$$
   $$I_0 \dot{\omega}_3 = 0 \implies \dot{\omega}_3 = 0$$
3. Thus, $\boldsymbol{\omega}(t) = \boldsymbol{\omega}_0 = \text{constant}$.
4. A spherical top spins at strictly constant angular velocity in all frames.

---

### Exercise 8.3
**Problem:** Prove that if $\boldsymbol{\tau}$ is parallel to $\boldsymbol{\omega}$, the rotational kinetic energy increases at rate $\tau \omega$.
**Solution:**
1. The work-energy relation derived in Section 7.4 states that $P = \frac{dT}{dt} = \boldsymbol{\tau} \cdot \boldsymbol{\omega}$.
2. If $\boldsymbol{\tau} \parallel \boldsymbol{\omega}$, then $\boldsymbol{\tau} \cdot \boldsymbol{\omega} = \|\boldsymbol{\tau}\| \|\boldsymbol{\omega}\| \cos 0 = \tau \omega$.
3. Thus $\frac{dT}{dt} = \tau \omega$.

---

### Exercise 8.4
**Problem:** For a prolate symmetric top with $I_1 = I_2 = 2 I_3$, what is the ratio of precession frequency $\Omega_p$ to spin rate $\Omega_3$?
**Solution:**
1. Formula: $\Omega_p = \frac{I_1 - I_3}{I_1}\Omega_3$.
2. Substitute $I_1 = 2 I_3$:
   $$\frac{\Omega_p}{\Omega_3} = \frac{2I_3 - I_3}{2I_3} = \frac{I_3}{2I_3} = 0.5$$
3. The precession frequency is exactly half the spin rate.

---

### Exercise 8.5
**Problem:** In Euler's equations, why does the quantity $\omega_1^2 + \omega_2^2 + \omega_3^2 = \|\boldsymbol{\omega}\|^2$ generally *not* remain constant during torque-free motion of an asymmetric body?
**Solution:**
1. In torque-free motion, the conserved quantities are kinetic energy $2T = I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2$ and angular momentum squared $\|\mathbf{L}\|^2 = I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2$.
2. Because the coefficients $I_1, I_2, I_3$ are unequal in an asymmetric body, the geometric surface of constant $\|\boldsymbol{\omega}\|^2 = \text{const}$ is a sphere, which does not coincide with the intersection of the Energy and Momentum ellipsoids.
3. As the angular velocity wanders along the polhode curve, its Euclidean norm $\|\boldsymbol{\omega}\|$ fluctuates continuously.

---

### Exercise 8.6
**Problem:** In a spacecraft, three reaction wheels are mounted along the three principal axes. If Wheel 1 accelerates with $\dot{\Omega}_{w1}$, what torque does it apply to the satellite body?
**Solution:**
1. Let the reaction wheel have moment of inertia $I_w$ about its spin axis.
2. The wheel's angular momentum rate is $\dot{L}_{w1} = I_w \dot{\Omega}_{w1}$.
3. By Newton's Third Law for rotation, the wheel applies an internal reaction torque to the satellite:
   $$\tau_1 = -I_w \dot{\Omega}_{w1}$$
4. Spinning up the wheel to the right rolls the satellite to the left.

---

### Exercise 8.7
**Problem:** Show that Euler's equations can be written in compact vector form as $\mathbf{I}\dot{\boldsymbol{\omega}} + \boldsymbol{\omega} \times (\mathbf{I}\boldsymbol{\omega}) = \boldsymbol{\tau}$.
**Solution:**
1. In the principal body frame, $\mathbf{I} = \text{diag}(I_1, I_2, I_3)$ is constant.
2. $\mathbf{I}\dot{\boldsymbol{\omega}} = (I_1 \dot{\omega}_1, I_2 \dot{\omega}_2, I_3 \dot{\omega}_3)$.
3. $\boldsymbol{\omega} \times (\mathbf{I}\boldsymbol{\omega}) = \begin{bmatrix} \omega_1 \\ \omega_2 \\ \omega_3 \end{bmatrix} \times \begin{bmatrix} I_1 \omega_1 \\ I_2 \omega_2 \\ I_3 \omega_3 \end{bmatrix} = \begin{bmatrix} (I_3 - I_2)\omega_2 \omega_3 \\ (I_1 - I_3)\omega_3 \omega_1 \\ (I_2 - I_1)\omega_1 \omega_2 \end{bmatrix}$.
4. Adding them:
   $$\begin{bmatrix} I_1 \dot{\omega}_1 - (I_2 - I_3)\omega_2 \omega_3 \\ I_2 \dot{\omega}_2 - (I_3 - I_1)\omega_3 \omega_1 \\ I_3 \dot{\omega}_3 - (I_1 - I_2)\omega_1 \omega_2 \end{bmatrix} = \begin{bmatrix} \tau_1 \\ \tau_2 \\ \tau_3 \end{bmatrix}$$
5. This matches Euler's equations identically.

---

### Exercise 8.8
**Problem:** If an external torque is applied purely along the $x$-axis ($\tau_1 = \tau_0, \tau_2 = 0, \tau_3 = 0$), will $\omega_2$ and $\omega_3$ remain zero if the body was initially at rest?
**Solution:**
1. Initial condition: $\boldsymbol{\omega}(0) = (0, 0, 0)$.
2. At $t = 0$:
   $\dot{\omega}_1 = \frac{\tau_0 + (I_2 - I_3)(0)(0)}{I_1} = \frac{\tau_0}{I_1} \ne 0$.
   $\dot{\omega}_2 = \frac{0 + (I_3 - I_1)(0)(0)}{I_2} = 0$.
   $\dot{\omega}_3 = \frac{0 + (I_1 - I_2)(0)(0)}{I_3} = 0$.
3. At the next instant: $\omega_1 > 0$, but $\omega_2 = 0$ and $\omega_3 = 0$.
4. Then $\dot{\omega}_2 \propto \omega_3 \omega_1 = 0 \times \omega_1 = 0$, and $\dot{\omega}_3 \propto \omega_1 \omega_2 = \omega_1 \times 0 = 0$.
5. Therefore, $\omega_2(t) \equiv 0$ and $\omega_3(t) \equiv 0$ for all time.
6. The body accelerates in a pure, uncoupled spin about the $x$-axis because no initial perturbation exists on the other two axes.

---

### Exercise 8.9
**Problem:** What is the condition under which the cross-coupling terms in Euler's equations vanish even if all three angular velocity components $\omega_1, \omega_2, \omega_3$ are non-zero?
**Solution:**
1. The cross-coupling terms are:
   $(I_2 - I_3)\omega_2 \omega_3 = 0$
   $(I_3 - I_1)\omega_3 \omega_1 = 0$
   $(I_1 - I_2)\omega_1 \omega_2 = 0$
2. If $\omega_1 \ne 0, \omega_2 \ne 0, \omega_3 \ne 0$, these terms vanish if and only if:
   $I_2 - I_3 = 0 \implies I_2 = I_3$
   $I_3 - I_1 = 0 \implies I_3 = I_1$
   $I_1 - I_2 = 0 \implies I_1 = I_2$
3. This requires $I_1 = I_2 = I_3$ (a **Spherical Top**).

---

### Exercise 8.10
**Problem:** In numerical physics simulation, why is integrating angular momentum $\mathbf{L}$ in the world frame preferred over integrating $\boldsymbol{\omega}$ directly via Euler's equations?
**Solution:**
1. In the world frame: $\dot{\mathbf{L}}_{\text{world}} = \boldsymbol{\tau}_{\text{world}}$.
   In the absence of external torque, $\dot{\mathbf{L}}_{\text{world}} \equiv \mathbf{0}$. Angular momentum is identically constant, and numerical integration experiences zero truncation error!
2. In contrast, integrating $\dot{\boldsymbol{\omega}}$ via Euler's equations involves non-linear cross-product terms that accumulate truncation drift, violating energy and momentum conservation over time unless high-order symplectic integrators are used.
3. Therefore, engines integrate $\mathbf{L}_{\text{world}}$, evaluate $\boldsymbol{\omega} = \mathbf{I}_{\text{world}}^{-1}\mathbf{L}_{\text{world}}$, and update the attitude quaternion directly.
