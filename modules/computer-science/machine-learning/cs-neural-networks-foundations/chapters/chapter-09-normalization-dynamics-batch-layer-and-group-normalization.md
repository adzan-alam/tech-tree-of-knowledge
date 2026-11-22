# Chapter 9: Normalization Dynamics: Batch, Layer, and Group Normalization

> *"Normalization does not merely control covariate shift; it fundamentally restructures the geometry of the loss landscape. It flattens ravines, bounds the Lipschitz constant of the gradient, and turns treacherous non-convex ravines into smooth, navigable highways."*  
> — **Shibani Santurkar et al.**, *How Does Batch Normalization Help Optimization?* (NeurIPS 2018)

---

## 9.1 The Internal Covariate Shift Hypothesis & Modern Critiques

When Sergey Ioffe and Christian Szegedy introduced **Batch Normalization** in 2015, it triggered an immediate revolution in deep learning, enabling the training of substantially deeper networks with higher learning rates and reduced sensitivity to initialization.

### 9.1.1 The Original Internal Covariate Shift (ICS) Hypothesis

In their seminal 2015 paper, Ioffe and Szegedy defined **Internal Covariate Shift** as the change in the distribution of network activations due to the continuous updating of preceding layer parameters during training:
- In an $L$-layer network, layer $l$ receives inputs from layer $l-1$:
  $$
  \mathbf{a}^{[l-1]} = f(\mathbf{x}; \boldsymbol{\theta}_1, \dots, \boldsymbol{\theta}_{l-1})
  $$
- When earlier parameters $\boldsymbol{\theta}_1, \dots, \boldsymbol{\theta}_{l-1}$ are updated by gradient descent, the distribution of $\mathbf{a}^{[l-1]}$ changes.
- Consequently, layer $l$ must continuously adapt to a moving target distribution, slowing convergence.

Ioffe and Szegedy hypothesized that fixing the mean and variance of intermediate pre-activations to a standard distribution ($\mu = 0, \sigma^2 = 1$) would eradicate Internal Covariate Shift.

```
       Internal Covariate Shift vs. Modern Landscape Smoothing View
       
    Original View (Ioffe & Szegedy 2015):
    [Layer 1 Updates] ---> Shift in P(a^[1]) ---> [Layer 2 Must Readapt] (ICS slows training)
    
    Modern Geometric View (Santurkar et al. 2018):
    Standard Loss Landscape:   Jagged, steep, unpredictable gradient variations
    Normalized Loss Landscape: Smooth, Lipschitz-bounded gradient variations
                               (Permits massive learning rates without divergence)
```

### 9.1.2 Modern Landscape Smoothing: Santurkar et al. (2018)

In a landmark NeurIPS 2018 paper, *How Does Batch Normalization Help Optimization?*, Shibani Santurkar, Dimitris Tsipras, Ilyas, and Aleksander Madry disproved the ICS hypothesis through rigorous empirical and theoretical experiments:
1. **Deliberate Covariate Shift Injection:** The authors trained deep networks where random, non-stationary noise distributions were intentionally injected after each Batch Normalization layer—reintroducing severe covariate shift. Astonishingly, the networks trained just as rapidly and generalized just as effectively as standard BatchNorm networks!
2. **Gradient Lipschitz Smoothness:** Santurkar et al. proved that normalization primarily functions by **smoothing the optimization landscape**.  
   Specifically, normalization makes the loss function $\mathcal{L}$ **$\beta$-smooth** (Lipschitz continuous gradient):
   $$
   \|\nabla \mathcal{L}(\mathbf{w}_1) - \nabla \mathcal{L}(\mathbf{w}_2)\|_2 \le \beta \|\mathbf{w}_1 - \mathbf{w}_2\|_2
   $$
   and guarantees that the effective gradient direction $\nabla \mathcal{L}$ remains highly aligned with the second-order descent direction over long step lengths. This prevents exploding gradients and empowers optimizers to use aggressive learning rates safely.

---

## 9.2 Batch Normalization (Ioffe & Szegedy, 2015)

Batch Normalization normalizes each feature channel independently across the samples in a mini-batch.

```
         Batch Normalization Tensor Slicing (B x C x H x W)
         
               Batch Dimension B
                   |
                   v
               +-------+-------+-------+
               |  * *  |       |       |  <-- Samples 1 to B
               |  * *  |       |       |
               +-------+-------+-------+
                   ^
                   |  Normalize across (B, H, W) for EACH individual channel C
                   +-- Channel Dimension C
```

### 9.2.1 The Forward Pass Equations

Let a mini-batch $\mathcal{B} = \{\mathbf{x}^{(1)}, \mathbf{x}^{(2)}, \dots, \mathbf{x}^{(B)}\}$ consist of $B$ samples. For a specific 1D feature dimension $k \in \{1, \dots, d\}$, let $x_i \equiv x_k^{(i)}$ denote the scalar value of feature $k$ for sample $i \in \{1, \dots, B\}$.

1. **Compute Mini-Batch Empirical Mean:**
   $$
   \mu_{\mathcal{B}} = \frac{1}{B} \sum_{i=1}^B x_i
   $$
2. **Compute Mini-Batch Empirical Variance:**
   $$
   \sigma_{\mathcal{B}}^2 = \frac{1}{B} \sum_{i=1}^B (x_i - \mu_{\mathcal{B}})^2
   $$
3. **Normalize to Zero Mean and Unit Variance:**
   $$
   \hat{x}_i = \frac{x_i - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}
   $$
   where $\epsilon > 0$ (typically $10^{-5}$) is a numerical stability constant to prevent division by zero.
4. **Scale and Shift (Learnable Affine Transformation):**
   Simply constraining activations to zero mean and unit variance limits representational capacity (for instance, a sigmoid activation would be permanently locked in its linear regime near zero). To preserve representation capacity, BatchNorm introduces two learnable parameters per feature channel: scale $\gamma$ and shift $\beta$:
   $$
   y_i = \gamma \hat{x}_i + \beta
   $$
   If the network benefits from unnormalized features, it can simply learn $\gamma = \sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}$ and $\beta = \mu_{\mathcal{B}}$, recovering the exact original identity mapping $y_i = x_i$!

---

### 9.2.2 Running Statistics for Inference

During training, $\mu_{\mathcal{B}}$ and $\sigma_{\mathcal{B}}^2$ are calculated from the current mini-batch.  
During inference (test time), predictions must be deterministic for an individual sample ($B = 1$), where batch mean and variance are meaningless.

