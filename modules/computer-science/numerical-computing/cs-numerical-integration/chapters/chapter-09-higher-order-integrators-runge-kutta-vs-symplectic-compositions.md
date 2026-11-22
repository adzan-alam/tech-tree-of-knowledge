# Chapter 09: Higher-Order Integrators — Runge-Kutta vs. Symplectic Compositions

> *"Classical Runge-Kutta 4 is the crown jewel of 19th-century numerical calculus: an exquisitely tuned four-stage dance that matches Taylor expansions up to the fifth derivative. Yet in physical simulation, raw polynomial order is not enough. If an algorithm is blind to the symplectic geometry of phase space, its high precision merely allows it to march with four-decimal-place elegance toward catastrophic physical decay. To conquer both order and geometry, we must synthesize the composition methods of Haruo Yoshida."*

---

### 9.1 The Hunger for Higher-Order Precision

In Chapters 6, 7, and 8, we explored the second-order symplectic integrators: Semi-Implicit Euler, Position Verlet, and Velocity Verlet. For interactive video games, rigid-body engines, and standard cloth simulations, second-order accuracy ($O(\Delta t^2)$) combined with exact symplecticity provides the optimal engineering balance.

However, in specialized domains of computational science, second-order accuracy is insufficient:
1. **Interplanetary Spacecraft Trajectory Insertion:** When plotting a gravitational slingshot of the Cassini probe through Saturn's ring plane, an error of $1.0\text{ mm/s}$ at Jupiter magnifies into a miss distance of $50,000\text{ km}$ at Saturn.
2. **Astrophysical Relativistic Mergers:** Modeling gravitational wave emission from colliding black holes or neutron stars requires resolving high-frequency spatial gradients with errors below $10^{-12}$.
3. **Ballistic Aerodynamics with Complex Non-Linear Drag:** Trajectories governed by Mach-dependent supersonic shock waves and atmospheric density stratification demand high-order polynomial matching across large step sizes.

To achieve this precision, numerical analysis developed the **Runge-Kutta Family** and **Higher-Order Symplectic Composition Methods**.

---

### 9.2 The Classical Fourth-Order Runge-Kutta Method (RK4)

Between 1895 and 1901, German mathematicians Carl Runge and Wilhelm Kutta developed a family of multi-stage numerical methods that achieved higher-order Taylor accuracy **without requiring analytical evaluation of higher-order derivative tensors**.

Given the general initial value problem:

$$\dot{\mathbf{y}}(t) = \mathbf{f}(\mathbf{y}(t), t), \qquad \mathbf{y}(t_0) = \mathbf{y}_0$$

The **Classical Fourth-Order Runge-Kutta Algorithm (RK4)** evaluates four intermediate vector derivative samples ($\mathbf{k}_1, \mathbf{k}_2, \mathbf{k}_3, \mathbf{k}_4$) within each single time step $\Delta t$:

$$\begin{cases}
\mathbf{k}_1 = \mathbf{f}(\mathbf{y}_n, t_n) & \text{(Slope at the beginning of the step)} \\
\mathbf{k}_2 = \mathbf{f}\left(\mathbf{y}_n + \frac{\Delta t}{2}\mathbf{k}_1, \ t_n + \frac{\Delta t}{2}\right) & \text{(Estimated slope at midpoint using } \mathbf{k}_1\text{)} \\
\mathbf{k}_3 = \mathbf{f}\left(\mathbf{y}_n + \frac{\Delta t}{2}\mathbf{k}_2, \ t_n + \frac{\Delta t}{2}\right) & \text{(Refined slope at midpoint using } \mathbf{k}_2\text{)} \\
\mathbf{k}_4 = \mathbf{f}(\mathbf{y}_n + \Delta t \mathbf{k}_3, \ t_n + \Delta t) & \text{(Estimated slope at endpoint using } \mathbf{k}_3\text{)}
\end{cases}$$

The final state update is the weighted average of these four slopes, mirroring **Simpson's Rule** from numerical quadrature:

$$\mathbf{\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{6} \left( \mathbf{k}_1 + 2\mathbf{k}_2 + 2\mathbf{k}_3 + \mathbf{k}_4 \right)}$$

```
+-------------------------------------------------------------------------+
|                  THE FOUR-STAGE RK4 EVALUATION PIPELINE                 |
+-------------------------------------------------------------------------+
|                                                                         |
|  t_n                     t_n + 0.5 * dt                   t_n + dt      |
|   |                            |                             |          |
|   * (k_1: Start Slope)         |                             |          |
|    \                           |                             |          |
|     `------------------------> * (k_2: Midpoint Trial 1)     |          |
|                               /                              |          |
|   * <------------------------'                               |          |
|    \                                                         |          |
|     `------------------------> * (k_3: Midpoint Trial 2)     |          |
|                                 \                            |          |
|                                  `-------------------------> * (k_4)    |
|                                                                         |
|  Final Step: y_{n+1} = y_n + (dt / 6) * [ k_1 + 2*k_2 + 2*k_3 + k_4 ]   |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### Order of Accuracy
By matching the multi-variable Taylor expansion of $\mathbf{y}(t + \Delta t)$ up to the $\Delta t^4$ term:
- **Local Truncation Error (LTE):** Fifth-order: $\text{LTE} = O(\Delta t^5)$.
- **Global Truncation Error (GTE):** Fourth-order: $\text{GTE} = O(\Delta t^4)$.

When the step size is halved ($\Delta t \to \Delta t / 2$), the global error drops by a staggering factor of $2^4 = \mathbf{16}$ (a $93.75\%$ error reduction)!

---

### 9.3 General Runge-Kutta Methods & The Butcher Tableau

In 1964, New Zealand mathematician John C. Butcher developed a compact, unified algebraic representation for all multi-stage Runge-Kutta methods: the **Butcher Tableau**.

For an $s$-stage Runge-Kutta method:

$$\mathbf{k}_i = \mathbf{f}\left( \mathbf{y}_n + \Delta t \sum_{j=1}^{s} a_{ij} \mathbf{k}_j, \quad t_n + c_i \Delta t \right), \qquad i \in \{1, \dots, s\}$$

$$\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \sum_{i=1}^{s} b_i \mathbf{k}_i$$

The coefficients are organized in the tableau:

$$\begin{array}{c|cccc}
c_1 & a_{11} & a_{12} & \dots & a_{1s} \\
c_2 & a_{21} & a_{22} & \dots & a_{2s} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
c_s & a_{s1} & a_{s2} & \dots & a_{ss} \\
\hline
& b_1 & b_2 & \dots & b_s
\end{array} \quad \iff \quad \begin{array}{c|c} \mathbf{c} & \mathbf{A} \\ \hline & \mathbf{b}^T \end{array}$$

