# Chapter 7: REINFORCE: Monte Carlo Policy Gradients and Variance Reduction with Baselines

---

## 7.1 The Canonical REINFORCE Algorithm

In Chapter 6, we derived the theoretical foundations of the Policy Gradient Theorem:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim \pi_{\boldsymbol{\theta}}} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t \right]$$
where $G_t = \sum_{k=t}^T \gamma^{k-t} r_{k+1}$ is the causal Reward-to-Go.

Williams (1992) synthesized this insight into the canonical **REINFORCE** algorithm (an acronym for *REward Increment = Nonnegative Factor $\times$ Offset Reinforcement $\times$ Characteristic Eligibility*). 

REINFORCE is an **on-policy, episodic Monte Carlo** policy gradient algorithm:
1. The agent executes policy $\pi_{\boldsymbol{\theta}}$ in the environment to generate a complete, full-length trajectory from initial state $s_0$ to terminal state $s_T$:
$$\tau = (s_0, a_0, r_1, s_1, a_1, r_2, \dots, s_{T-1}, a_{T-1}, r_T, s_T)$$
2. Once the episode terminates, the agent iterates backward from $t = T-1$ down to $0$, accumulating the exact discounted returns $G_t$.
3. The policy parameters are updated via stochastic gradient ascent across all $T$ time steps:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \sum_{t=0}^{T-1} \gamma^t \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t$$

```
                       THE REINFORCE EXECUTION CYCLE
                       
   ┌─────────────────────────────────────────────────────────────┐
   │ 1. Collect Full Episode Rollout:                           │
   │    s_0 ──a_0──► s_1 ──a_1──► s_2 ── ... ──► s_{T-1} ──► s_T  │
   │    r_1          r_2          r_3            r_T             │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ Episode Terminates
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ 2. Backward Pass: Compute Exact Monte Carlo Returns G_t    │
   │    G_T = 0                                                  │
   │    G_{t} = r_{t+1} + γ · G_{t+1}   (for t = T-1, ..., 0)    │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ 3. Policy Parameter Update:                                │
   │    θ ← θ + α ∑_{t=0}^{T-1} γ^t ∇_θ log π_θ(a_t | s_t) G_t   │
   └─────────────────────────────────────────────────────────────┘
```

---

## 7.2 The High Variance Pathology of Monte Carlo Estimation

While REINFORCE is guaranteed to be an **unbiased** estimator of the true policy gradient ($\mathbb{E}[\hat{\mathbf{g}}] = \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$), in practice it exhibits extreme, crippling **variance**.

### The Dispersion of Trajectories
In an environment of horizon $T = 500$, the return $G_t$ is a sum of hundreds of stochastic rewards:
$$G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots + \gamma^{T-t} r_T$$

At every single intermediate transition $k$, two independent stochastic mechanisms inject random noise:
1. **Stochastic Action Selection:** $a_k \sim \pi_{\boldsymbol{\theta}}(\cdot \mid s_k)$.
2. **Stochastic Environmental Transitions:** $s_{k+1} \sim \mathcal{P}(\cdot \mid s_k, a_k)$.

Because the trajectory return $G_t$ is accumulated along the entire future branch of the execution tree, the variance of $G_t$ compounds multiplicatively and additively:
$$\mathbb{V}[G_t] = \sum_{k=t}^T \gamma^{2(k-t)} \mathbb{V}[r_{k+1}] + 2 \sum_{k < l} \gamma^{k+l-2t} \text{Cov}(r_k, r_l)$$

In many environments (such as cart-pole balancing or robotic locomotion), identical actions $a_t$ taken from identical states $s_t$ can lead to vastly divergent outcomes due to tiny differences in future random draws:
- Rollout 1: Future actions happen to balance well $\implies G_t^{(1)} = +500$.
- Rollout 2: A slight perturbation 20 steps later triggers a crash $\implies G_t^{(2)} = +20$.

When the policy gradient is updated:
$$\Delta \boldsymbol{\theta} \propto \nabla_{\boldsymbol{\theta}} \log \pi(a_t \mid s_t) G_t$$
the gradient magnitude swings violently between massive positive surges and tiny updates. The Signal-to-Noise Ratio (SNR) of the empirical gradient collapses:
$$\text{SNR} = \frac{\|\mathbb{E}[\hat{\mathbf{g}}]\|_2}{\sqrt{\mathbb{V}[\hat{\mathbf{g}}]}} \ll 1$$

To obtain a reliable ascent direction, an agent might need hundreds of thousands of sample episodes per gradient step, making vanilla REINFORCE hopelessly sample-inefficient.

---

## 7.3 State-Dependent Baselines

To tame the explosive variance of Monte Carlo returns without introducing bias, we introduce a **baseline function** $b(s)$.

Instead of multiplying the score function directly by $G_t$, we subtract an arbitrary state-dependent baseline $b(s_t)$:
$$\mathbf{g}_{\text{baseline}} = \sum_{t=0}^{T-1} \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) (G_t - b(s_t))$$

```
                         THE BASELINE CENTERING EFFECT
                         
   WITHOUT BASELINE:
   All Returns G_t > 0:      G_1 = 101,  G_2 = 100,  G_3 = 99
   All Actions Reinforced:   ∇log π_1 · 101,  ∇log π_2 · 100,  ∇log π_3 · 99
   (Every action pushed UP; differences in relative performance lost in noise!)
   
   WITH STATE-DEPENDENT BASELINE b(s) = V(s) ≈ 100:
   Centered Advantages:      A_1 = +1,   A_2 = 0,    A_3 = -1
   Differential Updates:     + ∇log π_1 (Promote!),  0,  - ∇log π_3 (Penalize!)
   (High signal, near-zero variance!)
```

### The Zero-Bias Theorem
**Theorem:** For any baseline function $b(s)$ that depends *only* on state $s$ (and does *not* depend on action $a$), the expected gradient update is strictly identical to the vanilla policy gradient:
$$\mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) b(s_t) \right] = \mathbf{0}$$

**Proof:**
Expand the expectation over action $a_t \sim \pi_{\boldsymbol{\theta}}(\cdot \mid s_t)$ conditioned on state $s_t$:
$$\mathbb{E}_{a_t \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) b(s_t) \mid s_t \right] = \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \left( \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s_t) b(s_t) \right)$$

Because $b(s_t)$ does not depend on action $a$, it factors outside the summation over $a$:
$$= b(s_t) \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s_t)$$

Applying the score function identity $\nabla \log \pi = \frac{\nabla \pi}{\pi}$:
$$= b(s_t) \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \frac{\nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t)}{\pi_{\boldsymbol{\theta}}(a \mid s_t)} = b(s_t) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t)$$

Interchanging the gradient operator and the finite sum:
$$= b(s_t) \nabla_{\boldsymbol{\theta}} \left[ \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \right]$$

Since the sum of action probabilities over the complete action space is identically 1 for all parameter values $\boldsymbol{\theta}$:
$$\sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) = 1 \quad \forall \boldsymbol{\theta}$$
The gradient of a constant is zero:
$$\nabla_{\boldsymbol{\theta}} (1) = \mathbf{0}$$
Therefore:
$$b(s_t) \cdot \mathbf{0} = \mathbf{0} \quad \blacksquare$$

