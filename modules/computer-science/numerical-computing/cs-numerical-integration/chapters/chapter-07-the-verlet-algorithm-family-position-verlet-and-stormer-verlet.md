# Chapter 07: The Verlet Algorithm Family — Position Verlet & Størmer-Verlet

> *"When Carl Størmer tracked the paths of electrons dancing in Earth's auroras in 1907, and Loup Verlet modeled the thermodynamic chaos of liquid argon in 1967, they relied on a profound mathematical cancellation: by adding the Taylor expansion of the future to the Taylor expansion of the past, every odd derivative vanishes into thin air. From this symmetric union arises Position Verlet: second-order accurate, time-reversible, and rock-solid."*

---

### 7.1 The Historical Lineage: From Auroras to Molecular Dynamics

In the early 20th century, Norwegian mathematician and geophysicist Carl Størmer was obsessed with explaining the Northern Lights (Aurora Borealis). Charged electrons ejected from the Sun spiral through Earth's non-uniform dipole magnetic field:

$$m \frac{d^2 \mathbf{r}}{dt^2} = q \left( \frac{d\mathbf{r}}{dt} \times \mathbf{B}(\mathbf{r}) \right)$$

Solving this equation across thousands of kilometers required calculating thousands of orbital steps by hand. In 1907, Størmer developed a symmetric, second-order finite difference formula that eliminated odd-order velocity terms.

Six decades later, in 1967, French physicist Loup Verlet was pioneering the newborn field of **Molecular Dynamics (MD)** at the Université de Paris. Verlet sought to simulate the thermodynamic behavior of hundreds of interacting Argon atoms modeled by the Lennard-Jones 12-6 potential:

$$V(r) = 4\epsilon \left[ \left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^6 \right]$$

Verlet needed an algorithm that was:
1. Fast enough to run on early mainframe computers (an IBM 7090 with 32 KB of magnetic-core memory).
2. Unconditionally stable over hundreds of thousands of atomic collisions without energy drift.
3. Completely time-reversible.

Verlet rediscovered Størmer's symmetric formulation, which has since been immortalized throughout computer science as the **Verlet Algorithm** (or **Position Verlet / Størmer-Verlet**).

---

### 7.2 Mathematical Derivation: The Odd-Derivative Cancellation

The mathematical beauty of Position Verlet lies in a simple algebraic trick: **adding the forward Taylor expansion of position to the backward Taylor expansion of position**.

Let $\mathbf{x}(t)$ represent the position of a particle at time $t$. We expand $\mathbf{x}(t + \Delta t)$ forward in time using Taylor series:

$$\mathbf{x}(t + \Delta t) = \mathbf{x}(t) + \dot{\mathbf{x}}(t) \Delta t + \frac{1}{2!} \ddot{\mathbf{x}}(t) \Delta t^2 + \frac{1}{3!} \mathbf{x}^{(3)}(t) \Delta t^3 + \frac{1}{4!} \mathbf{x}^{(4)}(t) \Delta t^4 + O(\Delta t^5) \quad \text{--- (Eq. 1)}$$

Next, we expand $\mathbf{x}(t - \Delta t)$ backward in time:

$$\mathbf{x}(t - \Delta t) = \mathbf{x}(t) - \dot{\mathbf{x}}(t) \Delta t + \frac{1}{2!} \ddot{\mathbf{x}}(t) \Delta t^2 - \frac{1}{3!} \mathbf{x}^{(3)}(t) \Delta t^3 + \frac{1}{4!} \mathbf{x}^{(4)}(t) \Delta t^4 + O(\Delta t^5) \quad \text{--- (Eq. 2)}$$

#### The Grand Addition
Add Eq. 1 and Eq. 2 together:

$$\mathbf{x}(t + \Delta t) + \mathbf{x}(t - \Delta t) = 2\mathbf{x}(t) + 2 \cdot \left( \frac{1}{2!} \ddot{\mathbf{x}}(t) \Delta t^2 \right) + 2 \cdot \left( \frac{1}{4!} \mathbf{x}^{(4)}(t) \Delta t^4 \right) + O(\Delta t^6)$$

Look closely at what occurred:
- The velocity term $+\dot{\mathbf{x}}\Delta t$ canceled $-\dot{\mathbf{x}}\Delta t$ identically!
- The jerk term $+\frac{1}{6}\mathbf{x}^{(3)}\Delta t^3$ canceled $-\frac{1}{6}\mathbf{x}^{(3)}\Delta t^3$ identically!
- **Every odd derivative term canceled to zero!**

Simplifying:

$$\mathbf{x}(t + \Delta t) + \mathbf{x}(t - \Delta t) = 2\mathbf{x}(t) + \mathbf{a}(t) \Delta t^2 + O(\Delta t^4)$$

Isolating the future position $\mathbf{x}(t + \Delta t) \equiv \mathbf{x}_{n+1}$:

$$\mathbf{\mathbf{x}_{n+1} = 2\mathbf{x}_n - \mathbf{x}_{n-1} + \mathbf{a}(\mathbf{x}_n) \Delta t^2 + O(\Delta t^4)}$$

Where:
- $\mathbf{x}_{n+1}$: The position at the next tick ($t_{n+1} = t + \Delta t$).
- $\mathbf{x}_n$: The current position ($t_n = t$).
- $\mathbf{x}_{n-1}$: The previous position ($t_{n-1} = t - \Delta t$).
- $\mathbf{a}(\mathbf{x}_n) = \frac{\mathbf{F}(\mathbf{x}_n)}{m}$: The acceleration evaluated at the current position.

```
+-------------------------------------------------------------------------+
|                  THE POSITION VERLET DISCRETE MAPPING                   |
+-------------------------------------------------------------------------+
|                                                                         |
|            x_{n+1}  =  2 * x_n  -  x_{n-1}  +  a(x_n) * dt^2            |
|                                                                         |
|  Local Truncation Error (LTE):   O(dt^4)                                |
|  Global Truncation Error (GTE):  O(dt^2)  [Second-Order Accurate]       |
|                                                                         |
+-------------------------------------------------------------------------+
```

Because the first discarded term in the addition was $\frac{2}{24} \mathbf{x}^{(4)}\Delta t^4$, the **Local Truncation Error (LTE) of Position Verlet is fourth-order: $O(\Delta t^4)$**!
Accumulating across $N = T / \Delta t$ steps yields a **Global Truncation Error (GTE) of second-order: $O(\Delta t^2)$**.

---

### 7.3 Fundamental Properties: Time-Reversibility and Symplecticity

