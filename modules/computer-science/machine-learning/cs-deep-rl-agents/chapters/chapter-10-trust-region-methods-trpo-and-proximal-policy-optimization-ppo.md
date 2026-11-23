# Chapter 10: Trust Region Methods: TRPO and Proximal Policy Optimization (PPO)

---

## 10.1 The Cliff of Policy Collapse

In standard supervised deep learning, taking a gradient step that is slightly too large causes a transient increase in test loss:
$$\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k - \alpha \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta})$$
If the learning rate $\alpha$ was excessively large, subsequent gradient steps on stationary training data can readily correct the weights and resume monotonic convergence.

In reinforcement learning, the consequences of a bad gradient step are **asymmetric and catastrophic**.

Consider what occurs when a policy gradient update takes an outsized step in parameter space:
1. **The Policy Breaks:** The network weights shift into a damaged regime, causing the policy $\pi_{\boldsymbol{\theta}}$ to collapse into a dysfunctional behavior (e.g., an autonomous biped falling flat on its face).
2. **The Data Distribution Collapses:** Because RL is self-referential, the agent's future training data is gathered by the broken policy. The agent can no longer visit high-reward states.
3. **Permanent Failure:** Trapped in a catastrophic state distribution, the agent collects meaningless, noisy observations. It cannot compute meaningful gradients to climb back out of the abyss. This phenomenon is known as the **Cliff of Policy Collapse**.

```
                        THE CLIFF OF POLICY COLLAPSE
                        
     Policy Return J(θ)
          │
      100 ┼─────────┐   ◄── Optimal Policy Plateau
          │          \
       75 │           \
          │            \
       50 │             \  ◄── A single oversized step Δθ pushes
          │              \     the parameters off the cliff!
       25 │               \
          │                \
        0 ┴─────────────────┴─────────────────────────────► Parameters θ
                               ▲
                               CATASTROPHIC COLLAPSE
                               (Data distribution permanently broken)
```

To guarantee stable, monotonic policy improvement, we must enforce a mathematical constraint: **the updated policy $\pi_{\boldsymbol{\theta}}$ must not diverge too far from the old policy $\pi_{\boldsymbol{\theta}_{\text{old}}}$**.

---

## 10.2 The Policy Performance Bound

Kakade and Langford (2002) established the foundational mathematical framework relating the performance of two arbitrary policies $\pi$ and $\tilde{\pi}$.

Let $J(\pi) = \mathbb{E}_{\tau \sim \pi}[R(\tau)]$ denote the expected discounted return of policy $\pi$.
The return of a new policy $\tilde{\pi}$ can be expressed exactly in terms of the advantage function of the old policy $\pi$:
$$J(\tilde{\pi}) = J(\pi) + \mathbb{E}_{\tau \sim \tilde{\pi}} \left[ \sum_{t=0}^\infty \gamma^t A^\pi(s_t, a_t) \right] = J(\pi) + \sum_{s \in \mathcal{S}} d^{\tilde{\pi}}(s) \sum_{a \in \mathcal{A}} \tilde{\pi}(a \mid s) A^\pi(s, a)$$
where $d^{\tilde{\pi}}(s) = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s \mid s_0, \tilde{\pi})$ is the discounted state visitation distribution under the **new** policy $\tilde{\pi}$.

### The Dependency Dilemma
Notice the fundamental dilemma in this equation: the expectation requires sampling states from $d^{\tilde{\pi}}(s)$, which depends on the unknown, unobserved new policy $\tilde{\pi}$! We cannot evaluate this expectation without first deploying $\tilde{\pi}$ in the environment.

Kakade and Langford introduced the **local surrogate objective** $L_\pi(\tilde{\pi})$, which replaces the new state distribution $d^{\tilde{\pi}}(s)$ with the known, sampled state distribution of the old policy $d^\pi(s)$:
$$L_\pi(\tilde{\pi}) = J(\pi) + \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \tilde{\pi}(a \mid s) A^\pi(s, a)$$

Notice that $L_\pi(\tilde{\pi})$ matches $J(\tilde{\pi})$ to first order:
$$L_\pi(\pi) = J(\pi), \quad \nabla_{\boldsymbol{\theta}} L_{\pi_{\boldsymbol{\theta}}}(\pi_{\tilde{\boldsymbol{\theta}}}) \Big|_{\tilde{\boldsymbol{\theta}} = \boldsymbol{\theta}} = \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$

### The Monotonic Improvement Bound
Schulman et al. (2015) refined Kakade & Langford's bound to establish the celebrated **Monotonic Policy Improvement Theorem**:

**Theorem (Schulman et al., 2015):**
Let $\epsilon = \max_{s, a} |A^\pi(s, a)|$. For any two policies $\pi$ and $\tilde{\pi}$:
$$J(\tilde{\pi}) \ge L_\pi(\tilde{\pi}) - C \cdot D_{\text{KL}}^{\max}(\pi, \tilde{\pi})$$
where:
$$C = \frac{4 \epsilon \gamma}{(1 - \gamma)^2}$$
$$D_{\text{KL}}^{\max}(\pi, \tilde{\pi}) = \max_{s \in \mathcal{S}} D_{\text{KL}}(\pi(\cdot \mid s) \parallel \tilde{\pi}(\cdot \mid s))$$

```
                   THE MINORIZATION-MAXIMIZATION GUARANTEE
                   
     Return J
        │                                 True Return J(π)
        │                                        /
        │                  Surrogate L_π(θ)     /
        │                      /               /
        │           \         /               /
        │            \_______/               /
        │               • ◄─────────────────┘  (Tangency at θ_old)
        │              / \
        │             /   \   Bound M_π(θ) = L_π(θ) - C · D_KL
        │            /     \
        └───────────┴───────┴─────────────────────────────► Policy Parameters θ
                           θ_new = argmax M_π(θ)
                    Guaranteed: J(θ_new) ≥ M_π(θ_new) > J(θ_old)!
```

This theorem provides an ironclad theoretical guarantee:
If we maximize the lower bound $M_\pi(\tilde{\pi}) = L_\pi(\tilde{\pi}) - C \cdot D_{\text{KL}}^{\max}(\pi, \tilde{\pi})$, we are guaranteed that the true expected return $J(\tilde{\pi})$ improves monotonically:
$$J(\pi_{\text{new}}) \ge J(\pi_{\text{old}})$$
Policy collapse is mathematically impossible under this bound.

---

## 10.3 Trust Region Policy Optimization (TRPO)

While the theoretical bound $J \ge L - C \cdot D_{\text{KL}}$ guarantees monotonic improvement, the theoretical penalty coefficient $C = \frac{4 \epsilon \gamma}{(1 - \gamma)^2}$ is extremely large in practice (often $> 10,000$). Taking steps with this penalty results in microscopic, imperceptible parameter updates.

Schulman et al. (2015) recognized that we can achieve the same stability by converting the bound into a **constrained optimization problem** with a hard trust region:
$$\max_{\boldsymbol{\theta}} \quad \mathbb{E}_{s \sim d^{\boldsymbol{\theta}_{\text{old}}}, a \sim \pi_{\boldsymbol{\theta}_{\text{old}}}} \left[ \frac{\pi_{\boldsymbol{\theta}}(a \mid s)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a \mid s)} A^{\boldsymbol{\theta}_{\text{old}}}(s, a) \right]$$
$$\text{subject to} \quad \bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) \le \delta$$
where $\bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) = \mathbb{E}_{s \sim d^{\boldsymbol{\theta}_{\text{old}}}} \left[ D_{\text{KL}}(\pi_{\boldsymbol{\theta}_{\text{old}}}(\cdot \mid s) \parallel \pi_{\boldsymbol{\theta}}(\cdot \mid s)) \right]$, and $\delta$ is a user-defined step size bound (typically $\delta = 0.01$).

