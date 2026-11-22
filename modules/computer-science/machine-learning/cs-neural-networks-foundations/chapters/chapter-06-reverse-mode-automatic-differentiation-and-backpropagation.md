# Chapter 6: Reverse-Mode Automatic Differentiation and Backpropagation

> *"The backward recurrence of sensitivity signals is not merely an algorithmic convenience; it is the universal dual of forward physical dynamics. By reversing the arrow of time on a computational graph, we extract the gradient of any scalar outcome with respect to all causes in a single pass."*  
> — **Paul J. Werbos**, *Beyond Regression: New Tools for Prediction and Analysis in the Behavioral Sciences* (1974)

---

## 6.1 The History and Genesis of Backpropagation

The modern artificial intelligence paradigm is anchored to a single algorithmic breakthrough: **Backpropagation**. While popularized in cognitive science by David Rumelhart, Geoffrey Hinton, and Ronald Williams in their watershed 1986 *Nature* paper, the mathematical machinery of reverse-mode automatic differentiation was discovered and rediscovered across multiple disciplines over several decades.

```
                  Chronological Timeline of Backpropagation
                  
    1970: Seppo Linnainmaa
          Formulates general Reverse-Mode Automatic Differentiation on discrete DAGs.
             |
    1974: Paul J. Werbos
          Applies adjoint sensitivity recurrence to neural networks in his Harvard PhD thesis.
             |
    1982: David Parker
          Independently rediscovers backpropagation at Stanford.
             |
    1986: Rumelhart, Hinton, & Williams
          Publish "Learning representations by back-propagating errors" in Nature,
          demonstrating that hidden layers discover internal semantic features.
```

1. **Seppo Linnainmaa (1970):** In his Master's thesis at the University of Helsinki, Finnish computer scientist Seppo Linnainmaa introduced the general mathematical formulation of reverse-mode automatic differentiation (AD) for arbitrary directed acyclic graphs of arithmetic operations. Linnainmaa conceived the algorithm as an efficient technique for computing cumulative rounding errors.
2. **Paul Werbos (1974):** In his Harvard University doctoral dissertation, *Beyond Regression*, Paul Werbos recognized that Linnainmaa's reverse sensitivity recurrence could be applied to multi-layer artificial neural networks, explicitly outlining the equations for training non-linear representations via gradient descent. However, Werbos’s work remained largely overlooked by a computer science community still recovering from Minsky and Papert's *Perceptrons*.
3. **Rumelhart, Hinton, and Williams (1986):** In their landmark 1986 publication, Rumelhart, Hinton, and Williams demonstrated experimentally that multi-layer perceptrons trained with backpropagation could solve non-linearly separable problems—including XOR, symmetry detection, and family tree relationship modeling—spontaneously discovering organized, meaningful latent representations in their hidden layers.

---

## 6.2 Directed Acyclic Computation Graphs (DAGs)

Every neural network calculation can be abstracted as a **Directed Acyclic Graph (DAG)** $\mathcal{G} = (\mathcal{V}, \mathcal{E})$:
- **Vertices (Nodes) $\mathcal{V}$:** Represent mathematical variables (inputs, intermediate tensor states, weights, biases, and final scalar loss values).
- **Directed Edges $\mathcal{E}$:** Represent functional operations and dependency channels ($u \to v$ signifies that variable $v$ depends directly on variable $u$).

```
       Directed Acyclic Computation Graph (DAG) for a Scalar Neuron
       
       w1 -----* (Prod1: v1 = w1 * x1)
              /                        \
       x1 ---+                          +---> (Sum: v3 = v1 + v2 + b) ---> (Act: a = \sigma(v3))
                                       /                                         |
       w2 -----* (Prod2: v2 = w2 * x2)/                                          v
              /                                                             (Loss: L = 1/2(y - a)^2)
       x2 ---+                                                                   ^
                                                                                 |
       b ------------------------------------------------------------------------+
```

### 6.2.1 Topological Sorting and Forward Evaluation Trace

Because the graph is acyclic, its vertices can be sorted in a **topological order** $v_1, v_2, \dots, v_M$ such that for every directed edge $(v_i, v_j) \in \mathcal{E}$, we have $i < j$.

During the **forward pass**, the computation graph evaluates operations in topological order:
$$
v_i = \phi_i\left( \operatorname{Parents}(v_i) \right) \quad \text{for } i = 1, 2, \dots, M
$$
The intermediate numerical activations are stored in memory (the *forward execution cache*). The terminal node $v_M = \mathcal{L}$ computes the scalar objective loss.

---

## 6.3 Forward-Mode vs. Reverse-Mode Automatic Differentiation

To understand the supremacy of backpropagation, we must contrast the two primary modes of Automatic Differentiation (AD) against classical numerical and symbolic differentiation.

### 6.3.1 Differentiation Paradigms Comparison

| Differentiation Method | Mathematical Formulation | Exactness | Computational Complexity for $P$ Parameters | Primary Limitation |
| :--- | :--- | :--- | :--- | :--- |
| **Numerical Finite Differences** | $\frac{f(\mathbf{w} + \epsilon \mathbf{e}_i) - f(\mathbf{w})}{\epsilon}$ | Approximate (Truncation / Roundoff error) | $O(P)$ forward passes | Catastrophic roundoff error; computationally intractable for large $P$ |
| **Symbolic Differentiation** | Algebraic expression rewrite via product/chain rules | Mathematically exact | Variable ($O(2^P)$ without simplification) | Combinatorial expression swell; memory explosion |
| **Forward-Mode AD** | Dual number arithmetic $(a + b\epsilon)$ propagating directional derivatives | Mathematically exact to machine precision | $O(P)$ forward passes | Inefficient when inputs $\gg$ outputs ($P \gg 1$) |
| **Reverse-Mode AD** | Reverse accumulation of adjoint sensitivities $\bar{v} = \frac{\partial \mathcal{L}}{\partial v}$ | Mathematically exact to machine precision | **$O(1)$ single backward pass** | Requires caching all intermediate forward activations |

### 6.3.2 Forward-Mode AD and Dual Numbers

Forward-mode AD augments real arithmetic using **dual numbers** $\mathbb{D} = \{a + b\epsilon \mid a, b \in \mathbb{R}, \; \epsilon^2 = 0\}$.  
Applying a function $f$ to a dual number yields:
$$
f(a + b\epsilon) = f(a) + b f'(a)\epsilon
$$
For a function with $P$ inputs and $1$ output $f: \mathbb{R}^P \to \mathbb{R}$, computing the full gradient $\nabla f$ requires seeding the dual component with each standard basis vector $\mathbf{e}_i$ sequentially:
$$
\mathbf{w} + \mathbf{e}_i \epsilon \implies f(\mathbf{w} + \mathbf{e}_i \epsilon) = f(\mathbf{w}) + \frac{\partial f}{\partial w_i}\epsilon
$$
This requires $P$ distinct forward passes. In a modern neural network where $P = 10^{11}$ (100 billion parameters), forward-mode AD would require 100 billion forward passes to compute a single gradient update!

### 6.3.3 Reverse-Mode AD and Adjoint Accumulation

Reverse-mode AD flips the direction of derivative evaluation. Instead of propagating perturbations forward from inputs to outputs, it defines the **adjoint sensitivity** of each intermediate variable $v_i$ with respect to the terminal scalar loss $\mathcal{L}$:
$$
\bar{v}_i \equiv \frac{\partial \mathcal{L}}{\partial v_i}
$$

By the multivariate chain rule, the adjoint of an intermediate node $v_i$ is computed by summing the incoming sensitivities from all its downstream children nodes $\operatorname{Children}(v_i)$:
$$
\bar{v}_i = \sum_{v_j \in \operatorname{Children}(v_i)} \bar{v}_j \cdot \frac{\partial v_j}{\partial v_i}
$$

By traversing the computation graph in **reverse topological order** ($v_{M-1}, v_{M-2}, \dots, v_1$), starting from the trivial terminal seed $\bar{v}_M = \frac{\partial \mathcal{L}}{\partial \mathcal{L}} = 1.0$, the exact partial derivatives with respect to **all $P$ parameters** are computed in a **single backward pass**:
$$
\text{Time Complexity of Reverse-Mode AD} \le 3 \times \text{Time Complexity of Forward Pass}
$$
regardless of whether $P = 10$, $P = 10^6$, or $P = 10^{12}$! This computational asymmetry ($O(1)$ vs $O(P)$) makes deep learning possible.

---

## 6.4 Rigorous Derivation of the Four Fundamental Backpropagation Equations

We now present the complete, rigorous multivariate calculus derivation of the matrix-vector backpropagation equations for an $L$-layer Multi-Layer Perceptron.

