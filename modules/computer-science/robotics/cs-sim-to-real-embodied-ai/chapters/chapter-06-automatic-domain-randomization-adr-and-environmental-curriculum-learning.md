# Chapter 6: Automatic Domain Randomization (ADR) and Environmental Curriculum Learning

## 6.1 Introduction: The Brittle Bottleneck of Manual Domain Randomization

In standard manual Domain Randomization (DR), an engineer sits before a configuration file specifying hundreds of lower and upper sampling bounds:
$$\xi_i \sim \mathcal{U}(\xi_{\min}^{(i)}, \xi_{\max}^{(i)})$$

This manual approach suffers from three crippling flaws:
1. **Combinatorial Hyperparameter Explosion:** For an embodied robot with 10 links, 12 actuators, 4 contact feet, and vision sensors, the parameter vector $\xi$ easily spans $D > 100$ dimensions. Finding the optimal interval $[\xi_{\min}^{(i)}, \xi_{\max}^{(i)}]$ for each parameter requires tuning $2D > 200$ continuous scalar hyperparameters—an impossible grid search.
2. **The "Too Narrow vs Too Wide" Dilemma:** If the human engineer sets bounds too conservatively (e.g., mass $\pm 5\%$, friction $\pm 10\%$), the policy overfits to simulation and fails immediately on hardware. If the engineer sets bounds too ambitiously (e.g., mass $\pm 300\%$, latency $0\text{ to }100\text{ ms}$), the initial policy cannot even take a single step; training stalls in policy paralysis, and the gradient vanishes.
3. **Absence of Pedagogical Progression (No Curriculum):** Human athletes do not learn to sprint by being thrown onto black ice carrying a $50\text{ kg}$ backpack while blindfolded. Mastery proceeds through a structured curriculum: start in a predictable, benign environment, master fundamental coordination, and progressively expand the envelope of physical difficulty.

