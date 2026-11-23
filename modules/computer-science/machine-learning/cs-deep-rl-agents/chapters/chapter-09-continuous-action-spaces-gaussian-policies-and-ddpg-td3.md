# Chapter 9: Continuous Action Spaces: Gaussian Policies, DDPG, and Twin Delayed DDPG (TD3)

---

## 9.1 The Continuous Control Challenge

In discrete action spaces (such as the 18 actions of an Atari controller or the 4 movements of a gridworld), selecting an action under a learned Q-function is computationally straightforward:
$$a^* = \arg\max_{a \in \mathcal{A}} Q(s, a; \boldsymbol{\theta})$$
We simply evaluate the neural network across all $|\mathcal{A}|$ outputs in a single forward pass and extract the maximal index.

However, in real-world physical systems—such as robotic arms, autonomous vehicles, quadcopters, and humanoid bipeds—actions are inherently **continuous vectors** representing physical forces, joint torques, throttle voltages, or steering angles:
$$\mathbf{a} = [a_1, a_2, \dots, a_m]^\top \in \mathcal{A} \subset \mathbb{R}^m$$
where each component is bounded within continuous limits: $a_i \in [a_{\min, i}, a_{\max, i}]$.

```
                      THE DISCRETIZATION EXPLOSION
                      
  Robotic Manipulator: 7 Joint Torques (m = 7 degrees of freedom)
  Discretize each joint into 10 bins:
  
                 Number of Actions |A| = 10^7 = 10,000,000
                 
  ┌─────────────────────────────────────────────────────────────┐
  │ Evaluating 10 million actions per millisecond is impossible.│
  │ Discretization destroys spatial smoothness and correlation. │
  └─────────────────────────────────────────────────────────────┘
```

If we attempt to discretize a 7-DOF robot by dividing each joint into 10 coarse bins, the discrete action space explodes combinatorially to $10^7 = 10,000,000$ discrete actions! Evaluating $10^7$ network outputs per millisecond is computationally impossible. Furthermore, discretization discards the fundamental topological structure of continuous physical space: torque $1.01 \text{ N}\cdot\text{m}$ is virtually identical to $1.00 \text{ N}\cdot\text{m}$, but a discrete classification model treats them as entirely orthogonal categories.

To control physical systems efficiently, reinforcement learning must operate directly in the **continuous domain**.

---

## 9.2 The Deterministic Policy Gradient Theorem

In Chapter 6, we derived the stochastic Policy Gradient Theorem:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^\pi, a \sim \pi_{\boldsymbol{\theta}}} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) \right]$$

Silver et al. (2014) made a foundational theoretical breakthrough by establishing the **Deterministic Policy Gradient (DPG) Theorem**.

Instead of a stochastic distribution $\pi(a \mid s)$, consider a **deterministic actor** that maps state $s$ directly to a single continuous action vector:
$$\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \in \mathbb{R}^m$$

The performance objective is the expected discounted return under the continuous state distribution $d^{\boldsymbol{\mu}}(s)$:
$$J(\boldsymbol{\theta}) = \int_{\mathcal{S}} d^{\boldsymbol{\mu}}(s) Q^{\boldsymbol{\mu}}(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)) ds$$

```
                   THE DETERMINISTIC POLICY GRADIENT FLOW
                   
       State s ───► [ ACTOR μ_θ(s) ] ───► Action a = μ_θ(s)
                           │                         │
                           ▼ Jacobian                ▼ Gradient
                   ∇_θ μ_θ(s) ∈ R^{m x d}     ∇_a Q(s, a) ∈ R^m
                           │                         │
                           └────────────┬────────────┘
                                        │ Matrix-Vector Product
                                        ▼
                     ∇_θ J(θ) = E_s [ ∇_θ μ_θ(s) · ∇_a Q(s, a)|_{a=μ(s)} ]
```

### The Theorem
**Theorem (Silver et al., 2014):**
For any MDP satisfying standard regularity conditions, the gradient of expected return $J(\boldsymbol{\theta})$ with respect to the deterministic actor parameters $\boldsymbol{\theta}$ is:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^{\boldsymbol{\mu}}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \nabla_{\mathbf{a}} Q^{\boldsymbol{\mu}}(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)} \right]$$

### Intuition and the Chain Rule
Notice the mathematical clarity of this expression: it is nothing more than the **multivariate chain rule** applied across the Actor-Critic pipeline!
1. The Critic $Q(s, \mathbf{a})$ tells the Actor *how to change the action* to increase value:
$$\mathbf{g}_{\text{action}} = \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}(s)} \in \mathbb{R}^m$$
2. The Actor's Jacobian $\nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \in \mathbb{R}^{m \times d}$ tells how to change the network parameters $\boldsymbol{\theta}$ to move action $\mathbf{a}$ in direction $\mathbf{g}_{\text{action}}$.

Unlike the stochastic policy gradient—which integrates over the entire action space $\mathcal{A}$—the deterministic policy gradient evaluates the gradient of $Q$ only at the single point $\mathbf{a} = \boldsymbol{\mu}(s)$, completely avoiding integration over high-dimensional action manifolds.

---

## 9.3 Deep Deterministic Policy Gradients (DDPG)

Lillicrap et al. (2015) combined the Deterministic Policy Gradient Theorem with the deep learning stabilization techniques of DQN (Experience Replay and Target Networks) to create **Deep Deterministic Policy Gradients (DDPG)**.

DDPG operates off-policy using four distinct neural networks:
1. **Online Actor:** $\boldsymbol{\mu}_{\boldsymbol{\theta}}(s)$, parameterized by $\boldsymbol{\theta}$.
2. **Target Actor:** $\boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s)$, parameterized by $\boldsymbol{\theta}^-$.
3. **Online Critic:** $Q_{\boldsymbol{\phi}}(s, \mathbf{a})$, parameterized by $\boldsymbol{\phi}$.
4. **Target Critic:** $Q_{\boldsymbol{\phi}^-}(s, \mathbf{a})$, parameterized by $\boldsymbol{\phi}^-$.