To resolve this, BatchNorm maintains exponential moving averages of the training statistics:
$$
\mu_{\text{run}} \leftarrow (1 - \alpha) \mu_{\text{run}} + \alpha \mu_{\mathcal{B}}
$$
$$
\sigma_{\text{run}}^2 \leftarrow (1 - \alpha) \sigma_{\text{run}}^2 + \alpha \left( \frac{B}{B - 1} \sigma_{\mathcal{B}}^2 \right)
$$
where $\alpha \in (0, 1)$ is the momentum parameter (typically $\alpha = 0.1$), and $\frac{B}{B-1}$ is Bessel's correction for unbiased sample variance.

At inference time, the frozen normalization transformation is:
$$
y = \gamma \left( \frac{x - \mu_{\text{run}}}{\sqrt{\sigma_{\text{run}}^2 + \epsilon}} \right) + \beta = \left( \frac{\gamma}{\sqrt{\sigma_{\text{run}}^2 + \epsilon}} \right) x + \left( \beta - \frac{\gamma \mu_{\text{run}}}{\sqrt{\sigma_{\text{run}}^2 + \epsilon}} \right)
$$
Because this is a linear affine function of $x$, it can be **fused directly into the preceding linear/convolutional layer's weights and biases**, adding zero computational overhead during inference!

---

### 9.2.3 Complete Backward Pass Derivation

Let incoming adjoints from the downstream loss be $\bar{y}_i \equiv \frac{\partial \mathcal{L}}{\partial y_i}$. We apply the multivariate chain rule across the batch $i = 1, \dots, B$.

1. **Gradients for Affine Parameters:**
   $$
   \frac{\partial \mathcal{L}}{\partial \gamma} = \sum_{i=1}^B \bar{y}_i \hat{x}_i
   $$
   $$
   \frac{\partial \mathcal{L}}{\partial \beta} = \sum_{i=1}^B \bar{y}_i
   $$
2. **Adjoint of Normalized Activation $\hat{x}_i$:**
   $$
   \bar{\hat{x}}_i = \frac{\partial \mathcal{L}}{\partial \hat{x}_i} = \bar{y}_i \cdot \gamma
   $$
3. **Adjoint of Batch Variance $\sigma_{\mathcal{B}}^2$:**
   $$
   \frac{\partial \mathcal{L}}{\partial \sigma_{\mathcal{B}}^2} = \sum_{i=1}^B \bar{\hat{x}}_i \cdot \frac{\partial \hat{x}_i}{\partial \sigma_{\mathcal{B}}^2} = \sum_{i=1}^B \bar{\hat{x}}_i \cdot (x_i - \mu_{\mathcal{B}}) \left( -\frac{1}{2} (\sigma_{\mathcal{B}}^2 + \epsilon)^{-3/2} \right) = -\frac{1}{2(\sigma_{\mathcal{B}}^2 + \epsilon)} \sum_{i=1}^B \bar{\hat{x}}_i \hat{x}_i
   $$
4. **Adjoint of Batch Mean $\mu_{\mathcal{B}}$:**
   $$
   \frac{\partial \mathcal{L}}{\partial \mu_{\mathcal{B}}} = \sum_{i=1}^B \bar{\hat{x}}_i \cdot \left( -\frac{1}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}} \right) + \frac{\partial \mathcal{L}}{\partial \sigma_{\mathcal{B}}^2} \cdot \left( -\frac{2}{B} \sum_{i=1}^B (x_i - \mu_{\mathcal{B}}) \right)
   $$
   Since $\sum_{i=1}^B (x_i - \mu_{\mathcal{B}}) = 0$:
   $$
   \frac{\partial \mathcal{L}}{\partial \mu_{\mathcal{B}}} = -\frac{1}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}} \sum_{i=1}^B \bar{\hat{x}}_i
   $$
5. **Gradient with Respect to Input $x_i$:**
   $$
   \bar{x}_i = \frac{\partial \mathcal{L}}{\partial x_i} = \bar{\hat{x}}_i \cdot \frac{1}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}} + \frac{\partial \mathcal{L}}{\partial \sigma_{\mathcal{B}}^2} \cdot \frac{2(x_i - \mu_{\mathcal{B}})}{B} + \frac{\partial \mathcal{L}}{\partial \mu_{\mathcal{B}}} \cdot \frac{1}{B}
   $$
   Factoring out $\frac{1}{B \sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}$:
   $$
   \frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{B \sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}} \left[ B \bar{y}_i - \sum_{j=1}^B \bar{y}_j - \hat{x}_i \sum_{j=1}^B \bar{y}_j \hat{x}_j \right]
   $$

---

## 9.3 Layer Normalization (Ba, Kiros, & Hinton, 2016)

While BatchNorm excels in feedforward vision models with large batch sizes, it suffers from two major limitations:
1. **Small Batch Vulnerability:** When batch size is small ($B \le 4$), empirical variance estimates $\sigma_{\mathcal{B}}^2$ are noisy, degrading accuracy.
2. **Sequential / Variable-Length Inputs:** In Recurrent Neural Networks (RNNs) and Transformers, sequence lengths vary dynamically across samples, making cross-batch statistical aggregation awkward and non-causal.

To resolve these limitations, Jimmy Ba, Jamie Ryan Kiros, and Geoffrey Hinton (2016) introduced **Layer Normalization**.

```
         Comparison of Normalization Geometric Slicing Patterns
         
     Batch Normalization (BN)          Layer Normalization (LN)
     (Normalized across Batch B)       (Normalized across Channels C)
     
        C                                 C
        ^  +---+---+---+                  ^  +---+---+---+
        |  | * |   |   |                  |  | * | * | * |  <-- All channels of
        |  | * |   |   |                  |  +---+---+---+      sample 1
        |  | * |   |   |                  |  |   |   |   |
        +--+---+---+---+---> B            +--+---+---+---+---> B
             ^                                 ^
             One channel across samples        One sample across channels
```

### 9.3.1 Mathematical Formulation of LayerNorm

Unlike BatchNorm, which normalizes across the batch dimension $B$ for a single channel, **LayerNorm normalizes across all feature channels $D$ for a single individual sample**:
$$
\mu^{(i)} = \frac{1}{D} \sum_{j=1}^D x_j^{(i)}
$$
$$
(\sigma^{(i)})^2 = \frac{1}{D} \sum_{j=1}^D (x_j^{(i)} - \mu^{(i)})^2
$$
$$
\hat{x}_j^{(i)} = \frac{x_j^{(i)} - \mu^{(i)}}{\sqrt{(\sigma^{(i)})^2 + \epsilon}}
$$
$$
y_j^{(i)} = \gamma_j \hat{x}_j^{(i)} + \beta_j
$$

