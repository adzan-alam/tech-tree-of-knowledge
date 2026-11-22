# Chapter 2: The Geometry of Linear Separability and the XOR Winter

> *"The perceptron has shown itself worthy of study on many grounds... But when we come to problems of geometric pattern recognition—such as determining whether a figure is connected, or computing parity—the limitations of single-layer linear machines are severe and insurmountable."*  
> — **Marvin Minsky & Seymour Papert**, *Perceptrons: An Introduction to Computational Geometry* (1969)

---

## 2.1 Hyperplanes in $\mathbb{R}^d$: The Geometry of Affine Decision Boundaries

At its mathematical core, an artificial neuron is a geometric machine. Before we can appreciate why multi-layer neural networks transformed modern artificial intelligence, we must master the precise geometry of what a single neuron can—and cannot—divide in Euclidean space.

### 2.1.1 The Mathematical Formulation of a Hyperplane

Let $\mathbb{R}^d$ be $d$-dimensional Euclidean space. An affine **hyperplane** $H$ is a flat $(d - 1)$-dimensional affine subspace defined by a linear algebraic equation:
$$
H = \{\mathbf{x} \in \mathbb{R}^d : \mathbf{w}^T \mathbf{x} + b = 0\}
$$
where:
- $\mathbf{w} = [w_1, w_2, \dots, w_d]^T \in \mathbb{R}^d \setminus \{\mathbf{0}\}$ is the **weight vector** (the normal vector perpendicular to the hyperplane).
- $b \in \mathbb{R}$ is the **bias scalar**, dictating the offset of the hyperplane from the origin.

```
                  Geometry of a Hyperplane in R^2
                             x2 ^
                                |         w (Normal Vector)
                                |        ^
                                |       /
                                |      /
                                |     /
         -----------------------+----+------------------------> x1
                                |   /  Hyperplane H: w^T x + b = 0
                                |  /
                                | /  <- Signed distance to origin:
                                |/      d = b / ||w||_2
                                +
```

### 2.1.2 Normal Vectors and Half-Spaces

The normal vector $\mathbf{w}$ points directly in the direction of the "positive" half-space. The hyperplane partitions the ambient Euclidean space $\mathbb{R}^d$ into two open half-spaces and the boundary itself:
1. **Positive Half-Space:**
   $$
   H^+ = \{\mathbf{x} \in \mathbb{R}^d : \mathbf{w}^T \mathbf{x} + b > 0\}
   $$
2. **Negative Half-Space:**
   $$
   H^- = \{\mathbf{x} \in \mathbb{R}^d : \mathbf{w}^T \mathbf{x} + b < 0\}
   $$
3. **Decision Boundary:**
   $$
   H = \{\mathbf{x} \in \mathbb{R}^d : \mathbf{w}^T \mathbf{x} + b = 0\}
   $$

### 2.1.3 Orthogonal Distance to a Hyperplane

Let $\mathbf{x}_0 \in \mathbb{R}^d$ be an arbitrary query point in space. What is the shortest perpendicular Euclidean distance from $\mathbf{x}_0$ to the hyperplane $H$?

#### Theorem: Perpendicular Geometric Distance
The signed orthogonal distance $d(\mathbf{x}_0)$ from point $\mathbf{x}_0$ to the hyperplane $\mathbf{w}^T \mathbf{x} + b = 0$ is:
$$
d(\mathbf{x}_0) = \frac{\mathbf{w}^T \mathbf{x}_0 + b}{\|\mathbf{w}\|_2}
$$
And the absolute Euclidean distance is:
$$
\text{dist}(\mathbf{x}_0, H) = |d(\mathbf{x}_0)| = \frac{|\mathbf{w}^T \mathbf{x}_0 + b|}{\|\mathbf{w}\|_2}
$$

*Proof:*  
Let $\mathbf{x}_p \in H$ be the orthogonal projection of $\mathbf{x}_0$ onto $H$. Because the displacement vector $\mathbf{x}_0 - \mathbf{x}_p$ is perpendicular to the hyperplane, it must be parallel to the normal vector $\mathbf{w}$:
$$
\mathbf{x}_0 - \mathbf{x}_p = d \cdot \frac{\mathbf{w}}{\|\mathbf{w}\|_2} \implies \mathbf{x}_0 = \mathbf{x}_p + d \cdot \frac{\mathbf{w}}{\|\mathbf{w}\|_2}
$$
where $d \in \mathbb{R}$ is the signed distance. Take the inner product of both sides with $\mathbf{w}$ and add $b$:
$$
\mathbf{w}^T \mathbf{x}_0 + b = \mathbf{w}^T \left( \mathbf{x}_p + d \cdot \frac{\mathbf{w}}{\|\mathbf{w}\|_2} \right) + b = (\mathbf{w}^T \mathbf{x}_p + b) + d \cdot \frac{\mathbf{w}^T \mathbf{w}}{\|\mathbf{w}\|_2}
$$
Because $\mathbf{x}_p \in H$, by definition $\mathbf{w}^T \mathbf{x}_p + b = 0$. Furthermore, $\mathbf{w}^T \mathbf{w} = \|\mathbf{w}\|_2^2$:
$$
\mathbf{w}^T \mathbf{x}_0 + b = 0 + d \cdot \frac{\|\mathbf{w}\|_2^2}{\|\mathbf{w}\|_2} = d \|\mathbf{w}\|_2
$$
Dividing by $\|\mathbf{w}\|_2 > 0$ yields:
$$
d = \frac{\mathbf{w}^T \mathbf{x}_0 + b}{\|\mathbf{w}\|_2} \quad \blacksquare
$$

Setting $\mathbf{x}_0 = \mathbf{0}$ confirms that the orthogonal distance from the origin to the hyperplane is $\frac{b}{\|\mathbf{w}\|_2}$. If $b = 0$, the hyperplane passes directly through the origin.

---

## 2.2 Linear Classification of Canonical Logical Functions

In binary classification, each input is a vertex of the unit hypercube $\{0, 1\}^d$. A function $f: \{0, 1\}^d \to \{0, 1\}$ is **linearly separable** if there exists a hyperplane that cleanly divides the vertices where $f(\mathbf{x}) = 1$ from those where $f(\mathbf{x}) = 0$.

Let us examine the canonical 2-input Boolean functions ($d = 2$):

```
       AND Gate                     OR Gate                    XOR Gate
   x2 ^                         x2 ^                        x2 ^
      |                            |                           |
    1 |  o       *               1 |  *       *              1 |  *       o
      |                            |                           |
      |                            |                           |
    0 |  o       o               0 |  o       *              0 |  o       *
      +-------------> x1           +-------------> x1          +-------------> x1
         0       1                    0       1                   0       1
     Separable: Line:             Separable: Line:           NON-SEPARABLE!
     x1 + x2 - 1.5 = 0            x1 + x2 - 0.5 = 0          Cannot divide with
                                                             a single straight line!
     Key: o = Label 0, * = Label 1
```

