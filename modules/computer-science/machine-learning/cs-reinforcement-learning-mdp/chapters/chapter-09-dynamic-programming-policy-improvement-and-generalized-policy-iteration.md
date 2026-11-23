# Chapter 9: Dynamic Programming II: Policy Improvement and Generalized Policy Iteration (GPI)

---

## 9.1 From Prediction to Control: The Policy Improvement Theorem

In Chapter 8, we conquered the **Prediction Problem**: given a fixed policy $\pi$, we can iteratively apply the Bellman Expectation Operator $T^\pi$ to compute its exact state-value function $v_\pi(s)$.

Now we confront the ultimate goal of reinforcement learning: the **Control Problem**. 
> *"Once we have computed the value function $v_\pi$ of our current policy $\pi$, how do we use that knowledge to construct a strictly superior policy $\pi'$?"*

The mathematical key that unlocks control is the celebrated **Policy Improvement Theorem** (Bellman 1957, Howard 1960).

```
                            THE POLICY IMPROVEMENT STEP
                                         │
                                   Current Policy π
                                         │
                                         ▼ Evaluate
                                   Compute v_π(s)
                                         │
                                         ▼ Counterfactual Action Lookahead
                          q_π(s, a) = r(s, a) + γ Σ_{s'} P_{s,s'}^a v_π(s')
                                         │
                                         ▼ Greedy Selection
                                  π'(s) = argmax_a q_π(s, a)
                                         │
                                         ▼
                      Policy Improvement Theorem Guarantees:
                           v_{π'}(s) ≥ v_π(s) FOR ALL s ∈ S!
```

---

## 9.2 Rigorous Proof of the Policy Improvement Theorem

### Theorem Statement:
Let $\pi$ and $\pi'$ be any pair of deterministic stationary policies such that for all states $s \in \mathcal{S}$:

