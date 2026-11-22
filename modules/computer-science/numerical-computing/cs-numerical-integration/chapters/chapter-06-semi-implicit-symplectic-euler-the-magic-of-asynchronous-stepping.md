# Chapter 06: Semi-Implicit (Symplectic) Euler — The Magic of Asynchronous Stepping

> *"In the history of software engineering, there are few discoveries as astonishing as Semi-Implicit Euler. To cure the lethal energy explosion of Forward Euler, one does not need complex multi-stage Butcher tableaus, nor costly multi-dimensional Newton-Raphson solvers. One merely swaps two lines of code. By evaluating position using the newly updated velocity, the algorithm collapses onto the symplectic manifold, preserving phase space volume with zero additional CPU overhead."*

---

### 6.1 The Asynchronous Revelation: The Euler-Cromer Method

In 1981, physics educator Alan Cromer published a landmark paper in the *American Journal of Physics* titled *"Stable Solutions Using the Euler Approximation"*. Cromer observed that while generations of introductory physics textbooks had taught Forward Euler and lamented its instability, an almost imperceptible algorithmic modification produces a stunningly stable numerical integrator.

Recall the flawed **Explicit Forward Euler** update from Chapter 3:

$$\begin{cases}
\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t & \text{(Position updated using OLD velocity)} \\
\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_n) \Delta t & \text{(Velocity updated using OLD position)}
\end{cases}$$

Now observe the **Semi-Implicit Euler** (or **Euler-Cromer / Symplectic Euler**) update:

$$\begin{cases}
\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_n) \Delta t & \text{(1. Velocity updated FIRST via acceleration at } \mathbf{x}_n\text{)} \\
\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1} \Delta t & \text{(2. Position updated using the NEW velocity } \mathbf{v}_{n+1}\text{)}
\end{cases}$$

```typescript
// THE SOVEREIGN FIX: Semi-Implicit (Symplectic) Euler
function stepSemiImplicitEuler(dt: number): void {
  for (let i = 0; i < particleCount; i++) {
    // 1. Update velocity FIRST
    v[i] += (F[i] / m[i]) * dt;
    
    // 2. Update position using the NEW velocity
    x[i] += v[i] * dt;
  }
}
```

