# Chapter 3: Activation Functions and the Universal Approximation Theorem

> *"A neural network without non-linear activation functions is merely a high-dimensional linear regression in disguise. Non-linearity is the alchemical catalyst that transforms trivial matrix multiplications into universal computing machines."*  
> — **George Cybenko**, *Approximation by Superpositions of a Sigmoidal Function* (1989)

---

## 3.1 The Collapse of Linear Cascades

In the architectural design of artificial neural networks, an immediate question confronts the computational theorist: *What happens if we construct an arbitrarily deep multi-layer neural network using only linear transformations?*

Let an $L$-layer feedforward network receive an input vector $\mathbf{x} \in \mathbb{R}^{d_0}$. At each sequential layer $l \in \{1, 2, \dots, L\}$, let the pre-activation be computed as:
$$
\mathbf{z}^{[l]} = \mathbf{W}^{[l]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}
$$
where $\mathbf{W}^{[l]} \in \mathbb{R}^{d_l \times d_{l-1}}$ is the weight matrix, $\mathbf{b}^{[l]} \in \mathbb{R}^{d_l}$ is the bias vector, and $\mathbf{a}^{[0]} = \mathbf{x}$.

Suppose that at every layer, the activation function is the identity operator:
$$
g^{[l]}(\mathbf{z}^{[l]}) = \mathbf{z}^{[l]} \implies \mathbf{a}^{[l]} = \mathbf{z}^{[l]}
$$

Let us trace the forward mapping for a 3-layer linear network ($L = 3$):
$$
\begin{aligned}
\mathbf{a}^{[1]} &= \mathbf{W}^{[1]} \mathbf{x} + \mathbf{b}^{[1]} \\
\mathbf{a}^{[2]} &= \mathbf{W}^{[2]} \mathbf{a}^{[1]} + \mathbf{b}^{[2]} = \mathbf{W}^{[2]} (\mathbf{W}^{[1]} \mathbf{x} + \mathbf{b}^{[1]}) + \mathbf{b}^{[2]} \\
&= (\mathbf{W}^{[2]} \mathbf{W}^{[1]}) \mathbf{x} + (\mathbf{W}^{[2]} \mathbf{b}^{[1]} + \mathbf{b}^{[2]}) \\
\mathbf{a}^{[3]} &= \mathbf{W}^{[3]} \mathbf{a}^{[2]} + \mathbf{b}^{[3]} = \mathbf{W}^{[3]} \left[ (\mathbf{W}^{[2]} \mathbf{W}^{[1]}) \mathbf{x} + (\mathbf{W}^{[2]} \mathbf{b}^{[1]} + \mathbf{b}^{[2]}) \right] + \mathbf{b}^{[3]} \\
&= (\mathbf{W}^{[3]} \mathbf{W}^{[2]} \mathbf{W}^{[1]}) \mathbf{x} + (\mathbf{W}^{[3]} \mathbf{W}^{[2]} \mathbf{b}^{[1]} + \mathbf{W}^{[3]} \mathbf{b}^{[2]} + \mathbf{b}^{[3]})
\end{aligned}
$$

Because the set of real matrices is closed under matrix multiplication, the composite product $\mathbf{W}' = \mathbf{W}^{[3]} \mathbf{W}^{[2]} \mathbf{W}^{[1]} \in \mathbb{R}^{d_3 \times d_0}$ is itself simply a single linear transformation matrix. Similarly, the accumulated bias terms define a single vector $\mathbf{b}' \in \mathbb{R}^{d_3}$:
$$
\mathbf{b}' = \mathbf{W}^{[3]} \mathbf{W}^{[2]} \mathbf{b}^{[1]} + \mathbf{W}^{[3]} \mathbf{b}^{[2]} + \mathbf{b}^{[3]}
$$

Therefore, the entire 3-layer system collapses identically to:
$$
\mathbf{y} = \mathbf{a}^{[3]} = \mathbf{W}' \mathbf{x} + \mathbf{b}'
$$

By mathematical induction, for any arbitrary depth $L \in \mathbb{N}$:
$$
\mathbf{a}^{[L]} = \left( \prod_{l=1}^L \mathbf{W}^{[l]} \right) \mathbf{x} + \mathbf{b}_{\text{net}} = \mathbf{W}_{\text{effective}} \mathbf{x} + \mathbf{b}_{\text{effective}}
$$

### 3.1.1 The Rank and Expressivity Constraint

The consequences of this algebraic collapse are profound:
1. **Zero Expressive Gain from Depth:** A deep linear neural network with 100 hidden layers and billions of parameters has no greater functional capacity than a single-layer affine model (a standard perceptron or linear regressor). It cannot compute non-linear decision boundaries, cannot model curves, and cannot solve XOR.
2. **Rank Bottlenecks:** By the Sylvester rank inequality, the rank of the composite matrix satisfies:
   $$
   \operatorname{rank}(\mathbf{W}_{\text{effective}}) \le \min_{l \in \{1, \dots, L\}} \operatorname{rank}(\mathbf{W}^{[l]}) \le \min(d_0, d_1, \dots, d_L)
   $$
   If any intermediate layer has dimension $d_k < \min(d_0, d_L)$, the effective transformation is constrained to a low-dimensional subspace of rank at most $d_k$, functioning solely as a low-rank linear matrix factorization (equivalent to classical Principal Component Analysis).

To enable deep networks to learn complex, non-linear representations, we must introduce an element-wise **non-linear activation function** $\sigma: \mathbb{R} \to \mathbb{R}$ between successive linear projections:
$$
\mathbf{a}^{[l]} = \sigma\left(\mathbf{W}^{[l]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}\right)
$$
Because $\sigma(\mathbf{W} \mathbf{x} + \mathbf{b})$ cannot be rewritten as an affine transformation $\mathbf{M} \mathbf{x} + \mathbf{c}$, the algebraic cascade no longer collapses.

---

## 3.2 The Sigmoidal Family

The earliest non-linear activation functions deployed in multi-layer perceptrons were inspired by biological saturation dynamics and statistical physics. They map an unbounded input domain $\mathbb{R}$ onto a bounded interval.

```
       Comparison of Classical Sigmoidal Activation Functions
       
       1.0 +                      ...---*** (tanh asymptotic limit +1.0)
           |                   .-'     *
       0.5 |         .----****-       *  (logistic sigmoid range [0, 1])
           |      .-'    *           *
       0.0 +-----*-------+----------+----------------------------
           |    *   .-'
      -0.5 |   * .-'
           |  * '
      -1.0 +-*--------------------------- (tanh asymptotic limit -1.0)
          -4  -3  -2  -1   0   1   2   3   4
```

### 3.2.1 The Standard Logistic Sigmoid

The standard logistic sigmoid function $\sigma: \mathbb{R} \to (0, 1)$ is defined as:
$$
\sigma(z) = \frac{1}{1 + e^{-z}} = \frac{e^z}{e^z + 1}
$$

#### Key Mathematical Properties:
1. **Asymptotes:**
   $$
   \lim_{z \to +\infty} \sigma(z) = 1, \quad \lim_{z \to -\infty} \sigma(z) = 0
   $$
2. **Symmetry:**
   The function exhibits point reflection symmetry around the coordinate $(0, 0.5)$:
   $$
   1 - \sigma(z) = 1 - \frac{1}{1 + e^{-z}} = \frac{e^{-z}}{1 + e^{-z}} = \frac{1}{e^z + 1} = \sigma(-z)
   $$
3. **First Derivative:**
   The derivative of $\sigma(z)$ with respect to $z$ possesses a computationally elegant self-referential analytical form:
   $$
   \begin{aligned}
   \frac{d\sigma}{dz} &= \frac{d}{dz} (1 + e^{-z})^{-1} = -(1 + e^{-z})^{-2} \cdot (-e^{-z}) \\
   &= \frac{e^{-z}}{(1 + e^{-z})^2} = \left(\frac{1}{1 + e^{-z}}\right) \left(\frac{e^{-z}}{1 + e^{-z}}\right) \\
   &= \sigma(z) (1 - \sigma(z))
   \end{aligned}
   $$
   This identity allows automatic differentiation engines to compute the gradient directly from the cached forward activation $\sigma(z)$ using a single subtraction and multiplication, requiring no re-evaluation of transcendental exponentials.

4. **Maximum Gradient and Vanishing Gradient Pathology:**
   To find the critical point of $\sigma'(z)$:
   $$
   \frac{d^2\sigma}{dz^2} = \sigma'(z)(1 - \sigma(z)) - \sigma(z)\sigma'(z) = \sigma'(z)(1 - 2\sigma(z)) = 0
   $$
   Because $\sigma'(z) > 0$ for all real $z$, the extrema occur when $1 - 2\sigma(z) = 0 \implies \sigma(z) = 0.5 \implies z = 0$.
   At $z = 0$:
   $$
   \sigma'(0) = 0.5 \cdot (1 - 0.5) = 0.25
   $$
   The maximum possible value of the sigmoid derivative is strictly $\frac{1}{4}$. For any $|z| > 4$, $\sigma'(z) < 0.018$. In a deep network of $L$ layers, backpropagation multiplies these derivatives across layers:
   $$
   \prod_{l=1}^L \sigma'(z^{[l]}) \le (0.25)^L
   $$
   For a network with merely $L = 10$ layers, $(0.25)^{10} \approx 9.54 \times 10^{-7}$. The error gradient decays exponentially toward zero as it traverses backward through the network, preventing early layers from updating their weights. This is the notorious **vanishing gradient problem**.

5. **Non-Zero-Centered Outputs:**
   Because $\sigma(z) \in (0, 1)$, all outputs $a_i^{[l]}$ are strictly positive ($a_i^{[l]} > 0$). In the backward pass, the gradient of the loss $\mathcal{L}$ with respect to the incoming weight $w_{ij}$ is:
   $$
   \frac{\partial \mathcal{L}}{\partial w_{ij}} = \delta_i \cdot a_j^{[l-1]}
   $$
   Because $a_j^{[l-1]} > 0$ always, the sign of $\frac{\partial \mathcal{L}}{\partial w_{ij}}$ for all $j$ is determined exclusively by the scalar error $\delta_i$. Consequently, all weights feeding into neuron $i$ must either increase together or decrease together during a single gradient step. This induces an inefficient, zig-zagging trajectory toward the optimum.

---

### 3.2.2 The Hyperbolic Tangent ($\tanh$)

To address the non-zero-centered limitation of the logistic sigmoid, researchers adopted the hyperbolic tangent function $\tanh: \mathbb{R} \to (-1, 1)$:
$$
\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}} = \frac{\sinh(z)}{\cosh(z)}
$$

