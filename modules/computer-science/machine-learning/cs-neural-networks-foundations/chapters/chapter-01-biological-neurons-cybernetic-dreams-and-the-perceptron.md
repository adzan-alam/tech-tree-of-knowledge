# Chapter 1: The Layman's Genesis: Biological Neurons, Cybernetic Dreams, and the Perceptron

> *"The brain is a tissue of billions of tiny computational elements, each operating in an ocean of noise, yet collaborating to produce the symphonic miracle of thought. If we can isolate the fundamental calculus of the single neuron, we can build machines that learn, adapt, and reason."*  
> — **Warren McCulloch & Walter Pitts**, *A Logical Calculus of the Ideas Immanent in Nervous Activity* (1943)

---

## 1.1 Biological vs. Artificial Neurons: The Cybernetic Abstraction

For centuries, natural philosophers and physicists sought to comprehend the biological apparatus of human consciousness. In 1888, the Spanish neuroanatomist Santiago Ramón y Cajal, utilizing Camillo Golgi’s silver-nitrate staining technique, revealed under his microscope that the nervous system was not a continuous, diffuse network (as previously believed), but an assembly of discrete, individual cellular entities: **neurons**.

### 1.1.1 The Anatomy of the Biological Neuron

A biological neuron is a specialized biological cell consisting of four primary structural components:
1. **Dendrites (Input Channels):** A dense, branching arborization of cellular filaments that receive electrochemical signals from upstream neurons via synaptic junctions.
2. **Soma (Integration Center / Cell Body):** The central metabolic engine containing the cell nucleus. The soma integrates incoming chemical signals, accumulating an electrical potential across its lipid bilayer cell membrane.
3. **Axon (Transmission Line):** A long, slender cylindrical conduit—frequently insulated by a myelin sheath to accelerate signal propagation—that conducts action potential spikes away from the soma toward target cells over distances ranging from micrometers to meters.
4. **Synapses (Programmable Junctions):** Specialized biochemical junctions separating the axon terminals of a presynaptic neuron from the dendrites of a postsynaptic neuron. When an action potential reaches a synapse, it triggers the release of neurotransmitter molecules across the synaptic cleft, altering the postsynaptic membrane conductance. Synapses can be **excitatory** (depolarizing the membrane, increasing firing probability) or **inhibitory** (hyperpolarizing the membrane, suppressing firing).

```
          Biological Neuron vs. Artificial Computational Model
          
   [Dendrites]                [Soma]                [Axon]             [Synapses]
   (Inputs x_i)        (Summation \sum w_i x_i) (Activation f(z))  (Output y to next)
       \                     +-------+
   x1 --\-(w1)-------------> |       |
         \                   |       |
   x2 ----(w2)-------------> | \sum  | ------> [ Threshold ] --------> y
         /                   | + b   |         [ Activation]
   x3 --/-(w3)-------------> |       |
       /                     +-------+
```

### 1.1.2 Electrophysiology of the Action Potential

At rest, a neuron maintains an electrical potential difference of approximately $-70\text{ mV}$ across its membrane, sustained by adenosine triphosphate (ATP)-driven sodium-potassium pumps ($\text{Na}^+/\text{K}^+$ pumps). Incoming excitatory signals depolarize the membrane (moving the voltage toward zero). 

If the cumulative membrane potential reaches a critical threshold—typically around $-55\text{ mV}$—voltage-gated sodium channels burst open in a positive feedback cascade. The membrane voltage shoots rapidly upward to $+40\text{ mV}$, generating an **action potential** (a discrete voltage spike). Following the spike, potassium channels open, rapidly repolarizing the cell below its resting potential (the refractory period).

Crucially, the biological action potential is an **all-or-none phenomenon**:
- If the integrated potential fails to reach the threshold, no spike occurs ($0$).
- If the potential exceeds the threshold, a full-amplitude spike occurs ($1$).

The intensity of a biological stimulus is encoded not in the voltage amplitude of individual spikes, but in the **firing frequency** (rate coding).

---

## 1.2 The McCulloch-Pitts Formal Neuron (1943)

In their seminal 1943 paper, neurophysiologist Warren McCulloch and logician Walter Pitts distilled this complex biological electrochemistry into an austere mathematical model: the **threshold logic unit (TLU)**.

### 1.2.1 Mathematical Formulation

Let $\mathbf{x} = [x_1, x_2, \dots, x_n]^T$ be an input vector where each input $x_i \in \{0, 1\}$ represents the absence or presence of an incoming spike. The inputs are partitioned into two disjoint sets:
1. **Excitatory inputs** $\mathcal{E}$ with positive binary weights.
2. **Inhibitory inputs** $\mathcal{I}$ that possess absolute veto power.

The McCulloch-Pitts neuron calculates the net excitatory excitation:
$$
z = \sum_{i \in \mathcal{E}} x_i
$$
The output $y \in \{0, 1\}$ is governed by the deterministic rule:
$$
y = \begin{cases}
1 & \text{if } \sum_{i \in \mathcal{E}} x_i \ge \theta \quad \text{and} \quad \sum_{j \in \mathcal{I}} x_j = 0 \\
0 & \text{otherwise}
\end{cases}
$$
where $\theta \in \mathbb{N}$ is a fixed integer threshold. If even a single inhibitory input fires ($\sum_{j \in \mathcal{I}} x_j > 0$), the neuron is completely silenced ($y = 0$), regardless of the magnitude of excitatory stimulation.

### 1.2.2 Boolean Function Equivalence

McCulloch and Pitts proved a profound philosophical theorem: **a network of such threshold units can compute any finite logical proposition.**

#### 1. Logical Conjunction ($\text{AND}(x_1, x_2)$):
Let both inputs be excitatory ($\mathcal{E} = \{1, 2\}, \mathcal{I} = \emptyset$). Set threshold $\theta = 2$:
$$
y = \mathbb{I}_{\{x_1 + x_2 \ge 2\}}
$$
- If $(x_1, x_2) = (1, 1) \implies 1 + 1 = 2 \ge 2 \implies y = 1$.
- If $(x_1, x_2) = (1, 0) \implies 1 + 0 = 1 < 2 \implies y = 0$.

#### 2. Logical Disjunction ($\text{OR}(x_1, x_2)$):
Let $\mathcal{E} = \{1, 2\}, \mathcal{I} = \emptyset$. Set threshold $\theta = 1$:
$$
y = \mathbb{I}_{\{x_1 + x_2 \ge 1\}}
$$
- Fires if at least one input is active.

#### 3. Logical Negation ($\text{NOT}(x_1)$):
Use an auxiliary always-on excitatory input $x_0 = 1$ with threshold $\theta = 1$, and let $x_1$ be inhibitory ($\mathcal{I} = \{1\}$):
$$
y = \begin{cases} 1 & \text{if } x_0 \ge 1 \text{ and } x_1 = 0 \\ 0 & \text{if } x_1 = 1 \end{cases}
$$

Because $\{\text{AND}, \text{OR}, \text{NOT}\}$ forms a functionally complete Boolean basis, any combinatorial logic circuit—and by extension, any digital computer—can be synthesized from interconnected McCulloch-Pitts neurons.

However, the McCulloch-Pitts model had a fatal limitation: **it possessed no learning mechanism**. The weights and thresholds had to be manually engineered by a human logician.

---

## 1.3 Hebbian Learning (1949): Synaptic Plasticity

In 1949, Canadian neuropsychologist Donald Hebb published *The Organization of Behavior*, introducing the foundational rule of biological and computational synaptic plasticity:

> *"When an axon of cell A is near enough to excite a cell B and repeatedly or persistently takes part in firing it, some growth process or metabolic change takes place in one or both cells such that A's efficiency, as one of the cells firing B, is increased."*