By the Law of Total Expectation, integrating over all states $s_t \sim d^\pi$:
$$\mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) b(s_t) \right] = \mathbf{0}$$

Subtracting $b(s_t)$ introduces **zero bias**. The expectation of the gradient is untouched, while the variance can be reduced by orders of magnitude.

---

## 7.4 The Value Function as Optimal Baseline

What is the optimal baseline $b^*(s)$?
Recall the definition of the state-value function $V^\pi(s)$:
$$V^\pi(s) = \mathbb{E}_{\tau \sim \pi}[G_t \mid S_t = s]$$

The state-value function $V^\pi(s)$ represents the **expected future return** an agent achieves from state $s$ when following policy $\pi$.
When we set the baseline to the value function:
$$b(s_t) = V^\pi(s_t)$$
the centered return becomes the **Advantage Function**:
$$A^\pi(s_t, a_t) = G_t - V^\pi(s_t)$$

```
                        THE INTUITIVE MEANING OF ADVANTAGE
                        
   A(s_t, a_t) = G_t - V(s_t)
   
   • If A > 0 (G_t > V(s_t)):  Action a_t performed BETTER than average for this state.
                               --> Increase log π(a_t | s_t) (Reinforce!).
                               
   • If A < 0 (G_t < V(s_t)):  Action a_t performed WORSE than average for this state.
                               --> Decrease log π(a_t | s_t) (Discourage!).
```

### Training an Independent Critic Network
In practice, the true value function $V^\pi(s)$ is unknown. We parameterize a second neural network, the **Critic** $V_{\boldsymbol{\phi}}(s)$, parameterized by vector $\boldsymbol{\phi} \in \mathbb{R}^m$.

The Critic is trained via supervised regression on the observed Monte Carlo returns using Mean Squared Error:
$$\mathcal{L}(\boldsymbol{\phi}) = \frac{1}{2} \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \left( G_t - V_{\boldsymbol{\phi}}(s_t) \right)^2 \right]$$

The Critic parameters are updated via gradient descent:
$$\boldsymbol{\phi} \leftarrow \boldsymbol{\phi} + \alpha_v \sum_{t=0}^{T-1} (G_t - V_{\boldsymbol{\phi}}(s_t)) \nabla_{\boldsymbol{\phi}} V_{\boldsymbol{\phi}}(s_t)$$

The policy parameters are simultaneously updated using the empirical advantages:
$$\hat{A}_t = G_t - V_{\boldsymbol{\phi}}(s_t)$$
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha_\theta \sum_{t=0}^{T-1} \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \hat{A}_t$$

This formulation—REINFORCE with a Learned Baseline—is the direct conceptual bridge to modern Actor-Critic algorithms.

---

## 7.5 Entropy Regularization: Preventing Premature Policy Collapse

A notorious failure mode of policy gradient algorithms is **Premature Policy Collapse**.

Early in training, if an agent happens to receive a sequence of high rewards for a suboptimal action $a_{\text{sub}}$, the gradient update pushes $\pi(a_{\text{sub}} \mid s) \to 1.0$.
Once an action's probability reaches $1.0$, the policy becomes completely deterministic:
$$\pi(a_{\text{sub}} \mid s) = 1.0, \quad \pi(a_{\text{other}} \mid s) = 0.0$$

The score function for the remaining actions is:
$$\nabla_{\boldsymbol{\theta}} \log \pi(a_{\text{other}} \mid s) \implies \text{Action is never sampled!}$$
The agent loses all exploratory capacity, permanently locked into a poor local optimum.

To enforce sustained exploration, Williams and Peng (1991) and Mnih et al. (2016) introduced **Entropy Regularization**.

```
                         THE EFFECT OF ENTROPY REGULARIZATION
                         
   Deterministic / Collapsed:           High Entropy / Exploratory:
   Entropy H ≈ 0                        Entropy H = log(|A|)
   
   Prob                                 Prob
    1.0 ┬   █                            1.0 ┬
    0.8 │   █                            0.8 │
    0.6 │   █                            0.6 │
    0.4 │   █                            0.4 │
    0.2 │   █                            0.2 │   █   █   █   █
    0.0 ┴───┴───┴───┴───► Actions        0.0 ┴───┴───┴───┴───► Actions
            a_1 a_2 a_3                              a_1 a_2 a_3 a_4
       (Exploration Frozen!)                    (Active Exploration Maintained)
```

### Mathematical Formulation
The Shannon entropy $\mathcal{H}(\pi(\cdot \mid s))$ of a probability distribution measures its uncertainty or randomness:
$$\mathcal{H}(\pi(\cdot \mid s)) = \mathbb{E}_{a \sim \pi}[-\log \pi(a \mid s)] = - \sum_{a \in \mathcal{A}} \pi(a \mid s) \log \pi(a \mid s)$$

We augment the policy objective with an entropy bonus weighted by temperature hyperparameter $\beta_{\text{ent}} > 0$:
$$J_{\text{entropy}}(\boldsymbol{\theta}) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \left( \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \hat{A}_t + \beta_{\text{ent}} \mathcal{H}(\pi_{\boldsymbol{\theta}}(\cdot \mid s_t)) \right) \right]$$

The total gradient update is:
$$\nabla_{\boldsymbol{\theta}} J_{\text{entropy}}(\boldsymbol{\theta}) = \sum_{t=0}^{T-1} \left( \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \hat{A}_t + \beta_{\text{ent}} \nabla_{\boldsymbol{\theta}} \mathcal{H}(\pi_{\boldsymbol{\theta}}(\cdot \mid s_t)) \right)$$

### Analytical Entropy Formulas

#### 1. Categorical Distribution (Discrete Actions)
$$\mathcal{H}(\pi) = - \sum_{i=1}^K p_i \log p_i$$
Gradient with respect to logit $h_k$:
$$\frac{\partial \mathcal{H}}{\partial h_k} = - p_k (\log p_k + \mathcal{H}(\pi))$$

#### 2. 1D Gaussian Distribution (Continuous Actions)
For $\pi(a \mid s) = \mathcal{N}(\mu(s), \sigma(s)^2)$:
$$\mathcal{H}(\mathcal{N}(\mu, \sigma^2)) = \frac{1}{2} \log\left( 2\pi e \sigma^2 \right) = \frac{1}{2} + \frac{1}{2} \log(2\pi) + \log \sigma$$
Notice that the entropy of a Gaussian depends **only** on its standard deviation $\sigma$ (or log-std $\omega = \log \sigma$), completely independent of mean $\mu$!
$$\frac{\partial \mathcal{H}}{\partial \omega} = 1.0$$
Adding an entropy bonus to a Gaussian policy applies a direct constant upward pressure of $+ \beta_{\text{ent}}$ to the log-std, preventing the policy from prematurely shrinking its variance to zero.

---

