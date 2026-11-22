# Chapter 11: Convolutional Foundations for Spatial and Visual Simulators

> *"In the visual cortex of the cat, we found that individual neurons do not look at the world at large; they respond only to tiny local receptive fields, firing when edges of specific orientations appear. Structure in the physical universe is local and translation-invariant: an edge remains an edge whether it appears in the upper-left or bottom-right of the eye."*  
> — **David H. Hubel & Torsten N. Wiesel**, *Receptive Fields of Single Neurones in the Cat's Striate Cortex* (1959)

---

## 11.1 The Curse of Dimensionality in Spatial / Visual Inputs

When applying standard Multi-Layer Perceptrons to high-dimensional grid structures—such as camera image feeds, physics simulation fields, or 2D grid worlds in reinforcement learning—fully connected architectures suffer an immediate, catastrophic breakdown.

### 11.1.1 The Parameter Explosion of Dense Layers

Consider a modest digital image of size $224 \times 224$ pixels with 3 RGB color channels. Flattening this input tensor into a 1D vector produces:
$$
d_0 = 224 \times 224 \times 3 = 150,528 \text{ input scalar features}
$$

If we connect this input vector to a single dense hidden layer containing $d_1 = 4,096$ neurons:
$$
\text{Parameters} = d_0 \times d_1 = 150,528 \times 4,096 = 616,562,688 \text{ weights}
$$
A single weight matrix requires over **616 million parameters** ($\approx 2.47 \text{ GB}$ of memory in FP32)!  
Such an enormous parameter footprint:
1. Exceeds hardware memory caches.
2. Incurs prohibitive computational FLOP costs.
3. Overfits training sets catastrophically, requiring trillions of training images to constrain.

```
       Fully Connected MLP vs. Convolutional Receptive Field
       
    Fully Connected Layer (Every input connects to every output):
    Input Pixels:    [x1]  [x2]  [x3]  [x4]  [x5]  ...  [xN]
                       \    /     \    /     \    /
                        \  /       \  /       \  /
    Output Units:       [h1]       [h2]       [h3]
    (O(N * M) parameters -- No spatial locality!)
    
    Convolutional Layer (Local Receptive Fields + Shared Kernel Weights):
    Input Pixels:    [x1]  [x2]  [x3]  [x4]  [x5]  ...  [xN]
                      \  /  /     \  /  /     \  /  /
                       \ | /       \ | /       \ | /
    Shared Kernel:    [ k ]       [ k ]       [ k ]  <-- Same weights w1, w2, w3!
    Output Units:     [h1]        [h2]        [h3]
    (O(k) parameters -- Strict spatial locality and translation equivariance!)
```

### 11.1.2 The Absence of Geometric Inductive Bias

Beyond parameter explosion, MLPs are mathematically blind to spatial geometry:
- If we randomly permute all $150,528$ pixel indices using a fixed random permutation $\pi$, an MLP learns with the exact same difficulty and convergence rate!
- Pixels that are physically adjacent (such as $(x, y)$ and $(x+1, y)$) share no structural bias over pixels separated by hundreds of centimeters.
- **Translation Sensitivity:** If an object (e.g., an agent or a ball) shifts by 2 pixels to the right, every single coordinate in the input vector changes. An MLP must learn to recognize the object independently at every possible spatial location, requiring astronomical amounts of redundant training data.

---

## 11.2 Biological and Geometric Inductive Biases

To process visual and spatial simulation data efficiently, we embed two fundamental geometric inductive biases into the neural architecture: **local receptive fields** and **translation equivariance**.

### 11.2.1 Hubel & Wiesel: The Neurophysiological Inspiration

In their Nobel Prize-winning investigations of the mammalian primary visual cortex (V1), neurobiologists David Hubel and Torsten Wiesel (1959, 1962) revealed that the mammalian visual system is organized hierarchically:
1. **Simple Cells:** Respond to localized spatial stimuli (oriented edges, bars, slits) restricted to a tiny, localized patch of the retina called the **receptive field**.
2. **Complex Cells:** Aggregate the outputs of multiple simple cells, responding to oriented edges with partial **translation invariance** (firing regardless of slight position shifts within the receptive field).
3. **Hypercomplex Cells:** Aggregate complex cells to detect corners, line terminations, and complex compositional shapes.

### 11.2.2 Mathematical Translation Equivariance

Let $\mathcal{X}$ denote the space of 2D images $\mathbf{I}: \mathbb{Z}^2 \to \mathbb{R}$.  
Define the **translation operator** $\mathbf{T}_{(\Delta u, \Delta v)}$ that shifts an image spatially by vector $(\Delta u, \Delta v) \in \mathbb{Z}^2$:
$$
(\mathbf{T}_{(\Delta u, \Delta v)} \mathbf{I})(x, y) = \mathbf{I}(x - \Delta u, \; y - \Delta v)
$$

A mathematical operator $\Phi: \mathcal{X} \to \mathcal{X}$ is defined to be **translation equivariant** if shifting the input image prior to transformation produces the exact same result as transforming the input and shifting the output:
$$
\Phi(\mathbf{T}_{(\Delta u, \Delta v)} \mathbf{I}) = \mathbf{T}_{(\Delta u, \Delta v)} (\Phi(\mathbf{I})) \quad \forall (\Delta u, \Delta v)
$$

By enforcing weight sharing across spatial coordinates, **convolutional layers are mathematically equivariant to translation**. If an agent or vehicle moves across the screen in a visual simulator, its feature activations translate across the feature map by the exact same displacement, without altering the detected features.

---

## 11.3 2D Convolution and Cross-Correlation Mathematics

In computational machine learning, the operation universally referred to as "convolution" is technically **spatial cross-correlation** (the convolution kernel is not mirrored prior to sliding, which is mathematically equivalent since kernel weights are learned from data).

