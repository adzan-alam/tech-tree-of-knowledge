# Chapter 5: Tensor Calculus and Vectorized Forward Propagation

> *"In mathematics you don't understand things. You just get used to them. But in computing, you cannot afford mere familiarity: you must organize tensors so that your machine fetches data before it even knows it needs them."*  
> — **John von Neumann**, *First Draft of a Report on the EDVAC* (1945)

---

## 5.1 Tensor Algebra Foundations

Modern neural network computation is fundamentally an exercise in multidimensional tensor algebra. Before analyzing neural network architectures, we establish rigorous mathematical foundations for tensors and their memory representations.

### 5.1.1 Tensor Taxonomy and Ranks

In multilinear algebra, a **tensor** is an algebraic object that describes a multilinear relationship between sets of algebraic vectors. In computational machine learning, a tensor is generalized as an $n$-dimensional array of numerical scalars characterized by its **order** (or **rank**):

1. **Rank-0 Tensor (Scalar):** A single real number $x \in \mathbb{R}$.
2. **Rank-1 Tensor (Vector):** An ordered 1D sequence of numbers $\mathbf{x} \in \mathbb{R}^{d_1}$, indexed by a single integer $i$:
   $$
   \mathbf{x} = [x_1, x_2, \dots, x_{d_1}]^T
   $$
3. **Rank-2 Tensor (Matrix):** A 2D rectangular array $\mathbf{A} \in \mathbb{R}^{d_1 \times d_2}$, indexed by a pair of coordinates $(i, j)$:
   $$
   \mathbf{A} = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1 d_2} \\ a_{21} & a_{22} & \cdots & a_{2 d_2} \\ \vdots & \vdots & \ddots & \vdots \\ a_{d_1 1} & a_{d_1 2} & \cdots & a_{d_1 d_2} \end{bmatrix}
   $$
4. **Rank-3 Tensor:** A 3D block of numbers $\boldsymbol{\mathcal{T}} \in \mathbb{R}^{d_1 \times d_2 \times d_3}$, indexed by triple $(i, j, k)$ (common for sequential token batches: $\text{Batch} \times \text{Sequence Length} \times \text{Hidden Dimension}$).
5. **Rank-4 Tensor:** A 4D hyper-volume $\boldsymbol{\mathcal{X}} \in \mathbb{R}^{B \times C \times H \times W}$ (standard representation for convolutional computer vision batches: $\text{Batch} \times \text{Channels} \times \text{Height} \times \text{Width}$).
6. **Order-$k$ Tensor:** An element of the tensor product space $V_1 \otimes V_2 \otimes \dots \otimes V_k$, denoted $\boldsymbol{\mathcal{T}} \in \mathbb{R}^{d_1 \times d_2 \times \dots \times d_k}$.

```
                 Visualizing Tensor Ranks and Dimensionality
                 
    Rank 0: Scalar     Rank 1: Vector       Rank 2: Matrix       Rank 3: Tensor (3D)
         s              +----+             +----+----+----+        +----+----+----+
                        | x1 |             | a11| a12| a13|       /|    |    |   /|
                        +----+             +----+----+----+      +-+----+----+--+ |
                        | x2 |             | a21| a22| a23|      | | a  |    |  | +
                        +----+             +----+----+----+      | +----+----+--+ /
                        | x3 |                                   |/    /    /   |/
                        +----+                                   +----+----+----+
```

### 5.1.2 Tensor Contraction and Einstein Summation Convention

A **tensor contraction** maps an order-$k$ tensor to an order-$(k-2)$ tensor by summing over two matching indices.  
Under the **Einstein summation convention**, whenever an index variable appears twice in a single term—once as an upper (contravariant) index and once as a lower (covariant) index, or simply repeated within coordinate expressions—a summation over the full range of that index is implicitly assumed:
$$
A_i^k B_k^j \equiv \sum_{k=1}^K A_i^k B_k^j
$$

Examples of ubiquitous tensor operations expressed via index contraction:
1. **Vector Dot Product:**
   $$
   c = \mathbf{x}^T \mathbf{y} = x_i y_i \equiv \sum_{i=1}^d x_i y_i
   $$
2. **Matrix-Vector Multiplication:**
   $$
   y_i = A_{ij} x_j \equiv \sum_{j=1}^{d_2} A_{ij} x_j
   $$
3. **General Matrix Multiplication (GEMM):**
   $$
   C_{ik} = A_{ij} B_{jk} \equiv \sum_{j=1}^{d_2} A_{ij} B_{jk}
   $$
4. **Outer Product:**
   $$
   M_{ij} = x_i y_j \quad (\text{no contraction; rank } 1 + 1 = 2)
   $$
5. **Trace of a Square Matrix:**
   $$
   \operatorname{Tr}(\mathbf{A}) = A_{ii} \equiv \sum_{i=1}^d A_{ii}
   $$

---

## 5.2 Vectorized Multi-Layer Perceptron (MLP)

Let us formally specify an $L$-layer feedforward network processing a single sample $\mathbf{x} \in \mathbb{R}^{d_0}$.

### 5.2.1 Layer-by-Layer Recurrence Relations

For layer $l \in \{1, 2, \dots, L\}$:
- **Layer Dimensions:** Input dimension $d_{l-1}$, output dimension $d_l$.
- **Weight Matrix:** $\mathbf{W}^{[l]} \in \mathbb{R}^{d_l \times d_{l-1}}$, where element $W_{ij}^{[l]}$ represents the synaptic weight connecting neuron $j$ of layer $l-1$ to neuron $i$ of layer $l$.
- **Bias Vector:** $\mathbf{b}^{[l]} \in \mathbb{R}^{d_l}$, where $b_i^{[l]}$ is the threshold bias of neuron $i$ in layer $l$.
- **Pre-Activation Vector:** $\mathbf{z}^{[l]} \in \mathbb{R}^{d_l}$.
- **Activation Vector:** $\mathbf{a}^{[l]} \in \mathbb{R}^{d_l}$.

The feedforward equations for a single sample are:
$$
\mathbf{z}^{[l]} = \mathbf{W}^{[l]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}
$$
$$
\mathbf{a}^{[l]} = g^{[l]}(\mathbf{z}^{[l]})
$$
where $g^{[l]}: \mathbb{R} \to \mathbb{R}$ is the activation function applied element-wise, and $\mathbf{a}^{[0]} = \mathbf{x}$.

```
               Forward Information Flow Across Two Layers
               
     a^[l-1] (d_{l-1}) ----> [ W^[l] . a^[l-1] + b^[l] ] ----> z^[l] (d_l)
                                                                 |
                                                          [ g^[l]( . ) ]
                                                                 v
                                                               a^[l] (d_l)
                                                                 |
                                       [ W^[l+1] . a^[l] + b^[l+1] ]
                                                                 v
                                                              z^[l+1] (d_{l+1})
```

---

## 5.3 Batching and Matrix Broadcasting

Processing individual training vectors sequentially in loops is computationally disastrous on modern hardware due to memory latency and instruction overhead. We vectorize operations across a **mini-batch** of size $B$.

### 5.3.1 Row-Vector vs. Column-Vector Batching Conventions

In academic literature, vectors are often treated as column vectors $\mathbf{x} \in \mathbb{R}^{d \times 1}$. However, in production deep learning software frameworks (PyTorch, TensorFlow, JAX), data tensors are stored with the **batch dimension as the leading axis** (Axis 0).

Let $\mathbf{X} \in \mathbb{R}^{B \times d_0}$ denote the batch input matrix, where row $i$ corresponds to the transposed input vector of sample $i$:
$$
\mathbf{X} = \begin{bmatrix} (\mathbf{x}^{(1)})^T \\ (\mathbf{x}^{(2)})^T \\ \vdots \\ (\mathbf{x}^{(B)})^T \end{bmatrix} \in \mathbb{R}^{B \times d_0}
$$

Under this row-batch convention, the linear transformation is performed by multiplying by the weight matrix from the right:
$$
\mathbf{Z}^{[l]} = \mathbf{A}^{[l-1]} (\mathbf{W}^{[l]})^T + \mathbf{b}^{[l]}
$$
or equivalently, if storing weights directly in shape $\mathbf{W}_{\text{row}}^{[l]} \in \mathbb{R}^{d_{l-1} \times d_l}$:
$$
\mathbf{Z}^{[l]} = \mathbf{A}^{[l-1]} \mathbf{W}_{\text{row}}^{[l]} + \mathbf{b}^{[l]}
$$

