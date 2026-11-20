# Markov Decision Processes, Bellman Optimality, and Value Iteration

---

## 0. The Anchor Paradox: The Rat in the Maze & The Instant Gratification Trap

Imagine a laboratory mouse placed at the entrance of a maze:
- Right in front of its nose, 10 centimeters down Corridor A, sits a single, stale breadcrumb ($+1\text{ point}$). But stepping into Corridor A triggers a one-way trapdoor that snaps shut forever, trapping the mouse in a barren cage.
- Corridor B looks dark, ominous, and smells like nothing at all. Walking down Corridor B requires expending energy for 50 grueling steps ($0\text{ points}$). But at the very end of Corridor B sits an enormous banquet feast of cheese, seeds, and water ($+10,000\text{ points}$).

If an agent behaves according to naive short-sighted intuition—**"always pick the action that yields the highest reward right this second"**—the mouse will eagerly sprint into Corridor A, consume its single breadcrumb, and freeze to death.

```
                  ┌──► [Corridor A] ──► Instant Crumb (+1) ──► Trapdoor (Trapped!)
                  │
[Mouse at Start] ─┤
                  │
                  └──► [Corridor B] ──► Empty Path (0) ──► ... ──► Giant Feast (+10,000!)
```

This reveals the central paradox of intelligent life: **Actions have consequences that echo into the distant future.** An action that feels rewarding right now may lead to ruin, while an action that feels neutral or painful right now may be the sole prerequisite for survival.

How can a computer program, knowing nothing about the rules of the universe ahead of time, learn to forgo instant gratification, navigate complex sequences of decisions, and discover long-term optimal strategies? The answer is the mathematical framework of **Markov Decision Processes (MDPs)** and **Bellman Optimality**.

---

## 1. The Epistemological Paradigm: Reinforcement Learning

In classical computer science:
1. **Supervised Learning:** An omniscient teacher presents pairs of inputs and ground-truth labels $(x \to y)$. The machine minimizes prediction error.
2. **Unsupervised Learning:** The machine clusters raw data based on geometric proximity ($x \to \text{clusters}$).

Neither paradigm describes how a child learns to walk, how a bird learns to catch thermals, or how an autonomous rover explores the terrain of Mars. There is no human teacher labeling every motor impulse or joint torque.

Instead, learning proceeds via **Reinforcement Learning (RL)**:
- An **Agent** exists inside an external **Environment**.
- The agent takes **Actions** ($A_t$).
- The environment changes state ($S_{t+1}$) and emits a scalar **Reward** ($R_{t+1}$).
- Through repeated trial, error, and delayed consequence, the agent discovers an optimal **Policy** ($\pi$) that maximizes cumulative reward over the agent's entire operational lifetime.

```
                      Action A_t
             ┌───────────────────────────┐
             ▼                           │
        ┌─────────┐                 ┌─────────┐
        │         │  Reward R_{t+1} │         │
        │  AGENT  │ ◄───────────────┤ ENVIRON │
        │         │  State S_{t+1}  │  -MENT  │
        │         │ ◄───────────────┤         │
        └─────────┘                 └─────────┘
```

---

## 2. First-Principles Formalism: The Markov Decision Process (MDP)

### 2.1 The Markov Property: The Memoryless Present
A state representation $S_t$ satisfies the **Markov Property** if the future evolution of the system depends *only* upon the present state and action, completely independent of the past historical trajectory:

$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots, S_0, A_0) = \mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t)$$

#### Physical Intuition:
Consider a billiard ball rolling across a frictionless table. If you are given its exact current position $\vec{x}(t)$ and velocity $\vec{v}(t)$, you can predict its position $\vec{x}(t + \Delta t)$ with complete physical precision. Knowing which rail it bounced off two minutes ago provides zero additional information. The current state is an informational sufficient statistic for the future.

### 2.2 The MDP 5-Tuple: $(\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$
A finite Markov Decision Process is formally defined by five mathematical components:
1. **$\mathcal{S}$ (State Space):** The set of all possible environmental configurations.
2. **$\mathcal{A}$ (Action Space):** The set of all valid decisions or motor commands available to the agent.
3. **$\mathcal{P}(s' \mid s, a)$ (Transition Probability Function):** The probability of transitioning to state $s'$ after taking action $a$ in state $s$:
   $$\mathcal{P}(s' \mid s, a) = \mathbb{P}(S_{t+1} = s' \mid S_t = s, A_t = a)$$
   where for all $s \in \mathcal{S}$ and $a \in \mathcal{A}$:
   $$\sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) = 1.0$$
