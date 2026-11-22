# Chapter 04: Implicit (Backward) Euler — Stiff Equations & Artificial Damping

> *"If Forward Euler is an arsonist that burns down the physical universe by pumping explosive energy into every spring, Backward Euler is an ocean of cold molasses. It achieves mathematical peace through total destruction: it never explodes, but it suffocates physical motion under a suffocating shroud of artificial numerical viscosity."*

---

### 4.1 The Philosophy of Implicit Time-Stepping

In Chapter 3, we diagnosed the fatal pathology of Explicit Forward Euler: by evaluating force derivatives at the *beginning* of the time step ($t_n$), the algorithm overshoots the true physical trajectory, multiplying mechanical energy by $(1 + \omega^2 \Delta t^2) > 1$ on every iteration.

A natural mathematical hypothesis arises:
*What happens if, instead of evaluating the force at the past state $t_n$, we evaluate the force at the **future state** $t_{n+1}$?*

This is the foundational concept of **Implicit Backward Euler** (also known as the Backward Difference Method).

Given the general Initial Value Problem:

$$\dot{\mathbf{y}}(t) = \mathbf{f}(\mathbf{y}(t), t), \qquad \mathbf{y}(t_0) = \mathbf{y}_0$$

Backward Euler approximates the time derivative by the backward difference at $t_{n+1}$:

$$\frac{\mathbf{y}_{n+1} - \mathbf{y}_n}{\Delta t} \approx \dot{\mathbf{y}}(t_{n+1}) = \mathbf{f}(\mathbf{y}_{n+1}, t_{n+1})$$

Multiplying by $\Delta t$ and rearranging yields the canonical **Implicit Backward Euler Algorithm**:

$$\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \cdot \mathbf{f}(\mathbf{y}_{n+1}, t_{n+1})$$

```
y
^                                                    True Curve y(t)
|                                                        . - ~ ~ ~
|                                                    . '  /
|                                                . '     /
|                         Tangent Line       . '        /
|                         at t_{n+1}     . '           /
|                           _ - - - - * <-------------+-- Backward Euler
|                       _ -         . '               |   y_{n+1}
|                   _ -         . '                   |
|               _ -         . '                       |   (Tangent evaluated
|           _ -         . '                           |    at the DESTINATION)
|       * - - - - - . '                               |
|      y_n                                            |
|       |                                             |
+-------+---------------------------------------------+------------> t
       t_n                                           t_{n+1}
        |<------------------- dt -------------------->|
```

---

### 4.2 The Computational Burden: The Implicit Root-Finding Barrier

Notice the profound computational distinction between Forward Euler and Backward Euler:

- In **Forward Euler**: $\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{f}(\mathbf{y}_n)$.
  The right-hand side contains only known quantities. The computer performs a simple evaluation and addition.
- In **Backward Euler**: $\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{f}(\mathbf{y}_{n+1})$.
  The unknown future state $\mathbf{y}_{n+1}$ appears on **both sides of the equation**!

To find $\mathbf{y}_{n+1}$, the computer cannot simply compute—it must **solve an algebraic equation or root-finding problem** on every single numerical step!

#### 1. Linear Force Fields (Matrix Inversion)
If the physical force field is linear: $\mathbf{f}(\mathbf{y}) = \mathbf{A}\mathbf{y}$, the Backward Euler equation becomes:

$$\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{A} \mathbf{y}_{n+1}$$

Grouping the unknown vector $\mathbf{y}_{n+1}$ on the left-hand side:

$$(\mathbf{I} - \Delta t \mathbf{A}) \mathbf{y}_{n+1} = \mathbf{y}_n$$

$$\mathbf{y}_{n+1} = (\mathbf{I} - \Delta t \mathbf{A})^{-1} \mathbf{y}_n$$

Instead of a simple multiplication, each step requires inverting a matrix $(\mathbf{I} - \Delta t \mathbf{A})$ or solving a system of linear equations (via LU decomposition, Conjugate Gradient, or Cholesky factorization). For $N = 10,000$ particles in 3D, $\mathbf{A}$ is a $60,000 \times 60,000$ matrix!

#### 2. Non-Linear Force Fields (Newton-Raphson Iteration)
If the forces are non-linear (e.g., quadratic drag $\mathbf{F} \propto -\|\mathbf{v}\|\mathbf{v}$, celestial gravitation $1/r^2$, or elastic cloth geometry), we must define a residual vector function:

$$\mathbf{g}(\mathbf{y}_{n+1}) \equiv \mathbf{y}_{n+1} - \mathbf{y}_n - \Delta t \mathbf{f}(\mathbf{y}_{n+1}) = \mathbf{0}$$

To find the root $\mathbf{g}(\mathbf{y}_{n+1}) = \mathbf{0}$, the physics engine must execute an inner **Newton-Raphson iterative loop**:

$$\mathbf{y}_{n+1}^{(k+1)} = \mathbf{y}_{n+1}^{(k)} - \left[ \nabla_{\mathbf{y}} \mathbf{g}(\mathbf{y}_{n+1}^{(k)}) \right]^{-1} \mathbf{g}(\mathbf{y}_{n+1}^{(k)})$$

Where $\nabla_{\mathbf{y}} \mathbf{g} = \mathbf{I} - \Delta t \mathbf{J}_{\mathbf{f}}$ is the Jacobian matrix of the physical system. Each single physics tick now requires multiple Jacobian evaluations and matrix solves, multiplying CPU cost by 10 to 100 times!

---

### 4.3 The Simple Harmonic Oscillator Under Backward Euler

Let us subject Backward Euler to the same rigorous benchmark as Chapter 3: the undamped simple harmonic oscillator:

$$\begin{cases}
\dot{x} = v \\
\dot{v} = -\omega^2 x
\end{cases}$$

Discretizing via Backward Euler:

$$\begin{cases}
x_{n+1} = x_n + v_{n+1} \Delta t \\
v_{n+1} = v_n - \omega^2 x_{n+1} \Delta t
\end{cases}$$

Notice that $x_{n+1}$ depends on $v_{n+1}$, and $v_{n+1}$ depends on $x_{n+1}$. This is a coupled linear system.

#### Algebraic Decoupling
Substitute the equation for $x_{n+1}$ directly into the equation for $v_{n+1}$:

$$v_{n+1} = v_n - \omega^2 (x_n + v_{n+1} \Delta t) \Delta t = v_n - \omega^2 \Delta t x_n - \omega^2 \Delta t^2 v_{n+1}$$

Group all terms involving $v_{n+1}$ on the left-hand side:

$$v_{n+1} + \omega^2 \Delta t^2 v_{n+1} = v_n - \omega^2 \Delta t x_n$$

$$(1 + \omega^2 \Delta t^2) v_{n+1} = v_n - \omega^2 \Delta t x_n$$

$$v_{n+1} = \frac{-\omega^2 \Delta t x_n + v_n}{1 + \omega^2 \Delta t^2}$$

Now substitute this explicit formula for $v_{n+1}$ back into the $x_{n+1}$ equation:

$$x_{n+1} = x_n + \Delta t \left( \frac{-\omega^2 \Delta t x_n + v_n}{1 + \omega^2 \Delta t^2} \right) = \frac{(1 + \omega^2 \Delta t^2) x_n - \omega^2 \Delta t^2 x_n + \Delta t v_n}{1 + \omega^2 \Delta t^2}$$

$$x_{n+1} = \frac{x_n + \Delta t v_n}{1 + \omega^2 \Delta t^2}$$

#### The State Transition Matrix
In unified matrix-vector notation:

$$\begin{bmatrix} x_{n+1} \\ v_{n+1} \end{bmatrix} = \mathbf{A}_{\text{Backward}} \begin{bmatrix} x_n \\ v_n \end{bmatrix}$$

$$\mathbf{A}_{\text{Backward}} = \frac{1}{1 + \omega^2 \Delta t^2} \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

Notice the remarkable structural symmetry: the matrix inside is **identical to the Forward Euler matrix**, but it is divided by the scalar normalization factor $(1 + \omega^2 \Delta t^2)$!

---

### 4.4 The Eigenvalue Analysis: Unconditional Stability (A-Stability)

To evaluate the numerical stability and long-term energy behavior of Backward Euler, we compute the eigenvalues of $\mathbf{A}_{\text{Backward}}$.

#### Step 1: Characteristic Equation
$$\det(\mathbf{A}_{\text{Backward}} - \lambda \mathbf{I}) = 0$$

Let $\alpha = \frac{1}{1 + \omega^2 \Delta t^2}$. Then:

$$\det\begin{bmatrix} \alpha - \lambda & \alpha \Delta t \\ -\alpha \omega^2 \Delta t & \alpha - \lambda \end{bmatrix} = (\alpha - \lambda)^2 + \alpha^2 \omega^2 \Delta t^2 = 0$$

$$(\alpha - \lambda)^2 = -\alpha^2 \omega^2 \Delta t^2$$

$$\alpha - \lambda = \pm i \alpha \omega \Delta t \implies \lambda = \alpha (1 \pm i \omega \Delta t)$$

Substitute $\alpha = \frac{1}{1 + \omega^2 \Delta t^2}$:

$$\lambda_{1, 2} = \frac{1 \pm i \omega \Delta t}{1 + \omega^2 \Delta t^2}$$

#### Step 2: Compute Spectral Radius $|\lambda|$
$$|\lambda| = \sqrt{ \left( \frac{1}{1 + \omega^2 \Delta t^2} \right)^2 + \left( \frac{\omega \Delta t}{1 + \omega^2 \Delta t^2} \right)^2 } = \sqrt{ \frac{1 + \omega^2 \Delta t^2}{(1 + \omega^2 \Delta t^2)^2} } = \sqrt{ \frac{1}{1 + \omega^2 \Delta t^2} }$$

$$\mathbf{|\lambda| = \frac{1}{\sqrt{1 + \omega^2 \Delta t^2}}}$$

#### The Mathematical Contrast Between Forward and Backward Euler
Look at the profound, perfect mathematical duality between the two algorithms:

```
+-------------------------------------------------------------------------+
|                  THE EULER EIGENVALUE DUALITY                           |
+-------------------------------------------------------------------------+
|                                                                         |
|  Forward Euler Spectral Radius:    |\lambda_Forward|  = \sqrt{1 + w^2 dt^2} > 1.0  |
|                                                                         |
|  Backward Euler Spectral Radius:   |\lambda_Backward| = \frac{1}{\sqrt{1 + w^2 dt^2}} < 1.0 |
|                                                                         |
+-------------------------------------------------------------------------+
```

For all $\omega > 0$ and all $\Delta t > 0$:

$$1 + \omega^2 \Delta t^2 > 1.0 \implies \mathbf{|\lambda_{\text{Backward}}| < 1.0 \quad \text{Strictly and Unconditionally!}}$$

In the terminology of numerical analysis, Backward Euler is **A-stable** (and **L-stable**): its numerical solution remains bounded for *any* step size $\Delta t$, even if $\Delta t$ is one million seconds!

---

### 4.5 The Dissipation Trap: Artificial Numerical Viscosity

At first glance, A-stability appears to be the holy grail: the simulation will never blow up!
However, in physical simulation, **$|\lambda| < 1.0$ is just as deadly as $|\lambda| > 1.0$**.

Let us calculate the mechanical energy $E_{n+1}$ after one Backward Euler step:

$$E_{n+1} = \frac{1}{2} k x_{n+1}^2 + \frac{1}{2} m v_{n+1}^2$$

Because the transformation matrix is $\mathbf{A}_{\text{Backward}} = \frac{1}{1 + \omega^2 \Delta t^2} \mathbf{A}_{\text{Forward}}$, and from Chapter 3 we know $\mathbf{A}_{\text{Forward}}$ expands energy by $(1 + \omega^2 \Delta t^2)$, the energy under Backward Euler evolves as:

$$E_{n+1} = \left( \frac{1}{1 + \omega^2 \Delta t^2} \right)^2 \cdot [E_n (1 + \omega^2 \Delta t^2)]$$

$$\mathbf{E_{n+1} = E_n \left( \frac{1}{1 + \omega^2 \Delta t^2} \right)}$$

#### The Exponential Decay Law
On every single numerical step, the total mechanical energy of an isolated, conservative, frictionless system is multiplied by $\frac{1}{1 + \omega^2 \Delta t^2} < 1$.
After $n$ steps ($t = n \Delta t$):

$$E(t) = E_0 \left( \frac{1}{1 + \omega^2 \Delta t^2} \right)^n \approx E_0 e^{-\omega^2 \Delta t \cdot t}$$

```
Mechanical Energy E(t)
  ^
  |  -------------------------------------------- (Exact Physical Conservation)
  |                                 _---'
  |                           _---'
  |                     _---'
  |               _---'
  |         _---'
  |   _---'   Backward Euler Artificial Dissipation
  |  /        E(t) ~ E_0 * e^(-w^2 * dt * t)
  +--------------------------------------------------------------------------> Time t
```

The physical consequence is grotesque:
- An undamped pendulum swinging in a vacuum rapidly slows down and comes to a complete standstill in seconds.
- An orbiting planet steadily loses orbital energy, spiraling inward and crashing directly into the central star.
- A vibrating guitar string loses its sound almost instantaneously.

Backward Euler acts as an **artificial numerical damper** that injects spurious viscous drag into every degree of freedom!

---

### 4.6 Phase Space Contraction: The Inverse Liouville Violation

What does Backward Euler do to the geometry of phase space?
Evaluate the Jacobian determinant of the Backward Euler mapping:

$$\mathbf{J}_{\text{Backward}} = \frac{1}{1 + \omega^2 \Delta t^2} \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

$$\det(\mathbf{J}_{\text{Backward}}) = \left( \frac{1}{1 + \omega^2 \Delta t^2} \right)^2 \cdot \det\begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} = \left( \frac{1}{1 + \omega^2 \Delta t^2} \right)^2 \cdot (1 + \omega^2 \Delta t^2)$$

