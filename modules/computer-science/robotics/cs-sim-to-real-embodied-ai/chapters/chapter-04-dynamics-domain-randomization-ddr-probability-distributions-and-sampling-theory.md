# Chapter 4: Dynamics Domain Randomization (DDR) — Probability Distributions & Sampling Theory

## 4.1 Introduction: The Philosophy of Domain Randomization

In classical control theory, handling parameter discrepancies between a model and the real plant is formulated through the lens of robust control (e.g., $H_\infty$ synthesis, $\mu$-analysis, or sliding mode control). These methods seek a single controller that satisfies Lyapunov stability for all plants within a bounded uncertainty set $\Delta$:
$$\| \Delta \|_\infty \le \gamma$$

While mathematically rigorous, robust control suffers from severe conservatism when applied to high-dimensional, non-linear, discontinuous systems such as multi-contact legged locomotion or dexterous in-hand manipulation. To guarantee worst-case stability, the controller must assume that nature acts as an adversarial opponent actively seeking the most destabilizing physical perturbation at every millisecond. The resulting policies are excessively stiff, timid, or dynamically crippled.

In 2017, a radically different paradigm emerged from deep reinforcement learning: **Domain Randomization (DR)** (Tobin et al., 2017; Peng et al., 2018; OpenAI Dactyl, 2019). The core epistemological philosophy can be stated in a single maxim:

> *"Do not attempt to model the physical universe with infinite precision. Instead, randomize the simulated universe so aggressively across physics, geometry, and dynamics that physical reality—with all its unmodeled dirt, wear, and non-idealities—is merely an in-distribution sample from the training distribution."*

```
+---------------------------------------------------------------------------------------------------+
|                            THE DOMAIN RANDOMIZATION PARADIGM                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Idealized Physics Engine (Single Fixed Simulator)                                              |
|    [ Nominal m_0, I_0, mu_0, K_p0 ]  ────────► Neural Policy Overfits to Nominal Artifacts       |
|                                                (Fails on 1% Real-World Perturbation!)             |
|                                                                                                   |
|    Domain Randomization (Family of Simulators: xi ~ P(Xi))                                       |
|    ┌────────────────────────────────────────────────────────┐                                     |
|    │ Sim 1: m = 0.8 m_0, mu = 0.3, tau_delay = 10ms          │                                     |
|    │ Sim 2: m = 1.3 m_0, mu = 1.1, tau_delay = 35ms          │ ────► Robust Neural Policy          |
|    │ Sim 3: m = 1.0 m_0, mu = 0.7, backlash = 0.02 rad       │       Learns Universal Invariant    |
|    │ Sim K: ...                                             │       Sensorimotor Representations   |
|    └────────────────────────────────────────────────────────┘                                     |
|                                │                                                                  |
|                                ▼ ZERO-SHOT TRANSFER                                               |
|                    [ Physical Reality (xi_real in Xi) ]                                           |
|                    Robotic Hardware Succeeds on First Real-World Run!                             |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 4.2 Mathematical Formulation of Randomized Dynamics

Let $\mathcal{M}(\xi)$ represent a parameterized Markov Decision Process (MDP):
$$\mathcal{M}(\xi) = \langle \mathcal{S}, \mathcal{A}, \mathcal{P}_\xi, \mathcal{R}_\xi, \gamma, \rho_0 \rangle$$
where $\xi \in \Xi \subset \mathbb{R}^D$ is the **dynamics parameter vector** governing the physical laws of the simulated world.

The objective of Dynamics Domain Randomization (DDR) is to find a single policy $\pi_\theta(a \mid s)$ that maximizes the expected return across the entire distribution of randomized environments $P(\xi)$:
$$J(\theta) = \mathbb{E}_{\xi \sim P(\xi)} \left[ \mathbb{E}_{\tau \sim \pi_\theta, \mathcal{P}_\xi} \left[ \sum_{t=0}^\infty \gamma^t r(s_t, a_t; \xi) \right] \right]$$

### 4.2.1 The Randomized Parameter Vector $\xi$
A comprehensive DDR setup for a multi-link articulated robot perturbs hundreds of parameters simultaneously:
$$\xi = \begin{bmatrix}
m_1, \dots, m_K & \text{(Link masses)} \\
c_{x, 1}, c_{y, 1}, c_{z, 1}, \dots & \text{(Center of Mass offsets)} \\
I_{xx, i}, I_{yy, i}, I_{zz, i}, I_{xy, i}, \dots & \text{(Moments and products of inertia)} \\
\mu_{\text{coulomb}}, \mu_{\text{viscous}}, \mu_{\text{torsion}} & \text{(Contact and joint friction)} \\
e_{\text{restitution}} & \text{(Ground restitution coefficient)} \\
K_p, K_d & \text{(Actuator PD gains)} \\
\tau_{\text{delay}}, \sigma_{\text{jitter}} & \text{(Communication latency)} \\
\Delta\theta_{\text{backlash}} & \text{(Gearbox mechanical clearance)} \\
K_{\text{spring}}, D_{\text{damper}} & \text{(Contact surface compliance)}
\end{bmatrix}^T \in \mathbb{R}^D$$

---

## 4.3 Probability Distributions for Physical Parameters

Choosing the correct prior probability distribution $P(\xi_i)$ is critical to successful sim-to-real transfer. An inappropriate distribution either fails to cover physical reality or wastes vast computational budgets exploring physically absurd regimes.

```
+---------------------------------------------------------------------------------------------------+
|                        PROBABILITY DISTRIBUTIONS IN DOMAIN RANDOMIZATION                          |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. UNIFORM DISTRIBUTION: U(a, b)                                                                 |
|     - Best for: Center of mass offsets, joint angle offsets, mounting angle misalignment.         |
|     - Density: p(x) = 1 / (b - a)                                                                 |
|                                                                                                   |
|  2. LOG-UNIFORM DISTRIBUTION: Log-U(a, b)                                                         |
|     - Best for: Strictly positive scale parameters varying across orders of magnitude             |
|       (Friction coefficients \mu \in [0.1, 10.0], Joint damping c \in [0.001, 1.0]).              |
|     - Sample: x = exp(U(ln a, ln b))                                                              |
|     - Property: Scale-invariant! Equal probability per decade/octave.                             |
|                                                                                                   |
|  3. TRUNCATED GAUSSIAN: N_trunc(mu, sigma^2, a, b)                                                |
|     - Best for: Link masses, link lengths, motor torque constants.                                |
|     - Concentrates samples near CAD specification while rejecting negative or unphysical values.  |
|                                                                                                   |
|  4. BETA DISTRIBUTION: Beta(alpha, beta)                                                          |
|     - Best for: Bounded coefficients in [0, 1] (Restitution e \in [0, 1], Duty cycles).           |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 4.3.1 Log-Uniform Distributions and Scale Invariance
Consider a friction coefficient $\mu$ that can range from icy surfaces ($\mu = 0.05$) to sticky rubber on asphalt ($\mu = 1.5$).
If sampled from a standard Uniform distribution $\mathcal{U}(0.05, 1.5)$:
- Probability of sampling $\mu \in [0.05, 0.20]$ (ice/snow): $\frac{0.15}{1.45} \approx 10.3\%$.
- Probability of sampling $\mu \in [0.20, 1.50]$ (standard/high grip): $\frac{1.30}{1.45} \approx 89.7\%$.

