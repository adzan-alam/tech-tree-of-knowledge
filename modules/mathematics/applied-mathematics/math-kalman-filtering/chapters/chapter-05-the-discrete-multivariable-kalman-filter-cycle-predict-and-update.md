# Chapter 5: The Discrete Multivariable Kalman Filter Cycle: Predict and Update

## 5.1 Introduction: The Multivariable State Space

In physical robotics, states are rarely scalar quantities. An autonomous manipulator arm, humanoid balance controller, or aerial drone possesses interconnected position coordinates, linear velocities, angular orientations, angular velocities, and sensor bias parameters spanning state dimensions $n \in [4, 20]$. Furthermore, modern robotic platforms deploy diverse sensor suites—laser rangefinders, wheel encoders, visual fiducial trackers, IMUs, and GPS receivers—generating multivariable measurement vectors $z_k \in \mathbb{R}^m$.

The discrete multivariable Kalman Filter is the optimal recursive minimum-variance Bayesian estimator for such linear Gaussian systems. It propagates the full multivariate mean vector $\hat{x} \in \mathbb{R}^n$ and the full error covariance matrix $P \in \mathbb{S}_+^n$, continuously balancing dynamic model prediction against stochastic measurement correction.

In this chapter, we formalize the canonical five-step multivariable Kalman filter cycle, analyze the numerical stability vulnerabilities of the textbook covariance update, derive the Joseph stabilized covariance equation, establish the sequential scalar update technique, and develop exact computational solutions across 20 rigorous problems.

---

## 5.2 The Canonical Discrete Kalman Filter Cycle

Let the latent physical state at discrete time step $k \in \mathbb{N}$ be $x_k \in \mathbb{R}^n$, governed by linear dynamics and observed through linear measurements:

$$x_k = F_k x_{k-1} + B_k u_{k-1} + w_k$$
$$z_k = H_k x_k + v_k$$

where:
- $F_k \in \mathbb{R}^{n \times n}$ is the state transition matrix.
- $B_k \in \mathbb{R}^{n \times p}$ is the control input matrix.
- $u_{k-1} \in \mathbb{R}^p$ is the known deterministic control input vector.
- $w_k \sim \mathcal{N}(0, Q_k)$ is zero-mean Gaussian process noise with covariance $Q_k \in \mathbb{S}_+^n$.
- $z_k \in \mathbb{R}^m$ is the observation vector.
- $H_k \in \mathbb{R}^{m \times n}$ is the measurement sensitivity matrix.
- $v_k \sim \mathcal{N}(0, R_k)$ is zero-mean Gaussian measurement noise with covariance $R_k \in \mathbb{S}_{++}^m$.
- $w_k$ and $v_j$ are mutually independent for all $k, j$: $\mathbb{E}[w_k v_j^T] = 0$.

```
+---------------------------------------------------------------------------------------------------+
|                            THE RECURSIVE KALMAN FILTER CYCLE                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Prior State & Covariance: [ \hat{x}_{k-1|k-1}, P_{k-1|k-1} ]                                   |
|                                     |                                                             |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 1. TIME UPDATE (PREDICT STEP)                                                             |   |
|   |    \hat{x}_{k|k-1} = F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}                                  |   |
|   |    P_{k|k-1}       = F_k P_{k-1|k-1} F_k^T + Q_k                                          |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|               (New measurement arrives: z_k \in \mathbb{R}^m)                                     |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 2. INNOVATION & RESIDUAL COVARIANCE                                                       |   |
|   |    y_k = z_k - H_k \hat{x}_{k|k-1}                                                        |   |
|   |    S_k = H_k P_{k|k-1} H_k^T + R_k                                                        |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 3. OPTIMAL KALMAN GAIN COMPUTATION                                                        |   |
|   |    K_k = P_{k|k-1} H_k^T S_k^{-1}                                                         |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 4. MEASUREMENT UPDATE (CORRECTION STEP)                                                   |   |
|   |    \hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k                                              |   |
|   |    P_{k|k}       = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T  (Joseph Form)|   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|                                     +---------------------------------> Next Step (k+1)           |
+---------------------------------------------------------------------------------------------------+
```

---

## 5.3 Detailed Examination of the Five Steps

### Step 1: State Prediction (Time Update)
$$\hat{x}_{k|k-1} = F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}$$
Taking the mathematical expectation of the system dynamics conditioned on all previous observations $Z_{1:k-1} = \{z_1, \dots, z_{k-1}\}$:
$$\mathbb{E}[x_k | Z_{1:k-1}] = F_k \mathbb{E}[x_{k-1} | Z_{1:k-1}] + B_k u_{k-1} + \mathbb{E}[w_k | Z_{1:k-1}]$$
Since process noise $w_k$ has zero mean and is independent of past measurements, $\mathbb{E}[w_k | Z_{1:k-1}] = 0$. Thus:
$$\hat{x}_{k|k-1} = F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}$$

### Step 2: Covariance Prediction
$$P_{k|k-1} = F_k P_{k-1|k-1} F_k^T + Q_k$$
Define the prior estimation error $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$. Subtracting the state estimate from true state:
$$\tilde{x}_{k|k-1} = (F_k x_{k-1} + B_k u_{k-1} + w_k) - (F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}) = F_k \tilde{x}_{k-1|k-1} + w_k$$
Taking the expectation of the outer product:
$$P_{k|k-1} = \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] = \mathbb{E}[(F_k \tilde{x}_{k-1|k-1} + w_k)(F_k \tilde{x}_{k-1|k-1} + w_k)^T]$$
Expanding and noting that cross-terms vanish because $w_k$ is uncorrelated with the prior error $\tilde{x}_{k-1|k-1}$:
$$P_{k|k-1} = F_k \mathbb{E}[\tilde{x}_{k-1|k-1} \tilde{x}_{k-1|k-1}^T] F_k^T + \mathbb{E}[w_k w_k^T] = F_k P_{k-1|k-1} F_k^T + Q_k$$
Because $P_{k-1|k-1} \in \mathbb{S}_+^n$ and $Q_k \in \mathbb{S}_+^n$, the predicted covariance $P_{k|k-1}$ is guaranteed to be symmetric positive semi-definite in exact arithmetic.

### Step 3: Innovation and Residual Covariance
$$y_k = z_k - H_k \hat{x}_{k|k-1}$$
$$S_k = H_k P_{k|k-1} H_k^T + R_k$$
The vector $y_k \in \mathbb{R}^m$ is the **innovation** (or measurement residual). It represents the brand-new, unpredictable information delivered by the sensor at time step $k$.
The measurement error is:
$$\tilde{z}_k = z_k - \hat{z}_{k|k-1} = (H_k x_k + v_k) - H_k \hat{x}_{k|k-1} = H_k \tilde{x}_{k|k-1} + v_k$$
The covariance of the innovation is:
$$S_k = \mathbb{E}[y_k y_k^T] = \mathbb{E}[(H_k \tilde{x}_{k|k-1} + v_k)(H_k \tilde{x}_{k|k-1} + v_k)^T] = H_k P_{k|k-1} H_k^T + R_k$$
Because $R_k \in \mathbb{S}_{++}^m$ (strictly positive definite) and $H_k P_{k|k-1} H_k^T \in \mathbb{S}_+^m$, the innovation covariance $S_k \in \mathbb{S}_{++}^m$ is strictly positive definite and therefore always invertible.