#### Key Mathematical Properties:
1. **Affine Relationship to Sigmoid:**
   $$
   \begin{aligned}
   2\sigma(2z) - 1 &= \frac{2}{1 + e^{-2z}} - 1 = \frac{2 - (1 + e^{-2z})}{1 + e^{-2z}} = \frac{1 - e^{-2z}}{1 + e^{-2z}} \\
   &= \frac{e^z - e^{-z}}{e^z + e^{-z}} = \tanh(z)
   \end{aligned}
   $$
   Thus, $\tanh(z)$ is simply a rescaled and shifted version of the logistic sigmoid.
2. **Zero-Centered Symmetry:**
   $\tanh(z)$ is an odd function, perfectly anti-symmetric about the origin:
   $$
   \tanh(-z) = -\tanh(z)
   $$
   With zero-mean inputs and symmetric initialization, activations are roughly zero-centered ($\mathbb{E}[a] \approx 0$), which significantly mitigates the zig-zag gradient pathology.
3. **First Derivative:**
   $$
   \begin{aligned}
   \frac{d}{dz}\tanh(z) &= \frac{d}{dz} \left[ \frac{\sinh(z)}{\cosh(z)} \right] = \frac{\cosh^2(z) - \sinh^2(z)}{\cosh^2(z)} = 1 - \left(\frac{\sinh(z)}{\cosh(z)}\right)^2 \\
   &= 1 - \tanh^2(z)
   \end{aligned}
   $$
   At the origin $z = 0$, $\tanh(0) = 0$, yielding a peak derivative of:
   $$
   \tanh'(0) = 1 - 0 = 1.0
   $$
   While the peak derivative of $1.0$ is four times larger than that of the logistic sigmoid ($0.25$), $\tanh$ still suffers from severe gradient saturation: when $|z| \ge 3$, $|\tanh(z)| \approx 1$ and $\tanh'(z) = 1 - (\approx 1)^2 \approx 0$. Thus, vanishing gradients remain catastrophic in deep networks utilizing $\tanh$.

---

## 3.3 The Modern Non-Linearity Suite

The deep learning revolution of 2012 was enabled in large part by abandoning saturating sigmoidal functions in hidden layers in favor of piece-wise linear and self-gating activations.

```
       Visualizing Modern Non-Linear Activations (ReLU, Leaky ReLU, GELU, Swish)
       
       4.0 +                                       ./* (ReLU / Leaky / GELU)
           |                                     ./ *
       2.0 |                                   ./  *
           |                                 ./   *
       0.0 +-------------------------------./----+---------------------
           |                             ./
      -0.5 |   ...........-------------'' (Leaky slope alpha = 0.01)
           |    \__ (GELU / Swish smooth dip to ~ -0.17 at z ~ -0.75)
          -4   -3   -2   -1    0    1    2    3    4
```

### 3.3.1 Rectified Linear Unit (ReLU)

Introduced to neural networks by Hahnloser et al. (2000) and popularized in deep learning by Nair & Hinton (2010) and Krizhevsky et al. (2012), the Rectified Linear Unit is defined as:
$$
\text{ReLU}(z) = \max(0, z) = \begin{cases} z & \text{if } z > 0 \\ 0 & \text{if } z \le 0 \end{cases}
$$

#### Mathematical Characterization:
1. **Subgradient:**
   While non-differentiable at $z = 0$, its Clarke subdifferential is well-defined:
   $$
   \partial \text{ReLU}(z) = \begin{cases} \{1\} & \text{if } z > 0 \\ [0, 1] & \text{if } z = 0 \\ \{0\} & \text{if } z < 0 \end{cases}
   $$
   In practical software implementations, the derivative at zero is conventionally assigned $\sigma'(0) = 0$ or $1$.
2. **Elimination of Gradient Vanishing:**
   For any positive activation $z > 0$, the derivative is strictly $1.0$:
   $$
   \frac{d}{dz}\text{ReLU}(z) = 1 \quad \forall z > 0
   $$
   In a feedforward network with 100 layers, a gradient propagating through active ReLU neurons experiences no exponential attenuation from activation derivatives, because $1 \times 1 \times \dots \times 1 = 1$.
3. **Computational Efficiency:**
   Evaluating $\text{ReLU}(z)$ requires no exponential, division, or transcendental operations; it compiles to a single CPU/GPU assembly instruction (`MAX` or bitwise masking).
4. **Sparse Representations:**
   When initialized with standard zero-mean distributions, approximately 50% of the neurons in a hidden layer output exactly $0$. This induces true representation sparsity, mirroring biological cortex activity where only a small fraction of neurons fire simultaneously.
5. **The "Dying ReLU" Pathology:**
   If a large gradient update shifts a neuron's weights such that $\mathbf{w}^T \mathbf{x} + b < 0$ for all training samples in the dataset, the neuron outputs $0$ everywhere. Because its gradient is identically $0$, no future gradient update can ever modify its weights. The neuron is permanently "dead." If a significant fraction of neurons in a layer die, network capacity irreversibly collapses.

---

### 3.3.2 Leaky ReLU and Parametric ReLU (PReLU)

To prevent the dying ReLU pathology, Maas et al. (2013) proposed the **Leaky ReLU**, introducing a small non-zero slope $\alpha > 0$ for negative inputs:
$$
\text{LeakyReLU}(z) = \max(\alpha z, z) = \begin{cases} z & \text{if } z > 0 \\ \alpha z & \text{if } z \le 0 \end{cases}
$$
Typically, $\alpha = 0.01$. Its derivative is:
$$
\frac{d}{dz}\text{LeakyReLU}(z) = \begin{cases} 1 & \text{if } z > 0 \\ \alpha & \text{if } z \le 0 \end{cases}
$$
Because the gradient is non-zero everywhere ($\alpha > 0$), neurons can recover even if their pre-activations are negative.

**Parametric ReLU (PReLU)**, introduced by He et al. (2015), promotes $\alpha$ to a learnable parameter optimized via backpropagation alongside the layer weights:
$$
\frac{\partial \mathcal{L}}{\partial \alpha} = \sum_{\text{samples}} \frac{\partial \mathcal{L}}{\partial a} \cdot \frac{\partial a}{\partial \alpha} = \sum_{\text{samples}} \delta \cdot \min(0, z)
$$

---

### 3.3.3 Exponential Linear Unit (ELU)

Clevert et al. (2015) introduced the Exponential Linear Unit to combine the non-saturating benefits of ReLU with smooth, zero-centered mean activations:
$$
\text{ELU}(z) = \begin{cases} z & \text{if } z > 0 \\ \alpha (e^z - 1) & \text{if } z \le 0 \end{cases}
$$
where $\alpha > 0$ (typically $\alpha = 1.0$).

#### Mathematical Properties:
1. **Continuity and Smoothness:**
   At $z = 0$:
   $$
   \lim_{z \to 0^+} \text{ELU}(z) = 0, \quad \lim_{z \to 0^-} \text{ELU}(z) = \alpha(e^0 - 1) = 0
   $$
   The first derivative is:
   $$
   \frac{d}{dz}\text{ELU}(z) = \begin{cases} 1 & \text{if } z > 0 \\ \alpha e^z = \text{ELU}(z) + \alpha & \text{if } z \le 0 \end{cases}
   $$
   For $\alpha = 1.0$, $\lim_{z \to 0^+} \text{ELU}'(z) = 1$ and $\lim_{z \to 0^-} \text{ELU}'(z) = 1 \cdot e^0 = 1$. Thus, ELU is continuously differentiable ($C^1$) across the entire real line $\mathbb{R}$.
2. **Negative Saturation Plateau:**
   As $z \to -\infty$, $\text{ELU}(z) \to -\alpha$. This saturation provides noise robustness against large negative outliers while pushing mean hidden unit activations closer to zero.

---

### 3.3.4 Gaussian Error Linear Unit (GELU)

Hendrycks & Gimpel (2016) formulated the Gaussian Error Linear Unit, which has become the standard activation function in modern transformer architectures (BERT, RoBERTa, GPT-2, GPT-3, GPT-4, LLaMA, Gemini).

GELU bridges deterministic activation functions and stochastic dropout regularization. Rather than gating an input deterministically based on whether $z > 0$ (as in ReLU), GELU gates $z$ by the probability that a standard Gaussian variable $X \sim \mathcal{N}(0, 1)$ is less than or equal to $z$:
$$
\text{GELU}(z) = z \cdot P(X \le z) = z \cdot \Phi(z) = z \cdot \frac{1}{2} \left[ 1 + \operatorname{erf}\left(\frac{z}{\sqrt{2}}\right) \right]
$$
where $\Phi(z)$ is the cumulative distribution function (CDF) of the standard normal distribution, and $\operatorname{erf}(u) = \frac{2}{\sqrt{\pi}} \int_0^u e^{-t^2} dt$ is the Gauss error function.

#### Polynomial / Transcendental Approximation:
Because the error function $\operatorname{erf}(u)$ lacks a closed-form elementary formula, Hendrycks & Gimpel derived a highly accurate approximation for rapid tensor execution:
$$
\text{GELU}(z) \approx 0.5 z \left( 1 + \tanh\left( \sqrt{\frac{2}{\pi}} \left( z + 0.044715 z^3 \right) \right) \right)
$$
Another common fast approximation used in PyTorch is:
$$
\text{GELU}_{\text{fast}}(z) = z \cdot \sigma(1.702 z)
$$

#### Key Properties:
- **Curvature and Non-Monotonicity:**
  Unlike ReLU, GELU is non-monotonic: it dips slightly below zero for negative inputs, reaching a global minimum of approximately $-0.170$ at $z \approx -0.7517$.
- **Smooth Gradient:** GELU is infinitely differentiable ($C^\infty$). Its smooth derivative avoids the sharp discontinuity of ReLU at $z = 0$, facilitating smoother optimization dynamics on complex non-convex landscapes.

---

### 3.3.5 Swish / SiLU (Sigmoid Linear Unit)

Discovered independently by Elfwing et al. (2018) as the Sigmoid Linear Unit (SiLU) and by Ramachandran, Zoph & Le (2017) via automated neural architecture search as **Swish**, this function is defined as:
$$
\text{Swish}(z) = z \cdot \sigma(\beta z) = \frac{z}{1 + e^{-\beta z}}
$$
where $\beta > 0$ is a scalar parameter (often fixed at $\beta = 1$).

#### First Derivative:
Using the product rule:
$$
\begin{aligned}
\frac{d}{dz}\text{Swish}(z) &= \frac{d}{dz}[z \cdot \sigma(\beta z)] = \sigma(\beta z) + z \cdot \beta \sigma(\beta z)(1 - \sigma(\beta z)) \\
&= \beta z \sigma(\beta z) + \sigma(\beta z)(1 - \beta z \sigma(\beta z)) \\
&= \beta \cdot \text{Swish}(z) + \sigma(\beta z)(1 - \beta \cdot \text{Swish}(z))
\end{aligned}
$$
For $\beta = 1$:
$$
\frac{d}{dz}\text{SiLU}(z) = \sigma(z) + z \sigma(z)(1 - \sigma(z)) = \sigma(z) [1 + z(1 - \sigma(z))]
$$

