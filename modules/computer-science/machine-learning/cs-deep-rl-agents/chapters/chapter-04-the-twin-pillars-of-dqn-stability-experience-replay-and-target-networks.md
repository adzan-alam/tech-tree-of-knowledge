# Chapter 4: The Twin Pillars of DQN Stability: Experience Replay and Target Networks

---

## 4.1 The Mechanics of Experience Replay

In standard supervised deep learning, optimization algorithms such as Stochastic Gradient Descent (SGD) and Adam rely upon a fundamental probabilistic postulate: the training examples presented to the optimizer are independent and identically distributed (**i.i.d.**) draws from an underlying stationary data distribution:
$$\mathcal{D}_{\text{train}} \sim p(x, y)$$

In reinforcement learning, this foundational postulate is violently violated. When an agent interacts with an environment, the sequential transitions it observes:
$$(s_0, a_0, r_1, s_1), (s_1, a_1, r_2, s_2), (s_2, a_2, r_3, s_3), \dots$$
form a highly non-stationary, serially autocorrelated trajectory governed by the Markov chain induced by policy $\pi$:
$$\mathbb{P}(s_{t+1} \mid s_t, a_t) = \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

If an online gradient descent update is applied immediately to each observed transition $(s_t, a_t, r_{t+1}, s_{t+1})$, two catastrophic failure modes emerge:
1. **Strong Autocorrelation and Catastrophic Forgetting:** Consecutive states $s_t$ and $s_{t+1}$ in visual environments like Atari are nearly identical except for a few pixels. Updating the deep neural network on a long sequence of highly correlated states drives the network weights into an extreme local optimum tailored exclusively to the current visual subspace, erasing previously learned policies in distant regions of the state space.
2. **Policy Feedback Instability:** An updated network immediately alters the policy $\pi(a \mid s) = \arg\max_a Q(s, a; \boldsymbol{\theta})$, which immediately biases the future trajectory of states visited. This positive feedback loop causes the data distribution to drift rapidly, destabilizing the gradient dynamics.

To neutralize these pathology vectors, Lin (1992) proposed and Mnih et al. (2015) refined **Experience Replay**: decoupling the agent's real-time physical interaction with the environment from the optimization of its neural network.

```
                  THE EXPERIENCE REPLAY ARCHITECTURE
                  
  ┌────────────────────────────────────────────────────────┐
  │                   ENVIRONMENT (MDP)                    │
  └──────────────▲──────────────────────────┬──────────────┘
                 │ Action a_t               │ Next State s_{t+1},
                 │                          │ Reward r_{t+1}, Done d_{t+1}
  ┌──────────────┴──────────────┐           │
  │     ACTOR (Behavior π)      │           │
  │   ε-greedy over Q(s, a; θ)  │           │
  └──────────────▲──────────────┘           ▼
                 │ State s_t    ┌──────────────────────────┐
                 └──────────────┤  Transition Generator    │
                                └───────────┬──────────────┘
                                            │ Transition e_t = (s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │      EXPERIENCE REPLAY BUFFER  D              │
                    │   Capacity N = 1,000,000 Transitions          │
                    │                                               │
                    │  [ e_1  ][ e_2  ][ e_3  ] ... [ e_{N-1} ][ e_N]│
                    │        ▲ FIFO Circular Ring Buffer            │
                    └────────┬──────────────────────────────────────┘
                             │
                             │ Uniform Random Sampling: B ~ U(D)
                             ▼ Mini-batch of Size B = 32
                    ┌───────────────────────────────────────────────┐
                    │      OPTIMIZER / LEARNER (SGD / Adam)         │
                    │  L(θ) = E_{(s,a,r,s',d)~U(D)} [ Huber(δ) ]    │
                    │  θ ← θ - α ∇_θ L(θ)                           │
                    └───────────────────────────────────────────────┘
```

### The Transition Tuple and Circular Ring Buffer
At every discrete time step $t$, the agent receives state $s_t$, selects action $a_t$, receives scalar reward $r_{t+1}$, transitions to state $s_{t+1}$, and observes termination indicator $d_{t+1} \in \{0, 1\}$. These elements are encapsulated into a 5-tuple called an **experience transition**:
$$e_t = (s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$$

The experience replay buffer $\mathcal{D} = \{e_1, e_2, \dots, e_N\}$ is implemented as a finite-capacity circular FIFO (first-in, first-out) ring buffer of maximum capacity $N$:
- When the buffer contains fewer than $N$ items, newly collected transitions are appended sequentially.
- Once the buffer reaches capacity $N$, newly arrived transitions overwrite the oldest transitions in the buffer:
$$\text{Index to overwrite} = t \pmod N$$

### Memory Footprint of the Replay Buffer
In the canonical Nature DQN paper (Mnih et al., 2015), the replay buffer capacity was set to $N = 1,000,000$ transitions.
In Atari games, each state $s_t$ consists of 4 stacked $84 \times 84$ 8-bit unsigned integer grayscale frames ($4 \times 84 \times 84 = 28,224$ bytes). 
Naively storing two states ($s_t$ and $s_{t+1}$) per transition would consume:
$$\text{Memory}_{\text{naive}} = 10^6 \times (2 \times 28,224 + 4 + 4 + 1) \approx 56.45 \text{ GB}$$

However, in an episode, $s_{t+1}$ shares 3 frames with $s_t$:
$$s_t = (f_{t-3}, f_{t-2}, f_{t-1}, f_t), \quad s_{t+1} = (f_{t-2}, f_{t-1}, f_t, f_{t+1})$$
By storing a single contiguous buffer of raw frames $f_t \in \mathbb{R}^{84 \times 84}$ and representing transitions as integer pointers to frame indices, the memory footprint drops dramatically:
$$\text{Memory}_{\text{optimized}} = 10^6 \times (84 \times 84 \times 1 \text{ byte}) + 10^6 \times (4 + 4 + 4 + 1) \approx 7.06 \text{ GB} + 13 \text{ MB} \approx 7.07 \text{ GB}$$
This fit comfortably inside standard 16 GB system RAM on modern commodity computing hardware.

---

## 4.2 Decorrelation Analysis: Breaking Autocorrelation & Empirical Variance

To understand mathematically why Experience Replay transforms divergent learning into stable convergence, consider the correlation between consecutive state representations.

### Temporal Autocorrelation Decay
Let $X_t = \phi(s_t)$ denote the neural representation or feature embedding of state $s_t$ along a trajectory. The lag-$k$ autocorrelation function of the representation sequence is defined as:
$$R_X(k) = \frac{\mathbb{E}[(X_t - \mu_X)(X_{t+k} - \mu_X)^\top]}{\sigma_X^2}$$

In continuous control or 60 FPS video game dynamics, the physical position of objects changes smoothly:
$$\|s_{t+1} - s_t\| \ll \sigma_s \implies R_X(1) \approx 0.999$$

When gradient updates are performed on consecutive transitions:
$$\mathbf{g}_t = \nabla_{\boldsymbol{\theta}} \mathcal{L}_t(\boldsymbol{\theta}), \quad \mathbf{g}_{t+1} = \nabla_{\boldsymbol{\theta}} \mathcal{L}_{t+1}(\boldsymbol{\theta})$$
the empirical gradients are collinear: $\cos(\mathbf{g}_t, \mathbf{g}_{t+1}) \approx 1$.
The variance of the accumulated gradient across a sequence of $M$ consecutive steps is:
$$\mathbb{V}\left[\sum_{i=1}^M \mathbf{g}_i\right] = \sum_{i=1}^M \mathbb{V}[\mathbf{g}_i] + 2 \sum_{i < j} \text{Cov}(\mathbf{g}_i, \mathbf{g}_j)$$

Because $\text{Cov}(\mathbf{g}_i, \mathbf{g}_j) > 0$ for small $|i - j|$, the covariance terms explode, causing the variance of the gradient updates to scale as $\mathcal{O}(M^2)$ instead of $\mathcal{O}(M)$. This induces extreme parameter jitter and directional oscillations.

```
       AUTOCORRELATION DECAY: ON-POLICY SEQUENTIAL VS REPLAY BUFFER
       
  Autocorrelation
    R_X(k)
     1.0 ┬───┐
         │    \    Sequential Trajectory: R_X(k) drops very slowly
     0.8 │     \   (High autocorrelation over dozens of frames)
         │      \
     0.6 │       \
         │        \
     0.4 │         \
         │          \
     0.2 │           \─────────────────────────────
         │                                         
     0.0 ┴─────────────────────────────────────────► Lag k (steps)
         │ █ (Replay Buffer: R_X(k) ≈ 0 for all k ≥ 1)
```

By sampling a mini-batch of size $B$ **uniformly at random** from replay buffer $\mathcal{D}$:
$$\mathcal{B} = \{(s^{(i)}, a^{(i)}, r^{(i)}, s'^{(i)}, d^{(i)})\}_{i=1}^B, \quad (s^{(i)}, a^{(i)}, r^{(i)}, s'^{(i)}, d^{(i)}) \overset{\text{i.i.d.}}{\sim} \mathcal{U}(\mathcal{D})$$
the probability that two samples in the same mini-batch are temporally contiguous is:
$$\mathbb{P}(\text{collision}) = \frac{B(B-1)}{2 N} \approx \frac{32 \times 31}{2 \times 10^6} \approx 4.96 \times 10^{-4} \approx 0$$

Thus, the covariance terms vanish:
$$\text{Cov}(\mathbf{g}_i, \mathbf{g}_j) \approx 0 \quad \forall i \neq j \implies \mathbb{V}\left[\frac{1}{B}\sum_{i=1}^B \mathbf{g}_i\right] = \frac{1}{B^2} \sum_{i=1}^B \mathbb{V}[\mathbf{g}_i] = \frac{1}{B} \sigma_{\mathbf{g}}^2$$
Sampling from the replay buffer reduces empirical gradient variance by a factor of $B$, recovering the i.i.d. property required for standard SGD convergence.

### Sample Efficiency and Data Reuse
In purely on-policy algorithms (such as SARSA or vanilla REINFORCE), each transition $(s_t, a_t, r_{t+1}, s_{t+1})$ is used for exactly one gradient update and then permanently discarded. 
In Experience Replay with capacity $N$, batch size $B$, and learning frequency $K$ (e.g., one gradient update every $K=4$ environment steps):
$$\text{Expected reuse per transition} = \frac{B}{K} \times \frac{N}{N} = \frac{32}{4} = 8 \text{ times}$$
Every observed transition is recycled multiple times across diverse parameter regimes, extracting substantially greater informational value from expensive environment interactions.

---

## 4.3 The Non-Stationary Target Problem

Even with an experience replay buffer breaking temporal autocorrelation, deep Q-learning without further architectural modifications routinely diverges. The root cause lies in the **moving target problem**.

Recall the standard one-step Q-learning Bellman optimality loss:
$$\mathcal{L}(\boldsymbol{\theta}) = \mathbb{E}_{(s, a, r, s', d) \sim \mathcal{U}(\mathcal{D})} \left[ \left( r + \gamma (1 - d) \max_{a' \in \mathcal{A}} Q(s', a'; \boldsymbol{\theta}) - Q(s, a; \boldsymbol{\theta}) \right)^2 \right]$$

Let $y(r, s', d; \boldsymbol{\theta}) = r + \gamma (1 - d) \max_{a'} Q(s', a'; \boldsymbol{\theta})$ denote the Bellman target. Notice that $y$ depends directly on the **same** parameter vector $\boldsymbol{\theta}$ that is being optimized!

### The Policy Chasing Vicious Cycle
When gradient descent is applied to minimize the loss, we adjust $\boldsymbol{\theta}$ to move $Q(s, a; \boldsymbol{\theta})$ closer to target $y(\boldsymbol{\theta})$:
$$\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k + \alpha \delta_k \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}_k)$$
where $\delta_k = y(\boldsymbol{\theta}_k) - Q(s, a; \boldsymbol{\theta}_k)$.

