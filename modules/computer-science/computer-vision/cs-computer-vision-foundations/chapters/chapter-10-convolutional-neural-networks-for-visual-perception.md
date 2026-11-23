# Chapter 10: Convolutional Neural Networks for Visual Perception

---

## 10.1 The Inductive Biases of Visual Perception: Equivariance and Parameter Sharing

Before the advent of deep Convolutional Neural Networks (CNNs), machine learning treated images as flattened 1D vectors $\mathbf{x} \in \mathbb{R}^{D}$ where $D = H \cdot W \cdot C$. A standard Fully Connected (dense) layer maps $\mathbf{x}$ to hidden representations via matrix multiplication $\mathbf{y} = \mathbf{W} \mathbf{x} + \mathbf{b}$.

```
               THE CATASTROPHIC INEFFICIENCY OF DENSE LAYERS ON IMAGES
               
        Megapixel Image (1000 x 1000 x 3)                Fully Connected Layer
                   3,000,000 Inputs                             1000 Neurons
                    ┌────────────┐                              ┌────────────┐
                    │            │       3 BILLION WEIGHTS!     │            │
                    │   PIXELS   │ ═══════════════════════════► │   NEURONS  │
                    │            │    (12 GB Memory for ONE     │            │
                    └────────────┘     single linear layer!)    └────────────┘
                    
       Dense layers destroy 2D spatial topology, require billions of parameters,
             and fail to generalize across basic object translations!
```

### The Architectural Inductive Biases of CNNs
Yann LeCun (1989, 1998) recognized that physical optical imagery possesses intrinsic physical symmetries that general dense neural networks ignore. Modern computer vision replaces dense matrix operations with **Convolutional Layers** governed by two foundational inductive biases:

1. **Local Connectivity (Sparse Interactions):**
   Physical visual scenes exhibit strong local spatial correlation: adjacent pixels belong to the same physical object or surface boundary, whereas distant pixels are largely independent. Instead of connecting each neuron to all millions of inputs, a convolutional neuron connects strictly to a small, localized receptive field of size $K \times K$ (typically $3 \times 3$ or $5 \times 5$).

2. **Parameter Sharing (Weight Tying):**
   A feature detector useful in one region of the visual field (e.g., a vertical edge, a circle, or an eye detector) is equally useful everywhere across the image. A single set of kernel weights $K$ is swept across every spatial position $[y, x]$.

```
                      PARAMETER SHARING & WEIGHT TYING
                      
         Input Feature Map                     Shared Kernel K
       ┌───┬───┬───┬───┬───┐                     ┌───┬───┬───┐
       │ . │ . │ . │ . │ . │                     │ w │ w │ w │
       ├───┼───┼───┼───┼───┤                     ├───┼───┼───┤
       │ . │ p │ p │ p │ . │ ◄── Receptive Field │ w │ w │ w │ (Same 9 weights
       ├───┼───┼───┼───┼───┤     evaluated here  ├───┼───┼───┤  reused across
       │ . │ p │ p │ p │ . │                     │ w │ w │ w │  EVERY pixel!)
       ├───┼───┼───┼───┼───┤                     └───┴───┴───┘
       │ . │ p │ p │ p │ . │                           │
       └───┴───┴───┴───┴───┘                           ▼
                                            Output Feature Map O[y, x]
```

### Translation Equivariance
A mathematical operator $f$ is **equivariant** to a transformation $g$ if transforming the input produces an identically transformed output:
$$f(g(x)) = g(f(x))$$

Let $\mathcal{T}_{\Delta y, \Delta x}$ denote the 2D spatial translation operator. By the shift-invariance of discrete 2D convolution:
$$\mathcal{T}_{\Delta y, \Delta x}(I * K) = (\mathcal{T}_{\Delta y, \Delta x} I) * K$$

If an object shifts 20 pixels to the right in the input camera frame, its corresponding feature activation in the convolutional feature map shifts by exactly 20 pixels to the right, retaining its identity and shape!

---

## 10.2 Anatomy of a 2D Convolutional Layer

A production 2D convolutional layer operates on 3D/4D tensors representing multi-channel feature maps.

### Tensor Dimensionality
- **Input Feature Map ($\mathbf{X}$):** $\mathbf{X} \in \mathbb{R}^{C_{\text{in}} \times H_{\text{in}} \times W_{\text{in}}}$
- **Kernel Weight Tensor ($\mathbf{W}$):** $\mathbf{W} \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}} \times K_h \times K_w}$
- **Bias Vector ($\mathbf{b}$):** $\mathbf{b} \in \mathbb{R}^{C_{\text{out}}}$
- **Output Feature Map ($\mathbf{Y}$):** $\mathbf{Y} \in \mathbb{R}^{C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}}$

```
                     MULTI-CHANNEL CONVOLUTION TENSOR ALGEBRA
                     
     Input Tensor X                            Kernel Tensor W                         Output Tensor Y
    (C_in x H x W)                        (C_out x C_in x Kh x Kw)                   (C_out x H_out x W_out)
         ┌─────────┐                                 ┌───┐                                 ┌─────────┐
         │         │                               C │   │ Kw                              │         │
    C_in │         │                       C_out  ┌──┴───┤                            C_out│         │
         │         │                      ┌───────┴──────┤                                 │         │
         └─────────┘                      │              │ Kh                              └─────────┘
                                          └──────────────┘
                                                 │
                                                 ▼
               Each output channel c_out computes the sum of 2D convolutions
                     across ALL C_in input channels plus bias b[c_out]!
```

### The Forward Pass Formula
For each output feature channel $c_{\text{out}} \in [0, C_{\text{out}}-1]$ at spatial coordinate $(y, x)$:

$$Y[c_{\text{out}}, y, x] = b[c_{\text{out}}] + \sum_{c_{\text{in}}=0}^{C_{\text{in}}-1} \sum_{u=0}^{K_h-1} \sum_{v=0}^{K_w-1} X\Big[c_{\text{in}}, \, y \cdot S_h + u, \, x \cdot S_w + v\Big] \cdot W\Big[c_{\text{out}}, c_{\text{in}}, u, v\Big]$$

where $S_h, S_w \ge 1$ denote the vertical and horizontal **stride**.

### Hyperparameter Geometry: Stride, Padding, and Dilation

1. **Stride ($S$):** The step size by which the kernel slides across the input tensor. Stride $S > 1$ subsamples the feature map, reducing spatial resolution by approximately $1/S$.
2. **Padding ($P$):** The number of pixels appended to the spatial boundaries:
   - **`Valid` Padding ($P = 0$):** No padding added. Output size shrinks.
   - **`Same` Padding ($P = \lfloor K/2 \rfloor$ for stride $S = 1$):** Output spatial dimensions exactly match input dimensions ($H_{\text{out}} = H_{\text{in}}, W_{\text{out}} = W_{\text{in}}$).
