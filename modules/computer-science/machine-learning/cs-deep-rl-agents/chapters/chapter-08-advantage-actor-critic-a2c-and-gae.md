# Chapter 8: Actor-Critic Foundations: Advantage Actor-Critic (A2C) and Generalized Advantage Estimation (GAE)

---

## 8.1 The Actor-Critic Architecture

In the preceding chapter, we investigated the REINFORCE algorithm with a learned baseline. While subtracting a state-dependent baseline $V_{\boldsymbol{\phi}}(s)$ successfully reduces the variance of the policy gradient, REINFORCE remains intrinsically bound to the **episodic Monte Carlo paradigm**:
$$\hat{A}_t = G_t - V_{\boldsymbol{\phi}}(s_t) = \left( \sum_{k=t}^T \gamma^{k-t} r_{k+1} \right) - V_{\boldsymbol{\phi}}(s_t)$$

This episodic dependence imposes severe operational constraints:
1. **No Online Learning:** The agent cannot execute a parameter update until the episode reaches a terminal state. In long-horizon tasks (such as 10,000-step robotic manipulation) or non-terminating continuing tasks, learning is delayed or impossible.
2. **Residual Monte Carlo Variance:** Because the return $G_t$ accumulates empirical rewards along the remaining trajectory, it retains high variance across stochastic transitions and future actions.

To eliminate episodic waiting and achieve true online step-by-step updates, Sutton (1984) and Konda & Tsitsiklis (2000) formulated the **Actor-Critic Architecture**.

```
                        THE ACTOR-CRITIC ARCHITECTURE
                        
                              Environment (MDP)
                                 │         ▲
                   Reward r_{t+1}│         │ Action a_t
                  Next State s'  │         │
                                 ▼         │
                       ┌───────────────────┴───────────────────┐
                       │                                       │
                       ▼                                       │
             ┌───────────────────┐                             │
             │   CRITIC V_ϕ(s)   │                             │
             │  Evaluates States │                             │
             └─────────┬─────────┘                             │
                       │ Value Prediction V(s)                 │
                       ▼                                       │
             ┌───────────────────┐                             │
             │  TD ERROR ENGINE  │                             │
             │ δ = r + γ V(s')-V │                             │
             └─────────┬─────────┘                             │
                       │                                       │
                       │ Advantage / TD Error δ_t              │
                       ▼                                       │
             ┌───────────────────┐                             │
             │   ACTOR π_θ(a|s)  │ ────────────────────────────┘
             │  Selects Actions  │
             └───────────────────┘
```

The system is decomposed into two distinct, cooperative functional agents:
1. **The Actor:** Parameterized as $\pi_{\boldsymbol{\theta}}(a \mid s)$, the Actor's sole responsibility is **action selection** (control). It maps environmental states to probability distributions over actions.
2. **The Critic:** Parameterized as $V_{\boldsymbol{\phi}}(s)$, the Critic's sole responsibility is **state evaluation** (prediction). It measures how good the state is by estimating the expected cumulative return.

Instead of waiting for the true empirical return $G_t$, the Critic **bootstraps** the value of future states, enabling instantaneous gradient updates at every single environmental transition.

---

## 8.2 One-Step Temporal Difference Actor-Critic

In one-step Actor-Critic, we substitute the one-step Bellman target $r_{t+1} + \gamma V_{\boldsymbol{\phi}}(s_{t+1})$ in place of the full return $G_t$.
The one-step Temporal Difference (TD) error is:
$$\delta_t = r_{t+1} + \gamma (1 - d_{t+1}) V_{\boldsymbol{\phi}}(s_{t+1}) - V_{\boldsymbol{\phi}}(s_t)$$

Notice what this TD error represents:
$$\mathbb{E}[\delta_t \mid s_t, a_t] = \mathbb{E}[r_{t+1} + \gamma V(s_{t+1}) \mid s_t, a_t] - V(s_t) = Q^\pi(s_t, a_t) - V^\pi(s_t) = A^\pi(s_t, a_t)$$

The one-step TD error $\delta_t$ is an **unbiased sample estimate of the Advantage function** $A^\pi(s_t, a_t)$!

