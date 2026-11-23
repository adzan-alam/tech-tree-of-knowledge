# Chapter 2: The Markov Property and the Formal Markov Decision Process (MDP)

---

## 2.1 The Philosophy of Memoryless Dynamics: Andrei Markov's Legacy

In 1906, Russian mathematician Andrei Andreyevich Markov was engaged in an intense philosophical and theological dispute with Pavel Nekrasov. Nekrasov claimed that the Law of Large Numbers and statistical independence were mathematical proofs of human free will. To refute Nekrasov, Markov set out to prove that statistical laws of convergence do not require independence—they hold even for sequences of random variables that are tightly bound to one another by causal chains.

To demonstrate this empirically, Markov spent months meticulously analyzing the first 20,000 letters of Alexander Pushkin’s poetic masterpiece *Eugene Onegin*. He discovered that the probability of encountering a vowel at letter index $t+1$ depended heavily on whether letter $t$ was a vowel or a consonant, but *did not depend on the letters prior to $t$*.

```
                                      Pushkin's Vowel-Consonant Chain:
                                             ┌───────────────┐
                                      0.128  │               │ 0.663
                                      ┌──────┤     VOWEL     ├──────┐
                                      │      │               │      │
                                      ▼      └───────┬───────┘      ▼
                                   (Loop)            │          (To Cons)
                                                     │ 0.872
                                            0.337    │
                                          (To Vowel) │
                                      ▲              ▼              ▲
                                      │      ┌───────────────┐      │
                                      │      │               │      │
                                      └──────┤   CONSONANT   ├──────┘
                                             │               │
                                             └───────────────┘
                                                   0.663
```

This gave birth to the **Markov Property**: the idea that a dynamical process can possess memory of its immediate configuration without requiring knowledge of its entire historical trajectory.

---

## 2.2 The Markov Property Defined from First Principles

Consider a general discrete-time stochastic process generating a history of states and actions:
$$H_t = (S_0, A_0, R_1, S_1, A_1, R_2, \dots, S_{t-1}, A_{t-1}, R_t, S_t)$$

In the most general non-Markovian universe, the probability of transitioning to state $s'$ and receiving reward $r$ at time $t+1$ depends upon the entire historical tapestry of every thought, action, and event that has occurred since the beginning of time ($t = 0$):
$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots, S_0, A_0)$$

Tracking such an infinite-history distribution is computationally intractable. A state representation is defined to be **Markov** if and only if:

$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots, S_0, A_0) = \mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t)$$

for all $s' \in \mathcal{S}$, $r \in \mathcal{R}$, and all historical sequences $(S_0, A_0, \dots, S_t, A_t)$.

```
   NON-MARKOVIAN UNIVERSE (History-Dependent)            MARKOVIAN UNIVERSE (Memoryless)
  ┌─────────────────────────────────────────┐         ┌─────────────────────────────────────────┐
  │ S_0 ──► S_1 ──► S_2 ──► ... ──► S_t     │         │                                         │
  │  \       \       \             /        │         │                                         │
  │   ─────── \ ────── \ ──────── /         │         │                    S_t                  │
  │            ▼        ▼        ▼          │         │                     │                   │
  │               [ S_{t+1} ]               │         │                     ▼                   │
  │                                         │         │                [ S_{t+1} ]              │
  │ All historical states causally dictate  │         │ The present state S_t is a sufficient   │
  │ the future distribution.                │         │ statistic for the future.               │
  └─────────────────────────────────────────┘         └─────────────────────────────────────────┘
```

### The State as a Sufficient Statistic
In statistical physics and information theory, the Markov property means that the current state $S_t$ is a **sufficient statistic** for the future. Formally:
$$I(S_{t+1}, R_{t+1} ; H_{t-1} \mid S_t, A_t) = 0$$
The conditional mutual information between the future and the past, conditioned on the present state and action, is identically zero. Once the present state $S_t$ is known, the past history $H_{t-1}$ provides zero additional predictive information.

### What Happens When an Environment Appears Non-Markovian?
Consider a cannonball fired into the air. If the state $S_t$ is defined solely by its spatial position $(x, y)$, the environment is non-Markovian: knowing the position alone does not tell you where the ball will be at $t+1$, because you do not know its direction or velocity. 

However, if we enrich the state representation to include the first derivatives:
$$S_t = (x, y, \dot{x}, \dot{y})$$
then according to Newtonian mechanics, the future trajectory is fully determined by the current state and applied forces. 
> [!NOTE]
> Any finite-history non-Markovian process of order $k$ can be converted into a first-order Markov process by **state augmentation**: defining an augmented state vector $\tilde{S}_t \doteq (S_t, S_{t-1}, \dots, S_{t-k+1})$.

---

## 2.3 The Four-Tier Stochastic Process Hierarchy

To understand the Markov Decision Process, we trace the progression of stochastic systems through four progressively expressive mathematical formalisms:

