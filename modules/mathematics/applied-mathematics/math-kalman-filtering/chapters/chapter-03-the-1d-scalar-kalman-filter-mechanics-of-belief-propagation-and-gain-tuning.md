# Chapter 3: The 1D Scalar Kalman Filter — Mechanics of Belief Propagation and Gain Tuning

Before confronting the full algebraic complexity of high-dimensional matrix equations, the profound intuition, mechanics, and geometric elegance of optimal filtering can be mastered in the one-dimensional scalar domain. The 1D scalar Kalman filter is not an approximation or a toy model; it is the exact, optimal Bayesian estimator for a single physical degree of freedom subjected to linear dynamics and Gaussian noise.

Every fundamental concept of modern estimation theory—the tension between model prediction and empirical observation, the contracting nature of information gain, the role of process noise in preventing filter overconfidence, and the steady-state convergence of the algebraic Riccati equation—manifests with pristine clarity in the scalar equations.

---

## 3.1 The Scalar Dynamic and Measurement Models

Consider a scalar physical quantity $x \in \mathbb{R}$ (such as temperature in a chemical reactor, altitude of a balloon, or voltage on a lithium-ion battery). The physical state evolves at discrete time steps $k = 1, 2, 3, \dots$ according to the linear stochastic recurrence:

$$x_k = a x_{k-1} + b u_{k-1} + w_k$$

and is observed through a noisy linear transducer:

$$z_k = c x_k + v_k$$

where:
1. $a \in \mathbb{R}$ is the **state transition scalar** (describing natural dissipation, decay, or growth).
2. $b \in \mathbb{R}$ is the **control input gain**, and $u_{k-1} \in \mathbb{R}$ is the known deterministic control command.
3. $c \in \mathbb{R}$ is the **measurement sensitivity scalar** (relating physical state units to sensor output units).
4. $w_k \sim \mathcal{N}(0, q)$ is independent, zero-mean Gaussian **process noise** with variance $q \ge 0$.
5. $v_k \sim \mathcal{N}(0, r)$ is independent, zero-mean Gaussian **measurement noise** with variance $r > 0$.
6. The initial state is uncertain: $x_0 \sim \mathcal{N}(\hat{x}_0, p_0)$ with initial variance $p_0 > 0$.
7. $w_k, v_k$, and $x_0$ are mutually uncorrelated for all time steps.

---

## 3.2 The Five Canonical Scalar Kalman Equations

At each discrete time step $k$, the Kalman filter executes a two-phase recursive cycle: the **Predict Step** (time propagation) and the **Update Step** (measurement incorporation).

```
        Initial Belief: N(\hat{x}_0, p_0)
                     |
                     v
             +---------------+
             | PREDICT STEP  | <--- Dynamics: a, b, u, q
             +---------------+
                     |
       Prior Belief: N(\hat{x}_{k|k-1}, p_{k|k-1})
                     |
                     v
             +---------------+
             |  UPDATE STEP  | <--- Sensor: z_k, c, r
             +---------------+
                     |
    Posterior Belief: N(\hat{x}_{k|k}, p_{k|k})
                     |
                     +---- Loops to next step (k -> k+1)
```

### Phase 1: The Predict Step (A Priori Belief Propagation)
Before the sensor measurement $z_k$ arrives, the filter projects its belief forward in time using its mathematical model of physical dynamics:

1. **State Prediction (A Priori Mean):**
   $$\hat{x}_{k|k-1} = \mathbb{E}[x_k \mid z_{1:k-1}] = \mathbb{E}[a x_{k-1} + b u_{k-1} + w_k \mid z_{1:k-1}]$$
   $$\hat{x}_{k|k-1} = a \hat{x}_{k-1|k-1} + b u_{k-1}$$

2. **Covariance Prediction (A Priori Variance Expansion):**
   The a priori estimation error is $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1} = a(x_{k-1} - \hat{x}_{k-1|k-1}) + w_k = a \tilde{x}_{k-1|k-1} + w_k$.
   Because $w_k$ is independent of the past estimation error:
   $$p_{k|k-1} = \mathbb{E}[\tilde{x}_{k|k-1}^2] = a^2 \mathbb{E}[\tilde{x}_{k-1|k-1}^2] + \mathbb{E}[w_k^2] = a^2 p_{k-1|k-1} + q$$
   Notice that if $q > 0$, uncertainty **expands** during the predict step ($p_{k|k-1} > a^2 p_{k-1|k-1}$).

---

### Phase 2: The Update Step (A Posteriori Belief Correction)
When the new measurement $z_k$ arrives, the filter compares it to its predicted measurement $c \hat{x}_{k|k-1}$:

3. **Measurement Innovation (Residual) and Innovation Variance:**
   The innovation $y_k$ is the unexpected new information delivered by the sensor:
   $$y_k = z_k - c \hat{x}_{k|k-1}$$
   The variance of this innovation residual is:
   $$s_k = \operatorname{Var}(y_k) = \operatorname{Var}(c(x_k - \hat{x}_{k|k-1}) + v_k) = c^2 p_{k|k-1} + r$$

4. **The Optimal Kalman Gain:**
   The Kalman gain $K_k$ determines how much weight to place on the new measurement relative to the prior prediction:
   $$K_k = \frac{c \, p_{k|k-1}}{s_k} = \frac{c \, p_{k|k-1}}{c^2 p_{k|k-1} + r}$$
   If $c = 1$ (direct state measurement), this simplifies to the iconic form:
   $$K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r}$$

5. **State Update (A Posteriori Mean):**
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k = \hat{x}_{k|k-1} + K_k (z_k - c \hat{x}_{k|k-1})$$
   Rearranging in convex combination form (for $c = 1$):
   $$\hat{x}_{k|k} = (1 - K_k) \hat{x}_{k|k-1} + K_k z_k$$

6. **Covariance Update (A Posteriori Variance Contraction):**
   $$p_{k|k} = (1 - K_k c) p_{k|k-1}$$
   Because $K_k c = \frac{c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} \in [0, 1]$, the factor $(1 - K_k c) \le 1$.
   The measurement update **strictly contracts** the uncertainty:
   $$p_{k|k} \le p_{k|k-1}$$

---

## 3.3 Asymptotic Limits of the Kalman Gain

The scalar gain formula $K = \frac{p}{p + r}$ embodies the entire philosophy of Bayesian rationality. Let us examine the limiting regimes:

### 3.3.1 Perfect Sensor ($r \to 0$)
When sensor noise variance approaches zero ($r \to 0$):
$$\lim_{r \to 0} K_k = \lim_{r \to 0} \frac{p_{k|k-1}}{p_{k|k-1} + r} = \frac{p_{k|k-1}}{p_{k|k-1}} = 1$$
$$\hat{x}_{k|k} = (1 - 1)\hat{x}_{k|k-1} + 1 \cdot z_k = z_k$$
$$p_{k|k} = (1 - 1) p_{k|k-1} = 0$$
The filter discards its historical prediction entirely, locks onto the sensor reading, and declares zero uncertainty.

### 3.3.2 Broken / Infinite Noise Sensor ($r \to \infty$)
When sensor noise approaches infinity ($r \to \infty$):
$$\lim_{r \to \infty} K_k = \lim_{r \to \infty} \frac{p_{k|k-1}}{p_{k|k-1} + r} = 0$$
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + 0 \cdot (z_k - \hat{x}_{k|k-1}) = \hat{x}_{k|k-1}$$
$$p_{k|k} = (1 - 0) p_{k|k-1} = p_{k|k-1}$$
The filter completely ignores the sensor reading and relies purely on its dynamic model.

### 3.3.3 Absolute Prior Certainty ($p_{k|k-1} \to 0$)
If prior certainty is infinite ($p_{k|k-1} \to 0$):
$$K_k = \frac{0}{0 + r} = 0 \implies \hat{x}_{k|k} = \hat{x}_{k|k-1}$$
A filter that believes it knows the truth with absolute zero variance will never adjust its belief, regardless of sensor data. (This is known as **filter divergence** or **arrogance**).

### 3.3.4 Absolute Prior Ignorance ($p_{k|k-1} \to \infty$)
When prior uncertainty is immense ($p_{k|k-1} \to \infty$):
$$\lim_{p \to \infty} K_k = \lim_{p \to \infty} \frac{p}{p + r} = 1 \implies \hat{x}_{k|k} = z_k, \quad p_{k|k} = r$$
The filter instantly initializes itself to the first sensor reading with variance $r$.