#### Fundamental Advantages:
1. **Batch Size Invariance:** LayerNorm performs the exact same computation whether $B = 1$, $B = 32$, or $B = 1000$. Training and inference execution paths are **completely identical**, with no need to maintain running statistics!
2. **Independence Across Time Steps:** In sequential modeling and Transformers, LayerNorm normalizes each token embedding independently, preserving temporal causality.
3. **The Bedrock of Modern Transformers:** LayerNorm (and its simplified descendant RMSNorm) is the foundational architectural stabilizer in GPT-3, GPT-4, LLaMA, Gemini, and deep RL policies.

---

## 9.4 Group Normalization and Instance Normalization

To complete the normalization taxonomy, two intermediate paradigms bridge the gap between BatchNorm and LayerNorm.

```
       The Full Normalization Taxonomy for 4D Image Tensors (B, C, H, W)
       
    Batch Norm (BN)       Layer Norm (LN)       Instance Norm (IN)    Group Norm (GN)
    Across (B, H, W)      Across (C, H, W)      Across (H, W) only    Across (G, H, W)
     per channel           per sample            per sample/channel    per group of channels
```

1. **Instance Normalization (Ulyanov et al., 2016):** Normalizes each channel of each individual sample independently across spatial dimensions $(H, W)$. Originally designed for **artistic style transfer**, where contrast and luminance variations across individual images should be discarded without affecting semantic content.
2. **Group Normalization (Wu & He, 2018):** Divides the $C$ channels into $G$ disjoint groups of size $C / G$ (typically $G = 32$). Normalization is computed across the channels within each group and spatial dimensions $(H, W)$ per sample. GroupNorm provides batch-size-independent training for high-resolution computer vision (object detection, video segmentation) where GPU memory limits batch sizes to $B = 1$ or $2$.
3. **RMSNorm (Zhang & Sennrich, 2019):** Simplifies LayerNorm by assuming that mean centering ($\mu = 0$) contributes negligible regularization, retaining only Root Mean Square scaling:
   $$
   \operatorname{RMS}(\mathbf{x}) = \sqrt{\frac{1}{D} \sum_{i=1}^D x_i^2 + \epsilon}, \quad y_i = \gamma_i \frac{x_i}{\operatorname{RMS}(\mathbf{x})}
   $$
   RMSNorm reduces FLOPs and memory round-trips by $7\%$ to $15\%$, adopted in LLaMA-1, LLaMA-2, LLaMA-3, and Gemma.

---

## 9.5 Exactly 10 Worked Examples

### Example 9.1: Step-by-Step Batch Normalization Forward Pass
**Problem Statement:**  
Consider a 1D feature channel across a mini-batch of $B = 3$ samples: $\mathbf{x} = [2.0, 4.0, 6.0]^T$.  
Let learnable parameters be $\gamma = 1.5, \beta = 0.5$, with $\epsilon = 0.0$.  
Compute the sample mean $\mu_{\mathcal{B}}$, variance $\sigma_{\mathcal{B}}^2$, normalized values $\hat{\mathbf{x}}$, and scaled outputs $\mathbf{y}$.

**Step-by-Step Solution:**  
1. **Batch Mean:**
   $$
   \mu_{\mathcal{B}} = \frac{2.0 + 4.0 + 6.0}{3} = \frac{12.0}{3} = 4.0
   $$

2. **Batch Variance:**
   $$
   \sigma_{\mathcal{B}}^2 = \frac{(2 - 4)^2 + (4 - 4)^2 + (6 - 4)^2}{3} = \frac{(-2)^2 + 0^2 + 2^2}{3} = \frac{4 + 0 + 4}{3} = \frac{8}{3} \approx 2.66667
   $$
   Standard deviation: $\sigma = \sqrt{8/3} \approx 1.63299$.

3. **Normalized Activations $\hat{\mathbf{x}}$:**
   - $\hat{x}_1 = \frac{2.0 - 4.0}{\sqrt{8/3}} = \frac{-2.0}{1.63299} \approx -1.22474$.
   - $\hat{x}_2 = \frac{4.0 - 4.0}{\sqrt{8/3}} = 0.0$.
   - $\hat{x}_3 = \frac{6.0 - 4.0}{\sqrt{8/3}} = \frac{+2.0}{1.63299} \approx +1.22474$.
   $$
   \hat{\mathbf{x}} = [-1.22474, \; 0.0, \; +1.22474]^T
   $$
   Check: Mean of $\hat{\mathbf{x}}$ is $0$, and variance is $\frac{(-1.22474)^2 + 0 + (1.22474)^2}{3} = \frac{1.5 + 1.5}{3} = 1.0$.

4. **Scale and Shift:**
   - $y_1 = \gamma \hat{x}_1 + \beta = 1.5(-1.22474) + 0.5 = -1.83711 + 0.5 = -1.33711$.
   - $y_2 = 1.5(0.0) + 0.5 = 0.50000$.
   - $y_3 = 1.5(+1.22474) + 0.5 = +1.83711 + 0.5 = +2.33711$.
   $$
   \mathbf{y} = [-1.33711, \; 0.50000, \; +2.33711]^T
   $$

---

### Example 9.2: Step-by-Step Batch Normalization Backward Pass
**Problem Statement:**  
Using the values from Example 9.1 ($\hat{\mathbf{x}} = [-1.22474, 0.0, 1.22474]^T, \sigma = 1.63299, \gamma = 1.5$), let incoming loss gradients be $\bar{\mathbf{y}} = [1.0, 2.0, -1.0]^T$.  
Compute:
1. $\frac{\partial \mathcal{L}}{\partial \gamma}$ and $\frac{\partial \mathcal{L}}{\partial \beta}$
2. The input gradient vector $\bar{\mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}}$ using the closed-form formula.

**Step-by-Step Solution:**  
1. **Gradients with Respect to Parameters:**
   $$
   \frac{\partial \mathcal{L}}{\partial \beta} = \sum_{i=1}^3 \bar{y}_i = 1.0 + 2.0 + (-1.0) = 2.0
   $$
   $$
   \frac{\partial \mathcal{L}}{\partial \gamma} = \sum_{i=1}^3 \bar{y}_i \hat{x}_i = 1.0(-1.22474) + 2.0(0.0) + (-1.0)(1.22474) = -2.44948
   $$

