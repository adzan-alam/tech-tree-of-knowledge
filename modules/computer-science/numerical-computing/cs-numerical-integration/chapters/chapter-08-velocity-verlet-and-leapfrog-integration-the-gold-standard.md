# Chapter 08: Velocity Verlet & Leapfrog Integration — The Gold Standard of Simulation

> *"Position Verlet gave us exact time-reversibility, but stole our velocities. Semi-Implicit Euler gave us explicit velocity, but lagged by a half-step of first-order error. In 1982, Swope and Andersen discovered the ultimate synthesis: by splitting the velocity kick into two symmetric half-steps sandwiching a full-step positional drift, the odd error terms vanish, velocities and positions align synchronously, and the algorithm becomes the undisputed gold standard of real-time physics and molecular dynamics."*

---

### 8.1 The Genesis of the Gold Standard

In 1982, William C. Swope, Hans C. Andersen, Peter H. Berens, and Kent R. Wilson published a groundbreaking paper in the *Journal of Chemical Physics* titled *"A computer simulation method for the calculation of equilibrium constants"*.

The team was conducting massive molecular dynamics calculations simulating chemical reactions. They confronted the fundamental shortcomings of existing solvers:
- **Position Verlet (Størmer):** Required storing past positions $\mathbf{x}_{n-1}$, lacked synchronous velocities $\mathbf{v}_n$, and made velocity-dependent thermostats (such as the Nosé-Hoover or Berendsen thermostat) nearly impossible to implement.
- **Leapfrog Integration:** Evaluated positions at integer times $t_n$ and velocities at half-integer times $t_{n+1/2}$, creating a phase lag that corrupted instantaneous kinetic energy calculations ($T = \frac{1}{2}m v^2$).
- **Classical Runge-Kutta (RK4):** Required four separate force evaluations per particle per time step, was computationally sluggish, and suffered from secular non-symplectic energy decay over millions of steps.

Swope and Andersen formulated a mathematically equivalent, perfectly synchronous algorithm that solved every single one of these defects: **The Velocity Verlet Algorithm**.

---

### 8.2 Mathematical Derivation: Symmetric Strang Splitting

To derive Velocity Verlet from first principles, we utilize the mathematical theory of **Symmetric Operator Splitting** (developed by mathematician Gilbert Strang in 1968).

Recall the Hamiltonian vector field decomposition from Chapter 6:
- $\mathcal{A}$: The Kick vector field (momentum derivative from force): $\dot{\mathbf{x}} = \mathbf{0}, \quad \dot{\mathbf{v}} = \mathbf{a}(\mathbf{x})$.
- $\mathcal{B}$: The Drift vector field (position derivative from velocity): $\dot{\mathbf{x}} = \mathbf{v}, \quad \dot{\mathbf{v}} = \mathbf{0}$.

In Semi-Implicit Euler, we composed the operators asymmetrically:
$$\Phi_{\text{SIE}}(\Delta t) = e^{\Delta t \mathcal{B}} e^{\Delta t \mathcal{A}} = e^{\Delta t(\mathcal{A} + \mathcal{B}) + \frac{\Delta t^2}{2}[\mathcal{B}, \mathcal{A}] + O(\Delta t^3)}$$
By the Baker-Campbell-Hausdorff (BCH) formula, the first error term is of order $O(\Delta t^2)$, resulting in first-order global accuracy.

#### The Strang Symmetric Sandwich
Gilbert Strang proved that if you split an operator into two symmetric half-steps:

$$\Phi_{\text{Strang}}(\Delta t) \equiv e^{\frac{\Delta t}{2}\mathcal{A}} \cdot e^{\Delta t \mathcal{B}} \cdot e^{\frac{\Delta t}{2}\mathcal{A}}$$

The asymmetric commutator terms $[\mathcal{A}, \mathcal{B}]$ cancel identically!

$$e^{\frac{\Delta t}{2}\mathcal{A}} e^{\Delta t \mathcal{B}} e^{\frac{\Delta t}{2}\mathcal{A}} = e^{\Delta t(\mathcal{A} + \mathcal{B}) + O(\Delta t^3)}$$

The leading error term drops from $O(\Delta t^2)$ to $O(\Delta t^3)$, elevating the **Global Truncation Error from Order 1 to Order 2**!

