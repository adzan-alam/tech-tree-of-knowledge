# Chapter 6: The Bellman Expectation Equations: Derivations, Matrix Algebra, and Backup Diagrams

---

## 6.1 The Recursive Revolution: Unfolding the Horizon

In 1957, Richard Bellman achieved one of the great conceptual breakthroughs in applied mathematics. Prior to Bellman, calculating the expected return of a sequential decision process required evaluating high-dimensional path integrals over entire trajectory sequences—a combinatorial impossibility for all but the most trivial toy problems.

Bellman realized that by exploiting the memoryless nature of Markovian systems, **the global infinite-horizon problem collapses into a local two-period recursive relationship**. You do not need to forecast the entire future all at once. You only need to know:
1. What reward will I earn in the immediate next step?
2. What will be the expected value of the state I land in?

```
                               THE BELLMAN RECURSIVE UNFOLDING
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │     GLOBAL PERSPECTIVE  │                     │    RECURSIVE LOCAL STEP │
         │   Infinite Path Sum     │                     │     Bellman Equation    │
         ├─────────────────────────┤                     ├─────────────────────────┤
         │ E[Σ_{k=0}^∞ γ^k R_{t+k}]│     ═════════►      │ E[ R_{t+1} + γ V(S_{t+1})│
         │ Combines entire future  │                     │ Two-period recurrence:  │
         │ in one intractable sum. │                     │ Today + Discounted Tmrw │
         └─────────────────────────┘                     └─────────────────────────┘
```

---

## 6.2 First-Principles Derivation of the Bellman Expectation Equation for $v_\pi(s)$

We begin with the formal definition of the state-value function under policy $\pi$:
$$v_\pi(s) \doteq \mathbb{E}_\pi [G_t \mid S_t = s]$$

Recall the fundamental recursive decomposition of the cumulative return:
$$G_t = R_{t+1} + \gamma G_{t+1}$$

Substitute this identity directly into the expectation:
$$v_\pi(s) = \mathbb{E}_\pi [R_{t+1} + \gamma G_{t+1} \mid S_t = s]$$

By the linearity of mathematical expectation:
$$v_\pi(s) = \mathbb{E}_\pi [R_{t+1} \mid S_t = s] + \gamma \mathbb{E}_\pi [G_{t+1} \mid S_t = s]$$

Now, invoke the **Law of Total Expectation** (the Tower Property) by conditioning the second expectation on the realized next state $S_{t+1} = s'$:
$$\mathbb{E}_\pi [G_{t+1} \mid S_t = s] = \sum_{s' \in \mathcal{S}} \mathbb{P}(S_{t+1} = s' \mid S_t = s, \pi) \mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s']$$

By the definition of the state-value function at state $s'$:
$$\mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] = v_\pi(s')$$

Therefore:
$$v_\pi(s) = \mathbb{E}_\pi [R_{t+1} \mid S_t = s] + \gamma \sum_{s' \in \mathcal{S}} \mathbb{P}(S_{t+1} = s' \mid S_t = s, \pi) v_\pi(s')$$

To express this expectation in terms of explicit MDP transition dynamics, condition on action selection $A_t = a$:
$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t = s, \pi) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) p(s', r \mid s, a)$$

Multiplying by $(r + \gamma v_\pi(s'))$ and summing over all possible actions $a \in \mathcal{A}(s)$, destination states $s' \in \mathcal{S}$, and reward values $r \in \mathcal{R}$, we arrive at the canonical **Bellman Expectation Equation for $v_\pi(s)$**:

$$v_\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma v_\pi(s') \right]$$

Equivalently, using the marginalized transition kernel $\mathcal{P}_{s, s'}^a$ and expected reward $r(s, a)$:

$$v_\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_\pi(s') \right]$$

---

## 6.3 First-Principles Derivation of the Bellman Expectation Equation for $q_\pi(s, a)$

Now consider the action-value function:
$$q_\pi(s, a) \doteq \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a]$$

Substitute $G_t = R_{t+1} + \gamma G_{t+1}$:
$$q_\pi(s, a) = \mathbb{E}_\pi [R_{t+1} + \gamma G_{t+1} \mid S_t = s, A_t = a]$$

Condition on the environment's response $(S_{t+1} = s', R_{t+1} = r)$:
$$q_\pi(s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma \mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] \right]$$

By definition, $\mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] = v_\pi(s')$. Furthermore, using Bridge 1 ($v_\pi(s') = \sum_{a'} \pi(a' \mid s') q_\pi(s', a')$):
$$\mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] = \sum_{a' \in \mathcal{A}(s')} \pi(a' \mid s') q_\pi(s', a')$$

Substituting this back gives the canonical **Bellman Expectation Equation for $q_\pi(s, a)$**:

$$q_\pi(s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma \sum_{a' \in \mathcal{A}(s')} \pi(a' \mid s') q_\pi(s', a') \right]$$

Equivalently:

$$q_\pi(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a \sum_{a' \in \mathcal{A}(s')} \pi(a' \mid s') q_\pi(s', a')$$

---

## 6.4 Visual Semantics: The Backup Diagrams

