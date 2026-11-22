# Chapter 7: Vanishing and Exploding Gradients & Weight Initialization

> *"If the weights in a deep network are initialized too small, the signal diminishes as it passes through each layer until it is too tiny to be of any use. If they are initialized too large, the signal grows until it explodes. Between these twin precipices lies a razor-thin canyon of stability where deep learning is possible."*  
> — **Xavier Glorot & Yoshua Bengio**, *Understanding the Difficulty of Training Deep Feedforward Neural Networks* (2010)

---

## 7.1 The Deep Matrix Product Pathology

In the formative years of deep learning (1990–2010), training feedforward networks with more than a few hidden layers routinely failed. Networks either completely failed to learn or trained at an excruciatingly slow pace.

To understand the mathematical origin of this failure, consider an $L$-layer feedforward network with linear or sigmoidal activations. By combining the fundamental backpropagation equations derived in Chapter 6:
$$
\boldsymbol{\delta}^{[l]} = \left( (\mathbf{W}^{[l+1]})^T \boldsymbol{\delta}^{[l+1]} \right) \odot (g^{[l]})'(\mathbf{z}^{[l]})
$$
Unrolling this recurrence from output layer $L$ all the way back to the first hidden layer $l = 1$:
$$
\boldsymbol{\delta}^{[1]} = \left[ \prod_{l=1}^{L-1} (\mathbf{W}^{[l+1]})^T \operatorname{diag}\left((g^{[l]})'(\mathbf{z}^{[l]})\right) \right] \boldsymbol{\delta}^{[L]}
$$

```
              Error Signal Propagation Across an L-Layer Cascade
              
     delta^[1] <--- [ W^[2]T D^[1] ] <--- [ W^[3]T D^[2] ] <--- ... <--- delta^[L]
                      (Factor 1)            (Factor 2)             (Factor L-1)
                      
     Case 1: Factors < 1.0  ===>  Exponential Decay   (Vanishing Gradients)
     Case 2: Factors > 1.0  ===>  Exponential Growth  (Exploding Gradients)
     Target: Factors ~ 1.0  ===>  Dynamical Isometry  (Stable Deep Learning)
```

Notice that the error vector $\boldsymbol{\delta}^{[1]}$ driving the parameter updates of the first layer is the product of $L-1$ matrices and diagonal derivative operators.

This unrolled product exhibits the classical pathology of an **iterated discrete linear dynamical system** $\mathbf{v}_k = \mathbf{M}^k \mathbf{v}_0$:
1. **Exponential Vanishing:** If the effective operator norms of the factors are consistently less than $1$ (e.g., $0.8$), then after $L = 50$ layers, the error magnitude is attenuated by $(0.8)^{50} \approx 1.43 \times 10^{-5}$. The gradient at the earliest layers vanishes, leaving them frozen at their random initializations.
2. **Exponential Explosion:** If the effective operator norms exceed $1$ (e.g., $1.3$), then after $L = 50$ layers, the error magnitude expands by $(1.3)^{50} \approx 4.97 \times 10^5$. Gradients explode to numerical infinity (`inf` or `NaN`), destabilizing weight updates.

---

## 7.2 Spectral Analysis and Dynamical Isometry

To quantify the stability of signal propagation, we analyze the **spectral properties** of the transition operators.

### 7.2.1 Singular Values and Spectral Norms

Let $\mathbf{W} \in \mathbb{R}^{n_{\text{out}} \times n_{\text{in}}}$ be a weight matrix. By the Singular Value Decomposition (SVD):
$$
\mathbf{W} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^T
$$
where $\mathbf{U} \in \mathbb{R}^{n_{\text{out}} \times n_{\text{out}}}$ and $\mathbf{V} \in \mathbb{R}^{n_{\text{in}} \times n_{\text{in}}}$ are orthogonal matrices, and $\boldsymbol{\Sigma}$ is a diagonal matrix containing the ordered singular values:
$$
\sigma_{\max} = \sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_r > 0
$$

The **spectral norm** (induced $L_2$ operator norm) of $\mathbf{W}$ is:
$$
\|\mathbf{W}\|_2 = \sup_{\mathbf{x} \neq \mathbf{0}} \frac{\|\mathbf{W} \mathbf{x}\|_2}{\|\mathbf{x}\|_2} = \sigma_{\max}(\mathbf{W}) = \sqrt{\lambda_{\max}(\mathbf{W}^T \mathbf{W})}
$$

For an iterated product of random matrices $\mathbf{M}_{\text{net}} = \prod_{l=1}^{L-1} \mathbf{W}^{[l+1]T}$:
- By the sub-multiplicative property of matrix norms:
  $$
  \|\boldsymbol{\delta}^{[1]}\|_2 \le \left( \prod_{l=1}^{L-1} \|\mathbf{W}^{[l+1]}\|_2 \cdot \|(g^{[l]})'\|_\infty \right) \|\boldsymbol{\delta}^{[L]}\|_2
  $$
- If the maximum singular values $\sigma_{\max} < 1$, gradient vanishing is guaranteed.
- If the minimum singular values $\sigma_{\min} > 1$, gradient explosion is guaranteed.

### 7.2.2 The Principle of Dynamical Isometry

Saxe, McClelland, and Ganguli (2013) formalized the condition for optimal signal propagation in deep networks as **dynamical isometry**:  
A network achieves dynamical isometry if the entire singular value spectrum of the input-output Jacobian $\mathbf{J} = \frac{\partial \mathbf{a}^{[L]}}{\partial \mathbf{a}^{[0]}}$ is concentrated tightly around $1.0$:
$$
\sigma_i(\mathbf{J}) \approx 1.0 \quad \forall i
$$
Under dynamical isometry, vectors propagate through the network without change in length or relative angle, allowing gradients to flow unimpeded across hundreds of layers.

---

## 7.3 Xavier / Glorot Initialization (2010)

Prior to 2010, the standard convention was to initialize weights from a uniform distribution $U[-1/\sqrt{d}, 1/\sqrt{d}]$ or a Gaussian $\mathcal{N}(0, 1)$. In their landmark paper, *Understanding the Difficulty of Training Deep Feedforward Neural Networks*, Xavier Glorot and Yoshua Bengio analyzed variance dynamics during forward and backward passes.

```
       Variance Preservation Model across a Dense Neuron
       
       x1 ----(w1)----+
       x2 ----(w2)----+---> z = \sum_{i=1}^{n_in} w_i x_i + b ---> a = g(z)
       ...            |
       x_n ---(wn)----+
       
       Goal: Var(z) == Var(x)  (Forward Pass)
             Var(delta^[l]) == Var(delta^[l+1])  (Backward Pass)
```

### 7.3.1 Forward Pass Variance Derivation

Consider an arbitrary neuron in layer $l$ computing pre-activation $z$:
$$
z = \sum_{j=1}^{n_{\text{in}}} w_j x_j + b
$$
where $n_{\text{in}} = d_{l-1}$ is the fan-in (number of input connections).

Assume:
1. Weights $w_j$ are independent and identically distributed with zero mean: $\mathbb{E}[w_j] = 0$ and $\operatorname{Var}(w_j) = \operatorname{Var}(W)$.
2. Inputs $x_j$ are independent and identically distributed with zero mean: $\mathbb{E}[x_j] = 0$ and $\operatorname{Var}(x_j) = \operatorname{Var}(X)$.
3. Weights and inputs are mutually independent: $\mathbb{E}[w_j x_j] = \mathbb{E}[w_j] \mathbb{E}[x_j] = 0$.
4. Bias $b$ is initialized to zero: $b = 0$.

Compute the expected value of $z$:
$$
\mathbb{E}[z] = \sum_{j=1}^{n_{\text{in}}} \mathbb{E}[w_j x_j] = \sum_{j=1}^{n_{\text{in}}} \mathbb{E}[w_j] \mathbb{E}[x_j] = 0
$$

Compute the variance of $z$:
$$
\operatorname{Var}(z) = \operatorname{Var}\left( \sum_{j=1}^{n_{\text{in}}} w_j x_j \right) = \sum_{j=1}^{n_{\text{in}}} \operatorname{Var}(w_j x_j)
$$
Using the variance identity for the product of two independent random variables:
$$
\operatorname{Var}(w_j x_j) = \mathbb{E}[w_j]^2 \operatorname{Var}(x_j) + \mathbb{E}[x_j]^2 \operatorname{Var}(w_j) + \operatorname{Var}(w_j) \operatorname{Var}(x_j)
$$
Since $\mathbb{E}[w_j] = 0$ and $\mathbb{E}[x_j] = 0$:
$$
\operatorname{Var}(w_j x_j) = \operatorname{Var}(w_j) \operatorname{Var}(x_j) = \operatorname{Var}(W) \operatorname{Var}(X)
$$
Summing across all $n_{\text{in}}$ inputs:
$$
\operatorname{Var}(z) = n_{\text{in}} \operatorname{Var}(W) \operatorname{Var}(X)
$$

Assuming activation $g(z)$ is approximately linear near the origin with unit derivative ($g'(0) \approx 1$, as in $\tanh$ or normalized sigmoid):
$$
\operatorname{Var}(a) \approx \operatorname{Var}(z) = n_{\text{in}} \operatorname{Var}(W) \operatorname{Var}(X)
$$

To prevent activations from exploding or decaying as they propagate forward through successive layers, we require the variance of the output to match the variance of the input:
$$
\operatorname{Var}(a) = \operatorname{Var}(X) \iff n_{\text{in}} \operatorname{Var}(W) = 1
$$
This yields the **Forward Pass Initialization Condition**:
$$
\operatorname{Var}(W) = \frac{1}{n_{\text{in}}}
$$

---

### 7.3.2 Backward Pass Variance Derivation

Now consider the backward propagation of error gradients from layer $l+1$ to layer $l$.  
From Equation (BP2):
$$
\delta_j^{[l]} = \left( \sum_{k=1}^{n_{\text{out}}} W_{kj}^{[l+1]} \delta_k^{[l+1]} \right) \cdot (g^{[l]})'(z_j^{[l]})
$$
where $n_{\text{out}} = d_{l+1}$ is the fan-out (number of output connections).

Assuming $g'(z) \approx 1$, zero-mean gradients, and independence:
$$
\operatorname{Var}(\delta^{[l]}) = n_{\text{out}} \operatorname{Var}(W) \operatorname{Var}(\delta^{[l+1]})
$$

To prevent gradient signals from exploding or vanishing as they propagate backward, we require:
$$
\operatorname{Var}(\delta^{[l]}) = \operatorname{Var}(\delta^{[l+1]}) \iff n_{\text{out}} \operatorname{Var}(W) = 1
$$
This yields the **Backward Pass Initialization Condition**:
$$
\operatorname{Var}(W) = \frac{1}{n_{\text{out}}}
$$

---

### 7.3.3 The Harmonic Compromise: Glorot Formula

In general, $n_{\text{in}} \neq n_{\text{out}}$ (e.g., a layer transforming 512 dimensions to 128 dimensions). We cannot satisfy both conditions simultaneously with a single variance.  
Glorot and Bengio proposed adopting the **harmonic mean** of the two conditions:
$$
\operatorname{Var}(W) = \frac{2}{n_{\text{in}} + n_{\text{out}}}
$$

#### 1. Glorot Normal Initialization:
Sample weights from a Gaussian distribution:
$$
W_{ij} \sim \mathcal{N}\left( 0, \; \frac{2}{n_{\text{in}} + n_{\text{out}}} \right)
$$

#### 2. Glorot Uniform Initialization:
For a uniform distribution $U[-a, a]$, the variance is $\operatorname{Var} = \frac{(a - (-a))^2}{12} = \frac{4a^2}{12} = \frac{a^2}{3}$.  
Setting $\frac{a^2}{3} = \frac{2}{n_{\text{in}} + n_{\text{out}}}$:
$$
a^2 = \frac{6}{n_{\text{in}} + n_{\text{out}}} \implies a = \sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}}
$$
$$
W_{ij} \sim U\left[ -\sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}}, \; +\sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}} \right]
$$