```
+-------------------------------------------------------------------------+
|                  THE VELOCITY VERLET STRANG SANDWICH                    |
+-------------------------------------------------------------------------+
|                                                                         |
|  1. HALF-KICK:   v_{n+1/2} = v_n + 0.5 * a(x_n) * dt                    |
|                                |                                        |
|                                v                                        |
|  2. FULL-DRIFT:  x_{n+1}   = x_n + v_{n+1/2} * dt                       |
|                                |                                        |
|                                v                                        |
|  3. FORCE EVAL:  a_{n+1}   = F(x_{n+1}) / m                             |
|                                |                                        |
|                                v                                        |
|  4. HALF-KICK:   v_{n+1}   = v_{n+1/2} + 0.5 * a_{n+1} * dt             |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 8.3 The Four Canonical Steps of Velocity Verlet

In production game engines, astrophysics simulators, and molecular dynamics suites, Velocity Verlet executes in four distinct phases:

#### Step 1: First Half-Step Velocity Update (Half-Kick)
Advance velocity by half a timestep using the current acceleration $\mathbf{a}_n = \mathbf{F}(\mathbf{x}_n) / m$:

$$\mathbf{v}_{n+1/2} = \mathbf{v}_n + \frac{1}{2} \mathbf{a}(\mathbf{x}_n) \Delta t$$

#### Step 2: Full-Step Position Update (Full-Drift)
Advance position by a full timestep using the intermediate half-step velocity $\mathbf{v}_{n+1/2}$:

$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1/2} \Delta t$$

Notice that if we substitute Step 1 into Step 2:

$$\mathbf{x}_{n+1} = \mathbf{x}_n + \left( \mathbf{v}_n + \frac{1}{2} \mathbf{a}_n \Delta t \right) \Delta t = \mathbf{x}_n + \mathbf{v}_n \Delta t + \frac{1}{2} \mathbf{a}_n \Delta t^2$$

This is the exact Galilean kinematic equation of motion!

#### Step 3: Global Force Evaluation at New Position
Evaluate all applied physical forces (gravity, springs, electrostatics, boundary contacts) at the newly computed positions $\mathbf{x}_{n+1}$:

$$\mathbf{a}_{n+1} = \frac{1}{m} \mathbf{F}(\mathbf{x}_{n+1})$$

#### Step 4: Second Half-Step Velocity Update (Half-Kick)
Advance velocity from the half-step to the final integer time $t_{n+1}$ using the newly evaluated acceleration $\mathbf{a}_{n+1}$:

$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \mathbf{a}_{n+1} \Delta t$$

#### The Synchronous Triumph
Look at the state of the simulation at the conclusion of Step 4:
- The position $\mathbf{x}_{n+1}$ is at integer time $t_{n+1}$.
- The velocity $\mathbf{v}_{n+1}$ is at integer time $t_{n+1}$.
- Both variables are **perfectly synchronized** at the exact same chronological instant!
- Total physical kinetic energy $T = \frac{1}{2}m \|\mathbf{v}_{n+1}\|^2$ and potential energy $V = V(\mathbf{x}_{n+1})$ can be evaluated with zero phase error.

---

### 8.4 The Computational Efficiency: One Force Evaluation Per Step

A novice programmer inspecting the four steps might assume:
*"There are two velocity updates and a position update. Does Velocity Verlet require evaluating forces twice per step?"*

**No.** In an ongoing simulation loop, the second half-kick of step $n$ and the first half-kick of step $n+1$ are both based on the exact same acceleration $\mathbf{a}_{n+1}$!

By caching the acceleration array across iterations, the simulation loop executes **exactly ONE force evaluation per particle per time step**:

```typescript
// Production Loop: Exactly ONE force evaluation per tick!
function updateVelocityVerlet(dt: number): void {
  const dtHalf = 0.5 * dt;

  // Step 1 & 2: Half-kick and full-drift
  for (let i = 0; i < N; i++) {
    velX[i] += accelX[i] * dtHalf;
    velY[i] += accelY[i] * dtHalf;
    posX[i] += velX[i] * dt;
    posY[i] += velY[i] * dt;
  }

  // Step 3: Single global force evaluation at new positions
  computeAllForcesAndAccelerations(); // Computes new accelX and accelY

  // Step 4: Second half-kick
  for (let i = 0; i < N; i++) {
    velX[i] += accelX[i] * dtHalf;
    velY[i] += accelY[i] * dtHalf;
  }
}
```

Notice the remarkable efficiency:
- **Velocity Verlet consumes exactly the same number of force evaluations as Forward Euler (1 evaluation)**.
- Yet it delivers **second-order global accuracy ($O(\Delta t^2)$)** and **exact symplectic phase space preservation**!

---

### 8.5 The Leapfrog Formulation & Equivalence

In computational astrophysics (such as cosmological N-body dark matter simulations), physicists frequently refer to **Leapfrog Integration**.

In standard Leapfrog, positions and velocities are intentionally staggered on a interleaved timeline:
- Positions $\mathbf{x}$ are stored at integer ticks: $t_n, t_{n+1}, t_{n+2}, \dots$
- Velocities $\mathbf{v}$ are stored at half-integer ticks: $t_{n-1/2}, t_{n+1/2}, t_{n+3/2}, \dots$

```
Leapfrog Staggered Timeline:
Positions:    x_{n-1}                    x_n                    x_{n+1}
Timeline: -----o--------------------------o------------------------o------> t
                     \                  /   \                  /
                      v_{n-1/2}        /     v_{n+1/2}        /
