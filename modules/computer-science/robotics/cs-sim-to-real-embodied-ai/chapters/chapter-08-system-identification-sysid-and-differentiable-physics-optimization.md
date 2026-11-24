# Chapter 8: System Identification (SysID) and Differentiable Physics Optimization

## 8.1 Introduction: Tuning the Simulator to Mirror Reality

While Domain Randomization (DR) trains a policy to be robust across a broad distribution of simulated worlds, there is a fundamental limit to what brute-force randomization can achieve. If the mean of the training distribution is severely misaligned with the physical plant (e.g., the simulator assumes link mass is $2.0\text{ kg}$ when physical hardware is actually $4.5\text{ kg}$), the policy must maintain extreme conservatism to avoid instability, sacrificing athletic dynamic performance.

The complementary counterweight to Domain Randomization is **System Identification (SysID)**.

The objective of System Identification is to systematically calibrate the simulator's internal physical parameters $\theta_{\text{sim}}$ using recorded telemetry trajectories from the real robot:
$$\theta_{\text{sim}}^* = \arg\min_{\theta} \sum_{k=1}^N \mathcal{L}\left( \tau_{\text{real}}(k), \hat{\tau}_{\text{sim}}(k; \theta) \right)$$

Traditionally, robotics relied on classical linear-in-the-parameters rigid-body regression. In recent years, a revolutionary paradigm has emerged: **Differentiable Physics Simulation** (e.g., DiffTaichi, Brax, Isaac Gym Warp, Tiny Differentiable Simulator). By rendering the physics engine itself differentiable end-to-end, engineers can compute analytical gradients of real-world trajectory tracking error directly with respect to physical parameters:
$$\frac{\partial \mathcal{L}}{\partial \theta_{\text{phys}}}$$
enabling gradient descent optimization of masses, friction curves, actuator time constants, and contact parameters in seconds.

```
+---------------------------------------------------------------------------------------------------+
|                        SYSTEM IDENTIFICATION & DIFFERENTIABLE PHYSICS                             |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Real Physical Robot Telemetry                                                                  |
|    D_real = { (q_k, qdot_k, qddot_k, tau_k) }_k=1^N                                               |
|         │                                                                                         |
|         ▼                                                                                         |
|    ┌────────────────────────────────────────────────────────┐                                     |
|    │  CLASSICAL ANALYTICAL REGRESSOR:                        │                                     |
|    │  Linear in Base Parameters: Y(q, qdot, qddot) * theta = tau                                  |
|    │  Closed-Form Solution via Ordinary Least Squares:       │                                     |
|    │  theta_hat = (Y^T * Y)^(-1) * Y^T * tau_meas            │                                     |
|    └────────────────────────────────────────────────────────┘                                     |
|         │                                                                                         |
|         ▼                                                                                         |
|    ┌────────────────────────────────────────────────────────┐                                     |
|    │  DIFFERENTIABLE PHYSICS ENGINE (Warp / Brax):          │                                     |
|    │  Forward simulation: s_{t+1} = f_sim(s_t, u_t; theta)   │                                     |
|    │  Trajectory Loss: L = Sum ||s_sim(t) - s_real(t)||^2    │                                     |
|    │  Backprop through time: theta <-- theta - eta * (dL/dtheta)                                  |
|    └────────────────────────────────────────────────────────┘                                     |
|         │                                                                                         |
|         ▼                                                                                         |
|    High-Fidelity Calibrated Simulator ────► Narrow DR Envelope ────► Peak Real-World Performance  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 8.2 Classical Rigid Body Dynamics Linearization in Base Parameters

The continuous equations of motion for an $n$-degree-of-freedom robotic manipulator are:
$$M(q) \ddot{q} + C(q, \dot{q}) \dot{q} + g(q) + F_v \dot{q} + F_s \operatorname{sgn}(\dot{q}) = \tau$$

A fundamental property of classical Lagrangian mechanics is that these non-linear equations are **strictly linear with respect to a set of dynamic inertial parameters**:
$$Y(q, \dot{q}, \ddot{q}) \theta = \tau$$
where:
- $Y(q, \dot{q}, \ddot{q}) \in \mathbb{R}^{n \times P}$ is the **regressor matrix**, depending solely on kinematic measurements (joint angles, velocities, and accelerations).
- $\theta \in \mathbb{R}^P$ is the **base inertial parameter vector** (masses, first mass moments $m c$, moments and products of inertia, and friction coefficients).
- $\tau \in \mathbb{R}^n$ is the joint torque vector.

### 8.2.1 Parameter Vector for Link $i$
For a single rigid body link $i$, the 10 standard inertial parameters are:
$$\theta_i = \begin{bmatrix} m_i & m_i c_{x, i} & m_i c_{y, i} & m_i c_{z, i} & I_{xx, i} & I_{yy, i} & I_{zz, i} & I_{xy, i} & I_{xz, i} & I_{yz, i} \end{bmatrix}^T$$
Augmenting with Coulomb friction $f_{c, i}$ and viscous friction $f_{v, i}$ gives 12 parameters per link.

### 8.2.2 Ordinary Least Squares (OLS) Solution
Given a recorded trajectory of $N$ time steps:
$$\begin{bmatrix} Y(t_1) \\ Y(t_2) \\ \vdots \\ Y(t_N) \end{bmatrix} \theta = \begin{bmatrix} \tau(t_1) \\ \tau(t_2) \\ \vdots \\ \tau(t_N) \end{bmatrix} \implies \mathbf{Y} \theta = \boldsymbol{\tau}$$
If the trajectory is **persistently exciting** ($\operatorname{rank}(\mathbf{Y}) = P$), the optimal parameter vector minimizing $\|\mathbf{Y}\theta - \boldsymbol{\tau}\|^2$ is:
$$\hat{\theta}_{\text{OLS}} = (\mathbf{Y}^T \mathbf{Y})^{-1} \mathbf{Y}^T \boldsymbol{\tau}$$

---

## 8.3 Recursive Least Squares (RLS) for Real-Time Parameter Tracking

When physical properties change during operation (such as a robot picking up a heavy box, fuel depletion in a drone, or motor thermal warming), parameters must be tracked online:

```
+---------------------------------------------------------------------------------------------------+
|                        RECURSIVE LEAST SQUARES (RLS) ALGORITHM                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  At time step k:                                                                                  |
|    1. Measure state {q_k, qdot_k, qddot_k} and compute regressor row Y_k                         |
|    2. Measure true torque tau_k                                                                   |
|    3. Compute prediction error (Innovation):                                                      |
|         e_k = tau_k - Y_k * theta_{k-1}                                                           |
|    4. Compute Kalman Gain:                                                                        |
|         K_k = P_{k-1} * Y_k^T * [ lambda_forget + Y_k * P_{k-1} * Y_k^T ]^(-1)                   |
|    5. Update parameter estimate:                                                                  |
|         theta_k = theta_{k-1} + K_k * e_k                                                         |
|    6. Update covariance matrix:                                                                   |
|         P_k = (1 / lambda_forget) * [ I - K_k * Y_k ] * P_{k-1}                                   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

