# Chapter 8: The Extended Kalman Filter (EKF): Nonlinear Systems and Taylor Linearization

## 8.1 Introduction: Conquering Physical Nonlinearity

In the physical world, pure linearity is an idealized mathematical fiction. Robotic platforms rotate on non-Euclidean manifolds, kinematic velocities couple through trigonometric projections, acoustic and electromagnetic sensors measure ranges via Euclidean norms ($\sqrt{x^2 + y^2}$), and cameras project 3D rays through perspective division ($u = f_x \frac{X}{Z}$).

When the state propagation function $f(\cdot)$ or observation function $h(\cdot)$ is nonlinear:
$$x_k = f(x_{k-1}, u_{k-1}) + w_k$$
$$z_k = h(x_k) + v_k$$
the linear Kalman filter equations no longer apply. If a Gaussian random vector is passed through a nonlinear mapping, the output probability distribution is fundamentally non-Gaussian (skewed, multi-modal, or heavy-tailed).

The **Extended Kalman Filter (EKF)** is the classic workhorse of aerospace and robotics estimation. It resolves nonlinearity through **first-order multivariable Taylor series linearization** around the current state estimate.

In this chapter, we derive the mathematical foundations of the EKF, formulate the exact Jacobian matrices for differential-drive robots and range-bearing radar systems, analyze the critical phenomenon of angle-wrapping, expose the failure modes and divergence pathologies of first-order linearization, and solve 20 rigorous problems.

---

## 8.2 The Nonlinear State-Space Formulation

Consider the discrete nonlinear dynamic system:
$$x_k = f(x_{k-1}, u_{k-1}) + w_k$$
$$z_k = h(x_k) + v_k$$
where:
- $x_k \in \mathbb{R}^n$ is the state vector.
- $u_{k-1} \in \mathbb{R}^p$ is the deterministic control input.
- $w_k \sim \mathcal{N}(0, Q_k)$ is zero-mean Gaussian process noise.
- $z_k \in \mathbb{R}^m$ is the observation vector.
- $v_k \sim \mathcal{N}(0, R_k)$ is zero-mean Gaussian measurement noise.
- $f : \mathbb{R}^n \times \mathbb{R}^p \to \mathbb{R}^n$ and $h : \mathbb{R}^n \to \mathbb{R}^m$ are continuously differentiable $\mathcal{C}^1$ vector functions.

### 8.2.1 Multivariable Taylor Series Expansion
Let $\hat{x}_{k-1|k-1}$ be the posterior estimate at step $k-1$ with estimation error $\tilde{x}_{k-1|k-1} = x_{k-1} - \hat{x}_{k-1|k-1}$.
Expanding $f(x_{k-1}, u_{k-1})$ in a multivariable Taylor series around the estimate $\hat{x}_{k-1|k-1}$:

$$f(x_{k-1}, u_{k-1}) = f(\hat{x}_{k-1|k-1}, u_{k-1}) + \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}, u_{k-1}} (x_{k-1} - \hat{x}_{k-1|k-1}) + \mathcal{O}(\|\tilde{x}_{k-1|k-1}\|^2)$$

Neglecting higher-order terms $\mathcal{O}(\|\tilde{x}\|^2)$ yields the linear affine approximation:
$$x_k \approx f(\hat{x}_{k-1|k-1}, u_{k-1}) + F_k \tilde{x}_{k-1|k-1} + w_k$$
where $F_k \in \mathbb{R}^{n \times n}$ is the **State Transition Jacobian Matrix**:
$$F_k = \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}, u_{k-1}} = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_n}{\partial x_1} & \cdots & \frac{\partial f_n}{\partial x_n} \end{bmatrix}$$

Similarly, expanding the measurement function $h(x_k)$ around the predicted prior state $\hat{x}_{k|k-1}$:
$$h(x_k) = h(\hat{x}_{k|k-1}) + \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}} (x_k - \hat{x}_{k|k-1}) + \mathcal{O}(\|\tilde{x}_{k|k-1}\|^2)$$
$$z_k \approx h(\hat{x}_{k|k-1}) + H_k \tilde{x}_{k|k-1} + v_k$$
where $H_k \in \mathbb{R}^{m \times n}$ is the **Measurement Sensitivity Jacobian Matrix**:
$$H_k = \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}} = \begin{bmatrix} \frac{\partial h_1}{\partial x_1} & \cdots & \frac{\partial h_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial h_m}{\partial x_1} & \cdots & \frac{\partial h_m}{\partial x_n} \end{bmatrix}$$

---

## 8.3 The Extended Kalman Filter Algorithmic Cycle

The operational cycle of the EKF preserves the elegant two-phase structure of the linear filter, but with a crucial distinction:
- **State means** are propagated directly through the full nonlinear functions $f(\cdot)$ and $h(\cdot)$.
- **Covariances** are propagated linearly through the local Jacobian matrices $F_k$ and $H_k$.

```
+---------------------------------------------------------------------------------------------------+
|                           EXTENDED KALMAN FILTER (EKF) CYCLE                                      |
+---------------------------------------------------------------------------------------------------+
| 1. PREDICT PHASE (TIME UPDATE):                                                                   |
|    - Prior state mean (Nonlinear):                                                                |
|         \hat{x}_{k|k-1} = f(\hat{x}_{k-1|k-1}, u_{k-1})                                           |
|    - Compute State Jacobian:                                                                      |
|         F_k = \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}, u_{k-1}}           |
|    - Prior covariance (Linearized):                                                               |
|         P_{k|k-1} = F_k P_{k-1|k-1} F_k^T + Q_k                                                  |
|                                                                                                   |
| 2. UPDATE PHASE (MEASUREMENT UPDATE):                                                             |
|    - Compute Measurement Jacobian:                                                                |
|         H_k = \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}}                       |
|    - Innovation residual (Nonlinear):                                                             |
|         y_k = z_k - h(\hat{x}_{k|k-1})                                                            |
|    - Innovation covariance:                                                                       |
|         S_k = H_k P_{k|k-1} H_k^T + R_k                                                           |
|    - Kalman Gain:                                                                                 |
|         K_k = P_{k|k-1} H_k^T S_k^{-1}                                                            |
|    - Posterior state mean:                                                                        |
|         \hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k                                                |
|    - Posterior covariance (Joseph Stabilized Form):                                               |
|         P_{k|k} = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T                        |
+---------------------------------------------------------------------------------------------------+
```

---

## 8.4 Case Study 1: Differential-Drive Mobile Robot Kinematics

