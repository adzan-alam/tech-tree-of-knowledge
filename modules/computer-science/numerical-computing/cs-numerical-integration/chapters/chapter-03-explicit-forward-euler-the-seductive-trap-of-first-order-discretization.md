# Chapter 03: Explicit (Forward) Euler — The Seductive Trap of First-Order Discretization

> *"Explicit Euler is the siren song of game physics. It is the first algorithm every programmer writes, because it maps directly onto our naive grade-school intuition: new position equals old position plus velocity times time. Yet beneath its elementary elegance lurks a mathematical poison: Forward Euler is an artificial perpetual motion machine that unconditionally pumps spurious mechanical energy into every closed physical system until the world tears itself apart."*

---

### 3.1 The Historical Genesis of Explicit Euler

In 1768, the Swiss mathematical titan Leonhard Euler published his monumental treatise *Institutiones Calculi Integralis*. In Chapter 7, Euler addressed the problem of calculating curves where analytical anti-derivatives were unknown. He proposed the simplest possible polygonal approximation: replace the smooth continuous tangent $\frac{dy}{dt}$ across an entire interval $[t_n, t_{n+1}]$ with its initial value at the starting point $t_n$.

In the language of differential equations, given the Initial Value Problem:

$$\dot{\mathbf{y}}(t) = \mathbf{f}(\mathbf{y}(t), t), \qquad \mathbf{y}(t_0) = \mathbf{y}_0$$

Euler approximated the continuous derivative by the forward finite difference:

$$\frac{\mathbf{y}(t_{n+1}) - \mathbf{y}(t_n)}{\Delta t} \approx \dot{\mathbf{y}}(t_n) = \mathbf{f}(\mathbf{y}(t_n), t_n)$$

Multiplying by $\Delta t$ yields the classical **Explicit Forward Euler Algorithm**:

$$\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \cdot \mathbf{f}(\mathbf{y}_n, t_n)$$

```
y
^                                                      True Curve y(t)
|                                                        . - ~ ~ ~
|                                                    . '  /
|                                                . '     /
|                                            . '        /  Truncation Error
|                         Tangent Line   . '           /   d_{n+1} ~ O(dt^2)
|                           _ - - - - * <-------------+-- Forward Euler
|                       _ -         . '               |   y_{n+1}
|                   _ -         . '                   |
|               _ -         . '                       |
|           _ -         . '                           |
|       * - - - - - . '                               |
|      y_n                                            |
|       |                                             |
+-------+---------------------------------------------+------------> t
       t_n                                           t_{n+1}
        |<------------------- dt -------------------->|
```

#### The Algorithmic Formulation in Newtonian Mechanics
In game development, introductory computer science courses, and novice physics engines, Newton's Second Law ($\ddot{\mathbf{x}} = \frac{\mathbf{F}}{m}$) is implemented via Forward Euler as two sequential scalar or vector updates:

```typescript
// ARCHITECTURAL FLAW: Explicit Forward Euler
function stepForwardEuler(dt: number): void {
  for (let i = 0; i < particleCount; i++) {
    // 1. Position updated using OLD velocity v_n
    x[i] = x[i] + v[i] * dt;
    
    // 2. Velocity updated using OLD acceleration a(x_n)
    v[i] = v[i] + (F[i] / m[i]) * dt;
  }
}
```

Notice the crucial structural feature:
- Positional displacement $\Delta \mathbf{x} = \mathbf{v}_n \Delta t$ depends **strictly on the velocity at the beginning of the step**.
- Velocity increment $\Delta \mathbf{v} = \mathbf{a}_n \Delta t$ depends **strictly on the force evaluated at the initial position $\mathbf{x}_n$**.

This seems intuitive and innocent. Why, then, does every professional physics engine (Havok, PhysX, Box2D, Bullet) explicitly forbid Forward Euler?

---

### 3.2 The Simple Harmonic Oscillator Under Forward Euler

To uncover the fatal flaw of Forward Euler, we submit the algorithm to the ultimate litmus test of classical mechanics: the **Simple Harmonic Oscillator**.

A mass $m$ attached to an ideal spring with spring constant $k$ obeys Hooke's Law:

$$F(x) = -k x$$

From Newton's Second Law:

$$m \ddot{x} = -k x \implies \ddot{x} + \omega^2 x = 0, \qquad \text{where } \omega = \sqrt{\frac{k}{m}}$$

The exact continuous solution is well known:

$$x(t) = A \cos(\omega t + \phi), \qquad v(t) = -A \omega \sin(\omega t + \phi)$$

The total mechanical energy $E(t)$ is strictly conserved:

$$E(t) = \frac{1}{2} m v(t)^2 + \frac{1}{2} k x(t)^2 = \frac{1}{2} k A^2 = \text{constant}$$

In phase space $(x, v)$, the exact trajectory traces a **closed, invariant ellipse** that repeats indefinitely for eternity without expanding or shrinking.

```
Phase Space (x, v):
               v ^
                 |      _--~~~--_
                 |    /           \    Exact Orbit:
                 |   |      *      |   Closed Invariant Ellipse
                 |    \           /    (Energy Conserved)
                 |      ^--___--^
        ---------+-------------------------> x
                 |
```

#### The Discrete Forward Euler Transformation Matrix
Let us now apply Forward Euler to this oscillator. The continuous state-space system is:

$$\begin{cases}
\dot{x} = v \\
\dot{v} = -\omega^2 x
\end{cases}$$

Discretizing via Forward Euler:

$$\begin{cases}
x_{n+1} = x_n + v_n \Delta t \\
v_{n+1} = v_n - \omega^2 x_n \Delta t
\end{cases}$$

We express this discrete dynamical system in matrix-vector form:

$$\begin{bmatrix} x_{n+1} \\ v_{n+1} \end{bmatrix} = \mathbf{A}_{\text{Euler}} \begin{bmatrix} x_n \\ v_n \end{bmatrix}, \qquad \text{where } \mathbf{A}_{\text{Euler}} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

The matrix $\mathbf{A}_{\text{Euler}}$ is the **State Transition Matrix** of the integrator.

---

### 3.3 The Eigenvalue Analysis & Proof of Unconditional Energy Explosion

To determine how the discrete state vector evolves over $n$ steps:

$$\mathbf{y}_n = \mathbf{A}_{\text{Euler}}^n \mathbf{y}_0$$

we calculate the eigenvalues $\lambda$ of the matrix $\mathbf{A}_{\text{Euler}}$.

#### Step 1: Characteristic Equation
$$\det(\mathbf{A}_{\text{Euler}} - \lambda \mathbf{I}) = \det\begin{bmatrix} 1 - \lambda & \Delta t \\ -\omega^2 \Delta t & 1 - \lambda \end{bmatrix} = 0$$

$$(1 - \lambda)^2 - (\Delta t)(-\omega^2 \Delta t) = 0$$

$$(1 - \lambda)^2 + \omega^2 \Delta t^2 = 0$$

