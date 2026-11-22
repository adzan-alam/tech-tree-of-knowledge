# Chapter 01: The Differential Abyss — Continuous Physics Meets Discrete Silicon

> *"Nature does not compute by stepping through a while-loop; it unfolds continuously along smooth differential manifolds. When we force continuous Newtonian reality into the discrete, clocked registers of a digital computer, we open an ontological abyss. Bridging that abyss without losing mechanical energy, physical symmetry, or causal determinism is the grand quest of numerical integration."*

---

### 1.1 The Continuous World and the Initial Value Problem

In classical physics, from Isaac Newton's *Philosophiae Naturalis Principia Mathematica* (1687) to modern relativistic mechanics, the laws governing the cosmos are expressed as **differential equations**.

Newton's Second Law of Motion dictates that the acceleration of a particle of invariant inertial mass $m$ is directly proportional to the net vector sum of all applied forces:

$$\mathbf{F}_{\text{net}}(\mathbf{x}, \mathbf{v}, t) = m \mathbf{a}(t) = m \frac{d^2 \mathbf{x}}{dt^2}$$

This is an ordinary differential equation (ODE) of the **second order** because the highest derivative acting upon the positional configuration vector $\mathbf{x}(t) \in \mathbb{R}^d$ (where $d \in \{1, 2, 3\}$ is spatial dimensionality) is the second time derivative:

$$\ddot{\mathbf{x}}(t) = \frac{1}{m} \mathbf{F}_{\text{net}}(\mathbf{x}(t), \dot{\mathbf{x}}(t), t)$$

#### The State-Space Reduction to First-Order ODEs
Digital computers and numerical integration algorithms do not natively process higher-order derivatives directly. Instead, modern numerical analysis reduces every $k$-th order differential equation into a coupled system of $k$ first-order differential equations.

By defining the velocity vector as an independent dynamical state variable:

$$\mathbf{v}(t) \equiv \frac{d\mathbf{x}}{dt} = \dot{\mathbf{x}}(t)$$

we express Newton's Second Law as a canonical **coupled first-order dynamical system**:

$$\begin{cases}
\dfrac{d\mathbf{x}}{dt} = \mathbf{v}(t) \\
\dfrac{d\mathbf{v}}{dt} = \dfrac{1}{m}\mathbf{F}_{\text{net}}(\mathbf{x}(t), \mathbf{v}(t), t)
\end{cases}$$

We can pack the positional coordinates $\mathbf{x} \in \mathbb{R}^d$ and kinematic velocities $\mathbf{v} \in \mathbb{R}^d$ into a unified **Phase-Space State Vector** $\mathbf{y}(t) \in \mathbb{R}^{2d}$:

$$\mathbf{y}(t) = \begin{bmatrix} \mathbf{x}(t) \\ \mathbf{v}(t) \end{bmatrix} = \begin{bmatrix} x_1(t) \\ \vdots \\ x_d(t) \\ v_1(t) \\ \vdots \\ v_d(t) \end{bmatrix}$$

The complete differential evolution of the physical universe is then governed by the vector field equation:

$$\frac{d\mathbf{y}}{dt} = \mathbf{f}(\mathbf{y}(t), t), \qquad \text{where } \mathbf{f}(\mathbf{y}, t) = \begin{bmatrix} \mathbf{v} \\ \frac{1}{m}\mathbf{F}_{\text{net}}(\mathbf{x}, \mathbf{v}, t) \end{bmatrix}$$

#### The Initial Value Problem (IVP)
To determine the future trajectory of this physical system, calculus requires not merely the differential law $\mathbf{f}(\mathbf{y}, t)$, but a known boundary condition at a starting epoch $t_0$. This configuration is formally defined as the **Initial Value Problem (IVP)**:

$$\begin{cases}
\dfrac{d\mathbf{y}}{dt} = \mathbf{f}(\mathbf{y}(t), t) \\
\mathbf{y}(t_0) = \mathbf{y}_0 = \begin{bmatrix} \mathbf{x}_0 \\ \mathbf{v}_0 \end{bmatrix}
\end{cases}$$

Under the **Picard-Lindelöf Existence and Uniqueness Theorem**, if the vector field $\mathbf{f}(\mathbf{y}, t)$ is continuous in $t$ and uniformly Lipschitz continuous with respect to $\mathbf{y}$ over a domain $D$, there exists a unique, continuous, differentiable trajectory $\mathbf{y}(t)$ satisfying the IVP for some time interval $[t_0 - \epsilon, t_0 + \epsilon]$.