---

## 3.4 Steady-State Convergence and the Scalar Algebraic Riccati Equation

In time-invariant systems where $a, c, q, r$ are constant, the sequence of prior variances $p_{k|k-1}$ and posterior variances $p_{k|k}$ converges as $k \to \infty$ to a stationary, fixed-point limit:

$$\lim_{k \to \infty} p_{k|k-1} = p_\infty^{-}, \quad \lim_{k \to \infty} p_{k|k} = p_\infty^{+}$$

Combining the predict equation $p_{k+1|k} = a^2 p_{k|k} + q$ and update equation $p_{k|k} = \frac{p_{k|k-1} r}{c^2 p_{k|k-1} + r}$:

$$p_{k+1|k} = a^2 \left( \frac{p_{k|k-1} r}{c^2 p_{k|k-1} + r} \right) + q$$

Setting $p_{k+1|k} = p_{k|k-1} = p_\infty$:

$$p_\infty = \frac{a^2 r p_\infty}{c^2 p_\infty + r} + q$$

Multiplying both sides by the denominator $(c^2 p_\infty + r)$:

$$p_\infty (c^2 p_\infty + r) = a^2 r p_\infty + q (c^2 p_\infty + r)$$
$$c^2 p_\infty^2 + r p_\infty = a^2 r p_\infty + c^2 q p_\infty + q r$$
$$c^2 p_\infty^2 + \left[ (1 - a^2)r - c^2 q \right] p_\infty - q r = 0$$

This is the **Scalar Discrete Algebraic Riccati Equation (DARE)**!
It is a quadratic equation in $p_\infty$:
$$A p_\infty^2 + B p_\infty + C = 0$$
where:
$$A = c^2 > 0, \quad B = (1 - a^2)r - c^2 q, \quad C = -q r \le 0$$

Because $A > 0$ and $C \le 0$, the discriminant $\Delta = B^2 - 4AC = B^2 + 4 c^2 q r \ge 0$ is always non-negative.
By Descartes' Rule of Signs, there is **exactly one strictly positive real root**:

$$p_\infty = \frac{-B + \sqrt{B^2 + 4 c^2 q r}}{2 c^2}$$

The steady-state Kalman gain is:
$$K_\infty = \frac{c p_\infty}{c^2 p_\infty + r}$$

> [!TIP]
> In embedded microcontrollers with constrained compute resources, one does not need to compute the covariance update in real time. The steady-state gain $K_\infty$ can be pre-computed offline, transforming the Kalman filter into a single-line static recursive IIR filter:
> $$\hat{x}_k = (a \hat{x}_{k-1} + b u_{k-1}) + K_\infty (z_k - c (a \hat{x}_{k-1} + b u_{k-1}))$$

---

## 3.5 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 3.1 – 3.10)

#### Problem 3.1: Complete 3-Step Execution of a 1D Temperature Filter
**Statement:**
A chemical reactor's core temperature $x_k \in \mathbb{R}$ remains nominally constant over short intervals: $x_k = x_{k-1} + w_k$ ($a = 1, b = 0$), with process noise variance $q = 0.5\text{ }^\circ\text{C}^2$.
A temperature sensor provides direct measurements: $z_k = x_k + v_k$ ($c = 1$) with noise variance $r = 2.0\text{ }^\circ\text{C}^2$.
Initial belief is $x_0 \sim \mathcal{N}(\hat{x}_0 = 20.0, p_0 = 4.0\text{ }^\circ\text{C}^2)$.
The sensor records three successive readings:
- Step 1: $z_1 = 23.5^\circ\text{C}$
- Step 2: $z_2 = 22.0^\circ\text{C}$
- Step 3: $z_3 = 24.5^\circ\text{C}$
Execute the full Kalman filter algorithm for all three steps. At each step $k \in \{1, 2, 3\}$, compute:
1. Prior estimate $\hat{x}_{k|k-1}$ and prior variance $p_{k|k-1}$.
2. Innovation $y_k$ and innovation variance $s_k$.
3. Kalman gain $K_k$.
4. Posterior estimate $\hat{x}_{k|k}$ and posterior variance $p_{k|k}$.

**Given Data:**
- $a = 1, b = 0, c = 1, q = 0.5, r = 2.0$. Initial: $\hat{x}_0 = 20.0, p_0 = 4.0$.
- Measurements: $z_1 = 23.5, z_2 = 22.0, z_3 = 24.5$.

**Step-by-Step Derivation:**

**Step 1 ($k = 1$):**
1. **Predict:**
   $$\hat{x}_{1|0} = a \hat{x}_0 = 1.0(20.0) = 20.0^\circ\text{C}$$
   $$p_{1|0} = a^2 p_0 + q = 1^2(4.0) + 0.5 = 4.5^\circ\text{C}^2$$
2. **Innovation & Variance:**
   $$y_1 = z_1 - c \hat{x}_{1|0} = 23.5 - 20.0 = 3.5^\circ\text{C}$$
   $$s_1 = c^2 p_{1|0} + r = 4.5 + 2.0 = 6.5^\circ\text{C}^2$$
3. **Kalman Gain:**
   $$K_1 = \frac{c p_{1|0}}{s_1} = \frac{4.5}{6.5} = \frac{9}{13} \approx 0.692308$$
4. **Update:**
   $$\hat{x}_{1|1} = \hat{x}_{1|0} + K_1 y_1 = 20.0 + \frac{9}{13}(3.5) = 20.0 + \frac{31.5}{13} = 20.0 + 2.42308 = 22.42308^\circ\text{C}$$
   $$p_{1|1} = (1 - K_1) p_{1|0} = \left(1 - \frac{9}{13}\right) 4.5 = \frac{4}{13}(4.5) = \frac{18.0}{13} \approx 1.384615^\circ\text{C}^2$$

---

**Step 2 ($k = 2$):**
1. **Predict:**
   $$\hat{x}_{2|1} = \hat{x}_{1|1} = 22.42308^\circ\text{C}$$
   $$p_{2|1} = p_{1|1} + q = \frac{18}{13} + \frac{6.5}{13} = \frac{24.5}{13} = \frac{49}{26} \approx 1.884615^\circ\text{C}^2$$
2. **Innovation & Variance:**
   $$y_2 = z_2 - \hat{x}_{2|1} = 22.0 - 22.42308 = -0.42308^\circ\text{C}$$
   $$s_2 = p_{2|1} + r = 1.884615 + 2.0 = 3.884615^\circ\text{C}^2$$
3. **Kalman Gain:**
   $$K_2 = \frac{p_{2|1}}{s_2} = \frac{1.884615}{3.884615} = \frac{49/26}{101/26} = \frac{49}{101} \approx 0.485149$$
4. **Update:**
   $$\hat{x}_{2|2} = 22.42308 + 0.485149(-0.42308) = 22.42308 - 0.20526 = 22.21782^\circ\text{C}$$
   $$p_{2|2} = (1 - K_2) p_{2|1} = \left(1 - \frac{49}{101}\right) \frac{49}{26} = \frac{52}{101} \times \frac{49}{26} = \frac{2 \times 49}{101} = \frac{98}{101} \approx 0.970297^\circ\text{C}^2$$

---

**Step 3 ($k = 3$):**
1. **Predict:**
   $$\hat{x}_{3|2} = \hat{x}_{2|2} = 22.21782^\circ\text{C}$$
   $$p_{3|2} = p_{2|2} + q = \frac{98}{101} + 0.5 = \frac{98 + 50.5}{101} = \frac{148.5}{101} = \frac{297}{202} \approx 1.470297^\circ\text{C}^2$$
2. **Innovation & Variance:**
   $$y_3 = z_3 - \hat{x}_{3|2} = 24.5 - 22.21782 = 2.28218^\circ\text{C}$$
   $$s_3 = p_{3|2} + r = 1.470297 + 2.0 = 3.470297^\circ\text{C}^2$$
3. **Kalman Gain:**
   $$K_3 = \frac{p_{3|2}}{s_3} = \frac{1.470297}{3.470297} = \frac{297/202}{701/202} = \frac{297}{701} \approx 0.423680$$