Where:
- $\mathbf{A} = [a_{ij}]$: The Runge-Kutta matrix.
- $\mathbf{b} = [b_1, \dots, b_s]^T$: The quadrature weights (must satisfy $\sum b_i = 1$ for consistency).
- $\mathbf{c} = [c_1, \dots, c_s]^T$: The stage time nodes (satisfying $c_i = \sum_{j=1}^s a_{ij}$).

#### Butcher Tableau for Classical RK4
For Classical RK4, the method is **explicit** (meaning $a_{ij} = 0$ for all $j \ge i$, forming a strictly lower-triangular matrix):

$$\begin{array}{c|cccc}
0 & 0 & 0 & 0 & 0 \\
1/2 & 1/2 & 0 & 0 & 0 \\
1/2 & 0 & 1/2 & 0 & 0 \\
1 & 0 & 0 & 1 & 0 \\
\hline
& 1/6 & 1/3 & 1/3 & 1/6
\end{array}$$

---

### 9.4 The Fatal Flaw of Explicit Runge-Kutta: Non-Symplecticity

Why do orbital dynamicists, molecular modelers, and game physics architects reject Classical RK4 for long-running conservative simulations?

In 1988, Spanish mathematician J. M. Sanz-Serna proved the **Fundamental Symplectic Runge-Kutta Theorem**:

#### The Sanz-Serna Symplectic Condition
*A Runge-Kutta method is symplectic if and only if its Butcher tableau coefficients satisfy the algebraic identity:*

$$\mathbf{b_i a_{ij} + b_j a_{ji} - b_i b_j = 0, \qquad \forall i, j \in \{1, \dots, s\}} \quad \text{--- (Eq. 9.1)}$$

Let us test whether Classical RK4 (or any explicit Runge-Kutta method) can ever satisfy this condition!

#### The Impossibility Proof for Explicit Methods
For any **explicit** Runge-Kutta method:
1. The diagonal elements of the $\mathbf{A}$ matrix are identically zero: $a_{ii} = 0$ for all $i$.
2. Now, set $i = j$ in the Sanz-Serna condition (Eq. 9.1):
   $$b_i a_{ii} + b_i a_{ii} - b_i b_i = 0$$
3. Since $a_{ii} = 0$:
   $$0 + 0 - b_i^2 = 0 \implies -b_i^2 = 0 \implies \mathbf{b_i = 0 \quad \forall i}$$
4. But for any consistent method, the weights must sum to 1: $\sum_{i=1}^s b_i = 1$.
5. If all $b_i = 0$, then $\sum b_i = 0 \ne 1$. This is a direct mathematical contradiction!

```
+-------------------------------------------------------------------------+
|                  THE SANZ-SERNA IMPOSSIBILITY THEOREM                   |
+-------------------------------------------------------------------------+
|                                                                         |
|  NO EXPLICIT RUNGE-KUTTA METHOD CAN EVER BE SYMPLECTIC!                 |
|                                                                         |
|  Every explicit Runge-Kutta method in existence (Forward Euler, Heun,   |
|  Ralston, RK3, RK4, Fehlberg RK45, Cash-Karp, Dormand-Prince DP54)      |
|  violates Liouville's theorem and suffers from artificial secular       |
|  energy drift in conservative physical systems!                         |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 9.5 The Yoshida Symplectic Composition: 4th-Order Symplecticity

How can we achieve fourth-order accuracy ($O(\Delta t^4)$) while maintaining **100% exact symplecticity and time-reversibility**?

In 1990, Japanese astrophysicist **Haruo Yoshida** and American physicists **Étienne Forest and Ronald Ruth** published a revolutionary breakthrough: the **Symplectic Composition Method**.

Yoshida proved that one can compose multiple symmetric second-order Velocity Verlet steps with carefully chosen positive and negative substeps to cancel the second-order error term, producing an exact **Fourth-Order Symplectic Integrator**!

```
+-------------------------------------------------------------------------+
|                  YOSHIDA 4TH-ORDER SYMPLECTIC COMPOSITION               |
+-------------------------------------------------------------------------+
|                                                                         |
|  Total Step \Delta t is split into THREE sequential Verlet steps:       |
|                                                                         |
|  1. Forward Substep:    dt_1 = w_1 * \Delta t    (w_1 > 0)              |
|  2. Backward Substep:   dt_0 = w_0 * \Delta t    (w_0 < 0, Time Rewind!)|
|  3. Forward Substep:    dt_1 = w_1 * \Delta t    (w_1 > 0)              |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### Derivation of the Yoshida Coefficients
Let $\mathcal{S}_2(\tau)$ represent a second-order symmetric Velocity Verlet step of duration $\tau$.
Its operator expansion is:

$$\mathcal{S}_2(\tau) = e^{\tau \mathcal{H} + \tau^3 \mathcal{H}_3 + \tau^5 \mathcal{H}_5 + \dots}$$

Now, compose three sequential steps with weights $w_1, w_0, w_1$:

$$\mathcal{S}_4(\Delta t) = \mathcal{S}_2(w_1 \Delta t) \circ \mathcal{S}_2(w_0 \Delta t) \circ \mathcal{S}_2(w_1 \Delta t)$$

To ensure the total simulated time equals $\Delta t$:

$$w_1 + w_0 + w_1 = 1 \implies \mathbf{2 w_1 + w_0 = 1 \quad \text{--- (Condition 1)}}$$

To cancel the leading $\Delta t^3$ error term across the composition:

$$w_1^3 + w_0^3 + w_1^3 = 0 \implies \mathbf{2 w_1^3 + w_0^3 = 0 \quad \text{--- (Condition 2)}}$$

#### Solving the Algebraic System
From Condition 1: $w_0 = 1 - 2w_1$.
Substitute into Condition 2:

$$2 w_1^3 + (1 - 2w_1)^3 = 0$$

$$2 w_1^3 + (1 - 6w_1 + 12w_1^2 - 8w_1^3) = 0$$

$$-6 w_1^3 + 12 w_1^2 - 6w_1 + 1 = 0$$

Alternatively, from $2 w_1^3 + w_0^3 = 0$:

$$w_0^3 = -2 w_1^3 \implies w_0 = -2^{1/3} w_1$$

Substitute $w_0 = -2^{1/3} w_1$ into Condition 1:

$$2 w_1 - 2^{1/3} w_1 = 1 \implies w_1 (2 - 2^{1/3}) = 1$$

