# Chapter 4: Policies and State-Transition Dynamics

---

## 4.1 The Concept of a Policy: Deterministic vs. Stochastic Mappings

At the heart of an autonomous agent lies its decision-making core: the **Policy**. 

```
                                      THE POLICY FUNCTION
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
        ┌─────────────────────────────┐                 ┌─────────────────────────────┐
        │    DETERMINISTIC POLICY     │                 │      STOCHASTIC POLICY      │
        │          a = π(s)           │                 │         π(a | s)            │
        ├─────────────────────────────┤                 ├─────────────────────────────┤
        │ • Hard, unique assignment   │                 │ • Probability distribution  │
        │ • Single action per state   │                 │ • Σ_{a} π(a | s) = 1.0      │
        │ • Natural for optimal plans │                 │ • Natural for exploration   │
        │ • Vulnerable to exploit     │                 │ • Mandatory in POMDPs /     │
        │   in multi-agent games      │                 │   imperfect information     │
        └─────────────────────────────┘                 └─────────────────────────────┘
```

Formally, a policy is a rule or mapping that specifies how an agent selects actions given its current state:

### 1. Deterministic Policies
A deterministic policy is a direct functional mapping from the state space to the action space:
$$\pi: \mathcal{S} \to \mathcal{A}$$
$$a = \pi(s)$$
Given state $s$, the agent selects action $a$ with probability 1.0. For finite state and action spaces, a deterministic policy can be represented simply as a lookup table or array of length $|\mathcal{S}|$, where the $i$-th entry contains the action index $\pi(s_i)$.

### 2. Stochastic Policies
A stochastic policy maps each state to a probability distribution over the admissible action set $\mathcal{A}(s)$:
$$\pi: \mathcal{S} \times \mathcal{A} \to [0, 1]$$
$$\pi(a \mid s) \doteq \mathbb{P}(A_t = a \mid S_t = s)$$
To be mathematically valid, $\pi(a \mid s)$ must satisfy the standard Kolmogorov probability axioms for every state $s \in \mathcal{S}$:
$$\pi(a \mid s) \ge 0, \quad \forall a \in \mathcal{A}(s)$$
$$\sum_{a \in \mathcal{A}(s)} \pi(a \mid s) = 1, \quad \forall s \in \mathcal{S}$$

### Why Do We Need Stochastic Policies?
While it is a fundamental theorem of MDP theory (proven in Chapter 7) that every finite MDP possesses at least one deterministic policy that is globally optimal, stochastic policies are indispensable in practice:
1. **Exploration During Learning:** In reinforcement learning, if an agent uses a deterministic policy before mastering the environment, it will repeatedly execute the same sequence of actions, failing to discover alternative, superior paths. Stochastic policies (such as $\epsilon$-greedy or Softmax/Boltzmann exploration) inject exploratory randomness.
2. **Partial Observability (POMDPs):** In environments with hidden states, deterministic policies can lead to infinite loops. For example, in a game of Rock-Paper-Scissors, any deterministic policy can be exploited by an adversary to achieve a 100% win rate; the unique Nash equilibrium requires a stochastic uniform policy $\pi = (\frac{1}{3}, \frac{1}{3}, \frac{1}{3})$.
3. **Differentiable Policy Search:** In continuous control and policy gradient methods (e.g. REINFORCE, PPO), policies are parameterized by neural networks $\pi_\theta(a \mid s)$ outputting the parameters of a Gaussian distribution $\mathcal{N}(\mu_\theta(s), \sigma_\theta^2(s))$. Differentiability requires continuous probability density.

---

## 4.2 Stationary vs. Non-Stationary Policies

A policy $\pi_t$ is defined to be **Stationary** (or time-invariant) if the action distribution depends exclusively on the current state $S_t$, regardless of the current time step $t$:
$$\mathbb{P}(A_t = a \mid S_t = s) = \pi(a \mid s), \quad \forall t$$

Conversely, a policy is **Non-Stationary** (or time-dependent) if the decision rule changes over time:
$$A_t \sim \pi_t(\cdot \mid S_t)$$

```
                               POLICY STATIONARITY COMPARISON
                                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              ▼                                                               ▼
 ┌──────────────────────────┐                                    ┌──────────────────────────┐
 │    STATIONARY POLICY     │                                    │  NON-STATIONARY POLICY   │
 │        π(a | s)          │                                    │       π_t(a | s)         │
 ├──────────────────────────┤                                    ├──────────────────────────┤
 │ • Time-invariant         │                                    │ • Explicitly time-indexed│
 │ • Sufficient for infinite│                                    │ • Mandatory for finite-  │
 │   horizon discounted MDPs│                                    │   horizon fixed T tasks  │
 │ • Constant state mapping │                                    │ • "10 seconds left vs    │
 │                          │                                    │    10 hours left"        │
 └──────────────────────────┘                                    └──────────────────────────┘
```