4. **Update:**
   $$\hat{x}_{3|3} = 22.21782 + 0.423680(2.28218) = 22.21782 + 0.96691 = 23.18473^\circ\text{C}$$
   $$p_{3|3} = (1 - K_3) p_{3|2} = \left(1 - \frac{297}{701}\right) \frac{297}{202} = \frac{404}{701} \times \frac{297}{202} = \frac{2 \times 297}{701} = \frac{594}{701} \approx 0.847361^\circ\text{C}^2$$

**Final Answer:**
- **Step 1:** $\hat{x}_{1|1} \approx 22.423^\circ\text{C}$, $p_{1|1} \approx 1.385^\circ\text{C}^2$, $K_1 \approx 0.692$.
- **Step 2:** $\hat{x}_{2|2} \approx 22.218^\circ\text{C}$, $p_{2|2} \approx 0.970^\circ\text{C}^2$, $K_2 \approx 0.485$.
- **Step 3:** $\hat{x}_{3|3} \approx 23.185^\circ\text{C}$, $p_{3|3} \approx 0.847^\circ\text{C}^2$, $K_3 \approx 0.424$.

**Verification:**
Notice the monotonic convergence of variance: $p_0 = 4.0 \to p_1 = 1.385 \to p_2 = 0.970 \to p_3 = 0.847$.
The gain decays smoothly from $0.692 \to 0.485 \to 0.424$, stabilizing belief as confidence accumulates.

---

#### Problem 3.2: Steady-State Variance and Gain from the Algebraic Riccati Equation
**Statement:**
For the system in Problem 3.1 ($a = 1, c = 1, q = 0.5, r = 2.0$):
1. Write down the continuous-operation Algebraic Riccati Equation for the a priori steady-state variance $p_\infty^{-}$.
2. Solve analytically for $p_\infty^{-}$.
3. Compute the steady-state Kalman gain $K_\infty$ and the steady-state posterior variance $p_\infty^{+}$.
4. Compare $p_\infty^{+}$ with the step 3 variance $p_{3|3} \approx 0.8474$ from Problem 3.1.

**Given Data:**
- $a = 1, c = 1, q = 0.5, r = 2.0$.

**Step-by-Step Derivation:**
1. **Algebraic Riccati Equation Formulation:**
   Using the formula from Section 3.4 with $a = 1, c = 1$:
   $$c^2 (p_\infty^-)^2 + \left[ (1 - a^2)r - c^2 q \right] p_\infty^- - q r = 0$$
   $$(1)^2 (p_\infty^-)^2 + \left[ (1 - 1)(2.0) - (1)(0.5) \right] p_\infty^- - (0.5)(2.0) = 0$$
   $$(p_\infty^-)^2 - 0.5 p_\infty^- - 1.0 = 0$$
2. **Solving the Quadratic Equation:**
   $$p_\infty^- = \frac{0.5 \pm \sqrt{(-0.5)^2 - 4(1)(-1.0)}}{2} = \frac{0.5 \pm \sqrt{0.25 + 4.0}}{2} = \frac{0.5 \pm \sqrt{4.25}}{2} = \frac{0.5 \pm 2.061553}{2}$$
   Taking the physically meaningful positive root:
   $$p_\infty^- = \frac{0.5 + 2.061553}{2} = \frac{2.561553}{2} \approx 1.280776^\circ\text{C}^2$$
3. **Steady-State Kalman Gain:**
   $$K_\infty = \frac{p_\infty^-}{p_\infty^- + r} = \frac{1.280776}{1.280776 + 2.0} = \frac{1.280776}{3.280776} \approx 0.390388$$
4. **Steady-State Posterior Variance:**
   $$p_\infty^+ = (1 - K_\infty) p_\infty^- = (1 - 0.390388) \times 1.280776 = 0.609612 \times 1.280776 \approx 0.780776^\circ\text{C}^2$$
   Alternatively:
   $$p_\infty^+ = p_\infty^- - q = 1.280776 - 0.500000 = 0.780776^\circ\text{C}^2$$
5. **Comparison:**
   At Step 3, $p_{3|3} \approx 0.8474$.
   The variance is already within $8.5\%$ of its infinite-time theoretical limit ($0.7808$).

**Final Answer:**
- Prior steady-state variance: $p_\infty^- \approx 1.2808^\circ\text{C}^2$.
- Steady-state Kalman gain: $K_\infty \approx 0.3904$.
- Posterior steady-state variance: $p_\infty^+ \approx 0.7808^\circ\text{C}^2$.

**Verification:**
Check Riccati balance:
$p_\infty^- = a^2 p_\infty^+ + q = 1^2(0.780776) + 0.5 = 1.280776$.
$p_\infty^+ = \frac{p_\infty^- r}{p_\infty^- + r} = \frac{1.280776 \times 2.0}{3.280776} = \frac{2.561552}{3.280776} = 0.780776$. Exactly balanced.

---

#### Problem 3.3: Damped Dynamic System ($a < 1$) Riccati Solution
**Statement:**
A decaying RC electrical filter voltage satisfies $x_k = 0.8 x_{k-1} + w_k$ ($a = 0.8, b = 0$).
Process noise variance is $q = 0.36\text{ V}^2$, and measurement noise variance is $r = 1.0\text{ V}^2$ with direct observation ($c = 1$).
1. Solve the Discrete Algebraic Riccati Equation for the steady-state prior variance $p_\infty^-$.
2. Compute the steady-state gain $K_\infty$ and posterior variance $p_\infty^+$.
3. Compute the open-loop variance if no measurements were available ($K = 0$).

**Given Data:**
- $a = 0.8, c = 1, q = 0.36, r = 1.0$.

**Step-by-Step Derivation:**
1. **Riccati Equation Formulation:**
   $$A = c^2 = 1.0$$
   $$B = (1 - a^2)r - c^2 q = (1 - 0.64)(1.0) - (1)(0.36) = 0.36 - 0.36 = 0.0$$
   $$C = -q r = -(0.36)(1.0) = -0.36$$
   The linear term vanishes identically ($B = 0$)!
   $$(p_\infty^-)^2 - 0.36 = 0 \implies (p_\infty^-)^2 = 0.36$$
   $$p_\infty^- = \sqrt{0.36} = 0.60\text{ V}^2$$
2. **Steady-State Gain and Posterior Variance:**
   $$K_\infty = \frac{p_\infty^-}{p_\infty^- + r} = \frac{0.60}{0.60 + 1.0} = \frac{0.60}{1.60} = \frac{3}{8} = 0.375$$
   $$p_\infty^+ = (1 - K_\infty) p_\infty^- = (1 - 0.375)(0.60) = 0.625 \times 0.60 = 0.375\text{ V}^2$$
3. **Open-Loop Variance (Without Measurements):**
   If $K = 0$, variance evolves as $p_{k} = a^2 p_{k-1} + q$:
   $$p_{\text{open},\infty} = a^2 p_{\text{open},\infty} + q \implies p_{\text{open},\infty} (1 - a^2) = q$$
   $$p_{\text{open},\infty} = \frac{q}{1 - a^2} = \frac{0.36}{1 - 0.64} = \frac{0.36}{0.36} = 1.00\text{ V}^2$$

**Final Answer:**
- Prior steady-state variance: $p_\infty^- = 0.60\text{ V}^2$.
- Kalman gain: $K_\infty = 0.375$.
- Posterior steady-state variance: $p_\infty^+ = 0.375\text{ V}^2$.
- Open-loop variance: $p_{\text{open}} = 1.00\text{ V}^2$ ($62.5\%$ reduction achieved by Kalman filter).

**Verification:**
Predict step check: $p_\infty^- = a^2 p_\infty^+ + q = (0.64)(0.375) + 0.36 = 0.24 + 0.36 = 0.60\text{ V}^2$. Matches perfectly.

---

#### Problem 3.4: Filter Overconfidence and Divergence Under Zero Process Noise ($q = 0$)
**Statement:**
An engineer mistakenly assumes that a physical system has zero process disturbance, setting $q = 0$ for a random constant parameter $x_k = x_{k-1}$ ($a = 1, b = 0, c = 1$).
Measurement noise is $r = 1.0$. The initial variance is $p_0 = 1.0$.
1. Derive a closed-form formula for $p_{k|k}$ and $K_k$ as a function of time step $k$.
2. Compute the Kalman gain at $k = 1, 10, 100, 1000$.
3. Explain why the filter becomes completely "blind" to genuine physical parameter shifts when $q = 0$.