To build intuitive geometric models of these equations, Sutton & Barto developed **Backup Diagrams**. They are called "backup" diagrams because information flows upward (backward in time) from successor configurations to the root decision node.

```
       BACKUP DIAGRAM FOR v_π(s)                       BACKUP DIAGRAM FOR q_π(s, a)
                 (s)   State Node (Root)                         ●  Action Node (Root)
                /   \                                           / \
        π(a_1) /     \ π(a_2)                                  /   \
              ▼       ▼                                       ▼     ▼
              ●       ● Action Nodes                        (s_1)   (s_2) Next State Nodes
             / \     / \                                    /   \   /   \
            ▼   ▼   ▼   ▼                           π(a_1) /     \ /     \ π(a_2)
          (s_1)(s_2)(s_1)(s_2) Next State Nodes       ▼       ▼ ▼     ▼
                                                      ●       ● ●     ● Next Action Nodes
```

### Visual Convention:
- **Open Circles $\bigcirc$:** Represent **States** ($s \in \mathcal{S}$).
- **Solid Dots $\bullet$:** Represent **Actions** ($a \in \mathcal{A}$).
- **Branching from $\bigcirc \to \bullet$:** Represents the agent's policy choice $\pi(a \mid s)$.
- **Branching from $\bullet \to \bigcirc$:** Represents the environment's stochastic transition dynamics $p(s', r \mid s, a)$.

In the diagram for $v_\pi(s)$, we start at root state $s$, branch across all actions according to $\pi(a \mid s)$, and from each action node, branch across all possible next states according to environmental transition probabilities $\mathcal{P}_{s, s'}^a$. The value at the root is the weighted average of the leaves.

---

## 6.5 Vector-Matrix Formulation of the Bellman Equation

For a finite MDP with $|\mathcal{S}| = N$ states, the Bellman expectation equation for a fixed policy $\pi$ is not merely a scalar relation; it forms an $N$-dimensional system of linear equations.

Recall the policy-induced transition matrix $\mathbf{P}_\pi \in \mathbb{R}^{N \times N}$ and policy-induced reward vector $\mathbf{r}_\pi \in \mathbb{R}^N$:
$$\mathbf{P}_\pi = \begin{bmatrix}
\mathcal{P}_{s_1, s_1}^\pi & \mathcal{P}_{s_1, s_2}^\pi & \dots & \mathcal{P}_{s_1, s_N}^\pi \\
\mathcal{P}_{s_2, s_1}^\pi & \mathcal{P}_{s_2, s_2}^\pi & \dots & \mathcal{P}_{s_2, s_N}^\pi \\
\vdots & \vdots & \ddots & \vdots \\
\mathcal{P}_{s_N, s_1}^\pi & \mathcal{P}_{s_N, s_2}^\pi & \dots & \mathcal{P}_{s_N, s_N}^\pi
\end{bmatrix}, \quad
\mathbf{r}_\pi = \begin{bmatrix} r_\pi(s_1) \\ r_\pi(s_2) \\ \vdots \\ r_\pi(s_N) \end{bmatrix}, \quad
\mathbf{v}_\pi = \begin{bmatrix} v_\pi(s_1) \\ v_\pi(s_2) \\ \vdots \\ v_\pi(s_N) \end{bmatrix}$$

The $N$ scalar equations can be written compactly as a single matrix-vector equation:

$$\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi$$

```
   ┌─────────┐   ┌─────────┐             ┌───────────────────┐ ┌─────────┐
   │ v(s_1)  │   │ r(s_1)  │             │ P_{11} ... P_{1N} │ │ v(s_1)  │
   │ v(s_2)  │ = │ r(s_2)  │  +  γ  ·    │ P_{21} ... P_{2N} │ │ v(s_2)  │
   │  ...    │   │  ...    │             │   ...  ...   ...  │ │  ...    │
   │ v(s_N)  │   │ r(s_N)  │             │ P_{N1} ... P_{NN} │ │ v(s_N)  │
   └─────────┘   └─────────┘             └───────────────────┘ └─────────┘
      v_π           r_π                          P_π              v_π
```

---

## 6.6 The Closed-Form Analytical Solution and Matrix Inversion

To solve for the unknown value vector $\mathbf{v}_\pi$, we rearrange terms algebraically:
$$\mathbf{v}_\pi - \gamma \mathbf{P}_\pi \mathbf{v}_\pi = \mathbf{r}_\pi$$
Factor out $\mathbf{v}_\pi$, where $\mathbf{I} \in \mathbb{R}^{N \times N}$ is the identity matrix:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v}_\pi = \mathbf{r}_\pi$$

Assuming the matrix $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ is invertible:

$$\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$$

### Proof of Invertibility via the Neumann Series
Why is $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ guaranteed to be non-singular for all $\gamma \in [0, 1)$?

**Proof:**
Let $\mathbf{P}_\pi$ be any stochastic matrix. 
By the Gershgorin Circle Theorem or the properties of stochastic matrices, every eigenvalue $\lambda_i$ of $\mathbf{P}_\pi$ satisfies $|\lambda_i| \le 1$.
The eigenvalues of $\gamma \mathbf{P}_\pi$ are $\gamma \lambda_i$.
Because $\gamma \in [0, 1)$, the spectral radius $\rho(\gamma \mathbf{P}_\pi)$ satisfies:
$$\rho(\gamma \mathbf{P}_\pi) = \max_i |\gamma \lambda_i| \le \gamma < 1$$

