# Chapter 8: First-Order Optimization: Momentum, RMSprop, Adam, and AdamW

> *"Optimization in deep learning is not about finding the global minimum of a static function. It is a navigational odyssey through an ill-conditioned, non-convex landscape dominated by ravines, saddle points, and stochastic turbulence."*  
> — **Diederik P. Kingma & Jimmy Ba**, *Adam: A Method for Stochastic Optimization* (2014)

---

## 8.1 The Geometry of Loss Surfaces

The objective of training a neural network is to solve the unconstrained empirical risk minimization problem:
$$
\min_{\boldsymbol{\theta} \in \mathbb{R}^P} \mathcal{L}(\boldsymbol{\theta}) = \frac{1}{N} \sum_{i=1}^N \ell(y_i, f(\mathbf{x}_i; \boldsymbol{\theta}))
$$

In classical convex optimization, the objective function is bowl-shaped with a unique global minimum. In deep neural networks, however, the loss surface $\mathcal{L}(\boldsymbol{\theta})$ exists in a space of millions or billions of parameters ($P \gg 10^6$), exhibiting extreme non-convex geometric characteristics.

```
       Geometric Challenges in High-Dimensional Loss Landscapes
       
     Ill-Conditioned Ravine               Saddle Point (Index 1)
     
        ^ \theta_2                          ^ \theta_2
        |   \     /                         |      .---.   (Curvature along \theta_1 < 0)
        |    \   /                          |     /     \  (Curvature along \theta_2 > 0)
        |     \ /                           | ---*-------*---> \theta_1
        +------*------> \theta_1            |     \     /
        |     / \                           |      '---'
        |    /   \                          +------------------------->
        (Steep \theta_2, Flat \theta_1)     (Escaping saddle requires momentum)
```

### 8.1.1 The Hessian Matrix and Condition Number

Consider the second-order Taylor expansion of the loss function around a local point $\boldsymbol{\theta}_0$:
$$
\mathcal{L}(\boldsymbol{\theta}) \approx \mathcal{L}(\boldsymbol{\theta}_0) + \nabla \mathcal{L}(\boldsymbol{\theta}_0)^T (\boldsymbol{\theta} - \boldsymbol{\theta}_0) + \frac{1}{2} (\boldsymbol{\theta} - \boldsymbol{\theta}_0)^T \mathbf{H} (\boldsymbol{\theta} - \boldsymbol{\theta}_0)
$$
where $\mathbf{H} \in \mathbb{R}^{P \times P}$ is the **Hessian matrix** of second partial derivatives:
$$
H_{ij} = \frac{\partial^2 \mathcal{L}}{\partial \theta_i \partial \theta_j}
$$

Let the eigenvalues of the real symmetric Hessian $\mathbf{H}$ be denoted $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_P$.  
The local geometry is governed by the **condition number** $\kappa$:
$$
\kappa = \frac{\lambda_{\max}}{\lambda_{\min}} = \frac{\lambda_1}{\lambda_P}
$$

- **Isotropic Geometry ($\kappa \approx 1$):** The contours of the loss surface are hyperspheres. The negative gradient points directly toward the local minimum.
- **Ill-Conditioned Ravines ($\kappa \gg 1$):** The contours form elongated hyperellipsoids ("canyons" or "ravines"). In deep networks, condition numbers often exceed $\kappa \sim 10^6$ to $10^8$. The gradient vector points almost entirely along the steep vertical walls rather than along the gentle base toward the minimum. Standard gradient descent oscillates violently across the ravine, forcing the learning rate to be minuscule to prevent divergence.

### 8.1.2 Saddle Points vs. Local Minima

In high dimensions ($P \gg 1$), local minima are exceedingly rare. Dauphin et al. (2014) proved that critical points ($\nabla \mathcal{L} = \mathbf{0}$) in deep networks are overwhelmingly **saddle points**, where the Hessian possesses both positive and negative eigenvalues.  
For a critical point to be a local minimum, all $P$ eigenvalues must be strictly positive:
$$
P(\text{Local Minimum}) = \prod_{i=1}^P P(\lambda_i > 0) \sim 2^{-P} \approx 0
$$
To escape saddle points and flat plateaus, optimizers require kinetic energy—formalized as **momentum**.

---

## 8.2 Classical Stochastic Gradient Descent (SGD)

Standard Batch Gradient Descent updates parameters using the full dataset gradient:
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}_t)
$$
This requires $O(N)$ operations per update. In modern regimes where $N \sim 10^7$ or $10^9$, computing full-dataset gradients is intractable.

### 8.2.1 Mini-Batch Stochastic Sampling

In **Stochastic Gradient Descent (SGD)**, we approximate the true expectation by sampling a mini-batch $\mathcal{B}_t \subset \{1, \dots, N\}$ of size $B = |\mathcal{B}_t|$:
$$
\mathbf{g}_t = \frac{1}{B} \sum_{i \in \mathcal{B}_t} \nabla_{\boldsymbol{\theta}} \ell(y_i, f(\mathbf{x}_i; \boldsymbol{\theta}_t))
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \mathbf{g}_t
$$

#### Properties:
1. **Unbiased Estimator:**
   $$
   \mathbb{E}_{\mathcal{B}_t}[\mathbf{g}_t] = \nabla \mathcal{L}(\boldsymbol{\theta}_t)
   $$
2. **Gradient Covariance and Implicit Regularization:**
   The variance of the stochastic gradient estimator is:
   $$
   \operatorname{Cov}(\mathbf{g}_t) = \frac{1}{B} \boldsymbol{\Sigma}_{\text{data}}
   $$
   The stochastic noise injected by mini-batch sampling acts as implicit Langevin diffusion, enabling SGD to bounce out of sharp, poorly generalizing local minima and settle into broad, flat basins (Keskar et al., 2016).

---

## 8.3 Polyak Momentum (1964)

To conquer ill-conditioned ravines, Soviet mathematician Boris Polyak (1964) proposed the **Heavy-Ball Method**, modeling the optimizer as a physical particle with mass moving through a friction-dampened potential energy field.

```
       Polyak Momentum Dampens Oscillations and Accelerates Ravines
       
       ^ Ravine Wall
       |     \   /  (Without Momentum: zig-zag oscillation across steep walls)
       |      \ /
       |       *
       |      / \   (With Momentum: velocity accumulates along base of valley)
       |     /   \
       +----+---->----------------------------------------> Valley Base
```

### 8.3.1 Physical Analogy and Mathematical Formulation

Let $\mathbf{v}_t \in \mathbb{R}^P$ denote the instantaneous **velocity vector**. At each iteration $t$:
$$
\mathbf{v}_t = \beta \mathbf{v}_{t-1} + \mathbf{g}_t
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \mathbf{v}_t
$$
or in the alternative normalized exponential moving average form:
$$
\mathbf{v}_t = \beta \mathbf{v}_{t-1} + (1 - \beta) \mathbf{g}_t
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \mathbf{v}_t
$$
where $\beta \in [0, 1)$ is the momentum decay coefficient (typically $\beta = 0.9$).

### 8.3.2 Dynamics along Ravines

Unrolling the velocity vector over time:
$$
\mathbf{v}_t = \sum_{\tau=0}^{t-1} \beta^\tau \mathbf{g}_{t-\tau}
$$
1. **Along the Canyon Base (Consistent Direction):**
   If the gradient points in the same direction at every step ($g_k \approx g$), the velocity accumulates as a geometric series:
   $$
   v_\infty = g \sum_{\tau=0}^\infty \beta^\tau = \frac{g}{1 - \beta}
   $$
   For $\beta = 0.9$, $\frac{1}{1 - 0.9} = 10$. The effective speed along the floor of the ravine accelerates by a factor of **10**.