$$\mathbf{\det(\mathbf{J}_{\text{Backward}}) = \frac{1}{1 + \omega^2 \Delta t^2} < 1.0}$$

```
Phase Space Area Contraction Under Backward Euler:
      v ^                                            v ^
        |   +---+                                      |     +--+
        |   |   |  Area A_0                            |     |  |  Area A_1 = A_0 / (1 + w^2 * dt^2)
        |   +---+                                      |     +--+  (Phase volume SHRINKS!)
        +-----------> x                                +-----------> x
           Step n                                         Step n+1
```

- Where Forward Euler artificially inflates phase space ($\det > 1$), Backward Euler **artificially crushes and contracts phase space** ($\det < 1$).
- Trajectories that should remain distinct collapse onto an artificial numerical attractor.
- Backward Euler is just as **non-symplectic** as Forward Euler.

---

### 4.7 Where Implicit Methods Excel: The Physics of Stiff Equations

If Backward Euler destroys energy conservation, why is it celebrated and widely used in computational fluid dynamics, engineering mechanics, and chemical engineering?

The answer lies in **Stiff Differential Equations**.

#### The Definition of Stiffness
A physical system is mathematically **stiff** if it contains two or more simultaneous physical processes operating at vastly differing time scales:
- A **fast, high-frequency, highly damped mode** (e.g., sound waves in water, molecular bond vibrations, rapid structural bending).
- A **slow, low-frequency macroscopic motion** of primary interest (e.g., ocean currents, protein folding, vehicle chassis trajectory).

In a stiff system, Explicit methods (like Forward Euler or RK4) are held hostage by the fastest time scale:
$$\Delta t_{\text{explicit}} < \frac{2}{\omega_{\text{fast}}}$$
If a molecular bond vibrates at $10^{14}\text{ Hz}$, an explicit solver must take steps of $\Delta t = 10^{-15}\text{ s}$, requiring 100 trillion steps to simulate one second of gross motion!

Backward Euler, because it is unconditionally stable, can take a macroscopic step of $\Delta t = 10^{-3}\text{ s}$. It **artificially damps and eliminates the irrelevant high-frequency vibrations**, while stably evolving the macroscopic trajectory!

```
+-------------------------------------------------------------------------+
|                  WHEN TO USE IMPLICIT VS. SYMPLECTIC                    |
+-------------------------------------------------------------------------+
|  Problem Category         | Preferred Integrator | Reason               |
+---------------------------+----------------------+----------------------+
|  Planetary Orbits         | Symplectic Verlet    | Zero energy drift    |
|  Rigid Body Collisions    | Semi-Implicit Euler  | Symplectic, cheap    |
|  Stiff Cloth & Ropes      | Implicit / PBD       | Damps spring spikes  |
|  Fluid Navier-Stokes      | Implicit Pressure    | Incompressibility    |
+---------------------------+----------------------+----------------------+
```

---

### 4.8 Ten In-Depth Progressive Worked Examples

#### Example 4.1: Single Backward Euler Step on a Harmonic Oscillator
*Scenario:* An oscillator has $m = 1.0\text{ kg}$, $k = 100.0\text{ N/m}$ ($\omega = 10.0\text{ rad/s}$).
At $t = 0$, $x_0 = 1.0\text{ m}$, $v_0 = 0.0\text{ m/s}$, with initial energy $E_0 = 50.0\text{ J}$.
Calculate position, velocity, and energy after one Backward Euler step with $\Delta t = 0.05\text{ s}$.

*Step 1: Compute scalar denominator:*
$$D = 1 + \omega^2 \Delta t^2 = 1 + (10.0)^2(0.05)^2 = 1 + 100.0(0.0025) = 1 + 0.25 = 1.25$$

*Step 2: Compute $x_1$ and $v_1$:*
$$x_1 = \frac{x_0 + \Delta t v_0}{D} = \frac{1.0 + 0(0.05)}{1.25} = \frac{1.0}{1.25} = 0.8000\text{ m}$$
$$v_1 = \frac{v_0 - \omega^2 \Delta t x_0}{D} = \frac{0 - (100.0)(0.05)(1.0)}{1.25} = \frac{-5.0}{1.25} = -4.0000\text{ m/s}$$

*Step 3: Compute mechanical energy after step 1:*
$$E_1 = \frac{1}{2} k x_1^2 + \frac{1}{2} m v_1^2 = \frac{1}{2}(100.0)(0.80)^2 + \frac{1}{2}(1.0)(-4.0)^2$$
$$E_1 = 50.0(0.64) + 0.5(16.0) = 32.0 + 8.0 = 40.0\text{ J}$$

*Step 4: Verify theoretical dissipation formula:*
$$E_1 = \frac{E_0}{1 + \omega^2 \Delta t^2} = \frac{50.0\text{ J}}{1.25} = 40.0\text{ J}$$
Exact match! In a single step, the system artificially lost **10.0 Joules (20% of its total energy)** to numerical dissipation.

---

#### Example 4.2: Energy Dissipation Trace Across 5 Steps
*Scenario:* Take the exact system from Example 4.1 ($E_0 = 50.0\text{ J}$, $\omega = 10\text{ rad/s}$, $\Delta t = 0.05\text{ s}$, $D = 1.25$). Trace state $\begin{bmatrix} x_n \\ v_n \end{bmatrix}$ and total energy $E_n$ for steps $n = 0, 1, 2, 3, 4, 5$.

*Recurrence multiplier:* $E_{n+1} = E_n / 1.25 = 0.80 E_n$.
Matrix: $\mathbf{A} = \frac{1}{1.25}\begin{bmatrix} 1 & 0.05 \\ -5.0 & 1 \end{bmatrix} = \begin{bmatrix} 0.80 & 0.04 \\ -4.00 & 0.80 \end{bmatrix}$.

- **Step 0 ($t = 0.00\text{ s}$):**
  $x_0 = 1.000\text{ m}, \quad v_0 = 0.000\text{ m/s}, \quad E_0 = 50.00\text{ J}$.
- **Step 1 ($t = 0.05\text{ s}$):**
  $x_1 = 0.80(1.0) + 0.04(0) = 0.800\text{ m}$.
  $v_1 = -4.00(1.0) + 0.80(0) = -4.000\text{ m/s}$.
  $E_1 = 50(0.8)^2 + 0.5(-4)^2 = 32 + 8 = 40.00\text{ J}$ ($50 \times 0.80$).
- **Step 2 ($t = 0.10\text{ s}$):**
  $x_2 = 0.80(0.80) + 0.04(-4.0) = 0.640 - 0.160 = 0.480\text{ m}$.
  $v_2 = -4.00(0.80) + 0.80(-4.0) = -3.200 - 3.200 = -6.400\text{ m/s}$.
  $E_2 = 50(0.48)^2 + 0.5(-6.4)^2 = 50(0.2304) + 0.5(40.96) = 11.52 + 20.48 = 32.00\text{ J}$ ($40 \times 0.80$).
