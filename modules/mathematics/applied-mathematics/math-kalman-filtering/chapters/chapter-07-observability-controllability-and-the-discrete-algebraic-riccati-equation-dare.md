# Chapter 7: Observability, Controllability, and the Discrete Algebraic Riccati Equation (DARE)

## 7.1 Introduction: Long-Term Convergence and Structural Stability

A real-time robotics state estimator must run continuously for minutes, hours, or days without numerical divergence, runaway covariance growth, or catastrophic loss of tracking. Will the estimation covariance matrix $P_k$ remain bounded as $k \to \infty$? Does $P_k$ converge to a unique, stable steady-state matrix $P_\infty$, or does it depend perpetually on the initialization $P_0$?

The answers to these foundational questions lie in the structural properties of the dynamic system: **observability** and **controllability** (detectability and stabilizability). If a physical state (such as an IMU gyroscope bias or wheel slip) is mathematically unobservable from the sensor suite, its variance will accumulate unbounded growth driven by process noise. Conversely, if the system is observable and noise-controllable, the Kalman Filter behaves as an exponentially stable linear dynamical system whose steady-state covariance satisfies the **Discrete Algebraic Riccati Equation (DARE)**.

In this chapter, we develop the rigorous theory of observability and detectability, derive the Kalman rank and Popov-Belevitch-Hautus (PBH) tests, establish the existence and uniqueness theorems for the DARE, solve the algebraic Riccati equation in closed form for 2nd-order kinematic systems, and master numerical solvers across 20 comprehensive problems.

---

## 7.2 Observability and the Kalman Observability Matrix

A dynamic system is **observable** if the initial state $x_0$ can be uniquely determined from a finite sequence of noise-free observations $\{z_0, z_1, \dots, z_{N-1}\}$ and known control inputs $\{u_0, \dots, u_{N-2}\}$.

### 7.2.1 Algebraic Formulation
Consider the deterministic unforced discrete system:
$$x_k = F x_{k-1} = F^k x_0$$
$$z_k = H x_k = H F^k x_0$$

Stacking the observations from $k = 0$ to $k = n-1$ into a single vector $Z \in \mathbb{R}^{mn}$:
$$Z = \begin{bmatrix} z_0 \\ z_1 \\ z_2 \\ \vdots \\ z_{n-1} \end{bmatrix} = \begin{bmatrix} H \\ H F \\ H F^2 \\ \vdots \\ H F^{n-1} \end{bmatrix} x_0 = \mathcal{O} \, x_0$$

where $\mathcal{O} \in \mathbb{R}^{mn \times n}$ is the **Kalman Observability Matrix**:
$$\mathcal{O} = \begin{bmatrix} H \\ H F \\ H F^2 \\ \vdots \\ H F^{n-1} \end{bmatrix}$$

### 7.2.2 The Kalman Rank Condition
For $x_0$ to be uniquely solvable from $Z$, the linear mapping $\mathcal{O} x_0 = Z$ must have a trivial nullspace:
$$\operatorname{ker}(\mathcal{O}) = \{x \in \mathbb{R}^n : \mathcal{O} x = 0\} = \{0\}$$

By the rank-nullity theorem, this is equivalent to the **Kalman Observability Rank Condition**:
$$\operatorname{rank}(\mathcal{O}) = n$$

If $\operatorname{rank}(\mathcal{O}) < n$, the system is **unobservable**. Any initial state vector in the nullspace $x_0 \in \operatorname{ker}(\mathcal{O})$ produces identically zero sensor outputs for all time ($z_k = 0 \, \forall k$). Such states are invisible to the sensor suite.

By the Cayley-Hamilton theorem, higher powers $F^k$ for $k \ge n$ are linear combinations of $\{I, F, \dots, F^{n-1}\}$. Hence, extending the observability matrix beyond $n$ blocks adds no new linearly independent rows.

---

## 7.3 Detectability and the PBH Rank Test

In physical systems, complete observability is sometimes impossible. For example, in visual-inertial odometry without GPS or magnetometer, the absolute global yaw angle and absolute global translation $(x, y, z)$ are mathematically unobservable. Does an unobservable state prevent the Kalman filter from converging?

The critical concept is **detectability**:
- An unobservable mode with continuous eigenvalue $\lambda$ is **stable** if $|\lambda| < 1$ (discrete-time) or $\operatorname{Re}(\lambda) < 0$ (continuous-time).
- A system is **detectable** if all its unobservable modes are asymptotically stable.

If all unobservable states decay to zero on their own (such as viscous damping or stable thermal modes), the estimation error in those states will asymptotically vanish even without sensor measurements.

### 7.3.1 The Popov-Belevitch-Hautus (PBH) Observability Test
The PBH test evaluates observability eigenmode-by-eigenmode without computing matrix powers:

> **Theorem (PBH Observability Test):** The pair $(F, H)$ is observable if and only if:
> $$\operatorname{rank}\begin{bmatrix} \lambda I_n - F \\ H \end{bmatrix} = n \quad \forall \, \lambda \in \mathbb{C}$$
> It suffices to test only the eigenvalues $\lambda$ of $F$.

> **Theorem (PBH Detectability Test):** The pair $(F, H)$ is detectable if and only if:
> $$\operatorname{rank}\begin{bmatrix} \lambda I_n - F \\ H \end{bmatrix} = n \quad \forall \, \lambda \in \mathbb{C} \text{ such that } |\lambda| \ge 1$$
> Only unstable and marginally stable modes must be observable.

---

## 7.4 Controllability and Stabilizability of Process Noise