$$\mathbf{w_1 = \frac{1}{2 - 2^{1/3}} \approx +1.351207191959657}$$

$$\mathbf{w_0 = -\frac{2^{1/3}}{2 - 2^{1/3}} = 1 - 2w_1 \approx -1.702414383919315}$$

#### The Astounding Nature of the Yoshida Substeps
Notice something extraordinary:
- $w_1 \approx +1.3512$: The integrator takes a step **forward** by $135.1\%$ of $\Delta t$.
- $w_0 \approx -1.7024$: The integrator takes a step **BACKWARD in time** by $-170.2\%$ of $\Delta t$!
- $w_1 \approx +1.3512$: The integrator takes a second step **forward** by $+135.1\%$ of $\Delta t$.

Total time advanced: $1.3512 - 1.7024 + 1.3512 = 1.0000 \Delta t$.
Because each substep is an exact Velocity Verlet step, and the product of symplectic mappings is strictly symplectic:
1. **Yoshida-4 is 100% strictly symplectic ($\mathbf{M}^T \mathbf{J} \mathbf{M} \equiv \mathbf{J}$)**.
2. **Yoshida-4 has fourth-order global accuracy ($O(\Delta t^4)$)**.
3. **It conserves an exact Shadow Hamiltonian $\tilde{\mathcal{H}} = \mathcal{H} + O(\Delta t^4)$**.

---

### 9.6 Ten In-Depth Progressive Worked Examples

#### Example 9.1: Butcher Tableau Construction for RK2 (Midpoint Method)
*Scenario:* The Explicit Midpoint Method (RK2) updates a state via:
$$\mathbf{k}_1 = \mathbf{f}(\mathbf{y}_n, t_n)$$
$$\mathbf{k}_2 = \mathbf{f}\left(\mathbf{y}_n + \frac{\Delta t}{2}\mathbf{k}_1, \ t_n + \frac{\Delta t}{2}\right)$$
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \mathbf{k}_2$$
Write its Butcher tableau and test if it satisfies the Sanz-Serna symplectic condition.

*Step 1: Extract Butcher tableau coefficients:*
- Number of stages $s = 2$.
- $c_1 = 0, \quad c_2 = 1/2$.
- $a_{11} = 0, \quad a_{12} = 0$.
- $a_{21} = 1/2, \quad a_{22} = 0$.
- $b_1 = 0, \quad b_2 = 1$.

Tableau:
$$\begin{array}{c|cc}
0 & 0 & 0 \\
1/2 & 1/2 & 0 \\
\hline
& 0 & 1
\end{array}$$

*Step 2: Check Sanz-Serna symplectic condition ($b_i a_{ij} + b_j a_{ji} - b_i b_j = 0$):*
Evaluate for $i = 2, j = 2$:
$$b_2 a_{22} + b_2 a_{22} - b_2 b_2 = 1(0) + 1(0) - (1)(1) = 0 - 1 = -1 \ne 0$$
The condition fails! The Explicit Midpoint method is **not symplectic**.

---

#### Example 9.2: Single RK4 Step on a Projectile with Quadratic Drag
*Scenario:* A projectile of mass $m = 1.0\text{ kg}$ falls vertically from rest:
$$\dot{v} = -g + k v^2, \qquad \text{where } g = 9.8\text{ m/s}^2, \quad k = 0.05\text{ m}^{-1}$$
Initial velocity $v_0 = 0.0\text{ m/s}$. Step size $\Delta t = 0.2\text{ s}$.
Execute all 4 stages of RK4 to compute $v_1$.

*Step 1: Stage 1 ($k_1$ at $t = 0$):*
$$k_1 = f(v_0) = -9.8 + 0.05(0)^2 = -9.8000\text{ m/s}^2$$

*Step 2: Stage 2 ($k_2$ at midpoint with $k_1$):*
$$v_{\text{mid}, 1} = v_0 + \frac{\Delta t}{2} k_1 = 0 + (0.1)(-9.8) = -0.9800\text{ m/s}$$
$$k_2 = f(v_{\text{mid}, 1}) = -9.8 + 0.05(-0.98)^2 = -9.8 + 0.05(0.9604) = -9.8 + 0.04802 = -9.75198\text{ m/s}^2$$

*Step 3: Stage 3 ($k_3$ at midpoint with $k_2$):*
$$v_{\text{mid}, 2} = v_0 + \frac{\Delta t}{2} k_2 = 0 + (0.1)(-9.75198) = -0.975198\text{ m/s}$$
$$k_3 = f(v_{\text{mid}, 2}) = -9.8 + 0.05(-0.975198)^2 = -9.8 + 0.05(0.95101) = -9.8 + 0.04755 = -9.75245\text{ m/s}^2$$

*Step 4: Stage 4 ($k_4$ at endpoint with $k_3$):*
$$v_{\text{end}} = v_0 + \Delta t k_3 = 0 + (0.2)(-9.75245) = -1.95049\text{ m/s}$$
$$k_4 = f(v_{\text{end}}) = -9.8 + 0.05(-1.95049)^2 = -9.8 + 0.05(3.8044) = -9.8 + 0.19022 = -9.60978\text{ m/s}^2$$

*Step 5: Simpson's weighted average:*
$$\Delta v = \frac{\Delta t}{6} [k_1 + 2 k_2 + 2 k_3 + k_4]$$
$$k_1 + 2 k_2 + 2 k_3 + k_4 = -9.8000 + 2(-9.75198) + 2(-9.75245) + (-9.60978)$$
$$= -9.8000 - 19.50396 - 19.50490 - 9.60978 = -58.41864\text{ m/s}^2$$
$$\Delta v = \frac{0.2}{6} (-58.41864) = \frac{1}{30} (-58.41864) = -1.947288\text{ m/s}$$
$$v_1 = v_0 + \Delta v = -1.94729\text{ m/s}$$

*Exact comparison:* Terminal velocity $v_{\text{term}} = \sqrt{g/k} = \sqrt{9.8/0.05} = 14.0\text{ m/s}$.
Exact continuous velocity $v(t) = -v_{\text{term}} \tanh\left(\frac{g t}{v_{\text{term}}}\right) = -14.0 \tanh(0.14) \approx -1.94729\text{ m/s}$.
Exact match down to 5 decimal places!

---

#### Example 9.3: Evaluating RK4 Amplification Factor on a Harmonic Oscillator
*Scenario:* For a harmonic oscillator $\dot{y} = i \omega y$, evaluate the scalar amplification factor $R(z)$ of RK4 where $z = i \omega \Delta t$. Show that $|R(z)| < 1.0$.