### Solving TRPO: Second-Order Quadratic Approximation
To solve this constrained problem efficiently:
1. Linearize the surrogate objective around $\boldsymbol{\theta}_{\text{old}}$:
$$L(\boldsymbol{\theta}) \approx L(\boldsymbol{\theta}_{\text{old}}) + \mathbf{g}^\top (\boldsymbol{\theta} - \boldsymbol{\theta}_{\text{old}})$$
where $\mathbf{g} = \nabla_{\boldsymbol{\theta}} L(\boldsymbol{\theta}) \big|_{\boldsymbol{\theta} = \boldsymbol{\theta}_{\text{old}}}$ is the policy gradient vector.
2. Form a quadratic Taylor expansion of the KL divergence constraint around $\boldsymbol{\theta}_{\text{old}}$:
$$\bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) \approx \frac{1}{2} (\boldsymbol{\theta} - \boldsymbol{\theta}_{\text{old}})^\top \mathbf{H} (\boldsymbol{\theta} - \boldsymbol{\theta}_{\text{old}})$$
where $\mathbf{H} = \nabla_{\boldsymbol{\theta}}^2 \bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) \big|_{\boldsymbol{\theta}=\boldsymbol{\theta}_{\text{old}}}$ is the **Fisher Information Matrix (FIM)**.

The optimization problem reduces to:
$$\max_{\Delta \boldsymbol{\theta}} \quad \mathbf{g}^\top \Delta \boldsymbol{\theta} \quad \text{subject to} \quad \frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{H} \Delta \boldsymbol{\theta} \le \delta$$

Using the method of Lagrange multipliers, the analytical solution is:
$$\Delta \boldsymbol{\theta} = \sqrt{\frac{2 \delta}{\mathbf{g}^\top \mathbf{H}^{-1} \mathbf{g}}} \mathbf{H}^{-1} \mathbf{g}$$

### The Conjugate Gradient Algorithm and Fisher-Vector Products
In a deep neural network with $1,000,000$ parameters, forming and inverting the $10^6 \times 10^6$ Fisher matrix $\mathbf{H}$ would consume 4 terabytes of memory and take hours to compute via Gaussian elimination.

TRPO bypasses matrix inversion by solving the linear system $\mathbf{H} \mathbf{x} = \mathbf{g}$ iteratively using the **Conjugate Gradient (CG)** algorithm. CG computes the search direction $\mathbf{x} \approx \mathbf{H}^{-1} \mathbf{g}$ in roughly 10–20 iterations without ever instantiating $\mathbf{H}$ explicitly! It requires only the **Hessian-vector product** (Fisher-vector product) $\mathbf{H} \mathbf{v}$:
$$\mathbf{H} \mathbf{v} = \nabla_{\boldsymbol{\theta}} \left( \left( \nabla_{\boldsymbol{\theta}} \bar{D}_{\text{KL}} \right)^\top \mathbf{v} \right)$$
which can be evaluated efficiently using two standard backward passes in automatic differentiation.

Finally, TRPO performs a **backtracking line search** along search direction $\mathbf{x}$ to ensure that the non-linear objective genuinely improves and the exact KL constraint is satisfied.

---

## 10.4 Proximal Policy Optimization (PPO)

While TRPO provides unprecedented stability and eliminates policy collapse, it suffers from severe engineering overhead:
- Second-order Conjugate Gradient solvers are difficult to parallelize and incompatible with modern distributed GPU pipelines.
- Fisher-vector products require multiple backward passes per step.
- TRPO cannot share neural network parameters between the Actor and Critic because the second-order Fisher matrix applies only to the policy distribution.

Schulman, Wolski, Dhariwal, Radford, and Klimov (2017) introduced **Proximal Policy Optimization (PPO)**: achieving the robust trust-region stability of TRPO using only **first-order stochastic gradient descent**.

### The Probability Ratio
Define the probability ratio (importance sampling weight) between the new policy and the old policy:
$$r_t(\boldsymbol{\theta}) = \frac{\pi_{\boldsymbol{\theta}}(a_t \mid s_t)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a_t \mid s_t)}$$
Notice:
- At the start of an update epoch, $\boldsymbol{\theta} = \boldsymbol{\theta}_{\text{old}} \implies r_t(\boldsymbol{\theta}) = 1.0$.
- If $r_t > 1$, action $a_t$ is more probable under the new policy than under the old policy.
- If $r_t < 1$, action $a_t$ is less probable under the new policy.

The unconstrained surrogate objective is:
$$L^{\text{CPI}}(\boldsymbol{\theta}) = \hat{\mathbb{E}}_t \left[ r_t(\boldsymbol{\theta}) \hat{A}_t \right]$$
(where CPI stands for *Conservative Policy Iteration*).

Without constraints, maximizing $L^{\text{CPI}}(\boldsymbol{\theta})$ leads to disaster: if an action achieves a positive advantage $\hat{A}_t > 0$, SGD will increase $r_t(\boldsymbol{\theta})$ to $+ \infty$, causing an enormous, unconstrained step that plunges off the policy cliff.

### The Clipped Surrogate Objective
To prevent $r_t(\boldsymbol{\theta})$ from moving too far from $1.0$, PPO penalizes changes that move $r_t$ outside the interval $[1 - \epsilon, 1 + \epsilon]$, where $\epsilon$ is a small hyperparameter (typically $\epsilon = 0.20$):
$$L^{\text{CLIP}}(\boldsymbol{\theta}) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\boldsymbol{\theta}) \hat{A}_t, \, \text{clip}(r_t(\boldsymbol{\theta}), 1 - \epsilon, 1 + \epsilon) \hat{A}_t \right) \right]$$

```
                         THE PPO CLIPPING SURROGATE
                         
      Positive Advantage A > 0               Negative Advantage A < 0
      
   L_CLIP                                 L_CLIP
     ▲                                      ▲
     │         Clipped: (1+ε)A              │              / Unclipped: r · A
     │       ────────────────               │             /
     │      /                               │            /
     │     /  Unclipped: r · A              │           /
     │    /                                 │  Clipped /
     │   /                                  │  ───────/   (1-ε)A
     └──┴───┴──────┴─────────► r            └──┴──────┴──┴─────────► r
       1-ε  1     1+ε                         1-ε     1  1+ε
```

### Deep Dive into the Min-Clip Mechanism
Let us dissect the two distinct cases based on the sign of the advantage $\hat{A}_t$:

#### Case 1: Positive Advantage ($\hat{A}_t > 0$)
The action performed **better than average**. We want to increase its probability ($r_t > 1$):
- When $1.0 \le r_t \le 1 + \epsilon$: The ratio is inside the trust region. The objective is $r_t \hat{A}_t$, rewarding the policy for increasing action likelihood.
- When $r_t > 1 + \epsilon$: The ratio has exceeded the trust region! The clipping function caps the value at $(1 + \epsilon) \hat{A}_t$.
- Taking the $\min(r_t \hat{A}_t, (1 + \epsilon)\hat{A}_t)$ selects the capped plateau $(1 + \epsilon)\hat{A}_t$.
- **Crucial Gradient Consequence:** On the flat plateau, $\frac{\partial}{\partial \boldsymbol{\theta}} [(1 + \epsilon)\hat{A}_t] = \mathbf{0}$. The gradient vanishes! The optimizer receives zero incentive to push the policy any further in that direction.