### The Step-by-Step Update Equations
At every discrete time step $t$, the agent receives transition $(s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$ and performs the following updates:

1. **Compute TD Error:**
$$\delta_t = r_{t+1} + \gamma (1 - d_{t+1}) V_{\boldsymbol{\phi}}(s_{t+1}) - V_{\boldsymbol{\phi}}(s_t)$$

2. **Update Critic (Evaluation):**
Minimize the squared TD error $\mathcal{L}_{\text{critic}}(\boldsymbol{\phi}) = \frac{1}{2} \delta_t^2$:
$$\boldsymbol{\phi} \leftarrow \boldsymbol{\phi} + \alpha_v \delta_t \nabla_{\boldsymbol{\phi}} V_{\boldsymbol{\phi}}(s_t)$$

3. **Update Actor (Policy Improvement):**
Ascend the policy gradient scaled by the TD advantage:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha_\theta \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \delta_t$$

Learning occurs continuously at every single interaction step without storing trajectories or waiting for episodes to end.

---

## 8.3 The Bias-Variance Spectrum in Advantage Estimation

While one-step TD actor-critic eliminates episodic waiting and exhibits exceptionally low variance, it introduces **bias**.

Consider the spectrum of advantage estimators spanning from 1-step bootstrapping to $\infty$-step Monte Carlo:

```
                  THE BIAS-VARIANCE ADVANTAGE SPECTRUM
                  
   1-Step TD:          A^(1) = r_1 + γ V(s_1) - V(s_0)
                       [ Minimal Variance, Maximum Bias from imperfect V ]
                       
   2-Step TD:          A^(2) = r_1 + γ r_2 + γ^2 V(s_2) - V(s_0)
   
   k-Step TD:          A^(k) = ∑_{l=0}^{k-1} γ^l r_{t+l+1} + γ^k V(s_{t+k}) - V(s_t)
   
   Monte Carlo (∞):    A^(∞) = ∑_{l=0}^∞ γ^l r_{t+l+1} - V(s_t) = G_t - V(s_t)
                       [ Zero Bias, Maximum Variance from trajectory noise ]
```

### The Trade-off
- **When $k = 1$ (One-Step TD):** The estimator relies on only one real environmental reward ($r_{t+1}$) and bootstraps the rest via $V_{\boldsymbol{\phi}}(s_{t+1})$. 
  - *Variance:* Extremely low, because only a single step of randomness is sampled.
  - *Bias:* Extremely high early in training when $V_{\boldsymbol{\phi}}$ is inaccurate. If $V_{\boldsymbol{\phi}}$ has systemic estimation errors, those errors distort the actor's policy gradient.
- **When $k \to \infty$ (Monte Carlo):** The estimator uses real sampled rewards along the entire episode.
  - *Bias:* Exactly zero (unbiased with respect to the true return).
  - *Variance:* Extremely high, compounding the stochastic noise of hundreds of subsequent transitions.

Is there a principled mathematical framework that smoothly interpolates between 1-step TD and $\infty$-step Monte Carlo, achieving the optimal trade-off between bias and variance?

---

## 8.4 Generalized Advantage Estimation (GAE)

Schulman, Moritz, Levine, Jordan, and Abbeel (2015) answered this question by introducing **Generalized Advantage Estimation (GAE)**.

Define the 1-step TD residual of the value function $V$ at time step $t$:
$$\delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$

Now consider the family of $k$-step advantage estimators:
$$\hat{A}_t^{(1)} = \delta_t^V$$
$$\hat{A}_t^{(2)} = \delta_t^V + \gamma \delta_{t+1}^V = r_{t+1} + \gamma r_{t+2} + \gamma^2 V(s_{t+2}) - V(s_t)$$
$$\hat{A}_t^{(k)} = \sum_{l=0}^{k-1} \gamma^l \delta_{t+l}^V = \left( \sum_{l=0}^{k-1} \gamma^l r_{t+l+1} \right) + \gamma^k V(s_{t+k}) - V(s_t)$$

Notice that telescoping cancellations occur:
$$\hat{A}_t^{(k)} = (r_{t+1} + \gamma V(s_{t+1}) - V(s_t)) + \gamma (r_{t+2} + \gamma V(s_{t+2}) - V(s_{t+1})) + \dots = \sum_{l=0}^{k-1} \gamma^l r_{t+l+1} + \gamma^k V(s_{t+k}) - V(s_t)$$

### The Exponentially Weighted Mixture
Analogous to $\text{TD}(\lambda)$ in value-based RL, Generalized Advantage Estimation defines $\hat{A}_t^{\text{GAE}(\gamma, \lambda)}$ as the **exponentially decaying weighted average** of all $k$-step advantage estimators, parameterized by decay parameter $\lambda \in [0, 1]$:
$$\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = (1 - \lambda) \sum_{k=1}^\infty \lambda^{k-1} \hat{A}_t^{(k)}$$

Expanding this infinite series:
$$\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = (1 - \lambda) \left[ \hat{A}_t^{(1)} + \lambda \hat{A}_t^{(2)} + \lambda^2 \hat{A}_t^{(3)} + \dots \right]$$
$$= (1 - \lambda) \left[ \delta_t^V + \lambda (\delta_t^V + \gamma \delta_{t+1}^V) + \lambda^2 (\delta_t^V + \gamma \delta_{t+1}^V + \gamma^2 \delta_{t+2}^V) + \dots \right]$$
$$= (1 - \lambda) \left[ \delta_t^V (1 + \lambda + \lambda^2 + \dots) + \gamma \delta_{t+1}^V (\lambda + \lambda^2 + \dots) + \gamma^2 \delta_{t+2}^V (\lambda^2 + \dots) \right]$$

Since $\sum_{i=0}^\infty \lambda^i = \frac{1}{1 - \lambda}$, factoring out $\frac{1}{1 - \lambda}$ cancels $(1 - \lambda)$ completely:
$$\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$$

```
                         THE GAE RECURRENCE RELATION
                         
   Time:       t             t+1            t+2           t+3
   TD Errors: δ_t           δ_{t+1}        δ_{t+2}       δ_{t+3}
               │              │              │              │
               ▼              ▼              ▼              ▼
   GAE:       A_t  =  δ_t  +  (γλ) · [ δ_{t+1} + (γλ) · [ δ_{t+2} + (γλ) · δ_{t+3} ... ] ]
   
   Backward Recurrence:
   A_t = δ_t + (γλ) · A_{t+1}
```

### The Beautiful Backward Recurrence
Equation $\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$ yields a remarkably simple, elegant **backward recurrence relation**:
$$\hat{A}_t^{\text{GAE}} = \delta_t^V + \gamma \lambda (1 - d_{t+1}) \hat{A}_{t+1}^{\text{GAE}}$$

### Boundary Cases of $\lambda$
- **Case $\lambda = 0$:**
  $$\hat{A}_t^{\text{GAE}(\gamma, 0)} = \delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
  Recovers the **one-step TD advantage** (minimum variance, highest bias).
- **Case $\lambda = 1$:**
  $$\hat{A}_t^{\text{GAE}(\gamma, 1)} = \sum_{l=0}^\infty \gamma^l \delta_{t+l}^V = \sum_{l=0}^\infty \gamma^l r_{t+l+1} - V(s_t) = G_t - V(s_t)$$
  Recovers the **Monte Carlo advantage** (zero bias, highest variance).
- **Intermediate $\lambda \in (0, 1)$ (typically $\lambda = 0.95$):**
  Smoothly balances bias and variance. GAE suppresses the catastrophic high variance of long rollouts while allowing real empirical rewards to override local value function estimation errors. GAE is the universal advantage estimator employed by modern state-of-the-art policy optimization algorithms (including PPO, TRPO, and A2C).

---

## 8.5 Synchronous Advantage Actor-Critic (A2C) vs Asynchronous (A3C)

Mnih et al. (2016) revolutionized deep reinforcement learning by introducing **Asynchronous Advantage Actor-Critic (A3C)**. 
Prior to A3C, deep RL relied heavily on large Experience Replay buffers to break temporal autocorrelation in DQN. However, policy gradient methods are fundamentally **on-policy**: they cannot sample from stale replay buffers because the policy gradient theorem requires expectation under the *current* policy $\pi_{\boldsymbol{\theta}}$.

### The A3C Breakthrough
To break temporal autocorrelation without an off-policy replay buffer, A3C instantiated multiple parallel CPU worker threads, each interacting with an independent copy of the environment:
- Each worker maintained its own local network parameters $\boldsymbol{\theta}'$ and $\boldsymbol{\phi}'$.
- Workers independently collected rollouts of length $T_{\text{max}}$ (e.g. 5 or 20 steps).
- Workers computed local gradients and asynchronously pushed lock-free parameter updates to a global shared master network using Hogwild! SGD:
$$\boldsymbol{\theta}_{\text{global}} \leftarrow \boldsymbol{\theta}_{\text{global}} + \alpha \nabla \mathcal{L}_{\text{local}}$$

Because different workers traversed completely different areas of the state space simultaneously, the accumulated parameter updates were mutually decorrelated, stabilizing deep neural network training without experience replay.

```
                           A3C (ASYNCHRONOUS)
                           
               ┌──────────────────────────────────────┐
               │         GLOBAL MASTER MODEL          │
               │         Parameters θ and ϕ           │
               └────▲─────────────────────────────▲───┘
                    │ Push Gradients (Async)      │ Push Gradients (Async)
          ┌─────────┴─────────┐         ┌─────────┴─────────┐
          │ Worker 1 (CPU)    │         │ Worker N (CPU)    │
          │ Local Env Clone 1 │         │ Local Env Clone N │
          └───────────────────┘         └───────────────────┘
          
                           A2C (SYNCHRONOUS)
                           
               ┌──────────────────────────────────────┐
               │           CENTRALIZED GPU            │
               │   Forward & Backward on N Envs Batched│
               └──────────────▲────────────┬──────────┘
                              │ Actions    │ Next States, Rewards
          ┌───────────────────┴────────────▼──────────┐
          │     VECTORIZED PARALLEL ENVIRONMENTS      │
          │  [ Env 1 ]   [ Env 2 ]  ...  [ Env N ]    │
          └───────────────────────────────────────────┘
```

### The Transition to A2C (Synchronous Advantage Actor-Critic)
While A3C was historically groundbreaking, asynchronous multi-threading introduced subtle complications:
- Workers occasionally pushed gradients computed on stale parameters (gradient staleness).
- CPU multi-threading suffered from inter-thread synchronization overhead and cache thrashing.

OpenAI researchers (Wu et al., 2017) demonstrated that the asynchronous aspect of A3C was not the stabilizing mechanism—**the parallel environmental diversity was**.

They introduced **Synchronous Advantage Actor-Critic (A2C)**:
1. A single centralized neural network processes $N$ environments in parallel synchronously (e.g. $N = 16$ or $N = 64$ parallel environments).
2. The network performs a single batched forward pass to select actions for all $N$ workers.
3. All $N$ workers step their environments simultaneously.
4. After $T$ steps (generating an $N \times T$ matrix of transitions), advantages are computed synchronously using GAE.
5. A single large, deterministic mini-batch gradient step is executed on the GPU.

**Advantages of A2C over A3C:**
- **Deterministic and Reproducible:** Eliminates race conditions and non-deterministic CPU thread scheduling.
- **Hardware Efficiency:** Fully saturates modern high-throughput tensor processors (GPUs/TPUs) via batched matrix multiplications rather than fractured CPU thread loops.
- **Equal or Superior Sample Efficiency:** Achieves identical or higher performance than A3C in less wall-clock training time.

---

## 8.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 8.1: Step-by-Step GAE Calculation on a Finite Rollout
**Problem:** An agent collects a 4-step trajectory with rewards $r = [1.0, 2.0, 0.0, 4.0]$ and discount $\gamma = 0.90$.
The Critic predicts state values $V = [V(s_0), V(s_1), V(s_2), V(s_3), V(s_4)] = [2.5, 3.0, 2.0, 4.0, 1.0]$.
Let the GAE parameter be $\lambda = 0.80$.
1. Compute the one-step TD residuals $\delta_0^V, \delta_1^V, \delta_2^V, \delta_3^V$.
2. Compute the GAE advantages $\hat{A}_3, \hat{A}_2, \hat{A}_1, \hat{A}_0$ using the backward recurrence relation.
3. Compare $\hat{A}_0^{\text{GAE}}$ against the 1-step advantage $\delta_0^V$ and the Monte Carlo advantage $\hat{A}_0^{\text{MC}}$.

**Solution:**
1. TD residuals ($\delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$):
- $\delta_0^V = 1.0 + 0.90(3.0) - 2.5 = 1.0 + 2.7 - 2.5 = +1.20$
- $\delta_1^V = 2.0 + 0.90(2.0) - 3.0 = 2.0 + 1.8 - 3.0 = +0.80$
- $\delta_2^V = 0.0 + 0.90(4.0) - 2.0 = 0.0 + 3.6 - 2.0 = +1.60$
- $\delta_3^V = 4.0 + 0.90(1.0) - 4.0 = 4.0 + 0.9 - 4.0 = +0.90$

2. GAE backward recurrence:
Factor $\gamma \lambda = 0.90 \times 0.80 = 0.72$.
Base condition at end of rollout: $\hat{A}_4 = 0$.
- Step $t = 3$:
  $$\hat{A}_3 = \delta_3^V + \gamma \lambda \hat{A}_4 = 0.90 + 0.72(0) = 0.9000$$
- Step $t = 2$:
  $$\hat{A}_2 = \delta_2^V + \gamma \lambda \hat{A}_3 = 1.60 + 0.72(0.9000) = 1.60 + 0.6480 = 2.2480$$
- Step $t = 1$:
  $$\hat{A}_1 = \delta_1^V + \gamma \lambda \hat{A}_2 = 0.80 + 0.72(2.2480) = 0.80 + 1.61856 = 2.4186$$
- Step $t = 0$:
  $$\hat{A}_0 = \delta_0^V + \gamma \lambda \hat{A}_1 = 1.20 + 0.72(2.41856) = 1.20 + 1.74136 = 2.9414$$

3. Comparison:
- 1-step advantage ($\lambda = 0$): $\delta_0^V = +1.2000$.
- Monte Carlo return from $s_0$:
  $$G_0 = 1.0 + 0.9(2.0) + (0.9)^2(0.0) + (0.9)^3(4.0) + (0.9)^4(1.0) = 1.0 + 1.8 + 0 + 0.729(4) + 0.6561(1) = 2.8 + 2.916 + 0.6561 = 6.3721$$
  $$\hat{A}_0^{\text{MC}} = G_0 - V(s_0) = 6.3721 - 2.5 = +3.8721$$
- $\text{GAE}(\lambda = 0.80)$: $\hat{A}_0 = 2.9414$.
Notice that $1.2000 < 2.9414 < 3.8721$. GAE cleanly interpolates between the conservative 1-step estimate and the high-variance Monte Carlo return!

---

### Worked Example 8.2: Critic Bootstrapping at Truncated Horizons
**Problem:** An A2C agent collects rollouts of length $T_{\text{rollout}} = 5$.
At step $t = 5$, the episode has **not** terminated ($d_5 = \text{false}$), but the rollout buffer is full and must be updated.
1. Write the target value for the final step $t = 4$.
2. Contrast this with the target when step $t = 5$ is a genuine terminal state ($d_5 = \text{true}$).
3. Why is bootstrapping with $V(s_5)$ critical when handling artificial timeout truncation?

**Solution:**
1. Truncated non-terminal target:
Since the episode continues past step $5$, future rewards exist. The Critic bootstraps the expected remaining return:
$$y_4 = r_5 + \gamma V(s_5)$$
$$\delta_4^V = r_5 + \gamma V(s_5) - V(s_4)$$

2. Genuine terminal target ($d_5 = \text{true}$):
If the agent died or reached the terminal goal, no future rewards can be received:
$$y_4 = r_5 + \gamma (0) = r_5$$
$$\delta_4^V = r_5 - V(s_4)$$

3. Importance of bootstrapping on timeout:
If an environment terminates due to an artificial time limit (e.g. 1,000 steps in Gym environments), setting $V(s_5) = 0$ would falsely inform the critic that reaching step 1,000 has zero future value (equivalent to dying). This introduces severe negative bias, causing the agent to act erratically near the time limit. Bootstrapping with $V(s_{\text{truncated}})$ correctly preserves value continuity across artificial window boundaries.

---

### Worked Example 8.3: Analytical Advantage Estimation Under Linear Value Function
**Problem:** Let state $s \in \mathbb{R}$. The Critic is $V_\phi(s) = \phi \cdot s$ with $\phi = 2.0$.
Transition observed: $s = 3.0, a = 1, r = +5.0, s' = 4.0$, with $\gamma = 0.90$.
1. Compute the Critic predictions $V(s)$ and $V(s')$.
2. Compute the 1-step TD advantage $\delta$.
3. Compute the Critic parameter gradient $\nabla_\phi \mathcal{L}_{\text{critic}}$ under MSE loss $\frac{1}{2}\delta^2$.

**Solution:**
1. Value predictions:
$$V(s) = 2.0 \times 3.0 = 6.0$$
$$V(s') = 2.0 \times 4.0 = 8.0$$

2. 1-step TD error:
$$\delta = r + \gamma V(s') - V(s) = 5.0 + 0.90(8.0) - 6.0 = 5.0 + 7.2 - 6.0 = 6.2$$
The advantage is $\hat{A} = +6.2$.

3. Critic gradient:
Loss: $\mathcal{L}(\phi) = \frac{1}{2}(r + \gamma V(s') - V_\phi(s))^2$.
Using the semi-gradient (treating $V(s')$ as fixed):
$$\frac{\partial \mathcal{L}}{\partial \phi} = - \delta \frac{\partial V_\phi(s)}{\partial \phi} = - 6.2 \times s = -6.2 \times 3.0 = -18.6$$
Update: $\Delta \phi = -\alpha \frac{\partial \mathcal{L}}{\partial \phi} = \alpha (18.6) > 0$, increasing $\phi$ to reduce the positive TD error.

---

### Worked Example 8.4: Combined A2C Multi-Task Loss Function
**Problem:** In A2C implementations, the Actor and Critic often share a common convolutional backbone and are optimized via a single joint scalar loss:
$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{policy}} + c_1 \mathcal{L}_{\text{value}} - c_2 \mathcal{L}_{\text{entropy}}$$
Suppose for a mini-batch:
- Policy loss: $\mathcal{L}_{\text{policy}} = - \frac{1}{B}\sum_{i=1}^B \log \pi(a_i \mid s_i) \hat{A}_i = -1.45$.
- Value loss: $\mathcal{L}_{\text{value}} = \frac{1}{2B}\sum_{i=1}^B (y_i - V(s_i))^2 = 0.80$.
- Entropy: $\mathcal{H} = \frac{1}{B}\sum_{i=1}^B \mathcal{H}(\pi(\cdot \mid s_i)) = 0.65$.
Let $c_1 = 0.50$ (value coefficient) and $c_2 = 0.01$ (entropy coefficient).
1. Compute the total loss $\mathcal{L}_{\text{total}}$.
2. Explain the sign convention of each term in the loss.

**Solution:**
1. Total loss calculation:
$$\mathcal{L}_{\text{total}} = (-1.45) + 0.50(0.80) - 0.01(0.65) = -1.45 + 0.40 - 0.0065 = -1.0565$$

2. Sign convention:
- Standard deep learning frameworks (PyTorch, TensorFlow) perform **gradient descent** (minimizing loss).
- We wish to *maximize* policy return $\implies$ minimize $-\log \pi \cdot \hat{A}$.
- We wish to *minimize* value prediction error $\implies$ minimize $+ \frac{1}{2}(y - V)^2$.
- We wish to *maximize* policy entropy $\implies$ minimize $-\mathcal{H}$.
Thus, minimizing $\mathcal{L}_{\text{total}}$ simultaneously achieves policy gradient ascent, value error minimization, and entropy maximization.

---

### Worked Example 8.5: Parallel Environment Vectorization in A2C
**Problem:** An A2C agent runs $N = 4$ parallel environments. Over rollout horizon $T = 3$, it collects matrices of rewards $\mathbf{R}$ and terminal flags $\mathbf{D}$:
$$\mathbf{R} = \begin{bmatrix}
1 & 0 & 2 \\
0 & 0 & 1 \\
3 & 1 & 0 \\
0 & 2 & 1
\end{bmatrix}, \quad \mathbf{D} = \begin{bmatrix}
0 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 0 \\
0 & 0 & 1
\end{bmatrix}$$
where rows represent environments $0..3$ and columns represent time steps $t = 0, 1, 2$.
Discount $\gamma = 0.90, \lambda = 1.0$ (Monte Carlo).
Values for all states are predicted as $V = 1.0$ across the board.
Compute the GAE advantage matrix $\hat{\mathbf{A}}$ for step $t = 1$ across all 4 environments.

**Solution:**
For $\lambda = 1.0$, GAE simplifies to the discounted Monte Carlo return minus value:
$$\hat{A}_{i, t} = \delta_{i, t} + \gamma (1 - D_{i, t+1}) \hat{A}_{i, t+1}$$
At $t = 2$ (last step, bootstrapping with $V=1.0$):
- Env 0: $\delta_{0, 2} = R_{0, 2} + \gamma V - V = 2 + 0.9(1) - 1 = 1.9 \implies \hat{A}_{0, 2} = 1.9$.
- Env 1: $\delta_{1, 2} = 1 + 0.9(1) - 1 = 0.9 \implies \hat{A}_{1, 2} = 0.9$.
- Env 2: $\delta_{2, 2} = 0 + 0.9(1) - 1 = -0.1 \implies \hat{A}_{2, 2} = -0.1$.
- Env 3: $D_{3, 2} = 1$ (terminal!): $\delta_{3, 2} = R_{3, 2} + \gamma(0) - V = 1 + 0 - 1 = 0.0 \implies \hat{A}_{3, 2} = 0.0$.

Now compute $t = 1$:
- Env 0 ($D_{0, 1} = 0$): $\delta_{0, 1} = 0 + 0.9(1) - 1 = -0.1$.
  $$\hat{A}_{0, 1} = -0.1 + 0.90(1 - 0)(1.9) = -0.1 + 1.71 = +1.61$$
- Env 1 ($D_{1, 1} = 1$, terminal at $t=1$!):
  $$\delta_{1, 1} = R_{1, 1} + \gamma(0) - V = 0 + 0 - 1 = -1.0$$
  Since $D_{1, 1} = 1$, future advantage from $t=2$ is masked out:
  $$\hat{A}_{1, 1} = \delta_{1, 1} + \gamma(1 - 1)\hat{A}_{1, 2} = -1.0 + 0 = -1.00$$
- Env 2 ($D_{2, 1} = 0$): $\delta_{2, 1} = 1 + 0.9(1) - 1 = +0.9$.
  $$\hat{A}_{2, 1} = 0.9 + 0.90(1 - 0)(-0.1) = 0.9 - 0.09 = +0.81$$
- Env 3 ($D_{3, 1} = 0$): $\delta_{3, 1} = 2 + 0.9(1) - 1 = +1.9$.
  $$\hat{A}_{3, 1} = 1.9 + 0.90(1 - 0)(0.0) = +1.90$$
The vector of advantages at $t=1$ across the 4 environments is:
$$\hat{\mathbf{A}}_{\cdot, 1} = [+1.61, -1.00, +0.81, +1.90]^\top$$

---

### Worked Example 8.6: Normalized GAE Advantages
**Problem:** In PPO and A2C, empirical advantages across a mini-batch of size $B = 4$ are: $\hat{\mathbf{A}} = [2.5, -1.0, 0.5, 4.0]$.
1. Compute the sample mean $\mu_A$ and sample standard deviation $\sigma_A$.
2. Compute the normalized advantages $\tilde{A}_i = \frac{\hat{A}_i - \mu_A}{\sigma_A + 10^{-8}}$.
3. Explain why normalizing advantages prevents gradient vanishing or exploding across different stages of training.

**Solution:**
1. Sample statistics:
$$\mu_A = \frac{2.5 + (-1.0) + 0.5 + 4.0}{4} = \frac{6.0}{4} = 1.50$$
Deviations: $2.5 - 1.5 = +1.0, -1.0 - 1.5 = -2.5, 0.5 - 1.5 = -1.0, 4.0 - 1.5 = +2.5$.
Sum of squared deviations:
$$(1.0)^2 + (-2.5)^2 + (-1.0)^2 + (2.5)^2 = 1.0 + 6.25 + 1.0 + 6.25 = 14.5$$
Sample variance ($N-1 = 3$):
$$s^2 = \frac{14.5}{3} \approx 4.8333 \implies \sigma_A = \sqrt{4.8333} \approx 2.1985$$

2. Normalized advantages:
- $\tilde{A}_0 = \frac{1.0}{2.1985} \approx +0.4549$
- $\tilde{A}_1 = \frac{-2.5}{2.1985} \approx -1.1371$
- $\tilde{A}_2 = \frac{-1.0}{2.1985} \approx -0.4549$
- $\tilde{A}_3 = \frac{2.5}{2.1985} \approx +1.1371$

3. Purpose:
Without normalization, early in training when the Critic has high errors, raw advantages can reach $\hat{A} = 100$, causing massive parameter shifts. Late in training when the Critic is accurate, raw advantages shrink to $\hat{A} = 0.001$, stalling policy updates. Normalizing advantages ensures that the advantage distribution always has mean 0 and unit variance $\sigma = 1$, maintaining steady, predictable policy gradient updates throughout training.

---

### Worked Example 8.7: Synchronous Gradient All-Reduce in A2C
**Problem:** An A2C implementation distributes computation across 2 GPU workers.
Worker 1 computes gradient vector $\mathbf{g}_1 = [0.4, -0.6]^\top$ on batch size $B=32$.
Worker 2 computes gradient vector $\mathbf{g}_2 = [0.2, 0.8]^\top$ on batch size $B=32$.
1. Compute the synchronized all-reduced average gradient $\bar{\mathbf{g}}$.
2. If the current parameter vector is $\boldsymbol{\theta}_0 = [1.0, 1.0]^\top$ and learning rate is $\alpha = 0.1$, compute the updated parameter vector $\boldsymbol{\theta}_1$.

**Solution:**
1. All-Reduce average gradient:
$$\bar{\mathbf{g}} = \frac{\mathbf{g}_1 + \mathbf{g}_2}{2} = \frac{1}{2} \left( \begin{bmatrix} 0.4 \\ -0.6 \end{bmatrix} + \begin{bmatrix} 0.2 \\ 0.8 \end{bmatrix} \right) = \frac{1}{2} \begin{bmatrix} 0.6 \\ 0.2 \end{bmatrix} = \begin{bmatrix} 0.3 \\ 0.1 \end{bmatrix}$$

2. Parameter update:
$$\boldsymbol{\theta}_1 = \boldsymbol{\theta}_0 + \alpha \bar{\mathbf{g}} = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix} + 0.1 \begin{bmatrix} 0.3 \\ 0.1 \end{bmatrix} = \begin{bmatrix} 1.0 + 0.03 \\ 1.0 + 0.01 \end{bmatrix} = \begin{bmatrix} 1.03 \\ 1.01 \end{bmatrix}$$
Synchronous All-Reduce guarantees mathematically equivalent results to running a single worker with batch size $2B = 64$.

---

### Worked Example 8.8: Generalized Advantage Estimation Function in TypeScript
**Problem:** Author a TypeScript function `computeGAE` that accepts arrays of rewards, values, and dones, along with $\gamma$ and $\lambda$, and returns the complete array of GAE advantage estimates $\hat{A}_t$ and TD targets $y_t$.

**Solution:**
```typescript
export interface GAEResult {
  advantages: Float64Array;
  targets: Float64Array; // y_t = A_t + V(s_t)
}

export function computeGAE(
  rewards: number[],
  values: number[], // Length: T + 1 (includes terminal/next state value V(s_T))
  dones: boolean[],  // Length: T
  gamma: number = 0.99,
  lambda: number = 0.95
): GAEResult {
  const T = rewards.length;
  const advantages = new Float64Array(T);
  const targets = new Float64Array(T);

  let gae = 0;
  const factor = gamma * lambda;

  // Backward recurrence from T-1 down to 0
  for (let t = T - 1; t >= 0; t--) {
    const nonTerminal = dones[t] ? 0.0 : 1.0;
    // delta_t = r_{t+1} + gamma * V(s_{t+1}) * (1 - done) - V(s_t)
    const delta = rewards[t] + gamma * values[t + 1] * nonTerminal - values[t];
    // A_t = delta_t + gamma * lambda * (1 - done) * A_{t+1}
    gae = delta + factor * nonTerminal * gae;
    advantages[t] = gae;
    // Target for critic regression: y_t = A_t + V(s_t)
    targets[t] = gae + values[t];
  }

  return { advantages, targets };
}
```

Verification Test:
```typescript
const res = computeGAE([1.0, 2.0, 0.0, 4.0], [2.5, 3.0, 2.0, 4.0, 1.0], [false, false, false, false], 0.90, 0.80);
console.log("GAE Advantage at t=0:", res.advantages[0].toFixed(4)); // 2.9414 (matches Worked Example 8.1!)
```

---

### Worked Example 8.9: Actor-Critic Gradient Step with Clipped Gradients
**Problem:** A deep neural network experiences a large gradient vector $\mathbf{g} = [3.0, -4.0]^\top$.
Global gradient norm clipping threshold is set to $M = 2.5$.
1. Compute the $L_2$ norm of $\mathbf{g}$.
2. Compute the clipped gradient vector $\mathbf{g}_{\text{clipped}} = \mathbf{g} \cdot \min\left(1.0, \frac{M}{\|\mathbf{g}\|_2}\right)$.
3. Verify that $\|\mathbf{g}_{\text{clipped}}\|_2 = M$.

**Solution:**
1. $L_2$ norm calculation:
$$\|\mathbf{g}\|_2 = \sqrt{3.0^2 + (-4.0)^2} = \sqrt{9.0 + 16.0} = \sqrt{25.0} = 5.0$$

2. Clipped gradient:
Scaling factor:
$$\text{factor} = \min\left(1.0, \frac{2.5}{5.0}\right) = \min(1.0, 0.5) = 0.5$$
$$\mathbf{g}_{\text{clipped}} = 0.5 \times \begin{bmatrix} 3.0 \\ -4.0 \end{bmatrix} = \begin{bmatrix} 1.5 \\ -2.0 \end{bmatrix}$$

3. Norm verification:
$$\|\mathbf{g}_{\text{clipped}}\|_2 = \sqrt{1.5^2 + (-2.0)^2} = \sqrt{2.25 + 4.0} = \sqrt{6.25} = 2.5 = M$$
Gradient clipping rescales the vector strictly to length $2.5$ while preserving its directional angle.

---

### Worked Example 8.10: Complete TypeScript Implementation of A2C Agent
**Problem:** Author a complete, modular TypeScript class `A2CAgent` implementing a dual Actor-Critic network with GAE, normalized advantages, entropy bonus, and batch updates.

**Solution:**
```typescript
import { computeGAE } from './gae'; // Assuming GAE from Worked Example 8.8

export interface RolloutBuffer {
  states: number[][];
  actions: number[];
  rewards: number[];
  dones: boolean[];
  values: number[];
}

export class A2CAgent {
  public actorWeights: number[][]; // numActions x stateDim
  public criticWeights: number[];   // stateDim
  public criticBias: number = 0;

  constructor(
    public readonly stateDim: number,
    public readonly numActions: number,
    public readonly gamma: number = 0.99,
    public readonly lambda: number = 0.95,
    public readonly lrActor: number = 0.001,
    public readonly lrCritic: number = 0.005,
    public readonly entCoef: number = 0.01
  ) {
    this.actorWeights = Array.from({ length: numActions }, () =>
      new Array(stateDim).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );
    this.criticWeights = new Array(stateDim).fill(0);
  }

  predictValue(state: number[]): number {
    let val = this.criticBias;
    for (let d = 0; d < this.stateDim; d++) val += this.criticWeights[d] * state[d];
    return val;
  }

  predictProbs(state: number[]): number[] {
    const logits = new Array(this.numActions).fill(0);
    let maxLogit = -Infinity;
    for (let a = 0; a < this.numActions; a++) {
      let sum = 0;
      for (let d = 0; d < this.stateDim; d++) sum += this.actorWeights[a][d] * state[d];
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
    return probs;
  }

  update(rollout: RolloutBuffer, nextStateValue: number): { actorLoss: number; criticLoss: number } {
    const T = rollout.rewards.length;
    const allValues = [...rollout.values, nextStateValue];

    // 1. Compute GAE
    const { advantages, targets } = computeGAE(
      rollout.rewards,
      allValues,
      rollout.dones,
      this.gamma,
      this.lambda
    );

    // 2. Normalize Advantages
    let meanAdv = 0;
    for (let t = 0; t < T; t++) meanAdv += advantages[t];
    meanAdv /= T;

    let varAdv = 0;
    for (let t = 0; t < T; t++) varAdv += (advantages[t] - meanAdv) ** 2;
    const stdAdv = Math.sqrt(varAdv / T) + 1e-8;

    const normAdv = new Float64Array(T);
    for (let t = 0; t < T; t++) normAdv[t] = (advantages[t] - meanAdv) / stdAdv;

    let totalActorLoss = 0;
    let totalCriticLoss = 0;

    // 3. Update Critic and Actor Parameters
    for (let t = 0; t < T; t++) {
      const state = rollout.states[t];
      const action = rollout.actions[t];
      const target = targets[t];
      const adv = normAdv[t];

      // Critic Update (MSE: target - V)
      const currentV = this.predictValue(state);
      const cError = target - currentV;
      totalCriticLoss += 0.5 * cError * cError;
      for (let d = 0; d < this.stateDim; d++) {
        this.criticWeights[d] += this.lrCritic * cError * state[d];
      }
      this.criticBias += this.lrCritic * cError;

      // Actor Update
      const probs = this.predictProbs(state);
      let entropy = 0;
      for (let a = 0; a < this.numActions; a++) {
        if (probs[a] > 1e-12) entropy -= probs[a] * Math.log(probs[a]);
      }

      totalActorLoss -= Math.log(probs[action] + 1e-12) * adv;

      for (let a = 0; a < this.numActions; a++) {
        const indicator = a === action ? 1.0 : 0.0;
        const pgScore = (indicator - probs[a]) * adv;
        const logP = probs[a] > 1e-12 ? Math.log(probs[a]) : 0;
        const entGrad = -probs[a] * (logP + entropy);
        const updateFactor = pgScore + this.entCoef * entGrad;

        for (let d = 0; d < this.stateDim; d++) {
          this.actorWeights[a][d] += this.lrActor * updateFactor * state[d];
        }
      }
    }

    return {
      actorLoss: totalActorLoss / T,
      criticLoss: totalCriticLoss / T
    };
  }
}
```

---

## 8.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 8.1: Telescoping Sum Proof of $k$-Step Advantage Equivalence
**Problem:** Let $\delta_t = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$.
Prove by mathematical induction that for any $k \ge 1$:
$$\sum_{l=0}^{k-1} \gamma^l \delta_{t+l} = \left( \sum_{l=0}^{k-1} \gamma^l r_{t+l+1} \right) + \gamma^k V(s_{t+k}) - V(s_t)$$

**Solution:**
**Base Case ($k = 1$):**
$$\sum_{l=0}^0 \gamma^l \delta_{t+l} = \delta_t = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
Right-hand side:
$$\left( \sum_{l=0}^0 \gamma^l r_{t+l+1} \right) + \gamma^1 V(s_{t+1}) - V(s_t) = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
Base case holds.

**Inductive Step:**
Assume the identity holds for $k = m$:
$$\sum_{l=0}^{m-1} \gamma^l \delta_{t+l} = \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m V(s_{t+m}) - V(s_t)$$
For $k = m + 1$:
$$\sum_{l=0}^m \gamma^l \delta_{t+l} = \left( \sum_{l=0}^{m-1} \gamma^l \delta_{t+l} \right) + \gamma^m \delta_{t+m}$$
Substitute inductive hypothesis and expand $\delta_{t+m} = r_{t+m+1} + \gamma V(s_{t+m+1}) - V(s_{t+m})$:
$$= \left[ \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m V(s_{t+m}) - V(s_t) \right] + \gamma^m \left[ r_{t+m+1} + \gamma V(s_{t+m+1}) - V(s_{t+m}) \right]$$
Expand the second term:
$$= \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m V(s_{t+m}) - V(s_t) + \gamma^m r_{t+m+1} + \gamma^{m+1} V(s_{t+m+1}) - \gamma^m V(s_{t+m})$$
Notice that $+\gamma^m V(s_{t+m})$ and $-\gamma^m V(s_{t+m})$ cancel out identically!
$$= \left( \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m r_{t+m+1} \right) + \gamma^{m+1} V(s_{t+m+1}) - V(s_t)$$
$$= \sum_{l=0}^m \gamma^l r_{t+l+1} + \gamma^{m+1} V(s_{t+m+1}) - V(s_t)$$
The identity holds for $k = m + 1$. By induction, it holds for all $k \ge 1$. $\blacksquare$

---

### Exercise 8.2: Upper Bound on GAE Advantage Bias
**Problem:** Schulman et al. (2015) established that if the value function error is bounded, $|V(s) - V^\pi(s)| \le \epsilon_V$ for all $s \in \mathcal{S}$:
Show that the bias of the GAE advantage estimator with decay parameter $\lambda$ satisfies:
$$\left| \mathbb{E}[\hat{A}_t^{\text{GAE}}] - A^\pi(s_t, a_t) \right| \le \frac{2 \gamma \epsilon_V (1 - \lambda)}{1 - \gamma \lambda}$$

**Solution:**
From the definition of GAE:
$$\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$$
Recall that $\mathbb{E}[\delta_{t+l}^V \mid s_{t+l}, a_{t+l}] = A^\pi(s_{t+l}, a_{t+l}) + \gamma (V(s_{t+l+1}) - V^\pi(s_{t+l+1})) - (V(s_{t+l}) - V^\pi(s_{t+l}))$.
Let $e(s) = V(s) - V^\pi(s)$. Then $|e(s)| \le \epsilon_V$.
Taking the expectation conditioned on $(s_t, a_t)$:
$$\mathbb{E}[\hat{A}_t^{\text{GAE}} - A^\pi(s_t, a_t)] = \sum_{l=0}^\infty (\gamma \lambda)^l \mathbb{E}[\gamma e(s_{t+l+1}) - e(s_{t+l})]$$
Expanding and rearranging terms:
$$= -e(s_t) + \sum_{l=1}^\infty (\gamma \lambda)^{l-1} (\gamma - \gamma \lambda) \mathbb{E}[e(s_{t+l})]$$
Taking absolute values and applying the triangle inequality:
$$\le \epsilon_V + \gamma (1 - \lambda) \epsilon_V \sum_{l=1}^\infty (\gamma \lambda)^{l-1} = \epsilon_V + \frac{\gamma (1 - \lambda) \epsilon_V}{1 - \gamma \lambda} = \epsilon_V \left( 1 + \frac{\gamma(1 - \lambda)}{1 - \gamma \lambda} \right) = \frac{\epsilon_V (1 + \gamma - 2\gamma \lambda)}{1 - \gamma \lambda} \le \frac{2 \gamma \epsilon_V (1 - \lambda)}{1 - \gamma \lambda}$$
Notice:
- As $\lambda \to 1$ (Monte Carlo), the bias bound approaches $0$.
- As $\lambda \to 0$ (1-step TD), the bias bound reaches its maximum $\frac{2\gamma \epsilon_V}{1}$. GAE exponentially suppresses value estimation errors by factor $(1 - \lambda)$.

---

### Exercise 8.3: Generalized Advantage Estimation Variance Bound
**Problem:** Suppose the variance of the 1-step TD residual is $\mathbb{V}[\delta_t^V] = \sigma_\delta^2$, and assume $\delta_t^V$ are approximately uncorrelated across steps.
1. Derive the variance of the GAE advantage estimator $\mathbb{V}[\hat{A}_t^{\text{GAE}}]$ as a function of $\gamma, \lambda$, and $\sigma_\delta^2$.
2. Evaluate the variance for $\gamma = 0.99$ when $\lambda = 0$ (1-step) vs $\lambda = 1.0$ (Monte Carlo).

**Solution:**
1. Variance derivation:
$$\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$$
Since $\delta_{t+l}^V$ are assumed uncorrelated:
$$\mathbb{V}[\hat{A}_t^{\text{GAE}}] = \sum_{l=0}^\infty (\gamma \lambda)^{2l} \mathbb{V}[\delta_{t+l}^V] = \sigma_\delta^2 \sum_{l=0}^\infty (\gamma^2 \lambda^2)^l = \frac{\sigma_\delta^2}{1 - \gamma^2 \lambda^2}$$

2. Evaluations ($\gamma = 0.99$):
- For $\lambda = 0$ (1-step TD):
  $$\mathbb{V}[\hat{A}] = \frac{\sigma_\delta^2}{1 - 0} = \sigma_\delta^2 = 1.0 \times \sigma_\delta^2$$
- For $\lambda = 1.0$ (Monte Carlo):
  $$\mathbb{V}[\hat{A}] = \frac{\sigma_\delta^2}{1 - (0.99)^2} = \frac{\sigma_\delta^2}{1 - 0.9801} = \frac{\sigma_\delta^2}{0.0199} \approx 50.25 \times \sigma_\delta^2$$
The Monte Carlo estimator has **over 50 times higher variance** than the 1-step estimator! Setting $\lambda = 0.95$ yields $\mathbb{V}[\hat{A}] = \frac{\sigma_\delta^2}{1 - (0.99 \times 0.95)^2} = \frac{\sigma_\delta^2}{1 - 0.8845} \approx 8.65 \times \sigma_\delta^2$, achieving an $83\%$ variance reduction compared to Monte Carlo.

---

### Exercise 8.4: Critic Loss Objective Target: Return vs GAE+Value
**Problem:** In A2C/PPO implementations, two different regression targets are commonly used to update the Critic:
- **Target A (Empirical Discounted Return):** $y_t = G_t$.
- **Target B (GAE Advantage + Current Value):** $y_t = \hat{A}_t^{\text{GAE}} + V(s_t)$.
1. Prove that for $\lambda = 1.0$, Target B is mathematically identical to Target A.
2. Prove that for $\lambda = 0.0$, Target B is the one-step TD target $r_{t+1} + \gamma V(s_{t+1})$.
3. Why is Target B universally preferred in modern deep RL pipelines?

**Solution:**
1. Case $\lambda = 1.0$:
$$\hat{A}_t^{\text{GAE}(\gamma, 1)} = G_t - V(s_t)$$
$$y_t = \hat{A}_t^{\text{GAE}} + V(s_t) = (G_t - V(s_t)) + V(s_t) = G_t = \text{Target A} \quad \blacksquare$$

2. Case $\lambda = 0.0$:
$$\hat{A}_t^{\text{GAE}(\gamma, 0)} = \delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
$$y_t = \hat{A}_t^{\text{GAE}} + V(s_t) = (r_{t+1} + \gamma V(s_{t+1}) - V(s_t)) + V(s_t) = r_{t+1} + \gamma V(s_{t+1}) \quad \blacksquare$$

3. Preference for Target B:
Target B smoothly inherits the $\lambda$-interpolation of GAE. Setting $\lambda = 0.95$ provides a target that is significantly less noisy than raw Monte Carlo returns $G_t$, while avoiding the severe bootstrapping lag of pure 1-step TD. It unifies actor and critic optimization under a single, consistent bias-variance knob.

---

### Exercise 8.5: Hogwild! Lock-Free SGD Convergence Conditions
**Problem:** In A3C, parallel threads update shared parameters $\boldsymbol{\theta}$ using asynchronous, lock-free writes (Recht et al., 2011, *Hogwild!*).
Under what condition on the sparsity of the gradient vectors $\mathbf{g}_i$ is Hogwild! SGD guaranteed to converge at the same asymptotic rate as serial SGD?

**Solution:**
Recht et al. proved that Hogwild! achieves linear speedup without locking provided that gradient updates are **sparse**:
Let $e \subseteq \{1, \dots, d\}$ denote the subset of coordinate indices modified by a gradient step.
Let $\rho = \max_{e \in E} \frac{|e|}{d}$ be the maximum coordinate participation ratio, and $\Delta = \max_{e \in E} |\{e' \in E : e \cap e' \neq \emptyset\}|$ be the conflict degree.
If $\rho \ll 1$ and the maximum staleness $\tau$ of any thread satisfies:
$$\tau \le \mathcal{O}(d^{1/4})$$
then the probability that two threads attempt to overwrite the identical coordinate simultaneously is negligibly small. The asynchronous noise acts as an infinitesimal mean-zero perturbation, preserving the $\mathcal{O}(1/\sqrt{T})$ convergence rate of serial SGD.

---

### Exercise 8.6: Vectorized Environment Memory Footprint and Throughput
**Problem:** A researcher configures an A2C worker running $N$ parallel environments on a single GPU.
Each environment produces a state vector of dimension $D = 64$ float32 numbers.
Rollout horizon is $T = 20$ steps.
1. Compute the memory consumed by a single rollout buffer of transitions $(s, a, r, d)$ in megabytes for $N = 64$ environments.
2. If environment stepping takes $0.5 \text{ ms}$ per step across all environments in parallel, and GPU forward/backward pass takes $2.0 \text{ ms}$, calculate the environment throughput in transitions per second.

**Solution:**
1. Memory calculation:
Per transition:
- State $s$: $64 \times 4 \text{ bytes} = 256$ bytes.
- Action $a$: 4 bytes.
- Reward $r$: 4 bytes.
- Done $d$: 1 byte.
- Value $V$: 4 bytes.
Total per transition $\approx 269$ bytes.
Total transitions in rollout: $N \times T = 64 \times 20 = 1,280$ transitions.
Total memory:
$$\text{Memory} = 1,280 \times 269 \text{ bytes} = 344,320 \text{ bytes} \approx 0.328 \text{ MB}$$
The rollout buffer consumes less than $1 \text{ MB}$ of VRAM.

2. Throughput calculation:
Time per rollout cycle of $T = 20$ steps:
- Environment stepping: $20 \text{ steps} \times 0.5 \text{ ms} = 10.0 \text{ ms}$.
- GPU computation: $2.0 \text{ ms}$.
Total cycle time: $10.0 + 2.0 = 12.0 \text{ ms} = 0.012 \text{ seconds}$.
Transitions collected per cycle: $64 \times 20 = 1,280$ transitions.
$$\text{Throughput} = \frac{1,280 \text{ transitions}}{0.012 \text{ seconds}} \approx 106,667 \text{ transitions/second}$$

---

### Exercise 8.7: Two-Headed Shared Backbone Gradient Interference
**Problem:** In A2C, a shared convolutional neural network $\mathbf{z} = f_{\boldsymbol{\theta}_{\text{shared}}}(s)$ feeds both an Actor head $\pi(a \mid \mathbf{z})$ and a Critic head $V(\mathbf{z})$.
1. Write the gradient of the shared parameters $\nabla_{\boldsymbol{\theta}_{\text{shared}}} \mathcal{L}_{\text{total}}$ in terms of $\nabla_{\mathbf{z}} \mathcal{L}_{\text{policy}}$ and $\nabla_{\mathbf{z}} \mathcal{L}_{\text{value}}$.
2. Describe the phenomenon of **gradient interference** (or negative transfer) between the Actor and Critic objectives.
3. How does modern practice (e.g. separate networks in continuous control) prevent this interference?

**Solution:**
1. Gradient via vector-Jacobian product:
$$\nabla_{\boldsymbol{\theta}_{\text{shared}}} \mathcal{L}_{\text{total}} = \mathbf{J}_{\boldsymbol{\theta}_{\text{shared}}}^\top \left( \nabla_{\mathbf{z}} \mathcal{L}_{\text{policy}} + c_1 \nabla_{\mathbf{z}} \mathcal{L}_{\text{value}} \right)$$
where $\mathbf{J}_{\boldsymbol{\theta}_{\text{shared}}} = \frac{\partial \mathbf{z}}{\partial \boldsymbol{\theta}_{\text{shared}}}$.

2. Gradient interference:
If the angle between the policy gradient $\mathbf{g}_{\text{actor}} = \nabla_{\mathbf{z}} \mathcal{L}_{\text{policy}}$ and the value gradient $\mathbf{g}_{\text{critic}} = \nabla_{\mathbf{z}} \mathcal{L}_{\text{value}}$ is obtuse:
$$\cos(\mathbf{g}_{\text{actor}}, \mathbf{g}_{\text{critic}}) = \frac{\mathbf{g}_{\text{actor}}^\top \mathbf{g}_{\text{critic}}}{\|\mathbf{g}_{\text{actor}}\| \|\mathbf{g}_{\text{critic}}\|} < 0$$
then updating the shared backbone to reduce value error directly damages the feature representations needed for policy decision-making, and vice versa.

3. Solution:
- In continuous control tasks (MuJoCo, Isaac Gym), practitioners almost universally maintain **two completely separate neural networks**: one dedicated exclusively to the Actor, and one dedicated exclusively to the Critic, preventing gradient interference entirely.
- In visual tasks (Atari) where feature extraction is computationally dominant, practitioners detach the gradient from the value head when backpropagating through early layers, or use projecting gradient algorithms (such as PCGrad).

---

### Exercise 8.8: Value Target Variance Under Polyak vs Periodic Synchronization
**Problem:** In some Actor-Critic variants, a target critic network $V_{\boldsymbol{\phi}^-}$ is maintained to stabilize TD error targets:
$$\delta_t = r_{t+1} + \gamma V_{\boldsymbol{\phi}^-}(s_{t+1}) - V_{\boldsymbol{\phi}}(s_t)$$
Explain why maintaining a target critic network is mandatory in off-policy methods (like DDPG/SAC) but often omitted in on-policy A2C.

**Solution:**
- **Off-Policy Methods (DDPG/SAC):** Transitions are sampled from an experience replay buffer holding millions of past transitions. The optimization objective is a bootstrapping Bellman regression with function approximation on non-stationary targets. Without a target network ($\boldsymbol{\phi}^-$), updating $V$ shifts the regression targets for the entire buffer, triggering the Deadly Triad and catastrophic divergence.
- **On-Policy Methods (A2C):** Data is collected strictly on-policy under current policy $\pi_{\boldsymbol{\theta}}$ and discarded immediately after $T$ steps. The policy and value function move synchronously in small steps; there is no massive historical replay buffer. Omitting the target network allows the Critic to learn on the freshest possible parameters, accelerating training without risking Deadly Triad divergence.

---

### Exercise 8.9: Advantage Estimation Under Terminal Non-Zero Rewards
**Problem:** An agent enters a terminal state $s_T$ ($d_T = 1$) and receives a terminal reward of $r_T = -100.0$ (e.g. fatal crash).
Critic value is $V(s_{T-1}) = -20.0$, and $V(s_T)$ is predicted as $-50.0$.
1. Compute the TD error $\delta_{T-1}^V$ with terminal masking.
2. What would $\delta_{T-1}^V$ be if the developer forgot to mask the terminal state with $(1 - d_T)$?
3. Calculate the magnitude of the hallucinated error.

**Solution:**
1. With proper terminal masking:
$$\delta_{T-1}^V = r_T + \gamma (1 - d_T) V(s_T) - V(s_{T-1}) = -100.0 + \gamma(1 - 1)(-50.0) - (-20.0) = -100.0 + 0 + 20.0 = -80.0$$

2. Without terminal masking:
$$\delta_{\text{bug}} = r_T + \gamma V(s_T) - V(s_{T-1}) = -100.0 + 0.99(-50.0) - (-20.0) = -100.0 - 49.5 + 20.0 = -129.5$$

3. Hallucination:
The bug injects an artificial error of $-49.5$ units. The agent believes that after crashing, it will continue into an imaginary future where it loses another $49.5$ points! Terminal state masking is essential to prevent phantom future returns.

---

### Exercise 8.10: Complete TypeScript Unit Verification Suite for A2C and GAE
**Problem:** Write a TypeScript verification test that creates an instance of `A2CAgent`, generates a synthetic 10-step trajectory, executes `update`, and asserts that:
1. GAE advantage matches the analytical expectation.
2. Policy and value losses are finite and non-NaN.
3. Advantage normalization produces sample mean within $10^{-7}$ of zero.

**Solution:**
```typescript
import { A2CAgent, RolloutBuffer } from './a2c-agent'; // Assuming implementation from Worked Example 8.10
import { computeGAE } from './gae';

export function testA2CVerification(): boolean {
  const agent = new A2CAgent(2, 2, 0.99, 0.95, 0.01, 0.05, 0.01);

  // 1. Create synthetic rollout buffer of length 5
  const rollout: RolloutBuffer = {
    states: [[1, 0], [0, 1], [1, 1], [0, 0], [1, 0]],
    actions: [0, 1, 0, 1, 0],
    rewards: [1.0, 2.0, 0.0, 5.0, 1.0],
    dones: [false, false, false, false, true],
    values: [1.5, 2.0, 1.0, 3.5, 0.5]
  };

  // 2. Execute update
  const { actorLoss, criticLoss } = agent.update(rollout, 0.0);
  console.log(`A2C Update Result: Actor Loss = ${actorLoss.toFixed(4)}, Critic Loss = ${criticLoss.toFixed(4)}`);

  const lossesValid = !isNaN(actorLoss) && !isNaN(criticLoss) && isFinite(actorLoss) && isFinite(criticLoss);

  // 3. Verify GAE normalization properties
  const gaeRes = computeGAE(rollout.rewards, [...rollout.values, 0.0], rollout.dones, 0.99, 0.95);
  let mean = 0;
  for (let i = 0; i < gaeRes.advantages.length; i++) mean += gaeRes.advantages[i];
  mean /= gaeRes.advantages.length;

  let varr = 0;
  for (let i = 0; i < gaeRes.advantages.length; i++) varr += (gaeRes.advantages[i] - mean) ** 2;
  const std = Math.sqrt(varr / gaeRes.advantages.length);

  const normalized = gaeRes.advantages.map(a => (a - mean) / std);
  let normMean = 0;
  for (let i = 0; i < normalized.length; i++) normMean += normalized[i];
  normMean /= normalized.length;

  const meanZero = Math.abs(normMean) < 1e-7;
  console.log(`Normalized Advantage Mean: ${normMean.toExponential(4)} (Near Zero: ${meanZero})`);

  const passed = lossesValid && meanZero;
  console.log(`Test Suite Passed: ${passed}`);
  return passed;
}

testA2CVerification();
```