```
       The Two-Stroke Engine of Deep Learning: Forward Cache and Backward Gradient
       
     Forward Pass:   x = a^[0] ----> [ z^[1] ] ----> [ a^[1] ] ----> ... ----> [ a^[L] ] ----> Loss L
                                        |               |                         |
                               (cached) v      (cached) v                (cached) v
                                        |               |                         |
     Backward Pass: \nabla_w L <--- [ \delta^[1] ] <-- [ \delta^[2] ] <--- ... <-- [ \delta^[L] ] <--- \bar{L} = 1.0
```

### 6.4.1 Architectural Notation Review

For layer $l \in \{1, 2, \dots, L\}$:
$$
\mathbf{z}^{[l]} = \mathbf{W}^{[l]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}
$$
$$
\mathbf{a}^{[l]} = g^{[l]}(\mathbf{z}^{[l]})
$$
where:
- $\mathbf{W}^{[l]} \in \mathbb{R}^{d_l \times d_{l-1}}$
- $\mathbf{b}^{[l]} \in \mathbb{R}^{d_l}$
- $\mathbf{z}^{[l]} \in \mathbb{R}^{d_l}$
- $\mathbf{a}^{[l]} \in \mathbb{R}^{d_l}$
- $\mathcal{L} \in \mathbb{R}$ is the scalar loss.

We define the **layer error vector** (adjoint of the pre-activation) as:
$$
\boldsymbol{\delta}^{[l]} \equiv \nabla_{\mathbf{z}^{[l]}} \mathcal{L} = \begin{bmatrix} \frac{\partial \mathcal{L}}{\partial z_1^{[l]}} \\ \vdots \\ \frac{\partial \mathcal{L}}{\partial z_{d_l}^{[l]}} \end{bmatrix} \in \mathbb{R}^{d_l}
$$

---

### 6.4.2 Equation 1: Output Layer Error Vector ($\boldsymbol{\delta}^{[L]}$)

Consider an individual component of the output pre-activation $z_i^{[L]}$. Its only downstream impact on the scalar loss $\mathcal{L}$ is mediated through the activation $a_i^{[L]} = g^{[L]}(z_i^{[L]})$.  
By the univariate chain rule:
$$
\delta_i^{[L]} = \frac{\partial \mathcal{L}}{\partial z_i^{[L]}} = \frac{\partial \mathcal{L}}{\partial a_i^{[L]}} \cdot \frac{\partial a_i^{[L]}}{\partial z_i^{[L]}} = \frac{\partial \mathcal{L}}{\partial a_i^{[L]}} \cdot (g^{[L]})'(z_i^{[L]})
$$

Expressed in vectorized notation using the Hadamard (element-wise) product $\odot$:
$$
\boldsymbol{\delta}^{[L]} = \nabla_{\mathbf{a}^{[L]}} \mathcal{L} \odot (g^{[L]})'(\mathbf{z}^{[L]}) \quad \text{\textbf{(BP1)}}
$$

*Special Case:* When using Binary Cross-Entropy with Sigmoid activation or Categorical Cross-Entropy with Softmax, as derived in Chapter 4, this equation collapses to the error residual:
$$
\boldsymbol{\delta}^{[L]} = \mathbf{a}^{[L]} - \mathbf{y}
$$

---

### 6.4.3 Equation 2: Hidden Layer Error Recurrence ($\boldsymbol{\delta}^{[l]}$)

We now derive the recurrence relation linking the error vector of layer $l$ to the downstream error vector of layer $l+1$.  
Consider component $z_j^{[l]}$. In the forward pass, $z_j^{[l]}$ affects $a_j^{[l]} = g^{[l]}(z_j^{[l]})$.  
In turn, $a_j^{[l]}$ contributes to **all** pre-activations in the subsequent layer:
$$
z_k^{[l+1]} = \sum_{m=1}^{d_l} W_{km}^{[l+1]} a_m^{[l]} + b_k^{[l+1]} \quad \forall k \in \{1, \dots, d_{l+1}\}
$$
By the multivariate chain rule across all children $z_k^{[l+1]}$:
$$
\delta_j^{[l]} = \frac{\partial \mathcal{L}}{\partial z_j^{[l]}} = \sum_{k=1}^{d_{l+1}} \frac{\partial \mathcal{L}}{\partial z_k^{[l+1]}} \cdot \frac{\partial z_k^{[l+1]}}{\partial a_j^{[l]}} \cdot \frac{\partial a_j^{[l]}}{\partial z_j^{[l]}}
$$

1. Substitute $\frac{\partial \mathcal{L}}{\partial z_k^{[l+1]}} = \delta_k^{[l+1]}$.
2. Differentiate $z_k^{[l+1]}$ with respect to $a_j^{[l]}$:
   $$
   \frac{\partial z_k^{[l+1]}}{\partial a_j^{[l]}} = \frac{\partial}{\partial a_j^{[l]}} \left( \sum_{m=1}^{d_l} W_{km}^{[l+1]} a_m^{[l]} + b_k^{[l+1]} \right) = W_{kj}^{[l+1]}
   $$
3. Substitute $\frac{\partial a_j^{[l]}}{\partial z_j^{[l]}} = (g^{[l]})'(z_j^{[l]})$.

Plugging these back into the summation:
$$
\delta_j^{[l]} = \sum_{k=1}^{d_{l+1}} \delta_k^{[l+1]} W_{kj}^{[l+1]} \cdot (g^{[l]})'(z_j^{[l]}) = \left( \sum_{k=1}^{d_{l+1}} W_{kj}^{[l+1]} \delta_k^{[l+1]} \right) \cdot (g^{[l]})'(z_j^{[l]})
$$

Notice that $\sum_{k=1}^{d_{l+1}} W_{kj}^{[l+1]} \delta_k^{[l+1]}$ is the inner product of the $j$-th column of $\mathbf{W}^{[l+1]}$ with vector $\boldsymbol{\delta}^{[l+1]}$, which is identically the $j$-th element of the matrix-vector product $(\mathbf{W}^{[l+1]})^T \boldsymbol{\delta}^{[l+1]}$!

Vectorizing across all $j \in \{1, \dots, d_l\}$:
$$
\boldsymbol{\delta}^{[l]} = \left( (\mathbf{W}^{[l+1]})^T \boldsymbol{\delta}^{[l+1]} \right) \odot (g^{[l]})'(\mathbf{z}^{[l]}) \quad \text{\textbf{(BP2)}}
$$

This equation demonstrates the mathematical elegance of backpropagation: the error signal is propagated backward by multiplying by the **transpose of the forward weight matrix**, filtered element-wise by the local activation derivative.

---

### 6.4.4 Equation 3: Weight Gradient Tensor ($\nabla_{\mathbf{W}^{[l]}} \mathcal{L}$)

Now consider an individual synaptic weight $W_{ij}^{[l]}$ connecting neuron $j$ of layer $l-1$ to neuron $i$ of layer $l$.  
Weight $W_{ij}^{[l]}$ affects the scalar loss exclusively through the pre-activation $z_i^{[l]}$:
$$
z_i^{[l]} = \sum_{k=1}^{d_{l-1}} W_{ik}^{[l]} a_k^{[l-1]} + b_i^{[l]}
$$
Applying the chain rule:
$$
\frac{\partial \mathcal{L}}{\partial W_{ij}^{[l]}} = \frac{\partial \mathcal{L}}{\partial z_i^{[l]}} \cdot \frac{\partial z_i^{[l]}}{\partial W_{ij}^{[l]}}
$$
1. Recognize $\frac{\partial \mathcal{L}}{\partial z_i^{[l]}} = \delta_i^{[l]}$.
2. Differentiate $z_i^{[l]}$ with respect to $W_{ij}^{[l]}$:
   $$
   \frac{\partial z_i^{[l]}}{\partial W_{ij}^{[l]}} = a_j^{[l-1]}
   $$
Therefore:
$$
\frac{\partial \mathcal{L}}{\partial W_{ij}^{[l]}} = \delta_i^{[l]} \cdot a_j^{[l-1]}
$$

In matrix notation, this is the **outer product** of the error vector $\boldsymbol{\delta}^{[l]} \in \mathbb{R}^{d_l}$ and the upstream activation vector $\mathbf{a}^{[l-1]} \in \mathbb{R}^{d_{l-1}}$:
$$
\frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[l]}} = \boldsymbol{\delta}^{[l]} (\mathbf{a}^{[l-1]})^T \quad \text{\textbf{(BP3)}}
$$

Dimensions check: $(d_l \times 1) \times (1 \times d_{l-1}) = (d_l \times d_{l-1})$.

---

### 6.4.5 Equation 4: Bias Gradient Vector ($\nabla_{\mathbf{b}^{[l]}} \mathcal{L}$)