```
+-------------------------------------------------------------------------+
|                  THE CONTINUOUS INITIAL VALUE PROBLEM                   |
+-------------------------------------------------------------------------+
|                                                                         |
|  Initial Condition:  y(t_0) = [ x_0,  v_0 ]^T                           |
|                                |                                        |
|                                v                                        |
|  Vector Field Flow:  dy/dt  = f(y, t) = [ v,  F(x, v, t) / m ]^T        |
|                                |                                        |
|                                v                                        |
|  Continuous Curve:   y(t)   = y_0 + \int_{t_0}^t f(y(\tau), \tau) d\tau |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 1.2 The Illusion of Closed-Form Solutions: Why Analytical Calculus Fails

Students of elementary physics are introduced to motion through solvable pedagogical examples:
1. **Constant Acceleration:** $\mathbf{x}(t) = \mathbf{x}_0 + \mathbf{v}_0 t + \frac{1}{2}\mathbf{a} t^2$.
2. **Linear Mass-Spring (Simple Harmonic Motion):** $\ddot{x} + \omega^2 x = 0 \implies x(t) = A \cos(\omega t + \phi)$.
3. **Linear Viscous Damping:** $m\ddot{x} + c\dot{x} = 0 \implies v(t) = v_0 e^{-(c/m)t}$.

These pristine mathematical functions seduce the novice into believing that physics is an orderly catalog of closed-form formulas. In truth, these solvable problems represent an infinitesimal, measure-zero sliver of physical reality.

#### The Three-Body Gravitational Catastrophe
In 1687, Newton solved the two-body gravitational problem (a planet orbiting a star), deriving Kepler's ellipses analytically. However, when a third body is added—such as the Sun, the Earth, and the Moon interacting via mutual inverse-square Newtonian gravitation:

$$m_i \frac{d^2 \mathbf{r}_i}{dt^2} = -G \sum_{j \ne i} \frac{m_i m_j}{\|\mathbf{r}_i - \mathbf{r}_j\|^3} (\mathbf{r}_i - \mathbf{r}_j), \qquad i, j \in \{1, 2, 3\}$$

the system of 18 coupled first-order scalar differential equations **cannot be integrated in closed form using standard elementary functions**.

In 1887, King Oscar II of Sweden sponsored a grand mathematical prize to solve the stability of the solar system. The French polymath **Henri Poincaré** proved that no general algebraic or trigonometric closed-form solution exists. More profoundly, Poincaré discovered that non-linear three-body systems exhibit **deterministic chaos**: phase-space trajectories tangle into homoclinic tangles, where two orbits starting with an initial separation of $10^{-15}\text{ m}$ diverge exponentially into completely distinct galaxies.

#### Real-World Non-Linearities
Outside simplified textbooks, physical forces are inherently non-linear and coupled:
- **Aerodynamic Drag:** Real fluid drag is quadratic in velocity:
  $$\mathbf{F}_{\text{drag}} = -\frac{1}{2} C_d \rho A \|\mathbf{v}\| \mathbf{v}$$
  The non-linear term $\|\mathbf{v}\|\mathbf{v} = \sqrt{v_x^2 + v_y^2 + v_z^2} \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$ couples the $x$, $y$, and $z$ motion irreversibly. There is no elementary closed-form solution for a 2D or 3D baseball trajectory in air.
- **Large-Angle Pendulums:** A real pendulum obeys:
  $$\ddot{\theta} + \frac{g}{L} \sin \theta = 0$$
  The small-angle approximation $\sin \theta \approx \theta$ collapses when the pendulum swings widely. The exact continuous solution requires Jacobian elliptic integrals ($\text{sn}(u, k)$), which themselves cannot be evaluated without numerical approximations!
- **Multi-Body Rigid Contact & Friction:** Coulomb dry friction exhibits discontinuous step-function behavior:
  $$\mathbf{F}_f = -\mu \|\mathbf{F}_N\| \frac{\mathbf{v}}{\|\mathbf{v}\|}$$
  which lacks even first-order continuity at $\mathbf{v} = \mathbf{0}$.

*The Inescapable Conclusion:* If human civilization wishes to land rovers on Mars, simulate aerodynamic airflow over hypersonic wings, predict climate dynamics, or render interactive video game worlds, **we must compute trajectories numerically**.

---

### 1.3 The Discretization of the Time Continuum

Because digital microprocessors operate in discrete clock cycles (governed by quartz oscillators pulsing billions of times per second), a computer cannot evaluate a continuum. It must convert continuous time $t \in [t_0, t_{\text{final}}]$ into a discrete lattice of chronological sample points.

Let $\Delta t \in \mathbb{R}^+$ represent the **fundamental integration step size** (or **timestep**).
The continuous time axis is mapped into an ordered sequence of discrete epochs:

$$t_n = t_0 + n \Delta t, \qquad n \in \{0, 1, 2, \dots, N\}$$

```
Continuous Continuum:  ---------------------------------------------------> t
                       |--------- dt --------->|
                       
Discrete Lattice:      o-----------o-----------o-----------o-----------o--> t
                      t_0         t_1         t_2         t_3         t_4
                     (n=0)       (n=1)       (n=2)       (n=3)       (n=4)
                      |           |           |           |           |
                     y_0         y_1         y_2         y_3         y_4
```

We denote:
- $\mathbf{y}(t_n)$: The true, exact mathematical solution at time $t_n$.
- $\mathbf{y}_n$: The approximate numerical state vector generated by the digital computer's algorithm at tick $n$.

#### The Fundamental Integral Form
Integrating the continuous differential equation $\dot{\mathbf{y}} = \mathbf{f}(\mathbf{y}, t)$ over a single discrete time interval $[t_n, t_{n+1}]$ yields the exact Volterra integral relation:

$$\mathbf{y}(t_{n+1}) = \mathbf{y}(t_n) + \int_{t_n}^{t_{n+1}} \mathbf{f}(\mathbf{y}(\tau), \tau) d\tau$$

Every numerical integration algorithm in existence—from simple Euler stepping to sophisticated 8th-order Runge-Kutta and symplectic Gauss-Legendre methods—is fundamentally a **numerical quadrature rule** designed to approximate this definite integral across the interval $\Delta t$:

$$\int_{t_n}^{t_{n+1}} \mathbf{f}(\mathbf{y}(\tau), \tau) d\tau \approx \Delta t \cdot \sum_{i=1}^{s} b_i \mathbf{k}_i$$

Where $s$ is the number of stages, $b_i$ are quadrature weights, and $\mathbf{k}_i = \mathbf{f}(\mathbf{Y}_i, t_n + c_i \Delta t)$ are evaluated derivative samples.

---

### 1.4 The Fundamental Engineering Trilemma

In computational physics and real-time graphics engineering, every numerical integrator exists at the intersection of three competing, mutually antagonistic forces:

```
                          [ ACCURACY ]
                         /            \
                        /              \
                       /    TRILEMMA    \
                      /   OF INTEGRATION \
                     /                    \
     [ NUMERICAL STABILITY ] ------------ [ COMPUTATIONAL SPEED ]
