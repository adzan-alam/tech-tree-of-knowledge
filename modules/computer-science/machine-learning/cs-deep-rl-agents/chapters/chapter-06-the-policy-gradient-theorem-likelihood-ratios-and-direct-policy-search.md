# Chapter 6: The Policy Gradient Theorem: Likelihood Ratios and Direct Policy Search

---

## 6.1 The Policy Optimization Paradigm

In the preceding five chapters, our exploration of reinforcement learning was centered entirely upon the **Value-Based Paradigm**:
$$\text{Learn } Q^*(s, a) \implies \text{Derive Policy: } \pi(s) = \arg\max_{a \in \mathcal{A}} Q^*(s, a)$$

While value-based methods (DQN, Double DQN, Dueling DQN) are powerful, they suffer from deep intrinsic limitations:
1. **Inability to Represent Continuous Action Spaces:** Computing $\arg\max_{a \in \mathcal{A}} Q(s, a)$ over a discrete set of 4 or 18 Atari buttons is trivial. However, for a robotic arm with 7 continuous joints where each torque $\tau_i \in [-10.0, 10.0] \text{ N}\cdot\text{m}$, finding the global maximum of a non-convex neural network $Q(s, \mathbf{a}; \boldsymbol{\theta})$ requires solving a high-dimensional continuous optimization problem at every single millisecond—a computationally intractable task.
2. **Inability to Learn Stochastic Policies:** In environments with partial observability (POMDPs) or competitive multi-agent game-theoretic settings (such as Rock-Paper-Scissors or Poker), deterministic policies are easily exploited. An optimal agent must act stochastically (e.g., playing Rock, Paper, and Scissors with exact probabilities $\frac{1}{3}, \frac{1}{3}, \frac{1}{3}$). A deterministic greedy policy $\arg\max_a Q(s, a)$ cannot represent mixed Nash equilibria.
3. **Policy Discontinuity and Optimization Churn:** A minuscule change in network weights $\boldsymbol{\theta}$ can flip the $\arg\max$ from one action to a completely different action. This sudden discontinuous jump in the induced policy induces severe distribution shifts, destabilizing function approximation.

These challenges motivate the **Policy-Based Paradigm**: parameterizing the policy directly as a continuous, differentiable function $\pi_{\boldsymbol{\theta}}(a \mid s)$, and optimizing its parameters $\boldsymbol{\theta} \in \mathbb{R}^d$ using gradient ascent on the expected cumulative return.

```
                      VALUE-BASED VS POLICY-BASED PARADIGMS
                      
  VALUE-BASED:                                   POLICY-BASED:
  
  Parameterize Value Function:                   Parameterize Policy Directly:
        Q(s, a; θ)                                      π(a | s; θ)
            │                                               │
            ▼ argmax                                        ▼ Differentiable Mapping
  Deterministic Policy:                           Continuous or Stochastic Actions:
     a = argmax_a Q(s, a; θ)                         a ~ π(· | s; θ)
  (Non-smooth, Discontinuous)                     (Smooth, Stable Gradient Ascent)
```

### Parameterizing Stochastic Action Distributions
A parameterized policy $\pi_{\boldsymbol{\theta}}(a \mid s)$ outputs a probability distribution over actions conditioned on the environmental state:
$$\pi_{\boldsymbol{\theta}}(a \mid s) = \mathbb{P}(A_t = a \mid S_t = s; \boldsymbol{\theta})$$

Depending on the action space topology, standard distributional parameterizations include:

#### 1. Discrete Action Spaces: Categorical Softmax Policy
For discrete actions $\mathcal{A} = \{1, 2, \dots, K\}$, a neural network with parameters $\boldsymbol{\theta}$ outputs a vector of unnormalized logits $\mathbf{h}(s; \boldsymbol{\theta}) \in \mathbb{R}^K$. The action probabilities are given by the softmax function:
$$\pi_{\boldsymbol{\theta}}(a_i \mid s) = \frac{\exp(h_i(s; \boldsymbol{\theta}))}{\sum_{j=1}^K \exp(h_j(s; \boldsymbol{\theta}))}$$
This distribution is strictly positive ($\pi(a \mid s) > 0$), fully differentiable, and capable of representing any categorical distribution.

#### 2. Continuous Action Spaces: Diagonal Gaussian Policy
For continuous multi-dimensional actions $\mathbf{a} \in \mathbb{R}^m$, the policy network outputs the parameters of a multivariate Gaussian distribution:
$$\pi_{\boldsymbol{\theta}}(\mathbf{a} \mid s) = \mathcal{N}(\boldsymbol{\mu}_{\boldsymbol{\theta}}(s), \boldsymbol{\Sigma}_{\boldsymbol{\theta}}(s))$$
In standard practice, the covariance matrix is assumed to be diagonal, $\boldsymbol{\Sigma} = \text{diag}(\sigma_1^2, \dots, \sigma_m^2)$, parameterized via log-standard deviations $s_i = \log \sigma_i$ to ensure strict positivity without numerical constraints:
$$\pi_{\boldsymbol{\theta}}(\mathbf{a} \mid s) = \prod_{i=1}^m \frac{1}{\sqrt{2\pi}\sigma_i(s)} \exp\left( -\frac{(a_i - \mu_i(s))^2}{2\sigma_i(s)^2} \right)$$

---

## 6.2 Trajectory Formulations and the Expected Return Objective

Let an interaction trajectory (or episode rollout) be denoted by $\tau$:
$$\tau = (s_0, a_0, r_1, s_1, a_1, r_2, \dots, s_T, a_T, r_{T+1})$$

The total cumulative return along trajectory $\tau$ is the discounted (or undiscounted) sum of rewards:
$$R(\tau) = \sum_{t=0}^T \gamma^t r_{t+1}$$

### Probability Density of a Trajectory
The probability of observing trajectory $\tau$ under policy $\pi_{\boldsymbol{\theta}}$ and environmental transition dynamics $\mathcal{P}(s' \mid s, a)$ is given by:
$$P(\tau; \boldsymbol{\theta}) = \rho_0(s_0) \prod_{t=0}^T \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)$$
where $\rho_0(s_0)$ is the initial state distribution.

Notice the log-probability of the trajectory decomposes into an additive sum:
$$\log P(\tau; \boldsymbol{\theta}) = \log \rho_0(s_0) + \sum_{t=0}^T \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) + \sum_{t=0}^T \log \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

### The Expected Return Objective
The fundamental goal of policy search is to maximize the expected return over all possible trajectories:
$$J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim P(\tau; \boldsymbol{\theta})}[R(\tau)] = \int P(\tau; \boldsymbol{\theta}) R(\tau) d\tau$$

To optimize $J(\boldsymbol{\theta})$ via gradient ascent:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$
we must compute the gradient vector $\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$.

---

## 6.3 The Score Function Trick (Likelihood Ratios)

Computing $\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$ appears formidable at first glance:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} \int P(\tau; \boldsymbol{\theta}) R(\tau) d\tau = \int \nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta}) R(\tau) d\tau$$

We cannot directly approximate this integral with Monte Carlo sampling because the integrand contains $\nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta})$, which is **not** a valid probability distribution ($\int \nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta}) d\tau = \nabla_{\boldsymbol{\theta}} \int P(\tau; \boldsymbol{\theta}) d\tau = \nabla_{\boldsymbol{\theta}} (1) = \mathbf{0}$).

To convert this expression back into an expectation that can be sampled from $P(\tau; \boldsymbol{\theta})$, we employ the **Score Function Trick** (also known as the Likelihood Ratio Trick or REINFORCE Trick):