*Step 1: Write RK4 polynomial:*
For any linear scalar equation $\dot{y} = \lambda y$, RK4 expands the exponential $e^z$ up to 4th order:
$$R(z) = 1 + z + \frac{z^2}{2} + \frac{z^3}{6} + \frac{z^4}{24}$$

*Step 2: Substitute purely imaginary argument $z = i u$ where $u = \omega \Delta t$:*
$$z = i u, \quad z^2 = -u^2, \quad z^3 = -i u^3, \quad z^4 = u^4$$
$$R(i u) = 1 + i u - \frac{u^2}{2} - i \frac{u^3}{6} + \frac{u^4}{24}$$
Separate real and imaginary parts:
$$\text{Re}(R) = 1 - \frac{u^2}{2} + \frac{u^4}{24}$$
$$\text{Im}(R) = u - \frac{u^3}{6}$$

*Step 3: Evaluate magnitude squared $|R|^2 = \text{Re}^2 + \text{Im}^2$:*
$$\text{Re}^2 = \left(1 - \frac{u^2}{2} + \frac{u^4}{24}\right)^2 = 1 - u^2 + \frac{u^4}{4} + \frac{u^4}{12} - \frac{u^6}{24} + \frac{u^8}{576} = 1 - u^2 + \frac{u^4}{3} - \frac{u^6}{24} + \frac{u^8}{576}$$
$$\text{Im}^2 = \left(u - \frac{u^3}{6}\right)^2 = u^2 - \frac{u^4}{3} + \frac{u^6}{36}$$
Add $\text{Re}^2 + \text{Im}^2$:
$$|R|^2 = 1 + \left(-u^2 + u^2\right) + \left(\frac{u^4}{3} - \frac{u^4}{3}\right) + \left(-\frac{u^6}{24} + \frac{u^6}{36}\right) + \frac{u^8}{576}$$
$$-\frac{u^6}{24} + \frac{u^6}{36} = u^6 \left(\frac{-3 + 2}{72}\right) = -\frac{u^6}{72}$$
$$|R(i u)|^2 = 1 - \frac{u^6}{72} + \frac{u^8}{576}$$

*Conclusion:* For all $0 < u < \sqrt{8} \approx 2.82$:
$$|R(i \omega \Delta t)|^2 < 1.00000000$$
On every single step, RK4 drains a tiny fraction $\frac{(\omega \Delta t)^6}{72}$ of the physical energy, proving why it is an artificial numerical damper!

---

#### Example 9.4: The Implicit Midpoint Rule: A True Symplectic Runge-Kutta Method
*Scenario:* The **Implicit Midpoint Rule** has Butcher tableau:
$$\begin{array}{c|c} 1/2 & 1/2 \\ \hline & 1 \end{array}$$
Verify whether it satisfies the Sanz-Serna symplectic condition.

*Step 1: Identify coefficients:*
$s = 1$. $c_1 = 1/2$, $a_{11} = 1/2$, $b_1 = 1$.

*Step 2: Check Sanz-Serna condition ($i=1, j=1$):*
$$b_1 a_{11} + b_1 a_{11} - b_1 b_1 = (1)(1/2) + (1)(1/2) - (1)(1) = \frac{1}{2} + \frac{1}{2} - 1 = 1 - 1 \equiv \mathbf{0}$$
The Sanz-Serna condition is **identically satisfied**!
The Implicit Midpoint Rule is an exact, second-order **Symplectic Runge-Kutta method**. However, being implicit, it requires solving non-linear systems on every step.

---

#### Example 9.5: Numerical Verification of the Yoshida-4 Coefficients
*Scenario:* Verify that the Yoshida coefficients:
$$w_1 = \frac{1}{2 - 2^{1/3}} \approx 1.351207191959657$$
$$w_0 = -\frac{2^{1/3}}{2 - 2^{1/3}} \approx -1.702414383919315$$
satisfy both Condition 1 ($2 w_1 + w_0 = 1$) and Condition 2 ($2 w_1^3 + w_0^3 = 0$) to 12 decimal places.

*Step 1: Check Condition 1 ($2 w_1 + w_0$):*
$$2(1.351207191960) + (-1.702414383920) = 2.702414383920 - 1.702414383920 = 1.000000000000$$
Satisfied.

*Step 2: Check Condition 2 ($2 w_1^3 + w_0^3$):*
$w_1^3 = (1.351207191960)^3 \approx 2.473552093551$.
$2 w_1^3 = 2 \times 2.473552093551 = 4.947104187102$.
$w_0^3 = (-1.702414383920)^3 \approx -4.947104187102$.
$$2 w_1^3 + w_0^3 = 4.947104187102 - 4.947104187102 = 0.000000000000$$
Satisfied with zero error! The second-order commutator error is completely annihilated.

---

#### Example 9.6: Tracing One Complete Step of Yoshida-4 on an Oscillator
*Scenario:* An oscillator has $m = 1.0\text{ kg}, k = 100.0\text{ N/m}$ ($\omega = 10.0\text{ rad/s}$).
At $t = 0$, $x_0 = 1.0\text{ m}, v_0 = 0.0\text{ m/s}$. Step size $\Delta t = 0.1\text{ s}$.
Execute one complete step of Yoshida-4 (comprising three Velocity Verlet sub-steps) and compute the final energy $E_1$.

*Step 1: Substep 1 ($\tau_1 = w_1 \Delta t = +0.1351207\text{ s}$):*
Run Velocity Verlet with $\tau_1$:
- $v_{1/2} = v_0 + \frac{1}{2} a_0 \tau_1 = 0 + \frac{1}{2}(-100.0)(0.1351207) = -6.756035\text{ m/s}$.
- $x_{\text{sub}1} = x_0 + v_{1/2} \tau_1 = 1.0 + (-6.756035)(0.1351207) = 1.0 - 0.912880 = 0.087120\text{ m}$.
- $a_{\text{sub}1} = -100.0(0.087120) = -8.7120\text{ m/s}^2$.
- $v_{\text{sub}1} = v_{1/2} + \frac{1}{2} a_{\text{sub}1} \tau_1 = -6.756035 + \frac{1}{2}(-8.7120)(0.1351207) = -6.756035 - 0.588574 = -7.344609\text{ m/s}$.