- **Step 3 ($t = 0.15\text{ s}$):**
  $x_3 = 0.80(0.48) + 0.04(-6.4) = 0.384 - 0.256 = 0.128\text{ m}$.
  $v_3 = -4.00(0.48) + 0.80(-6.4) = -1.920 - 5.120 = -7.040\text{ m/s}$.
  $E_3 = 50(0.128)^2 + 0.5(-7.04)^2 = 0.8192 + 24.7808 = 25.60\text{ J}$ ($32 \times 0.80$).
- **Step 4 ($t = 0.20\text{ s}$):**
  $x_4 = 0.80(0.128) + 0.04(-7.04) = 0.1024 - 0.2816 = -0.1792\text{ m}$.
  $v_4 = -4.00(0.128) + 0.80(-7.04) = -0.512 - 5.632 = -6.144\text{ m/s}$.
  $E_4 = 50(-0.1792)^2 + 0.5(-6.144)^2 = 1.6056 + 18.8744 = 20.48\text{ J}$ ($25.6 \times 0.80$).
- **Step 5 ($t = 0.25\text{ s}$):**
  $E_5 = 20.48 \times 0.80 = 16.384\text{ J}$.

*Contrast with Forward Euler:*
- In Chapter 3, Forward Euler inflated energy from $50\text{ J} \to 152.6\text{ J}$ in 5 steps.
- Here, Backward Euler drained energy from $50\text{ J} \to 16.38\text{ J}$ in 5 steps (**over 67% energy loss!**).
Neither is physically acceptable for real-time conservative dynamics.

---

#### Example 4.3: Energy Half-Life Calculation
*Scenario:* A pendulum ($\omega = 2.0\text{ rad/s}$) is simulated with Backward Euler at 60 Hz ($\Delta t = \frac{1}{60}\text{ s} \approx 0.016667\text{ s}$).
Calculate the exact number of steps $N_{1/2}$ and physical simulated time $t_{1/2}$ required for the system to lose half of its initial energy ($E = 0.5 E_0$).

*Step 1: Compute per-step dissipation factor:*
$$\omega \Delta t = \frac{2.0}{60} = \frac{1}{30} \approx 0.033333$$
$$\omega^2 \Delta t^2 = \frac{1}{900} \approx 0.0011111$$
$$D = 1 + \omega^2 \Delta t^2 = 1 + \frac{1}{900} = \frac{901}{900} \approx 1.0011111$$
$$\rho^2 = \frac{1}{D} = \frac{900}{901} \approx 0.9988901$$

*Step 2: Solve for $N_{1/2}$:*
$$(\rho^2)^N = 0.5 \implies N \ln(\rho^2) = \ln(0.5) = -\ln(2)$$
$$\ln(\rho^2) = \ln\left(\frac{900}{901}\right) \approx -\frac{1}{900} \approx -0.0011105$$
$$N_{1/2} = \frac{-0.693147}{-0.0011105} \approx 624.17 \implies 625\text{ steps}$$

*Step 3: Convert to continuous time:*
$$t_{1/2} = N \Delta t = 624.17 \times \frac{1}{60} \approx 10.40\text{ seconds}$$

*Conclusion:* In barely **10.4 seconds of simulated time**, an undamped pendulum loses 50% of its mechanical energy purely to Backward Euler's numerical drag.

---

#### Example 4.4: Planetary Orbital Decay Under Backward Euler
*Scenario:* The Earth-orbiting satellite from Example 3.4 ($r_0 = 7,000\text{ km}$, $v_0 = 7,546\text{ m/s}$, $\omega \approx 0.001078\text{ rad/s}$) is simulated with Backward Euler using $\Delta t = 10.0\text{ s}$.
Calculate the radial altitude loss after a single step.

*Step 1: Compute denominator factor:*
$$\omega \Delta t = 0.001078 \times 10.0 = 0.01078$$
$$1 + \omega^2 \Delta t^2 = 1 + (0.01078)^2 = 1 + 0.0001162 = 1.0001162$$

*Step 2: Evaluate position vector:*
In Backward Euler, $r_1$ is scaled by $\frac{1}{1 + \omega^2 \Delta t^2}$:
$$r_1 = \frac{r_{\text{Forward}}}{1 + \omega^2 \Delta t^2} = \frac{7,000,406.7\text{ m}}{1.0001162} \approx 6,999,593.5\text{ m}$$

*Altitude Loss:*
$$\Delta r = 7,000,000 - 6,999,593.5 = -406.5\text{ meters}$$

*Conclusion:* Where Forward Euler caused the satellite to spiral outward by $406.7\text{ m}$, Backward Euler causes the satellite to **spiral inward toward the Earth by $406.5\text{ m}$ per step**! Within 18 orbits, the satellite de-orbits and crashes into the atmosphere.

---

#### Example 4.5: Solving a 1D Stiff Spring-Damper System
*Scenario:* A stiff mechanical joint has mass $m = 1.0\text{ kg}$, damping $c = 100.0\text{ N}\cdot\text{s/m}$, and spring stiffness $k = 10,000.0\text{ N/m}$.
The equation is $\ddot{x} + 100 \dot{x} + 10,000 x = 0$.
Solve for $x_1$ and $v_1$ using Backward Euler with a large timestep $\Delta t = 0.02\text{ s}$ starting from $x_0 = 0.1\text{ m}, v_0 = 0.0\text{ m/s}$.

*Step 1: Set up the matrix system $(\mathbf{I} - \Delta t \mathbf{A}) \mathbf{y}_1 = \mathbf{y}_0$:*
Continuous matrix:
$$\mathbf{A} = \begin{bmatrix} 0 & 1 \\ -10,000 & -100 \end{bmatrix}$$
$$\Delta t \mathbf{A} = 0.02 \begin{bmatrix} 0 & 1 \\ -10,000 & -100 \end{bmatrix} = \begin{bmatrix} 0 & 0.02 \\ -200 & -2.0 \end{bmatrix}$$
$$\mathbf{M} = \mathbf{I} - \Delta t \mathbf{A} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0 & 0.02 \\ -200 & -2.0 \end{bmatrix} = \begin{bmatrix} 1 & -0.02 \\ 200 & 3.0 \end{bmatrix}$$

*Step 2: Invert matrix $\mathbf{M}$:*
$$\det(\mathbf{M}) = (1)(3.0) - (-0.02)(200) = 3.0 - (-4.0) = 7.0$$
$$\mathbf{M}^{-1} = \frac{1}{7.0} \begin{bmatrix} 3.0 & 0.02 \\ -200 & 1 \end{bmatrix}$$

*Step 3: Compute $\mathbf{y}_1$:*
$$\begin{bmatrix} x_1 \\ v_1 \end{bmatrix} = \frac{1}{7.0} \begin{bmatrix} 3.0 & 0.02 \\ -200 & 1 \end{bmatrix} \begin{bmatrix} 0.1 \\ 0.0 \end{bmatrix}$$
$$x_1 = \frac{3.0(0.1) + 0}{7.0} = \frac{0.3}{7.0} \approx 0.042857\text{ m}$$
$$v_1 = \frac{-200(0.1) + 0}{7.0} = \frac{-20.0}{7.0} \approx -2.85714\text{ m/s}$$