When the spectral radius of a matrix $\mathbf{A}$ is strictly less than 1, the matrix $(\mathbf{I} - \mathbf{A})$ is strictly invertible, and its inverse is given by the absolutely convergent **Neumann Series**:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} = \sum_{k=0}^{\infty} (\gamma \mathbf{P}_\pi)^k = \mathbf{I} + \gamma \mathbf{P}_\pi + \gamma^2 \mathbf{P}_\pi^2 + \gamma^3 \mathbf{P}_\pi^3 + \dots$$

Multiplying by $\mathbf{r}_\pi$:
$$\mathbf{v}_\pi = \sum_{k=0}^{\infty} \gamma^k \mathbf{P}_\pi^k \mathbf{r}_\pi$$
This reveals the deep mathematical harmony of reinforcement learning:
- $\mathbf{r}_\pi$ is the reward earned at $t = 0$.
- $\mathbf{P}_\pi \mathbf{r}_\pi$ is the expected reward earned at $t = 1$.
- $\mathbf{P}_\pi^k \mathbf{r}_\pi$ is the expected reward earned at $t = k$.
The matrix inverse $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ is literally the infinite discounted sum of expected future reward vectors.

### Computational Complexity: The $O(N^3)$ Barrier
If an exact analytical solution exists, why don't we always compute $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$?
- Inverting an $N \times N$ matrix via Gaussian elimination or LU decomposition has computational complexity:
  $$\mathcal{O}(N^3) = \mathcal{O}(|\mathcal{S}|^3)$$
- For a small MDP with $N = 100$ states: $N^3 = 10^6$ operations (instantaneous).
- For an MDP with $N = 10,000$ states: $N^3 = 10^{12}$ operations (requires hours on high-end clusters).
- For a backgammon or chess board: $N \ge 10^{20}$, where $N^3 = 10^{60}$, completely impossible.

This cubic complexity barrier is the computational justification for **Dynamic Programming** and **Iterative Policy Evaluation**, which avoid matrix inversion entirely by computing successive approximations.

---

## 6.7 Worked Examples: Bellman Expectation Matrix Systems

### Example 6.1: Hand Calculation of Closed-Form Matrix Inversion
Consider an MRP with two states $\mathcal{S} = \{s_1, s_2\}$.
Transition matrix: $\mathbf{P} = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix}$.
Reward vector: $\mathbf{r} = \begin{bmatrix} 5.0 \\ 1.0 \end{bmatrix}$.
Discount factor: $\gamma = 0.50$.

1. Compute $(\mathbf{I} - \gamma \mathbf{P})$.
2. Compute $\det(\mathbf{I} - \gamma \mathbf{P})$.
3. Invert the matrix analytically.
4. Compute the exact value vector $\mathbf{v} = (\mathbf{I} - \gamma \mathbf{P})^{-1} \mathbf{r}$.

#### Solution:
**Step 1: Compute $(\mathbf{I} - \gamma \mathbf{P})$:**
$$\gamma \mathbf{P} = 0.50 \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix} = \begin{bmatrix} 0.25 & 0.25 \\ 0.10 & 0.40 \end{bmatrix}$$
$$\mathbf{I} - \gamma \mathbf{P} = \begin{bmatrix} 1 - 0.25 & -0.25 \\ -0.10 & 1 - 0.40 \end{bmatrix} = \begin{bmatrix} 0.75 & -0.25 \\ -0.10 & 0.60 \end{bmatrix}$$

**Step 2: Determinant:**
$$\det(\mathbf{I} - \gamma \mathbf{P}) = (0.75)(0.60) - (-0.25)(-0.10) = 0.450 - 0.025 = 0.425 = \frac{17}{40}$$

**Step 3: Matrix Inverse:**
For a $2 \times 2$ matrix $\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$:
$$(\mathbf{I} - \gamma \mathbf{P})^{-1} = \frac{1}{0.425} \begin{bmatrix} 0.60 & 0.25 \\ 0.10 & 0.75 \end{bmatrix}$$
$$\frac{0.60}{0.425} = \frac{24}{17} \approx 1.4118, \quad \frac{0.25}{0.425} = \frac{10}{17} \approx 0.5882$$
$$\frac{0.10}{0.425} = \frac{4}{17} \approx 0.2353, \quad \frac{0.75}{0.425} = \frac{30}{17} \approx 1.7647$$
$$(\mathbf{I} - \gamma \mathbf{P})^{-1} = \frac{1}{17} \begin{bmatrix} 24 & 10 \\ 4 & 30 \end{bmatrix}$$