*Step 2: Substep 2 ($\tau_0 = w_0 \Delta t = -0.1702414\text{ s}$ — Backward in time!):*
Run Velocity Verlet with negative timestep $\tau_0$:
- $v_{1/2} = -7.344609 + \frac{1}{2}(-8.7120)(-0.1702414) = -7.344609 + 0.741571 = -6.603038\text{ m/s}$.
- $x_{\text{sub}2} = 0.087120 + (-6.603038)(-0.1702414) = 0.087120 + 1.124110 = 1.211230\text{ m}$.
- $a_{\text{sub}2} = -100.0(1.211230) = -121.1230\text{ m/s}^2$.
- $v_{\text{sub}2} = -6.603038 + \frac{1}{2}(-121.1230)(-0.1702414) = -6.603038 + 10.309990 = +3.706952\text{ m/s}$.

*Step 3: Substep 3 ($\tau_1 = w_1 \Delta t = +0.1351207\text{ s}$):*
- $v_{1/2} = +3.706952 + \frac{1}{2}(-121.1230)(0.1351207) = +3.706952 - 8.182963 = -4.476011\text{ m/s}$.
- $x_1 = 1.211230 + (-4.476011)(0.1351207) = 1.211230 - 0.604797 = \mathbf{0.606433\text{ m}}$.
- $a_1 = -100.0(0.606433) = -60.6433\text{ m/s}^2$.
- $v_1 = -4.476011 + \frac{1}{2}(-60.6433)(0.1351207) = -4.476011 - 4.097063 = \mathbf{-8.573074\text{ m/s}}$.

*Step 4: Comparison with exact analytical solution:*
$x_{\text{exact}}(0.1) = \cos(10 \times 0.1) = \cos(1.0\text{ rad}) \approx 0.540302\text{ m}$.
$v_{\text{exact}}(0.1) = -10 \sin(1.0\text{ rad}) \approx -8.414710\text{ m/s}$.
Physical energy:
$$E_1 = \frac{1}{2}(100)(0.606433)^2 + \frac{1}{2}(1)(-8.573074)^2 = 18.388 + 36.749 = 55.137\text{ J}$$
Over billions of steps, this energy will oscillate boundedly with zero secular drift.

---

#### Example 9.7: Long-Term Benchmark: RK4 vs. Yoshida-4
*Scenario:* A satellite in orbit executes $N = 10,000$ orbits.
At $\Delta t = 20\text{ s}$, RK4 loses $0.0001\%$ of its energy per orbit due to non-symplectic dissipation.
Yoshida-4 conserves the Shadow Hamiltonian with an energy fluctuation of $\pm 0.005\%$.
Compare the energy of both methods after:
1. 10 orbits
2. 10,000 orbits

*After 10 orbits:*
- RK4 Energy loss: $10 \times 0.0001\% = 0.001\%$. RK4 appears virtually perfect!
- Yoshida-4 Energy fluctuation: $\pm 0.005\%$.
At 10 orbits, a naive tester would erroneously conclude that RK4 is "more accurate".

*After 10,000 orbits:*
- RK4 Energy remaining: $E = E_0 (1 - 10^{-6})^{10,000} \approx E_0 e^{-0.01} \approx 0.990 E_0$.
  RK4 has permanently bled away **$1.0\%$ of the satellite's orbital energy**! The orbit has visibly decayed inward.
- Yoshida-4 Energy: Still oscillating within the exact same bounded range: $\pm 0.005\%$.
  Yoshida-4 has experienced **$0.000000\%$ secular energy drift**. The orbit remains identical to day one.

---

#### Example 9.8: Computational FLOP Cost Comparison
*Scenario:* Compare the computational cost per timestep for an $N$-body simulation with $N = 1,000$ particles across:
1. Semi-Implicit Euler (Order 1, Symplectic)
2. Velocity Verlet (Order 2, Symplectic)
3. Yoshida-4 (Order 4, Symplectic)
4. Classical RK4 (Order 4, Non-Symplectic)

*Force evaluation cost:* Direct all-pairs gravitational acceleration requires $\approx 500,000$ pairwise evaluations per force call.

| Integrator | Global Order | Force Calls / Step | FLOPs / Step | Symplectic? |
|---|---|---|---|---|
| Semi-Implicit Euler | 1 | **1** | $1.0\times$ (Baseline) | **Yes** |
| Velocity Verlet | 2 | **1** | $1.0\times$ | **Yes** |
| Yoshida-4 | 4 | **3** | $3.0\times$ | **Yes** |
| Classical RK4 | 4 | **4** | $4.0\times$ | **NO** |

*Takeaway:* Yoshida-4 provides **higher order than Velocity Verlet, runs 25% faster than RK4 (3 force calls vs 4), and is 100% symplectic**!

---

#### Example 9.9: Gravitational Slingshot Stability
*Scenario:* A spacecraft approaches Jupiter on a hyperbolic flyby. At closest approach (perijove), gravitational acceleration surges to $a = 25.0\text{ m/s}^2$.
Explain why Classical RK4 might falsely predict an atmospheric entry or escape trajectory if the step size $\Delta t$ is fixed, whereas an adaptive symplectic composition preserves the asymptotic hyperbolic energy $E = \frac{1}{2} v_\infty^2 > 0$.

*Analysis:*
During the intense gravitational encounter, the spacecraft traverses a steep potential well in a few hours:
- In Classical RK4, the non-symplectic truncation error acts as an artificial dissipative or anti-dissipative kick during the strong curvature. Even a microscopic change in $v_\infty$ alters the asymptotic outbound trajectory angle by several degrees, sending the spacecraft millions of miles off course.
- In Symplectic integrators (Velocity Verlet or Yoshida-4), the mapping strictly preserves the asymptotic energy and angular momentum phase space sheets. The outbound trajectory matches the exact continuous hyperbolic deflection angle.

---

#### Example 9.10: Complete TypeScript Implementation of RK4 and Yoshida-4
*Scenario:* Write production-grade TypeScript implementations for both Classical RK4 and the Yoshida 4th-Order Symplectic Integrator for a single particle moving in a 2D potential.