However, because deep neural networks possess global parameter sharing, shifting $\boldsymbol{\theta}_k \to \boldsymbol{\theta}_{k+1}$ does not merely change $Q(s, a)$. It also changes $Q(s', a'; \boldsymbol{\theta})$ for neighboring states $s'$!
If $Q(s', a'; \boldsymbol{\theta})$ shifts in the same direction:
$$y(\boldsymbol{\theta}_{k+1}) = r + \gamma \max_{a'} Q(s', a'; \boldsymbol{\theta}_{k+1}) \neq y(\boldsymbol{\theta}_k)$$

The target itself recedes like a mirage. The optimization objective is not a stationary surface $\min_{\boldsymbol{\theta}} f(\boldsymbol{\theta})$, but a dynamically morphing target distribution where the goalpost moves after every single step:

```
                      THE MOVING TARGET ILLUSION
                      
     Loss Surface at Step k             Loss Surface at Step k+1
     
           Target y(θ_k)                      Target y(θ_{k+1})
               │                                      │
               ▼                                      ▼
           \       /                              \       /
            \  •  /   ◄── Q(s,a; θ_k)              \     /
             \___/                                  \ • /   ◄── Q(s,a; θ_{k+1})
                                                     \_/
               
      [The parameter θ moves to hit y(θ_k), but that very movement pushes
       the target to y(θ_{k+1}), creating endless cycles, feedback loops,
       and explosive divergence.]
```

### Analysis of the True vs Semi-Gradient
If one were to compute the *true* mathematically rigorous gradient of the mean squared Bellman error $\frac{1}{2} (y(\boldsymbol{\theta}) - Q(s, a; \boldsymbol{\theta}))^2$ with respect to $\boldsymbol{\theta}$, the chain rule would yield:
$$\nabla_{\boldsymbol{\theta}} \mathcal{L}_{\text{full}}(\boldsymbol{\theta}) = - (y(\boldsymbol{\theta}) - Q(s, a; \boldsymbol{\theta})) \left( \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}) - \gamma \nabla_{\boldsymbol{\theta}} \max_{a'} Q(s', a'; \boldsymbol{\theta}) \right)$$

This true gradient contains the term $\gamma \nabla_{\boldsymbol{\theta}} \max_{a'} Q(s', a'; \boldsymbol{\theta})$, known as the **residual gradient**. 
Baird (1995) proved that optimizing the residual gradient directly requires two independent samples of the next state $s'$ from the exact same state-action pair $(s, a)$ to obtain an unbiased estimate of the squared expectation:
$$\mathbb{E}[(y - Q)^2] \neq (\mathbb{E}[y - Q])^2$$
In real-world or model-free RL, drawing two independent physical transitions from the exact same state is impossible. Furthermore, residual gradient algorithms converge to the wrong solution when the environment is stochastic, optimizing for the expected value of the squared Bellman error rather than the value function of the MDP.

Reinforcement learning therefore relies on the **semi-gradient**: treating the target $y$ as a fixed, externally provided pseudo-constant during the gradient step:
$$\mathbf{g}_{\text{semi}} = - (y - Q(s, a; \boldsymbol{\theta})) \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta})$$
Without architectural intervention, treating $y(\boldsymbol{\theta})$ as a constant when it actually shifts with $\boldsymbol{\theta}$ creates a disastrous positive feedback loop.

---

## 4.4 Target Network Formulations: Hard Sync vs Soft Polyak Averaging

To break the destructive feedback loop of the moving target, Mnih et al. (2015) introduced the **Target Network**.

Instead of evaluating the target values using the online parameters $\boldsymbol{\theta}$, a second, independent set of parameters $\boldsymbol{\theta}^-$ is maintained. The target network architecture is an identical clone of the online Q-network, but its parameters are frozen or updated on a much slower timescale.

The Bellman target is redefined as:
$$y^{\text{target}}(r, s', d; \boldsymbol{\theta}^-) = r + \gamma (1 - d) \max_{a' \in \mathcal{A}} Q(s', a'; \boldsymbol{\theta}^-)$$

The objective function minimized by the online network becomes:
$$\mathcal{L}(\boldsymbol{\theta}; \boldsymbol{\theta}^-) = \mathbb{E}_{(s, a, r, s', d) \sim \mathcal{U}(\mathcal{D})} \left[ \ell\left( y^{\text{target}}(r, s', d; \boldsymbol{\theta}^-) - Q(s, a; \boldsymbol{\theta}) \right) \right]$$

