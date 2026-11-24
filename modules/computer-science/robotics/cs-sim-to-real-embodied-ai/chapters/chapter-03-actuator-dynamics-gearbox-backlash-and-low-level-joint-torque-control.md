# Chapter 3: Actuator Dynamics, Gearbox Backlash, and Low-Level Joint Torque Control

## 3.1 Introduction: The Fiction of Instantaneous Joint Torque

In rigid-body robotics textbooks and introductory reinforcement learning simulators, the actuator is often abstracted away into an ethereal mathematical fiction:
$$\tau_{\text{motor}}(t) = u_t$$

The neural policy outputs a floating-point scalar $u_t \in [-1, 1]$, which is immediately scaled by a constant $\tau_{\max}$ and fed directly into the equations of motion as an instantaneous generalized force acting between adjacent kinematic links:
$$M(q)\ddot{q} + C(q, \dot{q})\dot{q} + g(q) = \tau_{\max} \cdot u_t$$

On physical robotic hardware, **no such instantaneous torque source exists**.

A real robotic joint is an intricate electromechanical assembly comprising:
1. A permanent magnet brushless DC (BLDC) or permanent magnet synchronous motor (PMSM).
2. A three-phase inverter switching at high PWM frequencies ($20\text{ to }40\text{ kHz}$) running Field-Oriented Control (FOC).
3. A mechanical transmission (planetary, harmonic drive, or cycloidal gearbox) providing torque multiplication ($N:1$ gear ratio).
4. Bearings, elastic flexures, and gear teeth with microscopic mechanical clearance (**backlash**).
5. Thermal boundaries where continuous electrical power dissipation heats copper windings, increasing resistance and degrading neodymium magnet remanence.

When a simulated policy demands an instantaneous torque step $\Delta\tau = 50\text{ N}\cdot\text{m}$, the physical motor faces winding inductance that chokes current slew rate, gearbox clearance where the motor spins freely before slamming into gear teeth, and thermal limits that force driver firmware to aggressively throttle power to prevent fire.

This chapter dissects the non-ideal physics of robotic actuators, builds mathematical models for electromechanical BLDC dynamics, gearbox backlash, series elasticity, and thermal derating, and formulates stable low-level joint control architectures across 20 rigorous problems.

---

## 3.2 Electromechanical Modeling of BLDC Actuators

```
+---------------------------------------------------------------------------------------------------+
|                            ELECTROMECHANICAL ACTUATOR SCHEMATIC                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  ELECTRICAL SUBSYSTEM (Inverter & Windings)          MECHANICAL SUBSYSTEM (Rotor & Gearbox)       |
|                                                                                                   |
|          R_w            L_w                                      J_m          B_m                 |
|   ┌───/\/\/\/\/───────CCCCCCC────┐                      ┌─────────────┐                           |
|   │   Resistance    Inductance   │                      │    Rotor    │    Gearbox Ratio N:1      |
|  (+)                            (+)                     │   Inertia   │    Backlash: 2*alpha      |
|  V_q(t)                         e_bemf(t) ──────►  tau_m│             ├──[===]──► tau_joint       |
|  (-)                            (-)                     │             │                           |
|   │                              │                      └─────────────┘                           |
|   └──────────────────────────────┘                             │                                  |
|                                                                ▼ Viscous Damping                  |
|                                                                                                   |
|  Voltage Equation: V_q = R_w * i_q + L_w * (di_q/dt) + K_e * omega_m                              |
|  Motor Torque    : tau_m = K_t * i_q                                                              |
|  Rotor Dynamics  : J_m * (domega_m/dt) = tau_m - B_m * omega_m - (tau_joint / N)                  |
+---------------------------------------------------------------------------------------------------+
```

### 3.2.1 Field-Oriented Control (FOC) Dynamics
Modern robotic actuators use vector control (FOC) in the rotor-aligned direct-quadrature ($d$-$q$) reference frame:
- The direct axis current $i_d$ controls rotor flux alignment (typically held at $i_d^* = 0$ for non-salient surface-mount PMSM to maximize efficiency).
- The quadrature axis current $i_q$ produces electromagnetic torque:
  $$\tau_m = K_t \cdot i_q$$
  where $K_t$ is the motor torque constant ($\text{N}\cdot\text{m/A}$).

The voltage-current relationship on the quadrature axis is:
$$V_q(t) = R_w i_q(t) + L_w \frac{di_q(t)}{dt} + K_e \omega_m(t)$$
where:
- $R_w$ is the stator winding resistance ($\Omega$).
- $L_w$ is the stator quadrature inductance ($\text{H}$).
- $K_e$ is the back-electromotive force (back-EMF) constant ($\text{V}\cdot\text{s/rad}$). For ideal SI units, $K_e = K_t$.
- $\omega_m$ is the mechanical angular velocity of the motor rotor ($\text{rad/s}$).

### 3.2.2 Current Loop Bandwidth and Electrical Time Constant
Under voltage-limited PWM supply ($V_q \le V_{\text{bus}}$), the current derivative is bounded:
$$\frac{di_q}{dt} = \frac{V_q - R_w i_q - K_e \omega_m}{L_w}$$

The electrical time constant is:
$$\tau_e = \frac{L_w}{R_w}$$
For quasi-direct drive (QDD) outrunner motors (e.g., T-Motor, MIT Cheetah actuators), $\tau_e \approx 0.1\text{ ms} - 0.5\text{ ms}$, yielding current loop bandwidths of $1\text{ to }5\text{ kHz}$.
However, when the rotor spins at high velocity $\omega_m$, the back-EMF voltage $V_{\text{bemf}} = K_e \omega_m$ approaches the supply bus voltage $V_{\text{bus}}$. The remaining voltage margin available to drive current drops to zero:
$$i_{q, \max}(\omega_m) = \frac{V_{\text{bus}} - K_e \omega_m}{R_w}$$
This defines the actuator's **torque-speed envelope**. A policy that commands maximum torque at high joint velocity in simulation will hit this physical voltage cliff and produce near-zero torque on hardware!

---

## 3.3 Gearbox Backlash and Mechanical Hysteresis

To increase torque density, actuators incorporate mechanical gearboxes with gear ratios $N \in [5, 100]$.
Every mechanical gear pair requires a non-zero clearance (gap) between mating tooth profiles to prevent thermal jamming and allow lubricant flow. This clearance is **backlash** ($2\alpha$).

```
+---------------------------------------------------------------------------------------------------+
|                              GEARBOX BACKLASH HYSTERESIS MODEL                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  tau_joint                                                                                        |
|      ▲                                                                                            |
|      │                                  /  Slope = K_gear (Stiff tooth contact)                   |
|      │                                 /                                                          |
|      │                                /                                                           |
|      │        -alpha        +alpha   /                                                            |
|  ────┼───────────[─────────────]────/────────────────► Delta_theta = theta_in / N - theta_out    |
|      │           /                                                                                |
|      │          /                                                                                 |
|      │         /  Dead-band: |Delta_theta| < alpha ===> tau_joint = 0 (Free-play floating!)       |
|      │        /                                                                                   |
|      ▼                                                                                            |
+---------------------------------------------------------------------------------------------------+
```

