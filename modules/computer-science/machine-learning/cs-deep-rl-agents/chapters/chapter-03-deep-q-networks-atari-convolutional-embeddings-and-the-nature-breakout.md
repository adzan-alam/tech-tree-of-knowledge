# Chapter 3: Deep Q-Networks (DQN): Atari, Convolutional Embeddings, and the Nature Breakout

---

## 3.1 The Watershed Moment in Artificial Intelligence

In February 2015, the front cover of the prestigious scientific journal *Nature* featured an image of a simulated spacecraft navigating an 8-bit digital landscape beneath the headline: **"Human-level control through deep reinforcement learning."**

```
                 THE EVOLUTION OF SENSORY CONTROL IN AI
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────┐                         ┌───────────────────────┐
│ CLASSICAL ENGINEERING │                         │     DEEP Q-NETWORK    │
├───────────────────────┤                         ├───────────────────────┤
│ • Handcrafted features│                         │ • Raw visual pixels   │
│ • Coordinate vectors  │      ═════════►         │ • End-to-end learning │
│ • Specific to 1 task  │                         │ • Single architecture │
│ • Fragile heuristics  │                         │ • 49 Atari games      │
└───────────────────────┘                         └───────────────────────┘
```

The landmark paper by Volodymyr Mnih and his colleagues at DeepMind (Mnih et al., 2013, 2015) marked a historic watershed in computational intelligence. For the first time in history, a single artificial agent—the **Deep Q-Network (DQN)**—learned to master a diverse suite of 49 distinct Atari 2600 video games (including *Breakout*, *Pong*, *Space Invaders*, and *Seaquest*) using:
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
                                         │
                        Raw Atari Frame (210 x 160 x 3 RGB)
                                         │
                                         ▼ 1. Luminance Conversion
                            Grayscale Image (210 x 160)
                                         │
                                         ▼ 2. Bilinear Downsampling
                             Cropped / Scaled (84 x 84)
                                         │
                                         ▼ 3. Max-Pooling over Consec Frames
                               Removes 30 Hz Sprite Flicker
                                         │
                                         ▼ 4. Temporal Stacking (k = 4)
                        Input State Tensor s_t: (84 x 84 x 4)
```

### 1. Luminance Conversion
The raw RGB color image is converted to a single 8-bit grayscale channel using standard luminance weights:
$$Y = 0.299 R + 0.587 G + 0.114 B \in [0, 255]$$

### 2. Bilinear Downsampling and Cropping
The grayscale image is rescaled and cropped to an $84 \times 84$ square matrix. This reduces the raw input dimensionality from $100,800$ floats to $7,056$ bytes—a **$14\times$ reduction in computational burden**.

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
                                        │
                         Input: 84 x 84 x 4 Image Tensor
                                        │
                                        ▼ Conv 1: 32 filters, 8x8, stride 4, ReLU
                               Output: 20 x 20 x 32
                                        │
                                        ▼ Conv 2: 64 filters, 4x4, stride 2, ReLU
                               Output: 9 x 9 x 64
                                        │
                                        ▼ Conv 3: 64 filters, 3x3, stride 1, ReLU
                               Output: 7 x 7 x 64
                                        │
                                        ▼ Flatten: 7 x 7 x 64 = 3,136 units
                               Dense FC1: 512 units, ReLU
                                        │
                                        ▼ Linear Output Layer
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
               Loss L(δ)                                Gradient dL/dδ
             ▲                                         ▲
             │          MSE: δ^2                       │               MSE: δ
             │         /        \                      │              /
             │        /          \                   1 ├─────────────┘ Huber: ±1
             │       /  Huber     \                    │            /
             │      /    Loss      \                   │           /
             │     /                \                  │          /
             └────┴──────┬─────┬─────┴──► δ            └─────────┼───────────► δ
                        -1     1                                 │
                                                      -1 ├───────┘
                                                         │
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