```
                                 STOCHASTIC PROCESS HIERARCHY
                                               │
                                               ▼
                                ┌─────────────────────────────┐
                                │       1. MARKOV CHAIN       │  Passive, No Rewards
                                │      (S, P)                 │  Pure autonomous dynamics
                                └──────────────┬──────────────┘
                                               │  Add Reward Function R
                                               ▼  and Discount Factor γ
                                ┌─────────────────────────────┐
                                │   2. MARKOV REWARD PROCESS  │  Passive, Evaluated
                                │      (S, P, R, γ)           │  Accumulates value
                                └──────────────┬──────────────┘
                                               │  Add Action Set A
                                               ▼  and Active Agency
                                ┌─────────────────────────────┐
                                │ 3. MARKOV DECISION PROCESS  │  Active, Fully Observable
                                │      (S, A, P, R, γ)        │  Closed-loop control
                                └──────────────┬──────────────┘
                                               │  Add Partial Observability
                                               ▼  (Ω, O) and Belief States
                                ┌─────────────────────────────┐
                                │          4. POMDP           │  Active, Partially Observable
                                │   (S, A, P, R, Ω, O, γ)     │  Incomplete information
                                └─────────────────────────────┘
```

### 1. Markov Chain (Discrete Markov Process)
A Markov Chain is a memoryless random process defined by the 2-tuple:
$$\mathcal{M}_{\text{chain}} = (\mathcal{S}, \mathcal{P})$$
- $\mathcal{S}$ is a countable set of states $\{s_1, s_2, \dots, s_N\}$.
- $\mathcal{P}$ is a state-transition probability matrix $\mathbf{P} \in \mathbb{R}^{N \times N}$, where each entry represents the conditional probability of jumping from state $s$ to state $s'$:
  $$\mathcal{P}_{s, s'} = \mathbb{P}(S_{t+1} = s' \mid S_t = s)$$
Each row of $\mathbf{P}$ is a valid probability distribution (a stochastic matrix):
$$\sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'} = 1, \quad \forall s \in \mathcal{S}, \quad \text{and } \mathcal{P}_{s, s'} \ge 0$$

### 2. Markov Reward Process (MRP)
A Markov Reward Process augments a Markov Chain with a numerical evaluation of states, defined by the 4-tuple:
$$\mathcal{M}_{\text{MRP}} = (\mathcal{S}, \mathcal{P}, \mathcal{R}, \gamma)$$
- $\mathcal{S}$ and $\mathcal{P}$ are as defined above.
- $\mathcal{R}$ is a reward function mapping each state to an expected reward:
  $$\mathcal{R}_s \doteq \mathbb{E}[R_{t+1} \mid S_t = s]$$
- $\gamma \in [0, 1)$ is the temporal discount factor.

In an MRP, the system remains passive (there are no decisions to make), but we can now calculate the **Value** of being in state $s$: the expected discounted return from that state onward.

### 3. Markov Decision Process (MDP)
A Markov Decision Process introduces **agency**: an external decision-maker that chooses actions to influence state transitions and harvest rewards. It is formalized as a 5-tuple:
$$\mathcal{M}_{\text{MDP}} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$$
- $\mathcal{S}$ is the set of all valid states.
- $\mathcal{A}$ is the set of all valid actions (or $\mathcal{A}(s)$ for state-dependent admissible actions).
- $\mathcal{P}$ is the transition probability kernel:
  $$\mathcal{P}_{s, s'}^a \doteq \mathbb{P}(S_{t+1} = s' \mid S_t = s, A_t = a)$$
- $\mathcal{R}$ is the reward function:
  $$\mathcal{R}_s^a \doteq \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a]$$
- $\gamma \in [0, 1)$ is the discount factor.

### 4. Partially Observable Markov Decision Process (POMDP)
In the real world, an agent rarely perceives the true underlying environmental state $s \in \mathcal{S}$ directly. A robotic camera produces pixels, not Cartesian coordinates; a trader sees public order books, not private institutional order flows. A POMDP is defined by the 7-tuple:
$$\mathcal{M}_{\text{POMDP}} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \Omega, \mathcal{O}, \gamma)$$
- $\Omega$ is a finite set of observations $o \in \Omega$.
- $\mathcal{O}$ is the observation probability distribution:
  $$\mathcal{O}(o \mid s', a) \doteq \mathbb{P}(O_{t+1} = o \mid S_{t+1} = s', A_t = a)$$
Because the agent cannot observe $S_t$, it maintains an internal probability distribution over all possible states, called the **Belief State** $b \in \Delta(\mathcal{S})$, where $b(s) = \mathbb{P}(S_t = s \mid H_t)$. The belief state is updated via Bayes' rule:
$$b'(s') = \frac{\mathcal{O}(o \mid s', a) \sum_{s \in \mathcal{S}} \mathcal{P}_{s, s'}^a b(s)}{\sum_{s'' \in \mathcal{S}} \mathcal{O}(o \mid s'', a) \sum_{s \in \mathcal{S}} \mathcal{P}_{s, s''}^a b(s)}$$
Remarkably, a POMDP can be solved as a fully observable MDP over the continuous, infinite-dimensional space of belief states $\Delta(\mathcal{S})$.

---

## 2.4 Mathematical Anatomy of Finite MDPs

In this treatise, we focus primarily on **Finite MDPs**, where the state space $\mathcal{S}$, action space $\mathcal{A}$, and reward set $\mathcal{R}$ are finite sets.

```
                      MDP STATE-ACTION TRANSITION GRAPH
                                     (s)  State Node
                                    /   \
                                   /     \
                       Action a_1 ●       ● Action a_2 (Action Nodes)
                                 / \     / \
                     p(s_1,r_1) /   \   /   \ p(s_2,r_2)
                               ▼     ▼ ▼     ▼
                             (s_1)   (s_2)   (s_3)  Next State Nodes
```

