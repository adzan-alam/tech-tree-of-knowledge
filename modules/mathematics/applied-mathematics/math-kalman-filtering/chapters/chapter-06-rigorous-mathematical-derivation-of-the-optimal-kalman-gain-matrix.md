# Chapter 6: Rigorous Mathematical Derivation of the Optimal Kalman Gain Matrix

## 6.1 Introduction: Optimality in Stochastic Estimation

In engineering systems, many ad-hoc estimators can blend sensor signals and dynamic models. One could choose an arbitrary gain matrix $K$ and update states via $\hat{x}_{k|k} = \hat{x}_{k|k-1} + K y_k$. However, Rudolph E. Kalman’s historic 1960 breakthrough was not merely presenting a recursive filter; it was proving that among all possible linear estimators, the Kalman Gain $K_k^*$ is the **unique, mathematically optimal gain** that minimizes the total mean-squared estimation error.

Furthermore, if the noise processes are Gaussian, the Kalman Filter is not merely the best *linear* estimator—it is the absolute optimal Minimum Mean Square Error (MMSE) estimator across all conceivable nonlinear estimators.

In this chapter, we provide a complete, rigorous first-principles derivation of the multivariable optimal Kalman gain matrix $K_k$. We formulate the Linear Unbiased Minimum Variance Estimator (LUMVE) problem, apply matrix calculus identities to minimize the trace of the posterior covariance, verify the second-order sufficiency condition via the Hessian tensor, prove the geometric Orthogonality Principle, and demonstrate the statistical whiteness of the innovation sequence across 20 rigorous problems.

---

## 6.2 Problem Formulation: Linear Unbiased Minimum Variance Estimator (LUMVE)

Consider a linear discrete system:
$$x_k = F_k x_{k-1} + B_k u_{k-1} + w_k$$
$$z_k = H_k x_k + v_k$$
with zero-mean white process noise $w_k \sim \mathcal{N}(0, Q_k)$ and measurement noise $v_k \sim \mathcal{N}(0, R_k)$, where $R_k \in \mathbb{S}_{++}^m$.

Let the prior state estimate at time step $k$ be $\hat{x}_{k|k-1}$ with prior error $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$ satisfying:
$$\mathbb{E}[\tilde{x}_{k|k-1}] = 0$$
$$\mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] = P_{k|k-1}$$

### 6.2.1 The Linear Structure Assumption
We restrict our attention to estimators that update the state estimate as a linear function of the prior estimate and the new observation $z_k$:
$$\hat{x}_{k|k} = C_k \hat{x}_{k|k-1} + K_k z_k$$
where $C_k \in \mathbb{R}^{n \times n}$ and $K_k \in \mathbb{R}^{n \times m}$ are parameter matrices to be determined.

### 6.2.2 The Unbiasedness Constraint
An estimator is unbiased if the expected value of the estimate equals the expected value of the true state:
$$\mathbb{E}[\hat{x}_{k|k}] = \mathbb{E}[x_k]$$

Substituting the linear structure:
$$\mathbb{E}[\hat{x}_{k|k}] = C_k \mathbb{E}[\hat{x}_{k|k-1}] + K_k \mathbb{E}[z_k] = C_k \mathbb{E}[x_k] + K_k \mathbb{E}[H_k x_k + v_k]$$
Since $\mathbb{E}[v_k] = 0$:
$$\mathbb{E}[\hat{x}_{k|k}] = (C_k + K_k H_k) \mathbb{E}[x_k]$$
For this equality to hold for any arbitrary true state expectation $\mathbb{E}[x_k]$, we must have:
$$C_k + K_k H_k = I_n \implies C_k = I_n - K_k H_k$$

Substituting $C_k$ back into the update structure:
$$\hat{x}_{k|k} = (I_n - K_k H_k) \hat{x}_{k|k-1} + K_k z_k = \hat{x}_{k|k-1} + K_k (z_k - H_k \hat{x}_{k|k-1})$$
Defining the innovation $y_k = z_k - H_k \hat{x}_{k|k-1}$:
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k$$

The unbiasedness constraint forces the update to be an affine combination driven by the innovation residual $y_k$.

---

## 6.3 The Optimization Objective: Minimizing the Error Variance

Define the posterior estimation error vector $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$. As shown in Chapter 5:
$$\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$$

The posterior error covariance matrix $P_{k|k} = \mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k}^T]$ is given by the Joseph equation:
$$P_{k|k} = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T$$

We desire to find the gain matrix $K_k$ that minimizes the total mean squared error (MSE):
$$J(K_k) = \mathbb{E}[\|\tilde{x}_{k|k}\|^2] = \mathbb{E}[\tilde{x}_{k|k}^T \tilde{x}_{k|k}] = \mathbb{E}[\operatorname{tr}(\tilde{x}_{k|k} \tilde{x}_{k|k}^T)] = \operatorname{tr}(P_{k|k})$$

The trace of a covariance matrix is the sum of its eigenvalues, which geometrically equals the sum of the squared semi-axes of the uncertainty ellipsoid. Minimizing $\operatorname{tr}(P_{k|k})$ minimizes the bounding sphere of estimation uncertainty.

---

## 6.4 Matrix Calculus Identities

To differentiate the scalar cost function $J(K_k)$ with respect to the matrix $K_k \in \mathbb{R}^{n \times m}$, we recall the fundamental identities of matrix calculus:

1. **Derivative of linear trace:**
   $$\frac{\partial \operatorname{tr}(A X B)}{\partial X} = A^T B^T$$
   $$\frac{\partial \operatorname{tr}(X A)}{\partial X} = A^T$$

2. **Derivative of quadratic trace with symmetric kernel:**
   For symmetric $B = B^T$:
   $$\frac{\partial \operatorname{tr}(X B X^T)}{\partial X} = 2 X B$$
   $$\frac{\partial \operatorname{tr}(A X B X^T C)}{\partial X} = A^T C^T X B^T + C A X B$$

3. **Chain rule for affine transformations:**
   Let $M = I - X H$. Then:
   $$\frac{\partial \operatorname{tr}(M P M^T)}{\partial X} = -2 M P H^T = -2 (I - X H) P H^T$$

---

## 6.5 Complete First-Principles Derivation of $K_k^*$