### 1.3.1 Mathematical Formalization of Hebb's Postulate

In modern computational neuroscience and machine learning, Hebb's physiological postulate is formalized as an unsupervised correlation learning rule. Let $x_i$ be the activation of presynaptic neuron $i$, and let $y$ be the activation of postsynaptic neuron $j$. The change in synaptic weight $\Delta w_{ij}$ across a discrete learning step is proportional to the product of their concurrent activities:
$$
\Delta w_{ij} = \eta \, x_i \, y
$$
where $\eta > 0$ is the learning rate.

```
                  Hebbian Plasticity Mechanism
             Presynaptic Neuron x_i --------+
                                            |
                                            v  (Synapse w_ij)
                                            |  Delta w_ij = eta * x_i * y
                                            |
             Postsynaptic Neuron y <--------+
             Co-activation -> Synaptic Strengthening
```

### 1.3.2 The Instability of Pure Hebbian Learning and Oja's Normalization

Pure Hebbian learning suffers from an intrinsic positive feedback instability. If $w_{ij} > 0$, an active presynaptic input $x_i$ increases the postsynaptic activation $y$, which in turn increases $w_{ij}$ via $\Delta w_{ij} = \eta x_i y > 0$. Over repeated iterations, the weights grow without bound:
$$
\lim_{t \to \infty} \|\mathbf{w}(t)\| = \infty
$$

In 1982, Erkki Oja resolved this divergence by introducing a continuous weight-decay normalization term derived from Taylor expansion:
$$
\Delta \mathbf{w} = \eta \, y \, (\mathbf{x} - y \, \mathbf{w})
$$
Oja's Rule guarantees that the weight vector remains bounded ($\|\mathbf{w}\|_2 \to 1$) and mathematically proves that a single linear Hebbian neuron performs **Principal Component Analysis (PCA)**, converging to the eigenvector corresponding to the largest eigenvalue of the input covariance matrix $\mathbb{E}[\mathbf{x}\mathbf{x}^T]$!

---

## 1.4 Frank Rosenblatt's Perceptron (1958)

The birth of true machine learning occurred in 1958 when Frank Rosenblatt, a research psychologist at the Cornell Aeronautical Laboratory, unveiled the **Perceptron**. 

Rosenblatt replaced the static thresholds and binary constraints of McCulloch and Pitts with **continuous real-valued weights that adjust automatically from empirical classification errors**.

### 1.4.1 Architectural Model of the Perceptron

The classical Rosenblatt perceptron maps an input vector $\mathbf{x} \in \mathbb{R}^d$ to a binary classification label $y \in \{-1, +1\}$ (or $\{0, 1\}$).

```
                    The Rosenblatt Perceptron Model
     Inputs            Weights           Summation         Activation
      x1 ------------> ( w1 ) -------\
      x2 ------------> ( w2 ) -------->  z = w^T x + b ---> [ Heaviside ] ---> y_hat in {-1, +1}
      ..                               /                     [ Step f(z)]
      xd ------------> ( wd ) -------/
     Bias 1 ---------> (  b ) ------/
```

1. **Affine Combination:**
   The neuron computes a linear combination of its inputs parameterized by weight vector $\mathbf{w} = [w_1, w_2, \dots, w_d]^T \in \mathbb{R}^d$ and scalar bias $b \in \mathbb{R}$:
   $$
   z = \mathbf{w}^T \mathbf{x} + b = \sum_{i=1}^d w_i x_i + b
   $$

2. **Homogeneous Bias Representation:**
   By augmenting the input vector with a constant dummy input $x_0 = 1$ and setting $w_0 = b$, the affine combination simplifies to a pure inner product:
   $$
   \tilde{\mathbf{x}} = \begin{bmatrix} 1 \\ x_1 \\ \vdots \\ x_d \end{bmatrix} \in \mathbb{R}^{d+1}, \quad \tilde{\mathbf{w}} = \begin{bmatrix} b \\ w_1 \\ \vdots \\ w_d \end{bmatrix} \in \mathbb{R}^{d+1} \implies z = \tilde{\mathbf{w}}^T \tilde{\mathbf{x}}
   $$

3. **Heaviside Sign Activation Function:**
   The continuous activation $z$ is passed through a bipolar step function:
   $$
   \hat{y} = \text{sgn}(z) = \begin{cases}
   +1 & \text{if } z = \mathbf{w}^T \mathbf{x} + b \ge 0 \\
   -1 & \text{if } z = \mathbf{w}^T \mathbf{x} + b < 0
   \end{cases}
   $$

### 1.4.2 The Perceptron Learning Algorithm

Let $\mathcal{D} = \{(\mathbf{x}_1, y_1), (\mathbf{x}_2, y_2), \dots, (\mathbf{x}_n, y_n)\}$ be a training dataset where $\mathbf{x}_k \in \mathbb{R}^d$ and true labels $y_k \in \{-1, +1\}$.

#### Algorithmic Pseudocode:
1. Initialize $\mathbf{w}_0 = \mathbf{0} \in \mathbb{R}^d$ and $b_0 = 0$.
2. Set learning rate $\eta \in (0, 1]$ (typically $\eta = 1$).
3. **Repeat** until all samples are classified correctly:
   - For each training example $(\mathbf{x}_k, y_k) \in \mathcal{D}$:
     - Predict output: $\hat{y}_k = \text{sgn}(\mathbf{w}^T \mathbf{x}_k + b)$.
     - If the prediction is incorrect ($y_k \neq \hat{y}_k$, or equivalently $y_k(\mathbf{w}^T \mathbf{x}_k + b) \le 0$):
       $$
       \mathbf{w} \leftarrow \mathbf{w} + \eta \, y_k \, \mathbf{x}_k
       $$
       $$
       b \leftarrow b + \eta \, y_k
       $$
     - If the prediction is correct ($y_k = \hat{y}_k$):
       Do nothing ($\mathbf{w} \leftarrow \mathbf{w}, b \leftarrow b$).

#### Geometric Interpretation of the Update:
Why does the update $\mathbf{w} \leftarrow \mathbf{w} + y_k \mathbf{x}_k$ work?
Consider an error where $y_k = +1$, but $\mathbf{w}^T \mathbf{x}_k < 0$. The new weight vector becomes $\mathbf{w}_{\text{new}} = \mathbf{w} + \mathbf{x}_k$. Evaluating the new inner product:
$$
\mathbf{w}_{\text{new}}^T \mathbf{x}_k = (\mathbf{w} + \mathbf{x}_k)^T \mathbf{x}_k = \mathbf{w}^T \mathbf{x}_k + \|\mathbf{x}_k\|_2^2
$$
Because $\|\mathbf{x}_k\|_2^2 > 0$, the quantity $\mathbf{w}_{\text{new}}^T \mathbf{x}_k$ increases strictly, rotating the normal vector $\mathbf{w}$ toward $\mathbf{x}_k$, correcting the classification error.

---

## 1.5 The Novikoff Perceptron Convergence Theorem

Does this iterative adjustment process ever terminate, or could it cycle endlessly? In 1962, Albert Novikoff provided the definitive answer with the **Perceptron Convergence Theorem**.

### 1.5.1 Definitions and Assumptions

