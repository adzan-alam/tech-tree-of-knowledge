# Chapter 11: Monte Carlo Methods and the Bridge to Model-Free Learning

---

## 11.1 The Epistemological Leap: Leaving the Garden of Models

Throughout Chapters 6–10, our Dynamic Programming methods rested upon a massive epistemological assumption: **we assumed that the agent possessed a perfect, omniscient model of the environment's internal mechanics**—the exact state-transition kernel $\mathcal{P}_{s, s'}^a$ and expected reward function $r(s, a)$.

In the physical world, an agent is almost never handed such a blueprint:
- A robotic dog does not possess analytical equations for the friction of wet mud, loose pebbles, or crushing grass.
- An autonomous spacecraft entering a planetary atmosphere cannot analytically integrate turbulent aerodynamic shockwaves.
- An algorithmic trading agent does not have access to the private order-flow equations of other market participants.

```
                          THE MODEL SPECTRUM IN AI AGENTS
                                         │
            ┌────────────────────────────┴────────────────────────────┐
            ▼                                                         ▼
 ┌─────────────────────┐                                   ┌─────────────────────┐
 │    MODEL-BASED      │                                   │     MODEL-FREE      │
 │ (Dynamic Prog, DP)  │                                   │ (Monte Carlo & TD)  │
 ├─────────────────────┤                                   ├─────────────────────┤
 │ • Omniscient model  │                                   │ • Zero model known  │
 │ • Expectation sum   │        ════════════════►          │ • Pure experience   │
 │ • Full distribution │                                   │ • Interacts directly│
 │ • Offline planning  │                                   │ • Learns from trails│
 └─────────────────────┘                                   └─────────────────────┘
```

When transition dynamics are unknown, the agent must make the epistemological leap to **Model-Free Reinforcement Learning**: learning optimal values and policies directly from **sampled sequences of experience**.

---

## 11.2 Monte Carlo Prediction: First-Visit vs. Every-Visit

Monte Carlo (MC) methods solve the prediction problem by defining value as empirical sample averages of realized returns.

Recall the fundamental definition of the state-value function:
$$v_\pi(s) \doteq \mathbb{E}_\pi [G_t \mid S_t = s]$$

If an agent executes policy $\pi$ across dozens of episodes, it generates empirical realizations of returns following visits to state $s$. By the **Strong Law of Large Numbers**, the sample average of these returns converges almost surely to the true expected value as the number of samples approaches infinity.

```
                  EPISODE TRAJECTORY VISITATION TIMELINE
  Episode:
  [Start] ──► (s) ──────────► (s') ──────────► (s) ──────────► (Goal) [End]
               ▲                                ▲
               │ First Visit                    │ Second Visit
               │ (Return G_A)                   │ (Return G_B)
```

Suppose a single episode visits state $s$ multiple times. How should those visits be recorded?

### 1. First-Visit Monte Carlo
In **First-Visit MC**, only the return following the *very first occurrence* of state $s$ within an episode is included in the average.
- Let $G_i(s)$ be the return following the first visit to state $s$ in episode $i$.
- Value estimate:
  $$V(s) = \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_i(s)$$
- **Unbiasedness:** Because the first visit in each episode generates an independent sample of return from state $s$, $V(s)$ is an **unconditionally unbiased estimator** of $v_\pi(s)$:
  $$\mathbb{E}[V(s)] = v_\pi(s)$$
- Its variance decays smoothly as $O(1/N)$.

### 2. Every-Visit Monte Carlo
In **Every-Visit MC**, the return following *every single occurrence* of state $s$ within the episode is averaged.
- If state $s$ is visited 3 times in an episode, 3 separate sample returns are added to the accumulator.
- **Properties:** Because visits within the same episode are statistically correlated, Every-Visit MC estimates are biased for small sample sizes, but they remain **consistent** (the bias shrinks to zero as $N \to \infty$) and often achieve lower mean squared error in practice.