### Step 1: Expand the Cost Function
Expand the Joseph expression inside the trace operator:
$$J(K_k) = \operatorname{tr}\left( (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T \right)$$
$$= \operatorname{tr}\left( P_{k|k-1} - K_k H_k P_{k|k-1} - P_{k|k-1} H_k^T K_k^T + K_k H_k P_{k|k-1} H_k^T K_k^T + K_k R_k K_k^T \right)$$

Using the linearity and cyclic property of the trace ($\operatorname{tr}(A B) = \operatorname{tr}(B A)$ and $\operatorname{tr}(A^T) = \operatorname{tr}(A)$):
$$\operatorname{tr}(P_{k|k-1} H_k^T K_k^T) = \operatorname{tr}((K_k H_k P_{k|k-1})^T) = \operatorname{tr}(K_k H_k P_{k|k-1})$$

Combining the cross-terms:
$$J(K_k) = \operatorname{tr}(P_{k|k-1}) - 2 \operatorname{tr}(K_k H_k P_{k|k-1}) + \operatorname{tr}\left( K_k (H_k P_{k|k-1} H_k^T + R_k) K_k^T \right)$$

Let $S_k = H_k P_{k|k-1} H_k^T + R_k \in \mathbb{S}_{++}^m$ denote the innovation covariance. Then:
$$J(K_k) = \operatorname{tr}(P_{k|k-1}) - 2 \operatorname{tr}(K_k H_k P_{k|k-1}) + \operatorname{tr}(K_k S_k K_k^T)$$

### Step 2: Differentiate with Respect to $K_k$
Applying our matrix calculus identities:
- Term 1: $\operatorname{tr}(P_{k|k-1})$ does not depend on $K_k$:
  $$\frac{\partial \operatorname{tr}(P_{k|k-1})}{\partial K_k} = 0$$
- Term 2: Linear in $K_k$:
  $$\frac{\partial}{\partial K_k} \left[ -2 \operatorname{tr}(K_k H_k P_{k|k-1}) \right] = -2 (H_k P_{k|k-1})^T = -2 P_{k|k-1} H_k^T$$
  (since $P_{k|k-1}$ is symmetric: $P_{k|k-1}^T = P_{k|k-1}$).
- Term 3: Quadratic in $K_k$ with symmetric kernel $S_k$:
  $$\frac{\partial \operatorname{tr}(K_k S_k K_k^T)}{\partial K_k} = 2 K_k S_k$$

Combining the gradients:
$$\frac{\partial J(K_k)}{\partial K_k} = -2 P_{k|k-1} H_k^T + 2 K_k S_k$$

### Step 3: Set Gradient to Zero and Solve
Setting the gradient equal to the zero matrix $0_{n \times m}$:
$$-2 P_{k|k-1} H_k^T + 2 K_k S_k = 0_{n \times m}$$
$$K_k S_k = P_{k|k-1} H_k^T$$

Since $R_k \in \mathbb{S}_{++}^m$ and $H_k P_{k|k-1} H_k^T \in \mathbb{S}_+^m$, the innovation covariance $S_k$ is strictly positive-definite ($\lambda_i(S_k) > 0$), which guarantees that $S_k$ is non-singular and invertible. Post-multiplying both sides by $S_k^{-1}$:

$$\mathbf{K_k^* = P_{k|k-1} H_k^T S_k^{-1} = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + R_k)^{-1}}$$

$\blacksquare$

---

## 6.6 Second-Order Sufficiency Condition (Global Minimality)

To confirm that $K_k^*$ achieves a strict global minimum (rather than a saddle point or maximum), we compute the second variation of $J(K)$.

Let $\Delta K \in \mathbb{R}^{n \times m}$ be an arbitrary perturbation matrix. Consider the scalar cost of $K + \Delta K$:
$$J(K + \Delta K) = \operatorname{tr}\left( (K + \Delta K) S (K + \Delta K)^T - 2 (K + \Delta K) H P + P \right)$$
$$= J(K) + \operatorname{tr}\left( \Delta K S K^T + K S \Delta K^T - 2 \Delta K H P \right) + \operatorname{tr}(\Delta K S \Delta K^T)$$

At $K = K^*$, $K^* S = P H^T$, so the first-order linear perturbation term vanishes:
$$\operatorname{tr}\left( 2 \Delta K (S K^{*T} - H P) \right) = 0$$

Thus:
$$J(K^* + \Delta K) - J(K^*) = \operatorname{tr}(\Delta K \, S_k \, \Delta K^T)$$

Let the rows of $\Delta K$ be $\delta k_1^T, \dots, \delta k_n^T$. Then:
$$\operatorname{tr}(\Delta K S_k \Delta K^T) = \sum_{i=1}^n \delta k_i^T S_k \delta k_i$$

Since $S_k \in \mathbb{S}_{++}^m$ is strictly positive-definite:
$$\delta k_i^T S_k \delta k_i > 0 \quad \forall \, \delta k_i \neq 0$$

Therefore:
$$J(K^* + \Delta K) > J(K^*) \quad \forall \, \Delta K \neq 0$$

The cost function $J(K)$ is strictly convex in $K_k$, and $K_k^*$ is the **unique global minimum**. $\blacksquare$

---

## 6.7 The Orthogonality Principle

The geometric cornerstone of optimal estimation in Hilbert spaces is the **Orthogonality Principle**:

> **Theorem (The Orthogonality Principle):** An estimator $\hat{x}_{k|k}$ minimizes the mean squared error if and only if the estimation error $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$ is statistically orthogonal to all past and present measurements $z_1, \dots, z_k$, and equivalently, orthogonal to the innovation $y_k$:
> $$\mathbb{E}[\tilde{x}_{k|k} y_k^T] = 0_{n \times m}$$

### Proof:
Substitute $\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$ and $y_k = H_k \tilde{x}_{k|k-1} + v_k$:
$$\mathbb{E}[\tilde{x}_{k|k} y_k^T] = \mathbb{E}\left[ \left( (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k \right) \left( H_k \tilde{x}_{k|k-1} + v_k \right)^T \right]$$

Since $\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$:
$$\mathbb{E}[\tilde{x}_{k|k} y_k^T] = (I - K_k H_k) \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] H_k^T - K_k \mathbb{E}[v_k v_k^T]$$
$$= (I - K_k H_k) P_{k|k-1} H_k^T - K_k R_k = P_{k|k-1} H_k^T - K_k (H_k P_{k|k-1} H_k^T + R_k)$$
$$= P_{k|k-1} H_k^T - K_k S_k$$

