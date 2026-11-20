# Markov Decision Processes, Bellman Optimality, and Value Iteration

---

## 1. The Epistemological Paradigm: Learning Through Trial, Error, and Reward

### 1.1 The Third Pillar of Machine Learning
In traditional **Supervised Learning**, an algorithm is given pairs of inputs and ground-truth labels by an omniscient human teacher ($x \to y$). In **Unsupervised Learning**, an algorithm clusters unlabeled data according to intrinsic patterns ($x \to \text{clusters}$).

In the real world, biological organisms and autonomous robots do not have teachers hovering over them providing ground-truth answers for every muscle twitch. A baby learning to walk, a bird learning to fly, or a rover exploring Mars learns via **Reinforcement Learning (RL)**:
- Exploring actions in an interactive environment.
- Experiencing physical consequences.
- Receiving delayed scalar feedback: **rewards** ($+R$) for desirable outcomes and **penalties** ($-R$) for falls or crashes.

The objective is not to match a label, but to **maximize cumulative long-term reward over time**.

### 1.2 The Agent-Environment Interaction Loop (Sutton & Barto)
At each discrete time step $t = 0, 1, 2, \dots$:
1. The **Agent** observes the environment state $S_t \in \mathcal{S}$.
2. The agent executes an action $A_t \in \mathcal{A}$ based on its policy $\pi$.
3. The **Environment** transitions to a new state $S_{t+1} \in \mathcal{S}$ and emits a scalar reward $R_{t+1} \in \mathbb{R}$.

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

### 2.1 The Markov Property
A state representation $S_t$ satisfies the **Markov Property** if the transition probability to the next state depends *only* upon the immediate current state and action, completely independent of the past history of states and actions:

$$ \mathbf{P(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots, S_0, A_0) = P(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t)} $$
*Intuition:* "The future is conditionally independent of the past given the present." If you know the exact position and velocity of a billiard ball right now, knowing which cushions it bounced off two minutes ago provides zero additional information about where it will go next.