2. **Across the Canyon Walls (Oscillating Direction):**
   Along the steep vertical walls, gradients alternate signs: $+g, -g, +g, -g$.  
   The geometric sum cancels destructively:
   $$
   \sum_{\tau=0}^\infty (-1)^\tau \beta^\tau = \frac{1}{1 + \beta} \approx \frac{1}{1.9} \approx 0.53
   $$
   High-frequency oscillations are suppressed by half!

---

## 8.4 Nesterov Accelerated Gradient (NAG)

In 1983, Yurii Nesterov discovered an improved momentum formulation known as **Nesterov Accelerated Gradient (NAG)**.

```
       Polyak Momentum vs. Nesterov Accelerated Gradient
       
     Polyak:     theta_t ----[ + Momentum beta * v_{t-1} ]----> (Arrive) ----[ + Gradient g(theta_t) ]----> theta_{t+1}
     
     Nesterov:   theta_t ----[ + Momentum beta * v_{t-1} ]----> Projected \theta_{lookahead}
                                                                        |
                                                 [ + Gradient g(\theta_{lookahead}) ]
                                                                        v
                                                                   theta_{t+1}
```

In Polyak momentum, we evaluate the gradient at the current position $\boldsymbol{\theta}_t$ and then add the momentum jump.  
In Nesterov momentum, we make the momentum jump **first** to compute a "lookahead" point, evaluate the gradient at that future location, and apply a correction:
$$
\boldsymbol{\theta}_{\text{lookahead}} = \boldsymbol{\theta}_t - \beta \mathbf{v}_{t-1}
$$
$$
\mathbf{v}_t = \beta \mathbf{v}_{t-1} + \eta \nabla \mathcal{L}(\boldsymbol{\theta}_{\text{lookahead}})
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \mathbf{v}_t
$$

Nesterov momentum acts as an intelligent predictive braking mechanism: if the momentum is about to carry the particle up a steep opposing wall, the lookahead gradient detects the rising terrain early and applies reverse braking force before the overshoot occurs.  
On smooth convex functions, NAG improves the theoretical convergence rate from $O(1/k)$ to $O(1/k^2)$.

---

## 8.5 Adaptive Learning Rates: AdaGrad and RMSprop

While momentum applies a shared velocity vector, different parameters in a deep network frequently require vastly different learning rates. Coordinates associated with rare features receive infrequent, sparse updates, while common features receive continuous dense gradients.

### 8.5.1 AdaGrad (Duchi, Hazan, & Singer, 2011)

AdaGrad adapts the learning rate per-coordinate by dividing by the square root of the sum of all historical squared gradients:
$$
s_{t, i} = s_{t-1, i} + g_{t, i}^2
$$
$$
\theta_{t+1, i} = \theta_{t, i} - \frac{\eta}{\sqrt{s_{t, i}} + \epsilon} g_{t, i}
$$
where $\epsilon > 0$ (e.g., $10^{-8}$) prevents division by zero.

- **Advantage:** Frequently updated parameters experience large $s_{t, i}$, scaling down their effective learning rate. Rarely updated parameters experience small $s_{t, i}$, taking larger corrective jumps.
- **Fatal Flaw in Deep Learning:** Because $g_{t, i}^2 \ge 0$, the accumulator $s_{t, i}$ is strictly monotonically non-decreasing ($s_t \ge s_{t-1}$). As training progresses, $s_t \to \infty$, driving the effective learning rate $\frac{\eta}{\sqrt{s_t}} \to 0$. AdaGrad grinds to a premature halt early in training, unable to learn in deep architectures.

---

### 8.5.2 RMSprop (Geoffrey Hinton, 2012)

In Lecture 6e of his Coursera MOOC, Geoffrey Hinton introduced **RMSprop** (Root Mean Square Propagation) to fix AdaGrad's premature stopping pathology.  
Instead of accumulating all historical gradients over an infinite window, RMSprop replaces the monotonic sum with an **Exponential Moving Average (EMA)**:
$$
v_{t, i} = \beta v_{t-1, i} + (1 - \beta) g_{t, i}^2
$$
$$
\theta_{t+1, i} = \theta_{t, i} - \frac{\eta}{\sqrt{v_{t, i}} + \epsilon} g_{t, i}
$$
where $\beta \in [0, 1)$ is the decay factor (typically $\beta = 0.9$ or $0.99$).

Because $v_t$ is an exponential moving average, it represents the local variance over an effective temporal window of roughly $\frac{1}{1 - \beta}$ steps. The accumulator no longer grows monotonically, allowing the effective learning rate to increase or decrease dynamically based on local terrain curvature.

---

## 8.6 Adam: Adaptive Moment Estimation (Kingma & Ba, 2014)

In 2014, Diederik Kingma and Jimmy Ba combined the advantages of Polyak Momentum (first-moment tracking) with RMSprop (second-moment tracking) into **Adam** (Adaptive Moment Estimation). Adam has become the default workhorse optimizer across modern deep learning.

```
       The Mathematical Anatomy of the Adam Optimizer Update
       
       Gradient g_t  ----+
                         |---> First Moment:   m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t
                         +---> Second Moment:  v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2
                                                    |
                                      [ Bias Corrections ]
                                                    v
                               \hat{m}_t = m_t / (1 - \beta_1^t)
                               \hat{v}_t = v_t / (1 - \beta_2^t)
                                                    |
                                       [ Update Step ]
                                                    v
                               \theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t
```

### 8.6.1 Mathematical Formulation of Adam

At time step $t \ge 1$:
1. **Compute Mini-Batch Gradient:**
   $$
   \mathbf{g}_t = \nabla_{\boldsymbol{\theta}} \mathcal{L}(\boldsymbol{\theta}_t)
   $$
2. **Update Biased First Moment (Mean):**
   $$
   \mathbf{m}_t = \beta_1 \mathbf{m}_{t-1} + (1 - \beta_1) \mathbf{g}_t
   $$
3. **Update Biased Second Raw Moment (Uncentered Variance):**
   $$
   \mathbf{v}_t = \beta_2 \mathbf{v}_{t-1} + (1 - \beta_2) \mathbf{g}_t^2
   $$
4. **Compute Bias-Corrected First Moment:**
   $$
   \hat{\mathbf{m}}_t = \frac{\mathbf{m}_t}{1 - \beta_1^t}
   $$
5. **Compute Bias-Corrected Second Moment:**
   $$
   \hat{\mathbf{v}}_t = \frac{\mathbf{v}_t}{1 - \beta_2^t}
   $$
6. **Update Parameter Vector:**
   $$
   \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t
   $$

Standard recommended hyperparameter defaults:
- Learning rate: $\eta = 0.001$ ($10^{-3}$)
- First-moment decay: $\beta_1 = 0.9$
- Second-moment decay: $\beta_2 = 0.999$
- Numerical stabilizer: $\epsilon = 10^{-8}$

---

### 8.6.2 Analytical Derivation of Bias Correction Factors

Why are the factors $\frac{1}{1 - \beta_1^t}$ and $\frac{1}{1 - \beta_2^t}$ necessary?  
Because moment vectors are initialized to zero ($\mathbf{m}_0 = \mathbf{0}, \mathbf{v}_0 = \mathbf{0}$), their moving averages are severely biased toward zero during early training steps.

Let us unroll the first moment $\mathbf{m}_t$:
$$
\begin{aligned}
\mathbf{m}_1 &= (1 - \beta_1) \mathbf{g}_1 \\
\mathbf{m}_2 &= \beta_1 \mathbf{m}_1 + (1 - \beta_1) \mathbf{g}_2 = \beta_1(1 - \beta_1)\mathbf{g}_1 + (1 - \beta_1)\mathbf{g}_2 \\
\mathbf{m}_t &= (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i} \mathbf{g}_i
\end{aligned}
$$

Take the mathematical expectation of $\mathbf{m}_t$, assuming the true gradient expectation $\mathbb{E}[\mathbf{g}_i] = \mathbb{E}[\mathbf{g}]$ is stationary:
$$
\mathbb{E}[\mathbf{m}_t] = \mathbb{E}\left[ (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i} \mathbf{g}_i \right] = (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i} \mathbb{E}[\mathbf{g}] = \mathbb{E}[\mathbf{g}] (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i}
$$