### The Joint Transition-Reward Function $p(s', r \mid s, a)$
The most fundamental, complete description of a finite MDP's dynamics is the four-argument joint transition probability function:
$$p(s', r \mid s, a) \doteq \mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t = s, A_t = a)$$

Because $p(s', r \mid s, a)$ is a conditional probability distribution over the discrete product space $\mathcal{S} \times \mathcal{R}$, it satisfies the law of total probability:
$$\sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) = 1, \quad \forall s \in \mathcal{S}, a \in \mathcal{A}(s)$$
and non-negativity:
$$p(s', r \mid s, a) \ge 0, \quad \forall s, s' \in \mathcal{S}, a \in \mathcal{A}(s), r \in \mathcal{R}$$

### Marginalizing the Joint Distribution
All other standard MDP functions are derived directly by marginalizing $p(s', r \mid s, a)$:

1. **State-Transition Probability Kernel $\mathcal{P}_{s, s'}^a$:**
   The probability of landing in state $s'$ given that action $a$ was taken in state $s$, summing over all possible reward values:
   $$\mathcal{P}_{s, s'}^a \doteq \mathbb{P}(S_{t+1} = s' \mid S_t = s, A_t = a) = \sum_{r \in \mathcal{R}} p(s', r \mid s, a)$$

2. **Expected State-Action Reward Function $r(s, a)$:**
   The expected reward received when executing action $a$ in state $s$:
   $$r(s, a) \doteq \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a] = \sum_{r \in \mathcal{R}} r \sum_{s' \in \mathcal{S}} p(s', r \mid s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} r \cdot p(s', r \mid s, a)$$

3. **Expected State-Action-Next-State Reward Function $r(s, a, s')$:**
   The expected reward conditioned not only on state $s$ and action $a$, but also on the realized destination state $s'$:
   $$r(s, a, s') \doteq \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a, S_{t+1} = s'] = \sum_{r \in \mathcal{R}} r \cdot \frac{p(s', r \mid s, a)}{\mathcal{P}_{s, s'}^a}$$

By the definition of conditional expectation:
$$r(s, a) = \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a r(s, a, s')$$

---

## 2.5 Worked Examples: Formal MDP Derivations

### Example 2.1: Transition Matrix Stochasticity Verification
Consider a 3-state system $\mathcal{S} = \{s_1, s_2, s_3\}$ with candidate transition matrix:
$$\mathbf{P} = \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix}$$
1. Verify whether $\mathbf{P}$ is a valid stochastic matrix.
2. Given an initial state distribution $\mathbf{p}_0 = [1.0, 0.0, 0.0]^T$, calculate the state probability distribution after two time steps: $\mathbf{p}_2 = (\mathbf{P}^T)^2 \mathbf{p}_0$.

#### Solution:
**Step 1: Check Row Sums:**
- Row 1: $0.7 + 0.2 + 0.1 = 1.0 \quad \checkmark$
- Row 2: $0.0 + 0.6 + 0.4 = 1.0 \quad \checkmark$
- Row 3: $0.5 + 0.5 + 0.0 = 1.0 \quad \checkmark$
All elements are non-negative ($\mathcal{P}_{ij} \ge 0$) and every row sums to 1. Thus, $\mathbf{P}$ is a valid stochastic matrix.

**Step 2: Distribution Evolution:**
Let row vector $\boldsymbol{\mu}_t$ represent the distribution: $\boldsymbol{\mu}_{t+1} = \boldsymbol{\mu}_t \mathbf{P}$.
At $t = 0$: $\boldsymbol{\mu}_0 = [1.0, 0.0, 0.0]$.
At $t = 1$:
$$\boldsymbol{\mu}_1 = \boldsymbol{\mu}_0 \mathbf{P} = [1.0, 0.0, 0.0] \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix} = [0.7, 0.2, 0.1]$$
At $t = 2$:
$$\boldsymbol{\mu}_2 = \boldsymbol{\mu}_1 \mathbf{P} = [0.7, 0.2, 0.1] \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix}$$
- $\mu_2(s_1) = 0.7(0.7) + 0.2(0.0) + 0.1(0.5) = 0.49 + 0.0 + 0.05 = 0.54$
- $\mu_2(s_2) = 0.7(0.2) + 0.2(0.6) + 0.1(0.5) = 0.14 + 0.12 + 0.05 = 0.31$
- $\mu_2(s_3) = 0.7(0.1) + 0.2(0.4) + 0.1(0.0) = 0.07 + 0.08 + 0.00 = 0.15$
Check sum: $0.54 + 0.31 + 0.15 = 1.00 \quad \checkmark$.

---

### Example 2.2: Stationary Distribution of an Ergodic Markov Chain
Using the transition matrix from Example 2.1:
$$\mathbf{P} = \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix}$$
Compute the exact stationary distribution $\boldsymbol{\pi} = [\pi_1, \pi_2, \pi_3]$ satisfying $\boldsymbol{\pi} \mathbf{P} = \boldsymbol{\pi}$ and $\sum_i \pi_i = 1$.

#### Solution:
The system $\boldsymbol{\pi} (\mathbf{P} - \mathbf{I}) = \mathbf{0}$ yields:
$$\begin{aligned}
-0.3 \pi_1 + 0.5 \pi_3 &= 0 &\implies \pi_3 = \frac{0.3}{0.5} \pi_1 = 0.6 \pi_1 \\
0.2 \pi_1 - 0.4 \pi_2 + 0.5 \pi_3 &= 0 \\
0.1 \pi_1 + 0.4 \pi_2 - 1.0 \pi_3 &= 0
\end{aligned}$$
Substitute $\pi_3 = 0.6 \pi_1$ into the second equation:
$$0.2 \pi_1 - 0.4 \pi_2 + 0.5(0.6 \pi_1) = 0 \implies 0.2 \pi_1 - 0.4 \pi_2 + 0.3 \pi_1 = 0$$
$$0.5 \pi_1 = 0.4 \pi_2 \implies \pi_2 = \frac{0.5}{0.4} \pi_1 = 1.25 \pi_1$$

Now apply the normalization condition $\pi_1 + \pi_2 + \pi_3 = 1$:
$$\pi_1 + 1.25 \pi_1 + 0.6 \pi_1 = 1 \implies 2.85 \pi_1 = 1 \implies \pi_1 = \frac{1}{2.85} = \frac{20}{57} \approx 0.35088$$
$$\pi_2 = 1.25 \times \frac{20}{57} = \frac{25}{57} \approx 0.43860$$
$$\pi_3 = 0.6 \times \frac{20}{57} = \frac{12}{57} \approx 0.21053$$
Sum check: $\frac{20 + 25 + 12}{57} = \frac{57}{57} = 1.0 \quad \checkmark$.

---

### Example 2.3: Marginalizing Joint Dynamics $p(s', r \mid s, a)$
A drone operates in an MDP with states $\mathcal{S} = \{\text{Low}, \text{High}\}$ and actions $\mathcal{A} = \{\text{Ascend}, \text{Hover}\}$.
The joint dynamics $p(s', r \mid s = \text{Low}, a = \text{Ascend})$ are specified in the following table:

| Next State $s'$ | Reward $r$ | Probability $p(s', r \mid \text{Low}, \text{Ascend})$ |
| :---: | :---: | :---: |
| High | $+10.0$ | $0.70$ |
| Low | $-5.0$ | $0.20$ |
| Low | $-1.0$ | $0.10$ |

1. Verify that this joint distribution is valid.
2. Calculate the marginal transition probabilities $\mathcal{P}_{\text{Low}, \text{High}}^{\text{Ascend}}$ and $\mathcal{P}_{\text{Low}, \text{Low}}^{\text{Ascend}}$.
3. Compute the expected reward $r(\text{Low}, \text{Ascend})$.
4. Compute the expected reward conditioned on destination: $r(\text{Low}, \text{Ascend}, \text{Low})$.

#### Solution:
**Step 1: Check Total Probability:**
$$\sum_{s', r} p(s', r \mid \text{Low}, \text{Ascend}) = 0.70 + 0.20 + 0.10 = 1.00 \quad \checkmark$$

**Step 2: Marginal Transition Probabilities:**
$$\mathcal{P}_{\text{Low}, \text{High}}^{\text{Ascend}} = \sum_r p(\text{High}, r \mid \text{Low}, \text{Ascend}) = 0.70$$
$$\mathcal{P}_{\text{Low}, \text{Low}}^{\text{Ascend}} = \sum_r p(\text{Low}, r \mid \text{Low}, \text{Ascend}) = 0.20 + 0.10 = 0.30$$
Notice: $0.70 + 0.30 = 1.00 \quad \checkmark$.

**Step 3: Expected Reward $r(\text{Low}, \text{Ascend})$:**
$$r(\text{Low}, \text{Ascend}) = \sum_{s', r} r \cdot p(s', r \mid \text{Low}, \text{Ascend})$$
$$r(\text{Low}, \text{Ascend}) = (+10.0)(0.70) + (-5.0)(0.20) + (-1.0)(0.10) = 7.0 - 1.0 - 0.10 = +5.90$$

**Step 4: Destination-Conditioned Expected Reward $r(\text{Low}, \text{Ascend}, \text{Low})$:**
$$r(\text{Low}, \text{Ascend}, \text{Low}) = \sum_r r \frac{p(\text{Low}, r \mid \text{Low}, \text{Ascend})}{\mathcal{P}_{\text{Low}, \text{Low}}^{\text{Ascend}}}$$
$$r(\text{Low}, \text{Ascend}, \text{Low}) = \frac{(-5.0)(0.20) + (-1.0)(0.10)}{0.30} = \frac{-1.0 - 0.10}{0.30} = \frac{-1.10}{0.30} = -3.667$$

---

### Example 2.4: Recycling Robot MDP (Sutton & Barto Classic)
A mobile recycling robot searches for soda cans. At each step, its battery level is in state $\mathcal{S} = \{\text{high}, \text{low}\}$.
- In state $\text{high}$, it can choose $a \in \{\text{search}, \text{wait}\}$.
  - If it searches: it stays $\text{high}$ with probability $\alpha = 0.8$, drops to $\text{low}$ with probability $1 - \alpha = 0.2$. It gathers cans: expected reward $r_{\text{search}} = 4.0$.
  - If it waits: it stays $\text{high}$ with probability $1.0$. Expected reward $r_{\text{wait}} = 1.0$.
- In state $\text{low}$, it can choose $a \in \{\text{search}, \text{wait}, \text{recharge}\}$.
  - If it searches: it stays $\text{low}$ with probability $\beta = 0.6$, dies (depletes entirely) with probability $1 - \beta = 0.4$. If it dies, humans rescue and recharge it to $\text{high}$, inflicting rescue penalty $-3.0$. Cans collected yield expected reward $r(low, search) = \beta(4.0) + (1-\beta)(-3.0) = 0.6(4) + 0.4(-3) = 2.4 - 1.2 = +1.2$.
  - If it waits: stays $\text{low}$ with probability $1.0$, reward $r_{\text{wait}} = 1.0$.
  - If it recharges: transitions to $\text{high}$ with probability $1.0$, reward $r_{\text{recharge}} = 0.0$.

Construct the complete state transition matrices $\mathbf{P}^{\text{search}}, \mathbf{P}^{\text{wait}}, \mathbf{P}^{\text{recharge}}$ and reward vectors $\mathbf{r}^{\text{search}}, \mathbf{r}^{\text{wait}}, \mathbf{r}^{\text{recharge}}$.

#### Solution:
State ordering: $[s_1 = \text{high}, s_2 = \text{low}]$.

1. **For Action $a = \text{search}$:**
   $$\mathbf{P}^{\text{search}} = \begin{bmatrix} \mathcal{P}_{\text{high},\text{high}}^{\text{search}} & \mathcal{P}_{\text{high},\text{low}}^{\text{search}} \\ \mathcal{P}_{\text{low},\text{high}}^{\text{search}} & \mathcal{P}_{\text{low},\text{low}}^{\text{search}} \end{bmatrix} = \begin{bmatrix} \alpha & 1 - \alpha \\ 1 - \beta & \beta \end{bmatrix} = \begin{bmatrix} 0.8 & 0.2 \\ 0.4 & 0.6 \end{bmatrix}$$
   $$\mathbf{r}^{\text{search}} = \begin{bmatrix} 4.0 \\ 1.2 \end{bmatrix}$$

2. **For Action $a = \text{wait}$:**
   $$\mathbf{P}^{\text{wait}} = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix}, \quad \mathbf{r}^{\text{wait}} = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix}$$

3. **For Action $a = \text{recharge}$ (only admissible in $\text{low}$; defined for $\text{high}$ as identity):**
   $$\mathbf{P}^{\text{recharge}} = \begin{bmatrix} 1.0 & 0.0 \\ 1.0 & 0.0 \end{bmatrix}, \quad \mathbf{r}^{\text{recharge}} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix}$$