3. **Dilation ($D$):** The spacing between kernel taps. A dilated (atrous) convolution with dilation rate $D$ inflates the effective kernel size to:
   $$K_{\text{effective}} = K + (K - 1)(D - 1)$$
   This dramatically expands the receptive field without adding any new parameters or FLOPs.

#### The Universal Output Dimension Equation:
$$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K_{\text{effective}} + 2P}{S} \right\rfloor + 1$$
$$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - K_{\text{effective}} + 2P}{S} \right\rfloor + 1$$

---

## 10.3 Receptive Field Growth Through Deep Hierarchies

A single neuron in layer $l$ of a convolutional network observes only a local patch of size $K_l \times K_l$ in layer $l-1$. However, because each neuron in layer $l-1$ itself observes a patch in layer $l-2$, the **Effective Receptive Field (ERF)** in the raw input image grows monotonically with network depth.

```
                         RECEPTIVE FIELD EXPANSION
                         
    Layer 3 (Neuron)                                  o
                                                    /   \
    Layer 2 (Feature Map)                         o   o   o
                                                 / \ / \ / \
    Layer 1 (Feature Map)                       o o o o o o o
                                               / \
    Layer 0 (Raw Image Pixels)                o o o o o o o o o
                                              ◄── Receptive Field ──►
```

### Mathematical Receptive Field Recurrence
Let:
- $RF_0 = 1$ (a single pixel in the raw input image).
- $J_0 = 1$ (the initial jump / stride step in input space).
- $K_l$ be the kernel size at layer $l$.
- $S_l$ be the stride at layer $l$.

The receptive field and stride jump accumulate through the hierarchy via the recurrences:

$$RF_l = RF_{l-1} + (K_l - 1) \cdot J_{l-1}$$
$$J_l = J_{l-1} \cdot S_l$$

#### The Gaussian Profile of the Effective Receptive Field
In 2016, Luo et al. proved that while the theoretical receptive field grows linearly with depth, the **Effective Receptive Field (ERF)**—the distribution of output gradients with respect to input pixels—follows an asymptotic 2D Gaussian distribution:
$$\frac{\partial y_{\text{center}}}{\partial X[y, x]} \propto \exp\left( -\frac{(x - x_c)^2 + (y - y_c)^2}{2\sigma_{\text{erf}}^2} \right)$$
Pixels near the center of the receptive field exert vastly greater influence on the final classification decision than pixels near the outer boundary.

---

## 10.4 Complete Backpropagation Calculus Through 2D Convolutions

To train a convolutional neural network via gradient descent, we must compute analytical partial derivatives of the scalar loss function $\mathcal{L}$ with respect to:
1. The kernel weights: $\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$ (to update parameters).
2. The layer biases: $\frac{\partial \mathcal{L}}{\partial \mathbf{b}}$ (to update biases).
3. The input activations: $\frac{\partial \mathcal{L}}{\partial \mathbf{X}}$ (to propagate error backwards to preceding layers).

```
                      BACKPROPAGATION IN CONVOLUTIONAL LAYERS
                      
            Forward Pass:                       Backward Pass:
            
               Input X                             dL/dX (Backprop Error)
                  │                                   ▲
                  ▼                                   │ Full Convolution
            ┌───────────┐                       ┌─────┴─────┐ with 180° Flipped
            │ Conv2D(W) │                       │ Conv2D(W) │ Kernel W!
            └─────┬─────┘                       └─────▲─────┘
                  │                                   │
                  ▼                                   │
               Output Y ──► Loss L              Incoming Gradient dL/dY
                                                      │
                                                      ▼
                                                dL/dW = X * (dL/dY)
```

Let $\delta[c_{\text{out}}, y, x] \triangleq \frac{\partial \mathcal{L}}{\partial Y[c_{\text{out}}, y, x]}$ be the incoming backpropagation error gradient tensor of dimensions $C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}$.

### 1. Bias Gradient ($\frac{\partial \mathcal{L}}{\partial \mathbf{b}}$)
Since $\frac{\partial Y[c_{\text{out}}, y, x]}{\partial b[c]} = 1$ if $c = c_{\text{out}}$ (and $0$ otherwise), by the multi-variable chain rule:

$$\frac{\partial \mathcal{L}}{\partial b[c_{\text{out}}]} = \sum_{y=0}^{H_{\text{out}}-1} \sum_{x=0}^{W_{\text{out}}-1} \frac{\partial \mathcal{L}}{\partial Y[c_{\text{out}}, y, x]} = \sum_{y} \sum_{x} \delta[c_{\text{out}}, y, x]$$

The bias gradient is simply the sum of all incoming error gradients across the spatial dimensions of that channel!

### 2. Weight Gradient ($\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$)
Differentiating the forward formula with respect to weight $W[c_{\text{out}}, c_{\text{in}}, u, v]$:
$$\frac{\partial Y[c_{\text{out}}, y, x]}{\partial W[c_{\text{out}}, c_{\text{in}}, u, v]} = X[c_{\text{in}}, \, y \cdot S + u, \, x \cdot S + v]$$

Applying the chain rule:

$$\frac{\partial \mathcal{L}}{\partial W[c_{\text{out}}, c_{\text{in}}, u, v]} = \sum_{y=0}^{H_{\text{out}}-1} \sum_{x=0}^{W_{\text{out}}-1} \delta[c_{\text{out}}, y, x] \cdot X[c_{\text{in}}, \, y \cdot S + u, \, x \cdot S + v]$$

Notice the profound mathematical symmetry: **The gradient with respect to the weights is the cross-correlation of the input activations with the output error gradients!**

### 3. Input Activation Gradient ($\frac{\partial \mathcal{L}}{\partial \mathbf{X}}$)
To compute how the loss varies with an input pixel $X[c_{\text{in}}, i, j]$:
Each input pixel contributes to multiple overlapping output pixels $Y[c_{\text{out}}, y, x]$ where:
$$i = y \cdot S + u \implies u = i - y \cdot S$$
$$j = x \cdot S + v \implies v = j - x \cdot S$$

Summing over all output channels $c_{\text{out}}$ and valid kernel offsets:

$$\frac{\partial \mathcal{L}}{\partial X[c_{\text{in}}, i, j]} = \sum_{c_{\text{out}}=0}^{C_{\text{out}}-1} \sum_{u=0}^{K_h-1} \sum_{v=0}^{K_w-1} \delta[c_{\text{out}}, \, i - u, \, j - v] \cdot W[c_{\text{out}}, c_{\text{in}}, u, v]$$

