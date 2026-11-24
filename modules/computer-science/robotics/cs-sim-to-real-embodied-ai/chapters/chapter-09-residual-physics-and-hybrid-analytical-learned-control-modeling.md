# Chapter 9: Residual Physics and Hybrid Analytical-Learned Control Modeling

## 9.1 Introduction: The Folly of Re-learning Newton's Laws

A pervasive temptation in modern artificial intelligence is the pursuit of **pure end-to-end learning**:
$$\tau_t = \text{NeuralNetwork}(q_t, \dot{q}_t, q_{\text{target}})$$

In this paradigm, a deep neural network is tasked with mapping raw joint states directly to motor torques without any prior knowledge of physics. While theoretically universal by the Universal Approximation Theorem, pure end-to-end learning in physical robotics represents an extraordinary waste of sample efficiency and introduces grave physical hazards:
1. **Sample Inefficiency:** The neural network must consume millions of training samples merely to discover that gravity pulls downward ($\tau_g = m g l \cos q$), that mass has inertia ($\tau_I = I \ddot{q}$), and that centrifugal forces scale quadratically with angular velocity ($\tau_c \propto \dot{q}^2$).
2. **Catastrophic Out-of-Distribution Behavior:** If a pure neural policy encounters an unvisited corner of the state space, its output torque can suddenly flip sign or saturate, commanding destructive forces that shatter mechanical links.
3. **Absence of Safety and Stability Guarantees:** Pure black-box models provide zero analytical Lyapunov stability bounds.

Yet, classical analytical control (computed torque, inverse dynamics) has the opposite flaw: it assumes the CAD mathematical model is complete. It cannot model hydraulic hose stiffness, cable harness tension, gearbox micro-friction, motor thermal resistance, or unmodeled aerodynamic turbulence.

The resolution to this paradox is **Residual Physics (Hybrid Analytical-Learned Control)** (Johannink et al., 2019; Zeng et al., 2020; Ajay et al., 2019):

> *"Do not force a neural network to re-learn Newton's laws from scratch. Let classical analytical mechanics handle the 90% of dynamics governed by known physics, and task a specialized lightweight neural network with learning strictly the residual 10% discrepancy."*