Recall from elementary calculus that for any differentiable function $f(x) > 0$:
$$\frac{d}{dx} \log f(x) = \frac{\nabla_x f(x)}{f(x)} \implies \nabla_x f(x) = f(x) \nabla_x \log f(x)$$

Applying this identity directly to $P(\tau; \boldsymbol{\theta})$:
$$\nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta}) = P(\tau; \boldsymbol{\theta}) \nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta})$$

```
                         THE SCORE FUNCTION TRICK
                         
          True Gradient:                 Identity:
    ∇_θ ∫ P(τ; θ) R(τ) dτ        ∇_θ P(τ; θ) = P(τ; θ) ∇_θ log P(τ; θ)
             │                                   │
             ▼                                   ▼
    ∫ [ ∇_θ P(τ; θ) ] R(τ) dτ    ════►   ∫ P(τ; θ) [ ∇_θ log P(τ; θ) R(τ) ] dτ
                                                 │
                                                 ▼
                                        E_{τ ~ P(τ; θ)} [ ∇_θ log P(τ; θ) R(τ) ]
                                        (Directly Sampleable via Monte Carlo!)
```

Substituting this identity into the gradient integral yields:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \int P(\tau; \boldsymbol{\theta}) \left( \nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) R(\tau) \right) d\tau = \mathbb{E}_{\tau \sim P(\tau; \boldsymbol{\theta})} \left[ \nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) R(\tau) \right]$$

### The Miracle of Physics Elimination
Now, observe the crucial mathematical miracle that occurs when we take the gradient of $\log P(\tau; \boldsymbol{\theta})$:
$$\log P(\tau; \boldsymbol{\theta}) = \log \rho_0(s_0) + \sum_{t=0}^T \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) + \sum_{t=0}^T \log \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

Differentiating with respect to the policy parameters $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) = \underbrace{\nabla_{\boldsymbol{\theta}} \log \rho_0(s_0)}_{\mathbf{0}} + \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) + \sum_{t=0}^T \underbrace{\nabla_{\boldsymbol{\theta}} \log \mathcal{P}(s_{t+1} \mid s_t, a_t)}_{\mathbf{0}}$$

Because neither the initial state distribution $\rho_0(s_0)$ nor the environmental physics transition dynamics $\mathcal{P}(s_{t+1} \mid s_t, a_t)$ depend on $\boldsymbol{\theta}$, their gradients are identically zero:
$$\nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) = \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t)$$

Substituting this back into the expectation:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim \pi_{\boldsymbol{\theta}}} \left[ \left( \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right) R(\tau) \right]$$

**This is a revolutionary result in reinforcement learning:**
We do **not** need to know the transition probabilities $\mathcal{P}(s' \mid s, a)$, the equations of motion, the friction coefficients, or the physics engine source code. The environmental dynamics vanish completely from the gradient!

---

## 6.4 The Policy Gradient Theorem: Step-by-Step Derivation

While the trajectory-level gradient derived above is mathematically valid, Sutton et al. (1999) established the formal **Policy Gradient Theorem**, which expresses the gradient in terms of stationary state distributions and exact state-action value functions $Q^\pi(s, a)$.

### Theorem Statement
For any differentiable policy $\pi_{\boldsymbol{\theta}}(a \mid s)$, the gradient of the expected discounted return $J(\boldsymbol{\theta}) = V^{\pi_{\boldsymbol{\theta}}}(s_0)$ is:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \sum_{s \in \mathcal{S}} d^{\pi_{\boldsymbol{\theta}}}(s) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^{\pi_{\boldsymbol{\theta}}}(s, a)$$
where $d^{\pi_{\boldsymbol{\theta}}}(s) = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s \mid s_0, \pi_{\boldsymbol{\theta}})$ is the discounted state visitation distribution.

### Rigorous Analytical Proof
Begin with the definition of the state-value function $V^\pi(s)$:
$$V^\pi(s) = \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$

Differentiating both sides with respect to $\boldsymbol{\theta}$ using the product rule:
$$\nabla_{\boldsymbol{\theta}} V^\pi(s) = \nabla_{\boldsymbol{\theta}} \left[ \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) \right] = \sum_{a \in \mathcal{A}} \left[ \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \pi_{\boldsymbol{\theta}}(a \mid s) \nabla_{\boldsymbol{\theta}} Q^\pi(s, a) \right]$$

Now expand $Q^\pi(s, a)$ using the Bellman equation:
$$Q^\pi(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) V^\pi(s')$$

Differentiating $Q^\pi(s, a)$:
$$\nabla_{\boldsymbol{\theta}} Q^\pi(s, a) = \nabla_{\boldsymbol{\theta}} \left[ \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) V^\pi(s') \right] = \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \nabla_{\boldsymbol{\theta}} V^\pi(s')$$

Substitute this back into the expression for $\nabla_{\boldsymbol{\theta}} V^\pi(s)$:
$$\nabla_{\boldsymbol{\theta}} V^\pi(s) = \sum_a \left[ \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \gamma \pi_{\boldsymbol{\theta}}(a \mid s) \sum_{s'} \mathcal{P}(s' \mid s, a) \nabla_{\boldsymbol{\theta}} V^\pi(s') \right]$$
$$= \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \gamma \sum_{s'} \left( \sum_a \pi_{\boldsymbol{\theta}}(a \mid s) \mathcal{P}(s' \mid s, a) \right) \nabla_{\boldsymbol{\theta}} V^\pi(s')$$
$$= \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \gamma \sum_{s'} \mathbb{P}(s \to s' \mid 1, \pi) \nabla_{\boldsymbol{\theta}} V^\pi(s')$$

Notice this is a recursive relation for $\nabla_{\boldsymbol{\theta}} V^\pi(s)$. Unrolling this recurrence indefinitely:
$$\nabla_{\boldsymbol{\theta}} V^\pi(s_0) = \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_0) Q^\pi(s_0, a) + \gamma \sum_{s_1} \mathbb{P}(s_0 \to s_1 \mid 1, \pi) \left[ \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_1) Q^\pi(s_1, a) + \gamma \sum_{s_2} \cdots \right]$$
$$= \sum_{t=0}^\infty \gamma^t \sum_{s \in \mathcal{S}} \mathbb{P}(S_t = s \mid s_0, \pi) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$
$$= \sum_{s \in \mathcal{S}} \left( \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s \mid s_0, \pi) \right) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$
$$= \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$

Now multiply and divide by $\pi_{\boldsymbol{\theta}}(a \mid s)$ inside the action sum:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s) \frac{\nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s)}{\pi_{\boldsymbol{\theta}}(a \mid s)} Q^\pi(s, a)$$
$$= \mathbb{E}_{s \sim d^\pi, a \sim \pi_{\boldsymbol{\theta}}} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) \right]$$
$\blacksquare$

---

## 6.5 Causality and Future-Return Conditioning (Reward-to-Go)

Recall the trajectory gradient:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \left( \sum_{k=0}^T \gamma^k r_{k+1} \right) \right]$$

Expanding the product between the sum of score functions and the sum of rewards:
$$\sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \left( \sum_{k=0}^{t-1} \gamma^k r_{k+1} + \sum_{k=t}^T \gamma^k r_{k+1} \right)$$

### The Law of Causality
Actions taken at time step $t$ cannot physically influence rewards received in the past ($k < t$):
$$\mathbb{E}_{\tau} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \right] = \mathbf{0} \quad \forall k < t$$

```
                         CAUSALITY IN TRAJECTORY RETURNS
                         
   Time:       0      1      ...     t-1     [  t  ]     t+1     ...     T
   Rewards:   r_1    r_2     ...     r_t     [r_{t+1}]  r_{t+2}  ...    r_{T+1}
              └──────────────┬─────────┘     └─────────────┬──────────────┘
                         PAST REWARDS                  FUTURE REWARDS
                      (Zero Correlation)             (Reward-to-Go G_t)
                   E[ ∇log π_t · r_past ] = 0       Causal Effect: ∇log π_t · G_t
```