```
         2D Cross-Correlation Sliding Window over an Input Feature Map
         
         Input Image (5x5):                Kernel (3x3):
         +---+---+---+---+---+             +---+---+---+
         | 1 | 2 | 0 | 1 | 1 |             | 1 | 0 |-1 |
         +---+---+---+---+---+             +---+---+---+
         | 0 | 1 | 2 | 3 | 1 |             | 1 | 0 |-1 |
         +---+---+---+---+---+             +---+---+---+
         | 1 | 0 | 1 | 2 | 0 |             | 1 | 0 |-1 |
         +---+---+---+---+---+             +---+---+---+
         | 2 | 1 | 0 | 1 | 2 |
         +---+---+---+---+---+             Output Feature Map (3x3):
         | 1 | 1 | 2 | 0 | 1 |             [  *   *   *  ]
         +---+---+---+---+---+             [  *   *   *  ]
                                           [  *   *   *  ]
```

### 11.3.1 Mathematical Formulation for Multi-Channel Tensors

Let the input tensor be $\mathbf{X} \in \mathbb{R}^{C_{\text{in}} \times H_{\text{in}} \times W_{\text{in}}}$ with $C_{\text{in}}$ channels, height $H_{\text{in}}$, and width $W_{\text{in}}$.  
The convolutional layer contains $C_{\text{out}}$ distinct filter kernels. Each filter $k \in \{1, \dots, C_{\text{out}}\}$ is represented as a 3D weight tensor $\mathbf{K}^{(k)} \in \mathbb{R}^{C_{\text{in}} \times k_H \times k_W}$ and a scalar bias $b_k$.

The pre-activation at output spatial coordinate $(i, j)$ for feature map $k$ is computed as:
$$
Z_{k, i, j} = b_k + \sum_{c=1}^{C_{\text{in}}} \sum_{m=-k_H/2}^{k_H/2} \sum_{n=-k_W/2}^{k_W/2} X_{c, \; i \cdot S + m, \; j \cdot S + n} \cdot K_{c, m, n}^{(k)}
$$
where $S \ge 1$ is the **stride**.

### 11.3.2 Spatial Output Dimensions

For an input spatial dimension $H_{\text{in}}$, kernel size $k_H$, padding $P_H$ (applied symmetrically to both borders), and stride $S_H$:
$$
H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - k_H + 2 P_H}{S_H} \right\rfloor + 1
$$
$$
W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - k_W + 2 P_W}{S_W} \right\rfloor + 1
$$

#### Standard Padding Modes:
1. **Valid Padding ($P = 0$):** No padding applied. Output shrinks: $H_{\text{out}} = H_{\text{in}} - k + 1$.
2. **Same Padding:** Zero-padding is chosen such that output spatial dimensions equal input dimensions when stride $S = 1$:
   $$
   H_{\text{out}} = H_{\text{in}} \iff 2 P = k - 1 \implies P = \frac{k - 1}{2}
   $$
   (Requires an odd kernel size, e.g., $k = 3 \implies P = 1$; $k = 5 \implies P = 2$).
3. **Full Padding ($P = k - 1$):** Output expands to $H_{\text{in}} + k - 1$.

---

### 11.3.3 Dilated (Atrous) Convolutions

Introduced to deep learning by Yu & Koltun (2015), **Dilated Convolutions** introduce spaces (holes) between kernel elements, parameterized by a dilation rate $d \ge 1$.

```
       Standard vs. Dilated (Atrous) Kernel Receptive Footprints
       
       Standard Kernel (d = 1):          Dilated Kernel (d = 2, holes = 1):
       3x3 Footprint (Receptive: 3)      3x3 Kernel spanning 5x5 Footprint!
       +---+---+---+                     +---+---+---+---+---+
       | * | * | * |                     | * | . | * | . | * |
       +---+---+---+                     +---+---+---+---+---+
       | * | * | * |                     | . | . | . | . | . |
       +---+---+---+                     +---+---+---+---+---+
       | * | * | * |                     | * | . | * | . | * |
       +---+---+---+                     +---+---+---+---+---+
                                         | . | . | . | . | . |
                                         +---+---+---+---+---+
                                         | * | . | * | . | * |
                                         +---+---+---+---+---+
```

The effective spatial kernel size of a dilated filter with base size $k$ and dilation rate $d$ is:
$$
k_{\text{eff}} = k + (k - 1)(d - 1) = d(k - 1) + 1
$$

#### Key Advantage:
Dilation expands the receptive field **exponentially** with depth without increasing the number of trainable parameters or FLOPs, which is critical for semantic segmentation and audio synthesis (WaveNet).

---

### 11.3.4 Receptive Field Growth Formula

The **receptive field** $\text{RF}_l$ of a neuron in layer $l$ is the spatial extent in the original input image $\mathbf{X}_0$ that contributes to its activation.

Let layer $l$ have kernel size $k_l$ and stride $S_l$. The receptive field recurrence is:
$$
\text{RF}_l = \text{RF}_{l-1} + (k_l - 1) \cdot J_{l-1}
$$
where $J_{l-1} = \prod_{i=1}^{l-1} S_i$ is the cumulative stride (jump) of preceding layers, with base conditions $\text{RF}_0 = 1$ and $J_0 = 1$.

---

## 11.4 Pooling Dynamics and Global Average Pooling (GAP)

Downsampling spatial dimensions is essential to reduce computational burden and achieve true **translation invariance** (insensitivity to minor translations).

```
       2D Max Pooling Operator (2x2 Window, Stride 2)
       
       Input Feature Map:                Max-Pooled Output:
       +----+----+----+----+             +----+----+
       | 12 | 20 | 30 | 0  |             | 20 | 30 |
       +----+----+----+----+             +----+----+
       | 8  | 12 | 2  | 14 |    ====>    | 112| 37 |
       +----+----+----+----+             +----+----+
       | 34 | 70 | 37 | 4  |
       +----+----+----+----+
       | 112| 9  | 25 | 12 |
       +----+----+----+----+
```

### 11.4.1 Max Pooling vs. Average Pooling

1. **Max Pooling:** Selects the maximum activation within a spatial window:
   $$
   Y_{i, j} = \max_{m, n \in [0, k-1]} X_{i \cdot S + m, \; j \cdot S + n}
   $$
   Preserves dominant features (e.g., strong edge detections) while discarding spatial noise.
