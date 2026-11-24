# Chapter 9: The Unscented Kalman Filter (UKF) and Sigma-Point Transforms

## 9.1 Introduction: Beyond the Tyranny of Jacobians

In 1997, Jeffrey K. Julier and Jeffrey K. Uhlmann published a foundational insight that revolutionized nonlinear stochastic state estimation:

> *"It is easier to approximate a probability distribution than it is to approximate an arbitrary nonlinear function or transformation."*

The Extended Kalman Filter linearizes nonlinear dynamics by taking analytical or numerical Jacobians at a single point: the mean estimate. This first-order truncation discards all higher-order derivatives (Hessians, cubics), introducing severe estimation biases and often causing catastrophic divergence under high uncertainty or sharp geometric curvature.

The **Unscented Kalman Filter (UKF)** completely abandons analytical differentiation. Instead, it employs the **Unscented Transform (UT)**: a deterministic sampling methodology that captures the exact mean and covariance of a random vector using a minimal set of $2n+1$ intelligently chosen **sigma points**. When propagated through the true, unlinearized nonlinear equations, these sigma points capture the posterior mean and covariance with **third-order Taylor series accuracy** for Gaussian distributions, compared to merely first-order accuracy in the EKF.

In this chapter, we derive the mathematical mechanics of the Merwe scaled unscented transform, master the Cholesky matrix square root computation, prove third-order accuracy via multivariable Taylor expansions, develop specialized methods for angular states on manifolds, and solve 20 rigorous problems.

---

## 9.2 The Scaled Unscented Transform Mechanics

Let $x \in \mathbb{R}^n$ be a random vector with mean $\bar{x} \in \mathbb{R}^n$ and covariance $P \in \mathbb{S}_{++}^n$. We wish to propagate $x$ through an arbitrary nonlinear vector transformation $y = g(x) \in \mathbb{R}^m$.

### 9.2.1 Deterministic Sigma-Point Generation
The Scaled Unscented Transform deterministically constructs a set of $2n+1$ weighted sigma points $\mathcal{X}_i \in \mathbb{R}^n$ ($i = 0, \dots, 2n$):

$$\mathcal{X}_0 = \bar{x}$$
$$\mathcal{X}_i = \bar{x} + \left( \sqrt{(n + \lambda) P} \right)_i, \quad i = 1, \dots, n$$
$$\mathcal{X}_{i+n} = \bar{x} - \left( \sqrt{(n + \lambda) P} \right)_i, \quad i = 1, \dots, n$$

where:
- $\left( \sqrt{(n + \lambda) P} \right)_i$ denotes the $i$-th column of the lower-triangular matrix square root $L$, computed via Cholesky decomposition:
  $$L L^T = (n + \lambda) P$$
- $\lambda = \alpha^2 (n + \kappa) - n$ is the composite scaling parameter.
- $\alpha \in (0, 1]$ controls the spread of the sigma points around $\bar{x}$ (typically $\alpha = 10^{-3}$ or $\alpha = 1.0$). Small $\alpha$ prevents sampling points far from the mean, avoiding non-local nonlinearities.
- $\kappa \ge 0$ is a secondary scaling parameter (typically $\kappa = 0$ or $\kappa = 3 - n$).
- $\beta \ge 0$ incorporates prior knowledge of the distribution higher moments ($\beta = 2.0$ is mathematically optimal for Gaussian distributions).

### 9.2.2 Weighting Coefficients
Each sigma point $\mathcal{X}_i$ is assigned two scalar weights: $W_i^{(m)}$ for calculating the mean, and $W_i^{(c)}$ for calculating the covariance:

For the central point ($i = 0$):
$$W_0^{(m)} = \frac{\lambda}{n + \lambda}$$
$$W_0^{(c)} = \frac{\lambda}{n + \lambda} + (1 - \alpha^2 + \beta)$$

For the remaining symmetric pairs ($i = 1, \dots, 2n$):
$$W_i^{(m)} = W_i^{(c)} = \frac{1}{2(n + \lambda)}$$

### 9.2.3 Fundamental Weight Invariants
Notice that the sum of the mean weights satisfies:
$$\sum_{i=0}^{2n} W_i^{(m)} = \frac{\lambda}{n + \lambda} + 2n \left(\frac{1}{2(n + \lambda)}\right) = \frac{\lambda + n}{n + \lambda} = 1.0$$
Similarly, $\sum_{i=0}^{2n} W_i^{(c)} = 1.0 + (1 - \alpha^2 + \beta)$.

---

## 9.3 Nonlinear Propagation and Statistical Recombination

Once the $2n+1$ sigma points are generated, each point is passed individually through the full nonlinear vector function:

$$\mathcal{Y}_i = g(\mathcal{X}_i), \quad i = 0, \dots, 2n$$

No Jacobians, partial derivatives, or approximations of $g(\cdot)$ are evaluated.

### 9.3.1 Posterior Mean and Covariance Reconstruction
The transformed mean vector $\bar{y} \in \mathbb{R}^m$ and covariance matrix $P_y \in \mathbb{S}_+^m$ are computed by weighted summation:

$$\bar{y} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{Y}_i$$
$$P_y = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{Y}_i - \bar{y}) (\mathcal{Y}_i - \bar{y})^T$$

Furthermore, the cross-covariance matrix between the input state and output measurement is:
$$P_{xy} = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{X}_i - \bar{x}) (\mathcal{Y}_i - \bar{y})^T \in \mathbb{R}^{n \times m}$$

---

## 9.4 The Complete UKF Algorithmic Cycle

For a nonlinear stochastic discrete system:
$$x_k = f(x_{k-1}, u_{k-1}) + w_k, \quad w_k \sim \mathcal{N}(0, Q_k)$$
$$z_k = h(x_k) + v_k, \quad v_k \sim \mathcal{N}(0, R_k)$$