A dual property governs process noise excitation. If the process noise covariance is factorized as $Q = G_w Q_w G_w^T$ where $Q_w \in \mathbb{S}_{++}^p$:
- The pair $(F, G_w)$ is **controllable** if process noise excites every state dimension:
  $$\operatorname{rank}(\mathcal{C}) = \operatorname{rank}\begin{bmatrix} G_w & F G_w & F^2 G_w & \dots & F^{n-1} G_w \end{bmatrix} = n$$
- The pair $(F, G_w)$ is **stabilizable** if all uncontrollable modes are asymptotically stable ($|\lambda| < 1$).

If an unstable mode is not excited by process noise, its true variance does not grow; however, to guarantee that the Kalman filter does not experience covariance collapse ($P \to 0$ in an unexcited subspace), stabilizability is required.

---

## 7.5 The Discrete Algebraic Riccati Equation (DARE)

When the system matrices $(F, H, Q, R)$ are time-invariant, the recursive covariance equations:
$$P_{k|k-1} = F P_{k-1|k-1} F^T + Q$$
$$P_{k|k} = P_{k|k-1} - P_{k|k-1} H^T (H P_{k|k-1} H^T + R)^{-1} H P_{k|k-1}$$
can be combined into a single recursion for the prior covariance $P_{k+1|k}$:

$$P_{k+1|k} = F \left[ P_{k|k-1} - P_{k|k-1} H^T (H P_{k|k-1} H^T + R)^{-1} H P_{k|k-1} \right] F^T + Q$$

As $k \to \infty$, the sequence of covariance matrices $P_{k+1|k}$ converges to a stationary matrix $P_\infty \in \mathbb{S}_+^n$ satisfying the **Discrete Algebraic Riccati Equation (DARE)**:

$$P_\infty = F P_\infty F^T + Q - F P_\infty H^T (H P_\infty H^T + R)^{-1} H P_\infty F^T$$

The corresponding steady-state Kalman Gain is:
$$K_\infty = P_\infty H^T (H P_\infty H^T + R)^{-1}$$

The closed-loop estimation error dynamics are governed by:
$$\tilde{x}_{k+1|k} = F (I - K_\infty H) \tilde{x}_{k|k-1} + w_k - F K_\infty v_k$$
Let $F_{\text{cl}} = F(I - K_\infty H)$ be the closed-loop error transition matrix.

### 7.5.1 The Fundamental Convergence Theorem
> **Theorem (Kalman-Bucy Convergence Theorem):** If:
> 1. The pair $(F, H)$ is **detectable**, and
> 2. The pair $(F, Q^{1/2})$ is **stabilizable** (where $Q = Q^{1/2} (Q^{1/2})^T$),
>
> Then:
> - There exists a **unique symmetric positive semi-definite solution** $P_\infty \ge 0$ to the DARE.
> - For any initial covariance $P_0 \ge 0$, $\lim_{k \to \infty} P_{k|k-1} = P_\infty$.
> - The steady-state closed-loop matrix $F_{\text{cl}} = F(I - K_\infty H)$ is strictly asymptotically stable: all eigenvalues lie strictly inside the open unit disk in the complex plane ($|\lambda_i(F_{\text{cl}})| < 1$).

If in addition $(F, Q^{1/2})$ is controllable, $P_\infty$ is strictly positive definite ($P_\infty > 0$).

---

## 7.6 Mathematical Problem Set

### Problem 7.1 (Worked Example): Observability Rank Test of 2D Kinematics
**Problem Statement:** A 2D kinematic robot has state $x = [p, v]^T$ and transition matrix $F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$ with $\Delta t = 0.1\text{ s}$.
1. Evaluate the observability matrix $\mathcal{O}_p$ when only position is measured ($H_p = [1, 0]$).
2. Evaluate the observability matrix $\mathcal{O}_v$ when only velocity is measured ($H_v = [0, 1]$).
Determine which sensor configuration makes the system fully observable.

**Given Data:**
- $n = 2, \Delta t = 0.1\text{ s}$.
- $F = \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix}$.
- $H_p = [1, 0]$, $H_v = [0, 1]$.

**Step-by-Step Derivation:**
1. Position sensor configuration ($H_p = [1, 0]$):
   $$H_p F = [1, 0] \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix} = [1, 0.1]$$
   $$\mathcal{O}_p = \begin{bmatrix} H_p \\ H_p F \end{bmatrix} = \begin{bmatrix} 1.0 & 0.0 \\ 1.0 & 0.1 \end{bmatrix}$$
   Determinant:
   $$\det(\mathcal{O}_p) = (1.0)(0.1) - (0.0)(1.0) = 0.1 \neq 0$$
   $\operatorname{rank}(\mathcal{O}_p) = 2 = n$. The system is **fully observable** from position measurements alone.
2. Velocity sensor configuration ($H_v = [0, 1]$):
   $$H_v F = [0, 1] \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix} = [0, 1.0]$$
   $$\mathcal{O}_v = \begin{bmatrix} H_v \\ H_v F \end{bmatrix} = \begin{bmatrix} 0.0 & 1.0 \\ 0.0 & 1.0 \end{bmatrix}$$
   Determinant:
   $$\det(\mathcal{O}_v) = (0.0)(1.0) - (1.0)(0.0) = 0$$
   $\operatorname{rank}(\mathcal{O}_v) = 1 < 2$. The system is **unobservable** from velocity measurements alone.
3. Physical Interpretation:
   Observing position over two consecutive steps enables velocity estimation via $\hat{v} \approx \frac{z_1 - z_0}{\Delta t}$.
   Observing velocity over time reveals nothing about absolute position $p_0$, because shifting position by an arbitrary constant $c$ leaves velocity unchanged.

**Final Result:**
$$\operatorname{rank}(\mathcal{O}_p) = 2\text{ (Observable)}, \quad \operatorname{rank}(\mathcal{O}_v) = 1\text{ (Unobservable)}$$