2. **Average Pooling:** Computes the arithmetic mean over the window:
   $$
   Y_{i, j} = \frac{1}{k^2} \sum_{m=0}^{k-1} \sum_{n=0}^{k-1} X_{i \cdot S + m, \; j \cdot S + n}
   $$
   Acts as a spatial low-pass smoothing filter.

### 11.4.2 Global Average Pooling (GAP) (Lin, Chen, & Yan, 2013)

In early CNNs (AlexNet, VGG), the final convolutional feature maps were flattened and passed through massive fully connected dense layers. In VGG-16, flattening a $7 \times 7 \times 512$ feature map into a 4,096-neuron dense layer consumed $102,760,448$ weights—accounting for over **$74\%$ of the network's entire parameter budget**!

In *Network In Network*, Min Lin, Qiang Chen, and Shuicheng Yan replaced fully connected layers with **Global Average Pooling (GAP)**:
- The final convolutional layer outputs $C$ feature maps, where $C$ is set identically to the number of target classes (e.g., $C = 1000$ for ImageNet).
- GAP averages each feature map across its entire spatial dimensions $(H, W)$ to produce a single scalar:
  $$
  y_c = \frac{1}{H \times W} \sum_{i=1}^H \sum_{j=1}^W X_{c, i, j} \quad (c = 1, \dots, C)
  $$
- The vector $\mathbf{y} \in \mathbb{R}^C$ is fed directly into Softmax!

#### Transformative Impact:
1. **Zero Trainable Parameters:** GAP contains no weights, eliminating millions of parameters.
2. **Overfitting Elimination:** Acts as an extreme structural regularizer.
3. **Variable Input Resolution:** Networks with GAP can accept arbitrary image dimensions $(H, W)$ during inference without shape mismatch errors.

---

## 11.5 The Convolutional Backward Pass

Backpropagating through a convolutional layer requires deriving gradients with respect to both the kernel weights $\mathbf{K}$ and the input feature map $\mathbf{X}$.

```
       Convolutional Backward Pass: Duality with Flipped Kernels
       
     Forward:   Output Z = Input X (valid conv) Kernel K
     
     Backward:  \nabla_K L = Input X (valid conv) Downstream Adjoint \Delta
                \nabla_X L = Downstream Adjoint \Delta (full conv) Kernel K_rot180
```

### 11.5.1 Gradient with Respect to Kernel Weights ($\frac{\partial \mathcal{L}}{\partial \mathbf{K}}$)

Let the downstream incoming error adjoint be $\boldsymbol{\Delta} \equiv \frac{\partial \mathcal{L}}{\partial \mathbf{Z}} \in \mathbb{R}^{C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}}$.  
By the multilinear chain rule, the gradient with respect to kernel weight $K_{c, m, n}^{(k)}$ is:
$$
\frac{\partial \mathcal{L}}{\partial K_{c, m, n}^{(k)}} = \sum_{i=1}^{H_{\text{out}}} \sum_{j=1}^{W_{\text{out}}} \Delta_{k, i, j} \cdot X_{c, \; i \cdot S + m, \; j \cdot S + n}
$$
This is identically a **valid cross-correlation between the input feature map $\mathbf{X}_c$ and the error adjoint tensor $\boldsymbol{\Delta}_k$**!

### 11.5.2 Gradient with Respect to Input Activations ($\frac{\partial \mathcal{L}}{\partial \mathbf{X}}$)

To compute $\bar{X}_{c, x, y} \equiv \frac{\partial \mathcal{L}}{\partial X_{c, x, y}}$, we collect all output locations $(i, j)$ where $X_{c, x, y}$ contributed in the forward pass:
$$
\frac{\partial \mathcal{L}}{\partial X_{c, x, y}} = \sum_{k=1}^{C_{\text{out}}} \sum_{m} \sum_{n} \Delta_{k, \; x - m, \; y - n} \cdot K_{c, m, n}^{(k)}
$$

Notice the index reflection $x - m, y - n$.  
Let $\mathbf{K}_{\text{rot180}}$ denote the kernel **spatially flipped by 180 degrees** (rotated upside-down and left-to-right):
$$
(K_{\text{rot180}})_{m, n} = K_{-m, -n}
$$
Then the gradient with respect to input $\mathbf{X}$ is computed as:
$$
\frac{\partial \mathcal{L}}{\partial \mathbf{X}} = \sum_{k=1}^{C_{\text{out}}} \boldsymbol{\Delta}_k \star_{\text{full}} \mathbf{K}_{c, \text{rot180}}^{(k)}
$$
The backward pass with respect to input is a **full convolution of the adjoint with the 180-degree rotated filter kernel**.

---

## 11.6 Exactly 10 Worked Examples

### Example 11.1: Parameter Count and FLOP Comparison: Dense MLP vs. Conv2D
**Problem Statement:**  
An input image has shape $(C_{\text{in}}, H, W) = (3, 64, 64)$.  
Layer 1 must produce a representation with 32 output channels of the same spatial size $(32, 64, 64)$.  
Compare:
1. A fully connected dense layer connecting flattened input to flattened output.
2. A Conv2D layer with $3 \times 3$ filters, stride 1, and padding 1.
Compute trainable parameters and forward FLOPs for both.

**Step-by-Step Solution:**  
1. **Fully Connected MLP Option:**
   - Input dimension: $d_{\text{in}} = 3 \times 64 \times 64 = 12,288$.
   - Output dimension: $d_{\text{out}} = 32 \times 64 \times 64 = 131,072$.
   - Trainable parameters:
     $$
     P_{\text{MLP}} = (12,288 \times 131,072) + 131,072 = 1,610,612,736 + 131,072 \approx 1.611 \times 10^9 \text{ parameters}
     $$
     (Over $1.61$ billion parameters!).
   - FLOPs: $2 \times d_{\text{in}} \times d_{\text{out}} \approx 3.22 \times 10^9 \text{ FLOPs} = 3.22 \text{ GFLOPs}$.