---

## 7.4 He / Kaiming Initialization (2015)

Glorot initialization was derived assuming an activation function linear near zero with $g'(0) \approx 1$.  
When applied to networks utilizing the **Rectified Linear Unit (ReLU)**:
$$
g(z) = \max(0, z)
$$
Glorot initialization fails catastrophically in very deep networks.

### 7.4.1 The Factor of 2 Pathology under Rectification

Let $z \sim \mathcal{N}(0, \sigma_z^2)$ be a symmetric zero-mean Gaussian distribution.  
When passed through ReLU, all negative values are clamped to zero:
$$
a = \max(0, z) = \begin{cases} z & \text{if } z > 0 \\ 0 & \text{if } z \le 0 \end{cases}
$$

Let us compute the second moment $\mathbb{E}[a^2]$:
$$
\mathbb{E}[a^2] = \int_{-\infty}^\infty [\max(0, z)]^2 p(z) \, dz = \int_0^\infty z^2 p(z) \, dz
$$
Because $z^2 p(z)$ is an even function and $p(z)$ is symmetric about zero:
$$
\int_0^\infty z^2 p(z) \, dz = \frac{1}{2} \int_{-\infty}^\infty z^2 p(z) \, dz = \frac{1}{2} \mathbb{E}[z^2] = \frac{1}{2} \operatorname{Var}(z)
$$
ReLU **halves the second moment** at every layer!

If we use Glorot initialization ($\operatorname{Var}(W) = 1 / n_{\text{in}}$):
$$
\operatorname{Var}(z^{[l]}) = n_{\text{in}} \operatorname{Var}(W) \mathbb{E}[(a^{[l-1]})^2] = n_{\text{in}} \left(\frac{1}{n_{\text{in}}}\right) \left( \frac{1}{2} \operatorname{Var}(z^{[l-1]}) \right) = \frac{1}{2} \operatorname{Var}(z^{[l-1]})
$$
At each layer, the activation variance is multiplied by $\frac{1}{2}$.  
In a 30-layer ReLU network:
$$
\operatorname{Var}(z^{[30]}) = \left(\frac{1}{2}\right)^{30} \operatorname{Var}(z^{[0]}) \approx 9.31 \times 10^{-10} \operatorname{Var}(z^{[0]})
$$
The signal variance drops by 9 orders of magnitude, causing complete network paralysis.

---

### 7.4.2 Derivation of He / Kaiming Variance

To compensate for the halving of variance induced by ReLU rectification, Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun (2015) introduced **He Initialization**:
$$
n_{\text{in}} \operatorname{Var}(W) \left(\frac{1}{2}\right) = 1 \iff \operatorname{Var}(W) = \frac{2}{n_{\text{in}}}
$$

#### 1. He Normal Initialization:
$$
W_{ij} \sim \mathcal{N}\left( 0, \; \frac{2}{n_{\text{in}}} \right)
$$

#### 2. He Uniform Initialization:
Setting $\frac{a^2}{3} = \frac{2}{n_{\text{in}}}$:
$$
a = \sqrt{\frac{6}{n_{\text{in}}}}
$$
$$
W_{ij} \sim U\left[ -\sqrt{\frac{6}{n_{\text{in}}}}, \; +\sqrt{\frac{6}{n_{\text{in}}}} \right]
$$