```
+-------------------------------------------------------------------------+
|                  THE ASYNCHRONOUS STEPPING PIPELINE                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  Initial State: (x_n, v_n)                                              |
|                                                                         |
|  [ KICK STEP ]:   v_{n+1} = v_n + a(x_n) * dt     (Velocity Jump)       |
|                               |                                         |
|                               v                                         |
|  Intermediate:  (x_n, v_{n+1})                                          |
|                               |                                         |
|                               v                                         |
|  [ DRIFT STEP ]:  x_{n+1} = x_n + v_{n+1} * dt    (Positional Stream)   |
|                                                                         |
|  Final State:   (x_{n+1}, v_{n+1})                                      |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### Why is it Called "Semi-Implicit"?
The method is termed *semi-implicit* because:
- The velocity update $\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_n) \Delta t$ is purely **explicit** (evaluating forces at known $\mathbf{x}_n$).
- The position update $\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1} \Delta t$ is **implicit** with respect to velocity (using future velocity $\mathbf{v}_{n+1}$), yet requires zero equation solving because $\mathbf{v}_{n+1}$ was computed on the immediately preceding line!

We obtain all the geometric stability benefits of an implicit method at the **exact same computational cost as Forward Euler** (one force evaluation, two vector additions, zero matrix solves).

#### The Dual Formulation: Symplectic Euler-B (Drift-Kick)
An equivalent dual formulation updates position first using old velocity, then updates velocity using the new position:

$$\begin{cases}
\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t & \text{(Drift First)} \\
\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_{n+1}) \Delta t & \text{(Kick Second)}
\end{cases}$$

Both variants share identical stability, symplecticity, and first-order global accuracy. In game physics and graphics engines, the Velocity-First (Kick-Drift) form is almost universally preferred because the position update immediately reflects current user collision impulses.

---

### 6.2 Symplectic Operator Splitting: Composition of Shears

To understand why Semi-Implicit Euler possesses geometric stability, we apply the mathematical theory of **Lie-Trotter Operator Splitting**.

Consider a classical Hamiltonian with separable kinetic and potential energy:

$$\mathcal{H}(\mathbf{x}, \mathbf{v}) = T(\mathbf{v}) + V(\mathbf{x}) = \frac{1}{2}\|\mathbf{v}\|^2 + V(\mathbf{x})$$

The continuous equations of motion $\dot{\mathbf{z}} = \mathbf{f}(\mathbf{z})$ can be decomposed into the sum of two vector fields:

$$\frac{d}{dt}\begin{bmatrix} \mathbf{x} \\ \mathbf{v} \end{bmatrix} = \mathbf{f}_A(\mathbf{x}, \mathbf{v}) + \mathbf{f}_B(\mathbf{x}, \mathbf{v})$$

Where:
- **Field A (Pure Ballistic Drift):** $\dot{\mathbf{x}} = \mathbf{v}, \quad \dot{\mathbf{v}} = \mathbf{0}$.
- **Field B (Pure Force Kick):** $\dot{\mathbf{x}} = \mathbf{0}, \quad \dot{\mathbf{v}} = \mathbf{a}(\mathbf{x})$.

Both sub-fields can be integrated **analytically and exactly** over a time step $\Delta t$:

#### 1. The Drift Operator $\mathcal{D}_{\Delta t}$
$$\mathcal{D}_{\Delta t}\left(\begin{bmatrix} \mathbf{x} \\ \mathbf{v} \end{bmatrix}\right) = \begin{bmatrix} \mathbf{x} + \mathbf{v}\Delta t \\ \mathbf{v} \end{bmatrix}$$
The Jacobian matrix of the Drift operator is:
$$\mathbf{M}_{\mathcal{D}} = \begin{bmatrix} \mathbf{I} & \Delta t \mathbf{I} \\ \mathbf{0} & \mathbf{I} \end{bmatrix}$$
Check the symplectic condition:
$$\mathbf{M}_{\mathcal{D}}^T \mathbf{J} \mathbf{M}_{\mathcal{D}} = \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ \Delta t \mathbf{I} & \mathbf{I} \end{bmatrix} \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{I} & \Delta t \mathbf{I} \\ \mathbf{0} & \mathbf{I} \end{bmatrix} = \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} = \mathbf{J}$$
The Drift operator is an exact symplectic shear!

#### 2. The Kick Operator $\mathcal{K}_{\Delta t}$
$$\mathcal{K}_{\Delta t}\left(\begin{bmatrix} \mathbf{x} \\ \mathbf{v} \end{bmatrix}\right) = \begin{bmatrix} \mathbf{x} \\ \mathbf{v} + \mathbf{a}(\mathbf{x})\Delta t \end{bmatrix}$$
The Jacobian matrix of the Kick operator is:
$$\mathbf{M}_{\mathcal{K}} = \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ \Delta t \frac{\partial \mathbf{a}}{\partial \mathbf{x}} & \mathbf{I} \end{bmatrix}$$
As proven in Chapter 5, for conservative forces $\frac{\partial \mathbf{a}}{\partial \mathbf{x}} = -\nabla^2 V$ is symmetric, so:
$$\mathbf{M}_{\mathcal{K}}^T \mathbf{J} \mathbf{M}_{\mathcal{K}} = \mathbf{J}$$
The Kick operator is an exact symplectic shear!

#### The Symplectic Group Composition Theorem
In abstract algebra, the set of all symplectic matrices forms a Lie group: the **Symplectic Group** $\text{Sp}(2d, \mathbb{R})$.
A fundamental group property is that **the product of any two symplectic matrices is itself strictly symplectic**:

$$\mathbf{M}_{\text{total}} = \mathbf{M}_{\mathcal{D}} \cdot \mathbf{M}_{\mathcal{K}}$$

$$\mathbf{M}_{\text{total}}^T \mathbf{J} \mathbf{M}_{\text{total}} = (\mathbf{M}_{\mathcal{D}} \mathbf{M}_{\mathcal{K}})^T \mathbf{J} (\mathbf{M}_{\mathcal{D}} \mathbf{M}_{\mathcal{K}}) = \mathbf{M}_{\mathcal{K}}^T (\mathbf{M}_{\mathcal{D}}^T \mathbf{J} \mathbf{M}_{\mathcal{D}}) \mathbf{M}_{\mathcal{K}} = \mathbf{M}_{\mathcal{K}}^T \mathbf{J} \mathbf{M}_{\mathcal{K}} = \mathbf{J}$$

$$\mathbf{\mathbf{M}_{\text{total}}^T \mathbf{J} \mathbf{M}_{\text{total}} \equiv \mathbf{J}}$$

Because Semi-Implicit Euler is literally the sequential composition of a Kick step followed by a Drift step:

$$\Phi_{\text{Semi-Implicit}}(\Delta t) = \mathcal{D}_{\Delta t} \circ \mathcal{K}_{\Delta t}$$

**Semi-Implicit Euler is proven to be an exact symplectic integrator!**

---

### 6.3 State Transition Analysis & The Stability Boundary ($\omega \Delta t < 2$)

Let us examine the simple harmonic oscillator $\ddot{x} = -\omega^2 x$ under Semi-Implicit Euler:

$$\begin{cases}
v_{n+1} = v_n - \omega^2 \Delta t x_n \\
x_{n+1} = x_n + v_{n+1} \Delta t = x_n + (v_n - \omega^2 \Delta t x_n)\Delta t = (1 - \omega^2 \Delta t^2) x_n + \Delta t v_n
\end{cases}$$

The state transition matrix is:

$$\mathbf{A}_{\text{SIE}} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

#### 1. Evaluation of Phase Space Volume (Determinant)
$$\det(\mathbf{A}_{\text{SIE}}) = (1 - \omega^2 \Delta t^2)(1) - (\Delta t)(-\omega^2 \Delta t) = 1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2 \equiv \mathbf{1.000000}$$

The determinant is **identically equal to 1.0 for all step sizes $\Delta t$**!
Phase space volume is 100% conserved. Liouville's theorem is strictly upheld.

#### 2. Eigenvalue Analysis
To determine the stability limits, evaluate the characteristic equation:

$$\det(\mathbf{A}_{\text{SIE}} - \lambda \mathbf{I}) = \det\begin{bmatrix} (1 - \omega^2 \Delta t^2) - \lambda & \Delta t \\ -\omega^2 \Delta t & 1 - \lambda \end{bmatrix} = 0$$

$$((1 - \omega^2 \Delta t^2) - \lambda)(1 - \lambda) + \omega^2 \Delta t^2 = 0$$

$$\lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + (1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2) = 0$$

$$\mathbf{\lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + 1 = 0}$$

Using the quadratic formula:

$$\lambda_{1, 2} = \frac{(2 - \omega^2 \Delta t^2) \pm \sqrt{(2 - \omega^2 \Delta t^2)^2 - 4}}{2}$$

Let us analyze the discriminant $\Delta_{\text{disc}} = (2 - \omega^2 \Delta t^2)^2 - 4$:

$$\Delta_{\text{disc}} = 4 - 4\omega^2 \Delta t^2 + \omega^4 \Delta t^4 - 4 = -\omega^2 \Delta t^2 (4 - \omega^2 \Delta t^2)$$

#### Case 1: When $\omega \Delta t < 2$ (Stable Oscillatory Regime)
If $\omega \Delta t < 2$, then $4 - \omega^2 \Delta t^2 > 0$.
The discriminant is strictly **negative**:

$$\Delta_{\text{disc}} = -[\omega \Delta t \sqrt{4 - \omega^2 \Delta t^2}]^2 < 0$$

The roots are a complex conjugate pair:

$$\lambda_{1, 2} = \frac{2 - \omega^2 \Delta t^2}{2} \pm i \frac{\omega \Delta t \sqrt{4 - \omega^2 \Delta t^2}}{2}$$

Compute the magnitude (spectral radius) $|\lambda|$:

$$|\lambda|^2 = \text{Re}(\lambda)^2 + \text{Im}(\lambda)^2 = \left( \frac{2 - \omega^2 \Delta t^2}{2} \right)^2 + \frac{\omega^2 \Delta t^2 (4 - \omega^2 \Delta t^2)}{4}$$

$$|\lambda|^2 = \frac{4 - 4\omega^2 \Delta t^2 + \omega^4 \Delta t^4 + 4\omega^2 \Delta t^2 - \omega^4 \Delta t^4}{4} = \frac{4}{4} \equiv \mathbf{1.000000}$$

$$\mathbf{|\lambda| \equiv 1.000000 \quad \text{for all } \omega \Delta t < 2}$$

```
+-------------------------------------------------------------------------+
|                  THE SEMI-IMPLICIT STABILITY CRITERION                  |
+-------------------------------------------------------------------------+
|                                                                         |
|  As long as:             \omega \cdot \Delta t  <  2.0                  |
|                                                                         |
|  The eigenvalues lie EXACTLY ON THE UNIT CIRCLE in the complex plane!   |
|                                                                         |
|  The mechanical energy exhibits ZERO SECULAR DRIFT.                     |
|  Orbits NEVER expand toward infinity.                                   |
|  Springs NEVER decay toward zero.                                       |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### Case 2: When $\omega \Delta t > 2$ (The Unstable Frontier)
If $\omega \Delta t > 2$, the discriminant becomes positive: $\Delta_{\text{disc}} > 0$.
The eigenvalues become real numbers.
Because their product $\lambda_1 \cdot \lambda_2 = \det(\mathbf{A}) = 1$, if they are distinct real numbers:
$$\lambda_1 > 1.0, \qquad \lambda_2 < 1.0$$
The root $\lambda_1 > 1.0$ triggers exponential instability!
Therefore, the **critical Courant-Friedrichs-Lewy (CFL) stability limit** for Semi-Implicit Euler is:

$$\mathbf{\Delta t_{\text{critical}} = \frac{2}{\omega}}$$

At standard 60 Hz ($\Delta t = 0.01667\text{ s}$), Semi-Implicit Euler is stable for any physical frequency up to:

$$\omega_{\text{max}} = \frac{2}{0.01667\text{ s}} = 120.0\text{ rad/s} \approx 19.1\text{ Hz}$$

---

### 6.4 The Phase-Space Geometry: The Tilted Shadow Ellipse

Why does Semi-Implicit Euler preserve energy so well, and what does the numerical trajectory look like in phase space?

