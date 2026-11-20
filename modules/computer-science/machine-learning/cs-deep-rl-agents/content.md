# Deep Reinforcement Learning: DQN, Policy Gradients, and Actor-Critic

---

## 0. The Anchor Paradox: The Overconfident CartPole & The Deadly Feedback Loop

Imagine building a small robotic cart on a track. Mounted on top of the cart is a freely swinging vertical pole on an unmotorized hinge—the classic **CartPole Inverted Pendulum**. The goal is simple: apply horizontal forces (push left or push right) to keep the pole balanced upright without tipping over.

```
                   Pole (Mass m, Length L)
                       \
                        \  Angle θ
                         \
                    ┌─────────┐
         Force F ◄──│  CART   │──► Force F
                    └──O───O──┘
         ═════════════════════════════════ Track
```

A novice software engineer connects a standard multi-layer neural network:
- Input: Cart position $x$, velocity $\dot{x}$, pole angle $\theta$, and angular velocity $\dot{\theta}$.
- Output: Action values or probabilities (Push Left vs. Push Right).

During its first trial run, by pure chance, the cart jerks right and the pole stays balanced for 3 seconds while drifting toward the right end of the track. The engineer immediately feeds these 180 frames of data into backpropagation to train the network.

Suddenly, disaster strikes. In the very next run, the cart violently accelerates off the right edge of the track, slams into the steel bumper, and snaps the pole! 

What happened?
1. **The Temporal Autocorrelation Trap:** In standard machine learning (like image classification), photo #1 of a dog has zero correlation with photo #2 of a cat. But in physical control, frame $t+1$ is 99.9% identical to frame $t$. Training on consecutive physics steps violates the fundamental **i.i.d. (independent and identically distributed)** assumption of gradient descent, causing the network's weights to overfit catastrophically to the immediate trajectory.
2. **The Moving Target Catastrophe:** If the network uses its own current predictions to calculate the target value of the next state, every weight update shifts the ground beneath its own feet. It is like an archer shooting at a target that teleports every time the arrow leaves the bow!

To build artificial minds capable of piloting drones, mastering Grandmaster chess, walking humanoid robots, and driving cars, we must solve these deadly feedback loops. That solution is **Deep Reinforcement Learning (Deep RL)**.

---

## 1. The Epistemological Crisis: The Curse of Dimensionality

In tabular reinforcement learning, every distinct state-action pair $(s, a)$ occupies its own cell in a discrete Q-table.

Consider a simple physical robot with 6 continuous degrees of freedom (e.g. 3 Cartesian coordinates and 3 velocities):
$$\vec{s} = (x, y, z, \dot{x}, \dot{y}, \dot{z}) \in \mathbb{R}^6$$
If we divide each continuous real number into 100 discrete bins:
$$|\mathcal{S}| = 100^6 = 1,000,000,000,000 = 10^{12}\text{ discrete states}$$
At 8 bytes per 64-bit float, storing this table requires **8 Terabytes of RAM**. If the robot encounters an obstacle at coordinate $x = 1.002\text{ m}$, a tabular lookup learns *nothing* about what to do at $x = 1.003\text{ m}$ because they are completely separate array indices!

### The Solution: Non-Linear Function Approximation
We replace the lookup table with a parameterized deep neural network $Q(s, a; \theta) \approx Q^*(s, a)$ with weight vector $\theta \in \mathbb{R}^d$ where $d \ll |\mathcal{S}|$.

Because neural networks are continuous, differentiable function approximators, learning that a state is dangerous automatically generalizes smoothly to neighboring regions of phase space via gradient descent.

---

## 2. Deep Q-Networks (DQN) & Taming the Deadly Triad

In 2015, DeepMind published their historic breakthrough in *Nature* (Mnih et al.), demonstrating that Deep Q-Networks (DQN) could master dozens of Atari 2600 video games directly from raw pixel frames without human domain knowledge.

Historically, the combination of three conditions—known in RL theory as **The Deadly Triad**—caused training to blow up to $\pm \infty$:
1. **Function Approximation** (Deep Neural Networks).
2. **Bootstrapping** (Using value estimates to update other value estimates: $r + \gamma \max Q$).
3. **Off-Policy Learning** (Training on data generated from previous exploratory policies).