Here:
- $\mathbf{A}^{[l-1]} \in \mathbb{R}^{B \times d_{l-1}}$
- $\mathbf{W}_{\text{row}}^{[l]} \in \mathbb{R}^{d_{l-1} \times d_l}$
- $\mathbf{Z}^{[l]} \in \mathbb{R}^{B \times d_l}$
- $\mathbf{A}^{[l]} = g^{[l]}(\mathbf{Z}^{[l]}) \in \mathbb{R}^{B \times d_l}$

### 5.3.2 Mathematical Semantics of Broadcasting

Notice the addition $\mathbf{A}^{[l-1]} \mathbf{W}_{\text{row}}^{[l]} + \mathbf{b}^{[l]}$.  
The matrix product has shape $(B, d_l)$, while the bias vector $\mathbf{b}^{[l]}$ has shape $(1, d_l)$ or $(d_l,)$.  
Under **NumPy/PyTorch broadcasting semantics**, dimensions are aligned from right to left:
1. Two dimensions are compatible if they are equal, or if one of them is $1$.
2. If an array has fewer dimensions than the other, its shape is prepended with $1$'s.
3. Any axis with size $1$ is virtually replicated (stretched) to match the larger size without physical memory duplication:
   $$
   (\mathbf{b}_{\text{broadcast}}^{[l]})_{ij} = b_j^{[l]} \quad \forall i \in \{1, \dots, B\}, \; j \in \{1, \dots, d_l\}
   $$
   $$
   \mathbf{Z}_{ij}^{[l]} = \left( \sum_{k=1}^{d_{l-1}} A_{ik}^{[l-1]} (W_{\text{row}})_{kj}^{[l]} \right) + b_j^{[l]}
   $$

---

## 5.4 Computational Memory Layouts and Cache Locality

To understand why batch matrix multiplication achieves teraflops on GPUs while scalar loops stall, we must examine the physical organization of memory.

### 5.4.1 Row-Major (C-Order) vs. Column-Major (Fortran-Order)

Computer random access memory (RAM) and GPU high-bandwidth memory (HBM) are flat, 1-dimensional physical address spaces indexed by linear integer byte addresses $0, 1, 2, \dots, M-1$.

To map a 2D matrix $\mathbf{A} \in \mathbb{R}^{H \times W}$ into a 1D address space:
1. **Row-Major (C-Order):** Successive elements of a row are placed contiguously in memory. Moving along the columns of a single row increments the address by 1 element.
   $$\operatorname{Offset}(i, j) = i \times \text{Stride}_0 + j \times \text{Stride}_1 = i \cdot W + j$$
   Used by C, C++, Python (NumPy default), PyTorch.
2. **Column-Major (Fortran-Order):** Successive elements of a column are placed contiguously.
   $$\operatorname{Offset}(i, j) = i \cdot 1 + j \cdot H$$
   Used by Fortran, MATLAB, Julia, BLAS (classical).

```
         Row-Major (C-Order) vs Column-Major (Fortran-Order) Memory Layout
         
         Matrix: [ [1, 2, 3],
                   [4, 5, 6] ]
                   
         Row-Major Storage (Contiguous Rows):
         Address:   0    1    2    3    4    5
         Value:   [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ]
                  |--- Row 0 ---||--- Row 1 ---|
                  
         Column-Major Storage (Contiguous Columns):
         Address:   0    1    2    3    4    5
         Value:   [ 1 ][ 4 ][ 2 ][ 5 ][ 3 ][ 6 ]
                  |-Col 0-||-Col 1-||-Col 2-|
```

### 5.4.2 Strides and Tensor Slicing

A tensor's shape $\mathbf{s} = (s_0, s_1, \dots, s_{k-1})$ is coupled with a **stride tuple** $\boldsymbol{\tau} = (\tau_0, \tau_1, \dots, \tau_{k-1})$. The physical memory address offset for index tuple $(i_0, i_1, \dots, i_{k-1})$ is computed as:
$$
\operatorname{Offset}(i_0, i_1, \dots, i_{k-1}) = \sum_{m=0}^{k-1} i_m \tau_m
$$

For a contiguous row-major tensor:
$$
\tau_{k-1} = 1, \quad \tau_m = \prod_{p=m+1}^{k-1} s_p
$$

#### Zero-Copy Views:
Operations such as transpose, slicing, and reshaping can often be executed in $O(1)$ time with **zero memory copies** simply by altering the shape and stride metadata:
- **Matrix Transpose:** Swapping axes swaps the strides:
  $$
  \mathbf{A} \in \mathbb{R}^{H \times W}, \; \boldsymbol{\tau} = (W, 1) \implies \mathbf{A}^T \in \mathbb{R}^{W \times H}, \; \boldsymbol{\tau}' = (1, W)
  $$
  $\mathbf{A}^T$ is a non-contiguous view of the original memory buffer!

### 5.4.3 Cache Lines, Spatial Locality, and GEMM Complexity

Modern computer architectures fetch memory into CPU L1/L2/L3 caches or GPU Shared Memory in chunks called **cache lines** (typically 64 bytes, holding 16 single-precision `float32` numbers).

- **Sequential Contiguous Access:** Reading $A_{i, 0}, A_{i, 1}, \dots, A_{i, 15}$ causes 1 cache miss on element 0, followed by 15 cache hits! The effective memory bandwidth approaches hardware peak.
- **Strided Access:** Reading across columns of a non-transposed row-major matrix ($A_{0, j}, A_{1, j}, A_{2, j}, \dots$) jumps across memory by $W$ elements. If $W \ge 16$, every single memory load results in a cache miss, stalling arithmetic pipelines.

#### Computational Complexity of GEMM:
For multiplying matrix $\mathbf{A} \in \mathbb{R}^{M \times K}$ by $\mathbf{B} \in \mathbb{R}^{K \times N}$:
- **Total Multiply-Accumulate (MAC) Operations:** $M \times K \times N$.
- **Total Floating-Point Operations (FLOPs):** $2 M K N$ (1 multiplication + 1 addition per MAC).
- **Arithmetic Intensity:** Ratio of FLOPs to bytes transferred:
  $$
  I = \frac{2 M K N \text{ FLOPs}}{4 (M K + K N + M N) \text{ Bytes}}
  $$
  As batch size $B = M$ grows large, $I$ increases linearly, moving the computation from the **memory-bandwidth-bound** regime into the **compute-bound** regime where tensor cores operate at maximum theoretical throughput (TFLOPs/s).

---

## 5.5 Exactly 10 Worked Examples

### Example 5.1: 3-Layer Forward Propagation Step-by-Step Numerical Trace
**Problem Statement:**  
Consider a 3-layer neural network (Input dimension $d_0 = 2$, hidden layer 1 dimension $d_1 = 3$, hidden layer 2 dimension $d_2 = 2$, output dimension $d_3 = 1$).  
Let the parameters be:
$$
\mathbf{W}^{[1]} = \begin{bmatrix} 1.0 & -1.0 \\ 0.5 & 2.0 \\ -1.5 & 0.0 \end{bmatrix}, \quad \mathbf{b}^{[1]} = \begin{bmatrix} 0.2 \\ -0.5 \\ 1.0 \end{bmatrix}
$$
$$
\mathbf{W}^{[2]} = \begin{bmatrix} 0.5 & -1.0 & 2.0 \\ 1.0 & 0.0 & -0.5 \end{bmatrix}, \quad \mathbf{b}^{[2]} = \begin{bmatrix} 0.0 \\ 0.5 \end{bmatrix}
$$
$$
\mathbf{W}^{[3]} = \begin{bmatrix} 2.0 & -1.5 \end{bmatrix}, \quad b^{[3]} = -0.5
$$
Let activation functions be: $g^{[1]} = \text{ReLU}$, $g^{[2]} = \text{ReLU}$, $g^{[3]} = \text{Linear}$.  
Compute the output $\hat{y}$ for input sample $\mathbf{x} = [2.0, 1.0]^T$.