### 2.2.1 Synthesis of the AND Decision Boundary
The logical AND function evaluates to $1$ if and only if both $x_1 = 1$ and $x_2 = 1$.  
The required classification constraints are:
$$
\begin{cases}
w_1(0) + w_2(0) + b < 0 \implies b < 0 \\
w_1(1) + w_2(0) + b < 0 \implies w_1 + b < 0 \\
w_1(0) + w_2(1) + b < 0 \implies w_2 + b < 0 \\
w_1(1) + w_2(1) + b > 0 \implies w_1 + w_2 + b > 0
\end{cases}
$$
Setting $w_1 = 1, w_2 = 1, b = -1.5$:
- At $(0, 0)$: $0 + 0 - 1.5 = -1.5 < 0 \implies 0$ (Correct).
- At $(1, 0)$: $1 + 0 - 1.5 = -0.5 < 0 \implies 0$ (Correct).
- At $(0, 1)$: $0 + 1 - 1.5 = -0.5 < 0 \implies 0$ (Correct).
- At $(1, 1)$: $1 + 1 - 1.5 = +0.5 > 0 \implies 1$ (Correct).

The separating line is $x_1 + x_2 = 1.5$.

### 2.2.2 Synthesis of the OR Decision Boundary
The logical OR function evaluates to $1$ if at least one input is $1$.  
The required constraints are:
$$
\begin{cases}
b < 0 \\
w_1 + b > 0 \\
w_2 + b > 0 \\
w_1 + w_2 + b > 0
\end{cases}
$$
Setting $w_1 = 1, w_2 = 1, b = -0.5$:
- At $(0, 0)$: $-0.5 < 0 \implies 0$.
- At $(1, 0)$: $1 - 0.5 = +0.5 > 0 \implies 1$.
- At $(0, 1)$: $1 - 0.5 = +0.5 > 0 \implies 1$.
- At $(1, 1)$: $2 - 0.5 = +1.5 > 0 \implies 1$.

The separating line is $x_1 + x_2 = 0.5$.

### 2.2.3 Synthesis of the NAND Decision Boundary
The NAND function (negation of AND) is achieved by simply negating the normal vector and bias of the AND gate:
$$
w_1 = -1, \quad w_2 = -1, \quad b = +1.5
$$
- At $(0, 0)$: $+1.5 > 0 \implies 1$.
- At $(1, 0)$: $-1 + 1.5 = +0.5 > 0 \implies 1$.
- At $(0, 1)$: $-1 + 1.5 = +0.5 > 0 \implies 1$.
- At $(1, 1)$: $-1 - 1 + 1.5 = -0.5 < 0 \implies 0$.

All threshold logic gates above are single-neuron classifiers.

---

## 2.3 Minsky & Papert’s Fatal Critique (1969) & The First AI Winter

In the late 1950s and early 1960s, public and military enthusiasm for Rosenblatt's Perceptron reached fever pitch. The New York Times reported that the US Navy expected perceptrons to soon "be able to walk, talk, see, write, reproduce itself and be conscious of its existence." Substantial defense funding poured into connectionist neural laboratories.

In 1969, MIT computer scientists **Marvin Minsky** (co-founder of the MIT AI Laboratory) and **Seymour Papert** published the mathematical monograph *Perceptrons*.

```
    +-----------------------------------------------------------------------+
    |                    The Historic Impact of "Perceptrons"               |
    +-----------------------------------------------------------------------+
    | 1958: Rosenblatt Perceptron    -> Euphoric hype, massive funding      |
    | 1969: Minsky & Papert Critique -> Proves XOR impossible linearly      |
    | 1970-1982: The First AI Winter -> DARPA cuts neural network funding   |
    | 1986: Rumelhart & Hinton       -> Backprop revives connectionism!     |
    +-----------------------------------------------------------------------+
```

Minsky and Papert proved rigorously that single-layer perceptrons were fundamentally incapable of computing simple global geometric properties:
1. **The Parity Problem:** Computing whether the number of active bits is odd or even cannot be performed by any linear threshold gate.
2. **The Connectedness Problem:** A "diameter-limited" perceptron (where individual sensory inputs inspect only local patches of a visual field) cannot determine whether an image consists of a single connected shape or two disconnected components.
3. **The XOR Catastrophe:** Even in a minimal 2-variable universe, the Exclusive-OR (XOR) logic gate is mathematically impossible for a single neuron.

The book’s pessimistic conclusion—suggesting that extending perceptrons to multi-layer architectures would be computationally intractable and sterile—prompted government funding agencies (notably DARPA) to freeze connectionist research worldwide, inaugurating the **First AI Winter** (1970–1982).

---

## 2.4 Algebraic Proof of XOR Non-Separability

We now present the definitive algebraic proof that a single artificial neuron cannot compute the XOR function.

### 2.4.1 Truth Table of the XOR Function

| Input $x_1$ | Input $x_2$ | True Label $y$ |
|:---:|:---:|:---:|
| 0 | 0 | 0 |
| 1 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 1 | 0 |

### 2.4.2 The Proof by Contradiction

#### Theorem: Linear Inseparability of XOR
There exist no real numbers $w_1, w_2, b \in \mathbb{R}$ such that the linear decision rule $\hat{y} = \mathbb{I}_{\{w_1 x_1 + w_2 x_2 + b \ge 0\}}$ satisfies the XOR truth table for all four input pairs $(x_1, x_2) \in \{0, 1\}^2$.

*Proof:*  
Assume for the sake of contradiction that such parameters $(w_1, w_2, b)$ exist.  
Translating each row of the XOR truth table into a strict algebraic inequality:

1. **Row 1 ($x_1 = 0, x_2 = 0 \implies y = 0$):**
   $$
   w_1(0) + w_2(0) + b < 0 \implies b < 0 \tag{Inequality 1}
   $$

2. **Row 2 ($x_1 = 1, x_2 = 0 \implies y = 1$):**
   $$
   w_1(1) + w_2(0) + b \ge 0 \implies w_1 + b \ge 0 \tag{Inequality 2}
   $$

3. **Row 3 ($x_1 = 0, x_2 = 1 \implies y = 1$):**
   $$
   w_1(0) + w_2(1) + b \ge 0 \implies w_2 + b \ge 0 \tag{Inequality 3}
   $$

4. **Row 4 ($x_1 = 1, x_2 = 1 \implies y = 0$):**
   $$
   w_1(1) + w_2(1) + b < 0 \implies w_1 + w_2 + b < 0 \tag{Inequality 4}
   $$

Now, sum Inequalities 2 and 3:
$$
(w_1 + b) + (w_2 + b) \ge 0 + 0
$$
$$
w_1 + w_2 + 2b \ge 0
$$
Rearrange this inequality by grouping $(w_1 + w_2 + b)$:
$$
(w_1 + w_2 + b) + b \ge 0
$$
$$
w_1 + w_2 + b \ge -b \tag{Inequality 5}
$$