#### Case 2: Negative Advantage ($\hat{A}_t < 0$)
The action performed **worse than average**. We want to decrease its probability ($r_t < 1$):
- When $1 - \epsilon \le r_t \le 1.0$: The ratio is inside the trust region. The objective is $r_t \hat{A}_t$, penalizing the policy for selecting this action.
- When $r_t < 1 - \epsilon$: The action probability has already dropped significantly.
- Since $\hat{A}_t < 0$, multiplying by a smaller number yields a *larger* (less negative) value.
- Taking the $\min(r_t \hat{A}_t, (1 - \epsilon)\hat{A}_t)$ acts as a conservative lower bound: it prevents the objective from falsely appearing "rewarding" if the ratio collapses, and shuts off further gradients once $r_t < 1 - \epsilon$.

The min-clip operator creates an **asymmetric pessimistic lower bound** on policy performance:
$$L^{\text{CLIP}}(\boldsymbol{\theta}) \le L^{\text{CPI}}(\boldsymbol{\theta})$$
It allows the policy to safely execute **multiple epochs of mini-batch SGD** (e.g. 10 epochs of mini-batches) on the same collected trajectory data without destabilizing the policy.

---

## 10.5 PPO Architecture and Full Training Pipeline

In production reinforcement learning (e.g., OpenAI Five, robotics benchmarks, and RLHF for Large Language Models), PPO is the premier workhorse algorithm.

The complete training objective combines policy clipping, value function regression, and entropy regularization:
$$\mathcal{L}_t^{\text{PPO}}(\boldsymbol{\theta}, \boldsymbol{\phi}) = \hat{\mathbb{E}}_t \left[ L_t^{\text{CLIP}}(\boldsymbol{\theta}) - c_1 \mathcal{L}_t^{\text{VF}}(\boldsymbol{\phi}) + c_2 \mathcal{H}(\pi_{\boldsymbol{\theta}}(\cdot \mid s_t)) \right]$$

### Value Function Clipping
To prevent the Critic from taking destabilizingly large updates during multi-epoch SGD, PPO also clips the value function:
$$\mathcal{L}_t^{\text{VF}}(\boldsymbol{\phi}) = \frac{1}{2} \max\left( (V_{\boldsymbol{\phi}}(s_t) - y_t)^2, \, (V_{\boldsymbol{\phi}_{\text{old}}}(s_t) + \text{clip}(V_{\boldsymbol{\phi}}(s_t) - V_{\boldsymbol{\phi}_{\text{old}}}(s_t), -\epsilon_v, \epsilon_v) - y_t)^2 \right)$$

```
                         THE COMPLETE PPO ITERATION LOOP
                         
   ┌─────────────────────────────────────────────────────────────┐
   │ 1. Rollout Phase (Actor interacts with N environments):     │
   │    Collect N x T transitions using π_{θ_old}.               │
   │    Compute GAE advantages A_1, ..., A_M using Critic V_ϕ.   │
   │    Normalize advantages across entire rollout batch.        │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ 2. Optimization Phase (K Epochs over Mini-batches of Size B):│
   │    For epoch = 1 ... K:                                     │
   │       Shuffle transitions into random mini-batches.         │
   │       For each mini-batch:                                  │
   │          r_t(θ) = π_θ(a_t | s_t) / π_{θ_old}(a_t | s_t)     │
   │          Compute L^{CLIP}(θ), L^{VF}(ϕ), H(π_θ)             │
   │          Update θ, ϕ using Adam with gradient clipping.     │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ 3. Policy Synchronization:                                  │
   │    Set θ_old ← θ,  ϕ_old ← ϕ.                               │
   │    Proceed to next environment iteration.                   │
   └─────────────────────────────────────────────────────────────┘
```

---

## 10.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 10.1: Analytical Evaluation of PPO Clipped Objective
**Problem:** A policy executes action $a_t$ at state $s_t$.
The old action probability was $\pi_{\text{old}}(a_t \mid s_t) = 0.20$.
Let clipping parameter $\epsilon = 0.20$.
Evaluate $L^{\text{CLIP}}$ and the gradient status for the following scenarios:
1. Scenario A: $\hat{A}_t = +4.0$, new probability $\pi_{\boldsymbol{\theta}}(a_t \mid s_t) = 0.22$.
2. Scenario B: $\hat{A}_t = +4.0$, new probability $\pi_{\boldsymbol{\theta}}(a_t \mid s_t) = 0.30$.
3. Scenario C: $\hat{A}_t = -3.0$, new probability $\pi_{\boldsymbol{\theta}}(a_t \mid s_t) = 0.14$.

**Solution:**
Clipping interval: $[1 - \epsilon, 1 + \epsilon] = [0.80, 1.20]$.

1. Scenario A:
- Probability ratio: $r_t = \frac{0.22}{0.20} = 1.10$.
- Is $r_t$ in $[0.80, 1.20]$? Yes ($1.10 \in [0.80, 1.20]$).
- $\text{clip}(r_t, 0.8, 1.2) = 1.10$.
- $L_1 = r_t \hat{A}_t = 1.10 \times 4.0 = 4.40$.
- $L_2 = \text{clip}(r_t) \hat{A}_t = 1.10 \times 4.0 = 4.40$.
$$L^{\text{CLIP}} = \min(4.40, 4.40) = 4.40$$
Gradient status: **Active** ($\frac{\partial L^{\text{CLIP}}}{\partial \boldsymbol{\theta}} = \hat{A}_t \nabla_{\boldsymbol{\theta}} r_t$).

2. Scenario B:
- Probability ratio: $r_t = \frac{0.30}{0.20} = 1.50$.
- Clipped ratio: $\text{clip}(1.50, 0.8, 1.2) = 1.20$.
- $L_1 = r_t \hat{A}_t = 1.50 \times 4.0 = 6.00$.
- $L_2 = \text{clip}(r_t) \hat{A}_t = 1.20 \times 4.0 = 4.80$.
$$L^{\text{CLIP}} = \min(6.00, 4.80) = 4.80$$
Gradient status: **Clipped / Zero Gradient** ($\frac{\partial L^{\text{CLIP}}}{\partial \boldsymbol{\theta}} = \mathbf{0}$). The optimizer stops pushing $\pi(a_t)$ higher.

3. Scenario C:
- Probability ratio: $r_t = \frac{0.14}{0.20} = 0.70$.
- Advantage is negative: $\hat{A}_t = -3.0 < 0$.
- Clipped ratio: $\text{clip}(0.70, 0.8, 1.2) = 0.80$.
- $L_1 = r_t \hat{A}_t = 0.70 \times (-3.0) = -2.10$.
- $L_2 = \text{clip}(r_t) \hat{A}_t = 0.80 \times (-3.0) = -2.40$.
$$L^{\text{CLIP}} = \min(-2.10, -2.40) = -2.40$$
Notice that $\min(-2.10, -2.40) = -2.40$ selected the clipped plateau $L_2$!
Gradient status: **Clipped / Zero Gradient**. The probability of this bad action has already decreased sufficiently.

---

### Worked Example 10.2: Numerical Fisher Information Matrix Calculation
**Problem:** Consider a 2-parameter categorical policy over 3 actions:
Logits are $h_1 = \theta_1, h_2 = \theta_2, h_3 = 0$.
At $\boldsymbol{\theta}_{\text{old}} = [0, 0]^\top$, the probabilities are uniform: $\mathbf{p} = [\frac{1}{3}, \frac{1}{3}, \frac{1}{3}]^\top$.
1. Compute the score function vectors $\nabla_{\boldsymbol{\theta}} \log \pi(a_i)$ for $i \in \{1, 2, 3\}$.
2. Compute the exact $2 \times 2$ Fisher Information Matrix $\mathbf{F} = \sum_{i=1}^3 p_i \nabla \log \pi(a_i) \nabla \log \pi(a_i)^\top$.
3. Invert $\mathbf{F}$ analytically.

