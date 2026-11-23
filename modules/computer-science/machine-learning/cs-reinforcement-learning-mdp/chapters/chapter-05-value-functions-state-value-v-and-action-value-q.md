# Chapter 5: Value Functions: The State-Value Function $V(s)$ and Action-Value Function $Q(s, a)$

---

## 5.1 The Teleological Necessity of Value

In the physical world, an immediate sensation tells an animal only what is happening to its sensory receptors *at this instant*. Pain signals cell damage; sweet taste signals glucose ingestion. But an animal that maximizes only immediate pleasure will quickly perish: a mouse that eats poison-laced peanut butter experiences intense pleasure for two minutes before dying.

To survive and flourish, an intelligent agent requires a mental simulation engine that projects immediate sensations into the distant future. This engine computes what economists call **Expected Utility** and what reinforcement learning formalizes as **Value**.

```
                        THE DUAL REALMS OF EVALUATION
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
 ┌───────────────────────┐                             ┌───────────────────────┐
 │     IMMEDIATE VALENCE │                             │     LONG-TERM VALUE   │
 │        Reward R       │                             │       V(s) or Q(s, a) │
 ├───────────────────────┤                             ├───────────────────────┤
 │ • Emitted by Env      │                             │ • Synthesized by Agent│
 │ • Ephemeral sensation │                             │ • Infinite projection │
 │ • "What just happened"│                             │ • "What lies ahead"   │
 │ • Local feedback      │                             │ • Global potential    │
 └───────────────────────┘                             └───────────────────────┘
```

A **Value Function** answers the fundamental operational question:
> *"If I find myself in state $s$ (or take action $a$ from state $s$) and continue making decisions according to my current strategy $\pi$ for the rest of my operational lifetime, how much total discounted reward do I expect to accumulate?"*

---

## 5.2 The State-Value Function: $v_\pi(s)$

Let an agent be embedded in an MDP $\mathcal{M} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$ following a stationary policy $\pi(a \mid s)$.

### Formal Definition
The **State-Value Function** $v_\pi: \mathcal{S} \to \mathbb{R}$ is the expected return starting from state $s$ at time step $t$ and following policy $\pi$ thereafter:

$$v_\pi(s) \doteq \mathbb{E}_\pi [G_t \mid S_t = s] = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right]$$

For an episodic task terminating at time step $T$:
$$v_\pi(s) \doteq \mathbb{E}_\pi \left[ \sum_{k=0}^{T - t - 1} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right]$$

### Boundary Conditions
By axiomatic definition, the value of an absorbing terminal state $s_{\text{term}}$ is always identically zero:
$$v_\pi(s_{\text{term}}) = 0, \quad \forall \pi$$
This boundary condition anchors all dynamic programming recursions.

### State Value as a Potential Field
In physics, a gravitational or electrostatic potential field $\Phi(\mathbf{x})$ assigns a scalar to every point in space such that particles accelerate along the negative gradient $-\nabla \Phi$. 
In reinforcement learning, the state-value function $v_\pi(s)$ acts as a **decision potential field**:
- High-value states represent peaks of safety, resources, or proximity to goals.
- Low-value states represent valleys of energy expenditure, hazard, or dead ends.
- An optimal agent navigates by ascending the gradient of the value field.

```
       VALUE POTENTIAL LANDSCAPE OVER A 1D MAZE
  V(s)
   10 │                                              [GOAL: +10]
    8 │                                             /
    6 │                                     ┌──────┘ (s_4: V = 8.1)
    4 │                             ┌───────┘ (s_3: V = 6.4)
    2 │                     ┌───────┘ (s_2: V = 4.8)
    0 │ ─────► ┌────────────┘ (s_1: V = 3.2)
   -2 │        │ [TRAP: -10]
      └────────┴──────────────────────────────────────────► State Coordinate s
              s_0
```

---

## 5.3 The Action-Value Function: $q_\pi(s, a)$

While $v_\pi(s)$ measures how desirable it is to *be* in state $s$, it does not directly tell an agent *which action to execute next*. To evaluate competing alternatives, the agent requires a granular action-specific metric.