From Inequality 1, we know that $b < 0$, which implies:
$$
-b > 0
$$
Substituting $-b > 0$ into Inequality 5:
$$
w_1 + w_2 + b \ge -b > 0 \implies w_1 + w_2 + b > 0
$$

However, Inequality 4 explicitly mandates that:
$$
w_1 + w_2 + b < 0
$$

We have deduced simultaneously that $w_1 + w_2 + b > 0$ and $w_1 + w_2 + b < 0$.  
This is a direct, unavoidable algebraic contradiction ($C < 0$ and $C > 0$).  
Therefore, our initial premise must be false: **no linear hyperplane can separate the XOR function.** $\blacksquare$

---

## 2.5 Resolution via Hidden Layers: The Multi-Layer Perceptron (MLP)

How does modern machine learning overcome this barrier? There are two dual mathematical solutions:
1. **Feature Space Warping (Kernel Method):** Lift the input coordinates into a higher-dimensional space where the points become linearly separable.
2. **Multi-Layer Composition (Deep Learning):** Pass the inputs through an intermediate **hidden layer** of neurons that performs non-linear coordinate transformations.

```
       Original Space (Non-separable)         Hidden Representation Space (Separable!)
             x2 ^                                    h2 ^ (NAND Output)
                |                                       |
              1 |  * (1,0)   o (1,1)                  1 |  * (0,1)    * (1,0)
                |                                       |
                |                                       |
              0 |  o (0,0)   * (0,1)                  0 |  o (0,0)    o (1,1)
                +-------------> x1                      +-------------> h1 (OR Output)
                   0       1                               0       1
               Diagonal Crossing                     Separable via line h1 + h2 = 1.5!
```

### 2.5.1 The Boolean Decomposition of XOR
Boolean algebra reveals that XOR can be decomposed into an aggregation of elementary separable operations:
$$
x_1 \oplus x_2 = (x_1 \lor x_2) \land \neg(x_1 \land x_2) = (x_1 \lor x_2) \land (x_1 \text{ NAND } x_2)
$$

Let us construct a 2-layer neural network with 2 hidden units and 1 output unit:
- **Hidden Neuron 1 ($h_1$):** Computes the OR function.
  $$
  h_1 = \text{step}(x_1 + x_2 - 0.5)
  $$
- **Hidden Neuron 2 ($h_2$):** Computes the NAND function.
  $$
  h_2 = \text{step}(-x_1 - x_2 + 1.5)
  $$
- **Output Neuron ($y$):** Computes the AND function on the hidden activations $(h_1, h_2)$:
  $$
  y = \text{step}(h_1 + h_2 - 1.5)
  $$

### 2.5.2 Tracking the Latent Space Transformation

| Input $(x_1, x_2)$ | True XOR $y$ | Hidden $h_1 = \text{OR}$ | Hidden $h_2 = \text{NAND}$ | Latent $(h_1, h_2)$ | Output $y = \text{AND}(h_1, h_2)$ |
|:---:|:---:|:---:|:---:|:---:|:---:|
| $(0, 0)$ | **0** | $0$ | $1$ | $(0, 1)$ | $\text{step}(0 + 1 - 1.5) = \mathbf{0}$ |
| $(1, 0)$ | **1** | $1$ | $1$ | $(1, 1)$ | $\text{step}(1 + 1 - 1.5) = \mathbf{1}$ |
| $(0, 1)$ | **1** | $1$ | $1$ | $(1, 1)$ | $\text{step}(1 + 1 - 1.5) = \mathbf{1}$ |
| $(1, 1)$ | **0** | $1$ | $0$ | $(1, 0)$ | $\text{step}(1 + 0 - 1.5) = \mathbf{0}$ |

Notice the miracle that occurred in the latent hidden space $\mathbf{h} = [h_1, h_2]^T$:
- The two positive points $(1, 0)$ and $(0, 1)$ were mapped to the **exact same latent point** $(1, 1)$!
- The negative points $(0, 0)$ and $(1, 1)$ were mapped to $(0, 1)$ and $(1, 0)$.
- In this new $(h_1, h_2)$ coordinate frame, the positive class $\{(1, 1)\}$ is cleanly linearly separable from the negative class $\{(0, 1), (1, 0)\}$ via the hyperplane $h_1 + h_2 = 1.5$!

The hidden layer has warped geometric space, untangling the knotted topology of XOR into clean linear separability.

---

## 2.6 Exactly 10 Worked Examples

### Worked Example 2.1: Derivation of the AND Decision Boundary
**Problem Statement:**  
Find a weight vector $\mathbf{w} = [w_1, w_2]^T$ and bias $b$ that satisfies the linear classification of the 2-input AND function with a geometric functional margin of at least $\gamma = 0.5$.

**Detailed Solution:**  
1. **Inequalities with Margin $\gamma = 0.5$:**
   - At $(0, 0), y = -1$: $-1(b) \ge 0.5 \implies b \le -0.5$.
   - At $(1, 0), y = -1$: $-1(w_1 + b) \ge 0.5 \implies w_1 + b \le -0.5$.
   - At $(0, 1), y = -1$: $-1(w_2 + b) \ge 0.5 \implies w_2 + b \le -0.5$.
   - At $(1, 1), y = +1$: $+1(w_1 + w_2 + b) \ge 0.5 \implies w_1 + w_2 + b \ge 0.5$.

2. **Symmetric Weight Choice:**
   By symmetry, let $w_1 = w_2 = w$.  
   The constraints become:
   $$
   b \le -0.5
   $$
   $$
   w + b \le -0.5 \implies w \le -0.5 - b
   $$
   $$
   2w + b \ge 0.5 \implies 2w \ge 0.5 - b \implies w \ge 0.25 - 0.5b
   $$

3. **Selecting Values:**
   Choose $b = -1.5$:
   - Upper bound on $w$: $w \le -0.5 - (-1.5) = 1.0$.
   - Lower bound on $w$: $w \ge 0.25 - 0.5(-1.5) = 0.25 + 0.75 = 1.0$.  
   Both bounds meet at $w = 1.0$.  
   Thus, $\mathbf{w} = [1, 1]^T, b = -1.5$.
   - At $(0, 0)$: $z = -1.5 \le -0.5$ (Margin satisfied).
   - At $(1, 0)$: $z = 1 - 1.5 = -0.5 \le -0.5$ (Margin satisfied).
   - At $(0, 1)$: $z = 1 - 1.5 = -0.5 \le -0.5$ (Margin satisfied).
   - At $(1, 1)$: $z = 2 - 1.5 = +0.5 \ge +0.5$ (Margin satisfied).

---

### Worked Example 2.2: Geometric Margin of the Optimal AND Hyperplane
**Problem Statement:**  
Compute the exact geometric margin $\gamma_{\text{geom}} = \min_i \frac{y_i (\mathbf{w}^T \mathbf{x}_i + b)}{\|\mathbf{w}\|_2}$ for the AND separator $\mathbf{w} = [1, 1]^T, b = -1.5$.