2. **Input Gradients via Fused Formula:**
   $$
   \bar{x}_i = \frac{\gamma}{B \sigma} \left[ B \bar{y}_i - \sum_{j=1}^B \bar{y}_j - \hat{x}_i \sum_{j=1}^B \bar{y}_j \hat{x}_j \right]
   $$
   - Scale factor: $\frac{\gamma}{B \sigma} = \frac{1.5}{3 \times 1.63299} = \frac{1.5}{4.89897} \approx 0.306186$.
   - Common term 1: $\sum \bar{y} = 2.0$.
   - Common term 2: $\sum \bar{y} \hat{x} = -2.44948$.
   - For $i = 1$:
     $$
     \text{Bracket}_1 = 3(1.0) - 2.0 - (-1.22474)(-2.44948) = 1.0 - (3.00000) = -2.00000
     $$
     $$
     \bar{x}_1 = 0.306186 \times (-2.00000) \approx -0.61237
     $$
   - For $i = 2$:
     $$
     \text{Bracket}_2 = 3(2.0) - 2.0 - (0.0)(-2.44948) = 6.0 - 2.0 - 0 = +4.00000
     $$
     $$
     \bar{x}_2 = 0.306186 \times (4.00000) \approx +1.22474
     $$
   - For $i = 3$:
     $$
     \text{Bracket}_3 = 3(-1.0) - 2.0 - (1.22474)(-2.44948) = -5.0 - (-3.00000) = -2.00000
     $$
     $$
     \bar{x}_3 = 0.306186 \times (-2.00000) \approx -0.61237
     $$
   Notice that $\sum_{i=1}^3 \bar{x}_i = -0.61237 + 1.22474 - 0.61237 = 0.00000$. The gradient sum is identically zero!

---

### Example 9.3: Layer Normalization on a Single Sample Vector
**Problem Statement:**  
Let an embedding vector for a single token in a Transformer be $\mathbf{x} = [1.0, 3.0, 5.0, 7.0]^T \in \mathbb{R}^4$.  
Let learnable parameters be $\boldsymbol{\gamma} = [1, 1, 1, 1]^T, \boldsymbol{\beta} = [0, 0, 0, 0]^T$ with $\epsilon = 0.0$.  
Compute the LayerNorm output $\mathbf{y}$.

**Step-by-Step Solution:**  
1. **Compute Sample Mean across Channels:**
   $$
   \mu = \frac{1.0 + 3.0 + 5.0 + 7.0}{4} = \frac{16.0}{4} = 4.0
   $$

2. **Compute Sample Variance across Channels:**
   $$
   \sigma^2 = \frac{(1 - 4)^2 + (3 - 4)^2 + (5 - 4)^2 + (7 - 4)^2}{4} = \frac{(-3)^2 + (-1)^2 + 1^2 + 3^2}{4} = \frac{9 + 1 + 1 + 9}{4} = \frac{20}{4} = 5.0
   $$
   Standard deviation: $\sigma = \sqrt{5.0} \approx 2.23607$.

3. **Normalize and Scale:**
   $$
   y_1 = \frac{1.0 - 4.0}{2.23607} = \frac{-3.0}{2.23607} \approx -1.34164
   $$
   $$
   y_2 = \frac{3.0 - 4.0}{2.23607} = \frac{-1.0}{2.23607} \approx -0.44721
   $$
   $$
   y_3 = \frac{5.0 - 4.0}{2.23607} = \frac{+1.0}{2.23607} \approx +0.44721
   $$
   $$
   y_4 = \frac{7.0 - 4.0}{2.23607} = \frac{+3.0}{2.23607} \approx +1.34164
   $$
   $$
   \mathbf{y} = [-1.34164, \; -0.44721, \; +0.44721, \; +1.34164]^T
   $$

---

### Example 9.4: Fusing Batch Normalization into a Conv2D / Linear Layer
**Problem Statement:**  
A linear layer computes $\mathbf{z} = \mathbf{W} \mathbf{x} + \mathbf{b}$, immediately followed by a frozen inference BatchNorm layer:
$$
\mathbf{y} = \boldsymbol{\gamma} \odot \left( \frac{\mathbf{z} - \boldsymbol{\mu}}{\sqrt{\boldsymbol{\sigma}^2 + \epsilon}} \right) + \boldsymbol{\beta}
$$
Derive the formulas for the equivalent fused weight matrix $\mathbf{W}_{\text{fused}}$ and fused bias vector $\mathbf{b}_{\text{fused}}$ such that $\mathbf{y} = \mathbf{W}_{\text{fused}} \mathbf{x} + \mathbf{b}_{\text{fused}}$.

**Step-by-Step Solution:**  
1. **Substitute Linear Equation into BatchNorm:**
   For feature coordinate $i$:
   $$
   y_i = \gamma_i \left( \frac{(\mathbf{w}_i^T \mathbf{x} + b_i) - \mu_i}{\sqrt{\sigma_i^2 + \epsilon}} \right) + \beta_i
   $$

2. **Rearrange Affine Terms:**
   $$
   y_i = \left( \frac{\gamma_i}{\sqrt{\sigma_i^2 + \epsilon}} \right) (\mathbf{w}_i^T \mathbf{x}) + \left[ \beta_i + \frac{\gamma_i (b_i - \mu_i)}{\sqrt{\sigma_i^2 + \epsilon}} \right]
   $$

3. **Identify Fused Parameters:**
   Let scale scalar be $\alpha_i = \frac{\gamma_i}{\sqrt{\sigma_i^2 + \epsilon}}$.
   - **Fused Weight Row:**
     $$
     \mathbf{w}_{i, \text{fused}} = \alpha_i \mathbf{w}_i = \frac{\gamma_i}{\sqrt{\sigma_i^2 + \epsilon}} \mathbf{w}_i
     $$
   - **Fused Bias Component:**
     $$
     b_{i, \text{fused}} = \beta_i + \frac{\gamma_i (b_i - \mu_i)}{\sqrt{\sigma_i^2 + \epsilon}}
     $$
   During model deployment, all BatchNorm layers in a network can be erased and absorbed into preceding convolutions/dense projections, reducing inference latency by $10\%$ to $25\%$.

---

### Example 9.5: Running Statistics Update Trace during Training
**Problem Statement:**  
A BatchNorm layer has initial running statistics $\mu_{\text{run}} = 0.0$ and $\sigma_{\text{run}}^2 = 1.0$. The momentum parameter is $\alpha = 0.1$.  
Over the first two training batches of size $B = 10$, the observed mini-batch statistics are:
- Batch 1: $\mu_1 = 3.0, \sigma_1^2 = 4.0$
- Batch 2: $\mu_2 = 2.0, \sigma_2^2 = 5.0$
Compute the updated running statistics after each batch.

**Step-by-Step Solution:**  
Bessel sample correction factor: $\frac{B}{B - 1} = \frac{10}{9} \approx 1.11111$.
1. **After Batch 1:**
   - Unbiased batch variance: $s_1^2 = 4.0 \times \frac{10}{9} \approx 4.44444$.
   - Running mean:
     $$
     \mu_{\text{run}}^{(1)} = (1 - 0.1)(0.0) + 0.1(3.0) = 0.30
     $$
   - Running variance:
     $$
     (\sigma_{\text{run}}^2)^{(1)} = (1 - 0.1)(1.0) + 0.1(4.44444) = 0.90 + 0.44444 = 1.34444
     $$

