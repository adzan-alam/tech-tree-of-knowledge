# Chapter 11: Constrained Trajectory Generation and Joint-Space Limit Enforcement

Kinematic equations and inverse kinematics algorithms do not operate in a static vacuum. In practical autonomous manipulation, a robotic end-effector must transition between distinct poses in task space smoothly, predictably, and without exceeding mechanical, electrical, or geometric constraints. Moving an arm from pose $T_A \in SE(3)$ to pose $T_B \in SE(3)$ requires generating continuous time-parameterized trajectories $q(t), \dot{q}(t), \ddot{q}(t)$ in joint space or $X(t), V(t), \dot{V}(t)$ in operational space, while strictly adhering to hardware limitations on position, velocity, acceleration, and jerk.

Moreover, numerical inverse kinematics in operational space is susceptible to numerical drift, kinematic singularities, and joint limit violations. This chapter establishes the rigorous mathematical frameworks governing:
1. Smooth trajectory generation via quintic polynomials ($C^2$ continuity) and trapezoidal velocity profiles.
2. Unit quaternion interpolation in $SO(3)$ via Spherical Linear Interpolation ($\operatorname{Slerp}$) and its angular velocity kinematics.
3. Closed-Loop Inverse Kinematics ($\operatorname{CLIK}$) with algorithmic drift compensation and Lyapunov stability guarantees.
4. Hard saturation versus smooth interior-point logarithmic/hyperbolic barrier potentials for joint limit avoidance.
5. Heuristic and geometric inverse kinematics algorithms: Cyclic Coordinate Descent ($\operatorname{CCD}$) and Forward And Backward Reaching Inverse Kinematics ($\operatorname{FABRIK}$).

---

## 11.1 Smooth Trajectory Parameterization: Polynomials and Profiles

A robot trajectory is a time-parameterized path. Let $s(t) \in [0, 1]$ be a normalized path parameter defined over the time interval $t \in [0, T]$, where $T > 0$ is the total motion duration. 

### 11.1.1 Cubic vs. Quintic Splines and $C^2$ Smoothness

In industrial robotics, motor currents and actuator torques are directly proportional to joint accelerations $\ddot{q}(t)$, and the time derivative of acceleration—known as **jerk** $j(t) = \dddot{q}(t)$—induces high-frequency structural vibration, mechanical wear on harmonic drives, and tracking errors in servo loops.

#### The Cubic Polynomial ($C^1$ Continuity)
A cubic trajectory specifies initial and final positions and velocities:
$$q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3$$
Given boundary conditions $q(0) = q_0, q(T) = q_f, \dot{q}(0) = \dot{q}_0, \dot{q}(T) = \dot{q}_f$:
$$a_0 = q_0, \quad a_1 = \dot{q}_0$$
$$\begin{bmatrix} T^2 & T^3 \\ 2T & 3T^2 \end{bmatrix} \begin{bmatrix} a_2 \\ a_3 \end{bmatrix} = \begin{bmatrix} q_f - q_0 - \dot{q}_0 T \\ \dot{q}_f - \dot{q}_0 \end{bmatrix}$$
Solving yields:
$$a_2 = \frac{3(q_f - q_0) - (2\dot{q}_0 + \dot{q}_f)T}{T^2}, \quad a_3 = \frac{-2(q_f - q_0) + (\dot{q}_0 + \dot{q}_f)T}{T^3}$$
While velocities are continuous ($C^1$), the acceleration at boundary $t=0$ is $\ddot{q}(0) = 2a_2$, which is generally nonzero. Transitioning from rest ($\ddot{q}(0^-) = 0$) causes an instantaneous step discontinuity in acceleration, implying infinite jerk $\dddot{q}(t) \to \infty$.

