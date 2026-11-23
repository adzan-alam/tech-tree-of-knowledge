# Chapter 12: Production TypeScript Robotics Kinematics Engine and Capstone Synthesis

The theoretical edifice constructed across the preceding eleven chapters—spanning rigid body Lie groups $SE(3)$, twist coordinates, standard and modified Denavit-Hartenberg conventions, the Product of Exponentials formula, analytical Pieper decoupling, geometric Jacobians, manipulability ellipsoids, damped least-squares, nullspace redundancy resolution, and constrained trajectory generation—culminates in the architecture of a production-grade, zero-dependency computational kinematics engine.

In autonomous robotics, software running on embedded real-time flight controllers, industrial IPCs, or high-level web-based digital twin interfaces requires deterministic numerical stability, zero runtime allocation overhead where possible, and strict mathematical guarantees against matrix ill-conditioning and geometric drift. This capstone chapter presents:
1. The architectural blueprint and mathematical specifications of `robotics-kinematics-engine.ts`.
2. Ten Civilizational Grand Gauntlets (Problems 12.1 – 12.10): exhaustive mathematical proofs and closed-form derivations establishing the foundational theorems of modern manipulation.
3. Ten Capstone Mastery Problems (Problems 12.11 – 12.20): complex industrial and research scenarios synthesizing trajectory planning, singularity passage, nullspace optimization, and real-time control.

---

## 12.1 Architecture of the Production Kinematics Engine

The production TypeScript kinematics engine (`robotics-kinematics-engine.ts`) is designed from first principles with zero third-party dependencies. It is structured into seven tightly coupled, mathematically rigorous subsystems:

```
+-----------------------------------------------------------------------------+
|                      PRODUCTION KINEMATICS ENGINE                           |
+-----------------------------------------------------------------------------+
|  1. Lie Algebra & Spatial Group Foundation                                  |
|     - Vector3D (vector arithmetic, cross products, projections)             |
|     - Matrix4x4 (SE(3) transforms, fast 4x4 matrix inversion, homogeneous)  |
|     - Quaternion (SO(3) unit quaternions, Slerp, axis-angle, antipodal)     |
|     - TransformSE3 (Spatial poses, adjoint representations Ad_T)            |
+-----------------------------------------------------------------------------+
|  2. Kinematic Representation Core                                           |
|     - DHParameter (Standard & Modified Craig conventions)                   |
|     - ScrewAxis (Space/Body screw parameters [w; v], pitch, magnitude)      |
|     - RobotKinematicChain (Forward kinematics via DH & PoE, frames cache)   |
+-----------------------------------------------------------------------------+
|  3. Differential Kinematics Subsystem                                       |
|     - GeometricJacobian (Analytical & spatial cross-product formulation)    |
|     - ManipulabilityAnalysis (Yoshikawa index, condition number, SVD)       |
+-----------------------------------------------------------------------------+
|  4. Analytical Inverse Kinematics Engines                                   |
|     - Planar2R_IKSolver (Elbow-up / elbow-down algebraic branches)          |
|     - SphericalWristIKSolver (Pieper decoupling for 6-DoF manipulators)     |
+-----------------------------------------------------------------------------+
|  5. Numerical Inverse Kinematics Engines                                    |
|     - NewtonRaphsonIKSolver (Quadratic convergence in regular regions)      |
|     - JacobianTransposeIKSolver (Lyapunov stable step descent)              |
|     - DLSSolver (Damped Least-Squares with Nakamura-Hanafusa damping)       |
|     - NullspaceProjectionEngine (Joint limits, manipulability gradients)    |
+-----------------------------------------------------------------------------+
|  6. Geometric Heuristic Engines                                             |
|     - FABRIKSolver (Forward and backward reaching point projections)        |
|     - CCDSolver (Cyclic coordinate descent with per-joint angle clamping)   |
+-----------------------------------------------------------------------------+
|  7. Trajectory Generation & Real-Time Tracking                              |
|     - QuinticPolynomialTrajectory (C^2 boundary conditions, min jerk)       |
|     - TaskSpaceTrajectory (Point-to-point SE(3) interpolation via Slerp)    |
|     - CLIKController (Closed-loop inverse kinematics drift compensation)    |
+-----------------------------------------------------------------------------+
```

### 12.1.1 Spatial Group and Lie Algebra Implementation
The engine represents rigid body transformations in $SE(3)$ as $4 \times 4$ homogeneous transformation matrices:
$$T = \begin{bmatrix} R & p \\ 0_{1 \times 3} & 1 \end{bmatrix} \in SE(3)$$
Taking advantage of the special Euclidean structure, inversion avoids general Gaussian elimination:
$$T^{-1} = \begin{bmatrix} R^T & -R^T p \\ 0_{1 \times 3} & 1 \end{bmatrix}$$
This computation requires exactly 9 multiplications and 9 additions for the position component, achieving an order-of-magnitude speedup and zero numerical degradation.

The Adjoint representation $[\operatorname{Ad}_T] \in \mathbb{R}^{6 \times 6}$ transforms spatial twists $\mathcal{V} = [\omega; v]$ between coordinate frames:
$$[\operatorname{Ad}_T] = \begin{bmatrix} R & 0_{3 \times 3} \\ [p]_\times R & R \end{bmatrix}$$
where $[p]_\times$ is the skew-symmetric matrix:
$$[p]_\times = \begin{bmatrix} 0 & -p_z & p_y \\ p_z & 0 & -p_x \\ -p_y & p_x & 0 \end{bmatrix}$$

### 12.1.2 Unified DH and Product of Exponentials (PoE) Support
The engine accepts kinematic chain specifications in both Standard Denavit-Hartenberg ($\theta_i, d_i, a_i, \alpha_i$) and Modified Craig ($a_{i-1}, \alpha_{i-1}, d_i, \theta_i$) conventions. 

For modern open-chain manipulators, the engine also supports the Product of Exponentials (PoE) formulation:
$$T(q) = e^{[\mathcal{S}_1] q_1} e^{[\mathcal{S}_2] q_2} \cdots e^{[\mathcal{S}_n] q_n} M$$
where each screw axis $\mathcal{S}_i = [\omega_i; v_i] \in \mathbb{R}^6$ is computed in the space frame at home configuration $q=0$, and $M \in SE(3)$ is the end-effector home pose. Matrix exponentials for revolute screws ($\|\omega\|=1$) are evaluated via Rodrigues' formula:
$$e^{[\omega] q} = I_3 + \sin(q) [\omega]_\times + (1 - \cos(q)) [\omega]_\times^2$$
$$e^{[\mathcal{S}] q} = \begin{bmatrix} e^{[\omega] q} & \left( I_3 q + (1 - \cos q)[\omega]_\times + (q - \sin q)[\omega]_\times^2 \right) v \\ 0_{1 \times 3} & 1 \end{bmatrix}$$

### 12.1.3 Differential Kinematics and Singular Value Decomposition (SVD)
The geometric Jacobian $J(q) = [J_1(q) \; \dots \; J_n(q)] \in \mathbb{R}^{6 \times n}$ is computed recursively from joint origin positions $p_i$ and rotation axes $z_i$:
$$J_i(q) = \begin{bmatrix} z_{i-1} \times (p_e - p_{i-1}) \\ z_{i-1} \end{bmatrix} \quad \text{(for revolute joints)}$$
For spectral analysis, the engine implements a zero-allocation, symmetric Jacobi eigenvalue solver on $A = J J^T \in \mathbb{R}^{6 \times 6}$. The singular values $\sigma_i = \sqrt{\lambda_i(J J^T)}$ yield:
- **Yoshikawa Manipulability Measure:**
  $$w = \sqrt{\det(J J^T)} = \prod_{i=1}^6 \sigma_i$$
- **Condition Number:**
  $$\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}}$$

### 12.1.4 Redundant Inverse Kinematics and Adaptive DLS
For redundant arms ($n > m$), the Moore-Penrose pseudoinverse with adaptive Levenberg-Marquardt damping is computed via the push-through identity:
$$J^{*\lambda} = J^T (J J^T + \lambda^2 I_m)^{-1}$$
where damping $\lambda^2$ is smoothly varied using the Nakamura-Hanafusa metric:
$$\lambda^2 = \begin{cases} 0 & \text{if } w \ge w_0 \\ \lambda_0^2 \left( 1 - \frac{w}{w_0} \right)^2 & \text{if } w < w_0 \end{cases}$$
Nullspace projections $P = I_n - J^+ J$ are applied to optimize secondary performance criteria (joint limits, obstacle distance) without perturbing the primary task:
$$\dot{q} = J^+ \dot{x}_d + (I_n - J^+ J) \nabla_q H(q)$$

---

## 12.2 Civilizational Grand Gauntlets (Problems 12.1 – 12.10)

#### Problem 12.1: Algebraic Proof of Pieper's Criterion for Closed-Form Solvability
**Statement:**
Pieper's Theorem asserts that a 6-DoF serial manipulator possesses a closed-form analytical inverse kinematics solution if three consecutive joint axes intersect at a single point (such as a spherical wrist) or are mutually parallel. Provide the complete algebraic proof of Pieper's criterion for a 6R manipulator whose last three axes ($z_4, z_5, z_6$) intersect at wrist center point $p_w$. Prove that the position of $p_w$ is completely independent of joint angles $q_4, q_5, q_6$, and deduce the resulting polynomial degree in $\tan(q_3/2)$.

**Given Data:**
- 6-DoF serial manipulator with joint variables $q_1, \dots, q_6$.
- Axes $z_4, z_5, z_6$ intersect at common point $p_w$ (spherical wrist).
- Desired end-effector pose $T_d = \begin{bmatrix} R_d & p_d \\ 0 & 1 \end{bmatrix}$ with approach vector $a_d = R_d \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$ and wrist offset $d_6$.

**Step-by-Step Derivation:**
1. Express the end-effector origin $p_e$ in terms of the wrist center $p_w$ and frame 6 orientation:
   $$p_e = p_w + d_6 z_6$$
   Since $z_6$ in the base frame is identical to the third column of $R_d$ (the approach vector $a_d$):
   $$p_w = p_d - d_6 a_d$$
2. Let $T_i^{i-1}(q_i)$ be the DH transformation from link $i$ to link $i-1$. The position of the wrist center in the base frame is:
   $$p_w = T_1^0(q_1) T_2^1(q_2) T_3^2(q_3) p_w^{(3)}$$
   where $p_w^{(3)}$ is the coordinates of $p_w$ expressed in frame 3.
3. Crucially, because axes 4, 5, and 6 intersect at $p_w$, rotating joints 4, 5, or 6 applies rotations whose center of rotation is $p_w$ itself. Therefore, the distance from frame 3 origin to $p_w$ is fixed:
   $$p_w^{(3)} = \begin{bmatrix} a_3 \\ -d_4 \sin\alpha_3 \\ d_4 \cos\alpha_3 \end{bmatrix} = \text{constant vector independent of } q_4, q_5, q_6$$
   Thus, $p_w(q_1, q_2, q_3) = p_d - d_6 a_d$ forms a decoupled 3-variable vector equation:
   $$f(q_1, q_2, q_3) = p_w$$