Recall from Chapter 5 that Semi-Implicit Euler exactly conserves the **Shadow Hamiltonian**:

$$\tilde{\mathcal{H}}(x, v) = \frac{1}{2} m v^2 + \frac{1}{2} k x^2 - \frac{1}{2} k \Delta t x v = \text{constant}$$

Let us analyze the level curves of $\tilde{\mathcal{H}}(x, v) = E_0$.
In the $(x, v)$ plane, this is a general quadratic curve:

$$A x^2 + B x v + C v^2 = E_0$$

Where $A = \frac{1}{2}k$, $B = -\frac{1}{2}k\Delta t$, and $C = \frac{1}{2}m$.
The discriminant is:

$$B^2 - 4 A C = \left(-\frac{1}{2}k\Delta t\right)^2 - 4\left(\frac{1}{2}k\right)\left(\frac{1}{2}m\right) = \frac{1}{4}k^2 \Delta t^2 - km = km \left( \frac{1}{4}\omega^2 \Delta t^2 - 1 \right)$$

When $\omega \Delta t < 2$, $\frac{1}{4}\omega^2 \Delta t^2 < 1$, so the discriminant is strictly **negative**:

$$B^2 - 4 A C < 0$$

A quadratic curve with negative discriminant is an **ELLIPSE**!

```
Phase Space Comparison:
           v ^
             |        Exact Orbit: H = 1/2 m v^2 + 1/2 k x^2
             |           _--~~~--_      (Axis-aligned ellipse)
             |         /     .     \
             |        |    .        |
             |         \ .         /     Semi-Implicit Shadow Orbit:
             |          ^--_._--^        \tilde{H} = H - 1/2 k dt * x v
             |              /            (Tilted Ellipse)
    ---------+-------------/--------------------> x
             |            v
```

#### The Physical Miracle
- Under Forward Euler, trajectories spiral outward toward infinity.
- Under Backward Euler, trajectories spiral inward toward zero.
- Under **Semi-Implicit Euler**, trajectories travel along a **closed, invariant tilted ellipse**!
- The true physical energy $E(t) = \frac{1}{2}mv^2 + \frac{1}{2}kx^2$ fluctuates slightly above and below $E_0$ as the state moves along the tilted ellipse, but the fluctuation is strictly periodic and bounded:
  $$|E(t) - E_0| \le \frac{1}{2} \omega \Delta t E_0$$
- Over millions of steps, the average energy drift is **identically zero**.

---

### 6.5 Ten In-Depth Progressive Worked Examples

#### Example 6.1: Single Step Comparison: Forward vs. Semi-Implicit Euler
*Scenario:* An oscillator has $m = 1.0\text{ kg}$, $k = 100.0\text{ N/m}$ ($\omega = 10.0\text{ rad/s}$).
At $t = 0$, $x_0 = 1.0\text{ m}$, $v_0 = 0.0\text{ m/s}$, initial energy $E_0 = 50.0\text{ J}$.
Calculate position, velocity, and energy after one step of $\Delta t = 0.05\text{ s}$ using:
1. Explicit Forward Euler
2. Semi-Implicit Euler (Velocity First)

*Step 1: Forward Euler calculation (from Chapter 3):*
$$x_1^{\text{FE}} = x_0 + v_0 \Delta t = 1.0 + 0(0.05) = 1.0000\text{ m}$$
$$v_1^{\text{FE}} = v_0 - \omega^2 x_0 \Delta t = 0 - 100(1.0)(0.05) = -5.0000\text{ m/s}$$
$$E_1^{\text{FE}} = \frac{1}{2}(100)(1.0)^2 + \frac{1}{2}(1)(-5.0)^2 = 50.0 + 12.5 = 62.50\text{ J} \quad (+25.0\%)$$

*Step 2: Semi-Implicit Euler calculation:*
- Update velocity first:
  $$v_1^{\text{SIE}} = v_0 - \omega^2 x_0 \Delta t = 0 - 100(1.0)(0.05) = -5.0000\text{ m/s}$$
- Update position using NEW velocity:
  $$x_1^{\text{SIE}} = x_0 + v_1^{\text{SIE}} \Delta t = 1.0 + (-5.0000)(0.05) = 1.0 - 0.2500 = 0.7500\text{ m}$$
- Compute mechanical energy:
  $$E_1^{\text{SIE}} = \frac{1}{2}(100)(0.75)^2 + \frac{1}{2}(1)(-5.0)^2 = 50(0.5625) + 0.5(25.0) = 28.125 + 12.5 = 40.625\text{ J}$$

*Step 3: Evaluate Shadow Energy $\tilde{E}$:*
$$\tilde{E}_0 = E_0 - \frac{1}{2} k \Delta t x_0 v_0 = 50.0 - \frac{1}{2}(100)(0.05)(1.0)(0) = 50.0\text{ J}$$
$$\tilde{E}_1 = E_1 - \frac{1}{2} k \Delta t x_1 v_1 = 40.625 - \frac{1}{2}(100)(0.05)(0.75)(-5.0) = 40.625 - (-9.375) = 40.625 + 9.375 = \mathbf{50.000\text{ J}}$$

*Profound Observation:* While the physical energy fluctuated from $50\text{ J} \to 40.625\text{ J}$, the **Shadow Energy $\tilde{E}$ remained exactly 50.000 Joules down to the last decimal place**!

---

#### Example 6.2: Tracing 5 Steps of Semi-Implicit Euler
*Scenario:* Take the exact system from Example 6.1 ($\omega = 10\text{ rad/s}$, $\Delta t = 0.05\text{ s}$). Trace the state vector $\begin{bmatrix} x_n \\ v_n \end{bmatrix}$, physical energy $E_n$, and shadow energy $\tilde{E}_n$ across 5 steps.

*Transition matrix:* $\omega^2 \Delta t = 5.0$, $\omega^2 \Delta t^2 = 0.25$.
$$\mathbf{A} = \begin{bmatrix} 1 - 0.25 & 0.05 \\ -5.0 & 1 \end{bmatrix} = \begin{bmatrix} 0.75 & 0.05 \\ -5.00 & 1.00 \end{bmatrix}$$

- **Step 0 ($t = 0.00\text{ s}$):**
  $x_0 = 1.000\text{ m}, \quad v_0 = 0.000\text{ m/s}, \quad E_0 = 50.00\text{ J}, \quad \tilde{E}_0 = 50.00\text{ J}$.
- **Step 1 ($t = 0.05\text{ s}$):**
  $v_1 = 0 - 5.0(1.0) = -5.000\text{ m/s}$.
  $x_1 = 1.0 + (-5.0)(0.05) = 0.750\text{ m}$.
  $E_1 = 50(0.75)^2 + 0.5(-5)^2 = 28.125 + 12.5 = 40.625\text{ J}$.
  $\tilde{E}_1 = 40.625 - 2.5(0.75)(-5.0) = 40.625 + 9.375 = 50.00\text{ J}$.
- **Step 2 ($t = 0.10\text{ s}$):**
  $v_2 = v_1 - 5.0(x_1) = -5.000 - 5.0(0.750) = -5.000 - 3.750 = -8.750\text{ m/s}$.
  $x_2 = x_1 + v_2(0.05) = 0.750 + (-8.750)(0.05) = 0.750 - 0.4375 = 0.3125\text{ m}$.
  $E_2 = 50(0.3125)^2 + 0.5(-8.75)^2 = 4.8828 + 38.2813 = 43.164\text{ J}$.
  $\tilde{E}_2 = 43.164 - 2.5(0.3125)(-8.75) = 43.164 + 6.836 = 50.00\text{ J}$.
