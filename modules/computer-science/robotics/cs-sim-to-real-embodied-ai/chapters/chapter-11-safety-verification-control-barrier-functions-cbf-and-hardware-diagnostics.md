# Chapter 11: Safety Verification, Control Barrier Functions (CBF), and Hardware Diagnostics

## 11.1 Introduction: The Reality of Physical Danger

In pure software AI (such as computer vision, natural language processing, or game playing), the worst-case failure mode of a neural network is an incorrect classification token, a misplaced bounding box, or an awkward conversation string. The computer processor does not catch fire, and human bystanders are not physically crushed.

**In Embodied AI and physical robotics, the stakes are existential.**

A physical robot is a high-kinetic-energy cyber-physical machine:
- A $55\text{ kg}$ humanoid robot walking at $1.5\text{ m/s}$ possesses hundreds of joules of linear kinetic energy.
- High-torque brushless actuators can exert output forces exceeding $200\text{ N}\cdot\text{m}$—sufficient to shear steel fasteners, shatter planetary gears, or crush human limbs.
- High-speed autonomous drones carry lithium-polymer batteries capable of catastrophic thermal runaway upon high-velocity impact.

When a deep reinforcement learning policy—which is fundamentally an unconstrained, non-linear black box—encounters an unexpected physical anomaly (a sensor dropout, a wet floor, or an unmodeled payload), its outputs can undergo wild numerical excursions. Without a supervisory safety layer, the policy will command maximum voltage, driving joints into hard mechanical stops at destructive velocities.

To bridge the sim-to-real gap safely, **safety cannot be a soft reward penalty in RL**. It must be enforced as a **hard mathematical constraint** guaranteed by control theory: **Control Barrier Functions (CBF) and Hardware Diagnostics** (Ames et al., 2019; Taylor et al., 2020; Wabersich & Zeilinger, 2021).