```
+---------------------------------------------------------------------------------------------------+
|                        UNSCENTED KALMAN FILTER (UKF) CYCLE                                        |
+---------------------------------------------------------------------------------------------------+
| 1. PREDICT PHASE:                                                                                 |
|    a. Generate 2n+1 sigma points from prior:                                                      |
|       \mathcal{X}_{k-1|k-1}^{(i)} from (\hat{x}_{k-1|k-1}, P_{k-1|k-1})                           |
|    b. Propagate sigma points through nonlinear dynamics:                                          |
|       \mathcal{X}_{k|k-1}^{*(i)} = f(\mathcal{X}_{k-1|k-1}^{(i)}, u_{k-1})                        |
|    c. Recombine predicted state mean and covariance:                                              |
|       \hat{x}_{k|k-1} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{X}_{k|k-1}^{*(i)}                     |
|       P_{k|k-1}       = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{X}^{*(i)} - \hat{x})                 |
|                                                  (\mathcal{X}^{*(i)} - \hat{x})^T + Q_k           |
|                                                                                                   |
| 2. UPDATE PHASE:                                                                                  |
|    a. Re-sample sigma points from (\hat{x}_{k|k-1}, P_{k|k-1}):                                   |
|       \mathcal{X}_{k|k-1}^{(i)} (or reuse dynamic points)                                         |
|    b. Propagate sigma points through nonlinear measurement function:                              |
|       \mathcal{Z}_k^{(i)} = h(\mathcal{X}_{k|k-1}^{(i)})                                          |
|    c. Predicted measurement mean and innovation covariance:                                       |
|       \hat{z}_{k|k-1} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{Z}_k^{(i)}                            |
|       S_k             = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{Z}^{(i)} - \hat{z})                   |
|                                                  (\mathcal{Z}^{(i)} - \hat{z})^T + R_k            |
|    d. State-Measurement Cross-Covariance:                                                         |
|       P_{xz, k}       = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{X}^{(i)} - \hat{x})                  |
|                                                  (\mathcal{Z}^{(i)} - \hat{z})^T                  |
|    e. Kalman Gain and Measurement Update:                                                         |
|       K_k             = P_{xz, k} S_k^{-1}                                                        |
|       \hat{x}_{k|k}   = \hat{x}_{k|k-1} + K_k (z_k - \hat{z}_{k|k-1})                             |
|       P_{k|k}         = P_{k|k-1} - K_k S_k K_k^T                                                 |
+---------------------------------------------------------------------------------------------------+
```

---

## 9.5 Mathematical Proof: 3rd-Order Taylor Accuracy of the Unscented Transform

To understand why the UKF drastically outperforms the EKF, we compare the Taylor series expansion of the true posterior mean against the UKF sigma-point mean.

### 9.5.1 True Mean Expansion
Let $x = \bar{x} + \delta x$ where $\mathbb{E}[\delta x] = 0$ and $\mathbb{E}[\delta x \delta x^T] = P$.
Expand $g(x)$ in a multivariable Taylor series around $\bar{x}$:
$$g(x) = g(\bar{x}) + \nabla g \cdot \delta x + \frac{1}{2} D_{\delta x}^2 g + \frac{1}{6} D_{\delta x}^3 g + \frac{1}{24} D_{\delta x}^4 g + \dots$$
Taking the expectation:
$$\mathbb{E}[g(x)] = g(\bar{x}) + \nabla g \cdot \mathbb{E}[\delta x] + \frac{1}{2} \mathbb{E}[D_{\delta x}^2 g] + \frac{1}{6} \mathbb{E}[D_{\delta x}^3 g] + \dots$$

Since the prior distribution is Gaussian:
- $\mathbb{E}[\delta x] = 0$ (first moment vanishes).
- $\mathbb{E}[D_{\delta x}^3 g] = 0$ (all odd central moments of a Gaussian vanish identically).
- $\frac{1}{2} \mathbb{E}[D_{\delta x}^2 g] = \frac{1}{2} \sum_{i,j} \frac{\partial^2 g}{\partial x_i \partial x_j} P_{ij} = \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P)$.

Thus, the exact true mean is:
$$\bar{y}_{\text{true}} = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + \mathcal{O}(D^4)$$

### 9.5.2 EKF Mean Approximation
The EKF linearizes at $\bar{x}$:
$$\bar{y}_{\text{EKF}} = g(\bar{x})$$
**Error:** $\bar{y}_{\text{true}} - \bar{y}_{\text{EKF}} = \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) = \mathcal{O}(\|P\|)$. The EKF has a non-zero error at the 2nd order!

### 9.5.3 UKF Mean Approximation
Expand the sigma points $\mathcal{X}_i = \bar{x} + \Delta x_i$ where $\Delta x_0 = 0$, $\Delta x_i = \sigma_i$, $\Delta x_{i+n} = -\sigma_i$:
$$\mathcal{Y}_i = g(\bar{x} + \Delta x_i) = g(\bar{x}) + \nabla g \cdot \Delta x_i + \frac{1}{2} \Delta x_i^T \nabla^2 g \, \Delta x_i + \frac{1}{6} D_{\Delta x_i}^3 g + \dots$$

Form the weighted sum $\bar{y}_{\text{UKF}} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{Y}_i$:
$$\bar{y}_{\text{UKF}} = \left(\sum W_i^{(m)}\right) g(\bar{x}) + \nabla g \sum W_i^{(m)} \Delta x_i + \frac{1}{2} \sum W_i^{(m)} \Delta x_i^T \nabla^2 g \, \Delta x_i + \frac{1}{6} \sum W_i^{(m)} D_{\Delta x_i}^3 g + \dots$$

1. $\sum W_i^{(m)} = 1.0$.
2. Because sigma points are symmetric pairs ($\Delta x_{i+n} = -\Delta x_i$ with equal weights), the odd sum vanishes identically:
   $$\sum_{i=0}^{2n} W_i^{(m)} \Delta x_i = W_0 (0) + \sum_{i=1}^n \frac{1}{2(n+\lambda)} (\sigma_i - \sigma_i) = 0$$
3. For the second-order term:
   $$\sum_{i=0}^{2n} W_i^{(m)} \Delta x_i \Delta x_i^T = 2 \sum_{i=1}^n \frac{1}{2(n+\lambda)} \sigma_i \sigma_i^T = \frac{1}{n+\lambda} \sum_{i=1}^n (\sqrt{(n+\lambda)P})_i (\sqrt{(n+\lambda)P})_i^T = \frac{1}{n+\lambda} (n+\lambda) P = P$$
   Therefore:
   $$\frac{1}{2} \sum_{i=0}^{2n} W_i^{(m)} \Delta x_i^T \nabla^2 g \, \Delta x_i = \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P)$$