**Step-by-Step Solution:**  
1. **Layer 1 Forward Pass:**
   $$
   \mathbf{z}^{[1]} = \mathbf{W}^{[1]} \mathbf{x} + \mathbf{b}^{[1]} = \begin{bmatrix} 1.0 & -1.0 \\ 0.5 & 2.0 \\ -1.5 & 0.0 \end{bmatrix} \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix} + \begin{bmatrix} 0.2 \\ -0.5 \\ 1.0 \end{bmatrix}
   $$
   $$
   \mathbf{z}^{[1]} = \begin{bmatrix} 1.0(2.0) - 1.0(1.0) \\ 0.5(2.0) + 2.0(1.0) \\ -1.5(2.0) + 0.0(1.0) \end{bmatrix} + \begin{bmatrix} 0.2 \\ -0.5 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 3.0 \\ -3.0 \end{bmatrix} + \begin{bmatrix} 0.2 \\ -0.5 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 1.2 \\ 2.5 \\ -2.0 \end{bmatrix}
   $$
   Apply ReLU activation:
   $$
   \mathbf{a}^{[1]} = \text{ReLU}(\mathbf{z}^{[1]}) = \begin{bmatrix} \max(0, 1.2) \\ \max(0, 2.5) \\ \max(0, -2.0) \end{bmatrix} = \begin{bmatrix} 1.2 \\ 2.5 \\ 0.0 \end{bmatrix}
   $$

2. **Layer 2 Forward Pass:**
   $$
   \mathbf{z}^{[2]} = \mathbf{W}^{[2]} \mathbf{a}^{[1]} + \mathbf{b}^{[2]} = \begin{bmatrix} 0.5 & -1.0 & 2.0 \\ 1.0 & 0.0 & -0.5 \end{bmatrix} \begin{bmatrix} 1.2 \\ 2.5 \\ 0.0 \end{bmatrix} + \begin{bmatrix} 0.0 \\ 0.5 \end{bmatrix}
   $$
   $$
   \mathbf{z}^{[2]} = \begin{bmatrix} 0.5(1.2) - 1.0(2.5) + 2.0(0.0) \\ 1.0(1.2) + 0.0(2.5) - 0.5(0.0) \end{bmatrix} + \begin{bmatrix} 0.0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 0.6 - 2.5 \\ 1.2 \end{bmatrix} + \begin{bmatrix} 0.0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} -1.9 \\ 1.7 \end{bmatrix}
   $$
   Apply ReLU activation:
   $$
   \mathbf{a}^{[2]} = \text{ReLU}(\mathbf{z}^{[2]}) = \begin{bmatrix} \max(0, -1.9) \\ \max(0, 1.7) \end{bmatrix} = \begin{bmatrix} 0.0 \\ 1.7 \end{bmatrix}
   $$

3. **Layer 3 Forward Pass (Output):**
   $$
   z^{[3]} = \mathbf{W}^{[3]} \mathbf{a}^{[2]} + b^{[3]} = \begin{bmatrix} 2.0 & -1.5 \end{bmatrix} \begin{bmatrix} 0.0 \\ 1.7 \end{bmatrix} - 0.5 = (2.0(0.0) - 1.5(1.7)) - 0.5 = -2.55 - 0.5 = -3.05
   $$
   Since activation is linear:
   $$
   \hat{y} = a^{[3]} = -3.05
   $$

---

### Example 5.2: Batch Forward Propagation with Broadcasting
**Problem Statement:**  
Let a batch of $B = 2$ samples be given by:
$$
\mathbf{X} = \begin{bmatrix} 1.0 & 2.0 \\ -1.0 & 0.5 \end{bmatrix} \in \mathbb{R}^{2 \times 2}
$$
The weight matrix and bias vector are:
$$
\mathbf{W}_{\text{row}} = \begin{bmatrix} 0.5 & -1.0 & 1.5 \\ 2.0 & 0.0 & -0.5 \end{bmatrix} \in \mathbb{R}^{2 \times 3}, \quad \mathbf{b} = \begin{bmatrix} 0.1 & -0.2 & 0.5 \end{bmatrix} \in \mathbb{R}^{1 \times 3}
$$
Compute the pre-activation batch tensor $\mathbf{Z} = \mathbf{X} \mathbf{W}_{\text{row}} + \mathbf{b}$ explicitly.

**Step-by-Step Solution:**  
1. **Matrix Multiplication $\mathbf{P} = \mathbf{X} \mathbf{W}_{\text{row}}$:**
   Dimensions: $(2 \times 2) \times (2 \times 3) = (2 \times 3)$.
   - Row 1:
     $$
     P_{11} = 1.0(0.5) + 2.0(2.0) = 0.5 + 4.0 = 4.5
     $$
     $$
     P_{12} = 1.0(-1.0) + 2.0(0.0) = -1.0 + 0.0 = -1.0
     $$
     $$
     P_{13} = 1.0(1.5) + 2.0(-0.5) = 1.5 - 1.0 = 0.5
     $$
   - Row 2:
     $$
     P_{21} = -1.0(0.5) + 0.5(2.0) = -0.5 + 1.0 = 0.5
     $$
     $$
     P_{22} = -1.0(-1.0) + 0.5(0.0) = 1.0 + 0.0 = 1.0
     $$
     $$
     P_{23} = -1.0(1.5) + 0.5(-0.5) = -1.5 - 0.25 = -1.75
     $$
   $$
   \mathbf{P} = \begin{bmatrix} 4.5 & -1.0 & 0.5 \\ 0.5 & 1.0 & -1.75 \end{bmatrix}
   $$

2. **Broadcasting the Bias Addition:**
   Replicate row vector $\mathbf{b}$ across the 2 batch rows:
   $$
   \mathbf{Z} = \begin{bmatrix} 4.5 + 0.1 & -1.0 + (-0.2) & 0.5 + 0.5 \\ 0.5 + 0.1 & 1.0 + (-0.2) & -1.75 + 0.5 \end{bmatrix} = \begin{bmatrix} 4.6 & -1.2 & 1.0 \\ 0.6 & 0.8 & -1.25 \end{bmatrix}
   $$

---

### Example 5.3: FLOP Count and Parameter Count for a Deep MLP
**Problem Statement:**  
An MLP architecture has layer dimensions: $[d_0, d_1, d_2, d_3, d_4] = [784, 512, 256, 128, 10]$.  
1. Compute the total number of trainable parameters (weights + biases).
2. Compute the exact forward pass FLOP count for a mini-batch of size $B = 64$ (assuming 2 FLOPs per multiply-accumulate and 1 FLOP per ReLU).

**Step-by-Step Solution:**  
1. **Trainable Parameter Count:**
   - Layer 1: $W_1 = 784 \times 512 = 401,408$; $b_1 = 512$. Subtotal $= 401,920$.
   - Layer 2: $W_2 = 512 \times 256 = 131,072$; $b_2 = 256$. Subtotal $= 131,328$.
   - Layer 3: $W_3 = 256 \times 128 = 32,768$; $b_3 = 128$. Subtotal $= 32,896$.
   - Layer 4: $W_4 = 128 \times 10 = 1,280$; $b_4 = 10$. Subtotal $= 1,290$.
   - **Total Parameters:**
     $$
     P_{\text{total}} = 401,920 + 131,328 + 32,896 + 1,290 = 567,434 \text{ parameters}
     $$

2. **FLOP Count for Batch Size $B = 64$:**
   For each layer $l$:
   - Matrix multiplication $\mathbf{A}^{[l-1]} \mathbf{W}^{[l]}$ requires $2 \times B \times d_{l-1} \times d_l$ FLOPs.
   - Bias addition requires $B \times d_l$ FLOPs.
   - ReLU activation requires $B \times d_l$ comparisons (1 FLOP each).
   Sum per layer: $B \times (2 d_{l-1} d_l + 2 d_l)$.
   - Layer 1: $64 \times (2(784)(512) + 2(512)) = 64 \times (802,816 + 1,024) = 64 \times 803,840 = 51,445,760$.
   - Layer 2: $64 \times (2(512)(256) + 2(256)) = 64 \times (262,144 + 512) = 64 \times 262,656 = 16,809,984$.
   - Layer 3: $64 \times (2(256)(128) + 2(128)) = 64 \times (65,536 + 256) = 64 \times 65,792 = 4,210,688$.
   - Layer 4 (Output with Softmax, no ReLU): $64 \times (2(128)(10) + 10) = 64 \times (2,560 + 10) = 64 \times 2,570 = 164,480$.
   - **Total FLOPs:**
     $$
     \text{Total FLOPs} = 51,445,760 + 16,809,984 + 4,210,688 + 164,480 = 72,630,912 \text{ FLOPs} \approx 72.63 \text{ MFLOPs}
     $$