**Solution:**
1. Score functions:
From Worked Example 6.1: $\nabla_{\boldsymbol{\theta}} \log \pi(a_i) = \mathbf{e}_i - \mathbf{p}_{1:2}$ where $\mathbf{p}_{1:2} = [\frac{1}{3}, \frac{1}{3}]^\top$:
- For $a_1$: $\nabla \log \pi(a_1) = \begin{bmatrix} 1 - \frac{1}{3} \\ 0 - \frac{1}{3} \end{bmatrix} = \begin{bmatrix} \frac{2}{3} \\ -\frac{1}{3} \end{bmatrix}$.
- For $a_2$: $\nabla \log \pi(a_2) = \begin{bmatrix} 0 - \frac{1}{3} \\ 1 - \frac{1}{3} \end{bmatrix} = \begin{bmatrix} -\frac{1}{3} \\ \frac{2}{3} \end{bmatrix}$.
- For $a_3$: $\nabla \log \pi(a_3) = \begin{bmatrix} 0 - \frac{1}{3} \\ 0 - \frac{1}{3} \end{bmatrix} = \begin{bmatrix} -\frac{1}{3} \\ -\frac{1}{3} \end{bmatrix}$.

2. Outer products:
- For $a_1$: $\begin{bmatrix} \frac{2}{3} \\ -\frac{1}{3} \end{bmatrix} \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \end{bmatrix} = \begin{bmatrix} \frac{4}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{1}{9} \end{bmatrix}$.
- For $a_2$: $\begin{bmatrix} -\frac{1}{3} \\ \frac{2}{3} \end{bmatrix} \begin{bmatrix} -\frac{1}{3} & \frac{2}{3} \end{bmatrix} = \begin{bmatrix} \frac{1}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{4}{9} \end{bmatrix}$.
- For $a_3$: $\begin{bmatrix} -\frac{1}{3} \\ -\frac{1}{3} \end{bmatrix} \begin{bmatrix} -\frac{1}{3} & -\frac{1}{3} \end{bmatrix} = \begin{bmatrix} \frac{1}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{1}{9} \end{bmatrix}$.
Expectation ($p_i = \frac{1}{3}$):
$$\mathbf{F} = \frac{1}{3} \left( \begin{bmatrix} \frac{4}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{1}{9} \end{bmatrix} + \begin{bmatrix} \frac{1}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{4}{9} \end{bmatrix} + \begin{bmatrix} \frac{1}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{1}{9} \end{bmatrix} \right) = \frac{1}{3} \begin{bmatrix} \frac{6}{9} & -\frac{3}{9} \\ -\frac{3}{9} & \frac{6}{9} \end{bmatrix} = \frac{1}{3} \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \\ -\frac{1}{3} & \frac{2}{3} \end{bmatrix} = \begin{bmatrix} \frac{2}{9} & -\frac{1}{9} \\ -\frac{1}{9} & \frac{2}{9} \end{bmatrix}$$

3. Inversion:
Determinant: $\det(\mathbf{F}) = (\frac{2}{9})(\frac{2}{9}) - (-\frac{1}{9})(-\frac{1}{9}) = \frac{4}{81} - \frac{1}{81} = \frac{3}{81} = \frac{1}{27}$.
$$\mathbf{F}^{-1} = \frac{1}{\det(\mathbf{F})} \begin{bmatrix} \frac{2}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{2}{9} \end{bmatrix} = 27 \begin{bmatrix} \frac{2}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{2}{9} \end{bmatrix} = \begin{bmatrix} 6 & 3 \\ 3 & 6 \end{bmatrix}$$

---

### Worked Example 10.3: TRPO Quadratic Step Calculation
**Problem:** Using the Fisher matrix inverse $\mathbf{F}^{-1} = \begin{bmatrix} 6 & 3 \\ 3 & 6 \end{bmatrix}$ from Worked Example 10.2:
Suppose the policy gradient is $\mathbf{g} = [0.1, 0.2]^\top$.
Let the trust region bound be $\delta = 0.01$.
1. Compute the unconstrained Natural Policy Gradient direction $\mathbf{x} = \mathbf{F}^{-1} \mathbf{g}$.
2. Compute the quadratic term $\mathbf{g}^\top \mathbf{x} = \mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}$.
3. Compute the exact step scaling factor $\beta = \sqrt{\frac{2\delta}{\mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}}}$ and the parameter update $\Delta \boldsymbol{\theta}$.

**Solution:**
1. Direction vector $\mathbf{x}$:
$$\mathbf{x} = \begin{bmatrix} 6 & 3 \\ 3 & 6 \end{bmatrix} \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} = \begin{bmatrix} 0.6 + 0.6 \\ 0.3 + 1.2 \end{bmatrix} = \begin{bmatrix} 1.2 \\ 1.5 \end{bmatrix}$$

2. Quadratic term:
$$\mathbf{g}^\top \mathbf{x} = [0.1, 0.2] \begin{bmatrix} 1.2 \\ 1.5 \end{bmatrix} = 0.1(1.2) + 0.2(1.5) = 0.12 + 0.30 = 0.42$$

3. Step scaling factor:
$$\beta = \sqrt{\frac{2 \times 0.01}{0.42}} = \sqrt{\frac{0.02}{0.42}} = \sqrt{\frac{1}{21}} \approx 0.2182$$
Parameter update:
$$\Delta \boldsymbol{\theta} = \beta \mathbf{x} = 0.2182 \begin{bmatrix} 1.2 \\ 1.5 \end{bmatrix} = \begin{bmatrix} 0.2619 \\ 0.3273 \end{bmatrix}$$
Verification of constraint:
$$\frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{F} \Delta \boldsymbol{\theta} = \frac{1}{2} \beta^2 (\mathbf{x}^\top \mathbf{F} \mathbf{x}) = \frac{1}{2} \left(\frac{2\delta}{\mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}}\right) (\mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}) = \delta = 0.01$$
The update satisfies the trust region bound exactly.

---

### Worked Example 10.4: KL Divergence Between Two 1D Gaussian Policies
**Problem:** In continuous control, policies are parameterized as Gaussians: $\pi_{\text{old}} = \mathcal{N}(\mu_{\text{old}}, \sigma_{\text{old}}^2)$ and $\pi_{\text{new}} = \mathcal{N}(\mu_{\text{new}}, \sigma_{\text{new}}^2)$.
1. Derive the closed-form KL divergence $D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\text{new}})$.
2. For $\mu_{\text{old}} = 0.0, \sigma_{\text{old}} = 1.0$, and $\mu_{\text{new}} = 0.2, \sigma_{\text{new}} = 0.90$, compute $D_{\text{KL}}$.

**Solution:**
1. Analytical derivation:
$$D_{\text{KL}}(\mathcal{N}_0 \parallel \mathcal{N}_1) = \int p_0(x) \ln\left( \frac{p_0(x)}{p_1(x)} \right) dx$$
$$= \int p_0(x) \left[ \ln\left(\frac{\sigma_1}{\sigma_0}\right) - \frac{(x - \mu_0)^2}{2\sigma_0^2} + \frac{(x - \mu_1)^2}{2\sigma_1^2} \right] dx$$
Notice that $\int p_0(x) (x - \mu_0)^2 dx = \sigma_0^2$, and $\int p_0(x) (x - \mu_1)^2 dx = \sigma_0^2 + (\mu_0 - \mu_1)^2$.
$$D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\text{new}}) = \ln\left( \frac{\sigma_{\text{new}}}{\sigma_{\text{old}}} \right) - \frac{1}{2} + \frac{\sigma_{\text{old}}^2 + (\mu_{\text{old}} - \mu_{\text{new}})^2}{2\sigma_{\text{new}}^2}$$
$$= \ln\left( \frac{\sigma_{\text{new}}}{\sigma_{\text{old}}} \right) + \frac{\sigma_{\text{old}}^2 - \sigma_{\text{new}}^2 + (\mu_{\text{old}} - \mu_{\text{new}})^2}{2\sigma_{\text{new}}^2}$$