2. **After Batch 2:**
   - Unbiased batch variance: $s_2^2 = 5.0 \times \frac{10}{9} \approx 5.55556$.
   - Running mean:
     $$
     \mu_{\text{run}}^{(2)} = (1 - 0.1)(0.30) + 0.1(2.0) = 0.27 + 0.20 = 0.47
     $$
   - Running variance:
     $$
     (\sigma_{\text{run}}^2)^{(2)} = (1 - 0.1)(1.34444) + 0.1(5.55556) = 1.21000 + 0.55556 = 1.76556
     $$

---

### Example 9.6: RMSNorm Forward Pass Calculation
**Problem Statement:**  
An input vector to a Transformer layer is $\mathbf{x} = [3.0, -4.0, 0.0, 5.0]^T \in \mathbb{R}^4$. Learnable weights are $\boldsymbol{\gamma} = [1, 1, 1, 1]^T$ and $\epsilon = 0.0$.  
Compute the RMSNorm output.

**Step-by-Step Solution:**  
1. **Compute Root Mean Square:**
   $$
   \operatorname{RMS}(\mathbf{x}) = \sqrt{\frac{1}{4} (3^2 + (-4)^2 + 0^2 + 5^2)} = \sqrt{\frac{1}{4} (9 + 16 + 0 + 25)} = \sqrt{\frac{50}{4}} = \sqrt{12.5} \approx 3.53553
   $$

2. **Scale Activation Vector:**
   $$
   y_1 = \frac{3.0}{3.53553} \approx 0.84853
   $$
   $$
   y_2 = \frac{-4.0}{3.53553} \approx -1.13137
   $$
   $$
   y_3 = \frac{0.0}{3.53553} = 0.0
   $$
   $$
   y_4 = \frac{5.0}{3.53553} \approx 1.41421
   $$
   $$
   \mathbf{y} = [0.84853, \; -1.13137, \; 0.0, \; 1.41421]^T
   $$
   Notice that the mean of $\mathbf{y}$ is not zero ($0.84853 - 1.13137 + 1.41421 = 1.13137 \neq 0$), confirming that RMSNorm scales magnitude without centering.

---

### Example 9.7: Group Normalization Channel Partitioning
**Problem Statement:**  
An image tensor feature map has shape $(B, C, H, W) = (1, 6, 2, 2)$.  
The 6 channel activations at spatial positions are given by the flat matrix of channel slices.  
If Group Normalization is applied with $G = 2$ groups, state the dimensions across which mean and variance are calculated for Group 1 and Group 2.

**Step-by-Step Solution:**  
1. **Group Sizing:**
   Total channels $C = 6$. Number of groups $G = 2$.  
   Channels per group: $C / G = 6 / 2 = 3$ channels.
   - Group 1 consists of channels $\{0, 1, 2\}$.
   - Group 2 consists of channels $\{3, 4, 5\}$.

2. **Reduction Dimensions:**
   For each individual sample in the batch, GroupNorm computes $\mu$ and $\sigma^2$ across:
   - $(C / G) \times H \times W = 3 \times 2 \times 2 = 12$ elements.
   Each group of 3 channels is normalized jointly over its 12 spatial-channel values, completely independent of other samples in the batch.

---

### Example 9.8: Why Pre-LN is Preferred Over Post-LN in Deep Transformers
**Problem Statement:**  
Contrast the two Transformer layer normalization placements:
- **Post-LN:** $\mathbf{x}_{l} = \operatorname{LN}(\mathbf{x}_{l-1} + \operatorname{Sublayer}(\mathbf{x}_{l-1}))$
- **Pre-LN:** $\mathbf{x}_{l} = \mathbf{x}_{l-1} + \operatorname{Sublayer}(\operatorname{LN}(\mathbf{x}_{l-1}))$
Explain why deep Transformers ($> 24$ layers) trained with Post-LN suffer from vanishing gradients at early layers, requiring strict warmup, while Pre-LN allows warmupless training.

**Step-by-Step Solution:**  
1. **Gradient Flow in Post-LN (Xiong et al., 2020):**
   In Post-LN, the identity skip connection passes through the normalization operator at every block:
   $$
   \mathbf{x}_L = \operatorname{LN}(\mathbf{x}_{L-1} + \mathcal{F}_L)
   $$
   The backward gradient recurrence scales as:
   $$
   \frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_0} \propto \prod_{l=1}^L \frac{1}{\sqrt{\operatorname{Var}(\mathbf{x}_{l-1} + \mathcal{F}_l)}}
   $$
   As depth $L$ grows, the denominator compounds, attenuating gradients for early layers. Without a fragile warmup schedule, training diverges immediately.

2. **Gradient Flow in Pre-LN:**
   In Pre-LN, the identity skip connection is completely unencumbered by normalization:
   $$
   \mathbf{x}_L = \mathbf{x}_0 + \sum_{l=1}^L \mathcal{F}_l(\operatorname{LN}(\mathbf{x}_{l-1}))
   $$
   The gradient with respect to input $\mathbf{x}_0$ is:
   $$
   \frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_0} = \mathbf{I} + \sum_{l=1}^L \frac{\partial \mathcal{F}_l}{\partial \mathbf{x}_0}
   $$
   The leading identity matrix $\mathbf{I}$ guarantees that error signals flow directly to the very first layer without attenuation, enabling training of 100+ layer Transformers without learning rate warmup.

---

### Example 9.9: Gradient Orthogonality in Batch Normalization
**Problem Statement:**  
Prove analytically that the input gradient vector $\bar{\mathbf{x}} = \nabla_{\mathbf{x}} \mathcal{L}$ of a BatchNorm layer is orthogonal to both the unit vector $\mathbf{1}$ and the normalized activation vector $\hat{\mathbf{x}}$:
1. $\bar{\mathbf{x}}^T \mathbf{1} = 0$
2. $\bar{\mathbf{x}}^T \hat{\mathbf{x}} = 0$

**Step-by-Step Solution:**  
From Section 9.2.3:
$$
\bar{x}_i = c \left[ B \bar{y}_i - \sum_{j=1}^B \bar{y}_j - \hat{x}_i \sum_{j=1}^B \bar{y}_j \hat{x}_j \right]
$$
where $c = \frac{\gamma}{B \sqrt{\sigma^2 + \epsilon}}$.