---

### Example 5.4: Stride and Memory Offset Calculation in a 3D Tensor
**Problem Statement:**  
A 3D tensor $\boldsymbol{\mathcal{T}}$ has shape $(s_0, s_1, s_2) = (4, 3, 5)$ and is stored contiguously in row-major order with single-precision `float32` elements (4 bytes each).  
1. Compute the stride tuple in units of elements and in bytes.
2. Find the linear memory address offset (in elements and bytes) of element $\mathcal{T}[2, 1, 4]$.

**Step-by-Step Solution:**  
1. **Stride Tuple Calculation:**
   Using the formula $\tau_{k-1} = 1$ and $\tau_m = \prod_{p=m+1}^{k-1} s_p$:
   - $\tau_2 = 1$
   - $\tau_1 = s_2 = 5$
   - $\tau_0 = s_1 \times s_2 = 3 \times 5 = 15$
   - **Stride Tuple (in elements):** $(15, 5, 1)$.
   - **Stride Tuple (in bytes, multiplying by 4):** $(60, 20, 4)$ bytes.

2. **Memory Offset for Element $[2, 1, 4]$:**
   - Offset in elements:
     $$
     \text{Offset}_{\text{elem}} = i_0 \tau_0 + i_1 \tau_1 + i_2 \tau_2 = 2(15) + 1(5) + 4(1) = 30 + 5 + 4 = 39 \text{ elements}
     $$
   - Offset in bytes:
     $$
     \text{Offset}_{\text{bytes}} = 39 \times 4 = 156 \text{ bytes}
     $$

---

### Example 5.5: Non-Contiguous Memory Layout after Transpose
**Problem Statement:**  
Let matrix $\mathbf{A}$ of shape $(3, 4)$ be stored contiguously in row-major order:
$$
\mathbf{A} = \begin{bmatrix} 0 & 1 & 2 & 3 \\ 4 & 5 & 6 & 7 \\ 8 & 9 & 10 & 11 \end{bmatrix}
$$
1. State the shape and stride tuple of $\mathbf{A}$.
2. A transpose operation produces $\mathbf{B} = \mathbf{A}^T$. State the shape and stride tuple of $\mathbf{B}$.
3. Explain why $\mathbf{B}$ is non-contiguous in memory.

**Step-by-Step Solution:**  
1. **Matrix A:**
   - Shape: $(3, 4)$.
   - Strides: $\tau_0 = 4, \tau_1 = 1 \implies (4, 1)$.
   - Contiguity check: the trailing stride is $1$, and $\tau_0 = s_1 \times \tau_1 = 4 \times 1 = 4$. Contiguous!

2. **Matrix B = A.T:**
   - Shape: $(4, 3)$.
   - Strides: The transpose swaps the axes, which swaps the strides:
     $$
     \boldsymbol{\tau}_{\mathbf{B}} = (1, 4)
     $$

3. **Contiguity Analysis:**
   In a contiguous row-major tensor of shape $(4, 3)$, moving along columns of a row must have a stride of $1$ ($\tau_1 = 1$), and moving down rows must have a stride of $3$ ($\tau_0 = 3$).  
   However, in $\mathbf{B}$, moving down a row steps by $1$ element in physical memory ($\tau_0 = 1$), while moving across a column jumps by $4$ elements ($\tau_1 = 4$).  
   Because $\tau_1 \neq 1$, successive elements in a row are **not** adjacent in memory. The tensor is non-contiguous. Calling `B.contiguous()` allocates a new memory block and copies the elements into standard contiguous layout $(3, 1)$.

---

### Example 5.6: Vectorizing Einstein Summation in PyTorch / NumPy
**Problem Statement:**  
Express the following multilinear neural network operations using the Einstein summation string (`einsum`):
1. Batch matrix multiplication between $\mathbf{X} \in \mathbb{R}^{B \times d_{\text{in}}}$ and $\mathbf{W} \in \mathbb{R}^{d_{\text{in}} \times d_{\text{out}}}$.
2. Batched multi-head attention score computation between queries $\mathbf{Q} \in \mathbb{R}^{B \times H \times S \times D}$ and keys $\mathbf{K} \in \mathbb{R}^{B \times H \times S \times D}$.
3. Bilinear feature interaction $\mathbf{x}^T \mathbf{W} \mathbf{y}$ for batch vectors $\mathbf{x}, \mathbf{y} \in \mathbb{R}^{B \times d}$ and tensor $\mathbf{W} \in \mathbb{R}^{d \times d}$.

**Step-by-Step Solution:**  
1. **Batch Matrix Multiplication:**
   Inputs: $X_{bi}$ and $W_{ij}$. Output: $Z_{bj}$.
   $$
   Z_{bj} = \sum_{i} X_{bi} W_{ij} \implies \text{\texttt{"bi,ij->bj"}}
   $$

2. **Multi-Head Attention Attention Scores ($\mathbf{Q} \mathbf{K}^T$):**
   Query index: Batch $b$, Head $h$, Target sequence position $i$, Feature dimension $d$.  
   Key index: Batch $b$, Head $h$, Source sequence position $j$, Feature dimension $d$.  
   Output score matrix: $A_{bhij} = \sum_{d} Q_{bhid} K_{bhjd}$.
   $$
   \text{\texttt{"bhid,bhjd->bhij"}}
   $$

3. **Batched Bilinear Interaction:**
   $x_{bi}$, $W_{ij}$, $y_{bj}$. Contract over both $i$ and $j$ to produce a scalar per batch sample:
   $$
   s_b = \sum_{i} \sum_{j} x_{bi} W_{ij} y_{bj} \implies \text{\texttt{"bi,ij,bj->b"}}
   $$

---

### Example 5.7: Arithmetic Intensity and Roofline Model for Neural Network Inference
**Problem Statement:**  
A server GPU has a peak memory bandwidth of $900 \text{ GB/s}$ and a peak FP32 compute capability of $19.5 \text{ TFLOPs/s}$ ($19,500 \text{ GFLOPs/s}$).  
Consider forward pass inference on a linear layer with weight matrix $\mathbf{W} \in \mathbb{R}^{4096 \times 4096}$ stored in FP32 (4 bytes per element).  
1. Compute the operational arithmetic intensity $I$ (FLOPs / byte) for batch size $B = 1$ and for batch size $B = 128$.
2. For each batch size, determine whether the layer is memory-bandwidth-bound or compute-bound, and compute the maximum achievable throughput.

**Step-by-Step Solution:**  
1. **Roofline Inflection Knee Point:**
   The hardware balance point is:
   $$
   I_{\text{knee}} = \frac{\text{Peak Compute}}{\text{Peak Bandwidth}} = \frac{19,500 \text{ GFLOPs/s}}{900 \text{ GB/s}} \approx 21.67 \text{ FLOPs/Byte}
   $$
   - If $I < 21.67$: Memory-bound (throughput limited by memory bandwidth).
   - If $I \ge 21.67$: Compute-bound (throughput limited by tensor cores).

2. **Case A: Batch Size $B = 1$:**
   - Weight matrix size: $4096 \times 4096 \times 4 \text{ bytes} = 67,108,864 \text{ bytes} \approx 67.11 \text{ MB}$.
   - Input size: $1 \times 4096 \times 4 = 16,384 \text{ bytes}$.
   - Output size: $16,384 \text{ bytes}$.
   - Total Memory Transferred: $\approx 67.14 \text{ MB}$.
   - Total FLOPs: $2 \times 1 \times 4096 \times 4096 = 33,554,432 \text{ FLOPs} \approx 33.55 \text{ MFLOPs}$.
   - Arithmetic Intensity:
     $$
     I(B=1) = \frac{33,554,432 \text{ FLOPs}}{67,141,632 \text{ Bytes}} \approx 0.50 \text{ FLOPs/Byte}
     $$
   - Regime: $0.50 \ll 21.67 \implies$ **Severely Memory-Bound!**
   - Maximum Attainable Throughput:
     $$
     \text{Performance} = 0.50 \text{ FLOPs/Byte} \times 900 \text{ GB/s} = 450 \text{ GFLOPs/s}
     $$
     The GPU utilizes only $\frac{450}{19,500} \approx 2.3\%$ of its arithmetic computational power.