---

### Problem 7.2 (Worked Example): PBH Detectability Analysis for Velocity-Only Sensing
**Problem Statement:** For the unobservable velocity-sensing system from Problem 7.1 ($H_v = [0, 1]$), determine whether the system is detectable using the PBH test.

**Step-by-Step Derivation:**
1. Eigenvalues of $F = \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix}$:
   $$\det(\lambda I - F) = (\lambda - 1)^2 = 0 \implies \lambda_1 = \lambda_2 = 1.0$$
   The eigenvalue is $\lambda = 1.0$, which lies on the unit circle ($|\lambda| = 1 \ge 1$).
2. Form the PBH matrix at $\lambda = 1.0$:
   $$\mathcal{M}_{\text{PBH}} = \begin{bmatrix} \lambda I_2 - F \\ H_v \end{bmatrix} = \begin{bmatrix} 0 & -0.1 \\ 0 & 0 \\ 0 & 1 \end{bmatrix}$$
3. Evaluate the rank of $\mathcal{M}_{\text{PBH}}$:
   Notice that the entire first column is identically zero: $\begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$.
   The second column is $\begin{bmatrix} -0.1 \\ 0 \\ 1 \end{bmatrix} \neq 0$.
   Therefore:
   $$\operatorname{rank}(\mathcal{M}_{\text{PBH}}) = 1 < 2$$
4. Detectability evaluation:
   Because the unobservable eigenvalue $\lambda = 1.0$ is marginally unstable ($|\lambda| \ge 1$) and fails the PBH rank condition, the system is **not detectable**.
   *Consequence:* In a Kalman filter with velocity-only sensing, the position estimation variance $P_{11}$ will grow linearly towards infinity ($P_{11} \to \infty$ as $k \to \infty$).

**Final Result:**
$$\operatorname{rank}(\mathcal{M}_{\text{PBH}}) = 1 < 2 \implies \mathbf{Not\ Detectable\ (Position\ covariance\ diverges)}$$

---

### Problem 7.3 (Worked Example): Analytical DARE Solution for 1D State
**Problem Statement:** A 1D scalar system has $x_k = a x_{k-1} + w_k$ and $z_k = c x_k + v_k$ with $a = 1.0, c = 1.0, q = 3.0, r = 1.0$.
1. Formulate the scalar DARE for the steady-state prior variance $p_\infty$.
2. Solve the quadratic equation analytically for $p_\infty$.
3. Compute the steady-state Kalman gain $K_\infty$ and the closed-loop pole $\lambda_{\text{cl}}$.

**Step-by-Step Derivation:**
1. Scalar DARE formula:
   $$p_\infty = a^2 p_\infty + q - \frac{a^2 c^2 p_\infty^2}{c^2 p_\infty + r}$$
   Substitute $a = 1, c = 1, q = 3, r = 1$:
   $$p_\infty = p_\infty + 3 - \frac{p_\infty^2}{p_\infty + 1}$$
2. Subtract $p_\infty$ from both sides:
   $$0 = 3 - \frac{p_\infty^2}{p_\infty + 1} \implies \frac{p_\infty^2}{p_\infty + 1} = 3$$
3. Cross-multiplying:
   $$p_\infty^2 = 3 (p_\infty + 1) = 3 p_\infty + 3$$
   $$p_\infty^2 - 3 p_\infty - 3 = 0$$
4. Solving the quadratic equation via the quadratic formula:
   $$p_\infty = \frac{3 \pm \sqrt{(-3)^2 - 4(1)(-3)}}{2} = \frac{3 \pm \sqrt{9 + 12}}{2} = \frac{3 \pm \sqrt{21}}{2}$$
   Since variance must be positive semi-definite ($p_\infty \ge 0$), we take the positive root ($\sqrt{21} \approx 4.582576$):
   $$p_\infty = \frac{3 + 4.582576}{2} = \frac{7.582576}{2} \approx 3.791288$$
5. Steady-state Kalman gain:
   $$K_\infty = \frac{c p_\infty}{c^2 p_\infty + r} = \frac{3.791288}{3.791288 + 1.0} = \frac{3.791288}{4.791288} \approx 0.791288$$
6. Closed-loop pole:
   $$\lambda_{\text{cl}} = a (1 - K_\infty c) = 1.0 \times (1 - 0.791288) = 0.208712$$
   Notice that $|\lambda_{\text{cl}}| = 0.2087 < 1.0$. The open-loop marginally stable pole at $\lambda = 1.0$ was shifted deep inside the unit circle to $0.2087$.

**Final Result:**
$$p_\infty = \frac{3 + \sqrt{21}}{2} \approx 3.7913, \quad K_\infty \approx 0.7913, \quad \lambda_{\text{cl}} \approx 0.2087$$

---

### Problem 7.4 (Worked Example): Fixed-Point Iteration Convergence of DARE
**Problem Statement:** For the system in Problem 7.3 ($a=1, c=1, q=3, r=1$), simulate the Riccati recursion starting from an initial guess $p_0 = 100.0$. Show that within 5 iterations, $p_k$ converges to within $0.001$ of $p_\infty \approx 3.791288$.

**Step-by-Step Derivation:**
1. Recursive formula:
   $$p_{k+1} = p_k + 3 - \frac{p_k^2}{p_k + 1} = 3 + \frac{p_k(p_k + 1) - p_k^2}{p_k + 1} = 3 + \frac{p_k}{p_k + 1}$$