#### The Quintic Polynomial ($C^2$ Continuity)
To enforce continuous acceleration and zero jerk at the boundaries, we formulate a 5th-degree polynomial:
$$s(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5$$
Imposing the six canonical boundary conditions:
$$s(0) = 0, \quad \dot{s}(0) = 0, \quad \ddot{s}(0) = 0$$
$$s(T) = 1, \quad \dot{s}(T) = 0, \quad \ddot{s}(T) = 0$$
The initial conditions immediately enforce $a_0 = 0, a_1 = 0, a_2 = 0$. The terminal conditions form the linear system:
$$\begin{bmatrix} T^3 & T^4 & T^5 \\ 3T^2 & 4T^3 & 5T^4 \\ 6T & 12T^2 & 20T^3 \end{bmatrix} \begin{bmatrix} a_3 \\ a_4 \\ a_5 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
Inverting this system analytically yields:
$$a_3 = \frac{10}{T^3}, \quad a_4 = -\frac{15}{T^4}, \quad a_5 = \frac{6}{T^5}$$
Thus, the canonical minimum-jerk scalar profile is:
$$s(t) = 10\left(\frac{t}{T}\right)^3 - 15\left(\frac{t}{T}\right)^4 + 6\left(\frac{t}{T}\right)^5$$
Differentiating with respect to time:
$$\dot{s}(t) = \frac{30}{T}\left(\frac{t}{T}\right)^2 - \frac{60}{T}\left(\frac{t}{T}\right)^3 + \frac{30}{T}\left(\frac{t}{T}\right)^4 = \frac{30}{T} \tau^2 (1 - \tau)^2 \quad \text{where } \tau = \frac{t}{T}$$
$$\ddot{s}(t) = \frac{60}{T^2}\tau - \frac{180}{T^2}\tau^2 + \frac{120}{T^2}\tau^3 = \frac{60}{T^2} \tau (1 - \tau)(1 - 2\tau)$$
$$\dddot{s}(t) = \frac{60}{T^3} - \frac{360}{T^3}\tau + \frac{360}{T^3}\tau^2 = \frac{60}{T^3}(1 - 6\tau + 6\tau^2)$$

The extrema of these profiles are analytically derived:
1. **Maximum Velocity:** Occurs at midpoint $\tau = 0.5$:
   $$\dot{s}_{\max} = \dot{s}(0.5 T) = \frac{30}{T} (0.5)^2 (0.5)^2 = \frac{30}{16 T} = \frac{15}{8 T} = \frac{1.875}{T}$$
2. **Maximum Acceleration:** Setting $\dddot{s}(t) = 0 \implies 6\tau^2 - 6\tau + 1 = 0$:
   $$\tau = \frac{6 \pm \sqrt{36 - 24}}{12} = \frac{1}{2} \pm \frac{\sqrt{3}}{6} \approx 0.2113, \; 0.7887$$
   Evaluating $\ddot{s}$ at $\tau = 0.5 - \frac{\sqrt{3}}{6}$:
   $$\ddot{s}_{\max} = \frac{10\sqrt{3}}{3 T^2} \approx \frac{5.7735}{T^2}$$

### 11.1.2 Trapezoidal Velocity Profiles (LSPB: Linear Segment with Parabolic Blends)
When actuators operate near torque limits, maximum acceleration $a_{\max}$ and maximum cruising velocity $v_{\max}$ are strictly bounded. The **Linear Segment with Parabolic Blend (LSPB)** trajectory divides the duration $T$ into three phases:
1. Constant acceleration phase $t \in [0, t_b]$ with $\ddot{q}(t) = a_{\max}$.
2. Constant velocity cruising phase $t \in [t_b, T - t_b]$ with $\dot{q}(t) = v_{\max} = a_{\max} t_b$.
3. Constant deceleration phase $t \in [T - t_b, T]$ with $\ddot{q}(t) = -a_{\max}$.

The displacement accumulated across the profile over total displacement $D = q_f - q_0$ is:
$$D = 2 \cdot \left(\frac{1}{2} a_{\max} t_b^2\right) + v_{\max}(T - 2t_b) = a_{\max} t_b^2 + a_{\max} t_b (T - 2t_b) = a_{\max} t_b (T - t_b) = v_{\max} (T - t_b)$$
Solving for the blend time $t_b$:
$$t_b = \frac{v_{\max} T - D}{v_{\max}} = T - \frac{D}{v_{\max}}$$
Equivalently, expressing in terms of acceleration $a_{\max}$:
$$a_{\max} t_b^2 - a_{\max} T t_b + D = 0 \implies t_b = \frac{T}{2} - \frac{\sqrt{a_{\max}^2 T^2 - 4 a_{\max} D}}{2 a_{\max}}$$
A physically feasible trapezoid requires $t_b \le \frac{T}{2}$, which imposes the strict constraint:
$$\frac{D}{T} < v_{\max} \le \frac{2D}{T}$$
If $v_{\max} = \frac{2D}{T}$, the blend time becomes $t_b = \frac{T}{2}$; the cruising phase vanishes, reducing the profile to a triangular velocity profile.

---

## 11.2 Task Space Trajectory Generation and Quaternion Interpolation

To move an end-effector in operational space from $T_A = (R_A, p_A)$ to $T_B = (R_B, p_B)$, position and orientation must be interpolated independently. Position translation $p(t)$ is smoothly interpolated along the straight line:
$$p(t) = p_A + s(t)(p_B - p_A)$$
where $s(t)$ is a $C^2$ quintic polynomial. However, interpolating rotation matrices $R(t) \in SO(3)$ requires preserving the special orthogonal group structure $R^T R = I, \det(R) = 1$. Direct linear interpolation of matrix components $\tilde{R}(t) = (1-s)R_A + s R_B$ violates orthogonality.

### 11.2.1 Unit Quaternions in $S^3$
A rotation $R \in SO(3)$ by angle $\theta \in [0, \pi]$ about unit axis $\hat{n} \in \mathbb{R}^3$ corresponds to a pair of antipodal unit quaternions $\pm q \in S^3 \subset \mathbb{R}^4$:
$$q = \begin{bmatrix} \eta \\ \epsilon \end{bmatrix} = \begin{bmatrix} \cos(\theta/2) \\ \hat{n} \sin(\theta/2) \end{bmatrix}, \quad \|q\|^2 = \eta^2 + \|\epsilon\|^2 = 1$$
Because $q$ and $-q$ represent the identical physical orientation in $SO(3)$, orientation interpolation must always choose the shortest geodesic path on the 3-sphere $S^3$.

### 11.2.2 Spherical Linear Interpolation ($\operatorname{Slerp}$)
Given two unit quaternions $q_0, q_1 \in S^3$:
1. Compute the spherical inner product:
   $$\cos\Omega = q_0 \cdot q_1 = \eta_0 \eta_1 + \epsilon_0^T \epsilon_1$$
2. **Shortest Path Correction:** If $\cos\Omega < 0$, replace $q_1 \leftarrow -q_1$ and $\cos\Omega \leftarrow -\cos\Omega$. This ensures the interpolation traverses the acute geodesic angle $\Omega \in [0, \pi/2]$.
3. If $\cos\Omega \approx 1$ (e.g., $1 - \cos\Omega < 10^{-6}$), apply normalized linear interpolation ($\operatorname{Nlerp}$) to avoid division by zero:
   $$\operatorname{Slerp}(q_0, q_1; s) \approx \frac{(1-s)q_0 + s q_1}{\|(1-s)q_0 + s q_1\|}$$
4. Otherwise, compute $\Omega = \arccos(\cos\Omega)$ and evaluate:
   $$q(s) = \operatorname{Slerp}(q_0, q_1; s) = \frac{\sin((1-s)\Omega)}{\sin\Omega} q_0 + \frac{\sin(s\Omega)}{\sin\Omega} q_1$$

### 11.2.3 Angular Velocity and Acceleration Along a $\operatorname{Slerp}$ Path
Let the interpolation parameter vary with time: $s = s(t)$. The relative rotation from $q_0$ to $q_1$ is given by the quaternion:
$$\Delta q = q_0^{-1} * q_1 = \begin{bmatrix} \cos(\Omega) \\ \hat{u} \sin(\Omega) \end{bmatrix}$$
where $\hat{u}$ is the fixed unit rotation axis in the frame of $q_0$, and $2\Omega$ is the physical angle between the two 3D orientations (since quaternion half-angle $\theta/2 = \Omega \implies \theta = 2\Omega$).
The instantaneous angular velocity vector $\omega(t) \in \mathbb{R}^3$ in task space is directed along the fixed axis $\hat{u}$ with magnitude:
$$\omega(t) = 2 \Omega \dot{s}(t) \hat{u}$$
The angular acceleration is:
$$\dot{\omega}(t) = 2 \Omega \ddot{s}(t) \hat{u}$$
Thus, using a $C^2$ quintic polynomial for $s(t)$ guarantees that both linear and angular velocities and accelerations begin and end smoothly at zero.

---

## 11.3 Closed-Loop Inverse Kinematics ($\operatorname{CLIK}$)

When tracking a continuous operational space trajectory $x_d(t) \in \mathbb{R}^m$ in real-time, open-loop velocity inversion:
$$\dot{q}(t) = J^+(q(t)) \dot{x}_d(t)$$
causes discrete-time numerical integration drift. Over time, the forward kinematics pose $x(q(t)) = f(q(t))$ diverges significantly from $x_d(t)$.

### 11.3.1 Algorithmic Formulation
To suppress drift, **Closed-Loop Inverse Kinematics ($\operatorname{CLIK}$)** augments the feedforward velocity command with a proportional feedback correction term based on tracking error $e(t) = x_d(t) - f(q(t))$:
$$\dot{q}(t) = J^+(q) \left( \dot{x}_d(t) + K_p e(t) \right)$$
where $K_p \in \mathbb{R}^{m \times m}$ is a symmetric positive-definite gain matrix ($K_p > 0$), typically chosen as $K_p = k_p I_m$ with $k_p > 0$.

```
           +-----------+   x_d(t)       +
 x_d(t) -->| Diff      |---------------->(+)----+
           +-----------+                 ^      |
                 |                       |      |
                 v e(t)                  |      |
             +-------+                   |      |
        (+)--|  K_p  |-------------------+      v
         ^   +-------+                      +-------+   \dot{q}   +-----+  q(t)
         |                                  |  J^+  |------------>| 1/s |----+
         -                                  +-------+             +-----+    |
         |                                                                   |
         +------------------- f(q) <-----------------------------------------+
                             (FK)
```

### 11.3.2 Lyapunov Asymptotic Stability Proof
Consider the positive-definite candidate Lyapunov function:
$$V(e) = \frac{1}{2} e(t)^T e(t) > 0 \quad \forall e \neq 0$$
Differentiating $V(e)$ with respect to time along system trajectories:
$$\dot{V}(e) = e^T \dot{e} = e^T \left( \dot{x}_d - \dot{x} \right) = e^T \left( \dot{x}_d - J(q)\dot{q} \right)$$
Substituting the $\operatorname{CLIK}$ control law $\dot{q} = J^+ (\dot{x}_d + K_p e)$:
$$\dot{V}(e) = e^T \left( \dot{x}_d - J J^+ (\dot{x}_d + K_p e) \right)$$
Assuming the manipulator is non-singular with full row rank $\operatorname{rank}(J) = m$, the projection operator satisfies $J J^+ = I_m$. Therefore:
$$\dot{V}(e) = e^T \left( \dot{x}_d - I_m (\dot{x}_d + K_p e) \right) = e^T \left( -K_p e \right) = -e^T K_p e$$
Since $K_p$ is positive-definite:
$$\dot{V}(e) \le -\lambda_{\min}(K_p) \|e\|^2 < 0 \quad \forall e \neq 0$$
By Lyapunov's Direct Method, the error dynamics are globally exponentially stable:
$$\|e(t)\| \le \|e(0)\| e^{-\lambda_{\min}(K_p) t}$$
The tracking error converges asymptotically to zero, eliminating all numerical integration drift.

### 11.3.3 Orientation Error Representation in $\operatorname{CLIK}$
For full 6-DoF tracking, orientation error between desired rotation $R_d$ and current rotation $R(q)$ must be represented as a 3D vector $e_o \in \mathbb{R}^3$. Two standard representations are used:
1. **Quaternion Error:**
   Let $q_d = (\eta_d, \epsilon_d)$ and $q(q) = (\eta, \epsilon)$. The relative quaternion error is $\Delta q = q^{-1} * q_d = (\Delta\eta, \Delta\epsilon)$:
   $$\Delta\eta = \eta \eta_d + \epsilon^T \epsilon_d, \quad \Delta\epsilon = \eta \epsilon_d - \eta_d \epsilon - \epsilon \times \epsilon_d$$
   The operational orientation error vector fed to the geometric Jacobian is:
   $$e_o = 2 \operatorname{sgn}(\Delta\eta) \Delta\epsilon$$
2. **Skew-Symmetric Matrix Error:**
   $$e_o = \frac{1}{2} \left( n \times n_d + s \times s_d + a \times a_d \right)$$
   where $R = [n \; s \; a]$ and $R_d = [n_d \; s_d \; a_d]$.

---

## 11.4 Joint Limit Enforcement: Clamping vs. Barrier Potentials

Physical manipulators possess rigid mechanical stops:
$$q_{i,\min} \le q_i \le q_{i,\max}, \quad i = 1, \dots, n$$
Ignoring these constraints leads to hardware trips, collision with internal wiring, or motor destruction.

### 11.4.1 Hard Saturation Clamping and Truncation Problems
The simplest approach clamps joint positions after each integration step:
$$q_i^{(k+1)} = \operatorname{clip}\left( q_i^{(k)} + \Delta q_i, \; q_{i,\min}, \; q_{i,\max} \right)$$
However, if joint $i$ is clamped at $q_{i,\max}$ while task velocity demands further motion, hard clamping breaks the kinematic relationship $\dot{x} = J \dot{q}$. The actual operational velocity becomes $J \dot{q}_{\text{clamped}} \neq \dot{x}$, resulting in severe path deviations and large jerky transients when the joint leaves the limit.

### 11.4.2 Logarithmic and Hyperbolic Barrier Potentials
In redundant manipulators ($n > m$), joint limits are enforced smoothly via nullspace projection using an interior-point barrier potential $V_{\text{limit}}(q)$.

#### Logarithmic Barrier Function:
$$V_{\text{limit}}(q) = -\sum_{i=1}^n \ln\left( \frac{(q_i - q_{i,\min})(q_{i,\max} - q_i)}{(q_{i,\max} - q_{i,\min})^2} \right)$$
As $q_i \to q_{i,\min}^+$ or $q_i \to q_{i,\max}^-$, $V_{\text{limit}}(q) \to +\infty$.
The repulsive gradient vector $g_{\text{limit}} = \nabla_q V_{\text{limit}} \in \mathbb{R}^n$ is:
$$\frac{\partial V_{\text{limit}}}{\partial q_i} = -\frac{1}{q_i - q_{i,\min}} + \frac{1}{q_{i,\max} - q_i} = \frac{2 q_i - (q_{i,\max} + q_{i,\min})}{(q_i - q_{i,\min})(q_{i,\max} - q_i)}$$
Note that when $q_i = \bar{q}_i = \frac{q_{i,\max} + q_{i,\min}}{2}$, the gradient is exactly zero.

#### Hyperbolic Secant Activation:
To prevent the barrier gradient from interfering with motion when the joint is comfortably within its safe zone, an activation buffer $\Delta q_{\text{buf}}$ is defined:
$$h_i(q_i) = \begin{cases} 
\left(\frac{q_i - (q_{i,\max} - \Delta q_{\text{buf}})}{\Delta q_{\text{buf}}}\right)^2 & \text{if } q_i > q_{i,\max} - \Delta q_{\text{buf}} \\
-\left(\frac{(q_{i,\min} + \Delta q_{\text{buf}}) - q_i}{\Delta q_{\text{buf}}}\right)^2 & \text{if } q_i < q_{i,\min} + \Delta q_{\text{buf}} \\
0 & \text{otherwise}
\end{cases}$$
Projecting $-g_{\text{limit}}$ into the nullspace of $J$:
$$\dot{q} = J^+ \dot{x}_d - k_{\text{lim}} (I - J^+ J) g_{\text{limit}}(q)$$
Because $(I - J^+ J)$ is orthogonal to the range space of $J^T$, the repulsive joint limit avoidance velocity produces **zero end-effector perturbation**:
$$J \dot{q} = J J^+ \dot{x}_d - k_{\text{lim}} \underbrace{J(I - J^+ J)}_{= 0} g_{\text{limit}} = \dot{x}_d$$

---

## 11.5 Heuristic and Geometric Inverse Kinematics: CCD and FABRIK

When numerical Jacobians are unavailable, computationally prohibitive, or prone to singularity lockup, geometric heuristic algorithms provide robust, unconditionally stable alternatives.

### 11.5.1 Cyclic Coordinate Descent ($\operatorname{CCD}$)
Cyclic Coordinate Descent is an iterative single-variable optimization method. It traverses the kinematic chain from the end-effector link back to the base (or vice versa), optimizing one joint angle $\theta_i$ at a time while holding all other $n-1$ joints fixed.

For a 2D/3D revolute joint $i$ with pivot position $p_i$, current end-effector position $p_e$, target position $p_t$, and joint axis unit vector $\hat{z}_i$:
1. Form the vector from joint pivot to end-effector:
   $$v_e = p_e - p_i$$
2. Form the vector from joint pivot to target:
   $$v_t = p_t - p_i$$
3. Project $v_e$ and $v_t$ onto the plane perpendicular to $\hat{z}_i$:
   $$u_e = v_e - (v_e \cdot \hat{z}_i)\hat{z}_i, \quad u_t = v_t - (v_t \cdot \hat{z}_i)\hat{z}_i$$
4. The incremental rotation angle $\Delta\theta_i$ that aligns $u_e$ with $u_t$ is:
   $$\cos\Delta\theta_i = \frac{u_e \cdot u_t}{\|u_e\| \|u_t\|}, \quad \sin\Delta\theta_i = \frac{\hat{z}_i \cdot (u_e \times u_t)}{\|u_e\| \|u_t\|}$$
   $$\Delta\theta_i = \operatorname{atan2}\left( \hat{z}_i \cdot (u_e \times u_t), \; u_e \cdot u_t \right)$$
5. Update joint $i$: $\theta_i \leftarrow \operatorname{clip}(\theta_i + \Delta\theta_i, \theta_{i,\min}, \theta_{i,\max})$.
6. Update the end-effector position $p_e$ via forward kinematics and repeat for joint $i-1$.

CCD is monotonic: each individual joint update strictly decreases or maintains the Euclidean distance $\|p_t - p_e\|$. However, it tends to over-rotate distal joints and can exhibit slow convergence on long serial chains.

### 11.5.2 Forward And Backward Reaching Inverse Kinematics ($\operatorname{FABRIK}$)
Developed by Aristidou and Cameron (2011), $\operatorname{FABRIK}$ treats the manipulator as a set of points $p_0, p_1, \dots, p_n \in \mathbb{R}^3$ linked by fixed segment lengths $d_i = \|p_{i+1} - p_i\|$. Rather than manipulating angles, $\operatorname{FABRIK}$ operates directly on point coordinates using alternating forward and backward projection sweeps.

```
Initial Chain:
p0 -------- p1 -------- p2 -------- pe      x Target (pt)

Forward Reaching Sweep (End to Base):
p0' <------- p1' <------- p2' <------- p_e' = pt

Backward Reaching Sweep (Base to End):
p0'' = p_base -------> p1'' -------> p2'' -------> pe'' (closer to pt)
```

#### Reachability Check:
Let total arm length be $L = \sum_{i=0}^{n-1} d_i$.
If $\|p_t - p_0\| > L$, the target is unreachable. The chain stretches straight toward $p_t$:
$$p_{i+1} = p_i + d_i \frac{p_t - p_0}{\|p_t - p_0\|}$$

#### Iterative Sweeps (When Target is Reachable):
Each iteration consists of two sweeps:
1. **Forward Reaching Sweep (Stage 1):**
   - Set the end-effector directly onto the target:
     $$p_n^{(k+1/2)} = p_t$$
   - For $i = n-1, n-2, \dots, 0$:
     Find the line connecting $p_i^{(k)}$ and $p_{i+1}^{(k+1/2)}$, and position $p_i^{(k+1/2)}$ along this line at distance $d_i$:
     $$r_i = \|p_{i+1}^{(k+1/2)} - p_i^{(k)}\|$$
     $$\lambda_i = \frac{d_i}{r_i}$$
     $$p_i^{(k+1/2)} = (1 - \lambda_i) p_{i+1}^{(k+1/2)} + \lambda_i p_i^{(k)}$$
2. **Backward Reaching Sweep (Stage 2):**
   - Reset the base back to its anchored physical foundation:
     $$p_0^{(k+1)} = p_{\text{base}}$$
   - For $i = 0, 1, \dots, n-1$:
     Position $p_{i+1}^{(k+1)}$ along the line connecting $p_0^{(k+1)}$ and $p_{i+1}^{(k+1/2)}$ at distance $d_i$:
     $$r_i = \|p_{i+1}^{(k+1/2)} - p_i^{(k+1)}\|$$
     $$\lambda_i = \frac{d_i}{r_i}$$
     $$p_{i+1}^{(k+1)} = (1 - \lambda_i) p_i^{(k+1)} + \lambda_i p_{i+1}^{(k+1/2)}$$

$\operatorname{FABRIK}$ achieves quadratic-like convergence in practice with $O(n)$ computational complexity per iteration, exhibits zero matrix singularity vulnerabilities, and effortlessly incorporates ball-and-socket joint angle limits.

---

## 11.6 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 11.1 – 11.10)

#### Problem 11.1: Quintic Polynomial Coefficients for a High-Speed Industrial Pick-and-Place Move
**Statement:**
A robotic joint must transition from rest at $q_0 = 0.2\text{ rad}$ to rest at $q_f = 1.8\text{ rad}$ in exactly $T = 0.8\text{ s}$ using a $C^2$ smooth quintic polynomial with zero boundary velocities and accelerations ($\dot{q}_0 = \dot{q}_f = 0$, $\ddot{q}_0 = \ddot{q}_f = 0$). Compute the exact polynomial coefficients $a_0, a_1, a_2, a_3, a_4, a_5$, and determine the peak joint velocity $\dot{q}_{\max}$ and peak joint acceleration $\ddot{q}_{\max}$.

**Given Data:**
- $q_0 = 0.2\text{ rad}$, $q_f = 1.8\text{ rad}$, $\Delta q = 1.6\text{ rad}$.
- $T = 0.8\text{ s}$.
- Boundary conditions: $\dot{q}_0 = \dot{q}_f = 0$, $\ddot{q}_0 = \ddot{q}_f = 0$.

**Step-by-Step Derivation:**
1. The general form of the quintic trajectory is:
   $$q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5$$
2. From initial conditions at $t=0$:
   $$q(0) = a_0 = q_0 = 0.2$$
   $$\dot{q}(0) = a_1 = 0$$
   $$\ddot{q}(0) = 2a_2 = 0 \implies a_2 = 0$$
3. For normalized path $q(t) = q_0 + \Delta q \cdot s(t/T)$ where $s(\tau) = 10\tau^3 - 15\tau^4 + 6\tau^5$:
   $$a_3 = \frac{10 \Delta q}{T^3} = \frac{10 \times 1.6}{0.8^3} = \frac{16.0}{0.512} = 31.25\text{ rad/s}^3$$
   $$a_4 = -\frac{15 \Delta q}{T^4} = -\frac{15 \times 1.6}{0.8^4} = -\frac{24.0}{0.4096} = -58.59375\text{ rad/s}^4$$
   $$a_5 = \frac{6 \Delta q}{T^5} = \frac{6 \times 1.6}{0.8^5} = \frac{9.6}{0.32768} = 29.296875\text{ rad/s}^5$$
4. Peak velocity occurs at midpoint $t = T/2 = 0.4\text{ s}$:
   $$\dot{q}_{\max} = \frac{15 \Delta q}{8 T} = \frac{15 \times 1.6}{8 \times 0.8} = \frac{24.0}{6.4} = 3.75\text{ rad/s}$$
5. Peak acceleration occurs at $\tau = \frac{1}{2} - \frac{\sqrt{3}}{6} \approx 0.211325 \implies t \approx 0.16906\text{ s}$:
   $$\ddot{q}_{\max} = \frac{10\sqrt{3}}{3} \frac{\Delta q}{T^2} = \frac{10\sqrt{3}}{3} \frac{1.6}{0.64} = \frac{16\sqrt{3}}{1.92} = \frac{25\sqrt{3}}{3} \approx 14.43376\text{ rad/s}^2$$

**Final Answer:**
- $a_0 = 0.2$, $a_1 = 0$, $a_2 = 0$, $a_3 = 31.25$, $a_4 = -58.59375$, $a_5 = 29.296875$.
- Peak velocity: $\dot{q}_{\max} = 3.75\text{ rad/s}$.
- Peak acceleration: $\ddot{q}_{\max} \approx 14.434\text{ rad/s}^2$.

**Verification:**
At $t=T=0.8$:
$$q(0.8) = 0.2 + 31.25(0.512) - 58.59375(0.4096) + 29.296875(0.32768) = 0.2 + 16.0 - 24.0 + 9.6 = 1.8\text{ rad}$$.
$\dot{q}(0.8) = 3(31.25)(0.64) + 4(-58.59375)(0.512) + 5(29.296875)(0.4096) = 60.0 - 120.0 + 60.0 = 0$. Exact match.

---

#### Problem 11.2: LSPB Trapezoidal Velocity Profile Construction
**Statement:**
A cartesian linear gantry must traverse a distance of $D = 1.2\text{ m}$ in total time $T = 2.0\text{ s}$. The maximum allowable motor acceleration is $a_{\max} = 2.0\text{ m/s}^2$. 
Determine whether a trapezoidal velocity profile is feasible. If feasible, calculate the blend time $t_b$, constant cruising velocity $v_{\max}$, and the fraction of the total time spent in acceleration, cruising, and deceleration.

**Given Data:**
- $D = 1.2\text{ m}$, $T = 2.0\text{ s}$, $a_{\max} = 2.0\text{ m/s}^2$.

**Step-by-Step Derivation:**
1. Check the feasibility condition:
   The minimum time required to cover distance $D$ with acceleration $a_{\max}$ (triangular profile where $t_b = T/2$) is:
   $$D = a_{\max} t_b^2 = a_{\max} (T/2)^2 = \frac{1}{4} a_{\max} T^2 = \frac{1}{4}(2.0)(4.0) = 2.0\text{ m}$$
   Since actual displacement $D = 1.2\text{ m} < 2.0\text{ m}$, the acceleration is more than sufficient, so a trapezoidal profile with a cruising phase is feasible.
2. The blend time satisfies:
   $$a_{\max} t_b^2 - a_{\max} T t_b + D = 0 \implies 2.0 t_b^2 - 4.0 t_b + 1.2 = 0$$
   Divide by 2:
   $$t_b^2 - 2.0 t_b + 0.6 = 0$$
   $$t_b = \frac{2.0 \pm \sqrt{4.0 - 4(1)(0.6)}}{2} = 1.0 \pm \frac{\sqrt{1.6}}{2} = 1.0 \pm \frac{1.264911}{2} = 1.0 \pm 0.632456\text{ s}$$
3. For a physical blend time $t_b \le T/2 = 1.0\text{ s}$:
   $$t_b = 1.0 - 0.632456 = 0.367544\text{ s}$$
4. Calculate cruising velocity $v_{\max}$:
   $$v_{\max} = a_{\max} t_b = 2.0 \times 0.367544 = 0.735089\text{ m/s}$$
5. Calculate durations:
   - Acceleration duration: $t_b = 0.3675\text{ s}$ ($18.38\%$).
   - Cruising duration: $T - 2t_b = 2.0 - 2(0.367544) = 1.264911\text{ s}$ ($63.25\%$).
   - Deceleration duration: $t_b = 0.3675\text{ s}$ ($18.38\%$).

**Final Answer:**
- Feasible: Yes.
- Blend time: $t_b \approx 0.3675\text{ s}$.
- Cruising velocity: $v_{\max} \approx 0.7351\text{ m/s}$.
- Acceleration: $18.38\%$, Cruising: $63.25\%$, Deceleration: $18.38\%$.

**Verification:**
Total distance:
$$D = v_{\max}(T - t_b) = 0.735089 \times (2.0 - 0.367544) = 0.735089 \times 1.632456 = 1.20000\text{ m}$$. Exact.

---

#### Problem 11.3: Spherical Linear Interpolation ($\operatorname{Slerp}$) of Unit Quaternions
**Statement:**
An end-effector rotates from orientation $q_0 = \begin{bmatrix} 1 & 0 & 0 & 0 \end{bmatrix}^T$ (identity rotation) to orientation $q_1 = \begin{bmatrix} \frac{1}{2} & \frac{1}{2} & \frac{1}{2} & \frac{1}{2} \end{bmatrix}^T$.
1. Compute the geodesic spherical angle $\Omega$ between $q_0$ and $q_1$ in $S^3$.
2. Compute the interpolated quaternion $q(s)$ at midpoint parameter $s = 0.5$.
3. Verify that $\|q(0.5)\| = 1$, and identify the equivalent axis-angle representation of $q(0.5)$.

**Given Data:**
- $q_0 = [1, 0, 0, 0]^T$, $q_1 = [0.5, 0.5, 0.5, 0.5]^T$, $s = 0.5$.

**Step-by-Step Derivation:**
1. Inner product between unit quaternions:
   $$\cos\Omega = q_0 \cdot q_1 = 1(0.5) + 0 + 0 + 0 = 0.5$$
   Since $\cos\Omega = 0.5 > 0$, no sign flip is needed.
   $$\Omega = \arccos(0.5) = \frac{\pi}{3}\text{ rad} = 60^\circ$$
2. For $s = 0.5$:
   $$\sin\Omega = \sin\left(\frac{\pi}{3}\right) = \frac{\sqrt{3}}{2}$$
   $$(1-s)\Omega = 0.5\left(\frac{\pi}{3}\right) = \frac{\pi}{6}, \quad s\Omega = \frac{\pi}{6}$$
   $$\sin((1-s)\Omega) = \sin\left(\frac{\pi}{6}\right) = \frac{1}{2}$$
   The interpolation weights are:
   $$w_0 = \frac{\sin(\pi/6)}{\sin(\pi/3)} = \frac{1/2}{\sqrt{3}/2} = \frac{1}{\sqrt{3}}$$
   $$w_1 = \frac{\sin(\pi/6)}{\sin(\pi/3)} = \frac{1}{\sqrt{3}}$$
3. Evaluating $q(0.5)$:
   $$q(0.5) = \frac{1}{\sqrt{3}} q_0 + \frac{1}{\sqrt{3}} q_1 = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix} + \frac{1}{\sqrt{3}} \begin{bmatrix} 0.5 \\ 0.5 \\ 0.5 \\ 0.5 \end{bmatrix} = \begin{bmatrix} \frac{1.5}{\sqrt{3}} \\ \frac{0.5}{\sqrt{3}} \\ \frac{0.5}{\sqrt{3}} \\ \frac{0.5}{\sqrt{3}} \end{bmatrix} = \begin{bmatrix} \frac{\sqrt{3}}{2} \\ \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \end{bmatrix}$$