Setting $\mathbb{E}[\tilde{x}_{k|k} y_k^T] = 0$ yields:
$$K_k S_k = P_{k|k-1} H_k^T \implies K_k = P_{k|k-1} H_k^T S_k^{-1}$$

The Orthogonality Principle directly produces the optimal Kalman gain. Geometrically, the optimal estimate $\hat{x}_{k|k}$ is the orthogonal projection of the true state $x_k$ onto the linear subspace spanned by the observations.

---

## 6.8 Whiteness of the Innovation Sequence

A critical diagnostic property of an optimal Kalman Filter is that the innovation sequence $\{y_1, y_2, \dots, y_k\}$ must be **white noise**:

$$\mathbb{E}[y_j y_k^T] = S_k \delta_{jk} = \begin{cases} S_k & \text{if } j = k \\ 0 & \text{if } j \neq k \end{cases}$$

### Proof:
Without loss of generality, assume $j < k$.
The innovation at step $k$ is:
$$y_k = z_k - H_k \hat{x}_{k|k-1} = H_k (x_k - \hat{x}_{k|k-1}) + v_k = H_k \tilde{x}_{k|k-1} + v_k$$

The prior error propagates as:
$$\tilde{x}_{k|k-1} = F_k \tilde{x}_{k-1|k-1} + w_k = F_k ((I - K_{k-1} H_{k-1}) \tilde{x}_{k-1|k-2} - K_{k-1} v_{k-1}) + w_k$$

By induction, $\tilde{x}_{k|k-1}$ is a linear combination of errors orthogonal to all measurements up to step $k-1$.
Since $j \le k-1$, the measurement $z_j$ and innovation $y_j$ are fully contained in the information set $Z_{1:k-1}$.
By the law of total expectation:
$$\mathbb{E}[y_k y_j^T] = \mathbb{E}\left[ \mathbb{E}[y_k | Z_{1:k-1}] y_j^T \right]$$

Evaluating the conditional expectation:
$$\mathbb{E}[y_k | Z_{1:k-1}] = \mathbb{E}[z_k - H_k \hat{x}_{k|k-1} | Z_{1:k-1}] = H_k \hat{x}_{k|k-1} - H_k \hat{x}_{k|k-1} = 0$$

Therefore:
$$\mathbb{E}[y_k y_j^T] = 0 \quad \forall \, j < k$$

If the innovations from an operational Kalman filter exhibit autocorrelation ($\mathbb{E}[y_k y_{k-1}^T] \neq 0$), the filter is sub-optimal: the dynamic model or sensor noise parameters $(Q, R)$ are misspecified.

---

## 6.9 Mathematical Problem Set

### Problem 6.1 (Worked Example): Trace Calculus Derivative Step-by-Step
**Problem Statement:** Let $f(K) = \operatorname{tr}(K S K^T - 2 K M)$ where $S \in \mathbb{S}_{++}^2$ and $M \in \mathbb{R}^{2 \times 2}$.
$$S = \begin{bmatrix} 5 & 1 \\ 1 & 2 \end{bmatrix}, \quad M = \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix}$$
1. Compute the analytical gradient $\nabla_K f(K) \in \mathbb{R}^{2 \times 2}$.
2. Solve for the stationary point $K^*$.
3. Evaluate $f(K^*)$ and verify that it is smaller than $f(0)$.

**Step-by-Step Derivation:**
1. Analytical gradient:
   $$\nabla_K f(K) = 2 K S - 2 M^T$$
2. Setting gradient to zero:
   $$2 K S - 2 M^T = 0 \implies K S = M^T \implies K^* = M^T S^{-1}$$
3. Numerical inversion of $S$:
   $$\det(S) = (5)(2) - (1)(1) = 10 - 1 = 9$$
   $$S^{-1} = \frac{1}{9} \begin{bmatrix} 2 & -1 \\ -1 & 5 \end{bmatrix}$$
   $$M^T = \begin{bmatrix} 3 & 1 \\ 4 & 2 \end{bmatrix}$$
   $$K^* = \begin{bmatrix} 3 & 1 \\ 4 & 2 \end{bmatrix} \left( \frac{1}{9} \begin{bmatrix} 2 & -1 \\ -1 & 5 \end{bmatrix} \right) = \frac{1}{9} \begin{bmatrix} 6 - 1 & -3 + 5 \\ 8 - 2 & -4 + 10 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 5 & 2 \\ 6 & 6 \end{bmatrix} \approx \begin{bmatrix} 0.5556 & 0.2222 \\ 0.6667 & 0.6667 \end{bmatrix}$$
4. Cost at $K = 0$:
   $$f(0) = \operatorname{tr}(0) = 0$$
5. Cost at $K^*$:
   $$f(K^*) = \operatorname{tr}(K^* S K^{*T} - 2 K^* M) = \operatorname{tr}(M^T S^{-1} S S^{-1} M - 2 M^T S^{-1} M) = -\operatorname{tr}(M^T S^{-1} M)$$
   $$M^T S^{-1} M = K^* M = \frac{1}{9} \begin{bmatrix} 5 & 2 \\ 6 & 6 \end{bmatrix} \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 15 + 2 & 20 + 4 \\ 18 + 6 & 24 + 12 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 17 & 24 \\ 24 & 36 \end{bmatrix}$$
   $$f(K^*) = -\frac{1}{9} \operatorname{tr}\left( \begin{bmatrix} 17 & 24 \\ 24 & 36 \end{bmatrix} \right) = -\frac{17 + 36}{9} = -\frac{53}{9} \approx -5.8889 < 0$$

**Final Result:**
$$K^* = \frac{1}{9}\begin{bmatrix} 5 & 2 \\ 6 & 6 \end{bmatrix}, \quad f(K^*) = -\frac{53}{9} \approx -5.889 < f(0) = 0$$

---