**Given Data:**
- $a = 1, c = 1, q = 0, r = 1.0, p_0 = 1.0$.

**Step-by-Step Derivation:**
1. **Recurrence Relation:**
   - At $k = 1$:
     $$p_{1|0} = p_0 + q = 1.0 + 0 = 1.0$$
     $$K_1 = \frac{p_{1|0}}{p_{1|0} + r} = \frac{1.0}{1.0 + 1.0} = \frac{1}{2} = 0.5$$
     $$p_{1|1} = (1 - K_1) p_{1|0} = \frac{1}{2} (1.0) = \frac{1}{2}\text{ m}^2$$
   - At $k = 2$:
     $$p_{2|1} = p_{1|1} + 0 = \frac{1}{2}$$
     $$K_2 = \frac{1/2}{1/2 + 1} = \frac{1/2}{3/2} = \frac{1}{3}$$
     $$p_{2|2} = \left(1 - \frac{1}{3}\right) \frac{1}{2} = \frac{2}{3} \times \frac{1}{2} = \frac{1}{3}$$
   - By mathematical induction, for any step $k$:
     $$p_{k|k} = \frac{1}{k + 1}$$
     $$p_{k+1|k} = p_{k|k} = \frac{1}{k + 1}$$
     $$K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r} = \frac{\frac{1}{k}}{\frac{1}{k} + 1} = \frac{1}{k + 1}$$
2. **Gain Values:**
   - $k = 1$: $K_1 = 1/2 = 0.500$
   - $k = 10$: $K_{10} = 1/11 \approx 0.0909$
   - $k = 100$: $K_{100} = 1/101 \approx 0.00990$
   - $k = 1000$: $K_{1000} = 1/1001 \approx 0.000999$
3. **Filter Blindness / Divergence:**
   As $k \to \infty$, $K_k \to 0$.
   If at $k = 500$, the physical parameter suddenly jumps from $x = 0$ to $x = 10$, the innovation residual becomes $y = 10 - 0 = 10$.
   However, the state update is:
   $$\hat{x} \leftarrow \hat{x} + K_{500}(10) = 0 + \left(\frac{1}{501}\right)(10) \approx 0.02$$
   The filter ignores the $10\text{-unit}$ jump because it has concluded that its error variance is essentially zero ($p \approx 0.002$). Setting $q > 0$ keeps $p$ bounded away from zero, preserving the filter's agility.

**Final Answer:**
- Closed-form formulas: $p_{k|k} = \frac{1}{k + 1}$, $K_k = \frac{1}{k + 1}$.
- Gains: $K_1 = 0.5, K_{10} \approx 0.091, K_{100} \approx 0.0099, K_{1000} \approx 0.001$.
- Physical consequence: Filter divergence (permanent loss of adaptivity caused by $q = 0$).

**Verification:**
Sample average estimator: $\hat{x}_k = \frac{1}{k} \sum_{i=1}^k z_i$ has exact recursive update $\hat{x}_k = \hat{x}_{k-1} + \frac{1}{k}(z_k - \hat{x}_{k-1})$, which matches the Kalman update when $p_0 \to \infty$.

---

#### Problem 3.5: Influence of Measurement Scale Factor $c \neq 1$
**Statement:**
A depth sensor measures water depth $x$ in feet, but the transducer output is digitized as an electrical voltage $z = 0.2 x + v$ ($c = 0.2\text{ V/ft}$).
Sensor voltage noise has variance $r = 0.04\text{ V}^2$ ($\sigma_v = 0.2\text{ V}$).
Process depth disturbance is $q = 0.5\text{ ft}^2$, and the depth remains nominally constant ($a = 1, b = 0$).
Given a prior estimate with variance $p_{k|k-1} = 2.0\text{ ft}^2$:
1. Compute the innovation variance $s_k$.
2. Compute the optimal Kalman gain $K_k$ and state its physical units.
3. If an innovation voltage residual $y_k = 0.6\text{ V}$ is observed, compute the depth correction $\Delta \hat{x}_k$.
4. Compute the updated posterior variance $p_{k|k}$.

**Given Data:**
- $a = 1, c = 0.2\text{ V/ft}, r = 0.04\text{ V}^2, q = 0.5\text{ ft}^2, p_{k|k-1} = 2.0\text{ ft}^2$.
- Residual: $y_k = 0.6\text{ V}$.

**Step-by-Step Derivation:**
1. **Innovation Variance:**
   $$s_k = c^2 p_{k|k-1} + r = (0.2)^2 (2.0) + 0.04 = (0.04)(2.0) + 0.04 = 0.08 + 0.04 = 0.12\text{ V}^2$$
2. **Kalman Gain:**
   $$K_k = \frac{c \, p_{k|k-1}}{s_k} = \frac{0.2 \times 2.0}{0.12} = \frac{0.40}{0.12} = \frac{10}{3} \approx 3.3333\text{ ft/V}$$
   The units of $K_k$ are $[\text{state units}] / [\text{measurement units}] = \text{ft/V}$.
3. **State Correction:**
   $$\Delta \hat{x}_k = K_k y_k = \left(\frac{10}{3}\text{ ft/V}\right) (0.6\text{ V}) = \frac{6.0}{3} = 2.0\text{ ft}$$
4. **Posterior Variance:**
   $$p_{k|k} = (1 - K_k c) p_{k|k-1} = \left( 1 - \frac{10}{3} \times 0.2 \right) (2.0) = \left( 1 - \frac{2}{3} \right)(2.0) = \left(\frac{1}{3}\right)(2.0) = \frac{2}{3} \approx 0.6667\text{ ft}^2$$

**Final Answer:**
- Innovation variance: $s_k = 0.12\text{ V}^2$.
- Kalman gain: $K_k = 10/3 \approx 3.333\text{ ft/V}$.
- Depth correction: $\Delta \hat{x} = 2.0\text{ ft}$.
- Posterior variance: $p_{k|k} = 2/3 \approx 0.667\text{ ft}^2$.

**Verification:**
Equivalent sensor noise in state units: $r_{\text{state}} = r / c^2 = 0.04 / 0.04 = 1.0\text{ ft}^2$.
Using standard $c=1$ formula: $K_{\text{state}} = \frac{p}{p + r_{\text{state}}} = \frac{2.0}{2.0 + 1.0} = \frac{2}{3}$.
Then $K = K_{\text{state}} / c = (2/3) / 0.2 = 10/3\text{ ft/V}$.
Posterior variance: $p_{\text{post}} = (1 - K_{\text{state}}) p = (1 - 2/3)(2.0) = 2/3\text{ ft}^2$. Exact match.

---

#### Problem 3.6: Innovation Sequence Whiteness Verification
**Statement:**
Let $y_k = z_k - c \hat{x}_{k|k-1}$ be the innovation sequence of a scalar Kalman filter.
Prove analytically that under optimal filter tuning:
1. $\mathbb{E}[y_k] = 0$ (zero mean).
2. $\mathbb{E}[y_j y_k] = 0$ for all $j \neq k$ (white noise property).

**Given Data:**
- $z_k = c x_k + v_k$, $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$.

**Step-by-Step Derivation:**
1. Express innovation in terms of estimation error and measurement noise:
   $$y_k = (c x_k + v_k) - c \hat{x}_{k|k-1} = c(x_k - \hat{x}_{k|k-1}) + v_k = c \tilde{x}_{k|k-1} + v_k$$
2. **Zero Mean:**
   $$\mathbb{E}[y_k] = c \mathbb{E}[\tilde{x}_{k|k-1}] + \mathbb{E}[v_k] = c(0) + 0 = 0$$
3. **Autocorrelation for $j < k$:**
   Consider an earlier step $j < k$. The innovation at step $j$ is $y_j$.
   Note that the prediction $\hat{x}_{k|k-1}$ is conditioned on all measurements up to step $k-1$, which includes $z_j$ and $y_j$:
   $$\mathbb{E}[y_k \mid z_{1:k-1}] = c \mathbb{E}[\tilde{x}_{k|k-1} \mid z_{1:k-1}] + \mathbb{E}[v_k \mid z_{1:k-1}] = 0 + 0 = 0$$
4. Using the law of total expectation:
   $$\mathbb{E}[y_j y_k] = \mathbb{E}\left[ \mathbb{E}[y_j y_k \mid z_{1:k-1}] \right] = \mathbb{E}\left[ y_j \mathbb{E}[y_k \mid z_{1:k-1}] \right] = \mathbb{E}[y_j \cdot 0] = 0$$