#### 1. Exact Time-Reversibility (Microscopic Invariance)
In continuous Hamiltonian mechanics, the laws of physics are invariant under time reversal: if you reverse all particle velocities at an instant $t_1$, the universe retraces its past trajectory identically back to $t_0$.

Position Verlet preserves this physical symmetry **down to the very last bit**.
Rearrange the Verlet formula to solve for the past position $\mathbf{x}_{n-1}$:

$$\mathbf{x}_{n-1} = 2\mathbf{x}_n - \mathbf{x}_{n+1} + \mathbf{a}(\mathbf{x}_n) \Delta t^2$$

Notice that this equation is algebraically identical to the forward equation, with indices $n+1$ and $n-1$ exchanged!
If a simulation executes 10,000 steps forward, and you invert the historical time step ($\Delta t \to -\Delta t$), Position Verlet will re-trace its trajectory backward with zero numerical drift!

#### 2. Symplectic Geometry in Configuration Space
While Position Verlet is formulated as a three-term recurrence on positions $(\mathbf{x}_{n-1}, \mathbf{x}_n, \mathbf{x}_{n+1})$, it can be mapped into phase space $(\mathbf{x}_n, \mathbf{p}_n)$. The state transition matrix in phase space satisfies $\mathbf{M}^T \mathbf{J} \mathbf{M} \equiv \mathbf{J}$.
It conserves a second-order Shadow Hamiltonian:

$$\tilde{\mathcal{H}} = \mathcal{H} + \Delta t^2 \mathcal{H}_2 + O(\Delta t^4)$$

It never expands or decays in energy; orbits remain stable across astronomical timeframes.

---

### 7.4 The Dilemma of Position Verlet: The Missing Velocity

Despite its mathematical elegance, standard Position Verlet contains a glaring engineering defect that frustrates game developers:
**Velocity does not exist in the formula!**

The recurrence relation calculates $\mathbf{x}_{n+1}$ using only $\mathbf{x}_n$, $\mathbf{x}_{n-1}$, and $\mathbf{a}_n$.
This raises two critical practical dilemmas:

#### Dilemma 1: How Do We Reconstruct Velocity?
In games, graphics, and scientific analysis, we constantly need velocity:
- To calculate kinetic energy: $T = \frac{1}{2} m \|\mathbf{v}\|^2$.
- To render motion blur on modern GPUs.
- To compute aerodynamic sound effects.
- To detect relative collision speeds.

To reconstruct velocity at tick $n$, we subtract Eq. 2 from Eq. 1:

$$\mathbf{x}(t + \Delta t) - \mathbf{x}(t - \Delta t) = 2 \dot{\mathbf{x}}(t) \Delta t + \frac{2}{3!} \mathbf{x}^{(3)}(t) \Delta t^3 + O(\Delta t^5)$$

Dividing by $2\Delta t$ yields the **Central Difference Velocity**:

$$\mathbf{v}_n = \frac{\mathbf{x}_{n+1} - \mathbf{x}_{n-1}}{2\Delta t} + O(\Delta t^2)$$

*The Catch:* Notice that $\mathbf{v}_n$ requires knowledge of $\mathbf{x}_{n+1}$!
You cannot know the current velocity $\mathbf{v}_n$ until **after the future position $\mathbf{x}_{n+1}$ has already been calculated**! The velocity is always trailing one step behind the spatial update.

#### Dilemma 2: The Inability to Handle Velocity-Dependent Drag
What happens if the force depends on velocity, such as fluid drag:

$$\mathbf{F} = -k \|\mathbf{v}\| \mathbf{v}$$

To compute acceleration $\mathbf{a}(\mathbf{x}_n, \mathbf{v}_n)$, we need $\mathbf{v}_n$. But $\mathbf{v}_n$ requires $\mathbf{x}_{n+1}$, which itself requires $\mathbf{a}_n$!
This creates a circular dependency:
$$\mathbf{x}_{n+1} \implies \mathbf{v}_n \implies \mathbf{a}_n \implies \mathbf{x}_{n+1}$$
Handling velocity-dependent forces in Position Verlet requires iterative approximation or complex extrapolation, degrading the clean beauty of the algorithm.

#### Dilemma 3: The Bootstrapping Problem
At the very beginning of a simulation ($t = 0$), the user provides the initial position $\mathbf{x}_0$ and initial velocity $\mathbf{v}_0$.
To compute $\mathbf{x}_1$, Position Verlet requires $\mathbf{x}_0$ and **$\mathbf{x}_{-1}$ (the position one step in the past!)**:

$$\mathbf{x}_1 = 2\mathbf{x}_0 - \mathbf{x}_{-1} + \mathbf{a}(\mathbf{x}_0) \Delta t^2$$

Where does $\mathbf{x}_{-1}$ come from? It does not exist in memory!
To bootstrap the algorithm, we must synthesize $\mathbf{x}_{-1}$ using a backward Taylor expansion:

$$\mathbf{x}_{-1} = \mathbf{x}_0 - \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a}(\mathbf{x}_0) \Delta t^2$$

Substituting this into the Verlet equation for step 1 yields:

$$\mathbf{x}_1 = 2\mathbf{x}_0 - \left( \mathbf{x}_0 - \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a}_0 \Delta t^2 \right) + \mathbf{a}_0 \Delta t^2$$

$$\mathbf{\mathbf{x}_1 = \mathbf{x}_0 + \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a}(\mathbf{x}_0) \Delta t^2}$$

Step 1 must be initialized with the standard Galilean kinematic formula!

---

### 7.5 Ten In-Depth Progressive Worked Examples

#### Example 7.1: Bootstrapping and First Step of Position Verlet
*Scenario:* A projectile of mass $m = 1.0\text{ kg}$ is launched in 1D under constant gravity: $a = -9.8\text{ m/s}^2$.
Initial conditions: $x_0 = 100.0\text{ m}$, $v_0 = 20.0\text{ m/s}$. Step size $\Delta t = 0.1\text{ s}$.
1. Calculate the synthetic historical position $x_{-1}$.
2. Compute $x_1$ and $x_2$ using Position Verlet.
3. Compare with the exact analytical trajectory.

*Step 1: Compute $x_{-1}$:*
$$x_{-1} = x_0 - v_0 \Delta t + \frac{1}{2} a_0 \Delta t^2$$
$$x_{-1} = 100.0 - (20.0)(0.1) + \frac{1}{2}(-9.8)(0.1)^2 = 100.0 - 2.0 - 0.049 = 97.951\text{ m}$$