### Proof of Past-Reward Zero Expectation
By the Tower Property of conditional expectation:
$$\mathbb{E}_{\tau} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \right] = \mathbb{E}_{s_{0:t}, a_{0:t-1}} \left[ \mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \mid s_{0:t}, a_{0:t-1} \right] \right]$$

Since $k+1 \le t$, reward $r_{k+1}$ is completely determined by past history $(s_{0:t}, a_{0:t-1})$. It can be factored out of the inner expectation over $a_t$:
$$\mathbb{E}_{a_t \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \mid \text{history} \right] = r_{k+1} \mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right]$$

Now compute the inner expectation:
$$\mathbb{E}_{a_t \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right] = \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \frac{\nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t)}{\pi_{\boldsymbol{\theta}}(a \mid s_t)} = \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t) = \nabla_{\boldsymbol{\theta}} \underbrace{\sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t)}_{1} = \nabla_{\boldsymbol{\theta}}(1) = \mathbf{0}$$
Thus:
$$\mathbb{E}_{\tau} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \right] = \mathbf{0} \quad \forall k < t$$

We can safely eliminate all past rewards from the objective without introducing any bias, replacing the total trajectory return $R(\tau)$ with the **Reward-to-Go** (future return) $G_t$:
$$G_t = \sum_{k=t}^T \gamma^{k-t} r_{k+1}$$

The causal policy gradient estimator becomes:
$$\mathbf{g} = \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t$$
Dropping past rewards drastically reduces the variance of the Monte Carlo gradient estimates, accelerating policy convergence by orders of magnitude.

---

## 6.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 6.1: Derivation of Softmax Policy Score Function
**Problem:** Let $\pi_{\boldsymbol{\theta}}(a_i \mid s) = \frac{\exp(\boldsymbol{\theta}_i^\top \mathbf{x}(s))}{\sum_{j=1}^K \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s))}$ be a linear softmax policy for $K$ discrete actions with state feature vector $\mathbf{x}(s) \in \mathbb{R}^d$.
1. Derive the partial derivative $\frac{\partial \log \pi_{\boldsymbol{\theta}}(a \mid s)}{\partial \boldsymbol{\theta}_k}$.
2. Show that the gradient vector is given by:
$$\nabla_{\boldsymbol{\theta}_k} \log \pi_{\boldsymbol{\theta}}(a \mid s) = (\mathbb{I}(a = k) - \pi_{\boldsymbol{\theta}}(k \mid s)) \mathbf{x}(s)$$
3. Interpret this equation in terms of probability mass shifting.

**Solution:**
1. Take the logarithm of the policy:
$$\log \pi_{\boldsymbol{\theta}}(a \mid s) = \boldsymbol{\theta}_a^\top \mathbf{x}(s) - \log \left( \sum_{j=1}^K \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s)) \right)$$
Differentiate with respect to parameter vector $\boldsymbol{\theta}_k$:
$$\frac{\partial \log \pi_{\boldsymbol{\theta}}(a \mid s)}{\partial \boldsymbol{\theta}_k} = \frac{\partial}{\partial \boldsymbol{\theta}_k} [\boldsymbol{\theta}_a^\top \mathbf{x}(s)] - \frac{1}{\sum_{j} \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s))} \frac{\partial}{\partial \boldsymbol{\theta}_k} \left[ \sum_{j=1}^K \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s)) \right]$$

2. Evaluating both terms:
- First term: $\frac{\partial}{\partial \boldsymbol{\theta}_k}[\boldsymbol{\theta}_a^\top \mathbf{x}(s)] = \mathbb{I}(a = k) \mathbf{x}(s)$.
- Second term:
  $$\frac{\partial}{\partial \boldsymbol{\theta}_k} \left[ \sum_j \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s)) \right] = \exp(\boldsymbol{\theta}_k^\top \mathbf{x}(s)) \mathbf{x}(s)$$
  Dividing by the sum of exponentials:
  $$\frac{\exp(\boldsymbol{\theta}_k^\top \mathbf{x}(s))}{\sum_j \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s))} \mathbf{x}(s) = \pi_{\boldsymbol{\theta}}(k \mid s) \mathbf{x}(s)$$
Subtracting yields:
$$\nabla_{\boldsymbol{\theta}_k} \log \pi_{\boldsymbol{\theta}}(a \mid s) = (\mathbb{I}(a = k) - \pi_{\boldsymbol{\theta}}(k \mid s)) \mathbf{x}(s)$$

3. Interpretation:
- If action $k$ was chosen ($a = k$): the gradient is $(1 - \pi(k \mid s))\mathbf{x}(s) > 0$. If the return $G_t > 0$, parameter $\boldsymbol{\theta}_k$ is pushed in direction $\mathbf{x}(s)$, increasing the probability of action $k$.
- If action $k$ was *not* chosen ($a \neq k$): the gradient is $(0 - \pi(k \mid s))\mathbf{x}(s) = -\pi(k \mid s)\mathbf{x}(s) < 0$. If $G_t > 0$, the probability of unchosen action $k$ is systematically decreased to preserve the sum of probabilities to $1$.

---

### Worked Example 6.2: Score Function of a 1D Continuous Gaussian Policy
**Problem:** A continuous policy parameterizes action $a \in \mathbb{R}$ as a Gaussian:
$$\pi_\theta(a \mid s) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{(a - \mu_\theta(s))^2}{2\sigma^2} \right)$$
where mean $\mu_\theta(s) = \theta \cdot s$, and standard deviation $\sigma$ is fixed.
1. Derive the score function $\nabla_\theta \log \pi_\theta(a \mid s)$.
2. For state $s = 2.0$, action chosen $a = 5.0$, current mean $\mu = 3.0$, and $\sigma = 1.0$, compute the score function value.
3. If the observed return is $G = +4.0$, compute the parameter update $\Delta \theta$ with learning rate $\alpha = 0.05$.

**Solution:**
1. Log-probability derivation:
$$\log \pi_\theta(a \mid s) = -\frac{1}{2}\log(2\pi) - \log \sigma - \frac{(a - \mu_\theta(s))^2}{2\sigma^2}$$
Differentiate with respect to $\theta$ using chain rule:
$$\nabla_\theta \log \pi_\theta(a \mid s) = -\frac{1}{2\sigma^2} \frac{\partial}{\partial \theta} (a - \mu_\theta(s))^2 = -\frac{1}{2\sigma^2} \cdot 2(a - \mu_\theta(s)) \cdot \left( -\frac{\partial \mu_\theta(s)}{\partial \theta} \right)$$
$$= \frac{a - \mu_\theta(s)}{\sigma^2} \nabla_\theta \mu_\theta(s)$$
Since $\mu_\theta(s) = \theta \cdot s$, $\nabla_\theta \mu_\theta(s) = s$:
$$\nabla_\theta \log \pi_\theta(a \mid s) = \frac{a - \mu_\theta(s)}{\sigma^2} s$$

2. Numerical evaluation:
$$\nabla_\theta \log \pi = \frac{5.0 - 3.0}{1.0^2} \times 2.0 = \frac{2.0}{1.0} \times 2.0 = 4.0$$

3. Parameter update:
$$\Delta \theta = \alpha \cdot \nabla_\theta \log \pi \cdot G = 0.05 \times 4.0 \times 4.0 = 0.80$$
New mean at $s=2.0$ will increase: $\Delta \mu = \Delta \theta \cdot s = 0.80 \times 2.0 = +1.60$, pulling the distribution mean from $3.0$ toward the successful action $a = 5.0$.