```
+---------------------------------------------------------------------------------------------------+
|                        RESIDUAL PHYSICS HYBRID CONTROL ARCHITECTURE                               |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Desired Trajectory { q_des, qdot_des, qddot_des }                                              |
|         │                                                                                         |
|         ├───────────────────────────────────────────────┐                                         |
|         ▼                                               ▼                                         |
|    ┌─────────────────────────────────────────┐     ┌─────────────────────────────────────────┐     |
|    │  ANALYTICAL RIGID-BODY MODEL (90%):     │     │  LEARNED RESIDUAL COMPENSATOR (10%):    │     |
|    │  Recursive Newton-Euler (RNEA)          │     │  Lightweight MLP / Gaussian Process     │     |
|    │  tau_nominal = M(q)*qddot + C*qdot + g  │     │  tau_residual = pi_phi(q, qdot, qddot)  │     |
|    │  - Deterministic & Globally Stable      │     │  - Compensates unmodeled friction       │     |
|    │  - Captures dominant inertia & gravity  │     │  - Compensates cable drag & flexure     │     |
|    └─────────────────────────────────────────┘     └─────────────────────────────────────────┘     |
|         │                                               │                                         |
|         ▼                                               ▼                                         |
|       tau_nominal                                     tau_residual                                |
|         │                                               │                                         |
|         └───────────────────────┬───────────────────────┘                                         |
|                                 ▼                                                                 |
|    TOTAL TORQUE COMMAND:  tau_total = tau_nominal + tau_residual                                  |
|                                 │                                                                 |
|                                 ▼                                                                 |
|    [ Bounded Safety Projection ]: |tau_residual| <= tau_residual_max                              |
|                                 │                                                                 |
|                                 ▼                                                                 |
|    Physical Robot Plant ────► High-Precision Tracking with Formal Lyapunov Stability              |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 9.2 Mathematical Formulation of Residual Dynamics

The true physical dynamics of a robotic system are:
$$M_{\text{real}}(q) \ddot{q} + C_{\text{real}}(q, \dot{q}) \dot{q} + g_{\text{real}}(q) + \tau_{\text{unmodeled}}(q, \dot{q}, \ddot{q}, t) = \tau$$

We partition the system into a known nominal analytical model and an unknown residual discrepancy:
$$M_{\text{real}}(q) = M_0(q) + \Delta M(q)$$
$$C_{\text{real}}(q, \dot{q}) = C_0(q, \dot{q}) + \Delta C(q, \dot{q})$$
$$g_{\text{real}}(q) = g_0(q) + \Delta g(q)$$

The nominal inverse dynamics controller computes:
$$\tau_{\text{nominal}} = M_0(q) (\ddot{q}_{\text{des}} + K_p e + K_d \dot{e}) + C_0(q, \dot{q}) \dot{q} + g_0(q)$$
where $e = q_{\text{des}} - q$ is tracking error.

Applying this nominal torque to the real robot yields the error dynamics:
$$M_0(q) (\ddot{e} + K_d \dot{e} + K_p e) = \Delta M(q) \ddot{q} + \Delta C(q, \dot{q}) \dot{q} + \Delta g(q) + \tau_{\text{unmodeled}} \triangleq f_{\text{residual}}(q, \dot{q}, \ddot{q})$$

The residual compensator $f_\phi(q, \dot{q}, \ddot{q})$ is trained to approximate and cancel this unmodeled perturbation:
$$\tau_{\text{total}} = \tau_{\text{nominal}} + f_\phi(q, \dot{q}, \ddot{q}_{\text{des}})$$

---

## 9.3 Lyapunov Stability Analysis under Bounded Residual Error

Let the residual tracking error be defined as:
$$\tilde{\tau}_{\text{res}} = f_{\text{residual}}(q, \dot{q}, \ddot{q}) - f_\phi(q, \dot{q}, \ddot{q})$$

Assume the residual learning network achieves a bounded approximation error:
$$\| \tilde{\tau}_{\text{res}} \| \le \epsilon_{\text{res}} \quad \forall (q, \dot{q}) \in \mathcal{D}$$

Define the filtered tracking error metric $s(t)$:
$$s(t) = \dot{e}(t) + \Lambda e(t), \quad \Lambda = \Lambda^T > 0$$

Consider the positive definite candidate Lyapunov function:
$$V(s, t) = \frac{1}{2} s^T M_{\text{real}}(q) s$$

Differentiating along trajectories:
$$\dot{V} = s^T M_{\text{real}} \dot{s} + \frac{1}{2} s^T \dot{M}_{\text{real}} s$$
Using the skew-symmetry property of robotic mechanics ($\dot{M} - 2C$ is skew-symmetric, so $s^T (\dot{M} - 2C) s = 0$):
$$\dot{V} = s^T [ -K_D s + \tilde{\tau}_{\text{res}} ] = -s^T K_D s + s^T \tilde{\tau}_{\text{res}}$$
$$\dot{V} \le -\lambda_{\min}(K_D) \|s\|^2 + \|s\| \epsilon_{\text{res}}$$

For all $\|s\| > \frac{\epsilon_{\text{res}}}{\lambda_{\min}(K_D)}$, the Lyapunov derivative is strictly negative:
$$\dot{V} < 0$$

Therefore, the tracking error $s(t)$ is **Uniformly Ultimately Bounded (UUB)** within the compact ball:
$$\mathcal{B}_{\text{error}} = \left\{ s \in \mathbb{R}^n \;\middle|\; \|s\| \le \frac{\epsilon_{\text{res}}}{\lambda_{\min}(K_D)} \right\}$$

This is a profound guarantee: **even if the neural network makes an approximation error $\epsilon_{\text{res}}$, the robot is mathematically guaranteed not to diverge or become unstable.** The error is confined to a tight ball inversely proportional to feedback damping gain $K_D$.

---

## 9.4 Worked Examples (Problems 9.1 – 9.10)

---

### Problem 9.1 (Worked Example): Tracking Error Ball Radius Calculation
**Problem Statement:** A 2-DoF robotic manipulator is governed by residual physics control. Nominal feedback gain is $K_D = 25.0\text{ N}\cdot\text{s/m}$.
1. Prior to residual learning, unmodeled cable friction and link compliance introduce a dynamic error bound $\epsilon_{\text{unmodeled}} = 15.0\text{ N}\cdot\text{m}$. Compute the tracking error bound $\|s\|_{\max}$.
2. A lightweight residual neural network is trained on real hardware telemetry, reducing the residual error to $\epsilon_{\text{res}} = 0.75\text{ N}\cdot\text{m}$ ($95\%$ reduction). Compute the new tracking error bound $\|s\|_{\max}'$.

**Given Data:**
- $K_D = 25.0\text{ N}\cdot\text{s/m} \implies \lambda_{\min}(K_D) = 25.0$
- Initial discrepancy: $\epsilon_0 = 15.0\text{ N}\cdot\text{m}$
- Residual discrepancy: $\epsilon_{\text{res}} = 0.75\text{ N}\cdot\text{m}$

**Step-by-Step Derivation:**
1. Initial error ball radius:
   $$\|s\|_{\max} = \frac{\epsilon_0}{\lambda_{\min}(K_D)} = \frac{15.0}{25.0} = 0.60\text{ rad/s}$$
2. If filtered error coefficient is $\Lambda = 10.0\text{ s}^{-1}$ ($s = \dot{e} + 10 e$), steady-state position error bound is:
   $$\|e\|_{\max} \approx \frac{\|s\|_{\max}}{\Lambda} = \frac{0.60}{10.0} = 0.060\text{ rad} \approx 3.44^\circ$$
3. Post-residual learning error ball radius:
   $$\|s\|_{\max}' = \frac{\epsilon_{\text{res}}}{\lambda_{\min}(K_D)} = \frac{0.75}{25.0} = 0.030\text{ rad/s}$$
   Steady-state position error bound:
   $$\|e\|_{\max}' \approx \frac{0.030}{10.0} = 0.0030\text{ rad} \approx 0.172^\circ \quad (10.3\text{ arcminutes})$$

**Final Answer:**
Residual physics reduces the tracking error ball from $3.44^\circ$ down to $0.17^\circ$ ($20\times$ improvement), achieving sub-millimeter trajectory accuracy while preserving rigorous Lyapunov stability. $\blacksquare$

---

### Problem 9.2 (Worked Example): Feedforward Residual Compensation of Stribeck Stick-Slip
**Problem Statement:** A linear robotic axis experiences unmodeled Stribeck friction $\tau_f(\dot{x}) = [f_c + (f_s - f_c) e^{-(\dot{x}/v_s)^2}] \operatorname{sgn}(\dot{x}) + f_v \dot{x}$ with $f_s = 12.0\text{ N}$, $f_c = 5.0\text{ N}$, $v_s = 0.02\text{ m/s}$, and $f_v = 8.0\text{ N}\cdot\text{s/m}$.
The nominal controller includes only viscous friction compensation ($\hat{\tau}_f = f_v \dot{x}$).
1. Compute the unmodeled residual friction force during low-speed crawling at $\dot{x} = 0.01\text{ m/s}$.
2. If the residual neural network outputs $\tau_{\text{residual}} = 10.8\text{ N}$, compute the canceled friction percentage.

**Given Data:**
- $f_s = 12.0\text{ N}$
- $f_c = 5.0\text{ N}$
- $v_s = 0.02\text{ m/s}$
- $f_v = 8.0\text{ N}\cdot\text{s/m}$
- $\dot{x} = 0.01\text{ m/s}$

**Step-by-Step Derivation:**
1. True friction at $\dot{x} = 0.01\text{ m/s}$:
   Velocity ratio: $\frac{\dot{x}}{v_s} = \frac{0.01}{0.02} = 0.50$.
   Squared: $(0.50)^2 = 0.25 \implies e^{-0.25} \approx 0.7788$.
   Stribeck friction:
   $$F_{\text{stribeck}} = 5.0 + (12.0 - 5.0)(0.7788) = 5.0 + (7.0)(0.7788) = 5.0 + 5.4516 = 10.4516\text{ N}$$
   Viscous friction:
   $$F_{\text{viscous}} = f_v \dot{x} = (8.0)(0.01) = 0.08\text{ N}$$
   Total true friction:
   $$F_{\text{true}} = 10.4516 + 0.08 = 10.5316\text{ N}$$
2. Nominal controller cancels: $\hat{\tau} = 0.08\text{ N}$.
   The unmodeled residual friction is:
   $$\tau_{\text{unmodeled}} = F_{\text{true}} - \hat{\tau} = 10.4516\text{ N}$$
3. Residual network output $\tau_{\text{residual}} = 10.8\text{ N}$:
   Remaining error:
   $$e_f = |10.4516 - 10.8| = 0.3484\text{ N}$$
   Percentage of unmodeled friction eliminated:
   $$\%_{\text{canceled}} = \left(1 - \frac{0.3484}{10.4516}\right) \times 100\% = (1 - 0.0333) \times 100\% \approx 96.67\%$$

**Final Answer:**
Unmodeled Stribeck friction is $10.45\text{ N}$. The residual compensator eliminates $96.67\%$ of the non-linear stiction, completely preventing stick-slip limit-cycle oscillations during micro-positioning. $\blacksquare$

---

### Problem 9.3 (Worked Example): Safety Clamping of Residual Torque Output
**Problem Statement:** An industrial collaborative robot has nominal joint torque capacity $\tau_{\text{max}} = 50.0\text{ N}\cdot\text{m}$. To ensure safety, low-level firmware clamps the residual network output to a maximum authority envelope:
$$\tau_{\text{res, clamped}} = \operatorname{clip}(\tau_{\text{residual}}, -\tau_{\text{res, max}}, +\tau_{\text{res, max}})$$
with $\tau_{\text{res, max}} = 0.15 \tau_{\text{max}} = 7.5\text{ N}\cdot\text{m}$.
If an adversarial input or out-of-distribution sensor glitch causes the neural network to command $\tau_{\text{residual}} = +42.0\text{ N}\cdot\text{m}$, compute the clamped residual torque and the nominal-to-residual torque safety ratio.

**Given Data:**
- $\tau_{\text{max}} = 50.0\text{ N}\cdot\text{m}$
- $\tau_{\text{res, max}} = 7.5\text{ N}\cdot\text{m}$
- Neural command: $\tau_{\text{residual}} = 42.0\text{ N}\cdot\text{m}$

**Step-by-Step Derivation:**
1. Clamping operation:
   $$\tau_{\text{res, clamped}} = \min(7.5, \max(-7.5, 42.0)) = 7.5\text{ N}\cdot\text{m}$$
2. Effective torque authority of neural network:
   $$\frac{\tau_{\text{res, max}}}{\tau_{\text{max}}} = \frac{7.5}{50.0} = 0.15 = 15.0\%$$
3. The remaining $85\%$ of joint torque capacity is strictly controlled by the analytical physics model and classical PD feedback.

**Final Answer:**
The residual output is clamped to $+7.5\text{ N}\cdot\text{m}$. The neural network possesses at most $15\%$ control authority, preventing neural hallucinations from causing joint over-speed or collision damage. $\blacksquare$

---

### Problem 9.4 (Worked Example): Online Recursive Adaptation of Residual Weights
**Problem Statement:** The residual model is parameterized as a linear combination of radial basis functions (RBFs):
$$\tau_{\text{res}}(x) = \sum_{j=1}^M w_j \phi_j(x) = \phi(x)^T w$$
with weights $w \in \mathbb{R}^M$. An online gradient update is executed at $1\text{ kHz}$:
$$w_{k+1} = w_k + \eta \phi(x_k) e_k$$
where $e_k = \tau_{\text{meas}, k} - \tau_{\text{nominal}, k} - \phi(x_k)^T w_k$.
If $\eta = 0.05$, $\|\phi(x_k)\| = 1.0$, and measured torque error is $e_k = 2.0\text{ N}\cdot\text{m}$, compute the weight update step $\|\Delta w\|$.

**Given Data:**
- $\eta = 0.05$
- $\|\phi(x_k)\| = 1.0$
- $e_k = 2.0\text{ N}\cdot\text{m}$

**Step-by-Step Derivation:**
1. Weight update equation:
   $$\Delta w = w_{k+1} - w_k = \eta \phi(x_k) e_k$$
2. Norm of weight update:
   $$\|\Delta w\| = |\eta| \cdot |e_k| \cdot \|\phi(x_k)\| = (0.05)(2.0)(1.0) = 0.10$$

**Final Answer:**
The residual weight vector updates by $\|\Delta w\| = 0.10$, adapting to gradual physical changes (such as motor warming or lubricant thinning) within hundreds of milliseconds. $\blacksquare$

---

### Problem 9.5 (Worked Example): Cable Harness Elastic Restoring Torque Compensation
**Problem Statement:** An articulated robot arm has an external electrical cable harness routed along joint 2. The harness acts as an unmodeled non-linear torsional spring:
$$\tau_{\text{cable}}(\theta) = k_1 \theta + k_3 \theta^3$$
with $k_1 = 1.5\text{ N}\cdot\text{m/rad}$ and $k_3 = 4.0\text{ N}\cdot\text{m/rad}^3$.
For joint angle $\theta = 0.70\text{ rad}$ ($40.1^\circ$), compute:
1. The parasitic restoring torque exerted by the cable.
2. The steady-state position error $e_{\text{ss}}$ if controlled solely by a nominal PD controller with $K_p = 40.0\text{ N}\cdot\text{m/rad}$ (without residual compensation).

**Given Data:**
- $k_1 = 1.5\text{ N}\cdot\text{m/rad}$
- $k_3 = 4.0\text{ N}\cdot\text{m/rad}^3$
- $\theta = 0.70\text{ rad}$
- $K_p = 40.0\text{ N}\cdot\text{m/rad}$

**Step-by-Step Derivation:**
1. Parasitic cable torque:
   $$\tau_{\text{cable}}(0.70) = (1.5)(0.70) + (4.0)(0.70)^3 = 1.05 + (4.0)(0.343) = 1.05 + 1.372 = 2.422\text{ N}\cdot\text{m}$$
2. Steady-state error under nominal PD control:
   At steady state ($\dot{e} = 0, \ddot{e} = 0$), the PD controller must balance the cable torque:
   $$K_p e_{\text{ss}} = \tau_{\text{cable}} \implies e_{\text{ss}} = \frac{\tau_{\text{cable}}}{K_p}$$
   $$e_{\text{ss}} = \frac{2.422\text{ N}\cdot\text{m}}{40.0\text{ N}\cdot\text{m/rad}} = 0.06055\text{ radians} \approx 3.47^\circ$$
3. With residual physics compensation:
   The neural network feeds forward $\hat{\tau}_{\text{cable}} = 2.422\text{ N}\cdot\text{m}$, driving $e_{\text{ss}} \to 0$.

**Final Answer:**
The cable harness injects $2.42\text{ N}\cdot\text{m}$ of parasitic torque, creating a massive $3.47^\circ$ steady-state tracking error under classical PD control. Residual feedforward neutralizes this error completely. $\blacksquare$

---

### Problem 9.6 (Worked Example): Residual Inverse Dynamics vs Residual Forward Dynamics
**Problem Statement:** Contrast:
1. **Residual Inverse Dynamics:** $\tau_{\text{cmd}} = \tau_{\text{nominal}}(q, \dot{q}, \ddot{q}) + f_\phi(q, \dot{q}, \ddot{q})$.
2. **Residual Forward Dynamics:** $\ddot{q}_{\text{pred}} = \ddot{q}_{\text{nominal}}(q, \dot{q}, \tau) + g_\psi(q, \dot{q}, \tau)$.
Explain why Residual Inverse Dynamics is preferred for high-rate real-time joint torque control, while Residual Forward Dynamics is preferred for Model Predictive Control (MPC).

**Step-by-Step Derivation:**
1. Residual Inverse Dynamics:
   Directly computes feedforward control torques:
   $$\tau = M(q)\ddot{q}_{\text{des}} + C\dot{q} + g + f_\phi$$
   Requires zero matrix inversions during runtime execution. Can be evaluated in $< 50\text{ }\mu\text{s}$ on an embedded microcontroller at $1\text{ to }5\text{ kHz}$.
2. Residual Forward Dynamics:
   Predicts future states given current actions:
   $$s_{t+1} = s_t + \Delta t [f_{\text{analytical}}(s_t, u_t) + g_\psi(s_t, u_t)]$$
   In Model Predictive Control (MPC), the optimizer must roll forward hundreds of candidate action sequences across a planning horizon $T$. Residual forward dynamics allows the MPC trajectory optimizer to plan through an accurate calibrated model.

**Final Answer:**
Residual Inverse Dynamics is optimal for closed-loop real-time motor torque generation ($1\text{ kHz}$), while Residual Forward Dynamics is optimal for predictive planning and trajectory optimization in MPC ($50\text{ Hz}$). $\blacksquare$

---

### Problem 9.7 (Worked Example): Sample Efficiency Benchmark: Pure RL vs Residual RL
**Problem Statement:** In a precision peg-in-hole robotic insertion task, a pure end-to-end RL policy requires $N_{\text{pure}} = 4.5 \times 10^6$ environment interaction steps to achieve a $95\%$ insertion success rate.
A residual RL framework combines classical operational-space compliance control with a residual policy network, achieving the same $95\%$ success rate in $N_{\text{res}} = 1.8 \times 10^5$ steps.
Compute the sample efficiency speedup factor and explain the physical reason for this acceleration.

**Given Data:**
- $N_{\text{pure}} = 4.5 \times 10^6\text{ steps}$
- $N_{\text{res}} = 1.8 \times 10^5\text{ steps}$

**Step-by-Step Derivation:**
1. Speedup factor calculation:
   $$\text{Speedup} = \frac{N_{\text{pure}}}{N_{\text{res}}} = \frac{4.5 \times 10^6}{1.8 \times 10^5} = \frac{450}{18} = 25.0\times$$
2. Physical reason:
   - Pure RL must discover basic contact alignment, coordinate transforms, and kinematic constraints via blind trial-and-error exploration, frequently jamming the peg against the chamfer.
   - Residual RL begins with a nominal controller that already guides the peg directly to the hole entrance and enforces compliant stiffness. The residual network only needs to learn the micro-adjustments ($\pm 1\text{ mm}$, $\pm 2\text{ N}$) required to overcome clearance friction.

**Final Answer:**
Residual physics accelerates learning by $25.0\times$ because the search space is constrained to a tiny perturbation manifold around a stabilizing classical controller. $\blacksquare$

---

### Problem 9.8 (Worked Example): Gaussian Process Residual Modeling with Epistemic Uncertainty
**Problem Statement:** A Gaussian Process (GP) models residual torque: $\tau_{\text{res}}(x) \sim \mathcal{GP}(0, k(x, x'))$ with squared exponential kernel.
At query point $x_*$, the GP predicts mean $\mu_* = 3.5\text{ N}\cdot\text{m}$ and variance $\sigma_*^2 = 0.16\text{ N}^2\cdot\text{m}^2$ ($\sigma_* = 0.40\text{ N}\cdot\text{m}$).
At an unvisited query point $x_{\text{unseen}}$, the GP predicts mean $\mu = 1.0\text{ N}\cdot\text{m}$ and variance $\sigma^2 = 4.0\text{ N}^2\cdot\text{m}^2$ ($\sigma = 2.0\text{ N}\cdot\text{m}$).
Formulate a variance-gated residual blending rule that falls back to pure nominal control when epistemic uncertainty is high.

**Step-by-Step Derivation:**
1. Define a confidence gating weight $w(\sigma)$ based on variance:
   $$w(\sigma) = \exp\left( -\frac{\sigma^2}{2 \sigma_{\text{threshold}}^2} \right) \in (0, 1]$$
   Set safety threshold $\sigma_{\text{threshold}} = 0.50\text{ N}\cdot\text{m}$ ($\sigma_{\text{threshold}}^2 = 0.25$).
2. Blended residual torque:
   $$\tau_{\text{applied}} = w(\sigma) \mu_*$$
3. Evaluate at familiar point $x_*$ ($\sigma_*^2 = 0.16$):
   $$w_* = \exp\left( -\frac{0.16}{2(0.25)} \right) = \exp(-0.32) \approx 0.726$$
   $$\tau_{\text{res}} = (0.726)(3.5) \approx 2.54\text{ N}\cdot\text{m}$$
4. Evaluate at unseen point $x_{\text{unseen}}$ ($\sigma^2 = 4.0$):
   $$w_{\text{unseen}} = \exp\left( -\frac{4.0}{2(0.25)} \right) = \exp(-8.0) \approx 0.000335$$
   $$\tau_{\text{res}} \approx (0.000335)(1.0) \approx 0.0003\text{ N}\cdot\text{m} \approx 0$$

**Final Answer:**
At the unfamiliar state, the confidence weight collapses to zero ($w \approx 0.0003$), gracefully falling back to pure analytical physics and preventing reckless neural extrapolation. $\blacksquare$

---

### Problem 9.9 (Worked Example): High-Frequency Aerodynamic Drag Compensation in Autonomous Drones
**Problem Statement:** A quadrotor drone experiences rotor downwash and aerodynamic ground effect drag during high-speed low-altitude flight.
The unmodeled aerodynamic drag force is modeled as $F_{\text{drag}} = -C_d v \|v\|$ with $C_d = 0.22\text{ N}\cdot\text{s}^2/\text{m}^2$.
At velocity $v = 15.0\text{ m/s}$:
1. Compute the drag force magnitude.
2. If total drone mass is $m = 1.5\text{ kg}$, compute the parasitic acceleration disturbance $\Delta a$.

**Given Data:**
- $C_d = 0.22\text{ N}\cdot\text{s}^2/\text{m}^2$
- $v = 15.0\text{ m/s}$
- $m = 1.5\text{ kg}$

**Step-by-Step Derivation:**
1. Drag force:
   $$F_{\text{drag}} = C_d v^2 = (0.22)(15.0)^2 = (0.22)(225.0) = 49.5\text{ N}$$
2. Parasitic acceleration disturbance:
   $$\Delta a = \frac{F_{\text{drag}}}{m} = \frac{49.5\text{ N}}{1.5\text{ kg}} = 33.0\text{ m/s}^2 \approx 3.36\text{ g}$$

**Final Answer:**
Aerodynamic drag injects a massive $33.0\text{ m/s}^2$ ($3.36\text{ g}$) deceleration disturbance. Analytical drag estimation combined with a residual neural compensator allows high-speed racing drones to track trajectories within centimeters under severe wind resistance. $\blacksquare$

---

### Problem 9.10 (Worked Example): Passivity-Based Residual Energy Dissipation Guarantee
**Problem Statement:** To ensure that a learned residual torque network cannot inject unbounded artificial energy into the physical robot, a virtual energy storage tank (Passivity Observer) is introduced:
$$E_{\text{tank}}(t) = E_0 + \int_0^t \tau_{\text{nominal}}^T \dot{q} d\sigma - \int_0^t \tau_{\text{residual}}^T \dot{q} d\sigma$$
If $E_{\text{tank}}(t)$ drops to a minimum threshold $E_{\min} = 1.0\text{ Joule}$, show that deactivating the residual network ($\tau_{\text{residual}} = 0$) guarantees passivity of the closed-loop system.

**Step-by-Step Derivation:**
1. By definition of passivity:
   A system with input torque $\tau$ and output velocity $\dot{q}$ is passive if:
   $$\int_0^t \tau^T \dot{q} d\sigma \ge -E_0 \quad \forall t \ge 0$$
2. The mechanical energy injected by the residual controller is:
   $$W_{\text{residual}}(t) = \int_0^t \tau_{\text{residual}}^T \dot{q} d\sigma$$
   If $\tau_{\text{residual}}^T \dot{q} > 0$, the residual network is injecting mechanical energy into the links.
3. The energy tank tracks the accumulated balance:
   $$E_{\text{tank}}(t) = E_0 - W_{\text{residual}}(t)$$
4. If $E_{\text{tank}}(t) \le E_{\min}$, the tank is exhausted.
   Setting $\tau_{\text{residual}} = 0$ halts all further energy injection:
   $$\frac{d W_{\text{residual}}}{dt} = 0 \implies E_{\text{tank}}(t) \ge E_{\min} > 0 \quad \forall t$$
   Therefore, the system remains strictly passive and cannot experience runaway kinetic energy accumulation.

**Final Answer:**
Passivity energy tanks mathematically prevent the neural network from injecting unbounded energy, ensuring physical stability even in the presence of pathological neural outputs. $\blacksquare$

---

## 9.5 Solved Exercises (Problems 9.11 – 9.20)

---

### Problem 9.11 (Solved Exercise): Operational Space Inertia Matrix Residual
**Problem Statement:** Operational space inertia is $\Lambda(x) = (J M^{-1} J^T)^{-1}$. If real joint inertia $M_{\text{real}} = M_0 + \Delta M$, use the Neumann series $(I + A)^{-1} \approx I - A$ to derive the first-order operational space inertia perturbation $\Delta\Lambda$.

**Step-by-Step Solution:**
1. Inverse joint inertia perturbation:
   $$M_{\text{real}}^{-1} = (M_0 + \Delta M)^{-1} \approx M_0^{-1} - M_0^{-1} \Delta M M_0^{-1}$$
2. Operational space mobility:
   $$W_{\text{real}} = J M_{\text{real}}^{-1} J^T \approx J M_0^{-1} J^T - J M_0^{-1} \Delta M M_0^{-1} J^T = W_0 - \Delta W$$
3. Invert mobility:
   $$\Lambda_{\text{real}} = W_{\text{real}}^{-1} = (W_0 - \Delta W)^{-1} \approx W_0^{-1} + W_0^{-1} \Delta W W_0^{-1}$$
   $$\Delta\Lambda \approx \Lambda_0 [ J M_0^{-1} \Delta M M_0^{-1} J^T ] \Lambda_0 \quad \blacksquare$$

---

### Problem 9.12 (Solved Exercise): Continuous-Time Spectral Normalization for Residual Networks
**Problem Statement:** In a residual neural network $f_\phi(x)$, each weight matrix $W_l$ is normalized by its spectral norm: $\tilde{W}_l = W_l / \|W_l\|_2$. Prove that the global Lipschitz constant of the residual network is bounded by $L \le 1.0$ if 1-Lipschitz activations (such as ReLU) are used.

**Step-by-Step Solution:**
1. By the sub-multiplicative property of operator norms:
   $$\|f_\phi(x_1) - f_\phi(x_2)\| \le \left( \prod_{l=1}^L \|\tilde{W}_l\|_2 \right) \|x_1 - x_2\|$$
2. Since each layer is normalized to $\|\tilde{W}_l\|_2 = 1.0$:
   $$\prod_{l=1}^L \|\tilde{W}_l\|_2 = 1^L = 1.0 \implies L \le 1.0 \quad \blacksquare$$

---

### Problem 9.13 (Solved Exercise): Temperature-Dependent Winding Resistance Residual
**Problem Statement:** As a motor heats from $25^\circ\text{C}$ to $85^\circ\text{C}$, resistance increases by $\Delta R = 0.28\ \Omega$. For commanded current $I = 15\text{ A}$, compute the unmodeled voltage drop $\Delta V$ that the residual electrical compensator must output.

**Step-by-Step Solution:**
1. Unmodeled voltage drop:
   $$\Delta V = I \cdot \Delta R = (15\text{ A})(0.28\ \Omega) = 4.20\text{ Volts} \quad \blacksquare$$

---

### Problem 9.14 (Solved Exercise): Dead-Zone Non-Linearity Inverse Residual
**Problem Statement:** A hydraulic valve has a dead-zone $[-u_0, +u_0] = [-0.15, +0.15]\text{ V}$. Formulate the exact analytical inverse dead-zone function that the residual network must apply to valve command $u_{\text{des}}$.

**Step-by-Step Solution:**
1. Inverse dead-zone mapping:
   $$u_{\text{actual}} = \begin{cases} u_{\text{des}} + u_0, & u_{\text{des}} > 0 \\ 0, & u_{\text{des}} = 0 \\ u_{\text{des}} - u_0, & u_{\text{des}} < 0 \end{cases} = u_{\text{des}} + u_0 \operatorname{sgn}(u_{\text{des}}) \quad \blacksquare$$

---

### Problem 9.15 (Solved Exercise): Frequency-Domain Residual Bandwidth Cutoff
**Problem Statement:** Why should a residual physics compensator be filtered through a low-pass filter with cutoff frequency $\omega_{\text{residual}} \le \frac{1}{3} \omega_{\text{resonance}}$ of the robot link?

**Step-by-Step Solution:**
1. High-frequency neural outputs contain wideband spectral content and gradient noise.
2. If residual commands operate near the mechanical structural resonance $\omega_{\text{resonance}}$, they inject energy directly into the flexible mode, causing destructive acoustic chatter and structural fatigue. Low-pass filtering preserves low-frequency friction compensation while isolating resonances. $\blacksquare$

---

### Problem 9.16 (Solved Exercise): Multi-Layer Perceptron (MLP) Flop Count
**Problem Statement:** A residual torque MLP has input dimension $d_{\text{in}} = 12$, two hidden layers of 64 units each with ReLU activations, and output dimension $d_{\text{out}} = 6$. Compute the total number of floating-point multiply-accumulate (MAC) operations required per inference step.

**Step-by-Step Solution:**
1. Layer 1: $12 \times 64 = 768\text{ MACs}$.
2. Layer 2: $64 \times 64 = 4096\text{ MACs}$.
3. Output Layer: $64 \times 6 = 384\text{ MACs}$.
4. Total MACs:
   $$\text{Total} = 768 + 4096 + 384 = 5248\text{ MACs} \approx 5.25\text{ kFLOPs} \quad \blacksquare$$

---

### Problem 9.17 (Solved Exercise): Zero-Drift Integral Action vs Learned Residual Bias
**Problem Statement:** Contrast classical integral control $\tau_I = K_i \int e dt$ with a learned residual network $f_\phi(q)$. Why does the residual network eliminate gravity droop instantly without the transient phase lag and overshoot of an integrator?

**Step-by-Step Solution:**
1. Integral control is **reactive**: it requires tracking error $e(t) \ne 0$ to accumulate over time ($\int e dt$) before producing compensating torque, introducing phase lag and overshoot.
2. Learned residual physics is **feedforward**: it maps state $q$ directly to the required counter-torque $\tau_{\text{bias}}(q)$ at $t = 0$, neutralizing unmodeled gravity droop with zero phase delay. $\blacksquare$

---

### Problem 9.18 (Solved Exercise): Residual Physics for Human-Robot Collaboration
**Problem Statement:** In collaborative robotics, an external human pushes the robot arm with force $F_{\text{human}}$. If the residual network is trained on free-motion telemetry, how does the residual prediction error $e = \tau_{\text{meas}} - (\tau_{\text{nominal}} + \tau_{\text{residual}})$ act as an external contact force sensor?

**Step-by-Step Solution:**
1. In free motion, $\tau_{\text{meas}} = \tau_{\text{nominal}} + \tau_{\text{residual}}$.
2. When human contact occurs:
   $$\tau_{\text{meas}} = \tau_{\text{nominal}} + \tau_{\text{residual}} + J^T F_{\text{human}}$$
3. The prediction residual directly isolates the human contact torque:
   $$e = J^T F_{\text{human}} \implies F_{\text{human}} = (J^T)^\dagger e$$
   providing sensorless human touch detection without expensive wrist force-torque sensors. $\blacksquare$

---

### Problem 9.19 (Solved Exercise): Damping Injection in Residual Latency Regime
**Problem Statement:** If the residual compensator has a computational latency $\tau_{\text{latency}} = 5\text{ ms}$, prove that adding a virtual damping term $\tau_d = -D_{\text{virtual}} \dot{q}$ with $D_{\text{virtual}} \ge K_{\text{res}} \tau_{\text{latency}}$ restores phase margin.

**Step-by-Step Solution:**
1. Delay phase lag: $\Delta\phi \approx -\omega \tau_{\text{latency}}$.
2. Residual gain $K_{\text{res}}$ with delay produces an effective negative damping force $-\omega K_{\text{res}} \tau_{\text{latency}} \dot{q}$.
3. Adding positive virtual damping $D_{\text{virtual}} \ge K_{\text{res}} \tau_{\text{latency}}$ cancels the delay-induced negative damping, stabilizing the closed-loop feedback. $\blacksquare$

---

### Problem 9.20 (Solved Exercise): Residual Sim-to-Real Generalization Theorem
**Problem Statement:** Let nominal dynamics have simulation error $\|\tau_{\text{real}} - \tau_{\text{sim}}\| \le \delta$. If the residual network is trained on dataset $\mathcal{D}$ such that generalization error on real hardware satisfies $\mathbb{E}[\|\tau_{\text{residual}} - (\tau_{\text{real}} - \tau_{\text{sim}})\|^2] \le \sigma^2 \ll \delta^2$, state the reduction in required feedback gain $K_p$.

**Step-by-Step Solution:**
1. To bound tracking error $\|e\| \le \epsilon$, feedback gain must satisfy $K_p \ge \frac{\Delta\tau_{\max}}{\epsilon}$.
2. Without residual compensation: $K_p \ge \frac{\delta}{\epsilon}$.
3. With residual compensation: $K_p \ge \frac{\sigma}{\epsilon}$.
4. Gain reduction factor:
   $$\frac{K_{p, \text{residual}}}{K_{p, \text{nominal}}} = \frac{\sigma}{\delta} \ll 1.0$$
   The robot operates with much lower joint stiffness, enhancing physical compliance and safety. $\blacksquare$