**Step 4: Compute $\mathbf{v}$:**
$$\mathbf{v} = \frac{1}{17} \begin{bmatrix} 24 & 10 \\ 4 & 30 \end{bmatrix} \begin{bmatrix} 5.0 \\ 1.0 \end{bmatrix} = \frac{1}{17} \begin{bmatrix} 24(5) + 10(1) \\ 4(5) + 30(1) \end{bmatrix} = \frac{1}{17} \begin{bmatrix} 120 + 10 \\ 20 + 30 \end{bmatrix} = \frac{1}{17} \begin{bmatrix} 130 \\ 50 \end{bmatrix}$$
$$v(s_1) = \frac{130}{17} \approx 7.6471$$
$$v(s_2) = \frac{50}{17} \approx 2.9412$$

---

### Example 6.2: Verifying Bellman Consistency of the Solution
Using the exact values $v(s_1) = \frac{130}{17}$ and $v(s_2) = \frac{50}{17}$ from Example 6.1, substitute them into the right-hand side of the scalar Bellman equation:
$$v_{\text{rhs}}(s) = r(s) + \gamma \sum_{s'} \mathcal{P}_{s, s'} v(s')$$
and verify that $v_{\text{rhs}}(s_1) = v(s_1)$ and $v_{\text{rhs}}(s_2) = v(s_2)$.

#### Solution:
**For state $s_1$:**
$$v_{\text{rhs}}(s_1) = 5.0 + 0.50 \left[ 0.5 v(s_1) + 0.5 v(s_2) \right] = 5.0 + 0.25 [v(s_1) + v(s_2)]$$
$$v(s_1) + v(s_2) = \frac{130 + 50}{17} = \frac{180}{17}$$
$$v_{\text{rhs}}(s_1) = 5.0 + 0.25 \left( \frac{180}{17} \right) = \frac{85}{17} + \frac{45}{17} = \frac{130}{17} = v(s_1) \quad \checkmark$$

**For state $s_2$:**
$$v_{\text{rhs}}(s_2) = 1.0 + 0.50 \left[ 0.2 v(s_1) + 0.8 v(s_2) \right]$$
$$0.2 v(s_1) + 0.8 v(s_2) = \frac{0.2(130) + 0.8(50)}{17} = \frac{26 + 40}{17} = \frac{66}{17}$$
$$v_{\text{rhs}}(s_2) = 1.0 + 0.50 \left( \frac{66}{17} \right) = \frac{17}{17} + \frac{33}{17} = \frac{50}{17} = v(s_2) \quad \checkmark$$
The exact solution satisfies the Bellman expectation equations with zero residual error.

---

### Example 6.3: Neumann Series Truncation vs. Exact Inverse
Using the parameters from Example 6.1 ($\gamma \mathbf{P} = \begin{bmatrix} 0.25 & 0.25 \\ 0.10 & 0.40 \end{bmatrix}$):
1. Compute the first two terms of the Neumann series: $\mathbf{S}_1 = \mathbf{I} + \gamma \mathbf{P}$.
2. Compute the approximate value $\hat{\mathbf{v}}_1 = \mathbf{S}_1 \mathbf{r}$.
3. Compute the approximation error $\|\mathbf{v} - \hat{\mathbf{v}}_1\|_\infty$.

#### Solution:
**Step 1: First Two Terms:**
$$\mathbf{S}_1 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + \begin{bmatrix} 0.25 & 0.25 \\ 0.10 & 0.40 \end{bmatrix} = \begin{bmatrix} 1.25 & 0.25 \\ 0.10 & 1.40 \end{bmatrix}$$

**Step 2: Approximate Value:**
$$\hat{\mathbf{v}}_1 = \begin{bmatrix} 1.25 & 0.25 \\ 0.10 & 1.40 \end{bmatrix} \begin{bmatrix} 5.0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 1.25(5) + 0.25(1) \\ 0.10(5) + 1.40(1) \end{bmatrix} = \begin{bmatrix} 6.25 + 0.25 \\ 0.50 + 1.40 \end{bmatrix} = \begin{bmatrix} 6.50 \\ 1.90 \end{bmatrix}$$

**Step 3: Error:**
- State $s_1$: $|7.6471 - 6.50| = 1.1471$.
- State $s_2$: $|2.9412 - 1.90| = 1.0412$.
$$\|\mathbf{v} - \hat{\mathbf{v}}_1\|_\infty = 1.1471$$
Adding higher powers $(\gamma \mathbf{P})^k$ rapidly shrinks this residual to zero.

---

### Example 6.4: 3-State Cyclic MRP Analytical Solution
Consider a cyclic 3-state MRP: $s_1 \to s_2 \to s_3 \to s_1$.
Transition matrix:
$$\mathbf{P} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}, \quad \mathbf{r} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \quad \gamma = 0.90$$
Set up the linear system $(\mathbf{I} - \gamma \mathbf{P}) \mathbf{v} = \mathbf{r}$ and solve for $v(s_1), v(s_2), v(s_3)$.

#### Solution:
The scalar Bellman equations are:
$$v_1 = 1 + 0.9 v_2$$
$$v_2 = 2 + 0.9 v_3$$
$$v_3 = 3 + 0.9 v_1$$

Substitute $v_3$ into $v_2$:
$$v_2 = 2 + 0.9(3 + 0.9 v_1) = 2 + 2.7 + 0.81 v_1 = 4.7 + 0.81 v_1$$