#### 3. Generalization to Leaky ReLU:
For Leaky ReLU with negative slope $\alpha$:
$$
\mathbb{E}[a^2] = \frac{1}{2} \operatorname{Var}(z) + \frac{1}{2} \alpha^2 \operatorname{Var}(z) = \left( \frac{1 + \alpha^2}{2} \right) \operatorname{Var}(z)
$$
Preserving variance yields:
$$
\operatorname{Var}(W) = \frac{2}{(1 + \alpha^2) n_{\text{in}}}
$$
- For standard ReLU ($\alpha = 0$): $\operatorname{Var}(W) = \frac{2}{n_{\text{in}}}$.
- For linear activation ($\alpha = 1$): $\operatorname{Var}(W) = \frac{2}{(1 + 1) n_{\text{in}}} = \frac{1}{n_{\text{in}}}$ (recovering the forward Glorot condition).

---

### 7.4.3 Comparative Synthesis of Initialization Schemes

| Initialization Scheme | Target Activation Function | Variance $\operatorname{Var}(W)$ | Uniform Bound $[-a, a]$ |
| :--- | :--- | :--- | :--- |
| **LeCun (1998)** | SELU / Tanh | $\frac{1}{n_{\text{in}}}$ | $\sqrt{\frac{3}{n_{\text{in}}}}$ |
| **Glorot / Xavier (2010)** | Sigmoid / Tanh / Softmax | $\frac{2}{n_{\text{in}} + n_{\text{out}}}$ | $\sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}}$ |
| **He / Kaiming (2015)** | ReLU / PReLU | $\frac{2}{n_{\text{in}}}$ | $\sqrt{\frac{6}{n_{\text{in}}}}$ |
| **He (Leaky ReLU)** | Leaky ReLU (slope $\alpha$) | $\frac{2}{(1 + \alpha^2) n_{\text{in}}}$ | $\sqrt{\frac{6}{(1 + \alpha^2) n_{\text{in}}}}$ |
| **Orthogonal (Saxe 2013)** | Deep Linear / RNNs | $\mathbf{W}^T \mathbf{W} = \mathbf{I}$ (SVD / QR) | Exact Dynamical Isometry |

---

## 7.5 Gradient Clipping

Even with optimal weight initialization, stochastic mini-batch optimization on highly non-convex loss surfaces—particularly in Recurrent Neural Networks (RNNs) and deep Transformers—frequently encounters steep ravines or cliff-like loss barriers. Taking a standard gradient descent step $\Delta \boldsymbol{\theta} = -\eta \mathbf{g}$ across a cliff propels parameters into distant, corrupted regions of parameter space.

To safeguard optimization, Pascanu, Mikolov, and Bengio (2013) formulated **Gradient Clipping**.

```
           Gradient Clipping Prevents Catastrophic Parameter Jumps
           
       Loss
        ^
        |          |      |  (Steep Cliff / Ravine)
        |          |  *   |
        |          | / \  |
        |          |/   \ |
        |          /     \
        +---------+-------+------------------------------> Parameter \theta
                   ^     |
                   |     +--- Unclipped step \Delta\theta jumps out to infinity!
                   +--------- Clipped step lands safely at base of ravine.
```

### 7.5.1 Value Clipping (Element-wise Thresholding)

In value clipping, each individual gradient coordinate is clamped independently to a closed interval $[-c, c]$:
$$
g_i \leftarrow \max(-c, \min(c, g_i))
$$
**Fatal Flaw:** Value clipping alters the **direction** of the gradient vector $\mathbf{g}$, destroying the steepest descent trajectory.

### 7.5.2 Global Norm Clipping (Direction-Preserving)

In global norm clipping, the complete parameter gradient vector across all $P$ parameters in the network:
$$
\mathbf{g} = \left[ \nabla_{\boldsymbol{\theta}_1} \mathcal{L}^T, \; \nabla_{\boldsymbol{\theta}_2} \mathcal{L}^T, \; \dots, \; \nabla_{\boldsymbol{\theta}_M} \mathcal{L}^T \right]^T \in \mathbb{R}^P
$$
has its Euclidean $L_2$ norm computed:
$$
\|\mathbf{g}\|_2 = \sqrt{\sum_{i=1}^P g_i^2}
$$

If $\|\mathbf{g}\|_2$ exceeds a maximum threshold $c > 0$, the entire gradient vector is rescaled by factor $\frac{c}{\|\mathbf{g}\|_2}$:
$$
\mathbf{g} \leftarrow \mathbf{g} \cdot \frac{c}{\max(c, \|\mathbf{g}\|_2)}
$$

- If $\|\mathbf{g}\|_2 \le c$: The gradient vector is unchanged ($\mathbf{g} \leftarrow \mathbf{g}$).
- If $\|\mathbf{g}\|_2 > c$: The vector is scaled to have length exactly $c$:
  $$
  \|\mathbf{g}_{\text{clipped}}\|_2 = \left\| \mathbf{g} \cdot \frac{c}{\|\mathbf{g}\|_2} \right\|_2 = c \cdot \frac{\|\mathbf{g}\|_2}{\|\mathbf{g}\|_2} = c
  $$
- **Preservation of Direction:** The unit vector remains identical:
  $$
  \frac{\mathbf{g}_{\text{clipped}}}{\|\mathbf{g}_{\text{clipped}}\|_2} = \frac{\mathbf{g}}{\|\mathbf{g}\|_2}
  $$
Global norm clipping bounds the maximum possible parameter step size to $\eta \cdot c$ without distorting the direction of descent.

---

## 7.6 Exactly 10 Worked Examples