Like GELU, Swish is smooth, non-monotonic, unbounded above, and bounded below (minimum value $\approx -0.278$ at $z \approx -1.278$).

---

### 3.3.6 Comprehensive Synthesis Table of Activation Functions

| Activation Function | Functional Form $f(z)$ | Output Range | Max Derivative $\max f'(z)$ | Zero-Centered? | Primary Advantages | Primary Hazards / Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear** | $z$ | $(-\infty, \infty)$ | $1.0$ | Yes | Exact scale preservation | Cascades collapse to single affine map |
| **Logistic Sigmoid** | $\frac{1}{1 + e^{-z}}$ | $(0, 1)$ | $0.25$ | No | Smooth, natural probabilistic output | Vanishing gradients, non-zero-centered |
| **Tanh** | $\frac{e^z - e^{-z}}{e^z + e^{-z}}$ | $(-1, 1)$ | $1.0$ | Yes | Zero-centered, bounded | Vanishing gradients for $|z| > 2.5$ |
| **ReLU** | $\max(0, z)$ | $[0, \infty)$ | $1.0$ | No | No gradient decay for $z > 0$, fast | Dying ReLU pathology, non-zero-centered |
| **Leaky ReLU** | $\max(\alpha z, z)$ | $(-\infty, \infty)$ | $1.0$ | Near-zero | Prevents dead neurons, fast | $\alpha$ hyperparameter selection |
| **ELU** | $z$ if $z>0$, $\alpha(e^z-1)$ if $z \le 0$ | $(-\alpha, \infty)$ | $1.0$ | Near-zero | Continuous $C^1$, zero-mean bias | Exponential computation cost |
| **GELU** | $z \cdot \Phi(z)$ | $[-0.17, \infty)$ | $\approx 1.12$ | Near-zero | Smooth $C^\infty$, probabilistic gating | Transcendental computation cost |
| **Swish / SiLU** | $z \cdot \sigma(\beta z)$ | $[-0.28, \infty)$ | $\approx 1.09$ | Near-zero | Smooth $C^\infty$, non-monotonic | Transcendental computation cost |

---

## 3.4 Cybenko’s Universal Approximation Theorem (1989)

Having established why non-linearity is mandatory, we now address the foundational theoretical question of expressive capacity: *Can a multi-layer feedforward network with a single hidden layer approximate any continuous mathematical function to arbitrary precision?*

In 1989, George Cybenko published his landmark paper, *Approximation by Superpositions of a Sigmoidal Function*, providing the first rigorous affirmative proof for continuous sigmoidal activations.

### 3.4.1 Formal Mathematical Formulation

Let $I_d$ denote the $d$-dimensional unit hypercube $[0, 1]^d \subset \mathbb{R}^d$, or more generally, let $K \subset \mathbb{R}^d$ be any compact (closed and bounded) subset of Euclidean space.  
Let $C(K)$ denote the Banach space of all continuous, real-valued functions defined on $K$, equipped with the uniform supremum norm:
$$
\|f - g\|_\infty = \sup_{\mathbf{x} \in K} |f(\mathbf{x}) - g(\mathbf{x})|
$$

A function $\sigma: \mathbb{R} \to \mathbb{R}$ is defined to be **sigmoidal** if:
$$
\lim_{t \to -\infty} \sigma(t) = 0 \quad \text{and} \quad \lim_{t \to +\infty} \sigma(t) = 1
$$

**Theorem (Cybenko, 1989):**  
Let $\sigma$ be any continuous sigmoidal function. Then the set of finite sums of the form:
$$
G(\mathbf{x}) = \sum_{i=1}^N \alpha_i \sigma\left( \mathbf{w}_i^T \mathbf{x} + b_i \right)
$$
where $\alpha_i \in \mathbb{R}$, $\mathbf{w}_i \in \mathbb{R}^d$, and $b_i \in \mathbb{R}$, is **everywhere dense** in $C(K)$.

In other words, for every target continuous function $f \in C(K)$ and every tolerance $\epsilon > 0$, there exists an integer $N \in \mathbb{N}$ and sets of parameters $\{\alpha_i\}_{i=1}^N$, $\{\mathbf{w}_i\}_{i=1}^N$, $\{b_i\}_{i=1}^N$ such that:
$$
|G(\mathbf{x}) - f(\mathbf{x})| < \epsilon \quad \forall \mathbf{x} \in K
$$

```
   Target Continuous Surface f(x) vs. Neural Approximation G(x)
   
     ^ f(x) (Target)
     |          .---.             .---.
     |         /     \           /     \
     |   .----'       '---------'       '----.
     |
     |   Neural Network G(x) = \sum alpha_i * sigma(w_i^T x + b_i)
     |          .---.             .---.       (Approximation within +/- epsilon)
     |       _./     \._       _./     \._
     +------+-----------+-----+-----------+---> x
```

### 3.4.2 Functional Analysis Proof Strategy (Hahn-Banach / Riesz)

Cybenko’s proof is non-constructive, relying on classical theorems of functional analysis: the **Hahn-Banach Theorem** and the **Riesz Representation Theorem**.

1. **Subspace Definition:**  
   Let $\mathcal{S} \subset C(K)$ be the linear subspace of functions spanned by all possible finite linear combinations of $\sigma(\mathbf{w}^T \mathbf{x} + b)$.
2. **Dense Closure Condition via Hahn-Banach:**  
   By the Hahn-Banach theorem, a linear subspace $\mathcal{S}$ is dense in $C(K)$ if and only if the only bounded linear functional $L: C(K) \to \mathbb{R}$ that vanishes identically on $\mathcal{S}$ ($L(g) = 0$ for all $g \in \mathcal{S}$) is the zero functional ($L \equiv 0$).
3. **Integral Representation via Riesz:**  
   By the Riesz Representation Theorem, any bounded linear functional $L$ on $C(K)$ can be represented as integration against a unique regular signed Borel measure $\mu$ on $K$:
   $$
   L(f) = \int_K f(\mathbf{x}) \, d\mu(\mathbf{x})
   $$
   Therefore, the condition that $L$ vanishes on $\mathcal{S}$ is equivalent to:
   $$
   \int_K \sigma(\mathbf{w}^T \mathbf{x} + b) \, d\mu(\mathbf{x}) = 0 \quad \forall \mathbf{w} \in \mathbb{R}^d, \; \forall b \in \mathbb{R}
   $$
4. **Discriminatory Property of Sigmoids:**  
   Cybenko defined an activation function $\sigma$ to be **discriminatory** if the integral condition above implies that $\mu$ is the zero measure ($\mu \equiv 0$).
5. **Connecting to the Fourier Transform:**  
   By taking limits of scaled sigmoids $\sigma(\lambda(\mathbf{w}^T \mathbf{x} + b))$ as $\lambda \to \infty$, the sigmoid converges pointwise to a shifted Heaviside step function:
   $$
   \lim_{\lambda \to \infty} \sigma(\lambda(\mathbf{w}^T \mathbf{x} + b)) = \begin{cases} 1 & \text{if } \mathbf{w}^T \mathbf{x} + b > 0 \\ \sigma(0) & \text{if } \mathbf{w}^T \mathbf{x} + b = 0 \\ 0 & \text{if } \mathbf{w}^T \mathbf{x} + b < 0 \end{cases}
   $$
   By Lebesgue’s Dominated Convergence Theorem, integrating step functions over half-spaces implies that the measure $\mu$ of every open half-space must be zero. Using the Fourier-Stieltjes transform of $\mu$:
   $$
   \hat{\mu}(\mathbf{t}) = \int_K e^{-i \mathbf{t}^T \mathbf{x}} \, d\mu(\mathbf{x}) = 0 \quad \forall \mathbf{t} \in \mathbb{R}^d
   $$
   Because the Fourier transform of a signed Borel measure is uniquely injective, $\hat{\mu}(\mathbf{t}) = 0$ identically implies $\mu = 0$.
6. **Conclusion:**  
   Because $\mu = 0$, the only linear functional annihilating $\mathcal{S}$ is the trivial functional $L \equiv 0$. Hence, $\mathcal{S}$ is dense in $C(K)$.

---

## 3.5 Kurt Hornik’s Extension (1991)

While Cybenko proved the theorem for sigmoidal activations, practical practitioners wondered whether sigmoidality was a strict requirement. In 1991, Kurt Hornik published *Approximation Capabilities of Multilayer Feedforward Networks*, resolving the question definitively.

**Theorem (Hornik, Stinchcombe, & White, 1989; Hornik, 1991):**  
Let $\sigma: \mathbb{R} \to \mathbb{R}$ be any continuous, **non-constant**, and **non-polynomial** function. Then single-hidden-layer feedforward networks with activation function $\sigma$ are universal approximators on compact subsets of $\mathbb{R}^d$ in $C(K)$, and also in $L^p(K, \mu)$ for any finite measure $\mu$ and $1 \le p < \infty$.

### 3.5.1 Why Non-Polynomiality is Both Necessary and Sufficient

1. **Failure of Polynomial Activations:**  
   Suppose $\sigma(z) = \sum_{k=0}^m c_k z^k$ is a polynomial of degree $m$. Then for any weight vector $\mathbf{w}$ and bias $b$:
   $$
   \sigma(\mathbf{w}^T \mathbf{x} + b) = \sum_{k=0}^m c_k (\mathbf{w}^T \mathbf{x} + b)^k
   $$
   By multinomial expansion, $(\mathbf{w}^T \mathbf{x} + b)^k$ is a polynomial in the variables $(x_1, x_2, \dots, x_d)$ of total degree at most $m$.  
   Any finite sum of such units:
   $$
   G(\mathbf{x}) = \sum_{i=1}^N \alpha_i \sigma(\mathbf{w}_i^T \mathbf{x} + b_i)
   $$
   is strictly a polynomial in $\mathbf{x}$ of degree at most $m$.  
   The space of all polynomials of degree $\le m$ in $d$ variables has finite dimension $\binom{d + m}{m}$. Because a finite-dimensional subspace of $C(K)$ cannot be dense in the infinite-dimensional space $C(K)$, **no polynomial activation can ever be a universal approximator**. It cannot approximate a polynomial of degree $m + 1$, nor transcendental functions like $\sin(x)$ or $|x|$, to arbitrary accuracy on a compact domain.
2. **Sufficiency of Any Non-Polynomial Function:**  
   Hornik proved using the **Stone-Weierstrass Theorem** that any continuous non-polynomial activation can, via infinitesimal linear combinations, generate derivatives that span the algebra of all multivariate polynomials. Since polynomials are dense in $C(K)$ (classical Stone-Weierstrass), the network is a universal approximator.

Crucially, **ReLU ($f(z) = \max(0, z)$) is continuous and non-polynomial!** Thus, Hornik's theorem guarantees that modern deep learning networks built entirely out of ReLUs, GELUs, or Swish units possess universal functional approximation capacity.

---