Let $\tilde{\mathbf{x}}_k = [1, \mathbf{x}_k^T]^T \in \mathbb{R}^{d+1}$ be the augmented input vectors, normalized so that without loss of generality we consider $\tilde{\mathbf{w}} = [b, \mathbf{w}^T]^T$.
1. **Linear Separability:** A dataset $\mathcal{D} = \{(\tilde{\mathbf{x}}_k, y_k)\}_{k=1}^n$ is **linearly separable** if there exists an optimal unit weight vector $\mathbf{w}^* \in \mathbb{R}^{d+1}$ ($\|\mathbf{w}^*\|_2 = 1$) and a strictly positive **geometric margin** $\gamma > 0$ such that:
   $$
   y_k (\mathbf{w}^{*T} \tilde{\mathbf{x}}_k) \ge \gamma \quad \forall k \in \{1, 2, \dots, n\}
   $$
2. **Bounded Bounding Radius:** Let $R$ be the radius of the smallest sphere enclosing all input data:
   $$
   R = \max_{1 \le k \le n} \|\tilde{\mathbf{x}}_k\|_2
   $$

### 1.5.2 Theorem and Rigorous Proof

#### Theorem: Novikoff’s Upper Bound on Mistakes
Assume the dataset $\mathcal{D}$ is linearly separable with margin $\gamma > 0$ and bounded radius $R$. Then starting from initial weights $\mathbf{w}_0 = \mathbf{0}$, the perceptron learning algorithm makes at most $M_{\max}$ classification mistakes, where:
$$
M_{\max} \le \left( \frac{R}{\gamma} \right)^2
$$
In particular, the algorithm terminates in a finite number of steps with a hyper-plane that correctly classifies every training point.

*Proof:*  
Let $\mathbf{w}_t$ denote the weight vector after $t$ updates (mistakes). At step $t$, a mistake occurs on sample $(\tilde{\mathbf{x}}_k, y_k)$, which implies:
$$
y_k (\mathbf{w}_t^T \tilde{\mathbf{x}}_k) \le 0
$$
The update rule is:
$$
\mathbf{w}_{t+1} = \mathbf{w}_t + y_k \tilde{\mathbf{x}}_k
$$

We establish two bounding inequalities on the inner product $\mathbf{w}_{t+1}^T \mathbf{w}^*$ and the squared norm $\|\mathbf{w}_{t+1}\|_2^2$.

**Step 1: Lower Bounding $\mathbf{w}_{t+1}^T \mathbf{w}^*$:**  
Take the dot product of both sides of the update equation with the optimal separator $\mathbf{w}^*$:
$$
\mathbf{w}_{t+1}^T \mathbf{w}^* = (\mathbf{w}_t + y_k \tilde{\mathbf{x}}_k)^T \mathbf{w}^* = \mathbf{w}_t^T \mathbf{w}^* + y_k (\mathbf{w}^{*T} \tilde{\mathbf{x}}_k)
$$
By the definition of the geometric margin $\gamma$, $y_k (\mathbf{w}^{*T} \tilde{\mathbf{x}}_k) \ge \gamma$. Therefore:
$$
\mathbf{w}_{t+1}^T \mathbf{w}^* \ge \mathbf{w}_t^T \mathbf{w}^* + \gamma
$$
Applying this recurrence starting from $\mathbf{w}_0 = \mathbf{0}$ across $t$ updates:
$$
\mathbf{w}_t^T \mathbf{w}^* \ge t \gamma
$$

**Step 2: Upper Bounding $\|\mathbf{w}_{t+1}\|_2^2$:**  
Compute the squared Euclidean norm of $\mathbf{w}_{t+1}$:
$$
\|\mathbf{w}_{t+1}\|_2^2 = \|\mathbf{w}_t + y_k \tilde{\mathbf{x}}_k\|_2^2 = \|\mathbf{w}_t\|_2^2 + 2 y_k (\mathbf{w}_t^T \tilde{\mathbf{x}}_k) + y_k^2 \|\tilde{\mathbf{x}}_k\|_2^2
$$
Because a mistake occurred, $y_k (\mathbf{w}_t^T \tilde{\mathbf{x}}_k) \le 0$.  
Furthermore, $y_k^2 = 1$ and $\|\tilde{\mathbf{x}}_k\|_2^2 \le R^2$.  
Therefore:
$$
\|\mathbf{w}_{t+1}\|_2^2 \le \|\mathbf{w}_t\|_2^2 + 0 + R^2 = \|\mathbf{w}_t\|_2^2 + R^2
$$
Applying this recurrence across $t$ updates starting from $\|\mathbf{w}_0\|_2^2 = 0$:
$$
\|\mathbf{w}_t\|_2^2 \le t R^2
$$

**Step 3: Combining via Cauchy-Schwarz Inequality:**  
By the Cauchy-Schwarz inequality:
$$
(\mathbf{w}_t^T \mathbf{w}^*)^2 \le \|\mathbf{w}_t\|_2^2 \|\mathbf{w}^*\|_2^2
$$
Since $\|\mathbf{w}^*\|_2 = 1$, we substitute our lower bound from Step 1 and upper bound from Step 2:
$$
(t \gamma)^2 \le \mathbf{w}_t^T \mathbf{w}^* \le \|\mathbf{w}_t\|_2^2 \le t R^2
$$
$$
t^2 \gamma^2 \le t R^2
$$
Dividing both sides by $t \gamma^2 > 0$:
$$
t \le \frac{R^2}{\gamma^2} = \left(\frac{R}{\gamma}\right)^2
$$
Thus, the total number of mistakes $t$ cannot exceed $(R/\gamma)^2$. $\blacksquare$

---

## 1.6 Exactly 10 Worked Examples

### Worked Example 1.1: McCulloch-Pitts Threshold Synthesis for a 3-Input Majority Gate
**Problem Statement:**  
Design a McCulloch-Pitts threshold neuron that implements a 3-input **Majority Gate**: the neuron outputs $1$ if at least 2 out of the 3 binary inputs $(x_1, x_2, x_3)$ are active ($1$), and $0$ otherwise.  
1. Define the input weights and threshold $\theta$.
2. Construct the complete truth table and verify output for all $2^3 = 8$ configurations.

**Detailed Solution:**  
1. **Weight and Threshold Assignment:**
   All three inputs contribute equally to the decision, so assign identical excitatory weights $w_1 = w_2 = w_3 = 1$.  
   The condition for activation is that at least 2 inputs fire:
   $$
   z = x_1 + x_2 + x_3 \ge 2 \implies \theta = 2
   $$
   Rule: $y = \mathbb{I}_{\{x_1 + x_2 + x_3 \ge 2\}}$.

2. **Truth Table Verification:**

| $x_1$ | $x_2$ | $x_3$ | $\sum x_i$ | $\sum x_i \ge 2$ | Output $y$ | Correct? |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 | False | 0 | Yes |
| 0 | 0 | 1 | 1 | False | 0 | Yes |
| 0 | 1 | 0 | 1 | False | 0 | Yes |
| 0 | 1 | 1 | 2 | True | 1 | Yes |
| 1 | 0 | 0 | 1 | False | 0 | Yes |
| 1 | 0 | 1 | 2 | True | 1 | Yes |
| 1 | 1 | 0 | 2 | True | 1 | Yes |
| 1 | 1 | 1 | 3 | True | 1 | Yes |

The gate correctly computes the majority function.

---

### Worked Example 1.2: McCulloch-Pitts Inhibitory Circuit for Non-Implication
**Problem Statement:**  
Synthesize a McCulloch-Pitts network that computes the logical function $x_1 \text{ AND NOT } x_2$ ($x_1 \land \neg x_2$).

**Detailed Solution:**  
1. **Identifying Excitatory and Inhibitory Channels:**
   - Input $x_1$ must be active for the output to be 1: make $x_1$ an excitatory input ($\mathcal{E} = \{1\}$).
   - Input $x_2$ must **not** be active: if $x_2 = 1$, the output must be silenced regardless of $x_1$. Make $x_2$ an absolute inhibitory input ($\mathcal{I} = \{2\}$).

