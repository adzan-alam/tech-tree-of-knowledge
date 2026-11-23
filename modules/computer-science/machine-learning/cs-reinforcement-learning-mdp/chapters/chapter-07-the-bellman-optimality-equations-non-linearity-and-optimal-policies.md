# Chapter 7: The Bellman Optimality Equations: Non-Linearity, Partial Ordering, and Optimal Policies

---

## 7.1 The Quest for the Optimal Policy: Partial Ordering of Strategies

In Chapter 6, we derived the Bellman Expectation Equations for evaluating a fixed, arbitrary policy $\pi$. However, the ultimate purpose of reinforcement learning is not merely to evaluate an arbitrary strategy, but to **discover the best possible strategy**.

What does it mean for one policy to be "better" than another?

```
                                PARTIAL ORDERING OF POLICIES
                                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              ▼                                                               ▼
 ┌──────────────────────────┐                                    ┌──────────────────────────┐
 │    STRICT DOMINANCE      │                                    │   INCOMPARABLE POLICIES  │
 │     π_1 ≥ π_2            │                                    │    π_A vs π_B            │
 ├──────────────────────────┤                                    ├──────────────────────────┤
 │ v_{π_1}(s) ≥ v_{π_2}(s)  │                                    │ v(s_1) higher for π_A,   │
 │ FOR ALL states s ∈ S.    │                                    │ v(s_2) higher for π_B.   │
 │ Unambiguously superior.  │                                    │ Trade-off depends on     │
 │                          │                                    │ initial distribution.    │
 └──────────────────────────┘                                    └──────────────────────────┘
```

### The Partial Order Definition
In decision theory and functional analysis, policies are compared via a **partial order** $\ge$ defined over their value functions:

$$\pi \ge \pi' \iff v_\pi(s) \ge v_{\pi'}(s), \quad \forall s \in \mathcal{S}$$

A policy $\pi$ is superior to policy $\pi'$ if and only if its expected return is greater than or equal to that of $\pi'$ **simultaneously in every single state of the universe**. 

If policy $\pi_A$ achieves higher return than $\pi_B$ in state $s_1$, but $\pi_B$ achieves higher return in state $s_2$, the two policies are **incomparable**. In general, a partially ordered set does not guarantee the existence of a greatest element. A priori, one might fear that no single policy could ever dominate all other policies everywhere—that an agent would always have to sacrifice performance in state $s_2$ to excel in state $s_1$.

---

## 7.2 The Fundamental Theorem of Optimal Policies

Remarkably, the Markovian structure of MDPs guarantees that this trade-off never occurs.

> [!IMPORTANT]
> **Theorem (Existence of an Optimal Policy):** 
> For any finite Markov Decision Process with discount factor $\gamma \in [0, 1)$:
> 1. There exists at least one policy $\pi^*$ that is optimal: $\pi^* \ge \pi$ for all policies $\pi$.
> 2. All optimal policies achieve the identical, unique optimal state-value function $v^*(s) \doteq \max_\pi v_\pi(s)$ for all $s \in \mathcal{S}$.
> 3. All optimal policies achieve the identical, unique optimal action-value function $q^*(s, a) \doteq \max_\pi q_\pi(s, a)$ for all $s \in \mathcal{S}, a \in \mathcal{A}$.
> 4. There exists at least one optimal policy $\pi^*$ that is **stationary and deterministic**.

This theorem is profound: no matter how vast or complex the finite MDP, the agent never needs a stochastic policy or a non-stationary clock-dependent policy to act optimally. A simple, static lookup table $a^* = \pi^*(s)$ suffices to achieve global theoretical perfection.

---

## 7.3 Derivation of the Bellman Optimality Equations

How do we mathematically characterize the optimal value functions $v^*(s)$ and $q^*(s, a)$?

```
      BELLMAN OPTIMALITY BACKUP FOR v*(s)               BELLMAN OPTIMALITY BACKUP FOR q*(s, a)
                 (s)   Root State Node                            ●  Root Action Node
                / | \                                            / \
               /  |  \                                          /   \
              / arc:  \  max_{a}                               ▼     ▼
             ▼    ▼    ▼                                     (s_1)   (s_2) Next State Nodes
             ●    ●    ● Action Nodes                        / | \   / | \
            / \  / \  / \                                   /  |  \ /  |  \  max_{a'}
           ▼   ▼▼   ▼▼   ▼                                 ▼   ▼  ▼▼   ▼  ▼
          Next State Nodes (s')                             Action Nodes ●
```