---

### Worked Example 6.3: Vanishing Dynamics in a 2-State MDP
**Problem:** An agent operates in a 2-state MDP: $s_0 \to s_1 \to s_{\text{terminal}}$.
At $s_0$, action $a_1$ transitions to $s_1$ with environment probability $p = 0.7$, and to $s_{\text{terminal}}$ with probability $1-p = 0.3$.
Policy $\pi_\theta(a_1 \mid s_0) = \theta \in (0, 1)$.
Reward $r = +10$ on reaching $s_{\text{terminal}}$, 0 otherwise.
1. Write the trajectory distribution $P(\tau; \theta)$ for successful trajectory $\tau = (s_0, a_1, 0, s_1, a_1, 10, s_{\text{terminal}})$.
2. Verify explicitly that $\nabla_\theta \log P(\tau; \theta)$ has zero dependence on environment transition probability $p$.

**Solution:**
1. Trajectory probability:
$$P(\tau; \theta) = \rho_0(s_0) \cdot \pi_\theta(a_1 \mid s_0) \cdot \mathcal{P}(s_1 \mid s_0, a_1) \cdot \pi_\theta(a_1 \mid s_1) \cdot \mathcal{P}(s_{\text{term}} \mid s_1, a_1)$$
$$= 1.0 \times \theta \times p \times \theta \times 1.0 = p \theta^2$$

2. Log-probability:
$$\log P(\tau; \theta) = \log(p \theta^2) = \log p + 2 \log \theta$$
Differentiating with respect to $\theta$:
$$\nabla_\theta \log P(\tau; \theta) = \frac{d}{d\theta} [\log p + 2 \log \theta] = 0 + \frac{2}{\theta} = \frac{2}{\theta}$$
The term $\log p$ vanishes completely because $\frac{d}{d\theta}[\log p] = 0$. The gradient depends purely on policy parameter $\theta$ and is completely agnostic to environmental probability $p$.

---

### Worked Example 6.4: Score Function Expectation Identity Proof
**Problem:** Prove the fundamental score function expectation lemma: for any parameterized probability distribution $p_\theta(x)$,
$$\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \mathbf{0}$$

**Solution:**
Expand the expectation as an integral:
$$\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \int p_\theta(x) \nabla_\theta \log p_\theta(x) dx$$
Using the identity $\nabla_\theta \log p_\theta(x) = \frac{\nabla_\theta p_\theta(x)}{p_\theta(x)}$:
$$\int p_\theta(x) \left( \frac{\nabla_\theta p_\theta(x)}{p_\theta(x)} \right) dx = \int \nabla_\theta p_\theta(x) dx$$
Assuming standard regularity conditions (the Leibniz integral rule applies, permitting the interchange of derivative and integral):
$$\int \nabla_\theta p_\theta(x) dx = \nabla_\theta \int p_\theta(x) dx$$
Since $p_\theta(x)$ is a valid probability density for all $\theta$, its integral over the support is identically $1$:
$$\int p_\theta(x) dx = 1 \quad \forall \theta$$
Therefore:
$$\nabla_\theta (1) = \mathbf{0}$$
Hence, $\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \mathbf{0}$. $\blacksquare$

---

### Worked Example 6.5: Analytical Policy Gradient in a Multi-Armed Bandit
**Problem:** A 2-armed bandit has payoffs $R(a_1) = 2.0$ and $R(a_2) = 1.0$.
Actions are selected via softmax policy with scalar parameter $\theta$:
$$\pi_\theta(a_1) = \frac{e^\theta}{e^\theta + e^{-\theta}} = \sigma(2\theta), \quad \pi_\theta(a_2) = 1 - \pi_\theta(a_1) = \frac{e^{-\theta}}{e^\theta + e^{-\theta}}$$
1. Express expected return $J(\theta)$ analytically as a function of $\theta$.
2. Compute the exact analytical derivative $\frac{dJ}{d\theta}$.
3. Show that $\frac{dJ}{d\theta} = \mathbb{E}_{a \sim \pi}[\nabla_\theta \log \pi_\theta(a) R(a)]$.

**Solution:**
1. Expected return:
$$J(\theta) = \pi_\theta(a_1) R(a_1) + \pi_\theta(a_2) R(a_2) = 2.0 \cdot \sigma(2\theta) + 1.0 \cdot (1 - \sigma(2\theta)) = 1.0 + \sigma(2\theta)$$

2. Exact analytical derivative:
Recall that $\sigma'(z) = \sigma(z)(1 - \sigma(z))$.
$$\frac{dJ}{d\theta} = \frac{d}{d\theta}[1.0 + \sigma(2\theta)] = 2 \sigma(2\theta)(1 - \sigma(2\theta)) = 2 \pi_\theta(a_1) \pi_\theta(a_2)$$

3. Policy Gradient Theorem calculation:
- For $a_1$: $\log \pi(a_1) = \theta - \log(e^\theta + e^{-\theta})$.
  $$\frac{d \log \pi(a_1)}{d\theta} = 1 - \frac{e^\theta - e^{-\theta}}{e^\theta + e^{-\theta}} = 1 - (\pi(a_1) - \pi(a_2)) = 1 - \pi(a_1) + \pi(a_2) = 2 \pi(a_2)$$
- For $a_2$: $\log \pi(a_2) = -\theta - \log(e^\theta + e^{-\theta})$.
  $$\frac{d \log \pi(a_2)}{d\theta} = -1 - (\pi(a_1) - \pi(a_2)) = -2 \pi(a_1)$$
Now compute the expectation:
$$\mathbb{E}_{a \sim \pi}\left[\frac{d \log \pi(a)}{d\theta} R(a)\right] = \pi(a_1) [2 \pi(a_2) \cdot 2.0] + \pi(a_2) [-2 \pi(a_1) \cdot 1.0]$$
$$= 4 \pi(a_1)\pi(a_2) - 2 \pi(a_1)\pi(a_2) = 2 \pi(a_1)\pi(a_2)$$
The expectation derived via the score function trick matches the true analytical derivative $\frac{dJ}{d\theta}$ with 100% mathematical precision.

---

### Worked Example 6.6: Variance Comparison: Full Trajectory Return vs Reward-to-Go
**Problem:** Consider a 2-step trajectory where actions $a_0, a_1$ are taken, generating rewards $r_1, r_2$.
Suppose $r_1$ and $r_2$ are independent random variables with $\mathbb{V}[r_1] = 9.0$ and $\mathbb{V}[r_2] = 16.0$.
Assume score function $\nabla \log \pi_0$ is independent of rewards and has unit variance $\mathbb{V}[\nabla \log \pi_0] = 1.0$, with mean 0.
1. Compute the variance of the gradient estimator for step $t=0$ using the full return $R(\tau) = r_1 + r_2$.
2. Compute the variance using Reward-to-Go $G_0 = r_1 + r_2$.
3. Compute the variance of the gradient estimator for step $t=1$ using full return $R(\tau)$ vs Reward-to-Go $G_1 = r_2$.

**Solution:**
1. For step $t=0$:
Reward-to-Go $G_0 = r_1 + r_2 = R(\tau)$. Both estimators are identical at $t=0$:
$$\mathbb{V}[\nabla \log \pi_0 \cdot (r_1 + r_2)] = \mathbb{E}[(\nabla \log \pi_0)^2] \mathbb{E}[(r_1 + r_2)^2] = 1.0 \times (9.0 + 16.0) = 25.0$$

2. For step $t=1$:
- Full Return Estimator: $g_{\text{full}} = \nabla \log \pi_1 \cdot (r_1 + r_2)$.
  $$\mathbb{V}[g_{\text{full}}] = \mathbb{V}[\nabla \log \pi_1] \cdot (\mathbb{V}[r_1] + \mathbb{V}[r_2]) = 1.0 \times (9.0 + 16.0) = 25.0$$