```
+---------------------------------------------------------------------------------------------------+
|                        REAL-TIME SAFETY FILTER ARCHITECTURE (CBF-QP)                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Deep RL Policy (50 Hz)                                                                         |
|    Outputs: Unconstrained Nominal Command u_RL in R^m                                             |
|         │                                                                                         |
|         ▼                                                                                         |
|    ┌────────────────────────────────────────────────────────┐                                     |
|    │  CONTROL BARRIER FUNCTION (CBF) SAFETY FILTER:         │                                     |
|    │                                                        │                                     |
|    │  min_{u}  (1/2) * || u - u_RL ||^2                     │  <-- Quadratic Program (QP)         |
|    │                                                        │      Solves in < 100 microseconds   |
|    │  subject to:                                           │                                     |
|    │    1. CBF Invariance: L_f h(x) + L_g h(x)*u >= -gamma(h)│  <-- Forward Invariant Safe Set C   |
|    │    2. Joint Limits  : q_min <= q + dt*qdot <= q_max    │                                     |
|    │    3. Velocity Clamp: |qdot| <= qdot_max               │                                     |
|    │    4. Torque Limits : |u| <= tau_max                   │                                     |
|    └────────────────────────────────────────────────────────┘                                     |
|         │                                                                                         |
|         ▼                                                                                         |
|    Safe Actuator Command u_safe ────► Motor Drivers (Guaranteed Collision-Free & Stable!)         |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 11.2 Control Barrier Functions (CBF) and Set Invariance

Let a non-linear continuous control system be defined by:
$$\dot{x} = f(x) + g(x) u$$
where $x \in \mathcal{D} \subset \mathbb{R}^n$ is the robot state and $u \in \mathcal{U} \subset \mathbb{R}^m$ is the control torque input.

### 11.2.1 The Safe Set $\mathcal{C}$
We define a safe operational domain $\mathcal{C} \subset \mathbb{R}^n$ as the 0-superlevel set of a continuously differentiable scalar function $h: \mathcal{D} \to \mathbb{R}$:
$$\mathcal{C} = \{ x \in \mathcal{D} \subset \mathbb{R}^n \mid h(x) \ge 0 \}$$
$$\partial\mathcal{C} = \{ x \in \mathcal{D} \subset \mathbb{R}^n \mid h(x) = 0 \}$$
$$\operatorname{Int}(\mathcal{C}) = \{ x \in \mathcal{D} \subset \mathbb{R}^n \mid h(x) > 0 \}$$

Examples of safe barrier functions $h(x)$:
- **Joint Position Limit:** $h_{\text{joint}}(q) = q_{\max} - q \ge 0$
- **Obstacle Avoidance:** $h_{\text{obs}}(p) = \|p - p_{\text{obs}}\|^2 - R_{\text{safe}}^2 \ge 0$
- **Kinetic Energy Barrier:** $h_{\text{energy}}(v) = E_{\max} - \frac{1}{2} m v^2 \ge 0$

### 11.2.2 Nagumo's Theorem and Forward Invariance
A set $\mathcal{C}$ is **forward invariant** if for every initial state $x(0) \in \mathcal{C}$, the trajectory remains inside $\mathcal{C}$ for all future time:
$$x(t) \in \mathcal{C} \quad \forall t \ge 0$$

By Nagumo's Theorem, set invariance requires that at the boundary $\partial\mathcal{C}$ where $h(x) = 0$, the vector field cannot point outward:
$$\dot{h}(x, u) \ge 0 \quad \forall x \in \partial\mathcal{C}$$

A function $h(x)$ is a **Control Barrier Function (CBF)** if there exists an extended class $\mathcal{K}_\infty$ function $\alpha$ such that:
$$\sup_{u \in \mathcal{U}} \left[ L_f h(x) + L_g h(x) u \right] \ge -\alpha(h(x)) \quad \forall x \in \mathcal{D}$$
where $L_f h(x) = \nabla h(x)^T f(x)$ and $L_g h(x) = \nabla h(x)^T g(x)$ are the Lie derivatives.
Typically, a linear decay $\alpha(h) = \gamma h$ with $\gamma > 0$ is chosen:
$$\dot{h}(x, u) \ge -\gamma h(x)$$

---

## 11.3 The CBF Quadratic Program (CBF-QP) Safety Filter

The CBF condition is **strictly linear with respect to the control input $u$**:
$$[L_g h(x)] u \ge -L_f h(x) - \gamma h(x)$$

This linearity enables the construction of a real-time **Safety Filter** implemented as a convex Quadratic Program (QP):
$$\begin{aligned}
u^*(x) = \arg\min_{u \in \mathbb{R}^m} \quad & \frac{1}{2} \| u - u_{\text{RL}} \|^2 \\
\text{subject to} \quad & A_{\text{cbf}} u \le b_{\text{cbf}} \\
& u_{\min} \le u \le u_{\max}
\end{aligned}$$
where $A_{\text{cbf}} = -L_g h(x)$ and $b_{\text{cbf}} = L_f h(x) + \gamma h(x)$.

### 11.3.1 Intuition of the Filter
- When the robot is deep inside the safe set ($h(x) \gg 0$), the barrier constraint is inactive. The QP outputs $u^* = u_{\text{RL}}$ with zero modification!
- When the robot approaches the safety boundary ($h(x) \to 0$), the constraint activates. The QP minimally projects $u_{\text{RL}}$ to the boundary of the safe control set, intervening only when strictly necessary to prevent violation.

---

## 11.4 Hardware Diagnostics and Emergency Stop (E-Stop) Telemetry

In addition to continuous CBF filtering, physical robots must run real-time hardware supervisors checking for component-level failures:

```
+---------------------------------------------------------------------------------------------------+
|                        MULTI-TIER HARDWARE SUPERVISORY SYSTEM                                     |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  TIER 1: ACTUATOR THERMAL & ELECTRICAL SAFETY (1000 Hz)                                           |
|  - Over-temperature trigger: T_coil >= 115 °C ===> Derate torque by 50%                           |
|  - Critical thermal shutdown: T_coil >= 130 °C ===> Trip Inverter Power Stage                     |
|  - Phase over-current trip: |I_phase| >= I_trip (Hardware comparator < 2 microseconds)           |
|  - Bus under-voltage lockout: V_bus <= 36.0 V (Prevent battery destruction)                       |
|                                                                                                   |
|  TIER 2: KINEMATIC & IMPACT DIAGNOSTICS (500 Hz)                                                  |
|  - Joint acceleration limit: |qddot| >= qddot_max (Sensed gearbox jam)                           |
|  - Structural impact spike: ||a_imu|| >= 15.0 g (Collision detected)                             |
|  - Communication watchdog: Heartbeat timeout > 10.0 ms ===> Zero-Torque Dynamic Braking           |
|                                                                                                   |
|  TIER 3: STATISTICAL INNOVATION GATING (100 Hz)                                                    |
|  - Chi-square test on EKF innovation: y^T S^(-1) y >= chi_p^2(0.999)                             |
|  - Flags sensor detachment, optical camera occlusion, or wheel slip                               |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 11.5 Worked Examples (Problems 11.1 – 11.10)

---

### Problem 11.1 (Worked Example): Single-Joint Position Barrier Function Formulation
**Problem Statement:** A robot joint has upper mechanical stop at $q_{\max} = 2.50\text{ rad}$. The joint dynamics are a double integrator: $\ddot{q} = u$, where $u$ is commanded acceleration.
To enforce a safety buffer taking into account joint velocity $\dot{q}$, a Control Barrier Function is formulated as:
$$h(q, \dot{q}) = q_{\max} - q - \frac{\dot{q}^2}{2 a_{\max}}$$
where $a_{\max} = 15.0\text{ rad/s}^2$ is maximum allowable deceleration.
1. Show that $h(q, \dot{q}) \ge 0$ guarantees the joint can stop before hitting $q_{\max}$.
2. For $q = 2.40\text{ rad}$ and $\dot{q} = 1.20\text{ rad/s}$, compute the value of $h$ and the minimum deceleration constraint on $u$ for $\gamma = 10.0\text{ s}^{-1}$.

**Given Data:**
- $q_{\max} = 2.50\text{ rad}$
- $a_{\max} = 15.0\text{ rad/s}^2$
- $q = 2.40\text{ rad}$
- $\dot{q} = 1.20\text{ rad/s}$
- $\gamma = 10.0\text{ s}^{-1}$