### Step 4: Optimal Kalman Gain
$$K_k = P_{k|k-1} H_k^T S_k^{-1} = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + R_k)^{-1}$$
$K_k \in \mathbb{R}^{n \times m}$ is the weighting matrix that maps the $m$-dimensional innovation into the $n$-dimensional state correction. It solves the unconstrained optimization problem of minimizing the posterior mean squared error $\operatorname{tr}(P_{k|k})$.

### Step 5: State Update (Measurement Update)
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k = \hat{x}_{k|k-1} + K_k (z_k - H_k \hat{x}_{k|k-1})$$
The posterior state estimate is an affine combination of the prior prediction and the innovation residual.

---

## 5.4 The Covariance Update: Textbook Formula vs Joseph Stabilized Form

In standard introductory textbooks, the posterior covariance is written as:
$$P_{k|k} = (I - K_k H_k) P_{k|k-1}$$

### 5.4.1 Derivation of the General Covariance Update for Any Linear Gain $K$
Let $K$ be *any* arbitrary linear gain matrix (optimal or sub-optimal). The posterior state error is:
$$\tilde{x}_{k|k} = x_k - \hat{x}_{k|k} = x_k - (\hat{x}_{k|k-1} + K (z_k - H_k \hat{x}_{k|k-1}))$$
Substituting $z_k = H_k x_k + v_k$:
$$\tilde{x}_{k|k} = x_k - \hat{x}_{k|k-1} - K (H_k x_k + v_k - H_k \hat{x}_{k|k-1}) = \tilde{x}_{k|k-1} - K H_k \tilde{x}_{k|k-1} - K v_k$$
$$\tilde{x}_{k|k} = (I - K H_k) \tilde{x}_{k|k-1} - K v_k$$

Now take the expectation of the outer product $\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k}^T]$:
$$P_{k|k} = \mathbb{E}\left[ \left( (I - K H_k) \tilde{x}_{k|k-1} - K v_k \right) \left( (I - K H_k) \tilde{x}_{k|k-1} - K v_k \right)^T \right]$$

Since measurement noise $v_k$ is uncorrelated with the prior error $\tilde{x}_{k|k-1}$ ($\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$):
$$P_{k|k} = (I - K H_k) \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] (I - K H_k)^T + K \mathbb{E}[v_k v_k^T] K^T$$
$$P_{k|k} = (I - K H_k) P_{k|k-1} (I - K H_k)^T + K R_k K^T$$

This is the **Joseph Stabilized Covariance Update Equation** (named after Peter D. Joseph).

### 5.4.2 Why the Textbook Formula Fails in Production
If we expand the Joseph form:
$$P_{k|k} = (I - K H_k) P_{k|k-1} (I - K H_k)^T + K R_k K^T$$
$$= P_{k|k-1} - K H_k P_{k|k-1} - P_{k|k-1} H_k^T K^T + K H_k P_{k|k-1} H_k^T K^T + K R_k K^T$$
$$= P_{k|k-1} - K H_k P_{k|k-1} - P_{k|k-1} H_k^T K^T + K (H_k P_{k|k-1} H_k^T + R_k) K^T$$

Now, **if and only if** $K$ is the mathematically exact optimal Kalman gain $K = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + R_k)^{-1}$:
$$K (H_k P_{k|k-1} H_k^T + R_k) K^T = \left( P_{k|k-1} H_k^T S_k^{-1} \right) S_k K^T = P_{k|k-1} H_k^T K^T$$

Substituting this back cancels the third term:
$$P_{k|k} = P_{k|k-1} - K H_k P_{k|k-1} - P_{k|k-1} H_k^T K^T + P_{k|k-1} H_k^T K^T = (I - K H_k) P_{k|k-1}$$

This simplifies to the textbook formula. However, in IEEE 754 floating-point computation:
1. **Loss of Symmetry:** $(I - K H_k) P_{k|k-1}$ is the product of two non-commuting symmetric matrices. Roundoff errors immediately destroy the symmetry of $P_{k|k}$.
2. **Loss of Positive Definiteness:** In high-confidence sensor updates ($R \ll P$), $(I - K H_k) \approx 0$. Subtracting two nearly equal large numbers causes catastrophic cancellation, producing eigenvalues of $P$ that are negative ($\lambda < 0$). A negative variance is a physical impossibility that causes Cholesky decomposition to crash and the filter to diverge.
3. **The Joseph Form Guarantee:** Notice that the Joseph equation has the structural form:
   $$P_{k|k} = M P_{k|k-1} M^T + K R_k K^T$$
   For any vector $z \neq 0$:
   $$z^T P_{k|k} z = z^T M P_{k|k-1} M^T z + z^T K R_k K^T z = (M^T z)^T P_{k|k-1} (M^T z) + (K^T z)^T R_k (K^T z)$$
   Since $P_{k|k-1} \ge 0$ and $R_k > 0$, both terms are non-negative for any $z$. Thus, **the Joseph form guarantees that $P_{k|k}$ is symmetric positive semi-definite for any gain $K$ and in the presence of arbitrary floating-point roundoff.**

---

## 5.5 Sequential Scalar Measurement Updates

When the measurement noise covariance $R_k$ is diagonal:
$$R_k = \operatorname{diag}(r_1, r_2, \dots, r_m)$$
the sensor observations are mutually uncorrelated. In this case, an $m$-dimensional vector measurement update can be broken down into $m$ consecutive scalar measurement updates ($m=1$).

### Advantages of Sequential Scalar Updates:
1. **No Matrix Inversion:** Each scalar update requires inverting a single scalar $s_i = H_i P H_i^T + r_i$, completely eliminating the $m \times m$ matrix inversion $S_k^{-1}$.
2. **Computational Speed:** Reduces the computational complexity from $\mathcal{O}(m^3 + m^2 n + m n^2)$ to $\mathcal{O}(m n^2)$.
3. **Selective Rejection:** Outlier sensors can be individually detected and rejected via scalar Chi-square gating without discarding valid measurements from other sensors arriving at the same timestamp.

---

## 5.6 Mathematical Problem Set

### Problem 5.1 (Worked Example): Complete 2D Constant Velocity Filter Step
**Problem Statement:** A 1D robot is tracking its position and velocity with state $x = [p, v]^T$. At time step $k-1$, the posterior estimate and covariance are:
$$\hat{x}_{k-1|k-1} = \begin{bmatrix} 10.0 \\ 2.0 \end{bmatrix}, \quad P_{k-1|k-1} = \begin{bmatrix} 1.0 & 0.2 \\ 0.2 & 0.5 \end{bmatrix}$$
The dynamics follow a Constant Velocity model with $\Delta t = 1.0\text{ s}$ and process noise covariance:
$$F = \begin{bmatrix} 1.0 & 1.0 \\ 0.0 & 1.0 \end{bmatrix}, \quad Q = \begin{bmatrix} 0.1 & 0.05 \\ 0.05 & 0.2 \end{bmatrix}$$
At step $k$, a direct position measurement arrives: $z_k = 12.8\text{ m}$ with measurement sensitivity $H = [1.0, 0.0]$ and noise variance $R = 0.5\text{ m}^2$. Compute:
1. The prior predicted state $\hat{x}_{k|k-1}$ and prior covariance $P_{k|k-1}$.
2. The innovation $y_k$, innovation variance $S_k$, and Kalman gain vector $K_k$.
3. The posterior state estimate $\hat{x}_{k|k}$ and posterior covariance $P_{k|k}$ using both the textbook formula and Joseph form.