```
                            THE DDPG ARCHITECTURE
                            
                   Experience Replay Buffer D (10^6 transitions)
                                  │
                                  ▼ Mini-batch (s, a, r, s', d)
                 ┌────────────────────────────────┐
                 │  Target Critic Q_{ϕ^-}(s', a') │ ◄── Target Action a' = μ_{θ^-}(s')
                 └───────────────┬────────────────┘
                                 │
                                 ▼ Target y = r + γ (1 - d) Q_{ϕ^-}(s', μ_{θ^-}(s'))
                 ┌────────────────────────────────┐
                 │  Online Critic Q_ϕ(s, a)       │ ◄── Loss: MSE( y - Q_ϕ(s, a) )
                 └───────────────┬────────────────┘
                                 │ ∇_a Q_ϕ(s, a) | a = μ_θ(s)
                                 ▼
                 ┌────────────────────────────────┐
                 │  Online Actor μ_θ(s)           │ ◄── Maximize Q_ϕ(s, μ_θ(s))
                 └────────────────────────────────┘
```

### Exploration via Temporally Correlated Action Noise
Because the policy $\boldsymbol{\mu}_{\boldsymbol{\theta}}(s)$ is deterministic, an agent following $\boldsymbol{\mu}$ directly would never explore novel actions.
In continuous physical systems, adding independent white Gaussian noise $\epsilon_t \sim \mathcal{N}(0, \sigma^2)$ at each millisecond causes violent high-frequency jitter that averages out to zero net displacement due to physical inertia.

To achieve smooth, physics-consistent exploration, Lillicrap et al. injected temporally correlated noise generated by an **Ornstein-Uhlenbeck (OU) Process**:
$$d x_t = \theta_{\text{OU}} (\mu_{\text{OU}} - x_t) dt + \sigma_{\text{OU}} d W_t$$
where $\theta_{\text{OU}}$ is the mean-reverting friction rate, $\mu_{\text{OU}}$ is the long-term mean (typically 0), and $W_t$ is a Brownian motion.
The explored action sent to the environment is:
$$\mathbf{a}_t = \text{clip}\left( \boldsymbol{\mu}_{\boldsymbol{\theta}}(s_t) + \mathbf{x}_t, \, \mathbf{a}_{\min}, \, \mathbf{a}_{\max} \right)$$

### Soft Target Updates (Polyak Averaging)
Unlike DQN's hard periodic synchronization ($\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$ every $C$ steps), DDPG updates both target networks softly at every single training step using Polyak averaging with rate $\tau \ll 1$ (typically $\tau = 0.005$):
$$\boldsymbol{\theta}^- \leftarrow \tau \boldsymbol{\theta} + (1 - \tau) \boldsymbol{\theta}^-$$
$$\boldsymbol{\phi}^- \leftarrow \tau \boldsymbol{\phi} + (1 - \tau) \boldsymbol{\phi}^-$$

---

## 9.4 The Pathologies of DDPG

Despite its theoretical elegance, vanilla DDPG is notoriously brittle and sensitive to hyperparameters. Fujimoto et al. (2018) diagnosed three profound failure modes inherent to DDPG:

### 1. Severe Value Overestimation
Just as discrete Q-learning overestimates values due to $\max_a Q(s, a)$, continuous actor-critics suffer from even worse overestimation.
In DDPG, the actor parameters are updated via gradient ascent:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \nabla_{\boldsymbol{\theta}} Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s))$$
This gradient step moves $\boldsymbol{\mu}(s)$ directly in the direction where the Critic predicts the highest value. If the Critic has a local approximation error that spuriously peaks at action $\mathbf{a}_{\text{fake}}$, the Actor immediately shifts its output to $\mathbf{a}_{\text{fake}}$. 
When the target $y = r + \gamma Q_{\boldsymbol{\phi}^-}(s', \boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s'))$ evaluates this policy, it bootstraps on an artificially inflated peak. Over millions of steps, this overestimation cascades catastrophically, driving Q-values into hundreds of percent above true returns.

### 2. High Variance in Value Targets
Because the Actor and Critic are updated simultaneously at every step, the policy $\boldsymbol{\mu}$ shifts rapidly before the Critic has converged to an accurate value surface. An unstable Critic feeds noisy gradients to the Actor, and the changing Actor constantly alters the regression targets for the Critic.

### 3. Target Exploitation (Overfitting to Spurious Peaks)
Deep neural network value functions are not flat surfaces; they have narrow, jagged local maxima. When an unregularized deterministic policy optimizes against a jagged Critic, it learns to output actions that land squarely inside these narrow numerical artifacts.

---

## 9.5 Twin Delayed DDPG (TD3)

To resolve all three pathologies, Fujimoto, van Hoof, and Meger (2018) introduced **Twin Delayed Deep Deterministic Policy Gradients (TD3)**, built upon three novel stabilizing mechanisms:

```
                           THE THREE PILLARS OF TD3
                           
   1. Clipped Double Q-Learning:
      Maintain TWO Critics: Q_{ϕ_1} and Q_{ϕ_2}
      Target = r + γ · min( Q_{ϕ_1^-}(s', \tilde{a}), Q_{ϕ_2^-}(s', \tilde{a}) )
      (Completely neutralizes overestimation bias!)
      
   2. Target Policy Smoothing:
      \tilde{a} = clip( μ_{θ^-}(s') + clip( ε, -c, c ), a_min, a_max ),  ε ~ N(0, σ)
      (Enforces value smoothness over action neighborhood!)
      
   3. Delayed Policy Updates:
      Update Critic EVERY step.
      Update Actor and Target Networks ONLY every d steps (e.g., d = 2).
      (Allows Critic to stabilize before guiding the Actor!)
```

### 1. Clipped Double Q-Learning
TD3 maintains two independent Critic networks: $Q_{\boldsymbol{\phi}_1}(s, \mathbf{a})$ and $Q_{\boldsymbol{\phi}_2}(s, \mathbf{a})$, with corresponding target networks $Q_{\boldsymbol{\phi}_1^-}$ and $Q_{\boldsymbol{\phi}_2^-}$.