Let $k = t - i$. As $i$ runs from $1$ to $t$, $k$ runs from $t-1$ down to $0$:
$$
\sum_{i=1}^t \beta_1^{t-i} = \sum_{k=0}^{t-1} \beta_1^k = \frac{1 - \beta_1^t}{1 - \beta_1}
$$

Substituting back:
$$
\mathbb{E}[\mathbf{m}_t] = \mathbb{E}[\mathbf{g}] (1 - \beta_1) \left( \frac{1 - \beta_1^t}{1 - \beta_1} \right) = \mathbb{E}[\mathbf{g}] (1 - \beta_1^t)
$$

Notice that $\mathbb{E}[\mathbf{m}_t] \neq \mathbb{E}[\mathbf{g}]$! At step $t = 1$ with $\beta_1 = 0.9$:
$$
1 - \beta_1^1 = 1 - 0.9 = 0.1 \implies \mathbb{E}[\mathbf{m}_1] = 0.1 \mathbb{E}[\mathbf{g}]
$$
The uncorrected estimate is underestimated by a factor of 10!  
Dividing by $1 - \beta_1^t$ eliminates this bias:
$$
\mathbb{E}[\hat{\mathbf{m}}_t] = \mathbb{E}\left[ \frac{\mathbf{m}_t}{1 - \beta_1^t} \right] = \frac{\mathbb{E}[\mathbf{g}] (1 - \beta_1^t)}{1 - \beta_1^t} = \mathbb{E}[\mathbf{g}] \quad \blacksquare
$$
An identical derivation proves that $\mathbb{E}[\hat{\mathbf{v}}_t] = \mathbb{E}[\mathbf{g}^2]$ by dividing by $1 - \beta_2^t$.  
As $t \to \infty$, $\beta^t \to 0$, so $1 - \beta^t \to 1$, naturally extinguishing the correction as the moving average reaches steady state.

---

## 8.7 AdamW: Decoupled Weight Decay (Loshchilov & Hutter, 2017)

In classical Stochastic Gradient Descent, $L_2$ weight regularization is mathematically equivalent to weight decay:
$$
\mathcal{L}_{\text{reg}}(\boldsymbol{\theta}) = \mathcal{L}(\boldsymbol{\theta}) + \frac{\lambda}{2} \|\boldsymbol{\theta}\|_2^2
$$
$$
\nabla \mathcal{L}_{\text{reg}}(\boldsymbol{\theta}) = \nabla \mathcal{L}(\boldsymbol{\theta}) + \lambda \boldsymbol{\theta}
$$
Under SGD:
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta (\nabla \mathcal{L} + \lambda \boldsymbol{\theta}_t) = (1 - \eta \lambda) \boldsymbol{\theta}_t - \eta \nabla \mathcal{L}
$$
Here, $(1 - \eta \lambda)$ shrinks the weights multiplicatively toward zero on every step (**weight decay**).

### 8.7.1 The Mathematical Breakdown of $L_2$ Regularization in Adaptive Optimizers

In standard implementations of Adam prior to 2017, libraries implemented weight decay by simply adding $\lambda \boldsymbol{\theta}$ to the loss gradient $\mathbf{g}_t$:
$$
\tilde{\mathbf{g}}_t = \mathbf{g}_t + \lambda \boldsymbol{\theta}_t
$$
Then $\tilde{\mathbf{g}}_t$ is passed into Adam's moment accumulators:
$$
\mathbf{m}_t = \beta_1 \mathbf{m}_{t-1} + (1 - \beta_1) (\mathbf{g}_t + \lambda \boldsymbol{\theta}_t)
$$
$$
\mathbf{v}_t = \beta_2 \mathbf{v}_{t-1} + (1 - \beta_2) (\mathbf{g}_t + \lambda \boldsymbol{\theta}_t)^2
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t
$$

When the system reaches steady state ($\hat{\mathbf{m}}_t \approx \mathbf{g} + \lambda \boldsymbol{\theta}$ and $\hat{\mathbf{v}}_t \approx (\mathbf{g} + \lambda \boldsymbol{\theta})^2$), the update is:
$$
\Delta \boldsymbol{\theta} \approx -\frac{\eta}{\sqrt{\hat{\mathbf{v}}_t}} \mathbf{g}_t - \frac{\eta \lambda}{\sqrt{\hat{\mathbf{v}}_t}} \boldsymbol{\theta}_t
$$

Notice the effective weight decay term:
$$
\text{Effective Weight Decay Rate} = \frac{\eta \lambda}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon}
$$
This reveals an architectural disaster:
1. **Inverse Variance Weight Penalty:** Parameters with large historical gradients (large $\hat{\mathbf{v}}_t$) have their weight decay penalty scaled **down** by $\frac{1}{\sqrt{\hat{\mathbf{v}}_t}}$!
2. **Excessive Penalty on Infrequent Features:** Parameters with small gradients (rare tokens in NLP) have near-zero $\hat{\mathbf{v}}_t$, subjecting them to massive, disproportionate weight decay penalties.

Consequently, Adam with $L_2$ regularization generalized far worse than SGD on complex tasks like computer vision and language modeling.

---

### 8.7.2 The AdamW Decoupled Formulation

Loshchilov and Hutter (2017) restored mathematical consistency by **decoupling** the weight decay from the gradient moments:
$$
\mathbf{m}_t = \beta_1 \mathbf{m}_{t-1} + (1 - \beta_1) \mathbf{g}_t \quad (\text{pure gradient})
$$
$$
\mathbf{v}_t = \beta_2 \mathbf{v}_{t-1} + (1 - \beta_2) \mathbf{g}_t^2 \quad (\text{pure gradient})
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \lambda \boldsymbol{\theta}_t - \frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t
$$

In **AdamW**:
1. The adaptive step $-\frac{\eta}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t$ depends strictly on the objective loss gradients $\mathbf{g}_t$.
2. The weight decay step $-\eta \lambda \boldsymbol{\theta}_t$ directly shrinks all weights uniformly by factor $(1 - \eta \lambda)$, completely independent of historical gradient magnitudes.

AdamW solved the generalization gap of Adam and is now the universal standard optimizer for modern Transformer models (LLaMA, GPT-4, Gemini, BERT, ViT).

---

## 8.8 Exactly 10 Worked Examples

### Example 8.1: Condition Number and Gradient Oscillation in an Anisotropic Valley
**Problem Statement:**  
Consider the 2D anisotropic quadratic bowl:
$$
f(x_1, x_2) = \frac{1}{2} (100 x_1^2 + x_2^2)
$$
1. Compute the Hessian matrix $\mathbf{H}$ and its condition number $\kappa$.
2. Compute the gradient vector $\nabla f(x_1, x_2)$ at point $(1.0, 1.0)$.
3. Trace two steps of standard gradient descent from $(1.0, 1.0)$ with learning rate $\eta = 0.015$.

**Step-by-Step Solution:**  
1. **Hessian and Condition Number:**
   $$
   \mathbf{H} = \begin{bmatrix} \frac{\partial^2 f}{\partial x_1^2} & \frac{\partial^2 f}{\partial x_1 \partial x_2} \\ \frac{\partial^2 f}{\partial x_2 \partial x_1} & \frac{\partial^2 f}{\partial x_2^2} \end{bmatrix} = \begin{bmatrix} 100 & 0 \\ 0 & 1 \end{bmatrix}
   $$
   Eigenvalues: $\lambda_{\max} = 100, \; \lambda_{\min} = 1$.  
   Condition number: $\kappa = \frac{100}{1} = 100$.