### Formal Definition
The **Action-Value Function** (frequently termed the **Q-Function**, where $Q$ stands for *Quality*) $q_\pi: \mathcal{S} \times \mathcal{A} \to \mathbb{R}$ is the expected return starting from state $s$, executing an arbitrary action $a$, and *thereafter* following policy $\pi$:

$$q_\pi(s, a) \doteq \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a] = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s, A_t = a \right]$$

> [!IMPORTANT]
> **The Critical Distinction:** In $q_\pi(s, a)$, the first action $a$ is **not** drawn from policy $\pi$. It is forced upon the system by external intervention. Only from time step $t+1$ onward does the agent resume following policy $\pi$. This allows the agent to ask "what if" counterfactual questions: *"What would happen if I took this sub-optimal or exploratory action right now, but played my regular policy thereafter?"*

---

## 5.4 The Fundamental Algebraic Bridges Between $V$ and $Q$

The state-value function $v_\pi(s)$ and the action-value function $q_\pi(s, a)$ are not isolated mathematical entities; they are intimately connected by two fundamental algebraic bridges:

```
                          THE V ◄──► Q ALGEBRAIC CYCLE
                                       
                                      (s)  State Node
                                     /   \
                             π(a_1) /     \ π(a_2)
                                   ▼       ▼
                          Q(s, a_1)●       ● Q(s, a_2)  Action Nodes
                                   \       /
                            r + γ   \     / r + γ
                                     ▼   ▼
                                      (s') Next State Node
```

### Bridge 1: Expressing $v_\pi(s)$ in terms of $q_\pi(s, a)$
The value of a state $s$ is simply the policy-weighted expectation of the action-values available in that state:

$$v_\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) q_\pi(s, a) = \mathbb{E}_{a \sim \pi(\cdot \mid s)} [q_\pi(s, a)]$$

- If policy $\pi$ is deterministic ($a^* = \pi(s)$), then:
  $$v_\pi(s) = q_\pi(s, \pi(s))$$

### Bridge 2: Expressing $q_\pi(s, a)$ in terms of $v_\pi(s')$
The value of taking action $a$ in state $s$ is the immediate expected reward plus the discounted expected value of the successor states:

$$q_\pi(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_\pi(s')$$

By substituting Bridge 2 into Bridge 1, we obtain the recursive Bellman equation for $v_\pi(s)$.
By substituting Bridge 1 into Bridge 2, we obtain the recursive Bellman equation for $q_\pi(s, a)$.

---

## 5.5 The Advantage Function: $A_\pi(s, a)$

In many modern reinforcement learning paradigms (such as Dueling DQN, A2C, and PPO), working directly with raw Q-values introduces unnecessary numerical variance. To isolate the relative superiority of an individual action, we define the **Advantage Function**.

### Formal Definition
The Advantage function $A_\pi: \mathcal{S} \times \mathcal{A} \to \mathbb{R}$ is the difference between the action-value of a specific action $a$ and the baseline state-value of state $s$:

$$A_\pi(s, a) \doteq q_\pi(s, a) - v_\pi(s)$$

### Interpretation
- **$A_\pi(s, a) > 0$:** Action $a$ performs strictly better than the expected performance of policy $\pi$ in state $s$.
- **$A_\pi(s, a) < 0$:** Action $a$ performs strictly worse than average.
- **$A_\pi(s, a) = 0$:** Action $a$ performs exactly equal to the average policy performance.

### The Zero-Mean Advantage Property
Under policy $\pi$, the expected advantage in any state is identically zero:
$$\mathbb{E}_{a \sim \pi(\cdot \mid s)} [A_\pi(s, a)] = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) [q_\pi(s, a) - v_\pi(s)] = \sum_{a} \pi(a \mid s) q_\pi(s, a) - v_\pi(s) \sum_a \pi(a \mid s)$$
$$= v_\pi(s) - v_\pi(s)(1) = 0$$

---

## 5.6 Worked Examples: Value and Action-Value Calculations

### Example 5.1: Computing $V(s)$ from a Known Q-Table
In an MDP with states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2, a_3\}$, an agent has computed the following Q-table:

| State | $q(s, a_1)$ | $q(s, a_2)$ | $q(s, a_3)$ |
| :---: | :---: | :---: | :---: |
| $s_1$ | $+10.0$ | $+4.0$ | $-2.0$ |
| $s_2$ | $+0.0$ | $+6.0$ | $+8.0$ |

Compute $v_\pi(s_1)$ and $v_\pi(s_2)$ under:
1. Deterministic policy $\pi_{\text{greedy}}$ that chooses $\arg\max_a q(s, a)$.
2. Uniform random policy $\pi_{\text{rand}}(a \mid s) = \frac{1}{3}$.
3. $\epsilon$-greedy policy with $\epsilon = 0.30$.

#### Solution:
**1. Deterministic Greedy Policy:**
- For $s_1$: $\arg\max_a q(s_1, a) = a_1 \implies v_{\text{greedy}}(s_1) = q(s_1, a_1) = +10.0$.
- For $s_2$: $\arg\max_a q(s_2, a) = a_3 \implies v_{\text{greedy}}(s_2) = q(s_2, a_3) = +8.0$.

**2. Uniform Random Policy ($\pi(a \mid s) = \frac{1}{3}$):**
- $v_{\text{rand}}(s_1) = \frac{1}{3}(10.0) + \frac{1}{3}(4.0) + \frac{1}{3}(-2.0) = \frac{12.0}{3} = +4.0$.
- $v_{\text{rand}}(s_2) = \frac{1}{3}(0.0) + \frac{1}{3}(6.0) + \frac{1}{3}(8.0) = \frac{14.0}{3} \approx +4.667$.

**3. $\epsilon$-Greedy Policy ($\epsilon = 0.30$, 3 actions):**
The greedy action gets probability $1 - \epsilon + \frac{\epsilon}{3} = 1 - 0.30 + 0.10 = 0.80$.
Each non-greedy action gets probability $\frac{\epsilon}{3} = \frac{0.30}{3} = 0.10$.
- For $s_1$:
  $$v_{\epsilon}(s_1) = (0.80)(10.0) + (0.10)(4.0) + (0.10)(-2.0) = 8.0 + 0.40 - 0.20 = +8.20$$
- For $s_2$:
  $$v_{\epsilon}(s_2) = (0.10)(0.0) + (0.10)(6.0) + (0.80)(8.0) = 0.0 + 0.60 + 6.40 = +7.00$$

---

### Example 5.2: Computing $Q(s, a)$ from Known Successor State Values
An autonomous delivery vehicle is at intersection $s$. It can turn Left ($a_L$) or Right ($a_R$).
- Action $a_L$: incurs fuel cost $R = -1.0$. Transitions to state $s_1$ with prob $0.80$, and to $s_2$ with prob $0.20$.
- Action $a_R$: incurs fuel cost $R = -0.5$. Transitions to state $s_2$ with prob $0.60$, and to $s_3$ with prob $0.40$.

From previous calculations, the state values are known:
$$v_\pi(s_1) = +25.0, \quad v_\pi(s_2) = +10.0, \quad v_\pi(s_3) = +40.0$$
Let $\gamma = 0.90$.
Compute $q_\pi(s, a_L)$ and $q_\pi(s, a_R)$.