*Sanity Check:* Even though $\omega = 100\text{ rad/s}$ and $\omega \Delta t = 2.0$ (which would instantly blow up Forward Euler), Backward Euler produces a completely stable, smoothly decaying state update without a glitch!

---

#### Example 4.6: Phase Space Contraction Ratio
*Scenario:* A thermodynamic gas molecule simulation in phase space has initial volume $\mathcal{V}_0 = 1.0\text{ m}^3\cdot(\text{kg}\cdot\text{m/s})^3$. The molecules interact via interatomic potentials with effective frequency $\omega = 5.0\text{ rad/s}$.
Calculate the phase space volume after 100 steps of Backward Euler with $\Delta t = 0.1\text{ s}$.

*Step 1: Compute per-step Jacobian determinant:*
$$\omega \Delta t = 5.0 \times 0.1 = 0.5$$
$$\det(\mathbf{J}) = \frac{1}{1 + \omega^2 \Delta t^2} = \frac{1}{1 + (0.5)^2} = \frac{1}{1 + 0.25} = \frac{1}{1.25} = 0.80$$
For 3 spatial dimensions (6D phase space), volume scales by $\det(\mathbf{J})^3$:
$$\frac{\mathcal{V}_{n+1}}{\mathcal{V}_n} = (0.80)^3 = 0.512$$

*Step 2: Volume after 100 steps:*
$$\mathcal{V}_{100} = \mathcal{V}_0 \times (0.512)^{100} \approx 1.0 \times 10^{-29}\text{ m}^3\cdot(\text{kg}\cdot\text{m/s})^3$$

*Thermodynamic Implication:* In 100 steps, phase-space volume shrinks by **29 orders of magnitude**! All gas molecules artificially collapse into a single zero-entropy crystalline point, completely violating the laws of statistical mechanics.

---

#### Example 4.7: Newton-Raphson Iteration for Non-Linear Drag in Backward Euler
*Scenario:* A falling mass experiences non-linear drag:
$$\dot{v} = -g - k v |v|, \qquad \text{where } g = 9.8\text{ m/s}^2, \quad k = 0.1\text{ m}^{-1}$$
Initial velocity $v_0 = -20.0\text{ m/s}$ (downward, so $|v| = -v$, $v|v| = -v^2$).
The equation is $\dot{v} = -9.8 + 0.1 v^2$.
Formulate the Backward Euler equation for $v_1$ with $\Delta t = 0.1\text{ s}$, and perform two Newton-Raphson iterations to solve for $v_1$.

*Step 1: Backward Euler equation:*
$$v_1 = v_0 + \Delta t (-9.8 + 0.1 v_1^2)$$
$$v_1 = -20.0 + 0.1(-9.8 + 0.1 v_1^2) = -20.0 - 0.98 + 0.01 v_1^2 = -20.98 + 0.01 v_1^2$$

*Step 2: Define residual function $g(v_1) = 0$:*
$$g(v_1) = 0.01 v_1^2 - v_1 - 20.98 = 0$$
Derivative with respect to $v_1$:
$$g'(v_1) = 0.02 v_1 - 1.0$$

*Step 3: Initial guess $v_1^{(0)} = v_0 = -20.0\text{ m/s}$:*
- Evaluate residual:
  $$g(-20.0) = 0.01(-20)^2 - (-20.0) - 20.98 = 0.01(400) + 20.0 - 20.98 = 4.0 + 20.0 - 20.98 = +3.02$$
- Evaluate derivative:
  $$g'(-20.0) = 0.02(-20) - 1.0 = -0.4 - 1.0 = -1.4$$