$$(1 - \lambda)^2 = -\omega^2 \Delta t^2$$

#### Step 2: Solve for Eigenvalues
Taking the complex square root of both sides:

$$1 - \lambda = \pm i \omega \Delta t \implies \lambda = 1 \pm i \omega \Delta t$$

The eigenvalues are a complex conjugate pair:

$$\lambda_1 = 1 + i \omega \Delta t, \qquad \lambda_2 = 1 - i \omega \Delta t$$

#### Step 3: Compute the Spectral Radius (Eigenvalue Magnitude)
The growth or decay of the discrete state vector is governed by the magnitude of the eigenvalues:

$$|\lambda| = \sqrt{\text{Re}(\lambda)^2 + \text{Im}(\lambda)^2} = \sqrt{1^2 + (\omega \Delta t)^2} = \sqrt{1 + \omega^2 \Delta t^2}$$

#### The Mathematical Proof of Destruction
Notice this profound mathematical fact:

$$\text{For any real physical system with } \omega > 0, \text{ and for any real non-zero timestep } \Delta t > 0:$$

$$\omega^2 \Delta t^2 > 0 \implies 1 + \omega^2 \Delta t^2 > 1 \implies \mathbf{|\lambda| = \sqrt{1 + \omega^2 \Delta t^2} > 1.0}$$

```
+-------------------------------------------------------------------------+
|                  THE UNCONDITIONAL INSTABILITY THEOREM                  |
+-------------------------------------------------------------------------+
|                                                                         |
|  Because |\lambda| is STRICTLY GREATER than 1.0 for all \Delta t > 0,   |
|  Explicit Forward Euler is UNCONDITIONALLY UNSTABLE for any             |
|  undamped oscillatory physical system!                                  |
|                                                                         |
|  There exists NO TIMESTEP \Delta t, no matter how microscopically       |
|  small, that can stabilize Forward Euler.                               |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 3.4 The Mechanics of Energy Inflation

What does $|\lambda| > 1$ mean for the physical energy of the simulated universe?

Let us calculate the total mechanical energy $E_{n+1}$ after one Forward Euler step:

$$E_{n+1} = \frac{1}{2} m v_{n+1}^2 + \frac{1}{2} k x_{n+1}^2$$

Substitute the Forward Euler equations:

$$x_{n+1} = x_n + v_n \Delta t$$

$$v_{n+1} = v_n - \omega^2 x_n \Delta t = v_n - \frac{k}{m} x_n \Delta t$$

Evaluate the kinetic energy term:

$$\frac{1}{2} m v_{n+1}^2 = \frac{1}{2} m \left( v_n - \frac{k}{m} x_n \Delta t \right)^2 = \frac{1}{2} m v_n^2 - k x_n v_n \Delta t + \frac{1}{2} \frac{k^2}{m} x_n^2 \Delta t^2$$

Evaluate the potential energy term:

$$\frac{1}{2} k x_{n+1}^2 = \frac{1}{2} k \left( x_n + v_n \Delta t \right)^2 = \frac{1}{2} k x_n^2 + k x_n v_n \Delta t + \frac{1}{2} k v_n^2 \Delta t^2$$

Add kinetic and potential energy together:

$$E_{n+1} = \left( \frac{1}{2} m v_n^2 + \frac{1}{2} k x_n^2 \right) + (-k x_n v_n \Delta t + k x_n v_n \Delta t) + \frac{1}{2} \frac{k^2}{m} x_n^2 \Delta t^2 + \frac{1}{2} k v_n^2 \Delta t^2$$

Notice the linear cross-terms cancel identically! We are left with:

$$E_{n+1} = E_n + \frac{1}{2} k \Delta t^2 \left( \frac{k}{m} x_n^2 + v_n^2 \right)$$

Since $\omega^2 = \frac{k}{m}$:

$$E_{n+1} = E_n + \frac{1}{2} k \Delta t^2 (\omega^2 x_n^2 + v_n^2) = E_n + \omega^2 \Delta t^2 \left( \frac{1}{2} k x_n^2 + \frac{1}{2} m v_n^2 \right)$$

$$\mathbf{E_{n+1} = E_n \left( 1 + \omega^2 \Delta t^2 \right)}$$

#### The Exponential Blowup Law
On every single numerical step, the total mechanical energy of the system is multiplied by the growth factor $(1 + \omega^2 \Delta t^2) > 1$.
After $n$ steps, corresponding to continuous time $t = n \Delta t$:

$$E(t) = E_0 \left( 1 + \omega^2 \Delta t^2 \right)^n = E_0 \left( 1 + \omega^2 \Delta t^2 \right)^{t / \Delta t}$$

Using the classical limit identity $\lim_{u \to 0} (1 + u)^{1/u} = e$:

$$E(t) \approx E_0 e^{\omega^2 \Delta t \cdot t}$$

```
Mechanical Energy E(t)
  ^
  |                                                  / (Forward Euler Explodes)
  |                                                 /  E(t) ~ E_0 * e^(w^2 * dt * t)
  |                                               /
  |                                             /
  |                                          _/'
  |                                    _---'
  |  -------------------------------------------- (Exact Physical Conservation)
  |
  +--------------------------------------------------------------------------> Time t
```

The physical energy does not simply oscillate—**it grows exponentially without bound**!
- In an orbital simulation, a planet simulated with Forward Euler spirals rapidly away from its star, escaping into interstellar space.
- In a mass-spring ragdoll or cloth simulation, vertices oscillate with violently increasing amplitude until positions reach $\pm \text{Infinity}$ or $\text{NaN}$, crashing the physics engine.

---

### 3.5 Phase Space Distortion & Violation of Liouville's Theorem

In Hamiltonian mechanics, **Liouville's Theorem** states that for any conservative physical system, the phase-space volume of a collection of trajectories is strictly conserved over time:

$$\frac{d\mathcal{V}}{dt} = 0 \iff \det(\mathbf{J}) = 1.0$$

Where $\mathbf{J}$ is the Jacobian matrix of the phase-space time-evolution mapping.

Let us evaluate the Jacobian determinant of the Forward Euler state transition mapping:

$$\mathbf{J}_{\text{Euler}} = \frac{\partial(x_{n+1}, v_{n+1})}{\partial(x_n, v_n)} = \begin{bmatrix} \frac{\partial x_{n+1}}{\partial x_n} & \frac{\partial x_{n+1}}{\partial v_n} \\ \frac{\partial v_{n+1}}{\partial x_n} & \frac{\partial v_{n+1}}{\partial v_n} \end{bmatrix} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

$$\det(\mathbf{J}_{\text{Euler}}) = (1)(1) - (\Delta t)(-\omega^2 \Delta t) = 1 + \omega^2 \Delta t^2$$

$$\mathbf{\det(\mathbf{J}_{\text{Euler}}) = 1 + \omega^2 \Delta t^2 > 1.0}$$

```
Phase Space Area Distortion Under Forward Euler:
      v ^                                            v ^
        |   +---+                                      |     /---+
        |   |   |  Area A_0                            |    /   /   Area A_1 = A_0 * (1 + w^2 * dt^2)
        |   +---+                                      |   +---+    (Phase volume EXPANDS!)
        +-----------> x                                +-----------> x
           Step n                                         Step n+1