> [!NOTE]
> **Stationarity Theorem:** For any stationary, finite MDP with infinite horizon and constant discount factor $\gamma \in [0, 1)$, there exists an optimal policy that is stationary and deterministic. You never need to know the clock time $t$ if the state transition dynamics and rewards do not depend on $t$.

However, in **finite-horizon tasks** of fixed duration $T$, optimal policies are inherently non-stationary. A football team with 10 seconds remaining on the clock facing 4th-and-goal will execute a desperate Hail Mary pass, whereas with 50 minutes remaining, it would choose a conservative field goal. The time remaining $T - t$ acts as an implicit state variable. If $T - t$ is appended to the state, the policy can once again be treated as stationary over the augmented state space $\tilde{S}_t = (S_t, T - t)$.

---

## 4.3 Policy-Induced Markov Chains and MRPs

When an agent fixes its behavior according to a stationary policy $\pi$, it completely removes external decision freedom from the system. The closed-loop agent-environment composite collapses from an active Markov Decision Process into a passive **Markov Reward Process (MRP)** or **Markov Chain**.

```
    MDP UNDER ACTIVE POLICY π            COLLAPSES INTO INDUCED MRP
                                                    
          (s)                                          (s)
         /   \                                       /     \
   π(a_1)●   ● π(a_2)                 ────────►   P^π_{s,s_1} \ P^π_{s,s_2}
        / \ / \                                       ▼         ▼
      (s_1) (s_2)                                   (s_1)     (s_2)
```

### The Policy-Induced Transition Matrix $\mathbf{P}_\pi$
The probability of transitioning from state $s$ to state $s'$ under policy $\pi$ is obtained by marginalizing over all possible actions:

$$\mathcal{P}_{s, s'}^\pi \doteq \mathbb{P}(S_{t+1} = s' \mid S_t = s, \pi) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \mathcal{P}_{s, s'}^a$$

In matrix form, let $|\mathcal{S}| = N$. The policy-induced transition matrix $\mathbf{P}_\pi \in \mathbb{R}^{N \times N}$ is the convex combination of the individual action transition matrices $\mathbf{P}^a$:
$$\mathbf{P}_\pi = \sum_{a \in \mathcal{A}} \boldsymbol{\Pi}^a \mathbf{P}^a$$
where $\boldsymbol{\Pi}^a = \text{diag}(\pi(a \mid s_1), \pi(a \mid s_2), \dots, \pi(a \mid s_N))$.

### The Policy-Induced Reward Vector $\mathbf{r}_\pi$
Similarly, the expected reward received when leaving state $s$ under policy $\pi$ is the policy-weighted average of the state-action rewards:

$$r_\pi(s) \doteq \mathbb{E}[R_{t+1} \mid S_t = s, \pi] = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) r(s, a)$$

In vector form:
$$\mathbf{r}_\pi \doteq \begin{bmatrix} r_\pi(s_1) \\ r_\pi(s_2) \\ \vdots \\ r_\pi(s_N) \end{bmatrix} \in \mathbb{R}^N$$

Thus, fixing policy $\pi$ yields an induced Markov Reward Process:
$$\mathcal{M}_\pi = (\mathcal{S}, \mathbf{P}_\pi, \mathbf{r}_\pi, \gamma)$$

---

## 4.4 Stationary State Distributions and Occupancy Measures

When an agent follows a stationary policy $\pi$ indefinitely, what fraction of its time does it spend in each state?

```
                                  STATE VISITATION FLOW
                     ┌──────────────────────────────────────────────┐
                     │                                              │
                     ▼                                              │
                  ┌─────┐       P^π_{1,2}        ┌─────┐            │
                  │ s_1 ├───────────────────────►│ s_2 │            │
                  └──┬──┘                        └──┬──┘            │
                     ▲                              │ P^π_{2,3}     │ P^π_{3,1}
                     │ P^π_{3,1}                    ▼               │
                     │                           ┌─────┐            │
                     └───────────────────────────┤ s_3 ├────────────┘
                                                 └─────┘
                         Conservation of Probability Flow:
                         d^π(s) = Σ_{s'} d^π(s') P^π_{s', s}
```

### 1. The Stationary Distribution $d^\pi(s)$
If the induced Markov chain is **ergodic** (irreducible and aperiodic), there exists a unique probability distribution $d^\pi \in \Delta(\mathcal{S})$, written as a row vector $\mathbf{d}_\pi \in \mathbb{R}^{1 \times N}$, satisfying:

$$\mathbf{d}_\pi \mathbf{P}_\pi = \mathbf{d}_\pi$$
$$\sum_{s \in \mathcal{S}} d^\pi(s) = 1, \quad d^\pi(s) \ge 0$$