DQN defeated the Deadly Triad through two architectural innovations:

```
  Environment Interaction ──► Experience Tuple (s_t, a_t, r_{t+1}, s_{t+1}, done)
                                     │
                                     ▼
                    ┌───────────────────────────────────┐
                    │     EXPERIENCE REPLAY BUFFER      │
                    │   (Uniform Random Mini-Batches)   │
                    └───────────────────────────────────┘
                                     │
                      Sample Batch of 64 transitions
                                     │
               ┌─────────────────────┴─────────────────────┐
               ▼                                           ▼
      ┌──────────────────┐                       ┌──────────────────┐
      │  ONLINE NETWORK  │                       │  TARGET NETWORK  │
      │   Q(s, a; θ)     │                       │   Q(s', a'; θ^-) │
      └──────────────────┘                       └──────────────────┘
               │                                           │
               ▼                                           ▼
         Prediction Q                                Target: r + γ max Q
               │                                           │
               └───────────────► MSE Loss ◄────────────────┘
                                     │
                        Backprop Update θ only
                        (Every C steps: θ^- ◄── θ)
```

### 2.1 Mechanism 1: Experience Replay Buffer
Instead of performing gradient descent on transitions $(S_t, A_t, R_{t+1}, S_{t+1})$ sequentially as they occur:
1. Store transitions in a large ring buffer $\mathcal{D} = \{e_1, e_2, \dots, e_N\}$ of size $N = 100,000$.
2. At each training step, sample a mini-batch of size $B = 64$ uniformly at random from $\mathcal{D}$.
3. **Why this works:** Uniform random sampling completely destroys temporal autocorrelation, restoring the i.i.d. condition required for stable gradient descent.