### Problem 6.2 (Worked Example): Invariance to State Linear Transformation
**Problem Statement:** Let a linear change of state coordinates be defined by $x' = T x$, where $T \in \mathbb{R}^{n \times n}$ is invertible. Prove that the Kalman filter is coordinate-invariant: the state estimate in transformed coordinates satisfies $\hat{x}' = T \hat{x}$ and covariance satisfies $P' = T P T^T$.

**Step-by-Step Derivation:**
1. Transformed system matrices:
   $$x'_k = T x_k = T (F x_{k-1} + w_k) = (T F T^{-1}) x'_{k-1} + T w_k \implies F' = T F T^{-1}, \quad Q' = T Q T^T$$
   $$z_k = H x_k + v_k = (H T^{-1}) x'_k + v_k \implies H' = H T^{-1}, \quad R' = R$$
2. Prior covariance transformation:
   $$P_{k|k-1}' = F' P_{k-1|k-1}' F'^T + Q' = (T F T^{-1}) (T P_{k-1|k-1} T^T) (T^{-T} F^T T^T) + T Q T^T$$
   $$= T (F P_{k-1|k-1} F^T + Q) T^T = T P_{k|k-1} T^T$$
3. Innovation covariance invariance:
   $$S' = H' P' H'^T + R' = (H T^{-1}) (T P T^T) (T^{-T} H^T) + R = H P H^T + R = S$$
   The innovation covariance $S$ is strictly identical!
4. Transformed Kalman gain:
   $$K' = P' H'^T S'^{-1} = (T P T^T) (T^{-T} H^T) S^{-1} = T (P H^T S^{-1}) = T K$$
5. State update:
   $$\hat{x}'_{k|k} = \hat{x}'_{k|k-1} + K' y_k = T \hat{x}_{k|k-1} + T K y_k = T (\hat{x}_{k|k-1} + K y_k) = T \hat{x}_{k|k}$$
6. Posterior covariance:
   $$P'_{k|k} = (I - K' H') P'_{k|k-1} = (I - T K H T^{-1}) (T P_{k|k-1} T^T) = T (I - K H) P_{k|k-1} T^T = T P_{k|k} T^T \quad \blacksquare$$

---

### Problem 6.3 (Worked Example): Innovation Autocorrelation Test
**Problem Statement:** A Kalman filter produces a scalar innovation sequence $y_k$ with empirical lag-1 sample autocorrelation $\hat{\rho}_1 = \frac{\sum_{k=1}^N y_k y_{k-1}}{\sum_{k=1}^N y_k^2}$. For $N = 1000$, $\hat{\rho}_1 = 0.12$. Using the $95\%$ confidence bound for white noise ($|\hat{\rho}_1| \le \frac{1.96}{\sqrt{N}}$), test whether the filter is optimal.

**Step-by-Step Derivation:**
1. Under the null hypothesis $H_0$ that the innovations are independent and identically distributed white noise:
   $$\hat{\rho}_1 \sim \mathcal{N}\left(0, \frac{1}{N}\right)$$
2. Two-tailed $95\%$ confidence bounds ($\alpha = 0.05$):
   $$\text{Threshold} = \pm \frac{1.96}{\sqrt{N}} = \pm \frac{1.96}{\sqrt{1000}} \approx \pm \frac{1.96}{31.6228} \approx \pm 0.0620$$
3. Test comparison:
   $$|\hat{\rho}_1| = 0.12 > 0.0620$$
4. Conclusion:
   The empirical autocorrelation of $0.12$ exceeds the $95\%$ critical threshold. $H_0$ is rejected with $p < 0.001$.
   The filter is demonstrably sub-optimal. The lag-1 positive correlation indicates the filter is sluggish (underestimating process noise $Q$ or overestimating measurement noise $R$).

**Final Result:**
$$\text{Threshold} = \pm 0.0620, \quad |\hat{\rho}_1| = 0.12 > 0.0620 \implies \mathbf{Sub\text{-}Optimal\ (Reject\ H_0)}$$

---

### Problem 6.4 (Worked Example): Weighted Trace Minimization Invariance
**Problem Statement:** Suppose instead of minimizing the unweighted trace $\operatorname{tr}(P)$, an engineer chooses to minimize a weighted sum of estimation variances $J_W(K) = \operatorname{tr}(W P)$ for any arbitrary symmetric positive-definite weight matrix $W \in \mathbb{S}_{++}^n$. Prove that the resulting optimal Kalman gain $K_W^*$ is completely independent of $W$ and identical to the standard Kalman gain $K^*$.

**Step-by-Step Derivation:**
1. Weighted objective function:
   $$J_W(K) = \operatorname{tr}(W P) = \operatorname{tr}\left( W \left[ (I - K H) P^- (I - K H)^T + K R K^T \right] \right)$$
2. Expanding:
   $$J_W(K) = \operatorname{tr}(W P^-) - 2 \operatorname{tr}(W K H P^-) + \operatorname{tr}(W K S K^T)$$
3. Differentiating with respect to $K$:
   $$\frac{\partial}{\partial K} \left[ -2 \operatorname{tr}(W K H P^-) \right] = -2 W^T (H P^-)^T = -2 W P^- H^T$$
   $$\frac{\partial}{\partial K} \left[ \operatorname{tr}(W K S K^T) \right] = 2 W K S$$
   Combining:
   $$\frac{\partial J_W(K)}{\partial K} = -2 W P^- H^T + 2 W K S = 0$$
4. Pre-multiplying by $W^{-1}$ (which exists because $W \in \mathbb{S}_{++}^n$):
   $$-P^- H^T + K S = 0 \implies K S = P^- H^T \implies K_W^* = P^- H^T S^{-1} = K^*$$
5. Thus, the optimal Kalman gain minimizes *every* quadratic error metric simultaneously, independent of the weighting matrix $W$. $\blacksquare$

---

### Problem 6.5 (Worked Example): Scalar LUMVE vs Ordinary Least Squares
**Problem Statement:** A constant parameter $\theta$ is observed by two sensors: $z_1 = \theta + v_1, z_2 = \theta + v_2$, where $\mathbb{E}[v_1] = \mathbb{E}[v_2] = 0$, $\operatorname{Var}(v_1) = \sigma_1^2 = 1.0$, and $\operatorname{Var}(v_2) = \sigma_2^2 = 9.0$.
Compare the estimation variance of:
1. Ordinary Least Squares (sample mean: $\hat{\theta}_{\text{OLS}} = \frac{1}{2}(z_1 + z_2)$).
2. The optimal LUMVE estimate $\hat{\theta}_{\text{LUMVE}} = w_1 z_1 + w_2 z_2$.