- Reward-to-Go Estimator: $g_{\text{rtg}} = \nabla \log \pi_1 \cdot r_2$.
  $$\mathbb{V}[g_{\text{rtg}}] = \mathbb{V}[\nabla \log \pi_1] \cdot \mathbb{V}[r_2] = 1.0 \times 16.0 = 16.0$$

3. Comparison:
At step $t=1$, eliminating the past reward $r_1$ reduces the estimator variance from $25.0$ down to $16.0$—a **$36\%$ variance reduction** without introducing any bias. In trajectories of length $T=1000$, Reward-to-Go reduces variance by over $99\%$.

---

### Worked Example 6.7: Numerical Policy Gradient Step on CartPole Action Logits
**Problem:** An agent in CartPole has state $s = [0.05, 0.20, -0.03, -0.10]^\top$ (cart position, velocity, pole angle, pole tip velocity).
Policy has 2 actions: $a_0 = \text{Left}, a_1 = \text{Right}$.
Parameters are linear weights $\mathbf{W} \in \mathbb{R}^{2 \times 4}$:
$$\mathbf{W}_0 = [0.1, -0.2, 0.5, 0.3], \quad \mathbf{W}_1 = [-0.1, 0.2, -0.5, -0.3]$$
1. Compute the logits $h_0 = \mathbf{W}_0 s$ and $h_1 = \mathbf{W}_1 s$.
2. Compute the action probabilities $\pi(a_0 \mid s)$ and $\pi(a_1 \mid s)$.
3. Suppose action $a_1$ was executed, and achieved Reward-to-Go $G = +15.0$. Compute the gradient vector $\nabla_{\mathbf{W}_1} \log \pi(a_1 \mid s)$ and the parameter update $\Delta \mathbf{W}_1$ with $\alpha = 0.01$.

**Solution:**
1. Logits calculation:
$$h_0 = 0.1(0.05) + (-0.2)(0.20) + 0.5(-0.03) + 0.3(-0.10) = 0.005 - 0.040 - 0.015 - 0.030 = -0.080$$
$$h_1 = -0.1(0.05) + 0.2(0.20) + (-0.5)(-0.03) + (-0.3)(-0.10) = -0.005 + 0.040 + 0.015 + 0.030 = +0.080$$

2. Probabilities via Softmax:
$$\exp(h_0) = e^{-0.080} \approx 0.9231$$
$$\exp(h_1) = e^{+0.080} \approx 1.0833$$
$$\text{Sum} = 0.9231 + 1.0833 = 2.0064$$
$$\pi(a_0 \mid s) = \frac{0.9231}{2.0064} \approx 0.4601$$
$$\pi(a_1 \mid s) = \frac{1.0833}{2.0064} \approx 0.5399$$

3. Gradient and Update:
For chosen action $a_1$, from Worked Example 6.1:
$$\nabla_{\mathbf{W}_1} \log \pi(a_1 \mid s) = (1 - \pi(a_1 \mid s)) s = (1 - 0.5399) s = 0.4601 \times \begin{bmatrix} 0.05 \\ 0.20 \\ -0.03 \\ -0.10 \end{bmatrix} = \begin{bmatrix} 0.0230 \\ 0.0920 \\ -0.0138 \\ -0.0460 \end{bmatrix}$$
Parameter update with $\alpha = 0.01$ and $G = 15.0$:
$$\Delta \mathbf{W}_1 = \alpha \cdot G \cdot \nabla_{\mathbf{W}_1} \log \pi = 0.01 \times 15.0 \times \begin{bmatrix} 0.0230 \\ 0.0920 \\ -0.0138 \\ -0.0460 \end{bmatrix} = 0.15 \times \begin{bmatrix} 0.0230 \\ 0.0920 \\ -0.0138 \\ -0.0460 \end{bmatrix} = \begin{bmatrix} 0.00345 \\ 0.01380 \\ -0.00207 \\ -0.00690 \end{bmatrix}$$

---

### Worked Example 6.8: Gaussian Policy Log-Std Gradient Derivation
**Problem:** Let $\pi(a \mid s) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left(-\frac{(a - \mu)^2}{2\sigma^2}\right)$. Let the policy parameterize the log-standard deviation directly: $\omega = \log \sigma \implies \sigma = e^\omega$.
1. Derive the partial derivative $\frac{\partial \log \pi(a \mid s)}{\partial \omega}$.
2. If action $a$ was sampled very close to mean $\mu$ ($|a - \mu| < \sigma$), what is the sign of the gradient $\frac{\partial \log \pi}{\partial \omega}$?
3. What is the behavioral consequence of updating $\omega$ when returns are positive?

**Solution:**
1. Express log-probability in terms of $\omega$:
$$\log \pi(a \mid s) = -\frac{1}{2}\log(2\pi) - \omega - \frac{(a - \mu)^2}{2 e^{2\omega}}$$
Differentiate with respect to $\omega$:
$$\frac{\partial \log \pi}{\partial \omega} = -1 - \frac{(a - \mu)^2}{2} \cdot (-2 e^{-2\omega}) = -1 + \frac{(a - \mu)^2}{e^{2\omega}} = \frac{(a - \mu)^2}{\sigma^2} - 1$$

2. Sign analysis:
If $|a - \mu| < \sigma$, then $\frac{(a - \mu)^2}{\sigma^2} < 1$.
$$\frac{\partial \log \pi}{\partial \omega} = \frac{(a - \mu)^2}{\sigma^2} - 1 < 0$$
The gradient with respect to $\omega$ is **strictly negative**.

3. Behavioral consequence:
If an action near the mean achieves high positive return $G_t > 0$, the update is $\Delta \omega \propto \text{negative} \times \text{positive} < 0$.
The log-std $\omega$ decreases, shrinking $\sigma$. This narrows the Gaussian bell curve around the successful mean, reducing exploration and consolidating the agent's behavior around the winning action!

---

### Worked Example 6.9: Trajectory-Level Monte Carlo Gradient TypeScript Implementation
**Problem:** Author a TypeScript function `computeTrajectoryPolicyGradients` that takes an array of state transitions along an episode, computes the Reward-to-Go $G_t$ for each step with discount $\gamma$, calculates the softmax policy gradients, and returns the accumulated weight updates.

**Solution:**
```typescript
export interface TrajectoryStep {
  state: number[];
  action: number; // Discrete action index (0 to K-1)
  reward: number;
}

export function computeTrajectoryPolicyGradients(
  trajectory: TrajectoryStep[],
  numActions: number,
  stateDim: number,
  weights: number[][], // K x stateDim
  gamma: number = 0.99
): number[][] {
  const T = trajectory.length;
  // 1. Compute Reward-to-Go G_t backward in time: G_t = r_{t+1} + gamma * G_{t+1}
  const returns = new Float64Array(T);
  let runningReturn = 0;
  for (let t = T - 1; t >= 0; t--) {
    runningReturn = trajectory[t].reward + gamma * runningReturn;
    returns[t] = runningReturn;
  }

  // Initialize gradient accumulator matrix (K x stateDim)
  const gradAcc: number[][] = Array.from({ length: numActions }, () => new Array(stateDim).fill(0));

  // 2. Accumulate policy gradients
  for (let t = 0; t < T; t++) {
    const step = trajectory[t];
    const G_t = returns[t];

    // Compute softmax probabilities
    const logits = new Float64Array(numActions);
    let maxLogit = -Infinity;
    for (let a = 0; a < numActions; a++) {
      let dot = 0;
      for (let d = 0; d < stateDim; d++) dot += weights[a][d] * step.state[d];
      logits[a] = dot;
      if (dot > maxLogit) maxLogit = dot;
    }

    let sumExp = 0;
    const probs = new Float64Array(numActions);
    for (let a = 0; a < numActions; a++) {
      probs[a] = Math.exp(logits[a] - maxLogit);
      sumExp += probs[a];
    }
    for (let a = 0; a < numActions; a++) probs[a] /= sumExp;

    // Score function: grad_{W_a} log pi = (I(a == action) - pi(a)) * state
    for (let a = 0; a < numActions; a++) {
      const indicator = a === step.action ? 1.0 : 0.0;
      const factor = (indicator - probs[a]) * G_t;
      for (let d = 0; d < stateDim; d++) {
        gradAcc[a][d] += factor * step.state[d];
      }
    }
  }

  return gradAcc;
}
```