---

### Example 2.5: Transforming a Non-Markovian Process via State Augmentation
A machine can be $\text{Operational}$ or $\text{Broken}$. Its failure probability depends on its age:
- In its 1st hour of operation: failure probability is $0.1$.
- In its 2nd hour: failure probability is $0.3$.
- In its 3rd hour or older: failure probability is $0.8$.
Once broken, it is repaired in 1 hour and returns to 1st hour operation.

1. Show why the binary state space $\mathcal{S}_{\text{naive}} = \{\text{Operational}, \text{Broken}\}$ is non-Markovian.
2. Define an augmented Markovian state space and write the corresponding transition matrix.

#### Solution:
**Step 1: Non-Markovian Failure:**
Under $\mathcal{S}_{\text{naive}}$, if $S_t = \text{Operational}$, we cannot determine $\mathbb{P}(S_{t+1} = \text{Broken} \mid S_t)$ without checking how many hours the machine has been running in the past. Thus, $\mathbb{P}(S_{t+1} \mid S_t, S_{t-1}, \dots) \neq \mathbb{P}(S_{t+1} \mid S_t)$.

**Step 2: State Augmentation:**
Incorporate machine age into the state definition:
$$\mathcal{S}_{\text{augmented}} = \{O_1, O_2, O_{\ge 3}, B\}$$
where $O_k$ denotes "Operational, operating for $k$ hours", and $B$ denotes "Broken".