4. For the third-order term:
   All symmetric odd powers vanish: $\sum W_i^{(m)} \Delta x_i^3 = 0$.

Thus:
$$\bar{y}_{\text{UKF}} = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + 0 + \mathcal{O}(D^4)$$

Comparing with $\bar{y}_{\text{true}}$:
$$\bar{y}_{\text{true}} - \bar{y}_{\text{UKF}} = 0 + 0 + 0 + \mathcal{O}(D^4)$$

The UKF matches the true posterior mean **exactly through 3rd-order Taylor terms**! $\blacksquare$

---

## 9.6 Mathematical Problem Set

### Problem 9.1 (Worked Example): Deterministic Sigma-Point Generation in 2D
**Problem Statement:** A 2D robotic state has mean $\bar{x} = \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix}$ and covariance $P = \begin{bmatrix} 4.0 & 1.2 \\ 1.2 & 1.0 \end{bmatrix}$.
Using standard parameters $\alpha = 1.0, \beta = 2.0, \kappa = 0$:
1. Compute the scaling parameter $\lambda$ and weights $W_0^{(m)}, W_0^{(c)}, W_i^{(m)}, W_i^{(c)}$.
2. Compute the Cholesky factor $L = \sqrt{(n + \lambda) P}$.
3. Generate all $2n+1 = 5$ sigma points.

**Step-by-Step Derivation:**
1. Parameters: $n = 2, \alpha = 1.0, \beta = 2.0, \kappa = 0$.
   $$\lambda = \alpha^2 (n + \kappa) - n = 1.0^2 (2 + 0) - 2 = 0$$
   $$n + \lambda = 2 + 0 = 2$$
   Weights:
   $$W_0^{(m)} = \frac{\lambda}{n + \lambda} = \frac{0}{2} = 0.0$$
   $$W_0^{(c)} = \frac{\lambda}{n + \lambda} + (1 - \alpha^2 + \beta) = 0 + (1 - 1 + 2) = 2.0$$
   For $i = 1, 2, 3, 4$:
   $$W_i^{(m)} = W_i^{(c)} = \frac{1}{2(n + \lambda)} = \frac{1}{2(2)} = \frac{1}{4} = 0.25$$
   Check invariant: $\sum W_i^{(m)} = 0 + 4(0.25) = 1.0$.
2. Matrix square root $M = (n + \lambda) P = 2 P$:
   $$M = 2 \begin{bmatrix} 4.0 & 1.2 \\ 1.2 & 1.0 \end{bmatrix} = \begin{bmatrix} 8.0 & 2.4 \\ 2.4 & 2.0 \end{bmatrix}$$
   Compute lower-triangular Cholesky factor $L = \begin{bmatrix} L_{11} & 0 \\ L_{21} & L_{22} \end{bmatrix}$:
   $$L_{11} = \sqrt{M_{11}} = \sqrt{8.0} \approx 2.828427$$
   $$L_{21} = \frac{M_{21}}{L_{11}} = \frac{2.4}{\sqrt{8.0}} = \frac{2.4}{2.828427} \approx 0.848528$$
   $$L_{22} = \sqrt{M_{22} - L_{21}^2} = \sqrt{2.0 - (0.848528)^2} = \sqrt{2.0 - 0.720} = \sqrt{1.28} \approx 1.131371$$
   $$L = \begin{bmatrix} 2.828427 & 0.000000 \\ 0.848528 & 1.131371 \end{bmatrix}$$
3. Generate 5 sigma points:
   - Central point $\mathcal{X}_0 = \bar{x}$:
     $$\mathcal{X}_0 = \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix}$$
   - Positive perturbations ($i = 1, 2$):
     $$\mathcal{X}_1 = \bar{x} + L_{:, 1} = \begin{bmatrix} 2.0 + 2.828427 \\ -1.0 + 0.848528 \end{bmatrix} = \begin{bmatrix} 4.828427 \\ -0.151472 \end{bmatrix}$$
     $$\mathcal{X}_2 = \bar{x} + L_{:, 2} = \begin{bmatrix} 2.0 + 0.000000 \\ -1.0 + 1.131371 \end{bmatrix} = \begin{bmatrix} 2.000000 \\ 0.131371 \end{bmatrix}$$
   - Negative perturbations ($i = 3, 4$):
     $$\mathcal{X}_3 = \bar{x} - L_{:, 1} = \begin{bmatrix} 2.0 - 2.828427 \\ -1.0 - 0.848528 \end{bmatrix} = \begin{bmatrix} -0.828427 \\ -1.848528 \end{bmatrix}$$
     $$\mathcal{X}_4 = \bar{x} - L_{:, 2} = \begin{bmatrix} 2.0 - 0.000000 \\ -1.0 - 1.131371 \end{bmatrix} = \begin{bmatrix} 2.000000 \\ -2.131371 \end{bmatrix}$$

**Final Result:**
$$\mathcal{X} = \begin{bmatrix} 2.0000 & 4.8284 & 2.0000 & -0.8284 & 2.0000 \\ -1.0000 & -0.1515 & 0.1314 & -1.8485 & -2.1314 \end{bmatrix}$$

---

### Problem 9.2 (Worked Example): Nonlinear Polar Transformation Benchmark: UKF vs EKF
**Problem Statement:** A 2D target is at Cartesian coordinates $(x, y)$ with mean $\bar{x} = \begin{bmatrix} 0.0 \\ 10.0 \end{bmatrix}$ and covariance $P = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 0.01 \end{bmatrix}$. A sensor measures range $\rho = \sqrt{x^2 + y^2}$.
1. Compute the true expected range $\mathbb{E}[\sqrt{x^2 + y^2}]$ numerically via Monte Carlo or series expansion.
2. Compute the EKF predicted range $\hat{\rho}_{\text{EKF}} = h(\bar{x})$.
3. Compute the UKF predicted range $\hat{\rho}_{\text{UKF}}$ using the 5 sigma points.
Show that the UKF captures the nonlinear curvature while the EKF fails completely.