```

Because $\det(\mathbf{J}_{\text{Euler}}) > 1$:
- Forward Euler **violates Liouville's Theorem**.
- It is a **non-symplectic mapping**.
- It stretches and inflates phase-space volume on every tick.
- In thermodynamic simulations, it artificially lowers entropy and violates the Second Law of Thermodynamics.

---

### 3.6 Ten In-Depth Progressive Worked Examples

#### Example 3.1: Single Forward Euler Step on an Oscillator
*Scenario:* A harmonic oscillator has mass $m = 1.0\text{ kg}$ and spring constant $k = 100.0\text{ N/m}$ ($\omega = \sqrt{100/1} = 10.0\text{ rad/s}$).
At $t = 0$, the mass is released from rest at $x_0 = 1.0\text{ m}$, $v_0 = 0.0\text{ m/s}$.
Calculate the position, velocity, and mechanical energy after one Forward Euler step with $\Delta t = 0.05\text{ s}$. Compare with the exact analytical solution.

*Step 1: Compute initial physical energy $E_0$:*
$$E_0 = \frac{1}{2} k x_0^2 + \frac{1}{2} m v_0^2 = \frac{1}{2}(100.0)(1.0)^2 + 0 = 50.0\text{ J}$$

*Step 2: Execute Forward Euler equations:*
$$x_1 = x_0 + v_0 \Delta t = 1.0 + 0(0.05) = 1.0\text{ m}$$
$$a_0 = -\omega^2 x_0 = -(10.0)^2(1.0) = -100.0\text{ m/s}^2$$
$$v_1 = v_0 + a_0 \Delta t = 0 + (-100.0)(0.05) = -5.0\text{ m/s}$$

*Step 3: Compute energy after step 1:*
$$E_1 = \frac{1}{2} k x_1^2 + \frac{1}{2} m v_1^2 = \frac{1}{2}(100.0)(1.0)^2 + \frac{1}{2}(1.0)(-5.0)^2$$
$$E_1 = 50.0 + \frac{1}{2}(25.0) = 50.0 + 12.5 = 62.5\text{ J}$$

*Step 4: Verify theoretical energy growth formula:*
$$E_1 = E_0 (1 + \omega^2 \Delta t^2) = 50.0 \times (1 + 100.0 \times (0.05)^2) = 50.0 \times (1 + 100.0 \times 0.0025) = 50.0 \times 1.25 = 62.5\text{ J}$$
Exact match! The energy jumped from $50.0\text{ J}$ to $62.5\text{ J}$ (**a 25% artificial gain in a single step!**).

*Step 5: Exact analytical solution:*
$$x_{\text{exact}}(0.05) = 1.0 \cos(10.0 \times 0.05) = \cos(0.5\text{ rad}) \approx 0.87758\text{ m}$$
$$v_{\text{exact}}(0.05) = -10.0 \sin(0.5\text{ rad}) \approx -4.79426\text{ m/s}$$
$$E_{\text{exact}} = \frac{1}{2}(100)(0.87758)^2 + \frac{1}{2}(1)(-4.79426)^2 = 38.507 + 11.493 = 50.0\text{ J}$$

---

#### Example 3.2: Energy Inflation Trace Across 5 Steps
*Scenario:* Take the exact system from Example 3.1 ($E_0 = 50.0\text{ J}$, $\omega = 10\text{ rad/s}$, $\Delta t = 0.05\text{ s}$). Trace the state vector $\begin{bmatrix} x_n \\ v_n \end{bmatrix}$ and total energy $E_n$ for steps $n = 0, 1, 2, 3, 4, 5$.

*Recurrence multiplier:* $1 + \omega^2 \Delta t^2 = 1 + 100(0.0025) = 1.25$.
State transition matrix: $\mathbf{A} = \begin{bmatrix} 1 & 0.05 \\ -5.0 & 1 \end{bmatrix}$.

- **Step 0 ($t = 0.00\text{ s}$):**
  $x_0 = 1.000\text{ m}, \quad v_0 = 0.000\text{ m/s}, \quad E_0 = 50.00\text{ J}$.
- **Step 1 ($t = 0.05\text{ s}$):**
  $x_1 = 1.000 + 0(0.05) = 1.000\text{ m}$.
  $v_1 = 0 - 5.0(1.0) = -5.000\text{ m/s}$.
  $E_1 = 50(1.0)^2 + 0.5(-5)^2 = 50 + 12.5 = 62.50\text{ J}$ ($50 \times 1.25$).
- **Step 2 ($t = 0.10\text{ s}$):**
  $x_2 = x_1 + v_1 \Delta t = 1.000 + (-5.0)(0.05) = 1.000 - 0.250 = 0.750\text{ m}$.
  $v_2 = v_1 - \omega^2 x_1 \Delta t = -5.000 - 100(1.0)(0.05) = -5.000 - 5.000 = -10.000\text{ m/s}$.
  $E_2 = 50(0.75)^2 + 0.5(-10)^2 = 50(0.5625) + 50 = 28.125 + 50.0 = 78.125\text{ J}$ ($50 \times 1.25^2$).
- **Step 3 ($t = 0.15\text{ s}$):**
  $x_3 = 0.750 + (-10.0)(0.05) = 0.750 - 0.500 = 0.250\text{ m}$.
  $v_3 = -10.000 - 100(0.75)(0.05) = -10.000 - 3.750 = -13.750\text{ m/s}$.
  $E_3 = 50(0.25)^2 + 0.5(-13.75)^2 = 3.125 + 94.531 = 97.656\text{ J}$ ($50 \times 1.25^3$).
- **Step 4 ($t = 0.20\text{ s}$):**
  $x_4 = 0.250 + (-13.75)(0.05) = 0.250 - 0.6875 = -0.4375\text{ m}$.
  $v_4 = -13.750 - 100(0.25)(0.05) = -13.750 - 1.250 = -15.000\text{ m/s}$.
  $E_4 = 50(-0.4375)^2 + 0.5(-15)^2 = 9.570 + 112.5 = 122.070\text{ J}$ ($50 \times 1.25^4$).
- **Step 5 ($t = 0.25\text{ s}$):**
  $x_5 = -0.4375 + (-15.0)(0.05) = -0.4375 - 0.750 = -1.1875\text{ m}$.
  $v_5 = -15.000 - 100(-0.4375)(0.05) = -15.000 + 2.1875 = -12.8125\text{ m/s}$.
  $E_5 = 50(-1.1875)^2 + 0.5(-12.8125)^2 = 70.508 + 82.080 = 152.588\text{ J}$ ($50 \times 1.25^5$).

*Conclusion:* In just 5 steps ($0.25\text{ seconds}$), the system's mechanical energy inflated from $50.0\text{ J}$ to $152.6\text{ J}$—**tripling total energy out of thin air**!

---

#### Example 3.3: Energy Doubling Time Calculation
*Scenario:* A student simulates a mass-spring system ($\omega = 5.0\text{ rad/s}$) at 60 Hz ($\Delta t = \frac{1}{60}\text{ s} \approx 0.016667\text{ s}$).
Calculate the exact number of steps $N_{\text{double}}$ and continuous simulated time $t_{\text{double}}$ required for Forward Euler to double the initial energy ($E(t) = 2 E_0$).

*Step 1: Determine the per-step growth factor $\rho^2$:*
$$\rho^2 = 1 + \omega^2 \Delta t^2 = 1 + (5.0)^2 \left(\frac{1}{60}\right)^2 = 1 + 25 \times \frac{1}{3600} = 1 + \frac{25}{3600} = 1 + \frac{1}{144} \approx 1.0069444$$

*Step 2: Solve for $N$ when $(\rho^2)^N = 2$:*
$$(\rho^2)^N = 2 \implies N \ln(\rho^2) = \ln(2)$$
$$\ln(\rho^2) = \ln\left(1 + \frac{1}{144}\right) \approx \frac{1}{144} \approx 0.00692048$$
$$\ln(2) \approx 0.693147$$
$$N_{\text{double}} = \frac{0.693147}{0.00692048} \approx 100.16 \implies 101\text{ steps}$$

*Step 3: Convert steps to simulated time:*
$$t_{\text{double}} = N \Delta t = 100.16 \times \frac{1}{60} \approx 1.669\text{ seconds}$$

*Conclusion:* In just **1.67 seconds of simulation** (barely 100 frames), Forward Euler doubles the physical energy of the system!

---

#### Example 3.4: Planetary Orbital Spiraling Under Forward Euler
*Scenario:* A satellite orbits Earth in a circular orbit at radius $r_0 = 7,000\text{ km}$ ($7.0 \times 10^6\text{ m}$).
Circular orbital speed: $v_0 = \sqrt{\frac{G M}{r_0}} = \sqrt{\frac{3.986 \times 10^{14}}{7.0 \times 10^6}} \approx 7,546.0\text{ m/s}$.
Angular velocity $\omega = \frac{v_0}{r_0} \approx 0.001078\text{ rad/s}$. Orbital period $T = \frac{2\pi}{\omega} \approx 5,828\text{ s} \approx 97.1\text{ minutes}$.
If integrated with Forward Euler using $\Delta t = 10.0\text{ s}$, calculate the radial drift $\Delta r$ after one single step.

*Step 1: Set coordinate system:*
Let satellite be at $\mathbf{r}_0 = \begin{bmatrix} r_0 \\ 0 \end{bmatrix} = \begin{bmatrix} 7.0 \times 10^6 \\ 0 \end{bmatrix}\text{ m}$.
Velocity is tangential: $\mathbf{v}_0 = \begin{bmatrix} 0 \\ v_0 \end{bmatrix} = \begin{bmatrix} 0 \\ 7,546.0 \end{bmatrix}\text{ m/s}$.
Gravitational acceleration points toward Earth:
$$\mathbf{a}_0 = -\frac{G M}{r_0^2} \hat{\mathbf{r}} = \begin{bmatrix} -g_{\text{orb}} \\ 0 \end{bmatrix} = \begin{bmatrix} -8.1347 \\ 0 \end{bmatrix}\text{ m/s}^2$$

*Step 2: Execute Forward Euler update:*
$$\mathbf{r}_1 = \mathbf{r}_0 + \mathbf{v}_0 \Delta t = \begin{bmatrix} 7.0 \times 10^6 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ 7,546.0 \end{bmatrix}(10.0) = \begin{bmatrix} 7,000,000 \\ 75,460 \end{bmatrix}\text{ m}$$

*Step 3: Calculate new radial distance $r_1$:*
$$r_1 = \|\mathbf{r}_1\| = \sqrt{(7,000,000)^2 + (75,460)^2}$$
Using binomial approximation $\sqrt{1 + u} \approx 1 + \frac{1}{2}u$:
$$r_1 = 7,000,000 \sqrt{1 + \left(\frac{75,460}{7,000,000}\right)^2} = 7,000,000 \sqrt{1 + (0.01078)^2} \approx 7,000,000 \left(1 + \frac{1}{2}(0.0001162)\right)$$
$$r_1 \approx 7,000,000 + 406.7\text{ m}$$

*Radial Drift:* In a single 10-second step, the satellite's altitude artificially increases by **406.7 meters**!
After one orbit (583 steps), the satellite has drifted thousands of kilometers away from Earth.

---

#### Example 3.5: Forward Euler on a Damped Oscillator: Artificial Anti-Damping
*Scenario:* A damped oscillator has equation:
$$\ddot{x} + 2\gamma \dot{x} + \omega_0^2 x = 0$$
where $\omega_0 = 10.0\text{ rad/s}$ and true physical damping coefficient $\gamma = 0.5\text{ s}^{-1}$.
Determine the condition on timestep $\Delta t$ such that Forward Euler's artificial energy inflation completely overwhelms the physical damping, causing the damped system to oscillate with *growing* amplitude!

*Step 1: Formulate Forward Euler matrix:*
$$\begin{cases}
x_{n+1} = x_n + v_n \Delta t \\
v_{n+1} = v_n - (2\gamma v_n + \omega_0^2 x_n)\Delta t = -\omega_0^2 \Delta t \cdot x_n + (1 - 2\gamma \Delta t) v_n
\end{cases}$$
State matrix:
$$\mathbf{A} = \begin{bmatrix} 1 & \Delta t \\ -\omega_0^2 \Delta t & 1 - 2\gamma \Delta t \end{bmatrix}$$

*Step 2: Compute determinant (product of eigenvalues):*
$$\det(\mathbf{A}) = (1)(1 - 2\gamma \Delta t) - (\Delta t)(-\omega_0^2 \Delta t) = 1 - 2\gamma \Delta t + \omega_0^2 \Delta t^2$$

*Step 3: Condition for instability ($|\lambda| > 1$):*
The system is unstable (growing amplitude) if $\det(\mathbf{A}) > 1$:
$$1 - 2\gamma \Delta t + \omega_0^2 \Delta t^2 > 1$$
$$-2\gamma \Delta t + \omega_0^2 \Delta t^2 > 0$$
Divide by $\Delta t > 0$:
$$\omega_0^2 \Delta t - 2\gamma > 0 \implies \Delta t > \frac{2\gamma}{\omega_0^2}$$

*Step 4: Evaluate numerically:*
$$\Delta t_{\text{threshold}} = \frac{2(0.5)}{(10.0)^2} = \frac{1.0}{100.0} = 0.010\text{ s} = 10.0\text{ ms}$$

*Profound Implication:* If the engine runs at $\Delta t = 0.01667\text{ s}$ ($60\text{ Hz}$), since $16.67\text{ ms} > 10.0\text{ ms}$, **Forward Euler will cause a damped physical spring to spontaneously gain energy and blow up**, directly reversing the arrow of entropy!

---

#### Example 3.6: Phase Space Unit Square Distortion
*Scenario:* At $t_0 = 0$, consider an ensemble of initial states occupying a unit square in phase space:
$$\mathcal{S}_0 = \{ (x, v) \mid 0 \le x \le 1\text{ m}, \ 0 \le v \le 1\text{ m/s} \}$$
Initial phase space area: $\mathcal{A}_0 = 1.0\text{ m}^2/\text{s}$.
The system is an oscillator with $\omega = 4.0\text{ rad/s}$.
Calculate the phase space area $\mathcal{A}_1$ after one Forward Euler step with $\Delta t = 0.25\text{ s}$.

*Step 1: Transform the 4 vertices of the square:*
$\mathbf{A} = \begin{bmatrix} 1 & 0.25 \\ -4^2(0.25) & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0.25 \\ -4.0 & 1 \end{bmatrix}$.
- Vertex $O(0, 0) \to (0, 0)$
- Vertex $A(1, 0) \to (1, -4.0)$
- Vertex $B(1, 1) \to (1.25, -3.0)$
- Vertex $C(0, 1) \to (0.25, 1.0)$

*Step 2: Compute area of transformed parallelogram:*
The vectors defining the parallelogram edges from origin are $\mathbf{u} = \begin{bmatrix} 1 \\ -4 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 0.25 \\ 1 \end{bmatrix}$.
$$\mathcal{A}_1 = |u_x v_y - u_y v_x| = |(1)(1) - (-4)(0.25)| = |1 - (-1)| = |1 + 1| = 2.0\text{ m}^2/\text{s}$$

*Step 3: Verify via Jacobian determinant:*
$$\mathcal{A}_1 = \mathcal{A}_0 \cdot \det(\mathbf{J}) = 1.0 \times (1 + \omega^2 \Delta t^2) = 1.0 \times (1 + 16 \times 0.0625) = 1.0 \times (1 + 1) = 2.0$$

*Conclusion:* The phase space volume doubled in a single step! Forward Euler dilates phase space volume by $100\%$, destroying Liouville conservation.

---

#### Example 3.7: Eigenvalue Trajectory in the Complex Plane
*Scenario:* Plot the locus of the Forward Euler eigenvalues $\lambda(\Delta t) = 1 \pm i \omega \Delta t$ in the complex plane as $\Delta t$ increases from 0. Explain why Forward Euler's stability region excludes the imaginary axis.

*Step 1: Complex coordinates of $\lambda$:*
Real part: $\text{Re}(\lambda) = 1.0$ (constant).
Imaginary part: $\text{Im}(\lambda) = \pm \omega \Delta t$.

*Step 2: Geometric locus in the complex plane:*
As $\Delta t$ increases from $0 \to \infty$, the eigenvalues trace a **vertical line passing through $z = 1 + 0i$ parallel to the imaginary axis**:

```
Im(z) ^
      |         | Locus of Forward Euler: x = 1 (Always outside unit circle!)
      |       * | \lambda = 1 + i * w * dt
      |     /   |
      |   /     |
      |  | Unit |
      |  |Circle|
  ----+--+------+---+----------------------> Re(z)
      | -1     0|   1
      |  |      |
      |   \     |
      |     \   |
      |       * | \lambda = 1 - i * w * dt
      |         |