### 3.3.1 Mathematical Dead-band Formulation
Let $\theta_{\text{in}}$ be the motor shaft angle, and $\theta_{\text{out}}$ be the output joint angle.
The transmission kinematics without backlash are $\theta_{\text{out}} = \theta_{\text{in}} / N$.
With backlash half-width $\alpha$, the transmitted torque $\tau_{\text{joint}}$ is governed by a hysteretic dead-band:
$$\tau_{\text{joint}} = \begin{cases}
K_{\text{gear}} \left(\frac{\theta_{\text{in}}}{N} - \theta_{\text{out}} - \alpha \operatorname{sgn}\left(\frac{\dot{\theta}_{\text{in}}}{N} - \dot{\theta}_{\text{out}}\right)\right) + D_{\text{gear}} \left(\frac{\dot{\theta}_{\text{in}}}{N} - \dot{\theta}_{\text{out}}\right), & \text{if teeth in contact} \\
0, & \text{if floating in clearance}
\end{cases}$$

### 3.3.2 Physical Consequences of Backlash
1. **Loss of Controllability in the Dead-band:** When $|\Delta\theta| \le \alpha$, the joint output is completely disconnected from the motor. External gravity or contact forces accelerate the link with zero actuator control authority.
2. **Impact Chatter (Limit Cycles):** As the motor reverses direction to correct a tracking error, it accelerates freely through the dead-band and slams into the opposing tooth face at high relative velocity, generating high-frequency acoustic chatter, impact stress, and limit-cycle oscillation.

---

## 3.4 Motor Thermal Derating and Coil Degradation

Continuous robotic athletic locomotion (such as sustained quadruped galloping or humanoid standing) dissipates substantial electrical power into the motor's copper coils:
$$P_{\text{loss}}(t) = 3 I_{\text{rms}}^2(t) R_w(T_c)$$

### 3.4.1 Temperature Dependence of Copper Resistance
Copper possesses a positive temperature coefficient of resistance $\alpha_{\text{Cu}} \approx 0.00393\text{ K}^{-1}$.
At winding temperature $T_c$:
$$R_w(T_c) = R_0 [1 + \alpha_{\text{Cu}} (T_c - T_0)]$$
When coil temperature rises from $25^\circ\text{C}$ to $125^\circ\text{C}$ ($\Delta T = 100\text{ K}$), resistance increases by:
$$R_w(125^\circ\text{C}) = R_0 [1 + (0.00393)(100)] = 1.393 R_0$$
A $39.3\%$ increase in winding resistance!

### 3.4.2 Permanent Magnet Thermal Demagnetization
Neodymium iron boron (NdFeB) permanent magnets have a negative reversible temperature coefficient of remanence $\alpha_{\text{mag}} \approx -0.11\%/\text{K}$.
As rotor magnet temperature $T_m$ rises:
$$K_t(T_m) = K_{t0} [1 + \alpha_{\text{mag}} (T_m - T_0)]$$
At $T_m = 100^\circ\text{C}$ ($\Delta T = 75\text{ K}$), torque constant drops by:
$$\Delta K_t = -0.11\% \times 75 = -8.25\%$$

The combined effect of increased resistance (higher $I^2 R$ loss) and reduced torque constant causes **thermal derating**: sustained motor torque capacity degrades significantly over minutes of operation, causing robots that performed well initially to slowly sink and collapse as their motors heat up.

---

## 3.5 Low-Level Joint PD Control Architecture

On physical robots, high-level RL policies or whole-body controllers do not directly command raw phase voltages. Instead, they output desired joint positions $q_{\text{des}}$, velocities $\dot{q}_{\text{des}}$, and feedforward torques $\tau_{\text{ff}}$ to a fast low-level microcontroller ($1\text{ kHz}$ to $20\text{ kHz}$):

```
+---------------------------------------------------------------------------------------------------+
|                            LOW-LEVEL HYBRID PD + FEEDFORWARD LOOP                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  High-Level Policy (50 Hz)                                                                        |
|    Outputs: { q_des, qdot_des, tau_ff, K_p, K_d }                                                 |
|         │                                                                                         |
|         ▼                                                                                         |
|  Low-Level Joint Controller (1000 Hz)                                                             |
|                                                                                                   |
|  tau_cmd = K_p * (q_des - q_meas) + K_d * (qdot_des - qdot_meas) + tau_ff                         |
|         │                                                                                         |
|         ▼                                                                                         |
|  [ Slew Rate Limiter ]  : |d tau / dt| <= tau_dot_max                                             |
|         │                                                                                         |
|         ▼                                                                                         |
|  [ Saturation Clamp ]   : |tau| <= tau_max(omega, Temp)                                           |
|         │                                                                                         |
|         ▼                                                                                         |
|  Motor FOC Inverter (20 kHz Current Loop: i_q = tau_clamped / K_t)                                |
+---------------------------------------------------------------------------------------------------+
```

The commanded torque is:
$$\tau_{\text{cmd}} = \operatorname{clip}\left( K_p (q_{\text{des}} - q) + K_d (\dot{q}_{\text{des}} - \dot{q}) + \tau_{\text{ff}}, -\tau_{\max}, \tau_{\max} \right)$$

Simulators that ignore this internal low-level control loop fail to reproduce the compliance, tracking delay, and saturation dynamics of physical actuators.

---

## 3.6 Worked Examples (Problems 3.1 – 3.10)

---

### Problem 3.1 (Worked Example): Maximum Speed-Torque Operating Envelope
**Problem Statement:** A quasi-direct drive (QDD) BLDC actuator is powered by a $V_{\text{bus}} = 48\text{ V}$ DC battery. The motor has winding resistance $R_w = 0.40\ \Omega$, torque constant $K_t = 0.095\text{ N}\cdot\text{m/A}$, and back-EMF constant $K_e = 0.095\text{ V}\cdot\text{s/rad}$. The inverter has a continuous current limit $I_{\max} = 30\text{ A}$.
Compute:
1. The maximum stall torque $\tau_{\text{stall}}$.
2. The no-load rotor angular velocity $\omega_{\text{no-load}}$.
3. The maximum torque $\tau_{\text{joint}}$ deliverable when the motor spins at $\omega_m = 350\text{ rad/s}$.

**Given Data:**
- $V_{\text{bus}} = 48\text{ V}$
- $R_w = 0.40\ \Omega$
- $K_t = 0.095\text{ N}\cdot\text{m/A}$
- $K_e = 0.095\text{ V}\cdot\text{s/rad}$
- $I_{\max} = 30\text{ A}$