The uniform sampler spends **nearly $90\%$ of its time on high-friction surfaces**, leaving the agent completely un-adapted to low-friction slip!

Under a **Log-Uniform distribution**:
$$\ln \xi \sim \mathcal{U}(\ln a, \ln b) \implies \xi = a \cdot \left(\frac{b}{a}\right)^u, \quad u \sim \mathcal{U}(0, 1)$$
The probability density function is:
$$p(\xi) = \frac{1}{\xi (\ln b - \ln a)}, \quad \xi \in [a, b]$$
Log-uniform sampling possesses **scale invariance**: the probability of the parameter falling within any proportional interval $[x, k x]$ is independent of $x$:
$$P(\xi \in [x, k x]) = \int_x^{k x} \frac{1}{\xi \ln(b/a)} d\xi = \frac{\ln(k x) - \ln x}{\ln(b/a)} = \frac{\ln k}{\ln(b/a)}$$
This guarantees that low-friction, medium-friction, and high-friction regimes receive equal representation during training.

---

## 4.4 The Trade-Off Between Robustness and Policy Paralysis

While domain randomization prevents overfitting to simulated physics, there is a fundamental bound on the allowable randomization radius $\Omega$:

```
+---------------------------------------------------------------------------------------------------+
|                        THE OVER-RANDOMIZATION CLIFF (POLICY PARALYSIS)                            |
+---------------------------------------------------------------------------------------------------+
|  Policy                                                                                           |
|  Performance                                                                                      |
|  (Return J)                                                                                       |
|      ▲                                                                                            |
|      │            Optimal Randomization Radius (Sweet Spot)                                       |
|      │                     ▼                                                                      |
|      │                 ╭──────╮                                                                   |
|      │                ╭╯      ╰╮                                                                  |
|      │               ╭╯        ╰╮                                                                 |
|      │  Under-DR    ╭╯          ╰╮   Over-DR: Policy Paralysis                                    |
|      │  (Overfits) ╭╯            ╰╮  (Agent freezes or learns sluggish, hyper-conservative gait)  |
|      │            ╭╯              ╰───────────────────────                                        |
|  ────┼────────────╯───────────────────────────────────────► Randomization Radius ||Xi||          |
|      0                                                                                            |
+---------------------------------------------------------------------------------------------------+
```

If the parameter distribution is widened excessively:
- Mass randomized to $\pm 300\%$.
- Friction randomized down to $\mu = 0.001$.
- Latency randomized up to $200\text{ ms}$.

A single fixed-weight neural policy without memory or online adaptation **cannot find any static action sequence that satisfies this entire physical family**.
To avoid falling over on ice, the robot must take tiny shuffling steps; to avoid falling over under high mass, the robot must push with maximum leg stiffness. These requirements are mutually contradictory. Confronted with impossible diversity, RL optimization collapses into **policy paralysis**: the robot freezes in place, locks its joints, or falls over immediately to minimize penalization.

---

## 4.5 Worked Examples (Problems 4.1 – 4.10)

---

### Problem 4.1 (Worked Example): Scale Invariance Proof for Log-Uniform Sampling
**Problem Statement:** Let a physical damping parameter $c \in [0.01, 10.0]\text{ N}\cdot\text{s/m}$ be sampled from a log-uniform distribution.
1. Derive the cumulative distribution function (CDF) $F_C(c)$.
2. Calculate the exact probability that $c$ falls in the interval $[0.01, 0.10]$ versus the interval $[1.0, 10.0]$.
3. Contrast this with the probabilities obtained if $c$ were sampled from a standard Uniform distribution $\mathcal{U}(0.01, 10.0)$.

**Given Data:**
- $a = 0.01$
- $b = 10.0$
- $k = 10$ (one order of magnitude / decade)