**Detailed Solution:**  
1. **Norm of $\mathbf{w}$:**
   $$
   \|\mathbf{w}\|_2 = \sqrt{1^2 + 1^2} = \sqrt{2}
   $$

2. **Signed Distances for Each Vertex:**
   - For $(0, 0)$ ($y = -1$):
     $$
     d_1 = \frac{-(-1.5)}{\sqrt{2}} = \frac{1.5}{\sqrt{2}} \approx 1.0607
     $$
   - For $(1, 0)$ ($y = -1$):
     $$
     d_2 = \frac{-(1(1) + 1(0) - 1.5)}{\sqrt{2}} = \frac{-(-0.5)}{\sqrt{2}} = \frac{0.5}{\sqrt{2}} \approx 0.3536
     $$
   - For $(0, 1)$ ($y = -1$):
     $$
     d_3 = \frac{-(1(0) + 1(1) - 1.5)}{\sqrt{2}} = \frac{0.5}{\sqrt{2}} \approx 0.3536
     $$
   - For $(1, 1)$ ($y = +1$):
     $$
     d_4 = \frac{+(1(1) + 1(1) - 1.5)}{\sqrt{2}} = \frac{0.5}{\sqrt{2}} \approx 0.3536
     $$

3. **Geometric Margin:**
   $$
   \gamma_{\text{geom}} = \min(d_1, d_2, d_3, d_4) = \frac{0.5}{\sqrt{2}} = \frac{\sqrt{2}}{4} \approx 0.35355\text{ units}
   $$

---

### Worked Example 2.3: Non-Linear Coordinate Lifting for XOR
**Problem Statement:**  
Consider the XOR points in $\mathbb{R}^2$: $(0, 0) \to 0, (1, 0) \to 1, (0, 1) \to 1, (1, 1) \to 0$.  
Define the non-linear polynomial feature mapping $\boldsymbol{\phi}: \mathbb{R}^2 \to \mathbb{R}^3$:
$$
\boldsymbol{\phi}(\mathbf{x}) = [x_1, \; x_2, \; x_1 x_2]^T
$$
1. Map all four XOR points into $\mathbb{R}^3$.
2. Find a linear hyperplane $\mathbf{w}^T \boldsymbol{\phi}(\mathbf{x}) + b = 0$ in $\mathbb{R}^3$ that perfectly separates the classes.

**Detailed Solution:**  
1. **Mapping to 3D:**
   - $\mathbf{x}_1 = [0, 0]^T \implies \boldsymbol{\phi}(\mathbf{x}_1) = [0, 0, 0]^T$, Class $0$.
   - $\mathbf{x}_2 = [1, 0]^T \implies \boldsymbol{\phi}(\mathbf{x}_2) = [1, 0, 0]^T$, Class $1$.
   - $\mathbf{x}_3 = [0, 1]^T \implies \boldsymbol{\phi}(\mathbf{x}_3) = [0, 1, 0]^T$, Class $1$.
   - $\mathbf{x}_4 = [1, 1]^T \implies \boldsymbol{\phi}(\mathbf{x}_4) = [1, 1, 1]^T$, Class $0$.

2. **Synthesizing Hyperplane $\mathbf{w} = [w_1, w_2, w_3]^T, b$:**
   The linear equation is $w_1 x_1 + w_2 x_2 + w_3 (x_1 x_2) + b = 0$.  
   Notice that for the positive points $\mathbf{x}_2, \mathbf{x}_3$, the sum $x_1 + x_2 = 1$, and $x_1 x_2 = 0$.  
   For $(1, 1)$, $x_1 + x_2 = 2$, but the interaction term $x_1 x_2 = 1$ is active!  
   We can penalize the interaction term by setting $w_3 < 0$:
   Let $w_1 = 1, w_2 = 1, w_3 = -2, b = -0.5$.

3. **Verification in $\mathbb{R}^3$:**
   - At $\boldsymbol{\phi}(\mathbf{x}_1) = [0, 0, 0]^T$:
     $$
     z = 1(0) + 1(0) - 2(0) - 0.5 = -0.5 < 0 \implies 0 \quad (\text{Correct})
     $$
   - At $\boldsymbol{\phi}(\mathbf{x}_2) = [1, 0, 0]^T$:
     $$
     z = 1(1) + 1(0) - 2(0) - 0.5 = +0.5 > 0 \implies 1 \quad (\text{Correct})
     $$
   - At $\boldsymbol{\phi}(\mathbf{x}_3) = [0, 1, 0]^T$:
     $$
     z = 1(0) + 1(1) - 2(0) - 0.5 = +0.5 > 0 \implies 1 \quad (\text{Correct})
     $$
   - At $\boldsymbol{\phi}(\mathbf{x}_4) = [1, 1, 1]^T$:
     $$
     z = 1(1) + 1(1) - 2(1) - 0.5 = 2 - 2 - 0.5 = -0.5 < 0 \implies 0 \quad (\text{Correct})
     $$
   The non-linear cross-term $x_1 x_2$ lifts the point $(1, 1)$ into the third dimension, allowing a flat 2D plane in $\mathbb{R}^3$ to slice between the classes!

---

### Worked Example 2.4: Convex Hulls and Linear Separability
**Problem Statement:**  
Let $S^+ = \{\mathbf{x}_1, \dots, \mathbf{x}_p\}$ and $S^- = \{\mathbf{z}_1, \dots, \mathbf{z}_q\}$ be two finite sets of points in $\mathbb{R}^d$.  
Recall that the convex hull $\text{conv}(S)$ is the set of all convex combinations:
$$
\text{conv}(S) = \left\{ \sum_{i=1}^m \alpha_i \mathbf{v}_i : \alpha_i \ge 0, \; \sum_{i=1}^m \alpha_i = 1 \right\}
$$
Prove the fundamental theorem of linear separability: $S^+$ and $S^-$ are strictly linearly separable if and only if their convex hulls are disjoint:
$$
\text{conv}(S^+) \cap \text{conv}(S^-) = \emptyset
$$

**Detailed Solution:**  
1. **Necessity ($\implies$):**  
   Suppose $S^+$ and $S^-$ are strictly separated by hyperplane $\mathbf{w}^T \mathbf{x} + b = 0$.  
   Then $\mathbf{w}^T \mathbf{x}_i + b > 0$ for all $\mathbf{x}_i \in S^+$, and $\mathbf{w}^T \mathbf{z}_j + b < 0$ for all $\mathbf{z}_j \in S^-$.  
   Let $\mathbf{u} \in \text{conv}(S^+)$, so $\mathbf{u} = \sum \alpha_i \mathbf{x}_i$ with $\sum \alpha_i = 1, \alpha_i \ge 0$.  
   Then:
   $$
   \mathbf{w}^T \mathbf{u} + b = \mathbf{w}^T \left(\sum \alpha_i \mathbf{x}_i\right) + b = \sum \alpha_i (\mathbf{w}^T \mathbf{x}_i + b) > 0
   $$
   Likewise, for any $\mathbf{v} \in \text{conv}(S^-)$, $\mathbf{w}^T \mathbf{v} + b < 0$.  
   Because $\mathbf{w}^T \mathbf{u} + b > 0$ for every $\mathbf{u} \in \text{conv}(S^+)$ and $\mathbf{w}^T \mathbf{v} + b < 0$ for every $\mathbf{v} \in \text{conv}(S^-)$, no point can belong to both sets: $\text{conv}(S^+) \cap \text{conv}(S^-) = \emptyset$.