Now, when computing the gradient with respect to $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}; \boldsymbol{\theta}^-) = - \mathbb{E}\left[ \ell'\left( y^{\text{target}} - Q(s, a; \boldsymbol{\theta}) \right) \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}) \right]$$
The target $y^{\text{target}}$ does not depend on $\boldsymbol{\theta}$ at all! It is a true mathematical constant with respect to the gradient operator:
$$\nabla_{\boldsymbol{\theta}} y^{\text{target}}(r, s', d; \boldsymbol{\theta}^-) = \mathbf{0}$$
The learning problem is successfully converted into a sequence of stationary supervised regression problems.

```
                      DUAL-NETWORK ARCHITECTURE
                      
               ┌───────────────────────────────────────┐
               │         Online Q-Network θ            │
               │         Q(s, a; θ)                    │
               └──────────────────┬────────────────────┘
                                  │
                                  │ Evaluates Q(s, a; θ)
                                  ▼
                        Loss: Huber( y_target - Q(s, a; θ) )
                                  ▲
                                  │ Target y_target = r + γ max_{a'} Q(s', a'; θ^-)
               ┌──────────────────┴────────────────────┐
               │         Target Q-Network θ^-          │
               │         Q(s', a'; θ^-)                │
               └──────────────────▲────────────────────┘
                                  │
                                  │ Parameter Synchronization:
                                  │ • Hard: θ^- ← θ every C steps
                                  │ • Soft: θ^- ← τ θ + (1-τ) θ^-
```

### 1. Hard Periodic Target Synchronization (DQN Standard)
In canonical DQN (Mnih et al., 2015), the target network parameters $\boldsymbol{\theta}^-$ are held completely static for a fixed hyperparameter interval of $C$ environment steps (typically $C = 10,000$ steps in Atari, corresponding to 40,000 game frames). 
At every $C$-th step, the online parameters are copied directly into the target network:
$$\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta} \quad \text{if } t \equiv 0 \pmod C$$

**Properties:**
- During the $C$ steps between updates, the regression target distribution is rigorously fixed, ensuring stability.
- However, at step $C$, the target network undergoes a discontinuous, discrete jump: $\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$. This sudden shift immediately alters the Bellman targets for all states, often causing a transient spike in TD error and temporary instability immediately following the synchronization event.

### 2. Soft Polyak Exponential Moving Average (DDPG / SAC / Modern DQN)
In continuous control algorithms such as Deep Deterministic Policy Gradients (DDPG; Lillicrap et al., 2015) and Twin Delayed DDPG (TD3; Fujimoto et al., 2018), hard periodic synchronization is replaced by **Polyak Averaging** (soft updates).
At *every single* optimization step $t$, the target weights are updated via an exponential moving average (EMA) with a small tracking coefficient $\tau \ll 1$ (typically $\tau \in [0.001, 0.005]$):
$$\boldsymbol{\theta}^- \leftarrow \tau \boldsymbol{\theta} + (1 - \tau) \boldsymbol{\theta}^-$$

**Properties:**
- Eliminates the discontinuous shock of hard updates; the target network glides smoothly through weight space.
- The effective memory horizon of the Polyak target network corresponds to an exponentially decaying window with half-life:
$$t_{1/2} = \frac{\ln(0.5)}{\ln(1 - \tau)} \approx \frac{0.693}{\tau} \text{ steps}$$
For $\tau = 0.001$, $t_{1/2} \approx 693$ optimization steps.

---

## 4.5 Huber Loss and Gradient Clipping: Stabilizing Optimization Under Massive Outliers

In classical dynamic programming and tabular Q-learning, the Bellman error $\delta = r + \gamma \max_{a'} Q(s', a') - Q(s, a)$ is bounded if the reward function $r \in [R_{\min}, R_{\max}]$ is bounded.
In deep neural networks, early in training when weights are randomly initialized, predictions $Q(s, a; \boldsymbol{\theta})$ can be wildly erratic.

### The Danger of Mean Squared Error ($L_2$ Loss)
The standard Mean Squared Error loss is:
$$\mathcal{L}_{\text{MSE}}(\delta) = \frac{1}{2} \delta^2$$
The derivative of the MSE loss with respect to the TD error $\delta$ is:
$$\frac{\partial \mathcal{L}_{\text{MSE}}}{\partial \delta} = \delta$$

```
               COMPARISON OF LOSS FUNCTIONS AND GRADIENTS
               
       Loss Function L(δ)                  Gradient ∂L/∂δ
       
    10 ┬         /   MSE: 0.5 δ^2      1.0 ┬         ─────── Huber / L1: +1
     8 │        /                      0.5 │        /
     6 │  \    /                       0.0 ┼───────/───────► TD Error δ
     4 │   \  /  Huber Loss           -0.5 │      /
     2 │    \/                        -1.0 ┴───────         Huber / L1: -1
     0 ┴─────┴─────► TD Error δ             -2  -1   0   1   2
       -3 -2 -1 0 1 2 3
```

When an agent encounters a massive reward spike (e.g., scoring 1,000 points in an Atari game) or transitions to a catastrophic terminal state, the TD error can easily reach $\delta = 100$.
Under MSE loss, the gradient magnitude is $|\delta| = 100$. Multiplied by the gradient of the network $\nabla_{\boldsymbol{\theta}} Q$, this generates an enormous parameter update:
$$\Delta \boldsymbol{\theta} \propto 100 \cdot \nabla_{\boldsymbol{\theta}} Q$$

In deep convolutional or recurrent architectures, such outsized gradient vectors trigger the **exploding gradient problem**, destroying previously learned feature representations across the convolutional filters and resetting the network to random noise.

### The Huber Loss (Smooth $L_1$) Formulation
To guarantee numerical stability, Mnih et al. (2015) replaced MSE with the **Huber Loss** (smooth $L_1$ loss), defined with threshold parameter $\kappa = 1.0$:
$$\mathcal{L}_{\text{Huber}}(\delta) = \begin{cases}
\frac{1}{2} \delta^2 & \text{for } |\delta| \le 1.0 \\
|\delta| - \frac{1}{2} & \text{for } |\delta| > 1.0
\end{cases}$$

Let us compute the derivative of the Huber loss with respect to $\delta$:
$$\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial \delta} = \begin{cases}
\delta & \text{for } |\delta| \le 1.0 \\
\text{sign}(\delta) & \text{for } |\delta| > 1.0
\end{cases}$$

Notice the mathematical elegance of this formulation:
1. **Near zero ($|\delta| \le 1$):** The loss is quadratic ($\frac{1}{2}\delta^2$), providing a smooth, strictly convex minimum with continuous derivatives that gently pull predictions toward zero error without oscillations.
2. **Far from zero ($|\delta| > 1$):** The loss is linear ($|\delta| - 0.5$), and its derivative is strictly bounded:
$$\left|\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial \delta}\right| \le 1.0 \quad \forall \delta \in \mathbb{R}$$

The effective gradient magnitude never exceeds $1.0$, regardless of whether the TD error is $5$, $50$, or $50,000$. The Huber loss acts as an inherent, principled gradient clipper at the loss function level, rendering deep reinforcement learning impervious to catastrophic reward outliers.

---

## 4.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 4.1: FIFO Replay Buffer Index Math and Overwrite Tracking
**Problem:** A replay buffer has capacity $N = 5$. The agent inserts transitions at time steps $t = 0, 1, 2, 3, 4, 5, 6, 7$. 
Calculate:
1. The buffer size and write pointer index at each step.
2. The exact transitions stored in the buffer at $t = 7$.
3. The probability that a uniform random sample of size $B = 2$ drawn at $t = 7$ contains the transition generated at $t = 6$.

**Solution:**
Let the transitions be denoted $e_0, e_1, \dots, e_7$. The write pointer is given by $p = t \pmod N$:
- $t=0$: write to index $0 \pmod 5 = 0$. Buffer: $[e_0, \emptyset, \emptyset, \emptyset, \emptyset]$. Size $= 1$.
- $t=1$: write to index $1 \pmod 5 = 1$. Buffer: $[e_0, e_1, \emptyset, \emptyset, \emptyset]$. Size $= 2$.
- $t=2$: write to index $2 \pmod 5 = 2$. Buffer: $[e_0, e_1, e_2, \emptyset, \emptyset]$. Size $= 3$.
- $t=3$: write to index $3 \pmod 5 = 3$. Buffer: $[e_0, e_1, e_2, e_3, \emptyset]$. Size $= 4$.
- $t=4$: write to index $4 \pmod 5 = 4$. Buffer: $[e_0, e_1, e_2, e_3, e_4]$. Size $= 5$.
- $t=5$: write to index $5 \pmod 5 = 0$. Overwrites $e_0$. Buffer: $[e_5, e_1, e_2, e_3, e_4]$. Size $= 5$.
- $t=6$: write to index $6 \pmod 5 = 1$. Overwrites $e_1$. Buffer: $[e_5, e_6, e_2, e_3, e_4]$. Size $= 5$.
- $t=7$: write to index $7 \pmod 5 = 2$. Overwrites $e_2$. Buffer: $[e_5, e_6, e_7, e_3, e_4]$. Size $= 5$.

At $t = 7$, the buffer contains $\{e_3, e_4, e_5, e_6, e_7\}$. Notice that $e_0, e_1, e_2$ have been purged.
To find the probability that a sample of size $B = 2$ without replacement contains $e_6$:
The number of distinct subsets of size 2 from 5 items is $\binom{5}{2} = 10$.
The number of subsets containing $e_6$ is $\binom{4}{1} = 4$.
$$\mathbb{P}(e_6 \in \mathcal{B}) = \frac{4}{10} = \frac{2}{5} = 0.40 \quad (40\%)$$

TypeScript Verification:
```typescript
class SimpleReplayBuffer<T> {
  private buffer: T[] = [];
  private ptr = 0;
  constructor(public readonly capacity: number) {}
  push(item: T): void {
    if (this.buffer.length < this.capacity) {
      this.buffer.push(item);
    } else {
      this.buffer[this.ptr] = item;
    }
    this.ptr = (this.ptr + 1) % this.capacity;
  }
  getItems(): T[] { return [...this.buffer]; }
}
const rb = new SimpleReplayBuffer<string>(5);
for (let t = 0; t <= 7; t++) rb.push(`e_${t}`);
console.log(rb.getItems()); // ['e_5', 'e_6', 'e_7', 'e_3', 'e_4']
```

---

### Worked Example 4.2: Calculating Autocorrelation Decay in a Random Walk
**Problem:** Consider an agent moving on a 1D continuous line: $s_{t+1} = s_t + \epsilon_t$, where $\epsilon_t \sim \mathcal{N}(0, \sigma^2)$ are i.i.d. Gaussian increments with $\sigma = 1.0$. Assume $s_0 = 0$.
1. Derive the covariance $\text{Cov}(s_t, s_{t+k})$ for lag $k \ge 0$.
2. Compute the theoretical correlation coefficient $\rho(t, t+k) = \frac{\text{Cov}(s_t, s_{t+k})}{\sqrt{\mathbb{V}[s_t]\mathbb{V}[s_{t+k}]}}$ for $t = 100$ and lag $k = 1, 10, 50$.
3. Contrast this with the correlation between two independent uniform samples drawn from a large replay buffer.

**Solution:**
1. Express $s_{t+k}$ in terms of $s_t$:
$$s_t = \sum_{i=1}^t \epsilon_i, \quad s_{t+k} = s_t + \sum_{j=1}^k \epsilon_{t+j}$$
Since future increments $\epsilon_{t+j}$ are independent of $s_t$:
$$\text{Cov}(s_t, s_{t+k}) = \text{Cov}\left(s_t, s_t + \sum_{j=1}^k \epsilon_{t+j}\right) = \mathbb{V}[s_t] = t \sigma^2$$
The variance at step $t$ is $\mathbb{V}[s_t] = t \sigma^2$, and at step $t+k$ is $\mathbb{V}[s_{t+k}] = (t+k)\sigma^2$.

2. The correlation coefficient is:
$$\rho(t, t+k) = \frac{t \sigma^2}{\sqrt{(t \sigma^2) \cdot ((t+k) \sigma^2)}} = \frac{t}{\sqrt{t(t+k)}} = \sqrt{\frac{t}{t+k}}$$
For $t = 100$:
- For lag $k = 1$: $\rho = \sqrt{\frac{100}{101}} = \sqrt{0.9901} \approx 0.9950$ (99.5% correlated!).
- For lag $k = 10$: $\rho = \sqrt{\frac{100}{110}} = \sqrt{0.9091} \approx 0.9535$.
- For lag $k = 50$: $\rho = \sqrt{\frac{100}{150}} = \sqrt{0.6667} \approx 0.8165$.