The forgetting factor $\lambda_{\text{forget}} \in [0.98, 1.0]$ exponentially discounts historical telemetry, allowing rapid tracking of sudden payload transitions.

---

## 8.4 Differentiable Physics Optimization

Classical linear regression breaks down when identifying non-linear, non-smooth physical phenomena, such as:
- Gearbox backlash clearance and tooth stiffness.
- Complex contact compliance and Stribeck micro-friction.
- Visual camera distortion and depth sensor noise models.

In **differentiable physics engines**, the state transition function $s_{t+1} = f(s_t, u_t; \theta)$ is written in automatic differentiation frameworks (CUDA/C++ via NVIDIA Warp, PyTorch, or JAX).

```
+---------------------------------------------------------------------------------------------------+
|                        BACKPROPAGATION THROUGH TIME (BPTT) IN PHYSICS                             |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    s_0 ──► [ Sim Step 1 ] ──► s_1 ──► [ Sim Step 2 ] ──► ... ──► s_T                             |
|                 │                          │                          │                           |
|                 ▼                          ▼                          ▼                           |
|             L_1(s_1)                   L_2(s_2)                   L_T(s_T)                        |
|                                                                                                   |
|    Backpropagation of Gradients (Adjoint State Method):                                           |
|    dL/dtheta = Sum_{t=1}^T (dL_t / ds_t) * (ds_t / dtheta)                                        |
|                                                                                                   |
|    where ds_{t+1}/dtheta = (df / ds_t) * (ds_t / dtheta) + (df / dtheta)                          |
+---------------------------------------------------------------------------------------------------+
```

By unrolling forward simulation across a trajectory and computing the adjoint gradients $\frac{\partial \mathcal{L}}{\partial \theta}$, physical simulation parameters converge to hardware ground truth via Adam or L-BFGS optimization.

---

## 8.5 Worked Examples (Problems 8.1 – 8.10)

---

### Problem 8.1 (Worked Example): Regressor Matrix Formulation for a 1-DoF Link
**Problem Statement:** A 1-DoF revolute robot joint rotates in the vertical plane. The link has moment of inertia $I$ about the joint axis, mass $m$, distance from joint to center of mass $l_c$, viscous friction $b$, and Coulomb friction $f_c$.
The equation of motion is:
$$I \ddot{q} + m g l_c \cos(q) + b \dot{q} + f_c \operatorname{sgn}(\dot{q}) = \tau$$
1. Define the linear base parameter vector $\theta \in \mathbb{R}^4$.
2. Write the regressor vector $Y(q, \dot{q}, \ddot{q}) \in \mathbb{R}^{1 \times 4}$.
3. For measurements $q = 0\text{ rad}$, $\dot{q} = 2.0\text{ rad/s}$, $\ddot{q} = 5.0\text{ rad/s}^2$, evaluate the numerical regressor row $Y$.

**Given Data:**
- $g = 9.81\text{ m/s}^2$
- $q = 0\text{ rad} \implies \cos(0) = 1.0$
- $\dot{q} = 2.0\text{ rad/s} \implies \operatorname{sgn}(2.0) = +1.0$
- $\ddot{q} = 5.0\text{ rad/s}^2$

**Step-by-Step Derivation:**
1. Group parameters linearly:
   $$\tau = \ddot{q} (I) + g \cos(q) (m l_c) + \dot{q} (b) + \operatorname{sgn}(\dot{q}) (f_c)$$
   Define base parameter vector:
   $$\theta = \begin{bmatrix} I \\ m l_c \\ b \\ f_c \end{bmatrix} \in \mathbb{R}^4$$
2. Regressor row vector:
   $$Y(q, \dot{q}, \ddot{q}) = \begin{bmatrix} \ddot{q} & g \cos(q) & \dot{q} & \operatorname{sgn}(\dot{q}) \end{bmatrix} \in \mathbb{R}^{1 \times 4}$$
   Notice that $m$ and $l_c$ cannot be identified independently from joint torque alone; only their product $m l_c$ is identifiable.
3. Numerical evaluation:
   $$Y = \begin{bmatrix} 5.0 & (9.81)(1.0) & 2.0 & 1.0 \end{bmatrix} = \begin{bmatrix} 5.0 & 9.81 & 2.0 & 1.0 \end{bmatrix}$$

**Final Answer:**
The parameter vector is $\theta = [I, m l_c, b, f_c]^T$ and the numerical regressor row is $Y = [5.0, 9.81, 2.0, 1.0]$. $\blacksquare$

---