#### The Full Convolution Equivalence:
In continuous/discrete signal processing, this operation is mathematically identical to a **full convolution** of the error gradient tensor $\boldsymbol{\delta}$ with the **$180^\circ$-rotated (flipped) kernel**:

$$\frac{\partial \mathcal{L}}{\partial \mathbf{X}} = \boldsymbol{\delta} *_{\text{full}} \text{rot}_{180}(\mathbf{W})$$

where $\text{rot}_{180}(W)[u, v] = W[K_h - 1 - u, \, K_w - 1 - v]$.

---

## 10.5 Iconic Vision Backbones: From LeNet to ResNet

The history of modern deep visual perception is defined by the architectural evolution of convolutional backbones:

```
                         THE CONVOLUTIONAL EVOLUTION
                         
    LeNet-5 (1998)        AlexNet (2012)        VGG-16 (2014)          ResNet-50 (2015)
     5 Layers              8 Layers              16 Layers              50-152 Layers
     
     5x5 Convs             11x11, 5x5, 3x3       Strict 3x3 Convs       Residual Skip Connections
     Avg Pooling           ReLU, Dropout         Factorized Depth       y = F(x) + x
     Sigmoid/Tanh          GPU Acceleration      Heavy (138M Params)    Conquers Vanishing Gradients!
```

### 1. LeNet-5 (LeCun et al., 1998)
Pioneered 2D convolutions, weight sharing, and subsampling for automated handwritten digit recognition (MNIST), establishing the standard `[Conv -> Pool -> Conv -> Pool -> FC -> Output]` pipeline.

### 2. AlexNet (Krizhevsky, Sutskever, Hinton, 2012)
Ignited the modern deep learning revolution by winning the ImageNet Large Scale Visual Recognition Challenge (ILSVRC) with an unprecedented error reduction:
- Replaced saturating Sigmoid/Tanh activations with the **Rectified Linear Unit (ReLU)** $f(x) = \max(0, x)$, eliminating saturation for positive inputs.
- Introduced **Dropout** regularization to prevent co-adaptation of features.
- Parallelized execution across twin NVIDIA GTX 580 GPUs.

### 3. VGG-16 (Simonyan and Zisserman, 2014)
Demonstrated that large convolutional filters (such as $7 \times 7$ or $11 \times 11$) are mathematically suboptimal.
- **Factorization Theorem:** A stack of two $3 \times 3$ convolutions has an effective receptive field of $5 \times 5$, but requires only $2 \times (3^2) = 18$ weights versus $5^2 = 25$ weights (a $28\%$ parameter reduction), while incorporating an extra non-linear ReLU activation!
- A stack of three $3 \times 3$ convolutions matches a $7 \times 7$ receptive field with $3 \times 9 = 27$ weights versus $49$ weights (a $45\%$ reduction).

### 4. ResNet and Deep Residual Learning (He et al., 2015)
Before 2015, stacking more than 20 layers caused catastrophic training degradation: deeper networks suffered from higher training error due to the **vanishing gradient problem**.

Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun introduced **Residual Learning**:
Instead of forcing layers to fit an underlying mapping $\mathcal{H}(\mathbf{x})$, the layers fit a residual mapping $\mathcal{F}(\mathbf{x}) \triangleq \mathcal{H}(\mathbf{x}) - \mathbf{x}$.
The original input is reintroduced via an identity **shortcut connection (skip connection)**:

$$\mathbf{y} = \mathcal{F}(\mathbf{x}, \{\mathbf{W}_i\}) + \mathbf{x}$$

```
                          THE RESNET RESIDUAL BLOCK
                          
                                      x
                                ┌─────o─────┐
                                │     │     │ Identity Shortcut
                                │     ▼     │ (Gradient Highway!)
                                │  ┌─────┐  │
                                │  │ 3x3 │  │
                                │  │Conv │  │
                                │  └─────┘  │
                                │     │     │
                                │     ▼     │
                                │  ┌─────┐  │
                                │  │ 3x3 │  │
                                │  │Conv │  │
                                │  └─────┘  │
                                │     │     │
                                │     ▼     │
                                │  F(x)     │
                                │     │     │
                                └────►(+)◄──┘
                                       │
                                       ▼
                                y = F(x) + x
```

#### Why Residual Skip Connections Eliminate Vanishing Gradients:
Differentiating $\mathbf{y} = \mathcal{F}(\mathbf{x}) + \mathbf{x}$ with respect to input $\mathbf{x}$:
$$\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \frac{\partial \mathbf{y}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \left( \frac{\partial \mathcal{F}}{\partial \mathbf{x}} + \mathbf{I} \right) = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \frac{\partial \mathcal{F}}{\partial \mathbf{x}} + \frac{\partial \mathcal{L}}{\partial \mathbf{y}}$$

Notice the term $+ \frac{\partial \mathcal{L}}{\partial \mathbf{y}}$!
Even if the learned weights $\frac{\partial \mathcal{F}}{\partial \mathbf{x}} \to \mathbf{0}$, the gradient $\frac{\partial \mathcal{L}}{\partial \mathbf{y}}$ flows directly back to earlier layers unimpeded through the identity highway $\mathbf{I}$. This enabled networks to scale cleanly to 50, 101, and 152 layers, shattering all computer vision benchmarks.

---

## 10.6 Worked Examples

### Problem 10.1: Output Feature Map Dimension Calculation
**Statement:** A 2D convolutional layer receives an input tensor with dimensions $C_{\text{in}} = 64$, $H_{\text{in}} = 112$, $W_{\text{in}} = 112$.
The layer configuration is:
- Number of filters: $C_{\text{out}} = 128$
- Kernel size: $K = 5 \times 5$
- Stride: $S = 2$
- Padding: $P = 2$
- Dilation: $D = 1$
1. Compute the output dimensions $H_{\text{out}}$ and $W_{\text{out}}$.
2. Compute the total number of trainable parameters (weights + biases) in this layer.
3. Compute the total number of floating-point multiply-accumulate operations (MACs) for the forward pass.

**Step-by-step Solution:**
1. **Output Spatial Dimensions:**
   Using the output dimension formula:
   $$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K + 2P}{S} \right\rfloor + 1 = \left\lfloor \frac{112 - 5 + 2(2)}{2} \right\rfloor + 1 = \left\lfloor \frac{112 - 5 + 4}{2} \right\rfloor + 1 = \left\lfloor \frac{111}{2} \right\rfloor + 1 = 55 + 1 = 56$$
   Since $W_{\text{in}} = H_{\text{in}}$ and the kernel is square: $W_{\text{out}} = 56$.
   The output tensor has shape $\mathbf{Y} \in \mathbb{R}^{128 \times 56 \times 56}$.