In component form, this represents the **conservation of probability flow**:
$$d^\pi(s) = \sum_{s' \in \mathcal{S}} d^\pi(s') \mathcal{P}_{s', s}^\pi$$
The probability mass flowing into state $s$ from all predecessor states $s'$ exactly balances the probability mass residing in $s$.

### 2. The Discounted State Occupancy Measure $\rho_\pi(s)$
In discounted continuing tasks, states visited early in an agent's lifetime contribute more to cumulative return than states visited millions of steps later. 

To formalize this, define the **Discounted State Visitation Measure** $\rho_\pi(s)$ starting from an initial distribution $\mu_0(s) = \mathbb{P}(S_0 = s)$:

$$\rho_\pi(s) \doteq \sum_{t=0}^{\infty} \gamma^t \mathbb{P}(S_t = s \mid S_0 \sim \mu_0, \pi)$$

In vector notation, where $\boldsymbol{\mu}_0 \in \mathbb{R}^{1 \times N}$ is the initial state row vector:
$$\boldsymbol{\rho}_\pi = \boldsymbol{\mu}_0 + \gamma \boldsymbol{\mu}_0 \mathbf{P}_\pi + \gamma^2 \boldsymbol{\mu}_0 \mathbf{P}_\pi^2 + \dots = \boldsymbol{\mu}_0 \sum_{t=0}^\infty (\gamma \mathbf{P}_\pi)^t$$

Using the Neumann series for matrix inversion (since the spectral radius $\rho(\gamma \mathbf{P}_\pi) \le \gamma < 1$):
$$\boldsymbol{\rho}_\pi = \boldsymbol{\mu}_0 (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$$

The normalized discounted occupancy distribution $d_{\gamma, \mu_0}^\pi(s)$ is:
$$d_{\gamma, \mu_0}^\pi(s) \doteq (1 - \gamma) \rho_\pi(s)$$
such that $\sum_{s} d_{\gamma, \mu_0}^\pi(s) = 1$. This distribution plays a central role in modern Policy Gradient theorems (Silver, Sutton).

---

## 4.5 Worked Examples: Policy Computations

### Example 4.1: Constructing Policy-Induced Transition Matrices
An MDP has states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2\}$.
The action-specific transition matrices and reward vectors are:
$$\mathbf{P}^{a_1} = \begin{bmatrix} 0.9 & 0.1 \\ 0.2 & 0.8 \end{bmatrix}, \quad \mathbf{r}^{a_1} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}$$
$$\mathbf{P}^{a_2} = \begin{bmatrix} 0.4 & 0.6 \\ 0.7 & 0.3 \end{bmatrix}, \quad \mathbf{r}^{a_2} = \begin{bmatrix} 5.0 \\ -2.0 \end{bmatrix}$$

Consider a stochastic policy $\pi$ defined by:
- In state $s_1$: $\pi(a_1 \mid s_1) = 0.70, \quad \pi(a_2 \mid s_1) = 0.30$.
- In state $s_2$: $\pi(a_1 \mid s_2) = 0.10, \quad \pi(a_2 \mid s_2) = 0.90$.

1. Compute the induced transition matrix $\mathbf{P}_\pi$.
2. Compute the induced reward vector $\mathbf{r}_\pi$.

#### Solution:
**Step 1: Compute $\mathbf{P}_\pi$:**
For state $s_1$ (Row 1):
$$\mathcal{P}_{s_1, s_1}^\pi = \pi(a_1 \mid s_1) \mathcal{P}_{s_1, s_1}^{a_1} + \pi(a_2 \mid s_1) \mathcal{P}_{s_1, s_1}^{a_2} = (0.70)(0.9) + (0.30)(0.4) = 0.63 + 0.12 = 0.75$$
$$\mathcal{P}_{s_1, s_2}^\pi = \pi(a_1 \mid s_1) \mathcal{P}_{s_1, s_2}^{a_1} + \pi(a_2 \mid s_1) \mathcal{P}_{s_1, s_2}^{a_2} = (0.70)(0.1) + (0.30)(0.6) = 0.07 + 0.18 = 0.25$$
Check row sum: $0.75 + 0.25 = 1.0 \quad \checkmark$.

For state $s_2$ (Row 2):
$$\mathcal{P}_{s_2, s_1}^\pi = \pi(a_1 \mid s_2) \mathcal{P}_{s_2, s_1}^{a_1} + \pi(a_2 \mid s_2) \mathcal{P}_{s_2, s_1}^{a_2} = (0.10)(0.2) + (0.90)(0.7) = 0.02 + 0.63 = 0.65$$
$$\mathcal{P}_{s_2, s_2}^\pi = \pi(a_1 \mid s_2) \mathcal{P}_{s_2, s_2}^{a_1} + \pi(a_2 \mid s_2) \mathcal{P}_{s_2, s_2}^{a_2} = (0.10)(0.8) + (0.90)(0.3) = 0.08 + 0.27 = 0.35$$
Check row sum: $0.65 + 0.35 = 1.0 \quad \checkmark$.

Thus:
$$\mathbf{P}_\pi = \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix}$$