Consider a two-wheeled differential drive mobile robot operating in a 2D plane. The state is $x = [p_x, p_y, \theta]^T$, representing position coordinates and heading angle.
Control inputs are forward linear velocity $v_k$ and angular yaw rate $\omega_k$: $u = [v, \omega]^T$.

### 8.4.1 Exact Arc Kinematics vs Small-Angle Euler
Over sampling interval $\Delta t$, if $\omega \neq 0$, the robot moves along a circular arc of radius $R = v/\omega$:
$$f(x, u) = \begin{bmatrix} p_x + \frac{v}{\omega} (\sin(\theta + \omega \Delta t) - \sin\theta) \\ p_y - \frac{v}{\omega} (\cos(\theta + \omega \Delta t) - \cos\theta) \\ \theta + \omega \Delta t \end{bmatrix}$$

For small $\omega \Delta t \ll 1$ (or using the mid-point orientation $\theta + \frac{1}{2}\omega \Delta t$):
$$f(x, u) \approx \begin{bmatrix} p_x + v \Delta t \cos\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ p_y + v \Delta t \sin\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ \theta + \omega \Delta t \end{bmatrix}$$

### 8.4.2 State Jacobian Matrix $F_k$
Differentiating with respect to state $x = [p_x, p_y, \theta]^T$:
$$\frac{\partial f_1}{\partial p_x} = 1, \quad \frac{\partial f_1}{\partial p_y} = 0, \quad \frac{\partial f_1}{\partial \theta} = -v \Delta t \sin\left(\theta + \frac{1}{2}\omega \Delta t\right)$$
$$\frac{\partial f_2}{\partial p_x} = 0, \quad \frac{\partial f_2}{\partial p_y} = 1, \quad \frac{\partial f_2}{\partial \theta} = v \Delta t \cos\left(\theta + \frac{1}{2}\omega \Delta t\right)$$
$$\frac{\partial f_3}{\partial p_x} = 0, \quad \frac{\partial f_3}{\partial p_y} = 0, \quad \frac{\partial f_3}{\partial \theta} = 1$$

$$F_k = \begin{bmatrix} 1 & 0 & -v \Delta t \sin\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ 0 & 1 & v \Delta t \cos\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ 0 & 0 & 1 \end{bmatrix}$$

Notice that heading uncertainty couples directly into position covariance through forward velocity $v$ and the trigonometric terms.

---

## 8.5 Case Study 2: Range-Bearing Radar Sensor Update

Let a stationary radar sensor at the origin $(0, 0)$ observe a target robot at state $x = [p_x, v_x, p_y, v_y]^T$.
The sensor measures range $r$ and bearing angle $\phi$:
$$z_k = h(x_k) + v_k = \begin{bmatrix} \sqrt{p_x^2 + p_y^2} \\ \operatorname{atan2}(p_y, p_x) \end{bmatrix} + v_k$$

### 8.5.1 Measurement Jacobian Matrix $H_k$
Let $\rho = \sqrt{p_x^2 + p_y^2}$ be the Euclidean distance.
1. Differentiating range $h_1 = \sqrt{p_x^2 + p_y^2}$:
   $$\frac{\partial h_1}{\partial p_x} = \frac{p_x}{\sqrt{p_x^2 + p_y^2}} = \frac{p_x}{\rho}, \quad \frac{\partial h_1}{\partial p_y} = \frac{p_y}{\rho}, \quad \frac{\partial h_1}{\partial v_x} = 0, \quad \frac{\partial h_1}{\partial v_y} = 0$$
2. Differentiating bearing $h_2 = \operatorname{atan2}(p_y, p_x)$:
   Recall that $\frac{d}{dx}\operatorname{atan2}(y, x) = -\frac{y}{x^2 + y^2}$ and $\frac{d}{dy}\operatorname{atan2}(y, x) = \frac{x}{x^2 + y^2}$.
   $$\frac{\partial h_2}{\partial p_x} = -\frac{p_y}{\rho^2}, \quad \frac{\partial h_2}{\partial p_y} = \frac{p_x}{\rho^2}, \quad \frac{\partial h_2}{\partial v_x} = 0, \quad \frac{\partial h_2}{\partial v_y} = 0$$

Assembling the $2 \times 4$ Jacobian matrix:
$$H_k = \begin{bmatrix} \frac{p_x}{\rho} & 0 & \frac{p_y}{\rho} & 0 \\ -\frac{p_y}{\rho^2} & 0 & \frac{p_x}{\rho^2} & 0 \end{bmatrix}$$

### 8.5.2 Angle Wrapping: The Silent Filter Killer
When computing the innovation for angular measurements:
$$y_\phi = z_\phi - h_\phi(\hat{x})$$
both $z_\phi$ and $h_\phi$ lie in $[-\pi, \pi]$.
If $z_\phi = +\pi - 0.05$ ($+177^\circ$) and $h_\phi = -\pi + 0.05$ ($-177^\circ$), the true physical difference is only $0.10\text{ rad}$ ($5.7^\circ$).
However, a naive subtraction yields:
$$y_\phi = (+\pi - 0.05) - (-\pi + 0.05) = 2\pi - 0.10 \approx +6.18\text{ rad} \approx +354^\circ!$$
This massive spurious innovation injects an enormous false correction into the state, causing instant filter divergence.

**Strict Mandate:** Every angular innovation **must** be normalized to the interval $[-\pi, \pi]$:
$$y_\phi \leftarrow \operatorname{atan2}(\sin(y_\phi), \cos(y_\phi)) = \operatorname{fmod}(y_\phi + \pi, 2\pi) - \pi$$

---

## 8.6 Pathologies of the Extended Kalman Filter

While computationally efficient ($\mathcal{O}(n^3)$), the EKF exhibits several fundamental theoretical pathologies:

1. **Nonzero Mean Truncation Bias:**
   In truth, $\mathbb{E}[f(x)] \neq f(\mathbb{E}[x])$ for nonlinear functions (Jensen’s inequality). The Taylor approximation discards the second-order Hessian term:
   $$\mathbb{E}[f(x)] \approx f(\hat{x}) + \frac{1}{2} \sum_{i=1}^n e_i \operatorname{tr}\left( \nabla^2 f_i(\hat{x}) P \right)$$
   Discarding this term introduces an unmodeled persistent estimation bias.
2. **False Consistency and Overconfidence:**
   Because the Jacobian $H = \left.\frac{\partial h}{\partial x}\right|_{\hat{x}}$ is evaluated at the estimated state $\hat{x}$ rather than the latent true state $x$, errors in $\hat{x}$ cause $H$ to be miscalculated. In SLAM applications, this creates spurious information along unobservable degrees of freedom (e.g. spurious orientation certainty), causing the filter to become falsely overconfident and diverge.