4. **$\mathcal{R}(s, a, s')$ (Reward Function):** The expected scalar feedback received after transitioning from $s$ to $s'$ via action $a$:
   $$\mathcal{R}(s, a, s') = \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a, S_{t+1} = s']$$
5. **$\gamma \in [0, 1)$ (Discount Factor):** A geometric decay parameter quantifying the relative value of future rewards versus immediate rewards.

### 2.3 Discounted Cumulative Return ($G_t$)
The goal of the agent is not to maximize the immediate reward $R_{t+1}$, but the total **Discounted Cumulative Return** $G_t$:

$$G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$$

#### Why must $\gamma < 1$? The Geometric Series Proof
For continuous, non-terminating tasks where $R_{t+k} \le R_{\max} < \infty$, if $\gamma = 1$, the return $G_t$ diverges to $\infty$:
$$\lim_{T \to \infty} \sum_{k=0}^T R_{\max} = \infty$$
When all infinite trajectories yield $\infty$, no trajectory can be judged better than any other.

However, when $\gamma < 1$, the sum is bounded by a convergent geometric series:
$$G_t \le R_{\max} \sum_{k=0}^\infty \gamma^k = R_{\max} \left(\frac{1}{1 - \gamma}\right) < \infty$$
Furthermore, $\gamma$ represents the biological and financial reality that immediate reward carries zero uncertainty, whereas future reward carries risk of environmental perturbation or death.

---

## 3. Policies and Value Functions

### 3.1 Policies ($\pi$)
A **Policy** defines the behavioral rule of the agent:
- **Deterministic Policy:** $a = \pi(s)$ maps a state directly to a specific action.
- **Stochastic Policy:** $\pi(a \mid s) = \mathbb{P}(A_t = a \mid S_t = s)$ defines a probability distribution over actions given state $s$, where $\sum_{a \in \mathcal{A}} \pi(a \mid s) = 1.0$.

### 3.2 The State-Value Function ($V^\pi(s)$)
The **State-Value Function** $V^\pi(s)$ represents the expected return starting from state $s$ and following policy $\pi$ indefinitely into the future:
$$V^\pi(s) = \mathbb{E}_\pi [G_t \mid S_t = s]$$

### 3.3 The Action-Value Function ($Q^\pi(s, a)$)
The **Action-Value Function** (or **Q-function**, where "Q" stands for *Quality*) represents the expected return starting from state $s$, taking arbitrary action $a$, and *thereafter* following policy $\pi$:
$$Q^\pi(s, a) = \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a]$$

The relationship between $V^\pi(s)$ and $Q^\pi(s, a)$ is straightforward:
$$V^\pi(s) = \sum_{a \in \mathcal{A}} \pi(a \mid s) Q^\pi(s, a)$$

---

## 4. The Bellman Equations: The Recursive Principle of Optimality

In 1957, mathematician **Richard Bellman** published his landmark Principle of Optimality:
> *"An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision."*

### 4.1 First-Principles Derivation of the Bellman Expectation Equation
We begin directly from the definition of the return $G_t$:
$$G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = R_{t+1} + \gamma \left( R_{t+2} + \gamma R_{t+3} + \dots \right) = R_{t+1} + \gamma G_{t+1}$$

Now take the conditional expectation with respect to policy $\pi$ given $S_t = s$:
$$V^\pi(s) = \mathbb{E}_\pi [G_t \mid S_t = s] = \mathbb{E}_\pi [R_{t+1} + \gamma G_{t+1} \mid S_t = s]$$

Expanding the expectation across all possible actions $a \sim \pi(\cdot \mid s)$ and all possible next states $s' \sim \mathcal{P}(\cdot \mid s, a)$:

$$\mathbf{V^\pi(s) = \sum_{a \in \mathcal{A}} \pi(a \mid s) \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma V^\pi(s') \right]}$$

Similarly, for the Action-Value Function $Q^\pi(s, a)$:
$$\mathbf{Q^\pi(s, a) = \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma \sum_{a' \in \mathcal{A}} \pi(a' \mid s') Q^\pi(s', a') \right]}$$

### 4.2 The Bellman Optimality Equations
An optimal policy $\pi^*$ is defined as a policy whose value function is greater than or equal to that of all other policies for all states: $V^*(s) = \max_\pi V^\pi(s)$.

Under the optimal policy, the agent does not act randomly; it greedily chooses the single action that maximizes the expected return. Therefore, the summation over actions $\sum_{a} \pi(a \mid s)$ collapses into the $\max_{a \in \mathcal{A}}$ operator:

$$\mathbf{V^*(s) = \max_{a \in \mathcal{A}} \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma V^*(s') \right]}$$

$$\mathbf{Q^*(s, a) = \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma \max_{a' \in \mathcal{A}} Q^*(s', a') \right]}$$

Notice that $V^*(s) = \max_{a \in \mathcal{A}} Q^*(s, a)$.

---

## 5. Dynamic Programming: Value Iteration & Contraction Mapping

The Bellman Optimality Equation defines an operator $T$ acting on value functions, known as the **Bellman Backup Operator**:
$$(T V)(s) = \max_{a \in \mathcal{A}} \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma V(s') \right]$$

### 5.1 Banach Fixed-Point Contraction Theorem Proof
We prove that $T$ is a **$\gamma$-contraction mapping** under the infinity norm $\|V\|_\infty = \max_{s \in \mathcal{S}} |V(s)|$.

Let $U$ and $V$ be two arbitrary value functions. For any state $s$:
$$|(T U)(s) - (T V)(s)| = \left| \max_{a} \sum_{s'} \mathcal{P}(s' \mid s, a) [r + \gamma U(s')] - \max_{a'} \sum_{s'} \mathcal{P}(s' \mid s, a') [r + \gamma V(s')] \right|$$

Using the algebraic property that $|\max_x f(x) - \max_x g(x)| \le \max_x |f(x) - g(x)|$:
$$\le \max_{a} \left| \sum_{s'} \mathcal{P}(s' \mid s, a) [r + \gamma U(s')] - \sum_{s'} \mathcal{P}(s' \mid s, a) [r + \gamma V(s')] \right|$$
The immediate reward $r$ cancels out identically:
$$= \max_{a} \left| \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) (U(s') - V(s')) \right|$$
Applying the triangle inequality:
$$\le \gamma \max_{a} \sum_{s'} \mathcal{P}(s' \mid s, a) |U(s') - V(s')|$$
Since $|U(s') - V(s')| \le \|U - V\|_\infty$ for all $s'$, and $\sum_{s'} \mathcal{P}(s' \mid s, a) = 1.0$:
$$\le \gamma \|U - V\|_\infty \cdot 1.0 = \gamma \|U - V\|_\infty$$

Taking the maximum over all states $s \in \mathcal{S}$:
$$\mathbf{\|T U - T V\|_\infty \le \gamma \|U - V\|_\infty}$$

**Conclusion:** Because $0 \le \gamma < 1$, the Bellman operator $T$ is a strict contraction mapping. By Banach's Fixed-Point Theorem:
1. There exists a unique fixed point $V^*$ such that $T V^* = V^*$.
2. Repeated application of the operator $V_{k+1} = T V_k$ starting from **any arbitrary initial vector $V_0$** is mathematically guaranteed to converge exponentially to the unique optimal value function $V^*$:
   $$\|V_k - V^*\|_\infty \le \frac{\gamma^k}{1 - \gamma} \|V_1 - V_0\|_\infty \xrightarrow{k \to \infty} 0$$

### 5.2 The Value Iteration Algorithm
```
Algorithm: Value Iteration
Input: MDP (S, A, P, R, gamma), tolerance epsilon > 0
Initialize V(s) = 0 for all s in S

Repeat:
    Delta <- 0
    For each state s in S:
        v_old <- V(s)
        V(s) <- max_a sum_{s'} P(s' | s, a) [ R(s, a, s') + gamma * V(s') ]
        Delta <- max(Delta, |v_old - V(s)|)
Until Delta < epsilon * (1 - gamma) / (2 * gamma)

Extract Optimal Deterministic Policy pi*(s):
    pi*(s) = argmax_a sum_{s'} P(s' | s, a) [ R(s, a, s') + gamma * V(s') ]
```

---

## 6. Model-Free Reinforcement Learning: Tabular Q-Learning

Value Iteration is a **Model-Based Planning** algorithm: it requires the transition probabilities $\mathcal{P}(s' \mid s, a)$ and reward table $\mathcal{R}$ to be stored in memory.

In real-world robotics and game simulations, the transition dynamics of the physical universe are too complex to represent in an explicit matrix. The agent only has access to a **black-box experience stream**: it takes action $A_t$ in state $S_t$, observes reward $R_{t+1}$, and lands in next state $S_{t+1}$.

### 6.1 Temporal Difference (TD) Learning
In 1989, **Chris Watkins** introduced **Q-Learning**, a model-free **Temporal Difference (TD)** learning algorithm that learns optimal action values directly from experience tuples $(S_t, A_t, R_{t+1}, S_{t+1})$:

$$\mathbf{Q(S_t, A_t) \gets Q(S_t, A_t) + \alpha \underbrace{\left[ R_{t+1} + \gamma \max_{a' \in \mathcal{A}} Q(S_{t+1}, a') - Q(S_t, A_t) \right]}_{\text{TD Error } \delta_t}}$$

Where:
- $\alpha \in (0, 1]$ is the **Learning Rate**.
- $R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a')$ is the **TD Target** (the updated estimate of the true return).
- $\delta_t = \text{TD Target} - Q(S_t, A_t)$ is the **Temporal Difference Error**—the discrepancy between the observed consequence and the agent's prior expectation!

### 6.2 Why Q-Learning is Off-Policy
Notice the maximization in the TD Target: $\max_{a'} Q(S_{t+1}, a')$.
- The agent updates its Q-values assuming it will act **optimally (greedily)** in state $S_{t+1}$.
- However, the agent's actual behavior in state $S_{t+1}$ can be exploratory (e.g. taking a completely random action).
Because the policy being *evaluated and improved* (the greedy policy $\pi^*$) is different from the policy generating the *behavioral experience* (the $\epsilon$-greedy exploratory policy $b$), Q-learning is strictly **off-policy**.

### 6.3 The Exploration vs. Exploitation Dilemma: $\epsilon$-Greedy Policy
If the agent only chooses the action with the highest current Q-value (pure exploitation), it may find a small reward (+1) and never discover a massive treasure (+1000) hidden behind an unexplored action.

Under an **$\epsilon$-greedy policy**:
$$\pi(a \mid s) = \begin{cases} 1 - \epsilon + \frac{\epsilon}{|\mathcal{A}|} & \text{if } a = \arg\max_{a'} Q(s, a') \\ \frac{\epsilon}{|\mathcal{A}|} & \text{if } a \neq \arg\max_{a'} Q(s, a') \end{cases}$$
Typically, $\epsilon$ starts high (e.g. $\epsilon_0 = 1.0$ for pure exploration) and decays geometrically over training episodes ($\epsilon_{e+1} = \max(\epsilon_{\min}, \epsilon_e \cdot d)$) until the agent transitions into pure exploitation.

---

## 7. Software Traps and Implementation Realities

### Trap 1: The Curse of Dimensionality ($|\mathcal{S}| \times |\mathcal{A}|$)
In tabular MDPs, the Q-table is a 2D matrix of size $|\mathcal{S}| \times |\mathcal{A}|$.
If a state consists of just 6 floating-point robotic joint angles, discretizing each angle into 100 bins results in:
$$|\mathcal{S}| = 100^6 = 10^{12}\text{ states}$$
Storing a table of $10^{12}$ 64-bit floats requires **8 Terabytes of RAM**. Tabular methods fail when state spaces become continuous, necessitating Function Approximation (Deep Q-Networks / Neural Networks).

### Trap 2: Updating Terminal State Values
A terminal state (e.g. Goal or Death) terminates the episode. There is no next state $S_{t+1}$.
If your code does not set the future term to zero upon encountering `isTerminal == true`:
$$\text{Target} = R_{t+1} + \gamma \max_{a'} Q(S_{\text{terminal}}, a')$$
the agent will accumulate phantom future rewards from non-existent post-mortem actions, permanently corrupting convergence!
*Fix:*
$$\text{Target} = R_{t+1} + (\text{isTerminal } ?\ 0 : \gamma \max_{a'} Q(S_{t+1}, a'))$$

### Trap 3: In-Place vs. Synchronous Buffering in Value Iteration
When implementing Value Iteration, updating $V(s)$ in-place within the same iteration loop uses partially updated values from earlier states. While in-place Gauss-Seidel value iteration also converges (often faster), it introduces directional bias depending on array iteration order. For reproducible, deterministic mathematical convergence matching theory, maintain two buffers: $V_{\text{current}}$ and $V_{\text{next}}$.

---

## 8. Production-Grade TypeScript Engine: GridWorld MDP & Q-Learning

Below is a complete, self-contained, typed implementation of a 2D GridWorld MDP environment, a synchronous Value Iteration solver, and a Tabular Q-Learning agent with $\epsilon$-decay.

```typescript
/**
 * GridWorld Action Enumeration
 */
export enum Action {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

export interface Transition {
  nextStateKey: string;
  probability: number;
  reward: number;
  isTerminal: boolean;
}

/**
 * Deterministic / Stochastic GridWorld Environment
 */
export class GridWorldEnvironment {
  public readonly width: number;
  public readonly height: number;
  private readonly obstacles: Set<string> = new Set();
  private readonly terminals: Map<string, number> = new Map();

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public addObstacle(x: number, y: number): void {
    this.obstacles.add(`${x},${y}`);
  }

  public addTerminal(x: number, y: number, reward: number): void {
    this.terminals.set(`${x},${y}`, reward);
  }

  public getStateKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  public parseStateKey(key: string): [number, number] {
    const parts = key.split(",").map(Number);
    return [parts[0], parts[1]];
  }

  public getAllStates(): string[] {
    const states: string[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const key = this.getStateKey(x, y);
        if (!this.obstacles.has(key)) {
          states.push(key);
        }
      }
    }
    return states;
  }

  /**
   * Computes the MDP transition distribution P(s' | s, a) and reward R(s, a, s').
   * Supports slip probability where agent slips 90 degrees left or right.
   */
  public getTransitions(stateKey: string, action: Action, slipProb = 0.0): Transition[] {
    if (this.terminals.has(stateKey)) {
      return []; // Absorbing terminal state has no outgoing transitions
    }

    const [x, y] = this.parseStateKey(stateKey);
    const intendedProb = 1.0 - slipProb;
    const slipLeftProb = slipProb / 2.0;
    const slipRightProb = slipProb / 2.0;

    const actionOutcomes: { act: Action; prob: number }[] = [
      { act: action, prob: intendedProb },
      { act: (action + 3) % 4, prob: slipLeftProb },  // 90 deg counter-clockwise
      { act: (action + 1) % 4, prob: slipRightProb }, // 90 deg clockwise
    ];

    const results: Transition[] = [];

    for (const outcome of actionOutcomes) {
      if (outcome.prob <= 0) continue;

      let nx = x;
      let ny = y;

      switch (outcome.act) {
        case Action.UP:    ny -= 1; break;
        case Action.RIGHT: nx += 1; break;
        case Action.DOWN:  ny += 1; break;
        case Action.LEFT:  nx -= 1; break;
      }

      // Check bounds and obstacles (bounce back to current state if hitting wall)
      const nextKey = this.getStateKey(nx, ny);
      let targetKey = stateKey;
      if (
        nx >= 0 && nx < this.width &&
        ny >= 0 && ny < this.height &&
        !this.obstacles.has(nextKey)
      ) {
        targetKey = nextKey;
      }

      const isTerminal = this.terminals.has(targetKey);
      const reward = isTerminal ? this.terminals.get(targetKey)! : -0.04; // Step cost

      results.push({
        nextStateKey: targetKey,
        probability: outcome.prob,
        reward,
        isTerminal,
      });
    }

    return results;
  }
}

/**
 * Synchronous Dynamic Programming: Value Iteration Planner
 */
export class ValueIterationPlanner {
  public static solve(
    env: GridWorldEnvironment,
    gamma = 0.99,
    epsilon = 1e-6,
    maxIterations = 1000
  ): { values: Map<string, number>; policy: Map<string, Action>; iterations: number } {
    const states = env.getAllStates();
    let values = new Map<string, number>();
    for (const s of states) values.set(s, 0.0);

    let iterations = 0;
    while (iterations < maxIterations) {
      iterations++;
      let delta = 0.0;
      const nextValues = new Map<string, number>(values);

      for (const s of states) {
        // If terminal state, value is fixed to 0
        const transitionsUp = env.getTransitions(s, Action.UP);
        if (transitionsUp.length === 0) {
          nextValues.set(s, 0.0);
          continue;
        }

        let maxExpectedValue = -Infinity;
        for (const action of [Action.UP, Action.RIGHT, Action.DOWN, Action.LEFT]) {
          const transitions = env.getTransitions(s, action);
          let actionSum = 0.0;
          for (const t of transitions) {
            const nextV = t.isTerminal ? 0.0 : values.get(t.nextStateKey)!;
            actionSum += t.probability * (t.reward + gamma * nextV);
          }
          if (actionSum > maxExpectedValue) {
            maxExpectedValue = actionSum;
          }
        }

        nextValues.set(s, maxExpectedValue);
        delta = Math.max(delta, Math.abs(maxExpectedValue - values.get(s)!));
      }

      values = nextValues;
      if (delta < epsilon * (1.0 - gamma) / (2.0 * gamma)) {
        break;
      }
    }

    // Extract optimal greedy policy
    const policy = new Map<string, Action>();
    for (const s of states) {
      if (env.getTransitions(s, Action.UP).length === 0) continue;

      let bestAction = Action.UP;
      let maxExpectedValue = -Infinity;

      for (const action of [Action.UP, Action.RIGHT, Action.DOWN, Action.LEFT]) {
        const transitions = env.getTransitions(s, action);
        let actionSum = 0.0;
        for (const t of transitions) {
          const nextV = t.isTerminal ? 0.0 : values.get(t.nextStateKey)!;
          actionSum += t.probability * (t.reward + gamma * nextV);
        }
        if (actionSum > maxExpectedValue) {
          maxExpectedValue = actionSum;
          bestAction = action;
        }
      }
      policy.set(s, bestAction);
    }

    return { values, policy, iterations };
  }
}

/**
 * Model-Free Tabular Q-Learning Agent with Epsilon Decay
 */
export class TabularQLearningAgent {
  private readonly qTable: Map<string, Float64Array> = new Map();
  public readonly numActions: number;
  public alpha: number;
  public gamma: number;
  public epsilon: number;
  public epsilonDecay: number;
  public minEpsilon: number;

  constructor(
    numActions = 4,
    alpha = 0.1,
    gamma = 0.95,
    epsilon = 1.0,
    epsilonDecay = 0.995,
    minEpsilon = 0.01
  ) {
    this.numActions = numActions;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.epsilonDecay = epsilonDecay;
    this.minEpsilon = minEpsilon;
  }

  public getQValues(stateKey: string): Float64Array {
    let q = this.qTable.get(stateKey);
    if (!q) {
      q = new Float64Array(this.numActions); // Initializes to 0.0
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  public selectAction(stateKey: string, explore = true): Action {
    if (explore && Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.numActions) as Action;
    }

    const q = this.getQValues(stateKey);
    let bestAction = 0;
    let maxQ = q[0];

    for (let i = 1; i < this.numActions; i++) {
      if (q[i] > maxQ) {
        maxQ = q[i];
        bestAction = i;
      }
    }
    return bestAction as Action;
  }

  public update(
    stateKey: string,
    action: Action,
    reward: number,
    nextStateKey: string,
    isTerminal: boolean
  ): number {
    const q = this.getQValues(stateKey);
    const currentQ = q[action];

    let tdTarget = reward;
    if (!isTerminal) {
      const nextQ = this.getQValues(nextStateKey);
      let maxNextQ = nextQ[0];
      for (let i = 1; i < this.numActions; i++) {
        if (nextQ[i] > maxNextQ) maxNextQ = nextQ[i];
      }
      tdTarget += this.gamma * maxNextQ;
    }

    const tdError = tdTarget - currentQ;
    q[action] = currentQ + this.alpha * tdError;
    return tdError;
  }

  public decayEpsilon(): void {
    this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
  }
}
```

---

## 9. Multi-Tiered Worked Problems

### Tier 1: Class 6 Intuition — The Two-Step Gold Chest
**Problem:** An adventurer stands in Room 1.
- Walking North leads to Room 2 with immediate reward $R_1 = 0$.
- In Room 2, opening the chest gives immediate reward $R_2 = 100$ gold coins, and the quest ends.
- The discount factor is $\gamma = 0.80$.
Calculate the total discounted return $G_0$ earned from Room 1.

**Solution:**
1. Write the formula for return across two steps:
   $$G_0 = R_1 + \gamma R_2$$
2. Substitute the values:
   $$G_0 = 0 + (0.80 \times 100) = 80\text{ gold coins}$$
*Result:* Even though Room 1 offers 0 coins right now, its value is 80 gold coins because it enables reaching Room 2.

---

### Tier 2: High School Physics / Pre-Calculus — Infinite Horizon Return
**Problem:** A solar-powered Mars rover enters a power-saving orbit. Every planetary cycle ($t = 1, 2, 3, \dots$), it transmits a data packet worth $R = +10$ scientific points. The onboard battery degradation factor is $\gamma = 0.90$. If the rover operates indefinitely, calculate the exact finite sum of its cumulative lifetime return $G_0 = \sum_{k=0}^\infty \gamma^k R$.

**Solution:**
1. Factor out the constant reward $R = 10$:
   $$G_0 = 10 \sum_{k=0}^\infty (0.90)^k$$
2. Recall the infinite geometric series formula $\sum_{k=0}^\infty r^k = \frac{1}{1 - r}$ for $|r| < 1$:
   $$\sum_{k=0}^\infty (0.90)^k = \frac{1}{1 - 0.90} = \frac{1}{0.10} = 10$$
3. Multiply by $R$:
   $$G_0 = 10 \times 10 = \mathbf{100.0\text{ points}}$$
*Result:* Over an infinite lifetime, the rover accumulates exactly 100.0 discounted points.

---

### Tier 3: AP / First-Year Undergraduate — Bellman Expectation on Stochastic Branching
**Problem:** A robotic warehouse cart is in state $S_0$. It executes action `Forward`.
- With probability $P = 0.80$, the wheels grip properly: it lands in state $S_1$ and receives reward $R = +2.0$.
- With probability $P = 0.20$, the wheels slip on an oil puddle: it veers into state $S_2$ and receives reward $R = -5.0$.
Assume the downstream state values are known: $V(S_1) = 20.0$ and $V(S_2) = 5.0$. The discount factor is $\gamma = 0.90$.
Compute the exact action value $Q(S_0, \text{Forward})$.

**Solution:**
1. State the Bellman Expectation formula:
   $$Q(S_0, \text{Forward}) = \sum_{s' \in \{S_1, S_2\}} \mathcal{P}(s' \mid S_0, \text{Forward}) \left[ \mathcal{R}(S_0, \text{Forward}, s') + \gamma V(s') \right]$$
2. Compute the branch for $S_1$ (grip):
   $$\text{Term}_1 = 0.80 \times [2.0 + 0.90 \times 20.0] = 0.80 \times [2.0 + 18.0] = 0.80 \times 20.0 = 16.0$$
3. Compute the branch for $S_2$ (slip):
   $$\text{Term}_2 = 0.20 \times [-5.0 + 0.90 \times 5.0] = 0.20 \times [-5.0 + 4.5] = 0.20 \times [-0.5] = -0.10$$
4. Sum both branches:
   $$Q(S_0, \text{Forward}) = 16.0 + (-0.10) = \mathbf{15.90}$$

---

### Tier 4: University Undergraduate — Tabular Q-Learning Step Trace
**Problem:** An autonomous drone explores an aerial grid. At time step $t$, the drone is at state $S_t = \text{"Waypoint 4"}$ with current Q-table estimates:
- $Q(\text{"Waypoint 4"}, \text{Climb}) = 12.0$
- $Q(\text{"Waypoint 4"}, \text{Dive}) = 14.5$
- $Q(\text{"Waypoint 4"}, \text{Hover}) = 9.0$

The agent takes action $A_t = \text{Dive}$.
It receives sensory reward $R_{t+1} = +3.0$ and enters state $S_{t+1} = \text{"Wind Tunnel"}$.
The estimated Q-values for all available actions at $S_{t+1}$ are:
- $Q(\text{"Wind Tunnel"}, \text{Climb}) = 18.0$
- $Q(\text{"Wind Tunnel"}, \text{Dive}) = 22.0$
- $Q(\text{"Wind Tunnel"}, \text{Hover}) = 15.0$

The learning rate is $\alpha = 0.25$ and discount factor is $\gamma = 0.90$.
Calculate:
1. The maximum Q-value at the next state $\max_{a'} Q(S_{t+1}, a')$.
2. The TD Target.
3. The TD Error $\delta_t$.
4. The updated value $Q_{\text{new}}(\text{"Waypoint 4"}, \text{Dive})$.

**Solution:**
1. Maximum action value in state $S_{t+1}$:
   $$\max_{a'} Q(\text{"Wind Tunnel"}, a') = \max(18.0, 22.0, 15.0) = \mathbf{22.0}$$
2. TD Target:
   $$\text{Target} = R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a') = 3.0 + (0.90 \times 22.0) = 3.0 + 19.8 = \mathbf{22.8}$$
3. TD Error $\delta_t$:
   $$\delta_t = \text{Target} - Q(\text{"Waypoint 4"}, \text{Dive}) = 22.8 - 14.5 = \mathbf{+8.3}$$
4. Q-Value Update:
   $$Q_{\text{new}} = Q_{\text{old}} + \alpha \delta_t = 14.5 + (0.25 \times 8.3) = 14.5 + 2.075 = \mathbf{16.575}$$

---

### Tier 5: Graduate / Research Level — Value Iteration Convergence Bound
**Problem:** Prove that after $k$ iterations of the Bellman backup operator $T$ starting from an initial value function $V_0 = \vec{0}$, the maximum absolute error between the current iterate $V_k$ and the true optimal value function $V^*$ satisfies:
$$\|V_k - V^*\|_\infty \le \frac{\gamma^k}{1 - \gamma} \|V_1 - V_0\|_\infty$$

**Solution:**
1. Express the difference $V^* - V_k$ as a telescoping sum of consecutive iterates:
   $$V^* - V_k = \sum_{i=k}^\infty (V_{i+1} - V_i)$$
   since $V^* = \lim_{n \to \infty} V_n$.
2. Apply the infinity norm and the triangle inequality:
   $$\|V^* - V_k\|_\infty = \left\| \sum_{i=k}^\infty (V_{i+1} - V_i) \right\|_\infty \le \sum_{i=k}^\infty \|V_{i+1} - V_i\|_\infty$$
3. By the Banach Contraction Theorem proved in Section 5.1:
   $$\|V_{i+1} - V_i\|_\infty = \|T V_i - T V_{i-1}\|_\infty \le \gamma \|V_i - V_{i-1}\|_\infty \le \gamma^i \|V_1 - V_0\|_\infty$$
4. Substitute this bound back into the summation:
   $$\|V^* - V_k\|_\infty \le \sum_{i=k}^\infty \gamma^i \|V_1 - V_0\|_\infty = \|V_1 - V_0\|_\infty \sum_{i=k}^\infty \gamma^i$$
5. Factor out $\gamma^k$ from the summation:
   $$\sum_{i=k}^\infty \gamma^i = \gamma^k \sum_{j=0}^\infty \gamma^j = \frac{\gamma^k}{1 - \gamma}$$
6. Combining results yields the exact contraction stopping criterion:
   $$\mathbf{\|V_k - V^*\|_\infty \le \frac{\gamma^k}{1 - \gamma} \|V_1 - V_0\|_\infty} \quad \blacksquare$$

---

## 10. Socratic Synthesis & Conceptual Mastery

1. **Question:** Why can't we simply use Dijkstra's Algorithm or A* search instead of Reinforcement Learning for all decision problems?
   - **Answer:** Dijkstra and A* require complete, deterministic knowledge of the graph topology and edge weights ahead of time. In the real world, the environment is stochastic (actions have probabilistic outcomes) and the transition probabilities $\mathcal{P}(s' \mid s, a)$ are unknown. RL algorithms learn directly from sampled sensory experience without needing an analytical map.

2. **Question:** What is the profound consequence of the "Off-Policy" property in Q-Learning?
   - **Answer:** In off-policy learning, the agent can behave completely erratically, dangerously, or randomly ($\epsilon = 1.0$), yet the values $Q(s, a)$ being computed in memory are converging to the *optimal, ideal policy*. The agent does not need to act perfectly to learn perfection.

3. **Question:** What happens if the discount factor $\gamma = 0$?
   - **Answer:** When $\gamma = 0$, $G_t = R_{t+1}$. The agent becomes completely myopic (instant gratification only). It behaves identically to the starving mouse in Section 0 that walks into the trapdoor for a single breadcrumb.