**Step 2: Compute $\mathbf{r}_\pi$:**
$$r_\pi(s_1) = \pi(a_1 \mid s_1) r(s_1, a_1) + \pi(a_2 \mid s_1) r(s_1, a_2) = (0.70)(1.0) + (0.30)(5.0) = 0.70 + 1.50 = 2.20$$
$$r_\pi(s_2) = \pi(a_1 \mid s_2) r(s_2, a_1) + \pi(a_2 \mid s_2) r(s_2, a_2) = (0.10)(0.0) + (0.90)(-2.0) = 0.0 - 1.80 = -1.80$$
$$\mathbf{r}_\pi = \begin{bmatrix} 2.20 \\ -1.80 \end{bmatrix}$$

---

### Example 4.2: Calculating the Stationary Distribution under Policy $\pi$
Using the induced transition matrix $\mathbf{P}_\pi = \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix}$ from Example 4.1:
Compute the exact stationary distribution $\mathbf{d}_\pi = [d_1, d_2]$.

#### Solution:
The stationary condition $\mathbf{d}_\pi \mathbf{P}_\pi = \mathbf{d}_\pi$ requires:
$$[d_1, d_2] \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix} = [d_1, d_2]$$
Expanding the first column:
$$0.75 d_1 + 0.65 d_2 = d_1 \implies 0.65 d_2 = 0.25 d_1 \implies d_2 = \frac{0.25}{0.65} d_1 = \frac{5}{13} d_1$$
Apply normalization $d_1 + d_2 = 1$:
$$d_1 + \frac{5}{13} d_1 = 1 \implies \frac{18}{13} d_1 = 1 \implies d_1 = \frac{13}{18} \approx 0.7222$$
$$d_2 = 1 - \frac{13}{18} = \frac{5}{18} \approx 0.2778$$
The agent spends approximately $72.2\%$ of its operational time in state $s_1$ and $27.8\%$ in state $s_2$.

---

### Example 4.3: Asymptotic Average Reward of Policy $\pi$
Using the stationary distribution $\mathbf{d}_\pi = [\frac{13}{18}, \frac{5}{18}]$ and reward vector $\mathbf{r}_\pi = [2.20, -1.80]^T$:
Compute the asymptotic average reward per step $r(\pi) = \mathbf{d}_\pi \mathbf{r}_\pi$.

#### Solution:
$$r(\pi) = d_1 r_\pi(s_1) + d_2 r_\pi(s_2) = \left(\frac{13}{18}\right)(2.20) + \left(\frac{5}{18}\right)(-1.80)$$
$$r(\pi) = \frac{13 \times 2.20 - 5 \times 1.80}{18} = \frac{28.60 - 9.00}{18} = \frac{19.60}{18} \approx +1.0889 \text{ reward/step}$$

---

### Example 4.4: Discounted State Occupancy Matrix Computation
For the induced Markov chain with $\mathbf{P}_\pi = \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix}$ and discount factor $\gamma = 0.80$:
Compute the fundamental resolvent matrix $\mathbf{M} \doteq (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$.

#### Solution:
**Step 1: Compute $\mathbf{I} - \gamma \mathbf{P}_\pi$:**
$$\gamma \mathbf{P}_\pi = 0.80 \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix} = \begin{bmatrix} 0.60 & 0.20 \\ 0.52 & 0.28 \end{bmatrix}$$
$$\mathbf{I} - \gamma \mathbf{P}_\pi = \begin{bmatrix} 1 - 0.60 & -0.20 \\ -0.52 & 1 - 0.28 \end{bmatrix} = \begin{bmatrix} 0.40 & -0.20 \\ -0.52 & 0.72 \end{bmatrix}$$

**Step 2: Determinant:**
$$\det(\mathbf{I} - \gamma \mathbf{P}_\pi) = (0.40)(0.72) - (-0.20)(-0.52) = 0.288 - 0.104 = 0.184$$

**Step 3: Matrix Inversion:**
$$\mathbf{M} = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} = \frac{1}{0.184} \begin{bmatrix} 0.72 & 0.20 \\ 0.52 & 0.40 \end{bmatrix}$$
$$\mathbf{M} \approx \begin{bmatrix} 3.9130 & 1.0870 \\ 2.8261 & 2.1739 \end{bmatrix}$$

Notice:
- Row 1 sum: $3.9130 + 1.0870 = 5.00 = \frac{1}{1 - 0.80}$.
- Row 2 sum: $2.8261 + 2.1739 = 5.00 = \frac{1}{1 - 0.80}$.
Every row of $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$ sums exactly to $\frac{1}{1 - \gamma}$, confirming that total discounted lifetime is conserved across all initial states.

---

### Example 4.5: Discounted State Visitation Starting from State $s_1$
Using $\mathbf{M} = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$ from Example 4.4:
Given initial state distribution $\boldsymbol{\mu}_0 = [1.0, 0.0]$ (the agent begins deterministically in state $s_1$):
1. Compute the discounted occupancy measure vector $\boldsymbol{\rho}_\pi$.
2. Compute the normalized discounted state distribution $\mathbf{d}_{\gamma}^\pi$.