**Step-by-Step Derivation:**
1. Derivation of CDF:
   Let $Y = \ln C \sim \mathcal{U}(\ln a, \ln b)$.
   For $c \in [a, b]$:
   $$F_C(c) = P(C \le c) = P(\ln C \le \ln c) = \frac{\ln c - \ln a}{\ln b - \ln a}$$
   Density:
   $$f_C(c) = \frac{d F_C(c)}{dc} = \frac{1}{c (\ln b - \ln a)}$$
2. Log-Uniform probability over $[0.01, 0.10]$:
   $$P(C \in [0.01, 0.10]) = \frac{\ln(0.10) - \ln(0.01)}{\ln(10.0) - \ln(0.01)} = \frac{\ln(10)}{\ln(1000)} = \frac{\ln 10}{3 \ln 10} = \frac{1}{3} \approx 33.33\%$$
   Probability over $[1.0, 10.0]$:
   $$P(C \in [1.0, 10.0]) = \frac{\ln(10.0) - \ln(1.0)}{\ln(10.0) - \ln(0.01)} = \frac{\ln 10}{3 \ln 10} = \frac{1}{3} \approx 33.33\%$$
   The probabilities are **strictly identical** across every decade!
3. Standard Uniform distribution comparison:
   $$P_{\text{unif}}(C \in [0.01, 0.10]) = \frac{0.10 - 0.01}{10.0 - 0.01} = \frac{0.09}{9.99} \approx 0.00901 = 0.90\%$$
   $$P_{\text{unif}}(C \in [1.0, 10.0]) = \frac{10.0 - 1.0}{10.0 - 0.01} = \frac{9.0}{9.99} \approx 0.9009 = 90.09\%$$

**Final Answer:**
Under log-uniform sampling, each decade receives exactly $33.33\%$ representation. Under uniform sampling, the lowest decade receives less than $1\%$ of training samples, while the highest decade receives over $90\%$, explaining why uniform DDR fails for multi-scale physical parameters. $\blacksquare$

---

### Problem 4.2 (Worked Example): Center of Mass (CoM) Perturbation and Stability Margin
**Problem Statement:** A humanoid robot has total mass $M = 55\text{ kg}$ and torso height $H = 0.8\text{ m}$. In nominal simulation, the torso center of mass is centered at $(0, 0, 0.4\text{ m})$ above the hip. The support polygon on the ground has width $W = 0.20\text{ m}$ in the lateral $y$-direction.
If torso CoM is perturbed in simulation via $\Delta y_{\text{com}} \sim \mathcal{U}(-d_{\max}, +d_{\max})$, determine the maximum allowable perturbation $d_{\max}$ that keeps the static ground projection of the CoM inside the middle $60\%$ of the support polygon width.

**Given Data:**
- Support polygon lateral width $W = 0.20\text{ m}$ (foot placement limits $y \in [-0.10, +0.10]\text{ m}$)
- Middle $60\%$ safety zone: $y_{\text{safe}} \in [-0.06, +0.06]\text{ m}$

**Step-by-Step Derivation:**
1. The total robot center of mass lateral position is:
   $$y_{\text{total}} = \frac{m_{\text{legs}} y_{\text{legs}} + m_{\text{torso}} y_{\text{torso}}}{M_{\text{total}}}$$
2. Given $m_{\text{torso}} = 35\text{ kg}$ and $m_{\text{legs}} = 20\text{ kg}$ with legs centered ($y_{\text{legs}} = 0$):
   $$y_{\text{total}} = \frac{35}{55} \Delta y_{\text{com}} = \frac{7}{11} \Delta y_{\text{com}}$$
3. To maintain $y_{\text{total}} \in [-0.06, +0.06]\text{ m}$:
   $$\left| \frac{7}{11} \Delta y_{\text{com}} \right| \le 0.06\text{ m}$$
   $$|\Delta y_{\text{com}}| \le 0.06 \times \frac{11}{7} = \frac{0.66}{7} \approx 0.09428\text{ m} = 9.43\text{ cm}$$

**Final Answer:**
The maximum allowable CoM perturbation is $d_{\max} \approx 9.43\text{ cm}$. Randomizing beyond $9.5\text{ cm}$ causes the static projection to violate the support polygon, forcing the robot to fall before initiating locomotion. $\blacksquare$

---

### Problem 4.3 (Worked Example): Truncated Gaussian Normalization Constant and Moments
**Problem Statement:** A link mass $m$ has nominal value $\mu_0 = 4.0\text{ kg}$. To avoid unphysical negative masses or motor-stall overloads, mass is sampled from a Truncated Gaussian on $[a, b] = [2.5\text{ kg}, 6.0\text{ kg}]$ with $\sigma = 1.0\text{ kg}$.
Compute the normalization constant $Z$ and the true expected value $\mathbb{E}[m]$.

**Given Data:**
- $\mu = 4.0\text{ kg}$
- $\sigma = 1.0\text{ kg}$
- $a = 2.5\text{ kg} \implies \alpha = \frac{2.5 - 4.0}{1.0} = -1.5$
- $b = 6.0\text{ kg} \implies \beta = \frac{6.0 - 4.0}{1.0} = +2.0$

**Step-by-Step Derivation:**
1. Standard normal CDF values:
   $$\Phi(-1.5) = 1 - \Phi(1.5) = 1 - 0.93319 = 0.06681$$
   $$\Phi(+2.0) = 0.97725$$
2. Normalization constant $Z$:
   $$Z = \Phi(\beta) - \Phi(\alpha) = 0.97725 - 0.06681 = 0.91044$$