### Problem 8.2 (Worked Example): Ordinary Least Squares Parameter Identification
**Problem Statement:** An OLS parameter identification experiment gathers $N = 3$ data points for the 2-parameter system $\tau = I \ddot{q} + b \dot{q}$:
- Step 1: $\ddot{q}_1 = 2.0\text{ rad/s}^2, \dot{q}_1 = 1.0\text{ rad/s}, \tau_1 = 3.2\text{ N}\cdot\text{m}$
- Step 2: $\ddot{q}_2 = -1.0\text{ rad/s}^2, \dot{q}_2 = 3.0\text{ rad/s}, \tau_2 = 1.1\text{ N}\cdot\text{m}$
- Step 3: $\ddot{q}_3 = 4.0\text{ rad/s}^2, \dot{q}_3 = -2.0\text{ rad/s}, \tau_3 = 2.6\text{ N}\cdot\text{m}$
Compute the Gram matrix $\mathbf{Y}^T \mathbf{Y}$, verify invertibility, and solve for $\hat{\theta} = [\hat{I}, \hat{b}]^T$.

**Given Data:**
- Data matrix $\mathbf{Y} = \begin{bmatrix} 2.0 & 1.0 \\ -1.0 & 3.0 \\ 4.0 & -2.0 \end{bmatrix} \in \mathbb{R}^{3 \times 2}$
- Torque vector $\boldsymbol{\tau} = \begin{bmatrix} 3.2 \\ 1.1 \\ 2.6 \end{bmatrix} \in \mathbb{R}^{3 \times 1}$

**Step-by-Step Derivation:**
1. Compute Gram matrix $\mathbf{Y}^T \mathbf{Y}$:
   $$\mathbf{Y}^T \mathbf{Y} = \begin{bmatrix} 2.0 & -1.0 & 4.0 \\ 1.0 & 3.0 & -2.0 \end{bmatrix} \begin{bmatrix} 2.0 & 1.0 \\ -1.0 & 3.0 \\ 4.0 & -2.0 \end{bmatrix}$$
   $$\mathbf{Y}^T \mathbf{Y}_{11} = (2.0)^2 + (-1.0)^2 + (4.0)^2 = 4 + 1 + 16 = 21.0$$
   $$\mathbf{Y}^T \mathbf{Y}_{12} = (2.0)(1.0) + (-1.0)(3.0) + (4.0)(-2.0) = 2 - 3 - 8 = -9.0$$
   $$\mathbf{Y}^T \mathbf{Y}_{21} = -9.0$$
   $$\mathbf{Y}^T \mathbf{Y}_{22} = (1.0)^2 + (3.0)^2 + (-2.0)^2 = 1 + 9 + 4 = 14.0$$
   $$\mathbf{Y}^T \mathbf{Y} = \begin{bmatrix} 21.0 & -9.0 \\ -9.0 & 14.0 \end{bmatrix}$$
2. Check determinant:
   $$\det(\mathbf{Y}^T \mathbf{Y}) = (21.0)(14.0) - (-9.0)^2 = 294.0 - 81.0 = 213.0 > 0$$
   The matrix is strictly positive definite and invertible.
3. Invert the $2 \times 2$ Gram matrix:
   $$(\mathbf{Y}^T \mathbf{Y})^{-1} = \frac{1}{213.0} \begin{bmatrix} 14.0 & 9.0 \\ 9.0 & 21.0 \end{bmatrix}$$
4. Compute $\mathbf{Y}^T \boldsymbol{\tau}$:
   $$\mathbf{Y}^T \boldsymbol{\tau} = \begin{bmatrix} 2.0 & -1.0 & 4.0 \\ 1.0 & 3.0 & -2.0 \end{bmatrix} \begin{bmatrix} 3.2 \\ 1.1 \\ 2.6 \end{bmatrix}$$
   Row 1: $(2.0)(3.2) + (-1.0)(1.1) + (4.0)(2.6) = 6.4 - 1.1 + 10.4 = 15.7$
   Row 2: $(1.0)(3.2) + (3.0)(1.1) + (-2.0)(2.6) = 3.2 + 3.3 - 5.2 = 1.3$
   $$\mathbf{Y}^T \boldsymbol{\tau} = \begin{bmatrix} 15.7 \\ 1.3 \end{bmatrix}$$
5. Multiply to find $\hat{\theta}$:
   $$\hat{\theta} = \frac{1}{213.0} \begin{bmatrix} 14.0 & 9.0 \\ 9.0 & 21.0 \end{bmatrix} \begin{bmatrix} 15.7 \\ 1.3 \end{bmatrix}$$
   $\hat{I} = \frac{(14.0)(15.7) + (9.0)(1.3)}{213.0} = \frac{219.8 + 11.7}{213.0} = \frac{231.5}{213.0} \approx 1.08685\text{ kg}\cdot\text{m}^2$
   $\hat{b} = \frac{(9.0)(15.7) + (21.0)(1.3)}{213.0} = \frac{141.3 + 27.3}{213.0} = \frac{168.6}{213.0} \approx 0.79155\text{ N}\cdot\text{m}\cdot\text{s/rad}$

**Final Answer:**
The identified parameters are moment of inertia $\hat{I} \approx 1.087\text{ kg}\cdot\text{m}^2$ and viscous damping $\hat{b} \approx 0.792\text{ N}\cdot\text{m}\cdot\text{s/rad}$. $\blacksquare$

---

### Problem 8.3 (Worked Example): Persistent Excitation Condition and Condition Number
**Problem Statement:** An excitation trajectory yields Gram matrix $\mathbf{Y}_A^T \mathbf{Y}_A = \begin{bmatrix} 100 & 99 \\ 99 & 100 \end{bmatrix}$. A second trajectory yields $\mathbf{Y}_B^T \mathbf{Y}_B = \begin{bmatrix} 100 & 0 \\ 0 & 100 \end{bmatrix}$.
1. Compute the eigenvalues and condition number $\kappa = \frac{\lambda_{\max}}{\lambda_{\min}}$ for both matrices.
2. If torque measurement noise has variance $\sigma_\tau^2 = 0.05\text{ N}^2\cdot\text{m}^2$, compute the parameter covariance trace $\operatorname{Tr}(\operatorname{Cov}(\hat{\theta}))$ for both experiments.