Substitute $v_2$ into $v_1$:
$$v_1 = 1 + 0.9(4.7 + 0.81 v_1) = 1 + 4.23 + 0.729 v_1 = 5.23 + 0.729 v_1$$
$$(1 - 0.729) v_1 = 5.23 \implies 0.271 v_1 = 5.23$$
$$v_1 = \frac{5.23}{0.271} \approx 19.2989$$

Now compute $v_2$ and $v_3$:
$$v_2 = 4.7 + 0.81(19.2989) = 4.7 + 15.6321 = 20.3321$$
$$v_3 = 3 + 0.9(19.2989) = 3 + 17.3690 = 20.3690$$

---

### Example 6.5: Policy Comparison via Bellman Systems
An agent can execute policy $\pi_1$ or $\pi_2$ on state space $\mathcal{S} = \{s_1, s_2\}$ with $\gamma = 0.80$:
- Under $\pi_1$: $\mathbf{P}_{\pi_1} = \begin{bmatrix} 0.6 & 0.4 \\ 0.3 & 0.7 \end{bmatrix}, \quad \mathbf{r}_{\pi_1} = \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix}$.
- Under $\pi_2$: $\mathbf{P}_{\pi_2} = \begin{bmatrix} 0.9 & 0.1 \\ 0.1 & 0.9 \end{bmatrix}, \quad \mathbf{r}_{\pi_2} = \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix}$.

Solve both linear systems and determine if one policy strictly dominates the other.

#### Solution:
**1. Solve for $\pi_1$:**
$$\mathbf{I} - 0.8 \mathbf{P}_{\pi_1} = \begin{bmatrix} 1 - 0.48 & -0.32 \\ -0.24 & 1 - 0.56 \end{bmatrix} = \begin{bmatrix} 0.52 & -0.32 \\ -0.24 & 0.44 \end{bmatrix}$$
$\det = (0.52)(0.44) - (0.32)(0.24) = 0.2288 - 0.0768 = 0.1520$.
$$\mathbf{v}_{\pi_1} = \frac{1}{0.1520} \begin{bmatrix} 0.44 & 0.32 \\ 0.24 & 0.52 \end{bmatrix} \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix} = \frac{1}{0.1520} \begin{bmatrix} 0.88 + 0.32 \\ 0.48 + 0.52 \end{bmatrix} = \frac{1}{0.1520} \begin{bmatrix} 1.20 \\ 1.00 \end{bmatrix}$$
$$v_{\pi_1}(s_1) = \frac{1.20}{0.1520} \approx 7.8947, \quad v_{\pi_1}(s_2) = \frac{1.00}{0.1520} \approx 6.5789$$

**2. Solve for $\pi_2$:**
$$\mathbf{I} - 0.8 \mathbf{P}_{\pi_2} = \begin{bmatrix} 1 - 0.72 & -0.08 \\ -0.08 & 1 - 0.72 \end{bmatrix} = \begin{bmatrix} 0.28 & -0.08 \\ -0.08 & 0.28 \end{bmatrix}$$
$\det = (0.28)^2 - (-0.08)^2 = 0.0784 - 0.0064 = 0.0720$.
$$\mathbf{v}_{\pi_2} = \frac{1}{0.0720} \begin{bmatrix} 0.28 & 0.08 \\ 0.08 & 0.28 \end{bmatrix} \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix} = \frac{1}{0.0720} \begin{bmatrix} 0.28 + 0.24 \\ 0.08 + 0.84 \end{bmatrix} = \frac{1}{0.0720} \begin{bmatrix} 0.52 \\ 0.92 \end{bmatrix}$$
$$v_{\pi_2}(s_1) = \frac{0.52}{0.0720} \approx 7.2222, \quad v_{\pi_2}(s_2) = \frac{0.92}{0.0720} \approx 12.7778$$

**Comparison:**
- In $s_1$: $v_{\pi_1}(s_1) = 7.89 > 7.22 = v_{\pi_2}(s_1)$ ($\pi_1$ is superior in $s_1$).
- In $s_2$: $v_{\pi_2}(s_2) = 12.78 > 6.58 = v_{\pi_1}(s_2)$ ($\pi_2$ is superior in $s_2$).
Neither policy strictly dominates. A hybrid policy that takes $\pi_1$'s action in $s_1$ and $\pi_2$'s action in $s_2$ will outperform both.

---

### Example 6.6: Bellman Equation for Deterministic Gridworld
Consider a $2 \times 2$ Gridworld:
```
┌───────┬───────┐
│  s_1  │  s_2  │
├───────┼───────┤
│  s_3  │  s_4  │  (s_4 is absorbing terminal)
└───────┴───────┘
```
- Movement into walls keeps the agent in place.
- Reaching $s_4$ yields $R = 0$.
- All other steps yield $R = -1.0$.
- Discount factor $\gamma = 1.0$.
- Let policy $\pi$ always command: in $s_1 \to \text{Right} (s_2)$; in $s_2 \to \text{Down} (s_4)$; in $s_3 \to \text{Right} (s_4)$.

Set up the Bellman expectation system and solve for $v(s_1), v(s_2), v(s_3)$.