2. Iteration values:
   - $k = 0$: $p_0 = 100.0$
   - $k = 1$: $p_1 = 3 + \frac{100}{101} = 3 + 0.990099 = 3.990099$
     *(In just one single step, variance collapsed from 100 to 3.99!)*
   - $k = 2$: $p_2 = 3 + \frac{3.990099}{4.990099} = 3 + 0.799603 = 3.799603$
   - $k = 3$: $p_3 = 3 + \frac{3.799603}{4.799603} = 3 + 0.791650 = 3.791650$
   - $k = 4$: $p_4 = 3 + \frac{3.791650}{4.791650} = 3 + 0.791303 = 3.791303$
   - $k = 5$: $p_5 = 3 + \frac{3.791303}{4.791303} = 3 + 0.791288 = 3.791288$
3. Error:
   $$|p_5 - p_\infty| = |3.791288 - 3.791288| < 10^{-6}$$

**Final Result:**
$$p_0 = 100.000, \quad p_1 = 3.990, \quad p_2 = 3.800, \quad p_3 = 3.7916, \quad p_5 = 3.791288$$
Convergence is exponentially rapid with contraction factor $\approx \lambda_{\text{cl}}^2 \approx (0.2087)^2 \approx 0.0435$.

---

### Problem 7.5 (Worked Example): Analytical 2D DARE for Continuous Kinematics
**Problem Statement:** Consider a continuous 1D kinematic tracking system $\dot{p} = v, \dot{v} = w_c$ with position measurement $z = p + v_c$. Continuous parameters are $Q_c = \tilde{q}$ and $R_c = \tilde{r}$. The continuous algebraic Riccati equation (CARE) is:
$$A P_\infty + P_\infty A^T + G Q_c G^T - P_\infty C^T R_c^{-1} C P_\infty = 0$$
where $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}, C = \begin{bmatrix} 1 & 0 \end{bmatrix}$.
Derive the exact closed-form analytical expressions for the steady-state continuous covariance elements $P_{11}, P_{12}, P_{22}$.

**Step-by-Step Derivation:**
1. Let $P_\infty = \begin{bmatrix} P_{11} & P_{12} \\ P_{12} & P_{22} \end{bmatrix}$.
2. Compute $A P_\infty + P_\infty A^T$:
   $$A P_\infty = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} P_{11} & P_{12} \\ P_{12} & P_{22} \end{bmatrix} = \begin{bmatrix} P_{12} & P_{22} \\ 0 & 0 \end{bmatrix}$$
   $$A P_\infty + P_\infty A^T = \begin{bmatrix} 2 P_{12} & P_{22} \\ P_{22} & 0 \end{bmatrix}$$
3. Noise injection term:
   $$G Q_c G^T = \begin{bmatrix} 0 \\ 1 \end{bmatrix} \tilde{q} \begin{bmatrix} 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & \tilde{q} \end{bmatrix}$$
4. Measurement update term:
   $$C^T R_c^{-1} C = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \frac{1}{\tilde{r}} \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 1/\tilde{r} & 0 \\ 0 & 0 \end{bmatrix}$$
   $$P_\infty C^T R_c^{-1} C P_\infty = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11} \\ P_{12} \end{bmatrix} \begin{bmatrix} P_{11} & P_{12} \end{bmatrix} = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11}^2 & P_{11} P_{12} \\ P_{11} P_{12} & P_{12}^2 \end{bmatrix}$$
5. Assembling the three algebraic equations:
   - $(1, 1)$ element: $2 P_{12} - \frac{1}{\tilde{r}} P_{11}^2 = 0 \implies P_{12} = \frac{P_{11}^2}{2 \tilde{r}}$
   - $(2, 2)$ element: $\tilde{q} - \frac{1}{\tilde{r}} P_{12}^2 = 0 \implies P_{12}^2 = \tilde{q} \tilde{r} \implies P_{12} = \sqrt{\tilde{q} \tilde{r}}$
   - $(1, 2)$ element: $P_{22} - \frac{1}{\tilde{r}} P_{11} P_{12} = 0 \implies P_{22} = \frac{P_{11} P_{12}}{\tilde{r}}$
6. Solving for $P_{11}$:
   $$P_{12} = \sqrt{\tilde{q} \tilde{r}}$$
   From $(1, 1)$: $P_{11}^2 = 2 \tilde{r} P_{12} = 2 \tilde{r} \sqrt{\tilde{q} \tilde{r}} = 2 \tilde{q}^{1/2} \tilde{r}^{3/2}$
   $$P_{11} = \sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}$$
7. Solving for $P_{22}$:
   $$P_{22} = \frac{P_{11} P_{12}}{\tilde{r}} = \frac{(\sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}) (\tilde{q}^{1/2} \tilde{r}^{1/2})}{\tilde{r}} = \sqrt{2} \tilde{q}^{3/4} \tilde{r}^{1/4}$$
8. Continuous Kalman Gain:
   $$K = P_\infty C^T R_c^{-1} = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11} \\ P_{12} \end{bmatrix} = \begin{bmatrix} \sqrt{2} (\tilde{q}/\tilde{r})^{1/4} \\ (\tilde{q}/\tilde{r})^{1/2} \end{bmatrix}$$

**Final Result:**
$$P_{11} = \sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}, \quad P_{12} = \sqrt{\tilde{q} \tilde{r}}, \quad P_{22} = \sqrt{2} \tilde{q}^{3/4} \tilde{r}^{1/4}$$
$$K = \begin{bmatrix} \sqrt{2} \omega_0 \\ \omega_0^2 \end{bmatrix} \quad \text{where } \omega_0 = (\tilde{q}/\tilde{r})^{1/4}$$
*Physical Remark:* The closed-loop estimator poles form a critically damped 2nd-order Butterworth filter with natural frequency $\omega_0 = (\tilde{q}/\tilde{r})^{1/4}$ and damping ratio $\zeta = 1/\sqrt{2} \approx 0.707$.

---