3. Standard normal PDF values:
   $$\phi(\alpha) = \phi(-1.5) = \frac{1}{\sqrt{2\pi}} e^{-(-1.5)^2 / 2} = \frac{1}{\sqrt{2\pi}} e^{-1.125} \approx (0.39894)(0.32465) \approx 0.12952$$
   $$\phi(\beta) = \phi(2.0) = \frac{1}{\sqrt{2\pi}} e^{-(2.0)^2 / 2} = \frac{1}{\sqrt{2\pi}} e^{-2.0} \approx (0.39894)(0.13534) \approx 0.05399$$
4. Expected value of truncated Gaussian:
   $$\mathbb{E}[m] = \mu + \sigma \frac{\phi(\alpha) - \phi(\beta)}{\Phi(\beta) - \Phi(\alpha)}$$
   $$\frac{\phi(\alpha) - \phi(\beta)}{Z} = \frac{0.12952 - 0.05399}{0.91044} = \frac{0.07553}{0.91044} \approx +0.08296$$
   $$\mathbb{E}[m] = 4.0 + (1.0)(0.08296) = 4.08296\text{ kg}$$

**Final Answer:**
The normalization constant is $Z \approx 0.9104$ (enclosing $91.04\%$ of the unconstrained Gaussian), and the true mean shifts slightly upward to $\mathbb{E}[m] \approx 4.083\text{ kg}$ due to the asymmetrical truncation boundaries. $\blacksquare$

---

### Problem 4.4 (Worked Example): Physical Validity of Inertia Tensor Randomization
**Problem Statement:** A rigid link has nominal principal moments of inertia $I_{xx} = 0.04$, $I_{yy} = 0.05$, $I_{zz} = 0.08\text{ kg}\cdot\text{m}^2$.
If independent uniform noise $\Delta I_i \sim \mathcal{U}(-\delta, +\delta)$ is added to the diagonal elements, state the physical triangle inequality constraints that the randomized inertia tensor must satisfy, and compute the maximum $\delta$ that guarantees physical realizability.

**Given Data:**
- Nominal: $I_{xx} = 0.04, I_{yy} = 0.05, I_{zz} = 0.08$
- Noise: $\Delta I_i \in [-\delta, +\delta]$

**Step-by-Step Derivation:**
1. A physical rigid body with mass density $\rho(x, y, z) \ge 0$ must satisfy the **triangle inequalities of inertia**:
   $$I_{xx} + I_{yy} \ge I_{zz}$$
   $$I_{xx} + I_{zz} \ge I_{yy}$$
   $$I_{yy} + I_{zz} \ge I_{xx}$$
2. Check nominal values:
   $$0.04 + 0.05 = 0.09 \ge 0.08 \quad (\text{Margin: } 0.01)$$
   $$0.04 + 0.08 = 0.12 \ge 0.05 \quad (\text{Margin: } 0.07)$$
   $$0.05 + 0.08 = 0.13 \ge 0.04 \quad (\text{Margin: } 0.09)$$
   The critical bottleneck is $I_{xx} + I_{yy} \ge I_{zz}$.
3. Worst-case perturbation against the critical inequality:
   $$I_{xx}' = I_{xx} - \delta = 0.04 - \delta$$
   $$I_{yy}' = I_{yy} - \delta = 0.05 - \delta$$
   $$I_{zz}' = I_{zz} + \delta = 0.08 + \delta$$
4. Evaluate triangle inequality under worst-case:
   $$(0.04 - \delta) + (0.05 - \delta) \ge (0.08 + \delta)$$
   $$0.09 - 2\delta \ge 0.08 + \delta$$
   $$3\delta \le 0.01 \implies \delta \le \frac{0.01}{3} \approx 0.00333\text{ kg}\cdot\text{m}^2$$

**Final Answer:**
Maximum allowable independent perturbation is $\delta = \frac{0.01}{3} \approx 3.33 \times 10^{-3}\text{ kg}\cdot\text{m}^2$ ($8.3\%$ of $I_{xx}$). Perturbing beyond this value generates unphysical negative second mass moments, causing physics simulators to throw non-positive-definite mass matrix exceptions. $\blacksquare$

---

### Problem 4.5 (Worked Example): Sample Complexity Bound for Domain Coverage
**Problem Statement:** The dynamics parameter vector $\xi \in \mathbb{R}^D$ is $D = 8$-dimensional, normalized to the unit hypercube $[0, 1]^8$. We desire that every point in the parameter space is within distance $\epsilon = 0.30$ (in $L_\infty$ norm) of at least one simulated training configuration.
Compute the minimum number of grid points $N$ required for complete deterministic $\epsilon$-coverage, and use the coupon collector / volume bound to estimate the number of uniform random samples $M$ needed to achieve $99\%$ coverage confidence.

**Given Data:**
- Dimension $D = 8$
- Coverage radius $\epsilon = 0.30$
- Grid cell width $2\epsilon = 0.60$

**Step-by-Step Derivation:**
1. Deterministic grid coverage:
   Number of cells along each axis: $K = \lceil \frac{1}{2\epsilon} \rceil = \lceil \frac{1}{0.60} \rceil = \lceil 1.667 \rceil = 2$.
   Total grid sample points:
   $$N_{\text{grid}} = K^D = 2^8 = 256\text{ points}$$
2. Random uniform sampling (Volume coverage):
   The volume of an $\epsilon$-ball in $L_\infty$ norm is $V_{\text{box}} = (2\epsilon)^D = (0.60)^8 \approx 0.016796$.
   Number of disjoint cells: $M_{\text{cells}} = \frac{1}{V_{\text{box}}} \approx \frac{1}{0.016796} \approx 59.54 \approx 60\text{ cells}$.