3. **Singularities in Jacobians:**
   In range-bearing tracking, as the target approaches the origin ($\rho \to 0$), the bearing Jacobian entries $-\frac{p_y}{\rho^2} \to \infty$. The Jacobian becomes unbounded, causing numerical explosion.

---

## 8.7 Mathematical Problem Set

### Problem 8.1 (Worked Example): Complete Range-Bearing EKF Update Step
**Problem Statement:** A 2D tracking system tracks state $x = [p_x, p_y]^T$. Prior estimate and covariance at step $k$ are:
$$\hat{x}_{k|k-1} = \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix}\text{ m}, \quad P_{k|k-1} = \begin{bmatrix} 2.0 & 0.0 \\ 0.0 & 2.0 \end{bmatrix}\text{ m}^2$$
A sensor measures range $r$ and bearing $\phi$:
$$z_k = \begin{bmatrix} 5.2\text{ m} \\ 0.95\text{ rad} \end{bmatrix}$$
with measurement noise covariance $R = \operatorname{diag}(0.1\text{ m}^2, 0.01\text{ rad}^2)$.
1. Compute the predicted measurement $\hat{z}_{k|k-1}$ and innovation $y_k$.
2. Compute the measurement Jacobian $H_k$.
3. Compute the innovation covariance $S_k$ and Kalman gain $K_k$.
4. Compute the posterior state estimate $\hat{x}_{k|k}$ and posterior covariance $P_{k|k}$.

**Step-by-Step Derivation:**
1. Predicted measurement:
   $$\rho = \sqrt{p_x^2 + p_y^2} = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = 5.0\text{ m}$$
   $$\hat{\phi} = \operatorname{atan2}(4.0, 3.0) \approx 0.927295\text{ rad} \approx 53.13^\circ$$
   $$\hat{z}_{k|k-1} = \begin{bmatrix} 5.0 \\ 0.927295 \end{bmatrix}$$
   Innovation:
   $$y_k = z_k - \hat{z}_{k|k-1} = \begin{bmatrix} 5.2 - 5.0 \\ 0.95 - 0.927295 \end{bmatrix} = \begin{bmatrix} 0.20 \\ 0.022705 \end{bmatrix}$$
2. Measurement Jacobian $H_k$:
   $$\frac{p_x}{\rho} = \frac{3}{5} = 0.60, \quad \frac{p_y}{\rho} = \frac{4}{5} = 0.80$$
   $$\rho^2 = 25.0$$
   $$-\frac{p_y}{\rho^2} = -\frac{4}{25} = -0.16\text{ m}^{-1}, \quad \frac{p_x}{\rho^2} = \frac{3}{25} = 0.12\text{ m}^{-1}$$
   $$H_k = \begin{bmatrix} 0.60 & 0.80 \\ -0.16 & 0.12 \end{bmatrix}$$
3. Innovation covariance $S_k = H_k P H_k^T + R$:
   Notice that $P = 2 I_2$, so $H P H^T = 2 H H^T$:
   $$[H H^T]_{11} = 0.6^2 + 0.8^2 = 0.36 + 0.64 = 1.00$$
   $$[H H^T]_{12} = (0.6)(-0.16) + (0.8)(0.12) = -0.096 + 0.096 = 0.00$$
   $$[H H^T]_{22} = (-0.16)^2 + (0.12)^2 = 0.0256 + 0.0144 = 0.040$$
   $$H P H^T = 2 \begin{bmatrix} 1.00 & 0.00 \\ 0.00 & 0.040 \end{bmatrix} = \begin{bmatrix} 2.00 & 0.00 \\ 0.00 & 0.080 \end{bmatrix}$$
   Adding $R = \begin{bmatrix} 0.1 & 0 \\ 0 & 0.01 \end{bmatrix}$:
   $$S_k = \begin{bmatrix} 2.00 + 0.10 & 0.00 \\ 0.00 & 0.080 + 0.010 \end{bmatrix} = \begin{bmatrix} 2.10 & 0.00 \\ 0.00 & 0.090 \end{bmatrix}$$
   Because $S_k$ is diagonal:
   $$S_k^{-1} = \begin{bmatrix} 1/2.1 & 0 \\ 0 & 1/0.09 \end{bmatrix} \approx \begin{bmatrix} 0.476190 & 0 \\ 0 & 11.111111 \end{bmatrix}$$
4. Kalman gain $K_k = P H_k^T S_k^{-1}$:
   $$P H_k^T = 2 \begin{bmatrix} 0.60 & -0.16 \\ 0.80 & 0.12 \end{bmatrix} = \begin{bmatrix} 1.20 & -0.32 \\ 1.60 & 0.24 \end{bmatrix}$$
   $$K_k = \begin{bmatrix} 1.20 & -0.32 \\ 1.60 & 0.24 \end{bmatrix} \begin{bmatrix} 0.476190 & 0 \\ 0 & 11.111111 \end{bmatrix} = \begin{bmatrix} 0.571429 & -3.555556 \\ 0.761905 & 2.666667 \end{bmatrix}$$
5. Posterior state estimate:
   $$\hat{x}_{k|k} = \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix} + \begin{bmatrix} 0.571429 & -3.555556 \\ 0.761905 & 2.666667 \end{bmatrix} \begin{bmatrix} 0.20 \\ 0.022705 \end{bmatrix}$$
   $$\hat{p}_x = 3.0 + 0.571429(0.20) - 3.555556(0.022705) = 3.0 + 0.114286 - 0.080729 = 3.033557\text{ m}$$
   $$\hat{p}_y = 4.0 + 0.761905(0.20) + 2.666667(0.022705) = 4.0 + 0.152381 + 0.060547 = 4.212928\text{ m}$$
6. Posterior covariance:
   $$K_k S_k K_k^T = \begin{bmatrix} 0.5714 & -3.5556 \\ 0.7619 & 2.6667 \end{bmatrix} \begin{bmatrix} 2.1 & 0 \\ 0 & 0.09 \end{bmatrix} K_k^T$$
   $$P_{k|k} = P - K_k S_k K_k^T \approx \begin{bmatrix} 0.1764 & 0.0877 \\ 0.0877 & 0.1415 \end{bmatrix}$$