**Given Data:**
- State dimension $n = 2$, measurement dimension $m = 1$.
- Prior: $\hat{x}_{k-1|k-1} = [10.0, 2.0]^T$, $P_{k-1|k-1} = \begin{bmatrix} 1.0 & 0.2 \\ 0.2 & 0.5 \end{bmatrix}$.
- Transition: $F = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, $Q = \begin{bmatrix} 0.1 & 0.05 \\ 0.05 & 0.2 \end{bmatrix}$.
- Observation: $z_k = 12.8$, $H = [1, 0]$, $R = 0.5$.

**Step-by-Step Derivation:**
1. State prediction:
   $$\hat{x}_{k|k-1} = F \hat{x}_{k-1|k-1} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 10.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 12.0 \\ 2.0 \end{bmatrix}$$
2. Covariance prediction:
   $$F P_{k-1|k-1} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1.0 & 0.2 \\ 0.2 & 0.5 \end{bmatrix} = \begin{bmatrix} 1.2 & 0.7 \\ 0.2 & 0.5 \end{bmatrix}$$
   $$F P_{k-1|k-1} F^T = \begin{bmatrix} 1.2 & 0.7 \\ 0.2 & 0.5 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1.9 & 0.7 \\ 0.7 & 0.5 \end{bmatrix}$$
   Adding process noise $Q$:
   $$P_{k|k-1} = \begin{bmatrix} 1.9 & 0.7 \\ 0.7 & 0.5 \end{bmatrix} + \begin{bmatrix} 0.1 & 0.05 \\ 0.05 & 0.2 \end{bmatrix} = \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix}$$
3. Innovation and residual covariance:
   $$\hat{z}_{k|k-1} = H \hat{x}_{k|k-1} = [1, 0] \begin{bmatrix} 12.0 \\ 2.0 \end{bmatrix} = 12.0\text{ m}$$
   $$y_k = z_k - \hat{z}_{k|k-1} = 12.8 - 12.0 = 0.8\text{ m}$$
   $$S_k = H P_{k|k-1} H^T + R = P_{11} + R = 2.0 + 0.5 = 2.5\text{ m}^2$$
4. Kalman gain:
   $$P_{k|k-1} H^T = \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 2.0 \\ 0.75 \end{bmatrix}$$
   $$K_k = \frac{1}{S_k} P_{k|k-1} H^T = \frac{1}{2.5} \begin{bmatrix} 2.0 \\ 0.75 \end{bmatrix} = \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix}$$
5. State update:
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k = \begin{bmatrix} 12.0 \\ 2.0 \end{bmatrix} + \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix} (0.8) = \begin{bmatrix} 12.0 + 0.64 \\ 2.0 + 0.24 \end{bmatrix} = \begin{bmatrix} 12.64 \\ 2.24 \end{bmatrix}$$
   *Crucial Observation:* Measuring position $z_k = 12.8\text{ m}$ (higher than predicted $12.0\text{ m}$) not only increased estimated position to $12.64\text{ m}$, but also increased estimated velocity from $2.0\text{ m/s}$ to $2.24\text{ m/s}$, through the dynamic cross-correlation $P_{12} = 0.75$!
6. Covariance update (textbook formula):
   $$K_k H = \begin{bmatrix} 0.8 \\ 0.3 \end{bmatrix} \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 0.8 & 0.0 \\ 0.3 & 0.0 \end{bmatrix}$$
   $$I - K_k H = \begin{bmatrix} 0.2 & 0.0 \\ -0.3 & 1.0 \end{bmatrix}$$
   $$P_{k|k} = (I - K_k H) P_{k|k-1} = \begin{bmatrix} 0.2 & 0.0 \\ -0.3 & 1.0 \end{bmatrix} \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix} = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix}$$
7. Verification via Joseph form:
   $$M = I - K H = \begin{bmatrix} 0.2 & 0.0 \\ -0.3 & 1.0 \end{bmatrix}$$
   $$M P_{k|k-1} M^T = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix} \begin{bmatrix} 0.2 & -0.3 \\ 0.0 & 1.0 \end{bmatrix} = \begin{bmatrix} 0.08 & 0.03 \\ 0.03 & 0.43 \end{bmatrix}$$
   $$K R K^T = 0.5 \begin{bmatrix} 0.8 \\ 0.3 \end{bmatrix} \begin{bmatrix} 0.8 & 0.3 \end{bmatrix} = 0.5 \begin{bmatrix} 0.64 & 0.24 \\ 0.24 & 0.09 \end{bmatrix} = \begin{bmatrix} 0.32 & 0.12 \\ 0.12 & 0.045 \end{bmatrix}$$
   Summing:
   $$P_{\text{Joseph}} = \begin{bmatrix} 0.08 + 0.32 & 0.03 + 0.12 \\ 0.03 + 0.12 & 0.43 + 0.045 \end{bmatrix} = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix}$$

**Final Result:**
$$\hat{x}_{k|k} = \begin{bmatrix} 12.64 \\ 2.24 \end{bmatrix}, \quad P_{k|k} = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix}$$

---

### Problem 5.2 (Worked Example): Numerical Demonstration of Joseph Form Resilience
**Problem Statement:** Suppose due to severe single-precision truncation or an imperfect gain computation, the gain applied is perturbed: $K_{\text{sub}} = \begin{bmatrix} 0.95 \\ 0.35 \end{bmatrix}$.
Evaluate the resulting $P$ using:
1. The textbook formula $P_{\text{textbook}} = (I - K_{\text{sub}} H) P_{k|k-1}$.
2. The Joseph form $P_{\text{Joseph}} = (I - K_{\text{sub}} H) P_{k|k-1} (I - K_{\text{sub}} H)^T + K_{\text{sub}} R K_{\text{sub}}^T$.
Demonstrate that $P_{\text{textbook}}$ is non-symmetric while $P_{\text{Joseph}}$ is strictly symmetric and positive-definite.

**Step-by-Step Derivation:**
1. Given prior $P_{k|k-1} = \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix}$, $H = [1, 0]$, $R = 0.5$.
2. Textbook formula:
   $$I - K_{\text{sub}} H = \begin{bmatrix} 1 - 0.95 & 0 \\ -0.35 & 1 \end{bmatrix} = \begin{bmatrix} 0.05 & 0 \\ -0.35 & 1 \end{bmatrix}$$
   $$P_{\text{textbook}} = \begin{bmatrix} 0.05 & 0 \\ -0.35 & 1 \end{bmatrix} \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix} = \begin{bmatrix} 0.10 & 0.0375 \\ -0.70 + 0.75 & -0.2625 + 0.70 \end{bmatrix} = \begin{bmatrix} 0.10 & 0.0375 \\ 0.05 & 0.4375 \end{bmatrix}$$
   *Notice:* $P_{12} = 0.0375 \neq P_{21} = 0.0500$. The textbook formula has completely lost symmetry!