2. **Setting Parameters:**
   Excitatory sum: $z = x_1$.  
   Threshold: $\theta = 1$.  
   Rule:
   $$
   y = \begin{cases} 1 & \text{if } x_1 \ge 1 \text{ and } x_2 = 0 \\ 0 & \text{otherwise} \end{cases}
   $$

3. **Verification:**
   - $(x_1, x_2) = (0, 0) \implies x_1 = 0 < 1 \implies y = 0$.
   - $(x_1, x_2) = (0, 1) \implies x_2 = 1 \text{ (inhibited)} \implies y = 0$.
   - $(x_1, x_2) = (1, 0) \implies x_1 = 1 \ge 1 \text{ and } x_2 = 0 \implies y = 1$.
   - $(x_1, x_2) = (1, 1) \implies x_2 = 1 \text{ (inhibited)} \implies y = 0$.
   This matches the truth table of $x_1 \land \neg x_2$ exactly.

---

### Worked Example 1.3: Step-by-Step Execution of the Perceptron Learning Algorithm
**Problem Statement:**  
Train a 2D Perceptron with zero initial weights ($\mathbf{w}_0 = [0, 0]^T$, $b_0 = 0$) and learning rate $\eta = 1$ on the following 4-point linearly separable dataset:
- $\mathbf{x}_1 = [1, 2]^T, y_1 = +1$
- $\mathbf{x}_2 = [-1, 2]^T, y_2 = -1$
- $\mathbf{x}_3 = [0, -1]^T, y_3 = -1$
- $\mathbf{x}_4 = [2, 0]^T, y_4 = +1$

Trace each update through the first complete epoch.

**Detailed Solution:**  
Initial State: $\mathbf{w} = [0, 0]^T, b = 0$.

- **Step 1: Present $\mathbf{x}_1 = [1, 2]^T, y_1 = +1$:**
  $$
  z_1 = \mathbf{w}^T \mathbf{x}_1 + b = 0(1) + 0(2) + 0 = 0
  $$
  By convention, $\text{sgn}(0) = +1$ (or mistake if tie). Suppose tie convention treats $z \le 0$ as $-1$ (or update on $y_k z_k \le 0$):  
  $y_1 z_1 = 1(0) = 0 \le 0 \implies$ **Mistake!**  
  Update:
  $$
  \mathbf{w} \leftarrow \mathbf{w} + y_1 \mathbf{x}_1 = \begin{bmatrix} 0 \\ 0 \end{bmatrix} + (+1)\begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}
  $$
  $$
  b \leftarrow b + y_1 = 0 + 1 = 1
  $$
  New state: $\mathbf{w} = [1, 2]^T, b = 1$.

- **Step 2: Present $\mathbf{x}_2 = [-1, 2]^T, y_2 = -1$:**
  $$
  z_2 = \mathbf{w}^T \mathbf{x}_2 + b = 1(-1) + 2(2) + 1 = -1 + 4 + 1 = 4
  $$
  $y_2 z_2 = (-1)(4) = -4 \le 0 \implies$ **Mistake!**  
  Update:
  $$
  \mathbf{w} \leftarrow \mathbf{w} + y_2 \mathbf{x}_2 = \begin{bmatrix} 1 \\ 2 \end{bmatrix} + (-1)\begin{bmatrix} -1 \\ 2 \end{bmatrix} = \begin{bmatrix} 1 + 1 \\ 2 - 2 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix}
  $$
  $$
  b \leftarrow b + y_2 = 1 - 1 = 0
  $$
  New state: $\mathbf{w} = [2, 0]^T, b = 0$.

- **Step 3: Present $\mathbf{x}_3 = [0, -1]^T, y_3 = -1$:**
  $$
  z_3 = \mathbf{w}^T \mathbf{x}_3 + b = 2(0) + 0(-1) + 0 = 0 \implies y_3 z_3 = 0 \le 0 \implies \text{\textbf{Mistake!}}
  $$
  Update:
  $$
  \mathbf{w} \leftarrow \mathbf{w} + y_3 \mathbf{x}_3 = \begin{bmatrix} 2 \\ 0 \end{bmatrix} + (-1)\begin{bmatrix} 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}
  $$
  $$
  b \leftarrow b + y_3 = 0 - 1 = -1
  $$
  New state: $\mathbf{w} = [2, 1]^T, b = -1$.

- **Step 4: Present $\mathbf{x}_4 = [2, 0]^T, y_4 = +1$:**
  $$
  z_4 = \mathbf{w}^T \mathbf{x}_4 + b = 2(2) + 1(0) - 1 = 4 - 1 = 3 > 0
  $$
  $y_4 z_4 = (+1)(3) = 3 > 0 \implies$ **Correct! No update.**

After Epoch 1, $\mathbf{w} = [2, 1]^T, b = -1$.

---

### Worked Example 1.4: Novikoff Bound Calculation for a 2D Dataset
**Problem Statement:**  
Consider a 2D dataset with points:
- Class $+1$: $\mathbf{x}_1 = [2, 3]^T, \mathbf{x}_2 = [3, 1]^T$
- Class $-1$: $\mathbf{x}_3 = [-1, -1]^T, \mathbf{x}_4 = [0, -2]^T$

Suppose the separating hyperplane passes through the origin ($b = 0$) with true normal $\mathbf{w}^* = \frac{1}{\sqrt{2}} [1, 1]^T$.  
1. Compute the maximum radius $R$.
2. Compute the minimum margin $\gamma$.
3. Calculate the Novikoff theoretical bound on maximum mistakes $M_{\max}$.

**Detailed Solution:**  
1. **Computing Radius $R$:**
   $$
   \|\mathbf{x}_1\|_2 = \sqrt{2^2 + 3^2} = \sqrt{13} \approx 3.6055
   $$
   $$
   \|\mathbf{x}_2\|_2 = \sqrt{3^2 + 1^2} = \sqrt{10} \approx 3.1623
   $$
   $$
   \|\mathbf{x}_3\|_2 = \sqrt{(-1)^2 + (-1)^2} = \sqrt{2} \approx 1.4142
   $$
   $$
   \|\mathbf{x}_4\|_2 = \sqrt{0^2 + (-2)^2} = 2.0
   $$
   Thus, $R = \max(\|\mathbf{x}_i\|_2) = \sqrt{13} \approx 3.60555$.

2. **Computing Margin $\gamma$:**
   Compute functional margins $y_i (\mathbf{w}^{*T} \mathbf{x}_i)$:
   - For $\mathbf{x}_1$: $(+1) \frac{1}{\sqrt{2}}(2 + 3) = \frac{5}{\sqrt{2}} \approx 3.5355$
   - For $\mathbf{x}_2$: $(+1) \frac{1}{\sqrt{2}}(3 + 1) = \frac{4}{\sqrt{2}} = 2\sqrt{2} \approx 2.8284$
   - For $\mathbf{x}_3$: $(-1) \frac{1}{\sqrt{2}}(-1 - 1) = \frac{2}{\sqrt{2}} = \sqrt{2} \approx 1.4142$
   - For $\mathbf{x}_4$: $(-1) \frac{1}{\sqrt{2}}(0 - 2) = \frac{2}{\sqrt{2}} = \sqrt{2} \approx 1.4142$  
   The minimum margin is $\gamma = \min_i y_i (\mathbf{w}^{*T} \mathbf{x}_i) = \sqrt{2} \approx 1.4142$.

3. **Novikoff Bound:**
   $$
   M_{\max} \le \left(\frac{R}{\gamma}\right)^2 = \frac{R^2}{\gamma^2} = \frac{13}{(\sqrt{2})^2} = \frac{13}{2} = 6.5
   $$
   Because mistakes must be integers, the perceptron is guaranteed to converge in **at most 6 mistakes**!