---

## 11.3 Action-Value Estimation and the Exploring Starts Dilemma

In Dynamic Programming, we could compute state values $v(s)$ and then derive optimal actions using one-step lookahead:
$$\pi^*(s) = \arg\max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s') \right]$$

> [!WARNING]
> **The Model-Free Trap:** In model-free learning, you **cannot** extract a policy from $v(s)$! 
> If you do not know the transition probabilities $\mathcal{P}_{s, s'}^a$, knowing how desirable state $s'$ is does you no good, because you do not know which action has the highest probability of landing you there!

Therefore, in model-free reinforcement learning, the agent **must estimate the Action-Value Function $q(s, a)$ directly**. Once $q(s, a)$ is learned, optimal action selection is model-free:
$$\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} q^*(s, a)$$

```
                               THE EXPLORATION DILEMMA
                                         │
                                  Evaluate Q(s, a)
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
         ┌───────────────────────┐               ┌───────────────────────┐
         │   EXPLORING STARTS    │               │  STOCHASTIC POLICIES  │
         ├───────────────────────┤               ├───────────────────────┤
         │ Assumes every (s, a)  │               │ Uses ε-greedy or      │
         │ has positive prob of  │               │ Softmax: every action │
         │ being the start of an │               │ is selected with prob │
         │ episode. Unrealistic! │               │ π(a | s) ≥ ε / |A|.   │
         └───────────────────────┘               └───────────────────────┘
```

To estimate $q(s, a)$ for all actions, every state-action pair must be visited repeatedly. If the agent follows a deterministic policy, it will only visit a single action per state, leaving the remaining actions unexplored forever. 
To guarantee exploration, early theory relied on **Exploring Starts** (assuming every episode begins with an arbitrary state-action pair chosen uniformly at random). In realistic engineering, we abandon exploring starts in favor of **$\epsilon$-Greedy Policies** or **Off-Policy Learning**.

---

## 11.4 Off-Policy Learning and Importance Sampling

In many mission-critical applications, an agent cannot simply run around trying random exploratory actions in the live production environment. An autonomous surgical robot or a nuclear power plant controller cannot explore dangerous actions to see what happens.

This necessitates the distinction between two separate policies:

```
                               OFF-POLICY DUALITY
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
  ┌───────────────────────┐                             ┌───────────────────────┐
  │    BEHAVIOR POLICY    │                             │     TARGET POLICY     │
  │          b(a | s)     │                             │        π(a | s)       │
  ├───────────────────────┤                             ├───────────────────────┤
  │ • Generates raw data  │                             │ • Being evaluated and │
  │ • Exploratory / Safe  │        ════════════►        │   optimized           │
  │ • Human demonstrations│                             │ • Deterministic goal  │
  │ • Historical logs     │                             │ • Optimal policy π*   │
  └───────────────────────┘                             └───────────────────────┘
```

1. **Target Policy $\pi(a \mid s)$:** The policy the agent is trying to evaluate or optimize (typically a deterministic, greedy policy $\pi^*$).
2. **Behavior Policy $b(a \mid s)$:** The policy used to interact with the environment and collect the trajectory data (typically a stochastic exploratory policy, or human demonstration recordings).

### The Coverage Assumption:
For off-policy learning to be mathematically well-defined, the behavior policy must have non-zero probability for any action that is possible under the target policy:
$$\pi(a \mid s) > 0 \implies b(a \mid s) > 0, \quad \forall s \in \mathcal{S}, a \in \mathcal{A}$$

### The Importance Sampling Ratio
Suppose we observe a trajectory $\tau = (A_t, S_{t+1}, A_{t+1}, \dots, S_T)$ generated by behavior policy $b$. 
What was the relative probability of this trajectory occurring under target policy $\pi$ compared to behavior policy $b$?