---

### Worked Example 6.10: Complete Verification of On-Policy Expectation Equivalence
**Problem:** Consider a 1-state MDP with 2 actions: $a_1$ gives reward $R_1$, $a_2$ gives reward $R_2$.
Policy probability $\pi(a_1) = p$, $\pi(a_2) = 1-p$.
Show that the Monte Carlo sample mean of the gradient over $M$ independent trials converges almost surely to the true analytical gradient $\nabla_p J = R_1 - R_2$ as $M \to \infty$.

**Solution:**
Objective:
$$J(p) = p R_1 + (1 - p) R_2 \implies \nabla_p J(p) = R_1 - R_2$$
Score functions:
$$\nabla_p \log \pi(a_1) = \frac{1}{p}, \quad \nabla_p \log \pi(a_2) = -\frac{1}{1 - p}$$
Let $A_1, \dots, A_M$ be $M$ independent action draws from policy $\pi$.
The empirical Monte Carlo estimator is:
$$\hat{g}_M = \frac{1}{M}\sum_{i=1}^M \nabla_p \log \pi(A_i) R(A_i)$$
Let $M_1$ be the number of times $a_1$ was drawn, and $M_2 = M - M_1$ be the number of times $a_2$ was drawn.
$$\hat{g}_M = \frac{1}{M}\left[ M_1 \left( \frac{1}{p} R_1 \right) + M_2 \left( -\frac{1}{1 - p} R_2 \right) \right] = \left( \frac{M_1}{M} \frac{1}{p} \right) R_1 - \left( \frac{M_2}{M} \frac{1}{1 - p} \right) R_2$$
By the Strong Law of Large Numbers (SLLN):
$$\lim_{M \to \infty} \frac{M_1}{M} \overset{\text{a.s.}}{=} p, \quad \lim_{M \to \infty} \frac{M_2}{M} \overset{\text{a.s.}}{=} 1 - p$$
Substituting these limits:
$$\lim_{M \to \infty} \hat{g}_M \overset{\text{a.s.}}{=} \left( \frac{p}{p} \right) R_1 - \left( \frac{1 - p}{1 - p} \right) R_2 = R_1 - R_2 = \nabla_p J(p)$$
The sample average converges directly and rigorously to the true analytical gradient.

---

## 6.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 6.1: Score Function of Dirichlet Policy for Simplex Actions
**Problem:** In portfolio allocation or resource management, action $\mathbf{a} \in \mathbb{R}^K$ lies on the probability simplex ($\sum_i a_i = 1, a_i > 0$).
The action distribution is a Dirichlet distribution parameterized by concentration parameters $\boldsymbol{\alpha} = (\alpha_1, \dots, \alpha_K)$:
$$p(\mathbf{a}; \boldsymbol{\alpha}) = \frac{1}{\text{B}(\boldsymbol{\alpha})} \prod_{i=1}^K a_i^{\alpha_i - 1}$$
where $\text{B}(\boldsymbol{\alpha}) = \frac{\prod_{i=1}^K \Gamma(\alpha_i)}{\Gamma(\sum_{i=1}^K \alpha_i)}$.
Derive the score function $\nabla_{\alpha_k} \log p(\mathbf{a}; \boldsymbol{\alpha})$ in terms of the digamma function $\psi(x) = \frac{d}{dx} \log \Gamma(x)$.

**Solution:**
Take the natural logarithm of the density:
$$\log p(\mathbf{a}; \boldsymbol{\alpha}) = -\log \text{B}(\boldsymbol{\alpha}) + \sum_{i=1}^K (\alpha_i - 1) \log a_i$$
$$= \log \Gamma\left(\sum_{i=1}^K \alpha_i\right) - \sum_{i=1}^K \log \Gamma(\alpha_i) + \sum_{i=1}^K (\alpha_i - 1) \log a_i$$
Differentiating with respect to $\alpha_k$:
$$\frac{\partial \log p(\mathbf{a}; \boldsymbol{\alpha})}{\partial \alpha_k} = \psi\left(\sum_{i=1}^K \alpha_i\right) - \psi(\alpha_k) + \log a_k$$
This provides the exact, closed-form score function for training Dirichlet policies on bounded resource allocation simplices.

---

### Exercise 6.2: Fisher Information Matrix and Natural Policy Gradient
**Problem:** The Fisher Information Matrix (FIM) of policy $\pi_{\boldsymbol{\theta}}$ is defined as:
$$\mathbf{F}(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^\pi, a \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s)^\top \right]$$
1. Prove that $\mathbf{F}(\boldsymbol{\theta})$ is positive semi-definite.
2. Define the Natural Policy Gradient update direction $\tilde{\nabla}_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$.
3. Why does the Natural Policy Gradient provide invariance to parameter coordinate transformations?

**Solution:**
1. Let $\mathbf{z} \in \mathbb{R}^d$ be an arbitrary non-zero vector.
$$\mathbf{z}^\top \mathbf{F}(\boldsymbol{\theta}) \mathbf{z} = \mathbf{z}^\top \mathbb{E}\left[ \nabla \log \pi \nabla \log \pi^\top \right] \mathbf{z} = \mathbb{E}\left[ \mathbf{z}^\top \nabla \log \pi \nabla \log \pi^\top \mathbf{z} \right] = \mathbb{E}\left[ (\mathbf{z}^\top \nabla \log \pi)^2 \right]$$
Since the square of any real scalar is non-negative: $(\mathbf{z}^\top \nabla \log \pi)^2 \ge 0$.
The expectation of a non-negative quantity is non-negative: $\mathbf{z}^\top \mathbf{F} \mathbf{z} \ge 0$.
Hence, $\mathbf{F}(\boldsymbol{\theta})$ is positive semi-definite.

2. The Natural Policy Gradient (Kakade, 2001) is defined by pre-multiplying the vanilla policy gradient by the inverse Fisher matrix:
$$\tilde{\nabla}_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbf{F}(\boldsymbol{\theta})^{-1} \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$

3. Invariance:
Standard gradient descent depends on the Euclidean geometry of the arbitrary parameter coordinates $\boldsymbol{\theta}$.
The Natural Policy Gradient defines the steepest ascent direction on the Riemannian manifold of probability distributions endowed with the Fisher-Rao metric (equivalent to infinitesimal KL-divergence steps: $D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta} + \Delta \boldsymbol{\theta}}) \le \epsilon$). It ensures that policy updates are invariant to arbitrary reparameterizations of the neural network.

---

### Exercise 6.3: Continuous Action Beta Distribution Policy
**Problem:** In continuous control with bounded actions $a \in [0, 1]$, Gaussian policies suffer from boundary truncation issues. A Beta distribution $\text{Beta}(\alpha, \beta)$ naturally constrains actions to $[0, 1]$:
$$p(a; \alpha, \beta) = \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)} a^{\alpha - 1} (1 - a)^{\beta - 1}$$
Derive the score function vector $\nabla_{[\alpha, \beta]^\top} \log p(a; \alpha, \beta)$.