- **Step 3 ($t = 0.15\text{ s}$):**
  $v_3 = -8.750 - 5.0(0.3125) = -8.750 - 1.5625 = -10.3125\text{ m/s}$.
  $x_3 = 0.3125 + (-10.3125)(0.05) = 0.3125 - 0.515625 = -0.203125\text{ m}$.
  $E_3 = 50(-0.203125)^2 + 0.5(-10.3125)^2 = 2.063 + 53.174 = 55.237\text{ J}$.
  $\tilde{E}_3 = 55.237 - 2.5(-0.203125)(-10.3125) = 55.237 - 5.237 = 50.00\text{ J}$.
- **Step 4 ($t = 0.20\text{ s}$):**
  $v_4 = -10.3125 - 5.0(-0.203125) = -10.3125 + 1.015625 = -9.296875\text{ m/s}$.
  $x_4 = -0.203125 + (-9.296875)(0.05) = -0.203125 - 0.464844 = -0.667969\text{ m}$.
  $E_4 = 50(-0.667969)^2 + 0.5(-9.296875)^2 = 22.309 + 43.216 = 65.525\text{ J}$.
  $\tilde{E}_4 = 65.525 - 2.5(-0.667969)(-9.296875) = 65.525 - 15.525 = 50.00\text{ J}$.
- **Step 5 ($t = 0.25\text{ s}$):**
  $v_5 = -9.296875 - 5.0(-0.667969) = -9.296875 + 3.339844 = -5.957031\text{ m/s}$.
  $x_5 = -0.667969 + (-5.957031)(0.05) = -0.667969 - 0.297852 = -0.965820\text{ m}$.
  $E_5 = 50(-0.965820)^2 + 0.5(-5.957031)^2 = 46.640 + 17.743 = 64.383\text{ J}$.
  $\tilde{E}_5 = 64.383 - 2.5(-0.965820)(-5.957031) = 64.383 - 14.383 = 50.00\text{ J}$.

*Grand Observation:*
Throughout all 5 steps, while physical energy $E$ boundedly oscillated between $40.6\text{ J}$ and $65.5\text{ J}$, the **Shadow Energy $\tilde{E}$ was invariant at 50.000 Joules at every single step**!

---

#### Example 6.3: Tilted Phase-Space Ellipse Equation
*Scenario:* For the system in Example 6.1 ($m = 1.0\text{ kg}$, $k = 100.0\text{ N/m}$, $\Delta t = 0.05\text{ s}$, $E_0 = 50.0\text{ J}$), write the explicit Cartesian equation for the invariant phase-space orbit $f(x, v) = 0$. Find the tilt angle $\theta_{\text{tilt}}$ of the ellipse major axis.

*Step 1: Write Shadow Hamiltonian equation:*
$$\tilde{\mathcal{H}}(x, v) = \frac{1}{2} m v^2 + \frac{1}{2} k x^2 - \frac{1}{2} k \Delta t x v = E_0$$
Substitute $m = 1, k = 100, \Delta t = 0.05, E_0 = 50$:
$$\frac{1}{2} v^2 + 50 x^2 - \frac{1}{2}(100)(0.05) x v = 50$$
$$0.5 v^2 + 50 x^2 - 2.5 x v = 50$$
Multiply by 2 to clear decimals:
$$100 x^2 - 5 x v + v^2 = 100$$

*Step 2: Calculate ellipse tilt angle $\theta_{\text{tilt}}$:*
For a general quadratic form $A x^2 + B x v + C v^2 = \text{const}$, the rotation angle that eliminates the cross-term $x v$ is given by:
$$\cot(2\theta) = \frac{A - C}{B}$$
Here $A = 100$, $B = -5$, $C = 1$:
$$\cot(2\theta) = \frac{100 - 1}{-5} = \frac{99}{-5} = -19.8$$
$$\tan(2\theta) = -\frac{1}{19.8} \approx -0.050505$$
$$2\theta = \arctan(-0.050505) \approx -0.05046\text{ rad} \approx -2.891^\circ$$
$$\theta_{\text{tilt}} \approx -1.45^\circ$$

*Interpretation:* The phase space orbit is an ellipse tilted by a tiny angle of $-1.45^\circ$. Because the ellipse is closed, the simulation can run for a trillion steps without ever leaving this 1D closed loop.

---

#### Example 6.4: Stability Boundary Verification: $\omega \Delta t = 1.9$ vs. $\omega \Delta t = 2.1$
*Scenario:* An oscillator has $\omega = 10.0\text{ rad/s}$.
Compare the eigenvalues and stability of Semi-Implicit Euler for:
1. $\Delta t_1 = 0.19\text{ s}$ ($\omega \Delta t = 1.9 < 2.0$)
2. $\Delta t_2 = 0.21\text{ s}$ ($\omega \Delta t = 2.1 > 2.0$)

*Case 1: $\Delta t = 0.19\text{ s}$ ($\omega \Delta t = 1.9$):*
$$\omega^2 \Delta t^2 = (1.9)^2 = 3.61$$
Characteristic equation:
$$\lambda^2 - (2 - 3.61)\lambda + 1 = 0 \implies \lambda^2 + 1.61\lambda + 1 = 0$$
Discriminant:
$$\Delta_{\text{disc}} = (1.61)^2 - 4(1)(1) = 2.5921 - 4 = -1.4079 < 0$$
Eigenvalues:
$$\lambda = \frac{-1.61 \pm i \sqrt{1.4079}}{2} = -0.805 \pm 0.59328 i$$
Spectral radius:
$$|\lambda| = \sqrt{(-0.805)^2 + (0.59328)^2} = \sqrt{0.648025 + 0.351975} = \sqrt{1.000000} \equiv \mathbf{1.000000}$$
STABLE! The state oscillates boundedly without blowup.

*Case 2: $\Delta t = 0.21\text{ s}$ ($\omega \Delta t = 2.1$):*
$$\omega^2 \Delta t^2 = (2.1)^2 = 4.41$$
Characteristic equation:
$$\lambda^2 - (2 - 4.41)\lambda + 1 = 0 \implies \lambda^2 + 2.41\lambda + 1 = 0$$
Discriminant:
$$\Delta_{\text{disc}} = (2.41)^2 - 4 = 5.8081 - 4 = +1.8081 > 0$$
Eigenvalues (both real):
$$\lambda_{1, 2} = \frac{-2.41 \pm \sqrt{1.8081}}{2} = \frac{-2.41 \pm 1.34466}{2}$$
$$\lambda_1 = \frac{-2.41 - 1.34466}{2} = \frac{-3.75466}{2} \approx \mathbf{-1.8773}$$
$$\lambda_2 = \frac{-2.41 + 1.34466}{2} = \frac{-1.06534}{2} \approx -0.5327$$

*Conclusion:* Since $|\lambda_1| = 1.8773 > 1.0$, on every step the state vector is multiplied by $-1.8773$, alternating signs and expanding exponentially. In 20 steps, the state grows by $(1.8773)^{20} \approx 277,000\times$, completely destroying the simulation. This proves the absolute nature of the $\omega \Delta t < 2$ boundary.