**Step-by-Step Derivation:**
1. True range expansion:
   $$\rho = \sqrt{x^2 + y^2} = y \sqrt{1 + (x/y)^2} \approx y \left(1 + \frac{x^2}{2 y^2}\right) = y + \frac{x^2}{2 y}$$
   Taking expectation:
   $$\mathbb{E}[\rho] \approx \bar{y} + \frac{\mathbb{E}[x^2]}{2 \bar{y}} = 10.0 + \frac{1.0}{2(10.0)} = 10.0 + 0.05 = 10.0500\text{ m}$$
2. EKF prediction:
   $$\hat{\rho}_{\text{EKF}} = \sqrt{\bar{x}^2 + \bar{y}^2} = \sqrt{0^2 + 10^2} = 10.0000\text{ m}$$
   The EKF predicts $10.0000\text{ m}$, missing the $0.05\text{ m}$ curvature offset entirely!
3. UKF prediction:
   $n = 2, \alpha = 1.0, \beta = 2.0, \kappa = 0 \implies \lambda = 0, n + \lambda = 2$.
   $M = 2 P = \begin{bmatrix} 2.0 & 0.0 \\ 0.0 & 0.02 \end{bmatrix}$.
   Cholesky factor $L = \begin{bmatrix} \sqrt{2} & 0 \\ 0 & \sqrt{0.02} \end{bmatrix} \approx \begin{bmatrix} 1.414214 & 0 \\ 0 & 0.141421 \end{bmatrix}$.
   Sigma points:
   $$\mathcal{X}_0 = [0, 10]^T \implies \rho_0 = 10.000000$$
   $$\mathcal{X}_1 = [\sqrt{2}, 10]^T \implies \rho_1 = \sqrt{2 + 100} = \sqrt{102} \approx 10.099505$$
   $$\mathcal{X}_2 = [0, 10 + \sqrt{0.02}]^T \implies \rho_2 = 10 + 0.141421 = 10.141421$$
   $$\mathcal{X}_3 = [-\sqrt{2}, 10]^T \implies \rho_3 = \sqrt{2 + 100} = \sqrt{102} \approx 10.099505$$
   $$\mathcal{X}_4 = [0, 10 - \sqrt{0.02}]^T \implies \rho_4 = 10 - 0.141421 = 9.858579$$
   Weights: $W_0^{(m)} = 0, W_1^{(m)} = W_2^{(m)} = W_3^{(m)} = W_4^{(m)} = 0.25$.
   UKF mean:
   $$\hat{\rho}_{\text{UKF}} = 0.25 (10.099505 + 10.141421 + 10.099505 + 9.858579) = 0.25 (40.199010) = 10.049753\text{ m}$$
4. Comparison:
   $$\text{True: } 10.0500\text{ m}, \quad \text{UKF: } 10.0498\text{ m (Error: } 0.0002\text{ m)}, \quad \text{EKF: } 10.0000\text{ m (Error: } 0.0500\text{ m)}$$
   The UKF captures $99.6\%$ of the nonlinear curvature shift, while the EKF captures $0\%$.

**Final Result:**
$$\hat{\rho}_{\text{true}} \approx 10.0500\text{ m}, \quad \hat{\rho}_{\text{UKF}} = 10.0498\text{ m}, \quad \hat{\rho}_{\text{EKF}} = 10.0000\text{ m}$$

---

### Problem 9.3 (Worked Example): Cross-Covariance and Kalman Gain in UKF
**Problem Statement:** Using the sigma points and evaluations from Problem 9.2:
1. Compute the UKF predicted range variance $P_\rho$ (assume $R = 0.01$).
2. Compute the state-measurement cross-covariance vector $P_{x\rho} \in \mathbb{R}^2$.
3. Compute the UKF Kalman gain vector $K \in \mathbb{R}^2$.

**Step-by-Step Derivation:**
1. Predicted measurement variance:
   Deviations $\tilde{\rho}_i = \mathcal{Y}_i - \hat{\rho}_{\text{UKF}}$:
   $$\tilde{\rho}_0 = 10.000000 - 10.049753 = -0.049753$$
   $$\tilde{\rho}_1 = 10.099505 - 10.049753 = +0.049752$$
   $$\tilde{\rho}_2 = 10.141421 - 10.049753 = +0.091668$$
   $$\tilde{\rho}_3 = 10.099505 - 10.049753 = +0.049752$$
   $$\tilde{\rho}_4 = 9.858579 - 10.049753 = -0.191174$$
   Weights: $W_0^{(c)} = 2.0, W_1^{(c)} = W_2^{(c)} = W_3^{(c)} = W_4^{(c)} = 0.25$.
   $$P_{\rho, \text{meas}} = W_0^{(c)} \tilde{\rho}_0^2 + 0.25 (\tilde{\rho}_1^2 + \tilde{\rho}_2^2 + \tilde{\rho}_3^2 + \tilde{\rho}_4^2)$$
   $$W_0^{(c)} \tilde{\rho}_0^2 = 2.0 (-0.049753)^2 = 2.0 (0.002475) = 0.004950$$
   $$\tilde{\rho}_1^2 = 0.002475, \quad \tilde{\rho}_2^2 = 0.008403, \quad \tilde{\rho}_3^2 = 0.002475, \quad \tilde{\rho}_4^2 = 0.036547$$
   Sum of peripheral squared deviations: $0.002475 + 0.008403 + 0.002475 + 0.036547 = 0.049900$
   $$0.25 \times 0.049900 = 0.012475$$
   $$P_{\rho, \text{meas}} = 0.004950 + 0.012475 = 0.017425$$
   Adding sensor noise $R = 0.01$:
   $$S = P_\rho = 0.017425 + 0.010000 = 0.027425$$