```typescript
export class HigherOrderIntegratorSuite {
  // Constant Yoshida 4th-Order Composition Coefficients
  private static readonly W1: number = 1.351207191959657;
  private static readonly W0: number = -1.702414383919315;

  /**
   * Classical 4th-Order Runge-Kutta (Non-Symplectic)
   * Consumes 4 force evaluations per step.
   */
  public static stepRK4(
    x: number, y: number,
    vx: number, vy: number,
    dt: number,
    accelFunc: (px: number, py: number) => { ax: number; ay: number }
  ): { x: number; y: number; vx: number; vy: number } {
    // k1 = f(y_n)
    const a1 = accelFunc(x, y);
    const k1_vx = a1.ax;
    const k1_vy = a1.ay;
    const k1_x = vx;
    const k1_y = vy;

    // k2 = f(y_n + 0.5 * dt * k1)
    const dtHalf = 0.5 * dt;
    const x2 = x + dtHalf * k1_x;
    const y2 = y + dtHalf * k1_y;
    const vx2 = vx + dtHalf * k1_vx;
    const vy2 = vy + dtHalf * k1_vy;
    const a2 = accelFunc(x2, y2);
    const k2_vx = a2.ax;
    const k2_vy = a2.ay;

    // k3 = f(y_n + 0.5 * dt * k2)
    const x3 = x + dtHalf * vx2;
    const y3 = y + dtHalf * vy2;
    const vx3 = vx + dtHalf * k2_vx;
    const vy3 = vy + dtHalf * k2_vy;
    const a3 = accelFunc(x3, y3);
    const k3_vx = a3.ax;
    const k3_vy = a3.ay;

    // k4 = f(y_n + dt * k3)
    const x4 = x + dt * vx3;
    const y4 = y + dt * vy3;
    const vx4 = vx + dt * k3_vx;
    const vy4 = vy + dt * k3_vy;
    const a4 = accelFunc(x4, y4);
    const k4_vx = a4.ax;
    const k4_vy = a4.ay;

    // Final Simpson blend
    const dtOver6 = dt / 6.0;
    return {
      x: x + dtOver6 * (k1_x + 2.0 * vx2 + 2.0 * vx3 + vx4),
      y: y + dtOver6 * (k1_y + 2.0 * vy2 + 2.0 * vy3 + vy4),
      vx: vx + dtOver6 * (k1_vx + 2.0 * k2_vx + 2.0 * k3_vx + k4_vx),
      vy: vy + dtOver6 * (k1_vy + 2.0 * k2_vy + 2.0 * k3_vy + k4_vy)
    };
  }

  /**
   * Yoshida 4th-Order Symplectic Integrator
   * Consumes exactly 3 Velocity Verlet substeps (3 force evaluations).
   * 100% Symplectic with ZERO secular energy drift!
   */
  public static stepYoshida4(
    x: number, y: number,
    vx: number, vy: number,
    dt: number,
    accelFunc: (px: number, py: number) => { ax: number; ay: number }
  ): { x: number; y: number; vx: number; vy: number } {
    const w1 = HigherOrderIntegratorSuite.W1;
    const w0 = HigherOrderIntegratorSuite.W0;

    // Substep 1: Forward Verlet step by w1 * dt
    let state = this.singleVerletStep(x, y, vx, vy, w1 * dt, accelFunc);

    // Substep 2: Backward Verlet step by w0 * dt (Time Rewind!)
    state = this.singleVerletStep(state.x, state.y, state.vx, state.vy, w0 * dt, accelFunc);

    // Substep 3: Forward Verlet step by w1 * dt
    return this.singleVerletStep(state.x, state.y, state.vx, state.vy, w1 * dt, accelFunc);
  }

  private static singleVerletStep(
    x: number, y: number,
    vx: number, vy: number,
    dt: number,
    accelFunc: (px: number, py: number) => { ax: number; ay: number }
  ): { x: number; y: number; vx: number; vy: number } {
    const a1 = accelFunc(x, y);
    const halfDt = 0.5 * dt;

    // Half-kick
    const vMidX = vx + a1.ax * halfDt;
    const vMidY = vy + a1.ay * halfDt;

    // Full-drift
    const nextX = x + vMidX * dt;
    const nextY = y + vMidY * dt;

    // Second half-kick
    const a2 = accelFunc(nextX, nextY);
    const nextVx = vMidX + a2.ax * halfDt;
    const nextVy = vMidY + a2.ay * halfDt;

    return { x: nextX, y: nextY, vx: nextVx, vy: nextVy };
  }
}
```

---

### 9.7 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 9.1 – 9.2)

##### Exercise 9.1
State the four intermediate slope evaluations of Classical RK4. Why is RK4 classified as an explicit single-step method?

##### Exercise 9.2
Explain why Classical RK4 is non-symplectic. What does Sanz-Serna's theorem state regarding the Butcher tableau of explicit Runge-Kutta methods?

---

#### Tier 2: Butcher Tableaus & Orders (Exercises 9.3 – 9.4)

##### Exercise 9.3
Construct the Butcher tableau for Heun's second-order method:
$$\mathbf{k}_1 = \mathbf{f}(\mathbf{y}_n, t_n)$$
$$\mathbf{k}_2 = \mathbf{f}(\mathbf{y}_n + \Delta t \mathbf{k}_1, t_n + \Delta t)$$
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{2}(\mathbf{k}_1 + \mathbf{k}_2)$$
Show that it fails the Sanz-Serna condition.

##### Exercise 9.4
For a third-order Runge-Kutta method (RK3), how many force evaluations are required per step? If the timestep is halved, by what factor does the global truncation error shrink?

---

#### Tier 3: Yoshida Composition Mechanics (Exercises 9.5 – 9.6)

##### Exercise 9.5
Derive the two algebraic equations that the Yoshida composition weights $(w_1, w_0)$ must satisfy to eliminate the second-order commutator error term in a three-stage symmetric composition.

##### Exercise 9.6
Why does the Yoshida-4 composition require a **negative timestep substep** ($w_0 < 0$)? Explain how taking a step backward in time cancels the forward truncation curvature.

---

#### Tier 4: Long-Term Stability & Error Growth (Exercises 9.7 – 9.8)

##### Exercise 9.7
An orbital simulator tests Classical RK4 against Yoshida-4. Over 1,000,000 steps, RK4 loses $0.05\%$ of its energy, while Yoshida-4's energy fluctuates within $\pm 0.0001\%$.
Explain mathematically why RK4's error grows monotonically with time while Yoshida-4's error is strictly bounded.

##### Exercise 9.8
Calculate the floating-point operation cost ratio between simulating a system of $N = 50,000$ particles for 10 seconds at 60 Hz using Velocity Verlet versus Yoshida-4.

---

#### Tier 5: Advanced Symplectic Compositions (Exercises 9.9 – 9.10)

##### Exercise 9.9
Forest and Ruth (1990) derived an alternative 4th-order symplectic composition that splits into four drift-kick stages with coefficients:
$\theta = \frac{1}{2 - 2^{1/3}}$.
Compare the number of force evaluations in the Forest-Ruth formulation versus the Yoshida composition.

##### Exercise 9.10
Prove that any symmetric composition of symplectic integrators $\mathcal{S}(\tau) = \mathcal{S}_2(w_1 \tau) \circ \dots \circ \mathcal{S}_2(w_k \tau)$ automatically satisfies time-reversibility if the sequence of weights is palindromic: $w_i = w_{k - i + 1}$.