**Solution:**
Log-density:
$$\log p(a; \alpha, \beta) = \log \Gamma(\alpha + \beta) - \log \Gamma(\alpha) - \log \Gamma(\beta) + (\alpha - 1)\log a + (\beta - 1)\log(1 - a)$$
Partial derivative with respect to $\alpha$:
$$\frac{\partial \log p}{\partial \alpha} = \psi(\alpha + \beta) - \psi(\alpha) + \log a$$
Partial derivative with respect to $\beta$:
$$\frac{\partial \log p}{\partial \beta} = \psi(\alpha + \beta) - \psi(\beta) + \log(1 - a)$$
Gradient vector:
$$\nabla_{[\alpha, \beta]^\top} \log p = \begin{bmatrix}
\psi(\alpha + \beta) - \psi(\alpha) + \log a \\
\psi(\alpha + \beta) - \psi(\beta) + \log(1 - a)
\end{bmatrix}$$

---

### Exercise 6.4: Constant Baseline Proof
**Problem:** Let $b \in \mathbb{R}$ be an arbitrary scalar constant that does not depend on state or action.
Prove analytically that subtracting $b$ from the return in the Policy Gradient Theorem introduces zero bias:
$$\mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) (G_t - b) \right] = \mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t \right]$$

**Solution:**
By linearity of expectation:
$$\mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla \log \pi_t (G_t - b) \right] = \mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla \log \pi_t G_t \right] - b \sum_{t=0}^T \mathbb{E}_{\tau} \left[ \nabla \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right]$$
Using the Tower Property:
$$\mathbb{E}_{\tau}[\nabla \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t)] = \mathbb{E}_{s_t \sim d^\pi} \left[ \mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} [\nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \mid s_t] \right]$$
From Worked Example 6.4, the inner expectation is identically zero:
$$\mathbb{E}_{a_t \sim \pi} [\nabla \log \pi(a_t \mid s_t) \mid s_t] = \mathbf{0}$$
Therefore:
$$b \sum_{t=0}^T \mathbf{0} = \mathbf{0}$$
Subtracting constant $b$ leaves the expectation completely untouched.

---

### Exercise 6.5: Optimal Constant Baseline Derivation
**Problem:** Let the gradient estimator with scalar baseline $b$ be $\hat{\mathbf{g}}(b) = \sum_{t} \mathbf{g}_t (G_t - b)$, where $\mathbf{g}_t = \nabla \log \pi(a_t \mid s_t)$.
Find the exact scalar value $b^*$ that minimizes the variance $\mathbb{V}[\hat{\mathbf{g}}(b)] = \mathbb{E}[\|\hat{\mathbf{g}}(b) - \mathbf{g}^*\|_2^2]$.

**Solution:**
Since the expectation is independent of $b$, minimizing the variance is equivalent to minimizing the second moment:
$$f(b) = \mathbb{E}\left[ \left\| \sum_t \mathbf{g}_t (G_t - b) \right\|_2^2 \right]$$
For simplicity, consider a 1-step MDP: $\hat{\mathbf{g}} = \mathbf{g}(G - b)$.
$$f(b) = \mathbb{E}\left[ \|\mathbf{g}\|^2 (G - b)^2 \right] = \mathbb{E}[\|\mathbf{g}\|^2 G^2] - 2b \mathbb{E}[\|\mathbf{g}\|^2 G] + b^2 \mathbb{E}[\|\mathbf{g}\|^2]$$
Differentiating with respect to $b$ and setting to zero:
$$f'(b) = -2 \mathbb{E}[\|\mathbf{g}\|^2 G] + 2b \mathbb{E}[\|\mathbf{g}\|^2] = 0$$
$$b^* = \frac{\mathbb{E}\left[ \|\nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s)\|^2 G \right]}{\mathbb{E}\left[ \|\nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s)\|^2 \right]}$$
The optimal baseline is a return expectation weighted by the squared magnitude of the policy gradient score!

---

### Exercise 6.6: Off-Policy Policy Gradient and Importance Weight Product
**Problem:** Suppose trajectories $\tau$ are generated by a fixed behavioral policy $\mu(a \mid s)$, but we wish to estimate the policy gradient of target policy $\pi_{\boldsymbol{\theta}}$.
1. Write the importance sampling ratio $\rho(\tau)$ for trajectory $\tau = (s_0, a_0, \dots, s_T)$.
2. Formulate the off-policy policy gradient estimator.
3. Why does the variance of $\rho(\tau)$ explode exponentially with trajectory length $T$?

**Solution:**
1. Trajectory importance weight:
$$\rho(\tau) = \frac{P(\tau; \pi_{\boldsymbol{\theta}})}{P(\tau; \mu)} = \frac{\rho_0(s_0) \prod_{t=0}^T \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)}{\rho_0(s_0) \prod_{t=0}^T \mu(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)} = \prod_{t=0}^T \frac{\pi_{\boldsymbol{\theta}}(a_t \mid s_t)}{\mu(a_t \mid s_t)}$$
Environmental dynamics cancel out.

2. Off-policy gradient estimator:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim \mu} \left[ \left(\prod_{k=0}^T \frac{\pi_{\boldsymbol{\theta}}(a_k \mid s_k)}{\mu(a_k \mid s_k)}\right) \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t \right]$$

3. Variance explosion:
The importance ratio is a product of $T$ independent terms: $\rho(\tau) = \prod_{t=0}^T w_t$.
The variance of a product of independent random variables scales as:
$$\mathbb{V}\left[\prod_{t=0}^T w_t\right] = \prod_{t=0}^T (\mathbb{V}[w_t] + 1) - 1 \sim \mathcal{O}(c^T) \quad \text{for } c > 1$$
As trajectory length $T$ grows, the variance explodes exponentially. Almost all sampled trajectories have weight near zero, while a single rare trajectory has a catastrophic weight, causing the estimator to diverge.

---

### Exercise 6.7: Reparameterization Trick vs Score Function Estimator
**Problem:** For continuous actions $a \sim \mathcal{N}(\mu_\theta, \sigma^2)$, we can estimate $\nabla_\theta \mathbb{E}[f(a)]$ via:
- Method 1 (Score Function / REINFORCE): $\mathbb{E}_{a \sim \pi}[\nabla_\theta \log \pi_\theta(a) f(a)]$.
- Method 2 (Pathwise Derivative / Reparameterization): $a = \mu_\theta + \sigma \epsilon$ where $\epsilon \sim \mathcal{N}(0, 1)$, yielding $\mathbb{E}_{\epsilon}[\nabla_a f(a) \nabla_\theta a]$.
Compare both methods in terms of variance and requirements on function $f$.

**Solution:**
1. **Requirements on $f$:**
- Score Function: Requires only that $f(a)$ can be evaluated as a black-box scalar. $f$ does not need to be differentiable, continuous, or even known analytically (can be an external physical simulator or game engine).
- Pathwise Derivative: Requires $f(a)$ to be explicitly differentiable with respect to $a$, and requires access to $\nabla_a f(a)$.

2. **Variance:**
- The Score Function estimator treats $f(a)$ as a scalar weight multiplying $\nabla \log \pi$. It suffers from high variance because it does not know *which direction* in action space would increase $f$.
- The Pathwise Derivative directly propagates the gradient vector $\nabla_a f(a)$ through the action. In continuous control, the reparameterization trick exhibits orders of magnitude lower variance and is the foundation of modern algorithms like DDPG, SAC, and VAEs.

---