The transition matrix over $[O_1, O_2, O_{\ge 3}, B]$ is:
$$\mathbf{P} = \begin{bmatrix}
0 & 0.9 & 0 & 0.1 \\
0 & 0 & 0.7 & 0.3 \\
0 & 0 & 0.2 & 0.8 \\
1.0 & 0 & 0 & 0
\end{bmatrix}$$
Every row sums to 1. The augmented state encodes all historical context, restoring the first-order Markov property.

---

### Example 2.6: POMDP Belief State Update
A tiger resides behind one of two doors: Left ($S = L$) or Right ($S = R$).
The true state is static: transition probabilities are identity.
An agent has prior belief: $b(L) = 0.5, b(R) = 0.5$.
The agent listens ($a = \text{listen}$). 
The observation model $\mathcal{O}(o \mid s, a)$ is noisy:
- $\mathbb{P}(\text{hear Left} \mid S = L) = 0.85, \quad \mathbb{P}(\text{hear Right} \mid S = L) = 0.15$
- $\mathbb{P}(\text{hear Left} \mid S = R) = 0.15, \quad \mathbb{P}(\text{hear Right} \mid S = R) = 0.85$

Suppose the agent executes action $\text{listen}$ and observes $O = \text{hear Left}$. 
Calculate the updated belief state $b'(L)$ and $b'(R)$ using Bayes' rule.