---

#### Example 6.5: Planetary Orbit Simulation: Apsidal Precession Without Radial Decay
*Scenario:* A satellite in an eccentric orbit around a planet is simulated with Semi-Implicit Euler.
Explain why Semi-Implicit Euler causes an unphysical **apsidal precession** (the ellipse rotates in its orbital plane), but strictly prevents the satellite from spiraling inward or outward.

*Step 1: The true Kepler Hamiltonian:*
$$\mathcal{H}(\mathbf{r}, \mathbf{p}) = \frac{\|\mathbf{p}\|^2}{2m} - \frac{G M m}{r}$$
In continuous physics, Kepler orbits are closed ellipses whose major axis is stationary (Laplace-Runge-Lenz vector $\mathbf{A} = \mathbf{p} \times \mathbf{L} - m k \hat{\mathbf{r}}$ is conserved).

*Step 2: The Shadow Hamiltonian of Semi-Implicit Euler:*
Semi-Implicit Euler exactly solves:
$$\tilde{\mathcal{H}} = \mathcal{H} - \frac{1}{2} \Delta t (\mathbf{p} \cdot \nabla V) + O(\Delta t^2) = \mathcal{H} - \frac{G M m \Delta t}{2 r^3} (\mathbf{r} \cdot \mathbf{p}) + O(\Delta t^2)$$
Notice that the perturbation term $-\frac{G M m \Delta t}{2 r^3} (\mathbf{r} \cdot \mathbf{p})$ breaks spherical rotational symmetry slightly!

*Step 3: Effect on the orbit:*
- Radial stability: Because $\tilde{\mathcal{H}}$ is an exact invariant, the radial bounds (periapsis $r_{\text{min}}$ and apoapsis $r_{\text{max}}$) are strictly preserved. The satellite can never spiral into the planet or escape!
- Apsidal precession: The non-central perturbation causes the periapsis to precess by an angle $\Delta \phi \approx C \Delta t$ radians per orbit.
In game physics and astronomical visualization, a slow, uniform orbital precession is visually undetectable and physically plausible, whereas radial spiral decay is game-breaking.

---

#### Example 6.6: Mathematical Proof of Symplectic Shear Composition
*Scenario:* Explicitly multiply the $2 \times 2$ Drift matrix $\mathbf{M}_{\mathcal{D}} = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$ and Kick matrix $\mathbf{M}_{\mathcal{K}} = \begin{bmatrix} 1 & 0 \\ -\omega^2 \Delta t & 1 \end{bmatrix}$.
Show that:
1. $\mathbf{M}_{\mathcal{D}} \mathbf{M}_{\mathcal{K}}$ yields Semi-Implicit Euler (Velocity First).
2. $\mathbf{M}_{\mathcal{K}} \mathbf{M}_{\mathcal{D}}$ yields Symplectic Euler-B (Position First).

*Part 1: Kick first, then Drift ($\mathbf{M}_{\mathcal{D}} \cdot \mathbf{M}_{\mathcal{K}}$):*
$$\mathbf{M}_{\text{SIE-A}} = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ -\omega^2 \Delta t & 1 \end{bmatrix} = \begin{bmatrix} (1)(1) + (\Delta t)(-\omega^2 \Delta t) & (1)(0) + (\Delta t)(1) \\ (0)(1) + (1)(-\omega^2 \Delta t) & (0)(0) + (1)(1) \end{bmatrix} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$
This matches the exact state matrix of Semi-Implicit Euler derived in Section 6.3!

*Part 2: Drift first, then Kick ($\mathbf{M}_{\mathcal{K}} \cdot \mathbf{M}_{\mathcal{D}}$):*
$$\mathbf{M}_{\text{SIE-B}} = \begin{bmatrix} 1 & 0 \\ -\omega^2 \Delta t & 1 \end{bmatrix} \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} (1)(1) + (0)(0) & (1)(\Delta t) + (0)(1) \\ (-\omega^2 \Delta t)(1) + (1)(0) & (-\omega^2 \Delta t)(\Delta t) + (1)(1) \end{bmatrix} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 - \omega^2 \Delta t^2 \end{bmatrix}$$
Notice that $\det(\mathbf{M}_{\text{SIE-B}}) = (1)(1 - \omega^2 \Delta t^2) - (\Delta t)(-\omega^2 \Delta t) = 1.000000$.
Both forms are proven to be elementary symplectic shears.

---

#### Example 6.7: Maximum Energy Fluctuation Amplitude $\Delta E_{\text{max}}$
*Scenario:* An oscillator with frequency $\omega = 5.0\text{ rad/s}$ and nominal energy $E_0 = 100.0\text{ J}$ is simulated with Semi-Implicit Euler at 60 Hz ($\Delta t = \frac{1}{60}\text{ s}$).
Calculate the maximum peak-to-peak physical energy fluctuation $\Delta E_{\text{max}} = E_{\text{max}} - E_{\text{min}}$ over an entire oscillation cycle.

*Step 1: Relate physical energy $E$ to Shadow Energy $\tilde{E}$:*
$$\tilde{E} = E - \frac{1}{2} k \Delta t x v \implies E = \tilde{E} + \frac{1}{2} k \Delta t x v$$
Since $\tilde{E} \equiv E_0$ is constant:
$$\Delta E(t) = E(t) - E_0 = \frac{1}{2} k \Delta t x(t) v(t)$$

*Step 2: Find maximum of $x(t) v(t)$:*
For harmonic motion with amplitude $A$:
$$x(t) \approx A \cos(\omega t), \qquad v(t) \approx -A \omega \sin(\omega t)$$
$$x(t) v(t) = -A^2 \omega \sin(\omega t) \cos(\omega t) = -\frac{1}{2} A^2 \omega \sin(2\omega t)$$
The maximum absolute value is:
$$\max |x(t) v(t)| = \frac{1}{2} A^2 \omega$$

*Step 3: Substitute $E_0 = \frac{1}{2} k A^2$:*
$$\max |\Delta E| = \frac{1}{2} k \Delta t \left( \frac{1}{2} A^2 \omega \right) = \frac{1}{2} \omega \Delta t \left( \frac{1}{2} k A^2 \right) = \frac{1}{2} \omega \Delta t E_0$$

*Step 4: Numerical evaluation:*
$$\omega \Delta t = 5.0 \times \frac{1}{60} = \frac{5}{60} = \frac{1}{12} \approx 0.08333$$
$$\max |\Delta E| = \frac{1}{2} \times \left(\frac{1}{12}\right) \times 100.0\text{ J} = \frac{100.0}{24} \approx 4.167\text{ J}$$
Peak-to-peak fluctuation:
$$\Delta E_{\text{max}} = 2 \times \max |\Delta E| = 2 \times 4.167\text{ J} \approx 8.333\text{ J} \quad (8.33\%)$$

*Sanity Check:* Over billions of cycles, energy will oscillate between $95.83\text{ J}$ and $104.17\text{ J}$, but will never exceed these bounds!

---

