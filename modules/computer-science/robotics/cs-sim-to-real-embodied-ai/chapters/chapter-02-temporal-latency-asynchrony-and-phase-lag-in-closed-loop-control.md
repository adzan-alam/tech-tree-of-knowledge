# Chapter 2: Temporal Latency, Asynchrony, and Phase Lag in Closed-Loop Control

## 2.1 Introduction: Time as the Forgotten Physical Dimension

In the classical mathematical formulation of Reinforcement Learning (RL) and optimal control, time is treated as a sequence of clean, instantaneous discrete transitions:
$$s_{t+1} \sim \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

In a simulator, the environment pauses at time step $t$, hands the full observation $s_t$ to the policy $\pi(a_t \mid s_t)$, waits for the neural network to compute the action vector $a_t$, and then steps the numerical integrator forward by $\Delta t_{\text{sim}}$ to produce $s_{t+1}$. Inside this idealized clockwork, computation takes **zero physical time**. The action $a_t$ calculated from observation $s_t$ acts upon the world precisely at the instant $s_t$ was measured.

**On physical robotic hardware, this zero-time assumption is catastrophically false.**

Every physical action taken by a real-world robot is an action based on **stale historical information**:
1. Photons hitting a CMOS camera sensor require an integration/exposure time of $10\text{ to }33\text{ ms}$ before pixel readout begins.
2. The image frame must be serialized and transmitted over USB 3.0, MIPI CSI-2, or Gigabit Ethernet to host memory ($2\text{ to }10\text{ ms}$).
3. A deep vision backbone (e.g., ResNet, ViT, or PointNet) requires $5\text{ to }40\text{ ms}$ of GPU tensor core computation to infer the high-level policy.
4. The commanded joint target must be packetized into a Controller Area Network (CAN-bus) or EtherCAT frame and sent to distributed motor drivers ($1\text{ to }5\text{ ms}$).
5. The low-level motor driver runs a Field-Oriented Control (FOC) current loop, where winding inductance limits the current slew rate ($\frac{di}{dt} = \frac{V - K_e \omega}{L}$) and rotor inertia delays mechanical torque delivery ($2\text{ to }15\text{ ms}$).

By the time the robot's foot or wheel physically exerts torque on the ground, the robot's actual state $s_{\text{actual}}$ has drifted significantly away from the observed state $s_{\text{observed}}$ on which the decision was made.

In the frequency domain, a pure transport time delay $\tau$ injects an unavoidable negative phase shift:
$$\Delta\phi(\omega) = -\omega \tau \quad \text{radians}$$

At high dynamic frequencies $\omega$, this phase lag rapidly eats away the control loop's phase margin, turning negative feedback into **positive feedback**, which causes explosive limit-cycle oscillations, chatter, and physical hardware destruction.

---

## 2.2 The Physical Latency Budget

To design a sim-to-real transfer pipeline that survives physical deployment, one must perform an exhaustive accounting of the end-to-end latency budget across the cyber-physical stack.

```
+---------------------------------------------------------------------------------------------------+
|                            THE ROBOTIC LATENCY PIPELINE (END-TO-END)                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ Physical Event ]                                                                               |
|         │                                                                                         |
|         ▼                                                                                         |
|  1. Sensor Exposure & Readout (CMOS / ToF / IMU)                : 10.0 ms - 33.3 ms               |
|         │                                                                                         |
|         ▼                                                                                         |
|  2. Serialization & Host Bus Transfer (PCIe / USB 3 / MIPI)     :  1.5 ms -  5.0 ms               |
|         │                                                                                         |
|         ▼                                                                                         |
|  3. Neural Policy Inference (GPU / TensorRT / Edge TPU)         :  5.0 ms - 25.0 ms               |
|         │                                                                                         |
|         ▼                                                                                         |
|  4. Fieldbus Transmission to Inverters (EtherCAT / CAN-FD)      :  0.5 ms -  3.0 ms               |
|         │                                                                                         |
|         ▼                                                                                         |
|  5. Actuator Electrical Time Constant (tau_e = L / R)           :  0.2 ms -  1.5 ms               |
|         │                                                                                         |
|         ▼                                                                                         |
|  6. Mechanical Backlash Engagement & Rotor Acceleration         :  1.0 ms -  8.0 ms               |
|         │                                                                                         |
|         ▼                                                                                         |
|  [ Physical Torque Applied to Environment ]                                                       |
|                                                                                                   |
|  TOTAL END-TO-END DELAY (tau_total):                              18.2 ms - 75.8 ms               |
+---------------------------------------------------------------------------------------------------+
```

### 2.2.1 Component Breakdown

#### A. Sensor Integration & Readout Delay ($\tau_{\text{sens}}$)
For an optical camera operating at frame rate $f_s$, the sensor exposure time is $T_{\text{exp}} \le \frac{1}{f_s}$. The effective timestamp of the visual frame is not the end of exposure, but the temporal centroid of the photon integration:
$$t_{\text{effective}} = t_{\text{start}} + \frac{T_{\text{exp}}}{2}$$
Rolling shutter sensors introduce an additional intra-frame spatial latency gradient $\tau(y) = \frac{y}{H} T_{\text{readout}}$, where line $y$ of image height $H$ is exposed later than line 0.

#### B. Transport & Serialization Delay ($\tau_{\text{comm}}$)
Transferring raw camera frames ($1920 \times 1080 \times 3\text{ bytes} \approx 6.22\text{ MB}$) over Gigabit Ethernet takes:
$$\tau_{\text{net}} = \frac{6.22 \times 10^6 \times 8\text{ bits}}{10^9\text{ bps}} \approx 49.8\text{ ms}$$
This massive transport bottleneck necessitates onboard hardware encoding (H.264/JPEG), direct MIPI CSI-2 camera deserializers connected to the GPU memory bus via DMA (Direct Memory Access), or downsampling to low-resolution tensor inputs ($84 \times 84 \times 3 \approx 21.2\text{ KB} \Rightarrow 0.17\text{ ms}$).

#### C. Compute / Inference Delay ($\tau_{\text{inf}}$)
On edge embedded computers (e.g., NVIDIA Jetson AGX Orin, Xavier), neural network inference depends on batch size, precision (FP32 vs FP16 vs INT8), and model architecture:
- Lightweight MLP policy (2 layers, 256 units): $0.15\text{ ms}$ (CPU) / $0.08\text{ ms}$ (GPU).
- ConvNet vision policy (e.g., MobileNetV3 / ResNet-18): $4.5\text{ ms} - 12.0\text{ ms}$ (TensorRT FP16).
- Transformer / Vision-Language-Action (VLA) model: $35.0\text{ ms} - 150.0\text{ ms}$.