5. Therefore:
   $$\mathbb{E}[y_j y_k] = s_k \delta_{jk}$$
   The innovation sequence is strictly white.

**Final Answer:**
- $\mathbb{E}[y_k] = 0$ and $\mathbb{E}[y_j y_k] = 0$ for all $j \neq k$.
- Proves that all predictable information has been extracted; only pure white noise remains.

**Verification:**
If $\mathbb{E}[y_j y_k] \neq 0$, the residual would contain predictable structure, which contradicts the optimality of the Kalman filter.

---

#### Problem 3.7: Monotonic Variance Contraction Proof
**Statement:**
Prove that for any valid scalar measurement with sensitivity $c \neq 0$ and noise variance $r > 0$, the posterior variance $p_{k|k}$ is strictly less than the prior variance $p_{k|k-1}$, provided $p_{k|k-1} > 0$.

**Given Data:**
- $p_{k|k} = (1 - K_k c) p_{k|k-1}$ where $K_k = \frac{c p_{k|k-1}}{c^2 p_{k|k-1} + r}$.

**Step-by-Step Derivation:**
1. Substitute $K_k$ into the variance update formula:
   $$p_{k|k} = \left( 1 - \frac{c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} \right) p_{k|k-1}$$
2. Combine into a single fraction:
   $$1 - \frac{c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} = \frac{(c^2 p_{k|k-1} + r) - c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} = \frac{r}{c^2 p_{k|k-1} + r}$$
3. Therefore:
   $$p_{k|k} = \frac{r p_{k|k-1}}{c^2 p_{k|k-1} + r} = p_{k|k-1} \left( \frac{r}{c^2 p_{k|k-1} + r} \right)$$
4. Since $c \neq 0$ and $p_{k|k-1} > 0$, the product $c^2 p_{k|k-1} > 0$.
   Therefore:
   $$c^2 p_{k|k-1} + r > r \implies \frac{r}{c^2 p_{k|k-1} + r} < 1$$
5. Multiplying by positive $p_{k|k-1}$:
   $$p_{k|k} < p_{k|k-1}$$
   The uncertainty strictly decreases.

**Final Answer:**
- $p_{k|k} = p_{k|k-1} \left(\frac{r}{c^2 p_{k|k-1} + r}\right) < p_{k|k-1}$ proven rigorously.

**Verification:**
The difference is $\Delta p = p_{k|k-1} - p_{k|k} = \frac{c^2 p_{k|k-1}^2}{c^2 p_{k|k-1} + r} = K_k^2 s_k > 0$, confirming positive variance reduction.

---

#### Problem 3.8: Closed-Loop Pole and Time Constant of the Error Dynamics
**Statement:**
Consider a scalar state $x_k = a x_{k-1} + w_k$ updated with steady-state gain $K_\infty$ and $c = 1$.
1. Derive the closed-loop error dynamics equation $\tilde{x}_{k|k} = \lambda_{\text{cl}} \tilde{x}_{k-1|k-1} + \dots$
2. Express the closed-loop eigenvalue $\lambda_{\text{cl}}$ in terms of $a$ and $K_\infty$.
3. For $a = 1.0$ and $K_\infty = 0.4$, compute the discrete closed-loop pole $\lambda_{\text{cl}}$ and the equivalent exponential decay time constant in steps $\tau_{\text{steps}} = -\frac{1}{\ln(\lambda_{\text{cl}})}$.

**Given Data:**
- $a = 1.0, c = 1, K_\infty = 0.4$.

**Step-by-Step Derivation:**
1. State update:
   $$\hat{x}_{k|k} = a \hat{x}_{k-1|k-1} + K_\infty (x_k + v_k - a \hat{x}_{k-1|k-1})$$
   $$\hat{x}_{k|k} = (1 - K_\infty) a \hat{x}_{k-1|k-1} + K_\infty x_k + K_\infty v_k$$
2. True state:
   $$x_k = a x_{k-1} + w_k$$
3. Estimation error $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$:
   $$\tilde{x}_{k|k} = x_k - (1 - K_\infty) a \hat{x}_{k-1|k-1} - K_\infty x_k - K_\infty v_k = (1 - K_\infty) x_k - (1 - K_\infty) a \hat{x}_{k-1|k-1} - K_\infty v_k$$
   Substitute $x_k = a x_{k-1} + w_k$:
   $$\tilde{x}_{k|k} = (1 - K_\infty) (a x_{k-1} + w_k) - (1 - K_\infty) a \hat{x}_{k-1|k-1} - K_\infty v_k$$
   $$\tilde{x}_{k|k} = a(1 - K_\infty)(x_{k-1} - \hat{x}_{k-1|k-1}) + (1 - K_\infty) w_k - K_\infty v_k$$
   $$\tilde{x}_{k|k} = \underbrace{a(1 - K_\infty)}_{\lambda_{\text{cl}}} \tilde{x}_{k-1|k-1} + (1 - K_\infty) w_k - K_\infty v_k$$
4. Closed-loop pole:
   $$\lambda_{\text{cl}} = a(1 - K_\infty) = 1.0(1 - 0.4) = 0.60$$
5. Time constant:
   $$\tau_{\text{steps}} = -\frac{1}{\ln(\lambda_{\text{cl}})} = -\frac{1}{\ln(0.60)} = -\frac{1}{-0.510826} \approx 1.9576\text{ steps}$$

**Final Answer:**
- Error dynamics: $\tilde{x}_{k|k} = a(1 - K_\infty)\tilde{x}_{k-1|k-1} + \dots$
- Closed-loop pole: $\lambda_{\text{cl}} = a(1 - K_\infty) = 0.60$.
- Time constant: $\tau \approx 1.96\text{ steps}$ (errors decay by $63.2\%$ in less than 2 steps).

**Verification:**
After 5 steps, $(0.60)^5 = 0.07776$. Over $92.2\%$ of an initial estimation disturbance is eliminated.

---

#### Problem 3.9: Unstable Plant ($a > 1$) Stabilization by Kalman Filtering
**Statement:**
An inverted pendulum angle in the unstable regime behaves as $x_k = 1.2 x_{k-1} + w_k$ ($a = 1.2 > 1$).
Process noise variance is $q = 0.44$, and measurement noise variance is $r = 1.0$ ($c = 1$).
1. Explain why open-loop estimation divergence is exponential without measurements.
2. Solve the DARE to find the steady-state prior variance $p_\infty^-$.
3. Compute the closed-loop pole $\lambda_{\text{cl}} = a(1 - K_\infty)$ and verify that the estimation error dynamics are asymptotically stable ($|\lambda_{\text{cl}}| < 1$).

**Given Data:**
- $a = 1.2, c = 1, q = 0.44, r = 1.0$.

**Step-by-Step Derivation:**
1. **Open-Loop Divergence:**
   Without measurements ($K = 0$), $p_k = a^2 p_{k-1} + q = 1.44 p_{k-1} + 0.44$.
   Since $a^2 = 1.44 > 1$, the variance grows exponentially: $p_k \sim (1.44)^k \to \infty$.
2. **Algebraic Riccati Equation:**
   $$A = 1.0$$
   $$B = (1 - a^2)r - c^2 q = (1 - 1.44)(1.0) - (1)(0.44) = -0.44 - 0.44 = -0.88$$
   $$C = -q r = -(0.44)(1.0) = -0.44$$
   $$(p_\infty^-)^2 - 0.88 p_\infty^- - 0.44 = 0$$
   $$p_\infty^- = \frac{0.88 \pm \sqrt{(-0.88)^2 - 4(1)(-0.44)}}{2} = \frac{0.88 \pm \sqrt{0.7744 + 1.76}}{2} = \frac{0.88 \pm \sqrt{2.5344}}{2} = \frac{0.88 \pm 1.59198}{2}$$
   $$p_\infty^- = \frac{0.88 + 1.59198}{2} = \frac{2.47198}{2} \approx 1.23599$$
3. **Steady-State Gain:**
   $$K_\infty = \frac{p_\infty^-}{p_\infty^- + r} = \frac{1.23599}{1.23599 + 1.0} = \frac{1.23599}{2.23599} \approx 0.55277$$