Similarly, bias $b_i^{[l]}$ affects the loss exclusively through pre-activation $z_i^{[l]}$:
$$
\frac{\partial \mathcal{L}}{\partial b_i^{[l]}} = \frac{\partial \mathcal{L}}{\partial z_i^{[l]}} \cdot \frac{\partial z_i^{[l]}}{\partial b_i^{[l]}}
$$
Since $\frac{\partial z_i^{[l]}}{\partial b_i^{[l]}} = 1$:
$$
\frac{\partial \mathcal{L}}{\partial b_i^{[l]}} = \delta_i^{[l]} \cdot 1 = \delta_i^{[l]}
$$
In vector form:
$$
\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[l]}} = \boldsymbol{\delta}^{[l]} \quad \text{\textbf{(BP4)}}
$$

The bias gradient is identically the error vector itself.

---

### 6.4.6 Summary of the Four Backpropagation Equations

$$\begin{aligned}
\text{\textbf{(BP1)}} \quad \boldsymbol{\delta}^{[L]} &= \nabla_{\mathbf{a}^{[L]}} \mathcal{L} \odot (g^{[L]})'(\mathbf{z}^{[L]}) \\
\text{\textbf{(BP2)}} \quad \boldsymbol{\delta}^{[l]} &= \left( (\mathbf{W}^{[l+1]})^T \boldsymbol{\delta}^{[l+1]} \right) \odot (g^{[l]})'(\mathbf{z}^{[l]}) \\
\text{\textbf{(BP3)}} \quad \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[l]}} &= \boldsymbol{\delta}^{[l]} (\mathbf{a}^{[l-1]})^T \\
\text{\textbf{(BP4)}} \quad \frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[l]}} &= \boldsymbol{\delta}^{[l]}
\end{aligned}$$

#### Vectorized Mini-Batch Generalization (Row-Batch Format):
When inputs are stored in batches $\mathbf{A}^{[l-1]} \in \mathbb{R}^{B \times d_{l-1}}$ and $\boldsymbol{\Delta}^{[l]} \in \mathbb{R}^{B \times d_l}$, the gradients averaged over batch size $B$ are:
$$
\frac{\partial \mathcal{L}}{\partial \mathbf{W}_{\text{row}}^{[l]}} = \frac{1}{B} (\mathbf{A}^{[l-1]})^T \boldsymbol{\Delta}^{[l]} \in \mathbb{R}^{d_{l-1} \times d_l}
$$
$$
\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[l]}} = \frac{1}{B} \sum_{i=1}^B \boldsymbol{\Delta}_{i,:}^{[l]} \in \mathbb{R}^{1 \times d_l}
$$
$$
\boldsymbol{\Delta}^{[l]} = \left( \boldsymbol{\Delta}^{[l+1]} (\mathbf{W}_{\text{row}}^{[l+1]})^T \right) \odot (g^{[l]})'(\mathbf{Z}^{[l]}) \in \mathbb{R}^{B \times d_l}
$$

---

## 6.5 Exactly 10 Worked Examples

### Example 6.1: Full Manual Numerical Backpropagation on a 2-2-1 Network
**Problem Statement:**  
Consider a 2-layer network ($d_0 = 2, d_1 = 2, d_2 = 1$).  
The parameters are:
$$
\mathbf{W}^{[1]} = \begin{bmatrix} 0.5 & -0.5 \\ 1.0 & 0.0 \end{bmatrix}, \quad \mathbf{b}^{[1]} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix}
$$
$$
\mathbf{W}^{[2]} = \begin{bmatrix} 0.8 & -0.4 \end{bmatrix}, \quad b^{[2]} = 0.0
$$
Activation functions are: $g^{[1]} = \text{ReLU}$, $g^{[2]} = \sigma$ (logistic sigmoid).  
The loss function is Binary Cross-Entropy: $\mathcal{L} = - [y \ln \hat{y} + (1 - y) \ln(1 - \hat{y})]$.  
For training sample $\mathbf{x} = [2.0, 1.0]^T$ with true label $y = 1.0$:
1. Compute the forward pass activations $\mathbf{z}^{[1]}, \mathbf{a}^{[1]}, z^{[2]}, \hat{y}$ and loss $\mathcal{L}$.
2. Compute the backward pass gradients $\boldsymbol{\delta}^{[2]}, \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[2]}}, \frac{\partial \mathcal{L}}{\partial b^{[2]}}, \boldsymbol{\delta}^{[1]}, \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[1]}}$.

**Step-by-Step Solution:**  
1. **Forward Pass:**
   - Layer 1 pre-activations:
     $$
     \mathbf{z}^{[1]} = \mathbf{W}^{[1]} \mathbf{x} + \mathbf{b}^{[1]} = \begin{bmatrix} 0.5(2.0) - 0.5(1.0) \\ 1.0(2.0) + 0.0(1.0) \end{bmatrix} = \begin{bmatrix} 1.0 - 0.5 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 2.0 \end{bmatrix}
     $$
   - Layer 1 activations:
     $$
     \mathbf{a}^{[1]} = \text{ReLU}(\mathbf{z}^{[1]}) = \begin{bmatrix} 0.5 \\ 2.0 \end{bmatrix}
     $$
   - Layer 2 pre-activation:
     $$
     z^{[2]} = \mathbf{W}^{[2]} \mathbf{a}^{[1]} + b^{[2]} = 0.8(0.5) - 0.4(2.0) + 0.0 = 0.4 - 0.8 = -0.4
     $$
   - Layer 2 prediction:
     $$
     \hat{y} = \sigma(-0.4) = \frac{1}{1 + e^{0.4}} = \frac{1}{1 + 1.491825} = \frac{1}{2.491825} \approx 0.401312
     $$
   - Loss:
     $$
     \mathcal{L} = -\ln(0.401312) \approx 0.913016
     $$

2. **Backward Pass:**
   - **Output layer error $\delta^{[2]}$:**
     Using the collapsed BCE + Sigmoid identity from Section 4.3.2:
     $$
     \delta^{[2]} = \hat{y} - y = 0.401312 - 1.0 = -0.598688
     $$
   - **Gradients for Layer 2:**
     $$
     \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[2]}} = \delta^{[2]} (\mathbf{a}^{[1]})^T = -0.598688 \begin{bmatrix} 0.5 & 2.0 \end{bmatrix} = \begin{bmatrix} -0.299344 & -1.197376 \end{bmatrix}
     $$
     $$
     \frac{\partial \mathcal{L}}{\partial b^{[2]}} = \delta^{[2]} = -0.598688
     $$
   - **Hidden layer error recurrence $\boldsymbol{\delta}^{[1]}$:**
     $$
     (\mathbf{W}^{[2]})^T \delta^{[2]} = \begin{bmatrix} 0.8 \\ -0.4 \end{bmatrix} (-0.598688) = \begin{bmatrix} -0.478950 \\ +0.239475 \end{bmatrix}
     $$
     Activation derivative $g'(\mathbf{z}^{[1]})$:
     Since $z_1^{[1]} = 0.5 > 0 \implies g'(0.5) = 1.0$.  
     Since $z_2^{[1]} = 2.0 > 0 \implies g'(2.0) = 1.0$.
     $$
     (g^{[1]})'(\mathbf{z}^{[1]}) = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix}
     $$
     $$
     \boldsymbol{\delta}^{[1]} = \begin{bmatrix} -0.478950 \\ +0.239475 \end{bmatrix} \odot \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} -0.478950 \\ +0.239475 \end{bmatrix}
     $$
   - **Gradients for Layer 1:**
     $$
     \frac{\partial \mathcal{L}}{\partial \mathbf{W}^{[1]}} = \boldsymbol{\delta}^{[1]} \mathbf{x}^T = \begin{bmatrix} -0.478950 \\ +0.239475 \end{bmatrix} \begin{bmatrix} 2.0 & 1.0 \end{bmatrix} = \begin{bmatrix} -0.957900 & -0.478950 \\ +0.478950 & +0.239475 \end{bmatrix}
     $$
     $$
     \frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[1]}} = \boldsymbol{\delta}^{[1]} = \begin{bmatrix} -0.478950 \\ +0.239475 \end{bmatrix}
     $$

---

### Example 6.2: Computation Graph Forward and Backward Adjoint Trace for a Scalar Function
**Problem Statement:**  
Consider the scalar computation graph evaluating:
$$
f(x, y) = \ln(x \cdot y) + \sin(x)
$$
at the point $x = 2.0, y = 3.0$.  
1. Deconstruct $f$ into primitive elementary operations $v_1, v_2, v_3, v_4, v_5$ and perform the forward trace.
2. Perform the reverse-mode adjoint trace to compute the exact gradients $\frac{\partial f}{\partial x}$ and $\frac{\partial f}{\partial y}$.

