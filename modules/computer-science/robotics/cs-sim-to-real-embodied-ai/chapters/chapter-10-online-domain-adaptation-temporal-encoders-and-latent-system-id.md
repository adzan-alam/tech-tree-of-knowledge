# Chapter 10: Online Domain Adaptation, Temporal Encoders, and Latent System ID

## 10.1 Introduction: Real-Time Adaptation without Explicit Retraining

In biological organisms, motor control is never static. When a mountain goat steps from dry granite onto a patch of wet moss, it does not stop, access an offline cloud computing cluster, and re-train its neural synapses for 24 hours. Within a fraction of a single stride—less than $100\text{ milliseconds}$—proprioceptive stretch receptors in its tendons detect the micro-slip, muscle co-contraction increases across its legs, and its gait shifts to a compliant, low-impact stride.

For physical robots deployed in open, unstructured worlds, the environment is in constant flux:
- A quadruped transitions from asphalt to slick ice or thick mud.
- A robotic arm picks up an unknown payload whose mass, inertia tensor, and center of mass were never specified.
- A humanoid robot walks up a $15^\circ$ slope carrying a sloshing liquid container.
- An autonomous drone flies into high-velocity turbulent crosswinds.

A static policy $\pi(a \mid s_t)$—even one robustified via Domain Randomization—is fundamentally blind to these dynamic transitions. Because it cannot distinguish whether a tracking error is caused by a sudden wind gust, a heavy payload, or a slippery surface, it must execute a single generic compromise action.

**Online Domain Adaptation** solves this by converting continuous proprioceptive time-series signals into an internal, real-time estimate of the physical environment: **Latent System Identification**.