4. Project $p_w = [x_w, y_w, z_w]^T$:
   - For an arm with $a_1 = 0, \alpha_1 = \pm 90^\circ$:
     $$q_1 = \operatorname{atan2}(y_w, x_w) \quad \text{or} \quad q_1 = \operatorname{atan2}(-y_w, -x_w)$$
     This yields 2 distinct solutions for $q_1$.
5. In the planar slice spanned by links 2 and 3:
   The distance from shoulder to wrist is:
   $$r^2 = x_w^2 + y_w^2 + (z_w - d_1)^2 = a_2^2 + a_3^2 + d_4^2 + 2 a_2 \sqrt{a_3^2 + d_4^2} \cos(q_3 + \phi)$$
   where $\phi = \operatorname{atan2}(d_4, a_3)$.
   Applying the tangent half-angle substitution $u = \tan(q_3/2)$:
   $$\cos(q_3) = \frac{1 - u^2}{1 + u^2}, \quad \sin(q_3) = \frac{2u}{1 + u^2}$$
   Substituting into the distance equation yields a quadratic polynomial in $u$:
   $$A u^2 + B u + C = 0$$
   A quadratic polynomial possesses at most 2 real roots for $u$, corresponding to 2 solutions for $q_3$ (elbow-up and elbow-down).
6. With $q_1, q_3$ known, $q_2$ is uniquely determined for each pair, giving $2 \times 2 = 4$ arm configurations.
7. For each of the 4 arm configurations, the orientation of the wrist is:
   $$R_6^3(q_4, q_5, q_6) = (R_3^0(q_1, q_2, q_3))^T R_d$$
   Because the wrist is spherical (Euler Z-Y-Z or Z-Y-X), solving for $q_4, q_5, q_6$ yields exactly 2 solutions (wrist-flip: $q_5$ and $-q_5$).
8. Total closed-form solutions: $4 \times 2 = 8$ branches.

**Final Answer:**
- Proof concludes that $p_w = p_d - d_6 a_d$ is identically independent of $q_4, q_5, q_6$.
- Tangent half-angle reduction yields a polynomial of degree 2 (quadratic), guaranteeing at most 8 closed-form kinematic branches.

**Verification:**
Every industrial 6R robot with a spherical wrist (Puma 560, UR5, KUKA KR6) conforms exactly to Pieper's criterion and exhibits exactly 8 analytical inverse kinematic solutions.

---

#### Problem 12.2: Analytical Bound on the Spectral Filter Factor in Damped Least-Squares
**Statement:**
In Damped Least-Squares ($\operatorname{DLS}$), the inverse mapping uses the regularized pseudoinverse $J^{*\lambda} = J^T (J J^T + \lambda^2 I)^{-1}$. 
Using the Singular Value Decomposition $J = U \Sigma V^T$, prove that the singular value filtering factor is $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$. Prove algebraically that $f(\sigma)$ achieves an absolute global maximum of $\frac{1}{2\lambda}$ at $\sigma = \lambda$, and demonstrate that the joint velocity norm $\|\dot{q}\|$ is unconditionally bounded by $\frac{\|\dot{x}\|}{2\lambda}$.

**Given Data:**
- $J = U \Sigma V^T \in \mathbb{R}^{m \times n}$ ($m \le n$), singular values $\sigma_1 \ge \dots \ge \sigma_m > 0$.
- Damping factor $\lambda > 0$.

**Step-by-Step Derivation:**
1. Express $J J^T$ in terms of SVD:
   $$J J^T = (U \Sigma V^T)(V \Sigma^T U^T) = U \Sigma \Sigma^T U^T = U \operatorname{diag}(\sigma_1^2, \dots, \sigma_m^2) U^T$$
2. Add damping matrix $\lambda^2 I_m$:
   $$J J^T + \lambda^2 I_m = U \operatorname{diag}(\sigma_1^2 + \lambda^2, \dots, \sigma_m^2 + \lambda^2) U^T$$
   Inverting:
   $$(J J^T + \lambda^2 I_m)^{-1} = U \operatorname{diag}\left( \frac{1}{\sigma_1^2 + \lambda^2}, \dots, \frac{1}{\sigma_m^2 + \lambda^2} \right) U^T$$
3. Pre-multiply by $J^T = V \Sigma^T U^T$:
   $$J^{*\lambda} = V \Sigma^T U^T U \operatorname{diag}\left( \frac{1}{\sigma_i^2 + \lambda^2} \right) U^T = V \Sigma^T \operatorname{diag}\left( \frac{1}{\sigma_i^2 + \lambda^2} \right) U^T$$
   $$J^{*\lambda} = V \operatorname{diag}\left( \frac{\sigma_1}{\sigma_1^2 + \lambda^2}, \dots, \frac{\sigma_m}{\sigma_m^2 + \lambda^2} \right) U^T$$
   Thus, for each singular component $i$, the filter factor is:
   $$f(\sigma_i) = \frac{\sigma_i}{\sigma_i^2 + \lambda^2}$$
4. Find the global maximum of $f(\sigma)$ for $\sigma \in (0, \infty)$:
   Differentiating with respect to $\sigma$:
   $$\frac{d f}{d\sigma} = \frac{1 \cdot (\sigma^2 + \lambda^2) - \sigma(2\sigma)}{(\sigma^2 + \lambda^2)^2} = \frac{\lambda^2 - \sigma^2}{(\sigma^2 + \lambda^2)^2}$$
5. Setting derivative to zero:
   $$\frac{d f}{d\sigma} = 0 \implies \lambda^2 - \sigma^2 = 0 \implies \sigma = \lambda$$
   Evaluating $f(\sigma)$ at $\sigma = \lambda$:
   $$f(\lambda) = \frac{\lambda}{\lambda^2 + \lambda^2} = \frac{\lambda}{2\lambda^2} = \frac{1}{2\lambda}$$
6. Bound on joint velocity:
   For any task velocity $\dot{x} \in \mathbb{R}^m$:
   $$\dot{q} = J^{*\lambda} \dot{x} = \sum_{i=1}^m \frac{\sigma_i}{\sigma_i^2 + \lambda^2} (u_i^T \dot{x}) v_i$$
   Taking Euclidean norms:
   $$\|\dot{q}\|^2 = \sum_{i=1}^m \left( \frac{\sigma_i}{\sigma_i^2 + \lambda^2} \right)^2 (u_i^T \dot{x})^2 \le \max_i \left( \frac{\sigma_i}{\sigma_i^2 + \lambda^2} \right)^2 \sum_{i=1}^m (u_i^T \dot{x})^2$$
   Since $\max_\sigma f(\sigma) = \frac{1}{2\lambda}$ and $\sum (u_i^T \dot{x})^2 = \|\dot{x}\|^2$:
   $$\|\dot{q}\| \le \frac{1}{2\lambda} \|\dot{x}\|$$

**Final Answer:**
- Filter factor: $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$.
- Global maximum: $f_{\max} = \frac{1}{2\lambda}$ attained precisely at $\sigma = \lambda$.
- Norm bound: $\|\dot{q}\| \le \frac{\|\dot{x}\|}{2\lambda}$ unconditionally for all configurations.

**Verification:**
As $\sigma \to 0$ (exact singularity), $f(\sigma) \to 0$. In contrast to unregularized pseudoinverse where $f(\sigma) = 1/\sigma \to \infty$, DLS guarantees that joint velocities remain strictly finite.

---

#### Problem 12.3: Algebraic Proof of the Push-Through Identity for Redundant Manipulators
**Statement:**
In numerical inverse kinematics for a redundant manipulator ($n > m$), the Damped Least-Squares solution can be expressed in two mathematically identical forms:
$$\text{Form 1 (Joint Space):} \quad J^{*\lambda} = (J^T J + \lambda^2 I_n)^{-1} J^T$$
$$\text{Form 2 (Task Space):} \quad J^{*\lambda} = J^T (J J^T + \lambda^2 I_m)^{-1}$$
Prove the push-through matrix identity:
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$
and analyze the computational complexity reduction when applied to a 7-DoF manipulator in 3D operational space ($n=7, m=3$).

**Given Data:**
- $J \in \mathbb{R}^{m \times n}$, $\lambda > 0$, $I_n \in \mathbb{R}^{n \times n}$, $I_m \in \mathbb{R}^{m \times m}$.

**Step-by-Step Derivation:**
1. Start with the fundamental matrix multiplication associativity:
   $$J^T (J J^T + \lambda^2 I_m) = J^T J J^T + \lambda^2 J^T$$
2. Factor $J^T$ to the right:
   $$J^T J J^T + \lambda^2 J^T = (J^T J + \lambda^2 I_n) J^T$$
3. Thus, we have the exact equality:
   $$(J^T J + \lambda^2 I_n) J^T = J^T (J J^T + \lambda^2 I_m)$$
4. Pre-multiply both sides by $(J^T J + \lambda^2 I_n)^{-1}$:
   $$J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
5. Post-multiply both sides by $(J J^T + \lambda^2 I_m)^{-1}$:
   $$J^T (J J^T + \lambda^2 I_m)^{-1} = (J^T J + \lambda^2 I_n)^{-1} J^T$$
   This proves the push-through identity identically.
6. **Computational Complexity Analysis ($n=7, m=3$):**
   - Form 1 requires inverting $(J^T J + \lambda^2 I_7) \in \mathbb{R}^{7 \times 7}$. Inverting a $7 \times 7$ symmetric matrix via Cholesky decomposition requires $\frac{1}{3}(7)^3 \approx 114$ floating-point operations.
   - Form 2 requires inverting $(J J^T + \lambda^2 I_3) \in \mathbb{R}^{3 \times 3}$. Inverting a $3 \times 3$ matrix requires closed-form Cramer's rule or Cholesky with $\frac{1}{3}(3)^3 = 9$ operations.
   - Speedup in matrix inversion is $114 / 9 \approx 12.7\times$.

**Final Answer:**
- Identity proven: $(J^T J + \lambda^2 I_n)^{-1} J^T \equiv J^T (J J^T + \lambda^2 I_m)^{-1}$.
- Inversion dimension reduced from $n \times n$ ($7 \times 7$) to $m \times m$ ($3 \times 3$), saving $\approx 92\%$ of matrix inversion computations.

**Verification:**
Let $J = [1, 2]$ ($m=1, n=2$), $\lambda = 1$.
Form 1: $J^T J + I_2 = \begin{bmatrix} 1 \\ 2 \end{bmatrix} [1, 2] + I_2 = \begin{bmatrix} 2 & 2 \\ 2 & 5 \end{bmatrix}$. Inverse: $\frac{1}{6} \begin{bmatrix} 5 & -2 \\ -2 & 2 \end{bmatrix}$.
$J^{*\lambda} = \frac{1}{6} \begin{bmatrix} 5 & -2 \\ -2 & 2 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = [1/6, 2/6]^T$.
Form 2: $J J^T + I_1 = (1+4) + 1 = 6$. Inverse: $1/6$.
$J^{*\lambda} = J^T (1/6) = \begin{bmatrix} 1 \\ 2 \end{bmatrix} (1/6) = [1/6, 2/6]^T$. Both expressions yield the exact same result.

---

