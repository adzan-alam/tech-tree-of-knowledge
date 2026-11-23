# Chapter 5: Advanced Value-Based Architectures: Double DQN, Dueling DQN, and Prioritized Replay

---

## 5.1 Maximization Bias and the Overestimation Phenomenon

In the preceding chapters, we examined the foundational mechanics of Deep Q-Networks (DQN). While DQN achieved superhuman performance across classic video games, deeper empirical and theoretical scrutiny revealed a pernicious vulnerability inherent to Q-learning: **systematic value overestimation**.

Recall the standard Q-learning target:
$$Y^{\text{Target}} = R_{t+1} + \gamma \max_{a' \in \mathcal{A}} Q(S_{t+1}, a'; \boldsymbol{\theta})$$

The maximization operator $\max_{a'} Q(S_{t+1}, a')$ uses the same parameter vector $\boldsymbol{\theta}$ to **select** the greedy action and to **evaluate** the value of that action.

```
                      THE MAXIMIZATION BIAS MECHANISM
                      
   True Values Q*(s, a)              Noisy Estimates Q(s, a; θ) = Q* + ε
   
   Action 1: [ 10.0 ]                Action 1: [ 10.0 + 1.5 = 11.5 ]  ◄── max picks this!
   Action 2: [ 10.0 ]                Action 2: [ 10.0 - 0.8 =  9.2 ]
   Action 3: [ 10.0 ]                Action 3: [ 10.0 + 0.3 = 10.3 ]
   Action 4: [ 10.0 ]                Action 4: [ 10.0 - 1.2 =  8.8 ]
   ─────────────────                 ───────────────────────────────
   max_a Q*(s, a) = 10.0             max_a Q(s, a; θ) = 11.5  (Overestimation = +1.5)
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
the overestimation is not self-correcting—it compounds recursively across Bellman updates:
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
   Target = r + γ · Q( s', argmax_{a'} Q(s', a'; θ^-) ; θ^- )
                      ▲                                 ▲
                      └──────── Target Network ─────────┘
                      (Selection AND Evaluation coupled in θ^-)
   
   DOUBLE DQN:
   Target = r + γ · Q( s', argmax_{a'} Q(s', a'; θ_t) ; θ_t^- )
                      ▲                           ▲       ▲
                      │                           │       Target Network (Evaluation)
                      │                           Online Network (Selection)
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
                                        │
                                        ▼
                             Convolutional Encoder
                                  (Shared ϕ)
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
             Value Stream                           Advantage Stream
            FC Layers (512)                         FC Layers (512)
                    │                                       │
                    ▼                                       ▼
            Scalar Value V(s; α)                 Advantage Vector A(s, a; β)
             Dimension: 1x1                           Dimension: 1x|A|
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        │
                                        ▼ Aggregation Layer
                     Q(s, a; α, β) = V(s; α) + [ A(s, a; β) - (1/|A|) ∑ A(s, a'; β) ]
                                        │
                                        ▼
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

However, not all transitions are created equal. An agent playing Atari may spend millions of frames in repetitive, uneventful corridors where the TD error $\delta \approx 0$. Meanwhile, rare, game-changing events—such as discovering a key, losing a life, or completing a level—generate massive TD errors ($|\delta| \gg 0$). 

Uniform sampling wastes the vast majority of computation performing gradient steps on already mastered, zero-error transitions. Schaul et al. (2015) introduced **Prioritized Experience Replay (PER)** to prioritize sampling transitions from which the agent has the most to learn.

```
                      PRIORITIZED SAMPLING VS UNIFORM
                      
   Uniform Replay:            [ e_1 ] [ e_2 ] [ e_3 ] [ e_4 ] [ e_5 ]  (All prob = 1/N)
   
   Prioritized Replay:        [ e_1 ] [ e_2 ] [ e_3 ] [ e_4 ] [ e_5 ]
   Priority p_i = |δ_i|^α:     0.01    14.2    0.02    0.00    8.91
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
    tree[k] += Δ
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