The probability of the trajectory under policy $\pi$ is:
$$\mathbb{P}(\tau \mid \pi) = \prod_{k=t}^{T-1} \pi(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}$$
The probability under behavior policy $b$ is:
$$\mathbb{P}(\tau \mid b) = \prod_{k=t}^{T-1} b(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}$$

The ratio of probabilities is the **Importance Sampling Ratio** $\rho_{t:T-1}$:

$$\rho_{t:T-1} \doteq \frac{\mathbb{P}(\tau \mid \pi)}{\mathbb{P}(\tau \mid b)} = \frac{\prod_{k=t}^{T-1} \pi(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}}{\prod_{k=t}^{T-1} b(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}} = \prod_{k=t}^{T-1} \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$

> [!IMPORTANT]
> **The Magic of Ratio Cancellation:** Notice that the environment transition probabilities $\mathcal{P}_{S_k, S_{k+1}}^{A_k}$ appear identically in both the numerator and denominator, canceling out completely! We can compute the exact importance sampling ratio **without knowing anything about the environment physics**!

### Ordinary vs. Weighted Importance Sampling
Given $M$ episodes where state $s$ was visited at step $t(i)$ with return $G_i(s)$ and ratio $\rho_i$:

1. **Ordinary Importance Sampling:**
   $$V(s) = \frac{1}{M} \sum_{i=1}^M \rho_i G_i(s)$$
   - **Properties:** Strictly unbiased ($\mathbb{E}[V(s)] = v_\pi(s)$), but has potentially **infinite variance** if ratios $\rho_i$ compound to astronomical magnitudes over long trajectories.
2. **Weighted Importance Sampling:**
   $$V(s) = \frac{\sum_{i=1}^M \rho_i G_i(s)}{\sum_{i=1}^M \rho_i}$$
   - **Properties:** Biased (approaches zero bias as $M \to \infty$), but possesses **bounded variance**. Even if a single episode has a massive ratio $\rho_1 = 10^9$, it appears in both numerator and denominator, scaling the estimate stably.

---

## 11.5 The Tripartite Spectrum: DP vs. MC vs. TD

We can now organize all reinforcement learning algorithms along two fundamental orthogonal axes: **Bootstrapping** and **Sampling**.

```
                           THE REINFORCEMENT LEARNING SPECTRUM
               
               Bootstraps (Uses V(s'))           Does Not Bootstrap (Uses G_t)
            ┌───────────────────────────────┬───────────────────────────────┐
            │                               │                               │
   Full     │      DYNAMIC PROGRAMMING      │       EXHAUSTIVE SEARCH       │
   Expected │   (Value / Policy Iteration)  │    (Full Trajectory Trees)    │
   Updates  │  • Full transition model      │  • Expands every branch       │
   (Model)  │  • Expected Bellman update    │  • Breadth-first game trees   │
            │                               │                               │
            ├───────────────────────────────┼───────────────────────────────┤
            │                               │                               │
   Sample   │     TEMPORAL DIFFERENCE       │          MONTE CARLO          │
   Updates  │   (TD(0), SARSA, Q-Learning)  │      (First / Every Visit)    │
   (Model-  │  • Samples 1 transition       │  • Samples entire trajectory  │
   Free)    │  • Bootstraps: V(s')          │  • No bootstrapping          │
            │                               │                               │
            └───────────────────────────────┴───────────────────────────────┘
```