### 2.2 Mechanism 2: The Target Network ($Q(s, a; \theta^-)$)
In naive Q-learning with function approximation, the loss function is:
$$\mathcal{L}(\theta) = \mathbb{E} \left[ \left( R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a'; \theta) - Q(S_t, A_t; \theta) \right)^2 \right]$$
Notice that the network weights $\theta$ appear in both the prediction $Q(S_t, A_t; \theta)$ and the target $R + \gamma \max Q(S_{t+1}, a'; \theta)$. Updating $\theta$ changes the target simultaneously, causing wild mathematical divergence.

**The Fix:** Maintain two identical networks:
- **Online Network $\theta$:** Continuously updated via gradient descent at every step.
- **Target Network $\theta^-$:** Frozen. Used exclusively to compute the Bellman target:
  $$y_i = R_{t+1} + (1 - d_t) \gamma \max_{a' \in \mathcal{A}} Q(S_{t+1}, a'; \theta^-)$$
- Every $C$ steps (e.g. $C = 1,000$), copy the weights: $\theta^- \gets \theta$. Alternatively, perform smooth Polyak averaging: $\theta^- \gets \tau \theta + (1 - \tau) \theta^-$ with $\tau \approx 0.005$.

### 2.3 The Formal DQN Loss Function
$$\mathbf{\mathcal{L}(\theta) = \frac{1}{B} \sum_{i=1}^B \left( R_{i+1} + (1 - d_i)\gamma \max_{a' \in \mathcal{A}} Q(S_{i+1}, a'; \theta^-) - Q(S_i, A_i; \theta) \right)^2}$$

---

## 3. Policy Gradient Methods: Direct Policy Optimization

While DQN is effective for discrete actions (e.g. 4 joystick directions), it collapses in **continuous action spaces**:
- A humanoid walking robot must command continuous torques $\vec{\tau} = (\tau_1, \dots, \tau_{24}) \in [-50\text{ N}\cdot\text{m}, +50\text{ N}\cdot\text{m}]^{24}$.
- Finding $\max_{\vec{a} \in \mathbb{R}^{24}} Q(s, \vec{a})$ requires solving an intractable multi-dimensional optimization problem at every millisecond timestep.

**Policy Gradient** methods parameterize the policy directly as a neural network with weights $\theta$:
$$\pi_\theta(a \mid s) = \mathbb{P}(A_t = a \mid S_t = s; \theta)$$

### 3.1 The Policy Objective Function ($J(\theta)$)
Let $\tau = (s_0, a_0, r_1, s_1, a_1, \dots, s_T)$ denote an entire trajectory. The probability of trajectory $\tau$ under policy $\pi_\theta$ is:
$$P(\tau; \theta) = \mu(s_0) \prod_{t=0}^{T-1} \pi_\theta(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)$$
where $\mu(s_0)$ is the initial state distribution.

The agent's objective is to maximize the expected cumulative return $R(\tau) = \sum_{t=0}^T \gamma^t r_{t+1}$:
$$J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} [R(\tau)] = \int P(\tau; \theta) R(\tau) \, d\tau$$

### 3.2 First-Principles Derivation of the Policy Gradient Theorem
To perform gradient ascent $\theta \gets \theta + \alpha \nabla_\theta J(\theta)$, we differentiate $J(\theta)$ with respect to $\theta$:
$$\nabla_\theta J(\theta) = \nabla_\theta \int P(\tau; \theta) R(\tau) \, d\tau = \int \nabla_\theta P(\tau; \theta) R(\tau) \, d\tau$$

We utilize the **Log-Derivative Trick** (from basic calculus: $\frac{d}{dx} \ln f(x) = \frac{f'(x)}{f(x)} \implies f'(x) = f(x) \frac{d}{dx} \ln f(x)$):
$$\nabla_\theta P(\tau; \theta) = P(\tau; \theta) \nabla_\theta \log P(\tau; \theta)$$

Substitute this identity back into the integral:
$$\nabla_\theta J(\theta) = \int P(\tau; \theta) \nabla_\theta \log P(\tau; \theta) R(\tau) \, d\tau = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \nabla_\theta \log P(\tau; \theta) R(\tau) \right]$$

Now expand the log-probability of trajectory $\tau$:
$$\log P(\tau; \theta) = \log \mu(s_0) + \sum_{t=0}^{T-1} \log \pi_\theta(a_t \mid s_t) + \sum_{t=0}^{T-1} \log \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

Differentiating with respect to $\theta$:
$$\nabla_\theta \log P(\tau; \theta) = \nabla_\theta \log \mu(s_0) + \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t) + \sum_{t=0}^{T-1} \nabla_\theta \log \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

Crucially, the initial state distribution $\mu(s_0)$ and the physics transition probabilities $\mathcal{P}(s_{t+1} \mid s_t, a_t)$ are properties of the environment and **do not depend on the network parameters $\theta$**! Their derivatives with respect to $\theta$ are identically zero:
$$\nabla_\theta \log \mu(s_0) = \vec{0}, \quad \nabla_\theta \log \mathcal{P}(s_{t+1} \mid s_t, a_t) = \vec{0}$$

Therefore:
$$\nabla_\theta \log P(\tau; \theta) = \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t)$$

Substituting this into the expectation yields the celebrated **Policy Gradient Theorem**:
$$\mathbf{\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t) G_t \right]}$$

#### Conceptual Marvel:
We can compute the exact gradient of environmental rewards with respect to our network weights **without knowing the mathematical equations of the environment's physics**!

---

## 4. Variance Reduction: The Baseline Proof & Actor-Critic (A2C)

### 4.1 The High Variance Problem of REINFORCE
In the naive REINFORCE algorithm (Williams 1992), $G_t$ is the empirical Monte Carlo return from step $t$ to the end of the episode. Because environmental trajectories are stochastic, empirical returns $G_t$ fluctuate wildly from one episode to the next, causing massive variance in the gradient and excruciatingly slow training.

### 4.2 The Baseline Invariance Theorem Proof
We can subtract an arbitrary state-dependent baseline function $b(s)$ from the return without altering the mathematical expectation of the gradient:
$$\mathbb{E}_{a \sim \pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a \mid s) b(s) \right] = 0$$

**Proof:**
Expand the expectation across the action distribution:
$$\sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \nabla_\theta \log \pi_\theta(a \mid s) b(s) = b(s) \sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \frac{\nabla_\theta \pi_\theta(a \mid s)}{\pi_\theta(a \mid s)}$$
The terms $\pi_\theta(a \mid s)$ cancel out cleanly:
$$= b(s) \sum_{a \in \mathcal{A}} \nabla_\theta \pi_\theta(a \mid s) = b(s) \nabla_\theta \left( \sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \right)$$
Since probabilities sum to $1.0$ by definition ($\sum_a \pi_\theta(a \mid s) = 1.0$), and the derivative of a constant is zero:
$$= b(s) \nabla_\theta (1) = b(s) \cdot \vec{0} = \mathbf{\vec{0}} \quad \blacksquare$$