**Given Data:**
- Experiment A: $\mathbf{Y}_A^T \mathbf{Y}_A = \begin{bmatrix} 100 & 99 \\ 99 & 100 \end{bmatrix}$
- Experiment B: $\mathbf{Y}_B^T \mathbf{Y}_B = \begin{bmatrix} 100 & 0 \\ 0 & 100 \end{bmatrix}$
- $\sigma_\tau^2 = 0.05$

**Step-by-Step Derivation:**
1. Eigenvalues of matrix A:
   $$\det\begin{bmatrix} 100 - \lambda & 99 \\ 99 & 100 - \lambda \end{bmatrix} = (100 - \lambda)^2 - 99^2 = 0$$
   $$(100 - \lambda) = \pm 99 \implies \lambda_1 = 199, \quad \lambda_2 = 1.0$$
   Condition number:
   $$\kappa_A = \frac{\lambda_{\max}}{\lambda_{\min}} = \frac{199}{1.0} = 199.0$$
2. Eigenvalues of matrix B:
   $\lambda_1 = 100, \lambda_2 = 100$.
   Condition number:
   $$\kappa_B = \frac{100}{100} = 1.0$$
3. Parameter covariance formula:
   $$\operatorname{Cov}(\hat{\theta}) = \sigma_\tau^2 (\mathbf{Y}^T \mathbf{Y})^{-1}$$
   Trace is the sum of inverse eigenvalues:
   $$\operatorname{Tr}(\operatorname{Cov}(\hat{\theta})) = \sigma_\tau^2 \sum \frac{1}{\lambda_i}$$
4. For Experiment A:
   $$\operatorname{Tr}(\operatorname{Cov}_A) = 0.05 \left( \frac{1}{199} + \frac{1}{1.0} \right) = 0.05 (0.005025 + 1.0) \approx 0.05 \times 1.005025 \approx 0.05025$$
5. For Experiment B:
   $$\operatorname{Tr}(\operatorname{Cov}_B) = 0.05 \left( \frac{1}{100} + \frac{1}{100} \right) = 0.05 (0.02) = 0.0010$$
   Ratio of parameter variances:
   $$\frac{\operatorname{Tr}(\operatorname{Cov}_A)}{\operatorname{Tr}(\operatorname{Cov}_B)} = \frac{0.05025}{0.0010} \approx 50.25\times$$

**Final Answer:**
Trajectory B is an optimally exciting trajectory ($\kappa = 1.0$), reducing parameter estimation error variance by over $50\times$ compared to the ill-conditioned trajectory A ($\kappa = 199.0$), proving the necessity of designing persistently exciting SysID trajectories. $\blacksquare$

---

### Problem 8.4 (Worked Example): Recursive Least Squares (RLS) Single-Step Update
**Problem Statement:** An RLS estimator has current mass estimate $\hat{m}_0 = 2.0\text{ kg}$ and covariance $P_0 = 10.0$ for the scalar system $a_k \cdot m = F_k$. The forgetting factor is $\lambda = 1.0$.
At step $k = 1$, acceleration is measured as $a_1 = 3.0\text{ m/s}^2$ and actuator force is measured as $F_1 = 9.0\text{ N}$.
Compute:
1. The innovation (prediction error) $e_1$.
2. The Kalman gain $K_1$.
3. The updated mass estimate $\hat{m}_1$ and updated covariance $P_1$.

**Given Data:**
- $\hat{m}_0 = 2.0$
- $P_0 = 10.0$
- $\lambda = 1.0$
- $y_1 = a_1 = 3.0$
- $F_1 = 9.0$

**Step-by-Step Derivation:**
1. Predicted force:
   $$\hat{F}_1 = y_1 \hat{m}_0 = (3.0)(2.0) = 6.0\text{ N}$$
   Innovation:
   $$e_1 = F_1 - \hat{F}_1 = 9.0 - 6.0 = 3.0\text{ N}$$
2. Innovation variance denominator:
   $$S_1 = \lambda + y_1 P_0 y_1 = 1.0 + (3.0)(10.0)(3.0) = 1.0 + 90.0 = 91.0$$
   Kalman Gain:
   $$K_1 = \frac{P_0 y_1}{S_1} = \frac{(10.0)(3.0)}{91.0} = \frac{30.0}{91.0} \approx 0.32967$$
3. Updated parameter estimate:
   $$\hat{m}_1 = \hat{m}_0 + K_1 e_1 = 2.0 + (0.32967)(3.0) = 2.0 + 0.98901 \approx 2.989\text{ kg}$$
4. Updated covariance:
   $$P_1 = \frac{1}{\lambda} [1 - K_1 y_1] P_0 = [1 - (0.32967)(3.0)] \times 10.0 = [1 - 0.98901] \times 10.0 = (0.010989) \times 10.0 \approx 0.1099$$

**Final Answer:**
Innovation is $3.0\text{ N}$, Kalman gain is $0.330$, mass estimate jumps from $2.0\text{ kg}$ to $\hat{m}_1 \approx 2.989\text{ kg}$ (closely matching the true $9 / 3 = 3.0\text{ kg}$), and covariance drops from $10.0$ to $0.110$. $\blacksquare$

---