## 7.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 7.1: Backward Accumulation of Monte Carlo Returns
**Problem:** An episode of length $T = 4$ generates rewards $r_1 = +1, r_2 = +2, r_3 = 0, r_4 = +10$ with discount factor $\gamma = 0.90$.
1. Compute the Reward-to-Go $G_t$ for $t = 3, 2, 1, 0$ using the backward recurrence relation $G_t = r_{t+1} + \gamma G_{t+1}$.
2. Contrast $G_0$ with the total undiscounted return $\sum_{t=1}^4 r_t$.

**Solution:**
1. Backward recurrence (base case $G_4 = 0$):
- For $t = 3$:
  $$G_3 = r_4 + \gamma G_4 = 10 + 0.90(0) = 10.0$$
- For $t = 2$:
  $$G_2 = r_3 + \gamma G_3 = 0 + 0.90(10.0) = 9.0$$
- For $t = 1$:
  $$G_1 = r_2 + \gamma G_2 = 2 + 0.90(9.0) = 2 + 8.1 = 10.1$$
- For $t = 0$:
  $$G_0 = r_1 + \gamma G_1 = 1 + 0.90(10.1) = 1 + 9.09 = 10.09$$

2. Undiscounted return:
$$R_{\text{undiscounted}} = 1 + 2 + 0 + 10 = 13.0$$
The discounted return $G_0 = 10.09$ discounts future rewards appropriately: $1 + 0.9(2) + 0.81(0) + 0.729(10) = 1 + 1.8 + 0 + 7.29 = 10.09$.

---

### Worked Example 7.2: Empirical Variance Calculation: Vanilla REINFORCE vs Baseline
**Problem:** At state $s$, action $a_1$ is taken.
The environment produces three possible return rollouts with equal probability $\frac{1}{3}$:
$G^{(1)} = 90$, $G^{(2)} = 100$, $G^{(3)} = 110$.
Let the score function be $\nabla \log \pi(a_1 \mid s) = 2.0$.
1. Compute the mean and variance of the gradient estimator $\hat{g}_{\text{vanilla}} = \nabla \log \pi \cdot G$.
2. Compute the mean and variance of the gradient estimator with baseline $b = 100$: $\hat{g}_{\text{baseline}} = \nabla \log \pi \cdot (G - b)$.
3. Compare the variance reduction percentage.

**Solution:**
1. Vanilla REINFORCE:
Gradients:
- $\hat{g}_1 = 2.0 \times 90 = 180$
- $\hat{g}_2 = 2.0 \times 100 = 200$
- $\hat{g}_3 = 2.0 \times 110 = 220$
Mean:
$$\mathbb{E}[\hat{g}_{\text{vanilla}}] = \frac{180 + 200 + 220}{3} = \frac{600}{3} = 200$$
Variance:
$$\mathbb{V}[\hat{g}_{\text{vanilla}}] = \frac{(180 - 200)^2 + (200 - 200)^2 + (220 - 200)^2}{3} = \frac{(-20)^2 + 0 + (20)^2}{3} = \frac{400 + 400}{3} = \frac{800}{3} \approx 266.67$$

2. With Baseline $b = 100$:
Advantages: $A^{(1)} = 90 - 100 = -10, A^{(2)} = 0, A^{(3)} = +10$.
Gradients:
- $\hat{g}_1 = 2.0 \times (-10) = -20$
- $\hat{g}_2 = 2.0 \times 0 = 0$
- $\hat{g}_3 = 2.0 \times 10 = +20$
Mean:
$$\mathbb{E}[\hat{g}_{\text{baseline}}] = \frac{-20 + 0 + 20}{3} = 0$$
*(Note: Expected value of the baseline-subtracted component is $\mathbb{E}[\nabla \log \pi \cdot G] - b \mathbb{E}[\nabla \log \pi] = 200 - 100(2) = 0$ for this single action. Over all actions, the total gradient is completely identical).*
Variance:
$$\mathbb{V}[\hat{g}_{\text{baseline}}] = \frac{(-20 - 0)^2 + 0^2 + (20 - 0)^2}{3} = \frac{400 + 400}{3} \approx 266.67$$
Wait! Why was variance identical here? Because $\nabla \log \pi = 2.0$ was treated as a constant scalar for a single action!
Now consider the two-action case where $a_2$ has $\nabla \log \pi(a_2 \mid s) = -2.0$ with return 0:
In that case, the mean is non-zero and the second moment drops precipitously. Let us inspect Worked Example 7.3 for the complete two-action system.

---

### Worked Example 7.3: Variance Reduction in a 2-Action Discrete MDP
**Problem:** Consider state $s$ with two actions $a_1, a_2$ chosen with equal probability $\pi(a_1) = \pi(a_2) = 0.5$.
Score functions: $\nabla \log \pi(a_1) = +1$, $\nabla \log \pi(a_2) = -1$.
Payoffs are large but slightly differentiated: $R(a_1) = 102$, $R(a_2) = 98$.
1. Compute the true analytical gradient $\nabla J$.
2. Compute the second moment $\mathbb{E}[\hat{g}^2]$ and variance $\mathbb{V}[\hat{g}]$ of vanilla REINFORCE ($\hat{g} = \nabla \log \pi \cdot R$).
3. Compute the second moment and variance using baseline $b = \mathbb{E}[R] = 100$.

**Solution:**
1. True analytical gradient:
$$\nabla J = \mathbb{E}[\nabla \log \pi \cdot R] = 0.5(+1)(102) + 0.5(-1)(98) = 51 - 49 = +2.0$$

2. Vanilla REINFORCE:
Outcomes:
- Action 1: $\hat{g}_1 = (+1) \times 102 = 102$
- Action 2: $\hat{g}_2 = (-1) \times 98 = -98$
Second moment:
$$\mathbb{E}[\hat{g}^2] = 0.5(102^2) + 0.5((-98)^2) = 0.5(10404) + 0.5(9604) = 5202 + 4802 = 10,004$$
Variance:
$$\mathbb{V}[\hat{g}_{\text{vanilla}}] = \mathbb{E}[\hat{g}^2] - (\mathbb{E}[\hat{g}])^2 = 10,004 - (2.0)^2 = 10,004 - 4 = 10,000$$

3. With baseline $b = 100$:
Centered returns:
- Action 1: $A_1 = 102 - 100 = +2 \implies \hat{g}_1 = (+1)(+2) = +2$
- Action 2: $A_2 = 98 - 100 = -2 \implies \hat{g}_2 = (-1)(-2) = +2$
Second moment:
$$\mathbb{E}[\hat{g}^2] = 0.5(2^2) + 0.5(2^2) = 0.5(4) + 0.5(4) = 4$$
Variance:
$$\mathbb{V}[\hat{g}_{\text{baseline}}] = \mathbb{E}[\hat{g}^2] - (\mathbb{E}[\hat{g}])^2 = 4 - 2^2 = 0$$
The baseline achieves **100% variance elimination** ($\mathbb{V} = 0$). In every single trial, the estimator produces the exact gradient $+2.0$.

---