4. Verification of unit norm:
   $$\|q(0.5)\|^2 = \left(\frac{\sqrt{3}}{2}\right)^2 + 3\left(\frac{1}{2\sqrt{3}}\right)^2 = \frac{3}{4} + 3\left(\frac{1}{12}\right) = \frac{3}{4} + \frac{1}{4} = 1.0$$
5. Axis-angle extraction:
   $$\eta = \cos(\theta/2) = \frac{\sqrt{3}}{2} \implies \frac{\theta/2} = \frac{\pi}{6} \implies \theta = \frac{\pi}{3} = 60^\circ$$
   $$\epsilon = \hat{n} \sin(\theta/2) = \hat{n} \left(\frac{1}{2}\right) = \begin{bmatrix} \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \end{bmatrix} \implies \hat{n} = \begin{bmatrix} \frac{1}{\sqrt{3}} \\ \frac{1}{\sqrt{3}} \\ \frac{1}{\sqrt{3}} \end{bmatrix}$$
   The midpoint orientation is a rotation of $60^\circ$ around unit axis $\hat{n} = \frac{1}{\sqrt{3}}[1, 1, 1]^T$ (whereas $q_1$ is a rotation of $120^\circ$ around the same axis, since $\eta_1 = 0.5 \implies \theta_1/2 = 60^\circ \implies \theta_1 = 120^\circ$).