2. Cross-covariance vector $P_{x\rho} = \sum_{i=0}^4 W_i^{(c)} (\mathcal{X}_i - \bar{x}) \tilde{\rho}_i$:
   - For $x$-component (first row):
     $$\mathcal{X}_0 - \bar{x} = [0, 0]^T$$
     $$\mathcal{X}_1 - \bar{x} = [+\sqrt{2}, 0]^T \implies 0.25(+\sqrt{2})(+0.049752) \approx +0.017590$$
     $$\mathcal{X}_2 - \bar{x} = [0, +\sqrt{0.02}]^T \implies 0$$
     $$\mathcal{X}_3 - \bar{x} = [-\sqrt{2}, 0]^T \implies 0.25(-\sqrt{2})(+0.049752) \approx -0.017590$$
     $$\mathcal{X}_4 - \bar{x} = [0, -\sqrt{0.02}]^T \implies 0$$
     Notice: $+0.017590 - 0.017590 = 0.000000$! $P_{x\rho}[1] = 0.0$.
   - For $y$-component (second row):
     $$\mathcal{X}_1 \text{ and } \mathcal{X}_3 \implies 0$$
     $$\mathcal{X}_2 - \bar{x} = [0, +0.141421]^T \implies 0.25(+0.141421)(+0.091668) = +0.003241$$
     $$\mathcal{X}_4 - \bar{x} = [0, -0.141421]^T \implies 0.25(-0.141421)(-0.191174) = +0.006760$$
     Sum: $P_{x\rho}[2] = 0.003241 + 0.006760 = 0.010001 \approx 0.0100$.
   $$P_{x\rho} = \begin{bmatrix} 0.0000 \\ 0.0100 \end{bmatrix}$$
3. Kalman Gain:
   $$K = \frac{1}{S} P_{x\rho} = \frac{1}{0.027425} \begin{bmatrix} 0.0000 \\ 0.0100 \end{bmatrix} = \begin{bmatrix} 0.0000 \\ 0.3646 \end{bmatrix}$$

**Final Result:**
$$S = 0.02743, \quad P_{x\rho} = \begin{bmatrix} 0.0000 \\ 0.0100 \end{bmatrix}, \quad K = \begin{bmatrix} 0.0000 \\ 0.3646 \end{bmatrix}$$

---

### Problem 9.4 (Worked Example): Non-Positive Semi-Definite Covariance Prevention in UKF
**Problem Statement:** In the Merwe scaled unscented transform, if $\alpha$ is chosen too large (e.g. $\alpha = 2.0$), show that $W_0^{(c)}$ can become negative, potentially causing the reconstructed covariance $P$ to lose positive semi-definiteness. Derive the parameter condition ensuring $W_0^{(c)} \ge 0$.

**Step-by-Step Derivation:**
1. Weight formula:
   $$W_0^{(c)} = \frac{\lambda}{n + \lambda} + (1 - \alpha^2 + \beta)$$
   where $\lambda = \alpha^2(n + \kappa) - n$.
   $$\frac{\lambda}{n + \lambda} = 1 - \frac{n}{n + \lambda} = 1 - \frac{n}{\alpha^2(n + \kappa)}$$
2. Substituting:
   $$W_0^{(c)} = 1 - \frac{n}{\alpha^2(n + \kappa)} + 1 - \alpha^2 + \beta = 2 + \beta - \alpha^2 - \frac{n}{\alpha^2(n + \kappa)}$$
3. Setting $W_0^{(c)} \ge 0$:
   For standard Gaussian tuning $\beta = 2.0$ and $\kappa = 0$:
   $$W_0^{(c)} = 4 - \alpha^2 - \frac{1}{\alpha^2}$$
4. Multiply through by $\alpha^2$:
   $$-\alpha^4 + 4\alpha^2 - 1 \ge 0 \implies \alpha^4 - 4\alpha^2 + 1 \le 0$$
   Roots of quadratic in $\alpha^2$:
   $$\alpha^2 = \frac{4 \pm \sqrt{16 - 4}}{2} = 2 \pm \sqrt{3} \approx 2 \pm 1.732 \implies \alpha^2 \in [0.268, 3.732]$$
   $$\alpha \in [\sqrt{2 - \sqrt{3}}, \sqrt{2 + \sqrt{3}}] \approx [0.5176, 1.9318]$$
5. If $\alpha < 0.5176$ (such as standard $\alpha = 10^{-3}$), $W_0^{(c)}$ is strictly negative:
   $$W_0^{(c)} \approx -\frac{1}{\alpha^2} = -10^6!$$
6. Engineering Fix:
   When $W_0^{(c)} < 0$, if $\mathcal{Y}_0 \approx \bar{y}$, the negative term is tiny. However, if numerical roundoff introduces negative eigenvalues into $P_y$, enforce positive semi-definiteness via spectral clipping:
   $$P \leftarrow V \max(\Lambda, 0) V^T + 10^{-12} I$$

**Final Result:**
$$W_0^{(c)} \ge 0 \iff \alpha \in [0.518, 1.932]\text{ (for }\kappa=0, \beta=2\text{)}$$

---

### Problem 9.5 (Worked Example): Angular Manifold Sigma Points
**Problem Statement:** An autonomous rover orientation state is $\theta \in \mathbb{S}^1$ (the circle group $SO(2)$). Explain why calculating the UKF mean heading via scalar weighted sum $\bar{\theta} = \sum W_i^{(m)} \theta_i$ violates the Riemannian manifold geometry, and provide the exact circular vector averaging algorithm.

**Step-by-Step Derivation:**
1. Failure of Euclidean averaging:
   Suppose two sigma points are $\theta_1 = +179^\circ = +3.1241\text{ rad}$ and $\theta_2 = -179^\circ = -3.1241\text{ rad}$ with weights $0.5, 0.5$.
   Scalar weighted sum:
   $$\bar{\theta}_{\text{scalar}} = 0.5(+179^\circ) + 0.5(-179^\circ) = 0^\circ$$
   *Absurdity:* The average of two headings pointing nearly due West is calculated as pointing due East!
2. Riemannian Circular Vector Averaging:
   Map each angular sigma point onto the unit circle on the 2D plane:
   $$\bar{c} = \sum_{i=0}^{2n} W_i^{(m)} \cos(\theta_i)$$
   $$\bar{s} = \sum_{i=0}^{2n} W_i^{(m)} \sin(\theta_i)$$
3. The true intrinsic Fréchet / Karcher mean on $\mathbb{S}^1$ is:
   $$\bar{\theta}_{\text{circular}} = \operatorname{atan2}(\bar{s}, \bar{c})$$
4. Evaluation for our example:
   $$\cos(179^\circ) = \cos(-179^\circ) = -0.999848 \implies \bar{c} = -0.999848$$
   $$\sin(179^\circ) = +0.017452, \quad \sin(-179^\circ) = -0.017452 \implies \bar{s} = 0$$
   $$\bar{\theta} = \operatorname{atan2}(0, -0.999848) = 180^\circ = \pi\text{ rad}$$
   The circular mean correctly computes due West ($180^\circ$).