### Worked Example 7.4: Simultaneous Actor and Critic Gradient Updates
**Problem:** In REINFORCE with a Learned Baseline, state $s = [1.0, 2.0]^\top$.
Action $a_0$ is chosen from $\mathcal{A} = \{0, 1\}$.
Policy weights: $\mathbf{W}_0 = [0.2, 0.4]$, $\mathbf{W}_1 = [-0.2, -0.4]$.
Critic weights: $\mathbf{v} = [0.5, 1.5]$ (scalar value $V_{\mathbf{v}}(s) = \mathbf{v}^\top s$).
Observed return $G = 8.0$.
Learning rates: $\alpha_\theta = 0.05$, $\alpha_v = 0.1$.
1. Compute the critic prediction $V(s)$ and the advantage $\hat{A}$.
2. Compute the policy probabilities $\pi(a_0 \mid s)$ and $\pi(a_1 \mid s)$.
3. Perform the simultaneous parameter updates $\Delta \mathbf{v}$ and $\Delta \mathbf{W}_0$.

**Solution:**
1. Critic prediction and advantage:
$$V(s) = \mathbf{v}^\top s = 0.5(1.0) + 1.5(2.0) = 0.5 + 3.0 = 3.5$$
$$\hat{A} = G - V(s) = 8.0 - 3.5 = +4.5$$

2. Policy logits and probabilities:
$$h_0 = 0.2(1.0) + 0.4(2.0) = 0.2 + 0.8 = 1.0$$
$$h_1 = -0.2(1.0) - 0.4(2.0) = -0.2 - 0.8 = -1.0$$
$$\exp(h_0) = e^1 \approx 2.7183, \quad \exp(h_1) = e^{-1} \approx 0.3679, \quad \text{Sum} = 3.0862$$
$$\pi(a_0 \mid s) = \frac{2.7183}{3.0862} \approx 0.8808, \quad \pi(a_1 \mid s) \approx 0.1192$$

3. Parameter updates:
- Critic update (MSE loss $\frac{1}{2}(G - V(s))^2$):
  $$\nabla_{\mathbf{v}} V(s) = s = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix}$$
  $$\Delta \mathbf{v} = \alpha_v (G - V(s)) \nabla_{\mathbf{v}} V(s) = 0.1 \times 4.5 \times \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 0.45 \\ 0.90 \end{bmatrix}$$
- Actor update:
  $$\nabla_{\mathbf{W}_0} \log \pi(a_0 \mid s) = (1 - \pi(a_0 \mid s)) s = (1 - 0.8808) \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} = 0.1192 \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 0.1192 \\ 0.2384 \end{bmatrix}$$
  $$\Delta \mathbf{W}_0 = \alpha_\theta \cdot \hat{A} \cdot \nabla \log \pi = 0.05 \times 4.5 \times \begin{bmatrix} 0.1192 \\ 0.2384 \end{bmatrix} = 0.225 \times \begin{bmatrix} 0.1192 \\ 0.2384 \end{bmatrix} = \begin{bmatrix} 0.0268 \\ 0.0536 \end{bmatrix}$$

---

### Worked Example 7.5: Shannon Entropy and Gradient of a 3-Action Categorical Distribution
**Problem:** A policy outputs action probabilities $\mathbf{p} = [0.70, 0.20, 0.10]$ from logits $\mathbf{h} = [h_1, h_2, h_3]$.
1. Compute the Shannon entropy $\mathcal{H}(\mathbf{p}) = - \sum_{i=1}^3 p_i \ln p_i$ in nats.
2. What is the maximum possible entropy for a 3-action distribution?
3. Compute the analytical gradient vector $\nabla_{\mathbf{h}} \mathcal{H}$ of the entropy with respect to logits $\mathbf{h}$.

**Solution:**
1. Shannon entropy:
$$\ln(0.70) \approx -0.3567$$
$$\ln(0.20) \approx -1.6094$$
$$\ln(0.10) \approx -2.3026$$
$$\mathcal{H}(\mathbf{p}) = - [0.70(-0.3567) + 0.20(-1.6094) + 0.10(-2.3026)]$$
$$= - [-0.2497 - 0.3219 - 0.2303] = - [-0.8019] = 0.8019 \text{ nats}$$

2. Maximum entropy:
Achieved under uniform distribution $p_1 = p_2 = p_3 = \frac{1}{3}$:
$$\mathcal{H}_{\max} = \ln(3) \approx 1.0986 \text{ nats}$$
Current entropy is $\frac{0.8019}{1.0986} \approx 73\%$ of maximum.

3. Gradient with respect to logits:
Formula: $\frac{\partial \mathcal{H}}{\partial h_k} = - p_k (\ln p_k + \mathcal{H}(\mathbf{p}))$.
- For $k = 1$: $\frac{\partial \mathcal{H}}{\partial h_1} = -0.70(-0.3567 + 0.8019) = -0.70(0.4452) = -0.3116$.
- For $k = 2$: $\frac{\partial \mathcal{H}}{\partial h_2} = -0.20(-1.6094 + 0.8019) = -0.20(-0.8075) = +0.1615$.
- For $k = 3$: $\frac{\partial \mathcal{H}}{\partial h_3} = -0.10(-2.3026 + 0.8019) = -0.10(-1.5007) = +0.1501$.
Gradient vector: $\nabla_{\mathbf{h}} \mathcal{H} = [-0.3116, +0.1615, +0.1501]^\top$.
Notice the sum of the gradient components is $-0.3116 + 0.1615 + 0.1501 = 0$.
The gradient pushes the dominant logit ($h_1$) DOWN and pulls the rare logits ($h_2, h_3$) UP, resisting premature collapse.

---

### Worked Example 7.6: Entropy of a Diagonal Multivariate Gaussian
**Problem:** Let $\pi(\mathbf{a} \mid s) = \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$ be a $D$-dimensional multivariate Gaussian policy with diagonal covariance matrix $\boldsymbol{\Sigma} = \text{diag}(\sigma_1^2, \dots, \sigma_D^2)$.
1. Derive the closed-form expression for the differential entropy $\mathcal{H}(\pi)$.
2. For $D = 2$, $\sigma_1 = 0.5$, and $\sigma_2 = 2.0$, compute $\mathcal{H}(\pi)$.
3. Show that $\nabla_{\boldsymbol{\mu}} \mathcal{H}(\pi) = \mathbf{0}$.

**Solution:**
1. Differential entropy of a multivariate Gaussian:
$$\mathcal{H}(\pi) = \frac{1}{2} \ln \left( (2\pi e)^D \det(\boldsymbol{\Sigma}) \right)$$
For a diagonal matrix, $\det(\boldsymbol{\Sigma}) = \prod_{i=1}^D \sigma_i^2$.
$$\mathcal{H}(\pi) = \frac{1}{2} \ln \left( (2\pi e)^D \prod_{i=1}^D \sigma_i^2 \right) = \frac{D}{2} \ln(2\pi e) + \sum_{i=1}^D \ln \sigma_i = \frac{D}{2}(1 + \ln(2\pi)) + \sum_{i=1}^D \omega_i$$
where $\omega_i = \ln \sigma_i$.