The baseline leaves the gradient expectation completely unbiased while dramatically reducing sample variance!

### 4.3 Advantage Actor-Critic (A2C)
The optimal baseline is the state-value function: $b(s) = V(s)$.
The quantity $A(s, a) = Q(s, a) - V(s)$ is the **Advantage Function**:
- It measures how much better taking action $a$ is compared to the average policy performance at state $s$.
- Using a 1-step bootstrap approximation:
  $$\mathbf{A(s_t, a_t) = R_{t+1} + \gamma V_\phi(S_{t+1}) - V_\phi(S_t)}$$

This yields the **Advantage Actor-Critic (A2C)** architecture:
- **Actor Network $\pi_\theta(a \mid s)$:** Parameterizes the action policy. Updated via:
  $$\theta \gets \theta + \alpha_\theta \nabla_\theta \log \pi_\theta(a_t \mid s_t) A(s_t, a_t)$$
- **Critic Network $V_\phi(s)$:** Estimates the expected state value. Updated via MSE loss:
  $$\phi \gets \phi - \alpha_\phi \nabla_\phi \left( R_{t+1} + \gamma V_{\phi^-}(S_{t+1}) - V_\phi(S_t) \right)^2$$

```
                   State S_t
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
 ┌───────────────┐           ┌───────────────┐
 │     ACTOR     │           │    CRITIC     │
 │  π_θ(a | s)   │           │    V_φ(s)     │
 └───────────────┘           └───────────────┘
         │                           │
      Action a                     V(S_t)
         │                           │
         ▼                           ▼
   Environment ──► R_{t+1}, S_{t+1} ──► Advantage A = R + γ V(S_{t+1}) - V(S_t)
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
     Actor Gradient Ascent:                 Critic Gradient Descent:
  +α ∇_θ log π_θ(a|s) * A                 -β ∇_φ (Target - V_φ(s))^2
```

---

## 5. Continuous Action Spaces: Gaussian Parameterization

For continuous physical control (e.g. robotic joint torque $u \in \mathbb{R}$), the actor neural network outputs two parameters:
1. Mean action $\mu_\theta(s) \in \mathbb{R}$
2. Standard deviation $\sigma_\theta(s) > 0$ (often parameterized as $\log \sigma_\theta(s)$)

The action is sampled from a normal Gaussian distribution:
$$a \sim \mathcal{N}(\mu_\theta(s), \sigma_\theta^2(s))$$

The probability density function is:
$$\pi_\theta(a \mid s) = \frac{1}{\sqrt{2\pi \sigma^2}} \exp\left( -\frac{(a - \mu)^2}{2\sigma^2} \right)$$
Taking the natural logarithm:
$$\log \pi_\theta(a \mid s) = -\frac{1}{2}\log(2\pi) - \log \sigma - \frac{(a - \mu)^2}{2\sigma^2}$$
Differentiating with respect to the mean $\mu$:
$$\mathbf{\frac{\partial \log \pi_\theta(a \mid s)}{\partial \mu} = \frac{a - \mu}{\sigma^2}}$$
- If the agent took an action $a > \mu$ that produced positive Advantage ($A > 0$), the mean $\mu$ shifts in the positive direction toward $a$.
- If the action produced negative Advantage ($A < 0$), $\mu$ moves away from $a$.

---

## 6. Software Traps and Numerical Realities

### Trap 1: Q-Value Overestimation (The Maximization Bias)
In DQN, the target uses $\max_{a'} Q(s', a'; \theta^-)$. Because $Q$ is an approximation with zero-mean noise $\epsilon$, $\mathbb{E}[\max(Q + \epsilon)] \ge \max \mathbb{E}[Q]$. This creates a systematic positive bias that blows up value estimates.
*Fix: Double DQN (Van Hasselt et al. 2016).* Decouple action selection from action evaluation:
$$y_i = R + \gamma Q\left(s', \arg\max_{a'} Q(s', a'; \theta); \theta^-\right)$$