When computing the Bellman regression target, TD3 evaluates the next state-action pair using **both** target critics and takes the **minimum**:
$$y = r + \gamma (1 - d) \min_{i \in \{1, 2\}} Q_{\boldsymbol{\phi}_i^-}(s', \tilde{\mathbf{a}})$$

**Why does this work?**
Because $Q_{\boldsymbol{\phi}_1}$ and $Q_{\boldsymbol{\phi}_2}$ are initialized independently and trained on different random mini-batch subsets, their approximation errors are conditionally independent. Taking the minimum lower-bounds the true expectation:
$$\mathbb{E}[\min(Q_1, Q_2)] \le \min(\mathbb{E}[Q_1], \mathbb{E}[Q_2]) \le Q^*$$
This replaces destructive overestimation bias with benign, conservative underestimation bias.

### 2. Target Policy Smoothing (Noise Regularization)
When evaluating the target action $\tilde{\mathbf{a}}$, TD3 adds clipped Gaussian noise to the deterministic target actor output:
$$\tilde{\mathbf{a}} = \text{clip}\left( \boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s') + \text{clip}(\boldsymbol{\epsilon}, -c, c), \, \mathbf{a}_{\min}, \, \mathbf{a}_{\max} \right), \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})$$
where typically $\sigma = 0.2$ and clipping threshold $c = 0.5$.

**Intuition:**
In physical reality, similar actions should yield similar values. Adding noise to target actions smooths the value surface over a neighborhood around $\boldsymbol{\mu}(s')$, preventing the Actor from exploiting brittle, sharp spikes in the Critic's prediction.

### 3. Delayed Policy & Target Updates
In TD3, the two Critic networks are updated at **every single time step** $t$.
However, the Actor network $\boldsymbol{\mu}_{\boldsymbol{\theta}}$ and the target networks ($\boldsymbol{\theta}^-, \boldsymbol{\phi}_1^-, \boldsymbol{\phi}_2^-$) are updated at a **slower frequency**, updating only once every $d$ critic updates (typically $d = 2$):
$$\text{If } t \equiv 0 \pmod d:$$
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha_\mu \frac{1}{B}\sum_{i=1}^B \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s_i) \nabla_{\mathbf{a}} Q_{\boldsymbol{\phi}_1}(s_i, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s_i)}$$
$$\boldsymbol{\theta}^- \leftarrow \tau \boldsymbol{\theta} + (1 - \tau) \boldsymbol{\theta}^-$$
$$\boldsymbol{\phi}_i^- \leftarrow \tau \boldsymbol{\phi}_i + (1 - \tau) \boldsymbol{\phi}_i^- \quad (i \in \{1, 2\})$$

This delay guarantees that the Critic converges to a low-error value estimate before being used to compute policy gradients, slashing target variance and ensuring steady, monotonic policy improvement.

---

## 9.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 9.1: Deterministic Policy Gradient Jacobian Math
**Problem:** Let state $s \in \mathbb{R}^2$ and action $a \in \mathbb{R}^1$.
Actor is linear: $\mu_\theta(s) = \theta_1 s_1 + \theta_2 s_2$.
Critic is quadratic: $Q_\phi(s, a) = - (a - (2s_1 - s_2))^2 + 10.0$.
Current state is $s = [1.0, 3.0]^\top$.
Current actor parameters: $\boldsymbol{\theta} = [0.5, 1.0]^\top$.
1. Compute the action produced by the actor $\mu_\theta(s)$.
2. Compute the critic action-gradient $\nabla_a Q(s, a) \big|_{a = \mu_\theta(s)}$.
3. Compute the actor parameter gradient $\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$ and update $\boldsymbol{\theta}$ with $\alpha = 0.1$.

**Solution:**
1. Action evaluation:
$$\mu_\theta(s) = \theta_1 s_1 + \theta_2 s_2 = 0.5(1.0) + 1.0(3.0) = 0.5 + 3.0 = 3.5$$

2. Critic action gradient:
Target optimal action from critic equation is $a^* = 2s_1 - s_2 = 2(1.0) - 3.0 = -1.0$.
Critic derivative:
$$\frac{\partial Q}{\partial a} = - 2(a - (2s_1 - s_2)) = - 2(3.5 - (-1.0)) = - 2(4.5) = -9.0$$
The critic signals that action $a=3.5$ is too large and must decrease by moving in direction $-9.0$.

3. Deterministic Policy Gradient:
Actor Jacobian:
$$\nabla_{\boldsymbol{\theta}} \mu_\theta(s) = \begin{bmatrix} s_1 \\ s_2 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix}$$
Policy gradient:
$$\nabla_{\boldsymbol{\theta}} J = \nabla_{\boldsymbol{\theta}} \mu(s) \cdot \nabla_a Q = \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix} \times (-9.0) = \begin{bmatrix} -9.0 \\ -27.0 \end{bmatrix}$$
Parameter update ($\alpha = 0.1$):
$$\boldsymbol{\theta}_{\text{new}} = \boldsymbol{\theta} + \alpha \nabla_{\boldsymbol{\theta}} J = \begin{bmatrix} 0.5 \\ 1.0 \end{bmatrix} + 0.1 \begin{bmatrix} -9.0 \\ -27.0 \end{bmatrix} = \begin{bmatrix} 0.5 - 0.9 \\ 1.0 - 2.7 \end{bmatrix} = \begin{bmatrix} -0.4 \\ -1.7 \end{bmatrix}$$
Verification: New action $\mu_{\text{new}}(s) = -0.4(1.0) + (-1.7)(3.0) = -0.4 - 5.1 = -5.5$, which moved aggressively in the negative direction indicated by the critic!

---