1. **Orthogonality to $\mathbf{1}$ ($\sum_{i=1}^B \bar{x}_i = 0$):**
   $$
   \sum_{i=1}^B \bar{x}_i = c \left[ B \sum_{i=1}^B \bar{y}_i - \sum_{i=1}^B \left(\sum_{j=1}^B \bar{y}_j\right) - \left(\sum_{i=1}^B \hat{x}_i\right) \sum_{j=1}^B \bar{y}_j \hat{x}_j \right]
   $$
   Since $\sum_{i=1}^B \left(\sum_j \bar{y}_j\right) = B \sum \bar{y}$, and $\sum \hat{x}_i = 0$:
   $$
   \sum_{i=1}^B \bar{x}_i = c [ B \sum \bar{y} - B \sum \bar{y} - 0 ] = 0 \quad \blacksquare
   $$

2. **Orthogonality to $\hat{\mathbf{x}}$ ($\sum_{i=1}^B \bar{x}_i \hat{x}_i = 0$):**
   $$
   \sum_{i=1}^B \bar{x}_i \hat{x}_i = c \left[ B \sum_{i=1}^B \bar{y}_i \hat{x}_i - \left(\sum_{j=1}^B \bar{y}_j\right) \sum_{i=1}^B \hat{x}_i - \left(\sum_{i=1}^B \hat{x}_i^2\right) \sum_{j=1}^B \bar{y}_j \hat{x}_j \right]
   $$
   Notice that $\sum \hat{x}_i = 0$, and by definition of variance $\frac{1}{B} \sum \hat{x}_i^2 = 1 \implies \sum_{i=1}^B \hat{x}_i^2 = B$:
   $$
   \sum_{i=1}^B \bar{x}_i \hat{x}_i = c \left[ B \sum \bar{y} \hat{x} - 0 - B \sum \bar{y} \hat{x} \right] = 0 \quad \blacksquare
   $$
   Because $\bar{\mathbf{x}} \perp \mathbf{1}$ and $\bar{\mathbf{x}} \perp \hat{\mathbf{x}}$, gradient descent cannot change the mean or the scale of the pre-activations.

---