## 3.6 Geometric Intuition: Constructive Box-Splines and Bump Functions

While Cybenko and Hornik used non-constructive functional analysis, a simple geometric construction demonstrates how neural networks build localized function approximators.

### 3.6.1 The 1D Pulse Generator (Two Sigmoids or ReLUs)

Consider approximating a 1D indicator function (a rectangular box pulse) on the interval $[a, b] \subset \mathbb{R}$:
$$
I_{[a, b]}(x) = \begin{cases} 1 & \text{if } a \le x \le b \\ 0 & \text{otherwise} \end{cases}
$$

1. **Using Sharp Sigmoids ($\lambda \gg 1$):**
   $$
   B(x) = \sigma(\lambda(x - a)) - \sigma(\lambda(x - b))
   $$
   - When $x < a$: both $\sigma(\lambda(x-a)) \approx 0$ and $\sigma(\lambda(x-b)) \approx 0 \implies B(x) \approx 0$.
   - When $a < x < b$: $\sigma(\lambda(x-a)) \approx 1$ while $\sigma(\lambda(x-b)) \approx 0 \implies B(x) \approx 1$.
   - When $x > b$: both $\sigma(\lambda(x-a)) \approx 1$ and $\sigma(\lambda(x-b)) \approx 1 \implies B(x) \approx 1 - 1 = 0$.

2. **Using ReLUs:**
   A triangular "tent" bump function centered at $c$ with width $2\delta$ can be constructed from three ReLUs:
   $$
   T(x) = \frac{1}{\delta} \text{ReLU}(x - (c - \delta)) - \frac{2}{\delta} \text{ReLU}(x - c) + \frac{1}{\delta} \text{ReLU}(x - (c + \delta))
   $$
   Outside $(c-\delta, c+\delta)$, the slopes cancel perfectly ($+1 - 2 + 1 = 0$), producing identically zero!

```
       Constructing a 1D Triangular "Tent" Bump from Three ReLUs
       
       1.0 +                     ^ (Peak at x = c)
           |                    / \
           |                   /   \
           |                  /     \
       0.0 +-----------------+-------+-------------------> x
                           c-delta   c+delta
           [ +1/delta ReLU(x-(c-delta)) - 2/delta ReLU(x-c) + 1/delta ReLU(x-(c+delta)) ]
```

### 3.6.2 The $d$-Dimensional Hypercube Bump

In $d$-dimensional space $\mathbb{R}^d$, an indicator function over a hypercube $\prod_{j=1}^d [a_j, b_j]$ can be formed by intersecting $2d$ hyperplanes.  
A hidden layer of width $2d$ followed by an output threshold neuron can isolate an arbitrarily small hypercube $\mathcal{B} \subset \mathbb{R}^d$ and assign it any desired height $\alpha$.

Because any continuous function $f \in C(K)$ on a compact set is uniformly continuous, it can be approximated within $\epsilon$ error by a Riemann sum of step functions over a finite grid of hypercubes!

### 3.6.3 The Curse of Dimensionality: Width vs. Depth

The constructive Riemann proof reveals the fatal catch of the Universal Approximation Theorem:
- **Exponential Width Requirement:** To tile a $d$-dimensional unit cube $[0, 1]^d$ with hypercubes of side length $\delta$, we require $(1/\delta)^d$ cells. For $d = 100$ dimensions and a coarse resolution of $\delta = 0.1$, the network requires $(10)^{100}$ hidden neurons—more units than atoms in the observable universe!
- **Non-Constructive Optimization:** Cybenko’s theorem guarantees that *there exists* an optimal parameter configuration; it does **not** guarantee that gradient descent can find it in polynomial time, nor that the required network width is tractable.

This motivates **deep networks** (multiple sequential hidden layers). Theorems by Telgarsky (2016) and Eldan & Shamir (2016) proved that deep networks can compute oscillatory functions (such as iterated triangle waves with $2^k$ teeth) using $O(k)$ layers with $O(1)$ units per layer, whereas any single-hidden-layer shallow network requires $\Omega(2^k)$ units to achieve the same approximation.

---

## 3.7 Exactly 10 Worked Examples

### Example 3.1: Algebraic Collapse of an $L$-Layer Purely Linear Network
**Problem Statement:**  
Consider a 4-layer linear network defined by:
$$
\mathbf{W}^{[1]} = \begin{bmatrix} 2 & -1 \\ 0 & 3 \end{bmatrix}, \quad \mathbf{b}^{[1]} = \begin{bmatrix} 1 \\ -2 \end{bmatrix}
$$
$$
\mathbf{W}^{[2]} = \begin{bmatrix} 1 & 4 \\ -2 & 1 \end{bmatrix}, \quad \mathbf{b}^{[2]} = \begin{bmatrix} 0 \\ 3 \end{bmatrix}
$$
$$
\mathbf{W}^{[3]} = \begin{bmatrix} 3 & -1 \end{bmatrix}, \quad b^{[3]} = 5
$$
Compute the single equivalent affine transformation $\mathbf{W}_{\text{eff}} \mathbf{x} + b_{\text{eff}}$ such that $\mathbf{y} = \mathbf{W}_{\text{eff}} \mathbf{x} + b_{\text{eff}}$.

**Step-by-Step Solution:**  
1. **Combine Layer 1 and Layer 2:**
   $$
   \mathbf{W}^{[2:1]} = \mathbf{W}^{[2]} \mathbf{W}^{[1]} = \begin{bmatrix} 1 & 4 \\ -2 & 1 \end{bmatrix} \begin{bmatrix} 2 & -1 \\ 0 & 3 \end{bmatrix} = \begin{bmatrix} 1(2)+4(0) & 1(-1)+4(3) \\ -2(2)+1(0) & -2(-1)+1(3) \end{bmatrix} = \begin{bmatrix} 2 & 11 \\ -4 & 5 \end{bmatrix}
   $$
   $$
   \mathbf{b}^{[2:1]} = \mathbf{W}^{[2]} \mathbf{b}^{[1]} + \mathbf{b}^{[2]} = \begin{bmatrix} 1 & 4 \\ -2 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ -2 \end{bmatrix} + \begin{bmatrix} 0 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 - 8 \\ -2 - 2 \end{bmatrix} + \begin{bmatrix} 0 \\ 3 \end{bmatrix} = \begin{bmatrix} -7 \\ -1 \end{bmatrix}
   $$

2. **Combine with Layer 3:**
   $$
   \mathbf{W}_{\text{eff}} = \mathbf{W}^{[3]} \mathbf{W}^{[2:1]} = \begin{bmatrix} 3 & -1 \end{bmatrix} \begin{bmatrix} 2 & 11 \\ -4 & 5 \end{bmatrix} = \begin{bmatrix} 3(2) + (-1)(-4) & 3(11) + (-1)(5) \end{bmatrix} = \begin{bmatrix} 10 & 28 \end{bmatrix}
   $$
   $$
   b_{\text{eff}} = \mathbf{W}^{[3]} \mathbf{b}^{[2:1]} + b^{[3]} = \begin{bmatrix} 3 & -1 \end{bmatrix} \begin{bmatrix} -7 \\ -1 \end{bmatrix} + 5 = (3(-7) + (-1)(-1)) + 5 = (-21 + 1) + 5 = -15
   $$

3. **Verification:**
   For any $\mathbf{x} = [x_1, x_2]^T$:
   $$
   y = 10 x_1 + 28 x_2 - 15
   $$
   All 13 internal parameters collapse identically to 3 effective parameters.

---

### Example 3.2: Analytical Derivation of the Logistic Sigmoid Derivative
**Problem Statement:**  
Starting from $\sigma(z) = (1 + e^{-z})^{-1}$, derive the identity $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ and compute its numerical value for $z = 0$, $z = 2$, and $z = -4$.

**Step-by-Step Solution:**  
1. **Differentiating via Power and Chain Rules:**
   $$
   \frac{d}{dz} \sigma(z) = \frac{d}{dz} (1 + e^{-z})^{-1} = -(1 + e^{-z})^{-2} \cdot \frac{d}{dz}(1 + e^{-z})
   $$
   Since $\frac{d}{dz}(1 + e^{-z}) = -e^{-z}$:
   $$
   \sigma'(z) = -(1 + e^{-z})^{-2} (-e^{-z}) = \frac{e^{-z}}{(1 + e^{-z})^2}
   $$

2. **Algebraic Factoring:**
   $$
   \sigma'(z) = \left(\frac{1}{1 + e^{-z}}\right) \left(\frac{e^{-z}}{1 + e^{-z}}\right) = \sigma(z) \left(\frac{(1 + e^{-z}) - 1}{1 + e^{-z}}\right) = \sigma(z) (1 - \sigma(z))
   $$

3. **Numerical Evaluations:**
   - At $z = 0$: $\sigma(0) = \frac{1}{1 + 1} = 0.5 \implies \sigma'(0) = 0.5(1 - 0.5) = 0.25$.
   - At $z = 2$: $e^{-2} \approx 0.135335 \implies \sigma(2) = \frac{1}{1.135335} \approx 0.880797$.
     $$
     \sigma'(2) = 0.880797 \times (1 - 0.880797) = 0.880797 \times 0.119203 \approx 0.10499
     $$
   - At $z = -4$: $\sigma(-4) = 1 - \sigma(4) = 1 - \frac{1}{1 + e^{-4}} = 1 - 0.982014 = 0.017986$.
     $$
     \sigma'(-4) = 0.017986 \times (1 - 0.017986) \approx 0.01766
     $$
   The derivative at $z = -4$ has decayed by over 93% compared to its peak at $z = 0$.

---

### Example 3.3: Analytical Derivation of the $\tanh$ Derivative and Relation to Sigmoid
**Problem Statement:**  
Prove that $\tanh(z) = 2\sigma(2z) - 1$, derive $\frac{d}{dz}\tanh(z) = 1 - \tanh^2(z)$, and find its value at $z = 0$ and $z = 3$.

**Step-by-Step Solution:**  
1. **Proving the Identity:**
   $$
   2\sigma(2z) - 1 = \frac{2}{1 + e^{-2z}} - 1 = \frac{2 - (1 + e^{-2z})}{1 + e^{-2z}} = \frac{1 - e^{-2z}}{1 + e^{-2z}}
   $$
   Multiply numerator and denominator by $e^z$:
   $$
   \frac{e^z(1 - e^{-2z})}{e^z(1 + e^{-2z})} = \frac{e^z - e^{-z}}{e^z + e^{-z}} = \tanh(z) \quad \blacksquare
   $$