### Problem 8.5 (Worked Example): Differentiable Physics Analytical Gradient Derivation
**Problem Statement:** In a 1D differentiable physics simulator, position updates via semi-implicit Euler integration:
$$v_{t+1} = v_t + \Delta t \left( \frac{u_t - c v_t}{m} \right)$$
$$x_{t+1} = x_t + \Delta t v_{t+1}$$
Trajectory loss over $T = 1$ step is $\mathcal{L} = \frac{1}{2} (x_1 - x_{\text{target}})^2$.
Derive the analytical gradient of loss with respect to mass $\frac{\partial \mathcal{L}}{\partial m}$.

**Given Data:**
- Initial state: $x_0, v_0$
- Step size $\Delta t$
- Parameter $m$

**Step-by-Step Derivation:**
1. Chain rule expansion:
   $$\frac{\partial \mathcal{L}}{\partial m} = \frac{\partial \mathcal{L}}{\partial x_1} \frac{\partial x_1}{\partial v_1} \frac{\partial v_1}{\partial m}$$
2. Individual partial derivatives:
   $$\frac{\partial \mathcal{L}}{\partial x_1} = x_1 - x_{\text{target}}$$
   $$\frac{\partial x_1}{\partial v_1} = \Delta t$$
   $$\frac{\partial v_1}{\partial m} = \frac{\partial}{\partial m} \left[ v_0 + \Delta t \left( \frac{u_0 - c v_0}{m} \right) \right] = -\Delta t \frac{u_0 - c v_0}{m^2}$$
3. Multiply terms together:
   $$\frac{\partial \mathcal{L}}{\partial m} = (x_1 - x_{\text{target}}) \cdot \Delta t \cdot \left( -\Delta t \frac{u_0 - c v_0}{m^2} \right) = -\Delta t^2 \frac{u_0 - c v_0}{m^2} (x_1 - x_{\text{target}})$$

**Final Answer:**
The gradient is $\frac{\partial \mathcal{L}}{\partial m} = -\frac{\Delta t^2 (u_0 - c v_0)}{m^2} (x_1 - x_{\text{target}})$, which drives gradient descent optimization of physical simulator mass. $\blacksquare$

---

### Problem 8.6 (Worked Example): Stiff Contact Gradient Exploding in Differentiable Simulators
**Problem Statement:** In a differentiable physics engine, contact force is modeled via spring penalty $F_N(z) = k_n \max(0, -z)$. A point mass $m$ penetrates the ground ($z < 0$).
Show that the acceleration gradient with respect to penetration depth $\frac{\partial a}{\partial z} = -\frac{k_n}{m}$, and explain why high stiffness ($k_n = 10^7\text{ N/m}$) causes exploding gradients during backpropagation through time.

**Step-by-Step Derivation:**
1. Equation of motion in contact:
   $$\ddot{z} = a = \frac{F_N - m g}{m} = \frac{-k_n z - m g}{m} = -\frac{k_n}{m} z - g$$
2. Spatial Jacobian:
   $$\frac{\partial a}{\partial z} = -\frac{k_n}{m}$$
3. Under discrete time stepping $z_{t+1} \approx z_t + \Delta t^2 a_t$:
   $$\frac{\partial z_{t+1}}{\partial z_t} \approx 1 - \Delta t^2 \frac{k_n}{m}$$
4. For $k_n = 10^7\text{ N/m}$, $m = 1.0\text{ kg}$, and $\Delta t = 2\text{ ms} = 0.002\text{ s}$:
   $$\Delta t^2 \frac{k_n}{m} = (4 \times 10^{-6})(10^7) = 40.0$$
   $$\frac{\partial z_{t+1}}{\partial z_t} \approx 1 - 40.0 = -39.0$$
5. Over a horizon of $T = 10$ contact time steps:
   The backpropagated gradient scales as:
   $$\left| \frac{\partial z_T}{\partial z_0} \right| \approx (39)^{10} \approx 8.14 \times 10^{15} \implies \text{Massive Gradient Explosion!}$$

**Final Answer:**
High spring stiffness creates an unconditioned Jacobian $\frac{\partial z_{t+1}}{\partial z_t} = -39$, amplifying gradients by $10^{15}\times$ over 10 steps. Differentiable engines must use smoothed contact potentials (e.g., quasi-Newton LCP relaxations) to maintain gradient stability. $\blacksquare$

---

### Problem 8.7 (Worked Example): Optimal Fourier Series Excitation Trajectory Design
**Problem Statement:** To ensure persistent excitation for robot arm SysID, joint trajectories are parameterized as a truncated Fourier series:
$$q_i(t) = q_{i, 0} + \sum_{k=1}^M \left[ \frac{a_{i, k}}{\omega_f k} \sin(\omega_f k t) - \frac{b_{i, k}}{\omega_f k} \cos(\omega_f k t) \right]$$
with base frequency $\omega_f = 0.2\pi\text{ rad/s}$ ($f = 0.1\text{ Hz}$) and $M = 5$ harmonics.
Derive the expression for joint velocity $\dot{q}_i(t)$ and joint acceleration $\ddot{q}_i(t)$, and explain why the $\frac{1}{\omega_f k}$ scaling ensures bounded velocity at high harmonics.

**Step-by-Step Derivation:**
1. Differentiate $q_i(t)$ with respect to time $t$:
   $$\dot{q}_i(t) = \sum_{k=1}^M \left[ \frac{a_{i, k}}{\omega_f k} (\omega_f k) \cos(\omega_f k t) - \frac{b_{i, k}}{\omega_f k} (-\omega_f k) \sin(\omega_f k t) \right]$$
   $$\dot{q}_i(t) = \sum_{k=1}^M [ a_{i, k} \cos(\omega_f k t) + b_{i, k} \sin(\omega_f k t) ]$$
2. Differentiate again to get acceleration:
   $$\ddot{q}_i(t) = \sum_{k=1}^M \omega_f k [ -a_{i, k} \sin(\omega_f k t) + b_{i, k} \cos(\omega_f k t) ]$$