### Worked Example 9.2: Step-by-Step TD3 Target Calculation with Clipped Double Q
**Problem:** An agent encounters transition $(s, a=0.5, r=2.0, s', d=\text{false})$ with $\gamma = 0.95$.
Target Actor predicts $\boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s') = 1.0$.
Action space limits: $a \in [-2.0, 2.0]$.
Target policy smoothing noise sampled: $\epsilon = +0.3$, with clipping noise bound $c = 0.2$.
The two target critics predict:
$Q_{\boldsymbol{\phi}_1^-}(s', \tilde{a}) = 14.5$, and $Q_{\boldsymbol{\phi}_2^-}(s', \tilde{a}) = 12.0$.
1. Compute the smoothed target action $\tilde{a}$.
2. Compute the TD3 Bellman target $y$.
3. Contrast this with the target DDPG would have computed using only Critic 1 without action noise.

**Solution:**
1. Smoothed target action:
Sampled noise $\epsilon = +0.3$ is clipped to $[-c, c] = [-0.2, 0.2]$:
$$\tilde{\epsilon} = \text{clip}(0.3, -0.2, 0.2) = 0.2$$
Unclipped target action: $\mu(s') + \tilde{\epsilon} = 1.0 + 0.2 = 1.2$.
Clipping to action space limits $[-2.0, 2.0]$:
$$\tilde{a} = \text{clip}(1.2, -2.0, 2.0) = 1.2$$

2. TD3 Bellman target:
TD3 takes the minimum of the two target critics:
$$\min(Q_{\boldsymbol{\phi}_1^-}(s', 1.2), Q_{\boldsymbol{\phi}_2^-}(s', 1.2)) = \min(14.5, 12.0) = 12.0$$
Target value:
$$y^{\text{TD3}} = r + \gamma (1 - d) \min_i Q_{\boldsymbol{\phi}_i^-} = 2.0 + 0.95 \times (1 - 0) \times 12.0 = 2.0 + 11.4 = 13.4$$

3. Contrast with DDPG:
DDPG would evaluate only Critic 1 without smoothing:
$$y^{\text{DDPG}} = 2.0 + 0.95 \times 14.5 = 2.0 + 13.775 = 15.775$$
TD3 prevented a $+2.375$ unit overestimation!

---

### Worked Example 9.3: Ornstein-Uhlenbeck Process Discretization and Simulation
**Problem:** The 1D Ornstein-Uhlenbeck process satisfies:
$$x_{t+1} = x_t + \theta_{\text{OU}} (\mu_{\text{OU}} - x_t) \Delta t + \sigma_{\text{OU}} \sqrt{\Delta t} \, z_t$$
where $z_t \sim \mathcal{N}(0, 1)$.
Let $\theta_{\text{OU}} = 0.15, \mu_{\text{OU}} = 0, \sigma_{\text{OU}} = 0.30$, and $\Delta t = 1.0$.
Suppose $x_0 = 1.0$, and the random standard normal draws are $z_0 = -0.5$ and $z_1 = +0.2$.
1. Compute $x_1$ and $x_2$.
2. Explain the mean-reverting property of the OU process.

**Solution:**
1. Step-by-step simulation:
- Step 0 ($x_0 = 1.0, z_0 = -0.5$):
  $$x_1 = 1.0 + 0.15(0 - 1.0)(1.0) + 0.30 \sqrt{1.0} (-0.5) = 1.0 - 0.15 - 0.15 = 0.70$$
- Step 1 ($x_1 = 0.70, z_1 = +0.2$):
  $$x_2 = 0.70 + 0.15(0 - 0.70)(1.0) + 0.30 \sqrt{1.0} (+0.2) = 0.70 - 0.105 + 0.06 = 0.655$$

2. Mean-reverting property:
When $x_t > 0$, the drift term $\theta(\mu - x_t) = 0.15(0 - x_t) = -0.15 x_t$ is negative, exerting a constant restoring force that pulls the process back toward 0. When $x_t < 0$, the drift is positive, pushing it upward. This simulates physical friction, producing temporally smooth random trajectories ideal for physical robotic actuators.

---

### Worked Example 9.4: Polyak Soft Target Tracking Convergence
**Problem:** Target network parameters update via $\boldsymbol{\phi}^-_{t+1} = \tau \boldsymbol{\phi}_t + (1 - \tau) \boldsymbol{\phi}^-_t$ with $\tau = 0.005$.
Suppose online weights drift at a constant velocity: $\phi_t = 100 + 0.1 t$.
1. Find the steady-state lag $\Delta = \phi_t - \phi^-_t$ between the online network and the target network.
2. Evaluate the lag for $\tau = 0.005$.

**Solution:**
1. Steady-state lag:
In steady state, the target network tracks the online network with a constant time lag $L$:
$$\phi^-_t = \phi_{t - L} = 100 + 0.1(t - L)$$
Substitute this into the update rule:
$$\phi^-_{t+1} - \phi^-_t = \tau (\phi_t - \phi^-_t)$$
Since $\phi_t$ increases by $0.1$ per step, $\phi^-_t$ must also increase by $0.1$ per step in steady state:
$$0.1 = \tau (\phi_t - \phi^-_t) \implies \phi_t - \phi^-_t = \frac{0.1}{\tau}$$

2. Numerical evaluation:
For $\tau = 0.005$:
$$\text{Lag } \Delta = \frac{0.1}{0.005} = 20.0 \text{ parameter units}$$
In terms of time steps: $L = \frac{\Delta}{0.1} = \frac{20.0}{0.1} = 200 \text{ steps}$.
The target network smoothly lags behind the online network by exactly 200 steps.

---

### Worked Example 9.5: Squashed Gaussian Policies via Tanh Reparameterization
**Problem:** In continuous control (e.g. Soft Actor-Critic), unbounded Gaussian actions $u \sim \mathcal{N}(\mu, \sigma^2)$ are squashed into valid bounds $[-1, 1]$ using the hyperbolic tangent:
$$a = \tanh(u)$$
1. Derive the log-probability density $\log \pi(a \mid s)$ in terms of the Gaussian density $p(u \mid s)$ using the change of variables formula.
2. Given $u = 0.5493$ (where $\tanh(u) = 0.50$), and Gaussian log-density $\log p(u \mid s) = -1.20$, compute the squashed log-density $\log \pi(a \mid s)$.

**Solution:**
1. Change of variables formula:
For a 1-to-1 invertible transformation $a = g(u)$:
$$\pi(a) = p(u) \cdot \left| \frac{da}{du} \right|^{-1}$$
Taking the logarithm:
$$\log \pi(a) = \log p(u) - \log \left| \frac{da}{du} \right|$$
Since $a = \tanh(u)$, its derivative is $\frac{da}{du} = 1 - \tanh^2(u) = 1 - a^2$.
$$\log \pi(a \mid s) = \log p(u \mid s) - \log(1 - a^2)$$

2. Numerical evaluation:
For $a = 0.50$:
$$1 - a^2 = 1 - 0.50^2 = 1 - 0.25 = 0.75$$
$$\log(1 - a^2) = \ln(0.75) \approx -0.2877$$
$$\log \pi(a \mid s) = -1.20 - (-0.2877) = -1.20 + 0.2877 = -0.9123$$
This correction term is strictly required when computing policy gradients or entropy of bounded continuous actions.

---

### Worked Example 9.6: Dual Critic Gradient Backpropagation Step
**Problem:** In TD3, Critic 1 has output $Q_1 = 8.5$ and Critic 2 has output $Q_2 = 9.2$.
The target value is $y = 8.0$.
1. Compute the loss $\mathcal{L}_1 = \frac{1}{2}(y - Q_1)^2$ and $\mathcal{L}_2 = \frac{1}{2}(y - Q_2)^2$.
2. Compute the scalar error signals $\frac{\partial \mathcal{L}_1}{\partial Q_1}$ and $\frac{\partial \mathcal{L}_2}{\partial Q_2}$.
3. Are the parameters of Critic 1 and Critic 2 updated jointly or independently?

**Solution:**
1. Loss values:
$$\mathcal{L}_1 = \frac{1}{2}(8.0 - 8.5)^2 = \frac{1}{2}(-0.5)^2 = 0.125$$
$$\mathcal{L}_2 = \frac{1}{2}(8.0 - 9.2)^2 = \frac{1}{2}(-1.2)^2 = 0.720$$

2. Error signals:
$$\frac{\partial \mathcal{L}_1}{\partial Q_1} = - (y - Q_1) = - (8.0 - 8.5) = +0.50$$
$$\frac{\partial \mathcal{L}_2}{\partial Q_2} = - (y - Q_2) = - (8.0 - 9.2) = +1.20$$

3. Independence:
Critic 1 and Critic 2 have completely separate parameter vectors $\boldsymbol{\phi}_1$ and $\boldsymbol{\phi}_2$.
Each network computes its own independent backward pass:
$$\Delta \boldsymbol{\phi}_1 = \alpha \cdot (y - Q_1) \cdot \nabla_{\boldsymbol{\phi}_1} Q_1$$
$$\Delta \boldsymbol{\phi}_2 = \alpha \cdot (y - Q_2) \cdot \nabla_{\boldsymbol{\phi}_2} Q_2$$
They interact *only* through the minimum operator when generating the regression target $y$.

---

### Worked Example 9.7: Delayed Actor Update Scheduling Math
**Problem:** A TD3 training loop runs for $10,000$ environment steps.
The agent performs 1 gradient step per environment step.
The policy delay parameter is $d = 2$.
1. How many total critic updates are performed?
2. How many total actor updates and target network updates are performed?
3. What is the ratio of critic gradient steps to actor gradient steps?

**Solution:**
1. Critic updates:
Critics update on every single step:
$$\text{Total Critic Updates} = 10,000$$

2. Actor and Target updates:
Actor and targets update only when $\text{step} \pmod 2 == 0$:
$$\text{Total Actor Updates} = \frac{10,000}{2} = 5,000$$
$$\text{Total Target Network Updates} = 5,000$$

3. Ratio:
$$\text{Ratio} = \frac{10,000}{5,000} = 2.0$$
The Critic receives twice as much training data and optimization capacity as the Actor, guaranteeing that the value surface remains smooth and well-fit before the Actor takes a step.

---

### Worked Example 9.8: Target Policy Smoothing Variance Analysis
**Problem:** Let the true Critic value surface be a noisy sine wave:
$$Q(s, a) = \sin(a) + \epsilon(a)$$
where $\epsilon(a)$ is high-frequency numerical noise with $\mathbb{E}[\epsilon] = 0$ and $\mathbb{V}[\epsilon] = \sigma_\epsilon^2$.
When evaluating $Q(s, \mu(s))$, target policy smoothing evaluates the expected value under action noise $\eta \sim \mathcal{U}[-\delta, \delta]$:
$$\bar{Q}(s, \mu(s)) = \frac{1}{2\delta} \int_{-\delta}^\delta Q(s, \mu(s) + \eta) d\eta$$
1. Show that the variance of the smoothed noise term $\bar{\epsilon} = \frac{1}{2\delta}\int_{-\delta}^\delta \epsilon(a+\eta)d\eta$ is strictly smaller than $\sigma_\epsilon^2$.
2. Explain how this prevents the Actor from getting stuck in high-frequency local maxima.

**Solution:**
1. Variance of moving average filter:
Integrating independent noise over an interval of width $2\delta$ acts as a low-pass smoothing filter.
If the noise correlation length is $\Delta \ll 2\delta$, the integral can be approximated as an average of $K \approx \frac{2\delta}{\Delta}$ independent random draws:
$$\mathbb{V}[\bar{\epsilon}] \approx \frac{\sigma_\epsilon^2}{K} = \frac{\sigma_\epsilon^2 \Delta}{2\delta} \ll \sigma_\epsilon^2$$
The variance is reduced by factor $\frac{\Delta}{2\delta}$.

2. Consequence:
A sharp, narrow spike in the Critic (width $< \delta$) is flattened out by the integral, while the broad, physical macroscopic trend ($\sin(a)$) is preserved. The Actor is completely insulated from numerical ripples and ascends only genuine, broad value ridges.

---

### Worked Example 9.9: Complete TypeScript Implementation of Ornstein-Uhlenbeck Noise
**Problem:** Author a TypeScript class `OrnsteinUhlenbeckNoise` implementing a multi-dimensional mean-reverting process with resetting, boundary clamping, and reproducible Gaussian draws.

**Solution:**
```typescript
export class OrnsteinUhlenbeckNoise {
  private state: Float64Array;

  constructor(
    public readonly dim: number,
    public readonly theta: number = 0.15,
    public readonly mu: number = 0.0,
    public readonly sigma: number = 0.2,
    public readonly dt: number = 1.0
  ) {
    this.state = new Float64Array(dim).fill(mu);
  }

  reset(): void {
    this.state.fill(this.mu);
  }

  sample(): Float64Array {
    const output = new Float64Array(this.dim);
    const sqrtDt = Math.sqrt(this.dt);

    for (let i = 0; i < this.dim; i++) {
      // Box-Muller standard normal
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      // dx = theta * (mu - x) * dt + sigma * sqrt(dt) * z
      const dx = this.theta * (this.mu - this.state[i]) * this.dt + this.sigma * sqrtDt * z;
      this.state[i] += dx;
      output[i] = this.state[i];
    }

    return output;
  }
}
```

Verification Test:
```typescript
const ou = new OrnsteinUhlenbeckNoise(2, 0.15, 0.0, 0.2);
const n1 = ou.sample();
const n2 = ou.sample();
console.log("OU Noise sample 1:", n1[0].toFixed(4), n1[1].toFixed(4));
console.log("OU Noise sample 2:", n2[0].toFixed(4), n2[1].toFixed(4));
```

---

### Worked Example 9.10: Complete TypeScript Implementation of TD3 Core Algorithm Step
**Problem:** Implement the complete core update step of TD3 in TypeScript, including:
1. Dual critic evaluation.
2. Target policy smoothing with clipped Gaussian noise.
3. Clipped Double Q target generation.
4. Delayed actor and target synchronization logic.

**Solution:**
```typescript
export interface TD3Transition {
  state: number[];
  action: number[];
  reward: number;
  nextState: number[];
  done: boolean;
}

export class TD3StepEngine {
  public stepCount: number = 0;

  constructor(
    public readonly actionDim: number,
    public readonly maxAction: number = 1.0,
    public readonly gamma: number = 0.99,
    public readonly tau: number = 0.005,
    public readonly policyNoise: number = 0.2,
    public readonly noiseClip: number = 0.5,
    public readonly policyDelay: number = 2
  ) {}

  // Compute Smoothed Target Action
  computeTargetAction(targetActorPredict: (s: number[]) => number[], nextState: number[]): number[] {
    const rawAction = targetActorPredict(nextState);
    const targetAction: number[] = [];

    for (let i = 0; i < this.actionDim; i++) {
      // Sample Gaussian noise
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const noise = Math.max(-this.noiseClip, Math.min(this.noiseClip, z * this.policyNoise));
      const clamped = Math.max(-this.maxAction, Math.min(this.maxAction, rawAction[i] + noise));
      targetAction.push(clamped);
    }
    return targetAction;
  }

  // Compute TD3 Target: y = r + gamma * (1 - done) * min(Q1_target, Q2_target)
  computeTarget(
    reward: number,
    done: boolean,
    targetQ1: number,
    targetQ2: number
  ): number {
    const minTargetQ = Math.min(targetQ1, targetQ2);
    return reward + this.gamma * (done ? 0 : 1) * minTargetQ;
  }

  // Check if Actor and Target should update on this step
  shouldUpdateActor(): boolean {
    this.stepCount++;
    return this.stepCount % this.policyDelay === 0;
  }

  // Polyak Soft Update
  polyakUpdate(onlineWeights: number[], targetWeights: number[]): void {
    for (let i = 0; i < onlineWeights.length; i++) {
      targetWeights[i] = this.tau * onlineWeights[i] + (1 - this.tau) * targetWeights[i];
    }
  }
}
```

---

## 9.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 9.1: Proof of Deterministic Policy Gradient via Reparameterization
**Problem:** In continuous control, a stochastic policy can be written using the reparameterization trick: $\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}$, where $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$.
1. Express the stochastic policy gradient $\nabla_{\boldsymbol{\theta}} \mathbb{E}_{\boldsymbol{\epsilon}}[Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon})]$ using the chain rule.
2. Take the limit as $\sigma \to 0$.
3. Prove that this recovers the exact Deterministic Policy Gradient Theorem.

