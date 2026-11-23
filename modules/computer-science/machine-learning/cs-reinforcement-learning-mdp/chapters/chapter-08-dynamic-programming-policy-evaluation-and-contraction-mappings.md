# Chapter 8: Dynamic Programming I: Iterative Policy Evaluation and Contraction Mappings

---

## 8.1 The Dynamic Programming Paradigm: Planning with Models

The term **Dynamic Programming (DP)** was coined in the 1950s by Richard Bellman to describe a mathematical framework for solving complex multi-stage decision processes by decomposing them into overlapping sub-problems. In the lexicon of computer science and reinforcement learning:

> **Dynamic Programming** refers to a collection of algorithms that compute optimal policies given a *perfect, complete model of the environment* as a Markov Decision Process $(\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$.

Because classical DP assumes full knowledge of transition probabilities $\mathcal{P}_{s, s'}^a$ and expected rewards $r(s, a)$, it operates as a **planning** methodology rather than a pure learning methodology. However, the theoretical concepts developed in DP—bootstrapping, value iteration, policy iteration, and contraction mappings—form the exact mathematical foundation upon which all model-free reinforcement learning algorithms (such as Q-Learning and Actor-Critic) are constructed.

```
                                 THE DYNAMIC PROGRAMMING SUITE
                                               │
                        ┌──────────────────────┴──────────────────────┐
                        ▼                                             ▼
         ┌─────────────────────────────┐               ┌─────────────────────────────┐
         │     POLICY EVALUATION       │               │      POLICY ITERATION       │
         │   (Prediction Problem)      │               │      (Control Problem)      │
         ├─────────────────────────────┤               ├─────────────────────────────┤
         │ Given policy π:             │               │ Discovers optimal π*:       │
         │ Compute state-values v_π(s) │               │ Alternates evaluation and   │
         │ by solving Bellman system.  │               │ greedy policy improvement.  │
         └─────────────────────────────┘               └─────────────────────────────┘
```

In this chapter, we master the **Prediction Problem**: given an arbitrary policy $\pi$, how do we compute its state-value function $v_\pi(s)$ efficiently without inverting an $O(N^3)$ matrix? The answer is **Iterative Policy Evaluation**.

---

## 8.2 The Bellman Expectation Operator $T^\pi$

To analyze iterative algorithms with mathematical rigor, we shift our perspective from scalar equations to functional operators acting on high-dimensional vector spaces.

Let $\mathcal{V} \doteq \mathbb{R}^{|\mathcal{S}|}$ denote the real vector space of all possible state-value functions. An element $\mathbf{v} \in \mathcal{V}$ is an $N$-dimensional vector assigning a real value to every state $s \in \mathcal{S}$.

### Formal Definition
The **Bellman Expectation Operator** for policy $\pi$, denoted $T^\pi: \mathcal{V} \to \mathcal{V}$, is a mapping that takes an arbitrary value vector $\mathbf{v}$ and transforms it into a new value vector $T^\pi \mathbf{v}$:

$$(T^\pi \mathbf{v})(s) \doteq \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v(s') \right]$$

In vector-matrix notation:

$$T^\pi \mathbf{v} \doteq \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}$$

### Fixed Point Formulation
The Bellman expectation equation from Chapter 6 ($\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi$) can now be stated with mathematical elegance as a **Fixed-Point Equation**:

$$T^\pi \mathbf{v}_\pi = \mathbf{v}_\pi$$

The true state-value function $\mathbf{v}_\pi$ is the fixed point of the operator $T^\pi$. If we apply $T^\pi$ to $\mathbf{v}_\pi$, the output is identical to the input.

---

## 8.3 The Banach Fixed-Point Theorem and Contraction Mappings

How do we find the fixed point of an operator? Under what conditions does repeatedly applying the operator ($v_{k+1} = T^\pi v_k$) converge to the unique truth? The answer is provided by the celebrated **Banach Fixed-Point Theorem** (1922).

```
                            THE BANACH CONTRACTION CONE
          Vector Space V = R^N
          
             u_0 ●─────────────────────────────────────────┐
                                                           │ Distance d(u_0, v_0)
             v_0 ●───────────────────────────────────┐     │
                   \                                 │     │
                    \ T^π                            │     │
                     ▼                               ▼     ▼
                  T^π u_0 ●──────────┐              ||u - v||_∞
                                     │ Distance ≤ γ d(u_0, v_0)
                  T^π v_0 ●────┐     │
                         \     │     │
                          \ T^π│     │
                           ▼   ▼     ▼
                             ● v_π (Unique Fixed Point)
```

### 1. Complete Metric Space
Equip the vector space $\mathbb{R}^{|\mathcal{S}|}$ with the **Supremum Norm** (or maximum norm, $L_\infty$):
$$\|\mathbf{u} - \mathbf{v}\|_\infty \doteq \max_{s \in \mathcal{S}} |u(s) - v(s)|$$
Because $\mathbb{R}^{|\mathcal{S}|}$ is finite-dimensional, the metric space $(\mathbb{R}^{|\mathcal{S}|}, \|\cdot\|_\infty)$ is **complete**: every Cauchy sequence converges to a limit that resides inside the space.

### 2. Definition of a Contraction Mapping
An operator $T: \mathcal{V} \to \mathcal{V}$ is defined to be a **$\gamma$-Contraction Mapping** on a metric space $(\mathcal{V}, \|\cdot\|)$ if there exists a real constant $\gamma \in [0, 1)$ such that for all $\mathbf{u}, \mathbf{v} \in \mathcal{V}$:

$$\|T \mathbf{u} - T \mathbf{v}\| \le \gamma \|\mathbf{u} - \mathbf{v}\|$$

A contraction mapping pulls any two candidate vectors strictly closer together. The distance between the outputs is guaranteed to shrink by at least a factor of $\gamma < 1$ compared to the distance between the inputs.

### 3. The Banach Fixed-Point Theorem
> **Theorem (Banach):**
> Let $(\mathcal{V}, d)$ be a complete metric space, and let $T: \mathcal{V} \to \mathcal{V}$ be a $\gamma$-contraction mapping with contraction factor $\gamma \in [0, 1)$. Then:
> 1. **Existence and Uniqueness:** $T$ has a unique fixed point $\mathbf{v}^* \in \mathcal{V}$ satisfying $T \mathbf{v}^* = \mathbf{v}^*$.
> 2. **Global Convergence:** For *any arbitrary initial guess* $\mathbf{v}_0 \in \mathcal{V}$, the sequence generated by repeated iteration:
>    $$\mathbf{v}_{k+1} = T \mathbf{v}_k$$
>    converges to the unique fixed point:
>    $$\lim_{k \to \infty} \mathbf{v}_k = \mathbf{v}^*$$
> 3. **Geometric Convergence Rate:** The error at iteration $k$ is strictly bounded by:
>    $$\|\mathbf{v}_k - \mathbf{v}^*\| \le \frac{\gamma^k}{1 - \gamma} \|\mathbf{v}_1 - \mathbf{v}_0\|$$

---

## 8.4 Rigorous Proof that $T^\pi$ is a $\gamma$-Contraction

We now present the complete, step-by-step mathematical proof that the Bellman Expectation Operator $T^\pi$ is a $\gamma$-contraction mapping under the supremum norm.

### Proof:
Let $\mathbf{u}, \mathbf{v} \in \mathbb{R}^{|\mathcal{S}|}$ be any two arbitrary value vectors.
Evaluate the difference $(T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s)$ for an arbitrary state $s \in \mathcal{S}$:

$$\begin{aligned}
(T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) &= \left( r_\pi(s) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi u(s') \right) - \left( r_\pi(s) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi v(s') \right) \\
&= \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi \left[ u(s') - v(s') \right]
\end{aligned}$$

Notice that the reward vector $r_\pi(s)$ cancels out completely!

Now take the absolute value of both sides:
$$\left| (T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) \right| = \left| \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi [u(s') - v(s')] \right|$$

Apply the triangle inequality:
$$\le \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi |u(s') - v(s')|$$

By the definition of the supremum norm, for every state $s'$, $|u(s') - v(s')| \le \|\mathbf{u} - \mathbf{v}\|_\infty$. Substitute this uniform upper bound:
$$\le \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi \|\mathbf{u} - \mathbf{v}\|_\infty = \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi$$

Because $\mathcal{P}^\pi$ is a valid probability transition kernel, the sum over all destination states $s'$ is identically 1:
$$\sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi = 1$$

Therefore:
$$\left| (T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) \right| \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty$$

Because this inequality holds for every state $s \in \mathcal{S}$, it must hold for the maximum over all states:
$$\max_{s \in \mathcal{S}} \left| (T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) \right| \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty$$

$$\|T^\pi \mathbf{u} - T^\pi \mathbf{v}\|_\infty \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \quad \blacksquare$$

This completes the proof. Since $\gamma \in [0, 1)$, $T^\pi$ is unconditionally a $\gamma$-contraction mapping.

---

## 8.5 The Iterative Policy Evaluation Algorithm

The contraction property yields an extraordinarily simple and powerful algorithm: **Iterative Policy Evaluation**.

```
                         ITERATIVE POLICY EVALUATION FLOW
                                        │
                                  Initialize v_0
                                  (e.g., all 0s)
                                        │
                                        ▼
                             ┌────────────────────┐
                        ┌───►│  Sweep All States  │
                        │    │  v_{k+1} = T^π v_k │
                        │    └─────────┬──────────┘
                        │              │
                        │              ▼
                        │    Calculate Max Shift:
                        │    Δ = max_s |v_{k+1}(s) - v_k(s)|
                        │              │
                        │              ▼
                        │          Is Δ < θ?
                        │         /         \
                        └── NO ──┘           └── YES ──► CONVERGED! Output v_π
```

### Algorithmic Variants: Synchronous vs. In-Place
1. **Synchronous (Two-Array) Update:**
   Maintains two memory buffers: `V_old` and `V_new`. The algorithm reads values strictly from `V_old` to compute all updates, and writes results into `V_new`. Once all states are swept, `V_old` is replaced by `V_new`. This matches the theoretical operator $v_{k+1} = T^\pi v_k$ exactly.
2. **In-Place (Gauss-Seidel) Update:**
   Maintains a single memory buffer `V`. As states are updated in order $s_1, s_2, \dots, s_N$, the new value $V(s_1)$ is immediately written back into the array. When calculating $V(s_2)$, if $s_2$ transitions to $s_1$, it immediately uses the freshly updated $V(s_1)$ rather than stale data.
   - Requires half the memory storage.
   - Typically converges nearly twice as fast as synchronous updates.
   - Still guaranteed to converge to the identical fixed point $v_\pi$.

---

## 8.6 Worked Examples: Policy Evaluation Steps

### Example 8.1: Step-by-Step Synchronous Policy Evaluation
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$.
- $r_\pi(s_1) = 2.0, \quad \mathcal{P}_{s_1, s_1}^\pi = 0.5, \quad \mathcal{P}_{s_1, s_2}^\pi = 0.5$.
- $r_\pi(s_2) = 1.0, \quad \mathcal{P}_{s_2, s_1}^\pi = 0.0, \quad \mathcal{P}_{s_2, s_2}^\pi = 1.0$.
Discount factor $\gamma = 0.50$.
Initialize $v_0 = [0.0, 0.0]^T$.

Perform 3 full synchronous sweeps ($v_1, v_2, v_3$) by hand, tracking the maximum state deviation $\Delta_k = \|v_k - v_{k-1}\|_\infty$.

#### Solution:
The update rule is:
$$v_{k+1}(s_1) = 2.0 + 0.50 [0.5 v_k(s_1) + 0.5 v_k(s_2)] = 2.0 + 0.25 [v_k(s_1) + v_k(s_2)]$$
$$v_{k+1}(s_2) = 1.0 + 0.50 [1.0 v_k(s_2)] = 1.0 + 0.50 v_k(s_2)$$

**Iteration $k = 1$ (from $v_0 = [0, 0]$):**
- $v_1(s_1) = 2.0 + 0.25(0 + 0) = 2.0$
- $v_1(s_2) = 1.0 + 0.50(0) = 1.0$
- $\mathbf{v}_1 = [2.0, 1.0]^T$
- $\Delta_1 = \max(|2.0 - 0|, |1.0 - 0|) = 2.0$

**Iteration $k = 2$ (from $v_1 = [2.0, 1.0]$):**
- $v_2(s_1) = 2.0 + 0.25(2.0 + 1.0) = 2.0 + 0.25(3.0) = 2.0 + 0.75 = 2.75$
- $v_2(s_2) = 1.0 + 0.50(1.0) = 1.50$
- $\mathbf{v}_2 = [2.75, 1.50]^T$
- $\Delta_2 = \max(|2.75 - 2.0|, |1.50 - 1.0|) = \max(0.75, 0.50) = 0.75$
Notice: $\frac{\Delta_2}{\Delta_1} = \frac{0.75}{2.0} = 0.375 \le \gamma = 0.50 \quad \checkmark$.

**Iteration $k = 3$ (from $v_2 = [2.75, 1.50]$):**
- $v_3(s_1) = 2.0 + 0.25(2.75 + 1.50) = 2.0 + 0.25(4.25) = 2.0 + 1.0625 = 3.0625$
- $v_3(s_2) = 1.0 + 0.50(1.50) = 1.0 + 0.75 = 1.75$
- $\mathbf{v}_3 = [3.0625, 1.75]^T$
- $\Delta_3 = \max(|3.0625 - 2.75|, |1.75 - 1.50|) = \max(0.3125, 0.25) = 0.3125$

---

### Example 8.2: Analytical Fixed Point Comparison
Compute the exact analytical fixed point $\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ for Example 8.1, and verify that $\mathbf{v}_k \to \mathbf{v}_\pi$.

#### Solution:
From the equations:
$$v_\pi(s_2) = 1.0 + 0.5 v_\pi(s_2) \implies 0.5 v_\pi(s_2) = 1.0 \implies v_\pi(s_2) = 2.0$$
Now substitute into $v_\pi(s_1)$:
$$v_\pi(s_1) = 2.0 + 0.25 [v_\pi(s_1) + 2.0] = 2.0 + 0.25 v_\pi(s_1) + 0.50 = 2.50 + 0.25 v_\pi(s_1)$$
$$0.75 v_\pi(s_1) = 2.50 \implies v_\pi(s_1) = \frac{2.50}{0.75} = \frac{10}{3} \approx 3.3333$$
True fixed point: $\mathbf{v}_\pi = [\frac{10}{3}, 2.0]^T \approx [3.3333, 2.0000]^T$.

Compare with iteration 3:
$$\mathbf{v}_3 = [3.0625, 1.7500]^T$$
Errors:
- State $s_1$: $|3.3333 - 3.0625| = 0.2708$.
- State $s_2$: $|2.0000 - 1.7500| = 0.2500$.
The values are monotonically and geometrically converging toward the true fixed point.

---

### Example 8.3: Verification of the Banach Error Bound
Using $\gamma = 0.50$, $v_0 = [0, 0]^T$, and $v_1 = [2.0, 1.0]^T$ from Example 8.1:
1. Use the Banach error bound formula $\|\mathbf{v}_k - \mathbf{v}^*\|_\infty \le \frac{\gamma^k}{1 - \gamma} \|\mathbf{v}_1 - \mathbf{v}_0\|_\infty$ to compute the guaranteed theoretical error upper bound at iteration $k = 3$.
2. Compare this theoretical bound to the actual empirical error computed in Example 8.2.

#### Solution:
**Step 1: Compute Bound:**
- $\|\mathbf{v}_1 - \mathbf{v}_0\|_\infty = 2.0$.
- $1 - \gamma = 1 - 0.50 = 0.50$.
- For $k = 3$: $\gamma^3 = (0.50)^3 = 0.125$.
$$\text{Bound} = \frac{0.125}{0.50} \times 2.0 = 0.25 \times 2.0 = 0.50$$

**Step 2: Comparison:**
Actual error at $k = 3$:
$$\|\mathbf{v}_3 - \mathbf{v}^*\|_\infty = \max(0.2708, 0.2500) = 0.2708$$
Since $0.2708 \le 0.50$, the theoretical Banach bound holds rigorously.

---

### Example 8.4: In-Place (Gauss-Seidel) Policy Evaluation
Using the identical MDP from Example 8.1:
- $v(s_1) \leftarrow 2.0 + 0.25 [v(s_1) + v(s_2)]$
- $v(s_2) \leftarrow 1.0 + 0.50 v(s_2)$
Initialize a single vector $V = [0.0, 0.0]$.
Perform 2 in-place sweeps, updating $s_1$ first, then $s_2$.

#### Solution:
**Sweep 1:**
- Update $s_1$:
  $$V(s_1) \leftarrow 2.0 + 0.25(0 + 0) = 2.0$$
- Update $s_2$ (using newly updated $V(s_1)$, though $s_2$ happens only to depend on itself):
  $$V(s_2) \leftarrow 1.0 + 0.50(0) = 1.0$$
After Sweep 1: $V = [2.0, 1.0]$.

**Sweep 2:**
- Update $s_1$ (using current $V(s_1) = 2.0$ and current $V(s_2) = 1.0$):
  $$V(s_1) \leftarrow 2.0 + 0.25(2.0 + 1.0) = 2.0 + 0.75 = 2.75$$
- Update $s_2$:
  $$V(s_2) \leftarrow 1.0 + 0.50(1.0) = 1.50$$
After Sweep 2: $V = [2.75, 1.50]$.

Now suppose state order was reversed ($s_2$ updated first, then $s_1$):
- Sweep 1: $V(s_2) \leftarrow 1.0$. Then $V(s_1) \leftarrow 2.0 + 0.25(0 + 1.0) = 2.25$.
Updating $s_2$ first immediately propels $s_1$ to $2.25$ (closer to $3.333$) in a single sweep!

---

### Example 8.5: Iteration Complexity to Reach Target Error Tolerance
An engineer sets stopping threshold $\theta = 10^{-6}$ for policy evaluation.
The discount factor is $\gamma = 0.95$.
The initial sweep yielded $\|\mathbf{v}_1 - \mathbf{v}_0\|_\infty = 10.0$.
Calculate the maximum number of iterations $K$ guaranteed to achieve error $\|\mathbf{v}_K - \mathbf{v}^*\|_\infty \le \theta$.

#### Solution:
From the Banach bound:
$$\frac{\gamma^K}{1 - \gamma} \|\mathbf{v}_1 - \mathbf{v}_0\|_\infty \le \theta$$
$$\gamma^K \le \frac{\theta (1 - \gamma)}{\|\mathbf{v}_1 - \mathbf{v}_0\|_\infty}$$
Substitute values:
$$\gamma^K \le \frac{(10^{-6})(0.05)}{10.0} = \frac{5 \times 10^{-8}}{10.0} = 5 \times 10^{-9}$$
Take natural logarithms:
$$K \ln(\gamma) \le \ln(5 \times 10^{-9})$$
$$K \ln(0.95) \le \ln(5 \times 10^{-9})$$
- $\ln(0.95) \approx -0.051293$
- $\ln(5 \times 10^{-9}) \approx -19.1138$
Divide by negative logarithm (reverses inequality):
$$K \ge \frac{-19.1138}{-0.051293} \approx 372.64$$
Rounding up:
$$K = 373 \text{ iterations}$$
At most 373 sweeps are required to guarantee accuracy to 6 decimal places.

---

### Example 8.6: Contraction Mapping with Different Matrix Norms
Show that while $T^\pi$ is always a $\gamma$-contraction under the supremum norm $\|\cdot\|_\infty$, it is **not** necessarily a contraction under the Euclidean $L_2$ norm $\|\cdot\|_2$.

#### Solution:
Consider transition matrix $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$ (non-symmetric) and $\mathbf{P} = \begin{bmatrix} 0.5 & 0.5 \\ 0.0 & 1.0 \end{bmatrix}$.
In general, for $L_2$ norm:
$$\|\gamma \mathbf{P} \mathbf{x}\|_2 \le \gamma \sigma_{\max}(\mathbf{P}) \|\mathbf{x}\|_2$$
where $\sigma_{\max}(\mathbf{P})$ is the largest singular value (spectral norm) of $\mathbf{P}$.
For a general stochastic matrix, while the spectral radius $\rho(\mathbf{P}) \le 1$, the largest singular value can exceed 1!
For example, let $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 0 & 1 \end{bmatrix}$.
$\mathbf{P}^T \mathbf{P} = \begin{bmatrix} 0 & 0 \\ 0 & 2 \end{bmatrix}$.
The largest eigenvalue of $\mathbf{P}^T \mathbf{P}$ is 2, so $\sigma_{\max}(\mathbf{P}) = \sqrt{2} \approx 1.414$.
If $\gamma = 0.8$, then $\gamma \sigma_{\max}(\mathbf{P}) = 0.8 \times 1.414 = 1.131 > 1.0$.
In this case, along the vector $\mathbf{x} = [0, 1]^T$:
$$\|\gamma \mathbf{P} \mathbf{x}\|_2 = 0.8 \|[1, 1]^T\|_2 = 0.8 \sqrt{2} \approx 1.131 > 1.0 = \|\mathbf{x}\|_2$$
The distance *expands* under the $L_2$ norm! Thus, the contraction property depends crucially on the choice of the $L_\infty$ norm.

---

### Example 8.7: Policy Evaluation on Sutton & Barto 4x4 Gridworld
Consider the classic Sutton & Barto $4 \times 4$ Gridworld:
- 14 non-terminal states ($s = 1, \dots, 14$), 2 terminal corners ($s = 0, 15$).
- In every state, random policy $\pi(a \mid s) = 0.25$ for all 4 directions.
- Moving off grid keeps agent in place.
- Every step yields $R = -1.0$.
- $\gamma = 1.0$ (undiscounted episodic).
Initialize $v_0(s) = 0$ for all $s$.

1. Compute $v_1(s)$ for all non-terminal states.
2. For corner adjacent state $s_1$ (neighbors: terminal $s_0$, interior $s_2$, below $s_5$, bounce off wall $s_1$), write its update equation for sweep 2.

#### Solution:
**Step 1: Sweep $k = 1$:**
For every non-terminal state $s$:
$$v_1(s) = \sum_a 0.25 [-1.0 + 1.0 \cdot v_0(s')] = \sum_a 0.25 [-1.0 + 0] = -1.0$$
For terminal states: $v_1(0) = v_1(15) = 0$.

**Step 2: Sweep $k = 2$ for state $s_1$:**
From $s_1$:
- Left: enters terminal $s_0$ (value 0).
- Right: enters $s_2$ (value $-1.0$).
- Down: enters $s_5$ (value $-1.0$).
- Up: bounces off wall, stays in $s_1$ (value $-1.0$).
Update equation:
$$v_2(s_1) = 0.25 [-1 + v_1(s_0)] + 0.25 [-1 + v_1(s_2)] + 0.25 [-1 + v_1(s_5)] + 0.25 [-1 + v_1(s_1)]$$
$$v_2(s_1) = 0.25 [-1 + 0] + 0.25 [-1 + (-1)] + 0.25 [-1 + (-1)] + 0.25 [-1 + (-1)]$$
$$v_2(s_1) = 0.25(-1) + 0.25(-2) + 0.25(-2) + 0.25(-2) = -0.25 - 0.50 - 0.50 - 0.50 = -1.75$$
States adjacent to terminal goals retain higher value than interior states.

---

### Example 8.8: Stopping Condition Relationship to True Error
In iterative policy evaluation, the algorithm terminates when the change between successive sweeps is small:
$$\Delta \doteq \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \theta$$
Prove that when this condition is met, the distance to the true fixed point $\mathbf{v}_\pi$ satisfies:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \frac{\gamma \theta}{1 - \gamma}$$

#### Solution:
By the triangle inequality and contraction property:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \sum_{m=1}^\infty \|\mathbf{v}_{k+m+1} - \mathbf{v}_{k+m}\|_\infty$$
Because $T^\pi$ is a $\gamma$-contraction:
$$\|\mathbf{v}_{k+m+1} - \mathbf{v}_{k+m}\|_\infty \le \gamma^m \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty$$
Therefore:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \sum_{m=1}^\infty \gamma^m \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty = \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty \sum_{m=1}^\infty \gamma^m$$
Since $\sum_{m=1}^\infty \gamma^m = \frac{\gamma}{1 - \gamma}$:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \frac{\gamma}{1 - \gamma} \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \frac{\gamma \theta}{1 - \gamma} \quad \blacksquare$$

---

### Example 8.9: Asynchronous Prioritized Sweeping Preview
In standard policy evaluation, every state is swept in round-robin order.
Explain why updating states with the largest Bellman error $|(T^\pi v)(s) - v(s)|$ first (Prioritized Sweeping) accelerates convergence.

#### Solution:
In many MDPs, large regions of the state space have near-zero value flow until a wave of information propagates backward from terminal or rewarded states. In round-robin evaluation, states far from rewards are redundantly recomputed even though their inputs have not changed. By inserting states into a maximum priority queue keyed by their Bellman error $|(T^\pi v)(s) - v(s)|$, computation is concentrated exclusively on the "active wavefront" of value propagation, reducing redundant floating-point operations by up to an order of magnitude.

---

### Example 8.10: Divergence Under Non-Contractive Operators ($\gamma \ge 1$)
Let a 1-state system loop on itself: $v_{k+1} = 1.0 + \gamma v_k$.
Trace what happens to $v_k$ when $\gamma = 1.1$ initialized at $v_0 = 0$.

#### Solution:
- $v_1 = 1.0 + 1.1(0) = 1.0$
- $v_2 = 1.0 + 1.1(1.0) = 2.1$
- $v_3 = 1.0 + 1.1(2.1) = 1.0 + 2.31 = 3.31$
- $v_4 = 1.0 + 1.1(3.31) = 1.0 + 3.641 = 4.641$
- $v_{10} \approx 15.937$
- $v_{50} \approx 1,173.9$
- $v_{100} \approx 137,806.0$
As $k \to \infty$, $v_k \to \infty$. Because $\gamma > 1$, the operator is an expansion mapping, causing unanchored iterations to explode to infinity.

---

## 8.7 Solved Exercises

### Exercise 8.1: Contraction Rate Calculation
If $\|u - v\|_\infty = 8.0$ and $\gamma = 0.75$, what is the maximum possible value of $\|T^\pi u - T^\pi v\|_\infty$?

#### Solution:
$$\|T^\pi u - T^\pi v\|_\infty \le \gamma \|u - v\|_\infty = 0.75 \times 8.0 = 6.0$$

---

### Exercise 8.2: First Sweep Value Calculation
An agent starts with $v_0(s) = 0$ everywhere.
State $s$ has expected reward $r_\pi(s) = 3.5$.
What is $v_1(s)$ after one synchronous sweep?

#### Solution:
$$v_1(s) = r_\pi(s) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^\pi v_0(s') = 3.5 + \gamma(0) = 3.5$$

---

### Exercise 8.3: Memory Complexity of Synchronous vs In-Place DP
For an environment with $N = 500,000$ states stored as 64-bit floats (`float64`, 8 bytes per value), calculate the memory required for synchronous vs in-place arrays.

#### Solution:
- Single array: $500,000 \times 8 \text{ bytes} = 4,000,000 \text{ bytes} \approx 3.815 \text{ MB}$.
- Synchronous DP requires two arrays (`V_old`, `V_new`): $2 \times 3.815 \text{ MB} \approx 7.63 \text{ MB}$.
- In-place DP requires only one array: $\approx 3.815 \text{ MB}$.

---

### Exercise 8.4: Uniform Policy on Ring Lattice
A 4-state ring has transitions: $s_1 \to s_2 \to s_3 \to s_4 \to s_1$.
Each step earns reward $R = 1.0$. If $\gamma = 0.8$, find the exact value $v(s_1)$.

#### Solution:
By symmetry, all states have identical value: $v(s_1) = v(s_2) = v(s_3) = v(s_4) = v$.
The Bellman equation is:
$$v = 1.0 + 0.8 v \implies 0.2 v = 1.0 \implies v = 5.0$$

---

### Exercise 8.5: Iterative Reduction of Initial Bias
Suppose an engineer maliciously initializes $v_0(s) = 1,000,000$ for all states.
If $\gamma = 0.90$, how many iterations are required to reduce the contribution of this initial bias to less than $0.01$?

#### Solution:
The bias decays by $\gamma^k$:
$$\gamma^k \times 1,000,000 \le 0.01 \implies (0.90)^k \le 10^{-8}$$
$$k \ln(0.90) \le \ln(10^{-8}) \implies k(-0.10536) \le -18.4207$$
$$k \ge \frac{-18.4207}{-0.10536} \approx 174.83 \implies k = 175 \text{ iterations}$$

---

### Exercise 8.6: Contraction Under Zero Reward
If all rewards are zero ($r_\pi(s) \equiv 0$), what is the unique fixed point of $T^\pi$?

#### Solution:
The fixed-point equation is $\mathbf{v} = \mathbf{0} + \gamma \mathbf{P}_\pi \mathbf{v} \implies (\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v} = \mathbf{0}$.
Since $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ is invertible, the only solution is the zero vector:
$$\mathbf{v}_\pi = \mathbf{0}$$

---

### Exercise 8.7: Synchronous Policy Evaluation Convergence
Prove that if $\mathbf{v}_1 = \mathbf{v}_0$, the algorithm has reached the exact fixed point.

#### Solution:
By definition, $\mathbf{v}_1 = T^\pi \mathbf{v}_0$.
If $\mathbf{v}_1 = \mathbf{v}_0$, then $T^\pi \mathbf{v}_0 = \mathbf{v}_0$.
Thus $\mathbf{v}_0$ satisfies the definition of a fixed point. By the Banach uniqueness theorem, $\mathbf{v}_0 = \mathbf{v}_\pi$.

---

### Exercise 8.8: Dynamic Programming as Expected Update
Why are Dynamic Programming updates referred to as "expected updates" (or "full backups") in contrast to sample updates?

#### Solution:
Because they compute the complete mathematical expectation across all possible next states and actions using the model's true transition probabilities ($\sum_{s'} \mathcal{P}_{s, s'}^a v(s')$), rather than drawing a single sampled state transition from an actual environmental interaction ($R_{t+1} + \gamma V(S_{t+1})$).

---

### Exercise 8.9: Gauss-Seidel Update Order Dependency
Does the order in which states are swept in Gauss-Seidel in-place DP affect the final converged value vector?

#### Solution:
No. The ordering affects the trajectory of intermediate iterates and the number of sweeps required to reach convergence, but the final limit point is uniquely determined by the Banach Fixed-Point Theorem: all orderings converge to the identical fixed point $\mathbf{v}_\pi$.

---

### Exercise 8.10: Infinite-Horizon Undiscounted Policy Evaluation Condition
Under what condition on the environment does undiscounted policy evaluation ($\gamma = 1.0$) converge to a unique, finite fixed point?

#### Solution:
Convergence is guaranteed if and only if all policies lead to an absorbing terminal state with probability 1.0 from every state (i.e. every state is transient), ensuring that the transient transition sub-matrix has spectral radius strictly less than 1 ($\rho(\mathbf{Q}) < 1$).