**Final Answer:**
- Geodesic angle in $S^3$: $\Omega = \pi/3\text{ rad} = 60^\circ$.
- $q(0.5) = \left[ \frac{\sqrt{3}}{2}, \; \frac{1}{2\sqrt{3}}, \; \frac{1}{2\sqrt{3}}, \; \frac{1}{2\sqrt{3}} \right]^T \approx [0.8660, 0.2887, 0.2887, 0.2887]^T$.
- Physical rotation angle: $\theta = 60^\circ$ about axis $\hat{n} = \frac{1}{\sqrt{3}}[1, 1, 1]^T$.

**Verification:**
The physical rotation angle at $s=0.5$ is exactly half of the total physical angle $\theta_1 = 120^\circ$, confirming constant angular velocity geodesic traversal.

---

#### Problem 11.4: Numerical Drift in Open-Loop Kinematics vs. $\operatorname{CLIK}$ Compensation
**Statement:**
A 1-DoF prismatic actuator controls position $x = q$ with desired trajectory $x_d(t) = \sin(t)$. Due to a systematic sensor calibration bias and integration error, the computed forward kinematics update is simulated with discrete time-step $\Delta t = 0.1\text{ s}$ using forward Euler integration.
1. Show that open-loop velocity inversion $\dot{q} = \dot{x}_d$ with an initial disturbance $e(0) = 0.05\text{ m}$ retains the tracking error indefinitely.
2. Formulate the $\operatorname{CLIK}$ scheme $\dot{q} = \dot{x}_d + k_p (x_d - q)$ with gain $k_p = 5.0\text{ s}^{-1}$. Determine the analytical closed-form expression for $e(t)$ and compute the tracking error remaining after $t = 1.0\text{ s}$.

**Given Data:**
- $x_d(t) = \sin(t)$, $\dot{x}_d(t) = \cos(t)$.
- Initial error $e(0) = x_d(0) - q(0) = 0.05\text{ m}$.
- Feedback gain $k_p = 5.0\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. Open-loop inversion:
   $$\dot{q}(t) = \dot{x}_d(t) \implies q(t) = q(0) + \int_0^t \dot{x}_d(\tau) d\tau = q(0) + x_d(t) - x_d(0)$$
   Tracking error:
   $$e(t) = x_d(t) - q(t) = x_d(t) - [q(0) + x_d(t) - x_d(0)] = x_d(0) - q(0) = e(0)$$
   Thus, for all $t \ge 0$, $e(t) = e(0) = 0.05\text{ m}$. Open-loop inversion possesses zero error rejection capability.
2. $\operatorname{CLIK}$ formulation:
   $$\dot{q}(t) = \dot{x}_d(t) + k_p e(t)$$
   The error dynamics are:
   $$\dot{e}(t) = \dot{x}_d(t) - \dot{q}(t) = \dot{x}_d(t) - [\dot{x}_d(t) + k_p e(t)] = -k_p e(t)$$
3. Solving the first-order differential equation:
   $$e(t) = e(0) e^{-k_p t}$$
4. At $t = 1.0\text{ s}$ with $k_p = 5.0$:
   $$e(1.0) = 0.05 \cdot e^{-5.0 \times 1.0} = 0.05 \cdot e^{-5} = 0.05 \times 0.00673795 = 0.000336898\text{ m} \approx 0.337\text{ mm}$$
   The initial $50\text{ mm}$ error is suppressed by over $99.3\%$.

**Final Answer:**
- Open-loop error: $e(t) = 0.05\text{ m}$ (constant drift).
- $\operatorname{CLIK}$ error expression: $e(t) = 0.05 e^{-5 t}\text{ m}$.
- Remaining error at $t = 1.0\text{ s}$: $e(1.0) \approx 3.37 \times 10^{-4}\text{ m}$ ($0.337\text{ mm}$).

**Verification:**
$$\dot{V}(e) = e \dot{e} = e(-5e) = -5e^2 \le 0$. The time constant is $\tau = 1/k_p = 0.2\text{ s}$. At $t = 1.0\text{ s}$, $5$ time constants have elapsed ($e^{-5} \approx 0.00674$). Exact match.

---

#### Problem 11.5: Nullspace Logarithmic Barrier Potential for Joint Limit Avoidance
**Statement:**
A 3-DoF planar redundant manipulator ($n=3, m=2$) has joint angles $q = [0.8, 1.2, 0.5]^T\text{ rad}$. The joint limits for joint 1 are $q_{1,\min} = 0.0\text{ rad}$ and $q_{1,\max} = 1.0\text{ rad}$. The Jacobian matrix at this configuration is:
$$J = \begin{bmatrix} -0.6 & -0.4 & -0.2 \\ 0.8 & 0.5 & 0.3 \end{bmatrix}$$
The desired end-effector task velocity is $\dot{x}_d = [0, 0]^T$ (holding pose). 
Using the logarithmic barrier function:
$$V_1(q_1) = -\ln\left( \frac{(q_1 - q_{1,\min})(q_{1,\max} - q_1)}{(q_{1,\max} - q_{1,\min})^2} \right)$$
and secondary gain $k_{\text{lim}} = 0.1$, compute the primary pseudoinverse velocity $\dot{q}_{\text{task}}$, the barrier repulsive gradient $g_1$, the nullspace projector $P = I - J^+ J$, and the resulting joint velocities $\dot{q}$ that push joint 1 away from its upper limit without moving the end-effector.

**Given Data:**
- $q_1 = 0.8$, $q_{1,\min} = 0.0$, $q_{1,\max} = 1.0$.
- $J = \begin{bmatrix} -0.6 & -0.4 & -0.2 \\ 0.8 & 0.5 & 0.3 \end{bmatrix}$, $\dot{x}_d = [0, 0]^T$, $k_{\text{lim}} = 0.1$.

**Step-by-Step Derivation:**
1. Task velocity contribution:
   $$\dot{q}_{\text{task}} = J^+ \dot{x}_d = J^+ \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
2. Compute barrier gradient for joint 1:
   $$\frac{\partial V_1}{\partial q_1} = \frac{2 q_1 - (q_{1,\max} + q_{1,\min})}{(q_1 - q_{1,\min})(q_{1,\max} - q_1)} = \frac{2(0.8) - 1.0}{(0.8 - 0.0)(1.0 - 0.8)} = \frac{1.6 - 1.0}{(0.8)(0.2)} = \frac{0.6}{0.16} = 3.75\text{ rad}^{-1}$$
   Assuming joints 2 and 3 are at center limits, the full gradient vector is:
   $$g_{\text{lim}} = \begin{bmatrix} 3.75 \\ 0 \\ 0 \end{bmatrix}$$
3. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} (-0.6)^2 + (-0.4)^2 + (-0.2)^2 & (-0.6)(0.8) + (-0.4)(0.5) + (-0.2)(0.3) \\ (-0.6)(0.8) + (-0.4)(0.5) + (-0.2)(0.3) & 0.8^2 + 0.5^2 + 0.3^2 \end{bmatrix}$$
   $$J J^T = \begin{bmatrix} 0.36 + 0.16 + 0.04 & -0.48 - 0.20 - 0.06 \\ -0.74 & 0.64 + 0.25 + 0.09 \end{bmatrix} = \begin{bmatrix} 0.56 & -0.74 \\ -0.74 & 0.98 \end{bmatrix}$$
   Determinant:
   $$\det(J J^T) = (0.56)(0.98) - (-0.74)^2 = 0.5488 - 0.5476 = 0.0012$$
   Inverse:
   $$(J J^T)^{-1} = \frac{1}{0.0012} \begin{bmatrix} 0.98 & 0.74 \\ 0.74 & 0.56 \end{bmatrix} = \begin{bmatrix} 816.6667 & 616.6667 \\ 616.6667 & 466.6667 \end{bmatrix}$$
4. Compute nullspace basis $v_{\text{null}}$:
   A vector in the nullspace of $J$ satisfies $J v_{\text{null}} = 0$:
   $$-0.6 v_1 - 0.4 v_2 - 0.2 v_3 = 0 \implies 3 v_1 + 2 v_2 + v_3 = 0$$
   $$0.8 v_1 + 0.5 v_2 + 0.3 v_3 = 0 \implies 8 v_1 + 5 v_2 + 3 v_3 = 0$$
   From $3 v_1 + 2 v_2 + v_3 = 0 \implies v_3 = -3 v_1 - 2 v_2$.
   Substitute into second equation:
   $$8 v_1 + 5 v_2 + 3(-3 v_1 - 2 v_2) = 8 v_1 + 5 v_2 - 9 v_1 - 6 v_2 = -v_1 - v_2 = 0 \implies v_2 = -v_1$$
   Then $v_3 = -3 v_1 - 2(-v_1) = -v_1$.
   Choosing $v_1 = 1$, the unnormalized nullspace basis is $n_0 = [1, -1, -1]^T$.
   Normalizing:
   $$\hat{n}_0 = \frac{1}{\sqrt{1^2 + (-1)^2 + (-1)^2}} \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix}$$
5. The rank-1 nullspace projector is:
   $$P = I - J^+ J = \hat{n}_0 \hat{n}_0^T = \frac{1}{3} \begin{bmatrix} 1 & -1 & -1 \\ -1 & 1 & 1 \\ -1 & 1 & 1 \end{bmatrix}$$
6. Projected nullspace avoidance velocity:
   $$\dot{q} = -k_{\text{lim}} P g_{\text{lim}} = -0.1 \left( \frac{1}{3} \begin{bmatrix} 1 & -1 & -1 \\ -1 & 1 & 1 \\ -1 & 1 & 1 \end{bmatrix} \begin{bmatrix} 3.75 \\ 0 \\ 0 \end{bmatrix} \right) = -0.1 \begin{bmatrix} 1.25 \\ -1.25 \\ -1.25 \end{bmatrix} = \begin{bmatrix} -0.125 \\ +0.125 \\ +0.125 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