### Derivation for $v^*(s)$
By definition:
$$v^*(s) = \max_{\pi} v_\pi(s)$$

Recall that under any policy $\pi$, $v_\pi(s) = \sum_a \pi(a \mid s) q_\pi(s, a)$.
To maximize this weighted sum over probability distributions $\pi(\cdot \mid s)$, we place all probability mass ($1.0$) on the action that maximizes $q^*(s, a)$:
$$v^*(s) = \max_{a \in \mathcal{A}(s)} q^*(s, a)$$

Now, substitute Bridge 2 ($q^*(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s')$) into this relation:

$$v^*(s) = \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v^*(s') \right]$$

In terms of the full joint transition distribution $p(s', r \mid s, a)$:

$$v^*(s) = \max_{a \in \mathcal{A}(s)} \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma v^*(s') \right]$$

This is the **Bellman Optimality Equation for $v^*(s)$**. It expresses the self-consistency condition: the optimal value of state $s$ must equal the expected return for the best action from that state.

### Derivation for $q^*(s, a)$
By definition:
$$q^*(s, a) = \max_\pi q_\pi(s, a)$$

Recall Bridge 2:
$$q^*(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v^*(s')$$

Substitute the identity $v^*(s') = \max_{a' \in \mathcal{A}(s')} q^*(s', a')$:

$$q^*(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a \max_{a' \in \mathcal{A}(s')} q^*(s', a')$$

In terms of joint probabilities:

$$q^*(s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma \max_{a' \in \mathcal{A}(s')} q^*(s', a') \right]$$

This is the **Bellman Optimality Equation for $q^*(s, a)$**.

---

## 7.4 The Non-Linearity Barrier: Why Matrix Inversion Collapses

Observe the fundamental structural difference between the Bellman Expectation Equation (Chapter 6) and the Bellman Optimality Equation:

| Property | Bellman Expectation Equation | Bellman Optimality Equation |
| :--- | :--- | :--- |
| **Mathematical Nature** | Linear system of $N$ equations | **Non-linear** system of $N$ equations |
| **Action Aggregation** | Expectation $\sum_a \pi(a \mid s) \dots$ | **Maximum operator** $\max_{a \in \mathcal{A}(s)} \dots$ |
| **Matrix Representation** | $\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi$ | $\mathbf{v}^* = \max_{\mathbf{a}} [\mathbf{r}_{\mathbf{a}} + \gamma \mathbf{P}_{\mathbf{a}} \mathbf{v}^*]$ |
| **Closed-Form Solution** | $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ | **No closed-form matrix inverse exists!** |

The maximum operator $\max(x, y)$ is non-linear:
$$\max(x_1 + x_2, y_1 + y_2) \neq \max(x_1, y_1) + \max(x_2, y_2)$$
Because of this non-linearity, we cannot factor out $\mathbf{v}^*$ to write $(\mathbf{I} - \dots)^{-1}$. 

You cannot solve the Bellman Optimality Equation in one shot using linear algebra. To solve it, we must turn to:
1. **Dynamic Programming:** Value Iteration and Policy Iteration (Chapters 8–10).
2. **Linear Programming:** Formulating the MDP as an optimization problem $\min \sum_s v(s)$ subject to $v(s) \ge r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')$.
3. **Reinforcement Learning:** Model-free temporal difference learning (Q-Learning, Chapter 11).

---

## 7.5 Extracting the Optimal Policy from $v^*$ and $q^*$

Once the optimal value functions are known, how does the agent select its actions?

```
               POLICY EXTRACTION FROM OPTIMAL VALUE FUNCTIONS
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
 ┌───────────────────────┐                             ┌───────────────────────┐
 │   EXTRACTION FROM v*  │                             │   EXTRACTION FROM q*  │
 ├───────────────────────┤                             ├───────────────────────┤
 │ Model-dependent:      │                             │ Model-free:           │
 │ Needs P_{s,s'}^a and  │                             │ Needs NO knowledge of │
 │ reward function r.    │                             │ environment dynamics! │
 │                       │                             │                       │
 │ π*(s) = argmax_a [    │                             │ π*(s) = argmax_a      │
 │   r(s, a) +           │                             │       q*(s, a)        │
 │   γ Σ_{s'} P v*(s') ] │                             │                       │
 └───────────────────────┘                             └───────────────────────┘
```

### Extraction from $q^*(s, a)$ (Model-Free):
If the agent possesses $q^*(s, a)$, policy extraction is completely trivial. The agent does not need to know transition probabilities or physics:
$$\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} q^*(s, a)$$
The agent simply reads the numbers in row $s$ of its Q-table and selects the column with the highest value.

### Extraction from $v^*(s)$ (Model-Based):
If the agent only possesses $v^*(s)$, it must perform a **one-step lookahead search**:
$$\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v^*(s') \right]$$
This requires an explicit internal model of transition probabilities $\mathcal{P}_{s, s'}^a$ and expected rewards $r(s, a)$.

---

## 7.6 Worked Examples: Bellman Optimality Systems

### Example 7.1: Solving a 2-State Bellman Optimality System by Hand
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$.
- In state $s_1$:
  - Action $a_1$: transitions to $s_1$ with prob $1.0$, reward $R = 2.0$.
  - Action $a_2$: transitions to $s_2$ with prob $1.0$, reward $R = 0.0$.
- In state $s_2$:
  - Action $a_1$: transitions to $s_2$ with prob $1.0$, reward $R = 1.0$.
  - Action $a_2$: transitions to $s_1$ with prob $1.0$, reward $R = 3.0$.
Discount factor $\gamma = 0.90$.

Write the Bellman optimality equations for $v^*(s_1)$ and $v^*(s_2)$ and solve analytically.

#### Solution:
**Step 1: Write Equations:**
$$v^*(s_1) = \max \begin{cases} q^*(s_1, a_1) = 2.0 + 0.90 v^*(s_1) \\ q^*(s_1, a_2) = 0.0 + 0.90 v^*(s_2) \end{cases}$$
$$v^*(s_2) = \max \begin{cases} q^*(s_2, a_1) = 1.0 + 0.90 v^*(s_2) \\ q^*(s_2, a_2) = 3.0 + 0.90 v^*(s_1) \end{cases}$$

**Step 2: Test Candidate Policy Hypothesis:**
Because $a_1$ in $s_1$ gives $+2$ and stays in $s_1$, while $a_2$ in $s_2$ gives $+3$ and transitions to $s_1$, hypothesize that:
- In $s_1$, optimal action is $a_1$.
- In $s_2$, optimal action is $a_2$.

Under this hypothesis:
$$v(s_1) = 2.0 + 0.90 v(s_1) \implies 0.10 v(s_1) = 2.0 \implies v(s_1) = 20.0$$
Now compute $v(s_2)$:
$$v(s_2) = 3.0 + 0.90 v(s_1) = 3.0 + 0.90(20.0) = 3.0 + 18.0 = 21.0$$

**Step 3: Verify Optimality Condition:**
Now check whether the hypothesized actions achieve the maximum:
- In state $s_1$:
  - $q(s_1, a_1) = 2.0 + 0.90(20.0) = 20.0$.
  - $q(s_1, a_2) = 0.0 + 0.90(21.0) = 18.9$.
  Since $20.0 > 18.9$, $a_1$ is indeed maximal! $\checkmark$
- In state $s_2$:
  - $q(s_2, a_1) = 1.0 + 0.90(21.0) = 1.0 + 18.9 = 19.9$.
  - $q(s_2, a_2) = 3.0 + 0.90(20.0) = 21.0$.
  Since $21.0 > 19.9$, $a_2$ is indeed maximal! $\checkmark$

The unique optimal values are:
$$v^*(s_1) = 20.0, \quad v^*(s_2) = 21.0$$
The unique optimal deterministic policy is:
$$\pi^*(s_1) = a_1, \quad \pi^*(s_2) = a_2$$

---

### Example 7.2: Cliff Walking MDP Path Choice
In a cliff-walking environment, an agent at start cell $S$ can choose between:
- Safe Path: 4 steps, each with reward $R = -1.0$. Transition is deterministic.
- Cliff Path: 2 steps. Step 1 has a $10\%$ wind gust that blows the agent off the cliff into the sea (reward $-100.0$, resets to start $S$). With $90\%$ probability, it succeeds ($R = -1.0$). Step 2 lands on goal ($R = +10.0$).
Terminal state follows immediately upon reaching goal. Let $\gamma = 1.0$.

1. Compute $v^*(S)$ under the Safe Path.
2. Formulate the recursive value equation for the Cliff Path and solve for $v(S)$.
3. Determine which path is chosen by the Bellman optimality criterion.

#### Solution:
**Step 1: Safe Path Value:**
$$v_{\text{safe}}(S) = (-1.0) + (-1.0) + (-1.0) + (+10.0) = +7.0$$

**Step 2: Cliff Path Value:**
Let $S_1$ be the cell reached after step 1 of the Cliff path. From $S_1$, step 2 deterministically reaches the goal with reward $+10.0$:
$$v(S_1) = +10.0$$
From start $S$, taking the Cliff action yields:
$$v_{\text{cliff}}(S) = 0.90 \left[ -1.0 + 1.0 \cdot v(S_1) \right] + 0.10 \left[ -100.0 + 1.0 \cdot v_{\text{cliff}}(S) \right]$$
Substitute $v(S_1) = 10.0$:
$$v_{\text{cliff}}(S) = 0.90 [-1.0 + 10.0] + 0.10 [-100.0 + v_{\text{cliff}}(S)]$$
$$v_{\text{cliff}}(S) = 0.90(9.0) - 10.0 + 0.10 v_{\text{cliff}}(S) = 8.1 - 10.0 + 0.10 v_{\text{cliff}}(S) = -1.9 + 0.10 v_{\text{cliff}}(S)$$
Subtract $0.10 v_{\text{cliff}}(S)$:
$$0.90 v_{\text{cliff}}(S) = -1.9 \implies v_{\text{cliff}}(S) = \frac{-1.9}{0.90} \approx -2.111$$

**Step 3: Optimal Path Selection:**
$$v^*(S) = \max \{v_{\text{safe}}(S), v_{\text{cliff}}(S)\} = \max \{+7.0, -2.111\} = +7.0$$
The agent selects the Safe Path. Even though the Cliff path is twice as short, the catastrophic $-100$ penalty heavily penalizes expected return.

---

### Example 7.3: Extracting Optimal Policy from an Optimal Q-Table
Given the following optimal action-value table $q^*(s, a)$ for an autonomous mobile robot:

| State $s$ | $q^*(s, \text{North})$ | $q^*(s, \text{South})$ | $q^*(s, \text{East})$ | $q^*(s, \text{West})$ |
| :---: | :---: | :---: | :---: | :---: |
| $s_1$ | $+14.2$ | $+8.1$ | $+19.5$ | $+11.0$ |
| $s_2$ | $-3.0$ | $+4.5$ | $-1.2$ | $+4.5$ |
| $s_3$ | $+100.0$ | $+92.0$ | $+85.0$ | $+99.8$ |

1. Extract the optimal state-values $v^*(s_1), v^*(s_2), v^*(s_3)$.
2. Extract the optimal deterministic policy $\pi^*(s)$.
3. If tie-breaking occurs, how should the agent resolve it?

#### Solution:
**Step 1: Extract $v^*(s) = \max_a q^*(s, a)$:**
- $v^*(s_1) = \max \{14.2, 8.1, 19.5, 11.0\} = +19.5$
- $v^*(s_2) = \max \{-3.0, 4.5, -1.2, 4.5\} = +4.5$
- $v^*(s_3) = \max \{100.0, 92.0, 85.0, 99.8\} = +100.0$

**Step 2: Extract $\pi^*(s) = \arg\max_a q^*(s, a)$:**
- For $s_1$: $\arg\max = \text{East} \implies \pi^*(s_1) = \text{East}$.
- For $s_2$: $\arg\max \in \{\text{South}, \text{West}\}$ (both achieve $4.5$).
- For $s_3$: $\arg\max = \text{North} \implies \pi^*(s_3) = \text{North}$.

**Step 3: Tie-Breaking:**
In state $s_2$, both $\text{South}$ and $\text{West}$ yield identical optimal return $+4.5$. The agent may arbitrarily break the tie (e.g. by index), or employ a stochastic policy that randomizes between them: $\pi^*(\text{South} \mid s_2) = 0.5, \pi^*(\text{West} \mid s_2) = 0.5$. Both choices achieve identical optimal value.

---

### Example 7.4: Bellman Optimality in a Continuous Action Problem
Let state $s$ have continuous action $a \in [0, 10]$ (e.g. engine throttle).
Reward is $R(s, a) = 4a - a^2$.
The next state is deterministically $s' = 0.5 s + 0.1 a$.
Assume $v^*(s') = 100 - (s')^2$, and $\gamma = 0.50$.
Write the continuous Bellman optimality optimization problem for state $s = 2.0$ and compute the exact optimal action $a^*$.

#### Solution:
The Bellman optimality equation is:
$$v^*(s) = \max_{a \in [0, 10]} \left[ R(s, a) + \gamma v^*(s') \right]$$
Substitute $s = 2.0$:
$$s' = 0.5(2.0) + 0.1 a = 1.0 + 0.1 a$$
$$v^*(s') = 100 - (1.0 + 0.1 a)^2 = 100 - (1.0 + 0.2 a + 0.01 a^2) = 99.0 - 0.2 a - 0.01 a^2$$
Now formulate the objective function $J(a) = R(s, a) + \gamma v^*(s')$:
$$J(a) = (4a - a^2) + 0.50 [99.0 - 0.2 a - 0.01 a^2]$$
$$J(a) = 4a - a^2 + 49.5 - 0.1 a - 0.005 a^2 = 49.5 + 3.9 a - 1.005 a^2$$

To maximize $J(a)$, take the derivative with respect to $a$ and set to 0:
$$\frac{d J}{d a} = 3.9 - 2(1.005) a = 3.9 - 2.01 a = 0$$
$$a^* = \frac{3.9}{2.01} \approx 1.9403$$
Second derivative $\frac{d^2 J}{d a^2} = -2.01 < 0$ confirms a global maximum.
Since $1.9403 \in [0, 10]$, the optimal continuous throttle is $a^* \approx 1.94$.

---

### Example 7.5: Non-Uniqueness of Optimal Policies
Construct a minimal MDP example where multiple distinct deterministic policies achieve identical optimal value $v^*(s)$ in every state.

#### Solution:
Let $\mathcal{S} = \{s_0, s_{\text{goal}}\}$. From $s_0$, two actions exist:
- Action $a_L$ ("Go Left"): transitions to $s_{\text{goal}}$ with reward $+10.0$.
- Action $a_R$ ("Go Right"): transitions to $s_{\text{goal}}$ with reward $+10.0$.
State $s_{\text{goal}}$ is absorbing with reward 0.

Under policy $\pi_1(s_0) = a_L$: $v_{\pi_1}(s_0) = 10.0$.
Under policy $\pi_2(s_0) = a_R$: $v_{\pi_2}(s_0) = 10.0$.
Both policies are deterministic, completely distinct ($\pi_1 \neq \pi_2$), and both achieve the identical optimal value $v^*(s_0) = 10.0$.
Thus, while the optimal value function $v^*$ is always strictly unique, the optimal policy $\pi^*$ need not be unique.

---

### Example 7.6: Bellman Optimality and Linear Programming Duality
The Bellman Optimality Equation can be solved as a primal Linear Program (LP):
$$\min_{\mathbf{v} \in \mathbb{R}^N} \sum_{s \in \mathcal{S}} v(s)$$
subject to:
$$v(s) \ge r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v(s'), \quad \forall s \in \mathcal{S}, a \in \mathcal{A}(s)$$

Explain why minimizing $\sum_s v(s)$ subject to these constraints produces $v^*(s)$ rather than an arbitrary lower bound.

#### Solution:
For any state $s$ and action $a$, the constraint enforces:
$$v(s) \ge q^*(s, a) \implies v(s) \ge \max_a q^*(s, a) = v^*(s)$$
Thus, the feasible region of the linear program is the set of all vectors that upper-bound the optimal value: $\{\mathbf{v} : \mathbf{v} \ge \mathbf{v}^*\}$.
Because the objective function $\sum_s v(s)$ has strictly positive coefficients ($+1$ for every state), the LP minimizes the vector component-wise.
The minimum possible value that satisfies $v(s) \ge v^*(s)$ for all $s$ is achieved at the tight boundary:
$$v(s) = v^*(s), \quad \forall s \in \mathcal{S}$$
The constraints become active at the optimal actions $\pi^*(s)$.

---

### Example 7.7: Maximum Entropy Bellman Optimality (Soft Q-Learning)
In modern deep RL algorithms like Soft Actor-Critic (SAC), the standard $\max$ operator is replaced by a temperature-weighted **Soft-Max operator**:
$$v_{\text{soft}}^*(s) = \tau \ln \left( \sum_{a \in \mathcal{A}} e^{q_{\text{soft}}^*(s, a) / \tau} \right)$$
where $\tau > 0$ is the entropy temperature.
Let $q(s, a_1) = 4.0$ and $q(s, a_2) = 2.0$.
1. Compute the hard maximum $v^*(s) = \max_a q(s, a)$.
2. Compute the soft maximum $v_{\text{soft}}^*(s)$ for $\tau = 1.0$ and $\tau = 0.1$.
3. Prove that $\lim_{\tau \to 0} v_{\text{soft}}^*(s) = \max_a q(s, a)$.

#### Solution:
**1. Hard Maximum:**
$$v^*(s) = \max(4.0, 2.0) = 4.0$$

**2. Soft Maximum:**
- For $\tau = 1.0$:
  $$v_{\text{soft}}^*(s) = 1.0 \ln(e^4 + e^2) = \ln(54.598 + 7.389) = \ln(61.987) \approx 4.1269$$
- For $\tau = 0.1$:
  $$v_{\text{soft}}^*(s) = 0.1 \ln(e^{40} + e^{20}) = 0.1 \ln(e^{40}(1 + e^{-20})) = 0.1 [40 + \ln(1 + e^{-20})] \approx 4.0 + 0.1(0) = 4.0000$$

**3. Limit Proof:**
Let $q_{\max} = \max_a q(s, a)$.
$$\tau \ln \left( \sum_a e^{q(s, a)/\tau} \right) = \tau \ln \left( e^{q_{\max}/\tau} \sum_a e^{(q(s, a) - q_{\max})/\tau} \right)$$
$$= \tau \left[ \frac{q_{\max}}{\tau} + \ln \left( 1 + \sum_{a \neq a^*} e^{(q(s, a) - q_{\max})/\tau} \right) \right] = q_{\max} + \tau \ln \left( 1 + \dots \right)$$
As $\tau \to 0^+$, for any $a \neq a^*$, $q(s, a) - q_{\max} < 0 \implies \frac{q(s, a) - q_{\max}}{\tau} \to -\infty \implies e^{-\infty} = 0$.
The log term approaches $\ln(1) = 0$.
Thus:
$$\lim_{\tau \to 0^+} v_{\text{soft}}^*(s) = q_{\max} = \max_a q(s, a)$$

---

### Example 7.8: Detecting Sub-Optimality via Bellman Error
Let an agent maintain candidate value estimates $\hat{v}(s_1) = 10.0$ and $\hat{v}(s_2) = 15.0$ in an MDP with $\gamma = 0.8$.
The environment dynamics from $s_1$ are:
- Action $a_1$: transitions to $s_1$ with reward $4.0$.
- Action $a_2$: transitions to $s_2$ with reward $2.0$.

Compute the **Bellman Optimality Error** for state $s_1$:
$$\mathcal{E}(s_1) \doteq \left| \hat{v}(s_1) - \max_a [r(s_1, a) + \gamma \sum_{s'} \mathcal{P}_{s_1, s'}^a \hat{v}(s')] \right|$$

#### Solution:
Evaluate candidate Q-values using $\hat{v}$:
- $q(s_1, a_1) = 4.0 + 0.8 \hat{v}(s_1) = 4.0 + 0.8(10.0) = 4.0 + 8.0 = 12.0$
- $q(s_1, a_2) = 2.0 + 0.8 \hat{v}(s_2) = 2.0 + 0.8(15.0) = 2.0 + 12.0 = 14.0$
The target value is:
$$v_{\text{target}}(s_1) = \max(12.0, 14.0) = 14.0$$
The Bellman optimality error is:
$$\mathcal{E}(s_1) = |\hat{v}(s_1) - v_{\text{target}}(s_1)| = |10.0 - 14.0| = 4.0$$
State $s_1$ is severely underestimated by 4.0 units.

---

### Example 7.9: The Gambler's Problem Bellman Optimality Setup
A gambler bets on coin flips: coin lands Heads with probability $p = 0.40$ (an unfair coin).
- State $s \in \{1, 2, \dots, 99\}$ is the gambler's current capital.
- Actions $a \in \{0, 1, \dots, \min(s, 100 - s)\}$: amount to stake.
- Terminal states: $s = 0$ (ruin, reward 0) and $s = 100$ (win, reward $+1.0$).
- All intermediate rewards are 0; $\gamma = 1.0$.

Write the exact Bellman optimality equation for capital $s \in \{1, \dots, 99\}$.

#### Solution:
For any capital $s \in \{1, \dots, 99\}$ and stake $a \in \{0, \dots, \min(s, 100 - s)\}$:
- If coin lands Heads (prob $p$): capital becomes $s + a$.
- If coin lands Tails (prob $1 - p$): capital becomes $s - a$.
Since intermediate rewards are 0 and $\gamma = 1$:
$$v^*(s) = \max_{a \in \{0, \dots, \min(s, 100 - s)\}} \left[ p \cdot v^*(s + a) + (1 - p) \cdot v^*(s - a) \right]$$
with boundary conditions $v^*(0) = 0$ and $v^*(100) = 1.0$.
Because $p < 0.5$ (house edge), the optimal policy exhibits striking fractal discontinuities, often betting the maximum possible stake $a = \min(s, 100 - s)$ to minimize exposure to unfavorable odds.

---

### Example 7.10: Uniqueness of $v^*$ via Fixed-Point Contraction
Explain conceptually why the Bellman Optimality Equation can have only one unique solution vector $\mathbf{v}^*$, even though there may be millions of optimal policies.

#### Solution:
The Bellman optimality operator $T^*: \mathbb{R}^N \to \mathbb{R}^N$ defined by:
$$(T^* v)(s) = \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right]$$
is a $\gamma$-contraction mapping under the supremum norm $\|\cdot\|_\infty$ (proven rigorously in Chapter 8).
By the **Banach Fixed-Point Theorem**, any contraction mapping on a complete metric space has:
1. Exactly **one** unique fixed point $v^* = T^* v^*$.
2. Every iterative sequence $v_{k+1} = T^* v_k$ converges to this identical fixed point regardless of initial guess $v_0$.
Even if multiple policies $\pi_1^*, \pi_2^*$ achieve the maximum in $\arg\max_a q^*(s, a)$, the numerical value of that maximum $v^*(s)$ is strictly unique.

---

## 7.7 Solved Exercises

### Exercise 7.1: Optimal Action Selection from Q-Values
In state $s$, an agent computes: $q^*(s, \text{Jump}) = -2.5, q^*(s, \text{Duck}) = +1.2, q^*(s, \text{Run}) = +0.8$.
Which action does the optimal policy select, and what is $v^*(s)$?

#### Solution:
$$v^*(s) = \max(-2.5, 1.2, 0.8) = +1.2$$
$$\pi^*(s) = \arg\max_a q^*(s, a) = \text{Duck}$$

---

### Exercise 7.2: One-Step Lookahead from Optimal State Values
An agent in state $s$ has actions $a_1$ and $a_2$.
- Action $a_1$: $r(s, a_1) = 3.0$, transitions to $s_1$ with prob 1.0.
- Action $a_2$: $r(s, a_2) = 1.0$, transitions to $s_2$ with prob 1.0.
Known optimal values are $v^*(s_1) = 10.0, v^*(s_2) = 14.0$, and $\gamma = 0.90$.
Find the optimal action $\pi^*(s)$.

#### Solution:
$$q^*(s, a_1) = 3.0 + 0.90(10.0) = 3.0 + 9.0 = 12.0$$
$$q^*(s, a_2) = 1.0 + 0.90(14.0) = 1.0 + 12.6 = 13.6$$
Since $13.6 > 12.0$, $\pi^*(s) = a_2$, and $v^*(s) = 13.6$.

---

### Exercise 7.3: Inverting Bellman Optimality
Explain in one sentence why you cannot compute $\mathbf{v}^* = (\mathbf{I} - \gamma \mathbf{P}^*)^{-1} \mathbf{r}^*$ directly without first knowing $\pi^*$.

#### Solution:
Because the optimal transition matrix $\mathbf{P}^*$ and reward vector $\mathbf{r}^*$ depend on knowing which action achieves the maximum in each state, which is precisely the unknown optimal policy we are trying to find.

---

### Exercise 7.4: Verification of Bellman Optimality
Given $v^*(s) = 25.0$, $r(s, a_1) = 5.0$, $\mathcal{P}_{s, s}^{a_1} = 1.0$, $\gamma = 0.80$.
Does this state-action pair satisfy the Bellman optimality condition?

#### Solution:
Check consistency:
$$q^*(s, a_1) = 5.0 + 0.80 v^*(s) = 5.0 + 0.80(25.0) = 5.0 + 20.0 = 25.0 = v^*(s)$$
Yes. The action-value matches the state-value with zero error.

---

### Exercise 7.5: Bound on Optimal Return
In an MDP with $|R_{t+1}| \le 5.0$ and $\gamma = 0.95$, what is the maximum possible value $v^*(s)$ could theoretically attain in any state?

#### Solution:
$$v_{\max}^* \le \frac{R_{\max}}{1 - \gamma} = \frac{5.0}{1 - 0.95} = \frac{5.0}{0.05} = +100.0$$

---

### Exercise 7.6: Advantage of Optimal Actions
Prove that for any state $s$, the advantage of an optimal action $a^* \in \arg\max_a q^*(s, a)$ is identically zero: $A^*(s, a^*) = 0$.

#### Solution:
By definition:
$$A^*(s, a^*) \doteq q^*(s, a^*) - v^*(s)$$
Since $v^*(s) = \max_a q^*(s, a) = q^*(s, a^*)$:
$$A^*(s, a^*) = q^*(s, a^*) - q^*(s, a^*) = 0$$
Optimal actions have zero advantage; all sub-optimal actions have strictly negative advantage ($A^*(s, a_{\text{sub}}) < 0$).

---

### Exercise 7.7: Impact of Sub-Optimal Policy Execution
If an agent follows optimal policy $\pi^*$ in every state except state $s_0$ where it takes sub-optimal action $a$, express the loss in return in terms of the optimal advantage $A^*(s_0, a)$.

#### Solution:
The return of this one-step perturbed policy $\pi'$ is:
$$v_{\pi'}(s_0) = q^*(s_0, a)$$
The loss in value is:
$$\text{Loss} = v^*(s_0) - v_{\pi'}(s_0) = v^*(s_0) - q^*(s_0, a) = - [q^*(s_0, a) - v^*(s_0)] = -A^*(s_0, a)$$
The value loss is exactly the magnitude of the negative advantage of action $a$.

---

### Exercise 7.8: Stochastic vs Deterministic Bellman Solution
Suppose two deterministic actions $a_1$ and $a_2$ have $q^*(s, a_1) = q^*(s, a_2) = 50.0$.
Does a stochastic policy $\pi(a_1 \mid s) = 0.3, \pi(a_2 \mid s) = 0.7$ also achieve optimal value in state $s$?

#### Solution:
Yes.
$$v_\pi(s) = 0.3 q^*(s, a_1) + 0.7 q^*(s, a_2) = 0.3(50.0) + 0.7(50.0) = 15.0 + 35.0 = 50.0 = v^*(s)$$
Any convex combination of tied optimal actions achieves optimal value.

---

### Exercise 7.9: Monotonicity of the Bellman Optimality Operator
Prove that the Bellman optimality operator $T^*$ is monotonic: if $u(s) \ge v(s)$ for all $s \in \mathcal{S}$, then $(T^* u)(s) \ge (T^* v)(s)$ for all $s \in \mathcal{S}$.

#### Solution:
For any action $a$:
$$r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \ge r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')$$
because $\gamma \ge 0$, $\mathcal{P}_{s, s'}^a \ge 0$, and $u(s') \ge v(s')$.
Taking the maximum over $a \in \mathcal{A}(s)$ on both sides preserves the inequality:
$$\max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \right] \ge \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right]$$
$$(T^* u)(s) \ge (T^* v)(s)$$
Thus, $T^*$ is strictly monotonic.

---

### Exercise 7.10: Sub-Optimality of Naive Greedy Action Selection
Explain why choosing actions that maximize immediate reward $R_{t+1}$ is rarely optimal in an MDP.

#### Solution:
Maximizing immediate reward $a = \arg\max_a r(s, a)$ ignores the second term of the Bellman equation: $\gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s')$.
An action with high immediate reward may transition with high probability to catastrophic successor states where future returns are negative, resulting in a strictly inferior cumulative return compared to a patient action that absorbs a small immediate cost to unlock high-value future regions.