2. **Differentiating via Quotient Rule:**
   Let $u(z) = \sinh(z)$ and $v(z) = \cosh(z)$:
   $$
   \tanh'(z) = \frac{u' v - u v'}{v^2} = \frac{\cosh(z)\cosh(z) - \sinh(z)\sinh(z)}{\cosh^2(z)} = \frac{\cosh^2(z) - \sinh^2(z)}{\cosh^2(z)}
   $$
   By the fundamental hyperbolic trigonometric identity $\cosh^2(z) - \sinh^2(z) = 1$:
   $$
   \tanh'(z) = \frac{1}{\cosh^2(z)} = 1 - \frac{\sinh^2(z)}{\cosh^2(z)} = 1 - \tanh^2(z) \quad \blacksquare
   $$

3. **Numerical Evaluations:**
   - At $z = 0$: $\tanh(0) = 0 \implies \tanh'(0) = 1 - 0^2 = 1.0$.
   - At $z = 3$: $\tanh(3) = \frac{e^3 - e^{-3}}{e^3 + e^{-3}} = \frac{20.0855 - 0.0498}{20.0855 + 0.0498} = \frac{20.0357}{20.1353} \approx 0.995055$.
     $$
     \tanh'(3) = 1 - (0.995055)^2 = 1 - 0.990134 = 0.009866
     $$
   At $z = 3$, the derivative has collapsed by 99%, illustrating severe saturation.

---

### Example 3.4: The Zig-Zag Gradient Pathology of Non-Zero-Centered Activations
**Problem Statement:**  
Consider a single neuron receiving inputs $a_1 = 0.8$ and $a_2 = 0.6$ from a preceding logistic sigmoid layer. The pre-activation is $z = w_1 a_1 + w_2 a_2 + b$.  
Show that regardless of the downstream error signal $\delta = \frac{\partial \mathcal{L}}{\partial z}$, the weight gradients $\frac{\partial \mathcal{L}}{\partial w_1}$ and $\frac{\partial \mathcal{L}}{\partial w_2}$ cannot have opposite signs.

**Step-by-Step Solution:**  
1. **Formulating Weight Gradients:**
   By the chain rule:
   $$
   \frac{\partial \mathcal{L}}{\partial w_1} = \frac{\partial \mathcal{L}}{\partial z} \frac{\partial z}{\partial w_1} = \delta \cdot a_1 = 0.8 \delta
   $$
   $$
   \frac{\partial \mathcal{L}}{\partial w_2} = \frac{\partial \mathcal{L}}{\partial z} \frac{\partial z}{\partial w_2} = \delta \cdot a_2 = 0.6 \delta
   $$

2. **Analyzing Signs:**
   - Case 1: $\delta > 0 \implies \frac{\partial \mathcal{L}}{\partial w_1} > 0$ and $\frac{\partial \mathcal{L}}{\partial w_2} > 0$. Both weights are decreased by gradient descent: $\Delta w_1 < 0, \Delta w_2 < 0$.
   - Case 2: $\delta < 0 \implies \frac{\partial \mathcal{L}}{\partial w_1} < 0$ and $\frac{\partial \mathcal{L}}{\partial w_2} < 0$. Both weights are increased: $\Delta w_1 > 0, \Delta w_2 > 0$.
   - Case 3: $\delta = 0 \implies$ both gradients are zero.

3. **Consequence:**  
   If the true loss minimum requires $w_1$ to increase while $w_2$ decreases (quadrant IV of weight space), gradient descent cannot move directly toward the target. It must take zig-zagging orthogonal steps across quadrants I and III, drastically slowing convergence.

---

### Example 3.5: Dying ReLU Analysis and Inactivation Thresholds
**Problem Statement:**  
A neuron computes $a = \text{ReLU}(\mathbf{w}^T \mathbf{x} + b)$ with $\mathbf{w} = [1.5, -2.0]^T$ and $b = -0.5$.  
Suppose a training update applies a gradient step with learning rate $\eta = 0.1$ where $\frac{\partial \mathcal{L}}{\partial \mathbf{w}} = [20.0, -10.0]^T$ and $\frac{\partial \mathcal{L}}{\partial b} = 50.0$.  
1. Compute the new weight vector $\mathbf{w}_{\text{new}}$ and bias $b_{\text{new}}$.
2. For an input domain $\mathcal{X} = [0, 1]^2$, determine whether the neuron is "dead" (inactivated for all $\mathbf{x} \in \mathcal{X}$).

**Step-by-Step Solution:**  
1. **Weight and Bias Updates:**
   $$
   \mathbf{w}_{\text{new}} = \mathbf{w} - \eta \frac{\partial \mathcal{L}}{\partial \mathbf{w}} = \begin{bmatrix} 1.5 \\ -2.0 \end{bmatrix} - 0.1 \begin{bmatrix} 20.0 \\ -10.0 \end{bmatrix} = \begin{bmatrix} 1.5 - 2.0 \\ -2.0 + 1.0 \end{bmatrix} = \begin{bmatrix} -0.5 \\ -1.0 \end{bmatrix}
   $$
   $$
   b_{\text{new}} = b - \eta \frac{\partial \mathcal{L}}{\partial b} = -0.5 - 0.1(50.0) = -0.5 - 5.0 = -5.5
   $$

2. **Checking Pre-Activation on $\mathcal{X} = [0, 1]^2$:**
   $$
   z(\mathbf{x}) = \mathbf{w}_{\text{new}}^T \mathbf{x} + b_{\text{new}} = -0.5 x_1 - 1.0 x_2 - 5.5
   $$
   To find the maximum possible value of $z(\mathbf{x})$ over $x_1, x_2 \in [0, 1]$:
   Because both coefficients are negative ($-0.5 < 0$ and $-1.0 < 0$), the maximum occurs at the lower bounds $x_1 = 0, x_2 = 0$:
   $$
   z_{\max} = -0.5(0) - 1.0(0) - 5.5 = -5.5
   $$
   The minimum occurs at $x_1 = 1, x_2 = 1$:
   $$
   z_{\min} = -0.5(1) - 1.0(1) - 5.5 = -7.0
   $$
   Because $z(\mathbf{x}) \in [-7.0, -5.5] \le -5.5 < 0$ for all $\mathbf{x} \in \mathcal{X}$, $\text{ReLU}(z(\mathbf{x})) = 0$ everywhere. Its derivative $\frac{da}{dz} = 0$ for all inputs. The neuron is dead and cannot receive gradient updates.

---

### Example 3.6: Constructing a 1D Step and Pulse (Bump) Function from Two ReLUs
**Problem Statement:**  
Construct a continuous piecewise-linear bump function $B(x)$ that rises from $0$ at $x = 1$ to height $1$ at $x = 2$, remains flat at $1$ until $x = 4$, and falls back to $0$ at $x = 5$, staying zero elsewhere. Express $B(x)$ as a linear combination of ReLUs.

```
       1.0 +               .--------------. (Trapezoidal Pulse)
           |              /                \
           |             /                  \
       0.0 +------------+--------------------+------------> x
           0            1  2              4  5
```

**Step-by-Step Solution:**  
1. **Analyze Slope Changes:**
   - Interval $(-\infty, 1)$: slope $s_0 = 0$.
   - Interval $(1, 2)$: rises from $0$ to $1$, so slope $s_1 = \frac{1 - 0}{2 - 1} = +1$. Change in slope $\Delta s_1 = s_1 - s_0 = +1 - 0 = +1$ at knot $x = 1$.
   - Interval $(2, 4)$: plateau at $1$, so slope $s_2 = 0$. Change in slope $\Delta s_2 = s_2 - s_1 = 0 - 1 = -1$ at knot $x = 2$.
   - Interval $(4, 5)$: falls from $1$ to $0$, so slope $s_3 = \frac{0 - 1}{5 - 4} = -1$. Change in slope $\Delta s_3 = s_3 - s_2 = -1 - 0 = -1$ at knot $x = 4$.
   - Interval $(5, \infty)$: zero slope $s_4 = 0$. Change in slope $\Delta s_4 = s_4 - s_3 = 0 - (-1) = +1$ at knot $x = 5$.

2. **Assemble ReLU Basis Representation:**
   Every change in slope $\Delta s_k$ at knot $c_k$ corresponds to a term $\Delta s_k \text{ReLU}(x - c_k)$:
   $$
   B(x) = \text{ReLU}(x - 1) - \text{ReLU}(x - 2) - \text{ReLU}(x - 4) + \text{ReLU}(x - 5)
   $$

3. **Verification:**
   - $x = 0.5$: $0 - 0 - 0 + 0 = 0$.
   - $x = 1.5$: $0.5 - 0 - 0 + 0 = 0.5$.
   - $x = 3.0$: $2.0 - 1.0 - 0 + 0 = 1.0$.
   - $x = 4.5$: $3.5 - 2.5 - 0.5 + 0 = 0.5$.
   - $x = 6.0$: $5.0 - 4.0 - 2.0 + 1.0 = 0.0$.
   The function matches the specification.

---

### Example 3.7: Analytical Derivative and Asymptotic Limits of the ELU Function
**Problem Statement:**  
For $\text{ELU}(z) = \begin{cases} z & z > 0 \\ \alpha(e^z - 1) & z \le 0 \end{cases}$ with $\alpha = 1$:
1. Prove that ELU is $C^1$ continuous at $z = 0$.
2. Compute the second derivative $\frac{d^2}{dz^2}\text{ELU}(z)$ for $z \neq 0$ and determine if it is $C^2$ continuous at $z = 0$.

**Step-by-Step Solution:**  
1. **First Derivative and Continuity:**
   For $z > 0$: $\frac{d}{dz} z = 1$.  
   For $z < 0$: $\frac{d}{dz} [\alpha(e^z - 1)] = \alpha e^z$.
   - Right-sided limit of derivative: $\lim_{z \to 0^+} \text{ELU}'(z) = 1$.
   - Left-sided limit of derivative: $\lim_{z \to 0^-} \text{ELU}'(z) = \lim_{z \to 0^-} 1 \cdot e^z = 1 \cdot e^0 = 1$.
   Since the left- and right-sided limits are equal, $\text{ELU}'(0) = 1$. Thus, $\text{ELU}$ is continuously differentiable ($C^1$) at $z = 0$.

2. **Second Derivative:**
   - For $z > 0$: $\text{ELU}''(z) = \frac{d}{dz}(1) = 0$.
   - For $z < 0$: $\text{ELU}''(z) = \frac{d}{dz}(e^z) = e^z$.
   Taking limits at $z = 0$:
   - $\lim_{z \to 0^+} \text{ELU}''(z) = 0$.
   - $\lim_{z \to 0^-} \text{ELU}''(z) = e^0 = 1$.
   Because $0 \neq 1$, the second derivative has a jump discontinuity of magnitude $1$ at the origin. Therefore, $\text{ELU}$ is $C^1$ but **not** $C^2$ continuous.

---

### Example 3.8: Taylor Series and Sigmoid Approximation of the GELU Non-Linearity
**Problem Statement:**  
Consider the standard GELU function $f(z) = z \Phi(z)$.
1. Compute the second-order Taylor expansion of $f(z)$ around $z = 0$.
2. Show that near $z = 0$, $f(z)$ can be approximated by a quadratic polynomial plus linear slope.