4. **Closed-Loop Pole:**
   $$\lambda_{\text{cl}} = a(1 - K_\infty) = 1.2(1 - 0.55277) = 1.2(0.44723) \approx 0.536676$$
   Since $|\lambda_{\text{cl}}| = 0.5367 < 1.0$, the estimation error is **asymptotically stable**!

**Final Answer:**
- Prior variance: $p_\infty^- \approx 1.236$.
- Kalman gain: $K_\infty \approx 0.553$.
- Closed-loop pole: $\lambda_{\text{cl}} \approx 0.537 < 1.0$ (estimation error is exponentially stable despite unstable plant dynamics).

**Verification:**
Riccati formula check: $p_\infty^+ = (1 - K_\infty) p_\infty^- = (0.44723)(1.23599) \approx 0.55277$.
$a^2 p_\infty^+ + q = (1.44)(0.55277) + 0.44 = 0.79599 + 0.44 = 1.23599 = p_\infty^-$. Exact balance.

---

#### Problem 3.10: Optimal Tuning Trade-off: Tracking vs Noise Rejection
**Statement:**
A position tracking filter has sensor noise $r = 1.0$. The engineer must choose the process noise parameter $q$.
1. If $q$ is chosen very small ($q = 0.01$), compute the steady-state gain $K_\infty$, the closed-loop pole $\lambda_{\text{cl}}$, and evaluate noise filtering.
2. If $q$ is chosen very large ($q = 100.0$), compute $K_\infty$, $\lambda_{\text{cl}}$, and evaluate agility.
3. Formulate the engineering trade-off governed by $q/r$.

**Given Data:**
- $a = 1.0, c = 1.0, r = 1.0$. Case A: $q = 0.01$. Case B: $q = 100.0$.

**Step-by-Step Derivation:**
1. **Case A ($q = 0.01$, Small Process Noise):**
   DARE: $(p_\infty^-)^2 - q p_\infty^- - q r = 0 \implies (p_\infty^-)^2 - 0.01 p_\infty^- - 0.01 = 0$.
   $$p_\infty^- = \frac{0.01 + \sqrt{0.0001 + 0.04}}{2} = \frac{0.01 + \sqrt{0.0401}}{2} \approx \frac{0.01 + 0.20025}{2} \approx 0.1051$$
   $$K_\infty = \frac{0.1051}{1.1051} \approx 0.0951$$
   $$\lambda_{\text{cl}} = 1 - 0.0951 = 0.9049$$
   - Result: Heavy smoothing, excellent sensor noise rejection ($90\%$ of noise filtered out), but sluggish response (pole at $0.905$, slow tracking of maneuvers).
2. **Case B ($q = 100.0$, Large Process Noise):**
   DARE: $(p_\infty^-)^2 - 100 p_\infty^- - 100 = 0$.
   $$p_\infty^- = \frac{100 + \sqrt{10000 + 400}}{2} = \frac{100 + \sqrt{10400}}{2} \approx \frac{100 + 101.980}{2} \approx 100.99$$
   $$K_\infty = \frac{100.99}{101.99} \approx 0.9902$$
   $$\lambda_{\text{cl}} = 1 - 0.9902 = 0.0098$$
   - Result: Ultra-fast tracking ($\lambda_{\text{cl}} \approx 0.01$, step response in 1 tick), but virtually zero noise rejection ($99\%$ of sensor noise passes directly into estimate).
3. **Engineering Synthesis:**
   The ratio $\gamma = q / r$ is the fundamental signal-to-noise ratio of the estimator:
   - High $q/r \implies$ agile tracking, noisy estimates.
   - Low $q/r \implies$ smooth estimates, lagging tracking.

**Final Answer:**
- Case A ($q=0.01$): $K_\infty \approx 0.095, \lambda_{\text{cl}} \approx 0.905$ (high noise attenuation, slow tracking).
- Case B ($q=100$): $K_\infty \approx 0.990, \lambda_{\text{cl}} \approx 0.010$ (ultra-fast tracking, poor noise attenuation).
- Governed entirely by ratio $q/r$.

**Verification:**
Formula $\lim_{q/r \to 0} K_\infty = 0$ and $\lim_{q/r \to \infty} K_\infty = 1$. The numerical results match the theoretical limits.

---

### Section 2: Solved Exercises (Problems 3.11 – 3.20)

#### Problem 3.11: Convergence Rate to Steady-State Riccati Variance
**Statement:**
For the system $a = 1, c = 1, q = 1.0, r = 1.0$ with initial variance $p_0 = 10.0$:
1. Compute the steady-state prior variance $p_\infty^-$.
2. Compute $p_{1|0}, p_{2|1}, p_{3|2}, p_{4|3}$.
3. Show that the error $\delta p_k = p_{k|k-1} - p_\infty^-$ contracts geometrically.

**Given Data:**
- $a = 1, c = 1, q = 1, r = 1, p_0 = 10.0$.

**Step-by-Step Derivation:**
1. **Steady-State Variance:**
   DARE: $p^2 - p - 1 = 0 \implies p = \frac{1 + \sqrt{5}}{2} = \phi \approx 1.618034$ (the Golden Ratio!).
   $$p_\infty^- \approx 1.618034$$
2. **Step-by-Step Variance Propagation:**
   Recurrence: $p_{k+1|k} = \frac{p_{k|k-1} r}{p_{k|k-1} + r} + q = \frac{p_{k|k-1}}{p_{k|k-1} + 1} + 1$:
   - $k=0 \implies p_{1|0} = \frac{10}{10+1} + 1 = \frac{10}{11} + 1 = \frac{21}{11} \approx 1.90909$ ($\delta_1 = +0.291$)
   - $k=1 \implies p_{2|1} = \frac{21/11}{32/11} + 1 = \frac{21}{32} + 1 = \frac{53}{32} \approx 1.65625$ ($\delta_2 = +0.0382$)
   - $k=2 \implies p_{3|2} = \frac{53/32}{85/32} + 1 = \frac{53}{85} + 1 = \frac{138}{85} \approx 1.62353$ ($\delta_3 = +0.0055$)
   - $k=3 \implies p_{4|3} = \frac{138/85}{223/85} + 1 = \frac{138}{223} + 1 = \frac{361}{223} \approx 1.61883$ ($\delta_4 = +0.0008$)
3. **Geometric Contraction:**
   Notice the ratios of Fibonacci numbers: $\frac{21}{11}, \frac{53}{32}, \frac{138}{85}, \frac{361}{223}$.
   Error drops by a factor of $\approx 7\times$ on each iteration ($\frac{0.0382}{0.291} \approx 0.13, \frac{0.0055}{0.0382} \approx 0.14$).

**Final Answer:**
- $p_\infty^- = \frac{1+\sqrt{5}}{2} \approx 1.618$.
- Sequence: $p_{1|0} \approx 1.909, p_{2|1} \approx 1.656, p_{3|2} \approx 1.624, p_{4|3} \approx 1.619$.
- Geometric convergence to the Golden Ratio verified.

**Verification:**
The continued fraction expansion of the Golden Ratio generates this exact sequence.

---

#### Problem 3.12: Minimum Mean Squared Error (MMSE) Optimality of Scalar Gain
**Statement:**
Let $\hat{x} = \hat{x}^- + K (z - \hat{x}^-)$ be a linear estimator of $x$, where $z = x + v$.
Prove by direct differentiation that the mean squared error $J(K) = \mathbb{E}[(x - \hat{x})^2]$ is minimized strictly at $K = \frac{p^-}{p^- + r}$.

**Given Data:**
- Error: $e = x - \hat{x} = (x - \hat{x}^-) - K(x - \hat{x}^- + v) = (1 - K)\tilde{x}^- - K v$.

**Step-by-Step Derivation:**
1. Compute squared error:
   $$e^2 = (1 - K)^2 (\tilde{x}^-)^2 - 2 K(1 - K)\tilde{x}^- v + K^2 v^2$$
2. Take expectation, noting $\mathbb{E}[\tilde{x}^- v] = 0$:
   $$J(K) = \mathbb{E}[e^2] = (1 - K)^2 p^- + K^2 r = (1 - 2K + K^2) p^- + K^2 r = p^- - 2 K p^- + K^2 (p^- + r)$$
3. Differentiate with respect to scalar $K$:
   $$\frac{d J(K)}{d K} = -2 p^- + 2 K (p^- + r) = 0$$
