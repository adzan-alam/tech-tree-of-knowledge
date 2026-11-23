# Chapter 11: Model-Based Deep RL: World Models, Dreamer, and MuZero

---

## 11.1 The Model-Free vs Model-Based Dichotomy

Across the preceding ten chapters, every algorithm we investigated—DQN, Double DQN, Dueling DQN, REINFORCE, A2C, TD3, TRPO, and PPO—belonged to the **Model-Free Reinforcement Learning** paradigm.

In model-free RL, the agent treats the physical environment as an impenetrable black box. It observes raw states $s_t$, executes actions $a_t$, observes rewards $r_{t+1}$ and next states $s_{t+1}$, and maps these experiences directly into value functions $Q(s, a)$ or policies $\pi(a \mid s)$. The agent never attempts to build an explicit internal predictive simulation of how the universe behaves.

```
                      MODEL-FREE VS MODEL-BASED PARADIGMS
                      
   MODEL-FREE RL:
   State s ────► [ Neural Policy π_θ(a|s) ] ────► Action a
   (Learns reflexive stimulus-response; requires millions of real environment interactions)
   
   MODEL-BASED RL:
   State s ────► [ Internal World Model ] ────► Latent Simulation / Mental Planning ────► Action a
                 • Representation: s_t = h(o_t)
                 • Dynamics: s_{t+1}, r_{t+1} = g(s_t, a_t)
                 • Prediction: p_t, v_t = f(s_t)
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
                                               │
                                               ▼
                              ┌─────────────────────────────────┐
                              │     VISION MODEL (V) - VAE      │
                              │     Encodes frame into latent   │
                              │     vector z_t ∈ R^32           │
                              └────────────────┬────────────────┘
                                               │ Latent Vector z_t
                                               ▼
     ┌────────────────────────┐      ┌─────────────────────────┐
     │   CONTROLLER (C)       │ ◄────┤   MEMORY RNN (M)        │
     │   Action a_t = W [z, h]│      │   MDN-RNN Predictive    │
     └───────────┬────────────┘      │   Dynamics P(z_{t+1}|·) │
                 │ Action a_t        └─────────▲───────────────┘
                 │                             │
                 └─────────────────────────────┘ (Feeds Action into RNN)
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
   • Clouds drifting in the sky          • 3-pixel traffic light turning red
   • Shadows of roadside leaves          • 10-pixel patch of black ice
   ─────────────────────────────         ──────────────────────────────────
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
                           
   1. REPRESENTATION FUNCTION h_θ:
      Maps observation history to initial latent state:
           s^0 = h_θ(o_1, o_2, ..., o_t)
           
   2. DYNAMICS FUNCTION g_θ:
      Rolls latent state forward conditioned on action:
           r^k, s^k = g_θ(s^{k-1}, a^k)
           (Predicts reward r^k and abstract next state s^k)
           
   3. PREDICTION FUNCTION f_θ:
      Evaluates latent state for policy and value:
           p^k, v^k = f_θ(s^k)
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
                         
                                  ( s^0 )  ◄── Initial State from h_θ(o_t)
                                 /       \
                             a_1/         \a_2
                               /           \
                           ( s^1 )       ( s^1 )   ◄── Generated by g_θ(s^0, a)
                          r_1, p, v     r_2, p, v  ◄── Evaluated by f_θ(s^1)
                          /       \
                      a_1/         \a_2
                        ▼           ▼
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

In continuous physical environments and robotics, Hafner et al. (2020–2023) developed the **Dreamer** family of model-based algorithms (DreamerV1, DreamerV2, DreamerV3).

Dreamer builds world models using the **Recurrent State-Space Model (RSSM)**, which splits the latent state into a deterministic recurrent path and a stochastic state path:
$$s_t = (h_t, z_t)$$
- Deterministic path: $h_t = \text{GRU}(h_{t-1}, z_{t-1}, a_{t-1})$.
- Stochastic path: $z_t \sim p(z_t \mid h_t)$.

```
                           THE DREAMER RSSM ARCHITECTURE
                           
       Deterministic GRU:    h_{t-1} ──────a_{t-1}──────► h_t ──────a_t──────► h_{t+1}
                                │                          │                    │
                                ▼                          ▼                    ▼
       Stochastic Latent:    z_{t-1}                     z_t                  z_{t+1}
                                │                          │                    │
                                └────────────┬─────────────┴────────────────────┘
                                             │
                                             ▼ Decoder Heads
                                ┌─────────────────────────┐
                                │ Reward Head: r_t ~ p(r) │
                                │ Contin. Head: c_t ~ p(c)│
                                │ Actor Head: a_t ~ π(a)  │
                                │ Critic Head: v_t ~ V(s) │
                                └─────────────────────────┘
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
In standard VAEs, the decoder attempts to reconstruct $X$ from $Z$. To achieve low reconstruction loss, mutual information $I(X; Z)$ must be maximized—forcing $Z$ to capture all visual details (background colors, cloud textures, irrelevant lighting shifts).
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
Because compounding error grows exponentially ($\mathcal{O}(L^H)$), purely ungrounded latent imagination rapidly descends into hallucination. A world model cannot plan over infinite horizons purely by physics simulation; it must terminate imagination at a modest horizon $H$ (e.g. 5–15 steps) and bootstrap with a learned value function $v(s_H)$.

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