*Step 2: Compute $x_1$ via Position Verlet:*
$$x_1 = 2 x_0 - x_{-1} + a_0 \Delta t^2$$
$$x_1 = 2(100.0) - 97.951 + (-9.8)(0.01) = 200.0 - 97.951 - 0.098 = 101.951\text{ m}$$
Exact check: $x_{\text{exact}}(0.1) = 100 + 20(0.1) - 4.9(0.01) = 100 + 2.0 - 0.049 = 101.951\text{ m}$ (Exact match!).

*Step 3: Compute $x_2$ via Position Verlet:*
Since gravity is constant, $a_1 = -9.8\text{ m/s}^2$:
$$x_2 = 2 x_1 - x_0 + a_1 \Delta t^2$$
$$x_2 = 2(101.951) - 100.0 + (-9.8)(0.01) = 203.902 - 100.0 - 0.098 = 103.804\text{ m}$$
Exact check: $x_{\text{exact}}(0.2) = 100 + 20(0.2) - 4.9(0.04) = 100 + 4.0 - 0.196 = 103.804\text{ m}$ (Exact match!).

*Conclusion:* For constant acceleration, Position Verlet is **100% exact** because all derivatives beyond $\ddot{\mathbf{x}}$ are identically zero.

---

#### Example 7.2: Single Position Verlet Step on a Harmonic Oscillator
*Scenario:* An oscillator has $\omega = 10.0\text{ rad/s}$.
At $t = 0$, $x_0 = 1.0\text{ m}$, $v_0 = 0.0\text{ m/s}$. Step size $\Delta t = 0.05\text{ s}$.
1. Compute $x_{-1}$.
2. Compute $x_1$ and reconstructed velocity $v_0$.
3. Compute $x_2$.

*Step 1: Compute $x_{-1}$:*
$a_0 = -\omega^2 x_0 = -(100.0)(1.0) = -100.0\text{ m/s}^2$.
$$x_{-1} = x_0 - v_0 \Delta t + \frac{1}{2} a_0 \Delta t^2 = 1.0 - 0 + \frac{1}{2}(-100.0)(0.05)^2 = 1.0 - 0.125 = 0.875\text{ m}$$

*Step 2: Compute $x_1$:*
$$x_1 = 2 x_0 - x_{-1} + a_0 \Delta t^2 = 2(1.0) - 0.875 + (-100.0)(0.0025) = 2.0 - 0.875 - 0.250 = 0.875\text{ m}$$

*Step 3: Reconstruct velocity $v_0$ via central difference:*
$$v_0 = \frac{x_1 - x_{-1}}{2\Delta t} = \frac{0.875 - 0.875}{2(0.05)} = \frac{0.000}{0.10} = 0.000\text{ m/s}$$
Matches the initial condition $v_0 = 0$ with zero error!

*Step 4: Compute $x_2$:*
Acceleration at $x_1$: $a_1 = -\omega^2 x_1 = -100.0(0.875) = -87.5\text{ m/s}^2$.
$$x_2 = 2 x_1 - x_0 + a_1 \Delta t^2 = 2(0.875) - 1.0 + (-87.5)(0.0025) = 1.750 - 1.0 - 0.21875 = 0.53125\text{ m}$$
Exact check: $x_{\text{exact}}(0.10) = \cos(10 \times 0.1) = \cos(1.0\text{ rad}) \approx 0.54030\text{ m}$.
Error = $|0.54030 - 0.53125| = 0.00905\text{ m}$ ($0.9\%$).

---

#### Example 7.3: Verifying Time-Reversibility Across 3 Steps
*Scenario:* Take the trajectory from Example 7.2:
$x_0 = 1.000\text{ m}$, $x_1 = 0.875\text{ m}$, $x_2 = 0.53125\text{ m}$.
Using only the positions $x_2$ and $x_1$, execute the inverted Verlet formula to step backward in time and verify that $x_0$ is recovered with zero error.

*Step 1: Set up the time-reversed Verlet formula:*
From $x_{n+1} = 2x_n - x_{n-1} + a_n \Delta t^2$, solve for $x_{n-1}$:
$$x_{n-1} = 2 x_n - x_{n+1} + a_n \Delta t^2$$
To find $x_0$, set $n = 1$:
$$x_0 = 2 x_1 - x_2 + a_1 \Delta t^2$$

*Step 2: Evaluate with numbers:*
$x_1 = 0.875\text{ m}$.
$x_2 = 0.53125\text{ m}$.
$a_1 = -\omega^2 x_1 = -100(0.875) = -87.5\text{ m/s}^2$.
$$x_0 = 2(0.875) - 0.53125 + (-87.5)(0.0025)$$
$$x_0 = 1.750 - 0.53125 - 0.21875 = 1.750 - 0.750 = \mathbf{1.000000\text{ m}}$$

*Conclusion:* The initial position $x_0 = 1.000000\text{ m}$ is recovered **with bit-for-bit exactness**! Position Verlet has zero chronological entropy.

---

#### Example 7.4: Reconstructing Velocity and Kinetic Energy
*Scenario:* An engine using Position Verlet records:
$x_{n-1} = 12.40\text{ m}$ at $t = 0.08\text{ s}$.
$x_n = 13.80\text{ m}$ at $t = 0.10\text{ s}$.
$x_{n+1} = 15.00\text{ m}$ at $t = 0.12\text{ s}$.
Step size $\Delta t = 0.02\text{ s}$, mass $m = 2.0\text{ kg}$, spring constant $k = 50.0\text{ N/m}$.
1. Compute the reconstructed velocity $v_n$.
2. Compute the kinetic energy $T_n$, potential energy $V_n$, and total mechanical energy $E_n$.

*Step 1: Reconstruct velocity $v_n$ via central difference:*
$$v_n = \frac{x_{n+1} - x_{n-1}}{2\Delta t} = \frac{15.00\text{ m} - 12.40\text{ m}}{2(0.02\text{ s})} = \frac{2.60\text{ m}}{0.04\text{ s}} = 65.0\text{ m/s}$$

*Step 2: Compute energies:*
- Kinetic Energy:
  $$T_n = \frac{1}{2} m v_n^2 = \frac{1}{2}(2.0\text{ kg})(65.0\text{ m/s})^2 = 4,225.0\text{ J}$$
- Potential Energy:
  $$V_n = \frac{1}{2} k x_n^2 = \frac{1}{2}(50.0\text{ N/m})(13.80\text{ m})^2 = 25.0 \times 190.44 = 4,761.0\text{ J}$$
- Total Mechanical Energy:
  $$E_n = T_n + V_n = 4,225.0 + 4,761.0 = 8,986.0\text{ J}$$