#### Problem 12.4: Rigorous Proof of Nullspace Projector Idempotency and Invariance
**Statement:**
Let $J \in \mathbb{R}^{m \times n}$ with $\operatorname{rank}(J) = m < n$. Define the Moore-Penrose pseudoinverse $J^+ = J^T (J J^T)^{-1}$ and the nullspace projector $P = I_n - J^+ J$.
Prove algebraically:
1. $P$ is idempotent: $P^2 = P$.
2. $P$ is symmetric: $P^T = P$.
3. $J P = 0_{m \times n}$ (complete task cancellation).
4. For any arbitrary secondary joint velocity $v_{\text{sec}} \in \mathbb{R}^n$, the task space velocity of $\dot{q} = J^+ \dot{x} + P v_{\text{sec}}$ is strictly $J \dot{q} = \dot{x}$.

**Given Data:**
- $J^+ = J^T (J J^T)^{-1}$, $P = I_n - J^+ J$.

**Step-by-Step Derivation:**
1. Check $J J^+$:
   $$J J^+ = J J^T (J J^T)^{-1} = I_m$$
2. **Proof that $J P = 0$:**
   $$J P = J (I_n - J^+ J) = J I_n - J J^+ J = J - I_m J = J - J = 0_{m \times n}$$
3. **Proof of Idempotency ($P^2 = P$):**
   $$P^2 = (I_n - J^+ J)(I_n - J^+ J) = I_n^2 - I_n J^+ J - J^+ J I_n + (J^+ J)(J^+ J)$$
   $$= I_n - 2 J^+ J + J^+ \underbrace{(J J^+)}_{= I_m} J = I_n - 2 J^+ J + J^+ I_m J = I_n - 2 J^+ J + J^+ J = I_n - J^+ J = P$$
4. **Proof of Symmetry ($P^T = P$):**
   $$P^T = (I_n - J^+ J)^T = I_n^T - (J^+ J)^T = I_n - J^T (J^+)^T$$
   Since $J^+ = J^T (J J^T)^{-1}$:
   $$(J^+)^T = \left( (J J^T)^{-1} \right)^T (J^T)^T = (J J^T)^{-1} J$$
   Therefore:
   $$J^T (J^+)^T = J^T (J J^T)^{-1} J = J^+ J$$
   Thus:
   $$P^T = I_n - J^+ J = P$$
5. **Proof of Task Space Invariance:**
   $$\dot{q} = J^+ \dot{x} + P v_{\text{sec}}$$
   Multiply by $J$:
   $$J \dot{q} = J J^+ \dot{x} + J P v_{\text{sec}} = I_m \dot{x} + 0_{m \times n} v_{\text{sec}} = \dot{x}$$

**Final Answer:**
- $P^2 = P$ (idempotent projection).
- $P^T = P$ (orthogonal projection).
- $J P = 0$ (exact nullspace property).
- $J \dot{q} = \dot{x}$ identically.

**Verification:**
$\operatorname{tr}(P) = \operatorname{tr}(I_n) - \operatorname{tr}(J^+ J) = n - \operatorname{tr}(J J^+) = n - \operatorname{tr}(I_m) = n - m$. The dimension of the nullspace subspace is exactly $n - m$.

---

#### Problem 12.5: Lyapunov Asymptotic Stability of Quaternion-Based CLIK
**Statement:**
Consider the operational orientation tracking error $e_o = 2 \Delta\eta \Delta\epsilon$, where $\Delta q = (\Delta\eta, \Delta\epsilon) = q^{-1} * q_d$.
Let the Closed-Loop Inverse Kinematics law be:
$$\dot{q} = J_\omega^+ (\omega_d + k_o e_o)$$
where $J_\omega \in \mathbb{R}^{3 \times n}$ is the angular velocity Jacobian and $k_o > 0$.
Prove using the Lyapunov candidate function $V = 2(1 - \Delta\eta)$ that the equilibrium $\Delta\eta = 1, \Delta\epsilon = 0$ is asymptotically stable, and compute the explicit convergence rate.

**Given Data:**
- $V = 2(1 - \Delta\eta) \ge 0$.
- Quaternion kinematics: $\Delta\dot{\eta} = -\frac{1}{2} \Delta\epsilon^T e_{\omega}$ where $e_\omega = \omega_d - \omega$.

**Step-by-Step Derivation:**
1. From unit quaternion properties, $\|\Delta q\|^2 = \Delta\eta^2 + \|\Delta\epsilon\|^2 = 1$.
   When aligned, $\Delta\eta = 1$ and $\Delta\epsilon = 0$, so $V(1) = 0$.
   For any deviation $\Delta\eta \in [0, 1)$, $V > 0$.
2. The time derivative of $\Delta\eta$ under relative angular velocity error $e_\omega = \omega_d - \omega$ is:
   $$\dot{\Delta\eta} = -\frac{1}{2} \Delta\epsilon^T e_\omega$$
3. Differentiating $V$ with respect to time:
   $$\dot{V} = \frac{d}{dt} \left( 2 - 2 \Delta\eta \right) = -2 \dot{\Delta\eta} = -2 \left( -\frac{1}{2} \Delta\epsilon^T e_\omega \right) = \Delta\epsilon^T e_\omega$$
4. Substituting the manipulator angular velocity $\omega = J_\omega \dot{q}$:
   $$e_\omega = \omega_d - J_\omega \dot{q}$$
   Substituting the $\operatorname{CLIK}$ control law $\dot{q} = J_\omega^+ (\omega_d + k_o e_o)$:
   $$e_\omega = \omega_d - J_\omega J_\omega^+ (\omega_d + k_o e_o) = \omega_d - (\omega_d + k_o e_o) = -k_o e_o$$
5. Since $e_o = 2 \Delta\eta \Delta\epsilon$:
   $$e_\omega = -2 k_o \Delta\eta \Delta\epsilon$$
6. Evaluating $\dot{V}$:
   $$\dot{V} = \Delta\epsilon^T \left( -2 k_o \Delta\eta \Delta\epsilon \right) = -2 k_o \Delta\eta \|\Delta\epsilon\|^2$$
   Since $\Delta\eta > 0$ in the hemispherical neighborhood of attraction and $k_o > 0$:
   $$\dot{V} \le 0 \quad \text{with } \dot{V} = 0 \iff \|\Delta\epsilon\| = 0$$
   By LaSalle's Invariance Principle, the system converges asymptotically to $\Delta\epsilon = 0, \Delta\eta = 1$.

**Final Answer:**
- Candidate $V = 2(1 - \Delta\eta)$ satisfies $\dot{V} = -2 k_o \Delta\eta \|\Delta\epsilon\|^2 \le 0$.
- Quaternion tracking error converges asymptotically to the identity orientation $\Delta q = [1, 0, 0, 0]^T$.

**Verification:**
Near the identity, $\Delta\eta \approx 1$ and $1 - \Delta\eta \approx \frac{1}{2}\|\Delta\epsilon\|^2$. Then $V \approx \|\Delta\epsilon\|^2$ and $\dot{V} \approx -2 k_o \|\Delta\epsilon\|^2 = -2 k_o V$, yielding exponential decay with time constant $\tau = \frac{1}{2 k_o}$.

---

#### Problem 12.6: Lie Algebra Exponential Coordinate Derivative and the dexp Formula
**Statement:**
Let $R(\theta) = e^{[\omega]_\times \theta} \in SO(3)$. Derive the exact analytical formula for the time derivative $\dot{R}$ in terms of the angular velocity vector $\omega_s \in \mathbb{R}^3$ in the spatial frame, and prove that:
$$[\omega_s]_\times = \dot{R} R^T = \left( I - e^{-[\omega\theta]_\times} \right) \frac{[\omega]_\times}{\theta} \dot{\theta} + \dots$$
Simplify this to establish that when rotating about a fixed unit axis $\hat{n}$ with time-varying angle $\theta(t)$, the spatial angular velocity is strictly $\omega_s = \dot{\theta} \hat{n}$.

**Given Data:**
- $R(t) = e^{[\hat{n}]_\times \theta(t)}$ where $\|\hat{n}\| = 1$.

**Step-by-Step Derivation:**
1. By Rodrigues' formula:
   $$R(t) = I + \sin\theta [\hat{n}]_\times + (1 - \cos\theta) [\hat{n}]_\times^2$$
2. Differentiating with respect to time $t$ (noting that $\hat{n}$ is fixed in direction):
   $$\dot{R}(t) = \dot{\theta} \left( \cos\theta [\hat{n}]_\times + \sin\theta [\hat{n}]_\times^2 \right)$$
3. Compute the spatial angular velocity skew-symmetric tensor $[\omega_s]_\times = \dot{R} R^T$:
   $$[\omega_s]_\times = \dot{\theta} \left( \cos\theta [\hat{n}]_\times + \sin\theta [\hat{n}]_\times^2 \right) \left( I - \sin\theta [\hat{n}]_\times + (1 - \cos\theta) [\hat{n}]_\times^2 \right)$$
4. Use the Lie algebra identities for unit vector $[\hat{n}]_\times$:
   $$[\hat{n}]_\times^3 = -[\hat{n}]_\times, \quad [\hat{n}]_\times^4 = -[\hat{n}]_\times^2$$
5. Expanding the product term by term:
   $$[\omega_s]_\times = \dot{\theta} \left( \cos\theta [\hat{n}]_\times - \cos\theta\sin\theta [\hat{n}]_\times^2 + \cos\theta(1-\cos\theta) [\hat{n}]_\times^3 + \sin\theta [\hat{n}]_\times^2 - \sin^2\theta [\hat{n}]_\times^3 + \sin\theta(1-\cos\theta) [\hat{n}]_\times^4 \right)$$
   Substitute $[\hat{n}]_\times^3 = -[\hat{n}]_\times$ and $[\hat{n}]_\times^4 = -[\hat{n}]_\times^2$:
   $$= \dot{\theta} \left( \cos\theta [\hat{n}]_\times - \cos\theta(1-\cos\theta) [\hat{n}]_\times + \sin^2\theta [\hat{n}]_\times + [ -\cos\theta\sin\theta + \sin\theta - \sin\theta(1-\cos\theta) ] [\hat{n}]_\times^2 \right)$$
   Evaluate coefficients:
   - Coefficient of $[\hat{n}]_\times$:
     $$\cos\theta - \cos\theta + \cos^2\theta + \sin^2\theta = 1$$
   - Coefficient of $[\hat{n}]_\times^2$:
     $$-\cos\theta\sin\theta + \sin\theta - \sin\theta + \sin\theta\cos\theta = 0$$
6. Therefore:
   $$[\omega_s]_\times = \dot{\theta} [\hat{n}]_\times \implies \omega_s = \dot{\theta} \hat{n}$$

**Final Answer:**
- $[\omega_s]_\times = \dot{R} R^T = \dot{\theta} [\hat{n}]_\times$.
- The spatial angular velocity vector is $\omega_s(t) = \dot{\theta}(t) \hat{n}$.

**Verification:**
The physical rotation axis $\hat{n}$ is stationary in the space frame, so rotating by angle $\theta(t)$ produces angular velocity aligned with $\hat{n}$ scaled by $\dot{\theta}$, exactly matching Euler's rotation theorem.

---

