# Chapter 10: Dynamic Programming III: Value Iteration, Asynchronous DP, and Curse of Dimensionality

---

## 10.1 Truncating the Evaluation Loop: The Value Iteration Breakthrough

In Chapter 9, we examined Policy Iteration, which requires running iterative policy evaluation to convergence in each outer loop. However, each evaluation phase may require hundreds of sweeps across the entire state space, only to make a subtle adjustment to the policy.

Can we truncate policy evaluation early? What happens if we stop policy evaluation after **exactly one single sweep**?

```
                      POLICY ITERATION vs. VALUE ITERATION
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
 ┌───────────────────────────┐                         ┌───────────────────────────┐
 │     POLICY ITERATION      │                         │      VALUE ITERATION      │
 ├───────────────────────────┤                         ├───────────────────────────┤
 │ • Outer Loop: Policy π    │                         │ • Single Unified Loop     │
 │ • Inner Loop: 100+ sweeps │                         │ • Combines 1 sweep of     │
 │   until ||v_{k+1}-v_k|| < θ│                         │   evaluation with max     │
 │ • Explicit policy array   │                         │ • No explicit policy      │
 │ • Huge evaluation cost    │                         │   stored during sweeps!   │
 └───────────────────────────┘                         └───────────────────────────┘
```

When policy evaluation is truncated to a single step, the evaluation and improvement steps collapse into a single unified update equation known as **Value Iteration** (Bellman 1957):

$$v_{k+1}(s) = \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_k(s') \right]$$

In Value Iteration, we do not store an explicit policy table during the sweeps. We update the state-value estimates directly toward the Bellman optimality condition until the values stabilize, extracting the optimal policy $\pi^*$ only at the very end.

---

## 10.2 The Bellman Optimality Operator $T^*$

To analyze Value Iteration with mathematical rigor, we define the **Bellman Optimality Operator** $T^*: \mathbb{R}^{|\mathcal{S}|} \to \mathbb{R}^{|\mathcal{S}|}$:

$$(T^* \mathbf{v})(s) \doteq \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v(s') \right]$$

In terms of the operator $T^*$, Value Iteration is simply the repeated application of $T^*$ to an initial value vector $\mathbf{v}_0$:

$$\mathbf{v}_{k+1} = T^* \mathbf{v}_k = (T^*)^k \mathbf{v}_0$$

The Bellman Optimality Equation from Chapter 7 can now be stated as a fixed-point equation:
$$T^* \mathbf{v}^* = \mathbf{v}^*$$

Does the sequence $\mathbf{v}_{k+1} = T^* \mathbf{v}_k$ converge to $\mathbf{v}^*$? To answer this, we must prove that $T^*$ is a contraction mapping.

---

## 10.3 Rigorous Proof that $T^*$ is a $\gamma$-Contraction

Because $T^*$ includes the non-linear $\max$ operator, we cannot rely on linear cancellation as we did for $T^\pi$ in Chapter 8. We require an essential algebraic lemma.

### The Maximum Inequality Lemma:
For any two real-valued functions $f, g: \mathcal{X} \to \mathbb{R}$:
$$\left| \max_{x \in \mathcal{X}} f(x) - \max_{x \in \mathcal{X}} g(x) \right| \le \max_{x \in \mathcal{X}} |f(x) - g(x)|$$

**Proof of Lemma:**
Let $x_f \in \arg\max_x f(x)$ and $x_g \in \arg\max_x g(x)$.
Then:
$$\max_x f(x) - \max_x g(x) = f(x_f) - g(x_g) \le f(x_f) - g(x_f) \le |f(x_f) - g(x_f)| \le \max_x |f(x) - g(x)|$$
By exact symmetry, reversing the roles of $f$ and $g$:
$$\max_x g(x) - \max_x f(x) \le \max_x |f(x) - g(x)|$$
Combining both inequalities:
$$\left| \max_x f(x) - \max_x g(x) \right| \le \max_x |f(x) - g(x)| \quad \blacksquare$$

---

### Proof that $T^*$ is a $\gamma$-Contraction under $\|\cdot\|_\infty$:
Let $\mathbf{u}, \mathbf{v} \in \mathbb{R}^{|\mathcal{S}|}$ be any two arbitrary value vectors.
For any state $s \in \mathcal{S}$:
$$\left| (T^* \mathbf{u})(s) - (T^* \mathbf{v})(s) \right| = \left| \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \right] - \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right] \right|$$