2. **Gradient at $(1.0, 1.0)$:**
   $$
   \nabla f(x_1, x_2) = \begin{bmatrix} 100 x_1 \\ x_2 \end{bmatrix} \implies \nabla f(1.0, 1.0) = \begin{bmatrix} 100 \\ 1 \end{bmatrix}
   $$
   The gradient points almost entirely along the steep $x_1$ axis ($100:1$ ratio).

3. **Gradient Descent Updates ($\eta = 0.015$):**
   - **Step 1:**
     $$
     x_1^{(1)} = x_1^{(0)} - \eta (100 x_1^{(0)}) = 1.0 - 0.015(100) = 1.0 - 1.5 = -0.5
     $$
     $$
     x_2^{(1)} = x_2^{(0)} - \eta (x_2^{(0)}) = 1.0 - 0.015(1) = 0.985
     $$
     Point 1: $(-0.5, 0.985)$. The coordinate $x_1$ overshot the minimum and flipped sign!
   - **Step 2:**
     $\nabla f(-0.5, 0.985) = [-50.0, 0.985]^T$.
     $$
     x_1^{(2)} = -0.5 - 0.015(-50.0) = -0.5 + 0.75 = +0.25
     $$
     $$
     x_2^{(2)} = 0.985 - 0.015(0.985) \approx 0.970
     $$
     Point 2: $(+0.25, 0.970)$.  
   Coordinate $x_1$ oscillates wildly between positive and negative values, while $x_2$ crawls forward imperceptibly ($1.0 \to 0.985 \to 0.970$).

---

### Example 8.2: Polyak Momentum Velocity Trace across 3 Steps
**Problem Statement:**  
In the 1D valley from Example 8.1, consider the flat coordinate where gradient is constantly $g = 1.0$.  
Let momentum parameter be $\beta = 0.9$ and learning rate $\eta = 0.1$.  
Starting from $v_0 = 0$ and $x_0 = 10.0$, compute $v_1, x_1, v_2, x_2, v_3, x_3$, and find the asymptotic velocity $v_\infty$.

**Step-by-Step Solution:**  
Using update rules: $v_t = \beta v_{t-1} + g_t$ and $x_t = x_{t-1} - \eta v_t$.
- **Step 1:**
  $$
  v_1 = 0.9(0) + 1.0 = 1.0
  $$
  $$
  x_1 = 10.0 - 0.1(1.0) = 9.90
  $$
- **Step 2:**
  $$
  v_2 = 0.9(1.0) + 1.0 = 1.90
  $$
  $$
  x_2 = 9.90 - 0.1(1.90) = 9.71
  $$
- **Step 3:**
  $$
  v_3 = 0.9(1.90) + 1.0 = 1.71 + 1.0 = 2.71
  $$
  $$
  x_3 = 9.71 - 0.1(2.71) = 9.439
  $$
- **Asymptotic Limit:**
  $$
  v_\infty = \frac{g}{1 - \beta} = \frac{1.0}{1 - 0.9} = \frac{1.0}{0.1} = 10.0
  $$
  The effective parameter displacement per step approaches $\eta v_\infty = 0.1(10.0) = 1.0$, a $10\times$ acceleration over standard SGD ($\eta g = 0.1$).

---

### Example 8.3: Nesterov Accelerated Gradient Lookahead Trace
**Problem Statement:**  
Let $f(x) = x^2$. At step $t$, parameter is $x_t = 2.0$ and historical velocity is $v_{t-1} = 1.5$.  
Let $\beta = 0.8$ and $\eta = 0.1$.  
1. Compute the update using Polyak Momentum.
2. Compute the update using Nesterov Accelerated Gradient.

**Step-by-Step Solution:**  
1. **Polyak Momentum:**
   - Current gradient: $g(x_t) = 2 x_t = 2(2.0) = 4.0$.
   - Velocity update: $v_t = \beta v_{t-1} + g(x_t) = 0.8(1.5) + 4.0 = 1.2 + 4.0 = 5.2$.
   - Position update:
     $$
     x_{t+1} = x_t - \eta v_t = 2.0 - 0.1(5.2) = 2.0 - 0.52 = 1.48
     $$

2. **Nesterov Accelerated Gradient (NAG):**
   - Lookahead projected position:
     $$
     x_{\text{ahead}} = x_t - \beta \eta v_{t-1} = 2.0 - 0.8(0.1)(1.5) = 2.0 - 0.12 = 1.88
     $$
   - Lookahead gradient: $g(x_{\text{ahead}}) = 2(1.88) = 3.76$.
   - Velocity update: $v_t = 0.8(1.5) + 3.76 = 1.2 + 3.76 = 4.96$.
   - Position update:
     $$
     x_{t+1} = x_t - \eta v_t = 2.0 - 0.1(4.96) = 2.0 - 0.496 = 1.504
     $$
   Notice that NAG evaluated a smaller gradient ($3.76$ vs $4.0$), applying predictive damping that prevents excessive overshoot.

---

### Example 8.4: AdaGrad vs. RMSprop on a Non-Stationary Sequence
**Problem Statement:**  
Consider a parameter receiving gradients $g_t = 10.0$ for steps $t = 1, \dots, 5$ (steep region), followed by small gradients $g_t = 0.1$ for steps $t = 6, \dots, 10$ (flat plateau).  
Compare the effective learning rate scale factor $\frac{1}{\sqrt{s_t}}$ of AdaGrad versus $\frac{1}{\sqrt{v_t}}$ of RMSprop ($\beta = 0.9$) at step $t = 10$.

**Step-by-Step Solution:**  
1. **AdaGrad Accumulator at $t = 10$:**
   $$
   s_{10} = \sum_{t=1}^5 (10.0)^2 + \sum_{t=6}^{10} (0.1)^2 = 5(100) + 5(0.01) = 500 + 0.05 = 500.05
   $$
   Scale factor:
   $$
   \frac{1}{\sqrt{s_{10}}} = \frac{1}{\sqrt{500.05}} \approx \frac{1}{22.36} \approx 0.0447
   $$
   Even though the current gradients are small ($0.1$), the learning rate remains heavily suppressed by the distant past.

2. **RMSprop Moving Average at $t = 10$:**
   At $t = 5$, $v_5 \approx 100$.  
   For $t = 6$ to $10$, gradients are $0.1 \implies g^2 = 0.01$:
   - $v_6 = 0.9(100) + 0.1(0.01) = 90.001$
   - $v_7 = 0.9(90.001) + 0.001 \approx 81.00$
   - $v_8 = 0.9(81.0) + 0.001 \approx 72.90$
   - $v_9 = 0.9(72.9) + 0.001 \approx 65.61$
   - $v_{10} = 0.9(65.61) + 0.001 \approx 59.05$
   As plateau continues for 20 more steps ($t = 30$):
   $$
   v_\infty \to 0.01 \implies \frac{1}{\sqrt{v_{30}}} \to \frac{1}{\sqrt{0.01}} = 10.0
   $$
   RMSprop recovers its agility and scales up the step size on flat terrain, whereas AdaGrad remains permanently paralyzed.

---

### Example 8.5: Analytical Derivation of Adam Bias Correction Factor
**Problem Statement:**  
Derive the second moment bias correction factor $\frac{1}{1 - \beta_2^t}$ showing that $\mathbb{E}[\hat{v}_t] = \mathbb{E}[g^2]$.

**Step-by-Step Solution:**  
1. **Unroll the Recurrence:**
   $$
   v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2
   $$
   With $v_0 = 0$:
   $$
   v_t = (1 - \beta_2) \sum_{i=1}^t \beta_2^{t-i} g_i^2
   $$

2. **Take Mathematical Expectation:**
   Assuming the true second moment $\mathbb{E}[g_i^2] = \sigma_g^2$ is stationary:
   $$
   \mathbb{E}[v_t] = (1 - \beta_2) \sum_{i=1}^t \beta_2^{t-i} \mathbb{E}[g_i^2] = \sigma_g^2 (1 - \beta_2) \sum_{k=0}^{t-1} \beta_2^k
   $$