### Example 7.1: Derivation of the Deep Matrix Product Error Propagation Bound
**Problem Statement:**  
Let an $L$-layer network have linear activation ($g'(z) = 1$). The weight matrices satisfy $\|\mathbf{W}^{[l]}\|_2 \le \gamma$ for all $l$.  
1. Derive an upper bound on the ratio $\frac{\|\boldsymbol{\delta}^{[1]}\|_2}{\|\boldsymbol{\delta}^{[L]}\|_2}$.
2. If $\gamma = 0.9$ and $L = 50$, compute the maximum fraction of error signal reaching layer 1.

**Step-by-Step Solution:**  
1. **Unrolling Error Equation:**
   $$
   \boldsymbol{\delta}^{[1]} = \left( \prod_{l=1}^{L-1} (\mathbf{W}^{[l+1]})^T \right) \boldsymbol{\delta}^{[L]}
   $$
   Taking the Euclidean norm and applying the Cauchy-Schwarz sub-multiplicative inequality:
   $$
   \|\boldsymbol{\delta}^{[1]}\|_2 \le \left( \prod_{l=1}^{L-1} \|(\mathbf{W}^{[l+1]})^T\|_2 \right) \|\boldsymbol{\delta}^{[L]}\|_2
   $$
   Because $\|(\mathbf{W}^{[l+1]})^T\|_2 = \|\mathbf{W}^{[l+1]}\|_2 \le \gamma$:
   $$
   \|\boldsymbol{\delta}^{[1]}\|_2 \le \gamma^{L-1} \|\boldsymbol{\delta}^{[L]}\|_2 \implies \frac{\|\boldsymbol{\delta}^{[1]}\|_2}{\|\boldsymbol{\delta}^{[L]}\|_2} \le \gamma^{L-1}
   $$

2. **Numerical Evaluation ($\gamma = 0.9, L = 50$):**
   $$
   \gamma^{L-1} = (0.9)^{49} \approx 0.005726
   $$
   Less than $0.58\%$ of the original output error reaches the first hidden layer.

---

### Example 7.2: Rigorous Step-by-Step Derivation of Xavier Forward Condition
**Problem Statement:**  
Let $z = \sum_{j=1}^{n_{\text{in}}} w_j x_j$. Prove from first principles that if $w_j$ and $x_j$ are independent zero-mean random variables, then $\operatorname{Var}(z) = n_{\text{in}} \operatorname{Var}(W) \operatorname{Var}(X)$.

**Step-by-Step Solution:**  
1. **Mean of Sum:**
   $$
   \mathbb{E}[z] = \mathbb{E}\left[ \sum_{j=1}^{n_{\text{in}}} w_j x_j \right] = \sum_{j=1}^{n_{\text{in}}} \mathbb{E}[w_j x_j]
   $$
   By independence: $\mathbb{E}[w_j x_j] = \mathbb{E}[w_j] \mathbb{E}[x_j] = 0 \times 0 = 0$.

2. **Variance of Sum of Independent Variables:**
   $$
   \operatorname{Var}(z) = \mathbb{E}[(z - \mathbb{E}[z])^2] = \mathbb{E}[z^2] = \mathbb{E}\left[ \left( \sum_{j=1}^{n_{\text{in}}} w_j x_j \right)^2 \right]
   $$
   Expanding the square:
   $$
   \operatorname{Var}(z) = \mathbb{E}\left[ \sum_{j=1}^{n_{\text{in}}} w_j^2 x_j^2 + \sum_{j \neq k} w_j x_j w_k x_k \right]
   $$

3. **Evaluating Cross-Terms ($j \neq k$):**
   By pairwise independence:
   $$
   \mathbb{E}[w_j x_j w_k x_k] = \mathbb{E}[w_j] \mathbb{E}[x_j] \mathbb{E}[w_k] \mathbb{E}[x_k] = 0 \times 0 \times 0 \times 0 = 0
   $$

4. **Evaluating Squared Terms:**
   $$
   \mathbb{E}[w_j^2 x_j^2] = \mathbb{E}[w_j^2] \mathbb{E}[x_j^2]
   $$
   Since $\mathbb{E}[w_j] = 0 \implies \operatorname{Var}(w_j) = \mathbb{E}[w_j^2] - 0^2 = \mathbb{E}[w_j^2] = \operatorname{Var}(W)$.  
   Similarly, $\mathbb{E}[x_j^2] = \operatorname{Var}(X)$.  
   $$
   \mathbb{E}[w_j^2 x_j^2] = \operatorname{Var}(W) \operatorname{Var}(X)
   $$

5. **Summing Over $n_{\text{in}}$:**
   $$
   \operatorname{Var}(z) = \sum_{j=1}^{n_{\text{in}}} \operatorname{Var}(W) \operatorname{Var}(X) = n_{\text{in}} \operatorname{Var}(W) \operatorname{Var}(X) \quad \blacksquare
   $$

---

### Example 7.3: He / Kaiming Normal and Uniform Bounds Computation
**Problem Statement:**  
A dense layer has input dimension $n_{\text{in}} = 512$ and output dimension $n_{\text{out}} = 256$, using ReLU activations.  
1. Compute the standard deviation $\sigma_{\text{He}}$ for He Normal initialization.
2. Compute the interval $[-a, a]$ for He Uniform initialization.
3. Compare against Glorot Uniform initialization for the same layer.

**Step-by-Step Solution:**  
1. **He Normal Initialization:**
   $$
   \operatorname{Var}(W) = \frac{2}{n_{\text{in}}} = \frac{2}{512} = \frac{1}{256}
   $$
   $$
   \sigma_{\text{He}} = \sqrt{\frac{1}{256}} = \frac{1}{16} = 0.0625
   $$
   Weights sampled as $W \sim \mathcal{N}(0, (0.0625)^2)$.

2. **He Uniform Initialization:**
   $$
   a_{\text{He}} = \sqrt{\frac{6}{n_{\text{in}}}} = \sqrt{\frac{6}{512}} = \sqrt{0.01171875} \approx 0.108253
   $$
   Interval: $[-0.10825, +0.10825]$.

3. **Glorot Uniform Comparison:**
   $$
   a_{\text{Glorot}} = \sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}} = \sqrt{\frac{6}{512 + 256}} = \sqrt{\frac{6}{768}} = \sqrt{0.0078125} \approx 0.088388
   $$
   Notice $a_{\text{He}} \approx 0.108 > a_{\text{Glorot}} \approx 0.088$. He initialization samples roughly $22\%$ larger weights to offset the variance lost by ReLU rectification.

---

### Example 7.4: Leaky ReLU Variance Derivation
**Problem Statement:**  
For Leaky ReLU $g(z) = \max(\alpha z, z)$, prove that $\mathbb{E}[g(z)^2] = \frac{1 + \alpha^2}{2} \operatorname{Var}(z)$ when $z \sim \mathcal{N}(0, \sigma^2)$.

**Step-by-Step Solution:**  
1. **Partitioning the Integral:**
   $$
   \mathbb{E}[g(z)^2] = \int_{-\infty}^0 (\alpha z)^2 p(z) \, dz + \int_0^\infty z^2 p(z) \, dz = \alpha^2 \int_{-\infty}^0 z^2 p(z) \, dz + \int_0^\infty z^2 p(z) \, dz
   $$

2. **Symmetry of Gaussian Density:**
   Because $p(z)$ is symmetric around zero:
   $$
   \int_{-\infty}^0 z^2 p(z) \, dz = \int_0^\infty z^2 p(z) \, dz = \frac{1}{2} \int_{-\infty}^\infty z^2 p(z) \, dz = \frac{1}{2} \operatorname{Var}(z)
   $$

3. **Summing Terms:**
   $$
   \mathbb{E}[g(z)^2] = \alpha^2 \left( \frac{1}{2} \operatorname{Var}(z) \right) + 1 \left( \frac{1}{2} \operatorname{Var}(z) \right) = \left( \frac{1 + \alpha^2}{2} \right) \operatorname{Var}(z) \quad \blacksquare
   $$

---

### Example 7.5: Variance Decay Simulation in a 20-Layer Linear Network
**Problem Statement:**  
A 20-layer linear network has uniform layer width $n = 100$. The weights are initialized with standard Gaussian noise $W_{ij} \sim \mathcal{N}(0, 0.04)$ ($\operatorname{Var}(W) = 0.04$). The input variance is $\operatorname{Var}(x) = 1.0$.  
1. Compute the variance of pre-activations at layer 1, layer 10, and layer 20.
2. What value of $\operatorname{Var}(W)$ would maintain unit variance throughout?

**Step-by-Step Solution:**  
1. **Variance Recurrence:**
   $$
   \operatorname{Var}(z^{[l]}) = n \operatorname{Var}(W) \operatorname{Var}(z^{[l-1]})
   $$
   The amplification factor per layer is:
   $$
   \kappa = n \operatorname{Var}(W) = 100 \times 0.04 = 4.0
   $$
   - Layer 1: $\operatorname{Var}(z^{[1]}) = 4.0 \times 1.0 = 4.0$.
   - Layer 10: $\operatorname{Var}(z^{[10]}) = (4.0)^{10} \times 1.0 = 1,048,576 \approx 1.05 \times 10^6$.
   - Layer 20: $\operatorname{Var}(z^{[20]}) = (4.0)^{20} \times 1.0 \approx 1.0995 \times 10^{12}$.
   The signal variance explodes by a factor of over one trillion after 20 layers!

2. **Stable Initialization:**
   To maintain constant variance:
   $$
   \kappa = n \operatorname{Var}(W) = 1.0 \implies \operatorname{Var}(W) = \frac{1}{n} = \frac{1}{100} = 0.01 \implies \sigma_W = 0.10
   $$

---