---

#### Example 7.5: Proving the Fourth-Order Local Truncation Error (LTE)
*Scenario:* Analytically derive the exact leading error term of Position Verlet by taking the difference between the true Taylor expansion and the Verlet update.

*Step 1: Write forward and backward Taylor expansions up to 6th order:*
$$\mathbf{x}(t + \Delta t) = \mathbf{x} + \dot{\mathbf{x}}\Delta t + \frac{1}{2}\ddot{\mathbf{x}}\Delta t^2 + \frac{1}{6}\mathbf{x}^{(3)}\Delta t^3 + \frac{1}{24}\mathbf{x}^{(4)}\Delta t^4 + \frac{1}{120}\mathbf{x}^{(5)}\Delta t^5 + \frac{1}{720}\mathbf{x}^{(6)}\Delta t^6 + \dots$$
$$\mathbf{x}(t - \Delta t) = \mathbf{x} - \dot{\mathbf{x}}\Delta t + \frac{1}{2}\ddot{\mathbf{x}}\Delta t^2 - \frac{1}{6}\mathbf{x}^{(3)}\Delta t^3 + \frac{1}{24}\mathbf{x}^{(4)}\Delta t^4 - \frac{1}{120}\mathbf{x}^{(5)}\Delta t^5 + \frac{1}{720}\mathbf{x}^{(6)}\Delta t^6 + \dots$$

*Step 2: Add the two equations:*
$$\mathbf{x}(t + \Delta t) + \mathbf{x}(t - \Delta t) = 2\mathbf{x} + \ddot{\mathbf{x}}\Delta t^2 + \frac{1}{12}\mathbf{x}^{(4)}\Delta t^4 + \frac{1}{360}\mathbf{x}^{(6)}\Delta t^6 + O(\Delta t^8)$$

*Step 3: Solve for $\mathbf{x}(t + \Delta t)$:*
$$\mathbf{x}(t + \Delta t) = 2\mathbf{x}(t) - \mathbf{x}(t - \Delta t) + \mathbf{a}(t)\Delta t^2 + \frac{1}{12}\mathbf{x}^{(4)}(t)\Delta t^4 + O(\Delta t^6)$$

*Step 4: Subtract Position Verlet formula:*
$$\mathbf{x}_{\text{Verlet}} = 2\mathbf{x}(t) - \mathbf{x}(t - \Delta t) + \mathbf{a}(t)\Delta t^2$$
$$\text{LTE} = \|\mathbf{x}(t + \Delta t) - \mathbf{x}_{\text{Verlet}}\| = \frac{1}{12} \|\mathbf{x}^{(4)}(t)\| \Delta t^4 + O(\Delta t^6)$$
$\blacksquare$ The local truncation error is proven to be **strictly $O(\Delta t^4)$ with exact coefficient $\frac{1}{12}\mathbf{x}^{(4)}$**.

---

#### Example 7.6: Central Difference Velocity Truncation Error
*Scenario:* Prove that the central difference velocity formula $\mathbf{v}_n = \frac{\mathbf{x}_{n+1} - \mathbf{x}_{n-1}}{2\Delta t}$ has a truncation error of $O(\Delta t^2)$.

*Step 1: Subtract backward expansion from forward expansion:*
$$\mathbf{x}(t + \Delta t) - \mathbf{x}(t - \Delta t) = 2\dot{\mathbf{x}}(t)\Delta t + \frac{2}{3!}\mathbf{x}^{(3)}(t)\Delta t^3 + \frac{2}{5!}\mathbf{x}^{(5)}(t)\Delta t^5 + O(\Delta t^7)$$
$$\mathbf{x}(t + \Delta t) - \mathbf{x}(t - \Delta t) = 2\mathbf{v}(t)\Delta t + \frac{1}{3}\mathbf{x}^{(3)}(t)\Delta t^3 + O(\Delta t^5)$$

*Step 2: Divide by $2\Delta t$:*
$$\frac{\mathbf{x}(t + \Delta t) - \mathbf{x}(t - \Delta t)}{2\Delta t} = \mathbf{v}(t) + \frac{1}{6}\mathbf{x}^{(3)}(t)\Delta t^2 + O(\Delta t^4)$$

*Step 3: Evaluate error:*
$$\mathbf{E}_{\text{vel}} = \left\| \mathbf{v}(t) - \frac{\mathbf{x}_{n+1} - \mathbf{x}_{n-1}}{2\Delta t} \right\| = \frac{1}{6} \|\mathbf{x}^{(3)}(t)\| \Delta t^2 + O(\Delta t^4)$$
$\blacksquare$ The velocity approximation is second-order accurate ($O(\Delta t^2)$) with leading error proportional to the physical Jerk $\mathbf{x}^{(3)}$.

---

#### Example 7.7: Position Verlet Planetary Orbit Precession
*Scenario:* A satellite in orbit has radial distance $r = 10,000\text{ km}$, orbital period $T = 10,000\text{ s}$.
Explain why Position Verlet maintains a rock-solid semi-major axis over 100,000 orbits, and calculate the maximum radial deviation $\Delta r$ during a single step of $\Delta t = 10.0\text{ s}$.

*Step 1: Keplerian acceleration:*
$$a = \frac{G M}{r^2} = \frac{3.986 \times 10^{14}}{(10^7)^2} = 3.986\text{ m/s}^2$$

*Step 2: Evaluate 4th-order local truncation error:*
From Example 7.5, $\text{LTE} = \frac{1}{12} r^{(4)} \Delta t^4$.
For a circular orbit: $r^{(4)} = \omega^4 r$.
$$\omega = \frac{2\pi}{T} = \frac{2\pi}{10,000} \approx 6.283 \times 10^{-4}\text{ rad/s}$$
$$\omega^4 = (6.283 \times 10^{-4})^4 \approx 1.557 \times 10^{-13}\text{ s}^{-4}$$
$$r^{(4)} = (1.557 \times 10^{-13})(10^7\text{ m}) \approx 1.557 \times 10^{-6}\text{ m/s}^4$$

*Step 3: Compute LTE displacement:*
$$\text{LTE} = \frac{1}{12}(1.557 \times 10^{-6}\text{ m/s}^4)(10.0\text{ s})^4 = \frac{1}{12}(1.557 \times 10^{-6})(10,000) = \frac{0.01557\text{ m}}{12} \approx 0.0013\text{ m} = 1.3\text{ mm}$$

*Conclusion:* In a single 10-second step across a $10,000\text{ km}$ orbit, the truncation error is just **1.3 millimeters**! Because the algorithm is symplectic, these millimeter perturbations do not accumulate radially, ensuring eternal orbital stability.