**Step-by-Step Derivation:**
1. Maximum stall torque:
   At stall ($\omega_m = 0$), back-EMF is zero.
   The theoretical stall current is $I_{\text{stall, unconstrained}} = \frac{V_{\text{bus}}}{R_w} = \frac{48}{0.40} = 120\text{ A}$.
   Since inverter current limit is $I_{\max} = 30\text{ A} < 120\text{ A}$, current is clamped at $30\text{ A}$:
   $$\tau_{\text{stall}} = K_t I_{\max} = (0.095)(30) = 2.85\text{ N}\cdot\text{m}$$
2. No-load speed:
   At steady-state no-load ($i_q \approx 0$ neglecting friction), back-EMF equals bus voltage:
   $$V_{\text{bus}} = K_e \omega_{\text{no-load}} \implies \omega_{\text{no-load}} = \frac{V_{\text{bus}}}{K_e} = \frac{48}{0.095} \approx 505.26\text{ rad/s}$$
   In RPM: $505.26 \times \frac{60}{2\pi} \approx 4825\text{ RPM}$.
3. Torque at $\omega_m = 350\text{ rad/s}$:
   Compute back-EMF:
   $$V_{\text{bemf}} = K_e \omega_m = (0.095)(350) = 33.25\text{ V}$$
   Remaining voltage across winding resistance:
   $$\Delta V = V_{\text{bus}} - V_{\text{bemf}} = 48.0 - 33.25 = 14.75\text{ V}$$
   Maximum deliverable current:
   $$I_{\text{avail}} = \frac{\Delta V}{R_w} = \frac{14.75}{0.40} = 36.875\text{ A}$$
   Since $I_{\text{avail}} > I_{\max} = 30\text{ A}$, the inverter current limit still governs:
   $$\tau = K_t I_{\max} = 2.85\text{ N}\cdot\text{m}$$
   Now evaluate at $\omega_m = 450\text{ rad/s}$:
   $$V_{\text{bemf}} = (0.095)(450) = 42.75\text{ V}$$
   $$\Delta V = 48.0 - 42.75 = 5.25\text{ V}$$
   $$I_{\text{avail}} = \frac{5.25}{0.40} = 13.125\text{ A} < 30\text{ A}$$
   $$\tau = (0.095)(13.125) \approx 1.247\text{ N}\cdot\text{m}$$

**Final Answer:**
Stall torque is $2.85\text{ N}\cdot\text{m}$; no-load speed is $505.26\text{ rad/s}$; at $350\text{ rad/s}$, torque is $2.85\text{ N}\cdot\text{m}$, but by $450\text{ rad/s}$, torque drops to $1.25\text{ N}\cdot\text{m}$ due to back-EMF voltage clipping. $\blacksquare$

---

### Problem 3.2 (Worked Example): Gearbox Backlash Limit-Cycle Amplitude
**Problem Statement:** An actuator controls a load with moment of inertia $J_L = 0.05\text{ kg}\cdot\text{m}^2$ through a $1:1$ coupling with backlash half-width $\alpha = 0.01\text{ rad}$ ($0.573^\circ$). The controller is an ideal proportional feedback $\tau = -K_p \theta_L$ with $K_p = 50\text{ N}\cdot\text{m/rad}$.
If the motor shaft angle reverses velocity when passing through the dead-band, derive the limit cycle period $T_{\text{osc}}$ and peak velocity $\dot{\theta}_{\max}$ assuming energy conservation during dead-band traversal.

**Given Data:**
- $J_L = 0.05\text{ kg}\cdot\text{m}^2$
- $\alpha = 0.01\text{ rad}$
- $K_p = 50\text{ N}\cdot\text{m/rad}$

**Step-by-Step Derivation:**
1. In the contact region ($|\theta_L| > \alpha$), the equation of motion is:
   $$J_L \ddot{\theta}_L + K_p (\theta_L - \alpha) = 0$$
   This is a harmonic oscillator with natural frequency:
   $$\omega_n = \sqrt{\frac{K_p}{J_L}} = \sqrt{\frac{50}{0.05}} = \sqrt{1000} \approx 31.623\text{ rad/s}$$
   Quarter-period in contact:
   $$t_{\text{contact}} = \frac{\pi}{2 \omega_n} = \frac{\pi}{2(31.623)} \approx 0.04967\text{ s}$$
2. In the dead-band region ($|\theta_L| \le \alpha$), torque is zero:
   $$J_L \ddot{\theta}_L = 0 \implies \dot{\theta}_L = \text{const} = v_0$$
   Traversing the full dead-band width of $2\alpha = 0.02\text{ rad}$ at constant velocity $v_0$ takes time:
   $$t_{\text{deadband}} = \frac{2\alpha}{v_0}$$
3. Energy balance:
   Maximum potential energy in contact equals kinetic energy in dead-band:
   $$\frac{1}{2} K_p X_{\max}^2 = \frac{1}{2} J_L v_0^2 \implies v_0 = X_{\max} \sqrt{\frac{K_p}{J_L}} = X_{\max} \omega_n$$
   If the limit cycle has contact amplitude $X_{\max} = 0.005\text{ rad}$:
   $$v_0 = (0.005)(31.623) \approx 0.1581\text{ m/s}$$
   Dead-band traversal time:
   $$t_{\text{deadband}} = \frac{0.02}{0.1581} \approx 0.1265\text{ s}$$
4. Total limit cycle period:
   $$T_{\text{osc}} = 2 t_{\text{contact}} + 2 t_{\text{deadband}} = 2(0.04967) + 2(0.1265) \approx 0.0993 + 0.2530 = 0.3523\text{ s}$$
   Oscillation frequency:
   $$f_{\text{osc}} = \frac{1}{T_{\text{osc}}} \approx 2.84\text{ Hz}$$

**Final Answer:**
The system establishes a self-sustained limit cycle with oscillation frequency $f_{\text{osc}} \approx 2.84\text{ Hz}$ and peak dead-band crossing velocity $v_0 \approx 0.158\text{ rad/s}$. $\blacksquare$

---

### Problem 3.3 (Worked Example): Steady-State Motor Temperature Rise and Derating
**Problem Statement:** A robot knee actuator delivers continuous RMS torque $\tau_{\text{rms}} = 18\text{ N}\cdot\text{m}$. The motor has torque constant $K_{t0} = 0.80\text{ N}\cdot\text{m/A}$, initial resistance $R_0 = 1.2\ \Omega$ at ambient $T_{\text{amb}} = 25^\circ\text{C}$, thermal resistance $R_{\text{th}} = 1.8\text{ K/W}$, and copper temperature coefficient $\alpha_{\text{Cu}} = 0.00393\text{ K}^{-1}$.
Formulate the coupled thermal equation and solve for the steady-state coil temperature $T_c^*$.

**Given Data:**
- $\tau_{\text{rms}} = 18\text{ N}\cdot\text{m}$
- $K_{t0} = 0.80\text{ N}\cdot\text{m/A}$
- $R_0 = 1.2\ \Omega$ at $T_{\text{amb}} = 25^\circ\text{C}$
- $R_{\text{th}} = 1.8\text{ K/W}$
- $\alpha_{\text{Cu}} = 0.00393\text{ K}^{-1}$