**Step-by-Step Solution:**  
1. **Derivatives of GELU:**
   Recall that $\Phi(z) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^z e^{-t^2/2} dt$. Its derivative is the Gaussian density $\phi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2/2}$.
   - First derivative:
     $$
     f'(z) = \frac{d}{dz}[z \Phi(z)] = \Phi(z) + z \phi(z) = \Phi(z) + \frac{z}{\sqrt{2\pi}} e^{-z^2/2}
     $$
   - Second derivative:
     $$
     \begin{aligned}
     f''(z) &= \phi(z) + \phi(z) + z \phi'(z) = 2\phi(z) + z \left(-\frac{z}{\sqrt{2\pi}} e^{-z^2/2}\right) \\
     &= 2\phi(z) - z^2 \phi(z) = \phi(z) (2 - z^2) = \frac{2 - z^2}{\sqrt{2\pi}} e^{-z^2/2}
     \end{aligned}
     $$

2. **Evaluating at $z = 0$:**
   - $f(0) = 0 \cdot \Phi(0) = 0 \cdot 0.5 = 0$.
   - $f'(0) = \Phi(0) + 0 = 0.5$.
   - $f''(0) = \frac{2 - 0}{\sqrt{2\pi}} e^0 = \frac{2}{\sqrt{2\pi}} = \sqrt{\frac{2}{\pi}} \approx 0.79788$.

3. **Taylor Series Expansion:**
   $$
   f(z) = f(0) + f'(0) z + \frac{f''(0)}{2!} z^2 + O(z^3) = 0 + 0.5 z + \frac{1}{\sqrt{2\pi}} z^2 + O(z^3)
   $$
   $$
   f(z) \approx 0.5 z + 0.3989 z^2
   $$
   Near the origin, GELU behaves as a smooth parabola tangent to the line $y = 0.5z$.

---

### Example 3.9: Non-Monotonicity and Negative Minimum of Swish/SiLU
**Problem Statement:**  
Let $f(z) = z \sigma(z) = \frac{z}{1 + e^{-z}}$.
1. Find the exact transcendental equation satisfied by the critical point $z^*$ that minimizes $f(z)$.
2. Use two iterations of the Newton-Raphson method starting from $z_0 = -1.0$ to approximate $z^*$ and find the minimum value $f(z^*)$.

**Step-by-Step Solution:**  
1. **Critical Point Condition:**
   $$
   f'(z) = \sigma(z) + z \sigma(z)(1 - \sigma(z)) = \sigma(z) [1 + z(1 - \sigma(z))] = 0
   $$
   Because $\sigma(z) > 0$ for all real $z$, the bracketed term must vanish:
   $$
   1 + z(1 - \sigma(z)) = 0 \implies 1 + z \sigma(-z) = 0 \implies z = -\frac{1}{\sigma(-z)} = -(1 + e^z)
   $$
   Rewriting: $g(z) = z + 1 + e^z = 0$.