#### Solution:
**Step 1: Occupancy Measure:**
$$\boldsymbol{\rho}_\pi = \boldsymbol{\mu}_0 \mathbf{M} = [1.0, 0.0] \begin{bmatrix} 3.9130 & 1.0870 \\ 2.8261 & 2.1739 \end{bmatrix} = [3.9130, 1.0870]$$
Interpretation: Starting from $s_1$, the agent expects to accumulate $3.913$ discounted visits in state $s_1$ and $1.087$ discounted visits in state $s_2$.

**Step 2: Normalized Distribution:**
$$\mathbf{d}_\gamma^\pi = (1 - \gamma) \boldsymbol{\rho}_\pi = (0.20) [3.9130, 1.0870] = [0.7826, 0.2174]$$
Sum check: $0.7826 + 0.2174 = 1.000 \quad \checkmark$.
Notice that $d_\gamma^\pi(s_1) = 0.7826$ is higher than the stationary distribution $d_1 = 0.7222$, because the agent started directly in $s_1$ and discounting prioritizes early visits.

---

### Example 4.6: Softmax / Boltzmann Policy Parameterization
In parameterized policy algorithms, action probabilities are generated from real-valued preferences $h(s, a; \boldsymbol{\theta})$ via the Softmax (Boltzmann) function:
$$\pi(a \mid s) = \frac{e^{h(s, a) / \tau}}{\sum_{b \in \mathcal{A}(s)} e^{h(s, b) / \tau}}$$
where $\tau > 0$ is a temperature hyperparameter.
Let state $s$ have 3 available actions with preferences:
$$h(s, a_1) = 2.0, \quad h(s, a_2) = 1.0, \quad h(s, a_3) = 0.0$$
Calculate the action probability distribution $\pi(\cdot \mid s)$ for:
1. High temperature $\tau = 5.0$.
2. Standard temperature $\tau = 1.0$.
3. Low temperature $\tau = 0.2$.

#### Solution:
**1. For $\tau = 5.0$ (High exploration):**
- $h/\tau$: $2/5 = 0.4, \quad 1/5 = 0.2, \quad 0/5 = 0.0$.
- Exponentials: $e^{0.4} \approx 1.4918, \quad e^{0.2} \approx 1.2214, \quad e^{0.0} = 1.0000$.
- Sum: $1.4918 + 1.2214 + 1.0000 = 3.7132$.
- Probabilities:
  $$\pi(a_1 \mid s) = \frac{1.4918}{3.7132} \approx 0.4017, \quad \pi(a_2 \mid s) \approx 0.3289, \quad \pi(a_3 \mid s) \approx 0.2693$$

**2. For $\tau = 1.0$ (Standard):**
- $e^2 \approx 7.3891, \quad e^1 \approx 2.7183, \quad e^0 = 1.0000$.
- Sum: $7.3891 + 2.7183 + 1.0000 = 11.1074$.
- Probabilities:
  $$\pi(a_1 \mid s) = \frac{7.3891}{11.1074} \approx 0.6652, \quad \pi(a_2 \mid s) \approx 0.2447, \quad \pi(a_3 \mid s) \approx 0.0900$$

**3. For $\tau = 0.2$ (Greedy / Exploitation limit):**
- $h/\tau$: $2/0.2 = 10, \quad 1/0.2 = 5, \quad 0/0.2 = 0$.
- Exponentials: $e^{10} \approx 22026.47, \quad e^5 \approx 148.41, \quad e^0 = 1.00$.
- Sum: $22026.47 + 148.41 + 1.00 \approx 22175.88$.
- Probabilities:
  $$\pi(a_1 \mid s) = \frac{22026.47}{22175.88} \approx 0.9933, \quad \pi(a_2 \mid s) \approx 0.0067, \quad \pi(a_3 \mid s) \approx 0.000045$$
As $\tau \to 0$, the Softmax policy approaches a deterministic argmax policy.

---

### Example 4.7: Deterministic Policy Space Cardinality
A gridworld environment has $N = 16$ states ($4 \times 4$ grid). In each state, the agent can choose from $|\mathcal{A}| = 4$ directional actions: $\{\text{Up}, \text{Down}, \text{Left}, \text{Right}\}$.
1. How many distinct deterministic policies $\pi: \mathcal{S} \to \mathcal{A}$ exist?
2. If an exhaustive search evaluates 1 billion policies per second, how long would brute-force evaluation take?

#### Solution:
**Step 1: Policy Cardinality:**
For each of the $N$ states, there are $|\mathcal{A}|$ independent action choices:
$$|\Pi_{\text{det}}| = |\mathcal{A}|^{|\mathcal{S}|} = 4^{16} = (2^2)^{16} = 2^{32} = 4,294,967,296 \text{ policies}$$

**Step 2: Brute-Force Time:**
$$\text{Time} = \frac{4.295 \times 10^9 \text{ policies}}{10^9 \text{ policies/sec}} \approx 4.295 \text{ seconds}$$