2. **Conv2D Layer Option ($k = 3, C_{\text{in}} = 3, C_{\text{out}} = 32$):**
   - Trainable parameters:
     $$
     P_{\text{conv}} = (C_{\text{out}} \times C_{\text{in}} \times k \times k) + C_{\text{out}} = (32 \times 3 \times 3 \times 3) + 32 = 864 + 32 = 896 \text{ parameters}
     $$
   - Forward FLOPs:
     For each of the $H \times W = 64 \times 64 = 4096$ output spatial positions, compute a 3D dot product of size $3 \times 3 \times 3 = 27$ multiplies + additions ($54$ FLOPs) across 32 filters:
     $$
     \text{FLOPs}_{\text{conv}} = 2 \times H_{\text{out}} \times W_{\text{out}} \times (C_{\text{in}} \cdot k^2) \times C_{\text{out}} = 2 \times 4096 \times 27 \times 32 = 7,077,888 \text{ FLOPs} \approx 7.08 \text{ MFLOPs}
     $$

3. **Comparison:**
   $$
   \frac{P_{\text{MLP}}}{P_{\text{conv}}} = \frac{1,610,743,808}{896} \approx 1,797,705\times \text{ parameter reduction!}
   $$
   $$
   \frac{\text{FLOPs}_{\text{MLP}}}{\text{FLOPs}_{\text{conv}}} = \frac{3,221,225,472}{7,077,888} \approx 455\times \text{ FLOP reduction!}
   $$

---

### Example 11.2: Step-by-Step 2D Convolution Numerical Trace
**Problem Statement:**  
Let single-channel input $\mathbf{X}$ and kernel $\mathbf{K}$ be:
$$
\mathbf{X} = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 2 \\ 2 & 0 & 1 \end{bmatrix}, \quad \mathbf{K} = \begin{bmatrix} 1 & -1 \\ 0 & 2 \end{bmatrix}, \quad b = -1.0
$$
Compute the valid cross-correlation output $\mathbf{Z} = \mathbf{X} \star \mathbf{K} + b$ (stride $S = 1$, padding $P = 0$).

**Step-by-Step Solution:**  
1. **Output Shape:**
   $H_{\text{out}} = 3 - 2 + 1 = 2$. Output matrix is $2 \times 2$.

2. **Compute Coordinate $(0, 0)$ (Top-Left Patch):**
   Patch: $\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$.
   $$
   Z_{0, 0} = (1)(1) + (2)(-1) + (0)(0) + (1)(2) + b = (1 - 2 + 0 + 2) - 1.0 = 1 - 1.0 = 0.0
   $$

3. **Compute Coordinate $(0, 1)$ (Top-Right Patch):**
   Patch: $\begin{bmatrix} 2 & 3 \\ 1 & 2 \end{bmatrix}$.
   $$
   Z_{0, 1} = (2)(1) + (3)(-1) + (1)(0) + (2)(2) + b = (2 - 3 + 0 + 4) - 1.0 = 3 - 1.0 = 2.0
   $$

4. **Compute Coordinate $(1, 0)$ (Bottom-Left Patch):**
   Patch: $\begin{bmatrix} 0 & 1 \\ 2 & 0 \end{bmatrix}$.
   $$
   Z_{1, 0} = (0)(1) + (1)(-1) + (2)(0) + (0)(2) + b = (0 - 1 + 0 + 0) - 1.0 = -1 - 1.0 = -2.0
   $$

5. **Compute Coordinate $(1, 1)$ (Bottom-Right Patch):**
   Patch: $\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$.
   $$
   Z_{1, 1} = (1)(1) + (2)(-1) + (0)(0) + (1)(2) + b = (1 - 2 + 0 + 2) - 1.0 = 0.0
   $$

Output:
$$
\mathbf{Z} = \begin{bmatrix} 0.0 & 2.0 \\ -2.0 & 0.0 \end{bmatrix}
$$

---

### Example 11.3: Spatial Output Dimension Calculation
**Problem Statement:**  
An input volume has shape $(C, H, W) = (64, 112, 112)$.  
Compute the output spatial dimensions $(H_{\text{out}}, W_{\text{out}})$ for:
1. Kernel size $k = 7$, padding $P = 3$, stride $S = 2$.
2. Kernel size $k = 3$, padding $P = 0$ (valid), stride $S = 1$.
3. Kernel size $k = 3$, padding $P = 1$ (same), stride $S = 2$.

**Step-by-Step Solution:**  
Using $H_{\text{out}} = \lfloor \frac{H_{\text{in}} - k + 2P}{S} \rfloor + 1$:
1. **Case 1 ($k = 7, P = 3, S = 2$):**
   $$
   H_{\text{out}} = \left\lfloor \frac{112 - 7 + 2(3)}{2} \right\rfloor + 1 = \left\lfloor \frac{112 - 7 + 6}{2} \right\rfloor + 1 = \left\lfloor \frac{111}{2} \right\rfloor + 1 = 55 + 1 = 56
   $$
   Output: $(56, 56)$.

2. **Case 2 ($k = 3, P = 0, S = 1$):**
   $$
   H_{\text{out}} = \left\lfloor \frac{112 - 3 + 0}{1} \right\rfloor + 1 = 109 + 1 = 110
   $$
   Output: $(110, 110)$.

3. **Case 3 ($k = 3, P = 1, S = 2$):**
   $$
   H_{\text{out}} = \left\lfloor \frac{112 - 3 + 2}{2} \right\rfloor + 1 = \left\lfloor \frac{111}{2} \right\rfloor + 1 = 55 + 1 = 56
   $$
   Output: $(56, 56)$.

---

### Example 11.4: Dilated Convolution Effective Footprint and Receptive Field
**Problem Statement:**  
A $3 \times 3$ convolutional kernel ($k = 3$) has dilation rate $d = 4$.  
1. Compute the effective spatial footprint $k_{\text{eff}}$.
2. For an input of size $32 \times 32$ with padding $P = 0$ and stride $S = 1$, compute the output dimension.

**Step-by-Step Solution:**  
1. **Effective Kernel Size:**
   $$
   k_{\text{eff}} = d(k - 1) + 1 = 4(3 - 1) + 1 = 4(2) + 1 = 9
   $$
   A $3 \times 3$ kernel with dilation 4 covers a spatial window of $9 \times 9$ pixels!