To automate this process and eliminate manual tuning, OpenAI introduced **Automatic Domain Randomization (ADR)** in their seminal robotic manipulation work (OpenAI et al., 2019, *Solving Rubik's Cube with a Robot Hand*). ADR transforms domain randomization from a static manual guess into an **autonomous adaptive curriculum**.

```
+---------------------------------------------------------------------------------------------------+
|                        AUTOMATIC DOMAIN RANDOMIZATION (ADR) ARCHITECTURE                          |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Physics Simulator Environment                                                                  |
|    xi_i ~ U(phi_L^(i), phi_H^(i))                                                                 |
|         │                                                                                         |
|         ▼                                                                                         |
|    Rollout Policy Execution ────► Performance Evaluation Metric P(tau)                            |
|                                         │                                                         |
|                                         ▼                                                         |
|    [ ADR Boundary Evaluation Queue ]                                                             |
|    Is performance evaluated at current boundary phi_L^(i) or phi_H^(i)?                           |
|                                         │                                                         |
|         ┌───────────────────────────────┴───────────────────────────────┐                         |
|         ▼                                                               ▼                         |
|    If P_mean >= t_high                                             If P_mean <= t_low             |
|    (Policy has MASTERED current difficulty!)                       (Policy is FAILING/STRUGGLING!)|
|         │                                                               │                         |
|         ▼                                                               ▼                         |
|    EXPAND BOUNDARY:                                                CONTRACT BOUNDARY:             |
|    phi_H^(i) += Delta_step                                         phi_H^(i) -= Delta_step         |
|    phi_L^(i) -= Delta_step                                         phi_L^(i) += Delta_step         |
|         │                                                               │                         |
|         └───────────────────────────────┬───────────────────────────────┘                         |
|                                         ▼                                                         |
|    Updated Parameter Envelope [phi_L^(i), phi_H^(i)] ────► Asymptotic Universal Generalization    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 6.2 The Mathematical Mechanics of ADR

Let $\phi = (\phi_L, \phi_H) \in \mathbb{R}^{2D}$ represent the parameter envelope bounding the randomized physical environment:
$$\xi_i \sim P(\xi_i; \phi_L^{(i)}, \phi_H^{(i)})$$

At the start of training ($t = 0$), the envelope is initialized to a minuscule neighborhood around the nominal CAD model:
$$\phi_L^{(i)}(0) = \xi_{\text{nominal}}^{(i)} - \epsilon, \quad \phi_H^{(i)}(0) = \xi_{\text{nominal}}^{(i)} + \epsilon$$

In this benign environment, standard RL algorithms (such as PPO or SAC) rapidly converge to high task reward.

### 6.2.1 Boundary Sampling and Gating Thresholds
To determine whether the policy is ready for greater difficulty, ADR periodically samples environments **specifically at the current boundary edges**:
- Sample at lower boundary: $\xi_i = \phi_L^{(i)}$
- Sample at upper boundary: $\xi_i = \phi_H^{(i)}$

The task performance on boundary rollouts is recorded in an empirical performance buffer $\mathcal{B}_{\text{eval}}$. The mean performance $\bar{P}$ is compared against two fixed thresholds:
- $t_{\text{high}}$: The **mastery threshold** (e.g., $80\%$ task success rate).
- $t_{\text{low}}$: The **failure threshold** (e.g., $40\%$ task success rate).

### 6.2.2 Boundary Update Rule
For upper boundary $\phi_H^{(i)}$:
$$\phi_H^{(i)} \leftarrow \begin{cases}
\phi_H^{(i)} + \Delta^{(i)}, & \text{if } \bar{P}(\phi_H^{(i)}) \ge t_{\text{high}} \quad \text{(Expand!)} \\
\max\left(\phi_H^{(i)} - \Delta^{(i)}, \xi_{\text{nominal}}^{(i)}\right), & \text{if } \bar{P}(\phi_H^{(i)}) \le t_{\text{low}} \quad \text{(Contract!)} \\
\phi_H^{(i)}, & \text{otherwise (Maintain steady state)}
\end{cases}$$

For lower boundary $\phi_L^{(i)}$:
$$\phi_L^{(i)} \leftarrow \begin{cases}
\phi_L^{(i)} - \Delta^{(i)}, & \text{if } \bar{P}(\phi_L^{(i)}) \ge t_{\text{high}} \quad \text{(Expand!)} \\
\min\left(\phi_L^{(i)} + \Delta^{(i)}, \xi_{\text{nominal}}^{(i)}\right), & \text{if } \bar{P}(\phi_L^{(i)}) \le t_{\text{low}} \quad \text{(Contract!)} \\
\phi_L^{(i)}, & \text{otherwise}
\end{cases}$$

Here, $\Delta^{(i)}$ is the step size for parameter $i$. By dynamically expanding when capable and retreating when overmatched, ADR keeps the policy operating continuously within its **Zone of Proximal Development**.

---

## 6.3 Entropy-Regularized Policy Progression under ADR

In deep actor-critic methods, policy entropy $\mathcal{H}(\pi_\theta(\cdot \mid s))$ measures behavioral diversity and exploration:
$$\mathcal{H}(\pi_\theta) = -\mathbb{E}_{a \sim \pi_\theta}[\ln \pi_\theta(a \mid s)]$$

Under fixed-environment training, policy entropy naturally decays toward zero as the agent exploits the single optimal trajectory.

Under ADR, an extraordinary dynamic occurs:
- As boundaries expand ($\text{Vol}(\Xi) \uparrow$), the previously optimal deterministic action sequence no longer works across all sampled worlds.
- The policy must retain high entropy to hedge against physical uncertainty, developing memory and dynamic adaptation mechanisms.
- The expansion of ADR boundaries acts as an external **entropy pump**, preventing premature policy collapse and driving the emergence of generalist athletic behaviors.

```
+---------------------------------------------------------------------------------------------------+
|                        ADR BOUNDARY EXPANSION VS POLICY RETURN                                    |
+---------------------------------------------------------------------------------------------------+
|  Envelope                                                                                         |
|  Width                                                                                            |
|  (phi_H - phi_L)                                                                                  |
|      ▲                                                            /                               |
|      │                                                           /  Continuous Boundary Expansion |
|      │                                                          /   (Self-Paced Curriculum)       |
|      │                                     /───────────────────/                                  |
|      │                                    /  Plateau: Policy learning                             |
|      │                                   /   to handle friction drop                              |
|      │                     /────────────/                                                         |
|      │                    /                                                                       |
|      │  Initial Seed     /                                                                        |
|      │  [Nominal Physics]                                                                         |
|  ────┼───[══]───────────/─────────────────────────────────────────► Training Steps (Iterations)   |
|      0                                                                                            |
+---------------------------------------------------------------------------------------------------+
```

---

## 6.4 Worked Examples (Problems 6.1 – 6.10)

---

### Problem 6.1 (Worked Example): ADR Boundary Expansion Dynamics and Step Convergence
**Problem Statement:** In an ADR loop for a robot gripper, the object mass parameter $m$ is initialized at nominal $m_0 = 0.50\text{ kg}$ with initial envelope $[m_L, m_H] = [0.48, 0.52]\text{ kg}$. The expansion step is $\Delta m = 0.02\text{ kg}$. Upper threshold is $t_{\text{high}} = 0.85$, and the policy completes one evaluation batch every $10^5$ training steps.
If the policy achieves an average success rate of $92\%$ on the upper boundary across 15 consecutive evaluation cycles, compute:
1. The final upper mass bound $m_H(15)$.
2. The percentage expansion of the upper mass bound relative to nominal.

**Given Data:**
- Initial $m_H(0) = 0.52\text{ kg}$
- $\Delta m = 0.02\text{ kg}$
- $t_{\text{high}} = 0.85$
- Observed success rate: $P = 0.92 > t_{\text{high}}$ for all 15 cycles

**Step-by-Step Derivation:**
1. Since $P = 0.92 \ge t_{\text{high}}$ in every evaluation cycle, the expansion condition triggers at every step:
   $$m_H(k) = m_H(k-1) + \Delta m$$
2. After $N = 15$ cycles:
   $$m_H(15) = m_H(0) + N \cdot \Delta m = 0.52 + (15)(0.02) = 0.52 + 0.30 = 0.82\text{ kg}$$
3. Percentage expansion relative to nominal $m_0 = 0.50\text{ kg}$:
   $$\Delta\% = \frac{m_H(15) - m_0}{m_0} \times 100\% = \frac{0.82 - 0.50}{0.50} \times 100\% = \frac{0.32}{0.50} \times 100\% = +64.0\%$$

**Final Answer:**
The upper mass bound expands to $0.82\text{ kg}$, a $+64.0\%$ increase above nominal payload capacity achieved automatically through curriculum progression. $\blacksquare$

---

### Problem 6.2 (Worked Example): Contraction Mechanics under Environmental Over-Challenge
**Problem Statement:** An ADR curriculum expands the communication latency parameter upper bound to $\tau_H = 45\text{ ms}$. In the subsequent evaluation cycle, the robot's success rate at $\tau_H$ plunges to $P = 0.32$, falling below the lower contraction threshold $t_{\text{low}} = 0.40$. The contraction step size is $\Delta\tau = 3.0\text{ ms}$.
1. Compute the contracted upper bound $\tau_H'$.
2. If the policy requires 3 contraction cycles before stabilizing at an acceptable success rate ($P \ge t_{\text{low}}$), determine the stabilized latency bound.

**Given Data:**
- Current bound $\tau_H = 45.0\text{ ms}$
- $P = 0.32 < t_{\text{low}} = 0.40$
- Contraction step $\Delta\tau = 3.0\text{ ms}$

**Step-by-Step Derivation:**
1. Since $P \le t_{\text{low}}$, the contraction rule executes:
   $$\tau_H' = \tau_H - \Delta\tau = 45.0 - 3.0 = 42.0\text{ ms}$$
2. If the policy continues to struggle for 3 consecutive cycles:
   $$\tau_H(3) = \tau_H(0) - 3 \cdot \Delta\tau = 45.0 - 3(3.0) = 45.0 - 9.0 = 36.0\text{ ms}$$
3. At $\tau_H = 36.0\text{ ms}$, the task difficulty is within the policy's capacity, arresting the contraction and allowing the policy to consolidate its control representations.

**Final Answer:**
The boundary contracts to $42.0\text{ ms}$ on the first step and stabilizes at $36.0\text{ ms}$ after three cycles, preventing the catastrophic policy collapse that would have occurred under static, unyielding bounds. $\blacksquare$

---

### Problem 6.3 (Worked Example): Binomial Evaluation Queue Confidence Interval
**Problem Statement:** ADR evaluates policy success rate on an environment boundary using an evaluation queue of size $N = 100$ independent rollouts. In the queue, $K = 83$ successes are observed.
1. Compute the empirical success rate $\hat{p}$.
2. Using the normal approximation to the binomial distribution, compute the $95\%$ confidence interval for the true success rate $p$.
3. If $t_{\text{high}} = 0.80$, determine whether the lower bound of the $95\%$ confidence interval exceeds $t_{\text{high}}$ (justifying a statistically rigorous boundary expansion).

**Given Data:**
- $N = 100$
- $K = 83$
- $t_{\text{high}} = 0.80$
- $Z_{0.975} = 1.96$ for $95\%$ confidence

**Step-by-Step Derivation:**
1. Empirical success rate:
   $$\hat{p} = \frac{K}{N} = \frac{83}{100} = 0.83$$
2. Standard error of proportion:
   $$\operatorname{SE} = \sqrt{\frac{\hat{p}(1 - \hat{p})}{N}} = \sqrt{\frac{(0.83)(0.17)}{100}} = \sqrt{\frac{0.1411}{100}} = \sqrt{0.001411} \approx 0.03756$$
3. Margin of error:
   $$E = Z \cdot \operatorname{SE} = 1.96 \times 0.03756 \approx 0.07362$$
   $95\%$ Confidence Interval:
   $$p \in [\hat{p} - E, \hat{p} + E] = [0.83 - 0.0736, 0.83 + 0.0736] = [0.7564, 0.9036]$$
4. Evaluation:
   The lower bound of the confidence interval is $p_{\min} = 0.7564$, which is **strictly less than $t_{\text{high}} = 0.80$**!
   Even though the sample mean $\hat{p} = 0.83 > 0.80$, there is a non-negligible probability that the true success rate is below $80\%$.
   A risk-averse ADR engine requires $p_{\min} \ge t_{\text{high}}$ to expand, preventing premature difficulty escalation on statistical flukes.

**Final Answer:**
Sample success rate is $0.83$ with $95\%$ CI $[0.756, 0.904]$. Because the lower bound ($75.6\%$) does not clear $t_{\text{high}} = 80\%$, boundary expansion should be deferred until additional rollouts narrow the confidence interval. $\blacksquare$

---

### Problem 6.4 (Worked Example): Volume Growth of the Randomization Hypercube under ADR
**Problem Statement:** An ADR system controls $D = 6$ independent physical parameters (link mass, payload mass, friction, motor damping, delay, sensor noise). Each parameter interval $[\phi_L^{(i)}, \phi_H^{(i)}]$ is initially of normalized width $W_0 = 0.10$. Over $T$ training epochs, every boundary expands by a factor of $3.5\times$ ($W_T = 0.35$).
Compute the ratio of the volume of the randomized environment space $\frac{\operatorname{Vol}(\Xi_T)}{\operatorname{Vol}(\Xi_0)}$.

**Given Data:**
- Dimension $D = 6$
- Initial width $W_0 = 0.10$
- Final width $W_T = 0.35$

**Step-by-Step Derivation:**
1. Initial hypercube volume:
   $$\operatorname{Vol}(\Xi_0) = W_0^D = (0.10)^6 = 10^{-6}$$
2. Final hypercube volume:
   $$\operatorname{Vol}(\Xi_T) = W_T^D = (0.35)^6 = 0.001838265625$$
3. Volume expansion ratio:
   $$\frac{\operatorname{Vol}(\Xi_T)}{\operatorname{Vol}(\Xi_0)} = \left(\frac{W_T}{W_0}\right)^D = (3.5)^6 \approx 1838.26$$

**Final Answer:**
A modest $3.5\times$ linear expansion across 6 parameters inflates the physical training environment volume by **over $1838\times$**, demonstrating how ADR smoothly scales training diversity by orders of magnitude without sudden policy shocks. $\blacksquare$

---

### Problem 6.5 (Worked Example): Asymmetric Boundary Expansion (Friction vs Sticking)
**Problem Statement:** In quadruped locomotion, ground friction coefficient $\mu$ has nominal value $\mu_0 = 0.80$. The physical lower limit is icy terrain ($\mu \approx 0.05$), while the upper limit is sticky rubber ($\mu \approx 1.50$).
If the policy easily masters high friction ($\mu \uparrow$) but struggles with foot slip ($\mu \downarrow$), explain why decoupled asymmetric boundary updates $[\phi_L, \phi_H]$ are necessary and calculate the expansion steps if $\bar{P}(\phi_H) = 0.95$ while $\bar{P}(\phi_L) = 0.45$ (with $t_{\text{high}} = 0.80, t_{\text{low}} = 0.50$).

**Given Data:**
- Current envelope: $[\phi_L, \phi_H] = [0.60, 1.10]$
- $\Delta\mu = 0.05$
- $\bar{P}(\phi_H) = 0.95 > t_{\text{high}} = 0.80$
- $\bar{P}(\phi_L) = 0.45 < t_{\text{low}} = 0.50$

**Step-by-Step Derivation:**
1. Evaluate upper boundary $\phi_H$:
   $$\bar{P}(\phi_H) = 0.95 \ge t_{\text{high}} \implies \text{Expand upper bound!}$$
   $$\phi_H' = \phi_H + \Delta\mu = 1.10 + 0.05 = 1.15$$
2. Evaluate lower boundary $\phi_L$:
   $$\bar{P}(\phi_L) = 0.45 \le t_{\text{low}} \implies \text{Contract lower bound!}$$
   $$\phi_L' = \phi_L + \Delta\mu = 0.60 + 0.05 = 0.65$$
3. New envelope:
   $$[\phi_L', \phi_H'] = [0.65, 1.15]$$

**Final Answer:**
Decoupled boundaries allow the upper bound to expand to $1.15$ while the lower bound retreats to $0.65$, shifting the curriculum distribution toward domains where the policy maintains positive learning signals and avoiding unrecoverable slippage failures. $\blacksquare$

---

### Problem 6.6 (Worked Example): Entropy Maintenance under ADR Curriculum
**Problem Statement:** A continuous action policy outputs Gaussian actions $a \sim \mathcal{N}(\mu_\theta(s), \Sigma_\theta(s))$ with diagonal covariance matrix $\Sigma = \operatorname{diag}(\sigma_1^2, \dots, \sigma_m^2)$ for $m = 4$ actuated joints.
Under standard static simulation, standard deviations decay to $\sigma_i = 0.02\text{ rad}$. Under ADR, boundary expansion forces exploration, maintaining $\sigma_i = 0.08\text{ rad}$.
Compute the difference in differential policy entropy $\Delta\mathcal{H} = \mathcal{H}_{\text{ADR}} - \mathcal{H}_{\text{static}}$ in nats.

**Given Data:**
- Action dimension $m = 4$
- $\sigma_{\text{static}} = 0.02$
- $\sigma_{\text{ADR}} = 0.08$

**Step-by-Step Derivation:**
1. Differential entropy of an $m$-dimensional multivariate Gaussian:
   $$\mathcal{H} = \frac{1}{2} \ln\left((2\pi e)^m |\Sigma|\right) = \frac{m}{2} \ln(2\pi e) + \sum_{i=1}^m \ln(\sigma_i)$$
2. Entropy difference:
   $$\Delta\mathcal{H} = \sum_{i=1}^m \ln(\sigma_{\text{ADR}}) - \sum_{i=1}^m \ln(\sigma_{\text{static}}) = m \ln\left(\frac{\sigma_{\text{ADR}}}{\sigma_{\text{static}}}\right)$$
3. Substitute numerical values:
   $$\frac{\sigma_{\text{ADR}}}{\sigma_{\text{static}}} = \frac{0.08}{0.02} = 4.0$$
   $$\Delta\mathcal{H} = 4 \times \ln(4.0) = 4 \times 1.38629 \approx 5.545\text{ nats}$$

**Final Answer:**
ADR preserves $+5.545\text{ nats}$ of policy entropy, preventing the policy from freezing into narrow deterministic habits and ensuring agile responsiveness to unexpected physical disturbances. $\blacksquare$

---

### Problem 6.7 (Worked Example): Curriculum Scheduling for Contact Stiffness
**Problem Statement:** Simulating stiff contact ($k = 10^7\text{ N/m}$) requires tiny simulation timesteps ($\Delta t < 0.1\text{ ms}$) and produces discontinuous gradients that disrupt early RL exploration.
An ADR curriculum parameterizes virtual contact spring stiffness via:
$$k(t) = k_{\min} \cdot \left(\frac{k_{\max}}{k_{\min}}\right)^{\min(1, t / T_{\text{warmup}})}$$
with $k_{\min} = 10^4\text{ N/m}$, $k_{\max} = 10^7\text{ N/m}$, and warmup duration $T_{\text{warmup}} = 5 \times 10^6\text{ steps}$.
Compute the effective contact stiffness at $t = 2.5 \times 10^6\text{ steps}$ ($50\%$ warmup).

**Given Data:**
- $k_{\min} = 10^4\text{ N/m}$
- $k_{\max} = 10^7\text{ N/m}$
- $t / T_{\text{warmup}} = 0.50$

**Step-by-Step Derivation:**
1. Ratio of maximum to minimum stiffness:
   $$\frac{k_{\max}}{k_{\min}} = \frac{10^7}{10^4} = 10^3 = 1000$$
2. Evaluate at $50\%$ warmup:
   $$k(2.5 \times 10^6) = 10^4 \times (1000)^{0.50} = 10^4 \times \sqrt{1000} \approx 10^4 \times 31.62277 \approx 3.162 \times 10^5\text{ N/m}$$

**Final Answer:**
At the midpoint of curriculum warmup, contact stiffness reaches $3.16 \times 10^5\text{ N/m}$ (the geometric mean of initial and final values), providing smooth contact gradients early while ensuring physical rigidity by completion. $\blacksquare$

---

### Problem 6.8 (Worked Example): ADR Parameter Selection Probability (Bandit Allocation)
**Problem Statement:** An advanced ADR framework employs a multi-armed bandit to allocate evaluation episodes across $D = 4$ candidate physical parameters: $\{\text{Mass}, \text{Friction}, \text{Delay}, \text{Backlash}\}$. The bandit uses Boltzmann (Softmax) exploration over parameter learning progress $\Delta_i$:
$$P_i = \frac{e^{\Delta_i / \tau_{\text{temp}}}}{\sum_{j=1}^4 e^{\Delta_j / \tau_{\text{temp}}}}$$
Measured learning progress values are: $\Delta_{\text{mass}} = 0.25$, $\Delta_{\text{fric}} = 0.60$, $\Delta_{\text{delay}} = 0.10$, $\Delta_{\text{back}} = 0.05$.
For temperature $\tau_{\text{temp}} = 0.20$, compute the sampling probability for each parameter.

**Given Data:**
- $\Delta = [0.25, 0.60, 0.10, 0.05]$
- $\tau_{\text{temp}} = 0.20$

**Step-by-Step Derivation:**
1. Compute scaled exponents $\Delta_i / \tau_{\text{temp}}$:
   - Mass: $0.25 / 0.20 = 1.25 \implies e^{1.25} \approx 3.4903$
   - Friction: $0.60 / 0.20 = 3.00 \implies e^{3.00} \approx 20.0855$
   - Delay: $0.10 / 0.20 = 0.50 \implies e^{0.50} \approx 1.6487$
   - Backlash: $0.05 / 0.20 = 0.25 \implies e^{0.25} \approx 1.2840$
2. Sum of exponents:
   $$\Sigma = 3.4903 + 20.0855 + 1.6487 + 1.2840 = 26.5085$$
3. Compute probabilities:
   $$P_{\text{mass}} = \frac{3.4903}{26.5085} \approx 0.1317 = 13.17\%$$
   $$P_{\text{fric}} = \frac{20.0855}{26.5085} \approx 0.7577 = 75.77\%$$
   $$P_{\text{delay}} = \frac{1.6487}{26.5085} \approx 0.0622 = 6.22\%$$
   $$P_{\text{back}} = \frac{1.2840}{26.5085} \approx 0.0484 = 4.84\%$$

**Final Answer:**
Friction receives $75.8\%$ of training episodes because it exhibits the highest learning progress, dynamically focusing computational resources where the policy is experiencing rapid adaptation. $\blacksquare$

---

### Problem 6.9 (Worked Example): Boundary Contraction Hysteresis Proof
**Problem Statement:** Prove that to prevent high-frequency limit cycles (chatter) where an ADR boundary continually expands and contracts on consecutive iterations, the threshold gap $\Delta t = t_{\text{high}} - t_{\text{low}}$ must strictly exceed twice the standard deviation of the performance evaluation estimator:
$$\Delta t > 2 \sigma_P$$

**Step-by-Step Derivation:**
1. Let the true policy performance on the boundary be $P_0$.
2. Due to finite evaluation batch size $N$, the measured performance is a random variable:
   $$\hat{P} = P_0 + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma_P^2)$$
3. If $t_{\text{high}} \approx t_{\text{low}}$ (no hysteresis gap):
   Suppose $P_0 \approx t_{\text{high}}$.
   - On iteration $k$: a positive noise fluctuation causes $\hat{P} \ge t_{\text{high}}$, triggering boundary expansion $\phi \leftarrow \phi + \Delta$.
   - On iteration $k+1$: the boundary is harder, and a negative noise fluctuation causes $\hat{P} \le t_{\text{low}}$, triggering boundary contraction $\phi \leftarrow \phi - \Delta$.
4. The boundary chattering frequency is governed by the probability of crossing both thresholds under noise:
   $$P(\text{Chatter}) = P(\hat{P}_1 \ge t_{\text{high}}) \cdot P(\hat{P}_2 \le t_{\text{low}})$$
5. To suppress chatter to less than $2.5\%$, the separation between thresholds must accommodate the $2\sigma$ confidence interval of the estimator:
   $$t_{\text{high}} - t_{\text{low}} > 2 \sigma_P$$

**Final Answer:**
Setting a finite hysteresis deadband $t_{\text{high}} - t_{\text{low}} > 2\sigma_P$ guarantees that random measurement noise cannot trigger alternating expansion and contraction cycles, stabilizing ADR curriculum dynamics. $\blacksquare$

---

### Problem 6.10 (Worked Example): Asymptotic Generalization Bound under Infinite ADR Expansion
**Problem Statement:** Let $\Xi_k$ be the sequence of expanding compact dynamics parameter sets generated by ADR: $\Xi_0 \subset \Xi_1 \subset \Xi_2 \subset \dots \subset \mathbb{R}^D$.
If physical reality $\xi_{\text{real}}$ belongs to a bounded domain $\Omega_{\text{real}}$, and policy performance is uniformly equicontinuous, state and prove the asymptotic zero-shot transfer theorem.

**Step-by-Step Derivation:**
1. Given $\Omega_{\text{real}}$ is bounded, there exists a finite radius $R_{\text{real}}$ such that $\Omega_{\text{real}} \subset B(0, R_{\text{real}})$.
2. Under the ADR expansion rule with minimum step $\Delta_{\min} > 0$:
   If the policy maintains performance $\ge t_{\text{high}}$, the boundary coordinates expand monotonically:
   $$\lim_{k \to \infty} \phi_H^{(i)}(k) = +\infty, \quad \lim_{k \to \infty} \phi_L^{(i)}(k) = -\infty$$
3. Therefore, the sequence of sets $\Xi_k$ forms an open cover of $\mathbb{R}^D$:
   $$\bigcup_{k=0}^\infty \Xi_k = \mathbb{R}^D \supset \Omega_{\text{real}}$$
4. Since $\Omega_{\text{real}}$ is compact, by the Heine-Borel theorem, there exists a finite iteration $K^*$ such that:
   $$\Omega_{\text{real}} \subset \Xi_{K^*}$$
5. For all iterations $k \ge K^*$, physical reality $\xi_{\text{real}}$ is an interior point of the training domain $\Xi_k$:
   $$\xi_{\text{real}} \in \Xi_k$$
   By uniform convergence of empirical risk minimization, the real-world policy performance satisfies $J(\pi_\theta; \xi_{\text{real}}) \ge t_{\text{low}}$.

**Final Answer:**
Monotonic boundary expansion guarantees that in finite time $K^*$, physical reality becomes an interior subset of the training distribution ($\Omega_{\text{real}} \subset \Xi_{K^*}$), guaranteeing zero-shot transfer without physical fine-tuning. $\blacksquare$

---

## 6.5 Solved Exercises (Problems 6.11 – 6.20)

---

### Problem 6.11 (Solved Exercise): Exponential Moving Average (EMA) Performance Smoothing
**Problem Statement:** In an ADR loop, performance is filtered via an Exponential Moving Average (EMA): $\bar{P}_k = \alpha P_k + (1 - \alpha) \bar{P}_{k-1}$ with smoothing factor $\alpha = 0.20$. If current smoothed performance is $\bar{P}_0 = 0.70$ and a sudden drop occurs where $P_k = 0.30$ for all subsequent iterations, compute how many iterations are required for $\bar{P}_k$ to fall below $t_{\text{low}} = 0.40$.

**Step-by-Step Solution:**
1. Closed-form EMA step response:
   $$\bar{P}_k = P_{\infty} + (\bar{P}_0 - P_{\infty})(1 - \alpha)^k = 0.30 + (0.70 - 0.30)(0.80)^k = 0.30 + 0.40(0.80)^k$$
2. Set $\bar{P}_k = 0.40$:
   $$0.30 + 0.40(0.80)^k = 0.40 \implies 0.40(0.80)^k = 0.10 \implies (0.80)^k = 0.25$$
3. Solve for $k$:
   $$k \ln(0.80) = \ln(0.25) \implies k(-0.22314) = -1.38629 \implies k = \frac{1.38629}{0.22314} \approx 6.21\text{ iterations} \implies k = 7\text{ iterations} \quad \blacksquare$$

---

### Problem 6.12 (Solved Exercise): Parameter Boundary Clamping at Physical Limits
**Problem Statement:** Motor torque constant $K_t$ has physical lower bound $K_{t, \min} = 0.01\text{ N}\cdot\text{m/A}$ (zero torque limit). If ADR attempts to expand the lower boundary below zero, formulate the projection operator that prevents unphysical negative torque constants.

**Step-by-Step Solution:**
1. Physical realism constraint: $K_t > 0$.
2. The projected ADR update rule is:
   $$\phi_L \leftarrow \max\left( \phi_L - \Delta, K_{t, \text{physical\_min}} \right)$$
3. If $\phi_L = 0.015$ and $\Delta = 0.010$:
   $$\phi_L' = \max(0.015 - 0.010, 0.010) = \max(0.005, 0.010) = 0.010\text{ N}\cdot\text{m/A} \quad \blacksquare$$

---

### Problem 6.13 (Solved Exercise): Multi-Task Curriculum Scheduling vs ADR
**Problem Statement:** Contrast Teacher-Guided Multi-Task Curriculum (where tasks $T_1, T_2, T_3$ are sequenced by human design) with ADR. Explain why ADR eliminates catastrophic forgetting during task transitions.

**Step-by-Step Solution:**
1. Sequential task curricula train on $T_1$, then switch to $T_2$, then $T_3$. During training on $T_2$, policy weights overwrite $T_1$ representations (**catastrophic forgetting**).
2. ADR maintains a single expanding distribution: when boundaries widen, samples are drawn uniformly across the *entire* accumulated volume $\Xi$.
3. The policy continually revisits nominal and intermediate environments, preserving past competencies while acquiring new ones. $\blacksquare$

---

### Problem 6.14 (Solved Exercise): Logarithmic Parameter Expansion for Positive Scales
**Problem Statement:** For positive scale parameters (e.g., joint viscous friction $c$), ADR updates boundaries in log-space: $\ln \phi_H \leftarrow \ln \phi_H + \delta_{\log}$. For $\delta_{\log} = 0.15$, compute the multiplicative expansion factor of the upper bound.

**Step-by-Step Solution:**
1. Exponentiate the update:
   $$\phi_H' = \exp(\ln \phi_H + \delta_{\log}) = \phi_H \cdot e^{\delta_{\log}}$$
2. Multiplicative factor:
   $$\gamma = e^{0.15} \approx 1.1618$$
3. Each expansion step widens the bound by exactly $+16.18\%$ in physical units, preserving scale invariance. $\blacksquare$

---

### Problem 6.15 (Solved Exercise): Gradient Starvation in High-Dimensional ADR
**Problem Statement:** Explain the phenomenon of "Gradient Starvation" when ADR simultaneously expands 50 physical parameters. Why do dominant parameters (e.g., total mass) monopolize policy gradient updates while subtle parameters (e.g., motor inductance) remain un-adapted?

**Step-by-Step Solution:**
1. The policy gradient is $\nabla_\theta J = \mathbb{E}\left[ \sum_t \nabla_\theta \ln \pi(a_t \mid s_t) A(s_t, a_t) \right]$.
2. If total mass error causes large reward penalties ($R \approx -100$), its gradient component $\|\nabla_\theta J_{\text{mass}}\|$ is orders of magnitude larger than that of motor inductance ($\|\nabla_\theta J_{\text{inductance}}\| \approx 0.01$).
3. Stochastic gradient descent steps along the dominant eigenvector of the Fisher matrix, starving subtle parameters of gradient updates until mass performance saturates. $\blacksquare$

---

### Problem 6.16 (Solved Exercise): Asymmetric Rollout Allocation between Interior and Boundaries
**Problem Statement:** In an ADR rollout budget of $M = 10,000$ episodes per epoch, $70\%$ are allocated to interior training ($\xi \sim \mathcal{U}(\phi_L, \phi_H)$) and $30\%$ are allocated to boundary evaluation across $D = 15$ parameters (each having lower and upper boundaries). Compute how many rollouts each boundary receives.

**Step-by-Step Solution:**
1. Total boundary evaluation episodes:
   $$M_{\text{eval}} = 0.30 \times 10,000 = 3,000\text{ episodes}$$
2. Total number of boundaries:
   $$N_{\text{bounds}} = 2 \times D = 2 \times 15 = 30\text{ boundaries}$$
3. Episodes per boundary:
   $$n_{\text{per\_bound}} = \frac{3,000}{30} = 100\text{ episodes per boundary} \quad \blacksquare$$

---

### Problem 6.17 (Solved Exercise): Adversarial Boundary Probing (Minimax ADR)
**Problem Statement:** Instead of uniform boundary sampling, an adversarial module finds the worst-case parameter configuration: $\xi^* = \arg\min_{\xi \in [\phi_L, \phi_H]} J(\pi_\theta; \xi)$. If the adversary uses projected gradient ascent on policy loss, formulate the parameter update rule.

**Step-by-Step Solution:**
1. The adversary maximizes policy loss $\mathcal{L}(\theta; \xi)$:
   $$\xi \leftarrow \operatorname{Proj}_{[\phi_L, \phi_H]}\left( \xi + \eta \nabla_\xi \mathcal{L}(\theta; \xi) \right)$$
2. The projection operator clamps each component:
   $$\operatorname{Proj}_{[\phi_L, \phi_H]}(\xi_i) = \min\left(\phi_H^{(i)}, \max\left(\phi_L^{(i)}, \xi_i\right)\right) \quad \blacksquare$$

---

### Problem 6.18 (Solved Exercise): Co-adaptation of Robot Morphology and Control under ADR
**Problem Statement:** An ADR framework is extended to co-optimize link lengths $L_i \in [L_{\min}, L_{\max}]$. If leg length expands by $20\%$, compute the required percentage increase in actuator peak stall torque $\tau_{\max}$ to maintain constant maximum foot acceleration.

**Step-by-Step Solution:**
1. Foot linear acceleration is $a = L \ddot{\theta} = L \frac{\tau}{J}$.
2. Link inertia scales with $L^2$ ($J \propto m L^2$).
3. Acceleration relationship:
   $$a \propto L \frac{\tau}{m L^2} = \frac{\tau}{m L} \implies \tau \propto m L a$$
4. If length increases by $20\%$ ($L' = 1.20 L$) and mass increases proportionally ($m' = 1.20 m$):
   $$\tau' = (1.20)(1.20) \tau = 1.44 \tau$$
5. Peak stall torque must increase by $+44.0\%$. $\blacksquare$

---

### Problem 6.19 (Solved Exercise): Wasserstein Metric Contraction of ADR Curricula
**Problem Statement:** Let $P_k$ be the uniform distribution over $[\phi_L(k), \phi_H(k)]$. Compute the Wasserstein-1 distance $\mathcal{W}_1(P_k, P_{k+1})$ when the upper boundary expands by $\Delta$ with fixed lower boundary.

**Step-by-Step Solution:**
1. For two 1D distributions with CDFs $F_1(x)$ and $F_2(x)$:
   $$\mathcal{W}_1(P_1, P_2) = \int_{-\infty}^\infty |F_1(x) - F_2(x)| dx$$
2. Let $W = \phi_H - \phi_L$ and $W' = W + \Delta$.
   The difference between linear CDF slopes over the interval yields:
   $$\mathcal{W}_1 = \frac{\Delta}{2} \quad \blacksquare$$

---

### Problem 6.20 (Solved Exercise): Zero-Shot Sim-to-Real Success Rate Guarantee
**Problem Statement:** A policy achieves guaranteed success rate $P(\xi) \ge 1 - \delta$ for all $\xi \in \Xi_{\text{ADR}}$. If physical reality $\xi_{\text{real}}$ has epistemic calibration uncertainty modeled by probability density $p_{\text{real}}(\xi)$ with $\int_{\Xi_{\text{ADR}}} p_{\text{real}}(\xi) d\xi = 1 - \epsilon$, compute the lower bound on real-world expected success rate $P_{\text{real}}$.

**Step-by-Step Solution:**
1. Total real-world success probability:
   $$P_{\text{real}} = \int_{\Xi_{\text{ADR}}} P(\xi) p_{\text{real}}(\xi) d\xi + \int_{\mathbb{R}^D \setminus \Xi_{\text{ADR}}} P(\xi) p_{\text{real}}(\xi) d\xi$$
2. In the worst case, success is zero outside $\Xi_{\text{ADR}}$:
   $$P_{\text{real}} \ge (1 - \delta) \int_{\Xi_{\text{ADR}}} p_{\text{real}}(\xi) d\xi + 0 = (1 - \delta)(1 - \epsilon)$$
3. Expand:
   $$P_{\text{real}} \ge 1 - \delta - \epsilon + \delta \epsilon \approx 1 - (\delta + \epsilon) \quad \blacksquare$$