**Step-by-Step Derivation:**
1. Motor RMS current required to produce $\tau_{\text{rms}}$:
   $$I_{\text{rms}} = \frac{\tau_{\text{rms}}}{K_t} = \frac{18}{0.80} = 22.5\text{ A}$$
2. Heat dissipation power as a function of temperature $T_c$:
   $$P_{\text{loss}}(T_c) = I_{\text{rms}}^2 R_w(T_c) = I_{\text{rms}}^2 R_0 [1 + \alpha_{\text{Cu}} (T_c - T_{\text{amb}})]$$
   $$(22.5)^2 \times 1.2 = 506.25 \times 1.2 = 607.5\text{ W at } 25^\circ\text{C}$$
   $$P_{\text{loss}}(T_c) = 607.5 [1 + 0.00393 (T_c - 25)] = 607.5 + 2.387475 (T_c - 25)\text{ W}$$
3. Thermal equilibrium condition:
   $$T_c - T_{\text{amb}} = R_{\text{th}} P_{\text{loss}}(T_c)$$
   $$T_c - 25 = 1.8 [607.5 + 2.387475 (T_c - 25)]$$
   $$T_c - 25 = 1093.5 + 4.297455 (T_c - 25)$$
   Notice the coefficient: $1 - 4.297455 = -3.297 < 0$!
   This indicates **thermal runaway**: heat generation increases faster than convective dissipation!
4. What is the maximum continuous current $I_{\text{crit}}$ to avoid thermal runaway?
   Condition for thermal stability:
   $$\frac{\partial P_{\text{loss}}}{\partial T_c} \cdot R_{\text{th}} < 1 \implies I^2 R_0 \alpha_{\text{Cu}} R_{\text{th}} < 1$$
   $$I_{\text{crit}} = \sqrt{\frac{1}{R_0 \alpha_{\text{Cu}} R_{\text{th}}}} = \sqrt{\frac{1}{1.2 \times 0.00393 \times 1.8}} = \sqrt{\frac{1}{0.0084888}} = \sqrt{117.80} \approx 10.85\text{ A}$$
   Maximum sustainable continuous torque:
   $$\tau_{\text{cont, max}} = K_t I_{\text{crit}} = 0.80 \times 10.85 \approx 8.68\text{ N}\cdot\text{m}$$
5. Now evaluate steady-state temperature for safe current $I = 8.0\text{ A}$ ($\tau = 6.4\text{ N}\cdot\text{m}$):
   $$I^2 R_0 = (64)(1.2) = 76.8\text{ W}$$
   $$\Delta T = \frac{R_{\text{th}} I^2 R_0}{1 - R_{\text{th}} I^2 R_0 \alpha_{\text{Cu}}} = \frac{1.8 \times 76.8}{1 - 1.8 \times 76.8 \times 0.00393} = \frac{138.24}{1 - 0.5433} = \frac{138.24}{0.4567} \approx 302.7\text{ K}$$
   $$T_c^* = 25 + 302.7 = 327.7^\circ\text{C}$$

**Final Answer:**
Demanding continuous $18\text{ N}\cdot\text{m}$ causes immediate thermal runaway ($I = 22.5\text{ A} > I_{\text{crit}} \approx 10.85\text{ A}$). The physical motor can safely sustain at most $\sim 8.68\text{ N}\cdot\text{m}$ continuously without liquid cooling. Policies assuming infinite thermal capacity will burn the stator windings within seconds. $\blacksquare$

---

### Problem 3.4 (Worked Example): Series Elastic Actuator (SEA) Natural Frequency and Deflection
**Problem Statement:** A Series Elastic Actuator (SEA) places an elastic spring with torsional stiffness $K_s = 400\text{ N}\cdot\text{m/rad}$ between the gearbox output $\theta_m$ and the robot link inertia $J_L = 0.08\text{ kg}\cdot\text{m}^2$. The motor rotor plus gearbox inertia referred to the output is $J_m = 0.02\text{ kg}\cdot\text{m}^2$.
Compute:
1. The anti-resonance frequency $\omega_{\text{anti}}$ and resonance frequency $\omega_{\text{res}}$ of the system.
2. The maximum elastic deflection $\Delta\theta_s$ under a peak payload torque $\tau_{\text{peak}} = 35\text{ N}\cdot\text{m}$.

**Given Data:**
- $K_s = 400\text{ N}\cdot\text{m/rad}$
- $J_L = 0.08\text{ kg}\cdot\text{m}^2$
- $J_m = 0.02\text{ kg}\cdot\text{m}^2$
- $\tau_{\text{peak}} = 35\text{ N}\cdot\text{m}$

**Step-by-Step Derivation:**
1. Dynamic equations of motion:
   $$J_m \ddot{\theta}_m + K_s(\theta_m - \theta_L) = \tau_{\text{motor}}$$
   $$J_L \ddot{\theta}_L - K_s(\theta_m - \theta_L) = 0$$
2. Anti-resonance frequency (frequency where motor input torque produces zero motor motion because the link acts as a dynamic vibration absorber):
   $$\omega_{\text{anti}} = \sqrt{\frac{K_s}{J_L}} = \sqrt{\frac{400}{0.08}} = \sqrt{5000} \approx 70.71\text{ rad/s} \quad (11.25\text{ Hz})$$
3. Resonance frequency (modal frequency of the combined two-inertia system):
   $$\omega_{\text{res}} = \sqrt{K_s \left( \frac{1}{J_m} + \frac{1}{J_L} \right)} = \sqrt{400 \left( \frac{1}{0.02} + \frac{1}{0.08} \right)} = \sqrt{400 (50 + 12.5)} = \sqrt{400 \times 62.5} = \sqrt{25000} = 158.11\text{ rad/s} \quad (25.16\text{ Hz})$$
4. Maximum elastic deflection under peak torque:
   $$\tau = K_s \Delta\theta_s \implies \Delta\theta_s = \frac{\tau_{\text{peak}}}{K_s} = \frac{35}{400} = 0.0875\text{ radians} \approx 5.01^\circ$$

**Final Answer:**
Anti-resonance is at $\omega_{\text{anti}} \approx 70.71\text{ rad/s}$ ($11.25\text{ Hz}$), resonance is at $\omega_{\text{res}} \approx 158.11\text{ rad/s}$ ($25.16\text{ Hz}$), and peak torque induces a spring deflection of $\Delta\theta_s \approx 0.0875\text{ rad}$ ($5.01^\circ$). Simulators assuming infinite stiffness fail to model this $5^\circ$ deflection. $\blacksquare$

---

### Problem 3.5 (Worked Example): Critical Damping Condition for Low-Level Joint PD Control
**Problem Statement:** A robot joint has effective link inertia $J = 0.12\text{ kg}\cdot\text{m}^2$ and internal viscous friction $B = 0.05\text{ N}\cdot\text{m}\cdot\text{s/rad}$. A low-level PD controller is implemented:
$$\tau = K_p (q_{\text{des}} - q) - K_d \dot{q}$$
If proportional gain is set to $K_p = 180\text{ N}\cdot\text{m/rad}$, determine the required derivative gain $K_d$ to achieve critical damping ($\zeta = 1.0$) and find the resulting settling time $t_s$ ($2\%$ criterion).

