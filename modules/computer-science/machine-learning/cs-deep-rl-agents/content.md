# Chapter 1: The Curse of Dimensionality & The Function Approximation Paradigm

---

## 1.1 The Collapse of the Tabular Realm

In the preceding treatise (*Markov Decision Processes, Bellman Optimality, and Value Iteration*), we established the foundational mathematics of reinforcement learning under a comforting structural assumption: **the Tabular Assumption**. 

Under this assumption, every state $s \in \mathcal{S}$ and state-action pair $(s, a) \in \mathcal{S} \times \mathcal{A}$ is allocated a distinct, private entry in a discrete memory array:
- A state-value table $V[s]$ storing a single floating-point number per state.
- An action-value table $Q[s, a]$ storing $|\mathcal{A}|$ floating-point numbers per state.

When updating table entry $Q[s, a]$, the value of that specific cell shifts while leaving every other cell in the universe completely untouched. In small, toy environmentsâ€”a $4 \times 4$ gridworld, an 11-cell cliff walk, or a 100-state casino blackjack gameâ€”this tabular separation is both computationally tractable and theoretically pristine.

```
                          THE COLLAPSE OF THE TABULAR MATRIX
                                          â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                                                           â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚   TABULAR PARADIGM    â”‚                                   â”‚ FUNCTION APPROXIMATIONâ”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                                   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ â€¢ 1 slot per state    â”‚                                   â”‚ â€¢ Weight vector w âˆˆ R^dâ”‚
 â”‚ â€¢ Independent updates â”‚        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–º          â”‚ â€¢ Parameter sharing   â”‚
 â”‚ â€¢ Zero generalization â”‚     Exponential Explosion         â”‚ â€¢ Global inductive    â”‚
 â”‚ â€¢ Memory: O(|S| Â· |A|)â”‚          |S| ~ k^d                â”‚   generalization      â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Physical Reality: Continuous and Astronomical State Spaces
In the real physical universe, intelligent systems do not operate inside $4 \times 4$ discrete grids:
1. **Continuous Physical Spaces:** An autonomous drone does not occupy discrete cells; its position $(x, y, z) \in \mathbb{R}^3$, velocity $(\dot{x}, \dot{y}, \dot{z}) \in \mathbb{R}^3$, angular orientation $(\phi, \theta, \psi) \in [-\pi, \pi]^3$, and angular rates $(\omega_x, \omega_y, \omega_z) \in \mathbb{R}^3$ are continuous real numbers. The cardinality of the state space is uncountably infinite:
   $$|\mathcal{S}| = |\mathbb{R}^{12}| = \mathfrak{c} \quad (\text{the continuum})$$
   You cannot allocate an array with an infinite number of slots.
2. **Combinatorial Discrete Spaces:** Even when state spaces are technically discrete, their combinatorial complexity defies physical comprehension. A standard $8 \times 8$ board of Othello has $\sim 10^{28}$ states; a $19 \times 19$ board of Go has $\sim 10^{170}$ states. 
3. **Visual Perception:** An Atari 2600 video game emulator outputs frames of $210 \times 160$ pixels with 128 colors. Even after downsampling to an $84 \times 84$ grayscale image with 256 pixel intensities, the number of distinct possible frames is:
   $$256^{84 \times 84} = 256^{7,056} \approx 10^{16,990} \text{ states}$$
   The observable universe contains approximately $10^{80}$ subatomic particles. Storing a tabular Q-matrix for Atari is a physical impossibility.

### The Generalization Imperative
Even if a supercomputer possessed sufficient memory to store $10^{170}$ entries, tabular reinforcement learning would still fail catastrophically.

In a tabular system, updating state $s$ provides **zero information** about state $s'$, even if $s$ and $s'$ differ by a single microsecond or a single hair's breadth. An autonomous car that learned how to avoid a pedestrian at GPS coordinate $(37.774900, -122.419400)$ would be completely oblivious to the pedestrian at $(37.774901, -122.419400)$! It would have to hit the pedestrian thousands of times at every conceivable millimeter to populate its lookup table.

Intelligent agents must possess **Inductive Generalization**: the ability to transfer experiential knowledge gained in a tiny subset of visited states to an unvisited, vast expanse of similar configurations.

---

## 1.2 Mathematical Formulation of Value Function Approximation

To achieve generalization across continuous or massive state spaces, we replace the discrete lookup table with a parameterized mathematical function.

```
                              THE APPROXIMATION PIPELINE
                                          â”‚
                            Raw Environmental State s âˆˆ S
                                          â”‚
                                          â–¼ Feature Extractor
                             Feature Vector x(s) âˆˆ R^d
                                          â”‚
                                          â–¼ Inner Product / Deep Network
                            Parameter Weights w âˆˆ R^d or Î¸
                                          â”‚
                                          â–¼
                            Scalar Value Estimate v^(s, w) â‰ˆ v_Ï€(s)
```

### Formal Representation
Let $\mathbf{w} \in \mathbb{R}^d$ be a vector of real-valued parameters (weights), where the parameter dimensionality $d$ is vastly smaller than the state space cardinality:
$$d \ll |\mathcal{S}|$$

The true state-value function $v_\pi(s)$ is approximated by a parameterized function $\hat{v}: \mathcal{S} \times \mathbb{R}^d \to \mathbb{R}$:
$$\hat{v}(s, \mathbf{w}) \approx v_\pi(s)$$

Similarly, the action-value function $q_\pi(s, a)$ is approximated by $\hat{q}: \mathcal{S} \times \mathcal{A} \times \mathbb{R}^d \to \mathbb{R}$:
$$\hat{q}(s, a, \mathbf{w}) \approx q_\pi(s, a)$$

When $\mathbf{w}$ is adjusted to improve the value prediction for state $s$, the continuous nature of $\hat{v}$ automatically adjusts the predictions for all geometrically or semantically similar states.

---

## 1.3 The Mean Squared Value Error Objective ($\overline{\text{VE}}$)

In tabular dynamic programming, we evaluated convergence using the supremum norm:
$$\|v - v_\pi\|_\infty = \max_{s \in \mathcal{S}} |v(s) - v_\pi(s)|$$

Under function approximation, because $d \ll |\mathcal{S}|$, the parameter vector $\mathbf{w}$ does not possess enough degrees of freedom to match $v_\pi(s)$ perfectly across all states. A compromise is mandatory: improving accuracy in one region of the state space inevitably degrades accuracy in another.

To formalize this trade-off, we define a principled scalar optimization objective: the **Mean Squared Value Error**, denoted $\overline{\text{VE}}$:

$$\overline{\text{VE}}(\mathbf{w}) \doteq \sum_{s \in \mathcal{S}} d^\pi(s) \left[ v_\pi(s) - \hat{v}(s, \mathbf{w}) \right]^2$$

In continuous state spaces, the sum is replaced by an integral:
$$\overline{\text{VE}}(\mathbf{w}) \doteq \int_{\mathcal{S}} d^\pi(s) \left[ v_\pi(s) - \hat{v}(s, \mathbf{w}) \right]^2 ds$$

### The State Distribution Weighting $d^\pi(s)$
Why does $d^\pi(s)$ appear in the objective function?
- $d^\pi(s)$ represents the **on-policy stationary state distribution** (or discounted occupancy distribution) under policy $\pi$:
  $$d^\pi(s) = \lim_{t \to \infty} \mathbb{P}(S_t = s \mid S_0 \sim \mu_0, \pi)$$
- An agent does not care equally about all theoretical states. It cares deeply about states that it visits frequently, and cares very little about states that it visits once every million years.
- Weighting by $d^\pi(s)$ ensures that the function approximator concentrates its limited representational budget on the states that dominate operational performance.

---

## 1.4 Gradient Descent on State-Value Approximators

How do we optimize $\mathbf{w}$ to minimize $\overline{\text{VE}}(\mathbf{w})$? We apply the standard calculus of **Gradient Descent**.

### Batch Gradient Descent Derivation
The gradient of $\overline{\text{VE}}(\mathbf{w})$ with respect to the weight vector $\mathbf{w}$ is:

$$\begin{aligned}
\nabla_\mathbf{w} \overline{\text{VE}}(\mathbf{w}) &= \nabla_\mathbf{w} \sum_{s \in \mathcal{S}} d^\pi(s) \left[ v_\pi(s) - \hat{v}(s, \mathbf{w}) \right]^2 \\
&= \sum_{s \in \mathcal{S}} d^\pi(s) \nabla_\mathbf{w} \left[ v_\pi(s) - \hat{v}(s, \mathbf{w}) \right]^2 \\
&= \sum_{s \in \mathcal{S}} d^\pi(s) \cdot 2 \left[ v_\pi(s) - \hat{v}(s, \mathbf{w}) \right] \cdot \nabla_\mathbf{w} \left( v_\pi(s) - \hat{v}(s, \mathbf{w}) \right) \\
&= -2 \sum_{s \in \mathcal{S}} d^\pi(s) \left[ v_\pi(s) - \hat{v}(s, \mathbf{w}) \right] \nabla_\mathbf{w} \hat{v}(s, \mathbf{w})
\end{aligned}$$

Writing the sum as an expectation over states sampled from the stationary distribution $S \sim d^\pi$:
$$\nabla_\mathbf{w} \overline{\text{VE}}(\mathbf{w}) = -2 \mathbb{E}_{S \sim d^\pi} \left[ \left( v_\pi(S) - \hat{v}(S, \mathbf{w}) \right) \nabla_\mathbf{w} \hat{v}(S, \mathbf{w}) \right]$$

### Stochastic Gradient Descent (SGD)
In online reinforcement learning, we do not evaluate the full expectation over all states. Instead, at each time step $t$, the agent observes an empirical state transition $S_t \sim d^\pi$. 
We eliminate the expectation and update $\mathbf{w}$ along the instantaneous stochastic gradient direction:

$$\mathbf{w}_{t+1} \doteq \mathbf{w}_t - \frac{1}{2} \alpha \nabla_\mathbf{w} \left[ v_\pi(S_t) - \hat{v}(S_t, \mathbf{w}_t) \right]^2$$

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \left[ v_\pi(S_t) - \hat{v}(S_t, \mathbf{w}_t) \right] \nabla_\mathbf{w} \hat{v}(S_t, \mathbf{w}_t)$$

where $\alpha > 0$ is the learning rate step size.

> [!NOTE]
> Notice the universal structure of the SGD update:
> $$\text{Parameter Shift } \Delta \mathbf{w} = \alpha \times [\text{Prediction Error}] \times [\text{Gradient Vector}]$$
> - If $\hat{v}(S_t, \mathbf{w}) < v_\pi(S_t)$ (underestimation), the error is positive, pushing $\mathbf{w}$ in the direction of the gradient $\nabla_\mathbf{w} \hat{v}$.
> - If $\hat{v}(S_t, \mathbf{w}) > v_\pi(S_t)$ (overestimation), the error is negative, pushing $\mathbf{w}$ against the gradient.

---

## 1.5 Linear Function Approximation and Feature Construction

The simplest and most mathematically well-behaved class of function approximators is the family of **Linear Function Approximators**.

### Definition of Linear Approximators
In a linear function approximator, the state $s$ is first mapped to a $d$-dimensional real **Feature Vector** via a feature extraction function $\mathbf{x}: \mathcal{S} \to \mathbb{R}^d$:
$$\mathbf{x}(s) \doteq \begin{bmatrix} x_1(s) \\ x_2(s) \\ \vdots \\ x_d(s) \end{bmatrix} \in \mathbb{R}^d$$

The estimated value is the inner product (dot product) of the weight vector $\mathbf{w}$ and the feature vector $\mathbf{x}(s)$:

$$\hat{v}(s, \mathbf{w}) \doteq \mathbf{w}^T \mathbf{x}(s) = \sum_{i=1}^d w_i x_i(s)$$

### The Gradient of a Linear Approximator
The gradient of a linear function with respect to its weights is simply the feature vector itself:

$$\nabla_\mathbf{w} \hat{v}(s, \mathbf{w}) = \nabla_\mathbf{w} \left( \mathbf{w}^T \mathbf{x}(s) \right) = \mathbf{x}(s)$$

Substituting this into the general SGD update yields the **Linear SGD Value Update**:

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \left[ v_\pi(S_t) - \mathbf{w}_t^T \mathbf{x}(S_t) \right] \mathbf{x}(S_t)$$

### Global Optimality of Linear Approximators
In linear function approximation, the objective function $\overline{\text{VE}}(\mathbf{w})$ is a quadratic function of $\mathbf{w}$:
$$\overline{\text{VE}}(\mathbf{w}) = \mathbb{E} [(v_\pi(s) - \mathbf{w}^T \mathbf{x}(s))^2] = \mathbb{E}[v_\pi^2] - 2 \mathbf{w}^T \mathbb{E}[v_\pi \mathbf{x}] + \mathbf{w}^T \mathbb{E}[\mathbf{x} \mathbf{x}^T] \mathbf{w}$$
Because the expectation of the outer product $\mathbf{A} \doteq \mathbb{E}[\mathbf{x} \mathbf{x}^T]$ is positive semi-definite, $\overline{\text{VE}}(\mathbf{w})$ is a **strictly convex bowl**. It possesses no local minima, saddle points, or plateaus! Any local optimum is guaranteed to be the unique global optimum $\mathbf{w}^*$.

---

## 1.6 Classical Feature Engineering Methods

How do we construct the feature vector $\mathbf{x}(s)$ from a raw scalar state $s \in \mathbb{R}$ or vector $\mathbf{s} \in \mathbb{R}^p$?

```
                             CLASSICAL FEATURE MECHANISMS
                                          â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                             â–¼                             â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚   POLYNOMIAL BASES    â”‚     â”‚ RADIAL BASIS FUNCTIONSâ”‚     â”‚      TILE CODING      â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ x(s) = [1, s, s^2, ..]â”‚     â”‚ Gaussian receptive    â”‚     â”‚ Multiple overlapping  â”‚
 â”‚ Smooth global curves; â”‚     â”‚ fields centered at Î¼_iâ”‚     â”‚ binary grids; sparse, â”‚
 â”‚ unstable at boundariesâ”‚     â”‚ Localized bell curves â”‚     â”‚ blazing fast bitmasks â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 1. Polynomial Bases
For a 1-dimensional state $s \in \mathbb{R}$, an $m$-th order polynomial basis constructs:
$$\mathbf{x}(s) = \begin{bmatrix} 1, & s, & s^2, & s^3, & \dots, & s^m \end{bmatrix}^T$$
- **Advantages:** Simple to implement; captures global curvature.
- **Flaws:** High-degree polynomials suffer from Runge's phenomenon (extreme oscillations near boundaries) and cannot localize adjustments.

### 2. Radial Basis Functions (RBFs)
Radial Basis Functions construct continuous receptive fields using multi-dimensional Gaussian kernels:
$$x_i(s) \doteq \exp\left( -\frac{\|s - \boldsymbol{\mu}_i\|^2}{2 \sigma_i^2} \right)$$
where $\boldsymbol{\mu}_i \in \mathcal{S}$ is the prototype center of the $i$-th feature and $\sigma_i^2$ is its bandwidth.
- **Advantages:** Produces infinitely differentiable, localized bell-curve representations. Updates to state $s$ affect only prototypes whose centers $\boldsymbol{\mu}_i$ are close to $s$.
- **Flaws:** Exponential scaling: covering a $p$-dimensional continuous space requires $k^p$ Gaussian centers.

### 3. Coarse Coding and Tile Coding
**Tile Coding** is the most computationally efficient linear feature representation in classical reinforcement learning:
- The continuous state space is partitioned into a grid of non-overlapping rectangular bins called a **Tiling**.
- Multiple overlapping tilings (typically $m = 8$ to $32$) are superimposed on the state space, with each tiling offset by a random or systematic fraction of the tile width.
- A state $s$ falls into exactly one tile per tiling. If there are $m$ tilings, the feature vector $\mathbf{x}(s) \in \{0, 1\}^d$ is **strictly sparse**: exactly $m$ entries are $1.0$, and all other $d - m$ entries are $0.0$.
- Computing the dot product $\mathbf{w}^T \mathbf{x}(s)$ requires zero multiplications: it is simply the sum of $m$ weights:
  $$\hat{v}(s, \mathbf{w}) = \sum_{i \in \text{ActiveTiles}(s)} w_i$$

---

## 1.7 Worked Examples: Linear Approximations & Feature Gradients

### Example 1.1: Single-Step Linear SGD Update
An agent uses a linear function approximator with 3 features:
$$\mathbf{x}(s) = [x_1(s), x_2(s), x_3(s)]^T$$
Current weights are $\mathbf{w} = [1.0, -2.0, 0.5]^T$.
At time step $t$, the agent visits state $S_t$ with feature values $\mathbf{x}(S_t) = [2.0, 1.0, 4.0]^T$.
The true target return observed is $G_t = 10.0$.
Learning rate is $\alpha = 0.05$.

1. Compute the current prediction $\hat{v}(S_t, \mathbf{w})$.
2. Compute the prediction error $\delta = G_t - \hat{v}(S_t, \mathbf{w})$.
3. Compute the updated weight vector $\mathbf{w}_{t+1}$.
4. Compute the new prediction $\hat{v}(S_t, \mathbf{w}_{t+1})$ and verify error reduction.

#### Solution:
**Step 1: Current Prediction:**
$$\hat{v}(S_t, \mathbf{w}) = \mathbf{w}^T \mathbf{x}(S_t) = (1.0)(2.0) + (-2.0)(1.0) + (0.5)(4.0) = 2.0 - 2.0 + 2.0 = 2.0$$

**Step 2: Prediction Error:**
$$\delta = G_t - \hat{v}(S_t, \mathbf{w}) = 10.0 - 2.0 = +8.0$$

**Step 3: Weight Update:**
$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \delta \mathbf{x}(S_t) = \begin{bmatrix} 1.0 \\ -2.0 \\ 0.5 \end{bmatrix} + 0.05(8.0) \begin{bmatrix} 2.0 \\ 1.0 \\ 4.0 \end{bmatrix}$$
$$0.05 \times 8.0 = 0.40$$
$$\Delta \mathbf{w} = 0.40 \begin{bmatrix} 2.0 \\ 1.0 \\ 4.0 \end{bmatrix} = \begin{bmatrix} 0.80 \\ 0.40 \\ 1.60 \end{bmatrix}$$
$$\mathbf{w}_{t+1} = \begin{bmatrix} 1.0 + 0.80 \\ -2.0 + 0.40 \\ 0.5 + 1.60 \end{bmatrix} = \begin{bmatrix} 1.80 \\ -1.60 \\ 2.10 \end{bmatrix}$$

**Step 4: Verification of New Prediction:**
$$\hat{v}(S_t, \mathbf{w}_{t+1}) = (1.80)(2.0) + (-1.60)(1.0) + (2.10)(4.0) = 3.60 - 1.60 + 8.40 = 10.40$$
The prediction moved from $2.0$ toward the target $10.0$, cutting the original error $|10 - 2| = 8.0$ to $|10 - 10.4| = 0.4$.

---

### Example 1.2: Generalization Interference Between Two States
Continuing from Example 1.1, suppose state $S_B$ has features $\mathbf{x}(S_B) = [1.0, 0.0, 2.0]^T$.
1. Compute the prediction for $S_B$ before the update on $S_t$: $\hat{v}(S_B, \mathbf{w}_t)$.
2. Compute the prediction for $S_B$ after the update on $S_t$: $\hat{v}(S_B, \mathbf{w}_{t+1})$.
3. Explain how updating state $S_t$ caused inductive transfer to state $S_B$.

#### Solution:
**Step 1: Prediction Before Update:**
$$\hat{v}(S_B, \mathbf{w}_t) = (1.0)(1.0) + (-2.0)(0.0) + (0.5)(2.0) = 1.0 + 0.0 + 1.0 = 2.0$$

**Step 2: Prediction After Update:**
$$\hat{v}(S_B, \mathbf{w}_{t+1}) = (1.80)(1.0) + (-1.60)(0.0) + (2.10)(2.0) = 1.80 + 0.0 + 4.20 = 6.0$$

**Step 3: Inductive Transfer Mechanism:**
Notice that the agent never experienced state $S_B$ directly. However, because $S_B$ shares feature 1 ($x_1$) and feature 3 ($x_3$) with state $S_t$, adjusting weights to increase the value of $S_t$ automatically raised the predicted value of $S_B$ from $2.0 \to 6.0$. 
This demonstrates generalization: information learned at $S_t$ spreads to overlapping regions of the feature space.

---

### Example 1.3: Closed-Form Normal Equations for Linear Regression
In batch supervised value prediction over a dataset of $N$ visited states $\{s_1, \dots, s_N\}$ with target returns $\{y_1, \dots, y_N\}$:
Let $\mathbf{X} \in \mathbb{R}^{N \times d}$ be the design matrix whose $i$-th row is $\mathbf{x}(s_i)^T$, and $\mathbf{y} \in \mathbb{R}^N$ be the target vector.
1. Derive the closed-form Ordinary Least Squares (OLS) formula for the optimal weight vector $\mathbf{w}^*$.
2. Compute $\mathbf{w}^*$ for $N = 2$ states with $\mathbf{X} = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}$ and $\mathbf{y} = \begin{bmatrix} 5 \\ 7 \end{bmatrix}$.

#### Solution:
**Step 1: OLS Derivation:**
The batch squared error is:
$$\mathcal{L}(\mathbf{w}) = \|\mathbf{X} \mathbf{w} - \mathbf{y}\|_2^2 = (\mathbf{X} \mathbf{w} - \mathbf{y})^T (\mathbf{X} \mathbf{w} - \mathbf{y}) = \mathbf{w}^T \mathbf{X}^T \mathbf{X} \mathbf{w} - 2 \mathbf{w}^T \mathbf{X}^T \mathbf{y} + \mathbf{y}^T \mathbf{y}$$
Take the gradient with respect to $\mathbf{w}$ and set to zero:
$$\nabla_\mathbf{w} \mathcal{L}(\mathbf{w}) = 2 \mathbf{X}^T \mathbf{X} \mathbf{w} - 2 \mathbf{X}^T \mathbf{y} = \mathbf{0}$$
$$\mathbf{X}^T \mathbf{X} \mathbf{w}^* = \mathbf{X}^T \mathbf{y} \implies \mathbf{w}^* = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$$

**Step 2: Numerical Calculation:**
$$\mathbf{X}^T \mathbf{X} = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} = \begin{bmatrix} 1(1)+2(2) & 1(2)+2(1) \\ 2(1)+1(2) & 2(2)+1(1) \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 4 & 5 \end{bmatrix}$$
$\det(\mathbf{X}^T \mathbf{X}) = 5(5) - 4(4) = 25 - 16 = 9$.
$$(\mathbf{X}^T \mathbf{X})^{-1} = \frac{1}{9} \begin{bmatrix} 5 & -4 \\ -4 & 5 \end{bmatrix}$$
Compute $\mathbf{X}^T \mathbf{y}$:
$$\mathbf{X}^T \mathbf{y} = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 5 \\ 7 \end{bmatrix} = \begin{bmatrix} 1(5) + 2(7) \\ 2(5) + 1(7) \end{bmatrix} = \begin{bmatrix} 19 \\ 17 \end{bmatrix}$$
Compute $\mathbf{w}^*$:
$$\mathbf{w}^* = \frac{1}{9} \begin{bmatrix} 5 & -4 \\ -4 & 5 \end{bmatrix} \begin{bmatrix} 19 \\ 17 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 5(19) - 4(17) \\ -4(19) + 5(17) \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 95 - 68 \\ -76 + 85 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 27 \\ 9 \end{bmatrix} = \begin{bmatrix} 3.0 \\ 1.0 \end{bmatrix}$$
Verification: $\mathbf{X} \mathbf{w}^* = \begin{bmatrix} 1(3)+2(1) \\ 2(3)+1(1) \end{bmatrix} = \begin{bmatrix} 5 \\ 7 \end{bmatrix} = \mathbf{y} \quad \checkmark$.

---

### Example 1.4: Tile Coding Active Index Calculation
A 2D continuous state space has position $x \in [0, 10]$ and velocity $v \in [-2, 2]$.
A tile coding system uses $m = 4$ tilings. Each tiling has $5 \times 5 = 25$ tiles (bin widths $\Delta x = 2.0, \Delta v = 0.8$).
The tilings are offset systematically by $(\frac{\Delta x}{m}, \frac{\Delta v}{m}) = (0.5, 0.2)$.
- Tiling 0 offset: $(0.0, 0.0)$
- Tiling 1 offset: $(-0.5, -0.2)$
- Tiling 2 offset: $(-1.0, -0.4)$
- Tiling 3 offset: $(-1.5, -0.6)$

For state $s = (x = 3.2, v = 0.5)$:
Compute the $(i, j)$ tile coordinates activated in each of the 4 tilings.

#### Solution:
For Tiling $k$ with offset $(o_x^k, o_v^k)$:
$$\text{bin}_x = \left\lfloor \frac{x - o_x^k}{\Delta x} \right\rfloor, \quad \text{bin}_v = \left\lfloor \frac{v - (-2) - o_v^k}{\Delta v} \right\rfloor$$
- **Tiling 0:** Offset $(0, 0)$:
  - $\text{bin}_x = \lfloor \frac{3.2 - 0}{2.0} \rfloor = \lfloor 1.6 \rfloor = 1$
  - Adjusted $v = 0.5 - (-2) = 2.5$. $\text{bin}_v = \lfloor \frac{2.5 - 0}{0.8} \rfloor = \lfloor 3.125 \rfloor = 3$
  Tile activated: $(1, 3)$.
- **Tiling 1:** Offset $(-0.5, -0.2)$:
  - $\text{bin}_x = \lfloor \frac{3.2 - (-0.5)}{2.0} \rfloor = \lfloor \frac{3.7}{2.0} \rfloor = \lfloor 1.85 \rfloor = 1$
  - Adjusted $v = 2.5 - (-0.2) = 2.7$. $\text{bin}_v = \lfloor \frac{2.7}{0.8} \rfloor = \lfloor 3.375 \rfloor = 3$
  Tile activated: $(1, 3)$.
- **Tiling 2:** Offset $(-1.0, -0.4)$:
  - $\text{bin}_x = \lfloor \frac{3.2 - (-1.0)}{2.0} \rfloor = \lfloor \frac{4.2}{2.0} \rfloor = \lfloor 2.1 \rfloor = 2$
  - Adjusted $v = 2.5 - (-0.4) = 2.9$. $\text{bin}_v = \lfloor \frac{2.9}{0.8} \rfloor = \lfloor 3.625 \rfloor = 3$
  Tile activated: $(2, 3)$.
- **Tiling 3:** Offset $(-1.5, -0.6)$:
  - $\text{bin}_x = \lfloor \frac{3.2 - (-1.5)}{2.0} \rfloor = \lfloor \frac{4.7}{2.0} \rfloor = \lfloor 2.35 \rfloor = 2$
  - Adjusted $v = 2.5 - (-0.6) = 3.1$. $\text{bin}_v = \lfloor \frac{3.1}{0.8} \rfloor = \lfloor 3.875 \rfloor = 3$
  Tile activated: $(2, 3)$.

Active tiles: $[(1, 3), (1, 3), (2, 3), (2, 3)]$. Exactly 4 non-zero weights are summed to evaluate the state.

---

### Example 1.5: Radial Basis Function (RBF) Activation Evaluation
A 1D state $s \in [0, 10]$ uses 3 Gaussian RBF features with bandwidth $\sigma = 1.0$:
- Feature 1: center $\mu_1 = 2.0$.
- Feature 2: center $\mu_2 = 4.0$.
- Feature 3: center $\mu_3 = 6.0$.

For state $s = 3.8$:
1. Calculate the feature activations $x_1(s), x_2(s), x_3(s)$.
2. If weights are $\mathbf{w} = [10.0, 50.0, 30.0]^T$, compute the value estimate $\hat{v}(s, \mathbf{w})$.

#### Solution:
**Step 1: Feature Activations:**
Formula: $x_i(s) = \exp\left( -\frac{(s - \mu_i)^2}{2 \sigma^2} \right) = \exp\left( -\frac{(s - \mu_i)^2}{2} \right)$.
- For $\mu_1 = 2.0$:
  $$(s - \mu_1)^2 = (3.8 - 2.0)^2 = (1.8)^2 = 3.24$$
  $$x_1(s) = e^{-3.24 / 2} = e^{-1.62} \approx 0.1979$$
- For $\mu_2 = 4.0$:
  $$(s - \mu_2)^2 = (3.8 - 4.0)^2 = (-0.2)^2 = 0.04$$
  $$x_2(s) = e^{-0.04 / 2} = e^{-0.02} \approx 0.9802$$
- For $\mu_3 = 6.0$:
  $$(s - \mu_3)^2 = (3.8 - 6.0)^2 = (-2.2)^2 = 4.84$$
  $$x_3(s) = e^{-4.84 / 2} = e^{-2.42} \approx 0.0889$$
Feature vector: $\mathbf{x}(s) \approx [0.1979, 0.9802, 0.0889]^T$.

**Step 2: Value Prediction:**
$$\hat{v}(s, \mathbf{w}) = (10.0)(0.1979) + (50.0)(0.9802) + (30.0)(0.0889)$$
$$= 1.979 + 49.010 + 2.667 = 53.656$$

---

### Example 1.6: State Weighting Effect on Parameter Fit
Consider an environment with 2 states: $s_1$ with stationary probability $d^\pi(s_1) = 0.99$, and $s_2$ with $d^\pi(s_2) = 0.01$.
True values are $v_\pi(s_1) = 1.0, v_\pi(s_2) = 100.0$.
A 1-parameter model $\hat{v}(s, w) = w$ predicts the identical constant $w$ for both states.
Find the optimal parameter $w^*$ that minimizes $\overline{\text{VE}}(w)$.

#### Solution:
The objective function is:
$$\overline{\text{VE}}(w) = d^\pi(s_1) [v_\pi(s_1) - w]^2 + d^\pi(s_2) [v_\pi(s_2) - w]^2$$
$$\overline{\text{VE}}(w) = 0.99(1.0 - w)^2 + 0.01(100.0 - w)^2$$
Differentiate with respect to $w$ and set to zero:
$$\frac{d}{dw} \overline{\text{VE}}(w) = -2(0.99)(1.0 - w) - 2(0.01)(100.0 - w) = 0$$
$$0.99(1.0 - w) + 0.01(100.0 - w) = 0$$
$$0.99 - 0.99 w + 1.0 - 0.01 w = 0$$
$$1.99 - 1.00 w = 0 \implies w^* = 1.99$$
Notice: Even though state $s_2$ has value $100.0$, because it is visited only $1\%$ of the time, the optimal compromise $w^* = 1.99$ remains tightly anchored to the high-frequency state $s_1$ ($1.0$).

---

### Example 1.7: Deep Neural Network Value Approximator Gradient Chain Rule
Let a value function be approximated by a 2-layer Multi-Layer Perceptron (MLP):
$$\mathbf{h} = \text{ReLU}(\mathbf{W}_1 \mathbf{x} + \mathbf{b}_1), \quad \hat{v} = \mathbf{w}_2^T \mathbf{h} + b_2$$
Given target return $y$, derive the gradient with respect to the output layer weights $\mathbf{w}_2$ and first-layer weights $\mathbf{W}_1$.

#### Solution:
Let prediction error be $\delta = y - \hat{v}$.
Loss: $\mathcal{L} = \frac{1}{2} (y - \hat{v})^2 \implies \frac{\partial \mathcal{L}}{\partial \hat{v}} = -(y - \hat{v}) = -\delta$.
1. **Output Weights $\mathbf{w}_2$:**
   $$\nabla_{\mathbf{w}_2} \mathcal{L} = \frac{\partial \mathcal{L}}{\partial \hat{v}} \nabla_{\mathbf{w}_2} \hat{v} = -\delta \cdot \mathbf{h}$$
2. **Hidden Layer Activations $\mathbf{h}$:**
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{h}} = -\delta \mathbf{w}_2$$
3. **Pre-Activation $\mathbf{z} = \mathbf{W}_1 \mathbf{x} + \mathbf{b}_1$:**
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{z}} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}} \odot \mathbb{I}(\mathbf{z} > 0) = -\delta (\mathbf{w}_2 \odot \mathbb{I}(\mathbf{z} > 0))$$
4. **Input Weights $\mathbf{W}_1$:**
   $$\nabla_{\mathbf{W}_1} \mathcal{L} = \left( \frac{\partial \mathcal{L}}{\partial \mathbf{z}} \right) \mathbf{x}^T = -\delta \left[ \mathbf{w}_2 \odot \mathbb{I}(\mathbf{z} > 0) \right] \mathbf{x}^T$$
This reproduces standard reverse-mode backpropagation, allowing Deep RL agents to update internal representations end-to-end.

---

### Example 1.8: Normalization and Feature Scaling in Deep RL
A robotics environment produces observations with 3 components:
- Cart position: $x \in [-2.4, 2.4]\text{ m}$.
- Cart velocity: $\dot{x} \in [-10.0, 10.0]\text{ m/s}$.
- Pole angle: $\theta \in [-0.209, 0.209]\text{ rad}$.

Explain why feeding these unnormalized values directly into a linear or neural function approximator causes optimization instability, and derive the standard min-max scaling formula.

#### Solution:
In gradient descent:
$$\Delta \mathbf{w} \propto \mathbf{x}(s)$$
Features with large numerical magnitudes (e.g. $\dot{x} \approx 10.0$) produce weight updates that are $50\times$ larger than features with small numerical magnitudes (e.g. $\theta \approx 0.2$). The loss surface forms an extremely elongated, ill-conditioned elliptical canyon with condition number $\kappa \gg 1$, causing gradient descent to oscillate wildly perpendicular to the steep dimension while crawling along the shallow dimension.
**Min-Max Scaling:**
For each feature $i \in \{1, \dots, p\}$:
$$x_i^{\text{norm}} = 2 \left( \frac{x_i - x_i^{\min}}{x_i^{\max} - x_i^{\min}} \right) - 1 \in [-1, 1]$$
Transforming all state variables to $[-1, 1]$ sphericalizes the loss contours, ensuring uniform gradient propagation across all dimensions.

---

### Example 1.9: Step Size Bound for Linear Function Approximator Stability
Prove that for a linear function approximator $\hat{v}(s, \mathbf{w}) = \mathbf{w}^T \mathbf{x}(s)$ updated via SGD:
$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha [y_t - \mathbf{w}_t^T \mathbf{x}_t] \mathbf{x}_t$$
the learning rate must satisfy $\alpha < \frac{2}{\|\mathbf{x}_t\|^2}$ to prevent the single-step error from growing in magnitude.

#### Solution:
Evaluate the new prediction error on state $\mathbf{x}_t$:
$$\delta_{t+1} = y_t - \hat{v}(\mathbf{x}_t, \mathbf{w}_{t+1}) = y_t - \mathbf{w}_{t+1}^T \mathbf{x}_t$$
Substitute the update $\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \delta_t \mathbf{x}_t$:
$$\delta_{t+1} = y_t - (\mathbf{w}_t + \alpha \delta_t \mathbf{x}_t)^T \mathbf{x}_t = (y_t - \mathbf{w}_t^T \mathbf{x}_t) - \alpha \delta_t (\mathbf{x}_t^T \mathbf{x}_t) = \delta_t - \alpha \delta_t \|\mathbf{x}_t\|^2 = \delta_t (1 - \alpha \|\mathbf{x}_t\|^2)$$
To prevent error expansion ($|\delta_{t+1}| < |\delta_t|$), the multiplier must satisfy:
$$-1 < 1 - \alpha \|\mathbf{x}_t\|^2 < 1$$
The right inequality $1 - \alpha \|\mathbf{x}_t\|^2 < 1 \implies \alpha \|\mathbf{x}_t\|^2 > 0$ holds for all $\alpha > 0$.
The left inequality requires:
$$-1 < 1 - \alpha \|\mathbf{x}_t\|^2 \implies \alpha \|\mathbf{x}_t\|^2 < 2 \implies \alpha < \frac{2}{\|\mathbf{x}_t\|^2} \quad \blacksquare$$

---

### Example 1.10: Expressivity Limitation of Linear Models (XOR State Space)
Consider 4 states in a continuous 2D plane:
$s_1 = (0, 0) \to v = 0$
$s_2 = (0, 1) \to v = 1$
$s_3 = (1, 0) \to v = 1$
$s_4 = (1, 1) \to v = 0$

Prove that a linear function approximator $\hat{v}(\mathbf{s}, \mathbf{w}) = w_1 s_x + w_2 s_y + b$ cannot fit these values with zero error, and show how a non-linear feature solves the dilemma.

#### Solution:
To achieve zero error, the system must satisfy:
1. State $s_1$: $w_1(0) + w_2(0) + b = 0 \implies b = 0$.
2. State $s_2$: $w_1(0) + w_2(1) + b = 1 \implies w_2 = 1$.
3. State $s_3$: $w_1(1) + w_2(0) + b = 1 \implies w_1 = 1$.
4. State $s_4$: $w_1(1) + w_2(1) + b = 0 \implies 1 + 1 + 0 = 2 \neq 0$ (Contradiction!).
A linear model cannot represent non-linear parity/XOR relationships.
**Non-Linear Feature Solution:**
Augment the feature vector with the multiplicative interaction term $x_3 = s_x s_y$:
$$\hat{v}(\mathbf{s}, \mathbf{w}) = w_1 s_x + w_2 s_y + w_3 (s_x s_y)$$
Setting $w_1 = 1, w_2 = 1, w_3 = -2, b = 0$:
- $s_1$: $1(0) + 1(0) - 2(0) = 0 \quad \checkmark$
- $s_2$: $1(0) + 1(1) - 2(0) = 1 \quad \checkmark$
- $s_3$: $1(1) + 1(0) - 2(0) = 1 \quad \checkmark$
- $s_4$: $1(1) + 1(1) - 2(1) = 2 - 2 = 0 \quad \checkmark$
Non-linear representations (or deep neural networks) are required to capture complex state value manifolds.

---

## 1.8 Solved Exercises

### Exercise 1.1: Linear Prediction Error
A state has feature vector $\mathbf{x} = [1, 3, -1]^T$ and weight vector $\mathbf{w} = [2, 0.5, 1]^T$.
If the true observed value is $y = 6.0$, compute the prediction error $\delta$.

#### Solution:
$$\hat{v} = 1(2) + 3(0.5) + (-1)(1) = 2 + 1.5 - 1 = 2.5$$
$$\delta = y - \hat{v} = 6.0 - 2.5 = +3.5$$

---

### Exercise 1.2: Mean Squared Value Error Calculation
An environment has 2 states: $s_1$ with value $10$, and $s_2$ with value $20$.
Stationary probabilities are $d(s_1) = 0.8, d(s_2) = 0.2$.
A model predicts $\hat{v}(s_1) = 12$ and $\hat{v}(s_2) = 15$.
Compute the Mean Squared Value Error $\overline{\text{VE}}$.

#### Solution:
$$\overline{\text{VE}} = 0.8(10 - 12)^2 + 0.2(20 - 15)^2 = 0.8(-2)^2 + 0.2(5)^2 = 0.8(4) + 0.2(25) = 3.2 + 5.0 = 8.2$$

---

### Exercise 1.3: Number of Weights in Dense Neural Layer
A Deep Q-Network takes a continuous state vector of size 8 (e.g. LunarLander) and passes it into a hidden dense layer with 64 neurons (with biases).
How many parameters (weights and biases) are in this layer?

#### Solution:
$$\text{Weights} = 8 \times 64 = 512$$
$$\text{Biases} = 64$$
$$\text{Total Parameters} = 512 + 64 = 576$$

---

### Exercise 1.4: Tile Coding Sparsity Ratio
A tile coding system has $m = 16$ tilings over a continuous space, with a total dictionary of $d = 16,384$ tiles.
What percentage of the feature vector is active (non-zero) for any given state?

#### Solution:
$$\text{Sparsity Ratio} = \frac{16}{16,384} = \frac{1}{1,024} \approx 0.0009765 = 0.09765\%$$
Over $99.9\%$ of the feature vector is zero, allowing sparse matrix optimizations.

---

### Exercise 1.5: Gradient of Squared Error
Prove that $\nabla_\mathbf{w} \frac{1}{2} (y - \mathbf{w}^T \mathbf{x})^2 = -(y - \mathbf{w}^T \mathbf{x}) \mathbf{x}$.

#### Solution:
By the chain rule:
$$\nabla_\mathbf{w} \frac{1}{2} (y - \mathbf{w}^T \mathbf{x})^2 = (y - \mathbf{w}^T \mathbf{x}) \cdot \nabla_\mathbf{w} (y - \mathbf{w}^T \mathbf{x}) = (y - \mathbf{w}^T \mathbf{x}) \cdot (-\mathbf{x}) = -(y - \mathbf{w}^T \mathbf{x}) \mathbf{x}$$

---

### Exercise 1.6: Exact Interpolation Condition
For a dataset of $N$ states with $d$ linear features, under what condition can a linear function approximator achieve $\overline{\text{VE}} = 0$?

#### Solution:
Zero error is possible if $d \ge N$ (the feature dimension meets or exceeds the number of data points) and the design matrix $\mathbf{X}$ has full row rank $N$.

---

### Exercise 1.7: Fourier Basis Features
The 1D Fourier basis of order $m$ for state $s \in [0, 1]$ is defined by $x_i(s) = \cos(i \pi s)$ for $i = 0, 1, \dots, m$.
Write the feature vector for $m = 2$ at state $s = 0.5$.

#### Solution:
- $x_0(s) = \cos(0 \cdot \pi \cdot 0.5) = \cos(0) = 1.0$
- $x_1(s) = \cos(1 \cdot \pi \cdot 0.5) = \cos(\pi/2) = 0.0$
- $x_2(s) = \cos(2 \cdot \pi \cdot 0.5) = \cos(\pi) = -1.0$
$$\mathbf{x}(0.5) = [1.0, 0.0, -1.0]^T$$

---

### Exercise 1.8: Feature Orthogonality Benefit
If feature vectors are mutually orthogonal ($\mathbf{x}(s_i)^T \mathbf{x}(s_j) = 0$ for all $i \neq j$), how does updating the weights at state $s_i$ affect the value estimate at state $s_j$?

#### Solution:
$$\Delta \hat{v}(s_j) = (\Delta \mathbf{w})^T \mathbf{x}(s_j) = (\alpha \delta_i \mathbf{x}(s_i))^T \mathbf{x}(s_j) = \alpha \delta_i (\mathbf{x}(s_i)^T \mathbf{x}(s_j)) = 0$$
The prediction at $s_j$ is completely unchanged. Orthogonal features eliminate catastrophic interference (reproducing tabular behavior).

---

### Exercise 1.9: Memory Scaling of RBF Grids
If an engineer places 10 RBF centers along each dimension of an 8-dimensional robot arm state space, how many total RBF features are created?

#### Solution:
$$\text{Total Features} = 10^8 = 100,000,000 \text{ features}$$

---

### Exercise 1.10: The Role of Inductive Bias in Function Approximation
Explain in one sentence why function approximation is essential for reinforcement learning agents operating in real-world environments.

#### Solution:
Function approximation provides the inductive generalization required to predict values for previously unvisited states based on shared features, overcoming the curse of dimensionality inherent in tabular representations.


# Chapter 2: The Deadly Triad: Function Approximation, Bootstrapping, and Off-Policy Divergence

---

## 2.1 The Warning at the Gates of Deep RL

In Chapter 1, we observed that function approximation provides the essential inductive generalization required to conquer continuous and high-dimensional state spaces. In Module #3, we established that **Bootstrapping** (updating estimates using subsequent estimates, as in Temporal Difference learning and Dynamic Programming) is vastly more sample-efficient than waiting for full episodic returns. And in Chapter 11 of Module #3, we saw that **Off-Policy Learning** (learning about an optimal policy $\pi$ while following an exploratory behavior policy $b$) is indispensable for safe exploration and learning from logged datasets.

It is natural to assume that combining all three techniquesâ€”Function Approximation, Bootstrapping, and Off-Policy Learningâ€”would produce the ultimate, perfect reinforcement learning algorithm.

Instead, applied researchers in the 1990s encountered a catastrophic shock: **the algorithm violently diverged to infinity**.

```
                                  THE DEADLY TRIAD
                                         â–²
                                        / \
                                       /   \
                                      /     \
                                     /       \
                        FUNCTION    /         \    BOOTSTRAPPING
                     APPROXIMATION â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º (DP / TD / Q-Learning)
                                    \         /
                                     \       /
                                      \     /
                                       \   /
                                        \ /
                                         â–¼
                                     OFF-POLICY
                                      LEARNING
                               (Behavior b â‰  Target Ï€)
```

Richard Sutton and Andrew Barto crystallized this phenomenon into one of the most famous theoretical theorems in artificial intelligence: **The Deadly Triad**.

> **The Deadly Triad Principle (Sutton & Barto):**
> Whenever an algorithmic system combines all three of the following elements:
> 1. **Function Approximation:** Representing value functions using parameterized models with fewer parameters than states ($d \ll |\mathcal{S}|$).
> 2. **Bootstrapping:** Updating value targets recursively based on existing downstream value estimates ($R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w})$) rather than complete episodic returns.
> 3. **Off-Policy Training:** Training on a state distribution generated by a behavior policy $b$ that differs from the target policy $\pi$ being evaluated or optimized.
> 
> The system loses its contraction mapping guarantees. The Bellman operator projected onto the function approximation subspace ceases to be a contraction, causing parameter weights to oscillate uncontrollably or explode exponentially to $\pm \infty$.

---

## 2.2 Breaking the Triad: The Paths to Stability

Why does this instability occur, and how do we escape it? Remarkably, eliminating **any single one of the three legs** of the Deadly Triad immediately restores theoretical stability:

```
                            DEFUSING THE DEADLY TRIAD
                                        â”‚
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â–¼                            â–¼                            â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ DROP FUNCTION APPROX  â”‚    â”‚  DROP BOOTSTRAPPING   â”‚    â”‚    DROP OFF-POLICY    â”‚
â”‚    (Tabular Realm)    â”‚    â”‚ (Monte Carlo Methods) â”‚    â”‚  (On-Policy Learning) â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤    â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤    â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Pure lookup tables  â”‚    â”‚ â€¢ Uses full returns   â”‚    â”‚ â€¢ Behavior = Target   â”‚
â”‚ â€¢ Unconditional       â”‚    â”‚ â€¢ Strictly unbiased   â”‚    â”‚ â€¢ On-policy SARSA     â”‚
â”‚   convergence         â”‚    â”‚ â€¢ Stable even with    â”‚    â”‚ â€¢ Linear TD converges â”‚
â”‚ â€¢ Fails on high dims  â”‚    â”‚   deep neural nets!   â”‚    â”‚   with bounded error  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Eliminate Function Approximation (Return to Tabular):**
   If every state has a separate memory cell, tabular Q-Learning and Dynamic Programming converge to the unique optimal value function with probability 1.0 (Watkins & Dayan 1992). The maximum operator and bootstrapping cannot cause divergence in tabular representations. However, this abandons generalization and is trapped by the Curse of Dimensionality.
2. **Eliminate Bootstrapping (Use Monte Carlo):**
   If the agent evaluates policies using true, non-bootstrapped empirical returns $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$, the target values are fixed scalar labels. The optimization problem collapses into standard supervised regression! Even when using multi-billion-parameter deep neural networks and extreme off-policy data (e.g. offline logged datasets), Monte Carlo estimation can never diverge to infinity. However, it suffers from high variance and cannot learn online or in continuing tasks.
3. **Eliminate Off-Policy Training (Stick to On-Policy):**
   If the agent samples transitions strictly from the stationary distribution of the policy being evaluated ($b = \pi$, as in on-policy TD(0) or SARSA), linear function approximation is proven to converge to a unique fixed point with bounded error (Tsitsiklis & Van Roy 1997). The projection operator is a non-expansion under the distribution-weighted norm.

---

## 2.3 The Semi-Gradient Trick: Why We Drop the Target Gradient

Before examining explicit divergence counterexamples, we must resolve a fundamental calculus subtlety: **The Semi-Gradient Trick**.

Consider the Mean Squared Value Error under linear function approximation $\hat{v}(s, \mathbf{w}) = \mathbf{w}^T \mathbf{x}(s)$:
$$\mathcal{L}(\mathbf{w}) = \frac{1}{2} \left[ v_{\text{target}} - \hat{v}(S_t, \mathbf{w}) \right]^2$$

In Monte Carlo learning, the target is the empirical return $v_{\text{target}} = G_t$. The target $G_t$ is a constant number observed from the environment; it does not depend on the current weight vector $\mathbf{w}$. Taking the gradient is straightforward:
$$\nabla_\mathbf{w} \mathcal{L}(\mathbf{w}) = - [G_t - \hat{v}(S_t, \mathbf{w})] \nabla_\mathbf{w} \hat{v}(S_t, \mathbf{w})$$

### The Bootstrapping Dilemma
Now consider Temporal Difference learning, where the target is the 1-step bootstrap:
$$v_{\text{target}}(\mathbf{w}) \doteq R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w})$$
Notice that **the target itself depends directly on $\mathbf{w}$**!

If an engineer took the true, mathematically pedantic gradient of the loss $\frac{1}{2} [R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w}) - \hat{v}(S_t, \mathbf{w})]^2$ with respect to $\mathbf{w}$:
$$\nabla_\mathbf{w} \left( \frac{1}{2} \left[ R_{t+1} + \gamma \mathbf{w}^T \mathbf{x}_{t+1} - \mathbf{w}^T \mathbf{x}_t \right]^2 \right) = \left[ R_{t+1} + \gamma \mathbf{w}^T \mathbf{x}_{t+1} - \mathbf{w}^T \mathbf{x}_t \right] \cdot \nabla_\mathbf{w} \left( R_{t+1} + \gamma \mathbf{w}^T \mathbf{x}_{t+1} - \mathbf{w}^T \mathbf{x}_t \right)$$
$$= \delta_t \cdot \left( \gamma \mathbf{x}_{t+1} - \mathbf{x}_t \right) = -\delta_t \left( \mathbf{x}_t - \gamma \mathbf{x}_{t+1} \right)$$

This is known as the **Residual Gradient Algorithm** (Baird 1995). While it avoids divergence, it suffers from a fatal computational flaw: it minimizes the Bellman residual rather than the value error, leading to heavily biased solutions in stochastic environments (requiring two independent next-state samples from the same state).

### The Semi-Gradient Formulation
To preserve the true Bellman expectation semantics, reinforcement learning adopts the **Semi-Gradient Method**:
> **The Semi-Gradient Principle:** We treat the bootstrap target $R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w})$ as a fixed numerical scalar, **ignoring its dependency on $\mathbf{w}$ during differentiation**.

The semi-gradient update is:
$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \left[ R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w}_t) - \hat{v}(S_t, \mathbf{w}_t) \right] \nabla_\mathbf{w} \hat{v}(S_t, \mathbf{w}_t)$$
For linear models:
$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \left[ R_{t+1} + \gamma \mathbf{w}_t^T \mathbf{x}_{t+1} - \mathbf{w}_t^T \mathbf{x}_t \right] \mathbf{x}_t$$

Because the target is not a true gradient, the update vector is not guaranteed to descend the gradient of any fixed potential function. It is this semi-gradient approximation that creates the opening for divergence when combined with off-policy data.

---

## 2.4 Mathematical Autopsy: Baird's Counterexample

To prove definitively that off-policy semi-gradient bootstrapping diverges, Leemon Baird (1995) constructed an elegant, minimal 7-state MDP known as **Baird's Counterexample**.

```
                           BAIRD'S 7-STATE COUNTEREXAMPLE
  States 1 to 6 (Upper ring):
  Features: x(s_i) = 2 w_i + w_0
  
       (s_1)       (s_2)       (s_3)       (s_4)       (s_5)       (s_6)
         â”‚           â”‚           â”‚           â”‚           â”‚           â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚                 â”‚ Solid action (prob 1/7):
                     â”‚ Dotted action   â”‚ moves to s_7
                     â”‚ (prob 6/7):     â–¼
                     â”‚ moves to 1..6 â”Œâ”€â”€â”€â”€â”€â”€â”€â”
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  s_7  â”‚ Feature: x(s_7) = w_7 + 2 w_0
                                     â””â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The System Specifications
- **States:** 7 states $\mathcal{S} = \{s_1, s_2, s_3, s_4, s_5, s_6, s_7\}$.
- **Actions:** 2 actions:
  - **Dotted Action:** Transitions to states $\{s_1, \dots, s_6\}$ uniformly at random with probability $\frac{1}{6}$ each.
  - **Solid Action:** Transitions deterministically to state $s_7$ with probability $1.0$.
- **Rewards:** All rewards are identically zero on all transitions: $R \equiv 0$.
- **Discount Factor:** $\gamma = 0.99$.
- **Target Policy $\pi$:** Always selects the **Solid Action** ($\pi(\text{Solid} \mid s) = 1.0$ for all $s$). Under $\pi$, the agent always transitions to $s_7$.
- **Behavior Policy $b$:** Selects the Solid action with probability $\frac{1}{7}$, and the Dotted action with probability $\frac{6}{7}$.

### The Linear Feature Representation
The feature representation uses $d = 8$ parameters $\mathbf{w} = [w_1, w_2, w_3, w_4, w_5, w_6, w_7, w_0]^T$:
- For upper states $s_k$ ($k \in \{1, \dots, 6\}$):
  $$\mathbf{x}(s_k) = [0, \dots, 0, \underbrace{2}_{k\text{-th}}, 0, \dots, 0, 1]^T \implies \hat{v}(s_k, \mathbf{w}) = 2 w_k + w_0$$
- For bottom state $s_7$:
  $$\mathbf{x}(s_7) = [0, 0, 0, 0, 0, 0, 1, 2]^T \implies \hat{v}(s_7, \mathbf{w}) = w_7 + 2 w_0$$

### True Ground Truth
Because all rewards are zero ($R \equiv 0$) and the task is continuing, the true value of every state under target policy $\pi$ is identically zero:
$$v_\pi(s) = 0, \quad \forall s \in \mathcal{S}$$
The ideal weight vector is $\mathbf{w}^* = \mathbf{0}$.

### The Parameter Update Dynamics
When the off-policy semi-gradient update is executed:
$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha \rho_t \left[ R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w}_t) - \hat{v}(S_t, \mathbf{w}_t) \right] \mathbf{x}(S_t)$$

Under target policy $\pi$, the target action is always Solid, which transitions to $s_7$.
Thus, for every upper state $s_k$ ($k \in \{1, \dots, 6\}$):
The TD error is:
$$\delta_k = 0 + \gamma \hat{v}(s_7, \mathbf{w}) - \hat{v}(s_k, \mathbf{w}) = \gamma (w_7 + 2 w_0) - (2 w_k + w_0)$$
The expected update equation across all parameters forms a linear dynamical system:
$$\mathbf{w}_{t+1} = \mathbf{A} \mathbf{w}_t$$
where $\mathbf{A}$ is the iteration transition matrix.

### Eigenvalue Analysis: Proof of Divergence
Evaluating the eigenvalues of the expected transition matrix $\mathbf{A}$:
$$\det(\lambda \mathbf{I} - \mathbf{A}) = 0$$
Baird calculated that for learning rate $\alpha = 0.01$ and $\gamma = 0.99$, the matrix $\mathbf{A}$ possesses at least one real eigenvalue whose magnitude strictly exceeds unity:
$$|\lambda_{\max}| > 1.0$$
Because the dominant eigenvalue is strictly greater than 1, any non-zero initial parameter vector $\mathbf{w}_0$ projected onto the dominant eigenvector grows by a factor of $\lambda_{\max}$ at every step:
$$\mathbf{w}_t \approx c \cdot (\lambda_{\max})^t \mathbf{v}_{\max} \xrightarrow{t \to \infty} \pm \infty$$
The weights explode exponentially to infinity, despite:
- A completely linear function approximator.
- Deterministic rewards of zero.
- A tiny learning rate $\alpha = 0.01$.

---

## 2.5 Geometry of Divergence: The Projected Bellman Operator

Why does off-policy semi-gradient TD diverge, while Dynamic Programming converges? The geometric answer lies in the **Projected Bellman Equation**.

```
                        THE PROJECTION OPERATOR GEOMETRY
                                               â”‚
                                  Full State Space R^|S|
                                               â”‚
                                               â–¼ Bellman Operator T^Ï€
                                            T^Ï€ v (Flies out of subspace)
                                               â”‚
                                               â–¼ Projection Operator Î _d
                                           Î _d T^Ï€ v
                                               â”‚
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â–¼                                                                       â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚     ON-POLICY PROJECTION      â”‚                       â”‚     OFF-POLICY PROJECTION     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                       â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Weighted by d^Ï€(s)          â”‚                       â”‚ â€¢ Weighted by d^b(s) â‰  d^Ï€(s) â”‚
â”‚ â€¢ Î _d is an orthogonal        â”‚                       â”‚ â€¢ Oblique non-orthogonal      â”‚
â”‚   non-expansion: ||Î _d|| â‰¤ 1  â”‚                       â”‚   projection!                 â”‚
â”‚ â€¢ Composition Î _d T^Ï€ is      â”‚                       â”‚ â€¢ ||Î _d|| can exceed 1/Î³!     â”‚
â”‚   guaranteed contraction!     â”‚                       â”‚ â€¢ Composition EXPANDS norms!  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Bellman Subspace Projection
Let $\mathcal{H} = \{ \mathbf{X} \mathbf{w} : \mathbf{w} \in \mathbb{R}^d \}$ be the $d$-dimensional linear subspace of candidate value functions spanned by the feature matrix $\mathbf{X}$.
When the true Bellman operator $T^\pi$ acts on a value vector $\mathbf{v} \in \mathcal{H}$, the resulting vector $T^\pi \mathbf{v}$ almost certainly flies **outside** the subspace $\mathcal{H}$.

To force the result back into $\mathcal{H}$, we project it using a projection operator $\Pi_d$:
$$\Pi_d \doteq \mathbf{X} (\mathbf{X}^T \mathbf{D} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{D}$$
where $\mathbf{D} = \text{diag}(d(s_1), \dots, d(s_N))$ is the diagonal matrix of state visitation probabilities.

The Projected Bellman Equation seeks a fixed point of the composite operator:
$$\mathbf{v} = \Pi_d T^\pi \mathbf{v}$$

### The Contraction of the Composite Operator
1. **The Bellman operator $T^\pi$** is always a $\gamma$-contraction under the supremum norm $\|\cdot\|_\infty$, and under the distribution-weighted $L_2$ norm $\|\cdot\|_D$ when transitions preserve $d^\pi$.
2. **The Projection operator $\Pi_d$** is an orthogonal projection with respect to the distribution-weighted norm $\|\cdot\|_D$. By the Pythagorean theorem in Hilbert spaces, an orthogonal projection is a **non-expansion**:
   $$\|\Pi_d \mathbf{v}\|_D \le \|\mathbf{v}\|_D \iff \|\Pi_d\|_D = 1$$
3. **On-Policy Stability:** In on-policy learning, because the projection weighting matches the transition distribution $\mathbf{D} = \mathbf{D}^\pi$:
   $$\|\Pi_d T^\pi \mathbf{u} - \Pi_d T^\pi \mathbf{v}\|_D \le \|\Pi_d\|_D \cdot \|T^\pi \mathbf{u} - T^\pi \mathbf{v}\|_D \le 1 \cdot \gamma \|\mathbf{u} - \mathbf{v}\|_D = \gamma \|\mathbf{u} - \mathbf{v}\|_D$$
   The composite operator is a $\gamma$-contraction! Convergence is mathematically guaranteed.
4. **Off-Policy Collapse:** In off-policy learning, the data is sampled from behavior distribution $\mathbf{D}^b$, but transitions follow $T^\pi$. The projection is an **oblique projection** relative to the dynamics. Its norm can strictly exceed $\frac{1}{\gamma}$:
   $$\|\Pi_d\| > \frac{1}{\gamma} \implies \|\Pi_d T^\pi\| > \frac{1}{\gamma} \cdot \gamma = 1.0$$
   The composite operator becomes an **expansion mapping**, driving value iterates to infinity.

---

## 2.6 Worked Examples: Instability & Gradient Calculations

### Example 2.1: The 2-State Divergence Minimal Counterexample
Consider a 2-state system with states $\mathcal{S} = \{s_1, s_2\}$ and a single scalar parameter $w \in \mathbb{R}$.
Linear features are:
$$x(s_1) = 1.0 \implies \hat{v}(s_1, w) = w$$
$$x(s_2) = 2.0 \implies \hat{v}(s_2, w) = 2w$$
Discount factor $\gamma = 0.90$. All rewards are zero: $R \equiv 0$.
A transition is observed from $s_1 \to s_2$ with importance sampling weight $\rho = 1.0$.

1. Write the semi-gradient TD update for parameter $w$.
2. Derive the iterative recurrence relation $w_{t+1} = f(w_t)$.
3. Determine whether $w_t$ converges or diverges for learning rate $\alpha = 0.20$.

#### Solution:
**Step 1: TD Error and Update:**
$$\delta_t = R_{t+1} + \gamma \hat{v}(s_2, w_t) - \hat{v}(s_1, w_t) = 0 + 0.90(2 w_t) - w_t = 1.8 w_t - w_t = +0.8 w_t$$
The semi-gradient update is:
$$w_{t+1} = w_t + \alpha \delta_t x(s_1) = w_t + \alpha (0.8 w_t)(1.0) = w_t + 0.8 \alpha w_t$$

**Step 2: Recurrence Relation:**
$$w_{t+1} = (1 + 0.8 \alpha) w_t$$

**Step 3: Convergence Analysis for $\alpha = 0.20$:**
$$1 + 0.8(0.20) = 1 + 0.16 = 1.16$$
$$w_{t+1} = 1.16 w_t \implies w_t = (1.16)^t w_0$$
Because the multiplier $1.16 > 1.0$, for any non-zero initial guess $w_0 \neq 0$:
$$\lim_{t \to \infty} w_t = \pm \infty$$
If $w_0 = 1.0$:
- $w_1 = 1.16$
- $w_{10} \approx 4.41$
- $w_{50} \approx 1,670.7$
- $w_{100} \approx 2,791,300$
The parameter explodes exponentially to infinity, despite a completely linear model.

---

### Example 2.2: True Gradient (Residual Gradient) on the 2-State System
Apply Leemon Baird's Residual Gradient method (differentiating through both prediction and target) to the 2-state system from Example 2.1:
$$\mathcal{L}(w) = \frac{1}{2} \left[ R_{t+1} + \gamma \hat{v}(s_2, w) - \hat{v}(s_1, w) \right]^2 = \frac{1}{2} [0 + 0.9(2w) - w]^2 = \frac{1}{2} [0.8 w]^2 = 0.32 w^2$$

1. Compute the true gradient $\frac{d \mathcal{L}}{dw}$.
2. Write the gradient descent update $w_{t+1} = w_t - \alpha \frac{d\mathcal{L}}{dw}$.
3. Show that $w$ converges stably to the true optimum $w^* = 0$ for $\alpha = 0.20$.

#### Solution:
**Step 1: True Gradient:**
$$\frac{d \mathcal{L}}{dw} = \frac{d}{dw} (0.32 w^2) = 0.64 w$$

**Step 2: Gradient Descent Update:**
$$w_{t+1} = w_t - \alpha (0.64 w_t) = (1 - 0.64 \alpha) w_t$$

**Step 3: Convergence for $\alpha = 0.20$:**
$$1 - 0.64(0.20) = 1 - 0.128 = 0.872$$
$$w_{t+1} = 0.872 w_t \implies w_t = (0.872)^t w_0$$
Because $|0.872| < 1.0$, for any initial guess $w_0$:
$$\lim_{t \to \infty} w_t = 0.0$$
Differentiating through the target eliminates divergence, confirming that the instability is caused by the semi-gradient approximation.

---

### Example 2.3: Tsitsiklis & Van Roy Bound on On-Policy TD Fixed Point
John Tsitsiklis and Benjamin Van Roy (1997) proved that under **on-policy** sampling, linear semi-gradient TD(0) converges to a unique fixed point $\mathbf{w}_{\text{TD}}$ whose Mean Squared Value Error is strictly bounded relative to the best possible linear approximation $\mathbf{w}^*$:

$$\overline{\text{VE}}(\mathbf{w}_{\text{TD}}) \le \frac{1}{1 - \gamma} \min_\mathbf{w} \overline{\text{VE}}(\mathbf{w})$$

1. If the best possible linear approximator achieves minimum error $\min_\mathbf{w} \overline{\text{VE}}(\mathbf{w}) = 2.0$, calculate the maximum error guaranteed for $\mathbf{w}_{\text{TD}}$ when $\gamma = 0.50$ and $\gamma = 0.99$.
2. What does this theorem imply about the quality of on-policy TD as $\gamma \to 1$?

#### Solution:
**Step 1: Numerical Bounds:**
- For $\gamma = 0.50$:
  $$\overline{\text{VE}}(\mathbf{w}_{\text{TD}}) \le \frac{1}{1 - 0.50} \times 2.0 = 2.0 \times 2.0 = 4.0$$
  The error of the TD solution is at most double the optimal projection error.
- For $\gamma = 0.99$:
  $$\overline{\text{VE}}(\mathbf{w}_{\text{TD}}) \le \frac{1}{1 - 0.99} \times 2.0 = \frac{1}{0.01} \times 2.0 = 100 \times 2.0 = 200.0$$

**Step 2: Theoretical Implication:**
As $\gamma \to 1^-$, the theoretical error bound $\frac{1}{1 - \gamma} \to \infty$ loosens dramatically. While on-policy TD is guaranteed to converge, the asymptotic quality of its fixed point can be significantly worse than the true minimum-norm projection if features are poorly aligned with the dynamics.

---

### Example 2.4: Trace of Baird's Parameter Recurrence Matrix
In Baird's Counterexample with 8 parameters, suppose the current weights are:
$\mathbf{w}_t = [1, 1, 1, 1, 1, 1, 1, 1]^T$.
Under target policy $\pi$, all transitions lead to state $s_7$ with feature $\hat{v}(s_7, \mathbf{w}) = w_7 + 2w_0$.
Given $\gamma = 0.99$:
1. Compute the TD error for each upper state $s_k$ ($k \in \{1, \dots, 6\}$).
2. Compute the TD error for lower state $s_7$.

#### Solution:
Current predictions:
- For upper states $s_k$: $\hat{v}(s_k, \mathbf{w}_t) = 2 w_k + w_0 = 2(1) + 1 = 3.0$.
- For lower state $s_7$: $\hat{v}(s_7, \mathbf{w}_t) = w_7 + 2 w_0 = 1 + 2(1) = 3.0$.

**1. Upper States TD Errors:**
Transitions from $s_k$ lead to $s_7$ with $R = 0$:
$$\delta_k = R + \gamma \hat{v}(s_7, \mathbf{w}_t) - \hat{v}(s_k, \mathbf{w}_t) = 0 + 0.99(3.0) - 3.0 = 2.97 - 3.0 = -0.03$$

**2. Lower State TD Error:**
Transitions from $s_7$ under Solid action lead to $s_7$ with $R = 0$:
$$\delta_7 = R + \gamma \hat{v}(s_7, \mathbf{w}_t) - \hat{v}(s_7, \mathbf{w}_t) = 0 + 0.99(3.0) - 3.0 = -0.03$$

Because the TD errors for all states are non-zero despite identical predictions ($3.0 = 3.0$), the asymmetric feature weights (2 on upper states vs 1 on $w_7$) push parameters outward with asymmetric force, destabilizing the system.

---

### Example 2.5: Monte Carlo Stability Under Off-Policy Data
Show that if an agent uses Monte Carlo returns $G_t$ instead of bootstrapping, the parameters $\mathbf{w}$ cannot diverge, even under the exact same off-policy behavior policy and features of Baird's Counterexample.

#### Solution:
Under Monte Carlo, the target is the full episodic return $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$.
In Baird's Counterexample, every reward emitted on every step is identically zero ($R \equiv 0$).
Therefore, the empirical return is identically zero for all trajectories:
$$G_t \equiv 0.0$$
The weighted off-policy Monte Carlo loss is:
$$\mathcal{L}(\mathbf{w}) = \frac{1}{2} \sum_i \rho_i \left[ 0.0 - \mathbf{w}^T \mathbf{x}(s_i) \right]^2 = \frac{1}{2} \mathbf{w}^T \left( \sum_i \rho_i \mathbf{x}(s_i) \mathbf{x}(s_i)^T \right) \mathbf{w}$$
Because the matrix $\mathbf{A} = \sum_i \rho_i \mathbf{x}_i \mathbf{x}_i^T$ is positive semi-definite:
1. The loss $\mathcal{L}(\mathbf{w}) \ge 0$ is strictly convex with a global minimum at $\mathbf{w}^* = \mathbf{0}$.
2. Gradient descent: $\mathbf{w}_{t+1} = \mathbf{w}_t - \alpha \rho_t (\mathbf{w}_t^T \mathbf{x}_t) \mathbf{x}_t$.
3. The magnitude $\|\mathbf{w}_t\|$ decays monotonically to $\mathbf{0}$ for $\alpha < \frac{2}{\max \rho \|\mathbf{x}\|^2}$.
Divergence is mathematically impossible under Monte Carlo, proving that **bootstrapping is the necessary catalyst for the Deadly Triad**.

---

### Example 2.6: Projection Matrix Operator Norm
Consider a 2-state space with behavior distribution $\mathbf{d}^b = [0.8, 0.2]^T$.
Design matrix $\mathbf{X} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (a 1-parameter model predicting a single constant $w$).
Compute the projection operator $\Pi_d = \mathbf{X} (\mathbf{X}^T \mathbf{D} \mathbf{X})^{-1} \mathbf{X}^T \mathbf{D}$, where $\mathbf{D} = \text{diag}(0.8, 0.2)$.

#### Solution:
$$\mathbf{X}^T \mathbf{D} \mathbf{X} = [1, 1] \begin{bmatrix} 0.8 & 0 \\ 0 & 0.2 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \end{bmatrix} = [1, 1] \begin{bmatrix} 0.8 \\ 0.2 \end{bmatrix} = 0.8 + 0.2 = 1.0$$
Inversion:
$$(\mathbf{X}^T \mathbf{D} \mathbf{X})^{-1} = \frac{1}{1.0} = 1.0$$
Now compute $\Pi_d$:
$$\Pi_d = \begin{bmatrix} 1 \\ 1 \end{bmatrix} (1.0) [1, 1] \begin{bmatrix} 0.8 & 0 \\ 0 & 0.2 \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} [0.8, 0.2] = \begin{bmatrix} 0.8 & 0.2 \\ 0.8 & 0.2 \end{bmatrix}$$
For any vector $\mathbf{v} = [v_1, v_2]^T$:
$$\Pi_d \mathbf{v} = \begin{bmatrix} 0.8 v_1 + 0.2 v_2 \\ 0.8 v_1 + 0.2 v_2 \end{bmatrix}$$
The projection replaces every state's value with the distribution-weighted average $0.8 v_1 + 0.2 v_2$.

---

### Example 2.7: Gradient Temporal Difference Learning (GTD2) Preview
To solve the Deadly Triad mathematically without discarding function approximation or bootstrapping, Sutton, Maei, and SzepesvÃ¡ri (2009) invented **Gradient TD (GTD2)** by minimizing the **Mean-Square Projected Bellman Error (MSPBE)**:
$$\text{MSPBE}(\mathbf{w}) \doteq \|\Pi_d (T^\pi \hat{v}_\mathbf{w} - \hat{v}_\mathbf{w})\|_D^2$$

Explain why minimizing MSPBE guarantees convergence even under off-policy linear function approximation.

#### Solution:
Standard semi-gradient TD drops target derivatives, which prevents it from descending the true gradient of any fixed loss function.
In contrast, GTD2 derives two-time-scale stochastic gradient descent updates directly from the exact analytical gradient of the scalar objective $\text{MSPBE}(\mathbf{w})$.
Because $\text{MSPBE}(\mathbf{w}) \ge 0$ is a true convex loss function with a unique global minimum at the projected fixed point $\mathbf{w}^*$, descending its true gradient guarantees convergence with probability 1.0, defeating the Deadly Triad for linear function approximators.

---

### Example 2.8: Eigenvalue Explosion Threshold
Consider a linear iteration $\mathbf{w}_{t+1} = \mathbf{A} \mathbf{w}_t$ where:
$$\mathbf{A} = \begin{bmatrix} 1.02 & 0.05 \\ 0.10 & 0.98 \end{bmatrix}$$
1. Compute the characteristic polynomial $\det(\lambda \mathbf{I} - \mathbf{A}) = 0$.
2. Find the dominant eigenvalue $\lambda_{\max}$ and determine if the system diverges.

#### Solution:
$$\det(\lambda \mathbf{I} - \mathbf{A}) = \det \begin{bmatrix} \lambda - 1.02 & -0.05 \\ -0.10 & \lambda - 0.98 \end{bmatrix} = (\lambda - 1.02)(\lambda - 0.98) - (-0.05)(-0.10)$$
$$= \lambda^2 - 2.00 \lambda + (1.02)(0.98) - 0.005 = \lambda^2 - 2.00 \lambda + 0.9996 - 0.005 = \lambda^2 - 2.00 \lambda + 0.9946 = 0$$
Using the quadratic formula:
$$\lambda = \frac{2.00 \pm \sqrt{4.00 - 4(0.9946)}}{2} = 1.00 \pm \frac{\sqrt{4.00 - 3.9784}}{2} = 1.00 \pm \frac{\sqrt{0.0216}}{2} \approx 1.00 \pm \frac{0.14697}{2} = 1.00 \pm 0.07348$$
- $\lambda_1 \approx 1.0735$
- $\lambda_2 \approx 0.9265$
Because the dominant eigenvalue is $|\lambda_1| = 1.0735 > 1.0$, the dynamical system is unstable and diverges exponentially.

---

### Example 2.9: The Double Sampling Dilemma of True Residual Gradients
In Section 2.3, we saw that the true gradient of the Bellman error contains the term:
$$\mathbb{E} \left[ (R_{t+1} + \gamma \hat{v}(S_{t+1}, \mathbf{w}) - \hat{v}(S_t, \mathbf{w})) \cdot \gamma \nabla_\mathbf{w} \hat{v}(S_{t+1}, \mathbf{w}) \right]$$
Explain why evaluating an unbiased sample of this term in a stochastic environment requires drawing **two independent next states** $S_{t+1}$ and $S'_{t+1}$ from the identical origin state $S_t$.

#### Solution:
Notice that the expectation is the product of two random variables that both depend on the realization of the next state $S_{t+1}$:
$$\mathbb{E}_{S_{t+1}} \left[ \delta(S_{t+1}) \cdot \nabla \hat{v}(S_{t+1}) \right]$$
For general dependent random variables, $\mathbb{E}[X Y] \neq \mathbb{E}[X] \mathbb{E}[Y]$.
If a single sample $S_{t+1}$ is used for both terms, the sample product is a **biased estimator** of the product of expectations.
To obtain an unbiased estimator of the true gradient:
$$\mathbb{E}[X Y] = \mathbb{E}_{S_{t+1}} [\delta(S_{t+1})] \cdot \mathbb{E}_{S'_{t+1}} [\nabla \hat{v}(S'_{t+1})]$$
one must query the environment simulator twice from state $S_t$ to generate two independent realizations $S_{t+1}$ and $S'_{t+1}$. 
In real-world environments (e.g. driving an actual car), time cannot be rewound to sample two independent futures from the exact same instant, rendering true residual gradients physically impossible.

---

### Example 2.10: How Modern Deep Q-Networks Tame the Deadly Triad
Deep Q-Networks (DQN) employ all three legs of the Deadly Triad: (1) deep neural networks, (2) bootstrapping ($r + \gamma \max Q$), and (3) off-policy replay buffer data.
Why does DQN not diverge like Baird's Counterexample?

#### Solution:
While DQN contains the three elements of the Deadly Triad, it incorporates two critical engineering innovations (explored in Chapters 3 and 4) that bypass catastrophic divergence:
1. **Target Networks ($\boldsymbol{\theta}^-$):** Freezes the target parameters for thousands of steps, breaking the immediate feedback loop that creates eigenvalues $> 1$. For short intervals, the target behaves like fixed supervised labels.
2. **Experience Replay Buffer:** Averages updates across millions of decorrelated transitions, smoothing out local destabilizing gradients.
3. **Gradient Clipping & Huber Loss:** Caps maximum gradient norms to prevent exponential amplification.

---

## 2.7 Solved Exercises

### Exercise 2.1: Deadly Triad Identification
Does standard Monte Carlo policy evaluation with a Deep Neural Network suffer from the Deadly Triad? Explain.

#### Solution:
No. Monte Carlo does not bootstrap (it uses true empirical returns $G_t$), eliminating leg #2 of the triad and guaranteeing stable convergence.

---

### Exercise 2.2: Semi-Gradient vs True Gradient Difference
For linear function $\hat{v}(s, \mathbf{w}) = \mathbf{w}^T \mathbf{x}(s)$, write the exact difference vector between the semi-gradient update direction and the true residual gradient update direction.

#### Solution:
- Semi-gradient direction: $\delta_t \mathbf{x}_t$.
- True residual gradient direction: $\delta_t (\mathbf{x}_t - \gamma \mathbf{x}_{t+1})$.
- Difference:
  $$\text{Difference} = \delta_t \mathbf{x}_t - \delta_t (\mathbf{x}_t - \gamma \mathbf{x}_{t+1}) = \gamma \delta_t \mathbf{x}_{t+1}$$

---

### Exercise 2.3: On-Policy Stability Guarantee
Why is on-policy linear TD(0) immune to the divergence of Baird's Counterexample?

#### Solution:
Because in on-policy learning, states are sampled strictly from the stationary distribution $d^\pi(s)$ of the policy being evaluated, ensuring that the projection operator $\Pi_d$ is an orthogonal non-expansion under the distribution-weighted norm ($\|\Pi_d\|_D = 1$).

---

### Exercise 2.4: Divergence Condition on Iteration Matrix
If a linear update system $\mathbf{w}_{k+1} = \mathbf{A} \mathbf{w}_k$ has eigenvalues $\lambda_1 = 0.95, \lambda_2 = 1.05$, will the parameter vector converge or diverge as $k \to \infty$?

#### Solution:
It will diverge. Because $|\lambda_2| = 1.05 > 1.0$, the component along eigenvector 2 grows exponentially by $1.05^k \to \infty$.

---

### Exercise 2.5: Reward Invariance in Baird's Counterexample
In Baird's Counterexample, does changing the zero rewards to a constant $+10.0$ prevent divergence?

#### Solution:
No. Adding a constant reward merely shifts the offset of the affine transformation without altering the transition matrix $\mathbf{A}$ or its eigenvalues. The parameter vector will still diverge to infinity.

---

### Exercise 2.6: Deadly Triad in AlphaGo
Did AlphaGo's value network training suffer from the Deadly Triad?

#### Solution:
No. AlphaGo trained its value network using Monte Carlo rollouts (complete game self-play outcomes $+1/-1$) rather than bootstrapping, avoiding leg #2 of the Deadly Triad.

---

### Exercise 2.7: Norm Expansion in Oblique Projections
Can an oblique (non-orthogonal) projection operator have an operator norm $\|\Pi\| > 1$?

#### Solution:
Yes. For any oblique projection onto a subspace along a non-orthogonal direction, there exist vectors whose projected length exceeds their original length, allowing $\|\Pi\| > 1$.

---

### Exercise 2.8: Off-Policy SARSA vs Expected SARSA
Is Expected SARSA off-policy or on-policy when evaluated with target policy $\pi \neq b$?

#### Solution:
When target policy $\pi$ differs from behavior policy $b$, Expected SARSA is strictly off-policy, exposing it to the Deadly Triad if combined with function approximation.

---

### Exercise 2.9: Impact of Discount Factor on Instability
In Example 2.1, what happens to the multiplier $1 + 0.8 \alpha$ if $\gamma = 0$?

#### Solution:
If $\gamma = 0$, the bootstrap term vanishes:
$$\delta_t = R_{t+1} + 0 - w_t = -w_t$$
The update is $w_{t+1} = w_t + \alpha(-w_t)(1) = (1 - \alpha) w_t$.
For $\alpha \in (0, 1)$, $|1 - \alpha| < 1$, and $w$ converges stably to 0. Bootstrapping disappears when $\gamma = 0$.

---

### Exercise 2.10: The Core Engineering Takeaway of the Deadly Triad
State the primary practical lesson that deep reinforcement learning practitioners draw from the Deadly Triad.

#### Solution:
When combining neural networks with off-policy TD learning, explicit stabilizing mechanisms (such as target networks, experience replay buffers, and conservative trust regions) are mandatory to prevent explosive parameter divergence.


# Chapter 3: Deep Q-Networks (DQN): Atari, Convolutional Embeddings, and the Nature Breakout

---

## 3.1 The Watershed Moment in Artificial Intelligence

In February 2015, the front cover of the prestigious scientific journal *Nature* featured an image of a simulated spacecraft navigating an 8-bit digital landscape beneath the headline: **"Human-level control through deep reinforcement learning."**

```
                 THE EVOLUTION OF SENSORY CONTROL IN AI
                                    â”‚
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â–¼                                                 â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ CLASSICAL ENGINEERING â”‚                         â”‚     DEEP Q-NETWORK    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                         â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Handcrafted featuresâ”‚                         â”‚ â€¢ Raw visual pixels   â”‚
â”‚ â€¢ Coordinate vectors  â”‚      â•â•â•â•â•â•â•â•â•â–º         â”‚ â€¢ End-to-end learning â”‚
â”‚ â€¢ Specific to 1 task  â”‚                         â”‚ â€¢ Single architecture â”‚
â”‚ â€¢ Fragile heuristics  â”‚                         â”‚ â€¢ 49 Atari games      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

The landmark paper by Volodymyr Mnih and his colleagues at DeepMind (Mnih et al., 2013, 2015) marked a historic watershed in computational intelligence. For the first time in history, a single artificial agentâ€”the **Deep Q-Network (DQN)**â€”learned to master a diverse suite of 49 distinct Atari 2600 video games (including *Breakout*, *Pong*, *Space Invaders*, and *Seaquest*) using:
- The exact same neural network architecture.
- The exact same hyperparameter configuration.
- Zero game-specific rules, heuristics, or handcrafted visual features.
- Inputs consisting solely of raw screen pixels and game score rewards.

In more than half of the games tested, DQN surpassed the performance of professional human game testers, discovering non-obvious strategies (such as tunneling around the side in *Breakout* to trap the ball behind the wall) that human engineers had never programmed.

---

## 3.2 The Visual Perception Pipeline: Preprocessing & Frame Stacking

An Atari 2600 console generates video output at a resolution of $210 \times 160$ pixels at $60\text{ Hz}$, with a 128-color palette. Processing raw RGB frames of this size ($210 \times 160 \times 3 = 100,800$ numbers per frame) directly with neural networks is computationally wasteful, as most high-frequency color variations provide zero gameplay information.

To optimize training throughput, Mnih et al. developed an iconic 4-stage visual preprocessing pipeline:

```
                          DQN VISUAL PREPROCESSING PIPELINE
                                         â”‚
                        Raw Atari Frame (210 x 160 x 3 RGB)
                                         â”‚
                                         â–¼ 1. Luminance Conversion
                            Grayscale Image (210 x 160)
                                         â”‚
                                         â–¼ 2. Bilinear Downsampling
                             Cropped / Scaled (84 x 84)
                                         â”‚
                                         â–¼ 3. Max-Pooling over Consec Frames
                               Removes 30 Hz Sprite Flicker
                                         â”‚
                                         â–¼ 4. Temporal Stacking (k = 4)
                        Input State Tensor s_t: (84 x 84 x 4)
```

### 1. Luminance Conversion
The raw RGB color image is converted to a single 8-bit grayscale channel using standard luminance weights:
$$Y = 0.299 R + 0.587 G + 0.114 B \in [0, 255]$$

### 2. Bilinear Downsampling and Cropping
The grayscale image is rescaled and cropped to an $84 \times 84$ square matrix. This reduces the raw input dimensionality from $100,800$ floats to $7,056$ bytesâ€”a **$14\times$ reduction in computational burden**.

### 3. Frame Skipping and Max-Pooling
Because human reactions occur on the order of 100 milliseconds, processing every single frame at 60 Hz is redundant. DQN employs **Frame Skipping**:
- The agent selects an action $A_t$.
- The environment repeats action $A_t$ across $k = 4$ consecutive internal simulation ticks.
- The rewards earned across the 4 skipped frames are accumulated:
  $$R_{t+1} = \sum_{j=1}^4 r_{t, j}$$
- To eliminate sprite flickering (an artifact of the Atari 2600 hardware where certain objects appeared only on alternate frames to conserve memory), a pixel-wise maximum is computed over the last two frames of the skipped sequence.

### 4. Temporal Frame Stacking
A single static photograph does not contain velocity, trajectory, or acceleration. Looking at a single screenshot of *Breakout*, you cannot tell whether the ball is moving upward toward the bricks or hurtling downward toward the paddle.

To preserve the Markov Property without requiring recurrent neural networks (RNNs), DQN stacks the current preprocessed frame with the 3 immediately preceding frames:

$$S_t \doteq \left[ \phi(f_{t-3}), \, \phi(f_{t-2}), \, \phi(f_{t-1}), \, \phi(f_t) \right] \in \mathbb{R}^{84 \times 84 \times 4}$$

The 4 stacked temporal slices encode the full instantaneous physical state:
- First temporal differences $(\phi(f_t) - \phi(f_{t-1}))$ encode velocity.
- Second temporal differences encode acceleration and ball trajectory.

---

## 3.3 The Deep Q-Network Architecture

How does a neural network process an $84 \times 84 \times 4$ input tensor to select actions?

```
                           THE NATURE DQN ARCHITECTURE
                                        â”‚
                         Input: 84 x 84 x 4 Image Tensor
                                        â”‚
                                        â–¼ Conv 1: 32 filters, 8x8, stride 4, ReLU
                               Output: 20 x 20 x 32
                                        â”‚
                                        â–¼ Conv 2: 64 filters, 4x4, stride 2, ReLU
                               Output: 9 x 9 x 64
                                        â”‚
                                        â–¼ Conv 3: 64 filters, 3x3, stride 1, ReLU
                               Output: 7 x 7 x 64
                                        â”‚
                                        â–¼ Flatten: 7 x 7 x 64 = 3,136 units
                               Dense FC1: 512 units, ReLU
                                        â”‚
                                        â–¼ Linear Output Layer
                     Outputs: |A| Q-values [Q(s, a_1), ..., Q(s, a_|A|)]
```

### Convolutional Layer Specifications
1. **Convolutional Layer 1 (Low-level edges and ball blobs):**
   - 32 feature filters of shape $8 \times 8$.
   - Stride $S = 4$, Padding $P = 0$.
   - Activation: Rectified Linear Unit ($\text{ReLU}(z) = \max(0, z)$).
   - Output spatial dimension:
     $$W_{\text{out}} = \left\lfloor \frac{84 - 8}{4} \right\rfloor + 1 = \left\lfloor \frac{76}{4} \right\rfloor + 1 = 19 + 1 = 20$$
   - Output tensor: $20 \times 20 \times 32$.
2. **Convolutional Layer 2 (Mid-level sprite parts and paddle edges):**
   - 64 feature filters of shape $4 \times 4$.
   - Stride $S = 2$, Padding $P = 0$.
   - Output spatial dimension:
     $$W_{\text{out}} = \left\lfloor \frac{20 - 4}{2} \right\rfloor + 1 = \left\lfloor \frac{16}{2} \right\rfloor + 1 = 8 + 1 = 9 \implies 9 \times 9 \times 64$$
3. **Convolutional Layer 3 (High-level spatial game configurations):**
   - 64 feature filters of shape $3 \times 3$.
   - Stride $S = 1$, Padding $P = 0$.
   - Output spatial dimension:
     $$W_{\text{out}} = \left\lfloor \frac{9 - 3}{1} \right\rfloor + 1 = 6 + 1 = 7 \implies 7 \times 7 \times 64$$
4. **Dense Fully Connected Layer:**
   - Flattens the $7 \times 7 \times 64 = 3,136$ activations into a 1D feature vector.
   - Dense layer of 512 hidden units with ReLU activation.
5. **Linear Output Head:**
   - Fully connected linear layer with $|\mathcal{A}|$ outputs (where $|\mathcal{A}| \in [4, 18]$ depending on the Atari game joystick configurations).
   - Each output neuron directly predicts $Q(s, a; \boldsymbol{\theta})$ for action $a$.

### The Simultaneous Q-Output Paradigm
A naive architecture would take state $s$ and a candidate action $a$ as inputs and output a single scalar $Q(s, a)$.
- Under that naive design, evaluating all $|\mathcal{A}|$ actions to compute $\arg\max_a Q(s, a)$ would require running **$|\mathcal{A}|$ separate forward passes** through the deep network at every single time step.
- DQN's architecture takes only state $s$ as input and outputs the entire vector of Q-values $\mathbf{Q}(s, \cdot)$ simultaneously. 
- A single forward pass evaluates all actions in parallel, reducing inference cost by a factor of $|\mathcal{A}|$.

---

## 3.4 The DQN Loss Function and Bellman Error

To train the parameters $\boldsymbol{\theta}$ of the neural network, DQN minimizes the squared Bellman error across a mini-batch of sampled transitions:

$$\mathcal{L}(\boldsymbol{\theta}) \doteq \mathbb{E}_{(s, a, r, s', d) \sim \mathcal{D}} \left[ \left( y^{\text{DQN}} - Q(s, a; \boldsymbol{\theta}) \right)^2 \right]$$

### The Bellman Target Formulation
The target $y^{\text{DQN}}$ is constructed using the frozen Target Network parameters $\boldsymbol{\theta}^-$:

$$y^{\text{DQN}} \doteq r + (1 - d) \gamma \max_{a' \in \mathcal{A}} Q(s', a'; \boldsymbol{\theta}^-)$$

where $d \in \{0, 1\}$ is the **Terminal Done Flag**:
- If $d = 0$ (the transition did not terminate the episode), the bootstrap term $\gamma \max Q$ is added.
- If $d = 1$ (the next state $s'$ is an absorbing terminal state, e.g. game over or life lost), $(1 - d) = 0$, collapsing the target strictly to the immediate reward $y = r$.

---

## 3.5 Huber Loss (Smooth L1) vs. Mean Squared Error

In standard regression, Mean Squared Error (MSE) $\mathcal{L}(\delta) = \frac{1}{2} \delta^2$ is standard.
However, in deep reinforcement learning, using raw MSE frequently leads to catastrophic gradient explosions.

```
                                 MSE vs. HUBER LOSS
               Loss L(Î´)                                Gradient dL/dÎ´
             â–²                                         â–²
             â”‚          MSE: Î´^2                       â”‚               MSE: Î´
             â”‚         /        \                      â”‚              /
             â”‚        /          \                   1 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ Huber: Â±1
             â”‚       /  Huber     \                    â”‚            /
             â”‚      /    Loss      \                   â”‚           /
             â”‚     /                \                  â”‚          /
             â””â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”´â”€â”€â–º Î´            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Î´
                        -1     1                                 â”‚
                                                      -1 â”œâ”€â”€â”€â”€â”€â”€â”€â”˜
                                                         â”‚
```

### The Threat of Outlier Transitions
In games like *Space Invaders* or *Centipede*, destroying an alien mother ship emits a sudden, massive reward of $+500$, while normal laser fire emits $+1$.
If the current network predicts $Q \approx 2.0$, the TD error is:
$$\delta = 500 - 2 = 498$$
Under MSE loss, the gradient is proportional to the error:
$$\nabla_\boldsymbol{\theta} \mathcal{L} = -\delta \nabla_\boldsymbol{\theta} Q = -498 \nabla_\boldsymbol{\theta} Q$$
This massive gradient vector destroys the internal feature representations of the convolutional layers, overwriting the delicate filter weights learned over millions of frames.

### The Huber Loss (Smooth L1) Formulation
To immunize the network against outlier shocks, Mnih et al. employed the **Huber Loss**:

$$\mathcal{L}_{\text{Huber}}(\delta) \doteq \begin{cases} \frac{1}{2} \delta^2 & \text{if } |\delta| \le 1.0 \\ |\delta| - \frac{1}{2} & \text{otherwise} \end{cases}$$

### Gradient Clipping Properties
The derivative of the Huber loss with respect to the error $\delta$ is:

$$\frac{d \mathcal{L}_{\text{Huber}}}{d \delta} = \begin{cases} \delta & \text{if } |\delta| \le 1.0 \\ \text{sign}(\delta) & \text{otherwise} \end{cases}$$

- For small errors ($|\delta| \le 1.0$), Huber loss behaves like MSE, providing smooth quadratic convergence near the optimum.
- For large errors ($|\delta| > 1.0$), Huber loss behaves linearly ($L_1$), clipping the effective gradient to a constant maximum magnitude of $\pm 1.0$.
A catastrophic shock of $\delta = 498$ emits a gradient of exactly $+1.0$ rather than $+498$, preserving network stability.

---

## 3.6 Worked Examples: Convolutional Tensor Math & DQN Losses

### Example 3.1: Spatial Output Dimension of Convolutional Layers
A deep reinforcement learning agent processes an image input of spatial dimensions $W_{\text{in}} \times H_{\text{in}} = 64 \times 64$.
A convolutional layer has $K = 16$ filters of size $5 \times 5$, with stride $S = 2$ and padding $P = 1$.
1. Compute the output spatial width $W_{\text{out}}$ and height $H_{\text{out}}$.
2. What is the total number of trainable weight parameters in this convolutional layer (including biases)?

#### Solution:
**Step 1: Spatial Dimensions:**
The general formula for convolutional output dimension is:
$$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - F + 2P}{S} \right\rfloor + 1$$
Substitute values:
$$W_{\text{out}} = \left\lfloor \frac{64 - 5 + 2(1)}{2} \right\rfloor + 1 = \left\lfloor \frac{64 - 5 + 2}{2} \right\rfloor + 1 = \left\lfloor \frac{61}{2} \right\rfloor + 1 = 30 + 1 = 31$$
Since the image is square, $H_{\text{out}} = 31$.
Output shape: $31 \times 31 \times 16$.

**Step 2: Trainable Parameters:**
Let the input have $C_{\text{in}} = 3$ channels (RGB).
Each filter has size $F \times F \times C_{\text{in}} = 5 \times 5 \times 3 = 75$ weights, plus 1 bias.
For $K = 16$ filters:
$$\text{Parameters} = 16 \times (75 + 1) = 16 \times 76 = 1,216 \text{ parameters}$$

---

### Example 3.2: Receptive Field Calculation Across Stacked Layers
Consider a 2-layer CNN:
- Conv 1: Filter size $F_1 = 8 \times 8$, Stride $S_1 = 4$.
- Conv 2: Filter size $F_2 = 4 \times 4$, Stride $S_2 = 2$.

Compute the effective receptive field $RF_2$ of a single neuron in Conv 2 with respect to the original input image.

#### Solution:
The receptive field formula for layer $l$ is:
$$RF_l = RF_{l-1} + (F_l - 1) \cdot \prod_{i=1}^{l-1} S_i$$
Base layer (input): $RF_0 = 1$.
- For Conv 1:
  $$RF_1 = 1 + (8 - 1) \cdot 1 = 1 + 7 = 8 \text{ pixels}$$
- For Conv 2:
  $$RF_2 = RF_1 + (F_2 - 1) \cdot S_1 = 8 + (4 - 1) \cdot 4 = 8 + 3 \times 4 = 8 + 12 = 20 \text{ pixels}$$
A single activation in Conv 2 perceives a $20 \times 20$ pixel patch of the original input game screen.

---

### Example 3.3: Huber Loss vs MSE Numerical Gradient Comparison
A DQN agent experiences a transition with Bellman target $y = 5.0$.
The network currently predicts $Q(s, a; \boldsymbol{\theta}) = 1.5$.
1. Compute the TD error $\delta$.
2. Compute the MSE loss and its gradient multiplier $\frac{d \mathcal{L}_{\text{MSE}}}{d \delta}$.
3. Compute the Huber loss and its gradient multiplier $\frac{d \mathcal{L}_{\text{Huber}}}{d \delta}$.
4. Repeat for an outlier transition where $y = 50.0$.

#### Solution:
**Case 1: Standard Transition ($y = 5.0, Q = 1.5$):**
- $\delta = y - Q = 5.0 - 1.5 = +3.5$.
- MSE Loss: $\frac{1}{2}(3.5)^2 = 0.5(12.25) = 6.125$.
  Gradient multiplier: $\delta = +3.5$.
- Huber Loss (since $|\delta| = 3.5 > 1.0$):
  $$\mathcal{L}_{\text{Huber}} = |\delta| - 0.5 = 3.5 - 0.5 = 3.0$$
  Gradient multiplier: $\text{sign}(\delta) = +1.0$.

**Case 2: Outlier Transition ($y = 50.0, Q = 1.5$):**
- $\delta = 50.0 - 1.5 = +48.5$.
- MSE Loss: $\frac{1}{2}(48.5)^2 = 1,176.125$.
  Gradient multiplier: $+48.5$.
- Huber Loss:
  $$\mathcal{L}_{\text{Huber}} = 48.5 - 0.5 = 48.0$$
  Gradient multiplier: $+1.0$.
Notice that while MSE gradient exploded from $3.5 \to 48.5$ ($14\times$ increase), the Huber gradient remained strictly capped at $+1.0$.

---

### Example 3.4: Target Network Bellman Target Evaluation
A DQN agent transitions: $(S_t, A_t = 2, R_{t+1} = 10.0, S_{t+1}, d = 0)$.
The online network outputs for $S_{t+1}$:
$$\mathbf{Q}(S_{t+1}, \cdot; \boldsymbol{\theta}) = [12.0, 18.5, 14.0]$$
The target network outputs for $S_{t+1}$:
$$\mathbf{Q}(S_{t+1}, \cdot; \boldsymbol{\theta}^-) = [11.0, 16.0, 13.5]$$
Let discount factor $\gamma = 0.95$.

1. Compute the standard DQN Bellman target $y^{\text{DQN}}$.
2. If the terminal flag was $d = 1$, what would the target be?

#### Solution:
**Step 1: Standard DQN Target ($d = 0$):**
Standard DQN evaluates the maximum Q-value using the **target network**:
$$\max_{a'} Q(S_{t+1}, a'; \boldsymbol{\theta}^-) = \max(11.0, 16.0, 13.5) = 16.0$$
Target:
$$y^{\text{DQN}} = R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a'; \boldsymbol{\theta}^-) = 10.0 + 0.95(16.0) = 10.0 + 15.2 = 25.2$$

**Step 2: Terminal Case ($d = 1$):**
If $d = 1$, the bootstrap term is zeroed out:
$$y = R_{t+1} + (1 - 1) \gamma \max Q = 10.0 + 0 = 10.0$$

---

### Example 3.5: Backpropagation Through Action Slicing (Gather Operator)
In DQN, the output layer predicts a vector of Q-values $\mathbf{Q}(s, \cdot) \in \mathbb{R}^{|\mathcal{A}|}$.
Only the Q-value of the selected action $A_t = a$ is used in the loss:
$$\mathcal{L} = \frac{1}{2} \left[ y - Q(s, a; \boldsymbol{\theta}) \right]^2$$
Show how PyTorch / TensorFlow implement this efficiently using a one-hot mask or `gather` operator, and compute the gradient vector $\frac{\partial \mathcal{L}}{\partial \mathbf{Q}}$.

#### Solution:
Let $\mathbf{Q} \in \mathbb{R}^{|\mathcal{A}|}$ be the output vector.
Define a one-hot vector $\mathbf{e}_a \in \{0, 1\}^{|\mathcal{A}|}$ where entry $a$ is 1 and all others are 0:
$$Q(s, a) = \mathbf{e}_a^T \mathbf{Q} = \sum_{i=1}^{|\mathcal{A}|} e_{a, i} Q_i$$
In tensor libraries, this is written: `Q_selected = torch.gather(Q_all, 1, actions.unsqueeze(1))`.
The gradient with respect to the entire output vector $\mathbf{Q}$ is:
$$\frac{\partial \mathcal{L}}{\partial \mathbf{Q}} = -(y - Q(s, a)) \mathbf{e}_a = -\delta \mathbf{e}_a$$
For example, if $|\mathcal{A}| = 3$, $a = 1$ (second action), and error is $\delta = 2.0$:
$$\frac{\partial \mathcal{L}}{\partial \mathbf{Q}} = -2.0 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -2.0 \\ 0.0 \end{bmatrix}$$
Gradients flow back **exclusively** through the output neuron corresponding to the chosen action; the gradients for all other action neurons are zero.

---

### Example 3.6: Frame Memory Compression via Byte Casting
A replay buffer stores $1,000,000$ transitions. Each transition contains state $S_t$ ($84 \times 84 \times 4$ pixels).
1. Calculate memory in gigabytes (GB) if frames are stored as 32-bit floats (`float32`, 4 bytes/pixel).
2. Calculate memory if frames are stored as unsigned 8-bit integers (`uint8`, 1 byte/pixel) and converted to float in the GPU training loop.

#### Solution:
Pixels per state: $84 \times 84 \times 4 = 28,224$ pixels.
1. **Float32 Storage:**
   $$\text{Bytes per state} = 28,224 \times 4 = 112,896 \text{ bytes}$$
   $$\text{Total Memory} = 10^6 \times 112,896 \text{ bytes} \approx 1.129 \times 10^{11} \text{ bytes} \approx 105.14 \text{ GB}$$
   Exceeds standard consumer RAM!
2. **Uint8 Storage:**
   $$\text{Bytes per state} = 28,224 \times 1 = 28,224 \text{ bytes}$$
   $$\text{Total Memory} = 10^6 \times 28,224 \text{ bytes} \approx 28.224 \text{ GB}$$
   Furthermore, by storing individual unique frames in a shared ring buffer and constructing 4-frame stacks on the fly via index pointers, memory drops by another $4\times$ to **$\approx 7.05\text{ GB}$**, fitting comfortably in standard workstation RAM.

---

### Example 3.7: Calculating Convolutional Flops (Floating-Point Operations)
For Conv Layer 1 in DQN:
Input: $84 \times 84 \times 4$.
Filters: 32 filters of size $8 \times 8 \times 4$.
Output: $20 \times 20 \times 32$.
Compute the total number of floating-point multiply-accumulate operations (MACs) required for a single forward pass.

#### Solution:
Number of output neurons:
$$N_{\text{out}} = 20 \times 20 \times 32 = 12,800 \text{ activations}$$
Each output neuron is computed by a dot product over the kernel volume:
$$\text{MACs per neuron} = 8 \times 8 \times 4 = 256 \text{ operations}$$
Total MAC operations:
$$\text{Total MACs} = 12,800 \times 256 = 3,276,800 \text{ MACs} \approx 3.28 \text{ MFLOPs}$$
Modern GPUs execute this in under $50\text{ microseconds}$.

---

### Example 3.8: Epsilon Decay Schedule for DQN
DeepMind trained DQN over 50 million frames with the following exploration schedule:
- Initial exploration: $\epsilon_0 = 1.0$ (100% random actions).
- Final exploration: $\epsilon_{\text{final}} = 0.10$.
- Linear annealing period: first $N = 1,000,000$ frames.
- Beyond 1 million frames: $\epsilon$ remains fixed at $0.10$.

1. Derive the linear decay formula $\epsilon(t)$ for $t \le 1,000,000$.
2. What is the value of $\epsilon$ at step $t = 300,000$?

#### Solution:
**Step 1: Formula:**
$$\epsilon(t) = \epsilon_0 - \frac{\epsilon_0 - \epsilon_{\text{final}}}{N} \cdot t = 1.0 - \frac{1.0 - 0.10}{1,000,000} t = 1.0 - \frac{0.90}{1,000,000} t = 1.0 - (9 \times 10^{-7}) t$$

**Step 2: Value at $t = 300,000$:**
$$\epsilon(300,000) = 1.0 - (9 \times 10^{-7})(300,000) = 1.0 - 0.27 = 0.73$$
At frame 300,000, the agent takes random exploratory actions $73\%$ of the time and exploits its greedy Q-network $27\%$ of the time.

---

### Example 3.9: Reward Clipping Mechanism
In Atari games, scores vary wildly: in *Pong*, each point earns $+1$; in *Centipede*, shooting an insect earns $+100$; in *Ms. Pac-Man*, eating a ghost earns $+200, +400, +800$.
Mnih et al. clipped all positive rewards to $+1$, all negative rewards to $-1$, and neutral steps to $0$:
$$R_{\text{clipped}} = \text{sign}(R_{\text{raw}})$$

1. Identify one major training advantage of reward clipping.
2. Identify one major game-theoretic disadvantage where reward clipping causes sub-optimal behavior.

#### Solution:
1. **Advantage:** Normalizes the scale of Q-values across all 49 games, allowing the exact same network architecture, learning rate ($\alpha = 0.00025$), and optimizer (RMSprop) to train stably without custom game-by-game tuning.
2. **Disadvantage:** The agent becomes indifferent between actions with vastly different real values. For example, in *Ms. Pac-Man*, eating an enemy ghost ($+200$) is clipped to $+1$, the exact same reward as eating a regular pellet ($+10 \to +1$). The agent will not prioritize hunting ghosts over eating dots, sacrificing high-score human strategies.

---

### Example 3.10: Gradient Update Step on Batch of 2 Transitions
A mini-batch contains 2 transitions:
- Transition 1: $Q_1 = 4.0$, target $y_1 = 6.0 \implies \delta_1 = +2.0$.
- Transition 2: $Q_2 = 10.0$, target $y_2 = 7.0 \implies \delta_2 = -3.0$.

Under Huber loss, compute the average gradient multiplier $\frac{1}{B} \sum_{i=1}^B \frac{\partial \mathcal{L}}{\partial Q_i}$.

#### Solution:
For each sample, since $|\delta| > 1.0$:
$$\frac{\partial \mathcal{L}}{\partial Q_i} = -\frac{d \mathcal{L}_{\text{Huber}}}{d \delta_i} = -\text{sign}(\delta_i)$$
- Sample 1: $\delta_1 = +2.0 \implies -\text{sign}(+2.0) = -1.0$.
- Sample 2: $\delta_2 = -3.0 \implies -\text{sign}(-3.0) = -(-1.0) = +1.0$.
Average gradient factor:
$$\frac{1}{2} [(-1.0) + (+1.0)] = 0.0$$
The opposing errors balance symmetrically without numerical explosion.

---

## 3.7 Solved Exercises

### Exercise 3.1: Stride and Output Size
An image of size $100 \times 100$ is filtered with kernel $F = 10$, padding $P = 0$, stride $S = 5$.
Compute the output dimension.

#### Solution:
$$W_{\text{out}} = \left\lfloor \frac{100 - 10}{5} \right\rfloor + 1 = \left\lfloor \frac{90}{5} \right\rfloor + 1 = 18 + 1 = 19$$
Output size is $19 \times 19$.

---

### Exercise 3.2: Huber Loss at Unit Boundary
Evaluate the Huber loss at exact boundary $\delta = 1.0$ using both the quadratic and linear branches, and verify continuity.

#### Solution:
- Quadratic branch: $\frac{1}{2}(1.0)^2 = 0.5$.
- Linear branch: $|1.0| - 0.5 = 1.0 - 0.5 = 0.5$.
Both branches yield $0.5$, confirming $C^1$ continuous matching at the boundary.

---

### Exercise 3.3: Total Parameters in Dense Projection
A flattened feature layer of size 1,024 connects to an output layer representing 18 Atari actions.
Compute the total number of weights and biases.

#### Solution:
$$\text{Weights} = 1,024 \times 18 = 18,432$$
$$\text{Biases} = 18$$
$$\text{Total} = 18,432 + 18 = 18,450$$

---

### Exercise 3.4: Frame Skipping Step Multiplier
If an agent acts with frame skipping $k = 4$, and trains for $10,000,000$ agent steps, how many raw game emulator frames were simulated?

#### Solution:
$$\text{Raw Frames} = 10,000,000 \times 4 = 40,000,000 \text{ frames}$$

---

### Exercise 3.5: Terminal State Target in Huber Loss
For transition with $d = 1$, reward $R = -1.0$, and prediction $Q = 2.0$, compute the Huber loss.

#### Solution:
Since $d = 1$, target $y = R = -1.0$.
Error: $\delta = y - Q = -1.0 - 2.0 = -3.0$.
Since $|\delta| = 3.0 > 1.0$:
$$\mathcal{L} = |\delta| - 0.5 = 3.0 - 0.5 = 2.5$$

---

### Exercise 3.6: Frame Stacking Dimension
Why does stacking 4 grayscale frames produce tensor $[84, 84, 4]$ rather than $[84, 84, 1]$?

#### Solution:
Because the 4 temporal frames are concatenated along the channel dimension, treating temporal history identically to multi-spectral color channels.

---

### Exercise 3.7: RMSprop Moving Average Parameter
DQN uses RMSprop with decay parameter $\rho = 0.95$. What does this parameter control?

#### Solution:
It controls the exponential moving average of squared historical gradients ($v_t = 0.95 v_{t-1} + 0.05 g_t^2$), scaling learning rates inversely by feature gradient variance.

---

### Exercise 3.8: Receptive Field of 1x1 Convolution
What is the receptive field of a $1 \times 1$ convolution with stride 1?

#### Solution:
$RF = 1$ pixel. It performs a channel-wise linear combination without expanding spatial receptive field.

---

### Exercise 3.9: Bellman Target Identity Under Zero Gamma
If $\gamma = 0$, what does the DQN Bellman target $y$ simplify to?

#### Solution:
$$y = R_{t+1}$$
The target depends purely on the immediate reward, eliminating bootstrapping.

---

### Exercise 3.10: Single Forward Pass Efficiency
State the computational speedup factor gained by outputting $|\mathcal{A}|$ Q-values simultaneously versus passing $(s, a)$ pairs individually.

#### Solution:
A factor of $|\mathcal{A}| \times$ speedup, reducing network forward passes from $|\mathcal{A}|$ to 1 per time step.


# Chapter 4: The Twin Pillars of DQN Stability: Experience Replay and Target Networks

---

## 4.1 The Mechanics of Experience Replay

In standard supervised deep learning, optimization algorithms such as Stochastic Gradient Descent (SGD) and Adam rely upon a fundamental probabilistic postulate: the training examples presented to the optimizer are independent and identically distributed (**i.i.d.**) draws from an underlying stationary data distribution:
$$\mathcal{D}_{\text{train}} \sim p(x, y)$$

In reinforcement learning, this foundational postulate is violently violated. When an agent interacts with an environment, the sequential transitions it observes:
$$(s_0, a_0, r_1, s_1), (s_1, a_1, r_2, s_2), (s_2, a_2, r_3, s_3), \dots$$
form a highly non-stationary, serially autocorrelated trajectory governed by the Markov chain induced by policy $\pi$:
$$\mathbb{P}(s_{t+1} \mid s_t, a_t) = \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

If an online gradient descent update is applied immediately to each observed transition $(s_t, a_t, r_{t+1}, s_{t+1})$, two catastrophic failure modes emerge:
1. **Strong Autocorrelation and Catastrophic Forgetting:** Consecutive states $s_t$ and $s_{t+1}$ in visual environments like Atari are nearly identical except for a few pixels. Updating the deep neural network on a long sequence of highly correlated states drives the network weights into an extreme local optimum tailored exclusively to the current visual subspace, erasing previously learned policies in distant regions of the state space.
2. **Policy Feedback Instability:** An updated network immediately alters the policy $\pi(a \mid s) = \arg\max_a Q(s, a; \boldsymbol{\theta})$, which immediately biases the future trajectory of states visited. This positive feedback loop causes the data distribution to drift rapidly, destabilizing the gradient dynamics.

To neutralize these pathology vectors, Lin (1992) proposed and Mnih et al. (2015) refined **Experience Replay**: decoupling the agent's real-time physical interaction with the environment from the optimization of its neural network.

```
                  THE EXPERIENCE REPLAY ARCHITECTURE
                  
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚                   ENVIRONMENT (MDP)                    â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                 â”‚ Action a_t               â”‚ Next State s_{t+1},
                 â”‚                          â”‚ Reward r_{t+1}, Done d_{t+1}
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”           â”‚
  â”‚     ACTOR (Behavior Ï€)      â”‚           â”‚
  â”‚   Îµ-greedy over Q(s, a; Î¸)  â”‚           â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜           â–¼
                 â”‚ State s_t    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤  Transition Generator    â”‚
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                            â”‚ Transition e_t = (s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})
                                            â–¼
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚      EXPERIENCE REPLAY BUFFER  D              â”‚
                    â”‚   Capacity N = 1,000,000 Transitions          â”‚
                    â”‚                                               â”‚
                    â”‚  [ e_1  ][ e_2  ][ e_3  ] ... [ e_{N-1} ][ e_N]â”‚
                    â”‚        â–² FIFO Circular Ring Buffer            â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
                             â”‚ Uniform Random Sampling: B ~ U(D)
                             â–¼ Mini-batch of Size B = 32
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚      OPTIMIZER / LEARNER (SGD / Adam)         â”‚
                    â”‚  L(Î¸) = E_{(s,a,r,s',d)~U(D)} [ Huber(Î´) ]    â”‚
                    â”‚  Î¸ â† Î¸ - Î± âˆ‡_Î¸ L(Î¸)                           â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Transition Tuple and Circular Ring Buffer
At every discrete time step $t$, the agent receives state $s_t$, selects action $a_t$, receives scalar reward $r_{t+1}$, transitions to state $s_{t+1}$, and observes termination indicator $d_{t+1} \in \{0, 1\}$. These elements are encapsulated into a 5-tuple called an **experience transition**:
$$e_t = (s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$$

The experience replay buffer $\mathcal{D} = \{e_1, e_2, \dots, e_N\}$ is implemented as a finite-capacity circular FIFO (first-in, first-out) ring buffer of maximum capacity $N$:
- When the buffer contains fewer than $N$ items, newly collected transitions are appended sequentially.
- Once the buffer reaches capacity $N$, newly arrived transitions overwrite the oldest transitions in the buffer:
$$\text{Index to overwrite} = t \pmod N$$

### Memory Footprint of the Replay Buffer
In the canonical Nature DQN paper (Mnih et al., 2015), the replay buffer capacity was set to $N = 1,000,000$ transitions.
In Atari games, each state $s_t$ consists of 4 stacked $84 \times 84$ 8-bit unsigned integer grayscale frames ($4 \times 84 \times 84 = 28,224$ bytes). 
Naively storing two states ($s_t$ and $s_{t+1}$) per transition would consume:
$$\text{Memory}_{\text{naive}} = 10^6 \times (2 \times 28,224 + 4 + 4 + 1) \approx 56.45 \text{ GB}$$

However, in an episode, $s_{t+1}$ shares 3 frames with $s_t$:
$$s_t = (f_{t-3}, f_{t-2}, f_{t-1}, f_t), \quad s_{t+1} = (f_{t-2}, f_{t-1}, f_t, f_{t+1})$$
By storing a single contiguous buffer of raw frames $f_t \in \mathbb{R}^{84 \times 84}$ and representing transitions as integer pointers to frame indices, the memory footprint drops dramatically:
$$\text{Memory}_{\text{optimized}} = 10^6 \times (84 \times 84 \times 1 \text{ byte}) + 10^6 \times (4 + 4 + 4 + 1) \approx 7.06 \text{ GB} + 13 \text{ MB} \approx 7.07 \text{ GB}$$
This fit comfortably inside standard 16 GB system RAM on modern commodity computing hardware.

---

## 4.2 Decorrelation Analysis: Breaking Autocorrelation & Empirical Variance

To understand mathematically why Experience Replay transforms divergent learning into stable convergence, consider the correlation between consecutive state representations.

### Temporal Autocorrelation Decay
Let $X_t = \phi(s_t)$ denote the neural representation or feature embedding of state $s_t$ along a trajectory. The lag-$k$ autocorrelation function of the representation sequence is defined as:
$$R_X(k) = \frac{\mathbb{E}[(X_t - \mu_X)(X_{t+k} - \mu_X)^\top]}{\sigma_X^2}$$

In continuous control or 60 FPS video game dynamics, the physical position of objects changes smoothly:
$$\|s_{t+1} - s_t\| \ll \sigma_s \implies R_X(1) \approx 0.999$$

When gradient updates are performed on consecutive transitions:
$$\mathbf{g}_t = \nabla_{\boldsymbol{\theta}} \mathcal{L}_t(\boldsymbol{\theta}), \quad \mathbf{g}_{t+1} = \nabla_{\boldsymbol{\theta}} \mathcal{L}_{t+1}(\boldsymbol{\theta})$$
the empirical gradients are collinear: $\cos(\mathbf{g}_t, \mathbf{g}_{t+1}) \approx 1$.
The variance of the accumulated gradient across a sequence of $M$ consecutive steps is:
$$\mathbb{V}\left[\sum_{i=1}^M \mathbf{g}_i\right] = \sum_{i=1}^M \mathbb{V}[\mathbf{g}_i] + 2 \sum_{i < j} \text{Cov}(\mathbf{g}_i, \mathbf{g}_j)$$

Because $\text{Cov}(\mathbf{g}_i, \mathbf{g}_j) > 0$ for small $|i - j|$, the covariance terms explode, causing the variance of the gradient updates to scale as $\mathcal{O}(M^2)$ instead of $\mathcal{O}(M)$. This induces extreme parameter jitter and directional oscillations.

```
       AUTOCORRELATION DECAY: ON-POLICY SEQUENTIAL VS REPLAY BUFFER
       
  Autocorrelation
    R_X(k)
     1.0 â”¬â”€â”€â”€â”
         â”‚    \    Sequential Trajectory: R_X(k) drops very slowly
     0.8 â”‚     \   (High autocorrelation over dozens of frames)
         â”‚      \
     0.6 â”‚       \
         â”‚        \
     0.4 â”‚         \
         â”‚          \
     0.2 â”‚           \â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
         â”‚                                         
     0.0 â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Lag k (steps)
         â”‚ â–ˆ (Replay Buffer: R_X(k) â‰ˆ 0 for all k â‰¥ 1)
```

By sampling a mini-batch of size $B$ **uniformly at random** from replay buffer $\mathcal{D}$:
$$\mathcal{B} = \{(s^{(i)}, a^{(i)}, r^{(i)}, s'^{(i)}, d^{(i)})\}_{i=1}^B, \quad (s^{(i)}, a^{(i)}, r^{(i)}, s'^{(i)}, d^{(i)}) \overset{\text{i.i.d.}}{\sim} \mathcal{U}(\mathcal{D})$$
the probability that two samples in the same mini-batch are temporally contiguous is:
$$\mathbb{P}(\text{collision}) = \frac{B(B-1)}{2 N} \approx \frac{32 \times 31}{2 \times 10^6} \approx 4.96 \times 10^{-4} \approx 0$$

Thus, the covariance terms vanish:
$$\text{Cov}(\mathbf{g}_i, \mathbf{g}_j) \approx 0 \quad \forall i \neq j \implies \mathbb{V}\left[\frac{1}{B}\sum_{i=1}^B \mathbf{g}_i\right] = \frac{1}{B^2} \sum_{i=1}^B \mathbb{V}[\mathbf{g}_i] = \frac{1}{B} \sigma_{\mathbf{g}}^2$$
Sampling from the replay buffer reduces empirical gradient variance by a factor of $B$, recovering the i.i.d. property required for standard SGD convergence.

### Sample Efficiency and Data Reuse
In purely on-policy algorithms (such as SARSA or vanilla REINFORCE), each transition $(s_t, a_t, r_{t+1}, s_{t+1})$ is used for exactly one gradient update and then permanently discarded. 
In Experience Replay with capacity $N$, batch size $B$, and learning frequency $K$ (e.g., one gradient update every $K=4$ environment steps):
$$\text{Expected reuse per transition} = \frac{B}{K} \times \frac{N}{N} = \frac{32}{4} = 8 \text{ times}$$
Every observed transition is recycled multiple times across diverse parameter regimes, extracting substantially greater informational value from expensive environment interactions.

---

## 4.3 The Non-Stationary Target Problem

Even with an experience replay buffer breaking temporal autocorrelation, deep Q-learning without further architectural modifications routinely diverges. The root cause lies in the **moving target problem**.

Recall the standard one-step Q-learning Bellman optimality loss:
$$\mathcal{L}(\boldsymbol{\theta}) = \mathbb{E}_{(s, a, r, s', d) \sim \mathcal{U}(\mathcal{D})} \left[ \left( r + \gamma (1 - d) \max_{a' \in \mathcal{A}} Q(s', a'; \boldsymbol{\theta}) - Q(s, a; \boldsymbol{\theta}) \right)^2 \right]$$

Let $y(r, s', d; \boldsymbol{\theta}) = r + \gamma (1 - d) \max_{a'} Q(s', a'; \boldsymbol{\theta})$ denote the Bellman target. Notice that $y$ depends directly on the **same** parameter vector $\boldsymbol{\theta}$ that is being optimized!

### The Policy Chasing Vicious Cycle
When gradient descent is applied to minimize the loss, we adjust $\boldsymbol{\theta}$ to move $Q(s, a; \boldsymbol{\theta})$ closer to target $y(\boldsymbol{\theta})$:
$$\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k + \alpha \delta_k \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}_k)$$
where $\delta_k = y(\boldsymbol{\theta}_k) - Q(s, a; \boldsymbol{\theta}_k)$.

However, because deep neural networks possess global parameter sharing, shifting $\boldsymbol{\theta}_k \to \boldsymbol{\theta}_{k+1}$ does not merely change $Q(s, a)$. It also changes $Q(s', a'; \boldsymbol{\theta})$ for neighboring states $s'$!
If $Q(s', a'; \boldsymbol{\theta})$ shifts in the same direction:
$$y(\boldsymbol{\theta}_{k+1}) = r + \gamma \max_{a'} Q(s', a'; \boldsymbol{\theta}_{k+1}) \neq y(\boldsymbol{\theta}_k)$$

The target itself recedes like a mirage. The optimization objective is not a stationary surface $\min_{\boldsymbol{\theta}} f(\boldsymbol{\theta})$, but a dynamically morphing target distribution where the goalpost moves after every single step:

```
                      THE MOVING TARGET ILLUSION
                      
     Loss Surface at Step k             Loss Surface at Step k+1
     
           Target y(Î¸_k)                      Target y(Î¸_{k+1})
               â”‚                                      â”‚
               â–¼                                      â–¼
           \       /                              \       /
            \  â€¢  /   â—„â”€â”€ Q(s,a; Î¸_k)              \     /
             \___/                                  \ â€¢ /   â—„â”€â”€ Q(s,a; Î¸_{k+1})
                                                     \_/
               
      [The parameter Î¸ moves to hit y(Î¸_k), but that very movement pushes
       the target to y(Î¸_{k+1}), creating endless cycles, feedback loops,
       and explosive divergence.]
```

### Analysis of the True vs Semi-Gradient
If one were to compute the *true* mathematically rigorous gradient of the mean squared Bellman error $\frac{1}{2} (y(\boldsymbol{\theta}) - Q(s, a; \boldsymbol{\theta}))^2$ with respect to $\boldsymbol{\theta}$, the chain rule would yield:
$$\nabla_{\boldsymbol{\theta}} \mathcal{L}_{\text{full}}(\boldsymbol{\theta}) = - (y(\boldsymbol{\theta}) - Q(s, a; \boldsymbol{\theta})) \left( \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}) - \gamma \nabla_{\boldsymbol{\theta}} \max_{a'} Q(s', a'; \boldsymbol{\theta}) \right)$$

This true gradient contains the term $\gamma \nabla_{\boldsymbol{\theta}} \max_{a'} Q(s', a'; \boldsymbol{\theta})$, known as the **residual gradient**. 
Baird (1995) proved that optimizing the residual gradient directly requires two independent samples of the next state $s'$ from the exact same state-action pair $(s, a)$ to obtain an unbiased estimate of the squared expectation:
$$\mathbb{E}[(y - Q)^2] \neq (\mathbb{E}[y - Q])^2$$
In real-world or model-free RL, drawing two independent physical transitions from the exact same state is impossible. Furthermore, residual gradient algorithms converge to the wrong solution when the environment is stochastic, optimizing for the expected value of the squared Bellman error rather than the value function of the MDP.

Reinforcement learning therefore relies on the **semi-gradient**: treating the target $y$ as a fixed, externally provided pseudo-constant during the gradient step:
$$\mathbf{g}_{\text{semi}} = - (y - Q(s, a; \boldsymbol{\theta})) \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta})$$
Without architectural intervention, treating $y(\boldsymbol{\theta})$ as a constant when it actually shifts with $\boldsymbol{\theta}$ creates a disastrous positive feedback loop.

---

## 4.4 Target Network Formulations: Hard Sync vs Soft Polyak Averaging

To break the destructive feedback loop of the moving target, Mnih et al. (2015) introduced the **Target Network**.

Instead of evaluating the target values using the online parameters $\boldsymbol{\theta}$, a second, independent set of parameters $\boldsymbol{\theta}^-$ is maintained. The target network architecture is an identical clone of the online Q-network, but its parameters are frozen or updated on a much slower timescale.

The Bellman target is redefined as:
$$y^{\text{target}}(r, s', d; \boldsymbol{\theta}^-) = r + \gamma (1 - d) \max_{a' \in \mathcal{A}} Q(s', a'; \boldsymbol{\theta}^-)$$

The objective function minimized by the online network becomes:
$$\mathcal{L}(\boldsymbol{\theta}; \boldsymbol{\theta}^-) = \mathbb{E}_{(s, a, r, s', d) \sim \mathcal{U}(\mathcal{D})} \left[ \ell\left( y^{\text{target}}(r, s', d; \boldsymbol{\theta}^-) - Q(s, a; \boldsymbol{\theta}) \right) \right]$$

Now, when computing the gradient with respect to $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}; \boldsymbol{\theta}^-) = - \mathbb{E}\left[ \ell'\left( y^{\text{target}} - Q(s, a; \boldsymbol{\theta}) \right) \nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}) \right]$$
The target $y^{\text{target}}$ does not depend on $\boldsymbol{\theta}$ at all! It is a true mathematical constant with respect to the gradient operator:
$$\nabla_{\boldsymbol{\theta}} y^{\text{target}}(r, s', d; \boldsymbol{\theta}^-) = \mathbf{0}$$
The learning problem is successfully converted into a sequence of stationary supervised regression problems.

```
                      DUAL-NETWORK ARCHITECTURE
                      
               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â”‚         Online Q-Network Î¸            â”‚
               â”‚         Q(s, a; Î¸)                    â”‚
               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â”‚ Evaluates Q(s, a; Î¸)
                                  â–¼
                        Loss: Huber( y_target - Q(s, a; Î¸) )
                                  â–²
                                  â”‚ Target y_target = r + Î³ max_{a'} Q(s', a'; Î¸^-)
               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â”‚         Target Q-Network Î¸^-          â”‚
               â”‚         Q(s', a'; Î¸^-)                â”‚
               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â”‚ Parameter Synchronization:
                                  â”‚ â€¢ Hard: Î¸^- â† Î¸ every C steps
                                  â”‚ â€¢ Soft: Î¸^- â† Ï„ Î¸ + (1-Ï„) Î¸^-
```

### 1. Hard Periodic Target Synchronization (DQN Standard)
In canonical DQN (Mnih et al., 2015), the target network parameters $\boldsymbol{\theta}^-$ are held completely static for a fixed hyperparameter interval of $C$ environment steps (typically $C = 10,000$ steps in Atari, corresponding to 40,000 game frames). 
At every $C$-th step, the online parameters are copied directly into the target network:
$$\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta} \quad \text{if } t \equiv 0 \pmod C$$

**Properties:**
- During the $C$ steps between updates, the regression target distribution is rigorously fixed, ensuring stability.
- However, at step $C$, the target network undergoes a discontinuous, discrete jump: $\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$. This sudden shift immediately alters the Bellman targets for all states, often causing a transient spike in TD error and temporary instability immediately following the synchronization event.

### 2. Soft Polyak Exponential Moving Average (DDPG / SAC / Modern DQN)
In continuous control algorithms such as Deep Deterministic Policy Gradients (DDPG; Lillicrap et al., 2015) and Twin Delayed DDPG (TD3; Fujimoto et al., 2018), hard periodic synchronization is replaced by **Polyak Averaging** (soft updates).
At *every single* optimization step $t$, the target weights are updated via an exponential moving average (EMA) with a small tracking coefficient $\tau \ll 1$ (typically $\tau \in [0.001, 0.005]$):
$$\boldsymbol{\theta}^- \leftarrow \tau \boldsymbol{\theta} + (1 - \tau) \boldsymbol{\theta}^-$$

**Properties:**
- Eliminates the discontinuous shock of hard updates; the target network glides smoothly through weight space.
- The effective memory horizon of the Polyak target network corresponds to an exponentially decaying window with half-life:
$$t_{1/2} = \frac{\ln(0.5)}{\ln(1 - \tau)} \approx \frac{0.693}{\tau} \text{ steps}$$
For $\tau = 0.001$, $t_{1/2} \approx 693$ optimization steps.

---

## 4.5 Huber Loss and Gradient Clipping: Stabilizing Optimization Under Massive Outliers

In classical dynamic programming and tabular Q-learning, the Bellman error $\delta = r + \gamma \max_{a'} Q(s', a') - Q(s, a)$ is bounded if the reward function $r \in [R_{\min}, R_{\max}]$ is bounded.
In deep neural networks, early in training when weights are randomly initialized, predictions $Q(s, a; \boldsymbol{\theta})$ can be wildly erratic.

### The Danger of Mean Squared Error ($L_2$ Loss)
The standard Mean Squared Error loss is:
$$\mathcal{L}_{\text{MSE}}(\delta) = \frac{1}{2} \delta^2$$
The derivative of the MSE loss with respect to the TD error $\delta$ is:
$$\frac{\partial \mathcal{L}_{\text{MSE}}}{\partial \delta} = \delta$$

```
               COMPARISON OF LOSS FUNCTIONS AND GRADIENTS
               
       Loss Function L(Î´)                  Gradient âˆ‚L/âˆ‚Î´
       
    10 â”¬         /   MSE: 0.5 Î´^2      1.0 â”¬         â”€â”€â”€â”€â”€â”€â”€ Huber / L1: +1
     8 â”‚        /                      0.5 â”‚        /
     6 â”‚  \    /                       0.0 â”¼â”€â”€â”€â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€â–º TD Error Î´
     4 â”‚   \  /  Huber Loss           -0.5 â”‚      /
     2 â”‚    \/                        -1.0 â”´â”€â”€â”€â”€â”€â”€â”€         Huber / L1: -1
     0 â”´â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â–º TD Error Î´             -2  -1   0   1   2
       -3 -2 -1 0 1 2 3
```

When an agent encounters a massive reward spike (e.g., scoring 1,000 points in an Atari game) or transitions to a catastrophic terminal state, the TD error can easily reach $\delta = 100$.
Under MSE loss, the gradient magnitude is $|\delta| = 100$. Multiplied by the gradient of the network $\nabla_{\boldsymbol{\theta}} Q$, this generates an enormous parameter update:
$$\Delta \boldsymbol{\theta} \propto 100 \cdot \nabla_{\boldsymbol{\theta}} Q$$

In deep convolutional or recurrent architectures, such outsized gradient vectors trigger the **exploding gradient problem**, destroying previously learned feature representations across the convolutional filters and resetting the network to random noise.

### The Huber Loss (Smooth $L_1$) Formulation
To guarantee numerical stability, Mnih et al. (2015) replaced MSE with the **Huber Loss** (smooth $L_1$ loss), defined with threshold parameter $\kappa = 1.0$:
$$\mathcal{L}_{\text{Huber}}(\delta) = \begin{cases}
\frac{1}{2} \delta^2 & \text{for } |\delta| \le 1.0 \\
|\delta| - \frac{1}{2} & \text{for } |\delta| > 1.0
\end{cases}$$

Let us compute the derivative of the Huber loss with respect to $\delta$:
$$\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial \delta} = \begin{cases}
\delta & \text{for } |\delta| \le 1.0 \\
\text{sign}(\delta) & \text{for } |\delta| > 1.0
\end{cases}$$

Notice the mathematical elegance of this formulation:
1. **Near zero ($|\delta| \le 1$):** The loss is quadratic ($\frac{1}{2}\delta^2$), providing a smooth, strictly convex minimum with continuous derivatives that gently pull predictions toward zero error without oscillations.
2. **Far from zero ($|\delta| > 1$):** The loss is linear ($|\delta| - 0.5$), and its derivative is strictly bounded:
$$\left|\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial \delta}\right| \le 1.0 \quad \forall \delta \in \mathbb{R}$$

The effective gradient magnitude never exceeds $1.0$, regardless of whether the TD error is $5$, $50$, or $50,000$. The Huber loss acts as an inherent, principled gradient clipper at the loss function level, rendering deep reinforcement learning impervious to catastrophic reward outliers.

---

## 4.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 4.1: FIFO Replay Buffer Index Math and Overwrite Tracking
**Problem:** A replay buffer has capacity $N = 5$. The agent inserts transitions at time steps $t = 0, 1, 2, 3, 4, 5, 6, 7$. 
Calculate:
1. The buffer size and write pointer index at each step.
2. The exact transitions stored in the buffer at $t = 7$.
3. The probability that a uniform random sample of size $B = 2$ drawn at $t = 7$ contains the transition generated at $t = 6$.

**Solution:**
Let the transitions be denoted $e_0, e_1, \dots, e_7$. The write pointer is given by $p = t \pmod N$:
- $t=0$: write to index $0 \pmod 5 = 0$. Buffer: $[e_0, \emptyset, \emptyset, \emptyset, \emptyset]$. Size $= 1$.
- $t=1$: write to index $1 \pmod 5 = 1$. Buffer: $[e_0, e_1, \emptyset, \emptyset, \emptyset]$. Size $= 2$.
- $t=2$: write to index $2 \pmod 5 = 2$. Buffer: $[e_0, e_1, e_2, \emptyset, \emptyset]$. Size $= 3$.
- $t=3$: write to index $3 \pmod 5 = 3$. Buffer: $[e_0, e_1, e_2, e_3, \emptyset]$. Size $= 4$.
- $t=4$: write to index $4 \pmod 5 = 4$. Buffer: $[e_0, e_1, e_2, e_3, e_4]$. Size $= 5$.
- $t=5$: write to index $5 \pmod 5 = 0$. Overwrites $e_0$. Buffer: $[e_5, e_1, e_2, e_3, e_4]$. Size $= 5$.
- $t=6$: write to index $6 \pmod 5 = 1$. Overwrites $e_1$. Buffer: $[e_5, e_6, e_2, e_3, e_4]$. Size $= 5$.
- $t=7$: write to index $7 \pmod 5 = 2$. Overwrites $e_2$. Buffer: $[e_5, e_6, e_7, e_3, e_4]$. Size $= 5$.

At $t = 7$, the buffer contains $\{e_3, e_4, e_5, e_6, e_7\}$. Notice that $e_0, e_1, e_2$ have been purged.
To find the probability that a sample of size $B = 2$ without replacement contains $e_6$:
The number of distinct subsets of size 2 from 5 items is $\binom{5}{2} = 10$.
The number of subsets containing $e_6$ is $\binom{4}{1} = 4$.
$$\mathbb{P}(e_6 \in \mathcal{B}) = \frac{4}{10} = \frac{2}{5} = 0.40 \quad (40\%)$$

TypeScript Verification:
```typescript
class SimpleReplayBuffer<T> {
  private buffer: T[] = [];
  private ptr = 0;
  constructor(public readonly capacity: number) {}
  push(item: T): void {
    if (this.buffer.length < this.capacity) {
      this.buffer.push(item);
    } else {
      this.buffer[this.ptr] = item;
    }
    this.ptr = (this.ptr + 1) % this.capacity;
  }
  getItems(): T[] { return [...this.buffer]; }
}
const rb = new SimpleReplayBuffer<string>(5);
for (let t = 0; t <= 7; t++) rb.push(`e_${t}`);
console.log(rb.getItems()); // ['e_5', 'e_6', 'e_7', 'e_3', 'e_4']
```

---

### Worked Example 4.2: Calculating Autocorrelation Decay in a Random Walk
**Problem:** Consider an agent moving on a 1D continuous line: $s_{t+1} = s_t + \epsilon_t$, where $\epsilon_t \sim \mathcal{N}(0, \sigma^2)$ are i.i.d. Gaussian increments with $\sigma = 1.0$. Assume $s_0 = 0$.
1. Derive the covariance $\text{Cov}(s_t, s_{t+k})$ for lag $k \ge 0$.
2. Compute the theoretical correlation coefficient $\rho(t, t+k) = \frac{\text{Cov}(s_t, s_{t+k})}{\sqrt{\mathbb{V}[s_t]\mathbb{V}[s_{t+k}]}}$ for $t = 100$ and lag $k = 1, 10, 50$.
3. Contrast this with the correlation between two independent uniform samples drawn from a large replay buffer.

**Solution:**
1. Express $s_{t+k}$ in terms of $s_t$:
$$s_t = \sum_{i=1}^t \epsilon_i, \quad s_{t+k} = s_t + \sum_{j=1}^k \epsilon_{t+j}$$
Since future increments $\epsilon_{t+j}$ are independent of $s_t$:
$$\text{Cov}(s_t, s_{t+k}) = \text{Cov}\left(s_t, s_t + \sum_{j=1}^k \epsilon_{t+j}\right) = \mathbb{V}[s_t] = t \sigma^2$$
The variance at step $t$ is $\mathbb{V}[s_t] = t \sigma^2$, and at step $t+k$ is $\mathbb{V}[s_{t+k}] = (t+k)\sigma^2$.

2. The correlation coefficient is:
$$\rho(t, t+k) = \frac{t \sigma^2}{\sqrt{(t \sigma^2) \cdot ((t+k) \sigma^2)}} = \frac{t}{\sqrt{t(t+k)}} = \sqrt{\frac{t}{t+k}}$$
For $t = 100$:
- For lag $k = 1$: $\rho = \sqrt{\frac{100}{101}} = \sqrt{0.9901} \approx 0.9950$ (99.5% correlated!).
- For lag $k = 10$: $\rho = \sqrt{\frac{100}{110}} = \sqrt{0.9091} \approx 0.9535$.
- For lag $k = 50$: $\rho = \sqrt{\frac{100}{150}} = \sqrt{0.6667} \approx 0.8165$.

3. In an Experience Replay buffer filled with transitions from thousands of episodes across the state space, two random draws $i, j \sim \mathcal{U}(\mathcal{D})$ originate from distinct, independent episodes with probability $> 0.999$. Hence, $\mathbb{E}[(s^{(i)} - \mu)(s^{(j)} - \mu)] = 0$, giving an empirical correlation of $\rho \approx 0.0$. Replay sampling completely shatters temporal correlation.

---

### Worked Example 4.3: Empirical Gradient Variance: Sequential Online vs. Mini-batch Replay
**Problem:** Suppose an online RL agent observes gradients $g_t$ where each gradient has scalar variance $\mathbb{V}[g_t] = 4.0$, and consecutive gradients have covariance $\text{Cov}(g_t, g_{t+1}) = 3.2$, $\text{Cov}(g_t, g_{t+2}) = 2.0$, and zero covariance for lag $\ge 3$.
1. Compute the variance of the average gradient $\bar{g}_{\text{seq}} = \frac{1}{4}\sum_{t=1}^4 g_t$ computed over 4 consecutive online steps.
2. Compute the variance of the average gradient $\bar{g}_{\text{replay}} = \frac{1}{4}\sum_{i=1}^4 g_i$ computed over a mini-batch of size 4 sampled uniformly at random from an independent replay buffer.
3. Determine the variance reduction ratio achieved by the replay buffer.

**Solution:**
1. For sequential updates:
$$\mathbb{V}\left[\sum_{t=1}^4 g_t\right] = \sum_{t=1}^4 \mathbb{V}[g_t] + 2 \sum_{1 \le i < j \le 4} \text{Cov}(g_i, g_j)$$
The pairs and lags are:
- Lag 1 pairs: $(1,2), (2,3), (3,4)$ (3 pairs) $\implies 3 \times 3.2 = 9.6$.
- Lag 2 pairs: $(1,3), (2,4)$ (2 pairs) $\implies 2 \times 2.0 = 4.0$.
- Lag 3 pairs: $(1,4)$ (1 pair) $\implies 1 \times 0.0 = 0.0$.
$$\mathbb{V}\left[\sum_{t=1}^4 g_t\right] = 4 \times 4.0 + 2 \times (9.6 + 4.0) = 16.0 + 2 \times 13.6 = 16.0 + 27.2 = 43.2$$
The variance of the sample mean $\bar{g}_{\text{seq}}$ is:
$$\mathbb{V}[\bar{g}_{\text{seq}}] = \frac{1}{4^2} \times 43.2 = \frac{43.2}{16} = 2.70$$

2. For replay buffer mini-batch sampling, the samples are mutually independent ($\text{Cov}(g_i, g_j) = 0$ for all $i \neq j$):
$$\mathbb{V}\left[\sum_{i=1}^4 g_i\right] = \sum_{i=1}^4 \mathbb{V}[g_i] = 4 \times 4.0 = 16.0$$
$$\mathbb{V}[\bar{g}_{\text{replay}}] = \frac{1}{4^2} \times 16.0 = \frac{16.0}{16} = 1.00$$

3. Variance Reduction Ratio:
$$\frac{\mathbb{V}[\bar{g}_{\text{seq}}]}{\mathbb{V}[\bar{g}_{\text{replay}}]} = \frac{2.70}{1.00} = 2.70$$
The sequential online gradient exhibits **$270\%$ higher variance** due to temporal positive autocorrelation.

---

### Worked Example 4.4: Hard Periodic Target Sync vs Single-Network Oscillation
**Problem:** Consider a 2-state MDP where $s_1 \to s_2$ deterministically with action $a_1$ and reward $r = 0$, and $s_2$ is terminal with reward $0$. Discount factor $\gamma = 0.9$.
Let the parameterized values be $Q(s_1, a_1; \theta) = \theta$ and $Q(s_2, a_2; \theta) = 2\theta$.
The TD target is $y = r + \gamma Q(s_2, a_2; \theta) = 0 + 0.9(2\theta) = 1.8\theta$.
1. If we update $\theta$ online without a target network using learning rate $\alpha = 0.8$: $\theta_{k+1} = \theta_k - \alpha \nabla_\theta \frac{1}{2}(1.8\theta_k - \theta)^2|_{\theta=\theta_k}$, show the recurrence relation for $\theta_k$ and determine if it diverges.
2. If we introduce a target network with hard update period $C = 2$:
Target $y = 1.8 \theta^-$. For steps $k=0, 1$, $\theta^- = \theta_0 = 1.0$.
Compute $\theta_1, \theta_2$, then update $\theta^- \leftarrow \theta_2$, and compute $\theta_3, \theta_4$.

**Solution:**
1. Without target network:
The semi-gradient update is:
$$\theta_{k+1} = \theta_k + \alpha (y(\theta_k) - Q(s_1, a_1; \theta_k)) \frac{\partial Q}{\partial \theta} = \theta_k + 0.8 (1.8\theta_k - \theta_k)(1) = \theta_k + 0.8(0.8\theta_k) = \theta_k + 0.64\theta_k = 1.64 \theta_k$$
Starting from $\theta_0 = 1.0$:
$$\theta_k = (1.64)^k$$
Since $|1.64| > 1$, the parameter diverges exponentially to $+\infty$: $\theta_1 = 1.64, \theta_2 = 2.6896, \theta_5 = 11.88, \theta_{10} = 141.1$.

2. With target network ($C = 2$):
Initial state: $\theta^- = 1.0, \theta_0 = 1.0$.
- Step $k = 0$: $y = 1.8 \theta^- = 1.8(1.0) = 1.8$.
$$\theta_1 = \theta_0 + \alpha (y - \theta_0) = 1.0 + 0.8(1.8 - 1.0) = 1.0 + 0.8(0.8) = 1.64$$
- Step $k = 1$: Target is still frozen at $\theta^- = 1.0 \implies y = 1.8$.
$$\theta_2 = \theta_1 + \alpha (y - \theta_1) = 1.64 + 0.8(1.8 - 1.64) = 1.64 + 0.8(0.16) = 1.64 + 0.128 = 1.768$$
Notice that $\theta$ converged toward the target $1.8$ because the target was stationary during this period!
- At step $k = 2$: Hard sync occurs: $\theta^- \leftarrow \theta_2 = 1.768$.
New fixed target: $y = 1.8(1.768) = 3.1824$.
- Step $k = 2$: $\theta_3 = 1.768 + 0.8(3.1824 - 1.768) = 1.768 + 0.8(1.4144) = 1.768 + 1.1315 = 2.8995$.
- Step $k = 3$: $\theta_4 = 2.8995 + 0.8(3.1824 - 2.8995) = 2.8995 + 0.8(0.2829) = 3.1258$.
While $\theta$ grows due to the positive feedback of the MDP's synthetic definition, within each interval of length $C$, the error contracts monotonically: $|\delta_1| = 0.16 < |\delta_0| = 0.80$, and $|\delta_3| = 0.0566 < |\delta_2| = 0.2829$. The target network forces intra-period contraction.

---

### Worked Example 4.5: Polyak Averaging ($\tau$-Soft Update) Half-Life and Weight Trajectory
**Problem:** In DDPG/TD3, soft target updates obey: $\boldsymbol{\theta}^-_{t+1} = \tau \boldsymbol{\theta}_t + (1 - \tau) \boldsymbol{\theta}^-_t$.
Suppose the online network weight is clamped at a new constant value $\theta^* = 10.0$, while the initial target weight is $\theta^-_0 = 0.0$.
Let $\tau = 0.005$.
1. Derive the closed-form expression for $\theta^-_t$ as a function of $t$.
2. Compute the exact value of $\theta^-_t$ at $t = 100, 500, 1000$.
3. Compute the exact half-life $t_{1/2}$ (the step where $\theta^-_t = 5.0$).

**Solution:**
1. Subtract $\theta^*$ from both sides:
$$\theta^-_{t+1} - \theta^* = \tau \theta^* + (1 - \tau)\theta^-_t - \theta^* = (1 - \tau)(\theta^-_t - \theta^*)$$
By induction:
$$\theta^-_t - \theta^* = (1 - \tau)^t (\theta^-_0 - \theta^*)$$
$$\theta^-_t = \theta^* + (1 - \tau)^t (\theta^-_0 - \theta^*) = \theta^* (1 - (1 - \tau)^t)$$
For $\theta^* = 10.0$ and $\tau = 0.005$:
$$\theta^-_t = 10.0 \left(1 - (0.995)^t\right)$$

2. Numerical values:
- At $t = 100$: $(0.995)^{100} \approx 0.60577 \implies \theta^-_{100} = 10.0(1 - 0.60577) = 3.9423$.
- At $t = 500$: $(0.995)^{500} \approx 0.08157 \implies \theta^-_{500} = 10.0(1 - 0.08157) = 9.1843$.
- At $t = 1000$: $(0.995)^{1000} \approx 0.00665 \implies \theta^-_{1000} = 10.0(1 - 0.00665) = 9.9335$.

3. Half-life calculation:
$$10.0(1 - (0.995)^{t_{1/2}}) = 5.0 \implies (0.995)^{t_{1/2}} = 0.5$$
$$t_{1/2} = \frac{\ln(0.5)}{\ln(0.995)} = \frac{-0.693147}{-0.0050125} \approx 138.28 \approx 139 \text{ steps}$$
After 139 steps, the target network absorbs 50% of the online network's weight displacement.

---

### Worked Example 4.6: Huber Loss vs MSE Gradient Under Outlier TD Errors
**Problem:** A deep Q-network encounters three transitions with TD errors:
$\delta_1 = 0.4$, $\delta_2 = 1.0$, and $\delta_3 = 25.0$.
Assume $\nabla_{\boldsymbol{\theta}} Q(s, a; \boldsymbol{\theta}) = [0.2, -0.5]^\top$.
1. Compute the loss value under MSE ($\frac{1}{2}\delta^2$) and Huber Loss ($\kappa = 1.0$) for each transition.
2. Compute the gradient vector $\mathbf{g} = \nabla_{\boldsymbol{\theta}} \mathcal{L}$ under both loss functions for all three transitions.
3. Compare the gradient norms $\|\mathbf{g}\|_2$ for $\delta_3 = 25.0$.

**Solution:**
1. Loss values:
- For $\delta_1 = 0.4 \le 1.0$:
  - $\mathcal{L}_{\text{MSE}} = \frac{1}{2}(0.4)^2 = 0.08$.
  - $\mathcal{L}_{\text{Huber}} = \frac{1}{2}(0.4)^2 = 0.08$ (identical).
- For $\delta_2 = 1.0 \le 1.0$:
  - $\mathcal{L}_{\text{MSE}} = \frac{1}{2}(1.0)^2 = 0.50$.
  - $\mathcal{L}_{\text{Huber}} = \frac{1}{2}(1.0)^2 = 0.50$ (identical).
- For $\delta_3 = 25.0 > 1.0$:
  - $\mathcal{L}_{\text{MSE}} = \frac{1}{2}(25.0)^2 = 312.5$.
  - $\mathcal{L}_{\text{Huber}} = |25.0| - 0.5 = 24.5$.

2. Gradients:
By chain rule: $\nabla_{\boldsymbol{\theta}} \mathcal{L} = \frac{\partial \mathcal{L}}{\partial \delta} \cdot \frac{\partial \delta}{\partial \boldsymbol{\theta}} = - \frac{\partial \mathcal{L}}{\partial \delta} \nabla_{\boldsymbol{\theta}} Q$.
- For $\delta_1 = 0.4$:
  - Both losses have $\frac{\partial \mathcal{L}}{\partial \delta} = 0.4$.
  - $\mathbf{g}_{\text{MSE}} = \mathbf{g}_{\text{Huber}} = -0.4 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.08 \\ 0.20 \end{bmatrix}$.
- For $\delta_2 = 1.0$:
  - Both losses have $\frac{\partial \mathcal{L}}{\partial \delta} = 1.0$.
  - $\mathbf{g}_{\text{MSE}} = \mathbf{g}_{\text{Huber}} = -1.0 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.20 \\ 0.50 \end{bmatrix}$.
- For $\delta_3 = 25.0$:
  - MSE: $\frac{\partial \mathcal{L}}{\partial \delta} = 25.0$.
    $$\mathbf{g}_{\text{MSE}} = -25.0 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -5.0 \\ 12.5 \end{bmatrix}$$
  - Huber: $\frac{\partial \mathcal{L}}{\partial \delta} = \text{sign}(25.0) = 1.0$.
    $$\mathbf{g}_{\text{Huber}} = -1.0 \begin{bmatrix} 0.2 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.20 \\ 0.50 \end{bmatrix}$$

3. Norm comparison for $\delta_3$:
- $\|\mathbf{g}_{\text{MSE}}\|_2 = \sqrt{(-5.0)^2 + (12.5)^2} = \sqrt{25 + 156.25} = \sqrt{181.25} \approx 13.46$.
- $\|\mathbf{g}_{\text{Huber}}\|_2 = \sqrt{(-0.20)^2 + (0.50)^2} = \sqrt{0.04 + 0.25} = \sqrt{0.29} \approx 0.5385$.
The MSE gradient is **25 times larger**, capable of destroying network weights, while Huber cleanly caps the gradient.

---

### Worked Example 4.7: Target Calculation with Terminal State Masking
**Problem:** In DQN, transitions reaching terminal states ($d = 1$) must omit the bootstrapped future value: $y = r + \gamma (1 - d) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)$.
Given discount factor $\gamma = 0.99$, and the following mini-batch of 3 transitions:
- Transition 1: $r = +1.0, d = 0, Q(s'_1, \cdot; \boldsymbol{\theta}^-) = [2.4, 4.1, 1.8]$
- Transition 2: $r = -1.0, d = 1, Q(s'_2, \cdot; \boldsymbol{\theta}^-) = [10.5, 12.2, 8.0]$
- Transition 3: $r = 0.0, d = 0, Q(s'_3, \cdot; \boldsymbol{\theta}^-) = [-0.5, -0.2, -1.1]$
Current online predictions: $Q(s_1, a_1; \boldsymbol{\theta}) = 3.5$, $Q(s_2, a_2; \boldsymbol{\theta}) = -0.4$, $Q(s_3, a_3; \boldsymbol{\theta}) = 0.1$.
Compute:
1. The target value $y_i$ for each transition.
2. The TD error $\delta_i = y_i - Q(s_i, a_i; \boldsymbol{\theta})$.
3. The mini-batch Huber loss.

**Solution:**
1. Target calculations:
- Transition 1 ($d = 0$): $\max_{a'} Q(s'_1, a') = \max(2.4, 4.1, 1.8) = 4.1$.
  $$y_1 = 1.0 + 0.99 \times (1 - 0) \times 4.1 = 1.0 + 4.059 = 5.059$$
- Transition 2 ($d = 1$, terminal!): The bootstrapped term is masked to 0:
  $$y_2 = -1.0 + 0.99 \times (1 - 1) \times 12.2 = -1.0 + 0.0 = -1.000$$
  *(Crucial note: Even though $Q(s'_2)$ was high, the terminal flag correctly annihilates the hallucinated future!)*
- Transition 3 ($d = 0$): $\max_{a'} Q(s'_3, a') = \max(-0.5, -0.2, -1.1) = -0.2$.
  $$y_3 = 0.0 + 0.99 \times (1 - 0) \times (-0.2) = -0.198$$

2. TD error calculations:
- $\delta_1 = y_1 - Q_1 = 5.059 - 3.5 = +1.559$.
- $\delta_2 = y_2 - Q_2 = -1.000 - (-0.4) = -0.600$.
- $\delta_3 = y_3 - Q_3 = -0.198 - 0.1 = -0.298$.

3. Huber loss calculations ($\kappa = 1.0$):
- For $\delta_1 = 1.559 > 1.0$: $\mathcal{L}_1 = |\delta_1| - 0.5 = 1.559 - 0.5 = 1.059$.
- For $\delta_2 = -0.600$ ($|\delta_2| \le 1.0$): $\mathcal{L}_2 = \frac{1}{2}(-0.600)^2 = 0.180$.
- For $\delta_3 = -0.298$ ($|\delta_3| \le 1.0$): $\mathcal{L}_3 = \frac{1}{2}(-0.298)^2 = 0.0444$.
Mini-batch Huber loss:
$$\bar{\mathcal{L}} = \frac{1.059 + 0.180 + 0.0444}{3} = \frac{1.2834}{3} = 0.4278$$

---

### Worked Example 4.8: Replay Sampling Probability and Coupon Collector Saturation
**Problem:** Suppose an experience replay buffer contains $N = 10,000$ transitions. An agent samples mini-batches of size $B = 32$ with replacement across $K$ training steps.
1. What is the probability that a specific transition $e^*$ is sampled at least once in a single mini-batch?
2. How many mini-batches $K$ must be sampled such that the probability of having sampled transition $e^*$ at least once exceeds $95\%$?
3. If each transition resides in the buffer for exactly $N$ environment steps, and 1 gradient step is performed per environment step, what is the probability that $e^*$ is *never* sampled during its entire lifetime in the buffer?

**Solution:**
1. For a single draw, $\mathbb{P}(\text{drawn}) = \frac{1}{N}$.
The probability that $e^*$ is *not* drawn in 1 pick is $1 - \frac{1}{N}$.
In a mini-batch of size $B$ drawn with replacement, the probability that $e^*$ is not picked at all is $\left(1 - \frac{1}{N}\right)^B$.
$$\mathbb{P}(e^* \in \mathcal{B}) = 1 - \left(1 - \frac{1}{10,000}\right)^{32} = 1 - (0.9999)^{32} \approx 1 - 0.996805 = 0.003195 \quad (\approx 0.32\%)$$

2. Over $K$ independent mini-batches, the probability that $e^*$ is never sampled is $\left(1 - \frac{1}{N}\right)^{BK}$.
We require:
$$1 - \left(1 - \frac{1}{N}\right)^{BK} \ge 0.95 \implies \left(1 - \frac{1}{N}\right)^{BK} \le 0.05$$
Using the approximation $\left(1 - \frac{1}{N}\right)^{BK} \approx e^{-\frac{BK}{N}}$:
$$e^{-\frac{32 K}{10,000}} \le 0.05 \implies -\frac{32 K}{10,000} \le \ln(0.05) \approx -2.99573$$
$$\frac{32 K}{10,000} \ge 2.99573 \implies K \ge \frac{29,957.3}{32} \approx 936.17 \implies K \ge 937 \text{ steps}$$

3. Lifetime in buffer: $K = N = 10,000$ steps.
The total number of samples drawn during its lifetime is $BK = 32 \times 10,000 = 320,000$.
The probability that $e^*$ is never sampled during its entire lifetime:
$$\mathbb{P}(\text{never}) = \left(1 - \frac{1}{10,000}\right)^{320,000} \approx e^{-\frac{320,000}{10,000}} = e^{-32} \approx 1.266 \times 10^{-14} \approx 0$$
Virtually every single experience is guaranteed to be sampled and learned from multiple times (expected number of times $= \frac{32 \times 10,000}{10,000} = 32$ times).

---

### Worked Example 4.9: Mathematical Derivation of Huber Loss Gradient Clipping
**Problem:** Formulate the general Huber loss with arbitrary transition threshold $\kappa > 0$:
$$\mathcal{L}_\kappa(\delta) = \begin{cases}
\frac{1}{2} \delta^2 & \text{if } |\delta| \le \kappa \\
\kappa \left(|\delta| - \frac{1}{2}\kappa\right) & \text{if } |\delta| > \kappa
\end{cases}$$
1. Prove that $\mathcal{L}_\kappa(\delta)$ is continuously differentiable ($C^1$) at $\delta = \kappa$ and $\delta = -\kappa$.
2. Derive the exact expression for the derivative $\frac{d\mathcal{L}_\kappa}{d\delta}$.
3. Show that $\lim_{\kappa \to 0} \frac{\mathcal{L}_\kappa(\delta)}{\kappa} = |\delta|$ (recovering pure $L_1$ loss).

**Solution:**
1. Check continuity at $\delta = \kappa$:
- Left limit: $\lim_{\delta \to \kappa^-} \mathcal{L}_\kappa(\delta) = \frac{1}{2}\kappa^2$.
- Right limit: $\lim_{\delta \to \kappa^+} \mathcal{L}_\kappa(\delta) = \kappa(\kappa - \frac{1}{2}\kappa) = \frac{1}{2}\kappa^2$.
Both limits match, so $\mathcal{L}_\kappa$ is continuous.
Check differentiability at $\delta = \kappa$:
- Left derivative: $\lim_{\delta \to \kappa^-} \frac{d}{d\delta}\left(\frac{1}{2}\delta^2\right) = \kappa$.
- Right derivative: For $\delta > \kappa > 0$, $|\delta| = \delta$.
  $$\lim_{\delta \to \kappa^+} \frac{d}{d\delta}\left(\kappa\delta - \frac{1}{2}\kappa^2\right) = \kappa$$
Both derivatives match $\kappa$.
By symmetry, at $\delta = -\kappa$, both left and right derivatives equal $-\kappa$. Hence, $\mathcal{L}_\kappa \in C^1(\mathbb{R})$.

2. The derivative is:
$$\frac{d\mathcal{L}_\kappa}{d\delta} = \begin{cases}
\delta & \text{if } |\delta| \le \kappa \\
\kappa \cdot \text{sign}(\delta) & \text{if } |\delta| > \kappa
\end{cases} = \max(-\kappa, \min(\kappa, \delta)) = \text{clip}(\delta, -\kappa, \kappa)$$
The derivative of the Huber loss is mathematically identical to applying the `clip` function to $\delta$ with bounds $[-\kappa, \kappa]$.

3. Limit as $\kappa \to 0$:
For any $\delta \neq 0$, as $\kappa \to 0$, eventually $|\delta| > \kappa$.
$$\frac{\mathcal{L}_\kappa(\delta)}{\kappa} = \frac{\kappa(|\delta| - \frac{1}{2}\kappa)}{\kappa} = |\delta| - \frac{1}{2}\kappa$$
$$\lim_{\kappa \to 0} \left( |\delta| - \frac{1}{2}\kappa \right) = |\delta|$$
Thus, Huber loss smoothly interpolates between $L_2$ regression for small errors and $L_1$ median regression for large errors.

---

### Worked Example 4.10: Complete TypeScript Implementation of a Circular Replay Buffer with Unit-Batch Sampling
**Problem:** Implement an efficient, production-grade `ReplayBuffer` in TypeScript supporting:
1. Fixed memory capacity $N$ with circular ring buffer overwrite mechanics.
2. Fast push operations $\mathcal{O}(1)$.
3. Fast uniform mini-batch sampling $\mathcal{O}(B)$ without replacement.
4. Verify sampling uniformity and index preservation.

**Solution:**
```typescript
export interface Transition<S = number[], A = number> {
  state: S;
  action: A;
  reward: number;
  nextState: S;
  done: boolean;
}

export class ReplayBuffer<S = number[], A = number> {
  private buffer: (Transition<S, A> | null)[];
  private pointer: number = 0;
  private currentSize: number = 0;

  constructor(public readonly capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be positive");
    this.buffer = new Array(capacity).fill(null);
  }

  push(transition: Transition<S, A>): void {
    this.buffer[this.pointer] = transition;
    this.pointer = (this.pointer + 1) % this.capacity;
    if (this.currentSize < this.capacity) {
      this.currentSize++;
    }
  }

  sample(batchSize: number): Transition<S, A>[] {
    if (this.currentSize < batchSize) {
      throw new Error(`Cannot sample batch of ${batchSize} from buffer with ${this.currentSize} items`);
    }

    // Modern Fisher-Yates partial shuffle on indices for O(B) sampling without replacement
    const sampledIndices = new Set<number>();
    const batch: Transition<S, A>[] = [];

    while (sampledIndices.size < batchSize) {
      const idx = Math.floor(Math.random() * this.currentSize);
      if (!sampledIndices.has(idx)) {
        sampledIndices.add(idx);
        batch.push(this.buffer[idx]!);
      }
    }

    return batch;
  }

  size(): number {
    return this.currentSize;
  }

  clear(): void {
    this.buffer.fill(null);
    this.pointer = 0;
    this.currentSize = 0;
  }
}
```

Verification Test:
```typescript
const buffer = new ReplayBuffer<number, number>(100);
for (let i = 0; i < 100; i++) {
  buffer.push({ state: i, action: 0, reward: 1, nextState: i + 1, done: false });
}
const batch = buffer.sample(4);
console.log(`Sampled ${batch.length} transitions. First state: ${batch[0].state}`);
// Correctly samples 4 distinct transitions uniformly at random
```

---

## 4.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 4.1: Frame-Pointer Buffer Memory Compression Ratio
**Problem:** In Atari DQN, an agent stores $1,000,000$ transitions. Each frame is an $84 \times 84$ 8-bit image ($7,056$ bytes). An action is a 32-bit integer (4 bytes), reward is a 32-bit float (4 bytes), and done is an 8-bit boolean (1 byte).
1. Calculate the exact uncompressed memory in gigabytes if $s_t$ and $s_{t+1}$ each store 4 discrete raw frames per transition.
2. Calculate the memory required if transitions store only a 64-bit pointer/index (8 bytes) to a master array of unique frames, plus action, reward, and done flags.
3. Compute the memory compression ratio $\frac{\text{Memory}_{\text{uncompressed}}}{\text{Memory}_{\text{compressed}}}$.

**Solution:**
1. Uncompressed approach:
Each state has 4 frames: $4 \times 7,056 = 28,224$ bytes.
Each transition stores:
- $s_t$: $28,224$ bytes.
- $s_{t+1}$: $28,224$ bytes.
- Action: 4 bytes.
- Reward: 4 bytes.
- Done: 1 byte.
Total per transition: $28,224 + 28,224 + 4 + 4 + 1 = 56,457$ bytes.
Total for $10^6$ transitions:
$$56,457 \times 10^6 \text{ bytes} \approx 5.6457 \times 10^{10} \text{ bytes} = \frac{56,457,000,000}{1024^3} \approx 52.58 \text{ GiB}$$

2. Pointer-based compressed approach:
Assuming an average episode length of 1,000 steps, $10^6$ transitions contain at most $10^6$ distinct frames.
- Frame storage: $10^6 \times 7,056 = 7.056 \times 10^9 \text{ bytes} \approx 6.57 \text{ GiB}$.
- Transition metadata storage: each transition stores:
  - Pointer to frame $t$: 8 bytes.
  - Action: 4 bytes.
  - Reward: 4 bytes.
  - Done: 1 byte.
  Total metadata per transition: $8 + 4 + 4 + 1 = 17$ bytes.
  Total metadata: $17 \times 10^6 = 17,000,000 \text{ bytes} \approx 0.016 \text{ GiB}$.
Total compressed memory: $6.57 + 0.016 = 6.586 \text{ GiB}$.

3. Compression ratio:
$$\text{Ratio} = \frac{52.58 \text{ GiB}}{6.586 \text{ GiB}} \approx 7.98 \times$$
Storing frame pointers achieves an **$8\times$ memory reduction**, allowing a million-transition buffer to fit in 7 GB of RAM instead of 53 GB.

---

### Exercise 4.2: Effective Target Update Period of Polyak Averaging
**Problem:** In TD3/SAC, Polyak soft updates use $\boldsymbol{\theta}^-_{t+1} = \tau \boldsymbol{\theta}_t + (1 - \tau) \boldsymbol{\theta}^-_t$ with $\tau = 0.005$.
In Nature DQN, hard updates use $\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$ every $C = 10,000$ steps.
1. Show that the weights of the target network under Polyak averaging can be written as a geometric distributed lag of past online weights:
$$\boldsymbol{\theta}^-_t = \tau \sum_{k=0}^{t-1} (1 - \tau)^k \boldsymbol{\theta}_{t-1-k} + (1 - \tau)^t \boldsymbol{\theta}^-_0$$
2. Compute the mean lag (expected age of the parameters) in the Polyak target network in terms of $\tau$.
3. Evaluate the mean lag for $\tau = 0.005$, and compare it to the mean age of parameters in DQN with $C = 10,000$.

**Solution:**
1. By repeated back-substitution:
$$\boldsymbol{\theta}^-_t = \tau \boldsymbol{\theta}_{t-1} + (1 - \tau) \boldsymbol{\theta}^-_{t-1}$$
$$\boldsymbol{\theta}^-_t = \tau \boldsymbol{\theta}_{t-1} + (1 - \tau)[\tau \boldsymbol{\theta}_{t-2} + (1 - \tau)\boldsymbol{\theta}^-_{t-2}] = \tau \boldsymbol{\theta}_{t-1} + \tau (1 - \tau) \boldsymbol{\theta}_{t-2} + (1 - \tau)^2 \boldsymbol{\theta}^-_{t-2}$$
By induction:
$$\boldsymbol{\theta}^-_t = \sum_{k=0}^{t-1} \tau (1 - \tau)^k \boldsymbol{\theta}_{t-1-k} + (1 - \tau)^t \boldsymbol{\theta}^-_0$$

2. The weights $w_k = \tau (1 - \tau)^k$ form a geometric probability distribution over the age $k+1$ of the parameters.
The expected age (mean lag) is:
$$\mathbb{E}[\text{Age}] = \sum_{k=0}^\infty (k+1) \tau (1 - \tau)^k = \tau \sum_{m=1}^\infty m (1 - \tau)^{m-1}$$
Using the standard identity $\sum_{m=1}^\infty m x^{m-1} = \frac{1}{(1 - x)^2}$ for $|x| < 1$, setting $x = 1 - \tau$:
$$\mathbb{E}[\text{Age}] = \tau \cdot \frac{1}{(1 - (1 - \tau))^2} = \tau \cdot \frac{1}{\tau^2} = \frac{1}{\tau}$$

3. Evaluations:
- For $\tau = 0.005$:
  $$\mathbb{E}[\text{Age}] = \frac{1}{0.005} = 200 \text{ steps}$$
- In DQN with hard period $C = 10,000$:
  The age of the target parameters increases linearly from 0 to $C-1$ over each cycle.
  The average age across time is:
  $$\text{Mean Age} = \frac{1}{C}\sum_{j=0}^{C-1} j = \frac{C - 1}{2} = \frac{10,000 - 1}{2} \approx 4,999.5 \text{ steps}$$
The DQN target network is approximately 25 times "older" and more delayed than the TD3 target network with $\tau = 0.005$.

---

### Exercise 4.3: Analytical Huber vs L2 Optimization Step on Linear Q-Function
**Problem:** Let $Q(s, a; w) = w \cdot x$ where $x = 2.0$. Suppose the target is $y = 10.0$ and current weight is $w_0 = 1.0$.
Learning rate $\alpha = 0.1$.
1. Compute the TD error $\delta_0 = y - Q(s, a; w_0)$.
2. Compute the updated weight $w_1^{(\text{MSE})}$ using MSE loss $\frac{1}{2}\delta^2$.
3. Compute the updated weight $w_1^{(\text{Huber})}$ using Huber loss with $\kappa = 1.0$.
4. Which update is more conservative, and what prevents $w_1$ from overshooting?

**Solution:**
1. Current prediction: $Q(s, a; w_0) = 1.0 \times 2.0 = 2.0$.
$$\delta_0 = y - Q(s, a; w_0) = 10.0 - 2.0 = 8.0$$

2. MSE update:
Loss: $\mathcal{L}_{\text{MSE}} = \frac{1}{2}\delta^2$.
Gradient with respect to $w$:
$$\frac{\partial \mathcal{L}_{\text{MSE}}}{\partial w} = \frac{\partial \mathcal{L}}{\partial \delta} \frac{\partial \delta}{\partial w} = \delta_0 \cdot (-x) = 8.0 \times (-2.0) = -16.0$$
Parameter update:
$$w_1^{(\text{MSE})} = w_0 - \alpha \frac{\partial \mathcal{L}_{\text{MSE}}}{\partial w} = 1.0 - 0.1 \times (-16.0) = 1.0 + 1.6 = 2.60$$

3. Huber update ($\kappa = 1.0$):
Since $|\delta_0| = 8.0 > 1.0$, the derivative is $\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial \delta} = \text{sign}(\delta_0) = +1.0$.
Gradient with respect to $w$:
$$\frac{\partial \mathcal{L}_{\text{Huber}}}{\partial w} = \frac{\partial \mathcal{L}}{\partial \delta} \frac{\partial \delta}{\partial w} = 1.0 \times (-2.0) = -2.0$$
Parameter update:
$$w_1^{(\text{Huber})} = w_0 - \alpha \frac{\partial \mathcal{L}_{\text{Huber}}}{\partial w} = 1.0 - 0.1 \times (-2.0) = 1.0 + 0.2 = 1.20$$

4. The Huber update is significantly more conservative ($+0.20$ vs $+1.60$).
Because the error $\delta_0 = 8.0$ exceeds threshold $\kappa = 1.0$, Huber clips the error derivative to $1.0$, capping the effective gradient step to $\alpha \kappa x = 0.1 \times 1.0 \times 2.0 = 0.20$. This prevents an outlier sample from swinging the parameter violently.

---

### Exercise 4.4: Contraction Mapping of Fixed Target Bellman Operator
**Problem:** Let $\mathcal{T}_{\boldsymbol{\theta}^-}$ be the fixed-target Bellman operator defined on value functions $Q$:
$$(\mathcal{T}_{\boldsymbol{\theta}^-} Q)(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)$$
Notice that the right-hand side does **not** depend on $Q$; it is a constant vector with respect to $Q$!
1. Prove that for any two action-value functions $Q_1, Q_2$, $\|\mathcal{T}_{\boldsymbol{\theta}^-} Q_1 - \mathcal{T}_{\boldsymbol{\theta}^-} Q_2\|_\infty = 0$.
2. Explain how this trivial contraction guarantees that the regression problem $\min_{\boldsymbol{\theta}} \|Q(\cdot, \cdot; \boldsymbol{\theta}) - \mathcal{T}_{\boldsymbol{\theta}^-} Q\|_2^2$ is stable and well-posed.

**Solution:**
1. Compute the difference:
$$(\mathcal{T}_{\boldsymbol{\theta}^-} Q_1)(s, a) - (\mathcal{T}_{\boldsymbol{\theta}^-} Q_2)(s, a) = \left[\mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)\right] - \left[\mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q(s', a'; \boldsymbol{\theta}^-)\right] = 0$$
Taking the supremum over all $(s, a)$:
$$\|\mathcal{T}_{\boldsymbol{\theta}^-} Q_1 - \mathcal{T}_{\boldsymbol{\theta}^-} Q_2\|_\infty = 0 \le \gamma \|Q_1 - Q_2\|_\infty \quad \forall \gamma \ge 0$$
The operator $\mathcal{T}_{\boldsymbol{\theta}^-}$ maps all value functions to a single constant vector.

2. Because the target vector $Y = \mathcal{T}_{\boldsymbol{\theta}^-}$ is completely independent of the online parameters $\boldsymbol{\theta}$, the loss function:
$$\mathcal{L}(\boldsymbol{\theta}) = \frac{1}{2} \mathbb{E}_{(s, a) \sim \mathcal{D}} [(Y(s, a) - Q(s, a; \boldsymbol{\theta}))^2]$$
is a standard, fixed supervised regression problem. It has no recursive self-referential loops, no eigenvalue expansions, and no Deadly Triad instability during the period when $\boldsymbol{\theta}^-$ is frozen.

---

### Exercise 4.5: Proof of Finite Replay Buffer Uniform Stationary Distribution
**Problem:** Consider a FIFO replay buffer of capacity $N$. Transitions $e_t$ are generated by a stationary Markov chain with invariant state-action distribution $\mu(s, a)$.
1. Show that when $t \ge N$, every slot $i \in \{0, 1, \dots, N-1\}$ in the buffer contains a transition sampled from marginal distribution $\mu$.
2. Let $J \sim \mathcal{U}(\{0, 1, \dots, N-1\})$ be a random index drawn from the buffer. Show that the marginal distribution of transition $e_J$ is exactly $\mu$.
3. Does the replay buffer eliminate non-stationarity if the policy $\pi$ is continuously changing? Explain.

**Solution:**
1. For any slot $i \in \{0, \dots, N-1\}$, at time $t \ge N$, the item residing in slot $i$ was recorded at time step $\tau(i) = t - ((t - i) \pmod N)$. Since the underlying MDP is stationary and in steady-state, each transition $e_{\tau(i)}$ was drawn from $\mu(s, a)$. Thus, each individual cell in the buffer marginally follows $\mu$.

2. By the Law of Total Probability:
$$\mathbb{P}(e_J = (s, a)) = \sum_{i=0}^{N-1} \mathbb{P}(J = i) \mathbb{P}(e_i = (s, a) \mid J = i) = \sum_{i=0}^{N-1} \frac{1}{N} \mu(s, a) = \mu(s, a) \sum_{i=0}^{N-1} \frac{1}{N} = \mu(s, a)$$
The uniform mixture of marginally identical distributions is identical to that marginal distribution.

3. If policy $\pi$ is continuously changing, the replay buffer does **not** make the data distribution stationary with respect to current policy $\pi_t$. Instead, the buffer stores an empirical mixture distribution over past policies:
$$p_{\mathcal{D}}(s, a) = \frac{1}{N} \sum_{k=t-N}^{t-1} d^{\pi_k}(s) \pi_k(a \mid s)$$
This is an off-policy distribution! However, because Q-learning is an off-policy algorithm that targets $Q^*$, it can theoretically learn from any distribution $p_{\mathcal{D}}$ that has adequate exploration coverage ($\forall (s, a), p_{\mathcal{D}}(s, a) > 0$). The buffer smooths out rapid policy shifts into a slowly drifting historical distribution.

---

### Exercise 4.6: Replay Ratio and Overfitting Bounds
**Problem:** Define the **Replay Ratio** (RR) as the number of gradient update samples divided by the number of environment interaction steps:
$$\text{RR} = \frac{\text{Gradient Steps} \times \text{Batch Size } B}{\text{Environment Steps}}$$
In DQN: 1 gradient step of batch size $B=32$ is performed every 4 environment steps.
1. Calculate the Replay Ratio for DQN.
2. In recent sample-efficient algorithms (e.g., Continuous Rainbow, SR-DQN), researchers use $\text{RR} = 8$ or $\text{RR} = 16$. Calculate the number of gradient steps per environment step for $\text{RR} = 8$ with batch size $B = 64$.
3. What pathology occurs if the Replay Ratio is set too high (e.g., $\text{RR} = 128$) when the buffer size is small?

**Solution:**
1. For DQN:
$$\text{RR}_{\text{DQN}} = \frac{1 \text{ gradient step} \times 32 \text{ transitions}}{4 \text{ environment steps}} = \frac{32}{4} = 8 \text{ updates per transition generated}$$
Note: In terms of batches per step: $\frac{1}{4} = 0.25$ updates/step. In terms of sample reuse ratio: $8.0$.

2. For $\text{RR} = 8$ with $B = 64$:
$$\text{Updates per step } U = \frac{\text{RR}}{B} = \frac{8}{64} = 0.125 \text{ (1 gradient step every 8 environment steps)}$$
Alternatively, if Replay Ratio is defined as updates per env step: $U = 8 \implies 8 \times 64 = 512$ samples per env step.

3. If Replay Ratio is excessively high on a small buffer:
- **Catastrophic Overfitting:** The neural network repeatedly fits the exact same small set of transitions, memorizing their specific noise and losing generalization to unvisited states.
- **Loss of Plasticity:** As demonstrated by Lyle et al. (2023), high replay ratios cause deep neural network feature representations to collapse into a low-rank subspace (representation rank collapse), rendering the network incapable of learning new behaviors when novel states are discovered.

---

### Exercise 4.7: Target Network Divergence Without Replay Buffer
**Problem:** Suppose an agent uses a target network with hard sync period $C = 1,000$, but does **not** use an experience replay buffer (it updates purely on consecutive online transitions $(s_t, a_t, r_t, s_{t+1})$).
Explain why the agent can still suffer from catastrophic forgetting and divergence, even though the target network is frozen.

**Solution:**
Even with a frozen target network $\boldsymbol{\theta}^-$, updating on consecutive online transitions violates the i.i.d. assumption:
1. **Locality of Trajectories:** During a period of $C = 1,000$ steps, an agent may spend 500 consecutive steps trapped in a specific visual corner of an Atari game.
2. **Representational Drift:** Performing 500 consecutive SGD updates on virtually identical input states shifts the convolutional weights $\boldsymbol{\theta}$ to minimize loss purely on that visual subspace.
3. **Catastrophic Forgetting:** Because deep neural networks lack tabular isolation, updating weights to fit the current corner overwrites the weights that predicted correct values for the rest of the game.
4. When the hard sync step arrives ($t = C$), the corrupted online parameters $\boldsymbol{\theta}$ are copied into the target network: $\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$. The target network itself is now corrupted, locking in the catastrophic forgetting for the next $C$ steps. Both pillars (Experience Replay AND Target Networks) are strictly necessary; neither suffices alone.

---

### Exercise 4.8: Multi-Step Bootstrapping ($n$-Step Returns) in Replay Buffers
**Problem:** An $n$-step transition tuple is defined as:
$$e_t^{(n)} = \left( s_t, a_t, R_{t:t+n}, s_{t+n}, d_{t+n} \right)$$
where $R_{t:t+n} = \sum_{k=0}^{n-1} \gamma^k r_{t+k+1}$.
Suppose $n = 3$, $\gamma = 0.9$, and an agent experiences rewards $r_1 = 1, r_2 = 0, r_3 = 5$, transitioning $s_0 \to s_1 \to s_2 \to s_3$ without terminating.
1. Calculate the accumulated 3-step discounted reward $R_{0:3}$.
2. Write the Bellman target for $Q(s_0, a_0; \boldsymbol{\theta})$ using target network $\boldsymbol{\theta}^-$.
3. Discuss the trade-off in choosing $n$: how does $n > 1$ affect bias and variance?

**Solution:**
1. Accumulated 3-step reward:
$$R_{0:3} = r_1 + \gamma r_2 + \gamma^2 r_3 = 1 + 0.9(0) + (0.9)^2(5) = 1 + 0 + 0.81 \times 5 = 1 + 4.05 = 5.05$$

2. Bellman target:
$$y^{(3)} = R_{0:3} + \gamma^3 \max_{a'} Q(s_3, a'; \boldsymbol{\theta}^-) = 5.05 + (0.9)^3 \max_{a'} Q(s_3, a'; \boldsymbol{\theta}^-) = 5.05 + 0.729 \max_{a'} Q(s_3, a'; \boldsymbol{\theta}^-)$$

3. Bias-Variance Trade-off:
- **Smaller $n$ ($n=1$):** Heavily relies on the bootstrapped estimate $Q(s_{t+1}, a')$. High bias (if the neural network value estimates are inaccurate), but low variance (since rewards over 1 step are less variable).
- **Larger $n$ ($n \to \infty$):** Approaches pure Monte Carlo returns. Zero bootstrapping bias, but high variance due to the accumulation of stochastic transitions and actions along the trajectory.
- In practice, $n = 3$ (used in Rainbow DQN) provides the empirical sweet spot, dramatically accelerating reward propagation while keeping variance manageable.

---

### Exercise 4.9: Gradient Norm Bounds Under Huber vs Smooth L1
**Problem:** PyTorch and TensorFlow define `SmoothL1Loss` with parameter $\beta$:
$$\ell_\beta(\delta) = \begin{cases}
\frac{0.5 \delta^2}{\beta} & \text{if } |\delta| < \beta \\
|\delta| - 0.5 \beta & \text{otherwise}
\end{cases}$$
1. Verify that for $\beta = 1.0$, this matches the canonical Huber loss with $\kappa = 1.0$.
2. Compute the derivative $\frac{d\ell_\beta}{d\delta}$ for $|\delta| < \beta$ and $|\delta| \ge \beta$.
3. What is the supremum of the gradient magnitude: $\sup_{\delta \in \mathbb{R}} \left|\frac{d\ell_\beta}{d\delta}\right|$?

**Solution:**
1. Substituting $\beta = 1.0$:
- For $|\delta| < 1.0$: $\frac{0.5 \delta^2}{1.0} = \frac{1}{2}\delta^2$.
- For $|\delta| \ge 1.0$: $|\delta| - 0.5(1.0) = |\delta| - 0.5$.
This is identical to the canonical Huber loss with $\kappa = 1.0$.

2. Derivatives:
- For $|\delta| < \beta$:
  $$\frac{d\ell_\beta}{d\delta} = \frac{d}{d\delta}\left(\frac{\delta^2}{2\beta}\right) = \frac{\delta}{\beta}$$
- For $|\delta| \ge \beta$:
  $$\frac{d\ell_\beta}{d\delta} = \frac{d}{d\delta}(|\delta| - 0.5\beta) = \text{sign}(\delta)$$

3. Supremum:
For $|\delta| < \beta$, $\left|\frac{\delta}{\beta}\right| < 1.0$.
For $|\delta| \ge \beta$, $|\text{sign}(\delta)| = 1.0$.
Thus:
$$\sup_{\delta \in \mathbb{R}} \left|\frac{d\ell_\beta}{d\delta}\right| = 1.0$$
The gradient magnitude is strictly bounded by $1.0$ regardless of $\beta$ or the scale of $\delta$.

---

### Exercise 4.10: Complete Target Network Manager Implementation in TypeScript
**Problem:** Write a production-ready TypeScript class `TargetNetworkManager` that wraps two identical models (an online model and a target model) and implements both:
1. Hard periodic synchronization every $C$ steps.
2. Soft Polyak averaging with rate $\tau$.
3. Methods to compute the Bellman target with terminal state masking and Huber loss gradient scaling.

**Solution:**
```typescript
export interface LinearModel {
  weights: number[];
  bias: number;
  forward(x: number[]): number;
}

export class TargetNetworkManager {
  public stepCount: number = 0;

  constructor(
    public onlineWeights: number[],
    public onlineBias: number,
    public targetWeights: number[],
    public targetBias: number,
    public readonly hardSyncInterval: number = 1000,
    public readonly tau: number = 0.005
  ) {
    this.syncHard(); // initialize target = online
  }

  // Hard periodic synchronization
  syncHard(): void {
    for (let i = 0; i < this.onlineWeights.length; i++) {
      this.targetWeights[i] = this.onlineWeights[i];
    }
    this.targetBias = this.onlineBias;
  }

  // Soft Polyak exponential moving average
  syncSoft(): void {
    for (let i = 0; i < this.onlineWeights.length; i++) {
      this.targetWeights[i] = this.tau * this.onlineWeights[i] + (1 - this.tau) * this.targetWeights[i];
    }
    this.targetBias = this.tau * this.onlineBias + (1 - this.tau) * this.targetBias;
  }

  // Update step
  onStep(mode: 'hard' | 'soft'): void {
    this.stepCount++;
    if (mode === 'hard') {
      if (this.stepCount % this.hardSyncInterval === 0) {
        this.syncHard();
      }
    } else {
      this.syncSoft();
    }
  }

  // Compute Bellman Target: y = r + gamma * (1 - done) * maxQ_target
  computeTarget(reward: number, maxNextTargetQ: number, done: boolean, gamma: number = 0.99): number {
    return reward + gamma * (done ? 0 : 1) * maxNextTargetQ;
  }

  // Compute Huber loss derivative: dL/d_delta = clip(delta, -1, 1)
  computeHuberGrad(tdError: number, kappa: number = 1.0): number {
    if (Math.abs(tdError) <= kappa) {
      return tdError;
    }
    return kappa * Math.sign(tdError);
  }
}
```

Verification Test:
```typescript
const mgr = new TargetNetworkManager([1.0, 2.0], 0.5, [0, 0], 0, 2, 0.1);
console.log("Target initialized:", mgr.targetWeights); // [1.0, 2.0]

// Shift online weights
mgr.onlineWeights = [2.0, 4.0];
mgr.onStep('soft'); // tau = 0.1
console.log("After soft sync:", mgr.targetWeights); // [0.1*2 + 0.9*1 = 1.1, 0.1*4 + 0.9*2 = 2.2]

// Check Bellman target with done = true
const targetDone = mgr.computeTarget(10.0, 50.0, true, 0.99);
console.log("Target (done=true):", targetDone); // 10.0

// Check Huber grad for large outlier error
const grad = mgr.computeHuberGrad(42.0);
console.log("Huber grad for error 42.0:", grad); // 1.0
```


# Chapter 5: Advanced Value-Based Architectures: Double DQN, Dueling DQN, and Prioritized Replay

---

## 5.1 Maximization Bias and the Overestimation Phenomenon

In the preceding chapters, we examined the foundational mechanics of Deep Q-Networks (DQN). While DQN achieved superhuman performance across classic video games, deeper empirical and theoretical scrutiny revealed a pernicious vulnerability inherent to Q-learning: **systematic value overestimation**.

Recall the standard Q-learning target:
$$Y^{\text{Target}} = R_{t+1} + \gamma \max_{a' \in \mathcal{A}} Q(S_{t+1}, a'; \boldsymbol{\theta})$$

The maximization operator $\max_{a'} Q(S_{t+1}, a')$ uses the same parameter vector $\boldsymbol{\theta}$ to **select** the greedy action and to **evaluate** the value of that action.

```
                      THE MAXIMIZATION BIAS MECHANISM
                      
   True Values Q*(s, a)              Noisy Estimates Q(s, a; Î¸) = Q* + Îµ
   
   Action 1: [ 10.0 ]                Action 1: [ 10.0 + 1.5 = 11.5 ]  â—„â”€â”€ max picks this!
   Action 2: [ 10.0 ]                Action 2: [ 10.0 - 0.8 =  9.2 ]
   Action 3: [ 10.0 ]                Action 3: [ 10.0 + 0.3 = 10.3 ]
   Action 4: [ 10.0 ]                Action 4: [ 10.0 - 1.2 =  8.8 ]
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€                 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   max_a Q*(s, a) = 10.0             max_a Q(s, a; Î¸) = 11.5  (Overestimation = +1.5)
```

### Jensen's Inequality and the Convexity of the Max Operator
Let $X_1, X_2, \dots, X_m$ be a collection of independent random variables representing noisy, unbiased value estimates of actions $a_1, \dots, a_m$, where:
$$\mathbb{E}[X_i] = \mu_i$$
We wish to evaluate the expectation of the maximum estimate, $\mathbb{E}\left[\max_{i \in \{1,\dots,m\}} X_i\right]$, compared to the maximum of the true expectations, $\max_{i \in \{1,\dots,m\}} \mathbb{E}[X_i]$.

The maximum function $f(\mathbf{x}) = \max(x_1, \dots, x_m)$ is a **convex function** on $\mathbb{R}^m$. By **Jensen's Inequality**, for any convex function $f$ and random vector $\mathbf{X}$:
$$\mathbb{E}[f(\mathbf{X})] \ge f(\mathbb{E}[\mathbf{X}])$$

Applying Jensen's Inequality directly to the maximum operator:
$$\mathbb{E}\left[\max_{i \in \{1,\dots,m\}} X_i\right] \ge \max_{i \in \{1,\dots,m\}} \mathbb{E}[X_i]$$

This mathematical inequality establishes an immutable truth: **the expected value of the maximum of noisy estimates is strictly greater than or equal to the maximum of their true expected values**.

### Propagation of Overestimation Error
In supervised learning, symmetric zero-mean prediction noise $\epsilon \sim \mathcal{N}(0, \sigma^2)$ cancels out across training iterations. In Q-learning, the maximization operator acts as a non-linear rectifier that systematically captures positive noise spikes ($\epsilon > 0$) while discarding negative noise spikes ($\epsilon < 0$).

When this overestimated target is bootstrapped back into the network parameters:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \left( R + \gamma \max_{a'} Q(S', a'; \boldsymbol{\theta}^-) - Q(S, a; \boldsymbol{\theta}) \right) \nabla_{\boldsymbol{\theta}} Q(S, a; \boldsymbol{\theta})$$
the overestimation is not self-correctingâ€”it compounds recursively across Bellman updates:
$$Q_k \to Q^* + \Delta_k \implies Q_{k+1} \approx Q^* + \gamma \Delta_k + \text{bias}$$
In environments with large action spaces or high noise (such as Atari *Asterix* or *Wizard of Wor*), DQN's estimated Q-values routinely inflate by $200\%$ to $1000\%$ above the true optimal discounted returns, destabilizing policy learning.

---

## 5.2 Double DQN: Decoupling Selection from Evaluation

To eliminate maximization bias, van Hasselt et al. (2015) introduced **Double Deep Q-Networks (Double DQN)**, adapting the tabular Double Q-learning principle of van Hasselt (2010) to deep neural function approximation.

### The Decoupling Principle
The core architectural insight of Double Q-learning is to decouple the **action selection** step from the **action evaluation** step using two independent parameter sets:
1. One network selects the best action: $a^* = \arg\max_a Q(s', a; \boldsymbol{\theta})$.
2. A separate network evaluates the value of that selected action: $Q(s', a^*; \boldsymbol{\theta}')$.

In tabular Double Q-learning, this required training two separate value functions $Q_A$ and $Q_B$ and randomly alternating updates between them.
In Deep RL, maintaining and training two distinct deep convolutional networks would double the computational and memory overhead.

van Hasselt et al. recognized that DQN *already possesses two sets of parameters*:
- The **online network parameters** $\boldsymbol{\theta}_t$.
- The **target network parameters** $\boldsymbol{\theta}_t^-$.

```
                   DQN VS DOUBLE DQN TARGET MECHANISMS
                   
   CANONICAL NATURE DQN:
   Target = r + Î³ Â· Q( s', argmax_{a'} Q(s', a'; Î¸^-) ; Î¸^- )
                      â–²                                 â–²
                      â””â”€â”€â”€â”€â”€â”€â”€â”€ Target Network â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      (Selection AND Evaluation coupled in Î¸^-)
   
   DOUBLE DQN:
   Target = r + Î³ Â· Q( s', argmax_{a'} Q(s', a'; Î¸_t) ; Î¸_t^- )
                      â–²                           â–²       â–²
                      â”‚                           â”‚       Target Network (Evaluation)
                      â”‚                           Online Network (Selection)
                      Action Selection Decoupled!
```

### The Double DQN Target Equation
In Double DQN, the target is formally defined as:
$$Y_t^{\text{DoubleQ}} = R_{t+1} + \gamma (1 - d_{t+1}) Q\left( S_{t+1}, \arg\max_{a' \in \mathcal{A}} Q(S_{t+1}, a'; \boldsymbol{\theta}_t); \boldsymbol{\theta}_t^- \right)$$

Let us analyze this step by step:
1. **Selection:** The online network $\boldsymbol{\theta}_t$ determines which action it *believes* is best at the next state:
$$a_{\text{selected}} = \arg\max_{a' \in \mathcal{A}} Q(S_{t+1}, a'; \boldsymbol{\theta}_t)$$
2. **Evaluation:** The target network $\boldsymbol{\theta}_t^-$ computes the value of that specific selected action:
$$\text{Evaluated Value} = Q(S_{t+1}, a_{\text{selected}}; \boldsymbol{\theta}_t^-)$$

Because the noise in the online network $\boldsymbol{\theta}_t$ is conditionally independent of the noise in the target network $\boldsymbol{\theta}_t^-$, an action that was selected due to an abnormally high positive noise fluctuation in $\boldsymbol{\theta}_t$ will not be systematically over-valued by $\boldsymbol{\theta}_t^-$. 

Double DQN requires **zero additional parameters** and **zero additional network passes during training** (since $Q(S_{t+1}, \cdot; \boldsymbol{\theta}_t)$ can be computed during the online forward pass). It completely eliminates value explosion across all 49 Atari games, leading to substantially improved game scores and more stable policy convergence.

---

## 5.3 Dueling Network Architectures: Decomposing Value and Advantage

In standard Q-networks, the neural network directly predicts a scalar $Q(s, a; \boldsymbol{\theta})$ for each action $a \in \mathcal{A}$. However, in many states, the choice of action is virtually irrelevant to the long-term survival of the agent.

For example, in an autonomous driving simulation on a clear open highway, whether the car turns $0.1^\circ$ left or $0.1^\circ$ right makes almost no difference to the expected return; the state itself is overwhelmingly valuable ($V(s) \approx 100$). Conversely, when a collision is imminent at the next millisecond, the action chosen (e.g., slamming the emergency brakes vs continuing forward) is of critical importance.

To exploit this physical reality, Wang et al. (2016) proposed the **Dueling Network Architecture**.

```
                         DUELING NETWORK ARCHITECTURE
                         
                             Input State s (84x84x4)
                                        â”‚
                                        â–¼
                             Convolutional Encoder
                                  (Shared Ï•)
                                        â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â–¼                                       â–¼
             Value Stream                           Advantage Stream
            FC Layers (512)                         FC Layers (512)
                    â”‚                                       â”‚
                    â–¼                                       â–¼
            Scalar Value V(s; Î±)                 Advantage Vector A(s, a; Î²)
             Dimension: 1x1                           Dimension: 1x|A|
                    â”‚                                       â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                        â”‚
                                        â–¼ Aggregation Layer
                     Q(s, a; Î±, Î²) = V(s; Î±) + [ A(s, a; Î²) - (1/|A|) âˆ‘ A(s, a'; Î²) ]
                                        â”‚
                                        â–¼
                                 Q-Values for all a
```

### The Value-Advantage Decomposition
Recall the definition of the Advantage function $A^\pi(s, a)$:
$$A^\pi(s, a) = Q^\pi(s, a) - V^\pi(s)$$
where:
$$V^\pi(s) = \mathbb{E}_{a \sim \pi}[Q^\pi(s, a)]$$
Rearranging gives:
$$Q^\pi(s, a) = V^\pi(s) + A^\pi(s, a)$$

Notice an important structural property: by definition, under the optimal policy $\pi^*$, the value of the best action satisfies $\max_{a'} Q^*(s, a') = V^*(s)$. Consequently:
$$\max_{a' \in \mathcal{A}} A^*(s, a') = 0$$

### The Unidentifiability Problem
If a neural network simply outputs a scalar $V(s; \alpha)$ and a vector $A(s, a; \beta)$, and combines them via naive addition:
$$Q(s, a; \alpha, \beta) = V(s; \alpha) + A(s, a; \beta)$$
the system is **mathematically unidentifiable**. 
Given any value of $Q(s, a)$, one could add an arbitrary constant $c$ to $V(s)$ and subtract $c$ from all $A(s, a)$ without changing the predicted $Q(s, a)$:
$$(V(s) + c) + (A(s, a) - c) = V(s) + A(s, a) = Q(s, a)$$
Because infinitely many combinations of $(\alpha, \beta)$ produce the identical Q-values, the optimizer cannot discern whether an error should update the state-value stream $V$ or the action-advantage stream $A$, causing severe gradient instability.

### Identifiability Formulations
To resolve unidentifiability, Wang et al. proposed two constraints:

#### 1. Max-Subtracted Formulation
Force the maximum advantage to be exactly zero:
$$Q(s, a; \alpha, \beta) = V(s; \alpha) + \left( A(s, a; \beta) - \max_{a' \in \mathcal{A}} A(s, a'; \beta) \right)$$
Under this formulation, for the greedy action $a^* = \arg\max_{a'} A(s, a')$, the advantage term equals $0$, ensuring:
$$Q(s, a^*; \alpha, \beta) = V(s; \alpha)$$
$V(s; \alpha)$ is forced to track the true state-value function directly.

#### 2. Mean-Subtracted Formulation (Preferred in Practice)
While the max-operator provides an exact theoretical grounding, in practice it relies on an $\arg\max$, which can introduce non-smooth gradients. Replacing the max with the **sample mean** stabilizes backpropagation:
$$Q(s, a; \alpha, \beta) = V(s; \alpha) + \left( A(s, a; \beta) - \frac{1}{|\mathcal{A}|} \sum_{a' \in \mathcal{A}} A(s, a'; \beta) \right)$$

Under this mean-subtracted aggregation:
- The advantage stream is zero-mean: $\sum_{a} \left( A(s, a) - \frac{1}{|\mathcal{A}|}\sum_{a'} A(s, a') \right) = 0$.
- Updating $Q(s, a)$ propagates a gradient of $\frac{\partial Q}{\partial V} = 1$ to the value stream for *every* action observed. The value stream learns state values rapidly across all actions, dramatically accelerating learning in states where action choice is benign.

---

## 5.4 Prioritized Experience Replay (PER)

In standard Experience Replay, transitions are sampled **uniformly at random** from the buffer:
$$P(i) = \frac{1}{N}$$

However, not all transitions are created equal. An agent playing Atari may spend millions of frames in repetitive, uneventful corridors where the TD error $\delta \approx 0$. Meanwhile, rare, game-changing eventsâ€”such as discovering a key, losing a life, or completing a levelâ€”generate massive TD errors ($|\delta| \gg 0$). 

Uniform sampling wastes the vast majority of computation performing gradient steps on already mastered, zero-error transitions. Schaul et al. (2015) introduced **Prioritized Experience Replay (PER)** to prioritize sampling transitions from which the agent has the most to learn.

```
                      PRIORITIZED SAMPLING VS UNIFORM
                      
   Uniform Replay:            [ e_1 ] [ e_2 ] [ e_3 ] [ e_4 ] [ e_5 ]  (All prob = 1/N)
   
   Prioritized Replay:        [ e_1 ] [ e_2 ] [ e_3 ] [ e_4 ] [ e_5 ]
   Priority p_i = |Î´_i|^Î±:     0.01    14.2    0.02    0.00    8.91
   Sampling Prob P(i):         0.0%   61.3%    0.1%    0.0%   38.5%
                              (High-error transitions sampled frequently!)
```

### 1. Priority Formulations
The priority $p_i$ of transition $i$ is proportional to the magnitude of its most recently observed Temporal Difference error $\delta_i$:
$$p_i = |\delta_i| + \epsilon$$
where $\epsilon > 0$ is a small positive constant (e.g., $10^{-6}$) ensuring that transitions with zero TD error retain a non-zero probability of being visited again.

To balance greedy prioritization with stochastic exploration, the probability of sampling transition $i$ is governed by exponent $\alpha \in [0, 1]$:
$$P(i) = \frac{p_i^\alpha}{\sum_{k=1}^N p_k^\alpha}$$
- When $\alpha = 0$, $P(i) = \frac{1}{N}$, recovering standard uniform sampling.
- When $\alpha = 1$, sampling is purely proportional to TD error magnitude.

### 2. Correcting Sampling Bias: Importance Sampling Weights
Prioritizing transitions fundamentally changes the data distribution: transitions with high TD error are sampled far more frequently than their natural stationary frequency under policy $\pi$.
This introduces **sampling bias**, skewing the loss expectation and causing the network to overfit to rare outlier states.

To correct for this distortion, Schaul et al. derived **Importance Sampling (IS) weights**:
$$w_i = \left( \frac{1}{N} \cdot \frac{1}{P(i)} \right)^\beta$$
where $\beta \in [0, 1]$ controls the degree of bias compensation:
- When $\beta = 0$, $w_i = 1$ (no bias correction).
- When $\beta = 1$, $w_i = \frac{1}{N P(i)}$, providing full mathematical correction for the non-uniform sampling distribution.

In practice, $\beta$ is annealed linearly from an initial value $\beta_0 \approx 0.4$ up to $1.0$ at the end of training:
$$\beta_t = \min\left(1.0, \beta_0 + t \cdot \frac{1.0 - \beta_0}{T_{\text{max}}}\right)$$

To ensure numerical stability in gradient updates, the weights are normalized by the maximum weight in the mini-batch:
$$\tilde{w}_i = \frac{w_i}{\max_{j \in \mathcal{B}} w_j} = \left( \frac{\min_{j \in \mathcal{B}} P(j)}{P(i)} \right)^\beta \in (0, 1]$$

The weighted gradient descent update becomes:
$$\Delta \boldsymbol{\theta} = \alpha \sum_{i \in \mathcal{B}} \tilde{w}_i \cdot \delta_i \cdot \nabla_{\boldsymbol{\theta}} Q(S_i, A_i; \boldsymbol{\theta})$$

---

## 5.5 Efficient Implementation: The Sum-Tree Data Structure

Naively calculating $P(i) = \frac{p_i^\alpha}{\sum_k p_k^\alpha}$ over a buffer of $N = 1,000,000$ items would require:
- Storing priorities in an array.
- Sampling via linear search: $\mathcal{O}(N)$ time per sample.
- Updating priorities after each gradient step: $\mathcal{O}(B)$ time.

With batch size $B = 32$, an $\mathcal{O}(BN)$ sampling loop would execute $32 \times 1,000,000 = 3.2 \times 10^7$ operations per step, completely choking the training pipeline.

To achieve real-time sampling and updating, PER utilizes a **Sum-Tree** (a complete binary tree).

```
                            SUM-TREE ARCHITECTURE (Capacity N = 4)
                            
                                   [ Node 1: 42 ]   (Root: Total Priority = 42)
                                   /            \
                                  /              \
                     [ Node 2: 29 ]              [ Node 3: 13 ]
                     /          \                /          \
                    /            \              /            \
             [ Leaf 4: 12 ] [ Leaf 5: 17 ] [ Leaf 6: 3 ] [ Leaf 7: 10 ]
             (Transition 0) (Transition 1) (Transition 2) (Transition 3)
```

### Sum-Tree Properties
1. **Structure:** A complete binary tree stored compactly in a 1D flat array of size $2N - 1$:
   - For any node at index $k$ (1-indexed):
     - Parent index: $\lfloor k / 2 \rfloor$
     - Left child index: $2k$
     - Right child index: $2k + 1$
   - Leaves are located at indices from $N$ to $2N - 1$.
2. **Invariant:** Every parent node stores the sum of its two children:
$$\text{tree}[k] = \text{tree}[2k] + \text{tree}[2k + 1]$$
The root node at index $1$ always holds the exact **total sum of all priorities in the buffer**:
$$\text{tree}[1] = \sum_{i=1}^N p_i$$

### Stratified Sampling in $\mathcal{O}(\log N)$
To sample a mini-batch of size $B$:
1. Divide the total priority interval $[0, \text{tree}[1])$ into $B$ equal-mass strata:
$$I_k = \left[ k \cdot \frac{\text{tree}[1]}{B}, (k+1) \cdot \frac{\text{tree}[1]}{B} \right) \quad \text{for } k \in \{0, \dots, B-1\}$$
2. Uniformly sample a random value $v_k \sim \mathcal{U}(I_k)$ within each stratum.
3. Retrieve the corresponding leaf node by traversing down the tree from the root in $\mathcal{O}(\log N)$ steps:
   - At current node $k$:
     - If $v < \text{tree}[2k]$, descend left: $k \leftarrow 2k$.
     - If $v \ge \text{tree}[2k]$, descend right: $v \leftarrow v - \text{tree}[2k]$, and $k \leftarrow 2k + 1$.
4. When a leaf is reached, return its transition and priority.

### Updating Priorities in $\mathcal{O}(\log N)$
When a transition's TD error changes from $p_{\text{old}}$ to $p_{\text{new}}$:
1. Compute the delta: $\Delta = p_{\text{new}} - p_{\text{old}}$.
2. Update the leaf: $\text{tree}[\text{leafIdx}] \mathrel{+}= \Delta$.
3. Propagate the delta up to the root:
```
while (k > 1):
    k = floor(k / 2)
    tree[k] += Î”
```
Both sampling and updating execute in strictly $\mathcal{O}(B \log N)$ time. For $N = 1,000,000$, $\log_2(10^6) \approx 20$ operations per sample, running in sub-millisecond execution time.

---

## 5.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 5.1: Mathematical Proof of Maximization Bias Under Uniform Noise
**Problem:** Let $Q^*(s, a_1) = Q^*(s, a_2) = 0$ be the true values of two actions. Suppose our noisy estimates are $Q(s, a_1) = \epsilon_1$ and $Q(s, a_2) = \epsilon_2$, where $\epsilon_1, \epsilon_2 \overset{\text{i.i.d.}}{\sim} \mathcal{U}[-c, c]$ for $c > 0$.
1. Compute the true maximum value $\max_{a} Q^*(s, a)$.
2. Derive the cumulative distribution function (CDF) and probability density function (PDF) of $M = \max(\epsilon_1, \epsilon_2)$.
3. Compute the expected value $\mathbb{E}[M]$ and determine the exact magnitude of the maximization bias.

**Solution:**
1. The true maximum value is:
$$\max(Q^*(s, a_1), Q^*(s, a_2)) = \max(0, 0) = 0$$

2. For $\epsilon \sim \mathcal{U}[-c, c]$, the CDF of each variable is:
$$F_\epsilon(x) = \mathbb{P}(\epsilon \le x) = \frac{x - (-c)}{c - (-c)} = \frac{x + c}{2c} \quad \text{for } x \in [-c, c]$$
Since $\epsilon_1, \epsilon_2$ are independent:
$$F_M(x) = \mathbb{P}(\max(\epsilon_1, \epsilon_2) \le x) = \mathbb{P}(\epsilon_1 \le x \text{ and } \epsilon_2 \le x) = F_\epsilon(x)^2 = \left( \frac{x + c}{2c} \right)^2$$
The PDF is obtained by differentiating $F_M(x)$:
$$f_M(x) = \frac{d}{dx} \left[ \frac{(x + c)^2}{4c^2} \right] = \frac{2(x + c)}{4c^2} = \frac{x + c}{2c^2} \quad \text{for } x \in [-c, c]$$

3. Compute the expected value:
$$\mathbb{E}[M] = \int_{-c}^c x f_M(x) dx = \int_{-c}^c x \left( \frac{x + c}{2c^2} \right) dx = \frac{1}{2c^2} \int_{-c}^c (x^2 + cx) dx$$
Evaluating the integral:
$$\int_{-c}^c x^2 dx = \left[ \frac{x^3}{3} \right]_{-c}^c = \frac{c^3}{3} - \left(-\frac{c^3}{3}\right) = \frac{2c^3}{3}$$
$$\int_{-c}^c cx dx = 0 \quad (\text{odd function over symmetric interval})$$
Thus:
$$\mathbb{E}[M] = \frac{1}{2c^2} \left( \frac{2c^3}{3} \right) = \frac{c}{3}$$
The maximization bias is:
$$\text{Bias} = \mathbb{E}[M] - \max_a Q^*(s, a) = \frac{c}{3} - 0 = +\frac{c}{3} > 0$$
Even though the noise is completely symmetric and zero-mean ($\mathbb{E}[\epsilon] = 0$), the maximum is strictly positive, biased upward by $\frac{c}{3}$.

---

### Worked Example 5.2: Step-by-Step DQN vs Double DQN Target Calculation
**Problem:** An agent encounters transition $(s, a=1, r=+2.0, s', d=\text{false})$ with discount $\gamma = 0.90$.
The environment has three discrete actions: $\mathcal{A} = \{0, 1, 2\}$.
The network predictions at next state $s'$ are:
- Online Network: $Q(s', \cdot; \boldsymbol{\theta}_t) = [4.2, 5.8, 3.1]$
- Target Network: $Q(s', \cdot; \boldsymbol{\theta}_t^-) = [5.1, 3.4, 4.9]$
1. Compute the standard DQN target $Y^{\text{DQN}}$.
2. Compute the Double DQN target $Y^{\text{DoubleDQN}}$.
3. Explain which action was selected by Double DQN and why the target is smaller.

**Solution:**
1. Standard DQN Target:
DQN uses the target network $\boldsymbol{\theta}^-$ for both selection and evaluation:
$$a^*_{\text{DQN}} = \arg\max_{a'} Q(s', a'; \boldsymbol{\theta}_t^-) = \arg\max(5.1, 3.4, 4.9) = 0$$
$$Y^{\text{DQN}} = r + \gamma \max_{a'} Q(s', a'; \boldsymbol{\theta}_t^-) = 2.0 + 0.90 \times 5.1 = 2.0 + 4.59 = 6.59$$

2. Double DQN Target:
Double DQN uses the online network $\boldsymbol{\theta}_t$ for action selection:
$$a^*_{\text{DoubleDQN}} = \arg\max_{a'} Q(s', a'; \boldsymbol{\theta}_t) = \arg\max(4.2, 5.8, 3.1) = 1$$
It then evaluates action $1$ using the target network $\boldsymbol{\theta}_t^-$:
$$Q(s', a=1; \boldsymbol{\theta}_t^-) = 3.4$$
$$Y^{\text{DoubleDQN}} = r + \gamma Q(s', a^*_{\text{DoubleDQN}}; \boldsymbol{\theta}_t^-) = 2.0 + 0.90 \times 3.4 = 2.0 + 3.06 = 5.06$$

3. Analysis:
The online network selected Action 1 (where its estimate was $5.8$). However, the target network evaluated Action 1 at only $3.4$. As a result, the Double DQN target ($5.06$) avoided the inflated target of DQN ($6.59$), neutralizing the overestimation bias by $1.53$ units.

---

### Worked Example 5.3: Dueling Architecture Forward Pass and Gradient Backpropagation
**Problem:** A Dueling Q-Network processes state $s$ with 3 actions.
The network produces:
- Scalar Value stream: $V(s) = 12.0$
- Advantage stream: $A(s, \cdot) = [2.0, -1.0, 5.0]$
1. Compute the mean advantage $\bar{A}(s) = \frac{1}{3}\sum_{i=1}^3 A(s, a_i)$.
2. Compute the Q-values $Q(s, a)$ for all three actions using the mean-subtracted formula.
3. If the loss gradient arriving at the Q-outputs is $\nabla_Q \mathcal{L} = [\frac{\partial \mathcal{L}}{\partial Q_0}, \frac{\partial \mathcal{L}}{\partial Q_1}, \frac{\partial \mathcal{L}}{\partial Q_2}] = [0.4, -0.2, 0.1]$, compute the backpropagated gradient into the value scalar $\frac{\partial \mathcal{L}}{\partial V}$.

**Solution:**
1. Mean advantage:
$$\bar{A}(s) = \frac{2.0 + (-1.0) + 5.0}{3} = \frac{6.0}{3} = 2.0$$

2. Q-value calculations:
Formula: $Q(s, a) = V(s) + (A(s, a) - \bar{A}(s))$:
- $Q(s, 0) = 12.0 + (2.0 - 2.0) = 12.0 + 0.0 = 12.0$
- $Q(s, 1) = 12.0 + (-1.0 - 2.0) = 12.0 - 3.0 = 9.0$
- $Q(s, 2) = 12.0 + (5.0 - 2.0) = 12.0 + 3.0 = 15.0$
Notice that the mean of the advantage offsets is $\frac{0.0 + (-3.0) + 3.0}{3} = 0$, and the mean of $Q$ is $\frac{12 + 9 + 15}{3} = 12.0 = V(s)$.

3. Gradient flow to Value stream:
By multivariate chain rule:
$$\frac{\partial \mathcal{L}}{\partial V} = \sum_{a=0}^2 \frac{\partial \mathcal{L}}{\partial Q_a} \frac{\partial Q_a}{\partial V}$$
Since $Q(s, a) = V + A_a - \frac{1}{|\mathcal{A}|}\sum_{k} A_k$, we have $\frac{\partial Q_a}{\partial V} = 1$ for all $a$.
$$\frac{\partial \mathcal{L}}{\partial V} = \sum_{a=0}^2 \frac{\partial \mathcal{L}}{\partial Q_a} \cdot 1 = 0.4 + (-0.2) + 0.1 = 0.3$$
Every Q-error directly and collectively informs the value stream!

---

### Worked Example 5.4: Sum-Tree Leaf Mapping and Parent Traversal
**Problem:** Consider a Sum-Tree with capacity $N = 4$ transitions. The tree array has size $2N - 1 = 7$.
Leaf nodes correspond to array indices $4, 5, 6, 7$, mapping to transition indices $0, 1, 2, 3$.
Transitions are inserted with priorities: $p_0 = 5, p_1 = 15, p_2 = 10, p_3 = 20$.
1. Populate all entries of the tree array `tree[1..7]`.
2. Trace the exact binary search path when querying target prefix sum $v = 28.5$.
3. If transition 1's priority updates to $p'_1 = 25$, show the propagation path and new array values.

**Solution:**
1. Populating leaves:
- `tree[4] = 5` (transition 0)
- `tree[5] = 15` (transition 1)
- `tree[6] = 10` (transition 2)
- `tree[7] = 20` (transition 3)
Computing internal nodes:
- `tree[2] = tree[4] + tree[5] = 5 + 15 = 20`
- `tree[3] = tree[6] + tree[7] = 10 + 20 = 30`
- `tree[1] = tree[2] + tree[3] = 20 + 30 = 50` (Total Priority)
Full array (1-indexed): `[_, 50, 20, 30, 5, 15, 10, 20]`.

2. Binary search for $v = 28.5$:
- Start at root: index $k = 1$. Left child is $2k = 2$, with value `tree[2] = 20`.
  - Is $v < \text{tree}[2]$? $28.5 < 20$ is FALSE.
  - Descend right: $v \leftarrow v - \text{tree}[2] = 28.5 - 20 = 8.5$.
  - New node: $k \leftarrow 2k + 1 = 3$.
- At node $k = 3$: Left child is $2k = 6$, with value `tree[6] = 10`.
  - Is $v < \text{tree}[6]$? $8.5 < 10$ is TRUE.
  - Descend left: $k \leftarrow 2k = 6$.
- Node $k = 6$ is a leaf!
  - Transition index $= 6 - N = 6 - 4 = 2$ (transition 2).
  - Priority $= \text{tree}[6] = 10$.

3. Updating priority of transition 1 from 15 to 25:
- Delta: $\Delta = 25 - 15 = +10$.
- Leaf index: $k = 1 + N = 1 + 4 = 5$.
  - `tree[5]` becomes $15 + 10 = 25$.
- Parent of 5: $\lfloor 5 / 2 \rfloor = 2$.
  - `tree[2]` becomes $20 + 10 = 30$.
- Parent of 2: $\lfloor 2 / 2 \rfloor = 1$.
  - `tree[1]` becomes $50 + 10 = 60$.
New tree array: `[_, 60, 30, 30, 5, 25, 10, 20]`. Total priority correctly updated to 60 in 3 operations ($\mathcal{O}(\log N)$).

---

### Worked Example 5.5: Importance Sampling Weight Calculation and Normalization
**Problem:** A prioritized replay buffer has $N = 10,000$ transitions.
A mini-batch of 3 transitions is sampled with priorities $p = [2.0, 8.0, 0.5]$ and exponent $\alpha = 1.0$.
The total sum of priorities in the buffer is $\sum_{i=1}^N p_i = 1000.0$.
Let the importance sampling exponent be $\beta = 0.5$.
1. Compute the sampling probability $P(i)$ for each transition.
2. Compute the raw importance sampling weight $w_i = (N \cdot P(i))^{-\beta}$.
3. Compute the normalized importance sampling weights $\tilde{w}_i = \frac{w_i}{\max_j w_j}$.

**Solution:**
1. Sampling probabilities:
$$P(i) = \frac{p_i}{\sum_k p_k} = \frac{p_i}{1000}$$
- $P(1) = \frac{2.0}{1000} = 0.002$
- $P(2) = \frac{8.0}{1000} = 0.008$
- $P(3) = \frac{0.5}{1000} = 0.0005$

2. Raw importance sampling weights $w_i = (N \cdot P(i))^{-0.5} = \frac{1}{\sqrt{N \cdot P(i)}}$:
- Transition 1: $N \cdot P(1) = 10,000 \times 0.002 = 20.0 \implies w_1 = \frac{1}{\sqrt{20}} \approx 0.2236$.
- Transition 2: $N \cdot P(2) = 10,000 \times 0.008 = 80.0 \implies w_2 = \frac{1}{\sqrt{80}} \approx 0.1118$.
- Transition 3: $N \cdot P(3) = 10,000 \times 0.0005 = 5.0 \implies w_3 = \frac{1}{\sqrt{5}} \approx 0.4472$.

3. Normalization:
The maximum weight in the batch is $w_{\max} = w_3 = 0.4472$.
$$\tilde{w}_i = \frac{w_i}{w_{\max}}$$
- $\tilde{w}_1 = \frac{0.2236}{0.4472} = 0.500$
- $\tilde{w}_2 = \frac{0.1118}{0.4472} = 0.250$
- $\tilde{w}_3 = \frac{0.4472}{0.4472} = 1.000$
Notice that Transition 2 (which had the highest priority and was sampled 16 times more frequently than Transition 3) receives the smallest weight ($0.25$), exactly compensating for its over-representation in the gradient update.

---

### Worked Example 5.6: Complete TypeScript Implementation of Sum-Tree
**Problem:** Author a production-ready TypeScript `SumTree` class that implements:
1. Complete binary tree storage in a flat `Float64Array`.
2. $\mathcal{O}(\log N)$ priority updates.
3. $\mathcal{O}(\log N)$ prefix sum queries.
4. Total priority tracking at index 1.

**Solution:**
```typescript
export class SumTree {
  public readonly capacity: number;
  public readonly tree: Float64Array;
  public readonly data: any[];
  private writePtr: number = 0;
  public size: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    // Tree array has size 2 * capacity
    this.tree = new Float64Array(2 * capacity);
    this.data = new Array(capacity).fill(null);
  }

  get totalPriority(): number {
    return this.tree[1];
  }

  // Update a priority at leaf index (0 to capacity - 1)
  update(dataIdx: number, priority: number): void {
    const treeIdx = dataIdx + this.capacity;
    const change = priority - this.tree[treeIdx];
    this.tree[treeIdx] = priority;

    // Propagate change up to root
    let parent = Math.floor(treeIdx / 2);
    while (parent >= 1) {
      this.tree[parent] += change;
      parent = Math.floor(parent / 2);
    }
  }

  // Insert a new data item with given priority
  add(priority: number, item: any): number {
    const dataIdx = this.writePtr;
    this.data[dataIdx] = item;
    this.update(dataIdx, priority);

    this.writePtr = (this.writePtr + 1) % this.capacity;
    if (this.size < this.capacity) this.size++;
    return dataIdx;
  }

  // Search for the leaf corresponding to prefix value v
  get(v: number): { dataIdx: number; priority: number; item: any } {
    let parent = 1;
    while (parent < this.capacity) {
      const leftChild = 2 * parent;
      const rightChild = leftChild + 1;

      if (v < this.tree[leftChild]) {
        parent = leftChild;
      } else {
        v -= this.tree[leftChild];
        parent = rightChild;
      }
    }

    const dataIdx = parent - this.capacity;
    return {
      dataIdx,
      priority: this.tree[parent],
      item: this.data[dataIdx]
    };
  }
}
```

Verification Test:
```typescript
const st = new SumTree(4);
st.add(5, "e0");
st.add(15, "e1");
st.add(10, "e2");
st.add(20, "e3");
console.log("Total Priority:", st.totalPriority); // 50
const sample = st.get(28.5);
console.log("Sampled item:", sample.item); // "e2" (matches Worked Example 5.4!)
```

---

### Worked Example 5.7: Dueling Architecture Advantage Unidentifiability Proof
**Problem:** Let $Q(s, a) = V(s) + A(s, a)$.
1. Prove that for any arbitrary function $c(s)$, the transformation $V'(s) = V(s) + c(s)$ and $A'(s, a) = A(s, a) - c(s)$ yields the identical Q-values: $Q'(s, a) = Q(s, a)$.
2. Show that imposing the constraint $\sum_{a=1}^{|\mathcal{A}|} A(s, a) = 0$ uniquely determines $V(s)$ as the average action value: $V(s) = \frac{1}{|\mathcal{A}|} \sum_{a=1}^{|\mathcal{A}|} Q(s, a)$.

**Solution:**
1. Compute $Q'(s, a)$:
$$Q'(s, a) = V'(s) + A'(s, a) = (V(s) + c(s)) + (A(s, a) - c(s)) = V(s) + A(s, a) = Q(s, a)$$
Since $c(s)$ can be any arbitrary scalar function, the unconstrained mapping $(V, A) \mapsto Q$ is many-to-one and has a non-trivial null space.

2. Sum both sides of $Q(s, a) = V(s) + A(s, a)$ over all actions $a \in \mathcal{A}$:
$$\sum_{a=1}^{|\mathcal{A}|} Q(s, a) = \sum_{a=1}^{|\mathcal{A}|} [V(s) + A(s, a)] = |\mathcal{A}| V(s) + \sum_{a=1}^{|\mathcal{A}|} A(s, a)$$
Imposing the constraint $\sum_{a=1}^{|\mathcal{A}|} A(s, a) = 0$:
$$\sum_{a=1}^{|\mathcal{A}|} Q(s, a) = |\mathcal{A}| V(s) + 0 \implies V(s) = \frac{1}{|\mathcal{A}|} \sum_{a=1}^{|\mathcal{A}|} Q(s, a)$$
Substituting this unique $V(s)$ back into $A(s, a) = Q(s, a) - V(s)$:
$$A(s, a) = Q(s, a) - \frac{1}{|\mathcal{A}|}\sum_{a'} Q(s, a')$$
The decomposition is now uniquely identified and invertible.

---

### Worked Example 5.8: Beta Annealing Schedule for Prioritized Replay
**Problem:** In PER, $\beta$ is annealed linearly from $\beta_0 = 0.4$ to $\beta_{\text{final}} = 1.0$ over $T_{\text{max}} = 500,000$ steps.
1. Write the linear equation for $\beta(t)$ as a function of training step $t$.
2. Calculate $\beta(t)$ at $t = 100,000$, $t = 250,000$, and $t = 600,000$.
3. Explain why starting with a low $\beta_0$ and annealing to $1.0$ is beneficial for training stability.

**Solution:**
1. The linear schedule is:
$$\beta(t) = \min\left(1.0, \beta_0 + t \cdot \frac{\beta_{\text{final}} - \beta_0}{T_{\text{max}}}\right) = \min\left(1.0, 0.4 + t \cdot \frac{0.6}{500,000}\right) = \min\left(1.0, 0.4 + 1.2 \times 10^{-6} \cdot t\right)$$

2. Evaluated values:
- At $t = 100,000$: $\beta = 0.4 + 1.2 \times 10^{-6}(100,000) = 0.4 + 0.12 = 0.52$.
- At $t = 250,000$: $\beta = 0.4 + 1.2 \times 10^{-6}(250,000) = 0.4 + 0.30 = 0.70$.
- At $t = 600,000$: $\beta = \min(1.0, 0.4 + 0.72) = \min(1.0, 1.12) = 1.00$.

3. Early in training, the network representations and policy are rapidly evolving; gradient estimates are noisy and non-stationary. A lower $\beta$ (e.g. 0.4) allows the optimizer to focus aggressively on high-error transitions without over-correcting with extreme importance weights. As the policy converges towards the optimum late in training, full unbiased gradient estimation ($\beta \to 1.0$) becomes essential to guarantee that the parameters converge to the true global minimizer of the Bellman error.

---

### Worked Example 5.9: Stratified Minibatch Sampling from Sum-Tree
**Problem:** A Sum-Tree has total priority $P_{\text{total}} = 120.0$. We wish to sample a mini-batch of size $B = 4$.
1. Compute the boundaries of the 4 equal-mass sampling segments.
2. Suppose pseudo-random numbers $u \sim \mathcal{U}[0, 1]$ drawn for the 4 segments are $u = [0.25, 0.50, 0.75, 0.10]$. Compute the exact query values $v_k$ searched in the tree.
3. Why is stratified sampling superior to drawing $B$ completely independent random values from $[0, P_{\text{total}})$?

**Solution:**
1. The segment width is:
$$\Delta = \frac{P_{\text{total}}}{B} = \frac{120.0}{4} = 30.0$$
The 4 segments are:
- Segment 0: $[0.0, 30.0)$
- Segment 1: $[30.0, 60.0)$
- Segment 2: $[60.0, 90.0)$
- Segment 3: $[90.0, 120.0)$

2. Query values $v_k = k \cdot \Delta + u_k \cdot \Delta$:
- $v_0 = 0 \times 30.0 + 0.25 \times 30.0 = 7.5$
- $v_1 = 1 \times 30.0 + 0.50 \times 30.0 = 30.0 + 15.0 = 45.0$
- $v_2 = 2 \times 30.0 + 0.75 \times 30.0 = 60.0 + 22.5 = 82.5$
- $v_3 = 3 \times 30.0 + 0.10 \times 30.0 = 90.0 + 3.0 = 93.0$

3. Stratified sampling guarantees **uniform coverage across the entire cumulative priority distribution**. If $B$ samples were drawn independently from $\mathcal{U}[0, 120)$, by the Birthday Paradox and clustering, multiple samples could fall into the same small interval, causing duplicate transitions in the mini-batch and higher gradient variance. Stratification ensures that low, medium, and high priority transitions are all represented proportionally in every single gradient step.

---

### Worked Example 5.10: Double Dueling DQN Loss and Gradient Step in TypeScript
**Problem:** Implement a complete function `trainDoubleDuelingStep` in TypeScript that accepts a batch of transitions, computes the Double DQN targets, calculates the Dueling Q-values, evaluates the Huber loss, and returns the updated TD errors for PER.

**Solution:**
```typescript
export interface PERTransition {
  state: number[];
  action: number;
  reward: number;
  nextState: number[];
  done: boolean;
  weight: number; // Normalized IS weight
  dataIdx: number;
}

export function trainDoubleDuelingStep(
  batch: PERTransition[],
  onlinePredictQ: (state: number[]) => number[],
  targetPredictQ: (state: number[]) => number[],
  gamma: number = 0.99
): { loss: number; updatedTD: { dataIdx: number; priority: number }[] } {
  let totalLoss = 0;
  const updatedTD: { dataIdx: number; priority: number }[] = [];

  for (const trans of batch) {
    // 1. Double DQN Target Calculation
    // Action selection via online network
    const nextOnlineQ = onlinePredictQ(trans.nextState);
    let bestNextAction = 0;
    let maxNextVal = -Infinity;
    for (let a = 0; a < nextOnlineQ.length; a++) {
      if (nextOnlineQ[a] > maxNextVal) {
        maxNextVal = nextOnlineQ[a];
        bestNextAction = a;
      }
    }

    // Action evaluation via target network
    const nextTargetQ = targetPredictQ(trans.nextState);
    const evalTargetVal = nextTargetQ[bestNextAction];

    // Target value
    const target = trans.reward + gamma * (trans.done ? 0 : 1) * evalTargetVal;

    // 2. Online Q-prediction
    const currentQ = onlinePredictQ(trans.state)[trans.action];
    const tdError = target - currentQ;

    // 3. Huber Loss
    const absError = Math.abs(tdError);
    const huber = absError <= 1.0 ? 0.5 * tdError * tdError : absError - 0.5;
    totalLoss += trans.weight * huber;

    // 4. Update priority for PER: p = |delta| + epsilon
    updatedTD.push({
      dataIdx: trans.dataIdx,
      priority: Math.abs(tdError) + 1e-6
    });
  }

  return {
    loss: totalLoss / batch.length,
    updatedTD
  };
}
```

---

## 5.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 5.1: Asymptotic Maximization Bias for $M$ Gaussian Estimators
**Problem:** Let $X_1, \dots, X_M \overset{\text{i.i.d.}}{\sim} \mathcal{N}(0, \sigma^2)$ be $M$ independent zero-mean Gaussian estimates of identical action values with standard deviation $\sigma$.
1. Using Extreme Value Theory, state the asymptotic expected value $\mathbb{E}[\max_{i=1..M} X_i]$ as $M \to \infty$.
2. Evaluate the theoretical overestimation for $M = 4$ actions and $M = 100$ actions when $\sigma = 2.0$.
3. What does this imply about the vulnerability of Q-learning as the action discretization becomes finer?

**Solution:**
1. From Extreme Value Theory, for $M$ independent standard normal variables $Z_i \sim \mathcal{N}(0, 1)$, the expectation of the maximum scales asymptotically as:
$$\mathbb{E}\left[\max_{i=1..M} Z_i\right] \sim \sqrt{2 \ln M} - \frac{\ln(\ln M) + \ln(4\pi)}{2\sqrt{2 \ln M}}$$
Scaling by standard deviation $\sigma$:
$$\mathbb{E}\left[\max_{i=1..M} X_i\right] \approx \sigma \sqrt{2 \ln M}$$

2. Numerical evaluations:
- For $M = 4$ actions, $\sigma = 2.0$:
  $$\mathbb{E}[\max] \approx 2.0 \times \sqrt{2 \ln 4} = 2.0 \times \sqrt{2 \times 1.3863} = 2.0 \times \sqrt{2.7726} \approx 2.0 \times 1.665 = 3.33$$
  (Exact numerical expectation is $\approx 2.0 \times 1.029 = 2.06$).
- For $M = 100$ actions, $\sigma = 2.0$:
  $$\mathbb{E}[\max] \approx 2.0 \times \sqrt{2 \ln 100} = 2.0 \times \sqrt{2 \times 4.605} = 2.0 \times \sqrt{9.210} \approx 2.0 \times 3.035 = 6.07$$

3. Implication:
As the action space cardinality $M$ increases (e.g., discretizing continuous control into finer bins), the maximization bias grows at rate $\mathcal{O}(\sigma \sqrt{\ln M})$. Fine action discretizations severely exacerbate Q-learning instability unless Double DQN or continuous actor-critic methods are used.

---

### Exercise 5.2: Underestimation Bias in Double Q-Learning
**Problem:** While standard Q-learning suffers from overestimation bias ($\mathbb{E}[Y^{\text{Q}}] \ge \max_a Q^*(s, a)$), does Double Q-learning guarantee zero bias, or can it exhibit underestimation bias?
Consider an MDP state where the true values are $Q^*(s, a_1) = 0.1$ and $Q^*(s, a_2) = 0.0$.
Suppose noisy estimates are $Q^A(s, a_1) = 0.1 + \epsilon_1^A$, $Q^A(s, a_2) = 0.0 + \epsilon_2^A$, and independently $Q^B(s, a_1) = 0.1 + \epsilon_1^B$, $Q^B(s, a_2) = 0.0 + \epsilon_2^B$.
Show a concrete probability scenario where $\mathbb{E}[Q^B(s, \arg\max_a Q^A(s, a))] < \max_a Q^*(s, a)$.

**Solution:**
True maximum: $\max(0.1, 0.0) = 0.1$.
Let the noise be discrete:
- $\epsilon_2^A = +0.5$ with probability $0.2$, and $0.0$ otherwise.
- $\epsilon_1^A = 0.0$.
- $\epsilon_1^B = 0.0, \epsilon_2^B = -0.5$ with probability $0.5$, and $0.0$ otherwise.

When $\epsilon_2^A = +0.5$:
$Q^A(s, a_2) = 0.5 > Q^A(s, a_1) = 0.1 \implies a^*_A = a_2$ is selected.
The evaluated value from network B is:
$$\mathbb{E}[Q^B(s, a_2)] = 0.0 + \mathbb{E}[\epsilon_2^B] = 0.0 + (0.5 \times (-0.5)) = -0.25$$
When $\epsilon_2^A = 0.0$:
$Q^A(s, a_1) = 0.1 > Q^A(s, a_2) = 0.0 \implies a^*_A = a_1$ is selected.
The evaluated value is:
$$\mathbb{E}[Q^B(s, a_1)] = 0.1 + \mathbb{E}[\epsilon_1^B] = 0.1 + 0 = 0.1$$
Overall expectation:
$$\mathbb{E}[Y] = 0.2 \times (-0.25) + 0.8 \times (0.1) = -0.05 + 0.08 = 0.03$$
Notice that $\mathbb{E}[Y] = 0.03 < \max_a Q^*(s, a) = 0.1$.
Double Q-learning can exhibit **underestimation bias**. However, in reinforcement learning, underestimation bias is vastly more benign than overestimation bias: underestimation acts as implicit conservatism, whereas overestimation triggers self-reinforcing explosive feedback loops.

---

### Exercise 5.3: Dueling Network Jacobian Matrix
**Problem:** Consider the mean-subtracted Dueling aggregation layer:
$$Q_a = V + A_a - \frac{1}{K}\sum_{j=1}^K A_j \quad \text{for } a \in \{1, \dots, K\}$$
1. Compute the partial derivative $\frac{\partial Q_a}{\partial A_b}$ for $a = b$ and $a \neq b$.
2. Write the $K \times K$ Jacobian matrix $\mathbf{J}_A = \frac{\partial \mathbf{Q}}{\partial \mathbf{A}}$.
3. Show that $\mathbf{J}_A$ is an orthogonal projection matrix onto the subspace orthogonal to the all-ones vector $\mathbf{1}$.

**Solution:**
1. Partial derivatives:
- If $a = b$: $\frac{\partial Q_a}{\partial A_a} = 1 - \frac{1}{K}$.
- If $a \neq b$: $\frac{\partial Q_a}{\partial A_b} = -\frac{1}{K}$.

2. Jacobian matrix:
$$\mathbf{J}_A = \begin{bmatrix}
1 - \frac{1}{K} & -\frac{1}{K} & \cdots & -\frac{1}{K} \\
-\frac{1}{K} & 1 - \frac{1}{K} & \cdots & -\frac{1}{K} \\
\vdots & \vdots & \ddots & \vdots \\
-\frac{1}{K} & -\frac{1}{K} & \cdots & 1 - \frac{1}{K}
\end{bmatrix} = \mathbf{I}_K - \frac{1}{K} \mathbf{1} \mathbf{1}^\top$$
where $\mathbf{I}_K$ is the $K \times K$ identity matrix and $\mathbf{1}$ is the column vector of all ones.

3. Projection properties:
- Symmetry: $\mathbf{J}_A^\top = (\mathbf{I} - \frac{1}{K}\mathbf{1}\mathbf{1}^\top)^\top = \mathbf{I} - \frac{1}{K}\mathbf{1}\mathbf{1}^\top = \mathbf{J}_A$.
- Idempotence:
  $$\mathbf{J}_A^2 = \left(\mathbf{I} - \frac{1}{K}\mathbf{1}\mathbf{1}^\top\right)\left(\mathbf{I} - \frac{1}{K}\mathbf{1}\mathbf{1}^\top\right) = \mathbf{I} - \frac{2}{K}\mathbf{1}\mathbf{1}^\top + \frac{1}{K^2}\mathbf{1}(\mathbf{1}^\top\mathbf{1})\mathbf{1}^\top$$
  Since $\mathbf{1}^\top\mathbf{1} = K$:
  $$\mathbf{J}_A^2 = \mathbf{I} - \frac{2}{K}\mathbf{1}\mathbf{1}^\top + \frac{K}{K^2}\mathbf{1}\mathbf{1}^\top = \mathbf{I} - \frac{1}{K}\mathbf{1}\mathbf{1}^\top = \mathbf{J}_A$$
Since $\mathbf{J}_A = \mathbf{J}_A^\top$ and $\mathbf{J}_A^2 = \mathbf{J}_A$, it is an **orthogonal projection operator** (specifically the centering matrix that projects vectors onto the subspace $\mathbf{1}^\perp$).

---

### Exercise 5.4: Max-Subtracted vs Mean-Subtracted Gradient Stability
**Problem:** In the max-subtracted Dueling formulation:
$$Q(s, a) = V(s) + A(s, a) - \max_{a'} A(s, a')$$
let $a^* = \arg\max_{a'} A(s, a')$.
1. Compute the subgradient $\frac{\partial Q_a}{\partial A_b}$.
2. Explain why the gradient with respect to $A(s, a^*)$ is discontinuous when two actions have nearly identical advantage values ($A(s, a_1) \approx A(s, a_2)$).
3. Why does the mean-subtracted version prevent this gradient chatter?

**Solution:**
1. Derivative:
For action $a$:
$$\frac{\partial Q_a}{\partial A_b} = \mathbb{I}(a = b) - \mathbb{I}(a^* = b)$$
where $\mathbb{I}$ is the indicator function.
- If $a \neq a^*$: $\frac{\partial Q_a}{\partial A_a} = 1$, and $\frac{\partial Q_a}{\partial A_{a^*}} = -1$. For all other actions $b \notin \{a, a^*\}$, the derivative is $0$.

2. Discontinuity:
If $A(s, a_1) \approx A(s, a_2)$, a minuscule weight update during training can cause $a^*$ to flip rapidly back and forth between action 1 and action 2. 
When $a^*$ flips from 1 to 2, the derivative $\frac{\partial Q_a}{\partial A_1}$ jumps discontinuously from $-1$ to $0$, and $\frac{\partial Q_a}{\partial A_2}$ jumps from $0$ to $-1$. This sudden step discontinuity introduces high-frequency gradient noise and parameter chatter.

3. In contrast, the mean-subtracted derivative $\frac{\partial Q_a}{\partial A_b} = \mathbb{I}(a=b) - \frac{1}{K}$ is completely independent of action ranks or orderings; it is smooth, constant, and uniformly distributed across all parameters.

---

### Exercise 5.5: Memory Layout of Sum-Tree Array
**Problem:** For a Sum-Tree of capacity $N = 8$:
1. Determine the total number of nodes in the array.
2. If data is stored at transition index 5, calculate its corresponding tree index.
3. Write the exact index formula for finding:
   - The sibling of node $k$.
   - The uncle of node $k$.

**Solution:**
1. Number of nodes:
For capacity $N$, the binary tree has $N$ leaf nodes and $N-1$ internal nodes.
$$\text{Total nodes} = N + (N - 1) = 2N - 1 = 2(8) - 1 = 15 \text{ nodes}$$
Using a 1-indexed array, an array of size $2N = 16$ is allocated (with index 0 unused).

2. Tree index for transition index 5:
$$\text{treeIdx} = \text{transitionIdx} + N = 5 + 8 = 13$$

3. Formulas:
- **Sibling:** If $k$ is even (left child), sibling is $k + 1$. If $k$ is odd (right child), sibling is $k - 1$.
  Compact formula: $\text{sibling}(k) = k \oplus 1$ (bitwise XOR with 1).
- **Uncle:** The sibling of the parent:
  $$\text{uncle}(k) = \text{sibling}(\lfloor k / 2 \rfloor) = \lfloor k / 2 \rfloor \oplus 1$$

---

### Exercise 5.6: Proof of Importance Sampling Unbiased Expectation
**Problem:** Let loss function $\mathcal{L}(\theta) = \mathbb{E}_{i \sim \mathcal{U}}[f_i(\theta)] = \frac{1}{N}\sum_{i=1}^N f_i(\theta)$ be the uniform loss over a replay buffer.
Suppose we sample transition $i$ according to non-uniform proposal distribution $P(i) > 0$.
Define the importance-weighted estimator:
$$\hat{\mathcal{L}}(\theta) = w_i f_i(\theta) \quad \text{where } w_i = \frac{1}{N \cdot P(i)}$$
1. Prove that $\mathbb{E}_{i \sim P}[\hat{\mathcal{L}}(\theta)] = \mathcal{L}(\theta)$ (unbiasedness when $\beta = 1$).
2. Derive the variance of the estimator $\mathbb{V}_{i \sim P}[\hat{\mathcal{L}}(\theta)]$.
3. Under what theoretical choice of $P(i)$ is the variance of the gradient estimator minimized?

**Solution:**
1. Compute the expected value under distribution $P$:
$$\mathbb{E}_{i \sim P}[\hat{\mathcal{L}}(\theta)] = \sum_{i=1}^N P(i) \cdot \left[ w_i f_i(\theta) \right] = \sum_{i=1}^N P(i) \cdot \left[ \frac{1}{N \cdot P(i)} f_i(\theta) \right] = \sum_{i=1}^N \frac{1}{N} f_i(\theta) = \frac{1}{N}\sum_{i=1}^N f_i(\theta) = \mathcal{L}(\theta)$$
The estimator is strictly unbiased.

2. Variance derivation:
$$\mathbb{V}_{i \sim P}[\hat{\mathcal{L}}(\theta)] = \mathbb{E}_{i \sim P}[\hat{\mathcal{L}}(\theta)^2] - (\mathbb{E}_{i \sim P}[\hat{\mathcal{L}}(\theta)])^2 = \sum_{i=1}^N P(i) \left( \frac{f_i(\theta)}{N P(i)} \right)^2 - \mathcal{L}(\theta)^2 = \frac{1}{N^2}\sum_{i=1}^N \frac{f_i(\theta)^2}{P(i)} - \mathcal{L}(\theta)^2$$

3. Optimal proposal distribution:
Using the Cauchy-Schwarz inequality, $\sum_{i=1}^N \frac{f_i^2}{P(i)}$ is minimized subject to $\sum_i P(i) = 1$ when:
$$P^*(i) \propto |f_i(\theta)|$$
In reinforcement learning, $f_i(\theta)$ is the TD error $\delta_i$. Hence, setting $P(i) \propto |\delta_i|$ directly minimizes the empirical variance of the Monte Carlo gradient updates!

---

### Exercise 5.7: Interaction Between Double DQN and Prioritized Replay
**Problem:** In Prioritized Experience Replay, TD errors are updated after each gradient step.
In Double DQN, the TD error is:
$$\delta_i = R_{t+1} + \gamma Q(S_{t+1}, \arg\max_{a'} Q(S_{t+1}, a'; \boldsymbol{\theta}); \boldsymbol{\theta}^-) - Q(S_t, A_t; \boldsymbol{\theta})$$
1. Explain how maximization bias in standard DQN would artificially distort priorities in PER.
2. How does combining Double DQN with PER create a synergistic stabilization effect?

**Solution:**
1. In standard DQN, $\max_{a'} Q(S_{t+1}, a'; \boldsymbol{\theta}^-)$ is systematically overestimated due to noise. If an unvisited transition has noisy, high estimates, standard DQN overestimates its target, generating an artificially large TD error $|\delta_i|$. Under PER, this transition is assigned a massive priority $p_i$, causing the agent to repeatedly sample this hallucinatory transition and waste optimization capacity.

2. Synergy:
Double DQN uses the online network to select the action, preventing positive noise fluctuations in the target network from creating fake high targets. Consequently, the TD errors computed in Double DQN reflect genuine learning difficulty rather than noise artifacts. PER samples genuinely critical, high-information transitions, multiplying the sample efficiency and stability of the training process.

---

### Exercise 5.8: Rank-Based vs Proportional Prioritized Replay
**Problem:** Schaul et al. (2015) proposed two priority variants:
- **Proportional:** $p_i = |\delta_i| + \epsilon$
- **Rank-based:** $p_i = \frac{1}{\text{rank}(i)}$ where $\text{rank}(i)$ is the sorting index of transition $i$ ordered by descending $|\delta_i|$.
1. Why is rank-based prioritization completely robust to outlier TD errors?
2. What is the computational disadvantage of rank-based prioritization compared to proportional prioritization using a Sum-Tree?

**Solution:**
1. Robustness:
In proportional prioritization, a single catastrophic transition with an enormous error (e.g. $\delta = 10,000$) can dominate the total sum of priorities, reducing the sampling probability of all other transitions to near zero.
In rank-based prioritization, the highest-error transition always has $\text{rank} = 1 \implies p = 1.0$, regardless of whether its error was $2.0$ or $2,000,000$. It is an ordinal statistic, completely invariant to monotonic transformations and insensitive to extreme outliers.

2. Computational disadvantage:
Maintaining exact ranks across a buffer of $N = 1,000,000$ transitions requires sorting or maintaining an ordered tree data structure. Sorting takes $\mathcal{O}(N \log N)$ or $\mathcal{O}(N)$ with approximate bucket sorts, requiring significant memory and CPU overhead. Proportional PER with a Sum-Tree updates in strictly $\mathcal{O}(\log N)$ without any sorting.

---

### Exercise 5.9: Rainbow DQN Integration Analysis
**Problem:** Hessel et al. (2018) combined six independent DQN extensions into **Rainbow DQN**:
1. Double DQN
2. Prioritized Replay
3. Dueling Networks
4. Multi-step Learning ($n$-step returns)
5. Distributional RL (C51 categorical projection)
6. Noisy Nets (parameter-space exploration)
Explain how Dueling Networks and Distributional RL interact in Rainbow's architecture.

**Solution:**
In Rainbow, the Dueling decomposition is extended from scalar expectations to probability distributions over value supports:
- The Value stream outputs a vector of dimension $N_{\text{atoms}}$ representing the categorical probability logits of the state value distribution: $\mathbf{V}(s) \in \mathbb{R}^{N_{\text{atoms}}}$.
- The Advantage stream outputs a matrix of dimension $|\mathcal{A}| \times N_{\text{atoms}}$ representing the advantage logits: $\mathbf{A}(s, a) \in \mathbb{R}^{|\mathcal{A}| \times N_{\text{atoms}}}$.
- The aggregation layer operates atom-by-atom for each probability bin $i \in \{1, \dots, N_{\text{atoms}}\}$:
$$Q_i(s, a) = V_i(s) + \left( A_i(s, a) - \frac{1}{|\mathcal{A}|}\sum_{a'} A_i(s, a') \right)$$
- A softmax is applied across the atom dimension to obtain valid return distributions. The combination retains the inductive benefits of dueling parameter sharing while predicting the full distributional shape of returns.

---

### Exercise 5.10: Complete TypeScript Implementation of Prioritized Replay Buffer with IS Weights
**Problem:** Write a production-ready TypeScript class `PrioritizedReplayBuffer` that integrates the `SumTree` from Worked Example 5.6 to provide:
1. Pushing transitions with default maximal priority.
2. Stratified mini-batch sampling with normalized importance sampling weights $\tilde{w}_i$.
3. Batch updating of TD errors.

**Solution:**
```typescript
import { SumTree } from './sum-tree'; // Assuming SumTree from Worked Example 5.6

export interface TransitionTuple<S = number[], A = number> {
  state: S;
  action: A;
  reward: number;
  nextState: S;
  done: boolean;
}

export interface SampledBatch<S = number[], A = number> {
  transitions: TransitionTuple<S, A>[];
  indices: number[];
  weights: Float64Array;
}

export class PrioritizedReplayBuffer<S = number[], A = number> {
  private tree: SumTree;
  private maxPriority: number = 1.0;
  public readonly alpha: number;
  public readonly epsilon: number;

  constructor(
    public readonly capacity: number,
    alpha: number = 0.6,
    epsilon: number = 1e-5
  ) {
    this.tree = new SumTree(capacity);
    this.alpha = alpha;
    this.epsilon = epsilon;
  }

  push(transition: TransitionTuple<S, A>): void {
    // New transitions are added with maximal observed priority to ensure exploration
    const priority = Math.pow(this.maxPriority, this.alpha);
    this.tree.add(priority, transition);
  }

  sample(batchSize: number, beta: number = 0.4): SampledBatch<S, A> {
    if (this.tree.size < batchSize) {
      throw new Error(`Buffer contains ${this.tree.size} items, less than batch size ${batchSize}`);
    }

    const transitions: TransitionTuple<S, A>[] = [];
    const indices: number[] = [];
    const rawWeights = new Float64Array(batchSize);

    const segment = this.tree.totalPriority / batchSize;
    let maxWeight = 0;

    for (let i = 0; i < batchSize; i++) {
      const a = segment * i;
      const b = segment * (i + 1);
      const value = a + Math.random() * (b - a);

      const leaf = this.tree.get(value);
      transitions.push(leaf.item);
      indices.push(leaf.dataIdx);

      // P(i) = p_i / totalPriority
      const prob = leaf.priority / this.tree.totalPriority;
      // w_i = (N * P(i))^(-beta)
      const weight = Math.pow(this.tree.size * prob, -beta);
      rawWeights[i] = weight;
      if (weight > maxWeight) maxWeight = weight;
    }

    // Normalize weights by maxWeight so w_i in (0, 1]
    const weights = new Float64Array(batchSize);
    for (let i = 0; i < batchSize; i++) {
      weights[i] = rawWeights[i] / maxWeight;
    }

    return { transitions, indices, weights };
  }

  updatePriorities(indices: number[], tdErrors: number[]): void {
    for (let i = 0; i < indices.length; i++) {
      const error = Math.abs(tdErrors[i]) + this.epsilon;
      if (error > this.maxPriority) {
        this.maxPriority = error;
      }
      const priority = Math.pow(error, this.alpha);
      this.tree.update(indices[i], priority);
    }
  }

  size(): number {
    return this.tree.size;
  }
}
```

Verification Test:
```typescript
const per = new PrioritizedReplayBuffer<number[], number>(100, 0.6);
for (let i = 0; i < 50; i++) {
  per.push({ state: [i], action: i % 2, reward: 1.0, nextState: [i + 1], done: false });
}
const batch = per.sample(4, 0.5);
console.log("Sampled batch size:", batch.transitions.length); // 4
console.log("Normalized weights:", batch.weights); // [ <= 1.0, ... ]
per.updatePriorities(batch.indices, [0.01, 10.5, 2.1, 0.05]);
console.log("Priorities updated successfully.");
```


# Chapter 6: The Policy Gradient Theorem: Likelihood Ratios and Direct Policy Search

---

## 6.1 The Policy Optimization Paradigm

In the preceding five chapters, our exploration of reinforcement learning was centered entirely upon the **Value-Based Paradigm**:
$$\text{Learn } Q^*(s, a) \implies \text{Derive Policy: } \pi(s) = \arg\max_{a \in \mathcal{A}} Q^*(s, a)$$

While value-based methods (DQN, Double DQN, Dueling DQN) are powerful, they suffer from deep intrinsic limitations:
1. **Inability to Represent Continuous Action Spaces:** Computing $\arg\max_{a \in \mathcal{A}} Q(s, a)$ over a discrete set of 4 or 18 Atari buttons is trivial. However, for a robotic arm with 7 continuous joints where each torque $\tau_i \in [-10.0, 10.0] \text{ N}\cdot\text{m}$, finding the global maximum of a non-convex neural network $Q(s, \mathbf{a}; \boldsymbol{\theta})$ requires solving a high-dimensional continuous optimization problem at every single millisecondâ€”a computationally intractable task.
2. **Inability to Learn Stochastic Policies:** In environments with partial observability (POMDPs) or competitive multi-agent game-theoretic settings (such as Rock-Paper-Scissors or Poker), deterministic policies are easily exploited. An optimal agent must act stochastically (e.g., playing Rock, Paper, and Scissors with exact probabilities $\frac{1}{3}, \frac{1}{3}, \frac{1}{3}$). A deterministic greedy policy $\arg\max_a Q(s, a)$ cannot represent mixed Nash equilibria.
3. **Policy Discontinuity and Optimization Churn:** A minuscule change in network weights $\boldsymbol{\theta}$ can flip the $\arg\max$ from one action to a completely different action. This sudden discontinuous jump in the induced policy induces severe distribution shifts, destabilizing function approximation.

These challenges motivate the **Policy-Based Paradigm**: parameterizing the policy directly as a continuous, differentiable function $\pi_{\boldsymbol{\theta}}(a \mid s)$, and optimizing its parameters $\boldsymbol{\theta} \in \mathbb{R}^d$ using gradient ascent on the expected cumulative return.

```
                      VALUE-BASED VS POLICY-BASED PARADIGMS
                      
  VALUE-BASED:                                   POLICY-BASED:
  
  Parameterize Value Function:                   Parameterize Policy Directly:
        Q(s, a; Î¸)                                      Ï€(a | s; Î¸)
            â”‚                                               â”‚
            â–¼ argmax                                        â–¼ Differentiable Mapping
  Deterministic Policy:                           Continuous or Stochastic Actions:
     a = argmax_a Q(s, a; Î¸)                         a ~ Ï€(Â· | s; Î¸)
  (Non-smooth, Discontinuous)                     (Smooth, Stable Gradient Ascent)
```

### Parameterizing Stochastic Action Distributions
A parameterized policy $\pi_{\boldsymbol{\theta}}(a \mid s)$ outputs a probability distribution over actions conditioned on the environmental state:
$$\pi_{\boldsymbol{\theta}}(a \mid s) = \mathbb{P}(A_t = a \mid S_t = s; \boldsymbol{\theta})$$

Depending on the action space topology, standard distributional parameterizations include:

#### 1. Discrete Action Spaces: Categorical Softmax Policy
For discrete actions $\mathcal{A} = \{1, 2, \dots, K\}$, a neural network with parameters $\boldsymbol{\theta}$ outputs a vector of unnormalized logits $\mathbf{h}(s; \boldsymbol{\theta}) \in \mathbb{R}^K$. The action probabilities are given by the softmax function:
$$\pi_{\boldsymbol{\theta}}(a_i \mid s) = \frac{\exp(h_i(s; \boldsymbol{\theta}))}{\sum_{j=1}^K \exp(h_j(s; \boldsymbol{\theta}))}$$
This distribution is strictly positive ($\pi(a \mid s) > 0$), fully differentiable, and capable of representing any categorical distribution.

#### 2. Continuous Action Spaces: Diagonal Gaussian Policy
For continuous multi-dimensional actions $\mathbf{a} \in \mathbb{R}^m$, the policy network outputs the parameters of a multivariate Gaussian distribution:
$$\pi_{\boldsymbol{\theta}}(\mathbf{a} \mid s) = \mathcal{N}(\boldsymbol{\mu}_{\boldsymbol{\theta}}(s), \boldsymbol{\Sigma}_{\boldsymbol{\theta}}(s))$$
In standard practice, the covariance matrix is assumed to be diagonal, $\boldsymbol{\Sigma} = \text{diag}(\sigma_1^2, \dots, \sigma_m^2)$, parameterized via log-standard deviations $s_i = \log \sigma_i$ to ensure strict positivity without numerical constraints:
$$\pi_{\boldsymbol{\theta}}(\mathbf{a} \mid s) = \prod_{i=1}^m \frac{1}{\sqrt{2\pi}\sigma_i(s)} \exp\left( -\frac{(a_i - \mu_i(s))^2}{2\sigma_i(s)^2} \right)$$

---

## 6.2 Trajectory Formulations and the Expected Return Objective

Let an interaction trajectory (or episode rollout) be denoted by $\tau$:
$$\tau = (s_0, a_0, r_1, s_1, a_1, r_2, \dots, s_T, a_T, r_{T+1})$$

The total cumulative return along trajectory $\tau$ is the discounted (or undiscounted) sum of rewards:
$$R(\tau) = \sum_{t=0}^T \gamma^t r_{t+1}$$

### Probability Density of a Trajectory
The probability of observing trajectory $\tau$ under policy $\pi_{\boldsymbol{\theta}}$ and environmental transition dynamics $\mathcal{P}(s' \mid s, a)$ is given by:
$$P(\tau; \boldsymbol{\theta}) = \rho_0(s_0) \prod_{t=0}^T \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)$$
where $\rho_0(s_0)$ is the initial state distribution.

Notice the log-probability of the trajectory decomposes into an additive sum:
$$\log P(\tau; \boldsymbol{\theta}) = \log \rho_0(s_0) + \sum_{t=0}^T \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) + \sum_{t=0}^T \log \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

### The Expected Return Objective
The fundamental goal of policy search is to maximize the expected return over all possible trajectories:
$$J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim P(\tau; \boldsymbol{\theta})}[R(\tau)] = \int P(\tau; \boldsymbol{\theta}) R(\tau) d\tau$$

To optimize $J(\boldsymbol{\theta})$ via gradient ascent:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$
we must compute the gradient vector $\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$.

---

## 6.3 The Score Function Trick (Likelihood Ratios)

Computing $\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$ appears formidable at first glance:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} \int P(\tau; \boldsymbol{\theta}) R(\tau) d\tau = \int \nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta}) R(\tau) d\tau$$

We cannot directly approximate this integral with Monte Carlo sampling because the integrand contains $\nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta})$, which is **not** a valid probability distribution ($\int \nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta}) d\tau = \nabla_{\boldsymbol{\theta}} \int P(\tau; \boldsymbol{\theta}) d\tau = \nabla_{\boldsymbol{\theta}} (1) = \mathbf{0}$).

To convert this expression back into an expectation that can be sampled from $P(\tau; \boldsymbol{\theta})$, we employ the **Score Function Trick** (also known as the Likelihood Ratio Trick or REINFORCE Trick):

Recall from elementary calculus that for any differentiable function $f(x) > 0$:
$$\frac{d}{dx} \log f(x) = \frac{\nabla_x f(x)}{f(x)} \implies \nabla_x f(x) = f(x) \nabla_x \log f(x)$$

Applying this identity directly to $P(\tau; \boldsymbol{\theta})$:
$$\nabla_{\boldsymbol{\theta}} P(\tau; \boldsymbol{\theta}) = P(\tau; \boldsymbol{\theta}) \nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta})$$

```
                         THE SCORE FUNCTION TRICK
                         
          True Gradient:                 Identity:
    âˆ‡_Î¸ âˆ« P(Ï„; Î¸) R(Ï„) dÏ„        âˆ‡_Î¸ P(Ï„; Î¸) = P(Ï„; Î¸) âˆ‡_Î¸ log P(Ï„; Î¸)
             â”‚                                   â”‚
             â–¼                                   â–¼
    âˆ« [ âˆ‡_Î¸ P(Ï„; Î¸) ] R(Ï„) dÏ„    â•â•â•â•â–º   âˆ« P(Ï„; Î¸) [ âˆ‡_Î¸ log P(Ï„; Î¸) R(Ï„) ] dÏ„
                                                 â”‚
                                                 â–¼
                                        E_{Ï„ ~ P(Ï„; Î¸)} [ âˆ‡_Î¸ log P(Ï„; Î¸) R(Ï„) ]
                                        (Directly Sampleable via Monte Carlo!)
```

Substituting this identity into the gradient integral yields:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \int P(\tau; \boldsymbol{\theta}) \left( \nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) R(\tau) \right) d\tau = \mathbb{E}_{\tau \sim P(\tau; \boldsymbol{\theta})} \left[ \nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) R(\tau) \right]$$

### The Miracle of Physics Elimination
Now, observe the crucial mathematical miracle that occurs when we take the gradient of $\log P(\tau; \boldsymbol{\theta})$:
$$\log P(\tau; \boldsymbol{\theta}) = \log \rho_0(s_0) + \sum_{t=0}^T \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) + \sum_{t=0}^T \log \mathcal{P}(s_{t+1} \mid s_t, a_t)$$

Differentiating with respect to the policy parameters $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) = \underbrace{\nabla_{\boldsymbol{\theta}} \log \rho_0(s_0)}_{\mathbf{0}} + \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) + \sum_{t=0}^T \underbrace{\nabla_{\boldsymbol{\theta}} \log \mathcal{P}(s_{t+1} \mid s_t, a_t)}_{\mathbf{0}}$$

Because neither the initial state distribution $\rho_0(s_0)$ nor the environmental physics transition dynamics $\mathcal{P}(s_{t+1} \mid s_t, a_t)$ depend on $\boldsymbol{\theta}$, their gradients are identically zero:
$$\nabla_{\boldsymbol{\theta}} \log P(\tau; \boldsymbol{\theta}) = \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t)$$

Substituting this back into the expectation:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim \pi_{\boldsymbol{\theta}}} \left[ \left( \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right) R(\tau) \right]$$

**This is a revolutionary result in reinforcement learning:**
We do **not** need to know the transition probabilities $\mathcal{P}(s' \mid s, a)$, the equations of motion, the friction coefficients, or the physics engine source code. The environmental dynamics vanish completely from the gradient!

---

## 6.4 The Policy Gradient Theorem: Step-by-Step Derivation

While the trajectory-level gradient derived above is mathematically valid, Sutton et al. (1999) established the formal **Policy Gradient Theorem**, which expresses the gradient in terms of stationary state distributions and exact state-action value functions $Q^\pi(s, a)$.

### Theorem Statement
For any differentiable policy $\pi_{\boldsymbol{\theta}}(a \mid s)$, the gradient of the expected discounted return $J(\boldsymbol{\theta}) = V^{\pi_{\boldsymbol{\theta}}}(s_0)$ is:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \sum_{s \in \mathcal{S}} d^{\pi_{\boldsymbol{\theta}}}(s) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^{\pi_{\boldsymbol{\theta}}}(s, a)$$
where $d^{\pi_{\boldsymbol{\theta}}}(s) = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s \mid s_0, \pi_{\boldsymbol{\theta}})$ is the discounted state visitation distribution.

### Rigorous Analytical Proof
Begin with the definition of the state-value function $V^\pi(s)$:
$$V^\pi(s) = \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$

Differentiating both sides with respect to $\boldsymbol{\theta}$ using the product rule:
$$\nabla_{\boldsymbol{\theta}} V^\pi(s) = \nabla_{\boldsymbol{\theta}} \left[ \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) \right] = \sum_{a \in \mathcal{A}} \left[ \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \pi_{\boldsymbol{\theta}}(a \mid s) \nabla_{\boldsymbol{\theta}} Q^\pi(s, a) \right]$$

Now expand $Q^\pi(s, a)$ using the Bellman equation:
$$Q^\pi(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}(s' \mid s, a) V^\pi(s')$$

Differentiating $Q^\pi(s, a)$:
$$\nabla_{\boldsymbol{\theta}} Q^\pi(s, a) = \nabla_{\boldsymbol{\theta}} \left[ \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) V^\pi(s') \right] = \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \nabla_{\boldsymbol{\theta}} V^\pi(s')$$

Substitute this back into the expression for $\nabla_{\boldsymbol{\theta}} V^\pi(s)$:
$$\nabla_{\boldsymbol{\theta}} V^\pi(s) = \sum_a \left[ \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \gamma \pi_{\boldsymbol{\theta}}(a \mid s) \sum_{s'} \mathcal{P}(s' \mid s, a) \nabla_{\boldsymbol{\theta}} V^\pi(s') \right]$$
$$= \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \gamma \sum_{s'} \left( \sum_a \pi_{\boldsymbol{\theta}}(a \mid s) \mathcal{P}(s' \mid s, a) \right) \nabla_{\boldsymbol{\theta}} V^\pi(s')$$
$$= \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) + \gamma \sum_{s'} \mathbb{P}(s \to s' \mid 1, \pi) \nabla_{\boldsymbol{\theta}} V^\pi(s')$$

Notice this is a recursive relation for $\nabla_{\boldsymbol{\theta}} V^\pi(s)$. Unrolling this recurrence indefinitely:
$$\nabla_{\boldsymbol{\theta}} V^\pi(s_0) = \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_0) Q^\pi(s_0, a) + \gamma \sum_{s_1} \mathbb{P}(s_0 \to s_1 \mid 1, \pi) \left[ \sum_a \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_1) Q^\pi(s_1, a) + \gamma \sum_{s_2} \cdots \right]$$
$$= \sum_{t=0}^\infty \gamma^t \sum_{s \in \mathcal{S}} \mathbb{P}(S_t = s \mid s_0, \pi) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$
$$= \sum_{s \in \mathcal{S}} \left( \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s \mid s_0, \pi) \right) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$
$$= \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a)$$

Now multiply and divide by $\pi_{\boldsymbol{\theta}}(a \mid s)$ inside the action sum:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s) \frac{\nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s)}{\pi_{\boldsymbol{\theta}}(a \mid s)} Q^\pi(s, a)$$
$$= \mathbb{E}_{s \sim d^\pi, a \sim \pi_{\boldsymbol{\theta}}} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) \right]$$
$\blacksquare$

---

## 6.5 Causality and Future-Return Conditioning (Reward-to-Go)

Recall the trajectory gradient:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \left( \sum_{k=0}^T \gamma^k r_{k+1} \right) \right]$$

Expanding the product between the sum of score functions and the sum of rewards:
$$\sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \left( \sum_{k=0}^{t-1} \gamma^k r_{k+1} + \sum_{k=t}^T \gamma^k r_{k+1} \right)$$

### The Law of Causality
Actions taken at time step $t$ cannot physically influence rewards received in the past ($k < t$):
$$\mathbb{E}_{\tau} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \right] = \mathbf{0} \quad \forall k < t$$

```
                         CAUSALITY IN TRAJECTORY RETURNS
                         
   Time:       0      1      ...     t-1     [  t  ]     t+1     ...     T
   Rewards:   r_1    r_2     ...     r_t     [r_{t+1}]  r_{t+2}  ...    r_{T+1}
              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                         PAST REWARDS                  FUTURE REWARDS
                      (Zero Correlation)             (Reward-to-Go G_t)
                   E[ âˆ‡log Ï€_t Â· r_past ] = 0       Causal Effect: âˆ‡log Ï€_t Â· G_t
```

### Proof of Past-Reward Zero Expectation
By the Tower Property of conditional expectation:
$$\mathbb{E}_{\tau} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \right] = \mathbb{E}_{s_{0:t}, a_{0:t-1}} \left[ \mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \mid s_{0:t}, a_{0:t-1} \right] \right]$$

Since $k+1 \le t$, reward $r_{k+1}$ is completely determined by past history $(s_{0:t}, a_{0:t-1})$. It can be factored out of the inner expectation over $a_t$:
$$\mathbb{E}_{a_t \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \mid \text{history} \right] = r_{k+1} \mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right]$$

Now compute the inner expectation:
$$\mathbb{E}_{a_t \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right] = \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \frac{\nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t)}{\pi_{\boldsymbol{\theta}}(a \mid s_t)} = \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t) = \nabla_{\boldsymbol{\theta}} \underbrace{\sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t)}_{1} = \nabla_{\boldsymbol{\theta}}(1) = \mathbf{0}$$
Thus:
$$\mathbb{E}_{\tau} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) r_{k+1} \right] = \mathbf{0} \quad \forall k < t$$

We can safely eliminate all past rewards from the objective without introducing any bias, replacing the total trajectory return $R(\tau)$ with the **Reward-to-Go** (future return) $G_t$:
$$G_t = \sum_{k=t}^T \gamma^{k-t} r_{k+1}$$

The causal policy gradient estimator becomes:
$$\mathbf{g} = \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t$$
Dropping past rewards drastically reduces the variance of the Monte Carlo gradient estimates, accelerating policy convergence by orders of magnitude.

---

## 6.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 6.1: Derivation of Softmax Policy Score Function
**Problem:** Let $\pi_{\boldsymbol{\theta}}(a_i \mid s) = \frac{\exp(\boldsymbol{\theta}_i^\top \mathbf{x}(s))}{\sum_{j=1}^K \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s))}$ be a linear softmax policy for $K$ discrete actions with state feature vector $\mathbf{x}(s) \in \mathbb{R}^d$.
1. Derive the partial derivative $\frac{\partial \log \pi_{\boldsymbol{\theta}}(a \mid s)}{\partial \boldsymbol{\theta}_k}$.
2. Show that the gradient vector is given by:
$$\nabla_{\boldsymbol{\theta}_k} \log \pi_{\boldsymbol{\theta}}(a \mid s) = (\mathbb{I}(a = k) - \pi_{\boldsymbol{\theta}}(k \mid s)) \mathbf{x}(s)$$
3. Interpret this equation in terms of probability mass shifting.

**Solution:**
1. Take the logarithm of the policy:
$$\log \pi_{\boldsymbol{\theta}}(a \mid s) = \boldsymbol{\theta}_a^\top \mathbf{x}(s) - \log \left( \sum_{j=1}^K \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s)) \right)$$
Differentiate with respect to parameter vector $\boldsymbol{\theta}_k$:
$$\frac{\partial \log \pi_{\boldsymbol{\theta}}(a \mid s)}{\partial \boldsymbol{\theta}_k} = \frac{\partial}{\partial \boldsymbol{\theta}_k} [\boldsymbol{\theta}_a^\top \mathbf{x}(s)] - \frac{1}{\sum_{j} \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s))} \frac{\partial}{\partial \boldsymbol{\theta}_k} \left[ \sum_{j=1}^K \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s)) \right]$$

2. Evaluating both terms:
- First term: $\frac{\partial}{\partial \boldsymbol{\theta}_k}[\boldsymbol{\theta}_a^\top \mathbf{x}(s)] = \mathbb{I}(a = k) \mathbf{x}(s)$.
- Second term:
  $$\frac{\partial}{\partial \boldsymbol{\theta}_k} \left[ \sum_j \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s)) \right] = \exp(\boldsymbol{\theta}_k^\top \mathbf{x}(s)) \mathbf{x}(s)$$
  Dividing by the sum of exponentials:
  $$\frac{\exp(\boldsymbol{\theta}_k^\top \mathbf{x}(s))}{\sum_j \exp(\boldsymbol{\theta}_j^\top \mathbf{x}(s))} \mathbf{x}(s) = \pi_{\boldsymbol{\theta}}(k \mid s) \mathbf{x}(s)$$
Subtracting yields:
$$\nabla_{\boldsymbol{\theta}_k} \log \pi_{\boldsymbol{\theta}}(a \mid s) = (\mathbb{I}(a = k) - \pi_{\boldsymbol{\theta}}(k \mid s)) \mathbf{x}(s)$$

3. Interpretation:
- If action $k$ was chosen ($a = k$): the gradient is $(1 - \pi(k \mid s))\mathbf{x}(s) > 0$. If the return $G_t > 0$, parameter $\boldsymbol{\theta}_k$ is pushed in direction $\mathbf{x}(s)$, increasing the probability of action $k$.
- If action $k$ was *not* chosen ($a \neq k$): the gradient is $(0 - \pi(k \mid s))\mathbf{x}(s) = -\pi(k \mid s)\mathbf{x}(s) < 0$. If $G_t > 0$, the probability of unchosen action $k$ is systematically decreased to preserve the sum of probabilities to $1$.

---

### Worked Example 6.2: Score Function of a 1D Continuous Gaussian Policy
**Problem:** A continuous policy parameterizes action $a \in \mathbb{R}$ as a Gaussian:
$$\pi_\theta(a \mid s) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{(a - \mu_\theta(s))^2}{2\sigma^2} \right)$$
where mean $\mu_\theta(s) = \theta \cdot s$, and standard deviation $\sigma$ is fixed.
1. Derive the score function $\nabla_\theta \log \pi_\theta(a \mid s)$.
2. For state $s = 2.0$, action chosen $a = 5.0$, current mean $\mu = 3.0$, and $\sigma = 1.0$, compute the score function value.
3. If the observed return is $G = +4.0$, compute the parameter update $\Delta \theta$ with learning rate $\alpha = 0.05$.

**Solution:**
1. Log-probability derivation:
$$\log \pi_\theta(a \mid s) = -\frac{1}{2}\log(2\pi) - \log \sigma - \frac{(a - \mu_\theta(s))^2}{2\sigma^2}$$
Differentiate with respect to $\theta$ using chain rule:
$$\nabla_\theta \log \pi_\theta(a \mid s) = -\frac{1}{2\sigma^2} \frac{\partial}{\partial \theta} (a - \mu_\theta(s))^2 = -\frac{1}{2\sigma^2} \cdot 2(a - \mu_\theta(s)) \cdot \left( -\frac{\partial \mu_\theta(s)}{\partial \theta} \right)$$
$$= \frac{a - \mu_\theta(s)}{\sigma^2} \nabla_\theta \mu_\theta(s)$$
Since $\mu_\theta(s) = \theta \cdot s$, $\nabla_\theta \mu_\theta(s) = s$:
$$\nabla_\theta \log \pi_\theta(a \mid s) = \frac{a - \mu_\theta(s)}{\sigma^2} s$$

2. Numerical evaluation:
$$\nabla_\theta \log \pi = \frac{5.0 - 3.0}{1.0^2} \times 2.0 = \frac{2.0}{1.0} \times 2.0 = 4.0$$

3. Parameter update:
$$\Delta \theta = \alpha \cdot \nabla_\theta \log \pi \cdot G = 0.05 \times 4.0 \times 4.0 = 0.80$$
New mean at $s=2.0$ will increase: $\Delta \mu = \Delta \theta \cdot s = 0.80 \times 2.0 = +1.60$, pulling the distribution mean from $3.0$ toward the successful action $a = 5.0$.

---

### Worked Example 6.3: Vanishing Dynamics in a 2-State MDP
**Problem:** An agent operates in a 2-state MDP: $s_0 \to s_1 \to s_{\text{terminal}}$.
At $s_0$, action $a_1$ transitions to $s_1$ with environment probability $p = 0.7$, and to $s_{\text{terminal}}$ with probability $1-p = 0.3$.
Policy $\pi_\theta(a_1 \mid s_0) = \theta \in (0, 1)$.
Reward $r = +10$ on reaching $s_{\text{terminal}}$, 0 otherwise.
1. Write the trajectory distribution $P(\tau; \theta)$ for successful trajectory $\tau = (s_0, a_1, 0, s_1, a_1, 10, s_{\text{terminal}})$.
2. Verify explicitly that $\nabla_\theta \log P(\tau; \theta)$ has zero dependence on environment transition probability $p$.

**Solution:**
1. Trajectory probability:
$$P(\tau; \theta) = \rho_0(s_0) \cdot \pi_\theta(a_1 \mid s_0) \cdot \mathcal{P}(s_1 \mid s_0, a_1) \cdot \pi_\theta(a_1 \mid s_1) \cdot \mathcal{P}(s_{\text{term}} \mid s_1, a_1)$$
$$= 1.0 \times \theta \times p \times \theta \times 1.0 = p \theta^2$$

2. Log-probability:
$$\log P(\tau; \theta) = \log(p \theta^2) = \log p + 2 \log \theta$$
Differentiating with respect to $\theta$:
$$\nabla_\theta \log P(\tau; \theta) = \frac{d}{d\theta} [\log p + 2 \log \theta] = 0 + \frac{2}{\theta} = \frac{2}{\theta}$$
The term $\log p$ vanishes completely because $\frac{d}{d\theta}[\log p] = 0$. The gradient depends purely on policy parameter $\theta$ and is completely agnostic to environmental probability $p$.

---

### Worked Example 6.4: Score Function Expectation Identity Proof
**Problem:** Prove the fundamental score function expectation lemma: for any parameterized probability distribution $p_\theta(x)$,
$$\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \mathbf{0}$$

**Solution:**
Expand the expectation as an integral:
$$\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \int p_\theta(x) \nabla_\theta \log p_\theta(x) dx$$
Using the identity $\nabla_\theta \log p_\theta(x) = \frac{\nabla_\theta p_\theta(x)}{p_\theta(x)}$:
$$\int p_\theta(x) \left( \frac{\nabla_\theta p_\theta(x)}{p_\theta(x)} \right) dx = \int \nabla_\theta p_\theta(x) dx$$
Assuming standard regularity conditions (the Leibniz integral rule applies, permitting the interchange of derivative and integral):
$$\int \nabla_\theta p_\theta(x) dx = \nabla_\theta \int p_\theta(x) dx$$
Since $p_\theta(x)$ is a valid probability density for all $\theta$, its integral over the support is identically $1$:
$$\int p_\theta(x) dx = 1 \quad \forall \theta$$
Therefore:
$$\nabla_\theta (1) = \mathbf{0}$$
Hence, $\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \mathbf{0}$. $\blacksquare$

---

### Worked Example 6.5: Analytical Policy Gradient in a Multi-Armed Bandit
**Problem:** A 2-armed bandit has payoffs $R(a_1) = 2.0$ and $R(a_2) = 1.0$.
Actions are selected via softmax policy with scalar parameter $\theta$:
$$\pi_\theta(a_1) = \frac{e^\theta}{e^\theta + e^{-\theta}} = \sigma(2\theta), \quad \pi_\theta(a_2) = 1 - \pi_\theta(a_1) = \frac{e^{-\theta}}{e^\theta + e^{-\theta}}$$
1. Express expected return $J(\theta)$ analytically as a function of $\theta$.
2. Compute the exact analytical derivative $\frac{dJ}{d\theta}$.
3. Show that $\frac{dJ}{d\theta} = \mathbb{E}_{a \sim \pi}[\nabla_\theta \log \pi_\theta(a) R(a)]$.

**Solution:**
1. Expected return:
$$J(\theta) = \pi_\theta(a_1) R(a_1) + \pi_\theta(a_2) R(a_2) = 2.0 \cdot \sigma(2\theta) + 1.0 \cdot (1 - \sigma(2\theta)) = 1.0 + \sigma(2\theta)$$

2. Exact analytical derivative:
Recall that $\sigma'(z) = \sigma(z)(1 - \sigma(z))$.
$$\frac{dJ}{d\theta} = \frac{d}{d\theta}[1.0 + \sigma(2\theta)] = 2 \sigma(2\theta)(1 - \sigma(2\theta)) = 2 \pi_\theta(a_1) \pi_\theta(a_2)$$

3. Policy Gradient Theorem calculation:
- For $a_1$: $\log \pi(a_1) = \theta - \log(e^\theta + e^{-\theta})$.
  $$\frac{d \log \pi(a_1)}{d\theta} = 1 - \frac{e^\theta - e^{-\theta}}{e^\theta + e^{-\theta}} = 1 - (\pi(a_1) - \pi(a_2)) = 1 - \pi(a_1) + \pi(a_2) = 2 \pi(a_2)$$
- For $a_2$: $\log \pi(a_2) = -\theta - \log(e^\theta + e^{-\theta})$.
  $$\frac{d \log \pi(a_2)}{d\theta} = -1 - (\pi(a_1) - \pi(a_2)) = -2 \pi(a_1)$$
Now compute the expectation:
$$\mathbb{E}_{a \sim \pi}\left[\frac{d \log \pi(a)}{d\theta} R(a)\right] = \pi(a_1) [2 \pi(a_2) \cdot 2.0] + \pi(a_2) [-2 \pi(a_1) \cdot 1.0]$$
$$= 4 \pi(a_1)\pi(a_2) - 2 \pi(a_1)\pi(a_2) = 2 \pi(a_1)\pi(a_2)$$
The expectation derived via the score function trick matches the true analytical derivative $\frac{dJ}{d\theta}$ with 100% mathematical precision.

---

### Worked Example 6.6: Variance Comparison: Full Trajectory Return vs Reward-to-Go
**Problem:** Consider a 2-step trajectory where actions $a_0, a_1$ are taken, generating rewards $r_1, r_2$.
Suppose $r_1$ and $r_2$ are independent random variables with $\mathbb{V}[r_1] = 9.0$ and $\mathbb{V}[r_2] = 16.0$.
Assume score function $\nabla \log \pi_0$ is independent of rewards and has unit variance $\mathbb{V}[\nabla \log \pi_0] = 1.0$, with mean 0.
1. Compute the variance of the gradient estimator for step $t=0$ using the full return $R(\tau) = r_1 + r_2$.
2. Compute the variance using Reward-to-Go $G_0 = r_1 + r_2$.
3. Compute the variance of the gradient estimator for step $t=1$ using full return $R(\tau)$ vs Reward-to-Go $G_1 = r_2$.

**Solution:**
1. For step $t=0$:
Reward-to-Go $G_0 = r_1 + r_2 = R(\tau)$. Both estimators are identical at $t=0$:
$$\mathbb{V}[\nabla \log \pi_0 \cdot (r_1 + r_2)] = \mathbb{E}[(\nabla \log \pi_0)^2] \mathbb{E}[(r_1 + r_2)^2] = 1.0 \times (9.0 + 16.0) = 25.0$$

2. For step $t=1$:
- Full Return Estimator: $g_{\text{full}} = \nabla \log \pi_1 \cdot (r_1 + r_2)$.
  $$\mathbb{V}[g_{\text{full}}] = \mathbb{V}[\nabla \log \pi_1] \cdot (\mathbb{V}[r_1] + \mathbb{V}[r_2]) = 1.0 \times (9.0 + 16.0) = 25.0$$
- Reward-to-Go Estimator: $g_{\text{rtg}} = \nabla \log \pi_1 \cdot r_2$.
  $$\mathbb{V}[g_{\text{rtg}}] = \mathbb{V}[\nabla \log \pi_1] \cdot \mathbb{V}[r_2] = 1.0 \times 16.0 = 16.0$$

3. Comparison:
At step $t=1$, eliminating the past reward $r_1$ reduces the estimator variance from $25.0$ down to $16.0$â€”a **$36\%$ variance reduction** without introducing any bias. In trajectories of length $T=1000$, Reward-to-Go reduces variance by over $99\%$.

---

### Worked Example 6.7: Numerical Policy Gradient Step on CartPole Action Logits
**Problem:** An agent in CartPole has state $s = [0.05, 0.20, -0.03, -0.10]^\top$ (cart position, velocity, pole angle, pole tip velocity).
Policy has 2 actions: $a_0 = \text{Left}, a_1 = \text{Right}$.
Parameters are linear weights $\mathbf{W} \in \mathbb{R}^{2 \times 4}$:
$$\mathbf{W}_0 = [0.1, -0.2, 0.5, 0.3], \quad \mathbf{W}_1 = [-0.1, 0.2, -0.5, -0.3]$$
1. Compute the logits $h_0 = \mathbf{W}_0 s$ and $h_1 = \mathbf{W}_1 s$.
2. Compute the action probabilities $\pi(a_0 \mid s)$ and $\pi(a_1 \mid s)$.
3. Suppose action $a_1$ was executed, and achieved Reward-to-Go $G = +15.0$. Compute the gradient vector $\nabla_{\mathbf{W}_1} \log \pi(a_1 \mid s)$ and the parameter update $\Delta \mathbf{W}_1$ with $\alpha = 0.01$.

**Solution:**
1. Logits calculation:
$$h_0 = 0.1(0.05) + (-0.2)(0.20) + 0.5(-0.03) + 0.3(-0.10) = 0.005 - 0.040 - 0.015 - 0.030 = -0.080$$
$$h_1 = -0.1(0.05) + 0.2(0.20) + (-0.5)(-0.03) + (-0.3)(-0.10) = -0.005 + 0.040 + 0.015 + 0.030 = +0.080$$

2. Probabilities via Softmax:
$$\exp(h_0) = e^{-0.080} \approx 0.9231$$
$$\exp(h_1) = e^{+0.080} \approx 1.0833$$
$$\text{Sum} = 0.9231 + 1.0833 = 2.0064$$
$$\pi(a_0 \mid s) = \frac{0.9231}{2.0064} \approx 0.4601$$
$$\pi(a_1 \mid s) = \frac{1.0833}{2.0064} \approx 0.5399$$

3. Gradient and Update:
For chosen action $a_1$, from Worked Example 6.1:
$$\nabla_{\mathbf{W}_1} \log \pi(a_1 \mid s) = (1 - \pi(a_1 \mid s)) s = (1 - 0.5399) s = 0.4601 \times \begin{bmatrix} 0.05 \\ 0.20 \\ -0.03 \\ -0.10 \end{bmatrix} = \begin{bmatrix} 0.0230 \\ 0.0920 \\ -0.0138 \\ -0.0460 \end{bmatrix}$$
Parameter update with $\alpha = 0.01$ and $G = 15.0$:
$$\Delta \mathbf{W}_1 = \alpha \cdot G \cdot \nabla_{\mathbf{W}_1} \log \pi = 0.01 \times 15.0 \times \begin{bmatrix} 0.0230 \\ 0.0920 \\ -0.0138 \\ -0.0460 \end{bmatrix} = 0.15 \times \begin{bmatrix} 0.0230 \\ 0.0920 \\ -0.0138 \\ -0.0460 \end{bmatrix} = \begin{bmatrix} 0.00345 \\ 0.01380 \\ -0.00207 \\ -0.00690 \end{bmatrix}$$

---

### Worked Example 6.8: Gaussian Policy Log-Std Gradient Derivation
**Problem:** Let $\pi(a \mid s) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left(-\frac{(a - \mu)^2}{2\sigma^2}\right)$. Let the policy parameterize the log-standard deviation directly: $\omega = \log \sigma \implies \sigma = e^\omega$.
1. Derive the partial derivative $\frac{\partial \log \pi(a \mid s)}{\partial \omega}$.
2. If action $a$ was sampled very close to mean $\mu$ ($|a - \mu| < \sigma$), what is the sign of the gradient $\frac{\partial \log \pi}{\partial \omega}$?
3. What is the behavioral consequence of updating $\omega$ when returns are positive?

**Solution:**
1. Express log-probability in terms of $\omega$:
$$\log \pi(a \mid s) = -\frac{1}{2}\log(2\pi) - \omega - \frac{(a - \mu)^2}{2 e^{2\omega}}$$
Differentiate with respect to $\omega$:
$$\frac{\partial \log \pi}{\partial \omega} = -1 - \frac{(a - \mu)^2}{2} \cdot (-2 e^{-2\omega}) = -1 + \frac{(a - \mu)^2}{e^{2\omega}} = \frac{(a - \mu)^2}{\sigma^2} - 1$$

2. Sign analysis:
If $|a - \mu| < \sigma$, then $\frac{(a - \mu)^2}{\sigma^2} < 1$.
$$\frac{\partial \log \pi}{\partial \omega} = \frac{(a - \mu)^2}{\sigma^2} - 1 < 0$$
The gradient with respect to $\omega$ is **strictly negative**.

3. Behavioral consequence:
If an action near the mean achieves high positive return $G_t > 0$, the update is $\Delta \omega \propto \text{negative} \times \text{positive} < 0$.
The log-std $\omega$ decreases, shrinking $\sigma$. This narrows the Gaussian bell curve around the successful mean, reducing exploration and consolidating the agent's behavior around the winning action!

---

### Worked Example 6.9: Trajectory-Level Monte Carlo Gradient TypeScript Implementation
**Problem:** Author a TypeScript function `computeTrajectoryPolicyGradients` that takes an array of state transitions along an episode, computes the Reward-to-Go $G_t$ for each step with discount $\gamma$, calculates the softmax policy gradients, and returns the accumulated weight updates.

**Solution:**
```typescript
export interface TrajectoryStep {
  state: number[];
  action: number; // Discrete action index (0 to K-1)
  reward: number;
}

export function computeTrajectoryPolicyGradients(
  trajectory: TrajectoryStep[],
  numActions: number,
  stateDim: number,
  weights: number[][], // K x stateDim
  gamma: number = 0.99
): number[][] {
  const T = trajectory.length;
  // 1. Compute Reward-to-Go G_t backward in time: G_t = r_{t+1} + gamma * G_{t+1}
  const returns = new Float64Array(T);
  let runningReturn = 0;
  for (let t = T - 1; t >= 0; t--) {
    runningReturn = trajectory[t].reward + gamma * runningReturn;
    returns[t] = runningReturn;
  }

  // Initialize gradient accumulator matrix (K x stateDim)
  const gradAcc: number[][] = Array.from({ length: numActions }, () => new Array(stateDim).fill(0));

  // 2. Accumulate policy gradients
  for (let t = 0; t < T; t++) {
    const step = trajectory[t];
    const G_t = returns[t];

    // Compute softmax probabilities
    const logits = new Float64Array(numActions);
    let maxLogit = -Infinity;
    for (let a = 0; a < numActions; a++) {
      let dot = 0;
      for (let d = 0; d < stateDim; d++) dot += weights[a][d] * step.state[d];
      logits[a] = dot;
      if (dot > maxLogit) maxLogit = dot;
    }

    let sumExp = 0;
    const probs = new Float64Array(numActions);
    for (let a = 0; a < numActions; a++) {
      probs[a] = Math.exp(logits[a] - maxLogit);
      sumExp += probs[a];
    }
    for (let a = 0; a < numActions; a++) probs[a] /= sumExp;

    // Score function: grad_{W_a} log pi = (I(a == action) - pi(a)) * state
    for (let a = 0; a < numActions; a++) {
      const indicator = a === step.action ? 1.0 : 0.0;
      const factor = (indicator - probs[a]) * G_t;
      for (let d = 0; d < stateDim; d++) {
        gradAcc[a][d] += factor * step.state[d];
      }
    }
  }

  return gradAcc;
}
```

---

### Worked Example 6.10: Complete Verification of On-Policy Expectation Equivalence
**Problem:** Consider a 1-state MDP with 2 actions: $a_1$ gives reward $R_1$, $a_2$ gives reward $R_2$.
Policy probability $\pi(a_1) = p$, $\pi(a_2) = 1-p$.
Show that the Monte Carlo sample mean of the gradient over $M$ independent trials converges almost surely to the true analytical gradient $\nabla_p J = R_1 - R_2$ as $M \to \infty$.

**Solution:**
Objective:
$$J(p) = p R_1 + (1 - p) R_2 \implies \nabla_p J(p) = R_1 - R_2$$
Score functions:
$$\nabla_p \log \pi(a_1) = \frac{1}{p}, \quad \nabla_p \log \pi(a_2) = -\frac{1}{1 - p}$$
Let $A_1, \dots, A_M$ be $M$ independent action draws from policy $\pi$.
The empirical Monte Carlo estimator is:
$$\hat{g}_M = \frac{1}{M}\sum_{i=1}^M \nabla_p \log \pi(A_i) R(A_i)$$
Let $M_1$ be the number of times $a_1$ was drawn, and $M_2 = M - M_1$ be the number of times $a_2$ was drawn.
$$\hat{g}_M = \frac{1}{M}\left[ M_1 \left( \frac{1}{p} R_1 \right) + M_2 \left( -\frac{1}{1 - p} R_2 \right) \right] = \left( \frac{M_1}{M} \frac{1}{p} \right) R_1 - \left( \frac{M_2}{M} \frac{1}{1 - p} \right) R_2$$
By the Strong Law of Large Numbers (SLLN):
$$\lim_{M \to \infty} \frac{M_1}{M} \overset{\text{a.s.}}{=} p, \quad \lim_{M \to \infty} \frac{M_2}{M} \overset{\text{a.s.}}{=} 1 - p$$
Substituting these limits:
$$\lim_{M \to \infty} \hat{g}_M \overset{\text{a.s.}}{=} \left( \frac{p}{p} \right) R_1 - \left( \frac{1 - p}{1 - p} \right) R_2 = R_1 - R_2 = \nabla_p J(p)$$
The sample average converges directly and rigorously to the true analytical gradient.

---

## 6.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 6.1: Score Function of Dirichlet Policy for Simplex Actions
**Problem:** In portfolio allocation or resource management, action $\mathbf{a} \in \mathbb{R}^K$ lies on the probability simplex ($\sum_i a_i = 1, a_i > 0$).
The action distribution is a Dirichlet distribution parameterized by concentration parameters $\boldsymbol{\alpha} = (\alpha_1, \dots, \alpha_K)$:
$$p(\mathbf{a}; \boldsymbol{\alpha}) = \frac{1}{\text{B}(\boldsymbol{\alpha})} \prod_{i=1}^K a_i^{\alpha_i - 1}$$
where $\text{B}(\boldsymbol{\alpha}) = \frac{\prod_{i=1}^K \Gamma(\alpha_i)}{\Gamma(\sum_{i=1}^K \alpha_i)}$.
Derive the score function $\nabla_{\alpha_k} \log p(\mathbf{a}; \boldsymbol{\alpha})$ in terms of the digamma function $\psi(x) = \frac{d}{dx} \log \Gamma(x)$.

**Solution:**
Take the natural logarithm of the density:
$$\log p(\mathbf{a}; \boldsymbol{\alpha}) = -\log \text{B}(\boldsymbol{\alpha}) + \sum_{i=1}^K (\alpha_i - 1) \log a_i$$
$$= \log \Gamma\left(\sum_{i=1}^K \alpha_i\right) - \sum_{i=1}^K \log \Gamma(\alpha_i) + \sum_{i=1}^K (\alpha_i - 1) \log a_i$$
Differentiating with respect to $\alpha_k$:
$$\frac{\partial \log p(\mathbf{a}; \boldsymbol{\alpha})}{\partial \alpha_k} = \psi\left(\sum_{i=1}^K \alpha_i\right) - \psi(\alpha_k) + \log a_k$$
This provides the exact, closed-form score function for training Dirichlet policies on bounded resource allocation simplices.

---

### Exercise 6.2: Fisher Information Matrix and Natural Policy Gradient
**Problem:** The Fisher Information Matrix (FIM) of policy $\pi_{\boldsymbol{\theta}}$ is defined as:
$$\mathbf{F}(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^\pi, a \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s)^\top \right]$$
1. Prove that $\mathbf{F}(\boldsymbol{\theta})$ is positive semi-definite.
2. Define the Natural Policy Gradient update direction $\tilde{\nabla}_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$.
3. Why does the Natural Policy Gradient provide invariance to parameter coordinate transformations?

**Solution:**
1. Let $\mathbf{z} \in \mathbb{R}^d$ be an arbitrary non-zero vector.
$$\mathbf{z}^\top \mathbf{F}(\boldsymbol{\theta}) \mathbf{z} = \mathbf{z}^\top \mathbb{E}\left[ \nabla \log \pi \nabla \log \pi^\top \right] \mathbf{z} = \mathbb{E}\left[ \mathbf{z}^\top \nabla \log \pi \nabla \log \pi^\top \mathbf{z} \right] = \mathbb{E}\left[ (\mathbf{z}^\top \nabla \log \pi)^2 \right]$$
Since the square of any real scalar is non-negative: $(\mathbf{z}^\top \nabla \log \pi)^2 \ge 0$.
The expectation of a non-negative quantity is non-negative: $\mathbf{z}^\top \mathbf{F} \mathbf{z} \ge 0$.
Hence, $\mathbf{F}(\boldsymbol{\theta})$ is positive semi-definite.

2. The Natural Policy Gradient (Kakade, 2001) is defined by pre-multiplying the vanilla policy gradient by the inverse Fisher matrix:
$$\tilde{\nabla}_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbf{F}(\boldsymbol{\theta})^{-1} \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$

3. Invariance:
Standard gradient descent depends on the Euclidean geometry of the arbitrary parameter coordinates $\boldsymbol{\theta}$.
The Natural Policy Gradient defines the steepest ascent direction on the Riemannian manifold of probability distributions endowed with the Fisher-Rao metric (equivalent to infinitesimal KL-divergence steps: $D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta} + \Delta \boldsymbol{\theta}}) \le \epsilon$). It ensures that policy updates are invariant to arbitrary reparameterizations of the neural network.

---

### Exercise 6.3: Continuous Action Beta Distribution Policy
**Problem:** In continuous control with bounded actions $a \in [0, 1]$, Gaussian policies suffer from boundary truncation issues. A Beta distribution $\text{Beta}(\alpha, \beta)$ naturally constrains actions to $[0, 1]$:
$$p(a; \alpha, \beta) = \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)} a^{\alpha - 1} (1 - a)^{\beta - 1}$$
Derive the score function vector $\nabla_{[\alpha, \beta]^\top} \log p(a; \alpha, \beta)$.

**Solution:**
Log-density:
$$\log p(a; \alpha, \beta) = \log \Gamma(\alpha + \beta) - \log \Gamma(\alpha) - \log \Gamma(\beta) + (\alpha - 1)\log a + (\beta - 1)\log(1 - a)$$
Partial derivative with respect to $\alpha$:
$$\frac{\partial \log p}{\partial \alpha} = \psi(\alpha + \beta) - \psi(\alpha) + \log a$$
Partial derivative with respect to $\beta$:
$$\frac{\partial \log p}{\partial \beta} = \psi(\alpha + \beta) - \psi(\beta) + \log(1 - a)$$
Gradient vector:
$$\nabla_{[\alpha, \beta]^\top} \log p = \begin{bmatrix}
\psi(\alpha + \beta) - \psi(\alpha) + \log a \\
\psi(\alpha + \beta) - \psi(\beta) + \log(1 - a)
\end{bmatrix}$$

---

### Exercise 6.4: Constant Baseline Proof
**Problem:** Let $b \in \mathbb{R}$ be an arbitrary scalar constant that does not depend on state or action.
Prove analytically that subtracting $b$ from the return in the Policy Gradient Theorem introduces zero bias:
$$\mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) (G_t - b) \right] = \mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t \right]$$

**Solution:**
By linearity of expectation:
$$\mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla \log \pi_t (G_t - b) \right] = \mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla \log \pi_t G_t \right] - b \sum_{t=0}^T \mathbb{E}_{\tau} \left[ \nabla \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \right]$$
Using the Tower Property:
$$\mathbb{E}_{\tau}[\nabla \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t)] = \mathbb{E}_{s_t \sim d^\pi} \left[ \mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} [\nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \mid s_t] \right]$$
From Worked Example 6.4, the inner expectation is identically zero:
$$\mathbb{E}_{a_t \sim \pi} [\nabla \log \pi(a_t \mid s_t) \mid s_t] = \mathbf{0}$$
Therefore:
$$b \sum_{t=0}^T \mathbf{0} = \mathbf{0}$$
Subtracting constant $b$ leaves the expectation completely untouched.

---

### Exercise 6.5: Optimal Constant Baseline Derivation
**Problem:** Let the gradient estimator with scalar baseline $b$ be $\hat{\mathbf{g}}(b) = \sum_{t} \mathbf{g}_t (G_t - b)$, where $\mathbf{g}_t = \nabla \log \pi(a_t \mid s_t)$.
Find the exact scalar value $b^*$ that minimizes the variance $\mathbb{V}[\hat{\mathbf{g}}(b)] = \mathbb{E}[\|\hat{\mathbf{g}}(b) - \mathbf{g}^*\|_2^2]$.

**Solution:**
Since the expectation is independent of $b$, minimizing the variance is equivalent to minimizing the second moment:
$$f(b) = \mathbb{E}\left[ \left\| \sum_t \mathbf{g}_t (G_t - b) \right\|_2^2 \right]$$
For simplicity, consider a 1-step MDP: $\hat{\mathbf{g}} = \mathbf{g}(G - b)$.
$$f(b) = \mathbb{E}\left[ \|\mathbf{g}\|^2 (G - b)^2 \right] = \mathbb{E}[\|\mathbf{g}\|^2 G^2] - 2b \mathbb{E}[\|\mathbf{g}\|^2 G] + b^2 \mathbb{E}[\|\mathbf{g}\|^2]$$
Differentiating with respect to $b$ and setting to zero:
$$f'(b) = -2 \mathbb{E}[\|\mathbf{g}\|^2 G] + 2b \mathbb{E}[\|\mathbf{g}\|^2] = 0$$
$$b^* = \frac{\mathbb{E}\left[ \|\nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s)\|^2 G \right]}{\mathbb{E}\left[ \|\nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s)\|^2 \right]}$$
The optimal baseline is a return expectation weighted by the squared magnitude of the policy gradient score!

---

### Exercise 6.6: Off-Policy Policy Gradient and Importance Weight Product
**Problem:** Suppose trajectories $\tau$ are generated by a fixed behavioral policy $\mu(a \mid s)$, but we wish to estimate the policy gradient of target policy $\pi_{\boldsymbol{\theta}}$.
1. Write the importance sampling ratio $\rho(\tau)$ for trajectory $\tau = (s_0, a_0, \dots, s_T)$.
2. Formulate the off-policy policy gradient estimator.
3. Why does the variance of $\rho(\tau)$ explode exponentially with trajectory length $T$?

**Solution:**
1. Trajectory importance weight:
$$\rho(\tau) = \frac{P(\tau; \pi_{\boldsymbol{\theta}})}{P(\tau; \mu)} = \frac{\rho_0(s_0) \prod_{t=0}^T \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)}{\rho_0(s_0) \prod_{t=0}^T \mu(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)} = \prod_{t=0}^T \frac{\pi_{\boldsymbol{\theta}}(a_t \mid s_t)}{\mu(a_t \mid s_t)}$$
Environmental dynamics cancel out.

2. Off-policy gradient estimator:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim \mu} \left[ \left(\prod_{k=0}^T \frac{\pi_{\boldsymbol{\theta}}(a_k \mid s_k)}{\mu(a_k \mid s_k)}\right) \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t \right]$$

3. Variance explosion:
The importance ratio is a product of $T$ independent terms: $\rho(\tau) = \prod_{t=0}^T w_t$.
The variance of a product of independent random variables scales as:
$$\mathbb{V}\left[\prod_{t=0}^T w_t\right] = \prod_{t=0}^T (\mathbb{V}[w_t] + 1) - 1 \sim \mathcal{O}(c^T) \quad \text{for } c > 1$$
As trajectory length $T$ grows, the variance explodes exponentially. Almost all sampled trajectories have weight near zero, while a single rare trajectory has a catastrophic weight, causing the estimator to diverge.

---

### Exercise 6.7: Reparameterization Trick vs Score Function Estimator
**Problem:** For continuous actions $a \sim \mathcal{N}(\mu_\theta, \sigma^2)$, we can estimate $\nabla_\theta \mathbb{E}[f(a)]$ via:
- Method 1 (Score Function / REINFORCE): $\mathbb{E}_{a \sim \pi}[\nabla_\theta \log \pi_\theta(a) f(a)]$.
- Method 2 (Pathwise Derivative / Reparameterization): $a = \mu_\theta + \sigma \epsilon$ where $\epsilon \sim \mathcal{N}(0, 1)$, yielding $\mathbb{E}_{\epsilon}[\nabla_a f(a) \nabla_\theta a]$.
Compare both methods in terms of variance and requirements on function $f$.

**Solution:**
1. **Requirements on $f$:**
- Score Function: Requires only that $f(a)$ can be evaluated as a black-box scalar. $f$ does not need to be differentiable, continuous, or even known analytically (can be an external physical simulator or game engine).
- Pathwise Derivative: Requires $f(a)$ to be explicitly differentiable with respect to $a$, and requires access to $\nabla_a f(a)$.

2. **Variance:**
- The Score Function estimator treats $f(a)$ as a scalar weight multiplying $\nabla \log \pi$. It suffers from high variance because it does not know *which direction* in action space would increase $f$.
- The Pathwise Derivative directly propagates the gradient vector $\nabla_a f(a)$ through the action. In continuous control, the reparameterization trick exhibits orders of magnitude lower variance and is the foundation of modern algorithms like DDPG, SAC, and VAEs.

---

### Exercise 6.8: Deterministic Policy Gradient Theorem Equivalence
**Problem:** Silver et al. (2014) proved the Deterministic Policy Gradient (DPG) Theorem for deterministic policy $a = \mu_\theta(s)$:
$$\nabla_\theta J(\theta) = \mathbb{E}_{s \sim d^\mu} \left[ \nabla_\theta \mu_\theta(s) \nabla_a Q^\mu(s, a) \big|_{a = \mu_\theta(s)} \right]$$
Show that as the variance of a Gaussian stochastic policy $\pi_{\theta, \sigma} = \mathcal{N}(\mu_\theta(s), \sigma^2 \mathbf{I})$ approaches zero ($\sigma \to 0$), the stochastic policy gradient converges to the deterministic policy gradient.

**Solution:**
From the Policy Gradient Theorem:
$$\nabla_\theta J = \int d^\pi(s) \int \nabla_\theta \pi_{\theta, \sigma}(a \mid s) Q^\pi(s, a) da ds$$
Using the identity $\nabla_\theta \pi = \nabla_a \pi \cdot \left(-\nabla_\theta \mu_\theta(s)\right)$ for a Gaussian density $p(a - \mu_\theta)$:
$$\int \nabla_\theta \pi(a \mid s) Q(s, a) da = -\nabla_\theta \mu_\theta(s) \int \nabla_a \pi(a \mid s) Q(s, a) da$$
Integrating by parts with respect to $a$:
$$-\nabla_\theta \mu_\theta(s) \left[ \pi(a \mid s) Q(s, a) \Big|_{-\infty}^\infty - \int \pi(a \mid s) \nabla_a Q(s, a) da \right] = \nabla_\theta \mu_\theta(s) \int \pi(a \mid s) \nabla_a Q(s, a) da$$
Now take the limit as variance $\sigma \to 0$. The Gaussian distribution $\pi(a \mid s)$ converges to the Dirac delta distribution $\delta(a - \mu_\theta(s))$:
$$\lim_{\sigma \to 0} \int \pi(a \mid s) \nabla_a Q(s, a) da = \nabla_a Q(s, a) \Big|_{a = \mu_\theta(s)}$$
Substituting back yields:
$$\lim_{\sigma \to 0} \nabla_\theta J(\theta) = \mathbb{E}_{s \sim d^\mu} \left[ \nabla_\theta \mu_\theta(s) \nabla_a Q(s, a) \big|_{a = \mu_\theta(s)} \right]$$
The stochastic policy gradient smoothly degenerates into the deterministic policy gradient.

---

### Exercise 6.9: Multi-Agent Matrix Game Policy Gradient Dynamics
**Problem:** In the zero-sum game Matching Pennies, Player 1 chooses action with probability $p = \sigma(\theta_1)$, and Player 2 chooses action with probability $q = \sigma(\theta_2)$.
The payoff matrix for Player 1 is:
$$R_1(a_1, a_1) = +1, \quad R_1(a_1, a_2) = -1, \quad R_1(a_2, a_1) = -1, \quad R_1(a_2, a_2) = +1$$
1. Express expected payoff $J_1(p, q)$ as a bilinear form in $p$ and $q$.
2. Compute the policy gradients $\frac{\partial J_1}{\partial p}$ and $\frac{\partial J_2}{\partial q}$ (where $J_2 = -J_1$).
3. Show that independent policy gradient ascent yields non-convergent, circular orbits in probability space.

**Solution:**
1. Expected payoff:
$$J_1(p, q) = p q (+1) + p(1-q)(-1) + (1-p)q(-1) + (1-p)(1-q)(+1)$$
$$= pq - p + pq - q + pq + 1 - p - q + pq = 4pq - 2p - 2q + 1 = (2p - 1)(2q - 1)$$

2. Payoff gradients:
- For Player 1: $\frac{\partial J_1}{\partial p} = 2(2q - 1) = 4q - 2$.
- For Player 2: Player 2 minimizes $J_1 \implies$ maximizes $J_2 = -J_1 = -(2p-1)(2q-1)$.
  $$\frac{\partial J_2}{\partial q} = -2(2p - 1) = 2 - 4p$$

3. Dynamical system:
Continuous-time gradient dynamics:
$$\dot{p} = 4q - 2, \quad \dot{q} = 2 - 4p$$
Let $x = p - 0.5$ and $y = q - 0.5$:
$$\dot{x} = 4y, \quad \dot{y} = -4x$$
Differentiating again:
$$\ddot{x} = 4\dot{y} = 4(-4x) = -16x \implies \ddot{x} + 16x = 0$$
This is the differential equation of a **harmonic oscillator**!
The trajectory traces concentric closed circles in state space: $x(t)^2 + y(t)^2 = C$. The policies continuously circle the Nash equilibrium $(0.5, 0.5)$ without ever converging to it.

---

### Exercise 6.10: Complete TypeScript Implementation of Continuous Gaussian Policy Gradient
**Problem:** Write a production-grade TypeScript class `GaussianPolicy` that implements:
1. Continuous forward pass predicting mean $\mu(s)$ and log-std $\omega = \log \sigma$.
2. Sampling via Box-Muller transform.
3. Analytical score function evaluation $\nabla_{\boldsymbol{\theta}} \log \pi(a \mid s)$.
4. Gradient ascent update step with Reward-to-Go.

**Solution:**
```typescript
export class GaussianPolicy {
  public weightsMu: number[]; // Dimension: stateDim
  public biasMu: number = 0;
  public logStd: number = 0; // Scalar log-std

  constructor(public readonly stateDim: number) {
    this.weightsMu = new Array(stateDim).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }

  // Predict distribution mean
  predictMean(state: number[]): number {
    let mean = this.biasMu;
    for (let i = 0; i < this.stateDim; i++) {
      mean += this.weightsMu[i] * state[i];
    }
    return mean;
  }

  // Sample continuous action using Box-Muller transform
  sampleAction(state: number[]): { action: number; mean: number; std: number } {
    const mean = this.predictMean(state);
    const std = Math.exp(this.logStd);

    // Box-Muller standard normal draw
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const action = mean + std * z0;

    return { action, mean, std };
  }

  // Compute log-probability score functions
  // grad_mu = (a - mu) / (sigma^2)
  // grad_logStd = ((a - mu)^2 / sigma^2) - 1
  computeScores(state: number[], action: number): {
    gradWeightsMu: number[];
    gradBiasMu: number;
    gradLogStd: number;
  } {
    const mean = this.predictMean(state);
    const std = Math.exp(this.logStd);
    const varr = std * std;
    const diff = action - mean;

    const gradMean = diff / varr;
    const gradWeightsMu = state.map((s) => gradMean * s);
    const gradBiasMu = gradMean;
    const gradLogStd = (diff * diff) / varr - 1.0;

    return { gradWeightsMu, gradBiasMu, gradLogStd };
  }

  // Apply policy gradient step with learning rate alpha and return G
  applyGradient(
    state: number[],
    action: number,
    returnG: number,
    alpha: number = 0.001
  ): void {
    const { gradWeightsMu, gradBiasMu, gradLogStd } = this.computeScores(state, action);

    for (let i = 0; i < this.stateDim; i++) {
      this.weightsMu[i] += alpha * returnG * gradWeightsMu[i];
    }
    this.biasMu += alpha * returnG * gradBiasMu;
    this.logStd += alpha * returnG * gradLogStd;
  }
}
```

Verification Test:
```typescript
const policy = new GaussianPolicy(2);
const sample = policy.sampleAction([1.0, -0.5]);
console.log(`Sampled action: ${sample.action.toFixed(4)}, mean: ${sample.mean.toFixed(4)}`);
policy.applyGradient([1.0, -0.5], sample.action, 10.0, 0.01);
console.log("Updated biasMu:", policy.biasMu);
console.log("Updated logStd:", policy.logStd);
```


# Chapter 7: REINFORCE: Monte Carlo Policy Gradients and Variance Reduction with Baselines

---

## 7.1 The Canonical REINFORCE Algorithm

In Chapter 6, we derived the theoretical foundations of the Policy Gradient Theorem:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{\tau \sim \pi_{\boldsymbol{\theta}}} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t \right]$$
where $G_t = \sum_{k=t}^T \gamma^{k-t} r_{k+1}$ is the causal Reward-to-Go.

Williams (1992) synthesized this insight into the canonical **REINFORCE** algorithm (an acronym for *REward Increment = Nonnegative Factor $\times$ Offset Reinforcement $\times$ Characteristic Eligibility*). 

REINFORCE is an **on-policy, episodic Monte Carlo** policy gradient algorithm:
1. The agent executes policy $\pi_{\boldsymbol{\theta}}$ in the environment to generate a complete, full-length trajectory from initial state $s_0$ to terminal state $s_T$:
$$\tau = (s_0, a_0, r_1, s_1, a_1, r_2, \dots, s_{T-1}, a_{T-1}, r_T, s_T)$$
2. Once the episode terminates, the agent iterates backward from $t = T-1$ down to $0$, accumulating the exact discounted returns $G_t$.
3. The policy parameters are updated via stochastic gradient ascent across all $T$ time steps:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \sum_{t=0}^{T-1} \gamma^t \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) G_t$$

```
                       THE REINFORCE EXECUTION CYCLE
                       
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 1. Collect Full Episode Rollout:                           â”‚
   â”‚    s_0 â”€â”€a_0â”€â”€â–º s_1 â”€â”€a_1â”€â”€â–º s_2 â”€â”€ ... â”€â”€â–º s_{T-1} â”€â”€â–º s_T  â”‚
   â”‚    r_1          r_2          r_3            r_T             â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚ Episode Terminates
                                  â–¼
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 2. Backward Pass: Compute Exact Monte Carlo Returns G_t    â”‚
   â”‚    G_T = 0                                                  â”‚
   â”‚    G_{t} = r_{t+1} + Î³ Â· G_{t+1}   (for t = T-1, ..., 0)    â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â–¼
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 3. Policy Parameter Update:                                â”‚
   â”‚    Î¸ â† Î¸ + Î± âˆ‘_{t=0}^{T-1} Î³^t âˆ‡_Î¸ log Ï€_Î¸(a_t | s_t) G_t   â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 7.2 The High Variance Pathology of Monte Carlo Estimation

While REINFORCE is guaranteed to be an **unbiased** estimator of the true policy gradient ($\mathbb{E}[\hat{\mathbf{g}}] = \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$), in practice it exhibits extreme, crippling **variance**.

### The Dispersion of Trajectories
In an environment of horizon $T = 500$, the return $G_t$ is a sum of hundreds of stochastic rewards:
$$G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots + \gamma^{T-t} r_T$$

At every single intermediate transition $k$, two independent stochastic mechanisms inject random noise:
1. **Stochastic Action Selection:** $a_k \sim \pi_{\boldsymbol{\theta}}(\cdot \mid s_k)$.
2. **Stochastic Environmental Transitions:** $s_{k+1} \sim \mathcal{P}(\cdot \mid s_k, a_k)$.

Because the trajectory return $G_t$ is accumulated along the entire future branch of the execution tree, the variance of $G_t$ compounds multiplicatively and additively:
$$\mathbb{V}[G_t] = \sum_{k=t}^T \gamma^{2(k-t)} \mathbb{V}[r_{k+1}] + 2 \sum_{k < l} \gamma^{k+l-2t} \text{Cov}(r_k, r_l)$$

In many environments (such as cart-pole balancing or robotic locomotion), identical actions $a_t$ taken from identical states $s_t$ can lead to vastly divergent outcomes due to tiny differences in future random draws:
- Rollout 1: Future actions happen to balance well $\implies G_t^{(1)} = +500$.
- Rollout 2: A slight perturbation 20 steps later triggers a crash $\implies G_t^{(2)} = +20$.

When the policy gradient is updated:
$$\Delta \boldsymbol{\theta} \propto \nabla_{\boldsymbol{\theta}} \log \pi(a_t \mid s_t) G_t$$
the gradient magnitude swings violently between massive positive surges and tiny updates. The Signal-to-Noise Ratio (SNR) of the empirical gradient collapses:
$$\text{SNR} = \frac{\|\mathbb{E}[\hat{\mathbf{g}}]\|_2}{\sqrt{\mathbb{V}[\hat{\mathbf{g}}]}} \ll 1$$

To obtain a reliable ascent direction, an agent might need hundreds of thousands of sample episodes per gradient step, making vanilla REINFORCE hopelessly sample-inefficient.

---

## 7.3 State-Dependent Baselines

To tame the explosive variance of Monte Carlo returns without introducing bias, we introduce a **baseline function** $b(s)$.

Instead of multiplying the score function directly by $G_t$, we subtract an arbitrary state-dependent baseline $b(s_t)$:
$$\mathbf{g}_{\text{baseline}} = \sum_{t=0}^{T-1} \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) (G_t - b(s_t))$$

```
                         THE BASELINE CENTERING EFFECT
                         
   WITHOUT BASELINE:
   All Returns G_t > 0:      G_1 = 101,  G_2 = 100,  G_3 = 99
   All Actions Reinforced:   âˆ‡log Ï€_1 Â· 101,  âˆ‡log Ï€_2 Â· 100,  âˆ‡log Ï€_3 Â· 99
   (Every action pushed UP; differences in relative performance lost in noise!)
   
   WITH STATE-DEPENDENT BASELINE b(s) = V(s) â‰ˆ 100:
   Centered Advantages:      A_1 = +1,   A_2 = 0,    A_3 = -1
   Differential Updates:     + âˆ‡log Ï€_1 (Promote!),  0,  - âˆ‡log Ï€_3 (Penalize!)
   (High signal, near-zero variance!)
```

### The Zero-Bias Theorem
**Theorem:** For any baseline function $b(s)$ that depends *only* on state $s$ (and does *not* depend on action $a$), the expected gradient update is strictly identical to the vanilla policy gradient:
$$\mathbb{E}_{a_t \sim \pi(\cdot \mid s_t)} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) b(s_t) \right] = \mathbf{0}$$

**Proof:**
Expand the expectation over action $a_t \sim \pi_{\boldsymbol{\theta}}(\cdot \mid s_t)$ conditioned on state $s_t$:
$$\mathbb{E}_{a_t \sim \pi} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) b(s_t) \mid s_t \right] = \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \left( \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s_t) b(s_t) \right)$$

Because $b(s_t)$ does not depend on action $a$, it factors outside the summation over $a$:
$$= b(s_t) \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s_t)$$

Applying the score function identity $\nabla \log \pi = \frac{\nabla \pi}{\pi}$:
$$= b(s_t) \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \frac{\nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t)}{\pi_{\boldsymbol{\theta}}(a \mid s_t)} = b(s_t) \sum_{a \in \mathcal{A}} \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(a \mid s_t)$$

Interchanging the gradient operator and the finite sum:
$$= b(s_t) \nabla_{\boldsymbol{\theta}} \left[ \sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) \right]$$

Since the sum of action probabilities over the complete action space is identically 1 for all parameter values $\boldsymbol{\theta}$:
$$\sum_{a \in \mathcal{A}} \pi_{\boldsymbol{\theta}}(a \mid s_t) = 1 \quad \forall \boldsymbol{\theta}$$
The gradient of a constant is zero:
$$\nabla_{\boldsymbol{\theta}} (1) = \mathbf{0}$$
Therefore:
$$b(s_t) \cdot \mathbf{0} = \mathbf{0} \quad \blacksquare$$

By the Law of Total Expectation, integrating over all states $s_t \sim d^\pi$:
$$\mathbb{E}_{\tau} \left[ \sum_{t=0}^T \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) b(s_t) \right] = \mathbf{0}$$

Subtracting $b(s_t)$ introduces **zero bias**. The expectation of the gradient is untouched, while the variance can be reduced by orders of magnitude.

---

## 7.4 The Value Function as Optimal Baseline

What is the optimal baseline $b^*(s)$?
Recall the definition of the state-value function $V^\pi(s)$:
$$V^\pi(s) = \mathbb{E}_{\tau \sim \pi}[G_t \mid S_t = s]$$

The state-value function $V^\pi(s)$ represents the **expected future return** an agent achieves from state $s$ when following policy $\pi$.
When we set the baseline to the value function:
$$b(s_t) = V^\pi(s_t)$$
the centered return becomes the **Advantage Function**:
$$A^\pi(s_t, a_t) = G_t - V^\pi(s_t)$$

```
                        THE INTUITIVE MEANING OF ADVANTAGE
                        
   A(s_t, a_t) = G_t - V(s_t)
   
   â€¢ If A > 0 (G_t > V(s_t)):  Action a_t performed BETTER than average for this state.
                               --> Increase log Ï€(a_t | s_t) (Reinforce!).
                               
   â€¢ If A < 0 (G_t < V(s_t)):  Action a_t performed WORSE than average for this state.
                               --> Decrease log Ï€(a_t | s_t) (Discourage!).
```

### Training an Independent Critic Network
In practice, the true value function $V^\pi(s)$ is unknown. We parameterize a second neural network, the **Critic** $V_{\boldsymbol{\phi}}(s)$, parameterized by vector $\boldsymbol{\phi} \in \mathbb{R}^m$.

The Critic is trained via supervised regression on the observed Monte Carlo returns using Mean Squared Error:
$$\mathcal{L}(\boldsymbol{\phi}) = \frac{1}{2} \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \left( G_t - V_{\boldsymbol{\phi}}(s_t) \right)^2 \right]$$

The Critic parameters are updated via gradient descent:
$$\boldsymbol{\phi} \leftarrow \boldsymbol{\phi} + \alpha_v \sum_{t=0}^{T-1} (G_t - V_{\boldsymbol{\phi}}(s_t)) \nabla_{\boldsymbol{\phi}} V_{\boldsymbol{\phi}}(s_t)$$

The policy parameters are simultaneously updated using the empirical advantages:
$$\hat{A}_t = G_t - V_{\boldsymbol{\phi}}(s_t)$$
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha_\theta \sum_{t=0}^{T-1} \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \hat{A}_t$$

This formulationâ€”REINFORCE with a Learned Baselineâ€”is the direct conceptual bridge to modern Actor-Critic algorithms.

---

## 7.5 Entropy Regularization: Preventing Premature Policy Collapse

A notorious failure mode of policy gradient algorithms is **Premature Policy Collapse**.

Early in training, if an agent happens to receive a sequence of high rewards for a suboptimal action $a_{\text{sub}}$, the gradient update pushes $\pi(a_{\text{sub}} \mid s) \to 1.0$.
Once an action's probability reaches $1.0$, the policy becomes completely deterministic:
$$\pi(a_{\text{sub}} \mid s) = 1.0, \quad \pi(a_{\text{other}} \mid s) = 0.0$$

The score function for the remaining actions is:
$$\nabla_{\boldsymbol{\theta}} \log \pi(a_{\text{other}} \mid s) \implies \text{Action is never sampled!}$$
The agent loses all exploratory capacity, permanently locked into a poor local optimum.

To enforce sustained exploration, Williams and Peng (1991) and Mnih et al. (2016) introduced **Entropy Regularization**.

```
                         THE EFFECT OF ENTROPY REGULARIZATION
                         
   Deterministic / Collapsed:           High Entropy / Exploratory:
   Entropy H â‰ˆ 0                        Entropy H = log(|A|)
   
   Prob                                 Prob
    1.0 â”¬   â–ˆ                            1.0 â”¬
    0.8 â”‚   â–ˆ                            0.8 â”‚
    0.6 â”‚   â–ˆ                            0.6 â”‚
    0.4 â”‚   â–ˆ                            0.4 â”‚
    0.2 â”‚   â–ˆ                            0.2 â”‚   â–ˆ   â–ˆ   â–ˆ   â–ˆ
    0.0 â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â–º Actions        0.0 â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â–º Actions
            a_1 a_2 a_3                              a_1 a_2 a_3 a_4
       (Exploration Frozen!)                    (Active Exploration Maintained)
```

### Mathematical Formulation
The Shannon entropy $\mathcal{H}(\pi(\cdot \mid s))$ of a probability distribution measures its uncertainty or randomness:
$$\mathcal{H}(\pi(\cdot \mid s)) = \mathbb{E}_{a \sim \pi}[-\log \pi(a \mid s)] = - \sum_{a \in \mathcal{A}} \pi(a \mid s) \log \pi(a \mid s)$$

We augment the policy objective with an entropy bonus weighted by temperature hyperparameter $\beta_{\text{ent}} > 0$:
$$J_{\text{entropy}}(\boldsymbol{\theta}) = \mathbb{E}_{\tau} \left[ \sum_{t=0}^{T-1} \left( \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \hat{A}_t + \beta_{\text{ent}} \mathcal{H}(\pi_{\boldsymbol{\theta}}(\cdot \mid s_t)) \right) \right]$$

The total gradient update is:
$$\nabla_{\boldsymbol{\theta}} J_{\text{entropy}}(\boldsymbol{\theta}) = \sum_{t=0}^{T-1} \left( \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \hat{A}_t + \beta_{\text{ent}} \nabla_{\boldsymbol{\theta}} \mathcal{H}(\pi_{\boldsymbol{\theta}}(\cdot \mid s_t)) \right)$$

### Analytical Entropy Formulas

#### 1. Categorical Distribution (Discrete Actions)
$$\mathcal{H}(\pi) = - \sum_{i=1}^K p_i \log p_i$$
Gradient with respect to logit $h_k$:
$$\frac{\partial \mathcal{H}}{\partial h_k} = - p_k (\log p_k + \mathcal{H}(\pi))$$

#### 2. 1D Gaussian Distribution (Continuous Actions)
For $\pi(a \mid s) = \mathcal{N}(\mu(s), \sigma(s)^2)$:
$$\mathcal{H}(\mathcal{N}(\mu, \sigma^2)) = \frac{1}{2} \log\left( 2\pi e \sigma^2 \right) = \frac{1}{2} + \frac{1}{2} \log(2\pi) + \log \sigma$$
Notice that the entropy of a Gaussian depends **only** on its standard deviation $\sigma$ (or log-std $\omega = \log \sigma$), completely independent of mean $\mu$!
$$\frac{\partial \mathcal{H}}{\partial \omega} = 1.0$$
Adding an entropy bonus to a Gaussian policy applies a direct constant upward pressure of $+ \beta_{\text{ent}}$ to the log-std, preventing the policy from prematurely shrinking its variance to zero.

---

## 7.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 7.1: Backward Accumulation of Monte Carlo Returns
**Problem:** An episode of length $T = 4$ generates rewards $r_1 = +1, r_2 = +2, r_3 = 0, r_4 = +10$ with discount factor $\gamma = 0.90$.
1. Compute the Reward-to-Go $G_t$ for $t = 3, 2, 1, 0$ using the backward recurrence relation $G_t = r_{t+1} + \gamma G_{t+1}$.
2. Contrast $G_0$ with the total undiscounted return $\sum_{t=1}^4 r_t$.

**Solution:**
1. Backward recurrence (base case $G_4 = 0$):
- For $t = 3$:
  $$G_3 = r_4 + \gamma G_4 = 10 + 0.90(0) = 10.0$$
- For $t = 2$:
  $$G_2 = r_3 + \gamma G_3 = 0 + 0.90(10.0) = 9.0$$
- For $t = 1$:
  $$G_1 = r_2 + \gamma G_2 = 2 + 0.90(9.0) = 2 + 8.1 = 10.1$$
- For $t = 0$:
  $$G_0 = r_1 + \gamma G_1 = 1 + 0.90(10.1) = 1 + 9.09 = 10.09$$

2. Undiscounted return:
$$R_{\text{undiscounted}} = 1 + 2 + 0 + 10 = 13.0$$
The discounted return $G_0 = 10.09$ discounts future rewards appropriately: $1 + 0.9(2) + 0.81(0) + 0.729(10) = 1 + 1.8 + 0 + 7.29 = 10.09$.

---

### Worked Example 7.2: Empirical Variance Calculation: Vanilla REINFORCE vs Baseline
**Problem:** At state $s$, action $a_1$ is taken.
The environment produces three possible return rollouts with equal probability $\frac{1}{3}$:
$G^{(1)} = 90$, $G^{(2)} = 100$, $G^{(3)} = 110$.
Let the score function be $\nabla \log \pi(a_1 \mid s) = 2.0$.
1. Compute the mean and variance of the gradient estimator $\hat{g}_{\text{vanilla}} = \nabla \log \pi \cdot G$.
2. Compute the mean and variance of the gradient estimator with baseline $b = 100$: $\hat{g}_{\text{baseline}} = \nabla \log \pi \cdot (G - b)$.
3. Compare the variance reduction percentage.

**Solution:**
1. Vanilla REINFORCE:
Gradients:
- $\hat{g}_1 = 2.0 \times 90 = 180$
- $\hat{g}_2 = 2.0 \times 100 = 200$
- $\hat{g}_3 = 2.0 \times 110 = 220$
Mean:
$$\mathbb{E}[\hat{g}_{\text{vanilla}}] = \frac{180 + 200 + 220}{3} = \frac{600}{3} = 200$$
Variance:
$$\mathbb{V}[\hat{g}_{\text{vanilla}}] = \frac{(180 - 200)^2 + (200 - 200)^2 + (220 - 200)^2}{3} = \frac{(-20)^2 + 0 + (20)^2}{3} = \frac{400 + 400}{3} = \frac{800}{3} \approx 266.67$$

2. With Baseline $b = 100$:
Advantages: $A^{(1)} = 90 - 100 = -10, A^{(2)} = 0, A^{(3)} = +10$.
Gradients:
- $\hat{g}_1 = 2.0 \times (-10) = -20$
- $\hat{g}_2 = 2.0 \times 0 = 0$
- $\hat{g}_3 = 2.0 \times 10 = +20$
Mean:
$$\mathbb{E}[\hat{g}_{\text{baseline}}] = \frac{-20 + 0 + 20}{3} = 0$$
*(Note: Expected value of the baseline-subtracted component is $\mathbb{E}[\nabla \log \pi \cdot G] - b \mathbb{E}[\nabla \log \pi] = 200 - 100(2) = 0$ for this single action. Over all actions, the total gradient is completely identical).*
Variance:
$$\mathbb{V}[\hat{g}_{\text{baseline}}] = \frac{(-20 - 0)^2 + 0^2 + (20 - 0)^2}{3} = \frac{400 + 400}{3} \approx 266.67$$
Wait! Why was variance identical here? Because $\nabla \log \pi = 2.0$ was treated as a constant scalar for a single action!
Now consider the two-action case where $a_2$ has $\nabla \log \pi(a_2 \mid s) = -2.0$ with return 0:
In that case, the mean is non-zero and the second moment drops precipitously. Let us inspect Worked Example 7.3 for the complete two-action system.

---

### Worked Example 7.3: Variance Reduction in a 2-Action Discrete MDP
**Problem:** Consider state $s$ with two actions $a_1, a_2$ chosen with equal probability $\pi(a_1) = \pi(a_2) = 0.5$.
Score functions: $\nabla \log \pi(a_1) = +1$, $\nabla \log \pi(a_2) = -1$.
Payoffs are large but slightly differentiated: $R(a_1) = 102$, $R(a_2) = 98$.
1. Compute the true analytical gradient $\nabla J$.
2. Compute the second moment $\mathbb{E}[\hat{g}^2]$ and variance $\mathbb{V}[\hat{g}]$ of vanilla REINFORCE ($\hat{g} = \nabla \log \pi \cdot R$).
3. Compute the second moment and variance using baseline $b = \mathbb{E}[R] = 100$.

**Solution:**
1. True analytical gradient:
$$\nabla J = \mathbb{E}[\nabla \log \pi \cdot R] = 0.5(+1)(102) + 0.5(-1)(98) = 51 - 49 = +2.0$$

2. Vanilla REINFORCE:
Outcomes:
- Action 1: $\hat{g}_1 = (+1) \times 102 = 102$
- Action 2: $\hat{g}_2 = (-1) \times 98 = -98$
Second moment:
$$\mathbb{E}[\hat{g}^2] = 0.5(102^2) + 0.5((-98)^2) = 0.5(10404) + 0.5(9604) = 5202 + 4802 = 10,004$$
Variance:
$$\mathbb{V}[\hat{g}_{\text{vanilla}}] = \mathbb{E}[\hat{g}^2] - (\mathbb{E}[\hat{g}])^2 = 10,004 - (2.0)^2 = 10,004 - 4 = 10,000$$

3. With baseline $b = 100$:
Centered returns:
- Action 1: $A_1 = 102 - 100 = +2 \implies \hat{g}_1 = (+1)(+2) = +2$
- Action 2: $A_2 = 98 - 100 = -2 \implies \hat{g}_2 = (-1)(-2) = +2$
Second moment:
$$\mathbb{E}[\hat{g}^2] = 0.5(2^2) + 0.5(2^2) = 0.5(4) + 0.5(4) = 4$$
Variance:
$$\mathbb{V}[\hat{g}_{\text{baseline}}] = \mathbb{E}[\hat{g}^2] - (\mathbb{E}[\hat{g}])^2 = 4 - 2^2 = 0$$
The baseline achieves **100% variance elimination** ($\mathbb{V} = 0$). In every single trial, the estimator produces the exact gradient $+2.0$.

---

### Worked Example 7.4: Simultaneous Actor and Critic Gradient Updates
**Problem:** In REINFORCE with a Learned Baseline, state $s = [1.0, 2.0]^\top$.
Action $a_0$ is chosen from $\mathcal{A} = \{0, 1\}$.
Policy weights: $\mathbf{W}_0 = [0.2, 0.4]$, $\mathbf{W}_1 = [-0.2, -0.4]$.
Critic weights: $\mathbf{v} = [0.5, 1.5]$ (scalar value $V_{\mathbf{v}}(s) = \mathbf{v}^\top s$).
Observed return $G = 8.0$.
Learning rates: $\alpha_\theta = 0.05$, $\alpha_v = 0.1$.
1. Compute the critic prediction $V(s)$ and the advantage $\hat{A}$.
2. Compute the policy probabilities $\pi(a_0 \mid s)$ and $\pi(a_1 \mid s)$.
3. Perform the simultaneous parameter updates $\Delta \mathbf{v}$ and $\Delta \mathbf{W}_0$.

**Solution:**
1. Critic prediction and advantage:
$$V(s) = \mathbf{v}^\top s = 0.5(1.0) + 1.5(2.0) = 0.5 + 3.0 = 3.5$$
$$\hat{A} = G - V(s) = 8.0 - 3.5 = +4.5$$

2. Policy logits and probabilities:
$$h_0 = 0.2(1.0) + 0.4(2.0) = 0.2 + 0.8 = 1.0$$
$$h_1 = -0.2(1.0) - 0.4(2.0) = -0.2 - 0.8 = -1.0$$
$$\exp(h_0) = e^1 \approx 2.7183, \quad \exp(h_1) = e^{-1} \approx 0.3679, \quad \text{Sum} = 3.0862$$
$$\pi(a_0 \mid s) = \frac{2.7183}{3.0862} \approx 0.8808, \quad \pi(a_1 \mid s) \approx 0.1192$$

3. Parameter updates:
- Critic update (MSE loss $\frac{1}{2}(G - V(s))^2$):
  $$\nabla_{\mathbf{v}} V(s) = s = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix}$$
  $$\Delta \mathbf{v} = \alpha_v (G - V(s)) \nabla_{\mathbf{v}} V(s) = 0.1 \times 4.5 \times \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 0.45 \\ 0.90 \end{bmatrix}$$
- Actor update:
  $$\nabla_{\mathbf{W}_0} \log \pi(a_0 \mid s) = (1 - \pi(a_0 \mid s)) s = (1 - 0.8808) \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} = 0.1192 \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 0.1192 \\ 0.2384 \end{bmatrix}$$
  $$\Delta \mathbf{W}_0 = \alpha_\theta \cdot \hat{A} \cdot \nabla \log \pi = 0.05 \times 4.5 \times \begin{bmatrix} 0.1192 \\ 0.2384 \end{bmatrix} = 0.225 \times \begin{bmatrix} 0.1192 \\ 0.2384 \end{bmatrix} = \begin{bmatrix} 0.0268 \\ 0.0536 \end{bmatrix}$$

---

### Worked Example 7.5: Shannon Entropy and Gradient of a 3-Action Categorical Distribution
**Problem:** A policy outputs action probabilities $\mathbf{p} = [0.70, 0.20, 0.10]$ from logits $\mathbf{h} = [h_1, h_2, h_3]$.
1. Compute the Shannon entropy $\mathcal{H}(\mathbf{p}) = - \sum_{i=1}^3 p_i \ln p_i$ in nats.
2. What is the maximum possible entropy for a 3-action distribution?
3. Compute the analytical gradient vector $\nabla_{\mathbf{h}} \mathcal{H}$ of the entropy with respect to logits $\mathbf{h}$.

**Solution:**
1. Shannon entropy:
$$\ln(0.70) \approx -0.3567$$
$$\ln(0.20) \approx -1.6094$$
$$\ln(0.10) \approx -2.3026$$
$$\mathcal{H}(\mathbf{p}) = - [0.70(-0.3567) + 0.20(-1.6094) + 0.10(-2.3026)]$$
$$= - [-0.2497 - 0.3219 - 0.2303] = - [-0.8019] = 0.8019 \text{ nats}$$

2. Maximum entropy:
Achieved under uniform distribution $p_1 = p_2 = p_3 = \frac{1}{3}$:
$$\mathcal{H}_{\max} = \ln(3) \approx 1.0986 \text{ nats}$$
Current entropy is $\frac{0.8019}{1.0986} \approx 73\%$ of maximum.

3. Gradient with respect to logits:
Formula: $\frac{\partial \mathcal{H}}{\partial h_k} = - p_k (\ln p_k + \mathcal{H}(\mathbf{p}))$.
- For $k = 1$: $\frac{\partial \mathcal{H}}{\partial h_1} = -0.70(-0.3567 + 0.8019) = -0.70(0.4452) = -0.3116$.
- For $k = 2$: $\frac{\partial \mathcal{H}}{\partial h_2} = -0.20(-1.6094 + 0.8019) = -0.20(-0.8075) = +0.1615$.
- For $k = 3$: $\frac{\partial \mathcal{H}}{\partial h_3} = -0.10(-2.3026 + 0.8019) = -0.10(-1.5007) = +0.1501$.
Gradient vector: $\nabla_{\mathbf{h}} \mathcal{H} = [-0.3116, +0.1615, +0.1501]^\top$.
Notice the sum of the gradient components is $-0.3116 + 0.1615 + 0.1501 = 0$.
The gradient pushes the dominant logit ($h_1$) DOWN and pulls the rare logits ($h_2, h_3$) UP, resisting premature collapse.

---

### Worked Example 7.6: Entropy of a Diagonal Multivariate Gaussian
**Problem:** Let $\pi(\mathbf{a} \mid s) = \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$ be a $D$-dimensional multivariate Gaussian policy with diagonal covariance matrix $\boldsymbol{\Sigma} = \text{diag}(\sigma_1^2, \dots, \sigma_D^2)$.
1. Derive the closed-form expression for the differential entropy $\mathcal{H}(\pi)$.
2. For $D = 2$, $\sigma_1 = 0.5$, and $\sigma_2 = 2.0$, compute $\mathcal{H}(\pi)$.
3. Show that $\nabla_{\boldsymbol{\mu}} \mathcal{H}(\pi) = \mathbf{0}$.

**Solution:**
1. Differential entropy of a multivariate Gaussian:
$$\mathcal{H}(\pi) = \frac{1}{2} \ln \left( (2\pi e)^D \det(\boldsymbol{\Sigma}) \right)$$
For a diagonal matrix, $\det(\boldsymbol{\Sigma}) = \prod_{i=1}^D \sigma_i^2$.
$$\mathcal{H}(\pi) = \frac{1}{2} \ln \left( (2\pi e)^D \prod_{i=1}^D \sigma_i^2 \right) = \frac{D}{2} \ln(2\pi e) + \sum_{i=1}^D \ln \sigma_i = \frac{D}{2}(1 + \ln(2\pi)) + \sum_{i=1}^D \omega_i$$
where $\omega_i = \ln \sigma_i$.

2. Numerical evaluation ($D = 2, \sigma_1 = 0.5, \sigma_2 = 2.0$):
$$\det(\boldsymbol{\Sigma}) = 0.5^2 \times 2.0^2 = 0.25 \times 4.0 = 1.0$$
$$\mathcal{H}(\pi) = \frac{2}{2} \ln(2\pi e) + \frac{1}{2}\ln(1.0) = \ln(2\pi e) + 0 \approx \ln(2 \times 3.14159 \times 2.71828) = \ln(17.0795) \approx 2.8379 \text{ nats}$$

3. Mean gradient:
Because the entropy expression contains only $D$ and $\sigma_i$, it has zero dependence on mean vector $\boldsymbol{\mu}$:
$$\nabla_{\boldsymbol{\mu}} \mathcal{H}(\pi) = \mathbf{0}$$
The entropy regularization objective never distorts the predicted mean of the continuous action distribution.

---

### Worked Example 7.7: Episode Return Standardization (Whitening)
**Problem:** In many implementations of REINFORCE (e.g. OpenAI Spinning Up), returns across a mini-batch of episodes are normalized before taking gradient steps:
$$\tilde{G}_t = \frac{G_t - \mu_G}{\sigma_G + \epsilon}$$
Suppose an agent collects a batch of 4 returns: $G = [25.0, 30.0, 15.0, 50.0]$.
1. Compute the empirical mean $\mu_G$ and sample standard deviation $\sigma_G$.
2. Compute the normalized returns $\tilde{G}$.
3. Discuss the theoretical trade-off: does batch standardization introduce bias into the policy gradient?

**Solution:**
1. Mean and standard deviation:
$$\mu_G = \frac{25 + 30 + 15 + 50}{4} = \frac{120}{4} = 30.0$$
Deviations: $25 - 30 = -5, 30 - 30 = 0, 15 - 30 = -15, 50 - 30 = +20$.
Squared deviations: $25 + 0 + 225 + 400 = 650$.
Sample variance ($N-1 = 3$):
$$s^2 = \frac{650}{3} \approx 216.67 \implies \sigma_G = \sqrt{216.67} \approx 14.72$$

2. Normalized returns ($\tilde{G}_i = \frac{G_i - 30}{14.72}$):
- $\tilde{G}_1 = \frac{-5}{14.72} \approx -0.340$
- $\tilde{G}_2 = \frac{0}{14.72} = 0.000$
- $\tilde{G}_3 = \frac{-15}{14.72} \approx -1.019$
- $\tilde{G}_4 = \frac{20}{14.72} \approx +1.359$

3. Theoretical trade-off:
- **Bias:** Subtracting empirical mean $\mu_G$ acts as a constant baseline, which has zero bias. However, dividing by the *sample standard deviation* $\sigma_G$ makes the baseline dependent on all trajectories in the batch simultaneously, which introduces a tiny technical bias.
- **Empirical Benefit:** In practice, this bias is negligible ($\mathcal{O}(1/N)$), while the scaling stabilization is massive: gradient magnitudes become invariant to arbitrary reward scaling (whether rewards are measured in cents or millions of dollars), allowing the same learning rate $\alpha$ to work reliably across completely different environments.

---

### Worked Example 7.8: Credit Assignment Decay Across Long Horizons
**Problem:** In a non-terminating task, an agent takes an action at $t = 0$.
The discount factor is $\gamma = 0.95$.
At what future time step $k$ does the reward $r_{k+1}$ contribute less than $1\%$ of its original face value to the return $G_0$?

**Solution:**
The contribution of reward $r_{k+1}$ to $G_0$ is scaled by $\gamma^k$:
$$\gamma^k < 0.01$$
Taking natural logarithms of both sides:
$$k \ln(\gamma) < \ln(0.01)$$
Since $\ln(\gamma) = \ln(0.95) \approx -0.051293$ is negative, dividing flips the inequality:
$$k > \frac{\ln(0.01)}{\ln(0.95)} = \frac{-4.60517}{-0.051293} \approx 89.78$$
For $k \ge 90$ steps, the reward's discounted influence falls below $1\%$. The effective horizon of the agent is approximately $\frac{1}{1 - \gamma} = \frac{1}{0.05} = 20$ to $90$ steps.

---

### Worked Example 7.9: Policy Gradient with Moving Average Baseline
**Problem:** In low-compute environments without a full neural critic, an Exponential Moving Average (EMA) baseline is maintained across episodes:
$$b_{k+1} = \eta G^{(k)} + (1 - \eta) b_k$$
Let initial baseline $b_0 = 0$, update rate $\eta = 0.20$.
Episodes produce total returns: $G^{(1)} = 10, G^{(2)} = 20, G^{(3)} = 15$.
1. Compute the sequence of baselines $b_1, b_2, b_3$.
2. Compute the effective advantage used for policy updates in each episode.

**Solution:**
1. Sequence of baselines:
- After Episode 1:
  $$b_1 = 0.20(10) + 0.80(0) = 2.0$$
- After Episode 2:
  $$b_2 = 0.20(20) + 0.80(2.0) = 4.0 + 1.6 = 5.6$$
- After Episode 3:
  $$b_3 = 0.20(15) + 0.80(5.6) = 3.0 + 4.48 = 7.48$$

2. Advantages used for updates:
- Episode 1: $A^{(1)} = G^{(1)} - b_0 = 10 - 0 = +10.0$
- Episode 2: $A^{(2)} = G^{(2)} - b_1 = 20 - 2.0 = +18.0$
- Episode 3: $A^{(3)} = G^{(3)} - b_2 = 15 - 5.6 = +9.4$
The baseline smoothly adapts to the rising skill of the agent without requiring any backpropagation passes through a critic network.

---

### Worked Example 7.10: Complete TypeScript Implementation of REINFORCE with Baseline and Entropy Bonus
**Problem:** Author a complete, self-contained TypeScript class `REINFORCEWithBaseline` that implements:
1. Softmax policy and linear critic.
2. Episode recording.
3. Reward-to-Go computation with discounting.
4. Baseline subtraction and advantage calculation.
5. Analytical entropy bonus gradient.
6. Parameter update execution.

**Solution:**
```typescript
export interface StepRecord {
  state: number[];
  action: number;
  reward: number;
}

export class REINFORCEWithBaseline {
  public policyWeights: number[][]; // numActions x stateDim
  public criticWeights: number[];   // stateDim
  public criticBias: number = 0;
  private episode: StepRecord[] = [];

  constructor(
    public readonly stateDim: number,
    public readonly numActions: number,
    public readonly gamma: number = 0.99,
    public readonly lrPolicy: number = 0.01,
    public readonly lrCritic: number = 0.05,
    public readonly entropyBeta: number = 0.01
  ) {
    this.policyWeights = Array.from({ length: numActions }, () =>
      new Array(stateDim).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );
    this.criticWeights = new Array(stateDim).fill(0);
  }

  // Softmax action selection
  selectAction(state: number[]): { action: number; probs: number[] } {
    const logits = new Array(this.numActions).fill(0);
    let maxLogit = -Infinity;
    for (let a = 0; a < this.numActions; a++) {
      let sum = 0;
      for (let d = 0; d < this.stateDim; d++) sum += this.policyWeights[a][d] * state[d];
      logits[a] = sum;
      if (sum > maxLogit) maxLogit = sum;
    }

    let sumExp = 0;
    const probs = new Array(this.numActions).fill(0);
    for (let a = 0; a < this.numActions; a++) {
      probs[a] = Math.exp(logits[a] - maxLogit);
      sumExp += probs[a];
    }
    for (let a = 0; a < this.numActions; a++) probs[a] /= sumExp;

    // Sample from categorical
    const r = Math.random();
    let acc = 0;
    let action = 0;
    for (let a = 0; a < this.numActions; a++) {
      acc += probs[a];
      if (r <= acc) {
        action = a;
        break;
      }
    }

    return { action, probs };
  }

  // Critic forward pass
  predictValue(state: number[]): number {
    let val = this.criticBias;
    for (let d = 0; d < this.stateDim; d++) val += this.criticWeights[d] * state[d];
    return val;
  }

  recordStep(state: number[], action: number, reward: number): void {
    this.episode.push({ state, action, reward });
  }

  // Finish episode and perform updates
  finishEpisode(): { totalReturn: number; criticLoss: number } {
    const T = this.episode.length;
    if (T === 0) return { totalReturn: 0, criticLoss: 0 };

    // 1. Compute discounted Returns-to-Go
    const returns = new Float64Array(T);
    let runningG = 0;
    for (let t = T - 1; t >= 0; t--) {
      runningG = this.episode[t].reward + this.gamma * runningG;
      returns[t] = runningG;
    }

    let totalCriticLoss = 0;

    // 2. Compute gradients and update
    for (let t = 0; t < T; t++) {
      const step = this.episode[t];
      const G_t = returns[t];
      const V_t = this.predictValue(step.state);
      const advantage = G_t - V_t;

      // Update Critic: minimize 0.5 * (G_t - V_t)^2
      const criticError = G_t - V_t;
      totalCriticLoss += 0.5 * criticError * criticError;
      for (let d = 0; d < this.stateDim; d++) {
        this.criticWeights[d] += this.lrCritic * criticError * step.state[d];
      }
      this.criticBias += this.lrCritic * criticError;

      // Compute action probabilities and entropy
      const { probs } = this.selectAction(step.state);
      let entropy = 0;
      for (let a = 0; a < this.numActions; a++) {
        if (probs[a] > 1e-12) entropy -= probs[a] * Math.log(probs[a]);
      }

      // Update Policy parameters
      for (let a = 0; a < this.numActions; a++) {
        const indicator = a === step.action ? 1.0 : 0.0;
        // Policy gradient score
        const pgScore = (indicator - probs[a]) * advantage;
        // Entropy gradient: -p_a * (log p_a + H)
        const logP = probs[a] > 1e-12 ? Math.log(probs[a]) : 0;
        const entGrad = -probs[a] * (logP + entropy);

        const totalGradFactor = pgScore + this.entropyBeta * entGrad;
        for (let d = 0; d < this.stateDim; d++) {
          this.policyWeights[a][d] += this.lrPolicy * totalGradFactor * step.state[d];
        }
      }
    }

    const totalReturn = returns[0];
    this.episode = []; // Clear episode buffer
    return { totalReturn, criticLoss: totalCriticLoss / T };
  }
}
```

---

## 7.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 7.1: Proof of Non-Negative Entropy Bonus Gradient Projection
**Problem:** Let $p \in (0, 1)$ be the probability of action 1 in a 2-action Bernoulli policy with logit $z$: $p = \sigma(z) = \frac{1}{1 + e^{-z}}$.
Binary entropy is $\mathcal{H}(p) = - p \ln p - (1-p) \ln(1-p)$.
1. Compute the derivative $\frac{d\mathcal{H}}{dz}$.
2. Show that $\frac{d\mathcal{H}}{dz} > 0$ when $z < 0$, and $\frac{d\mathcal{H}}{dz} < 0$ when $z > 0$.
3. Prove that gradient ascent on $\mathcal{H}$ drives logit $z$ monotonically to $0$.

**Solution:**
1. Derivative by chain rule:
$$\frac{d\mathcal{H}}{dz} = \frac{d\mathcal{H}}{dp} \frac{dp}{dz}$$
$$\frac{d\mathcal{H}}{dp} = - (\ln p + 1) - (-\ln(1-p) - 1) = -\ln p + \ln(1-p) = -\ln\left(\frac{p}{1-p}\right)$$
Since $p = \sigma(z)$, $\frac{p}{1-p} = e^z \implies \ln(\frac{p}{1-p}) = z$.
$$\frac{d\mathcal{H}}{dp} = -z$$
The derivative of the sigmoid is $\frac{dp}{dz} = p(1-p)$.
$$\frac{d\mathcal{H}}{dz} = -z \cdot p(1-p) = -z \sigma(z)(1 - \sigma(z))$$

2. Sign analysis:
Since $\sigma(z) \in (0, 1)$, $p(1-p) > 0$ for all finite $z$.
- If $z < 0$: $-z > 0 \implies \frac{d\mathcal{H}}{dz} > 0$.
- If $z > 0$: $-z < 0 \implies \frac{d\mathcal{H}}{dz} < 0$.
- If $z = 0$: $\frac{d\mathcal{H}}{dz} = 0$.

3. Gradient ascent:
Update: $\Delta z = \alpha \frac{d\mathcal{H}}{dz} = -\alpha z p(1-p)$.
If $z > 0$, $\Delta z < 0$ (pulls $z$ downward). If $z < 0$, $\Delta z > 0$ (pulls $z$ upward).
The system has a single global fixed point at $z^* = 0$, where $p^* = 0.5$ (maximum entropy). $\blacksquare$

---

### Exercise 7.2: Discount Factor Discrepancy in REINFORCE
**Problem:** In the original derivation of the Policy Gradient Theorem for discounted return, Sutton et al. established:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \sum_{t=0}^\infty \gamma^t \mathbb{E}[\nabla_{\boldsymbol{\theta}} \log \pi(a_t \mid s_t) G_t]$$
However, many modern RL codebases (and textbook implementations) omit the leading $\gamma^t$ factor, optimizing:
$$\hat{\mathbf{g}} = \sum_{t=0}^\infty \mathbb{E}[\nabla_{\boldsymbol{\theta}} \log \pi(a_t \mid s_t) G_t]$$
1. Explain the theoretical consequence of omitting $\gamma^t$.
2. What alternative objective function does the omitted-$\gamma^t$ gradient correspond to?

**Solution:**
1. Consequence:
Omitting the leading $\gamma^t$ gives equal weight to decisions made late in the episode as to decisions made at $t=0$.
In the true discounted objective $J = V(s_0)$, a state visited at $t = 100$ has its value discounted by $\gamma^{100}$. Omitting $\gamma^t$ produces a biased gradient with respect to $V(s_0)$.

2. Alternative objective:
Thomas (2014) proved that omitting the leading $\gamma^t$ optimizes the **Average Reward** objective:
$$\bar{J}(\boldsymbol{\theta}) = \lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^T \mathbb{E}[r_t] = \sum_{s} d^{\pi}(s) \sum_a \pi(a \mid s) \mathcal{R}(s, a)$$
where $d^\pi(s)$ is the unweighted stationary state distribution. In practice, omitting $\gamma^t$ is universally preferred in deep RL because the $\gamma^t$ factor causes gradient updates at late time steps to vanish to zero, preventing the policy from learning effective terminal behaviors.

---

### Exercise 7.3: Minimum Mean Squared Error Baseline Derivation
**Problem:** Let $G$ be a random return observed from state $s$.
We approximate $G$ with a constant baseline $b(s)$ to minimize the expected squared error $\mathcal{E}(b) = \mathbb{E}[(G - b)^2 \mid S=s]$.
1. Prove that the unique minimizer is the conditional expectation $b^*(s) = \mathbb{E}[G \mid S=s] = V(s)$.
2. Show that the residual variance is $\mathbb{V}[G \mid S=s]$.

**Solution:**
1. Expand the objective:
$$\mathcal{E}(b) = \mathbb{E}[G^2 - 2bG + b^2 \mid s] = \mathbb{E}[G^2 \mid s] - 2b \mathbb{E}[G \mid s] + b^2$$
Differentiate with respect to $b$:
$$\frac{d\mathcal{E}}{db} = -2\mathbb{E}[G \mid s] + 2b = 0 \implies b^*(s) = \mathbb{E}[G \mid s]$$
The second derivative $\frac{d^2\mathcal{E}}{db^2} = 2 > 0$, confirming that $b^*(s) = V(s)$ is the unique global minimum.

2. Residual variance:
$$\mathcal{E}(b^*(s)) = \mathbb{E}[(G - \mathbb{E}[G \mid s])^2 \mid s] = \mathbb{V}[G \mid s]$$
The value function removes the entire predictable component of the return, leaving only the irreducible stochastic variance of the environment.

---

### Exercise 7.4: REINFORCE Failure on Sparse Reward Delay
**Problem:** In a maze of length $N = 100$, an agent receives reward $r = 0$ at all steps $t = 1, \dots, 99$, and reward $r_{100} = +1$ upon reaching the goal.
At each step, the agent has 4 actions.
1. What is the probability of a random uniform policy reaching the goal?
2. What are the Reward-to-Go values $G_t$ for a failed episode vs a successful episode?
3. Explain why REINFORCE cannot learn from failed episodes in this environment.

**Solution:**
1. Probability of success:
At each step, 1 of 4 actions advances.
$$\mathbb{P}(\text{success}) = \left(\frac{1}{4}\right)^{100} = 4^{-100} \approx 6.22 \times 10^{-61} \approx 0$$

2. Returns:
- Failed episode: $G_t = 0$ for all $t \in \{0, \dots, 99\}$.
- Successful episode: $G_t = \gamma^{100 - t}$ for all $t$.

3. REINFORCE update:
$$\Delta \boldsymbol{\theta} \propto \sum_{t} \nabla \log \pi_t G_t$$
For every failed episode, $G_t = 0 \implies \Delta \boldsymbol{\theta} = \mathbf{0}$.
The gradient is identically zero! The agent receives zero feedback, zero learning signal, and updates zero parameters until it stumbles upon the goal by chanceâ€”which will not occur before the heat death of the universe. Sparse reward exploration requires intrinsic curiosity or reward shaping.

---

### Exercise 7.5: Kullback-Leibler Divergence Under Policy Gradient Step
**Problem:** Let $\pi_{\boldsymbol{\theta}}$ be a policy, and let $\boldsymbol{\theta}' = \boldsymbol{\theta} + \alpha \mathbf{g}$ be the updated parameters.
1. Write the second-order Taylor expansion of the forward KL-divergence $D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'})$ around $\boldsymbol{\theta}$.
2. Express the step size in terms of the Fisher Information Matrix $\mathbf{F}(\boldsymbol{\theta})$:
$$D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta} + \Delta \boldsymbol{\theta}}) \approx \frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{F}(\boldsymbol{\theta}) \Delta \boldsymbol{\theta}$$

**Solution:**
1. Taylor expansion:
Let $f(\boldsymbol{\theta}') = D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'})$.
- At $\boldsymbol{\theta}' = \boldsymbol{\theta}$: $D_{\text{KL}}(\pi \parallel \pi) = 0$.
- Gradient at $\boldsymbol{\theta}$:
  $$\nabla_{\boldsymbol{\theta}'} D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'}) \Big|_{\boldsymbol{\theta}'=\boldsymbol{\theta}} = - \mathbb{E}\left[ \nabla_{\boldsymbol{\theta}'} \log \pi_{\boldsymbol{\theta}'}(a \mid s) \Big|_{\boldsymbol{\theta}'=\boldsymbol{\theta}} \right] = -\mathbf{0} = \mathbf{0}$$
- Hessian at $\boldsymbol{\theta}$:
  $$\nabla^2_{\boldsymbol{\theta}'} D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta}'}) \Big|_{\boldsymbol{\theta}'=\boldsymbol{\theta}} = - \mathbb{E}\left[ \nabla^2_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) \right] = \mathbf{F}(\boldsymbol{\theta})$$
where $\mathbf{F}(\boldsymbol{\theta})$ is the Fisher Information Matrix.

2. Second-order approximation:
$$D_{\text{KL}}(\pi_{\boldsymbol{\theta}} \parallel \pi_{\boldsymbol{\theta} + \Delta \boldsymbol{\theta}}) \approx f(\boldsymbol{\theta}) + \nabla f^\top \Delta \boldsymbol{\theta} + \frac{1}{2} \Delta \boldsymbol{\theta}^\top \nabla^2 f \Delta \boldsymbol{\theta} = 0 + 0 + \frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{F}(\boldsymbol{\theta}) \Delta \boldsymbol{\theta}$$
The Fisher Information Matrix defines the local metric tensor for policy probability divergence.

---

### Exercise 7.6: Asymmetric Critic Learning Rates
**Problem:** In Actor-Critic architectures, practitioners frequently set the critic learning rate $\alpha_v$ significantly larger than the policy learning rate $\alpha_\theta$ (e.g. $\alpha_v = 5 \times 10^{-3}$, $\alpha_\theta = 1 \times 10^{-4}$).
Explain the theoretical necessity for this timescale separation using the Two-Timescale Stochastic Approximation framework (Borkar, 1997).

**Solution:**
Under Two-Timescale Stochastic Approximation:
- If $\frac{\alpha_\theta}{\alpha_v} \to 0$ as $t \to \infty$, the fast iterate (the Critic) views the slow iterate (the Actor) as quasi-static. The Critic converges rapidly to the true value function $V^{\pi_\theta}$ for the *current* policy $\pi_\theta$.
- Simultaneously, the slow iterate (the Actor) views the fast iterate as having already converged to its equilibrium value $V^{\pi_\theta}$.
- If $\alpha_\theta \approx \alpha_v$, the policy updates before the critic has learned to evaluate the previous policy. The advantage estimates become corrupted by stale valuations, inducing non-stationary oscillations and policy divergence. Timescale separation guarantees stable advantage estimation.

---

### Exercise 7.7: Entropy Regularized Soft Policy Improvement
**Problem:** Consider the soft expected return objective:
$$J_{\text{soft}}(\pi) = \sum_{t=0}^\infty \gamma^t \mathbb{E}_{(s_t, a_t) \sim \pi} [r(s_t, a_t) + \beta_{\text{ent}} \mathcal{H}(\pi(\cdot \mid s_t))]$$
1. Write the Soft Bellman Equation for the soft value function $V_{\text{soft}}(s)$.
2. Show that the policy update that maximizes the soft return has the Boltzmann form:
$$\pi_{\text{new}}(a \mid s) \propto \exp\left( \frac{Q_{\text{soft}}(s, a)}{\beta_{\text{ent}}} \right)$$

**Solution:**
1. Soft Bellman Equation:
$$V_{\text{soft}}(s) = \mathbb{E}_{a \sim \pi} \left[ Q_{\text{soft}}(s, a) - \beta_{\text{ent}} \log \pi(a \mid s) \right]$$
$$Q_{\text{soft}}(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) V_{\text{soft}}(s')$$

2. Boltzmann policy update:
We seek $\pi_{\text{new}}(\cdot \mid s) = \arg\max_\pi \sum_a \pi(a \mid s) Q(s, a) - \beta_{\text{ent}} \sum_a \pi(a \mid s) \log \pi(a \mid s)$ subject to $\sum_a \pi(a \mid s) = 1$.
Construct the Lagrangian:
$$\mathcal{L}(\pi, \lambda) = \sum_a \pi(a \mid s) Q(s, a) - \beta_{\text{ent}} \sum_a \pi(a \mid s) \log \pi(a \mid s) - \lambda \left(\sum_a \pi(a \mid s) - 1\right)$$
Differentiate with respect to $\pi(a \mid s)$:
$$\frac{\partial \mathcal{L}}{\partial \pi(a \mid s)} = Q(s, a) - \beta_{\text{ent}}(\log \pi(a \mid s) + 1) - \lambda = 0$$
$$\beta_{\text{ent}} \log \pi(a \mid s) = Q(s, a) - \beta_{\text{ent}} - \lambda \implies \pi(a \mid s) = \exp\left( \frac{Q(s, a)}{\beta_{\text{ent}}} \right) \cdot \exp\left( -\frac{\lambda + \beta_{\text{ent}}}{\beta_{\text{ent}}} \right)$$
Normalizing by the sum of probabilities yields:
$$\pi_{\text{new}}(a \mid s) = \frac{\exp(Q_{\text{soft}}(s, a) / \beta_{\text{ent}})}{\sum_{a'} \exp(Q_{\text{soft}}(s, a') / \beta_{\text{ent}})}$$
This is the foundational principle of Maximum Entropy RL and Soft Actor-Critic (SAC).

---

### Exercise 7.8: Policy Gradient with Autoregressive Multi-Discrete Actions
**Problem:** In complex strategy games, an agent selects a composite action: $a = (a^{(1)}, a^{(2)})$ where $a^{(1)} \in \{1, \dots, K_1\}$ and $a^{(2)} \in \{1, \dots, K_2\}$.
The policy factorizes autoregressively: $\pi(a \mid s) = \pi_1(a^{(1)} \mid s) \cdot \pi_2(a^{(2)} \mid s, a^{(1)})$.
Derive the score function $\nabla_{\boldsymbol{\theta}} \log \pi(a \mid s)$.

**Solution:**
Take the natural logarithm:
$$\log \pi(a \mid s) = \log \left[ \pi_1(a^{(1)} \mid s) \cdot \pi_2(a^{(2)} \mid s, a^{(1)}) \right] = \log \pi_1(a^{(1)} \mid s) + \log \pi_2(a^{(2)} \mid s, a^{(1)})$$
Differentiating with respect to parameters $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \log \pi(a \mid s) = \nabla_{\boldsymbol{\theta}} \log \pi_1(a^{(1)} \mid s) + \nabla_{\boldsymbol{\theta}} \log \pi_2(a^{(2)} \mid s, a^{(1)})$$
By linearity of the logarithm, the composite score function decomposes cleanly into an unweighted sum of individual conditional score functions.

---

### Exercise 7.9: Variance of Sample Returns Under Geometric Episode Horizons
**Problem:** An agent operates in an absorbing MDP where at each step, the episode terminates with constant probability $p \in (0, 1)$ regardless of action.
Rewards are constant $r = 1$ at every non-terminal step. Discount $\gamma = 1$.
1. Compute the probability distribution of episode length $T$.
2. Compute the expected return $\mathbb{E}[G_0]$.
3. Compute the variance of the return $\mathbb{V}[G_0]$.

**Solution:**
1. Episode length distribution:
$T$ is a geometric random variable with success parameter $p$:
$$\mathbb{P}(T = k) = (1 - p)^{k-1} p \quad \text{for } k \in \{1, 2, 3, \dots\}$$

2. Expected return:
Since reward is 1 per step, $G_0 = T$.
From elementary probability for a geometric distribution:
$$\mathbb{E}[G_0] = \mathbb{E}[T] = \frac{1}{p}$$

3. Variance:
$$\mathbb{V}[G_0] = \mathbb{V}[T] = \frac{1 - p}{p^2}$$
For $p = 0.01$ (average episode length 100):
$$\mathbb{E}[G_0] = 100, \quad \mathbb{V}[G_0] = \frac{0.99}{0.0001} = 9,900$$
The standard deviation is $\sigma = \sqrt{9900} \approx 99.5$, virtually identical to the mean! This massive intrinsic dispersion explains why Monte Carlo policy gradients require baselines.

---

### Exercise 7.10: Complete TypeScript Unit Test Suite for REINFORCE
**Problem:** Write a TypeScript verification script that initializes `REINFORCEWithBaseline` on a 2-state bandit MDP and verifies that:
1. Expected advantage is centered near zero.
2. The policy parameters shift in favor of the higher-reward action.
3. Shannon entropy remains positive and bounded.

**Solution:**
```typescript
import { REINFORCEWithBaseline } from './reinforce'; // Assuming implementation from Worked Example 7.10

export function testREINFORCEConvergence(): boolean {
  const agent = new REINFORCEWithBaseline(1, 2, 0.99, 0.05, 0.1, 0.01);
  const state = [1.0];

  // Train for 200 synthetic episodes where Action 1 yields reward 10, Action 0 yields reward 2
  for (let ep = 0; ep < 200; ep++) {
    const { action } = agent.selectAction(state);
    const reward = action === 1 ? 10.0 : 2.0;
    agent.recordStep(state, action, reward);
    agent.finishEpisode();
  }

  // Verify that policy now favors Action 1
  const { probs } = agent.selectAction(state);
  console.log(`Action Probabilities after 200 episodes: P(a=0)=${probs[0].toFixed(4)}, P(a=1)=${probs[1].toFixed(4)}`);
  
  const converged = probs[1] > 0.85;
  const criticValid = agent.predictValue(state) > 5.0;

  console.log(`Test Passed: ${converged && criticValid}`);
  return converged && criticValid;
}

testREINFORCEConvergence();
```


# Chapter 8: Actor-Critic Foundations: Advantage Actor-Critic (A2C) and Generalized Advantage Estimation (GAE)

---

## 8.1 The Actor-Critic Architecture

In the preceding chapter, we investigated the REINFORCE algorithm with a learned baseline. While subtracting a state-dependent baseline $V_{\boldsymbol{\phi}}(s)$ successfully reduces the variance of the policy gradient, REINFORCE remains intrinsically bound to the **episodic Monte Carlo paradigm**:
$$\hat{A}_t = G_t - V_{\boldsymbol{\phi}}(s_t) = \left( \sum_{k=t}^T \gamma^{k-t} r_{k+1} \right) - V_{\boldsymbol{\phi}}(s_t)$$

This episodic dependence imposes severe operational constraints:
1. **No Online Learning:** The agent cannot execute a parameter update until the episode reaches a terminal state. In long-horizon tasks (such as 10,000-step robotic manipulation) or non-terminating continuing tasks, learning is delayed or impossible.
2. **Residual Monte Carlo Variance:** Because the return $G_t$ accumulates empirical rewards along the remaining trajectory, it retains high variance across stochastic transitions and future actions.

To eliminate episodic waiting and achieve true online step-by-step updates, Sutton (1984) and Konda & Tsitsiklis (2000) formulated the **Actor-Critic Architecture**.

```
                        THE ACTOR-CRITIC ARCHITECTURE
                        
                              Environment (MDP)
                                 â”‚         â–²
                   Reward r_{t+1}â”‚         â”‚ Action a_t
                  Next State s'  â”‚         â”‚
                                 â–¼         â”‚
                       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                       â”‚                                       â”‚
                       â–¼                                       â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”‚
             â”‚   CRITIC V_Ï•(s)   â”‚                             â”‚
             â”‚  Evaluates States â”‚                             â”‚
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â”‚
                       â”‚ Value Prediction V(s)                 â”‚
                       â–¼                                       â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”‚
             â”‚  TD ERROR ENGINE  â”‚                             â”‚
             â”‚ Î´ = r + Î³ V(s')-V â”‚                             â”‚
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â”‚
                       â”‚                                       â”‚
                       â”‚ Advantage / TD Error Î´_t              â”‚
                       â–¼                                       â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”‚
             â”‚   ACTOR Ï€_Î¸(a|s)  â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â”‚  Selects Actions  â”‚
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

The system is decomposed into two distinct, cooperative functional agents:
1. **The Actor:** Parameterized as $\pi_{\boldsymbol{\theta}}(a \mid s)$, the Actor's sole responsibility is **action selection** (control). It maps environmental states to probability distributions over actions.
2. **The Critic:** Parameterized as $V_{\boldsymbol{\phi}}(s)$, the Critic's sole responsibility is **state evaluation** (prediction). It measures how good the state is by estimating the expected cumulative return.

Instead of waiting for the true empirical return $G_t$, the Critic **bootstraps** the value of future states, enabling instantaneous gradient updates at every single environmental transition.

---

## 8.2 One-Step Temporal Difference Actor-Critic

In one-step Actor-Critic, we substitute the one-step Bellman target $r_{t+1} + \gamma V_{\boldsymbol{\phi}}(s_{t+1})$ in place of the full return $G_t$.
The one-step Temporal Difference (TD) error is:
$$\delta_t = r_{t+1} + \gamma (1 - d_{t+1}) V_{\boldsymbol{\phi}}(s_{t+1}) - V_{\boldsymbol{\phi}}(s_t)$$

Notice what this TD error represents:
$$\mathbb{E}[\delta_t \mid s_t, a_t] = \mathbb{E}[r_{t+1} + \gamma V(s_{t+1}) \mid s_t, a_t] - V(s_t) = Q^\pi(s_t, a_t) - V^\pi(s_t) = A^\pi(s_t, a_t)$$

The one-step TD error $\delta_t$ is an **unbiased sample estimate of the Advantage function** $A^\pi(s_t, a_t)$!

### The Step-by-Step Update Equations
At every discrete time step $t$, the agent receives transition $(s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$ and performs the following updates:

1. **Compute TD Error:**
$$\delta_t = r_{t+1} + \gamma (1 - d_{t+1}) V_{\boldsymbol{\phi}}(s_{t+1}) - V_{\boldsymbol{\phi}}(s_t)$$

2. **Update Critic (Evaluation):**
Minimize the squared TD error $\mathcal{L}_{\text{critic}}(\boldsymbol{\phi}) = \frac{1}{2} \delta_t^2$:
$$\boldsymbol{\phi} \leftarrow \boldsymbol{\phi} + \alpha_v \delta_t \nabla_{\boldsymbol{\phi}} V_{\boldsymbol{\phi}}(s_t)$$

3. **Update Actor (Policy Improvement):**
Ascend the policy gradient scaled by the TD advantage:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha_\theta \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) \delta_t$$

Learning occurs continuously at every single interaction step without storing trajectories or waiting for episodes to end.

---

## 8.3 The Bias-Variance Spectrum in Advantage Estimation

While one-step TD actor-critic eliminates episodic waiting and exhibits exceptionally low variance, it introduces **bias**.

Consider the spectrum of advantage estimators spanning from 1-step bootstrapping to $\infty$-step Monte Carlo:

```
                  THE BIAS-VARIANCE ADVANTAGE SPECTRUM
                  
   1-Step TD:          A^(1) = r_1 + Î³ V(s_1) - V(s_0)
                       [ Minimal Variance, Maximum Bias from imperfect V ]
                       
   2-Step TD:          A^(2) = r_1 + Î³ r_2 + Î³^2 V(s_2) - V(s_0)
   
   k-Step TD:          A^(k) = âˆ‘_{l=0}^{k-1} Î³^l r_{t+l+1} + Î³^k V(s_{t+k}) - V(s_t)
   
   Monte Carlo (âˆž):    A^(âˆž) = âˆ‘_{l=0}^âˆž Î³^l r_{t+l+1} - V(s_t) = G_t - V(s_t)
                       [ Zero Bias, Maximum Variance from trajectory noise ]
```

### The Trade-off
- **When $k = 1$ (One-Step TD):** The estimator relies on only one real environmental reward ($r_{t+1}$) and bootstraps the rest via $V_{\boldsymbol{\phi}}(s_{t+1})$. 
  - *Variance:* Extremely low, because only a single step of randomness is sampled.
  - *Bias:* Extremely high early in training when $V_{\boldsymbol{\phi}}$ is inaccurate. If $V_{\boldsymbol{\phi}}$ has systemic estimation errors, those errors distort the actor's policy gradient.
- **When $k \to \infty$ (Monte Carlo):** The estimator uses real sampled rewards along the entire episode.
  - *Bias:* Exactly zero (unbiased with respect to the true return).
  - *Variance:* Extremely high, compounding the stochastic noise of hundreds of subsequent transitions.

Is there a principled mathematical framework that smoothly interpolates between 1-step TD and $\infty$-step Monte Carlo, achieving the optimal trade-off between bias and variance?

---

## 8.4 Generalized Advantage Estimation (GAE)

Schulman, Moritz, Levine, Jordan, and Abbeel (2015) answered this question by introducing **Generalized Advantage Estimation (GAE)**.

Define the 1-step TD residual of the value function $V$ at time step $t$:
$$\delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$

Now consider the family of $k$-step advantage estimators:
$$\hat{A}_t^{(1)} = \delta_t^V$$
$$\hat{A}_t^{(2)} = \delta_t^V + \gamma \delta_{t+1}^V = r_{t+1} + \gamma r_{t+2} + \gamma^2 V(s_{t+2}) - V(s_t)$$
$$\hat{A}_t^{(k)} = \sum_{l=0}^{k-1} \gamma^l \delta_{t+l}^V = \left( \sum_{l=0}^{k-1} \gamma^l r_{t+l+1} \right) + \gamma^k V(s_{t+k}) - V(s_t)$$

Notice that telescoping cancellations occur:
$$\hat{A}_t^{(k)} = (r_{t+1} + \gamma V(s_{t+1}) - V(s_t)) + \gamma (r_{t+2} + \gamma V(s_{t+2}) - V(s_{t+1})) + \dots = \sum_{l=0}^{k-1} \gamma^l r_{t+l+1} + \gamma^k V(s_{t+k}) - V(s_t)$$

### The Exponentially Weighted Mixture
Analogous to $\text{TD}(\lambda)$ in value-based RL, Generalized Advantage Estimation defines $\hat{A}_t^{\text{GAE}(\gamma, \lambda)}$ as the **exponentially decaying weighted average** of all $k$-step advantage estimators, parameterized by decay parameter $\lambda \in [0, 1]$:
$$\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = (1 - \lambda) \sum_{k=1}^\infty \lambda^{k-1} \hat{A}_t^{(k)}$$

Expanding this infinite series:
$$\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = (1 - \lambda) \left[ \hat{A}_t^{(1)} + \lambda \hat{A}_t^{(2)} + \lambda^2 \hat{A}_t^{(3)} + \dots \right]$$
$$= (1 - \lambda) \left[ \delta_t^V + \lambda (\delta_t^V + \gamma \delta_{t+1}^V) + \lambda^2 (\delta_t^V + \gamma \delta_{t+1}^V + \gamma^2 \delta_{t+2}^V) + \dots \right]$$
$$= (1 - \lambda) \left[ \delta_t^V (1 + \lambda + \lambda^2 + \dots) + \gamma \delta_{t+1}^V (\lambda + \lambda^2 + \dots) + \gamma^2 \delta_{t+2}^V (\lambda^2 + \dots) \right]$$

Since $\sum_{i=0}^\infty \lambda^i = \frac{1}{1 - \lambda}$, factoring out $\frac{1}{1 - \lambda}$ cancels $(1 - \lambda)$ completely:
$$\hat{A}_t^{\text{GAE}(\gamma, \lambda)} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$$

```
                         THE GAE RECURRENCE RELATION
                         
   Time:       t             t+1            t+2           t+3
   TD Errors: Î´_t           Î´_{t+1}        Î´_{t+2}       Î´_{t+3}
               â”‚              â”‚              â”‚              â”‚
               â–¼              â–¼              â–¼              â–¼
   GAE:       A_t  =  Î´_t  +  (Î³Î») Â· [ Î´_{t+1} + (Î³Î») Â· [ Î´_{t+2} + (Î³Î») Â· Î´_{t+3} ... ] ]
   
   Backward Recurrence:
   A_t = Î´_t + (Î³Î») Â· A_{t+1}
```

### The Beautiful Backward Recurrence
Equation $\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$ yields a remarkably simple, elegant **backward recurrence relation**:
$$\hat{A}_t^{\text{GAE}} = \delta_t^V + \gamma \lambda (1 - d_{t+1}) \hat{A}_{t+1}^{\text{GAE}}$$

### Boundary Cases of $\lambda$
- **Case $\lambda = 0$:**
  $$\hat{A}_t^{\text{GAE}(\gamma, 0)} = \delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
  Recovers the **one-step TD advantage** (minimum variance, highest bias).
- **Case $\lambda = 1$:**
  $$\hat{A}_t^{\text{GAE}(\gamma, 1)} = \sum_{l=0}^\infty \gamma^l \delta_{t+l}^V = \sum_{l=0}^\infty \gamma^l r_{t+l+1} - V(s_t) = G_t - V(s_t)$$
  Recovers the **Monte Carlo advantage** (zero bias, highest variance).
- **Intermediate $\lambda \in (0, 1)$ (typically $\lambda = 0.95$):**
  Smoothly balances bias and variance. GAE suppresses the catastrophic high variance of long rollouts while allowing real empirical rewards to override local value function estimation errors. GAE is the universal advantage estimator employed by modern state-of-the-art policy optimization algorithms (including PPO, TRPO, and A2C).

---

## 8.5 Synchronous Advantage Actor-Critic (A2C) vs Asynchronous (A3C)

Mnih et al. (2016) revolutionized deep reinforcement learning by introducing **Asynchronous Advantage Actor-Critic (A3C)**. 
Prior to A3C, deep RL relied heavily on large Experience Replay buffers to break temporal autocorrelation in DQN. However, policy gradient methods are fundamentally **on-policy**: they cannot sample from stale replay buffers because the policy gradient theorem requires expectation under the *current* policy $\pi_{\boldsymbol{\theta}}$.

### The A3C Breakthrough
To break temporal autocorrelation without an off-policy replay buffer, A3C instantiated multiple parallel CPU worker threads, each interacting with an independent copy of the environment:
- Each worker maintained its own local network parameters $\boldsymbol{\theta}'$ and $\boldsymbol{\phi}'$.
- Workers independently collected rollouts of length $T_{\text{max}}$ (e.g. 5 or 20 steps).
- Workers computed local gradients and asynchronously pushed lock-free parameter updates to a global shared master network using Hogwild! SGD:
$$\boldsymbol{\theta}_{\text{global}} \leftarrow \boldsymbol{\theta}_{\text{global}} + \alpha \nabla \mathcal{L}_{\text{local}}$$

Because different workers traversed completely different areas of the state space simultaneously, the accumulated parameter updates were mutually decorrelated, stabilizing deep neural network training without experience replay.

```
                           A3C (ASYNCHRONOUS)
                           
               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â”‚         GLOBAL MASTER MODEL          â”‚
               â”‚         Parameters Î¸ and Ï•           â”‚
               â””â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”˜
                    â”‚ Push Gradients (Async)      â”‚ Push Gradients (Async)
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚ Worker 1 (CPU)    â”‚         â”‚ Worker N (CPU)    â”‚
          â”‚ Local Env Clone 1 â”‚         â”‚ Local Env Clone N â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
          
                           A2C (SYNCHRONOUS)
                           
               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â”‚           CENTRALIZED GPU            â”‚
               â”‚   Forward & Backward on N Envs Batchedâ”‚
               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚ Actions    â”‚ Next States, Rewards
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
          â”‚     VECTORIZED PARALLEL ENVIRONMENTS      â”‚
          â”‚  [ Env 1 ]   [ Env 2 ]  ...  [ Env N ]    â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Transition to A2C (Synchronous Advantage Actor-Critic)
While A3C was historically groundbreaking, asynchronous multi-threading introduced subtle complications:
- Workers occasionally pushed gradients computed on stale parameters (gradient staleness).
- CPU multi-threading suffered from inter-thread synchronization overhead and cache thrashing.

OpenAI researchers (Wu et al., 2017) demonstrated that the asynchronous aspect of A3C was not the stabilizing mechanismâ€”**the parallel environmental diversity was**.

They introduced **Synchronous Advantage Actor-Critic (A2C)**:
1. A single centralized neural network processes $N$ environments in parallel synchronously (e.g. $N = 16$ or $N = 64$ parallel environments).
2. The network performs a single batched forward pass to select actions for all $N$ workers.
3. All $N$ workers step their environments simultaneously.
4. After $T$ steps (generating an $N \times T$ matrix of transitions), advantages are computed synchronously using GAE.
5. A single large, deterministic mini-batch gradient step is executed on the GPU.

**Advantages of A2C over A3C:**
- **Deterministic and Reproducible:** Eliminates race conditions and non-deterministic CPU thread scheduling.
- **Hardware Efficiency:** Fully saturates modern high-throughput tensor processors (GPUs/TPUs) via batched matrix multiplications rather than fractured CPU thread loops.
- **Equal or Superior Sample Efficiency:** Achieves identical or higher performance than A3C in less wall-clock training time.

---

## 8.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 8.1: Step-by-Step GAE Calculation on a Finite Rollout
**Problem:** An agent collects a 4-step trajectory with rewards $r = [1.0, 2.0, 0.0, 4.0]$ and discount $\gamma = 0.90$.
The Critic predicts state values $V = [V(s_0), V(s_1), V(s_2), V(s_3), V(s_4)] = [2.5, 3.0, 2.0, 4.0, 1.0]$.
Let the GAE parameter be $\lambda = 0.80$.
1. Compute the one-step TD residuals $\delta_0^V, \delta_1^V, \delta_2^V, \delta_3^V$.
2. Compute the GAE advantages $\hat{A}_3, \hat{A}_2, \hat{A}_1, \hat{A}_0$ using the backward recurrence relation.
3. Compare $\hat{A}_0^{\text{GAE}}$ against the 1-step advantage $\delta_0^V$ and the Monte Carlo advantage $\hat{A}_0^{\text{MC}}$.

**Solution:**
1. TD residuals ($\delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$):
- $\delta_0^V = 1.0 + 0.90(3.0) - 2.5 = 1.0 + 2.7 - 2.5 = +1.20$
- $\delta_1^V = 2.0 + 0.90(2.0) - 3.0 = 2.0 + 1.8 - 3.0 = +0.80$
- $\delta_2^V = 0.0 + 0.90(4.0) - 2.0 = 0.0 + 3.6 - 2.0 = +1.60$
- $\delta_3^V = 4.0 + 0.90(1.0) - 4.0 = 4.0 + 0.9 - 4.0 = +0.90$

2. GAE backward recurrence:
Factor $\gamma \lambda = 0.90 \times 0.80 = 0.72$.
Base condition at end of rollout: $\hat{A}_4 = 0$.
- Step $t = 3$:
  $$\hat{A}_3 = \delta_3^V + \gamma \lambda \hat{A}_4 = 0.90 + 0.72(0) = 0.9000$$
- Step $t = 2$:
  $$\hat{A}_2 = \delta_2^V + \gamma \lambda \hat{A}_3 = 1.60 + 0.72(0.9000) = 1.60 + 0.6480 = 2.2480$$
- Step $t = 1$:
  $$\hat{A}_1 = \delta_1^V + \gamma \lambda \hat{A}_2 = 0.80 + 0.72(2.2480) = 0.80 + 1.61856 = 2.4186$$
- Step $t = 0$:
  $$\hat{A}_0 = \delta_0^V + \gamma \lambda \hat{A}_1 = 1.20 + 0.72(2.41856) = 1.20 + 1.74136 = 2.9414$$

3. Comparison:
- 1-step advantage ($\lambda = 0$): $\delta_0^V = +1.2000$.
- Monte Carlo return from $s_0$:
  $$G_0 = 1.0 + 0.9(2.0) + (0.9)^2(0.0) + (0.9)^3(4.0) + (0.9)^4(1.0) = 1.0 + 1.8 + 0 + 0.729(4) + 0.6561(1) = 2.8 + 2.916 + 0.6561 = 6.3721$$
  $$\hat{A}_0^{\text{MC}} = G_0 - V(s_0) = 6.3721 - 2.5 = +3.8721$$
- $\text{GAE}(\lambda = 0.80)$: $\hat{A}_0 = 2.9414$.
Notice that $1.2000 < 2.9414 < 3.8721$. GAE cleanly interpolates between the conservative 1-step estimate and the high-variance Monte Carlo return!

---

### Worked Example 8.2: Critic Bootstrapping at Truncated Horizons
**Problem:** An A2C agent collects rollouts of length $T_{\text{rollout}} = 5$.
At step $t = 5$, the episode has **not** terminated ($d_5 = \text{false}$), but the rollout buffer is full and must be updated.
1. Write the target value for the final step $t = 4$.
2. Contrast this with the target when step $t = 5$ is a genuine terminal state ($d_5 = \text{true}$).
3. Why is bootstrapping with $V(s_5)$ critical when handling artificial timeout truncation?

**Solution:**
1. Truncated non-terminal target:
Since the episode continues past step $5$, future rewards exist. The Critic bootstraps the expected remaining return:
$$y_4 = r_5 + \gamma V(s_5)$$
$$\delta_4^V = r_5 + \gamma V(s_5) - V(s_4)$$

2. Genuine terminal target ($d_5 = \text{true}$):
If the agent died or reached the terminal goal, no future rewards can be received:
$$y_4 = r_5 + \gamma (0) = r_5$$
$$\delta_4^V = r_5 - V(s_4)$$

3. Importance of bootstrapping on timeout:
If an environment terminates due to an artificial time limit (e.g. 1,000 steps in Gym environments), setting $V(s_5) = 0$ would falsely inform the critic that reaching step 1,000 has zero future value (equivalent to dying). This introduces severe negative bias, causing the agent to act erratically near the time limit. Bootstrapping with $V(s_{\text{truncated}})$ correctly preserves value continuity across artificial window boundaries.

---

### Worked Example 8.3: Analytical Advantage Estimation Under Linear Value Function
**Problem:** Let state $s \in \mathbb{R}$. The Critic is $V_\phi(s) = \phi \cdot s$ with $\phi = 2.0$.
Transition observed: $s = 3.0, a = 1, r = +5.0, s' = 4.0$, with $\gamma = 0.90$.
1. Compute the Critic predictions $V(s)$ and $V(s')$.
2. Compute the 1-step TD advantage $\delta$.
3. Compute the Critic parameter gradient $\nabla_\phi \mathcal{L}_{\text{critic}}$ under MSE loss $\frac{1}{2}\delta^2$.

**Solution:**
1. Value predictions:
$$V(s) = 2.0 \times 3.0 = 6.0$$
$$V(s') = 2.0 \times 4.0 = 8.0$$

2. 1-step TD error:
$$\delta = r + \gamma V(s') - V(s) = 5.0 + 0.90(8.0) - 6.0 = 5.0 + 7.2 - 6.0 = 6.2$$
The advantage is $\hat{A} = +6.2$.

3. Critic gradient:
Loss: $\mathcal{L}(\phi) = \frac{1}{2}(r + \gamma V(s') - V_\phi(s))^2$.
Using the semi-gradient (treating $V(s')$ as fixed):
$$\frac{\partial \mathcal{L}}{\partial \phi} = - \delta \frac{\partial V_\phi(s)}{\partial \phi} = - 6.2 \times s = -6.2 \times 3.0 = -18.6$$
Update: $\Delta \phi = -\alpha \frac{\partial \mathcal{L}}{\partial \phi} = \alpha (18.6) > 0$, increasing $\phi$ to reduce the positive TD error.

---

### Worked Example 8.4: Combined A2C Multi-Task Loss Function
**Problem:** In A2C implementations, the Actor and Critic often share a common convolutional backbone and are optimized via a single joint scalar loss:
$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{policy}} + c_1 \mathcal{L}_{\text{value}} - c_2 \mathcal{L}_{\text{entropy}}$$
Suppose for a mini-batch:
- Policy loss: $\mathcal{L}_{\text{policy}} = - \frac{1}{B}\sum_{i=1}^B \log \pi(a_i \mid s_i) \hat{A}_i = -1.45$.
- Value loss: $\mathcal{L}_{\text{value}} = \frac{1}{2B}\sum_{i=1}^B (y_i - V(s_i))^2 = 0.80$.
- Entropy: $\mathcal{H} = \frac{1}{B}\sum_{i=1}^B \mathcal{H}(\pi(\cdot \mid s_i)) = 0.65$.
Let $c_1 = 0.50$ (value coefficient) and $c_2 = 0.01$ (entropy coefficient).
1. Compute the total loss $\mathcal{L}_{\text{total}}$.
2. Explain the sign convention of each term in the loss.

**Solution:**
1. Total loss calculation:
$$\mathcal{L}_{\text{total}} = (-1.45) + 0.50(0.80) - 0.01(0.65) = -1.45 + 0.40 - 0.0065 = -1.0565$$

2. Sign convention:
- Standard deep learning frameworks (PyTorch, TensorFlow) perform **gradient descent** (minimizing loss).
- We wish to *maximize* policy return $\implies$ minimize $-\log \pi \cdot \hat{A}$.
- We wish to *minimize* value prediction error $\implies$ minimize $+ \frac{1}{2}(y - V)^2$.
- We wish to *maximize* policy entropy $\implies$ minimize $-\mathcal{H}$.
Thus, minimizing $\mathcal{L}_{\text{total}}$ simultaneously achieves policy gradient ascent, value error minimization, and entropy maximization.

---

### Worked Example 8.5: Parallel Environment Vectorization in A2C
**Problem:** An A2C agent runs $N = 4$ parallel environments. Over rollout horizon $T = 3$, it collects matrices of rewards $\mathbf{R}$ and terminal flags $\mathbf{D}$:
$$\mathbf{R} = \begin{bmatrix}
1 & 0 & 2 \\
0 & 0 & 1 \\
3 & 1 & 0 \\
0 & 2 & 1
\end{bmatrix}, \quad \mathbf{D} = \begin{bmatrix}
0 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 0 \\
0 & 0 & 1
\end{bmatrix}$$
where rows represent environments $0..3$ and columns represent time steps $t = 0, 1, 2$.
Discount $\gamma = 0.90, \lambda = 1.0$ (Monte Carlo).
Values for all states are predicted as $V = 1.0$ across the board.
Compute the GAE advantage matrix $\hat{\mathbf{A}}$ for step $t = 1$ across all 4 environments.

**Solution:**
For $\lambda = 1.0$, GAE simplifies to the discounted Monte Carlo return minus value:
$$\hat{A}_{i, t} = \delta_{i, t} + \gamma (1 - D_{i, t+1}) \hat{A}_{i, t+1}$$
At $t = 2$ (last step, bootstrapping with $V=1.0$):
- Env 0: $\delta_{0, 2} = R_{0, 2} + \gamma V - V = 2 + 0.9(1) - 1 = 1.9 \implies \hat{A}_{0, 2} = 1.9$.
- Env 1: $\delta_{1, 2} = 1 + 0.9(1) - 1 = 0.9 \implies \hat{A}_{1, 2} = 0.9$.
- Env 2: $\delta_{2, 2} = 0 + 0.9(1) - 1 = -0.1 \implies \hat{A}_{2, 2} = -0.1$.
- Env 3: $D_{3, 2} = 1$ (terminal!): $\delta_{3, 2} = R_{3, 2} + \gamma(0) - V = 1 + 0 - 1 = 0.0 \implies \hat{A}_{3, 2} = 0.0$.

Now compute $t = 1$:
- Env 0 ($D_{0, 1} = 0$): $\delta_{0, 1} = 0 + 0.9(1) - 1 = -0.1$.
  $$\hat{A}_{0, 1} = -0.1 + 0.90(1 - 0)(1.9) = -0.1 + 1.71 = +1.61$$
- Env 1 ($D_{1, 1} = 1$, terminal at $t=1$!):
  $$\delta_{1, 1} = R_{1, 1} + \gamma(0) - V = 0 + 0 - 1 = -1.0$$
  Since $D_{1, 1} = 1$, future advantage from $t=2$ is masked out:
  $$\hat{A}_{1, 1} = \delta_{1, 1} + \gamma(1 - 1)\hat{A}_{1, 2} = -1.0 + 0 = -1.00$$
- Env 2 ($D_{2, 1} = 0$): $\delta_{2, 1} = 1 + 0.9(1) - 1 = +0.9$.
  $$\hat{A}_{2, 1} = 0.9 + 0.90(1 - 0)(-0.1) = 0.9 - 0.09 = +0.81$$
- Env 3 ($D_{3, 1} = 0$): $\delta_{3, 1} = 2 + 0.9(1) - 1 = +1.9$.
  $$\hat{A}_{3, 1} = 1.9 + 0.90(1 - 0)(0.0) = +1.90$$
The vector of advantages at $t=1$ across the 4 environments is:
$$\hat{\mathbf{A}}_{\cdot, 1} = [+1.61, -1.00, +0.81, +1.90]^\top$$

---

### Worked Example 8.6: Normalized GAE Advantages
**Problem:** In PPO and A2C, empirical advantages across a mini-batch of size $B = 4$ are: $\hat{\mathbf{A}} = [2.5, -1.0, 0.5, 4.0]$.
1. Compute the sample mean $\mu_A$ and sample standard deviation $\sigma_A$.
2. Compute the normalized advantages $\tilde{A}_i = \frac{\hat{A}_i - \mu_A}{\sigma_A + 10^{-8}}$.
3. Explain why normalizing advantages prevents gradient vanishing or exploding across different stages of training.

**Solution:**
1. Sample statistics:
$$\mu_A = \frac{2.5 + (-1.0) + 0.5 + 4.0}{4} = \frac{6.0}{4} = 1.50$$
Deviations: $2.5 - 1.5 = +1.0, -1.0 - 1.5 = -2.5, 0.5 - 1.5 = -1.0, 4.0 - 1.5 = +2.5$.
Sum of squared deviations:
$$(1.0)^2 + (-2.5)^2 + (-1.0)^2 + (2.5)^2 = 1.0 + 6.25 + 1.0 + 6.25 = 14.5$$
Sample variance ($N-1 = 3$):
$$s^2 = \frac{14.5}{3} \approx 4.8333 \implies \sigma_A = \sqrt{4.8333} \approx 2.1985$$

2. Normalized advantages:
- $\tilde{A}_0 = \frac{1.0}{2.1985} \approx +0.4549$
- $\tilde{A}_1 = \frac{-2.5}{2.1985} \approx -1.1371$
- $\tilde{A}_2 = \frac{-1.0}{2.1985} \approx -0.4549$
- $\tilde{A}_3 = \frac{2.5}{2.1985} \approx +1.1371$

3. Purpose:
Without normalization, early in training when the Critic has high errors, raw advantages can reach $\hat{A} = 100$, causing massive parameter shifts. Late in training when the Critic is accurate, raw advantages shrink to $\hat{A} = 0.001$, stalling policy updates. Normalizing advantages ensures that the advantage distribution always has mean 0 and unit variance $\sigma = 1$, maintaining steady, predictable policy gradient updates throughout training.

---

### Worked Example 8.7: Synchronous Gradient All-Reduce in A2C
**Problem:** An A2C implementation distributes computation across 2 GPU workers.
Worker 1 computes gradient vector $\mathbf{g}_1 = [0.4, -0.6]^\top$ on batch size $B=32$.
Worker 2 computes gradient vector $\mathbf{g}_2 = [0.2, 0.8]^\top$ on batch size $B=32$.
1. Compute the synchronized all-reduced average gradient $\bar{\mathbf{g}}$.
2. If the current parameter vector is $\boldsymbol{\theta}_0 = [1.0, 1.0]^\top$ and learning rate is $\alpha = 0.1$, compute the updated parameter vector $\boldsymbol{\theta}_1$.

**Solution:**
1. All-Reduce average gradient:
$$\bar{\mathbf{g}} = \frac{\mathbf{g}_1 + \mathbf{g}_2}{2} = \frac{1}{2} \left( \begin{bmatrix} 0.4 \\ -0.6 \end{bmatrix} + \begin{bmatrix} 0.2 \\ 0.8 \end{bmatrix} \right) = \frac{1}{2} \begin{bmatrix} 0.6 \\ 0.2 \end{bmatrix} = \begin{bmatrix} 0.3 \\ 0.1 \end{bmatrix}$$

2. Parameter update:
$$\boldsymbol{\theta}_1 = \boldsymbol{\theta}_0 + \alpha \bar{\mathbf{g}} = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix} + 0.1 \begin{bmatrix} 0.3 \\ 0.1 \end{bmatrix} = \begin{bmatrix} 1.0 + 0.03 \\ 1.0 + 0.01 \end{bmatrix} = \begin{bmatrix} 1.03 \\ 1.01 \end{bmatrix}$$
Synchronous All-Reduce guarantees mathematically equivalent results to running a single worker with batch size $2B = 64$.

---

### Worked Example 8.8: Generalized Advantage Estimation Function in TypeScript
**Problem:** Author a TypeScript function `computeGAE` that accepts arrays of rewards, values, and dones, along with $\gamma$ and $\lambda$, and returns the complete array of GAE advantage estimates $\hat{A}_t$ and TD targets $y_t$.

**Solution:**
```typescript
export interface GAEResult {
  advantages: Float64Array;
  targets: Float64Array; // y_t = A_t + V(s_t)
}

export function computeGAE(
  rewards: number[],
  values: number[], // Length: T + 1 (includes terminal/next state value V(s_T))
  dones: boolean[],  // Length: T
  gamma: number = 0.99,
  lambda: number = 0.95
): GAEResult {
  const T = rewards.length;
  const advantages = new Float64Array(T);
  const targets = new Float64Array(T);

  let gae = 0;
  const factor = gamma * lambda;

  // Backward recurrence from T-1 down to 0
  for (let t = T - 1; t >= 0; t--) {
    const nonTerminal = dones[t] ? 0.0 : 1.0;
    // delta_t = r_{t+1} + gamma * V(s_{t+1}) * (1 - done) - V(s_t)
    const delta = rewards[t] + gamma * values[t + 1] * nonTerminal - values[t];
    // A_t = delta_t + gamma * lambda * (1 - done) * A_{t+1}
    gae = delta + factor * nonTerminal * gae;
    advantages[t] = gae;
    // Target for critic regression: y_t = A_t + V(s_t)
    targets[t] = gae + values[t];
  }

  return { advantages, targets };
}
```

Verification Test:
```typescript
const res = computeGAE([1.0, 2.0, 0.0, 4.0], [2.5, 3.0, 2.0, 4.0, 1.0], [false, false, false, false], 0.90, 0.80);
console.log("GAE Advantage at t=0:", res.advantages[0].toFixed(4)); // 2.9414 (matches Worked Example 8.1!)
```

---

### Worked Example 8.9: Actor-Critic Gradient Step with Clipped Gradients
**Problem:** A deep neural network experiences a large gradient vector $\mathbf{g} = [3.0, -4.0]^\top$.
Global gradient norm clipping threshold is set to $M = 2.5$.
1. Compute the $L_2$ norm of $\mathbf{g}$.
2. Compute the clipped gradient vector $\mathbf{g}_{\text{clipped}} = \mathbf{g} \cdot \min\left(1.0, \frac{M}{\|\mathbf{g}\|_2}\right)$.
3. Verify that $\|\mathbf{g}_{\text{clipped}}\|_2 = M$.

**Solution:**
1. $L_2$ norm calculation:
$$\|\mathbf{g}\|_2 = \sqrt{3.0^2 + (-4.0)^2} = \sqrt{9.0 + 16.0} = \sqrt{25.0} = 5.0$$

2. Clipped gradient:
Scaling factor:
$$\text{factor} = \min\left(1.0, \frac{2.5}{5.0}\right) = \min(1.0, 0.5) = 0.5$$
$$\mathbf{g}_{\text{clipped}} = 0.5 \times \begin{bmatrix} 3.0 \\ -4.0 \end{bmatrix} = \begin{bmatrix} 1.5 \\ -2.0 \end{bmatrix}$$

3. Norm verification:
$$\|\mathbf{g}_{\text{clipped}}\|_2 = \sqrt{1.5^2 + (-2.0)^2} = \sqrt{2.25 + 4.0} = \sqrt{6.25} = 2.5 = M$$
Gradient clipping rescales the vector strictly to length $2.5$ while preserving its directional angle.

---

### Worked Example 8.10: Complete TypeScript Implementation of A2C Agent
**Problem:** Author a complete, modular TypeScript class `A2CAgent` implementing a dual Actor-Critic network with GAE, normalized advantages, entropy bonus, and batch updates.

**Solution:**
```typescript
import { computeGAE } from './gae'; // Assuming GAE from Worked Example 8.8

export interface RolloutBuffer {
  states: number[][];
  actions: number[];
  rewards: number[];
  dones: boolean[];
  values: number[];
}

export class A2CAgent {
  public actorWeights: number[][]; // numActions x stateDim
  public criticWeights: number[];   // stateDim
  public criticBias: number = 0;

  constructor(
    public readonly stateDim: number,
    public readonly numActions: number,
    public readonly gamma: number = 0.99,
    public readonly lambda: number = 0.95,
    public readonly lrActor: number = 0.001,
    public readonly lrCritic: number = 0.005,
    public readonly entCoef: number = 0.01
  ) {
    this.actorWeights = Array.from({ length: numActions }, () =>
      new Array(stateDim).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );
    this.criticWeights = new Array(stateDim).fill(0);
  }

  predictValue(state: number[]): number {
    let val = this.criticBias;
    for (let d = 0; d < this.stateDim; d++) val += this.criticWeights[d] * state[d];
    return val;
  }

  predictProbs(state: number[]): number[] {
    const logits = new Array(this.numActions).fill(0);
    let maxLogit = -Infinity;
    for (let a = 0; a < this.numActions; a++) {
      let sum = 0;
      for (let d = 0; d < this.stateDim; d++) sum += this.actorWeights[a][d] * state[d];
      logits[a] = sum;
      if (sum > maxLogit) maxLogit = sum;
    }
    let sumExp = 0;
    const probs = new Array(this.numActions).fill(0);
    for (let a = 0; a < this.numActions; a++) {
      probs[a] = Math.exp(logits[a] - maxLogit);
      sumExp += probs[a];
    }
    for (let a = 0; a < this.numActions; a++) probs[a] /= sumExp;
    return probs;
  }

  update(rollout: RolloutBuffer, nextStateValue: number): { actorLoss: number; criticLoss: number } {
    const T = rollout.rewards.length;
    const allValues = [...rollout.values, nextStateValue];

    // 1. Compute GAE
    const { advantages, targets } = computeGAE(
      rollout.rewards,
      allValues,
      rollout.dones,
      this.gamma,
      this.lambda
    );

    // 2. Normalize Advantages
    let meanAdv = 0;
    for (let t = 0; t < T; t++) meanAdv += advantages[t];
    meanAdv /= T;

    let varAdv = 0;
    for (let t = 0; t < T; t++) varAdv += (advantages[t] - meanAdv) ** 2;
    const stdAdv = Math.sqrt(varAdv / T) + 1e-8;

    const normAdv = new Float64Array(T);
    for (let t = 0; t < T; t++) normAdv[t] = (advantages[t] - meanAdv) / stdAdv;

    let totalActorLoss = 0;
    let totalCriticLoss = 0;

    // 3. Update Critic and Actor Parameters
    for (let t = 0; t < T; t++) {
      const state = rollout.states[t];
      const action = rollout.actions[t];
      const target = targets[t];
      const adv = normAdv[t];

      // Critic Update (MSE: target - V)
      const currentV = this.predictValue(state);
      const cError = target - currentV;
      totalCriticLoss += 0.5 * cError * cError;
      for (let d = 0; d < this.stateDim; d++) {
        this.criticWeights[d] += this.lrCritic * cError * state[d];
      }
      this.criticBias += this.lrCritic * cError;

      // Actor Update
      const probs = this.predictProbs(state);
      let entropy = 0;
      for (let a = 0; a < this.numActions; a++) {
        if (probs[a] > 1e-12) entropy -= probs[a] * Math.log(probs[a]);
      }

      totalActorLoss -= Math.log(probs[action] + 1e-12) * adv;

      for (let a = 0; a < this.numActions; a++) {
        const indicator = a === action ? 1.0 : 0.0;
        const pgScore = (indicator - probs[a]) * adv;
        const logP = probs[a] > 1e-12 ? Math.log(probs[a]) : 0;
        const entGrad = -probs[a] * (logP + entropy);
        const updateFactor = pgScore + this.entCoef * entGrad;

        for (let d = 0; d < this.stateDim; d++) {
          this.actorWeights[a][d] += this.lrActor * updateFactor * state[d];
        }
      }
    }

    return {
      actorLoss: totalActorLoss / T,
      criticLoss: totalCriticLoss / T
    };
  }
}
```

---

## 8.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 8.1: Telescoping Sum Proof of $k$-Step Advantage Equivalence
**Problem:** Let $\delta_t = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$.
Prove by mathematical induction that for any $k \ge 1$:
$$\sum_{l=0}^{k-1} \gamma^l \delta_{t+l} = \left( \sum_{l=0}^{k-1} \gamma^l r_{t+l+1} \right) + \gamma^k V(s_{t+k}) - V(s_t)$$

**Solution:**
**Base Case ($k = 1$):**
$$\sum_{l=0}^0 \gamma^l \delta_{t+l} = \delta_t = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
Right-hand side:
$$\left( \sum_{l=0}^0 \gamma^l r_{t+l+1} \right) + \gamma^1 V(s_{t+1}) - V(s_t) = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
Base case holds.

**Inductive Step:**
Assume the identity holds for $k = m$:
$$\sum_{l=0}^{m-1} \gamma^l \delta_{t+l} = \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m V(s_{t+m}) - V(s_t)$$
For $k = m + 1$:
$$\sum_{l=0}^m \gamma^l \delta_{t+l} = \left( \sum_{l=0}^{m-1} \gamma^l \delta_{t+l} \right) + \gamma^m \delta_{t+m}$$
Substitute inductive hypothesis and expand $\delta_{t+m} = r_{t+m+1} + \gamma V(s_{t+m+1}) - V(s_{t+m})$:
$$= \left[ \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m V(s_{t+m}) - V(s_t) \right] + \gamma^m \left[ r_{t+m+1} + \gamma V(s_{t+m+1}) - V(s_{t+m}) \right]$$
Expand the second term:
$$= \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m V(s_{t+m}) - V(s_t) + \gamma^m r_{t+m+1} + \gamma^{m+1} V(s_{t+m+1}) - \gamma^m V(s_{t+m})$$
Notice that $+\gamma^m V(s_{t+m})$ and $-\gamma^m V(s_{t+m})$ cancel out identically!
$$= \left( \sum_{l=0}^{m-1} \gamma^l r_{t+l+1} + \gamma^m r_{t+m+1} \right) + \gamma^{m+1} V(s_{t+m+1}) - V(s_t)$$
$$= \sum_{l=0}^m \gamma^l r_{t+l+1} + \gamma^{m+1} V(s_{t+m+1}) - V(s_t)$$
The identity holds for $k = m + 1$. By induction, it holds for all $k \ge 1$. $\blacksquare$

---

### Exercise 8.2: Upper Bound on GAE Advantage Bias
**Problem:** Schulman et al. (2015) established that if the value function error is bounded, $|V(s) - V^\pi(s)| \le \epsilon_V$ for all $s \in \mathcal{S}$:
Show that the bias of the GAE advantage estimator with decay parameter $\lambda$ satisfies:
$$\left| \mathbb{E}[\hat{A}_t^{\text{GAE}}] - A^\pi(s_t, a_t) \right| \le \frac{2 \gamma \epsilon_V (1 - \lambda)}{1 - \gamma \lambda}$$

**Solution:**
From the definition of GAE:
$$\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$$
Recall that $\mathbb{E}[\delta_{t+l}^V \mid s_{t+l}, a_{t+l}] = A^\pi(s_{t+l}, a_{t+l}) + \gamma (V(s_{t+l+1}) - V^\pi(s_{t+l+1})) - (V(s_{t+l}) - V^\pi(s_{t+l}))$.
Let $e(s) = V(s) - V^\pi(s)$. Then $|e(s)| \le \epsilon_V$.
Taking the expectation conditioned on $(s_t, a_t)$:
$$\mathbb{E}[\hat{A}_t^{\text{GAE}} - A^\pi(s_t, a_t)] = \sum_{l=0}^\infty (\gamma \lambda)^l \mathbb{E}[\gamma e(s_{t+l+1}) - e(s_{t+l})]$$
Expanding and rearranging terms:
$$= -e(s_t) + \sum_{l=1}^\infty (\gamma \lambda)^{l-1} (\gamma - \gamma \lambda) \mathbb{E}[e(s_{t+l})]$$
Taking absolute values and applying the triangle inequality:
$$\le \epsilon_V + \gamma (1 - \lambda) \epsilon_V \sum_{l=1}^\infty (\gamma \lambda)^{l-1} = \epsilon_V + \frac{\gamma (1 - \lambda) \epsilon_V}{1 - \gamma \lambda} = \epsilon_V \left( 1 + \frac{\gamma(1 - \lambda)}{1 - \gamma \lambda} \right) = \frac{\epsilon_V (1 + \gamma - 2\gamma \lambda)}{1 - \gamma \lambda} \le \frac{2 \gamma \epsilon_V (1 - \lambda)}{1 - \gamma \lambda}$$
Notice:
- As $\lambda \to 1$ (Monte Carlo), the bias bound approaches $0$.
- As $\lambda \to 0$ (1-step TD), the bias bound reaches its maximum $\frac{2\gamma \epsilon_V}{1}$. GAE exponentially suppresses value estimation errors by factor $(1 - \lambda)$.

---

### Exercise 8.3: Generalized Advantage Estimation Variance Bound
**Problem:** Suppose the variance of the 1-step TD residual is $\mathbb{V}[\delta_t^V] = \sigma_\delta^2$, and assume $\delta_t^V$ are approximately uncorrelated across steps.
1. Derive the variance of the GAE advantage estimator $\mathbb{V}[\hat{A}_t^{\text{GAE}}]$ as a function of $\gamma, \lambda$, and $\sigma_\delta^2$.
2. Evaluate the variance for $\gamma = 0.99$ when $\lambda = 0$ (1-step) vs $\lambda = 1.0$ (Monte Carlo).

**Solution:**
1. Variance derivation:
$$\hat{A}_t^{\text{GAE}} = \sum_{l=0}^\infty (\gamma \lambda)^l \delta_{t+l}^V$$
Since $\delta_{t+l}^V$ are assumed uncorrelated:
$$\mathbb{V}[\hat{A}_t^{\text{GAE}}] = \sum_{l=0}^\infty (\gamma \lambda)^{2l} \mathbb{V}[\delta_{t+l}^V] = \sigma_\delta^2 \sum_{l=0}^\infty (\gamma^2 \lambda^2)^l = \frac{\sigma_\delta^2}{1 - \gamma^2 \lambda^2}$$

2. Evaluations ($\gamma = 0.99$):
- For $\lambda = 0$ (1-step TD):
  $$\mathbb{V}[\hat{A}] = \frac{\sigma_\delta^2}{1 - 0} = \sigma_\delta^2 = 1.0 \times \sigma_\delta^2$$
- For $\lambda = 1.0$ (Monte Carlo):
  $$\mathbb{V}[\hat{A}] = \frac{\sigma_\delta^2}{1 - (0.99)^2} = \frac{\sigma_\delta^2}{1 - 0.9801} = \frac{\sigma_\delta^2}{0.0199} \approx 50.25 \times \sigma_\delta^2$$
The Monte Carlo estimator has **over 50 times higher variance** than the 1-step estimator! Setting $\lambda = 0.95$ yields $\mathbb{V}[\hat{A}] = \frac{\sigma_\delta^2}{1 - (0.99 \times 0.95)^2} = \frac{\sigma_\delta^2}{1 - 0.8845} \approx 8.65 \times \sigma_\delta^2$, achieving an $83\%$ variance reduction compared to Monte Carlo.

---

### Exercise 8.4: Critic Loss Objective Target: Return vs GAE+Value
**Problem:** In A2C/PPO implementations, two different regression targets are commonly used to update the Critic:
- **Target A (Empirical Discounted Return):** $y_t = G_t$.
- **Target B (GAE Advantage + Current Value):** $y_t = \hat{A}_t^{\text{GAE}} + V(s_t)$.
1. Prove that for $\lambda = 1.0$, Target B is mathematically identical to Target A.
2. Prove that for $\lambda = 0.0$, Target B is the one-step TD target $r_{t+1} + \gamma V(s_{t+1})$.
3. Why is Target B universally preferred in modern deep RL pipelines?

**Solution:**
1. Case $\lambda = 1.0$:
$$\hat{A}_t^{\text{GAE}(\gamma, 1)} = G_t - V(s_t)$$
$$y_t = \hat{A}_t^{\text{GAE}} + V(s_t) = (G_t - V(s_t)) + V(s_t) = G_t = \text{Target A} \quad \blacksquare$$

2. Case $\lambda = 0.0$:
$$\hat{A}_t^{\text{GAE}(\gamma, 0)} = \delta_t^V = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$$
$$y_t = \hat{A}_t^{\text{GAE}} + V(s_t) = (r_{t+1} + \gamma V(s_{t+1}) - V(s_t)) + V(s_t) = r_{t+1} + \gamma V(s_{t+1}) \quad \blacksquare$$

3. Preference for Target B:
Target B smoothly inherits the $\lambda$-interpolation of GAE. Setting $\lambda = 0.95$ provides a target that is significantly less noisy than raw Monte Carlo returns $G_t$, while avoiding the severe bootstrapping lag of pure 1-step TD. It unifies actor and critic optimization under a single, consistent bias-variance knob.

---

### Exercise 8.5: Hogwild! Lock-Free SGD Convergence Conditions
**Problem:** In A3C, parallel threads update shared parameters $\boldsymbol{\theta}$ using asynchronous, lock-free writes (Recht et al., 2011, *Hogwild!*).
Under what condition on the sparsity of the gradient vectors $\mathbf{g}_i$ is Hogwild! SGD guaranteed to converge at the same asymptotic rate as serial SGD?

**Solution:**
Recht et al. proved that Hogwild! achieves linear speedup without locking provided that gradient updates are **sparse**:
Let $e \subseteq \{1, \dots, d\}$ denote the subset of coordinate indices modified by a gradient step.
Let $\rho = \max_{e \in E} \frac{|e|}{d}$ be the maximum coordinate participation ratio, and $\Delta = \max_{e \in E} |\{e' \in E : e \cap e' \neq \emptyset\}|$ be the conflict degree.
If $\rho \ll 1$ and the maximum staleness $\tau$ of any thread satisfies:
$$\tau \le \mathcal{O}(d^{1/4})$$
then the probability that two threads attempt to overwrite the identical coordinate simultaneously is negligibly small. The asynchronous noise acts as an infinitesimal mean-zero perturbation, preserving the $\mathcal{O}(1/\sqrt{T})$ convergence rate of serial SGD.

---

### Exercise 8.6: Vectorized Environment Memory Footprint and Throughput
**Problem:** A researcher configures an A2C worker running $N$ parallel environments on a single GPU.
Each environment produces a state vector of dimension $D = 64$ float32 numbers.
Rollout horizon is $T = 20$ steps.
1. Compute the memory consumed by a single rollout buffer of transitions $(s, a, r, d)$ in megabytes for $N = 64$ environments.
2. If environment stepping takes $0.5 \text{ ms}$ per step across all environments in parallel, and GPU forward/backward pass takes $2.0 \text{ ms}$, calculate the environment throughput in transitions per second.

**Solution:**
1. Memory calculation:
Per transition:
- State $s$: $64 \times 4 \text{ bytes} = 256$ bytes.
- Action $a$: 4 bytes.
- Reward $r$: 4 bytes.
- Done $d$: 1 byte.
- Value $V$: 4 bytes.
Total per transition $\approx 269$ bytes.
Total transitions in rollout: $N \times T = 64 \times 20 = 1,280$ transitions.
Total memory:
$$\text{Memory} = 1,280 \times 269 \text{ bytes} = 344,320 \text{ bytes} \approx 0.328 \text{ MB}$$
The rollout buffer consumes less than $1 \text{ MB}$ of VRAM.

2. Throughput calculation:
Time per rollout cycle of $T = 20$ steps:
- Environment stepping: $20 \text{ steps} \times 0.5 \text{ ms} = 10.0 \text{ ms}$.
- GPU computation: $2.0 \text{ ms}$.
Total cycle time: $10.0 + 2.0 = 12.0 \text{ ms} = 0.012 \text{ seconds}$.
Transitions collected per cycle: $64 \times 20 = 1,280$ transitions.
$$\text{Throughput} = \frac{1,280 \text{ transitions}}{0.012 \text{ seconds}} \approx 106,667 \text{ transitions/second}$$

---

### Exercise 8.7: Two-Headed Shared Backbone Gradient Interference
**Problem:** In A2C, a shared convolutional neural network $\mathbf{z} = f_{\boldsymbol{\theta}_{\text{shared}}}(s)$ feeds both an Actor head $\pi(a \mid \mathbf{z})$ and a Critic head $V(\mathbf{z})$.
1. Write the gradient of the shared parameters $\nabla_{\boldsymbol{\theta}_{\text{shared}}} \mathcal{L}_{\text{total}}$ in terms of $\nabla_{\mathbf{z}} \mathcal{L}_{\text{policy}}$ and $\nabla_{\mathbf{z}} \mathcal{L}_{\text{value}}$.
2. Describe the phenomenon of **gradient interference** (or negative transfer) between the Actor and Critic objectives.
3. How does modern practice (e.g. separate networks in continuous control) prevent this interference?

**Solution:**
1. Gradient via vector-Jacobian product:
$$\nabla_{\boldsymbol{\theta}_{\text{shared}}} \mathcal{L}_{\text{total}} = \mathbf{J}_{\boldsymbol{\theta}_{\text{shared}}}^\top \left( \nabla_{\mathbf{z}} \mathcal{L}_{\text{policy}} + c_1 \nabla_{\mathbf{z}} \mathcal{L}_{\text{value}} \right)$$
where $\mathbf{J}_{\boldsymbol{\theta}_{\text{shared}}} = \frac{\partial \mathbf{z}}{\partial \boldsymbol{\theta}_{\text{shared}}}$.

2. Gradient interference:
If the angle between the policy gradient $\mathbf{g}_{\text{actor}} = \nabla_{\mathbf{z}} \mathcal{L}_{\text{policy}}$ and the value gradient $\mathbf{g}_{\text{critic}} = \nabla_{\mathbf{z}} \mathcal{L}_{\text{value}}$ is obtuse:
$$\cos(\mathbf{g}_{\text{actor}}, \mathbf{g}_{\text{critic}}) = \frac{\mathbf{g}_{\text{actor}}^\top \mathbf{g}_{\text{critic}}}{\|\mathbf{g}_{\text{actor}}\| \|\mathbf{g}_{\text{critic}}\|} < 0$$
then updating the shared backbone to reduce value error directly damages the feature representations needed for policy decision-making, and vice versa.

3. Solution:
- In continuous control tasks (MuJoCo, Isaac Gym), practitioners almost universally maintain **two completely separate neural networks**: one dedicated exclusively to the Actor, and one dedicated exclusively to the Critic, preventing gradient interference entirely.
- In visual tasks (Atari) where feature extraction is computationally dominant, practitioners detach the gradient from the value head when backpropagating through early layers, or use projecting gradient algorithms (such as PCGrad).

---

### Exercise 8.8: Value Target Variance Under Polyak vs Periodic Synchronization
**Problem:** In some Actor-Critic variants, a target critic network $V_{\boldsymbol{\phi}^-}$ is maintained to stabilize TD error targets:
$$\delta_t = r_{t+1} + \gamma V_{\boldsymbol{\phi}^-}(s_{t+1}) - V_{\boldsymbol{\phi}}(s_t)$$
Explain why maintaining a target critic network is mandatory in off-policy methods (like DDPG/SAC) but often omitted in on-policy A2C.

**Solution:**
- **Off-Policy Methods (DDPG/SAC):** Transitions are sampled from an experience replay buffer holding millions of past transitions. The optimization objective is a bootstrapping Bellman regression with function approximation on non-stationary targets. Without a target network ($\boldsymbol{\phi}^-$), updating $V$ shifts the regression targets for the entire buffer, triggering the Deadly Triad and catastrophic divergence.
- **On-Policy Methods (A2C):** Data is collected strictly on-policy under current policy $\pi_{\boldsymbol{\theta}}$ and discarded immediately after $T$ steps. The policy and value function move synchronously in small steps; there is no massive historical replay buffer. Omitting the target network allows the Critic to learn on the freshest possible parameters, accelerating training without risking Deadly Triad divergence.

---

### Exercise 8.9: Advantage Estimation Under Terminal Non-Zero Rewards
**Problem:** An agent enters a terminal state $s_T$ ($d_T = 1$) and receives a terminal reward of $r_T = -100.0$ (e.g. fatal crash).
Critic value is $V(s_{T-1}) = -20.0$, and $V(s_T)$ is predicted as $-50.0$.
1. Compute the TD error $\delta_{T-1}^V$ with terminal masking.
2. What would $\delta_{T-1}^V$ be if the developer forgot to mask the terminal state with $(1 - d_T)$?
3. Calculate the magnitude of the hallucinated error.

**Solution:**
1. With proper terminal masking:
$$\delta_{T-1}^V = r_T + \gamma (1 - d_T) V(s_T) - V(s_{T-1}) = -100.0 + \gamma(1 - 1)(-50.0) - (-20.0) = -100.0 + 0 + 20.0 = -80.0$$

2. Without terminal masking:
$$\delta_{\text{bug}} = r_T + \gamma V(s_T) - V(s_{T-1}) = -100.0 + 0.99(-50.0) - (-20.0) = -100.0 - 49.5 + 20.0 = -129.5$$

3. Hallucination:
The bug injects an artificial error of $-49.5$ units. The agent believes that after crashing, it will continue into an imaginary future where it loses another $49.5$ points! Terminal state masking is essential to prevent phantom future returns.

---

### Exercise 8.10: Complete TypeScript Unit Verification Suite for A2C and GAE
**Problem:** Write a TypeScript verification test that creates an instance of `A2CAgent`, generates a synthetic 10-step trajectory, executes `update`, and asserts that:
1. GAE advantage matches the analytical expectation.
2. Policy and value losses are finite and non-NaN.
3. Advantage normalization produces sample mean within $10^{-7}$ of zero.

**Solution:**
```typescript
import { A2CAgent, RolloutBuffer } from './a2c-agent'; // Assuming implementation from Worked Example 8.10
import { computeGAE } from './gae';

export function testA2CVerification(): boolean {
  const agent = new A2CAgent(2, 2, 0.99, 0.95, 0.01, 0.05, 0.01);

  // 1. Create synthetic rollout buffer of length 5
  const rollout: RolloutBuffer = {
    states: [[1, 0], [0, 1], [1, 1], [0, 0], [1, 0]],
    actions: [0, 1, 0, 1, 0],
    rewards: [1.0, 2.0, 0.0, 5.0, 1.0],
    dones: [false, false, false, false, true],
    values: [1.5, 2.0, 1.0, 3.5, 0.5]
  };

  // 2. Execute update
  const { actorLoss, criticLoss } = agent.update(rollout, 0.0);
  console.log(`A2C Update Result: Actor Loss = ${actorLoss.toFixed(4)}, Critic Loss = ${criticLoss.toFixed(4)}`);

  const lossesValid = !isNaN(actorLoss) && !isNaN(criticLoss) && isFinite(actorLoss) && isFinite(criticLoss);

  // 3. Verify GAE normalization properties
  const gaeRes = computeGAE(rollout.rewards, [...rollout.values, 0.0], rollout.dones, 0.99, 0.95);
  let mean = 0;
  for (let i = 0; i < gaeRes.advantages.length; i++) mean += gaeRes.advantages[i];
  mean /= gaeRes.advantages.length;

  let varr = 0;
  for (let i = 0; i < gaeRes.advantages.length; i++) varr += (gaeRes.advantages[i] - mean) ** 2;
  const std = Math.sqrt(varr / gaeRes.advantages.length);

  const normalized = gaeRes.advantages.map(a => (a - mean) / std);
  let normMean = 0;
  for (let i = 0; i < normalized.length; i++) normMean += normalized[i];
  normMean /= normalized.length;

  const meanZero = Math.abs(normMean) < 1e-7;
  console.log(`Normalized Advantage Mean: ${normMean.toExponential(4)} (Near Zero: ${meanZero})`);

  const passed = lossesValid && meanZero;
  console.log(`Test Suite Passed: ${passed}`);
  return passed;
}

testA2CVerification();
```


# Chapter 9: Continuous Action Spaces: Gaussian Policies, DDPG, and Twin Delayed DDPG (TD3)

---

## 9.1 The Continuous Control Challenge

In discrete action spaces (such as the 18 actions of an Atari controller or the 4 movements of a gridworld), selecting an action under a learned Q-function is computationally straightforward:
$$a^* = \arg\max_{a \in \mathcal{A}} Q(s, a; \boldsymbol{\theta})$$
We simply evaluate the neural network across all $|\mathcal{A}|$ outputs in a single forward pass and extract the maximal index.

However, in real-world physical systemsâ€”such as robotic arms, autonomous vehicles, quadcopters, and humanoid bipedsâ€”actions are inherently **continuous vectors** representing physical forces, joint torques, throttle voltages, or steering angles:
$$\mathbf{a} = [a_1, a_2, \dots, a_m]^\top \in \mathcal{A} \subset \mathbb{R}^m$$
where each component is bounded within continuous limits: $a_i \in [a_{\min, i}, a_{\max, i}]$.

```
                      THE DISCRETIZATION EXPLOSION
                      
  Robotic Manipulator: 7 Joint Torques (m = 7 degrees of freedom)
  Discretize each joint into 10 bins:
  
                 Number of Actions |A| = 10^7 = 10,000,000
                 
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Evaluating 10 million actions per millisecond is impossible.â”‚
  â”‚ Discretization destroys spatial smoothness and correlation. â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

If we attempt to discretize a 7-DOF robot by dividing each joint into 10 coarse bins, the discrete action space explodes combinatorially to $10^7 = 10,000,000$ discrete actions! Evaluating $10^7$ network outputs per millisecond is computationally impossible. Furthermore, discretization discards the fundamental topological structure of continuous physical space: torque $1.01 \text{ N}\cdot\text{m}$ is virtually identical to $1.00 \text{ N}\cdot\text{m}$, but a discrete classification model treats them as entirely orthogonal categories.

To control physical systems efficiently, reinforcement learning must operate directly in the **continuous domain**.

---

## 9.2 The Deterministic Policy Gradient Theorem

In Chapter 6, we derived the stochastic Policy Gradient Theorem:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^\pi, a \sim \pi_{\boldsymbol{\theta}}} \left[ \nabla_{\boldsymbol{\theta}} \log \pi_{\boldsymbol{\theta}}(a \mid s) Q^\pi(s, a) \right]$$

Silver et al. (2014) made a foundational theoretical breakthrough by establishing the **Deterministic Policy Gradient (DPG) Theorem**.

Instead of a stochastic distribution $\pi(a \mid s)$, consider a **deterministic actor** that maps state $s$ directly to a single continuous action vector:
$$\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \in \mathbb{R}^m$$

The performance objective is the expected discounted return under the continuous state distribution $d^{\boldsymbol{\mu}}(s)$:
$$J(\boldsymbol{\theta}) = \int_{\mathcal{S}} d^{\boldsymbol{\mu}}(s) Q^{\boldsymbol{\mu}}(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)) ds$$

```
                   THE DETERMINISTIC POLICY GRADIENT FLOW
                   
       State s â”€â”€â”€â–º [ ACTOR Î¼_Î¸(s) ] â”€â”€â”€â–º Action a = Î¼_Î¸(s)
                           â”‚                         â”‚
                           â–¼ Jacobian                â–¼ Gradient
                   âˆ‡_Î¸ Î¼_Î¸(s) âˆˆ R^{m x d}     âˆ‡_a Q(s, a) âˆˆ R^m
                           â”‚                         â”‚
                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                        â”‚ Matrix-Vector Product
                                        â–¼
                     âˆ‡_Î¸ J(Î¸) = E_s [ âˆ‡_Î¸ Î¼_Î¸(s) Â· âˆ‡_a Q(s, a)|_{a=Î¼(s)} ]
```

### The Theorem
**Theorem (Silver et al., 2014):**
For any MDP satisfying standard regularity conditions, the gradient of expected return $J(\boldsymbol{\theta})$ with respect to the deterministic actor parameters $\boldsymbol{\theta}$ is:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^{\boldsymbol{\mu}}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \nabla_{\mathbf{a}} Q^{\boldsymbol{\mu}}(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)} \right]$$

### Intuition and the Chain Rule
Notice the mathematical clarity of this expression: it is nothing more than the **multivariate chain rule** applied across the Actor-Critic pipeline!
1. The Critic $Q(s, \mathbf{a})$ tells the Actor *how to change the action* to increase value:
$$\mathbf{g}_{\text{action}} = \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}(s)} \in \mathbb{R}^m$$
2. The Actor's Jacobian $\nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \in \mathbb{R}^{m \times d}$ tells how to change the network parameters $\boldsymbol{\theta}$ to move action $\mathbf{a}$ in direction $\mathbf{g}_{\text{action}}$.

Unlike the stochastic policy gradientâ€”which integrates over the entire action space $\mathcal{A}$â€”the deterministic policy gradient evaluates the gradient of $Q$ only at the single point $\mathbf{a} = \boldsymbol{\mu}(s)$, completely avoiding integration over high-dimensional action manifolds.

---

## 9.3 Deep Deterministic Policy Gradients (DDPG)

Lillicrap et al. (2015) combined the Deterministic Policy Gradient Theorem with the deep learning stabilization techniques of DQN (Experience Replay and Target Networks) to create **Deep Deterministic Policy Gradients (DDPG)**.

DDPG operates off-policy using four distinct neural networks:
1. **Online Actor:** $\boldsymbol{\mu}_{\boldsymbol{\theta}}(s)$, parameterized by $\boldsymbol{\theta}$.
2. **Target Actor:** $\boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s)$, parameterized by $\boldsymbol{\theta}^-$.
3. **Online Critic:** $Q_{\boldsymbol{\phi}}(s, \mathbf{a})$, parameterized by $\boldsymbol{\phi}$.
4. **Target Critic:** $Q_{\boldsymbol{\phi}^-}(s, \mathbf{a})$, parameterized by $\boldsymbol{\phi}^-$.

```
                            THE DDPG ARCHITECTURE
                            
                   Experience Replay Buffer D (10^6 transitions)
                                  â”‚
                                  â–¼ Mini-batch (s, a, r, s', d)
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â”‚  Target Critic Q_{Ï•^-}(s', a') â”‚ â—„â”€â”€ Target Action a' = Î¼_{Î¸^-}(s')
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚
                                 â–¼ Target y = r + Î³ (1 - d) Q_{Ï•^-}(s', Î¼_{Î¸^-}(s'))
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â”‚  Online Critic Q_Ï•(s, a)       â”‚ â—„â”€â”€ Loss: MSE( y - Q_Ï•(s, a) )
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚ âˆ‡_a Q_Ï•(s, a) | a = Î¼_Î¸(s)
                                 â–¼
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â”‚  Online Actor Î¼_Î¸(s)           â”‚ â—„â”€â”€ Maximize Q_Ï•(s, Î¼_Î¸(s))
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Exploration via Temporally Correlated Action Noise
Because the policy $\boldsymbol{\mu}_{\boldsymbol{\theta}}(s)$ is deterministic, an agent following $\boldsymbol{\mu}$ directly would never explore novel actions.
In continuous physical systems, adding independent white Gaussian noise $\epsilon_t \sim \mathcal{N}(0, \sigma^2)$ at each millisecond causes violent high-frequency jitter that averages out to zero net displacement due to physical inertia.

To achieve smooth, physics-consistent exploration, Lillicrap et al. injected temporally correlated noise generated by an **Ornstein-Uhlenbeck (OU) Process**:
$$d x_t = \theta_{\text{OU}} (\mu_{\text{OU}} - x_t) dt + \sigma_{\text{OU}} d W_t$$
where $\theta_{\text{OU}}$ is the mean-reverting friction rate, $\mu_{\text{OU}}$ is the long-term mean (typically 0), and $W_t$ is a Brownian motion.
The explored action sent to the environment is:
$$\mathbf{a}_t = \text{clip}\left( \boldsymbol{\mu}_{\boldsymbol{\theta}}(s_t) + \mathbf{x}_t, \, \mathbf{a}_{\min}, \, \mathbf{a}_{\max} \right)$$

### Soft Target Updates (Polyak Averaging)
Unlike DQN's hard periodic synchronization ($\boldsymbol{\theta}^- \leftarrow \boldsymbol{\theta}$ every $C$ steps), DDPG updates both target networks softly at every single training step using Polyak averaging with rate $\tau \ll 1$ (typically $\tau = 0.005$):
$$\boldsymbol{\theta}^- \leftarrow \tau \boldsymbol{\theta} + (1 - \tau) \boldsymbol{\theta}^-$$
$$\boldsymbol{\phi}^- \leftarrow \tau \boldsymbol{\phi} + (1 - \tau) \boldsymbol{\phi}^-$$

---

## 9.4 The Pathologies of DDPG

Despite its theoretical elegance, vanilla DDPG is notoriously brittle and sensitive to hyperparameters. Fujimoto et al. (2018) diagnosed three profound failure modes inherent to DDPG:

### 1. Severe Value Overestimation
Just as discrete Q-learning overestimates values due to $\max_a Q(s, a)$, continuous actor-critics suffer from even worse overestimation.
In DDPG, the actor parameters are updated via gradient ascent:
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha \nabla_{\boldsymbol{\theta}} Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s))$$
This gradient step moves $\boldsymbol{\mu}(s)$ directly in the direction where the Critic predicts the highest value. If the Critic has a local approximation error that spuriously peaks at action $\mathbf{a}_{\text{fake}}$, the Actor immediately shifts its output to $\mathbf{a}_{\text{fake}}$. 
When the target $y = r + \gamma Q_{\boldsymbol{\phi}^-}(s', \boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s'))$ evaluates this policy, it bootstraps on an artificially inflated peak. Over millions of steps, this overestimation cascades catastrophically, driving Q-values into hundreds of percent above true returns.

### 2. High Variance in Value Targets
Because the Actor and Critic are updated simultaneously at every step, the policy $\boldsymbol{\mu}$ shifts rapidly before the Critic has converged to an accurate value surface. An unstable Critic feeds noisy gradients to the Actor, and the changing Actor constantly alters the regression targets for the Critic.

### 3. Target Exploitation (Overfitting to Spurious Peaks)
Deep neural network value functions are not flat surfaces; they have narrow, jagged local maxima. When an unregularized deterministic policy optimizes against a jagged Critic, it learns to output actions that land squarely inside these narrow numerical artifacts.

---

## 9.5 Twin Delayed DDPG (TD3)

To resolve all three pathologies, Fujimoto, van Hoof, and Meger (2018) introduced **Twin Delayed Deep Deterministic Policy Gradients (TD3)**, built upon three novel stabilizing mechanisms:

```
                           THE THREE PILLARS OF TD3
                           
   1. Clipped Double Q-Learning:
      Maintain TWO Critics: Q_{Ï•_1} and Q_{Ï•_2}
      Target = r + Î³ Â· min( Q_{Ï•_1^-}(s', \tilde{a}), Q_{Ï•_2^-}(s', \tilde{a}) )
      (Completely neutralizes overestimation bias!)
      
   2. Target Policy Smoothing:
      \tilde{a} = clip( Î¼_{Î¸^-}(s') + clip( Îµ, -c, c ), a_min, a_max ),  Îµ ~ N(0, Ïƒ)
      (Enforces value smoothness over action neighborhood!)
      
   3. Delayed Policy Updates:
      Update Critic EVERY step.
      Update Actor and Target Networks ONLY every d steps (e.g., d = 2).
      (Allows Critic to stabilize before guiding the Actor!)
```

### 1. Clipped Double Q-Learning
TD3 maintains two independent Critic networks: $Q_{\boldsymbol{\phi}_1}(s, \mathbf{a})$ and $Q_{\boldsymbol{\phi}_2}(s, \mathbf{a})$, with corresponding target networks $Q_{\boldsymbol{\phi}_1^-}$ and $Q_{\boldsymbol{\phi}_2^-}$.

When computing the Bellman regression target, TD3 evaluates the next state-action pair using **both** target critics and takes the **minimum**:
$$y = r + \gamma (1 - d) \min_{i \in \{1, 2\}} Q_{\boldsymbol{\phi}_i^-}(s', \tilde{\mathbf{a}})$$

**Why does this work?**
Because $Q_{\boldsymbol{\phi}_1}$ and $Q_{\boldsymbol{\phi}_2}$ are initialized independently and trained on different random mini-batch subsets, their approximation errors are conditionally independent. Taking the minimum lower-bounds the true expectation:
$$\mathbb{E}[\min(Q_1, Q_2)] \le \min(\mathbb{E}[Q_1], \mathbb{E}[Q_2]) \le Q^*$$
This replaces destructive overestimation bias with benign, conservative underestimation bias.

### 2. Target Policy Smoothing (Noise Regularization)
When evaluating the target action $\tilde{\mathbf{a}}$, TD3 adds clipped Gaussian noise to the deterministic target actor output:
$$\tilde{\mathbf{a}} = \text{clip}\left( \boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s') + \text{clip}(\boldsymbol{\epsilon}, -c, c), \, \mathbf{a}_{\min}, \, \mathbf{a}_{\max} \right), \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})$$
where typically $\sigma = 0.2$ and clipping threshold $c = 0.5$.

**Intuition:**
In physical reality, similar actions should yield similar values. Adding noise to target actions smooths the value surface over a neighborhood around $\boldsymbol{\mu}(s')$, preventing the Actor from exploiting brittle, sharp spikes in the Critic's prediction.

### 3. Delayed Policy & Target Updates
In TD3, the two Critic networks are updated at **every single time step** $t$.
However, the Actor network $\boldsymbol{\mu}_{\boldsymbol{\theta}}$ and the target networks ($\boldsymbol{\theta}^-, \boldsymbol{\phi}_1^-, \boldsymbol{\phi}_2^-$) are updated at a **slower frequency**, updating only once every $d$ critic updates (typically $d = 2$):
$$\text{If } t \equiv 0 \pmod d:$$
$$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta} + \alpha_\mu \frac{1}{B}\sum_{i=1}^B \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s_i) \nabla_{\mathbf{a}} Q_{\boldsymbol{\phi}_1}(s_i, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s_i)}$$
$$\boldsymbol{\theta}^- \leftarrow \tau \boldsymbol{\theta} + (1 - \tau) \boldsymbol{\theta}^-$$
$$\boldsymbol{\phi}_i^- \leftarrow \tau \boldsymbol{\phi}_i + (1 - \tau) \boldsymbol{\phi}_i^- \quad (i \in \{1, 2\})$$

This delay guarantees that the Critic converges to a low-error value estimate before being used to compute policy gradients, slashing target variance and ensuring steady, monotonic policy improvement.

---

## 9.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 9.1: Deterministic Policy Gradient Jacobian Math
**Problem:** Let state $s \in \mathbb{R}^2$ and action $a \in \mathbb{R}^1$.
Actor is linear: $\mu_\theta(s) = \theta_1 s_1 + \theta_2 s_2$.
Critic is quadratic: $Q_\phi(s, a) = - (a - (2s_1 - s_2))^2 + 10.0$.
Current state is $s = [1.0, 3.0]^\top$.
Current actor parameters: $\boldsymbol{\theta} = [0.5, 1.0]^\top$.
1. Compute the action produced by the actor $\mu_\theta(s)$.
2. Compute the critic action-gradient $\nabla_a Q(s, a) \big|_{a = \mu_\theta(s)}$.
3. Compute the actor parameter gradient $\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$ and update $\boldsymbol{\theta}$ with $\alpha = 0.1$.

**Solution:**
1. Action evaluation:
$$\mu_\theta(s) = \theta_1 s_1 + \theta_2 s_2 = 0.5(1.0) + 1.0(3.0) = 0.5 + 3.0 = 3.5$$

2. Critic action gradient:
Target optimal action from critic equation is $a^* = 2s_1 - s_2 = 2(1.0) - 3.0 = -1.0$.
Critic derivative:
$$\frac{\partial Q}{\partial a} = - 2(a - (2s_1 - s_2)) = - 2(3.5 - (-1.0)) = - 2(4.5) = -9.0$$
The critic signals that action $a=3.5$ is too large and must decrease by moving in direction $-9.0$.

3. Deterministic Policy Gradient:
Actor Jacobian:
$$\nabla_{\boldsymbol{\theta}} \mu_\theta(s) = \begin{bmatrix} s_1 \\ s_2 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix}$$
Policy gradient:
$$\nabla_{\boldsymbol{\theta}} J = \nabla_{\boldsymbol{\theta}} \mu(s) \cdot \nabla_a Q = \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix} \times (-9.0) = \begin{bmatrix} -9.0 \\ -27.0 \end{bmatrix}$$
Parameter update ($\alpha = 0.1$):
$$\boldsymbol{\theta}_{\text{new}} = \boldsymbol{\theta} + \alpha \nabla_{\boldsymbol{\theta}} J = \begin{bmatrix} 0.5 \\ 1.0 \end{bmatrix} + 0.1 \begin{bmatrix} -9.0 \\ -27.0 \end{bmatrix} = \begin{bmatrix} 0.5 - 0.9 \\ 1.0 - 2.7 \end{bmatrix} = \begin{bmatrix} -0.4 \\ -1.7 \end{bmatrix}$$
Verification: New action $\mu_{\text{new}}(s) = -0.4(1.0) + (-1.7)(3.0) = -0.4 - 5.1 = -5.5$, which moved aggressively in the negative direction indicated by the critic!

---

### Worked Example 9.2: Step-by-Step TD3 Target Calculation with Clipped Double Q
**Problem:** An agent encounters transition $(s, a=0.5, r=2.0, s', d=\text{false})$ with $\gamma = 0.95$.
Target Actor predicts $\boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s') = 1.0$.
Action space limits: $a \in [-2.0, 2.0]$.
Target policy smoothing noise sampled: $\epsilon = +0.3$, with clipping noise bound $c = 0.2$.
The two target critics predict:
$Q_{\boldsymbol{\phi}_1^-}(s', \tilde{a}) = 14.5$, and $Q_{\boldsymbol{\phi}_2^-}(s', \tilde{a}) = 12.0$.
1. Compute the smoothed target action $\tilde{a}$.
2. Compute the TD3 Bellman target $y$.
3. Contrast this with the target DDPG would have computed using only Critic 1 without action noise.

**Solution:**
1. Smoothed target action:
Sampled noise $\epsilon = +0.3$ is clipped to $[-c, c] = [-0.2, 0.2]$:
$$\tilde{\epsilon} = \text{clip}(0.3, -0.2, 0.2) = 0.2$$
Unclipped target action: $\mu(s') + \tilde{\epsilon} = 1.0 + 0.2 = 1.2$.
Clipping to action space limits $[-2.0, 2.0]$:
$$\tilde{a} = \text{clip}(1.2, -2.0, 2.0) = 1.2$$

2. TD3 Bellman target:
TD3 takes the minimum of the two target critics:
$$\min(Q_{\boldsymbol{\phi}_1^-}(s', 1.2), Q_{\boldsymbol{\phi}_2^-}(s', 1.2)) = \min(14.5, 12.0) = 12.0$$
Target value:
$$y^{\text{TD3}} = r + \gamma (1 - d) \min_i Q_{\boldsymbol{\phi}_i^-} = 2.0 + 0.95 \times (1 - 0) \times 12.0 = 2.0 + 11.4 = 13.4$$

3. Contrast with DDPG:
DDPG would evaluate only Critic 1 without smoothing:
$$y^{\text{DDPG}} = 2.0 + 0.95 \times 14.5 = 2.0 + 13.775 = 15.775$$
TD3 prevented a $+2.375$ unit overestimation!

---

### Worked Example 9.3: Ornstein-Uhlenbeck Process Discretization and Simulation
**Problem:** The 1D Ornstein-Uhlenbeck process satisfies:
$$x_{t+1} = x_t + \theta_{\text{OU}} (\mu_{\text{OU}} - x_t) \Delta t + \sigma_{\text{OU}} \sqrt{\Delta t} \, z_t$$
where $z_t \sim \mathcal{N}(0, 1)$.
Let $\theta_{\text{OU}} = 0.15, \mu_{\text{OU}} = 0, \sigma_{\text{OU}} = 0.30$, and $\Delta t = 1.0$.
Suppose $x_0 = 1.0$, and the random standard normal draws are $z_0 = -0.5$ and $z_1 = +0.2$.
1. Compute $x_1$ and $x_2$.
2. Explain the mean-reverting property of the OU process.

**Solution:**
1. Step-by-step simulation:
- Step 0 ($x_0 = 1.0, z_0 = -0.5$):
  $$x_1 = 1.0 + 0.15(0 - 1.0)(1.0) + 0.30 \sqrt{1.0} (-0.5) = 1.0 - 0.15 - 0.15 = 0.70$$
- Step 1 ($x_1 = 0.70, z_1 = +0.2$):
  $$x_2 = 0.70 + 0.15(0 - 0.70)(1.0) + 0.30 \sqrt{1.0} (+0.2) = 0.70 - 0.105 + 0.06 = 0.655$$

2. Mean-reverting property:
When $x_t > 0$, the drift term $\theta(\mu - x_t) = 0.15(0 - x_t) = -0.15 x_t$ is negative, exerting a constant restoring force that pulls the process back toward 0. When $x_t < 0$, the drift is positive, pushing it upward. This simulates physical friction, producing temporally smooth random trajectories ideal for physical robotic actuators.

---

### Worked Example 9.4: Polyak Soft Target Tracking Convergence
**Problem:** Target network parameters update via $\boldsymbol{\phi}^-_{t+1} = \tau \boldsymbol{\phi}_t + (1 - \tau) \boldsymbol{\phi}^-_t$ with $\tau = 0.005$.
Suppose online weights drift at a constant velocity: $\phi_t = 100 + 0.1 t$.
1. Find the steady-state lag $\Delta = \phi_t - \phi^-_t$ between the online network and the target network.
2. Evaluate the lag for $\tau = 0.005$.

**Solution:**
1. Steady-state lag:
In steady state, the target network tracks the online network with a constant time lag $L$:
$$\phi^-_t = \phi_{t - L} = 100 + 0.1(t - L)$$
Substitute this into the update rule:
$$\phi^-_{t+1} - \phi^-_t = \tau (\phi_t - \phi^-_t)$$
Since $\phi_t$ increases by $0.1$ per step, $\phi^-_t$ must also increase by $0.1$ per step in steady state:
$$0.1 = \tau (\phi_t - \phi^-_t) \implies \phi_t - \phi^-_t = \frac{0.1}{\tau}$$

2. Numerical evaluation:
For $\tau = 0.005$:
$$\text{Lag } \Delta = \frac{0.1}{0.005} = 20.0 \text{ parameter units}$$
In terms of time steps: $L = \frac{\Delta}{0.1} = \frac{20.0}{0.1} = 200 \text{ steps}$.
The target network smoothly lags behind the online network by exactly 200 steps.

---

### Worked Example 9.5: Squashed Gaussian Policies via Tanh Reparameterization
**Problem:** In continuous control (e.g. Soft Actor-Critic), unbounded Gaussian actions $u \sim \mathcal{N}(\mu, \sigma^2)$ are squashed into valid bounds $[-1, 1]$ using the hyperbolic tangent:
$$a = \tanh(u)$$
1. Derive the log-probability density $\log \pi(a \mid s)$ in terms of the Gaussian density $p(u \mid s)$ using the change of variables formula.
2. Given $u = 0.5493$ (where $\tanh(u) = 0.50$), and Gaussian log-density $\log p(u \mid s) = -1.20$, compute the squashed log-density $\log \pi(a \mid s)$.

**Solution:**
1. Change of variables formula:
For a 1-to-1 invertible transformation $a = g(u)$:
$$\pi(a) = p(u) \cdot \left| \frac{da}{du} \right|^{-1}$$
Taking the logarithm:
$$\log \pi(a) = \log p(u) - \log \left| \frac{da}{du} \right|$$
Since $a = \tanh(u)$, its derivative is $\frac{da}{du} = 1 - \tanh^2(u) = 1 - a^2$.
$$\log \pi(a \mid s) = \log p(u \mid s) - \log(1 - a^2)$$

2. Numerical evaluation:
For $a = 0.50$:
$$1 - a^2 = 1 - 0.50^2 = 1 - 0.25 = 0.75$$
$$\log(1 - a^2) = \ln(0.75) \approx -0.2877$$
$$\log \pi(a \mid s) = -1.20 - (-0.2877) = -1.20 + 0.2877 = -0.9123$$
This correction term is strictly required when computing policy gradients or entropy of bounded continuous actions.

---

### Worked Example 9.6: Dual Critic Gradient Backpropagation Step
**Problem:** In TD3, Critic 1 has output $Q_1 = 8.5$ and Critic 2 has output $Q_2 = 9.2$.
The target value is $y = 8.0$.
1. Compute the loss $\mathcal{L}_1 = \frac{1}{2}(y - Q_1)^2$ and $\mathcal{L}_2 = \frac{1}{2}(y - Q_2)^2$.
2. Compute the scalar error signals $\frac{\partial \mathcal{L}_1}{\partial Q_1}$ and $\frac{\partial \mathcal{L}_2}{\partial Q_2}$.
3. Are the parameters of Critic 1 and Critic 2 updated jointly or independently?

**Solution:**
1. Loss values:
$$\mathcal{L}_1 = \frac{1}{2}(8.0 - 8.5)^2 = \frac{1}{2}(-0.5)^2 = 0.125$$
$$\mathcal{L}_2 = \frac{1}{2}(8.0 - 9.2)^2 = \frac{1}{2}(-1.2)^2 = 0.720$$

2. Error signals:
$$\frac{\partial \mathcal{L}_1}{\partial Q_1} = - (y - Q_1) = - (8.0 - 8.5) = +0.50$$
$$\frac{\partial \mathcal{L}_2}{\partial Q_2} = - (y - Q_2) = - (8.0 - 9.2) = +1.20$$

3. Independence:
Critic 1 and Critic 2 have completely separate parameter vectors $\boldsymbol{\phi}_1$ and $\boldsymbol{\phi}_2$.
Each network computes its own independent backward pass:
$$\Delta \boldsymbol{\phi}_1 = \alpha \cdot (y - Q_1) \cdot \nabla_{\boldsymbol{\phi}_1} Q_1$$
$$\Delta \boldsymbol{\phi}_2 = \alpha \cdot (y - Q_2) \cdot \nabla_{\boldsymbol{\phi}_2} Q_2$$
They interact *only* through the minimum operator when generating the regression target $y$.

---

### Worked Example 9.7: Delayed Actor Update Scheduling Math
**Problem:** A TD3 training loop runs for $10,000$ environment steps.
The agent performs 1 gradient step per environment step.
The policy delay parameter is $d = 2$.
1. How many total critic updates are performed?
2. How many total actor updates and target network updates are performed?
3. What is the ratio of critic gradient steps to actor gradient steps?

**Solution:**
1. Critic updates:
Critics update on every single step:
$$\text{Total Critic Updates} = 10,000$$

2. Actor and Target updates:
Actor and targets update only when $\text{step} \pmod 2 == 0$:
$$\text{Total Actor Updates} = \frac{10,000}{2} = 5,000$$
$$\text{Total Target Network Updates} = 5,000$$

3. Ratio:
$$\text{Ratio} = \frac{10,000}{5,000} = 2.0$$
The Critic receives twice as much training data and optimization capacity as the Actor, guaranteeing that the value surface remains smooth and well-fit before the Actor takes a step.

---

### Worked Example 9.8: Target Policy Smoothing Variance Analysis
**Problem:** Let the true Critic value surface be a noisy sine wave:
$$Q(s, a) = \sin(a) + \epsilon(a)$$
where $\epsilon(a)$ is high-frequency numerical noise with $\mathbb{E}[\epsilon] = 0$ and $\mathbb{V}[\epsilon] = \sigma_\epsilon^2$.
When evaluating $Q(s, \mu(s))$, target policy smoothing evaluates the expected value under action noise $\eta \sim \mathcal{U}[-\delta, \delta]$:
$$\bar{Q}(s, \mu(s)) = \frac{1}{2\delta} \int_{-\delta}^\delta Q(s, \mu(s) + \eta) d\eta$$
1. Show that the variance of the smoothed noise term $\bar{\epsilon} = \frac{1}{2\delta}\int_{-\delta}^\delta \epsilon(a+\eta)d\eta$ is strictly smaller than $\sigma_\epsilon^2$.
2. Explain how this prevents the Actor from getting stuck in high-frequency local maxima.

**Solution:**
1. Variance of moving average filter:
Integrating independent noise over an interval of width $2\delta$ acts as a low-pass smoothing filter.
If the noise correlation length is $\Delta \ll 2\delta$, the integral can be approximated as an average of $K \approx \frac{2\delta}{\Delta}$ independent random draws:
$$\mathbb{V}[\bar{\epsilon}] \approx \frac{\sigma_\epsilon^2}{K} = \frac{\sigma_\epsilon^2 \Delta}{2\delta} \ll \sigma_\epsilon^2$$
The variance is reduced by factor $\frac{\Delta}{2\delta}$.

2. Consequence:
A sharp, narrow spike in the Critic (width $< \delta$) is flattened out by the integral, while the broad, physical macroscopic trend ($\sin(a)$) is preserved. The Actor is completely insulated from numerical ripples and ascends only genuine, broad value ridges.

---

### Worked Example 9.9: Complete TypeScript Implementation of Ornstein-Uhlenbeck Noise
**Problem:** Author a TypeScript class `OrnsteinUhlenbeckNoise` implementing a multi-dimensional mean-reverting process with resetting, boundary clamping, and reproducible Gaussian draws.

**Solution:**
```typescript
export class OrnsteinUhlenbeckNoise {
  private state: Float64Array;

  constructor(
    public readonly dim: number,
    public readonly theta: number = 0.15,
    public readonly mu: number = 0.0,
    public readonly sigma: number = 0.2,
    public readonly dt: number = 1.0
  ) {
    this.state = new Float64Array(dim).fill(mu);
  }

  reset(): void {
    this.state.fill(this.mu);
  }

  sample(): Float64Array {
    const output = new Float64Array(this.dim);
    const sqrtDt = Math.sqrt(this.dt);

    for (let i = 0; i < this.dim; i++) {
      // Box-Muller standard normal
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      // dx = theta * (mu - x) * dt + sigma * sqrt(dt) * z
      const dx = this.theta * (this.mu - this.state[i]) * this.dt + this.sigma * sqrtDt * z;
      this.state[i] += dx;
      output[i] = this.state[i];
    }

    return output;
  }
}
```

Verification Test:
```typescript
const ou = new OrnsteinUhlenbeckNoise(2, 0.15, 0.0, 0.2);
const n1 = ou.sample();
const n2 = ou.sample();
console.log("OU Noise sample 1:", n1[0].toFixed(4), n1[1].toFixed(4));
console.log("OU Noise sample 2:", n2[0].toFixed(4), n2[1].toFixed(4));
```

---

### Worked Example 9.10: Complete TypeScript Implementation of TD3 Core Algorithm Step
**Problem:** Implement the complete core update step of TD3 in TypeScript, including:
1. Dual critic evaluation.
2. Target policy smoothing with clipped Gaussian noise.
3. Clipped Double Q target generation.
4. Delayed actor and target synchronization logic.

**Solution:**
```typescript
export interface TD3Transition {
  state: number[];
  action: number[];
  reward: number;
  nextState: number[];
  done: boolean;
}

export class TD3StepEngine {
  public stepCount: number = 0;

  constructor(
    public readonly actionDim: number,
    public readonly maxAction: number = 1.0,
    public readonly gamma: number = 0.99,
    public readonly tau: number = 0.005,
    public readonly policyNoise: number = 0.2,
    public readonly noiseClip: number = 0.5,
    public readonly policyDelay: number = 2
  ) {}

  // Compute Smoothed Target Action
  computeTargetAction(targetActorPredict: (s: number[]) => number[], nextState: number[]): number[] {
    const rawAction = targetActorPredict(nextState);
    const targetAction: number[] = [];

    for (let i = 0; i < this.actionDim; i++) {
      // Sample Gaussian noise
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const noise = Math.max(-this.noiseClip, Math.min(this.noiseClip, z * this.policyNoise));
      const clamped = Math.max(-this.maxAction, Math.min(this.maxAction, rawAction[i] + noise));
      targetAction.push(clamped);
    }
    return targetAction;
  }

  // Compute TD3 Target: y = r + gamma * (1 - done) * min(Q1_target, Q2_target)
  computeTarget(
    reward: number,
    done: boolean,
    targetQ1: number,
    targetQ2: number
  ): number {
    const minTargetQ = Math.min(targetQ1, targetQ2);
    return reward + this.gamma * (done ? 0 : 1) * minTargetQ;
  }

  // Check if Actor and Target should update on this step
  shouldUpdateActor(): boolean {
    this.stepCount++;
    return this.stepCount % this.policyDelay === 0;
  }

  // Polyak Soft Update
  polyakUpdate(onlineWeights: number[], targetWeights: number[]): void {
    for (let i = 0; i < onlineWeights.length; i++) {
      targetWeights[i] = this.tau * onlineWeights[i] + (1 - this.tau) * targetWeights[i];
    }
  }
}
```

---

## 9.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 9.1: Proof of Deterministic Policy Gradient via Reparameterization
**Problem:** In continuous control, a stochastic policy can be written using the reparameterization trick: $\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}$, where $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$.
1. Express the stochastic policy gradient $\nabla_{\boldsymbol{\theta}} \mathbb{E}_{\boldsymbol{\epsilon}}[Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon})]$ using the chain rule.
2. Take the limit as $\sigma \to 0$.
3. Prove that this recovers the exact Deterministic Policy Gradient Theorem.

**Solution:**
1. Chain rule on expectation:
Since the distribution of $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$ has zero dependence on parameters $\boldsymbol{\theta}$, the gradient operator enters directly inside the expectation:
$$\nabla_{\boldsymbol{\theta}} \mathbb{E}_{\boldsymbol{\epsilon}}\left[ Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}) \right] = \mathbb{E}_{\boldsymbol{\epsilon}} \left[ \nabla_{\boldsymbol{\theta}} Q(s, \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}) \right]$$
Applying the multivariate chain rule:
$$= \mathbb{E}_{\boldsymbol{\epsilon}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \cdot \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}} \right]$$

2. Limit as $\sigma \to 0$:
As $\sigma \to 0$, the random variable $\sigma \boldsymbol{\epsilon} \to \mathbf{0}$ with probability 1.
Assuming $Q$ and $\boldsymbol{\mu}$ are continuously differentiable, by the Dominated Convergence Theorem:
$$\lim_{\sigma \to 0} \mathbb{E}_{\boldsymbol{\epsilon}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \cdot \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) + \sigma \boldsymbol{\epsilon}} \right] = \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \cdot \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)}$$

3. Conclusion:
Integrating over state distribution $d^{\boldsymbol{\mu}}(s)$:
$$\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}) = \mathbb{E}_{s \sim d^{\boldsymbol{\mu}}} \left[ \nabla_{\boldsymbol{\theta}} \boldsymbol{\mu}_{\boldsymbol{\theta}}(s) \nabla_{\mathbf{a}} Q(s, \mathbf{a}) \Big|_{\mathbf{a} = \boldsymbol{\mu}_{\boldsymbol{\theta}}(s)} \right]$$
The Deterministic Policy Gradient is the limiting case of the stochastic policy gradient as exploratory variance vanishes to zero. $\blacksquare$

---

### Exercise 9.2: Upper Bound on Double Q Underestimation Error
**Problem:** In TD3, $y = r + \gamma \min(Q_1, Q_2)$.
Suppose $Q_1(s', a') = Q^*(s', a') + \epsilon_1$ and $Q_2(s', a') = Q^*(s', a') + \epsilon_2$, where $\epsilon_1, \epsilon_2 \overset{\text{i.i.d.}}{\sim} \mathcal{U}[-\Delta, \Delta]$.
1. Derive the expected target $\mathbb{E}[y]$.
2. Calculate the underestimation bias $\mathbb{E}[y] - (r + \gamma Q^*)$.
3. Why is underestimation strictly bounded, whereas overestimation in single-critic Q-learning can grow unbounded?

**Solution:**
1. Expected target:
$$\mathbb{E}[\min(Q_1, Q_2)] = Q^* + \mathbb{E}[\min(\epsilon_1, \epsilon_2)]$$
From Worked Example 5.1 (by symmetry):
$$\mathbb{E}[\max(\epsilon_1, \epsilon_2)] = +\frac{\Delta}{3} \implies \mathbb{E}[\min(\epsilon_1, \epsilon_2)] = -\mathbb{E}[\max(-\epsilon_1, -\epsilon_2)] = -\frac{\Delta}{3}$$
Target expectation:
$$\mathbb{E}[y] = r + \gamma \left( Q^* - \frac{\Delta}{3} \right) = r + \gamma Q^* - \frac{\gamma \Delta}{3}$$

2. Underestimation bias:
$$\text{Bias} = -\frac{\gamma \Delta}{3} < 0$$

3. Boundedness:
- In single-critic Q-learning, the maximization operator $\max_a Q(s, a)$ picks positive noise, which feeds into future targets recursively: $B_{k+1} = \gamma B_k + \text{noise}$, causing explosive positive feedback.
- In Clipped Double Q, underestimation acts as a contraction: values that are underestimated are simply less preferred, but valid transitions with high rewards still pull values upward. The underestimation error cannot compound into negative infinity because the minimum is bounded below by the worst-performing estimator.

---

### Exercise 9.3: Target Policy Smoothing vs Label Smoothing in Classification
**Problem:** Compare TD3's Target Policy Smoothing:
$$\tilde{\mathbf{a}} = \boldsymbol{\mu}_{\boldsymbol{\theta}^-}(s') + \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \text{clip}(\mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I}), -c, c)$$
with Label Smoothing in supervised classification ($y_{\text{smooth}} = (1 - \epsilon) y + \epsilon / K$).
Explain how both techniques act as structural regularizers against overconfidence.

**Solution:**
- **Label Smoothing:** In classification, cross-entropy loss drives logits to $\pm \infty$ to produce probability 1.0 for the true class, making the network brittle and overconfident. Label smoothing prevents logits from exploding by forbidding target probabilities from reaching 1.0.
- **Target Policy Smoothing:** In continuous control, deterministic gradients drive the Actor to land exactly on razor-thin local peaks in the Critic surface. Adding noise regularizes the objective, forcing the Actor to find wide, robust plateaus rather than fragile, overconfident spikes. Both methods enforce entropy/smoothness on the output manifold.

---

### Exercise 9.4: Action Bounding: Tanh Squashing vs Post-Clipping Gradients
**Problem:** To constrain continuous actions to $[-a_{\max}, a_{\max}]$, two approaches are used:
- **Approach A (Post-Clipping):** The network outputs unbounded $a \in \mathbb{R}$, and the environment clips it: $a_{\text{env}} = \text{clip}(a, -a_{\max}, a_{\max})$.
- **Approach B (Tanh Squashing):** The network ends with a tanh layer: $a = a_{\max} \tanh(u)$.
Explain why Approach A causes zero-gradient saturation (the "dead actor" problem), whereas Approach B maintains smooth gradient flow.

**Solution:**
In Approach A, if the network outputs $a = 5.0$ when $a_{\max} = 1.0$, the environment clips it to $1.0$.
The derivative of the hard clipping function is:
$$\frac{d \, \text{clip}(a)}{da} = \begin{cases} 1 & \text{if } |a| < a_{\max} \\ 0 & \text{if } |a| > a_{\max} \end{cases}$$
When $|a| > a_{\max}$, the gradient is identically **zero**! The network receives zero feedback, preventing the weights from ever recovering from saturation.
In Approach B, $\frac{d(a_{\max} \tanh(u))}{du} = a_{\max} (1 - \tanh^2(u))$.
While the gradient diminishes near $\pm 1$, it is strictly non-zero for all finite $u \in \mathbb{R}$, ensuring continuous gradient propagation back into the actor weights.

---

### Exercise 9.5: Stationary Distribution of Ornstein-Uhlenbeck Process
**Problem:** The 1D Ornstein-Uhlenbeck SDE is $dx_t = -\theta x_t dt + \sigma dW_t$.
1. Derive the stationary probability distribution $p_\infty(x) = \lim_{t \to \infty} p(x_t = x)$.
2. Compute the stationary variance $\sigma_\infty^2$ in terms of $\theta$ and $\sigma$.
3. For $\theta = 0.15$ and $\sigma = 0.20$, compute the stationary standard deviation $\sigma_\infty$.

**Solution:**
1. Stationary distribution:
From the Fokker-Planck equation for a linear drift $A(x) = -\theta x$ and constant diffusion $B(x) = \sigma$:
$$\frac{\partial p}{\partial t} = -\frac{\partial}{\partial x} [-\theta x p] + \frac{1}{2} \frac{\partial^2}{\partial x^2} [\sigma^2 p] = 0$$
Integrating once:
$$\theta x p + \frac{\sigma^2}{2} \frac{dp}{dx} = 0 \implies \frac{dp}{p} = -\frac{2\theta}{\sigma^2} x dx$$
$$\ln p(x) = -\frac{\theta}{\sigma^2} x^2 + C \implies p_\infty(x) = \frac{1}{\sqrt{2\pi \sigma_\infty^2}} \exp\left( -\frac{x^2}{2\sigma_\infty^2} \right)$$
The stationary distribution is a zero-mean Gaussian $\mathcal{N}(0, \sigma_\infty^2)$.

2. Stationary variance:
$$\frac{1}{2\sigma_\infty^2} = \frac{\theta}{\sigma^2} \implies \sigma_\infty^2 = \frac{\sigma^2}{2\theta}$$

3. Numerical evaluation:
$$\sigma_\infty^2 = \frac{0.20^2}{2 \times 0.15} = \frac{0.04}{0.30} = \frac{4}{30} \approx 0.1333$$
$$\sigma_\infty = \sqrt{0.1333} \approx 0.3651$$

---

### Exercise 9.6: Gradient of Value Function with Respect to Continuous Actions
**Problem:** Let the Critic be a multi-layer perceptron:
$$Q(s, \mathbf{a}) = \mathbf{w}_2^\top \text{ReLU}(\mathbf{W}_1 [s; \mathbf{a}] + \mathbf{b}_1) + b_2$$
where $[s; \mathbf{a}] \in \mathbb{R}^{d_s + d_a}$, $\mathbf{W}_1 \in \mathbb{R}^{H \times (d_s + d_a)}$, $\mathbf{w}_2 \in \mathbb{R}^H$.
Derive the analytical vector $\nabla_{\mathbf{a}} Q(s, \mathbf{a}) \in \mathbb{R}^{d_a}$.

**Solution:**
Let $\mathbf{z} = \mathbf{W}_1 [s; \mathbf{a}] + \mathbf{b}_1 \in \mathbb{R}^H$, and $\mathbf{h} = \text{ReLU}(\mathbf{z})$.
$$Q(s, \mathbf{a}) = \mathbf{w}_2^\top \mathbf{h} + b_2$$
Differentiating with respect to action vector $\mathbf{a}$:
$$\nabla_{\mathbf{a}} Q(s, \mathbf{a}) = \left( \frac{\partial [s; \mathbf{a}]}{\partial \mathbf{a}} \right)^\top \left( \frac{\partial \mathbf{z}}{\partial [s; \mathbf{a}]} \right)^\top \left( \frac{\partial \mathbf{h}}{\partial \mathbf{z}} \right)^\top \mathbf{w}_2$$
Notice:
- $\frac{\partial [s; \mathbf{a}]}{\partial \mathbf{a}} = \begin{bmatrix} \mathbf{0}_{d_s \times d_a} \\ \mathbf{I}_{d_a \times d_a} \end{bmatrix}$.
- $\frac{\partial \mathbf{z}}{\partial [s; \mathbf{a}]} = \mathbf{W}_1 = [\mathbf{W}_{1, s} \mid \mathbf{W}_{1, a}]$.
- $\frac{\partial \mathbf{h}}{\partial \mathbf{z}} = \text{diag}(\mathbf{z} > 0)$.
Therefore:
$$\nabla_{\mathbf{a}} Q(s, \mathbf{a}) = \mathbf{W}_{1, a}^\top \left( \text{diag}(\mathbf{z} > 0) \mathbf{w}_2 \right)$$
This vector-Jacobian product computes the exact action-gradient in $\mathcal{O}(H \cdot d_a)$ operations.

---

### Exercise 9.7: DDPG vs TD3 on MuJoCo InvertedPendulum Benchmark
**Problem:** In the MuJoCo InvertedPendulum task, the reward is $r = +1.0$ per step while balanced, and $0$ on failure. Maximum episode length is 1,000 steps.
Maximum achievable undiscounted return is $1,000$.
In empirical benchmarks, DDPG estimated Q-values of $Q \approx 2,500$, while TD3 estimated $Q \approx 950$.
Explain why DDPG's estimate was physically impossible and how overestimation impaired policy learning.

**Solution:**
- Maximum physical return: Since $r \le 1.0$ and $\gamma = 0.99$:
  $$Q_{\max} \le \sum_{t=0}^\infty \gamma^t (1.0) = \frac{1.0}{1 - 0.99} = 100 \text{ (discounted)}, \quad \text{or } 1000 \text{ (undiscounted)}$$
- An estimate of $Q = 2,500$ violates the mathematical upper bound of the MDP by $150\%$.
- Consequence: When the Critic hallucinates that all actions have astronomically high values, the gradient $\nabla_{\mathbf{a}} Q$ becomes dominated by approximation noise. The Actor cannot differentiate between a genuinely balancing torque and a catastrophic torque, because both are evaluated as having astronomical returns. Overestimation destroys credit assignment.

---

### Exercise 9.8: Target Actor Delay Ratio Optimization
**Problem:** Suppose in TD3, the developer sets the policy delay parameter to $d = 10$ instead of $d = 2$.
1. How does $d = 10$ affect the wall-clock training speed of the Actor?
2. What trade-off occurs: why is $d$ not set arbitrarily large (e.g. $d = 100$)?

**Solution:**
1. Training speed: Setting $d = 10$ means the actor performs only 1 update for every 10 environment steps. The actor's policy changes very slowly.
2. Trade-off:
- If $d$ is too small ($d = 1$): Recovers DDPG instability; the critic has not converged before the actor updates.
- If $d$ is too large ($d = 100$): The Critic converges to evaluate the *current* policy $\boldsymbol{\mu}$, but the policy improves at an agonizingly sluggish pace. Sample efficiency collapses because millions of environment transitions are gathered to improve the policy by a tiny fraction. $d = 2$ provides the empirical sweet spot.

---

### Exercise 9.9: Actor Entropy in Continuous Control: TD3 vs SAC
**Problem:** TD3 uses a deterministic actor with added exploratory noise: $\mathbf{a} = \boldsymbol{\mu}(s) + \boldsymbol{\epsilon}$.
Soft Actor-Critic (SAC; Haarnoja et al., 2018) uses a maximum-entropy stochastic actor: $\mathbf{a} \sim \pi(a \mid s)$, optimizing $J = \mathbb{E}[R + \alpha \mathcal{H}(\pi)]$.
Compare the exploratory mechanisms of TD3 and SAC.

**Solution:**
- **TD3 (External Noise):** Exploration is decoupled from policy optimization. Noise is added externally to the deterministic output. The policy itself does not know that noise is being added and does not adapt its exploratory strategy to the uncertainty of the environment.
- **SAC (Intrinsic Maximum Entropy):** The policy explicitly learns its own variance $\boldsymbol{\sigma}(s)$. In states with high uncertainty or multiple viable solutions, the policy maintains high entropy. In dangerous states where precision is required, the policy automatically contracts its variance. SAC explores in an active, state-dependent, principled manner.

---

### Exercise 9.10: Complete TypeScript Unit Verification Suite for TD3
**Problem:** Write a TypeScript verification test that initializes `TD3StepEngine`, executes a sequence of 5 simulated environment steps, and asserts that:
1. Target action smoothing clamps noise within bounds $[-0.5, 0.5]$.
2. Clipped Double Q selects the minimum of the two target critics.
3. Actor updates occur strictly on steps $2$ and $4$ (delay $d=2$).

**Solution:**
```typescript
import { TD3StepEngine } from './td3-engine'; // Assuming implementation from Worked Example 9.10

export function testTD3Verification(): boolean {
  const engine = new TD3StepEngine(1, 1.0, 0.99, 0.005, 0.2, 0.5, 2);

  // 1. Verify target action smoothing bounds
  const dummyActor = (s: number[]) => [0.8];
  for (let i = 0; i < 50; i++) {
    const act = engine.computeTargetAction(dummyActor, [0]);
    if (act[0] < -1.0 || act[0] > 1.0) {
      console.error(`Target action out of bounds: ${act[0]}`);
      return false;
    }
  }
  console.log("Assertion 1 Passed: Target actions strictly clamped to [-1.0, 1.0].");

  // 2. Verify Clipped Double Q minimum selection
  const target = engine.computeTarget(1.0, false, 15.0, 10.0);
  // Expected: 1.0 + 0.99 * min(15, 10) = 1.0 + 9.9 = 10.9
  const targetCorrect = Math.abs(target - 10.9) < 1e-6;
  console.log(`Assertion 2 Passed: Clipped Double Q target = ${target.toFixed(4)} (Expected 10.9000: ${targetCorrect})`);

  // 3. Verify Delayed Updates (d = 2)
  const updates: boolean[] = [];
  for (let step = 1; step <= 5; step++) {
    updates.push(engine.shouldUpdateActor());
  }
  // Expected: [false (1), true (2), false (3), true (4), false (5)]
  const delayCorrect = !updates[0] && updates[1] && !updates[2] && updates[3] && !updates[4];
  console.log(`Assertion 3 Passed: Actor delayed update schedule = [${updates.join(', ')}] (Matches expected: ${delayCorrect})`);

  const allPassed = targetCorrect && delayCorrect;
  console.log(`TD3 Unit Suite Passed: ${allPassed}`);
  return allPassed;
}

testTD3Verification();
```


# Chapter 10: Trust Region Methods: TRPO and Proximal Policy Optimization (PPO)

---

## 10.1 The Cliff of Policy Collapse

In standard supervised deep learning, taking a gradient step that is slightly too large causes a transient increase in test loss:
$$\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k - \alpha \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta})$$
If the learning rate $\alpha$ was excessively large, subsequent gradient steps on stationary training data can readily correct the weights and resume monotonic convergence.

In reinforcement learning, the consequences of a bad gradient step are **asymmetric and catastrophic**.

Consider what occurs when a policy gradient update takes an outsized step in parameter space:
1. **The Policy Breaks:** The network weights shift into a damaged regime, causing the policy $\pi_{\boldsymbol{\theta}}$ to collapse into a dysfunctional behavior (e.g., an autonomous biped falling flat on its face).
2. **The Data Distribution Collapses:** Because RL is self-referential, the agent's future training data is gathered by the broken policy. The agent can no longer visit high-reward states.
3. **Permanent Failure:** Trapped in a catastrophic state distribution, the agent collects meaningless, noisy observations. It cannot compute meaningful gradients to climb back out of the abyss. This phenomenon is known as the **Cliff of Policy Collapse**.

```
                        THE CLIFF OF POLICY COLLAPSE
                        
     Policy Return J(Î¸)
          â”‚
      100 â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â—„â”€â”€ Optimal Policy Plateau
          â”‚          \
       75 â”‚           \
          â”‚            \
       50 â”‚             \  â—„â”€â”€ A single oversized step Î”Î¸ pushes
          â”‚              \     the parameters off the cliff!
       25 â”‚               \
          â”‚                \
        0 â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Parameters Î¸
                               â–²
                               CATASTROPHIC COLLAPSE
                               (Data distribution permanently broken)
```

To guarantee stable, monotonic policy improvement, we must enforce a mathematical constraint: **the updated policy $\pi_{\boldsymbol{\theta}}$ must not diverge too far from the old policy $\pi_{\boldsymbol{\theta}_{\text{old}}}$**.

---

## 10.2 The Policy Performance Bound

Kakade and Langford (2002) established the foundational mathematical framework relating the performance of two arbitrary policies $\pi$ and $\tilde{\pi}$.

Let $J(\pi) = \mathbb{E}_{\tau \sim \pi}[R(\tau)]$ denote the expected discounted return of policy $\pi$.
The return of a new policy $\tilde{\pi}$ can be expressed exactly in terms of the advantage function of the old policy $\pi$:
$$J(\tilde{\pi}) = J(\pi) + \mathbb{E}_{\tau \sim \tilde{\pi}} \left[ \sum_{t=0}^\infty \gamma^t A^\pi(s_t, a_t) \right] = J(\pi) + \sum_{s \in \mathcal{S}} d^{\tilde{\pi}}(s) \sum_{a \in \mathcal{A}} \tilde{\pi}(a \mid s) A^\pi(s, a)$$
where $d^{\tilde{\pi}}(s) = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s \mid s_0, \tilde{\pi})$ is the discounted state visitation distribution under the **new** policy $\tilde{\pi}$.

### The Dependency Dilemma
Notice the fundamental dilemma in this equation: the expectation requires sampling states from $d^{\tilde{\pi}}(s)$, which depends on the unknown, unobserved new policy $\tilde{\pi}$! We cannot evaluate this expectation without first deploying $\tilde{\pi}$ in the environment.

Kakade and Langford introduced the **local surrogate objective** $L_\pi(\tilde{\pi})$, which replaces the new state distribution $d^{\tilde{\pi}}(s)$ with the known, sampled state distribution of the old policy $d^\pi(s)$:
$$L_\pi(\tilde{\pi}) = J(\pi) + \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \tilde{\pi}(a \mid s) A^\pi(s, a)$$

Notice that $L_\pi(\tilde{\pi})$ matches $J(\tilde{\pi})$ to first order:
$$L_\pi(\pi) = J(\pi), \quad \nabla_{\boldsymbol{\theta}} L_{\pi_{\boldsymbol{\theta}}}(\pi_{\tilde{\boldsymbol{\theta}}}) \Big|_{\tilde{\boldsymbol{\theta}} = \boldsymbol{\theta}} = \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$

### The Monotonic Improvement Bound
Schulman et al. (2015) refined Kakade & Langford's bound to establish the celebrated **Monotonic Policy Improvement Theorem**:

**Theorem (Schulman et al., 2015):**
Let $\epsilon = \max_{s, a} |A^\pi(s, a)|$. For any two policies $\pi$ and $\tilde{\pi}$:
$$J(\tilde{\pi}) \ge L_\pi(\tilde{\pi}) - C \cdot D_{\text{KL}}^{\max}(\pi, \tilde{\pi})$$
where:
$$C = \frac{4 \epsilon \gamma}{(1 - \gamma)^2}$$
$$D_{\text{KL}}^{\max}(\pi, \tilde{\pi}) = \max_{s \in \mathcal{S}} D_{\text{KL}}(\pi(\cdot \mid s) \parallel \tilde{\pi}(\cdot \mid s))$$

```
                   THE MINORIZATION-MAXIMIZATION GUARANTEE
                   
     Return J
        â”‚                                 True Return J(Ï€)
        â”‚                                        /
        â”‚                  Surrogate L_Ï€(Î¸)     /
        â”‚                      /               /
        â”‚           \         /               /
        â”‚            \_______/               /
        â”‚               â€¢ â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  (Tangency at Î¸_old)
        â”‚              / \
        â”‚             /   \   Bound M_Ï€(Î¸) = L_Ï€(Î¸) - C Â· D_KL
        â”‚            /     \
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Policy Parameters Î¸
                           Î¸_new = argmax M_Ï€(Î¸)
                    Guaranteed: J(Î¸_new) â‰¥ M_Ï€(Î¸_new) > J(Î¸_old)!
```

This theorem provides an ironclad theoretical guarantee:
If we maximize the lower bound $M_\pi(\tilde{\pi}) = L_\pi(\tilde{\pi}) - C \cdot D_{\text{KL}}^{\max}(\pi, \tilde{\pi})$, we are guaranteed that the true expected return $J(\tilde{\pi})$ improves monotonically:
$$J(\pi_{\text{new}}) \ge J(\pi_{\text{old}})$$
Policy collapse is mathematically impossible under this bound.

---

## 10.3 Trust Region Policy Optimization (TRPO)

While the theoretical bound $J \ge L - C \cdot D_{\text{KL}}$ guarantees monotonic improvement, the theoretical penalty coefficient $C = \frac{4 \epsilon \gamma}{(1 - \gamma)^2}$ is extremely large in practice (often $> 10,000$). Taking steps with this penalty results in microscopic, imperceptible parameter updates.

Schulman et al. (2015) recognized that we can achieve the same stability by converting the bound into a **constrained optimization problem** with a hard trust region:
$$\max_{\boldsymbol{\theta}} \quad \mathbb{E}_{s \sim d^{\boldsymbol{\theta}_{\text{old}}}, a \sim \pi_{\boldsymbol{\theta}_{\text{old}}}} \left[ \frac{\pi_{\boldsymbol{\theta}}(a \mid s)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a \mid s)} A^{\boldsymbol{\theta}_{\text{old}}}(s, a) \right]$$
$$\text{subject to} \quad \bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) \le \delta$$
where $\bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) = \mathbb{E}_{s \sim d^{\boldsymbol{\theta}_{\text{old}}}} \left[ D_{\text{KL}}(\pi_{\boldsymbol{\theta}_{\text{old}}}(\cdot \mid s) \parallel \pi_{\boldsymbol{\theta}}(\cdot \mid s)) \right]$, and $\delta$ is a user-defined step size bound (typically $\delta = 0.01$).

### Solving TRPO: Second-Order Quadratic Approximation
To solve this constrained problem efficiently:
1. Linearize the surrogate objective around $\boldsymbol{\theta}_{\text{old}}$:
$$L(\boldsymbol{\theta}) \approx L(\boldsymbol{\theta}_{\text{old}}) + \mathbf{g}^\top (\boldsymbol{\theta} - \boldsymbol{\theta}_{\text{old}})$$
where $\mathbf{g} = \nabla_{\boldsymbol{\theta}} L(\boldsymbol{\theta}) \big|_{\boldsymbol{\theta} = \boldsymbol{\theta}_{\text{old}}}$ is the policy gradient vector.
2. Form a quadratic Taylor expansion of the KL divergence constraint around $\boldsymbol{\theta}_{\text{old}}$:
$$\bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) \approx \frac{1}{2} (\boldsymbol{\theta} - \boldsymbol{\theta}_{\text{old}})^\top \mathbf{H} (\boldsymbol{\theta} - \boldsymbol{\theta}_{\text{old}})$$
where $\mathbf{H} = \nabla_{\boldsymbol{\theta}}^2 \bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}) \big|_{\boldsymbol{\theta}=\boldsymbol{\theta}_{\text{old}}}$ is the **Fisher Information Matrix (FIM)**.

The optimization problem reduces to:
$$\max_{\Delta \boldsymbol{\theta}} \quad \mathbf{g}^\top \Delta \boldsymbol{\theta} \quad \text{subject to} \quad \frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{H} \Delta \boldsymbol{\theta} \le \delta$$

Using the method of Lagrange multipliers, the analytical solution is:
$$\Delta \boldsymbol{\theta} = \sqrt{\frac{2 \delta}{\mathbf{g}^\top \mathbf{H}^{-1} \mathbf{g}}} \mathbf{H}^{-1} \mathbf{g}$$

### The Conjugate Gradient Algorithm and Fisher-Vector Products
In a deep neural network with $1,000,000$ parameters, forming and inverting the $10^6 \times 10^6$ Fisher matrix $\mathbf{H}$ would consume 4 terabytes of memory and take hours to compute via Gaussian elimination.

TRPO bypasses matrix inversion by solving the linear system $\mathbf{H} \mathbf{x} = \mathbf{g}$ iteratively using the **Conjugate Gradient (CG)** algorithm. CG computes the search direction $\mathbf{x} \approx \mathbf{H}^{-1} \mathbf{g}$ in roughly 10â€“20 iterations without ever instantiating $\mathbf{H}$ explicitly! It requires only the **Hessian-vector product** (Fisher-vector product) $\mathbf{H} \mathbf{v}$:
$$\mathbf{H} \mathbf{v} = \nabla_{\boldsymbol{\theta}} \left( \left( \nabla_{\boldsymbol{\theta}} \bar{D}_{\text{KL}} \right)^\top \mathbf{v} \right)$$
which can be evaluated efficiently using two standard backward passes in automatic differentiation.

Finally, TRPO performs a **backtracking line search** along search direction $\mathbf{x}$ to ensure that the non-linear objective genuinely improves and the exact KL constraint is satisfied.

---

## 10.4 Proximal Policy Optimization (PPO)

While TRPO provides unprecedented stability and eliminates policy collapse, it suffers from severe engineering overhead:
- Second-order Conjugate Gradient solvers are difficult to parallelize and incompatible with modern distributed GPU pipelines.
- Fisher-vector products require multiple backward passes per step.
- TRPO cannot share neural network parameters between the Actor and Critic because the second-order Fisher matrix applies only to the policy distribution.

Schulman, Wolski, Dhariwal, Radford, and Klimov (2017) introduced **Proximal Policy Optimization (PPO)**: achieving the robust trust-region stability of TRPO using only **first-order stochastic gradient descent**.

### The Probability Ratio
Define the probability ratio (importance sampling weight) between the new policy and the old policy:
$$r_t(\boldsymbol{\theta}) = \frac{\pi_{\boldsymbol{\theta}}(a_t \mid s_t)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a_t \mid s_t)}$$
Notice:
- At the start of an update epoch, $\boldsymbol{\theta} = \boldsymbol{\theta}_{\text{old}} \implies r_t(\boldsymbol{\theta}) = 1.0$.
- If $r_t > 1$, action $a_t$ is more probable under the new policy than under the old policy.
- If $r_t < 1$, action $a_t$ is less probable under the new policy.

The unconstrained surrogate objective is:
$$L^{\text{CPI}}(\boldsymbol{\theta}) = \hat{\mathbb{E}}_t \left[ r_t(\boldsymbol{\theta}) \hat{A}_t \right]$$
(where CPI stands for *Conservative Policy Iteration*).

Without constraints, maximizing $L^{\text{CPI}}(\boldsymbol{\theta})$ leads to disaster: if an action achieves a positive advantage $\hat{A}_t > 0$, SGD will increase $r_t(\boldsymbol{\theta})$ to $+ \infty$, causing an enormous, unconstrained step that plunges off the policy cliff.

### The Clipped Surrogate Objective
To prevent $r_t(\boldsymbol{\theta})$ from moving too far from $1.0$, PPO penalizes changes that move $r_t$ outside the interval $[1 - \epsilon, 1 + \epsilon]$, where $\epsilon$ is a small hyperparameter (typically $\epsilon = 0.20$):
$$L^{\text{CLIP}}(\boldsymbol{\theta}) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\boldsymbol{\theta}) \hat{A}_t, \, \text{clip}(r_t(\boldsymbol{\theta}), 1 - \epsilon, 1 + \epsilon) \hat{A}_t \right) \right]$$

```
                         THE PPO CLIPPING SURROGATE
                         
      Positive Advantage A > 0               Negative Advantage A < 0
      
   L_CLIP                                 L_CLIP
     â–²                                      â–²
     â”‚         Clipped: (1+Îµ)A              â”‚              / Unclipped: r Â· A
     â”‚       â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€               â”‚             /
     â”‚      /                               â”‚            /
     â”‚     /  Unclipped: r Â· A              â”‚           /
     â”‚    /                                 â”‚  Clipped /
     â”‚   /                                  â”‚  â”€â”€â”€â”€â”€â”€â”€/   (1-Îµ)A
     â””â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º r            â””â”€â”€â”´â”€â”€â”€â”€â”€â”€â”´â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º r
       1-Îµ  1     1+Îµ                         1-Îµ     1  1+Îµ
```

### Deep Dive into the Min-Clip Mechanism
Let us dissect the two distinct cases based on the sign of the advantage $\hat{A}_t$:

#### Case 1: Positive Advantage ($\hat{A}_t > 0$)
The action performed **better than average**. We want to increase its probability ($r_t > 1$):
- When $1.0 \le r_t \le 1 + \epsilon$: The ratio is inside the trust region. The objective is $r_t \hat{A}_t$, rewarding the policy for increasing action likelihood.
- When $r_t > 1 + \epsilon$: The ratio has exceeded the trust region! The clipping function caps the value at $(1 + \epsilon) \hat{A}_t$.
- Taking the $\min(r_t \hat{A}_t, (1 + \epsilon)\hat{A}_t)$ selects the capped plateau $(1 + \epsilon)\hat{A}_t$.
- **Crucial Gradient Consequence:** On the flat plateau, $\frac{\partial}{\partial \boldsymbol{\theta}} [(1 + \epsilon)\hat{A}_t] = \mathbf{0}$. The gradient vanishes! The optimizer receives zero incentive to push the policy any further in that direction.

#### Case 2: Negative Advantage ($\hat{A}_t < 0$)
The action performed **worse than average**. We want to decrease its probability ($r_t < 1$):
- When $1 - \epsilon \le r_t \le 1.0$: The ratio is inside the trust region. The objective is $r_t \hat{A}_t$, penalizing the policy for selecting this action.
- When $r_t < 1 - \epsilon$: The action probability has already dropped significantly.
- Since $\hat{A}_t < 0$, multiplying by a smaller number yields a *larger* (less negative) value.
- Taking the $\min(r_t \hat{A}_t, (1 - \epsilon)\hat{A}_t)$ acts as a conservative lower bound: it prevents the objective from falsely appearing "rewarding" if the ratio collapses, and shuts off further gradients once $r_t < 1 - \epsilon$.

The min-clip operator creates an **asymmetric pessimistic lower bound** on policy performance:
$$L^{\text{CLIP}}(\boldsymbol{\theta}) \le L^{\text{CPI}}(\boldsymbol{\theta})$$
It allows the policy to safely execute **multiple epochs of mini-batch SGD** (e.g. 10 epochs of mini-batches) on the same collected trajectory data without destabilizing the policy.

---

## 10.5 PPO Architecture and Full Training Pipeline

In production reinforcement learning (e.g., OpenAI Five, robotics benchmarks, and RLHF for Large Language Models), PPO is the premier workhorse algorithm.

The complete training objective combines policy clipping, value function regression, and entropy regularization:
$$\mathcal{L}_t^{\text{PPO}}(\boldsymbol{\theta}, \boldsymbol{\phi}) = \hat{\mathbb{E}}_t \left[ L_t^{\text{CLIP}}(\boldsymbol{\theta}) - c_1 \mathcal{L}_t^{\text{VF}}(\boldsymbol{\phi}) + c_2 \mathcal{H}(\pi_{\boldsymbol{\theta}}(\cdot \mid s_t)) \right]$$

### Value Function Clipping
To prevent the Critic from taking destabilizingly large updates during multi-epoch SGD, PPO also clips the value function:
$$\mathcal{L}_t^{\text{VF}}(\boldsymbol{\phi}) = \frac{1}{2} \max\left( (V_{\boldsymbol{\phi}}(s_t) - y_t)^2, \, (V_{\boldsymbol{\phi}_{\text{old}}}(s_t) + \text{clip}(V_{\boldsymbol{\phi}}(s_t) - V_{\boldsymbol{\phi}_{\text{old}}}(s_t), -\epsilon_v, \epsilon_v) - y_t)^2 \right)$$

```
                         THE COMPLETE PPO ITERATION LOOP
                         
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 1. Rollout Phase (Actor interacts with N environments):     â”‚
   â”‚    Collect N x T transitions using Ï€_{Î¸_old}.               â”‚
   â”‚    Compute GAE advantages A_1, ..., A_M using Critic V_Ï•.   â”‚
   â”‚    Normalize advantages across entire rollout batch.        â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â–¼
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 2. Optimization Phase (K Epochs over Mini-batches of Size B):â”‚
   â”‚    For epoch = 1 ... K:                                     â”‚
   â”‚       Shuffle transitions into random mini-batches.         â”‚
   â”‚       For each mini-batch:                                  â”‚
   â”‚          r_t(Î¸) = Ï€_Î¸(a_t | s_t) / Ï€_{Î¸_old}(a_t | s_t)     â”‚
   â”‚          Compute L^{CLIP}(Î¸), L^{VF}(Ï•), H(Ï€_Î¸)             â”‚
   â”‚          Update Î¸, Ï• using Adam with gradient clipping.     â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â–¼
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 3. Policy Synchronization:                                  â”‚
   â”‚    Set Î¸_old â† Î¸,  Ï•_old â† Ï•.                               â”‚
   â”‚    Proceed to next environment iteration.                   â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 10.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 10.1: Analytical Evaluation of PPO Clipped Objective
**Problem:** A policy executes action $a_t$ at state $s_t$.
The old action probability was $\pi_{\text{old}}(a_t \mid s_t) = 0.20$.
Let clipping parameter $\epsilon = 0.20$.
Evaluate $L^{\text{CLIP}}$ and the gradient status for the following scenarios:
1. Scenario A: $\hat{A}_t = +4.0$, new probability $\pi_{\boldsymbol{\theta}}(a_t \mid s_t) = 0.22$.
2. Scenario B: $\hat{A}_t = +4.0$, new probability $\pi_{\boldsymbol{\theta}}(a_t \mid s_t) = 0.30$.
3. Scenario C: $\hat{A}_t = -3.0$, new probability $\pi_{\boldsymbol{\theta}}(a_t \mid s_t) = 0.14$.

**Solution:**
Clipping interval: $[1 - \epsilon, 1 + \epsilon] = [0.80, 1.20]$.

1. Scenario A:
- Probability ratio: $r_t = \frac{0.22}{0.20} = 1.10$.
- Is $r_t$ in $[0.80, 1.20]$? Yes ($1.10 \in [0.80, 1.20]$).
- $\text{clip}(r_t, 0.8, 1.2) = 1.10$.
- $L_1 = r_t \hat{A}_t = 1.10 \times 4.0 = 4.40$.
- $L_2 = \text{clip}(r_t) \hat{A}_t = 1.10 \times 4.0 = 4.40$.
$$L^{\text{CLIP}} = \min(4.40, 4.40) = 4.40$$
Gradient status: **Active** ($\frac{\partial L^{\text{CLIP}}}{\partial \boldsymbol{\theta}} = \hat{A}_t \nabla_{\boldsymbol{\theta}} r_t$).

2. Scenario B:
- Probability ratio: $r_t = \frac{0.30}{0.20} = 1.50$.
- Clipped ratio: $\text{clip}(1.50, 0.8, 1.2) = 1.20$.
- $L_1 = r_t \hat{A}_t = 1.50 \times 4.0 = 6.00$.
- $L_2 = \text{clip}(r_t) \hat{A}_t = 1.20 \times 4.0 = 4.80$.
$$L^{\text{CLIP}} = \min(6.00, 4.80) = 4.80$$
Gradient status: **Clipped / Zero Gradient** ($\frac{\partial L^{\text{CLIP}}}{\partial \boldsymbol{\theta}} = \mathbf{0}$). The optimizer stops pushing $\pi(a_t)$ higher.

3. Scenario C:
- Probability ratio: $r_t = \frac{0.14}{0.20} = 0.70$.
- Advantage is negative: $\hat{A}_t = -3.0 < 0$.
- Clipped ratio: $\text{clip}(0.70, 0.8, 1.2) = 0.80$.
- $L_1 = r_t \hat{A}_t = 0.70 \times (-3.0) = -2.10$.
- $L_2 = \text{clip}(r_t) \hat{A}_t = 0.80 \times (-3.0) = -2.40$.
$$L^{\text{CLIP}} = \min(-2.10, -2.40) = -2.40$$
Notice that $\min(-2.10, -2.40) = -2.40$ selected the clipped plateau $L_2$!
Gradient status: **Clipped / Zero Gradient**. The probability of this bad action has already decreased sufficiently.

---

### Worked Example 10.2: Numerical Fisher Information Matrix Calculation
**Problem:** Consider a 2-parameter categorical policy over 3 actions:
Logits are $h_1 = \theta_1, h_2 = \theta_2, h_3 = 0$.
At $\boldsymbol{\theta}_{\text{old}} = [0, 0]^\top$, the probabilities are uniform: $\mathbf{p} = [\frac{1}{3}, \frac{1}{3}, \frac{1}{3}]^\top$.
1. Compute the score function vectors $\nabla_{\boldsymbol{\theta}} \log \pi(a_i)$ for $i \in \{1, 2, 3\}$.
2. Compute the exact $2 \times 2$ Fisher Information Matrix $\mathbf{F} = \sum_{i=1}^3 p_i \nabla \log \pi(a_i) \nabla \log \pi(a_i)^\top$.
3. Invert $\mathbf{F}$ analytically.

**Solution:**
1. Score functions:
From Worked Example 6.1: $\nabla_{\boldsymbol{\theta}} \log \pi(a_i) = \mathbf{e}_i - \mathbf{p}_{1:2}$ where $\mathbf{p}_{1:2} = [\frac{1}{3}, \frac{1}{3}]^\top$:
- For $a_1$: $\nabla \log \pi(a_1) = \begin{bmatrix} 1 - \frac{1}{3} \\ 0 - \frac{1}{3} \end{bmatrix} = \begin{bmatrix} \frac{2}{3} \\ -\frac{1}{3} \end{bmatrix}$.
- For $a_2$: $\nabla \log \pi(a_2) = \begin{bmatrix} 0 - \frac{1}{3} \\ 1 - \frac{1}{3} \end{bmatrix} = \begin{bmatrix} -\frac{1}{3} \\ \frac{2}{3} \end{bmatrix}$.
- For $a_3$: $\nabla \log \pi(a_3) = \begin{bmatrix} 0 - \frac{1}{3} \\ 0 - \frac{1}{3} \end{bmatrix} = \begin{bmatrix} -\frac{1}{3} \\ -\frac{1}{3} \end{bmatrix}$.

2. Outer products:
- For $a_1$: $\begin{bmatrix} \frac{2}{3} \\ -\frac{1}{3} \end{bmatrix} \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \end{bmatrix} = \begin{bmatrix} \frac{4}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{1}{9} \end{bmatrix}$.
- For $a_2$: $\begin{bmatrix} -\frac{1}{3} \\ \frac{2}{3} \end{bmatrix} \begin{bmatrix} -\frac{1}{3} & \frac{2}{3} \end{bmatrix} = \begin{bmatrix} \frac{1}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{4}{9} \end{bmatrix}$.
- For $a_3$: $\begin{bmatrix} -\frac{1}{3} \\ -\frac{1}{3} \end{bmatrix} \begin{bmatrix} -\frac{1}{3} & -\frac{1}{3} \end{bmatrix} = \begin{bmatrix} \frac{1}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{1}{9} \end{bmatrix}$.
Expectation ($p_i = \frac{1}{3}$):
$$\mathbf{F} = \frac{1}{3} \left( \begin{bmatrix} \frac{4}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{1}{9} \end{bmatrix} + \begin{bmatrix} \frac{1}{9} & -\frac{2}{9} \\ -\frac{2}{9} & \frac{4}{9} \end{bmatrix} + \begin{bmatrix} \frac{1}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{1}{9} \end{bmatrix} \right) = \frac{1}{3} \begin{bmatrix} \frac{6}{9} & -\frac{3}{9} \\ -\frac{3}{9} & \frac{6}{9} \end{bmatrix} = \frac{1}{3} \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \\ -\frac{1}{3} & \frac{2}{3} \end{bmatrix} = \begin{bmatrix} \frac{2}{9} & -\frac{1}{9} \\ -\frac{1}{9} & \frac{2}{9} \end{bmatrix}$$

3. Inversion:
Determinant: $\det(\mathbf{F}) = (\frac{2}{9})(\frac{2}{9}) - (-\frac{1}{9})(-\frac{1}{9}) = \frac{4}{81} - \frac{1}{81} = \frac{3}{81} = \frac{1}{27}$.
$$\mathbf{F}^{-1} = \frac{1}{\det(\mathbf{F})} \begin{bmatrix} \frac{2}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{2}{9} \end{bmatrix} = 27 \begin{bmatrix} \frac{2}{9} & \frac{1}{9} \\ \frac{1}{9} & \frac{2}{9} \end{bmatrix} = \begin{bmatrix} 6 & 3 \\ 3 & 6 \end{bmatrix}$$

---

### Worked Example 10.3: TRPO Quadratic Step Calculation
**Problem:** Using the Fisher matrix inverse $\mathbf{F}^{-1} = \begin{bmatrix} 6 & 3 \\ 3 & 6 \end{bmatrix}$ from Worked Example 10.2:
Suppose the policy gradient is $\mathbf{g} = [0.1, 0.2]^\top$.
Let the trust region bound be $\delta = 0.01$.
1. Compute the unconstrained Natural Policy Gradient direction $\mathbf{x} = \mathbf{F}^{-1} \mathbf{g}$.
2. Compute the quadratic term $\mathbf{g}^\top \mathbf{x} = \mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}$.
3. Compute the exact step scaling factor $\beta = \sqrt{\frac{2\delta}{\mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}}}$ and the parameter update $\Delta \boldsymbol{\theta}$.

**Solution:**
1. Direction vector $\mathbf{x}$:
$$\mathbf{x} = \begin{bmatrix} 6 & 3 \\ 3 & 6 \end{bmatrix} \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} = \begin{bmatrix} 0.6 + 0.6 \\ 0.3 + 1.2 \end{bmatrix} = \begin{bmatrix} 1.2 \\ 1.5 \end{bmatrix}$$

2. Quadratic term:
$$\mathbf{g}^\top \mathbf{x} = [0.1, 0.2] \begin{bmatrix} 1.2 \\ 1.5 \end{bmatrix} = 0.1(1.2) + 0.2(1.5) = 0.12 + 0.30 = 0.42$$

3. Step scaling factor:
$$\beta = \sqrt{\frac{2 \times 0.01}{0.42}} = \sqrt{\frac{0.02}{0.42}} = \sqrt{\frac{1}{21}} \approx 0.2182$$
Parameter update:
$$\Delta \boldsymbol{\theta} = \beta \mathbf{x} = 0.2182 \begin{bmatrix} 1.2 \\ 1.5 \end{bmatrix} = \begin{bmatrix} 0.2619 \\ 0.3273 \end{bmatrix}$$
Verification of constraint:
$$\frac{1}{2} \Delta \boldsymbol{\theta}^\top \mathbf{F} \Delta \boldsymbol{\theta} = \frac{1}{2} \beta^2 (\mathbf{x}^\top \mathbf{F} \mathbf{x}) = \frac{1}{2} \left(\frac{2\delta}{\mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}}\right) (\mathbf{g}^\top \mathbf{F}^{-1} \mathbf{g}) = \delta = 0.01$$
The update satisfies the trust region bound exactly.

---

### Worked Example 10.4: KL Divergence Between Two 1D Gaussian Policies
**Problem:** In continuous control, policies are parameterized as Gaussians: $\pi_{\text{old}} = \mathcal{N}(\mu_{\text{old}}, \sigma_{\text{old}}^2)$ and $\pi_{\text{new}} = \mathcal{N}(\mu_{\text{new}}, \sigma_{\text{new}}^2)$.
1. Derive the closed-form KL divergence $D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\text{new}})$.
2. For $\mu_{\text{old}} = 0.0, \sigma_{\text{old}} = 1.0$, and $\mu_{\text{new}} = 0.2, \sigma_{\text{new}} = 0.90$, compute $D_{\text{KL}}$.

**Solution:**
1. Analytical derivation:
$$D_{\text{KL}}(\mathcal{N}_0 \parallel \mathcal{N}_1) = \int p_0(x) \ln\left( \frac{p_0(x)}{p_1(x)} \right) dx$$
$$= \int p_0(x) \left[ \ln\left(\frac{\sigma_1}{\sigma_0}\right) - \frac{(x - \mu_0)^2}{2\sigma_0^2} + \frac{(x - \mu_1)^2}{2\sigma_1^2} \right] dx$$
Notice that $\int p_0(x) (x - \mu_0)^2 dx = \sigma_0^2$, and $\int p_0(x) (x - \mu_1)^2 dx = \sigma_0^2 + (\mu_0 - \mu_1)^2$.
$$D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\text{new}}) = \ln\left( \frac{\sigma_{\text{new}}}{\sigma_{\text{old}}} \right) - \frac{1}{2} + \frac{\sigma_{\text{old}}^2 + (\mu_{\text{old}} - \mu_{\text{new}})^2}{2\sigma_{\text{new}}^2}$$
$$= \ln\left( \frac{\sigma_{\text{new}}}{\sigma_{\text{old}}} \right) + \frac{\sigma_{\text{old}}^2 - \sigma_{\text{new}}^2 + (\mu_{\text{old}} - \mu_{\text{new}})^2}{2\sigma_{\text{new}}^2}$$

2. Numerical evaluation:
$$\ln\left(\frac{0.90}{1.0}\right) = \ln(0.90) \approx -0.10536$$
$$\sigma_{\text{old}}^2 = 1.0, \quad \sigma_{\text{new}}^2 = 0.81, \quad (\mu_{\text{old}} - \mu_{\text{new}})^2 = (0 - 0.2)^2 = 0.04$$
$$\text{Numerator} = 1.0 - 0.81 + 0.04 = 0.23$$
$$\text{Fraction} = \frac{0.23}{2 \times 0.81} = \frac{0.23}{1.62} \approx 0.14198$$
$$D_{\text{KL}} = -0.10536 + 0.14198 = 0.03662 \text{ nats}$$

---

### Worked Example 10.5: PPO Log-Ratio Computation for Numerical Stability
**Problem:** In deep learning codebases, computing $r_t = \frac{\pi_{\boldsymbol{\theta}}(a_t \mid s_t)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a_t \mid s_t)}$ directly can cause severe floating-point underflow or overflow when probabilities are tiny ($10^{-20}$).
Show how $r_t$ is computed using log-probabilities:
$$r_t = \exp\left( \log \pi_{\boldsymbol{\theta}}(a_t \mid s_t) - \log \pi_{\boldsymbol{\theta}_{\text{old}}}(a_t \mid s_t) \right)$$
For $\log \pi_{\boldsymbol{\theta}} = -45.2$ and $\log \pi_{\boldsymbol{\theta}_{\text{old}}} = -45.0$, compute $r_t$.

**Solution:**
Computing raw probabilities directly would produce:
$$\pi_{\boldsymbol{\theta}} = e^{-45.2} \approx 2.34 \times 10^{-20}, \quad \pi_{\boldsymbol{\theta}_{\text{old}}} = e^{-45.0} \approx 2.86 \times 10^{-20}$$
In single-precision float32, very small numbers risk zero underflow.
Using difference of logarithms:
$$\Delta \log \pi = \log \pi_{\boldsymbol{\theta}} - \log \pi_{\boldsymbol{\theta}_{\text{old}}} = -45.2 - (-45.0) = -0.20$$
Evaluating the exponential:
$$r_t = \exp(-0.20) \approx 0.8187$$
The computation executes with 100% numerical precision without ever materializing subnormal floating-point numbers.

---

### Worked Example 10.6: Backtracking Line Search in TRPO
**Problem:** TRPO computes candidate step $\Delta \boldsymbol{\theta}_0 = [0.4, 0.4]^\top$.
The line search checks step sizes $\Delta \boldsymbol{\theta}_j = \alpha^j \Delta \boldsymbol{\theta}_0$ with decay rate $\alpha = 0.5$ for $j = 0, 1, 2, \dots$.
Acceptance criteria:
1. Surrogate improvement: $L(\boldsymbol{\theta}_j) - L(\boldsymbol{\theta}_{\text{old}}) > 0$.
2. Exact KL constraint: $\bar{D}_{\text{KL}}(\boldsymbol{\theta}_{\text{old}}, \boldsymbol{\theta}_j) \le \delta = 0.01$.
Suppose the evaluated metrics are:
- $j = 0$ ($\Delta \boldsymbol{\theta}_0$): $L - L_{\text{old}} = +0.15$, but $D_{\text{KL}} = 0.016 > 0.01$ (Constraint violated!).
- $j = 1$ ($\Delta \boldsymbol{\theta}_1 = 0.5 \Delta \boldsymbol{\theta}_0$): $L - L_{\text{old}} = +0.09$, and $D_{\text{KL}} = 0.007 \le 0.01$ (Valid!).
Which step is accepted, and what is its value?

**Solution:**
At $j = 0$: $D_{\text{KL}} = 0.016 > 0.01$. The step is rejected because it exceeds the trust region.
The line search scales the step by $\alpha = 0.5$:
$$\Delta \boldsymbol{\theta}_1 = 0.5 \begin{bmatrix} 0.4 \\ 0.4 \end{bmatrix} = \begin{bmatrix} 0.2 \\ 0.2 \end{bmatrix}$$
At $j = 1$: $L - L_{\text{old}} = +0.09 > 0$, and $D_{\text{KL}} = 0.007 \le 0.01$.
Both conditions are satisfied! Step $j = 1$ is accepted: $\Delta \boldsymbol{\theta} = [0.2, 0.2]^\top$.

---

### Worked Example 10.7: Value Function Clipping Loss Calculation
**Problem:** In PPO with value clipping ($\epsilon_v = 0.2$), a state has old predicted value $V_{\text{old}} = 10.0$.
The TD target is $y = 12.0$.
Current network prediction is $V_{\boldsymbol{\phi}} = 10.5$.
1. Compute the unclipped squared error $(V_{\boldsymbol{\phi}} - y)^2$.
2. Compute the clipped value prediction $V_{\text{clipped}} = V_{\text{old}} + \text{clip}(V_{\boldsymbol{\phi}} - V_{\text{old}}, -\epsilon_v, \epsilon_v)$.
3. Compute the clipped squared error $(V_{\text{clipped}} - y)^2$ and the PPO value loss $\mathcal{L}^{\text{VF}} = \frac{1}{2}\max(\text{unclipped}, \text{clipped})$.

**Solution:**
1. Unclipped error:
$$(V_{\boldsymbol{\phi}} - y)^2 = (10.5 - 12.0)^2 = (-1.5)^2 = 2.25$$

2. Clipped value:
$$\text{Difference} = V_{\boldsymbol{\phi}} - V_{\text{old}} = 10.5 - 10.0 = +0.50$$
$$\text{Clipped Difference} = \text{clip}(0.50, -0.20, 0.20) = +0.20$$
$$V_{\text{clipped}} = 10.0 + 0.20 = 10.20$$

3. Clipped error and final loss:
$$(V_{\text{clipped}} - y)^2 = (10.20 - 12.0)^2 = (-1.80)^2 = 3.24$$
Taking the maximum:
$$\mathcal{L}^{\text{VF}} = \frac{1}{2} \max(2.25, 3.24) = \frac{1}{2} (3.24) = 1.62$$
Notice that taking the maximum penalizes the network more heavily for trying to change $V$ faster than $\epsilon_v$, discouraging rapid value churn across multi-epoch SGD.

---

### Worked Example 10.8: Clipping Fraction Metric Tracking
**Problem:** Across a mini-batch of $B = 100$ transitions, an agent records probability ratios $r_t$.
Hyperparameter $\epsilon = 0.20$.
$12$ transitions have $r_t > 1.20$, and $8$ transitions have $r_t < 0.80$.
1. Compute the **Clipping Fraction** (ClipFrac).
2. What diagnostic information does a ClipFrac of $0.20$ provide?
3. What should a practitioner do if ClipFrac exceeds $0.50$?

**Solution:**
1. ClipFrac calculation:
Total clipped samples $= 12 + 8 = 20$.
$$\text{ClipFrac} = \frac{20}{100} = 0.20 \quad (20\%)$$

2. Diagnostic meaning:
$20\%$ of the transitions in the batch have hit the boundary of the trust region. In standard PPO training, a ClipFrac between $0.10$ and $0.25$ indicates healthy, active policy updates with stable trust-region enforcement.

3. Action if ClipFrac $> 0.50$:
If more than $50\%$ of transitions are clipped, the policy is changing far too rapidly across mini-batch epochs. The optimizer is wasting gradient steps on clipped, zero-gradient samples, and the policy risks catastrophic collapse. The practitioner should:
- Reduce the policy learning rate $\alpha$.
- Reduce the number of training epochs per rollout (e.g. from 10 down to 4).
- Tighten the clipping threshold $\epsilon$ (e.g. from 0.2 down to 0.1).

---

### Worked Example 10.9: Conjugate Gradient Vector Step in TypeScript
**Problem:** Author a TypeScript function `conjugateGradient` that solves the symmetric positive-definite linear system $\mathbf{A} \mathbf{x} = \mathbf{b}$ using iterative matrix-vector products $A(v)$ without forming matrix $\mathbf{A}$.

**Solution:**
```typescript
export function conjugateGradient(
  AvProduct: (v: Float64Array) => Float64Array,
  b: Float64Array,
  maxIterations: number = 10,
  residualTol: number = 1e-10
): Float64Array {
  const n = b.length;
  const x = new Float64Array(n); // initial guess x0 = 0
  const r = new Float64Array(b);  // r0 = b - A*x0 = b
  const p = new Float64Array(b);  // p0 = r0

  let rsOld = 0;
  for (let i = 0; i < n; i++) rsOld += r[i] * r[i];

  for (let iter = 0; iter < maxIterations; iter++) {
    if (Math.sqrt(rsOld) < residualTol) break;

    const Ap = AvProduct(p);
    let pAp = 0;
    for (let i = 0; i < n; i++) pAp += p[i] * Ap[i];

    if (pAp <= 0) break; // Numerical safety

    const alpha = rsOld / pAp;
    for (let i = 0; i < n; i++) {
      x[i] += alpha * p[i];
      r[i] -= alpha * Ap[i];
    }

    let rsNew = 0;
    for (let i = 0; i < n; i++) rsNew += r[i] * r[i];

    const beta = rsNew / rsOld;
    for (let i = 0; i < n; i++) {
      p[i] = r[i] + beta * p[i];
    }
    rsOld = rsNew;
  }

  return x;
}
```

Verification Test:
```typescript
// Solve A * x = b where A = [[2, -1], [-1, 2]] and b = [1, 2]
const A_mat = [[2, -1], [-1, 2]];
const Av = (v: Float64Array) => new Float64Array([
  A_mat[0][0]*v[0] + A_mat[0][1]*v[1],
  A_mat[1][0]*v[0] + A_mat[1][1]*v[1]
]);
const sol = conjugateGradient(Av, new Float64Array([1, 2]));
console.log("CG Solution:", sol[0].toFixed(4), sol[1].toFixed(4));
// Exact analytical solution is x = [4/3, 5/3] = [1.3333, 1.6667]
```

---

### Worked Example 10.10: Complete TypeScript Implementation of PPO Clipped Surrogate Loss
**Problem:** Author a TypeScript class `PPOLossEngine` that evaluates the PPO Clipped Surrogate Loss, value function clipped loss, Shannon entropy, and tracks diagnostic metrics (ClipFrac, approx KL).

**Solution:**
```typescript
export interface PPOMiniBatch {
  logProbsOld: Float64Array;
  valuesOld: Float64Array;
  advantages: Float64Array;
  returns: Float64Array;
}

export class PPOLossEngine {
  constructor(
    public readonly clipEps: number = 0.20,
    public readonly vfClipEps: number = 0.20,
    public readonly vfCoef: number = 0.50,
    public readonly entCoef: number = 0.01
  ) {}

  evaluate(
    batch: PPOMiniBatch,
    currentLogProbs: Float64Array,
    currentValues: Float64Array,
    currentEntropies: Float64Array
  ): {
    totalLoss: number;
    policyLoss: number;
    valueLoss: number;
    entropy: number;
    clipFrac: number;
    approxKL: number;
  } {
    const B = batch.logProbsOld.length;
    let policyLossSum = 0;
    let valueLossSum = 0;
    let entropySum = 0;
    let clippedCount = 0;
    let approxKLSum = 0;

    for (let i = 0; i < B; i++) {
      // 1. Probability ratio: r_t = exp(log_pi - log_pi_old)
      const logRatio = currentLogProbs[i] - batch.logProbsOld[i];
      const ratio = Math.exp(logRatio);

      // Approximate KL divergence: (ratio - 1) - logRatio (Schulman, 2020)
      approxKLSum += (ratio - 1.0) - logRatio;

      // 2. Clipped policy objective
      const adv = batch.advantages[i];
      const surr1 = ratio * adv;
      const clippedRatio = Math.max(1.0 - this.clipEps, Math.min(1.0 + this.clipEps, ratio));
      const surr2 = clippedRatio * adv;

      // Track clipping
      if (Math.abs(ratio - 1.0) > this.clipEps) clippedCount++;

      // PPO minimizes negative clipped surrogate
      const pLoss = -Math.min(surr1, surr2);
      policyLossSum += pLoss;

      // 3. Clipped Value Loss
      const vTarget = batch.returns[i];
      const vPred = currentValues[i];
      const vOld = batch.valuesOld[i];
      const vUnclipped = (vPred - vTarget) ** 2;
      const vClippedPred = vOld + Math.max(-this.vfClipEps, Math.min(this.vfClipEps, vPred - vOld));
      const vClipped = (vClippedPred - vTarget) ** 2;
      valueLossSum += 0.5 * Math.max(vUnclipped, vClipped);

      // 4. Entropy
      entropySum += currentEntropies[i];
    }

    const policyLoss = policyLossSum / B;
    const valueLoss = valueLossSum / B;
    const entropy = entropySum / B;
    const clipFrac = clippedCount / B;
    const approxKL = approxKLSum / B;

    const totalLoss = policyLoss + this.vfCoef * valueLoss - this.entCoef * entropy;

    return { totalLoss, policyLoss, valueLoss, entropy, clipFrac, approxKL };
  }
}
```

---

## 10.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 10.1: Analytical Bound on Policy Ratio Variance
**Problem:** Let $p_{\text{old}} \sim \mathcal{N}(0, 1)$ and $p_{\text{new}} \sim \mathcal{N}(\mu, 1)$ be two Gaussian distributions with mean shift $\mu$.
1. Compute the importance sampling ratio $r(x) = \frac{p_{\text{new}}(x)}{p_{\text{old}}(x)}$.
2. Compute the second moment $\mathbb{E}_{x \sim p_{\text{old}}}[r(x)^2]$.
3. Show that the variance of the unclipped ratio explodes exponentially as $\mathbb{V}[r] = e^{\mu^2} - 1$.

**Solution:**
1. Ratio calculation:
$$p_{\text{old}}(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}}, \quad p_{\text{new}}(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{(x - \mu)^2}{2}}$$
$$r(x) = \exp\left( -\frac{x^2 - 2\mu x + \mu^2 - x^2}{2} \right) = \exp\left( \mu x - \frac{\mu^2}{2} \right)$$

2. Second moment:
$$\mathbb{E}_{x \sim p_{\text{old}}}[r(x)^2] = \int_{-\infty}^\infty \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}} \cdot \exp\left( 2\mu x - \mu^2 \right) dx$$
$$= e^{-\mu^2} \int_{-\infty}^\infty \frac{1}{\sqrt{2\pi}} \exp\left( -\frac{x^2 - 4\mu x}{2} \right) dx$$
Completing the square: $x^2 - 4\mu x = (x - 2\mu)^2 - 4\mu^2$.
$$= e^{-\mu^2} \cdot e^{\frac{4\mu^2}{2}} \int_{-\infty}^\infty \frac{1}{\sqrt{2\pi}} e^{-\frac{(x - 2\mu)^2}{2}} dx = e^{-\mu^2} \cdot e^{2\mu^2} \cdot 1 = e^{\mu^2}$$

3. Variance:
Since $\mathbb{E}[r(x)] = 1.0$:
$$\mathbb{V}[r(x)] = \mathbb{E}[r(x)^2] - (\mathbb{E}[r(x)])^2 = e^{\mu^2} - 1$$
As the policy mean drifts, the variance explodes exponentially: for $\mu = 3.0$, $\mathbb{V}[r] = e^9 - 1 \approx 8,102$. This exponential explosion proves why unclipped ratio objectives are violently unstable and require PPO's clipping mechanism.

---

### Exercise 10.2: Schulman's Approximate KL Estimator
**Problem:** In PPO monitoring, computing the exact analytical KL divergence across deep networks can be expensive. Schulman (2020) proposed the estimator:
$$\hat{D}_{\text{KL}} = \frac{1}{B}\sum_{i=1}^B \left( (r_i - 1) - \ln r_i \right)$$
where $r_i = \frac{\pi_{\boldsymbol{\theta}}(a_i \mid s_i)}{\pi_{\boldsymbol{\theta}_{\text{old}}}(a_i \mid s_i)}$.
1. Prove that for any $r > 0$, $(r - 1) - \ln r \ge 0$, with equality if and only if $r = 1$.
2. Prove that $\mathbb{E}_{a \sim \pi_{\text{old}}}[\hat{D}_{\text{KL}}] = D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\boldsymbol{\theta}})$.
3. Why is this estimator strictly non-negative in sample averages, unlike the naive estimator $\ln \pi_{\text{old}} - \ln \pi_{\boldsymbol{\theta}}$?

**Solution:**
1. Strictly non-negative property:
Let $f(r) = r - 1 - \ln r$ on $(0, \infty)$.
Derivative: $f'(r) = 1 - \frac{1}{r}$.
- For $r < 1$: $f'(r) < 0$ (decreasing).
- For $r > 1$: $f'(r) > 0$ (increasing).
- At $r = 1$: $f(1) = 0 - 0 = 0$.
The global minimum is $f(1) = 0$, so $f(r) \ge 0$ for all $r > 0$.

2. Expectation proof:
$$\mathbb{E}_{a \sim \pi_{\text{old}}}[(r - 1) - \ln r] = \mathbb{E}_{a \sim \pi_{\text{old}}}[r] - \mathbb{E}_{a \sim \pi_{\text{old}}}[1] - \mathbb{E}_{a \sim \pi_{\text{old}}}[\ln r]$$
Notice:
- $\mathbb{E}_{a \sim \pi_{\text{old}}}[r] = \sum_a \pi_{\text{old}}(a) \frac{\pi_{\boldsymbol{\theta}}(a)}{\pi_{\text{old}}(a)} = \sum_a \pi_{\boldsymbol{\theta}}(a) = 1$.
- $\mathbb{E}_{a \sim \pi_{\text{old}}}[1] = 1$.
- Therefore: $\mathbb{E}[r - 1] = 1 - 1 = 0$.
Remaining term:
$$- \mathbb{E}_{a \sim \pi_{\text{old}}}[\ln r] = - \mathbb{E}_{a \sim \pi_{\text{old}}} \left[ \ln \pi_{\boldsymbol{\theta}}(a) - \ln \pi_{\text{old}}(a) \right] = \mathbb{E}_{a \sim \pi_{\text{old}}} \left[ \ln \frac{\pi_{\text{old}}(a)}{\pi_{\boldsymbol{\theta}}(a)} \right] = D_{\text{KL}}(\pi_{\text{old}} \parallel \pi_{\boldsymbol{\theta}}) \quad \blacksquare$$

3. Benefit:
The naive estimator $\hat{d} = \log \pi_{\text{old}} - \log \pi$ can produce negative sample values ($\hat{d} < 0$) due to finite-sample Monte Carlo variance, confusing monitoring dashboards. Schulman's estimator is positive at every single sample point ($f(r_i) \ge 0$), guaranteeing that the empirical mean is strictly non-negative.

---

### Exercise 10.3: Early Stopping via KL Threshold in PPO
**Problem:** In many PPO codebases, an early stopping mechanism halts multi-epoch SGD if the policy shifts too quickly:
$$\text{If } \hat{D}_{\text{KL}} > 1.5 \cdot \text{target\_kl}, \text{ break epoch loop.}$$
Suppose `target_kl = 0.01`.
Explain why early stopping acts as a secondary dynamic safety rail alongside ratio clipping.

**Solution:**
Ratio clipping ($L^{\text{CLIP}}$) operates independently on each individual transition tuple in isolation. However, across 10 epochs of mini-batch SGD, parameter updates accumulate. Even if no single sample exceeds clipping bounds, the *cumulative* shift of the policy over the entire state space can still exceed safe limits. Monitoring the average KL divergence and early-stopping when $\hat{D}_{\text{KL}} > 0.015$ guarantees that the policy never drifts outside the valid trust region regardless of how many training epochs are scheduled.

---

### Exercise 10.4: Linear Annealing of PPO Clipping Parameter
**Problem:** Some practitioners anneal the clipping parameter linearly:
$$\epsilon_t = \epsilon_0 \left( 1 - \frac{t}{T_{\max}} \right)$$
from $\epsilon_0 = 0.20$ down to $0.0$.
Discuss the mathematical implication of letting $\epsilon \to 0$ near the end of training.

**Solution:**
As $\epsilon \to 0$, the clipping boundary interval $[1 - \epsilon, 1 + \epsilon]$ contracts to the single point $[1.0, 1.0]$.
When $\epsilon = 0$, any parameter update that shifts $r_t \neq 1.0$ is immediately clipped to $1.0 \cdot \hat{A}_t$, where the gradient with respect to $\boldsymbol{\theta}$ vanishes!
Letting $\epsilon \to 0$ effectively freezes the policy, preventing fine-tuned late-stage weights from being disrupted. In practice, annealing $\epsilon$ to a small positive floor (e.g. 0.05) is preferred over 0.0 to maintain minimal learning plasticity.

---

### Exercise 10.5: Dual-Clip PPO for Extreme Negative Advantages
**Problem:** In extreme distributed RL (e.g. Ye et al., 2020, Tencent *Honor of Kings* AI), researchers observed that when advantage $\hat{A}_t \ll 0$ is extremely negative, ratio clipping does not bound the objective from below when $r_t > 1$.
They introduced **Dual-Clip PPO**:
$$L^{\text{dual}}(\boldsymbol{\theta}) = \max\left( L^{\text{CLIP}}(\boldsymbol{\theta}), \, c_3 \hat{A}_t \right) \quad \text{for } \hat{A}_t < 0$$
where $c_3 > 1.0$ (typically $c_3 = 3.0$).
Explain why unconstrained negative loss spikes occur and how Dual-Clip resolves them.

**Solution:**
When $\hat{A}_t < 0$, if the policy update inadvertently increases $r_t$ (e.g. $r_t = 2.0$), the unclipped objective is $r_t \hat{A}_t = 2.0(-100) = -200$.
The clipping function checks $\min(r_t \hat{A}_t, (1-\epsilon)\hat{A}_t) = \min(-200, -80) = -200$.
Notice that the min-operator selected the unclipped $-200$!
Because $r_t > 1$, the loss is excessively negative, generating an enormous gradient that violently destabilizes the network.
Dual-Clip PPO applies a lower threshold: $\max(-200, 3.0(-100)) = \max(-200, -300) = -200$, or caps it at $c_3 \hat{A}_t$. This caps the magnitude of negative gradients, preventing catastrophic updates from outlier failed transitions.

---

### Exercise 10.6: PPO Rollout Horizon vs Mini-Batch Size Trade-off
**Problem:** An A2C/PPO agent is configured with $N = 8$ environments, rollout steps $T = 128$, mini-batch size $B = 64$, and $K = 4$ epochs.
1. Compute the total number of transitions collected per iteration.
2. Compute the number of mini-batches per epoch.
3. Compute the total number of gradient updates performed per rollout iteration.

**Solution:**
1. Transitions per iteration:
$$\text{Total Transitions} = N \times T = 8 \times 128 = 1,024 \text{ transitions}$$

2. Mini-batches per epoch:
$$\text{Mini-batches per epoch} = \frac{1,024}{B} = \frac{1,024}{64} = 16 \text{ mini-batches}$$

3. Total gradient steps per iteration:
$$\text{Total Gradient Steps} = K \times 16 = 4 \times 16 = 64 \text{ gradient steps}$$
Every environment interaction step amortizes across 64 mini-batch updates, extracting $4\times$ greater sample efficiency than single-epoch A2C.

---

### Exercise 10.7: Fisher-Vector Product via Automatic Differentiation
**Problem:** In automatic differentiation frameworks, show how the Hessian-vector product $\mathbf{H} \mathbf{v} = \nabla_{\boldsymbol{\theta}}^2 f(\boldsymbol{\theta}) \mathbf{v}$ is computed using two successive gradient calls without storing the Hessian matrix.

**Solution:**
1. Let $f(\boldsymbol{\theta})$ be a scalar objective (e.g. $\bar{D}_{\text{KL}}$).
2. First call: Compute the gradient vector $\mathbf{g}(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta})$.
3. Take the scalar inner product with vector $\mathbf{v}$:
$$\phi(\boldsymbol{\theta}) = \mathbf{g}(\boldsymbol{\theta})^\top \mathbf{v} = \sum_{i=1}^d g_i(\boldsymbol{\theta}) v_i$$
4. Second call: Differentiate scalar $\phi(\boldsymbol{\theta})$ with respect to $\boldsymbol{\theta}$:
$$\nabla_{\boldsymbol{\theta}} \phi(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} \left( \nabla_{\boldsymbol{\theta}} f(\boldsymbol{\theta})^\top \mathbf{v} \right) = \nabla_{\boldsymbol{\theta}}^2 f(\boldsymbol{\theta}) \mathbf{v} = \mathbf{H} \mathbf{v}$$
Both operations execute in standard $\mathcal{O}(d)$ time and memory.

---

### Exercise 10.8: Entropy Collapse in PPO on Continuous Action Spaces
**Problem:** In continuous control with Gaussian policy $\pi = \mathcal{N}(\mu, \sigma^2)$, the differential entropy is $\mathcal{H} = \ln \sigma + \text{const}$.
If the policy learning rate is too high, $\sigma$ can shrink rapidly from $1.0$ to $10^{-5}$ in a few iterations.
1. Calculate the entropy change $\Delta \mathcal{H}$ when $\sigma$ drops from $1.0$ to $10^{-5}$.
2. Why is recovery from $\sigma = 10^{-5}$ virtually impossible without setting an artificial standard deviation floor?

**Solution:**
1. Entropy change:
$$\Delta \mathcal{H} = \ln(10^{-5}) - \ln(1.0) = -5 \ln(10) \approx -5(2.3026) = -11.51 \text{ nats}$$

2. Impossibility of recovery:
When $\sigma = 10^{-5}$, the action distribution is virtually a deterministic Dirac delta centered at $\mu$. The sampled actions $a = \mu + 10^{-5} z$ differ from $\mu$ by only 0.00001. The agent cannot explore any alternate actions. If the mean $\mu$ is suboptimal, all sampled actions yield identical returns, generating zero advantage differentiation and zero learning signal. PPO codebases universally enforce a minimum standard deviation floor (e.g. $\sigma \ge 0.10$).

---

### Exercise 10.9: PPO with Generalized Advantage Estimation Synergy
**Problem:** Why is GAE specifically suited for PPO?
Contrast PPO + GAE with DQN + $n$-step returns.

**Solution:**
PPO performs multiple epochs of SGD on a single collected batch of data.
- If Monte Carlo returns ($G_t$) were used, high variance would cause different mini-batches within the same epoch to have wildly contradictory gradients.
- If 1-step TD was used, high bias would cause the policy to overfit to local value errors.
- GAE ($\lambda = 0.95$) produces smooth, low-variance advantage estimates that remain valid across all $K$ training epochs of the rollout batch. Furthermore, GAE advantages can be normalized once across the entire $N \times T$ rollout, providing stationary, unit-variance targets for the clipped objective.

---

### Exercise 10.10: Complete TypeScript Unit Verification Suite for PPO Loss Engine
**Problem:** Write a TypeScript verification test that initializes `PPOLossEngine`, evaluates a synthetic mini-batch containing both normal and clipped transitions, and asserts that:
1. When ratio exceeds $1 + \epsilon$, the sample is clipped and ClipFrac increases.
2. Approximate KL divergence is non-negative and finite.
3. Total loss matches the analytical expectation.

**Solution:**
```typescript
import { PPOLossEngine, PPOMiniBatch } from './ppo-engine'; // Assuming implementation from Worked Example 10.10

export function testPPOVerification(): boolean {
  const engine = new PPOLossEngine(0.20, 0.20, 0.50, 0.01);

  // 1. Create synthetic mini-batch of 2 transitions
  // Transition 0: Unclipped, ratio = 1.10, A = +2.0
  // Transition 1: Clipped, ratio = 1.50, A = +2.0
  const batch: PPOMiniBatch = {
    logProbsOld: new Float64Array([Math.log(0.20), Math.log(0.20)]),
    valuesOld: new Float64Array([5.0, 5.0]),
    advantages: new Float64Array([2.0, 2.0]),
    returns: new Float64Array([6.0, 6.0])
  };

  const currentLogProbs = new Float64Array([Math.log(0.22), Math.log(0.30)]); // ratios: 1.10, 1.50
  const currentValues = new Float64Array([5.1, 5.1]);
  const currentEntropies = new Float64Array([0.8, 0.8]);

  const result = engine.evaluate(batch, currentLogProbs, currentValues, currentEntropies);
  console.log(`PPO Evaluation: Total Loss = ${result.totalLoss.toFixed(4)}, ClipFrac = ${result.clipFrac.toFixed(2)}, approxKL = ${result.approxKL.toExponential(4)}`);

  // Assertions:
  // 1 of 2 samples was clipped (ratio 1.50 > 1.20) -> ClipFrac = 0.50
  const clipFracCorrect = Math.abs(result.clipFrac - 0.50) < 1e-6;
  console.log(`Assertion 1 Passed: ClipFrac = 0.50 (${clipFracCorrect})`);

  // Approx KL must be strictly positive
  const klValid = result.approxKL > 0;
  console.log(`Assertion 2 Passed: approxKL > 0 (${klValid})`);

  // Unclipped surr1 = 1.10 * 2 = 2.20 -> pLoss0 = -2.20
  // Clipped surr2 = 1.20 * 2 = 2.40 -> pLoss1 = -2.40
  // Expected Policy Loss = (-2.20 + -2.40) / 2 = -2.30
  const policyLossCorrect = Math.abs(result.policyLoss - (-2.30)) < 1e-4;
  console.log(`Assertion 3 Passed: Policy Loss = ${result.policyLoss.toFixed(4)} (Expected -2.3000: ${policyLossCorrect})`);

  const passed = clipFracCorrect && klValid && policyLossCorrect;
  console.log(`PPO Unit Suite Passed: ${passed}`);
  return passed;
}

testPPOVerification();
```


# Chapter 11: Model-Based Deep RL: World Models, Dreamer, and MuZero

---

## 11.1 The Model-Free vs Model-Based Dichotomy

Across the preceding ten chapters, every algorithm we investigatedâ€”DQN, Double DQN, Dueling DQN, REINFORCE, A2C, TD3, TRPO, and PPOâ€”belonged to the **Model-Free Reinforcement Learning** paradigm.

In model-free RL, the agent treats the physical environment as an impenetrable black box. It observes raw states $s_t$, executes actions $a_t$, observes rewards $r_{t+1}$ and next states $s_{t+1}$, and maps these experiences directly into value functions $Q(s, a)$ or policies $\pi(a \mid s)$. The agent never attempts to build an explicit internal predictive simulation of how the universe behaves.

```
                      MODEL-FREE VS MODEL-BASED PARADIGMS
                      
   MODEL-FREE RL:
   State s â”€â”€â”€â”€â–º [ Neural Policy Ï€_Î¸(a|s) ] â”€â”€â”€â”€â–º Action a
   (Learns reflexive stimulus-response; requires millions of real environment interactions)
   
   MODEL-BASED RL:
   State s â”€â”€â”€â”€â–º [ Internal World Model ] â”€â”€â”€â”€â–º Latent Simulation / Mental Planning â”€â”€â”€â”€â–º Action a
                 â€¢ Representation: s_t = h(o_t)
                 â€¢ Dynamics: s_{t+1}, r_{t+1} = g(s_t, a_t)
                 â€¢ Prediction: p_t, v_t = f(s_t)
   (Learns causal laws of the universe; dreams millions of trajectories in imagination!)
```

### The Sample Inefficiency of Model-Free Systems
While model-free algorithms achieve superhuman performance once converged, their hunger for data is astronomical:
- **DQN on Atari:** Requires 50,000,000 frames (roughly 230 hours of continuous gameplay) to master simple games that human children learn in 15 minutes.
- **PPO on Robotic Dexterity:** OpenAI's Dactyl robotic hand required over 1,000 *years* of cumulative simulated experience to manipulate a Rubik's cube.

Humans do not learn to drive by crashing off bridges thousands of times to populate a model-free policy gradient. When a human contemplates an action, their brain executes a **counterfactual mental simulation**:
$$\text{"If I turn the steering wheel sharply at 80 MPH, the car will roll over."}$$
By simulating outcomes inside an internal **predictive mental model**, biological intelligence plans safely, anticipates long-term hazards, and learns with profound sample efficiency.

**Model-Based Reinforcement Learning (MBRL)** seeks to endow artificial intelligence with this exact capability: learning an internal model of the environment's dynamics, and leveraging that model to plan, imagine, and optimize policies entirely inside mental simulations.

---

## 11.2 World Models: Learning to Think in Dreams

Ha and Schmidhuber (2018) synthesized one of the most elegant conceptual demonstrations of model-based deep RL in their seminal paper, *World Models*.

They decomposed the cognitive architecture of an intelligent agent into three distinct, specialized components:
1. **Vision Model (V):** Compresses high-dimensional sensory frames into a compact latent space.
2. **Memory RNN (M):** Predicts the temporal dynamics of the latent space forward in time.
3. **Controller (C):** A lightweight policy that chooses actions based on sensory and memory states.

```
                         THE WORLD MODELS ARCHITECTURE
                         
                             High-Dimensional Visual Frame x_t (64x64x3)
                                               â”‚
                                               â–¼
                              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                              â”‚     VISION MODEL (V) - VAE      â”‚
                              â”‚     Encodes frame into latent   â”‚
                              â”‚     vector z_t âˆˆ R^32           â”‚
                              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                               â”‚ Latent Vector z_t
                                               â–¼
     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
     â”‚   CONTROLLER (C)       â”‚ â—„â”€â”€â”€â”€â”¤   MEMORY RNN (M)        â”‚
     â”‚   Action a_t = W [z, h]â”‚      â”‚   MDN-RNN Predictive    â”‚
     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â”‚   Dynamics P(z_{t+1}|Â·) â”‚
                 â”‚ Action a_t        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                 â”‚                             â”‚
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ (Feeds Action into RNN)
```

### 1. Vision Model (V): Variational Autoencoder (VAE)
At time step $t$, the agent receives a raw visual frame $\mathbf{x}_t \in \mathbb{R}^{64 \times 64 \times 3}$.
A convolutional Variational Autoencoder (VAE) compresses $\mathbf{x}_t$ into a low-dimensional Gaussian latent vector $\mathbf{z}_t \in \mathbb{R}^{32}$:
$$q_{\boldsymbol{\phi}}(\mathbf{z}_t \mid \mathbf{x}_t) = \mathcal{N}(\boldsymbol{\mu}_z(\mathbf{x}_t), \text{diag}(\boldsymbol{\sigma}_z^2(\mathbf{x}_t)))$$

The VAE is trained completely unsupervised by minimizing the Evidence Lower Bound (ELBO):
$$\mathcal{L}_{\text{VAE}}(\boldsymbol{\phi}, \boldsymbol{\psi}) = \mathbb{E}_{\mathbf{z} \sim q_{\boldsymbol{\phi}}} \left[ \|\mathbf{x}_t - \hat{\mathbf{x}}_t(\mathbf{z})\|_2^2 \right] + D_{\text{KL}}\left( q_{\boldsymbol{\phi}}(\mathbf{z} \mid \mathbf{x}_t) \parallel \mathcal{N}(\mathbf{0}, \mathbf{I}) \right)$$
The VAE strips away raw pixel redundancy, extracting a clean 32-dimensional spatial representation of the scene.

### 2. Memory Model (M): Mixture Density Recurrent Neural Network (MDN-RNN)
While the VAE handles spatial compression, the environment possesses temporal momentum and causal progression.
The Memory Model is a Recurrent Neural Network (LSTM) combined with a Mixture Density Network (MDN) that models the probability distribution of the *next* latent vector $\mathbf{z}_{t+1}$ conditioned on past history and current action $\mathbf{a}_t$:
$$P(\mathbf{z}_{t+1} \mid \mathbf{a}_t, \mathbf{z}_t, \mathbf{h}_t) = \sum_{k=1}^K \pi_k(\mathbf{h}_{t+1}) \mathcal{N}(\mathbf{z}_{t+1} \mid \boldsymbol{\mu}_k(\mathbf{h}_{t+1}), \boldsymbol{\Sigma}_k(\mathbf{h}_{t+1}))$$
where $\mathbf{h}_{t+1} = \text{LSTM}(\mathbf{z}_t, \mathbf{a}_t, \mathbf{h}_t)$.
The MDN-RNN outputs mixture weights $\pi_k$, means $\boldsymbol{\mu}_k$, and variances $\boldsymbol{\Sigma}_k$, explicitly capturing environmental stochasticity and multi-modal future possibilities.

### 3. Controller (C): Policy Optimization Inside Dreams
Because the combined (V + M) system represents a complete, self-contained simulator of the physical environment, **the physical environment is no longer required for training the agent!**

The Controller $\mathbf{a}_t = \mathbf{W}_c [\mathbf{z}_t; \mathbf{h}_t] + \mathbf{b}_c$ is a compact linear model consisting of only $\approx 1,000$ parameters.
The Controller is placed inside a **hallucinated dream**:
1. Sample initial latent state $\mathbf{z}_0 \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$.
2. The Controller selects action $\mathbf{a}_t = C(\mathbf{z}_t, \mathbf{h}_t)$.
3. The MDN-RNN dreams the next latent state $\mathbf{z}_{t+1} \sim P(\cdot \mid \mathbf{a}_t, \mathbf{z}_t, \mathbf{h}_t)$ and predicts reward/termination.
4. The process repeats for thousands of imagined steps.

Ha & Schmidhuber optimized the Controller weights entirely inside this dream simulation using Covariance Matrix Adaptation Evolution Strategy (CMA-ES). When the trained controller was deployed back into the *real physical CarRacing-v0 environment*, it drove flawlessly on physical tracks it had never seen, achieving superhuman driving performance purely from imagined dreams.

---

## 11.3 The Pathology of Pixel Reconstruction

While the VAE + MDN-RNN architecture is a conceptual triumph, it suffers from a fundamental structural flaw: **it is forced to reconstruct raw pixels**.

Consider an autonomous vehicle driving down a highway on an overcast day:
- The exact shape of clouds in the sky, the vibration of leaves on roadside trees, and the static noise of asphalt texture consume $99\%$ of the pixel entropy in an image.
- However, for the physical task of driving without crashing, **clouds and leaves are completely irrelevant**.

When a world model is trained to minimize pixel reconstruction error $\|\mathbf{x} - \hat{\mathbf{x}}\|^2$, the neural network allocates virtually all of its representational capacity to modeling background texture and visual noise. If an unexpected cloud pattern appears, the pixel-predictive model experiences a massive prediction error, even though the car is in zero physical danger.

Conversely, a tiny, dark patch of ice on the road consumes only 10 pixels in a $1000 \times 1000$ image ($0.001\%$ of the loss). A pixel-reconstructing VAE will happily smooth out the ice patch to minimize global reconstruction error, causing the simulated vehicle to ignore a lethal hazard!

```
                    THE PIXEL RECONSTRUCTION TRAP
                    
   High-Entropy Irrelevant Details:      Low-Entropy Critical Task Details:
   â€¢ Clouds drifting in the sky          â€¢ 3-pixel traffic light turning red
   â€¢ Shadows of roadside leaves          â€¢ 10-pixel patch of black ice
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€         â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Consumes 99% of VAE Capacity!         Ignored by Pixel Loss (< 0.01%)!
```

**The Core Realization:**
An intelligent agent does not need to predict what the universe *looks like*.
An intelligent agent needs to predict only what matters for decision-making: **values, policies, and rewards**.

---

## 11.4 MuZero: Value-Equivalent Latent Dynamics

Schrittwieser et al. (DeepMind, 2020) resolved the pixel reconstruction trap by introducing **MuZero**.

MuZero is arguably the most powerful reinforcement learning algorithm ever created. Without being given the rules of the game, physical dynamics, or pixel reconstruction objectives, MuZero mastered Go, Chess, Shogi, and all 57 Atari games, matching or exceeding AlphaZero and Rainbow DQN.

Instead of predicting future observations $\hat{\mathbf{x}}_{t+1}$, MuZero operates entirely in an **abstract, latent state space** trained via **Value Equivalence**.

```
                           THE MUZERO LATENT PIPELINE
                           
   1. REPRESENTATION FUNCTION h_Î¸:
      Maps observation history to initial latent state:
           s^0 = h_Î¸(o_1, o_2, ..., o_t)
           
   2. DYNAMICS FUNCTION g_Î¸:
      Rolls latent state forward conditioned on action:
           r^k, s^k = g_Î¸(s^{k-1}, a^k)
           (Predicts reward r^k and abstract next state s^k)
           
   3. PREDICTION FUNCTION f_Î¸:
      Evaluates latent state for policy and value:
           p^k, v^k = f_Î¸(s^k)
           (Predicts policy distribution p^k and scalar value v^k)
```

### The Three MuZero Functions
MuZero parameterizes three deep neural networks:

1. **The Representation Function ($h_{\boldsymbol{\theta}}$):**
$$s^0 = h_{\boldsymbol{\theta}}(o_1, o_2, \dots, o_t)$$
Maps the past history of raw observations into an abstract initial hidden state $s^0 \in \mathbb{R}^d$. Notice that $s^0$ has no direct reconstruction loss; it is free to represent whatever features are useful for winning.

2. **The Dynamics Function ($g_{\boldsymbol{\theta}}$):**
$$r^k, s^k = g_{\boldsymbol{\theta}}(s^{k-1}, a^k)$$
Acts as a recurrent latent transition model. Conditioned on the previous abstract state $s^{k-1}$ and candidate action $a^k$, it predicts:
- The immediate reward $r^k \in \mathbb{R}$.
- The next abstract hidden state $s^k \in \mathbb{R}^d$.

3. **The Prediction Function ($f_{\boldsymbol{\theta}}$):**
$$\mathbf{p}^k, v^k = f_{\boldsymbol{\theta}}(s^k)$$
Evaluates any abstract hidden state $s^k$ (whether generated directly by $h_{\boldsymbol{\theta}}$ or rolled out through $g_{\boldsymbol{\theta}}$), outputting:
- Policy logits $\mathbf{p}^k \in \mathbb{R}^{|\mathcal{A}|}$ (a distribution over actions).
- Scalar state-value $v^k \in \mathbb{R}$ (the expected discounted return).

### Latent Monte Carlo Tree Search (MCTS)
When interacting with the environment, MuZero does **not** rely purely on the policy network $\mathbf{p}$. It uses the learned dynamics function $g_{\boldsymbol{\theta}}$ to execute a **Monte Carlo Tree Search (MCTS)** entirely inside its abstract hidden space!

```
                         MUZERO LATENT TREE SEARCH
                         
                                  ( s^0 )  â—„â”€â”€ Initial State from h_Î¸(o_t)
                                 /       \
                             a_1/         \a_2
                               /           \
                           ( s^1 )       ( s^1 )   â—„â”€â”€ Generated by g_Î¸(s^0, a)
                          r_1, p, v     r_2, p, v  â—„â”€â”€ Evaluated by f_Î¸(s^1)
                          /       \
                      a_1/         \a_2
                        â–¼           â–¼
                      (s^2)       (s^2)
```

During the search:
- The tree branches purely through calls to $g_{\boldsymbol{\theta}}(s, a)$ and $f_{\boldsymbol{\theta}}(s)$.
- Nodes are selected using the Upper Confidence Bound for Trees (PUCT) algorithm:
$$a^* = \arg\max_a \left[ Q(s, a) + P(s, a) \frac{\sqrt{\sum_b N(s, b)}}{1 + N(s, a)} \left( c_1 + \log\left(\frac{\sum_b N(s, b) + c_2 + 1}{c_2}\right) \right) \right]$$
- After $N_{\text{simulations}}$ (e.g. 800 simulations in Go, or 50 in Atari), the search produces an improved search policy $\boldsymbol{\pi}_t \propto N(s^0, a)^{1/T}$ based on visit counts.
- The action $a_t \sim \boldsymbol{\pi}_t$ is executed in the real environment.

### The Value-Equivalent Loss Function
All three networks ($h_{\boldsymbol{\theta}}, g_{\boldsymbol{\theta}}, f_{\boldsymbol{\theta}}$) are trained end-to-end using standard backpropagation through time over an unrolled sequence of $K$ hypothetical steps:
$$\mathcal{L}_t(\boldsymbol{\theta}) = \sum_{k=0}^K \left[ \ell_r(u_{t+k}, r_t^k) + \ell_v(z_{t+k}, v_t^k) + \ell_p(\pi_{t+k}, \mathbf{p}_t^k) \right] + c \|\boldsymbol{\theta}\|_2^2$$
where:
- $\ell_r$ is cross-entropy loss between true observed reward $u$ and predicted reward $r^k$.
- $\ell_v$ is cross-entropy loss between true target return $z$ and predicted value $v^k$.
- $\ell_p$ is cross-entropy loss between MCTS visit count distribution $\pi$ and predicted policy $\mathbf{p}^k$.

MuZero never reconstructs a single pixel. It learns an internal representation that models **only the causal physics necessary to accurately predict value, policy, and reward**.

---

## 11.5 Dreamer: Recurrent State-Space Models (RSSM)

In continuous physical environments and robotics, Hafner et al. (2020â€“2023) developed the **Dreamer** family of model-based algorithms (DreamerV1, DreamerV2, DreamerV3).

Dreamer builds world models using the **Recurrent State-Space Model (RSSM)**, which splits the latent state into a deterministic recurrent path and a stochastic state path:
$$s_t = (h_t, z_t)$$
- Deterministic path: $h_t = \text{GRU}(h_{t-1}, z_{t-1}, a_{t-1})$.
- Stochastic path: $z_t \sim p(z_t \mid h_t)$.

```
                           THE DREAMER RSSM ARCHITECTURE
                           
       Deterministic GRU:    h_{t-1} â”€â”€â”€â”€â”€â”€a_{t-1}â”€â”€â”€â”€â”€â”€â–º h_t â”€â”€â”€â”€â”€â”€a_tâ”€â”€â”€â”€â”€â”€â–º h_{t+1}
                                â”‚                          â”‚                    â”‚
                                â–¼                          â–¼                    â–¼
       Stochastic Latent:    z_{t-1}                     z_t                  z_{t+1}
                                â”‚                          â”‚                    â”‚
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                             â”‚
                                             â–¼ Decoder Heads
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                â”‚ Reward Head: r_t ~ p(r) â”‚
                                â”‚ Contin. Head: c_t ~ p(c)â”‚
                                â”‚ Actor Head: a_t ~ Ï€(a)  â”‚
                                â”‚ Critic Head: v_t ~ V(s) â”‚
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Actor-Critic Learning in Imagination
Once the RSSM world model is trained, Dreamer optimizes an Actor $\pi_{\boldsymbol{\theta}}(a \mid s)$ and a Critic $V_{\boldsymbol{\phi}}(s)$ entirely through **analytic gradient propagation along imagined trajectories**:
1. Start at true state $s_0 = (h_0, z_0)$.
2. Unroll the latent model forward in imagination for horizon $H = 15$ steps:
$$a_\tau \sim \pi_{\boldsymbol{\theta}}(s_\tau), \quad s_{\tau+1} \sim \text{RSSM}(s_\tau, a_\tau)$$
3. Compute GAE-$\lambda$ returns along the imagined branch:
$$V_H^\lambda(s_\tau) = r_{\tau+1} + \gamma \left( (1 - \lambda) V_{\boldsymbol{\phi}}(s_{\tau+1}) + \lambda V_H^\lambda(s_{\tau+1}) \right)$$
4. Update Actor weights by directly backpropagating the gradient $\nabla_{\boldsymbol{\theta}} V_H^\lambda$ through the differentiable world model dynamics!

DreamerV3 (2023) introduced symlog predictions and percentile normalization, becoming the first general reinforcement learning algorithm to master Minecraft from scratch (collecting diamonds without human demonstrations) and solving continuous MuJoCo robotics with fixed hyperparameters.

---

## 11.6 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 11.1: Variational Autoencoder Reparameterization Math
**Problem:** In the Vision Model (V), an encoder network outputs Gaussian parameters for an image $x$:
$$\mu = [0.5, -1.2]^\top, \quad \log \sigma^2 = [-0.4, 0.2]^\top$$
1. Compute the standard deviation vector $\boldsymbol{\sigma} = \exp(0.5 \log \sigma^2)$.
2. Given standard normal noise $\boldsymbol{\epsilon} = [0.8, -0.5]^\top$, compute the sampled latent vector $\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\epsilon}$.
3. Compute the KL divergence $D_{\text{KL}}(\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma}) \parallel \mathcal{N}(\mathbf{0}, \mathbf{I}))$.

**Solution:**
1. Standard deviations:
- $\sigma_1 = \exp(0.5 \times (-0.4)) = \exp(-0.2) \approx 0.8187$
- $\sigma_2 = \exp(0.5 \times 0.2) = \exp(0.1) \approx 1.1052$
$$\boldsymbol{\sigma} = [0.8187, 1.1052]^\top$$

2. Reparameterized latent sample:
$$\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\epsilon} = \begin{bmatrix} 0.5 \\ -1.2 \end{bmatrix} + \begin{bmatrix} 0.8187 \times 0.8 \\ 1.1052 \times (-0.5) \end{bmatrix} = \begin{bmatrix} 0.5 + 0.6550 \\ -1.2 - 0.5526 \end{bmatrix} = \begin{bmatrix} 1.1550 \\ -1.7526 \end{bmatrix}$$

3. Analytical KL divergence:
$$D_{\text{KL}} = -\frac{1}{2} \sum_{i=1}^d \left( 1 + \log(\sigma_i^2) - \mu_i^2 - \sigma_i^2 \right)$$
- Dimension 1: $1 + (-0.4) - 0.5^2 - 0.8187^2 = 1 - 0.4 - 0.25 - 0.6703 = -0.3203$.
- Dimension 2: $1 + 0.2 - (-1.2)^2 - 1.1052^2 = 1 + 0.2 - 1.44 - 1.2215 = -1.4615$.
Sum $= -0.3203 - 1.4615 = -1.7818$.
$$D_{\text{KL}} = -\frac{1}{2}(-1.7818) = 0.8909 \text{ nats}$$

---

### Worked Example 11.2: Mixture Density Network Sampling Mechanics
**Problem:** In the Memory Model (M), an MDN predicts next latent scalar $z_{t+1}$ using a 2-component Gaussian mixture:
- Component 1: $\pi_1 = 0.70, \mu_1 = 2.0, \sigma_1 = 0.5$.
- Component 2: $\pi_2 = 0.30, \mu_2 = -4.0, \sigma_2 = 1.0$.
Suppose pseudo-random numbers drawn are $u_1 = 0.45$ (for component selection) and $u_2 = 0.50, u_3 = 0.25$ (Box-Muller standard normal draw yielding $z = +0.80$).
1. Which mixture component is selected by $u_1$?
2. Generate the simulated sample $z_{t+1}$.
3. What is the expected value $\mathbb{E}[z_{t+1}]$?

**Solution:**
1. Component selection:
Cumulative probabilities: $[0.70, 1.00]$.
Since $u_1 = 0.45 \le 0.70$, **Component 1** is selected.

2. Sample generation:
Using Component 1 parameters ($\mu_1 = 2.0, \sigma_1 = 0.5$):
$$z_{t+1} = \mu_1 + \sigma_1 \cdot z = 2.0 + 0.5 \times (0.80) = 2.0 + 0.40 = 2.40$$

3. Expected value:
$$\mathbb{E}[z_{t+1}] = \sum_{k=1}^2 \pi_k \mu_k = 0.70(2.0) + 0.30(-4.0) = 1.40 - 1.20 = +0.20$$

---

### Worked Example 11.3: MuZero Unrolled Latent Forward Pass
**Problem:** In MuZero, an agent observes history $o_{1:t}$.
1. Initial representation: $s^0 = h_\theta(o_{1:t}) = [1.0, 0.0]^\top$.
2. Candidate action 1 is selected: $a^1 = 1$.
   Dynamics function $g_\theta$ predicts:
   $$r^1 = 1.5, \quad s^1 = \tanh(\mathbf{W}_g [s^0; a^1]) \quad \text{where } \mathbf{W}_g = \begin{bmatrix} 0.5 & 0.2 & 0.4 \\ -0.3 & 0.1 & -0.5 \end{bmatrix}$$
3. Prediction function $f_\theta$ evaluates $s^1$:
   Value head: $v^1 = \mathbf{w}_v^\top s^1$ where $\mathbf{w}_v = [2.0, -1.0]^\top$.
Compute $s^1$ and $v^1$.

**Solution:**
1. Input vector to dynamics function:
$$[s^0; a^1] = [1.0, 0.0, 1.0]^\top$$

2. Matrix multiplication:
$$\mathbf{W}_g [s^0; a^1] = \begin{bmatrix} 0.5(1.0) + 0.2(0.0) + 0.4(1.0) \\ -0.3(1.0) + 0.1(0.0) - 0.5(1.0) \end{bmatrix} = \begin{bmatrix} 0.5 + 0.4 \\ -0.3 - 0.5 \end{bmatrix} = \begin{bmatrix} 0.9 \\ -0.8 \end{bmatrix}$$
Applying tanh non-linearity:
$$s^1 = \begin{bmatrix} \tanh(0.9) \\ \tanh(-0.8) \end{bmatrix} \approx \begin{bmatrix} 0.7163 \\ -0.6640 \end{bmatrix}$$

3. Value prediction:
$$v^1 = \mathbf{w}_v^\top s^1 = 2.0(0.7163) + (-1.0)(-0.6640) = 1.4326 + 0.6640 = 2.0966$$
The agent has predicted reward $r^1 = 1.5$, next latent state $s^1$, and future value $v^1 = 2.0966$ entirely in abstract latent space!

---

### Worked Example 11.4: PUCT Action Selection in MuZero MCTS
**Problem:** A parent node $s$ in the MuZero search tree has two action branches: $a_1$ and $a_2$.
Current search tree statistics:
- Total parent visit count: $N(s) = 100$.
- Branch 1: $N(s, a_1) = 60, Q(s, a_1) = 0.75, P(s, a_1) = 0.40$.
- Branch 2: $N(s, a_2) = 40, Q(s, a_2) = 0.60, P(s, a_2) = 0.60$.
Exploration constant $c_{\text{puct}} = 1.5$.
1. Compute the exploration bonus $U(s, a) = c_{\text{puct}} P(s, a) \frac{\sqrt{N(s)}}{1 + N(s, a)}$ for both branches.
2. Compute the total PUCT score $Q(s, a) + U(s, a)$ for both branches.
3. Which action is selected for the next tree expansion?

**Solution:**
1. Exploration bonuses ($\sqrt{N(s)} = \sqrt{100} = 10.0$):
- Branch 1:
  $$U(s, a_1) = 1.5 \times 0.40 \times \frac{10.0}{1 + 60} = 0.60 \times \frac{10.0}{61} = \frac{6.0}{61} \approx 0.0984$$
- Branch 2:
  $$U(s, a_2) = 1.5 \times 0.60 \times \frac{10.0}{1 + 40} = 0.90 \times \frac{10.0}{41} = \frac{9.0}{41} \approx 0.2195$$

2. Total PUCT scores:
- Score($a_1$) $= Q(s, a_1) + U(s, a_1) = 0.75 + 0.0984 = 0.8484$.
- Score($a_2$) $= Q(s, a_2) + U(s, a_2) = 0.60 + 0.2195 = 0.8195$.

3. Selection:
Since $0.8484 > 0.8195$, **Action $a_1$** is selected.
Although Branch 2 had higher prior probability ($0.60$ vs $0.40$), Branch 1's superior empirical value ($0.75$ vs $0.60$) outweighed the bonus, demonstrating the balanced exploration-exploitation dynamics of PUCT.

---

### Worked Example 11.5: Cross-Entropy Loss for Categorical Two-Hot Support
**Problem:** In MuZero and DreamerV3, scalar targets $y \in \mathbb{R}$ are represented as categorical distributions over discrete support atoms $\mathbf{b} \in \mathbb{R}^{21}$ spanning $[-10, 10]$ with step $1.0$.
Suppose a target return is $y = 3.4$.
1. Find the two adjacent support atoms $b_k$ and $b_{k+1}$ enclosing $y$.
2. Compute the two-hot target probabilities $p_k$ and $p_{k+1}$.
3. Verify that $\mathbb{E}[\mathbf{p}] = y$.

**Solution:**
1. Enclosing atoms:
Support step size $\Delta = 1.0$.
$$b_k = \lfloor 3.4 \rfloor = 3.0, \quad b_{k+1} = \lceil 3.4 \rceil = 4.0$$

2. Two-hot probabilities:
Weight on upper atom:
$$p_{k+1} = \frac{y - b_k}{b_{k+1} - b_k} = \frac{3.4 - 3.0}{4.0 - 3.0} = \frac{0.4}{1.0} = 0.40$$
Weight on lower atom:
$$p_k = 1 - p_{k+1} = 1 - 0.40 = 0.60$$
All other 19 atoms have probability $0$.

3. Verification of expectation:
$$\mathbb{E}[\mathbf{p}] = \sum_i p_i b_i = 0.60(3.0) + 0.40(4.0) = 1.80 + 1.60 = 3.40 = y$$
Categorical two-hot representation bounds loss gradients without requiring hard scalar clipping.

---

### Worked Example 11.6: Dreamer Latent Imagination GAE Horizon Unroll
**Problem:** In Dreamer, an agent unrolls an imagined rollout of $H = 3$ steps from initial latent state $s_0$:
- Predicted rewards: $r_1 = 1.0, r_2 = 2.0, r_3 = 0.5$.
- Predicted values: $v_0 = 3.0, v_1 = 3.5, v_2 = 4.0, v_3 = 2.0$.
Discount $\gamma = 0.90, \lambda = 0.80$.
Compute the imagined GAE targets $V_H^\lambda$ backward from $t = 2$ down to $0$.

**Solution:**
Terminal condition at horizon: $V_H^\lambda(s_3) = v_3 = 2.0$.
GAE recurrence:
$$V_H^\lambda(s_t) = r_{t+1} + \gamma \left( (1 - \lambda) v_{t+1} + \lambda V_H^\lambda(s_{t+1}) \right)$$
- Step $t = 2$:
  $$V_H^\lambda(s_2) = r_3 + \gamma \left( (1 - 0.8) v_3 + 0.8 V_H^\lambda(s_3) \right) = 0.5 + 0.90 \left( 0.2(2.0) + 0.8(2.0) \right) = 0.5 + 0.90(2.0) = 0.5 + 1.8 = 2.30$$
- Step $t = 1$:
  $$V_H^\lambda(s_1) = r_2 + \gamma \left( 0.2 v_2 + 0.8 V_H^\lambda(s_2) \right) = 2.0 + 0.90 \left( 0.2(4.0) + 0.8(2.30) \right) = 2.0 + 0.90(0.80 + 1.84) = 2.0 + 0.90(2.64) = 2.0 + 2.376 = 4.376$$
- Step $t = 0$:
  $$V_H^\lambda(s_0) = r_1 + \gamma \left( 0.2 v_1 + 0.8 V_H^\lambda(s_1) \right) = 1.0 + 0.90 \left( 0.2(3.5) + 0.8(4.376) \right) = 1.0 + 0.90(0.70 + 3.5008) = 1.0 + 0.90(4.2008) = 1.0 + 3.7807 = 4.7807$$
Imagined returns provide dense, low-variance targets along the entire mental branch.

---

### Worked Example 11.7: Symlog Non-Linear Scaling in DreamerV3
**Problem:** DreamerV3 applies the **symlog** transform to inputs, targets, and losses to achieve scale-invariance across arbitrary reward scales:
$$\text{symlog}(x) = \text{sign}(x) \ln(|x| + 1)$$
1. Compute $\text{symlog}(x)$ for $x = 0, x = 10.0, x = -1000.0$.
2. Derive the inverse transform $\text{symexp}(y)$.
3. Verify that $\text{symexp}(\text{symlog}(10.0)) = 10.0$.

**Solution:**
1. Forward evaluations:
- For $x = 0$: $\text{symlog}(0) = 0 \times \ln(0 + 1) = 0$.
- For $x = 10.0$: $\text{symlog}(10.0) = +1 \times \ln(10.0 + 1) = \ln(11.0) \approx 2.3979$.
- For $x = -1000.0$: $\text{symlog}(-1000.0) = -1 \times \ln(1000.0 + 1) = -\ln(1001.0) \approx -6.9088$.
Notice that an input of $-1000$ is smoothly compressed into $-6.91$!

2. Inverse transform derivation:
Let $y = \text{sign}(x) \ln(|x| + 1)$.
Then $\text{sign}(y) = \text{sign}(x)$, and $|y| = \ln(|x| + 1)$.
$$e^{|y|} = |x| + 1 \implies |x| = e^{|y|} - 1$$
Multiplying by the sign:
$$\text{symexp}(y) = \text{sign}(y) \left( \exp(|y|) - 1 \right)$$

3. Verification:
$$\text{symexp}(2.3979) = +1 \times (\exp(2.3979) - 1) = 11.000 - 1 = 10.000$$
Symlog compresses multi-scale rewards into a compact numerical range while preserving zero-centered antisymmetry.

---

### Worked Example 11.8: MuZero Min-Max Q Normalization Math
**Problem:** In MuZero MCTS, Q-values across the tree can span arbitrary scales. To combine $Q$ and $P$ in the PUCT formula, Q-values are normalized to $[0, 1]$ using tracked tree extremes $Q_{\min}$ and $Q_{\max}$:
$$\bar{Q}(s, a) = \frac{Q(s, a) - Q_{\min}}{Q_{\max} - Q_{\min}}$$
Suppose during search, the minimum observed Q-value is $Q_{\min} = -5.0$ and the maximum is $Q_{\max} = 15.0$.
1. Normalize $Q_1 = 10.0$ and $Q_2 = -1.0$.
2. What happens if a newly expanded node produces an out-of-bounds value $Q_3 = 20.0$?

**Solution:**
1. Normalization:
Range $\Delta = Q_{\max} - Q_{\min} = 15.0 - (-5.0) = 20.0$.
- For $Q_1 = 10.0$:
  $$\bar{Q}_1 = \frac{10.0 - (-5.0)}{20.0} = \frac{15.0}{20.0} = 0.75$$
- For $Q_2 = -1.0$:
  $$\bar{Q}_2 = \frac{-1.0 - (-5.0)}{20.0} = \frac{4.0}{20.0} = 0.20$$

2. Out-of-bounds update:
When $Q_3 = 20.0 > Q_{\max}$, the tree extremes update dynamically:
$$Q_{\max} \leftarrow \max(15.0, 20.0) = 20.0$$
New range: $20.0 - (-5.0) = 25.0$.
All future normalizations in the search immediately use the new range, preventing saturation while guaranteeing $\bar{Q} \in [0, 1]$.

---

### Worked Example 11.9: Complete TypeScript Implementation of MuZero Abstract Search Tree
**Problem:** Author a TypeScript class `MuZeroNode` that represents a latent node in the MuZero MCTS tree, tracks visit counts, prior probabilities, latent rewards, and implements the PUCT selection algorithm.

**Solution:**
```typescript
export class MuZeroNode {
  public visitCount: number = 0;
  public valueSum: number = 0;
  public prior: number;
  public latentReward: number = 0;
  public children: Map<number, MuZeroNode> = new Map();
  public hiddenState: number[];

  constructor(prior: number, hiddenState: number[], latentReward: number = 0) {
    this.prior = prior;
    this.hiddenState = hiddenState;
    this.latentReward = latentReward;
  }

  get value(): number {
    return this.visitCount === 0 ? 0 : this.valueSum / this.visitCount;
  }

  // PUCT Child Selection
  selectChild(c1: number = 1.25, c2: number = 19652, qMin: number = 0, qMax: number = 1): { action: number; child: MuZeroNode } {
    let bestAction = -1;
    let bestScore = -Infinity;

    const totalVisits = this.visitCount;
    const qRange = qMax - qMin > 1e-8 ? qMax - qMin : 1.0;

    for (const [action, child] of this.children.entries()) {
      // 1. Normalized Q value
      const normQ = child.visitCount > 0 ? (child.value - qMin) / qRange : 0;

      // 2. PUCT exploration bonus
      const pbC = Math.log((totalVisits + c2 + 1) / c2) + c1;
      const u = pbC * child.prior * (Math.sqrt(totalVisits) / (1 + child.visitCount));

      const score = normQ + u;
      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
      }
    }

    return { action: bestAction, child: this.children.get(bestAction)! };
  }
}
```

---

### Worked Example 11.10: Complete TypeScript Implementation of Latent Monte Carlo Tree Search
**Problem:** Author a TypeScript function `runLatentMCTS` that takes a root node, executes $N_{\text{simulations}}$ using a mock dynamics function $g(s, a)$ and prediction function $f(s)$, backpropagates values, and returns the final visit count policy distribution.

**Solution:**
```typescript
import { MuZeroNode } from './muzero-node'; // Assuming MuZeroNode from Worked Example 11.9

export interface ModelOutputs {
  latentReward: number;
  nextHiddenState: number[];
  policyProbs: number[];
  value: number;
}

export function runLatentMCTS(
  root: MuZeroNode,
  numSimulations: number,
  numActions: number,
  dynamicsPredict: (state: number[], action: number) => { reward: number; nextState: number[] },
  predictionPredict: (state: number[]) => { policyProbs: number[]; value: number },
  discount: number = 0.99
): Float64Array {
  // Expand root if needed
  if (root.children.size === 0) {
    const { policyProbs } = predictionPredict(root.hiddenState);
    for (let a = 0; a < numActions; a++) {
      root.children.set(a, new MuZeroNode(policyProbs[a], []));
    }
  }

  for (let sim = 0; sim < numSimulations; sim++) {
    let node = root;
    const searchPath: { action: number; parent: MuZeroNode }[] = [];

    // 1. Select
    while (node.children.size > 0 && node.children.get(0)!.hiddenState.length > 0) {
      const { action, child } = node.selectChild();
      searchPath.push({ action, parent: node });
      node = child;
    }

    // 2. Expand & Evaluate using Dynamics & Prediction Functions
    const lastStep = searchPath[searchPath.length - 1];
    const { reward, nextState } = dynamicsPredict(lastStep.parent.hiddenState, lastStep.action);
    node.hiddenState = nextState;
    node.latentReward = reward;

    const { policyProbs, value } = predictionPredict(nextState);
    for (let a = 0; a < numActions; a++) {
      node.children.set(a, new MuZeroNode(policyProbs[a], []));
    }

    // 3. Backpropagate
    let runningValue = value;
    node.visitCount++;
    node.valueSum += runningValue;

    for (let i = searchPath.length - 1; i >= 0; i--) {
      const step = searchPath[i];
      runningValue = step.parent.children.get(step.action)!.latentReward + discount * runningValue;
      step.parent.visitCount++;
      step.parent.valueSum += runningValue;
    }
  }

  // Construct final search policy from root visit counts
  const pi = new Float64Array(numActions);
  const totalRootVisits = root.visitCount - 1;
  for (let a = 0; a < numActions; a++) {
    const child = root.children.get(a);
    pi[a] = child ? child.visitCount / totalRootVisits : 0;
  }
  return pi;
}
```

---

## 11.7 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 11.1: Information Bottleneck in Latent World Models
**Problem:** Let $X$ be the raw visual observation, $Z$ be the latent state representation, and $Y = (R, V, \Pi)$ be the decision-relevant targets.
The Information Bottleneck objective (Tishby et al., 2000) is:
$$\min_{p(z \mid x)} \quad I(X; Z) - \beta I(Z; Y)$$
1. Explain how pixel-reconstructing world models (such as VAEs) attempt to maximize $I(X; Z)$.
2. Explain how MuZero directly optimizes the Information Bottleneck with minimal $I(X; Z)$ and maximal $I(Z; Y)$.

**Solution:**
1. Pixel Reconstruction:
In standard VAEs, the decoder attempts to reconstruct $X$ from $Z$. To achieve low reconstruction loss, mutual information $I(X; Z)$ must be maximizedâ€”forcing $Z$ to capture all visual details (background colors, cloud textures, irrelevant lighting shifts).
2. MuZero:
MuZero has zero reconstruction loss for $X$. Its representation function $h_\theta(X) = Z$ is trained strictly to predict $Y$ (future rewards, values, and policies). It compresses $Z$ to retain *only* the minimal sufficient information needed to predict $Y$, minimizing $I(X; Z)$ while maximizing $I(Z; Y)$. It automatically discards all task-irrelevant visual noise.

---

### Exercise 11.2: Compound Error Accumulation in Autoregressive World Models
**Problem:** Let an autoregressive world model have 1-step prediction error $\epsilon$:
$$\|s_{t+1} - \hat{s}_{t+1}\| \le \epsilon$$
Assume the dynamics are Lipschitz continuous with constant $L > 1$:
$$\|g(s) - g(s')\| \le L \|s - s'\|$$
1. Prove by induction that after rolling out the model for $H$ hypothetical steps, the compound error bound satisfies:
$$\|s_H - \hat{s}_H\| \le \epsilon \frac{L^H - 1}{L - 1}$$
2. For $L = 1.10$ and $\epsilon = 0.05$, compute the error bound at $H = 5, 20, 50$.
3. What does this exponential divergence imply about the viability of long-horizon imagination without value grounding?

**Solution:**
1. Proof by induction:
- For $H = 1$: $\|s_1 - \hat{s}_1\| \le \epsilon = \epsilon \frac{L^1 - 1}{L - 1}$.
- Assume true for $H = k$: $\|s_k - \hat{s}_k\| \le E_k$.
- For $H = k+1$:
  $$\|s_{k+1} - \hat{s}_{k+1}\| = \|g(s_k) - \hat{g}(\hat{s}_k)\| \le \|g(s_k) - g(\hat{s}_k)\| + \|g(\hat{s}_k) - \hat{g}(\hat{s}_k)\| \le L \|s_k - \hat{s}_k\| + \epsilon$$
  $$E_{k+1} \le L \left(\epsilon \frac{L^k - 1}{L - 1}\right) + \epsilon = \epsilon \left( \frac{L^{k+1} - L + L - 1}{L - 1} \right) = \epsilon \frac{L^{k+1} - 1}{L - 1} \quad \blacksquare$$

2. Numerical evaluations ($L = 1.10, \epsilon = 0.05$):
- At $H = 5$: $E_5 = 0.05 \frac{1.10^5 - 1}{0.10} = 0.5(1.6105 - 1) = 0.5(0.6105) \approx 0.305$.
- At $H = 20$: $E_{20} = 0.5(1.10^{20} - 1) = 0.5(6.7275 - 1) = 0.5(5.7275) \approx 2.86$.
- At $H = 50$: $E_{50} = 0.5(1.10^{50} - 1) = 0.5(117.39 - 1) \approx 58.2$.

3. Implication:
Because compounding error grows exponentially ($\mathcal{O}(L^H)$), purely ungrounded latent imagination rapidly descends into hallucination. A world model cannot plan over infinite horizons purely by physics simulation; it must terminate imagination at a modest horizon $H$ (e.g. 5â€“15 steps) and bootstrap with a learned value function $v(s_H)$.

---

### Exercise 11.3: Recurrent State-Space Model KL Balancing
**Problem:** In DreamerV2/V3, the RSSM loss balances the Prior $p(z_t \mid h_t)$ and Posterior $q(z_t \mid h_t, x_t)$ using **KL Balancing**:
$$\mathcal{L}_{\text{KL}} = \alpha D_{\text{KL}}\left( \text{sg}(q) \parallel p \right) + (1 - \alpha) D_{\text{KL}}\left( q \parallel \text{sg}(p) \right)$$
where $\text{sg}(\cdot)$ is the stop-gradient operator, and $\alpha = 0.80$.
Why does weighting the prior update ($\alpha = 0.80$) higher than the posterior update ($1 - \alpha = 0.20$) prevent the prior from lagging behind the posterior?

**Solution:**
In an RSSM, the posterior $q(z \mid h, x)$ has access to the real image $x$, while the prior $p(z \mid h)$ must predict $z$ purely from history without seeing $x$.
- If standard symmetric KL loss ($\alpha = 0.50$) is used, the posterior changes rapidly to accommodate new observations, while the prior lags behind.
- Setting $\alpha = 0.80$ trains the prior **four times faster** toward the posterior than it pulls the posterior toward the prior.
- This forces the predictive dynamics model ($p$) to aggressively catch up with real observations without diluting the informational capacity of the posterior representations ($q$).

---

### Exercise 11.4: Latent Consistency Models vs Dynamics Models
**Problem:** In TD-MPC (Temporal Difference Model Predictive Control; Hansen et al., 2022), the dynamics model predicts latent states without predicting images or actions.
Explain how TD-MPC combines local trajectory optimization (Model Predictive Path Integral - MPPI) with terminal Q-value functions to achieve sample-efficient continuous control.

**Solution:**
TD-MPC samples $N$ candidate action sequences from a Gaussian distribution.
1. The learned latent dynamics model $s_{t+1} = g(s_t, a_t)$ rolls each candidate sequence forward in imagination for a short horizon $H = 5$.
2. Trajectory return is estimated by summing predicted rewards plus terminal value:
$$R_{\text{traj}} = \sum_{t=0}^{H-1} \gamma^t r_{t+1} + \gamma^H Q(s_H, a_H)$$
3. Trajectories with higher returns receive higher Boltzmann weights in MPPI, updating the sampling mean and variance.
4. The first action of the best trajectory is executed in the real environment.
By combining short-horizon planning with a learned terminal Q-function, TD-MPC eliminates compounding simulation errors while planning dynamically for unexpected disturbances.

---

### Exercise 11.5: MuZero Invariance to Visual Perturbations
**Problem:** An Atari game is modified by adding a noisy animated television in the background that displays random static noise.
Explain why a VAE-based World Model fails to learn the game, while MuZero achieves identical performance to the original game.

**Solution:**
- **VAE-based World Model:** The random static on the television has maximum visual entropy. The VAE encoder and MDN-RNN allocate almost all of their convolutional filters and latent dimensions to modeling the unpredictable television pixels. The network exhausts its capacity predicting noise, failing to model the paddle or ball.
- **MuZero:** The television noise has zero correlation with score rewards, player loss, or optimal joystick actions. Because MuZero's loss function depends strictly on $\ell_r, \ell_v$, and $\ell_p$, the gradients through $h_\theta$ and $g_\theta$ with respect to the television pixels are identically zero. MuZero naturally ignores the entire television and maps only the paddle and ball into its abstract hidden states.

---

### Exercise 11.6: Discrete vs Continuous Latent Spaces in Dreamer
**Problem:** DreamerV1 used continuous Gaussian latents $z \sim \mathcal{N}(\mu, \sigma^2)$.
DreamerV2 and V3 switched to **discrete categorical latents** (a vector of 32 categorical distributions, each with 32 classes).
Explain why discrete latent spaces prevent the "exploding/vanishing variance" pathology of continuous Gaussian world models.

**Solution:**
In continuous Gaussian world models, the network can minimize KL divergence artificially by inflating the predicted variance $\sigma^2 \to \infty$ or collapsing it to zero, leading to posterior collapse and numerical instability.
In discrete categorical latents:
$$z \in \{0, 1\}^{32 \times 32}$$
the representation is a matrix of one-hot vectors sampled via the Gumbel-Softmax or straight-through estimator.
Discrete latents:
1. Cannot collapse to zero variance (probabilities are bounded in $[0, 1]$).
2. Are immune to outsized numerical outliers.
3. Natural sparsity matches the discrete combinatorial nature of objects, switches, and environmental states.

---

### Exercise 11.7: Policy Target Generation via MCTS Visit Counts
**Problem:** After 1,000 MCTS simulations, the visit counts at the root node for 3 legal actions are: $N(a_1) = 600, N(a_2) = 300, N(a_3) = 100$.
1. Compute the normalized visit count distribution $\pi_t(a)$.
2. If temperature $T = 0.50$ is applied: $\pi_t(a) \propto N(a)^{1/T}$, compute the temperature-sharpened probabilities.
3. Why is temperature set to $T = 1.0$ during exploration and $T \to 0$ (greedy argmax) during competitive evaluation?

**Solution:**
1. Normalized visit counts ($T = 1.0$):
$$\pi(a_1) = \frac{600}{1000} = 0.60, \quad \pi(a_2) = \frac{300}{1000} = 0.30, \quad \pi(a_3) = \frac{100}{1000} = 0.10$$

2. Temperature $T = 0.50$ ($1/T = 2.0$):
Square the visit counts:
$$N(a_1)^2 = 600^2 = 360,000$$
$$N(a_2)^2 = 300^2 = 90,000$$
$$N(a_3)^2 = 100^2 = 10,000$$
Sum $= 360,000 + 90,000 + 10,000 = 460,000$.
Probabilities:
$$\pi_{0.5}(a_1) = \frac{360,000}{460,000} \approx 0.7826$$
$$\pi_{0.5}(a_2) = \frac{90,000}{460,000} \approx 0.1957$$
$$\pi_{0.5}(a_3) = \frac{10,000}{460,000} \approx 0.0217$$

3. Purpose:
- Early in training or early in an episode, $T = 1.0$ ensures that actions are sampled proportionally to visit counts, promoting diverse state exploration.
- During competitive play, $T \to 0$ collapses the distribution into a deterministic argmax ($a = \arg\max_a N(a)$), selecting the rigorously proven best move.

---

### Exercise 11.8: Backward Gradient Flow in Dreamer Latent Actor-Critic
**Problem:** In Dreamer, the Actor is updated by backpropagating the gradient of imagined value directly through the dynamics model:
$$\nabla_{\boldsymbol{\theta}} \mathbb{E}[V(s_1)] = \nabla_{\boldsymbol{\theta}} V(g(s_0, \pi_{\boldsymbol{\theta}}(s_0)))$$
Apply the chain rule to show the gradient path through the dynamics function Jacobian $\frac{\partial g}{\partial a}$.

**Solution:**
By chain rule:
$$\frac{\partial V(s_1)}{\partial \boldsymbol{\theta}} = \left( \frac{\partial \boldsymbol{\theta}}{\partial \mathbf{a}_0} \right)^\top \left( \frac{\partial g(s_0, \mathbf{a}_0)}{\partial \mathbf{a}_0} \right)^\top \nabla_{s_1} V(s_1)$$
Notice that:
- $\nabla_{s_1} V(s_1)$ indicates how to shift the next latent state to increase value.
- $\frac{\partial g}{\partial \mathbf{a}_0}$ is the Jacobian of the dynamics model, translating latent state shifts into required action adjustments.
- $\frac{\partial \mathbf{a}_0}{\partial \boldsymbol{\theta}} = \nabla_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}(s_0)$ translates action adjustments into actor parameter updates.
The Actor learns through the **differentiable physics of the imagination engine**.

---

### Exercise 11.9: Reality Gap and Dynamics Randomization
**Problem:** An agent is trained inside a physics-based world model where friction is estimated as $\hat{\mu} = 0.5$.
In the physical real world, true friction is $\mu^* = 0.2$.
1. Explain the **Reality Gap** failure mode when the policy is deployed in the real world.
2. How does Domain Randomization (training across a distribution of imagined friction $\mu \sim \mathcal{U}[0.1, 0.8]$) close the reality gap?

**Solution:**
1. Reality Gap:
The agent plans aggressive accelerations and sharp turns under the assumption that ground friction is high ($\hat{\mu} = 0.5$). When deployed in the real world where $\mu^* = 0.2$, the car immediately skids out of control and crashes. The policy overfitted to the specific modeling bias of the simulator.
2. Domain Randomization:
By randomizing physical parameters during imagination ($\mu \sim \mathcal{U}[0.1, 0.8]$), the agent is forced to discover policies that remain stable and successful across the entire envelope of possible physics. The real world is simply treated as another sample from the randomized distribution.

---

### Exercise 11.10: Complete TypeScript Unit Verification Suite for Latent MCTS
**Problem:** Write a TypeScript verification test that initializes `runLatentMCTS` on a 2-action mock environment where action 1 yields reward $+5.0$ and action 0 yields reward $-5.0$, executing 50 simulations and asserting that:
1. Root visit count equals 50.
2. MCTS policy distribution overwhelmingly selects action 1 ($P(a=1) > 0.80$).
3. Q-value of action 1 is strictly positive.

**Solution:**
```typescript
import { MuZeroNode } from './muzero-node';
import { runLatentMCTS } from './muzero-mcts'; // Assuming implementation from Worked Example 11.10

export function testLatentMCTSVerification(): boolean {
  const root = new MuZeroNode(1.0, [0.0]);

  // Mock dynamics: Action 1 -> reward +5.0; Action 0 -> reward -5.0
  const mockDynamics = (state: number[], action: number) => ({
    reward: action === 1 ? 5.0 : -5.0,
    nextState: [state[0] + (action === 1 ? 1 : -1)]
  });

  // Mock prediction: Uniform prior, value = 0
  const mockPrediction = (state: number[]) => ({
    policyProbs: [0.5, 0.5],
    value: state[0] > 0 ? 2.0 : -2.0
  });

  // Execute 50 simulations
  const searchPolicy = runLatentMCTS(root, 50, 2, mockDynamics, mockPrediction, 0.99);
  console.log(`MCTS Search Policy: P(a=0) = ${searchPolicy[0].toFixed(4)}, P(a=1) = ${searchPolicy[1].toFixed(4)}`);

  const child0 = root.children.get(0)!;
  const child1 = root.children.get(1)!;
  console.log(`Child 0: Visits = ${child0.visitCount}, Value = ${child0.value.toFixed(2)}`);
  console.log(`Child 1: Visits = ${child1.visitCount}, Value = ${child1.value.toFixed(2)}`);

  // Assertions
  const visitsMatch = root.visitCount === 51; // 50 simulations + 1 root initial
  const favorsBestAction = searchPolicy[1] > 0.80;
  const valuePositive = child1.value > 0;

  console.log(`Assertion 1 (Visits correct): ${visitsMatch}`);
  console.log(`Assertion 2 (Favors action 1 > 80%): ${favorsBestAction}`);
  console.log(`Assertion 3 (Value of action 1 positive): ${valuePositive}`);

  const passed = visitsMatch && favorsBestAction && valuePositive;
  console.log(`Latent MCTS Unit Suite Passed: ${passed}`);
  return passed;
}

testLatentMCTSVerification();
```


# Chapter 12: Production TypeScript Deep RL Engine & Pathway Grand Synthesis

---

## 12.1 The Epistemic Arc of Pathway #3

With this twelfth chapter, we stand at the summit of **Pathway #3: AI Agents in Simulated Environments Pathway**.

Let us pause to trace the intellectual trajectory that brought us to this capstone:

```
                            THE EPISTEMIC ARCHITECTURE OF PATHWAY #3
                            
   MODULE 1: MATH PROBABILITY & STATISTICS
   Probability Spaces (Î©, F, P) â”€â”€â–º Random Variables â”€â”€â–º Expectations & Variance â”€â”€â–º Information Theory & KL
                                                                                            â”‚
                                                                                            â–¼
   MODULE 2: NEURAL NETWORKS FOUNDATIONS
   Computational Graphs â”€â”€â–º Reverse Autograd â”€â”€â–º Multi-Layer Perceptrons â”€â”€â–º Loss Surfaces & Optimization
                                                                                            â”‚
                                                                                            â–¼
   MODULE 3: REINFORCEMENT LEARNING & MDPs
   Markov Chains â”€â”€â–º Bellman Operators â”€â”€â–º Contraction Mappings â”€â”€â–º Dynamic Programming & Tabular Q
                                                                                            â”‚
                                                                                            â–¼
   MODULE 4: DEEP RL & AUTONOMOUS AGENTS (CAPSTONE)
   Function Approximation â”€â”€â–º Deadly Triad â”€â”€â–º Deep Q-Networks â”€â”€â–º Policy Gradients â”€â”€â–º World Models & MuZero
```

1. **Module 1 (`math-probability-statistics`):** We constructed the formal language of uncertainty: probability spaces $(\Omega, \mathcal{F}, \mathbb{P})$, random variables, joint densities, conditional expectations, Markov chains, martingale convergence, and information-theoretic divergence ($D_{\text{KL}}$). Without this language, reinforcement learning is incomprehensible.
2. **Module 2 (`cs-neural-networks-foundations`):** We built high-dimensional parametric function approximation from scratch: computational DAGs, reverse-mode automatic differentiation (`autograd.ts`), weight initialization dynamics, and stochastic gradient descent. We learned how deep networks compress visual inputs into spatial embeddings.
3. **Module 3 (`cs-reinforcement-learning-mdp`):** We formalized the interaction between agent and universe: Markov Decision Processes, state-transition dynamics, the Bellman Expectation and Optimality equations, Banach fixed-point contraction mappings, policy iteration, value iteration, and tabular temporal-difference learning (`mdp-simulator.ts`).
4. **Module 4 (`cs-deep-rl-agents`):** In this final capstone treatise, we brought all three disciplines together into unified synthesis:
   - We confronted the **Curse of Dimensionality** and the **Deadly Triad** (Function Approximation + Bootstrapping + Off-Policy Training).
   - We mastered **Deep Q-Networks (DQN)**, stabilizing optimization through the twin pillars of **Experience Replay** and **Target Networks**, with **Double DQN**, **Dueling Architectures**, and **Prioritized Experience Replay (PER)**.
   - We broke through discrete boundaries into continuous action control via the **Policy Gradient Theorem**, **REINFORCE**, **Advantage Actor-Critic (A2C)**, and **Generalized Advantage Estimation (GAE)**.
   - We tamed continuous robotics via **DDPG** and **Twin Delayed DDPG (TD3)**, and solved policy collapse via trust regions in **TRPO** and **PPO**.
   - Finally, we transcended model-free reflex architectures to achieve true cognitive planning in **World Models**, **Dreamer**, and **MuZero**.

---

## 12.2 The Unified Taxonomy of Deep Reinforcement Learning

```
                       THE COMPLETE DEEP RL ALGORITHMIC FAMILY
                       
                                     REINFORCEMENT LEARNING
                                               â”‚
                       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                       â–¼                                               â–¼
               MODEL-FREE RL                                     MODEL-BASED RL
                       â”‚                                               â”‚
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â–¼                           â–¼                   â–¼                           â–¼
    VALUE-BASED                 POLICY-BASED       PIXEL RECONSTRUCTION      VALUE-EQUIVALENT
  â€¢ Deep Q-Networks           â€¢ REINFORCE          â€¢ World Models (VAE)      â€¢ MuZero (MCTS)
  â€¢ Double DQN                â€¢ TRPO               â€¢ Dreamer (RSSM)          â€¢ EfficientZero
  â€¢ Dueling DQN               â€¢ PPO (Clipped)                                â€¢ TD-MPC
  â€¢ Prioritized Replay (PER)         â”‚
  â€¢ Rainbow DQN                      â–¼
                               ACTOR-CRITIC
                             â€¢ A2C / A3C (GAE)
                             â€¢ DDPG / TD3
                             â€¢ Soft Actor-Critic (SAC)
```

Every algorithm across this landscape negotiates a fundamental trade-off:
$$\text{Sample Efficiency} \quad \longleftrightarrow \quad \text{Computational Simplicity} \quad \longleftrightarrow \quad \text{Asymptotic Optimality}$$

---

## 12.3 10 Grand Gauntlet Problems: Cross-Pathway Synthesis

### Grand Gauntlet 12.1: The Inter-Disciplinary Trifecta: Autograd, MDP Resolvent, and Policy Gradient
**Problem:** A 2-state discrete MDP has transition matrix under policy $\pi_\theta$:
$$\mathbf{P}^\theta = \begin{bmatrix} 1 - \sigma(\theta) & \sigma(\theta) \\ 0.2 & 0.8 \end{bmatrix}, \quad \mathbf{r} = \begin{bmatrix} 10.0 \\ 2.0 \end{bmatrix}, \quad \gamma = 0.90$$
where $\sigma(\theta) = \frac{1}{1 + e^{-\theta}}$. Initial parameter is $\theta = 0$.
1. Compute the exact state value vector $\mathbf{v}^\theta = (\mathbf{I} - \gamma \mathbf{P}^\theta)^{-1} \mathbf{r}$ at $\theta = 0$.
2. Compute the exact matrix derivative $\frac{d\mathbf{P}^\theta}{d\theta} \big|_{\theta=0}$.
3. Using the matrix resolvent derivative formula $\frac{d}{d\theta}(\mathbf{I} - \gamma \mathbf{P})^{-1} = \gamma (\mathbf{I} - \gamma \mathbf{P})^{-1} \frac{d\mathbf{P}}{d\theta} (\mathbf{I} - \gamma \mathbf{P})^{-1}$, compute the exact analytical policy gradient $\frac{d v_1^\theta}{d\theta} \big|_{\theta=0}$.

**Solution:**
1. At $\theta = 0$, $\sigma(0) = 0.5$.
$$\mathbf{P}^0 = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix}$$
$$\mathbf{I} - \gamma \mathbf{P}^0 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - 0.9 \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix} = \begin{bmatrix} 1 - 0.45 & -0.45 \\ -0.18 & 1 - 0.72 \end{bmatrix} = \begin{bmatrix} 0.55 & -0.45 \\ -0.18 & 0.28 \end{bmatrix}$$
Determinant:
$$\det = (0.55)(0.28) - (-0.45)(-0.18) = 0.1540 - 0.0810 = 0.0730$$
Resolvent inverse:
$$(\mathbf{I} - \gamma \mathbf{P}^0)^{-1} = \frac{1}{0.0730} \begin{bmatrix} 0.28 & 0.45 \\ 0.18 & 0.55 \end{bmatrix}$$
Value vector:
$$\mathbf{v}^0 = \frac{1}{0.0730} \begin{bmatrix} 0.28(10) + 0.45(2) \\ 0.18(10) + 0.55(2) \end{bmatrix} = \frac{1}{0.0730} \begin{bmatrix} 2.8 + 0.9 \\ 1.8 + 1.1 \end{bmatrix} = \frac{1}{0.0730} \begin{bmatrix} 3.7 \\ 2.9 \end{bmatrix} \approx \begin{bmatrix} 50.6849 \\ 39.7260 \end{bmatrix}$$

2. Matrix derivative:
Since $\frac{d\sigma}{d\theta} = \sigma(1-\sigma) = 0.5(0.5) = 0.25$:
$$\frac{d\mathbf{P}^\theta}{d\theta} \Big|_{\theta=0} = \begin{bmatrix} -0.25 & +0.25 \\ 0 & 0 \end{bmatrix}$$

3. Analytical Policy Gradient:
$$\frac{d\mathbf{v}^\theta}{d\theta} = \gamma (\mathbf{I} - \gamma \mathbf{P})^{-1} \frac{d\mathbf{P}}{d\theta} \mathbf{v}^0$$
Compute $\frac{d\mathbf{P}}{d\theta} \mathbf{v}^0$:
$$\begin{bmatrix} -0.25 & 0.25 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 50.6849 \\ 39.7260 \end{bmatrix} = \begin{bmatrix} 0.25(39.7260 - 50.6849) \\ 0 \end{bmatrix} = \begin{bmatrix} 0.25(-10.9589) \\ 0 \end{bmatrix} = \begin{bmatrix} -2.7397 \\ 0 \end{bmatrix}$$
Pre-multiply by $\gamma (\mathbf{I} - \gamma \mathbf{P})^{-1}$:
$$\frac{d\mathbf{v}^\theta}{d\theta} = \frac{0.90}{0.0730} \begin{bmatrix} 0.28 & 0.45 \\ 0.18 & 0.55 \end{bmatrix} \begin{bmatrix} -2.7397 \\ 0 \end{bmatrix} = \frac{0.90}{0.0730} \begin{bmatrix} 0.28(-2.7397) \\ 0.18(-2.7397) \end{bmatrix} = \frac{0.90}{0.0730} \begin{bmatrix} -0.7671 \\ -0.4931 \end{bmatrix} \approx \begin{bmatrix} -9.457 \\ -6.079 \end{bmatrix}$$
Policy gradient for state 1 is $\frac{d v_1}{d\theta} \approx -9.457$.
Increasing $\theta$ shifts probability from state 1 ($r=10$) into state 2 ($r=2$), reducing expected return. The gradient correctly has a negative sign!

---

### Grand Gauntlet 12.2: Contraction Operator of Soft Target Networks
**Problem:** In continuous actor-critic, soft target updates obey: $\boldsymbol{\theta}^-_{k+1} = \tau \boldsymbol{\theta}_k + (1 - \tau) \boldsymbol{\theta}^-_k$.
Online parameters minimize MSE against target parameters: $\boldsymbol{\theta}_{k+1} = \arg\min_{\boldsymbol{\theta}} \|\boldsymbol{\theta} - \gamma \mathbf{A} \boldsymbol{\theta}^-_k\|_2^2$, where $\mathbf{A}$ is a transition operator with spectral radius $\rho(\mathbf{A}) = 1.0$.
1. Express the combined discrete linear system $\begin{bmatrix} \boldsymbol{\theta}_{k+1} \\ \boldsymbol{\theta}^-_{k+1} \end{bmatrix} = \mathbf{M} \begin{bmatrix} \boldsymbol{\theta}_k \\ \boldsymbol{\theta}^-_k \end{bmatrix}$.
2. Write matrix $\mathbf{M}$ in terms of $\gamma, \tau$, and $\mathbf{A}$.
3. Prove that for any $\gamma \in [0, 1)$ and $\tau \in (0, 1]$, all eigenvalues of $\mathbf{M}$ lie strictly inside the complex unit disc ($|\lambda_i| < 1$).

**Solution:**
1. Recurrence relations:
$$\boldsymbol{\theta}_{k+1} = \gamma \mathbf{A} \boldsymbol{\theta}^-_k$$
$$\boldsymbol{\theta}^-_{k+1} = \tau \boldsymbol{\theta}_{k+1} + (1 - \tau) \boldsymbol{\theta}^-_k = \tau (\gamma \mathbf{A} \boldsymbol{\theta}^-_k) + (1 - \tau)\boldsymbol{\theta}^-_k = (\tau \gamma \mathbf{A} + (1 - \tau)\mathbf{I}) \boldsymbol{\theta}^-_k$$
Matrix block form:
$$\mathbf{M} = \begin{bmatrix} \mathbf{0} & \gamma \mathbf{A} \\ \mathbf{0} & \tau \gamma \mathbf{A} + (1 - \tau)\mathbf{I} \end{bmatrix}$$

2. Characteristic polynomial and eigenvalues:
$$\det(\lambda \mathbf{I} - \mathbf{M}) = \det\begin{bmatrix} \lambda \mathbf{I} & -\gamma \mathbf{A} \\ \mathbf{0} & \lambda \mathbf{I} - (\tau \gamma \mathbf{A} + (1 - \tau)\mathbf{I}) \end{bmatrix} = \det(\lambda \mathbf{I}) \cdot \det\left( \lambda \mathbf{I} - (\tau \gamma \mathbf{A} + (1 - \tau)\mathbf{I}) \right) = 0$$
- One set of eigenvalues is $\lambda = 0$ (trivially inside unit disc).
- The remaining eigenvalues satisfy:
$$\lambda_i = \tau \gamma \lambda_i(\mathbf{A}) + (1 - \tau)$$

3. Spectral bound:
Since $\rho(\mathbf{A}) = 1$, for any eigenvalue $\mu \in \mathbb{C}$ of $\mathbf{A}$, $|\mu| \le 1$.
$$|\lambda| = |(1 - \tau) + \tau \gamma \mu| \le (1 - \tau) + \tau \gamma |\mu| \le (1 - \tau) + \tau \gamma(1) = 1 - \tau(1 - \gamma)$$
Since $\tau > 0$ and $\gamma < 1$, we have $\tau(1 - \gamma) > 0$.
$$|\lambda| \le 1 - \tau(1 - \gamma) < 1.0$$
The spectral radius is strictly bounded away from 1: $\rho(\mathbf{M}) \le 1 - \tau(1 - \gamma) < 1$.
The dual-network system is a strict contraction mapping, guaranteeing asymptotic convergence. $\blacksquare$

---

### Grand Gauntlet 12.3: Information-Theoretic Lower Bound on Policy Improvement
**Problem:** Prove that for any two stochastic policies $\pi$ and $\tilde{\pi}$, if $\max_s D_{\text{KL}}(\pi(\cdot \mid s) \parallel \tilde{\pi}(\cdot \mid s)) \le \delta$, then the total variation distance between trajectory distributions $P(\tau; \pi)$ and $P(\tau; \tilde{\pi})$ over horizon $T$ is bounded by:
$$D_{\text{TV}}(P(\tau; \pi), P(\tau; \tilde{\pi})) \le \sqrt{\frac{T \delta}{2}}$$

**Solution:**
1. Trajectory KL divergence:
From chain rule for KL divergence on Markov chains:
$$D_{\text{KL}}(P(\tau; \pi) \parallel P(\tau; \tilde{\pi})) = \sum_{t=0}^{T-1} \mathbb{E}_{s_t \sim \pi} \left[ D_{\text{KL}}(\pi(\cdot \mid s_t) \parallel \tilde{\pi}(\cdot \mid s_t)) \right]$$
Since $\max_s D_{\text{KL}} \le \delta$:
$$D_{\text{KL}}(P(\tau; \pi) \parallel P(\tau; \tilde{\pi})) \le \sum_{t=0}^{T-1} \delta = T \delta$$

2. Pinsker's Inequality:
For any two probability distributions $P$ and $Q$:
$$D_{\text{TV}}(P, Q) \le \sqrt{\frac{1}{2} D_{\text{KL}}(P \parallel Q)}$$
Substituting $D_{\text{KL}} \le T \delta$:
$$D_{\text{TV}}(P(\tau; \pi), P(\tau; \tilde{\pi})) \le \sqrt{\frac{T \delta}{2}} \quad \blacksquare$$
This proves that constraining state-level KL divergence by $\delta$ tightly bounds the divergence of full environmental trajectories.

---

### Grand Gauntlet 12.4: Exact Dueling Aggregation Gradient Flow
**Problem:** In Dueling Networks, let $Q_a = V + A_a - \frac{1}{K}\sum_k A_k$.
Suppose loss $\mathcal{L} = \frac{1}{2}\sum_a (y_a - Q_a)^2$.
1. Prove that $\frac{\partial \mathcal{L}}{\partial V} = - \sum_a (y_a - Q_a)$.
2. Prove that $\frac{\partial \mathcal{L}}{\partial A_a} = - (y_a - Q_a) + \frac{1}{K}\sum_k (y_k - Q_k)$.
3. Show that $\sum_a \frac{\partial \mathcal{L}}{\partial A_a} = 0$ (the gradient arriving at the advantage stream is strictly zero-mean).

**Solution:**
1. Derivative with respect to $V$:
$$\frac{\partial \mathcal{L}}{\partial V} = \sum_a \frac{\partial \mathcal{L}}{\partial Q_a} \frac{\partial Q_a}{\partial V} = \sum_a (-(y_a - Q_a)) \cdot 1 = - \sum_a (y_a - Q_a) \quad \blacksquare$$

2. Derivative with respect to $A_b$:
$$\frac{\partial \mathcal{L}}{\partial A_b} = \sum_a \frac{\partial \mathcal{L}}{\partial Q_a} \frac{\partial Q_a}{\partial A_b} = \sum_a (-(y_a - Q_a)) \left( \mathbb{I}(a = b) - \frac{1}{K} \right)$$
$$= - (y_b - Q_b) + \frac{1}{K}\sum_a (y_a - Q_a) \quad \blacksquare$$

3. Sum over all actions:
$$\sum_{b=1}^K \frac{\partial \mathcal{L}}{\partial A_b} = - \sum_b (y_b - Q_b) + \sum_{b=1}^K \frac{1}{K} \sum_a (y_a - Q_a) = - \sum_b (y_b - Q_b) + \frac{K}{K}\sum_a (y_a - Q_a) = 0 \quad \blacksquare$$
The advantage stream updates only relative preferences, while the value stream absorbs 100% of the common baseline error.

---

### Grand Gauntlet 12.5: Asymptotic Bias in Truncated PPO Rollouts
**Problem:** Let an agent collect rollouts of fixed length $T$ without bootstrapping ($V(s_T) = 0$).
True episode horizon is $H \gg T$, with constant reward $r = 1$ and discount $\gamma$.
1. Compute the truncated return $\hat{G}_0 = \sum_{t=0}^{T-1} \gamma^t (1)$.
2. Compute the infinite-horizon true return $G_0^* = \sum_{t=0}^\infty \gamma^t (1)$.
3. Compute the relative error $\frac{G_0^* - \hat{G}_0}{G_0^*}$.
4. For $\gamma = 0.99$ and $T = 20$, evaluate the truncation error percentage.

**Solution:**
1. Truncated sum:
$$\hat{G}_0 = \frac{1 - \gamma^T}{1 - \gamma}$$

2. Infinite sum:
$$G_0^* = \frac{1}{1 - \gamma}$$

3. Relative error:
$$\text{Relative Error} = \frac{\frac{1}{1 - \gamma} - \frac{1 - \gamma^T}{1 - \gamma}}{\frac{1}{1 - \gamma}} = \gamma^T$$

4. Evaluation ($\gamma = 0.99, T = 20$):
$$\text{Relative Error} = (0.99)^{20} \approx 0.8179 \quad (81.8\% \text{ error!})$$
Without bootstrapping $V(s_T)$, the truncated agent underestimates returns by over $81\%$, destroying performance.

---

### Grand Gauntlet 12.6: Extreme Value Overestimation Under Exponential Noise
**Problem:** Let action values be estimated with independent exponential noise: $X_i \sim \text{Exp}(\lambda)$ with PDF $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$, across $M$ actions.
1. Derive the CDF of $M_{\max} = \max_{i=1..M} X_i$.
2. Compute the exact expected maximum value $\mathbb{E}[M_{\max}]$.
3. Express the overestimation bias in terms of the Harmonic number $H_M = \sum_{k=1}^M \frac{1}{k}$.

**Solution:**
1. CDF:
$$F_X(x) = 1 - e^{-\lambda x} \implies F_{\max}(x) = (1 - e^{-\lambda x})^M$$

2. Expectation:
Using the tail probability formula for non-negative random variables:
$$\mathbb{E}[M_{\max}] = \int_0^\infty (1 - F_{\max}(x)) dx = \int_0^\infty \left( 1 - (1 - e^{-\lambda x})^M \right) dx$$
Let $u = 1 - e^{-\lambda x} \implies du = \lambda e^{-\lambda x} dx = \lambda (1 - u) dx \implies dx = \frac{du}{\lambda(1 - u)}$:
$$= \int_0^1 \frac{1 - u^M}{\lambda (1 - u)} du = \frac{1}{\lambda} \int_0^1 \left( \sum_{k=0}^{M-1} u^k \right) du = \frac{1}{\lambda} \sum_{k=0}^{M-1} \frac{1}{k + 1} = \frac{1}{\lambda} \sum_{j=1}^M \frac{1}{j} = \frac{H_M}{\lambda}$$

3. Overestimation bias:
Since true mean of each action is $\mathbb{E}[X] = \frac{1}{\lambda}$:
$$\text{Bias} = \mathbb{E}[M_{\max}] - \max_i \mathbb{E}[X_i] = \frac{H_M}{\lambda} - \frac{1}{\lambda} = \frac{H_M - 1}{\lambda}$$
As $M \to \infty$, $H_M \approx \ln M + \gamma_{\text{Euler}}$. The maximization bias grows logarithmically without bound.

---

### Grand Gauntlet 12.7: Multi-Step Bootstrapping Contraction Bound
**Problem:** Let $\mathcal{T}^{(n)}$ be the $n$-step Bellman optimality operator:
$$(\mathcal{T}^{(n)} Q)(s, a) = \mathbb{E}\left[ \sum_{t=0}^{n-1} \gamma^t r_{t+1} + \gamma^n \max_{a'} Q(S_n, a') \right]$$
1. Prove that $\mathcal{T}^{(n)}$ is a contraction mapping in the supremum norm with contraction modulus $\gamma^n$.
2. If $\gamma = 0.90$, compare the contraction modulus of 1-step TD vs 3-step TD ($n=3$).
3. What is the convergence speedup ratio in terms of required iterations to reduce error by factor $\epsilon$?

**Solution:**
1. Contraction proof:
$$\|(\mathcal{T}^{(n)} Q_1) - (\mathcal{T}^{(n)} Q_2)\|_\infty = \sup_{s, a} \left| \gamma^n \sum_{s'} \mathbb{P}(s' \mid s, a, n) \left( \max_{a'} Q_1(s', a') - \max_{a'} Q_2(s', a') \right) \right|$$
$$\le \gamma^n \sup_{s'} |\max_{a'} Q_1(s', a') - \max_{a'} Q_2(s', a')| \le \gamma^n \|Q_1 - Q_2\|_\infty \quad \blacksquare$$

2. Modulus comparison:
- 1-step TD: $\kappa_1 = 0.90$.
- 3-step TD: $\kappa_3 = (0.90)^3 = 0.729$.

3. Convergence speedup:
Number of iterations to reduce error by $\epsilon$:
$$K_1 = \frac{\ln \epsilon}{\ln(0.90)} \approx \frac{\ln \epsilon}{-0.1054}$$
$$K_3 = \frac{\ln \epsilon}{\ln(0.729)} \approx \frac{\ln \epsilon}{-0.3161}$$
$$\text{Speedup Ratio} = \frac{K_1}{K_3} = \frac{0.3161}{0.1054} = 3.0 \times$$
3-step returns contract error three times faster per iteration.

---

### Grand Gauntlet 12.8: Prioritized Replay Sum-Tree Sampling Complexity
**Problem:** A prioritized replay buffer holds $N = 2^{20} = 1,048,576$ transitions.
1. What is the height of the Sum-Tree?
2. How many array lookups are executed to sample a mini-batch of size $B = 64$?
3. Compare this against linear search sampling over an array of size $N$.

**Solution:**
1. Tree height:
$$\text{Height} = \log_2(N) = \log_2(2^{20}) = 20 \text{ levels}$$

2. Lookups for batch size $B = 64$:
Per sample: 20 levels $\times 1$ comparison per level $= 20$ operations.
For $B = 64$:
$$\text{Total Lookups} = 64 \times 20 = 1,280 \text{ operations}$$

3. Linear search comparison:
Linear search requires scanning the cumulative sum array:
$$\text{Average Lookups per Sample} = \frac{N}{2} = \frac{1,048,576}{2} = 524,288 \text{ operations}$$
For $B = 64$:
$$\text{Total Lookups} = 64 \times 524,288 = 33,554,432 \text{ operations}$$
$$\text{Speedup Ratio} = \frac{33,554,432}{1,280} = 26,214.4 \times$$
The Sum-Tree executes over **26,000 times faster**, making real-time PER possible.

---

### Grand Gauntlet 12.9: Fisher-Rao Distance Between Shifted Categorical Distributions
**Problem:** Let $\mathbf{p} = [p, 1-p]^\top$ be a Bernoulli distribution.
The Fisher Information is $F(p) = \frac{1}{p(1-p)}$.
The Fisher-Rao Riemannian distance between two distributions $p_1$ and $p_2$ is:
$$d_F(p_1, p_2) = \int_{p_1}^{p_2} \sqrt{F(p)} dp$$
1. Evaluate the integral to obtain the closed-form Fisher-Rao distance.
2. For $p_1 = 0.50$ and $p_2 = 0.55$, compute $d_F(p_1, p_2)$.
3. For $p_1 = 0.90$ and $p_2 = 0.95$, compute $d_F(p_1, p_2)$.
4. Explain why shifting probability by $+0.05$ near the boundary (0.90 to 0.95) represents a vastly larger statistical distance than shifting near the center (0.50 to 0.55).

**Solution:**
1. Integral evaluation:
$$d_F(p_1, p_2) = \int_{p_1}^{p_2} \frac{1}{\sqrt{p(1-p)}} dp$$
Substitute $p = \sin^2 \theta \implies dp = 2 \sin \theta \cos \theta d\theta, \sqrt{p(1-p)} = \sin \theta \cos \theta$:
$$= \int_{\theta_1}^{\theta_2} \frac{2 \sin \theta \cos \theta}{\sin \theta \cos \theta} d\theta = 2(\theta_2 - \theta_1) = 2 \left( \arcsin(\sqrt{p_2}) - \arcsin(\sqrt{p_1}) \right)$$

2. Case 1 ($0.50 \to 0.55$):
- $\arcsin(\sqrt{0.50}) = \arcsin(0.7071) \approx 0.7854 \text{ rad}$.
- $\arcsin(\sqrt{0.55}) = \arcsin(0.7416) \approx 0.8355 \text{ rad}$.
$$d_F = 2(0.8355 - 0.7854) = 2(0.0501) = 0.1002$$

3. Case 2 ($0.90 \to 0.95$):
- $\arcsin(\sqrt{0.90}) = \arcsin(0.9487) \approx 1.2490 \text{ rad}$.
- $\arcsin(\sqrt{0.95}) = \arcsin(0.9747) \approx 1.3432 \text{ rad}$.
$$d_F = 2(1.3432 - 1.2490) = 2(0.0942) = 0.1884$$

4. Conclusion:
$$d_F(0.90, 0.95) \approx 1.88 \times d_F(0.50, 0.55)$$
In probability space, changing an action's failure rate from $10\%$ to $5\%$ cuts errors in half (a $2\times$ reduction in error frequency), whereas changing from $50\%$ to $45\%$ is a negligible $10\%$ relative shift. The Fisher-Rao metric naturally captures relative informational distance.

---

### Grand Gauntlet 12.10: MuZero Latent Transition Consistency Bound
**Problem:** In MuZero, abstract dynamics $s^{k} = g(s^{k-1}, a^k)$ unrolls forward.
Let $h(o)$ be the true visual encoder.
Suppose we enforce a **Latent Consistency Loss** (as in EfficientZero):
$$\mathcal{L}_{\text{consistency}} = \sum_{k=1}^K \|\frac{s^k}{\|s^k\|} - \frac{h(o_k)}{\|h(o_k)\|}\|_2^2$$
Explain how latent consistency prevents representation collapse without needing pixel reconstruction.

**Solution:**
In unconstrained latent planning, dynamics function $g(s, a)$ can drift into abstract regimes that bear zero resemblance to future encoder representations $h(o_{t+k})$.
Enforcing cosine similarity between the unrolled latent state $s^k$ and the future encoded observation $h(o_{t+k})$ grounds the dynamics model to real observations. Because both vectors are normalized to unit sphere, the network cannot collapse to trivial constants ($\mathbf{0}$). It guarantees that the imagined latent dynamics mirror the temporal topology of physical observations without rendering a single pixel.

---

## 12.4 10 Capstone Mastery Problems: Implementation & Edge-Case Engineering

### Capstone Mastery 12.1: Numerical Underflow in Softmax Action Logits
**Problem:** A deep neural policy outputs raw logits $\mathbf{h} = [1000.0, 1002.0, 998.0]^\top$.
A naive implementation computes $p_i = \frac{e^{h_i}}{\sum_j e^{h_j}}$.
1. What occurs when `Math.exp(1000.0)` is executed in IEEE 754 floating-point arithmetic?
2. Write the mathematically identical **log-sum-exp stabilization trick**.
3. Compute the stabilized probabilities.

**Solution:**
1. In IEEE 754 double precision, maximum representable float is $\approx 1.79 \times 10^{308}$.
$\ln(1.79 \times 10^{308}) \approx 709.78$.
Executing `Math.exp(1000.0)` produces `+Infinity`.
Evaluating $\frac{\infty}{\infty + \infty + \infty}$ produces **`NaN`**, destroying all network parameters across the entire model!

2. Log-sum-exp stabilization trick:
Subtract the maximum logit $c = \max_j h_j$:
$$\frac{\exp(h_i)}{\sum_j \exp(h_j)} = \frac{\exp(h_i - c) \cdot e^c}{\sum_j \exp(h_j - c) \cdot e^c} = \frac{\exp(h_i - c)}{\sum_j \exp(h_j - c)}$$

3. Stabilized calculation ($c = 1002.0$):
$$\mathbf{h} - c = [1000 - 1002, 1002 - 1002, 998 - 1002] = [-2.0, 0.0, -4.0]$$
Exponentials:
$$e^{-2.0} \approx 0.1353, \quad e^0 = 1.0000, \quad e^{-4.0} \approx 0.0183$$
Sum $= 0.1353 + 1.0000 + 0.0183 = 1.1536$.
Probabilities:
$$p_0 = \frac{0.1353}{1.1536} \approx 0.1173, \quad p_1 = \frac{1.0000}{1.1536} \approx 0.8668, \quad p_2 = \frac{0.0183}{1.1536} \approx 0.0159$$
Zero overflow, zero `NaN`, 100% numerical stability.

---

### Capstone Mastery 12.2: Experience Replay Out-of-Bounds Memory Leak
**Problem:** A developer implements a circular replay buffer in TypeScript using `Array.push()` and `Array.shift()` to evict old items:
```typescript
class LeakyBuffer {
  private buffer: any[] = [];
  constructor(private capacity: number) {}
  push(item: any) {
    this.buffer.push(item);
    if (this.buffer.length > this.capacity) {
      this.buffer.shift(); // O(N) memory shift!
    }
  }
}
```
Explain the computational catastrophe: what is the algorithmic time complexity of `shift()` on an array of size $1,000,000$, and how does it degrade training speed?

**Solution:**
In JavaScript/V8 engine arrays, `shift()` removes the zero-th element and **shifts every subsequent pointer down by 1 memory address**.
For capacity $N = 1,000,000$, executing `shift()` performs $1,000,000$ pointer copy operations in memory:
$$\text{Time Complexity} = \mathcal{O}(N)$$
At 1,000 environment steps per second, the loop executes $1,000 \times 1,000,000 = 10^9$ memory shifts per second, completely freezing the CPU in garbage collection and memory copying.
A production buffer must allocate a fixed array once (`new Array(capacity)`) and use a modulo ring pointer $p = (p + 1) \pmod N$ in strictly $\mathcal{O}(1)$ time.

---

### Capstone Mastery 12.3: Terminal State Advantage Masking Bug
**Problem:** In an episodic environment, an agent reaches terminal state $s_T$ with reward $+10$.
The developer computes GAE advantages using:
```typescript
delta[t] = reward[t] + gamma * values[t+1] - values[t]; // Missing (1 - done)!
gae = delta[t] + gamma * lambda * gae;                  // Missing (1 - done)!
```
What catastrophic behavioral pathology develops in the policy near terminal states?

**Solution:**
When an episode ends at step $T$, the environment resets and step $T+1$ is the *initial state of the next episode*!
Without the `(1 - done)` mask, the TD error adds $\gamma V(s_{\text{next\_episode\_start}})$.
The agent falsely attributes the value of the *new episode's start* to its dying action. If starting states have high values, the agent learns to deliberately commit suicide as quickly as possible to harvest the hallucinated future start value!

---

### Capstone Mastery 12.4: Target Network Asynchrony Race Condition
**Problem:** In distributed actor-critic training across multiple GPU workers, worker threads copy target parameters $\boldsymbol{\theta}^-$ without thread locking:
```
Thread 1: overwriting layer 1 weights ... (preempted by OS scheduler)
Thread 2: forward pass using layer 1 from Î¸_new, but layer 2 from Î¸_old!
```
What is the mathematical consequence of hybrid mixed-generation parameter vectors?

**Solution:**
Deep neural networks rely on precise, non-linear coordinate alignments across hidden layers. If Layer 1 weights belong to iteration $k+100$ while Layer 2 weights belong to iteration $k$, the internal feature representations are completely scrambled. The output is mathematical garbage, injecting random noise into target calculations and triggering policy collapse. Target synchronization must be atomic.

---

### Capstone Mastery 12.5: Dead Neuron Re-Initialization in Continuous Actors
**Problem:** An Actor network uses ReLU activations: $h = \max(0, \mathbf{W} s + \mathbf{b})$.
During an aggressive PPO update, an outlier advantage pushes all bias terms $\mathbf{b}$ to $-10.0$.
For all states in the environment, $\mathbf{W} s + \mathbf{b} < 0 \implies h = 0$.
1. What is the gradient $\frac{\partial h}{\partial \mathbf{W}}$?
2. Can the network ever recover on subsequent training steps?
3. What architectural modifications prevent dead ReLU collapse?

**Solution:**
1. Derivative of saturated ReLU: $\frac{\partial \text{ReLU}(z)}{\partial z} = 0$ for $z < 0$.
By chain rule, $\frac{\partial \mathcal{L}}{\partial \mathbf{W}} = \mathbf{0}$.
2. The gradient is permanently zero. The neuron is mathematically "dead" and can never update or recover for the remainder of training.
3. Solutions:
- Replace ReLU with Leaky ReLU ($\max(0.01z, z)$) or ELU/GELU/Tanh, ensuring strictly non-zero gradients everywhere.
- Apply Orthogonal Weight Initialization with small gain ($0.01$ on the policy output layer).
- Enforce gradient norm clipping.

---

### Capstone Mastery 12.6: Entropy Collapse Under Gaussian Log-Std Clamping
**Problem:** In continuous PPO, log-std $\omega = \log \sigma$ is parameterized as a free variable.
A developer clamps $\omega \in [-20, 2]$.
1. Calculate the minimum standard deviation $\sigma_{\min} = e^{-20}$.
2. What occurs when the policy standard deviation reaches $e^{-20}$?
3. What is the recommended lower bound for continuous control?

**Solution:**
1. $\sigma_{\min} = e^{-20} \approx 2.06 \times 10^{-9}$.
2. At $\sigma = 10^{-9}$, floating-point division by $\sigma^2 = 10^{-18}$ in the Gaussian log-probability formula $\frac{(a - \mu)^2}{2\sigma^2}$ produces numbers on the order of $10^{18}$, causing immediate arithmetic overflow or gradient explosion.
3. Recommended bound: In standard continuous control benchmarks (MuJoCo/Gym), log-std should be clamped to $\omega \in [-2.0, 0.5]$, ensuring $\sigma \in [0.135, 1.65]$, which maintains stable exploration and safe numerical gradients.

---

### Capstone Mastery 12.7: Advantage Normalization Division by Zero
**Problem:** In A2C/PPO, advantages are normalized: $\tilde{A}_i = \frac{A_i - \mu_A}{\sigma_A}$.
Suppose an agent operates in an environment where all transitions in a rollout receive identical reward $0$ and identical critic value $0$.
1. What is $\sigma_A$?
2. What happens if epsilon is omitted: $\frac{A_i - \mu_A}{\sigma_A}$?
3. Write the production-grade safe normalization formula.

**Solution:**
1. When all advantages are identical (e.g. $A_i = 0$), sample variance is $0 \implies \sigma_A = 0$.
2. Dividing by zero produces **`NaN`**, corrupting policy weights.
3. Production safe formula:
$$\tilde{A}_i = \frac{A_i - \mu_A}{\sigma_A + 10^{-8}}$$
Adding $\epsilon = 10^{-8}$ guarantees strict division safety under zero variance.

---

### Capstone Mastery 12.8: Discount Factor Horizon Mismatch in Model-Based Rollouts
**Problem:** An agent is trained with environment discount factor $\gamma = 0.99$.
During imagination in Dreamer, the developer sets the imagination discount to $\gamma_{\text{imag}} = 0.50$ to stabilize long-term rollouts.
Explain why this discrepancy causes the agent to develop hyper-shortsighted, impulsive real-world behavior.

**Solution:**
The effective time horizon of discounted returns is $H_{\text{eff}} \approx \frac{1}{1 - \gamma}$:
- With $\gamma = 0.99$: $H_{\text{eff}} = \frac{1}{0.01} = 100 \text{ steps}$.
- With $\gamma = 0.50$: $H_{\text{eff}} = \frac{1}{0.50} = 2 \text{ steps}$!
Under $\gamma = 0.50$, a reward 5 steps in the future is discounted by $(0.5)^5 = 0.03125$ ($> 96\%$ discounted!).
The agent learns to grab immediate petty rewards while ignoring massive lethal penalties that occur just 3 steps later. Imagination discounting must match real environmental discounting.

---

### Capstone Mastery 12.9: Reward Shaping Invariance via Potential Functions
**Problem:** To accelerate learning, a developer adds an auxiliary reward: $\tilde{r}(s, a, s') = r(s, a, s') + F(s, s')$.
Ng, Harada, and Russell (1999) proved that policy invariance is preserved if and only if $F$ is a **potential-based reward shaping function**:
$$F(s, s') = \gamma \Phi(s') - \Phi(s)$$
for some scalar potential function $\Phi(s)$.
Prove that potential-based reward shaping leaves the optimal policy $\pi^*$ unchanged.

**Solution:**
Let the shaped return along trajectory $\tau = (s_0, a_0, s_1, a_1, \dots)$ be $\tilde{G}_0$:
$$\tilde{G}_0 = \sum_{t=0}^\infty \gamma^t \tilde{r}_{t+1} = \sum_{t=0}^\infty \gamma^t \left( r_{t+1} + \gamma \Phi(s_{t+1}) - \Phi(s_t) \right)$$
Expanding the sum:
$$= \sum_{t=0}^\infty \gamma^t r_{t+1} + \sum_{t=0}^\infty \left( \gamma^{t+1} \Phi(s_{t+1}) - \gamma^t \Phi(s_t) \right)$$
Notice the second summation is a **telescoping series**:
$$(\gamma \Phi(s_1) - \Phi(s_0)) + (\gamma^2 \Phi(s_2) - \gamma \Phi(s_1)) + (\gamma^3 \Phi(s_3) - \gamma^2 \Phi(s_2)) + \dots = -\Phi(s_0) + \lim_{T \to \infty} \gamma^T \Phi(s_T)$$
Assuming $\gamma < 1$ and $\Phi$ bounded, $\lim_{T \to \infty} \gamma^T \Phi(s_T) = 0$.
$$\tilde{G}_0 = G_0 - \Phi(s_0)$$
Taking expectations:
$$\tilde{Q}^*(s, a) = Q^*(s, a) - \Phi(s)$$
Now observe the optimal policy under the shaped Q-function:
$$\pi_{\text{shaped}}^*(s) = \arg\max_a \tilde{Q}^*(s, a) = \arg\max_a \left( Q^*(s, a) - \Phi(s) \right)$$
Because $\Phi(s)$ does not depend on action $a$, subtracting $\Phi(s)$ shifts all action values by the identical constant, leaving the argmax completely unchanged:
$$\arg\max_a \left( Q^*(s, a) - \Phi(s) \right) = \arg\max_a Q^*(s, a) = \pi^*(s) \quad \blacksquare$$

---

### Capstone Mastery 12.10: The Sovereign Capstone Manifesto: The Path to Autonomous Superintelligence
**Problem:** Synthesize the grand architectural vision of artificial agency: why is reinforcement learning in simulated environments the primary path toward Artificial General Intelligence (AGI)?

**Solution:**
In supervised learning, an AI is limited by the ceiling of human demonstrations: it can only mimic what human annotators have already written, labeled, or drawn. It is an interpolator of historical human artifacts.

In reinforcement learning inside simulated worlds, the constraint of human imitation is permanently shattered:
1. **Self-Play and Open-Ended Discovery:** By playing millions of games against itself (as in AlphaZero and MuZero), an agent discovers strategies, opening theories, and conceptual maneuvers that no human conceived in 3,000 years of civilization.
2. **First-Principles Grounding:** Through physical simulators (Isaac Gym, MuJoCo), an agent interacts directly with the immutable physical laws of mathematics, gravity, torque, and inertia. It builds grounded causal models of how action produces consequence.
3. **The Crucible of Agency:** An agent is not a passive text generator; it is an active decision-maker that formulates intent, acts in the world, receives feedback, updates its internal models, and perseveres across long horizons.

By mastering the mathematical foundations of probability, neural autograd, Markov decision dynamics, policy gradients, and world models, you have acquired the sovereign architectural blueprint of artificial agency.

```
                             THE SOVEREIGN AGENT
                             
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚   PERCEPTUAL SENSORS    â”‚
                         â”‚   Vision / State Tokens â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                      â”‚
                                      â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚   LATENT WORLD MODEL    â”‚ â—„â”€â”€ Dreams, Plans, Counterfactuals
                         â”‚   MuZero / Dreamer RSSM â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                      â”‚
                                      â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚    ACTOR / CONTROLLER   â”‚ â—„â”€â”€ Proximal Trust Regions (PPO)
                         â”‚    Optimal Action Execution
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                      â”‚
                                      â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚  PHYSICAL / SIM UNIVERSEâ”‚ â”€â”€â–º Ground Truth Feedback
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

