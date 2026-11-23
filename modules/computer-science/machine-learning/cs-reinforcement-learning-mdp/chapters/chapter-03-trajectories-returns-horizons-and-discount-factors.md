# Chapter 3: Trajectories, Returns, Horizons, and Discount Factors

---

## 3.1 Episodic vs. Continuing Tasks: The Nature of Time in MDPs

In sequential decision-making, the operational lifespan of an agent falls cleanly into two foundational categories: **Episodic Tasks** and **Continuing Tasks**.

```
   EPISODIC TASK: Finite Sequences with Absorbing Terminal States
  ┌───────┐  A_0   ┌───────┐  A_1   ┌───────┐  A_{T-1} ┌───────────────┐
  │  S_0  ├───────►│  S_1  ├───────►│  S_2  ├─────────►│  S_T (TERMINAL)│
  └───────┘ R_1    └───────┘ R_2    └───────┘ R_T      └───────┬───────┘
                                                               │ Loop forever with
                                                               └──► R = 0
  
   CONTINUING TASK: Infinite-Horizon Seamless Stream
  ┌───────┐  A_0   ┌───────┐  A_1   ┌───────┐  A_2     ┌───────┐
  │  S_0  ├───────►│  S_1  ├───────►│  S_2  ├─────────►│  S_3  ├────► ... ──► ∞
  └───────┘ R_1    └───────┘ R_2    └───────┘ R_3      └───────┘
```

### 1. Episodic Tasks
In an episodic task, the agent-environment interaction naturally breaks down into identifiable, finite-duration sequences called **Episodes** or **Trials**.
- Examples include a game of chess, a round of Go, navigating a maze, or landing a spacecraft.
- Each episode begins at time $t = 0$ in an initial state $S_0 \sim \mu_0$ drawn from an initial state distribution $\mu_0$.
- The episode proceeds through a sequence of decisions until time step $t = T$, where the agent reaches a special state designated as the **Terminal State** $S_T \in \mathcal{S}^+$, where $\mathcal{S}^+$ denotes the state space augmented with terminal states.
- Upon reaching $S_T$, the environment is reset to a new starting state $S_0$, and the next episode commences independently.
- The episode duration $T$ is generally a random variable that varies from trial to trial.

#### The Unified Absorbing State Representation
To unify the mathematical treatment of episodic and continuing tasks under a single notation, Sutton & Barto introduced the concept of the **absorbing terminal state**:
Once the agent enters a terminal state $S_T$, all future actions lead back to $S_T$ with probability 1.0, and all future rewards are identically zero:
$$\mathcal{P}_{S_T, S_T}^a = 1.0, \quad R_{t+1} = 0, \quad \forall t \ge T, \forall a \in \mathcal{A}$$
Under this formulation, every episodic task can be treated formally as an infinite-horizon continuing task whose return stops accumulating once absorption occurs.

### 2. Continuing Tasks
In a continuing task, the agent-environment interaction does not naturally divide into discrete episodes; it flows continuously without termination.
- Examples include an automated temperature control system in a data center, an algorithmic high-frequency trading market maker, or an industrial chemical plant refinery.
- The time index stretches toward infinity: $t \to \infty$.
- Without special mathematical mechanisms, accumulating rewards forever over an infinite horizon would cause the cumulative sum to diverge to $\pm \infty$.

---

## 3.2 Trajectories and the Probability Space of Decision Paths

An agent interacting with an environment generates an alternating sequence of states, actions, and rewards. This realization is termed a **Trajectory** or **Rollout** $\tau$:
$$\tau \doteq (S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, \dots, S_{T-1}, A_{T-1}, R_T, S_T)$$

```
                                  TRAJECTORY TREE
                                        (S_0)
                                       /     \
                                 A_0  ●       ●
                                     / \     / \
                               (S_1)    (S_1') ...
                                 │
                                A_1
                                 │
                               (S_2)
                                 │
                                ...
                                 │
                               (S_T) Terminal State
```