- Primary task velocity: $\dot{q}_{\text{task}} = [0, 0, 0]^T$.
- Repulsive gradient: $g_{\text{lim}} = [3.75, 0, 0]^T\text{ rad}^{-1}$.
- Net joint velocity: $\dot{q} = [-0.125, +0.125, +0.125]^T\text{ rad/s}$.

**Verification:**
Check end-effector velocity invariance:
$$J \dot{q} = \begin{bmatrix} -0.6 & -0.4 & -0.2 \\ 0.8 & 0.5 & 0.3 \end{bmatrix} \begin{bmatrix} -0.125 \\ 0.125 \\ 0.125 \end{bmatrix} = \begin{bmatrix} (-0.6)(-0.125) + (-0.4)(0.125) + (-0.2)(0.125) \\ (0.8)(-0.125) + (0.5)(0.125) + (0.3)(0.125) \end{bmatrix} = \begin{bmatrix} 0.075 - 0.050 - 0.025 \\ -0.100 + 0.0625 + 0.0375 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix}$$.
Joint 1 moves safely away from its limit ($\dot{q}_1 = -0.125\text{ rad/s}$) while the end-effector remains completely stationary.

---

#### Problem 11.6: Single-Step 2D Cyclic Coordinate Descent ($\operatorname{CCD}$) Update
**Statement:**
A 2-link planar arm with link lengths $l_1 = 1.0\text{ m}, l_2 = 1.0\text{ m}$ is at configuration $\theta_1 = 0^\circ, \theta_2 = 0^\circ$. The base is at the origin $p_0 = [0, 0]^T$. The elbow is at $p_1 = [1, 0]^T$, and the end-effector is at $p_e = [2, 0]^T$. The target is at $p_t = [1, 1]^T$.
Execute one backward sweep of $\operatorname{CCD}$:
1. Compute the angular update $\Delta\theta_2$ for joint 2 and update $p_e$.
2. Compute the angular update $\Delta\theta_1$ for joint 1.
3. Compute the final end-effector position and residual distance to $p_t$.

**Given Data:**
- $p_0 = [0, 0]^T$, $p_1 = [1, 0]^T$, initial $p_e = [2, 0]^T$, $p_t = [1, 1]^T$.
- Initial angles: $\theta_1 = 0, \theta_2 = 0$.

**Step-by-Step Derivation:**
1. **Update Joint 2 (Elbow at $p_1$):**
   - Vector from elbow to end-effector:
     $$v_e = p_e - p_1 = [2, 0]^T - [1, 0]^T = [1, 0]^T$$
   - Vector from elbow to target:
     $$v_t = p_t - p_1 = [1, 1]^T - [1, 0]^T = [0, 1]^T$$
   - Angle between $v_e$ and $v_t$:
     $$v_e \cdot v_t = 1(0) + 0(1) = 0$$
     $$v_e \times v_t = (1)(1) - (0)(0) = 1.0$$
     $$\Delta\theta_2 = \operatorname{atan2}(1.0, 0.0) = \frac{\pi}{2} = 90^\circ$$
   - New joint 2 angle: $\theta_2 \leftarrow 0 + 90^\circ = 90^\circ$.
   - New end-effector position:
     $$p_e = p_1 + R(90^\circ) [1, 0]^T = [1, 0]^T + [0, 1]^T = [1, 1]^T$$
2. **Update Joint 1 (Base at $p_0$):**
   - Notice that after updating joint 2, $p_e = [1, 1]^T$.
   - The current end-effector position $p_e$ is already exactly equal to the target $p_t = [1, 1]^T$!
   - Vector from base to end-effector: $v_e = [1, 1]^T$.
   - Vector from base to target: $v_t = [1, 1]^T$.
   - $\Delta\theta_1 = \operatorname{atan2}(0, 2) = 0^\circ$.
   - Joint 1 remains $\theta_1 = 0^\circ$.

**Final Answer:**
- $\Delta\theta_2 = 90^\circ$ ($\theta_2 = 90^\circ$).
- $\Delta\theta_1 = 0^\circ$ ($\theta_1 = 0^\circ$).
- Final end-effector position: $p_e = [1, 1]^T$.
- Residual distance: $\|p_t - p_e\| = 0.0\text{ m}$ (exact convergence in 1 step).

**Verification:**
Forward kinematics for $\theta_1 = 0^\circ, \theta_2 = 90^\circ$:
$x = l_1 \cos(0^\circ) + l_2 \cos(90^\circ) = 1.0(1) + 1.0(0) = 1.0$.
$y = l_1 \sin(0^\circ) + l_2 \sin(90^\circ) = 1.0(0) + 1.0(1) = 1.0$.
Target reached precisely.

---

#### Problem 11.7: One Full Iteration of $\operatorname{FABRIK}$ on a 2-Link Manipulator
**Statement:**
A 2-link planar chain has base $p_0 = [0, 0]^T$ and link lengths $d_0 = 1.0\text{ m}, d_1 = 1.0\text{ m}$.
Initial joint positions are $p_0 = [0, 0]^T, p_1 = [1, 0]^T, p_2 = [2, 0]^T$. The target position is $p_t = [1, 1]^T$.
Perform exactly one iteration (one forward sweep and one backward sweep) of the $\operatorname{FABRIK}$ algorithm. Compute the intermediate positions $p_i^{(1/2)}$, updated positions $p_i^{(1)}$, and the Euclidean tracking error after iteration 1.

**Given Data:**
- $p_0 = [0, 0]^T, p_1 = [1, 0]^T, p_2 = [2, 0]^T$.
- $d_0 = 1.0, d_1 = 1.0$, $p_t = [1, 1]^T$.

**Step-by-Step Derivation:**
1. **Reachability Check:**
   Total reach $L = d_0 + d_1 = 2.0\text{ m}$. Distance to target: $\|p_t - p_0\| = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1.4142\text{ m} \le 2.0\text{ m}$. Target is reachable.
2. **Forward Sweep (End to Base):**
   - Set end-effector to target:
     $$p_2^{(1/2)} = p_t = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$$
   - Project to find $p_1^{(1/2)}$ along line connecting $p_2^{(1/2)}$ and $p_1^{(0)} = [1, 0]^T$:
     $$r_1 = \|p_2^{(1/2)} - p_1^{(0)}\| = \left\| \begin{bmatrix} 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1 \\ 0 \end{bmatrix} \right\| = \left\| \begin{bmatrix} 0 \\ 1 \end{bmatrix} \right\| = 1.0$$
     $$\lambda_1 = \frac{d_1}{r_1} = \frac{1.0}{1.0} = 1.0$$
     $$p_1^{(1/2)} = (1 - \lambda_1) p_2^{(1/2)} + \lambda_1 p_1^{(0)} = 0 + 1.0 \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
   - Project to find $p_0^{(1/2)}$ along line connecting $p_1^{(1/2)}$ and $p_0^{(0)} = [0, 0]^T$:
     $$r_0 = \|p_1^{(1/2)} - p_0^{(0)}\| = \| [1, 0]^T - [0, 0]^T \| = 1.0 \implies \lambda_0 = 1.0 \implies p_0^{(1/2)} = [0, 0]^T$$
3. **Backward Sweep (Base to End):**
   - Reset base to anchor:
     $$p_0^{(1)} = p_{\text{base}} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   - Project to find $p_1^{(1)}$ along line connecting $p_0^{(1)}$ and $p_1^{(1/2)} = [1, 0]^T$:
     $$r_0 = \|p_1^{(1/2)} - p_0^{(1)}\| = 1.0 \implies \lambda_0 = 1.0 \implies p_1^{(1)} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
   - Project to find $p_2^{(1)}$ along line connecting $p_1^{(1)}$ and $p_2^{(1/2)} = [1, 1]^T$:
     $$r_1 = \|p_2^{(1/2)} - p_1^{(1)}\| = \left\| \begin{bmatrix} 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1 \\ 0 \end{bmatrix} \right\| = 1.0$$
     $$\lambda_1 = \frac{d_1}{r_1} = \frac{1.0}{1.0} = 1.0$$
     $$p_2^{(1)} = (1 - \lambda_1) p_1^{(1)} + \lambda_1 p_2^{(1/2)} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$$
4. **Tracking Error:**
   $$e = \|p_t - p_2^{(1)}\| = \| [1, 1]^T - [1, 1]^T \| = 0.0\text{ m}$$

**Final Answer:**
- $p_0^{(1)} = [0, 0]^T$.
- $p_1^{(1)} = [1, 0]^T$.
- $p_2^{(1)} = [1, 1]^T$.
- Tracking error: $0.0\text{ m}$ (converged in 1 iteration).

**Verification:**
Link length constraints:
$\|p_1^{(1)} - p_0^{(1)}\| = \|[1, 0]^T\| = 1.0 = d_0$.
$\|p_2^{(1)} - p_1^{(1)}\| = \|[0, 1]^T\| = 1.0 = d_1$. Both link lengths strictly preserved.

---

#### Problem 11.8: Minimum Motion Duration Under Velocity and Acceleration Constraints
**Statement:**
A joint move must traverse $\Delta q = 2.5\text{ rad}$ using a quintic polynomial trajectory. The actuator is subject to hard limits on maximum velocity $v_{\lim} = 2.0\text{ rad/s}$ and maximum acceleration $a_{\lim} = 5.0\text{ rad/s}^2$.
Compute the minimum allowable motion duration $T_{\min}$ that simultaneously satisfies both velocity and acceleration constraints.

**Given Data:**
- $\Delta q = 2.5\text{ rad}$.
- $v_{\lim} = 2.0\text{ rad/s}$, $a_{\lim} = 5.0\text{ rad/s}^2$.

**Step-by-Step Derivation:**
1. Recall the peak velocity of a quintic polynomial:
   $$\dot{q}_{\max} = \frac{15 \Delta q}{8 T} \le v_{\lim}$$
   Solving for duration $T$ based on velocity limit:
   $$T \ge \frac{15 \Delta q}{8 v_{\lim}} = \frac{15 \times 2.5}{8 \times 2.0} = \frac{37.5}{16.0} = 2.34375\text{ s}$$
2. Recall the peak acceleration of a quintic polynomial:
   $$\ddot{q}_{\max} = \frac{10\sqrt{3}}{3} \frac{\Delta q}{T^2} \le a_{\lim}$$
   Solving for duration $T$ based on acceleration limit:
   $$T^2 \ge \frac{10\sqrt{3} \Delta q}{3 a_{\lim}} = \frac{10\sqrt{3} \times 2.5}{3 \times 5.0} = \frac{25\sqrt{3}}{15} = \frac{5\sqrt{3}}{3} = \frac{5}{\sqrt{3}} \approx 2.886751\text{ s}^2$$
   $$T \ge \sqrt{2.886751} \approx 1.69904\text{ s}$$
3. The governing minimum duration is the maximum of the two constraints:
   $$T_{\min} = \max(T_{\text{vel}}, T_{\text{acc}}) = \max(2.34375, 1.69904) = 2.34375\text{ s}$$
   In this regime, the velocity constraint is active (limiting), while the acceleration constraint is inactive.

**Final Answer:**
- $T_{\min} = 2.34375\text{ s}$ (governed by velocity limit).

**Verification:**
At $T = 2.34375\text{ s}$:
$\dot{q}_{\max} = \frac{15(2.5)}{8(2.34375)} = 2.0\text{ rad/s} = v_{\lim}$.
$\ddot{q}_{\max} = \frac{10\sqrt{3}(2.5)}{3(2.34375)^2} = \frac{43.30127}{16.4795} = 2.6276\text{ rad/s}^2 \le 5.0\text{ rad/s}^2$. Both constraints strictly satisfied.

---