### Example 9.10: Self-Regulating Scale Property of Normalized Networks
**Problem Statement:**  
Let a layer compute $\mathbf{y} = \operatorname{BN}(\mathbf{W} \mathbf{x})$.  
Show that scaling the weight matrix by an arbitrary positive scalar $\alpha > 0$ ($\mathbf{W}' = \alpha \mathbf{W}$):
1. Leaves the forward activation $\mathbf{y}$ completely unchanged.
2. Scales the gradient by $\frac{1}{\alpha}$: $\nabla_{\mathbf{W}'} \mathcal{L} = \frac{1}{\alpha} \nabla_{\mathbf{W}} \mathcal{L}$.

**Step-by-Step Solution:**  
1. **Forward Pass Invariance:**
   Let $\mathbf{z}' = (\alpha \mathbf{W}) \mathbf{x} = \alpha (\mathbf{W} \mathbf{x}) = \alpha \mathbf{z}$.
   - Mean: $\mu_{\mathbf{z}'} = \frac{1}{B} \sum \alpha z_i = \alpha \mu_{\mathbf{z}}$.
   - Variance: $\sigma_{\mathbf{z}'}^2 = \frac{1}{B} \sum (\alpha z_i - \alpha \mu_{\mathbf{z}})^2 = \alpha^2 \sigma_{\mathbf{z}}^2 \implies \sigma_{\mathbf{z}'} = \alpha \sigma_{\mathbf{z}}$.
   - Normalized activation:
     $$
     \hat{z}'_i = \frac{\alpha z_i - \alpha \mu_{\mathbf{z}}}{\alpha \sigma_{\mathbf{z}}} = \frac{\alpha(z_i - \mu_{\mathbf{z}})}{\alpha \sigma_{\mathbf{z}}} = \hat{z}_i
     $$
   Since $\hat{\mathbf{z}}' = \hat{\mathbf{z}}$, the forward output $\mathbf{y} = \gamma \hat{\mathbf{z}} + \beta$ is completely invariant to $\alpha$!

2. **Gradient Scaling:**
   Using the chain rule:
   $$
   \frac{\partial \mathcal{L}}{\partial \mathbf{W}'} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}'} \mathbf{x}^T = \left( \frac{\partial \mathbf{z}}{\partial \mathbf{z}'} \frac{\partial \mathcal{L}}{\partial \mathbf{z}} \right) \mathbf{x}^T
   $$
   Since $\mathbf{z} = \frac{1}{\alpha} \mathbf{z}' \implies \frac{\partial \mathbf{z}}{\partial \mathbf{z}'} = \frac{1}{\alpha}$:
   $$
   \frac{\partial \mathcal{L}}{\partial \mathbf{W}'} = \frac{1}{\alpha} \left( \frac{\partial \mathcal{L}}{\partial \mathbf{z}} \mathbf{x}^T \right) = \frac{1}{\alpha} \frac{\partial \mathcal{L}}{\partial \mathbf{W}} \quad \blacksquare
   $$
   If weights grow large ($\alpha \gg 1$), their gradients automatically shrink ($\propto 1/\alpha$), stabilizing gradient descent without manual intervention.

---

## 9.6 Exactly 10 Solved Exercises

### Exercise 9.1: Batch Normalization on Correlated Samples
**Problem Statement:**  
Explain why Batch Normalization fails when mini-batches consist of highly correlated samples (e.g., in reinforcement learning trajectory rollouts or small mini-batch contrastive learning).

**Detailed Solution:**  
1. **The i.i.d. Assumption in BatchNorm:**
   BatchNorm assumes that the mini-batch $\mathcal{B}$ is a representative, independent, and identically distributed (i.i.d.) sample of the entire population distribution $p_{\text{data}}$.
2. **Correlated Sample Failure:**
   In an RL trajectory, consecutive frames $\mathbf{s}_t, \mathbf{s}_{t+1}, \dots$ are highly correlated (e.g., all frames share a dark background). The batch mean $\mu_{\mathcal{B}}$ reflects the local episode rather than the global environment. Normalizing by local batch statistics removes meaningful state variations.
3. **Training-Inference Mismatch:**
   During training, activations are normalized relative to other correlated trajectory frames. At inference, an individual state is normalized using global running statistics $\mu_{\text{run}}$. This structural mismatch between training and inference causes policy failure, which is why RL policies universally prefer LayerNorm.

---

### Exercise 9.2: Memory Overhead of Batch Normalization Backward Pass
**Problem Statement:**  
A convolutional feature map has shape $(B, C, H, W) = (64, 128, 56, 56)$ stored in FP32.  
Compute the memory required to cache the intermediate activations needed to compute the BatchNorm backward pass.

**Detailed Solution:**  
1. **Cached Elements:**
   To evaluate the backward pass equations derived in Section 9.2.3, the engine must cache:
   - Normalized tensor $\hat{\mathbf{X}} \in \mathbb{R}^{B \times C \times H \times W}$ (or original pre-activation $\mathbf{X}$).
   - Batch standard deviations $\boldsymbol{\sigma}_{\mathcal{B}} \in \mathbb{R}^C$.
2. **Memory Calculation:**
   $$
   N = 64 \times 128 \times 56 \times 56 = 25,690,112 \text{ elements}
   $$
   Memory in bytes:
   $$
   \text{Bytes} = 25,690,112 \times 4 \text{ bytes} = 102,760,448 \text{ bytes} \approx 102.76 \text{ MB}
   $$
   Caching activations for a single BatchNorm layer across a batch of 64 images consumes over $100 \text{ MB}$ of GPU memory.

---

### Exercise 9.3: LayerNorm Scale Invariance Proof
**Problem Statement:**  
Prove that Layer Normalization is invariant to both affine scaling and shifting of the input vector:
$$
\operatorname{LN}(\alpha \mathbf{x} + \beta \mathbf{1}) = \operatorname{LN}(\mathbf{x}) \quad \forall \alpha > 0, \; \beta \in \mathbb{R}
$$

**Detailed Solution:**  
1. **Let $\mathbf{x}' = \alpha \mathbf{x} + \beta \mathbf{1}$:**
   - Channel mean:
     $$
     \mu' = \frac{1}{D} \sum_{i=1}^D (\alpha x_i + \beta) = \alpha \left( \frac{1}{D} \sum_{i=1}^D x_i \right) + \beta = \alpha \mu + \beta
     $$
   - Centered components:
     $$
     x'_i - \mu' = (\alpha x_i + \beta) - (\alpha \mu + \beta) = \alpha (x_i - \mu)
     $$
   - Channel variance:
     $$
     (\sigma')^2 = \frac{1}{D} \sum_{i=1}^D (x'_i - \mu')^2 = \frac{1}{D} \sum_{i=1}^D \alpha^2 (x_i - \mu)^2 = \alpha^2 \sigma^2 \implies \sigma' = \alpha \sigma
     $$

2. **Normalized Activation:**
   $$
   \hat{x}'_i = \frac{x'_i - \mu'}{\sigma'} = \frac{\alpha (x_i - \mu)}{\alpha \sigma} = \frac{x_i - \mu}{\sigma} = \hat{x}_i \quad \blacksquare
   $$
   The output is completely invariant to both global shifts and scalings of the input vector.

---

### Exercise 9.4: Batch Normalization with Batch Size $B = 1$
**Problem Statement:**  
What happens if standard Batch Normalization is applied during training with a mini-batch size of $B = 1$?

**Detailed Solution:**  
1. **Evaluating Mean and Variance for $B = 1$:**
   Let the single sample have scalar value $x_1$:
   $$
   \mu_{\mathcal{B}} = x_1
   $$
   $$
   \sigma_{\mathcal{B}}^2 = \frac{1}{1} (x_1 - x_1)^2 = 0
   $$
2. **Normalized Value:**
   $$
   \hat{x}_1 = \frac{x_1 - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}} = \frac{x_1 - x_1}{\sqrt{0 + \epsilon}} = \frac{0}{\sqrt{\epsilon}} = 0
   $$
3. **Scaled Output:**
   $$
   y_1 = \gamma (0) + \beta = \beta
   $$
   Every single sample in the universe outputs the exact same constant $\beta$ regardless of input! The feature information is entirely annihilated. Hence, BatchNorm cannot be trained with batch size 1.

---

### Exercise 9.5: RMSNorm Gradient Derivation
**Problem Statement:**  
Given RMSNorm: $y_i = \gamma_i \frac{x_i}{\operatorname{RMS}(\mathbf{x})}$ where $\operatorname{RMS}(\mathbf{x}) = \sqrt{\frac{1}{D} \sum_{k=1}^D x_k^2 + \epsilon}$.  
Derive the gradient $\bar{x}_i = \frac{\partial \mathcal{L}}{\partial x_i}$ in terms of incoming adjoints $\bar{y}_i$.

**Detailed Solution:**  
1. **Let $R = \operatorname{RMS}(\mathbf{x})$ and $\hat{x}_i = \frac{x_i}{R}$:**
   Then $y_i = \gamma_i \hat{x}_i \implies \bar{\hat{x}}_i = \gamma_i \bar{y}_i$.

2. **Differentiate $R$ with Respect to $x_i$:**
   $$
   \frac{\partial R}{\partial x_i} = \frac{1}{2 R} \cdot \frac{2 x_i}{D} = \frac{x_i}{D R}
   $$

3. **Differentiate $\hat{x}_j$ with Respect to $x_i$:**
   $$
   \frac{\partial \hat{x}_j}{\partial x_i} = \frac{\partial}{\partial x_i}\left(\frac{x_j}{R}\right) = \frac{\delta_{ij} R - x_j \frac{\partial R}{\partial x_i}}{R^2} = \frac{\delta_{ij}}{R} - \frac{x_j x_i}{D R^3}
   $$

4. **Assemble Gradient $\bar{x}_i$:**
   $$
   \bar{x}_i = \sum_{j=1}^D \bar{\hat{x}}_j \frac{\partial \hat{x}_j}{\partial x_i} = \frac{\bar{\hat{x}}_i}{R} - \frac{x_i}{D R^3} \sum_{j=1}^D \bar{\hat{x}}_j x_j = \frac{1}{R} \left[ \bar{\hat{x}}_i - \frac{\hat{x}_i}{D} \sum_{j=1}^D \bar{\hat{x}}_j \hat{x}_j \right] \quad \blacksquare
   $$
   Compared to LayerNorm (Section 9.3), RMSNorm eliminates the $\sum \bar{\hat{x}}$ mean subtraction term, saving instructions and register pressure in GPU kernels.

---

### Exercise 9.6: Instance Normalization vs. Style Content Removal
**Problem Statement:**  
In convolutional feature maps representing images, explain mathematically why Instance Normalization removes image style (contrast, brightness, color wash) while preserving semantic content (edges, shapes).

**Detailed Solution:**  
1. **Gram Matrix Representation of Style (Gatys et al., 2016):**
   The artistic style of an image is captured by the spatial correlations between feature channels:
   $$
   G_{ij} = \sum_{h, w} F_{i, h, w} F_{j, h, w}
   $$
   The mean channel intensity $\mu_c = \frac{1}{HW} \sum F_{c, h, w}$ represents global color saturation/brightness, while variance $\sigma_c^2$ represents image contrast.
2. **Action of Instance Normalization:**
   InstanceNorm computes $\mu_{b, c}$ and $\sigma_{b, c}^2$ per individual image and channel, normalizing them to 0 and 1:
   $$
   \hat{F}_{b, c, h, w} = \frac{F_{b, c, h, w} - \mu_{b, c}}{\sigma_{b, c}}
   $$
   This strips the image-specific contrast and lighting variations $(\mu, \sigma)$ while retaining spatial activation ratios $\frac{F(x, y)}{\sigma}$, which encode geometric shape boundaries and edges.

---

### Exercise 9.7: Group Normalization Interpolation Property
**Problem Statement:**  
Show that Group Normalization with $G$ groups encompasses both Layer Normalization and Instance Normalization as extreme boundary cases.

**Detailed Solution:**  
1. **Group Size Specification:**
   Let total channels be $C$. GroupNorm groups channels into $G$ sets of size $C / G$.
2. **Boundary Case 1: $G = 1$:**
   All channels belong to a single group ($C / G = C$). Normalization is computed across all channels $C$ and spatial coordinates $(H, W)$ for each sample. This is **Layer Normalization**!
3. **Boundary Case 2: $G = C$:**
   Each group consists of exactly 1 channel ($C / G = 1$). Normalization is computed across spatial coordinates $(H, W)$ independently for each individual channel and sample. This is **Instance Normalization**!
4. **Intermediate Case ($1 < G < C$):**
   GroupNorm smoothly interpolates between LayerNorm and InstanceNorm, capturing intra-group channel correlations while remaining invariant to batch size.

---

### Exercise 9.8: Ghost Batch Normalization
**Problem Statement:**  
In large-batch distributed training (e.g., $B = 4096$), standard BatchNorm loses its stochastic regularization effect. Hoffer et al. (2017) introduced **Ghost Batch Normalization**. Define Ghost BatchNorm and explain its regularization mechanism.

**Detailed Solution:**  
1. **Definition of Ghost BatchNorm:**
   Instead of computing normalization statistics over the entire physical batch of size $B = 4096$, Ghost BatchNorm splits the batch into smaller "virtual" (ghost) chunks of size $B_{\text{ghost}} \approx 32$ or $64$.  
   Each ghost batch calculates its own mean $\mu_{\text{ghost}}$ and variance $\sigma_{\text{ghost}}^2$ independently.
2. **Regularization Mechanism:**
   Mini-batch statistics computed on small slices ($B = 32$) have higher sampling variance:
   $$
   \operatorname{Var}(\mu_{\text{ghost}}) = \frac{\sigma^2}{32} \gg \frac{\sigma^2}{4096}
   $$
   This introduces stochastic noise into the activations during training, acting as a form of multiplicative data augmentation that prevents overfitting in massive distributed clusters.

---

### Exercise 9.9: Weight Normalization (Salimans & Kingma, 2016)
**Problem Statement:**  
Weight Normalization reparameterizes weight vectors as $\mathbf{w} = \frac{g}{\|\mathbf{v}\|_2} \mathbf{v}$, decoupling the Euclidean norm $g = \|\mathbf{w}\|_2$ from the direction vector $\mathbf{v}$.  
Derive $\nabla_{\mathbf{v}} \mathcal{L}$ in terms of $\nabla_{\mathbf{w}} \mathcal{L}$.

**Detailed Solution:**  
1. **Differentiating $\mathbf{w}$ with Respect to $\mathbf{v}$:**
   $$
   \mathbf{w} = g \mathbf{v} (\mathbf{v}^T \mathbf{v})^{-1/2}
   $$
   $$
   \frac{\partial \mathbf{w}}{\partial \mathbf{v}} = \frac{g}{\|\mathbf{v}\|_2} \mathbf{I} - \frac{g}{\|\mathbf{v}\|_2^3} \mathbf{v} \mathbf{v}^T = \frac{g}{\|\mathbf{v}\|_2} \left( \mathbf{I} - \frac{\mathbf{v} \mathbf{v}^T}{\|\mathbf{v}\|_2^2} \right) = \frac{g}{\|\mathbf{v}\|_2} \mathbf{M}_{\mathbf{v}}
   $$
   where $\mathbf{M}_{\mathbf{v}} = \mathbf{I} - \frac{\mathbf{v} \mathbf{v}^T}{\|\mathbf{v}\|_2^2}$ is the orthogonal projection matrix onto the tangent plane of $\mathbf{v}$.

2. **Applying the Chain Rule:**
   $$
   \nabla_{\mathbf{v}} \mathcal{L} = \left( \frac{\partial \mathbf{w}}{\partial \mathbf{v}} \right)^T \nabla_{\mathbf{w}} \mathcal{L} = \frac{g}{\|\mathbf{v}\|_2} \left[ \nabla_{\mathbf{w}} \mathcal{L} - \frac{\mathbf{v}^T \nabla_{\mathbf{w}} \mathcal{L}}{\|\mathbf{v}\|_2^2} \mathbf{v} \right] \quad \blacksquare
   $$
   Weight normalization projects the gradient onto the sphere orthogonal to $\mathbf{v}$ and scales it inversely by $\|\mathbf{v}\|_2$, speeding up convergence without dependencies between samples.

---

### Exercise 9.10: Why Bias Terms are Redundant Before Normalization
**Problem Statement:**  
In modern architectures, any linear or convolutional layer that is immediately followed by Batch Normalization or Layer Normalization has its bias vector set to `bias=False` ($\mathbf{b} = \mathbf{0}$). Prove algebraically that the bias term is completely redundant.

**Detailed Solution:**  
1. **Linear Transformation with Bias:**
   $$
   \mathbf{z} = \mathbf{W} \mathbf{x} + \mathbf{b}
   $$

2. **Evaluating Mean in Normalization:**
   $$
   \mu_{\mathbf{z}} = \frac{1}{M} \sum_{i=1}^M z_i = \frac{1}{M} \sum_{i=1}^M (\mathbf{w}_i^T \mathbf{x} + b_i) = \left( \frac{1}{M} \sum_{i=1}^M \mathbf{w}_i^T \mathbf{x} \right) + \mathbf{b} = \mu_{\mathbf{W} \mathbf{x}} + \mathbf{b}
   $$

3. **Evaluating Centered Activation:**
   $$
   \mathbf{z} - \mu_{\mathbf{z}} = (\mathbf{W} \mathbf{x} + \mathbf{b}) - (\mu_{\mathbf{W} \mathbf{x}} + \mathbf{b}) = \mathbf{W} \mathbf{x} - \mu_{\mathbf{W} \mathbf{x}}
   $$
   The bias term $\mathbf{b}$ cancels out completely in the subtraction!  
   Furthermore, the normalization layer subsequently applies its own learnable shift parameter $\beta$:
   $$
   \mathbf{y} = \gamma \hat{\mathbf{z}} + \beta
   $$
   Including a bias $\mathbf{b}$ in the preceding linear layer wastes parameters and FLOPs without altering the forward or backward pass by even a single bit.