### Trap 2: Policy Entropy Collapse
In actor-critic methods, the actor network often quickly drives action probabilities to $1.0$ or $\sigma \to 0$, prematurely freezing exploration before discovering optimal strategies.
*Fix: Entropy Regularization.* Add the policy Shannon entropy $\mathcal{H}(\pi) = -\sum_a \pi(a \mid s) \log \pi(a \mid s)$ directly to the actor loss to encourage continuous exploration:
$$\mathcal{L}_{\text{actor}} = -\log \pi_\theta(a \mid s) A(s, a) - \beta_{\text{ent}} \mathcal{H}(\pi_\theta(\cdot \mid s))$$

### Trap 3: Exploding Bellman Loss on Gradient Outliers
During initial training, unexpected physics collisions create enormous TD errors $\delta = 1000$. Squaring this in MSE loss ($\delta^2 = 1,000,000$) creates massive gradients that destroy network weights.
*Fix: Smooth L1 / Huber Loss.*
$$\mathcal{L}_{\delta} = \begin{cases} 0.5 \delta^2 & \text{if } |\delta| \le 1.0 \\ |\delta| - 0.5 & \text{otherwise} \end{cases}$$

---

## 7. Production-Grade TypeScript Engine: DQN & Replay System

Below is a complete, typed implementation of a circular Experience Replay Buffer and a Deep Q-Network Agent supporting target networks and temporal difference updates.