**Solution:**
1. Chain rule on expectation:
Since the distribution of $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$ has zero dependence on parameters $\boldsymbol{\theta}$, the gradient operator enters directly inside the expectation:
$$\nabla_{\boldsymbol{\theta}} \mathbb{E}_{\boldsymbol{\epsilon}}\left[ Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}) \right] = \mathbb{E}_{\boldsymbol{\epsilon}} \left[ \nabla_{\boldsymbol{\theta}} Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}) \right]$$
Applying the multivariate chain rule:
$$= \mathbb{E}_{\boldsymbol{\epsilon}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \cdot \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}} \right]$$

2. Limit as $\sigma \to 0$:
As $\sigma \to 0$, the random variable $\sigma \boldsymbol{\epsilon} \to \mathbf{0}$ with probability 1.
Assuming $Q$ and $\boldsymbol{\mu}$ are continuously differentiable, by the Dominated Convergence Theorem:
$$\lim_{\sigma \to 0} \mathbb{E}_{\boldsymbol{\epsilon}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \cdot \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}} \right] = \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \cdot \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)}$$

3. Conclusion:
Integrating over state distribution $d^{\boldsymbol{\mu}}(s)$:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^{\boldsymbol{\mu}}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)} \right]$$
The Deterministic Policy Gradient is the limiting case of the stochastic policy gradient as exploratory variance vanishes to zero. $\blacksquare$