### Problem 7.6 (Worked Example): Symplectic Matrix Formulation of DARE
**Problem Statement:** Formulate the $2n \times 2n$ symplectic pencil for solving the discrete algebraic Riccati equation:
$$\mathcal{Z} = \begin{bmatrix} F + Q F^{-T} H^T R^{-1} H & -Q F^{-T} \\ -F^{-T} H^T R^{-1} H & F^{-T} \end{bmatrix}$$
Show that the eigenvalues of $\mathcal{Z}$ occur in reciprocal pairs $(\lambda, 1/\lambda)$.

**Step-by-Step Derivation:**
1. A matrix $\mathcal{Z} \in \mathbb{R}^{2n \times 2n}$ is symplectic if:
   $$\mathcal{Z}^T J \mathcal{Z} = J \quad \text{where } J = \begin{bmatrix} 0 & I_n \\ -I_n & 0 \end{bmatrix}$$
2. Consider the characteristic polynomial:
   $$\det(\lambda I_{2n} - \mathcal{Z}) = 0$$
   Using the symplectic property: $\mathcal{Z}^{-1} = -J \mathcal{Z}^T J$.
   $$\det(\lambda I - \mathcal{Z}) = \det\left(\lambda I - (-J \mathcal{Z}^T J)\right) = \det\left(-J (\lambda I - \mathcal{Z}^T) J\right) = \det(\lambda I - \mathcal{Z}^T) = \det(\lambda I - \mathcal{Z})$$
3. Inverting the eigenvalue relation:
   $$\det\left(\lambda^{-1} I - \mathcal{Z}\right) = \det\left(\lambda^{-1} \mathcal{Z} (\mathcal{Z}^{-1} - \lambda I)\right) = \lambda^{-2n} \det(\mathcal{Z}) \det(\mathcal{Z}^{-1} - \lambda I) = \lambda^{-2n} \det(\mathcal{Z} - \lambda I)$$
4. Therefore, if $\lambda$ is an eigenvalue of $\mathcal{Z}$, then $1/\lambda$ must also be an eigenvalue with the exact same multiplicity.
5. In stable Kalman filtering, exactly $n$ eigenvalues lie strictly inside the unit circle ($|\lambda_i| < 1$), and exactly $n$ eigenvalues lie strictly outside ($|\lambda_i| > 1$). The stable invariant subspace spanned by the $n$ stable eigenvectors yields the unique positive semi-definite DARE solution $P_\infty$. $\blacksquare$

---

### Problem 7.7 (Worked Example): Unobservable Subspace Projection
**Problem Statement:** A 3D system has $F = \operatorname{diag}(0.5, 0.8, 1.0)$ and $H = [1, 1, 0]$.
1. Compute the observability matrix $\mathcal{O}$.
2. Determine the unobservable subspace $\operatorname{ker}(\mathcal{O})$ and find an orthonormal basis for it.

**Step-by-Step Derivation:**
1. Observability matrix rows:
   $$H = [1, 1, 0]$$
   $$H F = [1, 1, 0] \operatorname{diag}(0.5, 0.8, 1.0) = [0.5, 0.8, 0]$$
   $$H F^2 = [1, 1, 0] \operatorname{diag}(0.25, 0.64, 1.0) = [0.25, 0.64, 0]$$
   $$\mathcal{O} = \begin{bmatrix} 1.0 & 1.0 & 0.0 \\ 0.5 & 0.8 & 0.0 \\ 0.25 & 0.64 & 0.0 \end{bmatrix}$$
2. Nullspace of $\mathcal{O}$:
   Notice that column 3 of $\mathcal{O}$ is identically zero: $\begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$.
   The upper $2 \times 2$ submatrix has determinant $(1.0)(0.8) - (1.0)(0.5) = 0.3 \neq 0$.
   Hence, the first two columns are linearly independent.
   The nullspace satisfies $\mathcal{O} x = 0$:
   $$\begin{bmatrix} 1.0 & 1.0 \\ 0.5 & 0.8 \\ 0.25 & 0.64 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} + x_3 \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} \implies x_1 = 0, x_2 = 0, x_3 \in \mathbb{R}$$
3. Orthonormal basis for unobservable subspace:
   $$\operatorname{ker}(\mathcal{O}) = \operatorname{span}\left( \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \right)$$
4. Detectability check:
   The unobservable mode corresponds to eigenvalue $\lambda_3 = 1.0$.
   Since $|\lambda_3| = 1.0 \ge 1.0$, the system is **not detectable**.

**Final Result:**
$$\operatorname{ker}(\mathcal{O}) = \operatorname{span}\left([0, 0, 1]^T\right), \quad \operatorname{rank}(\mathcal{O}) = 2 < 3\text{ (Not Detectable)}$$

---

### Problem 7.8 (Worked Example): Stabilization of an Unstable Plant
**Problem Statement:** An inverted robotic pendulum on a cart has an unstable discrete plant pole $a = 1.2 > 1.0$. Process noise is $q = 1.0$, measurement sensitivity is $c = 1.0$, and measurement noise is $r = 1.0$.
1. Solve for the steady-state prior variance $p_\infty$.
2. Compute the steady-state gain $K_\infty$ and the closed-loop pole $\lambda_{\text{cl}}$.
3. Verify that the estimator is strictly stable despite the unstable physical plant.

**Step-by-Step Derivation:**
1. DARE for scalar state:
   $$p_\infty = a^2 p_\infty + q - \frac{a^2 c^2 p_\infty^2}{c^2 p_\infty + r} = \frac{a^2 p_\infty r + q(c^2 p_\infty + r)}{c^2 p_\infty + r}$$
   Substitute $a = 1.2 \implies a^2 = 1.44$, $c = 1, q = 1, r = 1$:
   $$p_\infty = \frac{1.44 p_\infty (1) + 1(p_\infty + 1)}{p_\infty + 1} = \frac{2.44 p_\infty + 1}{p_\infty + 1}$$