Applying the Maximum Inequality Lemma:
$$\le \max_{a \in \mathcal{A}(s)} \left| \left( r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \right) - \left( r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right) \right|$$

The immediate rewards $r(s, a)$ cancel out:
$$= \max_{a \in \mathcal{A}(s)} \left| \gamma \sum_{s'} \mathcal{P}_{s, s'}^a [u(s') - v(s')] \right|$$

Apply the triangle inequality:
$$\le \max_{a \in \mathcal{A}(s)} \gamma \sum_{s'} \mathcal{P}_{s, s'}^a |u(s') - v(s')|$$

Since $|u(s') - v(s')| \le \|\mathbf{u} - \mathbf{v}\|_\infty$ for all $s'$:
$$\le \max_{a \in \mathcal{A}(s)} \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \sum_{s'} \mathcal{P}_{s, s'}^a$$

Because $\sum_{s'} \mathcal{P}_{s, s'}^a = 1.0$ for every valid action:
$$\le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty$$

Because this inequality holds for every state $s \in \mathcal{S}$, taking the maximum over all states yields:
$$\|T^* \mathbf{u} - T^* \mathbf{v}\|_\infty \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \quad \blacksquare$$

### Theoretical Consequences:
By the Banach Fixed-Point Theorem:
1. The optimal value function $\mathbf{v}^*$ is the **unique** fixed point of $T^*$.
2. Value Iteration converges to $\mathbf{v}^*$ from **any arbitrary initial vector $\mathbf{v}_0$**.
3. Convergence is geometric with rate $\gamma$.

---

## 10.4 The Value Iteration Algorithm and Stopping Criteria

```
                            VALUE ITERATION ALGORITHM
                                        │
                                  Initialize v_0
                                  (e.g., all 0s)
                                        │
                                        ▼
                             ┌────────────────────┐
                        ┌───►│  Sweep All States  │
                        │    │  v_{k+1} = T* v_k  │
                        │    └─────────┬──────────┘
                        │              │
                        │              ▼
                        │    Calculate Max Shift:
                        │    Δ = max_s |v_{k+1}(s) - v_k(s)|
                        │              │
                        │              ▼
                        │     Is Δ < θ (1-γ)/(2γ)?
                        │         /         \
                        └── NO ──┘           └── YES ──► EXTRACT OPTIMAL POLICY:
                                                         π*(s) = argmax_a q(s, a)
```

### The $\epsilon$-Optimality Stopping Rule:
To guarantee that the extracted policy $\pi^*$ is within $\epsilon$ of the true optimal value ($\|v_{\pi^*} - v^*\|_\infty \le \epsilon$), the iteration must stop when:

$$\Delta \doteq \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \theta \doteq \frac{\epsilon (1 - \gamma)}{2\gamma}$$

---

## 10.5 Asynchronous Dynamic Programming

Standard Value Iteration sweeps through every single state in the state space on every pass. When $|\mathcal{S}|$ is in the millions, a single full sweep can take hours. 

**Asynchronous Dynamic Programming** algorithms break the lockstep global sweep paradigm: they update states individually in an arbitrary order, using whatever values are currently available for other states.