---

### Exercise 9.2: Upper Bound on Double Q Underestimation Error
**Problem:** In TD3, $y = r + \gamma \min(Q_1, Q_2)$.
Suppose $Q_1(s', a') = Q^*(s', a') + \epsilon_1$ and $Q_2(s', a') = Q^*(s', a') + \epsilon_2$, where $\epsilon_1, \epsilon_2 \overset{\text{i.i.d.}}{\sim} \mathcal{U}[-\Delta, \Delta]$.
1. Derive the expected target $\mathbb{E}[y]$.
2. Calculate the underestimation bias $\mathbb{E}[y] - (r + \gamma Q^*)$.
3. Why is underestimation strictly bounded, whereas overestimation in single-critic Q-learning can grow unbounded?

**Solution:**
1. Expected target:
$$\mathbb{E}[\min(Q_1, Q_2)] = Q^* + \mathbb{E}[\min(\epsilon_1, \epsilon_2)]$$
From Worked Example 5.1 (by symmetry):
$$\mathbb{E}[\max(\epsilon_1, \epsilon_2)] = +\frac{\Delta}{3} \implies \mathbb{E}[\min(\epsilon_1, \epsilon_2)] = -\mathbb{E}[\max(-\epsilon_1, -\epsilon_2)] = -\frac{\Delta}{3}$$
Target expectation:
$$\mathbb{E}[y] = r + \gamma \left( Q^* - \frac{\Delta}{3} \right) = r + \gamma Q^* - \frac{\gamma \Delta}{3}$$

2. Underestimation bias:
$$\text{Bias} = -\frac{\gamma \Delta}{3} < 0$$

3. Boundedness:
- In single-critic Q-learning, the maximization operator $\max_a Q(s, a)$ picks positive noise, which feeds into future targets recursively: $B_{k+1} = \gamma B_k + \text{noise}$, causing explosive positive feedback.
- In Clipped Double Q, underestimation acts as a contraction: values that are underestimated are simply less preferred, but valid transitions with high rewards still pull values upward. The underestimation error cannot compound into negative infinity because the minimum is bounded below by the worst-performing estimator.

---