### Example 7.6: SVD and Spectral Norm of a $2 \times 2$ Weight Matrix
**Problem Statement:**  
Let weight matrix be:
$$
\mathbf{W} = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}
$$
1. Find the eigenvalues and eigenvectors of $\mathbf{W}$.
2. Compute the spectral norm $\|\mathbf{W}\|_2$.
3. Compute the matrix power $\mathbf{W}^{10}$ to show how spectral radius drives exponential growth.

**Step-by-Step Solution:**  
1. **Eigenvalues of $\mathbf{W}$:**
   Characteristic equation:
   $$
   \det(\mathbf{W} - \lambda \mathbf{I}) = \det\begin{bmatrix} 3 - \lambda & 1 \\ 1 & 3 - \lambda \end{bmatrix} = (3 - \lambda)^2 - 1 = 0
   $$
   $$
   (3 - \lambda)^2 = 1 \implies 3 - \lambda = \pm 1 \implies \lambda_1 = 4, \; \lambda_2 = 2
   $$

2. **Spectral Norm:**
   Because $\mathbf{W}$ is symmetric and real, its singular values are the absolute values of its eigenvalues:
   $$
   \|\mathbf{W}\|_2 = \sigma_{\max}(\mathbf{W}) = \max(|\lambda_1|, |\lambda_2|) = 4
   $$

3. **Matrix Power $\mathbf{W}^{10}$:**
   Eigen-decomposition $\mathbf{W} = \mathbf{Q} \boldsymbol{\Lambda} \mathbf{Q}^T$:
   - For $\lambda_1 = 4$: $\mathbf{q}_1 = \frac{1}{\sqrt{2}} [1, 1]^T$.
   - For $\lambda_2 = 2$: $\mathbf{q}_2 = \frac{1}{\sqrt{2}} [1, -1]^T$.
   $$
   \mathbf{W}^{10} = \mathbf{Q} \boldsymbol{\Lambda}^{10} \mathbf{Q}^T = \mathbf{Q} \begin{bmatrix} 4^{10} & 0 \\ 0 & 2^{10} \end{bmatrix} \mathbf{Q}^T
   $$
   Since $4^{10} = (2^2)^{10} = 2^{20} = 1,048,576$ and $2^{10} = 1024$:
   $$
   \mathbf{W}^{10} = \frac{1}{2} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} 1048576 & 0 \\ 0 & 1024 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} = \begin{bmatrix} 524800 & 523776 \\ 523776 & 524800 \end{bmatrix}
   $$
   The spectral norm of $\mathbf{W}^{10}$ is $\|\mathbf{W}^{10}\|_2 = 4^{10} = 1,048,576$.

---

### Example 7.7: Global Gradient Norm Clipping Numerical Calculation
**Problem Statement:**  
A neural network has three parameter gradient tensors:
- Layer 1 weight gradient: $\mathbf{G}_1 \in \mathbb{R}^{2 \times 2}$ with values $\begin{bmatrix} 3.0 & -4.0 \\ 0.0 & 5.0 \end{bmatrix}$.
- Layer 2 weight gradient: $\mathbf{G}_2 \in \mathbb{R}^{1 \times 2}$ with values $\begin{bmatrix} 6.0 & -2.0 \end{bmatrix}$.
- Layer 2 bias gradient: $g_b = 3.0$.
Apply global norm clipping with threshold $c = 5.0$.

**Step-by-Step Solution:**  
1. **Compute Global $L_2$ Norm:**
   Sum of squared elements across all parameters:
   $$
   \|\mathbf{g}\|_2^2 = (3^2 + (-4)^2 + 0^2 + 5^2) + (6^2 + (-2)^2) + 3^2
   $$
   $$
   \|\mathbf{g}\|_2^2 = (9 + 16 + 0 + 25) + (36 + 4) + 9 = 50 + 40 + 9 = 99
   $$
   $$
   \|\mathbf{g}\|_2 = \sqrt{99} \approx 9.94987
   $$

2. **Compare Against Threshold:**
   Threshold $c = 5.0$.  
   Since $\|\mathbf{g}\|_2 \approx 9.95 > 5.0$, clipping is triggered.

3. **Compute Rescaling Factor:**
   $$
   \alpha = \frac{c}{\|\mathbf{g}\|_2} = \frac{5.0}{\sqrt{99}} \approx \frac{5.0}{9.94987} \approx 0.502519
   $$

4. **Rescale All Gradients:**
   - $\mathbf{G}_1^{\text{clipped}} = 0.502519 \begin{bmatrix} 3.0 & -4.0 \\ 0.0 & 5.0 \end{bmatrix} \approx \begin{bmatrix} 1.508 & -2.010 \\ 0.000 & 2.513 \end{bmatrix}$.
   - $\mathbf{G}_2^{\text{clipped}} = 0.502519 \begin{bmatrix} 6.0 & -2.0 \end{bmatrix} \approx \begin{bmatrix} 3.015 & -1.005 \end{bmatrix}$.
   - $g_b^{\text{clipped}} = 0.502519 \times 3.0 \approx 1.508$.
   Check new norm: $\sqrt{0.502519^2 \times 99} = 0.502519 \times 9.94987 = 5.000$.

---

### Example 7.8: Orthogonal Initialization via QR Decomposition
**Problem Statement:**  
Generate an orthogonal weight matrix $\mathbf{W} \in \mathbb{R}^{3 \times 3}$ using QR decomposition on random Gaussian matrix $\mathbf{A} \sim \mathcal{N}(0, 1)$. Verify that all singular values of $\mathbf{W}$ are identically $1.0$.

**Step-by-Step Solution:**  
1. **Generate Random Matrix $\mathbf{A}$:**
   Let $\mathbf{A} \in \mathbb{R}^{3 \times 3}$ be sampled from standard Gaussian:
   $$
   \mathbf{A} = \begin{bmatrix} 1.2 & 0.4 & -0.8 \\ -0.5 & 1.5 & 0.2 \\ 0.7 & -0.3 & 1.1 \end{bmatrix}
   $$

2. **Compute QR Decomposition:**
   Any real matrix $\mathbf{A}$ can be factored as $\mathbf{A} = \mathbf{Q} \mathbf{R}$, where $\mathbf{Q} \in \mathbb{R}^{3 \times 3}$ is an orthogonal matrix ($\mathbf{Q}^T \mathbf{Q} = \mathbf{I}$) and $\mathbf{R}$ is upper triangular.  
   To ensure uniform Haar measure distribution, adjust signs so $\operatorname{diag}(\mathbf{R}) > 0$:
   $$
   \mathbf{W} = \mathbf{Q} \operatorname{diag}(\operatorname{sign}(\operatorname{diag}(\mathbf{R})))
   $$

3. **Singular Value Verification:**
   By definition of orthogonality:
   $$
   \mathbf{W}^T \mathbf{W} = \mathbf{I}
   $$
   The singular values $\sigma_i$ are the square roots of the eigenvalues of $\mathbf{W}^T \mathbf{W}$:
   $$
   \sigma_i = \sqrt{\lambda_i(\mathbf{I})} = \sqrt{1} = 1.0 \quad \forall i \in \{1, 2, 3\}
   $$
   Dynamical isometry is satisfied exactly: signal norm is preserved with zero amplification and zero decay ($\|\mathbf{W} \mathbf{x}\|_2 = \|\mathbf{x}\|_2$).

---

### Example 7.9: The Zero-Initialization Pathology
**Problem Statement:**  
Suppose a 2-layer MLP with 2 hidden units and 1 output unit has all its weights initialized to zero: $\mathbf{W}^{[1]} = \mathbf{0}_{2 \times 2}, \mathbf{b}^{[1]} = \mathbf{0}$, $\mathbf{W}^{[2]} = \mathbf{0}_{1 \times 2}, b^{[2]} = 0$. Activation is $\tanh$.  
Prove that no matter how many training steps are performed via backpropagation, the two hidden units will always have identical weights, collapsing capacity to a single neuron.