**Given Data:**
- $J = 0.12\text{ kg}\cdot\text{m}^2$
- $B = 0.05\text{ N}\cdot\text{m}\cdot\text{s/rad}$
- $K_p = 180\text{ N}\cdot\text{m/rad}$
- $\zeta = 1.0$

**Step-by-Step Derivation:**
1. Closed-loop equation of motion:
   $$J \ddot{q} + (B + K_d) \dot{q} + K_p q = K_p q_{\text{des}}$$
   $$\ddot{q} + \left(\frac{B + K_d}{J}\right) \dot{q} + \left(\frac{K_p}{J}\right) q = \left(\frac{K_p}{J}\right) q_{\text{des}}$$
2. Standard second-order form: $\ddot{q} + 2\zeta \omega_n \dot{q} + \omega_n^2 q = \omega_n^2 q_{\text{des}}$.
   Natural frequency:
   $$\omega_n = \sqrt{\frac{K_p}{J}} = \sqrt{\frac{180}{0.12}} = \sqrt{1500} \approx 38.73\text{ rad/s}$$
3. Damping ratio:
   $$2\zeta \omega_n = \frac{B + K_d}{J} \implies K_d = 2\zeta \omega_n J - B$$
   For $\zeta = 1.0$:
   $$K_d = 2(1.0)(38.73)(0.12) - 0.05 = 9.2952 - 0.05 \approx 9.245\text{ N}\cdot\text{m}\cdot\text{s/rad}$$
4. Settling time for critically damped system ($\approx 4 / \omega_n$):
   $$t_s \approx \frac{4.75}{\omega_n} = \frac{4.75}{38.73} \approx 0.1226\text{ s} = 122.6\text{ ms}$$

**Final Answer:**
Critical damping requires $K_d \approx 9.25\text{ N}\cdot\text{m}\cdot\text{s/rad}$, producing a monotonic step response with settling time $t_s \approx 123\text{ ms}$ and zero overshoot. $\blacksquare$

---

### Problem 3.6 (Worked Example): Current Loop Bandwidth vs PWM Slew Rate Limit
**Problem Statement:** A three-phase inverter switches at $f_{\text{pwm}} = 20\text{ kHz}$ with DC bus voltage $V_{\text{bus}} = 24\text{ V}$. The motor has phase inductance $L = 80\text{ }\mu\text{H}$ and phase resistance $R = 0.15\ \Omega$.
Compute:
1. The maximum theoretical current slew rate $\left(\frac{di}{dt}\right)_{\max}$ at zero speed.
2. The minimum time $t_{\text{rise}}$ required to step the current from $0\text{ A}$ to $20\text{ A}$.

**Given Data:**
- $V_{\text{bus}} = 24\text{ V}$
- $L = 80\text{ }\mu\text{H} = 8.0 \times 10^{-5}\text{ H}$
- $R = 0.15\ \Omega$
- $\Delta I = 20\text{ A}$

**Step-by-Step Derivation:**
1. Voltage differential equation:
   $$V_{\text{bus}} = L \frac{di}{dt} + R i$$
   At $i = 0$, resistive drop is zero:
   $$\left(\frac{di}{dt}\right)_{\max} = \frac{V_{\text{bus}}}{L} = \frac{24}{8.0 \times 10^{-5}} = 300,000\text{ A/s} = 300\text{ A/ms}$$
2. Exact exponential step response:
   $$i(t) = I_{\infty} (1 - e^{-t / \tau_e})$$
   where $I_{\infty} = \frac{V_{\text{bus}}}{R} = \frac{24}{0.15} = 160\text{ A}$, and $\tau_e = \frac{L}{R} = \frac{8.0 \times 10^{-5}}{0.15} \approx 5.333 \times 10^{-4}\text{ s} = 0.533\text{ ms}$.
3. Solve for $t_{\text{rise}}$ where $i(t_{\text{rise}}) = 20\text{ A}$:
   $$20 = 160 (1 - e^{-t / \tau_e}) \implies 1 - e^{-t / \tau_e} = \frac{20}{160} = 0.125$$
   $$e^{-t / \tau_e} = 0.875 \implies -\frac{t}{\tau_e} = \ln(0.875) \approx -0.13353$$
   $$t_{\text{rise}} = 0.13353 \times 0.5333\text{ ms} \approx 0.0712\text{ ms} = 71.2\text{ }\mu\text{s}$$
4. Compare with PWM period:
   $$T_{\text{pwm}} = \frac{1}{20\text{ kHz}} = 50\text{ }\mu\text{s}$$
   The current step requires $71.2 / 50 \approx 1.42\text{ PWM cycles}$.

**Final Answer:**
Maximum slew rate is $300\text{ A/ms}$, and reaching $20\text{ A}$ requires $71.2\text{ }\mu\text{s}$ ($\sim 1.4\text{ PWM cycles}$), confirming that low-inductance outrunner motors achieve sub-millisecond torque step responses. $\blacksquare$

---

### Problem 3.7 (Worked Example): Harmonic Drive Kinematic Ripple and Friction Torque
**Problem Statement:** A 100:1 harmonic drive gearbox exhibits a cyclic transmission error (kinematic ripple) $\Delta\theta = A_{\text{ripple}} \sin(2 N \theta_{\text{out}})$ with amplitude $A_{\text{ripple}} = 5.0 \times 10^{-4}\text{ rad}$ ($1.72\text{ arcmin}$) due to flexspline elliptical tooth engagement.
When the output shaft rotates at constant speed $\dot{\theta}_{\text{out}} = 2.0\text{ rad/s}$, compute the frequency $f_{\text{ripple}}$ and amplitude of the parasitic acceleration disturbance $\ddot{\theta}_{\text{ripple}}$.

**Given Data:**
- Gear ratio $N = 100$
- $A_{\text{ripple}} = 5.0 \times 10^{-4}\text{ rad}$
- $\dot{\theta}_{\text{out}} = 2.0\text{ rad/s}$

**Step-by-Step Derivation:**
1. Position error as a function of time:
   $$\theta_{\text{out}}(t) = \omega_0 t \implies \Delta\theta(t) = A_{\text{ripple}} \sin(2 N \omega_0 t)$$
2. The fundamental ripple frequency is:
   $$\omega_{\text{ripple}} = 2 N \omega_0 = 2(100)(2.0) = 400\text{ rad/s}$$
   In Hertz:
   $$f_{\text{ripple}} = \frac{\omega_{\text{ripple}}}{2\pi} = \frac{400}{2\pi} \approx 63.66\text{ Hz}$$