2. **Trainable Parameter Count:**
   - Weight tensor shape: $[C_{\text{out}}, C_{\text{in}}, K_h, K_w] = [128, 64, 5, 5]$
     $$\text{Weights} = 128 \times 64 \times 5 \times 5 = 128 \times 64 \times 25 = 204,800$$
   - Bias vector shape: $[C_{\text{out}}] = [128]$
     $$\text{Biases} = 128$$
   - Total Parameters:
     $$\text{Params} = 204,800 + 128 = 204,928 \text{ parameters}$$

3. **Multiply-Accumulate Operations (MACs):**
   Each output element requires $C_{\text{in}} \times K_h \times K_w$ MACs.
   Total output elements = $C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}} = 128 \times 56 \times 56 = 401,408$.
   $$\text{MACs} = 401,408 \times (64 \times 25) = 401,408 \times 1,600 = 642,252,800 \text{ MACs} \approx 642.25\text{ MMACs}$$

---

### Problem 10.2: Receptive Field Calculation Through Deep Stack
**Statement:** A 4-layer convolutional feature extractor has the following sequential parameters:
- Layer 1: $K_1 = 3, S_1 = 1$
- Layer 2: $K_2 = 3, S_2 = 2$
- Layer 3: $K_3 = 3, S_3 = 1$
- Layer 4: $K_4 = 3, S_4 = 2$
Compute the theoretical receptive field $RF_l$ and stride jump $J_l$ at the output of each layer.

**Step-by-step Solution:**
Initial conditions: $RF_0 = 1, J_0 = 1$.
Recurrence: $RF_l = RF_{l-1} + (K_l - 1) \cdot J_{l-1}$ and $J_l = J_{l-1} \cdot S_l$.

1. **Layer 1 ($K_1 = 3, S_1 = 1$):**
   $$RF_1 = RF_0 + (3 - 1) \cdot J_0 = 1 + 2(1) = 3$$
   $$J_1 = J_0 \cdot S_1 = 1 \cdot 1 = 1$$
2. **Layer 2 ($K_2 = 3, S_2 = 2$):**
   $$RF_2 = RF_1 + (3 - 1) \cdot J_1 = 3 + 2(1) = 5$$
   $$J_2 = J_1 \cdot S_2 = 1 \cdot 2 = 2$$
3. **Layer 3 ($K_3 = 3, S_3 = 1$):**
   $$RF_3 = RF_2 + (3 - 1) \cdot J_2 = 5 + 2(2) = 5 + 4 = 9$$
   $$J_3 = J_2 \cdot S_3 = 2 \cdot 1 = 2$$
4. **Layer 4 ($K_4 = 3, S_4 = 2$):**
   $$RF_4 = RF_3 + (3 - 1) \cdot J_3 = 9 + 2(2) = 9 + 4 = 13$$
   $$J_4 = J_3 \cdot S_4 = 2 \cdot 2 = 4$$
A single neuron at the output of Layer 4 has a receptive field spanning $13 \times 13$ pixels of the input image.

---

### Problem 10.3: Dilated (Atrous) Convolution Receptive Field
**Statement:** A robotic segmentation network replaces Layer 4 from Problem 10.2 ($K_4 = 3$) with a dilated convolution having dilation rate $D = 4$ and stride $S = 1$.
1. Compute the effective kernel size $K_{\text{effective}}$.
2. Compute the new receptive field $RF_4$ after this dilated layer.

**Step-by-step Solution:**
1. **Effective Kernel Size:**
   $$K_{\text{effective}} = K + (K - 1)(D - 1) = 3 + (3 - 1)(4 - 1) = 3 + 2(3) = 3 + 6 = 9$$
   The effective kernel spans 9 grid units while containing only 3 non-zero weights.
2. **Receptive Field Growth:**
   From Problem 10.2, after Layer 3: $RF_3 = 9, J_3 = 2$.
   $$RF_4 = RF_3 + (K_{\text{effective}} - 1) \cdot J_3 = 9 + (9 - 1) \cdot 2 = 9 + 8(2) = 9 + 16 = 25$$
   The receptive field expands from $13$ to **$25$ pixels**, nearly doubling spatial context with zero added parameters!

---

### Problem 10.4: Analytical 2D Convolution Forward Pass Execution
**Statement:** Consider a 1-channel $3 \times 3$ input $\mathbf{X}$ and $2 \times 2$ kernel $\mathbf{W}$ with zero bias ($b = 0$), stride $S = 1$, and valid padding ($P = 0$):
$$\mathbf{X} = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}, \quad \mathbf{W} = \begin{bmatrix} 1 & 0 \\ -1 & 2 \end{bmatrix}$$
Compute the output matrix $\mathbf{Y}$.

**Step-by-step Solution:**
Output dimensions: $H_{\text{out}} = 3 - 2 + 1 = 2, W_{\text{out}} = 3 - 2 + 1 = 2$.
Forward formula: $Y[y, x] = \sum_{u=0}^1 \sum_{v=0}^1 X[y+u, x+v] W[u, v]$.
1. **Position $(0, 0)$:**
   $$Y[0, 0] = X[0,0]W[0,0] + X[0,1]W[0,1] + X[1,0]W[1,0] + X[1,1]W[1,1]$$
   $$Y[0, 0] = (1)(1) + (2)(0) + (4)(-1) + (5)(2) = 1 + 0 - 4 + 10 = 7$$
2. **Position $(0, 1)$:**
   $$Y[0, 1] = X[0,1]W[0,0] + X[0,2]W[0,1] + X[1,1]W[1,0] + X[1,2]W[1,1]$$
   $$Y[0, 1] = (2)(1) + (3)(0) + (5)(-1) + (6)(2) = 2 + 0 - 5 + 12 = 9$$
3. **Position $(1, 0)$:**
   $$Y[1, 0] = X[1,0]W[0,0] + X[1,1]W[0,1] + X[2,0]W[1,0] + X[2,1]W[1,1]$$
   $$Y[1, 0] = (4)(1) + (5)(0) + (7)(-1) + (8)(2) = 4 + 0 - 7 + 16 = 13$$
4. **Position $(1, 1)$:**
   $$Y[1, 1] = X[1,1]W[0,0] + X[1,2]W[0,1] + X[2,1]W[1,0] + X[2,2]W[1,1]$$
   $$Y[1, 1] = (5)(1) + (6)(0) + (8)(-1) + (9)(2) = 5 + 0 - 8 + 18 = 15$$
Assembled output:
$$\mathbf{Y} = \begin{bmatrix} 7 & 9 \\ 13 & 15 \end{bmatrix}$$

