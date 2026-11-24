# Chapter 11: Optimal Smoothing and Fault Detection: Rauch-Tung-Striebel (RTS) and Chi-Square Gating

## 11.1 Introduction: Causal Real-Time Filtering vs Non-Causal Optimal Smoothing

In real-time feedback control, an autonomous robot must act causally: at time step $k$, the controller can only utilize sensor observations received up to the present moment, computing the causal filtering posterior $p(x_k | z_{1:k})$.

However, in numerous critical robotic and scientific applications—post-mission trajectory reconstruction, ground-truth generation for sensor calibration, map optimization in SLAM, flight test data analysis, and fixed-lag visual-inertial pipelines—we have access to future measurements $z_{k+1}, \dots, z_N$.

By conditioning on the **entire measurement history** $z_{1:N}$ where $N > k$, the **optimal fixed-interval smoother** $p(x_k | z_{1:N})$ extracts future measurement information backwards through the dynamic equations of motion, dramatically reducing estimation variance and eliminating causal filtering phase lag.

Furthermore, in real physical operating environments, sensors suffer from non-Gaussian faults: GPS multipath spikes, visual tracking losses, LiDAR dust reflections, and hardware sensor failures. Feeding these corrupt measurements into a Kalman filter causes catastrophic belief corruption. A production state estimator requires rigorous statistical fault detection through **Chi-square innovation gating**.

In this chapter, we derive the classical **Rauch-Tung-Striebel (RTS) backward smoother**, prove monotonic variance contraction ($P_{k|N} \le P_{k|k}$), formulate the Normalized Innovation Squared (NIS) and Normalized Estimation Error Squared (NEES) metrics, establish Chi-square outlier rejection algorithms, and solve 20 rigorous problems.

---

## 11.2 The Three Classes of Optimal Smoothers

Depending on the operational time horizon, optimal smoothers are classified into three distinct architectures:

1. **Fixed-Interval Smoothing:**
   The total observation time interval $[0, T]$ is fixed with $N$ total measurements. The algorithm computes the smoothed state trajectory $\hat{x}_{k|N}$ for all $k \in [0, N]$.
   *Applications:* Post-flight trajectory reconstruction, SLAM loop closure, calibration.
2. **Fixed-Lag Smoothing:**
   Estimates the state at a constant time lag $L$: $\hat{x}_{k-L|k}$. As new measurements arrive at step $k$, the estimate at step $k-L$ is updated.
   *Applications:* Real-time vision-based navigation where camera processing latency is constant ($L \approx 3\text{--}5$ frames).
3. **Fixed-Point Smoothing:**
   Estimates the state at a single specific historical instant $k_0$: $\hat{x}_{k_0|k}$ as time $k$ marches forward.
   *Applications:* Initial state determination, launch vehicle staging point estimation.

---

## 11.3 The Rauch-Tung-Striebel (RTS) Fixed-Interval Smoother

In 1965, Herbert E. Rauch, F. Tung, and Charlotte T. Striebel published an exceptionally elegant two-pass recursive algorithm for optimal fixed-interval smoothing in linear dynamic systems.

