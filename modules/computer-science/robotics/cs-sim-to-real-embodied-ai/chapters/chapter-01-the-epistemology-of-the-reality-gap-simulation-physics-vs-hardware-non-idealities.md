# Chapter 1: The Epistemology of the Reality Gap — Simulation Physics vs Hardware Non-Idealities

## 1.1 Introduction: The Illusion of the Perfect Physics Engine

Inside a modern physics simulator—such as NVIDIA Isaac Gym, MuJoCo, Bullet, or Drake—a virtual autonomous robot lives in a mathematically pristine Newtonian paradise. Rigid links possess perfectly known geometric bounding boxes, mass is distributed with exact spatial homogeneity, joints rotate with zero friction or with idealized viscous damping, and contact between rubber tires or feet and the ground is formulated as a set of linear complementarity constraints solved to double-precision tolerance in microseconds.

Running on parallel graphics clusters, an artificial intelligence agent can experience thousands of simulated days in a single afternoon. Deep reinforcement learning algorithms optimize millions of neural network weights, discovering athletic locomotion gates, dynamic backflips, and dexterous in-hand manipulation routines. Inside the virtual world, the agent never trips, never burns out a motor coil, and achieves reward scores approaching the theoretical ceiling.

Yet, when this identical neural policy is flashed onto the onboard memory of a physical robot standing on a real laboratory floor, **catastrophic failure is the historical norm**:
- A quadruped takes two spastic steps, stumbles over a $2\text{ mm}$ carpet seam, oscillates violently, and strips its planetary gearbox.
- A dexterous robotic hand attempting to rotate an object drops it immediately because the friction coefficient between its silicone fingertips and the plastic surface was off by $15\%$.
- A high-speed autonomous drone crashes into a wall because motor torque commands were delayed by $25\text{ milliseconds}$ across an asynchronous CAN bus.

This profound chasm between simulated prediction and physical observation is **The Reality Gap** (or *Sim-to-Real Gap*). Understanding, quantifying, and systematically conquering this gap is the defining challenge of modern Embodied Artificial Intelligence.

In this chapter, we develop the rigorous physical, mathematical, and computational epistemology of the Reality Gap. We dissect the contact mechanics formulated in modern physics engines, contrast Linear Complementarity Problems (LCP) against physical material compliance, model micro-frictional Stribeck phenomena, and analyze unmodeled structural resonances across 20 rigorous problems.

---

## 1.2 The Three Pillars of the Reality Gap

The Reality Gap is not a single unified defect; rather, it is the emergent consequence of three distinct physical pillars of discrepancy:

```
+---------------------------------------------------------------------------------------------------+
|                                  THE THREE REALITY GAP PILLARS                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. DYNAMICS DISCREPANCIES                                                                        |
|     - Unmodeled friction curves (Stribeck effect, micro-stick-slip)                               |
|     - Actuator non-linearities: Gearbox backlash, torque ripple, thermal derating                 |
|     - Contact compliance: Soft-body indentation vs rigid algebraic LCP constraints               |
|     - Link flexibility: Structural bending, torsional compliance, high-frequency resonance        |
|                                                                                                   |
|  2. SENSORY & PERCEPTUAL ARTIFACTS                                                                |
|     - Camera imperfections: Motion blur, rolling shutter skew, lens flare, chromatic aberration    |
|     - Depth sensor degradation: Specular dropouts, transparent surfaces, multipath reflections     |
|     - IMU artifacts: Temperature-dependent bias drift, motor vibration harmonics                  |
|     - Encoder quantization and mechanical play                                                    |
|                                                                                                   |
|  3. TEMPORAL LATENCY & ASYNCHRONY                                                                 |
|     - Physics simulation steps synchronously: t_sim = k * dt                                      |
|     - Hardware operates asynchronously: Sensor exposure (30ms), GPU inference (15ms),             |
|       CAN bus transmission (2ms), Motor electrical response (5ms)                                 |
|     - Closed-loop phase lag: Delta_phi = -omega * tau_delay (Injects destructive energy!)        |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 1.3 Contact Mechanics: Linear Complementarity vs Physical Compliance

At the core of all physical robotics is **contact**: the force transmission between the robot and its environment. How physics engines model contact represents the single largest source of dynamics discrepancies.

### 1.3.1 Hard Rigid Contact and the Linear Complementarity Problem (LCP)
Classical analytical mechanics (Signorini-Coulomb framework) models contact between rigid bodies as an inequality constraint. Let $\phi(q) \ge 0$ denote the signed distance (gap function) between two surface points.

The non-penetration condition states:
$$\phi(q) \ge 0$$
$$\lambda_N \ge 0$$
$$\lambda_N \cdot \phi(q) = 0$$

where $\lambda_N$ is the normal contact impulse/force. In mathematical optimization, this triplet is written as the **complementarity condition**:
$$0 \le \lambda_N \perp \phi(q) \ge 0$$

If bodies are separated ($\phi(q) > 0$), normal contact force must be zero ($\lambda_N = 0$). If bodies are touching ($\phi(q) = 0$), contact force can be strictly positive ($\lambda_N \ge 0$).

When extended to multi-contact systems with Coulomb friction cones ($|\lambda_T| \le \mu \lambda_N$), the equations of motion take the form of a **Linear Complementarity Problem (LCP)** or Quadratic Program (QP):

$$\begin{bmatrix} M(q) & -J_N^T & -J_T^T \\ J_N & 0 & 0 \\ J_T & 0 & 0 \end{bmatrix} \begin{bmatrix} \ddot{q} \\ \lambda_N \\ \lambda_T \end{bmatrix} + \begin{bmatrix} C(q, \dot{q})\dot{q} + g(q) - \tau \\ \dots \\ \dots \end{bmatrix} = \begin{bmatrix} 0 \\ w_N \\ w_T \end{bmatrix}$$
subject to:
$$0 \le \lambda_N \perp w_N \ge 0, \quad \lambda_T \in \mathcal{F}(\mu \lambda_N)$$

### 1.3.2 Why Rigid LCP Physics Fails in Reality
1. **Infinite Instantaneous Accelerations:** Perfectly rigid impact dictates instantaneous velocity jumps ($\Delta v$) and Dirac-delta impulsive forces ($\lambda \to \infty$). Real materials have finite elasticity and deform elastically or plastically, absorbing energy.
2. **Painlevé Paradoxes:** Under rigid Coulomb friction, configurations exist where the LCP has either **no mathematical solution** (dynamic jamming) or **multiple non-unique solutions** (indeterminism), causing physics engines to arbitrarily choose one solution or crash with solver divergence.
3. **Baumgarte Stabilization Drift:** To prevent bodies from sinking into one another due to numerical integration errors, engines artificially inject spring-like restitution forces:
   $$w_N = \ddot{\phi} + 2\alpha \dot{\phi} + \beta^2 \phi$$
   These artificial parameters $(\alpha, \beta)$ act as phantom energy sources, causing simulated robots to bounce unnaturally like rubber balls.

### 1.3.3 Compliant Contact: Hertzian Indentation and Hunt-Crossley Damping
In the real physical world, contact occurs over a deformed surface area according to continuum mechanics.
The **Hunt-Crossley compliant contact model** provides a physically realistic non-linear force-penetration relationship:

$$F_N(\delta, \dot{\delta}) = K_{\text{contact}} \delta^n + D_{\text{contact}} \delta^n \dot{\delta}$$

where:
- $\delta = -\phi(q) > 0$ is the material indentation depth.
- $n = 1.5$ for spherical Hertzian contact, $n = 1.0$ for planar contact.
- $K_{\text{contact}} = \frac{4}{3} E^* \sqrt{R^*}$ is the effective stiffness derived from Young's moduli $E_1, E_2$ and Poisson's ratios $\nu_1, \nu_2$:
  $$\frac{1}{E^*} = \frac{1 - \nu_1^2}{E_1} + \frac{1 - \nu_2^2}{E_2}$$
- $D_{\text{contact}} = \frac{3}{2} \alpha_H K_{\text{contact}}$ is the non-linear damping coefficient that guarantees that the damping force vanishes smoothly as penetration depth approaches zero ($\delta \to 0$), preventing unphysical sticky tension forces upon separation.

---

## 1.4 Micro-Frictional Mechanics: The Stribeck Curve and Stick-Slip

In introductory physics and standard simulators, friction is modeled by static and kinetic Coulomb coefficients:
$$F_f \le \mu_s F_N \quad (\text{sticking})$$
$$F_f = -\mu_k F_N \operatorname{sgn}(v) \quad (\text{sliding})$$

### 1.4.1 The Stribeck Friction Model
At microscopic physical scales, contact surfaces consist of rough asperities bathed in boundary lubrication layers. The steady-state friction force $F_{ss}(v)$ as a function of sliding velocity $v$ follows the empirical **Stribeck curve**:

$$F_{ss}(v) = \left[ F_C + (F_S - F_C) \exp\left(-\left|\frac{v}{v_s}\right|^{\delta_s}\right) \right] \operatorname{sgn}(v) + \sigma_v v$$

where:
- $F_C = \mu_k F_N$ is the Coulomb kinetic friction force.
- $F_S = \mu_s F_N$ is the static breakaway friction force ($F_S > F_C$).
- $v_s$ is the Stribeck transition velocity (typically $1\text{--}10\text{ mm/s}$).
- $\delta_s \approx 1\text{--}2$ is the Stribeck shape exponent.
- $\sigma_v$ is the viscous damping coefficient.

```
Friction Force F_f
       ^
 F_S  -|      \
       |       \  <- Boundary Lubrication (Negative Damping / Stick-Slip Instability)
 F_C  -|        \_______
       |                \----------------  <- Hydrodynamic Viscous (sigma_v * v)
       |
       +--------------------------------------------> Relative Velocity v
       0          v_s
