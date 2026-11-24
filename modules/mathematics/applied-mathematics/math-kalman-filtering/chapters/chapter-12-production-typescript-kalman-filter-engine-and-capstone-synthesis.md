# Chapter 12: Production TypeScript Kalman Filter Engine and Capstone Synthesis

## 12.1 Architecture of the Production TypeScript Kalman Filtering Engine

In production autonomous robotics, state estimation algorithms cannot rely on heavyweight interpreted scientific packages (such as NumPy or SciPy) or garbage-collected black-box libraries with unpredictable allocation latencies. A flight controller for a quadrotor operating at $1\text{ kHz}$, a surgical manipulator controller, or an autonomous vehicle perception pipeline requires a **zero-dependency, numerically stable, deterministic TypeScript engine**.

The file `kalman-filter-engine.ts` serves as this industrial foundation. It encapsulates the full spectrum of estimation algorithms developed across this treatise:

```
+---------------------------------------------------------------------------------------------------+
|                            kalman-filter-engine.ts ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | LINEAR ALGEBRA SUBSYSTEM                                                                    |  |
|  |   - Vector: Dot products, Euclidean norms, element-wise arithmetic, outer products          |  |
|  |   - Matrix: Addition, multiplication, transpose, trace, determinant, symmetry enforcement   |  |
|  |   - Cholesky Factorization: A = L L^T (O(n^3/3) with strict positive-definiteness checks)    |  |
|  |   - Linear System Solver: L L^T x = b via forward and backward substitution                 |  |
|  |   - Matrix Inversion: Numerically stable inversion with post-hoc symmetry enforcement       |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|         +--------------------------------------+------------------------------------+             |
|         |                                      |                                    |             |
|         v                                      v                                    v             |
|  +-----------------------+     +-------------------------------+     +-----------------------+    |
|  | ScalarKalmanFilter    |     | LinearKalmanFilter            |     | ExtendedKalmanFilter  |    |
|  | - 1D state & meas     |     | - Multivariable state & meas  |     | - Nonlinear f(x,u)    |    |
|  | - Exact DARE p_\infty |     | - Joseph Stabilized P update  |     | - Nonlinear h(x)      |    |
|  | - Gain tuning metrics |     | - Cholesky innovation solve   |     | - Finite-diff Jacobians|   |
|  +-----------------------+     +-------------------------------+     +-----------------------+    |
|                                                |                                                  |
|         +--------------------------------------+------------------------------------+             |
|         |                                                                           |             |
|         v                                                                           v             |
|  +-------------------------------+                                           +------------------+ |
|  | UnscentedKalmanFilter (UKF)   |                                           | RTSSmoother      | |
|  | - Scaled Merwe transform      |                                           | - Forward cache  | |
|  | - Deterministic 2n+1 sigmas   |                                           | - Backward pass  | |
|  | - 3rd-order Taylor accuracy   |                                           | - P_s <= P_filt  | |
|  +-------------------------------+                                           +------------------+ |
|                                                |                                                  |
|                                                v                                                  |
|                                  +---------------------------+                                    |
|                                  | ChiSquareGating           |                                    |
|                                  | - NIS test: y^T S^-1 y    |                                    |
|                                  | - Exact Chi-square bounds |                                    |
|                                  | - Outlier rejection       |                                    |
|                                  +---------------------------+                                    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 12.2 Ten Civilizational Grand Gauntlets

### Problem 12.1 (Grand Gauntlet): First-Principles Matrix Calculus Derivation of the Multivariable Kalman Gain
**Problem Statement:** Provide an uncompromising, step-by-step first-principles derivation of the multivariable Kalman Gain matrix $K_k^* \in \mathbb{R}^{n \times m}$ that minimizes the posterior mean squared error $\operatorname{tr}(P_{k|k})$, including full matrix derivative expansions and second-order sufficiency verification.

**Step-by-Step Derivation:**
1. State update: $\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k (z_k - H_k \hat{x}_{k|k-1})$.
2. Posterior error: $\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$.
3. Posterior covariance (Joseph form):
   $$P_{k|k} = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T$$
4. Cost function:
   $$J(K_k) = \operatorname{tr}(P_{k|k}) = \operatorname{tr}(P_{k|k-1}) - 2 \operatorname{tr}(K_k H_k P_{k|k-1}) + \operatorname{tr}(K_k S_k K_k^T)$$
   where $S_k = H_k P_{k|k-1} H_k^T + R_k \in \mathbb{S}_{++}^m$.
5. Matrix gradient:
   $$\frac{\partial \operatorname{tr}(K_k H_k P_{k|k-1})}{\partial K_k} = (H_k P_{k|k-1})^T = P_{k|k-1} H_k^T$$
   $$\frac{\partial \operatorname{tr}(K_k S_k K_k^T)}{\partial K_k} = 2 K_k S_k$$
   $$\nabla_{K_k} J(K_k) = -2 P_{k|k-1} H_k^T + 2 K_k S_k = 0 \implies K_k S_k = P_{k|k-1} H_k^T$$
6. Since $R_k > 0$, $S_k$ is strictly positive definite and invertible:
   $$K_k^* = P_{k|k-1} H_k^T S_k^{-1}$$
7. Second-order variation:
   $$J(K^* + \Delta K) - J(K^*) = \operatorname{tr}(\Delta K S_k \Delta K^T) = \sum_{i=1}^n \delta k_i^T S_k \delta k_i > 0 \quad \forall \, \Delta K \neq 0$$
   The solution is the unique global minimum. $\blacksquare$

---

### Problem 12.2 (Grand Gauntlet): Algebraic Proof of the Joseph Stabilized Covariance Form
**Problem Statement:** Prove algebraically that for any arbitrary gain $K$ (optimal or sub-optimal), the posterior error covariance satisfies $P_{k|k} = (I - K H) P_{k|k-1} (I - K H)^T + K R K^T$. Prove that $P_{k|k}$ is strictly positive semi-definite under arbitrary floating-point truncation.

**Step-by-Step Derivation:**
1. Error equation: $\tilde{x}_{k|k} = M \tilde{x}_{k|k-1} - K v_k$ where $M = I - K H$.
2. Outer product expectation:
   $$P_{k|k} = \mathbb{E}[(M \tilde{x}_{k|k-1} - K v_k)(M \tilde{x}_{k|k-1} - K v_k)^T]$$
   $$= M \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] M^T - M \mathbb{E}[\tilde{x}_{k|k-1} v_k^T] K^T - K \mathbb{E}[v_k \tilde{x}_{k|k-1}^T] M^T + K \mathbb{E}[v_k v_k^T] K^T$$
3. Since $v_k$ is independent of prior error: $\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$.
   $$P_{k|k} = M P_{k|k-1} M^T + K R_k K^T = (I - K H) P_{k|k-1} (I - K H)^T + K R_k K^T$$
4. Positive semi-definiteness:
   For any non-zero vector $z \in \mathbb{R}^n$:
   $$z^T P_{k|k} z = z^T M P_{k|k-1} M^T z + z^T K R_k K^T z = (M^T z)^T P_{k|k-1} (M^T z) + (K^T z)^T R_k (K^T z)$$
   Because $P_{k|k-1} \ge 0$ and $R_k > 0$, both quadratic forms are non-negative:
   $$z^T P_{k|k} z \ge 0 \quad \forall \, z \in \mathbb{R}^n \implies P_{k|k} \in \mathbb{S}_+^n \quad \blacksquare$$

---

### Problem 12.3 (Grand Gauntlet): Van Loan Discretization Proof
**Problem Statement:** Prove Charles Van Loan's theorem: if $\mathcal{M} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix}$ and $\exp(\mathcal{M} \Delta t) = \begin{bmatrix} \Phi_{11} & \Phi_{12} \\ 0 & \Phi_{22} \end{bmatrix}$, then $F = \Phi_{22}^T$ and $Q_k = \Phi_{22}^T \Phi_{12}$.

**Step-by-Step Derivation:**
1. Consider the linear matrix differential equation $\dot{\Phi}(t) = \mathcal{M} \Phi(t)$ with $\Phi(0) = I_{2n}$.
2. Block equations:
   $$\dot{\Phi}_{22}(t) = A^T \Phi_{22}(t), \quad \Phi_{22}(0) = I_n \implies \Phi_{22}(t) = e^{A^T t} = (e^{At})^T$$
   At $t = \Delta t$: $\Phi_{22}(\Delta t) = F^T \implies F = \Phi_{22}^T$.
3. Top-right block equation:
   $$\dot{\Phi}_{12}(t) = -A \Phi_{12}(t) + G Q_c G^T \Phi_{22}(t) = -A \Phi_{12}(t) + G Q_c G^T e^{A^T t}$$
4. Integrating factor $e^{At}$:
   $$\frac{d}{dt}\left( e^{At} \Phi_{12}(t) \right) = e^{At} G Q_c G^T e^{A^T t}$$
5. Integrating from $0$ to $\Delta t$ with $\Phi_{12}(0) = 0$:
   $$e^{A \Delta t} \Phi_{12}(\Delta t) = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau = Q_k$$
6. Pre-multiplying by $F = \Phi_{22}^T = e^{A \Delta t}$:
   $$Q_k = F \, \Phi_{12}(\Delta t) = \Phi_{22}^T \Phi_{12} \quad \blacksquare$$

---

### Problem 12.4 (Grand Gauntlet): Analytical DARE Solution for 2nd-Order Kinematics
**Problem Statement:** Derive the exact closed-form analytical steady-state covariance $P_\infty$ for the continuous 2D kinematic tracking system with $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, continuous acceleration noise $Q_c = \tilde{q}$, and continuous position noise $R_c = \tilde{r}$.

**Step-by-Step Derivation:**
1. Continuous Algebraic Riccati Equation (CARE):
   $$A P + P A^T + G Q_c G^T - P C^T R_c^{-1} C P = 0$$
   where $G = [0, 1]^T, C = [1, 0]$.
2. Let $P = \begin{bmatrix} P_{11} & P_{12} \\ P_{12} & P_{22} \end{bmatrix}$.
   $$A P + P A^T = \begin{bmatrix} 2 P_{12} & P_{22} \\ P_{22} & 0 \end{bmatrix}, \quad G Q_c G^T = \begin{bmatrix} 0 & 0 \\ 0 & \tilde{q} \end{bmatrix}, \quad P C^T R_c^{-1} C P = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11}^2 & P_{11} P_{12} \\ P_{11} P_{12} & P_{12}^2 \end{bmatrix}$$
3. Solving system of equations:
   $$(2, 2): \tilde{q} - \frac{P_{12}^2}{\tilde{r}} = 0 \implies P_{12} = \sqrt{\tilde{q} \tilde{r}}$$
   $$(1, 1): 2 P_{12} - \frac{P_{11}^2}{\tilde{r}} = 0 \implies P_{11}^2 = 2 \tilde{r} \sqrt{\tilde{q} \tilde{r}} = 2 \tilde{q}^{1/2} \tilde{r}^{3/2} \implies P_{11} = \sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}$$
   $$(1, 2): P_{22} - \frac{P_{11} P_{12}}{\tilde{r}} = 0 \implies P_{22} = \frac{(\sqrt{2}\tilde{q}^{1/4}\tilde{r}^{3/4})(\sqrt{\tilde{q}\tilde{r}})}{\tilde{r}} = \sqrt{2} \tilde{q}^{3/4} \tilde{r}^{1/4}$$
4. Steady-state continuous Kalman gain:
   $$K = P C^T R_c^{-1} = \begin{bmatrix} \sqrt{2} (\tilde{q}/\tilde{r})^{1/4} \\ (\tilde{q}/\tilde{r})^{1/2} \end{bmatrix}$$
   The estimator forms a critically damped Butterworth filter with cutoff $\omega_0 = (\tilde{q}/\tilde{r})^{1/4}$. $\blacksquare$

---

### Problem 12.5 (Grand Gauntlet): Third-Order Taylor Accuracy Proof of the Unscented Transform
**Problem Statement:** Prove that the Merwe scaled unscented transform reproduces the exact posterior mean through 3rd-order Taylor terms for any Gaussian input distribution.

**Step-by-Step Derivation:**
1. True Taylor expansion of $g(x)$ around $\bar{x}$ with $x - \bar{x} = \delta x$:
   $$\mathbb{E}[g(x)] = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + \mathcal{O}(D^4)$$
   (Odd moments vanish due to Gaussian symmetry).
2. Sigma-point expansion: $\mathcal{X}_i = \bar{x} + \Delta x_i$.
   $$\bar{y}_{\text{UKF}} = \sum_{i=0}^{2n} W_i^{(m)} g(\bar{x} + \Delta x_i) = g(\bar{x}) \sum W_i^{(m)} + \nabla g \sum W_i^{(m)} \Delta x_i + \frac{1}{2} \sum W_i^{(m)} \Delta x_i^T \nabla^2 g \Delta x_i + \frac{1}{6} \sum W_i^{(m)} D^3 g$$
3. By construction:
   - $\sum W_i^{(m)} = 1$.
   - $\sum W_i^{(m)} \Delta x_i = 0$ (symmetric pairs $\Delta x_{i+n} = -\Delta x_i$).
   - $\sum W_i^{(m)} \Delta x_i \Delta x_i^T = P$ (by Cholesky scaling).
   - $\sum W_i^{(m)} D^3 g = 0$ (odd symmetric terms cancel).
4. Thus:
   $$\bar{y}_{\text{UKF}} = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + \mathcal{O}(D^4) = \mathbb{E}[g(x)] + \mathcal{O}(D^4) \quad \blacksquare$$

---

### Problem 12.6 (Grand Gauntlet): Lie Group Error State Derivation for Quaternion ESKF on SO(3)
**Problem Statement:** Derive the linearized differential equation $\delta \dot{\theta} = -[\omega_b - b_g]_\times \delta \theta - \delta b_g - \eta_g$ on the Lie algebra $\mathfrak{so}(3)$.

**Step-by-Step Derivation:**
1. True and nominal kinematics:
   $$\dot{R}_t = R_t [\omega_t]_\times, \quad \dot{R}_{\text{nom}} = R_{\text{nom}} [\omega_{\text{nom}}]_\times$$
   where $\omega_t = \omega_b - b_{g, t} - \eta_g$, and $\omega_{\text{nom}} = \omega_b - b_{g, \text{nom}}$.
2. Error rotation definition:
   $$R_t = R_{\text{nom}} \operatorname{Exp}(\delta \theta) \approx R_{\text{nom}} (I + [\delta \theta]_\times)$$
3. Differentiating both sides:
   $$\dot{R}_t = \dot{R}_{\text{nom}} (I + [\delta \theta]_\times) + R_{\text{nom}} [\delta \dot{\theta}]_\times$$
4. Substitute kinematic equations:
   $$R_t [\omega_t]_\times = R_{\text{nom}} [\omega_{\text{nom}}]_\times (I + [\delta \theta]_\times) + R_{\text{nom}} [\delta \dot{\theta}]_\times$$
   $$R_{\text{nom}} (I + [\delta \theta]_\times) [\omega_t]_\times = R_{\text{nom}} [\omega_{\text{nom}}]_\times + R_{\text{nom}} [\omega_{\text{nom}}]_\times [\delta \theta]_\times + R_{\text{nom}} [\delta \dot{\theta}]_\times$$
5. Pre-multiply by $R_{\text{nom}}^T$:
   $$[\omega_t]_\times + [\delta \theta]_\times [\omega_t]_\times = [\omega_{\text{nom}}]_\times + [\omega_{\text{nom}}]_\times [\delta \theta]_\times + [\delta \dot{\theta}]_\times$$
6. Using the Lie bracket identity $[a]_\times [b]_\times - [b]_\times [a]_\times = [a \times b]_\times = [[a]_\times b]_\times$:
   $$[\delta \dot{\theta}]_\times = [\omega_t - \omega_{\text{nom}}]_\times + [\delta \theta \times \omega_{\text{nom}}]_\times = [-\delta b_g - \eta_g]_\times - [\omega_{\text{nom}} \times \delta \theta]_\times$$
7. Stripping the skew-symmetric operator:
   $$\delta \dot{\theta} = -[\omega_{\text{nom}}]_\times \delta \theta - \delta b_g - \eta_g \quad \blacksquare$$

---

### Problem 12.7 (Grand Gauntlet): Monotonic Variance Contraction under Measurement Updates
**Problem Statement:** Prove that for any prior covariance $P_{k|k-1} \ge 0$, measurement matrix $H$, and measurement noise $R > 0$, the posterior covariance satisfies $P_{k|k} \le P_{k|k-1}$ in the Loewner order.

**Step-by-Step Derivation:**
1. Difference: $\Delta P = P_{k|k-1} - P_{k|k} = K_k H_k P_{k|k-1}$.
2. Substitute optimal gain $K_k = P_{k|k-1} H_k^T S_k^{-1}$:
   $$\Delta P = P_{k|k-1} H_k^T S_k^{-1} H_k P_{k|k-1}$$
3. Let $B = H_k P_{k|k-1}$. Then $\Delta P = B^T S_k^{-1} B$.
4. For any $z \in \mathbb{R}^n$:
   $$z^T \Delta P z = (B z)^T S_k^{-1} (B z) \ge 0$$
   since $S_k^{-1} \in \mathbb{S}_{++}^m$.
5. Thus $\Delta P \ge 0 \implies P_{k|k} \le P_{k|k-1}$. $\blacksquare$

---

### Problem 12.8 (Grand Gauntlet): Optimality Proof of the Rauch-Tung-Striebel Backward Smoother
**Problem Statement:** Prove that the RTS smoother produces the absolute minimum variance linear estimate of state $x_k$ given all observations $Z_{1:N}$.

**Step-by-Step Derivation:**
1. The conditional distribution $p(x_k | Z_{1:N})$ is Gaussian by linear system properties.
2. By the Rao-Blackwell and total expectation theorems:
   $$\hat{x}_{k|N} = \mathbb{E}[x_k | Z_{1:N}] = \mathbb{E}[\mathbb{E}[x_k | x_{k+1}, Z_{1:k}] | Z_{1:N}]$$
3. Because $x_k$ and $x_{k+1}$ conditioned on $Z_{1:k}$ are jointly Gaussian with linear regression coefficient $C_k = P_{k|k} F^T P_{k+1|k}^{-1}$, the inner expectation is affine:
   $$\mathbb{E}[x_k | x_{k+1}, Z_{1:k}] = \hat{x}_{k|k} + C_k (x_{k+1} - \hat{x}_{k+1|k})$$
4. Taking expectation with respect to $p(x_{k+1} | Z_{1:N})$ directly gives:
   $$\hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - \hat{x}_{k+1|k})$$
5. Because the conditional expectation is the unique MMSE estimator in Hilbert space, the RTS smoother is mathematically optimal. $\blacksquare$

---

### Problem 12.9 (Grand Gauntlet): Whiteness and Orthogonality Proof of the Innovation Sequence
**Problem Statement:** Prove that the innovation sequence $y_k = z_k - H_k \hat{x}_{k|k-1}$ is orthogonal to all past measurements $Z_{1:k-1}$ and that $\mathbb{E}[y_j y_k^T] = S_k \delta_{jk}$.

**Step-by-Step Derivation:**
1. Condition on information set $Z_{1:k-1}$:
   $$\mathbb{E}[y_k | Z_{1:k-1}] = \mathbb{E}[z_k | Z_{1:k-1}] - H_k \hat{x}_{k|k-1} = H_k \hat{x}_{k|k-1} - H_k \hat{x}_{k|k-1} = 0$$
2. For any $j < k$, $y_j$ is a measurable function of $Z_{1:k-1}$.
   $$\mathbb{E}[y_k y_j^T] = \mathbb{E}[\mathbb{E}[y_k | Z_{1:k-1}] y_j^T] = \mathbb{E}[0 \cdot y_j^T] = 0$$
3. For $j = k$:
   $$\mathbb{E}[y_k y_k^T] = H_k P_{k|k-1} H_k^T + R_k = S_k$$
4. Thus $\mathbb{E}[y_j y_k^T] = S_k \delta_{jk}$. $\blacksquare$

---

### Problem 12.10 (Grand Gauntlet): Chi-Square Distribution Proof of the Normalized Innovation Squared (NIS)
**Problem Statement:** Prove that $\epsilon_{y, k} = y_k^T S_k^{-1} y_k \sim \chi_m^2$ when $y_k \sim \mathcal{N}(0, S_k)$ with $S_k \in \mathbb{S}_{++}^m$.

**Step-by-Step Derivation:**
1. Cholesky factorization: $S_k = L L^T$ where $L$ is invertible.
2. Define standardized variable $w = L^{-1} y_k$.
   $$\mathbb{E}[w] = 0, \quad \operatorname{Cov}(w) = L^{-1} S_k L^{-T} = L^{-1} (L L^T) L^{-T} = I_m$$
3. The components $w_1, \dots, w_m$ are independent standard normal random variables: $w_i \sim \mathcal{N}(0, 1)$.
4. Quadratic form:
   $$\epsilon_{y, k} = y_k^T S_k^{-1} y_k = y_k^T (L^{-T} L^{-1}) y_k = (L^{-1} y_k)^T (L^{-1} y_k) = w^T w = \sum_{i=1}^m w_i^2$$
5. By definition of the Chi-square distribution, the sum of squares of $m$ independent standard normal variables follows $\chi_m^2$. $\blacksquare$

---

## 12.3 Ten Capstone Mastery Problems

### Problem 12.11 (Capstone Mastery): 6-DoF Quadrotor State Estimation Fusing IMU, Barometer, and Rangefinder
**Problem Statement:** A 6-DoF quadrotor hovers indoors. Its state is $x = [p_z, v_z, b_{az}]^T$. An IMU reports vertical acceleration $a_z$ at $500\text{ Hz}$ ($Q_a = 0.04$). A barometer reports altitude $z_{\text{baro}}$ at $20\text{ Hz}$ ($R_{\text{baro}} = 0.25$), and an ultrasonic rangefinder reports ground distance $z_{\text{range}}$ at $50\text{ Hz}$ ($R_{\text{range}} = 0.01$). Formulate the complete discrete ESKF matrices and compute steady-state vertical altitude accuracy.

**Step-by-Step Derivation:**
1. State vector: $x = [p_z, v_z, b_{az}]^T$.
   $$F = \begin{bmatrix} 1 & \Delta t & -\frac{1}{2}\Delta t^2 \\ 0 & 1 & -\Delta t \\ 0 & 0 & 1 \end{bmatrix}, \quad Q = Q_a \begin{bmatrix} \Delta t^4 / 4 & \Delta t^3 / 2 & 0 \\ \Delta t^3 / 2 & \Delta t^2 & 0 \\ 0 & 0 & q_b \Delta t \end{bmatrix}$$
2. Measurement matrices:
   $$H_{\text{baro}} = [1, 0, 0], \quad H_{\text{range}} = [1, 0, 0]$$
3. Steady-state information accumulation:
   The rangefinder arrives at $50\text{ Hz}$ with $R = 0.01\text{ m}^2$, providing information rate $50 / 0.01 = 5000\text{ m}^{-2}\text{s}^{-1}$.
   The continuous CARE gives steady-state altitude variance:
   $$P_{11} \approx \sqrt{2} Q_a^{1/4} (R_{\text{eff}})^{3/4} \approx 0.0031\text{ m}^2 \implies \sigma_z \approx 5.5\text{ cm}$$

**Final Result:**
$$\sigma_z \approx 5.5\text{ cm}\text{ steady-state vertical accuracy}$$

---

### Problem 12.12 (Capstone Mastery): Autonomous Mobile Robot Localization Fusing Encoders and 2D Range-Bearing Landmarks
**Problem Statement:** A differential drive robot navigates a warehouse with 4 known radio beacons. Wheel encoders provide forward speed $v = 1.0\text{ m/s}$ and yaw rate $\omega = 0.1\text{ rad/s}$. When observing beacon 1 at $(x_b, y_b) = (10, 5)$, compute the full EKF measurement update.

**Step-by-Step Derivation:**
1. Robot pose $\hat{x} = [2.0, 3.0, 0.2]^T$.
2. Range to beacon: $\Delta x = 10 - 2 = 8, \Delta y = 5 - 3 = 2 \implies \rho = \sqrt{64 + 4} = \sqrt{68} \approx 8.246\text{ m}$.
3. Bearing in world frame: $\phi_{\text{world}} = \operatorname{atan2}(2, 8) \approx 0.245\text{ rad}$.
   Relative bearing: $\phi_{\text{rel}} = \phi_{\text{world}} - \theta = 0.245 - 0.200 = 0.045\text{ rad}$.
4. Compute Jacobian $H \in \mathbb{R}^{2 \times 3}$:
   $$H = \begin{bmatrix} -\frac{\Delta x}{\rho} & -\frac{\Delta y}{\rho} & 0 \\ \frac{\Delta y}{\rho^2} & -\frac{\Delta x}{\rho^2} & -1 \end{bmatrix} = \begin{bmatrix} -0.970 & -0.243 & 0.0 \\ 0.029 & -0.118 & -1.0 \end{bmatrix}$$
5. Apply Kalman update with Joseph stabilized covariance.

**Final Result:**
Full $3 \times 3$ pose covariance updated with zero linearization singularity.

---

### Problem 12.13 (Capstone Mastery): Real-Time Visual-Inertial Odometry (VIO) State Estimation with Camera Delay
**Problem Statement:** A stereo camera pipeline tracking 50 visual features delivers pose updates with a deterministic $60\text{ ms}$ processing delay. Formulate the rolling state buffer and playback algorithm.

**Step-by-Step Derivation:**
1. Ring buffer size: for $500\text{ Hz}$ IMU and $60\text{ ms}$ delay, buffer capacity $K = 0.060 \times 500 = 30$ frames.
2. At time $t_k$, when camera frame for $t_{k-30}$ arrives:
   - Retrieve stored nominal state $x_{\text{nom}}(t_{k-30})$ and covariance $P(t_{k-30})$.
   - Compute visual reprojection residuals for all 50 features.
   - Apply ESKF update to error state $\delta x$.
   - Inject error into $x_{\text{nom}}(t_{k-30})$ and reset $\delta x \leftarrow 0$.
   - Re-propagate nominal IMU strapdown through the 30 subsequent stored IMU packets to step $k$.

**Final Result:**
Deterministic latency compensation with zero phase lag distortion.

---

### Problem 12.14 (Capstone Mastery): Spacecraft Attitude Determination via Multiplicative EKF (MEKF) with Star Tracker and Gyros
**Problem Statement:** A spacecraft tracks attitude quaternion $q \in \mathbb{S}^3$ using 3-axis rate gyros and a star tracker observing unit star vectors $v_i^n$. Formulate the Multiplicative EKF (MEKF) measurement sensitivity.

**Step-by-Step Derivation:**
1. Star observation model: $z_i = R_b^n v_i^b + v_i$.
2. Measurement sensitivity on Lie algebra $\delta \theta \in \mathfrak{so}(3)$:
   $$h(\delta \theta) = R_{\text{nom}} (I + [\delta \theta]_\times) v_i^b = R_{\text{nom}} v_i^b - R_{\text{nom}} [v_i^b]_\times \delta \theta$$
   $$H_i = -R_{\text{nom}} [v_i^b]_\times \in \mathbb{R}^{3 \times 3}$$
3. Star tracker update refines attitude without quaternion norm degradation.

**Final Result:**
$$H_i = -R_{\text{nom}} [v_i^b]_\times$$

---

### Problem 12.15 (Capstone Mastery): GPS Outage Bridging with Zero-Velocity Updates (ZUPT) and RTS Smoothing
**Problem Statement:** An underground inspection robot travels for $120\text{ s}$ through a GPS-denied tunnel, stopping every $20\text{ s}$ for a 3-second ZUPT. Compare the maximum position drift under causal filtering versus RTS post-smoothing.

**Step-by-Step Derivation:**
1. During each 20s travel segment, causal dead-reckoning drift accumulates: $\sigma_p \approx \frac{1}{2} b_a t^2 \approx 0.025 (400) = 10.0\text{ m}$.
2. ZUPT resets velocity error to near zero, stopping further quadratic growth, but leaves historical position drift uncorrected causally.
3. RTS backward smoothing propagates the post-outage GPS fix and intermediate ZUPT constraints backwards in time:
   $$\sigma_{p, \text{RTS}}(t) \le 0.45\text{ m}$$
   Smoothing reduces maximum position drift by over $95\%$.

**Final Result:**
$$\text{Causal Drift} = 10.0\text{ m}, \quad \text{RTS Smoothed Drift} = 0.45\text{ m} \quad (\mathbf{95.5\%\ Drift\ Reduction})$$

---

### Problem 12.16 (Capstone Mastery): Multi-Target Radar Tracking with Kalman Gating and Nearest-Neighbor Association
**Problem Statement:** A radar tracks 3 aircraft. A new measurement $z$ arrives. Formulate the Global Nearest Neighbor (GNN) association rule using the Mahalanobis distance.

**Step-by-Step Derivation:**
1. For each target track $i \in \{1, 2, 3\}$, compute predicted measurement $\hat{z}_i$ and innovation covariance $S_i$.
2. Compute Mahalanobis distance:
   $$d_i^2 = (z - \hat{z}_i)^T S_i^{-1} (z - \hat{z}_i)$$
3. Gating check: if $d_i^2 > \chi^2(m)_{0.99}$, track $i$ is disqualified.
4. Association decision:
   $$i^* = \arg\min_{i} d_i^2 \quad \text{subject to } d_i^2 \le \gamma$$

**Final Result:**
Optimal assignment minimizing total statistical distance.

---

### Problem 12.17 (Capstone Mastery): Battery State of Charge (SoC) and Internal Resistance Estimation via Dual EKF
**Problem Statement:** In electric autonomous robots, battery state $x = [\text{SoC}, V_{\text{RC}}]^T$ and parameter $\theta = R_0$ (internal resistance) are coupled nonlinearly. Specify the Dual EKF architecture.

**Step-by-Step Derivation:**
1. Filter 1 (State Filter): estimates $\text{SoC}_k$ assuming parameter $\hat{R}_{0, k-1}$ is known.
2. Filter 2 (Parameter Filter): estimates internal resistance $R_{0, k}$ treated as a slow random walk ($R_{0, k} = R_{0, k-1} + w_\theta$), using the updated state $\hat{x}_k$ from Filter 1.
3. Concurrent execution decouples fast electrical dynamics from slow battery degradation.

**Final Result:**
Dual EKF provides real-time state of charge and health tracking.

---

### Problem 12.18 (Capstone Mastery): Inverted Pendulum State Estimation under Stochastic Torque Disturbances
**Problem Statement:** A humanoid balancing robot stabilizes an inverted pendulum $\ddot{\theta} - \frac{g}{L} \sin\theta = \frac{\tau}{m L^2} + w(t)$. Design a discrete EKF estimating angle and angular velocity under wind gusts.

**Step-by-Step Derivation:**
1. Continuous state $x = [\theta, \dot{\theta}]^T$.
   $$f(x, u) = \begin{bmatrix} \dot{\theta} \\ \frac{g}{L} \sin\theta + \frac{\tau}{m L^2} \end{bmatrix}$$
2. Continuous Jacobian:
   $$A = \begin{bmatrix} 0 & 1 \\ \frac{g}{L} \cos\theta & 0 \end{bmatrix}$$
3. Discretize via Van Loan method and implement with Joseph form.

**Final Result:**
Full EKF stabilizing dynamic balance under torque noise.

---

### Problem 12.19 (Capstone Mastery): Fault-Tolerant Aircraft Airspeed Sensor Fusion with Chi-Square Gating
**Problem Statement:** An autonomous aircraft fuses pitot tube airspeed, GPS groundspeed, and wind velocity estimates. When ice blocks the pitot tube (causing output to freeze at $80\text{ knots}$), demonstrate how Chi-square gating detects the sensor freeze and isolates the pitot tube.

**Step-by-Step Derivation:**
1. Aircraft accelerates from $80\text{ knots}$ to $120\text{ knots}$ (measured by GPS and throttle).
2. Frozen pitot reports $z_{\text{pitot}} = 80\text{ knots}$.
3. Predicted airspeed $\hat{v} = 120\text{ knots}$, with innovation $y = 80 - 120 = -40\text{ knots}$.
4. NIS evaluation:
   $$\epsilon = \frac{(-40)^2}{S} = \frac{1600}{25} = 64 \gg \chi^2(1)_{0.999} = 10.828$$
5. Pitot measurement is discarded; flight computer flags sensor failure and switches to synthetic airspeed from GPS-inertial fusion.

**Final Result:**
$$\epsilon = 64 > 10.83 \implies \mathbf{Fault\ Isolated,\ Flight\ Safety\ Maintained}$$

---

### Problem 12.20 (Capstone Mastery): Complete Autonomous Embodied AI Perception-Estimation-Control Loop Integration
**Problem Statement:** Formulate the end-to-end mathematical contract connecting sensor perception, optimal state estimation (Kalman Filtering), and optimal feedback control (Linear Quadratic Regulator / Model Predictive Control). State the Separation Principle.

**Step-by-Step Derivation:**
1. The physical system is governed by:
   $$x_{k+1} = F x_k + B u_k + w_k, \quad z_k = H x_k + v_k$$
2. The Kalman filter computes the optimal state belief:
   $$\hat{x}_k = \mathbb{E}[x_k | z_{1:k}]$$
3. The optimal control law computes actuator inputs:
   $$u_k = -K_{\text{LQR}} \hat{x}_k$$
4. **The Separation Principle (Certainty Equivalence Theorem):**
   For linear quadratic Gaussian (LQG) systems, the optimal controller design is strictly decoupled from the optimal estimator design:
   - The Kalman filter gain $K_k^*$ is computed independently of the control cost matrices $(Q_c, R_c)$.
   - The LQR gain $K_{\text{LQR}}^*$ is computed independently of the noise covariances $(Q, R)$.
   - Cascading the optimal estimator with the optimal deterministic controller achieves the mathematically optimal closed-loop cyber-physical autonomous agent. $\blacksquare$

**Final Result:**
The Separation Principle guarantees complete optimality of the Embodied AI loop.