**Final Result:**
$$\bar{\theta} = \operatorname{atan2}\left( \sum W_i^{(m)} \sin\theta_i, \, \sum W_i^{(m)} \cos\theta_i \right)$$

---

### Problem 9.6 (Worked Example): Flop Count Analysis: UKF vs EKF
**Problem Statement:** For state dimension $n$ and measurement dimension $m$:
1. State the number of function evaluations required by EKF with finite differences versus UKF.
2. Compare the computational complexity in big-$\mathcal{O}$ notation.

**Step-by-Step Derivation:**
1. Function evaluations:
   - EKF with analytical Jacobians: 1 evaluation of $f(x)$, 1 evaluation of $h(x)$.
   - EKF with central finite differences: $2n$ evaluations of $f(x)$ for $F$, $2n$ evaluations of $h(x)$ for $H$. Total: $4n$ evaluations.
   - UKF: exactly $2n+1$ evaluations of $f(x)$, and $2n+1$ evaluations of $h(x)$. Total: $4n + 2$ evaluations.
   Function evaluation count is nearly identical between numerical EKF and UKF!
2. Linear algebra operations:
   - UKF requires Cholesky decomposition of $n \times n$ covariance: $\frac{1}{3} n^3$ flops.
   - Matrix outer product reconstructions:
     $$P_{k|k-1}: (2n+1) n^2 \approx 2 n^3\text{ flops}$$
     $$S_k: (2n+1) m^2 \approx 2 n m^2\text{ flops}$$
     $$P_{xz}: (2n+1) n m \approx 2 n^2 m\text{ flops}$$
   - Kalman gain solve and update: $\mathcal{O}(m^3 + n m^2 + n^2 m)$ flops.
3. Total asymptotic complexity:
   Both EKF and UKF have identical computational scaling:
   $$\text{Complexity} = \mathcal{O}(n^3 + n^2 m + m^3)\text{ flops}$$

**Final Result:**
Both EKF and UKF scale identically as $\mathcal{O}(n^3)$; UKF requires zero Jacobian code while providing 3rd-order accuracy.

---

### Problem 9.7 (Worked Example): Cholesky Factorization Algorithm Specification
**Problem Statement:** Write the exact algorithmic pseudo-code for the Cholesky factorization $A = L L^T$ of a symmetric positive-definite matrix $A \in \mathbb{R}^{n \times n}$.

**Step-by-Step Derivation:**
1. Algorithm (Cholesky-Banachiewicz):
   For $j = 0$ to $n-1$:
     - Diagonal element:
       $$L_{j, j} = \sqrt{A_{j, j} - \sum_{k=0}^{j-1} L_{j, k}^2}$$
       If $L_{j, j} \le 0$ or NaN, throw `NonPositiveDefiniteMatrixException`.
     - Sub-diagonal elements (for $i = j+1$ to $n-1$):
       $$L_{i, j} = \frac{1}{L_{j, j}} \left( A_{i, j} - \sum_{k=0}^{j-1} L_{i, k} L_{j, k} \right)$$
2. Flop count:
   $$\sum_{j=1}^n \left( 1 + \sum_{i=j+1}^n 2 j \right) \approx \frac{1}{3} n^3\text{ flops}$$

**Final Result:**
Deterministic $\frac{1}{3}n^3$ algorithm; failure to take real square root directly detects covariance loss of positive definiteness.

---

### Problem 9.8 (Worked Example): Unscented Transform on a Pure Quadratic Function
**Problem Statement:** Let scalar $x \sim \mathcal{N}(0, \sigma^2)$ with $\sigma = 2$. Compute the true mean and variance of $y = x^2$. Show that the Unscented Transform with $\alpha = 1, \beta = 2, \kappa = 2$ ($n=1$) calculates the exact true mean and variance.

**Step-by-Step Derivation:**
1. Analytical true values:
   $x \sim \mathcal{N}(0, 4)$.
   $$\mathbb{E}[y] = \mathbb{E}[x^2] = \sigma^2 = 4.0$$
   $$\operatorname{Var}(y) = \mathbb{E}[x^4] - (\mathbb{E}[x^2])^2 = 3\sigma^4 - \sigma^4 = 2\sigma^4 = 2(16) = 32.0$$
2. Unscented Transform:
   $n = 1, \alpha = 1, \beta = 2, \kappa = 2$.
   $$\lambda = \alpha^2(n + \kappa) - n = 1(1 + 2) - 1 = 2$$
   $$n + \lambda = 1 + 2 = 3$$
   Weights:
   $$W_0^{(m)} = \frac{\lambda}{n + \lambda} = \frac{2}{3}$$
   $$W_0^{(c)} = \frac{2}{3} + (1 - 1 + 2) = \frac{2}{3} + 2 = \frac{8}{3}$$
   $$W_1^{(m)} = W_1^{(c)} = W_2^{(m)} = W_2^{(c)} = \frac{1}{2(3)} = \frac{1}{6}$$
   Sigma points:
   $$\sqrt{(n + \lambda) P} = \sqrt{3 \times 4} = \sqrt{12} = 2\sqrt{3}$$
   $$\mathcal{X}_0 = 0$$
   $$\mathcal{X}_1 = +2\sqrt{3} \implies \mathcal{Y}_1 = (2\sqrt{3})^2 = 12$$
   $$\mathcal{X}_2 = -2\sqrt{3} \implies \mathcal{Y}_2 = (-2\sqrt{3})^2 = 12$$
   $$\mathcal{Y}_0 = 0^2 = 0$$
3. Reconstructed mean:
   $$\bar{y}_{\text{UKF}} = W_0^{(m)} \mathcal{Y}_0 + W_1^{(m)} \mathcal{Y}_1 + W_2^{(m)} \mathcal{Y}_2 = \frac{2}{3}(0) + \frac{1}{6}(12) + \frac{1}{6}(12) = 0 + 2 + 2 = 4.0$$
   Exact match: $\bar{y}_{\text{UKF}} = \bar{y}_{\text{true}} = 4.0$!
