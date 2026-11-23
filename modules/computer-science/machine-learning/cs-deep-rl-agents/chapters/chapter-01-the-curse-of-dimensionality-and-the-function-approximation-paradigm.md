# Chapter 1: The Curse of Dimensionality & The Function Approximation Paradigm

---

## 1.1 The Collapse of the Tabular Realm

In the preceding treatise (*Markov Decision Processes, Bellman Optimality, and Value Iteration*), we established the foundational mathematics of reinforcement learning under a comforting structural assumption: **the Tabular Assumption**. 

Under this assumption, every state $s \in \mathcal{S}$ and state-action pair $(s, a) \in \mathcal{S} \times \mathcal{A}$ is allocated a distinct, private entry in a discrete memory array:
- A state-value table $V[s]$ storing a single floating-point number per state.
- An action-value table $Q[s, a]$ storing $|\mathcal{A}|$ floating-point numbers per state.

When updating table entry $Q[s, a]$, the value of that specific cell shifts while leaving every other cell in the universe completely untouched. In small, toy environments—a $4 \times 4$ gridworld, an 11-cell cliff walk, or a 100-state casino blackjack game—this tabular separation is both computationally tractable and theoretically pristine.

```
                          THE COLLAPSE OF THE TABULAR MATRIX
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
 ┌───────────────────────┐                                   ┌───────────────────────┐
 │   TABULAR PARADIGM    │                                   │ FUNCTION APPROXIMATION│
 ├───────────────────────┤                                   ├───────────────────────┤
 │ • 1 slot per state    │                                   │ • Weight vector w ∈ R^d│
 │ • Independent updates │        ════════════════►          │ • Parameter sharing   │
 │ • Zero generalization │     Exponential Explosion         │ • Global inductive    │
 │ • Memory: O(|S| · |A|)│          |S| ~ k^d                │   generalization      │
 └───────────────────────┘                                   └───────────────────────┘
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
                                          │
                            Raw Environmental State s ∈ S
                                          │
                                          ▼ Feature Extractor
                             Feature Vector x(s) ∈ R^d
                                          │
                                          ▼ Inner Product / Deep Network
                            Parameter Weights w ∈ R^d or θ
                                          │
                                          ▼
                            Scalar Value Estimate v^(s, w) ≈ v_π(s)
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
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
 ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
 │   POLYNOMIAL BASES    │     │ RADIAL BASIS FUNCTIONS│     │      TILE CODING      │
 ├───────────────────────┤     ├───────────────────────┤     ├───────────────────────┤
 │ x(s) = [1, s, s^2, ..]│     │ Gaussian receptive    │     │ Multiple overlapping  │
 │ Smooth global curves; │     │ fields centered at μ_i│     │ binary grids; sparse, │
 │ unstable at boundaries│     │ Localized bell curves │     │ blazing fast bitmasks │
 └───────────────────────┘     └───────────────────────┘     └───────────────────────┘
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