2. **Sufficiency ($\impliedby$):**  
   Suppose $\text{conv}(S^+) \cap \text{conv}(S^-) = \emptyset$.  
   Because $S^+$ and $S^-$ are finite sets, their convex hulls $\text{conv}(S^+)$ and $\text{conv}(S^-)$ are compact (closed and bounded) and convex subsets of $\mathbb{R}^d$.  
   By the **Hyperplane Separation Theorem** (a foundational theorem of convex analysis), if two non-empty convex sets $A$ and $B$ in $\mathbb{R}^d$ are disjoint and compact, there exists a strictly separating hyperplane $H = \{\mathbf{x} : \mathbf{w}^T \mathbf{x} + b = 0\}$ such that:
   $$
   \sup_{\mathbf{x} \in A} (\mathbf{w}^T \mathbf{x} + b) < 0 < \inf_{\mathbf{z} \in B} (\mathbf{w}^T \mathbf{z} + b) \quad \blacksquare
   $$

---

### Worked Example 2.5: Convex Hull Intersection Proof for XOR
**Problem Statement:**  
Use the Convex Hull Disjointness Theorem (Worked Example 2.4) to provide an elegant, coordinate-free geometric proof of the inseparability of XOR.

**Detailed Solution:**  
1. **Define the Sets:**
   - $S^+ = \{(1, 0), (0, 1)\}$ (Positive Class)
   - $S^- = \{(0, 0), (1, 1)\}$ (Negative Class)

2. **Compute Convex Hulls:**
   - $\text{conv}(S^+)$ is the line segment connecting $(1, 0)$ and $(0, 1)$:
     $$
     \text{conv}(S^+) = \{ \alpha(1, 0) + (1 - \alpha)(0, 1) : 0 \le \alpha \le 1 \} = \{ (\alpha, 1 - \alpha) : 0 \le \alpha \le 1 \}
     $$
   - $\text{conv}(S^-)$ is the line segment connecting $(0, 0)$ and $(1, 1)$:
     $$
     \text{conv}(S^-) = \{ \beta(0, 0) + (1 - \beta)(1, 1) : 0 \le \beta \le 1 \} = \{ (1 - \beta, 1 - \beta) : 0 \le \beta \le 1 \}
     $$

3. **Check for Intersection:**
   Set the coordinates equal:
   $$
   \alpha = 1 - \beta
   $$
   $$
   1 - \alpha = 1 - \beta \implies \alpha = \beta
   $$
   Substituting $\beta = \alpha$ into $\alpha = 1 - \beta$:
   $$
   \alpha = 1 - \alpha \implies 2\alpha = 1 \implies \alpha = 0.5
   $$
   Since $\alpha = 0.5 \in [0, 1]$, the intersection occurs at point:
   $$
   \mathbf{p}^* = (0.5, 0.5)
   $$
   Notice that $(0.5, 0.5) = \frac{1}{2}(1, 0) + \frac{1}{2}(0, 1) \in \text{conv}(S^+)$, and $(0.5, 0.5) = \frac{1}{2}(0, 0) + \frac{1}{2}(1, 1) \in \text{conv}(S^-)$.  
   Because $\text{conv}(S^+) \cap \text{conv}(S^-) = \{(0.5, 0.5)\} \neq \emptyset$, the convex hulls intersect.  
   By the Hyperplane Separation Theorem, **XOR is strictly non-separable by any linear classifier**.

---

### Worked Example 2.6: 3D Decision Plane Distance Evaluation
**Problem Statement:**  
A linear decision boundary in 3D feature space is given by $2x_1 - 4x_2 + 4x_3 - 10 = 0$.  
1. Find the unit normal $\hat{\mathbf{w}}$.
2. Determine whether the point $\mathbf{x}_A = [3, 1, 2]^T$ and $\mathbf{x}_B = [1, 2, 0]^T$ lie on the same side of the decision boundary.
3. Compute the exact perpendicular distance from $\mathbf{x}_A$ to the boundary.

**Detailed Solution:**  
1. **Unit Normal:**
   Weight vector $\mathbf{w} = [2, -4, 4]^T$.  
   $$
   \|\mathbf{w}\|_2 = \sqrt{2^2 + (-4)^2 + 4^2} = \sqrt{4 + 16 + 16} = \sqrt{36} = 6
   $$
   $$
   \hat{\mathbf{w}} = \frac{1}{6} \begin{bmatrix} 2 \\ -4 \\ 4 \end{bmatrix} = \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix}
   $$

2. **Evaluating Side (Sign of $z$):**
   - For $\mathbf{x}_A = [3, 1, 2]^T$:
     $$
     z_A = 2(3) - 4(1) + 4(2) - 10 = 6 - 4 + 8 - 10 = 0
     $$
     $z_A = 0$, which means $\mathbf{x}_A$ lies **directly on** the decision boundary!
   - For $\mathbf{x}_B = [1, 2, 0]^T$:
     $$
     z_B = 2(1) - 4(2) + 4(0) - 10 = 2 - 8 + 0 - 10 = -16 < 0
     $$
     $\mathbf{x}_B$ lies in the negative half-space.

3. **Perpendicular Distance:**
   $$
   \text{dist}(\mathbf{x}_A, H) = \frac{|z_A|}{\|\mathbf{w}\|_2} = \frac{0}{6} = 0\text{ units}
   $$

---

### Worked Example 2.7: Linear Separability of Bipolar Coordinates
**Problem Statement:**  
Re-evaluate the XOR problem under bipolar encoding: inputs $x_i \in \{-1, +1\}$ and target labels $y \in \{-1, +1\}$ where $y = -x_1 x_2$.  
Prove that bipolar XOR remains linearly inseparable.

**Detailed Solution:**  
1. **Truth Table under Bipolar Encoding:**
   - $\mathbf{x}_1 = (-1, -1) \implies y_1 = -(-1)(-1) = -1$
   - $\mathbf{x}_2 = (+1, -1) \implies y_2 = -(+1)(-1) = +1$
   - $\mathbf{x}_3 = (-1, +1) \implies y_3 = -(-1)(+1) = +1$
   - $\mathbf{x}_4 = (+1, +1) \implies y_4 = -(+1)(+1) = -1$