#### Problem 12.7: Geometric Convergence Proof of FABRIK on Reachable Targets
**Statement:**
Consider a 2-segment kinematic chain with link lengths $d_0, d_1$ anchored at origin $p_0$. A reachable target $p_t$ satisfies $\|p_t - p_0\| < d_0 + d_1$.
Prove that each forward-backward cycle of $\operatorname{FABRIK}$ is a contraction mapping with respect to the end-effector tracking error $\|p_t - p_2^{(k)}\|$, guaranteeing monotonic geometric convergence to zero error.

**Given Data:**
- Link lengths $d_0, d_1 > 0$, anchor $p_0 = [0, 0]^T$.
- Target $p_t$ with $\|p_t\| \le d_0 + d_1$.

**Step-by-Step Derivation:**
1. In the forward reach phase, $p_2$ is placed exactly at $p_t$:
   $$p_2^{(k+1/2)} = p_t$$
   Then $p_1$ is positioned along the segment between $p_t$ and $p_1^{(k)}$ at distance $d_1$:
   $$p_1^{(k+1/2)} = p_t + d_1 \frac{p_1^{(k)} - p_t}{\|p_1^{(k)} - p_t\|}$$
2. In the backward reach phase, $p_0$ is anchored at origin $p_0 = 0$.
   $p_1$ is positioned along the line from $0$ to $p_1^{(k+1/2)}$ at distance $d_0$:
   $$p_1^{(k+1)} = d_0 \frac{p_1^{(k+1/2)}}{\|p_1^{(k+1/2)}\|}$$
   Then $p_2$ is positioned along the line from $p_1^{(k+1)}$ to $p_2^{(k+1/2)} = p_t$ at distance $d_1$:
   $$p_2^{(k+1)} = p_1^{(k+1)} + d_1 \frac{p_t - p_1^{(k+1/2)}}{\|p_t - p_1^{(k+1/2)}\|}$$
3. Note from the forward phase that $p_t - p_1^{(k+1/2)} = d_1 \frac{p_t - p_1^{(k)}}{\|p_t - p_1^{(k)}\|}$.
   Thus, the unit direction $\frac{p_t - p_1^{(k+1/2)}}{\|p_t - p_1^{(k+1/2)}\|}$ is collinear with the link orientation.
4. The remaining tracking error after the backward phase is:
   $$\|p_t - p_2^{(k+1)}\| = \left\| p_t - \left( p_1^{(k+1)} + d_1 \frac{p_t - p_1^{(k+1/2)}}{\|p_t - p_1^{(k+1/2)}\|} \right) \right\|$$
   Using the triangle inequality and noting that $p_1^{(k+1)}$ and $p_1^{(k+1/2)}$ lie on the same ray from origin with lengths $d_0$ and $\|p_1^{(k+1/2)}\|$:
   $$\|p_t - p_2^{(k+1)}\| \le \gamma \|p_t - p_2^{(k)}\| \quad \text{where } \gamma = \frac{| \|p_1^{(k+1/2)}\| - d_0 |}{\|p_t - p_1^{(k)}\|} < 1$$
5. Because $\gamma < 1$ for all reachable non-degenerate targets, the error sequence satisfies:
   $$\|e^{(k+1)}\| \le \gamma \|e^{(k)}\| \implies \|e^{(k)}\| \le \gamma^k \|e^{(0)}\| \to 0 \quad \text{as } k \to \infty$$

**Final Answer:**
- $\operatorname{FABRIK}$ is a contraction mapping on reachable targets with contraction constant $\gamma < 1$.
- Tracking error decays geometrically to zero without matrix inversions.

**Verification:**
In empirical benchmarks, $\operatorname{FABRIK}$ typically converges to machine precision ($\|e\| < 10^{-6}\text{ m}$) within 3 to 6 iterations on typical robotic arms.

---

#### Problem 12.8: Closed-Loop Dynamics and Bandwidth of Operational Space CLIK
**Statement:**
In industrial contour tracking (e.g., laser cutting or CNC machining), a robot end-effector tracks a circular path $x_d(t) = [R_0 \cos(\omega_0 t), R_0 \sin(\omega_0 t)]^T$.
The controller uses $\operatorname{CLIK}$ with error feedback gain $k_p$:
$$\dot{q} = J^+ \left( \dot{x}_d + k_p (x_d - x) \right)$$
Derive the frequency response transfer function $T(s) = \frac{X(s)}{X_d(s)}$, determine the tracking error amplitude $\|e(t)\|$ in steady state as a function of path frequency $\omega_0$, and compute the steady-state tracking error for $R_0 = 0.2\text{ m}, \omega_0 = 10\text{ rad/s}, k_p = 50\text{ s}^{-1}$.

**Given Data:**
- Circular trajectory: radius $R_0 = 0.2\text{ m}$, frequency $\omega_0 = 10\text{ rad/s}$.
- Gain $k_p = 50\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. From the $\operatorname{CLIK}$ velocity relation:
   $$\dot{x} = J \dot{q} = J J^+ (\dot{x}_d + k_p(x_d - x)) = \dot{x}_d + k_p(x_d - x)$$
2. Rearranging in terms of $x(t)$:
   $$\dot{x}(t) + k_p x(t) = \dot{x}_d(t) + k_p x_d(t)$$
3. Taking the Laplace transform:
   $$s X(s) + k_p X(s) = s X_d(s) + k_p X_d(s) \implies (s + k_p) X(s) = (s + k_p) X_d(s)$$
   $$T(s) = \frac{X(s)}{X_d(s)} = \frac{s + k_p}{s + k_p} = 1$$
4. Notice that because the feedforward term $\dot{x}_d$ is included in the $\operatorname{CLIK}$ law, the transfer function from $x_d$ to $x$ in continuous time is identically 1!
   $$\dot{e}(t) + k_p e(t) = 0 \implies e(t) = e(0) e^{-k_p t}$$
5. Therefore, in the absence of initial error ($e(0) = 0$), the theoretical tracking error is identically zero:
   $$\|e_{\text{ss}}\| = 0$$
6. Now consider a realistic scenario where the feedforward velocity is omitted (pure feedback IK: $\dot{q} = J^+ k_p (x_d - x)$):
   $$\dot{x} + k_p x = k_p x_d \implies \frac{X(s)}{X_d(s)} = \frac{k_p}{s + k_p}$$
   The error transfer function is:
   $$\frac{E(s)}{X_d(s)} = 1 - \frac{k_p}{s + k_p} = \frac{s}{s + k_p}$$
   Evaluating frequency response at $s = j \omega_0$:
   $$\left| \frac{E(j\omega_0)}{X_d(j\omega_0)} \right| = \frac{\omega_0}{\sqrt{\omega_0^2 + k_p^2}}$$
   For pure feedback:
   $$\|e_{\text{ss}}\| = R_0 \frac{\omega_0}{\sqrt{\omega_0^2 + k_p^2}} = 0.2 \frac{10}{\sqrt{10^2 + 50^2}} = 0.2 \frac{10}{\sqrt{100 + 2500}} = \frac{2.0}{\sqrt{2600}} \approx \frac{2.0}{50.99} \approx 0.0392\text{ m} = 39.2\text{ mm}$$

**Final Answer:**
- With feedforward velocity: $T(s) = 1$, steady-state tracking error is strictly zero ($\|e_{\text{ss}}\| = 0$).
- Without feedforward velocity: $\|e_{\text{ss}}\| = R_0 \frac{\omega_0}{\sqrt{\omega_0^2 + k_p^2}} \approx 39.2\text{ mm}$.

**Verification:**
This proves why feedforward velocity inversion $\dot{x}_d$ is indispensable in high-speed robot tracking; feedback alone always lags by phase angle $\phi = \arctan(\omega_0/k_p)$.

---

#### Problem 12.9: The Manipulability Gradient for Redundancy Optimization
**Statement:**
For a redundant manipulator with Jacobian $J(q) \in \mathbb{R}^{m \times n}$ ($n > m$), the secondary objective is to maximize the Yoshikawa manipulability index $w(q) = \sqrt{\det(J J^T)}$.
Prove that the gradient of manipulability with respect to joint variable $q_i$ is given by:
$$\frac{\partial w}{\partial q_i} = w \operatorname{tr}\left( (J J^T)^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$
and detail how this expression is computed using the SVD of $J$.

**Given Data:**
- $w = \sqrt{\det(A)}$ where $A = J J^T \in \mathbb{R}^{m \times m}$.

**Step-by-Step Derivation:**
1. Using Jacobi's formula for the derivative of a determinant:
   $$\frac{\partial}{\partial q_i} \det(A) = \det(A) \operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right)$$
2. Since $w = (\det(A))^{1/2}$:
   $$\frac{\partial w}{\partial q_i} = \frac{1}{2} (\det(A))^{-1/2} \frac{\partial}{\partial q_i} \det(A) = \frac{1}{2 w} \left[ w^2 \operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right) \right] = \frac{w}{2} \operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right)$$
3. Compute $\frac{\partial A}{\partial q_i}$:
   $$A = J J^T \implies \frac{\partial A}{\partial q_i} = \frac{\partial J}{\partial q_i} J^T + J \left(\frac{\partial J}{\partial q_i}\right)^T$$
4. Substitute into the trace:
   $$\operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right) = \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T + A^{-1} J \left(\frac{\partial J}{\partial q_i}\right)^T \right)$$
   Using cyclic permutation of trace $\operatorname{tr}(X^T) = \operatorname{tr}(X)$ and symmetry of $A^{-1}$:
   $$\operatorname{tr}\left( A^{-1} J \left(\frac{\partial J}{\partial q_i}\right)^T \right) = \operatorname{tr}\left( \frac{\partial J}{\partial q_i} J^T A^{-1} \right) = \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$
5. Combining both terms:
   $$\operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right) = 2 \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$
6. Substituting back into $\frac{\partial w}{\partial q_i}$:
   $$\frac{\partial w}{\partial q_i} = \frac{w}{2} \left[ 2 \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T \right) \right] = w \operatorname{tr}\left( (J J^T)^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$

**Final Answer:**
- Formula proven: $\frac{\partial w}{\partial q_i} = w \operatorname{tr}\left( (J J^T)^{-1} \frac{\partial J}{\partial q_i} J^T \right)$.

**Verification:**
In terms of SVD $J = U \Sigma V^T$: $(J J^T)^{-1} = U \Sigma^{-2} U^T$. Then $(J J^T)^{-1} J = U \Sigma^{-1} V^T$. Thus $\frac{\partial w}{\partial q_i} = w \operatorname{tr}\left( U \Sigma^{-1} V^T \left(\frac{\partial J}{\partial q_i}\right)^T \right)$, demonstrating numerical stability without direct matrix inversion.

---

#### Problem 12.10: Quadratic Invariant of the Moore-Penrose Pseudoinverse
**Statement:**
Prove that the Moore-Penrose pseudoinverse solution $\dot{q}_{\text{opt}} = J^+ \dot{x}$ strictly minimizes the kinetic energy norm $T_q = \frac{1}{2} \dot{q}^T \dot{q}$ subject to the linear task constraint $J \dot{q} = \dot{x}$.
Prove that any other valid solution $\dot{q}' = \dot{q}_{\text{opt}} + v$ with $J v = 0$ satisfies $\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}}\|^2 + \|v\|^2 \ge \|\dot{q}_{\text{opt}}\|^2$.

**Given Data:**
- $J \in \mathbb{R}^{m \times n}$ ($m < n$, full rank $m$).
- $\dot{q}_{\text{opt}} = J^+ \dot{x} = J^T (J J^T)^{-1} \dot{x}$.
- Alternative solution $\dot{q}'$ such that $J \dot{q}' = \dot{x}$.

**Step-by-Step Derivation:**
1. Let $v = \dot{q}' - \dot{q}_{\text{opt}}$.
   Multiplying by $J$:
   $$J v = J(\dot{q}' - \dot{q}_{\text{opt}}) = J \dot{q}' - J \dot{q}_{\text{opt}} = \dot{x} - \dot{x} = 0$$
   Thus, $v \in \mathcal{N}(J)$ lies strictly in the nullspace of $J$.
2. Compute the squared Euclidean norm of $\dot{q}'$:
   $$\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}} + v\|^2 = (\dot{q}_{\text{opt}} + v)^T (\dot{q}_{\text{opt}} + v) = \dot{q}_{\text{opt}}^T \dot{q}_{\text{opt}} + 2 \dot{q}_{\text{opt}}^T v + v^T v$$
