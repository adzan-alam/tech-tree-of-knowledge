# Chapter 02: Taylor Series Foundations & The Calculus of Truncation Errors

> *"Before we can command the silicon to march through time, we must understand the currency of numerical simulation: truncation error. Every algorithm is an incomplete sentence in the language of Taylor series, and every step discards an infinite tail of higher derivatives. Mastering the mathematics of those discarded terms is the difference between an engine that holds true across millennia and one that degenerates into chaotic noise."*

---

### 2.1 The Taylor Series Expansion of Physical Motion

In 1715, English mathematician Brook Taylor published *Methodus Incrementorum Directa et Inversa*, providing the foundational tool of all computational numerical analysis: the **Taylor Series**.

Let $\mathbf{x}(t) \in \mathbb{R}^d$ represent the physical position vector of a particle moving through space as a function of continuous time $t$. If $\mathbf{x}(t)$ is infinitely differentiable on an open interval, its future position at time $t + \Delta t$ can be expressed as an infinite polynomial expansion evaluated at the current instant $t$:

$$\mathbf{x}(t + \Delta t) = \mathbf{x}(t) + \dot{\mathbf{x}}(t) \Delta t + \frac{1}{2!} \ddot{\mathbf{x}}(t) \Delta t^2 + \frac{1}{3!} \mathbf{x}^{(3)}(t) \Delta t^3 + \frac{1}{4!} \mathbf{x}^{(4)}(t) \Delta t^4 + \dots + \frac{1}{k!} \mathbf{x}^{(k)}(t) \Delta t^k + R_k(\Delta t)$$

Where $R_k(\Delta t)$ is the Lagrange remainder term:

$$R_k(\Delta t) = \frac{\mathbf{x}^{(k+1)}(\xi)}{(k+1)!} \Delta t^{k+1}, \qquad \text{for some } \xi \in [t, t + \Delta t]$$

#### The Physical Anatomy of Higher-Order Time Derivatives
In physics, each successive time derivative of position possesses a distinct physical interpretation and dimensional unit:

```
+-------------------------------------------------------------------------+
|                  THE KINEMATIC DERIVATIVE HIERARCHY                     |
+-------------------------------------------------------------------------+
|  Order | Symbol      | Common Name   | SI Units   | Physical Meaning    |
+--------+-------------+---------------+------------+---------------------+
|  0     | x(t)        | Position      | m          | Spatial location    |
|  1     | \dot{x}(t)  | Velocity      | m/s        | Rate of displacement|
|  2     | \ddot{x}(t) | Acceleration  | m/s^2      | Net force / mass    |
|  3     | x^(3)(t)    | Jerk (Jolt)   | m/s^3      | Rate of force change|
|  4     | x^(4)(t)    | Snap (Jounce) | m/s^4      | Second force change |
|  5     | x^(5)(t)    | Crackle       | m/s^5      | High-order gradient |
|  6     | x^(6)(t)    | Pop           | m/s^6      | High-order gradient |
+-------------------------------------------------------------------------+
```

When evaluating a trajectory numerically:
- **Newton's Second Law** directly provides the 2nd derivative: $\ddot{\mathbf{x}} = \frac{1}{m}\mathbf{F}(\mathbf{x}, \mathbf{v}, t)$.
- The 3rd derivative (Jerk) is the time derivative of acceleration, computed via the multi-variable chain rule:
  $$\mathbf{j}(t) = \mathbf{x}^{(3)}(t) = \frac{d\mathbf{a}}{dt} = \frac{\partial \mathbf{a}}{\partial \mathbf{x}}\dot{\mathbf{x}} + \frac{\partial \mathbf{a}}{\partial \mathbf{v}}\dot{\mathbf{v}} + \frac{\partial \mathbf{a}}{\partial t} = \mathbf{J}_{\mathbf{x}}\mathbf{v} + \mathbf{J}_{\mathbf{v}}\mathbf{a} + \frac{\partial \mathbf{a}}{\partial t}$$
- Evaluating jerk, snap, and higher derivatives analytically requires computing high-order tensor gradients (Jacobians and Hessians) of physical force fields, which is computationally expensive or impossible for complex contact systems.

Therefore, **numerical integrators truncate the Taylor series after a small finite number of terms**, approximating the infinite continuum by a low-order polynomial.

---

### 2.2 Big-$O$ Asymptotic Notation in Numerical Discretization

To quantify the precision of a numerical algorithm, computer science and numerical analysis employ **Landau's Big-$O$ Asymptotic Notation**.

In algorithmic complexity (e.g., sorting algorithms), $O(N^2)$ characterizes behavior as the problem size expands toward infinity ($N \to \infty$).
In numerical integration, **asymptotic analysis characterizes behavior as the step size contracts toward zero ($\Delta t \to 0$)**.

#### Formal Definition
We write:

$$f(\Delta t) = O(\Delta t^p) \quad \text{as } \Delta t \to 0$$

if there exist positive real constants $M > 0$ and $\delta > 0$ such that:

$$|f(\Delta t)| \le M |\Delta t|^p, \qquad \forall |\Delta t| < \delta$$

#### The Asymptotic Inversion: Why Larger Powers Represent Smaller Errors
Because the simulation step size $\Delta t$ is a small fraction of a second (typically $\Delta t \in [0.001, 0.05]$), higher powers of $\Delta t$ shrink with breathtaking speed:

```
Suppose \Delta t = 0.01 seconds (10 milliseconds):
  - Order 1: (\Delta t)^1 = 10^-2 = 0.01
  - Order 2: (\Delta t)^2 = 10^-4 = 0.0001
  - Order 3: (\Delta t)^3 = 10^-6 = 0.000001
  - Order 4: (\Delta t)^4 = 10^-8 = 0.00000001
```

If Algorithm A has error $O(\Delta t)$ and Algorithm B has error $O(\Delta t^4)$, Algorithm B is not merely four times more accurate—at $\Delta t = 0.01$, **Algorithm B is one million times more accurate**!

Furthermore, when the step size is halved ($\Delta t \to \frac{\Delta t}{2}$):
- An $O(\Delta t)$ method reduces its error by a factor of $2^1 = 2$ ($50\%$).
- An $O(\Delta t^2)$ method reduces its error by a factor of $2^2 = 4$ ($75\%$).
- An $O(\Delta t^4)$ method reduces its error by a factor of $2^4 = 16$ ($93.75\%$).

---

### 2.3 Local Truncation Error (LTE) vs. Global Truncation Error (GTE)

A critical source of confusion for novice simulation engineers is the distinction between **Local Truncation Error** and **Global Truncation Error**.