**Step-by-Step Derivation:**
1. Physical derivation of $h$:
   Under constant deceleration $-a_{\max}$, the stopping distance from velocity $\dot{q}$ is:
   $$\Delta q_{\text{stop}} = \frac{\dot{q}^2}{2 a_{\max}}$$
   The predicted stopping angle is $q_{\text{stop}} = q + \Delta q_{\text{stop}}$.
   Requiring $q_{\text{stop}} \le q_{\max} \iff q_{\max} - q - \frac{\dot{q}^2}{2 a_{\max}} \ge 0$.
2. Compute numerical value of $h$:
   $$h(2.40, 1.20) = 2.50 - 2.40 - \frac{(1.20)^2}{2(15.0)} = 0.10 - \frac{1.44}{30.0} = 0.10 - 0.048 = 0.052\text{ rad} > 0$$
   The current state is strictly inside the safe set!
3. Differentiate $h(q, \dot{q})$ with respect to time:
   $$\dot{h} = -\dot{q} - \frac{2 \dot{q} \ddot{q}}{2 a_{\max}} = -\dot{q} - \frac{\dot{q}}{a_{\max}} u$$
4. Enforce the CBF condition $\dot{h} \ge -\gamma h$:
   $$-\dot{q} - \frac{\dot{q}}{a_{\max}} u \ge -\gamma h$$
   $$-\frac{\dot{q}}{a_{\max}} u \ge \dot{q} - \gamma h$$
   Multiply by $-\frac{a_{\max}}{\dot{q}}$ (since $\dot{q} > 0$, the inequality flips):
   $$u \le -a_{\max} + \frac{\gamma a_{\max}}{\dot{q}} h$$
5. Evaluate numerical bound:
   $$u \le -15.0 + \frac{(10.0)(15.0)}{1.20} (0.052) = -15.0 + (125.0)(0.052) = -15.0 + 6.50 = -8.50\text{ rad/s}^2$$

**Final Answer:**
The barrier value is $h = 0.052\text{ rad}$. The CBF constraint mandates that commanded acceleration cannot exceed $u \le -8.50\text{ rad/s}^2$, forcing the motor to actively brake before contacting the physical joint stop. $\blacksquare$

---

### Problem 11.2 (Worked Example): Analytical Solution of a 1D CBF-QP Safety Filter
**Problem Statement:** A neural policy commands an unsafe forward acceleration $u_{\text{RL}} = +20.0\text{ rad/s}^2$. The CBF safety filter requires $u \le -8.50\text{ rad/s}^2$, and motor torque saturation imposes $|u| \le 25.0\text{ rad/s}^2$.
Formulate and solve the Quadratic Program:
$$\min_u \frac{1}{2} (u - u_{\text{RL}})^2 \quad \text{s.t.} \quad u \le u_{\text{safe\_max}}, \quad -u_{\max} \le u \le u_{\max}$$

**Given Data:**
- $u_{\text{RL}} = +20.0\text{ rad/s}^2$
- $u_{\text{safe\_max}} = -8.50\text{ rad/s}^2$
- $u_{\max} = 25.0\text{ rad/s}^2$

**Step-by-Step Derivation:**
1. The unconstrained minimum is at $u = u_{\text{RL}} = +20.0\text{ rad/s}^2$.
2. The intersection of the constraint sets is:
   $$\mathcal{U}_{\text{admissible}} = \{ u \in \mathbb{R} \mid -25.0 \le u \le -8.50 \}$$
3. The objective function $f(u) = \frac{1}{2}(u - 20)^2$ is strictly convex with positive derivative:
   $$f'(u) = u - 20 < 0 \quad \forall u \le -8.50$$
4. Therefore, $f(u)$ is monotonically decreasing on $\mathcal{U}_{\text{admissible}}$, and its minimum occurs at the upper boundary:
   $$u^* = -8.50\text{ rad/s}^2$$

**Final Answer:**
The QP projectively clamps the neural command from $+20.0\text{ rad/s}^2$ to $u^* = -8.50\text{ rad/s}^2$, overriding the unsafe neural output with the minimal necessary braking torque. $\blacksquare$

---

### Problem 11.3 (Worked Example): Multi-Joint Collision Avoidance Barrier
**Problem Statement:** A 2-link robotic arm with end-effector position $p(q) \in \mathbb{R}^2$ must avoid a spherical obstacle centered at $p_{\text{obs}} = [0.40, 0.30]^T\text{ m}$ with safety radius $R_{\text{safe}} = 0.15\text{ m}$.
The barrier function is:
$$h(q) = \| p(q) - p_{\text{obs}} \|^2 - R_{\text{safe}}^2 \ge 0$$
At current configuration, end-effector position is $p = [0.45, 0.40]^T\text{ m}$ and manipulator Jacobian is $J(q) = \begin{bmatrix} -0.30 & -0.15 \\ 0.20 & 0.10 \end{bmatrix}\text{ m/rad}$.
Derive the linear constraint on joint velocity $\dot{q}$ enforced by the CBF condition $\dot{h} \ge -\gamma h$ with $\gamma = 5.0\text{ s}^{-1}$.