2. Multiplying through by $(p_\infty + 1)$:
   $$p_\infty (p_\infty + 1) = 2.44 p_\infty + 1 \implies p_\infty^2 + p_\infty = 2.44 p_\infty + 1$$
   $$p_\infty^2 - 1.44 p_\infty - 1 = 0$$
3. Quadratic formula:
   $$p_\infty = \frac{1.44 \pm \sqrt{(-1.44)^2 - 4(1)(-1)}}{2} = \frac{1.44 \pm \sqrt{2.0736 + 4}}{2} = \frac{1.44 \pm \sqrt{6.0736}}{2}$$
   $$\sqrt{6.0736} \approx 2.464467$$
   $$p_\infty = \frac{1.44 + 2.464467}{2} = \frac{3.904467}{2} \approx 1.952234$$
4. Steady-state Kalman gain:
   $$K_\infty = \frac{p_\infty}{p_\infty + r} = \frac{1.952234}{1.952234 + 1.0} = \frac{1.952234}{2.952234} \approx 0.661273$$
5. Closed-loop pole:
   $$\lambda_{\text{cl}} = a (1 - K_\infty c) = 1.2 \times (1 - 0.661273) = 1.2 \times 0.338727 \approx 0.406472$$
6. Stability check:
   $$|\lambda_{\text{cl}}| = 0.4065 < 1.0$$
   The unstable plant pole ($a = 1.2$) has been successfully shifted to a stable pole at $0.4065$!

**Final Result:**
$$p_\infty \approx 1.9522, \quad K_\infty \approx 0.6613, \quad \lambda_{\text{cl}} \approx 0.4065\text{ (Strictly Stable)}$$

---

### Problem 7.9 (Worked Example): Covariance Windup under Zero Measurement Updates
**Problem Statement:** An autonomous rover loses GPS tracking for $N$ consecutive time steps while running a Constant Velocity model ($F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}, Q = \tilde{q} \begin{bmatrix} \Delta t^3/3 & \Delta t^2/2 \\ \Delta t^2/2 & \Delta t \end{bmatrix}$). Derive the analytical formula for position variance $P_{11}(k)$ as a function of elapsed time $T = k \Delta t$ when starting from initial covariance $P_0 = 0$.

**Step-by-Step Derivation:**
1. Under zero measurements ($H = 0$ or $R \to \infty$), the filter runs open-loop:
   $$P_k = F P_{k-1} F^T + Q_k$$
   With $P_0 = 0$, $P_k = \sum_{j=0}^{k-1} F^j Q (F^T)^j$.
2. In continuous time (Section 4.3), $P(t) = \int_0^t e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$.
   Here $e^{A \tau} G = \begin{bmatrix} \tau \\ 1 \end{bmatrix}$.
3. Position variance integrand:
   $$[e^{A \tau} G Q_c G^T e^{A^T \tau}]_{11} = \tilde{q} \tau^2$$
4. Integrating from $0$ to $T$:
   $$P_{11}(T) = \tilde{q} \int_0^T \tau^2 d\tau = \frac{1}{3} \tilde{q} T^3$$
5. Velocity variance:
   $$P_{22}(T) = \tilde{q} \int_0^T 1 \, d\tau = \tilde{q} T$$
   Position uncertainty accumulates cubically: $\sigma_p(T) = \sqrt{\frac{1}{3} \tilde{q}} \, T^{3/2}$.

**Final Result:**
$$P_{11}(T) = \frac{1}{3} \tilde{q} T^3 \implies \sigma_p(T) \propto T^{3/2}$$

---

### Problem 7.10 (Worked Example): Numerical DARE Doubling Algorithm Specification
**Problem Statement:** Specify the structure of the Anderson-Moore Matrix Sign / Doubling Algorithm for solving the DARE in $\mathcal{O}(\log_2(\text{iterations}))$ convergence.

**Step-by-Step Derivation:**
1. Initialization:
   $$A_0 = F(I + R^{-1} H P_0 H^T)^{-1}$$
   $$P_0 = Q$$
   $$G_0 = F H^T (H P_0 H^T + R)^{-1} H F^T$$
2. Doubling recursion (for $k = 0, 1, 2, \dots$):
   $$A_{k+1} = A_k (I + G_k P_k)^{-1} A_k$$
   $$P_{k+1} = P_k + A_k (I + G_k P_k)^{-1} P_k A_k^T$$
   $$G_{k+1} = G_k + A_k^T G_k (I + P_k G_k)^{-1} A_k$$
3. Termination condition:
   $$\|P_{k+1} - P_k\|_\infty < \epsilon \quad (\text{typically } 10^{-12})$$
4. Convergence rate:
   Each iteration squares the effective time horizon: $2^k$ steps.
   Convergence to double precision typically occurs in just $4$ to $6$ iterations.

**Final Result:**
Doubling algorithm converges quadratically: $\mathcal{O}(\log_2(1/\epsilon))$.

---

### Problem 7.11 (Solved Exercise): Observability of a 3-State Damped Oscillator
**Problem Statement:** A continuous oscillator has $\ddot{x} + 2\zeta \omega_n \dot{x} + \omega_n^2 x = 0$ with an unknown constant sensor bias $b$ ($\dot{b} = 0$). State is $[x, \dot{x}, b]^T$, with measurement $z = x + b$. Prove that the system is unobservable.

**Step-by-Step Solution:**
1. Continuous matrices:
   $$A = \begin{bmatrix} 0 & 1 & 0 \\ -\omega_n^2 & -2\zeta\omega_n & 0 \\ 0 & 0 & 0 \end{bmatrix}, \quad C = \begin{bmatrix} 1 & 0 & 1 \end{bmatrix}$$