3. Parasitic velocity disturbance:
   $$\Delta\dot{\theta}(t) = A_{\text{ripple}} \omega_{\text{ripple}} \cos(\omega_{\text{ripple}} t) = (5.0 \times 10^{-4})(400) \cos(400 t) = 0.20 \cos(400 t)\text{ rad/s}$$
4. Parasitic acceleration disturbance:
   $$\Delta\ddot{\theta}(t) = -A_{\text{ripple}} \omega_{\text{ripple}}^2 \sin(\omega_{\text{ripple}} t) = -(5.0 \times 10^{-4})(400)^2 \sin(400 t) = -(5.0 \times 10^{-4})(160,000) \sin(400 t) = -80.0 \sin(400 t)\text{ rad/s}^2$$

**Final Answer:**
Harmonic drive elliptical engagement produces a high-frequency vibration at $63.66\text{ Hz}$ with parasitic acceleration amplitude $80.0\text{ rad/s}^2$. On physical arms, this excites link structural resonances, corrupting IMU readings and degrading precision trajectory tracking. $\blacksquare$

---

### Problem 3.8 (Worked Example): Planetary Gearbox Reflected Inertia and Efficiency
**Problem Statement:** A robotic leg uses a BLDC motor with rotor inertia $J_m = 1.5 \times 10^{-4}\text{ kg}\cdot\text{m}^2$ driving a joint through a planetary gearbox with ratio $N = 9:1$ and forward efficiency $\eta = 88\%$.
Compute:
1. The reflected rotor inertia $J_{\text{refl}}$ seen at the joint output.
2. The required motor torque $\tau_m$ to accelerate a joint load of $J_L = 0.05\text{ kg}\cdot\text{m}^2$ at $\ddot{q} = 150\text{ rad/s}^2$.

**Given Data:**
- $J_m = 1.5 \times 10^{-4}\text{ kg}\cdot\text{m}^2$
- $N = 9$
- $\eta = 0.88$
- $J_L = 0.05\text{ kg}\cdot\text{m}^2$
- $\ddot{q} = 150\text{ rad/s}^2$

**Step-by-Step Derivation:**
1. Reflected inertia formula:
   Rotor angular acceleration is $\ddot{\theta}_m = N \ddot{q}$.
   The effective inertia of the rotor reflected to the output link is:
   $$J_{\text{refl}} = N^2 J_m = (9)^2 (1.5 \times 10^{-4}) = 81 \times 1.5 \times 10^{-4} = 0.01215\text{ kg}\cdot\text{m}^2$$
2. Total effective inertia seen at output:
   $$J_{\text{total}} = J_L + J_{\text{refl}} = 0.05 + 0.01215 = 0.06215\text{ kg}\cdot\text{m}^2$$
3. Required output joint torque:
   $$\tau_{\text{joint}} = J_{\text{total}} \ddot{q} = (0.06215)(150) = 9.3225\text{ N}\cdot\text{m}$$
4. Required motor torque accounting for transmission efficiency:
   $$\tau_m = \frac{\tau_{\text{joint}}}{\eta N} = \frac{9.3225}{(0.88)(9)} = \frac{9.3225}{7.92} \approx 1.177\text{ N}\cdot\text{m}$$

**Final Answer:**
Reflected rotor inertia is $0.01215\text{ kg}\cdot\text{m}^2$ ($19.5\%$ of total joint inertia), and the motor must output $\tau_m \approx 1.177\text{ N}\cdot\text{m}$ to accelerate the joint at $150\text{ rad/s}^2$. $\blacksquare$

---

### Problem 3.9 (Worked Example): Joint Torque Derivative Limit (Slew Rate Clipping)
**Problem Statement:** A high-level policy demands a step torque change from $\tau_{\text{old}} = 5\text{ N}\cdot\text{m}$ to $\tau_{\text{new}} = 45\text{ N}\cdot\text{m}$ across a $20\text{ ms}$ policy time step. To prevent mechanical shock and gearbox tooth shearing, low-level firmware enforces a torque slew rate limit $\dot{\tau}_{\max} = 800\text{ N}\cdot\text{m/s}$.
Determine:
1. The time $t_{\text{slew}}$ required to achieve the commanded torque.
2. The actual torque delivered after one policy step ($t = 20\text{ ms}$).

**Given Data:**
- $\tau_{\text{old}} = 5\text{ N}\cdot\text{m}$
- $\tau_{\text{new}} = 45\text{ N}\cdot\text{m}$
- $\Delta\tau = 40\text{ N}\cdot\text{m}$
- $\dot{\tau}_{\max} = 800\text{ N}\cdot\text{m/s}$
- $\Delta t_{\text{policy}} = 0.020\text{ s}$

**Step-by-Step Derivation:**
1. Slew time:
   $$t_{\text{slew}} = \frac{\Delta\tau}{\dot{\tau}_{\max}} = \frac{40\text{ N}\cdot\text{m}}{800\text{ N}\cdot\text{m/s}} = 0.050\text{ s} = 50\text{ ms}$$
2. Delivered torque at $t = 20\text{ ms}$:
   $$\tau(0.020) = \tau_{\text{old}} + \dot{\tau}_{\max} \Delta t_{\text{policy}} = 5.0 + (800)(0.020) = 5.0 + 16.0 = 21.0\text{ N}\cdot\text{m}$$
3. Tracking error at the end of the policy step:
   $$e_\tau = \tau_{\text{new}} - \tau(0.020) = 45.0 - 21.0 = 24.0\text{ N}\cdot\text{m}$$

**Final Answer:**
The torque transition takes $50\text{ ms}$ to complete. At the end of the $20\text{ ms}$ policy step, the actuator has only delivered $21.0\text{ N}\cdot\text{m}$ ($52.5\%$ of the commanded step), creating an unmodeled force deficit that causes simulated hopping robots to fail their jumps on real hardware. $\blacksquare$

---

### Problem 3.10 (Worked Example): Current Sensor Quantization and Derivative Noise
**Problem Statement:** A 12-bit Analog-to-Digital Converter (ADC) measures motor phase current over a full range of $[-40\text{ A}, +40\text{ A}]$ ($80\text{ A}$ span). Sampling occurs at $10\text{ kHz}$ ($T_s = 0.1\text{ ms}$).
Compute:
1. The current quantization resolution $\Delta I$.
2. The peak quantization-induced derivative noise $\left(\frac{di}{dt}\right)_{\text{noise}}$ when computing current slope via single-step backward differences.

**Given Data:**
- Full span $I_{\text{span}} = 80\text{ A}$
- $N_{\text{bits}} = 12 \implies 2^{12} = 4096$ levels
- $T_s = 1.0 \times 10^{-4}\text{ s}$

**Step-by-Step Derivation:**
1. Current quantization step size:
   $$\Delta I = \frac{I_{\text{span}}}{2^{12}} = \frac{80}{4096} \approx 0.01953\text{ A} = 19.53\text{ mA}$$