**Given Data:**
- $p - p_{\text{obs}} = [0.45 - 0.40, 0.40 - 0.30]^T = [0.05, 0.10]^T\text{ m}$
- $R_{\text{safe}} = 0.15\text{ m} \implies R_{\text{safe}}^2 = 0.0225\text{ m}^2$
- $\gamma = 5.0\text{ s}^{-1}$

**Step-by-Step Derivation:**
1. Compute numerical barrier value $h$:
   $$\|p - p_{\text{obs}}\|^2 = (0.05)^2 + (0.10)^2 = 0.0025 + 0.0100 = 0.0125\text{ m}^2$$
   Notice that $0.0125 < R_{\text{safe}}^2 = 0.0225$!
   Wait, if $h = 0.0125 - 0.0225 = -0.0100\text{ m}^2 < 0$, the robot is already inside the obstacle buffer zone!
2. Differentiate $h$:
   $$\dot{h} = 2 (p - p_{\text{obs}})^T \dot{p} = 2 (p - p_{\text{obs}})^T J(q) \dot{q}$$
3. Compute row vector $A_{\text{cbf}} = 2 (p - p_{\text{obs}})^T J(q)$:
   $$2 [0.05, 0.10] \begin{bmatrix} -0.30 & -0.15 \\ 0.20 & 0.10 \end{bmatrix} = [0.10, 0.20] \begin{bmatrix} -0.30 & -0.15 \\ 0.20 & 0.10 \end{bmatrix}$$
   Row 1: $(0.10)(-0.30) + (0.20)(0.20) = -0.030 + 0.040 = +0.010$
   Row 2: $(0.10)(-0.15) + (0.20)(0.10) = -0.015 + 0.020 = +0.005$
   $$A_{\text{cbf}} = [0.010, 0.005]$$
4. CBF condition $\dot{h} \ge -\gamma h$:
   $$0.010 \dot{q}_1 + 0.005 \dot{q}_2 \ge -(5.0)(-0.0100) = +0.050$$
   Divide by $0.005$:
   $$2.0 \dot{q}_1 + 1.0 \dot{q}_2 \ge 10.0\text{ rad/s}$$

**Final Answer:**
The CBF condition mandates that joint velocities must satisfy $2.0 \dot{q}_1 + \dot{q}_2 \ge 10.0\text{ rad/s}$, actively propelling the end-effector away from the obstacle interior back toward the safe region. $\blacksquare$

---

### Problem 11.4 (Worked Example): Chi-Square Innovation Gating for Sensor Anomaly Detection
**Problem Statement:** An autonomous robot state estimator receives a 3-axis IMU linear acceleration measurement $z_k \in \mathbb{R}^3$. The Kalman filter predicted measurement is $\hat{z}_k$ with innovation $y_k = z_k - \hat{z}_k = [2.5, -3.1, 4.0]^T\text{ m/s}^2$ and innovation covariance $S_k = \operatorname{diag}(1.5, 1.5, 2.0)\text{ m}^2/\text{s}^4$.
1. Compute the normalized squared Mahalanobis innovation distance $d_k^2 = y_k^T S_k^{-1} y_k$.
2. For false alarm probability $\alpha = 0.01$ ($\chi_3^2(0.99) = 11.345$), determine whether this measurement should be accepted or rejected as a sensor impact glitch.

**Given Data:**
- $y_k = [2.5, -3.1, 4.0]^T$
- $S_k = \operatorname{diag}(1.5, 1.5, 2.0)$
- Critical threshold: $\chi_3^2(0.99) = 11.345$

**Step-by-Step Derivation:**
1. Compute quadratic form:
   $$d_k^2 = \frac{(2.5)^2}{1.5} + \frac{(-3.1)^2}{1.5} + \frac{(4.0)^2}{2.0} = \frac{6.25}{1.5} + \frac{9.61}{1.5} + \frac{16.0}{2.0}$$
   $$\frac{6.25 + 9.61}{1.5} = \frac{15.86}{1.5} \approx 10.5733$$
   $$\frac{16.0}{2.0} = 8.000$$
   $$d_k^2 = 10.5733 + 8.000 = 18.5733 \approx 18.57$$
2. Statistical gating test:
   Compare $d_k^2 = 18.57$ against critical threshold $\chi_3^2(0.99) = 11.35$:
   $$18.57 > 11.35$$

**Final Answer:**
Because $d_k^2 = 18.57 > 11.35$, the measurement is statistically rejected as an anomalous shock artifact ($p < 0.001$), preventing corrupted accelerometer readings from destabilizing the state estimator. $\blacksquare$

---

### Problem 11.5 (Worked Example): Real-Time Motor Thermal Derating Algorithm
**Problem Statement:** A continuous thermal monitoring supervisor estimates motor coil temperature $T_c(t)$. Nominal continuous torque is $\tau_{\text{cont}} = 20.0\text{ N}\cdot\text{m}$ and peak torque is $\tau_{\text{peak}} = 50.0\text{ N}\cdot\text{m}$.
The thermal derating algorithm scales the maximum allowable torque $\tau_{\text{limit}}$ as:
$$\tau_{\text{limit}}(T_c) = \begin{cases}
\tau_{\text{peak}}, & T_c \le 90^\circ\text{C} \\
\tau_{\text{peak}} - (\tau_{\text{peak}} - \tau_{\text{cont}}) \left( \frac{T_c - 90}{120 - 90} \right), & 90^\circ\text{C} < T_c < 120^\circ\text{C} \\
\tau_{\text{cont}} \left( \frac{130 - T_c}{130 - 120} \right), & 120^\circ\text{C} \le T_c < 130^\circ\text{C} \\
0, & T_c \ge 130^\circ\text{C} \quad \text{(Shutdown!)}
\end{cases}$$
Compute the allowable torque limit $\tau_{\text{limit}}$ at:
1. Moderate operating temperature $T_c = 105^\circ\text{C}$.
2. Severe critical temperature $T_c = 125^\circ\text{C}$.