### Exercise 6.8: Deterministic Policy Gradient Theorem Equivalence
**Problem:** Silver et al. (2014) proved the Deterministic Policy Gradient (DPG) Theorem for deterministic policy $a = \mu_\theta(s)$:
$$\nabla_\theta J(\theta) = \mathbb{E}_{s \sim d^\mu} \left[ \nabla_\theta \mu_\theta(s) \nabla_a Q^\mu(s, a) \big|_{a = \mu_\theta(s)} \right]$$
Show that as the variance of a Gaussian stochastic policy $\pi_{\theta, \sigma} = \mathcal{N}(\mu_\theta(s), \sigma^2 \mathbf{I})$ approaches zero ($\sigma \to 0$), the stochastic policy gradient converges to the deterministic policy gradient.

**Solution:**
From the Policy Gradient Theorem:
$$\nabla_\theta J = \int d^\pi(s) \int \nabla_\theta \pi_{\theta, \sigma}(a \mid s) Q^\pi(s, a) da ds$$
Using the identity $\nabla_\theta \pi = \nabla_a \pi \cdot \left(-\nabla_\theta \mu_\theta(s)\right)$ for a Gaussian density $p(a - \mu_\theta)$:
$$\int \nabla_\theta \pi(a \mid s) Q(s, a) da = -\nabla_\theta \mu_\theta(s) \int \nabla_a \pi(a \mid s) Q(s, a) da$$
Integrating by parts with respect to $a$:
$$-\nabla_\theta \mu_\theta(s) \left[ \pi(a \mid s) Q(s, a) \Big|_{-\infty}^\infty - \int \pi(a \mid s) \nabla_a Q(s, a) da \right] = \nabla_\theta \mu_\theta(s) \int \pi(a \mid s) \nabla_a Q(s, a) da$$
Now take the limit as variance $\sigma \to 0$. The Gaussian distribution $\pi(a \mid s)$ converges to the Dirac delta distribution $\delta(a - \mu_\theta(s))$:
$$\lim_{\sigma \to 0} \int \pi(a \mid s) \nabla_a Q(s, a) da = \nabla_a Q(s, a) \Big|_{a = \mu_\theta(s)}$$
Substituting back yields:
$$\lim_{\sigma \to 0} \nabla_\theta J(\theta) = \mathbb{E}_{s \sim d^\mu} \left[ \nabla_\theta \mu_\theta(s) \nabla_a Q(s, a) \big|_{a = \mu_\theta(s)} \right]$$
The stochastic policy gradient smoothly degenerates into the deterministic policy gradient.

---

### Exercise 6.9: Multi-Agent Matrix Game Policy Gradient Dynamics
**Problem:** In the zero-sum game Matching Pennies, Player 1 chooses action with probability $p = \sigma(\theta_1)$, and Player 2 chooses action with probability $q = \sigma(\theta_2)$.
The payoff matrix for Player 1 is:
$$R_1(a_1, a_1) = +1, \quad R_1(a_1, a_2) = -1, \quad R_1(a_2, a_1) = -1, \quad R_1(a_2, a_2) = +1$$
1. Express expected payoff $J_1(p, q)$ as a bilinear form in $p$ and $q$.
2. Compute the policy gradients $\frac{\partial J_1}{\partial p}$ and $\frac{\partial J_2}{\partial q}$ (where $J_2 = -J_1$).
3. Show that independent policy gradient ascent yields non-convergent, circular orbits in probability space.

**Solution:**
1. Expected payoff:
$$J_1(p, q) = p q (+1) + p(1-q)(-1) + (1-p)q(-1) + (1-p)(1-q)(+1)$$
$$= pq - p + pq - q + pq + 1 - p - q + pq = 4pq - 2p - 2q + 1 = (2p - 1)(2q - 1)$$

2. Payoff gradients:
- For Player 1: $\frac{\partial J_1}{\partial p} = 2(2q - 1) = 4q - 2$.
- For Player 2: Player 2 minimizes $J_1 \implies$ maximizes $J_2 = -J_1 = -(2p-1)(2q-1)$.
  $$\frac{\partial J_2}{\partial q} = -2(2p - 1) = 2 - 4p$$

3. Dynamical system:
Continuous-time gradient dynamics:
$$\dot{p} = 4q - 2, \quad \dot{q} = 2 - 4p$$
Let $x = p - 0.5$ and $y = q - 0.5$:
$$\dot{x} = 4y, \quad \dot{y} = -4x$$
Differentiating again:
$$\ddot{x} = 4\dot{y} = 4(-4x) = -16x \implies \ddot{x} + 16x = 0$$
This is the differential equation of a **harmonic oscillator**!
The trajectory traces concentric closed circles in state space: $x(t)^2 + y(t)^2 = C$. The policies continuously circle the Nash equilibrium $(0.5, 0.5)$ without ever converging to it.

---

### Exercise 6.10: Complete TypeScript Implementation of Continuous Gaussian Policy Gradient
**Problem:** Write a production-grade TypeScript class `GaussianPolicy` that implements:
1. Continuous forward pass predicting mean $\mu(s)$ and log-std $\omega = \log \sigma$.
2. Sampling via Box-Muller transform.
3. Analytical score function evaluation $\nabla_{\boldsymbol{\theta}} \log \pi(a \mid s)$.
4. Gradient ascent update step with Reward-to-Go.

**Solution:**
```typescript
export class GaussianPolicy {
  public weightsMu: number[]; // Dimension: stateDim
  public biasMu: number = 0;
  public logStd: number = 0; // Scalar log-std

  constructor(public readonly stateDim: number) {
    this.weightsMu = new Array(stateDim).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }

  // Predict distribution mean
  predictMean(state: number[]): number {
    let mean = this.biasMu;
    for (let i = 0; i < this.stateDim; i++) {
      mean += this.weightsMu[i] * state[i];
    }
    return mean;
  }

  // Sample continuous action using Box-Muller transform
  sampleAction(state: number[]): { action: number; mean: number; std: number } {
    const mean = this.predictMean(state);
    const std = Math.exp(this.logStd);

    // Box-Muller standard normal draw
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const action = mean + std * z0;

    return { action, mean, std };
  }

  // Compute log-probability score functions
  // grad_mu = (a - mu) / (sigma^2)
  // grad_logStd = ((a - mu)^2 / sigma^2) - 1
  computeScores(state: number[], action: number): {
    gradWeightsMu: number[];
    gradBiasMu: number;
    gradLogStd: number;
  } {
    const mean = this.predictMean(state);
    const std = Math.exp(this.logStd);
    const varr = std * std;
    const diff = action - mean;

    const gradMean = diff / varr;
    const gradWeightsMu = state.map((s) => gradMean * s);
    const gradBiasMu = gradMean;
    const gradLogStd = (diff * diff) / varr - 1.0;

    return { gradWeightsMu, gradBiasMu, gradLogStd };
  }

  // Apply policy gradient step with learning rate alpha and return G
  applyGradient(
    state: number[],
    action: number,
    returnG: number,
    alpha: number = 0.001
  ): void {
    const { gradWeightsMu, gradBiasMu, gradLogStd } = this.computeScores(state, action);

    for (let i = 0; i < this.stateDim; i++) {
      this.weightsMu[i] += alpha * returnG * gradWeightsMu[i];
    }
    this.biasMu += alpha * returnG * gradBiasMu;
    this.logStd += alpha * returnG * gradLogStd;
  }
}
```

Verification Test:
```typescript
const policy = new GaussianPolicy(2);
const sample = policy.sampleAction([1.0, -0.5]);
console.log(`Sampled action: ${sample.action.toFixed(4)}, mean: ${sample.mean.toFixed(4)}`);
policy.applyGradient([1.0, -0.5], sample.action, 10.0, 0.01);
console.log("Updated biasMu:", policy.biasMu);
console.log("Updated logStd:", policy.logStd);
```