2. Numerical evaluation ($D = 2, \sigma_1 = 0.5, \sigma_2 = 2.0$):
$$\det(\boldsymbol{\Sigma}) = 0.5^2 \times 2.0^2 = 0.25 \times 4.0 = 1.0$$
$$\mathcal{H}(\pi) = \frac{2}{2} \ln(2\pi e) + \frac{1}{2}\ln(1.0) = \ln(2\pi e) + 0 \approx \ln(2 \times 3.14159 \times 2.71828) = \ln(17.0795) \approx 2.8379 \text{ nats}$$

3. Mean gradient:
Because the entropy expression contains only $D$ and $\sigma_i$, it has zero dependence on mean vector $\boldsymbol{\mu}$:
$$\nabla_{\boldsymbol{\mu}} \mathcal{H}(\pi) = \mathbf{0}$$
The entropy regularization objective never distorts the predicted mean of the continuous action distribution.

---

### Worked Example 7.7: Episode Return Standardization (Whitening)
**Problem:** In many implementations of REINFORCE (e.g. OpenAI Spinning Up), returns across a mini-batch of episodes are normalized before taking gradient steps:
$$\tilde{G}_t = \frac{G_t - \mu_G}{\sigma_G + \epsilon}$$
Suppose an agent collects a batch of 4 returns: $G = [25.0, 30.0, 15.0, 50.0]$.
1. Compute the empirical mean $\mu_G$ and sample standard deviation $\sigma_G$.
2. Compute the normalized returns $\tilde{G}$.
3. Discuss the theoretical trade-off: does batch standardization introduce bias into the policy gradient?

**Solution:**
1. Mean and standard deviation:
$$\mu_G = \frac{25 + 30 + 15 + 50}{4} = \frac{120}{4} = 30.0$$
Deviations: $25 - 30 = -5, 30 - 30 = 0, 15 - 30 = -15, 50 - 30 = +20$.
Squared deviations: $25 + 0 + 225 + 400 = 650$.
Sample variance ($N-1 = 3$):
$$s^2 = \frac{650}{3} \approx 216.67 \implies \sigma_G = \sqrt{216.67} \approx 14.72$$

2. Normalized returns ($\tilde{G}_i = \frac{G_i - 30}{14.72}$):
- $\tilde{G}_1 = \frac{-5}{14.72} \approx -0.340$
- $\tilde{G}_2 = \frac{0}{14.72} = 0.000$
- $\tilde{G}_3 = \frac{-15}{14.72} \approx -1.019$
- $\tilde{G}_4 = \frac{20}{14.72} \approx +1.359$

3. Theoretical trade-off:
- **Bias:** Subtracting empirical mean $\mu_G$ acts as a constant baseline, which has zero bias. However, dividing by the *sample standard deviation* $\sigma_G$ makes the baseline dependent on all trajectories in the batch simultaneously, which introduces a tiny technical bias.
- **Empirical Benefit:** In practice, this bias is negligible ($\mathcal{O}(1/N)$), while the scaling stabilization is massive: gradient magnitudes become invariant to arbitrary reward scaling (whether rewards are measured in cents or millions of dollars), allowing the same learning rate $\alpha$ to work reliably across completely different environments.

---

### Worked Example 7.8: Credit Assignment Decay Across Long Horizons
**Problem:** In a non-terminating task, an agent takes an action at $t = 0$.
The discount factor is $\gamma = 0.95$.
At what future time step $k$ does the reward $r_{k+1}$ contribute less than $1\%$ of its original face value to the return $G_0$?

**Solution:**
The contribution of reward $r_{k+1}$ to $G_0$ is scaled by $\gamma^k$:
$$\gamma^k < 0.01$$
Taking natural logarithms of both sides:
$$k \ln(\gamma) < \ln(0.01)$$
Since $\ln(\gamma) = \ln(0.95) \approx -0.051293$ is negative, dividing flips the inequality:
$$k > \frac{\ln(0.01)}{\ln(0.95)} = \frac{-4.60517}{-0.051293} \approx 89.78$$
For $k \ge 90$ steps, the reward's discounted influence falls below $1\%$. The effective horizon of the agent is approximately $\frac{1}{1 - \gamma} = \frac{1}{0.05} = 20$ to $90$ steps.

---

### Worked Example 7.9: Policy Gradient with Moving Average Baseline
**Problem:** In low-compute environments without a full neural critic, an Exponential Moving Average (EMA) baseline is maintained across episodes:
$$b_{k+1} = \eta G^{(k)} + (1 - \eta) b_k$$
Let initial baseline $b_0 = 0$, update rate $\eta = 0.20$.
Episodes produce total returns: $G^{(1)} = 10, G^{(2)} = 20, G^{(3)} = 15$.
1. Compute the sequence of baselines $b_1, b_2, b_3$.
2. Compute the effective advantage used for policy updates in each episode.

**Solution:**
1. Sequence of baselines:
- After Episode 1:
  $$b_1 = 0.20(10) + 0.80(0) = 2.0$$
- After Episode 2:
  $$b_2 = 0.20(20) + 0.80(2.0) = 4.0 + 1.6 = 5.6$$
- After Episode 3:
  $$b_3 = 0.20(15) + 0.80(5.6) = 3.0 + 4.48 = 7.48$$

2. Advantages used for updates:
- Episode 1: $A^{(1)} = G^{(1)} - b_0 = 10 - 0 = +10.0$
- Episode 2: $A^{(2)} = G^{(2)} - b_1 = 20 - 2.0 = +18.0$
- Episode 3: $A^{(3)} = G^{(3)} - b_2 = 15 - 5.6 = +9.4$
The baseline smoothly adapts to the rising skill of the agent without requiring any backpropagation passes through a critic network.

---

### Worked Example 7.10: Complete TypeScript Implementation of REINFORCE with Baseline and Entropy Bonus
**Problem:** Author a complete, self-contained TypeScript class `REINFORCEWithBaseline` that implements:
1. Softmax policy and linear critic.
2. Episode recording.
3. Reward-to-Go computation with discounting.
4. Baseline subtraction and advantage calculation.
5. Analytical entropy bonus gradient.
6. Parameter update execution.