**Step-by-Step Solution:**  
1. **Forward Evaluation Trace:**
   - $v_1 = x = 2.0$
   - $v_2 = y = 3.0$
   - $v_3 = v_1 \times v_2 = 2.0 \times 3.0 = 6.0$
   - $v_4 = \ln(v_3) = \ln(6.0) \approx 1.791759$
   - $v_5 = \sin(v_1) = \sin(2.0) \approx 0.909297$
   - $v_6 = v_4 + v_5 = 1.791759 + 0.909297 = 2.701056$ ($f(x, y) = v_6$)

2. **Backward Adjoint Trace:**
   - Seed: $\bar{v}_6 = \frac{\partial f}{\partial v_6} = 1.0$.
   - Node $v_5$: $\bar{v}_5 = \bar{v}_6 \frac{\partial v_6}{\partial v_5} = 1.0 \times 1 = 1.0$.
   - Node $v_4$: $\bar{v}_4 = \bar{v}_6 \frac{\partial v_6}{\partial v_4} = 1.0 \times 1 = 1.0$.
   - Node $v_3$: $\bar{v}_3 = \bar{v}_4 \frac{\partial v_4}{\partial v_3} = 1.0 \times \frac{1}{v_3} = \frac{1}{6.0} \approx 0.166667$.
   - Node $v_2$ ($y$): $\bar{v}_2 = \bar{v}_3 \frac{\partial v_3}{\partial v_2} = \bar{v}_3 \times v_1 = \frac{1}{6.0} \times 2.0 = \frac{1}{3} \approx 0.333333$.
   - Node $v_1$ ($x$): Node $v_1$ has two children ($v_3$ and $v_5$):
     $$
     \bar{v}_1 = \bar{v}_3 \frac{\partial v_3}{\partial v_1} + \bar{v}_5 \frac{\partial v_5}{\partial v_1} = \left(\frac{1}{6.0} \times v_2\right) + (1.0 \times \cos(v_1)) = \left(\frac{3.0}{6.0}\right) + \cos(2.0)
     $$
     $\cos(2.0) \approx -0.416147 \implies \bar{v}_1 = 0.5 - 0.416147 = 0.083853$.

3. **Analytical Verification:**
   - $\frac{\partial f}{\partial x} = \frac{1}{x} + \cos(x) = \frac{1}{2.0} + \cos(2.0) = 0.5 - 0.416147 = 0.083853$.
   - $\frac{\partial f}{\partial y} = \frac{1}{y} = \frac{1}{3.0} \approx 0.333333$.
   The adjoint trace matches analytical calculus to full precision.

---

### Example 6.3: Forward-Mode AD via Dual Numbers
**Problem Statement:**  
Evaluate $f(x) = \frac{x^2}{1 + e^{-x}}$ and its derivative $f'(x)$ at $x = 1.0$ using dual numbers $a + b\epsilon$ where $\epsilon^2 = 0$.

**Step-by-Step Solution:**  
1. **Initialize Dual Input:**
   Let $x = 1 + 1\epsilon$ (setting seed $b = 1$ to compute $\frac{df}{dx}$).

2. **Evaluate Numerator $u = x^2$:**
   $$
   u = (1 + \epsilon)^2 = 1 + 2\epsilon + \epsilon^2 = 1 + 2\epsilon
   $$

3. **Evaluate Denominator $v = 1 + e^{-x}$:**
   - $-x = -1 - \epsilon$.
   - $e^{-x} = e^{-1 - \epsilon} = e^{-1} e^{-\epsilon} = e^{-1}(1 - \epsilon) = e^{-1} - e^{-1}\epsilon$.
   - $v = 1 + e^{-1} - e^{-1}\epsilon$.
   Evaluating constants ($e^{-1} \approx 0.367879$):
   $$
   v \approx 1.367879 - 0.367879\epsilon
   $$

4. **Evaluate Quotient $f = \frac{u}{v}$:**
   Using the dual division formula $\frac{a + b\epsilon}{c + d\epsilon} = \frac{a}{c} + \frac{bc - ad}{c^2}\epsilon$:
   - $a = 1.0, b = 2.0$
   - $c = 1.367879, d = -0.367879$
   - Value:
     $$
     \frac{a}{c} = \frac{1.0}{1.367879} \approx 0.731059
     $$
   - Derivative component:
     $$
     bc - ad = (2.0)(1.367879) - (1.0)(-0.367879) = 2.735758 + 0.367879 = 3.103637
     $$
     $$
     c^2 = (1.367879)^2 \approx 1.871113
     $$
     $$
     \frac{bc - ad}{c^2} = \frac{3.103637}{1.871113} \approx 1.658712
     $$

5. **Result:**
   $$
   f(1 + \epsilon) = 0.731059 + 1.658712\epsilon
   $$
   Thus, $f(1.0) = 0.731059$ and $f'(1.0) = 1.658712$.

---

### Example 6.4: Backpropagation through a Custom Non-Linearity (Swish)
**Problem Statement:**  
A layer computes activations using Swish: $a_i = z_i \sigma(z_i)$.  
During the backward pass, an incoming error adjoint is $\bar{a}_i = \frac{\partial \mathcal{L}}{\partial a_i} = 2.5$. The pre-activation was $z_i = 1.0$.  
Compute the adjoint $\bar{z}_i = \frac{\partial \mathcal{L}}{\partial z_i}$.

**Step-by-Step Solution:**  
1. **Derivative of Swish:**
   From Section 3.3.5:
   $$
   \frac{da}{dz} = \sigma(z) + z \sigma(z)(1 - \sigma(z)) = \sigma(z) [1 + z(1 - \sigma(z))]
   $$

2. **Evaluate at $z = 1.0$:**
   $$
   \sigma(1.0) = \frac{1}{1 + e^{-1}} \approx 0.731059
   $$
   $$
   1 - \sigma(1.0) = 0.268941
   $$
   $$
   \frac{da}{dz} = 0.731059 [1 + 1.0(0.268941)] = 0.731059 \times 1.268941 \approx 0.927671
   $$

3. **Applying Chain Rule:**
   $$
   \bar{z}_i = \bar{a}_i \cdot \frac{da}{dz} = 2.5 \times 0.927671 = 2.319178
   $$

---

### Example 6.5: Backpropagation through a Softmax Layer with External Adjoints
**Problem Statement:**  
Suppose a Softmax layer $\mathbf{p} = \operatorname{Softmax}(\mathbf{z})$ does **not** feed directly into Cross-Entropy, but into a downstream custom cost metric with incoming adjoint vector $\bar{\mathbf{p}} = [2.0, -1.0, 0.5]^T$.  
Let $\mathbf{p} = [0.2, 0.5, 0.3]^T$.  
Compute the pre-activation gradient vector $\bar{\mathbf{z}} = \frac{\partial \mathcal{L}}{\partial \mathbf{z}}$.

**Step-by-Step Solution:**  
1. **Vectorized Softmax Gradient Formula:**
   Recall the Softmax Jacobian $\mathbf{J} = \operatorname{diag}(\mathbf{p}) - \mathbf{p} \mathbf{p}^T$.  
   The adjoint $\bar{\mathbf{z}}$ is:
   $$
   \bar{\mathbf{z}} = \mathbf{J}^T \bar{\mathbf{p}} = (\operatorname{diag}(\mathbf{p}) - \mathbf{p} \mathbf{p}^T) \bar{\mathbf{p}} = \mathbf{p} \odot \bar{\mathbf{p}} - \mathbf{p} (\mathbf{p}^T \bar{\mathbf{p}})
   $$
   $$
   \bar{\mathbf{z}} = \mathbf{p} \odot \left( \bar{\mathbf{p}} - (\mathbf{p}^T \bar{\mathbf{p}}) \mathbf{1} \right)
   $$

2. **Compute Scalar Projection $\mathbf{p}^T \bar{\mathbf{p}}$:**
   $$
   \mathbf{p}^T \bar{\mathbf{p}} = 0.2(2.0) + 0.5(-1.0) + 0.3(0.5) = 0.4 - 0.5 + 0.15 = 0.05
   $$

3. **Compute Centered Adjoints $\bar{\mathbf{p}} - (\mathbf{p}^T \bar{\mathbf{p}})\mathbf{1}$:**
   $$
   \bar{\mathbf{p}}_{\text{centered}} = \begin{bmatrix} 2.0 - 0.05 \\ -1.0 - 0.05 \\ 0.5 - 0.05 \end{bmatrix} = \begin{bmatrix} 1.95 \\ -1.05 \\ 0.45 \end{bmatrix}
   $$