4. Solve for $K$:
   $$2 K (p^- + r) = 2 p^- \implies K^* = \frac{p^-}{p^- + r}$$
5. Second derivative check:
   $$\frac{d^2 J}{d K^2} = 2 (p^- + r) > 0$$
   Since $p^- > 0$ and $r > 0$, the second derivative is strictly positive, guaranteeing a strict global minimum.

**Final Answer:**
- $K^* = \frac{p^-}{p^- + r}$ proven to uniquely minimize MSE.

**Verification:**
At $K = K^*$, $J(K^*) = p^- - 2\frac{(p^-)^2}{p^-+r} + \frac{(p^-)^2}{(p^-+r)^2}(p^-+r) = p^- - \frac{(p^-)^2}{p^-+r} = p^-(1 - K^*) = p^+$. Matches standard formula.

---

#### Problem 3.13: Correlation Between Prior Error and Measurement
**Statement:**
In a scalar Kalman filter with $c = 1$, compute the correlation between the a priori estimation error $\tilde{x}_{k|k-1}$ and the measurement $z_k$:
$$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k)$$

**Given Data:**
- $z_k = x_k + v_k$, $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$.

**Step-by-Step Derivation:**
1. Express $z_k$ in terms of $\hat{x}_{k|k-1}$ and $\tilde{x}_{k|k-1}$:
   $$z_k = (\hat{x}_{k|k-1} + \tilde{x}_{k|k-1}) + v_k$$
2. Compute covariance:
   $$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = \mathbb{E}[\tilde{x}_{k|k-1} (z_k - \mathbb{E}[z_k])]$$
   $$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = \mathbb{E}[\tilde{x}_{k|k-1} (\tilde{x}_{k|k-1} + v_k)] = \mathbb{E}[\tilde{x}_{k|k-1}^2] + \mathbb{E}[\tilde{x}_{k|k-1} v_k]$$
3. Because measurement noise $v_k$ is independent of the past state error:
   $$\mathbb{E}[\tilde{x}_{k|k-1} v_k] = 0$$
4. Therefore:
   $$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = \mathbb{E}[\tilde{x}_{k|k-1}^2] = p_{k|k-1}$$

**Final Answer:**
- $\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = p_{k|k-1}$.

**Verification:**
The measurement is inherently correlated with the prior estimation error by exactly the prior variance.

---

#### Problem 3.14: Correlation Between A Posteriori Error and Measurement Noise
**Statement:**
Show that after the measurement update, the a posteriori estimation error $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$ is correlated with the measurement noise $v_k$:
$$\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = -K_k r$$

**Given Data:**
- $\tilde{x}_{k|k} = (1 - K_k) \tilde{x}_{k|k-1} - K_k v_k$.

**Step-by-Step Derivation:**
1. Expand the error covariance with $v_k$:
   $$\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = \mathbb{E}[\tilde{x}_{k|k} v_k] = \mathbb{E}\left[ ((1 - K_k)\tilde{x}_{k|k-1} - K_k v_k) v_k \right]$$
2. Distribute expectation:
   $$\mathbb{E}[\tilde{x}_{k|k} v_k] = (1 - K_k) \mathbb{E}[\tilde{x}_{k|k-1} v_k] - K_k \mathbb{E}[v_k^2]$$
3. Since $\mathbb{E}[\tilde{x}_{k|k-1} v_k] = 0$ and $\mathbb{E}[v_k^2] = r$:
   $$\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = -K_k r$$

**Final Answer:**
- $\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = -K_k r$.

**Verification:**
The negative sign reveals that if a measurement has a positive noise spike ($v_k > 0$), the updated estimate $\hat{x}_{k|k}$ overshoots upward, causing the true state error $\tilde{x}_{k|k} = x - \hat{x}$ to become negative.

---

#### Problem 3.15: Analytical Proof of Orthogonality of Innovation to Estimated State
**Statement:**
Prove that the a posteriori state estimate $\hat{x}_{k|k}$ is uncorrelated with the innovation residual $y_k$:
$$\mathbb{E}[\hat{x}_{k|k} y_k] = \dots \quad \text{Show that } \mathbb{E}[\tilde{x}_{k|k} y_k] = 0$$

**Given Data:**
- $\tilde{x}_{k|k} = (1 - K_k) \tilde{x}_{k|k-1} - K_k v_k$, $y_k = \tilde{x}_{k|k-1} + v_k$.

**Step-by-Step Derivation:**
1. Compute the product:
   $$\tilde{x}_{k|k} y_k = \left( (1 - K_k) \tilde{x}_{k|k-1} - K_k v_k \right) (\tilde{x}_{k|k-1} + v_k)$$
   $$= (1 - K_k) \tilde{x}_{k|k-1}^2 + (1 - K_k) \tilde{x}_{k|k-1} v_k - K_k \tilde{x}_{k|k-1} v_k - K_k v_k^2$$
2. Take expectation:
   $$\mathbb{E}[\tilde{x}_{k|k} y_k] = (1 - K_k) p_{k|k-1} - K_k r$$
3. Substitute optimal gain $K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r}$:
   $$(1 - K_k) p_{k|k-1} - K_k r = \left( \frac{r}{p_{k|k-1} + r} \right) p_{k|k-1} - \left( \frac{p_{k|k-1}}{p_{k|k-1} + r} \right) r = \frac{r p_{k|k-1} - p_{k|k-1} r}{p_{k|k-1} + r} = 0$$

**Final Answer:**
- $\mathbb{E}[\tilde{x}_{k|k} y_k] = 0$ identically.
- The posterior estimation error is strictly orthogonal to the measurement innovation.

**Verification:**
This is the celebrated **Orthogonality Principle** of optimal linear filtering.

---

#### Problem 3.16: Scalar Filter Sensitivity to Incorrect Noise Parameter Modeling
**Statement:**
A true physical system has noise parameters $q_{\text{true}} = 1.0$ and $r_{\text{true}} = 1.0$ ($a = 1, c = 1$).
An engineer incorrectly configures the Kalman filter with modeled values $q_{\text{model}} = 0.1$ and $r_{\text{model}} = 10.0$.
1. Compute the modeled steady-state gain $K_{\text{model}}$.
2. Compute the true steady-state estimation variance $p_{\text{actual}}$ achieved by this poorly tuned filter.
3. Compare $p_{\text{actual}}$ with the optimal variance $p_{\text{optimal}}$ achieved with correct noise models.

**Given Data:**
- True: $q = 1, r = 1$. Modeled: $q_m = 0.1, r_m = 10.0$.

**Step-by-Step Derivation:**
1. **Modeled Gain:**
   Modeled DARE: $p^2 - 0.1 p - 1.0 = 0 \implies p = \frac{0.1 + \sqrt{0.01 + 4.0}}{2} = \frac{0.1 + 2.0025}{2} \approx 1.05125$.
   $$K_{\text{model}} = \frac{1.05125}{1.05125 + 10.0} = \frac{1.05125}{11.05125} \approx 0.095125$$
2. **Actual Variance Under Suboptimal Gain:**
   Error dynamics with gain $K$:
   $$\tilde{x}_k = (1 - K) \tilde{x}_{k-1} + (1 - K) w_k - K v_k$$
   In steady state:
   $$p_{\text{actual}} = (1 - K)^2 p_{\text{actual}} + (1 - K)^2 q_{\text{true}} + K^2 r_{\text{true}}$$
   $$p_{\text{actual}} [1 - (1 - K)^2] = (1 - K)^2 q_{\text{true}} + K^2 r_{\text{true}}$$
   Notice $1 - (1 - K)^2 = 2K - K^2 = K(2 - K)$.
   $$p_{\text{actual}} = \frac{(1 - K)^2 q_{\text{true}} + K^2 r_{\text{true}}}{K(2 - K)}$$
   Substitute $K = 0.095125, q_{\text{true}} = 1.0, r_{\text{true}} = 1.0$:
   $$1 - K = 0.904875 \implies (1 - K)^2 = 0.818798$$
   $$K^2 = (0.095125)^2 = 0.009049$$
   $$\text{Numerator} = 0.818798(1.0) + 0.009049(1.0) = 0.827847$$
   $$\text{Denominator} = 0.095125 (2 - 0.095125) = 0.095125 \times 1.904875 \approx 0.181201$$
   $$p_{\text{actual}} = \frac{0.827847}{0.181201} \approx 4.56866$$