3. Scaling analysis:
   Notice that the velocity amplitudes are simply $a_{i, k}$ and $b_{i, k}$, independent of harmonic order $k$!
   If the position terms were not scaled by $\frac{1}{\omega_f k}$, the velocity would scale with $k$ and acceleration would scale with $k^2$, causing high-frequency harmonics to violently exceed robot motor velocity limits.

**Final Answer:**
The velocity is $\dot{q}_i(t) = \sum_{k=1}^M [a_{i, k} \cos(k\omega_f t) + b_{i, k} \sin(k\omega_f t)]$. The $\frac{1}{k\omega_f}$ coefficient normalizes velocity bounds across all harmonics, enabling wide spectral excitation without exceeding joint limits. $\blacksquare$

---

### Problem 8.8 (Worked Example): Gray-Box Actuator Backlash Identification
**Problem Statement:** A robot joint has known nominal inertia $J = 0.05\text{ kg}\cdot\text{m}^2$. The gearbox has unknown backlash clearance $\alpha$ and tooth stiffness $K_{\text{gear}}$.
During an experiment where the motor sweeps through the dead-band, output torque is measured as $\tau = 0$ for motor angle $|\theta_m| \le 0.008\text{ rad}$. Beyond this angle, torque rises linearly at rate $\frac{d\tau}{d\theta_m} = 4500\text{ N}\cdot\text{m/rad}$.
Identify the physical backlash half-width $\alpha$ and gear stiffness $K_{\text{gear}}$.

**Step-by-Step Derivation:**
1. Backlash model:
   $$\tau = \begin{cases} K_{\text{gear}} (\theta_m - \alpha), & \theta_m > \alpha \\ 0, & -\alpha \le \theta_m \le \alpha \\ K_{\text{gear}} (\theta_m + \alpha), & \theta_m < -\alpha \end{cases}$$
2. The dead-band threshold where torque departs from zero directly gives the backlash half-width:
   $$\alpha = 0.008\text{ radians} \approx 0.458^\circ \quad (27.5\text{ arcmin})$$
3. The slope of the torque-angle curve in the engaged contact zone directly gives gear stiffness:
   $$K_{\text{gear}} = \frac{d\tau}{d\theta_m} = 4500\text{ N}\cdot\text{m/rad}$$

**Final Answer:**
Identified backlash half-width is $\alpha = 0.008\text{ rad}$ ($27.5\text{ arcmin}$) and gear tooth stiffness is $K_{\text{gear}} = 4500\text{ N}\cdot\text{m/rad}$. $\blacksquare$

---

### Problem 8.9 (Worked Example): Total Energy Conservation Check for Validated Inertia Tensors
**Problem Statement:** An identified link inertia tensor is $\hat{I} = \begin{bmatrix} 0.05 & 0.01 & 0 \\ 0.01 & 0.04 & 0 \\ 0 & 0 & 0.08 \end{bmatrix}\text{ kg}\cdot\text{m}^2$.
1. Compute the eigenvalues of $\hat{I}$ (the principal moments of inertia).
2. Verify that all eigenvalues are strictly positive and satisfy the triangle inequalities ($I_1 + I_2 \ge I_3$).

**Given Data:**
- Inertia tensor matrix $\hat{I}$

**Step-by-Step Derivation:**
1. The $z$-axis is decoupled with eigenvalue $\lambda_3 = I_{zz} = 0.08\text{ kg}\cdot\text{m}^2$.
2. For the $x$-$y$ sub-matrix $\begin{bmatrix} 0.05 & 0.01 \\ 0.01 & 0.04 \end{bmatrix}$:
   $$\det\begin{bmatrix} 0.05 - \lambda & 0.01 \\ 0.01 & 0.04 - \lambda \end{bmatrix} = (0.05 - \lambda)(0.04 - \lambda) - 0.0001 = 0$$
   $$\lambda^2 - 0.09 \lambda + 0.0020 - 0.0001 = \lambda^2 - 0.09 \lambda + 0.0019 = 0$$
   $$\lambda = \frac{0.09 \pm \sqrt{(0.09)^2 - 4(0.0019)}}{2} = \frac{0.09 \pm \sqrt{0.0081 - 0.0076}}{2} = \frac{0.09 \pm \sqrt{0.0005}}{2} \approx \frac{0.09 \pm 0.02236}{2}$$
   $$\lambda_1 \approx \frac{0.11236}{2} \approx 0.05618\text{ kg}\cdot\text{m}^2$$
   $$\lambda_2 \approx \frac{0.06764}{2} \approx 0.03382\text{ kg}\cdot\text{m}^2$$
3. Principal moments: $I_1 \approx 0.0562, I_2 \approx 0.0338, I_3 = 0.0800$.
   All eigenvalues are strictly positive ($> 0$).
4. Check triangle inequalities:
   - $I_1 + I_2 = 0.05618 + 0.03382 = 0.0900 \ge 0.0800 = I_3$ (Satisfied! Margin $0.010$)
   - $I_1 + I_3 = 0.05618 + 0.0800 = 0.13618 \ge 0.03382 = I_2$ (Satisfied!)
   - $I_2 + I_3 = 0.03382 + 0.0800 = 0.11382 \ge 0.05618 = I_1$ (Satisfied!)

**Final Answer:**
Principal moments of inertia are $0.0562, 0.0338, 0.0800\text{ kg}\cdot\text{m}^2$. They are strictly positive and satisfy the triangle inequalities, proving that the identified tensor represents a physically realizable 3D mass distribution. $\blacksquare$

---

### Problem 8.10 (Worked Example): Adjoint Sensitivity Method Computational Complexity
**Problem Statement:** Contrast the computational complexity of computing parameter gradients $\frac{\partial \mathcal{L}}{\partial \theta}$ for $P = 100$ parameters across $T = 1000$ simulation steps using:
1. Finite differences (Forward perturbation).
2. The Adjoint State method (Reverse-mode Automatic Differentiation).