1. **Dynamic Programming (DP):** Bootstraps (uses $V(s')$ to update $V(s)$); does not sample (computes mathematical expectation across all next states). Requires a complete environment model.
2. **Monte Carlo (MC):** Samples (interacts directly with environment); does not bootstrap (must wait until episode termination to record cumulative return $G_t$). Zero bias, high variance, cannot learn online or in continuing tasks.
3. **Temporal Difference (TD):** Samples (draws single transitions $S_t \to S_{t+1}$); bootstraps (updates $V(S_t)$ immediately using $V(S_{t+1})$). Combines the model-free sampling of Monte Carlo with the online efficiency of Dynamic Programming.

---

## 11.6 Preview of Tabular Temporal Difference Learning

To set the stage for our production simulator, we state the three canonical Temporal Difference learning updates:

### 1. Tabular TD(0) (State-Value Prediction)
$$V(S_t) \leftarrow V(S_t) + \alpha \left[ R_{t+1} + \gamma V(S_{t+1}) - V(S_t) \right]$$
The bracketed term is the **TD Error** $\delta_t \doteq R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$.

### 2. SARSA (On-Policy Control, Rummery & Niranjan 1994)
Updates state-action values using the tuple $(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1})$:
$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) \right]$$
where $A_{t+1}$ is chosen by the agent's current exploratory policy (e.g. $\epsilon$-greedy).

### 3. Q-Learning (Off-Policy Control, Watkins 1989)
Updates state-action values toward the Bellman optimality condition:
$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma \max_{a' \in \mathcal{A}(S_{t+1})} Q(S_{t+1}, a') - Q(S_t, A_t) \right]$$
Q-Learning is off-policy because the target uses $\max_{a'} Q(S_{t+1}, a')$ regardless of which exploratory action the behavior policy actually takes next.

---

## 11.7 Worked Examples: Monte Carlo & Importance Sampling

### Example 11.1: First-Visit vs Every-Visit Monte Carlo Calculation
An agent records two episodes in an MDP:
- Episode 1: $S_0 = s_1 \xrightarrow{R_1 = 2} S_1 = s_2 \xrightarrow{R_2 = 1} S_2 = s_1 \xrightarrow{R_3 = 4} S_3 = s_{\text{term}}$.
- Episode 2: $S_0 = s_2 \xrightarrow{R_1 = 3} S_1 = s_1 \xrightarrow{R_2 = 5} S_2 = s_{\text{term}}$.
Let $\gamma = 1.0$.

Calculate the estimated value $V(s_1)$ using:
1. First-Visit Monte Carlo.
2. Every-Visit Monte Carlo.

#### Solution:
**Step 1: Compute Returns from Each State Occurrence:**
- Episode 1:
  - Visit 1 to $s_1$ (at $t = 0$): $G = R_1 + R_2 + R_3 = 2 + 1 + 4 = 7.0$.
  - Visit 1 to $s_2$ (at $t = 1$): $G = R_2 + R_3 = 1 + 4 = 5.0$.
  - Visit 2 to $s_1$ (at $t = 2$): $G = R_3 = 4.0$.
- Episode 2:
  - Visit 1 to $s_2$ (at $t = 0$): $G = R_1 + R_2 = 3 + 5 = 8.0$.
  - Visit 1 to $s_1$ (at $t = 1$): $G = R_2 = 5.0$.

**Step 2: First-Visit MC Evaluation for $s_1$:**
- Episode 1 first-visit return: $G = 7.0$.
- Episode 2 first-visit return: $G = 5.0$.
$$V_{\text{First}}(s_1) = \frac{7.0 + 5.0}{2} = 6.0$$

**Step 3: Every-Visit MC Evaluation for $s_1$:**
All visits across both episodes: $[7.0, 4.0, 5.0]$.
$$V_{\text{Every}}(s_1) = \frac{7.0 + 4.0 + 5.0}{3} = \frac{16.0}{3} \approx 5.333$$

---

### Example 11.2: Importance Sampling Ratio Along a Path
An agent generates a 3-step trajectory under behavior policy $b$:
- At $t = 0$: $A_0 = a_1$. Under $\pi$, $\pi(a_1 \mid s_0) = 0.8$. Under $b$, $b(a_1 \mid s_0) = 0.4$.
- At $t = 1$: $A_1 = a_2$. Under $\pi$, $\pi(a_2 \mid s_1) = 0.9$. Under $b$, $b(a_2 \mid s_1) = 0.3$.
- At $t = 2$: $A_2 = a_1$. Under $\pi$, $\pi(a_1 \mid s_2) = 0.5$. Under $b$, $b(a_1 \mid s_2) = 0.5$.