4. Reconstructed variance:
   Deviations: $\mathcal{Y}_0 - \bar{y} = -4, \mathcal{Y}_1 - \bar{y} = +8, \mathcal{Y}_2 - \bar{y} = +8$.
   $$P_{y, \text{UKF}} = W_0^{(c)} (-4)^2 + W_1^{(c)} (8)^2 + W_2^{(c)} (8)^2 = \frac{8}{3}(16) + \frac{1}{6}(64) + \frac{1}{6}(64) = \frac{128}{3} + \frac{128}{6} = \frac{128}{3} + \frac{64}{3} = \frac{192}{3} = 32.0$$
   Exact match: $P_{y, \text{UKF}} = \operatorname{Var}(y)_{\text{true}} = 32.0$!

**Final Result:**
$$\bar{y}_{\text{UKF}} = 4.0\text{ (Exact)}, \quad P_y = 32.0\text{ (Exact to machine precision)}$$

---

### Problem 9.9 (Worked Example): Square Root UKF (SR-UKF) Architecture
**Problem Statement:** In embedded robotics, the Square Root UKF (SR-UKF) propagates the Cholesky factor $S$ directly ($P = S S^T$) without ever squaring or inverting $P$. State the two linear algebra primitives that enable SR-UKF.

**Step-by-Step Derivation:**
1. QR Decomposition (Householder / Givens):
   To propagate covariance square root $S = \sqrt{P}$:
   Form the matrix of weighted sigma point deviations $A = \sqrt{W_1^{(c)}} [\mathcal{X}_1 - \hat{x}, \dots, \mathcal{X}_{2n} - \hat{x}, \sqrt{Q}]$.
   Compute QR decomposition: $A^T = Q R_T$.
   Then the upper-triangular factor $R_T^T$ is the exact updated Cholesky factor!
2. Cholesky Rank-1 Update / Downdate:
   For the central point weight $W_0^{(c)}$:
   If $W_0^{(c)} > 0$, perform Cholesky update: $\operatorname{cholupdate}(S, \mathcal{X}_0 - \hat{x}, +\sqrt{W_0^{(c)}})$.
   If $W_0^{(c)} < 0$, perform Cholesky downdate: $\operatorname{choldowndate}(S, \mathcal{X}_0 - \hat{x}, -\sqrt{|W_0^{(c)}|})$.
3. Benefit:
   Condition number is halved: $\kappa(S) = \sqrt{\kappa(P)}$, guaranteeing that SR-UKF runs in single-precision floating-point without loss of positive definiteness.

**Final Result:**
SR-UKF operates via QR factorization and Cholesky rank-1 downdating.

---

### Problem 9.10 (Worked Example): High-Dimensional Sigma-Point Weight Collapse
**Problem Statement:** As state dimension $n$ grows large (e.g. $n = 50$ in whole-body humanoid control), show what happens to the central weight $W_0^{(m)}$ if $\alpha = 1.0$ and $\kappa = 0$.

**Step-by-Step Derivation:**
1. $\lambda = \alpha^2(n + \kappa) - n = 1.0(n + 0) - n = 0$.
2. For $\lambda = 0$:
   $$W_0^{(m)} = \frac{0}{n + 0} = 0.0$$
   $$W_i^{(m)} = \frac{1}{2n} = \frac{1}{100} = 0.01$$
3. What if $\kappa = 3 - n$?
   Then $\lambda = 3 - n = 3 - 50 = -47$.
   $$n + \lambda = 50 - 47 = 3$$
   $$W_0^{(m)} = \frac{-47}{3} \approx -15.6667$$
   The central weight becomes massively negative ($-15.7$), while peripheral weights become positive ($+0.1667$).
   This causes extreme cancellation errors in floating point.
4. Lesson: In high dimensions ($n > 3$), always keep $\alpha \in [10^{-4}, 10^{-2}]$ and $\kappa = 0$, ensuring $\lambda$ scales proportionally with $n$.

**Final Result:**
In high dimensions, setting $\kappa = 3-n$ causes severe negative weight collapse; use $\alpha \ll 1, \kappa = 0$.

---

### Problem 9.11 (Solved Exercise): Number of Sigma Points in UKF
**Problem Statement:** Compare the number of sigma points generated by the canonical symmetric Unscented Transform ($2n+1$), the Minimum Sigma-Point simplex transform ($n+1$), and the 5th-order Gauss-Hermite cubature ($2n^2 + 1$) for $n = 6$.

**Step-by-Step Solution:**
1. Symmetric UKF: $2n + 1 = 2(6) + 1 = 13$ points.
2. Simplex UKF: $n + 1 = 6 + 1 = 7$ points.
3. 5th-order Cubature: $2n^2 + 1 = 2(36) + 1 = 73$ points.

**Final Answer:**
$$\text{Simplex: } 7, \quad \text{Canonical: } 13, \quad \text{Cubature: } 73$$

---

### Problem 9.12 (Solved Exercise): Reconstructing Covariance from Sigma Points
**Problem Statement:** Verify that passing sigma points through the identity transformation $g(x) = x$ reconstructs the exact original covariance $P$.

**Step-by-Step Solution:**
1. If $g(x) = x$, then $\mathcal{Y}_i = \mathcal{X}_i$.
2. $\bar{y} = \sum W_i^{(m)} \mathcal{X}_i = \bar{x}$.
3. Deviations: $\mathcal{Y}_i - \bar{y} = \mathcal{X}_i - \bar{x} = \Delta x_i$.
4. Covariance:
   $$P_y = \sum_{i=0}^{2n} W_i^{(c)} \Delta x_i \Delta x_i^T = W_0^{(c)} (0) + 2 \sum_{i=1}^n \frac{1}{2(n+\lambda)} \sigma_i \sigma_i^T = \frac{1}{n+\lambda} (n+\lambda) P = P \quad \blacksquare$$

---

### Problem 9.13 (Solved Exercise): Parameter Tuning Rules of Thumb
**Problem Statement:** Summarize the standard textbook recommendations for UKF parameters $(\alpha, \beta, \kappa)$ for Gaussian tracking.

**Step-by-Step Solution:**
- $\alpha$: spread parameter. Default $\alpha = 10^{-3}$ for severe nonlinearities to prevent sampling far from the mean; $\alpha = 1.0$ for mild polynomial nonlinearities.
- $\beta$: distribution shape. $\beta = 2.0$ is strictly optimal for Gaussian distributions.
- $\kappa$: secondary scaling. $\kappa = 0$ for general multivariable systems; $\kappa = 3 - n$ for $n \le 3$.