**Final Result:**
$$\hat{x}_{k|k} = \begin{bmatrix} 3.0336 \\ 4.2129 \end{bmatrix}\text{ m}, \quad P_{k|k} \approx \begin{bmatrix} 0.1764 & 0.0877 \\ 0.0877 & 0.1415 \end{bmatrix}\text{ m}^2$$

---

### Problem 8.2 (Worked Example): Numerical Finite-Difference Jacobian Approximation
**Problem Statement:** In many robotics applications, deriving analytical Jacobians for complex kinematic trees is prone to human algebra errors. Specify the central difference numerical Jacobian approximation formula and determine the optimal perturbation step size $\epsilon$ for 64-bit IEEE double floats ($\epsilon_{\text{mach}} \approx 2.22 \times 10^{-16}$).

**Step-by-Step Derivation:**
1. Central difference formula for column $j$ of Jacobian matrix $J = \frac{\partial g}{\partial x} \in \mathbb{R}^{m \times n}$:
   $$J_{:, j} = \frac{g(x + \epsilon e_j) - g(x - \epsilon e_j)}{2 \epsilon}$$
   where $e_j$ is the $j$-th standard basis vector.
2. Truncation error of central difference:
   By Taylor expansion:
   $$g(x + \epsilon) = g(x) + g'(x)\epsilon + \frac{1}{2} g''(x)\epsilon^2 + \frac{1}{6} g'''(x)\epsilon^3 + \dots$$
   $$g(x - \epsilon) = g(x) - g'(x)\epsilon + \frac{1}{2} g''(x)\epsilon^2 - \frac{1}{6} g'''(x)\epsilon^3 + \dots$$
   Subtracting:
   $$\frac{g(x + \epsilon) - g(x - \epsilon)}{2\epsilon} = g'(x) + \frac{1}{6} g'''(x) \epsilon^2$$
   The truncation error scales as $\mathcal{O}(\epsilon^2)$.
3. Roundoff error in floating-point:
   Evaluating $g(x)$ has relative precision $\epsilon_{\text{mach}}$. Subtracting two values introduces absolute error $\sim \epsilon_{\text{mach}} |g(x)|$.
   Dividing by $2\epsilon$ magnifies the roundoff error to $\frac{\epsilon_{\text{mach}}}{\epsilon}$.
4. Total error:
   $$E(\epsilon) \approx C_1 \epsilon^2 + C_2 \frac{\epsilon_{\text{mach}}}{\epsilon}$$
   Differentiating with respect to $\epsilon$ and setting to zero:
   $$2 C_1 \epsilon - C_2 \frac{\epsilon_{\text{mach}}}{\epsilon^2} = 0 \implies \epsilon^3 \sim \epsilon_{\text{mach}} \implies \epsilon^* \sim \epsilon_{\text{mach}}^{1/3}$$
5. Numerical value for double precision:
   $$\epsilon^* \approx (2.22 \times 10^{-16})^{1/3} \approx 6.06 \times 10^{-6}$$

**Final Result:**
$$\epsilon^* = \epsilon_{\text{mach}}^{1/3} \approx 10^{-6} \implies J_{:, j} \approx \frac{g(x + 10^{-6} e_j) - g(x - 10^{-6} e_j)}{2 \times 10^{-6}}$$

---

### Problem 8.3 (Worked Example): Angle-Wrapping Failure Simulation
**Problem Statement:** An autonomous car has prior heading estimate $\hat{\theta} = -3.10\text{ rad}$ ($-177.62^\circ$) with variance $P_\theta = 0.04\text{ rad}^2$. A compass measures heading $z_\theta = +3.12\text{ rad}$ ($+178.76^\circ$) with variance $R_\theta = 0.01\text{ rad}^2$.
1. Compute the Kalman gain $K_\theta$.
2. Compute the posterior estimate $\hat{\theta}_{\text{naive}}$ without angle wrapping.
3. Compute the posterior estimate $\hat{\theta}_{\text{correct}}$ with proper angle wrapping.

**Step-by-Step Derivation:**
1. Kalman gain:
   $$S = P_\theta + R_\theta = 0.04 + 0.01 = 0.05$$
   $$K_\theta = \frac{P_\theta}{S} = \frac{0.04}{0.05} = 0.80$$
2. Naive computation (no wrapping):
   $$y_{\text{naive}} = z_\theta - \hat{\theta} = 3.12 - (-3.10) = +6.22\text{ rad}$$
   $$\hat{\theta}_{\text{naive}} = \hat{\theta} + K_\theta y_{\text{naive}} = -3.10 + 0.80(6.22) = -3.10 + 4.976 = +1.876\text{ rad} \approx +107.48^\circ!$$
   *Disaster:* The true heading is nearly due West ($180^\circ$). But the naive filter reports heading East-Southeast ($+107^\circ$), an error of over $72^\circ$!
3. Correct computation (with angle wrapping):
   $$y_{\text{raw}} = 6.22\text{ rad}$$
   Wrap to $[-\pi, \pi]$:
   $$y_{\text{wrapped}} = 6.22 - 2\pi = 6.22 - 6.283185 = -0.063185\text{ rad} \approx -3.62^\circ$$
   $$\hat{\theta}_{\text{correct}} = \hat{\theta} + K_\theta y_{\text{wrapped}} = -3.10 + 0.80(-0.063185) = -3.10 - 0.050548 = -3.150548\text{ rad}$$
   Normalize to $[-\pi, \pi]$:
   $$-3.150548 + 2\pi \approx +3.132637\text{ rad} \approx +179.49^\circ$$

**Final Result:**
$$\hat{\theta}_{\text{naive}} = +1.876\text{ rad}\text{ (Catastrophic Failure)}, \quad \hat{\theta}_{\text{correct}} = +3.133\text{ rad}\text{ (Exact Physical Belief)}$$

---

### Problem 8.4 (Worked Example): Jensen's Inequality Bias in Radar Range
**Problem Statement:** A 1D position state $x \sim \mathcal{N}(0, \sigma^2)$ is measured by a range sensor that reports magnitude $z = |x| + v$ or distance from origin $h(x) = \sqrt{x^2} = |x|$.
1. Compute the EKF predicted measurement $\hat{z}_{\text{EKF}} = h(\hat{x})$ when $\hat{x} = 0$.
2. Compute the true expected measurement $\mathbb{E}[h(x)] = \mathbb{E}[|x|]$.
3. Quantify the linearization bias when $\sigma = 2.0\text{ m}$.

**Step-by-Step Derivation:**
1. EKF prediction:
   $$\hat{z}_{\text{EKF}} = h(\mathbb{E}[x]) = h(0) = |0| = 0.0\text{ m}$$