```
                           ASYNCHRONOUS DP ARCHITECTURES
                                         │
            ┌────────────────────────────┼────────────────────────────┐
            ▼                            ▼                            ▼
 ┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
 │ IN-PLACE ASYNC DP   │      │ PRIORITIZED SWEEPING│      │ REAL-TIME DP (RTDP) │
 ├─────────────────────┤      ├─────────────────────┤      ├─────────────────────┤
 │ Updates states in   │      │ Maintains priority  │      │ Updates ONLY states │
 │ any order; saves    │      │ queue of Bellman    │      │ visited along simulated│
 │ 50% memory and      │      │ errors:             │      │ trajectory rollouts.│
 │ accelerates flow.   │      │ P = |v(s) - max q|  │      │ Focuses on relevant.│
 └─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

### 1. In-Place Value Iteration
Updates a single array $V(s)$ directly:
$$V(s) \leftarrow \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a V(s') \right]$$
No second buffer is maintained. Information updates propagate through the network immediately within the same sweep.

### 2. Prioritized Sweeping (Moore & Atkeson 1993, Peng & Leckie 1993)
In many environments, $90\%$ of states experience zero change in value during early sweeps. Prioritized Sweeping orders updates based on the magnitude of the Bellman error:
1. Compute the Bellman error for state $s$:
   $$P \doteq \left| v(s) - \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right] \right|$$
2. Insert state $s$ into a Priority Queue with priority $P$.
3. While the queue is not empty:
   - Pop the state $s$ with the largest priority $P$.
   - Update $v(s) \leftarrow \max_a [r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')]$.
   - For all predecessor states $\bar{s}$ that can transition to $s$:
     - Compute the potential change in $\bar{s}$: $P_{\bar{s}} = \gamma \mathcal{P}_{\bar{s}, s}^a |v_{\text{new}}(s) - v_{\text{old}}(s)|$.
     - If $P_{\bar{s}} > \theta$, insert or promote $\bar{s}$ in the queue.

### 3. Real-Time Dynamic Programming (RTDP, Barto, Bradtke & Singh 1995)
RTDP updates only the states that are actually encountered by an agent executing simulated trial episodes from an initial state distribution. 
- If large portions of the state space are irrelevant to achieving the goal (e.g. unreachable regions), RTDP skips them completely.
- Guarantees convergence to optimal value on all relevant states without ever sweeping the entire state space!

---

## 10.6 The Curse of Dimensionality

Why can't we solve every reinforcement learning problem using tabular Dynamic Programming? The fundamental computational obstacle was identified by Richard Bellman himself: **The Curse of Dimensionality**.

```
                           THE CURSE OF DIMENSIONALITY
   Dimensions (d)            Grid Resolution (k)            Total States (|S| = k^d)
         1                           100                                  100
         2                           100                               10,000
         3                           100                            1,000,000 (1 Million)
         4                           100                          100,000,000 (100 Million)
         6                           100                   1,000,000,000,000 (1 Trillion)
        10                           100                               10^20 (Intractable!)