**Given Data:**
- $\tau_{\text{peak}} = 50.0\text{ N}\cdot\text{m}$
- $\tau_{\text{cont}} = 20.0\text{ N}\cdot\text{m}$

**Step-by-Step Derivation:**
1. At $T_c = 105^\circ\text{C}$ (Zone 2: $90^\circ\text{C} - 120^\circ\text{C}$):
   $$\tau_{\text{limit}} = 50.0 - (50.0 - 20.0) \left( \frac{105 - 90}{30} \right) = 50.0 - 30.0 \left( \frac{15}{30} \right) = 50.0 - 15.0 = 35.0\text{ N}\cdot\text{m}$$
2. At $T_c = 125^\circ\text{C}$ (Zone 3: $120^\circ\text{C} - 130^\circ\text{C}$):
   $$\tau_{\text{limit}} = 20.0 \left( \frac{130 - 125}{10} \right) = 20.0 \left( \frac{5}{10} \right) = 10.0\text{ N}\cdot\text{m}$$

**Final Answer:**
At $105^\circ\text{C}$, maximum torque is smoothly throttled to $35.0\text{ N}\cdot\text{m}$; at $125^\circ\text{C}$, torque is restricted to emergency crawl capacity of $10.0\text{ N}\cdot\text{m}$, preventing stator winding insulation failure. $\blacksquare$

---

### Problem 11.6 (Worked Example): Watchdog Heartbeat Timeout Dynamic Braking
**Problem Statement:** A high-level RL policy transmits target commands to joint inverters over EtherCAT. A hardware watchdog timer triggers if no valid packet arrives within $t_{\text{timeout}} = 10\text{ ms}$.
Upon timeout, the inverter firmware automatically shorts all three low-side MOSFETs, applying **dynamic regenerative braking**.
A motor with rotor inertia $J = 0.02\text{ kg}\cdot\text{m}^2$, torque constant $K_t = 0.50\text{ N}\cdot\text{m/A}$, and phase resistance $R = 0.8\ \Omega$ is spinning at $\omega_0 = 100\text{ rad/s}$ when the watchdog trips.
Compute the braking torque at the instant of trip $\tau_{\text{brake}}(0)$ and the stopping time constant $\tau_{\text{stop}}$.

**Given Data:**
- $J = 0.02\text{ kg}\cdot\text{m}^2$
- $K_t = 0.50\text{ N}\cdot\text{m/A}$
- $R = 0.8\ \Omega$
- $\omega_0 = 100\text{ rad/s}$

**Step-by-Step Derivation:**
1. Back-EMF generated at $\omega_0 = 100\text{ rad/s}$:
   $$V_{\text{bemf}} = K_e \omega_0 = (0.50)(100) = 50.0\text{ V}$$
2. Shorting motor terminals creates circulating braking current:
   $$I_{\text{brake}} = \frac{V_{\text{bemf}}}{R} = \frac{50.0}{0.8} = 62.5\text{ A}$$
3. Initial braking torque:
   $$\tau_{\text{brake}}(0) = K_t I_{\text{brake}} = (0.50)(62.5) = 31.25\text{ N}\cdot\text{m}$$
4. Dynamic braking differential equation:
   $$J \dot{\omega} = -\tau_{\text{brake}} = -\frac{K_t K_e}{R} \omega = -B_{\text{elec}} \omega$$
   where electrical damping coefficient is:
   $$B_{\text{elec}} = \frac{K_t^2}{R} = \frac{(0.50)^2}{0.8} = \frac{0.25}{0.8} = 0.3125\text{ N}\cdot\text{m}\cdot\text{s/rad}$$
5. Stopping time constant:
   $$\tau_{\text{stop}} = \frac{J}{B_{\text{elec}}} = \frac{0.02}{0.3125} = 0.064\text{ seconds} = 64.0\text{ ms}$$

**Final Answer:**
Dynamic braking exerts an instantaneous counter-torque of $31.25\text{ N}\cdot\text{m}$, arresting high-speed joint rotation with exponential time constant $\tau_{\text{stop}} = 64.0\text{ ms}$ without needing friction brakes. $\blacksquare$

---

### Problem 11.7 (Worked Example): Power Limit Enforcing Hyperbolic Torque Clamping
**Problem Statement:** A mobile robot has battery power draw limit $P_{\max} = 1200\text{ Watts}$ allocated across 4 identical drive wheels ($300\text{ Watts}$ per wheel).
At angular velocity $\omega = 25.0\text{ rad/s}$, compute the maximum allowable wheel torque $\tau_{\text{power\_max}}$ that prevents exceeding the power limit.