**Solution:**
```typescript
export interface StepRecord {
  state: number[];
  action: number;
  reward: number;
}

export class REINFORCEWithBaseline {
  public policyWeights: number[][]; // numActions x stateDim
  public criticWeights: number[];   // stateDim
  public criticBias: number = 0;
  private episode: StepRecord[] = [];

  constructor(
    public readonly stateDim: number,
    public readonly numActions: number,
    public readonly gamma: number = 0.99,
    public readonly lrPolicy: number = 0.01,
    public readonly lrCritic: number = 0.05,
    public readonly entropyBeta: number = 0.01
  ) {
    this.policyWeights = Array.from({ length: numActions }, () =>
      new Array(stateDim).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );
    this.criticWeights = new Array(stateDim).fill(0);
  }

  // Softmax action selection
  selectAction(state: number[]): { action: number; probs: number[] } {
    const logits = new Array(this.numActions).fill(0);
    let maxLogit = -Infinity;
    for (let a = 0; a < this.numActions; a++) {
      let sum = 0;
      for (let d = 0; d < this.stateDim; d++) sum += this.policyWeights[a][d] * state[d];
      logits[a] = sum;
      if (sum > maxLogit) maxLogit = sum;
    }

    let sumExp = 0;
    const probs = new Array(this.numActions).fill(0);
    for (let a = 0; a < this.numActions; a++) {
      probs[a] = Math.exp(logits[a] - maxLogit);
      sumExp += probs[a];
    }
    for (let a = 0; a < this.numActions; a++) probs[a] /= sumExp;

    // Sample from categorical
    const r = Math.random();
    let acc = 0;
    let action = 0;
    for (let a = 0; a < this.numActions; a++) {
      acc += probs[a];
      if (r <= acc) {
        action = a;
        break;
      }
    }

    return { action, probs };
  }

  // Critic forward pass
  predictValue(state: number[]): number {
    let val = this.criticBias;
    for (let d = 0; d < this.stateDim; d++) val += this.criticWeights[d] * state[d];
    return val;
  }

  recordStep(state: number[], action: number, reward: number): void {
    this.episode.push({ state, action, reward });
  }

  // Finish episode and perform updates
  finishEpisode(): { totalReturn: number; criticLoss: number } {
    const T = this.episode.length;
    if (T === 0) return { totalReturn: 0, criticLoss: 0 };

    // 1. Compute discounted Returns-to-Go
    const returns = new Float64Array(T);
    let runningG = 0;
    for (let t = T - 1; t >= 0; t--) {
      runningG = this.episode[t].reward + this.gamma * runningG;
      returns[t] = runningG;
    }

    let totalCriticLoss = 0;

    // 2. Compute gradients and update
    for (let t = 0; t < T; t++) {
      const step = this.episode[t];
      const G_t = returns[t];
      const V_t = this.predictValue(step.state);
      const advantage = G_t - V_t;

      // Update Critic: minimize 0.5 * (G_t - V_t)^2
      const criticError = G_t - V_t;
      totalCriticLoss += 0.5 * criticError * criticError;
      for (let d = 0; d < this.stateDim; d++) {
        this.criticWeights[d] += this.lrCritic * criticError * step.state[d];
      }
      this.criticBias += this.lrCritic * criticError;

      // Compute action probabilities and entropy
      const { probs } = this.selectAction(step.state);
      let entropy = 0;
      for (let a = 0; a < this.numActions; a++) {
        if (probs[a] > 1e-12) entropy -= probs[a] * Math.log(probs[a]);
      }

      // Update Policy parameters
      for (let a = 0; a < this.numActions; a++) {
        const indicator = a === step.action ? 1.0 : 0.0;
        // Policy gradient score
        const pgScore = (indicator - probs[a]) * advantage;
        // Entropy gradient: -p_a * (log p_a + H)
        const logP = probs[a] > 1e-12 ? Math.log(probs[a]) : 0;
        const entGrad = -probs[a] * (logP + entropy);

        const totalGradFactor = pgScore + this.entropyBeta * entGrad;
        for (let d = 0; d < this.stateDim; d++) {
          this.policyWeights[a][d] += this.lrPolicy * totalGradFactor * step.state[d];
        }
      }
    }

    const totalReturn = returns[0];
    this.episode = []; // Clear episode buffer
    return { totalReturn, criticLoss: totalCriticLoss / T };
  }
}
```

---

## 7.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 7.1: Proof of Non-Negative Entropy Bonus Gradient Projection
**Problem:** Let $p \in (0, 1)$ be the probability of action 1 in a 2-action Bernoulli policy with logit $z$: $p = \sigma(z) = \frac{1}{1 + e^{-z}}$.
Binary entropy is $\mathcal{H}(p) = - p \ln p - (1-p) \ln(1-p)$.
1. Compute the derivative $\frac{d\mathcal{H}}{dz}$.
2. Show that $\frac{d\mathcal{H}}{dz} > 0$ when $z < 0$, and $\frac{d\mathcal{H}}{dz} < 0$ when $z > 0$.
3. Prove that gradient ascent on $\mathcal{H}$ drives logit $z$ monotonically to $0$.

**Solution:**
1. Derivative by chain rule:
$$\frac{d\mathcal{H}}{dz} = \frac{d\mathcal{H}}{dp} \frac{dp}{dz}$$
$$\frac{d\mathcal{H}}{dp} = - (\ln p + 1) - (-\ln(1-p) - 1) = -\ln p + \ln(1-p) = -\ln\left(\frac{p}{1-p}\right)$$
Since $p = \sigma(z)$, $\frac{p}{1-p} = e^z \implies \ln(\frac{p}{1-p}) = z$.
$$\frac{d\mathcal{H}}{dp} = -z$$
The derivative of the sigmoid is $\frac{dp}{dz} = p(1-p)$.
$$\frac{d\mathcal{H}}{dz} = -z \cdot p(1-p) = -z \sigma(z)(1 - \sigma(z))$$

2. Sign analysis:
Since $\sigma(z) \in (0, 1)$, $p(1-p) > 0$ for all finite $z$.
- If $z < 0$: $-z > 0 \implies \frac{d\mathcal{H}}{dz} > 0$.
- If $z > 0$: $-z < 0 \implies \frac{d\mathcal{H}}{dz} < 0$.
- If $z = 0$: $\frac{d\mathcal{H}}{dz} = 0$.

3. Gradient ascent:
Update: $\Delta z = \alpha \frac{d\mathcal{H}}{dz} = -\alpha z p(1-p)$.
If $z > 0$, $\Delta z < 0$ (pulls $z$ downward). If $z < 0$, $\Delta z > 0$ (pulls $z$ upward).
The system has a single global fixed point at $z^* = 0$, where $p^* = 0.5$ (maximum entropy). $\blacksquare$

---

### Exercise 7.2: Discount Factor Discrepancy in REINFORCE
**Problem:** In the original derivation of the Policy Gradient Theorem for discounted return, Sutton et al. established:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \sum_{t=0}^\infty \gamma^t \mathbb{E}[\nabla_{\boldsymbol{\theta}} \log \pi(a_t \mid s_t) G_t]$$
However, many modern RL codebases (and textbook implementations) omit the leading $\gamma^t$ factor, optimizing:
$$\hat{\mathbf{g}} = \sum_{t=0}^\infty \mathbb{E}[\nabla_{\boldsymbol{\theta}} \log \pi(a_t \mid s_t) G_t]$$
1. Explain the theoretical consequence of omitting $\gamma^t$.
2. What alternative objective function does the omitted-$\gamma^t$ gradient correspond to?

**Solution:**
1. Consequence:
Omitting the leading $\gamma^t$ gives equal weight to decisions made late in the episode as to decisions made at $t=0$.
In the true discounted objective $J = V(s_0)$, a state visited at $t = 100$ has its value discounted by $\gamma^{100}$. Omitting $\gamma^t$ produces a biased gradient with respect to $V(s_0)$.