2. Observability matrix rows:
   $$C = \begin{bmatrix} 1 & 0 & 1 \end{bmatrix}$$
   $$C A = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}$$
   $$C A^2 = \begin{bmatrix} -\omega_n^2 & -2\zeta\omega_n & 0 \end{bmatrix}$$
   $$\mathcal{O} = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 0 \\ -\omega_n^2 & -2\zeta\omega_n & 0 \end{bmatrix}$$
3. Determinant of $\mathcal{O}$:
   Expand along third column:
   $$\det(\mathcal{O}) = 1 \cdot \det\begin{bmatrix} 0 & 1 \\ -\omega_n^2 & -2\zeta\omega_n \end{bmatrix} = 1 \cdot (0 - (-\omega_n^2)) = \omega_n^2 \neq 0$$
   Wait! $\det(\mathcal{O}) = \omega_n^2 \neq 0$!
   The rank is 3! Thus, the system is **observable**!
   *Physical Reason:* Because $x(t)$ oscillates while $b$ is static, the Kalman filter can separate the alternating AC signal from the constant DC offset. Unobservability only occurs if $\omega_n = 0$.

**Final Answer:**
$$\det(\mathcal{O}) = \omega_n^2 \implies \operatorname{rank}(\mathcal{O}) = 3\text{ (Fully Observable for }\omega_n \neq 0)$$

---

### Problem 7.12 (Solved Exercise): Zero Noise Riccati Collapse
**Problem Statement:** For a 1D scalar system with $a = 1, c = 1, r = 1$, solve the DARE when process noise is identically zero ($q = 0$). Explain the physical implications.

**Step-by-Step Solution:**
1. DARE with $q = 0$:
   $$p_\infty = p_\infty + 0 - \frac{p_\infty^2}{p_\infty + 1} \implies \frac{p_\infty^2}{p_\infty + 1} = 0 \implies p_\infty = 0$$
2. Steady-state gain:
   $$K_\infty = \frac{p_\infty}{p_\infty + r} = \frac{0}{0 + 1} = 0$$
3. Closed-loop pole:
   $$\lambda_{\text{cl}} = a (1 - K_\infty c) = 1.0 (1 - 0) = 1.0$$
4. Physical Implication:
   When $q = 0$, the filter assumes the model is absolutely perfect. Over time, $P_k \to 0$ and $K_k \to 0$. The filter completely closes its eyes to future sensor measurements. If the true physical state ever changes, the filter will permanently diverge. Process noise $q > 0$ is essential to prevent filter death.

**Final Answer:**
$$p_\infty = 0, \quad K_\infty = 0\text{ (Filter permanently ignores sensors)}$$

---

### Problem 7.13 (Solved Exercise): Controllability Rank Test of Kinematic Noise
**Problem Statement:** For the 2D Constant Velocity model with $F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$, test the controllability of the discrete noise coupling matrix $G_d = \begin{bmatrix} \Delta t^2 / 2 \\ \Delta t \end{bmatrix}$.

**Step-by-Step Solution:**
1. Controllability matrix $\mathcal{C} = \begin{bmatrix} G_d & F G_d \end{bmatrix}$.
2. Compute $F G_d$:
   $$F G_d = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \Delta t^2 / 2 \\ \Delta t \end{bmatrix} = \begin{bmatrix} \frac{1}{2}\Delta t^2 + \Delta t^2 \\ \Delta t \end{bmatrix} = \begin{bmatrix} \frac{3}{2}\Delta t^2 \\ \Delta t \end{bmatrix}$$
3. Controllability matrix:
   $$\mathcal{C} = \begin{bmatrix} \frac{1}{2}\Delta t^2 & \frac{3}{2}\Delta t^2 \\ \Delta t & \Delta t \end{bmatrix}$$
4. Determinant:
   $$\det(\mathcal{C}) = \left(\frac{1}{2}\Delta t^2\right)(\Delta t) - \left(\frac{3}{2}\Delta t^2\right)(\Delta t) = \frac{1}{2}\Delta t^3 - \frac{3}{2}\Delta t^3 = -\Delta t^3 \neq 0$$
5. For any $\Delta t > 0$, $\det(\mathcal{C}) \neq 0 \implies \operatorname{rank}(\mathcal{C}) = 2$.
   The process noise excites all 2 degrees of freedom.

**Final Answer:**
$$\operatorname{rank}(\mathcal{C}) = 2\text{ (Fully Controllable)}$$

---

### Problem 7.14 (Solved Exercise): Closed-Loop Error Eigenvalues
**Problem Statement:** Prove that the closed-loop state matrix $F_{\text{cl}} = F(I - K H)$ has eigenvalues identical to $(I - K H) F$.

**Step-by-Step Solution:**
1. Recall the matrix determinant property for any two square matrices $A, B$:
   $$\det(\lambda I - A B) = \det(\lambda I - B A)$$
2. Set $A = F$ and $B = I - K H$:
   $$\det(\lambda I - F(I - K H)) = \det(\lambda I - (I - K H) F)$$
3. Since their characteristic polynomials are identically equal, their eigenvalues are identical. $\blacksquare$

---

### Problem 7.15 (Solved Exercise): Effect of Sampling Rate on Steady-State Gain
**Problem Statement:** In the continuous 2D system of Problem 7.5, how does the steady-state position gain $K_p$ scale with the ratio $\tilde{q} / \tilde{r}$? If sensor noise variance $\tilde{r}$ is reduced by a factor of 16, by what factor does $K_p$ increase?

**Step-by-Step Solution:**
1. From Problem 7.5:
   $$K_p = \sqrt{2} \left(\frac{\tilde{q}}{\tilde{r}}\right)^{1/4}$$