**Given Data:**
- $P_{\text{wheel}} = 300\text{ W}$
- $\omega = 25.0\text{ rad/s}$

**Step-by-Step Derivation:**
1. Mechanical power formula:
   $$P_{\text{mech}} = \tau \cdot \omega$$
2. Assuming $90\%$ electrical-to-mechanical inverter efficiency ($\eta = 0.90$):
   $$P_{\text{elec}} = \frac{\tau \cdot \omega}{\eta} \le P_{\text{wheel}}$$
3. Maximum torque bound:
   $$\tau_{\text{power\_max}} = \frac{\eta P_{\text{wheel}}}{\omega} = \frac{(0.90)(300\text{ W})}{25.0\text{ rad/s}} = \frac{270.0}{25.0} = 10.8\text{ N}\cdot\text{m}$$

**Final Answer:**
Maximum allowable torque is clamped to $10.8\text{ N}\cdot\text{m}$. If the neural network requests $20\text{ N}\cdot\text{m}$ at this speed, the power supervisor clamps the command to prevent tripping the onboard battery protection circuit. $\blacksquare$

---

### Problem 11.8 (Worked Example): Jerk Limiting via S-Curve Trajectory Filtering
**Problem Statement:** An unconstrained neural network commands a step velocity change from $v_0 = 0$ to $v_1 = 2.0\text{ m/s}$ in a single time step $\Delta t = 20\text{ ms}$, implying an infinite jerk impulse.
Low-level firmware routes commands through an S-curve filter with maximum acceleration $a_{\max} = 4.0\text{ m/s}^2$ and maximum jerk $j_{\max} = 20.0\text{ m/s}^3$.
Compute the minimum time $t_{\text{ramp}}$ required to reach target velocity $v_1 = 2.0\text{ m/s}$.

**Given Data:**
- $\Delta v = 2.0\text{ m/s}$
- $a_{\max} = 4.0\text{ m/s}^2$
- $j_{\max} = 20.0\text{ m/s}^3$

**Step-by-Step Derivation:**
1. Time to ramp acceleration from 0 to $a_{\max}$:
   $$t_j = \frac{a_{\max}}{j_{\max}} = \frac{4.0}{20.0} = 0.20\text{ seconds}$$
2. Velocity gained during acceleration ramp-up and ramp-down phases ($2 t_j$ total):
   $$\Delta v_j = a_{\max} t_j = (4.0)(0.20) = 0.80\text{ m/s}$$
3. Since $\Delta v = 2.0\text{ m/s} > \Delta v_j = 0.80\text{ m/s}$, the trajectory reaches maximum acceleration $a_{\max}$ and holds it for time $t_a$:
   $$\Delta v = \Delta v_j + a_{\max} t_a \implies 2.0 = 0.80 + 4.0 t_a$$
   $$4.0 t_a = 1.20 \implies t_a = \frac{1.20}{4.0} = 0.30\text{ seconds}$$
4. Total S-curve ramp time:
   $$t_{\text{ramp}} = 2 t_j + t_a = 2(0.20) + 0.30 = 0.40 + 0.30 = 0.70\text{ seconds}$$

**Final Answer:**
The S-curve filter shapes the discrete neural step into a smooth, bounded-jerk trajectory requiring $0.70\text{ seconds}$, completely suppressing high-frequency mechanical shock. $\blacksquare$

---

### Problem 11.9 (Worked Example): High-Order Barrier Function for Second-Order Relative Degree
**Problem Statement:** A position constraint is $h_0(x) = p_{\max} - x \ge 0$. The control input $u = \ddot{x}$ affects $h_0$ only through its second derivative (relative degree 2):
$$\ddot{h}_0 = -u$$
Formulate an Exponential Control Barrier Function (ECBF) that ensures $h_0(x) \ge 0$ for all time.

**Step-by-Step Derivation:**
1. For relative degree 2 systems, standard CBF $\dot{h}_0 \ge -\gamma h_0$ does not contain the control input $u$ ($\dot{h}_0 = -\dot{x}$ is independent of $u$).
2. Define the auxiliary high-order barrier function:
   $$h_1(x, \dot{x}) = \dot{h}_0(x, \dot{x}) + \alpha_1 h_0(x) = -\dot{x} + \alpha_1 (p_{\max} - x)$$
3. Enforce the first-order CBF condition on $h_1$:
   $$\dot{h}_1 \ge -\alpha_2 h_1$$
4. Differentiate $h_1$:
   $$\dot{h}_1 = -\ddot{x} - \alpha_1 \dot{x} = -u - \alpha_1 \dot{x}$$
5. Substitute into condition:
   $$-u - \alpha_1 \dot{x} \ge -\alpha_2 [ -\dot{x} + \alpha_1 (p_{\max} - x) ]$$
   $$-u \ge (\alpha_1 - \alpha_2) \dot{x} - \alpha_1 \alpha_2 (p_{\max} - x)$$
   $$u \le -(\alpha_1 - \alpha_2) \dot{x} + \alpha_1 \alpha_2 (p_{\max} - x)$$