#### Problem 11.9: Discrete-Time Integration Stability of $\operatorname{CLIK}$
**Statement:**
In a discrete-time robot controller running at sampling rate $f_s = 500\text{ Hz}$ ($\Delta t = 0.002\text{ s}$), $\operatorname{CLIK}$ uses forward Euler integration:
$$q_{k+1} = q_k + \Delta t \, J^+(q_k) \left( \dot{x}_{d,k} + K_p e_k \right)$$
Assuming a scalar 1-DoF system with $J = 1$:
1. Derive the discrete-time error recurrence relation $e_{k+1} = A_{\text{discrete}} e_k$.
2. Determine the theoretical upper bound on feedback gain $K_p$ for numerical stability ($|A_{\text{discrete}}| < 1$).
3. If $K_p = 200\text{ s}^{-1}$, compute the decay factor per time step and determine if the discrete closed-loop system is stable.

**Given Data:**
- $\Delta t = 0.002\text{ s}$, $J = 1$.
- $K_p = 200\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. Forward Euler discrete update:
   $$q_{k+1} = q_k + \Delta t (\dot{x}_{d,k} + K_p e_k)$$
   Assuming $\dot{x}_{d,k} \approx \frac{x_{d,k+1} - x_{d,k}}{\Delta t}$:
   $$q_{k+1} = q_k + (x_{d,k+1} - x_{d,k}) + \Delta t K_p e_k$$
   Subtract both sides from $x_{d,k+1}$:
   $$x_{d,k+1} - q_{k+1} = x_{d,k+1} - [q_k + x_{d,k+1} - x_{d,k} + \Delta t K_p e_k]$$
   $$e_{k+1} = (x_{d,k} - q_k) - \Delta t K_p e_k = e_k - \Delta t K_p e_k = (1 - K_p \Delta t) e_k$$
2. For numerical stability of the discrete map:
   $$|1 - K_p \Delta t| < 1 \iff -1 < 1 - K_p \Delta t < 1$$
   Subtract 1:
   $$-2 < -K_p \Delta t < 0 \iff 0 < K_p < \frac{2}{\Delta t}$$
   With $\Delta t = 0.002\text{ s}$:
   $$K_{p,\text{crit}} = \frac{2}{0.002} = 1000\text{ s}^{-1}$$
3. For $K_p = 200\text{ s}^{-1}$:
   $$A_{\text{discrete}} = 1 - (200)(0.002) = 1 - 0.4 = 0.6$$
   Since $|0.6| < 1$, the discrete system is monotonically stable. In each $2\text{ ms}$ servo tick, error decays by $40\%$.

**Final Answer:**
- Discrete recurrence: $e_{k+1} = (1 - K_p \Delta t) e_k$.
- Upper bound for stability: $K_p < 1000\text{ s}^{-1}$.
- Decay factor: $0.6$ per tick (stable).

**Verification:**
After 10 ticks ($20\text{ ms}$), error decreases by a factor of $(0.6)^{10} \approx 0.00605$, eliminating $99.4\%$ of the error smoothly without overshoot or oscillation.

---

#### Problem 11.10: Unreachable Target Geometry in $\operatorname{FABRIK}$
**Statement:**
A 3-link planar manipulator with base $p_0 = [0, 0]^T$ and link lengths $d_0 = 1.0\text{ m}, d_1 = 0.8\text{ m}, d_2 = 0.6\text{ m}$ is commanded to reach a target point $p_t = [3.0, 4.0]^T$.
1. Determine whether the target is within the reachable workspace.
2. Apply the $\operatorname{FABRIK}$ unreachable target projection to determine the exact coordinates of all joint points $p_0, p_1, p_2, p_3$.
3. Compute the final distance from the end-effector to the target.

**Given Data:**
- $p_0 = [0, 0]^T$, $d_0 = 1.0, d_1 = 0.8, d_2 = 0.6$.
- $p_t = [3.0, 4.0]^T$.

**Step-by-Step Derivation:**
1. Total reach:
   $$L = d_0 + d_1 + d_2 = 1.0 + 0.8 + 0.6 = 2.4\text{ m}$$
   Target distance from base:
   $$D = \|p_t - p_0\| = \sqrt{3.0^2 + 4.0^2} = \sqrt{9 + 16} = 5.0\text{ m}$$
   Since $D = 5.0\text{ m} > L = 2.4\text{ m}$, the target is completely unreachable.
2. In $\operatorname{FABRIK}$, when a target is unreachable, the arm stretches fully along the line connecting $p_0$ to $p_t$.
   The unit direction vector is:
   $$\hat{u} = \frac{p_t - p_0}{\|p_t - p_0\|} = \frac{1}{5.0} \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}$$
3. Compute joint positions:
   $$p_0 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   $$p_1 = p_0 + d_0 \hat{u} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} + 1.0 \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}$$
   $$p_2 = p_1 + d_1 \hat{u} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} + 0.8 \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0.6 + 0.48 \\ 0.8 + 0.64 \end{bmatrix} = \begin{bmatrix} 1.08 \\ 1.44 \end{bmatrix}$$
   $$p_3 = p_2 + d_2 \hat{u} = \begin{bmatrix} 1.08 \\ 1.44 \end{bmatrix} + 0.6 \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 1.08 + 0.36 \\ 1.44 + 0.48 \end{bmatrix} = \begin{bmatrix} 1.44 \\ 1.92 \end{bmatrix}$$
4. Distance from end-effector $p_3$ to target $p_t$:
   $$\|p_t - p_3\| = D - L = 5.0 - 2.4 = 2.6\text{ m}$$

**Final Answer:**
- Target is unreachable ($5.0\text{ m} > 2.4\text{ m}$).
- $p_0 = [0, 0]^T, p_1 = [0.6, 0.8]^T, p_2 = [1.08, 1.44]^T, p_3 = [1.44, 1.92]^T$.
- Residual distance: $2.6\text{ m}$.

**Verification:**
$\|p_3\| = \sqrt{1.44^2 + 1.92^2} = \sqrt{2.0736 + 3.6864} = \sqrt{5.76} = 2.4\text{ m} = L$. Arm is fully extended directly along the line of sight to target.

---

### Section 2: Solved Exercises (Problems 11.11 – 11.20)

#### Problem 11.11: Nonzero Velocity Boundary Conditions in Quintic Polynomials
**Statement:**
A robotic joint must pass through a waypoint at $t = 0$ with position $q_0 = 1.0\text{ rad}$, velocity $\dot{q}_0 = 2.0\text{ rad/s}$, and acceleration $\ddot{q}_0 = 0\text{ rad/s}^2$, and arrive at a target at $t = T = 1.0\text{ s}$ with position $q_f = 4.0\text{ rad}$, velocity $\dot{q}_f = 0\text{ rad/s}$, and acceleration $\ddot{q}_f = 0\text{ rad/s}^2$.
Compute the six coefficients of the quintic polynomial.

**Given Data:**
- $q_0 = 1.0, \dot{q}_0 = 2.0, \ddot{q}_0 = 0$.
- $q_f = 4.0, \dot{q}_f = 0, \ddot{q}_f = 0$.
- $T = 1.0\text{ s}$.

**Step-by-Step Derivation:**
1. Initial coefficients:
   $$a_0 = q_0 = 1.0$$
   $$a_1 = \dot{q}_0 = 2.0$$
   $$a_2 = \frac{1}{2}\ddot{q}_0 = 0.0$$
2. The remaining coefficients satisfy:
   $$a_3 T^3 + a_4 T^4 + a_5 T^5 = q_f - q_0 - \dot{q}_0 T - \frac{1}{2}\ddot{q}_0 T^2 = 4.0 - 1.0 - 2.0(1.0) - 0 = 1.0$$
   $$3 a_3 T^2 + 4 a_4 T^3 + 5 a_5 T^4 = \dot{q}_f - \dot{q}_0 - \ddot{q}_0 T = 0 - 2.0 - 0 = -2.0$$
   $$6 a_3 T + 12 a_4 T^2 + 20 a_5 T^3 = \ddot{q}_f - \ddot{q}_0 = 0 - 0 = 0$$
3. Since $T = 1.0$, this simplifies to:
   $$\begin{bmatrix} 1 & 1 & 1 \\ 3 & 4 & 5 \\ 6 & 12 & 20 \end{bmatrix} \begin{bmatrix} a_3 \\ a_4 \\ a_5 \end{bmatrix} = \begin{bmatrix} 1.0 \\ -2.0 \\ 0.0 \end{bmatrix}$$
4. Solving by elimination:
   - Row 2 - 3(Row 1): $a_4 + 2 a_5 = -2.0 - 3(1.0) = -5.0 \implies a_4 = -5.0 - 2 a_5$.
   - Row 3 - 6(Row 1): $6 a_4 + 14 a_5 = 0 - 6(1.0) = -6.0$.
   - Substitute $a_4$:
     $$6(-5.0 - 2 a_5) + 14 a_5 = -6.0 \implies -30.0 - 12 a_5 + 14 a_5 = -6.0 \implies 2 a_5 = 24.0 \implies a_5 = 12.0$$
   - Find $a_4$:
     $$a_4 = -5.0 - 2(12.0) = -29.0$$
   - Find $a_3$:
     $$a_3 = 1.0 - a_4 - a_5 = 1.0 - (-29.0) - 12.0 = 18.0$$

**Final Answer:**
- $a_0 = 1.0, a_1 = 2.0, a_2 = 0.0, a_3 = 18.0, a_4 = -29.0, a_5 = 12.0$.

**Verification:**
$q(1) = 1 + 2 + 18 - 29 + 12 = 4.0\text{ rad}$.
$\dot{q}(1) = 2 + 3(18) + 4(-29) + 5(12) = 2 + 54 - 116 + 60 = 0\text{ rad/s}$.
$\ddot{q}(1) = 6(18) + 12(-29) + 20(12) = 108 - 348 + 240 = 0\text{ rad/s}^2$. Exact.

---

#### Problem 11.12: LSPB Blend Time as a Function of Cruising Velocity
**Statement:**
A joint move requires displacement $D = \pi\text{ rad}$ with cruising velocity $v = 1.5\text{ rad/s}$ and total duration $T = 3.0\text{ s}$. 
Compute the required blend acceleration $a$, blend time $t_b$, and verify that $t_b < T/2$.

**Given Data:**
- $D = \pi \approx 3.14159\text{ rad}$.
- $v = 1.5\text{ rad/s}$, $T = 3.0\text{ s}$.

**Step-by-Step Derivation:**
1. The displacement in an LSPB profile is:
   $$D = v(T - t_b) \implies T - t_b = \frac{D}{v}$$
2. Solve for blend time $t_b$:
   $$t_b = T - \frac{D}{v} = 3.0 - \frac{3.14159265}{1.5} = 3.0 - 2.094395 = 0.905605\text{ s}$$
3. Check condition $t_b < T/2$:
   $$0.905605\text{ s} < \frac{3.0}{2} = 1.5\text{ s} \implies \text{Valid trapezoid.}$$
4. Calculate required acceleration $a$:
   $$a = \frac{v}{t_b} = \frac{1.5}{0.905605} \approx 1.65635\text{ rad/s}^2$$

**Final Answer:**
- $t_b \approx 0.9056\text{ s}$.
- $a \approx 1.6564\text{ rad/s}^2$.
- Condition $t_b < T/2$ is satisfied ($0.9056\text{ s} < 1.5\text{ s}$).

**Verification:**
$D = a t_b^2 + v(T - 2 t_b) = (1.65635)(0.905605)^2 + 1.5(3.0 - 1.81121) = 1.35841 + 1.78318 = 3.14159\text{ rad} = \pi$. Exact.

---