2. **System of Inequalities:**
   - Row 1: $-(-w_1 - w_2 + b) > 0 \implies w_1 + w_2 - b > 0$
   - Row 2: $+(w_1 - w_2 + b) > 0 \implies w_1 - w_2 + b > 0$
   - Row 3: $+(-w_1 + w_2 + b) > 0 \implies -w_1 + w_2 + b > 0$
   - Row 4: $-(w_1 + w_2 + b) > 0 \implies -w_1 - w_2 - b > 0$

3. **Summing Contradiction:**
   Summing Rows 2 and 3:
   $$
   (w_1 - w_2 + b) + (-w_1 + w_2 + b) > 0 + 0 \implies 2b > 0 \implies b > 0
   $$
   Summing Rows 1 and 4:
   $$
   (w_1 + w_2 - b) + (-w_1 - w_2 - b) > 0 + 0 \implies -2b > 0 \implies b < 0
   $$
   We obtain $b > 0$ and $b < 0$, an immediate algebraic contradiction. Linear inseparability is an intrinsic topological property, completely invariant to binary vs bipolar coordinate labeling.

---

### Worked Example 2.8: Circular Boundary via Quadratic Mapping
**Problem Statement:**  
Points inside a disk of radius $R = 2$ belong to Class $+1$ ($x_1^2 + x_2^2 \le 4$), while points outside belong to Class $-1$ ($x_1^2 + x_2^2 > 4$).  
1. Explain why this dataset is not linearly separable in $\mathbb{R}^2$.
2. Formulate a quadratic feature map $\boldsymbol{\phi}(\mathbf{x}) = [u_1, u_2]^T = [x_1^2, x_2^2]^T$ and write the linear equation in $(u_1, u_2)$ space.

**Detailed Solution:**  
1. **Non-Separability in $\mathbb{R}^2$:**
   Consider the origin $(0, 0)$ (Class $+1$). The points $(3, 0), (-3, 0), (0, 3), (0, -3)$ all belong to Class $-1$.  
   The origin lies in the convex hull of the negative points:
   $$
   (0, 0) = \frac{1}{4}(3, 0) + \frac{1}{4}(-3, 0) + \frac{1}{4}(0, 3) + \frac{1}{4}(0, -3) \in \text{conv}(S^-)
   $$
   Since the convex hulls overlap, no straight line in $\mathbb{R}^2$ can separate them.

2. **Feature Mapping:**
   Let $u_1 = x_1^2 \ge 0$ and $u_2 = x_2^2 \ge 0$.  
   The boundary condition $x_1^2 + x_2^2 = 4$ becomes:
   $$
   u_1 + u_2 = 4 \implies u_1 + u_2 - 4 = 0
   $$
   In the $(u_1, u_2)$ plane, this is a standard linear equation with normal $\mathbf{w} = [1, 1]^T$ and bias $b = -4$. Points with $u_1 + u_2 < 4$ lie on the negative side, and points with $u_1 + u_2 > 4$ lie on the positive side.

---

### Worked Example 2.9: Minimum Number of Hidden Units to Classify a Convex Polygon
**Problem Statement:**  
Suppose Class $+1$ is bounded inside a convex polygon with $K$ edges in $\mathbb{R}^2$, and Class $-1$ is the exterior.  
Prove that a 2-layer network requires at most $K$ hidden units and $1$ output unit to classify this region.

**Detailed Solution:**  
1. **Convex Polygon as an Intersection of Half-Spaces:**
   By definition, every convex polygon $P \subset \mathbb{R}^2$ with $K$ edges is the intersection of $K$ half-spaces:
   $$
   P = \bigcap_{j=1}^K \{\mathbf{x} \in \mathbb{R}^2 : \mathbf{w}_j^T \mathbf{x} + b_j \ge 0\}
   $$

2. **Hidden Layer Construction:**
   Assign one hidden neuron to each bounding edge $j \in \{1, \dots, K\}$:
   $$
   h_j = \text{step}(\mathbf{w}_j^T \mathbf{x} + b_j) = \begin{cases} 1 & \text{if } \mathbf{x} \text{ is on interior side of edge } j \\ 0 & \text{otherwise} \end{cases}
   $$

3. **Output Layer Construction:**
   A point $\mathbf{x}$ lies inside the polygon if and only if **all $K$ hidden neurons fire** ($h_j = 1$ for all $j$):
   $$
   \sum_{j=1}^K h_j = K
   $$
   The output neuron computes a $K$-input AND gate:
   $$
   y = \text{step}\left( \sum_{j=1}^K h_j - K + 0.5 \right)
   $$
   If all $K$ are active, sum is $K - K + 0.5 = 0.5 > 0 \implies y = 1$.  
   If even one edge is violated, sum is at most $(K - 1) - K + 0.5 = -0.5 < 0 \implies y = 0$.  
   Thus, exactly $K$ hidden units suffice.

---

### Worked Example 2.10: Perceptron Learning Trace on Non-Separable Data
**Problem Statement:**  
Demonstrate the oscillation of the Perceptron on the XOR dataset by tracing 4 update steps starting from $\mathbf{w} = [0, 0]^T, b = 0$ with $\eta = 1$.

**Detailed Solution:**  
Dataset:
- $\mathbf{x}_1 = [0, 0]^T, y_1 = -1$
- $\mathbf{x}_2 = [1, 0]^T, y_2 = +1$
- $\mathbf{x}_3 = [0, 1]^T, y_3 = +1$
- $\mathbf{x}_4 = [1, 1]^T, y_4 = -1$

1. **Step 1: Present $\mathbf{x}_1 = [0, 0]^T, y_1 = -1$:**
   $z_1 = 0 \implies$ Error!  
   $\mathbf{w} \leftarrow \mathbf{0} + (-1)[0, 0]^T = [0, 0]^T$.  
   $b \leftarrow 0 + (-1) = -1$.

2. **Step 2: Present $\mathbf{x}_2 = [1, 0]^T, y_2 = +1$:**
   $z_2 = 0(1) + 0(0) - 1 = -1 < 0$. True label is $+1 \implies$ Error!  
   $\mathbf{w} \leftarrow [0, 0]^T + (+1)[1, 0]^T = [1, 0]^T$.  
   $b \leftarrow -1 + 1 = 0$.

3. **Step 3: Present $\mathbf{x}_3 = [0, 1]^T, y_3 = +1$:**
   $z_3 = 1(0) + 0(1) + 0 = 0 \implies$ Error!  
   $\mathbf{w} \leftarrow [1, 0]^T + (+1)[0, 1]^T = [1, 1]^T$.  
   $b \leftarrow 0 + 1 = 1$.

4. **Step 4: Present $\mathbf{x}_4 = [1, 1]^T, y_4 = -1$:**
   $z_4 = 1(1) + 1(1) + 1 = 3 > 0$. True label is $-1 \implies$ Error!  
   $\mathbf{w} \leftarrow [1, 1]^T + (-1)[1, 1]^T = [0, 0]^T$.  
   $b \leftarrow 1 - 1 = 0$.