3. **Finite Geometric Series Formula:**
   $$
   \sum_{k=0}^{t-1} \beta_2^k = \frac{1 - \beta_2^t}{1 - \beta_2}
   $$

4. **Substitute and Simplify:**
   $$
   \mathbb{E}[v_t] = \sigma_g^2 (1 - \beta_2) \left( \frac{1 - \beta_2^t}{1 - \beta_2} \right) = \sigma_g^2 (1 - \beta_2^t)
   $$
   Dividing both sides by $1 - \beta_2^t$:
   $$
   \mathbb{E}\left[ \frac{v_t}{1 - \beta_2^t} \right] = \sigma_g^2 = \mathbb{E}[g^2] \quad \blacksquare
   $$

---

### Example 8.6: Numerical Step-by-Step Adam Update (Steps 1 and 2)
**Problem Statement:**  
A single parameter $\theta$ is optimized with Adam ($\eta = 0.1, \beta_1 = 0.9, \beta_2 = 0.99, \epsilon = 10^{-8}$).  
Initial parameter is $\theta_0 = 5.0$.  
Observed gradients are: $g_1 = 2.0$ at step 1, and $g_2 = 1.0$ at step 2.  
Compute $\theta_1$ and $\theta_2$ explicitly.

**Step-by-Step Solution:**  
1. **Step 1 ($t = 1, g_1 = 2.0$):**
   - Biased moments:
     $$
     m_1 = \beta_1(0) + (1 - \beta_1) g_1 = 0.1(2.0) = 0.2
     $$
     $$
     v_1 = \beta_2(0) + (1 - \beta_2) g_1^2 = (1 - 0.99)(2.0)^2 = 0.01(4.0) = 0.04
     $$
   - Bias corrections:
     $$
     \hat{m}_1 = \frac{m_1}{1 - \beta_1^1} = \frac{0.2}{1 - 0.9} = \frac{0.2}{0.1} = 2.0
     $$
     $$
     \hat{v}_1 = \frac{v_1}{1 - \beta_2^1} = \frac{0.04}{1 - 0.99} = \frac{0.04}{0.01} = 4.0
     $$
   - Update:
     $$
     \theta_1 = \theta_0 - \frac{\eta}{\sqrt{\hat{v}_1} + \epsilon} \hat{m}_1 = 5.0 - \frac{0.1}{\sqrt{4.0} + 10^{-8}} (2.0) = 5.0 - \frac{0.1}{2.0}(2.0) = 5.0 - 0.1 = 4.90
     $$

2. **Step 2 ($t = 2, g_2 = 1.0$):**
   - Biased moments:
     $$
     m_2 = \beta_1 m_1 + (1 - \beta_1) g_2 = 0.9(0.2) + 0.1(1.0) = 0.18 + 0.10 = 0.28
     $$
     $$
     v_2 = \beta_2 v_1 + (1 - \beta_2) g_2^2 = 0.99(0.04) + 0.01(1.0)^2 = 0.0396 + 0.01 = 0.0496
     $$
   - Bias corrections:
     $$
     1 - \beta_1^2 = 1 - (0.9)^2 = 1 - 0.81 = 0.19 \implies \hat{m}_2 = \frac{0.28}{0.19} \approx 1.47368
     $$
     $$
     1 - \beta_2^2 = 1 - (0.99)^2 = 1 - 0.9801 = 0.0199 \implies \hat{v}_2 = \frac{0.0496}{0.0199} \approx 2.49246
     $$
   - Update:
     $$
     \sqrt{\hat{v}_2} = \sqrt{2.49246} \approx 1.57875
     $$
     $$
     \theta_2 = 4.90 - \frac{0.1}{1.57875} (1.47368) = 4.90 - 0.06334(1.47368) = 4.90 - 0.09334 = 4.80666
     $$

---

### Example 8.7: Numerical Demonstration of Adam $L_2$ Regularization Failure
**Problem Statement:**  
Compare two weights $\theta_A = 10.0$ and $\theta_B = 10.0$ trained with standard Adam ($L_2$ regularization $\lambda = 0.1$ added to gradients).  
Weight $\theta_A$ has large objective gradients ($g_A = 10.0$), while $\theta_B$ has small objective gradients ($g_B = 0.01$).  
Show that the effective weight shrinkage penalty on $\theta_A$ is nearly $1000\times$ weaker than on $\theta_B$.

**Step-by-Step Solution:**  
1. **Total Regularized Gradients:**
   $$
   \tilde{g}_A = g_A + \lambda \theta_A = 10.0 + 0.1(10.0) = 10.0 + 1.0 = 11.0
   $$
   $$
   \tilde{g}_B = g_B + \lambda \theta_B = 0.01 + 0.1(10.0) = 0.01 + 1.0 = 1.01
   $$

2. **Second Moment Scale Factors:**
   Assuming steady state $\sqrt{\hat{v}} \approx |\tilde{g}|$:
   - For Weight A: $\sqrt{\hat{v}_A} \approx 11.0$.
     $$
     \text{Weight Decay Update Component} = \frac{\eta}{\sqrt{\hat{v}_A}} (\lambda \theta_A) = \frac{\eta}{11.0} (1.0) \approx 0.0909 \eta
     $$
   - For Weight B: $\sqrt{\hat{v}_B} \approx 1.01$.
     $$
     \text{Weight Decay Update Component} = \frac{\eta}{\sqrt{\hat{v}_B}} (\lambda \theta_B) = \frac{\eta}{1.01} (1.0) \approx 0.9901 \eta
     $$

3. **Comparison:**
   $$
   \frac{\text{Penalty on } B}{\text{Penalty on } A} = \frac{0.9901}{0.0909} \approx 10.89
   $$
   Even though both parameters have the exact same magnitude ($\theta = 10.0$) and regularizer weight ($\lambda = 0.1$), Weight B is penalized roughly $11\times$ harder solely because its loss gradient was smaller! If $g_B$ were $10^{-4}$, the disparity exceeds $1000\times$.

---

### Example 8.8: AdamW Decoupled Weight Decay Trace
**Problem Statement:**  
Repeat Example 8.7 using **AdamW** with decoupled weight decay $\lambda = 0.1$ and $\eta = 0.01$.  
Compute the exact weight decay updates for $\theta_A$ and $\theta_B$.

**Step-by-Step Solution:**  
1. **Decoupled Update Formula:**
   $$
   \Delta \theta_{\text{decay}} = -\eta \lambda \theta
   $$

2. **Evaluate for Both Weights:**
   - For $\theta_A = 10.0$:
     $$
     \Delta \theta_{A, \text{decay}} = -0.01(0.1)(10.0) = -0.01
     $$
   - For $\theta_B = 10.0$:
     $$
     \Delta \theta_{B, \text{decay}} = -0.01(0.1)(10.0) = -0.01
     $$

3. **Conclusion:**  
   Both weights experience the exact same weight decay penalty of $-0.01$. Decoupled weight decay treats all weights uniformly, restoring true $L_2$ regularization semantics.

---

### Example 8.9: Cosine Annealing Learning Rate Schedule with Warmup
**Problem Statement:**  
A model trains for $T_{\text{total}} = 100,000$ steps with peak learning rate $\eta_{\max} = 10^{-3}$, minimum rate $\eta_{\min} = 10^{-5}$, and linear warmup over $T_{\text{warmup}} = 5,000$ steps.  
1. Write the mathematical piecewise formula for $\eta_t$.
2. Compute $\eta_t$ at steps $t = 2,500$, $t = 5,000$, and $t = 52,500$.

**Step-by-Step Solution:**  
1. **Piecewise Formula:**
   - **Warmup Phase ($0 \le t \le T_{\text{warmup}}$):**
     $$
     \eta_t = \frac{t}{T_{\text{warmup}}} \eta_{\max}
     $$
   - **Cosine Decay Phase ($T_{\text{warmup}} < t \le T_{\text{total}}$):**
     $$
     \eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min}) \left( 1 + \cos\left( \pi \frac{t - T_{\text{warmup}}}{T_{\text{total}} - T_{\text{warmup}}} \right) \right)
     $$