3. Coupon collector formula to hit all $K = 60$ bins with probability $1 - \delta = 0.99$:
   $$M \approx K \ln K + K \ln\left(\frac{1}{\delta}\right)$$
   $$M \approx 60 \ln(60) + 60 \ln(100) = 60(4.0943) + 60(4.6052) = 245.66 + 276.31 \approx 522\text{ samples}$$

**Final Answer:**
A structured grid requires $256$ points, while uniform random sampling requires $\sim 522$ environment episodes to achieve $99\%$ confidence of covering all 8-dimensional dynamics corners with radius $\epsilon = 0.30$. $\blacksquare$

---

### Problem 4.6 (Worked Example): Fisher Information Metric on Dynamics Parameters
**Problem Statement:** Let a robot trajectory $\tau = \{s_0, a_0, s_1, a_1, \dots, s_T\}$ have likelihood $p(\tau; \xi)$ parameterized by physical parameter $\xi$. The Fisher Information Matrix (FIM) is defined as:
$$\mathcal{F}(\xi) = \mathbb{E}_{\tau}\left[ \nabla_\xi \ln p(\tau; \xi) \nabla_\xi \ln p(\tau; \xi)^T \right]$$
If $\xi_1$ (mass) has Fisher Information $\mathcal{F}_{11} = 450$ and $\xi_2$ (joint viscous damping) has $\mathcal{F}_{22} = 4.5$, explain which parameter requires tighter domain randomization to ensure policy robustness.

**Given Data:**
- $\mathcal{F}_{11} = 450$
- $\mathcal{F}_{22} = 4.5$

**Step-by-Step Derivation:**
1. The Cramér-Rao inequality bounds the sensitivity of the trajectory distribution to parameter variation:
   $$\operatorname{Var}(\hat{\xi}_i) \ge \frac{1}{\mathcal{F}_{ii}}$$
2. By the Kullback-Leibler divergence approximation:
   $$D_{\text{KL}}(P_\xi \parallel P_{\xi + \Delta\xi}) \approx \frac{1}{2} \Delta\xi^T \mathcal{F}(\xi) \Delta\xi$$
3. For parameter 1 (mass):
   $$D_{\text{KL}, 1} = \frac{1}{2} (450) (\Delta\xi_1)^2 = 225 (\Delta\xi_1)^2$$
   A perturbation of $\Delta\xi_1 = 0.10$ creates a massive KL divergence of $D_{\text{KL}} = 2.25\text{ nats}$.
4. For parameter 2 (damping):
   $$D_{\text{KL}, 2} = \frac{1}{2} (4.5) (\Delta\xi_2)^2 = 2.25 (\Delta\xi_2)^2$$
   The same perturbation of $\Delta\xi_2 = 0.10$ creates a negligible KL divergence of $D_{\text{KL}} = 0.0225\text{ nats}$.

**Final Answer:**
Parameter $\xi_1$ (mass) has $100\times$ higher Fisher Information, meaning state trajectories are hypersensitive to mass variations. Therefore, $\xi_1$ dominates the sim-to-real transfer gap and must be randomized with high density, whereas $\xi_2$ (damping) has low information content and can be coarsely randomized. $\blacksquare$

---

### Problem 4.7 (Worked Example): Beta Distribution for Ground Restitution Parameter
**Problem Statement:** Ground restitution coefficient $e \in [0, 1]$ is sampled from $\operatorname{Beta}(\alpha, \beta)$ with shape parameters $\alpha = 2$ and $\beta = 5$.
1. Compute the expected value $\mathbb{E}[e]$ and variance $\operatorname{Var}(e)$.
2. Compute the mode of the distribution (most frequently sampled restitution).

**Given Data:**
- $\alpha = 2, \beta = 5$

**Step-by-Step Derivation:**
1. Expected value formula for Beta distribution:
   $$\mathbb{E}[e] = \frac{\alpha}{\alpha + \beta} = \frac{2}{2 + 5} = \frac{2}{7} \approx 0.2857$$
2. Variance formula:
   $$\operatorname{Var}(e) = \frac{\alpha \beta}{(\alpha + \beta)^2 (\alpha + \beta + 1)} = \frac{(2)(5)}{(7)^2 (8)} = \frac{10}{49 \times 8} = \frac{10}{392} \approx 0.02551$$
   Standard deviation: $\sigma = \sqrt{0.02551} \approx 0.1597$.
3. Mode formula (for $\alpha > 1, \beta > 1$):
   $$\operatorname{Mode}(e) = \frac{\alpha - 1}{\alpha + \beta - 2} = \frac{2 - 1}{2 + 5 - 2} = \frac{1}{5} = 0.2000$$

**Final Answer:**
Expected restitution is $\mathbb{E}[e] \approx 0.286$, variance is $0.0255$, and the mode is $0.200$. This distribution skews towards inelastic collisions typical of turf, rubber mats, and dirt, avoiding the artificial bounce of elastic physics simulations. $\blacksquare$

---

### Problem 4.8 (Worked Example): Domain Randomization as Regularization in Linear Quadratic Regulator (LQR)
**Problem Statement:** Consider a scalar linear system $\dot{x} = a x + b u$ where $b$ is randomized with mean $\bar{b} = 1.0$ and variance $\sigma_b^2$. The objective is to minimize cost $J = \mathbb{E}\left[ \int_0^\infty (q x^2 + r u^2) dt \right]$ with linear feedback $u = -k x$.
Prove that randomizing $b$ is mathematically equivalent to adding a state-dependent penalty $\sigma_b^2 k^2 x^2$ to the nominal cost function, increasing controller conservatism.