#### Example 6.8: Damped Harmonic Oscillator Under Semi-Implicit Euler
*Scenario:* A damped oscillator obeys:
$$\ddot{x} + 2\gamma \dot{x} + \omega_0^2 x = 0$$
where $\omega_0 = 10.0\text{ rad/s}$ and damping $\gamma = 0.5\text{ s}^{-1}$.
Implement Semi-Implicit Euler with $\Delta t = 0.02\text{ s}$. Show that unlike Forward Euler (which blew up in Example 3.5), Semi-Implicit Euler preserves physical damping stably.

*Step 1: Discretization equations:*
To maintain stability with damping, update velocity first using damping at old velocity:
$$v_{n+1} = v_n - (2\gamma v_n + \omega_0^2 x_n)\Delta t = (1 - 2\gamma \Delta t) v_n - \omega_0^2 \Delta t x_n$$
$$x_{n+1} = x_n + v_{n+1} \Delta t$$

*Step 2: Construct transition matrix:*
$$v_{n+1} = (1 - 2(0.5)(0.02)) v_n - (100)(0.02) x_n = 0.98 v_n - 2.0 x_n$$
$$x_{n+1} = x_n + 0.02(0.98 v_n - 2.0 x_n) = (1 - 0.04) x_n + 0.0196 v_n = 0.96 x_n + 0.0196 v_n$$
$$\mathbf{A} = \begin{bmatrix} 0.96 & 0.0196 \\ -2.0 & 0.98 \end{bmatrix}$$

*Step 3: Compute determinant:*
$$\det(\mathbf{A}) = (0.96)(0.98) - (0.0196)(-2.0) = 0.9408 + 0.0392 = 0.9800$$
Notice that $\det(\mathbf{A}) = 1 - 2\gamma \Delta t = 1 - 2(0.5)(0.02) = 0.98$.
The spectral radius is $|\lambda| = \sqrt{0.98} \approx 0.98995 < 1.0$.

*Conclusion:* The state decays at exactly the physical rate $e^{-\gamma \Delta t} = e^{-0.01} \approx 0.99005$. Semi-Implicit Euler stably reproduces physical viscous damping without any artificial anti-damping explosion!

---

#### Example 6.9: Large-Amplitude 2D Pendulum Benchmark
*Scenario:* A rigid pendulum of length $L = 1.0\text{ m}$ is released from a massive horizontal angle $\theta_0 = 90^\circ$ ($1.5708\text{ rad}$) with $\dot{\theta}_0 = 0$. ($g = 9.8\text{ m/s}^2$).
Equation: $\ddot{\theta} = -\frac{g}{L} \sin \theta = -9.8 \sin \theta$.
Execute 2 steps of Semi-Implicit Euler with $\Delta t = 0.05\text{ s}$.

- **Step 0 ($t = 0.00\text{ s}$):**
  $\theta_0 = 1.5708\text{ rad}, \quad \omega_0 = 0.0\text{ rad/s}$.
  Acceleration: $\alpha_0 = -9.8 \sin(1.5708) = -9.8000\text{ rad/s}^2$.
- **Step 1 ($t = 0.05\text{ s}$):**
  $$\omega_1 = \omega_0 + \alpha_0 \Delta t = 0 + (-9.8000)(0.05) = -0.4900\text{ rad/s}$$
  $$\theta_1 = \theta_0 + \omega_1 \Delta t = 1.5708 + (-0.4900)(0.05) = 1.5708 - 0.0245 = 1.5463\text{ rad}$$
  New acceleration: $\alpha_1 = -9.8 \sin(1.5463) = -9.8(0.99969) = -9.7970\text{ rad/s}^2$.
- **Step 2 ($t = 0.10\text{ s}$):**
  $$\omega_2 = \omega_1 + \alpha_1 \Delta t = -0.4900 + (-9.7970)(0.05) = -0.4900 - 0.48985 = -0.97985\text{ rad/s}$$
  $$\theta_2 = \theta_1 + \omega_2 \Delta t = 1.5463 + (-0.97985)(0.05) = 1.5463 - 0.04899 = 1.4973\text{ rad}$$

*Sanity Check:* The angle smoothly decreases from $90^\circ$ to $88.6^\circ$ to $85.8^\circ$ as gravity smoothly accelerates the pendulum downward.

---

#### Example 6.10: Complete TypeScript Implementation of Semi-Implicit Euler
*Scenario:* Write an optimal, zero-allocation TypeScript function that updates an array of $N$ particles using Semi-Implicit Euler, incorporating air resistance drag.

```typescript
export interface ParticleState {
  posX: Float64Array;
  posY: Float64Array;
  velX: Float64Array;
  velY: Float64Array;
  invMass: Float64Array;
  count: number;
}

export function integrateSemiImplicitEuler(
  state: ParticleState,
  dt: number,
  gravityY: number = -9.81,
  dragCoeff: number = 0.01
): void {
  const N = state.count;
  const posX = state.posX;
  const posY = state.posY;
  const velX = state.velX;
  const velY = state.velY;
  const invMass = state.invMass;

  for (let i = 0; i < N; i++) {
    const im = invMass[i];
    if (im === 0.0) continue; // Static boundary

    // 1. Calculate Forces (Gravity + Linear Drag)
    const vx = velX[i];
    const vy = velY[i];
    const fx = -dragCoeff * vx;
    const fy = (1.0 / im) * gravityY - dragCoeff * vy;

    // 2. KICK: Update Velocity FIRST
    const newVx = vx + (fx * im) * dt;
    const newVy = vy + (fy * im) * dt;
    velX[i] = newVx;
    velY[i] = newVy;

    // 3. DRIFT: Update Position using the NEW Velocity
    posX[i] += newVx * dt;
    posY[i] += newVy * dt;
  }
}
```

---

### 6.6 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 6.1 – 6.2)

##### Exercise 6.1
State the exact algorithmic difference between Explicit Forward Euler and Semi-Implicit Euler. Why is Semi-Implicit Euler described as an "asynchronous" or "staggered" time-stepping scheme?

##### Exercise 6.2
Why is Semi-Implicit Euler the standard default integrator in commercial real-time game physics engines (e.g., Box2D, PhysX, Havok) rather than Forward Euler or Classical Runge-Kutta 4?

---

#### Tier 2: Symplectic Geometry & Operator Splitting (Exercises 6.3 – 6.4)

##### Exercise 6.3
Express the Semi-Implicit Euler mapping as the product of two elementary shear matrices $\mathbf{M}_{\mathcal{D}}$ (Drift) and $\mathbf{M}_{\mathcal{K}}$ (Kick). Prove that their product satisfies $\det(\mathbf{M}) \equiv 1.0$.

##### Exercise 6.4
A student swaps the order of operators to Drift-First then Kick-Second (Symplectic Euler-B):
$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t, \qquad \mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_{n+1}) \Delta t$$
Derive the state transition matrix for $\ddot{x} = -\omega^2 x$ and prove that it has the exact same characteristic equation and stability limits as Velocity-First Semi-Implicit Euler.

---

#### Tier 3: Stability Limits & Eigenvalue Analysis (Exercises 6.5 – 6.6)

##### Exercise 6.5
Derive the critical Courant-Friedrichs-Lewy (CFL) stability criterion $\omega \Delta t < 2.0$ for Semi-Implicit Euler.
If a video game runs at 60 Hz ($\Delta t = 16.67\text{ ms}$), what is the maximum spring constant $k$ that can be safely simulated for a particle of mass $m = 0.5\text{ kg}$?