---

### Worked Example 1.5: Linear Classification Margin Geometry
**Problem Statement:**  
A hyperplane in $\mathbb{R}^2$ is given by $3x_1 + 4x_2 - 12 = 0$.  
1. Find the unit normal vector $\hat{\mathbf{w}}$.
2. Calculate the signed orthogonal distance from the origin $(0, 0)$ to the hyperplane.
3. Calculate the distance from the point $(5, 5)$ to the hyperplane.

**Detailed Solution:**  
1. **Normal Vector:**
   The weight vector is $\mathbf{w} = [3, 4]^T$.  
   Its Euclidean norm is $\|\mathbf{w}\|_2 = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5$.  
   The unit normal is:
   $$
   \hat{\mathbf{w}} = \frac{\mathbf{w}}{\|\mathbf{w}\|_2} = \begin{bmatrix} 3/5 \\ 4/5 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}
   $$

2. **Distance from Origin:**
   The general formula for signed distance from point $\mathbf{x}_0$ is:
   $$
   d(\mathbf{x}_0) = \frac{\mathbf{w}^T \mathbf{x}_0 + b}{\|\mathbf{w}\|_2}
   $$
   For $\mathbf{x}_0 = [0, 0]^T$ with $b = -12$:
   $$
   d(\mathbf{0}) = \frac{3(0) + 4(0) - 12}{5} = \frac{-12}{5} = -2.4
   $$
   The perpendicular geometric distance is $|d| = 2.4$ units.

3. **Distance from $(5, 5)$:**
   $$
   d([5, 5]^T) = \frac{3(5) + 4(5) - 12}{5} = \frac{15 + 20 - 12}{5} = \frac{23}{5} = 4.6\text{ units}
   $$

---

### Worked Example 1.6: Hebbian Weight Convergence under Orthogonal Patterns
**Problem Statement:**  
Consider a single linear Hebbian neuron with initial weights $\mathbf{w}_0 = [0, 0]^T$ and learning rate $\eta = 0.5$.  
Two orthogonal input patterns $\mathbf{x}_1 = [2, 0]^T$ and $\mathbf{x}_2 = [0, 3]^T$ are presented sequentially with desired targets $y_1 = 1$ and $y_2 = 1$.  
1. Compute the weights after training on $\mathbf{x}_1$, then on $\mathbf{x}_2$.
2. Verify that the final weight vector is an exact linear combination of the inputs.

**Detailed Solution:**  
1. **Presentation of $\mathbf{x}_1$:**
   $$
   \mathbf{w}_1 = \mathbf{w}_0 + \eta y_1 \mathbf{x}_1 = \begin{bmatrix} 0 \\ 0 \end{bmatrix} + 0.5(1)\begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}
   $$

2. **Presentation of $\mathbf{x}_2$:**
   $$
   \mathbf{w}_2 = \mathbf{w}_1 + \eta y_2 \mathbf{x}_2 = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} + 0.5(1)\begin{bmatrix} 0 \\ 3 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 1.5 \end{bmatrix}
   $$

3. **Linear Combination Verification:**
   $$
   \mathbf{w}_2 = \eta y_1 \mathbf{x}_1 + \eta y_2 \mathbf{x}_2 = 0.5 [2, 0]^T + 0.5 [0, 3]^T = [1.0, 1.5]^T
   $$
   Because $\mathbf{x}_1^T \mathbf{x}_2 = 2(0) + 0(3) = 0$ (orthogonal), learning pattern $\mathbf{x}_2$ caused zero interference (crosstalk) with pattern $\mathbf{x}_1$.

---

### Worked Example 1.7: Perceptron Dual Representation
**Problem Statement:**  
The Perceptron weight vector can be expressed in **dual form** as $\mathbf{w} = \sum_{i=1}^n \alpha_i y_i \mathbf{x}_i$, where $\alpha_i \ge 0$ is the number of times sample $i$ was misclassified.  
For a dataset with 3 samples:
- $\mathbf{x}_1 = [1, 0]^T, y_1 = 1$
- $\mathbf{x}_2 = [0, 1]^T, y_2 = 1$
- $\mathbf{x}_3 = [-1, -1]^T, y_3 = -1$

If the algorithm makes 2 mistakes on $\mathbf{x}_1$, 1 mistake on $\mathbf{x}_2$, and 3 mistakes on $\mathbf{x}_3$, calculate the explicit weight vector $\mathbf{w}$ and evaluate the classification of a test point $\mathbf{x}_{\text{test}} = [0.5, 0.5]^T$.

**Detailed Solution:**  
1. **Dual Coefficients:**
   $\alpha_1 = 2, \alpha_2 = 1, \alpha_3 = 3$.  
   $y_1 = +1, y_2 = +1, y_3 = -1$.

2. **Computing $\mathbf{w}$:**
   $$
   \begin{aligned}
   \mathbf{w} &= \alpha_1 y_1 \mathbf{x}_1 + \alpha_2 y_2 \mathbf{x}_2 + \alpha_3 y_3 \mathbf{x}_3 \\
   &= 2(+1)\begin{bmatrix} 1 \\ 0 \end{bmatrix} + 1(+1)\begin{bmatrix} 0 \\ 1 \end{bmatrix} + 3(-1)\begin{bmatrix} -1 \\ -1 \end{bmatrix} \\
   &= \begin{bmatrix} 2 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} - 3\begin{bmatrix} -1 \\ -1 \end{bmatrix} = \begin{bmatrix} 2 + 3 \\ 0 + 1 + 3 \end{bmatrix} = \begin{bmatrix} 5 \\ 4 \end{bmatrix}
   \end{aligned}
   $$

3. **Evaluating Test Point:**
   $$
   z_{\text{test}} = \mathbf{w}^T \mathbf{x}_{\text{test}} = 5(0.5) + 4(0.5) = 2.5 + 2.0 = 4.5
   $$
   $$
   \hat{y}_{\text{test}} = \text{sgn}(4.5) = +1
   $$

---

### Worked Example 1.8: Scaling Invariance of the Perceptron Algorithm
**Problem Statement:**  
Prove that multiplying all input vectors $\mathbf{x}_i$ by a positive scalar $c > 0$ does not change the sequence of mistakes made by the Perceptron learning algorithm, although it scales the final weight vector.

**Detailed Solution:**  
1. **Scaled Dataset:**
   Let $\mathbf{x}_i' = c \mathbf{x}_i$ with $c > 0$.  
   Suppose at step $t$, the weight vector for the scaled dataset is $\mathbf{w}_t' = \frac{1}{c} \mathbf{w}_t$ (or proportional).