Notice that after 4 updates, the state has returned to **$\mathbf{w} = [0, 0]^T, b = 0$**, proving that the weights cycle endlessly.

---

## 2.7 Exactly 10 Solved Exercises

### Exercise 2.1: Algebraic Proof of XNOR Inseparability
**Problem Statement:**  
The XNOR function evaluates to $1$ when $x_1 = x_2$ and $0$ when $x_1 \neq x_2$.  
Prove algebraically that XNOR is not linearly separable.

**Detailed Solution:**  
1. **Inequalities:**
   - $(0, 0) \to 1 \implies b \ge 0$
   - $(1, 0) \to 0 \implies w_1 + b < 0$
   - $(0, 1) \to 0 \implies w_2 + b < 0$
   - $(1, 1) \to 1 \implies w_1 + w_2 + b \ge 0$

2. **Summing:**
   Summing the middle two inequalities:
   $$
   (w_1 + b) + (w_2 + b) < 0 + 0 \implies w_1 + w_2 + 2b < 0
   $$
   $$
   (w_1 + w_2 + b) + b < 0 \implies w_1 + w_2 + b < -b
   $$
   Since $b \ge 0$, $-b \le 0$, which implies $w_1 + w_2 + b < 0$.  
   This directly contradicts $w_1 + w_2 + b \ge 0$.  
   Thus, XNOR cannot be computed by a linear threshold unit. $\blacksquare$

---

### Exercise 2.2: 3-Input Parity Function Linear Complexity
**Problem Statement:**  
Consider the 3-input parity function $f(x_1, x_2, x_3) = x_1 \oplus x_2 \oplus x_3$.  
Show that this function partitions the 8 vertices of the 3D unit cube into two interlocked tetrahedra whose convex hulls share the central point $(0.5, 0.5, 0.5)$, proving inseparability.

**Detailed Solution:**  
1. **Vertices of Each Class:**
   - Class $+1$ (odd parity): $\{(1, 0, 0), (0, 1, 0), (0, 0, 1), (1, 1, 1)\}$
   - Class $0$ (even parity): $\{(0, 0, 0), (1, 1, 0), (1, 0, 1), (0, 1, 1)\}$

2. **Center of Mass (Centroid) of Class $+1$:**
   $$
   \mathbf{c}^+ = \frac{1}{4} \left( [1, 0, 0]^T + [0, 1, 0]^T + [0, 0, 1]^T + [1, 1, 1]^T \right) = \frac{1}{4} [2, 2, 2]^T = [0.5, 0.5, 0.5]^T
   $$

3. **Center of Mass (Centroid) of Class $0$:**
   $$
   \mathbf{c}^- = \frac{1}{4} \left( [0, 0, 0]^T + [1, 1, 0]^T + [1, 0, 1]^T + [0, 1, 1]^T \right) = \frac{1}{4} [2, 2, 2]^T = [0.5, 0.5, 0.5]^T
   $$
   Because both centroids are identical ($\mathbf{c}^+ = \mathbf{c}^- = [0.5, 0.5, 0.5]^T$), the center of the unit cube belongs to both convex hulls:
   $$
   [0.5, 0.5, 0.5]^T \in \text{conv}(S^+) \cap \text{conv}(S^-)
   $$
   The convex hulls intersect, proving 3-input parity is linearly inseparable.

---

### Exercise 2.3: Non-Linear Coordinate Map for Concentric Rings
**Problem Statement:**  
Let $S_1 = \{\mathbf{x} : 1 \le \|\mathbf{x}\|_2 \le 2\}$ and $S_2 = \{\mathbf{x} : 3 \le \|\mathbf{x}\|_2 \le 4\}$.  
Propose a 1D scalar feature transformation $\phi(\mathbf{x})$ that renders these concentric 2D rings linearly separable.

**Detailed Solution:**  
1. **Radius Transformation:**
   Define $\phi(\mathbf{x}) = \|\mathbf{x}\|_2 = \sqrt{x_1^2 + x_2^2}$.

2. **1D Linear Separation:**
   - Under this mapping, all points in $S_1$ map to the interval $[1, 2]$.
   - All points in $S_2$ map to the interval $[3, 4]$.
   - The two 1D intervals $[1, 2]$ and $[3, 4]$ are completely disjoint.  
   Any threshold $\theta \in (2, 3)$ (for instance, $\theta = 2.5$) provides a linear separator:
   $$
   y = \text{step}(\theta - \phi(\mathbf{x})) = \text{step}(2.5 - \|\mathbf{x}\|_2)
   $$
   Points in $S_1$ output $+1$, and points in $S_2$ output $0$.

---

### Exercise 2.4: Minimum Number of Hyperplanes to Isolate a Single Point
**Problem Statement:**  
In $\mathbb{R}^d$, what is the minimum number of hyperplanes needed to enclose a bounded region isolating a single target point from the rest of space?

**Detailed Solution:**  
1. **Geometric Simplex:**
   To form a bounded (closed) polytope in $\mathbb{R}^d$, the boundary must have facets in every direction so that no infinite rays escape.  
   The minimal polytope with non-empty interior in $\mathbb{R}^d$ is a **simplex**, which possesses exactly **$d + 1$ facets**.
   - In 1D: A line segment is bounded by 2 points ($d + 1 = 2$).
   - In 2D: A triangle is bounded by 3 lines ($d + 1 = 3$).
   - In 3D: A tetrahedron is bounded by 4 planes ($d + 1 = 4$).
   Therefore, at least $d + 1$ hyperplanes (and thus $d + 1$ hidden neurons) are required to form a bounded receptive field around a point in $\mathbb{R}^d$.

---

### Exercise 2.5: Linearly Separable Subsets of the 3D Cube
**Problem Statement:**  
Using Cover's theorem $C(n, d) = 2 \sum_{i=0}^d \binom{n-1}{i}$, calculate the fraction of all possible $2^8 = 256$ binary functions on the 3D unit cube that are linearly separable.

**Detailed Solution:**  
1. **Cover's Formula for $n = 8$ and $d = 3$:**
   $$
   C(8, 3) = 2 \left[ \binom{7}{0} + \binom{7}{1} + \binom{7}{2} + \binom{7}{3} \right]
   $$
   Computing the binomial coefficients:
   $$
   \binom{7}{0} = 1, \quad \binom{7}{1} = 7, \quad \binom{7}{2} = \frac{7 \times 6}{2} = 21, \quad \binom{7}{3} = \frac{7 \times 6 \times 5}{6} = 35
   $$
   Sum:
   $$
   1 + 7 + 21 + 35 = 64
   $$
   Multiplying by 2:
   $$
   C(8, 3) = 2 \times 64 = 128
   $$

2. **Fraction of Separable Functions:**
   Total functions: $2^8 = 256$.  
   Fraction:
   $$
   \frac{C(8, 3)}{256} = \frac{128}{256} = 0.50 \; (50\%)
   $$
   Exactly half of all 3-variable Boolean functions are linearly separable; the other $50\%$ require multi-layer networks.