**Step-by-Step Derivation:**
1. Finite Differences:
   Requires perturbing each parameter independently:
   $$\frac{\partial \mathcal{L}}{\partial \theta_i} \approx \frac{\mathcal{L}(\theta + \epsilon e_i) - \mathcal{L}(\theta)}{\epsilon}$$
   Requires 1 unperturbed baseline simulation $+ P$ perturbed simulations.
   Total forward passes:
   $$N_{\text{eval}} = P + 1 = 100 + 1 = 101\text{ full trajectory simulations}$$
   Total computational operations: $\mathcal{O}(P \cdot T)$.
2. Adjoint State Method (Reverse-Mode AD):
   Requires 1 forward pass to record states and Jacobians, followed by 1 backward adjoint pass unrolling time from $T$ to 0.
   Total computational operations: $\mathcal{O}(T)$, **independent of parameter count $P$**!
3. Complexity speedup ratio:
   $$\text{Speedup} \approx \frac{P + 1}{2} = \frac{101}{2} \approx 50.5\times$$

**Final Answer:**
The Adjoint State method computes all 100 parameter gradients in a single backward pass, achieving a $\sim 50.5\times$ speedup over finite differences and enabling scalable optimization of complex physics simulators. $\blacksquare$

---

## 8.6 Solved Exercises (Problems 8.11 – 8.20)

---

### Problem 8.11 (Solved Exercise): Stribeck Friction Model Non-Linear Identification
**Problem Statement:** A joint exhibits Stribeck friction $\tau_f(v) = [f_c + (f_s - f_c) e^{-(v/v_s)^2}] \operatorname{sgn}(v) + f_v v$. For measured data: static breakaway torque $\tau_f(0^+) = 4.5\text{ N}\cdot\text{m}$, Coulomb plateau $\tau_f(0.5) = 2.0\text{ N}\cdot\text{m}$ (where $e^{-(v/v_s)^2} \approx 0$), identify static friction $f_s$ and Coulomb friction $f_c$.

**Step-by-Step Solution:**
1. At near-zero velocity ($v \to 0^+$):
   $$\tau_f(0^+) = f_c + (f_s - f_c) (1) = f_s = 4.5\text{ N}\cdot\text{m}$$
2. At higher velocity ($v = 0.5\text{ rad/s}$):
   The exponential decays to zero: $\tau_f \approx f_c + f_v v \approx f_c = 2.0\text{ N}\cdot\text{m}$.
3. Identified parameters:
   $$f_s = 4.5\text{ N}\cdot\text{m}, \quad f_c = 2.0\text{ N}\cdot\text{m} \quad \blacksquare$$

---

### Problem 8.12 (Solved Exercise): Weighted Least Squares with Sensor Covariance
**Problem Statement:** Let measurement errors have known non-uniform covariance $R = \operatorname{diag}(\sigma_1^2, \dots, \sigma_N^2)$. Write the Weighted Least Squares (WLS) estimator $\hat{\theta}_{\text{WLS}}$ and explain how it down-weights noisy measurements.

**Step-by-Step Solution:**
1. Cost function:
   $$\mathcal{L}(\theta) = (\boldsymbol{\tau} - \mathbf{Y} \theta)^T R^{-1} (\boldsymbol{\tau} - \mathbf{Y} \theta) = \sum_{k=1}^N \frac{(\tau_k - Y_k \theta)^2}{\sigma_k^2}$$
2. Setting gradient to zero yields:
   $$\hat{\theta}_{\text{WLS}} = (\mathbf{Y}^T R^{-1} \mathbf{Y})^{-1} \mathbf{Y}^T R^{-1} \boldsymbol{\tau}$$
3. Measurements with high noise variance $\sigma_k^2 \to \infty$ have weight $1/\sigma_k^2 \to 0$, eliminating their influence on parameter estimates. $\blacksquare$

---

### Problem 8.13 (Solved Exercise): Identifiability of End-Effector Payload Mass
**Problem Statement:** A 2-DoF planar robotic arm holds an unknown payload of mass $m_p$ at its tip. Show that the regressor column associated with $m_p$ equals $J^T(q) \begin{bmatrix} \ddot{x} \\ \ddot{y} + g \end{bmatrix}$, where $J(q)$ is the manipulator kinematic Jacobian.

**Step-by-Step Solution:**
1. By virtual work:
   $$\tau_{\text{payload}} = J^T(q) F_{\text{payload}}$$
2. Inertial force of payload:
   $$F_{\text{payload}} = m_p \begin{bmatrix} \ddot{x} \\ \ddot{y} + g \end{bmatrix}$$
3. Substitute:
   $$\tau_{\text{payload}} = \left( J^T(q) \begin{bmatrix} \ddot{x} \\ \ddot{y} + g \end{bmatrix} \right) m_p$$
4. The regressor column $Y_{\text{payload}} = J^T(q) [\ddot{x}, \ddot{y} + g]^T$ is linear in $m_p$. $\blacksquare$

---

### Problem 8.14 (Solved Exercise): Differentiable Physics Gradient Clipping
**Problem Statement:** During backpropagation through contact collisions, the parameter gradient spikes to $\|\nabla_\theta \mathcal{L}\| = 15,000$. If gradient clipping threshold is $G_{\max} = 100$, compute the scaling factor applied to the gradient vector.

**Step-by-Step Solution:**
1. Scaling factor formula:
   $$\gamma = \min\left(1.0, \frac{G_{\max}}{\|\nabla_\theta \mathcal{L}\|}\right)$$
2. Substitute values:
   $$\gamma = \frac{100}{15000} = \frac{1}{150} \approx 0.006667$$
3. The clipped gradient is:
   $$\nabla_\theta' = \gamma \nabla_\theta = \frac{1}{150} \nabla_\theta \quad (\|\nabla_\theta'\| = 100.0) \quad \blacksquare$$