2. **Decision Value:**
   $$
   z_t' = (\mathbf{w}_t')^T \mathbf{x}_i' = \mathbf{w}_t'^T (c \mathbf{x}_i)
   $$
   If $\mathbf{w}_t' = \mathbf{w}_t / c$, then $z_t' = (\mathbf{w}_t / c)^T (c \mathbf{x}_i) = \mathbf{w}_t^T \mathbf{x}_i = z_t$.  
   Because $\text{sgn}(z_t') = \text{sgn}(z_t)$, an error occurs on the scaled dataset if and only if an error occurs on the original dataset!

3. **Update Step:**
   Upon mistake:
   $$
   \mathbf{w}_{t+1}' = \mathbf{w}_t' + y_i \mathbf{x}_i' = \mathbf{w}_t' + c \, y_i \mathbf{x}_i
   $$
   Starting from $\mathbf{w}_0 = \mathbf{0}$, after $M$ mistakes on the identical sequence of examples, the final weights satisfy:
   $$
   \mathbf{w}_{\text{scaled}} = c \, \mathbf{w}_{\text{orig}}
   $$
   The resulting hyperplane $\mathbf{w}_{\text{scaled}}^T \mathbf{x}' = (c \mathbf{w}_{\text{orig}})^T (c \mathbf{x}) = c^2 (\mathbf{w}_{\text{orig}}^T \mathbf{x}) = 0$ is geometrically **identical**.

---

### Worked Example 1.9: Perceptron Infinite Cycling on Non-Separable Data
**Problem Statement:**  
Consider a non-separable 2D dataset with opposite labels at the same coordinate: $\mathbf{x}_1 = [1, 0]^T$ with $y_1 = +1$, and $\mathbf{x}_2 = [1, 0]^T$ with $y_2 = -1$.  
Show that starting from $\mathbf{w}_0 = [0, 0]^T, b_0 = 0$, the perceptron algorithm enters an infinite cycle.

**Detailed Solution:**  
1. **Step 1: Present $\mathbf{x}_1, y_1 = +1$:**
   $z_1 = 0 \implies$ Error.  
   $\mathbf{w}_1 = [0, 0]^T + (+1)[1, 0]^T = [1, 0]^T$, $b_1 = +1$.

2. **Step 2: Present $\mathbf{x}_2, y_2 = -1$:**
   $z_2 = 1(1) + 0(0) + 1 = 2 > 0$. Label is $-1 \implies$ Error!  
   $\mathbf{w}_2 = [1, 0]^T + (-1)[1, 0]^T = [0, 0]^T$, $b_2 = 1 - 1 = 0$.

3. **Cycle Recurrence:**
   The state after Step 2 is $\mathbf{w}_2 = [0, 0]^T, b_2 = 0$, which is **identical** to the initial state $\mathbf{w}_0$.  
   The algorithm cycles perpetually through the states:
   $$
   ([0, 0]^T, 0) \to ([1, 0]^T, 1) \to ([0, 0]^T, 0) \to \dots
   $$
   It never terminates.

---

### Worked Example 1.10: Pocket Algorithm for Non-Separable Problems
**Problem Statement:**  
To prevent infinite cycling on noisy non-separable data, Gallant (1990) introduced the **Pocket Algorithm**: the perceptron runs for a fixed budget of $T$ iterations while keeping the best weight vector encountered so far in its "pocket".  
Explain how the Pocket Algorithm evaluates candidates, and why training error must be monitored explicitly.

**Detailed Solution:**  
1. **Mechanism:**
   - Maintain current weights $\mathbf{w}_{\text{current}}$ and "pocket" weights $\mathbf{w}_{\text{pocket}}$.
   - Maintain $E_{\text{best}}$, the minimum number of misclassified points on the training set (initialized to $n$).
2. **Iteration:**
   - Execute a standard perceptron update on a misclassified point to obtain $\mathbf{w}_{\text{new}}$.
   - Compute the full empirical error $E(\mathbf{w}_{\text{new}}) = \sum_{i=1}^n \mathbb{I}_{\{y_i (\mathbf{w}_{\text{new}}^T \mathbf{x}_i) \le 0\}}$.
   - If $E(\mathbf{w}_{\text{new}}) < E_{\text{best}}$:
     $$
     \mathbf{w}_{\text{pocket}} \leftarrow \mathbf{w}_{\text{new}}, \quad E_{\text{best}} \leftarrow E(\mathbf{w}_{\text{new}})
     $$
3. **Guaranteed Behavior:**
   Unlike the standard perceptron whose final weights might perform terribly if the last update occurred on an outlier, the Pocket Algorithm is monotonic: its output is guaranteed to be the best linear classifier discovered during the entire search budget $T$.

---

## 1.7 Exactly 10 Solved Exercises

### Exercise 1.1: McCulloch-Pitts Synthesis of a 4-Bit Parity Bit Checker
**Problem Statement:**  
Explain why a single McCulloch-Pitts neuron cannot compute the 2-bit parity function ($x_1 \oplus x_2$), but construct a two-layer network of McCulloch-Pitts neurons that outputs $1$ if and only if exactly one of the two inputs is active.

**Detailed Solution:**  
1. **Single Neuron Impossibility:**
   For a single neuron with weights $w_1, w_2$ and threshold $\theta$:
   - $(0, 0) \implies 0 < \theta \implies \theta > 0$.
   - $(1, 0) \implies w_1 \ge \theta$.
   - $(0, 1) \implies w_2 \ge \theta$.
   - $(1, 1) \implies w_1 + w_2 < \theta$.  
   Summing the middle two: $w_1 + w_2 \ge 2\theta$.  
   Since $\theta > 0$, $2\theta > \theta$, which contradicts $w_1 + w_2 < \theta$. No single neuron can solve this.

2. **Two-Layer Construction:**
   Notice that $x_1 \oplus x_2 = (x_1 \lor x_2) \land \neg(x_1 \land x_2)$.
   - **Layer 1, Neuron 1 (OR Gate):** Excitatory weights $w_{11} = 1, w_{21} = 1$, threshold $\theta_1 = 1$.  
     Outputs $h_1 = 1$ if $x_1 + x_2 \ge 1$.
   - **Layer 1, Neuron 2 (AND Gate):** Excitatory weights $w_{12} = 1, w_{22} = 1$, threshold $\theta_2 = 2$.  
     Outputs $h_2 = 1$ if $x_1 + x_2 \ge 2$.
   - **Layer 2, Output Neuron:** Receives excitatory input from $h_1$ and inhibitory input from $h_2$. Threshold $\theta_{\text{out}} = 1$.
     $$
     y = \begin{cases} 1 & \text{if } h_1 \ge 1 \text{ and } h_2 = 0 \\ 0 & \text{otherwise} \end{cases}
     $$
   Verification:
   - $(0, 0) \implies h_1 = 0, h_2 = 0 \implies y = 0$.
   - $(1, 0) \implies h_1 = 1, h_2 = 0 \implies y = 1$.
   - $(0, 1) \implies h_1 = 1, h_2 = 0 \implies y = 1$.
   - $(1, 1) \implies h_1 = 1, h_2 = 1 \implies y = 0 \text{ (inhibited)}$.  
   The two-layer network computes parity.

---

### Exercise 1.2: Novikoff Margin Bound Sensitivity
**Problem Statement:**  
A training dataset has bounding radius $R = 10$. If the geometric separation margin between classes is $\gamma = 0.2$, what is the upper bound on the number of updates the perceptron algorithm can make? If an improved data preprocessing step increases the margin to $\gamma = 0.5$, by what factor does the maximum mistake bound decrease?

**Detailed Solution:**  
1. **Initial Bound:**
   $$
   M_1 \le \left(\frac{R}{\gamma_1}\right)^2 = \left(\frac{10}{0.2}\right)^2 = (50)^2 = 2500 \text{ mistakes}
   $$

2. **Improved Bound:**
   $$
   M_2 \le \left(\frac{R}{\gamma_2}\right)^2 = \left(\frac{10}{0.5}\right)^2 = (20)^2 = 400 \text{ mistakes}
   $$

3. **Reduction Factor:**
   $$
   \frac{M_1}{M_2} = \frac{2500}{400} = 6.25\times
   $$
   Increasing the margin by a factor of $2.5$ reduces the maximum number of mistakes by a factor of $2.5^2 = 6.25$ (an $84\%$ reduction in worst-case training time).

---

### Exercise 1.3: Proof that Margin is Invariant to Vector Scaling
**Problem Statement:**  
Let the geometric margin of a hyperplane $\mathbf{w}$ be defined as $\gamma = \min_i \frac{y_i (\mathbf{w}^T \mathbf{x}_i + b)}{\|\mathbf{w}\|_2}$.  
Prove that $\gamma$ is invariant under multiplying the parameters by an arbitrary positive scalar $\alpha > 0$.

**Detailed Solution:**  
1. **Scaling Parameters:**
   Let $\mathbf{w}' = \alpha \mathbf{w}$ and $b' = \alpha b$ with $\alpha > 0$.

2. **Evaluating Scaled Margin:**
   $$
   \gamma' = \min_i \frac{y_i (\mathbf{w}'^T \mathbf{x}_i + b')}{\|\mathbf{w}'\|_2} = \min_i \frac{y_i ((\alpha \mathbf{w})^T \mathbf{x}_i + \alpha b)}{\|\alpha \mathbf{w}\|_2}
   $$
   Using linearity and norm scaling $\|\alpha \mathbf{w}\|_2 = |\alpha| \|\mathbf{w}\|_2 = \alpha \|\mathbf{w}\|_2$:
   $$
   \gamma' = \min_i \frac{\alpha [ y_i (\mathbf{w}^T \mathbf{x}_i + b) ]}{\alpha \|\mathbf{w}\|_2} = \min_i \frac{y_i (\mathbf{w}^T \mathbf{x}_i + b)}{\|\mathbf{w}\|_2} = \gamma \quad \blacksquare
   $$
   The geometric margin depends solely on the physical orientation of the hyperplane, not the arbitrary algebraic scale of its coefficients.

