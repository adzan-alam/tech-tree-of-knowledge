# Chapter 10: Multi-Sensor Fusion Architectures: IMU, GPS, and Visual Odometry

## 10.1 Introduction: The Sensor Heterogeneity Challenge

Autonomous physical robots—from quadrupedal humanoids navigating unstructured rubble to aerial drones mapping GPS-denied tunnels—cannot rely on any single sensing modality. Each physical sensor has fundamental physical failure modes:
- **Inertial Measurement Units (IMU):** Provide instantaneous high-bandwidth acceleration and angular velocity at $500\text{--}2000\text{ Hz}$, but suffer from unconstrained quadratic position drift and cubic gyro-bias drift.
- **Global Positioning System (GPS / GNSS):** Provides bounded global position fixes at $1\text{--}10\text{ Hz}$, but is vulnerable to satellite occlusions, multipath reflections, and complete signal loss in indoor or urban canyons.
- **Visual Odometry (VO) / Visual-Inertial Navigation (VINS):** Tracks hundreds of optical feature points at $30\text{--}60\text{ Hz}$, but fails in textureless environments, low light, or under high-velocity motion blur.
- **Wheel Encoders:** Provide precise relative velocity at high frequency, but slip on ice, sand, or wet surfaces.

The holy grail of robotic state estimation is **multi-sensor fusion**: mathematically fusing complementary sensor streams into a unified, dynamically consistent, high-rate belief state.

In this chapter, we master modern multi-sensor fusion architectures. We contrast loosely-coupled and tightly-coupled paradigms, formalize high-rate IMU strapdown mechanization on the 3D rotation group $SO(3)$, and derive the industry-standard **Error-State Kalman Filter (ESKF)** across 20 rigorous mathematical problems.

---

## 10.2 Fusion Topologies: Loosely vs Tightly Coupled

```
LOOSELY-COUPLED ARCHITECTURE:
+------------+       +-------------------+       +-----------------------+
|  Camera /  | ----> | Standalone Vision | ----> | Trajectory Pose (x,q) | ----\
|  Features  |       | Engine (ORB/PTAM) |       +-----------------------+      \
+------------+       +-------------------+                                       \     +------------------+
                                                                                  ===> | Central Fusion   |
+------------+       +-------------------+       +-----------------------+       /     | Kalman Filter    |
| GPS Signal | ----> | Standalone GNSS   | ----> | Global Position (lat) | -----/      +------------------+
| Receivers  |       | Position Engine   |       +-----------------------+             /
+------------+       +-------------------+                                            /
                                                                                     /
+------------+                                                                      /
|    IMU     | --------------------------------------------------------------------/
+------------+

TIGHTLY-COUPLED ARCHITECTURE:
+------------+       +-----------------------------------------------------------+
|  Camera    | ----> | Raw Feature Pixel Coordinates (u, v)                      | ----\
+------------+       +-----------------------------------------------------------+      \
                                                                                         \     +------------------+
+------------+       +-----------------------------------------------------------+        ===> | Unified Error-   |
| GPS Engine | ----> | Raw Pseudorange & Carrier Phase (\rho_i, \phi_i)          | ------/     | State Kalman     |
+------------+       +-----------------------------------------------------------+             | Filter (ESKF)    |
                                                                                               +------------------+
+------------+       +-----------------------------------------------------------+             /
|    IMU     | ----> | High-Rate Specific Force & Angular Velocity (a_b, \omega_b)| -----------/
+------------+       +-----------------------------------------------------------+
```

### 10.2.1 Loosely-Coupled Fusion
In a loosely-coupled system, independent sub-systems process raw sensor data into intermediate pose or velocity estimates before presenting them to a master Kalman filter.
- *Advantage:* Highly modular; sub-systems can be swapped out easily.
- *Fatal Flaw:* When GPS tracks fewer than 4 satellites, or when a camera tracks fewer than 5 features, the independent sub-systems fail completely and output nothing. The master filter receives zero information, even though 3 visible satellites or 4 visual tracks contain immense spatial constraints.

### 10.2.2 Tightly-Coupled Fusion
In a tightly-coupled architecture, raw measurements (raw GPS pseudoranges $\rho_i$, raw pixel coordinates $(u, v)$) are fed directly into the state estimator.
- *Advantage:* Information is retained even under severe sensor degradation (e.g. tracking a single satellite or 2 visual features updates the filter).
- *Trade-off:* Higher computational complexity and tighter mathematical modeling requirements.

---

## 10.3 High-Rate IMU Strapdown Mechanization

An IMU rigidly mounted to the robot chassis measures body-frame specific force $a_b \in \mathbb{R}^3$ and body-frame angular rate $\omega_b \in \mathbb{R}^3$:
$$a_b(t) = R_n^b(t) (a_n(t) - g^n) + b_a(t) + \eta_a(t)$$
$$\omega_b(t) = \omega_{nb}^b(t) + b_g(t) + \eta_g(t)$$

where:
- $R_n^b \in SO(3)$ is the rotation matrix from world navigation frame to robot body frame.
- $g^n = [0, 0, -9.80665]^T\text{ m/s}^2$ is the gravity vector in navigation coordinates.
- $b_a, b_g \in \mathbb{R}^3$ are sensor biases, modeled as stochastic random walks:
  $$\dot{b}_a(t) = \eta_{ba}(t), \quad \dot{b}_g(t) = \eta_{bg}(t)$$
- $\eta_a, \eta_g, \eta_{ba}, \eta_{bg}$ are zero-mean Gaussian white noise processes.

### 10.3.1 Continuous Kinematics in the Navigation Frame
The continuous equations of motion in the navigation frame are:
$$\dot{p}^n(t) = v^n(t)$$
$$\dot{v}^n(t) = R_b^n(t) (a_b(t) - b_a(t)) + g^n$$
$$\dot{R}_b^n(t) = R_b^n(t) [\omega_b(t) - b_g(t)]_\times$$