1. Compute the importance sampling ratio $\rho_{0:2}$.
2. If the realized return was $G_0 = +10.0$, what is the weighted return $\rho_{0:2} G_0$ used in Ordinary Importance Sampling?

#### Solution:
**Step 1: Compute $\rho_{0:2}$:**
$$\rho_{0:2} = \left( \frac{\pi(a_1 \mid s_0)}{b(a_1 \mid s_0)} \right) \times \left( \frac{\pi(a_2 \mid s_1)}{b(a_2 \mid s_1)} \right) \times \left( \frac{\pi(a_1 \mid s_2)}{b(a_1 \mid s_2)} \right)$$
$$\rho_{0:2} = \left( \frac{0.8}{0.4} \right) \times \left( \frac{0.9}{0.3} \right) \times \left( \frac{0.5}{0.5} \right) = 2.0 \times 3.0 \times 1.0 = 6.0$$

**Step 2: Weighted Return:**
$$\text{Sample} = \rho_{0:2} G_0 = 6.0 \times 10.0 = +60.0$$
Because this sequence was 6 times more likely under $\pi$ than under $b$, its sample weight is scaled by 6.0.

---

### Example 11.3: Ordinary vs. Weighted Importance Sampling Numerical Comparison
An agent evaluates state $s$ using off-policy data from 3 episodes:
- Episode 1: $\rho_1 = 0.1, \quad G_1 = 10.0$.
- Episode 2: $\rho_2 = 10.0, \quad G_2 = 2.0$.
- Episode 3: $\rho_3 = 0.5, \quad G_3 = 8.0$.

Compute $V(s)$ using:
1. Ordinary Importance Sampling.
2. Weighted Importance Sampling.

#### Solution:
**1. Ordinary Importance Sampling:**
$$V_{\text{ord}}(s) = \frac{1}{3} \sum_{i=1}^3 \rho_i G_i = \frac{1}{3} \left[ (0.1)(10.0) + (10.0)(2.0) + (0.5)(8.0) \right]$$
$$= \frac{1}{3} [1.0 + 20.0 + 4.0] = \frac{25.0}{3} \approx 8.333$$

**2. Weighted Importance Sampling:**
Numerator:
$$\sum_{i=1}^3 \rho_i G_i = 1.0 + 20.0 + 4.0 = 25.0$$
Denominator:
$$\sum_{i=1}^3 \rho_i = 0.1 + 10.0 + 0.5 = 10.6$$
$$V_{\text{weighted}}(s) = \frac{25.0}{10.6} \approx 2.3585$$
Notice how Episode 2, which had return $2.0$ and a large weight $10.0$, heavily stabilizes the weighted average around $2.36$, whereas ordinary importance sampling shot up to $8.33$ due to the unnormalized magnitude.

---

### Example 11.4: Zero Ratio Collapse in Importance Sampling
Suppose target policy $\pi$ is deterministic: $\pi(a_1 \mid s) = 1.0$ and $\pi(a_2 \mid s) = 0.0$.
A behavior policy $b$ chooses $a_1$ and $a_2$ with equal probability $0.5$.
Suppose an episode of length 10 takes action $a_2$ at step $t = 8$.
What is the importance sampling ratio $\rho_{0:9}$ for this episode?

#### Solution:
The ratio is the product of factors:
$$\rho_{0:9} = \prod_{k=0}^9 \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$
At step $k = 8$, the realized action was $A_8 = a_2$.
The factor at step 8 is:
$$\frac{\pi(a_2 \mid S_8)}{b(a_2 \mid S_8)} = \frac{0.0}{0.5} = 0.0$$
Because one factor is zero, the entire product collapses to zero:
$$\rho_{0:9} = 0.0$$
Any episode where the behavior policy takes an action that the target policy would never have taken is completely discarded ($\rho = 0$).