3. Examine the cross-term $\dot{q}_{\text{opt}}^T v$:
   $$\dot{q}_{\text{opt}}^T v = \left( J^T (J J^T)^{-1} \dot{x} \right)^T v = \dot{x}^T (J J^T)^{-1} J v$$
4. Since $J v = 0$:
   $$\dot{q}_{\text{opt}}^T v = \dot{x}^T (J J^T)^{-1} (0) = 0$$
   The vector $\dot{q}_{\text{opt}}$ is strictly orthogonal to any nullspace vector $v$.
5. Therefore:
   $$\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}}\|^2 + \|v\|^2$$
   Since $\|v\|^2 \ge 0$:
   $$\|\dot{q}'\|^2 \ge \|\dot{q}_{\text{opt}}\|^2$$
   Equality holds if and only if $v = 0 \iff \dot{q}' = \dot{q}_{\text{opt}}$.

**Final Answer:**
- $\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}}\|^2 + \|v\|^2 \ge \|\dot{q}_{\text{opt}}\|^2$.
- The pseudoinverse uniquely yields the global minimum Euclidean norm solution.

**Verification:**
This is the infinite-dimensional Pythagorean theorem in $\mathbb{R}^n$ partitioned into the row space $\mathcal{R}(J^T)$ and null space $\mathcal{N}(J)$. Since $\dot{q}_{\text{opt}} \in \mathcal{R}(J^T)$ and $v \in \mathcal{N}(J)$, their inner product is identically zero.

---

## 12.3 Capstone Mastery Problems (Problems 12.11 – 12.20)

#### Problem 12.11: Industrial Pick-and-Place Trajectory Synthesis with 6-DoF CLIK
**Statement:**
An industrial robot manipulates an electronic component between two fixture poses:
- Pose A: $p_A = [0.4, 0.2, 0.1]^T\text{ m}, \quad q_A = [1, 0, 0, 0]^T$
- Pose B: $p_B = [0.6, -0.3, 0.4]^T\text{ m}, \quad q_B = [0.7071, 0, 0.7071, 0]^T$
Total transit time is $T = 2.0\text{ s}$. 
1. Parameterize the cartesian path $p(t)$ and orientation quaternion $q(t)$ using a minimum-jerk quintic polynomial $s(t)$.
2. Evaluate the desired position $p_d$, linear velocity $\dot{p}_d$, quaternion $q_d$, and angular velocity $\omega_d$ at $t = 1.0\text{ s}$.

**Given Data:**
- $T = 2.0\text{ s}$, midpoint $t = 1.0\text{ s} \implies \tau = t/T = 0.5$.
- $p_A = [0.4, 0.2, 0.1]^T, p_B = [0.6, -0.3, 0.4]^T$.
- $q_A = [1, 0, 0, 0]^T, q_B = [1/\sqrt{2}, 0, 1/\sqrt{2}, 0]^T$.

**Step-by-Step Derivation:**
1. At midpoint $\tau = 0.5$:
   $$s(0.5) = 10(0.5)^3 - 15(0.5)^4 + 6(0.5)^5 = 10(0.125) - 15(0.0625) + 6(0.03125) = 1.25 - 0.9375 + 0.1875 = 0.5$$
   $$\dot{s}(0.5) = \frac{15}{8 T} = \frac{15}{8(2.0)} = \frac{15}{16} = 0.9375\text{ s}^{-1}$$
2. Cartesian Position at $t = 1.0\text{ s}$:
   $$p_d(1.0) = p_A + 0.5(p_B - p_A) = \begin{bmatrix} 0.4 \\ 0.2 \\ 0.1 \end{bmatrix} + 0.5 \begin{bmatrix} 0.2 \\ -0.5 \\ 0.3 \end{bmatrix} = \begin{bmatrix} 0.5 \\ -0.05 \\ 0.25 \end{bmatrix}\text{ m}$$
3. Cartesian Linear Velocity at $t = 1.0\text{ s}$:
   $$\dot{p}_d(1.0) = \dot{s}(0.5) (p_B - p_A) = 0.9375 \begin{bmatrix} 0.2 \\ -0.5 \\ 0.3 \end{bmatrix} = \begin{bmatrix} 0.1875 \\ -0.46875 \\ 0.28125 \end{bmatrix}\text{ m/s}$$
4. Quaternion Interpolation:
   $\cos\Omega = q_A \cdot q_B = 1(1/\sqrt{2}) = 1/\sqrt{2} \implies \Omega = \pi/4\text{ rad} = 45^\circ$.
   At $s = 0.5$:
   $$q_d(0.5) = \frac{\sin(\pi/8)}{\sin(\pi/4)} q_A + \frac{\sin(\pi/8)}{\sin(\pi/4)} q_B$$
   $\sin(\pi/4) = 1/\sqrt{2} \approx 0.7071$. $\sin(\pi/8) = \frac{\sqrt{2 - \sqrt{2}}}{2} \approx 0.382683$.
   $$\frac{\sin(\pi/8)}{\sin(\pi/4)} = \frac{0.382683}{0.707107} = 0.541196$$
   $$q_d = 0.541196 \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix} + 0.541196 \begin{bmatrix} 1/\sqrt{2} \\ 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 0.541196 + 0.382683 \\ 0 \\ 0.382683 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.92388 \\ 0 \\ 0.38268 \\ 0 \end{bmatrix}$$
   (Note: $\cos(22.5^\circ) \approx 0.92388, \sin(22.5^\circ) \approx 0.38268$, exact half-angle of $45^\circ$).
5. Angular Velocity:
   The rotation is around the y-axis ($\hat{u} = [0, 1, 0]^T$) by total physical angle $\theta = 2\Omega = \pi/2 = 90^\circ$.
   $$\omega_d(1.0) = 2 \Omega \dot{s} \hat{u} = 2 \left(\frac{\pi}{4}\right) (0.9375) \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \frac{\pi}{2}(0.9375) \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} \approx \begin{bmatrix} 0 \\ 1.4726 \\ 0 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
- $p_d(1.0) = [0.5, -0.05, 0.25]^T\text{ m}$.
- $\dot{p}_d(1.0) = [0.1875, -0.46875, 0.28125]^T\text{ m/s}$.
- $q_d(1.0) = [0.9239, 0, 0.3827, 0]^T$.
- $\omega_d(1.0) = [0, 1.4726, 0]^T\text{ rad/s}$.

**Verification:**
Norm of quaternion: $0.92388^2 + 0.38268^2 = 0.85355 + 0.14645 = 1.0000$. Velocity matches derivative of displacement profile exactly.

---

#### Problem 12.12: 7-DoF Redundant Kinematic Control with Obstacle Repulsion
**Statement:**
A 7-DoF manipulator tracks a 3D position command with Jacobian $J \in \mathbb{R}^{3 \times 7}$. The elbow point $p_{\text{elbow}}(q) \in \mathbb{R}^3$ has Jacobian $J_{\text{elbow}} \in \mathbb{R}^{3 \times 7}$. An obstacle is located at $p_{\text{obs}} \in \mathbb{R}^3$.
To prevent collision, the secondary objective minimizes the potential $V_{\text{obs}}(q) = \frac{1}{2} \frac{1}{\|p_{\text{elbow}} - p_{\text{obs}}\|^2}$.
Formulate the exact joint velocity command $\dot{q}$ ensuring asymptotic tracking of task velocity $\dot{x}_d$ while repelling the elbow away from the obstacle.

**Given Data:**
- Task Jacobian $J \in \mathbb{R}^{3 \times 7}$, elbow Jacobian $J_{\text{elbow}} \in \mathbb{R}^{3 \times 7}$.
- Distance vector $d = p_{\text{elbow}} - p_{\text{obs}}$, distance $r = \|d\|$.

**Step-by-Step Derivation:**
1. Compute the gradient of $V_{\text{obs}}$ with respect to joint angles $q$:
   $$V_{\text{obs}} = \frac{1}{2} r^{-2}$$
   Using the chain rule:
   $$\nabla_q V_{\text{obs}} = \left( \frac{\partial p_{\text{elbow}}}{\partial q} \right)^T \nabla_{p_{\text{elbow}}} V_{\text{obs}} = J_{\text{elbow}}^T \left( -r^{-3} \frac{d}{r} \right) = -J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$$
2. The repulsive velocity gradient descent direction is:
   $$v_{\text{sec}} = -\nabla_q V_{\text{obs}} = +J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$$
3. Project $v_{\text{sec}}$ into the nullspace of the primary task Jacobian $J$:
   $$P = I_7 - J^+ J$$
4. The complete joint velocity control law with $\operatorname{CLIK}$ feedback is:
   $$\dot{q} = J^+ \left( \dot{x}_d + K_p (x_d - x) \right) + k_{\text{obs}} (I_7 - J^+ J) J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$$
   where $k_{\text{obs}} > 0$ is the obstacle avoidance gain.

**Final Answer:**
- Control law: $\dot{q} = J^+ (\dot{x}_d + K_p e) + k_{\text{obs}} (I - J^+ J) J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$.
- Primary task execution is mathematically untouched because $J (I - J^+ J) \equiv 0$.

**Verification:**
When $p_{\text{elbow}}$ approaches $p_{\text{obs}}$, the repulsive term scales as $r^{-3}$, driving joint velocities along the self-motion manifold to swing the elbow away while the hand continues uninterrupted along its trajectory.

---