```

*Step 3: Stability domain analysis:*
For any numerical method to be stable, its eigenvalues must lie **inside or on the unit circle** ($|z| \le 1$).
The unit circle has boundary $|z| = 1$, which touches $z = 1$ only at the single point $(1, 0)$.
For any $\Delta t > 0$, the point $(1, \pm \omega \Delta t)$ lies strictly outside the unit disk:
$$|1 \pm i \omega \Delta t| = \sqrt{1 + \omega^2 \Delta t^2} > 1$$
Because conservative Hamiltonian systems have purely imaginary physical poles ($s = \pm i \omega$), and Forward Euler's stability region does not include any portion of the imaginary axis except the origin, **Forward Euler cannot stably simulate any undamped physical system**.

---

#### Example 3.8: Cloth Mesh Spring Explosion
*Scenario:* A cloth simulation consists of a grid of particles connected by stiff structural springs ($k = 10,000\text{ N/m}$, particle mass $m = 0.01\text{ kg}$).
1. Calculate the natural angular frequency $\omega$ of the springs.
2. If integrated with Forward Euler at 60 Hz ($\Delta t = 0.01667\text{ s}$), calculate the per-step energy multiplier.
3. Calculate the total energy amplification after 1 second (60 steps).

*Step 1: Natural frequency:*
$$\omega = \sqrt{\frac{k}{m}} = \sqrt{\frac{10,000}{0.01}} = \sqrt{1,000,000} = 1,000\text{ rad/s}$$

*Step 2: Per-step growth factor:*
$$\omega \Delta t = 1,000 \times 0.016667 = 16.667$$
$$1 + \omega^2 \Delta t^2 = 1 + (16.667)^2 \approx 1 + 277.78 = 278.78$$
The mechanical energy multiplies by **278.8 times per frame**!

*Step 3: Energy after 1 second (60 frames):*
$$E_{60} = E_0 (278.78)^{60} \approx E_0 \cdot 10^{147}$$

*Physical Manifestation:* Within 3 frames, the vertices oscillate wildly. By frame 5, coordinates exceed $10^{38}$ (Float32 overflow), turning the entire cloth mesh into `NaN` (Not a Number). The cloth explodes into nothingness.

---

#### Example 3.9: Truncation Error Comparison on Exponential Decay
*Scenario:* Consider a purely dissipative system where Forward Euler *is* stable:
$$\dot{y} = -\lambda y, \qquad y_0 = 1.0, \quad \lambda = 10.0\text{ s}^{-1}$$
Forward Euler step: $y_{n+1} = y_n (1 - \lambda \Delta t)$.
1. Find the stability condition on $\Delta t$ for this dissipative system.
2. Compare the numerical value against the exact value $y(0.1)$ using $\Delta t = 0.1\text{ s}$ and $\Delta t = 0.05\text{ s}$.

*Step 1: Stability condition:*
The amplification factor is $g = 1 - \lambda \Delta t$.
Stability requires $|g| \le 1$:
$$-1 \le 1 - \lambda \Delta t \le 1$$
$$-2 \le -\lambda \Delta t \le 0 \implies 0 < \Delta t \le \frac{2}{\lambda} = \frac{2}{10.0} = 0.20\text{ s}$$
Forward Euler is conditionally stable for dissipative systems if $\Delta t \le 0.20\text{ s}$.

*Step 2: Numerical evaluation at $t = 0.1\text{ s}$:*
- Exact solution: $y_{\text{exact}}(0.1) = e^{-10.0 \times 0.1} = e^{-1.0} \approx 0.367879$.
- Step $\Delta t = 0.1\text{ s}$ (1 step):
  $$y_1 = 1.0(1 - 10.0 \times 0.1) = 1.0(0.0) = 0.000000 \quad (\text{Error } = 0.368)$$
- Step $\Delta t = 0.05\text{ s}$ (2 steps):
  $$y_1 = 1.0(1 - 10.0 \times 0.05) = 1.0(1 - 0.5) = 0.500$$
  $$y_2 = 0.5(1 - 0.5) = 0.250000 \quad (\text{Error } = 0.118)$$

*Analysis:* While Forward Euler doesn't explode here, its numerical accuracy is dismal unless $\Delta t$ is extremely small.

---

#### Example 3.10: The Asymmetric Update Trap (Accidental Symplectic Euler)
*Scenario:* A student accidentally writes:
```typescript
// Accidental code:
v = v + a * dt; // Velocity updated FIRST!
x = x + v * dt; // Position updated using the NEW velocity!
```
The student intended to write Forward Euler, but swapped the two lines.
Evaluate the state transition matrix of this swapped algorithm for $\ddot{x} = -\omega^2 x$, compute its determinant, and determine if it explodes like Forward Euler.

*Step 1: Write algebraic equations of the swapped code:*
$$v_{n+1} = v_n - \omega^2 x_n \Delta t$$
$$x_{n+1} = x_n + v_{n+1} \Delta t = x_n + (v_n - \omega^2 x_n \Delta t)\Delta t = (1 - \omega^2 \Delta t^2) x_n + \Delta t \cdot v_n$$

*Step 2: Construct state transition matrix:*
$$\mathbf{A}_{\text{swapped}} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

*Step 3: Compute determinant:*
$$\det(\mathbf{A}_{\text{swapped}}) = (1 - \omega^2 \Delta t^2)(1) - (\Delta t)(-\omega^2 \Delta t)$$
$$\det(\mathbf{A}_{\text{swapped}}) = 1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2 \equiv \mathbf{1.00000000}$$

*Profound Revelation:* By merely swapping the order of the two lines, the determinant became **identically equal to 1.0**!
The student accidentally discovered **Semi-Implicit (Symplectic) Euler**!
Phase space volume is now 100% conserved, and the energy explosion is completely cured. This single line swap transforms an unplayable, exploding engine into a stable, production-grade simulator.

---

### 3.7 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 3.1 – 3.2)

##### Exercise 3.1
Explain why Explicit Forward Euler is designated as an "explicit" numerical integrator. What specific values are passed to the force function $\mathbf{F}(\mathbf{x}, \mathbf{v}, t)$ during a Forward Euler step?

##### Exercise 3.2
State why Forward Euler is considered an "artificial perpetual motion machine" when applied to conservative mechanical systems. Which law of thermodynamics does it violate?

---

#### Tier 2: Mathematical Derivations & Eigenvalues (Exercises 3.3 – 3.4)

##### Exercise 3.3
For a simple harmonic oscillator $\ddot{x} + \omega^2 x = 0$:
1. State the Forward Euler difference equations.
2. Prove that the eigenvalues of the state transition matrix are $\lambda = 1 \pm i \omega \Delta t$.
3. Show that the spectral radius is strictly bounded from below by $|\lambda| \ge 1 + \frac{1}{2}\omega^2 \Delta t^2$.

##### Exercise 3.4
Calculate the per-step energy amplification factor for a pendulum with frequency $\omega = 4.0\text{ rad/s}$ simulated with Forward Euler at 50 Hz ($\Delta t = 0.020\text{ s}$). If the initial energy is $10.0\text{ J}$, what will the energy be after 250 steps ($5\text{ seconds}$)?

---

#### Tier 3: Phase Space & Liouville Conservation (Exercises 3.5 – 3.6)

##### Exercise 3.5
Prove that the Jacobian determinant of Forward Euler for a general 2D conservative system $\ddot{\mathbf{x}} = -\nabla V(\mathbf{x})$ satisfies $\det(\mathbf{J}) = 1 + O(\Delta t^2) > 1.0$, violating Liouville's theorem.

##### Exercise 3.6
A circular particle beam in a synchrotron accelerator has an initial phase space area of $1.5\text{ mm}\cdot\text{mrad}$. If the transverse betatron oscillation has frequency $\omega = 10^5\text{ rad/s}$ and is simulated with Forward Euler using $\Delta t = 10^{-6}\text{ s}$, calculate the artificial beam emittance (phase space area) after 1,000 turns.

---

#### Tier 4: Dissipative Systems & Failure Modes (Exercises 3.7 – 3.8)

##### Exercise 3.7
A shock absorber has mass $m = 1.0\text{ kg}$, damping $c = 20.0\text{ N}\cdot\text{s/m}$, and spring constant $k = 100.0\text{ N/m}$.
1. Determine the critical timestep $\Delta t_{\text{blowup}}$ above which Forward Euler will cause this damped shock absorber to oscillate with growing amplitude.
2. If an engineer runs this simulation at 10 Hz ($\Delta t = 0.10\text{ s}$), what happens?

##### Exercise 3.8
Explain why reducing the timestep $\Delta t$ by a factor of 10 delays the Forward Euler energy explosion, but cannot prevent it from occurring.

---

#### Tier 5: Advanced Dynamics & Catastrophic Mesh Failure (Exercises 3.9 – 3.10)

##### Exercise 3.9
A 3D ragdoll model has 20 rigid bones interconnected by angular spring constraints with stiffness $k_\theta = 50,000\text{ N}\cdot\text{m/rad}$ and rotational inertia $I = 0.05\text{ kg}\cdot\text{m}^2$.
1. Compute the natural angular frequency $\omega$.
2. Calculate the number of 60 Hz physics frames elapsed before the rotational kinetic energy inflates by a factor of $10^6$.
3. Describe the visual behavior of the ragdoll as this threshold is crossed.

##### Exercise 3.10
Prove that for any linear system $\dot{\mathbf{y}} = \mathbf{A}\mathbf{y}$, Forward Euler is stable if and only if all eigenvalues $\mu_i$ of $\mathbf{A}$ scaled by $\Delta t$ lie strictly inside the disk of radius 1 centered at $z = -1$ in the complex plane: $|1 + \mu_i \Delta t| \le 1$. Explain why this condition can never be satisfied if $\mu_i$ is purely imaginary.

---

### 3.8 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 3.1
*Why "Explicit":* An integrator is classified as **explicit** if the calculation of the future state $\mathbf{y}_{n+1}$ depends exclusively on function evaluations and states that are already known at the current time $t_n$:
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \cdot \mathbf{f}(\mathbf{y}_n, t_n)$$
No algebraic systems of equations, matrix inversions, or root-finding iterations (like Newton-Raphson) are required.

*Values Passed to Force Function:*
During a Forward Euler step, the force function $\mathbf{F}(\mathbf{x}, \mathbf{v}, t)$ evaluates the forces using strictly the **old positions** $\mathbf{x}_n$ and **old velocities** $\mathbf{v}_n$:
$$\mathbf{F}_n = \mathbf{F}(\mathbf{x}_n, \mathbf{v}_n, t_n)$$
It has zero knowledge of where the particles will move during the interval $\Delta t$.

---

#### Solution to Exercise 3.2
*Perpetual Motion Machine:* In an isolated, conservative physical system (such as an ideal spring or unperturbed planetary orbit), the First Law of Thermodynamics mandates that total mechanical energy $E = T + V$ must remain strictly constant.
Forward Euler multiplies the system's mechanical energy by $(1 + \omega^2 \Delta t^2) > 1$ on every single time step.
Because $(1 + \omega^2 \Delta t^2) > 1$ for all $\Delta t > 0$, the algorithm spontaneously generates work and kinetic energy without any external energy input. Over time, it pumps infinite energy into the simulation, violating the **First Law of Thermodynamics** (conservation of energy) and the **Second Law of Thermodynamics** (by artificially decreasing phase-space entropy).

---

#### Solution to Exercise 3.3
*Part 1: Forward Euler difference equations for $\ddot{x} = -\omega^2 x$:*
$$x_{n+1} = x_n + v_n \Delta t$$
$$v_{n+1} = v_n - \omega^2 x_n \Delta t$$

*Part 2: Eigenvalue proof:*
State matrix: $\mathbf{A} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$.
$$\det(\mathbf{A} - \lambda \mathbf{I}) = (1 - \lambda)^2 + \omega^2 \Delta t^2 = 0$$
$$(1 - \lambda)^2 = -\omega^2 \Delta t^2 \implies 1 - \lambda = \pm i \omega \Delta t \implies \lambda = 1 \pm i \omega \Delta t$$

*Part 3: Spectral radius lower bound:*
$$|\lambda| = \sqrt{1^2 + (\omega \Delta t)^2} = (1 + \omega^2 \Delta t^2)^{1/2}$$
Using the inequality $\sqrt{1 + u} \ge 1 + \frac{1}{2}u - \frac{1}{8}u^2$ (or directly from Taylor series $\sqrt{1+u} = 1 + \frac{1}{2}u - \dots$):
For small $u = \omega^2 \Delta t^2$:
$$|\lambda| \ge 1 + \frac{1}{2}\omega^2 \Delta t^2$$
$\blacksquare$ Since $\frac{1}{2}\omega^2 \Delta t^2 > 0$, $|\lambda| > 1.0$ unconditionally.

---

#### Solution to Exercise 3.4
Given: $\omega = 4.0\text{ rad/s}$, $\Delta t = 0.020\text{ s}$, $E_0 = 10.0\text{ J}$.

*Part 1: Per-step amplification factor:*
$$\rho^2 = 1 + \omega^2 \Delta t^2 = 1 + (4.0)^2 (0.020)^2 = 1 + 16 \times 0.0004 = 1 + 0.0064 = 1.0064$$
Each step amplifies energy by $0.64\%$.

*Part 2: Energy after 250 steps ($5\text{ seconds}$):*
$$E_{250} = E_0 (\rho^2)^{250} = 10.0 \times (1.0064)^{250}$$
Evaluate $(1.0064)^{250}$:
$$\ln((1.0064)^{250}) = 250 \times \ln(1.0064) \approx 250 \times 0.0063796 = 1.5949$$
$$e^{1.5949} \approx 4.9278$$
$$E_{250} = 10.0 \times 4.9278 \approx 49.28\text{ J}$$
In just 5 seconds, the energy inflates by nearly **500%**!

---

#### Solution to Exercise 3.5
*Proof of Liouville Violation for General Conservative Force:*
Let $\ddot{\mathbf{x}} = -\nabla V(\mathbf{x})$. In first-order form:
$$\dot{\mathbf{x}} = \mathbf{v}, \qquad \dot{\mathbf{v}} = -\nabla V(\mathbf{x}) = \mathbf{a}(\mathbf{x})$$
Forward Euler discrete mapping:
$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t$$
$$\mathbf{v}_{n+1} = \mathbf{v}_n + \mathbf{a}(\mathbf{x}_n) \Delta t$$

The Jacobian matrix of this transformation is:
$$\mathbf{J} = \begin{bmatrix} \frac{\partial \mathbf{x}_{n+1}}{\partial \mathbf{x}_n} & \frac{\partial \mathbf{x}_{n+1}}{\partial \mathbf{v}_n} \\ \frac{\partial \mathbf{v}_{n+1}}{\partial \mathbf{x}_n} & \frac{\partial \mathbf{v}_{n+1}}{\partial \mathbf{v}_n} \end{bmatrix} = \begin{bmatrix} \mathbf{I} & \Delta t \mathbf{I} \\ \mathbf{H} \Delta t & \mathbf{I} \end{bmatrix}$$
where $\mathbf{H} = \frac{\partial \mathbf{a}}{\partial \mathbf{x}} = -\nabla^2 V(\mathbf{x})$ is the Hessian matrix of the potential.
Using the Schur complement formula for block matrices:
$$\det(\mathbf{J}) = \det(\mathbf{I} \cdot \mathbf{I} - \Delta t \mathbf{I} \cdot \mathbf{H} \Delta t) = \det(\mathbf{I} - \Delta t^2 \mathbf{H})$$
For a stable potential well (like a harmonic oscillator or gravitation), the stiffness is positive, meaning $\mathbf{H}$ has negative eigenvalues $-\omega_i^2$:
$$\det(\mathbf{J}) = \prod_{i=1}^d (1 + \omega_i^2 \Delta t^2) > 1.0$$
Because the Jacobian determinant is strictly greater than 1, phase-space volume expands monotonically on every step, violating Liouville's theorem.
$\blacksquare$

---

#### Solution to Exercise 3.6
Given: $\mathcal{A}_0 = 1.5\text{ mm}\cdot\text{mrad}$, $\omega = 10^5\text{ rad/s}$, $\Delta t = 10^{-6}\text{ s}$, $N = 1,000\text{ turns}$.

*Step 1: Compute per-step expansion factor:*
$$\omega \Delta t = 10^5 \times 10^{-6} = 0.10$$
$$\det(\mathbf{J}) = 1 + \omega^2 \Delta t^2 = 1 + (0.10)^2 = 1 + 0.01 = 1.01$$

*Step 2: Area after 1,000 steps:*
$$\mathcal{A}_{1000} = \mathcal{A}_0 \times (\det(\mathbf{J}))^{1000} = 1.5 \times (1.01)^{1000}$$
Evaluate $(1.01)^{1000}$:
$$\ln((1.01)^{1000}) = 1,000 \times \ln(1.01) \approx 1,000 \times 0.0099503 = 9.9503$$
$$e^{9.9503} \approx 20,959$$
$$\mathcal{A}_{1000} = 1.5 \times 20,959 \approx 31,438.5\text{ mm}\cdot\text{mrad}$$
The simulated particle beam blows up by a factor of **20,959 times**, dilating from $1.5$ to over $31,400\text{ mm}\cdot\text{mrad}$, rendering accelerator modeling impossible.

---

#### Solution to Exercise 3.7
*Part 1: Critical timestep $\Delta t_{\text{blowup}}$:*
System parameters: $m = 1.0\text{ kg}$, $c = 20.0\text{ N}\cdot\text{s/m}$, $k = 100.0\text{ N/m}$.
Natural frequency $\omega_0 = \sqrt{k/m} = \sqrt{100/1} = 10.0\text{ rad/s}$.
Damping parameter $2\gamma = c/m = 20.0 \implies \gamma = 10.0\text{ s}^{-1}$.
(This is critically damped since $\gamma = \omega_0 = 10.0$).

From Example 3.5, Forward Euler becomes unstable when:
$$\det(\mathbf{A}) = 1 - 2\gamma \Delta t + \omega_0^2 \Delta t^2 > 1 \implies \omega_0^2 \Delta t^2 - 2\gamma \Delta t > 0$$
$$\Delta t > \frac{2\gamma}{\omega_0^2} = \frac{2(10.0)}{(10.0)^2} = \frac{20.0}{100.0} = 0.20\text{ s}$$

*Part 2: Behavior at $\Delta t = 0.10\text{ s}$:*
Since $\Delta t = 0.10\text{ s} < 0.20\text{ s}$, the system is technically stable against exponential runaway.
However:
$$\det(\mathbf{A}) = 1 - 20(0.1) + 100(0.01) = 1 - 2.0 + 1.0 = 0.00$$
The eigenvalues are $\lambda = 0$. The damper over-dissipates, freezing the position unnaturally in a single step!

---

#### Solution to Exercise 3.8
Suppose an engineer reduces $\Delta t$ by a factor of 10 ($\Delta t \to \frac{\Delta t}{10}$).
1. The per-step energy growth factor becomes:
   $$\rho_{\text{new}}^2 = 1 + \omega^2 \left(\frac{\Delta t}{10}\right)^2 = 1 + \frac{\omega^2 \Delta t^2}{100}$$
2. The per-step inflation is indeed 100 times smaller.
3. However, to simulate the same macroscopic physical time interval $T$, the computer must now execute **10 times as many steps**:
   $$N_{\text{new}} = 10 N$$
4. The total energy growth over time $T$ is:
   $$E(T) = E_0 \left(1 + \frac{\omega^2 \Delta t^2}{100}\right)^{10 N} \approx E_0 e^{\frac{\omega^2 \Delta t^2}{100} \cdot \frac{10 T}{\Delta t}} = E_0 e^{\frac{1}{10} \omega^2 \Delta t \cdot T}$$
The growth rate in the exponent was reduced from $\omega^2 \Delta t$ to $\frac{1}{10}\omega^2 \Delta t$.
While this buys the engineer $10\times$ more time before the world explodes, the exponent remains **strictly positive**. Given enough frames, the energy will still grow to infinity. Changing $\Delta t$ merely changes the clock on the bomb; it does not disarm it.

---

#### Solution to Exercise 3.9
Given: $k_\theta = 50,000\text{ N}\cdot\text{m/rad}$, $I = 0.05\text{ kg}\cdot\text{m}^2$.

*Part 1: Natural angular frequency:*
$$\omega = \sqrt{\frac{k_\theta}{I}} = \sqrt{\frac{50,000}{0.05}} = \sqrt{1,000,000} = 1,000\text{ rad/s}$$

*Part 2: Frames until $10^6\times$ energy explosion at 60 Hz ($\Delta t = \frac{1}{60}\text{ s}$):*
$$\omega \Delta t = \frac{1,000}{60} \approx 16.667$$
Growth factor per frame:
$$\rho^2 = 1 + \omega^2 \Delta t^2 = 1 + (16.667)^2 \approx 278.78$$
We solve for $N$ frames:
$$(278.78)^N = 10^6 \implies N \ln(278.78) = 6 \ln(10)$$
$$N \times 5.6304 = 13.8155 \implies N = \frac{13.8155}{5.6304} \approx 2.45 \implies 3\text{ frames}$$

*Part 3: Visual behavior:*
- Frame 1: The ragdoll's limbs twitch slightly.
- Frame 2: The limbs violently snap and flail at supersonic speeds.
- Frame 3: The angular velocity exceeds $10^7\text{ rad/s}$. Vertices stretch into monstrous spiky polygons across the entire screen.
- Frame 4: Positions hit floating-point `Infinity` and collapse into `NaN`. The ragdoll vanishes from the screen completely.

---

#### Solution to Exercise 3.10
*Proof of Forward Euler Linear Stability Region:*
Let $\dot{\mathbf{y}} = \mathbf{A}\mathbf{y}$. Diagonalize $\mathbf{A} = \mathbf{P} \mathbf{\Lambda} \mathbf{P}^{-1}$ where $\mathbf{\Lambda} = \text{diag}(\mu_1, \dots, \mu_D)$.
In decoupled modal coordinates $z_i$, each mode evolves as:
$$\dot{z}_i = \mu_i z_i$$
Forward Euler update:
$$z_i^{(n+1)} = z_i^{(n)} + \Delta t (\mu_i z_i^{(n)}) = (1 + \mu_i \Delta t) z_i^{(n)}$$
For the solution to remain bounded, the amplification factor must satisfy:
$$|1 + \mu_i \Delta t| \le 1$$
In the complex plane, let $w = \mu_i \Delta t$. Then:
$$|w - (-1)| \le 1$$
This is precisely the equation of a **closed disk of radius 1 centered at $z = -1 + 0i$**.

*Why Purely Imaginary Eigenvalues Cannot Be Stable:*
For an undamped physical system (oscillators, orbits), the eigenvalues are purely imaginary: $\mu = \pm i \omega$ with $\omega \in \mathbb{R}$.
Substitute into the stability condition:
$$|1 \pm i \omega \Delta t| = \sqrt{1^2 + (\omega \Delta t)^2} = \sqrt{1 + \omega^2 \Delta t^2}$$
For any non-zero frequency $\omega \ne 0$ and any positive timestep $\Delta t > 0$:
$$\omega^2 \Delta t^2 > 0 \implies \sqrt{1 + \omega^2 \Delta t^2} > 1.0$$
The point $1 \pm i \omega \Delta t$ lies strictly outside the unit disk centered at $-1$ for all $\Delta t > 0$.
Therefore, Forward Euler is **fundamentally incapable of stable integration for any conservative physical system**.
$\blacksquare$