2. **Evaluations:**
   - **At $t = 2,500$ (Mid-warmup):**
     $$
     \eta_{2500} = \frac{2500}{5000} \times 10^{-3} = 0.5 \times 10^{-3} = 5 \times 10^{-4}
     $$
   - **At $t = 5,000$ (End of warmup):**
     $$
     \eta_{5000} = \frac{5000}{5000} \times 10^{-3} = 10^{-3} = \eta_{\max}
     $$
   - **At $t = 52,500$ (Midway through decay):**
     $$
     \frac{t - T_{\text{warmup}}}{T_{\text{total}} - T_{\text{warmup}}} = \frac{52500 - 5000}{100000 - 5000} = \frac{47500}{95000} = 0.5
     $$
     $$
     \cos(\pi \times 0.5) = \cos\left(\frac{\pi}{2}\right) = 0.0
     $$
     $$
     \eta_{52500} = 10^{-5} + \frac{1}{2}(10^{-3} - 10^{-5}) (1 + 0) = 10^{-5} + \frac{0.00099}{2} = 0.00001 + 0.000495 = 5.05 \times 10^{-4}
     $$

---

### Example 8.10: Effective Step Size Bound in Adam
**Problem Statement:**  
Prove that the magnitude of an individual coordinate step in Adam is bounded by:
$$
|\Delta \theta_{t, i}| \le \eta \frac{1 - \beta_1}{\sqrt{1 - \beta_2}} \quad (\text{for } \epsilon \to 0)
$$

**Step-by-Step Solution:**  
1. **Adam Update Magnitude:**
   $$
   |\Delta \theta_t| = \eta \frac{|\hat{m}_t|}{\sqrt{\hat{v}_t}} = \eta \frac{|m_t| / (1 - \beta_1^t)}{\sqrt{v_t / (1 - \beta_2^t)}} = \eta \frac{\sqrt{1 - \beta_2^t}}{1 - \beta_1^t} \frac{|m_t|}{\sqrt{v_t}}
   $$

2. **Bounding the Ratio $|m_t| / \sqrt{v_t}$:**
   From unrolled sums:
   $$
   |m_t| = \left| (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i} g_i \right| \le (1 - \beta_1) \sum_{i=1}^t \beta_1^{t-i} |g_i|
   $$
   $$
   v_t = (1 - \beta_2) \sum_{i=1}^t \beta_2^{t-i} g_i^2
   $$
   By Cauchy-Schwarz inequality, the ratio attains its maximum when a single massive gradient impulse occurs ($g_t = G$, all prior $g_i = 0$):
   $$
   m_t = (1 - \beta_1) G, \quad v_t = (1 - \beta_2) G^2
   $$
   $$
   \frac{|m_t|}{\sqrt{v_t}} = \frac{(1 - \beta_1) G}{\sqrt{1 - \beta_2} G} = \frac{1 - \beta_1}{\sqrt{1 - \beta_2}}
   $$

3. **Bounding the Step:**
   $$
   |\Delta \theta_t| \le \eta \frac{1 - \beta_1}{\sqrt{1 - \beta_2}} \frac{\sqrt{1 - \beta_2^t}}{1 - \beta_1^t} \approx \eta \frac{1 - \beta_1}{\sqrt{1 - \beta_2}} \quad \blacksquare
   $$
   For standard defaults $\beta_1 = 0.9, \beta_2 = 0.999$:
   $$
   \frac{1 - 0.9}{\sqrt{1 - 0.999}} = \frac{0.1}{\sqrt{0.001}} = \frac{0.1}{0.03162} \approx 3.16
   $$
   The maximum parameter displacement in a single step can never exceed $3.16 \times \eta$, providing built-in gradient clipping.

---

## 8.9 Exactly 10 Solved Exercises

### Exercise 8.1: Optimal Learning Rate and Convergence of Gradient Descent on a Quadratic
**Problem Statement:**  
Let $f(\mathbf{x}) = \frac{1}{2} \mathbf{x}^T \mathbf{A} \mathbf{x}$ where $\mathbf{A} \in \mathbb{R}^{d \times d}$ is positive definite with eigenvalues $\lambda_{\max} \ge \dots \ge \lambda_{\min} > 0$.  
Prove that gradient descent $\mathbf{x}_{t+1} = \mathbf{x}_t - \eta \nabla f(\mathbf{x}_t)$ converges to the origin if and only if $\eta < \frac{2}{\lambda_{\max}}$, and find the optimal learning rate $\eta^*$ that minimizes the spectral radius.

**Detailed Solution:**  
1. **Recurrence Relation:**
   $\nabla f(\mathbf{x}) = \mathbf{A} \mathbf{x}$.
   $$
   \mathbf{x}_{t+1} = \mathbf{x}_t - \eta \mathbf{A} \mathbf{x}_t = (\mathbf{I} - \eta \mathbf{A}) \mathbf{x}_t
   $$
   After $t$ steps: $\mathbf{x}_t = (\mathbf{I} - \eta \mathbf{A})^t \mathbf{x}_0$.

2. **Convergence Condition:**
   Convergence $\mathbf{x}_t \to \mathbf{0}$ requires the spectral radius $\rho(\mathbf{I} - \eta \mathbf{A}) < 1$.  
   The eigenvalues of $\mathbf{I} - \eta \mathbf{A}$ are $\mu_i = 1 - \eta \lambda_i$.
   $$
   |1 - \eta \lambda_i| < 1 \iff -1 < 1 - \eta \lambda_i < 1 \iff 0 < \eta \lambda_i < 2 \iff \eta < \frac{2}{\lambda_i}
   $$
   For this to hold for all eigenvalues:
   $$
   \eta < \frac{2}{\lambda_{\max}} \quad \blacksquare
   $$

3. **Optimal Learning Rate $\eta^*$:**
   We seek to minimize the worst-case spectral radius:
   $$
   \min_\eta \max(|1 - \eta \lambda_{\max}|, |1 - \eta \lambda_{\min}|)
   $$
   Equating the extreme errors:
   $$
   1 - \eta \lambda_{\min} = -(1 - \eta \lambda_{\max}) \implies 2 = \eta (\lambda_{\max} + \lambda_{\min})
   $$
   $$
   \eta^* = \frac{2}{\lambda_{\max} + \lambda_{\min}} \quad \blacksquare
   $$
   The optimal convergence rate factor is:
   $$
   \rho^* = \frac{\lambda_{\max} - \lambda_{\min}}{\lambda_{\max} + \lambda_{\min}} = \frac{\kappa - 1}{\kappa + 1}
   $$
   When $\kappa \gg 1$, $\rho^* \approx 1 - \frac{2}{\kappa}$, proving that ill-conditioned ravines require $\Omega(\kappa)$ steps to converge under standard gradient descent.

---

### Exercise 8.2: Polyak Momentum Stationary Velocity in Constant Fields
**Problem Statement:**  
Prove that under Polyak momentum $\mathbf{v}_t = \beta \mathbf{v}_{t-1} + (1 - \beta) \mathbf{g}$ with constant gradient $\mathbf{g}$, the stationary velocity is $\mathbf{v}_\infty = \mathbf{g}$.

**Detailed Solution:**  
1. **Stationary State Equation:**
   At steady state, $\mathbf{v}_t = \mathbf{v}_{t-1} = \mathbf{v}_\infty$.
   $$
   \mathbf{v}_\infty = \beta \mathbf{v}_\infty + (1 - \beta) \mathbf{g}
   $$