2. Numerical evaluation:
$$\ln\left(\frac{0.90}{1.0}\right) = \ln(0.90) \approx -0.10536$$
$$\sigma_{\text{old}}^2 = 1.0, \quad \sigma_{\text{new}}^2 = 0.81, \quad (\mu_{\text{old}} - \mu_{\text{new}})^2 = (0 - 0.2)^2 = 0.04$$
$$\text{Numerator} = 1.0 - 0.81 + 0.04 = 0.23$$
$$\text{Fraction} = \frac{0.23}{2 \times 0.81} = \frac{0.23}{1.62} \approx 0.14198$$
$$D_{\text{KL}} = -0.10536 + 0.14198 = 0.03662 \text{ nats}$$

---

### Worked Example 10.5: PPO Log-Ratio Computation for Numerical Stability
**Problem:** In deep learning codebases, computing $r_t = \frac{\pi_{\boldsymbol{\theta}}(a_t \mid s_t)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a_t \mid s_t)}$ directly can cause severe floating-point underflow or overflow when probabilities are tiny ($10^{-20}$).
Show how $r_t$ is computed using log-probabilities:
$$r_t = \exp\left( \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) - \log \pi_{\boldsymbol{\theta}_{\text{old}}}(a_t \mid s_t) \right)$$
For $\log \pi_{\boldsymbol{\theta}} = -45.2$ and $\log \pi_{\boldsymbol{\theta}_{\text{old}}} = -45.0$, compute $r_t$.

**Solution:**
Computing raw probabilities directly would produce:
$$\pi_{\boldsymbol{\theta}} = e^{-45.2} \approx 2.34 \times 10^{-20}, \quad \pi_{\boldsymbol{\theta}_{\text{old}}} = e^{-45.0} \approx 2.86 \times 10^{-20}$$
In single-precision float32, very small numbers risk zero underflow.
Using difference of logarithms:
$$\Delta \log \pi = \log \pi_{\boldsymbol{\theta}} - \log \pi_{\boldsymbol{\theta}_{\text{old}}} = -45.2 - (-45.0) = -0.20$$
Evaluating the exponential:
$$r_t = \exp(-0.20) \approx 0.8187$$
The computation executes with 100% numerical precision without ever materializing subnormal floating-point numbers.

---

### Worked Example 10.6: Backtracking Line Search in TRPO
**Problem:** TRPO computes candidate step $\Delta \boldsymbol{\theta}_0 = [0.4, 0.4]^\top$.
The line search checks step sizes $\Delta \boldsymbol{\theta}_j = \alpha^j \Delta \boldsymbol{\theta}_0$ with decay rate $\alpha = 0.5$ for $j = 0, 1, 2, \dots$.
Acceptance criteria:
1. Surrogate improvement: $L(\boldsymbol{\theta}_j) - L(\boldsymbol{\theta}_{\text{old}}) > 0$.
2. Exact KL constraint: $\bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}_j) \le \delta = 0.01$.
Suppose the evaluated metrics are:
- $j = 0$ ($\Delta \boldsymbol{\theta}_0$): $L - L_{\text{old}} = +0.15$, but $D_{\text{KL}} = 0.016 > 0.01$ (Constraint violated!).
- $j = 1$ ($\Delta \boldsymbol{\theta}_1 = 0.5 \Delta \boldsymbol{\theta}_0$): $L - L_{\text{old}} = +0.09$, and $D_{\text{KL}} = 0.007 \le 0.01$ (Valid!).
Which step is accepted, and what is its value?

**Solution:**
At $j = 0$: $D_{\text{KL}} = 0.016 > 0.01$. The step is rejected because it exceeds the trust region.
The line search scales the step by $\alpha = 0.5$:
$$\Delta \boldsymbol{\theta}_1 = 0.5 \begin{bmatrix} 0.4 \\ 0.4 \end{bmatrix} = \begin{bmatrix} 0.2 \\ 0.2 \end{bmatrix}$$
At $j = 1$: $L - L_{\text{old}} = +0.09 > 0$, and $D_{\text{KL}} = 0.007 \le 0.01$.
Both conditions are satisfied! Step $j = 1$ is accepted: $\Delta \boldsymbol{\theta} = [0.2, 0.2]^\top$.

---

### Worked Example 10.7: Value Function Clipping Loss Calculation
**Problem:** In PPO with value clipping ($\epsilon_v = 0.2$), a state has old predicted value $V_{\text{old}} = 10.0$.
The TD target is $y = 12.0$.
Current network prediction is $V_{\boldsymbol{\phi}} = 10.5$.
1. Compute the unclipped squared error $(V_{\boldsymbol{\phi}} - y)^2$.
2. Compute the clipped value prediction $V_{\text{clipped}} = V_{\text{old}} + \text{clip}(V_{\boldsymbol{\phi}} - V_{\text{old}}, -\epsilon_v, \epsilon_v)$.
3. Compute the clipped squared error $(V_{\text{clipped}} - y)^2$ and the PPO value loss $\mathcal{L}^{\text{VF}} = \frac{1}{2}\max(\text{unclipped}, \text{clipped})$.

**Solution:**
1. Unclipped error:
$$(V_{\boldsymbol{\phi}} - y)^2 = (10.5 - 12.0)^2 = (-1.5)^2 = 2.25$$

2. Clipped value:
$$\text{Difference} = V_{\boldsymbol{\phi}} - V_{\text{old}} = 10.5 - 10.0 = +0.50$$
$$\text{Clipped Difference} = \text{clip}(0.50, -0.20, 0.20) = +0.20$$
$$V_{\text{clipped}} = 10.0 + 0.20 = 10.20$$

3. Clipped error and final loss:
$$(V_{\text{clipped}} - y)^2 = (10.20 - 12.0)^2 = (-1.80)^2 = 3.24$$
Taking the maximum:
$$\mathcal{L}^{\text{VF}} = \frac{1}{2} \max(2.25, 3.24) = \frac{1}{2} (3.24) = 1.62$$
Notice that taking the maximum penalizes the network more heavily for trying to change $V$ faster than $\epsilon_v$, discouraging rapid value churn across multi-epoch SGD.

---

### Worked Example 10.8: Clipping Fraction Metric Tracking
**Problem:** Across a mini-batch of $B = 100$ transitions, an agent records probability ratios $r_t$.
Hyperparameter $\epsilon = 0.20$.
$12$ transitions have $r_t > 1.20$, and $8$ transitions have $r_t < 0.80$.
1. Compute the **Clipping Fraction** (ClipFrac).
2. What diagnostic information does a ClipFrac of $0.20$ provide?
3. What should a practitioner do if ClipFrac exceeds $0.50$?

**Solution:**
1. ClipFrac calculation:
Total clipped samples $= 12 + 8 = 20$.
$$\text{ClipFrac} = \frac{20}{100} = 0.20 \quad (20\%)$$

2. Diagnostic meaning:
$20\%$ of the transitions in the batch have hit the boundary of the trust region. In standard PPO training, a ClipFrac between $0.10$ and $0.25$ indicates healthy, active policy updates with stable trust-region enforcement.