3. In an Experience Replay buffer filled with transitions from thousands of episodes across the state space, two random draws $i, j \sim \mathcal{U}(\mathcal{D})$ originate from distinct, independent episodes with probability $> 0.999$. Hence, $\mathbb{E}[(s^{(i)} - \mu)(s^{(j)} - \mu)] = 0$, giving an empirical correlation of $\rho \approx 0.0$. Replay sampling completely shatters temporal correlation.

---

### Worked Example 4.3: Empirical Gradient Variance: Sequential Online vs. Mini-batch Replay
**Problem:** Suppose an online RL agent observes gradients $g_t$ where each gradient has scalar variance $\mathbb{V}[g_t] = 4.0$, and consecutive gradients have covariance $\text{Cov}(g_t, g_{t+1}) = 3.2$, $\text{Cov}(g_t, g_{t+2}) = 2.0$, and zero covariance for lag $\ge 3$.
1. Compute the variance of the average gradient $\bar{g}_{\text{seq}} = \frac{1}{4}\sum_{t=1}^4 g_t$ computed over 4 consecutive online steps.
2. Compute the variance of the average gradient $\bar{g}_{\text{replay}} = \frac{1}{4}\sum_{i=1}^4 g_i$ computed over a mini-batch of size 4 sampled uniformly at random from an independent replay buffer.
3. Determine the variance reduction ratio achieved by the replay buffer.

**Solution:**
1. For sequential updates:
$$\mathbb{V}\left[\sum_{t=1}^4 g_t\right] = \sum_{t=1}^4 \mathbb{V}[g_t] + 2 \sum_{1 \le i < j \le 4} \text{Cov}(g_i, g_j)$$
The pairs and lags are:
- Lag 1 pairs: $(1,2), (2,3), (3,4)$ (3 pairs) $\implies 3 \times 3.2 = 9.6$.
- Lag 2 pairs: $(1,3), (2,4)$ (2 pairs) $\implies 2 \times 2.0 = 4.0$.
- Lag 3 pairs: $(1,4)$ (1 pair) $\implies 1 \times 0.0 = 0.0$.
$$\mathbb{V}\left[\sum_{t=1}^4 g_t\right] = 4 \times 4.0 + 2 \times (9.6 + 4.0) = 16.0 + 2 \times 13.6 = 16.0 + 27.2 = 43.2$$
The variance of the sample mean $\bar{g}_{\text{seq}}$ is:
$$\mathbb{V}[\bar{g}_{\text{seq}}] = \frac{1}{4^2} \times 43.2 = \frac{43.2}{16} = 2.70$$

2. For replay buffer mini-batch sampling, the samples are mutually independent ($\text{Cov}(g_i, g_j) = 0$ for all $i \neq j$):
$$\mathbb{V}\left[\sum_{i=1}^4 g_i\right] = \sum_{i=1}^4 \mathbb{V}[g_i] = 4 \times 4.0 = 16.0$$
$$\mathbb{V}[\bar{g}_{\text{replay}}] = \frac{1}{4^2} \times 16.0 = \frac{16.0}{16} = 1.00$$

3. Variance Reduction Ratio:
$$\frac{\mathbb{V}[\bar{g}_{\text{seq}}]}{\mathbb{V}[\bar{g}_{\text{replay}}]} = \frac{2.70}{1.00} = 2.70$$
The sequential online gradient exhibits **$270\%$ higher variance** due to temporal positive autocorrelation.

---

### Worked Example 4.4: Hard Periodic Target Sync vs Single-Network Oscillation
**Problem:** Consider a 2-state MDP where $s_1 \to s_2$ deterministically with action $a_1$ and reward $r = 0$, and $s_2$ is terminal with reward $0$. Discount factor $\gamma = 0.9$.
Let the parameterized values be $Q(s_1, a_1; \theta) = \theta$ and $Q(s_2, a_2; \theta) = 2\theta$.
The TD target is $y = r + \gamma Q(s_2, a_2; \theta) = 0 + 0.9(2\theta) = 1.8\theta$.
1. If we update $\theta$ online without a target network using learning rate $\alpha = 0.8$: $\theta_{k+1} = \theta_k - \alpha \nabla_\theta \frac{1}{2}(1.8\theta_k - \theta)^2|_{\theta=\theta_k}$, show the recurrence relation for $\theta_k$ and determine if it diverges.
2. If we introduce a target network with hard update period $C = 2$:
Target $y = 1.8 \theta^-$. For steps $k=0, 1$, $\theta^- = \theta_0 = 1.0$.
Compute $\theta_1, \theta_2$, then update $\theta^- \leftarrow \theta_2$, and compute $\theta_3, \theta_4$.

**Solution:**
1. Without target network:
The semi-gradient update is:
$$\theta_{k+1} = \theta_k + \alpha (y(\theta_k) - Q(s_1, a_1; \theta_k)) \frac{\partial Q}{\partial \theta} = \theta_k + 0.8 (1.8\theta_k - \theta_k)(1) = \theta_k + 0.8(0.8\theta_k) = \theta_k + 0.64\theta_k = 1.64 \theta_k$$
Starting from $\theta_0 = 1.0$:
$$\theta_k = (1.64)^k$$
Since $|1.64| > 1$, the parameter diverges exponentially to $+\infty$: $\theta_1 = 1.64, \theta_2 = 2.6896, \theta_5 = 11.88, \theta_{10} = 141.1$.

2. With target network ($C = 2$):
Initial state: $\theta^- = 1.0, \theta_0 = 1.0$.
- Step $k = 0$: $y = 1.8 \theta^- = 1.8(1.0) = 1.8$.
$$\theta_1 = \theta_0 + \alpha (y - \theta_0) = 1.0 + 0.8(1.8 - 1.0) = 1.0 + 0.8(0.8) = 1.64$$
- Step $k = 1$: Target is still frozen at $\theta^- = 1.0 \implies y = 1.8$.
$$\theta_2 = \theta_1 + \alpha (y - \theta_1) = 1.64 + 0.8(1.8 - 1.64) = 1.64 + 0.8(0.16) = 1.64 + 0.128 = 1.768$$
Notice that $\theta$ converged toward the target $1.8$ because the target was stationary during this period!
- At step $k = 2$: Hard sync occurs: $\theta^- \leftarrow \theta_2 = 1.768$.
New fixed target: $y = 1.8(1.768) = 3.1824$.
- Step $k = 2$: $\theta_3 = 1.768 + 0.8(3.1824 - 1.768) = 1.768 + 0.8(1.4144) = 1.768 + 1.1315 = 2.8995$.
- Step $k = 3$: $\theta_4 = 2.8995 + 0.8(3.1824 - 2.8995) = 2.8995 + 0.8(0.2829) = 3.1258$.
While $\theta$ grows due to the positive feedback of the MDP's synthetic definition, within each interval of length $C$, the error contracts monotonically: $|\delta_1| = 0.16 < |\delta_0| = 0.80$, and $|\delta_3| = 0.0566 < |\delta_2| = 0.2829$. The target network forces intra-period contraction.

---

### Worked Example 4.5: Polyak Averaging ($\tau$-Soft Update) Half-Life and Weight Trajectory
**Problem:** In DDPG/TD3, soft target updates obey: $\boldsymbol{\theta}^-_{t+1} = \tau \boldsymbol{\theta}_t + (1 - \tau) \boldsymbol{\theta}^-_t$.
Suppose the online network weight is clamped at a new constant value $\theta^* = 10.0$, while the initial target weight is $\theta^-_0 = 0.0$.
Let $\tau = 0.005$.
1. Derive the closed-form expression for $\theta^-_t$ as a function of $t$.
2. Compute the exact value of $\theta^-_t$ at $t = 100, 500, 1000$.
3. Compute the exact half-life $t_{1/2}$ (the step where $\theta^-_t = 5.0$).

**Solution:**
1. Subtract $\theta^*$ from both sides:
$$\theta^-_{t+1} - \theta^* = \tau \theta^* + (1 - \tau)\theta^-_t - \theta^* = (1 - \tau)(\theta^-_t - \theta^*)$$
By induction:
$$\theta^-_t - \theta^* = (1 - \tau)^t (\theta^-_0 - \theta^*)$$
$$\theta^-_t = \theta^* + (1 - \tau)^t (\theta^-_0 - \theta^*) = \theta^* (1 - (1 - \tau)^t)$$
For $\theta^* = 10.0$ and $\tau = 0.005$:
$$\theta^-_t = 10.0 \left(1 - (0.995)^t\right)$$

2. Numerical values:
- At $t = 100$: $(0.995)^{100} \approx 0.60577 \implies \theta^-_{100} = 10.0(1 - 0.60577) = 3.9423$.
- At $t = 500$: $(0.995)^{500} \approx 0.08157 \implies \theta^-_{500} = 10.0(1 - 0.08157) = 9.1843$.
- At $t = 1000$: $(0.995)^{1000} \approx 0.00665 \implies \theta^-_{1000} = 10.0(1 - 0.00665) = 9.9335$.

3. Half-life calculation:
$$10.0(1 - (0.995)^{t_{1/2}}) = 5.0 \implies (0.995)^{t_{1/2}} = 0.5$$
$$t_{1/2} = \frac{\ln(0.5)}{\ln(0.995)} = \frac{-0.693147}{-0.0050125} \approx 138.28 \approx 139 \text{ steps}$$
After 139 steps, the target network absorbs 50% of the online network's weight displacement.

---

### Worked Example 4.6: Huber Loss vs MSE Gradient Under Outlier TD Errors
**Problem:** A deep Q-network encounters three transitions with TD errors:
$\delta_1 = 0.4$, $\delta_2 = 1.0$, and $\delta_3 = 25.0$.
Assume $\nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}) = [0.2, -0.5]^\top$.
1. Compute the loss value under MSE ($\frac{1}{2}\delta^2$) and Huber Loss ($\kappa = 1.0$) for each transition.
2. Compute the gradient vector $\mathbf{g} = \nabla_{\boldsymbol{\theta}} \mathcal{L}$ under both loss functions for all three transitions.
3. Compare the gradient norms $\|\mathbf{g}\|_2$ for $\delta_3 = 25.0$.