**Given Data:**
- Plant: $\dot{x} = a x + b u$
- $b = \bar{b} + \tilde{b}$ with $\mathbb{E}[\tilde{b}] = 0$ and $\mathbb{E}[\tilde{b}^2] = \sigma_b^2$
- Policy: $u = -k x$

**Step-by-Step Derivation:**
1. Closed-loop dynamics:
   $$\dot{x} = a x - b k x = (a - \bar{b} k) x - \tilde{b} k x$$
2. This is a stochastic differential equation with multiplicative noise:
   $$dx = (a - \bar{b} k) x dt - k x \sigma_b dw$$
3. By Itô's lemma, the generator for $V(x) = p x^2$ is:
   $$\mathcal{A} V(x) = 2 x p (a - \bar{b} k) x + \frac{1}{2} (2 p) (-k x \sigma_b)^2 = 2 p (a - \bar{b} k) x^2 + p \sigma_b^2 k^2 x^2$$
4. Set $\mathcal{A} V(x) + q x^2 + r k^2 x^2 = 0$:
   $$2 p (a - \bar{b} k) + q + (r + p \sigma_b^2) k^2 = 0$$
5. Notice that the control penalty $r$ is replaced by an effective penalty:
   $$r_{\text{eff}} = r + p \sigma_b^2$$

**Final Answer:**
Randomizing input effectiveness $b$ with variance $\sigma_b^2$ inflates the control effort penalty to $r_{\text{eff}} = r + p \sigma_b^2$, proving analytically that Dynamics Domain Randomization acts as an implicit regularizer that reins in high feedback gains. $\blacksquare$

---

### Problem 4.9 (Worked Example): Epistemic vs Aleatoric Uncertainty Partitioning
**Problem Statement:** In a robotic arm system, define:
1. Link mass error $\Delta m$: constant for a given robot instance, but unknown prior to calibration.
2. Joint torque sensor thermal white noise $w_t \sim \mathcal{N}(0, \sigma_w^2)$: continuously fluctuating during operation.
Classify each as Epistemic or Aleatoric uncertainty, and explain how their treatment differs in policy architecture.

**Step-by-Step Derivation:**
1. Classification:
   - Link mass error $\Delta m$ is **Epistemic Uncertainty** (reducible with more data/calibration). Once the robot is identified, $\Delta m$ is fixed.
   - Sensor white noise $w_t$ is **Aleatoric Uncertainty** (irreducible physical randomness inherent to electron thermal fluctuations).
2. Architectural treatment:
   - Aleatoric noise cannot be predicted. The policy must learn filtering (e.g., temporal convolution or low-pass integration) to be invariant to high-frequency fluctuations.
   - Epistemic uncertainty can be **identified online**! By maintaining an observation history buffer or recurrent latent state $z_t$, the policy can infer $\Delta m$ during the first 100 milliseconds and adjust its feedforward torque.

**Final Answer:**
Mass discrepancy is epistemic and should be addressed via temporal adaptation or recurrent encoders, whereas thermal sensor noise is aleatoric and must be suppressed via stochastic policy regularization and output filtering. $\blacksquare$

---

### Problem 4.10 (Worked Example): Uniform Hypercube Radius and Curse of Dimensionality
**Problem Statement:** In an $n$-dimensional domain randomization parameter space $\Xi = [-1, 1]^n$, calculate the fraction of the total hypercube volume that resides within a thin outer shell of thickness $\epsilon = 0.05$ near the boundary for $n = 2$, $n = 10$, and $n = 50$.

**Given Data:**
- Hypercube half-width $R = 1.0$
- Inner core half-width $R - \epsilon = 0.95$

**Step-by-Step Derivation:**
1. Total hypercube volume:
   $$V_{\text{total}} = (2 R)^n = 2^n$$
2. Inner core volume:
   $$V_{\text{core}} = (2 (R - \epsilon))^n = (2 \times 0.95)^n = 2^n (0.95)^n$$
3. Fraction of volume in the outer boundary shell:
   $$f_{\text{shell}} = 1 - \frac{V_{\text{core}}}{V_{\text{total}}} = 1 - (0.95)^n$$
4. Evaluate for dimensions:
   - For $n = 2$:
     $$f_{\text{shell}} = 1 - (0.95)^2 = 1 - 0.9025 = 0.0975 = 9.75\%$$
   - For $n = 10$:
     $$f_{\text{shell}} = 1 - (0.95)^{10} = 1 - 0.5987 \approx 0.4013 = 40.13\%$$
   - For $n = 50$:
     $$f_{\text{shell}} = 1 - (0.95)^{50} \approx 1 - 0.0769 = 0.9231 = 92.31\%$$

**Final Answer:**
At $n = 50$, over $92.3\%$ of all uniformly randomized environments reside within the extreme outer $5\%$ boundary shell! In high dimensions, uniform DDR almost exclusively trains on extreme, worst-case corner cases, leading directly to policy paralysis. $\blacksquare$

---

## 4.6 Solved Exercises (Problems 4.11 – 4.20)

---

### Problem 4.11 (Solved Exercise): Entropy of Domain Randomization Distributions
**Problem Statement:** Compare the differential entropy of a Uniform distribution $\mathcal{U}(a, b)$ with a Gaussian distribution $\mathcal{N}(\mu, \sigma^2)$ having the same variance $\sigma^2 = \frac{(b-a)^2}{12}$. Prove that the Gaussian distribution maximizes entropy.