#### D. Actuator Fieldbus & Motor Dynamics ($\tau_{\text{act}}$)
High-performance quadrupeds and humanoids communicate joint torque commands via CAN-FD ($5\text{ Mbps}$) or EtherCAT ($100\text{ Mbps}$).
At $1\text{ kHz}$ EtherCAT cycle times, transmission jitter is bounded within $\pm 20\text{ }\mu\text{s}$. However, the motor's internal electrical dynamics governed by winding inductance $L$ and resistance $R$ impose a first-order lag:
$$L \frac{di(t)}{dt} + R i(t) = V(t) - K_e \omega_m(t)$$
with electrical time constant $\tau_e = \frac{L}{R}$.

---

## 2.3 Frequency-Domain Analysis: Continuous Delay and Phase Margin Degradation

To understand why latency destroys stability, consider a continuous linear time-invariant (LTI) plant $G(s)$ controlled by a feedback policy $K(s)$.
In the Laplace domain, a pure transport time delay $\tau$ corresponds to the irrational transfer function:
$$D(s) = e^{-s \tau}$$

The delayed open-loop transfer function is:
$$L_\tau(s) = K(s) G(s) e^{-s \tau}$$

### 2.3.1 Magnitude and Phase Characteristics
Evaluating $s = j\omega$:
$$|L_\tau(j\omega)| = |K(j\omega) G(j\omega)| \cdot |e^{-j\omega \tau}| = |L_0(j\omega)| \cdot 1$$
$$\angle L_\tau(j\omega) = \angle L_0(j\omega) - \omega \tau$$

The transport delay leaves the loop gain magnitude **completely unaltered** ($|e^{-j\omega\tau}| = 1$), but subtracts a phase that grows **linearly with frequency $\omega$**!

```
+---------------------------------------------------------------------------------------------------+
|                                BODE PHASE DEGRADATION UNDER DELAY                                 |
+---------------------------------------------------------------------------------------------------+
|  Phase (deg)                                                                                      |
|    0°  ────────────────────────────────────────── Nominal Phase Loop L_0(j\omega)                |
|        \                                                                                          |
|  -90°   \                                                                                         |
|          \  \                                                                                     |
| -180° ────\──\─────────────────────────────────── Instability Boundary (-180°)                   |
|            \  \                                                                                   |
|             \  \                                                                                  |
| -270°        \  \                                                                                 |
|               \  ▼ Phase with Delay: L_tau(j\omega) = L_0 - \omega * \tau                         |
|                ▼                                                                                  |
|               \omega_gc (Gain Crossover Frequency)                                                |
+---------------------------------------------------------------------------------------------------+
```

### 2.3.2 Destruction of the Phase Margin
The gain crossover frequency $\omega_{\text{gc}}$ is the frequency where the open-loop gain equals unity ($|L_0(j\omega_{\text{gc}})| = 1 = 0\text{ dB}$).
The nominal phase margin $\text{PM}_0$ is:
$$\text{PM}_0 = 180^\circ + \angle L_0(j\omega_{\text{gc}})$$

Under pure transport delay $\tau$, the new phase margin becomes:
$$\text{PM}_\tau = \text{PM}_0 - \omega_{\text{gc}} \tau \cdot \left(\frac{180^\circ}{\pi}\right)$$

If the delay exceeds the critical threshold:
$$\tau_{\text{crit}} = \frac{\text{PM}_0}{\omega_{\text{gc}}}$$
the phase margin drops below zero ($\text{PM}_\tau < 0$), and the closed-loop system poles cross into the unstable Right-Half Plane (RHP), causing unbounded divergent oscillations until hardware limits saturate or mechanical components shear!

---

## 2.4 Asynchronous vs Synchronous Execution: The Sim-to-Real Discrepancy

In robotics simulators, physics stepping and policy queries are strictly synchronous:
```python
# SIMULATOR SYNCHRONOUS LOOP
for step in range(N):
    obs = sim.get_observation()          # t = k * dt
    action = policy.forward(obs)         # Computed instantly
    sim.apply_action(action)             # Applied at t = k * dt
    sim.step_physics()                   # Advance to t = (k + 1) * dt
```

On real hardware, sensors, compute units, and actuators run on **independent, unsynchronized asynchronous hardware clocks**:

```
+---------------------------------------------------------------------------------------------------+
|                          ASYNCHRONOUS MULTI-RATE HARDWARE EXECUTION                               |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  IMU Clock (1000 Hz) : │──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│──│  |
|  Joint Encoders (500Hz): │────│────│────│────│────│────│────│────│────│────│────│────│────│────│  |
|  CAN-bus Output (500Hz): │────│────│────│────│────│────│────│────│────│────│────│────│────│────│  |
|  Vision Camera (30 Hz) : │───────────────────────│───────────────────────│───────────────────────│  |
|  GPU Policy (50 Hz)    : │─────────────────│─────────────────│─────────────────│─────────────────│  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 2.4.1 Jitter and Variable Delay
Hardware delay is rarely constant. Operating system thread scheduling, garbage collection, GPU driver preemption, and network collisions introduce stochastic **jitter**:
$$\tau_t = \bar{\tau} + \delta_t, \quad \delta_t \sim \mathcal{N}(0, \sigma_\tau^2)$$

When policies trained in deterministic simulators encounter stochastic timing jitter, the effective differential derivative $\frac{s_{t} - s_{t-1}}{\Delta t}$ undergoes extreme variance spikes, causing explosive high-gain actuator twitching.

---

## 2.5 Latency Mitigation Techniques in Sim-to-Real Transfer

To bridge the temporal reality gap, embodied AI uses four foundational strategies:

### 2.5.1 Explicit Delay Injection in Simulation
The most direct approach is to explicitly model latency during RL policy training:
1. Maintain a FIFO ring buffer of past actions:
   $$\mathcal{B}_{\text{act}} = [a_{t-k}, a_{t-k+1}, \dots, a_t]$$
2. During simulation step $t$, execute the delayed action $a_{t-D}$, where delay step $D \sim \mathcal{U}(D_{\min}, D_{\max})$ is randomized at each episode.
3. The neural policy learns to operate in an environment where control effects are lagged, naturally developing phase-lead compensation.

### 2.5.2 Action and Observation History Concatenation
Instead of feeding only the current observation $o_t$ to the policy, feed a temporal history window:
$$\tilde{o}_t = [o_t, o_{t-1}, \dots, o_{t-H}, a_{t-1}, a_{t-2}, \dots, a_{t-H}]$$
By observing both past actions and resulting delayed observations, the neural network implicitly learns the system's phase lag and acts as an internal state predictor.

### 2.5.3 Forward State Extrapolation (Predictive Compensation)
If the total latency $\tau$ is known, we can estimate the robot's *future* state $\hat{s}_{t+\tau}$ using an onboard analytical model or Kalman filter:
$$\hat{s}_{t+\tau} = s_t + \int_{t}^{t+\tau} f_{\text{model}}(\hat{s}(\sigma), a_{\text{buffer}}(\sigma)) d\sigma$$
The neural policy then evaluates the action on the predicted future state:
$$a_t = \pi(\hat{s}_{t+\tau})$$
When $a_t$ arrives at the physical motor at time $t+\tau$, the robot has reached state $\hat{s}_{t+\tau}$, neutralizing the phase lag.

---

## 2.6 Worked Examples (Problems 2.1 – 2.10)

---

### Problem 2.1 (Worked Example): Critical Latency Bound for a Feedback System
**Problem Statement:** A robot joint position control loop is modeled as a first-order velocity-controlled plant:
$$G(s) = \frac{K}{s(T s + 1)}$$
with gain $K = 20\text{ s}^{-1}$ and motor mechanical time constant $T = 0.05\text{ s}$. The controller is a simple proportional gain $K_p = 1.0$.
Compute the gain crossover frequency $\omega_{\text{gc}}$, the nominal phase margin $\text{PM}_0$, and determine the maximum allowable transport delay $\tau_{\max}$ before the closed-loop system goes unstable.

**Given Data:**
- $K = 20\text{ s}^{-1}$
- $T = 0.05\text{ s}$
- $K_p = 1.0$

**Step-by-Step Derivation:**
1. The open-loop transfer function is:
   $$L_0(s) = \frac{20}{s(0.05 s + 1)}$$
2. Find the gain crossover frequency $\omega_{\text{gc}}$ where $|L_0(j\omega)| = 1$:
   $$|L_0(j\omega)| = \frac{20}{\omega \sqrt{1 + (0.05 \omega)^2}} = 1$$
   Square both sides:
   $$\frac{400}{\omega^2 (1 + 0.0025 \omega^2)} = 1 \implies 0.0025 \omega^4 + \omega^2 - 400 = 0$$
   Let $u = \omega^2$:
   $$0.0025 u^2 + u - 400 = 0$$
   Solve via quadratic formula:
   $$u = \frac{-1 + \sqrt{1 + 4(0.0025)(400)}}{2(0.0025)} = \frac{-1 + \sqrt{1 + 4}}{0.005} = \frac{\sqrt{5} - 1}{0.005} \approx \frac{1.236068}{0.005} = 247.2136$$
   $$\omega_{\text{gc}} = \sqrt{247.2136} \approx 15.723\text{ rad/s}$$
3. Compute the nominal phase of $L_0(j\omega_{\text{gc}})$:
   $$\angle L_0(j\omega_{\text{gc}}) = -90^\circ - \arctan(0.05 \times 15.723) = -90^\circ - \arctan(0.78615)$$
   $$\arctan(0.78615) \approx 38.17^\circ \implies \angle L_0(j\omega_{\text{gc}}) = -90^\circ - 38.17^\circ = -128.17^\circ$$
4. Compute nominal phase margin $\text{PM}_0$:
   $$\text{PM}_0 = 180^\circ + (-128.17^\circ) = 51.83^\circ$$
   In radians:
   $$\text{PM}_0 = 51.83^\circ \times \frac{\pi}{180^\circ} \approx 0.9046\text{ radians}$$
5. Compute critical transport delay $\tau_{\max}$:
   $$\tau_{\max} = \frac{\text{PM}_0}{\omega_{\text{gc}}} = \frac{0.9046\text{ rad}}{15.723\text{ rad/s}} \approx 0.05753\text{ s} = 57.53\text{ ms}$$

**Final Answer:**
The gain crossover frequency is $\omega_{\text{gc}} \approx 15.72\text{ rad/s}$, the nominal phase margin is $\text{PM}_0 \approx 51.83^\circ$, and any transport delay exceeding $\tau_{\max} \approx 57.53\text{ ms}$ causes instability. $\blacksquare$

---

### Problem 2.2 (Worked Example): Phase Degradation at Multiple Operating Frequencies
**Problem Statement:** An autonomous quadruped robot executes a dynamic trotting gait with ground contact impact frequency $\omega_1 = 12.57\text{ rad/s}$ ($2\text{ Hz}$) and a high-frequency leg swing correction mode $\omega_2 = 62.83\text{ rad/s}$ ($10\text{ Hz}$).
If the total communication and compute latency is $\tau = 25\text{ ms}$, compute the phase lag injected by this delay at both frequencies in degrees.

**Given Data:**
- $\tau = 0.025\text{ s}$
- $\omega_1 = 12.57\text{ rad/s}$
- $\omega_2 = 62.83\text{ rad/s}$

**Step-by-Step Derivation:**
1. Phase lag formula for pure transport delay:
   $$\Delta\phi(\omega) = -\omega \tau\text{ radians} = -\omega \tau \cdot \frac{180^\circ}{\pi}\text{ degrees}$$
2. For $\omega_1 = 12.57\text{ rad/s}$:
   $$\Delta\phi(\omega_1) = -(12.57)(0.025) = -0.31425\text{ radians}$$
   $$\Delta\phi(\omega_1) = -0.31425 \times \frac{180^\circ}{\pi} \approx -18.00^\circ$$
3. For $\omega_2 = 62.83\text{ rad/s}$:
   $$\Delta\phi(\omega_2) = -(62.83)(0.025) = -1.57075\text{ radians}$$
   $$\Delta\phi(\omega_2) = -1.57075 \times \frac{180^\circ}{\pi} \approx -90.00^\circ$$

**Final Answer:**
At $2\text{ Hz}$, the phase lag is $-18.0^\circ$, whereas at $10\text{ Hz}$, the phase lag reaches a massive $-90.0^\circ$, completely wiping out typical control phase margins ($30^\circ - 60^\circ$) and destabilizing high-frequency trajectory tracking. $\blacksquare$

---

### Problem 2.3 (Worked Example): Padé Approximation Poles and Zeroes of Delay
**Problem Statement:** In classical control synthesis, the non-rational delay transfer function $e^{-s\tau}$ is approximated by a first-order rational Padé approximation:
$$R_{1,1}(s) = \frac{1 - \frac{\tau}{2} s}{1 + \frac{\tau}{2} s}$$
For a transport delay $\tau = 20\text{ ms}$, find the pole and zero locations in the complex $s$-plane. Explain why this creates a non-minimum phase system with inherent bandwidth limitations.

**Given Data:**
- $\tau = 0.020\text{ s}$

**Step-by-Step Derivation:**
1. Substitute $\tau = 0.020$ into $R_{1,1}(s)$:
   $$R_{1,1}(s) = \frac{1 - 0.01 s}{1 + 0.01 s} = \frac{-(s - 100)}{s + 100}$$
2. Find roots:
   - Pole: $s + 100 = 0 \implies p = -100\text{ rad/s}$ (Left-Half Plane, stable).
   - Zero: $s - 100 = 0 \implies z = +100\text{ rad/s}$ (Right-Half Plane, unstable zero).
3. System analysis:
   A zero in the Right-Half Plane (RHP) makes the system **non-minimum phase**.
   By Bode's Gain-Phase relationship, an RHP zero does not alter the gain curve compared to an LHP zero, but it adds negative phase lag ($\angle R_{1,1}(j\omega) = -2\arctan(\omega / 100)$).
   Furthermore, by Poisson's integral formula, an RHP zero imposes a fundamental upper bound on achievable closed-loop bandwidth:
   $$\omega_{\text{bandwidth}} \le \frac{z}{2} = \frac{100}{2} = 50\text{ rad/s}$$

**Final Answer:**
The Padé pole is at $s = -100\text{ rad/s}$ and the zero is at $s = +100\text{ rad/s}$ in the Right-Half Plane. This non-minimum phase zero introduces negative phase lag and bounds the maximum controllable bandwidth to below $50\text{ rad/s}$. $\blacksquare$

---

### Problem 2.4 (Worked Example): Discrete-Time State-Space Formulation of Integer Delay
**Problem Statement:** A continuous LTI robot system $\dot{x}(t) = A x(t) + B u(t)$ is discretized with sampling period $T_s = 10\text{ ms}$, resulting in discrete system matrices $A_d = e^{A T_s}$ and $B_d = \int_0^{T_s} e^{A \sigma} B d\sigma$.
If actuation is delayed by an exact integer number of time steps $d = 2$ ($20\text{ ms}$ delay), formulate the augmented state-space representation that recovers Markovian state transitions.

**Given Data:**
- State vector $x_k \in \mathbb{R}^n$
- Control input $u_k \in \mathbb{R}^m$
- Integer delay $d = 2$

**Step-by-Step Derivation:**
1. The delayed system dynamics are:
   $$x_{k+1} = A_d x_k + B_d u_{k-2}$$
2. To restore the standard first-order Markovian form $z_{k+1} = \tilde{A} z_k + \tilde{B} u_k$, augment the state with past control actions:
   $$z_k = \begin{bmatrix} x_k \\ u_{k-2} \\ u_{k-1} \end{bmatrix} \in \mathbb{R}^{n + 2m}$$
3. Write the transition equations:
   $$x_{k+1} = A_d x_k + B_d u_{k-2}$$
   $$u_{(k+1)-2} = u_{k-1}$$
   $$u_{(k+1)-1} = u_k$$
4. In augmented matrix form:
   $$\begin{bmatrix} x_{k+1} \\ u_{k-1} \\ u_k \end{bmatrix} = \begin{bmatrix} A_d & B_d & 0 \\ 0 & 0 & I_m \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} x_k \\ u_{k-2} \\ u_{k-1} \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ I_m \end{bmatrix} u_k$$

**Final Answer:**
The augmented state vector has dimension $n + 2m$, with augmented state matrix $\tilde{A} = \begin{bmatrix} A_d & B_d & 0 \\ 0 & 0 & I \\ 0 & 0 & 0 \end{bmatrix}$ and input matrix $\tilde{B} = \begin{bmatrix} 0 \\ 0 \\ I \end{bmatrix}$, enabling standard LQR and RL policy formulation under fixed integer delays. $\blacksquare$

---

### Problem 2.5 (Worked Example): Fractional Delay and Input Splitting
**Problem Statement:** A control loop has sampling period $T_s = 10\text{ ms}$. Actuation experiences a fractional delay $\tau = 14\text{ ms} = 1.4 T_s$, consisting of $d = 1$ full sample delay and a fractional delay $\delta = 4\text{ ms} = 0.4 T_s$.
Derive the continuous-to-discrete state update equation expressing $x_{k+1}$ in terms of $x_k$, $u_{k-2}$, and $u_{k-1}$.

**Given Data:**
- $T_s = 10\text{ ms}$
- $\tau = 14\text{ ms} = T_s + \delta$ with $\delta = 4\text{ ms}$
- $\Delta = T_s - \delta = 6\text{ ms}$

**Step-by-Step Derivation:**
1. During the sampling interval $t \in [k T_s, (k+1) T_s]$, the delayed control signal applied to the robot changes value:
   - For $t \in [k T_s, k T_s + \delta]$ ($4\text{ ms}$ duration): the active control is $u(t - \tau) = u(t - 14\text{ ms}) = u_{k-2}$.
   - For $t \in [k T_s + \delta, (k+1) T_s]$ ($6\text{ ms}$ duration): the active control updates to $u_{k-1}$.
2. Continuous integration over the step:
   $$x_{k+1} = e^{A T_s} x_k + \int_0^{T_s} e^{A (T_s - \sigma)} B u(\sigma) d\sigma$$
3. Split the integral into the two intervals:
   $$x_{k+1} = e^{A T_s} x_k + \left( \int_0^\delta e^{A (T_s - \sigma)} d\sigma B \right) u_{k-2} + \left( \int_\delta^{T_s} e^{A (T_s - \sigma)} d\sigma B \right) u_{k-1}$$
4. Define fractional input matrices:
   $$\Gamma_1 = \int_{T_s - \delta}^{T_s} e^{A s} B ds = \int_6^{10} e^{A s} B ds$$
   $$\Gamma_0 = \int_0^{T_s - \delta} e^{A s} B ds = \int_0^6 e^{A s} B ds$$
   $$x_{k+1} = A_d x_k + \Gamma_1 u_{k-2} + \Gamma_0 u_{k-1}$$

**Final Answer:**
Fractional delay splits the control influence across adjacent time steps: $x_{k+1} = A_d x_k + \Gamma_1 u_{k-2} + \Gamma_0 u_{k-1}$, where $\Gamma_1 = \int_{T_s-\delta}^{T_s} e^{A s} B ds$ and $\Gamma_0 = \int_0^{T_s-\delta} e^{A s} B ds$. $\blacksquare$

---

### Problem 2.6 (Worked Example): Smith Predictor Delay Cancellation
**Problem Statement:** A continuous robotic arm joint is modeled as $G(s) = \frac{5}{s + 2}$ with known hardware transport delay $\tau = 50\text{ ms}$ ($G_p(s) = G(s) e^{-s \tau}$).
Design a Smith Predictor structure with a PI controller $C(s) = K_p + \frac{K_i}{s}$. Show mathematically that the delay $e^{-s \tau}$ is eliminated from the closed-loop characteristic denominator.

**Given Data:**
- Plant: $G(s) = \frac{5}{s + 2}$
- Delay: $\tau = 0.05\text{ s}$
- True delayed plant: $G_p(s) = G(s) e^{-s\tau}$

**Step-by-Step Derivation:**
1. A Smith Predictor uses an internal nominal model $\hat{G}(s)$ and nominal delay $\hat{\tau}$:
   - Simulated undelayed response: $\hat{y}_{\text{fast}}(s) = \hat{G}(s) U(s)$.
   - Simulated delayed response: $\hat{y}_{\text{delay}}(s) = \hat{G}(s) e^{-s \hat{\tau}} U(s)$.
2. The feedback signal returned to the controller is:
   $$y_{\text{fb}}(s) = y_{\text{actual}}(s) - \hat{y}_{\text{delay}}(s) + \hat{y}_{\text{fast}}(s)$$
3. Assuming a perfect model ($\hat{G}(s) = G(s)$ and $\hat{\tau} = \tau$):
   $$y_{\text{actual}}(s) = G(s) e^{-s\tau} U(s) = \hat{y}_{\text{delay}}(s)$$
   Therefore, the modeling discrepancy is zero:
   $$y_{\text{actual}}(s) - \hat{y}_{\text{delay}}(s) = 0 \implies y_{\text{fb}}(s) = \hat{y}_{\text{fast}}(s) = G(s) U(s)$$
4. Compute the closed-loop transfer function from reference $R(s)$ to actual output $Y(s)$:
   $$U(s) = C(s) [R(s) - y_{\text{fb}}(s)] = C(s) [R(s) - G(s) U(s)] \implies U(s) = \frac{C(s)}{1 + C(s) G(s)} R(s)$$
   $$Y(s) = G(s) e^{-s\tau} U(s) = \left( \frac{C(s) G(s)}{1 + C(s) G(s)} \right) e^{-s\tau} R(s)$$
5. The characteristic equation is:
   $$1 + C(s) G(s) = 0$$

**Final Answer:**
The closed-loop denominator $1 + C(s) G(s) = 0$ contains **zero delay terms**. The delay $e^{-s\tau}$ is shifted entirely outside the feedback loop as an innocuous pure output time delay on reference tracking, eliminating delay-induced instability. $\blacksquare$

---

### Problem 2.7 (Worked Example): Jitter Variance and Acceleration Noise
**Problem Statement:** A robot policy computes joint acceleration commands based on discrete finite differences:
$$a_k = \frac{v_k - v_{k-1}}{\Delta t_k}$$
Nominal sampling is $\overline{\Delta t} = 10\text{ ms}$. Due to thread scheduling jitter on a non-real-time Linux kernel, $\Delta t_k = \overline{\Delta t} + \epsilon_k$, where $\epsilon_k \sim \mathcal{N}(0, \sigma^2)$ with $\sigma = 1.0\text{ ms}$.
If the robot is moving at constant velocity $v = 1.0\text{ m/s}$ with velocity measurement noise $\sigma_v = 0.01\text{ m/s}$, compute the variance of the computed acceleration $\operatorname{Var}(a_k)$ using first-order error propagation.

**Given Data:**
- $v_k - v_{k-1} = \Delta v \approx 0$ (mean)
- $\sigma_v = 0.01\text{ m/s}$
- $\sigma_{\Delta v}^2 = \sigma_v^2 + \sigma_v^2 = 2 \times 10^{-4}\text{ m}^2/\text{s}^2$
- $\overline{\Delta t} = 0.01\text{ s}$
- $\sigma_t = 0.001\text{ s}$

**Step-by-Step Derivation:**
1. Acceleration estimator: $a = \frac{\Delta v}{\Delta t}$.
2. Taylor series expansion about $(\Delta \bar{v} = 0, \overline{\Delta t} = 0.01)$:
   $$\delta a \approx \frac{1}{\overline{\Delta t}} \delta(\Delta v) - \frac{\Delta \bar{v}}{\overline{\Delta t}^2} \delta(\Delta t)$$
   Since $\Delta \bar{v} = 0$:
   $$\operatorname{Var}(a) \approx \frac{\operatorname{Var}(\Delta v)}{\overline{\Delta t}^2} = \frac{2 \sigma_v^2}{\overline{\Delta t}^2} = \frac{2 \times 10^{-4}}{(0.01)^2} = \frac{2 \times 10^{-4}}{10^{-4}} = 2.0\text{ m}^2/\text{s}^4$$
3. Now consider a steady acceleration trajectory with $\Delta \bar{v} = 0.05\text{ m/s}$ ($a = 5\text{ m/s}^2$):
   $$\operatorname{Var}(a) \approx \frac{\operatorname{Var}(\Delta v)}{\overline{\Delta t}^2} + \frac{(\Delta \bar{v})^2}{\overline{\Delta t}^4} \sigma_t^2$$
   $$\frac{(\Delta \bar{v})^2}{\overline{\Delta t}^4} \sigma_t^2 = \frac{(0.05)^2}{(0.01)^4} (0.001)^2 = \frac{0.0025}{10^{-8}} \times 10^{-6} = 2.5 \times 10^5 \times 10^{-6} = 0.25\text{ m}^2/\text{s}^4$$
   $$\operatorname{Var}(a)_{\text{total}} = 2.0 + 0.25 = 2.25\text{ m}^2/\text{s}^4 \implies \sigma_a = 1.5\text{ m/s}^2$$

**Final Answer:**
Timing jitter compounds measurement error, producing an acceleration standard deviation of $\sigma_a = 1.5\text{ m/s}^2$ ($30\%$ of the commanded acceleration), which manifests on physical motors as violent acoustic hum and thermal dissipation. $\blacksquare$

---

### Problem 2.8 (Worked Example): Camera Rolling Shutter Geometric Distortion
**Problem Statement:** A mobile robot moves horizontally at speed $V_x = 2.0\text{ m/s}$ past a vertical lamppost at distance $Z = 1.5\text{ m}$. The onboard camera has focal length $f = 600\text{ pixels}$, image height $H = 1000\text{ pixels}$, and rolling shutter row-readout time $t_{\text{row}} = 30\text{ }\mu\text{s}$ (total frame readout $T_{\text{frame}} = 30\text{ ms}$).
Compute the slant angle $\theta_{\text{skew}}$ of the vertical post in the captured image.

**Given Data:**
- $V_x = 2.0\text{ m/s}$
- $Z = 1.5\text{ m}$
- $f = 600\text{ px}$
- $t_{\text{row}} = 30\text{ }\mu\text{s} = 3.0 \times 10^{-5}\text{ s/row}$

**Step-by-Step Derivation:**
1. Horizontal image coordinate of a point at world position $(X(t), Z)$ is given by perspective projection:
   $$x_p(t) = f \frac{X(t)}{Z}$$
2. In a rolling shutter camera, row $y$ is exposed at time $t(y) = y \cdot t_{\text{row}}$.
3. World position evolves as $X(t) = X_0 + V_x t = X_0 + V_x y t_{\text{row}}$.
4. Substitute into the projection formula:
   $$x_p(y) = f \frac{X_0 + V_x y t_{\text{row}}}{Z} = \frac{f X_0}{Z} + \left( \frac{f V_x t_{\text{row}}}{Z} \right) y$$
5. The apparent slope of the line in image coordinates $(dx_p / dy)$ is:
   $$\frac{dx_p}{dy} = \frac{f V_x t_{\text{row}}}{Z} = \frac{600 \times 2.0 \times 3.0 \times 10^{-5}}{1.5} = \frac{0.036}{1.5} = 0.024\text{ pixels/pixel}$$
6. The slant angle relative to the true vertical is:
   $$\theta_{\text{skew}} = \arctan\left(\frac{dx_p}{dy}\right) = \arctan(0.024) \approx 1.375^\circ$$
   Across the full image height of $1000\text{ pixels}$, the top and bottom of the post are sheared by $\Delta x = 1000 \times 0.024 = 24\text{ pixels}$.

**Final Answer:**
The rolling shutter induces a shear of $24\text{ pixels}$ from top to bottom, slanting the vertical post by $\theta_{\text{skew}} \approx 1.375^\circ$. In sim-to-real transfer, neural policies trained on global shutter synthetic renderings misestimate object distance and orientation by up to $15\%$. $\blacksquare$

---

### Problem 2.9 (Worked Example): High-Rate IMU Extrapolation of Low-Rate Camera Observations
**Problem Statement:** A vision-based policy outputs pose targets at $30\text{ Hz}$ ($T_{\text{cam}} = 33.33\text{ ms}$). Total vision pipeline latency is $\tau = 45\text{ ms}$. An onboard IMU provides linear acceleration measurements $a_{\text{imu}}$ at $1000\text{ Hz}$ ($T_{\text{imu}} = 1\text{ ms}$).
Derive the forward extrapolation equation for robot position $\hat{p}(t)$ that predicts the current state from the stale vision observation $p_{\text{cam}}(t - \tau)$ and recent IMU buffer $[a_{\text{imu}}(k)]$.

**Given Data:**
- Stale visual pose $p_{\text{cam}}(t - \tau)$ available at time $t$
- Latency duration $\tau = 45\text{ ms}$
- IMU data available at $t_k = t - \tau + k \cdot T_{\text{imu}}$ for $k = 1, \dots, N$ where $N = \frac{\tau}{T_{\text{imu}}} = 45$ steps

**Step-by-Step Derivation:**
1. State kinematics from $t - \tau$ to $t$:
   $$\hat{v}(t) = v(t - \tau) + \int_{t-\tau}^t (R(s) a_{\text{imu}}(s) + g) ds$$
   $$\hat{p}(t) = p(t - \tau) + \int_{t-\tau}^t \hat{v}(s) ds$$
2. Discretizing with trapezoidal numerical integration over the $N = 45$ IMU steps:
   For $k = 1, \dots, N$:
   $$\hat{v}_k = \hat{v}_{k-1} + \frac{T_{\text{imu}}}{2} (a_{\text{world}, k-1} + a_{\text{world}, k})$$
   $$\hat{p}_k = \hat{p}_{k-1} + \frac{T_{\text{imu}}}{2} (\hat{v}_{k-1} + \hat{v}_k)$$
   where $a_{\text{world}, k} = R_k a_{\text{imu}, k} + g$.
3. Setting initial condition $\hat{p}_0 = p_{\text{cam}}(t - \tau)$ and $\hat{v}_0 = v_{\text{cam}}(t - \tau)$:
   The final extrapolated state $\hat{p}_N = \hat{p}(t)$ advances the delayed visual measurement forward in time by $45\text{ ms}$.

**Final Answer:**
By integrating the $1000\text{ Hz}$ IMU strapdown buffer over $N = 45$ steps, the robot projects the $45\text{ ms}$ stale vision observation forward to the present instant, recovering the phase margin before passing the state to the RL actor. $\blacksquare$

---

### Problem 2.10 (Worked Example): Phase Lead Compensator Design for Delay Neutralization
**Problem Statement:** A feedback control loop has a known uncompensated transport delay $\tau = 15\text{ ms}$, operating at a critical frequency $\omega = 40\text{ rad/s}$.
Design a Lead Compensator:
$$D_{\text{lead}}(s) = \frac{1 + \alpha T s}{1 + T s}, \quad \alpha > 1$$
that injects maximum phase lead $\phi_{\max}$ exactly equal to the phase lag lost to delay at $\omega = 40\text{ rad/s}$. Compute $\alpha$ and $T$.

**Given Data:**
- $\tau = 0.015\text{ s}$
- $\omega = 40\text{ rad/s}$

**Step-by-Step Derivation:**
1. Calculate phase lag from delay:
   $$\Delta\phi = \omega \tau = (40)(0.015) = 0.60\text{ radians} = 0.60 \times \frac{180^\circ}{\pi} \approx 34.38^\circ$$
2. Set maximum lead angle:
   $$\phi_{\max} = 34.38^\circ$$
3. Formula for maximum phase lead of a lead network:
   $$\sin(\phi_{\max}) = \frac{\alpha - 1}{\alpha + 1}$$
   $$\sin(34.38^\circ) \approx 0.5646$$
   $$\frac{\alpha - 1}{\alpha + 1} = 0.5646 \implies \alpha - 1 = 0.5646 \alpha + 0.5646 \implies 0.4354 \alpha = 1.5646$$
   $$\alpha = \frac{1.5646}{0.4354} \approx 3.5935$$
4. The maximum phase lead occurs at the geometric mean frequency:
   $$\omega_{\max} = \frac{1}{T \sqrt{\alpha}} = 40\text{ rad/s}$$
   $$T = \frac{1}{40 \sqrt{3.5935}} = \frac{1}{40 \times 1.89565} = \frac{1}{75.826} \approx 0.01319\text{ s}$$
5. The lead zero is at $\frac{1}{\alpha T} = \frac{1}{(3.5935)(0.01319)} \approx 21.1\text{ rad/s}$.
   The lead pole is at $\frac{1}{T} = \frac{1}{0.01319} \approx 75.8\text{ rad/s}$.

**Final Answer:**
The lead compensator parameters are $\alpha \approx 3.59$ and $T \approx 0.0132\text{ s}$ ($D_{\text{lead}}(s) = \frac{1 + 0.0474 s}{1 + 0.0132 s}$), which injects $+34.38^\circ$ of phase lead at $40\text{ rad/s}$, precisely canceling the $15\text{ ms}$ delay phase loss. $\blacksquare$

---

## 2.7 Solved Exercises (Problems 2.11 – 2.20)

---

### Problem 2.11 (Solved Exercise): Nyquist Stability with Time Delay
**Problem Statement:** A continuous plant $G(s) = \frac{10}{s+1}$ is placed in negative unity feedback with a pure transport delay $\tau$. Using the Nyquist criterion, determine the exact crossover frequency $\omega_{\text{cross}}$ and the smallest delay $\tau^*$ that causes the Nyquist curve to encircle the critical point $(-1, j0)$.

**Step-by-Step Solution:**
1. Nyquist condition requires $|G(j\omega)| = 1$ for the critical crossing:
   $$|G(j\omega)| = \frac{10}{\sqrt{\omega^2 + 1}} = 1 \implies \omega^2 + 1 = 100 \implies \omega_{\text{cross}} = \sqrt{99} \approx 9.9499\text{ rad/s}$$
2. Nominal plant phase at $\omega_{\text{cross}}$:
   $$\angle G(j\omega_{\text{cross}}) = -\arctan(9.9499) \approx -84.26^\circ = -1.4706\text{ radians}$$
3. For instability, total phase must reach $-180^\circ$ ($-\pi$ radians):
   $$\angle G(j\omega_{\text{cross}}) - \omega_{\text{cross}} \tau^* = -\pi$$
   $$-1.4706 - 9.9499 \tau^* = -3.14159$$
   $$9.9499 \tau^* = 3.14159 - 1.4706 = 1.6710$$
   $$\tau^* = \frac{1.6710}{9.9499} \approx 0.1679\text{ s} = 167.9\text{ ms} \quad \blacksquare$$

---

### Problem 2.12 (Solved Exercise): Asynchronous Queue Packet Drop Probability
**Problem Statement:** An edge compute host receives camera observations at Poisson rate $\lambda = 30\text{ packets/s}$ into a single-slot buffer of size $B = 1$ (new images overwrite old ones if the GPU is busy). The GPU processes frames with exponential service rate $\mu = 40\text{ frames/s}$. Compute the fraction of dropped visual observations $P_{\text{drop}}$.

**Step-by-Step Solution:**
1. This is an $M/M/1/1$ queuing system (or $M/M/1/K$ with capacity $K = 1$).
2. Traffic intensity: $\rho = \frac{\lambda}{\mu} = \frac{30}{40} = 0.75$.
3. Steady-state probability of state $n = 1$ (system full):
   $$P_0 = \frac{1}{1 + \rho} = \frac{1}{1 + 0.75} = \frac{1}{1.75} = \frac{4}{7} \approx 0.5714$$
   $$P_1 = \frac{\rho}{1 + \rho} = \frac{0.75}{1.75} = \frac{3}{7} \approx 0.4286$$
4. Arriving packets that find the buffer occupied ($n = 1$) are dropped:
   $$P_{\text{drop}} = P_1 = \frac{3}{7} \approx 42.86\% \quad \blacksquare$$

---

### Problem 2.13 (Solved Exercise): Zero-Order Hold (ZOH) Effective Delay
**Problem Statement:** A continuous signal $u(t)$ is reconstructed from discrete samples $u_k$ using a standard Zero-Order Hold (ZOH) with sampling period $T_s$. Prove that for frequencies $\omega \ll \frac{2\pi}{T_s}$, the ZOH transfer function $G_{\text{ZOH}}(s) = \frac{1 - e^{-s T_s}}{s}$ introduces an effective transport delay of exactly $\tau_{\text{eff}} = \frac{T_s}{2}$.

**Step-by-Step Solution:**
1. Substitute $s = j\omega$ into $G_{\text{ZOH}}(s)$:
   $$G_{\text{ZOH}}(j\omega) = \frac{1 - e^{-j\omega T_s}}{j\omega} = \frac{e^{-j\omega T_s / 2} (e^{j\omega T_s / 2} - e^{-j\omega T_s / 2})}{j\omega}$$
2. Using Euler's identity $\sin(\theta) = \frac{e^{j\theta} - e^{-j\theta}}{2j}$:
   $$G_{\text{ZOH}}(j\omega) = e^{-j\omega T_s / 2} \frac{2j \sin(\omega T_s / 2)}{j\omega} = T_s \operatorname{sinc}\left(\frac{\omega T_s}{2\pi}\right) e^{-j\omega (T_s / 2)}$$
3. The phase of $G_{\text{ZOH}}(j\omega)$ is:
   $$\angle G_{\text{ZOH}}(j\omega) = -\omega \left(\frac{T_s}{2}\right)$$
4. Comparing with a pure delay $e^{-s \tau_{\text{eff}}}$ whose phase is $-\omega \tau_{\text{eff}}$:
   $$\tau_{\text{eff}} = \frac{T_s}{2} \quad \blacksquare$$

---

### Problem 2.14 (Solved Exercise): CAN-bus Frame Arbitration Delay
**Problem Statement:** A CAN 2.0B bus operates at $1\text{ Mbps}$. Standard data frames contain 130 bits. If a low-priority joint torque command must wait for an ongoing 130-bit telemetry frame to finish plus three higher-priority safety frames to transmit, compute the total arbitration delay $\tau_{\text{arb}}$.

**Step-by-Step Solution:**
1. Bit time on $1\text{ Mbps}$ bus: $T_{\text{bit}} = \frac{1}{10^6} = 1.0\text{ }\mu\text{s}$.
2. Transmission time for one 130-bit frame:
   $$T_{\text{frame}} = 130 \times 1.0\text{ }\mu\text{s} = 130\text{ }\mu\text{s}$$
3. Non-preemptive waiting: the low-priority frame must wait for the current frame to complete ($130\text{ }\mu\text{s}$) plus 3 higher-priority frames ($3 \times 130\text{ }\mu\text{s}$):
   $$\tau_{\text{arb}} = (1 + 3) \times 130\text{ }\mu\text{s} = 4 \times 130\text{ }\mu\text{s} = 520\text{ }\mu\text{s} = 0.52\text{ ms} \quad \blacksquare$$

---

### Problem 2.15 (Solved Exercise): Latency Randomization Upper Bound in RL Training
**Problem Statement:** An RL agent is trained with randomized action delay $D \sim \mathcal{U}\{0, 1, 2, \dots, D_{\max}\}$ time steps. If physical hardware has mean delay $\mu_D = 2.5$ steps and standard deviation $\sigma_D = 1.0$ steps, apply Chebyshev's inequality to choose $D_{\max}$ such that the probability of the physical robot encountering an un-modeled delay $D > D_{\max}$ is less than $5\%$.

**Step-by-Step Solution:**
1. Chebyshev's one-tailed inequality (Cantelli's inequality):
   $$P(X - \mu \ge k \sigma) \le \frac{1}{1 + k^2}$$
2. Set $\frac{1}{1 + k^2} = 0.05 \implies 1 + k^2 = 20 \implies k^2 = 19 \implies k = \sqrt{19} \approx 4.359$.
3. Compute threshold:
   $$D_{\max} = \mu_D + k \sigma_D = 2.5 + (4.359)(1.0) = 6.859 \implies D_{\max} = 7\text{ steps} \quad \blacksquare$$

---

### Problem 2.16 (Solved Exercise): Phase-Lead Limit of Continuous Observation Buffering
**Problem Statement:** A student policy observes a history buffer of length $H$: $O_t = [o_t, o_{t-1}, \dots, o_{t-H+1}]$. Prove that a linear combination $\hat{o}_{t+1} = \sum_{i=0}^{H-1} c_i o_{t-i}$ using backward differences of order $H-1$ achieves an approximation error of $\mathcal{O}(T_s^H)$.

**Step-by-Step Solution:**
1. Forward Taylor series: $o(t + T_s) = o(t) + T_s \dot{o}(t) + \frac{T_s^2}{2} \ddot{o}(t) + \dots + \frac{T_s^p}{p!} o^{(p)}(t) + \mathcal{O}(T_s^{p+1})$.
2. Backward finite differences $\nabla^k o_t$ provide unbiased estimators of $T_s^k o^{(k)}(t) + \mathcal{O}(T_s^{k+1})$.
3. Constructing the polynomial extrapolation through $H$ past points matches the first $H$ terms of the Taylor expansion.
4. The truncation remainder is the $(H)$-th derivative term:
   $$e(t + T_s) = \frac{T_s^H}{H!} o^{(H)}(\xi) = \mathcal{O}(T_s^H) \quad \blacksquare$$

---

### Problem 2.17 (Solved Exercise): Asynchronous Kalmman Filter Measurement Update with Out-of-Order Delay
**Problem Statement:** An EKF maintains state estimate $\hat{x}_t$ and covariance $P_t$. At time $t_2$, a delayed measurement $z_1$ arrives with timestamp $t_1 < t_2$. If $F$ is the state transition from $t_1$ to $t_2$, write the backward state correction equation that avoids re-filtering from $t_1$.

**Step-by-Step Solution:**
1. Let the innovation at time $t_1$ be:
   $$y_1 = z_1 - H \hat{x}_{t_1 \mid t_1}$$
2. By backward covariance propagation, the cross-covariance between state at $t_2$ and measurement at $t_1$ is:
   $$P_{x_2 z_1} = F(t_2, t_1) P_{t_1 \mid t_1} H^T$$
3. The out-of-sequence Kalman gain is:
   $$K_{\text{OOS}} = P_{x_2 z_1} [H P_{t_1 \mid t_1} H^T + R]^{-1} = F(t_2, t_1) K_1$$
4. The updated state at $t_2$ directly incorporates the delayed innovation:
   $$\hat{x}_{t_2}^+ = \hat{x}_{t_2}^- + K_{\text{OOS}} (z_1 - H \hat{x}_{t_1}^-) \quad \blacksquare$$

---

### Problem 2.18 (Solved Exercise): Gain Margin Degradation under Variable Ethernet Jitter
**Problem Statement:** A control system with loop transfer function $L_0(s) = \frac{4}{s(s+1)(s+2)}$ has nominal gain margin $\text{GM}_0 = 3.0$ ($9.54\text{ dB}$) at phase crossover frequency $\omega_{\text{pc}} = \sqrt{2}\text{ rad/s}$. If a variable network delay introduces a mean delay $\bar{\tau} = 100\text{ ms}$, find the new phase crossover frequency and the degraded gain margin.

**Step-by-Step Solution:**
1. Total phase with delay:
   $$\angle L_\tau(j\omega) = -90^\circ - \arctan(\omega) - \arctan(\omega / 2) - \omega \bar{\tau}$$
2. At $\omega = 1.0\text{ rad/s}$:
   $$\angle L_\tau(j 1) = -90^\circ - 45^\circ - 26.57^\circ - (1.0 \times 0.1 \times 180^\circ / \pi) = -161.57^\circ - 5.73^\circ = -167.30^\circ$$
3. At $\omega = 1.18\text{ rad/s}$:
   $$\angle L_\tau(j 1.18) \approx -90^\circ - 49.72^\circ - 30.54^\circ - 6.76^\circ \approx -177.02^\circ$$
4. Solving numerically gives $\omega_{\text{pc}}' \approx 1.21\text{ rad/s} < \sqrt{2} \approx 1.414\text{ rad/s}$.
5. Gain at new phase crossover:
   $$|L_0(j 1.21)| = \frac{4}{1.21 \sqrt{1 + 1.21^2} \sqrt{4 + 1.21^2}} = \frac{4}{1.21 \times 1.57 \times 2.34} = \frac{4}{4.445} \approx 0.900$$
   $$\text{GM}' = \frac{1}{0.900} \approx 1.111\text{ (down from 3.00!)} \quad \blacksquare$$

---

### Problem 2.19 (Solved Exercise): Forward Action Interpolation on Stale Setpoints
**Problem Statement:** A trajectory generator sends position setpoints $q_{\text{des}}$ every $20\text{ ms}$. If an EtherCAT communication cycle runs at $1\text{ ms}$ ($1\text{ kHz}$), show that applying a step-wise hold on $q_{\text{des}}$ creates infinite acceleration impulses, whereas cubic Hermite spline interpolation yields $C^1$-continuous velocity and bounded torque.

**Step-by-Step Solution:**
1. Under Zero-Order Hold:
   $$q(t) = q_k \implies \dot{q}(t) = 0 \text{ almost everywhere}$$
   At step transitions $t = k T$, position jumps $\Delta q = q_{k+1} - q_k$, so:
   $$\ddot{q}(t) = \Delta q \cdot \delta'(t - k T) \implies \text{Infinite acceleration impulse!}$$
2. Under Cubic Hermite Interpolation between $(q_k, \dot{q}_k)$ and $(q_{k+1}, \dot{q}_{k+1})$:
   $$q(u) = (2u^3 - 3u^2 + 1)q_k + (u^3 - 2u^2 + u)T \dot{q}_k + (-2u^3 + 3u^2)q_{k+1} + (u^3 - u^2)T \dot{q}_{k+1}$$
   where $u = \frac{t - k T}{T} \in [0, 1]$.
3. Velocity $\dot{q}(u)$ is quadratic and strictly continuous at endpoints $u = 0, 1$.
   Acceleration $\ddot{q}(u)$ is linear, bounded by $|\ddot{q}_{\max}| \le \frac{6 |q_{k+1} - q_k|}{T^2} + \frac{2 |\dot{q}_{k+1} + 2\dot{q}_k|}{T} < \infty$. $\blacksquare$

---

### Problem 2.20 (Solved Exercise): Teacher-Student Latency Asymmetry Proof
**Problem Statement:** In privileged teacher-student distillation, the teacher policy has zero latency access to true state $s_t$, while the student policy experiences latency $\tau > 0$ and observes $s_{t-\tau}$. If the optimal teacher action satisfies $a_t^* = -K s_t$, prove that the student's optimal linear policy minimizing MSE loss $\mathbb{E}[\|a_t^* - \hat{a}_t\|^2]$ requires an internal state forward predictor $\hat{s}_t = e^{A \tau} s_{t-\tau} + \int_0^\tau e^{A(\tau - \sigma)} B u(\sigma) d\sigma$.

**Step-by-Step Solution:**
1. The student policy minimizes the distillation loss:
   $$\min_{\pi_{\text{student}}} \mathbb{E}\left[ \| -K s_t - \pi_{\text{student}}(s_{t-\tau}, u_{[t-\tau:t]}) \|^2 \right]$$
2. By the Orthogonal Projection Theorem in Hilbert spaces, the optimal estimator is the conditional expectation:
   $$\pi_{\text{student}}^* = \mathbb{E}[ -K s_t \mid s_{t-\tau}, u_{[t-\tau:t]} ] = -K \mathbb{E}[s_t \mid s_{t-\tau}, u_{[t-\tau:t]}]$$
3. For deterministic LTI dynamics $\dot{s} = A s + B u$:
   $$s_t = e^{A \tau} s_{t-\tau} + \int_0^\tau e^{A(\tau - \sigma)} B u(t - \tau + \sigma) d\sigma$$
4. Since past inputs $u$ and past state $s_{t-\tau}$ are known, the conditional expectation equals the exact forward prediction $\hat{s}_t$.
   Thus, the student policy decomposes into $\pi_{\text{student}}^*(s_{t-\tau}) = \pi_{\text{teacher}}(\hat{s}_t)$. $\blacksquare$