3. Joseph form calculation:
   $$M = \begin{bmatrix} 0.05 & 0 \\ -0.35 & 1 \end{bmatrix}$$
   $$M P_{k|k-1} = \begin{bmatrix} 0.10 & 0.0375 \\ 0.05 & 0.4375 \end{bmatrix}$$
   $$M P_{k|k-1} M^T = \begin{bmatrix} 0.10 & 0.0375 \\ 0.05 & 0.4375 \end{bmatrix} \begin{bmatrix} 0.05 & -0.35 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 0.005 & 0.0025 \\ 0.0025 & 0.420 \end{bmatrix}$$
   $$K_{\text{sub}} R K_{\text{sub}}^T = 0.5 \begin{bmatrix} 0.95 \\ 0.35 \end{bmatrix} \begin{bmatrix} 0.95 & 0.35 \end{bmatrix} = 0.5 \begin{bmatrix} 0.9025 & 0.3325 \\ 0.3325 & 0.1225 \end{bmatrix} = \begin{bmatrix} 0.45125 & 0.16625 \\ 0.16625 & 0.06125 \end{bmatrix}$$
   Summing:
   $$P_{\text{Joseph}} = \begin{bmatrix} 0.005 + 0.45125 & 0.0025 + 0.16625 \\ 0.0025 + 0.16625 & 0.420 + 0.06125 \end{bmatrix} = \begin{bmatrix} 0.45625 & 0.16875 \\ 0.16875 & 0.48125 \end{bmatrix}$$
4. Positive definiteness check of $P_{\text{Joseph}}$:
   $$\det(P_{\text{Joseph}}) = (0.45625)(0.48125) - (0.16875)^2 = 0.21957 - 0.02848 = 0.19109 > 0$$
   $P_{11} = 0.45625 > 0$. Both eigenvalues are strictly positive.

**Final Result:**
$$P_{\text{textbook}} = \begin{bmatrix} 0.100 & 0.0375 \\ 0.050 & 0.4375 \end{bmatrix}\text{ (Asymmetric!)}, \quad P_{\text{Joseph}} = \begin{bmatrix} 0.45625 & 0.16875 \\ 0.16875 & 0.48125 \end{bmatrix}\text{ (Symmetric, Positive-Definite)}$$

---

### Problem 5.3 (Worked Example): Vector Measurement Inversion via Cholesky
**Problem Statement:** A 4D robot receives simultaneous position measurements from two independent GPS receivers:
$$z_k = \begin{bmatrix} z_1 \\ z_2 \end{bmatrix}, \quad H = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 1 & 0 & 0 & 0 \end{bmatrix}$$
The predicted position variance is $P_{11} = 4.0\text{ m}^2$, with noise covariances $R = \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 3.0 \end{bmatrix}$.
1. Compute the innovation covariance $S \in \mathbb{R}^{2 \times 2}$.
2. Compute the Cholesky factor $L$ such that $S = L L^T$.
3. Invert $S$ using forward and back-substitution on $L$.

**Step-by-Step Derivation:**
1. Computing $H P H^T$:
   $$H P = \begin{bmatrix} P_{11} & P_{12} & P_{13} & P_{14} \\ P_{11} & P_{12} & P_{13} & P_{14} \end{bmatrix}$$
   $$H P H^T = \begin{bmatrix} P_{11} & P_{11} \\ P_{11} & P_{11} \end{bmatrix} = \begin{bmatrix} 4.0 & 4.0 \\ 4.0 & 4.0 \end{bmatrix}$$
   $$S = H P H^T + R = \begin{bmatrix} 4.0 & 4.0 \\ 4.0 & 4.0 \end{bmatrix} + \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 3.0 \end{bmatrix} = \begin{bmatrix} 6.0 & 4.5 \\ 4.5 & 7.0 \end{bmatrix}$$
2. Cholesky decomposition $S = L L^T = \begin{bmatrix} L_{11} & 0 \\ L_{21} & L_{22} \end{bmatrix} \begin{bmatrix} L_{11} & L_{21} \\ 0 & L_{22} \end{bmatrix}$:
   $$L_{11} = \sqrt{S_{11}} = \sqrt{6.0} \approx 2.449490$$
   $$L_{21} = \frac{S_{21}}{L_{11}} = \frac{4.5}{\sqrt{6.0}} \approx 1.837117$$
   $$L_{22} = \sqrt{S_{22} - L_{21}^2} = \sqrt{7.0 - \frac{20.25}{6.0}} = \sqrt{7.0 - 3.375} = \sqrt{3.625} \approx 1.903943$$
   $$L = \begin{bmatrix} 2.449490 & 0 \\ 1.837117 & 1.903943 \end{bmatrix}$$
3. Matrix inversion via Cholesky:
   $$\det(S) = (6.0)(7.0) - (4.5)^2 = 42.0 - 20.25 = 21.75$$
   $$S^{-1} = \frac{1}{21.75} \begin{bmatrix} 7.0 & -4.5 \\ -4.5 & 6.0 \end{bmatrix} \approx \begin{bmatrix} 0.321839 & -0.206897 \\ -0.206897 & 0.275862 \end{bmatrix}$$
   Check product: $S S^{-1} = I_2$.

**Final Result:**
$$L = \begin{bmatrix} 2.4495 & 0 \\ 1.8371 & 1.9039 \end{bmatrix}, \quad S^{-1} = \begin{bmatrix} 0.3218 & -0.2069 \\ -0.2069 & 0.2759 \end{bmatrix}$$

---

### Problem 5.4 (Worked Example): Equivalence of Vector Update and Sequential Scalar Updates
**Problem Statement:** Consider a prior state $x = [p, v]^T$ with $P = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$. Two uncorrelated measurements arrive at step $k$: position $z_1 = 3.0$ with $H_1 = [1, 0], R_1 = 2$, and velocity $z_2 = 1.0$ with $H_2 = [0, 1], R_2 = 2$.
Show that processing $z = [z_1, z_2]^T$ simultaneously in a single vector update produces the exact same posterior covariance $P_{k|k}$ as processing $z_1$ first and then $z_2$ sequentially.

**Step-by-Step Derivation:**
1. Simultaneous Vector Update:
   $$H = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I_2, \quad R = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = 2 I_2$$
   $$S = H P H^T + R = 2 I_2 + 2 I_2 = 4 I_2 \implies S^{-1} = 0.25 I_2$$
   $$K = P H^T S^{-1} = (2 I_2) (0.25 I_2) = 0.5 I_2$$
   $$P_{\text{post}} = (I - K H) P = (I_2 - 0.5 I_2) (2 I_2) = 0.5 \times 2 I_2 = 1.0 I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$
2. Sequential Scalar Update:
   - Step 2a: Update with $z_1$ ($H_1 = [1, 0], R_1 = 2$):
     $$s_1 = H_1 P H_1^T + R_1 = P_{11} + R_1 = 2 + 2 = 4$$
     $$K_1 = \frac{1}{s_1} P H_1^T = \frac{1}{4} \begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 0 \end{bmatrix}$$
     $$P^{(1)} = (I - K_1 H_1) P = \left(\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0.5 & 0 \\ 0 & 0 \end{bmatrix}\right) \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 0.5 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$
   - Step 2b: Update with $z_2$ using intermediate $P^{(1)}$ ($H_2 = [0, 1], R_2 = 2$):
     $$s_2 = H_2 P^{(1)} H_2^T + R_2 = P^{(1)}_{22} + R_2 = 2 + 2 = 4$$
     $$K_2 = \frac{1}{s_2} P^{(1)} H_2^T = \frac{1}{4} \begin{bmatrix} 0 \\ 2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0.5 \end{bmatrix}$$
     $$P^{(2)} = (I - K_2 H_2) P^{(1)} = \left(\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0 & 0 \\ 0 & 0.5 \end{bmatrix}\right) \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0.5 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$