**Step-by-Step Derivation:**
1. Ordinary Least Squares variance:
   $$\operatorname{Var}(\hat{\theta}_{\text{OLS}}) = \operatorname{Var}\left(\frac{1}{2} z_1 + \frac{1}{2} z_2\right) = \frac{1}{4} \sigma_1^2 + \frac{1}{4} \sigma_2^2 = \frac{1.0 + 9.0}{4} = \frac{10.0}{4} = 2.50$$
   *Shocking Result:* Notice that $\operatorname{Var}(\hat{\theta}_{\text{OLS}}) = 2.50 > \sigma_1^2 = 1.0$. Naively averaging the high-precision sensor with the noisy sensor produces an estimate that is $2.5\times$ *worse* than discarding sensor 2 altogether!
2. LUMVE optimization:
   Constraint: $w_1 + w_2 = 1 \implies w_2 = 1 - w_1$.
   $$\operatorname{Var}(\hat{\theta}) = w_1^2 \sigma_1^2 + (1 - w_1)^2 \sigma_2^2 = w_1^2 (1) + (1 - 2 w_1 + w_1^2) (9) = 10 w_1^2 - 18 w_1 + 9$$
   Differentiating:
   $$20 w_1 - 18 = 0 \implies w_1^* = \frac{18}{20} = 0.90, \quad w_2^* = 0.10$$
   $$\operatorname{Var}(\hat{\theta}_{\text{LUMVE}}) = (0.9)^2 (1) + (0.1)^2 (9) = 0.81 + 0.09 = 0.90$$
3. Comparison:
   $$\operatorname{Var}(\hat{\theta}_{\text{LUMVE}}) = 0.90 < \sigma_1^2 = 1.00 < \operatorname{Var}(\hat{\theta}_{\text{OLS}}) = 2.50$$

**Final Result:**
$$\operatorname{Var}(\hat{\theta}_{\text{OLS}}) = 2.50, \quad \operatorname{Var}(\hat{\theta}_{\text{LUMVE}}) = 0.90 \quad (\text{LUMVE reduces variance by }64\%)$$

---

### Problem 6.6 (Worked Example): Innovation Sequence Zero-Mean Property
**Problem Statement:** Prove that for any linear system with zero-mean noise, the innovation sequence satisfies $\mathbb{E}[y_k] = 0$ for all $k \ge 1$, and that the cumulative sum $C_N = \sum_{k=1}^N y_k$ is a martingale.

**Step-by-Step Derivation:**
1. True measurement and predicted measurement:
   $$z_k = H_k x_k + v_k$$
   $$\hat{z}_{k|k-1} = H_k \hat{x}_{k|k-1}$$
   $$y_k = z_k - \hat{z}_{k|k-1} = H_k (x_k - \hat{x}_{k|k-1}) + v_k = H_k \tilde{x}_{k|k-1} + v_k$$
2. Expectation:
   $$\mathbb{E}[y_k] = H_k \mathbb{E}[\tilde{x}_{k|k-1}] + \mathbb{E}[v_k] = H_k (0) + 0 = 0$$
3. Martingale property:
   Consider the cumulative sum $C_N = \sum_{k=1}^N y_k$.
   Condition on information up to step $N-1$:
   $$\mathbb{E}[C_N | Z_{1:N-1}] = \mathbb{E}[C_{N-1} + y_N | Z_{1:N-1}] = C_{N-1} + \mathbb{E}[y_N | Z_{1:N-1}]$$
   As proved in Section 6.8, $\mathbb{E}[y_N | Z_{1:N-1}] = 0$.
   Therefore:
   $$\mathbb{E}[C_N | Z_{1:N-1}] = C_{N-1}$$
   This satisfies the definition of a discrete-time martingale. $\blacksquare$

---

### Problem 6.7 (Worked Example): Gain Sensitivity to Covariance Mismatch
**Problem Statement:** A 1D system has true measurement noise $r_{\text{true}} = 1.0$. An engineer incorrectly configures the filter with $r_{\text{filter}} = 4.0$. If prior variance is $p = 4.0$ and $h = 1$:
1. Compute the filter gain $K_{\text{sub}}$ and true resulting posterior variance $p_{\text{true}}$.
2. Compare with the optimal posterior variance $p^*$ achieved if $r_{\text{true}}$ were known.

**Step-by-Step Derivation:**
1. Gain computed by filter:
   $$K_{\text{sub}} = \frac{p}{p + r_{\text{filter}}} = \frac{4.0}{4.0 + 4.0} = \frac{4.0}{8.0} = 0.50$$
2. True posterior variance (using Joseph form with $r_{\text{true}} = 1.0$):
   $$p_{\text{true}} = (1 - K_{\text{sub}})^2 p + K_{\text{sub}}^2 r_{\text{true}} = (1 - 0.5)^2 (4.0) + (0.5)^2 (1.0) = (0.25)(4.0) + (0.25)(1.0) = 1.0 + 0.25 = 1.25$$
3. Optimal gain and variance if correctly tuned:
   $$K^* = \frac{p}{p + r_{\text{true}}} = \frac{4.0}{4.0 + 1.0} = 0.80$$
   $$p^* = (1 - K^*) p = (1 - 0.8)(4.0) = 0.2 \times 4.0 = 0.80$$
4. Degradation:
   $$\text{Excess Variance} = p_{\text{true}} - p^* = 1.25 - 0.80 = 0.45 \quad (+56.25\%)$$

**Final Result:**
$$K_{\text{sub}} = 0.50, \quad p_{\text{true}} = 1.25, \quad p^* = 0.80 \quad (\text{Variance degraded by }56.25\%)$$

---

### Problem 6.8 (Worked Example): Orthogonality of Prior Error and Innovation
**Problem Statement:** Prove that the prior state error $\tilde{x}_{k|k-1}$ and the measurement innovation $y_k$ are not orthogonal, but satisfy $\mathbb{E}[\tilde{x}_{k|k-1} y_k^T] = P_{k|k-1} H_k^T$.