**Step-by-Step Solution:**  
1. **Initial Forward Pass:**
   $$
   \mathbf{z}^{[1]} = \mathbf{W}^{[1]} \mathbf{x} + \mathbf{b}^{[1]} = \mathbf{0} \mathbf{x} + \mathbf{0} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}
   $$
   $$
   \mathbf{a}^{[1]} = \tanh(\mathbf{z}^{[1]}) = \begin{bmatrix} 0 \\ 0 \end{bmatrix}
   $$
   $$
   z^{[2]} = \mathbf{W}^{[2]} \mathbf{a}^{[1]} + b^{[2]} = 0 \implies \hat{y} = \tanh(0) = 0
   $$

2. **Backward Pass Gradients:**
   - Output error: $\delta^{[2]} = \hat{y} - y = -y$.
   - Layer 2 weights gradient:
     $$
     \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[2]}} = \delta^{[2]} (\mathbf{a}^{[1]})^T = -y \begin{bmatrix} 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \end{bmatrix}
     $$
   - Hidden layer error vector:
     $$
     \boldsymbol{\delta}^{[1]} = \left( (\mathbf{W}^{[2]})^T \delta^{[2]} \right) \odot \tanh'(\mathbf{z}^{[1]}) = \left( \begin{bmatrix} 0 \\ 0 \end{bmatrix} (-y) \right) \odot \begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}
     $$
   - Layer 1 weights gradient:
     $$
     \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[1]}} = \boldsymbol{\delta}^{[1]} \mathbf{x}^T = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \begin{bmatrix} x_1 & x_2 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}
     $$

3. **Symmetry Trap:**
   All weight gradients are identically zero! The network cannot learn at all.  
   Even if $\mathbf{W}^{[2]}$ had been initialized to non-zero identical constants $[c, c]$, the gradients for row 1 and row 2 of $\mathbf{W}^{[1]}$ would be completely identical:
   $$
   \nabla_{W_{1,:}^{[1]}} = \nabla_{W_{2,:}^{[1]}}
   $$
   The two neurons would perform identical computations forever (**symmetry trap**). Hence, **random symmetry breaking** is mandatory in neural network initialization.

---

### Example 7.10: Self-Attention Scaled Dot-Product Variance Normalization
**Problem Statement:**  
In Transformer self-attention, query and key vectors $\mathbf{q}, \mathbf{k} \in \mathbb{R}^{d_k}$ have independent coordinates with zero mean and unit variance ($\mathbb{E}[q_i] = \mathbb{E}[k_i] = 0, \operatorname{Var}(q_i) = \operatorname{Var}(k_i) = 1$).  
1. Compute the variance of the raw dot product $s = \mathbf{q}^T \mathbf{k}$.
2. Explain why Vaswani et al. (2017) scale the dot product by $\frac{1}{\sqrt{d_k}}$.

**Step-by-Step Solution:**  
1. **Variance of Raw Dot Product:**
   $$
   s = \mathbf{q}^T \mathbf{k} = \sum_{i=1}^{d_k} q_i k_i
   $$
   From Example 7.2:
   $$
   \operatorname{Var}(s) = \sum_{i=1}^{d_k} \operatorname{Var}(q_i k_i) = \sum_{i=1}^{d_k} \operatorname{Var}(q_i) \operatorname{Var}(k_i) = \sum_{i=1}^{d_k} (1)(1) = d_k
   $$
   The variance of the dot product scales linearly with feature dimension $d_k$!

2. **Impact on Softmax Saturation:**
   For typical Transformer models, $d_k = 64$ or $128$.  
   A variance of $\operatorname{Var}(s) = 64$ implies a standard deviation of $\sigma_s = 8$.  
   When inputs to Softmax have magnitudes $|s| \sim 8$, Softmax saturates completely into a hard one-hot distribution, causing vanishing gradients ($\nabla \operatorname{Softmax} \to 0$).

3. **The Scaling Fix:**
   By dividing by $\sqrt{d_k}$:
   $$
   s_{\text{scaled}} = \frac{\mathbf{q}^T \mathbf{k}}{\sqrt{d_k}} \implies \operatorname{Var}(s_{\text{scaled}}) = \operatorname{Var}\left(\frac{s}{\sqrt{d_k}}\right) = \frac{1}{d_k} \operatorname{Var}(s) = \frac{d_k}{d_k} = 1.0
   $$
   The variance is stabilized to unit variance $1.0$ regardless of embedding dimension $d_k$, preventing Softmax gradient saturation.

---

## 7.7 Exactly 10 Solved Exercises

### Exercise 7.1: Derivation of Glorot Uniform Bounds from Variance
**Problem Statement:**  
Prove that a continuous uniform random variable $X \sim U[-a, a]$ has variance $\operatorname{Var}(X) = \frac{a^2}{3}$, and deduce the Glorot uniform bound $a = \sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}}$.

**Detailed Solution:**  
1. **Probability Density Function:**
   $$
   p(x) = \frac{1}{a - (-a)} = \frac{1}{2a} \quad \text{for } x \in [-a, a]
   $$
   Mean: $\mathbb{E}[X] = \int_{-a}^a x \frac{1}{2a} dx = 0$ (by symmetry).

2. **Second Moment (Variance):**
   $$
   \operatorname{Var}(X) = \mathbb{E}[X^2] = \int_{-a}^a x^2 \frac{1}{2a} dx = \frac{1}{2a} \left[ \frac{x^3}{3} \right]_{-a}^a = \frac{1}{2a} \left( \frac{a^3}{3} - \frac{(-a)^3}{3} \right) = \frac{1}{2a} \left( \frac{2a^3}{3} \right) = \frac{a^2}{3}
   $$

3. **Equating to Glorot Target Variance:**
   $$
   \frac{a^2}{3} = \frac{2}{n_{\text{in}} + n_{\text{out}}} \implies a^2 = \frac{6}{n_{\text{in}} + n_{\text{out}}} \implies a = \sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}} \quad \blacksquare
   $$

---

### Exercise 7.2: Signal Variance under GELU Activation Initialization
**Problem Statement:**  
Let $z \sim \mathcal{N}(0, \sigma^2)$ and let activation be GELU: $a = z \Phi(z)$.  
Show that $\mathbb{E}[a^2] \approx 0.5 \operatorname{Var}(z)$, explaining why He initialization ($\operatorname{Var}(W) = 2 / n_{\text{in}}$) is appropriate for GELU-based architectures.

**Detailed Solution:**  
1. **Asymptotic Behavior of GELU:**
   - For $z \gg 0$: $\Phi(z) \to 1 \implies a \to z \implies a^2 \to z^2$.
   - For $z \ll 0$: $\Phi(z) \to 0 \implies a \to 0 \implies a^2 \to 0$.
   Near $z = 0$, GELU smooths the transition, but asymptotically it mirrors ReLU:
   $$
   a(z) \approx \max(0, z)
   $$

2. **Integration over Standard Normal:**
   $$
   \mathbb{E}[a^2] = \int_{-\infty}^\infty z^2 [\Phi(z)]^2 \phi(z) dz \approx \int_0^\infty z^2 (1)^2 \phi(z) dz = \frac{1}{2} \int_{-\infty}^\infty z^2 \phi(z) dz = 0.5 \sigma^2
   $$
   (Numerical numerical quadrature yields $\mathbb{E}[a^2] \approx 0.4996 \sigma^2$).  
   Because GELU halves second moment variance almost identically to ReLU, setting $\operatorname{Var}(W) = \frac{2}{n_{\text{in}}}$ preserves signal variance across deep transformer feedforward blocks.

---