**Final Result:**
$$P_{\text{vector}} = P_{\text{sequential}} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$
Sequential updating is algebraically identical to vector updating for uncorrelated sensor noise.

---

### Problem 5.5 (Worked Example): Monotonic Covariance Contraction Proof
**Problem Statement:** Prove that for any valid measurement sensitivity matrix $H$ and measurement noise covariance $R > 0$, the posterior covariance is strictly less than or equal to the prior covariance in the Loewner partial order:
$$P_{k|k} \le P_{k|k-1}$$
(i.e. $P_{k|k-1} - P_{k|k}$ is positive semi-definite).

**Step-by-Step Derivation:**
1. From the optimal covariance update formula:
   $$P_{k|k} = (I - K_k H_k) P_{k|k-1} = P_{k|k-1} - K_k H_k P_{k|k-1}$$
2. Difference between prior and posterior:
   $$\Delta P = P_{k|k-1} - P_{k|k} = K_k H_k P_{k|k-1}$$
3. Recall that $K_k = P_{k|k-1} H_k^T S_k^{-1}$. Therefore:
   $$\Delta P = \left( P_{k|k-1} H_k^T S_k^{-1} \right) H_k P_{k|k-1} = P_{k|k-1} H_k^T S_k^{-1} H_k P_{k|k-1}$$
4. Let $B = H_k P_{k|k-1} \in \mathbb{R}^{m \times n}$. Then:
   $$\Delta P = B^T S_k^{-1} B$$
5. Since $S_k = H_k P_{k|k-1} H_k^T + R_k$, and $R_k \in \mathbb{S}_{++}^m$, $S_k$ is strictly positive definite. Hence $S_k^{-1} \in \mathbb{S}_{++}^m$.
6. For any arbitrary non-zero vector $z \in \mathbb{R}^n$:
   $$z^T \Delta P z = z^T B^T S_k^{-1} B z = (B z)^T S_k^{-1} (B z)$$
   Let $w = B z \in \mathbb{R}^m$. Since $S_k^{-1}$ is positive definite:
   $$w^T S_k^{-1} w \ge 0$$
   with equality if and only if $w = B z = 0$.
7. Thus, $\Delta P = P_{k|k-1} - P_{k|k} \ge 0$, which proves that $P_{k|k} \le P_{k|k-1}$ in the Loewner order. $\blacksquare$

---

### Problem 5.6 (Worked Example): Asymptotic Analysis: Perfect Measurement ($R \to 0$)
**Problem Statement:** Let a scalar state have prior variance $P^- = 5.0$. Evaluate the Kalman gain $K$ and posterior variance $P^+$ as measurement noise $R \to 0$ for $H = 1$. What happens if $H = [1, 1]$ for a 2D state $x = [x_1, x_2]^T$ with $P^- = I_2$?

**Step-by-Step Derivation:**
1. 1D Scalar Case:
   $$S = H P^- H^T + R = 5.0 + R$$
   $$K = \frac{P^- H^T}{S} = \frac{5.0}{5.0 + R} \to 1.0\text{ as }R \to 0$$
   $$P^+ = (1 - K) P^- = \left(1 - \frac{5.0}{5.0 + R}\right) 5.0 = \frac{5.0 R}{5.0 + R} \to 0\text{ as }R \to 0$$
2. 2D State Case with rank-1 measurement:
   $$H = [1, 1], \quad P^- = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$
   $$S = H P^- H^T + R = [1, 1] \begin{bmatrix} 1 \\ 1 \end{bmatrix} + R = 2.0 + R$$
   As $R \to 0$, $S \to 2.0$.
   $$K = P^- H^T S^{-1} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} \frac{1}{2} = \begin{bmatrix} 0.5 \\ 0.5 \end{bmatrix}$$
   $$P^+ = (I - K H) P^- = \left( \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0.5 & 0.5 \\ 0.5 & 0.5 \end{bmatrix} \right) I_2 = \begin{bmatrix} 0.5 & -0.5 \\ -0.5 & 0.5 \end{bmatrix}$$
3. Eigenvalues of $P^+$:
   $$\det(\lambda I - P^+) = \lambda(\lambda - 1) = 0 \implies \lambda_1 = 0, \lambda_2 = 1.0$$
   The variance in the direction of the measurement $(x_1 + x_2)$ collapses to exactly zero ($\lambda_1 = 0$). However, the orthogonal subspace $(x_1 - x_2)$ was unobserved by $H$, so its variance remains completely unchanged at $1.0$!

**Final Result:**
$$\text{Scalar: }P^+ \to 0; \quad \text{2D: }P^+ = \begin{bmatrix} 0.5 & -0.5 \\ -0.5 & 0.5 \end{bmatrix}\text{ with eigenvalues }\{0, 1\}$$

---

### Problem 5.7 (Worked Example): Cross-Covariance Conditioning in Multi-State Systems
**Problem Statement:** A 2D state $x = [p, v]^T$ has prior covariance $P = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$. A sensor measures position only ($H = [1, 0]$) with noise $R = 2$.
1. Compute the posterior covariance $P_{k|k}$.
2. Determine by what percentage the unmeasured velocity variance $P_{22}$ was reduced purely through cross-covariance conditioning.

**Step-by-Step Derivation:**
1. Prior covariance elements: $P_{11} = 4, P_{12} = 2, P_{22} = 3$.
2. Innovation variance:
   $$S = H P H^T + R = P_{11} + R = 4 + 2 = 6$$
3. Kalman gain:
   $$K = \frac{1}{S} \begin{bmatrix} P_{11} \\ P_{12} \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 4 \\ 2 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix}$$
4. Covariance update:
   $$P_{k|k} = P - K S K^T = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix} - 6 \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix} \begin{bmatrix} 2/3 & 1/3 \end{bmatrix}$$
   $$K S K^T = 6 \begin{bmatrix} 4/9 & 2/9 \\ 2/9 & 1/9 \end{bmatrix} = \begin{bmatrix} 8/3 & 4/3 \\ 4/3 & 2/3 \end{bmatrix} \approx \begin{bmatrix} 2.667 & 1.333 \\ 1.333 & 0.667 \end{bmatrix}$$
   $$P_{k|k} = \begin{bmatrix} 4 - 8/3 & 2 - 4/3 \\ 2 - 4/3 & 3 - 2/3 \end{bmatrix} = \begin{bmatrix} 4/3 & 2/3 \\ 2/3 & 7/3 \end{bmatrix} \approx \begin{bmatrix} 1.333 & 0.667 \\ 0.667 & 2.333 \end{bmatrix}$$