---

### Example 11.5: Incremental Implementation of Monte Carlo Updates
Derive the incremental running average formula for updating a value estimate $V_N(s)$ given the $N$-th observed return $G_N$, without storing the historical array of past returns.

#### Solution:
By definition:
$$V_N = \frac{1}{N} \sum_{i=1}^N G_i = \frac{1}{N} \left( G_N + \sum_{i=1}^{N-1} G_i \right)$$
Recognize that $\sum_{i=1}^{N-1} G_i = (N - 1) V_{N-1}$:
$$V_N = \frac{1}{N} [G_N + (N - 1) V_{N-1}] = \frac{1}{N} G_N + \frac{N - 1}{N} V_{N-1} = \frac{1}{N} G_N + V_{N-1} - \frac{1}{N} V_{N-1}$$
Factoring:
$$V_N = V_{N-1} + \frac{1}{N} \left[ G_N - V_{N-1} \right]$$
This matches the universal reinforcement learning update form:
$$\text{NewEstimate} \leftarrow \text{OldEstimate} + \alpha [\text{Target} - \text{OldEstimate}]$$
where step size is $\alpha_N = \frac{1}{N}$.

---

### Example 11.6: Single TD(0) Step Trace
An agent in state $S_0$ has value estimate $V(S_0) = 10.0$.
It takes action $A_0$, observes reward $R_1 = +2.0$, and transitions to state $S_1$, whose value estimate is $V(S_1) = 15.0$.
Let $\gamma = 0.90$ and learning rate $\alpha = 0.10$.

1. Compute the TD target $R_1 + \gamma V(S_1)$.
2. Compute the TD error $\delta_0$.
3. Compute the updated value $V(S_0)$.

#### Solution:
**Step 1: TD Target:**
$$\text{Target} = R_1 + \gamma V(S_1) = 2.0 + 0.90(15.0) = 2.0 + 13.5 = 15.5$$

**Step 2: TD Error:**
$$\delta_0 = \text{Target} - V(S_0) = 15.5 - 10.0 = +5.5$$

**Step 3: Update:**
$$V(S_0) \leftarrow V(S_0) + \alpha \delta_0 = 10.0 + 0.10(+5.5) = 10.0 + 0.55 = 10.55$$

---

### Example 11.7: Single Tabular Q-Learning Step Trace
An agent has current Q-values:
$Q(s, a_1) = 5.0, \quad Q(s, a_2) = 2.0$.
In next state $s'$, the Q-values are:
$Q(s', a_1) = 8.0, \quad Q(s', a_2) = 12.0$.
The agent executed action $a_1$ from state $s$, earning reward $R = 1.0$.
Let $\gamma = 0.90$ and $\alpha = 0.20$.

Execute a single tabular Q-learning update for $Q(s, a_1)$.