---

#### Example 7.8: Position-Based Dynamics (PBD) Constraint Projection
*Scenario:* In a cloth simulation, two vertices $A$ and $B$ are connected by a rigid distance constraint: $\|\mathbf{x}_A - \mathbf{x}_B\| = d_0 = 1.0\text{ m}$.
After a Position Verlet step, external forces have stretched the distance to $d = 1.20\text{ m}$.
Assuming equal masses ($m_A = m_B$), calculate the instantaneous positional correction $\Delta \mathbf{x}_A$ and $\Delta \mathbf{x}_B$ that restores the constraint without modifying velocities.

*Step 1: Constraint function:*
$$C(\mathbf{x}_A, \mathbf{x}_B) = \|\mathbf{x}_A - \mathbf{x}_B\| - d_0 = 1.20 - 1.00 = +0.20\text{ m}$$

*Step 2: Position-Based Dynamics (Müller et al., 2007) correction formula:*
$$\Delta \mathbf{x}_A = -\frac{w_A}{w_A + w_B} C(\mathbf{x}_A, \mathbf{x}_B) \mathbf{n}_{AB}$$
$$\Delta \mathbf{x}_B = +\frac{w_B}{w_A + w_B} C(\mathbf{x}_A, \mathbf{x}_B) \mathbf{n}_{AB}$$
Where $w_i = 1/m_i$ are inverse masses, and $\mathbf{n}_{AB} = \frac{\mathbf{x}_A - \mathbf{x}_B}{\|\mathbf{x}_A - \mathbf{x}_B\|}$ is the unit constraint direction.

*Step 3: Evaluate with equal masses ($w_A = w_B = 1$):*
$$\Delta \mathbf{x}_A = -\frac{1}{2}(0.20\text{ m})\mathbf{n}_{AB} = -0.10 \mathbf{n}_{AB}\text{ m}$$
$$\Delta \mathbf{x}_B = +\frac{1}{2}(0.20\text{ m})\mathbf{n}_{AB} = +0.10 \mathbf{n}_{AB}\text{ m}$$

*Significance in Position Verlet:* Because Position Verlet stores $\mathbf{x}_n$ and $\mathbf{x}_{n-1}$, projecting positions directly updates the effective velocity automatically on the next step:
$$\mathbf{v}_{\text{eff}} = \frac{\mathbf{x}_{\text{corrected}} - \mathbf{x}_{n-1}}{\Delta t}$$
This makes Position Verlet the ultimate native foundation for modern **Position-Based Dynamics (PBD)** cloth and soft-body engines!

---

#### Example 7.9: Memory Footprint of Position Verlet vs. State-Space Integrators
*Scenario:* A game engine simulates $N = 100,000$ particles in 3D.
- Method A (State-Space: Semi-Implicit Euler): Stores `pos` $(x, y, z)$ and `vel` $(v_x, v_y, v_z)$.
- Method B (Position Verlet): Stores `pos` $(x, y, z)$ and `prev_pos` $(x_{\text{prev}}, y_{\text{prev}}, z_{\text{prev}})$.
Compare the memory layout and footprint of both methods.

*Step 1: Degrees of freedom per particle:*
- Method A: 3 floats for position + 3 floats for velocity = 6 `Float64` values = 48 bytes.
- Method B: 3 floats for current position + 3 floats for previous position = 6 `Float64` values = 48 bytes.

*Step 2: Total memory:*
$$\text{Memory} = 100,000 \times 48\text{ bytes} = 4,800,000\text{ bytes} \approx 4.8\text{ MB}$$

*Conclusion:* Both methods consume the exact same memory footprint. In Position Verlet, the `prev_pos` array replaces the velocity array, serving as a historical momentum buffer.

---

#### Example 7.10: Complete TypeScript Implementation of Position Verlet
*Scenario:* Write a clean, typed TypeScript class `PositionVerletSolver` implementing the Størmer-Verlet algorithm with bootstrapping and central-difference velocity accessors.

```typescript
export class PositionVerletSolver {
  public readonly count: number;
  public readonly posX: Float64Array;
  public readonly posY: Float64Array;
  public readonly prevPosX: Float64Array;
  public readonly prevPosY: Float64Array;
  public readonly accelX: Float64Array;
  public readonly accelY: Float64Array;

  constructor(count: number) {
    this.count = count;
    this.posX = new Float64Array(count);
    this.posY = new Float64Array(count);
    this.prevPosX = new Float64Array(count);
    this.prevPosY = new Float64Array(count);
    this.accelX = new Float64Array(count);
    this.accelY = new Float64Array(count);
  }

  // Bootstrap initial historical state x_{-1} from x_0 and v_0
  public bootstrap(index: number, x0: number, y0: number, vx0: number, vy0: number, dt: number): void {
    this.posX[index] = x0;
    this.posY[index] = y0;
    
    // x_{-1} = x_0 - v_0 * dt + 0.5 * a_0 * dt^2
    const dtSqHalf = 0.5 * dt * dt;
    this.prevPosX[index] = x0 - vx0 * dt + this.accelX[index] * dtSqHalf;
    this.prevPosY[index] = y0 - vy0 * dt + this.accelY[index] * dtSqHalf;
  }

  // Core Position Verlet update step
  public step(dt: number): void {
    const N = this.count;
    const dtSq = dt * dt;

    for (let i = 0; i < N; i++) {
      const currX = this.posX[i];
      const currY = this.posY[i];
      const prevX = this.prevPosX[i];
      const prevY = this.prevPosY[i];

      // x_{n+1} = 2 * x_n - x_{n-1} + a_n * dt^2
      const nextX = 2.0 * currX - prevX + this.accelX[i] * dtSq;
      const nextY = 2.0 * currY - prevY + this.accelY[i] * dtSq;

      // Shift chronological history
      this.prevPosX[i] = currX;
      this.prevPosY[i] = currY;
      this.posX[i] = nextX;
      this.posY[i] = nextY;
    }
  }

  // Reconstruct velocity at tick n via central difference
  public getReconstructedVelocity(index: number, dt: number): { vx: number; vy: number } {
    // v_n = (x_{n+1} - x_{n-1}) / (2 * dt)
    return {
      vx: (this.posX[index] - this.prevPosX[index]) / (2.0 * dt),
      vy: (this.posY[index] - this.prevPosY[index]) / (2.0 * dt)
    };
  }
}
```

---

### 7.6 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 7.1 – 7.2)