2. Worst-case quantization derivative noise:
   If consecutive samples fluctuate by 1 Least Significant Bit (LSB):
   $$\left(\frac{di}{dt}\right)_{\text{noise}} = \frac{\Delta I}{T_s} = \frac{0.01953\text{ A}}{1.0 \times 10^{-4}\text{ s}} = 195.3\text{ A/s}$$
3. Equivalent torque derivative noise (with $K_t = 0.1\text{ N}\cdot\text{m/A}$):
   $$\left(\frac{d\tau}{dt}\right)_{\text{noise}} = K_t \left(\frac{di}{dt}\right)_{\text{noise}} = (0.1)(195.3) = 19.53\text{ N}\cdot\text{m/s}$$

**Final Answer:**
A 1-LSB quantization toggle produces an artificial derivative spike of $195.3\text{ A/s}$ ($19.53\text{ N}\cdot\text{m/s}$), necessitating digital low-pass filtering (e.g., Butterworth or rolling average) in low-level motor firmware. $\blacksquare$

---

## 3.7 Solved Exercises (Problems 3.11 – 3.20)

---

### Problem 3.11 (Solved Exercise): Statically Indeterminate Gear Tooth Bending Stress
**Problem Statement:** Using the Lewis formula, compute the maximum bending stress $\sigma_b$ on a spur gear tooth delivering $30\text{ N}\cdot\text{m}$ torque with pitch radius $r_p = 25\text{ mm}$, tooth face width $b = 10\text{ mm}$, diametral pitch $P = 4\text{ mm}^{-1}$, and Lewis form factor $Y = 0.32$.

**Step-by-Step Solution:**
1. Tangential load on gear tooth:
   $$W_t = \frac{\tau}{r_p} = \frac{30\text{ N}\cdot\text{m}}{0.025\text{ m}} = 1200\text{ N}$$
2. Lewis bending stress formula:
   $$\sigma_b = \frac{W_t P}{b Y} = \frac{(1200\text{ N})(4 \times 10^3\text{ m}^{-1})}{(0.010\text{ m})(0.32)} = \frac{4.8 \times 10^6}{0.0032} = 1.50 \times 10^9\text{ Pa} = 1500\text{ MPa}$$
3. If tooth module $m = \frac{1}{P} = 2.5\text{ mm}$:
   $$\sigma_b = \frac{W_t}{b m Y} = \frac{1200}{(0.010)(0.0025)(0.32)} = \frac{1200}{8.0 \times 10^{-6}} = 150\text{ MPa} \quad \blacksquare$$

---

### Problem 3.12 (Solved Exercise): Motor Efficiency Map Peak Location
**Problem Statement:** A motor has copper loss $P_{\text{cu}} = I^2 R$ and iron core loss $P_{\text{fe}} = k_{\text{iron}} \omega_m^2$. For a fixed mechanical power output $P_{\text{mech}} = \tau \omega_m$, prove that maximum electrical-to-mechanical conversion efficiency occurs when copper loss equals iron core loss ($P_{\text{cu}} = P_{\text{fe}}$).

**Step-by-Step Solution:**
1. Total loss: $P_{\text{loss}} = P_{\text{cu}} + P_{\text{fe}} = \left(\frac{\tau}{K_t}\right)^2 R + k_{\text{iron}} \omega_m^2$.
2. For fixed $P_{\text{mech}} = \tau \omega_m$, substitute $\tau = \frac{P_{\text{mech}}}{\omega_m}$:
   $$P_{\text{loss}}(\omega_m) = \frac{P_{\text{mech}}^2 R}{K_t^2 \omega_m^2} + k_{\text{iron}} \omega_m^2$$
3. Take derivative with respect to $\omega_m^2$ and set to zero:
   $$\frac{\partial P_{\text{loss}}}{\partial (\omega_m^2)} = -\frac{P_{\text{mech}}^2 R}{K_t^2 (\omega_m^2)^2} + k_{\text{iron}} = 0 \implies \frac{P_{\text{cu}}}{\omega_m^2} = \frac{P_{\text{fe}}}{\omega_m^2} \implies P_{\text{cu}} = P_{\text{fe}} \quad \blacksquare$$

---

### Problem 3.13 (Solved Exercise): Actuator Cogging Torque Harmonic Identification
**Problem Statement:** A 12-slot, 14-pole permanent magnet motor exhibits cogging torque due to stator slot alignment. Determine the fundamental frequency harmonic order $N_{\text{cog}}$ of cogging torque per mechanical rotor revolution.

**Step-by-Step Solution:**
1. The number of cogging torque cycles per mechanical revolution equals the least common multiple (LCM) of the number of stator slots $N_s$ and rotor magnetic poles $N_p$:
   $$N_{\text{cog}} = \operatorname{LCM}(N_s, N_p)$$
2. For $N_s = 12$ and $N_p = 14$:
   $$12 = 2^2 \times 3$$
   $$14 = 2 \times 7$$
   $$\operatorname{LCM}(12, 14) = 2^2 \times 3 \times 7 = 84$$
3. Cogging torque cycles:
   $$N_{\text{cog}} = 84\text{ cycles per mechanical revolution} \quad \blacksquare$$

---

### Problem 3.14 (Solved Exercise): Thermal Time Constant of Actuator Enclosure
**Problem Statement:** A motor has thermal capacitance $C_{\text{th}} = 350\text{ J/K}$ and convective thermal resistance to ambient air $R_{\text{th}} = 0.8\text{ K/W}$. Find the thermal time constant $\tau_{\text{thermal}}$ in minutes, and determine how long it takes to reach $95\%$ of steady-state temperature under a continuous thermal load step.

**Step-by-Step Solution:**
1. Thermal time constant:
   $$\tau_{\text{thermal}} = R_{\text{th}} C_{\text{th}} = (0.8\text{ K/W})(350\text{ J/K}) = 280\text{ seconds} \approx 4.67\text{ minutes}$$
2. Reaching $95\%$ step response requires:
   $$1 - e^{-t / \tau} = 0.95 \implies e^{-t / \tau} = 0.05 \implies t_{95} = -\ln(0.05) \tau_{\text{thermal}} \approx 2.996 \times 280\text{ s} \approx 838.8\text{ s} \approx 13.98\text{ minutes} \quad \blacksquare$$

---

### Problem 3.15 (Solved Exercise): Quasi-Direct Drive (QDD) Impact Transparency
**Problem Statement:** Contrast the reflected inertia of a high-ratio industrial arm ($N_1 = 100$, $J_m = 10^{-4}\text{ kg}\cdot\text{m}^2$) with a QDD quadruped leg ($N_2 = 6$, $J_m = 10^{-4}\text{ kg}\cdot\text{m}^2$). Compute the ratio of impact forces delivered to the gear teeth during a sudden joint collision.

**Step-by-Step Solution:**
1. Reflected inertia scales with $N^2$:
   $$J_{\text{refl}, 1} = N_1^2 J_m = (100)^2 (10^{-4}) = 1.0\text{ kg}\cdot\text{m}^2$$
   $$J_{\text{refl}, 2} = N_2^2 J_m = (6)^2 (10^{-4}) = 3.6 \times 10^{-3}\text{ kg}\cdot\text{m}^2$$