#### Problem 12.13: Adaptive DLS Traversal of an Interior Singularity
**Statement:**
A 2-link planar arm with $l_1 = 1.0\text{ m}, l_2 = 1.0\text{ m}$ is tracking a straight line that crosses the boundary singularity $q_2 = 0$ (fully extended arm $x = 2.0\text{ m}$).
At pose $q = [0, 0.05]^T\text{ rad}$, the Jacobian is:
$$J = \begin{bmatrix} -l_1\sin q_1 - l_2\sin(q_1+q_2) & -l_2\sin(q_1+q_2) \\ l_1\cos q_1 + l_2\cos(q_1+q_2) & l_2\cos(q_1+q_2) \end{bmatrix} = \begin{bmatrix} -0.04998 & -0.04998 \\ 2.99875 & 0.99875 \end{bmatrix} \approx \begin{bmatrix} -0.05 & -0.05 \\ 2.00 & 1.00 \end{bmatrix}$$
The desired operational velocity is $\dot{x}_d = [1.0, 0]^T\text{ m/s}$ (commanding motion in the singular direction).
1. Compute the unregularized pseudoinverse joint velocity $\dot{q}_{\text{pinv}} = J^{-1} \dot{x}_d$.
2. Compute the adaptive DLS damping $\lambda^2$ with $w_0 = 0.2$ and $\lambda_0 = 0.1$.
3. Compute the regularized joint velocity $\dot{q}_{\text{DLS}} = J^T (J J^T + \lambda^2 I)^{-1} \dot{x}_d$ and compare the joint velocity magnitudes.

**Given Data:**
- $J = \begin{bmatrix} -0.05 & -0.05 \\ 2.00 & 1.00 \end{bmatrix}$, $\dot{x}_d = [1.0, 0]^T$.
- $w_0 = 0.2$, $\lambda_0 = 0.1$.

**Step-by-Step Derivation:**
1. Determinant of $J$:
   $$\det(J) = (-0.05)(1.00) - (-0.05)(2.00) = -0.05 + 0.10 = 0.05$$
   Manipulability index:
   $$w = |\det(J)| = 0.05$$
2. Unregularized Inverse:
   $$J^{-1} = \frac{1}{0.05} \begin{bmatrix} 1.00 & 0.05 \\ -2.00 & -0.05 \end{bmatrix} = \begin{bmatrix} 20 & 1 \\ -40 & -1 \end{bmatrix}$$
   $$\dot{q}_{\text{pinv}} = J^{-1} \begin{bmatrix} 1.0 \\ 0 \end{bmatrix} = \begin{bmatrix} 20 \\ -40 \end{bmatrix}\text{ rad/s}$$
   $$\|\dot{q}_{\text{pinv}}\| = \sqrt{20^2 + (-40)^2} = \sqrt{2000} \approx 44.72\text{ rad/s}$$
   This velocity is dangerously high, exceeding physical motor capabilities.
3. Adaptive Damping Computation:
   Since $w = 0.05 < w_0 = 0.2$:
   $$\lambda^2 = \lambda_0^2 \left( 1 - \frac{w}{w_0} \right)^2 = (0.1)^2 \left( 1 - \frac{0.05}{0.2} \right)^2 = 0.01 (1 - 0.25)^2 = 0.01 (0.75)^2 = 0.01 (0.5625) = 0.005625$$
4. Compute $J J^T + \lambda^2 I$:
   $$J J^T = \begin{bmatrix} (-0.05)^2 + (-0.05)^2 & (-0.05)(2) + (-0.05)(1) \\ (-0.05)(2) + (-0.05)(1) & 2^2 + 1^2 \end{bmatrix} = \begin{bmatrix} 0.005 & -0.15 \\ -0.15 & 5.0 \end{bmatrix}$$
   $$J J^T + \lambda^2 I = \begin{bmatrix} 0.005 + 0.005625 & -0.15 \\ -0.15 & 5.0 + 0.005625 \end{bmatrix} = \begin{bmatrix} 0.010625 & -0.15 \\ -0.15 & 5.005625 \end{bmatrix}$$
   Determinant:
   $$\det = (0.010625)(5.005625) - (-0.15)^2 = 0.053185 - 0.022500 = 0.030685$$
   Inverse:
   $$(J J^T + \lambda^2 I)^{-1} = \frac{1}{0.030685} \begin{bmatrix} 5.005625 & 0.15 \\ 0.15 & 0.010625 \end{bmatrix} = \begin{bmatrix} 163.13 & 4.89 \\ 4.89 & 0.346 \end{bmatrix}$$
5. Compute DLS velocity:
   $$v_x = (J J^T + \lambda^2 I)^{-1} \begin{bmatrix} 1.0 \\ 0 \end{bmatrix} = \begin{bmatrix} 163.13 \\ 4.89 \end{bmatrix}$$
   $$\dot{q}_{\text{DLS}} = J^T v_x = \begin{bmatrix} -0.05 & 2.00 \\ -0.05 & 1.00 \end{bmatrix} \begin{bmatrix} 163.13 \\ 4.89 \end{bmatrix} = \begin{bmatrix} -0.05(163.13) + 2(4.89) \\ -0.05(163.13) + 1(4.89) \end{bmatrix} = \begin{bmatrix} -8.1565 + 9.7800 \\ -8.1565 + 4.8900 \end{bmatrix} = \begin{bmatrix} 1.6235 \\ -3.2665 \end{bmatrix}\text{ rad/s}$$
   $$\|\dot{q}_{\text{DLS}}\| = \sqrt{1.6235^2 + (-3.2665)^2} = \sqrt{2.6357 + 10.6700} = \sqrt{13.3057} \approx 3.65\text{ rad/s}$$

**Final Answer:**
- Unregularized: $\dot{q} = [20, -40]^T\text{ rad/s}$ ($\|\dot{q}\| \approx 44.72\text{ rad/s}$).
- Adaptive DLS: $\dot{q} \approx [1.62, -3.27]^T\text{ rad/s}$ ($\|\dot{q}\| \approx 3.65\text{ rad/s}$).
- Velocity amplification suppressed by over $91.8\%$, preserving servo stability.

**Verification:**
The DLS solution trades off a minor tracking velocity error along the degenerate radial direction for a $12\times$ reduction in joint velocity demand.

---

#### Problem 12.14: Dual-Arm Cooperative Kinematic Grasping
**Statement:**
Two 3-DoF planar arms (Left and Right) cooperatively hold a rigid object of length $L = 0.4\text{ m}$ horizontally.
Left arm base is at $p_{0L} = [0, 0]^T$; Right arm base is at $p_{0R} = [1.2, 0]^T$.
The object center is commanded to move with velocity $\dot{x}_{\text{obj}} = [0.1, 0.2]^T\text{ m/s}$ and rotate at $\omega_{\text{obj}} = 0.5\text{ rad/s}$.
1. Formulate the kinematic grasp matrix $G \in \mathbb{R}^{3 \times 6}$ relating the contact velocities $\dot{x}_L, \dot{x}_R$ to the object velocity $\dot{x}_{\text{obj}}$.
2. Compute the required individual operational velocities $\dot{x}_L$ and $\dot{x}_R$ for the two arms.

**Given Data:**
- Object center at $p_{\text{obj}}$, orientation horizontal.
- Left grasp point offset: $r_L = [-0.2, 0]^T\text{ m}$.
- Right grasp point offset: $r_R = [+0.2, 0]^T\text{ m}$.
- $\dot{x}_{\text{obj}} = [0.1, 0.2]^T\text{ m/s}$, $\omega_{\text{obj}} = 0.5\text{ rad/s}$.

**Step-by-Step Derivation:**
1. Rigid body velocity kinematics for contact point $i$:
   $$\dot{p}_i = \dot{p}_{\text{obj}} + \omega_{\text{obj}} \times r_i$$
   In 2D planar coordinates, with $\omega_{\text{obj}} = \omega \hat{k}$ and $r_i = [r_{ix}, r_{iy}]^T$:
   $$\omega \times r_i = \begin{bmatrix} -\omega r_{iy} \\ \omega r_{ix} \end{bmatrix}$$
2. For Left Grasp Point ($r_L = [-0.2, 0]^T$):
   $$\dot{p}_L = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} -0.5(0) \\ 0.5(-0.2) \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} 0 \\ -0.1 \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.1 \end{bmatrix}\text{ m/s}$$
   Orientation velocity: $\dot{\phi}_L = \omega_{\text{obj}} = 0.5\text{ rad/s}$.
   Full operational velocity vector: $\dot{x}_L = [0.1, 0.1, 0.5]^T$.
3. For Right Grasp Point ($r_R = [+0.2, 0]^T$):
   $$\dot{p}_R = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} -0.5(0) \\ 0.5(+0.2) \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} 0 \\ +0.1 \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.3 \end{bmatrix}\text{ m/s}$$
   Orientation velocity: $\dot{\phi}_R = \omega_{\text{obj}} = 0.5\text{ rad/s}$.
   Full operational velocity vector: $\dot{x}_R = [0.1, 0.3, 0.5]^T$.
4. Grasp Matrix:
   $$\begin{bmatrix} \dot{x}_L \\ \dot{x}_R \end{bmatrix} = G^T \dot{x}_{\text{obj}} = \begin{bmatrix} I_2 & \begin{bmatrix} 0 \\ -0.2 \end{bmatrix} \\ 0 & 1 \\ I_2 & \begin{bmatrix} 0 \\ +0.2 \end{bmatrix} \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \dot{p}_{\text{obj}} \\ \omega_{\text{obj}} \end{bmatrix}$$

**Final Answer:**
- Left arm end-effector velocity: $\dot{x}_L = [0.1, 0.1, 0.5]^T$ ($v_x = 0.1\text{ m/s}, v_y = 0.1\text{ m/s}, \omega = 0.5\text{ rad/s}$).
- Right arm end-effector velocity: $\dot{x}_R = [0.1, 0.3, 0.5]^T$ ($v_x = 0.1\text{ m/s}, v_y = 0.3\text{ m/s}, \omega = 0.5\text{ rad/s}$).

**Verification:**
Relative velocity $\dot{p}_R - \dot{p}_L = [0, 0.2]^T\text{ m/s}$.
The rate of change of orientation is $\dot{\theta} = \frac{(\dot{p}_R - \dot{p}_L)_y}{L} = \frac{0.2}{0.4} = 0.5\text{ rad/s} = \omega_{\text{obj}}$, preserving rigid grasp constraints.

---

#### Problem 12.15: Image-Based Visual Servoing (IBVS) Kinematics Integration
**Statement:**
A camera mounted on a robot end-effector observes a feature point with image plane coordinates $s = [u, v]^T$ (in normalized coordinates). 
The interaction matrix (image Jacobian) $L_s \in \mathbb{R}^{2 \times 6}$ relates camera spatial twist $\mathcal{V}_c = [v_c; \omega_c]$ to image feature velocity $\dot{s}$:
$$L_s = \begin{bmatrix} -\frac{1}{Z} & 0 & \frac{u}{Z} & uv & -(1+u^2) & v \\ 0 & -\frac{1}{Z} & \frac{v}{Z} & 1+v^2 & -uv & -u \end{bmatrix}$$
The robot's geometric Jacobian in camera frame is $J_c(q) \in \mathbb{R}^{6 \times 6}$.
Given depth $Z = 1.0\text{ m}$, current feature at $[u, v] = [0.2, -0.1]$, desired feature at $[u_d, v_d] = [0, 0]$, and servo gain $\lambda_{\text{cam}} = 4.0\text{ s}^{-1}$:
1. Compute the numerical interaction matrix $L_s$.
2. Formulate the complete mapping from image error $e_s = s - s_d$ to joint velocities $\dot{q}$.