3. Action if ClipFrac $> 0.50$:
If more than $50\%$ of transitions are clipped, the policy is changing far too rapidly across mini-batch epochs. The optimizer is wasting gradient steps on clipped, zero-gradient samples, and the policy risks catastrophic collapse. The practitioner should:
- Reduce the policy learning rate $\alpha$.
- Reduce the number of training epochs per rollout (e.g. from 10 down to 4).
- Tighten the clipping threshold $\epsilon$ (e.g. from 0.2 down to 0.1).

---

### Worked Example 10.9: Conjugate Gradient Vector Step in TypeScript
**Problem:** Author a TypeScript function `conjugateGradient` that solves the symmetric positive-definite linear system $\mathbf{A} \mathbf{x} = \mathbf{b}$ using iterative matrix-vector products $A(v)$ without forming matrix $\mathbf{A}$.

**Solution:**
```typescript
export function conjugateGradient(
  AvProduct: (v: Float64Array) => Float64Array,
  b: Float64Array,
  maxIterations: number = 10,
  residualTol: number = 1e-10
): Float64Array {
  const n = b.length;
  const x = new Float64Array(n); // initial guess x0 = 0
  const r = new Float64Array(b);  // r0 = b - A*x0 = b
  const p = new Float64Array(b);  // p0 = r0

  let rsOld = 0;
  for (let i = 0; i < n; i++) rsOld += r[i] * r[i];

  for (let iter = 0; iter < maxIterations; iter++) {
    if (Math.sqrt(rsOld) < residualTol) break;

    const Ap = AvProduct(p);
    let pAp = 0;
    for (let i = 0; i < n; i++) pAp += p[i] * Ap[i];

    if (pAp <= 0) break; // Numerical safety

    const alpha = rsOld / pAp;
    for (let i = 0; i < n; i++) {
      x[i] += alpha * p[i];
      r[i] -= alpha * Ap[i];
    }

    let rsNew = 0;
    for (let i = 0; i < n; i++) rsNew += r[i] * r[i];

    const beta = rsNew / rsOld;
    for (let i = 0; i < n; i++) {
      p[i] = r[i] + beta * p[i];
    }
    rsOld = rsNew;
  }

  return x;
}
```

Verification Test:
```typescript
// Solve A * x = b where A = [[2, -1], [-1, 2]] and b = [1, 2]
const A_mat = [[2, -1], [-1, 2]];
const Av = (v: Float64Array) => new Float64Array([
  A_mat[0][0]*v[0] + A_mat[0][1]*v[1],
  A_mat[1][0]*v[0] + A_mat[1][1]*v[1]
]);
const sol = conjugateGradient(Av, new Float64Array([1, 2]));
console.log("CG Solution:", sol[0].toFixed(4), sol[1].toFixed(4));
// Exact analytical solution is x = [4/3, 5/3] = [1.3333, 1.6667]
```

---

### Worked Example 10.10: Complete TypeScript Implementation of PPO Clipped Surrogate Loss
**Problem:** Author a TypeScript class `PPOLossEngine` that evaluates the PPO Clipped Surrogate Loss, value function clipped loss, Shannon entropy, and tracks diagnostic metrics (ClipFrac, approx KL).

**Solution:**
```typescript
export interface PPOMiniBatch {
  logProbsOld: Float64Array;
  valuesOld: Float64Array;
  advantages: Float64Array;
  returns: Float64Array;
}

export class PPOLossEngine {
  constructor(
    public readonly clipEps: number = 0.20,
    public readonly vfClipEps: number = 0.20,
    public readonly vfCoef: number = 0.50,
    public readonly entCoef: number = 0.01
  ) {}

  evaluate(
    batch: PPOMiniBatch,
    currentLogProbs: Float64Array,
    currentValues: Float64Array,
    currentEntropies: Float64Array
  ): {
    totalLoss: number;
    policyLoss: number;
    valueLoss: number;
    entropy: number;
    clipFrac: number;
    approxKL: number;
  } {
    const B = batch.logProbsOld.length;
    let policyLossSum = 0;
    let valueLossSum = 0;
    let entropySum = 0;
    let clippedCount = 0;
    let approxKLSum = 0;

    for (let i = 0; i < B; i++) {
      // 1. Probability ratio: r_t = exp(log_pi - log_pi_old)
      const logRatio = currentLogProbs[i] - batch.logProbsOld[i];
      const ratio = Math.exp(logRatio);

      // Approximate KL divergence: (ratio - 1) - logRatio (Schulman, 2020)
      approxKLSum += (ratio - 1.0) - logRatio;

      // 2. Clipped policy objective
      const adv = batch.advantages[i];
      const surr1 = ratio * adv;
      const clippedRatio = Math.max(1.0 - this.clipEps, Math.min(1.0 + this.clipEps, ratio));
      const surr2 = clippedRatio * adv;

      // Track clipping
      if (Math.abs(ratio - 1.0) > this.clipEps) clippedCount++;

      // PPO minimizes negative clipped surrogate
      const pLoss = -Math.min(surr1, surr2);
      policyLossSum += pLoss;

      // 3. Clipped Value Loss
      const vTarget = batch.returns[i];
      const vPred = currentValues[i];
      const vOld = batch.valuesOld[i];
      const vUnclipped = (vPred - vTarget) ** 2;
      const vClippedPred = vOld + Math.max(-this.vfClipEps, Math.min(this.vfClipEps, vPred - vOld));
      const vClipped = (vClippedPred - vTarget) ** 2;
      valueLossSum += 0.5 * Math.max(vUnclipped, vClipped);

      // 4. Entropy
      entropySum += currentEntropies[i];
    }

    const policyLoss = policyLossSum / B;
    const valueLoss = valueLossSum / B;
    const entropy = entropySum / B;
    const clipFrac = clippedCount / B;
    const approxKL = approxKLSum / B;

    const totalLoss = policyLoss + this.vfCoef * valueLoss - this.entCoef * entropy;

    return { totalLoss, policyLoss, valueLoss, entropy, clipFrac, approxKL };
  }
}
```

---

## 10.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 10.1: Analytical Bound on Policy Ratio Variance
**Problem:** Let $p_{\text{old}} \sim \mathcal{N}(0, 1)$ and $p_{\text{new}} \sim \mathcal{N}(\mu, 1)$ be two Gaussian distributions with mean shift $\mu$.
1. Compute the importance sampling ratio $r(x) = \frac{p_{\text{new}}(x)}{p_{\text{old}}(x)}$.
2. Compute the second moment $\mathbb{E}_{x \sim p_{\text{old}}}[r(x)^2]$.
3. Show that the variance of the unclipped ratio explodes exponentially as $\mathbb{V}[r] = e^{\mu^2} - 1$.

**Solution:**
1. Ratio calculation:
$$p_{\text{old}}(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}}, \quad p_{\text{new}}(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{(x - \mu)^2}{2}}$$
$$r(x) = \exp\left( -\frac{x^2 - 2\mu x + \mu^2 - x^2}{2} \right) = \exp\left( \mu x - \frac{\mu^2}{2} \right)$$

2. Second moment:
$$\mathbb{E}_{x \sim p_{\text{old}}}[r(x)^2] = \int_{-\infty}^\infty \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}} \cdot \exp\left( 2\mu x - \mu^2 \right) dx$$
$$= e^{-\mu^2} \int_{-\infty}^\infty \frac{1}{\sqrt{2\pi}} \exp\left( -\frac{x^2 - 4\mu x}{2} \right) dx$$
Completing the square: $x^2 - 4\mu x = (x - 2\mu)^2 - 4\mu^2$.
$$= e^{-\mu^2} \cdot e^{\frac{4\mu^2}{2}} \int_{-\infty}^\infty \frac{1}{\sqrt{2\pi}} e^{-\frac{(x - 2\mu)^2}{2}} dx = e^{-\mu^2} \cdot e^{2\mu^2} \cdot 1 = e^{\mu^2}$$