##### Exercise 6.6
What happens to the eigenvalues of Semi-Implicit Euler when $\omega \Delta t$ exceeds 2.0? Explain why the instability causes the state vector to oscillate with alternating signs and exponentially expanding amplitude.

---

#### Tier 4: Phase Space & Shadow Invariants (Exercises 6.7 – 6.8)

##### Exercise 6.7
For a harmonic oscillator with mass $m = 2.0\text{ kg}$, stiffness $k = 50.0\text{ N/m}$, and timestep $\Delta t = 0.040\text{ s}$:
1. Write the explicit algebraic equation for the Shadow Hamiltonian $\tilde{\mathcal{H}}(x, v)$.
2. If the initial conditions are $x_0 = 0.5\text{ m}, v_0 = 0.0\text{ m/s}$, calculate the numerical value of $\tilde{\mathcal{H}}$.
3. What is the maximum physical energy $E_{\text{max}}$ reached during the simulation?

##### Exercise 6.8
Explain why Semi-Implicit Euler causes an unphysical orbital precession in gravitational two-body problems. How does the precession rate scale with timestep $\Delta t$?

---

#### Tier 5: High-Frequency Dynamics & Constraints (Exercises 6.9 – 6.10)

##### Exercise 6.9
A stiff constraint spring in a suspension bridge simulation has $\omega = 500\text{ rad/s}$.
1. Can Semi-Implicit Euler simulate this spring stably at 60 Hz?
2. If not, what is the minimum sub-stepping frequency (in Hz) required to maintain numerical stability?

##### Exercise 6.10
Prove that for any Hamiltonian system of the form $\mathcal{H} = \frac{1}{2}\mathbf{p}^T \mathbf{M}^{-1} \mathbf{p} + V(\mathbf{q})$, Semi-Implicit Euler has a global truncation error of $O(\Delta t)$ (Order 1), yet conserves the Shadow Hamiltonian to order $O(\Delta t)$. Why is an Order-1 symplectic integrator superior to an Order-4 non-symplectic integrator over long time horizons?

---

### 6.7 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 6.1
*Algorithmic Difference:*
- In **Explicit Forward Euler**, both position and velocity updates use only states from the *start* of the interval:
  $$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t, \qquad \mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_n) \Delta t$$
- In **Semi-Implicit Euler**, velocity is updated first, and that *newly updated velocity* is immediately used to update position:
  $$\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_n) \Delta t, \qquad \mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1} \Delta t$$

*Why "Asynchronous / Staggered":*
The velocity and position updates do not evaluate at the exact same chronological instant. Velocity receives a "kick" across the interval, and position "drifts" along the updated velocity vector. This staggering creates a phase-space shear that preserves symplectic area.

---

#### Solution to Exercise 6.2
Semi-Implicit Euler is the universal standard in commercial game physics engines for three compelling reasons:
1. **Computational Speed:** It requires exactly one force evaluation per particle and zero matrix inversions. It executes at the maximum theoretical memory streaming bandwidth of modern CPUs/GPUs.
2. **Symplectic Energy Stability:** Unlike Forward Euler (which explodes) and Backward Euler (which artificially freezes motion), Semi-Implicit Euler strictly bounds energy oscillations. Springs, ragdolls, and vehicles remain stable without losing vitality.
3. **Collision Constraint Compatibility:** In real-time engines, collision detection modifies velocities instantaneously via impulse solvers ($\mathbf{v} \leftarrow \mathbf{v} + \mathbf{J}/m$). Because Semi-Implicit Euler updates position *after* velocity, collision impulses immediately prevent objects from penetrating walls in the same frame!

---

#### Solution to Exercise 6.3
*Operator Decomposition:*
Semi-Implicit Euler is the product of:
$$\mathbf{M}_{\text{SIE}} = \mathbf{M}_{\mathcal{D}} \cdot \mathbf{M}_{\mathcal{K}} = \begin{bmatrix} \mathbf{I} & \Delta t \mathbf{I} \\ \mathbf{0} & \mathbf{I} \end{bmatrix} \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ -\omega^2 \Delta t \mathbf{I} & \mathbf{I} \end{bmatrix}$$

*Determinant Proof:*
Using the determinant product rule:
$$\det(\mathbf{M}_{\text{SIE}}) = \det(\mathbf{M}_{\mathcal{D}}) \cdot \det(\mathbf{M}_{\mathcal{K}})$$
Both $\mathbf{M}_{\mathcal{D}}$ and $\mathbf{M}_{\mathcal{K}}$ are triangular block matrices with identity on the diagonal:
$$\det(\mathbf{M}_{\mathcal{D}}) = 1.0, \qquad \det(\mathbf{M}_{\mathcal{K}}) = 1.0$$
Therefore:
$$\det(\mathbf{M}_{\text{SIE}}) = 1.0 \times 1.0 \equiv \mathbf{1.000000}$$
$\blacksquare$ Phase-space volume is identically conserved.

---

#### Solution to Exercise 6.4
*Symplectic Euler-B State Matrix:*
Given:
$$x_{n+1} = x_n + v_n \Delta t$$
$$v_{n+1} = v_n - \omega^2 x_{n+1} \Delta t = v_n - \omega^2 (x_n + v_n \Delta t)\Delta t = -\omega^2 \Delta t x_n + (1 - \omega^2 \Delta t^2) v_n$$
State matrix:
$$\mathbf{A}_{\text{SIE-B}} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 - \omega^2 \Delta t^2 \end{bmatrix}$$

*Characteristic Equation:*
$$\det(\mathbf{A}_{\text{SIE-B}} - \lambda \mathbf{I}) = (1 - \lambda)(1 - \omega^2 \Delta t^2 - \lambda) + \omega^2 \Delta t^2 = 0$$
$$\lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + (1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2) = 0$$
$$\lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + 1 = 0$$
This characteristic equation is **100% identical** to that of Symplectic Euler-A!
The eigenvalues, spectral radius, and stability condition $\omega \Delta t < 2$ are completely identical.
$\blacksquare$

---

#### Solution to Exercise 6.5
*Part 1: Derivation of $\omega \Delta t < 2.0$:*
From the characteristic equation $\lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + 1 = 0$, the roots are:
$$\lambda = \frac{(2 - \omega^2 \Delta t^2) \pm \sqrt{\omega^4 \Delta t^4 - 4\omega^2 \Delta t^2}}{2} = \frac{(2 - \omega^2 \Delta t^2) \pm \sqrt{-\omega^2 \Delta t^2(4 - \omega^2 \Delta t^2)}}{2}$$
For the roots to be complex conjugates with magnitude $|\lambda| = 1$, the discriminant must be strictly negative:
$$-\omega^2 \Delta t^2 (4 - \omega^2 \Delta t^2) < 0 \implies 4 - \omega^2 \Delta t^2 > 0 \implies \omega^2 \Delta t^2 < 4 \implies \mathbf{\omega \Delta t < 2.0}$$

*Part 2: Maximum spring constant calculation:*
Given: $m = 0.5\text{ kg}$, $f = 60\text{ Hz} \implies \Delta t = \frac{1}{60}\text{ s}$.
$$\omega_{\text{max}} < \frac{2}{\Delta t} = \frac{2}{1/60} = 120.0\text{ rad/s}$$
Since $\omega = \sqrt{k/m}$:
$$\frac{k}{m} < \omega_{\text{max}}^2 = (120.0)^2 = 14,400\text{ s}^{-2}$$
$$k_{\text{max}} < m \times 14,400 = 0.5 \times 14,400 = 7,200\text{ N/m}$$
The maximum safe spring constant is **$7,200\text{ N/m}$**. Any spring stiffer than this will explode at 60 Hz.