2. **Output Dimension:**
   $$
   H_{\text{out}} = H_{\text{in}} - k_{\text{eff}} + 1 = 32 - 9 + 1 = 24
   $$
   Output shape: $24 \times 24$.

---

### Example 11.5: Receptive Field Calculation across a 4-Layer Hierarchy
**Problem Statement:**  
A CNN hierarchy processes images through 4 consecutive layers:
- Layer 1: Conv2D ($k_1 = 3, S_1 = 1$)
- Layer 2: MaxPool ($k_2 = 2, S_2 = 2$)
- Layer 3: Conv2D ($k_3 = 3, S_3 = 1$)
- Layer 4: Conv2D ($k_4 = 3, S_4 = 2$)
Compute the cumulative jump $J$ and receptive field $\text{RF}$ after each layer.

**Step-by-Step Solution:**  
Base conditions: $\text{RF}_0 = 1, J_0 = 1$.  
Using recurrence: $\text{RF}_l = \text{RF}_{l-1} + (k_l - 1) J_{l-1}$ and $J_l = J_{l-1} \times S_l$.

1. **Layer 1 (Conv $k=3, S=1$):**
   $$
   \text{RF}_1 = \text{RF}_0 + (k_1 - 1) J_0 = 1 + (3 - 1)(1) = 1 + 2 = 3
   $$
   $$
   J_1 = J_0 \times S_1 = 1 \times 1 = 1
   $$

2. **Layer 2 (Pool $k=2, S=2$):**
   $$
   \text{RF}_2 = \text{RF}_1 + (k_2 - 1) J_1 = 3 + (2 - 1)(1) = 3 + 1 = 4
   $$
   $$
   J_2 = J_1 \times S_2 = 1 \times 2 = 2
   $$

3. **Layer 3 (Conv $k=3, S=1$):**
   $$
   \text{RF}_3 = \text{RF}_2 + (k_3 - 1) J_2 = 4 + (3 - 1)(2) = 4 + 4 = 8
   $$
   $$
   J_3 = J_2 \times S_3 = 2 \times 1 = 2
   $$

4. **Layer 4 (Conv $k=3, S=2$):**
   $$
   \text{RF}_4 = \text{RF}_3 + (k_4 - 1) J_3 = 8 + (3 - 1)(2) = 8 + 4 = 12
   $$
   $$
   J_4 = J_3 \times S_4 = 2 \times 2 = 4
   $$

After Layer 4, each output neuron has a receptive field of $12 \times 12$ input pixels.

---

### Example 11.6: 2D Max Pooling Forward and Backward Routing
**Problem Statement:**  
Let a $2 \times 2$ patch in a feature map be $\begin{bmatrix} 3.0 & 7.0 \\ 2.0 & 5.0 \end{bmatrix}$.  
The downstream adjoint from the loss is $\bar{y} = 4.5$.  
1. Compute the forward MaxPool output.
2. Compute the subgradient vector $\bar{\mathbf{x}} \in \mathbb{R}^{2 \times 2}$.

**Step-by-Step Solution:**  
1. **Forward Pass:**
   $$
   y = \max(3.0, 7.0, 2.0, 5.0) = 7.0
   $$
   The argmax index is coordinate $(0, 1)$ (top-right).

2. **Backward Subgradient Pass:**
   The gradient flows strictly to the maximum coordinate that produced the activation:
   $$
   \frac{\partial y}{\partial x_{i, j}} = \begin{cases} 1 & \text{if } (i, j) = (0, 1) \\ 0 & \text{otherwise} \end{cases}
   $$
   Multiplying by incoming adjoint $\bar{y} = 4.5$:
   $$
   \bar{\mathbf{x}} = \begin{bmatrix} 0.0 & 4.5 \\ 0.0 & 0.0 \end{bmatrix}
   $$

---

### Example 11.7: Global Average Pooling (GAP) Dimension and Parameter Reduction
**Problem Statement:**  
A vision model has final convolutional feature map of shape $(B, C, H, W) = (32, 512, 7, 7)$ for a 10-class classification problem.  
1. Compute the parameter count if using a standard dense classifier: $\text{Flatten} \to \text{Linear}(512 \times 7 \times 7, 10)$.
2. Compute the parameter count if using $1 \times 1$ Conv to 10 channels followed by Global Average Pooling: $\text{Conv2D}(512, 10, 1 \times 1) \to \text{GAP}$.

**Step-by-Step Solution:**  
1. **Standard Flatten + Dense Classifier:**
   - Flatten dimension: $512 \times 7 \times 7 = 25,088$.
   - Dense parameters:
     $$
     P = (25,088 \times 10) + 10 = 250,880 + 10 = 250,890 \text{ parameters}
     $$

2. **$1 \times 1$ Conv + GAP:**
   - $1 \times 1$ Conv parameters:
     $$
     P = (10 \times 512 \times 1 \times 1) + 10 = 5,120 + 10 = 5,130 \text{ parameters}
     $$
   - GAP parameters: $0$ parameters.
   - Total: $5,130$ parameters.
   Savings: $\frac{250,890}{5,130} \approx 49\times$ parameter reduction.

---

### Example 11.8: Derivation of Conv2D Input Gradient via 180-Degree Flipped Kernel
**Problem Statement:**  
Let 1D input be $x = [x_1, x_2, x_3]$ and kernel be $k = [w_1, w_2]$ with valid convolution $z_1 = w_1 x_1 + w_2 x_2$ and $z_2 = w_1 x_2 + w_2 x_3$.  
Let adjoints be $\Delta_1, \Delta_2$.  
Compute $\frac{\partial \mathcal{L}}{\partial x_1}, \frac{\partial \mathcal{L}}{\partial x_2}, \frac{\partial \mathcal{L}}{\partial x_3}$ and show that this matches full convolution with flipped kernel $k_{\text{rot}} = [w_2, w_1]$.