2. True expectation:
   Since $x \sim \mathcal{N}(0, \sigma^2)$, $|x|$ follows a half-normal distribution:
   $$\mathbb{E}[|x|] = \int_{-\infty}^\infty |x| \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{x^2}{2\sigma^2}} dx = 2 \int_0^\infty x \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{x^2}{2\sigma^2}} dx$$
   Substitute $u = \frac{x^2}{2\sigma^2}, du = \frac{x}{\sigma^2} dx$:
   $$\mathbb{E}[|x|] = \frac{2\sigma^2}{\sqrt{2\pi}\sigma} \int_0^\infty e^{-u} du = \sqrt{\frac{2}{\pi}} \sigma \approx 0.797885 \sigma$$
3. For $\sigma = 2.0\text{ m}$:
   $$\mathbb{E}[|x|] = 0.797885 \times 2.0 \approx 1.59577\text{ m}$$
   EKF prediction: $\hat{z}_{\text{EKF}} = 0.0\text{ m}$.
   Bias:
   $$\text{Bias} = \mathbb{E}[h(x)] - h(\mathbb{E}[x]) = 1.5958 - 0.0 = 1.5958\text{ m}$$
   The EKF predicts an observed range of $0\text{ m}$, when on average the sensor will report $1.6\text{ m}$.

**Final Result:**
$$\hat{z}_{\text{EKF}} = 0.0\text{ m}, \quad \mathbb{E}[h(x)] = 1.5958\text{ m} \quad (\text{Linearization Bias} = 1.5958\text{ m})$$

---

### Problem 8.5 (Worked Example): Jacobian of Dubins Airplane Kinematics
**Problem Statement:** A 3D fixed-wing drone follows Dubins kinematics with airspeed $V$, flight path angle $\gamma$, and yaw rate $\omega$:
$$\dot{x} = V \cos\theta \cos\gamma, \quad \dot{y} = V \sin\theta \cos\gamma, \quad \dot{z} = V \sin\gamma, \quad \dot{\theta} = \omega$$
Derive the continuous Jacobian matrix $A = \frac{\partial f}{\partial [x, y, z, \theta]^T}$.

**Step-by-Step Derivation:**
1. State vector $X = [x, y, z, \theta]^T \in \mathbb{R}^4$.
2. Compute partial derivatives for each component:
   - For $\dot{x} = V \cos\theta \cos\gamma$:
     $$\frac{\partial \dot{x}}{\partial x} = 0, \quad \frac{\partial \dot{x}}{\partial y} = 0, \quad \frac{\partial \dot{x}}{\partial z} = 0, \quad \frac{\partial \dot{x}}{\partial \theta} = -V \sin\theta \cos\gamma$$
   - For $\dot{y} = V \sin\theta \cos\gamma$:
     $$\frac{\partial \dot{y}}{\partial x} = 0, \quad \frac{\partial \dot{y}}{\partial y} = 0, \quad \frac{\partial \dot{y}}{\partial z} = 0, \quad \frac{\partial \dot{y}}{\partial \theta} = V \cos\theta \cos\gamma$$
   - For $\dot{z} = V \sin\gamma$:
     $$\frac{\partial \dot{z}}{\partial x} = 0, \quad \frac{\partial \dot{z}}{\partial y} = 0, \quad \frac{\partial \dot{z}}{\partial z} = 0, \quad \frac{\partial \dot{z}}{\partial \theta} = 0$$
   - For $\dot{\theta} = \omega$:
     $$\frac{\partial \dot{\theta}}{\partial x} = 0, \quad \frac{\partial \dot{\theta}}{\partial y} = 0, \quad \frac{\partial \dot{\theta}}{\partial z} = 0, \quad \frac{\partial \dot{\theta}}{\partial \theta} = 0$$
3. Assembling $4 \times 4$ continuous Jacobian $A$:
   $$A = \begin{bmatrix} 0 & 0 & 0 & -V \sin\theta \cos\gamma \\ 0 & 0 & 0 & V \cos\theta \cos\gamma \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}$$

**Final Result:**
$$A = \begin{bmatrix} 0 & 0 & 0 & -V \sin\theta \cos\gamma \\ 0 & 0 & 0 & V \cos\theta \cos\gamma \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}$$

---

### Problem 8.6 (Worked Example): Analytical vs Numerical Jacobian Verification
**Problem Statement:** For the range-bearing measurement function $h(x) = [\sqrt{x^2 + y^2}, \operatorname{atan2}(y, x)]^T$ evaluated at $(x, y) = (3.0, 4.0)$, compute the central difference numerical Jacobian with step size $\epsilon = 10^{-6}$ and compare each entry against the analytical Jacobian from Problem 8.1.

**Step-by-Step Derivation:**
1. Perturbations in $x$:
   $$x^+ = 3.0 + 10^{-6}, \quad x^- = 3.0 - 10^{-6}, \quad y = 4.0$$
   - Range:
     $$h_1(x^+, 4.0) = \sqrt{(3.000001)^2 + 16} = \sqrt{9.000006 + 16} = \sqrt{25.000006} \approx 5.000000600$$
     $$h_1(x^-, 4.0) = \sqrt{(2.999999)^2 + 16} = \sqrt{8.999994 + 16} = \sqrt{24.999994} \approx 4.999999400$$
     $$\frac{\partial h_1}{\partial x} \approx \frac{5.000000600 - 4.999999400}{2 \times 10^{-6}} = \frac{1.200 \times 10^{-6}}{2 \times 10^{-6}} = 0.600000000$$
     Analytical value: $3/5 = 0.600000000$. Error: $< 10^{-12}$.
   - Bearing:
     $$h_2(x^+, 4.0) = \operatorname{atan2}(4.0, 3.000001) \approx 0.927295058$$
     $$h_2(x^-, 4.0) = \operatorname{atan2}(4.0, 2.999999) \approx 0.927295378$$
     $$\frac{\partial h_2}{\partial x} \approx \frac{0.927295058 - 0.927295378}{2 \times 10^{-6}} = \frac{-0.320 \times 10^{-6}}{2 \times 10^{-6}} = -0.160000000$$
     Analytical value: $-4/25 = -0.160000000$. Error: $< 10^{-12}$.

**Final Result:**
Numerical Jacobian matches analytical Jacobian to 9 decimal places.

---

### Problem 8.7 (Worked Example): High-Curvature Nonlinear Divergence Case Study
**Problem Statement:** Consider a scalar state with cubic dynamics $x_k = x_{k-1}^3 + w_k$ and direct linear observation $z_k = x_k + v_k$. If true state is $x_0 = 1.5$ and the filter is initialized with $\hat{x}_0 = 0.5$ and $P_0 = 0.1$, show how the EKF predicts the state and explain why divergence occurs.