**Solution:**
1. Loss values:
- For $\delta_1 = 0.4 \le 1.0$:
  - $\mathcal{L}_{\text{MSE}} = \frac{1}{2}(0.4)^2 = 0.08$.
  - $\mathcal{L}_{\text{Huber}} = \frac{1}{2}(0.4)^2 = 0.08$ (identical).
- For $\delta_2 = 1.0 \le 1.0$:
  - $\mathcal{L}_{\text{MSE}} = \frac{1}{2}(1.0)^2 = 0.50$.
  - $\mathcal{L}_{\text{Huber}} = \frac{1}{2}(1.0)^2 = 0.50$ (identical).
- For $\delta_3 = 25.0 > 1.0$:
  - $\mathcal{L}_{\text{MSE}} = \frac{1}{2}(25.0)^2 = 312.5$.
  - $\mathcal{L}_{\text{Huber}} = |25.0| - 0.5 = 24.5$.

2. Gradients:
By chain rule: $\nabla_{\boldsymbol{\theta}} \mathcal{L} = \frac{\partial \mathcal{L}}{\partial \delta} \cdot \frac{\partial \delta}{\partial \boldsymbol{\theta}} = - \frac{\partial \mathcal{L}}{\partial \delta} \nabla_{\boldsymbol{\theta}} Q$.
- For $\delta_1 = 0.4$:
  - Both losses have $\frac{\partial \mathcal{L}}{\partial \delta} = 0.4$.
  - $\mathbf{g}_{\text{MSE}} = \mathbf{g}_{\text{Huber}} = -0.4 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.08 \\ 0.20 \end{bmatrix}$.
- For $\delta_2 = 1.0$:
  - Both losses have $\frac{\partial \mathcal{L}}{\partial \delta} = 1.0$.
  - $\mathbf{g}_{\text{MSE}} = \mathbf{g}_{\text{Huber}} = -1.0 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.20 \\ 0.50 \end{bmatrix}$.
- For $\delta_3 = 25.0$:
  - MSE: $\frac{\partial \mathcal{L}}{\partial \delta} = 25.0$.
    $$\mathbf{g}_{\text{MSE}} = -25.0 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -5.0 \\ 12.5 \end{bmatrix}$$
  - Huber: $\frac{\partial \mathcal{L}}{\partial \delta} = \text{sign}(25.0) = 1.0$.
    $$\mathbf{g}_{\text{Huber}} = -1.0 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.20 \\ 0.50 \end{bmatrix}$$

3. Norm comparison for $\delta_3$:
- $\|\mathbf{g}_{\text{MSE}}\|_2 = \sqrt{(-5.0)^2 + (12.5)^2} = \sqrt{25 + 156.25} = \sqrt{181.25} \approx 13.46$.
- $\|\mathbf{g}_{\text{Huber}}\|_2 = \sqrt{(-0.20)^2 + (0.50)^2} = \sqrt{0.04 + 0.25} = \sqrt{0.29} \approx 0.5385$.
The MSE gradient is **25 times larger**, capable of destroying network weights, while Huber cleanly caps the gradient.

---