#### Solution:
Bayes' formula for static state:
$$b'(L) = \frac{\mathbb{P}(O = \text{hear Left} \mid S = L) b(L)}{\mathbb{P}(O = \text{hear Left})}$$
Denominator:
$$\begin{aligned}
\mathbb{P}(O = \text{hear Left}) &= \mathbb{P}(O = \text{hear Left} \mid L) b(L) + \mathbb{P}(O = \text{hear Left} \mid R) b(R) \\
&= (0.85)(0.50) + (0.15)(0.50) = 0.425 + 0.075 = 0.50
\end{aligned}$$
Numerator for $L$:
$$\mathbb{P}(O = \text{hear Left} \mid L) b(L) = (0.85)(0.50) = 0.425$$
Updated belief:
$$b'(L) = \frac{0.425}{0.50} = 0.85, \quad b'(R) = 1 - 0.85 = 0.15$$
A single sensory observation shifts the belief state from complete uncertainty ($0.50$) to high confidence ($0.85$).

---

### Example 2.7: Calculating Absorbing State Probabilities
An episodic MDP has states $\mathcal{S} = \{s_1, s_2, s_T\}$, where $s_T$ is an absorbing terminal state:
$$\mathbf{P} = \begin{bmatrix} 0.5 & 0.3 & 0.2 \\ 0.1 & 0.6 & 0.3 \\ 0.0 & 0.0 & 1.0 \end{bmatrix}$$
1. Partition $\mathbf{P}$ into fundamental sub-matrices $\mathbf{Q}$ (transient-to-transient) and $\mathbf{R}_{\text{abs}}$ (transient-to-absorbing).
2. Compute the Fundamental Matrix $\mathbf{N} = (\mathbf{I} - \mathbf{Q})^{-1}$.
3. What is the expected number of steps to absorption starting from state $s_1$?

#### Solution:
**Step 1: Partitioning:**
$$\mathbf{Q} = \begin{bmatrix} 0.5 & 0.3 \\ 0.1 & 0.6 \end{bmatrix}, \quad \mathbf{R}_{\text{abs}} = \begin{bmatrix} 0.2 \\ 0.3 \end{bmatrix}$$

**Step 2: Fundamental Matrix $\mathbf{N}$:**
$$\mathbf{I} - \mathbf{Q} = \begin{bmatrix} 1 - 0.5 & -0.3 \\ -0.1 & 1 - 0.6 \end{bmatrix} = \begin{bmatrix} 0.5 & -0.3 \\ -0.1 & 0.4 \end{bmatrix}$$
Determinant $\det(\mathbf{I} - \mathbf{Q}) = (0.5)(0.4) - (-0.3)(-0.1) = 0.20 - 0.03 = 0.17$.
Matrix inverse:
$$\mathbf{N} = (\mathbf{I} - \mathbf{Q})^{-1} = \frac{1}{0.17} \begin{bmatrix} 0.4 & 0.3 \\ 0.1 & 0.5 \end{bmatrix} \approx \begin{bmatrix} 2.3529 & 1.7647 \\ 0.5882 & 2.9412 \end{bmatrix}$$

**Step 3: Expected Time to Absorption:**
The vector of expected steps to absorption is $\mathbf{t} = \mathbf{N} \mathbf{1}$:
$$t_1 = 2.3529 + 1.7647 = 4.1176 \text{ steps}$$
$$t_2 = 0.5882 + 2.9412 = 3.5294 \text{ steps}$$
Starting from $s_1$, the expected time until reaching terminal state $s_T$ is $\approx 4.12$ steps.

---

### Example 2.8: Joint Action Spaces in Multi-Agent MDPs
Suppose two autonomous rovers $R_1$ and $R_2$ coordinate on a grid. Each rover independently has action set $\mathcal{A}_i = \{\text{North}, \text{South}, \text{East}, \text{West}, \text{Stay}\}$.
1. What is the cardinality of the joint action space $\boldsymbol{\mathcal{A}} = \mathcal{A}_1 \times \mathcal{A}_2$?
2. If there are $M = 5$ rovers, how many joint actions exist?
3. What implications does this exponential growth have for centralized MDP solvers?

#### Solution:
**Step 1: 2-Rover Joint Action Space:**
$$|\boldsymbol{\mathcal{A}}| = |\mathcal{A}_1| \times |\mathcal{A}_2| = 5 \times 5 = 25 \text{ joint actions}$$

**Step 2: 5-Rover Joint Action Space:**
$$|\boldsymbol{\mathcal{A}}| = 5^5 = 3,125 \text{ joint actions}$$

**Step 3: Implications:**
The joint action space grows exponentially with the number of agents: $|\boldsymbol{\mathcal{A}}| = |\mathcal{A}|^M$. In centralized dynamic programming, calculating $\max_{\mathbf{a} \in \boldsymbol{\mathcal{A}}} Q(s, \mathbf{a})$ requires evaluating $3,125$ candidate joint actions per state at every sweep. For $M = 10$, $|\boldsymbol{\mathcal{A}}| = 5^{10} \approx 9.76 \times 10^6$, rendering centralized tabular Bellman optimization intractable and necessitating decentralized or factorized value architectures.

---

### Example 2.9: Epistemic vs Aleatoric Uncertainty in MDP Transitions
An automated surgery robot makes a delicate incision:
- Option A: Standard laser incision. Succeeds with probability $p = 0.999$, fails with probability $0.001$.
- Option B: Experimental acoustic pulse. The true physical success rate $p$ is unknown, but drawn from a prior distribution $\text{Beta}(1, 1) = \text{Uniform}(0, 1)$.

Differentiate between the aleatoric and epistemic uncertainty in this MDP, and explain how an agent resolves each.