```
+-------------------------------------------------------------------------+
|                  LOCAL VS. GLOBAL TRUNCATION ERROR                      |
+-------------------------------------------------------------------------+
|                                                                         |
|  True Trajectory:     y(t)   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>  |
|                                     /               /              /    |
|  Local Step Error:                 / (LTE)         / (LTE)        /     |
|                                   v               v              v      |
|  Discrete Steps:      y_0 -----> y_1 ----------> y_2 ---------> y_3     |
|                                                                         |
|  Global Error (GTE):  | y(t_3) - y_3 | = Accumulation of all LTEs       |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### 1. Local Truncation Error (LTE)
The **Local Truncation Error** $\mathbf{d}_{n+1}$ (also called one-step error) is the difference between the true analytical solution $\mathbf{y}(t_{n+1})$ and the numerical solution $\mathbf{y}_{n+1}$, **under the hypothetical assumption that the starting state $\mathbf{y}_n$ at tick $n$ was 100% exact**:

$$\mathbf{d}_{n+1} \equiv \mathbf{y}(t_{n+1}) - \Phi(\mathbf{y}(t_n), \Delta t)$$

Where $\Phi$ is the numerical step operator.
If an integrator matches the Taylor series of the exact solution up to the $p$-th derivative, the first discarded term is proportional to $\Delta t^{p+1}$. Therefore:

$$\text{LTE} = O(\Delta t^{p+1})$$

#### 2. Global Truncation Error (GTE)
In a real simulation, the starting state $\mathbf{y}_n$ is never exact; it carries the accumulated debris of all previous numerical errors from steps $0, 1, \dots, n-1$.

The **Global Truncation Error** $\mathbf{e}_n$ is the actual discrepancy between the true continuous trajectory and the simulated discrete state at time $t_n = t_0 + n \Delta t$:

$$\mathbf{e}_n \equiv \mathbf{y}(t_n) - \mathbf{y}_n$$

#### The Fundamental Accumulation Relation: Why GTE Drops One Order
To integrate across a fixed macroscopic physical time span $T = t_{\text{final}} - t_0$, the total number of discrete steps executed by the engine is:

$$N = \frac{T}{\Delta t}$$

Assuming the errors accumulate additively without exponential instability, the global error after $N$ steps is bounded by the sum of all local truncation errors:

$$\|\mathbf{e}_N\| \le \sum_{n=1}^{N} \|\mathbf{d}_n\| \approx N \cdot \text{LTE}$$

Substitute $N = \frac{T}{\Delta t}$ and $\text{LTE} = C \cdot \Delta t^{p+1}$:

$$\|\mathbf{e}_N\| \approx \left(\frac{T}{\Delta t}\right) \cdot \left(C \cdot \Delta t^{p+1}\right) = (C \cdot T) \cdot \Delta t^p = O(\Delta t^p)$$

$$\mathbf{\text{Global Order } p \iff \text{Local Order } p+1}$$

```
+-------------------------------------------------------------------------+
|                  ORDER RELATIONSHIPS OF COMMON INTEGRATORS              |
+-------------------------------------------------------------------------+
|  Integrator               | Local Error (LTE) | Global Error (GTE)      |
+---------------------------+-------------------+-------------------------+
|  Explicit Forward Euler   | O(\Delta t^2)     | O(\Delta t)   [Order 1] |
|  Semi-Implicit Euler      | O(\Delta t^2)     | O(\Delta t)   [Order 1] |
|  Position / Verlet        | O(\Delta t^4)     | O(\Delta t^2) [Order 2] |
|  Velocity Verlet          | O(\Delta t^3)     | O(\Delta t^2) [Order 2] |
|  Classical Runge-Kutta 4  | O(\Delta t^5)     | O(\Delta t^4) [Order 4] |
+---------------------------+-------------------+-------------------------+
```

---

### 2.4 The Dahlquist Equivalence Theorem

Can an engineer invent an arbitrary difference equation, verify that its Taylor series matches up to $O(\Delta t^2)$, and conclude that the numerical simulation will converge to the true continuous physics?

**No.** In 1956, Swedish mathematician Germund Dahlquist published the definitive foundational theorem of modern numerical analysis: the **Dahlquist Equivalence Theorem** (also known as the Lax-Richtmyer Equivalence Theorem in PDE theory).

$$\mathbf{Consistency} + \mathbf{Zero\text{-}Stability} \iff \mathbf{Convergence}$$

```
+-------------------------------------------------------------------------+
|                  THE DAHLQUIST CONVERGENCE TRIPTYCH                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ CONSISTENCY ]      --> As \Delta t -> 0, difference equation         |
|                           converges to the exact differential equation. |
|                                   +                                     |
|  [ ZERO-STABILITY ]   --> Numerical rounding & perturbations do not     |
|                           amplify exponentially as \Delta t -> 0.       |
|                                   ||                                    |
|                                   v                                     |
|  [ CONVERGENCE ]      --> Discrete trajectory y_n provably converges    |
|                           to exact continuous y(t) for all t.           |
|                                                                         |
+-------------------------------------------------------------------------+
```

1. **Consistency:** An integrator is consistent of order $p \ge 1$ if the local truncation error per unit time vanishes as the timestep approaches zero:
   $$\lim_{\Delta t \to 0} \frac{\|\mathbf{d}_{n+1}\|}{\Delta t} = 0 \implies \text{LTE} = O(\Delta t^{p+1}) \text{ with } p \ge 1$$
2. **Zero-Stability:** As $\Delta t \to 0$, roots of the method's characteristic polynomial must lie within or on the complex unit circle, with any roots on the unit circle being strictly simple (the Dahlquist root condition). Zero-stability ensures that small initial errors or floating-point roundoff perturbations do not grow exponentially.
3. **Convergence:** A method is convergent if, for any fixed time $t = n \Delta t$, the numerical state $\mathbf{y}_n$ approaches the true analytical solution $\mathbf{y}(t)$ as $\Delta t \to 0$:
   $$\lim_{\substack{\Delta t \to 0 \\ n \Delta t = t}} \|\mathbf{y}_n - \mathbf{y}(t)\| = 0$$

If an integrator is consistent but unstable, making $\Delta t$ smaller does not fix the simulation—the error blows up faster!

---

### 2.5 The Total Error Dilemma: Truncation Error vs. Floating-Point Roundoff

A widespread fallacy among junior developers is: *"If a smaller $\Delta t$ reduces truncation error, we should make $\Delta t$ as infinitesimally small as possible ($10^{-8}\text{ s}$ or $10^{-12}\text{ s}$)."*

In real digital silicon, this strategy leads to catastrophic failure due to the clash between **Truncation Error** and **Floating-Point Roundoff Error**.

#### The Dual Error Balance
Total computational error $E_{\text{total}}$ is the sum of two opposing functions of $\Delta t$:

$$E_{\text{total}}(\Delta t) = E_{\text{trunc}}(\Delta t) + E_{\text{round}}(\Delta t)$$

1. **Mathematical Truncation Error:** Decreases monotonically as $\Delta t$ shrinks:
   $$E_{\text{trunc}}(\Delta t) = C_1 \Delta t^p$$
2. **Silicon Roundoff Error:** To simulate a total duration $T$, the computer executes $N = T / \Delta t$ steps. In IEEE 754 arithmetic, each step introduces an unavoidable roundoff error of order $\epsilon_{\text{mach}}$ ($\approx 1.19 \times 10^{-7}$ for Float32, $\approx 2.22 \times 10^{-16}$ for Float64). Assuming a random-walk accumulation:
   $$E_{\text{round}}(\Delta t) \approx C_2 \epsilon_{\text{mach}} \sqrt{N} = C_2 \epsilon_{\text{mach}} \sqrt{\frac{T}{\Delta t}}$$
   Or, under biased systematic rounding:
   $$E_{\text{round}}(\Delta t) \approx C_2 \epsilon_{\text{mach}} \left(\frac{T}{\Delta t}\right)$$

```
Error
  ^
  |          \                                 /
  |           \   ROUNDOFF ERROR              /   TRUNCATION ERROR
  |            \  E ~ eps / dt               /    E ~ C * dt^p
  |             \                           /
  |              \                         /
  |               \       TOTAL ERROR     /
  |                \       _-------_     /
  |                 \_----'         `---/
  |                  `--._       _.-'
  |                       `--*--' <--- OPTIMAL TIMESTEP: dt_opt
  +------------------------------------------------------------------> dt