2. **Solving for $\mathbf{v}_\infty$:**
   $$
   \mathbf{v}_\infty - \beta \mathbf{v}_\infty = (1 - \beta) \mathbf{g} \implies (1 - \beta) \mathbf{v}_\infty = (1 - \beta) \mathbf{g}
   $$
   Dividing by $1 - \beta \neq 0$:
   $$
   \mathbf{v}_\infty = \mathbf{g} \quad \blacksquare
   $$

---

### Exercise 8.3: Nesterov Momentum as Momentum with a Lookahead Correction Term
**Problem Statement:**  
Show that Nesterov Accelerated Gradient can be rewritten in terms of the current position $\boldsymbol{\theta}_t$ as:
$$
\mathbf{v}_t = \beta \mathbf{v}_{t-1} + \eta \mathbf{g}_t
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \mathbf{g}_t - \beta \mathbf{v}_t
$$

**Detailed Solution:**  
1. **Standard NAG Formulation:**
   $$
   \mathbf{y}_t = \boldsymbol{\theta}_t - \beta \mathbf{v}_{t-1}
   $$
   $$
   \mathbf{v}_t = \beta \mathbf{v}_{t-1} + \eta \nabla \mathcal{L}(\mathbf{y}_t)
   $$
   $$
   \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \mathbf{v}_t
   $$

2. **Change of Variables (Bengio et al., 2013):**
   Define sequence $\boldsymbol{\theta}'_t = \boldsymbol{\theta}_t - \beta \mathbf{v}_{t-1}$.  
   Then the update equations can be computed entirely using current gradients without maintaining a separate projected state:
   $$
   \mathbf{v}_t = \beta \mathbf{v}_{t-1} + \eta \mathbf{g}(\boldsymbol{\theta}_t)
   $$
   $$
   \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - (\beta \mathbf{v}_t + \eta \mathbf{g}_t)
   $$
   This equivalent formulation is implemented in PyTorch (`torch.optim.SGD(..., nesterov=True)`).

---

### Exercise 8.4: AMSGrad Fix for Non-Convergence in Adam
**Problem Statement:**  
Reddi, Kale, and Kumar (2018) proved that Adam can fail to converge even on simple 1D convex problems when large gradients occur infrequently, causing the second moment $v_t$ to decay.  
State the **AMSGrad** modification and explain why it guarantees a non-increasing learning rate.

**Detailed Solution:**  
1. **The Vulnerability in Adam:**
   In Adam, $v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2$. If a large gradient occurs at step $t_0$ followed by small gradients, $v_t$ decays exponentially. The effective step size $\frac{\eta}{\sqrt{v_t}}$ expands rapidly, which can cause the optimizer to overshoot and cycle infinitely.

2. **The AMSGrad Formulation:**
   AMSGrad maintains the maximum historical second moment:
   $$
   \hat{v}_t = \max(\hat{v}_{t-1}, v_t)
   $$
   $$
   \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \mathbf{m}_t
   $$

3. **Guarantee:**
   Because $\hat{v}_t \ge \hat{v}_{t-1}$ by definition of the $\max$ operator, the effective learning rate denominator $\sqrt{\hat{v}_t}$ is strictly non-decreasing. This prevents step-size explosions and establishes a formal convergence proof for bounded convex objectives.

---

### Exercise 8.5: Lion Optimizer: Evolved Sign Momentum
**Problem Statement:**  
Chen et al. (2023) discovered the **Lion** (evoLved Sign Momentum) optimizer via symbolic program search:
$$
\mathbf{c}_t = \operatorname{sign}(\beta_1 \mathbf{m}_{t-1} + (1 - \beta_1) \mathbf{g}_t)
$$
$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \mathbf{c}_t - \eta \lambda \boldsymbol{\theta}_t
$$
$$
\mathbf{m}_t = \beta_2 \mathbf{m}_{t-1} + (1 - \beta_2) \mathbf{g}_t
$$
1. Compare the memory tracking footprint of Lion versus Adam.
2. Explain the role of the $\operatorname{sign}$ operator.

**Detailed Solution:**  
1. **Memory Footprint:**
   - Adam tracks **two** state tensors per parameter: first moment $\mathbf{m} \in \mathbb{R}^P$ and second moment $\mathbf{v} \in \mathbb{R}^P$ ($8$ bytes per parameter in FP32).
   - Lion tracks only **one** state tensor: momentum $\mathbf{m} \in \mathbb{R}^P$ ($4$ bytes per parameter).  
   Lion reduces optimizer state memory by $50\%$, saving dozens of gigabytes of VRAM when training billion-parameter models.

2. **Role of the Sign Operator:**
   The $\operatorname{sign}(\cdot)$ operator normalizes every update coordinate to have unit magnitude $\pm 1$:
   $$
   c_{t, i} \in \{-1, +1\}
   $$
   This makes the step size strictly uniform across all parameters ($|\Delta \theta_i| = \eta$), making Lion robust to gradient scale variations and outlier spikes.

---

### Exercise 8.6: Learning Rate Warmup Rationale
**Problem Statement:**  
Explain why training massive Transformer models with Adam requires a **linear warmup** schedule during early steps ($t < 5000$).

**Detailed Solution:**  
1. **High Variance of Early Second Moment Estimator:**
   In early steps $t$, $v_t = (1 - \beta_2) \sum_{i=1}^t \beta_2^{t-i} g_i^2$ averages over only $t$ samples.  
   Liu et al. (2019, RAdam) showed that the degrees of freedom of the second-moment estimator is approximately $\frac{2}{1 - \beta_2} - 1 \approx 2000$. For $t \ll 2000$, the variance of $\hat{v}_t$ is enormous.
2. **Explosive Step Sizes:**
   If an early batch produces a small gradient $g_{t, i} \approx 0$, $\hat{v}_{t, i}$ becomes nearly zero. The effective step size $\frac{\eta}{\sqrt{\hat{v}_t} + \epsilon}$ surges toward its maximum bound, triggering chaotic, destructive parameter updates before the moving average stabilizes.
3. **Warmup Solution:**
   Ramping $\eta$ linearly from $0$ to $\eta_{\max}$ restricts step magnitudes while the moment accumulators $\mathbf{m}_t$ and $\mathbf{v}_t$ populate reliable statistical baselines.

---

### Exercise 8.7: Gradient Noise Covariance and Saddle Point Escape
**Problem Statement:**  
Ge et al. (2015) showed that stochastic gradient noise enables escaping strict saddle points in polynomial time.  
Let $\boldsymbol{\theta}_0$ be a saddle point where $\nabla \mathcal{L}(\boldsymbol{\theta}_0) = \mathbf{0}$ and the Hessian has negative eigenvalue $\lambda_1 < 0$ along unit eigenvector $\mathbf{u}_1$.  
Show that deterministic gradient descent cannot escape $\boldsymbol{\theta}_0$, while stochastic gradient descent with noise $\mathbb{E}[(\mathbf{g}^T \mathbf{u}_1)^2] = \sigma^2 > 0$ breaks the equilibrium.

**Detailed Solution:**  
1. **Deterministic Gradient Descent:**
   $$
   \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \nabla \mathcal{L}(\boldsymbol{\theta}_t)
   $$
   At the critical point: $\nabla \mathcal{L}(\boldsymbol{\theta}_0) = \mathbf{0} \implies \boldsymbol{\theta}_1 = \boldsymbol{\theta}_0 - \mathbf{0} = \boldsymbol{\theta}_0$.  
   Deterministic gradient descent is permanently trapped at the saddle point.

2. **Stochastic Gradient Descent:**
   $$
   \boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta (\nabla \mathcal{L}(\boldsymbol{\theta}_t) + \boldsymbol{\xi}_t) = \boldsymbol{\theta}_t - \eta \boldsymbol{\xi}_t
   $$
   Projection along the unstable eigenvector $\mathbf{u}_1$:
   $$
   z_{t+1} = \mathbf{u}_1^T (\boldsymbol{\theta}_{t+1} - \boldsymbol{\theta}_0) \approx (1 - \eta \lambda_1) z_t - \eta (\mathbf{u}_1^T \boldsymbol{\xi}_t)
   $$
   Since $\lambda_1 < 0$, the multiplier is $\alpha = 1 - \eta \lambda_1 = 1 + \eta |\lambda_1| > 1.0$.  
   The stochastic perturbation $\xi$ injects energy along $\mathbf{u}_1$, which is then amplified exponentially by $\alpha^t = (1 + \eta |\lambda_1|)^t > 1$. The parameter rapidly escapes along the downward ridge.