### Worked Example 4.7: Target Calculation with Terminal State Masking
**Problem:** In DQN, transitions reaching terminal states ($d = 1$) must omit the bootstrapped future value: $y = r + \gamma (1 - d) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)$.
Given discount factor $\gamma = 0.99$, and the following mini-batch of 3 transitions:
- Transition 1: $r = +1.0, d = 0, Q(s'_1, \cdot; \boldsymbol{\theta}^-) = [2.4, 4.1, 1.8]$
- Transition 2: $r = -1.0, d = 1, Q(s'_2, \cdot; \boldsymbol{\theta}^-) = [10.5, 12.2, 8.0]$
- Transition 3: $r = 0.0, d = 0, Q(s'_3, \cdot; \boldsymbol{\theta}^-) = [-0.5, -0.2, -1.1]$
Current online predictions: $Q(s_1, a_1; \boldsymbol{\theta}) = 3.5$, $Q(s_2, a_2; \boldsymbol{\theta}) = -0.4$, $Q(s_3, a_3; \boldsymbol{\theta}) = 0.1$.
Compute:
1. The target value $y_i$ for each transition.
2. The TD error $\delta_i = y_i - Q(s_i, a_i; \boldsymbol{\theta})$.
3. The mini-batch Huber loss.

**Solution:**
1. Target calculations:
- Transition 1 ($d = 0$): $\max_{a'} Q(s'_1, a') = \max(2.4, 4.1, 1.8) = 4.1$.
  $$y_1 = 1.0 + 0.99 \times (1 - 0) \times 4.1 = 1.0 + 4.059 = 5.059$$
- Transition 2 ($d = 1$, terminal!): The bootstrapped term is masked to 0:
  $$y_2 = -1.0 + 0.99 \times (1 - 1) \times 12.2 = -1.0 + 0.0 = -1.000$$
  *(Crucial note: Even though $Q(s'_2)$ was high, the terminal flag correctly annihilates the hallucinated future!)*
- Transition 3 ($d = 0$): $\max_{a'} Q(s'_3, a') = \max(-0.5, -0.2, -1.1) = -0.2$.
  $$y_3 = 0.0 + 0.99 \times (1 - 0) \times (-0.2) = -0.198$$

2. TD error calculations:
- $\delta_1 = y_1 - Q_1 = 5.059 - 3.5 = +1.559$.
- $\delta_2 = y_2 - Q_2 = -1.000 - (-0.4) = -0.600$.
- $\delta_3 = y_3 - Q_3 = -0.198 - 0.1 = -0.298$.

3. Huber loss calculations ($\kappa = 1.0$):
- For $\delta_1 = 1.559 > 1.0$: $\mathcal{L}_1 = |\delta_1| - 0.5 = 1.559 - 0.5 = 1.059$.
- For $\delta_2 = -0.600$ ($|\delta_2| \le 1.0$): $\mathcal{L}_2 = \frac{1}{2}(-0.600)^2 = 0.180$.
- For $\delta_3 = -0.298$ ($|\delta_3| \le 1.0$): $\mathcal{L}_3 = \frac{1}{2}(-0.298)^2 = 0.0444$.
Mini-batch Huber loss:
$$\bar{\mathcal{L}} = \frac{1.059 + 0.180 + 0.0444}{3} = \frac{1.2834}{3} = 0.4278$$

---

### Worked Example 4.8: Replay Sampling Probability and Coupon Collector Saturation
**Problem:** Suppose an experience replay buffer contains $N = 10,000$ transitions. An agent samples mini-batches of size $B = 32$ with replacement across $K$ training steps.
1. What is the probability that a specific transition $e^*$ is sampled at least once in a single mini-batch?
2. How many mini-batches $K$ must be sampled such that the probability of having sampled transition $e^*$ at least once exceeds $95\%$?
3. If each transition resides in the buffer for exactly $N$ environment steps, and 1 gradient step is performed per environment step, what is the probability that $e^*$ is *never* sampled during its entire lifetime in the buffer?

**Solution:**
1. For a single draw, $\mathbb{P}(\text{drawn}) = \frac{1}{N}$.
The probability that $e^*$ is *not* drawn in 1 pick is $1 - \frac{1}{N}$.
In a mini-batch of size $B$ drawn with replacement, the probability that $e^*$ is not picked at all is $\left(1 - \frac{1}{N}\right)^B$.
$$\mathbb{P}(e^* \in \mathcal{B}) = 1 - \left(1 - \frac{1}{10,000}\right)^{32} = 1 - (0.9999)^{32} \approx 1 - 0.996805 = 0.003195 \quad (\approx 0.32\%)$$

2. Over $K$ independent mini-batches, the probability that $e^*$ is never sampled is $\left(1 - \frac{1}{N}\right)^{BK}$.
We require:
$$1 - \left(1 - \frac{1}{N}\right)^{BK} \ge 0.95 \implies \left(1 - \frac{1}{N}\right)^{BK} \le 0.05$$
Using the approximation $\left(1 - \frac{1}{N}\right)^{BK} \approx e^{-\frac{BK}{N}}$:
$$e^{-\frac{32 K}{10,000}} \le 0.05 \implies -\frac{32 K}{10,000} \le \ln(0.05) \approx -2.99573$$
$$\frac{32 K}{10,000} \ge 2.99573 \implies K \ge \frac{29,957.3}{32} \approx 936.17 \implies K \ge 937 \text{ steps}$$

3. Lifetime in buffer: $K = N = 10,000$ steps.
The total number of samples drawn during its lifetime is $BK = 32 \times 10,000 = 320,000$.
The probability that $e^*$ is never sampled during its entire lifetime:
$$\mathbb{P}(\text{never}) = \left(1 - \frac{1}{10,000}\right)^{320,000} \approx e^{-\frac{320,000}{10,000}} = e^{-32} \approx 1.266 \times 10^{-14} \approx 0$$
Virtually every single experience is guaranteed to be sampled and learned from multiple times (expected number of times $= \frac{32 \times 10,000}{10,000} = 32$ times).

---

### Worked Example 4.9: Mathematical Derivation of Huber Loss Gradient Clipping
**Problem:** Formulate the general Huber loss with arbitrary transition threshold $\kappa > 0$:
$$\mathcal{L}_\kappa(\delta) = \begin{cases}
\frac{1}{2} \delta^2 & \text{if } |\delta| \le \kappa \\
\kappa \left(|\delta| - \frac{1}{2}\kappa\right) & \text{if } |\delta| > \kappa
\end{cases}$$
1. Prove that $\mathcal{L}_\kappa(\delta)$ is continuously differentiable ($C^1$) at $\delta = \kappa$ and $\delta = -\kappa$.
2. Derive the exact expression for the derivative $\frac{d\mathcal{L}_\kappa}{d\delta}$.
3. Show that $\lim_{\kappa \to 0} \frac{\mathcal{L}_\kappa(\delta)}{\kappa} = |\delta|$ (recovering pure $L_1$ loss).

**Solution:**
1. Check continuity at $\delta = \kappa$:
- Left limit: $\lim_{\delta \to \kappa^-} \mathcal{L}_\kappa(\delta) = \frac{1}{2}\kappa^2$.
- Right limit: $\lim_{\delta \to \kappa^+} \mathcal{L}_\kappa(\delta) = \kappa(\kappa - \frac{1}{2}\kappa) = \frac{1}{2}\kappa^2$.
Both limits match, so $\mathcal{L}_\kappa$ is continuous.
Check differentiability at $\delta = \kappa$:
- Left derivative: $\lim_{\delta \to \kappa^-} \frac{d}{d\delta}\left(\frac{1}{2}\delta^2\right) = \kappa$.
- Right derivative: For $\delta > \kappa > 0$, $|\delta| = \delta$.
  $$\lim_{\delta \to \kappa^+} \frac{d}{d\delta}\left(\kappa\delta - \frac{1}{2}\kappa^2\right) = \kappa$$
Both derivatives match $\kappa$.
By symmetry, at $\delta = -\kappa$, both left and right derivatives equal $-\kappa$. Hence, $\mathcal{L}_\kappa \in C^1(\mathbb{R})$.

2. The derivative is:
$$\frac{d\mathcal{L}_\kappa}{d\delta} = \begin{cases}
\delta & \text{if } |\delta| \le \kappa \\
\kappa \cdot \text{sign}(\delta) & \text{if } |\delta| > \kappa
\end{cases} = \max(-\kappa, \min(\kappa, \delta)) = \text{clip}(\delta, -\kappa, \kappa)$$
The derivative of the Huber loss is mathematically identical to applying the `clip` function to $\delta$ with bounds $[-\kappa, \kappa]$.

3. Limit as $\kappa \to 0$:
For any $\delta \neq 0$, as $\kappa \to 0$, eventually $|\delta| > \kappa$.
$$\frac{\mathcal{L}_\kappa(\delta)}{\kappa} = \frac{\kappa(|\delta| - \frac{1}{2}\kappa)}{\kappa} = |\delta| - \frac{1}{2}\kappa$$
$$\lim_{\kappa \to 0} \left( |\delta| - \frac{1}{2}\kappa \right) = |\delta|$$
Thus, Huber loss smoothly interpolates between $L_2$ regression for small errors and $L_1$ median regression for large errors.

---

### Worked Example 4.10: Complete TypeScript Implementation of a Circular Replay Buffer with Unit-Batch Sampling
**Problem:** Implement an efficient, production-grade `ReplayBuffer` in TypeScript supporting:
1. Fixed memory capacity $N$ with circular ring buffer overwrite mechanics.
2. Fast push operations $\mathcal{O}(1)$.
3. Fast uniform mini-batch sampling $\mathcal{O}(B)$ without replacement.
4. Verify sampling uniformity and index preservation.

**Solution:**
```typescript
export interface Transition<S = number[], A = number> {
  state: S;
  action: A;
  reward: number;
  nextState: S;
  done: boolean;
}

export class ReplayBuffer<S = number[], A = number> {
  private buffer: (Transition<S, A> | null)[];
  private pointer: number = 0;
  private currentSize: number = 0;

  constructor(public readonly capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be positive");
    this.buffer = new Array(capacity).fill(null);
  }

  push(transition: Transition<S, A>): void {
    this.buffer[this.pointer] = transition;
    this.pointer = (this.pointer + 1) % this.capacity;
    if (this.currentSize < this.capacity) {
      this.currentSize++;
    }
  }

  sample(batchSize: number): Transition<S, A>[] {
    if (this.currentSize < batchSize) {
      throw new Error(`Cannot sample batch of ${batchSize} from buffer with ${this.currentSize} items`);
    }

    // Modern Fisher-Yates partial shuffle on indices for O(B) sampling without replacement
    const sampledIndices = new Set<number>();
    const batch: Transition<S, A>[] = [];

    while (sampledIndices.size < batchSize) {
      const idx = Math.floor(Math.random() * this.currentSize);
      if (!sampledIndices.has(idx)) {
        sampledIndices.add(idx);
        batch.push(this.buffer[idx]!);
      }
    }

    return batch;
  }

  size(): number {
    return this.currentSize;
  }

  clear(): void {
    this.buffer.fill(null);
    this.pointer = 0;
    this.currentSize = 0;
  }
}
```

Verification Test:
```typescript
const buffer = new ReplayBuffer<number, number>(100);
for (let i = 0; i < 100; i++) {
  buffer.push({ state: i, action: 0, reward: 1, nextState: i + 1, done: false });
}
const batch = buffer.sample(4);
console.log(`Sampled ${batch.length} transitions. First state: ${batch[0].state}`);
// Correctly samples 4 distinct transitions uniformly at random
```

---

## 4.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 4.1: Frame-Pointer Buffer Memory Compression Ratio
**Problem:** In Atari DQN, an agent stores $1,000,000$ transitions. Each frame is an $84 \times 84$ 8-bit image ($7,056$ bytes). An action is a 32-bit integer (4 bytes), reward is a 32-bit float (4 bytes), and done is an 8-bit boolean (1 byte).
1. Calculate the exact uncompressed memory in gigabytes if $s_t$ and $s_{t+1}$ each store 4 discrete raw frames per transition.
2. Calculate the memory required if transitions store only a 64-bit pointer/index (8 bytes) to a master array of unique frames, plus action, reward, and done flags.
3. Compute the memory compression ratio $\frac{\text{Memory}_{\text{uncompressed}}}{\text{Memory}_{\text{compressed}}}$.

**Solution:**
1. Uncompressed approach:
Each state has 4 frames: $4 \times 7,056 = 28,224$ bytes.
Each transition stores:
- $s_t$: $28,224$ bytes.
- $s_{t+1}$: $28,224$ bytes.
- Action: 4 bytes.
- Reward: 4 bytes.
- Done: 1 byte.
Total per transition: $28,224 + 28,224 + 4 + 4 + 1 = 56,457$ bytes.
Total for $10^6$ transitions:
$$56,457 \times 10^6 \text{ bytes} \approx 5.6457 \times 10^{10} \text{ bytes} = \frac{56,457,000,000}{1024^3} \approx 52.58 \text{ GiB}$$

2. Pointer-based compressed approach:
Assuming an average episode length of 1,000 steps, $10^6$ transitions contain at most $10^6$ distinct frames.
- Frame storage: $10^6 \times 7,056 = 7.056 \times 10^9 \text{ bytes} \approx 6.57 \text{ GiB}$.
- Transition metadata storage: each transition stores:
  - Pointer to frame $t$: 8 bytes.
  - Action: 4 bytes.
  - Reward: 4 bytes.
  - Done: 1 byte.
  Total metadata per transition: $8 + 4 + 4 + 1 = 17$ bytes.
  Total metadata: $17 \times 10^6 = 17,000,000 \text{ bytes} \approx 0.016 \text{ GiB}$.
Total compressed memory: $6.57 + 0.016 = 6.586 \text{ GiB}$.

3. Compression ratio:
$$\text{Ratio} = \frac{52.58 \text{ GiB}}{6.586 \text{ GiB}} \approx 7.98 \times$$
Storing frame pointers achieves an **$8\times$ memory reduction**, allowing a million-transition buffer to fit in 7 GB of RAM instead of 53 GB.

---

### Exercise 4.2: Effective Target Update Period of Polyak Averaging
**Problem:** In TD3/SAC, Polyak soft updates use $\boldsymbol{\theta}^-_{t+1} = \tau \boldsymbol{\theta}_t + (1 - \tau) \boldsymbol{\theta}^-_t$ with $\tau = 0.005$.
In Nature DQN, hard updates use $\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$ every $C = 10,000$ steps.
1. Show that the weights of the target network under Polyak averaging can be written as a geometric distributed lag of past online weights:
$$\boldsymbol{\theta}^-_t = \tau \sum_{k=0}^{t-1} (1 - \tau)^k \boldsymbol{\theta}_{t-1-k} + (1 - \tau)^t \boldsymbol{\theta}^-_0$$
2. Compute the mean lag (expected age of the parameters) in the Polyak target network in terms of $\tau$.
3. Evaluate the mean lag for $\tau = 0.005$, and compare it to the mean age of parameters in DQN with $C = 10,000$.

**Solution:**
1. By repeated back-substitution:
$$\boldsymbol{\theta}^-_t = \tau \boldsymbol{\theta}_{t-1} + (1 - \tau) \boldsymbol{\theta}^-_{t-1}$$
$$\boldsymbol{\theta}^-_t = \tau \boldsymbol{\theta}_{t-1} + (1 - \tau)[\tau \boldsymbol{\theta}_{t-2} + (1 - \tau)\boldsymbol{\theta}^-_{t-2}] = \tau \boldsymbol{\theta}_{t-1} + \tau (1 - \tau) \boldsymbol{\theta}_{t-2} + (1 - \tau)^2 \boldsymbol{\theta}^-_{t-2}$$
By induction:
$$\boldsymbol{\theta}^-_t = \sum_{k=0}^{t-1} \tau (1 - \tau)^k \boldsymbol{\theta}_{t-1-k} + (1 - \tau)^t \boldsymbol{\theta}^-_0$$

2. The weights $w_k = \tau (1 - \tau)^k$ form a geometric probability distribution over the age $k+1$ of the parameters.
The expected age (mean lag) is:
$$\mathbb{E}[\text{Age}] = \sum_{k=0}^\infty (k+1) \tau (1 - \tau)^k = \tau \sum_{m=1}^\infty m (1 - \tau)^{m-1}$$
Using the standard identity $\sum_{m=1}^\infty m x^{m-1} = \frac{1}{(1 - x)^2}$ for $|x| < 1$, setting $x = 1 - \tau$:
$$\mathbb{E}[\text{Age}] = \tau \cdot \frac{1}{(1 - (1 - \tau))^2} = \tau \cdot \frac{1}{\tau^2} = \frac{1}{\tau}$$

3. Evaluations:
- For $\tau = 0.005$:
  $$\mathbb{E}[\text{Age}] = \frac{1}{0.005} = 200 \text{ steps}$$
- In DQN with hard period $C = 10,000$:
  The age of the target parameters increases linearly from 0 to $C-1$ over each cycle.
  The average age across time is:
  $$\text{Mean Age} = \frac{1}{C}\sum_{j=0}^{C-1} j = \frac{C - 1}{2} = \frac{10,000 - 1}{2} \approx 4,999.5 \text{ steps}$$
The DQN target network is approximately 25 times "older" and more delayed than the TD3 target network with $\tau = 0.005$.

---

### Exercise 4.3: Analytical Huber vs L2 Optimization Step on Linear Q-Function
**Problem:** Let $Q(s, a; w) = w \cdot x$ where $x = 2.0$. Suppose the target is $y = 10.0$ and current weight is $w_0 = 1.0$.
Learning rate $\alpha = 0.1$.
1. Compute the TD error $\delta_0 = y - Q(s, a; w_0)$.
2. Compute the updated weight $w_1^{(\text{MSE})}$ using MSE loss $\frac{1}{2}\delta^2$.
3. Compute the updated weight $w_1^{(\text{Huber})}$ using Huber loss with $\kappa = 1.0$.
4. Which update is more conservative, and what prevents $w_1$ from overshooting?

**Solution:**
1. Current prediction: $Q(s, a; w_0) = 1.0 \times 2.0 = 2.0$.
$$\delta_0 = y - Q(s, a; w_0) = 10.0 - 2.0 = 8.0$$

2. MSE update:
Loss: $\mathcal{L}_{\text{MSE}} = \frac{1}{2}\delta^2$.
Gradient with respect to $w$:
$$\frac{\partial \mathcal{L}_{\text{MSE}}}{\partial w} = \frac{\partial \mathcal{L}}{\partial \delta} \frac{\partial \delta}{\partial w} = \delta_0 \cdot (-x) = 8.0 \times (-2.0) = -16.0$$
Parameter update:
$$w_1^{(\text{MSE})} = w_0 - \alpha \frac{\partial \mathcal{L}_{\text{MSE}}}{\partial w} = 1.0 - 0.1 \times (-16.0) = 1.0 + 1.6 = 2.60$$

3. Huber update ($\kappa = 1.0$):
Since $|\delta_0| = 8.0 > 1.0$, the derivative is $\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial \delta} = \text{sign}(\delta_0) = +1.0$.
Gradient with respect to $w$:
$$\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial w} = \frac{\partial \mathcal{L}}{\partial \delta} \frac{\partial \delta}{\partial w} = 1.0 \times (-2.0) = -2.0$$
Parameter update:
$$w_1^{(\text{Huber})} = w_0 - \alpha \frac{\partial \mathcal{L}_{\text{Huber}}}{\partial w} = 1.0 - 0.1 \times (-2.0) = 1.0 + 0.2 = 1.20$$

4. The Huber update is significantly more conservative ($+0.20$ vs $+1.60$).
Because the error $\delta_0 = 8.0$ exceeds threshold $\kappa = 1.0$, Huber clips the error derivative to $1.0$, capping the effective gradient step to $\alpha \kappa x = 0.1 \times 1.0 \times 2.0 = 0.20$. This prevents an outlier sample from swinging the parameter violently.

---

### Exercise 4.4: Contraction Mapping of Fixed Target Bellman Operator
**Problem:** Let $\mathcal{T}_{\boldsymbol{\theta}^-}$ be the fixed-target Bellman operator defined on value functions $Q$:
$$(\mathcal{T}_{\boldsymbol{\theta}^-} Q)(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)$$
Notice that the right-hand side does **not** depend on $Q$; it is a constant vector with respect to $Q$!
1. Prove that for any two action-value functions $Q_1, Q_2$, $\|\mathcal{T}_{\boldsymbol{\theta}^-} Q_1 - \mathcal{T}_{\boldsymbol{\theta}^-} Q_2\|_\infty = 0$.
2. Explain how this trivial contraction guarantees that the regression problem $\min_{\boldsymbol{\theta}} \|Q(\cdot, \cdot; \boldsymbol{\theta}) - \mathcal{T}_{\boldsymbol{\theta}^-} Q\|_2^2$ is stable and well-posed.

**Solution:**
1. Compute the difference:
$$(\mathcal{T}_{\boldsymbol{\theta}^-} Q_1)(s, a) - (\mathcal{T}_{\boldsymbol{\theta}^-} Q_2)(s, a) = \left[\mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)\right] - \left[\mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)\right] = 0$$
Taking the supremum over all $(s, a)$:
$$\|\mathcal{T}_{\boldsymbol{\theta}^-} Q_1 - \mathcal{T}_{\boldsymbol{\theta}^-} Q_2\|_\infty = 0 \le \gamma \|Q_1 - Q_2\|_\infty \quad \forall \gamma \ge 0$$
The operator $\mathcal{T}_{\boldsymbol{\theta}^-}$ maps all value functions to a single constant vector.

2. Because the target vector $Y = \mathcal{T}_{\boldsymbol{\theta}^-}$ is completely independent of the online parameters $\boldsymbol{\theta}$, the loss function:
$$\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2} \mathbb{E}_{(s, a) \sim \mathcal{D}} [(Y(s, a) - Q(s, a; \boldsymbol{\theta}))^2]$$
is a standard, fixed supervised regression problem. It has no recursive self-referential loops, no eigenvalue expansions, and no Deadly Triad instability during the period when $\boldsymbol{\theta}^-$ is frozen.

---

### Exercise 4.5: Proof of Finite Replay Buffer Uniform Stationary Distribution
**Problem:** Consider a FIFO replay buffer of capacity $N$. Transitions $e_t$ are generated by a stationary Markov chain with invariant state-action distribution $\mu(s, a)$.
1. Show that when $t \ge N$, every slot $i \in \{0, 1, \dots, N-1\}$ in the buffer contains a transition sampled from marginal distribution $\mu$.
2. Let $J \sim \mathcal{U}(\{0, 1, \dots, N-1\})$ be a random index drawn from the buffer. Show that the marginal distribution of transition $e_J$ is exactly $\mu$.
3. Does the replay buffer eliminate non-stationarity if the policy $\pi$ is continuously changing? Explain.

**Solution:**
1. For any slot $i \in \{0, \dots, N-1\}$, at time $t \ge N$, the item residing in slot $i$ was recorded at time step $\tau(i) = t - ((t - i) \pmod N)$. Since the underlying MDP is stationary and in steady-state, each transition $e_{\tau(i)}$ was drawn from $\mu(s, a)$. Thus, each individual cell in the buffer marginally follows $\mu$.

2. By the Law of Total Probability:
$$\mathbb{P}(e_J = (s, a)) = \sum_{i=0}^{N-1} \mathbb{P}(J = i) \mathbb{P}(e_i = (s, a) \mid J = i) = \sum_{i=0}^{N-1} \frac{1}{N} \mu(s, a) = \mu(s, a) \sum_{i=0}^{N-1} \frac{1}{N} = \mu(s, a)$$
The uniform mixture of marginally identical distributions is identical to that marginal distribution.

3. If policy $\pi$ is continuously changing, the replay buffer does **not** make the data distribution stationary with respect to current policy $\pi_t$. Instead, the buffer stores an empirical mixture distribution over past policies:
$$p_{\mathcal{D}}(s, a) = \frac{1}{N} \sum_{k=t-N}^{t-1} d^{\pi_k}(s) \pi_k(a \mid s)$$
This is an off-policy distribution! However, because Q-learning is an off-policy algorithm that targets $Q^*$, it can theoretically learn from any distribution $p_{\mathcal{D}}$ that has adequate exploration coverage ($\forall (s, a), p_{\mathcal{D}}(s, a) > 0$). The buffer smooths out rapid policy shifts into a slowly drifting historical distribution.

---

### Exercise 4.6: Replay Ratio and Overfitting Bounds
**Problem:** Define the **Replay Ratio** (RR) as the number of gradient update samples divided by the number of environment interaction steps:
$$\text{RR} = \frac{\text{Gradient Steps} \times \text{Batch Size } B}{\text{Environment Steps}}$$
In DQN: 1 gradient step of batch size $B=32$ is performed every 4 environment steps.
1. Calculate the Replay Ratio for DQN.
2. In recent sample-efficient algorithms (e.g., Continuous Rainbow, SR-DQN), researchers use $\text{RR} = 8$ or $\text{RR} = 16$. Calculate the number of gradient steps per environment step for $\text{RR} = 8$ with batch size $B = 64$.
3. What pathology occurs if the Replay Ratio is set too high (e.g., $\text{RR} = 128$) when the buffer size is small?

**Solution:**
1. For DQN:
$$\text{RR}_{\text{DQN}} = \frac{1 \text{ gradient step} \times 32 \text{ transitions}}{4 \text{ environment steps}} = \frac{32}{4} = 8 \text{ updates per transition generated}$$
Note: In terms of batches per step: $\frac{1}{4} = 0.25$ updates/step. In terms of sample reuse ratio: $8.0$.

2. For $\text{RR} = 8$ with $B = 64$:
$$\text{Updates per step } U = \frac{\text{RR}}{B} = \frac{8}{64} = 0.125 \text{ (1 gradient step every 8 environment steps)}$$
Alternatively, if Replay Ratio is defined as updates per env step: $U = 8 \implies 8 \times 64 = 512$ samples per env step.

3. If Replay Ratio is excessively high on a small buffer:
- **Catastrophic Overfitting:** The neural network repeatedly fits the exact same small set of transitions, memorizing their specific noise and losing generalization to unvisited states.
- **Loss of Plasticity:** As demonstrated by Lyle et al. (2023), high replay ratios cause deep neural network feature representations to collapse into a low-rank subspace (representation rank collapse), rendering the network incapable of learning new behaviors when novel states are discovered.

---

### Exercise 4.7: Target Network Divergence Without Replay Buffer
**Problem:** Suppose an agent uses a target network with hard sync period $C = 1,000$, but does **not** use an experience replay buffer (it updates purely on consecutive online transitions $(s_t, a_t, r_t, s_{t+1})$).
Explain why the agent can still suffer from catastrophic forgetting and divergence, even though the target network is frozen.

**Solution:**
Even with a frozen target network $\boldsymbol{\theta}^-$, updating on consecutive online transitions violates the i.i.d. assumption:
1. **Locality of Trajectories:** During a period of $C = 1,000$ steps, an agent may spend 500 consecutive steps trapped in a specific visual corner of an Atari game.
2. **Representational Drift:** Performing 500 consecutive SGD updates on virtually identical input states shifts the convolutional weights $\boldsymbol{\theta}$ to minimize loss purely on that visual subspace.
3. **Catastrophic Forgetting:** Because deep neural networks lack tabular isolation, updating weights to fit the current corner overwrites the weights that predicted correct values for the rest of the game.
4. When the hard sync step arrives ($t = C$), the corrupted online parameters $\boldsymbol{\theta}$ are copied into the target network: $\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$. The target network itself is now corrupted, locking in the catastrophic forgetting for the next $C$ steps. Both pillars (Experience Replay AND Target Networks) are strictly necessary; neither suffices alone.

---

### Exercise 4.8: Multi-Step Bootstrapping ($n$-Step Returns) in Replay Buffers
**Problem:** An $n$-step transition tuple is defined as:
$$e_t^{(n)} = \left( s_t, a_t, R_{t:t+n}, s_{t+n}, d_{t+n} \right)$$
where $R_{t:t+n} = \sum_{k=0}^{n-1} \gamma^k r_{t+k+1}$.
Suppose $n = 3$, $\gamma = 0.9$, and an agent experiences rewards $r_1 = 1, r_2 = 0, r_3 = 5$, transitioning $s_0 \to s_1 \to s_2 \to s_3$ without terminating.
1. Calculate the accumulated 3-step discounted reward $R_{0:3}$.
2. Write the Bellman target for $Q(s_0, a_0; \boldsymbol{\theta})$ using target network $\boldsymbol{\theta}^-$.
3. Discuss the trade-off in choosing $n$: how does $n > 1$ affect bias and variance?

**Solution:**
1. Accumulated 3-step reward:
$$R_{0:3} = r_1 + \gamma r_2 + \gamma^2 r_3 = 1 + 0.9(0) + (0.9)^2(5) = 1 + 0 + 0.81 \times 5 = 1 + 4.05 = 5.05$$

2. Bellman target:
$$y^{(3)} = R_{0:3} + \gamma^3 \max_{a'} Q(s_3, a'; \boldsymbol{\theta}^-) = 5.05 + (0.9)^3 \max_{a'} Q(s_3, a'; \boldsymbol{\theta}^-) = 5.05 + 0.729 \max_{a'} Q(s_3, a'; \boldsymbol{\theta}^-)$$

3. Bias-Variance Trade-off:
- **Smaller $n$ ($n=1$):** Heavily relies on the bootstrapped estimate $Q(s_{t+1}, a')$. High bias (if the neural network value estimates are inaccurate), but low variance (since rewards over 1 step are less variable).
- **Larger $n$ ($n \to \infty$):** Approaches pure Monte Carlo returns. Zero bootstrapping bias, but high variance due to the accumulation of stochastic transitions and actions along the trajectory.
- In practice, $n = 3$ (used in Rainbow DQN) provides the empirical sweet spot, dramatically accelerating reward propagation while keeping variance manageable.

---

### Exercise 4.9: Gradient Norm Bounds Under Huber vs Smooth L1
**Problem:** PyTorch and TensorFlow define `SmoothL1Loss` with parameter $\beta$:
$$\ell_\beta(\delta) = \begin{cases}
\frac{0.5 \delta^2}{\beta} & \text{if } |\delta| < \beta \\
|\delta| - 0.5 \beta & \text{otherwise}
\end{cases}$$
1. Verify that for $\beta = 1.0$, this matches the canonical Huber loss with $\kappa = 1.0$.
2. Compute the derivative $\frac{d\ell_\beta}{d\delta}$ for $|\delta| < \beta$ and $|\delta| \ge \beta$.
3. What is the supremum of the gradient magnitude: $\sup_{\delta \in \mathbb{R}} \left|\frac{d\ell_\beta}{d\delta}\right|$?

**Solution:**
1. Substituting $\beta = 1.0$:
- For $|\delta| < 1.0$: $\frac{0.5 \delta^2}{1.0} = \frac{1}{2}\delta^2$.
- For $|\delta| \ge 1.0$: $|\delta| - 0.5(1.0) = |\delta| - 0.5$.
This is identical to the canonical Huber loss with $\kappa = 1.0$.

2. Derivatives:
- For $|\delta| < \beta$:
  $$\frac{d\ell_\beta}{d\delta} = \frac{d}{d\delta}\left(\frac{\delta^2}{2\beta}\right) = \frac{\delta}{\beta}$$
- For $|\delta| \ge \beta$:
  $$\frac{d\ell_\beta}{d\delta} = \frac{d}{d\delta}(|\delta| - 0.5\beta) = \text{sign}(\delta)$$

3. Supremum:
For $|\delta| < \beta$, $\left|\frac{\delta}{\beta}\right| < 1.0$.
For $|\delta| \ge \beta$, $|\text{sign}(\delta)| = 1.0$.
Thus:
$$\sup_{\delta \in \mathbb{R}} \left|\frac{d\ell_\beta}{d\delta}\right| = 1.0$$
The gradient magnitude is strictly bounded by $1.0$ regardless of $\beta$ or the scale of $\delta$.

---

### Exercise 4.10: Complete Target Network Manager Implementation in TypeScript
**Problem:** Write a production-ready TypeScript class `TargetNetworkManager` that wraps two identical models (an online model and a target model) and implements both:
1. Hard periodic synchronization every $C$ steps.
2. Soft Polyak averaging with rate $\tau$.
3. Methods to compute the Bellman target with terminal state masking and Huber loss gradient scaling.

**Solution:**
```typescript
export interface LinearModel {
  weights: number[];
  bias: number;
  forward(x: number[]): number;
}

export class TargetNetworkManager {
  public stepCount: number = 0;

  constructor(
    public onlineWeights: number[],
    public onlineBias: number,
    public targetWeights: number[],
    public targetBias: number,
    public readonly hardSyncInterval: number = 1000,
    public readonly tau: number = 0.005
  ) {
    this.syncHard(); // initialize target = online
  }

  // Hard periodic synchronization
  syncHard(): void {
    for (let i = 0; i < this.onlineWeights.length; i++) {
      this.targetWeights[i] = this.onlineWeights[i];
    }
    this.targetBias = this.onlineBias;
  }

  // Soft Polyak exponential moving average
  syncSoft(): void {
    for (let i = 0; i < this.onlineWeights.length; i++) {
      this.targetWeights[i] = this.tau * this.onlineWeights[i] + (1 - this.tau) * this.targetWeights[i];
    }
    this.targetBias = this.tau * this.onlineBias + (1 - this.tau) * this.targetBias;
  }

  // Update step
  onStep(mode: 'hard' | 'soft'): void {
    this.stepCount++;
    if (mode === 'hard') {
      if (this.stepCount % this.hardSyncInterval === 0) {
        this.syncHard();
      }
    } else {
      this.syncSoft();
    }
  }

  // Compute Bellman Target: y = r + gamma * (1 - done) * maxQ_target
  computeTarget(reward: number, maxNextTargetQ: number, done: boolean, gamma: number = 0.99): number {
    return reward + gamma * (done ? 0 : 1) * maxNextTargetQ;
  }

  // Compute Huber loss derivative: dL/d_delta = clip(delta, -1, 1)
  computeHuberGrad(tdError: number, kappa: number = 1.0): number {
    if (Math.abs(tdError) <= kappa) {
      return tdError;
    }
    return kappa * Math.sign(tdError);
  }
}
```

Verification Test:
```typescript
const mgr = new TargetNetworkManager([1.0, 2.0], 0.5, [0, 0], 0, 2, 0.1);
console.log("Target initialized:", mgr.targetWeights); // [1.0, 2.0]

// Shift online weights
mgr.onlineWeights = [2.0, 4.0];
mgr.onStep('soft'); // tau = 0.1
console.log("After soft sync:", mgr.targetWeights); // [0.1*2 + 0.9*1 = 1.1, 0.1*4 + 0.9*2 = 2.2]

// Check Bellman target with done = true
const targetDone = mgr.computeTarget(10.0, 50.0, true, 0.99);
console.log("Target (done=true):", targetDone); // 10.0

// Check Huber grad for large outlier error
const grad = mgr.computeHuberGrad(42.0);
console.log("Huber grad for error 42.0:", grad); // 1.0
```