2. Alternative objective:
Thomas (2014) proved that omitting the leading $\gamma^t$ optimizes the **Average Reward** objective:
$$\bar{J}(\boldsymbol{\theta}) = \lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^T \mathbb{E}[r_t] = \sum_{s} d^{\pi}(s) \sum_a \pi(a \mid s) \mathcal{R}(s, a)$$
where $d^\pi(s)$ is the unweighted stationary state distribution. In practice, omitting $\gamma^t$ is universally preferred in deep RL because the $\gamma^t$ factor causes gradient updates at late time steps to vanish to zero, preventing the policy from learning effective terminal behaviors.

---

### Exercise 7.3: Minimum Mean Squared Error Baseline Derivation
**Problem:** Let $G$ be a random return observed from state $s$.
We approximate $G$ with a constant baseline $b(s)$ to minimize the expected squared error $\mathcal{E}(b) = \mathbb{E}[(G - b)^2 \mid S=s]$.
1. Prove that the unique minimizer is the conditional expectation $b^*(s) = \mathbb{E}[G \mid S=s] = V(s)$.
2. Show that the residual variance is $\mathbb{V}[G \mid S=s]$.

**Solution:**
1. Expand the objective:
$$\mathcal{E}(b) = \mathbb{E}[G^2 - 2bG + b^2 \mid s] = \mathbb{E}[G^2 \mid s] - 2b \mathbb{E}[G \mid s] + b^2$$
Differentiate with respect to $b$:
$$\frac{d\mathcal{E}}{db} = -2\mathbb{E}[G \mid s] + 2b = 0 \implies b^*(s) = \mathbb{E}[G \mid s]$$
The second derivative $\frac{d^2\mathcal{E}}{db^2} = 2 > 0$, confirming that $b^*(s) = V(s)$ is the unique global minimum.

2. Residual variance:
$$\mathcal{E}(b^*(s)) = \mathbb{E}[(G - \mathbb{E}[G \mid s])^2 \mid s] = \mathbb{V}[G \mid s]$$
The value function removes the entire predictable component of the return, leaving only the irreducible stochastic variance of the environment.

---

### Exercise 7.4: REINFORCE Failure on Sparse Reward Delay
**Problem:** In a maze of length $N = 100$, an agent receives reward $r = 0$ at all steps $t = 1, \dots, 99$, and reward $r_{100} = +1$ upon reaching the goal.
At each step, the agent has 4 actions.
1. What is the probability of a random uniform policy reaching the goal?
2. What are the Reward-to-Go values $G_t$ for a failed episode vs a successful episode?
3. Explain why REINFORCE cannot learn from failed episodes in this environment.

**Solution:**
1. Probability of success:
At each step, 1 of 4 actions advances.
$$\mathbb{P}(\text{success}) = \left(\frac{1}{4}\right)^{100} = 4^{-100} \approx 6.22 \times 10^{-61} \approx 0$$

2. Returns:
- Failed episode: $G_t = 0$ for all $t \in \{0, \dots, 99\}$.
- Successful episode: $G_t = \gamma^{100 - t}$ for all $t$.

3. REINFORCE update:
$$\Delta \boldsymbol{\theta} \propto \sum_{t} \nabla \log \pi_t G_t$$
For every failed episode, $G_t = 0 \implies \Delta \boldsymbol{\theta} = \mathbf{0}$.
The gradient is identically zero! The agent receives zero feedback, zero learning signal, and updates zero parameters until it stumbles upon the goal by chance—which will not occur before the heat death of the universe. Sparse reward exploration requires intrinsic curiosity or reward shaping.

---

### Exercise 7.5: Kullback-Leibler Divergence Under Policy Gradient Step
**Problem:** Let $\pi_{\boldsymbol{\theta}}$ be a policy, and let $\boldsymbol{\theta}' = \boldsymbol{\theta} + \alpha \mathbf{g}$ be the updated parameters.
1. Write the second-order Taylor expansion of the forward KL-divergence $D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'})$ around $\boldsymbol{\theta}$.
2. Express the step size in terms of the Fisher Information Matrix $\mathbf{F}(\boldsymbol{\theta})$:
$$D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta} + \Delta \boldsymbol{\theta}}) \approx \frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{F}(\boldsymbol{\theta}) \Delta \boldsymbol{\theta}$$

**Solution:**
1. Taylor expansion:
Let $f(\boldsymbol{\theta}') = D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'})$.
- At $\boldsymbol{\theta}' = \boldsymbol{\theta}$: $D_{\text{KL}}(\pi \parallel \pi) = 0$.
- Gradient at $\boldsymbol{\theta}$:
  $$\nabla_{\boldsymbol{\theta}'} D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'}) \Big|_{\boldsymbol{\theta}'=\boldsymbol{\theta}} = - \mathbb{E}\left[ \nabla_{\boldsymbol{\theta}'} \log \pi_{\boldsymbol{\theta}'}(a \mid s) \Big|_{\boldsymbol{\theta}'=\boldsymbol{\theta}} \right] = -\mathbf{0} = \mathbf{0}$$
- Hessian at $\boldsymbol{\theta}$:
  $$\nabla^2_{\boldsymbol{\theta}'} D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'}) \Big|_{\boldsymbol{\theta}'=\boldsymbol{\theta}} = - \mathbb{E}\left[ \nabla^2_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) \right] = \mathbf{F}(\boldsymbol{\theta})$$
where $\mathbf{F}(\boldsymbol{\theta})$ is the Fisher Information Matrix.

2. Second-order approximation:
$$D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta} + \Delta \boldsymbol{\theta}}) \approx f(\boldsymbol{\theta}) + \nabla f^\top \Delta \boldsymbol{\theta} + \frac{1}{2} \Delta \boldsymbol{\theta}^\top \nabla^2 f \Delta \boldsymbol{\theta} = 0 + 0 + \frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{F}(\boldsymbol{\theta}) \Delta \boldsymbol{\theta}$$
The Fisher Information Matrix defines the local metric tensor for policy probability divergence.

---

### Exercise 7.6: Asymmetric Critic Learning Rates
**Problem:** In Actor-Critic architectures, practitioners frequently set the critic learning rate $\alpha_v$ significantly larger than the policy learning rate $\alpha_\theta$ (e.g. $\alpha_v = 5 \times 10^{-3}$, $\alpha_\theta = 1 \times 10^{-4}$).
Explain the theoretical necessity for this timescale separation using the Two-Timescale Stochastic Approximation framework (Borkar, 1997).

**Solution:**
Under Two-Timescale Stochastic Approximation:
- If $\frac{\alpha_\theta}{\alpha_v} \to 0$ as $t \to \infty$, the fast iterate (the Critic) views the slow iterate (the Actor) as quasi-static. The Critic converges rapidly to the true value function $V^{\pi_\theta}$ for the *current* policy $\pi_\theta$.
- Simultaneously, the slow iterate (the Actor) views the fast iterate as having already converged to its equilibrium value $V^{\pi_\theta}$.
- If $\alpha_\theta \approx \alpha_v$, the policy updates before the critic has learned to evaluate the previous policy. The advantage estimates become corrupted by stale valuations, inducing non-stationary oscillations and policy divergence. Timescale separation guarantees stable advantage estimation.

---