---

### 9.8 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 9.1
*The Four Slope Evaluations of RK4:*
1. $\mathbf{k}_1 = \mathbf{f}(\mathbf{y}_n, t_n)$: The vector slope at the start of the time step.
2. $\mathbf{k}_2 = \mathbf{f}(\mathbf{y}_n + \frac{\Delta t}{2}\mathbf{k}_1, t_n + \frac{\Delta t}{2})$: The trial slope at the interval midpoint, using $\mathbf{k}_1$ to project the state.
3. $\mathbf{k}_3 = \mathbf{f}(\mathbf{y}_n + \frac{\Delta t}{2}\mathbf{k}_2, t_n + \frac{\Delta t}{2})$: The refined slope at the interval midpoint, using $\mathbf{k}_2$ to project the state.
4. $\mathbf{k}_4 = \mathbf{f}(\mathbf{y}_n + \Delta t \mathbf{k}_3, t_n + \Delta t)$: The trial slope at the interval endpoint, using $\mathbf{k}_3$ to project the state.

*Why "Explicit Single-Step":*
- **Explicit:** Each slope $\mathbf{k}_i$ depends strictly on slopes that have already been computed ($\mathbf{k}_1, \dots, \mathbf{k}_{i-1}$). Zero matrix inversions or non-linear solves are needed.
- **Single-Step:** The calculation of $\mathbf{y}_{n+1}$ depends solely on the state at the immediately preceding tick $\mathbf{y}_n$. Unlike multi-step methods (such as Adams-Bashforth), it requires no historical memory of $\mathbf{y}_{n-1}$ or $\mathbf{y}_{n-2}$, making it self-starting.

---

#### Solution to Exercise 9.2
*Why Classical RK4 is Non-Symplectic:*
In Hamiltonian mechanics, an integrator is symplectic if and only if its phase-space Jacobian matrix $\mathbf{M}$ satisfies $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$.
In 1988, J. M. Sanz-Serna proved that for any Runge-Kutta method, this condition requires:
$$b_i a_{ij} + b_j a_{ji} - b_i b_j = 0 \quad \forall i, j$$
For any explicit method, $a_{ii} = 0$, forcing $b_i^2 = 0 \implies b_i = 0$. But consistency requires $\sum b_i = 1$, which is impossible if all $b_i = 0$.
Therefore, **no explicit Runge-Kutta method can ever satisfy the symplectic condition**. Classical RK4 modifies phase-space volume, causing secular numerical energy dissipation in conservative systems.

---

#### Solution to Exercise 9.3
*Butcher Tableau for Heun's Method:*
Equations:
$$\mathbf{k}_1 = \mathbf{f}(\mathbf{y}_n, t_n)$$
$$\mathbf{k}_2 = \mathbf{f}(\mathbf{y}_n + \Delta t \mathbf{k}_1, t_n + \Delta t)$$
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{2}\mathbf{k}_1 + \frac{\Delta t}{2}\mathbf{k}_2$$
Coefficients:
$s = 2$.
$c_1 = 0, \quad c_2 = 1$.
$a_{11} = 0, \quad a_{12} = 0$.
$a_{21} = 1, \quad a_{22} = 0$.
$b_1 = 1/2, \quad b_2 = 1/2$.

Tableau:
$$\begin{array}{c|cc}
0 & 0 & 0 \\
1 & 1 & 0 \\
\hline
& 1/2 & 1/2
\end{array}$$

*Testing Sanz-Serna Condition:*
Check $i = 1, j = 1$:
$$b_1 a_{11} + b_1 a_{11} - b_1^2 = \frac{1}{2}(0) + \frac{1}{2}(0) - \left(\frac{1}{2}\right)^2 = -\frac{1}{4} \ne 0$$
The condition fails completely. Heun's method is non-symplectic.

---