Now consider a moderately larger board: $8 \times 8$ grid ($N = 64$ states):
$$|\Pi_{\text{det}}| = 4^{64} = 2^{128} \approx 3.40 \times 10^{38} \text{ policies}$$
At 1 billion evaluations per second:
$$\text{Time} = \frac{3.40 \times 10^{38}}{10^9} = 3.40 \times 10^{29} \text{ seconds} \approx 1.08 \times 10^{22} \text{ years}$$
This illustrates why brute-force policy search fails instantly on non-trivial environments, necessitating dynamic programming.

---

### Example 4.8: Policy Gradient Score Function Derivation
Let $\pi_\theta(a \mid s)$ be a differentiable parameterized policy.
Prove the famous "log-derivative trick" (score function identity):
$$\nabla_\theta \pi_\theta(a \mid s) = \pi_\theta(a \mid s) \nabla_\theta \ln \pi_\theta(a \mid s)$$
and show that $\mathbb{E}_{a \sim \pi_\theta} [\nabla_\theta \ln \pi_\theta(a \mid s)] = 0$.

#### Solution:
**Step 1: Score Identity:**
By the elementary calculus chain rule for $\ln(u)$:
$$\nabla_\theta \ln \pi_\theta(a \mid s) = \frac{1}{\pi_\theta(a \mid s)} \nabla_\theta \pi_\theta(a \mid s)$$
Multiplying both sides by $\pi_\theta(a \mid s)$:
$$\pi_\theta(a \mid s) \nabla_\theta \ln \pi_\theta(a \mid s) = \nabla_\theta \pi_\theta(a \mid s) \quad \checkmark$$

**Step 2: Expectation of the Score Function:**
$$\mathbb{E}_{a \sim \pi_\theta} [\nabla_\theta \ln \pi_\theta(a \mid s)] = \sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \nabla_\theta \ln \pi_\theta(a \mid s)$$
Substituting the identity:
$$= \sum_{a \in \mathcal{A}} \nabla_\theta \pi_\theta(a \mid s) = \nabla_\theta \left( \sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \right)$$
Because $\pi_\theta$ is a valid probability distribution, $\sum_a \pi_\theta(a \mid s) = 1.0$ for all $\theta$:
$$= \nabla_\theta (1.0) = \mathbf{0}$$
The expected score is identically zero.

---

### Example 4.9: Degenerate Policy Causing Transient State Trapping
Consider a 3-state chain $s_1 \rightleftarrows s_2 \to s_3$, where $s_3$ is absorbing.
Let policy $\pi_A$ always choose $a = \text{Left}$ in state $s_2$, moving to $s_1$ with prob 1.0, and in $s_1$ moving to $s_2$ with prob 1.0.
1. Write the induced transition matrix $\mathbf{P}_{\pi_A}$.
2. Determine whether $s_3$ is reachable under policy $\pi_A$.
3. What is the stationary distribution of the induced chain?

#### Solution:
**Step 1: Transition Matrix:**
$$\mathbf{P}_{\pi_A} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

**Step 2: Reachability:**
Under $\pi_A$, the agent oscillates between $s_1$ and $s_2$ forever. $\mathcal{P}_{s_2, s_3}^{\pi_A} = 0$. State $s_3$ is completely unreachable.

**Step 3: Stationary Distributions:**
The chain is reducible and periodic (with two closed classes: $\{s_1, s_2\}$ and $\{s_3\}$).
Any distribution of the form $\boldsymbol{\mu} = [\frac{\alpha}{2}, \frac{\alpha}{2}, 1 - \alpha]$ for $\alpha \in [0, 1]$ satisfies $\boldsymbol{\mu} \mathbf{P}_{\pi_A} = \boldsymbol{\mu}$. 
If the agent begins in $s_1$, it remains trapped in the limit cycle $\{s_1, s_2\}$ with stationary distribution $[0.5, 0.5, 0.0]$, never reaching the terminal state.

---

### Example 4.10: Entropy of Exploration Policies
The exploration capacity of a stochastic policy is measured by its Shannon entropy:
$$\mathcal{H}(\pi(\cdot \mid s)) \doteq - \sum_{a \in \mathcal{A}} \pi(a \mid s) \ln \pi(a \mid s)$$
Let $|\mathcal{A}| = 4$.
1. Compute the entropy of a uniform random policy $\pi_{\text{rand}}(a \mid s) = \frac{1}{4}$ for all $a$.
2. Compute the entropy of a deterministic policy $\pi_{\text{det}}(a_1 \mid s) = 1.0, \pi_{\text{det}}(a_k \mid s) = 0$ for $k > 1$.
3. Compute the entropy of an $\epsilon$-greedy policy with $\epsilon = 0.10$ and 4 actions.

#### Solution:
**1. Uniform Random Policy:**
$$\mathcal{H}(\pi_{\text{rand}}) = - 4 \times \left( \frac{1}{4} \ln \frac{1}{4} \right) = - \ln\left( \frac{1}{4} \right) = \ln(4) \approx 1.3863 \text{ nats}$$