---

### Exercise 1.4: Oja’s Rule Normalization Proof
**Problem Statement:**  
Let $\Delta \mathbf{w} = \eta y (\mathbf{x} - y \mathbf{w})$, where $y = \mathbf{w}^T \mathbf{x}$.  
Show that in continuous time $\frac{d\mathbf{w}}{dt} = y\mathbf{x} - y^2 \mathbf{w}$, the norm $\|\mathbf{w}(t)\|_2^2$ converges to 1 if the input covariance has a dominant eigenvalue.

**Detailed Solution:**  
1. **Time Derivative of Squared Norm:**
   $$
   \frac{d}{dt} \|\mathbf{w}\|_2^2 = \frac{d}{dt} (\mathbf{w}^T \mathbf{w}) = 2 \mathbf{w}^T \frac{d\mathbf{w}}{dt}
   $$

2. **Substituting Oja's Equation:**
   $$
   \mathbf{w}^T \frac{d\mathbf{w}}{dt} = \mathbf{w}^T (y \mathbf{x} - y^2 \mathbf{w}) = y (\mathbf{w}^T \mathbf{x}) - y^2 (\mathbf{w}^T \mathbf{w})
   $$
   Since $y = \mathbf{w}^T \mathbf{x}$:
   $$
   \mathbf{w}^T \frac{d\mathbf{w}}{dt} = y(y) - y^2 \|\mathbf{w}\|_2^2 = y^2 (1 - \|\mathbf{w}\|_2^2)
   $$
   Therefore:
   $$
   \frac{d}{dt} \|\mathbf{w}\|_2^2 = 2 y^2 (1 - \|\mathbf{w}\|_2^2)
   $$

3. **Stability Analysis:**
   - If $\|\mathbf{w}\|_2^2 < 1$: $(1 - \|\mathbf{w}\|_2^2) > 0 \implies \frac{d}{dt} \|\mathbf{w}\|_2^2 > 0$ (norm increases).
   - If $\|\mathbf{w}\|_2^2 > 1$: $(1 - \|\mathbf{w}\|_2^2) < 0 \implies \frac{d}{dt} \|\mathbf{w}\|_2^2 < 0$ (norm decreases).
   - The unique stable equilibrium is $\|\mathbf{w}\|_2^2 = 1 \implies \|\mathbf{w}\|_2 = 1$. $\blacksquare$

---

### Exercise 1.5: Perceptron Learning with Non-Zero Initial Weights
**Problem Statement:**  
Modify the Novikoff theorem proof to account for an arbitrary non-zero initial weight vector $\mathbf{w}_0 \neq \mathbf{0}$. Derive the updated bound on the number of mistakes.

**Detailed Solution:**  
1. **Recurrence with $\mathbf{w}_0$:**
   - Lower bound on inner product:
     $$
     \mathbf{w}_t^T \mathbf{w}^* = \mathbf{w}_0^T \mathbf{w}^* + \sum_{k=1}^t y_k (\mathbf{w}^{*T} \mathbf{x}_k) \ge \mathbf{w}_0^T \mathbf{w}^* + t \gamma
     $$
   - Upper bound on squared norm:
     $$
     \|\mathbf{w}_t\|_2^2 \le \|\mathbf{w}_0\|_2^2 + t R^2
     $$

2. **Applying Cauchy-Schwarz:**
   $$
   (\mathbf{w}_0^T \mathbf{w}^* + t \gamma)^2 \le \|\mathbf{w}_t\|_2^2 \le \|\mathbf{w}_0\|_2^2 + t R^2
   $$
   Expanding the left side:
   $$
   (\mathbf{w}_0^T \mathbf{w}^*)^2 + 2 t \gamma (\mathbf{w}_0^T \mathbf{w}^*) + t^2 \gamma^2 \le \|\mathbf{w}_0\|_2^2 + t R^2
   $$
   Since $(\mathbf{w}_0^T \mathbf{w}^*)^2 \le \|\mathbf{w}_0\|_2^2$, we drop these positive terms:
   $$
   t^2 \gamma^2 + 2 t \gamma (\mathbf{w}_0^T \mathbf{w}^*) \le t R^2
   $$
   Dividing by $t$:
   $$
   t \gamma^2 \le R^2 - 2 \gamma (\mathbf{w}_0^T \mathbf{w}^*) \implies t \le \frac{R^2 - 2\gamma(\mathbf{w}_0^T \mathbf{w}^*)}{\gamma^2}
   $$
   If $\mathbf{w}_0$ is aligned with $\mathbf{w}^*$ ($\mathbf{w}_0^T \mathbf{w}^* > 0$), the bound decreases; if anti-aligned, it increases.

---

### Exercise 1.6: Dual Perceptron Kernel Trick Precursor
**Problem Statement:**  
In the dual perceptron algorithm, the decision function is written as $f(\mathbf{x}) = \text{sgn}\left(\sum_{i=1}^n \alpha_i y_i (\mathbf{x}_i^T \mathbf{x}) + b\right)$.  
Explain how replacing the dot product $\mathbf{x}_i^T \mathbf{x}$ with a non-linear kernel function $K(\mathbf{x}_i, \mathbf{x}) = \boldsymbol{\phi}(\mathbf{x}_i)^T \boldsymbol{\phi}(\mathbf{x})$ enables linear algorithms to classify non-linear datasets without explicitly computing the high-dimensional feature map $\boldsymbol{\phi}(\mathbf{x})$.

**Detailed Solution:**  
1. **Dual Representation Isolation:**
   Notice that the data points $\mathbf{x}_i$ and query point $\mathbf{x}$ appear **exclusively** inside inner products $\langle \mathbf{x}_i, \mathbf{x} \rangle = \mathbf{x}_i^T \mathbf{x}$. The weight vector $\mathbf{w}$ is never accessed as an explicit vector.