3. **Case B: Batch Size $B = 128$:**
   - Total Memory Transferred: Weight matrix ($67.11 \text{ MB}$) + Input ($128 \times 4096 \times 4 = 2.10 \text{ MB}$) + Output ($2.10 \text{ MB}$) $\approx 71.31 \text{ MB}$.
   - Total FLOPs: $2 \times 128 \times 4096 \times 4096 = 4,294,967,296 \text{ FLOPs} \approx 4.295 \text{ GFLOPs}$.
   - Arithmetic Intensity:
     $$
     I(B=128) = \frac{4,294,967,296 \text{ FLOPs}}{71,310,000 \text{ Bytes}} \approx 60.23 \text{ FLOPs/Byte}
     $$
   - Regime: $60.23 > 21.67 \implies$ **Compute-Bound!**
   - Maximum Attainable Throughput: $19.5 \text{ TFLOPs/s}$ ($100\%$ theoretical peak hardware utilization). Batching provides a $43\times$ speedup per sample!

---

### Example 5.8: Cache Miss Simulation in Row vs Column Iteration
**Problem Statement:**  
A square matrix $\mathbf{M} \in \mathbb{R}^{1024 \times 1024}$ is stored in row-major FP32 order. The CPU cache has 64-byte cache lines (16 floats per line).  
Compare the total number of cache line misses when summing all elements via:
1. Row-major traversal (outer loop $i$, inner loop $j$: `M[i][j]`).
2. Column-major traversal (outer loop $j$, inner loop $i$: `M[i][j]`).

**Step-by-Step Solution:**  
1. **Total Matrix Elements:**
   $1024 \times 1024 = 1,048,576$ elements.  
   Total cache lines occupied: $\frac{1,048,576}{16} = 65,536$ lines.

2. **Row-Major Traversal (`M[i][j]`):**
   - The inner loop increments $j$, accessing adjacent memory addresses: $0, 4, 8, 12, \dots$ bytes.
   - Accessing `M[i][0]` loads a full 64-byte line containing `M[i][0]` through `M[i][15]`.
   - The subsequent 15 reads (`j = 1` through `j = 15`) are guaranteed cache hits!
   - Total Cache Misses: Exactly 1 miss per 16 elements:
     $$
     \text{Misses}_{\text{row}} = \frac{1,048,576}{16} = 65,536 \text{ misses}
     $$
   - Cache Miss Rate: $\frac{1}{16} = 6.25\%$.

3. **Column-Major Traversal (`M[i][j]` with outer $j$):**
   - The inner loop increments $i$, jumping by $1024$ elements ($4096$ bytes) on every step.
   - Because $4096 \text{ bytes} \gg 64 \text{ bytes}$, each read accesses a completely different cache line.
   - Assuming the L1 cache cannot hold the entire matrix ($1024 \times 4096 = 4 \text{ MB}$), previously loaded cache lines are evicted before column $j+1$ is reached.
   - Total Cache Misses: Every single read misses:
     $$
     \text{Misses}_{\text{col}} = 1,048,576 \text{ misses}
     $$
   - Cache Miss Rate: $100\%$. The column-major traversal runs roughly $10\times$ to $15\times$ slower due to continuous RAM bus wait states.

---

### Example 5.9: Tensor Reshaping vs. Transposing: Understanding Data Copy vs. View
**Problem Statement:**  
Let $\mathbf{A} \in \mathbb{R}^{2 \times 3}$ be given by:
$$
\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}
$$
1. What are the values of $\mathbf{B} = \operatorname{reshape}(\mathbf{A}, (3, 2))$?
2. What are the values of $\mathbf{C} = \mathbf{A}^T$?
3. Explain why $\mathbf{B} \neq \mathbf{C}$.

**Step-by-Step Solution:**  
1. **Reshape Operation $\operatorname{reshape}(\mathbf{A}, (3, 2))$:**
   Reshaping reads the physical 1D memory buffer in order and repacks it into the new shape without rearranging elements:
   - 1D buffer order: $[1, 2, 3, 4, 5, 6]$.
   - Packing into $(3, 2)$ (3 rows, 2 columns):
     $$
     \mathbf{B} = \begin{bmatrix} 1 & 2 \\ 3 & 4 \\ 5 & 6 \end{bmatrix}
     $$

2. **Transpose Operation $\mathbf{A}^T$:**
   Transposing swaps rows and columns: element $(i, j)$ moves to $(j, i)$:
   $$
   \mathbf{C} = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}
   $$

3. **Why They Differ:**
   - In $\mathbf{B}$ (reshape), row 0 is $[1, 2]$.
   - In $\mathbf{C}$ (transpose), row 0 is $[1, 4]$.
   Reshape preserves 1D memory order and alters coordinate geometry; transpose preserves logical coordinate pairings ($A_{ij} \to C_{ji}$) and alters 1D stride traversal.

---

### Example 5.10: Vectorizing Softmax Across Batches with Maximum Subtraction
**Problem Statement:**  
Let batch logit matrix $\mathbf{Z} \in \mathbb{R}^{2 \times 3}$ be:
$$
\mathbf{Z} = \begin{bmatrix} 10.0 & 20.0 & 30.0 \\ 100.0 & 100.0 & 90.0 \end{bmatrix}
$$
Write the vectorized equations for computing the batch Softmax matrix $\mathbf{P} \in \mathbb{R}^{2 \times 3}$ using axis reduction, broadcasting, and matrix division. Compute numerical values.

**Step-by-Step Solution:**  
1. **Row-wise Maximum Reduction ($\text{axis} = 1$):**
   $$
   \mathbf{m} = \max_{j} Z_{ij} \in \mathbb{R}^{2 \times 1} \implies \mathbf{m} = \begin{bmatrix} 30.0 \\ 100.0 \end{bmatrix}
   $$

2. **Broadcast Subtraction $\mathbf{Z}' = \mathbf{Z} - \mathbf{m}$:**
   $$
   \mathbf{Z}' = \begin{bmatrix} 10.0 - 30.0 & 20.0 - 30.0 & 30.0 - 30.0 \\ 100.0 - 100.0 & 100.0 - 100.0 & 90.0 - 100.0 \end{bmatrix} = \begin{bmatrix} -20.0 & -10.0 & 0.0 \\ 0.0 & 0.0 & -10.0 \end{bmatrix}
   $$