4. **Element-wise Multiply by $\mathbf{p}$:**
   $$
   \bar{\mathbf{z}} = \begin{bmatrix} 0.2 \times 1.95 \\ 0.5 \times (-1.05) \\ 0.3 \times 0.45 \end{bmatrix} = \begin{bmatrix} 0.390 \\ -0.525 \\ 0.135 \end{bmatrix}
   $$
   Notice the sum of elements: $0.390 - 0.525 + 0.135 = 0.000$, validating shift invariance.

---

### Example 6.6: Vectorized Batch Backpropagation Matrix Dimensions
**Problem Statement:**  
In a batched MLP layer:
- Batch size $B = 32$
- Layer input dimension $d_{l-1} = 64$
- Layer output dimension $d_l = 10$
The cached activation tensor is $\mathbf{A}^{[l-1]} \in \mathbb{R}^{32 \times 64}$.  
The downstream error tensor is $\boldsymbol{\Delta}^{[l]} \in \mathbb{R}^{32 \times 10}$.  
Derive the matrix multiplications (including exact transpositions and axis reductions) needed to compute:
1. $\frac{\partial \mathcal{L}}{\partial \mathbf{W}_{\text{row}}^{[l]}}$
2. $\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[l]}}$
3. $\boldsymbol{\Delta}^{[l-1]}$ given weight matrix $\mathbf{W}_{\text{row}}^{[l]} \in \mathbb{R}^{64 \times 10}$.

**Step-by-Step Solution:**  
1. **Weight Gradient Tensor:**
   Target shape: $(64, 10)$.  
   Available tensors: $\mathbf{A}^{[l-1]}$ of shape $(32, 64)$ and $\boldsymbol{\Delta}^{[l]}$ of shape $(32, 10)$.  
   To achieve shape $(64, 10)$, we must transpose $\mathbf{A}^{[l-1]}$:
   $$
   \frac{\partial \mathcal{L}}{\partial \mathbf{W}_{\text{row}}^{[l]}} = \frac{1}{B} (\mathbf{A}^{[l-1]})^T \boldsymbol{\Delta}^{[l]}
   $$
   Dimension check: $(64 \times 32) \times (32 \times 10) = (64 \times 10)$.

2. **Bias Gradient Vector:**
   Target shape: $(1, 10)$.  
   Sum across the batch dimension ($\text{axis} = 0$):
   $$
   \frac{\partial \mathcal{L}}{\partial \mathbf{b}^{[l]}} = \frac{1}{B} \sum_{i=1}^{32} \boldsymbol{\Delta}_{i,:}^{[l]}
   $$

3. **Upstream Error Matrix $\boldsymbol{\Delta}^{[l-1]}$:**
   Target shape: $(32, 64)$.  
   Available tensors: $\boldsymbol{\Delta}^{[l]}$ of shape $(32, 10)$ and $\mathbf{W}_{\text{row}}^{[l]}$ of shape $(64, 10)$.  
   To contract over dimension 10, transpose $\mathbf{W}_{\text{row}}^{[l]}$:
   $$
   \boldsymbol{\Delta}^{[l-1]} = \left( \boldsymbol{\Delta}^{[l]} (\mathbf{W}_{\text{row}}^{[l]})^T \right) \odot (g^{[l-1]})'(\mathbf{Z}^{[l-1]})
   $$
   Dimension check: $(32 \times 10) \times (10 \times 64) = (32 \times 64)$.

---

### Example 6.7: Backpropagation through a Weight-Tied Autoencoder
**Problem Statement:**  
An autoencoder compresses input $\mathbf{x} \in \mathbb{R}^d$ to code $\mathbf{h} = \sigma(\mathbf{W} \mathbf{x} + \mathbf{b}_1) \in \mathbb{R}^k$, and reconstructs via $\hat{\mathbf{x}} = \mathbf{W}^T \mathbf{h} + \mathbf{b}_2$ where the decoder weights are tied to the transpose of the encoder weights ($\mathbf{W}_{\text{dec}} = \mathbf{W}_{\text{enc}}^T = \mathbf{W}^T$).  
Derive the complete gradient $\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$.

**Step-by-Step Solution:**  
1. **Identify Dual Role of $\mathbf{W}$:**
   Matrix $\mathbf{W}$ appears twice in the computation graph:
   - Path 1: Decoder linear transformation $\hat{\mathbf{x}} = \mathbf{W}^T \mathbf{h} + \mathbf{b}_2$.
   - Path 2: Encoder pre-activation $\mathbf{z}_{\text{enc}} = \mathbf{W} \mathbf{x} + \mathbf{b}_1$.

2. **Gradient from Path 1 (Decoder):**
   Let $\boldsymbol{\delta}_{\text{dec}} = \frac{\partial \mathcal{L}}{\partial \hat{\mathbf{x}}}$.  
   Since $\hat{x}_i = \sum_j W_{ji} h_j + b_{2, i}$:
   $$
   \frac{\partial \mathcal{L}}{\partial W_{ji}}\Bigg|_{\text{dec}} = \delta_{\text{dec}, i} \cdot h_j \implies \left( \frac{\partial \mathcal{L}}{\partial \mathbf{W}} \right)_{\text{dec}} = \mathbf{h} \boldsymbol{\delta}_{\text{dec}}^T
   $$

3. **Gradient from Path 2 (Encoder):**
   The sensitivity with respect to $\mathbf{h}$ receives contributions from the decoder:
   $$
   \boldsymbol{\delta}_{\mathbf{h}} = \mathbf{W} \boldsymbol{\delta}_{\text{dec}}
   $$
   The encoder error vector is:
   $$
   \boldsymbol{\delta}_{\text{enc}} = \boldsymbol{\delta}_{\mathbf{h}} \odot \sigma'(\mathbf{z}_{\text{enc}}) = (\mathbf{W} \boldsymbol{\delta}_{\text{dec}}) \odot \sigma'(\mathbf{z}_{\text{enc}})
   $$
   The gradient through the encoder is:
   $$
   \left( \frac{\partial \mathcal{L}}{\partial \mathbf{W}} \right)_{\text{enc}} = \boldsymbol{\delta}_{\text{enc}} \mathbf{x}^T
   $$