##### Exercise 7.1
Explain why adding the forward Taylor expansion $\mathbf{x}(t + \Delta t)$ to the backward Taylor expansion $\mathbf{x}(t - \Delta t)$ causes all odd derivative terms to cancel identically. What is the leading local truncation error term of Position Verlet?

##### Exercise 7.2
Define the **Bootstrapping Problem** in Position Verlet. Why cannot a simulation execute its very first step of Position Verlet with only $\mathbf{x}_0$ and $\mathbf{v}_0$? How is this dilemma resolved?

---

#### Tier 2: Mathematical Derivations & Accuracy (Exercises 7.3 – 7.4)

##### Exercise 7.3
A body moves in 1D under quadratic drag: $a(v) = -k v^2$.
Explain why Position Verlet cannot directly evaluate $a(v)$ at tick $n$ without resorting to approximations. Why does the absence of explicit velocity in the state update create a circular dependency?

##### Exercise 7.4
Prove that Position Verlet is **time-reversible**: show that if a simulation state is evolved forward by one step, and the formula is solved for the preceding state $\mathbf{x}_{n-1}$, the exact numerical value of $\mathbf{x}_{n-1}$ is recovered without error.

---

#### Tier 3: Velocity Reconstruction & Energy Tracking (Exercises 7.5 – 7.6)

##### Exercise 7.5
An engine records particle positions at three consecutive ticks:
$x_{n-1} = 4.20\text{ m}$, $x_n = 5.10\text{ m}$, $x_{n+1} = 5.80\text{ m}$ with $\Delta t = 0.05\text{ s}$.
1. Calculate the central difference velocity $v_n$.
2. Calculate the backward difference velocity $v_{\text{back}} = \frac{x_n - x_{n-1}}{\Delta t}$ and forward difference velocity $v_{\text{fwd}} = \frac{x_{n+1} - x_n}{\Delta t}$.
3. Show that $v_n$ is the exact arithmetic mean of $v_{\text{back}}$ and $v_{\text{fwd}}$.

##### Exercise 7.6
A mass $m = 0.5\text{ kg}$ is attached to a spring $k = 200.0\text{ N/m}$ ($\omega = 20.0\text{ rad/s}$).
At $t = 0$, $x_0 = 0.2\text{ m}, v_0 = 0.0\text{ m/s}$.
Using Position Verlet with $\Delta t = 0.025\text{ s}$, compute $x_{-1}$, $x_1$, and $x_2$.

---

#### Tier 4: Position-Based Dynamics & Constraints (Exercises 7.7 – 7.8)

##### Exercise 7.7
Explain why Position Verlet is the preferred foundation for **Position-Based Dynamics (PBD)** in video game cloth and rope simulation, whereas Velocity Verlet is preferred for rigid body contact solvers.

##### Exercise 7.8
In a molecular dynamics simulation of liquid Argon, an atom experiences a sudden repulsive force spike from a neighbor. Explain why Position Verlet remains numerically stable under this spike, whereas Forward Euler would immediately eject the atom from the simulation box.

---

#### Tier 5: Symplectic Invariants & Phase Space (Exercises 7.9 – 7.10)

##### Exercise 7.9
Prove that by defining an auxiliary momentum variable $p_n = m \frac{x_n - x_{n-1}}{\Delta t} + \frac{1}{2} F(x_n)\Delta t$, Position Verlet can be rewritten as a 2D phase-space symplectic mapping $\begin{bmatrix} x_{n+1} \\ p_{n+1} \end{bmatrix} = \Phi\begin{bmatrix} x_n \\ p_n \end{bmatrix}$.

##### Exercise 7.10
A planetary orbit simulated with Position Verlet has period $T = 365\text{ days}$.
If the timestep is $\Delta t = 1.0\text{ day}$, calculate the ratio of the 4th-order LTE to the orbital radius $r = 1.5 \times 10^{11}\text{ m}$. Verify that the relative truncation error per step is less than $10^{-9}$.

---

### 7.7 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 7.1
*Odd Derivative Cancellation:*
The forward Taylor expansion contains powers $(+\Delta t)^k$, which are positive for all $k$.
The backward Taylor expansion contains powers $(-\Delta t)^k$.
- When $k$ is even ($k = 2, 4, 6$), $(-\Delta t)^k = +\Delta t^k$. The terms add together: $+\Delta t^k + \Delta t^k = 2\Delta t^k$.
- When $k$ is odd ($k = 1, 3, 5$), $(-\Delta t)^k = -\Delta t^k$. The terms subtract: $+\Delta t^k - \Delta t^k \equiv 0$.
All odd derivative terms (velocity $\dot{\mathbf{x}}\Delta t$, jerk $\mathbf{x}^{(3)}\Delta t^3$, crackle $\mathbf{x}^{(5)}\Delta t^5$) cancel identically to zero.

*Leading LTE Term:*
The first non-canceling error term in the addition is:
$$\text{LTE} = \frac{2}{4!} \mathbf{x}^{(4)} \Delta t^4 = \frac{1}{12} \mathbf{x}^{(4)} \Delta t^4 = O(\Delta t^4)$$
The local truncation error is fourth-order.

---

#### Solution to Exercise 7.2
*The Bootstrapping Problem:*
The Position Verlet formula is a two-step recurrence relation:
$$\mathbf{x}_{n+1} = 2\mathbf{x}_n - \mathbf{x}_{n-1} + \mathbf{a}_n \Delta t^2$$
To calculate the state at tick $n = 1$ ($\mathbf{x}_1$), the formula requires:
$$\mathbf{x}_1 = 2\mathbf{x}_0 - \mathbf{x}_{-1} + \mathbf{a}_0 \Delta t^2$$
However, at the beginning of a simulation ($t = 0$), the user provides the initial physical state as position $\mathbf{x}_0$ and velocity $\mathbf{v}_0$. The fictitious past state $\mathbf{x}_{-1}$ (position at $t = -\Delta t$) does not exist in memory.

*Resolution:*
We synthesize $\mathbf{x}_{-1}$ using a second-order backward Taylor expansion:
$$\mathbf{x}_{-1} = \mathbf{x}_0 - \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a}(\mathbf{x}_0) \Delta t^2$$
Substituting this into the Verlet equation for step 1 yields:
$$\mathbf{x}_1 = \mathbf{x}_0 + \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a}_0 \Delta t^2$$
The engine bootstraps the first step with the exact Galilean kinematic equation, after which standard two-step Position Verlet proceeds normally.

---