**Step-by-Step Solution:**
1. Differential entropy of $\mathcal{U}(a, b)$:
   $$h(U) = \ln(b - a) = \ln(\sigma \sqrt{12}) = \ln \sigma + \frac{1}{2} \ln 12 \approx \ln \sigma + 1.2425$$
2. Differential entropy of $\mathcal{N}(\mu, \sigma^2)$:
   $$h(G) = \frac{1}{2} \ln(2\pi e \sigma^2) = \ln \sigma + \frac{1}{2} \ln(2\pi e) \approx \ln \sigma + 1.4189$$
3. Entropy difference:
   $$h(G) - h(U) = \frac{1}{2} \ln\left(\frac{2\pi e}{12}\right) = \frac{1}{2} \ln\left(\frac{17.0795}{12}\right) = \frac{1}{2} \ln(1.4233) \approx +0.1764\text{ nats} > 0 \quad \blacksquare$$

---

### Problem 4.12 (Solved Exercise): Sobolev Norm Regularization Induced by Domain Randomization
**Problem Statement:** Let $f_\theta(x)$ be a policy. If input $x$ is perturbed by zero-mean noise $\epsilon \sim \mathcal{N}(0, \sigma^2 I)$, show that the second-order Taylor expansion of expected loss $\mathbb{E}_\epsilon[\mathcal{L}(f_\theta(x + \epsilon))]$ includes a Sobolev gradient penalty $\frac{\sigma^2}{2} \|\nabla_x \mathcal{L}\|^2$.

**Step-by-Step Solution:**
1. Taylor series of $\mathcal{L}(x + \epsilon)$:
   $$\mathcal{L}(x + \epsilon) = \mathcal{L}(x) + \nabla_x \mathcal{L}^T \epsilon + \frac{1}{2} \epsilon^T \nabla_x^2 \mathcal{L} \epsilon + \mathcal{O}(\|\epsilon\|^3)$$
2. Expectation over $\epsilon$:
   $$\mathbb{E}[\mathcal{L}(x + \epsilon)] = \mathcal{L}(x) + 0 + \frac{1}{2} \operatorname{Tr}\left(\nabla_x^2 \mathcal{L} \mathbb{E}[\epsilon \epsilon^T]\right) = \mathcal{L}(x) + \frac{\sigma^2}{2} \nabla^2 \mathcal{L}(x) \quad \blacksquare$$

---

### Problem 4.13 (Solved Exercise): Motor Back-EMF Constant Randomization Range
**Problem Statement:** In a manufacturing batch of 1000 BLDC motors, permanent magnet flux density varies by $\pm 6\%$ and copper coil winding turns vary by $\pm 2\%$. Compute the composite percentage variation in motor torque constant $K_t$.

**Step-by-Step Solution:**
1. Torque constant formula: $K_t = 2 N_{\text{turns}} B L_{\text{core}} r$.
2. Fractional variation:
   $$\frac{\Delta K_t}{K_t} \approx \frac{\Delta N_{\text{turns}}}{N_{\text{turns}}} + \frac{\Delta B}{B}$$
3. Maximum composite variation:
   $$\left(\frac{\Delta K_t}{K_t}\right)_{\max} = \pm (2\% + 6\%) = \pm 8.0\% \quad \blacksquare$$

---

### Problem 4.14 (Solved Exercise): Ground Friction Cone Asymmetry Randomization
**Problem Statement:** On anisotropic surfaces (e.g., brushed carpet or wood grain), friction coefficients along the longitudinal and lateral directions differ: $\mu_x = 0.8$, $\mu_y = 0.4$. Formulate the elliptical friction cone constraint and explain why isotropic Coulomb friction randomization fails.

**Step-by-Step Solution:**
1. Isotropic Coulomb cone requires $\sqrt{F_x^2 + F_y^2} \le \mu F_z$.
2. Anisotropic elliptical friction cone:
   $$\left(\frac{F_x}{\mu_x}\right)^2 + \left(\frac{F_y}{\mu_y}\right)^2 \le F_z^2$$
3. If an isotropic simulator trains with $\bar{\mu} = 0.8$, the robot attempts lateral maneuvers requiring $F_y = 0.6 F_z$. On real carpet ($\mu_y = 0.4$), the foot slips instantly, causing the robot to roll over. $\blacksquare$

---

### Problem 4.15 (Solved Exercise): Stratified Latin Hypercube Sampling (LHS) Variance Reduction
**Problem Statement:** Contrast standard Monte Carlo sampling with Latin Hypercube Sampling (LHS) for $N$ samples across $D$ physical parameters. Explain why LHS guarantees that each parameter marginal is stratified into $N$ equal-probability intervals.

**Step-by-Step Solution:**
1. Monte Carlo samples parameters independently, allowing clusters and empty voids across the parameter space.
2. LHS divides the CDF of each parameter $\xi_d$ into $N$ non-overlapping intervals $[\frac{i-1}{N}, \frac{i}{N}]$ for $i = 1, \dots, N$.
3. Exactly one sample is drawn from each interval, and pairings across dimensions are randomly permuted.
4. By stratified sampling theorem, LHS reduces estimator variance by eliminating between-strata variance:
   $$\operatorname{Var}_{\text{LHS}}(\hat{\theta}) \le \operatorname{Var}_{\text{MC}}(\hat{\theta}) \quad \blacksquare$$

---

### Problem 4.16 (Solved Exercise): Link Flexibility Modeled via Virtual Elastic Joints
**Problem Statement:** A continuous flexible link of length $L$, mass $m$, and flexural rigidity $E I$ is approximated in a rigid-body simulator as two rigid links of length $L/2$ joined by a virtual revolute joint with torsional spring stiffness $K_\theta$. Determine $K_\theta$ matching the static tip deflection under end load $F$.