2. **Newton-Raphson Optimization of $g(z)$:**
   The derivative of $g(z)$ is $g'(z) = 1 + e^z$.
   - **Iteration 1:** Starting at $z_0 = -1.0$:
     $$
     g(-1.0) = -1.0 + 1.0 + e^{-1} = e^{-1} \approx 0.367879
     $$
     $$
     g'(-1.0) = 1.0 + e^{-1} \approx 1.367879
     $$
     $$
     z_1 = z_0 - \frac{g(z_0)}{g'(z_0)} = -1.0 - \frac{0.367879}{1.367879} = -1.0 - 0.26894 = -1.26894
     $$
   - **Iteration 2:**
     $$
     e^{-1.26894} \approx 0.281132
     $$
     $$
     g(-1.26894) = -1.26894 + 1.0 + 0.281132 = 0.012192
     $$
     $$
     g'(-1.26894) = 1.0 + 0.281132 = 1.281132
     $$
     $$
     z_2 = -1.26894 - \frac{0.012192}{1.281132} = -1.26894 - 0.009517 = -1.27846
     $$
     (The true root is $z^* \approx -1.2784645$).

3. **Evaluating Minimum Value:**
   $$
   \sigma(-1.27846) = \frac{1}{1 + e^{1.27846}} = \frac{1}{1 + 3.59114} = \frac{1}{4.59114} \approx 0.21781
   $$
   $$
   f(z^*) = -1.27846 \times 0.21781 \approx -0.27846
   $$
   The minimum value of Swish is approximately $-0.278$, proving its non-monotonicity.

---

### Example 3.10: Hahn-Banach Orthogonality in Cybenko's Functional Proof
**Problem Statement:**  
Let $K = [-1, 1]$. Suppose a signed measure $\mu$ on $K$ satisfies $\int_{-1}^1 \sigma(\lambda x + b) d\mu(x) = 0$ for all $\lambda \in \mathbb{R}$ and $b \in \mathbb{R}$, where $\sigma$ is a standard logistic sigmoid.  
Show that if $\mu = \delta_0 - \frac{1}{2}(\delta_{-0.5} + \delta_{0.5})$ (where $\delta_c$ is the Dirac delta measure at $c$), $\mu$ cannot annihilate all sigmoids, and find a pair $(\lambda, b)$ where $\int \sigma d\mu \neq 0$.

**Step-by-Step Solution:**  
1. **Expressing the Integral:**
   Under $\mu = \delta_0 - 0.5 \delta_{-0.5} - 0.5 \delta_{0.5}$:
   $$
   I(\lambda, b) = \int_{-1}^1 \sigma(\lambda x + b) d\mu(x) = \sigma(b) - 0.5 \sigma(-0.5\lambda + b) - 0.5 \sigma(0.5\lambda + b)
   $$

2. **Testing $b = 0$ for Symmetry:**
   When $b = 0$:
   $$
   I(\lambda, 0) = \sigma(0) - 0.5 \sigma(-0.5\lambda) - 0.5 \sigma(0.5\lambda)
   $$
   Since $\sigma(-u) = 1 - \sigma(u)$:
   $$
   \sigma(-0.5\lambda) + \sigma(0.5\lambda) = 1 - \sigma(0.5\lambda) + \sigma(0.5\lambda) = 1
   $$
   Therefore:
   $$
   I(\lambda, 0) = 0.5 - 0.5(1) = 0 \quad \forall \lambda \in \mathbb{R}
   $$
   Due to point symmetry around $(0, 0.5)$, setting $b = 0$ always yields zero!

3. **Breaking Symmetry with $b \neq 0$:**
   Choose $b = 1.0$ and $\lambda = 2.0$:
   - $\sigma(b) = \sigma(1.0) = \frac{1}{1 + e^{-1}} \approx 0.731059$.
   - $-0.5\lambda + b = -0.5(2.0) + 1.0 = 0 \implies \sigma(0) = 0.5$.
   - $0.5\lambda + b = 0.5(2.0) + 1.0 = 2.0 \implies \sigma(2.0) = \frac{1}{1 + e^{-2}} \approx 0.880797$.

4. **Computing the Integral:**
   $$
   I(2.0, 1.0) = 0.731059 - 0.5(0.5) - 0.5(0.880797) = 0.731059 - 0.25 - 0.440399 = +0.04066 \neq 0
   $$
   Because $I(2.0, 1.0) \neq 0$, the non-zero measure $\mu$ fails to annihilate all sigmoids. This illustrates Cybenko’s core premise: only the trivial zero measure ($\mu \equiv 0$) can annihilate all sigmoidal ridge functions across all $(\lambda, b)$.

---

## 3.8 Exactly 10 Solved Exercises

### Exercise 3.1: Approximation of a 1D Parabola $f(x) = x^2$ on $[-1, 1]$ via Piecewise Linear ReLUs
**Problem Statement:**  
Approximate the parabola $f(x) = x^2$ on the interval $[-1, 1]$ using a continuous piecewise-linear neural network $G(x) = \sum_{k=1}^M \alpha_k \text{ReLU}(w_k x + b_k) + c$ with $M = 4$ knots placed uniformly at $x \in \{-0.5, 0.0, 0.5\}$.  
Determine the exact weights, biases, and coefficients such that $G(x)$ interpolates $f(x)$ at the 5 points $x \in \{-1, -0.5, 0, 0.5, 1\}$, and calculate the maximum approximation error $\|f - G\|_\infty$.

**Detailed Solution:**  
1. **Target Interpolation Values:**
   - $f(-1) = 1.0$
   - $f(-0.5) = 0.25$
   - $f(0) = 0.0$
   - $f(0.5) = 0.25$
   - $f(1) = 1.0$

2. **Secant Slopes on Subintervals:**
   - On $[-1, -0.5]$: slope $s_1 = \frac{0.25 - 1.0}{-0.5 - (-1.0)} = \frac{-0.75}{0.5} = -1.5$.
   - On $[-0.5, 0.0]$: slope $s_2 = \frac{0.0 - 0.25}{0.0 - (-0.5)} = \frac{-0.25}{0.5} = -0.5$.
   - On $[0.0, 0.5]$: slope $s_3 = \frac{0.25 - 0.0}{0.5 - 0.0} = \frac{0.25}{0.5} = +0.5$.
   - On $[0.5, 1.0]$: slope $s_4 = \frac{1.0 - 0.25}{1.0 - 0.5} = \frac{0.75}{0.5} = +1.5$.

3. **Slope Changes at Knots:**
   - At initial point $x = -1$: initial linear trend is $y(x) = 1.0 - 1.5(x + 1) = -1.5x - 0.5$.
   - At knot $x = -0.5$: $\Delta s_1 = s_2 - s_1 = -0.5 - (-1.5) = +1.0$.
   - At knot $x = 0.0$: $\Delta s_2 = s_3 - s_2 = +0.5 - (-0.5) = +1.0$.
   - At knot $x = 0.5$: $\Delta s_3 = s_4 - s_3 = +1.5 - (+0.5) = +1.0$.

4. **ReLU Parameter Formulation:**
   Notice that all slope increments are identical ($\Delta s = +1.0$)!
   $$
   G(x) = -1.5x - 0.5 + 1.0 \text{ReLU}(x + 0.5) + 1.0 \text{ReLU}(x) + 1.0 \text{ReLU}(x - 0.5)
   $$
   To express $-1.5x$ strictly using ReLUs:
   Since $-1.5x = -1.5\text{ReLU}(x) + 1.5\text{ReLU}(-x)$, we can alternatively express:
   $$
   G(x) = 1.5 \text{ReLU}(-x - 0.5) \text{ ... or use standard affine form: }
   $$
   $$
   G(x) = \text{ReLU}(x + 0.5) + \text{ReLU}(x) + \text{ReLU}(x - 0.5) - 1.5x - 0.5
   $$

5. **Maximum Error Analysis:**
   On any subinterval $[x_k, x_{k+1}]$ of width $h = 0.5$, the linear interpolant $G(x)$ of a quadratic $f(x) = x^2$ has an error function:
   $$
   e(x) = f(x) - G(x) = (x - x_k)(x - x_{k+1})
   $$
   The maximum error occurs at the midpoint $x = \frac{x_k + x_{k+1}}{2}$:
   $$
   |e_{\max}| = \left| -\frac{h}{2} \cdot \frac{h}{2} \right| = \frac{h^2}{4} = \frac{(0.5)^2}{4} = \frac{0.25}{4} = 0.0625 = \frac{1}{16}
   $$
   The maximum approximation error across $[-1, 1]$ is exactly $0.0625$.

---

### Exercise 3.2: Universal Approximation with ReLUs: Error Bounds vs. Hidden Units
**Problem Statement:**  
Let $f: [0, 1] \to \mathbb{R}$ be an $L_f$-Lipschitz continuous function ($|f(x) - f(y)| \le L_f |x - y|$ for all $x, y \in [0, 1]$).  
Prove that a single-hidden-layer ReLU network with $M$ hidden units can approximate $f$ with uniform error bounded by:
$$
\|f - G\|_\infty \le \frac{L_f}{2M}
$$

**Detailed Solution:**  
1. **Partitioning the Interval:**
   Divide $[0, 1]$ into $M$ equal subintervals $I_k = [x_{k-1}, x_k]$ where $x_k = \frac{k}{M}$ for $k = 0, 1, \dots, M$. The length of each subinterval is $h = \frac{1}{M}$.

2. **Constructing the Continuous Piecewise Linear Interpolant:**
   Let $G(x)$ be the continuous piecewise linear function that satisfies $G(x_k) = f(x_k)$ at all $M + 1$ knot points. As established in Section 3.6, any continuous piecewise linear function on $[0, 1]$ with $M$ internal knots can be represented by a single hidden layer of $M$ ReLU units plus an affine term.

3. **Bounding the Interpolation Error:**
   For any $x \in [x_{k-1}, x_k]$, $G(x)$ is a straight line connecting $(x_{k-1}, f(x_{k-1}))$ and $(x_k, f(x_k))$:
   $$
   G(x) = (1 - t) f(x_{k-1}) + t f(x_k) \quad \text{where } t = \frac{x - x_{k-1}}{h} \in [0, 1]
   $$
   Then the error is:
   $$
   \begin{aligned}
   |f(x) - G(x)| &= |f(x) - (1 - t) f(x_{k-1}) - t f(x_k)| \\
   &= |(1 - t)(f(x) - f(x_{k-1})) + t(f(x) - f(x_k))| \\
   &\le (1 - t) |f(x) - f(x_{k-1})| + t |f(x) - f(x_k)|
   \end{aligned}
   $$

4. **Applying the Lipschitz Condition:**
   $$
   |f(x) - f(x_{k-1})| \le L_f |x - x_{k-1}| = L_f t h
   $$
   $$
   |f(x) - f(x_k)| \le L_f |x - x_k| = L_f (1 - t) h
   $$
   Substituting:
   $$
   |f(x) - G(x)| \le (1 - t)(L_f t h) + t(L_f (1 - t) h) = 2 L_f h t(1 - t)
   $$

5. **Maximizing Over $t \in [0, 1]$:**
   The quadratic $t(1 - t)$ attains its maximum at $t = \frac{1}{2}$, where $t(1 - t) = \frac{1}{4}$.
   $$
   |f(x) - G(x)| \le 2 L_f h \left(\frac{1}{4}\right) = \frac{L_f h}{2} = \frac{L_f}{2M} \quad \blacksquare
   $$

---

### Exercise 3.3: Parametric ReLU (PReLU) Gradient Derivation
**Problem Statement:**  
Let $a = \text{PReLU}(z; \alpha) = \max(0, z) + \alpha \min(0, z)$.  
1. Derive the partial derivatives $\frac{\partial a}{\partial z}$ and $\frac{\partial a}{\partial \alpha}$.
2. For a batch of $B$ samples with pre-activations $z^{(i)}$ and incoming adjoints $\delta^{(i)} = \frac{\partial \mathcal{L}}{\partial a^{(i)}}$, derive the vectorized update equation for $\alpha$ using momentum $\beta$.

**Detailed Solution:**  
1. **Partial Derivatives:**
   - With respect to $z$:
     $$
     \frac{\partial a}{\partial z} = \begin{cases} 1 & \text{if } z > 0 \\ \alpha & \text{if } z < 0 \end{cases}
     $$
   - With respect to $\alpha$:
     $$
     \frac{\partial a}{\partial \alpha} = \min(0, z) = \begin{cases} 0 & \text{if } z \ge 0 \\ z & \text{if } z < 0 \end{cases}
     $$

2. **Batch Loss Gradient:**
   By the multivariate chain rule across the batch $i = 1, \dots, B$:
   $$
   \frac{\partial \mathcal{L}}{\partial \alpha} = \sum_{i=1}^B \frac{\partial \mathcal{L}}{\partial a^{(i)}} \frac{\partial a^{(i)}}{\partial \alpha} = \sum_{i: z^{(i)} < 0} \delta^{(i)} z^{(i)}
   $$

3. **Momentum Update Equation:**
   Let $g_t = \frac{\partial \mathcal{L}}{\partial \alpha}$. The velocity vector $v_t$ and parameter $\alpha_t$ update as:
   $$
   v_t = \beta v_{t-1} + (1 - \beta) \left( \sum_{i: z^{(i)} < 0} \delta^{(i)} z^{(i)} \right)
   $$
   $$
   \alpha_{t+1} = \alpha_t - \eta v_t
   $$

---

### Exercise 3.4: Second-Order Derivatives and Inflection Points of Sigmoid and Tanh
**Problem Statement:**  
1. Compute the second derivative $\sigma''(z)$ of the logistic sigmoid, identify its inflection points, and determine the values of $z$ that maximize curvature.
2. Repeat for $\tanh(z)$.

**Detailed Solution:**  
1. **Logistic Sigmoid:**
   Recall $\sigma'(z) = \sigma(z)(1 - \sigma(z))$.
   $$
   \sigma''(z) = \sigma'(z)(1 - \sigma(z)) - \sigma(z)\sigma'(z) = \sigma'(z)(1 - 2\sigma(z)) = \sigma(z)(1 - \sigma(z))(1 - 2\sigma(z))
   $$
   Setting $\sigma''(z) = 0$:
   Since $\sigma(z) \in (0, 1)$, $\sigma(z) \neq 0$ and $1 - \sigma(z) \neq 0$.
   Thus:
   $$
   1 - 2\sigma(z) = 0 \implies \sigma(z) = 0.5 \implies z = 0
   $$
   The unique inflection point is at $(0, 0.5)$.

2. **Hyperbolic Tangent:**
   Recall $\tanh'(z) = 1 - \tanh^2(z)$.
   $$
   \tanh''(z) = -2\tanh(z) \tanh'(z) = -2\tanh(z)(1 - \tanh^2(z))
   $$
   Setting $\tanh''(z) = 0$:
   Since $1 - \tanh^2(z) > 0$ for all finite $z$, we have $\tanh(z) = 0 \implies z = 0$.
   The unique inflection point is at the origin $(0, 0)$.

---

### Exercise 3.5: Constructing an Arbitrary 2D Hypercube Indicator Using 4 ReLUs
**Problem Statement:**  
Construct an explicit 2-layer network using ReLUs that outputs a positive value inside the rectangle $[1, 3] \times [2, 5] \subset \mathbb{R}^2$ and zero everywhere outside.

**Detailed Solution:**  
1. **Define the 4 Boundary Hyperplanes:**
   - Left: $x_1 \ge 1 \iff x_1 - 1 \ge 0$
   - Right: $x_1 \le 3 \iff 3 - x_1 \ge 0$
   - Bottom: $x_2 \ge 2 \iff x_2 - 2 \ge 0$
   - Top: $x_2 \le 5 \iff 5 - x_2 \ge 0$

2. **Coordinate Penalty Formulation:**
   A point $(x_1, x_2)$ is outside the rectangle if and only if it violates at least one constraint. The violations can be measured by ReLUs:
   $$
   h_1 = \text{ReLU}(1 - x_1) \quad (\text{positive if } x_1 < 1)
   $$
   $$
   h_2 = \text{ReLU}(x_1 - 3) \quad (\text{positive if } x_1 > 3)
   $$
   $$
   h_3 = \text{ReLU}(2 - x_2) \quad (\text{positive if } x_2 < 2)
   $$
   $$
   h_4 = \text{ReLU}(x_2 - 5) \quad (\text{positive if } x_2 > 5)
   $$

3. **Output Layer Integration:**
   The total violation penalty is $P(\mathbf{x}) = h_1 + h_2 + h_3 + h_4$.  
   Inside the rectangle, $P(\mathbf{x}) = 0$. Outside the rectangle, $P(\mathbf{x}) > 0$.  
   To produce a positive activation inside that vanishes outside:
   $$
   y = \text{ReLU}(1 - P(\mathbf{x})) = \text{ReLU}\left( 1 - h_1 - h_2 - h_3 - h_4 \right)
   $$
   - For $(x_1, x_2) \in [1, 3] \times [2, 5]$: all $h_i = 0 \implies y = \text{ReLU}(1 - 0) = 1$.
   - For any point outside: at least one $h_i \ge \epsilon > 0$. When the penalty exceeds $1$, $y = 0$. By scaling the weights on $h_i$ by a factor $K \gg 1$, the transition band can be made arbitrarily sharp.

---

### Exercise 3.6: Failure of Polynomial Activations in Universal Approximation
**Problem Statement:**  
Prove rigorously that a 2-layer neural network with quadratic activation $\sigma(z) = z^2$ cannot approximate the simple 1D function $f(x) = x^3$ on the interval $[-1, 1]$ with error $\epsilon < \frac{1}{8}$.

**Detailed Solution:**  
1. **Characterizing the Network Output:**
   Let $G(x) = \sum_{i=1}^N \alpha_i \sigma(w_i x + b_i) + c = \sum_{i=1}^N \alpha_i (w_i x + b_i)^2 + c$.
   Expanding each term:
   $$
   (w_i x + b_i)^2 = w_i^2 x^2 + 2 w_i b_i x + b_i^2
   $$
   Summing over all $N$ units:
   $$
   G(x) = \left( \sum_{i=1}^N \alpha_i w_i^2 \right) x^2 + \left( \sum_{i=1}^N 2 \alpha_i w_i b_i \right) x + \left( \sum_{i=1}^N \alpha_i b_i^2 + c \right)
   $$
   Thus, for any $N \in \mathbb{N}$ and any parameters, $G(x)$ is strictly a quadratic polynomial:
   $$
   G(x) = A x^2 + B x + C, \quad A, B, C \in \mathbb{R}
   $$

2. **Minimizing Uniform Distance to $f(x) = x^3$:**
   We seek $\min_{A, B, C} \max_{x \in [-1, 1]} |x^3 - (A x^2 + B x + C)|$.  
   By Chebyshev’s Alternation Theorem, the best uniform polynomial approximation of degree $k$ to $x^{k+1}$ on $[-1, 1]$ is obtained from the monic Chebyshev polynomial:
   $$
   \tilde{T}_3(x) = \frac{T_3(x)}{2^{3-1}} = \frac{4x^3 - 3x}{4} = x^3 - \frac{3}{4}x
   $$
   The optimal approximating polynomial is $P^*(x) = \frac{3}{4}x$ (where $A = 0, B = 0.75, C = 0$).

3. **Computing the Minimax Error:**
   The error function is:
   $$
   e(x) = x^3 - \frac{3}{4}x
   $$
   To find its extreme values on $[-1, 1]$:
   $$
   e'(x) = 3x^2 - \frac{3}{4} = 0 \implies x^2 = \frac{1}{4} \implies x = \pm \frac{1}{2}
   $$
   - At $x = \frac{1}{2}$: $e(1/2) = (1/8) - (3/8) = -2/8 = -0.25$.
   - At $x = 1$: $e(1) = 1 - 0.75 = +0.25$.
   The minimax uniform error is strictly:
   $$
   \|x^3 - G(x)\|_\infty \ge \frac{1}{4} = 0.25
   $$
   Because $0.25 > \frac{1}{8} = 0.125$, no quadratic neural network of any width can achieve error less than $0.125$.

---

### Exercise 3.7: GELU vs. ReLU Expectation under Gaussian Inputs
**Problem Statement:**  
Let $z \sim \mathcal{N}(0, 1)$ be a standard Gaussian variable.  
Compute the exact analytical expectations:
1. $\mathbb{E}[\text{ReLU}(z)]$
2. $\mathbb{E}[\text{GELU}(z)]$

**Detailed Solution:**  
1. **Expectation of ReLU:**
   $$
   \mathbb{E}[\text{ReLU}(z)] = \int_{-\infty}^\infty \max(0, z) \phi(z) dz = \int_0^\infty z \frac{1}{\sqrt{2\pi}} e^{-z^2/2} dz
   $$
   Using the substitution $u = z^2/2 \implies du = z dz$:
   $$
   \mathbb{E}[\text{ReLU}(z)] = \frac{1}{\sqrt{2\pi}} \int_0^\infty e^{-u} du = \frac{1}{\sqrt{2\pi}} [-e^{-u}]_0^\infty = \frac{1}{\sqrt{2\pi}} (0 - (-1)) = \frac{1}{\sqrt{2\pi}} \approx 0.39894
   $$

2. **Expectation of GELU:**
   Recall $\text{GELU}(z) = z \Phi(z)$.
   $$
   \mathbb{E}[\text{GELU}(z)] = \int_{-\infty}^\infty z \Phi(z) \phi(z) dz
   $$
   Notice that $\phi'(z) = -z \phi(z) \implies z \phi(z) = -\phi'(z)$.  
   Substitute into the integral:
   $$
   \mathbb{E}[\text{GELU}(z)] = -\int_{-\infty}^\infty \Phi(z) \phi'(z) dz
   $$
   Integrate by parts with $u = \Phi(z)$ and $dv = \phi'(z) dz \implies du = \phi(z) dz$ and $v = \phi(z)$:
   $$
   \int_{-\infty}^\infty \Phi(z) \phi'(z) dz = [\Phi(z) \phi(z)]_{-\infty}^\infty - \int_{-\infty}^\infty \phi(z) \phi(z) dz
   $$
   Since $\lim_{z \to \pm \infty} \Phi(z)\phi(z) = 0$:
   $$
   \mathbb{E}[\text{GELU}(z)] = \int_{-\infty}^\infty [\phi(z)]^2 dz = \int_{-\infty}^\infty \left(\frac{1}{\sqrt{2\pi}} e^{-z^2/2}\right)^2 dz = \frac{1}{2\pi} \int_{-\infty}^\infty e^{-z^2} dz
   $$
   Using the Gaussian integral $\int_{-\infty}^\infty e^{-z^2} dz = \sqrt{\pi}$:
   $$
   \mathbb{E}[\text{GELU}(z)] = \frac{1}{2\pi} \sqrt{\pi} = \frac{1}{2\sqrt{\pi}} \approx 0.28209
   $$
   Thus, GELU reduces the mean activation by approximately $29\%$ relative to ReLU, shifting it closer to zero.

---

### Exercise 3.8: Swish Self-Gating Gradient Flow
**Problem Statement:**  
Let $a = z \sigma(\beta z)$. Derive the exact partial derivative $\frac{\partial a}{\partial \beta}$ and explain its interpretation as an adaptive interpolation between the linear identity and ReLU.

**Detailed Solution:**  
1. **Deriving the Partial Derivative:**
   $$
   \frac{\partial a}{\partial \beta} = \frac{\partial}{\partial \beta} [z \sigma(\beta z)] = z \cdot \frac{\partial}{\partial \beta} \sigma(\beta z)
   $$
   By the chain rule: $\frac{\partial}{\partial \beta}\sigma(\beta z) = \sigma'(\beta z) \cdot z = z \sigma(\beta z)(1 - \sigma(\beta z))$.
   $$
   \frac{\partial a}{\partial \beta} = z^2 \sigma(\beta z)(1 - \sigma(\beta z))
   $$

2. **Analysis and Limiting Cases:**
   - Notice that $z^2 \ge 0$ and $\sigma(\beta z)(1 - \sigma(\beta z)) > 0$ for all real $z$. Therefore:
     $$
     \frac{\partial a}{\partial \beta} \ge 0 \quad \forall z \in \mathbb{R}
     $$
     The activation is monotonically increasing with respect to $\beta$ everywhere!
   - As $\beta \to 0$: $\sigma(0) = 0.5 \implies a(z) \to \frac{z}{2}$ (a scaled linear function).
   - As $\beta \to \infty$:
     - For $z > 0$: $\beta z \to +\infty \implies \sigma(\beta z) \to 1 \implies a(z) \to z$.
     - For $z < 0$: $\beta z \to -\infty \implies \sigma(\beta z) \to 0 \implies a(z) \to 0$.
     - Hence, $\lim_{\beta \to \infty} z \sigma(\beta z) = \text{ReLU}(z)$!
   - Parameter $\beta$ acts as a smooth temperature dial that interpolates continuously between linear regression ($\beta = 0$) and hard rectification ($\beta \to \infty$).

---

### Exercise 3.9: Softplus Function and its Relation to Sigmoid and ReLU
**Problem Statement:**  
The Softplus function is defined as $\zeta(z) = \ln(1 + e^z)$.  
1. Show that $\frac{d}{dz}\zeta(z) = \sigma(z)$.
2. Show that $\lim_{z \to \infty} (\zeta(z) - z) = 0$ and $\lim_{z \to -\infty} \zeta(z) = 0$, proving it is a smooth approximation of ReLU.

**Detailed Solution:**  
1. **Differentiating $\zeta(z)$:**
   $$
   \frac{d}{dz} \ln(1 + e^z) = \frac{1}{1 + e^z} \cdot \frac{d}{dz}(1 + e^z) = \frac{e^z}{1 + e^z} = \frac{1}{1 + e^{-z}} = \sigma(z) \quad \blacksquare
   $$
   The derivative of Softplus is exactly the logistic sigmoid function!

2. **Asymptotic Limits:**
   - As $z \to -\infty$: $e^z \to 0$, so $\lim_{z \to -\infty} \ln(1 + e^z) = \ln(1) = 0$.
   - As $z \to +\infty$: rewrite $\ln(1 + e^z) = \ln(e^z (e^{-z} + 1)) = \ln(e^z) + \ln(1 + e^{-z}) = z + \ln(1 + e^{-z})$.
     $$
     \lim_{z \to +\infty} (\zeta(z) - z) = \lim_{z \to +\infty} \ln(1 + e^{-z}) = \ln(1 + 0) = 0
     $$
   Thus, Softplus smoothly approximates $\text{ReLU}(z) = \max(0, z)$ with no derivative discontinuity at $z = 0$ (since $\zeta'(0) = \sigma(0) = 0.5$).

---

### Exercise 3.10: Depth-Efficiency Separation: The Sawtooth Theorem
**Problem Statement:**  
Telgarsky (2016) proved an exponential separation between depth and width. Consider the triangle "sawtooth" wave on $[0, 1]$ defined by $g(x) = 2 \text{ReLU}(x) - 4 \text{ReLU}(x - 0.5) + 2 \text{ReLU}(x - 1)$.  
1. Show that $g(x)$ maps $[0, 1] \to [0, 1]$ and has 2 linear pieces.
2. Show that iterating this function $k$ times ($f_k(x) = (g \circ g \circ \dots \circ g)(x)$) produces $2^k$ triangular teeth with $2^{k+1}$ linear pieces using a deep network of depth $k$ and width $O(1)$.
3. Explain why a shallow 1-hidden-layer network requires $\Omega(2^k)$ units to compute $f_k(x)$.

**Detailed Solution:**  
1. **Analyzing $g(x)$:**
   - For $x \in [0, 0.5]$: $g(x) = 2x$. It rises linearly from $g(0) = 0$ to $g(0.5) = 1.0$.
   - For $x \in [0.5, 1.0]$: $g(x) = 2x - 4(x - 0.5) = -2x + 2 = 2(1 - x)$. It falls linearly from $g(0.5) = 1.0$ to $g(1.0) = 0$.
   - Range is $[0, 1]$ and it has 2 linear segments (1 tooth).

2. **Iterated Composition ($f_k = g^{\circ k}$):**
   - In composition $g(g(x))$, each of the 2 linear segments of $g(x)$ sweeps across $[0, 1]$, and $g$ maps $[0, 1] \to [0, 1]$ with 2 segments.
   - Thus, $g(g(x))$ has $2 \times 2 = 4$ linear segments ($2^2 = 4$ teeth).
   - By mathematical induction, $f_k(x) = g^{\circ k}(x)$ has $2^k$ linear teeth and $2^{k+1}$ linear segments.
   - Each composition step $g(\cdot)$ requires 1 hidden layer with 3 ReLU units. A feedforward network with $k$ layers and $3$ units per layer ($3k$ total units) computes $f_k(x)$ exactly.

3. **Shallow Network Lower Bound:**
   A single-hidden-layer network with $M$ ReLU units is a continuous piecewise linear function with at most $M$ knots (at most $M + 1$ linear segments).  
   To compute $f_k(x)$—which has $2^{k+1}$ distinct linear segments—a single-hidden-layer network must possess at least $M \ge 2^{k+1} - 1 = \Omega(2^k)$ hidden units.  
   For $k = 100$, a deep network needs $300$ parameters, whereas a shallow network would require $2^{100} \approx 1.26 \times 10^{30}$ parameters. This establishes the profound representational efficiency of **depth** in neural networks.