4. **Total Accumulated Gradient:**
   Summing the sensitivities from both paths:
   $$
   \frac{\partial \mathcal{L}}{\partial \mathbf{W}} = \mathbf{h} \boldsymbol{\delta}_{\text{dec}}^T + \left[ (\mathbf{W} \boldsymbol{\delta}_{\text{dec}}) \odot \sigma'(\mathbf{z}_{\text{enc}}) \right] \mathbf{x}^T
   $$

---

### Example 6.8: Numerical Gradient Checking via Two-Sided Finite Differences
**Problem Statement:**  
An automatic differentiation routine computes an analytical weight gradient $g_{\text{auto}} = 1.482035$.  
Using two-sided finite differences with perturbation $\epsilon = 10^{-5}$, the loss values evaluated at $w + \epsilon$ and $w - \epsilon$ are:
$$
\mathcal{L}(w + \epsilon) = 0.84216834, \quad \mathcal{L}(w - \epsilon) = 0.84213870
$$
1. Compute the numerical gradient $g_{\text{num}}$.
2. Compute the relative error metric:
   $$
   \text{RelError} = \frac{|g_{\text{auto}} - g_{\text{num}}|}{\max(|g_{\text{auto}}|, |g_{\text{num}}|) + 10^{-8}}
   $$
3. Determine whether the autograd implementation passes gradient checking (standard threshold $< 10^{-5}$).

**Step-by-Step Solution:**  
1. **Numerical Gradient Calculation:**
   $$
   g_{\text{num}} = \frac{\mathcal{L}(w + \epsilon) - \mathcal{L}(w - \epsilon)}{2\epsilon} = \frac{0.84216834 - 0.84213870}{2 \times 10^{-5}} = \frac{0.00002964}{0.00002} = 1.482000
   $$

2. **Absolute and Relative Error:**
   - Absolute difference: $|1.482035 - 1.482000| = 0.000035 = 3.5 \times 10^{-5}$.
   - Denominator: $\max(1.482035, 1.482000) = 1.482035$.
   - Relative Error:
     $$
     \text{RelError} = \frac{3.5 \times 10^{-5}}{1.482035} \approx 2.36 \times 10^{-5}
     $$

3. **Assessment:**
   The relative error is $2.36 \times 10^{-5}$, which is on the borderline of the $10^{-5}$ acceptance threshold, consistent with $O(\epsilon^2) = 10^{-10}$ theoretical Taylor remainder truncated by float64 floating-point precision. The autograd implementation is verified correct.

---

### Example 6.9: Backpropagation through Hadamard Product and Broadcasting
**Problem Statement:**  
Let scalar loss $\mathcal{L}$ depend on matrix $\mathbf{C} = \mathbf{A} \odot \mathbf{b}$, where $\mathbf{A} \in \mathbb{R}^{3 \times 2}$ and $\mathbf{b} \in \mathbb{R}^{1 \times 2}$ is broadcast along the rows.  
Given the incoming adjoint $\bar{\mathbf{C}} \in \mathbb{R}^{3 \times 2}$:
$$
\bar{\mathbf{C}} = \begin{bmatrix} 1 & 2 \\ 3 & 4 \\ 5 & 6 \end{bmatrix}, \quad \mathbf{A} = \begin{bmatrix} 2 & 1 \\ 0 & 3 \\ -1 & 2 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 0.5 & -1.0 \end{bmatrix}
$$
Compute $\bar{\mathbf{A}}$ and $\bar{\mathbf{b}}$.

**Step-by-Step Solution:**  
1. **Gradient with Respect to A:**
   Since $C_{ij} = A_{ij} b_j$:
   $$
   \bar{A}_{ij} = \bar{C}_{ij} \cdot \frac{\partial C_{ij}}{\partial A_{ij}} = \bar{C}_{ij} \cdot b_j
   $$
   In vector notation:
   $$
   \bar{\mathbf{A}} = \bar{\mathbf{C}} \odot \mathbf{b}_{\text{broadcast}} = \begin{bmatrix} 1(0.5) & 2(-1.0) \\ 3(0.5) & 4(-1.0) \\ 5(0.5) & 6(-1.0) \end{bmatrix} = \begin{bmatrix} 0.5 & -2.0 \\ 1.5 & -4.0 \\ 2.5 & -6.0 \end{bmatrix}
   $$

2. **Gradient with Respect to Broadcast Vector b:**
   Since each element $b_j$ affects multiple rows of $\mathbf{C}$ ($i = 1, 2, 3$):
   $$
   \bar{b}_j = \sum_{i=1}^3 \bar{C}_{ij} \cdot \frac{\partial C_{ij}}{\partial b_j} = \sum_{i=1}^3 \bar{C}_{ij} A_{ij}
   $$
   - For $j = 1$: $\bar{b}_1 = 1(2) + 3(0) + 5(-1) = 2 + 0 - 5 = -3$.
   - For $j = 2$: $\bar{b}_2 = 2(1) + 4(3) + 6(2) = 2 + 12 + 12 = 26$.
   $$
   \bar{\mathbf{b}} = \begin{bmatrix} -3 & 26 \end{bmatrix}
   $$
   Notice that broadcasting in the forward pass corresponds to **summation reduction** in the backward pass.

---

### Example 6.10: Memory-Gradient Tradeoff in Activation Checkpointing
**Problem Statement:**  
A deep network has $L = 100$ sequential layers. Each layer requires $M = 100 \text{ MB}$ to store its activations.  
1. Compute the memory footprint for standard backpropagation.
2. Under **gradient checkpointing** (Chen et al., 2016), activations are stored only every $K = 10$ layers, and recomputed forward on-the-fly during backpropagation within each segment. Compute the peak memory footprint and additional computation overhead.

**Step-by-Step Solution:**  
1. **Standard Backpropagation Memory:**
   Must cache activations for all 100 layers simultaneously:
   $$
   \text{Memory}_{\text{standard}} = 100 \times 100 \text{ MB} = 10,000 \text{ MB} = 10 \text{ GB}
   $$

2. **Activation Checkpointing Memory:**
   - Store $L / K = 100 / 10 = 10$ checkpoints: $10 \times 100 \text{ MB} = 1 \text{ GB}$.
   - While backpropagating through a segment of length $K = 10$, recompute and hold its 10 intermediate activations: $10 \times 100 \text{ MB} = 1 \text{ GB}$.
   - Peak Memory:
     $$
     \text{Memory}_{\text{checkpoint}} = 1 \text{ GB} + 1 \text{ GB} = 2 \text{ GB}
     $$
   Memory footprint is reduced by $80\%$ ($5\times$ reduction)!

3. **Computational Overhead:**
   Every layer is evaluated once in the initial forward pass, and evaluated a second time during the backward recomputation segment.  
   Forward FLOPs increase by $100\%$. Since the backward pass typically takes $2\times$ forward FLOPs, total training runtime increases by only:
   $$
   \frac{1 (\text{fwd}) + 1 (\text{recompute}) + 2 (\text{bwd})}{1 (\text{fwd}) + 2 (\text{bwd})} = \frac{4}{3} \approx 33.3\%
   $$
   A $33\%$ increase in compute enables a $5\times$ larger model or batch to fit in GPU VRAM.

---

## 6.6 Exactly 10 Solved Exercises

### Exercise 6.1: Backpropagation through a 3-Layer Network with $L_1$ Loss
**Problem Statement:**  
Let a network compute scalar output $\hat{y}$ from $\mathbf{x} \in \mathbb{R}^d$. The loss is Mean Absolute Error: $\mathcal{L} = |\hat{y} - y|$.  
Derive the output layer error $\delta^{[L]}$ and discuss the behavior of gradient updates when $\hat{y} = y$.

**Detailed Solution:**  
1. **Differentiating Absolute Error:**
   The loss is $\mathcal{L} = |\hat{y} - y| = \operatorname{abs}(\hat{y} - y)$.  
   Its subgradient with respect to $\hat{y}$ is:
   $$
   \frac{\partial \mathcal{L}}{\partial \hat{y}} = \operatorname{sign}(\hat{y} - y) = \begin{cases} +1 & \text{if } \hat{y} > y \\ -1 & \text{if } \hat{y} < y \\ [-1, 1] & \text{if } \hat{y} = y \end{cases}
   $$

2. **Output Layer Error $\delta^{[L]}$:**
   $$
   \delta^{[L]} = \frac{\partial \mathcal{L}}{\partial z^{[L]}} = \frac{\partial \mathcal{L}}{\partial \hat{y}} \cdot (g^{[L]})'(z^{[L]}) = \operatorname{sign}(\hat{y} - y) \cdot (g^{[L]})'(z^{[L]})
   $$

3. **Behavior at $\hat{y} = y$:**
   At exact equality $\hat{y} = y$, the subgradient is set by convention to $0$. Unlike MSE where gradients smoothly shrink to zero ($e \to 0 \implies \nabla \to 0$), $L_1$ loss maintains constant gradient magnitude $\pm 1$ arbitrarily close to the target, causing gradient descent with fixed learning rate $\eta$ to oscillate endlessly across the minimum. This necessitates decaying learning rate schedules.

---

### Exercise 6.2: Backward Pass for a Residual Skip Connection
**Problem Statement:**  
A residual block computes $\mathbf{a}^{[l]} = \mathbf{a}^{[l-1]} + \mathcal{F}(\mathbf{a}^{[l-1]}; \mathbf{W}^{[l]})$.  
Given incoming adjoint $\bar{\mathbf{a}}^{[l]} = \nabla_{\mathbf{a}^{[l]}} \mathcal{L}$, derive the upstream gradient $\bar{\mathbf{a}}^{[l-1]} = \nabla_{\mathbf{a}^{[l-1]}} \mathcal{L}$.

**Detailed Solution:**  
1. **Applying Multivariate Chain Rule:**
   Activation $\mathbf{a}^{[l-1]}$ branches into two paths:
   - Path 1: Identity skip connection directly to $\mathbf{a}^{[l]}$.
   - Path 2: Input to non-linear residual function $\mathcal{F}$.
   $$
   \bar{\mathbf{a}}^{[l-1]} = \left( \frac{\partial \mathbf{a}^{[l]}}{\partial \mathbf{a}^{[l-1]}} \right)^T \bar{\mathbf{a}}^{[l]}
   $$

2. **Evaluating the Jacobian:**
   $$
   \frac{\partial \mathbf{a}^{[l]}}{\partial \mathbf{a}^{[l-1]}} = \frac{\partial}{\partial \mathbf{a}^{[l-1]}} \left[ \mathbf{a}^{[l-1]} + \mathcal{F}(\mathbf{a}^{[l-1]}) \right] = \mathbf{I} + \mathbf{J}_{\mathcal{F}}(\mathbf{a}^{[l-1]})
   $$

3. **Transposing and Distributing:**
   $$
   \bar{\mathbf{a}}^{[l-1]} = \left( \mathbf{I} + \mathbf{J}_{\mathcal{F}}^T \right) \bar{\mathbf{a}}^{[l]} = \bar{\mathbf{a}}^{[l]} + \mathbf{J}_{\mathcal{F}}^T \bar{\mathbf{a}}^{[l]}
   $$
   The incoming gradient splits into two terms:
   - $\bar{\mathbf{a}}^{[l]}$ flows **completely unchanged and unattenuated** through the identity skip connection.
   - $\mathbf{J}_{\mathcal{F}}^T \bar{\mathbf{a}}^{[l]}$ flows through the residual subnetwork.
   Even if the weights in $\mathcal{F}$ saturate and vanish ($\mathbf{J}_{\mathcal{F}} \to \mathbf{0}$), the identity path guarantees $\bar{\mathbf{a}}^{[l-1]} = \bar{\mathbf{a}}^{[l]}$, fundamentally solving the vanishing gradient problem in arbitrarily deep networks (He et al., 2016).

---

### Exercise 6.3: Hessian-Vector Products ($\mathbf{H} \mathbf{v}$) via Pearlmutter's $\mathcal{R}$-Operator
**Problem Statement:**  
Computing the full $P \times P$ Hessian matrix is intractable for large networks ($O(P^2)$ memory). Show that the Hessian-vector product $\mathbf{H} \mathbf{v}$ can be computed exactly in $O(P)$ time using two passes of automatic differentiation without materializing $\mathbf{H}$.

**Detailed Solution:**  
1. **Definition of Pearlmutter's $\mathcal{R}$-Operator (1994):**
   The directional derivative operator in direction $\mathbf{v}$ is:
   $$
   \mathcal{R}_{\mathbf{v}}\{f(\boldsymbol{\theta})\} \equiv \lim_{\epsilon \to 0} \frac{f(\boldsymbol{\theta} + \epsilon \mathbf{v}) - f(\boldsymbol{\theta})}{\epsilon} = \left. \frac{d}{d\epsilon} f(\boldsymbol{\theta} + \epsilon \mathbf{v}) \right|_{\epsilon = 0}
   $$

2. **Applying to the Gradient Vector:**
   Let $g(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} \mathcal{L}$. By definition of the Hessian $\mathbf{H} = \nabla^2 \mathcal{L}$:
   $$
   \mathcal{R}_{\mathbf{v}}\{\nabla_{\boldsymbol{\theta}} \mathcal{L}\} = \left. \frac{d}{d\epsilon} \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta} + \epsilon \mathbf{v}) \right|_{\epsilon = 0} = \nabla_{\boldsymbol{\theta}}^2 \mathcal{L} \cdot \mathbf{v} = \mathbf{H} \mathbf{v}
   $$