**Step-by-Step Derivation:**
1. State propagation:
   True state at $k=1$: $x_1 = (1.5)^3 = 3.375$.
2. EKF predicted state:
   $$\hat{x}_{1|0} = f(\hat{x}_0) = (0.5)^3 = 0.125$$
3. Jacobian of $f(x) = x^3$:
   $$F = \left.\frac{\partial f}{\partial x}\right|_{\hat{x}_0} = 3 \hat{x}_0^2 = 3(0.5)^2 = 0.75$$
4. Covariance prediction (assume $Q = 0.01$):
   $$P_{1|0} = F^2 P_0 + Q = (0.75)^2 (0.1) + 0.01 = 0.5625(0.1) + 0.01 = 0.06625$$
5. Failure analysis:
   Notice that the Jacobian at $\hat{x}_0 = 0.5$ was $F = 0.75 < 1.0$. The filter believed the system was *contractive*, shrinking covariance from $0.1$ to $0.066$.
   However, around the true state $x_0 = 1.5$, the true Jacobian is $3(1.5)^2 = 6.75 \gg 1.0$, which is *explosively expansive*!
   The EKF severely underestimates its uncertainty, causing the Kalman gain to remain small and the filter to diverge completely.

**Final Result:**
$$\text{Linearized }F = 0.75\text{ (Contractive)} \neq \text{True }F = 6.75\text{ (Explosive)} \implies \mathbf{Severe\ EKF\ Divergence}$$

---

### Problem 8.8 (Worked Example): Iterated Extended Kalman Filter (IEKF) Formulation
**Problem Statement:** In systems with highly nonlinear measurement equations $h(x)$, the standard EKF linearizes once at $\hat{x}_{k|k-1}$. The Iterated EKF (IEKF) performs a Gauss-Newton optimization loop to re-linearize $h(x)$ around updated estimates. Write the exact mathematical iteration for the IEKF measurement update.

**Step-by-Step Derivation:**
1. Initialize iteration index $i = 0$:
   $$\eta_0 = \hat{x}_{k|k-1}$$
2. For iteration $i = 0, 1, \dots, N_{\max}-1$:
   - Evaluate measurement Jacobian at current iterate:
     $$H_i = \left. \frac{\partial h}{\partial x} \right|_{\eta_i}$$
   - Compute iterate innovation covariance:
     $$S_i = H_i P_{k|k-1} H_i^T + R_k$$
   - Compute iterate gain:
     $$K_i = P_{k|k-1} H_i^T S_i^{-1}$$
   - Update state iterate:
     $$\eta_{i+1} = \hat{x}_{k|k-1} + K_i \left[ z_k - h(\eta_i) - H_i (\hat{x}_{k|k-1} - \eta_i) \right]$$
   - Convergence check: if $\|\eta_{i+1} - \eta_i\| < \epsilon$, break.
3. Final update:
   $$\hat{x}_{k|k} = \eta_{\text{final}}$$
   $$P_{k|k} = (I - K_{\text{final}} H_{\text{final}}) P_{k|k-1} (I - K_{\text{final}} H_{\text{final}})^T + K_{\text{final}} R K_{\text{final}}^T$$

**Final Result:**
The IEKF solves the maximum a posteriori (MAP) optimization problem via Gauss-Newton, eliminating first-order measurement linearization error.

---

### Problem 8.9 (Worked Example): Perspective Camera Projection Jacobian
**Problem Statement:** A pinhole camera with focal length $f$ observes a 3D point $X = [X, Y, Z]^T$ in camera coordinates. The pixel projection is:
$$u = f \frac{X}{Z}, \quad v = f \frac{Y}{Z}$$
Derive the $2 \times 3$ measurement Jacobian $H = \frac{\partial [u, v]^T}{\partial [X, Y, Z]^T}$.

**Step-by-Step Derivation:**
1. Differentiating $u = f X Z^{-1}$:
   $$\frac{\partial u}{\partial X} = \frac{f}{Z}, \quad \frac{\partial u}{\partial Y} = 0, \quad \frac{\partial u}{\partial Z} = -\frac{f X}{Z^2}$$
2. Differentiating $v = f Y Z^{-1}$:
   $$\frac{\partial v}{\partial X} = 0, \quad \frac{\partial v}{\partial Y} = \frac{f}{Z}, \quad \frac{\partial v}{\partial Z} = -\frac{f Y}{Z^2}$$
3. Assembling the Jacobian matrix:
   $$H = \begin{bmatrix} \frac{f}{Z} & 0 & -\frac{f X}{Z^2} \\ 0 & \frac{f}{Z} & -\frac{f Y}{Z^2} \end{bmatrix} = \frac{1}{Z} \begin{bmatrix} f & 0 & -u \\ 0 & f & -v \end{bmatrix}$$

**Final Result:**
$$H = \begin{bmatrix} \frac{f}{Z} & 0 & -\frac{f X}{Z^2} \\ 0 & \frac{f}{Z} & -\frac{f Y}{Z^2} \end{bmatrix}$$

---

### Problem 8.10 (Worked Example): Loss of S-Matrix Invertibility near Singularities
**Problem Statement:** In a polar coordinate tracking system, bearing measurement noise variance is $R_\phi = 0.01\text{ rad}^2$. Prior position covariance is $P = \sigma^2 I_2$ with $\sigma = 1.0\text{ m}$. Compute the bearing innovation variance $S_\phi$ as the estimated distance to origin $\rho \to 0$.

**Step-by-Step Derivation:**
1. Bearing Jacobian vector from Problem 8.1:
   $$H_\phi = \begin{bmatrix} -\frac{p_y}{\rho^2} & \frac{p_x}{\rho^2} \end{bmatrix}$$
2. Innovation variance:
   $$S_\phi = H_\phi P H_\phi^T + R_\phi = \sigma^2 H_\phi H_\phi^T + R_\phi$$
3. Inner product $H_\phi H_\phi^T$:
   $$H_\phi H_\phi^T = \left(-\frac{p_y}{\rho^2}\right)^2 + \left(\frac{p_x}{\rho^2}\right)^2 = \frac{p_y^2 + p_x^2}{\rho^4} = \frac{\rho^2}{\rho^4} = \frac{1}{\rho^2}$$
4. Innovation variance:
   $$S_\phi = \frac{\sigma^2}{\rho^2} + R_\phi = \frac{1.0}{\rho^2} + 0.01$$