5. Reduction in velocity variance $P_{22}$:
   $$P_{22}^- = 3.0, \quad P_{22}^+ = \frac{7}{3} \approx 2.3333$$
   $$\Delta P_{22} = 3.0 - 2.3333 = 0.6667$$
   $$\% \text{ Reduction} = \frac{0.6667}{3.0} \times 100\% = 22.22\%$$

**Final Result:**
$$P_{k|k} = \begin{bmatrix} 1.333 & 0.667 \\ 0.667 & 2.333 \end{bmatrix}, \quad \text{Velocity variance reduced by }22.22\%$$

---

### Problem 5.8 (Worked Example): Computational Flop Count Comparison
**Problem Statement:** For state dimension $n$ and measurement dimension $m$, calculate the exact floating-point operation (flop) counts for:
1. The textbook covariance update: $P^+ = (I - K H) P^-$.
2. The Joseph form covariance update: $P^+ = (I - K H) P^- (I - K H)^T + K R K^T$.
Evaluate the ratio of flop counts for $n = 15, m = 6$.

**Step-by-Step Derivation:**
1. Textbook formula operations:
   - Compute $A = K H$: $K \in \mathbb{R}^{n \times m}, H \in \mathbb{R}^{m \times n} \implies 2 n^2 m$ flops.
   - Subtract $M = I - A$: $n$ flops.
   - Multiply $M P^-$: $M \in \mathbb{R}^{n \times n}, P^- \in \mathbb{R}^{n \times n} \implies 2 n^3$ flops.
   - Total: $\text{Flops}_{\text{textbook}} \approx 2 n^3 + 2 n^2 m$.
2. Joseph form operations:
   - Compute $M = I - K H$: $2 n^2 m + n$ flops.
   - Compute $T_1 = M P^-$: $2 n^3$ flops.
   - Compute $T_2 = T_1 M^T$: taking advantage of symmetry, $n^3$ flops.
   - Compute $T_3 = K R$: $K \in \mathbb{R}^{n \times m}, R \in \mathbb{R}^{m \times m} \implies 2 n m^2$ flops.
   - Compute $T_4 = T_3 K^T$: taking advantage of symmetry, $n^2 m$ flops.
   - Add $T_2 + T_4$: $n^2 / 2$ flops.
   - Total: $\text{Flops}_{\text{Joseph}} \approx 3 n^3 + 3 n^2 m + 2 n m^2$.
3. Evaluation for $n = 15, m = 6$:
   - $n^3 = 3375, n^2 = 225, m^2 = 36$.
   - $\text{Flops}_{\text{textbook}} = 2(3375) + 2(225)(6) = 6750 + 2700 = 9,450\text{ flops}$.
   - $\text{Flops}_{\text{Joseph}} = 3(3375) + 3(225)(6) + 2(15)(36) = 10125 + 4050 + 1080 = 15,255\text{ flops}$.
   - Ratio:
     $$\frac{\text{Flops}_{\text{Joseph}}}{\text{Flops}_{\text{textbook}}} = \frac{15,255}{9,450} \approx 1.614$$

**Final Result:**
$$\text{Flops}_{\text{textbook}} = 9,450, \quad \text{Flops}_{\text{Joseph}} = 15,255 \quad (\text{Overhead factor } \approx 1.61\times)$$
*Conclusion:* The Joseph form costs roughly $60\%$ more operations, which is completely negligible (less than $5\mu\text{s}$) compared to the catastrophe of filter divergence.

---

### Problem 5.9 (Worked Example): Singular Innovation Covariance Detection
**Problem Statement:** A software bug in a multi-camera pipeline passes two identical cameras with identical noise models as two distinct sensors, creating $z = [z_1, z_2]^T$ with $H = \begin{bmatrix} 1 & 0 \\ 1 & 0 \end{bmatrix}$ and $R = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$ (perfectly correlated noise). Show that $S$ is singular. How should a robust engine handle this?

**Step-by-Step Derivation:**
1. Given $P^- = \begin{bmatrix} p_{11} & p_{12} \\ p_{12} & p_{22} \end{bmatrix}$.
2. Innovation covariance:
   $$H P^- H^T = \begin{bmatrix} p_{11} & p_{11} \\ p_{11} & p_{11} \end{bmatrix}$$
   $$S = H P^- H^T + R = \begin{bmatrix} p_{11} + 1 & p_{11} + 1 \\ p_{11} + 1 & p_{11} + 1 \end{bmatrix}$$
3. Determinant of $S$:
   $$\det(S) = (p_{11} + 1)^2 - (p_{11} + 1)^2 = 0$$
   The rank of $S$ is strictly $1$.
4. Robust Handling:
   - When attempting Cholesky decomposition $S = L L^T$, $L_{22} = \sqrt{S_{22} - L_{21}^2} = 0$.
   - A robust engine detects $L_{ii} \le \epsilon$ ($10^{-12}$) and throws an explicit `SingularInnovationException` or applies pseudoinverse via SVD/regularization: $S_{\text{reg}} = S + \epsilon I_m$.
   - Best practice: prune redundant duplicate measurements before passing to the Kalman filter.

**Final Result:**
$$\det(S) = 0\text{ (Singular matrix, non-invertible)}$$

---

### Problem 5.10 (Worked Example): Full Multivariable Cycle Python/TypeScript Prototype
**Problem Statement:** Write a complete algorithmic specification for a single step of the multivariable linear Kalman filter, explicitly enforcing the Joseph stabilized covariance update.

**Step-by-Step Derivation:**
1. Input variables: $\hat{x} \in \mathbb{R}^n, P \in \mathbb{R}^{n \times n}, F \in \mathbb{R}^{n \times n}, B \in \mathbb{R}^{n \times p}, u \in \mathbb{R}^p, Q \in \mathbb{R}^{n \times n}, z \in \mathbb{R}^m, H \in \mathbb{R}^{m \times n}, R \in \mathbb{R}^{m \times m}$.
2. Predict Phase:
   $$\hat{x} \leftarrow F \hat{x} + B u$$
   $$P \leftarrow F P F^T + Q$$
   $$P \leftarrow \frac{1}{2}(P + P^T)$$
3. Innovation Phase:
   $$y \leftarrow z - H \hat{x}$$
   $$S \leftarrow H P H^T + R$$
   $$S \leftarrow \frac{1}{2}(S + S^T)$$
4. Gain Phase:
   $$L \leftarrow \operatorname{Cholesky}(S) \quad (S = L L^T)$$
   $$K \leftarrow P H^T (L L^T)^{-1}$$
5. Update Phase:
   $$\hat{x} \leftarrow \hat{x} + K y$$
   $$M \leftarrow I_n - K H$$
   $$P \leftarrow M P M^T + K R K^T$$
   $$P \leftarrow \frac{1}{2}(P + P^T)$$
6. Output: Updated $(\hat{x}, P, y, S, K)$.

**Final Result:**
Complete algorithm specified with symmetric guarantees at every stage.

---

### Problem 5.11 (Solved Exercise): Trace Minimization Property of Posterior Covariance
**Problem Statement:** For scalar state $x$ with prior $p = 4$, $h = 1$, and $r = 1$, plot or tabulate the posterior variance $p(K) = (1 - K)^2 p + K^2 r$ as a function of $K \in [0, 1]$ in steps of $0.2$, and verify that the minimum occurs at $K = \frac{p}{p + r} = 0.8$.