---

### Problem 10.5: Analytical Weight Gradient Backpropagation
**Statement:** For the setup in Problem 10.4, suppose the incoming backpropagation error gradient is:
$$\boldsymbol{\delta} = \frac{\partial \mathcal{L}}{\partial \mathbf{Y}} = \begin{bmatrix} 1 & -1 \\ 2 & 0 \end{bmatrix}$$
Compute the weight gradient matrix $\frac{\partial \mathcal{L}}{\partial \mathbf{W}} \in \mathbb{R}^{2 \times 2}$.

**Step-by-step Solution:**
Formula: $\frac{\partial \mathcal{L}}{\partial W[u, v]} = \sum_{y=0}^1 \sum_{x=0}^1 \delta[y, x] X[y+u, x+v]$.
1. **$W[0, 0]$ (top-left weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[0, 0]} &= \delta[0,0]X[0,0] + \delta[0,1]X[0,1] + \delta[1,0]X[1,0] + \delta[1,1]X[1,1] \\
   &= (1)(1) + (-1)(2) + (2)(4) + (0)(5) = 1 - 2 + 8 + 0 = 7
   \end{aligned}$$
2. **$W[0, 1]$ (top-right weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[0, 1]} &= \delta[0,0]X[0,1] + \delta[0,1]X[0,2] + \delta[1,0]X[1,1] + \delta[1,1]X[1,2] \\
   &= (1)(2) + (-1)(3) + (2)(5) + (0)(6) = 2 - 3 + 10 + 0 = 9
   \end{aligned}$$
3. **$W[1, 0]$ (bottom-left weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[1, 0]} &= \delta[0,0]X[1,0] + \delta[0,1]X[1,1] + \delta[1,0]X[2,0] + \delta[1,1]X[2,1] \\
   &= (1)(4) + (-1)(5) + (2)(7) + (0)(8) = 4 - 5 + 14 + 0 = 13
   \end{aligned}$$
4. **$W[1, 1]$ (bottom-right weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[1, 1]} &= \delta[0,0]X[1,1] + \delta[0,1]X[1,2] + \delta[1,0]X[2,1] + \delta[1,1]X[2,2] \\
   &= (1)(5) + (-1)(6) + (2)(8) + (0)(9) = 5 - 6 + 16 + 0 = 15
   \end{aligned}$$
Assembled weight gradient:
$$\frac{\partial \mathcal{L}}{\partial \mathbf{W}} = \begin{bmatrix} 7 & 9 \\ 13 & 15 \end{bmatrix}$$

---

### Problem 10.6: Input Activation Gradient Backpropagation
**Statement:** For the setup in Problems 10.4 and 10.5, compute the input activation gradient $\frac{\partial \mathcal{L}}{\partial X[1, 1]}$ at the center pixel.

**Step-by-step Solution:**
Formula: $\frac{\partial \mathcal{L}}{\partial X[i, j]} = \sum_{u} \sum_{v} \delta[i-u, j-v] W[u, v]$ where valid $(i-u, j-v) \in \{0, 1\}^2$.
For $(i, j) = (1, 1)$:
- $u = 0, v = 0 \implies \delta[1-0, 1-0] = \delta[1, 1] \implies \delta[1, 1] W[0, 0] = (0)(1) = 0$
- $u = 0, v = 1 \implies \delta[1-0, 1-1] = \delta[1, 0] \implies \delta[1, 0] W[0, 1] = (2)(0) = 0$
- $u = 1, v = 0 \implies \delta[1-1, 1-0] = \delta[0, 1] \implies \delta[0, 1] W[1, 0] = (-1)(-1) = 1$
- $u = 1, v = 1 \implies \delta[1-1, 1-1] = \delta[0, 0] \implies \delta[0, 0] W[1, 1] = (1)(2) = 2$
Sum:
$$\frac{\partial \mathcal{L}}{\partial X[1, 1]} = 0 + 0 + 1 + 2 = 3$$

---

### Problem 10.7: Max Pooling Forward and Backward Pass
**Statement:** A $4 \times 4$ activation patch passes through a $2 \times 2$ Max Pooling layer with stride $S = 2$:
$$\mathbf{X} = \begin{bmatrix} 1 & 3 & 2 & 1 \\ 4 & 2 & 5 & 8 \\ 3 & 7 & 4 & 2 \\ 1 & 0 & 6 & 9 \end{bmatrix}$$
1. Compute the pooled output matrix $\mathbf{Y} \in \mathbb{R}^{2 \times 2}$.
2. If the incoming gradient is $\frac{\partial \mathcal{L}}{\partial \mathbf{Y}} = \begin{bmatrix} 10 & 20 \\ 30 & 40 \end{bmatrix}$, compute the backpropagated gradient matrix $\frac{\partial \mathcal{L}}{\partial \mathbf{X}} \in \mathbb{R}^{4 \times 4}$.

**Step-by-step Solution:**
1. **Forward Max Pooling:**
   - Top-left window $\begin{bmatrix} 1 & 3 \\ 4 & 2 \end{bmatrix}$: Max is **4** at index $(1, 0)$.
   - Top-right window $\begin{bmatrix} 2 & 1 \\ 5 & 8 \end{bmatrix}$: Max is **8** at index $(1, 3)$.
   - Bottom-left window $\begin{bmatrix} 3 & 7 \\ 1 & 0 \end{bmatrix}$: Max is **7** at index $(2, 1)$.
   - Bottom-right window $\begin{bmatrix} 4 & 2 \\ 6 & 9 \end{bmatrix}$: Max is **9** at index $(3, 3)$.
   $$\mathbf{Y} = \begin{bmatrix} 4 & 8 \\ 7 & 9 \end{bmatrix}$$

2. **Backward Gradient Routing:**
   In Max Pooling, gradients route exclusively to the argmax position; all other elements receive zero gradient:
   - $(1, 0)$ routes $+10$
   - $(1, 3)$ routes $+20$
   - $(2, 1)$ routes $+30$
   - $(3, 3)$ routes $+40$
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{X}} = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 10 & 0 & 0 & 20 \\ 0 & 30 & 0 & 0 \\ 0 & 0 & 0 & 40 \end{bmatrix}$$

---

### Problem 10.8: Factorization of 5x5 Convolutions into Two 3x3 Convolutions
**Statement:** Compare:
- Layer A: A single $5 \times 5$ conv layer with $C_{\text{in}} = 64$ and $C_{\text{out}} = 64$.
- Layer B: A cascaded stack of two $3 \times 3$ conv layers with intermediate channel count $C_{\text{mid}} = 64$.
1. Compute the parameter count of Layer A.
2. Compute the parameter count of Layer B.
3. Compute the percentage reduction in parameters.