### Exercise 7.7: Entropy Regularized Soft Policy Improvement
**Problem:** Consider the soft expected return objective:
$$J_{\text{soft}}(\pi) = \sum_{t=0}^\infty \gamma^t \mathbb{E}_{(s_t, a_t) \sim \pi} [r(s_t, a_t) + \beta_{\text{ent}} \mathcal{H}(\pi(\cdot \mid s_t))]$$
1. Write the Soft Bellman Equation for the soft value function $V_{\text{soft}}(s)$.
2. Show that the policy update that maximizes the soft return has the Boltzmann form:
$$\pi_{\text{new}}(a \mid s) \propto \exp\left( \frac{Q_{\text{soft}}(s, a)}{\beta_{\text{ent}}} \right)$$

**Solution:**
1. Soft Bellman Equation:
$$V_{\text{soft}}(s) = \mathbb{E}_{a \sim \pi} \left[ Q_{\text{soft}}(s, a) - \beta_{\text{ent}} \log \pi(a \mid s) \right]$$
$$Q_{\text{soft}}(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) V_{\text{soft}}(s')$$

2. Boltzmann policy update:
We seek $\pi_{\text{new}}(\cdot \mid s) = \arg\max_\pi \sum_a \pi(a \mid s) Q(s, a) - \beta_{\text{ent}} \sum_a \pi(a \mid s) \log \pi(a \mid s)$ subject to $\sum_a \pi(a \mid s) = 1$.
Construct the Lagrangian:
$$\mathcal{L}(\pi, \lambda) = \sum_a \pi(a \mid s) Q(s, a) - \beta_{\text{ent}} \sum_a \pi(a \mid s) \log \pi(a \mid s) - \lambda \left(\sum_a \pi(a \mid s) - 1\right)$$
Differentiate with respect to $\pi(a \mid s)$:
$$\frac{\partial \mathcal{L}}{\partial \pi(a \mid s)} = Q(s, a) - \beta_{\text{ent}}(\log \pi(a \mid s) + 1) - \lambda = 0$$
$$\beta_{\text{ent}} \log \pi(a \mid s) = Q(s, a) - \beta_{\text{ent}} - \lambda \implies \pi(a \mid s) = \exp\left( \frac{Q(s, a)}{\beta_{\text{ent}}} \right) \cdot \exp\left( -\frac{\lambda + \beta_{\text{ent}}}{\beta_{\text{ent}}} \right)$$
Normalizing by the sum of probabilities yields:
$$\pi_{\text{new}}(a \mid s) = \frac{\exp(Q_{\text{soft}}(s, a) / \beta_{\text{ent}})}{\sum_{a'} \exp(Q_{\text{soft}}(s, a') / \beta_{\text{ent}})}$$
This is the foundational principle of Maximum Entropy RL and Soft Actor-Critic (SAC).

---

### Exercise 7.8: Policy Gradient with Autoregressive Multi-Discrete Actions
**Problem:** In complex strategy games, an agent selects a composite action: $a = (a^{(1)}, a^{(2)})$ where $a^{(1)} \in \{1, \dots, K_1\}$ and $a^{(2)} \in \{1, \dots, K_2\}$.
The policy factorizes autoregressively: $\pi(a \mid s) = \pi_1(a^{(1)} \mid s) \cdot \pi_2(a^{(2)} \mid s, a^{(1)})$.
Derive the score function $\nabla_{\boldsymbol{\theta}} \log \pi(a \mid s)$.

**Solution:**
Take the natural logarithm:
$$\log \pi(a \mid s) = \log \left[ \pi_1(a^{(1)} \mid s) \cdot \pi_2(a^{(2)} \mid s, a^{(1)}) \right] = \log \pi_1(a^{(1)} \mid s) + \log \pi_2(a^{(2)} \mid s, a^{(1)})$$
Differentiating with respect to parameters $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \log \pi(a \mid s) = \nabla_{\boldsymbol{\theta}} \log \pi_1(a^{(1)} \mid s) + \nabla_{\boldsymbol{\theta}} \log \pi_2(a^{(2)} \mid s, a^{(1)})$$
By linearity of the logarithm, the composite score function decomposes cleanly into an unweighted sum of individual conditional score functions.

---

### Exercise 7.9: Variance of Sample Returns Under Geometric Episode Horizons
**Problem:** An agent operates in an absorbing MDP where at each step, the episode terminates with constant probability $p \in (0, 1)$ regardless of action.
Rewards are constant $r = 1$ at every non-terminal step. Discount $\gamma = 1$.
1. Compute the probability distribution of episode length $T$.
2. Compute the expected return $\mathbb{E}[G_0]$.
3. Compute the variance of the return $\mathbb{V}[G_0]$.

**Solution:**
1. Episode length distribution:
$T$ is a geometric random variable with success parameter $p$:
$$\mathbb{P}(T = k) = (1 - p)^{k-1} p \quad \text{for } k \in \{1, 2, 3, \dots\}$$

2. Expected return:
Since reward is 1 per step, $G_0 = T$.
From elementary probability for a geometric distribution:
$$\mathbb{E}[G_0] = \mathbb{E}[T] = \frac{1}{p}$$

3. Variance:
$$\mathbb{V}[G_0] = \mathbb{V}[T] = \frac{1 - p}{p^2}$$
For $p = 0.01$ (average episode length 100):
$$\mathbb{E}[G_0] = 100, \quad \mathbb{V}[G_0] = \frac{0.99}{0.0001} = 9,900$$
The standard deviation is $\sigma = \sqrt{9900} \approx 99.5$, virtually identical to the mean! This massive intrinsic dispersion explains why Monte Carlo policy gradients require baselines.

---

### Exercise 7.10: Complete TypeScript Unit Test Suite for REINFORCE
**Problem:** Write a TypeScript verification script that initializes `REINFORCEWithBaseline` on a 2-state bandit MDP and verifies that:
1. Expected advantage is centered near zero.
2. The policy parameters shift in favor of the higher-reward action.
3. Shannon entropy remains positive and bounded.

**Solution:**
```typescript
import { REINFORCEWithBaseline } from './reinforce'; // Assuming implementation from Worked Example 7.10

export function testREINFORCEConvergence(): boolean {
  const agent = new REINFORCEWithBaseline(1, 2, 0.99, 0.05, 0.1, 0.01);
  const state = [1.0];

  // Train for 200 synthetic episodes where Action 1 yields reward 10, Action 0 yields reward 2
  for (let ep = 0; ep < 200; ep++) {
    const { action } = agent.selectAction(state);
    const reward = action === 1 ? 10.0 : 2.0;
    agent.recordStep(state, action, reward);
    agent.finishEpisode();
  }

  // Verify that policy now favors Action 1
  const { probs } = agent.selectAction(state);
  console.log(`Action Probabilities after 200 episodes: P(a=0)=${probs[0].toFixed(4)}, P(a=1)=${probs[1].toFixed(4)}`);
  
  const converged = probs[1] > 0.85;
  const criticValid = agent.predictValue(state) > 5.0;

  console.log(`Test Passed: ${converged && criticValid}`);
  return converged && criticValid;
}

testREINFORCEConvergence();
```