3. Variance:
Since $\mathbb{E}[r(x)] = 1.0$:
$$\mathbb{V}[r(x)] = \mathbb{E}[r(x)^2] - (\mathbb{E}[r(x)])^2 = e^{\mu^2} - 1$$
As the policy mean drifts, the variance explodes exponentially: for $\mu = 3.0$, $\mathbb{V}[r] = e^9 - 1 \approx 8,102$. This exponential explosion proves why unclipped ratio objectives are violently unstable and require PPO's clipping mechanism.

---

### Exercise 10.2: Schulman's Approximate KL Estimator
**Problem:** In PPO monitoring, computing the exact analytical KL divergence across deep networks can be expensive. Schulman (2020) proposed the estimator:
$$\hat{D}_{\text{KL}} = \frac{1}{B}\sum_{i=1}^B \left( (r_i - 1) - \ln r_i \right)$$
where $r_i = \frac{\pi_{\boldsymbol{\theta}}(a_i \mid s_i)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a_i \mid s_i)}$.
1. Prove that for any $r > 0$, $(r - 1) - \ln r \ge 0$, with equality if and only if $r = 1$.
2. Prove that $\mathbb{E}_{a \sim \pi_{\text{old}}}[\hat{D}_{\text{KL}}] = D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\boldsymbol{\theta}})$.
3. Why is this estimator strictly non-negative in sample averages, unlike the naive estimator $\ln \pi_{\text{old}} - \ln \pi_{\boldsymbol{\theta}}$?

**Solution:**
1. Strictly non-negative property:
Let $f(r) = r - 1 - \ln r$ on $(0, \infty)$.
Derivative: $f'(r) = 1 - \frac{1}{r}$.
- For $r < 1$: $f'(r) < 0$ (decreasing).
- For $r > 1$: $f'(r) > 0$ (increasing).
- At $r = 1$: $f(1) = 0 - 0 = 0$.
The global minimum is $f(1) = 0$, so $f(r) \ge 0$ for all $r > 0$.

2. Expectation proof:
$$\mathbb{E}_{a \sim \pi_{\text{old}}}[(r - 1) - \ln r] = \mathbb{E}_{a \sim \pi_{\text{old}}}[r] - \mathbb{E}_{a \sim \pi_{\text{old}}}[1] - \mathbb{E}_{a \sim \pi_{\text{old}}}[\ln r]$$
Notice:
- $\mathbb{E}_{a \sim \pi_{\text{old}}}[r] = \sum_a \pi_{\text{old}}(a) \frac{\pi_{\boldsymbol{\theta}}(a)}{\pi_{\text{old}}(a)} = \sum_a \pi_{\boldsymbol{\theta}}(a) = 1$.
- $\mathbb{E}_{a \sim \pi_{\text{old}}}[1] = 1$.
- Therefore: $\mathbb{E}[r - 1] = 1 - 1 = 0$.
Remaining term:
$$- \mathbb{E}_{a \sim \pi_{\text{old}}}[\ln r] = - \mathbb{E}_{a \sim \pi_{\text{old}}} \left[ \ln \pi_{\boldsymbol{\theta}}(a) - \ln \pi_{\text{old}}(a) \right] = \mathbb{E}_{a \sim \pi_{\text{old}}} \left[ \ln \frac{\pi_{\text{old}}(a)}{\pi_{\boldsymbol{\theta}}(a)} \right] = D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\boldsymbol{\theta}}) \quad \blacksquare$$

3. Benefit:
The naive estimator $\hat{d} = \log \pi_{\text{old}} - \log \pi$ can produce negative sample values ($\hat{d} < 0$) due to finite-sample Monte Carlo variance, confusing monitoring dashboards. Schulman's estimator is positive at every single sample point ($f(r_i) \ge 0$), guaranteeing that the empirical mean is strictly non-negative.

---

### Exercise 10.3: Early Stopping via KL Threshold in PPO
**Problem:** In many PPO codebases, an early stopping mechanism halts multi-epoch SGD if the policy shifts too quickly:
$$\text{If } \hat{D}_{\text{KL}} > 1.5 \cdot \text{target\_kl}, \text{ break epoch loop.}$$
Suppose `target_kl = 0.01`.
Explain why early stopping acts as a secondary dynamic safety rail alongside ratio clipping.

**Solution:**
Ratio clipping ($L^{\text{CLIP}}$) operates independently on each individual transition tuple in isolation. However, across 10 epochs of mini-batch SGD, parameter updates accumulate. Even if no single sample exceeds clipping bounds, the *cumulative* shift of the policy over the entire state space can still exceed safe limits. Monitoring the average KL divergence and early-stopping when $\hat{D}_{\text{KL}} > 0.015$ guarantees that the policy never drifts outside the valid trust region regardless of how many training epochs are scheduled.

---

### Exercise 10.4: Linear Annealing of PPO Clipping Parameter
**Problem:** Some practitioners anneal the clipping parameter linearly:
$$\epsilon_t = \epsilon_0 \left( 1 - \frac{t}{T_{\max}} \right)$$
from $\epsilon_0 = 0.20$ down to $0.0$.
Discuss the mathematical implication of letting $\epsilon \to 0$ near the end of training.

**Solution:**
As $\epsilon \to 0$, the clipping boundary interval $[1 - \epsilon, 1 + \epsilon]$ contracts to the single point $[1.0, 1.0]$.
When $\epsilon = 0$, any parameter update that shifts $r_t \neq 1.0$ is immediately clipped to $1.0 \cdot \hat{A}_t$, where the gradient with respect to $\boldsymbol{\theta}$ vanishes!
Letting $\epsilon \to 0$ effectively freezes the policy, preventing fine-tuned late-stage weights from being disrupted. In practice, annealing $\epsilon$ to a small positive floor (e.g. 0.05) is preferred over 0.0 to maintain minimal learning plasticity.

---

### Exercise 10.5: Dual-Clip PPO for Extreme Negative Advantages
**Problem:** In extreme distributed RL (e.g. Ye et al., 2020, Tencent *Honor of Kings* AI), researchers observed that when advantage $\hat{A}_t \ll 0$ is extremely negative, ratio clipping does not bound the objective from below when $r_t > 1$.
They introduced **Dual-Clip PPO**:
$$L^{\text{dual}}(\boldsymbol{\theta}) = \max\left( L^{\text{CLIP}}(\boldsymbol{\theta}), \, c_3 \hat{A}_t \right) \quad \text{for } \hat{A}_t < 0$$
where $c_3 > 1.0$ (typically $c_3 = 3.0$).
Explain why unconstrained negative loss spikes occur and how Dual-Clip resolves them.

**Solution:**
When $\hat{A}_t < 0$, if the policy update inadvertently increases $r_t$ (e.g. $r_t = 2.0$), the unclipped objective is $r_t \hat{A}_t = 2.0(-100) = -200$.
The clipping function checks $\min(r_t \hat{A}_t, (1-\epsilon)\hat{A}_t) = \min(-200, -80) = -200$.
Notice that the min-operator selected the unclipped $-200$!
Because $r_t > 1$, the loss is excessively negative, generating an enormous gradient that violently destabilizes the network.
Dual-Clip PPO applies a lower threshold: $\max(-200, 3.0(-100)) = \max(-200, -300) = -200$, or caps it at $c_3 \hat{A}_t$. This caps the magnitude of negative gradients, preventing catastrophic updates from outlier failed transitions.