**Step-by-Step Derivation:**
1. Express innovation:
   $$y_k = H_k \tilde{x}_{k|k-1} + v_k$$
2. Multiply by prior error and take expectation:
   $$\mathbb{E}[\tilde{x}_{k|k-1} y_k^T] = \mathbb{E}[\tilde{x}_{k|k-1} (H_k \tilde{x}_{k|k-1} + v_k)^T] = \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] H_k^T + \mathbb{E}[\tilde{x}_{k|k-1} v_k^T]$$
3. Since $v_k$ is independent of past and current prior error:
   $$\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$$
4. Therefore:
   $$\mathbb{E}[\tilde{x}_{k|k-1} y_k^T] = P_{k|k-1} H_k^T \neq 0 \quad \blacksquare$$

---

### Problem 6.9 (Worked Example): Derivation of Kalman Gain via Bayesian Gaussian Conditioning
**Problem Statement:** Derive the multivariable Kalman Gain $K_k$ directly from the conditioning formulas of a joint Gaussian distribution without taking any matrix derivatives.

**Step-by-Step Derivation:**
1. The state $x_k$ and observation $z_k$ conditioned on $Z_{1:k-1}$ are jointly Gaussian:
   $$\begin{bmatrix} x_k \\ z_k \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} \hat{x}_{k|k-1} \\ H_k \hat{x}_{k|k-1} \end{bmatrix}, \begin{bmatrix} \Sigma_{xx} & \Sigma_{xz} \\ \Sigma_{zx} & \Sigma_{zz} \end{bmatrix} \right)$$
2. Covariances:
   $$\Sigma_{xx} = \operatorname{Cov}(x_k) = P_{k|k-1}$$
   $$\Sigma_{xz} = \operatorname{Cov}(x_k, z_k) = \mathbb{E}[\tilde{x}_{k|k-1} (H_k \tilde{x}_{k|k-1} + v_k)^T] = P_{k|k-1} H_k^T$$
   $$\Sigma_{zz} = \operatorname{Cov}(z_k) = H_k P_{k|k-1} H_k^T + R_k = S_k$$
3. By the Schur complement Gaussian conditioning theorem (derived in Chapter 1):
   $$p(x_k | z_k) = \mathcal{N}(\mu_{x|z}, \Sigma_{x|z})$$
   $$\mu_{x|z} = \mu_x + \Sigma_{xz} \Sigma_{zz}^{-1} (z_k - \mu_z) = \hat{x}_{k|k-1} + (P_{k|k-1} H_k^T S_k^{-1}) (z_k - H_k \hat{x}_{k|k-1})$$
   $$\Sigma_{x|z} = \Sigma_{xx} - \Sigma_{xz} \Sigma_{zz}^{-1} \Sigma_{zx} = P_{k|k-1} - (P_{k|k-1} H_k^T S_k^{-1}) H_k P_{k|k-1}$$
4. Identifying terms:
   $$K_k = \Sigma_{xz} \Sigma_{zz}^{-1} = P_{k|k-1} H_k^T S_k^{-1}$$
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k$$
   $$P_{k|k} = (I - K_k H_k) P_{k|k-1}$$
   The Kalman gain emerges purely as the linear regression coefficient of joint Gaussian conditioning. $\blacksquare$

---

### Problem 6.10 (Worked Example): Rank-1 Kalman Gain Update
**Problem Statement:** For a scalar measurement ($m = 1$), $H = h^T \in \mathbb{R}^{1 \times n}$ and $R = r > 0$. Show that the Kalman gain is a vector $k \in \mathbb{R}^n$, and write the posterior covariance update in outer-product form.

**Step-by-Step Derivation:**
1. Innovation variance:
   $$s = h^T P^- h + r \quad (\text{a scalar})$$
2. Kalman gain vector:
   $$k = \frac{1}{s} P^- h = \frac{P^- h}{h^T P^- h + r} \in \mathbb{R}^n$$
3. Covariance update:
   $$P^+ = P^- - k s k^T = P^- - s \left(\frac{P^- h}{s}\right) \left(\frac{P^- h}{s}\right)^T = P^- - \frac{1}{s} (P^- h)(P^- h)^T$$
4. Let $v = P^- h \in \mathbb{R}^n$. Then:
   $$P^+ = P^- - \frac{1}{s} v v^T$$
   The covariance update is a symmetric rank-1 downdate, which can be computed in $\mathcal{O}(n^2)$ operations without any matrix inversions.

**Final Result:**
$$P^+ = P^- - \frac{(P^- h)(P^- h)^T}{h^T P^- h + r}$$

---

### Problem 6.11 (Solved Exercise): Trace Derivative of Symmetric Form
**Problem Statement:** For symmetric $A = A^T$, verify that $\frac{\partial \operatorname{tr}(X A X^T)}{\partial X} = 2 X A$ by expanding the component-wise derivatives for $2 \times 2$ matrices.

**Step-by-Step Solution:**
1. Let $X = \begin{bmatrix} x_{11} & x_{12} \\ x_{21} & x_{22} \end{bmatrix}, A = \begin{bmatrix} a & b \\ b & c \end{bmatrix}$.
2. Compute $X A$:
   $$X A = \begin{bmatrix} a x_{11} + b x_{12} & b x_{11} + c x_{12} \\ a x_{21} + b x_{22} & b x_{21} + c x_{22} \end{bmatrix}$$
3. Diagonal elements of $(X A) X^T$:
   $$[(X A) X^T]_{11} = (a x_{11} + b x_{12}) x_{11} + (b x_{11} + c x_{12}) x_{12} = a x_{11}^2 + 2 b x_{11} x_{12} + c x_{12}^2$$
   $$[(X A) X^T]_{22} = a x_{21}^2 + 2 b x_{21} x_{22} + c x_{22}^2$$
4. Trace:
   $$\operatorname{tr}(X A X^T) = a x_{11}^2 + 2 b x_{11} x_{12} + c x_{12}^2 + a x_{21}^2 + 2 b x_{21} x_{22} + c x_{22}^2$$