Velocities: -------------o------------'----------o-----------'
```

The Leapfrog update equations are:

$$\mathbf{v}_{n+1/2} = \mathbf{v}_{n-1/2} + \mathbf{a}(\mathbf{x}_n) \Delta t$$

$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1/2} \Delta t$$

The velocities "leapfrog" over the positions, and the positions "leapfrog" over the velocities.

#### Mathematical Equivalence Proof
Velocity Verlet and Leapfrog are **identical mathematical trajectories**.
To convert from Leapfrog to Velocity Verlet, one simply interpolates the velocity to the integer tick:

$$\mathbf{v}_n = \frac{\mathbf{v}_{n-1/2} + \mathbf{v}_{n+1/2}}{2} = \mathbf{v}_{n-1/2} + \frac{1}{2}\mathbf{a}(\mathbf{x}_n)\Delta t$$

Velocity Verlet is simply Leapfrog rewritten so that memory buffers store synchronized values $(\mathbf{x}_n, \mathbf{v}_n)$ at the exact same physical time.

---

### 8.6 Phase Space Symplecticity & The Shadow Hamiltonian of Velocity Verlet

Because Velocity Verlet is the symmetric composition of three symplectic shear mappings:

$$\mathbf{M}_{\text{VV}} = \mathbf{M}_{\mathcal{K}}(\Delta t / 2) \cdot \mathbf{M}_{\mathcal{D}}(\Delta t) \cdot \mathbf{M}_{\mathcal{K}}(\Delta t / 2)$$

and since each individual matrix has determinant 1, the total Jacobian determinant is:

$$\det(\mathbf{M}_{\text{VV}}) = 1.0 \times 1.0 \times 1.0 \equiv \mathbf{1.000000}$$

#### The Shadow Hamiltonian of Velocity Verlet
According to Backward Error Analysis, Velocity Verlet exactly solves a modified Hamiltonian $\tilde{\mathcal{H}}$:

$$\tilde{\mathcal{H}}(\mathbf{x}, \mathbf{p}) = \mathcal{H}(\mathbf{x}, \mathbf{p}) + \Delta t^2 \mathcal{H}_2(\mathbf{x}, \mathbf{p}) + O(\Delta t^4)$$

For a general potential $V(\mathbf{x})$:

$$\tilde{\mathcal{H}} = \frac{\|\mathbf{p}\|^2}{2m} + V(\mathbf{x}) + \frac{\Delta t^2}{24 m} \left( 2 \nabla^2 V(\mathbf{x}) \cdot \frac{\|\mathbf{p}\|^2}{m} - \|\nabla V(\mathbf{x})\|^2 \right) + O(\Delta t^4)$$

For a 1D harmonic oscillator ($V = \frac{1}{2} k x^2, \omega^2 = k/m$):

$$\tilde{\mathcal{H}} = \frac{1}{2} m v^2 + \frac{1}{2} k x^2 + \frac{1}{24} \omega^2 \Delta t^2 \left( 2 m v^2 - k x^2 \right) + O(\Delta t^4)$$

$$\mathbf{\tilde{\mathcal{H}} = \frac{1}{2} m v^2 \left( 1 + \frac{1}{12}\omega^2 \Delta t^2 \right) + \frac{1}{2} k x^2 \left( 1 - \frac{1}{24}\omega^2 \Delta t^2 \right) + O(\Delta t^4)}$$

Look at the extraordinary symmetry:
- There is **no cross-term $x v$**! (In Semi-Implicit Euler, the error had a cross-term $\frac{1}{2}\omega^2 \Delta t x v$, which tilted the ellipse).
- In Velocity Verlet, the phase-space ellipse is **perfectly axis-aligned**!
- The semi-major and semi-minor axes are merely scaled by $1 \pm O(\Delta t^2)$.
- The energy error is **strictly second-order $O(\Delta t^2)$** and oscillates with zero secular drift.

---

### 8.7 Ten In-Depth Progressive Worked Examples

#### Example 8.1: Single Velocity Verlet Step on a Gravitational Projectile
*Scenario:* A projectile of mass $m = 1.0\text{ kg}$ is launched vertically from $y_0 = 0.0\text{ m}$ with initial velocity $v_0 = 50.0\text{ m/s}$. Gravity is constant: $a = -9.8\text{ m/s}^2$.
Using Velocity Verlet with $\Delta t = 1.0\text{ s}$, calculate the position $y_1$ and velocity $v_1$. Compare with the exact analytical physics.

*Step 1: First half-step velocity:*
$$v_{1/2} = v_0 + \frac{1}{2} a_0 \Delta t = 50.0 + \frac{1}{2}(-9.8)(1.0) = 50.0 - 4.9 = 45.1\text{ m/s}$$

*Step 2: Full-step position update:*
$$y_1 = y_0 + v_{1/2} \Delta t = 0.0 + (45.1)(1.0) = 45.1\text{ m}$$

*Step 3: Evaluate new acceleration:*
Since gravity is uniform: $a_1 = -9.8\text{ m/s}^2$.

*Step 4: Second half-step velocity:*
$$v_1 = v_{1/2} + \frac{1}{2} a_1 \Delta t = 45.1 + \frac{1}{2}(-9.8)(1.0) = 45.1 - 4.9 = 40.2\text{ m/s}$$

*Step 5: Exact analytical comparison:*
$$y_{\text{exact}}(1.0) = v_0 t - \frac{1}{2} g t^2 = 50.0(1.0) - 4.9(1.0)^2 = 45.1\text{ m}$$
$$v_{\text{exact}}(1.0) = v_0 - g t = 50.0 - 9.8(1.0) = 40.2\text{ m/s}$$
Both position and velocity match the exact continuous physics **with 100% bit-exact precision**!

---

#### Example 8.2: Velocity Verlet on a Harmonic Oscillator
*Scenario:* An oscillator has $m = 1.0\text{ kg}, k = 100.0\text{ N/m}$ ($\omega = 10.0\text{ rad/s}$).
At $t = 0$, $x_0 = 1.0\text{ m}, v_0 = 0.0\text{ m/s}$, initial energy $E_0 = 50.0\text{ J}$.
Execute one step of Velocity Verlet with $\Delta t = 0.05\text{ s}$.

*Step 1: Compute initial acceleration:*
$$a_0 = -\omega^2 x_0 = -(100.0)(1.0) = -100.0\text{ m/s}^2$$

*Step 2: First half-kick:*
$$v_{1/2} = v_0 + \frac{1}{2} a_0 \Delta t = 0.0 + \frac{1}{2}(-100.0)(0.05) = -2.5000\text{ m/s}$$

*Step 3: Full-drift position:*
$$x_1 = x_0 + v_{1/2} \Delta t = 1.0 + (-2.5000)(0.05) = 1.0 - 0.1250 = 0.8750\text{ m}$$

*Step 4: Evaluate new acceleration:*
$$a_1 = -\omega^2 x_1 = -(100.0)(0.8750) = -87.5000\text{ m/s}^2$$

*Step 5: Second half-kick:*
$$v_1 = v_{1/2} + \frac{1}{2} a_1 \Delta t = -2.5000 + \frac{1}{2}(-87.5000)(0.05) = -2.5000 - 2.1875 = -4.6875\text{ m/s}$$

*Step 6: Compute physical mechanical energy:*
$$E_1 = \frac{1}{2} k x_1^2 + \frac{1}{2} m v_1^2 = \frac{1}{2}(100)(0.875)^2 + \frac{1}{2}(1)(-4.6875)^2$$
$$E_1 = 50(0.765625) + 0.5(21.972656) = 38.28125 + 10.986328 = 49.26758\text{ J}$$
Error: $|50.0 - 49.26758| = 0.7324\text{ J}$ (only $1.46\%$ fluctuation, compared to $25\%$ for Forward Euler).

---

#### Example 8.3: State Transition Matrix for Velocity Verlet
*Scenario:* Express the complete Velocity Verlet update for $\ddot{x} = -\omega^2 x$ as a single $2 \times 2$ matrix $\mathbf{A}_{\text{VV}}$ operating on $\begin{bmatrix} x_n \\ v_n \end{bmatrix}$. Prove that $\det(\mathbf{A}_{\text{VV}}) \equiv 1.0$.

*Step 1: Express $x_{n+1}$ in terms of $x_n$ and $v_n$:*
$$x_{n+1} = x_n + v_n \Delta t + \frac{1}{2} a_n \Delta t^2 = x_n + v_n \Delta t - \frac{1}{2}\omega^2 \Delta t^2 x_n = \left(1 - \frac{1}{2}\omega^2 \Delta t^2\right) x_n + \Delta t v_n$$

*Step 2: Express $v_{n+1}$ in terms of $x_n$ and $v_n$:*
$$v_{n+1} = v_n + \frac{1}{2} a_n \Delta t + \frac{1}{2} a_{n+1} \Delta t = v_n - \frac{1}{2}\omega^2 \Delta t x_n - \frac{1}{2}\omega^2 \Delta t x_{n+1}$$
Substitute $x_{n+1}$ from Step 1:
$$v_{n+1} = v_n - \frac{1}{2}\omega^2 \Delta t x_n - \frac{1}{2}\omega^2 \Delta t \left[ \left(1 - \frac{1}{2}\omega^2 \Delta t^2\right) x_n + \Delta t v_n \right]$$
$$v_{n+1} = -\omega^2 \Delta t \left( 1 - \frac{1}{4}\omega^2 \Delta t^2 \right) x_n + \left( 1 - \frac{1}{2}\omega^2 \Delta t^2 \right) v_n$$

*Step 3: Construct the transition matrix:*
$$\mathbf{A}_{\text{VV}} = \begin{bmatrix} 1 - \frac{1}{2}\omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t \left(1 - \frac{1}{4}\omega^2 \Delta t^2\right) & 1 - \frac{1}{2}\omega^2 \Delta t^2 \end{bmatrix}$$

*Step 4: Compute determinant:*
Let $\mu = \frac{1}{2}\omega^2 \Delta t^2$. Then $\mathbf{A}_{\text{VV}} = \begin{bmatrix} 1 - \mu & \Delta t \\ -\omega^2 \Delta t (1 - \frac{1}{2}\mu) & 1 - \mu \end{bmatrix}$.
$$\det(\mathbf{A}_{\text{VV}}) = (1 - \mu)^2 - (\Delta t)\left(-\omega^2 \Delta t \left(1 - \frac{1}{2}\mu\right)\right) = (1 - 2\mu + \mu^2) + \omega^2 \Delta t^2 \left(1 - \frac{1}{2}\mu\right)$$
Substitute $\omega^2 \Delta t^2 = 2\mu$:
$$\det(\mathbf{A}_{\text{VV}}) = 1 - 2\mu + \mu^2 + 2\mu(1 - \frac{1}{2}\mu) = 1 - 2\mu + \mu^2 + 2\mu - \mu^2 \equiv \mathbf{1.000000}$$
$\blacksquare$ The determinant is identically 1.0 for all $\omega$ and $\Delta t$.

---

#### Example 8.4: Proving Strang Splitting Error Cancellation
*Scenario:* Use the Baker-Campbell-Hausdorff (BCH) formula to prove that symmetric splitting $e^{\frac{h}{2}A} e^{h B} e^{\frac{h}{2}A}$ eliminates the $O(h^2)$ commutator term.

*Step 1: State the BCH formula:*
For any two operators $X$ and $Y$:
$$\ln(e^X e^Y) = X + Y + \frac{1}{2}[X, Y] + \frac{1}{12}[X, [X, Y]] - \frac{1}{12}[Y, [X, Y]] + O(\text{higher})$$

*Step 2: First product $e^{\frac{h}{2}A} e^{h B}$:*
Let $X = \frac{h}{2}A$ and $Y = h B$:
$$\ln(e^{\frac{h}{2}A} e^{h B}) = \frac{h}{2}A + h B + \frac{h^2}{4}[A, B] + O(h^3) \equiv Z$$

*Step 3: Second product $e^Z e^{\frac{h}{2}A}$:*
Now multiply by $e^{\frac{h}{2}A}$:
$$\ln(e^Z e^{\frac{h}{2}A}) = Z + \frac{h}{2}A + \frac{1}{2}\left[Z, \frac{h}{2}A\right] + O(h^3)$$
Substitute $Z = \frac{h}{2}A + h B + \frac{h^2}{4}[A, B]$:
$$= \left(\frac{h}{2}A + h B + \frac{h^2}{4}[A, B]\right) + \frac{h}{2}A + \frac{1}{2}\left[ \frac{h}{2}A + h B, \frac{h}{2}A \right] + O(h^3)$$
$$= h(A + B) + \frac{h^2}{4}[A, B] + \frac{h^2}{4}[B, A] + O(h^3)$$
Because the Lie bracket is antisymmetric: $[B, A] = -[A, B]$:
$$\frac{h^2}{4}[A, B] + \frac{h^2}{4}(-[A, B]) = \mathbf{0}$$

*Conclusion:*
$$\ln(e^{\frac{h}{2}A} e^{h B} e^{\frac{h}{2}A}) = h(A + B) + O(h^3)$$
The $h^2$ error term vanishes identically! The integrator is rigorously second-order accurate.
$\blacksquare$

---

#### Example 8.5: Converting Leapfrog Coordinates to Velocity Verlet
*Scenario:* A cosmological dark matter simulator stores particle coordinates in Leapfrog format:
$x_n = 450.0\text{ kpc}$ at $t = 10.0\text{ Gyr}$.
$v_{n-1/2} = 220.0\text{ km/s}$ at $t = 9.95\text{ Gyr}$.
Timestep $\Delta t = 0.1\text{ Gyr}$. Gravitational acceleration $a_n = -15.0\text{ km/s}\cdot\text{Gyr}^{-1}$.
Convert this state into synchronous Velocity Verlet coordinates $(x_n, v_n)$ at $t = 10.0\text{ Gyr}$.

*Step 1: Leapfrog velocity update to half-step ahead:*
$$v_{n+1/2} = v_{n-1/2} + a_n \Delta t = 220.0 + (-15.0)(0.1) = 220.0 - 1.5 = 218.5\text{ km/s}$$

*Step 2: Synchronize velocity at integer tick $n$:*
The synchronized velocity $v_n$ is the average of the two surrounding half-steps:
$$v_n = \frac{v_{n-1/2} + v_{n+1/2}}{2} = \frac{220.0 + 218.5}{2} = 219.25\text{ km/s}$$
Or equivalently, using the first half-kick from $v_{n-1/2}$:
$$v_n = v_{n-1/2} + \frac{1}{2} a_n \Delta t = 220.0 + \frac{1}{2}(-15.0)(0.1) = 220.0 - 0.75 = 219.25\text{ km/s}$$

*Synchronized State:* At $t = 10.0\text{ Gyr}$, position is $450.0\text{ kpc}$ and velocity is $219.25\text{ km/s}$.

---

#### Example 8.6: Velocity Verlet with Linear Air Resistance
*Scenario:* A projectile experiences gravity and linear viscous drag:
$$\mathbf{a}(\mathbf{v}) = \mathbf{g} - \gamma \mathbf{v}$$
where $\mathbf{g} = \begin{bmatrix} 0 \\ -9.8 \end{bmatrix}\text{ m/s}^2$ and $\gamma = 0.2\text{ s}^{-1}$.
Because acceleration depends on velocity, the second half-kick requires solving for $\mathbf{v}_{n+1}$.
Derive the explicit algebraic solution for the second half-kick.

*Step 1: Write the second half-kick equation:*
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \mathbf{a}_{n+1} \Delta t$$
Substitute $\mathbf{a}_{n+1} = \mathbf{g} - \gamma \mathbf{v}_{n+1}$:
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} (\mathbf{g} - \gamma \mathbf{v}_{n+1}) \Delta t = \mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t - \frac{1}{2}\gamma \Delta t \mathbf{v}_{n+1}$$

*Step 2: Group $\mathbf{v}_{n+1}$ terms on the left:*
$$\left(1 + \frac{1}{2}\gamma \Delta t\right) \mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t$$

*Step 3: Solve explicitly:*
$$\mathbf{v}_{n+1} = \frac{\mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t}{1 + \frac{1}{2}\gamma \Delta t}$$

*Significance:* By isolating $\mathbf{v}_{n+1}$ algebraically, Velocity Verlet handles linear viscous drag with zero numerical iterations and zero matrix solves!

---

#### Example 8.7: Demonstrating the $\omega \Delta t < 2.0$ Stability Limit
*Scenario:* An engine tests Velocity Verlet on an oscillator with $\omega = 10.0\text{ rad/s}$ using $\Delta t = 0.25\text{ s}$ ($\omega \Delta t = 2.5 > 2.0$).
Calculate the trace of the transition matrix $\mathbf{A}_{\text{VV}}$ and show that the eigenvalues are real with $|\lambda_1| > 1.0$.

*Step 1: Compute $\mu = \frac{1}{2}\omega^2 \Delta t^2$:*
$$\omega \Delta t = 2.5 \implies \omega^2 \Delta t^2 = 6.25$$
$$\mu = \frac{1}{2}(6.25) = 3.125$$

*Step 2: Transition matrix elements:*
From Example 8.3, the diagonal elements are $1 - \mu = 1 - 3.125 = -2.125$.
$$\text{Tr}(\mathbf{A}_{\text{VV}}) = 2(1 - \mu) = 2(-2.125) = -4.250$$

*Step 3: Characteristic equation:*
$$\lambda^2 - \text{Tr}(\mathbf{A})\lambda + \det(\mathbf{A}) = 0 \implies \lambda^2 - (-4.25)\lambda + 1 = 0 \implies \lambda^2 + 4.25\lambda + 1 = 0$$
Roots:
$$\lambda = \frac{-4.25 \pm \sqrt{(4.25)^2 - 4}}{2} = \frac{-4.25 \pm \sqrt{18.0625 - 4}}{2} = \frac{-4.25 \pm \sqrt{14.0625}}{2} = \frac{-4.25 \pm 3.75}{2}$$
$$\lambda_1 = \frac{-4.25 - 3.75}{2} = \frac{-8.00}{2} = \mathbf{-4.000}$$
$$\lambda_2 = \frac{-4.25 + 3.75}{2} = \frac{-0.50}{2} = \mathbf{-0.250}$$

*Explosion Rate:* On every single step, the state vector is multiplied by **$-4.00$**!
In 10 steps, the error amplifies by $(-4)^{10} = 1,048,576\times$.
Like Semi-Implicit Euler, Velocity Verlet's stability boundary is strictly $\omega \Delta t < 2.0$.

---

#### Example 8.8: Long-Term Orbit: Velocity Verlet vs. Runge-Kutta 4 (RK4)
*Scenario:* A satellite in orbit has energy $E_0 = -1.0 \times 10^8\text{ J}$.
- Under Velocity Verlet, energy fluctuates with amplitude $\Delta E = 500\text{ J}$ around $E_0$, with zero secular drift.
- Under Classical RK4, energy decays monotonically at a rate of $\frac{\Delta E}{E_0} = -1.0 \times 10^{-7}$ per orbit.
Compare the energy error after $N = 100,000$ orbits.

*Step 1: Velocity Verlet after 100,000 orbits:*
Because Velocity Verlet is symplectic, energy does not drift:
$$|E_{\text{VV}}(100,000) - E_0| \le 500.0\text{ J}$$
Relative error = $\frac{500}{10^8} = 5.0 \times 10^{-6} = 0.0005\%$.

*Step 2: Classical RK4 after 100,000 orbits:*
Energy after $N$ orbits:
$$E_{\text{RK4}}(N) = E_0 (1 - 10^{-7})^{100,000} \approx E_0 e^{-10^{-7} \times 100,000} = E_0 e^{-0.01} \approx 0.99005 E_0$$
Energy lost:
$$\Delta E_{\text{lost}} = |0.99005 E_0 - E_0| = 0.00995 |E_0| = 995,000\text{ J}$$

*Comparison:*
- Velocity Verlet error: $500\text{ J}$.
- RK4 error: $995,000\text{ J}$ (nearly **2,000 times worse!**).
Despite RK4 having 4th-order local accuracy, its non-symplectic dissipation renders it catastrophic for long-term orbital mechanics.

---

#### Example 8.9: Restitution Impulse Injection in Velocity Verlet
*Scenario:* A particle of mass $m = 2.0\text{ kg}$ is integrated via Velocity Verlet.
At tick $n$, position $x_n = 0.05\text{ m}$, velocity $v_n = -10.0\text{ m/s}$.
During Step 2 (drift), it impacts a rigid floor at $x = 0$.
The collision solver detects impact and applies an instantaneous elastic restitution impulse $J = +36.0\text{ N}\cdot\text{s}$ ($e = 0.8$).
Demonstrate how the impulse is injected directly into the velocity variable without breaking the Velocity Verlet pipeline.

*Step 1: Standard First Half-Kick:*
$v_{1/2} = v_n + \frac{1}{2} a_n \Delta t$.
Suppose $a_n = -9.8\text{ m/s}^2, \Delta t = 0.01\text{ s}$:
$$v_{1/2} = -10.0 + \frac{1}{2}(-9.8)(0.01) = -10.0 - 0.049 = -10.049\text{ m/s}$$

*Step 2: Position Drift & Collision Detection:*
$$x_{n+1} = x_n + v_{1/2} \Delta t = 0.05 + (-10.049)(0.01) = 0.05 - 0.10049 = -0.05049\text{ m}$$
Penetration detected! Floor is at $x = 0$.
Positional correction: clamp $x_{n+1} = 0.0\text{ m}$.

*Step 3: Impulse Injection into Velocity:*
The collision impulse $J = +36.0\text{ N}\cdot\text{s}$ updates velocity instantaneously:
$$\Delta v = \frac{J}{m} = \frac{+36.0\text{ N}\cdot\text{s}}{2.0\text{ kg}} = +18.0\text{ m/s}$$
Inject directly into the half-step velocity:
$$v_{1/2}^{\text{corrected}} = v_{1/2} + \Delta v = -10.049 + 18.0 = +7.951\text{ m/s}$$

*Step 4: Continue with Step 3 & 4:*
Evaluate new floor contact acceleration $a_{n+1} = -9.8\text{ m/s}^2$:
$$v_{n+1} = v_{1/2}^{\text{corrected}} + \frac{1}{2} a_{n+1} \Delta t = +7.951 + \frac{1}{2}(-9.8)(0.01) = 7.951 - 0.049 = +7.902\text{ m/s}$$
The particle rebounds cleanly upward!

---

#### Example 8.10: Complete TypeScript Implementation of Velocity Verlet
*Scenario:* Write a production-grade TypeScript class `VelocityVerletEngine` managing Structure-of-Arrays particle pools with exact Strang splitting.

```typescript
export class VelocityVerletEngine {
  public readonly count: number;
  public readonly posX: Float64Array;
  public readonly posY: Float64Array;
  public readonly velX: Float64Array;
  public readonly velY: Float64Array;
  public readonly accelX: Float64Array;
  public readonly accelY: Float64Array;
  public readonly invMass: Float64Array;