```typescript
export interface Experience {
  state: Float64Array;
  action: number;
  reward: number;
  nextState: Float64Array;
  done: boolean;
}

/**
 * Circular Experience Replay Buffer with uniform random mini-batch sampling.
 */
export class CircularReplayBuffer {
  private buffer: Experience[];
  private maxSize: number;
  private head: number = 0;
  private currentSize: number = 0;

  constructor(maxSize = 100000) {
    this.maxSize = maxSize;
    this.buffer = new Array<Experience>(maxSize);
  }

  public push(exp: Experience): void {
    this.buffer[this.head] = exp;
    this.head = (this.head + 1) % this.maxSize;
    if (this.currentSize < this.maxSize) {
      this.currentSize++;
    }
  }

  public sample(batchSize: number): Experience[] {
    const actualBatch = Math.min(batchSize, this.currentSize);
    const sampleBatch: Experience[] = new Array(actualBatch);

    for (let i = 0; i < actualBatch; i++) {
      const idx = Math.floor(Math.random() * this.currentSize);
      sampleBatch[i] = this.buffer[idx];
    }
    return sampleBatch;
  }

  public size(): number {
    return this.currentSize;
  }
}

/**
 * Lightweight Linear / Neural Q-Network with manual backprop for demonstration
 */
export class LightweightQNetwork {
  public weights: Float64Array; // Dimensions: numStates x numActions
  public bias: Float64Array;    // Dimensions: numActions
  public readonly numStates: number;
  public readonly numActions: number;

  constructor(numStates: number, numActions: number) {
    this.numStates = numStates;
    this.numActions = numActions;
    this.weights = new Float64Array(numStates * numActions);
    this.bias = new Float64Array(numActions);

    // He initialization
    const scale = Math.sqrt(2.0 / numStates);
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = (Math.random() * 2.0 - 1.0) * scale;
    }
  }

  public clone(): LightweightQNetwork {
    const copy = new LightweightQNetwork(this.numStates, this.numActions);
    copy.weights.set(this.weights);
    copy.bias.set(this.bias);
    return copy;
  }

  public forward(state: Float64Array): Float64Array {
    const qValues = new Float64Array(this.numActions);
    for (let a = 0; a < this.numActions; a++) {
      let sum = this.bias[a];
      for (let s = 0; s < this.numStates; s++) {
        sum += state[s] * this.weights[s * this.numActions + a];
      }
      qValues[a] = sum;
    }
    return qValues;
  }
}

/**
 * Complete Deep Q-Network (DQN) Agent with Target Network Stabilization
 */
export class DeepQAgent {
  public onlineNet: LightweightQNetwork;
  public targetNet: LightweightQNetwork;
  public replayBuffer: CircularReplayBuffer;
  public readonly numStates: number;
  public readonly numActions: number;
  public alpha: number;
  public gamma: number;
  public epsilon: number;
  public epsilonDecay: number;
  public minEpsilon: number;
  public targetUpdateSteps: number;
  private totalSteps: number = 0;

  constructor(
    numStates: number,
    numActions: number,
    alpha = 0.001,
    gamma = 0.99,
    epsilon = 1.0,
    epsilonDecay = 0.998,
    minEpsilon = 0.05,
    targetUpdateSteps = 500
  ) {
    this.numStates = numStates;
    this.numActions = numActions;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.epsilonDecay = epsilonDecay;
    this.minEpsilon = minEpsilon;
    this.targetUpdateSteps = targetUpdateSteps;

    this.onlineNet = new LightweightQNetwork(numStates, numActions);
    this.targetNet = this.onlineNet.clone();
    this.replayBuffer = new CircularReplayBuffer(50000);
  }

  public selectAction(state: Float64Array, explore = true): number {
    if (explore && Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.numActions);
    }

    const q = this.onlineNet.forward(state);
    let bestAction = 0;
    let maxQ = q[0];
    for (let a = 1; a < this.numActions; a++) {
      if (q[a] > maxQ) {
        maxQ = q[a];
        bestAction = a;
      }
    }
    return bestAction;
  }

  public recordStep(
    state: Float64Array,
    action: number,
    reward: number,
    nextState: Float64Array,
    done: boolean
  ): void {
    this.replayBuffer.push({ state, action, reward, nextState, done });
    this.totalSteps++;

    if (this.totalSteps % this.targetUpdateSteps === 0) {
      this.targetNet = this.onlineNet.clone();
    }

    this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
  }

  public trainMiniBatch(batchSize = 32): number {
    if (this.replayBuffer.size() < batchSize) return 0.0;

    const batch = this.replayBuffer.sample(batchSize);
    let totalBatchLoss = 0.0;

    for (const exp of batch) {
      // 1. Compute target using frozen Target Network
      const targetNextQ = this.targetNet.forward(exp.nextState);
      let maxNextQ = targetNextQ[0];
      for (let a = 1; a < this.numActions; a++) {
        if (targetNextQ[a] > maxNextQ) maxNextQ = targetNextQ[a];
      }

      const tdTarget = exp.reward + (exp.done ? 0.0 : this.gamma * maxNextQ);

      // 2. Compute current prediction from Online Network
      const currentQ = this.onlineNet.forward(exp.state);
      const predictedVal = currentQ[exp.action];
      const tdError = tdTarget - predictedVal;

      // 3. Huber / MSE loss accumulator
      totalBatchLoss += tdError * tdError;

      // 4. Gradient update on Online Network parameters
      // dL/dQ = -2 * tdError. In standard gradient step: W += alpha * tdError * state
      for (let s = 0; s < this.numStates; s++) {
        const weightIdx = s * this.numActions + exp.action;
        this.onlineNet.weights[weightIdx] += this.alpha * tdError * exp.state[s];
      }
      this.onlineNet.bias[exp.action] += this.alpha * tdError;
    }

    return totalBatchLoss / batchSize;
  }
}
```

---

## 8. Multi-Tiered Worked Problems

### Tier 1: Class 6 Level — The Frozen Target Rule
**Problem:** An AI drone is training with a Target Network.
At step $t$, the drone observes next state $S'$. The frozen Target Network predicts action values for $S'$ as:
- Hover: $Q = 10.0$
- Forward: $Q = 15.0$
- Climb: $Q = 8.0$

The drone received an immediate reward of $R = +5.0$, and the discount factor is $\gamma = 0.90$.
The episode is not finished. What is the Bellman TD Target value?