#### Solution:
Since $s_4$ is terminal, $v(s_4) = 0$.
- For $s_2$: takes agent directly to $s_4$:
  $$v(s_2) = -1.0 + 1.0 \cdot v(s_4) = -1.0 + 0 = -1.0$$
- For $s_1$: takes agent to $s_2$:
  $$v(s_1) = -1.0 + 1.0 \cdot v(s_2) = -1.0 + (-1.0) = -2.0$$
- For $s_3$: takes agent directly to $s_4$:
  $$v(s_3) = -1.0 + 1.0 \cdot v(s_4) = -1.0 + 0 = -1.0$$
The values directly count the negative steps to the goal: $v = [-2.0, -1.0, -1.0, 0.0]^T$.

---

### Example 6.7: The Spectral Radius Condition
Prove that if $\gamma = 1.0$ and the Markov chain contains an absorbing terminal state reachable from every transient state with non-zero probability, the sub-matrix $(\mathbf{I} - \mathbf{Q})$ governing transient states is non-singular.

#### Solution:
Let $\mathbf{Q} \in \mathbb{R}^{m \times m}$ be the transition sub-matrix among the $m$ transient states.
Because the chain can transition from transient states to absorbing states with positive probability, there exists at least one transient state $i$ where $\sum_{j=1}^m Q_{ij} < 1$.
Furthermore, reachability implies that there exists an integer $k \ge 1$ such that every row of $\mathbf{Q}^k$ has sum strictly less than 1:
$$\max_i \sum_{j=1}^m (\mathbf{Q}^k)_{ij} \le c < 1$$
Therefore, the induced matrix norm $\|\mathbf{Q}^k\|_\infty < 1$.
By Gelfand's formula for the spectral radius:
$$\rho(\mathbf{Q}) = \lim_{n \to \infty} \|\mathbf{Q}^n\|^{1/n} \le (\|\mathbf{Q}^k\|_\infty)^{1/k} < 1$$
Since the spectral radius of $\mathbf{Q}$ is strictly less than 1, $\det(\mathbf{I} - \mathbf{Q}) \neq 0$, and $(\mathbf{I} - \mathbf{Q})$ is strictly invertible even with $\gamma = 1.0$.

---

### Example 6.8: Deriving Action-Values from Matrix Solutions
Using the value vector $\mathbf{v} = [7.6471, 2.9412]^T$ from Example 6.1 and the transition matrix $\mathbf{P} = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix}$:
Compute the Q-values $q(s_1, a)$ and $q(s_2, a)$ where $a$ is the action executed under the MRP.

#### Solution:
By Bridge 2:
$$q(s_1, a) = r(s_1) + \gamma [0.5 v(s_1) + 0.5 v(s_2)]$$
$$= 5.0 + 0.50 [0.5(7.6471) + 0.5(2.9412)] = 5.0 + 0.50(5.29415) = 5.0 + 2.6471 = 7.6471 = v(s_1)$$
$$q(s_2, a) = r(s_2) + \gamma [0.2 v(s_1) + 0.8 v(s_2)]$$
$$= 1.0 + 0.50 [0.2(7.6471) + 0.8(2.9412)] = 1.0 + 0.50 [1.5294 + 2.3530] = 1.0 + 0.50(3.8824) = 1.0 + 1.9412 = 2.9412 = v(s_2)$$
In an MRP with a single action per state, $q(s, a) \equiv v(s)$.

---

### Example 6.9: Sensitivity of Value Functions to Transition Perturbations
Suppose an environment's transition probability $\mathcal{P}_{11}$ is perturbed by a small $\Delta p$: $\tilde{\mathbf{P}} = \mathbf{P} + \Delta \mathbf{P}$.
Using the matrix calculus derivative of an inverse: $\frac{\partial \mathbf{A}^{-1}}{\partial x} = -\mathbf{A}^{-1} \frac{\partial \mathbf{A}}{\partial x} \mathbf{A}^{-1}$, derive the first-order variation in the value vector $\Delta \mathbf{v}_\pi$.