#### Solution to Exercise 9.4
*Force Evaluations for RK3:*
An $s$-stage explicit Runge-Kutta method requires exactly $s$ evaluations of the vector field $\mathbf{f}$ per step.
For an optimal third-order method (such as Kutta's 3rd-order method), $s = 3$.
It requires **3 force evaluations per step**.

*Error Shrinkage Under Step Halving:*
For an Order-3 method, the global truncation error scales asymptotically as:
$$\text{GTE} = C \Delta t^3$$
When $\Delta t$ is halved ($\Delta t \to \Delta t / 2$):
$$\text{GTE}_{\text{new}} = C \left(\frac{\Delta t}{2}\right)^3 = \frac{C \Delta t^3}{8} = \frac{1}{8} \text{GTE}_{\text{old}}$$
The global error shrinks by a factor of $2^3 = \mathbf{8}$ (an $87.5\%$ reduction in error).

---

#### Solution to Exercise 9.5
*Derivation of Yoshida Algebraic Conditions:*
Let $\mathcal{S}_2(\tau)$ be a second-order symmetric symplectic integrator. Its formal exponential expansion is:
$$\mathcal{S}_2(\tau) = e^{\tau \mathcal{H} + \tau^3 \mathcal{E}_3 + O(\tau^5)}$$
Where $\mathcal{E}_3$ is the third-order error operator.
Compose three steps with weights $w_1, w_0, w_1$:
$$\mathcal{S}_4(\Delta t) = \mathcal{S}_2(w_1 \Delta t) \circ \mathcal{S}_2(w_0 \Delta t) \circ \mathcal{S}_2(w_1 \Delta t)$$
Using the BCH formula, the exponents add:
$$\mathcal{S}_4(\Delta t) = e^{(w_1 + w_0 + w_1)\Delta t \mathcal{H} + (w_1^3 + w_0^3 + w_1^3)\Delta t^3 \mathcal{E}_3 + O(\Delta t^5)}$$
1. **Consistency Condition:** To advance by total time $\Delta t$, the coefficient of $\Delta t \mathcal{H}$ must equal 1:
   $$w_1 + w_0 + w_1 = 1 \implies \mathbf{2 w_1 + w_0 = 1}$$
2. **Fourth-Order Cancellation Condition:** To eliminate the $O(\Delta t^3)$ error term, its coefficient must vanish identically:
   $$w_1^3 + w_0^3 + w_1^3 = 0 \implies \mathbf{2 w_1^3 + w_0^3 = 0}$$
$\blacksquare$ These are the two governing algebraic conditions.

---

#### Solution to Exercise 9.6
*Why Negative Timestep Substeps are Mandatory:*
From Condition 2:
$$2 w_1^3 + w_0^3 = 0 \implies w_0^3 = -2 w_1^3 \implies w_0 = -2^{1/3} w_1$$
Because $2^{1/3} \approx 1.2599 > 0$:
- If $w_1 > 0$, then $w_0$ **must strictly be negative** ($w_0 < 0$).
- If both weights were positive, $2 w_1^3 + w_0^3 > 0$, making cancellation impossible.

*Physical Mechanism:*
During a second-order step, truncation error bends the numerical trajectory away from the true manifold with curvature proportional to $+\tau^3$.
By executing a substep **backward in time** ($w_0 < 0$), the error curvature reverses sign ($(-w_0)^3 = -w_0^3$), bending the trajectory in the opposite direction.
The backward step undoes the accumulated curvature of the two forward steps, bringing the final state back onto the fourth-order manifold!

---

#### Solution to Exercise 9.7
*Mathematical Reason for Monotonic vs. Bounded Error:*
- **Classical RK4:**
  RK4 is non-symplectic. Its amplification factor for conservative imaginary modes satisfies:
  $$|R(i \omega \Delta t)| = 1 - c (\omega \Delta t)^6 + O(\Delta t^8) < 1.0$$
  On every single step, energy is multiplied by a factor strictly less than 1. Over $N$ steps:
  $$E_N = E_0 (|R|^2)^N \approx E_0 e^{-2 c (\omega \Delta t)^6 N}$$
  The dissipation accumulates **monotonically and irreversibly**. There is no restorative force.
- **Yoshida-4:**
  Yoshida-4 is an exact symplectic mapping ($\mathbf{M}^T \mathbf{J} \mathbf{M} \equiv \mathbf{J}$).
  By Backward Error Analysis, Yoshida-4 solves an exact continuous **Shadow Hamiltonian**:
  $$\tilde{\mathcal{H}} = \mathcal{H} + \Delta t^4 \mathcal{H}_4 + O(\Delta t^6)$$
  Because the discrete points lie exactly on the energy surface $\tilde{\mathcal{H}} = \text{const}$, the true physical energy $\mathcal{H}$ can never drift. It is permanently bounded within:
  $$|E(t) - E_0| \le C \Delta t^4 \quad \forall t \in [0, \infty)$$

---

#### Solution to Exercise 9.8
Given: $N = 50,000$ particles, $T = 10\text{ s}$, $f = 60\text{ Hz} \implies N_{\text{steps}} = 600\text{ steps}$.
In particle physics, force evaluation dominates $> 95\%$ of total compute time.
- Velocity Verlet requires **1 force evaluation per step**:
  $$\text{Calls}_{\text{VV}} = 600 \times 1 = 600\text{ force evaluations}$$
- Yoshida-4 consists of 3 Velocity Verlet substeps, requiring **3 force evaluations per step**:
  $$\text{Calls}_{\text{Yoshida}} = 600 \times 3 = 1,800\text{ force evaluations}$$

*Cost Ratio:*
$$\text{Ratio} = \frac{1,800}{600} = \mathbf{3.0\times}$$
Yoshida-4 consumes exactly 3 times the FLOP budget of Velocity Verlet, but delivers fourth-order precision ($O(\Delta t^4)$ vs $O(\Delta t^2)$).

---

#### Solution to Exercise 9.9
*Forest-Ruth Formulation Comparison:*
The Forest-Ruth (1990) 4th-order symplectic integrator decomposes the step into a 4-stage Drift-Kick sequence:
$$\mathcal{S}_{\text{FR}} = \mathcal{D}(\theta \Delta t/2) \circ \mathcal{K}(\theta \Delta t) \circ \mathcal{D}((1-\theta)\Delta t/2) \circ \mathcal{K}((1-2\theta)\Delta t) \circ \mathcal{D}((1-\theta)\Delta t/2) \circ \mathcal{K}(\theta \Delta t) \circ \mathcal{D}(\theta \Delta t/2)$$
Where $\theta = \frac{1}{2 - 2^{1/3}}$.
- Forest-Ruth uses 3 Kick stages, requiring **3 force evaluations per step**.
- Yoshida-4 uses 3 Velocity Verlet substeps, also requiring **3 force evaluations per step**.
Both methods achieve fourth-order symplecticity with identical computational complexity.

---

#### Solution to Exercise 9.10
*Proof of Time-Reversibility for Palindromic Compositions:*
Let $\mathcal{S}_2(\tau)$ be a time-reversible symmetric integrator, meaning its time-inverse satisfies:
$$\mathcal{S}_2(-\tau) = \mathcal{S}_2(\tau)^{-1}$$
Consider the composition $\mathcal{S}(\Delta t) = \mathcal{S}_2(w_1 \Delta t) \circ \mathcal{S}_2(w_2 \Delta t) \circ \dots \circ \mathcal{S}_2(w_k \Delta t)$.
The time-inverted mapping is obtained by replacing $\Delta t$ with $-\Delta t$:
$$\mathcal{S}(-\Delta t) = \mathcal{S}_2(-w_1 \Delta t) \circ \mathcal{S}_2(-w_2 \Delta t) \circ \dots \circ \mathcal{S}_2(-w_k \Delta t)$$
Using the property $\mathcal{S}_2(-w \Delta t) = \mathcal{S}_2(w \Delta t)^{-1}$:
$$\mathcal{S}(-\Delta t) = \mathcal{S}_2(w_1 \Delta t)^{-1} \circ \mathcal{S}_2(w_2 \Delta t)^{-1} \circ \dots \circ \mathcal{S}_2(w_k \Delta t)^{-1}$$
From the anti-homomorphism of group inverses ($(A B)^{-1} = B^{-1} A^{-1}$):
$$\mathcal{S}(\Delta t)^{-1} = \left( \mathcal{S}_2(w_1 \Delta t) \circ \dots \circ \mathcal{S}_2(w_k \Delta t) \right)^{-1} = \mathcal{S}_2(w_k \Delta t)^{-1} \circ \dots \circ \mathcal{S}_2(w_1 \Delta t)^{-1}$$
If the sequence of weights is palindromic ($w_i = w_{k - i + 1}$), then:
$$\mathcal{S}_2(w_k \Delta t)^{-1} \circ \dots \circ \mathcal{S}_2(w_1 \Delta t)^{-1} \equiv \mathcal{S}_2(-w_1 \Delta t) \circ \dots \circ \mathcal{S}_2(-w_k \Delta t) = \mathcal{S}(-\Delta t)$$
Therefore:
$$\mathcal{S}(-\Delta t) = \mathcal{S}(\Delta t)^{-1}$$
The composite method is strictly time-reversible.
$\blacksquare$