**Step-by-Step Solution:**  
1. **Analytic Derivatives:**
   - For $x_1$: $x_1$ appears only in $z_1 \implies \bar{x}_1 = \Delta_1 \frac{\partial z_1}{\partial x_1} = \Delta_1 w_1$.
   - For $x_2$: $x_2$ appears in $z_1$ and $z_2 \implies \bar{x}_2 = \Delta_1 \frac{\partial z_1}{\partial x_2} + \Delta_2 \frac{\partial z_2}{\partial x_2} = \Delta_1 w_2 + \Delta_2 w_1$.
   - For $x_3$: $x_3$ appears only in $z_2 \implies \bar{x}_3 = \Delta_2 \frac{\partial z_2}{\partial x_3} = \Delta_2 w_2$.
   $$
   \bar{\mathbf{x}} = [\Delta_1 w_1, \; \Delta_1 w_2 + \Delta_2 w_1, \; \Delta_2 w_2]
   $$

2. **Full Convolution of $\boldsymbol{\Delta} = [\Delta_1, \Delta_2]$ with $k_{\text{rot}} = [w_2, w_1]$:**
   Pad $\boldsymbol{\Delta}$ with $k - 1 = 1$ zero on each border: $\boldsymbol{\Delta}_{\text{pad}} = [0, \Delta_1, \Delta_2, 0]$.
   - Window 1: $[0, \Delta_1] \cdot [w_2, w_1] = 0(w_2) + \Delta_1 w_1 = \Delta_1 w_1$.
   - Window 2: $[\Delta_1, \Delta_2] \cdot [w_2, w_1] = \Delta_1 w_2 + \Delta_2 w_1$.
   - Window 3: $[\Delta_2, 0] \cdot [w_2, w_1] = \Delta_2 w_2 + 0(w_1) = \Delta_2 w_2$.
   Both vectors match identically!

---

### Example 11.9: Pointwise ($1 \times 1$) Convolution as Channel Cross-Projection
**Problem Statement:**  
Explain why a $1 \times 1$ convolution on tensor $(C_{\text{in}}, H, W)$ with $C_{\text{out}}$ filters is equivalent to applying a dense linear layer $\mathbf{W} \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}}}$ independently across all $H \times W$ spatial coordinates.

**Step-by-Step Solution:**  
1. **Evaluate Conv2D Formula for $k_H = 1, k_W = 1$:**
   $$
   Z_{k, i, j} = b_k + \sum_{c=1}^{C_{\text{in}}} X_{c, i, j} K_{c, 0, 0}^{(k)}
   $$
2. **Matrix Equivalent:**
   For a fixed spatial pixel coordinate $(i, j)$, define the channel feature vector $\mathbf{x}_{i, j} \in \mathbb{R}^{C_{\text{in}}}$.  
   Let matrix $W_{k, c} = K_{c, 0, 0}^{(k)} \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}}}$.  
   Then:
   $$
   \mathbf{z}_{i, j} = \mathbf{W} \mathbf{x}_{i, j} + \mathbf{b}
   $$
   A $1 \times 1$ convolution computes a linear matrix multiplication on channel embeddings at every pixel location independently, enabling cross-channel pooling, feature recombination, and dimensionality reduction (Bottleneck layers in ResNets) with zero spatial distortion.

---

### Example 11.10: Depthwise Separable Convolutions Parameter Savings
**Problem Statement:**  
Compare a standard Conv2D layer ($C_{\text{in}} = 64, C_{\text{out}} = 128, k = 3$) against a **Depthwise Separable Convolution** (Chollet, 2017) consisting of:
1. Depthwise Conv: $k = 3$, $C_{\text{in}} = 64, C_{\text{out}} = 64$ with `groups=64` (1 filter per channel).
2. Pointwise Conv: $1 \times 1$ Conv with $C_{\text{in}} = 64, C_{\text{out}} = 128$.
Compute the parameter count and savings ratio.

**Step-by-Step Solution:**  
1. **Standard Conv2D Parameters:**
   $$
   P_{\text{standard}} = C_{\text{in}} \times C_{\text{out}} \times k^2 = 64 \times 128 \times 9 = 73,728 \text{ parameters}
   $$

2. **Depthwise Separable Parameters:**
   - Depthwise stage: $C_{\text{in}} \times 1 \times k^2 = 64 \times 9 = 576$ parameters.
   - Pointwise stage: $C_{\text{in}} \times C_{\text{out}} \times 1^2 = 64 \times 128 \times 1 = 8,192$ parameters.
   - Total Depthwise Separable:
     $$
     P_{\text{separable}} = 576 + 8,192 = 8,768 \text{ parameters}
     $$

3. **Savings Ratio:**
   $$
   \frac{P_{\text{separable}}}{P_{\text{standard}}} = \frac{8,768}{73,728} \approx 0.1189 \implies \frac{1}{k^2} + \frac{1}{C_{\text{out}}} = \frac{1}{9} + \frac{1}{128} \approx 0.1111 + 0.0078 = 0.1189
   $$
   Depthwise separable convolutions reduce parameter count and FLOPs by over **$88\%$**, enabling high-efficiency mobile computer vision (MobileNet-v1, v2, v3, Xception).

---

## 11.7 Exactly 10 Solved Exercises

### Exercise 11.1: Proof of Translation Equivariance of 2D Convolution
**Problem Statement:**  
Prove mathematically that the continuous 2D convolution operator $(f \star g)(\mathbf{x}) = \int_{\mathbb{R}^2} f(\mathbf{y}) g(\mathbf{x} - \mathbf{y}) d\mathbf{y}$ commutes with spatial translation $\mathbf{T}_{\mathbf{u}} f(\mathbf{x}) = f(\mathbf{x} - \mathbf{u})$.

**Detailed Solution:**  
1. **Apply Translation to Input Function:**
   $$
   ((\mathbf{T}_{\mathbf{u}} f) \star g)(\mathbf{x}) = \int_{\mathbb{R}^2} (\mathbf{T}_{\mathbf{u}} f)(\mathbf{y}) g(\mathbf{x} - \mathbf{y}) d\mathbf{y} = \int_{\mathbb{R}^2} f(\mathbf{y} - \mathbf{u}) g(\mathbf{x} - \mathbf{y}) d\mathbf{y}
   $$