---

### Exercise 2.6: Rotation of Hyperplane Coordinate System
**Problem Statement:**  
Given hyperplane $x_1 + x_2 = 2$ in $\mathbb{R}^2$, find a $2 \times 2$ orthogonal rotation matrix $\mathbf{R}$ that rotates the coordinates such that the decision boundary is parallel to the new $u_2$-axis (i.e., depends only on $u_1$).

**Detailed Solution:**  
1. **Normal Vector:**
   $\mathbf{w} = [1, 1]^T$, with angle $\theta = 45^\circ = \pi/4$.  
   We want the new normal to lie along the $u_1$-axis: $\mathbf{w}' = [\|\mathbf{w}\|_2, 0]^T = [\sqrt{2}, 0]^T$.

2. **Rotation Matrix:**
   To align the vector at $45^\circ$ with the horizontal axis, rotate by $-\pi/4$:
   $$
   \mathbf{R} = \begin{bmatrix} \cos(-\pi/4) & -\sin(-\pi/4) \\ \sin(-\pi/4) & \cos(-\pi/4) \end{bmatrix} = \begin{bmatrix} \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\ -\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \end{bmatrix}
   $$

3. **Transformed Hyperplane:**
   Let $\mathbf{u} = \mathbf{R} \mathbf{x}$. Then:
   $$
   u_1 = \frac{x_1 + x_2}{\sqrt{2}} \implies x_1 + x_2 = \sqrt{2} u_1
   $$
   Substituting into $x_1 + x_2 = 2$:
   $$
   \sqrt{2} u_1 = 2 \implies u_1 = \sqrt{2}
   $$
   The boundary is now the vertical line $u_1 = \sqrt{2}$, completely independent of $u_2$.

---

### Exercise 2.7: Linear Threshold Unit for Bounded Interval in 1D
**Problem Statement:**  
Show how two 1D threshold units in a hidden layer combined by an output AND unit can classify the interval $x \in [2, 5]$ as $+1$ and all other real numbers as $0$.

**Detailed Solution:**  
1. **Hidden Units:**
   - Unit 1: Fires if $x \ge 2$:
     $$
     h_1 = \text{step}(x - 2)
     $$
   - Unit 2: Fires if $x \le 5 \iff -x \ge -5$:
     $$
     h_2 = \text{step}(-x + 5)
     $$

2. **Output Unit (Logical AND):**
   $$
   y = \text{step}(h_1 + h_2 - 1.5)
   $$
   - If $x \in [2, 5]$: $h_1 = 1$ and $h_2 = 1 \implies 1 + 1 - 1.5 = 0.5 > 0 \implies y = 1$.
   - If $x < 2$: $h_1 = 0 \implies y = 0$.
   - If $x > 5$: $h_2 = 0 \implies y = 0$.

---

### Exercise 2.8: Support Vector Machine (SVM) Maximum Margin Hyperplane
**Problem Statement:**  
For the dataset $S^+ = \{(2, 2)\}$, $S^- = \{(0, 0)\}$, find the unique hyperplane that maximizes the geometric margin $\gamma$.

**Detailed Solution:**  
1. **Line Connecting the Points:**
   The vector connecting $(0, 0)$ to $(2, 2)$ is $\mathbf{v} = [2, 2]^T$.  
   The midpoint of the segment is:
   $$
   \mathbf{m} = \frac{(0, 0) + (2, 2)}{2} = (1, 1)
   $$

2. **Maximum Margin Hyperplane Orientation:**
   The maximum margin hyperplane is perpendicular to the line segment connecting the closest points and passes through its midpoint.  
   Normal: $\mathbf{w} = [1, 1]^T$.  
   Equation: $\mathbf{w}^T (\mathbf{x} - \mathbf{m}) = 0 \implies 1(x_1 - 1) + 1(x_2 - 1) = 0 \implies x_1 + x_2 - 2 = 0$.

3. **Margin Value:**
   The distance between $(0, 0)$ and $(2, 2)$ is $\sqrt{2^2 + 2^2} = \sqrt{8} = 2\sqrt{2}$.  
   The margin is half this distance:
   $$
   \gamma = \frac{2\sqrt{2}}{2} = \sqrt{2} \approx 1.4142\text{ units}
   $$

---

### Exercise 2.9: Failure of Perceptron on Non-Separable Rings
**Problem Statement:**  
Explain why a Perceptron trained with the Pocket Algorithm on concentric rings will typically degenerate into predicting the majority class everywhere.

**Detailed Solution:**  
1. **Area / Count Dominance:**
   Suppose an inner ring has $N_{\text{inner}} = 100$ points (Class $+1$) and an outer ring has $N_{\text{outer}} = 400$ points (Class $-1$).

2. **Linear Cut Constraint:**
   Any straight line drawn through the 2D plane divides the outer ring into two halves. A line passing through the center cuts the inner ring in half ($50/50$) and the outer ring in half ($200/200$), yielding a total accuracy of at most $\frac{50 + 200}{500} = 50\%$.

3. **Trivial Majority Class Solution:**
   If the hyperplane is pushed completely outside the bounding box ($b \to -\infty$), it predicts Class $-1$ for all points:
   $$
   \text{Accuracy} = \frac{400}{500} = 80\%
   $$
   Because $80\% > 50\%$, the Pocket Algorithm’s objective (which minimizes total misclassification count) prefers the trivial constant-output degenerate classifier over any linear cut!

---

### Exercise 2.10: Diameter-Limited Perceptrons and Global Connectivity
**Problem Statement:**  
Summarize the core mathematical reasoning behind Minsky and Papert's proof that a perceptron whose inputs can each access only a local disk of diameter $D$ cannot decide whether a binary black-and-white image consists of a single connected component.

**Detailed Solution:**  
1. **Local Receptive Field Definition:**
   In a diameter-limited perceptron, each predicate neuron $\phi_j(\mathbf{x})$ depends on pixels within a circular window of diameter at most $D$.

2. **Topological Equivalence of Disconnected Loops:**
   Consider two configurations:
   - Config $A$: Two intertwined closed loops that are disconnected.
   - Config $B$: Two loops connected by a single microscopic 1-pixel bridge.
   To determine if the figure is connected, the network must trace the entire perimeter of the loop. If the perimeter exceeds $D$, no single local predicate $\phi_j$ can determine whether a path from pixel $p$ to pixel $q$ closes on itself or connects to the other loop.

3. **Linear Sum Inability to Perform Transitive Closure:**
   Connectivity is a topological property involving the transitive closure of adjacency ($A \sim B$ and $B \sim C \implies A \sim C$). A linear combination $\sum w_j \phi_j$ can only compute additive local counts; it cannot evaluate graph connectivity without access to global chain products. Thus, deep hierarchical architectures are mathematically mandatory for topological perception.