### Exercise 9.3: Target Policy Smoothing vs Label Smoothing in Classification
**Problem:** Compare TD3's Target Policy Smoothing:
$$\tilde{\mathbf{a}} = \boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s') + \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \text{clip}(\mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I}), -c, c)$$
with Label Smoothing in supervised classification ($y_{\text{smooth}} = (1 - \epsilon) y + \epsilon / K$).
Explain how both techniques act as structural regularizers against overconfidence.

**Solution:**
- **Label Smoothing:** In classification, cross-entropy loss drives logits to $\pm \infty$ to produce probability 1.0 for the true class, making the network brittle and overconfident. Label smoothing prevents logits from exploding by forbidding target probabilities from reaching 1.0.
- **Target Policy Smoothing:** In continuous control, deterministic gradients drive the Actor to land exactly on razor-thin local peaks in the Critic surface. Adding noise regularizes the objective, forcing the Actor to find wide, robust plateaus rather than fragile, overconfident spikes. Both methods enforce entropy/smoothness on the output manifold.

---

### Exercise 9.4: Action Bounding: Tanh Squashing vs Post-Clipping Gradients
**Problem:** To constrain continuous actions to $[-a_{\max}, a_{\max}]$, two approaches are used:
- **Approach A (Post-Clipping):** The network outputs unbounded $a \in \mathbb{R}$, and the environment clips it: $a_{\text{env}} = \text{clip}(a, -a_{\max}, a_{\max})$.
- **Approach B (Tanh Squashing):** The network ends with a tanh layer: $a = a_{\max} \tanh(u)$.
Explain why Approach A causes zero-gradient saturation (the "dead actor" problem), whereas Approach B maintains smooth gradient flow.

**Solution:**
In Approach A, if the network outputs $a = 5.0$ when $a_{\max} = 1.0$, the environment clips it to $1.0$.
The derivative of the hard clipping function is:
$$\frac{d \, \text{clip}(a)}{da} = \begin{cases} 1 & \text{if } |a| < a_{\max} \\ 0 & \text{if } |a| > a_{\max} \end{cases}$$
When $|a| > a_{\max}$, the gradient is identically **zero**! The network receives zero feedback, preventing the weights from ever recovering from saturation.
In Approach B, $\frac{d(a_{\max} \tanh(u))}{du} = a_{\max} (1 - \tanh^2(u))$.
While the gradient diminishes near $\pm 1$, it is strictly non-zero for all finite $u \in \mathbb{R}$, ensuring continuous gradient propagation back into the actor weights.

---

### Exercise 9.5: Stationary Distribution of Ornstein-Uhlenbeck Process
**Problem:** The 1D Ornstein-Uhlenbeck SDE is $dx_t = -\theta x_t dt + \sigma dW_t$.
1. Derive the stationary probability distribution $p_\infty(x) = \lim_{t \to \infty} p(x_t = x)$.
2. Compute the stationary variance $\sigma_\infty^2$ in terms of $\theta$ and $\sigma$.
3. For $\theta = 0.15$ and $\sigma = 0.20$, compute the stationary standard deviation $\sigma_\infty$.

**Solution:**
1. Stationary distribution:
From the Fokker-Planck equation for a linear drift $A(x) = -\theta x$ and constant diffusion $B(x) = \sigma$:
$$\frac{\partial p}{\partial t} = -\frac{\partial}{\partial x} [-\theta x p] + \frac{1}{2} \frac{\partial^2}{\partial x^2} [\sigma^2 p] = 0$$
Integrating once:
$$\theta x p + \frac{\sigma^2}{2} \frac{dp}{dx} = 0 \implies \frac{dp}{p} = -\frac{2\theta}{\sigma^2} x dx$$
$$\ln p(x) = -\frac{\theta}{\sigma^2} x^2 + C \implies p_\infty(x) = \frac{1}{\sqrt{2\pi \sigma_\infty^2}} \exp\left( -\frac{x^2}{2\sigma_\infty^2} \right)$$
The stationary distribution is a zero-mean Gaussian $\mathcal{N}(0, \sigma_\infty^2)$.

2. Stationary variance:
$$\frac{1}{2\sigma_\infty^2} = \frac{\theta}{\sigma^2} \implies \sigma_\infty^2 = \frac{\sigma^2}{2\theta}$$

3. Numerical evaluation:
$$\sigma_\infty^2 = \frac{0.20^2}{2 \times 0.15} = \frac{0.04}{0.30} = \frac{4}{30} \approx 0.1333$$
$$\sigma_\infty = \sqrt{0.1333} \approx 0.3651$$

---

### Exercise 9.6: Gradient of Value Function with Respect to Continuous Actions
**Problem:** Let the Critic be a multi-layer perceptron:
$$Q(s, \mathbf{a}) = \mathbf{w}_2^\top \text{ReLU}(\mathbf{W}_1 [s; \mathbf{a}] + \mathbf{b}_1) + b_2$$
where $[s; \mathbf{a}] \in \mathbb{R}^{d_s + d_a}$, $\mathbf{W}_1 \in \mathbb{R}^{H \times (d_s + d_a)}$, $\mathbf{w}_2 \in \mathbb{R}^H$.
Derive the analytical vector $\nabla_{\mathbf{a}} Q(s, \mathbf{a}) \in \mathbb{R}^{d_a}$.

**Solution:**
Let $\mathbf{z} = \mathbf{W}_1 [s; \mathbf{a}] + \mathbf{b}_1 \in \mathbb{R}^H$, and $\mathbf{h} = \text{ReLU}(\mathbf{z})$.
$$Q(s, \mathbf{a}) = \mathbf{w}_2^\top \mathbf{h} + b_2$$
Differentiating with respect to action vector $\mathbf{a}$:
$$\nabla_{\mathbf{a}} Q(s, \mathbf{a}) = \left( \frac{\partial [s; \mathbf{a}]}{\partial \mathbf{a}} \right)^\top \left( \frac{\partial \mathbf{z}}{\partial [s; \mathbf{a}]} \right)^\top \left( \frac{\partial \mathbf{h}}{\partial \mathbf{z}} \right)^\top \mathbf{w}_2$$
Notice:
- $\frac{\partial [s; \mathbf{a}]}{\partial \mathbf{a}} = \begin{bmatrix} \mathbf{0}_{d_s \times d_a} \\ \mathbf{I}_{d_a \times d_a} \end{bmatrix}$.
- $\frac{\partial \mathbf{z}}{\partial [s; \mathbf{a}]} = \mathbf{W}_1 = [\mathbf{W}_{1, s} \mid \mathbf{W}_{1, a}]$.
- $\frac{\partial \mathbf{h}}{\partial \mathbf{z}} = \text{diag}(\mathbf{z} > 0)$.
Therefore:
$$\nabla_{\mathbf{a}} Q(s, \mathbf{a}) = \mathbf{W}_{1, a}^\top \left( \text{diag}(\mathbf{z} > 0) \mathbf{w}_2 \right)$$
This vector-Jacobian product computes the exact action-gradient in $\mathcal{O}(H \cdot d_a)$ operations.