#### Solution:
- **Aleatoric Uncertainty (Statistical / Physical Noise):** In Option A, the physical system has an inherent failure rate of $0.001$ caused by thermal fluctuations. Even with infinite data, this variance cannot be eliminated. The agent cannot "learn away" this risk; it must plan policies that are robust to stochastic outcomes.
- **Epistemic Uncertainty (Lack of Knowledge):** In Option B, the agent does not know $p$. This uncertainty is not an intrinsic property of the physics; it is a limitation of the agent's current knowledge base. By taking action B repeatedly (exploration), the agent collects empirical samples, shrinking the posterior variance of $\text{Beta}(\alpha, \beta)$ toward zero via the Law of Large Numbers.

---

### Example 2.10: State Redundancy and Minimal Markov State Representation
An agent navigates a 1D line: position $x \in \mathbb{Z}$. At step $t$, its sensor suite reports:
$$\mathbf{s}_t = (x_t, \text{time of day } T_t, \text{ambient temperature } \theta_t, \text{serial number of robot } ID)$$
The true movement physics are $x_{t+1} = x_t + a_t + \epsilon_t$, with reward $R_{t+1} = -(x_{t+1})^2$.
Determine the minimal sufficient state representation $S_t^*$ that satisfies the Markov property for this MDP.

#### Solution:
The conditional transition probability is:
$$\mathbb{P}(x_{t+1}, R_{t+1} \mid x_t, T_t, \theta_t, ID, a_t) = \mathbb{P}(x_{t+1}, R_{t+1} \mid x_t, a_t)$$
Because $T_t$, $\theta_t$, and $ID$ are statistically independent of $x_{t+1}$ and $R_{t+1}$ given $(x_t, a_t)$, their mutual information with the future is zero:
$$I(x_{t+1}, R_{t+1} ; (T_t, \theta_t, ID) \mid x_t, a_t) = 0$$
The minimal sufficient state representation is simply:
$$S_t^* = x_t$$
Retaining superfluous variables swells the state space cardinality unnecessarily, triggering the curse of dimensionality without providing any predictive utility.

---

## 2.6 Solved Exercises

### Exercise 2.1: Valid Transition Kernel Identification
Which of the following matrices is a valid transition matrix for an MDP?
$$\mathbf{A} = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.7 \end{bmatrix}, \quad \mathbf{B} = \begin{bmatrix} 1.0 & 0.0 \\ -0.1 & 1.1 \end{bmatrix}, \quad \mathbf{C} = \begin{bmatrix} 0.4 & 0.6 \\ 1.0 & 0.0 \end{bmatrix}$$

#### Solution:
- Matrix $\mathbf{A}$: Row 2 sums to $0.2 + 0.7 = 0.9 \neq 1.0$. Invalid.
- Matrix $\mathbf{B}$: Row 2 contains a negative probability $-0.1 < 0$. Invalid.
- Matrix $\mathbf{C}$: Row 1 sums to $0.4 + 0.6 = 1.0$; Row 2 sums to $1.0 + 0.0 = 1.0$; all elements $\ge 0$. **Valid.**

---

### Exercise 2.2: Computing Multi-Step Markov Transition Probabilities
Given transition matrix $\mathbf{P} = \begin{bmatrix} 0.8 & 0.2 \\ 0.3 & 0.7 \end{bmatrix}$, calculate the 2-step transition probability $\mathcal{P}_{1, 2}^{(2)} = \mathbb{P}(S_{t+2} = s_2 \mid S_t = s_1)$.

#### Solution:
By the Chapman-Kolmogorov equations, $\mathbf{P}^{(2)} = \mathbf{P}^2$:
$$\mathbf{P}^2 = \begin{bmatrix} 0.8 & 0.2 \\ 0.3 & 0.7 \end{bmatrix} \begin{bmatrix} 0.8 & 0.2 \\ 0.3 & 0.7 \end{bmatrix} = \begin{bmatrix} 0.8(0.8) + 0.2(0.3) & 0.8(0.2) + 0.2(0.7) \\ 0.3(0.8) + 0.7(0.3) & 0.3(0.2) + 0.7(0.7) \end{bmatrix}$$
$$\mathcal{P}_{1, 2}^{(2)} = 0.8(0.2) + 0.2(0.7) = 0.16 + 0.14 = 0.30$$

---

### Exercise 2.3: Deriving the Expected Reward Vector
An agent in state $s$ chooses action $a$. With probability $0.4$, it moves to $s_1$ and receives $R = +2.0$. With probability $0.6$, it moves to $s_2$ and receives $R = -1.0$.
Compute $r(s, a)$.

#### Solution:
$$r(s, a) = \sum_{s', r} r \cdot p(s', r \mid s, a) = (0.4)(+2.0) + (0.6)(-1.0) = 0.8 - 0.6 = +0.20$$

---

### Exercise 2.4: Periodicity of a Markov Chain
Determine whether the Markov chain with transition matrix $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ is periodic or aperiodic, and state its period $d$.

#### Solution:
Starting in state $1$, the chain moves to state $2$ at $t = 1$, returns to state $1$ at $t = 2$, state $2$ at $t = 3$, and state $1$ at $t = 4$. 
The set of return times to state 1 is $\{2, 4, 6, 8, \dots\}$.
The period is the greatest common divisor:
$$d = \gcd(2, 4, 6, \dots) = 2$$
The chain is **periodic** with period $d = 2$. It does not possess a limiting stationary distribution that is independent of initial conditions.

---