**Step-by-step Solution:**
1. **Layer A ($5 \times 5$):**
   $$\text{Params}_A = C_{\text{out}} \times C_{\text{in}} \times 5 \times 5 + C_{\text{out}} = 64 \times 64 \times 25 + 64 = 102,400 + 64 = 102,464$$
2. **Layer B (Two $3 \times 3$):**
   - Sub-layer 1: $64 \times 64 \times 3 \times 3 + 64 = 64 \times 64 \times 9 + 64 = 36,864 + 64 = 36,928$
   - Sub-layer 2: $64 \times 64 \times 3 \times 3 + 64 = 36,928$
   $$\text{Params}_B = 36,928 + 36,928 = 73,856$$
3. **Reduction:**
   $$\text{Reduction} = \left( 1 - \frac{73,856}{102,464} \right) \times 100\% \approx \left( 1 - \frac{18}{25} \right) \times 100\% = 28.0\%$$
   The $3 \times 3$ cascade reduces parameters and FLOPs by $28\%$ while maintaining the identical $5 \times 5$ receptive field and adding an extra non-linear activation.

---

### Problem 10.9: Memory Footprint of Feature Map Activations
**Statement:** An autonomous drone runs ResNet-18 on an onboard GPU for real-time collision detection. The input is $3 \times 512 \times 512$ float32 ($4\text{ bytes}$).
Layer 1 outputs a feature tensor of shape $64 \times 256 \times 256$.
Layer 2 outputs a feature tensor of shape $128 \times 128 \times 128$.
Compute the memory consumed in megabytes (MB) by the activations of Layer 1 and Layer 2.

**Step-by-step Solution:**
1. **Layer 1 Activations ($64 \times 256 \times 256$):**
   $$\text{Elements} = 64 \times 256 \times 256 = 64 \times 65,536 = 4,194,304 \text{ floats}$$
   $$\text{Bytes} = 4,194,304 \times 4\text{ bytes} = 16,777,216\text{ bytes} = 16.0\text{ MB}$$
2. **Layer 2 Activations ($128 \times 128 \times 128$):**
   $$\text{Elements} = 128 \times 128 \times 128 = 128 \times 16,384 = 2,097,152 \text{ floats}$$
   $$\text{Bytes} = 2,097,152 \times 4\text{ bytes} = 8,388,608\text{ bytes} = 8.0\text{ MB}$$
   Total memory for just these two activation tensors = $16.0 + 8.0 = 24.0\text{ MB}$.

---

### Problem 10.10: 1x1 Convolutions for Channel Dimensionality Reduction
**Statement:** A feature map has shape $C_{\text{in}} = 256, H = 28, W = 28$. We wish to reduce the channels to $C_{\text{out}} = 64$ using a $1 \times 1$ convolution.
1. Compute the number of weights in the $1 \times 1$ convolution.
2. If we directly applied a $3 \times 3$ convolution from $256$ to $256$ channels, compute the weights.
3. Compare the parameter count if we first reduce to $64$ channels with $1 \times 1$, apply $3 \times 3$ convolution on $64$ channels, and restore to $256$ with $1 \times 1$ (the ResNet Bottleneck Block).

**Step-by-step Solution:**
1. **$1 \times 1$ Conv ($256 \to 64$):**
   $$\text{Weights} = 64 \times 256 \times 1 \times 1 = 16,384$$
2. **Direct $3 \times 3$ Conv ($256 \to 256$):**
   $$\text{Weights} = 256 \times 256 \times 3 \times 3 = 256 \times 256 \times 9 = 589,824$$
3. **ResNet Bottleneck Block:**
   - Step 1 ($1 \times 1$, $256 \to 64$): $64 \times 256 \times 1 \times 1 = 16,384$
   - Step 2 ($3 \times 3$, $64 \to 64$): $64 \times 64 \times 3 \times 3 = 36,864$
   - Step 3 ($1 \times 1$, $64 \to 256$): $256 \times 64 \times 1 \times 1 = 16,384$
   $$\text{Total Bottleneck Weights} = 16,384 + 36,864 + 16,384 = 69,632$$
   The Bottleneck architecture slashes parameters from $589,824$ down to $69,632$ (an **$88.2\%$ reduction**!), allowing dramatically deeper networks.

---

## 10.7 Solved Exercises

### Exercise 10.1: Proof of Translation Equivariance for Discrete Convolutions
**Statement:** Let $\mathcal{T}_{\boldsymbol{\Delta}}$ be a 2D spatial translation operator defined by $\mathcal{T}_{\boldsymbol{\Delta}}(X)[y, x] = X[y - \Delta_y, x - \Delta_x]$.
Prove algebraically that for any discrete convolution kernel $K$:
$$\text{Conv}(\mathcal{T}_{\boldsymbol{\Delta}}(X), K) = \mathcal{T}_{\boldsymbol{\Delta}}(\text{Conv}(X, K))$$

**Solution:**
1. Let $Y = \text{Conv}(X, K)$, so $Y[y, x] = \sum_u \sum_v X[y - u, x - v] K[u, v]$.
2. Let $X' = \mathcal{T}_{\boldsymbol{\Delta}}(X)$, so $X'[y, x] = X[y - \Delta_y, x - \Delta_x]$.
3. Compute the convolution of $X'$ with $K$:
   $$Y'[y, x] = \sum_u \sum_v X'[y - u, x - v] K[u, v]$$
4. Substitute the definition of $X'$:
   $$Y'[y, x] = \sum_u \sum_v X\Big[ (y - u) - \Delta_y, \, (x - v) - \Delta_x \Big] K[u, v]$$
5. Rearrange indices:
   $$Y'[y, x] = \sum_u \sum_v X\Big[ (y - \Delta_y) - u, \, (x - \Delta_x) - v \Big] K[u, v]$$
6. Notice that the right-hand side is precisely $Y[y - \Delta_y, x - \Delta_x] = \mathcal{T}_{\boldsymbol{\Delta}}(Y)[y, x]$.
   Therefore:
   $$\text{Conv}(\mathcal{T}_{\boldsymbol{\Delta}}(X), K) = \mathcal{T}_{\boldsymbol{\Delta}}(\text{Conv}(X, K)) \quad \blacksquare$$

---

### Exercise 10.2: Derivative of ReLU Activation
**Statement:** The Rectified Linear Unit is $f(x) = \max(0, x)$.
1. State the sub-gradient $\frac{df}{dx}$.
2. Explain the "Dying ReLU" failure mode and how Leaky ReLU resolves it.

