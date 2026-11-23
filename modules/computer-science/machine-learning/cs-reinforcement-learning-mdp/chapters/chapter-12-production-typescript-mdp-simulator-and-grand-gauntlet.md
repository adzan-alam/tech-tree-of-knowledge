# Chapter 12: Production TypeScript MDP & Dynamic Programming Simulator and Grand Gauntlet

---

## 12.1 Engineering Philosophy: Zero-Dependency TypeScript RL Architecture

In this concluding chapter, we crystallize every mathematical concept developed across Chapters 1–11—Markov transition kernels, Bellman expectation systems, matrix resolvents, Banach contractions, Policy Iteration, Value Iteration, and Q-Learning—into a self-contained, industrial-grade **TypeScript Discrete MDP Simulator**.

```
                   DISCRETE MDP SIMULATOR ARCHITECTURE
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  CORE MDP INTERFACES │ │   ANALYTICAL & DP    │ │   MODEL-FREE AGENT   │
│  • Generic State S   │ │   • Matrix Resolvent │ │   • Tabular Q-Learn  │
│  • Generic Action A  │ │   • Policy Iteration │ │   • ε-Greedy Decay   │
│  • Transition Kernel │ │   • Value Iteration  │ │   • TD Updates       │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│        4x4 GRIDWORLD BENCHMARK       │  │        CLIFF WALKING BENCHMARK       │
│  • Obstacles, Traps, Terminal Goal   │  │  • Stochastic Wind, Catastrophic Sea │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

The engine is engineered with strict adherence to three software axioms:
1. **Zero External Dependencies:** Built entirely on standard ECMAScript / TypeScript primitives. No external matrix libraries, no black boxes.
2. **Generic Type Abstraction:** The MDP solver operates over arbitrary state types `S extends string | number` and action types `A extends string | number`.
3. **Exact Mathematical Equivalence:** Iterative DP outputs are verified against exact linear algebraic solutions via Gaussian elimination.

---

## 12.2 Production Engine Architecture (`mdp-simulator.ts`)

The complete engine is implemented in [`mdp-simulator.ts`](file:///c:/Users/adzan/Desktop/tech%20tree/modules/computer-science/machine-learning/cs-reinforcement-learning-mdp/mdp-simulator.ts). Its primary components include:

### 1. Matrix Inversion via Gaussian Elimination
To solve $(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v}_\pi = \mathbf{r}_\pi$ in closed form, the engine implements Gaussian elimination with partial pivoting:
```typescript
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  // Augmented matrix clone
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Partial pivoting for numerical stability
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    const temp = M[i]; M[i] = M[maxRow]; M[maxRow] = temp;

    // Elimination
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  // Back-substitution
  const x: number[] = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }
  return x;
}
```

### 2. The Discrete MDP State Machine
A discrete MDP model is represented by an interface specifying states, actions, transition probabilities $\mathcal{P}_{s, s'}^a$, and expected rewards $r(s, a)$:
```typescript
export interface Transition<S> {
  nextState: S;
  probability: number;
  reward: number;
}