3. **Two-Pass Algorithm:**
   - **Pass 1:** Run standard reverse-mode AD to construct the scalar symbolic expression $S(\boldsymbol{\theta}) = \mathbf{v}^T \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta})$.
   - **Pass 2:** Differentiate $S(\boldsymbol{\theta})$ with respect to $\boldsymbol{\theta}$ using reverse-mode AD:
     $$
     \nabla_{\boldsymbol{\theta}} S(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}} \left( \mathbf{v}^T \nabla_{\boldsymbol{\theta}} \mathcal{L} \right) = \mathbf{H} \mathbf{v}
     $$
   Since both passes require $O(P)$ time and memory, the exact Hessian-vector product is computed with zero matrix allocation. This enables conjugate gradient descent, second-order optimization, and Trust Region Policy Optimization (TRPO).

---

### Exercise 6.4: Reverse-Mode Graph Pruning (Dead-Code Elimination)
**Problem Statement:**  
A forward graph executes operations:
$v_1 = x, \; v_2 = y, \; v_3 = v_1 \times v_2, \; v_4 = \sin(v_1), \; v_5 = v_4 + 2, \; v_6 = v_3^2$.  
The terminal loss is set to $\mathcal{L} = v_6$.  
Trace the backward pass and show that no backward computations are performed for $v_4$ and $v_5$.

**Detailed Solution:**  
1. **Identify Downstream Ancestry of $\mathcal{L} = v_6$:**
   - $\operatorname{Parents}(v_6) = \{v_3\}$.
   - $\operatorname{Parents}(v_3) = \{v_1, v_2\}$.
   The active sub-graph required to compute $v_6$ is $\mathcal{G}_{\text{active}} = \{v_1, v_2, v_3, v_6\}$.

2. **Backward Adjoint Evaluation:**
   - $\bar{v}_6 = 1.0$.
   - $\bar{v}_3 = \bar{v}_6 \cdot \frac{\partial v_6}{\partial v_3} = 1.0 \times 2 v_3 = 2 v_3$.
   - Nodes $v_4$ and $v_5$ have no directed paths to $v_6$:
     $$
     \operatorname{Children}(v_5) = \emptyset \implies \bar{v}_5 = 0
     $$
     $$
     \operatorname{Children}(v_4) = \{v_5\} \implies \bar{v}_4 = \bar{v}_5 \cdot 1 = 0
     $$
   Modern autograd engines (PyTorch Autograd, JAX) prune dead nodes during graph compilation: because $v_4$ and $v_5$ do not contribute to $\mathcal{L}$, their adjoint passes are eliminated, saving computation.

---

### Exercise 6.5: Adjoint Recurrence for Recurrent Neural Networks (BPTT)
**Problem Statement:**  
An RNN computes hidden states over time $t = 1, \dots, T$:
$$
\mathbf{h}_t = \tanh(\mathbf{W}_{hh} \mathbf{h}_{t-1} + \mathbf{W}_{xh} \mathbf{x}_t)
$$
with total loss $\mathcal{L} = \sum_{t=1}^T \mathcal{L}_t(\mathbf{h}_t)$.  
Derive the Backpropagation Through Time (BPTT) recurrence for $\bar{\mathbf{h}}_t = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_t}$.

**Detailed Solution:**  
1. **Multivariate Chain Rule Over Time:**
   Hidden state $\mathbf{h}_t$ affects the total loss through two routes:
   - Direct immediate contribution to step loss $\mathcal{L}_t$.
   - Downstream contribution to future hidden state $\mathbf{h}_{t+1}$.
   $$
   \bar{\mathbf{h}}_t = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_t} = \frac{\partial \mathcal{L}_t}{\partial \mathbf{h}_t} + \left( \frac{\partial \mathbf{h}_{t+1}}{\partial \mathbf{h}_t} \right)^T \bar{\mathbf{h}}_{t+1}
   $$

2. **Evaluating the Transition Jacobian:**
   $$
   \mathbf{h}_{t+1} = \tanh(\mathbf{z}_{t+1}), \quad \mathbf{z}_{t+1} = \mathbf{W}_{hh} \mathbf{h}_t + \mathbf{W}_{xh} \mathbf{x}_{t+1}
   $$
   $$
   \frac{\partial \mathbf{h}_{t+1}}{\partial \mathbf{h}_t} = \operatorname{diag}\left( 1 - \mathbf{h}_{t+1}^2 \right) \mathbf{W}_{hh}
   $$

3. **Recurrence Relation:**
   $$
   \bar{\mathbf{h}}_t = \nabla_{\mathbf{h}_t} \mathcal{L}_t + \mathbf{W}_{hh}^T \left[ \bar{\mathbf{h}}_{t+1} \odot (1 - \mathbf{h}_{t+1}^2) \right]
   $$
   Unrolling from $t = T$ backward to $t = 1$ multiplies the sensitivity by $\mathbf{W}_{hh}^T$ at every time step, leading to exponential vanishing or exploding gradients over long horizons.

---

### Exercise 6.6: Analytical Backpropagation through Batch Normalization
**Problem Statement:**  
Given batch normalization forward equations for mini-batch $x_1, \dots, x_B$:
$$
\mu = \frac{1}{B} \sum_{i=1}^B x_i, \quad \sigma^2 = \frac{1}{B} \sum_{i=1}^B (x_i - \mu)^2, \quad \hat{x}_i = \frac{x_i - \mu}{\sqrt{\sigma^2 + \epsilon}}
$$
Given incoming adjoints $\bar{\hat{x}}_i = \frac{\partial \mathcal{L}}{\partial \hat{x}_i}$, derive $\bar{x}_i = \frac{\partial \mathcal{L}}{\partial x_i}$.

**Detailed Solution:**  
1. **Differentiating Intermediate Variance and Mean:**
   - With respect to $\sigma^2$:
     $$
     \bar{\sigma}^2 = \sum_{i=1}^B \bar{\hat{x}}_i \frac{\partial \hat{x}_i}{\partial \sigma^2} = -\frac{1}{2} (\sigma^2 + \epsilon)^{-3/2} \sum_{i=1}^B \bar{\hat{x}}_i (x_i - \mu)
     $$
   - With respect to $\mu$:
     $$
     \bar{\mu} = \sum_{i=1}^B \bar{\hat{x}}_i \frac{\partial \hat{x}_i}{\partial \mu} + \bar{\sigma}^2 \frac{\partial \sigma^2}{\partial \mu} = -\frac{1}{\sqrt{\sigma^2 + \epsilon}} \sum_{i=1}^B \bar{\hat{x}}_i + \bar{\sigma}^2 \left( -\frac{2}{B} \sum_{i=1}^B (x_i - \mu) \right)
     $$
     Since $\sum_{i=1}^B (x_i - \mu) = 0$, the second term vanishes:
     $$
     \bar{\mu} = -\frac{1}{\sqrt{\sigma^2 + \epsilon}} \sum_{i=1}^B \bar{\hat{x}}_i
     $$