3. **Element-wise Exponentiation $\mathbf{E} = \exp(\mathbf{Z}')$:**
   - Row 1: $e^{-20} \approx 2.061 \times 10^{-9}$, $e^{-10} \approx 4.540 \times 10^{-5}$, $e^0 = 1.0$.
   - Row 2: $e^0 = 1.0$, $e^0 = 1.0$, $e^{-10} \approx 4.540 \times 10^{-5}$.

4. **Row-wise Sum Reduction $\mathbf{s} = \sum_{j} E_{ij} \in \mathbb{R}^{2 \times 1}$:**
   - $s_1 = 2.061 \times 10^{-9} + 4.540 \times 10^{-5} + 1.0 \approx 1.0000454$.
   - $s_2 = 1.0 + 1.0 + 4.540 \times 10^{-5} \approx 2.0000454$.

5. **Broadcast Normalization $\mathbf{P} = \mathbf{E} \oslash \mathbf{s}$:**
   - Row 1:
     $$
     p_{11} \approx 2.06 \times 10^{-9}, \quad p_{12} \approx 4.54 \times 10^{-5}, \quad p_{13} \approx 0.999955
     $$
   - Row 2:
     $$
     p_{21} = \frac{1.0}{2.0000454} \approx 0.499989, \quad p_{22} \approx 0.499989, \quad p_{23} \approx 2.27 \times 10^{-5}
     $$
   Both rows sum to $1.0$, completed without overflow.

---

## 5.6 Exactly 10 Solved Exercises

### Exercise 5.1: 4-Layer Vectorized Forward Pass Calculation
**Problem Statement:**  
Given network architecture $[d_0, d_1, d_2, d_3] = [3, 2, 2, 1]$ with all weights $W_{ij}^{[l]} = 0.5$, all biases $b_i^{[l]} = 0.1$, and activation functions $g^{[1]} = \text{ReLU}$, $g^{[2]} = \text{ReLU}$, $g^{[3]} = \sigma$ (logistic sigmoid).  
For input vector $\mathbf{x} = [1.0, -2.0, 3.0]^T$, compute the scalar output $\hat{y}$.

**Detailed Solution:**  
1. **Layer 1:**
   $$
   \mathbf{W}^{[1]} = \begin{bmatrix} 0.5 & 0.5 & 0.5 \\ 0.5 & 0.5 & 0.5 \end{bmatrix}, \quad \mathbf{b}^{[1]} = \begin{bmatrix} 0.1 \\ 0.1 \end{bmatrix}
   $$
   $$
   \mathbf{z}^{[1]} = \mathbf{W}^{[1]} \mathbf{x} + \mathbf{b}^{[1]} = \begin{bmatrix} 0.5(1 - 2 + 3) + 0.1 \\ 0.5(1 - 2 + 3) + 0.1 \end{bmatrix} = \begin{bmatrix} 0.5(2) + 0.1 \\ 0.5(2) + 0.1 \end{bmatrix} = \begin{bmatrix} 1.1 \\ 1.1 \end{bmatrix}
   $$
   $$
   \mathbf{a}^{[1]} = \text{ReLU}(\mathbf{z}^{[1]}) = \begin{bmatrix} 1.1 \\ 1.1 \end{bmatrix}
   $$

2. **Layer 2:**
   $$
   \mathbf{W}^{[2]} = \begin{bmatrix} 0.5 & 0.5 \\ 0.5 & 0.5 \end{bmatrix}, \quad \mathbf{b}^{[2]} = \begin{bmatrix} 0.1 \\ 0.1 \end{bmatrix}
   $$
   $$
   \mathbf{z}^{[2]} = \mathbf{W}^{[2]} \mathbf{a}^{[1]} + \mathbf{b}^{[2]} = \begin{bmatrix} 0.5(1.1 + 1.1) + 0.1 \\ 0.5(1.1 + 1.1) + 0.1 \end{bmatrix} = \begin{bmatrix} 0.5(2.2) + 0.1 \\ 0.5(2.2) + 0.1 \end{bmatrix} = \begin{bmatrix} 1.2 \\ 1.2 \end{bmatrix}
   $$
   $$
   \mathbf{a}^{[2]} = \text{ReLU}(\mathbf{z}^{[2]}) = \begin{bmatrix} 1.2 \\ 1.2 \end{bmatrix}
   $$

3. **Layer 3 (Output):**
   $$
   \mathbf{W}^{[3]} = \begin{bmatrix} 0.5 & 0.5 \end{bmatrix}, \quad b^{[3]} = 0.1
   $$
   $$
   z^{[3]} = \mathbf{W}^{[3]} \mathbf{a}^{[2]} + b^{[3]} = 0.5(1.2 + 1.2) + 0.1 = 0.5(2.4) + 0.1 = 1.2 + 0.1 = 1.3
   $$
   $$
   \hat{y} = \sigma(1.3) = \frac{1}{1 + e^{-1.3}} = \frac{1}{1 + 0.27253} = \frac{1}{1.27253} \approx 0.7858
   $$

---

### Exercise 5.2: Memory Allocation Footprint for Training vs. Inference
**Problem Statement:**  
A 50-layer deep neural network has 100 million FP32 parameters ($10^8$ weights and biases).  
Mini-batch size is $B = 32$, and each layer outputs an activation tensor of shape $(B, 1024)$.  
1. Compute the static memory required to store the model weights.
2. For inference, compute the minimum activation memory needed.
3. For training with standard backpropagation, compute the activation memory required to cache intermediate values for the backward pass.

**Detailed Solution:**  
1. **Weight Parameter Memory:**
   $$
   \text{Mem}_{\text{params}} = 10^8 \times 4 \text{ bytes} = 400,000,000 \text{ bytes} = 400 \text{ MB}
   $$

2. **Inference Activation Memory:**
   In inference, intermediate activations do not need to be retained for backpropagation. The framework can overwrite activations layer-by-layer using **ping-pong double-buffering**:
   - Buffer size: $B \times 1024 \times 4 \text{ bytes} = 32 \times 1024 \times 4 = 131,072 \text{ bytes} = 128 \text{ KB}$.
   - Double buffer: $2 \times 128 \text{ KB} = 256 \text{ KB}$.  
   Inference requires negligible activation memory!

3. **Training Activation Memory:**
   Backpropagation requires cached activations $\mathbf{a}^{[l]}$ and pre-activations $\mathbf{z}^{[l]}$ for all $50$ layers:
   - Per layer cached memory: $2 \times (32 \times 1024 \times 4) = 256 \text{ KB}$.
   - Across 50 layers:
     $$
     \text{Mem}_{\text{activations}} = 50 \times 256 \text{ KB} = 12,800 \text{ KB} = 12.8 \text{ MB}
     $$
   (Note: For massive models like LLMs with sequence length 4096 and hidden dimension 8192, activation memory dominates parameter memory, necessitating activation checkpointing).

---

### Exercise 5.3: General Matrix Multiply (GEMM) Flop/s and Efficiency
**Problem Statement:**  
A benchmark performs batch GEMM $\mathbf{C} = \mathbf{A} \mathbf{B}$ with $M = 2048, K = 2048, N = 2048$ in single-precision FP32 on a hardware accelerator with peak theoretical performance of $15.0 \text{ TFLOPs/s}$. The benchmark completes in $1.25 \text{ milliseconds}$.  
1. Compute the exact number of FLOPs executed.
2. Compute the sustained throughput in TFLOPs/s.
3. Compute the hardware computational efficiency (sustained vs peak).

**Detailed Solution:**  
1. **Total FLOPs:**
   $$
   \text{FLOPs} = 2 M K N = 2 \times 2048 \times 2048 \times 2048 = 2 \times 2^{11} \times 2^{11} \times 2^{11} = 2 \times 2^{33} = 2^{34} = 17,179,869,184 \text{ FLOPs}
   $$
   $\approx 17.18 \text{ GFLOPs}$.

2. **Sustained Throughput:**
   $$
   \text{Time} = 1.25 \text{ ms} = 1.25 \times 10^{-3} \text{ seconds}
   $$
   $$
   \text{Throughput} = \frac{17.179869 \times 10^9 \text{ FLOPs}}{1.25 \times 10^{-3} \text{ s}} = 13.74389 \times 10^{12} \text{ FLOPs/s} = 13.74 \text{ TFLOPs/s}
   $$

3. **Hardware Efficiency:**
   $$
   \text{Efficiency} = \frac{13.74 \text{ TFLOPs/s}}{15.0 \text{ TFLOPs/s}} \times 100\% = 91.6\%
   $$

---

### Exercise 5.4: Broadcasting Dimensionality Rules
**Problem Statement:**  
Determine whether the following tensor pairs can broadcast together. If valid, give the resulting tensor shape. If invalid, explain why.
1. Shape $(32, 1, 128)$ and Shape $(32, 64, 128)$
2. Shape $(16, 256)$ and Shape $(16, 1, 256)$
3. Shape $(8, 3, 224, 224)$ and Shape $(3, 1, 1)$
4. Shape $(10, 5)$ and Shape $(5, 10)$

**Detailed Solution:**  
1. **Pair 1: $(32, 1, 128)$ and $(32, 64, 128)$:**
   Align from right:
   - Axis 2: $128 == 128$ (Valid)
   - Axis 1: $1$ and $64$ (Valid, $1$ stretches to $64$)
   - Axis 0: $32 == 32$ (Valid)
   **Result:** Valid. Output shape: $(32, 64, 128)$.

2. **Pair 2: $(16, 256)$ and $(16, 1, 256)$:**
   Prepend 1 to smaller shape: $(1, 16, 256)$ vs $(16, 1, 256)$.
   - Axis 2: $256 == 256$ (Valid)
   - Axis 1: $16$ and $1$ (Valid, stretches to $16$)
   - Axis 0: $1$ and $16$ (Valid, stretches to $16$)
   **Result:** Valid. Output shape: $(16, 16, 256)$.

3. **Pair 3: $(8, 3, 224, 224)$ and $(3, 1, 1)$:**
   Prepend 1: $(1, 3, 1, 1)$ vs $(8, 3, 224, 224)$.
   - Axis 3: $1$ and $224$ (Valid)
   - Axis 2: $1$ and $224$ (Valid)
   - Axis 1: $3 == 3$ (Valid)
   - Axis 0: $1$ and $8$ (Valid)
   **Result:** Valid. Output shape: $(8, 3, 224, 224)$ (standard per-channel image bias addition).

4. **Pair 4: $(10, 5)$ and $(5, 10)$:**
   - Axis 1: $5 \neq 10$ and neither is $1$.
   **Result:** Invalid. Incompatible dimensions on trailing axis!

---

### Exercise 5.5: Stride Calculation for Arbitrary Slices
**Problem Statement:**  
Let tensor $\mathbf{X}$ have shape $(100, 200)$ and row-major strides $(200, 1)$.  
Consider the sub-tensor slice $\mathbf{Y} = \mathbf{X}[10:50:2, 20:100:4]$.  
1. What is the shape of $\mathbf{Y}$?
2. What are the strides of $\mathbf{Y}$?
3. What is the memory offset of the first element $\mathbf{Y}[0, 0]$ relative to $\mathbf{X}[0, 0]$?

**Detailed Solution:**  
1. **Shape of $\mathbf{Y}$:**
   - Dimension 0: from index 10 to 50 with step 2: $\text{length} = \lceil \frac{50 - 10}{2} \rceil = \frac{40}{2} = 20$.
   - Dimension 1: from index 20 to 100 with step 4: $\text{length} = \lceil \frac{100 - 20}{4} \rceil = \frac{80}{4} = 20$.
   **Shape:** $(20, 20)$.

2. **Strides of $\mathbf{Y}$:**
   - Moving by 1 step in axis 0 of $\mathbf{Y}$ corresponds to stepping by 2 along axis 0 of $\mathbf{X}$:
     $$
     \tau_0' = \text{step}_0 \times \tau_0 = 2 \times 200 = 400
     $$
   - Moving by 1 step in axis 1 of $\mathbf{Y}$ corresponds to stepping by 4 along axis 1 of $\mathbf{X}$:
     $$
     \tau_1' = \text{step}_1 \times \tau_1 = 4 \times 1 = 4
     $$
   **Strides:** $(400, 4)$.

3. **Memory Offset of $\mathbf{Y}[0, 0]$:**
   $\mathbf{Y}[0, 0]$ is element $\mathbf{X}[10, 20]$:
   $$
   \text{Offset} = 10 \times 200 + 20 \times 1 = 2000 + 20 = 2020 \text{ elements}
   $$

---

### Exercise 5.6: Vectorizing Dropout Forward Masking
**Problem Statement:**  
In inverted dropout with keep probability $p_{\text{keep}} \in (0, 1]$, each activation $a_{ij}$ is multiplied by a scaled random Bernoulli mask $m_{ij} \sim \operatorname{Bernoulli}(p_{\text{keep}}) / p_{\text{keep}}$.  
1. Prove that $\mathbb{E}[m_{ij} a_{ij}] = a_{ij}$, preserving expectation.
2. Compute the variance $\operatorname{Var}(m_{ij} a_{ij})$ as a function of $p_{\text{keep}}$ and $a_{ij}$.

**Detailed Solution:**  
1. **Preservation of Expectation:**
   Let $B_{ij} \sim \operatorname{Bernoulli}(p_{\text{keep}})$, so $P(B_{ij} = 1) = p_{\text{keep}}$ and $P(B_{ij} = 0) = 1 - p_{\text{keep}}$.  
   The mask is $m_{ij} = \frac{B_{ij}}{p_{\text{keep}}}$.
   $$
   \mathbb{E}[m_{ij}] = \frac{\mathbb{E}[B_{ij}]}{p_{\text{keep}}} = \frac{p_{\text{keep}}}{p_{\text{keep}}} = 1
   $$
   Since $m_{ij}$ is independent of activation $a_{ij}$:
   $$
   \mathbb{E}[m_{ij} a_{ij}] = \mathbb{E}[m_{ij}] \cdot a_{ij} = 1 \cdot a_{ij} = a_{ij} \quad \blacksquare
   $$

2. **Variance Calculation:**
   $$
   \operatorname{Var}(m_{ij} a_{ij}) = a_{ij}^2 \operatorname{Var}(m_{ij}) = a_{ij}^2 \operatorname{Var}\left(\frac{B_{ij}}{p_{\text{keep}}}\right) = \frac{a_{ij}^2}{p_{\text{keep}}^2} \operatorname{Var}(B_{ij})
   $$
   Since $\operatorname{Var}(B_{ij}) = p_{\text{keep}}(1 - p_{\text{keep}})$:
   $$
   \operatorname{Var}(m_{ij} a_{ij}) = \frac{a_{ij}^2}{p_{\text{keep}}^2} p_{\text{keep}}(1 - p_{\text{keep}}) = a_{ij}^2 \left( \frac{1 - p_{\text{keep}}}{p_{\text{keep}}} \right)
   $$
   For $p_{\text{keep}} = 0.5$, $\operatorname{Var} = a_{ij}^2 (0.5 / 0.5) = a_{ij}^2$. The variance injected by dropout acts as dynamic stochastic noise regularization during training.

---

### Exercise 5.7: Bilinear Tensor Layer Parameter Count and Vectorization
**Problem Statement:**  
A bilinear layer computes output vector $\mathbf{y} \in \mathbb{R}^{d_y}$ from two input vectors $\mathbf{x}_1 \in \mathbb{R}^{d_1}$ and $\mathbf{x}_2 \in \mathbb{R}^{d_2}$ via:
$$
y_k = \mathbf{x}_1^T \mathbf{W}_k \mathbf{x}_2 + b_k \quad (k = 1, \dots, d_y)
$$
where each $\mathbf{W}_k \in \mathbb{R}^{d_1 \times d_2}$.  
1. State the total number of trainable parameters in tensor $\boldsymbol{\mathcal{W}} \in \mathbb{R}^{d_y \times d_1 \times d_2}$ and bias $\mathbf{b} \in \mathbb{R}^{d_y}$.
2. Write the vectorized batch operation for batch inputs $\mathbf{X}_1 \in \mathbb{R}^{B \times d_1}$ and $\mathbf{X}_2 \in \mathbb{R}^{B \times d_2}$ using Einstein summation.

**Detailed Solution:**  
1. **Parameter Count:**
   - Tensor $\boldsymbol{\mathcal{W}}$ contains $d_y \times d_1 \times d_2$ weights.
   - Bias vector $\mathbf{b}$ contains $d_y$ biases.
   - Total Parameters: $d_y (d_1 d_2 + 1)$.

2. **Vectorized Einstein Summation:**
   For a mini-batch of size $B$:
   - $\mathbf{X}_1$: indices $(b, i)$ where $i \in \{1, \dots, d_1\}$.
   - $\boldsymbol{\mathcal{W}}$: indices $(k, i, j)$ where $k \in \{1, \dots, d_y\}$ and $j \in \{1, \dots, d_2\}$.
   - $\mathbf{X}_2$: indices $(b, j)$.
   - Output $\mathbf{Y}$: indices $(b, k)$.
   $$
   Y_{bk} = \sum_{i=1}^{d_1} \sum_{j=1}^{d_2} (X_1)_{bi} \mathcal{W}_{kij} (X_2)_{bj} + b_k
   $$
   In Python:
   ```python
   Y = torch.einsum("bi,kij,bj->bk", X1, W, X2) + b
   ```

---

### Exercise 5.8: Matrix Multiplication Cache-Oblivious Tiling Analysis
**Problem Statement:**  
Consider blocked matrix multiplication where matrices of size $N \times N$ are partitioned into sub-blocks of size $T \times T$ to fit inside a high-speed L1 cache of size $M$ bytes.  
1. If three $T \times T$ sub-blocks (for $\mathbf{A}$, $\mathbf{B}$, and $\mathbf{C}$) must fit simultaneously in cache, derive the maximum block size $T$ in terms of cache size $M$ and element size $S$ bytes.
2. Show that block tiling reduces main memory traffic from $O(N^3)$ to $O(N^3 / \sqrt{M})$.

**Detailed Solution:**  
1. **Cache Capacity Constraint:**
   Each $T \times T$ tile requires $T^2 \times S$ bytes. Storing tiles for $\mathbf{A}_{\text{tile}}$, $\mathbf{B}_{\text{tile}}$, and $\mathbf{C}_{\text{tile}}$ simultaneously requires:
   $$
   3 T^2 S \le M \implies T^2 \le \frac{M}{3S} \implies T \le \sqrt{\frac{M}{3S}}
   $$

2. **Memory Traffic Reduction:**
   - In unblocked matrix multiplication, for each element $C_{ij}$, an entire row of $\mathbf{A}$ and column of $\mathbf{B}$ are read. Total memory reads $= O(N^3)$.
   - In tiled multiplication, there are $(N / T)$ block divisions along each dimension, giving $(N/T)^3$ block multiplications.
   - In each block multiplication, loading the tiles requires reading $2 T^2 S$ bytes.
   - Total bytes transferred from main memory:
     $$
     \text{Bytes} = \left(\frac{N}{T}\right)^3 \times (2 T^2 S) = \frac{2 N^3 S}{T}
     $$
   - Substituting $T = \Theta(\sqrt{M/S})$:
     $$
     \text{Bytes} = \frac{2 N^3 S}{\Theta(\sqrt{M/S})} = O\left( \frac{N^3}{\sqrt{M}} \right) \quad \blacksquare
     $$
   This Hong-Kung I/O lower bound proves that cache tiling speeds up execution by a factor of $\Theta(\sqrt{M})$.

---

### Exercise 5.9: Kronecker Product Layer Expansion
**Problem Statement:**  
In parameter-efficient neural network compression, a large weight matrix $\mathbf{W} \in \mathbb{R}^{d_1 d_2 \times d_3 d_4}$ is represented as the Kronecker product of two smaller matrices: $\mathbf{W} = \mathbf{A} \otimes \mathbf{B}$ where $\mathbf{A} \in \mathbb{R}^{d_1 \times d_3}$ and $\mathbf{B} \in \mathbb{R}^{d_2 \times d_4}$.  
1. Compute the compression ratio in parameter storage.
2. For $d_1 = d_2 = d_3 = d_4 = 32$, compare the parameter count of $\mathbf{W}$ versus $(\mathbf{A}, \mathbf{B})$.

**Detailed Solution:**  
1. **Parameter Counts:**
   - Uncompressed matrix $\mathbf{W}$:
     $$
     P_{\text{dense}} = (d_1 d_2) \times (d_3 d_4) = d_1 d_2 d_3 d_4
     $$
   - Kronecker factorization $(\mathbf{A}, \mathbf{B})$:
     $$
     P_{\text{kron}} = d_1 d_3 + d_2 d_4
     $$
   - Compression Ratio:
     $$
     \rho = \frac{d_1 d_3 + d_2 d_4}{d_1 d_2 d_3 d_4} = \frac{1}{d_2 d_4} + \frac{1}{d_1 d_3}
     $$

2. **Numerical Evaluation ($d = 32$):**
   - Uncompressed: $\mathbf{W}$ has shape $(32 \times 32, 32 \times 32) = (1024, 1024)$.
     $$
     P_{\text{dense}} = 1024 \times 1024 = 1,048,576 \text{ parameters}
     $$
   - Kronecker factors: $\mathbf{A} \in \mathbb{R}^{32 \times 32}$, $\mathbf{B} \in \mathbb{R}^{32 \times 32}$.
     $$
     P_{\text{kron}} = (32 \times 32) + (32 \times 32) = 1024 + 1024 = 2,048 \text{ parameters}
     $$
   - Savings:
     $$
     \text{Compression Ratio} = \frac{2,048}{1,048,576} = \frac{1}{512} \approx 0.195\%
     $$
   The Kronecker representation reduces parameter storage by over $99.8\%$!

---

### Exercise 5.10: Forward Propagation with Skip Connections (Residual Networks)
**Problem Statement:**  
A Residual Block computes $\mathbf{a}^{[l]} = g(\mathbf{z}^{[l]} + \mathbf{a}^{[l-1]})$ where $\mathbf{z}^{[l]} = \mathbf{W}^{[l]} g(\mathbf{W}^{[l-1]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l-1]}) + \mathbf{b}^{[l]}$.  
Let $\mathbf{a}^{[l-1]} = [1.0, -1.0]^T$. The internal layer parameters are:
$$
\mathbf{W}^{[l-1]} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}, \quad \mathbf{b}^{[l-1]} = \begin{bmatrix} 0.5 \\ 0.5 \end{bmatrix}
$$
$$
\mathbf{W}^{[l]} = \begin{bmatrix} 2 & -1 \\ 1 & 2 \end{bmatrix}, \quad \mathbf{b}^{[l]} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}
$$
Activation function is $g = \text{ReLU}$.  
Compute the output activation $\mathbf{a}^{[l]}$ with and without the residual identity skip connection $\mathbf{a}^{[l-1]}$.