2. The gain scales with the fourth root of the signal-to-noise ratio:
   $$K_p \propto \tilde{r}^{-1/4}$$
3. If $\tilde{r}$ is divided by 16 ($\tilde{r}_{\text{new}} = \tilde{r} / 16$):
   $$\left(\frac{\tilde{r}}{16}\right)^{-1/4} = (16)^{1/4} \tilde{r}^{-1/4} = 2 \tilde{r}^{-1/4}$$
4. The steady-state gain doubles ($2\times$).

**Final Answer:**
$$K_p\text{ increases by a factor of }2.0$$

---

### Problem 7.16 (Solved Exercise): Discrete Algebraic Riccati Equation for Posterior Covariance
**Problem Statement:** Show that the posterior steady-state covariance $P_\infty^+ = (I - K_\infty H) P_\infty$ satisfies the alternative DARE:
$$P_\infty^+ = (I - P_\infty^+ H^T R^{-1} H) (F P_\infty^+ F^T + Q)$$

**Step-by-Step Solution:**
1. In information form (Problem 5.15):
   $$(P_{k|k})^{-1} = (P_{k|k-1})^{-1} + H^T R^{-1} H$$
2. Since $P_{k|k-1} = F P_{k-1|k-1} F^T + Q$, at steady state:
   $$(P_\infty^+)^{-1} = (F P_\infty^+ F^T + Q)^{-1} + H^T R^{-1} H$$
3. Applying the matrix inversion lemma yields the alternative posterior DARE. $\blacksquare$

---

### Problem 7.17 (Solved Exercise): Detectability with Decoupled States
**Problem Statement:** A 2D system has $F = \begin{bmatrix} 0.5 & 0 \\ 0 & 1.5 \end{bmatrix}$ and $H = [1, 0]$. Determine if the system is detectable.

**Step-by-Step Solution:**
1. Eigenvalues: $\lambda_1 = 0.5$ (stable), $\lambda_2 = 1.5$ (unstable).
2. For $\lambda_1 = 0.5$: $|\lambda_1| < 1$, so it does not require observability for detectability.
3. For $\lambda_2 = 1.5$: $|\lambda_2| \ge 1$. Evaluate PBH rank:
   $$\mathcal{M}_{\text{PBH}} = \begin{bmatrix} 1.5 - 0.5 & 0 \\ 0 & 1.5 - 1.5 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 1.0 & 0 \\ 0 & 0 \\ 1.0 & 0 \end{bmatrix}$$
   Column 2 is identically zero. Thus $\operatorname{rank}(\mathcal{M}_{\text{PBH}}) = 1 < 2$.
4. The unstable mode $\lambda_2 = 1.5$ is unobservable. The system is **not detectable**.

**Final Answer:**
$$\mathbf{Not\ Detectable\ (Unstable\ mode\ }\lambda=1.5\mathbf{\ is\ unobserved)}$$

---

### Problem 7.18 (Solved Exercise): DARE Upper Bound via Observability Gramian
**Problem Statement:** Prove that if $(F, H)$ is observable, the steady-state prior covariance is bounded from above by $P_\infty \le \mathcal{O}^{-1} \mathcal{R} \mathcal{O}^{-T} + \dots$ where $\mathcal{O}$ is the observability matrix.

**Step-by-Step Solution:**
1. A batch least-squares estimator using $n$ observations achieves covariance:
   $$P_{\text{batch}} = (\mathcal{O}^T \mathcal{R}^{-1} \mathcal{O})^{-1}$$
2. Since the Kalman Filter is the optimal minimum variance estimator, its posterior covariance cannot exceed that of any sub-optimal linear estimator:
   $$P_\infty^+ \le (\mathcal{O}^T \mathcal{R}^{-1} \mathcal{O})^{-1}$$
3. This establishes a strict analytical upper bound on steady-state filter uncertainty. $\blacksquare$

---

### Problem 7.19 (Solved Exercise): Monotonic Convergence of Riccati Iteration
**Problem Statement:** Prove that if the initial covariance is chosen as $P_0 = 0$, the sequence of prior covariances generated by the Kalman recursion is monotonically non-decreasing: $P_0 \le P_1 \le P_2 \le \dots \le P_\infty$.

**Step-by-Step Solution:**
1. Base step: $P_0 = 0$. Since $P_1 = F P_0 F^T + Q = Q \ge 0$, we have $P_0 \le P_1$.
2. Inductive step: Assume $P_{k-1} \le P_k$.
   The Riccati mapping $\psi(P) = F P F^T + Q - F P H^T (H P H^T + R)^{-1} H P F^T$ can be rewritten as:
   $$\psi(P) = \min_K \left[ (F - K H) P (F - K H)^T + K R K^T + Q \right]$$
3. Because the matrix quadratic form is an increasing operator in $P$, $\psi(A) \le \psi(B)$ whenever $A \le B$.
4. Therefore, $P_k \le P_{k+1}$ for all $k$.
5. By the monotone convergence theorem for bounded symmetric operators, $P_k \to P_\infty$. $\blacksquare$

---

### Problem 7.20 (Solved Exercise): DARE Spectral Radius Condition
**Problem Statement:** Show that if $\rho(F) < 1$ (the open-loop physical system is asymptotically stable), then $(F, H)$ is automatically detectable for *any* choice of measurement matrix $H$ (even $H = 0$).

**Step-by-Step Solution:**
1. By definition, detectability requires that all unobservable eigenvalues satisfy $|\lambda| < 1$.
2. If $\rho(F) < 1$, *all* eigenvalues of $F$ satisfy $|\lambda_i| < 1$.
3. Thus, every unobservable mode is strictly stable, regardless of $H$.
4. The system is unconditionally detectable. $\blacksquare$