**2. Deterministic Policy:**
$$\mathcal{H}(\pi_{\text{det}}) = - (1.0 \ln 1.0 + 0 + 0 + 0) = - (1.0 \times 0) = 0.0 \text{ nats}$$

**3. $\epsilon$-Greedy Policy ($\epsilon = 0.10, |\mathcal{A}| = 4$):**
- Greedy action $a^*$: $\pi(a^*) = 1 - \epsilon + \frac{\epsilon}{4} = 1 - 0.10 + 0.025 = 0.925$.
- Three exploratory actions $a_k$: $\pi(a_k) = \frac{\epsilon}{4} = \frac{0.10}{4} = 0.025$.
Entropy:
$$\mathcal{H}(\pi_{\epsilon}) = - [0.925 \ln(0.925) + 3 \times 0.025 \ln(0.025)]$$
- $0.925 \ln(0.925) = 0.925(-0.07796) \approx -0.07211$.
- $3 \times 0.025 \ln(0.025) = 0.075(-3.68888) \approx -0.27667$.
$$\mathcal{H}(\pi_{\epsilon}) = - (-0.07211 - 0.27667) = +0.3488 \text{ nats}$$
Entropy drops sharply from $1.386$ to $0.349$, quantifying how rapidly $\epsilon$-greedy concentrates probability mass.

---

## 4.6 Solved Exercises

### Exercise 4.1: Stochastic Policy Probability Normalization
A neural network outputs unnormalized action logits $\mathbf{z} = [2.0, 4.0, 1.0]$ in state $s$.
Compute the normalized Softmax policy vector $\boldsymbol{\pi}(\cdot \mid s)$.

#### Solution:
$$e^{2.0} \approx 7.389, \quad e^{4.0} \approx 54.598, \quad e^{1.0} \approx 2.718$$
Sum: $7.389 + 54.598 + 2.718 = 64.705$.
- $\pi(a_1 \mid s) = \frac{7.389}{64.705} \approx 0.1142$
- $\pi(a_2 \mid s) = \frac{54.598}{64.705} \approx 0.8438$
- $\pi(a_3 \mid s) = \frac{2.718}{64.705} \approx 0.0420$
Sum check: $0.1142 + 0.8438 + 0.0420 = 1.000 \quad \checkmark$.

---

### Exercise 4.2: Induced Markov Transition Matrix
An agent has 2 states and 2 actions:
$$\mathbf{P}^{a_1} = \begin{bmatrix} 1.0 & 0.0 \\ 0.5 & 0.5 \end{bmatrix}, \quad \mathbf{P}^{a_2} = \begin{bmatrix} 0.0 & 1.0 \\ 0.0 & 1.0 \end{bmatrix}$$
Under a policy that chooses $a_1$ with prob $0.4$ in state 1 and $a_1$ with prob $0.8$ in state 2, write $\mathbf{P}_\pi$.

#### Solution:
- Row 1: $0.4[1.0, 0.0] + 0.6[0.0, 1.0] = [0.4, 0.6]$.
- Row 2: $0.8[0.5, 0.5] + 0.2[0.0, 1.0] = [0.4, 0.4] + [0.0, 0.2] = [0.4, 0.6]$.
$$\mathbf{P}_\pi = \begin{bmatrix} 0.4 & 0.6 \\ 0.4 & 0.6 \end{bmatrix}$$

---

### Exercise 4.3: Instant Stationary Distribution
Notice in Exercise 4.2 that both rows of $\mathbf{P}_\pi$ are identical ($[0.4, 0.6]$).
What is the stationary distribution $\mathbf{d}_\pi$ of this chain?

#### Solution:
Because every state transitions to $[s_1, s_2]$ with probabilities $[0.4, 0.6]$ independent of the origin state:
$$\mathbf{d}_\pi = [0.4, 0.6]$$
Verification: $[0.4, 0.6] \begin{bmatrix} 0.4 & 0.6 \\ 0.4 & 0.6 \end{bmatrix} = [0.16 + 0.24, 0.24 + 0.36] = [0.4, 0.6] \quad \checkmark$.

---

### Exercise 4.4: Number of Deterministic Policies in Chess
Estimate the number of deterministic policies in chess assuming approximately $10^{40}$ reachable legal board states, with an average of 30 legal moves per state.

#### Solution:
$$|\Pi| = |\mathcal{A}|^{|\mathcal{S}|} \approx 30^{10^{40}}$$
This number far exceeds the number of subatomic particles in the observable universe ($\approx 10^{80}$), demonstrating why tabular policy listing is impossible in complex games.

---

### Exercise 4.5: Probability of Action Under $\epsilon$-Greedy Policy
For an environment with $|\mathcal{A}| = 5$ actions and $\epsilon = 0.20$, what is the exact probability of selecting the greedy action $a^*$, and what is the probability of selecting a specific non-greedy action $a_{\text{sub}}$?