**Step-by-Step Solution:**
1. Expression: $p(K) = 4 (1 - K)^2 + 1 \cdot K^2 = 4(1 - 2K + K^2) + K^2 = 5 K^2 - 8 K + 4$.
2. Evaluating values:
   - $K = 0.0$: $p(0.0) = 4.000$
   - $K = 0.2$: $p(0.2) = 5(0.04) - 8(0.2) + 4 = 0.2 - 1.6 + 4 = 2.600$
   - $K = 0.4$: $p(0.4) = 5(0.16) - 8(0.4) + 4 = 0.8 - 3.2 + 4 = 1.600$
   - $K = 0.6$: $p(0.6) = 5(0.36) - 8(0.6) + 4 = 1.8 - 4.8 + 4 = 1.000$
   - $K = 0.8$: $p(0.8) = 5(0.64) - 8(0.8) + 4 = 3.2 - 6.4 + 4 = 0.800$
   - $K = 1.0$: $p(1.0) = 5(1.00) - 8(1.0) + 4 = 5.0 - 8.0 + 4 = 1.000$
3. Verification:
   $$\frac{d p(K)}{dK} = 10 K - 8 = 0 \implies K^* = 0.80$$
   $$p(K^*) = 0.800$$
   Textbook formula: $(1 - 0.8) \times 4 = 0.2 \times 4 = 0.800$.

**Final Answer:**
$$\min_K p(K) = 0.800\text{ at }K^* = 0.80$$

---

### Problem 5.12 (Solved Exercise): Zero Gain Behavior
**Problem Statement:** If a sensor measurement is completely ignored by setting $K_k = 0$, show that the Joseph form evaluates to $P_{k|k} = P_{k|k-1}$ and $\hat{x}_{k|k} = \hat{x}_{k|k-1}$.

**Step-by-Step Solution:**
1. Set $K_k = 0_{n \times m}$.
2. State update:
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + 0 \cdot y_k = \hat{x}_{k|k-1}$$
3. Joseph form update:
   $$M = I - K_k H_k = I - 0 = I$$
   $$P_{k|k} = I P_{k|k-1} I^T + 0 R_k 0^T = P_{k|k-1}$$
4. Both state and covariance remain identically equal to the prior prediction. $\blacksquare$

---

### Problem 5.13 (Solved Exercise): Infinite Measurement Noise Limit
**Problem Statement:** Let measurement noise covariance $R_k = \rho I_m$. Prove that $\lim_{\rho \to \infty} K_k = 0_{n \times m}$ and $\lim_{\rho \to \infty} P_{k|k} = P_{k|k-1}$.

**Step-by-Step Solution:**
1. Kalman gain formula:
   $$K_k = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + \rho I_m)^{-1}$$
2. Pulling out $\rho$:
   $$(H_k P_{k|k-1} H_k^T + \rho I_m)^{-1} = \frac{1}{\rho} \left( \frac{1}{\rho} H_k P_{k|k-1} H_k^T + I_m \right)^{-1}$$
3. Taking the limit as $\rho \to \infty$:
   $$\lim_{\rho \to \infty} \frac{1}{\rho} (0 + I_m)^{-1} = \lim_{\rho \to \infty} \frac{1}{\rho} I_m = 0_{m \times m}$$
4. Therefore:
   $$\lim_{\rho \to \infty} K_k = P_{k|k-1} H_k^T (0) = 0_{n \times m}$$
5. Substituting into the Joseph update:
   $$\lim_{\rho \to \infty} P_{k|k} = (I - 0) P_{k|k-1} (I - 0)^T + \lim_{\rho \to \infty} (P H^T \rho^{-1}) (\rho I) (\rho^{-1} H P) = P_{k|k-1} + 0 = P_{k|k-1} \quad \blacksquare$$

---

### Problem 5.14 (Solved Exercise): Zero Process Noise Asymptotics
**Problem Statement:** In a static parameter estimation problem, $F = I_n$ and $Q = 0$. Show that if $H = I_n$ and $R = r I_n$, the covariance after $N$ identical measurements scales as $P_N = \frac{1}{N + r P_0^{-1}} I_n \approx \frac{r}{N} I_n$.

**Step-by-Step Solution:**
1. For static parameter estimation in information form:
   $$P_N^{-1} = P_0^{-1} + \sum_{k=1}^N H^T R^{-1} H$$
2. Since $H = I$ and $R^{-1} = \frac{1}{r} I$:
   $$P_N^{-1} = P_0^{-1} + N \frac{1}{r} I$$
3. If $P_0 = p_0 I$:
   $$P_N^{-1} = \left(\frac{1}{p_0} + \frac{N}{r}\right) I = \left(\frac{r + N p_0}{p_0 r}\right) I$$
4. Inverting:
   $$P_N = \frac{p_0 r}{N p_0 + r} I = \frac{r}{N + r / p_0} I$$
5. As $N \to \infty$, $P_N \to \frac{r}{N} I \propto \frac{1}{N}$.

**Final Answer:**
$$P_N = \frac{r}{N + r / p_0} I_n \approx \frac{r}{N} I_n\text{ as }N \to \infty$$

---

### Problem 5.15 (Solved Exercise): Information Matrix Update
**Problem Statement:** Define the information matrix $Y = P^{-1}$ and information state vector $\hat{y} = P^{-1} \hat{x}$. Show that the measurement update can be written as simple matrix additions:
$$Y_{k|k} = Y_{k|k-1} + H_k^T R_k^{-1} H_k$$
$$\hat{y}_{k|k} = \hat{y}_{k|k-1} + H_k^T R_k^{-1} z_k$$

**Step-by-Step Solution:**
1. By the Woodbury matrix identity:
   $$(A + U C V)^{-1} = A^{-1} - A^{-1} U (C^{-1} + V A^{-1} U)^{-1} V A^{-1}$$
2. In the Kalman filter, $P_{k|k} = (P_{k|k-1}^{-1} + H_k^T R_k^{-1} H_k)^{-1}$.
   Taking the direct inverse of both sides:
   $$Y_{k|k} = P_{k|k}^{-1} = P_{k|k-1}^{-1} + H_k^T R_k^{-1} H_k = Y_{k|k-1} + H_k^T R_k^{-1} H_k$$
3. For the information state vector $\hat{y}_{k|k} = P_{k|k}^{-1} \hat{x}_{k|k}$:
   $$\hat{x}_{k|k} = P_{k|k} (P_{k|k-1}^{-1} \hat{x}_{k|k-1} + H_k^T R_k^{-1} z_k)$$
   Multiplying both sides by $P_{k|k}^{-1}$:
   $$\hat{y}_{k|k} = \hat{y}_{k|k-1} + H_k^T R_k^{-1} z_k \quad \blacksquare$$

---

### Problem 5.16 (Solved Exercise): Underdetermined Observation Subspace
**Problem Statement:** A 3D state $x = [x_1, x_2, x_3]^T$ has prior $P^- = \operatorname{diag}(1, 4, 9)$. A single scalar sensor measures $z = x_1 + x_2$ with $R = 1$. Write $H$, compute $S$, $K$, and show which state components remain completely uninfluenced by the update.

**Step-by-Step Solution:**
1. Measurement sensitivity: $H = [1, 1, 0]$.
2. Innovation variance:
   $$S = H P^- H^T + R = [1, 1, 0] \begin{bmatrix} 1 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 9 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} + 1 = (1 + 4 + 0) + 1 = 6$$