---

### Exercise 8.8: Adafactor: Memory Reduction via Low-Rank Matrix Factorization
**Problem Statement:**  
For a matrix parameter $\mathbf{W} \in \mathbb{R}^{R \times C}$, Adam stores second moment $\mathbf{V} \in \mathbb{R}^{R \times C}$ ($R \times C$ floats).  
Adafactor (Shazeer & Stern, 2018) factors $\mathbf{V}$ into row and column marginals:
$$
\mathbf{r} = \frac{1}{C} \mathbf{V} \mathbf{1}_C \in \mathbb{R}^R, \quad \mathbf{c} = \frac{1}{R} \mathbf{1}_R^T \mathbf{V} \in \mathbb{R}^C
$$
reconstructing $\hat{\mathbf{V}} = \frac{\mathbf{r} \mathbf{c}^T}{\mathbf{1}^T \mathbf{r}}$.  
For $R = 4096, C = 4096$, compute the memory savings in bytes.

**Detailed Solution:**  
1. **Adam Memory Footprint:**
   $$
   \text{Mem}_{\text{Adam}} = R \times C \times 4 \text{ bytes} = 4096 \times 4096 \times 4 = 16,777,216 \times 4 = 67,108,864 \text{ bytes} \approx 67.11 \text{ MB}
   $$

2. **Adafactor Memory Footprint:**
   Stores only vector $\mathbf{r} \in \mathbb{R}^{4096}$ and vector $\mathbf{c} \in \mathbb{R}^{4096}$:
   $$
   \text{Mem}_{\text{Adafactor}} = (R + C) \times 4 \text{ bytes} = (4096 + 4096) \times 4 = 8192 \times 4 = 32,768 \text{ bytes} = 32 \text{ KB}
   $$

3. **Memory Reduction Ratio:**
   $$
   \frac{67,108,864 \text{ bytes}}{32,768 \text{ bytes}} = 2048\times \text{ reduction!}
   $$
   Adafactor achieves a $99.95\%$ reduction in second-moment storage, enabling training of massive language models with limited GPU memory.

---

### Exercise 8.9: Polyak Momentum as an Exact Discretization of a Second-Order ODE
**Problem Statement:**  
Show that Polyak momentum corresponds to the Euler discretization of the classical damped harmonic oscillator physical differential equation:
$$
m \frac{d^2 \boldsymbol{\theta}}{dt^2} + \gamma \frac{d\boldsymbol{\theta}}{dt} + \nabla \mathcal{L}(\boldsymbol{\theta}) = \mathbf{0}
$$

**Detailed Solution:**  
1. **Finite Difference Approximations:**
   Let time step be $\Delta t$.
   - Velocity: $\frac{d\boldsymbol{\theta}}{dt} \approx \frac{\boldsymbol{\theta}_{t+1} - \boldsymbol{\theta}_t}{\Delta t}$.
   - Acceleration: $\frac{d^2 \boldsymbol{\theta}}{dt^2} \approx \frac{\boldsymbol{\theta}_{t+1} - 2\boldsymbol{\theta}_t + \boldsymbol{\theta}_{t-1}}{\Delta t^2}$.

2. **Substitute into Differential Equation:**
   $$
   m \left( \frac{\boldsymbol{\theta}_{t+1} - 2\boldsymbol{\theta}_t + \boldsymbol{\theta}_{t-1}}{\Delta t^2} \right) + \gamma \left( \frac{\boldsymbol{\theta}_{t+1} - \boldsymbol{\theta}_t}{\Delta t} \right) + \nabla \mathcal{L}(\boldsymbol{\theta}_t) = \mathbf{0}
   $$
   Rearranging:
   $$
   \left( \frac{m}{\Delta t^2} + \frac{\gamma}{\Delta t} \right) (\boldsymbol{\theta}_{t+1} - \boldsymbol{\theta}_t) = \frac{m}{\Delta t^2} (\boldsymbol{\theta}_t - \boldsymbol{\theta}_{t-1}) - \nabla \mathcal{L}(\boldsymbol{\theta}_t)
   $$

3. **Identifying Momentum Terms:**
   Let displacement velocity be $\mathbf{v}_t = \boldsymbol{\theta}_{t+1} - \boldsymbol{\theta}_t$.  
   Dividing by $(m / \Delta t^2 + \gamma / \Delta t)$:
   $$
   \mathbf{v}_t = \beta \mathbf{v}_{t-1} - \eta \nabla \mathcal{L}(\boldsymbol{\theta}_t)
   $$
   where friction $\gamma$ determines decay $\beta = \frac{m}{m + \gamma \Delta t} \in (0, 1)$, and mass determines effective learning rate $\eta = \frac{\Delta t^2}{m + \gamma \Delta t}$.  
   Thus, Polyak momentum is the exact discrete simulation of a heavy particle rolling down the loss potential surface under physical friction.

---

### Exercise 8.10: Weight Decay Invariance in Batch-Normalized Networks
**Problem Statement:**  
In a neural network with scale-invariant activations (such as linear layers followed by Batch Normalization or Layer Normalization, where $f(\alpha \mathbf{W}) = f(\mathbf{W})$):  
Prove that applying decoupled weight decay $\Delta \mathbf{W} = -\eta \lambda \mathbf{W}$ continuously decreases $\|\mathbf{W}\|_F$, which paradoxically **increases** the effective learning rate.

**Detailed Solution:**  
1. **Scale Invariance Property:**
   Because normalization scales by standard deviation $\sigma_{\mathbf{W} \mathbf{x}} = \alpha \sigma_{\mathbf{x}}$, the forward activation is independent of weight norm:
   $$
   \operatorname{Norm}(\alpha \mathbf{W} \mathbf{x}) = \operatorname{Norm}(\mathbf{W} \mathbf{x}) \implies \mathcal{L}(\alpha \mathbf{W}) = \mathcal{L}(\mathbf{W})
   $$

2. **Gradient Scaling:**
   By the chain rule on scale invariance:
   $$
   \nabla_{\mathbf{W}} \mathcal{L}(\alpha \mathbf{W}) = \frac{1}{\alpha} \nabla_{\mathbf{W}} \mathcal{L}(\mathbf{W})
   $$
   The gradient is inversely proportional to the norm of the weights:
   $$
   \|\nabla_{\mathbf{W}} \mathcal{L}\| \propto \frac{1}{\|\mathbf{W}\|_F}
   $$

3. **Effective Step Size Dynamics:**
   The relative change in weights per gradient descent step is:
   $$
   \frac{\|\Delta \mathbf{W}\|_F}{\|\mathbf{W}\|_F} = \frac{\eta \|\nabla_{\mathbf{W}} \mathcal{L}\|_F}{\|\mathbf{W}\|_F} \propto \frac{\eta}{\|\mathbf{W}\|_F^2}
   $$
   The **effective learning rate** is $\eta_{\text{eff}} = \frac{\eta}{\|\mathbf{W}\|_F^2}$.

4. **Impact of Weight Decay:**
   Decoupled weight decay shrinks $\|\mathbf{W}\|_F$.  
   As $\|\mathbf{W}\|_F$ shrinks, the denominator of $\eta_{\text{eff}}$ decreases, causing the effective learning rate to **increase**!  
   In normalized networks, weight decay does not regularize by shrinking parameter magnitudes; instead, it acts as an **accelerator** that controls the effective learning rate on the unit hypersphere (van Laarhoven, 2017).