#### Solution:
The Q-learning target is:
$$\text{Target} = R + \gamma \max_{a'} Q(s', a')$$
Compute the maximum Q-value in successor state $s'$:
$$\max(Q(s', a_1), Q(s', a_2)) = \max(8.0, 12.0) = 12.0$$
$$\text{Target} = 1.0 + 0.90(12.0) = 1.0 + 10.8 = 11.8$$
Compute TD error:
$$\delta = \text{Target} - Q(s, a_1) = 11.8 - 5.0 = 6.8$$
Update $Q(s, a_1)$:
$$Q(s, a_1) \leftarrow 5.0 + 0.20(6.8) = 5.0 + 1.36 = 6.36$$

---

### Example 11.8: SARSA vs Q-Learning Update Discrepancy
Continuing from Example 11.7, suppose the agent's exploratory behavior policy selects action $a_1$ in state $s'$ (the sub-optimal action, e.g. due to $\epsilon$-exploration).
Compute the SARSA update for $Q(s, a_1)$ and compare it to the Q-Learning update.

#### Solution:
In SARSA, the target uses the action actually selected by the policy:
$$\text{SARSA Target} = R + \gamma Q(s', A') = 1.0 + 0.90 Q(s', a_1) = 1.0 + 0.90(8.0) = 1.0 + 7.2 = 8.2$$
Compute SARSA TD error:
$$\delta_{\text{SARSA}} = 8.2 - 5.0 = 3.2$$
SARSA update:
$$Q(s, a_1) \leftarrow 5.0 + 0.20(3.2) = 5.0 + 0.64 = 5.64$$

**Comparison:**
- Q-Learning updated $Q(s, a_1) \to 6.36$ (optimistically assuming the agent will act optimally from $s'$).
- SARSA updated $Q(s, a_1) \to 5.64$ (realistically reflecting the cost of the exploratory mistake made in $s'$).

---

### Example 11.9: Robbins-Monro Conditions for Stochastic Convergence
For tabular Q-Learning to converge to $Q^*$ with probability 1.0, the step sizes $\alpha_t$ must satisfy the **Robbins-Monro conditions**:
1. $\sum_{t=1}^\infty \alpha_t = \infty$ (step sizes large enough to overcome arbitrary initial conditions).
2. $\sum_{t=1}^\infty \alpha_t^2 < \infty$ (step sizes small enough to ensure stochastic noise diminishes to zero).

Test whether the following learning rate schedules satisfy the conditions:
1. $\alpha_t = \frac{1}{t}$
2. $\alpha_t = 0.1$ (constant learning rate)
3. $\alpha_t = \frac{1}{t^2}$

#### Solution:
1. **$\alpha_t = \frac{1}{t}$:**
   - $\sum_{t=1}^\infty \frac{1}{t} = \infty$ (harmonic series diverges) $\checkmark$
   - $\sum_{t=1}^\infty \frac{1}{t^2} = \frac{\pi^2}{6} < \infty$ (p-series converges) $\checkmark$
   Satisfies both conditions! Guarantees asymptotic convergence to $Q^*$.
2. **$\alpha_t = 0.1$ (Constant):**
   - $\sum 0.1 = \infty$ $\checkmark$
   - $\sum (0.1)^2 = \sum 0.01 = \infty$ $\times$ (fails condition 2).
   Does not converge to a point; continues to fluctuate around the optimum, allowing tracking of non-stationary environments.
3. **$\alpha_t = \frac{1}{t^2}$:**
   - $\sum \frac{1}{t^2} = \frac{\pi^2}{6} < \infty$ $\times$ (fails condition 1).
   Step sizes shrink too quickly; estimates freeze before reaching the optimum.

---

### Example 11.10: Bias-Variance Trade-Off Between MC and TD
Contrast the statistical bias and variance of Monte Carlo vs Temporal Difference estimation.

#### Solution:
- **Monte Carlo:**
  - **Bias:** Zero (strictly unbiased). Return $G_t$ is an actual sample of the true future trajectory.
  - **Variance:** Very High. $G_t$ depends on many random transitions and actions compounded over hundreds of steps. Requires many samples to converge.
- **Temporal Difference (TD):**
  - **Bias:** Non-zero initially. The TD target $R_{t+1} + \gamma V(S_{t+1})$ uses the estimate $V(S_{t+1})$, which may be inaccurate early in training.
  - **Variance:** Low. The update depends only on a single step of environmental noise ($R_{t+1}, S_{t+1}$), making learning significantly faster and more data-efficient.

---

## 11.8 Solved Exercises

### Exercise 11.1: First-Visit Filtering
In an episode: $s_1 \to s_2 \to s_1 \to s_3 \to s_{\text{term}}$, with rewards $R_1 = 1, R_2 = 2, R_3 = 3$.
Under First-Visit MC with $\gamma = 1$, what return is attributed to $s_1$?

#### Solution:
Only the return from the first visit at $t = 0$ is recorded:
$$G = 1 + 2 + 3 = 6.0$$

---

### Exercise 11.2: Importance Sampling Ratio Evaluation
Behavior policy chooses between two actions uniformly: $b(a_1) = 0.5, b(a_2) = 0.5$.
Target policy is $\epsilon$-greedy with $\epsilon = 0.10$: $\pi(a_1) = 0.95, \pi(a_2) = 0.05$.
If action $a_2$ is chosen, what is the importance ratio $\frac{\pi(a_2)}{b(a_2)}$?

#### Solution:
$$\rho = \frac{0.05}{0.50} = 0.10$$

---

### Exercise 11.3: TD Error Calculation
Given $V(s) = 50.0, V(s') = 60.0, R = 4.0, \gamma = 0.90$.
Compute the TD error $\delta$.

#### Solution:
$$\delta = R + \gamma V(s') - V(s) = 4.0 + 0.90(60.0) - 50.0 = 4.0 + 54.0 - 50.0 = +8.0$$

---

### Exercise 11.4: Q-Learning Target vs Policy Action
Does Q-Learning require knowing which action the agent will actually take in state $S_{t+1}$ before executing the update?

#### Solution:
No. Q-Learning is off-policy: it targets the maximum available Q-value $\max_{a'} Q(S_{t+1}, a')$ directly from the table, independent of future action selection.

---

### Exercise 11.5: Offline vs Online Monte Carlo
Why can standard Monte Carlo methods not be used in continuing, non-terminating tasks?

#### Solution:
Because standard Monte Carlo requires computing the complete cumulative return $G_t = \sum_{k=0}^T \gamma^k R_{t+k+1}$ to episode termination. In a continuing task, episodes never terminate ($T = \infty$), so the agent would have to wait an infinite amount of time before performing its first update.

---

### Exercise 11.6: Exploring Starts Feasibility in Physical Systems
Why is the "Exploring Starts" assumption impossible to satisfy on a real physical robot in an outdoor environment?

#### Solution:
Because an outdoor physical robot cannot magically materialize inside arbitrary configurations (e.g. inverted upside down in a river or perched on a cliff ledge) at the start of an experiment; it must start from a physically feasible launch pad.

---

### Exercise 11.7: Step-Size Decay Schedule
Given step-size schedule $\alpha_k = \frac{10}{100 + k}$, verify if $\sum \alpha_k$ diverges.

#### Solution:
For large $k$, $\frac{10}{100 + k} \sim \frac{10}{k}$.
The series $\sum_{k=1}^\infty \frac{10}{k} = 10 \sum \frac{1}{k}$ is a multiple of the divergent harmonic series.
Thus $\sum \alpha_k = \infty$.

---

### Exercise 11.8: Bootstrapping in Human Cognition
Give an intuitive example of human cognitive bootstrapping.

#### Solution:
Estimating your arrival time on a drive: after 30 minutes of driving, rather than waiting until you reach your destination, you update your estimate of total travel time based on your current location and your current prediction of remaining travel time.

---

### Exercise 11.9: Off-Policy Target Policy Freedom
In off-policy learning, can the target policy $\pi$ be updated dynamically during training?

#### Solution:
Yes. This is precisely how Q-Learning works: the target policy is implicitly $\pi(s) = \arg\max_a Q(s, a)$, which changes continuously as Q-values are refined.

---

### Exercise 11.10: Monte Carlo vs Dynamic Programming on Transition Noise
If an environment has complex stochastic transitions with 10,000 potential outcomes per action, why does Monte Carlo avoid evaluating all 10,000 branches?

#### Solution:
Because Monte Carlo samples an outcome according to its true probability distribution, allowing the Law of Large Numbers to integrate over transition uncertainty empirically without ever enumerating the branches.