3. **Optimal Variance:**
   With true parameters $q = 1, r = 1$, from Problem 3.11:
   $$p_\infty^- \approx 1.618034, \quad K_{\text{opt}} = \frac{1.618034}{2.618034} \approx 0.618034$$
   $$p_{\text{optimal}} = (1 - 0.618034)(1.618034) = 0.381966 \times 1.618034 \approx 0.618034$$
4. **Degradation Ratio:**
   $$\frac{p_{\text{actual}}}{p_{\text{optimal}}} = \frac{4.5687}{0.6180} \approx 7.39$$
   Poor tuning increased the error variance by over $739\%$!

**Final Answer:**
- Modeled gain: $K_{\text{model}} \approx 0.0951$.
- Actual variance: $p_{\text{actual}} \approx 4.569$.
- Optimal variance: $p_{\text{optimal}} \approx 0.618$.
- Estimation variance increased by a factor of $7.4\times$.

**Verification:**
Under-reporting process noise causes the filter to heavily discount new measurements ($K \approx 0.095$ instead of $0.618$), creating massive tracking lag against real disturbances.

---

#### Problem 3.17: Infinite Impulse Response (IIR) Filter Equivalence
**Statement:**
Show that in steady state, a 1D scalar Kalman filter with $a = 1, c = 1$ is mathematically identical to a standard first-order exponential moving average (low-pass) filter:
$$\hat{x}_k = (1 - \alpha) \hat{x}_{k-1} + \alpha z_k$$
Express the smoothing factor $\alpha$ and the $3\text{ dB}$ cutoff frequency $f_c$ in terms of $K_\infty$ and sampling frequency $f_s$.

**Given Data:**
- Steady-state gain $K_\infty$, sampling frequency $f_s = 1/\Delta t$.

**Step-by-Step Derivation:**
1. Steady-state Kalman update:
   $$\hat{x}_k = \hat{x}_{k-1} + K_\infty (z_k - \hat{x}_{k-1}) = (1 - K_\infty) \hat{x}_{k-1} + K_\infty z_k$$
2. Equating with exponential moving average $\hat{x}_k = (1 - \alpha)\hat{x}_{k-1} + \alpha z_k$:
   $$\alpha \equiv K_\infty$$
3. Transfer function in Z-domain:
   $$X(z) = (1 - \alpha) z^{-1} X(z) + \alpha Z(z) \implies H(z) = \frac{X(z)}{Z(z)} = \frac{\alpha}{1 - (1 - \alpha) z^{-1}}$$
4. For discrete low-pass filter, the equivalent continuous cut-off frequency $\omega_c = 2\pi f_c$ satisfies:
   $$\alpha = 1 - e^{-\omega_c \Delta t} \approx \omega_c \Delta t = 2\pi f_c \Delta t = \frac{2\pi f_c}{f_s}$$
   $$f_c \approx \frac{K_\infty f_s}{2\pi}$$

**Final Answer:**
- $\alpha = K_\infty$.
- Cut-off frequency: $f_c \approx \frac{K_\infty f_s}{2\pi}$.

**Verification:**
At $K_\infty \to 1$, $f_c \to f_s / (2\pi)$ (all frequencies pass). At $K_\infty \to 0$, $f_c \to 0$ (all noise blocked).

---

#### Problem 3.18: Closed-Loop Variance Evolution with Missing Measurements
**Statement:**
A scalar Kalman filter operates in steady state with prior variance $p_\infty^- = 1.0$ and $q = 0.2$ ($a = 1, c = 1, r = 1$).
A communication dropout occurs, and no measurements arrive for 4 consecutive steps.
Calculate the prior variance $p_{k|k-1}$ for each of the 4 missed steps.

**Given Data:**
- $p_{1|0} = 1.0, q = 0.2, a = 1$. Missed measurements: $K = 0$.

**Step-by-Step Derivation:**
1. When a measurement is missed, no measurement update occurs:
   $$p_{k|k} = p_{k|k-1}$$
2. The variance propagation across each step is:
   $$p_{k+1|k} = a^2 p_{k|k} + q = p_{k|k-1} + q$$
3. Step-by-step:
   - Miss 1 ($k = 1$): $p_{1|1} = p_{1|0} = 1.0 \implies p_{2|1} = 1.0 + 0.2 = 1.20$
   - Miss 2 ($k = 2$): $p_{2|2} = p_{2|1} = 1.20 \implies p_{3|2} = 1.20 + 0.2 = 1.40$
   - Miss 3 ($k = 3$): $p_{3|3} = p_{3|2} = 1.40 \implies p_{4|3} = 1.40 + 0.2 = 1.60$
   - Miss 4 ($k = 4$): $p_{4|4} = p_{4|3} = 1.60 \implies p_{5|4} = 1.60 + 0.2 = 1.80$

**Final Answer:**
- Variances: $p_{2|1} = 1.20, p_{3|2} = 1.40, p_{4|3} = 1.60, p_{5|4} = 1.80$.
- Linear uncertainty accumulation during communication blackouts.

**Verification:**
$p_{k+m|k+m-1} = p_{k|k-1} + m \cdot q = 1.0 + 4(0.2) = 1.80$. Exact linear growth.

---

#### Problem 3.19: Optimal Gain When Prior and Measurement Variances are Equal
**Statement:**
If prior variance equals measurement noise variance ($p_{k|k-1} = r$) with $c = 1$:
1. Compute the Kalman gain $K_k$.
2. Compute the posterior variance $p_{k|k}$.
3. Show that the new estimate is the simple arithmetic average of prediction and measurement.

**Given Data:**
- $p_{k|k-1} = r, c = 1$.

**Step-by-Step Derivation:**
1. **Kalman Gain:**
   $$K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r} = \frac{r}{r + r} = \frac{r}{2r} = \frac{1}{2} = 0.5$$
2. **Posterior Variance:**
   $$p_{k|k} = (1 - K_k) p_{k|k-1} = (1 - 0.5) r = 0.5 r = \frac{r}{2}$$
3. **State Update:**
   $$\hat{x}_{k|k} = (1 - K_k)\hat{x}_{k|k-1} + K_k z_k = 0.5 \hat{x}_{k|k-1} + 0.5 z_k = \frac{\hat{x}_{k|k-1} + z_k}{2}$$

**Final Answer:**
- Gain: $K_k = 0.5$.
- Posterior variance: $p_{k|k} = r/2$ (uncertainty halved).
- Estimate: Exactly equal to the arithmetic midpoint $\frac{\hat{x} + z}{2}$.

**Verification:**
When two sources have identical variance $r$, equal weighting ($w_1 = w_2 = 0.5$) is optimal, cutting variance in half.

---

#### Problem 3.20: Synthesis of the 1D Scalar Kalman Filter
**Statement:**
Synthesize a standalone, robust TypeScript function implementing a single tick of the scalar Kalman filter with clamping against negative variance.

**Given Data:**
- Inputs: `x_prev`, `p_prev`, `u`, `z`, `a`, `b`, `c`, `q`, `r`.

**Step-by-Step Derivation:**
1. Predict state: `x_prior = a * x_prev + b * u`
2. Predict variance: `p_prior = a * a * p_prev + q`
3. Innovation: `y = z - c * x_prior`
4. Innovation variance: `s = c * c * p_prior + r`
5. Gain: `K = (c * p_prior) / s`
6. State update: `x_post = x_prior + K * y`
7. Variance update: `p_post = Math.max(0, (1 - K * c) * p_prior)`

**Final Answer:**
```typescript
function scalarKalmanStep(
  x_prev: number, p_prev: number, u: number, z: number,
  a: number, b: number, c: number, q: number, r: number
): { x_post: number; p_post: number; K: number; y: number } {
  // 1. Predict
  const x_prior = a * x_prev + b * u;
  const p_prior = a * a * p_prev + q;
  // 2. Innovation
  const y = z - c * x_prior;
  const s = c * c * p_prior + r;
  // 3. Gain
  const K = (c * p_prior) / s;
  // 4. Update
  const x_post = x_prior + K * y;
  const p_post = Math.max(0, (1.0 - K * c) * p_prior);
  return { x_post, p_post, K, y };
}
```

**Verification:**
Running with inputs from Problem 3.1 reproduces $x_1 = 22.423, p_1 = 1.385, K_1 = 0.692$.