5. Limit as $\rho \to 0$:
   $$\lim_{\rho \to 0} S_\phi = \lim_{\rho \to 0} \left(\frac{1.0}{\rho^2} + 0.01\right) = +\infty$$
   As $\rho \to 0$, $S_\phi \to \infty$, and the Kalman gain $K_\phi = P H_\phi^T S_\phi^{-1} \to 0$. The filter becomes completely paralyzed and loses numerical conditioning.

**Final Result:**
$$S_\phi = \frac{\sigma^2}{\rho^2} + R_\phi \to \infty\text{ as }\rho \to 0$$

---

### Problem 8.11 (Solved Exercise): Jacobian of Unicycle Heading Model
**Problem Statement:** For a unicycle robot state $[x, y, \theta]^T$ moving with constant speed $v$ and turn rate $\omega = 0$, evaluate the state transition Jacobian $F$ for $\Delta t = 0.1\text{ s}$ at $\theta = 0, \pi/2, \pi$.

**Step-by-Step Solution:**
1. From Section 8.4:
   $$F = \begin{bmatrix} 1 & 0 & -v \Delta t \sin\theta \\ 0 & 1 & v \Delta t \cos\theta \\ 0 & 0 & 1 \end{bmatrix}$$
2. At $\theta = 0$:
   $$F = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0.1 v \\ 0 & 0 & 1 \end{bmatrix}$$
3. At $\theta = \pi/2$:
   $$F = \begin{bmatrix} 1 & 0 & -0.1 v \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
4. At $\theta = \pi$:
   $$F = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & -0.1 v \\ 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
Transition matrices derived analytically for each cardinal heading.

---

### Problem 8.12 (Solved Exercise): 3D Range Measurement Jacobian
**Problem Statement:** A 3D beacon at $(x_b, y_b, z_b) = (10, 0, 0)$ measures Euclidean distance to a drone at $(p_x, p_y, p_z)$. Evaluate $H = \frac{\partial \rho}{\partial [p_x, p_y, p_z]}$ at drone position $(2, 6, 0)$.

**Step-by-Step Solution:**
1. Range formula:
   $$\rho = \sqrt{(p_x - x_b)^2 + (p_y - y_b)^2 + (p_z - z_b)^2}$$
2. Numerical coordinates:
   $$\Delta x = 2 - 10 = -8, \quad \Delta y = 6 - 0 = 6, \quad \Delta z = 0 - 0 = 0$$
   $$\rho = \sqrt{(-8)^2 + 6^2 + 0} = \sqrt{64 + 36} = \sqrt{100} = 10.0\text{ m}$$
3. Gradient:
   $$\frac{\partial \rho}{\partial p_x} = \frac{\Delta x}{\rho} = \frac{-8}{10} = -0.80$$
   $$\frac{\partial \rho}{\partial p_y} = \frac{\Delta y}{\rho} = \frac{6}{10} = 0.60$$
   $$\frac{\partial \rho}{\partial p_z} = \frac{\Delta z}{\rho} = \frac{0}{10} = 0.00$$

**Final Answer:**
$$H = \begin{bmatrix} -0.80 & 0.60 & 0.00 \end{bmatrix}$$

---

### Problem 8.13 (Solved Exercise): Second-Order Truncation Bound
**Problem Statement:** For a scalar measurement $h(x) = x^2$ with prior distribution $x \sim \mathcal{N}(\mu, \sigma^2)$, compute the exact error of the first-order Taylor approximation $h_{\text{linear}}(x) = \mu^2 + 2\mu(x - \mu)$ in expected value.

**Step-by-Step Solution:**
1. True expectation:
   $$\mathbb{E}[h(x)] = \mathbb{E}[x^2] = \mu^2 + \sigma^2$$
2. Linearized expectation:
   $$\mathbb{E}[h_{\text{linear}}(x)] = \mu^2 + 2\mu(\mathbb{E}[x] - \mu) = \mu^2 + 2\mu(0) = \mu^2$$
3. Truncation error:
   $$\text{Error} = \mathbb{E}[h(x)] - \mathbb{E}[h_{\text{linear}}(x)] = (\mu^2 + \sigma^2) - \mu^2 = \sigma^2$$
4. The truncation error equals the state variance $\sigma^2$ regardless of $\mu$.

**Final Answer:**
$$\text{Expected Truncation Error} = \sigma^2$$

---

### Problem 8.14 (Solved Exercise): Complex Step Differentiation for EKF Jacobians
**Problem Statement:** Explain the complex step differentiation method $g'(x) \approx \frac{\operatorname{Im}(g(x + i h))}{h}$ and prove that it suffers zero subtractive cancellation error compared to finite differences.

**Step-by-Step Solution:**
1. Expand $g(x + i h)$ in complex Taylor series:
   $$g(x + i h) = g(x) + i h g'(x) - \frac{h^2}{2} g''(x) - i \frac{h^3}{6} g'''(x) + \dots$$
2. Take the imaginary part:
   $$\operatorname{Im}(g(x + i h)) = h g'(x) - \frac{h^3}{6} g'''(x) + \dots$$
3. Divide by $h$:
   $$\frac{\operatorname{Im}(g(x + i h))}{h} = g'(x) - \frac{h^2}{6} g'''(x) + \dots$$
4. Notice that unlike finite difference $(g(x+h) - g(x))/h$, there is **no subtraction** of two function evaluations! Subtractive cancellation is mathematically impossible. One can set $h = 10^{-100}$ and achieve machine precision accuracy ($\sim 10^{-16}$) for the derivative. $\blacksquare$

---

### Problem 8.15 (Solved Exercise): GPS Pseudorange Jacobian
**Problem Statement:** A GPS receiver at position $x_r = [x, y, z]^T$ with clock bias $c \delta t$ observes satellite $s$ at $x_s = [x_s, y_s, z_s]^T$. Pseudorange is $\rho_s = \|x_r - x_s\| + c \delta t$. Derive the Jacobian row with respect to state $[x, y, z, c \delta t]^T$.

**Step-by-Step Solution:**
1. State is $X = [x, y, z, c \delta t]^T \in \mathbb{R}^4$.
2. Let $r = \sqrt{(x - x_s)^2 + (y - y_s)^2 + (z - z_s)^2}$ be the geometric range.
3. Partial derivatives:
   $$\frac{\partial \rho_s}{\partial x} = \frac{x - x_s}{r}, \quad \frac{\partial \rho_s}{\partial y} = \frac{y - y_s}{r}, \quad \frac{\partial \rho_s}{\partial z} = \frac{z - z_s}{r}, \quad \frac{\partial \rho_s}{\partial (c \delta t)} = 1$$