2. **Differentiating Input $x_i$:**
   $$
   \bar{x}_i = \bar{\hat{x}}_i \frac{\partial \hat{x}_i}{\partial x_i} + \bar{\sigma}^2 \frac{\partial \sigma^2}{\partial x_i} + \bar{\mu} \frac{\partial \mu}{\partial x_i}
   $$
   Substituting partial derivatives:
   $$
   \bar{x}_i = \frac{\bar{\hat{x}}_i}{\sqrt{\sigma^2 + \epsilon}} + \bar{\sigma}^2 \frac{2(x_i - \mu)}{B} + \frac{\bar{\mu}}{B}
   $$

3. **Combined Simplified Form:**
   $$
   \bar{x}_i = \frac{1}{B \sqrt{\sigma^2 + \epsilon}} \left[ B \bar{\hat{x}}_i - \sum_{j=1}^B \bar{\hat{x}}_j - \hat{x}_i \sum_{j=1}^B \bar{\hat{x}}_j \hat{x}_j \right] \quad \blacksquare
   $$
   This closed-form formulation computes the exact BatchNorm gradient in a single fused GPU kernel.

---

### Exercise 6.7: Gradient of the Frobenius Norm Regularizer
**Problem Statement:**  
Let regularizer be $\mathcal{R}(\mathbf{W}) = \frac{1}{2} \|\mathbf{W}\|_F^2 = \frac{1}{2} \operatorname{Tr}(\mathbf{W}^T \mathbf{W})$.  
Derive $\nabla_{\mathbf{W}} \mathcal{R}$ using matrix differential calculus.

**Detailed Solution:**  
1. **Differential Formulation:**
   Using the differential operator $d$:
   $$
   d\mathcal{R} = d\left[ \frac{1}{2} \operatorname{Tr}(\mathbf{W}^T \mathbf{W}) \right] = \frac{1}{2} \operatorname{Tr}\left( d(\mathbf{W}^T \mathbf{W}) \right) = \frac{1}{2} \operatorname{Tr}( (d\mathbf{W})^T \mathbf{W} + \mathbf{W}^T d\mathbf{W} )
   $$

2. **Cyclic Invariance of Trace:**
   $\operatorname{Tr}((d\mathbf{W})^T \mathbf{W}) = \operatorname{Tr}(\mathbf{W}^T d\mathbf{W})$.
   $$
   d\mathcal{R} = \frac{1}{2} \left[ 2 \operatorname{Tr}(\mathbf{W}^T d\mathbf{W}) \right] = \operatorname{Tr}(\mathbf{W}^T d\mathbf{W})
   $$

3. **Gradient Identification:**
   By definition of matrix gradient, $d\mathcal{R} = \operatorname{Tr}((\nabla_{\mathbf{W}} \mathcal{R})^T d\mathbf{W})$.  
   Equating terms:
   $$
   \nabla_{\mathbf{W}} \mathcal{R} = \mathbf{W} \quad \blacksquare
   $$

---

### Exercise 6.8: Finite-Difference Truncation vs. Roundoff Error Analysis
**Problem Statement:**  
In two-sided numerical differentiation $\hat{f}'(x) = \frac{f(x + \epsilon) - f(x - \epsilon)}{2\epsilon}$, the total error is the sum of Taylor truncation error $\frac{1}{6} M_3 \epsilon^2$ and floating-point roundoff error $\frac{\epsilon_{\text{mach}}}{\epsilon}$.  
Find the theoretical optimal step size $\epsilon^*$ that minimizes total error.

**Detailed Solution:**  
1. **Total Error Model:**
   $$
   E(\epsilon) = \frac{M_3}{6} \epsilon^2 + \frac{\epsilon_{\text{mach}}}{\epsilon}
   $$

2. **Minimizing with Respect to $\epsilon$:**
   $$
   \frac{dE}{d\epsilon} = \frac{M_3}{3} \epsilon - \frac{\epsilon_{\text{mach}}}{\epsilon^2} = 0
   $$
   $$
   \frac{M_3}{3} \epsilon^3 = \epsilon_{\text{mach}} \implies \epsilon^3 = \frac{3 \epsilon_{\text{mach}}}{M_3}
   $$
   $$
   \epsilon^* = \left( \frac{3 \epsilon_{\text{mach}}}{M_3} \right)^{1/3} = O(\epsilon_{\text{mach}}^{1/3})
   $$

3. **Numerical Values:**
   - For IEEE 754 double precision (`float64`), machine precision is $\epsilon_{\text{mach}} \approx 10^{-16}$.
     $$
     \epsilon^* \approx (10^{-16})^{1/3} \approx 10^{-5.33} \approx 10^{-5}
     $$
   - This proves why $\epsilon = 10^{-5}$ is the universal standard choice for numerical gradient checks in double precision.

---

### Exercise 6.9: Backpropagation through Layer Normalization
**Problem Statement:**  
Layer Normalization normalizes activations across feature channels per individual sample:
$$
y_i = \gamma \left( \frac{x_i - \mu}{\sigma} \right) + \beta \quad (i = 1, \dots, D)
$$
Show that $\sum_{i=1}^D \frac{\partial \mathcal{L}}{\partial x_i} = 0$, proving that LayerNorm ensures zero-mean gradients.

**Detailed Solution:**  
1. **Recall Normalized Gradient Identity:**
   From Exercise 6.6 (replacing batch dimension $B$ with channel dimension $D$):
   $$
   \frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{D \sigma} \left[ D \bar{y}_i - \sum_{j=1}^D \bar{y}_j - \hat{x}_i \sum_{j=1}^D \bar{y}_j \hat{x}_j \right]
   $$

2. **Summing across all channels $i = 1, \dots, D$:**
   $$
   \sum_{i=1}^D \frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{D \sigma} \left[ D \sum_{i=1}^D \bar{y}_i - \sum_{i=1}^D \left(\sum_{j=1}^D \bar{y}_j\right) - \left(\sum_{i=1}^D \hat{x}_i\right) \sum_{j=1}^D \bar{y}_j \hat{x}_j \right]
   $$

3. **Evaluating Sums:**
   - $\sum_{i=1}^D \left(\sum_{j=1}^D \bar{y}_j\right) = D \sum_{j=1}^D \bar{y}_j$.
   - By definition of normalization, the mean of $\hat{x}$ is zero: $\sum_{i=1}^D \hat{x}_i = 0$.
   Substituting:
   $$
   \sum_{i=1}^D \frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{D \sigma} \left[ D \sum \bar{y} - D \sum \bar{y} - 0 \right] = 0 \quad \blacksquare
   $$
   The sum of gradients entering a LayerNorm layer is identically zero, suppressing mean drift during optimization.

---

### Exercise 6.10: Space-Time Complexity Comparison of Reverse vs. Forward AD
**Problem Statement:**  
Let a computation graph have $N$ input parameters, $M$ operations, and $K$ outputs.  
1. State the time and space complexity of Forward-Mode AD.
2. State the time and space complexity of Reverse-Mode AD.
3. For a Transformer LLM where $N = 7 \times 10^{10}$, $M = 10^{12}$, and $K = 1$ (scalar loss), calculate the ratio of computational time between Forward-Mode and Reverse-Mode.

**Detailed Solution:**  
1. **Forward-Mode AD Complexity:**
   - Time: $O(N \cdot M)$ (requires $N$ passes, each taking $O(M)$ time).
   - Space: $O(1)$ working memory beyond current operation (no intermediate caching required).

2. **Reverse-Mode AD Complexity:**
   - Time: $O(K \cdot M)$ (for scalar loss $K = 1$, exactly 1 backward pass taking $O(M)$ time).
   - Space: $O(M)$ (must store all intermediate activations in memory).

3. **Transformer LLM Comparison:**
   - For $N = 70 \text{ billion}$ and $K = 1$:
     $$
     \text{Time Ratio} = \frac{\text{Time}_{\text{forward}}}{\text{Time}_{\text{reverse}}} \approx \frac{N \cdot M}{3 \cdot M} = \frac{7 \times 10^{10}}{3} \approx 2.33 \times 10^{10}
     $$
   Forward-mode AD would take **23 billion times longer** to compute the gradient! Backpropagation makes training feasible by completing in a single pass.