### Exercise 2.5: Ergodicity Requirement for Unique Stationary Distribution
State the two conditions a finite Markov chain must satisfy to guarantee the existence of a unique, strictly positive stationary distribution $\boldsymbol{\pi} > \mathbf{0}$.

#### Solution:
1. **Irreducibility:** Every state must be reachable from every other state in a finite number of steps (the transition graph forms a single strongly connected component).
2. **Aperiodicity:** The period of every state must equal 1 ($d = 1$). A sufficient condition is that at least one state has a self-loop ($\mathcal{P}_{ii} > 0$).

---

### Exercise 2.6: Markov Decision Process with State-Dependent Action Sets
Explain why defining admissible action sets $\mathcal{A}(s)$ as state-dependent is mathematically equivalent to defining a global action set $\mathcal{A} = \bigcup_{s} \mathcal{A}(s)$ with transition penalties.

#### Solution:
One can define a global action set $\mathcal{A}$ where any action $a \notin \mathcal{A}(s)$ taken in state $s$ results in an immediate transition to an absorbing catastrophic penalty state or leaves the state unchanged ($S_{t+1} = s$) while emitting a catastrophic negative reward $R = -\infty$ (or a sufficiently large finite penalty $-M$). Under Bellman optimality, any optimal policy will assign zero probability to such actions, reproducing the exact behavior of state-dependent constraints $\mathcal{A}(s)$.

---

### Exercise 2.7: Deterministic vs Stochastic MDP Transitions
In an MDP, if $p(s', r \mid s, a) \in \{0, 1\}$ for all $s, a, s', r$, how do the transition kernel $\mathcal{P}_{s, s'}^a$ and reward function $r(s, a)$ simplify?

#### Solution:
The transitions and rewards become deterministic functions:
$$s' = f(s, a), \quad r = R(s, a)$$
The transition probability kernel collapses to a Dirac delta:
$$\mathcal{P}_{s, s''}^a = \begin{cases} 1 & \text{if } s'' = f(s, a) \\ 0 & \text{otherwise} \end{cases}$$
and the expected reward is simply $r(s, a) = R(s, a)$.

---

### Exercise 2.8: Partially Observable Coin Toss
A coin is either Fair ($F$) or Double-Headed ($D$). Once selected at $t = 0$, the coin never changes.
At each step, the agent tosses the coin and observes $O \in \{\text{Heads}, \text{Tails}\}$.
Prior belief is $b_0(F) = 0.5, b_0(D) = 0.5$.
If the agent observes 3 Heads in a row, compute the posterior belief $b_3(D)$.

#### Solution:
Likelihoods:
- $\mathbb{P}(3 \text{ Heads} \mid D) = 1.0^3 = 1.0$
- $\mathbb{P}(3 \text{ Heads} \mid F) = (0.5)^3 = 0.125$

By Bayes' rule:
$$b_3(D) = \frac{\mathbb{P}(3H \mid D) b_0(D)}{\mathbb{P}(3H \mid D) b_0(D) + \mathbb{P}(3H \mid F) b_0(F)} = \frac{1.0(0.5)}{1.0(0.5) + 0.125(0.5)} = \frac{0.5}{0.5 + 0.0625} = \frac{0.5}{0.5625} = \frac{8}{9} \approx 0.8889$$
The belief that the coin is double-headed rises to $\approx 88.9\%$.

---

### Exercise 2.9: Reward Function Invariance Under Rescaling
Suppose an environment designer multiplies all rewards by a factor of 10: $R'_{t+1} = 10 R_{t+1}$.
Does the set of optimal policies $\Pi^* = \arg\max_\pi v_\pi(s)$ change? Prove your answer.

#### Solution:
Let the return under the original reward be $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$.
Under the scaled reward, $G'_t = \sum_{k=0}^\infty \gamma^k (10 R_{t+k+1}) = 10 \sum_{k=0}^\infty \gamma^k R_{t+k+1} = 10 G_t$.
By linearity of expectation:
$$v'_\pi(s) = \mathbb{E}_\pi[G'_t \mid S_t = s] = 10 \mathbb{E}_\pi[G_t \mid S_t = s] = 10 v_\pi(s)$$
Since maximizing $f(x)$ is strictly identical to maximizing $10 f(x)$ for any positive scalar, $\arg\max_\pi 10 v_\pi(s) = \arg\max_\pi v_\pi(s)$.
The set of optimal policies $\Pi^*$ remains completely identical.

---

### Exercise 2.10: Verifying Markov Property from Empirical Observation Sequences
A researcher records a binary process: $0, 1, 0, 1, 0, 1, 0, 1, \dots$ alternating indefinitely.
Is the state representation $S_t \in \{0, 1\}$ Markovian?

#### Solution:
Yes. Given $S_t = 0$, the next state is deterministically $S_{t+1} = 1$:
$$\mathbb{P}(S_{t+1} = 1 \mid S_t = 0) = 1.0$$
Given $S_t = 1$, the next state is deterministically $S_{t+1} = 0$:
$$\mathbb{P}(S_{t+1} = 0 \mid S_t = 1) = 1.0$$
Knowing previous states $S_{t-1}, S_{t-2}, \dots$ provides no additional information, because $\mathbb{P}(S_{t+1} \mid S_t, S_{t-1}, \dots) = \mathbb{P}(S_{t+1} \mid S_t) \in \{0, 1\}$. 
Thus, the single-bit state representation is strictly Markovian.