**Given Data:**
- $u = 0.2, v = -0.1, Z = 1.0\text{ m}$, $s_d = [0, 0]^T$.
- Error: $e_s = [0.2, -0.1]^T$. Gain $\lambda_{\text{cam}} = 4.0\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. Evaluate entries of $L_s$:
   - Row 1:
     $$L_{11} = -1/1.0 = -1.0$$
     $$L_{12} = 0$$
     $$L_{13} = 0.2 / 1.0 = 0.2$$
     $$L_{14} = (0.2)(-0.1) = -0.02$$
     $$L_{15} = -(1 + 0.2^2) = -(1 + 0.04) = -1.04$$
     $$L_{16} = -0.1$$
   - Row 2:
     $$L_{21} = 0$$
     $$L_{22} = -1/1.0 = -1.0$$
     $$L_{23} = -0.1 / 1.0 = -0.1$$
     $$L_{24} = 1 + (-0.1)^2 = 1 + 0.01 = 1.01$$
     $$L_{25} = -(0.2)(-0.1) = 0.02$$
     $$L_{26} = -0.2$$
2. Interaction Matrix:
   $$L_s = \begin{bmatrix} -1.0 & 0 & 0.2 & -0.02 & -1.04 & -0.1 \\ 0 & -1.0 & -0.1 & 1.01 & 0.02 & -0.2 \end{bmatrix}$$
3. Desired camera velocity:
   $$\mathcal{V}_c = -\lambda_{\text{cam}} L_s^+ e_s$$
4. Complete mapping to joint velocities:
   Since $\mathcal{V}_c = J_c(q) \dot{q}$:
   $$J_c(q) \dot{q} = -\lambda_{\text{cam}} L_s^+ e_s$$
   $$\dot{q} = -\lambda_{\text{cam}} (L_s J_c(q))^+ e_s$$
   where $J_{\text{image}} = L_s J_c(q) \in \mathbb{R}^{2 \times 6}$ is the combined visual-kinematic Jacobian.

**Final Answer:**
- $L_s = \begin{bmatrix} -1.0 & 0 & 0.2 & -0.02 & -1.04 & -0.1 \\ 0 & -1.0 & -0.1 & 1.01 & 0.02 & -0.2 \end{bmatrix}$.
- Joint velocity law: $\dot{q} = -\lambda_{\text{cam}} (L_s J_c(q))^+ e_s$.

**Verification:**
Exponential error decay: $\dot{e}_s = L_s \mathcal{V}_c = L_s (-\lambda_{\text{cam}} L_s^+ e_s) = -\lambda_{\text{cam}} e_s \implies e_s(t) = e_s(0) e^{-\lambda_{\text{cam}} t}$.

---

#### Problem 12.16: Real-Time 1 kHz Kinematic Loop Execution Budget
**Statement:**
A hard real-time robot controller executes an operational space $\operatorname{CLIK}$ cycle at $f_s = 1000\text{ Hz}$ ($1.0\text{ ms}$ deadline).
The cycle performs:
1. 6-link forward kinematics via homogeneous transformation products.
2. Geometric Jacobian computation ($6 \times 6$).
3. Singular value decomposition (SVD) and manipulability calculation.
4. Matrix inversion for DLS: $(J J^T + \lambda^2 I)^{-1}$.
5. Velocity update: $\dot{q} = J^T (J J^T + \lambda^2 I)^{-1} (\dot{x}_d + K_p e)$.
Calculate the theoretical FLOP count for each operation, determine the total FLOPs per tick, and compute the processor utilization on a 2.0 GHz single-core embedded ARM Cortex-A53 processor executing 1 FLOP per cycle.

**Given Data:**
- Matrix sizes: $m = 6, n = 6$.
- Processor: 2.0 GHz ($2 \times 10^9\text{ FLOP/s}$). Deadline: $T_{\text{cycle}} = 1.0\text{ ms} = 10^{-3}\text{ s}$.

**Step-by-Step Derivation:**
1. **Forward Kinematics (6 links):**
   Each $SE(3)$ transformation product requires multiplying a $3 \times 3$ rotation matrix and adding translation ($27 \text{ mul} + 18 \text{ add} + 3 \text{ add} = 48\text{ FLOPs}$).
   For 5 successive transforms: $5 \times 48 = 240\text{ FLOPs}$.
2. **Geometric Jacobian ($6 \times 6$):**
   For each revolute joint $i$: compute cross product $z_{i-1} \times (p_e - p_{i-1})$ ($6 \text{ mul} + 3 \text{ sub} = 9\text{ FLOPs}$).
   Across 6 joints: $6 \times (9 + 3 \text{ sub}) = 72\text{ FLOPs}$.
3. **Matrix Multiplication $J J^T$ ($6 \times 6$):**
   Symmetric matrix multiplication requires $\frac{m(m+1)}{2} \times (2n - 1) = \frac{6 \times 7}{2} \times 11 = 21 \times 11 = 231\text{ FLOPs}$.
   Adding damping $\lambda^2 I_6$: $6\text{ FLOPs}$. Total: $237\text{ FLOPs}$.
4. **Matrix Inversion of $6 \times 6$ symmetric matrix:**
   Cholesky decomposition $L L^T = A$: $\frac{1}{3} m^3 = \frac{1}{3}(216) = 72\text{ FLOPs}$.
   Forward/backward substitution to invert: $m^3 = 216\text{ FLOPs}$. Total: $\approx 288\text{ FLOPs}$.
5. **Joint Velocity Computation:**
   - Error term $\dot{x}_d + K_p e$: $6 \text{ mul} + 12 \text{ add} = 18\text{ FLOPs}$.
   - Vector solve $(J J^T + \lambda^2 I)^{-1} v$: $2 \times 6^2 = 72\text{ FLOPs}$.
   - Matrix-vector multiply $J^T w$: $2 \times 6 \times 6 = 72\text{ FLOPs}$.
   - Integration $q_{k+1} = q_k + \Delta t \dot{q}$: $6 \text{ mul} + 6 \text{ add} = 12\text{ FLOPs}$.
6. **Total FLOPs per Cycle:**
   $$\text{Total FLOPs} = 240 + 72 + 237 + 288 + 18 + 72 + 72 + 12 \approx 1,011\text{ FLOPs}$$
7. **Execution Time and CPU Load:**
   $$\text{Execution Time} = \frac{1,011\text{ FLOPs}}{2.0 \times 10^9\text{ FLOP/s}} = 5.055 \times 10^{-7}\text{ s} \approx 0.506\text{ }\mu\text{s}$$
   $$\text{CPU Utilization} = \frac{0.506\text{ }\mu\text{s}}{1000\text{ }\mu\text{s}} \times 100\% \approx 0.051\%$$

**Final Answer:**
- Computational budget: $\approx 1,011\text{ FLOPs}$ per 1 kHz cycle.
- Execution time: $\approx 0.51\text{ }\mu\text{s}$.
- Processor load: $\approx 0.05\%$ on a 2.0 GHz ARM core.

**Verification:**
Even with conservative cache misses and SVD overhead ($\approx 10,000\text{ FLOPs}$), total execution takes $< 5\text{ }\mu\text{s}$, well within the $1,000\text{ }\mu\text{s}$ deadline (leaving $> 99\%$ CPU headroom for vision and planning).

---

#### Problem 12.17: Singularity-Free Spherical Wrist Inverse Kinematics Implementation
**Statement:**
In a spherical wrist ($z_4, z_5, z_6$ intersecting at $p_w$), the relative orientation matrix is $R_6^3 = R_z(q_4) R_y(q_5) R_z(q_6)$:
$$R_6^3 = \begin{bmatrix} c_4 c_5 c_6 - s_4 s_6 & -c_4 c_5 s_6 - s_4 c_6 & c_4 s_5 \\ s_4 c_5 c_6 + c_4 s_6 & -s_4 c_5 s_6 + c_4 c_6 & s_4 s_5 \\ -s_5 c_6 & s_5 s_6 & c_5 \end{bmatrix}$$
When $q_5 \approx 0$ (wrist singularity), axes $z_4$ and $z_6$ become collinear, causing $q_4$ and $q_6$ to become linearly dependent ($\theta_{\text{total}} = q_4 + q_6$).
Design a deterministic software branching rule in TypeScript that:
1. Detects $|s_5| < 10^{-6}$.
2. Assigns $q_4 = 0$ (or keeps previous $q_4$) to resolve the redundancy.
3. Computes the resulting exact angle $q_6$.

**Given Data:**
- Numerical threshold $\epsilon = 10^{-6}$.
- Target matrix $R = R_6^3 \in SO(3)$.

**Step-by-Step Derivation:**
1. Compute $\cos(q_5) = R_{33}$.
   Clamping to valid range: $\cos(q_5) = \operatorname{clip}(R_{33}, -1.0, 1.0)$.
   $$q_5 = \operatorname{atan2}\left( \sqrt{R_{31}^2 + R_{32}^2}, \; R_{33} \right)$$
2. Check singularity condition:
   $$\sin(q_5) = \sqrt{R_{31}^2 + R_{32}^2}$$
3. **Singular Case 1: $\sin(q_5) < \epsilon$ with $R_{33} > 0$ ($q_5 \approx 0$):**
   When $q_5 = 0$:
   $$R_6^3 = \begin{bmatrix} c_4 c_6 - s_4 s_6 & -c_4 s_6 - s_4 c_6 & 0 \\ s_4 c_6 + c_4 s_6 & -s_4 s_6 + c_4 c_6 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \cos(q_4 + q_6) & -\sin(q_4 + q_6) & 0 \\ \sin(q_4 + q_6) & \cos(q_4 + q_6) & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   Set $q_4 = q_{4,\text{prev}}$ (or $0$).
   Then $q_6 = \operatorname{atan2}(R_{21}, R_{11}) - q_4$.
4. **Singular Case 2: $\sin(q_5) < \epsilon$ with $R_{33} < 0$ ($q_5 \approx \pi$):**
   When $q_5 = \pi$:
   $$R_6^3 = \begin{bmatrix} -c_4 c_6 - s_4 s_6 & c_4 s_6 - s_4 c_6 & 0 \\ -s_4 c_6 + c_4 s_6 & s_4 s_6 + c_4 c_6 & 0 \\ 0 & 0 & -1 \end{bmatrix} = \begin{bmatrix} -\cos(q_4 - q_6) & \sin(q_4 - q_6) & 0 \\ -\sin(q_4 - q_6) & -\cos(q_4 - q_6) & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   Set $q_4 = q_{4,\text{prev}}$ (or $0$).
   Then $q_6 = q_4 - \operatorname{atan2}(-R_{21}, -R_{11})$.
5. **Regular Case ($\sin(q_5) \ge \epsilon$):**
   $$q_4 = \operatorname{atan2}(R_{23}, R_{13})$$
   $$q_6 = \operatorname{atan2}(R_{32}, -R_{31})$$

**Final Answer:**
- Regular: $q_4 = \operatorname{atan2}(R_{23}, R_{13}), q_5 = \operatorname{atan2}(\sqrt{R_{31}^2 + R_{32}^2}, R_{33}), q_6 = \operatorname{atan2}(R_{32}, -R_{31})$.
- Singular ($q_5 \approx 0$): $q_4 = q_{4,\text{prev}}, q_5 = 0, q_6 = \operatorname{atan2}(R_{21}, R_{11}) - q_{4,\text{prev}}$.