#### Solution:
- Probability of greedy action:
  $$\mathbb{P}(a^*) = 1 - \epsilon + \frac{\epsilon}{|\mathcal{A}|} = 1 - 0.20 + \frac{0.20}{5} = 0.80 + 0.04 = 0.84$$
- Probability of a specific non-greedy action:
  $$\mathbb{P}(a_{\text{sub}}) = \frac{\epsilon}{|\mathcal{A}|} = \frac{0.20}{5} = 0.04$$
Sum check: $0.84 + 4 \times 0.04 = 0.84 + 0.16 = 1.00 \quad \checkmark$.

---

### Exercise 4.6: Discounted Occupancy of Immediate Absorbing State
An agent in state $s_0$ takes action $a$, receiving reward $R_1 = 0$ and transitioning to absorbing terminal state $s_T$ with probability 1.0.
What is the discounted occupancy measure $\rho_\pi(s_0)$?

#### Solution:
Since the agent starts in $s_0$ at $t = 0$ and never returns:
$$\rho_\pi(s_0) = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s_0 \mid S_0 = s_0) = \gamma^0 (1) + \gamma^1 (0) + \gamma^2 (0) + \dots = 1.0$$

---

### Exercise 4.7: Verifying Ergodicity from Transition Graph
A 3-state Markov chain has transitions: $s_1 \to s_2$ with prob 1.0; $s_2 \to s_3$ with prob 1.0; $s_3 \to s_1$ with prob 1.0.
Is this chain ergodic? Explain.

#### Solution:
No. The chain is irreducible (any state can reach any other state), but it is strictly periodic with period $d = 3$ (it cycles deterministic along $s_1 \to s_2 \to s_3 \to s_1$). Ergodicity requires aperiodicity ($d = 1$). Therefore, the chain is not ergodic.

---

### Exercise 4.8: Policy Representation Memory Footprint
A discrete MDP has $1,000,000$ states and $10$ actions.
Calculate the memory required in megabytes (MB) to store:
1. A deterministic policy as 8-bit unsigned integers (`uint8`).
2. A stochastic policy as 32-bit floating-point numbers (`float32`).

#### Solution:
1. **Deterministic Policy:**
   $$1,000,000 \text{ bytes} \approx \frac{1,000,000}{1,048,576} \approx 0.954 \text{ MB}$$
2. **Stochastic Policy:**
   Each state stores 10 float32 values ($10 \times 4 = 40$ bytes):
   $$1,000,000 \times 40 \text{ bytes} = 40,000,000 \text{ bytes} \approx \frac{40,000,000}{1,048,576} \approx 38.15 \text{ MB}$$

---

### Exercise 4.9: Invariance of Stationary Distribution to Initial State
In an ergodic Markov chain, does the long-run stationary distribution $\lim_{t \to \infty} \mathbb{P}(S_t = s)$ depend on the initial state $S_0$?

#### Solution:
No. For any irreducible, aperiodic finite Markov chain, the Perron-Frobenius theorem guarantees that $\lim_{t \to \infty} \mathbf{P}^t = \mathbf{1} \mathbf{d}_\pi$, where $\mathbf{d}_\pi$ is the unique stationary distribution. For any initial distribution $\boldsymbol{\mu}_0$:
$$\lim_{t \to \infty} \boldsymbol{\mu}_0 \mathbf{P}^t = \boldsymbol{\mu}_0 (\mathbf{1} \mathbf{d}_\pi) = (\boldsymbol{\mu}_0 \mathbf{1}) \mathbf{d}_\pi = (1) \mathbf{d}_\pi = \mathbf{d}_\pi$$
All dependence on initial state is completely forgotten as $t \to \infty$.

---

### Exercise 4.10: Expected Episode Length from Resolvent
Given the fundamental matrix $\mathbf{M} = (\mathbf{I} - \mathbf{Q})^{-1}$ for transient states of an absorbing Markov chain under policy $\pi$, prove that the $i$-th entry of the vector $\boldsymbol{\tau} = \mathbf{M} \mathbf{1}$ equals the expected number of steps until absorption starting from transient state $s_i$.

#### Solution:
Let $N_j$ be the total number of visits to transient state $s_j$.
$N_j = \sum_{t=0}^\infty \mathbb{I}(S_t = s_j)$.
Taking the expectation conditioned on $S_0 = s_i$:
$$\mathbb{E}[N_j \mid S_0 = s_i] = \sum_{t=0}^\infty \mathbb{P}(S_t = s_j \mid S_0 = s_i) = \sum_{t=0}^\infty (\mathbf{Q}^t)_{ij} = [(\mathbf{I} - \mathbf{Q})^{-1}]_{ij} = M_{ij}$$
The total time until absorption is the sum of visits across all transient states:
$$T = \sum_{j} N_j \implies \mathbb{E}[T \mid S_0 = s_i] = \sum_{j} \mathbb{E}[N_j \mid S_0 = s_i] = \sum_{j} M_{ij} = (\mathbf{M} \mathbf{1})_i$$
This proves that row sums of the fundamental matrix equal the expected time to absorption.