```

1. **Accuracy (Truncation Error):** How closely does the discrete sequence $\{\mathbf{y}_0, \mathbf{y}_1, \dots\}$ match the true continuous trajectory $\mathbf{y}(t)$? High accuracy requires higher-order polynomial approximations, multi-stage derivative evaluations, or extremely small $\Delta t$.
2. **Numerical Stability (Symplectic Energy Preservation):** Over thousands or millions of integration steps, does the algorithm conserve physical invariants (total energy, linear momentum, angular momentum, phase-space volume)? Or does the numerical error accumulate monotonically, causing the system to artificially bleed away its velocity (damping) or violently explode into infinite velocities?
3. **Computational Speed (FLOP Budget & Memory Throughput):** Can the algorithm compute the state update within a rigid real-time budget (e.g., $16.67\text{ ms}$ for 60 FPS, or $6.94\text{ ms}$ for 144 FPS) across 50,000 interacting particles?

#### The Failure Modes of Naive Compromises
- Choosing speed alone produces **Explicit Euler**: fast, but violates energy conservation and explodes in harmonic systems.
- Choosing accuracy alone produces **Higher-Order Classical Runge-Kutta (RK4)**: mathematically precise over short trajectories, but non-symplectic, causing planetary orbits to slowly decay over long simulation runs while consuming $4\times$ the CPU derivative evaluations.
- Choosing stability alone produces **Implicit Backward Euler**: unconditionally stable against explosive blow-up, but introduces massive artificial numerical viscosity that sucks all dynamic realism out of the world.

The ultimate quest of this module is to master the **Symplectic Integrator Family**—most notably **Semi-Implicit Euler** and **Velocity Verlet**—which conquer this trilemma by preserving phase-space geometry at negligible CPU cost.

---

### 1.5 Ten In-Depth Progressive Worked Examples

#### Example 1.1: State-Space Reduction of a 1D Damped Harmonic Oscillator
*Scenario:* A mass-spring-damper system is governed by the second-order ODE:
$$m \ddot{x} + c \dot{x} + k x = 0$$
where $m = 2.0\text{ kg}$, $c = 0.8\text{ N}\cdot\text{s/m}$, and $k = 50.0\text{ N/m}$. Convert this equation into a standard first-order vector dynamical system $\dot{\mathbf{y}} = \mathbf{f}(\mathbf{y})$.

*Step 1: Isolate the highest derivative $\ddot{x}$:*
$$\ddot{x} = -\frac{c}{m}\dot{x} - \frac{k}{m}x$$
Substitute numerical parameters:
$$\frac{c}{m} = \frac{0.8}{2.0} = 0.4\text{ s}^{-1}, \qquad \frac{k}{m} = \frac{50.0}{2.0} = 25.0\text{ s}^{-2}$$
$$\ddot{x} = -0.4 \dot{x} - 25.0 x$$

*Step 2: Define phase-space state variables:*
Let $y_1 = x$ (position, meters).
Let $y_2 = \dot{x} = v$ (velocity, meters per second).
The state vector is:
$$\mathbf{y} = \begin{bmatrix} y_1 \\ y_2 \end{bmatrix} = \begin{bmatrix} x \\ v \end{bmatrix} \in \mathbb{R}^2$$

*Step 3: Formulate first-order time derivatives:*
$$\dot{y}_1 = \dot{x} = v = y_2$$
$$\dot{y}_2 = \ddot{x} = -25.0 y_1 - 0.4 y_2$$

*Step 4: Express in canonical matrix form $\dot{\mathbf{y}} = \mathbf{A} \mathbf{y}$:*
$$\frac{d}{dt}\begin{bmatrix} y_1 \\ y_2 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -25.0 & -0.4 \end{bmatrix} \begin{bmatrix} y_1 \\ y_2 \end{bmatrix}$$

*Verification & Sanity Check:* The system matrix has trace $\text{Tr}(\mathbf{A}) = -0.4 < 0$ and determinant $\det(\mathbf{A}) = 0 - (-25.0) = 25.0 > 0$. The eigenvalues are $\lambda = -0.2 \pm i\sqrt{25 - 0.04} \approx -0.2 \pm 4.996 i$. The negative real part confirms physical energy dissipation (damping).

---

#### Example 1.2: Dimensionality of an $N$-Body Phase Space
*Scenario:* A solar system simulation models the Sun and 8 planets ($N = 9$ bodies) interacting in 3D Euclidean space. Calculate the total dimensionality of the global continuous state vector $\mathbf{Y}(t)$ and determine how many 64-bit floating-point numbers are required to represent one snapshot.

*Step 1: Degrees of freedom per body:*
Each body in 3D space requires:
- 3 spatial position coordinates: $(x, y, z)$.
- 3 velocity coordinates: $(v_x, v_y, v_z)$.
Phase space degrees of freedom per body:
$$d_{\text{body}} = 3 + 3 = 6\text{ dimensions}$$

*Step 2: Total phase space dimensionality:*
For $N = 9$ bodies:
$$D = N \times d_{\text{body}} = 9 \times 6 = 54\text{ dimensions}$$
The state vector is $\mathbf{Y}(t) \in \mathbb{R}^{54}$.

*Step 3: Memory footprint:*
Each coordinate is stored as an IEEE 754 double-precision float (8 bytes):
$$\text{Memory} = 54 \times 8\text{ bytes} = 432\text{ bytes}$$

*Significance:* Despite the celestial system spanning millions of kilometers, its entire physical reality at an instant $t$ is fully captured by just 432 bytes in memory.

---

#### Example 1.3: Evaluating Exact Volterra Integral for Uniform Gravitational Acceleration
*Scenario:* A projectile experiences constant gravitational acceleration $\mathbf{a} = \begin{bmatrix} 0 \\ -9.8 \end{bmatrix}\text{ m/s}^2$. Starting from $\mathbf{x}_0 = \begin{bmatrix} 0 \\ 100 \end{bmatrix}\text{ m}$ and $\mathbf{v}_0 = \begin{bmatrix} 20 \\ 0 \end{bmatrix}\text{ m/s}$ at $t_0 = 0$, evaluate the exact Volterra integral over the discrete time step $\Delta t = 0.1\text{ s}$ to find $\mathbf{y}(t_1)$.

*Step 1: State the integral equation for velocity:*
$$\mathbf{v}(t_1) = \mathbf{v}_0 + \int_{0}^{\Delta t} \mathbf{a}(\tau) d\tau$$
Since $\mathbf{a}$ is constant:
$$\mathbf{v}(t_1) = \begin{bmatrix} 20 \\ 0 \end{bmatrix} + \mathbf{a} \cdot \Delta t = \begin{bmatrix} 20 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ -9.8 \end{bmatrix} \times 0.1 = \begin{bmatrix} 20 \\ -0.98 \end{bmatrix}\text{ m/s}$$

*Step 2: State the integral equation for position:*
$$\mathbf{x}(t_1) = \mathbf{x}_0 + \int_{0}^{\Delta t} \mathbf{v}(\tau) d\tau$$
Since $\mathbf{v}(\tau) = \mathbf{v}_0 + \mathbf{a}\tau$:
$$\mathbf{x}(t_1) = \mathbf{x}_0 + \int_{0}^{\Delta t} (\mathbf{v}_0 + \mathbf{a}\tau) d\tau = \mathbf{x}_0 + \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a} \Delta t^2$$
Evaluate numerically:
$$\mathbf{x}(t_1) = \begin{bmatrix} 0 \\ 100 \end{bmatrix} + \begin{bmatrix} 20 \\ 0 \end{bmatrix}(0.1) + \frac{1}{2}\begin{bmatrix} 0 \\ -9.8 \end{bmatrix}(0.1)^2$$
$$\mathbf{x}(t_1) = \begin{bmatrix} 0 \\ 100 \end{bmatrix} + \begin{bmatrix} 2.0 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ -0.049 \end{bmatrix} = \begin{bmatrix} 2.0 \\ 99.951 \end{bmatrix}\text{ m}$$

*Conclusion:* For constant forces, the exact Volterra integral yields the familiar Galilean kinematic equations.

---

#### Example 1.4: Demonstrating the Non-Integrability of Quadratic Drag
*Scenario:* A projectile moves in 1D under quadratic air resistance:
$$\dot{v} = -k v^2, \qquad v(0) = v_0$$
where $k = 0.05\text{ m}^{-1}$ and $v_0 = 40.0\text{ m/s}$. Find the analytical solution $v(t)$, and explain why extending this to 2D motion with gravity creates an unintegrable system.

*Step 1: Solve 1D equation via separation of variables:*
$$\frac{dv}{dt} = -k v^2 \implies \frac{dv}{v^2} = -k dt$$
Integrate both sides:
$$\int_{v_0}^{v} \frac{1}{u^2} du = -\int_{0}^{t} k dt$$
$$\left[ -\frac{1}{u} \right]_{v_0}^{v} = -k t \implies -\frac{1}{v} + \frac{1}{v_0} = -k t$$
$$\frac{1}{v} = \frac{1}{v_0} + k t = \frac{1 + k v_0 t}{v_0}$$
$$v(t) = \frac{v_0}{1 + k v_0 t}$$

*Step 2: Numerical evaluation at $t = 1.0\text{ s}$:*
$$v(1.0) = \frac{40.0}{1 + 0.05 \times 40.0 \times 1.0} = \frac{40.0}{1 + 2.0} = \frac{40.0}{3.0} \approx 13.333\text{ m/s}$$

*Step 3: Why 2D with gravity fails closed-form integration:*
In 2D, the equations are:
$$\dot{v}_x = -k \sqrt{v_x^2 + v_y^2} \cdot v_x$$
$$\dot{v}_y = -g - k \sqrt{v_x^2 + v_y^2} \cdot v_y$$
The radical $\sqrt{v_x^2 + v_y^2}$ couples $v_x$ and $v_y$ non-linearly. Separating variables is mathematically impossible. This system possesses no elementary closed-form solution, proving that even a simple baseball in flight necessitates discrete numerical simulation.

---

#### Example 1.5: Discrete Difference Map for a Free Particle
*Scenario:* A particle moves in 1D with no forces acting upon it ($F = 0$). An engineer designs a naive discrete stepping algorithm:
$$x_{n+1} = x_n + v_n \Delta t + \alpha (x_n - x_{n-1})$$
where $\alpha \in \mathbb{R}$ is an accidental numerical feedback coefficient. Determine what happens to the discrete physical trajectory if $\alpha = 0.05$ versus $\alpha = 0.00$.

*Step 1: Case $\alpha = 0.00$ (Ideal discrete map):*
$$x_{n+1} = x_n + v_n \Delta t$$
Since $F = 0 \implies v_{n+1} = v_n = v_0$.
$$x_n = x_0 + n v_0 \Delta t = x_0 + v_0 t_n$$
The discrete solution matches the continuous physics identically.

*Step 2: Case $\alpha = 0.05$ (Erroneous feedback):*
Assume $x_0 = 0\text{ m}$, $v_0 = 10\text{ m/s}$, $\Delta t = 0.1\text{ s}$.
- Step 0 to 1 ($x_{-1} = -1.0\text{ m}$):
  $$x_1 = 0 + 10(0.1) + 0.05(0 - (-1.0)) = 1.0 + 0.05(1.0) = 1.05\text{ m}$$
- Step 1 to 2:
  $$x_2 = 1.05 + 10(0.1) + 0.05(1.05 - 0.0) = 1.05 + 1.0 + 0.0525 = 2.1025\text{ m}$$
- Step 2 to 3:
  $$x_3 = 2.1025 + 1.0 + 0.05(2.1025 - 1.05) = 3.1025 + 0.05(1.0525) = 3.1551\text{ m}$$

*Analysis:* Instead of traveling $1.0\text{ m}$ per step, the particle travels $1.05\text{ m}$, $1.0525\text{ m}$, $1.0526\text{ m}\dots$ The particle is artificially accelerating with zero applied physical force! This illustrates how subtle algorithmic terms inject spurious energy into discrete state maps.

---

#### Example 1.6: Measuring Discretization Drift in a Decaying Exponential
*Scenario:* Consider the radioactive decay / thermal cooling equation:
$$\dot{y} = -\lambda y, \qquad y(0) = 100.0, \quad \lambda = 2.0\text{ s}^{-1}$$
Compare the exact solution at $t = 0.5\text{ s}$ with a discrete Forward Euler step using $\Delta t = 0.5\text{ s}$ versus two steps of $\Delta t = 0.25\text{ s}$.

*Step 1: Exact analytical value at $t = 0.5\text{ s}$:*
$$y_{\text{exact}}(t) = y_0 e^{-\lambda t} = 100.0 \cdot e^{-2.0 \times 0.5} = 100.0 \cdot e^{-1.0} \approx \frac{100.0}{2.7182818} \approx 36.7879$$

*Step 2: Single Euler step with $\Delta t = 0.5\text{ s}$:*
$$y_1 = y_0 + \dot{y}_0 \Delta t = y_0 - \lambda y_0 \Delta t = y_0 (1 - \lambda \Delta t)$$
$$y_1 = 100.0 \times (1 - 2.0 \times 0.5) = 100.0 \times (1 - 1.0) = 0.0000$$
Error:
$$\text{Error}_1 = |36.7879 - 0.0000| = 36.7879 \quad (100\%\text{ relative error})$$

*Step 3: Two Euler steps with $\Delta t = 0.25\text{ s}$:*
$$y_1 = 100.0 \times (1 - 2.0 \times 0.25) = 100.0 \times (1 - 0.5) = 50.0$$
$$y_2 = 50.0 \times (1 - 2.0 \times 0.25) = 50.0 \times (1 - 0.5) = 25.0$$
Error:
$$\text{Error}_2 = |36.7879 - 25.0000| = 11.7879$$

*Sanity Check:* Halving the timestep from $0.5\text{ s}$ to $0.25\text{ s}$ reduced the error from $36.79$ to $11.79$, illustrating the first-order convergence rate of Euler integration.

---

#### Example 1.7: Timestep Selection for a Stiff High-Frequency Oscillator
*Scenario:* A molecular bond vibrates as a harmonic oscillator with angular frequency $\omega = 1,000\text{ rad/s}$ (frequency $f \approx 159.15\text{ Hz}$, period $T = \frac{2\pi}{\omega} \approx 0.006283\text{ s} = 6.28\text{ ms}$).
A programmer naively attempts to simulate this bond using a standard physics game loop timestep of $\Delta t = \frac{1}{60}\text{ s} \approx 0.016667\text{ s} = 16.67\text{ ms}$.
Explain why this simulation fails, and calculate the maximum allowable timestep according to the Nyquist-Shannon sampling theorem.

*Step 1: Compare timestep with physical period:*
$$\frac{\Delta t}{T} = \frac{16.67\text{ ms}}{6.28\text{ ms}} \approx 2.65$$
The timestep is **over 2.6 times longer than an entire vibration cycle**! In a single numerical step, the molecule misses the compression, equilibrium crossing, and expansion phases entirely.

*Step 2: Nyquist-Shannon sampling limit:*
To resolve an oscillatory mode without total aliasing, the sampling rate must be at least twice the physical frequency:
$$f_{\text{sample}} > 2 f_{\text{phys}} \implies \Delta t_{\text{max}} < \frac{T}{2} = \frac{\pi}{\omega} = \frac{\pi}{1,000} \approx 0.00314\text{ s} = 3.14\text{ ms}$$

*Step 3: Engineering rule of thumb for numerical stability:*
In practice, symplectic numerical integrators require at least 15 to 20 samples per oscillation cycle to maintain accurate energy bounds:
$$\Delta t_{\text{practical}} \le \frac{T}{20} = \frac{0.006283\text{ s}}{20} \approx 0.000314\text{ s} = 0.314\text{ ms}$$
Running at 60 Hz would result in explosive numerical destruction within 2 frames.

---

#### Example 1.8: FLOPs Budget for Real-Time Physics at 60 Hz
*Scenario:* A game engine must simulate $N = 10,000$ particles at 60 Hz on a single CPU core.
Each particle requires:
- Force accumulation: 12 FLOPs
- Integrator position update: 6 FLOPs
- Integrator velocity update: 6 FLOPs
- Spatial broadphase binning: 10 FLOPs
Total = 34 FLOPs per particle per step.
If the dedicated physics thread has an execution budget of $t_{\text{budget}} = 5.0\text{ ms}$ ($0.005\text{ s}$) per frame:
1. Calculate the total floating-point operations required per frame.
2. Calculate the required computational throughput in GFLOPs ($10^9$ operations/second).
3. Can a modern $3.5\text{ GHz}$ CPU core sustain this load?

*Step 1: Total FLOPs per frame:*
$$\text{FLOPs}_{\text{frame}} = 10,000\text{ particles} \times 34\text{ FLOPs/particle} = 340,000\text{ FLOPs}$$

*Step 2: Required computational throughput:*
$$\text{Throughput} = \frac{340,000\text{ FLOPs}}{0.005\text{ s}} = 68,000,000\text{ FLOPs/second} = 0.068\text{ GFLOPs}$$

*Step 3: Hardware comparison:*
A modern x86 CPU core running at $3.5\text{ GHz}$ with AVX2 can execute two 8-wide FMA instructions per cycle:
$$\text{Peak Single-Core Throughput} = 3.5 \times 10^9\text{ cycles/s} \times 16\text{ FLOPs/cycle} = 56.0\text{ GFLOPs}$$
Since $0.068\text{ GFLOPs} \ll 56.0\text{ GFLOPs}$, pure arithmetic is not the bottleneck. The real bottleneck is **memory bandwidth and cache locality** (streaming particle data from RAM into registers).

---

#### Example 1.9: Phase-Space Vector Field at a Fixed Point
*Scenario:* A pendulum with normalized parameters obeys:
$$\dot{x}_1 = x_2$$
$$\dot{x}_2 = -\sin(x_1)$$
Analyze the phase-space vector field at the stable equilibrium $(0, 0)$ and at the inverted unstable equilibrium $(\pi, 0)$.

*Step 1: Evaluate vector field at $(0, 0)$:*
$$\mathbf{f}\left(\begin{bmatrix} 0 \\ 0 \end{bmatrix}\right) = \begin{bmatrix} 0 \\ -\sin(0) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
Jacobian matrix $J = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \frac{\partial f_1}{\partial x_2} \\ \frac{\partial f_2}{\partial x_1} & \frac{\partial f_2}{\partial x_2} \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -\cos(x_1) & 0 \end{bmatrix}$.
At $x_1 = 0$:
$$J(0, 0) = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$
Eigenvalues: $\det(J - \lambda I) = \lambda^2 + 1 = 0 \implies \lambda = \pm i$.
Pure imaginary eigenvalues confirm a **center (elliptic fixed point)**: trajectories circulate in closed, energy-conserving orbits.

*Step 2: Evaluate vector field at $(\pi, 0)$:*
$$\mathbf{f}\left(\begin{bmatrix} \pi \\ 0 \end{bmatrix}\right) = \begin{bmatrix} 0 \\ -\sin(\pi) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
At $x_1 = \pi$: $\cos(\pi) = -1$.
$$J(\pi, 0) = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$
Eigenvalues: $\lambda^2 - 1 = 0 \implies \lambda = \pm 1$.
One positive real eigenvalue ($\lambda = +1$) and one negative real eigenvalue ($\lambda = -1$) confirm a **saddle point (hyperbolic fixed point)**: the inverted pendulum is dynamically unstable.

---

#### Example 1.10: Picard-Lindelöf Lipschitz Constant Calculation
*Scenario:* A non-linear velocity damper experiences drag force $f(v) = -k v^3$ where $k = 0.1\text{ s}^2/\text{m}^2$.
Determine if $f(v)$ is globally Lipschitz continuous on $\mathbb{R}$, or locally Lipschitz continuous on a bounded compact interval $[-V_{\text{max}}, V_{\text{max}}]$ with $V_{\text{max}} = 20.0\text{ m/s}$. Find the Lipschitz constant $L$.

*Step 1: Check global Lipschitz continuity:*
By definition, a function is Lipschitz continuous if there exists $L \ge 0$ such that:
$$|f(v_1) - f(v_2)| \le L |v_1 - v_2|, \quad \forall v_1, v_2 \in \mathbb{R}$$
By the Mean Value Theorem:
$$|f'(v)| = |-3 k v^2| = 3 k v^2$$
As $v \to \infty$, $|f'(v)| \to \infty$. The derivative is unbounded on $\mathbb{R}$.
Therefore, $f(v)$ is **not globally Lipschitz continuous**. Solutions could potentially blow up to infinity in finite time if unconstrained.

*Step 2: Compute local Lipschitz constant on $[-20.0, 20.0]$:*
On the compact domain $[-V_{\text{max}}, V_{\text{max}}]$:
$$L = \max_{v \in [-20, 20]} |f'(v)| = 3 k V_{\text{max}}^2 = 3 \times 0.1 \times (20.0)^2 = 0.3 \times 400.0 = 120.0\text{ s}^{-1}$$

*Conclusion:* On the operational domain $v \in [-20, 20]\text{ m/s}$, the vector field is locally Lipschitz continuous with constant $L = 120.0\text{ s}^{-1}$. By the Picard-Lindelöf theorem, a unique physical solution is guaranteed to exist.

---

### 1.6 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 1.1 – 1.2)

##### Exercise 1.1
Define the **Initial Value Problem (IVP)** for a classical mechanical system. Explain the physical and mathematical distinction between the continuous state trajectory $\mathbf{y}(t)$ and the discrete sequence $\{\mathbf{y}_0, \mathbf{y}_1, \mathbf{y}_2, \dots\}$ produced by a digital computer.

##### Exercise 1.2
State why Henri Poincaré's discovery of the Three-Body Problem proved that analytical closed-form integration cannot solve general gravitational or molecular dynamics. What is deterministic chaos?

---

#### Tier 2: State-Space Reduction & Phase Space (Exercises 1.3 – 1.4)

##### Exercise 1.3
A non-linear Duffing oscillator modeling a vibrating beam obeys the equation:
$$\ddot{x} + \delta \dot{x} + \alpha x + \beta x^3 = \gamma \cos(\omega t)$$
with parameters $\delta = 0.2$, $\alpha = -1.0$, $\beta = 1.0$, $\gamma = 0.3$, and $\omega = 1.2$.
Convert this second-order non-autonomous differential equation into an autonomous system of three first-order differential equations.

##### Exercise 1.4
A simulation contains 500 rigid bodies in 2D space. Each body has translational position $(x, y)$, linear velocity $(v_x, v_y)$, rotational orientation angle $\theta$, and angular velocity $\omega$.
1. Calculate the dimensionality of the global phase-space state vector.
2. What is the total byte size of this state vector when stored in 64-bit floating-point precision?

---

#### Tier 3: Quadrature & Volterra Integrals (Exercises 1.5 – 1.6)

##### Exercise 1.5
A vehicle accelerates from rest ($x_0 = 0\text{ m}, v_0 = 0\text{ m/s}$) with time-dependent acceleration $a(t) = 3.0 t^2\text{ m/s}^2$.
1. Evaluate the exact analytical Volterra integrals for $v(t)$ and $x(t)$ across the interval $[0, \Delta t]$ with $\Delta t = 0.5\text{ s}$.
2. If a naive discrete algorithm assumes constant acceleration $a = a(0) = 0.0$ over the step, calculate the truncation error in position at $t = 0.5\text{ s}$.

##### Exercise 1.6
Prove that any autonomous second-order ODE of the form $\ddot{x} = f(x)$ possesses an exact mechanical energy invariant:
$$E(x, v) = \frac{1}{2} v^2 - \int f(x) dx = \text{constant}$$
by taking the continuous time derivative $\frac{dE}{dt}$.

---

#### Tier 4: Stability & Hardware Constraints (Exercises 1.7 – 1.8)

##### Exercise 1.7
Explain the **Fundamental Trilemma of Numerical Integration**. Why does optimizing purely for computational speed (e.g., using Forward Euler) destroy long-term physical stability in celestial or molecular simulations?

##### Exercise 1.8
A flight simulation engine runs at 120 Hz ($\Delta t = \frac{1}{120}\text{ s}$). The aircraft encounters supersonic shock turbulence characterized by an oscillatory pressure wave with frequency $f = 300\text{ Hz}$.
Explain why a 120 Hz simulation loop will experience catastrophic aliasing and numerical instability when interacting with this wave. What must the engine do to resolve this?

---

#### Tier 5: Theoretical Dynamics & Lipschitz Bounds (Exercises 1.9 – 1.10)

##### Exercise 1.9
Consider the differential equation:
$$\dot{y} = y^{2/3}, \qquad y(0) = 0$$
1. Show that $f(y) = y^{2/3}$ is not Lipschitz continuous at $y = 0$.
2. Demonstrate that this IVP possesses an infinite number of distinct valid solutions, violating the uniqueness guarantee of Picard-Lindelöf. Explain why non-Lipschitz equations cause non-deterministic behavior in computer simulations.

##### Exercise 1.10
A planetary orbital integrator evaluates gravitational acceleration for $N = 10,000$ stars using direct all-pairs $O(N^2)$ summation.
1. How many pairwise gravitational force evaluations are required per timestep?
2. If each pairwise evaluation requires 20 floating-point operations, calculate the total FLOPs per step.
3. At 60 Hz, what computational throughput (in TFLOPs) is required? Can a modern gaming GPU handle this load?

---

### 1.7 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 1.1
*Definition of the IVP:* The Initial Value Problem is the combination of a system of differential equations $\dot{\mathbf{y}}(t) = \mathbf{f}(\mathbf{y}(t), t)$ defining the instantaneous rate of change of a physical state vector, along with a specified boundary state $\mathbf{y}(t_0) = \mathbf{y}_0$ at an initial instant $t_0$.

*Continuous vs. Discrete Distinction:*
- The continuous trajectory $\mathbf{y}(t)$ is a smooth, unbroken mapping $\mathbf{y}: [t_0, \infty) \to \mathbb{R}^D$ existing on a real mathematical continuum. It satisfies the differential equation at every infinitesimal instant $dt \to 0$.
- The discrete sequence $\{\mathbf{y}_0, \mathbf{y}_1, \dots\}$ is a finite lattice of discrete digital vectors produced at clocked intervals $t_n = t_0 + n \Delta t$. Between two ticks $t_n$ and $t_{n+1}$, the computer possesses no physical information. The discrete state is subject to truncation errors from finite approximations and roundoff errors from IEEE 754 binary floating-point representation.

---

#### Solution to Exercise 1.2
*Poincaré's Three-Body Discovery:* In 1887, Henri Poincaré proved that the three-body gravitational problem cannot be solved analytically using algebraic, trigonometric, or other elementary functions because the system lacks a sufficient number of first integrals of motion (conservation laws) relative to its degrees of freedom.

*Deterministic Chaos:* Deterministic chaos is the property of non-linear dynamical systems where the equations of motion are strictly deterministic (no randomness exists), yet trajectories exhibit **sensitive dependence on initial conditions**. If two initial states differ by an infinitesimal perturbation $\delta \mathbf{y}_0$, their separation expands exponentially:
$$\|\delta \mathbf{y}(t)\| \approx \|\delta \mathbf{y}_0\| e^{\lambda t}$$
where $\lambda > 0$ is the maximal Lyapunov exponent. Because physical measurements and digital floats have finite precision, long-term analytical prediction is fundamentally impossible.

---

#### Solution to Exercise 1.3
Given: $\ddot{x} + 0.2 \dot{x} - x + x^3 = 0.3 \cos(1.2 t)$.
Isolate $\ddot{x}$:
$$\ddot{x} = -0.2 \dot{x} + x - x^3 + 0.3 \cos(1.2 t)$$
To eliminate the explicit time dependence $t$ and make the system autonomous, introduce three state variables:
- $y_1 = x$ (position)
- $y_2 = \dot{x}$ (velocity)
- $y_3 = 1.2 t$ (phase angle)

The first-order autonomous system is:
$$\begin{cases}
\dot{y}_1 = y_2 \\
\dot{y}_2 = -0.2 y_2 + y_1 - y_1^3 + 0.3 \cos(y_3) \\
\dot{y}_3 = 1.2
\end{cases}$$
In vector form:
$$\frac{d}{dt}\begin{bmatrix} y_1 \\ y_2 \\ y_3 \end{bmatrix} = \begin{bmatrix} y_2 \\ -0.2 y_2 + y_1 - y_1^3 + 0.3 \cos(y_3) \\ 1.2 \end{bmatrix}$$
The second-order non-autonomous equation has been transformed into a canonical autonomous first-order vector system in $\mathbb{R}^3$.

---

#### Solution to Exercise 1.4
*Part 1: Dimensionality of phase space:*
For each 2D rigid body:
- Translational position: $(x, y) \implies 2$ coordinates
- Linear velocity: $(v_x, v_y) \implies 2$ coordinates
- Orientation angle: $\theta \implies 1$ coordinate
- Angular velocity: $\omega \implies 1$ coordinate
Total per body = $2 + 2 + 1 + 1 = 6$ degrees of freedom.

For $N = 500$ bodies:
$$D = 500 \times 6 = 3,000\text{ dimensions}$$
The global state vector is $\mathbf{Y} \in \mathbb{R}^{3000}$.

*Part 2: Byte size in 64-bit float:*
Each coordinate requires 8 bytes (`Float64`):
$$\text{Memory} = 3,000 \times 8\text{ bytes} = 24,000\text{ bytes} = 24\text{ KB}$$
The complete physical state of 500 interacting rigid bodies fits into just 24 kilobytes, smaller than a single low-resolution thumbnail image.

---

#### Solution to Exercise 1.5
*Part 1: Exact analytical Volterra integrals ($a(t) = 3.0 t^2$):*
- Exact velocity:
  $$v(t) = v_0 + \int_{0}^{t} a(\tau) d\tau = 0 + \int_{0}^{t} 3.0 \tau^2 d\tau = \left[ \tau^3 \right]_{0}^{t} = t^3$$
  At $t = \Delta t = 0.5\text{ s}$:
  $$v(0.5) = (0.5)^3 = 0.125\text{ m/s}$$
- Exact position:
  $$x(t) = x_0 + \int_{0}^{t} v(\tau) d\tau = 0 + \int_{0}^{t} \tau^3 d\tau = \left[ \frac{\tau^4}{4} \right]_{0}^{t} = \frac{t^4}{4}$$
  At $t = 0.5\text{ s}$:
  $$x(0.5) = \frac{(0.5)^4}{4} = \frac{0.0625}{4} = 0.015625\text{ m}$$

*Part 2: Naive discrete approximation ($a = a(0) = 0$):*
The naive algorithm assumes $a_0 = 3(0)^2 = 0\text{ m/s}^2$.
$$v_{\text{naive}} = v_0 + a_0 \Delta t = 0 + 0 = 0\text{ m/s}$$
$$x_{\text{naive}} = x_0 + v_0 \Delta t = 0 + 0 = 0\text{ m}$$

*Truncation Error:*
$$\text{Error} = |x_{\text{exact}} - x_{\text{naive}}| = |0.015625 - 0| = 0.015625\text{ m}$$
A $100\%$ error in position over a single step of half a second, proving why higher-order derivatives matter.

---

#### Solution to Exercise 1.6
*Proof of Energy Invariant:*
Given $\ddot{x} = f(x)$. Define potential energy function $V(x)$ such that $f(x) = -\frac{dV}{dx}$:
$$V(x) = -\int f(x) dx$$
Total mechanical energy per unit mass is:
$$E(x, v) = \frac{1}{2} v^2 + V(x) = \frac{1}{2} v^2 - \int f(x) dx$$

Differentiate $E$ with respect to time $t$ using the chain rule:
$$\frac{dE}{dt} = \frac{d}{dt}\left(\frac{1}{2} v^2\right) + \frac{d}{dt} V(x)$$
$$\frac{dE}{dt} = v \frac{dv}{dt} + \frac{dV}{dx} \frac{dx}{dt}$$
Substitute $\frac{dv}{dt} = \ddot{x} = f(x)$, $\frac{dx}{dt} = v$, and $\frac{dV}{dx} = -f(x)$:
$$\frac{dE}{dt} = v \cdot f(x) + (-f(x)) \cdot v = v f(x) - v f(x) \equiv 0$$
Since $\frac{dE}{dt} \equiv 0$, total mechanical energy $E$ is strictly constant along all trajectories of the system.
$\blacksquare$

---

#### Solution to Exercise 1.7
The Fundamental Trilemma states that numerical integrators must balance **Accuracy**, **Numerical Stability**, and **Computational Speed**.
When an engine optimizes exclusively for speed by selecting Forward Euler:
1. Forward Euler computes state updates using only current derivatives: $\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t$, $\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}_n \Delta t$.
2. This corresponds to the first two terms of a Taylor series, discarding all $O(\Delta t^2)$ terms.
3. In oscillatory and conservative systems (harmonic oscillators, planetary orbits), Forward Euler acts as an amplifier: on every single step, the state vector is multiplied by $\sqrt{1 + \omega^2 \Delta t^2} > 1$.
4. This introduces artificial positive energy into the system. Over time, orbits spiral outward toward infinity, springs stretch without bound, and physical simulations violently destabilize.

---

#### Solution to Exercise 1.8
*Sampling Frequency Comparison:*
Simulation tick rate: $f_{\text{sim}} = 120\text{ Hz}$ ($\Delta t \approx 8.33\text{ ms}$).
Turbulence wave frequency: $f_{\text{wave}} = 300\text{ Hz}$ ($T_{\text{wave}} \approx 3.33\text{ ms}$).

*Nyquist Criterion Violation:*
By the Nyquist-Shannon sampling theorem, to resolve a wave of frequency $f$, the sampling rate must satisfy:
$$f_{\text{sample}} > 2 f_{\text{wave}} = 2 \times 300\text{ Hz} = 600\text{ Hz}$$
Because $120\text{ Hz} \ll 600\text{ Hz}$, the simulation samples the wave less than half a time per cycle.

*Consequence & Solution:*
The wave's high-frequency energy aliases into spurious low-frequency oscillations. The integrator receives erratic, out-of-phase force impulses that destabilize the flight control equations.
To resolve this without running the entire graphics pipeline at 600 Hz, the engine must implement **Sub-Stepping**:
Within each $120\text{ Hz}$ frame ($8.33\text{ ms}$), the aerodynamic physics solver executes $5$ internal sub-steps of $\Delta t_{\text{sub}} = 1.67\text{ ms}$ ($600\text{ Hz}$), accurately integrating the pressure wave before presenting the state to the renderer.

---

#### Solution to Exercise 1.9
*Part 1: Non-Lipschitz property of $f(y) = y^{2/3}$ at $y=0$:*
Compute the derivative with respect to $y$:
$$f'(y) = \frac{2}{3} y^{-1/3} = \frac{2}{3 y^{1/3}}$$
As $y \to 0^+$, $f'(y) \to +\infty$.
Because the derivative is unbounded in any neighborhood containing $y = 0$, there exists no finite constant $L$ such that $|f(y_1) - f(y_2)| \le L|y_1 - y_2|$. Thus, $f(y)$ is not Lipschitz continuous at the origin.

*Part 2: Multiple valid solutions & non-determinism:*
Given $\dot{y} = y^{2/3}, y(0) = 0$:
- Solution 1: $y(t) \equiv 0$ for all $t \ge 0$.
  Check: $\dot{y} = 0 = 0^{2/3}$, $y(0) = 0$. Valid.
- Solution 2: Separate variables:
  $$\frac{dy}{y^{2/3}} = dt \implies 3 y^{1/3} = t \implies y(t) = \frac{t^3}{27}$$
  Check: $\dot{y} = \frac{3 t^2}{27} = \frac{t^2}{9}$. And $y^{2/3} = \left(\frac{t^3}{27}\right)^{2/3} = \frac{t^2}{9}$. Valid.
- Solution 3: The system can sit at $y = 0$ until an arbitrary time $C > 0$, and then branch:
  $$y(t) = \begin{cases} 0 & t \le C \\ \frac{(t - C)^3}{27} & t > C \end{cases}$$
Because infinite trajectories satisfy this equation, a computer cannot predict when the particle will spontaneously begin moving. In digital simulations, non-Lipschitz contact forces lead to erratic branching, floating-point divergence, and sudden spontaneous accelerations.

---

#### Solution to Exercise 1.10
*Part 1: Pairwise force evaluations ($N = 10,000$):*
By Newton's Third Law ($\mathbf{F}_{ij} = -\mathbf{F}_{ji}$), the number of unique pairs is:
$$N_{\text{pairs}} = \frac{N(N - 1)}{2} = \frac{10,000 \times 9,999}{2} = 49,995,000\text{ pairs} \approx 5.0 \times 10^7\text{ evaluations}$$

*Part 2: Total FLOPs per step:*
Each pair requires 20 FLOPs (displacement vector, distance squared, inverse square root, force scaling, impulse accumulation):
$$\text{FLOPs}_{\text{step}} = 49,995,000 \times 20\text{ FLOPs} = 999,900,000\text{ FLOPs} \approx 1.0 \times 10^9\text{ FLOPs} = 1.0\text{ GFLOP}$$

*Part 3: Required throughput at 60 Hz:*
$$\text{Throughput} = 1.0\text{ GFLOP} \times 60\text{ steps/s} = 60.0\text{ GFLOPs/s} = 0.060\text{ TFLOPs}$$

*Hardware Comparison:*
A modern consumer gaming GPU (such as an NVIDIA RTX 4070) delivers over $30.0\text{ TFLOPs}$ of single-precision floating-point throughput.
$$\frac{0.060\text{ TFLOPs}}{30.0\text{ TFLOPs}} \approx 0.002 = 0.2\%$$
A direct all-pairs gravitational solver consumes less than $1\%$ of modern GPU capacity, making 10,000-star real-time celestial simulations easily achievable via compute shaders or WebGPU.