#### Solution to Exercise 7.3
*Circular Dependency with Velocity-Dependent Drag:*
Suppose force depends on velocity: $\mathbf{F} = \mathbf{F}(\mathbf{x}, \mathbf{v}) = -k \|\mathbf{v}\|\mathbf{v}$.
To advance position via Position Verlet:
$$\mathbf{x}_{n+1} = 2\mathbf{x}_n - \mathbf{x}_{n-1} + \frac{1}{m}\mathbf{F}(\mathbf{x}_n, \mathbf{v}_n)\Delta t^2$$
To evaluate $\mathbf{F}(\mathbf{x}_n, \mathbf{v}_n)$, the engine must supply $\mathbf{v}_n$.
However, in Position Verlet, velocity at tick $n$ is defined by the central difference:
$$\mathbf{v}_n = \frac{\mathbf{x}_{n+1} - \mathbf{x}_{n-1}}{2\Delta t}$$
This creates an impossible circular loop:
- To find $\mathbf{x}_{n+1}$, we need $\mathbf{v}_n$.
- But to find $\mathbf{v}_n$, we need $\mathbf{x}_{n+1}$!
This circular dependency breaks the explicit nature of Position Verlet, requiring iterative relaxation or making Velocity Verlet (Chapter 8) necessary.

---

#### Solution to Exercise 7.4
*Proof of Time-Reversibility:*
Given the forward step:
$$\mathbf{x}_{n+1} = 2\mathbf{x}_n - \mathbf{x}_{n-1} + \mathbf{a}(\mathbf{x}_n)\Delta t^2 \quad \text{--- (1)}$$
Solve Eq. 1 algebraically for $\mathbf{x}_{n-1}$:
$$\mathbf{x}_{n-1} = 2\mathbf{x}_n - \mathbf{x}_{n+1} + \mathbf{a}(\mathbf{x}_n)\Delta t^2 \quad \text{--- (2)}$$
Now, consider running the simulation backward in time. Let $\tau = -t$, so $\Delta \tau = -\Delta t$.
The acceleration $\mathbf{a}(\mathbf{x}_n)$ depends only on position and is invariant under time reversal.
The backward Verlet step from state $\mathbf{x}_{n+1}$ through state $\mathbf{x}_n$ evaluates:
$$\mathbf{x}_{\text{prev}} = 2\mathbf{x}_n - \mathbf{x}_{n+1} + \mathbf{a}(\mathbf{x}_n)(-\Delta t)^2 = 2\mathbf{x}_n - \mathbf{x}_{n+1} + \mathbf{a}(\mathbf{x}_n)\Delta t^2$$
This matches Eq. 2 identically!
The calculation is completely symmetric under time inversion. The backward step recovers the exact bit-level coordinates of $\mathbf{x}_{n-1}$.
$\blacksquare$

---

#### Solution to Exercise 7.5
Given: $x_{n-1} = 4.20\text{ m}, x_n = 5.10\text{ m}, x_{n+1} = 5.80\text{ m}, \Delta t = 0.05\text{ s}$.

*Part 1: Central difference velocity $v_n$:*
$$v_n = \frac{x_{n+1} - x_{n-1}}{2\Delta t} = \frac{5.80 - 4.20}{2(0.05)} = \frac{1.60\text{ m}}{0.10\text{ s}} = 16.0\text{ m/s}$$

*Part 2: Backward and forward difference velocities:*
- Backward difference:
  $$v_{\text{back}} = \frac{x_n - x_{n-1}}{\Delta t} = \frac{5.10 - 4.20}{0.05} = \frac{0.90}{0.05} = 18.0\text{ m/s}$$
- Forward difference:
  $$v_{\text{fwd}} = \frac{x_{n+1} - x_n}{\Delta t} = \frac{5.80 - 5.10}{0.05} = \frac{0.70}{0.05} = 14.0\text{ m/s}$$

*Part 3: Proof of arithmetic mean:*
$$\frac{v_{\text{back}} + v_{\text{fwd}}}{2} = \frac{18.0 + 14.0}{2} = \frac{32.0}{2} = 16.0\text{ m/s} \equiv v_n$$
$\blacksquare$ The central difference velocity is the exact arithmetic mean of the backward and forward velocities.

---

#### Solution to Exercise 7.6
Given: $m = 0.5\text{ kg}$, $k = 200.0\text{ N/m} \implies \omega^2 = k/m = 400.0\text{ s}^{-2}$.
$\Delta t = 0.025\text{ s}$, $x_0 = 0.2\text{ m}, v_0 = 0.0\text{ m/s}$.
$\Delta t^2 = (0.025)^2 = 0.000625\text{ s}^2$.
$\omega^2 \Delta t^2 = 400.0 \times 0.000625 = 0.25$.

*Step 1: Compute $x_{-1}$:*
$a_0 = -\omega^2 x_0 = -400.0(0.2) = -80.0\text{ m/s}^2$.
$$x_{-1} = x_0 - v_0 \Delta t + \frac{1}{2} a_0 \Delta t^2 = 0.2 - 0 + \frac{1}{2}(-80.0)(0.000625) = 0.2 - 0.025 = 0.175\text{ m}$$

*Step 2: Compute $x_1$:*
$$x_1 = 2 x_0 - x_{-1} + a_0 \Delta t^2 = 2(0.2) - 0.175 + (-80.0)(0.000625) = 0.40 - 0.175 - 0.050 = 0.175\text{ m}$$

*Step 3: Compute $x_2$:*
$a_1 = -\omega^2 x_1 = -400.0(0.175) = -70.0\text{ m/s}^2$.
$$x_2 = 2 x_1 - x_0 + a_1 \Delta t^2 = 2(0.175) - 0.20 + (-70.0)(0.000625) = 0.350 - 0.20 - 0.04375 = 0.10625\text{ m}$$

Exact check: $x_{\text{exact}}(0.05) = 0.2 \cos(20 \times 0.05) = 0.2 \cos(1.0\text{ rad}) \approx 0.2(0.54030) = 0.10806\text{ m}$.
Error = $|0.10806 - 0.10625| = 0.00181\text{ m}$ ($1.8\text{ mm}$).

---

#### Solution to Exercise 7.7
*Why Position Verlet Dominates Position-Based Dynamics (PBD):*
In cloth, hair, and soft-body simulations:
1. PBD manipulates positions directly: vertex coordinates are projected onto constraint manifolds (distance, bending, volume) using Gauss-Seidel iterations.
2. In Position Verlet, modifying $\mathbf{x}_n$ automatically and implicitly updates the velocity on the next frame ($\mathbf{v}_{\text{eff}} = (\mathbf{x}_{\text{projected}} - \mathbf{x}_{\text{prev}})/\Delta t$). There is no need to manually synchronize velocity arrays or solve expensive linear momentum systems.
3. It is unconditionally stable against constraint over-stiffening.