### Exercise 7.3: Exploding Gradients in an Unrolled Recurrent Network
**Problem Statement:**  
A linear RNN has state transition equation $\mathbf{h}_t = \mathbf{W} \mathbf{h}_{t-1}$.  
The weight matrix has singular values $\sigma_1 = 1.5, \sigma_2 = 0.8$.  
For a sequence of length $T = 40$, compute the maximum amplification of the gradient $\frac{\partial \mathcal{L}}{\partial \mathbf{h}_1}$ relative to $\frac{\partial \mathcal{L}}{\partial \mathbf{h}_T}$.

**Detailed Solution:**  
1. **Unrolled Chain of Jacobians:**
   $$
   \frac{\partial \mathbf{h}_T}{\partial \mathbf{h}_1} = \prod_{t=1}^{T-1} \frac{\partial \mathbf{h}_{t+1}}{\partial \mathbf{h}_t} = \mathbf{W}^{T-1} = \mathbf{W}^{39}
   $$
   $$
   \frac{\partial \mathcal{L}}{\partial \mathbf{h}_1} = (\mathbf{W}^T)^{39} \frac{\partial \mathcal{L}}{\partial \mathbf{h}_T}
   $$

2. **Maximum Operator Amplification:**
   $$
   \left\| (\mathbf{W}^T)^{39} \right\|_2 = \sigma_{\max}(\mathbf{W})^{39} = (1.5)^{39}
   $$
   Calculating $(1.5)^{39}$:
   $$
   \ln(1.5) \approx 0.405465 \implies 39 \times 0.405465 \approx 15.813 \implies e^{15.813} \approx 7.37 \times 10^6
   $$
   The gradient norm expands by a factor of over 7.3 million, causing catastrophic gradient explosion.

---

### Exercise 7.4: Gradient Norm Clipping Preserves Direction
**Problem Statement:**  
Prove that for any non-zero vector $\mathbf{g} \in \mathbb{R}^P$ and threshold $c > 0$, the clipped vector $\mathbf{g}_{\text{clipped}} = \mathbf{g} \cdot \frac{c}{\max(c, \|\mathbf{g}\|_2)}$ satisfies:
$$
\cos\left( \angle(\mathbf{g}, \mathbf{g}_{\text{clipped}}) \right) = 1.0
$$

**Detailed Solution:**  
1. **Inner Product Definition of Cosine Angle:**
   $$
   \cos(\theta) = \frac{\mathbf{g}^T \mathbf{g}_{\text{clipped}}}{\|\mathbf{g}\|_2 \|\mathbf{g}_{\text{clipped}}\|_2}
   $$

2. **Substitute $\mathbf{g}_{\text{clipped}} = \alpha \mathbf{g}$ where $\alpha = \frac{c}{\max(c, \|\mathbf{g}\|_2)}$:**
   Notice that $c > 0$ and $\|\mathbf{g}\|_2 > 0 \implies \alpha > 0$ (a strictly positive scalar).
   $$
   \mathbf{g}^T \mathbf{g}_{\text{clipped}} = \mathbf{g}^T (\alpha \mathbf{g}) = \alpha (\mathbf{g}^T \mathbf{g}) = \alpha \|\mathbf{g}\|_2^2
   $$
   $$
   \|\mathbf{g}_{\text{clipped}}\|_2 = \|\alpha \mathbf{g}\|_2 = |\alpha| \|\mathbf{g}\|_2 = \alpha \|\mathbf{g}\|_2
   $$

3. **Evaluating Cosine Ratio:**
   $$
   \cos(\theta) = \frac{\alpha \|\mathbf{g}\|_2^2}{\|\mathbf{g}\|_2 (\alpha \|\mathbf{g}\|_2)} = \frac{\alpha \|\mathbf{g}\|_2^2}{\alpha \|\mathbf{g}\|_2^2} = 1.0 \quad \blacksquare
   $$
   Since $\cos(\theta) = 1.0 \implies \theta = 0^\circ$. The direction of descent is perfectly preserved.

---

### Exercise 7.5: Weight Initialization for Residual Skip Connections
**Problem Statement:**  
In a Residual Network, each block computes $\mathbf{x}_{l} = \mathbf{x}_{l-1} + \mathcal{F}(\mathbf{x}_{l-1})$.  
If $\operatorname{Var}(\mathbf{x}_{l-1}) = \sigma^2$ and $\mathcal{F}$ is initialized such that $\operatorname{Var}(\mathcal{F}(\mathbf{x}_{l-1})) = \sigma^2$, show that after $N$ residual blocks, $\operatorname{Var}(\mathbf{x}_N) = (N + 1)\sigma^2$. How does Fixup (Zhang et al., 2019) or ReZero (Bachlechner et al., 2020) resolve this?

**Detailed Solution:**  
1. **Variance Growth Across Blocks:**
   Assuming $\mathbf{x}_{l-1}$ and $\mathcal{F}(\mathbf{x}_{l-1})$ are uncorrelated at initialization:
   $$
   \operatorname{Var}(\mathbf{x}_l) = \operatorname{Var}(\mathbf{x}_{l-1} + \mathcal{F}(\mathbf{x}_{l-1})) = \operatorname{Var}(\mathbf{x}_{l-1}) + \operatorname{Var}(\mathcal{F}(\mathbf{x}_{l-1})) = \sigma^2 + \sigma^2 = 2\sigma^2
   $$
   By induction, after $N$ sequential residual blocks:
   $$
   \operatorname{Var}(\mathbf{x}_N) = \operatorname{Var}(\mathbf{x}_0) + \sum_{l=1}^N \operatorname{Var}(\mathcal{F}_l) = \sigma^2 + N \sigma^2 = (N + 1)\sigma^2
   $$
   In a 100-block ResNet, the activation variance expands by a factor of 101.

2. **Resolution (ReZero / Zero-Init):**
   - **ReZero / Zero-Init:** Initialize the final layer of each residual branch $\mathcal{F}$ to zero ($\mathbf{W}_{\text{final}} = \mathbf{0}$, or multiply by a learnable scalar $\alpha = 0$).
   - Then $\mathcal{F}(\mathbf{x}) \equiv \mathbf{0} \implies \operatorname{Var}(\mathbf{x}_l) = \operatorname{Var}(\mathbf{x}_{l-1}) = \sigma^2$.
   - The network acts initially as an unbroken identity pass-through of depth 0, preserving variance perfectly, before gradually learning non-linear residuals.

---

### Exercise 7.6: Variance Preservation in Layer Normalization
**Problem Statement:**  
Prove that Layer Normalization $\operatorname{LN}(\mathbf{x}) = \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \epsilon}}$ forces the sample variance across features to be exactly $1.0$ (for $\epsilon \to 0$), rendering downstream forward activations immune to input scale explosion.

**Detailed Solution:**  
1. **Sample Statistics across $D$ Features:**
   $$
   \mu = \frac{1}{D} \sum_{i=1}^D x_i, \quad \sigma^2 = \frac{1}{D} \sum_{i=1}^D (x_i - \mu)^2
   $$

2. **Normalized Elements:**
   $$
   \hat{x}_i = \frac{x_i - \mu}{\sigma}
   $$

3. **Sample Variance of $\hat{\mathbf{x}}$:**
   - Mean of normalized elements:
     $$
     \mu_{\hat{x}} = \frac{1}{D} \sum_{i=1}^D \hat{x}_i = \frac{1}{D \sigma} \sum_{i=1}^D (x_i - \mu) = \frac{1}{D \sigma} (D \mu - D \mu) = 0
     $$
   - Variance:
     $$
     \sigma_{\hat{x}}^2 = \frac{1}{D} \sum_{i=1}^D (\hat{x}_i - \mu_{\hat{x}})^2 = \frac{1}{D} \sum_{i=1}^D \left( \frac{x_i - \mu}{\sigma} \right)^2 = \frac{1}{\sigma^2} \left[ \frac{1}{D} \sum_{i=1}^D (x_i - \mu)^2 \right] = \frac{1}{\sigma^2} [\sigma^2] = 1.0 \quad \blacksquare
     $$
   The output variance is unconditionally normalized to 1.0 regardless of the input magnitude $\|\mathbf{x}\|$.