```
+---------------------------------------------------------------------------------------------------+
|                        RAUCH-TUNG-STRIEBEL (RTS) SMOOTHER PIPELINE                                |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
| FORWARD PASS (Causal Kalman Filter: k = 0, 1, ..., N):                                            |
|   - Compute and store trajectory in memory cache:                                                 |
|       { \hat{x}_{k|k-1}, P_{k|k-1}, \hat{x}_{k|k}, P_{k|k}, F_k }                                  |
|   - Final boundary condition at step N:                                                           |
|       \hat{x}_{N|N} \text{ and } P_{N|N} are already optimal!                                      |
|                                                                                                   |
| BACKWARD PASS (Optimal Smoother: k = N-1, N-2, ..., 0):                                           |
|   1. Compute Smoother Gain Matrix:                                                                |
|         C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}                                                    |
|                                                                                                   |
|   2. Backward State Mean Update:                                                                  |
|         \hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - \hat{x}_{k+1|k})                   |
|                                                                                                   |
|   3. Backward Covariance Update:                                                                  |
|         P_{k|N} = P_{k|k} + C_k (P_{k+1|N} - P_{k+1|k}) C_k^T                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 11.3.1 Mathematical Derivation of RTS Equations
The joint distribution of state $x_k$ and future state $x_{k+1}$ conditioned on measurements up to step $k$ ($Z_{1:k}$) is Gaussian:

$$p(x_k, x_{k+1} | Z_{1:k}) = \mathcal{N}\left( \begin{bmatrix} \hat{x}_{k|k} \\ \hat{x}_{k+1|k} \end{bmatrix}, \begin{bmatrix} P_{k|k} & P_{k|k} F_{k+1}^T \\ F_{k+1} P_{k|k} & P_{k+1|k} \end{bmatrix} \right)$$

Applying the Gaussian conditioning theorem to find $p(x_k | x_{k+1}, Z_{1:k})$:
$$\mathbb{E}[x_k | x_{k+1}, Z_{1:k}] = \hat{x}_{k|k} + P_{k|k} F_{k+1}^T P_{k+1|k}^{-1} (x_{k+1} - \hat{x}_{k+1|k}) = \hat{x}_{k|k} + C_k (x_{k+1} - \hat{x}_{k+1|k})$$
where $C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$ is the **Smoother Gain Matrix**.

The conditional covariance is:
$$\operatorname{Cov}(x_k | x_{k+1}, Z_{1:k}) = P_{k|k} - C_k P_{k+1|k} C_k^T$$

Now, condition on the complete future measurement dataset $Z_{1:N}$. By the Markov property of state transitions, given $x_{k+1}$, past state $x_k$ is conditionally independent of future measurements $z_{k+1:N}$:
$$p(x_k | x_{k+1}, Z_{1:N}) = p(x_k | x_{k+1}, Z_{1:k})$$

Applying the law of total expectation:
$$\hat{x}_{k|N} = \mathbb{E}[x_k | Z_{1:N}] = \mathbb{E}\left[ \mathbb{E}[x_k | x_{k+1}, Z_{1:k}] \Big| Z_{1:N} \right]$$
$$= \mathbb{E}\left[ \hat{x}_{k|k} + C_k (x_{k+1} - \hat{x}_{k+1|k}) \Big| Z_{1:N} \right]$$
$$= \hat{x}_{k|k} + C_k (\mathbb{E}[x_{k+1} | Z_{1:N}] - \hat{x}_{k+1|k})$$
$$\hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - \hat{x}_{k+1|k})$$

Applying the law of total variance:
$$\operatorname{Cov}(x_k | Z_{1:N}) = \mathbb{E}[\operatorname{Cov}(x_k | x_{k+1}, Z_{1:N})] + \operatorname{Cov}(\mathbb{E}[x_k | x_{k+1}, Z_{1:N}])$$
$$= (P_{k|k} - C_k P_{k+1|k} C_k^T) + \operatorname{Cov}(\hat{x}_{k|k} + C_k x_{k+1} | Z_{1:N})$$
$$= P_{k|k} - C_k P_{k+1|k} C_k^T + C_k P_{k+1|N} C_k^T$$
$$P_{k|N} = P_{k|k} + C_k (P_{k+1|N} - P_{k+1|k}) C_k^T$$

$\blacksquare$

---

## 11.4 Monotonic Variance Contraction in RTS Smoothing

A fundamental theoretical property of the RTS smoother is that the smoothed covariance is strictly less than or equal to the causal filtering covariance:

$$P_{k|N} \le P_{k|k} \quad \forall \, k \in [0, N]$$

### Proof:
Recall from Chapter 5 that every Kalman measurement update contracts prior covariance:
$$P_{k+1|k+1} \le P_{k+1|k} \implies P_{k+1|k+1} - P_{k+1|k} \le 0$$

At the terminal step $k = N-1$:
$$P_{N|N} - P_{N|N-1} \le 0$$

Since $C_{N-1} (P_{N|N} - P_{N|N-1}) C_{N-1}^T$ is a congruence transformation of a negative semi-definite matrix:
$$C_{N-1} (P_{N|N} - P_{N|N-1}) C_{N-1}^T \le 0$$

Therefore:
$$P_{N-1|N} = P_{N-1|N-1} + C_{N-1} (P_{N|N} - P_{N|N-1}) C_{N-1}^T \le P_{N-1|N-1}$$

By induction backwards from $k = N-1$ down to $0$, $P_{k+1|N} - P_{k+1|k} \le 0$ for all $k$. Hence:
$$P_{k|N} \le P_{k|k} \quad \blacksquare$$

The RTS smoother strictly reduces or maintains uncertainty across the entire trajectory.

---

## 11.5 Statistical Fault Detection: Chi-Square Innovation Gating

In real-world robotics, sensors occasionally generate outliers—gross errors caused by camera lens flare, GPS multi-path, or LiDAR dust particles—that violate the Gaussian noise model.

### 11.5.1 Normalized Innovation Squared (NIS)
Let the measurement innovation at step $k$ be $y_k = z_k - H_k \hat{x}_{k|k-1} \in \mathbb{R}^m$, with innovation covariance $S_k = H_k P_{k|k-1} H_k^T + R_k \in \mathbb{S}_{++}^m$.
The **Normalized Innovation Squared (NIS)** test statistic is defined by the squared Mahalanobis distance:

$$\epsilon_{y, k} = y_k^T S_k^{-1} y_k$$

### 11.5.2 Distribution under the Null Hypothesis
Under the null hypothesis $H_0$ that the system dynamic model is correct and the sensor noise is Gaussian:
$$y_k \sim \mathcal{N}(0, S_k)$$
Since $S_k$ is symmetric positive-definite, it admits Cholesky factorization $S_k = L L^T$.
Let $w = L^{-1} y_k$. Then:
$$\mathbb{E}[w] = L^{-1} \mathbb{E}[y_k] = 0$$
$$\operatorname{Cov}(w) = L^{-1} \operatorname{Cov}(y_k) L^{-T} = L^{-1} S_k L^{-T} = L^{-1} (L L^T) L^{-T} = I_m$$
Thus $w \sim \mathcal{N}(0, I_m)$ is a vector of $m$ independent standard normal variables.
The test statistic is:
$$\epsilon_{y, k} = y_k^T S_k^{-1} y_k = y_k^T L^{-T} L^{-1} y_k = w^T w = \sum_{i=1}^m w_i^2$$

By definition, the sum of squares of $m$ independent standard normal random variables follows a **Chi-square distribution with $m$ degrees of freedom**:

$$\mathbf{\epsilon_{y, k} \sim \chi_m^2}$$

### 11.5.3 Chi-Square Hypothesis Testing and Gating Rules
To detect and reject outliers, we establish a statistical confidence threshold $\gamma_\alpha$ such that:
$$P(\epsilon_{y, k} > \gamma_\alpha | H_0) = \alpha$$
where $\alpha$ is the significance level (false alarm rate, typically $\alpha = 0.05, 0.01,$ or $0.001$).

| Measurement Dimension $m$ | $95\%$ Confidence ($\alpha = 0.05$) | $99\%$ Confidence ($\alpha = 0.01$) | $99.9\%$ Confidence ($\alpha = 0.001$) |
| :---: | :---: | :---: | :---: |
| **$m = 1$** (Scalar Sensor) | $3.841$ | $6.635$ | $10.828$ |
| **$m = 2$** (2D Position / Pixel) | $5.991$ | $9.210$ | $13.816$ |
| **$m = 3$** (3D Position) | $7.815$ | $11.345$ | $16.266$ |
| **$m = 4$** (GPS Pseudorange) | $9.488$ | $13.277$ | $18.467$ |
| **$m = 6$** (Full 6-DoF Pose) | $12.592$ | $16.812$ | $22.458$ |

### Gating Decision Logic:
- **Case 1: Acceptance ($\epsilon_{y, k} \le \gamma_\alpha$):**
  The measurement is consistent with prior belief and sensor noise. Execute standard Kalman measurement update.
- **Case 2: Rejection ($\epsilon_{y, k} > \gamma_\alpha$):**
  The measurement is an anomaly or outlier. **Do not update the state.** Set $\hat{x}_{k|k} = \hat{x}_{k|k-1}$ and $P_{k|k} = P_{k|k-1}$.
- **Case 3: Soft Gating (Adaptive Noise Inflation):**
  Rather than binary rejection, inflate measurement noise by an adaptive scaling factor $\kappa > 1$:
  $$\tilde{R}_k = \frac{\epsilon_{y, k}}{\gamma_\alpha} R_k$$
  This allows large maneuvers to be accommodated without filter divergence.

---

## 11.6 Normalized Estimation Error Squared (NEES)

To verify the consistency of a Kalman filter in simulation or benchmark environments where ground-truth state $x_k$ is known, we evaluate the **Normalized Estimation Error Squared (NEES)**:

$$\epsilon_{x, k} = (x_k - \hat{x}_{k|k})^T P_{k|k}^{-1} (x_k - \hat{x}_{k|k}) \sim \chi_n^2$$

For $N_{\text{mc}}$ Monte Carlo runs, the average NEES $\bar{\epsilon}_k = \frac{1}{N_{\text{mc}}} \sum_{i=1}^{N_{\text{mc}}} \epsilon_{x, k}^{(i)}$ satisfies:
$$N_{\text{mc}} \bar{\epsilon}_k \sim \chi_{n \cdot N_{\text{mc}}}^2$$

If $\bar{\epsilon}_k > \text{threshold}$, the filter is **overconfident** (optimistic $P$). If $\bar{\epsilon}_k < \text{threshold}$, the filter is **conservative** (pessimistic $P$).

---

## 11.7 Mathematical Problem Set

### Problem 11.1 (Worked Example): Complete 2-Step RTS Backward Pass
**Problem Statement:** A 1D tracking system has state $x_k$ and transition $F = 1.0, Q = 1.0$.
A 2-step causal filter run produces the cached estimates:
- Step 0: $\hat{x}_{0|0} = 0.0, \quad P_{0|0} = 1.0$.
- Step 1: $\hat{x}_{1|0} = 0.0, \quad P_{1|0} = 2.0$. Measurement $z_1 = 3.0$ arrives ($H = 1, R = 2$).
  $$S_1 = 4.0, \quad K_1 = 0.5, \quad \hat{x}_{1|1} = 1.5, \quad P_{1|1} = 1.0$$
- Step 2: $\hat{x}_{2|1} = 1.5, \quad P_{2|1} = 2.0$. Measurement $z_2 = 5.5$ arrives ($H = 1, R = 2$).
  $$S_2 = 4.0, \quad K_2 = 0.5, \quad \hat{x}_{2|2} = 3.5, \quad P_{2|2} = 1.0$$
Execute the RTS backward smoother to compute smoothed state $\hat{x}_{1|2}, \hat{x}_{0|2}$ and covariances $P_{1|2}, P_{0|2}$.

**Step-by-Step Derivation:**
1. Step $N = 2$ (Terminal Boundary):
   $$\hat{x}_{2|2} = 3.5, \quad P_{2|2} = 1.0$$
2. Backward Pass to Step $k = 1$:
   - Smoother gain:
     $$C_1 = P_{1|1} F^T P_{2|1}^{-1} = 1.0 \times 1.0 \times \frac{1}{2.0} = 0.50$$
   - Smoothed state:
     $$\hat{x}_{1|2} = \hat{x}_{1|1} + C_1 (\hat{x}_{2|2} - \hat{x}_{2|1}) = 1.5 + 0.50 (3.5 - 1.5) = 1.5 + 0.50(2.0) = 1.5 + 1.0 = 2.50$$
     *(Notice: future measurement $z_2 = 5.5$ pulled the estimate at step 1 up from $1.5$ to $2.5$!)*
   - Smoothed covariance:
     $$P_{1|2} = P_{1|1} + C_1 (P_{2|2} - P_{2|1}) C_1^T = 1.0 + (0.5)^2 (1.0 - 2.0) = 1.0 + 0.25 (-1.0) = 1.0 - 0.25 = 0.75$$
     *(Notice: variance contracted from $1.0$ down to $0.75$!).*
3. Backward Pass to Step $k = 0$:
   - Smoother gain:
     $$C_0 = P_{0|0} F^T P_{1|0}^{-1} = 1.0 \times 1.0 \times \frac{1}{2.0} = 0.50$$
   - Smoothed state:
     $$\hat{x}_{0|2} = \hat{x}_{0|0} + C_0 (\hat{x}_{1|2} - \hat{x}_{1|0}) = 0.0 + 0.50 (2.50 - 0.0) = 1.25$$
   - Smoothed covariance:
     $$P_{0|2} = P_{0|0} + C_0 (P_{1|2} - P_{1|0}) C_0^T = 1.0 + (0.5)^2 (0.75 - 2.0) = 1.0 + 0.25 (-1.25) = 1.0 - 0.3125 = 0.6875$$

**Final Result:**
$$\hat{x}_{0|2} = 1.25, \quad P_{0|2} = 0.6875; \quad \hat{x}_{1|2} = 2.50, \quad P_{1|2} = 0.7500; \quad \hat{x}_{2|2} = 3.50, \quad P_{2|2} = 1.0000$$

---

### Problem 11.2 (Worked Example): Chi-Square Outlier Gating Test in 2D
**Problem Statement:** A 2D mobile robot has predicted position $\hat{p} = [10.0, 5.0]^T\text{ m}$ with predicted covariance $P = \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 1.0 \end{bmatrix}\text{ m}^2$.
A GPS receiver reports $z_{\text{GPS}} = [14.0, 9.0]^T\text{ m}$ with noise covariance $R = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix}\text{ m}^2$.
1. Compute the innovation vector $y \in \mathbb{R}^2$.
2. Compute the innovation covariance $S \in \mathbb{R}^{2 \times 2}$ and its inverse $S^{-1}$.
3. Compute the Normalized Innovation Squared $\epsilon_y = y^T S^{-1} y$.
4. At a $99\%$ confidence level ($\alpha = 0.01, \gamma = 9.210$), determine whether the GPS measurement should be accepted or rejected.

**Step-by-Step Derivation:**
1. Innovation vector:
   $$y = z_{\text{GPS}} - \hat{p} = \begin{bmatrix} 14.0 - 10.0 \\ 9.0 - 5.0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 4.0 \end{bmatrix}\text{ m}$$
2. Innovation covariance:
   $$S = P + R = \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 1.0 \end{bmatrix} + \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix} = \begin{bmatrix} 3.0 & 0.5 \\ 0.5 & 2.0 \end{bmatrix}$$
   Determinant:
   $$\det(S) = (3.0)(2.0) - (0.5)^2 = 6.0 - 0.25 = 5.75$$
   Inverse:
   $$S^{-1} = \frac{1}{5.75} \begin{bmatrix} 2.0 & -0.5 \\ -0.5 & 3.0 \end{bmatrix} \approx \begin{bmatrix} 0.347826 & -0.086957 \\ -0.086957 & 0.521739 \end{bmatrix}$$
3. Normalized Innovation Squared (NIS):
   $$S^{-1} y = \frac{1}{5.75} \begin{bmatrix} 2.0(4.0) - 0.5(4.0) \\ -0.5(4.0) + 3.0(4.0) \end{bmatrix} = \frac{1}{5.75} \begin{bmatrix} 8.0 - 2.0 \\ -2.0 + 12.0 \end{bmatrix} = \frac{1}{5.75} \begin{bmatrix} 6.0 \\ 10.0 \end{bmatrix} \approx \begin{bmatrix} 1.043478 \\ 1.739130 \end{bmatrix}$$
   $$\epsilon_y = y^T (S^{-1} y) = \begin{bmatrix} 4.0 & 4.0 \end{bmatrix} \begin{bmatrix} 1.043478 \\ 1.739130 \end{bmatrix} = 4.0(1.043478 + 1.739130) = 4.0(2.782609) \approx 11.1304$$
4. Hypothesis test comparison:
   Degrees of freedom: $m = 2$.
   Critical threshold at $99\%$ confidence: $\chi^2(2)_{0.99} = 9.210$.
   $$\epsilon_y = 11.1304 > 9.210$$
   The test statistic exceeds the $99\%$ threshold ($p \approx 0.0038 < 0.01$).
   The measurement is **rejected** as a statistical outlier.

**Final Result:**
$$\epsilon_y = 11.130 > 9.210 \implies \mathbf{REJECT\ GPS\ MEASUREMENT}$$

---

### Problem 11.3 (Worked Example): Fixed-Lag Smoother Formulation
**Problem Statement:** In visual-inertial odometry, a fixed lag of $L = 2$ frames is used. State is augmented as $X_k = [x_k, x_{k-1}, x_{k-2}]^T$. Write the state transition matrix $F_{\text{aug}}$ and explain how standard Kalman measurement updates at step $k$ immediately smooth historical states $x_{k-1}$ and $x_{k-2}$.

**Step-by-Step Derivation:**
1. Augmented state vector:
   $$X_k = \begin{bmatrix} x_k \\ x_{k-1} \\ x_{k-2} \end{bmatrix} \in \mathbb{R}^{3n}$$
2. Augmented state transition:
   $$X_k = \begin{bmatrix} F & 0 & 0 \\ I_n & 0 & 0 \\ 0 & I_n & 0 \end{bmatrix} \begin{bmatrix} x_{k-1} \\ x_{k-2} \\ x_{k-3} \end{bmatrix} + \begin{bmatrix} I_n \\ 0 \\ 0 \end{bmatrix} w_k$$
3. Augmented Covariance:
   $$P_{\text{aug}} = \begin{bmatrix} P_{00} & P_{01} & P_{02} \\ P_{10} & P_{11} & P_{12} \\ P_{20} & P_{21} & P_{22} \end{bmatrix} \in \mathbb{R}^{3n \times 3n}$$
4. Measurement update at step $k$:
   Measurement $z_k$ observes the current state: $H_{\text{aug}} = [H, 0, 0]$.
   Kalman Gain:
   $$K_{\text{aug}} = P_{\text{aug}} H_{\text{aug}}^T S_k^{-1} = \begin{bmatrix} P_{00} H^T \\ P_{10} H^T \\ P_{20} H^T \end{bmatrix} S_k^{-1} = \begin{bmatrix} K_0 \\ K_1 \\ K_2 \end{bmatrix}$$
5. State update:
   $$\hat{x}_{k-1|k} = \hat{x}_{k-1|k-1} + K_1 (z_k - H \hat{x}_{k|k-1})$$
   $$\hat{x}_{k-2|k} = \hat{x}_{k-2|k-1} + K_2 (z_k - H \hat{x}_{k|k-1})$$
   The measurement $z_k$ directly updates and refines historical states through the off-diagonal cross-covariances $P_{10}$ and $P_{20}$.

**Final Result:**
Augmented state Kalman filter performs real-time causal fixed-lag smoothing.

---

### Problem 11.4 (Worked Example): Asymptotic Variance Reduction of Smoothing over Filtering
**Problem Statement:** For a 1D random walk with position measurements: $x_k = x_{k-1} + w_k, z_k = x_k + v_k$ with $q = 1, r = 1$.
1. Compute the steady-state filtering variance $p_\infty$.
2. Compute the steady-state smoother gain $C_\infty$.
3. Compute the steady-state smoothed variance $p_{\text{smooth},\infty}$ in the interior of a long trajectory ($k \ll N$).
4. Calculate the percentage variance reduction achieved by smoothing.

**Step-by-Step Derivation:**
1. Steady-state filtering prior variance (from Problem 7.3):
   $$p_\infty = \frac{1 + \sqrt{1 + 4(1)(1)}}{2} = \frac{1 + \sqrt{5}}{2} \approx 1.618034\text{ (The Golden Ratio!)}$$
   Filtering posterior variance:
   $$p_{\text{filt}} = \frac{p_\infty r}{p_\infty + r} = \frac{1.618034}{2.618034} = \frac{1}{\phi} = \phi - 1 \approx 0.618034$$
2. Steady-state smoother gain:
   $$C_\infty = p_{\text{filt}} F^T p_\infty^{-1} = \frac{0.618034}{1.618034} \approx 0.381966$$
   Notice that $C_\infty = (\phi - 1)/\phi = 1/\phi^2 \approx 0.381966$.
3. Smoothed variance recursion at steady-state:
   $$p_{\text{smooth}} = p_{\text{filt}} + C_\infty (p_{\text{smooth}} - p_\infty) C_\infty$$
   $$p_{\text{smooth}} (1 - C_\infty^2) = p_{\text{filt}} - C_\infty^2 p_\infty$$
   Substitute $p_{\text{filt}} = 0.618034, p_\infty = 1.618034, C_\infty = 0.381966 \implies C_\infty^2 \approx 0.145898$:
   $$1 - C_\infty^2 = 1 - 0.145898 = 0.854102$$
   $$p_{\text{filt}} - C_\infty^2 p_\infty = 0.618034 - (0.145898)(1.618034) = 0.618034 - 0.236068 = 0.381966$$
   $$p_{\text{smooth}} = \frac{0.381966}{0.854102} \approx 0.447214$$
   Notice: $0.447214 = \frac{1}{\sqrt{5}} = \frac{1}{2.236068}$!
4. Percentage reduction in estimation variance:
   $$\text{Reduction} = \frac{p_{\text{filt}} - p_{\text{smooth}}}{p_{\text{filt}}} = \frac{0.618034 - 0.447214}{0.618034} = \frac{0.170820}{0.618034} \approx 27.64\%$$

**Final Result:**
$$p_{\text{filt}} = 0.6180, \quad p_{\text{smooth}} = 0.4472 = \frac{1}{\sqrt{5}} \quad (\text{Smoothing reduces variance by }27.64\%)$$

---

### Problem 11.5 (Worked Example): Two-Filter Smoother Form (Fraser-Potter)
**Problem Statement:** In 1969, Donald C. Fraser and James E. Potter formulated an alternative smoothing algorithm by running two independent Kalman filters: a forward filter from $0 \to k$, and a backward filter from $N \to k$. Write the information fusion formula combining the forward estimate $(\hat{x}_f, P_f)$ and backward estimate $(\hat{x}_b, P_b)$ into the smoothed estimate $\hat{x}_s$.

**Step-by-Step Derivation:**
1. Forward filter generates causal belief $p(x_k | z_{1:k}) = \mathcal{N}(\hat{x}_f, P_f)$.
2. Backward filter generates anti-causal belief $p(z_{k+1:N} | x_k) \propto \mathcal{N}(\hat{x}_b, P_b)$.
3. By Bayes' theorem, conditioned on the independent forward and backward measurement sets:
   $$p(x_k | z_{1:N}) \propto p(x_k | z_{1:k}) p(z_{k+1:N} | x_k)$$
4. The product of two Gaussian PDFs is Gaussian with information matrix addition:
   $$P_s^{-1} = P_f^{-1} + P_b^{-1}$$
   $$P_s^{-1} \hat{x}_s = P_f^{-1} \hat{x}_f + P_b^{-1} \hat{x}_b$$
5. Solving for smoothed covariance and state:
   $$P_s = (P_f^{-1} + P_b^{-1})^{-1}$$
   $$\hat{x}_s = P_s (P_f^{-1} \hat{x}_f + P_b^{-1} \hat{x}_b)$$

**Final Result:**
Fraser-Potter smoother fuses forward and backward information matrices via $P_s^{-1} = P_f^{-1} + P_b^{-1}$.

---

### Problem 11.6 (Worked Example): Monte Carlo NEES Consistency Evaluation
**Problem Statement:** A 4-state Kalman filter ($n = 4$) is evaluated across $N_{\text{mc}} = 50$ Monte Carlo simulation trials. At step $k = 100$, the average NEES is $\bar{\epsilon}_{100} = 6.2$. Using the $95\%$ two-tailed Chi-square acceptance interval for $N_{\text{mc}} \bar{\epsilon} \sim \chi^2(n \cdot N_{\text{mc}})$, test if the filter is statistically consistent.

**Step-by-Step Derivation:**
1. Degrees of freedom:
   $$d = n \cdot N_{\text{mc}} = 4 \times 50 = 200$$
2. Expected value and standard deviation of $\chi^2(200)$:
   $$\mathbb{E}[\chi^2(d)] = d = 200$$
   $$\operatorname{Var}(\chi^2(d)) = 2 d = 400 \implies \sigma = \sqrt{400} = 20$$
3. For $d = 200$, using Gaussian approximation for $\chi^2$:
   $$95\% \text{ interval: } [d - 1.96\sigma, d + 1.96\sigma] = [200 - 1.96(20), 200 + 1.96(20)] = [200 - 39.2, 200 + 39.2] = [160.8, 239.2]$$
   Dividing by $N_{\text{mc}} = 50$ to get bounds for $\bar{\epsilon}$:
   $$\bar{\epsilon}_{\text{lower}} = \frac{160.8}{50} = 3.216$$
   $$\bar{\epsilon}_{\text{upper}} = \frac{239.2}{50} = 4.784$$
4. Test evaluation:
   $$\bar{\epsilon}_{100} = 6.2 > 4.784$$
5. Conclusion:
   The empirical NEES significantly exceeds the upper $95\%$ bound. The filter estimation error is substantially larger than what its covariance $P$ claims.
   The filter is **statistically inconsistent and overconfident** (optimistic covariance). Process noise $Q$ must be increased or sensor noise $R$ adjusted.

**Final Result:**
$$\bar{\epsilon} = 6.2 \notin [3.22, 4.78] \implies \mathbf{Inconsistent\ (Overconfident\ Filter)}$$

---

### Problem 11.7 (Worked Example): Reversible Dynamic Inversion in Backward Pass
**Problem Statement:** In the RTS smoother gain $C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$, show that if the transition matrix $F$ is invertible, $C_k$ can be computed without inverting the prior covariance $P_{k+1|k}$.

**Step-by-Step Derivation:**
1. Recall covariance prediction:
   $$P_{k+1|k} = F P_{k|k} F^T + Q$$
2. Invert both sides:
   $$P_{k+1|k}^{-1} = (F P_{k|k} F^T + Q)^{-1}$$
3. Applying the push-through matrix identity:
   $$P_{k|k} F^T (F P_{k|k} F^T + Q)^{-1} = (P_{k|k}^{-1} + F^T Q^{-1} F)^{-1} F^T Q^{-1}$$
4. For zero process noise ($Q \to 0$):
   $$C_k = P_{k|k} F^T (F P_{k|k} F^T)^{-1} = P_{k|k} F^T F^{-T} P_{k|k}^{-1} F^{-1} = F^{-1}$$
5. Under deterministic dynamics, the smoother gain is simply the backward dynamic state transition $F^{-1}$. $\blacksquare$

---

### Problem 11.8 (Worked Example): Sequential Chi-Square Gating for Multi-Sensor Suites
**Problem Statement:** A robot receives a 3D sensor packet consisting of horizontal laser range $(x, y)$ and vertical ultrasonic altitude $z$. Instead of rejecting the entire 3D packet when the ultrasonic sensor gets a false echo, formulate the sequential scalar gating pipeline.

**Step-by-Step Derivation:**
1. Assume sensor noise is uncorrelated: $R = \operatorname{diag}(r_x, r_y, r_z)$.
2. Evaluate measurement 1 ($z_x$):
   $$s_x = H_x P H_x^T + r_x \implies \epsilon_x = \frac{(z_x - \hat{x})^2}{s_x}$$
   Test: if $\epsilon_x \le \chi^2(1)_{0.99} = 6.635$, apply scalar update to $(\hat{x}, P)$; else discard $z_x$.
3. Evaluate measurement 2 ($z_y$):
   Using updated covariance $P^{(1)}$, test $\epsilon_y = \frac{(z_y - \hat{y}^{(1)})^2}{s_y}$.
   If $\epsilon_y \le 6.635$, apply update; else discard $z_y$.
4. Evaluate measurement 3 ($z_z$):
   Using updated covariance $P^{(2)}$, test $\epsilon_z = \frac{(z_z - \hat{z}^{(2)})^2}{s_z}$.
   If $\epsilon_z > 6.635$ (ultrasonic glitch), discard $z_z$.
5. Benefit:
   Horizontal position $(x, y)$ was successfully updated, while the corrupt vertical altitude was isolated and eliminated.

**Final Result:**
Sequential gating isolates faulty sensor channels without discarding valid concurrent channels.

---

### Problem 11.9 (Worked Example): Smoother Boundary Condition at $k = 0$
**Problem Statement:** In a 100-step trajectory, prove why the smoothed initial state $\hat{x}_{0|N}$ is vastly more accurate than the filtered initial estimate $\hat{x}_{0|0}$.

**Step-by-Step Derivation:**
1. At $k = 0$, the filter has only seen $z_0$:
   $$P_{0|0}^{-1} = P_{\text{prior}}^{-1} + H_0^T R_0^{-1} H_0$$
2. The smoothed estimate $\hat{x}_{0|N}$ is conditioned on all $N$ measurements $\{z_0, z_1, \dots, z_N\}$.
3. In information form:
   $$P_{0|N}^{-1} = P_{\text{prior}}^{-1} + \sum_{k=0}^N \Phi^T(k, 0) H_k^T R_k^{-1} H_k \Phi(k, 0)$$
4. The information matrix is accumulated over all $N$ future measurements.
   As $N \to \infty$, $P_{0|N}^{-1} \to \infty \implies P_{0|N} \to 0$.
   The initial position and velocity can be resolved with near-arbitrary precision in post-processing. $\blacksquare$

---

### Problem 11.10 (Worked Example): Memory Complexity of RTS Smoother
**Problem Statement:** A high-rate robotics pipeline runs at $500\text{ Hz}$ for $10\text{ minutes}$ ($600\text{ s}$) with state dimension $n = 15$. Compute the total memory required in megabytes (MB) to cache the forward filter trajectory for RTS backward smoothing in 64-bit IEEE double precision.

**Step-by-Step Derivation:**
1. Number of time steps:
   $$N = 500\text{ Hz} \times 600\text{ s} = 300,000\text{ steps}$$
2. Storage per time step:
   - State vector $\hat{x}_{k|k} \in \mathbb{R}^{15}$: 15 doubles.
   - Predicted state $\hat{x}_{k+1|k} \in \mathbb{R}^{15}$: 15 doubles.
   - Covariance $P_{k|k} \in \mathbb{S}^{15}$: symmetric, $\frac{15 \times 16}{2} = 120$ doubles.
   - Predicted covariance $P_{k+1|k} \in \mathbb{S}^{15}$: 120 doubles.
   - Total doubles per step: $15 + 15 + 120 + 120 = 270$ doubles.
3. Total bytes:
   Each double is 8 bytes.
   $$\text{Bytes per step} = 270 \times 8 = 2,160\text{ bytes} \approx 2.16\text{ KB}$$
   $$\text{Total bytes} = 300,000 \times 2,160 = 648,000,000\text{ bytes}$$
4. In megabytes:
   $$\text{Total Memory} = \frac{648,000,000}{1024^2} \approx 617.98\text{ MB}$$

**Final Result:**
$$\text{Memory Required} \approx 618\text{ MB}$$
Easily fits in RAM on modern robotics onboard computers.

---

### Problem 11.11 (Solved Exercise): Chi-Square Quantiles for Alpha = 0.05
**Problem Statement:** Look up or compute the critical value $\chi^2(m)_{0.95}$ for $m = 1, 2, 3, 4, 5$.

**Step-by-Step Solution:**
From the cumulative Chi-square distribution:
- $m = 1$: $3.841$
- $m = 2$: $5.991$
- $m = 3$: $7.815$
- $m = 4$: $9.488$
- $m = 5$: $11.070$

**Final Answer:**
$$\chi_{0.95}^2 = \{3.841, 5.991, 7.815, 9.488, 11.070\}$$

---

### Problem 11.12 (Solved Exercise): Smoother Symmetry Preservation
**Problem Statement:** Prove that the RTS backward covariance update $P_{k|N} = P_{k|k} + C_k (P_{k+1|N} - P_{k+1|k}) C_k^T$ guarantees that $P_{k|N}$ is symmetric.

**Step-by-Step Solution:**
1. $P_{k|k}$ is symmetric by definition ($P_{k|k}^T = P_{k|k}$).
2. The perturbation term is $\Delta = C_k (P_{k+1|N} - P_{k+1|k}) C_k^T$.
3. Take transpose:
   $$\Delta^T = (C_k (P_{k+1|N} - P_{k+1|k}) C_k^T)^T = (C_k^T)^T (P_{k+1|N} - P_{k+1|k})^T C_k^T = C_k (P_{k+1|N} - P_{k+1|k}) C_k^T = \Delta$$
4. Since the sum of two symmetric matrices is symmetric, $P_{k|N}$ is strictly symmetric. $\blacksquare$

---

### Problem 11.13 (Solved Exercise): Terminal Boundary Condition of RTS
**Problem Statement:** Show that at the final step $k = N$, the smoother update equations evaluate to $\hat{x}_{N|N}$ and $P_{N|N}$.

**Step-by-Step Solution:**
At step $N$, the forward filter has already processed all measurements $z_{1:N}$.
By definition:
$$\hat{x}_{N|N} = \mathbb{E}[x_N | z_{1:N}]$$
$$P_{N|N} = \operatorname{Cov}(x_N | z_{1:N})$$
No backward step is required at $k = N$; it serves as the initial boundary condition for the backward recursion. $\blacksquare$

---

### Problem 11.14 (Solved Exercise): False Alarm Rate in Innovation Gating
**Problem Statement:** If a filter sets its rejection gate at $\gamma = \chi^2(3)_{0.99} = 11.345$, on average how many perfectly valid, fault-free measurements will be rejected out of 10,000 incoming updates?

**Step-by-Step Solution:**
1. Significance level $\alpha = 1 - 0.99 = 0.01 = 1\%$.
2. For $N = 10,000$ independent Gaussian measurements under $H_0$:
   $$\text{Expected Rejections} = \alpha \times N = 0.01 \times 10,000 = 100$$
3. Exactly $100$ valid measurements are discarded as false alarms.

**Final Answer:**
$$100\text{ valid measurements (1.0\%)}$$

---

### Problem 11.15 (Solved Exercise): Fixed-Interval vs Fixed-Lag Latency
**Problem Statement:** Compare the algorithmic latency of fixed-interval smoothing versus fixed-lag smoothing in an autonomous driving car.

**Step-by-Step Solution:**
1. Fixed-interval smoothing requires waiting until the entire mission terminates before computing the backward pass. Latency is infinite in real-time.
2. Fixed-lag smoothing delivers smoothed estimates with a deterministic latency of $L \Delta t$ (e.g. $100\text{ ms}$). This is compatible with perception pipelines that can tolerate $100\text{ ms}$ delay for map building. $\blacksquare$

---

### Problem 11.16 (Solved Exercise): Covariance Invertibility in Smoother Gain
**Problem Statement:** Why does computing $C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$ require $P_{k+1|k}$ to be strictly positive-definite? How does process noise $Q > 0$ guarantee this?

**Step-by-Step Solution:**
1. $P_{k+1|k} = F P_{k|k} F^T + Q$.
2. If $Q \in \mathbb{S}_{++}^n$ (strictly positive-definite), then for any $z \neq 0$:
   $$z^T P_{k+1|k} z = (F^T z)^T P_{k|k} (F^T z) + z^T Q z \ge 0 + z^T Q z > 0$$
3. Thus $P_{k+1|k}$ has strictly positive eigenvalues ($\lambda_{\min} \ge \lambda_{\min}(Q) > 0$), guaranteeing that $P_{k+1|k}^{-1}$ always exists and is well-conditioned. $\blacksquare$

---

### Problem 11.17 (Solved Exercise): RTS Smoothing on Nonlinear Systems (Extended RTS)
**Problem Statement:** How is the RTS smoother applied to nonlinear systems modeled by an Extended Kalman Filter?

**Step-by-Step Solution:**
1. In the forward pass, save the linearized Jacobians $F_k = \left.\frac{\partial f}{\partial x}\right|_{\hat{x}_{k-1|k-1}}$ along with state and covariance trajectories.
2. In the backward pass, evaluate the smoother gain using the saved Jacobian:
   $$C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$$
3. Propagate state using the nonlinear dynamic model:
   $$\hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - f(\hat{x}_{k|k}, u_k)) \quad \blacksquare$$

---

### Problem 11.18 (Solved Exercise): Innovation Whiteness Re-test
**Problem Statement:** If a sensor exhibits slow bias drift, how does the cumulative sum of innovations $\sum y_k$ detect this drift before the instantaneous NIS triggers?

**Step-by-Step Solution:**
1. A small bias $b = 0.5\sigma$ produces instantaneous NIS $\epsilon = (0.5)^2 = 0.25$, which never triggers the $\chi^2$ threshold ($3.84$).
2. However, the cumulative sum $S_N = \sum_{k=1}^N y_k$ accumulates as $N \cdot b$, growing linearly with time.
3. The CUSUM (cumulative sum) test triggers when $|S_N| > h \sqrt{N}$, detecting subtle systematic biases within seconds. $\blacksquare$

---

### Problem 11.19 (Solved Exercise): Zero Gain Smoother Invariance
**Problem Statement:** If $C_k = 0$, what do the smoothed state and covariance evaluate to?

**Step-by-Step Solution:**
1. $\hat{x}_{k|N} = \hat{x}_{k|k} + 0 = \hat{x}_{k|k}$.
2. $P_{k|N} = P_{k|k} + 0 = P_{k|k}$.
3. If future measurements convey zero information about state $k$ ($C_k = 0$), the smoothed estimate remains identically equal to the causal filter estimate. $\blacksquare$

---

### Problem 11.20 (Solved Exercise): Computational Complexity of Fixed-Interval RTS
**Problem Statement:** For a trajectory of $N$ steps with state dimension $n$, compute the total flop count of the RTS backward pass.

**Step-by-Step Solution:**
At each backward step $k$:
1. Solve $P_{k+1|k} X = F_{k+1} P_{k|k}$ via Cholesky decomposition: $\frac{1}{3} n^3 + 2 n^3 = \frac{7}{3} n^3$ flops.
2. State update: $\mathcal{O}(n^2)$ flops.
3. Covariance update: $C_k \Delta P C_k^T \approx 2 n^3$ flops.
Total per step: $\sim \frac{13}{3} n^3$ flops.
Across $N$ steps:
$$\text{Total Flops} \approx \frac{13}{3} N n^3$$
For $N = 10,000, n = 6$: $\frac{13}{3} \times 10000 \times 216 \approx 9.36 \times 10^6\text{ flops}$, executing in under $10\text{ ms}$.

**Final Answer:**
$$\text{Complexity} = \mathcal{O}(N n^3)\text{ flops}$$