---

#### Solution to Exercise 6.6
When $\omega \Delta t > 2.0$:
1. The discriminant becomes positive: $\Delta_{\text{disc}} = \omega^2 \Delta t^2(\omega^2 \Delta t^2 - 4) > 0$.
2. The eigenvalues become two real numbers:
   $$\lambda_1 = \frac{2 - \omega^2 \Delta t^2 - \sqrt{\Delta_{\text{disc}}}}{2}, \qquad \lambda_2 = \frac{2 - \omega^2 \Delta t^2 + \sqrt{\Delta_{\text{disc}}}}{2}$$
3. Since $\omega \Delta t > 2 \implies 2 - \omega^2 \Delta t^2 < -2$. Both eigenvalues are negative!
4. Because $\lambda_1 \lambda_2 = \det(\mathbf{A}) = 1$, one eigenvalue must satisfy $|\lambda_1| > 1.0$ and the other $|\lambda_2| < 1.0$.
5. The dominant mode evolves as $\mathbf{y}_n \propto \lambda_1^n \mathbf{u}_1$.
Because $\lambda_1 < -1.0$:
- The negative sign causes the state vector to flip direction on every step ($(-1)^n$).
- The magnitude $|\lambda_1| > 1$ causes the amplitude to expand exponentially.
The simulation alternates violently between positive and negative infinity, blowing up the system.

---

#### Solution to Exercise 6.7
Given: $m = 2.0\text{ kg}$, $k = 50.0\text{ N/m}$, $\Delta t = 0.040\text{ s}$, $x_0 = 0.5\text{ m}$, $v_0 = 0.0\text{ m/s}$.

*Part 1: Shadow Hamiltonian equation:*
$$\tilde{\mathcal{H}}(x, v) = \frac{1}{2} m v^2 + \frac{1}{2} k x^2 - \frac{1}{2} k \Delta t x v$$
$$\tilde{\mathcal{H}}(x, v) = \frac{1}{2}(2.0) v^2 + \frac{1}{2}(50.0) x^2 - \frac{1}{2}(50.0)(0.040) x v$$
$$\tilde{\mathcal{H}}(x, v) = v^2 + 25.0 x^2 - 1.0 x v$$

*Part 2: Initial numerical value of $\tilde{\mathcal{H}}$:*
$$\tilde{\mathcal{H}}_0 = (0)^2 + 25.0(0.5)^2 - 1.0(0.5)(0) = 25.0(0.25) = 6.25\text{ Joules}$$

*Part 3: Maximum physical energy $E_{\text{max}}$:*
Natural frequency: $\omega = \sqrt{k/m} = \sqrt{50/2} = 5.0\text{ rad/s}$.
From Example 6.7:
$$\max |\Delta E| \approx \frac{1}{2} \omega \Delta t E_0 = \frac{1}{2}(5.0)(0.040)(6.25) = \frac{1}{2}(0.20)(6.25) = 0.10 \times 6.25 = 0.625\text{ J}$$
Maximum energy:
$$E_{\text{max}} = E_0 + \max |\Delta E| = 6.25 + 0.625 = 6.875\text{ Joules}$$

---

#### Solution to Exercise 6.8
*Cause of Orbital Precession:*
In an unperturbed $1/r^2$ gravitational field, the continuous potential is spherically symmetric ($V(r) = -G M m / r$).
The Shadow Hamiltonian of Semi-Implicit Euler introduces an effective non-central perturbation:
$$\tilde{\mathcal{H}} = \mathcal{H} - \frac{1}{2} \Delta t (\mathbf{v} \cdot \nabla V) + O(\Delta t^2)$$
Because the velocity vector $\mathbf{v}$ is not radially aligned in an eccentric orbit, the perturbation breaks the rotational symmetry of the Laplace-Runge-Lenz vector.

*Precession Scaling with Timestep:*
According to first-order perturbation theory, the secular rate of apsidal advance $\dot{\varpi}$ is proportional to the perturbation parameter:
$$\dot{\varpi} \propto \Delta t$$
The orbital ellipse slowly rotates by an angle $\Delta \varpi \approx C \cdot \Delta t$ radians per orbital period. Halving $\Delta t$ cuts the rate of precession in half, while the radial distance bounds remain 100% stable.

---

#### Solution to Exercise 6.9
Given: $\omega = 500\text{ rad/s}$.

*Part 1: Stability check at 60 Hz:*
$\Delta t = \frac{1}{60}\text{ s} \approx 0.016667\text{ s}$.
$$\omega \Delta t = 500 \times \frac{1}{60} \approx 8.333$$
Since $8.333 > 2.0$, Semi-Implicit Euler **CANNOT** stably simulate this spring at 60 Hz. It will blow up within 3 frames.

*Part 2: Minimum sub-stepping frequency:*
To satisfy $\omega \Delta t_{\text{sub}} < 2.0$:
$$\Delta t_{\text{sub}} < \frac{2}{\omega} = \frac{2}{500} = 0.004\text{ s} = 4.0\text{ ms}$$
Minimum sub-stepping frequency:
$$f_{\text{sub}} > \frac{1}{0.004\text{ s}} = 250\text{ Hz}$$
Number of sub-steps per 60 Hz frame:
$$N_{\text{sub}} = \left\lceil \frac{250\text{ Hz}}{60\text{ Hz}} \right\rceil = 5\text{ sub-steps}$$
Running 5 sub-steps per frame keeps the simulation 100% stable.

---

#### Solution to Exercise 6.10
*Why Order-1 Symplectic Trumps Order-4 Non-Symplectic:*
1. **Truncation Order vs. Geometric Invariants:**
   - Semi-Implicit Euler has a local truncation error of $O(\Delta t^2)$ and global error of $O(\Delta t)$ (Order 1).
   - Classical RK4 has a local error of $O(\Delta t^5)$ and global error of $O(\Delta t^4)$ (Order 4).
2. **Short-Term vs. Long-Term Regimes:**
   - Over 10 steps, RK4 is vastly more accurate than Semi-Implicit Euler.
   - However, RK4 is **non-symplectic**: its state transition matrix has determinant $\det \ne 1.0$ and introduces an artificial damping term $\propto O(\Delta t^6)$ per step.
   - Over $N = 1,000,000$ steps (long time horizons), RK4's non-symplectic damping accumulates monotonically without bound:
     $$E(t) = E_0 e^{-c \Delta t^5 t}$$
     The system irreversibly drains its energy, collapsing orbits and freezing pendulums.
3. **The Symplectic Guarantee:**
   - Semi-Implicit Euler conserves the Shadow Hamiltonian $\tilde{\mathcal{H}} = \mathcal{H} + O(\Delta t)$ identically.
   - Its energy error is strictly bounded for all time: $|E(t) - E_0| \le C \Delta t$ for $t \in [0, \infty)$.
   - It will never decay and never explode, even across billions of integration steps.
Therefore, for long-term physical fidelity, **symplecticity is vastly more important than polynomial order**.
$\blacksquare$