**Detailed Solution:**  
1. **First Internal Layer:**
   $$
   \mathbf{z}_{\text{mid}} = \mathbf{W}^{[l-1]} \mathbf{a}^{[l-1]} + \mathbf{b}^{[l-1]} = \begin{bmatrix} 1.0 + 0.5 \\ -1.0 + 0.5 \end{bmatrix} = \begin{bmatrix} 1.5 \\ -0.5 \end{bmatrix}
   $$
   $$
   \mathbf{a}_{\text{mid}} = \text{ReLU}(\mathbf{z}_{\text{mid}}) = \begin{bmatrix} \max(0, 1.5) \\ \max(0, -0.5) \end{bmatrix} = \begin{bmatrix} 1.5 \\ 0.0 \end{bmatrix}
   $$

2. **Second Internal Layer (Residual Transformation $\mathcal{F}(\mathbf{x})$):**
   $$
   \mathbf{z}^{[l]} = \mathbf{W}^{[l]} \mathbf{a}_{\text{mid}} + \mathbf{b}^{[l]} = \begin{bmatrix} 2 & -1 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} 1.5 \\ 0.0 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 2(1.5) - 1(0) \\ 1(1.5) + 2(0) \end{bmatrix} = \begin{bmatrix} 3.0 \\ 1.5 \end{bmatrix}
   $$