#### Solution:
Using Bridge 2: $q_\pi(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_\pi(s')$.

**For Action $a_L$:**
$$q_\pi(s, a_L) = -1.0 + 0.90 \left[ 0.80 v_\pi(s_1) + 0.20 v_\pi(s_2) \right]$$
$$= -1.0 + 0.90 \left[ (0.80)(25.0) + (0.20)(10.0) \right] = -1.0 + 0.90 [20.0 + 2.0] = -1.0 + 0.90(22.0) = -1.0 + 19.8 = +18.8$$

**For Action $a_R$:**
$$q_\pi(s, a_R) = -0.5 + 0.90 \left[ 0.60 v_\pi(s_2) + 0.40 v_\pi(s_3) \right]$$
$$= -0.5 + 0.90 \left[ (0.60)(10.0) + (0.40)(40.0) \right] = -0.5 + 0.90 [6.0 + 16.0] = -0.5 + 0.90(22.0) = -0.5 + 19.8 = +19.3$$

Even though $a_R$ leads to $s_2$ with high probability, the possibility of reaching high-value state $s_3$ ($+40$) combined with lower immediate fuel cost makes $a_R$ superior ($q = 19.3 > 18.8$).

---

### Example 5.3: Computing the Advantage Table and Verifying Zero Mean
Using the Q-table and state values from Example 5.1 under the $\epsilon$-greedy policy ($\epsilon = 0.30$):
For state $s_1$: $q(s_1, a_1) = 10.0, q(s_1, a_2) = 4.0, q(s_1, a_3) = -2.0$, and $v(s_1) = 8.20$.
Action probabilities are $\pi(a_1 \mid s_1) = 0.80, \pi(a_2 \mid s_1) = 0.10, \pi(a_3 \mid s_1) = 0.10$.

1. Compute the advantage $A_\pi(s_1, a)$ for all three actions.
2. Verify that the expectation $\mathbb{E}_{a \sim \pi}[A_\pi(s_1, a)] = 0$.

#### Solution:
**Step 1: Compute Advantages:**
- $A_\pi(s_1, a_1) = q(s_1, a_1) - v(s_1) = 10.0 - 8.20 = +1.80$
- $A_\pi(s_1, a_2) = q(s_1, a_2) - v(s_1) = 4.0 - 8.20 = -4.20$
- $A_\pi(s_1, a_3) = q(s_1, a_3) - v(s_1) = -2.0 - 8.20 = -10.20$

**Step 2: Verify Expectation:**
$$\mathbb{E}_{a \sim \pi}[A_\pi(s_1, a)] = \pi(a_1 \mid s_1) A(s_1, a_1) + \pi(a_2 \mid s_1) A(s_1, a_2) + \pi(a_3 \mid s_1) A(s_1, a_3)$$
$$= (0.80)(+1.80) + (0.10)(-4.20) + (0.10)(-10.20)$$
$$= +1.44 - 0.42 - 1.02 = 1.44 - 1.44 = 0.000 \quad \checkmark$$

---

### Example 5.4: Value Function of a Random Walk on a Line
Consider a 5-state Markov Reward Process:
$$\text{Term}_L \longleftrightarrow s_1 \longleftrightarrow s_2 \longleftrightarrow s_3 \longleftrightarrow \text{Term}_R$$
- States $\mathcal{S} = \{s_1, s_2, s_3\}$.
- From any state $s_i$, the agent moves Left with prob $0.5$ and Right with prob $0.5$.
- Reaching $\text{Term}_L$ yields $R = 0$.
- Reaching $\text{Term}_R$ yields $R = +1$.
- All internal transitions yield $R = 0$.
- Let $\gamma = 1.0$ (undiscounted episodic task).

Write the system of linear equations for $v(s_1), v(s_2), v(s_3)$ and solve analytically.

#### Solution:
By Bridge 1 and 2:
$$v(s_1) = 0.5(0) + 0.5 v(s_2) = 0.5 v(s_2)$$
$$v(s_2) = 0.5 v(s_1) + 0.5 v(s_3)$$
$$v(s_3) = 0.5 v(s_2) + 0.5(1) = 0.5 v(s_2) + 0.5$$

Substitute $v(s_1) = 0.5 v(s_2)$ and $v(s_3) = 0.5 v(s_2) + 0.5$ into the equation for $v(s_2)$:
$$v(s_2) = 0.5(0.5 v(s_2)) + 0.5(0.5 v(s_2) + 0.5) = 0.25 v(s_2) + 0.25 v(s_2) + 0.25 = 0.5 v(s_2) + 0.25$$
$$0.5 v(s_2) = 0.25 \implies v(s_2) = 0.50$$

Back-substitute:
$$v(s_1) = 0.5(0.50) = 0.25$$
$$v(s_3) = 0.5(0.50) + 0.50 = 0.75$$

The values $[0.25, 0.50, 0.75]$ form a linear ramp, reflecting the probability of exiting through the right-hand terminal state $\text{Term}_R$.

---

### Example 5.5: Value Function Under Stochastic Termination
Consider a single non-terminal state $s$ with action $a$.
At each step, taking action $a$ yields immediate reward $R = +10.0$.
With probability $p_{\text{term}} = 0.05$, the environment terminates.
With probability $1 - p_{\text{term}} = 0.95$, the agent remains in state $s$.
Let $\gamma = 0.98$.
Compute the exact value $v(s)$.

#### Solution:
The Bellman equation for $v(s)$ is:
$$v(s) = r(s) + \gamma \sum_{s'} \mathcal{P}_{s, s'} v(s')$$
Since the terminal state has value $v(s_{\text{term}}) = 0$:
$$v(s) = 10.0 + \gamma \left[ (1 - p_{\text{term}}) v(s) + p_{\text{term}} (0) \right]$$
$$v(s) = 10.0 + \gamma (1 - p_{\text{term}}) v(s)$$
Subtracting $\gamma (1 - p_{\text{term}}) v(s)$ from both sides:
$$v(s) [1 - \gamma(1 - p_{\text{term}})] = 10.0$$
$$v(s) = \frac{10.0}{1 - (0.98)(0.95)} = \frac{10.0}{1 - 0.931} = \frac{10.0}{0.069} \approx 144.928$$

---

### Example 5.6: Value Difference Between Two Competing Policies
In a 2-state MDP, an engineer evaluates two policies $\pi_A$ and $\pi_B$.
- Under $\pi_A$: $v_{\pi_A}(s_1) = 100.0, \quad v_{\pi_A}(s_2) = 50.0$.
- Under $\pi_B$: $v_{\pi_B}(s_1) = 80.0, \quad v_{\pi_B}(s_2) = 90.0$.

Can we assert that policy $\pi_A$ is strictly better than $\pi_B$? Explain using the partial ordering of MDP policies.

#### Solution:
In MDP theory, a policy $\pi$ is defined to be better than or equal to $\pi'$ ($\pi \ge \pi'$) if and only if:
$$v_\pi(s) \ge v_{\pi'}(s), \quad \forall s \in \mathcal{S}$$
Here:
- At state $s_1$: $v_{\pi_A}(s_1) = 100.0 > 80.0 = v_{\pi_B}(s_1)$.
- At state $s_2$: $v_{\pi_A}(s_2) = 50.0 < 90.0 = v_{\pi_B}(s_2)$.
Neither policy dominates the other across all states. Thus, $\pi_A$ and $\pi_B$ are **incomparable** under the standard partial order. Which policy is preferred depends entirely on the initial state distribution $\mu_0$:
- If $\mu_0 = [1, 0]$ (always start in $s_1$), $\pi_A$ is preferred ($\mathbb{E}[v] = 100 > 80$).
- If $\mu_0 = [0, 1]$ (always start in $s_2$), $\pi_B$ is preferred ($\mathbb{E}[v] = 90 > 50$).

---

### Example 5.7: Computing Q from Sample Trajectories (Monte Carlo Estimation)
An agent executes 3 independent episodes from state $s$ with action $a$, recording the following returns:
- Episode 1: $G = +14.0$
- Episode 2: $G = +18.0$
- Episode 3: $G = +10.0$

1. Compute the sample-average Monte Carlo estimate $\hat{q}(s, a)$.
2. Compute the sample variance $s^2$ of this estimate.
3. Compute the standard error of the mean $\text{SE} = \frac{s}{\sqrt{N}}$.

#### Solution:
**Step 1: Sample Mean:**
$$\hat{q}(s, a) = \frac{1}{3}(14.0 + 18.0 + 10.0) = \frac{42.0}{3} = 14.0$$

**Step 2: Sample Variance:**
$$s^2 = \frac{1}{N - 1} \sum_{i=1}^3 (G_i - \bar{G})^2 = \frac{1}{2} \left[ (14 - 14)^2 + (18 - 14)^2 + (10 - 14)^2 \right]$$
$$s^2 = \frac{1}{2} [0 + 16 + 16] = \frac{32}{2} = 16.0 \implies s = \sqrt{16} = 4.0$$

**Step 3: Standard Error:**
$$\text{SE} = \frac{s}{\sqrt{N}} = \frac{4.0}{\sqrt{3}} \approx \frac{4.0}{1.732} \approx 2.309$$
The estimated Q-value is $14.0 \pm 2.31$.

---

### Example 5.8: The Dueling Architecture Identity
In deep reinforcement learning, the Dueling DQN architecture (Wang et al., 2016) estimates state values $V(s)$ and advantages $A(s, a)$ with separate neural heads, combining them via:
$$Q(s, a) = V(s) + \left( A(s, a) - \frac{1}{|\mathcal{A}|} \sum_{a' \in \mathcal{A}} A(s, a') \right)$$
Suppose a dueling network outputs scalar $V(s) = 5.0$ and advantage vector $\mathbf{A}(s) = [1.0, 3.0, 2.0]$.
Compute the resulting Q-values $Q(s, a_1), Q(s, a_2), Q(s, a_3)$.

#### Solution:
Mean advantage across all actions:
$$\bar{A}(s) = \frac{1}{3}(1.0 + 3.0 + 2.0) = \frac{6.0}{3} = 2.0$$
Subtract the mean from each advantage:
- $\tilde{A}(s, a_1) = 1.0 - 2.0 = -1.0$
- $\tilde{A}(s, a_2) = 3.0 - 2.0 = +1.0$
- $\tilde{A}(s, a_3) = 2.0 - 2.0 = 0.0$
Add $V(s) = 5.0$:
- $Q(s, a_1) = 5.0 + (-1.0) = 4.0$
- $Q(s, a_2) = 5.0 + (+1.0) = 6.0$
- $Q(s, a_3) = 5.0 + 0.0 = 5.0$

Notice: $\frac{1}{3}(4.0 + 6.0 + 5.0) = \frac{15.0}{3} = 5.0 = V(s)$, preserving the fundamental identity that $V(s)$ represents the baseline expected value.

---

### Example 5.9: Action Selection Under Uncertain Q-Values
An agent maintains Gaussian belief distributions over the action-values of two actions:
- $Q(s, a_1) \sim \mathcal{N}(\mu_1 = 10.0, \sigma_1^2 = 1.0)$
- $Q(s, a_2) \sim \mathcal{N}(\mu_2 = 8.0, \sigma_2^2 = 9.0)$

1. Under greedy selection $\arg\max \mu_a$, which action is chosen?
2. Under Upper Confidence Bound (UCB) selection $a_{\text{UCB}} = \arg\max (\mu_a + 2\sigma_a)$, which action is chosen?
3. What is the probability that $a_2$ is actually superior to $a_1$ ($\mathbb{P}(Q_2 > Q_1)$)?

#### Solution:
**1. Greedy Selection:**
$$\mu_1 = 10.0 > 8.0 = \mu_2 \implies \text{Chooses } a_1$$

**2. UCB Selection:**
- $\text{UCB}(a_1) = 10.0 + 2\sqrt{1.0} = 10.0 + 2.0 = 12.0$
- $\text{UCB}(a_2) = 8.0 + 2\sqrt{9.0} = 8.0 + 2(3.0) = 8.0 + 6.0 = 14.0$
Since $14.0 > 12.0$, UCB chooses $a_2$ to explore its high epistemic uncertainty.

**3. Probability $\mathbb{P}(Q_2 > Q_1)$:**
Define difference variable $D = Q_2 - Q_1$. Since both are independent Gaussians:
$$\mu_D = \mu_2 - \mu_1 = 8.0 - 10.0 = -2.0$$
$$\sigma_D^2 = \sigma_2^2 + \sigma_1^2 = 9.0 + 1.0 = 10.0 \implies \sigma_D = \sqrt{10} \approx 3.162$$
We seek $\mathbb{P}(D > 0)$:
$$z = \frac{0 - \mu_D}{\sigma_D} = \frac{0 - (-2.0)}{3.162} = \frac{2.0}{3.162} \approx 0.6325$$
Using the standard normal CDF $\Phi(z)$:
$$\mathbb{P}(D > 0) = 1 - \Phi(0.6325) \approx 1 - 0.7365 = 0.2635$$
There is a $26.35\%$ chance that $a_2$ is strictly better than $a_1$.

---

### Example 5.10: Value Function Invariance to Constant Offset
Suppose all state values are shifted by a constant $c \in \mathbb{R}$: $\tilde{v}(s) = v(s) + c$.
Prove that the resulting advantages $\tilde{A}(s, a)$ and greedy action rankings are completely unaffected.

#### Solution:
From Bridge 2:
$$\tilde{q}(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a \tilde{v}(s') = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a [v(s') + c]$$
Since $\sum_{s'} \mathcal{P}_{s, s'}^a = 1$:
$$\tilde{q}(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') + \gamma c = q(s, a) + \gamma c$$
Now evaluate the shifted advantage:
$$\tilde{A}(s, a) = \tilde{q}(s, a) - \tilde{v}(s) = [q(s, a) + \gamma c] - [v(s) + c] = q(s, a) - v(s) - (1 - \gamma) c = A(s, a) - (1 - \gamma) c$$
Because the subtracted term $(1 - \gamma) c$ is a constant identical for all actions in state $s$:
$$\arg\max_a \tilde{A}(s, a) = \arg\max_a [A(s, a) - (1 - \gamma)c] = \arg\max_a A(s, a)$$
The relative ranking between actions is preserved invariant.

---

## 5.7 Solved Exercises

### Exercise 5.1: State Value from Two Actions
State $s$ has two actions: $q(s, a_1) = 20, q(s, a_2) = -10$.
If the policy chooses $a_1$ with probability $0.75$, compute $v_\pi(s)$.

#### Solution:
$$v_\pi(s) = 0.75(20) + 0.25(-10) = 15 - 2.5 = 12.5$$

---

### Exercise 5.2: Finding Action-Value from Known Destination
Action $a$ taken in state $s$ gives reward $R = 5$ and deterministically transitions to state $s'$ with known value $v(s') = 100$.
If $\gamma = 0.95$, compute $q(s, a)$.

#### Solution:
$$q(s, a) = 5 + (0.95)(100) = 5 + 95 = 100.0$$

---

### Exercise 5.3: Advantage Sign Verification
If $v_\pi(s) = 14.0$ and $q_\pi(s, a^*) = 18.0$, what is $A_\pi(s, a^*)$? Is this action above or below average?

#### Solution:
$$A_\pi(s, a^*) = 18.0 - 14.0 = +4.0$$
Since $A_\pi(s, a^*) > 0$, this action is strictly above average.

---

### Exercise 5.4: Value of Absorbing Penalty State
An agent enters a trap state $s_{\text{trap}}$ where it remains forever, receiving $R = -2.0$ at every step.
If $\gamma = 0.9$, compute $v(s_{\text{trap}})$.

#### Solution:
$$v(s_{\text{trap}}) = \frac{R}{1 - \gamma} = \frac{-2.0}{1 - 0.9} = \frac{-2.0}{0.1} = -20.0$$

---

### Exercise 5.5: Relationship Between Maximum Q and Optimal V
Prove that for any state $s$:
$$v^*(s) = \max_{a \in \mathcal{A}(s)} q^*(s, a)$$

#### Solution:
By definition, $v^*(s) = \max_\pi v_\pi(s) = \max_\pi \sum_a \pi(a \mid s) q^*(s, a)$.
A convex combination $\sum_a w_a x_a$ with $\sum_a w_a = 1, w_a \ge 0$ is maximized by placing all weight on the maximal element: $\max_{\mathbf{w}} \sum_a w_a x_a = \max_a x_a$.
Therefore, choosing a deterministic policy that places probability 1 on $\arg\max_a q^*(s, a)$ achieves:
$$v^*(s) = \max_{a \in \mathcal{A}(s)} q^*(s, a)$$

---

### Exercise 5.6: Advantage Sum Constraint
In a state with 4 actions, advantages are $A(s, a_1) = +2.0, A(s, a_2) = +1.0, A(s, a_3) = -1.0$.
Under a uniform policy ($\pi(a \mid s) = 0.25$), find the advantage of the fourth action $A(s, a_4)$.

#### Solution:
Under uniform policy, $\sum_{i=1}^4 A(s, a_i) = 0$:
$$2.0 + 1.0 - 1.0 + A(s, a_4) = 0 \implies 2.0 + A(s, a_4) = 0 \implies A(s, a_4) = -2.0$$

---

### Exercise 5.7: Q-Function Redundancy
Why is it possible to choose optimal actions directly from $q^*(s, a)$ without knowing the environment transition probabilities $\mathcal{P}_{s, s'}^a$, whereas choosing optimal actions from $v^*(s)$ requires knowing $\mathcal{P}_{s, s'}^a$?

#### Solution:
To select the optimal action from $q^*$, the agent simply evaluates $\arg\max_a q^*(s, a)$—a local one-dimensional lookup.
To select the optimal action from $v^*$, the agent must compute:
$$a^* = \arg\max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s') \right]$$
This one-step lookahead explicitly requires knowledge of the transition dynamics $\mathcal{P}_{s, s'}^a$ and reward model $r(s, a)$. Thus, $q^*(s, a)$ caches the environment dynamics directly inside the value function, enabling model-free control.

---

### Exercise 5.8: Temporal Difference Error Definition
The 1-step Temporal Difference (TD) error is defined as:
$$\delta_t \doteq R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$$
Prove that if $V(s) = v_\pi(s)$, then $\mathbb{E}_\pi [\delta_t \mid S_t = s] = 0$.

#### Solution:
$$\mathbb{E}_\pi [\delta_t \mid S_t = s] = \mathbb{E}_\pi [R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s] - v_\pi(s)$$
By the Bellman expectation equation, $v_\pi(s) = \mathbb{E}_\pi [R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s]$.
Therefore:
$$\mathbb{E}_\pi [\delta_t \mid S_t = s] = v_\pi(s) - v_\pi(s) = 0$$

---

### Exercise 5.9: Action Value under Immediate Negative Penalty
An agent in state $s$ considers an action $a$ that inflicts an immediate catastrophe $R = -100$, but transitions deterministically to a paradise state $s_{\text{paradise}}$ where $v(s_{\text{paradise}}) = +500$.
If $\gamma = 0.9$, compute $q(s, a)$ and determine if the action is desirable if $v(s) = 300$.

#### Solution:
$$q(s, a) = -100 + (0.90)(500) = -100 + 450 = +350.0$$
The advantage is:
$$A(s, a) = q(s, a) - v(s) = 350.0 - 300.0 = +50.0$$
Since $q(s, a) > v(s)$, taking the action is strictly beneficial despite the immediate $-100$ penalty.

---

### Exercise 5.10: Bellman Residual Error Norm
Let $\mathbf{v} \in \mathbb{R}^N$ be an arbitrary candidate value vector.
Define the Bellman residual vector $\mathbf{r}_{\text{res}} \doteq \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v} - \mathbf{v}$.
What is the value of $\|\mathbf{r}_{\text{res}}\|_\infty$ if and only if $\mathbf{v} = \mathbf{v}_\pi$?

#### Solution:
By the Bellman expectation equation in matrix form, $\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi \iff \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi - \mathbf{v}_\pi = \mathbf{0}$.
Therefore, $\|\mathbf{r}_{\text{res}}\|_\infty = 0$ if and only if $\mathbf{v} = \mathbf{v}_\pi$. For any non-exact estimate, the norm $\|\mathbf{r}_{\text{res}}\|_\infty > 0$ provides a direct measure of estimation error.