$$q_\pi(s, \pi'(s)) \ge v_\pi(s)$$

Then policy $\pi'$ is globally superior to or equal to policy $\pi$:

$$v_{\pi'}(s) \ge v_\pi(s), \quad \forall s \in \mathcal{S}$$

Furthermore, if there exists at least one state $s_0$ where the inequality is strict ($q_\pi(s_0, \pi'(s_0)) > v_\pi(s_0)$), then $\pi'$ strictly outperforms $\pi$ ($v_{\pi'}(s_0) > v_\pi(s_0)$).

### Proof (by Induction and Recursive Expansion):
We begin with the premise:
$$v_\pi(s) \le q_\pi(s, \pi'(s))$$

Expand $q_\pi(s, \pi'(s))$ using its definition as immediate reward plus discounted successor value:
$$v_\pi(s) \le \mathbb{E}_{\pi'} [R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s]$$

Now, observe that the successor state $S_{t+1}$ is evaluated using $v_\pi(S_{t+1})$. 
By our original premise, for any state $S_{t+1}$, we also know that $v_\pi(S_{t+1}) \le q_\pi(S_{t+1}, \pi'(S_{t+1}))$. 
Substitute this inequality into the expectation:
$$\begin{aligned}
v_\pi(s) &\le \mathbb{E}_{\pi'} \left[ R_{t+1} + \gamma q_\pi(S_{t+1}, \pi'(S_{t+1})) \;\middle|\; S_t = s \right] \\
&= \mathbb{E}_{\pi'} \left[ R_{t+1} + \gamma \mathbb{E}_{\pi'} [R_{t+2} + \gamma v_\pi(S_{t+2}) \mid S_{t+1}] \;\middle|\; S_t = s \right]
\end{aligned}$$

By the Law of Total Expectation, the conditional expectations collapse into a single trajectory expectation:
$$v_\pi(s) \le \mathbb{E}_{\pi'} [R_{t+1} + \gamma R_{t+2} + \gamma^2 v_\pi(S_{t+2}) \mid S_t = s]$$

We can repeat this unrolling process recursively for $k$ time steps:
$$v_\pi(s) \le \mathbb{E}_{\pi'} \left[ R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots + \gamma^{k-1} R_{t+k} + \gamma^k v_\pi(S_{t+k}) \;\middle|\; S_t = s \right]$$

Now take the limit as the horizon $k \to \infty$. 
Because $\gamma \in [0, 1)$ and all state values are bounded ($|v_\pi(s)| \le \frac{R_{\max}}{1 - \gamma} < \infty$), the tail term vanishes:
$$\lim_{k \to \infty} \gamma^k \mathbb{E}_{\pi'} [v_\pi(S_{t+k}) \mid S_t = s] = 0$$

The remaining infinite sum is, by definition, the state-value function under policy $\pi'$:
$$v_\pi(s) \le \mathbb{E}_{\pi'} \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right] = v_{\pi'}(s)$$

$$v_\pi(s) \le v_{\pi'}(s) \quad \blacksquare$$

This completes the proof. By simply choosing an action whose quality $q_\pi(s, a)$ meets or exceeds the current baseline value $v_\pi(s)$, we guarantee that the new policy will never degrade performance in any state.

---

## 9.3 The Greedy Policy Improvement Step

Given a value function $v_\pi$, how do we construct a policy $\pi'$ that satisfies the condition $q_\pi(s, \pi'(s)) \ge v_\pi(s)$?
The most natural, aggressive strategy is the **Greedy Update**: in every state, choose the action that maximizes $q_\pi(s, a)$:

$$\pi'(s) \doteq \arg\max_{a \in \mathcal{A}(s)} q_\pi(s, a) = \arg\max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_\pi(s') \right]$$

By definition of the maximum operator:
$$q_\pi(s, \pi'(s)) = \max_{a \in \mathcal{A}(s)} q_\pi(s, a) \ge \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) q_\pi(s, a) = v_\pi(s)$$
The greedy policy improvement condition is unconditionally satisfied everywhere.

---

## 9.4 The Complete Policy Iteration Algorithm

By alternating between exact Policy Evaluation and greedy Policy Improvement, we arrive at **Policy Iteration** (Howard 1960):

$$\pi_0 \xrightarrow{\text{Evaluation}} v_{\pi_0} \xrightarrow{\text{Improvement}} \pi_1 \xrightarrow{\text{Evaluation}} v_{\pi_1} \xrightarrow{\text{Improvement}} \pi_2 \xrightarrow{\text{Evaluation}} \dots \xrightarrow{\text{Improvement}} \pi^*$$

```
                         POLICY ITERATION ALGORITHM
                                     │
                             Initialize π_0(s)
                             (Arbitrary policy)
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
               ┌───►│       POLICY EVALUATION         │
               │    │ Compute exact v_π via iterative │
               │    │ sweeps or matrix inversion      │
               │    └────────────────┬────────────────┘
               │                     │
               │                     ▼
               │    ┌─────────────────────────────────┐
               │    │       POLICY IMPROVEMENT        │
               │    │ π_{new}(s) = argmax_a q_π(s, a) │
               │    └────────────────┬────────────────┘
               │                     │
               │                     ▼
               │            Did Policy Change?
               │              π_{new} == π?
               │             /             \
               └── YES (changed)            └── NO (stable) ──► TERMINATE: π* is Optimal!
```

### Finite Termination Proof
Why is Policy Iteration guaranteed to converge to the optimal policy in a **finite number of steps**?

**Proof:**
1. In a finite MDP with $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions, the total number of distinct deterministic policies is finite:
   $$|\Pi| = |\mathcal{A}|^{|\mathcal{S}|}$$
2. At each iteration, either:
   - $\pi_{k+1}$ is strictly superior to $\pi_k$ (there is at least one state where $v_{\pi_{k+1}}(s) > v_{\pi_k}(s)$), OR
   - $\pi_{k+1}$ achieves identical value to $\pi_k$ across all states.
3. If $v_{\pi_{k+1}}(s) = v_{\pi_k}(s)$ for all $s$, then:
   $$v_{\pi_k}(s) = \max_a q_{\pi_k}(s, a) = \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_{\pi_k}(s') \right]$$
   This is precisely the Bellman Optimality Equation! Thus, $v_{\pi_k} = v^*$, and policy $\pi_k$ is globally optimal.
4. Because each non-terminal step strictly improves the value, no policy can ever be revisited (no cycles). Since the total number of policies is finite, the algorithm **must terminate in at most $|\mathcal{A}|^{|\mathcal{S}|}$ iterations**.

In practice, Policy Iteration terminates in a tiny fraction of that theoretical upper bound—frequently in fewer than 10 iterations even for thousands of states.

---

## 9.5 Generalized Policy Iteration (GPI)

In classical Policy Iteration, policy evaluation is run to complete mathematical convergence before policy improvement is attempted. 

Sutton & Barto recognized that this strict separation is unnecessary. They formulated the unifying paradigm of **Generalized Policy Iteration (GPI)**:
> **Generalized Policy Iteration (GPI)** refers to the general concept of letting policy evaluation and policy improvement processes interact, independent of the granularity and other details of the two processes.

```
                           THE GPI GEOMETRIC DANCE
                 Value Functions V
                         ▲
                         │       / Value matches current policy
                         │      /  v = v_π
                         │     /
                         │    /  ● (v*, π*) Bellman Optimality Point
                         │   /  / 
                         │  /  /  Policy is greedy with respect to v
                         │ /  /   π = greedy(v)
                         │/  /
                         └──────────────► Policies Π
```

In GPI:
- **Evaluation** drives the value function toward consistency with the current policy.
- **Improvement** makes the policy greedy with respect to the current value function.
- The two processes compete and cooperate: evaluation changes the landscape upon which the policy acts; improvement alters the behavior that evaluation is trying to measure.
- The two processes stabilize if and only if a value function and policy are reached that are greedy with respect to each other: **the optimal fixed point $(v^*, \pi^*)$**.

---

## 9.6 Worked Examples: Policy Iteration Traces

### Example 9.1: Complete Policy Iteration Trace on a 2-State MDP
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2\}$ with $\gamma = 0.50$.
- In state $s_1$:
  - Action $a_1$: transitions to $s_1$ with prob 1.0, reward $R = 1.0$.
  - Action $a_2$: transitions to $s_2$ with prob 1.0, reward $R = 2.0$.
- In state $s_2$:
  - Action $a_1$: transitions to $s_2$ with prob 1.0, reward $R = 4.0$.
  - Action $a_2$: transitions to $s_1$ with prob 1.0, reward $R = 0.0$.

Initialize with policy $\pi_0$: choose $a_1$ in both states ($\pi_0(s_1) = a_1, \pi_0(s_2) = a_1$).
Execute complete Policy Iteration to convergence.

#### Solution:
**Iteration 1:**
*Step 1: Evaluate $\pi_0$:*
- Under $\pi_0(s_1) = a_1$: loops on $s_1$ with $R = 1$:
  $$v(s_1) = 1.0 + 0.50 v(s_1) \implies 0.50 v(s_1) = 1.0 \implies v(s_1) = 2.0$$
- Under $\pi_0(s_2) = a_1$: loops on $s_2$ with $R = 4$:
  $$v(s_2) = 4.0 + 0.50 v(s_2) \implies 0.50 v(s_2) = 4.0 \implies v(s_2) = 8.0$$
Current value vector: $\mathbf{v}_{\pi_0} = [2.0, 8.0]^T$.

*Step 2: Improve Policy:*
Compute Q-values for all state-action pairs using $\mathbf{v}_{\pi_0}$:
- State $s_1$:
  - $q(s_1, a_1) = 1.0 + 0.50 v(s_1) = 1.0 + 0.50(2.0) = 2.0$
  - $q(s_1, a_2) = 2.0 + 0.50 v(s_2) = 2.0 + 0.50(8.0) = 2.0 + 4.0 = 6.0$
  $\arg\max_a q(s_1, a) = a_2$ (since $6.0 > 2.0$). New action: $\pi_1(s_1) = a_2$.
- State $s_2$:
  - $q(s_2, a_1) = 4.0 + 0.50 v(s_2) = 4.0 + 0.50(8.0) = 8.0$
  - $q(s_2, a_2) = 0.0 + 0.50 v(s_1) = 0.0 + 0.50(2.0) = 1.0$
  $\arg\max_a q(s_2, a) = a_1$ (since $8.0 > 1.0$). Retains action: $\pi_1(s_2) = a_1$.

Policy changed! $\pi_1 = [a_2, a_1]^T \neq \pi_0$. Proceed to Iteration 2.

---

**Iteration 2:**
*Step 1: Evaluate $\pi_1$:*
Under $\pi_1$:
- In $s_1$: takes $a_2 \to s_2$ with $R = 2$.
- In $s_2$: takes $a_1 \to s_2$ with $R = 4$.
Solve:
$$v_{\pi_1}(s_2) = 4.0 + 0.50 v_{\pi_1}(s_2) \implies v_{\pi_1}(s_2) = 8.0$$
$$v_{\pi_1}(s_1) = 2.0 + 0.50 v_{\pi_1}(s_2) = 2.0 + 0.50(8.0) = 6.0$$
Current value vector: $\mathbf{v}_{\pi_1} = [6.0, 8.0]^T$.
Notice: $v(s_1)$ increased from $2.0 \to 6.0$!

*Step 2: Improve Policy:*
Compute Q-values using $\mathbf{v}_{\pi_1} = [6.0, 8.0]^T$:
- State $s_1$:
  - $q(s_1, a_1) = 1.0 + 0.50(6.0) = 4.0$
  - $q(s_1, a_2) = 2.0 + 0.50(8.0) = 6.0$
  $\arg\max = a_2 \implies \pi_2(s_1) = a_2$.
- State $s_2$:
  - $q(s_2, a_1) = 4.0 + 0.50(8.0) = 8.0$
  - $q(s_2, a_2) = 0.0 + 0.50(6.0) = 3.0$
  $\arg\max = a_1 \implies \pi_2(s_2) = a_1$.

*Termination Check:*
$\pi_2 = [a_2, a_1]^T == \pi_1$.
The policy is strictly identical to the previous iteration.
**Policy Iteration terminates!** Optimal policy $\pi^* = [a_2, a_1]^T$, optimal values $v^* = [6.0, 8.0]^T$. Converged in exactly 2 iterations!

---

### Example 9.2: Tracing Policy Improvement on a Line Graph
Consider 3 states in a line: $s_1 \longleftrightarrow s_2 \longleftrightarrow s_3$.
Actions: $\{\text{Left}, \text{Right}\}$.
- Reaching $s_3$ earns reward $R = +10.0$ and terminates.
- All other steps earn $R = -1.0$.
- Let $\gamma = 0.90$.
Start with naive policy $\pi_0$ that always moves $\text{Left}$ ($\pi_0(s) = \text{Left}$ for all $s$).
Show how a single policy improvement step alters the policy.

#### Solution:
Under $\pi_0$ (always Left):
- From $s_1$: bounces off boundary, stays in $s_1$ with $R = -1$.
- Values under $\pi_0$: $v(s) = \frac{-1}{1 - 0.9} = -10.0$ for all states.
Now execute Policy Improvement using $v_{\pi_0} = [-10, -10, -10]^T$:
- In state $s_2$:
  - $q(s_2, \text{Left}) = -1.0 + 0.90 v(s_1) = -1.0 + 0.90(-10.0) = -10.0$.
  - $q(s_2, \text{Right}) = -1.0 + 0.90 v(s_3) = -1.0 + 0.90(0) = -1.0$ (since reaching terminal $s_3$ gives $+10$, wait: action Right from $s_2$ enters terminal $s_3$ with $R = +10$!).
  $$q(s_2, \text{Right}) = +10.0 + 0.90(0) = +10.0$$
  Comparing: $q(s_2, \text{Right}) = +10.0 > -10.0 = q(s_2, \text{Left})$.
  $\pi'(s_2)$ immediately flips to **Right**!
In a single policy improvement step, the agent eliminates suicidal leftward looping.

---

### Example 9.3: Maximum Number of Iterations Bound
An autonomous warehouse has 50 grid locations. In each location, the robot can choose from 4 directions.
1. What is the theoretical maximum number of deterministic policies?
2. If Policy Iteration terminates in 6 iterations, what percentage of the policy space was explored?

#### Solution:
1. Total policies:
   $$|\Pi| = 4^{50} = (2^2)^{50} = 2^{100} \approx 1.26765 \times 10^{30} \text{ policies}$$
2. Percentage evaluated:
   $$\text{Fraction} = \frac{6}{1.26765 \times 10^{30}} \approx 4.73 \times 10^{-30} = 4.73 \times 10^{-28}\%$$
Policy Iteration finds the global optimal policy across a space of $10^{30}$ candidates by inspecting less than a quintillionth of a percent of the candidates.

---

### Example 9.4: Tie-Breaking Hazards in Policy Improvement
Suppose state $s$ has two actions $a_1$ and $a_2$ such that $q_\pi(s, a_1) = q_\pi(s, a_2) = 15.0$.
If an engineer implements tie-breaking by flipping between tied actions on alternating iterations, what pathological software bug occurs?

#### Solution:
If the tie-breaking logic flips between $a_1$ and $a_2$:
- Iteration $k$: evaluates $\pi_k(s) = a_1$. Greedy update sees tie, selects $a_2 \implies \pi_{k+1}(s) = a_2$.
- Iteration $k+1$: evaluates $\pi_{k+1}(s) = a_2$. Greedy update sees tie, selects $a_1 \implies \pi_{k+2}(s) = a_1$.
The termination check `if (new_policy == old_policy)` fails every time. The algorithm oscillates in an **infinite ping-pong loop** between two equally optimal policies.
**Correct Implementation:** Always preserve the existing action if it achieves the maximum:
$$\pi_{k+1}(s) = \begin{cases} \pi_k(s) & \text{if } q(s, \pi_k(s)) = \max_a q(s, a) \\ \arg\max_a q(s, a) & \text{otherwise} \end{cases}$$

---

### Example 9.5: Policy Improvement with Stochastic Policies
Let $\pi$ be a stochastic policy. Prove that if $\pi'$ is chosen such that $\pi'(a \mid s) > 0$ only for actions that achieve $\max_a q_\pi(s, a)$, then $v_{\pi'}(s) \ge v_\pi(s)$.

#### Solution:
Evaluate the expected action value under $\pi'$:
$$q_\pi(s, \pi'(s)) = \sum_{a \in \mathcal{A}(s)} \pi'(a \mid s) q_\pi(s, a)$$
Because $\pi'$ assigns probability only to actions in $\arg\max_a q_\pi(s, a)$:
$$q_\pi(s, \pi'(s)) = \sum_a \pi'(a \mid s) \max_{a'} q_\pi(s, a') = \max_{a'} q_\pi(s, a') \sum_a \pi'(a \mid s) = \max_{a'} q_\pi(s, a')$$
Furthermore, under the original policy $\pi$:
$$v_\pi(s) = \sum_a \pi(a \mid s) q_\pi(s, a) \le \max_{a'} q_\pi(s, a')$$
Therefore:
$$q_\pi(s, \pi'(s)) \ge v_\pi(s)$$
By the Policy Improvement Theorem, $v_{\pi'}(s) \ge v_\pi(s)$ everywhere.

---

### Example 9.6: Truncated Policy Iteration (Modified Policy Iteration)
In Modified Policy Iteration (Puterman & Shin 1978), Policy Evaluation is stopped after $m$ iterative sweeps rather than running to full convergence ($\theta$).
Let $m = 1$. Trace how Modified Policy Iteration differs from Value Iteration.

#### Solution:
When $m = 1$, each iteration executes:
1. One sweep of policy evaluation: $v_{k+1/2}(s) = r(s, \pi_k(s)) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^{\pi_k(s)} v_k(s')$.
2. One greedy policy update: $\pi_{k+1}(s) = \arg\max_a [r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_{k+1/2}(s')]$.
If step 1 and step 2 are collapsed into a single step:
$$v_{k+1}(s) = \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_k(s') \right]$$
This is **Value Iteration**! Modified Policy Iteration with $m = 1$ is mathematically identical to Value Iteration. Value Iteration is simply Policy Iteration with the evaluation phase truncated to a single sweep.

---

### Example 9.7: Monotonicity of Successive Policy Values
Prove that for any sequence of policies $\pi_0, \pi_1, \pi_2, \dots$ generated by exact Policy Iteration:
$$v_{\pi_0}(s) \le v_{\pi_1}(s) \le v_{\pi_2}(s) \le \dots \le v^*(s), \quad \forall s \in \mathcal{S}$$

#### Solution:
By the Policy Improvement Theorem (Section 9.2):
At every iteration $k$, the greedy policy satisfies $q_{\pi_k}(s, \pi_{k+1}(s)) \ge v_{\pi_k}(s)$, which guarantees:
$$v_{\pi_k}(s) \le v_{\pi_{k+1}}(s), \quad \forall s \in \mathcal{S}$$
Furthermore, since $v^*(s) = \max_\pi v_\pi(s)$ by definition, $v_{\pi_k}(s) \le v^*(s)$ for all $k$.
Thus, the sequence $\{v_{\pi_k}(s)\}$ is a monotonically non-decreasing sequence bounded above by $v^*(s)$ for every state $s$.

---

### Example 9.8: Policy Oscillation with Stale Values
Suppose an asynchronous algorithm updates policy $\pi$ in state $s_1$ using a value function that was computed 100 iterations ago for state $s_2$.
Explain why the Policy Improvement Theorem may fail to guarantee $v_{\pi'} \ge v_\pi$ when values are stale or inaccurate.

#### Solution:
The Policy Improvement Theorem premise explicitly requires:
$$q_\pi(s, \pi'(s)) \ge v_\pi(s)$$
where $q_\pi$ is computed using the **true** value function $v_\pi$ of policy $\pi$.
If stale or estimated values $\hat{v} \neq v_\pi$ are used, an action that appears greedy under $\hat{v}$ may actually satisfy $q_\pi(s, \pi'(s)) < v_\pi(s)$ under the true values. In this case, the premise of the theorem is violated, and the new policy $\pi'$ can perform strictly worse than $\pi$.

---

### Example 9.9: Action Elimination in Large Action Spaces
In an MDP with $|\mathcal{A}| = 1,000$ actions per state, evaluating all actions at every policy improvement step is expensive.
Explain how an upper bound $\hat{q}(s, a)$ on action values can safely prune sub-optimal actions without sacrificing optimality.

#### Solution:
Let $q_{\max} = \max_{a \in \mathcal{A}_{\text{eval}}} q(s, a)$ be the best action-value evaluated so far in state $s$.
If for some candidate action $a'$, we can compute a cheap upper bound $\bar{q}(s, a') \ge q(s, a')$:
$$\text{If } \bar{q}(s, a') < q_{\max} \implies q(s, a') < q_{\max}$$
Action $a'$ is mathematically guaranteed to be strictly sub-optimal. It can be immediately eliminated without performing expensive transition calculations or successor state lookups.

---

### Example 9.10: Computational Complexity Comparison: PI vs Direct Inversion
Compare the computational complexity of Policy Iteration against brute-force policy search for an MDP with $N = 100$ states and $|\mathcal{A}| = 4$ actions, assuming Policy Iteration converges in 5 iterations and uses Gaussian elimination ($O(N^3)$) for evaluation.

#### Solution:
- **Brute-Force Policy Evaluation:**
  There are $4^{100} \approx 1.6 \times 10^{60}$ deterministic policies.
  Evaluating each via Gaussian elimination ($100^3 = 10^6$ ops):
  $$\text{Total Ops} \approx 1.6 \times 10^{60} \times 10^6 = 1.6 \times 10^{66} \text{ FLOPs} \quad (\text{Impossible})$$
- **Policy Iteration:**
  Each iteration requires:
  - Evaluation: $10^6$ ops.
  - Improvement: $N \times |\mathcal{A}| = 100 \times 4 = 400$ ops.
  For 5 iterations:
  $$\text{Total Ops} \approx 5 \times (10^6 + 400) \approx 5 \times 10^6 \text{ FLOPs} \quad (\approx 5 \text{ milliseconds!})$$
Policy Iteration reduces the time from longer than the age of the universe to a few milliseconds.

---

## 9.7 Solved Exercises

### Exercise 9.1: Verification of Policy Improvement Condition
If $v_\pi(s) = 8.0$, and the available action qualities in state $s$ are $q_\pi(s, a_1) = 6.0, q_\pi(s, a_2) = 8.0, q_\pi(s, a_3) = 11.5$, which action will greedy policy improvement select, and what is the advantage $A_\pi(s, \pi'(s))$?

#### Solution:
$$\pi'(s) = \arg\max(6.0, 8.0, 11.5) = a_3$$
$$A_\pi(s, a_3) = q_\pi(s, a_3) - v_\pi(s) = 11.5 - 8.0 = +3.5$$

---

### Exercise 9.2: Stability Check
If for all states $s \in \mathcal{S}$, $\arg\max_a q_\pi(s, a) = \pi(s)$, what does the Policy Improvement Theorem imply about policy $\pi$?

#### Solution:
It implies that no action can strictly improve value over $\pi(s)$, which means $v_\pi(s) = \max_a q_\pi(s, a)$ everywhere. This satisfies the Bellman Optimality Equation. Policy $\pi$ is globally optimal: $\pi = \pi^*$.

---

### Exercise 9.3: Minimum Value Increase
Suppose that at state $s_0$, $q_\pi(s_0, \pi'(s_0)) = v_\pi(s_0) + \epsilon$, with $\epsilon > 0$, and for all other states $s \neq s_0$, $q_\pi(s, \pi'(s)) = v_\pi(s)$.
Prove that $v_{\pi'}(s_0) \ge v_\pi(s_0) + \epsilon$.

#### Solution:
From the proof of the Policy Improvement Theorem:
$$v_{\pi'}(s_0) = q_\pi(s_0, \pi'(s_0)) + \sum_{k=1}^\infty \gamma^k \mathbb{E}_{\pi'} [q_\pi(S_{t+k}, \pi'(S_{t+k})) - v_\pi(S_{t+k}) \mid S_t = s_0]$$
Since $q_\pi(s, \pi'(s)) - v_\pi(s) \ge 0$ for all states:
$$v_{\pi'}(s_0) \ge q_\pi(s_0, \pi'(s_0)) + 0 = v_\pi(s_0) + \epsilon$$

---

### Exercise 9.4: Number of Policy Changes
In an MDP with 10 states and 2 actions, what is the maximum number of times the policy can change before Policy Iteration terminates?

#### Solution:
The number of distinct policies is $2^{10} = 1024$.
Since no policy can be visited twice, the policy can change at most $1024 - 1 = 1023$ times.

---

### Exercise 9.5: Policy Evaluation Stopping Precision
Why does Policy Iteration not require policy evaluation to converge to machine epsilon ($10^{-16}$) to perform a successful policy improvement step?

#### Solution:
Because greedy policy improvement depends only on the relative argmax ordering of actions ($\arg\max_a q(s, a)$), not on the precise numerical decimal values. As long as the evaluation error is smaller than the gap between the best action and the second-best action ($\|v - v_\pi\|_\infty < \frac{1}{2} \min_s [q(s, a^*) - q(s, a_{\text{sub}})]$), the policy improvement step produces the exact same optimal policy.

---

### Exercise 9.6: Cyclic Policy Improvement Hazard
Can Policy Iteration enter an infinite cycle if there are no ties in action values?

#### Solution:
No. If there are no ties, every non-terminal improvement step produces a strictly higher value function for at least one state: $v_{\pi_{k+1}} > v_{\pi_k}$. Since values are strictly monotonically increasing, no previous policy can ever achieve equal or higher value, rendering cycles impossible.

---

### Exercise 9.7: Policy Iteration on absorbing MRP
If an MDP has only 1 action in every state ($|\mathcal{A}(s)| = 1, \forall s$), how many iterations does Policy Iteration require to terminate?

#### Solution:
Exactly 1 iteration. The initial policy $\pi_0$ is the only valid policy. It is evaluated, the improvement step finds no alternative actions, detects $\pi_1 = \pi_0$, and terminates immediately.

---

### Exercise 9.8: Value Divergence Check in Policy Improvement
Can a greedy policy improvement step ever decrease the value function of any state?

#### Solution:
No. The Policy Improvement Theorem guarantees that $v_{\pi'}(s) \ge v_\pi(s)$ simultaneously across all states $s \in \mathcal{S}$. Degradation is mathematically impossible under exact evaluation.

---

### Exercise 9.9: Deterministic Policy Representation in Code
Write a 1-line TypeScript type signature representing a deterministic policy over generic state type `S` and action type `A`.

#### Solution:
```typescript
type DeterministicPolicy<S, A> = (state: S) => A;
```
or tabularly:
```typescript
type TabularPolicy<S extends string | number, A> = Record<S, A>;
```

---

### Exercise 9.10: Generalized Policy Iteration Synergy
Summarize in one sentence the core synergy between Policy Evaluation and Policy Improvement in GPI.

#### Solution:
Policy Evaluation makes the value function consistent with the current policy, while Policy Improvement makes the policy greedy with respect to the current value function, driving both iteratively toward mutual consistency at the optimal solution $(v^*, \pi^*)$.