```

### Exponential State Space Explosion
If a physical system is described by $d$ continuous state variables (e.g., position, velocity, orientation, angular velocity of joints in a robotic arm), and each variable is discretized into $k$ discrete bins:
$$|\mathcal{S}| = k^d$$
The state space grows **exponentially** with the number of state dimensions $d$.
- For a 7-degree-of-freedom robotic manipulator: $d = 14$ (7 joint angles + 7 joint velocities).
- Even with a coarse discretization of $k = 10$ bins per dimension:
  $$|\mathcal{S}| = 10^{14} = 100,000,000,000,000 \text{ states}$$
- Storing a single value per state as a 64-bit float would require:
  $$\text{Memory} = 10^{14} \times 8 \text{ bytes} = 800 \text{ Terabytes!}$$
- Performing a single sweep of Value Iteration across $10^{14}$ states would require months.

### The Motivation for Deep Reinforcement Learning
Tabular Dynamic Programming is the bedrock of theoretical RL, but it is bounded by the Curse of Dimensionality. To conquer real-world problems with high-dimensional states (such as raw camera pixel images in Atari games or continuous coordinates in robotics), we must replace discrete lookup tables with **Parametric Function Approximators**:
$$V(s) \approx V_\theta(s), \quad Q(s, a) \approx Q_\theta(s, a)$$
where $\theta$ represents the weights of a Deep Neural Network. This bridge from tabular dynamic programming to deep neural value approximation is the subject of Module #4.

---

## 10.7 Worked Examples: Value Iteration & Asynchronous Solvers

### Example 10.1: Hand Calculation of Two Value Iteration Sweeps
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2\}$ with $\gamma = 0.50$.
- In state $s_1$:
  - $a_1$: transitions to $s_1$ with prob 1.0, $R = 2.0$.
  - $a_2$: transitions to $s_2$ with prob 1.0, $R = 0.0$.
- In state $s_2$:
  - $a_1$: transitions to $s_2$ with prob 1.0, $R = 1.0$.
  - $a_2$: transitions to $s_1$ with prob 1.0, $R = 3.0$.
Initialize $v_0 = [0.0, 0.0]^T$.
Perform 2 synchronous Value Iteration sweeps by hand.

#### Solution:
Update equations:
$$v_{k+1}(s_1) = \max \begin{cases} q(s_1, a_1) = 2.0 + 0.50 v_k(s_1) \\ q(s_1, a_2) = 0.0 + 0.50 v_k(s_2) \end{cases}$$
$$v_{k+1}(s_2) = \max \begin{cases} q(s_2, a_1) = 1.0 + 0.50 v_k(s_2) \\ q(s_2, a_2) = 3.0 + 0.50 v_k(s_1) \end{cases}$$

**Sweep $k = 1$ (from $v_0 = [0, 0]$):**
- $s_1$: $\max(2.0 + 0, 0.0 + 0) = \max(2.0, 0.0) = 2.0$
- $s_2$: $\max(1.0 + 0, 3.0 + 0) = \max(1.0, 3.0) = 3.0$
Result: $\mathbf{v}_1 = [2.0, 3.0]^T$.

**Sweep $k = 2$ (from $v_1 = [2.0, 3.0]$):**
- $s_1$:
  - $q(s_1, a_1) = 2.0 + 0.50(2.0) = 3.0$
  - $q(s_1, a_2) = 0.0 + 0.50(3.0) = 1.5$
  $v_2(s_1) = \max(3.0, 1.5) = 3.0$
- $s_2$:
  - $q(s_2, a_1) = 1.0 + 0.50(3.0) = 2.5$
  - $q(s_2, a_2) = 3.0 + 0.50(2.0) = 4.0$
  $v_2(s_2) = \max(2.5, 4.0) = 4.0$
Result: $\mathbf{v}_2 = [3.0, 4.0]^T$.

---

### Example 10.2: Extracting Greedy Policy from Value Iteration Iterates
Using the iterate $\mathbf{v}_2 = [3.0, 4.0]^T$ from Example 10.1:
Extract the greedy policy $\pi_2(s_1)$ and $\pi_2(s_2)$.

#### Solution:
- In state $s_1$:
  - $q(s_1, a_1) = 2.0 + 0.50(3.0) = 3.5$
  - $q(s_1, a_2) = 0.0 + 0.50(4.0) = 2.0$
  $\arg\max_a q(s_1, a) = a_1 \implies \pi_2(s_1) = a_1$.
- In state $s_2$:
  - $q(s_2, a_1) = 1.0 + 0.50(4.0) = 3.0$
  - $q(s_2, a_2) = 3.0 + 0.50(3.0) = 4.5$
  $\arg\max_a q(s_2, a) = a_2 \implies \pi_2(s_2) = a_2$.
The extracted policy is $\pi_2 = [a_1, a_2]^T$, which matches the true optimal policy $\pi^*$.
Notice that Value Iteration identified the optimal policy by iteration 2, even before values fully converged to $v^* = [4.0, 5.0]^T$.

---

### Example 10.3: Numerical Convergence Verification of Value Iteration
Solve for the exact fixed point of Example 10.1 under optimal policy $\pi^* = [a_1, a_2]^T$:
- $v^*(s_1) = 2.0 + 0.5 v^*(s_1) \implies 0.5 v^*(s_1) = 2.0 \implies v^*(s_1) = 4.0$.
- $v^*(s_2) = 3.0 + 0.5 v^*(s_1) = 3.0 + 0.5(4.0) = 5.0$.
Verify that the error $\|\mathbf{v}_k - \mathbf{v}^*\|_\infty$ shrinks by exactly $\gamma = 0.50$ per iteration.

#### Solution:
- Iteration 0: $\mathbf{v}_0 = [0, 0] \implies \text{Error} = \max(|0 - 4|, |0 - 5|) = 5.0$.
- Iteration 1: $\mathbf{v}_1 = [2, 3] \implies \text{Error} = \max(|2 - 4|, |3 - 5|) = 2.0$.
- Iteration 2: $\mathbf{v}_2 = [3, 4] \implies \text{Error} = \max(|3 - 4|, |4 - 5|) = 1.0$.
- Iteration 3: $\mathbf{v}_3 = [3.5, 4.5] \implies \text{Error} = \max(|3.5 - 4|, |4.5 - 5|) = 0.5$.
Notice: $\frac{\text{Error}_{k+1}}{\text{Error}_k} = \frac{0.5}{1.0} = \frac{1.0}{2.0} = 0.50 = \gamma$.
The error contracts at the exact theoretical geometric rate $\gamma^k$.

---

### Example 10.4: Prioritized Sweeping Queue Trace
Consider a 3-state chain: $s_1 \to s_2 \to s_3$, where $s_3$ is a goal state ($R = +100$, absorbing).
All other transitions have $R = 0, \gamma = 0.90$.
Initialize $v(s_1) = v(s_2) = v(s_3) = 0$.
Trace how Prioritized Sweeping processes states.

#### Solution:
1. Initial Bellman errors:
   - State $s_2$: transitions to $s_3$ with $R = +100$. Bellman error $P(s_2) = |0 - (100 + 0.9 \times 0)| = 100.0$.
   - State $s_1$: transitions to $s_2$ with $R = 0$. Bellman error $P(s_1) = |0 - (0 + 0.9 \times 0)| = 0.0$.
   Priority Queue contains: $[(s_2, 100.0)]$.
2. Pop highest priority: state $s_2$.
   - Update $v(s_2) \leftarrow 100.0$.
   - Predecessor is $s_1$: compute priority update $P(s_1) = 0.90 \times |100.0 - 0.0| = 90.0$.
   - Insert $(s_1, 90.0)$ into queue.
3. Pop highest priority: state $s_1$.
   - Update $v(s_1) \leftarrow 0 + 0.90(100.0) = 90.0$.
   - Queue is now empty.
Both states converge to their exact optimal values in **just 2 targeted updates**, whereas standard synchronous sweeps would require redundant global passes.

---

### Example 10.5: In-Place vs Synchronous Value Iteration Comparison
On a 4-state linear maze $s_1 \to s_2 \to s_3 \to s_4$, where $s_4$ is terminal ($+10$), compare the number of sweeps required for reward information to reach start state $s_1$ under:
1. Synchronous Value Iteration.
2. In-place Value Iteration sweeping backwards ($s_3, s_2, s_1$).

#### Solution:
1. **Synchronous Sweeps:**
   - Sweep 1: $v(s_3)$ updates to $+10$; $v(s_2)$ and $v(s_1)$ remain 0.
   - Sweep 2: $v(s_2)$ updates to $\gamma(10)$; $v(s_1)$ remains 0.
   - Sweep 3: $v(s_1)$ updates to $\gamma^2(10)$.
   Requires **3 full sweeps** for information to propagate.
2. **In-Place Backward Sweep:**
   - Update $s_3$: $V(s_3) \leftarrow 10.0$.
   - Update $s_2$: immediately reads new $V(s_3) = 10 \implies V(s_2) \leftarrow \gamma(10)$.
   - Update $s_1$: immediately reads new $V(s_2) = \gamma(10) \implies V(s_1) \leftarrow \gamma^2(10)$.
   Requires **1 single sweep**! Information propagates the entire length of the chain in one pass.

---

### Example 10.6: Curse of Dimensionality in Self-Driving Perception
A self-driving car represents its environment using:
- Vehicle position: $(x, y)$ (discretized into $100 \times 100 = 10^4$ cells).
- Vehicle heading: $\theta$ (36 angles).
- Vehicle speed: $v$ (10 bins).
- Leading car distance: $d_{\text{lead}}$ (20 bins).
- Leading car relative velocity: $\Delta v$ (10 bins).

1. Calculate the total number of discrete states $|\mathcal{S}|$.
2. If the vehicle has 5 steering angles and 3 acceleration settings ($|\mathcal{A}| = 15$ actions), calculate the number of Q-values to store.

#### Solution:
**Step 1: State Space Size:**
$$|\mathcal{S}| = 10^4 \times 36 \times 10 \times 20 \times 10 = 10,000 \times 36 \times 2,000 = 7.2 \times 10^8 \text{ states} = 720,000,000 \text{ states}$$

**Step 2: Total Q-Values:**
$$|\mathcal{S}| \times |\mathcal{A}| = 7.2 \times 10^8 \times 15 = 1.08 \times 10^{10} \text{ state-action pairs}$$
At 8 bytes per float64, storing this Q-table requires:
$$\text{Memory} = 1.08 \times 10^{10} \times 8 \text{ bytes} \approx 86.4 \text{ Gigabytes!}$$
Even a modest state representation overwhelms standard workstation RAM, proving why deep neural function approximation is essential for autonomous vehicles.

---

### Example 10.7: Real-Time Dynamic Programming (RTDP) Efficiency
In a maze of $1,000,000$ states, only $500$ states lie along viable paths between the entrance and the exit; the remaining $999,500$ states are in dead-end caverns or sealed walls.
Explain why RTDP outperforms synchronous Value Iteration by a factor of 2,000 on this problem.

#### Solution:
Synchronous Value Iteration must evaluate all $1,000,000$ states at every sweep, expending $99.95\%$ of its computational energy calculating values for unreachable regions.
RTDP initiates simulated trajectories from the entrance and updates values strictly along the realized paths. It visits and updates only the $500$ relevant states, skipping the other $999,500$ states entirely. The ratio of updates is:
$$\frac{1,000,000}{500} = 2,000\times \text{ speedup}$$

---

### Example 10.8: Stopping Threshold Calculation for Target Accuracy
An engineer requires the extracted policy to be $\epsilon$-optimal with $\epsilon = 0.05$ under discount factor $\gamma = 0.90$.
Compute the numerical threshold $\theta$ for the stopping test $\|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \theta$.

#### Solution:
Using the $\epsilon$-optimality formula:
$$\theta = \frac{\epsilon (1 - \gamma)}{2\gamma}$$
Substitute values:
$$\theta = \frac{0.05 \times (1 - 0.90)}{2 \times 0.90} = \frac{0.05 \times 0.10}{1.80} = \frac{0.005}{1.80} \approx 0.002778$$
The iteration can safely stop when the maximum change in any state value between sweeps drops below $0.00278$.

---

### Example 10.9: Non-Contractive Value Iteration Divergence
Show that if an engineer mistakenly sets $\gamma = 1.0$ in an infinite-horizon continuing task where every state has reward $R = +1.0$, Value Iteration iterates diverge linearly: $v_k(s) = k \to \infty$.

#### Solution:
Update equation with $\gamma = 1.0$:
$$v_{k+1}(s) = \max_a [1.0 + 1.0 \times v_k(s')] = 1.0 + v_k(s)$$
Starting from $v_0 = 0$:
- $v_1 = 1.0$
- $v_2 = 2.0$
- $v_k = k$
The values grow unboundedly as $k \to \infty$. The difference between sweeps is $\Delta = |(k+1) - k| = 1.0$, which never drops below any threshold $\theta < 1.0$. The algorithm runs forever without terminating.

---

### Example 10.10: Value Iteration Complexity per Sweep
In a discrete MDP with $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions, where each state-action transition has at most $B$ non-zero successor states (sparse branching factor $B \ll |\mathcal{S}|$), calculate the computational complexity of a single sweep of Value Iteration.

#### Solution:
For each of the $|\mathcal{S}|$ states:
- Evaluate $|\mathcal{A}|$ candidate actions.
- For each action, compute the expected successor value $\sum_{s'} \mathcal{P}_{s, s'}^a v(s')$.
Because the branching factor is sparse ($B$ successors), this inner sum takes $O(B)$ operations.
Total complexity per sweep:
$$\mathcal{O}(|\mathcal{S}| \times |\mathcal{A}| \times B)$$
If transitions are dense ($B = |\mathcal{S}|$), the complexity is $\mathcal{O}(|\mathcal{S}|^2 |\mathcal{A}|)$, which is significantly faster than the $O(|\mathcal{S}|^3)$ cost of matrix inversion.

---

## 10.8 Solved Exercises

### Exercise 10.1: Value Iteration Single-Step Calculation
State $s$ has 2 actions:
- $a_1$: $r = 5$, leads to $s_1$ with prob 1.0. Current $v(s_1) = 20$.
- $a_2$: $r = 10$, leads to $s_2$ with prob 1.0. Current $v(s_2) = 12$.
If $\gamma = 0.8$, compute the updated value $v_{k+1}(s)$.

#### Solution:
- $q(s, a_1) = 5 + 0.8(20) = 5 + 16 = 21.0$
- $q(s, a_2) = 10 + 0.8(12) = 10 + 9.6 = 19.6$
$$v_{k+1}(s) = \max(21.0, 19.6) = 21.0$$

---

### Exercise 10.2: Contraction Factor of 2-Step Operator
What is the contraction factor of the two-step operator $(T^*)^2$?

#### Solution:
By the contraction property:
$$\|(T^*)^2 u - (T^*)^2 v\|_\infty = \|T^*(T^* u) - T^*(T^* v)\|_\infty \le \gamma \|T^* u - T^* v\|_\infty \le \gamma^2 \|u - v\|_\infty$$
The contraction factor is $\gamma^2$.

---

### Exercise 10.3: Value Iteration Memory Footprint
How many floating-point numbers must be stored in memory for Value Iteration on an MDP with 50,000 states and 8 actions using in-place updates?

#### Solution:
In-place Value Iteration stores only the state-value array:
$$50,000 \text{ floats}$$
(It does not need to store the Q-table or policy array).

---

### Exercise 10.4: Action Elimination in Value Iteration
If during an update of state $s$, candidate action $a_1$ achieves $q(s, a_1) = 45.0$, and an upper bound on action $a_2$ satisfies $\bar{q}(s, a_2) = 38.0$, can we skip evaluating $a_2$'s exact transitions?

#### Solution:
Yes. Because $\bar{q}(s, a_2) = 38.0 < 45.0 = q(s, a_1)$, action $a_2$ cannot possibly achieve the maximum. It can be safely pruned.

---

### Exercise 10.5: Asynchronous Sweep Fairness Condition
What mathematical condition must an asynchronous state selection sequence satisfy to guarantee convergence to $v^*$?

#### Solution:
Every state must be visited and updated infinitely often:
$$\forall s \in \mathcal{S}, \quad \lim_{T \to \infty} \sum_{t=1}^T \mathbb{I}(s \text{ is updated at step } t) = \infty$$
No state can be permanently neglected.

---

### Exercise 10.6: Continuous Space Discretization Grid Scaling
If a system has 6 state dimensions and each is discretized into 50 intervals, how many discrete states exist?

#### Solution:
$$|\mathcal{S}| = 50^6 = (5 \times 10)^6 = 15,625 \times 10^6 = 15,625,000,000 \text{ states} \approx 15.6 \text{ Billion states}$$

---

### Exercise 10.7: Value Iteration vs Policy Iteration Choice
When is Policy Iteration preferred over Value Iteration, and vice versa?

#### Solution:
- **Policy Iteration** is preferred when $|\mathcal{S}|$ is small or medium, the action space $|\mathcal{A}|$ is large, and policy stability occurs long before value convergence.
- **Value Iteration** is preferred when $|\mathcal{S}|$ is large, matrix inversion is impossible, and fast single-sweep approximations are computationally required.

---

### Exercise 10.8: Fixed Point of Bellman Optimality Operator
If $T^* \mathbf{v} = \mathbf{v}$, does that guarantee that the greedy policy extracted from $\mathbf{v}$ is globally optimal?

#### Solution:
Yes. By the Banach theorem, $T^*$ has a unique fixed point which is $\mathbf{v}^*$. The greedy policy extracted from $\mathbf{v}^*$ is guaranteed to be an optimal policy $\pi^*$.

---

### Exercise 10.9: Prioritized Sweeping Memory Overhead
What additional data structure does Prioritized Sweeping require compared to standard in-place Value Iteration?

#### Solution:
1. A Priority Queue (heap) to store states and Bellman error priorities.
2. An inverted predecessor index mapping each state $s$ to all predecessor states $\bar{s}$ that can transition to $s$.

---

### Exercise 10.10: Bound on Extracted Policy Sub-Optimality
If $\|v_k - v^*\|_\infty \le \delta$, prove that the policy $\pi$ greedy with respect to $v_k$ satisfies:
$$\|v_\pi - v^*\|_\infty \le \frac{2\gamma \delta}{1 - \gamma}$$

#### Solution:
For any state $s$:
$$v^*(s) - v_\pi(s) \le q^*(s, \pi^*(s)) - q^*(s, \pi(s))$$
Using the triangle inequality against $q_k(s, a)$:
$$q^*(s, \pi^*(s)) - q^*(s, \pi(s)) \le 2\gamma \|v_k - v^*\|_\infty + \gamma \|v^* - v_\pi\|_\infty$$
Rearranging:
$$(1 - \gamma) \|v_\pi - v^*\|_\infty \le 2\gamma \|v_k - v^*\|_\infty = 2\gamma \delta$$
$$\|v_\pi - v^*\|_\infty \le \frac{2\gamma \delta}{1 - \gamma} \quad \blacksquare$$
This formalizes the connection between value iteration accuracy and policy performance.