5. Partial derivatives:
   $$\frac{\partial \text{tr}}{\partial x_{11}} = 2 a x_{11} + 2 b x_{12} = 2 [X A]_{11}$$
   $$\frac{\partial \text{tr}}{\partial x_{12}} = 2 b x_{11} + 2 c x_{12} = 2 [X A]_{12}$$
   $$\frac{\partial \text{tr}}{\partial x_{21}} = 2 [X A]_{21}, \quad \frac{\partial \text{tr}}{\partial x_{22}} = 2 [X A]_{22}$$
6. Assembling into matrix form: $\frac{\partial \operatorname{tr}(X A X^T)}{\partial X} = 2 X A$. $\blacksquare$

---

### Problem 6.12 (Solved Exercise): Non-Symmetric Kernel Trace Derivative
**Problem Statement:** If $B$ is not symmetric, prove that $\frac{\partial \operatorname{tr}(X B X^T)}{\partial X} = X(B + B^T)$.

**Step-by-Step Solution:**
1. Decompose $B$ into symmetric and skew-symmetric parts:
   $$B = B_{\text{sym}} + B_{\text{skew}}, \quad B_{\text{sym}} = \frac{1}{2}(B + B^T), \quad B_{\text{skew}} = \frac{1}{2}(B - B^T)$$
2. For any skew-symmetric matrix $M$, $\operatorname{tr}(X M X^T) = 0$ because $X M X^T$ is skew-symmetric.
3. Therefore:
   $$\operatorname{tr}(X B X^T) = \operatorname{tr}(X B_{\text{sym}} X^T)$$
4. Applying the symmetric identity:
   $$\frac{\partial \operatorname{tr}(X B_{\text{sym}} X^T)}{\partial X} = 2 X B_{\text{sym}} = 2 X \left(\frac{B + B^T}{2}\right) = X(B + B^T) \quad \blacksquare$$

---

### Problem 6.13 (Solved Exercise): Correlation between Prior and Posterior Errors
**Problem Statement:** Show that the cross-covariance between prior error $\tilde{x}_{k|k-1}$ and posterior error $\tilde{x}_{k|k}$ equals the posterior covariance: $\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k-1}^T] = P_{k|k}$.

**Step-by-Step Solution:**
1. Express posterior error:
   $$\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$$
2. Post-multiply by $\tilde{x}_{k|k-1}^T$ and take expectation:
   $$\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k-1}^T] = (I - K_k H_k) \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] - K_k \mathbb{E}[v_k \tilde{x}_{k|k-1}^T]$$
3. Since $\mathbb{E}[v_k \tilde{x}_{k|k-1}^T] = 0$:
   $$\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k-1}^T] = (I - K_k H_k) P_{k|k-1} = P_{k|k} \quad \blacksquare$$

---

### Problem 6.14 (Solved Exercise): Innovation Covariance Determinant and Entropy
**Problem Statement:** Show that the conditional differential entropy of the measurement $h(z_k | Z_{1:k-1})$ is given by $\frac{1}{2} \ln((2\pi e)^m \det(S_k))$.

**Step-by-Step Solution:**
1. The measurement conditioned on past data is Gaussian:
   $$z_k | Z_{1:k-1} \sim \mathcal{N}(H_k \hat{x}_{k|k-1}, S_k)$$
2. The differential entropy of an $m$-dimensional Gaussian random vector with covariance $S$ is:
   $$h(X) = \frac{1}{2} \ln\left((2\pi e)^m \det(S)\right)$$
3. Substituting $S = S_k$ directly yields the result.
   As measurements are assimilated, $\det(S_k)$ decreases towards steady-state, reflecting reduced surprise. $\blacksquare$

---

### Problem 6.15 (Solved Exercise): Gain Behavior with Correlated Process and Measurement Noise
**Problem Statement:** If process noise and measurement noise are correlated such that $\mathbb{E}[w_k v_k^T] = M_k \neq 0$, derive the modified optimal Kalman gain.

**Step-by-Step Solution:**
1. The prior error is $\tilde{x}_{k|k-1} = F \tilde{x}_{k-1|k-1} + w_k$.
   The cross-correlation between prior error and measurement noise is:
   $$\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = \mathbb{E}[w_k v_k^T] = M_k$$
2. Posterior error: $\tilde{x}_{k|k} = (I - K H) \tilde{x}_{k|k-1} - K v_k$.
3. Expand $P_{k|k} = \mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k}^T]$ retaining cross-terms:
   $$P_{k|k} = (I - K H) P^- (I - K H)^T + K R K^T - (I - K H) M_k K^T - K M_k^T (I - K H)^T$$
4. Differentiating with respect to $K$ and setting to zero:
   $$-2 (I - K H) P^- H^T + 2 K R - 2 (I - K H) M_k + 2 K H M_k = 0$$
   Solving for $K$:
   $$K (H P^- H^T + R + H M_k + M_k^T H^T) = P^- H^T + M_k$$

**Final Answer:**
$$K_k^* = (P_{k|k-1} H_k^T + M_k) (H_k P_{k|k-1} H_k^T + R_k + H_k M_k + M_k^T H_k^T)^{-1}$$

---

### Problem 6.16 (Solved Exercise): Linear Regression Equivalence
**Problem Statement:** For a static state $x$ with $z_i = x + v_i$ ($i = 1, \dots, N$) and independent $v_i \sim \mathcal{N}(0, \sigma^2)$, show that the batch maximum likelihood estimate $\hat{x}_{\text{ML}} = \frac{1}{N} \sum z_i$ is identical to the Kalman filter estimate with diffuse prior $P_0 \to \infty$.

**Step-by-Step Solution:**
1. In information form (Problem 5.14):
   $$P_N^{-1} = P_0^{-1} + N \frac{1}{\sigma^2}$$
   As $P_0 \to \infty$, $P_0^{-1} \to 0$, so $P_N = \frac{\sigma^2}{N}$.
2. Information state vector:
   $$\hat{y}_N = P_0^{-1} \hat{x}_0 + \sum_{i=1}^N \frac{z_i}{\sigma^2} = \frac{1}{\sigma^2} \sum_{i=1}^N z_i$$