3. **Case A: Without Skip Connection (Standard Feedforward):**
   $$
   \mathbf{a}_{\text{plain}} = \text{ReLU}(\mathbf{z}^{[l]}) = \begin{bmatrix} 3.0 \\ 1.5 \end{bmatrix}
   $$

4. **Case B: With Skip Connection (ResNet Block):**
   Add identity connection before final activation:
   $$
   \mathbf{z}_{\text{res}} = \mathbf{z}^{[l]} + \mathbf{a}^{[l-1]} = \begin{bmatrix} 3.0 \\ 1.5 \end{bmatrix} + \begin{bmatrix} 1.0 \\ -1.0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 0.5 \end{bmatrix}
   $$
   $$
   \mathbf{a}^{[l]} = \text{ReLU}(\mathbf{z}_{\text{res}}) = \begin{bmatrix} \max(0, 4.0) \\ \max(0, 0.5) \end{bmatrix} = \begin{bmatrix} 4.0 \\ 0.5 \end{bmatrix}
   $$
   The residual connection allows direct additive gradient flow $(\frac{\partial \mathbf{a}^{[l]}}{\partial \mathbf{a}^{[l-1]}} = \mathbf{I} + \frac{\partial \mathcal{F}}{\partial \mathbf{a}^{[l-1]}})$, ensuring that error signals can bypass saturated non-linearities unimpeded.