2. Ratio of reflected inertias:
   $$\frac{J_{\text{refl}, 1}}{J_{\text{refl}, 2}} = \frac{1.0}{0.0036} \approx 277.8$$
3. Impact force during abrupt deceleration $\Delta\dot{q}$ over collision time $\Delta t$ is $F \approx \frac{J_{\text{refl}} \Delta\dot{q}}{r \Delta t}$.
   The $N = 100$ gearbox absorbs $278\times$ higher impact stress, making backdriving impossible and shattering gear teeth. $\blacksquare$

---

### Problem 3.16 (Solved Exercise): Inverter Dead-Time Distortion Voltage Error
**Problem Statement:** In a three-phase inverter, a dead-time $t_d = 1.5\text{ }\mu\text{s}$ is inserted between high-side and low-side switch transitions to prevent shoot-through. If switching frequency is $f_{\text{pwm}} = 25\text{ kHz}$ and DC bus is $V_{\text{bus}} = 48\text{ V}$, compute the magnitude of the fundamental voltage error $\Delta V_{\text{dist}}$ injected by dead-time.

**Step-by-Step Solution:**
1. Duty cycle lost per PWM cycle due to dead-time:
   $$\Delta d = 2 f_{\text{pwm}} t_d = 2(25,000)(1.5 \times 10^{-6}) = 0.075 = 7.5\%$$
2. Fundamental voltage distortion amplitude:
   $$\Delta V_{\text{dist}} = \frac{4}{\pi} V_{\text{bus}} f_{\text{pwm}} t_d = \frac{4}{\pi} (48)(25,000)(1.5 \times 10^{-6}) = \frac{4}{\pi} (1.8) \approx 2.292\text{ V} \quad \blacksquare$$

---

### Problem 3.17 (Solved Exercise): Anti-Windup Clamp for Low-Level Integral Control
**Problem Statement:** A PID joint controller has integral gain $K_i = 50\text{ N}\cdot\text{m/}(\text{rad}\cdot\text{s})$ and torque limit $\tau_{\max} = 20\text{ N}\cdot\text{m}$. If an unmodeled obstacle locks the joint with position error $e = 0.1\text{ rad}$, compute how many seconds before an unconstrained integrator accumulates $100\text{ N}\cdot\text{m}$ of phantom torque.

**Step-by-Step Solution:**
1. Integration rate:
   $$\frac{d\tau_I}{dt} = K_i e = (50)(0.1) = 5.0\text{ N}\cdot\text{m/s}$$
2. Time to accumulate $100\text{ N}\cdot\text{m}$:
   $$t = \frac{100\text{ N}\cdot\text{m}}{5.0\text{ N}\cdot\text{m/s}} = 20.0\text{ seconds}$$
3. When the obstacle is removed, the controller remains saturated at $+20\text{ N}\cdot\text{m}$ for $(100 - 20) / 5.0 = 16\text{ seconds}$ while the error reverses, causing catastrophic violent collision.
   Anti-windup clamping freezes integration whenever $\tau_{\text{cmd}} \ge \tau_{\max}$. $\blacksquare$

---

### Problem 3.18 (Solved Exercise): Cycloidal Drive Pin-Hole Clearance Backlash
**Problem Statement:** A cycloidal drive uses 12 pin rollers arranged on radius $R = 40\text{ mm}$. If machining tolerance produces a radial clearance $\Delta r = 15\text{ }\mu\text{m}$ between cycloidal disk lobes and pins, calculate the angular backlash $\alpha_{\text{backlash}}$ in arcminutes.

**Step-by-Step Solution:**
1. Angular clearance at pitch radius $R$:
   $$\alpha = \frac{\Delta r}{R} = \frac{15 \times 10^{-6}\text{ m}}{0.040\text{ m}} = 3.75 \times 10^{-4}\text{ radians}$$
2. Convert radians to arcminutes ($1\text{ rad} = \frac{180 \times 60}{\pi} \approx 3437.75\text{ arcmin}$):
   $$\alpha_{\text{arcmin}} = 3.75 \times 10^{-4} \times 3437.75 \approx 1.289\text{ arcminutes} \quad \blacksquare$$

---

### Problem 3.19 (Solved Exercise): Harmonic Resonance Spillover from Link Elasticity
**Problem Statement:** A flexible link has pinned-free structural vibration mode $\omega_{\text{link}} = 120\text{ rad/s}$. If the motor PD controller uses derivative gain $K_d$ that pushes closed-loop bandwidth to $\omega_{\text{cl}} = 150\text{ rad/s} > \omega_{\text{link}}$, explain why control spillover causes destructive instability.

**Step-by-Step Solution:**
1. The link transfer function contains a flexible resonance dipole:
   $$G_{\text{flex}}(s) = \frac{s^2 + 2\zeta_z \omega_z s + \omega_z^2}{s^2 + 2\zeta_p \omega_p s + \omega_p^2}$$
2. When the feedback loop bandwidth $\omega_{\text{cl}} > \omega_p$, the controller attempts to actively command frequencies beyond the structural mode.
3. High gain at $\omega = 120\text{ rad/s}$ injects energy directly into the elastic bending mode, driving structural damping ($\zeta_p \approx 0.01$) negative.
4. The system experiences **control spillover instability**, vibrating violently until link fatigue failure occurs. Loop bandwidth must be restricted to $\omega_{\text{cl}} \le \frac{1}{3} \omega_{\text{link}} \approx 40\text{ rad/s}$. $\blacksquare$

---

### Problem 3.20 (Solved Exercise): Field Weakening Regime for Extended Actuator Velocity
**Problem Statement:** In a BLDC motor running above base speed, negative direct-axis current $i_d < 0$ is injected to counteract rotor permanent magnet flux $\lambda_{\text{pm}} = 0.02\text{ Wb}$. If $L_d = 120\text{ }\mu\text{H}$, find the direct-axis current $i_d^*$ required to reduce total stator flux linkage by $40\%$.

**Step-by-Step Solution:**
1. Stator $d$-axis total flux linkage:
   $$\lambda_d = \lambda_{\text{pm}} + L_d i_d$$
2. Desired total flux:
   $$\lambda_d^* = (1 - 0.40) \lambda_{\text{pm}} = 0.60 \lambda_{\text{pm}} = (0.60)(0.02) = 0.012\text{ Wb}$$
3. Flux reduction:
   $$\Delta\lambda = \lambda_d^* - \lambda_{\text{pm}} = 0.012 - 0.020 = -0.008\text{ Wb}$$
4. Required field-weakening current:
   $$i_d^* = \frac{\Delta\lambda}{L_d} = \frac{-0.008\text{ Wb}}{120 \times 10^{-6}\text{ H}} = \frac{-8 \times 10^{-3}}{1.2 \times 10^{-4}} \approx -66.67\text{ A} \quad \blacksquare$$