3. State estimate:
   $$\hat{x}_N = P_N \hat{y}_N = \left(\frac{\sigma^2}{N}\right) \left(\frac{1}{\sigma^2} \sum_{i=1}^N z_i\right) = \frac{1}{N} \sum_{i=1}^N z_i = \hat{x}_{\text{ML}} \quad \blacksquare$$

---

### Problem 6.17 (Solved Exercise): Verification of Orthogonality in Problem 5.1
**Problem Statement:** Using the numerical values from Problem 5.1 ($\hat{x}_{k|k} = [12.64, 2.24]^T, K = [0.8, 0.3]^T, S = 2.5$), verify numerically that $\mathbb{E}[\tilde{x}_{k|k} y_k] = 0$.

**Step-by-Step Solution:**
1. From Section 6.7:
   $$\mathbb{E}[\tilde{x}_{k|k} y_k] = P^- H^T - K S$$
2. From Problem 5.1:
   $$P^- H^T = \begin{bmatrix} 2.0 \\ 0.75 \end{bmatrix}, \quad K = \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix}, \quad S = 2.5$$
3. Multiply $K S$:
   $$K S = \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix} \times 2.5 = \begin{bmatrix} 2.00 \\ 0.75 \end{bmatrix}$$
4. Subtract:
   $$\mathbb{E}[\tilde{x}_{k|k} y_k] = \begin{bmatrix} 2.00 \\ 0.75 \end{bmatrix} - \begin{bmatrix} 2.00 \\ 0.75 \end{bmatrix} = \begin{bmatrix} 0.00 \\ 0.00 \end{bmatrix}$$
   The orthogonality condition holds exactly. $\blacksquare$

---

### Problem 6.18 (Solved Exercise): Whiteness of Second Lag Innovations
**Problem Statement:** Prove algebraically that $\mathbb{E}[y_k y_{k-2}^T] = 0$.

**Step-by-Step Solution:**
1. The measurement update at step $k-2$ produces posterior error $\tilde{x}_{k-2|k-2}$, which is orthogonal to $y_{k-2}$ by the Orthogonality Principle: $\mathbb{E}[\tilde{x}_{k-2|k-2} y_{k-2}^T] = 0$.
2. State error propagates through two steps of dynamics:
   $$\tilde{x}_{k|k-1} = F_k F_{k-1} \tilde{x}_{k-2|k-2} + F_k w_{k-1} + w_k$$
3. The innovation at step $k$ is $y_k = H_k \tilde{x}_{k|k-1} + v_k$.
4. Taking expectation $\mathbb{E}[y_k y_{k-2}^T]$:
   $$\mathbb{E}[y_k y_{k-2}^T] = H_k F_k F_{k-1} \mathbb{E}[\tilde{x}_{k-2|k-2} y_{k-2}^T] + H_k F_k \mathbb{E}[w_{k-1} y_{k-2}^T] + H_k \mathbb{E}[w_k y_{k-2}^T] + \mathbb{E}[v_k y_{k-2}^T]$$
5. All four terms are strictly zero:
   - Term 1 is zero by orthogonality at step $k-2$.
   - Terms 2, 3, and 4 are zero because future process and measurement noise are independent of past innovations.
6. Thus $\mathbb{E}[y_k y_{k-2}^T] = 0$. $\blacksquare$

---

### Problem 6.19 (Solved Exercise): Determinant of Updated Covariance Matrix
**Problem Statement:** Prove that $\det(P_{k|k}) = \det(P_{k|k-1}) \frac{\det(R_k)}{\det(S_k)}$.

**Step-by-Step Solution:**
1. Using the matrix determinant lemma and Schur complements on the block matrix:
   $$\mathcal{M} = \begin{bmatrix} P_{k|k-1} & P_{k|k-1} H_k^T \\ H_k P_{k|k-1} & S_k \end{bmatrix}$$
2. The Schur complement of $S_k$ is:
   $$\mathcal{M} / S_k = P_{k|k-1} - P_{k|k-1} H_k^T S_k^{-1} H_k P_{k|k-1} = P_{k|k}$$
   Thus: $\det(\mathcal{M}) = \det(S_k) \det(P_{k|k})$.
3. The Schur complement of $P_{k|k-1}$ is:
   $$\mathcal{M} / P_{k|k-1} = S_k - H_k P_{k|k-1} P_{k|k-1}^{-1} P_{k|k-1} H_k^T = S_k - H_k P_{k|k-1} H_k^T = R_k$$
   Thus: $\det(\mathcal{M}) = \det(P_{k|k-1}) \det(R_k)$.
4. Equating the two determinant expressions:
   $$\det(S_k) \det(P_{k|k}) = \det(P_{k|k-1}) \det(R_k)$$
   $$\det(P_{k|k}) = \det(P_{k|k-1}) \frac{\det(R_k)}{\det(S_k)} \quad \blacksquare$$

---

### Problem 6.20 (Solved Exercise): Entropy Reduction under Optimal Measurement Update
**Problem Statement:** Using the determinant relation from Problem 6.19, compute the exact reduction in differential entropy $\Delta h = h(x_k | Z_{1:k-1}) - h(x_k | Z_{1:k})$.

**Step-by-Step Solution:**
1. For Gaussian state distributions:
   $$h(x_k | Z_{1:k-1}) = \frac{1}{2} \ln\left((2\pi e)^n \det(P_{k|k-1})\right)$$
   $$h(x_k | Z_{1:k}) = \frac{1}{2} \ln\left((2\pi e)^n \det(P_{k|k})\right)$$
2. Entropy difference:
   $$\Delta h = \frac{1}{2} \ln\left( \frac{\det(P_{k|k-1})}{\det(P_{k|k})} \right)$$
3. Substituting the determinant formula from Problem 6.19:
   $$\frac{\det(P_{k|k-1})}{\det(P_{k|k})} = \frac{\det(S_k)}{\det(R_k)}$$
4. Therefore:
   $$\Delta h = \frac{1}{2} \ln\left(\frac{\det(S_k)}{\det(R_k)}\right) = \frac{1}{2} \ln\det(I_m + R_k^{-1} H_k P_{k|k-1} H_k^T) \ge 0$$
   This equals the mutual information $I(x_k; z_k | Z_{1:k-1})$, proving that an optimal Kalman update always extracts non-negative information from sensors. $\blacksquare$