*Why Velocity Verlet Dominates Rigid Bodies:*
Rigid body dynamics relies on impulse-based velocity solvers (linear complementarity problems, LCP). Rigid impacts require instantaneous, discontinuous velocity changes upon impact ($\mathbf{v}^+ = -e \mathbf{v}^-$). Because Position Verlet lacks explicit velocity variables, injecting an instantaneous velocity impulse is awkward and requires distorting historical positions $\mathbf{x}_{n-1}$.

---

#### Solution to Exercise 7.8
In a molecular dynamics simulation with a Lennard-Jones potential:
$$V(r) = 4\epsilon \left[ \left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^6 \right]$$
When two atoms approach very closely ($r \to 0$), the repulsive force scales as $1/r^{13}$, generating an enormous acceleration spike $\mathbf{a} \sim 10^8\text{ m/s}^2$.
- Under **Forward Euler**: $\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t$. The atom plunges deeply into the core of the neighboring atom because its velocity has not yet reacted. On the next step, the massive acceleration catapults the atom with supersonic speed ($10^6\text{ m/s}$), exploding the simulation box.
- Under **Position Verlet**: $\mathbf{x}_{n+1} = 2\mathbf{x}_n - \mathbf{x}_{n-1} + \mathbf{a}_n \Delta t^2$. Because Position Verlet is symplectic and time-reversible, the force impulse acts as a symmetric turning point on the invariant shadow energy surface. The atom cleanly rebounds off the potential wall, conserving total thermodynamic energy.

---

#### Solution to Exercise 7.9
*Proof of Phase-Space Symplectic Mapping for Position Verlet:*
Define the auxiliary momentum variable at tick $n$:
$$\mathbf{p}_n \equiv m \frac{\mathbf{x}_n - \mathbf{x}_{n-1}}{\Delta t} + \frac{1}{2} \mathbf{F}(\mathbf{x}_n)\Delta t \quad \text{--- (1)}$$
From this definition:
$$\mathbf{x}_n - \mathbf{x}_{n-1} = \frac{\Delta t}{m} \mathbf{p}_n - \frac{\Delta t^2}{2m} \mathbf{F}(\mathbf{x}_n)$$
The Position Verlet formula is:
$$\mathbf{x}_{n+1} - \mathbf{x}_n = (\mathbf{x}_n - \mathbf{x}_{n-1}) + \frac{\Delta t^2}{m} \mathbf{F}(\mathbf{x}_n)$$
Substitute the expression for $\mathbf{x}_n - \mathbf{x}_{n-1}$:
$$\mathbf{x}_{n+1} - \mathbf{x}_n = \left(\frac{\Delta t}{m} \mathbf{p}_n - \frac{\Delta t^2}{2m} \mathbf{F}(\mathbf{x}_n)\right) + \frac{\Delta t^2}{m} \mathbf{F}(\mathbf{x}_n) = \frac{\Delta t}{m} \mathbf{p}_n + \frac{\Delta t^2}{2m} \mathbf{F}(\mathbf{x}_n)$$
$$\mathbf{x}_{n+1} = \mathbf{x}_n + \frac{\Delta t}{m} \left( \mathbf{p}_n + \frac{1}{2}\mathbf{F}(\mathbf{x}_n)\Delta t \right)$$
Now evaluate $\mathbf{p}_{n+1}$ using definition (1) shifted to $n+1$:
$$\mathbf{p}_{n+1} = m \frac{\mathbf{x}_{n+1} - \mathbf{x}_n}{\Delta t} + \frac{1}{2} \mathbf{F}(\mathbf{x}_{n+1})\Delta t = \left( \mathbf{p}_n + \frac{1}{2}\mathbf{F}(\mathbf{x}_n)\Delta t \right) + \frac{1}{2} \mathbf{F}(\mathbf{x}_{n+1})\Delta t$$

Notice what this is:
1. $\mathbf{p}_{n+1/2} = \mathbf{p}_n + \frac{1}{2}\mathbf{F}(\mathbf{x}_n)\Delta t$ (Kick)
2. $\mathbf{x}_{n+1} = \mathbf{x}_n + \frac{\Delta t}{m}\mathbf{p}_{n+1/2}$ (Drift)
3. $\mathbf{p}_{n+1} = \mathbf{p}_{n+1/2} + \frac{1}{2}\mathbf{F}(\mathbf{x}_{n+1})\Delta t$ (Kick)

This is precisely the **Velocity Verlet algorithm**!
Position Verlet and Velocity Verlet are mathematically identical; they are simply different coordinate representations of the exact same underlying symplectic Lie-Trotter split mapping!
$\blacksquare$

---

#### Solution to Exercise 7.10
Given: $T = 365\text{ days} = 3.1536 \times 10^7\text{ s}$, $r = 1.5 \times 10^{11}\text{ m}$, $\Delta t = 1.0\text{ day} = 86,400\text{ s}$.

*Step 1: Compute orbital angular frequency $\omega$:*
$$\omega = \frac{2\pi}{T} = \frac{2\pi}{3.1536 \times 10^7} \approx 1.992 \times 10^{-7}\text{ rad/s}$$

*Step 2: Fourth time derivative of position for circular orbit:*
$$r^{(4)} = \omega^4 r = (1.992 \times 10^{-7})^4 (1.5 \times 10^{11}) \approx (1.575 \times 10^{-27})(1.5 \times 10^{11}) \approx 2.36 \times 10^{-16}\text{ m/s}^4$$

*Step 3: Fourth-order local truncation error:*
$$\text{LTE} = \frac{1}{12} r^{(4)} \Delta t^4 = \frac{1}{12}(2.36 \times 10^{-16}\text{ m/s}^4)(86,400\text{ s})^4$$
$$(86,400)^4 \approx 5.572 \times 10^{19}\text{ s}^4$$
$$\text{LTE} = \frac{1}{12}(2.36 \times 10^{-16})(5.572 \times 10^{19}) = \frac{13,150\text{ m}}{12} \approx 1,096\text{ meters}$$

*Step 4: Relative error ratio:*
$$\frac{\text{LTE}}{r} = \frac{1,096\text{ m}}{1.5 \times 10^{11}\text{ m}} \approx 7.3 \times 10^{-9}$$
The relative truncation error is $7.3 \times 10^{-9}$ (less than one hundred-millionth of the orbital radius per step), confirming extreme precision.