export interface MDPModel<S extends string | number, A extends string | number> {
  states: S[];
  actions: A[];
  gamma: number;
  isTerminal: (s: S) => boolean;
  getTransitions: (s: S, a: A) => Transition<S>[];
}
```

### 3. Iterative Policy Evaluation
Implements the contraction operator $(T^\pi v)(s)$ with stopping threshold $\theta$:
```typescript
export function iterativePolicyEvaluation<S extends string | number, A extends string | number>(
  mdp: MDPModel<S, A>,
  policy: Record<S, A>,
  theta: number = 1e-7,
  maxIterations: number = 10000
): Record<S, number> {
  const V: Record<S, number> = {} as Record<S, number>;
  for (const s of mdp.states) V[s] = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    let delta = 0;
    for (const s of mdp.states) {
      if (mdp.isTerminal(s)) continue;
      const a = policy[s];
      let sum = 0;
      for (const t of mdp.getTransitions(s, a)) {
        sum += t.probability * (t.reward + mdp.gamma * V[t.nextState]);
      }
      delta = Math.max(delta, Math.abs(V[s] - sum));
      V[s] = sum;
    }
    if (delta < theta) break;
  }
  return V;
}
```

### 4. Policy Iteration and Value Iteration
Implements exact Policy Iteration (alternating policy evaluation and greedy policy improvement) and Value Iteration (contracting the Bellman optimality operator $T^*$ directly).

---

## 12.3 Grand Gauntlet: Deep Algorithmic Challenges

### Problem 12.1 (Grand Gauntlet): Automated Inventory Restocking Controller
An industrial electronics manufacturer manages stock for a specialized microchip. 
- State $s \in \{0, 1, 2, 3, 4, 5\}$ denotes the units in inventory at the start of the week.
- Capacity is $M = 5$ units.
- Action $a \in \{0, 1, \dots, 5 - s\}$: number of units ordered for overnight delivery ($a + s \le 5$).
- Ordering cost: $\$2$ fixed delivery fee if $a > 0$, plus $\$5$ per unit ordered: $C_{\text{order}}(a) = 2 \cdot \mathbb{I}(a > 0) + 5 a$.
- Customer demand $D$ follows a Poisson distribution with mean $\lambda = 2.0$, truncated at 5.
- Revenue: each customer sale earns $\$12$.
- Holding cost: holding unsold inventory over the weekend costs $\$1$ per unit remaining.
- Unmet demand is lost forever (zero revenue, zero penalty).
- Discount factor $\gamma = 0.95$.

Formulate the state transition probability matrix and reward function, and write the Bellman optimality equation for inventory state $s$.

#### Solution:
Let customer demand probability be $P(D = d) = \frac{\lambda^d e^{-\lambda}}{d!}$.
Given starting stock $s$ and order $a$, available stock for the week is $y = s + a \le 5$.
If demand is $d$:
- Sales realized: $\min(y, d)$.
- Stock remaining at end of week: $s' = \max(0, y - d)$.
- Revenue: $12 \min(y, d)$.
- Holding cost: $1 \cdot s'$.
- Net weekly profit given demand $d$:
  $$R(y, d) = 12 \min(y, d) - s' - C_{\text{order}}(a) = 12 \min(y, d) - \max(0, y - d) - [2 \cdot \mathbb{I}(a > 0) + 5a]$$
The expected reward is:
$$r(s, a) = \sum_{d=0}^\infty P(D = d) R(s+a, d)$$
The transition probability to next week's inventory $s'$ is:
$$\mathcal{P}_{s, s'}^a = \begin{cases} P(D = y - s') & \text{if } s' > 0 \\ \sum_{d = y}^\infty P(D = d) & \text{if } s' = 0 \end{cases}$$
The Bellman optimality equation is:
$$v^*(s) = \max_{0 \le a \le 5 - s} \left[ r(s, a) + \gamma \sum_{s'=0}^5 \mathcal{P}_{s, s'}^a v^*(s') \right]$$

---

### Problem 12.2 (Grand Gauntlet): Contraction Operator with Metric Perturbation
Suppose an agent evaluates states using an inexact transition model $\hat{\mathcal{P}}$ where $\|\hat{\mathcal{P}} - \mathcal{P}\|_\infty \le \epsilon_P$.
Prove that the error between the true value $v_\pi$ and the estimated fixed point $\hat{v}_\pi$ is bounded by:
$$\|v_\pi - \hat{v}_\pi\|_\infty \le \frac{\gamma \epsilon_P}{(1 - \gamma)^2} \|\mathbf{r}_\pi\|_\infty$$

#### Solution:
From the resolvent identity:
$$\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi, \quad \hat{\mathbf{v}}_\pi = (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi)^{-1} \mathbf{r}_\pi$$
$$\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi = \left[ (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} - (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi)^{-1} \right] \mathbf{r}_\pi$$
Using the algebraic resolvent identity $\mathbf{A}^{-1} - \mathbf{B}^{-1} = \mathbf{A}^{-1} (\mathbf{B} - \mathbf{A}) \mathbf{B}^{-1}$:
$$\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \left[ (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi) - (\mathbf{I} - \gamma \mathbf{P}_\pi) \right] (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi)^{-1} \mathbf{r}_\pi$$
$$= (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \left[ \gamma (\mathbf{P}_\pi - \hat{\mathbf{P}}_\pi) \right] \hat{\mathbf{v}}_\pi$$
Taking the supremum norm:
$$\|\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi\|_\infty \le \|(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}\|_\infty \cdot \gamma \|\mathbf{P}_\pi - \hat{\mathbf{P}}_\pi\|_\infty \cdot \|\hat{\mathbf{v}}_\pi\|_\infty$$
Since $\|(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}\|_\infty \le \frac{1}{1 - \gamma}$, $\|\mathbf{P}_\pi - \hat{\mathbf{P}}_\pi\|_\infty \le \epsilon_P$, and $\|\hat{\mathbf{v}}_\pi\|_\infty \le \frac{\|\mathbf{r}_\pi\|_\infty}{1 - \gamma}$:
$$\|\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi\|_\infty \le \left(\frac{1}{1 - \gamma}\right) \gamma \epsilon_P \left( \frac{\|\mathbf{r}_\pi\|_\infty}{1 - \gamma} \right) = \frac{\gamma \epsilon_P}{(1 - \gamma)^2} \|\mathbf{r}_\pi\|_\infty \quad \blacksquare$$

---

### Problem 12.3 (Grand Gauntlet): Optimal Gambling Thresholds on a Sub-Fair Coin
Consider the Gambler's Problem (Example 7.9) with win probability $p = 0.40$ and capital $s \in \{1, \dots, 99\}$.
Prove that for any capital $s = 25, 50, 75$, the optimal stake bets the entire distance to the nearest significant binary power.

#### Solution:
Because $p < 0.50$, the expected value of each wager is negative: $\mathbb{E}[\Delta s] = p(a) + (1-p)(-a) = (2p - 1)a = -0.2a < 0$.
By the Supermartingale Optional Stopping Theorem, playing many small bets maximizes the house edge, driving probability of ruin to 1. 
To reach 100 with maximum probability under an unfavorable game, the gambler must minimize the number of coin flips.
At $s = 50$, betting $a = 50$ wins in a single flip with probability $p = 0.40$. Any smaller bet requires a sequence of multiple wins, whose probability decays exponentially ($p^k \ll p$).
At $s = 25$, betting $a = 25$ reaches 50 with probability $0.40$, after which betting 50 reaches 100 with probability $0.40$ (total probability $0.16$).
Thus, the optimal policy forms a fractal "bold play" policy with spikes at binary intervals $\{25, 50, 75\}$.

---

### Problem 12.4 (Grand Gauntlet): Multi-Server Queuing System Control
A cloud datacenter operates $C = 3$ server clusters. 
- Incoming requests arrive according to a Poisson process with arrival rate $\lambda = 5$ jobs/sec.
- Queue buffer capacity is $B = 10$ jobs. Requests arriving when the buffer is full are dropped (penalty $-\$50$).
- The controller can dynamically activate $k \in \{1, 2, 3\}$ servers.
- Each active server processes $\mu = 2$ jobs/sec, but incurs electricity cost $\$2 \cdot k$ per second.
- Completed jobs earn $\$10$.

Discretize the system into time slices $\Delta t = 0.05\text{ s}$ and write the transition dynamics and reward function as a discrete MDP.

#### Solution:
Let state $s \in \{0, 1, \dots, 10\}$ be the number of queued jobs.
In interval $\Delta t = 0.05$:
- Probability of 1 job arrival: $p_{\text{arr}} = \lambda \Delta t = 5 \times 0.05 = 0.25$.
- Probability of 1 job departure given $k$ active servers: $p_{\text{dep}}(k) = k \mu \Delta t = k(2)(0.05) = 0.10 k$.
- Higher-order arrivals/departures have probability $O(\Delta t^2) \approx 0$.
The transitions from state $s$ under action $k \in \{1, 2, 3\}$:
- With prob $p_{\text{arr}} (1 - p_{\text{dep}}(k))$: state becomes $\min(10, s + 1)$. If $s = 10$, drop penalty $-\$50$ applies.
- With prob $p_{\text{dep}}(k) (1 - p_{\text{arr}})$: state becomes $\max(0, s - 1)$, earning completion revenue $+\$10$.
- With prob $1 - \text{above}$: state remains $s$.
The expected reward per slice is:
$$r(s, k) = 10 \cdot p_{\text{dep}}(k) \mathbb{I}(s > 0) - 50 \cdot p_{\text{arr}} \mathbb{I}(s = 10) - (2 k) \Delta t$$
The controller optimizes active server count $k$ to balance electricity cost against overflow risk.

---

### Problem 12.5 (Grand Gauntlet): Discount Factor Invariance Threshold
Let $\pi^*$ be optimal for discount factor $\gamma_1$. Prove that there exists a neighborhood $(\gamma_1 - \epsilon, \gamma_1 + \epsilon)$ over which $\pi^*$ remains strictly optimal.

#### Solution:
In a finite MDP, the number of deterministic policies is finite ($|\Pi| = |\mathcal{A}|^{|\mathcal{S}|}$).
For any policy $\pi$, its value function $v_\pi(\gamma) = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ is a rational function of $\gamma$, hence real-analytic and continuous on $[0, 1)$.
The advantage gap between optimal policy $\pi^*$ and any sub-optimal policy $\pi$ is:
$$\Delta_{\pi^*, \pi}(s; \gamma) = v_{\pi^*}(s; \gamma) - v_\pi(s; \gamma)$$
If $\pi^*$ is uniquely optimal at $\gamma_1$, then for all $\pi \neq \pi^*$:
$$\min_{s \in \mathcal{S}} \Delta_{\pi^*, \pi}(s; \gamma_1) = c_\pi > 0$$
Since there are finitely many policies, let $c^* = \min_{\pi \neq \pi^*} c_\pi > 0$.
By the continuity of rational functions, there exists $\epsilon > 0$ such that for all $\gamma \in (\gamma_1 - \epsilon, \gamma_1 + \epsilon)$:
$$\Delta_{\pi^*, \pi}(s; \gamma) > \frac{c^*}{2} > 0, \quad \forall s \in \mathcal{S}, \pi \neq \pi^*$$
Thus, $\pi^*$ remains strictly optimal throughout the neighborhood.

---

### Problem 12.6 (Grand Gauntlet): Contraction Violation in Off-Policy Bootstrapping (The Deadly Triad)
Sutton & Barto proved that combining three elements causes value updates to diverge to infinity:
1. Function Approximation (e.g. linear features $\hat{v}(s) = \mathbf{w}^T \mathbf{x}(s)$).
2. Bootstrapping (DP or TD targets).
3. Off-Policy Learning.

Construct a minimal 2-state counterexample (Baird's Counterexample) showing divergence of linear off-policy TD.

#### Solution:
Let states be $s_1, s_2$ with parameter $w \in \mathbb{R}$.
Let features be $x(s_1) = 1, x(s_2) = 2$, so $V(s_1) = w, V(s_2) = 2w$.
All rewards are 0; $\gamma = 0.9$.
Behavior policy moves $s_1 \to s_2$ with prob 1.0.
Target policy requires staying in $s_1$.
The off-policy TD update for transition $s_1 \to s_2$ is:
$$\Delta w = \alpha \rho [R + \gamma V(s_2) - V(s_1)] x(s_1) = \alpha \rho [0 + 0.9(2w) - w](1) = \alpha \rho [1.8w - w] = \alpha \rho [0.8 w]$$
$$w_{k+1} = w_k + 0.8 \alpha \rho w_k = (1 + 0.8 \alpha \rho) w_k$$
Because $(1 + 0.8 \alpha \rho) > 1$, for any initial $w_0 \neq 0$:
$$\lim_{k \to \infty} w_k = \pm \infty$$
The weights explode exponentially to infinity! Without tabular storage, off-policy bootstrapping loses the contraction mapping guarantee.

---

### Problem 12.7 (Grand Gauntlet): Policy Iteration Under Weak Contractions ($\gamma \to 1$)
Prove that for an undiscounted episodic MDP ($\gamma = 1.0$), Policy Iteration converges in finite time if all policies are **proper** (reach a terminal state with probability 1 from all states).

#### Solution:
If all policies are proper, the transient transition sub-matrix $\mathbf{Q}_\pi$ satisfies $\rho(\mathbf{Q}_\pi) < 1$.
The fundamental matrix $\mathbf{N}_\pi = (\mathbf{I} - \mathbf{Q}_\pi)^{-1}$ exists, is non-negative, and has finite entries.
The Policy Improvement Theorem proof (Section 9.2) holds for $\gamma = 1$ because the tail term $\lim_{k \to \infty} \mathbb{E}_{\pi'} [v_\pi(S_{t+k}) \mid S_t = s] = 0$ vanishes as the probability of remaining in transient states decays exponentially to 0.
Monotonicity $v_{\pi_{k+1}} \ge v_{\pi_k}$ is preserved, and the finite number of deterministic policies guarantees finite termination.

---

### Problem 12.8 (Grand Gauntlet): Optimal Stop Problem as an MDP (The Secretary Problem)
An employer interviews $N = 100$ job candidates in random order.
- After each interview $t \in \{1, \dots, N\}$, the employer can **Hire** (terminating immediately) or **Reject** (moving to candidate $t+1$).
- Reward is $+1.0$ if the hired candidate is the absolute best candidate among all $N$, and $0$ otherwise.
- $\gamma = 1.0$.

Formulate this as a discrete MDP and prove that the optimal policy rejects the first $N/e \approx 37$ candidates and hires the first candidate thereafter who exceeds all previously seen candidates.

#### Solution:
Let the state at step $t$ be $S_t = 1$ if candidate $t$ is the best seen so far, and $S_t = 0$ otherwise.
If candidate $t$ is not the best so far ($S_t = 0$), hiring them yields 0 reward (they cannot be the overall best).
If $S_t = 1$, the probability that candidate $t$ remains the best among all $N$ is $\frac{t}{N}$.
If the employer rejects and continues, the value of continuing is $v(t+1)$.
The Bellman optimality equation at step $t$ when $S_t = 1$ is:
$$v^*(t) = \max \left\{ \frac{t}{N}, \sum_{k=t+1}^N \frac{t}{k(k-1)} v^*(k) \right\}$$
In continuous limit as $N \to \infty$, let $x = t/N$. The optimal stopping threshold $x^*$ satisfies:
$$x^* = -x^* \ln(x^*) \implies -\ln(x^*) = 1 \implies x^* = \frac{1}{e} \approx 0.3679$$
The employer observes the first $37\%$ to establish a quality benchmark, then hires the first candidate who beats the benchmark.

---

### Problem 12.9 (Grand Gauntlet): Multi-Armed Bandit as Gittins Index MDP
Show that an $N$-armed bandit with Markovian state transitions can be decomposed into $N$ independent scalar sub-problems using the **Gittins Index Theorem** (1974).

#### Solution:
In a general $N$-armed Markov bandit, the joint state space has size $|\mathcal{S}|^N$, suffering severe curse of dimensionality.
John C. Gittins proved that under geometric discounting $\gamma < 1$, the optimal policy computes a scalar index $\nu(s_i)$ for each arm independently:
$$\nu(s_i) = \sup_{\tau > 0} \frac{\mathbb{E} \left[ \sum_{t=0}^{\tau - 1} \gamma^t R_{t+1} \;\middle|\; S_0 = s_i \right]}{\mathbb{E} \left[ \sum_{t=0}^{\tau - 1} \gamma^t \;\middle|\; S_0 = s_i \right]}$$
where $\tau$ is a stopping time.
At each step, the optimal policy simply selects the arm with the highest Gittins index:
$$a^* = \arg\max_{i \in \{1, \dots, N\}} \nu(s_i)$$
This reduces an intractable $N$-dimensional joint optimization problem $O(|\mathcal{S}|^N)$ to $N$ separate 1-dimensional optimal stopping problems $O(N |\mathcal{S}|)$.

---

### Problem 12.10 (Grand Gauntlet): In-Place Value Iteration Convergence Proof
Prove that Gauss-Seidel in-place Value Iteration is a contraction mapping with contraction factor at least as fast as synchronous Value Iteration.

#### Solution:
Let states be ordered $1, 2, \dots, N$.
During an in-place sweep, the update for state $i$ is:
$$\tilde{v}(i) = \max_a \left[ r(i, a) + \gamma \sum_{j < i} \mathcal{P}_{i, j}^a \tilde{v}(j) + \gamma \sum_{j \ge i} \mathcal{P}_{i, j}^a v(j) \right]$$
Let $\mathbf{e}_k = \mathbf{v}_k - \mathbf{v}^*$ be the error vector.
For state 1:
$$|e_{k+1}(1)| \le \gamma \sum_j \mathcal{P}_{1, j} |e_k(j)| \le \gamma \|\mathbf{e}_k\|_\infty$$
For state $i$:
$$|e_{k+1}(i)| \le \gamma \sum_{j < i} \mathcal{P}_{i, j} |e_{k+1}(j)| + \gamma \sum_{j \ge i} \mathcal{P}_{i, j} |e_k(j)|$$
By induction, since $|e_{k+1}(j)| \le \gamma \|\mathbf{e}_k\|_\infty$ for all predecessors $j < i$:
$$|e_{k+1}(i)| \le \gamma \left[ \gamma \sum_{j < i} \mathcal{P}_{i, j} + \sum_{j \ge i} \mathcal{P}_{i, j} \right] \|\mathbf{e}_k\|_\infty \le \gamma \|\mathbf{e}_k\|_\infty$$
Furthermore, if $\sum_{j < i} \mathcal{P}_{i, j} > 0$, the effective multiplier is strictly smaller than $\gamma$.
Thus, Gauss-Seidel in-place updates contract at least as fast as synchronous updates:
$$\|\mathbf{e}_{k+1}\|_\infty \le \gamma \|\mathbf{e}_k\|_\infty \quad \blacksquare$$

---

## 12.4 Capstone Mastery: Theoretical Proofs & State Computations

### Problem 12.11 (Capstone): Analytical Proof of Bellman Residual Minimization
Prove that the solution to $\min_{\mathbf{v}} \|T^* \mathbf{v} - \mathbf{v}\|_\infty$ is uniquely $\mathbf{v}^*$.

#### Solution:
By the contraction property of $T^*$:
$$\|T^* \mathbf{v} - \mathbf{v}\|_\infty \ge \|\mathbf{v} - \mathbf{v}^*\|_\infty - \|T^* \mathbf{v} - T^* \mathbf{v}^*\|_\infty \ge \|\mathbf{v} - \mathbf{v}^*\|_\infty - \gamma \|\mathbf{v} - \mathbf{v}^*\|_\infty = (1 - \gamma) \|\mathbf{v} - \mathbf{v}^*\|_\infty$$
The norm $\|T^* \mathbf{v} - \mathbf{v}\|_\infty$ is bounded below by $(1 - \gamma) \|\mathbf{v} - \mathbf{v}^*\|_\infty \ge 0$.
The minimum possible value of a norm is 0, which occurs if and only if $T^* \mathbf{v} = \mathbf{v}$.
By the Banach theorem, $\mathbf{v}^*$ is the unique fixed point. Thus, the minimum is uniquely attained at $\mathbf{v} = \mathbf{v}^*$.

---

### Problem 12.12 (Capstone): Derivation of Discounted State Occupancy Resolvent
Prove that the expected discounted number of times state $s'$ is visited starting from state $s$ under policy $\pi$ equals the $(s, s')$ entry of $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$.

#### Solution:
Let $\mathbb{I}(S_t = s')$ be the indicator random variable.
Total discounted visits:
$$N(s') = \sum_{t=0}^\infty \gamma^t \mathbb{I}(S_t = s')$$
Conditioned on $S_0 = s$:
$$\mathbb{E}_\pi [N(s') \mid S_0 = s] = \sum_{t=0}^\infty \gamma^t \mathbb{E}_\pi [\mathbb{I}(S_t = s') \mid S_0 = s] = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s' \mid S_0 = s)$$
In matrix notation, $\mathbb{P}(S_t = s' \mid S_0 = s) = (\mathbf{P}_\pi^t)_{s, s'}$.
Therefore:
$$\mathbb{E}_\pi [N(s') \mid S_0 = s] = \sum_{t=0}^\infty \gamma^t (\mathbf{P}_\pi^t)_{s, s'} = \left( \sum_{t=0}^\infty (\gamma \mathbf{P}_\pi)^t \right)_{s, s'} = [(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}]_{s, s'} \quad \blacksquare$$

---

### Problem 12.13 (Capstone): Convergence Rate of TD(0) Under On-Policy Sampling
State the conditions under which TD(0) converges to $v_\pi$ with probability 1.

#### Solution:
By the Tsitsiklis & Van Roy theorem (1997), tabular TD(0) converges almost surely to $v_\pi$ if:
1. The MDP is finite and policy $\pi$ induces an ergodic Markov chain.
2. The step-size schedule satisfies Robbins-Monro: $\sum \alpha_t = \infty, \sum \alpha_t^2 < \infty$.
3. $\gamma \in [0, 1)$.

---

### Problem 12.14 (Capstone): Invariance of Q-Values Under Constant Potential Shaping
Andrew Ng et al. (1999) proved that reward shaping $R'_{t+1} = R_{t+1} + \gamma \Phi(S_{t+1}) - \Phi(S_t)$ preserves optimal policies for any potential function $\Phi: \mathcal{S} \to \mathbb{R}$.
Prove that the shaped action-value function satisfies $Q^*(s, a) = Q_{\text{orig}}^*(s, a) - \Phi(s)$.

#### Solution:
The return under shaped reward is:
$$G'_t = \sum_{k=0}^\infty \gamma^k R'_{t+k+1} = \sum_{k=0}^\infty \gamma^k [R_{t+k+1} + \gamma \Phi(S_{t+k+1}) - \Phi(S_{t+k})]$$
Expanding the telescoping series:
$$= \sum_{k=0}^\infty \gamma^k R_{t+k+1} + \sum_{k=0}^\infty \gamma^{k+1} \Phi(S_{t+k+1}) - \sum_{k=0}^\infty \gamma^k \Phi(S_{t+k})$$
All intermediate potential terms cancel out telescopically:
$$= G_t - \Phi(S_t)$$
Taking expectations conditioned on $S_t = s, A_t = a$:
$$Q^*(s, a) = \mathbb{E}[G'_t \mid s, a] = \mathbb{E}[G_t \mid s, a] - \Phi(s) = Q_{\text{orig}}^*(s, a) - \Phi(s)$$
Because $\Phi(s)$ is identical for all actions in state $s$:
$$\arg\max_a Q^*(s, a) = \arg\max_a [Q_{\text{orig}}^*(s, a) - \Phi(s)] = \arg\max_a Q_{\text{orig}}^*(s, a)$$
The optimal policy is strictly preserved.

---

### Problem 12.15 (Capstone): Q-Learning Maximization Bias Analysis
Explain why tabular Q-Learning exhibits positive maximization bias:
$$\mathbb{E}[\max_a Q(s, a)] \ge \max_a \mathbb{E}[Q(s, a)]$$

#### Solution:
Let $X_1, X_2, \dots, X_m$ be independent zero-mean random variables representing noisy Q-value estimates.
Even though $\mathbb{E}[X_i] = 0$ for all $i$ (unbiased individual estimates):
$$\mathbb{E}[\max(X_1, \dots, X_m)] > 0 \quad (\text{for } m > 1)$$
The maximum operator selects the largest positive estimation error, systematically overestimating state values. This motivated Hasselt (2010) to invent **Double Q-Learning**.

---

### Problem 12.16 (Capstone): Policy Iteration as Newton-Raphson Method
Show that Policy Iteration is mathematically equivalent to applying the Newton-Raphson method to the operator equation $T^* \mathbf{v} - \mathbf{v} = \mathbf{0}$.

#### Solution:
Let $F(\mathbf{v}) \doteq T^* \mathbf{v} - \mathbf{v}$.
At iterate $\mathbf{v}_k$, let $\pi_k$ be the greedy policy with respect to $\mathbf{v}_k$, so $T^* \mathbf{v}_k = T^{\pi_k} \mathbf{v}_k = \mathbf{r}_{\pi_k} + \gamma \mathbf{P}_{\pi_k} \mathbf{v}_k$.
The directional derivative (Jacobian) of $F$ at $\mathbf{v}_k$ is:
$$\mathbf{J}_F = \gamma \mathbf{P}_{\pi_k} - \mathbf{I} = -(\mathbf{I} - \gamma \mathbf{P}_{\pi_k})$$
The Newton-Raphson update step is:
$$\mathbf{v}_{k+1} = \mathbf{v}_k - \mathbf{J}_F^{-1} F(\mathbf{v}_k) = \mathbf{v}_k - [-(\mathbf{I} - \gamma \mathbf{P}_{\pi_k})]^{-1} [\mathbf{r}_{\pi_k} + \gamma \mathbf{P}_{\pi_k} \mathbf{v}_k - \mathbf{v}_k]$$
$$= \mathbf{v}_k + (\mathbf{I} - \gamma \mathbf{P}_{\pi_k})^{-1} [\mathbf{r}_{\pi_k} - (\mathbf{I} - \gamma \mathbf{P}_{\pi_k}) \mathbf{v}_k] = (\mathbf{I} - \gamma \mathbf{P}_{\pi_k})^{-1} \mathbf{r}_{\pi_k}$$
This is exactly the Policy Evaluation step $v_{\pi_k}$!
Thus, Policy Iteration is identical to Newton-Raphson root-finding on the Bellman residual, explaining its rapid quadratic convergence rate.

---

### Problem 12.17 (Capstone): Ergodic MDP Stationary Reward Formulation
Prove that in an ergodic continuing MDP, the average reward $r(\pi) = \lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^T R_t$ is independent of the initial state $S_0$.

#### Solution:
In an ergodic Markov chain, the transition matrix $\mathbf{P}_\pi$ has a unique stationary distribution $\mathbf{d}_\pi$ such that $\lim_{t \to \infty} \mathcal{P}_{s, s'}^{(t)} = d^\pi(s')$ for all initial states $s$.
By the Cesàro-mean ergodic theorem:
$$\lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^T \mathbb{E}[R_t \mid S_0 = s] = \sum_{s' \in \mathcal{S}} d^\pi(s') r_\pi(s') = r(\pi)$$
Because the limit is the inner product $\mathbf{d}_\pi \mathbf{r}_\pi$, all dependence on the initial state $s$ vanishes.

---

### Problem 12.18 (Capstone): Exact Q-Learning Bellman Fixed Point Equivalence
Prove that if tabular Q-Learning converges ($\Delta Q \to 0$), the converged table $Q_\infty$ satisfies the Bellman Optimality Equation.

#### Solution:
The expected Q-learning update at convergence satisfies:
$$\mathbb{E}[R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a') - Q(S_t, A_t)] = 0$$
$$\sum_{s'} \mathcal{P}_{s, s'}^a \left[ r(s, a, s') + \gamma \max_{a'} Q(s', a') \right] - Q(s, a) = 0$$
$$Q(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a \max_{a'} Q(s', a')$$
This is identical to the Bellman Optimality Equation for $q^*(s, a)$. By the uniqueness of the contraction fixed point, $Q_\infty = q^*$.

---

### Problem 12.19 (Capstone): Entropy-Regularized Soft Bellman Contraction Proof
Prove that the Soft-Max Bellman operator $(T_{\text{soft}} v)(s) = \max_a [r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')] + \tau \mathcal{H}(\pi)$ is a $\gamma$-contraction mapping.

#### Solution:
Let $f(v) = \tau \ln \sum_a e^{q_v(s, a)/\tau}$.
By the mean value theorem, the Jacobian of $f$ with respect to $q$ is the Softmax distribution $\boldsymbol{\pi}_{\text{soft}}$.
Because $\sum_a \pi_{\text{soft}}(a) = 1$ and $\pi_{\text{soft}}(a) \ge 0$:
$$|f(u) - f(v)| \le \max_a |q_u(s, a) - q_v(s, a)| \le \gamma \|u - v\|_\infty$$
Thus, soft Bellman operators preserve the exact $\gamma$-contraction property under $\|\cdot\|_\infty$.

---

### Problem 12.20 (Capstone): The Complete Grand Synthesis
Synthesize the entire trajectory of this treatise: show how Andrei Markov's 1906 letter chain leads inexorably to Bellman's 1957 dynamic programming, Watkins' 1989 Q-learning, and 2026 autonomous agent architectures.

#### Solution:
1. **Markov (1906):** Established that a stochastic process can maintain causal consistency through state memorylessness without infinite historical tracking.
2. **Bellman (1957):** Leveraged the Markov property to collapse infinite-horizon planning into a 2-period recursive contractive operator $T^*$, overcoming combinatorial path explosions.
3. **Howard (1960):** Proved the Policy Improvement Theorem, establishing that greedy action selection monotonically improves value functions in finite steps.
4. **Sutton & Barto (1980s):** Combined animal trial-and-error with dynamic programming, inventing Temporal Difference learning to eliminate the requirement of an environmental model.
5. **Watkins (1989):** Proved that off-policy TD learning converges directly to Bellman optimality without human supervision.
6. **Modern Autonomous Agents (2020s–2026):** Replaces tabular matrices with deep neural network representations, allowing simulated and robotic agents to solve high-dimensional perception, control, and multi-agent coordination problems.