**Step-by-Step Solution:**
1. Cantilever beam tip deflection under load $F$:
   $$\delta_{\text{beam}} = \frac{F L^3}{3 E I}$$
2. Virtual joint model: joint is at $x = L/2$. Bending moment at joint is $M = F (L/2)$.
   Joint deflection: $\theta = \frac{M}{K_\theta} = \frac{F L}{2 K_\theta}$.
   Tip deflection: $\delta_{\text{virtual}} = \theta \left(\frac{L}{2}\right) = \frac{F L^2}{4 K_\theta}$.
3. Equate deflections:
   $$\frac{F L^2}{4 K_\theta} = \frac{F L^3}{3 E I} \implies K_\theta = \frac{3 E I}{4 L} \quad \blacksquare$$

---

### Problem 4.17 (Solved Exercise): Contact Damping and Penetration Depth
**Problem Statement:** A physics simulator uses linear spring-damper normal contact: $F_N = K_n \delta + D_n \dot{\delta}$. If an impact occurs with initial velocity $v_0$, find the critical damping $D_n^*$ that eliminates rebound oscillation.

**Step-by-Step Solution:**
1. Differential equation during contact indentation:
   $$m \ddot{\delta} + D_n \dot{\delta} + K_n \delta = 0$$
2. Characteristic equation: $s^2 + \frac{D_n}{m} s + \frac{K_n}{m} = 0$.
3. Critical damping occurs at damping ratio $\zeta = 1.0$:
   $$D_n^* = 2 \sqrt{m K_n} \quad \blacksquare$$

---

### Problem 4.18 (Solved Exercise): Joint Clearance Probability Distribution under Wear
**Problem Statement:** A robot joint has initial backlash $\alpha_0 = 0.002\text{ rad}$. Due to mechanical wear, backlash increases proportionally to accumulated operating cycles $N$: $\alpha(N) = \alpha_0 + k_{\text{wear}} N$. If operating hours $T$ follow an exponential distribution, find the probability distribution of backlash across a deployed robot fleet.

**Step-by-Step Solution:**
1. Let $T \sim \operatorname{Exp}(\lambda)$ with $p_T(t) = \lambda e^{-\lambda t}$.
2. Operating cycles $N = \nu T$ where $\nu$ is cycle rate. Backlash $\alpha = \alpha_0 + c T$ with $c = k_{\text{wear}} \nu$.
3. Change of variables: $t = \frac{\alpha - \alpha_0}{c}$ for $\alpha \ge \alpha_0$.
4. Transformed PDF:
   $$p_A(\alpha) = p_T\left(\frac{\alpha - \alpha_0}{c}\right) \left|\frac{dt}{d\alpha}\right| = \frac{\lambda}{c} e^{-\frac{\lambda}{c}(\alpha - \alpha_0)}, \quad \alpha \ge \alpha_0 \quad \blacksquare$$

---

### Problem 4.19 (Solved Exercise): Total Variation Distance between Simulated and Real Dynamics
**Problem Statement:** Let $P_{\text{sim}}(s' \mid s, a)$ and $P_{\text{real}}(s' \mid s, a)$ be Gaussian transition distributions with the same variance $\sigma^2$ but shifted means $\mu_{\text{sim}} \ne \mu_{\text{real}}$. Express the Total Variation distance $D_{\text{TV}}(P_{\text{sim}}, P_{\text{real}})$ in terms of the standard normal CDF $\Phi$.

**Step-by-Step Solution:**
1. Total Variation distance between two 1D Gaussians $\mathcal{N}(\mu_1, \sigma^2)$ and $\mathcal{N}(\mu_2, \sigma^2)$:
   $$D_{\text{TV}}(P_1, P_2) = 2 \Phi\left(\frac{|\mu_1 - \mu_2|}{2\sigma}\right) - 1$$
2. Let $\Delta\mu = |\mu_{\text{sim}} - \mu_{\text{real}}|$:
   $$D_{\text{TV}}(P_{\text{sim}}, P_{\text{real}}) = 2 \Phi\left(\frac{\Delta\mu}{2\sigma}\right) - 1 \quad \blacksquare$$

---

### Problem 4.20 (Solved Exercise): Domain Randomization Bounds under Wasserstein Distributionally Robust Optimization
**Problem Statement:** Formulate the Domain Randomization problem under Wasserstein Distributionally Robust Optimization (DRO):
$$\max_\theta \inf_{Q: \mathcal{W}_c(P_0, Q) \le \rho} \mathbb{E}_{\xi \sim Q}[J(\theta; \xi)]$$
Explain why this formulation prevents policy paralysis by penalizing pathological distributions.

**Step-by-Step Solution:**
1. Nominal distribution $P_0$ represents the calibrated baseline simulator.
2. The uncertainty set $\mathcal{B}_\rho(P_0) = \{Q \in \mathcal{P}(\Xi) \mid \mathcal{W}_c(P_0, Q) \le \rho\}$ contains all distributions within Wasserstein transportation distance $\rho$ of $P_0$.
3. Unlike unconstrained uniform DR which assigns equal probability to extreme corners, Wasserstein DRO restricts the adversary to distributions that are cost-effective perturbations of nominal physics.
4. By strong duality, this problem reduces to a finite-dimensional regularized empirical risk:
   $$\max_\theta \sup_{\lambda \ge 0} \left\{ \mathbb{E}_{\xi \sim P_0}[\phi_\lambda(\theta; \xi)] - \lambda \rho \right\}$$
   guaranteeing bounded conservatism without policy paralysis. $\blacksquare$