where $[\omega]_\times$ denotes the $3 \times 3$ skew-symmetric cross-product matrix:
$$[\omega]_\times = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$

Using unit quaternions $q = [q_w, q_x, q_y, q_z]^T \in \mathbb{S}^3$:
$$\dot{q}_b^n(t) = \frac{1}{2} q_b^n(t) \otimes \begin{bmatrix} 0 \\ \omega_b(t) - b_g(t) \end{bmatrix}$$

---

## 10.4 The Error-State Kalman Filter (ESKF)

Standard EKF formulation fails when directly applied to 3D attitude estimation because the 4-parameter unit quaternion $q \in \mathbb{S}^3$ is subject to a strict norm constraint $\|q\| = 1$. The $4 \times 4$ covariance matrix of $q$ is permanently singular (rank 3), causing numerical collapse.

The **Error-State Kalman Filter (ESKF)** solves this problem with mathematical perfection by decomposing the physical state into three entities:
1. **True State $x_t$:** The physical reality.
2. **Nominal State $x_{\text{nom}}$:** High-rate, non-linear integration of IMU measurements without considering noise.
3. **Error State $\delta x$:** Low-rate, small, linear stochastic perturbation.

$$x_t = x_{\text{nom}} \oplus \delta x$$

```
+---------------------------------------------------------------------------------------------------+
|                           THE ESKF THREE-TIER ARCHITECTURE                                        |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    HIGH-RATE IMU (500-1000 Hz)                                                                    |
|              |                                                                                    |
|              v                                                                                    |
|    +------------------------------------------------------------------------------------------+   |
|    | NOMINAL STATE INTEGRATOR (Strapdown Mechanization on SO(3) Manifold)                     |   |
|    |    p_{k} = p_{k-1} + v_{k-1}\Delta t + \frac{1}{2}(R(q)(a_b - b_a) + g)\Delta t^2         |   |
|    |    v_{k} = v_{k-1} + (R(q)(a_b - b_a) + g)\Delta t                                       |   |
|    |    q_{k} = q_{k-1} \otimes \exp\left(\frac{1}{2}(\omega_b - b_g)\Delta t\right)          |   |
|    +------------------------------------------------------------------------------------------+   |
|              |                                                ^                                   |
|              |                                                | Reset / Error Injection           |
|              v                                                | q <- q \otimes exp(\delta\theta/2)|
|    +------------------------------------------------------+   | \delta x <- 0                     |
|    | ERROR-STATE KALMAN FILTER (\delta x \in \mathbb{R}^{15}) |   |                                   |
|    |    \delta x = [\delta p, \delta v, \delta \theta, \delta b_a, \delta b_g]^T              |   |
|    |    Operates strictly in linear Euclidean tangent space!  |                                   |
|    +------------------------------------------------------+   |                                   |
|              ^                                                |                                   |
|              | Low-rate corrections (GPS, Vision, 1-30 Hz)    |                                   |
|              +------------------------------------------------+                                   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 10.4.1 The 15-Dimensional Error State Vector
The error state vector $\delta x \in \mathbb{R}^{15}$ is defined strictly in the Euclidean tangent space:
$$\delta x = \begin{bmatrix} \delta p \\ \delta v \\ \delta \theta \\ \delta b_a \\ \delta b_g \end{bmatrix} \in \mathbb{R}^{15}$$
where:
- $\delta p = p_t - p_{\text{nom}} \in \mathbb{R}^3$ (position error).
- $\delta v = v_t - v_{\text{nom}} \in \mathbb{R}^3$ (velocity error).
- $\delta \theta \in \mathbb{R}^3$ is the **minimal 3-parameter rotation error vector** in the Lie algebra $\mathfrak{so}(3)$:
  $$R_t = R_{\text{nom}} \operatorname{Exp}(\delta \theta) \approx R_{\text{nom}} (I + [\delta \theta]_\times)$$
  $$q_t = q_{\text{nom}} \otimes \begin{bmatrix} 1 \\ \frac{1}{2} \delta \theta \end{bmatrix}$$
- $\delta b_a = b_{a, t} - b_{a, \text{nom}} \in \mathbb{R}^3$ (accelerometer bias error).
- $\delta b_g = b_{g, t} - b_{g, \text{nom}} \in \mathbb{R}^3$ (gyroscope bias error).

### 10.4.2 Linearized Error-State Differential Equations
Differentiating each error component yields strictly linear continuous dynamics:
$$\delta \dot{p} = \delta v$$
$$\delta \dot{v} = -R_{\text{nom}} [a_b - b_a]_\times \delta \theta - R_{\text{nom}} \delta b_a - R_{\text{nom}} \eta_a$$
$$\delta \dot{\theta} = -[\omega_b - b_g]_\times \delta \theta - \delta b_g - \eta_g$$
$$\delta \dot{b}_a = \eta_{ba}$$
$$\delta \dot{b}_g = \eta_{bg}$$

In matrix form:
$$\delta \dot{x}(t) = F_c(t) \delta x(t) + G_c(t) w(t)$$

where:
$$F_c = \begin{bmatrix} 0_{3\times 3} & I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \\ 0_{3\times 3} & 0_{3\times 3} & -R_{\text{nom}} [a_b - b_a]_\times & -R_{\text{nom}} & 0_{3\times 3} \\ 0_{3\times 3} & 0_{3\times 3} & -[\omega_b - b_g]_\times & 0_{3\times 3} & -I_3 \\ 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \\ 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix}$$

Notice that because $\delta \theta$ is always near zero (reset after every update), the linearization point is permanently exact, virtually eliminating Taylor truncation errors.

---

## 10.5 The Reset Operation

When a low-rate sensor (e.g. GPS or Camera) arrives, the ESKF computes the optimal error state estimate:
$$\hat{\delta x} = [\hat{\delta p}, \hat{\delta v}, \hat{\delta \theta}, \hat{\delta b}_a, \hat{\delta b}_g]^T$$

This error must immediately be **injected into the nominal state**:
$$p_{\text{nom}} \leftarrow p_{\text{nom}} + \hat{\delta p}$$
$$v_{\text{nom}} \leftarrow v_{\text{nom}} + \hat{\delta v}$$
$$q_{\text{nom}} \leftarrow q_{\text{nom}} \otimes \begin{bmatrix} \cos(\|\hat{\delta \theta}\|/2) \\ \frac{\hat{\delta \theta}}{\|\hat{\delta \theta}\|} \sin(\|\hat{\delta \theta}\|/2) \end{bmatrix}$$
$$b_{a, \text{nom}} \leftarrow b_{a, \text{nom}} + \hat{\delta b}_a$$
$$b_{g, \text{nom}} \leftarrow b_{g, \text{nom}} + \hat{\delta b}_g$$

### Resetting the Error State to Zero:
After injection, the error state is reset:
$$\hat{\delta x} \leftarrow 0_{15 \times 1}$$

### Covariance Reset Projection:
Because orientation injection updates the reference frame, the covariance matrix must be projected:
$$P \leftarrow G P G^T$$
where $G = \operatorname{diag}\left(I_3, I_3, I_3 - \frac{1}{2}[\hat{\delta \theta}]_\times, I_3, I_3\right)$. For small corrections, $G \approx I_{15}$.

---

## 10.6 Mathematical Problem Set

### Problem 10.1 (Worked Example): Strapdown Quaternion Integration Step
**Problem Statement:** An autonomous quadrotor has current orientation quaternion $q_0 = [1, 0, 0, 0]^T$ (identity rotation). Gyroscope rate measurement is $\omega_b = [0.02, -0.01, 0.05]^T\text{ rad/s}$ with estimated gyro bias $b_g = [0.00, 0.00, 0.01]^T\text{ rad/s}$.
For sampling interval $\Delta t = 0.01\text{ s}$ ($100\text{ Hz}$):
1. Compute the unbiased angular velocity $\tilde{\omega}_b$.
2. Compute the delta-angle rotation vector $\Delta \theta$.
3. Compute the updated unit quaternion $q_1$ via exact zeroth-order quaternion integration.

**Step-by-Step Derivation:**
1. Unbiased angular rate:
   $$\tilde{\omega}_b = \omega_b - b_g = \begin{bmatrix} 0.02 - 0.00 \\ -0.01 - 0.00 \\ 0.05 - 0.01 \end{bmatrix} = \begin{bmatrix} 0.02 \\ -0.01 \\ 0.04 \end{bmatrix}\text{ rad/s}$$
2. Delta-angle vector:
   $$\Delta \theta = \tilde{\omega}_b \Delta t = \begin{bmatrix} 0.02 \\ -0.01 \\ 0.04 \end{bmatrix} (0.01) = \begin{bmatrix} 0.0002 \\ -0.0001 \\ 0.0004 \end{bmatrix}\text{ rad}$$
   Magnitude of rotation:
   $$\|\Delta \theta\| = \sqrt{(2\times 10^{-4})^2 + (-1\times 10^{-4})^2 + (4\times 10^{-4})^2} = 10^{-4} \sqrt{4 + 1 + 16} = 10^{-4} \sqrt{21} \approx 4.582576 \times 10^{-4}\text{ rad}$$
3. Delta quaternion $\Delta q = \exp(\Delta \theta / 2)$:
   $$\frac{\|\Delta \theta\|}{2} \approx 2.291288 \times 10^{-4}\text{ rad}$$
   $$\cos\left(\frac{\|\Delta \theta\|}{2}\right) \approx 1 - \frac{(2.2913 \times 10^{-4})^2}{2} \approx 1.000000000 - 2.62 \times 10^{-8} \approx 0.999999974$$
   $$\sin\left(\frac{\|\Delta \theta\|}{2}\right) \approx 2.291288 \times 10^{-4}$$
   $$\Delta q = \begin{bmatrix} \cos(\|\Delta \theta\|/2) \\ \frac{\Delta \theta}{\|\Delta \theta\|} \sin(\|\Delta \theta\|/2) \end{bmatrix} = \begin{bmatrix} 0.999999974 \\ 1.000000 \times 10^{-4} \\ -0.500000 \times 10^{-4} \\ 2.000000 \times 10^{-4} \end{bmatrix}$$
4. Quaternion multiplication $q_1 = q_0 \otimes \Delta q$:
   Since $q_0 = [1, 0, 0, 0]^T$, $q_1 = \Delta q$:
   $$q_1 = \begin{bmatrix} 0.999999974 \\ 0.000100000 \\ -0.000050000 \\ 0.000200000 \end{bmatrix}$$
   Norm check:
   $$\|q_1\|^2 = (0.999999974)^2 + (10^{-4})^2 + (0.5\times 10^{-4})^2 + (2\times 10^{-4})^2 \approx 1 - 5.25\times 10^{-8} + 5.25\times 10^{-8} = 1.000000000$$

**Final Result:**
$$q_1 = [0.99999997, \, 0.00010000, \, -0.00005000, \, 0.00020000]^T$$

---

### Problem 10.2 (Worked Example): Gravity Compensation in Strapdown Acceleration
**Problem Statement:** An aerial drone hovers statically in the air with pitch angle $\theta = 30^\circ$, roll $\phi = 0^\circ$, yaw $\psi = 0^\circ$. True acceleration in navigation frame is $a^n = 0$.
1. Compute the rotation matrix $R_n^b$.
2. What specific force $a_b$ does the body-frame accelerometer measure in steady hover?
3. Show how the strapdown mechanization computes $\dot{v}^n = R_b^n a_b + g^n = 0$.

**Step-by-Step Derivation:**
1. Pitch rotation matrix $R_b^n$ (pitch by $\theta = 30^\circ$ around $y$-axis):
   $$R_b^n = \begin{bmatrix} \cos 30^\circ & 0 & \sin 30^\circ \\ 0 & 1 & 0 \\ -\sin 30^\circ & 0 & \cos 30^\circ \end{bmatrix} = \begin{bmatrix} \frac{\sqrt{3}}{2} & 0 & \frac{1}{2} \\ 0 & 1 & 0 \\ -\frac{1}{2} & 0 & \frac{\sqrt{3}}{2} \end{bmatrix} \approx \begin{bmatrix} 0.866025 & 0 & 0.500000 \\ 0 & 1 & 0 \\ -0.500000 & 0 & 0.866025 \end{bmatrix}$$
   The transpose is $R_n^b = (R_b^n)^T$:
   $$R_n^b = \begin{bmatrix} 0.866025 & 0 & -0.500000 \\ 0 & 1 & 0 \\ 0.500000 & 0 & 0.866025 \end{bmatrix}$$
2. Accelerometer specific force:
   Accelerometers measure specific force $f = a - g$.
   In navigation frame, $a^n = 0$ and $g^n = [0, 0, -9.80665]^T$.
   $$f^n = a^n - g^n = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ -9.80665 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ +9.80665 \end{bmatrix}\text{ m/s}^2$$
   Transforming to body frame:
   $$a_b = R_n^b f^n = \begin{bmatrix} 0.866025 & 0 & -0.500000 \\ 0 & 1 & 0 \\ 0.500000 & 0 & 0.866025 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 9.80665 \end{bmatrix} = \begin{bmatrix} -0.500000 \times 9.80665 \\ 0 \\ 0.866025 \times 9.80665 \end{bmatrix} = \begin{bmatrix} -4.903325 \\ 0.000000 \\ 8.492795 \end{bmatrix}\text{ m/s}^2$$
3. Strapdown navigation acceleration calculation:
   $$\dot{v}^n = R_b^n a_b + g^n$$
   $$R_b^n a_b = \begin{bmatrix} 0.866025 & 0 & 0.500000 \\ 0 & 1 & 0 \\ -0.500000 & 0 & 0.866025 \end{bmatrix} \begin{bmatrix} -4.903325 \\ 0 \\ 8.492795 \end{bmatrix}$$
   - $x$-component: $0.866025(-4.903325) + 0.500000(8.492795) = -4.246397 + 4.246397 = 0.000000$.
   - $y$-component: $0$.
   - $z$-component: $-0.500000(-4.903325) + 0.866025(8.492795) = +2.451663 + 7.354988 = +9.806651$.
   Adding gravity $g^n = [0, 0, -9.80665]^T$:
   $$\dot{v}^n = \begin{bmatrix} 0 \\ 0 \\ +9.80665 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ -9.80665 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}\text{ m/s}^2$$

**Final Result:**
$$\dot{v}^n = [0, 0, 0]^T\text{ m/s}^2\text{ (Exact Dynamic Equilibrium)}$$

---

### Problem 10.3 (Worked Example): GPS Position Measurement Jacobian in ESKF
**Problem Statement:** A GPS receiver provides 3D Cartesian position in navigation frame: $z_{\text{GPS}} = p_t + v_{\text{GPS}}$ with noise covariance $R_{\text{GPS}} = \operatorname{diag}(4.0, 4.0, 9.0)\text{ m}^2$.
1. Express the GPS measurement residual $y$ in terms of nominal position $p_{\text{nom}}$ and error state $\delta x \in \mathbb{R}^{15}$.
2. Write the $3 \times 15$ measurement sensitivity matrix $H_{\text{GPS}}$.

**Step-by-Step Derivation:**
1. True position is related to error state by:
   $$p_t = p_{\text{nom}} + \delta p$$
2. Measurement model:
   $$z_{\text{GPS}} = p_t + v_{\text{GPS}} = p_{\text{nom}} + \delta p + v_{\text{GPS}}$$
3. Measurement residual:
   $$y = z_{\text{GPS}} - p_{\text{nom}} = \delta p + v_{\text{GPS}}$$
4. Expressing in terms of the full 15D error state $\delta x = [\delta p, \delta v, \delta \theta, \delta b_a, \delta b_g]^T$:
   $$y = \begin{bmatrix} I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix} \begin{bmatrix} \delta p \\ \delta v \\ \delta \theta \\ \delta b_a \\ \delta b_g \end{bmatrix} + v_{\text{GPS}}$$
5. Measurement matrix:
   $$H_{\text{GPS}} = \begin{bmatrix} I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix} \in \mathbb{R}^{3 \times 15}$$

**Final Result:**
$$H_{\text{GPS}} = \begin{bmatrix} 1 & 0 & 0 & 0 & \cdots & 0 \\ 0 & 1 & 0 & 0 & \cdots & 0 \\ 0 & 0 & 1 & 0 & \cdots & 0 \end{bmatrix} = \begin{bmatrix} I_3 & 0_{3\times 12} \end{bmatrix}$$
*Remark:* Notice that $H_{\text{GPS}}$ is completely constant and linear—no Jacobians, no trigonometric derivatives!

---

### Problem 10.4 (Worked Example): Visual Feature Pixel Coordinate Jacobian in ESKF
**Problem Statement:** A calibrated camera mounted to the robot at pose $(p_{\text{nom}}, R_{\text{nom}})$ observes a known 3D world landmark at $p_w \in \mathbb{R}^3$.
In camera coordinates, the landmark is $p_c = R_c^w (p_w - p_w^c)$.
Derive the analytical sensitivity of camera point $p_c$ with respect to position error $\delta p$ and orientation error $\delta \theta$.

**Step-by-Step Derivation:**
1. Let camera frame coincide with body frame for simplicity ($R_c^w = R_n^b = (R_b^n)^T$).
   $$p_c = (R_t)^T (p_w - p_t)$$
2. Substitute error perturbations:
   $$p_t = p_{\text{nom}} + \delta p$$
   $$R_t \approx R_{\text{nom}} (I + [\delta \theta]_\times) \implies R_t^T \approx (I - [\delta \theta]_\times) R_{\text{nom}}^T$$
3. Expand $p_c$:
   $$p_c \approx (I - [\delta \theta]_\times) R_{\text{nom}}^T (p_w - p_{\text{nom}} - \delta p)$$
   Let $p_{c, \text{nom}} = R_{\text{nom}}^T (p_w - p_{\text{nom}})$.
   $$p_c \approx p_{c, \text{nom}} - R_{\text{nom}}^T \delta p - [\delta \theta]_\times p_{c, \text{nom}}$$
4. Using the skew-symmetric identity $[a]_\times b = -[b]_\times a$:
   $$-[\delta \theta]_\times p_{c, \text{nom}} = +[p_{c, \text{nom}}]_\times \delta \theta$$
5. Thus:
   $$\delta p_c = p_c - p_{c, \text{nom}} = -R_{\text{nom}}^T \delta p + [p_{c, \text{nom}}]_\times \delta \theta$$
6. Sensitivity matrices:
   $$\frac{\partial p_c}{\partial \delta p} = -R_{\text{nom}}^T \in \mathbb{R}^{3 \times 3}$$
   $$\frac{\partial p_c}{\partial \delta \theta} = [p_{c, \text{nom}}]_\times \in \mathbb{R}^{3 \times 3}$$

**Final Result:**
$$\frac{\partial p_c}{\partial \delta x} = \begin{bmatrix} -R_{\text{nom}}^T & 0_{3\times 3} & [p_{c, \text{nom}}]_\times & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix}$$

---

### Problem 10.5 (Worked Example): Lie Group Quaternion Error Injection Step
**Problem Statement:** The ESKF measurement update produces an estimated orientation correction $\hat{\delta \theta} = [0.02, -0.04, 0.01]^T\text{ rad}$. The current nominal quaternion is $q_{\text{nom}} = [0.707107, 0, 0.707107, 0]^T$ ($90^\circ$ pitch).
Execute the exact Lie group error injection and normalize the resulting quaternion.

**Step-by-Step Derivation:**
1. Compute error quaternion $\delta q = \exp(\hat{\delta \theta} / 2)$:
   $$\|\hat{\delta \theta}\| = \sqrt{0.02^2 + (-0.04)^2 + 0.01^2} = \sqrt{0.0004 + 0.0016 + 0.0001} = \sqrt{0.0021} \approx 0.04582576\text{ rad}$$
   $$\frac{\|\hat{\delta \theta}\|}{2} \approx 0.02291288\text{ rad}$$
   $$\cos(0.022913) \approx 0.999737$$
   $$\sin(0.022913) \approx 0.022911$$
   $$\delta q = \begin{bmatrix} 0.999737 \\ \frac{0.02}{0.045826} (0.022911) \\ \frac{-0.04}{0.045826} (0.022911) \\ \frac{0.01}{0.045826} (0.022911) \end{bmatrix} = \begin{bmatrix} 0.999737 \\ 0.010000 \\ -0.020000 \\ 0.005000 \end{bmatrix}$$
2. Quaternion multiplication $q_{\text{new}} = q_{\text{nom}} \otimes \delta q$:
   Given $q_{\text{nom}} = [w_1, x_1, y_1, z_1]^T = [0.707107, 0, 0.707107, 0]^T$.
   $$\delta q = [w_2, x_2, y_2, z_2]^T = [0.999737, 0.010, -0.020, 0.005]^T$$
   Formulas:
   $$w_{\text{new}} = w_1 w_2 - x_1 x_2 - y_1 y_2 - z_1 z_2 = (0.707107)(0.999737) - (0.707107)(-0.020) = 0.706921 + 0.014142 = 0.721063$$
   $$x_{\text{new}} = w_1 x_2 + x_1 w_2 + y_1 z_2 - z_1 y_2 = (0.707107)(0.010) + (0.707107)(0.005) = 0.007071 + 0.003536 = 0.010607$$
   $$y_{\text{new}} = w_1 y_2 - x_1 z_2 + y_1 w_2 + z_1 x_2 = (0.707107)(-0.020) + (0.707107)(0.999737) = -0.014142 + 0.706921 = 0.692779$$
   $$z_{\text{new}} = w_1 z_2 + x_1 y_2 - y_1 x_2 + z_1 w_2 = (0.707107)(0.005) - (0.707107)(0.010) = 0.003536 - 0.007071 = -0.003535$$
3. Normalization:
   $$\|q_{\text{new}}\| = \sqrt{0.721063^2 + 0.010607^2 + 0.692779^2 + (-0.003535)^2} = \sqrt{0.519932 + 0.000112 + 0.479943 + 0.000012} = \sqrt{1.000000} = 1.000000$$

**Final Result:**
$$q_{\text{new}} = [0.721063, \, 0.010607, \, 0.692779, \, -0.003535]^T$$

---

### Problem 10.6 (Worked Example): Gyroscope Bias Unobservability in Pure Acceleration
**Problem Statement:** An aerial robot hovers without rotating ($\omega = 0, R = I$). It receives GPS position updates $z = p + v$. Prove via the observability matrix that the gyroscope bias $b_g$ is mathematically unobservable from position measurements alone during unaccelerated hover.

**Step-by-Step Derivation:**
1. Error dynamics matrix during hover ($R = I, a = [0, 0, g]^T, \omega = 0$):
   $$\delta \dot{p} = \delta v$$
   $$\delta \dot{v} = -[g]_\times \delta \theta - \delta b_a$$
   $$\delta \dot{\theta} = -\delta b_g$$
   $$\delta \dot{b}_a = 0, \quad \delta \dot{b}_g = 0$$
2. Let $g = [0, 0, -g_0]^T$. Then:
   $$-[g]_\times = \begin{bmatrix} 0 & -g_0 & 0 \\ g_0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
3. Differentiating position output:
   $$z = \delta p$$
   $$\dot{z} = \delta v$$
   $$\ddot{z} = \delta \dot{v} = -[g]_\times \delta \theta - \delta b_a$$
   $$z^{(3)} = -[g]_\times \delta \dot{\theta} - \delta \dot{b}_a = -[g]_\times (-\delta b_g) = [g]_\times \delta b_g$$
4. Look at the $z$-axis (yaw):
   $$[g]_\times \delta b_g = \begin{bmatrix} 0 & g_0 & 0 \\ -g_0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} \delta b_{gx} \\ \delta b_{gy} \\ \delta b_{gz} \end{bmatrix} = \begin{bmatrix} g_0 \delta b_{gy} \\ -g_0 \delta b_{gx} \\ 0 \end{bmatrix}$$
   Notice that $\delta b_{gz}$ (the vertical yaw gyro bias) is multiplied by 0!
   It does not appear in $z, \dot{z}, \ddot{z}, z^{(3)}$, or any higher derivative.
5. Therefore, the yaw gyro bias $\delta b_{gz}$ is strictly in the nullspace of the observability matrix.
   *Physical Meaning:* Tilting causes gravity leakage into the horizontal accelerometers, enabling the filter to observe roll and pitch gyro biases ($b_{gx}, b_{gy}$). But horizontal rotation around the gravity vector causes zero gravitational change, making yaw bias completely unobservable without a magnetometer or visual feature tracker.

**Final Result:**
$$\operatorname{ker}(\mathcal{O}) \supset \operatorname{span}\left([0, \dots, \delta b_{gz}]^T\right) \implies \mathbf{Yaw\ gyro\ bias\ is\ mathematically\ unobservable}$$

---

### Problem 10.7 (Worked Example): Zero-Velocity Update (ZUPT) Constraint
**Problem Statement:** A humanoid robot or walking biped has its foot planted firmly on the ground. A Zero-Velocity detector triggers a pseudo-measurement $z_{\text{ZUPT}} = [0, 0, 0]^T\text{ m/s}$ with noise covariance $R_{\text{ZUPT}} = 10^{-4} I_3\text{ (m/s)}^2$.
1. Formulate the $3 \times 15$ measurement matrix $H_{\text{ZUPT}}$.
2. If velocity error covariance before ZUPT is $P_{vv} = 0.04 I_3$, compute the velocity Kalman gain and updated velocity variance.

**Step-by-Step Derivation:**
1. Measurement sensitivity:
   $z_{\text{ZUPT}}$ observes true velocity $v_t = v_{\text{nom}} + \delta v = 0$.
   Residual: $y = 0 - v_{\text{nom}} = -\delta v + v$.
   $$H_{\text{ZUPT}} = \begin{bmatrix} 0_{3\times 3} & I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix} \in \mathbb{R}^{3 \times 15}$$
2. Scalar decoupled update along each axis:
   Prior variance $P^- = 0.04$, measurement noise $R = 0.0001$.
   $$S = P^- + R = 0.04 + 0.0001 = 0.0401$$
   $$K = \frac{P^-}{S} = \frac{0.04}{0.0401} \approx 0.9975$$
   Updated variance:
   $$P^+ = (1 - K) P^- = (1 - 0.9975)(0.04) \approx (0.0025)(0.04) = 0.00009975 \approx 10^{-4}\text{ m}^2/\text{s}^2$$
3. Result:
   Velocity uncertainty contracts by a factor of 400 ($\sigma_v$ drops from $20\text{ cm/s}$ to $1\text{ cm/s}$), resetting accumulated foot drift.

**Final Result:**
$$K \approx 0.9975, \quad P_{vv}^+ \approx 1.0 \times 10^{-4} I_3\text{ m}^2/\text{s}^2$$

---

### Problem 10.8 (Worked Example): Accelerometer Bias Drift over 60 Seconds
**Problem Statement:** An uncalibrated drone accelerometer has constant unestimated bias $b_a = 0.05\text{ m/s}^2$ along the forward axis. If the robot travels for $t = 60\text{ s}$ without external position or velocity measurements, compute the resulting velocity error $\Delta v(60)$ and position drift $\Delta p(60)$.

**Step-by-Step Derivation:**
1. Error kinematics:
   $$\dot{v} = b_a \implies \Delta v(t) = b_a t$$
   $$\dot{p} = v \implies \Delta p(t) = \frac{1}{2} b_a t^2$$
2. Evaluate at $t = 60\text{ s}$:
   $$\Delta v(60) = 0.05 \times 60 = 3.0\text{ m/s}$$
   $$\Delta p(60) = \frac{1}{2} (0.05) (60)^2 = 0.025 \times 3600 = 90.0\text{ m}$$

**Final Result:**
$$\Delta v(60) = 3.0\text{ m/s}, \quad \Delta p(60) = 90.0\text{ m}$$
A tiny $5\text{ cm/s}^2$ bias causes nearly a 100-meter crash within 1 minute.

---

### Problem 10.9 (Worked Example): Covariance Reset Matrix Projection
**Problem Statement:** Prove that when an attitude error correction $\hat{\delta \theta}$ is injected into the nominal quaternion, the orientation error state $\delta \theta^+ = \delta \theta^- - \hat{\delta \theta}$ satisfies the first-order covariance projection $P_{\theta\theta}^+ \approx (I - \frac{1}{2}[\hat{\delta \theta}]_\times) P_{\theta\theta} (I - \frac{1}{2}[\hat{\delta \theta}]_\times)^T$.

**Step-by-Step Derivation:**
1. By the Baker-Campbell-Hausdorff (BCH) formula on $SO(3)$:
   $$\operatorname{Exp}(\delta \theta^+) = \operatorname{Exp}(-\hat{\delta \theta}) \operatorname{Exp}(\delta \theta^-) \approx \operatorname{Exp}\left( \delta \theta^- - \hat{\delta \theta} - \frac{1}{2} [\hat{\delta \theta}]_\times \delta \theta^- \right)$$
2. For small perturbations:
   $$\delta \theta^+ \approx \left( I - \frac{1}{2}[\hat{\delta \theta}]_\times \right) (\delta \theta^- - \hat{\delta \theta})$$
3. Taking covariance:
   $$P_{\theta\theta}^+ = \mathbb{E}[\delta \theta^+ (\delta \theta^+)^T] = \left( I - \frac{1}{2}[\hat{\delta \theta}]_\times \right) P_{\theta\theta} \left( I - \frac{1}{2}[\hat{\delta \theta}]_\times \right)^T \quad \blacksquare$$

---

### Problem 10.10 (Worked Example): High-Rate IMU Discretization via Mid-Point Method
**Problem Statement:** Write the exact numerical update equations for the nominal state $(p, v, q)$ using mid-point (Heun’s) integration over IMU interval $\Delta t$.

**Step-by-Step Derivation:**
1. Inputs: $(a_{b, k-1}, \omega_{b, k-1})$ and $(a_{b, k}, \omega_{b, k})$.
2. Mid-point angular rate:
   $$\bar{\omega} = \frac{1}{2}(\omega_{b, k-1} + \omega_{b, k}) - b_g$$
   $$\Delta \theta = \bar{\omega} \Delta t$$
   $$q_k = q_{k-1} \otimes \begin{bmatrix} \cos(\|\Delta \theta\|/2) \\ \frac{\Delta \theta}{\|\Delta \theta\|} \sin(\|\Delta \theta\|/2) \end{bmatrix}$$
3. Mid-point acceleration in navigation frame:
   $$a_{n, k-1} = R(q_{k-1}) (a_{b, k-1} - b_a) + g^n$$
   $$a_{n, k} = R(q_k) (a_{b, k} - b_a) + g^n$$
   $$\bar{a}_n = \frac{1}{2}(a_{n, k-1} + a_{n, k})$$
4. Velocity and Position:
   $$v_k = v_{k-1} + \bar{a}_n \Delta t$$
   $$p_k = p_{k-1} + v_{k-1} \Delta t + \frac{1}{2} \bar{a}_n \Delta t^2$$

**Final Result:**
Mid-point integration achieves 2nd-order Runge-Kutta accuracy ($\mathcal{O}(\Delta t^2)$), suppressing truncation drift.

---

### Problem 10.11 (Solved Exercise): Number of Parameters: Quaternions vs Euler Angles
**Problem Statement:** Why does the ESKF use unit quaternions $q \in \mathbb{S}^3$ for nominal state propagation but a 3D rotation vector $\delta \theta \in \mathbb{R}^3$ for error state estimation?

**Step-by-Step Solution:**
1. Nominal state: Euler angles suffer from gimbal lock (singularity at pitch $\pm 90^\circ$). Quaternions provide smooth, singularity-free global parameterization of $SO(3)$.
2. Error state: Quaternions have 4 parameters with a unit-norm constraint ($\|q\| = 1$), producing a singular $4 \times 4$ covariance. The minimal 3D tangent vector $\delta \theta \in \mathfrak{so}(3)$ has no constraints, producing a non-singular $3 \times 3$ covariance. $\blacksquare$

---

### Problem 10.12 (Solved Exercise): Multipath Rejection in GPS Fusion
**Problem Statement:** In an urban canyon, a GPS position measurement jumps by $50\text{ m}$ due to multipath reflection from a skyscraper. If prior position variance is $P = 1.0\text{ m}^2$ and GPS noise is $R = 4.0\text{ m}^2$, compute the NIS test statistic and show that Chi-square gating rejects this fault.

**Step-by-Step Solution:**
1. Residual: $y = 50.0\text{ m}$.
2. Innovation variance: $S = P + R = 1.0 + 4.0 = 5.0\text{ m}^2$.
3. Normalized Innovation Squared:
   $$\epsilon = \frac{y^2}{S} = \frac{2500}{5.0} = 500$$
4. Threshold for 1 DoF at $\alpha = 0.001$: $\chi^2(1)_{0.999} = 10.828$.
5. Since $\epsilon = 500 \gg 10.828$, the measurement is decisively rejected as an outlier.

**Final Answer:**
$$\epsilon = 500 > 10.828 \implies \mathbf{Measurement\ Rejected}$$

---

### Problem 10.13 (Solved Exercise): Accelerometer Gravity Vector Normalization
**Problem Statement:** In static initial alignment, a stationary robot measures specific force $a_b = [0.1, -0.2, 9.8]^T\text{ m/s}^2$. Compute the estimated roll and pitch angles.

**Step-by-Step Solution:**
1. In static conditions, $a_b = -R_n^b g^n = R_n^b [0, 0, g]^T$.
   For roll $\phi$ and pitch $\theta$:
   $$a_{bx} = -g \sin\theta \implies \sin\theta = -\frac{a_{bx}}{g} = -\frac{0.1}{9.80665} \approx -0.0102 \implies \theta \approx -0.58^\circ$$
   $$a_{by} = g \cos\theta \sin\phi \implies \sin\phi \approx \frac{a_{by}}{g} = \frac{-0.2}{9.80665} \approx -0.0204 \implies \phi \approx -1.17^\circ$$

**Final Answer:**
$$\text{Roll } \phi \approx -1.17^\circ, \quad \text{Pitch } \theta \approx -0.58^\circ$$

---

### Problem 10.14 (Solved Exercise): Visual Keyframe Delay Handling
**Problem Statement:** Visual odometry takes $50\text{ ms}$ of compute time, delivering pose estimates at time $t - 50\text{ ms}$. How does a production ESKF buffer and apply this delayed visual measurement?

**Step-by-Step Solution:**
1. Maintain an IMU state ring buffer storing nominal states $(p, v, q, b)$ and covariance $P$ at every high-rate step ($1\text{ kHz}$).
2. When the VO estimate for timestamp $t - 50\text{ ms}$ arrives:
   - Interpolate the stored nominal state at $t - 50\text{ ms}$.
   - Compute visual innovation $y = z_{\text{VO}} - p_{\text{nom}}(t - 50\text{ ms})$.
   - Execute the measurement update and error injection on the historical state at $t - 50\text{ ms}$.
   - Re-integrate all subsequent IMU packets up to the current timestamp $t$. $\blacksquare$

---

### Problem 10.15 (Solved Exercise): Continuous Noise Spectral Density of IMU
**Problem Statement:** An IMU datasheet specifies accelerometer noise density $N_a = 100\text{ }\mu\text{g}/\sqrt{\text{Hz}}$. Convert this into SI continuous spectral density $Q_c$ in $(\text{m/s}^2)^2/\text{Hz}$.

**Step-by-Step Solution:**
1. $1\text{ }\mu\text{g} = 10^{-6} \times 9.80665\text{ m/s}^2 \approx 9.80665 \times 10^{-6}\text{ m/s}^2$.
2. $N_a = 100 \times 9.80665 \times 10^{-6} = 9.80665 \times 10^{-4}\text{ m/s}^2/\sqrt{\text{Hz}}$.
3. Continuous spectral density:
   $$Q_c = N_a^2 = (9.80665 \times 10^{-4})^2 \approx 9.617 \times 10^{-7}\text{ (m/s}^2)^2/\text{Hz}$$

**Final Answer:**
$$Q_c \approx 9.617 \times 10^{-7}\text{ m}^2/\text{s}^3$$

---

### Problem 10.16 (Solved Exercise): Skew-Symmetric Matrix Properties
**Problem Statement:** Verify the identity $[\omega]_\times v = -[v]_\times \omega$ for $\omega = [1, 2, 3]^T, v = [4, 5, 6]^T$.

**Step-by-Step Solution:**
1. Skew-symmetric multiplication corresponds to the vector cross-product:
   $$[\omega]_\times v = \omega \times v$$
2. Since cross-product is anti-commutative:
   $$\omega \times v = -(v \times \omega) = -[v]_\times \omega$$
3. Numerical check:
   $$\omega \times v = [2(6) - 3(5), \, 3(4) - 1(6), \, 1(5) - 2(4)]^T = [-3, \, 6, \, -3]^T$$
   $$-[v]_\times \omega = -[5(3) - 6(2), \, 6(1) - 4(3), \, 4(2) - 5(1)]^T = -[3, \, -6, \, 3]^T = [-3, \, 6, \, -3]^T \quad \blacksquare$$

---

### Problem 10.17 (Solved Exercise): Barometer Altitude Fusion
**Problem Statement:** A barometric pressure sensor provides altitude $z_{\text{baro}} = p_z + v_{\text{baro}}$ with variance $R = 0.25\text{ m}^2$. Write the measurement matrix $H_{\text{baro}} \in \mathbb{R}^{1 \times 15}$.

**Step-by-Step Solution:**
1. $z_{\text{baro}}$ observes the 3rd component of position: $p_z$.
2. In the 15D error state $\delta x = [\delta p_x, \delta p_y, \delta p_z, \dots]^T$:
   $$H_{\text{baro}} = \begin{bmatrix} 0 & 0 & 1 & 0 & 0 & \cdots & 0 \end{bmatrix} \in \mathbb{R}^{1 \times 15}$$

**Final Answer:**
$$H_{\text{baro}} = [0, 0, 1, 0_{1\times 12}]$$

---

### Problem 10.18 (Solved Exercise): Magnetometer Yaw Heading Observability
**Problem Statement:** Explain why adding a 3-axis magnetometer restores observability to the yaw gyroscope bias $\delta b_{gz}$ that was proved unobservable in Problem 10.6.

**Step-by-Step Solution:**
1. The Earth's magnetic field vector $B^n$ has a non-zero horizontal component pointing towards magnetic North: $B^n = [B_N, 0, B_D]^T$.
2. Rotation around the vertical axis (yaw) rotates the horizontal magnetic vector in body coordinates:
   $$B^b = R_n^b(\psi) B^n$$
3. Taking derivative with respect to yaw angle:
   $$\frac{\partial B^b}{\partial \psi} \neq 0$$
4. This adds linearly independent rows to the observability matrix relating $\delta \theta_z$ and $\delta b_{gz}$ to the measurements, making yaw bias fully observable. $\blacksquare$

---

### Problem 10.19 (Solved Exercise): Accelerometer Random Walk Variance Growth
**Problem Statement:** If accelerometer bias is a random walk with $\dot{b}_a = \eta_{ba}$ where $\operatorname{Var}(\eta_{ba}) = Q_{ba} = 10^{-6}\text{ (m/s}^2)^2/\text{s}$, compute the standard deviation of bias drift after $t = 1\text{ hour}$ ($3600\text{ s}$).

**Step-by-Step Solution:**
1. Variance of random walk:
   $$\sigma_{ba}^2(t) = Q_{ba} t$$
2. For $t = 3600\text{ s}$:
   $$\sigma_{ba}^2(3600) = 10^{-6} \times 3600 = 3.6 \times 10^{-3}\text{ (m/s}^2)^2$$
3. Standard deviation:
   $$\sigma_{ba} = \sqrt{3.6 \times 10^{-3}} \approx 0.0600\text{ m/s}^2$$

**Final Answer:**
$$\sigma_{ba} = 6.0\text{ cm/s}^2\text{ after 1 hour}$$

---

### Problem 10.20 (Solved Exercise): Asynchronous Multi-Sensor Pipeline Scheduling
**Problem Statement:** A robot receives IMU at $500\text{ Hz}$, Wheel Encoders at $100\text{ Hz}$, Camera at $30\text{ Hz}$, and GPS at $5\text{ Hz}$. Detail the chronological execution queue for a single $1\text{ s}$ window.

**Step-by-Step Solution:**
1. Maintain an event-driven priority queue sorted by timestamp $t_k$.
2. During $1\text{ s}$, exactly:
   - 500 IMU events trigger nominal strapdown propagation and error covariance prediction ($\Delta t = 2\text{ ms}$).
   - 100 Wheel Encoder events trigger velocity updates.
   - 30 Camera events trigger visual feature/pose updates.
   - 5 GPS events trigger absolute geodetic position updates.
3. Every measurement update executes the ESKF correction, injects error into the nominal state, resets $\delta x \leftarrow 0$, and continues high-rate IMU propagation. $\blacksquare$