#### Solution:
We have $\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$.
Let $\mathbf{A} = (\mathbf{I} - \gamma \mathbf{P}_\pi)$. Then $\Delta \mathbf{A} = -\gamma \Delta \mathbf{P}_\pi$.
Using $\Delta (\mathbf{A}^{-1}) \approx -\mathbf{A}^{-1} (\Delta \mathbf{A}) \mathbf{A}^{-1}$:
$$\Delta (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \approx -(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} (-\gamma \Delta \mathbf{P}_\pi) (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} = \gamma (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \Delta \mathbf{P}_\pi (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$$
Multiplying by $\mathbf{r}_\pi$, and recognizing that $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi = \mathbf{v}_\pi$:
$$\Delta \mathbf{v}_\pi \approx \gamma (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \Delta \mathbf{P}_\pi \mathbf{v}_\pi$$
The variation in state values is amplified by the resolvent matrix $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$, which has norm scaling as $O(\frac{1}{1 - \gamma})$.

---

### Example 6.10: Solving Bellman System via Gaussian Elimination
Solve the $3 \times 3$ Bellman system $\mathbf{A} \mathbf{v} = \mathbf{r}$ where:
$$\mathbf{A} = \begin{bmatrix} 1.0 & -0.4 & 0.0 \\ 0.0 & 1.0 & -0.5 \\ -0.2 & 0.0 & 1.0 \end{bmatrix}, \quad \mathbf{r} = \begin{bmatrix} 2.0 \\ 1.0 \\ 3.0 \end{bmatrix}$$

#### Solution:
Write the augmented matrix:
$$\left[ \begin{array}{ccc|c} 1.0 & -0.4 & 0.0 & 2.0 \\ 0.0 & 1.0 & -0.5 & 1.0 \\ -0.2 & 0.0 & 1.0 & 3.0 \end{array} \right]$$
Row 3 $\leftarrow$ Row 3 $+ 0.2 \times$ Row 1:
$$-0.2 + 0.2(1.0) = 0.0$$
$$0.0 + 0.2(-0.4) = -0.08$$
$$1.0 + 0.2(0.0) = 1.0$$
$$3.0 + 0.2(2.0) = 3.4$$
New Row 3: $[0.0, -0.08, 1.0 \mid 3.4]$.

Row 3 $\leftarrow$ Row 3 $+ 0.08 \times$ Row 2:
$$0.0 + 0.08(0.0) = 0.0$$
$$-0.08 + 0.08(1.0) = 0.0$$
$$1.0 + 0.08(-0.5) = 1.0 - 0.04 = 0.96$$
$$3.4 + 0.08(1.0) = 3.4 + 0.08 = 3.48$$

Back-substitution:
$$0.96 v_3 = 3.48 \implies v_3 = \frac{3.48}{0.96} = 3.625$$
From Row 2:
$$v_2 - 0.5 v_3 = 1.0 \implies v_2 = 1.0 + 0.5(3.625) = 1.0 + 1.8125 = 2.8125$$
From Row 1:
$$v_1 - 0.4 v_2 = 2.0 \implies v_1 = 2.0 + 0.4(2.8125) = 2.0 + 1.125 = 3.125$$
Solution: $\mathbf{v} = [3.125, 2.8125, 3.625]^T$.

---

## 6.8 Solved Exercises

### Exercise 6.1: Bellman Equation Formulation
Write the scalar Bellman expectation equation for a state $s$ where policy $\pi$ selects action $a_1$ with prob $0.6$ and $a_2$ with prob $0.4$, given immediate rewards $r(s, a_1) = 2, r(s, a_2) = -1$, and $\gamma = 0.9$.

#### Solution:
$$v_\pi(s) = 0.6 \left[ 2.0 + 0.9 \sum_{s'} \mathcal{P}_{s, s'}^{a_1} v_\pi(s') \right] + 0.4 \left[ -1.0 + 0.9 \sum_{s'} \mathcal{P}_{s, s'}^{a_2} v_\pi(s') \right]$$
$$v_\pi(s) = (1.2 - 0.4) + 0.9 \left[ 0.6 \sum_{s'} \mathcal{P}_{s, s'}^{a_1} v_\pi(s') + 0.4 \sum_{s'} \mathcal{P}_{s, s'}^{a_2} v_\pi(s') \right]$$
$$v_\pi(s) = 0.8 + 0.54 \sum_{s'} \mathcal{P}_{s, s'}^{a_1} v_\pi(s') + 0.36 \sum_{s'} \mathcal{P}_{s, s'}^{a_2} v_\pi(s')$$

---

### Exercise 6.2: 1-State Infinite Loop Value
A single-state MDP loops back to itself with probability 1.0 and reward $R = 4.0$. If $\gamma = 0.75$, compute $v(s)$ using the Bellman equation.

#### Solution:
$$v(s) = 4.0 + 0.75 v(s) \implies (1 - 0.75) v(s) = 4.0 \implies 0.25 v(s) = 4.0 \implies v(s) = 16.0$$

---

### Exercise 6.3: Gershgorin Disc Bounds on Eigenvalues
Use Gershgorin's Circle Theorem to prove that no eigenvalue of a stochastic matrix $\mathbf{P}$ can have magnitude strictly greater than 1.

#### Solution:
By Gershgorin's theorem, every eigenvalue of $\mathbf{P}$ lies within at least one disc $D_i = \{z \in \mathbb{C} : |z - P_{ii}| \le \sum_{j \neq i} P_{ij}\}$.
For any stochastic matrix, all entries $P_{ij} \ge 0$ and $\sum_j P_{ij} = 1 \implies \sum_{j \neq i} P_{ij} = 1 - P_{ii}$.
Thus, for any $z \in D_i$:
$$|z| \le |z - P_{ii}| + |P_{ii}| \le (1 - P_{ii}) + P_{ii} = 1$$
Therefore, $|\lambda| \le 1$ for all eigenvalues.

---

### Exercise 6.4: Resolvent Series Expansion
Given $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ and $\gamma = 0.5$, calculate the 3rd-order truncated series $\mathbf{S}_2 = \mathbf{I} + \gamma \mathbf{P} + \gamma^2 \mathbf{P}^2$.

#### Solution:
Note that $\mathbf{P}^2 = \mathbf{I}$.
$$\mathbf{S}_2 = \mathbf{I} + 0.5 \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} + 0.25 \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1.25 & 0.50 \\ 0.50 & 1.25 \end{bmatrix}$$

---

### Exercise 6.5: Direct Inversion Infeasibility
If an algorithm requires $N^3$ floating-point operations to invert an $N \times N$ matrix, and a supercomputer performs $10^{15}$ operations per second (1 PFLOPS), calculate the computation time for $N = 10^7$ states.

#### Solution:
$$\text{Operations} = (10^7)^3 = 10^{21} \text{ FLOPs}$$
$$\text{Time} = \frac{10^{21}}{10^{15}} = 10^6 \text{ seconds} \approx 11.57 \text{ days}$$

---

### Exercise 6.6: Bellman Equation for Terminal States
Why does the Bellman equation for a terminal state $s_T$ not require recursive successor evaluation?

#### Solution:
By definition of an absorbing terminal state, once entered, no further transitions occur and all future rewards are identically zero ($R_{t+k} = 0, \forall k \ge 1$). Thus, the cumulative return $G_t \equiv 0$, fixing $v_\pi(s_T) = 0$ as a known constant boundary condition without recursion.

---

### Exercise 6.7: Action-Value Matrix System
Can action-values $q_\pi(s, a)$ also be written as a linear system $\mathbf{q}_\pi = \mathbf{r}_{SA} + \gamma \mathbf{P}_{SA} \mathbf{q}_\pi$? State the dimensions of $\mathbf{P}_{SA}$.

#### Solution:
Yes. Let there be $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions, yielding $|\mathcal{S}| \times |\mathcal{A}|$ state-action pairs.
$$\mathbf{P}_{SA}((s, a), (s', a')) = \mathcal{P}_{s, s'}^a \pi(a' \mid s')$$
The matrix $\mathbf{P}_{SA}$ is a square stochastic matrix of size $(|\mathcal{S}| \cdot |\mathcal{A}|) \times (|\mathcal{S}| \cdot |\mathcal{A}|)$.

---

### Exercise 6.8: Symmetry in State Values
If an environment is perfectly symmetric between states $s_1$ and $s_2$ ($r(s_1) = r(s_2)$, $\mathcal{P}_{11} = \mathcal{P}_{22}$, and $\mathcal{P}_{12} = \mathcal{P}_{21}$), prove that $v(s_1) = v(s_2)$ for any discount factor $\gamma < 1$.

#### Solution:
The Bellman equations are:
$$v(s_1) = r + \gamma [\mathcal{P}_{11} v(s_1) + \mathcal{P}_{12} v(s_2)]$$
$$v(s_2) = r + \gamma [\mathcal{P}_{21} v(s_1) + \mathcal{P}_{22} v(s_2)] = r + \gamma [\mathcal{P}_{12} v(s_1) + \mathcal{P}_{11} v(s_2)]$$
Subtracting the two equations:
$$v(s_1) - v(s_2) = \gamma (\mathcal{P}_{11} - \mathcal{P}_{12}) [v(s_1) - v(s_2)]$$
$$[v(s_1) - v(s_2)] [1 - \gamma (\mathcal{P}_{11} - \mathcal{P}_{12})] = 0$$
Since $|\mathcal{P}_{11} - \mathcal{P}_{12}| \le 1$ and $\gamma < 1$, the second factor is strictly positive ($1 - \gamma (\dots) > 0$).
Therefore, $v(s_1) - v(s_2) = 0 \implies v(s_1) = v(s_2)$.

---

### Exercise 6.9: Effect of Increasing Discount Factor on Matrix Condition Number
What happens to the condition number $\kappa(\mathbf{I} - \gamma \mathbf{P})$ as $\gamma \to 1^-$?

#### Solution:
As $\gamma \to 1$, the smallest eigenvalue of $(\mathbf{I} - \gamma \mathbf{P})$ approaches $1 - \gamma \to 0$ (since $\mathbf{P}$ has an eigenvalue $\lambda = 1$).
The condition number $\kappa = \frac{\sigma_{\max}}{\sigma_{\min}} \approx \frac{O(1)}{1 - \gamma} \to \infty$.
The matrix becomes severely ill-conditioned, amplifying numerical rounding errors.

---

### Exercise 6.10: Uniqueness of Bellman Solution
Prove that the system $(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v} = \mathbf{r}_\pi$ cannot have multiple distinct solutions for $\gamma \in [0, 1)$.

#### Solution:
Suppose there exist two distinct solutions $\mathbf{u} \neq \mathbf{v}$ such that:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{u} = \mathbf{r}_\pi \quad \text{and} \quad (\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v} = \mathbf{r}_\pi$$
Subtracting the two equations yields:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi) (\mathbf{u} - \mathbf{v}) = \mathbf{0}$$
Since $\det(\mathbf{I} - \gamma \mathbf{P}_\pi) \neq 0$ (all eigenvalues are non-zero), the null space of $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ contains only the trivial vector $\mathbf{0}$.
Therefore, $\mathbf{u} - \mathbf{v} = \mathbf{0} \implies \mathbf{u} = \mathbf{v}$. The solution is strictly unique.