2. **Perform Variable Substitution:**
   Let $\mathbf{z} = \mathbf{y} - \mathbf{u} \implies \mathbf{y} = \mathbf{z} + \mathbf{u}$ and $d\mathbf{z} = d\mathbf{y}$.
   $$
   \int_{\mathbb{R}^2} f(\mathbf{z}) g(\mathbf{x} - (\mathbf{z} + \mathbf{u})) d\mathbf{z} = \int_{\mathbb{R}^2} f(\mathbf{z}) g((\mathbf{x} - \mathbf{u}) - \mathbf{z}) d\mathbf{z}
   $$

3. **Identify Translated Output:**
   By definition of convolution:
   $$
   \int_{\mathbb{R}^2} f(\mathbf{z}) g((\mathbf{x} - \mathbf{u}) - \mathbf{z}) d\mathbf{z} = (f \star g)(\mathbf{x} - \mathbf{u}) = \mathbf{T}_{\mathbf{u}} \left( (f \star g)(\mathbf{x}) \right) \quad \blacksquare
   $$
   Convolution commutes with translation, establishing strict translation equivariance.

---

### Exercise 11.2: Transposed Convolution Checkerboard Artifacts
**Problem Statement:**  
Odena et al. (2016) showed that Transposed Convolutions (deconvolutions) with stride $S > 1$ introduce high-frequency "checkerboard" artifacts in generative models.  
Explain the origin of this artifact when kernel size $k$ is not evenly divisible by stride $S$.

**Detailed Solution:**  
1. **Transposed Convolution Mechanics:**
   Transposed convolution upsamples spatial dimensions by placing kernel $\mathbf{K}$ scaled by input pixel $x_{i, j}$ at stride intervals $S$ on the canvas, summing overlapping regions.
2. **Uneven Overlap:**
   When kernel size $k$ is not a multiple of stride $S$ (e.g., $k = 3, S = 2$):
   - Some canvas pixels receive contributions from two overlapping filters.
   - Adjacent canvas pixels receive contributions from only a single filter.
   This uneven accumulation creates a periodic cross-hatch intensity pattern (checkerboard artifact).
3. **The Fix:**
   Replace transposed convolution with **Bilinear / Nearest-Neighbor Upsampling** followed by a standard stride-1 convolution.

---

### Exercise 11.3: Grouped Convolution and ResNeXt Cardinality
**Problem Statement:**  
Xie et al. (2017) introduced **ResNeXt**, defining "cardinality" as the number of independent grouped convolution paths $C_{\text{card}}$.  
For a layer with $C_{\text{in}} = 256, C_{\text{out}} = 256, k = 3$, compare parameter count for standard convolution versus grouped convolution with cardinality $G = 32$.

**Detailed Solution:**  
1. **Standard Convolution ($G = 1$):**
   $$
   P_{\text{standard}} = 256 \times 256 \times 9 = 589,824 \text{ parameters}
   $$

2. **Grouped Convolution ($G = 32$ groups):**
   Channels per group: $C_{\text{group}} = 256 / 32 = 8$.  
   Each group has 8 input channels and 8 output channels:
   $$
   P_{\text{group}} = G \times (C_{\text{group}} \times C_{\text{group}} \times k^2) = 32 \times (8 \times 8 \times 9) = 32 \times 576 = 18,432 \text{ parameters}
   $$
   Savings: $\frac{589,824}{18,432} = 32\times$ reduction in parameters.

---

### Exercise 11.4: Analytical Receptive Field Growth under Stride 2 Downsampling
**Problem Statement:**  
Prove that a deep CNN consisting solely of $L$ sequential layers with $3 \times 3$ filters and stride 2 has receptive field:
$$
\text{RF}_L = 2^{L+1} - 1
$$

**Detailed Solution:**  
1. **Cumulative Stride (Jump):**
   Since $S_i = 2$ for all layers:
   $$
   J_{l-1} = \prod_{i=1}^{l-1} S_i = 2^{l-1}
   $$

2. **Receptive Field Growth:**
   With $k = 3 \implies k - 1 = 2$:
   $$
   \text{RF}_l = \text{RF}_{l-1} + 2 \cdot J_{l-1} = \text{RF}_{l-1} + 2 \cdot 2^{l-1} = \text{RF}_{l-1} + 2^l
   $$

3. **Summing Telescoping Series:**
   With base condition $\text{RF}_0 = 1$:
   $$
   \text{RF}_L = \text{RF}_0 + \sum_{l=1}^L 2^l = 1 + \left( \frac{2(2^L - 1)}{2 - 1} \right) = 1 + 2^{L+1} - 2 = 2^{L+1} - 1 \quad \blacksquare
   $$
   For $L = 5$ layers, $\text{RF}_5 = 2^6 - 1 = 63$ pixels.

---

### Exercise 11.5: Circular Padding for Toroidal Physics Simulators
**Problem Statement:**  
In physical cellular automata or grid simulation environments on a 2D torus (where the right edge wraps around to the left edge), how must padding be implemented?

**Detailed Solution:**  
1. **Periodic Boundary Condition:**
   In a toroidal topology, $(x + W, y) \sim (x, y)$ and $(x, y + H) \sim (x, y)$.
2. **Circular Padding:**
   Instead of padding borders with static zeros (`padding_mode='zeros'`), **circular padding** wraps border slices:
   - Left padding is copied from the rightmost columns of the image.
   - Right padding is copied from the leftmost columns.
   - Top padding is copied from the bottom rows.
   - Bottom padding is copied from the top rows.
   This guarantees that convolutional filters sliding over boundaries preserve seamless periodic continuity without artificial boundary distortion.

---

### Exercise 11.6: Backward Pass for 2D Average Pooling Layer
**Problem Statement:**  
A $2 \times 2$ average pooling layer with stride 2 has incoming adjoint $\bar{y} = 8.0$. Compute the gradient vector $\bar{\mathbf{x}} \in \mathbb{R}^{2 \times 2}$.

**Detailed Solution:**  
1. **Forward Equation:**
   $$
   y = \frac{1}{4} (x_{0,0} + x_{0,1} + x_{1,0} + x_{1,1})
   $$