### The Probability Measure Induced by Policy $\pi$
Let the agent follow a stationary stochastic policy $\pi(a \mid s) \doteq \mathbb{P}(A_t = a \mid S_t = s)$. 
Let the environment possess transition dynamics $p(s', r \mid s, a)$.
Given an initial state distribution $p(s_0)$, the joint probability density (or probability mass) of observing an entire trajectory $\tau$ of length $T$ is given by the product of conditional factors:

$$p_\pi(\tau) = p(s_0) \prod_{t=0}^{T-1} \pi(a_t \mid s_t) p(s_{t+1}, r_{t+1} \mid s_t, a_t)$$

This factorized density reveals the explicit division of responsibility:
- The agent directly controls the policy terms $\pi(a_t \mid s_t)$.
- The environment controls the initial state $p(s_0)$ and the transition-reward dynamics $p(s_{t+1}, r_{t+1} \mid s_t, a_t)$.

Any expectation over trajectories $\mathbb{E}_\pi [f(\tau)]$ is taken with respect to this probability measure $p_\pi(\tau)$:
$$\mathbb{E}_\pi [f(\tau)] = \int_{\tau} p_\pi(\tau) f(\tau) d\tau \quad \text{or} \quad \sum_{\tau} p_\pi(\tau) f(\tau)$$

---

## 3.3 The Cumulative Return: $G_t$ and the Recursive Decomposition

The foundational objective of an agent at time step $t$ is not to maximize the immediate reward $R_{t+1}$, but to maximize the expected value of the **Return** $G_t$.

### Formal Definition of Discounted Return
For a general task with temporal discount factor $\gamma \in [0, 1]$, the return $G_t$ is defined as the discounted sum of all future rewards received after time $t$:

$$G_t \doteq R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$$

If the task is episodic with finite termination time $T$, rewards beyond $T$ are zero, and the sum terminates naturally:
$$G_t = \sum_{k=0}^{T - t - 1} \gamma^k R_{t+k+1}$$

### The Fundamental Recursive Identity
The return satisfies a recursive relationship that forms the algebraic backbone of reinforcement learning:

$$\begin{aligned}
G_t &= R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \gamma^3 R_{t+4} + \dots \\
&= R_{t+1} + \gamma \left( R_{t+2} + \gamma R_{t+3} + \gamma^2 R_{t+4} + \dots \right) \\
&= R_{t+1} + \gamma G_{t+1}
\end{aligned}$$

$$G_t = R_{t+1} + \gamma G_{t+1}$$

This decomposition states that **the return today is the immediate reward plus the discounted return tomorrow**. It allows learning algorithms to compute estimates recursively step-by-step rather than waiting for the entire future history to unfold.

---

## 3.4 The Three Interpretations of the Discount Factor $\gamma$

Why do we introduce the discount factor $\gamma \in [0, 1)$? Why not simply maximize the unweighted sum of rewards $\sum R$?
The parameter $\gamma$ serves three distinct, profound roles:

```
                                  ROLES OF THE DISCOUNT FACTOR γ
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
    ┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
    │     1. MATHEMATICAL     │    │       2. ECONOMIC       │    │      3. STOCHASTIC      │
    │ Bounding infinite sums  │    │ Present value of money  │    │ Random termination /    │
    │ Prevents divergence     │    │ Inflation & opportunity │    │ Mortality hazard rate   │
    │ to ±∞ in continuing     │    │ cost of delay:          │    │ p_term = 1 - γ          │
    │ tasks.                  │    │ $1 today > $1 tomorrow  │    │ per time step.          │
    └─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

### 1. The Mathematical Role: Bounding Infinite Series
In an infinite-horizon continuing task, if an agent earns a constant positive reward $R_{t+1} = +1$ at every step, an undiscounted sum ($\gamma = 1$) diverges:
$$G_t = \sum_{k=0}^{\infty} 1 = \infty$$
When every policy produces an infinite return, all policies appear identically good ($+\infty = +\infty$). The agent cannot distinguish between a policy that earns $+100$ per step and one that earns $+0.001$ per step.

Introducing $\gamma < 1$ guarantees that the series converges to a finite scalar. If rewards are bounded by $|R_{t+1}| \le R_{\max}$, then by the geometric series formula:
$$|G_t| \le \sum_{k=0}^\infty \gamma^k |R_{t+k+1}| \le R_{\max} \sum_{k=0}^\infty \gamma^k = \frac{R_{\max}}{1 - \gamma} < \infty$$

### 2. The Economic Role: Present Discounted Value
In financial economics, a dollar received today is worth strictly more than a dollar received ten years from now. 
- A dollar held today can be invested at a risk-free interest rate $r$, compounding continuously to $e^{rt}$.
- Future promises carry counterparty risk, currency inflation, and liquidity constraints.
The discount factor $\gamma$ models this exact economic time preference:
$$\gamma = \frac{1}{1 + r}$$
where $r > 0$ is the internal discount rate per time step.

### 3. The Stochastic Role: Constant Hazard Rate of Termination
Consider an agent operating in an environment where at every single time step, there is a constant probability $p_{\text{die}} = 1 - \gamma$ that a catastrophic event (a lightning strike, battery failure, or server crash) destroys the agent and terminates the process.

Let $K$ be the random variable denoting the step at which termination occurs. Because the hazard rate is constant, $K$ follows a geometric distribution:
$$\mathbb{P}(K = k) = (1 - p_{\text{die}})^k p_{\text{die}} = \gamma^k (1 - \gamma)$$
The expected undiscounted return of an agent facing this random mortality is mathematically identical to the expected discounted return of an immortal agent with discount factor $\gamma$:

$$\mathbb{E}_{\text{mortality}}\left[ \sum_{t=0}^K R_{t+1} \right] = \mathbb{E}\left[ \sum_{k=0}^\infty \gamma^k R_{k+1} \right]$$

Thus, discounting by $\gamma$ is mathematically isomorphic to planning under a constant per-step risk of sudden death.

---

## 3.5 The Horizon Spectrum: Myopia vs. Farsightedness

The numerical choice of $\gamma \in [0, 1)$ governs the cognitive horizon of the agent:

```
  γ = 0.0                      γ = 0.50                    γ = 0.90                    γ = 0.999
 ┌───────────┐                ┌───────────┐               ┌───────────┐               ┌───────────┐
 │  MYOPIC   │                │ SHORT-    │               │ BALANCED  │               │ FARSIGHTED│
 │ (Greedy)  │                │ SIGHTED   │               │ HORIZON   │               │ STRATEGIST│
 └─────┬─────┘                └─────┬─────┘               └─────┬─────┘               └─────┬─────┘
       │                            │                           │                           │
       ▼                            ▼                           ▼                           ▼
 H_eff = 1 step               H_eff = 2 steps             H_eff = 10 steps            H_eff = 1,000 steps
 Considers only               Weighs next 2-3             Standard RL                 Deep planning; high
 immediate R_{t+1}.           steps heavily.              default benchmark.          variance gradients.
```

- **$\gamma \to 0$ (The Myopic / Short-Sighted Limit):**
  $$G_t = R_{t+1} + 0 \cdot G_{t+1} = R_{t+1}$$
  The agent completely ignores the future. It acts as a purely greedy local optimizer, evaluating actions solely on their instantaneous payoff. It will happily step into a lethal trapdoor if doing so yields a single breadcrumb right now.
- **$\gamma \to 1$ (The Farsighted / Long-Horizon Limit):**
  The agent weighs rewards far in the distant future nearly as heavily as rewards occurring in the next millisecond. In complex strategic domains like chess or robotics, high values ($\gamma = 0.99$ to $0.999$) are required to enable multi-step combinations and delayed plans.
- **The Variance Penalty of Farsightedness:** As $\gamma \to 1$, the effective sample variance of empirical return estimators explodes like $O\left(\frac{1}{(1 - \gamma)^2}\right)$, requiring exponentially more sample trajectories to stabilize value estimates.

---

## 3.6 Worked Examples: Returns and Horizons

### Example 3.1: Step-by-Step Return Computation Along a Trajectory
An autonomous navigation robot records the following trajectory through a discrete grid:
$$\tau = (S_0, A_0, R_1 = -1, S_1, A_1, R_2 = -1, S_2, A_2, R_3 = -1, S_3, A_3, R_4 = +50, S_4)$$
where $S_4$ is an absorbing terminal state.
Assuming $\gamma = 0.90$:
1. Calculate the realized returns $G_0, G_1, G_2, G_3$.
2. Verify the recursive identity $G_t = R_{t+1} + \gamma G_{t+1}$ at every time step.

#### Solution:
**Step 1: Backward Recursion from Terminal State:**
At terminal step $t = 4$, $G_4 = 0$.
- For $t = 3$:
  $$G_3 = R_4 + \gamma G_4 = +50 + (0.90)(0) = +50.0$$
- For $t = 2$:
  $$G_2 = R_3 + \gamma G_3 = -1 + (0.90)(50.0) = -1 + 45.0 = +44.0$$
- For $t = 1$:
  $$G_1 = R_2 + \gamma G_2 = -1 + (0.90)(44.0) = -1 + 39.6 = +38.6$$
- For $t = 0$:
  $$G_0 = R_1 + \gamma G_1 = -1 + (0.90)(38.6) = -1 + 34.74 = +33.74$$

**Step 2: Forward Verification:**
$$G_0 = R_1 + \gamma R_2 + \gamma^2 R_3 + \gamma^3 R_4$$
$$G_0 = -1 + (0.90)(-1) + (0.90)^2(-1) + (0.90)^3(50)$$
$$G_0 = -1 - 0.90 - 0.81 + (0.729)(50) = -2.71 + 36.45 = +33.74 \quad \checkmark$$
Every step satisfies $G_t = R_{t+1} + \gamma G_{t+1}$.

---

### Example 3.2: Discount Factor Sensitivity in Path Selection
An agent at $S_0$ can choose between Path A and Path B:
- **Path A (Short path):** 2 steps to goal. $R_1 = -2, R_2 = +10$.
- **Path B (Long safe path):** 5 steps to goal. $R_1 = -0.1, R_2 = -0.1, R_3 = -0.1, R_4 = -0.1, R_5 = +12$.
Terminal state follows immediately after reaching the goal.

1. Write the algebraic return functions $G_A(\gamma)$ and $G_B(\gamma)$.
2. Calculate the returns for $\gamma = 0.50$ and $\gamma = 0.95$.
3. Find the exact crossover discount factor $\gamma^*$ where both paths yield identical returns.

#### Solution:
**Step 1: Algebraic Expressions:**
$$G_A(\gamma) = -2 + 10\gamma$$
$$G_B(\gamma) = -0.1(1 + \gamma + \gamma^2 + \gamma^3) + 12\gamma^4 = -0.1 \frac{1 - \gamma^4}{1 - \gamma} + 12\gamma^4$$

**Step 2: Evaluations:**
- At $\gamma = 0.50$:
  $$G_A(0.5) = -2 + 10(0.5) = -2 + 5 = +3.0$$
  $$G_B(0.5) = -0.1(1 + 0.5 + 0.25 + 0.125) + 12(0.5)^4 = -0.1(1.875) + 12(0.0625) = -0.1875 + 0.75 = +0.5625$$
  Here, $G_A(0.5) > G_B(0.5)$: the agent prefers Path A.
- At $\gamma = 0.95$:
  $$G_A(0.95) = -2 + 10(0.95) = +7.5$$
  $$G_B(0.95) = -0.1(1 + 0.95 + 0.9025 + 0.857375) + 12(0.95)^4 = -0.1(3.709875) + 12(0.814506) = -0.371 + 9.774 = +9.403$$
  Here, $G_B(0.95) > G_A(0.95)$: the agent prefers Path B.

**Step 3: Crossover Factor $\gamma^*$:**
Setting $-2 + 10\gamma = -0.1(1 + \gamma + \gamma^2 + \gamma^3) + 12\gamma^4$:
$$12\gamma^4 - 0.1\gamma^3 - 0.1\gamma^2 - 10.1\gamma + 1.9 = 0$$
Using root-finding (Newton-Raphson or numerical bisection):
- At $\gamma = 0.80$: $G_A = 6.0$, $G_B = -0.1(2.952) + 12(0.4096) = -0.295 + 4.915 = 4.62$ ($G_A > G_B$).
- At $\gamma = 0.88$: $G_A = 6.8$, $G_B = -0.1(3.35) + 12(0.5997) = -0.335 + 7.196 = 6.861$ ($G_B > G_A$).
Solving yields $\gamma^* \approx 0.876$.
Below $0.876$, the agent takes the aggressive short path; above $0.876$, it prefers the patient, higher-yield long path.

---

### Example 3.3: Probability Distribution over Trajectories
Consider a toy MDP with states $\mathcal{S} = \{s_0, s_1, s_T\}$ and actions $\mathcal{A} = \{a_1, a_2\}$.
- The agent starts in $s_0$ with probability $1.0$.
- In state $s_0$, policy $\pi(a_1 \mid s_0) = 0.6, \pi(a_2 \mid s_0) = 0.4$.
- Environment dynamics:
  - If $a_1$ is taken in $s_0$: moves to $s_1$ with prob $0.8$ ($R = +1$), and to $s_T$ with prob $0.2$ ($R = -10$).
  - If $a_2$ is taken in $s_0$: moves to $s_1$ with prob $0.3$ ($R = +5$), and to $s_T$ with prob $0.7$ ($R = 0$).
- In state $s_1$: the agent always takes $a_1$ ($\pi(a_1 \mid s_1) = 1.0$), transitioning deterministically to $s_T$ with reward $R = +2$.

Compute the probability $p_\pi(\tau)$ and the return $G_0(\tau)$ (with $\gamma = 0.90$) for all possible trajectories.

#### Solution:
There are 4 distinct complete trajectories ending in $s_T$:

1. **Trajectory $\tau_1 = (s_0, a_1, R_1 = -10, s_T)$:**
   $$p(\tau_1) = p(s_0) \pi(a_1 \mid s_0) p(s_T, -10 \mid s_0, a_1) = 1.0 \times 0.6 \times 0.2 = 0.12$$
   $$G_0(\tau_1) = -10.0$$

2. **Trajectory $\tau_2 = (s_0, a_1, R_1 = +1, s_1, a_1, R_2 = +2, s_T)$:**
   $$p(\tau_2) = 1.0 \times 0.6 \times 0.8 \times 1.0 \times 1.0 = 0.48$$
   $$G_0(\tau_2) = +1 + (0.90)(+2) = +1 + 1.8 = +2.8$$

3. **Trajectory $\tau_3 = (s_0, a_2, R_1 = 0, s_T)$:**
   $$p(\tau_3) = 1.0 \times 0.4 \times 0.7 = 0.28$$
   $$G_0(\tau_3) = 0.0$$

4. **Trajectory $\tau_4 = (s_0, a_2, R_1 = +5, s_1, a_1, R_2 = +2, s_T)$:**
   $$p(\tau_4) = 1.0 \times 0.4 \times 0.3 \times 1.0 \times 1.0 = 0.12$$
   $$G_0(\tau_4) = +5 + (0.90)(+2) = +5 + 1.8 = +6.8$$

**Verification of Total Probability:**
$$\sum_{i=1}^4 p(\tau_i) = 0.12 + 0.48 + 0.28 + 0.12 = 1.00 \quad \checkmark$$

**Expected Return $\mathbb{E}_\pi [G_0]$:**
$$\begin{aligned}
\mathbb{E}_\pi [G_0] &= 0.12(-10.0) + 0.48(+2.8) + 0.28(0.0) + 0.12(+6.8) \\
&= -1.20 + 1.344 + 0.0 + 0.816 = +0.96
\end{aligned}$$

---

### Example 3.4: Bounding Return Variance
Suppose an agent operates in a continuing task where rewards are independent and identically distributed (i.i.d.) random variables with mean $\mu = \mathbb{E}[R]$ and variance $\sigma^2 = \text{Var}(R)$.
Derive the analytical formula for the variance of the discounted return $\text{Var}(G_t)$ as a function of $\sigma^2$ and $\gamma \in [0, 1)$.

#### Solution:
The return is:
$$G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$$
Because the rewards are independent, the variance of a linear combination of independent random variables equals the sum of the squared coefficients times their respective variances:
$$\text{Var}(G_t) = \text{Var}\left( \sum_{k=0}^\infty \gamma^k R_{t+k+1} \right) = \sum_{k=0}^\infty \text{Var}(\gamma^k R_{t+k+1})$$
Since $\text{Var}(c X) = c^2 \text{Var}(X)$:
$$\text{Var}(G_t) = \sum_{k=0}^\infty (\gamma^k)^2 \text{Var}(R_{t+k+1}) = \sigma^2 \sum_{k=0}^\infty (\gamma^2)^k$$
Since $\gamma \in [0, 1)$, $\gamma^2 < 1$. The infinite geometric series converges to:
$$\sum_{k=0}^\infty (\gamma^2)^k = \frac{1}{1 - \gamma^2}$$
Therefore:
$$\text{Var}(G_t) = \frac{\sigma^2}{1 - \gamma^2}$$
Notice that as $\gamma \to 1$:
$$1 - \gamma^2 = (1 - \gamma)(1 + \gamma) \approx 2(1 - \gamma)$$
$$\text{Var}(G_t) \approx \frac{\sigma^2}{2(1 - \gamma)}$$
The variance scales inversely with $1 - \gamma$. As $\gamma \to 1$, variance approaches infinity, illustrating the severe credit assignment noise in long-horizon learning.

---

### Example 3.5: Cyclic Rewards in an Infinite-Horizon Continuing Task
An agent cycles perpetually between three states: $s_0 \to s_1 \to s_2 \to s_0$, earning rewards $R_1 = +2, R_2 = -1, R_3 = +5$ at each cycle.
Calculate the exact infinite-horizon discounted return $G_0$ starting at $s_0$ with discount factor $\gamma \in [0, 1)$.

#### Solution:
The reward sequence from $t = 0$ is periodic with period 3:
$$\mathbf{R} = (+2, -1, +5, +2, -1, +5, +2, -1, +5, \dots)$$
We can group the return into blocks of 3 steps:
$$G_0 = \sum_{m=0}^\infty \gamma^{3m} \left( R_1 + \gamma R_2 + \gamma^2 R_3 \right)$$
Let $B$ be the return of a single 3-step cycle:
$$B = R_1 + \gamma R_2 + \gamma^2 R_3 = 2 - \gamma + 5\gamma^2$$
Then:
$$G_0 = B \sum_{m=0}^\infty (\gamma^3)^m = \frac{B}{1 - \gamma^3} = \frac{2 - \gamma + 5\gamma^2}{1 - \gamma^3}$$
For example, if $\gamma = 0.90$:
- $B = 2 - 0.90 + 5(0.81) = 1.10 + 4.05 = 5.15$
- $\gamma^3 = 0.729 \implies 1 - \gamma^3 = 0.271$
- $G_0 = \frac{5.15}{0.271} \approx 19.0037$

---

### Example 3.6: Continuous-Time Interest Rate Mapping
In continuous-time financial engineering, money compounds continuously according to the discount factor $e^{-\rho \Delta t}$, where $\rho > 0$ is the continuous discount rate and $\Delta t$ is the discrete time step duration.
1. Show how $\gamma$ relates to $\rho$ and $\Delta t$.
2. If an RL agent acts at a control frequency of $100\text{ Hz}$ ($\Delta t = 0.01\text{ s}$), and the physical designer specifies that rewards 10 seconds in the future should be discounted by $50\%$, compute the required per-step discount factor $\gamma$.

#### Solution:
**Step 1: Relationship:**
In discrete time:
$$\gamma = e^{-\rho \Delta t}$$

**Step 2: Calculate $\gamma$:**
A reward 10 seconds in the future represents $N$ discrete steps:
$$N = \frac{10\text{ s}}{\Delta t} = \frac{10\text{ s}}{0.01\text{ s}} = 1,000 \text{ steps}$$
We require the discount over 1,000 steps to equal $0.50$:
$$\gamma^{1000} = 0.50$$
Taking the 1,000th root:
$$\gamma = (0.50)^{1/1000} = (0.50)^{0.001} \approx 0.999307$$
At high control frequencies (100 Hz), the discount factor must be set extremely close to 1 ($\gamma \approx 0.9993$) to preserve planning horizons on human-perceptible timescales.

---

### Example 3.7: The Hazard Rate Equivalence Proof
Prove analytically that an immortal agent discounting rewards with $\gamma$ has the identical expected return as an agent whose environment terminates with independent probability $p = 1 - \gamma$ at each step without discounting ($\gamma_{\text{die}} = 1$).

#### Solution:
Let the termination step $T$ follow a geometric distribution:
$$\mathbb{P}(T > t) = (1 - p)^t = \gamma^t$$
The agent receives rewards $R_1, R_2, \dots$ as long as the episode has not terminated prior to time step $t+1$.
Define an indicator random variable $\mathbb{I}(T \ge t+1)$ which equals 1 if the agent is still alive at step $t+1$, and 0 otherwise.
The undiscounted return until termination is:
$$G_{\text{die}} = \sum_{t=0}^\infty R_{t+1} \mathbb{I}(T \ge t+1)$$
Taking the expectation with respect to the survival distribution:
$$\mathbb{E}_T [G_{\text{die}}] = \sum_{t=0}^\infty R_{t+1} \mathbb{E}_T [\mathbb{I}(T \ge t+1)]$$
Since $\mathbb{E}[\mathbb{I}(A)] = \mathbb{P}(A)$:
$$\mathbb{E}_T [\mathbb{I}(T \ge t+1)] = \mathbb{P}(T \ge t+1) = \gamma^t$$
Substituting this back:
$$\mathbb{E}_T [G_{\text{die}}] = \sum_{t=0}^\infty \gamma^t R_{t+1} = G_{\text{discounted}}$$
The two formulations are mathematically isomorphic.

---

### Example 3.8: Average-Reward Formulation for Continuing Tasks
In continuing tasks where $\gamma = 1$ is desired, the **Average-Reward Formulation** replaces cumulative return with the asymptotic average reward per step:
$$r(\pi) \doteq \lim_{h \to \infty} \frac{1}{h} \sum_{t=1}^h \mathbb{E}[R_t]$$
Let an ergodic MDP with stationary state distribution $d^\pi(s)$ yield expected rewards $r(s, a)$.
1. Express $r(\pi)$ in terms of $d^\pi(s)$ and $r(s, a)$.
2. For an agent spending $70\%$ of its time in state $s_1$ ($R = +1$) and $30\%$ of its time in state $s_2$ ($R = +5$), compute $r(\pi)$.

#### Solution:
**Step 1: Formula:**
By the Ergodic Theorem for Markov chains:
$$r(\pi) = \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \pi(a \mid s) r(s, a)$$

**Step 2: Numerical Calculation:**
$$r(\pi) = d^\pi(s_1) R(s_1) + d^\pi(s_2) R(s_2) = (0.70)(+1.0) + (0.30)(+5.0) = 0.70 + 1.50 = +2.20 \text{ reward/step}$$

---

### Example 3.9: Return Truncation Error
In computational implementations, an infinite series $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$ must often be truncated to a finite horizon $H$:
$$\hat{G}_{t, H} \doteq \sum_{k=0}^{H-1} \gamma^k R_{t+k+1}$$
If all rewards are bounded by $|R_t| \le R_{\max}$, determine the minimal truncation length $H$ such that the truncation error satisfies:
$$|G_t - \hat{G}_{t, H}| \le \epsilon$$
for given $\epsilon > 0$ and $\gamma \in (0, 1)$.

#### Solution:
The truncation error is the tail of the geometric series:
$$|G_t - \hat{G}_{t, H}| = \left| \sum_{k=H}^\infty \gamma^k R_{t+k+1} \right| \le R_{\max} \sum_{k=H}^\infty \gamma^k$$
Factoring out $\gamma^H$:
$$\sum_{k=H}^\infty \gamma^k = \gamma^H \sum_{j=0}^\infty \gamma^j = \frac{\gamma^H}{1 - \gamma}$$
Thus:
$$\text{Error} \le \frac{R_{\max} \gamma^H}{1 - \gamma} \le \epsilon$$
Solving for $\gamma^H$:
$$\gamma^H \le \frac{\epsilon (1 - \gamma)}{R_{\max}}$$
Taking the natural logarithm:
$$H \ln(\gamma) \le \ln\left( \frac{\epsilon (1 - \gamma)}{R_{\max}} \right)$$
Since $\gamma \in (0, 1)$, $\ln(\gamma) < 0$. Dividing reverses the inequality:
$$H \ge \frac{\ln\left( \frac{\epsilon (1 - \gamma)}{R_{\max}} \right)}{\ln(\gamma)}$$

---

### Example 3.10: Numerical Horizon Calculation for Truncation
Using the formula derived in Example 3.9, calculate the required truncation horizon $H$ when:
$R_{\max} = 1.0$, $\gamma = 0.95$, and the target accuracy is $\epsilon = 0.01$.

#### Solution:
Substitute values:
$$1 - \gamma = 1 - 0.95 = 0.05$$
$$\frac{\epsilon (1 - \gamma)}{R_{\max}} = \frac{(0.01)(0.05)}{1.0} = 0.0005 = 5 \times 10^{-4}$$
Calculate logarithms:
$$\ln(0.0005) \approx -7.6009$$
$$\ln(0.95) \approx -0.051293$$
Calculate $H$:
$$H \ge \frac{-7.6009}{-0.051293} \approx 148.18$$
Rounding up:
$$H = 149 \text{ steps}$$
To guarantee error under $0.01$, the trajectory must be simulated for at least 149 steps.

---

## 3.7 Solved Exercises

### Exercise 3.1: Finite Trajectory Return
Given an episode of length $T = 3$ with rewards $R_1 = 5, R_2 = -2, R_3 = 8$, compute $G_0$ for $\gamma = 0.5$ and $\gamma = 1.0$.

#### Solution:
- For $\gamma = 0.5$:
  $$G_0 = 5 + (0.5)(-2) + (0.5)^2(8) = 5 - 1 + 0.25(8) = 5 - 1 + 2 = 6.0$$
- For $\gamma = 1.0$:
  $$G_0 = 5 + (-2) + 8 = 11.0$$

---

### Exercise 3.2: Reversing Returns via Backward Recursion
An algorithm processes a trajectory in reverse order. Given $G_2 = 14.0$, $\gamma = 0.8$, and $R_2 = -2.0$, find $G_1$.

#### Solution:
Using $G_1 = R_2 + \gamma G_2$:
$$G_1 = -2.0 + (0.8)(14.0) = -2.0 + 11.2 = 9.2$$

---

### Exercise 3.3: Effective Horizon at $\gamma = 0.98$
Compute the effective planning horizon $H_{\text{eff}} \approx \frac{1}{1 - \gamma}$ for $\gamma = 0.98$.

#### Solution:
$$H_{\text{eff}} \approx \frac{1}{1 - 0.98} = \frac{1}{0.02} = 50 \text{ steps}$$

---

### Exercise 3.4: Bounded Return Range
If all rewards are strictly constrained to $R_{t+1} \in [-5, +15]$ and $\gamma = 0.90$, find the theoretical lower and upper bounds of $G_t$.

#### Solution:
$$G_{\min} = \frac{R_{\min}}{1 - \gamma} = \frac{-5}{1 - 0.90} = \frac{-5}{0.10} = -50.0$$
$$G_{\max} = \frac{R_{\max}}{1 - \gamma} = \frac{+15}{1 - 0.90} = \frac{+15}{0.10} = +150.0$$
The return is bounded in $[-50.0, +150.0]$.

---

### Exercise 3.5: Return Under Linearly Decreasing Rewards
An agent receives $R_1 = 10, R_2 = 9, R_3 = 8, \dots, R_{10} = 1$, and $R_t = 0$ for all $t > 10$.
Compute $G_0$ with undiscounted horizon ($\gamma = 1.0$).

#### Solution:
$$G_0 = \sum_{k=1}^{10} k = \frac{10 \times 11}{2} = 55.0$$

---

### Exercise 3.6: Infinite Alternating Reward Series
An agent receives alternating rewards $+1, -1, +1, -1, \dots$ forever. 
Derive the closed-form return $G_0$ as a function of $\gamma \in [0, 1)$.

#### Solution:
$$G_0 = 1 - \gamma + \gamma^2 - \gamma^3 + \gamma^4 - \dots = \sum_{k=0}^\infty (-\gamma)^k$$
Since $|-\gamma| = \gamma < 1$, the geometric series converges to:
$$G_0 = \frac{1}{1 - (-\gamma)} = \frac{1}{1 + \gamma}$$
For $\gamma = 0.5$, $G_0 = \frac{1}{1.5} = \frac{2}{3}$.

---

### Exercise 3.7: Probability of Length-3 Episode
Let a terminal state be reached with probability $p = 0.2$ at each step, regardless of state or action.
What is the probability that an episode lasts exactly $T = 3$ steps?

#### Solution:
The agent must survive step 1 and step 2, and terminate at step 3:
$$\mathbb{P}(T = 3) = (1 - p)(1 - p) p = (0.8)(0.8)(0.2) = 0.64 \times 0.2 = 0.128$$

---

### Exercise 3.8: Discounting with Periodic Bonuses
An agent receives a base reward $R = 1$ at every step, plus a bonus $B = 10$ every 5th step ($t = 5, 10, 15, \dots$).
Derive the formula for $G_0$ for discount factor $\gamma \in [0, 1)$.

#### Solution:
Split the return into base rewards and periodic bonuses:
$$G_{\text{base}} = \sum_{k=0}^\infty \gamma^k (1) = \frac{1}{1 - \gamma}$$
$$G_{\text{bonus}} = \sum_{m=1}^\infty \gamma^{5m - 1} (10) = 10 \gamma^4 \sum_{j=0}^\infty (\gamma^5)^j = \frac{10 \gamma^4}{1 - \gamma^5}$$
Total return:
$$G_0 = \frac{1}{1 - \gamma} + \frac{10 \gamma^4}{1 - \gamma^5}$$

---

### Exercise 3.9: Relative Weight of First Step
For what value of $\gamma$ does the immediate first reward $R_1$ contribute exactly $50\%$ of the total return in a continuing task with constant reward $R_{t+1} = c > 0$?

#### Solution:
The total return is $G = \frac{c}{1 - \gamma}$.
We require:
$$R_1 = 0.50 \times G \implies c = 0.50 \frac{c}{1 - \gamma}$$
Dividing by $c > 0$:
$$1 = \frac{0.50}{1 - \gamma} \implies 1 - \gamma = 0.50 \implies \gamma = 0.50$$
At $\gamma = 0.50$, the first step accounts for exactly half the total infinite-horizon discounted return.

---

### Exercise 3.10: Zero-Sum Return in Two-Player Games
In a competitive two-player game (e.g. chess), the reward is $+1$ for a win, $-1$ for a loss, and $0$ for a draw, emitted only at terminal step $T$.
Explain why $\gamma = 1.0$ is typically used rather than $\gamma < 1.0$.

#### Solution:
If $\gamma < 1.0$, a checkmate delivered at move 20 yields return $\gamma^{19}(+1)$, while a checkmate delivered at move 40 yields $\gamma^{39}(+1) < \gamma^{19}(+1)$. The agent would prefer an aggressive, riskier line that mates in 20 over a safer line that mates in 40. Furthermore, under $\gamma < 1.0$, facing an unavoidable loss, the agent would prefer to lose immediately at move 21 ($\gamma^{20}(-1)$) rather than delay the loss to move 40 ($\gamma^{39}(-1)$, which has smaller absolute penalty), actively committing suicide. Setting $\gamma = 1.0$ ensures that a win is valued equally regardless of duration, and all losses are treated with equal severity.