```

### 1.4.2 The Danger of Negative Damping
Notice that for velocities in the interval $0 < |v| < v_s$:
$$\frac{d F_{ss}}{dv} < 0$$
The friction slope is **strictly negative**. A negative friction slope acts as negative physical damping! When an autonomous robotic arm attempts slow, high-precision trajectory tracking (such as surgical suturing or peg insertion), this negative damping amplifies tiny perturbations into violent limit-cycle oscillations known as **stick-slip motion**. Simulators that omit the Stribeck drop produce policies that destabilize physical robots during precision tasks.

---

## 1.5 Actuator Non-Idealities: Backlash and Thermal Derating

In physical actuators, electrical current commands do not instantaneously or linearly map to joint torque:

### 1.5.1 Gearbox Backlash Deadband
High-reduction planetary or harmonic gearboxes possess a clearance gap between meshing gear teeth: $\Delta\theta_{\text{backlash}} \approx 0.1^\circ\text{--}0.5^\circ$.
The output torque $\tau_{\text{out}}$ relates to the motor shaft position $\theta_m$ and output joint position $\theta_j$ by:

$$\tau_{\text{out}} = \begin{cases} K_g (\theta_m / N - \theta_j - \frac{1}{2}\Delta\theta) & \text{if } \theta_m / N - \theta_j > \frac{1}{2}\Delta\theta \\ K_g (\theta_m / N - \theta_j + \frac{1}{2}\Delta\theta) & \text{if } \theta_m / N - \theta_j < -\frac{1}{2}\Delta\theta \\ 0 & \text{if } |\theta_m / N - \theta_j| \le \frac{1}{2}\Delta\theta \end{cases}$$

Inside the deadband $[-\frac{1}{2}\Delta\theta, \frac{1}{2}\Delta\theta]$, the motor shaft spins freely without transmitting any torque to the robot link. This introduces a pure time delay and limit-cycle chattering when reversing direction under load.

### 1.5.2 Motor Thermal Derating
Continuous torque output produces resistive heating in the motor stator coils:
$$P_{\text{heat}} = I^2 R_w(T)$$
The copper winding resistance $R_w$ increases linearly with temperature:
$$R_w(T) = R_{w, 0} [1 + \alpha_{\text{cu}} (T - T_0)]$$
where $\alpha_{\text{cu}} \approx 0.00393\text{ K}^{-1}$.
Furthermore, high-temperature operation degrades the magnetic remanence $B_r$ of neodymium (NdFeB) permanent magnets by $\sim 0.11\%/\text{K}$, directly reducing the motor torque constant:
$$K_t(T) = K_{t, 0} [1 - \alpha_{\text{mag}} (T - T_0)]$$

Over a 10-minute quadruped running trial, coil temperatures rise from $25^\circ\text{C}$ to $95^\circ\text{C}$ ($\Delta T = 70\text{ K}$). The torque constant drops by nearly $8\%$, while winding resistance jumps by $27.5\%$. A policy trained in simulation on fixed torque constants fails to generate sufficient lift force to prevent leg collapse.

---

## 1.6 Mathematical Problem Set

### Problem 1.1 (Worked Example): Hertzian Contact Stiffness and Indentation Depth
**Problem Statement:** A quadruped robot with mass $M = 32\text{ kg}$ stands statically on four spherical rubber foot pads of radius $R = 25\text{ mm}$. The rubber foot has Young's modulus $E_1 = 10\text{ MPa}$ and Poisson's ratio $\nu_1 = 0.48$. The concrete ground has Young's modulus $E_2 = 30\text{ GPa}$ and $\nu_2 = 0.20$.
1. Compute the effective Young's modulus $E^*$.
2. Assuming static weight is distributed equally across all four feet ($F_N = \frac{1}{4} M g$), compute the normal indentation depth $\delta$.
3. Compute the effective contact stiffness $K_{\text{contact}} = \frac{d F_N}{d \delta}$ at this operating point and compare it with an idealized rigid contact assumption.

**Given Data:**
- Total mass $M = 32\text{ kg}$, $g = 9.80665\text{ m/s}^2$.
- $F_N = \frac{32 \times 9.80665}{4} = 78.4532\text{ N}$.
- Foot: $R_1 = 0.025\text{ m}, E_1 = 10 \times 10^6\text{ Pa}, \nu_1 = 0.48$.
- Ground: $R_2 = \infty, E_2 = 30 \times 10^9\text{ Pa}, \nu_2 = 0.20$.

**Step-by-Step Derivation:**
1. Effective Young's modulus $E^*$:
   $$\frac{1}{E^*} = \frac{1 - \nu_1^2}{E_1} + \frac{1 - \nu_2^2}{E_2}$$
   $$\frac{1 - (0.48)^2}{10^7} = \frac{1 - 0.2304}{10^7} = \frac{0.7696}{10^7} = 7.696 \times 10^{-8}\text{ Pa}^{-1}$$
   $$\frac{1 - (0.20)^2}{30 \times 10^9} = \frac{0.96}{3 \times 10^{10}} = 3.200 \times 10^{-11}\text{ Pa}^{-1}$$
   Notice that the compliance of concrete is negligible compared to rubber ($\sim 2400\times$ stiffer):
   $$\frac{1}{E^*} \approx 7.696 \times 10^{-8} + 3.2 \times 10^{-11} \approx 7.6992 \times 10^{-8}\text{ Pa}^{-1}$$
   $$E^* = \frac{1}{7.6992 \times 10^{-8}} \approx 12,988,362\text{ Pa} \approx 12.988\text{ MPa}$$
2. Hertzian contact force-indentation formula for a sphere on a flat plane:
   $$F_N = \frac{4}{3} E^* \sqrt{R} \, \delta^{3/2}$$
   where $R^* = R_1 = 0.025\text{ m} \implies \sqrt{R} = \sqrt{0.025} \approx 0.158114\text{ m}^{1/2}$.
   $$F_N = \frac{4}{3} (1.2988 \times 10^7) (0.158114) \, \delta^{3/2} = 2,741,450 \, \delta^{3/2}$$
3. Solving for indentation depth $\delta$:
   $$\delta^{3/2} = \frac{F_N}{2,741,450} = \frac{78.4532}{2,741,450} \approx 2.86174 \times 10^{-5}\text{ m}^{3/2}$$
   $$\delta = (2.86174 \times 10^{-5})^{2/3} \approx 0.0009355\text{ m} \approx 0.9355\text{ mm}$$
4. Tangent contact stiffness $K_{\text{contact}}$:
   $$K_{\text{contact}} = \frac{d F_N}{d \delta} = \frac{3}{2} \left( \frac{4}{3} E^* \sqrt{R} \right) \delta^{1/2} = 2 E^* \sqrt{R} \sqrt{\delta}$$
   $$K_{\text{contact}} = 2 (1.2988 \times 10^7) (0.158114) \sqrt{0.0009355} \approx 4,112,175 \times 0.030586 \approx 125,775\text{ N/m}$$

**Final Result:**
$$E^* = 12.99\text{ MPa}, \quad \delta = 0.936\text{ mm}, \quad K_{\text{contact}} = 1.258 \times 10^5\text{ N/m}$$
*Physical Consequence:* The physical foot indents nearly $1\text{ mm}$ under static load. A rigid-body simulator assuming $\delta = 0$ overestimates contact impact forces by orders of magnitude and miscalculates leg kinematics.

---

### Problem 1.2 (Worked Example): Limit-Cycle Frequency of Stick-Slip Friction
**Problem Statement:** A robotic arm joint of inertia $J = 0.05\text{ kg}\cdot\text{m}^2$ is driven by a motor through a compliant shaft of torsional stiffness $K = 200\text{ N}\cdot\text{m/rad}$ at a constant slow angular velocity $\omega_0 = 0.1\text{ rad/s}$. The joint experiences Stribeck friction with static breakaway torque $\tau_s = 5.0\text{ N}\cdot\text{m}$ and dynamic sliding torque $\tau_k = 2.0\text{ N}\cdot\text{m}$.
1. Compute the stick duration $t_{\text{stick}}$ during which the joint is stationary while the motor winds up the compliant shaft.
2. Formulate the slip equation of motion and compute the peak slip angular velocity $\omega_{\max}$.
3. Compute the fundamental stick-slip limit cycle frequency $f_{\text{ss}}$.

**Step-by-Step Derivation:**
1. Stick Phase Dynamics:
   During the stick phase, the joint is stuck ($\theta = 0, \dot{\theta} = 0$).
   The motor turns at constant velocity $\omega_0$, winding up the spring:
   $$\theta_m(t) = \omega_0 t$$
   Spring torque applied to the joint:
   $$\tau_{\text{spring}}(t) = K (\theta_m(t) - \theta) = K \omega_0 t$$
   Slip initiates when the spring torque reaches the static breakaway torque $\tau_s$:
   $$K \omega_0 t_{\text{stick}} = \tau_s \implies t_{\text{stick}} = \frac{\tau_s}{K \omega_0} = \frac{5.0}{200 \times 0.1} = \frac{5.0}{20.0} = 0.250\text{ s}$$
2. Slip Phase Dynamics:
   Once the joint slips, the friction drops instantaneously to dynamic kinetic friction $\tau_k = 2.0\text{ N}\cdot\text{m}$.
   The equation of motion during slip is:
   $$J \ddot{\theta} = K(\omega_0 t - \theta) - \tau_k$$
   Since the slip duration is very short compared to stick ($t_{\text{slip}} \ll t_{\text{stick}}$), the motor position is approximately constant at $\theta_m \approx \omega_0 t_{\text{stick}} = \frac{\tau_s}{K} = \frac{5.0}{200} = 0.025\text{ rad}$.
   $$J \ddot{\theta} + K \theta = K \theta_m - \tau_k = 5.0 - 2.0 = 3.0\text{ N}\cdot\text{m}$$
   $$\ddot{\theta} + \omega_n^2 \theta = \frac{3.0}{J}, \quad \omega_n = \sqrt{\frac{K}{J}} = \sqrt{\frac{200}{0.05}} = \sqrt{4000} \approx 63.2456\text{ rad/s}$$
   General solution with initial conditions $\theta(0) = 0, \dot{\theta}(0) = 0$:
   $$\theta(t) = \theta_{\text{eq}} (1 - \cos(\omega_n t)) \quad \text{where } \theta_{\text{eq}} = \frac{3.0}{K} = \frac{3.0}{200} = 0.015\text{ rad}$$
   Velocity:
   $$\dot{\theta}(t) = \theta_{\text{eq}} \omega_n \sin(\omega_n t)$$
   Peak slip velocity occurs at $\omega_n t = \frac{\pi}{2}$:
   $$\omega_{\max} = \theta_{\text{eq}} \omega_n = 0.015 \times 63.2456 \approx 0.9487\text{ rad/s}$$
   Notice that $\omega_{\max} \approx 0.95\text{ rad/s}$ is nearly $10\times$ faster than the commanded motor speed $\omega_0 = 0.1\text{ rad/s}$!
3. Slip Duration and Period:
   The slip phase ends when joint velocity returns to zero ($\sin(\omega_n t_{\text{slip}}) = 0$):
   $$t_{\text{slip}} = \frac{\pi}{\omega_n} = \frac{\pi}{63.2456} \approx 0.04967\text{ s}$$
   At this instant, the spring has unloaded:
   $$\theta(t_{\text{slip}}) = 2 \theta_{\text{eq}} = 2(0.015) = 0.030\text{ rad}$$
   Residual spring torque is $K(\theta_m - \theta) = 200(0.025 - 0.030) = -1.0\text{ N}\cdot\text{m} < \tau_s$.
   The joint sticks again!
   Total limit-cycle period:
   $$T_{\text{cycle}} = t_{\text{stick}} + t_{\text{slip}} \approx 0.250 + 0.0497 \approx 0.2997\text{ s}$$
   Limit-cycle frequency:
   $$f_{\text{ss}} = \frac{1}{T_{\text{cycle}}} = \frac{1}{0.2997} \approx 3.337\text{ Hz}$$

**Final Result:**
$$t_{\text{stick}} = 0.250\text{ s}, \quad \omega_{\max} = 0.949\text{ rad/s}, \quad f_{\text{ss}} \approx 3.34\text{ Hz}$$

---

### Problem 1.3 (Worked Example): Linear Complementarity Problem (LCP) Formulation of 1D Block Impact
**Problem Statement:** A 1D rigid slider of mass $m = 2.0\text{ kg}$ with initial downward velocity $v_0 = -3.0\text{ m/s}$ impacts a rigid floor at gap distance $\phi_0 = 0$. Using time-stepping $\Delta t = 0.01\text{ s}$, formulate the discrete contact LCP:
$$w_N = A \lambda_N + b \ge 0, \quad \lambda_N \ge 0, \quad w_N \cdot \lambda_N = 0$$
Solve for the normal contact impulse $\lambda_N$ and the post-impact velocity $v_1$.

**Step-by-Step Derivation:**
1. Discrete Euler-Lagrange equations:
   $$m (v_1 - v_0) = \lambda_N + m g \Delta t$$
   where $\lambda_N = \int_0^{\Delta t} F_N dt$ is the contact impulse.
   $$v_1 = v_0 + g \Delta t + \frac{1}{m} \lambda_N$$
2. Non-penetration kinematic condition at step 1:
   $$\phi_1 = \phi_0 + v_1 \Delta t \ge 0$$
   Dividing by $\Delta t$:
   $$w_N = \frac{\phi_1}{\Delta t} = v_1 = v_0 + g \Delta t + \frac{1}{m} \lambda_N \ge 0$$
3. Standard LCP matrix form:
   $$w_N = A \lambda_N + b$$
   where $A = \frac{1}{m} = \frac{1}{2.0} = 0.50\text{ kg}^{-1}$.
   $$b = v_0 + g \Delta t = -3.0 + (-9.80665)(0.01) = -3.0 - 0.09807 = -3.09807\text{ m/s}$$
   LCP:
   $$0 \le \lambda_N \perp (0.50 \lambda_N - 3.09807) \ge 0$$
4. Solving the LCP:
   - Case 1: If $\lambda_N = 0 \implies w_N = -3.09807 < 0$ (Violates $w_N \ge 0$). Inadmissible.
   - Case 2: If $w_N = 0$:
     $$0.50 \lambda_N - 3.09807 = 0 \implies \lambda_N = \frac{3.09807}{0.50} = 6.19614\text{ N}\cdot\text{s}$$
     Since $\lambda_N > 0$, this is the unique valid complementary solution.
5. Post-impact velocity:
   $$v_1 = w_N = 0.0\text{ m/s}$$

**Final Result:**
$$\lambda_N = 6.196\text{ N}\cdot\text{s}, \quad v_1 = 0.000\text{ m/s}\text{ (Perfect Inelastic Restitution)}$$

---

### Problem 1.4 (Worked Example): Motor Thermal Derating and Torque Loss Calculation
**Problem Statement:** A quadruped knee joint is powered by a high-torque BLDC motor with initial stator winding resistance $R_{w, 0} = 0.15\ \Omega$ and torque constant $K_{t, 0} = 0.12\text{ N}\cdot\text{m/A}$ at ambient temperature $T_0 = 25^\circ\text{C}$.
During a sustained trotting gait, the motor draws a continuous RMS current of $I_{\text{rms}} = 18\text{ A}$. The thermal dissipation resistance of the motor housing to ambient air is $R_{\text{th}} = 1.25^\circ\text{C/W}$.
Temperature coefficients are $\alpha_{\text{cu}} = 0.00393\text{ K}^{-1}$ and $\alpha_{\text{mag}} = 0.0011\text{ K}^{-1}$.
1. Compute the steady-state thermal temperature $T_{\text{final}}$ of the motor windings.
2. Compute the derated winding resistance $R_w(T_{\text{final}})$ and derated torque constant $K_t(T_{\text{final}})$.
3. If the onboard motor driver is limited to a maximum supply voltage $V_{\max} = 24\text{ V}$, compute the percentage reduction in maximum stall torque $\tau_{\text{stall}}$ between cold start and hot steady-state.

**Step-by-Step Derivation:**
1. Steady-State Temperature Equation:
   Heat power generated: $P_{\text{heat}} = I_{\text{rms}}^2 R_w(T)$.
   Temperature rise: $\Delta T = T - T_0 = P_{\text{heat}} R_{\text{th}} = I_{\text{rms}}^2 R_{w, 0} (1 + \alpha_{\text{cu}} \Delta T) R_{\text{th}}$.
   Expanding:
   $$\Delta T = I_{\text{rms}}^2 R_{w, 0} R_{\text{th}} + I_{\text{rms}}^2 R_{w, 0} R_{\text{th}} \alpha_{\text{cu}} \Delta T$$
   $$\Delta T \left( 1 - I_{\text{rms}}^2 R_{w, 0} R_{\text{th}} \alpha_{\text{cu}} \right) = I_{\text{rms}}^2 R_{w, 0} R_{\text{th}}$$
2. Numerical evaluation of terms:
   $$I_{\text{rms}}^2 = 18^2 = 324\text{ A}^2$$
   $$P_0 = 324 \times 0.15 = 48.6\text{ W}$$
   $$P_0 R_{\text{th}} = 48.6 \times 1.25 = 60.75^\circ\text{C}$$
   Denominator term:
   $$1 - 60.75 \times 0.00393 = 1 - 0.23875 = 0.76125$$
   Temperature rise:
   $$\Delta T = \frac{60.75}{0.76125} \approx 79.80^\circ\text{C}$$
   $$T_{\text{final}} = 25^\circ\text{C} + 79.80^\circ\text{C} = 104.80^\circ\text{C}$$
3. Derated Motor Parameters at $104.8^\circ\text{C}$:
   $$R_w(104.8) = 0.15 \times (1 + 0.00393 \times 79.80) = 0.15 \times (1 + 0.3136) = 0.15 \times 1.3136 \approx 0.1970\ \Omega$$
   *(Winding resistance increased by $31.4\%$!)*
   $$K_t(104.8) = 0.12 \times (1 - 0.0011 \times 79.80) = 0.12 \times (1 - 0.08778) = 0.12 \times 0.91222 \approx 0.10947\text{ N}\cdot\text{m/A}$$
   *(Torque constant degraded by $8.78\%$!)*
4. Maximum Stall Torque at $V_{\max} = 24\text{ V}$:
   Stall current $I_{\text{stall}} = \frac{V_{\max}}{R_w}$.
   Stall torque $\tau_{\text{stall}} = K_t I_{\text{stall}} = \frac{K_t V_{\max}}{R_w}$.
   - Cold start ($25^\circ\text{C}$):
     $$\tau_{\text{cold}} = \frac{0.12 \times 24}{0.15} = \frac{2.88}{0.15} = 19.20\text{ N}\cdot\text{m}$$
   - Hot steady-state ($104.8^\circ\text{C}$):
     $$\tau_{\text{hot}} = \frac{0.10947 \times 24}{0.1970} = \frac{2.62728}{0.1970} \approx 13.336\text{ N}\cdot\text{m}$$
5. Percentage reduction:
   $$\text{Reduction} = \frac{19.20 - 13.336}{19.20} \times 100\% = \frac{5.864}{19.20} \times 100\% \approx 30.54\%$$

**Final Result:**
$$T_{\text{final}} = 104.8^\circ\text{C}, \quad R_w = 0.197\ \Omega, \quad K_t = 0.1095\text{ N}\cdot\text{m/A}$$
$$\text{Max Stall Torque Loss} = 30.54\%\text{ (19.20 N}\cdot\text{m} \to 13.34\text{ N}\cdot\text{m)}$$

---

### Problem 1.5 (Worked Example): Gearbox Backlash Phase Lag in Closed-Loop Tracking
**Problem Statement:** A robotic joint has gearbox backlash $\Delta\theta = 0.4^\circ = 0.006981\text{ rad}$. The joint executes a sinusoidal trajectory $\theta(t) = A \sin(\omega t)$ with amplitude $A = 2.0^\circ = 0.034907\text{ rad}$ and frequency $\omega = 5.0\text{ rad/s}$.
1. Compute the time delay $t_{\text{dead}}$ spent traversing the backlash gap during each directional reversal.
2. Using the describing function approximation for a deadband non-linearity, compute the effective phase lag $\phi_{\text{backlash}}$ introduced into the control loop.
3. If the controller had a phase margin of $25^\circ$ in simulation, calculate the degraded physical phase margin on hardware.

**Step-by-Step Derivation:**
1. Trajectory velocity:
   $$\dot{\theta}(t) = A \omega \cos(\omega t)$$
   Direction reversal occurs at the velocity zero-crossing $\cos(\omega t) = 0$, where acceleration is maximum ($|\ddot{\theta}| = A \omega^2$).
   Near the turnaround point ($t = \frac{\pi}{2\omega}$), letting $\tau = t - \frac{\pi}{2\omega}$:
   $$\theta(\tau) \approx A - \frac{1}{2} A \omega^2 \tau^2$$
   The distance traversed by the motor shaft before engaging the opposite gear flank is $\Delta\theta$:
   $$\frac{1}{2} A \omega^2 t_{\text{dead}}^2 = \Delta\theta \implies t_{\text{dead}} = \sqrt{\frac{2 \Delta\theta}{A \omega^2}}$$
2. Numerical evaluation of deadband traversal time:
   $$A \omega^2 = 0.034907 \times 5^2 = 0.034907 \times 25 = 0.872675\text{ rad/s}^2$$
   $$t_{\text{dead}} = \sqrt{\frac{2 \times 0.006981}{0.872675}} = \sqrt{\frac{0.013962}{0.872675}} = \sqrt{0.015999} \approx 0.1265\text{ s}$$
3. Phase lag introduced by deadband:
   The effective phase lag across the cycle can be approximated from the fundamental harmonic phase delay:
   $$\Delta\phi = -\omega \cdot \frac{t_{\text{dead}}}{2} = -5.0 \times \frac{0.1265}{2} = -5.0 \times 0.06325 \approx -0.31625\text{ rad}$$
   Converting to degrees:
   $$\Delta\phi = -0.31625 \times \frac{180^\circ}{\pi} \approx -18.12^\circ$$
4. Degraded Phase Margin:
   $$\text{PM}_{\text{hardware}} = \text{PM}_{\text{sim}} - |\Delta\phi| = 25.0^\circ - 18.12^\circ = 6.88^\circ$$

**Final Result:**
$$t_{\text{dead}} = 126.5\text{ ms}, \quad \text{Phase Lag } \Delta\phi = -18.12^\circ, \quad \text{PM}_{\text{hardware}} = 6.88^\circ$$
*Physical Implication:* The phase margin drops from a robust $25^\circ$ to a dangerously unstable $6.9^\circ$, causing persistent limit-cycle ringing on hardware.

---

### Problem 1.6 (Worked Example): Structural Link Flexibility and Resonance Identification
**Problem Statement:** A lightweight carbon-fiber robotic arm of length $L = 0.8\text{ m}$ carries a payload mass $M = 3.0\text{ kg}$ at its end-effector. The link has flexural rigidity $E I = 1200\text{ N}\cdot\text{m}^2$.
1. Modeling the arm as a cantilever beam with tip mass, compute the fundamental structural resonant frequency $f_{\text{res}}$ in Hz.
2. In simulation, the link was modeled as infinitely rigid, and a high-gain joint PD controller was tuned with closed-loop bandwidth $f_{\text{ctrl}} = 15\text{ Hz}$. Explain why this policy causes explosive high-frequency chatter on the physical robot.

**Step-by-Step Derivation:**
1. Cantilever stiffness at tip:
   $$K_{\text{tip}} = \frac{3 E I}{L^3} = \frac{3 \times 1200}{(0.8)^3} = \frac{3600}{0.512} = 7031.25\text{ N/m}$$
2. Natural frequency of tip mass:
   $$\omega_n = \sqrt{\frac{K_{\text{tip}}}{M}} = \sqrt{\frac{7031.25}{3.0}} = \sqrt{2343.75} \approx 48.4123\text{ rad/s}$$
   Converting to cyclic frequency:
   $$f_{\text{res}} = \frac{\omega_n}{2\pi} = \frac{48.4123}{6.283185} \approx 7.705\text{ Hz}$$
3. Control Bandwidth vs Resonance Comparison:
   $$f_{\text{ctrl}} = 15.0\text{ Hz} > f_{\text{res}} = 7.71\text{ Hz}$$
4. Instability Analysis:
   In classical control theory, control bandwidth must be strictly below structural resonance (typically $f_{\text{ctrl}} \le \frac{1}{3} f_{\text{res}} \approx 2.5\text{ Hz}$).
   Because $f_{\text{ctrl}} > f_{\text{res}}$, the neural network / PD controller attempts to correct errors faster than the elastic link can propagate stress waves. The controller actively excites the link's bending mode, resulting in non-collocated sensor-actuator instability (spillover chatter).

**Final Result:**
$$f_{\text{res}} \approx 7.71\text{ Hz} \ll f_{\text{ctrl}} = 15.0\text{ Hz} \implies \mathbf{Severe\ Structural\ Resonance\ Instability}$$

---

### Problem 1.7 (Worked Example): Baumgarte Stabilization Error in Rigid Simulation
**Problem Statement:** A physics simulator resolves contact penetration using Baumgarte stabilization: $\ddot{\phi} + 2\alpha \dot{\phi} + \beta^2 \phi = 0$.
A robot foot with downward velocity $v_0 = -1.0\text{ m/s}$ penetrates a floor. If Baumgarte parameters are set to $\alpha = 50\text{ s}^{-1}$ and $\beta = 100\text{ s}^{-1}$:
1. Compute the damping ratio $\zeta$ and natural frequency $\omega_n$ of the numerical contact constraint.
2. Solve analytically for penetration depth $\phi(t)$ and compute the maximum penetration $\phi_{\max}$.
3. Calculate the unphysical upward launch velocity $v_{\text{launch}}$ as the foot separates from the ground, demonstrating phantom energy injection.

**Step-by-Step Derivation:**
1. Standard 2nd-order form: $\ddot{\phi} + 2\zeta\omega_n \dot{\phi} + \omega_n^2 \phi = 0$.
   $$\omega_n = \beta = 100\text{ rad/s}$$
   $$2\zeta\omega_n = 2\alpha = 100 \implies \zeta = \frac{100}{200} = 0.50\text{ (Underdamped!)}$$
2. Analytical response for underdamped system with $\phi(0) = 0, \dot{\phi}(0) = v_0 = -1.0\text{ m/s}$:
   Damped frequency: $\omega_d = \omega_n \sqrt{1 - \zeta^2} = 100 \sqrt{1 - 0.25} = 100 \sqrt{0.75} \approx 86.6025\text{ rad/s}$.
   $$\phi(t) = \frac{v_0}{\omega_d} e^{-\zeta\omega_n t} \sin(\omega_d t) = -\frac{1.0}{86.6025} e^{-50 t} \sin(86.6025 t) \approx -0.011547 e^{-50 t} \sin(86.6 t)$$
3. Maximum penetration depth occurs when $\dot{\phi}(t) = 0$:
   $$\dot{\phi}(t) = v_0 e^{-\zeta\omega_n t} \left[ \cos(\omega_d t) - \frac{\zeta}{\sqrt{1 - \zeta^2}} \sin(\omega_d t) \right] = 0$$
   $$\tan(\omega_d t_{\max}) = \frac{\sqrt{1 - \zeta^2}}{\zeta} = \frac{\sqrt{0.75}}{0.5} = \sqrt{3} \implies \omega_d t_{\max} = \frac{\pi}{3}\text{ rad}$$
   $$t_{\max} = \frac{\pi / 3}{86.6025} = \frac{1.047198}{86.6025} \approx 0.012092\text{ s} \approx 12.1\text{ ms}$$
   Penetration at $t_{\max}$:
   $$\phi_{\max} = -0.011547 \times e^{-50(0.012092)} \sin(\pi/3) = -0.011547 \times e^{-0.6046} \times \frac{\sqrt{3}}{2} = -0.011547 \times 0.5463 \times 0.8660 \approx -0.00546\text{ m} = -5.46\text{ mm}$$
4. Rebound velocity at ground exit ($\phi(t) = 0$):
   Zero crossing occurs at $\omega_d t_{\text{exit}} = \pi$:
   $$t_{\text{exit}} = \frac{\pi}{86.6025} \approx 0.036276\text{ s}$$
   Velocity at exit:
   $$v(t_{\text{exit}}) = v_0 e^{-\zeta\omega_n t_{\text{exit}}} \cos(\pi) = (-1.0) e^{-50(0.036276)} (-1) = e^{-1.8138} \approx +0.1630\text{ m/s}$$
   Notice that $v(t_{\text{exit}}) > 0$! The Baumgarte constraint launches the foot upwards at $16.3\text{ cm/s}$ even if the physical coefficient of restitution was specified as zero ($e = 0$).

**Final Result:**
$$\zeta = 0.50, \quad \phi_{\max} = -5.46\text{ mm}, \quad v_{\text{launch}} = +0.163\text{ m/s}\text{ (Artificial Bouncing)}$$

---

### Problem 1.8 (Worked Example): Painlevé Paradox Indeterminism
**Problem Statement:** A rigid rod of length $L = 1.0\text{ m}$ and mass $m = 1.0\text{ kg}$ slides along a rough horizontal floor with kinetic friction coefficient $\mu$. The rod makes an angle $\theta$ with the floor and is in contact at its tip. Prove that if $\mu > \frac{4}{3}$, there exists an angular range $\theta \in [\theta_1, \theta_2]$ where the rigid Coulomb contact equations admit no valid solution (dynamic jamming / Painlevé paradox).

**Step-by-Step Derivation:**
1. Let the contact point have normal acceleration $\ddot{y}_c$ and tangential acceleration $\ddot{x}_c$.
   From rigid body kinematics and Newton-Euler equations:
   $$\ddot{y}_c = A_N N + A_T T + b$$
   where $N$ is normal force and $T = -\mu N \operatorname{sgn}(v_{\text{rel}})$ is friction force during sliding.
2. For sliding in the direction of contact:
   $$\ddot{y}_c = (A_N - \mu A_T) N + b$$
   where $A_N > 0$ is the apparent normal compliance.
3. If the cross-coupling term $A_T > 0$ and friction $\mu$ is sufficiently large:
   $$A_{\text{eff}} = A_N - \mu A_T < 0$$
4. Under this condition, increasing the normal contact force $N > 0$ causes the contact point to accelerate *downwards into the ground* ($\ddot{y}_c < 0$), rather than pushing it away!
5. This leads to the classic Painlevé contradiction:
   - If $N = 0$, contact acceleration penetrates the ground ($\ddot{y}_c < 0$), requiring $N > 0$.
   - If $N > 0$, the force pulls the body deeper into the floor, requiring infinite contact force.
6. Real physics resolves this paradox through wave propagation and material elasticity. Rigid LCP engines either freeze or produce non-physical impulsive explosions. $\blacksquare$

---

### Problem 1.9 (Worked Example): Sensor Noise: Camera Rolling Shutter Geometric Skew
**Problem Statement:** A high-speed autonomous mobile robot drives past a vertical doorway at speed $v = 4.0\text{ m/s}$. An onboard CMOS rolling shutter camera exposes the image row-by-row with total line-readout time $\tau_{\text{frame}} = 33.3\text{ ms}$ over $H = 1080$ scan lines. The camera focal length is $f = 800\text{ pixels}$, and the distance to the wall is $D = 2.0\text{ m}$.
1. Compute the time delay between the top row ($y = 0$) and the bottom row ($y = 1080$).
2. Compute the horizontal pixel displacement $\Delta x_{\text{pixel}}$ between the top and bottom of the doorway in the captured image.
3. Calculate the apparent tilt angle $\theta_{\text{skew}}$ of the vertical door frame caused purely by rolling shutter distortion.

**Step-by-Step Derivation:**
1. Readout delay:
   $$\Delta t_{\text{readout}} = \tau_{\text{frame}} = 0.03333\text{ s}$$
2. Physical distance traveled by robot during exposure:
   $$\Delta x_{\text{robot}} = v \cdot \Delta t_{\text{readout}} = 4.0\text{ m/s} \times 0.03333\text{ s} \approx 0.1333\text{ m} = 13.33\text{ cm}$$
3. Projecting onto camera image plane via pinhole perspective equation:
   $$x_{\text{pixel}} = f \frac{X}{D}$$
   Displacement in pixels:
   $$\Delta x_{\text{pixel}} = f \frac{\Delta x_{\text{robot}}}{D} = 800 \times \frac{0.13333}{2.0} = 400 \times 0.13333 \approx 53.33\text{ pixels}$$
4. Apparent tilt angle:
   The vertical door height in the image is $H = 1080\text{ pixels}$.
   $$\tan(\theta_{\text{skew}}) = \frac{\Delta x_{\text{pixel}}}{H} = \frac{53.33}{1080} \approx 0.04938$$
   $$\theta_{\text{skew}} = \arctan(0.04938) \approx 0.04934\text{ rad} \approx 2.83^\circ$$

**Final Result:**
$$\Delta x_{\text{pixel}} = 53.33\text{ pixels}, \quad \theta_{\text{skew}} \approx 2.83^\circ\text{ tilt}$$
A vertical wall appears tilted by nearly $3^\circ$, corrupting neural network feature extraction.

---

### Problem 1.10 (Worked Example): Quantifying the Reality Gap via Trajectory Divergence
**Problem Statement:** A continuous dynamic system $\dot{x} = f(x, u)$ is simulated as $\dot{x}_{\text{sim}} = f_{\text{sim}}(x, u)$, where the model discrepancy is bounded by $\|f(x, u) - f_{\text{sim}}(x, u)\| \le \epsilon = 0.2\text{ m/s}^2$. The system dynamics have Lipschitz constant $L = 3.0\text{ s}^{-1}$.
Using the Grönwall-Bellman inequality, compute the maximum possible trajectory divergence $\|x(t) - x_{\text{sim}}(t)\|$ after $t = 1.5\text{ s}$ when starting from identical initial conditions $x(0) = x_{\text{sim}}(0)$.

**Step-by-Step Derivation:**
1. Error differential equation:
   $$e(t) = x(t) - x_{\text{sim}}(t)$$
   $$\dot{e}(t) = f(x, u) - f_{\text{sim}}(x_{\text{sim}}, u) = [f(x, u) - f(x_{\text{sim}}, u)] + [f(x_{\text{sim}}, u) - f_{\text{sim}}(x_{\text{sim}}, u)]$$
2. Taking norms and applying triangle inequality:
   $$\|\dot{e}(t)\| \le \|f(x, u) - f(x_{\text{sim}}, u)\| + \|f(x_{\text{sim}}, u) - f_{\text{sim}}(x_{\text{sim}}, u)\|$$
   Using Lipschitz continuity $\|f(x) - f(y)\| \le L \|x - y\|$ and model bound $\epsilon$:
   $$\|\dot{e}(t)\| \le L \|e(t)\| + \epsilon$$
3. Applying Grönwall's Lemma with $e(0) = 0$:
   $$\|e(t)\| \le \frac{\epsilon}{L} (e^{L t} - 1)$$
4. Numerical evaluation for $\epsilon = 0.2, L = 3.0, t = 1.5\text{ s}$:
   $$L t = 3.0 \times 1.5 = 4.5$$
   $$e^{4.5} \approx 90.0171$$
   $$\|e(1.5)\| \le \frac{0.2}{3.0} (90.0171 - 1) = \frac{0.2}{3.0} (89.0171) \approx 5.934\text{ m}$$

**Final Result:**
$$\|e(1.5)\| \le 5.934\text{ m}$$
*Dramatic Finding:* Even with a tiny model error of just $0.2\text{ m/s}^2$ ($2\%$ of gravity), open-loop physical trajectory error explodes to nearly $6\text{ meters}$ in just $1.5\text{ seconds}$!

---

### Problem 1.11 (Solved Exercise): LuGre Dynamic Friction Model Form
**Problem Statement:** Write the differential equations of the LuGre dynamic friction model. Explain how the internal bristle deflection state $z$ captures pre-sliding elasticity and frictional lag.

**Step-by-Step Solution:**
1. The LuGre model treats microscopic asperities as elastic bristles with average deflection $z$:
   $$\dot{z} = v - \frac{\sigma_0 |v|}{g(v)} z$$
   where $g(v) = F_C + (F_S - F_C) e^{-(v/v_s)^2}$.
2. The total friction force is:
   $$F = \sigma_0 z + \sigma_1 \dot{z} + \sigma_v v$$
3. For small displacements before macroscopic sliding ($z \ll 1$), $\dot{z} \approx v \implies z \approx x$.
   Friction behaves as a linear spring-damper: $F \approx \sigma_0 x + \sigma_1 \dot{x}$, capturing physical pre-sliding displacement. $\blacksquare$

---

### Problem 1.12 (Solved Exercise): Discrete Contact Jitter under Penalty Forces
**Problem Statement:** A penalty contact model exerts force $F = -K \phi - D \dot{\phi}$ when penetration $\phi < 0$. If stiffness is $K = 10^5\text{ N/m}$, mass is $m = 1\text{ kg}$, and simulation step is $\Delta t = 0.005\text{ s}$, prove using forward Euler stability that the simulation is unstable.

**Step-by-Step Solution:**
1. Natural frequency: $\omega_n = \sqrt{K/m} = \sqrt{10^5} \approx 316.2\text{ rad/s}$.
2. Forward Euler stability requires $\Delta t \le \frac{2}{\omega_n}$:
   $$\Delta t_{\max} = \frac{2}{316.2} \approx 0.00632\text{ s}$$
   For undamped or lightly damped explicit schemes, stability requires $\omega_n \Delta t \ll 1$.
   Here $\omega_n \Delta t = 316.2 \times 0.005 = 1.581 > 1.0$.
3. Poles lie outside the unit circle, causing exponential energy growth and explosive numerical bouncing. $\blacksquare$

---

### Problem 1.13 (Solved Exercise): IMU Resonant Vibration Rectification Error
**Problem Statement:** A physical quadrotor's propellers vibrate at $150\text{ Hz}$ with acceleration amplitude $A = 50\text{ m/s}^2$. An onboard accelerometer with non-linear second-order sensitivity $a_{\text{meas}} = a_{\text{true}} + K_2 a_{\text{true}}^2$ has $K_2 = 10^{-4}\text{ s}^2/\text{m}$. Compute the DC rectification bias injected into the state estimator.

**Step-by-Step Solution:**
1. Let vibration be $a_{\text{true}} = A \sin(\omega t)$.
2. Measured output:
   $$a_{\text{meas}} = A \sin(\omega t) + K_2 A^2 \sin^2(\omega t) = A \sin(\omega t) + K_2 A^2 \left( \frac{1 - \cos(2\omega t)}{2} \right)$$
3. Taking time average:
   $$\bar{a}_{\text{meas}} = 0 + \frac{1}{2} K_2 A^2 = \frac{1}{2} (10^{-4}) (50)^2 = \frac{1}{2} (10^{-4}) (2500) = 0.125\text{ m/s}^2$$
4. High-frequency vibration rectifies into a permanent $0.125\text{ m/s}^2$ DC acceleration bias, causing $225\text{ m}$ of drift in 60s!

**Final Answer:**
$$\text{Rectified Bias} = 0.125\text{ m/s}^2$$

---

### Problem 1.14 (Solved Exercise): Coulomb Friction Cone Discretization
**Problem Statement:** A 3D friction cone $\|F_T\| \le \mu F_N$ is non-linear (second-order cone). In real-time LCP solvers, it is approximated as an $m$-sided polyhedral pyramid. For an 8-sided pyramid ($m = 8$), compute the maximum percentage error in tangential friction force.

**Step-by-Step Solution:**
1. An $m$-sided regular polygon inscribed in a circle of radius $R = \mu F_N$ has minimum radius at the facet midpoints:
   $$R_{\min} = R \cos\left(\frac{\pi}{m}\right)$$
2. For $m = 8$:
   $$\cos\left(\frac{\pi}{8}\right) = \cos(22.5^\circ) \approx 0.92388$$
3. Maximum percentage error:
   $$\text{Error} = (1 - 0.92388) \times 100\% \approx 7.61\%$$

**Final Answer:**
$$\text{Maximum Friction Error} = 7.61\%$$

---

### Problem 1.15 (Solved Exercise): Depth Sensor Multipath Dropout
**Problem Statement:** An infrared time-of-flight (ToF) depth sensor measures distance to a shiny metal floor at incidence angle $45^\circ$. Explain why the returned depth value is either NaN or falsely reports the ceiling.

**Step-by-Step Solution:**
1. Clean diffuse surfaces reflect light isotropically (Lambertian reflection).
2. Shiny metal surfaces act as specular mirrors: the IR beam reflects forward at $45^\circ$ away from the sensor.
3. If the reflected beam strikes the ceiling and scatters back, the sensor measures the total folded path length $(d_1 + d_2)$, reporting an impossible distance.
4. If no light returns, the sensor outputs zero confidence / NaN shadow hole. $\blacksquare$

---

### Problem 1.16 (Solved Exercise): Motor Armature Inductance Phase Delay
**Problem Statement:** A motor has winding inductance $L = 200\text{ }\mu\text{H}$ and resistance $R = 0.5\ \Omega$. Compute the electrical cutoff frequency $f_e$ and the phase lag between commanded voltage and resulting current at PWM switching frequency $f = 20\text{ kHz}$.

**Step-by-Step Solution:**
1. Electrical time constant: $\tau_e = \frac{L}{R} = \frac{200 \times 10^{-6}}{0.5} = 4.0 \times 10^{-4}\text{ s} = 0.4\text{ ms}$.
2. Cutoff frequency:
   $$f_e = \frac{1}{2\pi \tau_e} = \frac{1}{2\pi (0.0004)} \approx 397.9\text{ Hz}$$
3. At $f = 20\text{ kHz} \gg 398\text{ Hz}$, inductive impedance dominates ($X_L = 2\pi f L \approx 25.13\ \Omega \gg 0.5\ \Omega$).
   Phase lag:
   $$\phi = -\arctan\left(\frac{2\pi f L}{R}\right) = -\arctan(50.26) \approx -88.86^\circ \approx -90^\circ \quad \blacksquare$$

---

### Problem 1.17 (Solved Exercise): Stiff Numerical Spring-Damper Contact Poles
**Problem Statement:** A spring-damper penalty model has stiffness $k = 10^6\text{ N/m}$ and damping $c = 2000\text{ N}\cdot\text{s/m}$ for a $1\text{ kg}$ mass. Find the continuous system poles and explain why explicit integration requires $\Delta t < 1\text{ }\mu\text{s}$.

**Step-by-Step Solution:**
1. Differential equation: $\ddot{x} + 2000 \dot{x} + 10^6 x = 0$.
2. Characteristic equation: $s^2 + 2000 s + 10^6 = (s + 1000)^2 = 0$.
3. Critically damped with double pole at $s = -1000\text{ s}^{-1}$.
4. If stiffness is increased to $k = 10^7$ with high damping, poles spread to $s \approx -20,000\text{ s}^{-1}$.
   Explicit Euler requires $\Delta t < \frac{2}{|s_{\max}|} \approx 10^{-4}\text{ s}$, creating a stiff differential equation that slows simulators by $100\times$. $\blacksquare$

---

### Problem 1.18 (Solved Exercise): Gearbox Efficiency under Dynamic Reversal
**Problem Statement:** A planetary gearbox has forward transmission efficiency $\eta_{\text{fwd}} = 90\%$. When backdriven by external ground impact forces, show that the backdriving efficiency is $\eta_{\text{back}} = 2 - \frac{1}{\eta_{\text{fwd}}} = 2 - \frac{1}{0.90} \approx 88.89\%$, and explain what happens if $\eta_{\text{fwd}} \le 50\%$.

**Step-by-Step Solution:**
1. Friction losses in gear teeth reverse direction when backdriven:
   $$\eta_{\text{back}} = 2 - \frac{1}{\eta_{\text{fwd}}}$$
2. For $\eta_{\text{fwd}} = 0.90$: $\eta_{\text{back}} = 2 - 1.1111 = 0.8889 = 88.9\%$.
3. If $\eta_{\text{fwd}} \le 0.50$:
   $$\eta_{\text{back}} \le 2 - 2.0 = 0.0$$
   The gearbox becomes **self-locking**! External impacts cannot turn the motor shaft, transferring all impact energy into gear tooth shear stress and causing mechanical fracture. $\blacksquare$

---

### Problem 1.19 (Solved Exercise): Sim-to-Real Transfer Bound under Wasserstein Distance
**Problem Statement:** Let $P_{\text{sim}}$ and $P_{\text{real}}$ be probability distributions over robot state trajectories. If policy performance is Lipschitz continuous with constant $L_\pi$, prove that the transfer reward gap is bounded by $|J(P_{\text{sim}}) - J(P_{\text{real}})| \le L_\pi \mathcal{W}_1(P_{\text{sim}}, P_{\text{real}})$.

**Step-by-Step Solution:**
1. By the Kantorovich-Rubinstein duality theorem:
   $$\mathcal{W}_1(P, Q) = \sup_{\|f\|_L \le 1} \mathbb{E}_{x \sim P}[f(x)] - \mathbb{E}_{y \sim Q}[f(y)]$$
2. Scale by Lipschitz constant $L_\pi$:
   $$|J(P_{\text{sim}}) - J(P_{\text{real}})| = |\mathbb{E}_{x \sim P_{\text{sim}}}[R(x)] - \mathbb{E}_{y \sim P_{\text{real}}}[R(y)]| \le L_\pi \mathcal{W}_1(P_{\text{sim}}, P_{\text{real}}) \quad \blacksquare$$

---

### Problem 1.20 (Solved Exercise): Non-Collocated Sensor-Actuator Dynamic Inversion
**Problem Statement:** A flexible robot link has an actuator at the base ($x = 0$) and an IMU at the tip ($x = L$). Prove that the transfer function from base torque to tip acceleration has non-minimum phase zeros (right-half plane zeros).

**Step-by-Step Solution:**
1. Stress waves travel down the link with finite speed $c = \sqrt{E/\rho}$, introducing a spatial propagation delay $\tau = L/c$.
2. In Laplace domain, the delay represents $e^{-s \tau}$.
3. Pade approximation: $e^{-s \tau} \approx \frac{1 - s \tau / 2}{1 + s \tau / 2}$, which possesses a zero at $s = +2/\tau > 0$ (Right-Half Plane).
4. Inverting this transfer function produces an unstable pole. Standard inverse dynamics cannot be applied without acausal preview filtering. $\blacksquare$