---

### Problem 8.15 (Solved Exercise): Recursive Covariance Windup and Reset
**Problem Statement:** In RLS with forgetting factor $\lambda = 0.95$, if the robot stops moving ($Y_k = 0$) for 100 steps, compute the growth factor of the covariance matrix $P$.

**Step-by-Step Solution:**
1. When $Y_k = 0$, the update rule simplifies to:
   $$P_k = \frac{1}{\lambda} P_{k-1} = \lambda^{-1} P_{k-1}$$
2. After 100 quiescent steps:
   $$P_{100} = (0.95)^{-100} P_0 \approx (1.05263)^{100} P_0 \approx 169.35 P_0$$
3. Covariance explodes by $169\times$ (**covariance windup**). When motion resumes, the first tiny measurement causes violent parameter spikes unless covariance is clamped or frozen during quiescence. $\blacksquare$

---

### Problem 8.16 (Solved Exercise): Identifiability Rank Deficiency of Kinematic Link Lengths
**Problem Statement:** Explain why link lengths $L_i$ cannot be identified using linear least squares $Y(q, \dot{q}, \ddot{q})\theta = \tau$, and require non-linear optimization.

**Step-by-Step Solution:**
1. The regressor matrix $Y(q)$ depends on forward kinematics, where link lengths enter inside transcendental trigonometric functions: $\sin(q_1 + q_2) L_1 L_2$.
2. The equations cannot be factored into $Y(q) \cdot f(L)$ linearly.
3. Therefore, kinematic lengths require non-linear optimization (Levenberg-Marquardt or differentiable forward kinematics) rather than linear OLS. $\blacksquare$

---

### Problem 8.17 (Solved Exercise): Actuator Inductance Identification via High-Frequency Voltage Chirp
**Problem Statement:** A voltage chirp signal $V(t) = V_0 \sin(\omega(t) t)$ is applied to a locked-rotor motor ($v = 0$). At frequency $\omega = 10,000\text{ rad/s}$, current amplitude is measured as $I_0 = 2.0\text{ A}$ for voltage amplitude $V_0 = 10.0\text{ V}$. If resistance is $R = 1.0\ \Omega$, compute winding inductance $L$.

**Step-by-Step Solution:**
1. Electrical impedance magnitude:
   $$|Z| = \frac{V_0}{I_0} = \frac{10.0}{2.0} = 5.0\ \Omega$$
2. Impedance formula:
   $$|Z|^2 = R^2 + (\omega L)^2 \implies (\omega L)^2 = |Z|^2 - R^2 = 25.0 - 1.0 = 24.0$$
3. Inductance:
   $$\omega L = \sqrt{24.0} \approx 4.89898\ \Omega$$
   $$L = \frac{4.89898}{10,000} \approx 4.899 \times 10^{-4}\text{ H} = 490\text{ }\mu\text{H} \quad \blacksquare$$

---

### Problem 8.18 (Solved Exercise): Sim-to-Real Transfer Validation Metric
**Problem Statement:** After SysID, a validation trajectory $\tau_{\text{real}}$ of $N = 1000$ points is compared against simulator prediction $\tau_{\text{sim}}$. Compute the Normalized Root Mean Square Error (NRMSE):
$$\text{NRMSE} = 1 - \frac{\|\boldsymbol{\tau}_{\text{real}} - \boldsymbol{\tau}_{\text{sim}}\|}{\|\boldsymbol{\tau}_{\text{real}} - \bar{\boldsymbol{\tau}}_{\text{real}}\|}$$
for $\|\boldsymbol{\tau}_{\text{real}} - \boldsymbol{\tau}_{\text{sim}}\| = 12.0\text{ N}\cdot\text{m}$ and $\|\boldsymbol{\tau}_{\text{real}} - \bar{\boldsymbol{\tau}}_{\text{real}}\| = 120.0\text{ N}\cdot\text{m}$.

**Step-by-Step Solution:**
1. NRMSE calculation:
   $$\text{NRMSE} = 1 - \frac{12.0}{120.0} = 1 - 0.10 = 0.90 = 90.0\%$$
2. An NRMSE of $90\%$ indicates an excellent dynamic match between simulator and hardware. $\blacksquare$

---

### Problem 8.19 (Solved Exercise): Adjoint Variable Boundary Condition
**Problem Statement:** In continuous Pontryagin adjoint state dynamics $\dot{\lambda}(t) = -\left(\frac{\partial f}{\partial s}\right)^T \lambda(t) - \frac{\partial \mathcal{L}}{\partial s}$, state the terminal boundary condition $\lambda(T)$ at end time $T$.

**Step-by-Step Solution:**
1. Terminal boundary condition:
   $$\lambda(T) = \frac{\partial \mathcal{L}_{\text{terminal}}}{\partial s(T)}$$
2. If there is no explicit terminal cost $\mathcal{L}_{\text{terminal}} = 0$:
   $$\lambda(T) = 0 \quad \blacksquare$$

---

### Problem 8.20 (Solved Exercise): Zero-Shot Velocity Error Bound Post-SysID
**Problem Statement:** Prior to SysID, mass error was $\Delta m = 1.0\text{ kg}$. Post-SysID, mass error is reduced to $\Delta m' = 0.05\text{ kg}$ ($20\times$ improvement). If open-loop velocity tracking error scales linearly with mass error ($\delta v \propto \Delta m$), compute the reduction in trajectory divergence rate.

**Step-by-Step Solution:**
1. Ratio of mass errors:
   $$\frac{\Delta m'}{\Delta m} = \frac{0.05}{1.0} = 0.05 = \frac{1}{20}$$
2. The open-loop trajectory error divergence rate drops by exactly $20\times$, allowing policies to execute open-loop athletic bursts with $95\%$ lower drift. $\blacksquare$