**Solution:**
1. Pick the maximum value from the frozen Target Network:
   $$\max_{a'} Q(S', a'; \theta^-) = \max(10.0, 15.0, 8.0) = 15.0$$
2. Apply the Bellman formula:
   $$\text{Target} = R + \gamma \max_{a'} Q(S', a'; \theta^-) = 5.0 + (0.90 \times 15.0) = 5.0 + 13.5 = \mathbf{18.5}$$

---

### Tier 2: High School Level — TD Error & Huber Loss Calculation
**Problem:** A Deep Q-Network has online prediction $Q(s, a; \theta) = 4.2$. The Target Network computes the TD Target $y = 7.2$.
1. Calculate the TD Error $\delta = y - Q(s, a; \theta)$.
2. If the Huber loss threshold is $\delta_{\text{huber}} = 1.0$, calculate the Huber loss $\mathcal{L}_{\text{Huber}}(\delta)$ defined by:
   $$\mathcal{L}(\delta) = \begin{cases} 0.5 \delta^2 & \text{if } |\delta| \le 1.0 \\ 1.0 \cdot (|\delta| - 0.5) & \text{if } |\delta| > 1.0 \end{cases}$$

**Solution:**
1. Compute TD Error:
   $$\delta = 7.2 - 4.2 = \mathbf{3.0}$$
2. Since $|\delta| = 3.0 > 1.0$, use the linear Huber branch:
   $$\mathcal{L} = 1.0 \times (3.0 - 0.5) = 1.0 \times 2.5 = \mathbf{2.5}$$
*Notice:* Under standard MSE, the loss would be $0.5 \times (3.0)^2 = 4.5$. Huber loss prevents steep gradient explosion.

---

### Tier 3: AP / First-Year Undergraduate — Policy Gradient Log-Derivative
**Problem:** A robotic arm has two discrete actions: $a_0$ (Hold) and $a_1$ (Grip). The actor network outputs logits $z = (z_0, z_1) = (0.0, 2.0)$ with softmax probabilities:
$$\pi(a_1) = \frac{e^{z_1}}{e^{z_0} + e^{z_1}}$$
The arm executes action $a_1$ and receives positive Advantage $A = +4.0$.
1. Compute the probability $\pi(a_1)$.
2. Calculate the exact gradient of $\log \pi(a_1)$ with respect to logit $z_1$.
3. Compute the parameter update step $\Delta z_1 = \alpha \cdot A \cdot \frac{\partial \log \pi(a_1)}{\partial z_1}$ for learning rate $\alpha = 0.1$.

**Solution:**
1. Compute softmax probabilities:
   $$e^{z_0} = e^{0} = 1.0, \quad e^{z_1} = e^{2.0} \approx 7.3891$$
   $$\pi(a_1) = \frac{7.3891}{1.0 + 7.3891} = \frac{7.3891}{8.3891} \approx \mathbf{0.8808}$$
2. Use the derivative of softmax log-likelihood:
   $$\frac{\partial \log \pi(a_1)}{\partial z_1} = 1.0 - \pi(a_1) = 1.0 - 0.8808 = \mathbf{+0.1192}$$
3. Compute the logit step:
   $$\Delta z_1 = 0.1 \times 4.0 \times 0.1192 = \mathbf{+0.04768}$$
Because action $a_1$ achieved positive Advantage ($A > 0$), its logit increases, raising the probability of choosing Grip in the future!

---

### Tier 4: University Undergraduate — Double DQN Target vs Standard DQN
**Problem:** In state $s'$, true optimal Q-values for actions $a_0, a_1$ are $Q^*(s', a_0) = 10.0$ and $Q^*(s', a_1) = 10.0$.
Due to neural approximation errors, our online and target networks have noisy estimates:
- Online Network $\theta$: $Q(s', a_0; \theta) = 11.5$, $Q(s', a_1; \theta) = 9.0$
- Target Network $\theta^-$: $Q(s', a_0; \theta^-) = 9.2$, $Q(s', a_1; \theta^-) = 11.8$

For reward $r = 0.0$ and $\gamma = 0.90$:
1. Compute the standard DQN target $y_{\text{DQN}} = r + \gamma \max_{a'} Q(s', a'; \theta^-)$.
2. Compute the Double DQN target $y_{\text{DDQN}} = r + \gamma Q\left(s', \arg\max_{a'} Q(s', a'; \theta); \theta^-\right)$.
3. Compare both to the true optimal target $y^* = 0.0 + 0.90 \times 10.0 = 9.0$.

**Solution:**
1. Standard DQN Target:
   $$\max_{a'} Q(s', a'; \theta^-) = \max(9.2, 11.8) = 11.8$$
   $$y_{\text{DQN}} = 0.0 + (0.90 \times 11.8) = \mathbf{10.62}$$
   *(Overestimates the true target $9.0$ by $+1.62$!)*
2. Double DQN Target:
   - First, let the online network pick the best action:
     $$a^*_{\text{online}} = \arg\max_{a'} Q(s', a'; \theta) = \arg\max(11.5, 9.0) = a_0$$
   - Next, evaluate that action $a_0$ using the target network:
     $$Q(s', a_0; \theta^-) = 9.2$$
   - Compute DDQN target:
     $$y_{\text{DDQN}} = 0.0 + (0.90 \times 9.2) = \mathbf{8.28}$$
3. Conclusion: Double DQN avoids the maximization trap of blindly taking the highest noisy outlier, successfully combating systematic value explosion.

---

### Tier 5: Graduate / Research Level — Continuous Gaussian Policy Gradient Derivation
**Problem:** Let continuous action $a \in \mathbb{R}$ be sampled from a Gaussian policy with mean $\mu_\theta(s)$ and fixed variance $\sigma^2$:
$$\pi_\theta(a \mid s) = \frac{1}{\sqrt{2\pi \sigma^2}} \exp\left( -\frac{(a - \mu_\theta(s))^2}{2\sigma^2} \right)$$
Using the multivariate chain rule, derive the analytical parameter gradient $\nabla_\theta \log \pi_\theta(a \mid s)$ in terms of $\nabla_\theta \mu_\theta(s)$, and show how the advantage function $A(s, a)$ alters the mean output of the network.

**Solution:**
1. Take the natural logarithm of $\pi_\theta(a \mid s)$:
   $$\log \pi_\theta(a \mid s) = -\frac{1}{2} \log(2\pi \sigma^2) - \frac{(a - \mu_\theta(s))^2}{2\sigma^2}$$
2. Differentiate with respect to parameter vector $\theta$ via the chain rule:
   $$\nabla_\theta \log \pi_\theta(a \mid s) = \frac{\partial \log \pi_\theta}{\partial \mu_\theta} \nabla_\theta \mu_\theta(s)$$
3. Compute the partial derivative $\frac{\partial}{\partial \mu}$:
   $$\frac{\partial}{\partial \mu} \left[ -\frac{(a - \mu)^2}{2\sigma^2} \right] = -\frac{2(a - \mu)(-1)}{2\sigma^2} = \frac{a - \mu}{\sigma^2}$$
4. Therefore, the parameter gradient is:
   $$\mathbf{\nabla_\theta \log \pi_\theta(a \mid s) = \left( \frac{a - \mu_\theta(s)}{\sigma^2} \right) \nabla_\theta \mu_\theta(s)}$$
5. Substituting into the Actor gradient update with Advantage $A(s, a)$:
   $$\Delta \theta = \alpha \left( \frac{a - \mu_\theta(s)}{\sigma^2} \right) A(s, a) \nabla_\theta \mu_\theta(s)$$
   - When $A(s, a) > 0$ and $a > \mu$, the coefficient is positive: $\mu_\theta(s)$ shifts toward $a$.
   - When $A(s, a) < 0$ and $a > \mu$, the coefficient is negative: $\mu_\theta(s)$ shifts away from $a$.
   - The factor $\sigma^{-2}$ acts as precision weighting: narrower distributions make updates more aggressive. $\blacksquare$

---

## 9. Socratic Synthesis & Horizons

1. **Question:** Why can't we use standard supervised learning on demonstration data instead of Deep RL for robotics?
   - **Answer:** Supervised learning on expert demonstrations (Behavioral Cloning) suffers from the **Distribution Shift / Compounding Error Problem**. If the robot makes a tiny 1-degree error off the demonstrator's path, it enters a physical state never seen in the training dataset. It has no idea how to recover and crashes. RL teaches the agent through its own errors how to recover from arbitrary perturbations.

2. **Question:** What is the fundamental difference between DQN and Actor-Critic?
   - **Answer:** DQN is value-based: it only outputs expected returns for discrete actions and picks the max. Actor-Critic is a hybrid policy-value method: the Actor outputs action probabilities directly (supporting continuous multi-dimensional motor torques), while the Critic outputs state values to guide the Actor's policy updates.