```

#### The Optimal Step Size $\Delta t_{\text{opt}}$
If $\Delta t > \Delta t_{\text{opt}}$, truncation error dominates: the simulation is too coarse.
If $\Delta t < \Delta t_{\text{opt}}$, roundoff error dominates: the computer executes so many trillions of additions that floating-point absorption and catastrophic cancellation destroy the result!

Differentiating $E_{\text{total}}(\Delta t) = C_1 \Delta t^p + \frac{C_2 \epsilon}{\Delta t}$ with respect to $\Delta t$ and setting to zero yields:

$$\frac{dE_{\text{total}}}{d\Delta t} = p C_1 \Delta t^{p-1} - \frac{C_2 \epsilon}{\Delta t^2} = 0 \implies \Delta t_{\text{opt}} \sim \left( \frac{C_2 \epsilon}{p C_1} \right)^{\frac{1}{p+1}}$$

For a first-order method ($p=1$) in single precision ($\epsilon \approx 10^{-7}$), $\Delta t_{\text{opt}} \approx \sqrt{10^{-7}} \approx 3 \times 10^{-4}\text{ s}$. Stepping at $\Delta t = 10^{-6}\text{ s}$ produces *worse* results than stepping at $\Delta t = 10^{-3}\text{ s}$!

---

### 2.6 Ten In-Depth Progressive Worked Examples

#### Example 2.1: Taylor Series Expansion of Simple Harmonic Motion
*Scenario:* A mass-spring oscillator has exact position $x(t) = \sin(\omega t)$ with $\omega = 2.0\text{ rad/s}$.
Evaluate the first 5 terms of the Taylor series expansion about $t = 0$ for a timestep $\Delta t = 0.1\text{ s}$. Compare the 1st-order, 2nd-order, 3rd-order, and 5th-order truncated Taylor approximations against the exact value.

*Step 1: Compute time derivatives at $t = 0$:*
- $x(0) = \sin(0) = 0.0$
- $\dot{x}(t) = \omega \cos(\omega t) \implies \dot{x}(0) = 2.0(1) = 2.0\text{ m/s}$
- $\ddot{x}(t) = -\omega^2 \sin(\omega t) \implies \ddot{x}(0) = -4.0(0) = 0.0\text{ m/s}^2$
- $x^{(3)}(t) = -\omega^3 \cos(\omega t) \implies x^{(3)}(0) = -8.0(1) = -8.0\text{ m/s}^3$
- $x^{(4)}(t) = \omega^4 \sin(\omega t) \implies x^{(4)}(0) = 16.0(0) = 0.0\text{ m/s}^4$
- $x^{(5)}(t) = \omega^5 \cos(\omega t) \implies x^{(5)}(0) = 32.0(1) = 32.0\text{ m/s}^5$

*Step 2: Formulate Taylor series polynomials:*
$$x(\Delta t) = \dot{x}(0) \Delta t + \frac{x^{(3)}(0)}{3!} \Delta t^3 + \frac{x^{(5)}(0)}{5!} \Delta t^5 - \dots$$
$$x(\Delta t) = 2.0 \Delta t - \frac{8.0}{6} \Delta t^3 + \frac{32.0}{120} \Delta t^5$$
$$x(\Delta t) = 2.0 \Delta t - \frac{4}{3} \Delta t^3 + \frac{4}{15} \Delta t^5$$

*Step 3: Evaluate at $\Delta t = 0.1\text{ s}$:*
- Exact: $x_{\text{exact}} = \sin(2.0 \times 0.1) = \sin(0.2\text{ rad}) \approx 0.1986693308\text{ m}$
- 1st-order approximation: $T_1 = 2.0(0.1) = 0.2000000000\text{ m}$
  $$\text{Error}_1 = |0.19866933 - 0.20000000| = 0.00133067\text{ m} \approx 1.33\text{ mm}$$
- 3rd-order approximation: $T_3 = 0.2 - \frac{4}{3}(0.1)^3 = 0.2 - 0.00133333 = 0.1986666667\text{ m}$
  $$\text{Error}_3 = |0.19866933 - 0.19866667| = 0.00000266\text{ m} \approx 2.66\ \mu\text{m}$$
- 5th-order approximation: $T_5 = 0.1986666667 + \frac{4}{15}(0.1)^5 = 0.1986666667 + 0.0000026667 = 0.1986693333\text{ m}$
  $$\text{Error}_5 = |0.1986693308 - 0.1986693333| = 0.0000000025\text{ m} \approx 2.5\text{ nm}$$

*Conclusion:* Adding terms in the Taylor series drops the error from millimeters to micrometers to nanometers!

---

#### Example 2.2: Computing Physical Jerk and Snap for Planetary Orbits
*Scenario:* A satellite of mass $m$ orbits a central body of mass $M$ under Newtonian gravity:
$$\mathbf{a} = -\frac{\mu}{r^3} \mathbf{r}, \qquad \text{where } \mu = G M, \quad r = \|\mathbf{r}\|$$
Derive the analytical vector expressions for the Jerk $\mathbf{j} = \dot{\mathbf{a}}$ and Snap $\mathbf{s} = \ddot{\mathbf{a}}$.

*Step 1: Differentiate $r = (\mathbf{r} \cdot \mathbf{r})^{1/2}$ with respect to time:*
$$\dot{r} = \frac{d}{dt}(\mathbf{r} \cdot \mathbf{r})^{1/2} = \frac{1}{2(\mathbf{r} \cdot \mathbf{r})^{1/2}} \cdot 2(\mathbf{r} \cdot \dot{\mathbf{r}}) = \frac{\mathbf{r} \cdot \mathbf{v}}{r}$$

*Step 2: Differentiate acceleration vector $\mathbf{a} = -\mu r^{-3} \mathbf{r}$ (Jerk):*
$$\mathbf{j} = \frac{d\mathbf{a}}{dt} = -\mu \left( \frac{d(r^{-3})}{dt} \mathbf{r} + r^{-3} \frac{d\mathbf{r}}{dt} \right)$$
$$\frac{d(r^{-3})}{dt} = -3 r^{-4} \dot{r} = -3 r^{-4} \left( \frac{\mathbf{r} \cdot \mathbf{v}}{r} \right) = -3 \frac{\mathbf{r} \cdot \mathbf{v}}{r^5}$$
Substitute back:
$$\mathbf{j} = -\mu \left( -3 \frac{\mathbf{r} \cdot \mathbf{v}}{r^5} \mathbf{r} + \frac{1}{r^3} \mathbf{v} \right) = \frac{\mu}{r^3} \left( 3 \frac{\mathbf{r} \cdot \mathbf{v}}{r^2} \mathbf{r} - \mathbf{v} \right)$$

*Step 3: Evaluate Jerk for a circular orbit ($\mathbf{r} \cdot \mathbf{v} = 0$):*
In a circular orbit, velocity is perpendicular to position ($\mathbf{r} \cdot \mathbf{v} = 0$):
$$\mathbf{j}_{\text{circ}} = -\frac{\mu}{r^3} \mathbf{v} = \frac{\|\mathbf{a}\|}{r} (-\mathbf{v}) = -\omega^2 \mathbf{v}$$
Jerk points antiparallel to the velocity vector, with magnitude $j = \omega^3 r$.

---

#### Example 2.3: Calculating LTE of Forward Euler for Free Fall
*Scenario:* A body falls from rest under constant gravity: $\ddot{x} = -g$.
Determine the exact Local Truncation Error (LTE) of Forward Euler after a single step $\Delta t$.

*Step 1: State Forward Euler step:*
Forward Euler computes:
$$x_1 = x_0 + v_0 \Delta t$$
$$v_1 = v_0 - g \Delta t$$
For a body starting from rest ($v_0 = 0, x_0 = 0$):
$$x_1 = 0 + 0 \cdot \Delta t = 0.0\text{ m}$$

*Step 2: State exact continuous solution:*
$$x(\Delta t) = x_0 + v_0 \Delta t - \frac{1}{2} g \Delta t^2 = -\frac{1}{2} g \Delta t^2$$

*Step 3: Compute LTE:*
$$\text{LTE} = |x(\Delta t) - x_1| = \left| -\frac{1}{2} g \Delta t^2 - 0 \right| = \frac{1}{2} g \Delta t^2$$

*Asymptotic Order:* Since $\text{LTE} = \frac{1}{2} g \Delta t^2$, the local truncation error is **strictly $O(\Delta t^2)$**.

---

#### Example 2.4: Demonstrating Order-1 Global Error Scaling via Step Halving
*Scenario:* A simulation runs an Order-1 integrator ($\text{GTE} = C \Delta t$) across a duration $T = 10.0\text{ s}$.
- With $\Delta t_1 = 0.040\text{ s}$, the final positional error is $E_1 = 0.824\text{ m}$.
- With $\Delta t_2 = 0.020\text{ s}$, the final positional error is $E_2 = 0.413\text{ m}$.
- With $\Delta t_3 = 0.010\text{ s}$, the final positional error is $E_3 = 0.207\text{ m}$.
Calculate the empirical error reduction ratio between successive runs and verify that the global convergence order is $p = 1.0$.

*Step 1: Calculate reduction ratio between Run 1 and Run 2:*
$$R_{1 \to 2} = \frac{E_1}{E_2} = \frac{0.824\text{ m}}{0.413\text{ m}} \approx 1.995$$

*Step 2: Calculate reduction ratio between Run 2 and Run 3:*
$$R_{2 \to 3} = \frac{E_2}{E_3} = \frac{0.413\text{ m}}{0.207\text{ m}} \approx 1.995$$

*Step 3: Extract empirical order of convergence $p$:*
$$R = 2^p \implies p = \log_2(R) = \log_2(1.995) \approx 0.996 \approx 1.0$$
The error halves when the timestep is halved, proving first-order global convergence.

---

#### Example 2.5: Demonstrating Order-2 Global Error Scaling
*Scenario:* A simulation runs an Order-2 Velocity Verlet integrator ($\text{GTE} = C \Delta t^2$) over the same physical problem as Example 2.4.
- With $\Delta t_1 = 0.040\text{ s}$, the final error is $E_1 = 0.0164\text{ m}$ ($16.4\text{ mm}$).
- With $\Delta t_2 = 0.020\text{ s}$, the final error is $E_2 = 0.0041\text{ m}$ ($4.1\text{ mm}$).
- With $\Delta t_3 = 0.010\text{ s}$, the final error is $E_3 = 0.001025\text{ m}$ ($1.025\text{ mm}$).
Calculate the reduction ratios and empirical order $p$.

*Step 1: Calculate reduction ratios:*
$$R_{1 \to 2} = \frac{E_1}{E_2} = \frac{0.0164}{0.0041} = 4.000$$
$$R_{2 \to 3} = \frac{E_2}{E_3} = \frac{0.0041}{0.001025} = 4.000$$

*Step 2: Extract convergence order:*
$$2^p = 4.0 \implies p = 2.0$$

*Contrast with Order 1:* At $\Delta t = 0.010\text{ s}$, the Order-1 method had an error of $207\text{ mm}$, while the Order-2 method has an error of $1.025\text{ mm}$—a **200-fold increase in precision** for the exact same timestep!

---

#### Example 2.6: Calculating Optimal Step Size $\Delta t_{\text{opt}}$ for Float64
*Scenario:* An orbital simulation uses an Order-2 integrator ($p = 2$) where the truncation error constant is $C_1 = 5.0\text{ m/s}^2$. The roundoff error per step is dominated by double-precision machine epsilon $\epsilon_{\text{mach}} = 2.22 \times 10^{-16}$, with roundoff constant $C_2 = 1.0\text{ m}$. The total simulation duration is $T = 1.0\text{ year} \approx 3.15 \times 10^7\text{ s}$.
Determine the theoretical optimal timestep $\Delta t_{\text{opt}}$ that minimizes total error.

*Step 1: Formulate the total error equation:*
$$E_{\text{total}}(\Delta t) = C_1 \Delta t^2 + C_2 \epsilon_{\text{mach}} \frac{T}{\Delta t}$$
Substitute known constants:
$$E_{\text{total}}(\Delta t) = 5.0 \Delta t^2 + \frac{(1.0)(2.22 \times 10^{-16})(3.15 \times 10^7)}{\Delta t} = 5.0 \Delta t^2 + \frac{7.0 \times 10^{-9}}{\Delta t}$$

*Step 2: Differentiate with respect to $\Delta t$ and set to zero:*
$$\frac{dE_{\text{total}}}{d\Delta t} = 10.0 \Delta t - \frac{7.0 \times 10^{-9}}{\Delta t^2} = 0$$
$$10.0 \Delta t^3 = 7.0 \times 10^{-9}$$
$$\Delta t^3 = 7.0 \times 10^{-10} = 700 \times 10^{-12}$$
$$\Delta t_{\text{opt}} = (7.0 \times 10^{-10})^{1/3} \approx 8.88 \times 10^{-4}\text{ seconds} \approx 0.888\text{ ms}$$

*Sanity Check:* If the user decreases $\Delta t$ below $0.89\text{ ms}$ (e.g., to $0.001\text{ ms}$), the roundoff term $\frac{7 \times 10^{-9}}{10^{-6}} = 7.0 \times 10^{-3}\text{ m}$ dominates, making the simulation **less accurate**!

---

#### Example 2.7: Verifying the Consistency Condition of a Numerical Method
*Scenario:* Consider a proposed numerical velocity integrator:
$$v_{n+1} = v_n + \Delta t \left( \frac{3}{2} a_n - \frac{1}{2} a_{n-1} \right)$$
(known as the 2-step Adams-Bashforth method). Prove that this method is consistent with the differential equation $\dot{v} = a(t)$.

*Step 1: State the definition of consistency:*
A multi-step method is consistent if:
$$\lim_{\Delta t \to 0} \frac{v(t + \Delta t) - \left[ v(t) + \Delta t \left( \frac{3}{2} a(t) - \frac{1}{2} a(t - \Delta t) \right) \right]}{\Delta t} = 0$$

*Step 2: Expand terms using Taylor series about $t$:*
- $v(t + \Delta t) = v(t) + \dot{v}(t)\Delta t + \frac{1}{2}\ddot{v}(t)\Delta t^2 + O(\Delta t^3)$
- Since $\dot{v}(t) = a(t)$ and $\ddot{v}(t) = \dot{a}(t)$:
  $$v(t + \Delta t) = v(t) + a(t)\Delta t + \frac{1}{2}\dot{a}(t)\Delta t^2 + O(\Delta t^3)$$
- Expand $a(t - \Delta t)$:
  $$a(t - \Delta t) = a(t) - \dot{a}(t)\Delta t + O(\Delta t^2)$$

*Step 3: Substitute into the integrator expression:*
$$\text{Bracket} = v(t) + \Delta t \left( \frac{3}{2} a(t) - \frac{1}{2} [a(t) - \dot{a}(t)\Delta t + O(\Delta t^2)] \right)$$
$$= v(t) + \Delta t \left( a(t) + \frac{1}{2}\dot{a}(t)\Delta t + O(\Delta t^2) \right)$$
$$= v(t) + a(t)\Delta t + \frac{1}{2}\dot{a}(t)\Delta t^2 + O(\Delta t^3)$$

*Step 4: Evaluate the numerator:*
$$\text{Numerator} = v(t + \Delta t) - \text{Bracket} = O(\Delta t^3)$$
Divide by $\Delta t$:
$$\lim_{\Delta t \to 0} \frac{O(\Delta t^3)}{\Delta t} = \lim_{\Delta t \to 0} O(\Delta t^2) = 0$$
$\blacksquare$ The method is proven consistent of order $p = 2$.

---

#### Example 2.8: Taylor Expansion of Non-Linear Drag Acceleration
*Scenario:* A projectile moves vertically under gravity and quadratic drag:
$$\ddot{y} = -g - k \dot{y}^2, \qquad \text{where } g = 9.8\text{ m/s}^2, \quad k = 0.01\text{ m}^{-1}$$
At $t = 0$, position $y_0 = 100.0\text{ m}$ and velocity $v_0 = 30.0\text{ m/s}$ (upward).
Compute the analytical values of position, velocity, acceleration, and jerk at $t = 0$. Write the 3rd-order Taylor polynomial for position $y(\Delta t)$.

*Step 1: Evaluate acceleration $a_0$:*
$$a_0 = \ddot{y}_0 = -g - k v_0^2 = -9.8 - 0.01(30.0)^2 = -9.8 - 0.01(900.0) = -9.8 - 9.0 = -18.8\text{ m/s}^2$$

*Step 2: Differentiate acceleration to find Jerk $j_0$:*
$$j(t) = \frac{d}{dt}(-g - k v^2) = -2 k v \frac{dv}{dt} = -2 k v a$$
Substitute values at $t = 0$:
$$j_0 = -2(0.01)(30.0)(-18.8) = -0.6 \times (-18.8) = +11.28\text{ m/s}^3$$

*Step 3: Construct the 3rd-order Taylor series:*
$$y(\Delta t) = y_0 + v_0 \Delta t + \frac{1}{2} a_0 \Delta t^2 + \frac{1}{6} j_0 \Delta t^3$$
$$y(\Delta t) = 100.0 + 30.0 \Delta t + \frac{1}{2}(-18.8)\Delta t^2 + \frac{1}{6}(11.28)\Delta t^3$$
$$y(\Delta t) = 100.0 + 30.0 \Delta t - 9.4 \Delta t^2 + 1.88 \Delta t^3$$

*Evaluation at $\Delta t = 0.1\text{ s}$:*
$$y(0.1) = 100.0 + 30.0(0.1) - 9.4(0.01) + 1.88(0.001) = 100.0 + 3.0 - 0.094 + 0.00188 = 102.90788\text{ m}$$

---

#### Example 2.9: Empirical Order of Convergence (EOC) Calculation
*Scenario:* A student benchmarks a mystery numerical solver on an orbital test problem. The measured absolute errors at $T = 5.0\text{ s}$ across four timesteps are:
- $\Delta t_1 = 0.100\text{ s} \implies E_1 = 4.250 \times 10^{-2}$
- $\Delta t_2 = 0.050\text{ s} \implies E_2 = 5.320 \times 10^{-3}$
- $\Delta t_3 = 0.025\text{ s} \implies E_3 = 6.655 \times 10^{-4}$
- $\Delta t_4 = 0.0125\text{ s} \implies E_4 = 8.320 \times 10^{-5}$
Calculate the Empirical Order of Convergence (EOC) for each refinement step. Identify the order of the method.

*Step 1: Formula for EOC:*
$$\text{EOC}_{k} = \frac{\ln(E_{k-1} / E_k)}{\ln(\Delta t_{k-1} / \Delta t_k)}$$
Since each step halves the timestep, $\ln(\Delta t_{k-1} / \Delta t_k) = \ln(2) \approx 0.693147$.

*Step 2: Compute $\text{EOC}_2$ ($0.100 \to 0.050$):*
$$\frac{E_1}{E_2} = \frac{4.250 \times 10^{-2}}{5.320 \times 10^{-3}} \approx 7.9887$$
$$\text{EOC}_2 = \frac{\ln(7.9887)}{\ln(2)} = \frac{2.0780}{0.6931} \approx 2.998$$

*Step 3: Compute $\text{EOC}_3$ ($0.050 \to 0.025$):*
$$\frac{E_2}{E_3} = \frac{5.320 \times 10^{-3}}{6.655 \times 10^{-4}} \approx 7.9940$$
$$\text{EOC}_3 = \frac{\ln(7.9940)}{\ln(2)} \approx 2.999$$

*Step 4: Compute $\text{EOC}_4$ ($0.025 \to 0.0125$):*
$$\frac{E_3}{E_4} = \frac{6.655 \times 10^{-4}}{8.320 \times 10^{-5}} \approx 7.9988$$
$$\text{EOC}_4 = \frac{\ln(7.9988)}{\ln(2)} \approx 3.000$$

*Conclusion:* The mystery solver is an **Order-3 method ($p = 3$)**. Halving $\Delta t$ reduces the error by a factor of $2^3 = 8$.

---

#### Example 2.10: Richardson Extrapolation to Eliminate Leading Error
*Scenario:* An Order-1 method approximates a physical quantity $y(T)$.
- Using step size $h_1 = 0.02\text{ s}$, the method yields $y_{h_1} = 14.850$.
- Using step size $h_2 = 0.01\text{ s}$ (half size), the method yields $y_{h_2} = 15.350$.
Apply Richardson extrapolation to construct a higher-order approximation $y_{\text{extrap}}$, and determine its effective order.

*Step 1: State the asymptotic error expansion:*
Since the method is Order 1:
$$y_h = y_{\text{exact}} + C h + O(h^2)$$
For the two runs:
$$y_{h_1} = y_{\text{exact}} + C h_1 + O(h_1^2)$$
$$y_{h_2} = y_{\text{exact}} + C\left(\frac{h_1}{2}\right) + O(h_1^2)$$

*Step 2: Eliminate the $O(h)$ error term:*
Multiply the second equation by 2:
$$2 y_{h_2} = 2 y_{\text{exact}} + C h_1 + O(h_1^2)$$
Subtract the first equation:
$$2 y_{h_2} - y_{h_1} = (2 y_{\text{exact}} - y_{\text{exact}}) + (C h_1 - C h_1) + O(h_1^2)$$
$$y_{\text{extrap}} = 2 y_{h_2} - y_{h_1} = y_{h_2} + (y_{h_2} - y_{h_1})$$

*Step 3: Numerical evaluation:*
$$y_{\text{extrap}} = 2(15.350) - 14.850 = 30.700 - 14.850 = 15.850$$

*Significance:* By combining two first-order simulations, the leading $O(h)$ error was canceled algebraically. The extrapolated result $y_{\text{extrap}} = 15.850$ is **second-order accurate ($O(h^2)$)**!

---

### 2.7 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 2.1 – 2.2)

##### Exercise 2.1
Define the difference between **Local Truncation Error (LTE)** and **Global Truncation Error (GTE)**. If an integrator has an LTE of $O(\Delta t^3)$, what is its asymptotic Global Truncation Error over a fixed simulation interval $[0, T]$?

##### Exercise 2.2
Why does Big-$O$ notation in numerical analysis prioritize higher powers of $\Delta t$ (e.g., $O(\Delta t^4)$ over $O(\Delta t)$), whereas Big-$O$ in algorithmic complexity prioritizes lower powers of $N$ (e.g., $O(N)$ over $O(N^4)$)?

---

#### Tier 2: Taylor Series Expansions (Exercises 2.3 – 2.4)

##### Exercise 2.3
A particle moves according to the exponential trajectory $x(t) = e^{3t}$.
1. Derive the general $k$-th time derivative $x^{(k)}(t)$.
2. Write the 4th-order Taylor polynomial approximation for $x(\Delta t)$ expanded about $t = 0$.
3. Evaluate the truncation error of this polynomial for $\Delta t = 0.05\text{ s}$.

##### Exercise 2.4
A non-linear pendulum obeys $\ddot{\theta} = -\frac{g}{L} \sin \theta$.
Find the analytical expression for the angular jerk $\theta^{(3)} = \frac{d^3 \theta}{dt^3}$ in terms of $\theta$, $\dot{\theta}$, $g$, and $L$.

---

#### Tier 3: Error Convergence & Step Scaling (Exercises 2.5 – 2.6)

##### Exercise 2.5
A physics engine benchmarks an integrator on a ballistic trajectory. When $\Delta t = 0.050\text{ s}$, the error is $E_1 = 0.125\text{ m}$. When the step size is reduced to $\Delta t = 0.025\text{ s}$, the error drops to $E_2 = 0.03125\text{ m}$.
1. What is the empirical order of convergence $p$?
2. What will the predicted error be if $\Delta t$ is further reduced to $0.005\text{ s}$?

##### Exercise 2.6
Explain the **Dahlquist Equivalence Theorem**. Describe a hypothetical scenario where an integrator satisfies consistency ($\text{LTE} = O(\Delta t^2)$), yet fails to converge as $\Delta t \to 0$.

---

#### Tier 4: Floating-Point Roundoff Limits (Exercises 2.7 – 2.8)

##### Exercise 2.7
In a single-precision floating-point simulation (`Float32`, $\epsilon_{\text{mach}} \approx 1.19 \times 10^{-7}$), an engineer integrates a first-order system with truncation error $E_{\text{trunc}} = 2.0 \Delta t$ over $T = 100\text{ s}$.
1. Express the total error as a function of $\Delta t$ assuming roundoff error accumulates as $E_{\text{round}} = \epsilon_{\text{mach}} \frac{T}{\Delta t}$.
2. Calculate the optimal timestep $\Delta t_{\text{opt}}$ that minimizes total error.
3. What is the minimum achievable total error?

##### Exercise 2.8
A developer notices that running a physics simulation with $\Delta t = 10^{-6}\text{ s}$ causes an object to drift farther off course than running with $\Delta t = 10^{-3}\text{ s}$. Explain mathematically why this occurs.

---

#### Tier 5: High-Order Methods & Richardson Extrapolation (Exercises 2.9 – 2.10)

##### Exercise 2.9
Generalize Richardson extrapolation for an arbitrary method of known order $p$.
Given two numerical approximations $y_h$ and $y_{h/2}$, prove that:
$$y_{\text{extrap}} = \frac{2^p y_{h/2} - y_h}{2^p - 1}$$
eliminates the $O(h^p)$ error term, producing an approximation of order $p+1$.

##### Exercise 2.10
A satellite trajectory is integrated with a 4th-order method ($p = 4$).
- Step size $h = 10.0\text{ s}$ yields radial distance $r_h = 7,000,120.0\text{ m}$.
- Step size $h/2 = 5.0\text{ s}$ yields radial distance $r_{h/2} = 7,000,007.5\text{ m}$.
Use Richardson extrapolation to compute the 5th-order accurate radial distance.

---

### 2.8 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 2.1
*Local Truncation Error (LTE):* The error committed by the integrator across a single discrete time step $\Delta t$, under the assumption that the initial state at the start of the step was exact:
$$\mathbf{d}_{n+1} = \mathbf{y}(t_{n+1}) - \Phi(\mathbf{y}(t_n), \Delta t)$$

*Global Truncation Error (GTE):* The total accumulated discrepancy between the numerical state $\mathbf{y}_n$ and the true continuous solution $\mathbf{y}(t_n)$ at time $t_n = t_0 + n \Delta t$, taking into account the propagation and accumulation of all previous errors:
$$\mathbf{e}_n = \mathbf{y}(t_n) - \mathbf{y}_n$$

*Order Calculation:*
To integrate across fixed duration $T$, the number of steps is $N = T / \Delta t$.
If $\text{LTE} = O(\Delta t^3)$, the global error scales as:
$$\text{GTE} \approx N \cdot \text{LTE} = \left(\frac{T}{\Delta t}\right) \cdot O(\Delta t^3) = O(\Delta t^2)$$
The global truncation error is **second-order ($O(\Delta t^2)$)**.

---

#### Solution to Exercise 2.2
In algorithmic complexity, $N$ represents the input data size (number of elements to sort, vertices in a graph). As $N \to \infty$, $N^4$ grows vastly faster than $N$, so $O(N)$ is far superior to $O(N^4)$.

In numerical analysis, $\Delta t$ represents the discrete time step, where the goal is to approximate an infinitesimal continuum as $\Delta t \to 0$.
For $\Delta t < 1.0$ (e.g., $\Delta t = 0.01$):
$$\Delta t^4 = 0.00000001 \ll \Delta t = 0.01$$
As $\Delta t \to 0$, higher powers of $\Delta t$ decay to zero orders of magnitude faster than lower powers. Thus, an $O(\Delta t^4)$ method converges to the true physical solution infinitely faster than an $O(\Delta t)$ method.

---

#### Solution to Exercise 2.3
*Part 1: General $k$-th derivative of $x(t) = e^{3t}$:*
$$\dot{x}(t) = 3 e^{3t}, \quad \ddot{x}(t) = 9 e^{3t}, \quad \dots \quad x^{(k)}(t) = 3^k e^{3t}$$

*Part 2: 4th-order Taylor polynomial about $t = 0$:*
At $t = 0$, $x^{(k)}(0) = 3^k$.
$$P_4(\Delta t) = x(0) + \dot{x}(0)\Delta t + \frac{\ddot{x}(0)}{2!}\Delta t^2 + \frac{x^{(3)}(0)}{3!}\Delta t^3 + \frac{x^{(4)}(0)}{4!}\Delta t^4$$
$$P_4(\Delta t) = 1 + 3 \Delta t + \frac{9}{2}\Delta t^2 + \frac{27}{6}\Delta t^3 + \frac{81}{24}\Delta t^4$$
$$P_4(\Delta t) = 1 + 3 \Delta t + 4.5 \Delta t^2 + 4.5 \Delta t^3 + 3.375 \Delta t^4$$

*Part 3: Evaluate at $\Delta t = 0.05\text{ s}$:*
- Exact value:
  $$x_{\text{exact}} = e^{3(0.05)} = e^{0.15} \approx 1.1618342427$$
- Polynomial approximation:
  $$P_4(0.05) = 1 + 3(0.05) + 4.5(0.0025) + 4.5(0.000125) + 3.375(0.00000625)$$
  $$= 1 + 0.15 + 0.01125 + 0.0005625 + 0.00002109375 = 1.1618335938$$
- Truncation Error:
  $$\text{Error} = |1.1618342427 - 1.1618335938| \approx 6.49 \times 10^{-7}$$

---

#### Solution to Exercise 2.4
Given $\ddot{\theta} = -\frac{g}{L} \sin \theta$.
To find jerk $\theta^{(3)} = \frac{d}{dt}(\ddot{\theta})$, differentiate with respect to time using the chain rule:
$$\theta^{(3)} = \frac{d}{dt}\left( -\frac{g}{L} \sin \theta \right) = -\frac{g}{L} \frac{d(\sin \theta)}{dt} = -\frac{g}{L} \left( \cos \theta \frac{d\theta}{dt} \right)$$
Substitute $\frac{d\theta}{dt} = \dot{\theta}$:
$$\theta^{(3)} = -\frac{g}{L} \dot{\theta} \cos \theta$$

*Physical Interpretation:* Angular jerk is maximized when the pendulum passes through the bottom equilibrium ($\theta = 0 \implies \cos \theta = 1$) with maximum angular velocity $\dot{\theta}$. At the turning points ($\dot{\theta} = 0$), angular jerk is zero.

---

#### Solution to Exercise 2.5
*Part 1: Empirical order $p$:*
Timestep halved: $\Delta t_1 = 0.050 \to \Delta t_2 = 0.025 \implies \text{ratio } r = 2.0$.
Error ratio:
$$R = \frac{E_1}{E_2} = \frac{0.125\text{ m}}{0.03125\text{ m}} = 4.0$$
Since $R = r^p \implies 4.0 = 2^p \implies p = 2.0$.
The method is **Order 2**.

*Part 2: Predicted error at $\Delta t = 0.005\text{ s}$:*
Scaling factor relative to $\Delta t_2 = 0.025$:
$$s = \frac{0.005}{0.025} = \frac{1}{5} = 0.2$$
Since $p = 2$, error scales by $s^2 = (0.2)^2 = 0.04$:
$$E_{\text{pred}} = E_2 \times s^2 = 0.03125\text{ m} \times 0.04 = 0.00125\text{ m} = 1.25\text{ mm}$$

---

#### Solution to Exercise 2.6
*The Dahlquist Theorem:* A linear multi-step or numerical discretization method converges to the true continuous solution as $\Delta t \to 0$ if and only if it is both **Consistent** ($\text{LTE} = o(\Delta t)$) and **Zero-Stable** (satisfies root condition).

*Hypothetical Counterexample:*
Consider the multi-step method:
$$y_{n+1} = 3 y_n - 2 y_{n-1} - \frac{1}{2} \Delta t f(y_n)$$
1. Checking consistency: Taylor expanding about $t_n$ shows that the difference equation matches $\dot{y} = f(y)$ up to $O(\Delta t^2)$. The method is consistent!
2. Checking zero-stability: Set $f \equiv 0$, yielding characteristic equation $r^2 - 3r + 2 = 0 \implies (r - 1)(r - 2) = 0$.
The roots are $r_1 = 1$ and $r_2 = 2$.
Because $|r_2| = 2 > 1$, the root lies outside the unit circle!
Any microscopic roundoff error $\epsilon$ is multiplied by $2^n$ on every step:
$$\text{Error}_n \approx \epsilon \cdot 2^n$$
As $\Delta t \to 0$, $n = T / \Delta t \to \infty$, so the error grows to $\epsilon \cdot 2^\infty = \infty$.
Despite being mathematically consistent, the method violently blows up for all non-trivial problems because it lacks zero-stability.

---

#### Solution to Exercise 2.7
Given: $E_{\text{trunc}}(\Delta t) = 2.0 \Delta t$, $E_{\text{round}}(\Delta t) = \epsilon \frac{T}{\Delta t}$, $\epsilon = 1.19 \times 10^{-7}$, $T = 100\text{ s}$.

*Part 1: Total Error function:*
$$E_{\text{total}}(\Delta t) = 2.0 \Delta t + \frac{(1.19 \times 10^{-7})(100)}{\Delta t} = 2.0 \Delta t + \frac{1.19 \times 10^{-5}}{\Delta t}$$

*Part 2: Optimal timestep $\Delta t_{\text{opt}}$:*
Differentiate and set to zero:
$$\frac{dE_{\text{total}}}{d\Delta t} = 2.0 - \frac{1.19 \times 10^{-5}}{\Delta t^2} = 0$$
$$\Delta t^2 = \frac{1.19 \times 10^{-5}}{2.0} = 5.95 \times 10^{-6}$$
$$\Delta t_{\text{opt}} = \sqrt{5.95 \times 10^{-6}} \approx 0.00244\text{ s} \approx 2.44\text{ ms}$$

*Part 3: Minimum achievable error:*
$$E_{\text{min}} = 2.0(0.00244) + \frac{1.19 \times 10^{-5}}{0.00244} = 0.00488 + 0.00488 = 0.00976\text{ m} \approx 9.76\text{ mm}$$

---

#### Solution to Exercise 2.8
When $\Delta t$ is decreased from $10^{-3}\text{ s}$ to $10^{-6}\text{ s}$:
1. The number of steps required to simulate 10 seconds expands from $N = 10,000$ to $N = 10,000,000$ steps.
2. In digital hardware, each step performs floating-point additions ($x_{n+1} = x_n + v \Delta t$).
3. At $\Delta t = 10^{-6}\text{ s}$, the increment $v \Delta t$ is six orders of magnitude smaller than $x_n$.
4. Under IEEE 754 floating-point arithmetic, adding a very small number to a larger number causes **absorption**: the lowest bits of the increment are rounded off and permanently discarded.
5. Furthermore, executing 10 million additions accumulates 10 million independent rounding errors. The roundoff error $E_{\text{round}} \propto N \epsilon_{\text{mach}}$ scales up by a factor of 1,000, vastly exceeding the reduction in truncation error. Consequently, the simulation drifts farther off course.

---

#### Solution to Exercise 2.9
*Proof of General Richardson Extrapolation:*
Let $y_h$ be the numerical solution computed with step size $h$, and $y_{h/2}$ be the solution computed with step size $h/2$.
Since the method is of order $p$, its asymptotic error expansion is:
$$y_h = y_{\text{exact}} + C h^p + O(h^{p+1})$$
For step size $h/2$:
$$y_{h/2} = y_{\text{exact}} + C \left(\frac{h}{2}\right)^p + O(h^{p+1}) = y_{\text{exact}} + \frac{C}{2^p} h^p + O(h^{p+1})$$

Multiply the equation for $y_{h/2}$ by $2^p$:
$$2^p y_{h/2} = 2^p y_{\text{exact}} + C h^p + O(h^{p+1})$$
Subtract the equation for $y_h$:
$$2^p y_{h/2} - y_h = (2^p y_{\text{exact}} - y_{\text{exact}}) + (C h^p - C h^p) + O(h^{p+1})$$
$$2^p y_{h/2} - y_h = (2^p - 1) y_{\text{exact}} + O(h^{p+1})$$

Divide both sides by $2^p - 1$:
$$y_{\text{extrap}} = \frac{2^p y_{h/2} - y_h}{2^p - 1} = y_{\text{exact}} + O(h^{p+1})$$
The $O(h^p)$ error term has been eliminated identically. The resulting estimator is of order $p+1$.
$\blacksquare$

---

#### Solution to Exercise 2.10
Given: $p = 4$, $h = 10.0\text{ s}$, $r_h = 7,000,120.0\text{ m}$, $r_{h/2} = 7,000,007.5\text{ m}$.
Using the Richardson formula for $p = 4$:
$$2^p = 2^4 = 16$$
$$2^p - 1 = 16 - 1 = 15$$

Apply formula:
$$r_{\text{extrap}} = \frac{16 r_{h/2} - r_h}{15} = \frac{16(7,000,007.5) - 7,000,120.0}{15}$$
$$16 \times 7,000,007.5 = 112,000,120.0$$
Subtract $r_h$:
$$112,000,120.0 - 7,000,120.0 = 105,000,000.0$$
Divide by 15:
$$r_{\text{extrap}} = \frac{105,000,000.0}{15} = 7,000,000.0\text{ m}$$

*Conclusion:* The 5th-order accurate radial distance is exactly $7,000,000.0\text{ meters}$ (a clean $7,000\text{ km}$ circular orbit). The $120\text{ m}$ and $7.5\text{ m}$ numerical truncation errors were eliminated cleanly.