2. **Partial Derivatives:**
   $$
   \frac{\partial y}{\partial x_{i, j}} = \frac{1}{4} \quad \forall i, j \in \{0, 1\}
   $$

3. **Input Gradients:**
   $$
   \bar{x}_{i, j} = \bar{y} \cdot \frac{1}{4} = 8.0 \times 0.25 = 2.0
   $$
   $$
   \bar{\mathbf{x}} = \begin{bmatrix} 2.0 & 2.0 \\ 2.0 & 2.0 \end{bmatrix}
   $$
   Average pooling distributes the downstream gradient equally across all contributing elements.

---

### Exercise 11.7: BlurPool: Antialiased Shift-Invariant Downsampling
**Problem Statement:**  
Zhang (2019) proved that standard MaxPool and Strided Convolutions break translation invariance due to Shannon-Nyquist aliasing.  
Explain how **BlurPool** restores true translation invariance.

**Detailed Solution:**  
1. **Aliasing in Strided Downsampling:**
   Subsampling an image by stride 2 without pre-filtering violates the Nyquist-Shannon sampling theorem, causing high-frequency components to alias into low frequencies. A 1-pixel shift can completely alter max-pooling outputs.
2. **BlurPool Two-Step Solution:**
   BlurPool decouples the feature extraction and downsampling:
   - Step 1: Compute non-strided operation (dense MaxPool with stride 1).
   - Step 2: Convolve with a low-pass anti-aliasing filter (e.g., binomial filter $\frac{1}{4}[1, 2, 1]$) with stride 2.
   Filtering out frequencies above the Nyquist limit before downsampling eliminates aliasing, making the network truly shift-invariant.

---

### Exercise 11.8: Asymmetric Convolutions for Low-Rank Kernel Factorization
**Problem Statement:**  
Show that a 2D spatial convolution with a $k \times k$ filter can be factorized into two sequential 1D convolutions ($k \times 1$ followed by $1 \times k$) if and only if the kernel matrix has rank 1. Compute the FLOP savings for $k = 7$.

**Detailed Solution:**  
1. **Rank-1 Outer Product Factorization:**
   If $\mathbf{K} = \mathbf{u} \mathbf{v}^T$ (rank 1):
   $$
   (\mathbf{X} \star \mathbf{K})(i, j) = \sum_m \sum_n X_{i+m, j+n} u_m v_n = \sum_m u_m \left( \sum_n X_{i+m, j+n} v_n \right)
   $$
   The inner sum is a 1D horizontal convolution with $\mathbf{v}$, and the outer sum is a 1D vertical convolution with $\mathbf{u}$.

2. **FLOP Savings for $k = 7$:**
   - Standard $7 \times 7$ kernel requires $7 \times 7 = 49$ MACs per pixel.
   - Two 1D convolutions require $7 + 7 = 14$ MACs per pixel.
   $$
   \text{Savings Ratio} = \frac{14}{49} = \frac{2}{7} \approx 28.57\% \implies 71.43\% \text{ computation reduction!}
   $$
   This asymmetric factorization is used extensively in Inception-v3 and v4 architectures.

---

### Exercise 11.9: Feature Map Memory Consumption during Training
**Problem Statement:**  
A 20-layer CNN receives a batch of $B = 32$ images. Each layer maintains feature maps of shape $(32, 64, 112, 112)$ in FP32.  
Compute the total activation memory needed to store these caches for backpropagation.

**Detailed Solution:**  
1. **Elements per Layer:**
   $$
   N = 32 \times 64 \times 112 \times 112 = 25,690,112 \text{ elements}
   $$
   Memory per layer:
   $$
   \text{Mem} = 25,690,112 \times 4 \text{ bytes} = 102,760,448 \text{ bytes} \approx 102.76 \text{ MB}
   $$

2. **Across 20 Layers:**
   $$
   \text{Total Memory} = 20 \times 102.76 \text{ MB} = 2,055.2 \text{ MB} \approx 2.06 \text{ GB}
   $$
   Activations consume over $2 \text{ GB}$ of VRAM, demonstrating why memory-efficient backpropagation and checkpointing are vital in deep computer vision.

---

### Exercise 11.10: 1x1 Convolution as Spatial Dimension Preserving Dimensionality Reduction
**Problem Statement:**  
In ResNet bottleneck blocks, an input of shape $(256, 56, 56)$ is projected to $(64, 56, 56)$ using $1 \times 1$ Conv, processed by a $3 \times 3$ Conv with 64 channels, and expanded back to $(256, 56, 56)$ with another $1 \times 1$ Conv.  
Compare the FLOPs of this bottleneck block against a single direct $3 \times 3$ Conv connecting 256 channels to 256 channels.

**Detailed Solution:**  
Let spatial area be $A = 56 \times 56 = 3,136$.
1. **Direct $3 \times 3$ Convolution ($256 \to 256$):**
   $$
   \text{FLOPs} = 2 \times A \times (256 \times 3 \times 3 \times 256) = 2 \times 3136 \times 589,824 \approx 3.70 \times 10^9 \text{ FLOPs} = 3.70 \text{ GFLOPs}
   $$

2. **Bottleneck Block ($256 \to 64 \to 64 \to 256$):**
   - Step 1 ($1 \times 1$ down): $2 \times A \times (256 \times 1 \times 1 \times 64) = 2 \times 3136 \times 16,384 \approx 0.103 \text{ GFLOPs}$.
   - Step 2 ($3 \times 3$ spatial): $2 \times A \times (64 \times 3 \times 3 \times 64) = 2 \times 3136 \times 36,864 \approx 0.231 \text{ GFLOPs}$.
   - Step 3 ($1 \times 1$ up): $2 \times A \times (64 \times 1 \times 1 \times 256) = 2 \times 3136 \times 16,384 \approx 0.103 \text{ GFLOPs}$.
   - Total Bottleneck FLOPs:
     $$
     0.103 + 0.231 + 0.103 = 0.437 \text{ GFLOPs}
     $$
   Savings: $\frac{3.70}{0.437} \approx 8.5\times$ FLOP reduction while preserving representation capacity!