**Final Answer:**
The second-order ECBF constraint is $u \le -(\alpha_1 - \alpha_2)\dot{x} + \alpha_1 \alpha_2 (p_{\max} - x)$, which directly bounds commanded acceleration $u$ to guarantee position boundary invariance. $\blacksquare$

---

### Problem 11.10 (Worked Example): Robust CBF under Parameter Uncertainty
**Problem Statement:** The system dynamics have parameter uncertainty bounded by $\| \Delta f(x) \| \le \epsilon_f$:
$$\dot{x} = f_0(x) + \Delta f(x) + g(x) u$$
Formulate the Robust CBF condition that guarantees safety for all perturbations within the uncertainty bound.

**Step-by-Step Derivation:**
1. True barrier derivative:
   $$\dot{h} = \nabla h(x)^T [f_0(x) + \Delta f(x) + g(x) u] = L_{f_0} h(x) + L_g h(x) u + \nabla h(x)^T \Delta f(x)$$
2. Worst-case perturbation bound by Cauchy-Schwarz:
   $$\nabla h(x)^T \Delta f(x) \ge -\| \nabla h(x) \| \cdot \| \Delta f(x) \| \ge -\| \nabla h(x) \| \epsilon_f$$
3. To guarantee $\dot{h} \ge -\gamma h(x)$ under worst-case perturbation:
   $$L_{f_0} h(x) + L_g h(x) u - \| \nabla h(x) \| \epsilon_f \ge -\gamma h(x)$$
4. The Robust CBF linear constraint is:
   $$[L_g h(x)] u \ge -L_{f_0} h(x) - \gamma h(x) + \epsilon_f \| \nabla h(x) \|$$

**Final Answer:**
The Robust CBF adds a positive safety margin $\epsilon_f \|\nabla h(x)\|$ to the right-hand side, forcing the controller to brake earlier in proportion to the physical model uncertainty. $\blacksquare$

---

## 11.6 Solved Exercises (Problems 11.11 – 11.20)

---

### Problem 11.11 (Solved Exercise): Quadratic Program Feasibility and Slack Variables
**Problem Statement:** When multiple CBF constraints conflict, the QP can become infeasible. Formulate the soft-constrained CBF-QP with slack variable $\delta \ge 0$ and penalty weight $p_{\text{slack}} \gg 1$.

**Step-by-Step Solution:**
1. Soft CBF formulation:
   $$\min_{u, \delta} \frac{1}{2} \| u - u_{\text{RL}} \|^2 + p_{\text{slack}} \delta^2$$
   $$\text{subject to } A_{\text{cbf}} u \le b_{\text{cbf}} + \delta \mathbf{1}, \quad \delta \ge 0, \quad u_{\min} \le u \le u_{\max}$$
2. If constraints are strictly incompatible with actuator limits, $\delta > 0$ absorbs the infeasibility, ensuring the solver never crashes. $\blacksquare$

---

### Problem 11.12 (Solved Exercise): Emergency Deceleration Profiling under Hard Collision Inevitability
**Problem Statement:** A robot traveling at $v = 3.0\text{ m/s}$ detects an obstacle at distance $d = 0.50\text{ m}$. If maximum emergency braking deceleration is $a_{\text{brake}} = 8.0\text{ m/s}^2$, show that collision is inevitable and compute the impact velocity $v_{\text{impact}}$.

**Step-by-Step Solution:**
1. Required stopping distance:
   $$d_{\text{stop}} = \frac{v^2}{2 a_{\text{brake}}} = \frac{(3.0)^2}{2(8.0)} = \frac{9.0}{16.0} = 0.5625\text{ m} > 0.50\text{ m} \implies \text{Collision inevitable!}$$
2. Impact velocity from kinematics $v_f^2 = v_0^2 - 2 a d$:
   $$v_{\text{impact}} = \sqrt{(3.0)^2 - 2(8.0)(0.50)} = \sqrt{9.0 - 8.0} = \sqrt{1.0} = 1.0\text{ m/s} \quad \blacksquare$$

---

### Problem 11.13 (Solved Exercise): Ground Reaction Force Friction Cone CBF
**Problem Statement:** For a quadruped foot exerting force $[F_x, F_y, F_z]^T$, define the friction cone barrier function $h(F) = (\mu F_z)^2 - F_x^2 - F_y^2 \ge 0$ with $F_z \ge 0$. Compute the gradient $\nabla_F h$.

**Step-by-Step Solution:**
1. Gradient with respect to force components:
   $$\nabla_F h = \begin{bmatrix} \frac{\partial h}{\partial F_x} \\ \frac{\partial h}{\partial F_y} \\ \frac{\partial h}{\partial F_z} \end{bmatrix} = \begin{bmatrix} -2 F_x \\ -2 F_y \\ 2 \mu^2 F_z \end{bmatrix} \quad \blacksquare$$

---

### Problem 11.14 (Solved Exercise): Battery Low-Voltage Soft Land Strategy
**Problem Statement:** A LiPo battery cell has nominal voltage $3.7\text{ V}$ and critical cutoff $3.2\text{ V}$. If voltage drops to $3.35\text{ V}$, a soft landing routine throttles maximum forward speed from $2.0\text{ m/s}$ down to $0.4\text{ m/s}$ within $5\text{ s}$. Compute the required deceleration rate.