**Final Answer:**
$$\alpha = 10^{-3}, \quad \beta = 2.0, \quad \kappa = 0$$

---

### Problem 9.14 (Solved Exercise): Comparison on Radar Range-Bearing
**Problem Statement:** Under what sensor geometry conditions does UKF show the largest accuracy advantage over EKF in radar tracking?

**Step-by-Step Solution:**
1. Low range-to-bearing-uncertainty ratio: when range $\rho$ is small relative to cross-track position uncertainty $\sigma_{\text{cross}} = \rho \sigma_\phi$.
2. Large angular uncertainty: when bearing noise $\sigma_\phi > 5^\circ$ ($0.087\text{ rad}$), the banana-shaped posterior distribution severely violates Taylor linearization.
3. Rapid high-g maneuvers where vehicle acceleration changes significantly over $\Delta t$. $\blacksquare$

---

### Problem 9.15 (Solved Exercise): Cholesky Failure Recovery
**Problem Statement:** If numerical roundoff causes the predicted covariance $P_{k|k-1}$ to have a minimum eigenvalue $\lambda_{\min} = -10^{-15}$, how should the UKF recover before calling Cholesky factorization?

**Step-by-Step Solution:**
1. Enforce symmetry: $P \leftarrow \frac{1}{2}(P + P^T)$.
2. Compute eigenvalue decomposition: $P = V \Lambda V^T$.
3. Threshold eigenvalues: $\Lambda_{ii} \leftarrow \max(\Lambda_{ii}, 10^{-12})$.
4. Reconstruct: $P \leftarrow V \Lambda V^T$.
5. Alternatively, add diagonal jitter: $P \leftarrow P + (|\lambda_{\min}| + 10^{-12}) I_n$. $\blacksquare$

---

### Problem 9.16 (Solved Exercise): Scalar Cubic Transformation Benchmark
**Problem Statement:** Let $x \sim \mathcal{N}(0, 1)$ and $y = x^3$. Compute $\mathbb{E}[y]$ using EKF versus UKF.

**Step-by-Step Solution:**
1. True expectation: since $x^3$ is an odd function and Gaussian is symmetric around $0$, $\mathbb{E}[x^3] = 0$.
2. EKF: $g(\mathbb{E}[x]) = 0^3 = 0$.
3. UKF: sigma points are $0, +\sqrt{3}, -\sqrt{3}$.
   $$\mathcal{Y}_0 = 0, \quad \mathcal{Y}_1 = (\sqrt{3})^3 = 3\sqrt{3}, \quad \mathcal{Y}_2 = (-\sqrt{3})^3 = -3\sqrt{3}$$
   $$\bar{y}_{\text{UKF}} = W_0(0) + W_1(3\sqrt{3}) + W_1(-3\sqrt{3}) = 0$$
4. Both correctly predict $0$ due to odd symmetry. $\blacksquare$

---

### Problem 9.17 (Solved Exercise): Unscented Transform on Quaternion Dynamics
**Problem Statement:** Why cannot unit quaternions $q \in \mathbb{S}^3$ ($\|q\| = 1$) be directly averaged using the standard UKF weighted sum?

**Step-by-Step Solution:**
1. Linear combinations of unit quaternions do not preserve unit norm: $\|\sum W_i q_i\| \neq 1$.
2. Quaternions possess a double-cover ambiguity: $q$ and $-q$ represent the identical physical 3D rotation. If $\mathcal{X}_1 = q$ and $\mathcal{X}_2 = -q$, linear averaging yields $\frac{q - q}{2} = 0$, a singularity!
3. Solution: operate UKF on a 3-dimensional Lie algebra error vector $\delta \theta \in \mathbb{R}^3$ via $\exp(\delta \theta / 2)$ (Unscented Quaternion Estimator - USQUE). $\blacksquare$

---

### Problem 9.18 (Solved Exercise): Central Sigma Point Weight Vanishing
**Problem Statement:** Under what parameter combination does the central sigma point have weight $W_0^{(m)} = 0$?

**Step-by-Step Solution:**
1. Formula: $W_0^{(m)} = \frac{\lambda}{n + \lambda}$.
2. $W_0^{(m)} = 0 \iff \lambda = 0$.
3. Since $\lambda = \alpha^2(n + \kappa) - n$:
   $$\lambda = 0 \iff \alpha^2(n + \kappa) = n \iff \alpha = \sqrt{\frac{n}{n + \kappa}}$$
4. For $\kappa = 0$, this occurs when $\alpha = 1.0$.

**Final Answer:**
$$W_0^{(m)} = 0 \iff \alpha = 1.0\text{ and }\kappa = 0$$

---

### Problem 9.19 (Solved Exercise): Innovation Whiteness in UKF
**Problem Statement:** Is the innovation sequence $y_k = z_k - \hat{z}_{k|k-1}$ of a properly tuned UKF statistically white?

**Step-by-Step Solution:**
1. Because the UKF captures the true posterior mean and covariance to 3rd order, the residual $y_k$ reflects purely unpredictable innovation.
2. By the Orthogonality Principle, the innovation sequence remains uncorrelated across time: $\mathbb{E}[y_j y_k^T] \approx S_k \delta_{jk}$, confirmed by autocorrelation diagnostic tests. $\blacksquare$

---

### Problem 9.20 (Solved Exercise): Non-Local Nonlinearity Failure
**Problem Statement:** If $\alpha = 1.0$, sigma points are placed at distance $\sqrt{n} \sigma$. For $n = 20$, $\sqrt{20} \approx 4.47\sigma$. Why does this cause severe estimation errors if $g(x)$ has localized features (such as obstacle boundaries)?

**Step-by-Step Solution:**
1. A sigma point placed $4.5\sigma$ away samples the function deep in the extreme tails of the Gaussian distribution.
2. If the physical sensor has a step-discontinuity (e.g. laser beam hitting an obstacle corner at $2\sigma$), the sigma point samples the wrong geometric surface.
3. Setting $\alpha = 10^{-3}$ contracts the sigma points tightly within $0.004\sigma$ of the mean, sampling purely the local curvature and preventing tail contamination. $\blacksquare$