**Solution:**
1. The derivative is:
   $$\frac{df}{dx} = \begin{cases} 1 & \text{if } x > 0 \\ 0 & \text{if } x < 0 \\ [0, 1] & \text{if } x = 0 \quad (\text{sub-gradient, convention: } 0) \end{cases}$$
2. **Dying ReLU Problem:**
   If a neuron receives a large negative gradient update such that its bias becomes strongly negative, $x = \mathbf{w}^\top \mathbf{x} + b < 0$ for all inputs in the dataset.
   Because $\frac{df}{dx} = 0$ for all $x < 0$, no error gradient ever passes back through this neuron again ($\nabla_{\mathbf{w}} \mathcal{L} = \mathbf{0}$). The neuron permanently ceases learning ("dies").
3. **Leaky ReLU Resolution:**
   Leaky ReLU introduces a small non-zero slope $\alpha \approx 0.01$ for negative inputs:
   $$f_{\text{leaky}}(x) = \begin{cases} x & \text{if } x > 0 \\ \alpha x & \text{if } x \le 0 \end{cases} \implies \frac{df_{\text{leaky}}}{dx} = \begin{cases} 1 & \text{if } x > 0 \\ \alpha & \text{if } x \le 0 \end{cases}$$
   Since the gradient is strictly $\alpha > 0$ when negative, error signals continue to flow, preventing neuron death. $\blacksquare$

---

### Exercise 10.3: Parameter Count Comparison: Conv vs. Dense
**Statement:** An input feature map has dimensions $64 \times 32 \times 32$.
- Option 1: Flatten and pass through a dense layer producing $64 \times 32 \times 32$ outputs.
- Option 2: Apply a $3 \times 3$ convolutional layer with $64$ filters, stride 1, padding 1.
Compute the parameter count for both options and state the ratio.

**Solution:**
1. **Option 1 (Dense Layer):**
   Input features $N_{\text{in}} = 64 \times 32 \times 32 = 65,536$.
   Output features $N_{\text{out}} = 64 \times 32 \times 32 = 65,536$.
   $$\text{Params}_{\text{dense}} = N_{\text{in}} \times N_{\text{out}} + N_{\text{out}} = 65,536 \times 65,536 + 65,536 \approx 4,295,032,832 \text{ params} \quad (4.3\text{ BILLION})$$
2. **Option 2 (Conv Layer):**
   $$\text{Params}_{\text{conv}} = C_{\text{out}} \times C_{\text{in}} \times K \times K + C_{\text{out}} = 64 \times 64 \times 9 + 64 = 36,864 + 64 = 36,928 \text{ params}$$
3. **Ratio:**
   $$\text{Ratio} = \frac{4,295,032,832}{36,928} \approx 116,308\times$$
   The dense layer requires over $116,000\times$ more parameters to perform a comparable spatial transformation! $\blacksquare$

---

### Exercise 10.4: Batch Normalization Mechanics and Invariance
**Statement:** In Batch Normalization (Ioffe and Szegedy, 2015), mini-batch activations $\mathcal{B} = \{x_1, \dots, x_m\}$ are normalized as $\hat{x}_i = \frac{x_i - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}$.
Prove that Batch Normalization is invariant to scaling of the preceding linear weights $\mathbf{W} \to \alpha \mathbf{W}$.

**Solution:**
1. Let $x_i = \mathbf{w}^\top \mathbf{u}_i$.
   If the weights are scaled by $\alpha > 0$, the new activations are $x_i' = \alpha \mathbf{w}^\top \mathbf{u}_i = \alpha x_i$.
2. Compute the new mini-batch mean:
   $$\mu_{\mathcal{B}}' = \frac{1}{m} \sum_{i=1}^m \alpha x_i = \alpha \left(\frac{1}{m} \sum_{i=1}^m x_i\right) = \alpha \mu_{\mathcal{B}}$$
3. Compute the new mini-batch variance:
   $$\sigma_{\mathcal{B}}'^2 = \frac{1}{m} \sum_{i=1}^m (x_i' - \mu_{\mathcal{B}}')^2 = \frac{1}{m} \sum_{i=1}^m (\alpha x_i - \alpha \mu_{\mathcal{B}})^2 = \alpha^2 \left(\frac{1}{m} \sum_{i=1}^m (x_i - \mu_{\mathcal{B}})^2\right) = \alpha^2 \sigma_{\mathcal{B}}^2$$
4. Compute the normalized activation (neglecting $\epsilon \ll \sigma^2$):
   $$\hat{x}_i' = \frac{x_i' - \mu_{\mathcal{B}}'}{\sqrt{\sigma_{\mathcal{B}}'^2}} = \frac{\alpha (x_i - \mu_{\mathcal{B}})}{\sqrt{\alpha^2 \sigma_{\mathcal{B}}^2}} = \frac{\alpha (x_i - \mu_{\mathcal{B}})}{\alpha \sigma_{\mathcal{B}}} = \frac{x_i - \mu_{\mathcal{B}}}{\sigma_{\mathcal{B}}} = \hat{x}_i$$
   The scalar $\alpha$ cancels out completely. Batch Normalization stabilizes training against exploding weight magnitudes. $\blacksquare$

---

### Exercise 10.5: Transposed Convolution (Deconvolution) Arithmetic
**Statement:** A transposed convolution layer (frequently used in generative models and semantic segmentation decoders) has input size $H_{\text{in}} = 16$, kernel size $K = 4$, stride $S = 2$, and padding $P = 1$.
Derive the output dimension $H_{\text{out}}$.

**Solution:**
1. A transposed convolution performs the backward pass of a standard convolution.
   In standard convolution: $H_{\text{in}} = \frac{H_{\text{out}} - K + 2P}{S} + 1$.
2. Invert this relationship to solve for $H_{\text{out}}$:
   $$H_{\text{out}} - K + 2P = S (H_{\text{in}} - 1) \implies H_{\text{out}} = S (H_{\text{in}} - 1) + K - 2P$$
3. Substitute the parameters ($H_{\text{in}} = 16, S = 2, K = 4, P = 1$):
   $$H_{\text{out}} = 2(16 - 1) + 4 - 2(1) = 2(15) + 4 - 2 = 30 + 2 = 32$$
   The transposed convolution upsamples the spatial resolution by exactly $2\times$ (from $16 \times 16$ to $32 \times 32$). $\blacksquare$

---

### Exercise 10.6: Checkerboard Artifacts in Transposed Convolutions
**Statement:** Explain why transposed convolutions often create prominent high-frequency "checkerboard artifacts" in generated or segmented images, and identify the bilinear upsampling alternative.