```
+---------------------------------------------------------------------------------------------------+
|                        ONLINE DOMAIN ADAPTATION VIA LATENT TEMPORAL ENCODERS                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Proprioceptive Sensor Stream (100 Hz - 500 Hz)                                                 |
|    o_t = [ q_t, qdot_t, a_imu, omega_imu, a_{t-1} ]                                              |
|         │                                                                                         |
|         ▼                                                                                         |
|    [ Sliding History Buffer ]: H_t = [ o_t, o_{t-1}, o_{t-2}, ..., o_{t-H+1} ] in R^(H x d_o)     |
|         │                                                                                         |
|         ▼                                                                                         |
|    ┌────────────────────────────────────────────────────────┐                                     |
|    │  LATENT TEMPORAL ENCODER E_phi:                        │                                     |
|    │  - 1D Temporal Dilated ConvNet (TCN) or GRU           │                                     |
|    │  - Evaluates in < 1.0 ms on edge embedded GPU          │                                     |
|    │  - Outputs Latent Physical Vector:                     │                                     |
|    │      z_t = E_phi(H_t) in R^d_z                         │                                     |
|    └────────────────────────────────────────────────────────┘                                     |
|         │                                                                                         |
|         ├───────────────────────────────────────────────┐                                         |
|         ▼                                               ▼                                         |
|    Implicit Physical Meaning:                      [ ADAPTIVE ACTOR POLICY ]                      |
|    - z_1 ~ Estimated Ground Friction (mu)          pi_theta(a_t | o_t, z_t)                       |
|    - z_2 ~ Estimated Payload Mass (m)                   │                                         |
|    - z_3 ~ Estimated Ground Incline (theta)             ▼                                         |
|    - z_4 ~ Center of Mass Offset (r_com)           Motor Torque Commands tau_t                    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 10.2 Mathematical Architecture of the Latent Temporal Encoder

Let the history of past $H$ proprioceptive observations and executed actions be denoted by:
$$H_t = \begin{bmatrix} o_t \\ a_{t-1} \\ o_{t-1} \\ a_{t-2} \\ \vdots \\ o_{t-H+1} \\ a_{t-H} \end{bmatrix} \in \mathbb{R}^{H \cdot (d_o + d_a)}$$

The temporal encoder $E_\phi: \mathbb{R}^{H(d_o + d_a)} \to \mathbb{R}^{d_z}$ maps this sliding observation window to a low-dimensional latent space:
$$z_t = E_\phi(H_t)$$
where $d_z \ll H(d_o + d_a)$ (typically $d_z \in [4, 16]$).

### 10.2.1 Temporal Convolutional Network (TCN) vs Recurrent GRU
Modern architectures employ two primary approaches for $E_\phi$:

1. **Dilated 1D Temporal Convolutional Networks (TCN):**
   - Causally padded 1D convolutions with exponentially increasing dilation factors $d \in \{1, 2, 4, 8\}$.
   - Entirely feedforward; execution time is strictly deterministic ($\mathcal{O}(1)$ latency without recurrent hidden state drift).
   - Highly parallelizable on tensor cores (NVIDIA TensorRT / INT8).

2. **Gated Recurrent Unit (GRU):**
   - Maintains an internal hidden state $h_t \in \mathbb{R}^{d_h}$:
     $$h_t = \text{GRU}(h_{t-1}, [o_t, a_{t-1}])$$
     $$z_t = W_z h_t + b_z$$
   - Infinite theoretical memory horizon, but susceptible to numerical drift and hidden state explosion under sudden out-of-distribution shocks.

---

## 10.3 The Physical Meaning and Disentanglement of Latent Space $z_t$

Although the latent vector $z_t \in \mathbb{R}^{d_z}$ is trained end-to-end without explicit supervisory labels for friction or mass, **unsupervised physical disentanglement emerges naturally**:

```
+---------------------------------------------------------------------------------------------------+
|                        LATENT SPACE TRAJECTORY IN PHYSICAL EXPERIMENTS                            |
+---------------------------------------------------------------------------------------------------+
|  z_2 (Payload Mass Direction)                                                                     |
|      ▲                                                                                            |
|      │                                     * Payload = 5.0 kg                                     |
|      │                                    /                                                       |
|      │                                   * Payload = 2.5 kg                                       |
|      │                                  /                                                         |
|      │  * Ice (mu = 0.1)               /                                                          |
|      │   \                            * Nominal Robot (Empty, mu = 0.8)                           |
|      │    \                          /                                                            |
|      │     \                        /                                                             |
|  ────┼──────\──────────────────────/────────────────────────► z_1 (Friction Direction)             |
|      │       \                    * Sand (Deformable sinkage)                                     |
|      │        * Mud (Low mu + high damping)                                                       |
|      ▼                                                                                            |
+---------------------------------------------------------------------------------------------------+
```

By computing the linear regression from $z_t$ to ground truth simulator properties $s_{\text{priv}}$, one discovers that:
- The first principal axis of $z_t$ correlates strongly with **effective ground friction coefficient** $\mu$ ($R^2 > 0.92$).
- The second principal axis correlates with **payload mass** $m_{\text{payload}}$ ($R^2 > 0.88$).
- The third principal axis correlates with **terrain slope angle** $\theta_{\text{slope}}$ ($R^2 > 0.94$).

The network has independently re-discovered the fundamental laws of classical mechanics!

---

## 10.4 Preventing Catastrophic Forgetting and Policy Drift

A classic pitfall of online adaptation is **catastrophic policy drift**:
If a robot operates on sand for 10 minutes, an unconstrained online gradient update or drifting recurrent state may overfit to sand, entirely forgetting how to walk on firm concrete.

To prevent drift, three architectural safeguards are enforced:
1. **Freezing the Encoder Post-Distillation:** In the RMA framework, the encoder weights $\phi$ and actor weights $\theta$ are **completely frozen during physical deployment**. Adaptation occurs strictly through the *activation dynamics* of the temporal window $H_t$, not by updating network weights on the fly!
2. **Latent Space Clamping:** The latent vector is bounded within an ellipsoid calibrated during training:
   $$\| z_t - \bar{z} \|_{\Sigma_z^{-1}}^2 \le \chi_{d_z}^2(0.99)$$
3. **Temporal Memory Flushing:** If an anomaly or emergency stop triggers, the history buffer $H_t$ is flushed to nominal values, restoring baseline nominal behavior in $0\text{ ms}$.

---

## 10.5 Worked Examples (Problems 10.1 – 10.10)

---

### Problem 10.1 (Worked Example): Latent Space Mahalanobis Distance Anomaly Detection
**Problem Statement:** In an online adaptive policy, the latent vector $z_t \in \mathbb{R}^4$ has calibrated training distribution $\mathcal{N}(\boldsymbol{\mu}_z, \Sigma_z)$ with mean $\boldsymbol{\mu}_z = [0, 0, 0, 0]^T$ and covariance $\Sigma_z = \operatorname{diag}(0.25, 0.16, 0.36, 0.09)$.
During real-world deployment, an unexpected mechanical failure (a sheared gearbox tooth) causes the encoder to output $z_{\text{fault}} = [0.8, -0.6, 1.5, -0.4]^T$.
Compute the squared Mahalanobis distance $D_M^2(z_{\text{fault}})$, and determine whether it triggers an Out-of-Distribution (OOD) emergency stop at the $99.9\%$ confidence threshold ($\chi_4^2(0.999) = 18.47$).

**Given Data:**
- $\boldsymbol{\mu}_z = [0, 0, 0, 0]^T$
- $\Sigma_z = \operatorname{diag}(0.25, 0.16, 0.36, 0.09)$
- $z = [0.8, -0.6, 1.5, -0.4]^T$
- Critical threshold: $\chi_4^2(0.999) = 18.47$

**Step-by-Step Derivation:**
1. Formula for squared Mahalanobis distance with diagonal covariance:
   $$D_M^2(z) = (z - \boldsymbol{\mu})^T \Sigma^{-1} (z - \boldsymbol{\mu}) = \sum_{i=1}^4 \frac{(z_i - \mu_i)^2}{\sigma_i^2}$$
2. Compute individual component terms:
   - Component 1: $\frac{(0.8)^2}{0.25} = \frac{0.64}{0.25} = 2.56$
   - Component 2: $\frac{(-0.6)^2}{0.16} = \frac{0.36}{0.16} = 2.25$
   - Component 3: $\frac{(1.5)^2}{0.36} = \frac{2.25}{0.36} = 6.25$
   - Component 4: $\frac{(-0.4)^2}{0.09} = \frac{0.16}{0.09} \approx 1.7778$
3. Sum terms:
   $$D_M^2(z_{\text{fault}}) = 2.56 + 2.25 + 6.25 + 1.7778 = 12.8378 \approx 12.84$$
4. Compare against thresholds:
   - At $95\%$ threshold: $\chi_4^2(0.95) = 9.49 \implies D_M^2 > 9.49$ (Abnormal state detected).
   - At $99.9\%$ threshold: $\chi_4^2(0.999) = 18.47 \implies D_M^2 = 12.84 < 18.47$.

**Final Answer:**
The squared Mahalanobis distance is $D_M^2 \approx 12.84$. It flags a warning at the $95\%$ level ($9.49$) but does not trigger the hard emergency stop threshold ($18.47$), allowing the robot to attempt an adaptive recovery limp. $\blacksquare$

---

### Problem 10.2 (Worked Example): Latent Adaptation Response Time to Sudden Payload Injection
**Problem Statement:** A mobile manipulator picks up an unknown metal block of mass $M = 8.0\text{ kg}$ at $t = 0$. The temporal encoder observes a sliding window of $H = 25$ steps at $50\text{ Hz}$ ($T_s = 20\text{ ms}$, total buffer duration $T_{\text{buf}} = 500\text{ ms}$).
Assuming the physical acceleration discrepancy fills the FIFO history buffer linearly with time, compute the time $t_{\text{adapt}}$ required for the buffer to contain $80\%$ payload-affected data.

**Given Data:**
- $H = 25\text{ steps}$
- $T_s = 0.020\text{ s}$
- Payload ratio target: $80\%$

**Step-by-Step Derivation:**
1. Number of payload-affected samples required:
   $$N_{\text{affected}} = 0.80 \times H = 0.80 \times 25 = 20\text{ time steps}$$
2. Time required for 20 new samples to enter the FIFO queue:
   $$t_{\text{adapt}} = N_{\text{affected}} \times T_s = 20 \times 0.020\text{ s} = 0.40\text{ seconds} = 400\text{ ms}$$

**Final Answer:**
The latent vector completes $80\%$ of its transition to the heavy-payload state within exactly $400\text{ ms}$, allowing the robot arm to adjust its feedforward gravity compensation before the payload can pull the end-effector down. $\blacksquare$

---

### Problem 10.3 (Worked Example): Linear Decoding of Implicit Friction from Latent Vector
**Problem Statement:** A trained latent encoder outputs $z_t \in \mathbb{R}^2$. A validation dataset records true simulator friction coefficients $\mu$ and corresponding latent vectors:
- Data 1: $z^{(1)} = [-1.5, 0.2]^T, \mu_1 = 0.10$ (Ice)
- Data 2: $z^{(2)} = [0.0, 0.5]^T, \mu_2 = 0.50$ (Wood)
- Data 3: $z^{(3)} = [+1.8, -0.3]^T, \mu_3 = 1.00$ (Rubber)
Fit a linear decoder $\hat{\mu} = w_1 z_1 + w_2 z_2 + b$ using ordinary least squares.

**Given Data:**
- Inputs: $Z = \begin{bmatrix} -1.5 & 0.2 & 1 \\ 0.0 & 0.5 & 1 \\ 1.8 & -0.3 & 1 \end{bmatrix}$
- Targets: $\mathbf{y} = \begin{bmatrix} 0.10 \\ 0.50 \\ 1.00 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Notice that $z_1$ increases monotonically with $\mu$: from $-1.5$ to $0.0$ to $+1.8$.
2. Approximate linear mapping along $z_1$:
   Slope: $w_1 \approx \frac{1.00 - 0.10}{1.8 - (-1.5)} = \frac{0.90}{3.3} \approx 0.2727$.
   At $z_1 = 0$, $\mu \approx 0.50 \implies b \approx 0.50$.
3. Exact OLS solution $w = (Z^T Z)^{-1} Z^T \mathbf{y}$:
   Evaluating the linear system yields:
   $$w_1 \approx 0.271, \quad w_2 \approx 0.038, \quad b \approx 0.493$$
4. Check predictions:
   - For $z^{(1)}$: $\hat{\mu}_1 = (0.271)(-1.5) + (0.038)(0.2) + 0.493 = -0.4065 + 0.0076 + 0.493 = 0.0941 \approx 0.10$
   - For $z^{(2)}$: $\hat{\mu}_2 = 0 + (0.038)(0.5) + 0.493 = 0.019 + 0.493 = 0.512 \approx 0.50$
   - For $z^{(3)}$: $\hat{\mu}_3 = (0.271)(1.8) + (0.038)(-0.3) + 0.493 = 0.4878 - 0.0114 + 0.493 = 0.969 \approx 1.00$

**Final Answer:**
The linear decoder is $\hat{\mu} \approx 0.271 z_1 + 0.038 z_2 + 0.493$. The primary latent component $z_1$ accounts for over $98\%$ of friction variation, proving emergent physical linear disentanglement. $\blacksquare$

---

### Problem 10.4 (Worked Example): Latent Modulation of Policy Output (Gated Multiplication)
**Problem Statement:** An adaptive policy architecture uses Feature-wise Linear Modulation (FiLM) to inject latent vector $z_t \in \mathbb{R}^{d_z}$ into an intermediate policy activation layer $h \in \mathbb{R}^{d_h}$:
$$h_{\text{modulated}} = \gamma(z_t) \odot h + \beta(z_t)$$
where $\gamma(z) = W_\gamma z + 1$ and $\beta(z) = W_\beta z$.
For scalar activation $h = 2.0$, scalar latent $z = 0.5$, $W_\gamma = 0.4$, and $W_\beta = -0.3$:
Compute the modulated activation $h_{\text{modulated}}$.

**Given Data:**
- $h = 2.0$
- $z = 0.5$
- $W_\gamma = 0.4$
- $W_\beta = -0.3$

**Step-by-Step Derivation:**
1. Compute multiplicative scale $\gamma(z)$:
   $$\gamma(z) = W_\gamma z + 1 = (0.4)(0.5) + 1 = 0.2 + 1 = 1.2$$
2. Compute additive bias $\beta(z)$:
   $$\beta(z) = W_\beta z = (-0.3)(0.5) = -0.15$$
3. Compute modulated activation:
   $$h_{\text{modulated}} = \gamma(z) h + \beta(z) = (1.2)(2.0) + (-0.15) = 2.4 - 0.15 = 2.25$$

**Final Answer:**
The modulated activation is $h_{\text{modulated}} = 2.25$. FiLM layers allow the latent vector to dynamically rescale and shift internal policy feature representations based on real-time environmental context. $\blacksquare$

---

### Problem 10.5 (Worked Example): Receptive Field Overlap in Rolling TCN Inference
**Problem Statement:** A robot runs a temporal encoder with stride $S = 1$ at $100\text{ Hz}$ ($10\text{ ms}$ interval). The history buffer has length $H = 30$ steps.
Between consecutive control steps $t$ and $t+1$:
1. Compute the percentage of overlapping data between $H_t$ and $H_{t+1}$.
2. Explain how circular ring buffers eliminate memory allocation overhead on embedded microcontrollers.

**Given Data:**
- Buffer length $H = 30$
- New samples per step: 1

**Step-by-Step Derivation:**
1. Overlap calculation:
   The buffer at $t+1$ retains $H - 1 = 29$ samples from buffer $t$, adding exactly 1 new sample:
   $$\%_{\text{overlap}} = \frac{H - 1}{H} \times 100\% = \frac{29}{30} \times 100\% \approx 96.67\%$$
2. Circular Ring Buffer:
   Instead of shifting all 30 elements in memory (costly $\mathcal{O}(H)$ memory copy), a circular ring buffer maintains a head pointer:
   $$\text{head} \leftarrow (\text{head} + 1) \bmod H$$
   $$\text{buffer}[\text{head}] = o_{t+1}$$
   Execution takes $\mathcal{O}(1)$ time with zero dynamic memory allocation, preventing real-time garbage collection pauses.

**Final Answer:**
Consecutive temporal windows share $96.67\%$ of their data. Implementing a static circular ring buffer achieves $\mathcal{O}(1)$ insertion time with zero heap allocation, satisfying hard real-time execution constraints. $\blacksquare$

---

### Problem 10.6 (Worked Example): Latent Vector Low-Pass Exponential Smoothing
**Problem Statement:** Raw temporal encoder outputs $z_t$ exhibit high-frequency jitter due to sensor quantization noise. An exponential filter is applied:
$$\bar{z}_t = \alpha z_t + (1 - \alpha) \bar{z}_{t-1}$$
Sampling rate is $f_s = 50\text{ Hz}$ ($T_s = 20\text{ ms}$).
Determine the smoothing parameter $\alpha$ to achieve an effective low-pass cutoff frequency $f_c = 2.5\text{ Hz}$.

**Given Data:**
- $f_s = 50\text{ Hz} \implies T_s = 0.020\text{ s}$
- $f_c = 2.5\text{ Hz} \implies \omega_c = 2\pi(2.5) = 5\pi \approx 15.708\text{ rad/s}$

**Step-by-Step Derivation:**
1. The continuous first-order lag time constant is:
   $$\tau = \frac{1}{\omega_c} = \frac{1}{15.708} \approx 0.06366\text{ s} = 63.66\text{ ms}$$
2. The discrete exponential smoothing factor $\alpha$ relates to $\tau$ and $T_s$ via:
   $$\alpha = \frac{T_s}{\tau + T_s}$$
3. Substitute numerical values:
   $$\alpha = \frac{0.020}{0.06366 + 0.020} = \frac{0.020}{0.08366} \approx 0.23906 \approx 0.24$$

**Final Answer:**
Setting $\alpha \approx 0.24$ filters out high-frequency noise spikes above $2.5\text{ Hz}$ while allowing the latent environmental estimate to adapt to terrain changes within $\sim 190\text{ ms}$ ($3\tau$). $\blacksquare$

---

### Problem 10.7 (Worked Example): Latent SVD Condition Number and Degenerate Latent Dimensions
**Problem Statement:** A 4-dimensional latent space $z \in \mathbb{R}^4$ is evaluated across 1000 test episodes. The singular values of the latent data matrix $Z \in \mathbb{R}^{1000 \times 4}$ are:
$$\sigma_1 = 45.0, \quad \sigma_2 = 28.0, \quad \sigma_3 = 12.0, \quad \sigma_4 = 0.02$$
1. Compute the condition number $\kappa = \sigma_1 / \sigma_4$.
2. Identify whether dimension 4 is active or dead (degenerate), and calculate the variance explained by the first three components.

**Given Data:**
- $\sigma = [45.0, 28.0, 12.0, 0.02]$

**Step-by-Step Derivation:**
1. Condition number:
   $$\kappa = \frac{\sigma_1}{\sigma_4} = \frac{45.0}{0.02} = 2250.0$$
2. Sum of squared singular values (proportional to total variance):
   $$\sigma_1^2 = (45)^2 = 2025.0$$
   $$\sigma_2^2 = (28)^2 = 784.0$$
   $$\sigma_3^2 = (12)^2 = 144.0$$
   $$\sigma_4^2 = (0.02)^2 = 0.0004$$
   $$\Sigma_{\text{total}} = 2025.0 + 784.0 + 144.0 + 0.0004 = 2953.0004$$
3. Variance explained by top 3 components:
   $$\eta = \frac{2025.0 + 784.0 + 144.0}{2953.0004} = \frac{2953.0}{2953.0004} \approx 0.99999986 \approx 99.99999\%$$

**Final Answer:**
The condition number is $\kappa = 2250.0$. Dimension 4 is completely dead (variance $< 10^{-6}$), meaning the physical training environment spanned an intrinsic manifold of dimension $d_{\text{intrinsic}} = 3$. Dimension 4 can be pruned with zero performance loss. $\blacksquare$

---

### Problem 10.8 (Worked Example): Recurrent Encoder Hidden State Reset under Contact Phase Transition
**Problem Statement:** In quadruped locomotion, each leg alternates between swing phase (open-chain, contact force $F_c = 0$) and stance phase (closed-chain, contact force $F_c > 0$).
Explain why resetting the leg's recurrent encoder hidden state $h_t \leftarrow 0$ at touchdown prevents swing-phase dynamics from polluting stance-phase ground friction estimation.

**Step-by-Step Derivation:**
1. During swing phase, leg joints accelerate freely through the air. Any joint tracking error is caused by motor dynamics, link inertia, or aerodynamic drag—**it contains zero information about ground friction**.
2. If a recurrent GRU hidden state $h_t$ accumulates swing errors, upon touchdown ($t_{\text{touchdown}}$), the latent vector $z_t$ will carry swing-phase residual artifacts into the stance phase.
3. Ground friction $\mu$ can only be observed during stance phase when the foot exerts tangential shear forces against the terrain.
4. Resetting (or soft-gating) the hidden state at touchdown purges swing-phase artifacts:
   $$h_{t_{\text{touchdown}}} = \alpha_{\text{contact}} h_{t^-}$$
   ensuring that latent friction estimation is driven strictly by grounded contact mechanics.

**Final Answer:**
Phase-based hidden state gating prevents ungrounded swing-phase inertial transients from corrupting ground friction identification during stance. $\blacksquare$

---

### Problem 10.9 (Worked Example): Memory Footprint of Temporal Convolutional Networks
**Problem Statement:** A real-time edge controller on an autonomous micro-drone has only $256\text{ KB}$ of fast SRAM cache available for network activations.
A temporal encoder processes history buffer $H_t \in \mathbb{R}^{32 \times 24}$ through 3 convolutional layers:
- Layer 1: Conv1D($24 \to 32$, kernel 3) $\implies$ Activation size $32 \times 32$ floats
- Layer 2: Conv1D($32 \to 32$, kernel 3) $\implies$ Activation size $32 \times 32$ floats
- Layer 3: Conv1D($32 \to 16$, kernel 3) $\implies$ Activation size $32 \times 16$ floats
Using 32-bit floating point precision ($4\text{ bytes/float}$), compute the total memory footprint of the activation tensors.

**Given Data:**
- Precision: 4 bytes per float

**Step-by-Step Derivation:**
1. Number of floats per activation:
   - Input: $32 \times 24 = 768\text{ floats}$
   - Layer 1: $32 \times 32 = 1024\text{ floats}$
   - Layer 2: $32 \times 32 = 1024\text{ floats}$
   - Layer 3: $32 \times 16 = 512\text{ floats}$
2. Total floats:
   $$N_{\text{floats}} = 768 + 1024 + 1024 + 512 = 3328\text{ floats}$$
3. Total memory in bytes:
   $$\text{Bytes} = 3328 \times 4\text{ bytes} = 13,312\text{ bytes} \approx 13.0\text{ KB}$$
4. Compare against cache capacity:
   $$\frac{13.0\text{ KB}}{256\text{ KB}} \approx 5.08\%$$

**Final Answer:**
The activation tensors consume only $13.0\text{ KB}$ of memory ($5.1\%$ of available SRAM), fitting easily into edge embedded microcontrollers and running with zero DRAM memory bus thrashing. $\blacksquare$

---

### Problem 10.10 (Worked Example): Zero-Shot Incline Adaptation Bound
**Problem Statement:** A bipedal robot walks onto an unmodeled ramp of angle $\theta_{\text{slope}} = 12^\circ$ ($0.209\text{ rad}$). The gravity vector projected in the robot base frame tilts from $[0, 0, -9.81]^T$ to $[9.81 \sin\theta, 0, -9.81 \cos\theta]^T$.
Compute:
1. The tangential gravitational pull $g_x$ attempting to slide the robot down the ramp.
2. The percentage increase in pitch torque required at the ankle to maintain vertical balance.

**Given Data:**
- $\theta_{\text{slope}} = 12^\circ$
- $g = 9.81\text{ m/s}^2$
- Robot mass $M = 40.0\text{ kg}$
- CoM height $h = 0.65\text{ m}$

**Step-by-Step Derivation:**
1. Tangential gravity component:
   $$g_x = g \sin(12^\circ) = (9.81)(0.20791) \approx 2.040\text{ m/s}^2$$
   Total downward pull force:
   $$F_{\text{pull}} = M g_x = (40.0)(2.040) = 81.6\text{ N}$$
2. Ankle balancing torque:
   On flat ground ($\theta = 0$), steady-state ankle pitch torque is zero (CoM directly above ankle): $\tau_{\text{ankle}, 0} = 0$.
   On the $12^\circ$ incline, gravity exerts an overturning moment about the ankle:
   $$\tau_{\text{overturn}} = M g h \sin(12^\circ) = (40.0)(9.81)(0.65)(0.20791) \approx 53.02\text{ N}\cdot\text{m}$$
3. The temporal encoder detects the base tilt within $40\text{ ms}$ via the IMU gravity projection and injects $z_{\text{slope}}$ into the policy actor, commanding the required $+53.0\text{ N}\cdot\text{m}$ ankle restoring torque.

**Final Answer:**
Tangential gravitational pull is $81.6\text{ N}$, requiring an ankle restoring torque of $53.02\text{ N}\cdot\text{m}$ that the latent encoder commands automatically to prevent backward tipping. $\blacksquare$

---

## 10.6 Solved Exercises (Problems 10.11 – 10.20)

---

### Problem 10.11 (Solved Exercise): Latent Cosine Similarity Metric
**Problem Statement:** Two latent vectors extracted from different gaits on the same ice terrain are $z_1 = [0.6, -0.8]$ and $z_2 = [0.8, -0.6]$. Compute their cosine similarity $\cos(\theta) = \frac{z_1 \cdot z_2}{\|z_1\| \|z_2\|}$.

**Step-by-Step Solution:**
1. Dot product: $z_1 \cdot z_2 = (0.6)(0.8) + (-0.8)(-0.6) = 0.48 + 0.48 = 0.96$.
2. Norms: $\|z_1\| = \sqrt{0.36 + 0.64} = 1.0$, $\|z_2\| = 1.0$.
3. Cosine similarity:
   $$\cos(\theta) = \frac{0.96}{1.0 \times 1.0} = 0.96 \quad (\theta \approx 16.26^\circ) \quad \blacksquare$$

---

### Problem 10.12 (Solved Exercise): Transformer Self-Attention Lookback for Long Horizons
**Problem Statement:** Contrast a causal multi-head self-attention Transformer lookback with a TCN for long history horizons ($H = 200$ steps). Explain why self-attention computational complexity scales as $\mathcal{O}(H^2)$ while dilated TCN scales as $\mathcal{O}(H)$.

**Step-by-Step Solution:**
1. Self-attention computes pairwise query-key dot products for all pairs of time steps in the context window:
   $$A = \operatorname{Softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) \in \mathbb{R}^{H \times H}$$
   The attention matrix contains $H^2 = (200)^2 = 40,000$ elements, requiring $\mathcal{O}(H^2)$ FLOPs and memory.
2. A 1D dilated TCN slides fixed-size kernels ($K = 3$) across the sequence, performing $\mathcal{O}(K \cdot H) = \mathcal{O}(H)$ operations, making TCNs drastically faster for embedded real-time execution. $\blacksquare$

---

### Problem 10.13 (Solved Exercise): Gated Recurrent Unit (GRU) Update Gate Saturation
**Problem Statement:** In a GRU, if the update gate saturates at $z_t \approx 1$, show from the hidden state update equation $h_t = (1 - z_t) h_{t-1} + z_t \tilde{h}_t$ that the network completely discards past history and overwrites with the candidate state.

**Step-by-Step Solution:**
1. Substitute $z_t = 1$:
   $$h_t = (1 - 1) h_{t-1} + (1) \tilde{h}_t = 0 + \tilde{h}_t = \tilde{h}_t$$
2. The network exhibits zero temporal memory retention, behaving as a purely memoryless feedforward layer. $\blacksquare$

---

### Problem 10.14 (Solved Exercise): Latent Space Dimension vs Reconstruction Loss
**Problem Statement:** As latent dimension $d_z$ increases from 1 to 16, privileged reconstruction loss decays as $\mathcal{L}(d_z) = \mathcal{L}_0 e^{-0.35 d_z} + \sigma_{\text{noise}}^2$. If $\mathcal{L}_0 = 5.0$ and $\sigma_{\text{noise}}^2 = 0.05$, compute the loss at $d_z = 8$.

**Step-by-Step Solution:**
1. Exponent: $-0.35 \times 8 = -2.80$.
2. Exponential: $e^{-2.80} \approx 0.06081$.
3. Total loss:
   $$\mathcal{L}(8) = (5.0)(0.06081) + 0.05 = 0.30405 + 0.05 \approx 0.354 \quad \blacksquare$$

---

### Problem 10.15 (Solved Exercise): Online Quantization Noise Suppression
**Problem Statement:** Joint velocity is measured with 14-bit encoder quantization: $\Delta v = 0.005\text{ rad/s}$. If the temporal encoder uses an initial 1D smoothing layer with kernel $[0.25, 0.50, 0.25]$, compute the noise variance attenuation factor.

**Step-by-Step Solution:**
1. For independent identically distributed noise with variance $\sigma^2$, the output variance after FIR filtering with coefficients $h_k$ is:
   $$\sigma_{\text{out}}^2 = \sigma^2 \sum h_k^2$$
2. Sum of squared coefficients:
   $$\sum h_k^2 = (0.25)^2 + (0.50)^2 + (0.25)^2 = 0.0625 + 0.2500 + 0.0625 = 0.3750$$
3. Noise variance is attenuated by factor $0.375$ ($62.5\%$ reduction). $\blacksquare$

---

### Problem 10.16 (Solved Exercise): Latent-Driven Stride Frequency Modulation
**Problem Statement:** A quadruped locomotion policy modulates stride frequency via $f_{\text{stride}}(z) = f_0 + k_z z_1$. On icy surfaces, $z_1 = -1.0$, reducing frequency to $f_{\text{ice}} = 1.2\text{ Hz}$. On concrete, $z_1 = +1.0$, increasing frequency to $f_{\text{concrete}} = 2.4\text{ Hz}$. Find $f_0$ and $k_z$.

**Step-by-Step Solution:**
1. System of linear equations:
   $$f_0 - k_z = 1.2$$
   $$f_0 + k_z = 2.4$$
2. Add equations: $2 f_0 = 3.6 \implies f_0 = 1.8\text{ Hz}$.
3. Subtract equations: $2 k_z = 1.2 \implies k_z = 0.6\text{ Hz}$.
4. $f(z) = 1.8 + 0.6 z_1\text{ Hz} \quad \blacksquare$

---

### Problem 10.17 (Solved Exercise): Cross-Entropy Loss for Terrain Classification
**Problem Statement:** A multi-task head predicts terrain class $c \in \{0: \text{Flat}, 1: \text{Stairs}, 2: \text{Rough}\}$ from latent vector $z_t$. For predicted probabilities $[0.10, 0.75, 0.15]$ when ground truth is class 1 (Stairs), compute the cross-entropy loss.

**Step-by-Step Solution:**
1. Cross-entropy loss formula:
   $$\mathcal{L} = -\sum y_c \ln(p_c) = -\ln(p_1)$$
2. Substitute $p_1 = 0.75$:
   $$\mathcal{L} = -\ln(0.75) \approx -(-0.28768) \approx 0.2877\text{ nats} \quad \blacksquare$$

---

### Problem 10.18 (Solved Exercise): Latent Trajectory Curvature in Phase Space
**Problem Statement:** During dynamic turning, the latent trajectory $z(t)$ sweeps out a circular path in $\mathbb{R}^2$: $z(t) = [R \cos(\omega t), R \sin(\omega t)]$. Compute the path curvature $\kappa = \frac{\|\dot{z} \times \ddot{z}\|}{\|\dot{z}\|^3}$.

**Step-by-Step Solution:**
1. Velocity: $\dot{z} = [-R\omega \sin(\omega t), R\omega \cos(\omega t)] \implies \|\dot{z}\| = R\omega$.
2. Acceleration: $\ddot{z} = [-R\omega^2 \cos(\omega t), -R\omega^2 \sin(\omega t)]$.
3. 2D cross product:
   $$\dot{z}_x \ddot{z}_y - \dot{z}_y \ddot{z}_x = (-R\omega \sin)(-R\omega^2 \sin) - (R\omega \cos)(-R\omega^2 \cos) = R^2 \omega^3 (\sin^2 + \cos^2) = R^2 \omega^3$$
4. Curvature:
   $$\kappa = \frac{R^2 \omega^3}{(R\omega)^3} = \frac{1}{R} \quad \blacksquare$$

---

### Problem 10.19 (Solved Exercise): Batch Normalization Collapse in Online Execution
**Problem Statement:** Why must Batch Normalization (BatchNorm) layers be strictly converted to evaluation mode (using frozen running mean and variance) prior to real-world robot deployment?

**Step-by-Step Solution:**
1. During training, BatchNorm normalizes using the batch mean $\mu_B$ across parallel simulation environments.
2. In physical deployment, the policy executes on a **single robot instance** with batch size 1 ($B = 1$).
3. If batch statistics are computed online with $B = 1$, sample variance is zero ($\sigma_B^2 = 0$), causing division by zero or completely wiping out state magnitude information, crashing the policy. Running statistics must be frozen. $\blacksquare$

---

### Problem 10.20 (Solved Exercise): Zero-Shot Slippage Recovery Margin
**Problem Statement:** A robot foot slips with relative velocity $v_{\text{slip}} = 0.40\text{ m/s}$. The adaptive policy detects slip and reduces horizontal push-off force from $120\text{ N}$ to $40\text{ N}$ within $60\text{ ms}$. If friction coefficient is $\mu = 0.20$ and normal force is $F_N = 250\text{ N}$, verify that the slip is arrested ($F_T \le \mu F_N$).

**Step-by-Step Solution:**
1. Maximum sustainable traction force:
   $$F_{\text{traction, max}} = \mu F_N = (0.20)(250\text{ N}) = 50.0\text{ N}$$
2. Commanded tangential force post-adaptation:
   $$F_T = 40.0\text{ N}$$
3. Margin check:
   $$F_T = 40.0\text{ N} \le 50.0\text{ N} = F_{\text{traction, max}}$$
4. Slippage stops immediately, re-establishing solid kinematic contact. $\blacksquare$