#### Problem 11.13: Antipodal Quaternion Handling in $\operatorname{Slerp}$
**Statement:**
Two orientations are given by unit quaternions:
$$q_0 = \begin{bmatrix} 1 & 0 & 0 & 0 \end{bmatrix}^T, \quad q_1 = \begin{bmatrix} -0.999 & 0.0447 & 0 & 0 \end{bmatrix}^T$$
1. Compute the dot product $q_0 \cdot q_1$.
2. Explain the physical consequence of interpolating between $q_0$ and $q_1$ without antipodal check.
3. Compute the correct shortest-path interpolated quaternion at $s = 0.5$.

**Given Data:**
- $q_0 = [1, 0, 0, 0]^T$, $q_1 = [-0.999, 0.0447, 0, 0]^T$.

**Step-by-Step Derivation:**
1. Dot product:
   $$q_0 \cdot q_1 = 1(-0.999) + 0 = -0.999 < 0$$
2. Physical consequence:
   Because $q_1 \approx -q_0$, they represent almost the exact same physical orientation (a rotation of only $\approx 5.1^\circ$ about the x-axis, since $\sin(\theta/2) \approx 0.0447 \implies \theta \approx 5.12^\circ$). 
   However, on the 4D hypersphere $S^3$, the geodesic between $q_0$ and $q_1$ traverses an angle of $\arccos(-0.999) \approx 177.4^\circ$. Without negating $q_1$, the robot will execute an unnecessary $354.8^\circ$ full rotation!
3. Antipodal correction:
   Flip sign: $q_1 \leftarrow -q_1 = [0.999, -0.0447, 0, 0]^T$.
   Now $\cos\Omega = 0.999$.
   $\Omega = \arccos(0.999) \approx 0.044726\text{ rad}$.
4. Midpoint quaternion $s = 0.5$:
   Because $\cos\Omega \approx 1$, we can use $\operatorname{Slerp}$ or $\operatorname{Nlerp}$:
   $$q_{\text{mid}} = \frac{q_0 + q_1}{\|q_0 + q_1\|} = \frac{[1.999, -0.0447, 0, 0]^T}{\sqrt{1.999^2 + (-0.0447)^2}} = \frac{[1.999, -0.0447, 0, 0]^T}{\sqrt{3.996001 + 0.001998}} = \frac{[1.999, -0.0447, 0, 0]^T}{1.9995} \approx \begin{bmatrix} 0.99975 \\ -0.02235 \\ 0 \\ 0 \end{bmatrix}$$

**Final Answer:**
- $q_0 \cdot q_1 = -0.999 < 0$.
- Without correction, the robot unwinds through $354.8^\circ$ of unnecessary motion.
- Correct midpoint: $q(0.5) \approx [0.99975, -0.02235, 0, 0]^T$.

**Verification:**
Norm: $0.99975^2 + (-0.02235)^2 = 0.99950 + 0.00050 = 1.0000$. Physical angle: $2 \arcsin(0.02235) \approx 2.56^\circ$, exactly half of $5.12^\circ$.

---

#### Problem 11.14: Quaternion Error Vector Computation for $\operatorname{CLIK}$
**Statement:**
At a given control step, the desired orientation quaternion is $q_d = [0.7071, 0, 0.7071, 0]^T$ ($90^\circ$ rotation about y-axis) and the current orientation quaternion is $q = [1, 0, 0, 0]^T$ (identity).
Compute the relative quaternion error $\Delta q = q^{-1} * q_d$ and the 3D orientation error vector $e_o = 2 \operatorname{sgn}(\Delta\eta) \Delta\epsilon$ to be fed to the Jacobian.

**Given Data:**
- $q = [1, 0, 0, 0]^T$, $q_d = [1/\sqrt{2}, 0, 1/\sqrt{2}, 0]^T$.

**Step-by-Step Derivation:**
1. Conjugate of current quaternion $q$:
   $$q^{-1} = [\eta, -\epsilon]^T = [1, 0, 0, 0]^T$$
2. Quaternion multiplication $\Delta q = q^{-1} * q_d$:
   $$\Delta\eta = \eta \eta_d + \epsilon^T \epsilon_d = 1\left(\frac{1}{\sqrt{2}}\right) + 0 = \frac{1}{\sqrt{2}} \approx 0.7071$$
   $$\Delta\epsilon = \eta \epsilon_d - \eta_d \epsilon - \epsilon \times \epsilon_d = 1 \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix} - 0 - 0 = \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$
3. Orientation error vector:
   Since $\Delta\eta > 0$, $\operatorname{sgn}(\Delta\eta) = +1$:
   $$e_o = 2 \Delta\epsilon = 2 \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ \sqrt{2} \\ 0 \end{bmatrix} \approx \begin{bmatrix} 0 \\ 1.4142 \\ 0 \end{bmatrix}$$

**Final Answer:**
- $\Delta q = [0.7071, 0, 0.7071, 0]^T$.
- $e_o = [0, \sqrt{2}, 0]^T \approx [0, 1.4142, 0]^T\text{ rad}$.

**Verification:**
For small to moderate rotations, $e_o \approx \theta \hat{n}$. Here $\theta = \pi/2 \approx 1.5708\text{ rad}$ and $2\sin(\theta/2) = 2(1/\sqrt{2}) = 1.4142$, which points directly along $\hat{y}$.

---

#### Problem 11.15: CLIK Stability with Full 6-DoF Geometric Jacobian
**Statement:**
A 6-DoF manipulator with nonsingular square Jacobian $J(q) \in \mathbb{R}^{6 \times 6}$ tracks a 6D spatial pose $x_d(t) \in \mathbb{R}^6$ using $\operatorname{CLIK}$:
$$\dot{q} = J^{-1}(q) \left( \dot{x}_d + K_p e \right)$$
where $K_p = \operatorname{diag}(k_{p,pos} I_3, k_{p,ori} I_3)$ with $k_{p,pos} = 10\text{ s}^{-1}$ and $k_{p,ori} = 20\text{ s}^{-1}$.
Prove that the position error $e_p(t)$ and orientation error $e_o(t)$ decouple in their decay rates, and compute the time required for both errors to decay to less than $1\%$ of their initial values.

**Given Data:**
- $K_p = \operatorname{diag}(10, 10, 10, 20, 20, 20)$.
- Decay target: $e(t) < 0.01 e(0)$.

**Step-by-Step Derivation:**
1. Error dynamics:
   $$\dot{e} = \dot{x}_d - J \dot{q} = \dot{x}_d - J J^{-1}(\dot{x}_d + K_p e) = -K_p e$$
2. Since $K_p$ is diagonal:
   $$\dot{e}_p = -10 e_p \implies e_p(t) = e_p(0) e^{-10 t}$$
   $$\dot{e}_o = -20 e_o \implies e_o(t) = e_o(0) e^{-20 t}$$
   The two error components decouple completely.
3. Time required for position error to decay to $1\%$:
   $$e^{-10 t_p} = 0.01 \implies -10 t_p = \ln(0.01) \approx -4.60517 \implies t_p = 0.4605\text{ s}$$
4. Time required for orientation error to decay to $1\%$:
   $$e^{-20 t_o} = 0.01 \implies -20 t_o = -4.60517 \implies t_o = 0.2303\text{ s}$$
5. Time for both to drop below $1\%$:
   $$t_{\text{settle}} = \max(t_p, t_o) = 0.4605\text{ s}$$

**Final Answer:**
- Decoupled dynamics: $\dot{e}_p = -10 e_p$ and $\dot{e}_o = -20 e_o$.
- Settling times: $t_p \approx 0.461\text{ s}$, $t_o \approx 0.230\text{ s}$.
- Total time: $t_{\text{settle}} \approx 0.461\text{ s}$.

**Verification:**
At $t = 0.4605$: $e_p/e_{p,0} = e^{-4.605} = 0.01$. Orientation error has already decayed to $(0.01)^2 = 0.0001$ ($0.01\%$).

---

#### Problem 11.16: Smooth Hyperbolic Barrier Potential Gradient
**Statement:**
A joint limit avoidance potential uses a one-sided buffer activation:
$$h(q) = \frac{1}{(q_{\max} - q)^2} - \frac{1}{\Delta q_{\text{buf}}^2} \quad \text{for } q > q_{\max} - \Delta q_{\text{buf}}$$
and $h(q) = 0$ for $q \le q_{\max} - \Delta q_{\text{buf}}$.
Given $q_{\max} = 3.0\text{ rad}$, $\Delta q_{\text{buf}} = 0.5\text{ rad}$, evaluate the potential and its gradient $\frac{\partial h}{\partial q}$ at $q = 2.4\text{ rad}$, $q = 2.7\text{ rad}$, and $q = 2.9\text{ rad}$.

**Given Data:**
- $q_{\max} = 3.0$, $\Delta q_{\text{buf}} = 0.5$, threshold $q_{\text{thresh}} = 2.5\text{ rad}$.
- $\frac{1}{\Delta q_{\text{buf}}^2} = \frac{1}{0.25} = 4.0$.

**Step-by-Step Derivation:**
1. Gradient formula for $q > 2.5$:
   $$\frac{\partial h}{\partial q} = \frac{d}{dq} \left( (q_{\max} - q)^{-2} - 4.0 \right) = -2 (q_{\max} - q)^{-3} (-1) = \frac{2}{(q_{\max} - q)^3}$$
2. Case 1: $q = 2.4\text{ rad} < 2.5\text{ rad}$:
   - Inside the safe zone: $h(2.4) = 0$, $\frac{\partial h}{\partial q}(2.4) = 0$.
3. Case 2: $q = 2.7\text{ rad} > 2.5\text{ rad}$:
   - $q_{\max} - q = 3.0 - 2.7 = 0.3\text{ rad}$.
   - $h(2.7) = \frac{1}{0.3^2} - 4.0 = \frac{1}{0.09} - 4.0 = 11.111 - 4.0 = 7.111$.
   - Gradient: $\frac{\partial h}{\partial q} = \frac{2}{0.3^3} = \frac{2}{0.027} \approx 74.074\text{ rad}^{-1}$.
4. Case 3: $q = 2.9\text{ rad} > 2.5\text{ rad}$:
   - $q_{\max} - q = 3.0 - 2.9 = 0.1\text{ rad}$.
   - $h(2.9) = \frac{1}{0.1^2} - 4.0 = 100.0 - 4.0 = 96.0$.
   - Gradient: $\frac{\partial h}{\partial q} = \frac{2}{0.1^3} = \frac{2}{0.001} = 2000.0\text{ rad}^{-1}$.

**Final Answer:**
- At $q = 2.4$: $h = 0$, $\nabla h = 0$.
- At $q = 2.7$: $h \approx 7.111$, $\nabla h \approx 74.07\text{ rad}^{-1}$.
- At $q = 2.9$: $h = 96.0$, $\nabla h = 2000.0\text{ rad}^{-1}$.

**Verification:**
As the joint approaches within $0.1\text{ rad}$ of the physical hard stop, the gradient surges by a factor of 27 from $q=2.7$, providing an impenetrable numerical barrier.

---

#### Problem 11.17: $\operatorname{CCD}$ on a 3-Link Manipulator with Angular Clamping
**Statement:**
A 3-link planar arm has link lengths $l_1 = 1, l_2 = 1, l_3 = 1$ starting at $\theta_1 = 0, \theta_2 = 0, \theta_3 = 0$. 
Joint 3 has an angular limit $|\theta_3| \le 45^\circ$. The target is at $p_t = [2.0, 1.0]^T$.
Compute the unconstrained $\operatorname{CCD}$ update for joint 3, apply the joint limit clamp, and determine the resulting position of the end-effector before proceeding to joint 2.

**Given Data:**
- $p_0 = [0, 0]^T, p_1 = [1, 0]^T, p_2 = [2, 0]^T, p_e = [3, 0]^T$.
- $p_t = [2.0, 1.0]^T$. Joint limit: $|\theta_3| \le 45^\circ$.