**Solution:**
1. When kernel size $K$ is not divisible by stride $S$ (e.g., $K = 3, S = 2$ or $K = 4, S = 2$), the receptive fields of adjacent output pixels overlap unevenly.
2. Some output pixels receive contributions from two kernel taps, while neighboring output pixels receive contributions from only one tap.
3. This creates a periodic intensity ripple across every alternate pixel resembling a checkerboard pattern.
4. **Alternative:**
   Replace transposed convolution with **Bilinear (or Nearest-Neighbor) Interpolation followed by a standard $3 \times 3$ convolution** with stride 1. This guarantees smooth, uniform spatial coverage with zero checkerboard fringing. $\blacksquare$

---

### Exercise 10.7: Global Average Pooling vs. Fully Connected Flattening
**Statement:** Min Lin et al. (2013) introduced **Global Average Pooling (GAP)** to replace dense fully connected layers prior to the final softmax classification layer. State the two primary benefits of GAP.

**Solution:**
1. **Dramatic Reduction in Parameters:**
   For a backbone outputting $512 \times 7 \times 7$ features to 1000 classes:
   - Dense flattening: $(512 \times 49) \times 1000 \approx 25.1\text{ million weights}$ (prone to severe overfitting).
   - Global Average Pooling: Takes the spatial mean $\frac{1}{49}\sum_{y, x} F[c, y, x]$, reducing $512 \times 7 \times 7$ to a single $512$-dimensional vector. Classification requires only $512 \times 1000 = 512,000\text{ weights}$ (a $98\%$ parameter elimination).
2. **Arbitrary Input Image Resolution:**
   Dense layers require a fixed, immutable input size (e.g., strictly $224 \times 224$). Global Average Pooling operates on arbitrary spatial dimensions $H \times W$, enabling the network to accept images of any resolution at test time. $\blacksquare$

---

### Exercise 10.8: Depthwise Separable Convolutions (MobileNet)
**Statement:** MobileNet (Howard et al., 2017) decomposes a standard convolution into a **Depthwise Convolution** followed by a **Pointwise ($1 \times 1$) Convolution**.
Calculate the computational cost ratio between Depthwise Separable and Standard Convolution for kernel size $K = 3 \times 3$ and $C_{\text{out}} \gg 1$.

**Solution:**
1. **Standard Convolution Cost:**
   $$\text{FLOPs}_{\text{std}} = H \cdot W \cdot C_{\text{out}} \cdot C_{\text{in}} \cdot K^2$$
2. **Depthwise Separable Convolution Cost:**
   - Depthwise pass: Each input channel is convolved with its own $K \times K$ kernel:
     $$\text{FLOPs}_{\text{depthwise}} = H \cdot W \cdot C_{\text{in}} \cdot K^2$$
   - Pointwise pass: A $1 \times 1$ convolution mixes channels:
     $$\text{FLOPs}_{\text{pointwise}} = H \cdot W \cdot C_{\text{out}} \cdot C_{\text{in}} \cdot 1$$
   $$\text{FLOPs}_{\text{sep}} = H \cdot W \cdot C_{\text{in}} (K^2 + C_{\text{out}})$$
3. **Computational Ratio:**
   $$\text{Ratio} = \frac{\text{FLOPs}_{\text{sep}}}{\text{FLOPs}_{\text{std}}} = \frac{H W C_{\text{in}} (K^2 + C_{\text{out}})}{H W C_{\text{out}} C_{\text{in}} K^2} = \frac{K^2 + C_{\text{out}}}{C_{\text{out}} K^2} = \frac{1}{C_{\text{out}}} + \frac{1}{K^2}$$
4. For $K = 3$ ($K^2 = 9$) and $C_{\text{out}} = 512$:
   $$\text{Ratio} \approx \frac{1}{9} + \frac{1}{512} \approx 0.111 + 0.002 \approx 0.113 \approx \frac{1}{9}$$
   Depthwise separable convolution delivers nearly a **$9\times$ computational speedup** with minimal loss of accuracy, powering real-time mobile and robotic vision. $\blacksquare$

---

### Exercise 10.9: Vanishing Gradient Derivation in Plain Deep Networks
**Statement:** In an $L$-layer plain neural network $\mathbf{x}_l = \sigma(\mathbf{W}_l \mathbf{x}_{l-1})$, show how the gradient $\frac{\partial \mathcal{L}}{\partial \mathbf{x}_1}$ scales with depth, and explain why saturation of $\sigma'(z)$ causes exponential attenuation.

**Solution:**
1. By the chain rule:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{x}_1} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{l=2}^L \frac{\partial \mathbf{x}_l}{\partial \mathbf{x}_{l-1}}$$
2. The Jacobian of layer $l$ is:
   $$\frac{\partial \mathbf{x}_l}{\partial \mathbf{x}_{l-1}} = \text{diag}(\sigma'(\mathbf{z}_l)) \cdot \mathbf{W}_l$$
3. Thus:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{x}_1} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{l=2}^L \Big[ \text{diag}(\sigma'(\mathbf{z}_l)) \mathbf{W}_l \Big]$$
4. If $\sigma$ is Sigmoid, the maximum derivative is $\sigma'(0) = 0.25$.
   Even with identity weights, the product contains a factor:
   $$\prod_{l=2}^L (0.25) = (0.25)^{L-1}$$
   For a 20-layer network, $(0.25)^{19} \approx 3.6 \times 10^{-12} \approx 0$.
   The gradient vanishes exponentially, halting all parameter updates in initial layers. $\blacksquare$

---

### Exercise 10.10: Self-Attention vs. Convolutions in Visual Transformers (ViTs)
**Statement:** Compare the spatial inductive biases of Convolutional Neural Networks (CNNs) versus Vision Transformers (ViTs). Why do ViTs require massively larger training datasets to outperform CNNs?

**Solution:**
1. **CNN Inductive Biases:**
   - CNNs have hardcoded assumptions: **local connectivity** (pixels interact only within local $K \times K$ neighborhoods) and **translation equivariance** (features are identical anywhere in the image).
   - These strong inductive biases constrain the hypothesis search space, allowing CNNs to train effectively on modest datasets (e.g., thousands of images).
2. **Vision Transformer (ViT) Mechanics:**
   - ViTs split an image into non-overlapping patches and apply global Multi-Head Self-Attention (MHSA).
   - In self-attention, every patch can attend to every other patch across the entire image with equal ease. There is zero hardcoded locality or translation equivariance.
3. **Data Thirst of ViTs:**
   - Because ViTs possess minimal spatial inductive bias, they must **learn the concepts of spatial locality, 2D proximity, and translation equivariance from scratch**.
   - Consequently, ViTs require massive datasets (tens or hundreds of millions of labeled images, e.g., JFT-300M) before their unrestricted capacity surpasses CNN performance. $\blacksquare$