---

### Exercise 7.7: Why Bias Vectors Are Initialized to Zero
**Problem Statement:**  
Explain mathematically why bias vectors $\mathbf{b}$ are almost universally initialized to zero ($\mathbf{b} = \mathbf{0}$) rather than sampled from random distributions like weights.

**Detailed Solution:**  
1. **Symmetry Breaking Role:**
   Randomness in initialization is required strictly to break symmetry between neurons in the same layer. Because weight vectors $\mathbf{w}_i$ connect to different inputs, random weights ensure different neurons compute different gradient projections.
2. **Mean-Shift Pathology:**
   If biases are sampled from a zero-mean distribution $\mathcal{N}(0, \sigma_b^2)$, individual neurons receive random static offsets:
   $$
   z_i = \mathbf{w}_i^T \mathbf{x} + b_i
   $$
   - If $b_i \ll 0$, the neuron may start in an inactivated regime (dying ReLU).
   - Random biases contribute additively to pre-activation variance: $\operatorname{Var}(z) = n_{\text{in}} \operatorname{Var}(W) \operatorname{Var}(X) + \operatorname{Var}(b)$. This disrupts exact Glorot/He variance preservation.
3. **Conclusion:**  
   Initializing $\mathbf{b} = \mathbf{0}$ ensures that pre-activations are centered at the origin, maximizing gradient sensitivity for symmetric activations ($\tanh$, GELU) and activating exactly $50\%$ of neurons under ReLU without inflating variance.

---

### Exercise 7.8: SVD Spectral Radius Computation of a $2 \times 2$ Non-Symmetric Matrix
**Problem Statement:**  
Let $\mathbf{W} = \begin{bmatrix} 0 & 2 \\ 0 & 0 \end{bmatrix}$.  
1. Compute the eigenvalues of $\mathbf{W}$.
2. Compute the singular values and spectral norm $\|\mathbf{W}\|_2$.
3. Explain why the spectral radius $\rho(\mathbf{W})$ and spectral norm $\|\mathbf{W}\|_2$ differ.

**Detailed Solution:**  
1. **Eigenvalues:**
   $$
   \det(\mathbf{W} - \lambda \mathbf{I}) = \det\begin{bmatrix} -\lambda & 2 \\ 0 & -\lambda \end{bmatrix} = \lambda^2 = 0 \implies \lambda_1 = 0, \; \lambda_2 = 0
   $$
   The spectral radius is $\rho(\mathbf{W}) = \max |\lambda_i| = 0$.

2. **Singular Values:**
   $$
   \mathbf{W}^T \mathbf{W} = \begin{bmatrix} 0 & 0 \\ 2 & 0 \end{bmatrix} \begin{bmatrix} 0 & 2 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 4 \end{bmatrix}
   $$
   Eigenvalues of $\mathbf{W}^T \mathbf{W}$ are $\lambda = 4$ and $\lambda = 0$.  
   Singular values: $\sigma_1 = \sqrt{4} = 2.0$, $\sigma_2 = 0$.  
   Spectral norm: $\|\mathbf{W}\|_2 = \sigma_{\max} = 2.0$.

3. **Distinction:**  
   The spectral radius $\rho(\mathbf{W}) = 0$ governs asymptotic behavior as power $k \to \infty$ ($\mathbf{W}^2 = \mathbf{0}$). However, the spectral norm $\|\mathbf{W}\|_2 = 2.0$ governs the immediate single-step amplification of an input vector:
   For $\mathbf{x} = [0, 1]^T$, $\mathbf{W} \mathbf{x} = [2, 0]^T \implies \|\mathbf{W} \mathbf{x}\|_2 = 2 \|\mathbf{x}\|_2$. In non-normal matrices, single-step transient amplification can occur even when spectral radius is small.

---

### Exercise 7.9: Truncated Normal vs. Standard Normal Initialization
**Problem Statement:**  
In production frameworks (e.g., TensorFlow, JAX), weights are often initialized using **Truncated Normal** distributions, where samples exceeding $2$ standard deviations ($|z| > 2\sigma$) are rejected and resampled.  
Explain the numerical and optimization rationale for truncating the distribution.

**Detailed Solution:**  
1. **The Heavy Tail Problem:**
   In a standard Gaussian $\mathcal{N}(0, \sigma^2)$, roughly $5\%$ of sampled weights lie beyond $\pm 2\sigma$, and $0.3\%$ lie beyond $\pm 3\sigma$.  
   In a large layer with $10^7$ weights, approximately $30,000$ weights will be outliers exceeding $3\sigma$.
2. **Consequences of Extreme Outliers:**
   A single outlier weight with $W_{ij} \approx 4\sigma$ can saturate a downstream neuron immediately, pushing pre-activation $|z| \gg 1$. Under sigmoid or $\tanh$, this creates an instant dead zone. Under ReLU, an extreme negative weight creates dead ReLUs, while an extreme positive weight dominates gradient updates.
3. **Truncation Benefit:**
   Truncating at $\pm 2\sigma$ clips the distribution tails while preserving zero mean and near-exact target variance ($\operatorname{Var}_{\text{trunc}} \approx 0.88 \sigma^2$, which is easily compensated by dividing by $\sqrt{0.88}$). It provides a hard guarantee that no single connection starts as a pathologically dominant outlier.

---

### Exercise 7.10: Fixup Initialization: Training Without Normalization
**Problem Statement:**  
Zhang et al. (2019) introduced Fixup initialization to train 10,000-layer residual networks without Batch Normalization.  
In a standard ResNet with $L$ residual blocks, explain why scaling the final layer of each residual branch by $L^{-1/(2m)}$ (where $m$ is the number of layers per residual block) prevents gradient explosion at depth.

**Detailed Solution:**  
1. **Unrolled Residual Branch Addition:**
   Let the network output be $\mathbf{x}_L = \mathbf{x}_0 + \sum_{l=1}^L \mathcal{F}_l(\mathbf{x}_{l-1})$.  
   The gradient with respect to input $\mathbf{x}_0$ is:
   $$
   \frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_0} = \prod_{l=1}^L \left( \mathbf{I} + \mathbf{J}_{\mathcal{F}_l} \right)
   $$

2. **Expansion of Product:**
   When all residual blocks have norm $\|\mathbf{J}_{\mathcal{F}_l}\| \sim \epsilon$:
   $$
   \prod_{l=1}^L (1 + \epsilon) \approx e^{L \epsilon}
   $$
   If $\epsilon = O(1)$, $e^{L \epsilon} \to \infty$ explodes exponentially with depth $L$.

3. **Fixup Scaling:**
   By scaling the weights of the final layer in each residual branch by $L^{-1/(2m)}$, the operator norm of the branch Jacobian scales as:
   $$
   \|\mathbf{J}_{\mathcal{F}_l}\| = O\left( \frac{1}{\sqrt{L}} \right)
   $$
   Then the variance accumulated across $L$ independent blocks is:
   $$
   \sum_{l=1}^L \operatorname{Var}(\mathcal{F}_l) = L \times O\left(\frac{1}{L}\right) = O(1)
   $$
   The total variance growth across the entire network remains strictly bounded by $O(1)$ as $L \to \infty$, enabling stable training of 10,000-layer deep networks without any normalization layers.