**Step-by-Step Derivation:**
1. Focus on Joint 3 (pivot at $p_2 = [2, 0]^T$):
   - Vector from $p_2$ to $p_e$:
     $$v_e = [3, 0]^T - [2, 0]^T = [1, 0]^T$$
   - Vector from $p_2$ to $p_t$:
     $$v_t = [2.0, 1.0]^T - [2, 0]^T = [0, 1]^T$$
   - Unconstrained rotation angle:
     $$\Delta\theta_3 = \operatorname{atan2}(1, 0) = 90^\circ$$
2. Apply joint limit constraint:
   $$\theta_{3,\text{new}} = \operatorname{clip}(0^\circ + 90^\circ, -45^\circ, 45^\circ) = 45^\circ$$
3. Update end-effector position $p_e$ with clamped angle $\theta_3 = 45^\circ$:
   $$p_e = p_2 + l_3 \begin{bmatrix} \cos(\theta_1 + \theta_2 + \theta_3) \\ \sin(\theta_1 + \theta_2 + \theta_3) \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix} + 1.0 \begin{bmatrix} \cos(45^\circ) \\ \sin(45^\circ) \end{bmatrix} = \begin{bmatrix} 2 + \frac{\sqrt{2}}{2} \\ \frac{\sqrt{2}}{2} \end{bmatrix} \approx \begin{bmatrix} 2.7071 \\ 0.7071 \end{bmatrix}$$
4. Compute residual distance to target:
   $$\|p_t - p_e\| = \sqrt{(2.0 - 2.7071)^2 + (1.0 - 0.7071)^2} = \sqrt{(-0.7071)^2 + (0.2929)^2} = \sqrt{0.5000 + 0.0858} = \sqrt{0.5858} \approx 0.7654\text{ m}$$

**Final Answer:**
- Unconstrained update: $\Delta\theta_3 = 90^\circ$.
- Clamped angle: $\theta_3 = 45^\circ$.
- Updated end-effector: $p_e \approx [2.7071, 0.7071]^T$.
- Distance to target: $\approx 0.7654\text{ m}$ (decreased from initial $\|[2, 1]^T - [3, 0]^T\| = \sqrt{2} \approx 1.4142\text{ m}$).

**Verification:**
The distance decreased from $1.414\text{ m}$ to $0.765\text{ m}$, confirming monotonic convergence despite joint limit saturation.

---

#### Problem 11.18: Closed-Form Angular Extraction from $\operatorname{FABRIK}$ Joint Points
**Statement:**
After running $\operatorname{FABRIK}$ on a 2-link planar arm with link lengths $l_1 = 1.0, l_2 = 1.0$ anchored at $p_0 = [0, 0]^T$, the converged Cartesian joint points are:
$$p_0 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}, \quad p_1 = \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix}, \quad p_2 = \begin{bmatrix} 0.7071 \\ 1.7071 \end{bmatrix}$$
Extract the corresponding robot joint angles $\theta_1$ and $\theta_2$ in the standard forward kinematics convention.

**Given Data:**
- $p_0 = [0, 0]^T$, $p_1 = [1/\sqrt{2}, 1/\sqrt{2}]^T$, $p_2 = [1/\sqrt{2}, 1 + 1/\sqrt{2}]^T$.

**Step-by-Step Derivation:**
1. Link 1 vector:
   $$v_1 = p_1 - p_0 = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix}$$
   The global angle of link 1 is:
   $$\phi_1 = \operatorname{atan2}\left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right) = 45^\circ = \frac{\pi}{4}\text{ rad}$$
   Since joint 1 is anchored to the base x-axis:
   $$\theta_1 = \phi_1 = 45^\circ$$
2. Link 2 vector:
   $$v_2 = p_2 - p_1 = \begin{bmatrix} 0.7071 - 0.7071 \\ 1.7071 - 0.7071 \end{bmatrix} = \begin{bmatrix} 0 \\ 1.0 \end{bmatrix}$$
   The global angle of link 2 is:
   $$\phi_2 = \operatorname{atan2}(1.0, 0.0) = 90^\circ = \frac{\pi}{2}\text{ rad}$$
3. The relative joint angle $\theta_2$ is the difference between global angles:
   $$\theta_2 = \phi_2 - \phi_1 = 90^\circ - 45^\circ = 45^\circ = \frac{\pi}{4}\text{ rad}$$

**Final Answer:**
- $\theta_1 = 45^\circ$ ($\pi/4\text{ rad}$).
- $\theta_2 = 45^\circ$ ($\pi/4\text{ rad}$).

**Verification:**
Forward kinematics check:
$x = l_1 \cos(\theta_1) + l_2 \cos(\theta_1 + \theta_2) = 1.0 \cos(45^\circ) + 1.0 \cos(90^\circ) = \frac{\sqrt{2}}{2} + 0 \approx 0.7071$.
$y = l_1 \sin(\theta_1) + l_2 \sin(\theta_1 + \theta_2) = 1.0 \sin(45^\circ) + 1.0 \sin(90^\circ) = \frac{\sqrt{2}}{2} + 1.0 \approx 1.7071$. Matches $p_2$ exactly.

---

#### Problem 11.19: Jerk Minimization Comparison Between Cubic and Quintic Splines
**Statement:**
Compare the peak jerk $|\dddot{q}_{\max}|$ for a point-to-point motion with displacement $\Delta q = 1.0\text{ rad}$ and duration $T = 1.0\text{ s}$ between:
1. A cubic polynomial with zero boundary velocities.
2. A quintic polynomial with zero boundary velocities and accelerations.

**Given Data:**
- $\Delta q = 1.0\text{ rad}$, $T = 1.0\text{ s}$.

**Step-by-Step Derivation:**
1. **Cubic Polynomial:**
   $$q(t) = 3\Delta q\left(\frac{t}{T}\right)^2 - 2\Delta q\left(\frac{t}{T}\right)^3$$
   $$\ddot{q}(t) = \frac{6\Delta q}{T^2} - \frac{12\Delta q}{T^3} t$$
   $$\dddot{q}(t) = -\frac{12\Delta q}{T^3} = -\frac{12(1.0)}{1.0^3} = -12.0\text{ rad/s}^3 \quad \text{during } t \in (0, T)$$
   However, at boundaries $t=0^-$ and $t=T^+$, acceleration is zero, whereas at $t=0^+$, $\ddot{q} = 6.0\text{ rad/s}^2$. 
   Thus, at $t=0$, jerk is a Dirac delta impulse:
   $$\dddot{q}(0) = 6.0 \delta(t) \to \infty$$
2. **Quintic Polynomial:**
   $$\dddot{q}(t) = \frac{60\Delta q}{T^3} (1 - 6\tau + 6\tau^2) \quad \text{where } \tau = \frac{t}{T}$$
   Extrema of $\dddot{q}$ occur at boundaries $\tau = 0, 1$ and midpoint $\tau = 0.5$:
   - At $\tau = 0$: $\dddot{q}(0) = \frac{60(1.0)}{1.0^3}(1 - 0 + 0) = 60.0\text{ rad/s}^3$.
   - At $\tau = 0.5$: $\dddot{q}(0.5) = 60(1 - 3 + 1.5) = 60(-0.5) = -30.0\text{ rad/s}^3$.
   - At $\tau = 1$: $\dddot{q}(1) = 60(1 - 6 + 6) = 60.0\text{ rad/s}^3$.
   The acceleration is strictly $C^1$ continuous across the boundary, so jerk is finite everywhere with peak magnitude $|\dddot{q}_{\max}| = 60.0\text{ rad/s}^3$.

**Final Answer:**
- Cubic: Infinite boundary jerk ($\dddot{q} \to \infty$ due to acceleration step discontinuity).
- Quintic: Finite, smooth jerk everywhere with $|\dddot{q}_{\max}| = 60.0\text{ rad/s}^3$.

**Verification:**
The finite peak jerk of the quintic profile completely eliminates motor shock and mechanical gear chatter.

---

#### Problem 11.20: Complete 7-DoF Nullspace Optimization with Joint Limit and Singularity Avoidance
**Statement:**
A redundant 7-DoF manipulator with Jacobian $J \in \mathbb{R}^{6 \times 7}$ tracks a task velocity $\dot{x}_d$. The secondary objective combines joint limit avoidance potential $V_{\text{lim}}$ and Yoshikawa manipulability index $w = \sqrt{\det(J J^T)}$:
$$V_{\text{sec}}(q) = k_1 V_{\text{lim}}(q) - k_2 w(q)$$
Formulate the exact projected joint velocity control law, prove that task execution is invariant to the choice of $k_1$ and $k_2$, and explain how this formulation simultaneously protects the arm against singularities and joint limits.

**Given Data:**
- $J \in \mathbb{R}^{6 \times 7}$, $\operatorname{rank}(J) = 6$.
- $V_{\text{sec}}(q) = k_1 V_{\text{lim}}(q) - k_2 w(q)$ ($k_1 > 0, k_2 > 0$).

**Step-by-Step Derivation:**
1. The combined secondary gradient is:
   $$\nabla_q V_{\text{sec}} = k_1 \nabla_q V_{\text{lim}} - k_2 \nabla_q w$$
   To minimize $V_{\text{lim}}$ (moving away from limits) and maximize $w$ (moving away from singularities), the secondary gradient descent direction is:
   $$v_{\text{sec}} = -\nabla_q V_{\text{sec}} = -k_1 \nabla_q V_{\text{lim}} + k_2 \nabla_q w$$
2. The complete velocity control law is:
   $$\dot{q} = J^+ \left( \dot{x}_d + K_p e \right) + (I - J^+ J) v_{\text{sec}}$$
   $$\dot{q} = J^+ \left( \dot{x}_d + K_p e \right) + (I - J^+ J) \left( -k_1 \nabla_q V_{\text{lim}} + k_2 \nabla_q w \right)$$
3. **Task Space Invariance Proof:**
   Multiply the entire velocity vector by the Jacobian $J$:
   $$J \dot{q} = J J^+ (\dot{x}_d + K_p e) + J(I - J^+ J) v_{\text{sec}}$$
   Since $\operatorname{rank}(J) = 6$, $J J^+ = I_6$.
   Furthermore, $J(I - J^+ J) = J - (J J^+) J = J - I_6 J = J - J = 0$.
   Therefore:
   $$J \dot{q} = I_6 (\dot{x}_d + K_p e) + 0 \cdot v_{\text{sec}} = \dot{x}_d + K_p e$$
   The task space operational velocity is identically independent of $k_1, k_2$, and $v_{\text{sec}}$.
4. **Physical Mechanism:**
   The arm reconfigures its internal 1D nullspace swivel angle:
   - When near a joint limit, $-k_1 \nabla_q V_{\text{lim}}$ dominates, rotating the elbow to pull the endangered joint into its safe range.
   - When near a singular pose, $+k_2 \nabla_q w$ dominates, pushing the arm toward high-dexterity configurations.
   - Both self-motions occur simultaneously with zero motion of the end-effector.

**Final Answer:**
- Control law: $\dot{q} = J^+ (\dot{x}_d + K_p e) + (I - J^+ J)(-k_1 \nabla V_{\text{lim}} + k_2 \nabla w)$.
- Invariance: $J \dot{q} = \dot{x}_d + K_p e$ identically, because $J(I - J^+ J) \equiv 0$.
- Protects against limits and singularities entirely within the internal self-motion nullspace manifold.

**Verification:**
Nullspace idempotency and orthogonality: $(I - J^+ J)^2 = I - J^+ J$ and $J(I - J^+ J) = 0$. The proof is algebraically exact.