### 2.2 The MDP 5-Tuple $(\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$
A finite Markov Decision Process is formally defined by:
1. **$\mathcal{S}$:** Finite set of valid states.
2. **$\mathcal{A}$:** Finite set of available actions.
3. **$\mathcal{P}(s' \mid s, a)$:** Transition probability distribution:
   $$ \mathcal{P}(s' \mid s, a) = P(S_{t+1} = s' \mid S_t = s, A_t = a) $$
4. **$\mathcal{R}(s, a, s')$:** Reward function:
   $$ \mathcal{R}(s, a, s') = \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a, S_{t+1} = s'] $$
5. **$\gamma \in [0, 1)$:** **Discount factor**.

### 2.3 Discounted Cumulative Return ($G_t$)
The goal of the agent is to maximize the expected **Discounted Return** $G_t$:
$$ \mathbf{G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = \sum_{k=0}^\infty \gamma^k R_{t+k+1}} $$
Why discount future rewards with $\gamma < 1$?
1. **Mathematical Convergence:** For continuous or infinite-horizon tasks, $\sum_{k=0}^\infty \gamma^k = \frac{1}{1 - \gamma} < \infty$, preventing infinite returns.
2. **Uncertainty of the Future:** Immediate rewards are guaranteed; distant future rewards carry environmental risk.

---

## 3. Policies and Value Functions

- **Policy ($\pi$):** The agent's decision-making strategy. A stochastic policy $\pi(a \mid s) = P(A_t = a \mid S_t = s)$ defines the probability of selecting action $a$ in state $s$.
- **State-Value Function ($V^\pi(s)$):** Expected return starting in state $s$ and following policy $\pi$ thereafter:
  $$ V^\pi(s) = \mathbb{E}_\pi [G_t \mid S_t = s] $$
- **Action-Value Function ($Q^\pi(s, a)$):** Expected return starting in state $s$, taking action $a$, and following policy $\pi$ thereafter:
  $$ Q^\pi(s, a) = \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a] $$

---

## 4. The Bellman Equations: Recursive Optimality

In 1957, **Richard Bellman** unlocked dynamic programming by recognizing that value functions satisfy a fundamental recursive relationship: **the value of the current state equals the immediate reward plus the discounted value of the next state**.

### 4.1 The Bellman Expectation Equation
Unrolling the return definition $G_t = R_{t+1} + \gamma G_{t+1}$:
$$ \mathbf{V^\pi(s) = \sum_{a \in \mathcal{A}} \pi(a \mid s) \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma V^\pi(s') \right]} $$

### 4.2 The Bellman Optimality Equations
An optimal policy $\pi^*$ achieves the highest possible value for every state: $V^*(s) = \max_\pi V^\pi(s)$.
Under an optimal policy, the agent greedily selects the action that maximizes expected future return:

$$ \mathbf{V^*(s) = \max_{a \in \mathcal{A}} \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma V^*(s') \right]} $$

$$ \mathbf{Q^*(s, a) = \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) \left[ \mathcal{R}(s, a, s') + \gamma \max_{a' \in \mathcal{A}} Q^*(s', a') \right]} $$

---

## 5. Dynamic Programming: Value Iteration

The Bellman Optimality Equation defines an operator $T: \mathbb{R}^{|\mathcal{S}|} \to \mathbb{R}^{|\mathcal{S}|}$ called the **Bellman Backup Operator**:
$$ (T V)(s) = \max_{a} \sum_{s'} \mathcal{P}(s' \mid s, a) [r + \gamma V(s')] $$

### Banach Fixed-Point Contraction Theorem
It is proven that the operator $T$ is a **$\gamma$-contraction mapping** in the infinity norm:
$$ \|T V_1 - T V_2\|_\infty \le \gamma \|V_1 - V_2\|_\infty $$
Since $\gamma < 1$, applying the Bellman backup iteratively from **any arbitrary initial values $V_0$** is guaranteed to converge exponentially to the unique optimal value function $V^*$!

### The Value Iteration Algorithm
1. Initialize $V(s) = 0$ for all $s \in \mathcal{S}$.
2. Repeat until $\Delta = \max_s |V(s) - V_{\text{old}}(s)| < \epsilon$:
   $$ V(s) \gets \max_a \sum_{s'} \mathcal{P}(s' \mid s, a) [r + \gamma V(s')] $$
3. Extract the deterministic optimal policy:
   $$ \pi^*(s) = \arg\max_a \sum_{s'} \mathcal{P}(s' \mid s, a) [r + \gamma V(s')] $$

---

## 6. Model-Free Reinforcement Learning: Tabular Q-Learning

When the transition probabilities $\mathcal{P}(s' \mid s, a)$ and reward function $\mathcal{R}$ are unknown (e.g. black-box game engine or real physical robot), the agent cannot perform dynamic programming backups.

In 1989, **Chris Watkins** introduced **Q-Learning**, a model-free **Temporal Difference (TD)** algorithm:

$$ \mathbf{Q(S_t, A_t) \gets Q(S_t, A_t) + \alpha \underbrace{\left[ R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a') - Q(S_t, A_t) \right]}_{\text{TD Error } \delta_t}} $$
where:
- $\alpha \in (0, 1]$ is the learning rate.
- $R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a')$ is the **TD Target**.
- $\delta_t$ is the **Temporal Difference Error**—the surprise difference between what the agent experienced and what it previously expected!

### Exploration vs. Exploitation: $\epsilon$-Greedy Policy
If the agent always takes the action with highest estimated $Q(s, a)$ (exploitation), it may get trapped in suboptimal behaviors.  
With **$\epsilon$-greedy exploration**:
- With probability $\epsilon$: pick a random action (explore new possibilities).
- With probability $1 - \epsilon$: pick action $\arg\max_a Q(s, a)$ (exploit current best knowledge).

---

## 7. Multi-Tiered Worked Examples

### Level 1: 1D Line World Value Iteration Step
Consider three states on a line: $[S_1] - [S_2] - [Goal]$.  
- From $S_1$, action Right moves to $S_2$ with reward $R = 0$.
- From $S_2$, action Right moves to $Goal$ with reward $R = +100$ and terminates.
- Discount factor $\gamma = 0.90$.
Initialize $V_0(S_1) = 0, V_0(S_2) = 0, V(Goal) = 0$. Trace Value Iteration.

**Iteration 1:**
- $V_1(S_2) = \max(R + \gamma V_0(Goal)) = 100 + 0.9(0) = \mathbf{100.0}$
- $V_1(S_1) = \max(R + \gamma V_0(S_2)) = 0 + 0.9(0) = \mathbf{0.0}$

**Iteration 2:**
- $V_2(S_2) = 100 + 0.9(0) = \mathbf{100.0}$
- $V_2(S_1) = 0 + \gamma V_1(S_2) = 0 + 0.9(100.0) = \mathbf{90.0}$
*Notice:* The reward value of $+100$ at the goal propagates backward along the state chain discounted by $\gamma$, teaching $S_1$ that moving towards $S_2$ has high expected value!

---

### Level 2: Tabular Q-Learning Step Trace
An agent at state $S_0$ has estimated $Q(S_0, \text{Jump}) = 10.0$.  
The agent takes action $\text{Jump}$, receives reward $R = +2.0$, and lands in state $S_1$.  
At $S_1$, the available action values are $Q(S_1, \text{Run}) = 15.0$ and $Q(S_1, \text{Duck}) = 8.0$.  
With learning rate $\alpha = 0.2$ and discount factor $\gamma = 0.8$, update $Q(S_0, \text{Jump})$.

**Step-by-step Solution:**
1. Find max Q-value at next state $S_1$:
   $$ \max_{a'} Q(S_1, a') = \max(15.0, 8.0) = 15.0 $$
2. Compute TD Target:
   $$ \text{Target} = R + \gamma \max Q(S_1, a') = 2.0 + 0.8(15.0) = 2.0 + 12.0 = 14.0 $$
3. Compute TD Error $\delta$:
   $$ \delta = \text{Target} - Q(S_0, \text{Jump}) = 14.0 - 10.0 = +4.0 $$
4. Apply Q-Learning update:
   $$ Q_{\text{new}}(S_0, \text{Jump}) = 10.0 + \alpha \cdot \delta = 10.0 + 0.2(4.0) = 10.0 + 0.8 = \mathbf{10.8} $$

---

## 8. Production-Ready Computational Engine: Tabular Q-Learning Agent

```typescript
export class TabularQLearningAgent {
  private qTable: Map<string, number[]> = new Map();
  private numActions: number;
  private alpha: number;  // Learning rate
  private gamma: number;  // Discount factor
  private epsilon: number;// Exploration rate

  constructor(numActions: number, alpha = 0.1, gamma = 0.95, epsilon = 0.1) {
    this.numActions = numActions;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
  }

  private getQValues(stateKey: string): number[] {
    let q = this.qTable.get(stateKey);
    if (!q) {
      q = new Array(this.numActions).fill(0);
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  public selectAction(stateKey: string): number {
    // Epsilon-greedy action selection
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.numActions);
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
    return bestAction;
  }

  public update(
    state: string,
    action: number,
    reward: number,
    nextState: string,
    isTerminal: boolean
  ): number {
    const q = this.getQValues(state);
    const currentQ = q[action];

    let target = reward;
    if (!isTerminal) {
      const nextQ = this.getQValues(nextState);
      const maxNextQ = Math.max(...nextQ);
      target += this.gamma * maxNextQ;
    }

    const tdError = target - currentQ;
    q[action] = currentQ + this.alpha * tdError;
    return tdError;
  }
}
```

---

## 9. Socratic Self-Check & Verification

1. **Question:** Why does Q-learning converge to the optimal policy even if the agent acts according to an exploratory $\epsilon$-greedy policy?
   - **Answer:** Because Q-learning is an **off-policy** algorithm: its target value uses $\max_{a'} Q(S_{t+1}, a')$—the greedy action of the optimal policy—regardless of what action the behavioral exploration policy actually executes next!
2. **Question:** What happens to an MDP if the discount factor $\gamma = 1.0$ in an environment with no terminal absorbing state?
   - **Answer:** The cumulative return $G_t = \sum_{k=0}^\infty R_{t+k+1}$ will sum an infinite sequence of non-zero rewards, diverging to $+\infty$ or $-\infty$. The Bellman operator ceases to be a contraction mapping, and value iteration fails to converge.
3. **Question:** What is the fundamental difference between dynamic programming value iteration and temporal difference Q-learning?
   - **Answer:** Value iteration requires complete knowledge of the transition probability matrix $\mathcal{P}(s' \mid s, a)$ and reward model $\mathcal{R}$ (model-based planning); Q-learning updates values directly from sampled transitions $(s, a, r, s')$ gathered through interaction without knowing the underlying probabilities (model-free learning).