3. Kalman gain:
   $$K = \frac{1}{S} P^- H^T = \frac{1}{6} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 9 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 1 \\ 4 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/6 \\ 2/3 \\ 0 \end{bmatrix}$$
4. State update:
   $$\hat{x}_3^+ = \hat{x}_3^- + K_3 y = \hat{x}_3^- + 0 \cdot y = \hat{x}_3^-$$
   The third state component $x_3$ has $K_3 = 0$, meaning its estimate and variance ($P_{33}^+ = 9$) are completely uninfluenced by the observation.

**Final Answer:**
$$K = \begin{bmatrix} 1/6 \\ 2/3 \\ 0 \end{bmatrix}, \quad x_3\text{ is completely unaffected}$$

---

### Problem 5.17 (Solved Exercise): Cross-Correlation Growth in Predict Step
**Problem Statement:** Start with an uncorrelated prior $P_{k-1|k-1} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ and $Q = 0$. For state transition $F = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, compute $P_{k|k-1}$ and the correlation coefficient $\rho_{12}$.

**Step-by-Step Solution:**
1. Covariance prediction:
   $$P_{k|k-1} = F P_{k-1|k-1} F^T = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$$
2. Correlation coefficient:
   $$\rho_{12} = \frac{P_{12}}{\sqrt{P_{11} P_{22}}} = \frac{1}{\sqrt{2 \times 1}} = \frac{1}{\sqrt{2}} \approx 0.7071$$
3. Even though the prior had zero cross-correlation ($\rho = 0$), dynamic evolution alone generated strong positive correlation ($\rho \approx 70.7\%$).

**Final Answer:**
$$P_{k|k-1} = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}, \quad \rho_{12} = \frac{1}{\sqrt{2}} \approx 0.7071$$

---

### Problem 5.18 (Solved Exercise): Effect of Measurement Delay
**Problem Statement:** A measurement $z_{k-d}$ arrives with a known delay of $d = 2$ steps. Describe how the linear Kalman filter can incorporate this delayed measurement without re-filtering the entire history from step 0.

**Step-by-Step Solution:**
1. Maintain a fixed rolling buffer of state estimates and covariances from step $k-d$ to $k$: $\{\hat{x}_{i|i}, P_{i|i}, u_i, z_i\}$ for $i \in [k-d, k]$.
2. At the current step $k$, when $z_{k-d}$ arrives:
   - Roll back state to step $k-d$: take $(\hat{x}_{k-d|k-d-1}, P_{k-d|k-d-1})$.
   - Execute the measurement update at step $k-d$ with the delayed $z_{k-d}$ to obtain updated $(\hat{x}_{k-d|k-d}, P_{k-d|k-d})$.
   - Re-propagate (forward pass) through steps $i = k-d+1, \dots, k$ using the stored control inputs $u_{i-1}$ and any measurements $z_i$ that arrived on those steps.
3. This forward playback restores the exact optimal state estimate at time step $k$ with zero latency distortion.

**Final Answer:**
Buffer roll-back and replay over interval $[k-d, k]$ restores exact Bayesian optimality.

---

### Problem 5.19 (Solved Exercise): Eigenvalue Contraction under Update
**Problem Statement:** Let $P^- = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$. Compute the eigenvalues of $P^-$. For $H = [1, 0]$ and $R = 1$, compute $P^+$ and verify that its eigenvalues are strictly less than or equal to those of $P^-$.

**Step-by-Step Solution:**
1. Eigenvalues of $P^-$:
   $$\det(\lambda I - P^-) = (\lambda - 2)^2 - 1 = 0 \implies \lambda = 2 \pm 1 \implies \lambda_1 = 3, \lambda_2 = 1$$
2. Measurement update:
   $$S = P_{11}^- + R = 2 + 1 = 3$$
   $$K = \frac{1}{3} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix}$$
   $$P^+ = P^- - K S K^T = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix} - 3 \begin{bmatrix} 4/9 & 2/9 \\ 2/9 & 1/9 \end{bmatrix} = \begin{bmatrix} 2 - 4/3 & 1 - 2/3 \\ 1 - 2/3 & 2 - 1/3 \end{bmatrix} = \begin{bmatrix} 2/3 & 1/3 \\ 1/3 & 5/3 \end{bmatrix}$$
3. Eigenvalues of $P^+$:
   $$\det(\lambda I - P^+) = (\lambda - 2/3)(\lambda - 5/3) - 1/9 = \lambda^2 - \frac{7}{3}\lambda + \frac{10}{9} - \frac{1}{9} = \lambda^2 - \frac{7}{3}\lambda + 1 = 0$$
   $$\lambda = \frac{7/3 \pm \sqrt{49/9 - 4}}{2} = \frac{7/3 \pm \sqrt{13}/3}{2} = \frac{7 \pm \sqrt{13}}{6}$$
   $$\lambda_1^+ = \frac{7 + 3.60555}{6} = \frac{10.60555}{6} \approx 1.7676$$
   $$\lambda_2^+ = \frac{7 - 3.60555}{6} = \frac{3.39445}{6} \approx 0.5657$$
4. Comparison:
   $$\lambda_1^+ = 1.7676 < \lambda_1^- = 3.0$$
   $$\lambda_2^+ = 0.5657 < \lambda_2^- = 1.0$$
   Both eigenvalues strictly contracted.

**Final Answer:**
$$\text{Prior: }\{1.0, 3.0\}, \quad \text{Posterior: }\{0.5657, 1.7676\}$$

---

### Problem 5.20 (Solved Exercise): Positive Definiteness Check in Floating Point
**Problem Statement:** In a tracking application with near-zero measurement noise $R = 10^{-14}$, a 64-bit IEEE double implementation of the textbook formula produces $P^+ = \begin{bmatrix} 1.0 \times 10^{-16} & 2.0 \times 10^{-8} \\ 2.0 \times 10^{-8} & 1.0 \end{bmatrix}$. Compute the determinant of $P^+$ and determine if it remains positive definite.

**Step-by-Step Solution:**
1. Determinant calculation:
   $$\det(P^+) = P_{11} P_{22} - P_{12}^2 = (1.0 \times 10^{-16})(1.0) - (2.0 \times 10^{-8})^2$$
   $$\det(P^+) = 1.0 \times 10^{-16} - 4.0 \times 10^{-16} = -3.0 \times 10^{-16} < 0$$
2. Since $\det(P^+) < 0$, one eigenvalue must be strictly negative!
   Eigenvalues satisfy $\lambda_1 \lambda_2 = -3.0 \times 10^{-16} < 0$.
3. When the engine subsequently attempts Cholesky factorization $L_{11} = \sqrt{P_{11}} = 10^{-8}$, but in step 2:
   $$L_{22} = \sqrt{P_{22} - L_{21}^2} = \sqrt{1.0 - (2.0)^2} = \sqrt{-3.0} \implies \text{NaN (Crash!)}$$
4. This exemplifies why the Joseph stabilized update is mandatory for production robotic state estimators.

**Final Answer:**
$$\det(P^+) = -3.0 \times 10^{-16} < 0\text{ (Indefinite matrix, Cholesky fails)}$$