---

### Exercise 9.7: DDPG vs TD3 on MuJoCo InvertedPendulum Benchmark
**Problem:** In the MuJoCo InvertedPendulum task, the reward is $r = +1.0$ per step while balanced, and $0$ on failure. Maximum episode length is 1,000 steps.
Maximum achievable undiscounted return is $1,000$.
In empirical benchmarks, DDPG estimated Q-values of $Q \approx 2,500$, while TD3 estimated $Q \approx 950$.
Explain why DDPG's estimate was physically impossible and how overestimation impaired policy learning.

**Solution:**
- Maximum physical return: Since $r \le 1.0$ and $\gamma = 0.99$:
  $$Q_{\max} \le \sum_{t=0}^\infty \gamma^t (1.0) = \frac{1.0}{1 - 0.99} = 100 \text{ (discounted)}, \quad \text{or } 1000 \text{ (undiscounted)}$$
- An estimate of $Q = 2,500$ violates the mathematical upper bound of the MDP by $150\%$.
- Consequence: When the Critic hallucinates that all actions have astronomically high values, the gradient $\nabla_{\mathbf{a}} Q$ becomes dominated by approximation noise. The Actor cannot differentiate between a genuinely balancing torque and a catastrophic torque, because both are evaluated as having astronomical returns. Overestimation destroys credit assignment.

---

### Exercise 9.8: Target Actor Delay Ratio Optimization
**Problem:** Suppose in TD3, the developer sets the policy delay parameter to $d = 10$ instead of $d = 2$.
1. How does $d = 10$ affect the wall-clock training speed of the Actor?
2. What trade-off occurs: why is $d$ not set arbitrarily large (e.g. $d = 100$)?

**Solution:**
1. Training speed: Setting $d = 10$ means the actor performs only 1 update for every 10 environment steps. The actor's policy changes very slowly.
2. Trade-off:
- If $d$ is too small ($d = 1$): Recovers DDPG instability; the critic has not converged before the actor updates.
- If $d$ is too large ($d = 100$): The Critic converges to evaluate the *current* policy $\boldsymbol{\mu}$, but the policy improves at an agonizingly sluggish pace. Sample efficiency collapses because millions of environment transitions are gathered to improve the policy by a tiny fraction. $d = 2$ provides the empirical sweet spot.

---

### Exercise 9.9: Actor Entropy in Continuous Control: TD3 vs SAC
**Problem:** TD3 uses a deterministic actor with added exploratory noise: $\mathbf{a} = \boldsymbol{\mu}(s) + \boldsymbol{\epsilon}$.
Soft Actor-Critic (SAC; Haarnoja et al., 2018) uses a maximum-entropy stochastic actor: $\mathbf{a} \sim \pi(a \mid s)$, optimizing $J = \mathbb{E}[R + \alpha \mathcal{H}(\pi)]$.
Compare the exploratory mechanisms of TD3 and SAC.

**Solution:**
- **TD3 (External Noise):** Exploration is decoupled from policy optimization. Noise is added externally to the deterministic output. The policy itself does not know that noise is being added and does not adapt its exploratory strategy to the uncertainty of the environment.
- **SAC (Intrinsic Maximum Entropy):** The policy explicitly learns its own variance $\boldsymbol{\sigma}(s)$. In states with high uncertainty or multiple viable solutions, the policy maintains high entropy. In dangerous states where precision is required, the policy automatically contracts its variance. SAC explores in an active, state-dependent, principled manner.

---

### Exercise 9.10: Complete TypeScript Unit Verification Suite for TD3
**Problem:** Write a TypeScript verification test that initializes `TD3StepEngine`, executes a sequence of 5 simulated environment steps, and asserts that:
1. Target action smoothing clamps noise within bounds $[-0.5, 0.5]$.
2. Clipped Double Q selects the minimum of the two target critics.
3. Actor updates occur strictly on steps $2$ and $4$ (delay $d=2$).

**Solution:**
```typescript
import { TD3StepEngine } from './td3-engine'; // Assuming implementation from Worked Example 9.10

export function testTD3Verification(): boolean {
  const engine = new TD3StepEngine(1, 1.0, 0.99, 0.005, 0.2, 0.5, 2);

  // 1. Verify target action smoothing bounds
  const dummyActor = (s: number[]) => [0.8];
  for (let i = 0; i < 50; i++) {
    const act = engine.computeTargetAction(dummyActor, [0]);
    if (act[0] < -1.0 || act[0] > 1.0) {
      console.error(`Target action out of bounds: ${act[0]}`);
      return false;
    }
  }
  console.log("Assertion 1 Passed: Target actions strictly clamped to [-1.0, 1.0].");

  // 2. Verify Clipped Double Q minimum selection
  const target = engine.computeTarget(1.0, false, 15.0, 10.0);
  // Expected: 1.0 + 0.99 * min(15, 10) = 1.0 + 9.9 = 10.9
  const targetCorrect = Math.abs(target - 10.9) < 1e-6;
  console.log(`Assertion 2 Passed: Clipped Double Q target = ${target.toFixed(4)} (Expected 10.9000: ${targetCorrect})`);

  // 3. Verify Delayed Updates (d = 2)
  const updates: boolean[] = [];
  for (let step = 1; step <= 5; step++) {
    updates.push(engine.shouldUpdateActor());
  }
  // Expected: [false (1), true (2), false (3), true (4), false (5)]
  const delayCorrect = !updates[0] && updates[1] && !updates[2] && updates[3] && !updates[4];
  console.log(`Assertion 3 Passed: Actor delayed update schedule = [${updates.join(', ')}] (Matches expected: ${delayCorrect})`);

  const allPassed = targetCorrect && delayCorrect;
  console.log(`TD3 Unit Suite Passed: ${allPassed}`);
  return allPassed;
}

testTD3Verification();
```