**Step-by-Step Solution:**
1. Velocity change: $\Delta v = 2.0 - 0.4 = 1.6\text{ m/s}$.
2. Deceleration rate:
   $$a_{\text{throttle}} = \frac{\Delta v}{\Delta t} = \frac{1.6\text{ m/s}}{5.0\text{ s}} = 0.32\text{ m/s}^2 \quad \blacksquare$$

---

### Problem 11.15 (Solved Exercise): Gyroscope Saturation Thresholding
**Problem Statement:** A low-cost MEMS gyroscope saturates at $\omega_{\max} = 2000^\circ/\text{s}$ ($34.9\text{ rad/s}$). If an impact causes raw reading to clamp at $2000^\circ/\text{s}$, explain why the attitude estimator must freeze orientation integration.

**Step-by-Step Solution:**
1. During saturation, true angular velocity $\omega_{\text{true}} > \omega_{\max}$ is unknown.
2. Integrating a saturated rate introduces un-bounded linear orientation drift $\Delta\theta = \int (\omega_{\text{true}} - \omega_{\max}) dt$.
3. Gating firmware must freeze angular integration and trigger an inertial fault flag until rates drop below $1800^\circ/\text{s}$. $\blacksquare$

---

### Problem 11.16 (Solved Exercise): Zero-Moment Point (ZMP) Support Polygon Barrier
**Problem Statement:** For a walking biped, the Zero-Moment Point must remain inside the convex hull of foot contact: $p_{\text{zmp}} \in \mathcal{S}_{\text{support}}$. Write the barrier function for a rectangular foot of length $2 L$ and width $2 W$.

**Step-by-Step Solution:**
1. Barrier functions for longitudinal and lateral margins:
   $$h_x(p) = L^2 - x_{\text{zmp}}^2 \ge 0$$
   $$h_y(p) = W^2 - y_{\text{zmp}}^2 \ge 0 \quad \blacksquare$$

---

### Problem 11.17 (Solved Exercise): Contact Force Sensor Saturation Protection
**Problem Statement:** An optoelectronic foot contact sensor has maximum measurement range $F_{\max} = 400\text{ N}$. If contact force exceeds $380\text{ N}$, how does a CBF prevent sensor physical fracture?

**Step-by-Step Solution:**
1. Define barrier: $h_{\text{force}} = F_{\max} - F_{\text{contact}} \ge 0$.
2. When $F \ge 380\text{ N}$, the CBF constraint limits upward foot velocity $\dot{z}_{\text{foot}}$, forcing leg joints to yield compliantly to absorb impact energy. $\blacksquare$

---

### Problem 11.18 (Solved Exercise): Encoder Integrity Check via Dual-Encoder Discrepancy
**Problem Statement:** A robot joint has a motor-side optical encoder $\theta_m$ and an output link magnetic encoder $\theta_L$. With gear ratio $N = 10$, the expected relationship is $\theta_L = \theta_m / 10$. If discrepancy $|\theta_L - \theta_m / 10| \ge 0.05\text{ rad}$, identify the physical hardware failure.

**Step-by-Step Solution:**
1. A discrepancy of $0.05\text{ rad}$ ($2.86^\circ$) far exceeds normal gearbox backlash ($\approx 0.002\text{ rad}$).
2. This flags a catastrophic mechanical failure: **gearbox shaft shearing, belt slippage, or magnetic encoder slip**.
3. Firmware triggers an immediate hardware E-stop to cut inverter PWM. $\blacksquare$

---

### Problem 11.19 (Solved Exercise): Velocity-Dependent Control Barrier Gain
**Problem Statement:** To allow agile maneuvering at low speeds while enforcing conservative buffers at high speeds, the CBF decay rate is modulated: $\gamma(v) = \gamma_0 / (1 + \beta \|v\|)$. For $\gamma_0 = 10.0$ and $\beta = 0.50$, compute $\gamma$ at $v = 4.0\text{ m/s}$.

**Step-by-Step Solution:**
1. Evaluate:
   $$\gamma(4.0) = \frac{10.0}{1 + (0.50)(4.0)} = \frac{10.0}{1 + 2.0} = \frac{10.0}{3.0} \approx 3.33\text{ s}^{-1} \quad \blacksquare$$

---

### Problem 11.20 (Solved Exercise): Formal Verification of CBF Feasibility under Bounded Control
**Problem Statement:** State the necessary and sufficient condition on control authority $u \in [u_{\min}, u_{\max}]$ to guarantee that the safe set $\mathcal{C}$ is viable (possesses at least one admissible control trajectory for all $x \in \mathcal{C}$).

**Step-by-Step Solution:**
1. Viability condition:
   For every $x \in \partial\mathcal{C}$ where $h(x) = 0$:
   $$\max_{u \in [u_{\min}, u_{\max}]} \left[ L_f h(x) + L_g h(x) u \right] \ge 0$$
2. If at any boundary point $L_g h(x) = 0$ and $L_f h(x) < 0$, the vector field points irrevocably out of the safe set regardless of control input, rendering the system uncontrollable and safety un-guaranteeable. $\blacksquare$