**Verification:**
When $q_4 = 0$, $R_{11} = \cos(q_6), R_{21} = \sin(q_6)$, reproducing the exact 3D orientation without division by zero.

---

#### Problem 12.18: Constrained Quintic Polynomial with Intermediate Velocity Saturation
**Statement:**
A joint must transition $\Delta q = 3.0\text{ rad}$ in $T = 1.5\text{ s}$ using a quintic polynomial. The actuator has a strict hardware velocity limit $v_{\lim} = 3.5\text{ rad/s}$.
1. Compute the peak velocity $\dot{q}_{\max}$ of the standard quintic profile.
2. Determine whether the velocity limit is violated.
3. If violated, compute the scaled minimum duration $T_{\text{new}}$ that strictly respects $v_{\lim}$.

**Given Data:**
- $\Delta q = 3.0\text{ rad}$, $T = 1.5\text{ s}$, $v_{\lim} = 3.5\text{ rad/s}$.

**Step-by-Step Derivation:**
1. Peak velocity of standard quintic profile:
   $$\dot{q}_{\max} = \frac{15 \Delta q}{8 T} = \frac{15 \times 3.0}{8 \times 1.5} = \frac{45.0}{12.0} = 3.75\text{ rad/s}$$
2. Check violation:
   $$\dot{q}_{\max} = 3.75\text{ rad/s} > v_{\lim} = 3.5\text{ rad/s}$$
   The velocity limit is violated by $0.25\text{ rad/s}$ ($7.1\%$ overshoot).
3. Compute scaled minimum duration $T_{\text{new}}$:
   $$T_{\text{new}} = \frac{15 \Delta q}{8 v_{\lim}} = \frac{15 \times 3.0}{8 \times 3.5} = \frac{45.0}{28.0} = \frac{45}{28} \approx 1.60714\text{ s}$$
4. Re-evaluate peak acceleration at $T_{\text{new}}$:
   $$\ddot{q}_{\max} = \frac{10\sqrt{3} \Delta q}{3 T_{\text{new}}^2} = \frac{10\sqrt{3} \times 3.0}{3 \times (1.60714)^2} = \frac{10\sqrt{3}}{2.5829} = \frac{17.3205}{2.5829} \approx 6.7058\text{ rad/s}^2$$

**Final Answer:**
- Initial peak velocity: $3.75\text{ rad/s}$ (violates $3.5\text{ rad/s}$ limit).
- Rescaled duration: $T_{\text{new}} \approx 1.607\text{ s}$.

**Verification:**
At $T = 1.60714\text{ s}$: $\dot{q}_{\max} = \frac{15(3.0)}{8(1.60714)} = \frac{45.0}{12.8571} = 3.5000\text{ rad/s} = v_{\lim}$. Limit is strictly respected.

---

#### Problem 12.19: Complete Verification of Moore-Penrose Conditions
**Statement:**
The Moore-Penrose pseudoinverse $A^+ \in \mathbb{R}^{n \times m}$ of a matrix $A \in \mathbb{R}^{m \times n}$ is the unique matrix satisfying the four Penrose equations:
1. $A A^+ A = A$
2. $A^+ A A^+ = A^+$
3. $(A A^+)^T = A A^+$
4. $(A^+ A)^T = A^+ A$
Prove algebraically that for full row rank matrix $A$ ($\operatorname{rank}(A) = m < n$), the right pseudoinverse $A^+ = A^T (A A^T)^{-1}$ strictly satisfies all four conditions.

**Given Data:**
- $A^+ = A^T (A A^T)^{-1}$, where $A A^T$ is symmetric and invertible ($m \times m$).

**Step-by-Step Derivation:**
1. **Condition 1 ($A A^+ A = A$):**
   $$A A^+ = A \left[ A^T (A A^T)^{-1} \right] = (A A^T) (A A^T)^{-1} = I_m$$
   Multiplying by $A$:
   $$A A^+ A = I_m A = A \quad \checkmark$$
2. **Condition 2 ($A^+ A A^+ = A^+$):**
   $$A^+ (A A^+) = A^+ I_m = A^+ \quad \checkmark$$
3. **Condition 3 ($(A A^+)^T = A A^+$):**
   Since $A A^+ = I_m$:
   $$(A A^+)^T = I_m^T = I_m = A A^+ \quad \checkmark$$
4. **Condition 4 ($(A^+ A)^T = A^+ A$):**
   $$A^+ A = A^T (A A^T)^{-1} A$$
   Taking the transpose:
   $$(A^+ A)^T = \left( A^T (A A^T)^{-1} A \right)^T = A^T \left( (A A^T)^{-1} \right)^T (A^T)^T$$
   Since $(A A^T)^T = (A^T)^T A^T = A A^T$, its inverse is also symmetric:
   $$\left( (A A^T)^{-1} \right)^T = (A A^T)^{-1}$$
   Therefore:
   $$(A^+ A)^T = A^T (A A^T)^{-1} A = A^+ A \quad \checkmark$$

**Final Answer:**
- All four Penrose conditions are proven identically for $A^+ = A^T (A A^T)^{-1}$.
- Uniqueness guarantees that this algebraic formula is the true Moore-Penrose pseudoinverse.

**Verification:**
The projector $P_{\text{range}} = A A^+ = I_m$ projects onto the full task space, while $P_{\text{row}} = A^+ A$ is an orthogonal projection onto the row space of $A$.

---

#### Problem 12.20: Synthesis of the Complete Autonomous Kinematic Architecture
**Statement:**
Synthesize the complete mathematical pipeline of the `robotics-kinematics-engine.ts` autonomous manipulation loop. Given a discrete control tick $k$ with target pose $T_d(t_k) \in SE(3)$, current joint configuration $q_k \in \mathbb{R}^n$, and previous joint configuration $q_{k-1}$:
1. Detail the step-by-step mathematical flow from task-space goal to joint torque command $\tau_k$.
2. Write the complete pseudocode algorithm combining trajectory generation, CLIK drift compensation, adaptive DLS singularity protection, nullspace secondary optimization, and joint limit enforcement.

**Given Data:**
- Sampling period $\Delta t = 0.001\text{ s}$ ($1\text{ kHz}$).
- Redundant 7-DoF manipulator with limits $q_{\min}, q_{\max}$.

**Step-by-Step Derivation:**
1. **Mathematical Pipeline:**
   - **Step 1: Trajectory Interpolation:**
     Evaluate $p_d(t_k), \dot{p}_d(t_k)$ via quintic polynomial $s(t)$ and $q_d(t_k), \omega_d(t_k)$ via unit quaternion $\operatorname{Slerp}$.
   - **Step 2: Forward Kinematics:**
     Compute current end-effector pose $T(q_k) = (R(q_k), p(q_k))$ and link frames via DH or PoE recursion.
   - **Step 3: Operational Error Vector:**
     $$e_p = p_d(t_k) - p(q_k)$$
     $$\Delta q = q(q_k)^{-1} * q_d(t_k) \implies e_o = 2 \operatorname{sgn}(\Delta\eta) \Delta\epsilon$$
     $$e = \begin{bmatrix} e_p \\ e_o \end{bmatrix} \in \mathbb{R}^6, \quad \dot{x}_d = \begin{bmatrix} \dot{p}_d \\ \omega_d \end{bmatrix} \in \mathbb{R}^6$$
   - **Step 4: Geometric Jacobian & Manipulability:**
     Compute $J(q_k) \in \mathbb{R}^{6 \times 7}$. Evaluate $w = \sqrt{\det(J J^T)}$.
   - **Step 5: Adaptive Damping:**
     $$\lambda^2 = \begin{cases} 0 & \text{if } w \ge w_0 \\ \lambda_0^2(1 - w/w_0)^2 & \text{if } w < w_0 \end{cases}$$
   - **Step 6: Primary Inversion & Nullspace Projection:**
     $$J^{*\lambda} = J^T (J J^T + \lambda^2 I_6)^{-1}$$
     $$P = I_7 - J^{*\lambda} J$$
     $$v_{\text{sec}} = -k_{\text{lim}} \nabla_q V_{\text{limit}}(q_k) + k_{\text{mani}} \nabla_q w(q_k)$$
     $$\dot{q}_k = J^{*\lambda} (\dot{x}_d + K_p e) + P v_{\text{sec}}$$
   - **Step 7: Numerical Integration & Joint Limit Safety:**
     $$q_{k+1} = \operatorname{clip}\left( q_k + \Delta t \dot{q}_k, \; q_{\min}, \; q_{\max} \right)$$

2. **Complete Algorithmic Specification:**
```typescript
class AutonomousKinematicLoop {
  step(t: number, dt: number, target: PoseSE3, state: JointState): JointCommand {
    // 1. Trajectory generation
    const { pos: pd, vel: vd } = this.trajPos.evaluate(t);
    const { quat: qd, omega: wd } = this.trajOri.evaluate(t);
    
    // 2. Forward kinematics
    const currentPose = this.chain.forwardKinematics(state.q);
    
    // 3. Pose error computation
    const ep = pd.subtract(currentPose.translation);
    const deltaQ = currentPose.rotation.conjugate().multiply(qd);
    const eo = deltaQ.vector.scale(2.0 * Math.sign(deltaQ.w));
    const e = new Vector6D(ep.x, ep.y, ep.z, eo.x, eo.y, eo.z);
    const v_ref = new Vector6D(vd.x, vd.y, vd.z, wd.x, wd.y, wd.z).add(e.scale(this.Kp));
    
    // 4. Jacobian and manipulability
    const J = this.chain.geometricJacobian(state.q);
    const w = J.manipulabilityIndex();
    
    // 5. Adaptive DLS damping
    const lambdaSq = w < this.w0 ? this.lambda0Sq * Math.pow(1 - w / this.w0, 2) : 0;
    
    // 6. Regularized pseudoinverse and nullspace
    const J_dls = J.dampedLeastSquaresInverse(lambdaSq);
    const q_dot_task = J_dls.multiplyVector(v_ref);
    
    // 7. Nullspace optimization
    const P = Matrix.identity(7).subtract(J_dls.multiply(J));
    const g_lim = this.computeJointLimitGradient(state.q);
    const g_mani = J.manipulabilityGradient(state.q);
    const v_sec = g_lim.scale(-this.k_lim).add(g_mani.scale(this.k_mani));
    const q_dot_null = P.multiplyVector(v_sec);
    
    // 8. Integration and hard limits
    const q_dot = q_dot_task.add(q_dot_null);
    const q_next = state.q.add(q_dot.scale(dt)).clamp(this.q_min, this.q_max);
    
    return { q: q_next, qDot: q_dot };
  }
}
```

**Final Answer:**
- Complete mathematical closed-loop control architecture specified.
- Synthesizes all 12 chapters into an unconditionally stable, singularity-robust, constraint-enforcing real-time kinematics engine.

**Verification:**
The formulation guarantees zero steady-state tracking error ($e \to 0$), zero end-effector perturbation from secondary tasks ($J P \equiv 0$), finite joint velocities across singular points ($\|\dot{q}\| \le \frac{\|v\|}{2\lambda}$), and physical joint limit compliance.