4. Let $u_s = \frac{x_r - x_s}{r}$ be the unit line-of-sight vector pointing from the satellite to the receiver.
   $$H_s = \begin{bmatrix} u_{s, x} & u_{s, y} & u_{s, z} & 1 \end{bmatrix}$$

**Final Answer:**
$$H_s = \begin{bmatrix} \frac{x - x_s}{r} & \frac{y - y_s}{r} & \frac{z - z_s}{r} & 1 \end{bmatrix}$$

---

### Problem 8.16 (Solved Exercise): Innovation Gating in Nonlinear Updates
**Problem Statement:** Why must Normalized Innovation Squared (NIS) gating $\epsilon = y_k^T S_k^{-1} y_k \le \chi^2_{\text{thresh}}$ be performed *after* angle wrapping is applied to the innovation $y_k$?

**Step-by-Step Solution:**
1. If angle wrapping is omitted, an innovation can take false values around $2\pi \approx 6.28\text{ rad}$.
2. For angular variance $S = 0.01\text{ rad}^2$, unwrapped NIS would be:
   $$\epsilon_{\text{unwrapped}} = \frac{(6.28)^2}{0.01} = \frac{39.44}{0.01} = 3944$$
3. Since $\chi^2(1)_{0.99} \approx 6.63$, the filter would falsely detect an extreme $3900\sigma$ sensor failure and reject a perfectly valid measurement.
4. Wrapping ensures $y \in [-\pi, \pi]$, yielding true physical Mahalanobis distances. $\blacksquare$

---

### Problem 8.17 (Solved Exercise): Non-Positive Definite Posterior in High-Curvature EKF
**Problem Statement:** In an EKF running standard update $P^+ = (I - K H) P^-$, roundoff error with large Jacobian entries produces $P^+ = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}$. Verify that $P^+$ has a negative eigenvalue and explain how the Joseph form prevents this.

**Step-by-Step Solution:**
1. Characteristic polynomial of $P^+$:
   $$\det(\lambda I - P^+) = (\lambda - 1)^2 - 4 = 0 \implies \lambda - 1 = \pm 2 \implies \lambda_1 = 3, \lambda_2 = -1$$
   The eigenvalue $\lambda_2 = -1$ is strictly negative.
2. In contrast, the Joseph update computes:
   $$P_{\text{Joseph}} = M P^- M^T + K R K^T$$
   which is the sum of two congruence transformations of positive semi-definite matrices. For any vector $z$: $z^T P_{\text{Joseph}} z \ge 0$, mathematically preventing negative eigenvalues. $\blacksquare$

---

### Problem 8.18 (Solved Exercise): Doppler Radar Radial Velocity Jacobian
**Problem Statement:** A radar measures radial velocity $\dot{\rho} = \frac{p_x v_x + p_y v_y}{\sqrt{p_x^2 + p_y^2}}$ of state $[p_x, p_y, v_x, v_y]^T$. Compute $\frac{\partial \dot{\rho}}{\partial v_x}$ and $\frac{\partial \dot{\rho}}{\partial v_y}$.

**Step-by-Step Solution:**
1. Radial velocity is linear in velocity variables $(v_x, v_y)$:
   $$\dot{\rho} = \left(\frac{p_x}{\rho}\right) v_x + \left(\frac{p_y}{\rho}\right) v_y$$
2. Direct differentiation yields:
   $$\frac{\partial \dot{\rho}}{\partial v_x} = \frac{p_x}{\rho}, \quad \frac{\partial \dot{\rho}}{\partial v_y} = \frac{p_y}{\rho}$$

**Final Answer:**
$$\frac{\partial \dot{\rho}}{\partial [v_x, v_y]} = \begin{bmatrix} \frac{p_x}{\rho} & \frac{p_y}{\rho} \end{bmatrix}$$

---

### Problem 8.19 (Solved Exercise): Condition for EKF Asymptotic Stability
**Problem Statement:** What mathematical conditions on the Jacobian matrices $F_k$ and $H_k$ along the true state trajectory guarantee exponential stability of the EKF?

**Step-by-Step Solution:**
By the Boutayeb and Darouach theorem (1997):
1. The Jacobians $F_k$ and $H_k$ must be uniformly bounded: $\|F_k\| \le \bar{f}, \|H_k\| \le \bar{h}$.
2. The pair $(F_k, H_k)$ must be uniformly completely observable:
   $$\sum_{i=k}^{k+N} \Phi^T(i, k) H_i^T R_i^{-1} H_i \Phi(i, k) \ge \alpha I > 0$$
3. The initial error $\|\tilde{x}_0\|$ and noise bounds must be sufficiently small such that higher-order Taylor terms remain dominated by linear contraction. $\blacksquare$

---

### Problem 8.20 (Solved Exercise): Jacobian Sparsity in Landmark SLAM
**Problem Statement:** In a 2D SLAM system with robot pose $[x_r, y_r, \theta_r]$ and $M = 100$ 2D landmark positions $[l_{1x}, l_{1y}, \dots, l_{Mx}, l_{My}]$, total state dimension is $n = 3 + 200 = 203$. When observing landmark $j$, how many non-zero entries exist in the $2 \times 203$ Jacobian matrix $H$?

**Step-by-Step Solution:**
1. The observation depends strictly on robot pose $(x_r, y_r, \theta_r)$ and the single observed landmark $(l_{jx}, l_{jy})$:
   $$z = h(x_r, y_r, \theta_r, l_{jx}, l_{jy})$$
2. All partial derivatives with respect to the other 99 landmarks are identically zero:
   $$\frac{\partial h}{\partial l_{ix}} = 0, \quad \frac{\partial h}{\partial l_{iy}} = 0 \quad \forall \, i \neq j$$
3. Active columns in $H$:
   - Robot pose: columns 1, 2, 3 (3 columns).
   - Landmark $j$: columns $3 + 2j - 1$ and $3 + 2j$ (2 columns).
4. Total non-zero columns: $3 + 2 = 5$ columns out of 203.
   Total non-zero entries in $2 \times 203$ matrix: $2 \times 5 = 10$ entries.
   Sparsity: $\frac{203 \times 2 - 10}{203 \times 2} = \frac{396}{406} \approx 97.54\%$ sparse.

**Final Answer:**
$$\text{Non-zero entries} = 10\text{ (Sparsity } = 97.54\%)$$