---

### Exercise 10.6: PPO Rollout Horizon vs Mini-Batch Size Trade-off
**Problem:** An A2C/PPO agent is configured with $N = 8$ environments, rollout steps $T = 128$, mini-batch size $B = 64$, and $K = 4$ epochs.
1. Compute the total number of transitions collected per iteration.
2. Compute the number of mini-batches per epoch.
3. Compute the total number of gradient updates performed per rollout iteration.

**Solution:**
1. Transitions per iteration:
$$\text{Total Transitions} = N \times T = 8 \times 128 = 1,024 \text{ transitions}$$

2. Mini-batches per epoch:
$$\text{Mini-batches per epoch} = \frac{1,024}{B} = \frac{1,024}{64} = 16 \text{ mini-batches}$$

3. Total gradient steps per iteration:
$$\text{Total Gradient Steps} = K \times 16 = 4 \times 16 = 64 \text{ gradient steps}$$
Every environment interaction step amortizes across 64 mini-batch updates, extracting $4\times$ greater sample efficiency than single-epoch A2C.

---

### Exercise 10.7: Fisher-Vector Product via Automatic Differentiation
**Problem:** In automatic differentiation frameworks, show how the Hessian-vector product $\mathbf{H} \mathbf{v} = \nabla_{\boldsymbol{\theta}}^2 f(\boldsymbol{\theta}) \mathbf{v}$ is computed using two successive gradient calls without storing the Hessian matrix.

**Solution:**
1. Let $f(\boldsymbol{\theta})$ be a scalar objective (e.g. $\bar{D}_{\text{KL}}$).
2. First call: Compute the gradient vector $\mathbf{g}(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta})$.
3. Take the scalar inner product with vector $\mathbf{v}$:
$$\phi(\boldsymbol{\theta}) = \mathbf{g}(\boldsymbol{\theta})^\top \mathbf{v} = \sum_{i=1}^d g_i(\boldsymbol{\theta}) v_i$$
4. Second call: Differentiate scalar $\phi(\boldsymbol{\theta})$ with respect to $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \phi(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} \left( \nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta})^\top \mathbf{v} \right) = \nabla_{\boldsymbol{\theta}}^2 f(\boldsymbol{\theta}) \mathbf{v} = \mathbf{H} \mathbf{v}$$
Both operations execute in standard $\mathcal{O}(d)$ time and memory.

---

### Exercise 10.8: Entropy Collapse in PPO on Continuous Action Spaces
**Problem:** In continuous control with Gaussian policy $\pi = \mathcal{N}(\mu, \sigma^2)$, the differential entropy is $\mathcal{H} = \ln \sigma + \text{const}$.
If the policy learning rate is too high, $\sigma$ can shrink rapidly from $1.0$ to $10^{-5}$ in a few iterations.
1. Calculate the entropy change $\Delta \mathcal{H}$ when $\sigma$ drops from $1.0$ to $10^{-5}$.
2. Why is recovery from $\sigma = 10^{-5}$ virtually impossible without setting an artificial standard deviation floor?

**Solution:**
1. Entropy change:
$$\Delta \mathcal{H} = \ln(10^{-5}) - \ln(1.0) = -5 \ln(10) \approx -5(2.3026) = -11.51 \text{ nats}$$

2. Impossibility of recovery:
When $\sigma = 10^{-5}$, the action distribution is virtually a deterministic Dirac delta centered at $\mu$. The sampled actions $a = \mu + 10^{-5} z$ differ from $\mu$ by only 0.00001. The agent cannot explore any alternate actions. If the mean $\mu$ is suboptimal, all sampled actions yield identical returns, generating zero advantage differentiation and zero learning signal. PPO codebases universally enforce a minimum standard deviation floor (e.g. $\sigma \ge 0.10$).

---

### Exercise 10.9: PPO with Generalized Advantage Estimation Synergy
**Problem:** Why is GAE specifically suited for PPO?
Contrast PPO + GAE with DQN + $n$-step returns.

**Solution:**
PPO performs multiple epochs of SGD on a single collected batch of data.
- If Monte Carlo returns ($G_t$) were used, high variance would cause different mini-batches within the same epoch to have wildly contradictory gradients.
- If 1-step TD was used, high bias would cause the policy to overfit to local value errors.
- GAE ($\lambda = 0.95$) produces smooth, low-variance advantage estimates that remain valid across all $K$ training epochs of the rollout batch. Furthermore, GAE advantages can be normalized once across the entire $N \times T$ rollout, providing stationary, unit-variance targets for the clipped objective.

---

### Exercise 10.10: Complete TypeScript Unit Verification Suite for PPO Loss Engine
**Problem:** Write a TypeScript verification test that initializes `PPOLossEngine`, evaluates a synthetic mini-batch containing both normal and clipped transitions, and asserts that:
1. When ratio exceeds $1 + \epsilon$, the sample is clipped and ClipFrac increases.
2. Approximate KL divergence is non-negative and finite.
3. Total loss matches the analytical expectation.

**Solution:**
```typescript
import { PPOLossEngine, PPOMiniBatch } from './ppo-engine'; // Assuming implementation from Worked Example 10.10

export function testPPOVerification(): boolean {
  const engine = new PPOLossEngine(0.20, 0.20, 0.50, 0.01);

  // 1. Create synthetic mini-batch of 2 transitions
  // Transition 0: Unclipped, ratio = 1.10, A = +2.0
  // Transition 1: Clipped, ratio = 1.50, A = +2.0
  const batch: PPOMiniBatch = {
    logProbsOld: new Float64Array([Math.log(0.20), Math.log(0.20)]),
    valuesOld: new Float64Array([5.0, 5.0]),
    advantages: new Float64Array([2.0, 2.0]),
    returns: new Float64Array([6.0, 6.0])
  };

  const currentLogProbs = new Float64Array([Math.log(0.22), Math.log(0.30)]); // ratios: 1.10, 1.50
  const currentValues = new Float64Array([5.1, 5.1]);
  const currentEntropies = new Float64Array([0.8, 0.8]);

  const result = engine.evaluate(batch, currentLogProbs, currentValues, currentEntropies);
  console.log(`PPO Evaluation: Total Loss = ${result.totalLoss.toFixed(4)}, ClipFrac = ${result.clipFrac.toFixed(2)}, approxKL = ${result.approxKL.toExponential(4)}`);

  // Assertions:
  // 1 of 2 samples was clipped (ratio 1.50 > 1.20) -> ClipFrac = 0.50
  const clipFracCorrect = Math.abs(result.clipFrac - 0.50) < 1e-6;
  console.log(`Assertion 1 Passed: ClipFrac = 0.50 (${clipFracCorrect})`);

  // Approx KL must be strictly positive
  const klValid = result.approxKL > 0;
  console.log(`Assertion 2 Passed: approxKL > 0 (${klValid})`);

  // Unclipped surr1 = 1.10 * 2 = 2.20 -> pLoss0 = -2.20
  // Clipped surr2 = 1.20 * 2 = 2.40 -> pLoss1 = -2.40
  // Expected Policy Loss = (-2.20 + -2.40) / 2 = -2.30
  const policyLossCorrect = Math.abs(result.policyLoss - (-2.30)) < 1e-4;
  console.log(`Assertion 3 Passed: Policy Loss = ${result.policyLoss.toFixed(4)} (Expected -2.3000: ${policyLossCorrect})`);

  const passed = clipFracCorrect && klValid && policyLossCorrect;
  console.log(`PPO Unit Suite Passed: ${passed}`);
  return passed;
}

testPPOVerification();
```