- First Newton update:
  $$v_1^{(1)} = v_1^{(0)} - \frac{g(v_1^{(0)})}{g'(v_1^{(0)})} = -20.0 - \frac{3.02}{-1.4} = -20.0 - (-2.1571) = -17.8429\text{ m/s}$$

*Step 4: Second Newton update:*
- Residual at $v_1^{(1)} = -17.8429$:
  $$g(-17.8429) = 0.01(-17.8429)^2 - (-17.8429) - 20.98 = 3.1837 + 17.8429 - 20.98 = +0.0466$$
- Derivative:
  $$g'(-17.8429) = 0.02(-17.8429) - 1.0 = -0.3569 - 1.0 = -1.3569$$
- Update:
  $$v_1^{(2)} = -17.8429 - \frac{0.0466}{-1.3569} = -17.8429 + 0.0343 = -17.8086\text{ m/s}$$

*Conclusion:* In 2 iterations, the root converged from $-20.0$ to $-17.8086\text{ m/s}$ with residual $< 10^{-4}$, illustrating the computational cost of non-linear implicit integration.

---

#### Example 4.8: Complex Stability Domain of Backward Euler
*Scenario:* Derive the region of absolute stability for Backward Euler in the complex plane $z = \lambda \Delta t \in \mathbb{C}$. Explain why this makes Backward Euler A-stable.

*Step 1: Test equation:*
$$\dot{y} = \lambda y \implies y_{n+1} = y_n + \Delta t \lambda y_{n+1} = y_n + z y_{n+1}$$
$$(1 - z) y_{n+1} = y_n \implies y_{n+1} = \frac{1}{1 - z} y_n$$
Amplification factor:
$$R(z) = \frac{1}{1 - z}$$

*Step 2: Stability condition $|R(z)| \le 1$:*
$$\left| \frac{1}{1 - z} \right| \le 1 \iff |1 - z| \ge 1 \iff |z - 1| \ge 1$$

*Step 3: Geometric interpretation:*
$|z - 1| \ge 1$ represents the **entire complex plane OUTSIDE a circular disk of radius 1 centered at $z = 1 + 0i$**!

```
Im(z) ^
      |           STABLE REGION
      |           (Entire Complex Plane Outside Disk)
      |              |
      |          .---+---.
      |         /  DISK   \  UNSTABLE
      |        |  (Radius) | (Inside Disk)
  ----+--------+----*------+-------------> Re(z)
      |       0|    1      2
      |         \         /
      |          `---+---'
      |              |
      |           STABLE REGION
```

*Proof of A-Stability:*
A method is **A-stable** if its stability region contains the entire left half of the complex plane ($\text{Re}(z) \le 0$).
Since the disk centered at $z = 1$ with radius 1 only touches the imaginary axis at the single point $z = 0$, the entire open left half-plane ($\text{Re}(z) < 0$) is completely outside the disk!
Therefore, Backward Euler is stable for all physical systems with negative or zero real parts, proving unconditional A-stability.

---

#### Example 4.9: Stiff Decoupled System: Forward vs. Backward Euler
*Scenario:* A stiff system has two independent state variables:
$$\dot{y}_{\text{slow}} = -1.0 y_{\text{slow}}, \qquad \dot{y}_{\text{fast}} = -1,000.0 y_{\text{fast}}$$
Starting from $y_{\text{slow}}(0) = 1.0, y_{\text{fast}}(0) = 1.0$.
An engineer wants to step with $\Delta t = 0.01\text{ s}$ to simulate $T = 1.0\text{ s}$.
Compare the stability of Forward Euler vs Backward Euler.

*Step 1: Forward Euler on fast variable:*
$$y_{n+1} = y_n (1 - 1,000 \Delta t) = y_n (1 - 1,000 \times 0.01) = y_n (1 - 10) = -9 y_n$$
On every single step, $y_{\text{fast}}$ is multiplied by $-9$!
After 100 steps:
$$y_{\text{fast}}(1.0) = 1.0 \times (-9)^{100} \approx +2.65 \times 10^{95} \quad (\text{Catastrophic Explosion!})$$

*Step 2: Backward Euler on fast variable:*
$$y_{n+1} = \frac{y_n}{1 + 1,000 \Delta t} = \frac{y_n}{1 + 10} = \frac{1}{11} y_n \approx 0.0909 y_n$$
After 100 steps:
$$y_{\text{fast}}(1.0) = 1.0 \times \left(\frac{1}{11}\right)^{100} \approx 7.25 \times 10^{-105} \approx 0.0$$
The fast variable rapidly decays to 0, exactly matching continuous physics where $e^{-1000} \approx 0$!

*Conclusion:* Backward Euler permits taking large steps that completely ignore negligible fast dynamics, whereas Forward Euler catastrophically explodes.

---

#### Example 4.10: The Crank-Nicolson (Trapezoidal) Bridge
*Scenario:* To eliminate both Forward Euler's energy explosion ($E \times (1 + \omega^2 \Delta t^2)$) and Backward Euler's energy decay ($E / (1 + \omega^2 \Delta t^2)$), an engineer averages the two methods:
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{2} \left[ \mathbf{f}(\mathbf{y}_n) + \mathbf{f}(\mathbf{y}_{n+1}) \right]$$
(The **Trapezoidal Rule** / **Crank-Nicolson Method**).
Prove that for $\ddot{x} = -\omega^2 x$, Crank-Nicolson conserves energy exactly ($|\lambda| \equiv 1.0$) and preserves phase-space volume ($\det(\mathbf{J}) \equiv 1.0$).

*Step 1: State equations for harmonic oscillator:*
$$x_{n+1} = x_n + \frac{\Delta t}{2} (v_n + v_{n+1})$$
$$v_{n+1} = v_n - \frac{\omega^2 \Delta t}{2} (x_n + x_{n+1})$$

*Step 2: Solve in matrix form:*
Let $\tau = \frac{\Delta t}{2}$.
$$\begin{bmatrix} 1 & -\tau \\ \omega^2 \tau & 1 \end{bmatrix} \begin{bmatrix} x_{n+1} \\ v_{n+1} \end{bmatrix} = \begin{bmatrix} 1 & \tau \\ -\omega^2 \tau & 1 \end{bmatrix} \begin{bmatrix} x_n \\ v_n \end{bmatrix}$$
Let $\mathbf{M}_L = \begin{bmatrix} 1 & -\tau \\ \omega^2 \tau & 1 \end{bmatrix}$ and $\mathbf{M}_R = \begin{bmatrix} 1 & \tau \\ -\omega^2 \tau & 1 \end{bmatrix}$.
$$\mathbf{A}_{\text{trap}} = \mathbf{M}_L^{-1} \mathbf{M}_R$$

*Step 3: Evaluate determinants:*
$$\det(\mathbf{M}_L) = 1 + \omega^2 \tau^2$$
$$\det(\mathbf{M}_R) = 1 + \omega^2 \tau^2$$
$$\det(\mathbf{A}_{\text{trap}}) = \frac{\det(\mathbf{M}_R)}{\det(\mathbf{M}_L)} = \frac{1 + \omega^2 \tau^2}{1 + \omega^2 \tau^2} \equiv \mathbf{1.00000000}$$
Phase space volume is **100% conserved**!

*Step 4: Evaluate eigenvalues:*
Eigenvalues of $\mathbf{M}_L$ are $1 \pm i \omega \tau$.
Eigenvalues of $\mathbf{M}_R$ are $1 \mp i \omega \tau$.
The eigenvalues of $\mathbf{A}_{\text{trap}}$ are:
$$\lambda = \frac{1 - i \omega \tau}{1 + i \omega \tau}$$
Magnitude:
$$|\lambda| = \frac{|1 - i \omega \tau|}{|1 + i \omega \tau|} = \frac{\sqrt{1 + \omega^2 \tau^2}}{\sqrt{1 + \omega^2 \tau^2}} \equiv \mathbf{1.00000000}$$

*Profound Result:* The Trapezoidal Rule achieves $|\lambda| = 1$ and $\det = 1$. It neither explodes nor damps energy. However, it is an **implicit method** requiring matrix solves on every step.

---

### 4.9 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 4.1 – 4.2)

##### Exercise 4.1
Define the difference between an **explicit** numerical integrator and an **implicit** numerical integrator. Why does Backward Euler require root-finding or matrix inversion on every step?

##### Exercise 4.2
Explain why Backward Euler is described as introducing "artificial numerical viscosity." In an undamped planetary orbit simulation, what physical anomaly does Backward Euler produce?

---

#### Tier 2: Matrix Formulations & A-Stability (Exercises 4.3 – 4.4)

##### Exercise 4.3
Derive the state transition matrix $\mathbf{A}_{\text{Backward}}$ for a 1D harmonic oscillator $\ddot{x} + \omega^2 x = 0$ integrated via Backward Euler. Show that its eigenvalues have magnitude $|\lambda| = (1 + \omega^2 \Delta t^2)^{-1/2}$.

##### Exercise 4.4
Define **A-stability**. Explain why an A-stable method guarantees that the numerical solution will never blow up to infinity, regardless of how large the timestep $\Delta t$ is.

---

#### Tier 3: Phase Space & Liouville Contraction (Exercises 4.5 – 4.6)

##### Exercise 4.5
Prove that the Jacobian determinant of Backward Euler for an oscillator satisfies $\det(\mathbf{J}) < 1.0$ for all $\Delta t > 0$. What is the geometric consequence of this determinant on a set of initial conditions in phase space?

##### Exercise 4.6
An elastic spring with frequency $\omega = 50.0\text{ rad/s}$ is simulated with Backward Euler at 100 Hz ($\Delta t = 0.010\text{ s}$). Calculate the fractional energy loss per step. How many steps elapse before 99% of the spring's initial mechanical energy is destroyed?

---

#### Tier 4: Non-Linear Systems & Newton Solvers (Exercises 4.7 – 4.8)

##### Exercise 4.7
A 1D particle experiences non-linear cubic restoring force: $\ddot{x} = -k x^3$ with $k = 4.0\text{ m}^{-2}\text{s}^{-2}$.
Write the coupled non-linear scalar system that must be solved at each step of Backward Euler. Set up the 2D Newton-Raphson Jacobian matrix.

##### Exercise 4.8
Explain why Backward Euler is indispensable for simulating cloth meshes with stiff structural springs ($k = 10^5\text{ N/m}$), even though it dissipates energy. Why does the visual realism of cloth simulation tolerate numerical damping while celestial mechanics does not?

---

#### Tier 5: Theoretical Dynamics & The Dahlquist Barrier (Exercises 4.9 – 4.10)

##### Exercise 4.9
State **Dahlquist's Second Barrier Theorem** regarding the maximum achievable order of an A-stable linear multi-step method. Explain why no linear multi-step method of order $p > 2$ can be unconditionally A-stable.

##### Exercise 4.10
Compare the computational cost per frame of simulating 5,000 rigid bodies using Explicit Euler, Backward Euler, and the Trapezoidal Rule. Tabulate the number of matrix solves, FLOPs, and energy preservation behavior for each.

---

### 4.10 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 4.1
*Explicit vs. Implicit Distinction:*
- An **Explicit** integrator evaluates future state $\mathbf{y}_{n+1}$ using only states and forces evaluated at current or past times: $\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{f}(\mathbf{y}_n, t_n)$. It requires only straightforward direct function evaluations.
- An **Implicit** integrator evaluates future state $\mathbf{y}_{n+1}$ using forces evaluated at the *unknown future state* $\mathbf{y}_{n+1}$: $\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{f}(\mathbf{y}_{n+1}, t_{n+1})$.

*Why Matrix Inversion / Root-Finding is Required:*
Because the unknown vector $\mathbf{y}_{n+1}$ appears on both sides of the equation (inside the non-linear force function $\mathbf{f}$), it cannot be isolated using basic arithmetic. The computer must formulate a residual equation $\mathbf{g}(\mathbf{y}_{n+1}) = \mathbf{y}_{n+1} - \mathbf{y}_n - \Delta t \mathbf{f}(\mathbf{y}_{n+1}) = \mathbf{0}$ and invert a Jacobian matrix or solve a linear system $(\mathbf{I} - \Delta t \mathbf{J}) \Delta \mathbf{y} = -\mathbf{g}$ iteratively until convergence.

---

#### Solution to Exercise 4.2
*Artificial Numerical Viscosity:* In continuous physics, physical viscous damping arises from friction forces $-\gamma \mathbf{v}$ that convert kinetic energy into heat.
Backward Euler, even when applied to an ideal frictionless conservative system ($F = -kx$), causes the total mechanical energy to shrink on every step by a factor of $\frac{1}{1 + \omega^2 \Delta t^2}$.
This artificial dissipation mimics the exact mathematical effect of physical viscosity, acting as a non-physical numerical drag force that drains kinetic energy.

*Planetary Orbit Anomaly:* In an undamped orbital simulation, a planet's orbit should be a closed, stable ellipse. Under Backward Euler, the continuous loss of mechanical energy causes the planet's semi-major axis to shrink on every step. The planet spirals inward toward the central star, decelerating and crashing into the star within a few hundred orbits.

---

#### Solution to Exercise 4.3
*Derivation of $\mathbf{A}_{\text{Backward}}$:*
Given $\ddot{x} = -\omega^2 x$. In first-order form:
$$x_{n+1} = x_n + v_{n+1} \Delta t$$
$$v_{n+1} = v_n - \omega^2 x_{n+1} \Delta t$$
Substitute $x_{n+1}$ into the velocity equation:
$$v_{n+1} = v_n - \omega^2 (x_n + v_{n+1} \Delta t) \Delta t = v_n - \omega^2 \Delta t x_n - \omega^2 \Delta t^2 v_{n+1}$$
$$(1 + \omega^2 \Delta t^2) v_{n+1} = -\omega^2 \Delta t x_n + v_n \implies v_{n+1} = \frac{-\omega^2 \Delta t x_n + v_n}{1 + \omega^2 \Delta t^2}$$
Substitute $v_{n+1}$ back into position:
$$x_{n+1} = x_n + \Delta t \left( \frac{-\omega^2 \Delta t x_n + v_n}{1 + \omega^2 \Delta t^2} \right) = \frac{(1 + \omega^2 \Delta t^2)x_n - \omega^2 \Delta t^2 x_n + \Delta t v_n}{1 + \omega^2 \Delta t^2} = \frac{x_n + \Delta t v_n}{1 + \omega^2 \Delta t^2}$$

In matrix form:
$$\mathbf{A}_{\text{Backward}} = \frac{1}{1 + \omega^2 \Delta t^2} \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

*Eigenvalues & Spectral Radius:*
The eigenvalues of $\begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$ are $1 \pm i \omega \Delta t$.
Therefore:
$$\lambda = \frac{1 \pm i \omega \Delta t}{1 + \omega^2 \Delta t^2}$$
Magnitude:
$$|\lambda| = \frac{|1 \pm i \omega \Delta t|}{1 + \omega^2 \Delta t^2} = \frac{\sqrt{1 + \omega^2 \Delta t^2}}{1 + \omega^2 \Delta t^2} = \frac{1}{\sqrt{1 + \omega^2 \Delta t^2}}$$
$\blacksquare$

---

#### Solution to Exercise 4.4
*Definition of A-Stability:* A numerical integration method is **A-stable** if its region of absolute stability in the complex plane $z = \lambda \Delta t$ contains the entire left half-plane:
$$\mathcal{S} \supseteq \{ z \in \mathbb{C} \mid \text{Re}(z) \le 0 \}$$

*Guarantee Against Blowup:*
Any physical dynamical system whose linearized modes have non-positive real parts ($\text{Re}(\lambda_{\text{phys}}) \le 0$, meaning stable or purely oscillatory modes) has scaled eigenvalues $z = \lambda_{\text{phys}} \Delta t$ lying in the left half-plane for all $\Delta t > 0$.
Because an A-stable method has amplification factor $|R(z)| \le 1$ everywhere in the left half-plane:
$$|y_{n+1}| \le |y_n| \quad \forall \Delta t > 0$$
The numerical state vector is provably bounded by its initial magnitude. No matter how large $\Delta t$ is chosen, the solution can never amplify exponentially or blow up to infinity.

---

#### Solution to Exercise 4.5
*Proof of Jacobian Determinant for Backward Euler:*
From Exercise 4.3:
$$\mathbf{J}_{\text{Backward}} = \mathbf{A}_{\text{Backward}} = \frac{1}{1 + \omega^2 \Delta t^2} \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$
Using the property $\det(c \mathbf{M}) = c^2 \det(\mathbf{M})$ for a $2 \times 2$ matrix:
$$\det(\mathbf{J}) = \left(\frac{1}{1 + \omega^2 \Delta t^2}\right)^2 \det\begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} = \frac{1}{(1 + \omega^2 \Delta t^2)^2} (1 + \omega^2 \Delta t^2) = \frac{1}{1 + \omega^2 \Delta t^2}$$
Since $\omega > 0$ and $\Delta t > 0$, we have $\omega^2 \Delta t^2 > 0 \implies 1 + \omega^2 \Delta t^2 > 1.0$.
Therefore:
$$\det(\mathbf{J}) = \frac{1}{1 + \omega^2 \Delta t^2} < 1.0$$

*Geometric Consequence:*
Consider an ensemble of initial conditions enclosing an area $\mathcal{A}_0$ in phase space $(x, v)$. After one step, the area becomes $\mathcal{A}_1 = \mathcal{A}_0 \cdot \det(\mathbf{J}) < \mathcal{A}_0$.
Phase-space area contracts monotonically. The state space volume shrinks to zero, violating Liouville's theorem and destroying Hamiltonian symplectic invariants.
$\blacksquare$

---

#### Solution to Exercise 4.6
Given: $\omega = 50.0\text{ rad/s}$, $\Delta t = 0.010\text{ s}$.

*Part 1: Fractional energy loss per step:*
$$\omega \Delta t = 50.0 \times 0.010 = 0.50$$
$$\omega^2 \Delta t^2 = 0.25$$
Per-step dissipation factor:
$$\rho^2 = \frac{1}{1 + \omega^2 \Delta t^2} = \frac{1}{1 + 0.25} = \frac{1}{1.25} = 0.80$$
Energy remaining after 1 step: $E_1 = 0.80 E_0$.
Fractional energy lost per step:
$$\text{Loss} = 1.0 - 0.80 = 0.20 = 20.0\%$$

*Part 2: Steps to 99% energy destruction ($E_N \le 0.01 E_0$):*
$$(0.80)^N = 0.01 \implies N \ln(0.80) = \ln(0.01) = -2 \ln(10)$$
$$\ln(0.80) \approx -0.2231435$$
$$\ln(0.01) \approx -4.605170$$
$$N = \frac{-4.605170}{-0.2231435} \approx 20.64 \implies 21\text{ steps}$$

*Time Elapsed:*
$$t = 21 \times 0.010\text{ s} = 0.21\text{ seconds}$$
In approximately one-fifth of a second (just 21 frames), **99% of the spring's mechanical energy is completely eradicated**.

---

#### Solution to Exercise 4.7
Given: $\ddot{x} = -k x^3$. First-order form: $\dot{x} = v, \dot{v} = -k x^3$.

*Part 1: Coupled non-linear Backward Euler system:*
$$\begin{cases}
x_{n+1} - x_n - \Delta t v_{n+1} = 0 \\
v_{n+1} - v_n + \Delta t k x_{n+1}^3 = 0
\end{cases}$$

*Part 2: 2D Newton-Raphson residual and Jacobian:*
Define state vector $\mathbf{y} = \begin{bmatrix} x_{n+1} \\ v_{n+1} \end{bmatrix}$. Residual vector:
$$\mathbf{G}(x_{n+1}, v_{n+1}) = \begin{bmatrix} x_{n+1} - x_n - \Delta t v_{n+1} \\ v_{n+1} - v_n + k \Delta t x_{n+1}^3 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

Jacobian matrix $\mathbf{J}_{\mathbf{G}} = \begin{bmatrix} \frac{\partial G_1}{\partial x_{n+1}} & \frac{\partial G_1}{\partial v_{n+1}} \\ \frac{\partial G_2}{\partial x_{n+1}} & \frac{\partial G_2}{\partial v_{n+1}} \end{bmatrix}$:
$$\mathbf{J}_{\mathbf{G}} = \begin{bmatrix} 1 & -\Delta t \\ 3 k \Delta t x_{n+1}^2 & 1 \end{bmatrix}$$
At each Newton iteration $k$, the solver inverts $\mathbf{J}_{\mathbf{G}}$ to compute the correction:
$$\begin{bmatrix} \Delta x \\ \Delta v \end{bmatrix} = -\mathbf{J}_{\mathbf{G}}^{-1} \mathbf{G}(x^{(k)}, v^{(k)})$$

---

#### Solution to Exercise 4.8
*Why Backward Euler is Indispensable for Stiff Cloth:*
A realistic cloth mesh (e.g., a garment or flag) requires very high stiffness ($k \ge 10^5\text{ N/m}$) to prevent stretching like elastic rubber.
The natural frequency of these mesh springs is $\omega = \sqrt{k/m} \approx 1,000 - 10,000\text{ rad/s}$.
1. If an Explicit integrator is used, the maximum stable timestep is $\Delta t < \frac{2}{\omega} \approx 0.0002\text{ s}$ ($5,000\text{ Hz}$). At 60 Hz, the springs instantly explode.
2. Backward Euler, being A-stable, remains 100% stable at standard 60 Hz ($\Delta t = 0.01667\text{ s}$), allowing real-time execution.

*Visual Tolerance for Damping:*
In cloth simulation, real fabric (cotton, silk, denim) exhibits high internal friction and air resistance; real cloth does not vibrate indefinitely like a musical tuning fork. Therefore, Backward Euler's artificial numerical dissipation actually mimics the real-world damping of fabric, making the cloth look natural rather than jittery. In celestial mechanics, however, planetary orbits have zero friction; damping destroys orbital reality within seconds.

---

#### Solution to Exercise 4.9
*Dahlquist's Second Barrier Theorem (1963):*
Germund Dahlquist proved three fundamental limits on linear multi-step methods (LMMs):
1. No explicit linear multi-step method can be A-stable.
2. An A-stable linear multi-step method cannot have an order of accuracy greater than $p = 2$.
3. The A-stable linear multi-step method of order 2 with the smallest error constant is the **Trapezoidal Rule** (Crank-Nicolson).

*Significance:* It is mathematically impossible to construct an unconditionally stable (A-stable) linear multi-step method with order 3, 4, or 5. To achieve higher order with unconditional stability, one must abandon linear multi-step methods and utilize multi-stage implicit methods, such as **Implicit Runge-Kutta (Radau or Gauss-Legendre)**.

---

#### Solution to Exercise 4.10
*Comparative Table for 5,000 Rigid Bodies:*

| Feature / Metric | Explicit Forward Euler | Implicit Backward Euler | Trapezoidal (Crank-Nicolson) |
|---|---|---|---|
| **Formulation** | $\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{f}(\mathbf{y}_n)$ | $\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{f}(\mathbf{y}_{n+1})$ | $\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{2}(\mathbf{f}_n + \mathbf{f}_{n+1})$ |
| **Matrix Inversions / Solves** | **0** (Pure vector adds) | **1 Large System** ($30,000 \times 30,000$) | **1 Large System** ($30,000 \times 30,000$) |
| **FLOPs per Frame** | $\sim 10^5$ FLOPs (Blindingly fast) | $\sim 10^7 - 10^8$ FLOPs ($100\times$ more) | $\sim 10^7 - 10^8$ FLOPs ($100\times$ more) |
| **Stability Region** | Conditionally stable (Fails $\omega > 0$) | **Unconditionally A-stable** | **Unconditionally A-stable** |
| **Spectral Radius $|\lambda|$** | $\sqrt{1 + \omega^2 \Delta t^2} > 1.0$ | $\frac{1}{\sqrt{1 + \omega^2 \Delta t^2}} < 1.0$ | $\equiv \mathbf{1.000000}$ (Exact balance) |
| **Phase-Space Volume** | Expands ($\det > 1$) | Contracts ($\det < 1$) | **Conserved** ($\det \equiv 1.0$) |
| **Physical Long-Term Behavior**| Explosive energy gain; blowup | Severe artificial damping; freezing | Bounded energy; exact preservation |