2. **Kernel Substitution (Mercer's Theorem):**
   If we map data to a high-dimensional feature space $\boldsymbol{\phi}: \mathbb{R}^d \to \mathcal{H}$, the decision function becomes:
   $$
   f(\mathbf{x}) = \text{sgn}\left( \sum_{i=1}^n \alpha_i y_i \langle \boldsymbol{\phi}(\mathbf{x}_i), \boldsymbol{\phi}(\mathbf{x}) \rangle + b \right) = \text{sgn}\left( \sum_{i=1}^n \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b \right)
   $$

3. **Computational Advantage:**
   Even if $\mathcal{H}$ has infinite dimensions (as in the Radial Basis Function / Gaussian kernel $K(\mathbf{x}, \mathbf{z}) = \exp(-\gamma \|\mathbf{x} - \mathbf{z}\|^2)$), evaluating $K(\mathbf{x}_i, \mathbf{x})$ requires only $O(d)$ arithmetic operations in the original input space. The perceptron can learn non-linear decision boundaries with infinite expressive capacity.

---

### Exercise 1.7: Perceptron with Margin (Adaptive Margin Update)
**Problem Statement:**  
Suppose we modify the perceptron update condition so that an update occurs whenever $y_k (\mathbf{w}^T \mathbf{x}_k) \le \frac{\gamma}{2}$ (demanding a positive safety buffer).  
Prove that this algorithm still converges in finite steps if the data is separable with margin $\gamma$.

**Detailed Solution:**  
1. **Update Condition:**
   An update is triggered if $y_k (\mathbf{w}_t^T \mathbf{x}_k) \le \gamma / 2$.  
   Update rule: $\mathbf{w}_{t+1} = \mathbf{w}_t + y_k \mathbf{x}_k$.

2. **Lower Bound on $\mathbf{w}_t^T \mathbf{w}^*$:**
   As in the standard theorem, $\mathbf{w}_t^T \mathbf{w}^* \ge t \gamma$.

3. **Upper Bound on Norm:**
   $$
   \|\mathbf{w}_{t+1}\|_2^2 = \|\mathbf{w}_t\|_2^2 + 2 y_k (\mathbf{w}_t^T \mathbf{x}_k) + \|\mathbf{x}_k\|_2^2 \le \|\mathbf{w}_t\|_2^2 + 2\left(\frac{\gamma}{2}\right) + R^2 = \|\mathbf{w}_t\|_2^2 + \gamma + R^2
   $$
   Across $t$ updates:
   $$
   \|\mathbf{w}_t\|_2^2 \le t (R^2 + \gamma)
   $$

4. **Combining via Cauchy-Schwarz:**
   $$
   t^2 \gamma^2 \le t (R^2 + \gamma) \implies t \le \frac{R^2 + \gamma}{\gamma^2}
   $$
   The algorithm converges in at most $\frac{R^2 + \gamma}{\gamma^2}$ updates, successfully enforcing an internal margin.

---

### Exercise 1.8: Perceptron Cycling on 1D Contradictory Set
**Problem Statement:**  
Consider three 1D points: $x_1 = 1 (y_1 = +1)$, $x_2 = 2 (y_2 = -1)$, $x_3 = 3 (y_3 = +1)$.  
Prove that no linear threshold neuron $w x + b \ge 0$ can separate this set.

**Detailed Solution:**  
1. **System of Inequalities:**
   - Point 1 ($x_1 = 1, y_1 = +1$): $w(1) + b > 0 \implies w + b > 0$.
   - Point 2 ($x_2 = 2, y_2 = -1$): $w(2) + b < 0 \implies 2w + b < 0$.
   - Point 3 ($x_3 = 3, y_3 = +1$): $w(3) + b > 0 \implies 3w + b > 0$.

2. **Deducing Contradiction:**
   - From $w + b > 0$ and $2w + b < 0$:
     $$
     (2w + b) - (w + b) < 0 - 0 \implies w < 0
     $$
   - From $2w + b < 0$ and $3w + b > 0$:
     $$
     (3w + b) - (2w + b) > 0 - 0 \implies w > 0
     $$
   We obtain $w < 0$ and $w > 0$, an immediate mathematical impossibility. Thus, no 1D perceptron can separate alternating collinear points.

---

### Exercise 1.9: Perceptron Capacity and Cover's Function Counting Theorem
**Problem Statement:**  
Thomas Cover (1965) proved that the number of linearly separable binary dichotomies among $n$ points in general position in $\mathbb{R}^d$ is $C(n, d) = 2 \sum_{i=0}^{d} \binom{n - 1}{i}$.  
1. For $d = 2$, compute the maximum number of points $n$ such that **all** $2^n$ dichotomies are linearly separable.
2. What does this reveal about the statistical capacity of a 2D single neuron?

**Detailed Solution:**  
1. **Evaluating for Small $n$ ($d = 2$):**
   - For $n = 3$:
     $$
     C(3, 2) = 2 \left[ \binom{2}{0} + \binom{2}{1} + \binom{2}{2} \right] = 2 [1 + 2 + 1] = 2(4) = 8 = 2^3
     $$
     All 8 labelings of 3 non-collinear points in $\mathbb{R}^2$ are linearly separable!
   - For $n = 4$:
     $$
     C(4, 2) = 2 \left[ \binom{3}{0} + \binom{3}{1} + \binom{3}{2} \right] = 2 [1 + 3 + 3] = 2(7) = 14
     $$
     The total number of possible labelings is $2^4 = 16$. Because $14 < 16$, exactly $16 - 14 = 2$ labelings cannot be linearly separated (these are precisely the XOR and XNOR configurations!).

2. **Capacity Conclusion:**
   A 2D perceptron has a shattering capacity (Vapnik-Chervonenkis dimension) of $d + 1 = 3$. Beyond 3 points, linear separability is not guaranteed.

---

### Exercise 1.10: Rate Coding Equivalence in Artificial Neurons
**Problem Statement:**  
In biological neurophysiology, an axon transmits an action potential train whose instantaneous frequency $r(t)$ varies with injection current $I$.  
Using the Leaky Integrate-and-Fire (LIF) model with membrane resistance $R_m$ and time constant $\tau_m$, the firing rate is given by:
$$
r(I) = \begin{cases} \frac{1}{\tau_m \ln\left( \frac{R_m I}{R_m I - V_{\text{th}}} \right)} & \text{if } R_m I > V_{\text{th}} \\ 0 & \text{otherwise} \end{cases}
$$
Explain why replacing this biological rate function with a static mathematical non-linearity $f(z) = \text{ReLU}(z)$ captures the primary computational behavior while providing a million-fold speedup in computer simulations.

**Detailed Solution:**  
1. **Asymptotic Behavior of the LIF Rate Function:**
   When the input current $I$ exceeds threshold $V_{\text{th}} / R_m$, expanding the logarithm using $\ln(1 + u) \approx u$:
   $$
   \ln\left( \frac{R_m I}{R_m I - V_{\text{th}}} \right) = -\ln\left( 1 - \frac{V_{\text{th}}}{R_m I} \right) \approx \frac{V_{\text{th}}}{R_m I}
   $$
   Substituting into $r(I)$:
   $$
   r(I) \approx \frac{R_m I}{\tau_m V_{\text{th}}} \propto (I - I_{\text{th}})
   $$
   Above threshold, the firing rate scales linearly with input current! Below threshold, it is strictly zero.

2. **Equivalence to ReLU:**
   The function $f(z) = \max(0, z) = \text{ReLU}(z)$ is the exact mathematical idealization of this thresholded linear rate response:
   $$
   f(z) = \begin{cases} c(z - z_{\text{th}}) & z > z_{\text{th}} \\ 0 & z \le z_{\text{th}} \end{cases}
   $$

3. **Computational Efficiency:**
   Simulating differential equations with continuous spike integration requires numerical ODE integration at microsecond resolution ($\sim 10^6$ FLOPs per simulated second per neuron). The ReLU abstraction evaluates a simple floating-point comparison `x > 0 ? x : 0` in a single CPU/GPU clock cycle ($1$ FLOP), enabling billion-parameter networks to be trained on modern hardware.