  constructor(capacity: number) {
    this.count = capacity;
    this.posX = new Float64Array(capacity);
    this.posY = new Float64Array(capacity);
    this.velX = new Float64Array(capacity);
    this.velY = new Float64Array(capacity);
    this.accelX = new Float64Array(capacity);
    this.accelY = new Float64Array(capacity);
    this.invMass = new Float64Array(capacity);
  }

  /**
   * Initializes initial accelerations before first step.
   */
  public initializeAccelerations(computeForces: () => void): void {
    computeForces();
  }

  /**
   * Advances the simulation by dt using Velocity Verlet (Strang Splitting).
   * Exactly ONE global force evaluation per call!
   */
  public step(dt: number, computeForces: () => void): void {
    const N = this.count;
    const dtHalf = 0.5 * dt;

    // --- PHASE 1: First Half-Kick & Full-Drift ---
    for (let i = 0; i < N; i++) {
      if (this.invMass[i] === 0.0) continue; // Static body

      // v_{n+1/2} = v_n + 0.5 * a_n * dt
      this.velX[i] += this.accelX[i] * dtHalf;
      this.velY[i] += this.accelY[i] * dtHalf;

      // x_{n+1} = x_n + v_{n+1/2} * dt
      this.posX[i] += this.velX[i] * dt;
      this.posY[i] += this.velY[i] * dt;
    }

    // --- PHASE 2: Single Global Force Evaluation at x_{n+1} ---
    computeForces(); // Updates accelX and accelY in-place

    // --- PHASE 3: Second Half-Kick ---
    for (let i = 0; i < N; i++) {
      if (this.invMass[i] === 0.0) continue;

      // v_{n+1} = v_{n+1/2} + 0.5 * a_{n+1} * dt
      this.velX[i] += this.accelX[i] * dtHalf;
      this.velY[i] += this.accelY[i] * dtHalf;
    }
  }
}
```

---

### 8.8 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 8.1 – 8.2)

##### Exercise 8.1
State the four canonical phases of the Velocity Verlet algorithm. How many global force evaluations per particle are required per time step?

##### Exercise 8.2
Explain why Velocity Verlet is described as a "Strang Splitting" method. What specific mathematical commutator cancellation allows Velocity Verlet to achieve second-order global accuracy ($O(\Delta t^2)$) while Semi-Implicit Euler is only first-order ($O(\Delta t)$)?

---

#### Tier 2: Mathematical Formulations & Leapfrog (Exercises 8.3 – 8.4)

##### Exercise 8.3
Prove that substituting Step 1 ($\mathbf{v}_{n+1/2} = \mathbf{v}_n + \frac{1}{2}\mathbf{a}_n \Delta t$) into Step 2 ($\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1/2}\Delta t$) identically reproduces the classical Galilean kinematic displacement equation $\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t + \frac{1}{2}\mathbf{a}_n \Delta t^2$.

##### Exercise 8.4
Explain the relationship between Leapfrog integration and Velocity Verlet. Why is Velocity Verlet preferred over standard Leapfrog in interactive physics engines that must report kinetic energy and velocity to the user on every frame?

---

#### Tier 3: Stability Limits & Eigenvalue Analysis (Exercises 8.5 – 8.6)

##### Exercise 8.5
Derive the characteristic polynomial of the Velocity Verlet state transition matrix $\mathbf{A}_{\text{VV}}$ derived in Example 8.3. Prove that its stability condition is $\omega \Delta t < 2.0$.

##### Exercise 8.6
A molecular dynamics simulator models covalent carbon bonds with frequency $\omega = 2.5 \times 10^{14}\text{ rad/s}$.
1. What is the theoretical maximum stable timestep $\Delta t_{\text{max}}$ for Velocity Verlet?
2. If molecular dynamicists standardly choose $\Delta t = 1.0\text{ femtosecond}$ ($10^{-15}\text{ s}$), calculate the ratio $\frac{\Delta t}{\Delta t_{\text{max}}}$.

---

#### Tier 4: Dissipative Forces & Drag Extensions (Exercises 8.7 – 8.8)

##### Exercise 8.7
A baseball experiences linear aerodynamic drag $\mathbf{a}_{\text{drag}} = -\gamma \mathbf{v}$.
Derive the exact, closed-form algebraic formula for the second half-kick $\mathbf{v}_{n+1}$ in terms of $\mathbf{v}_{n+1/2}$, $\mathbf{g}$, $\gamma$, and $\Delta t$.

##### Exercise 8.8
Explain why Velocity Verlet cannot handle non-linear quadratic air drag ($\mathbf{F} \propto -\|\mathbf{v}\|\mathbf{v}$) in a single closed-form step. Design a predictor-corrector half-step scheme that approximates the second half-kick for quadratic drag with second-order accuracy.

---

#### Tier 5: Symplectic Invariants & Shadow Energy (Exercises 8.9 – 8.10)

##### Exercise 8.9
For a 1D harmonic oscillator, prove that the Shadow Hamiltonian of Velocity Verlet is:
$$\tilde{\mathcal{H}} = \frac{1}{2} m v^2 \left( 1 + \frac{1}{12}\omega^2 \Delta t^2 \right) + \frac{1}{2} k x^2 \left( 1 - \frac{1}{24}\omega^2 \Delta t^2 \right)$$
Explain why the absence of an $x v$ cross-term proves that Velocity Verlet's phase-space trajectory is an axis-aligned ellipse rather than a tilted ellipse.

##### Exercise 8.10
In a solar system simulation containing Jupiter, Earth, and the Sun, explain why Velocity Verlet preserves Kepler's Third Law ($T^2 \propto a^3$) and orbital eccentricity over millions of orbits, whereas a 4th-order non-symplectic Runge-Kutta solver causes Earth to spiral into the Sun.

---

### 8.9 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 8.1
*The Four Canonical Phases:*
1. **First Half-Kick:** $\mathbf{v}_{n+1/2} = \mathbf{v}_n + \frac{1}{2} \mathbf{a}(\mathbf{x}_n) \Delta t$ (Velocity advanced to midpoint using current force).
2. **Full-Drift:** $\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1/2} \Delta t$ (Position advanced across full step using midpoint velocity).
3. **Global Force Evaluation:** $\mathbf{a}_{n+1} = \frac{1}{m} \mathbf{F}(\mathbf{x}_{n+1})$ (Evaluate new accelerations at destination coordinates).
4. **Second Half-Kick:** $\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \mathbf{a}_{n+1} \Delta t$ (Velocity advanced from midpoint to full step using new force).

*Force Evaluations:*
Exactly **ONE** global force evaluation per particle per time step. The second half-kick of step $n$ and the first half-kick of step $n+1$ share the same evaluated acceleration $\mathbf{a}_{n+1}$, which is cached in memory.

---

#### Solution to Exercise 8.2
*Strang Splitting Formulation:*
Velocity Verlet is derived from the symmetric Strang splitting of the time-evolution operator:
$$e^{\Delta t (\mathcal{A} + \mathcal{B})} \approx e^{\frac{\Delta t}{2}\mathcal{A}} \cdot e^{\Delta t \mathcal{B}} \cdot e^{\frac{\Delta t}{2}\mathcal{A}}$$
Where $\mathcal{A}$ is the momentum kick operator and $\mathcal{B}$ is the position drift operator.

*Commutator Cancellation:*
By the Baker-Campbell-Hausdorff (BCH) formula:
- Asymmetric splitting (Semi-Implicit Euler: $e^{\Delta t \mathcal{B}} e^{\Delta t \mathcal{A}}$) leaves an uncancelled first-order commutator error term: $\frac{\Delta t^2}{2}[\mathcal{B}, \mathcal{A}]$, which produces an $O(\Delta t)$ global error.
- Symmetric splitting (Strang sandwich) causes the commutator terms $\frac{\Delta t^2}{4}[\mathcal{A}, \mathcal{B}]$ and $\frac{\Delta t^2}{4}[\mathcal{B}, \mathcal{A}] = -\frac{\Delta t^2}{4}[\mathcal{A}, \mathcal{B}]$ to cancel identically to zero.
Because all even powers in the exponent cancel by symmetry, the leading local error is $O(\Delta t^3)$, elevating the **global truncation error to second order: $O(\Delta t^2)$**.

---

#### Solution to Exercise 8.3
*Proof of Galilean Equivalence:*
Given Step 1:
$$\mathbf{v}_{n+1/2} = \mathbf{v}_n + \frac{1}{2}\mathbf{a}_n \Delta t$$
Given Step 2:
$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1/2} \Delta t$$
Substitute Step 1 into Step 2:
$$\mathbf{x}_{n+1} = \mathbf{x}_n + \left( \mathbf{v}_n + \frac{1}{2}\mathbf{a}_n \Delta t \right) \Delta t = \mathbf{x}_n + \mathbf{v}_n \Delta t + \frac{1}{2}\mathbf{a}_n \Delta t^2$$
$\blacksquare$ The displacement update of Velocity Verlet is mathematically identical to the exact kinematic solution for uniform acceleration.

---

#### Solution to Exercise 8.4
*Relationship to Leapfrog:*
Velocity Verlet and Leapfrog integration trace the exact same discrete trajectory in phase space.
In Leapfrog:
- Positions are recorded at integer ticks: $t_n, t_{n+1}, \dots$
- Velocities are recorded at half-integer ticks: $t_{n-1/2}, t_{n+1/2}, \dots$

*Why Velocity Verlet is Preferred:*
In interactive physics engines:
1. **Synchronous Telemetry:** Game logic, UI renderers, and collision systems require knowing position $\mathbf{x}_n$ and velocity $\mathbf{v}_n$ simultaneously at the same clock tick $t_n$. In Leapfrog, calculating current kinetic energy $T = \frac{1}{2}m v_n^2$ requires an extra interpolation step.
2. **Impulse Collisions:** When a rigid body hits a wall, collision resolution must adjust velocity instantaneously ($\mathbf{v}^+ = -e \mathbf{v}^-$). In Leapfrog, adjusting a half-step velocity $\mathbf{v}_{n+1/2}$ distorts subsequent position updates. Velocity Verlet updates full-step velocities cleanly, allowing immediate impulse application.

---

#### Solution to Exercise 8.5
*Characteristic Polynomial Derivation:*
From Example 8.3, the state transition matrix is:
$$\mathbf{A}_{\text{VV}} = \begin{bmatrix} 1 - \frac{1}{2}\omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t \left(1 - \frac{1}{4}\omega^2 \Delta t^2\right) & 1 - \frac{1}{2}\omega^2 \Delta t^2 \end{bmatrix}$$
Let $\mu = \frac{1}{2}\omega^2 \Delta t^2$. The diagonal elements are $1 - \mu$.
$$\text{Tr}(\mathbf{A}_{\text{VV}}) = 2(1 - \mu) = 2 - \omega^2 \Delta t^2$$
Since $\det(\mathbf{A}_{\text{VV}}) \equiv 1.0$, the characteristic polynomial is:
$$\lambda^2 - \text{Tr}(\mathbf{A})\lambda + \det(\mathbf{A}) = 0 \implies \mathbf{\lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + 1 = 0}$$
Notice that this characteristic equation is **identical to that of Semi-Implicit Euler**!
The discriminant is:
$$\Delta_{\text{disc}} = (2 - \omega^2 \Delta t^2)^2 - 4 = -\omega^2 \Delta t^2 (4 - \omega^2 \Delta t^2)$$
For eigenvalues to be complex conjugates on the unit circle ($|\lambda| \equiv 1.0$), we require $\Delta_{\text{disc}} < 0$:
$$4 - \omega^2 \Delta t^2 > 0 \implies \omega^2 \Delta t^2 < 4 \implies \mathbf{\omega \Delta t < 2.0}$$
$\blacksquare$ The stability boundary is strictly $\omega \Delta t < 2.0$.

---

#### Solution to Exercise 8.6
Given: $\omega = 2.5 \times 10^{14}\text{ rad/s}$.

*Part 1: Maximum stable timestep:*
$$\Delta t_{\text{max}} = \frac{2}{\omega} = \frac{2}{2.5 \times 10^{14}\text{ s}^{-1}} = 8.0 \times 10^{-15}\text{ seconds} = 8.0\text{ femtoseconds}$$

*Part 2: Ratio for $\Delta t = 1.0\text{ fs}$:*
$$\frac{\Delta t}{\Delta t_{\text{max}}} = \frac{1.0\text{ fs}}{8.0\text{ fs}} = 0.125 = \frac{1}{8}$$
Choosing $\Delta t = 1.0\text{ fs}$ operates at exactly $\frac{1}{8}$ of the stability limit ($\omega \Delta t = 0.25 < 2.0$), providing exceptional accuracy and stability for molecular dynamics simulations.

---

#### Solution to Exercise 8.7
*Linear Drag Derivation for Second Half-Kick:*
Given: $\mathbf{a}(\mathbf{x}, \mathbf{v}) = \mathbf{g} - \gamma \mathbf{v}$.
Second half-kick equation:
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \mathbf{a}_{n+1} \Delta t = \mathbf{v}_{n+1/2} + \frac{1}{2} (\mathbf{g} - \gamma \mathbf{v}_{n+1}) \Delta t$$
Distribute terms:
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \mathbf{g} \Delta t - \frac{1}{2} \gamma \Delta t \mathbf{v}_{n+1}$$
Collect $\mathbf{v}_{n+1}$ on the left-hand side:
$$\mathbf{v}_{n+1} + \frac{1}{2}\gamma \Delta t \mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t$$
$$\left(1 + \frac{1}{2}\gamma \Delta t\right) \mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t$$
Divide by $\left(1 + \frac{1}{2}\gamma \Delta t\right)$:
$$\mathbf{v}_{n+1} = \frac{\mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t}{1 + \frac{1}{2}\gamma \Delta t}$$
$\blacksquare$ Exact explicit solution requiring zero matrix inversions.

---

#### Solution to Exercise 8.8
*Quadratic Drag Implicit Dilemma:*
For quadratic drag $\mathbf{a}_{\text{drag}} = -k \|\mathbf{v}\|\mathbf{v}$, the second half-kick equation is:
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} (\mathbf{g} - k \|\mathbf{v}_{n+1}\|\mathbf{v}_{n+1}) \Delta t$$
The term $\|\mathbf{v}_{n+1}\|\mathbf{v}_{n+1} = \sqrt{v_x^2 + v_y^2 + v_z^2}\begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$ is non-linear and couples all coordinate axes, preventing simple division.

*Predictor-Corrector Solution:*
1. **Predict:** Use the half-step velocity $\mathbf{v}_{n+1/2}$ to approximate the future speed:
   $$s_{\text{pred}} = \|\mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t\|$$
2. **Linearize:** Treat $k s_{\text{pred}}$ as an effective linear drag coefficient: $\gamma_{\text{eff}} = k s_{\text{pred}}$.
3. **Correct:** Apply the linear formula from Exercise 8.7:
   $$\mathbf{v}_{n+1} = \frac{\mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{g}\Delta t}{1 + \frac{1}{2} \gamma_{\text{eff}} \Delta t}$$
This predictor-corrector update is explicit, second-order accurate ($O(\Delta t^2)$), and computationally instantaneous.

---

#### Solution to Exercise 8.9
*Proof of Axis-Aligned Shadow Ellipse:*
From Section 8.6, the Shadow Hamiltonian of Velocity Verlet for $V(x) = \frac{1}{2} k x^2$ is:
$$\tilde{\mathcal{H}} = \frac{1}{2} m v^2 \left( 1 + \frac{1}{12}\omega^2 \Delta t^2 \right) + \frac{1}{2} k x^2 \left( 1 - \frac{1}{24}\omega^2 \Delta t^2 \right)$$
In the $(x, v)$ phase space, this is a quadratic equation:
$$A x^2 + B x v + C v^2 = E_0$$
Where:
$$A = \frac{1}{2} k \left(1 - \frac{1}{24}\omega^2 \Delta t^2\right), \quad B \equiv 0, \quad C = \frac{1}{2} m \left(1 + \frac{1}{12}\omega^2 \Delta t^2\right)$$
Because the cross-term coefficient $B \equiv 0$:
- The ellipse has **zero tilt angle** ($\theta_{\text{tilt}} = 0^\circ$).
- The principal axes of the shadow ellipse lie **strictly along the coordinate axes $x$ and $v$**!
- Unlike Semi-Implicit Euler (which rotated the ellipse by $\approx -\frac{1}{2}\omega \Delta t$), Velocity Verlet preserves the orthogonal symmetry of kinetic and potential energy.
$\blacksquare$

---

#### Solution to Exercise 8.10
*Why Velocity Verlet Outperforms RK4 Over Planetary Lifetimes:*
1. **The Kepler Invariants:** In continuous two-body mechanics, orbits are characterized by semi-major axis $a$, eccentricity $e$, and energy $E = -G M m / (2a)$.
2. **Failure of Classical RK4:**
   - Classical RK4 is a non-symplectic polynomial truncation.
   - Its amplification factor on imaginary eigenvalues is $|R(i \omega \Delta t)| = \sqrt{1 - \frac{(\omega \Delta t)^6}{72} + \dots} < 1.0$.
   - On every orbit, RK4 dissipates a tiny sliver of mechanical energy.
   - Over millions of orbits, this artificial dissipation accumulates monotonically: energy decays from $-E_0 \to -\infty$.
   - The semi-major axis shrinks ($a \to 0$), causing the simulated Earth to spiral into the Sun.
3. **Triumph of Velocity Verlet:**
   - Velocity Verlet is an exact symplectic mapping ($\mathbf{M}^T \mathbf{J} \mathbf{M} \equiv \mathbf{J}$).
   - By Backward Error Analysis, it conserves an exact Shadow Hamiltonian $\tilde{\mathcal{H}} = \mathcal{H} + O(\Delta t^2)$ identically for all eternity.
   - The semi-major axis and orbital eccentricity are confined to a bounded invariant torus in phase space.
   - Even after 10 billion years of simulation, Earth's orbital radius will remain at $1.0\text{ AU}$, perfectly preserving Kepler's laws.
