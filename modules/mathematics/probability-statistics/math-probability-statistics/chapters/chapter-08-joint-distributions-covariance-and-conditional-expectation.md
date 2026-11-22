# Chapter 8: Joint Distributions, Covariance, and Conditional Expectation

> *"The calculus of probabilities cannot stop at the boundary of isolated phenomena. In nature as in human society, no event unfolds in a vacuum; every variable is coupled, entangled, or conditioned by the state of its companions."*  
> — **Émile Borel**, *Calcul des Probabilités* (1909)

---

## 8.1 Joint PMFs and Joint PDFs: Multidimensional Probability Landscapes

In single-variable probability theory, random variables act as scalar probes into a sample space, measuring an isolated quantity such as the waiting time for an event, the number of defects in a silicon wafer, or the height of an organism. Yet reality is fundamentally multivariate. A robot navigating three-dimensional terrain does not merely experience independent scalar coordinates; its position $(X, Y, Z)$, velocity $(\dot{X}, \dot{Y}, \dot{Z})$, and sensor noise are intrinsically linked. An algorithmic trading agent evaluates asset prices whose fluctuations are tethered by macroeconomic constraints. 

To formalize simultaneous uncertainty over multiple random variables, we extend probability measures from single-dimensional Borel lines to multidimensional Euclidean spaces $\mathbb{R}^n$.

### 8.1.1 The Discrete Joint Probability Mass Function

Let $(\Omega, \mathcal{F}, P)$ be a probability space, and let $X: \Omega \to \mathcal{X}$ and $Y: \Omega \to \mathcal{Y}$ be discrete random variables taking values in countable support sets $\mathcal{X} \subset \mathbb{R}$ and $\mathcal{Y} \subset \mathbb{R}$. The **joint probability mass function (joint PMF)** $p_{X,Y}: \mathbb{R}^2 \to [0, 1]$ is defined by:
$$
p_{X,Y}(x, y) = P(X = x \text{ and } Y = y) = P(\{\omega \in \Omega : X(\omega) = x\} \cap \{\omega \in \Omega : Y(\omega) = y\})
$$

The joint PMF satisfies two fundamental Kolmogorov conditions:
1. **Non-negativity:**
   $$
   p_{X,Y}(x, y) \ge 0 \quad \forall (x, y) \in \mathbb{R}^2
   $$
2. **Total Normalization:**
   $$
   \sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p_{X,Y}(x, y) = 1
   $$

For any subset $A \subseteq \mathbb{R}^2$, the probability that the vector $(X, Y)$ falls within $A$ is given by the discrete sum:
$$
P((X, Y) \in A) = \sum_{(x, y) \in A} p_{X,Y}(x, y)
$$

```
     Joint PMF Distribution Grid p_{X,Y}(x, y)
    y
    ^
    |   0.05    0.15    0.10   <- Sum along row = p_Y(y)
 2  +---------+---------+---------+
    |   0.10    0.20    0.10   |
 1  +---------+---------+---------+
    |   0.15    0.10    0.05   |
 0  +---------+---------+---------+
    +---------+---------+---------> x
         0         1         2
         ^
         |-- Sum down column = p_X(x)
```

### 8.1.2 The Continuous Joint Probability Density Function

When $X$ and $Y$ are continuous random variables, the probability of the pair $(X, Y)$ assuming any single exact coordinate $(x, y) \in \mathbb{R}^2$ is zero:
$$
P(X = x, Y = y) = 0
$$

Probability mass exists only over two-dimensional planar regions. We say that $X$ and $Y$ are **jointly continuous** if there exists an integrable non-negative function $f_{X,Y}: \mathbb{R}^2 \to [0, \infty)$, called the **joint probability density function (joint PDF)**, such that for every measurable set $A \subseteq \mathbb{R}^2$:
$$
P((X, Y) \in A) = \iint_A f_{X,Y}(x, y) \, dx \, dy
$$

The joint PDF must satisfy:
1. **Non-negativity:**
   $$
   f_{X,Y}(x, y) \ge 0 \quad \forall (x, y) \in \mathbb{R}^2
   $$
2. **Total Volume Normalization:**
   $$
   \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} f_{X,Y}(x, y) \, dx \, dy = 1
   $$

The joint PDF represents probability density per unit area. In an infinitesimal rectangle $[x, x + dx] \times [y, y + dy]$, the probability differential is:
$$
P(x \le X \le x + dx, \; y \le Y \le y + dy) \approx f_{X,Y}(x, y) \, dx \, dy
$$

```
         Joint Continuous Density Surface f_{X,Y}(x, y)
                 z = f(x, y)
                     /\
                    /  \   <- 3D Probability Hill
                   /    \
                  /______\
                 /        \
       y        /__________\
       ^       /            \
       |      +--------------+
       |     /              /
       |    /    [dx x dy] /
       |   +--------------+
       +-----------------------> x
           Infinitesimal Volume: dP = f(x, y) dx dy
```

### 8.1.3 The Joint Cumulative Distribution Function (Joint CDF)

The unified mathematical foundation bridging discrete, continuous, and mixed multivariate random variables is the **joint Cumulative Distribution Function (joint CDF)**:
$$
F_{X,Y}(x, y) = P(X \le x, Y \le y) = P(\{\omega : X(\omega) \le x\} \cap \{\omega : Y(\omega) \le y\})
$$

The joint CDF possesses rigorous analytical properties:
1. **Monotonicity:** $F_{X,Y}(x, y)$ is non-decreasing in each argument individually:
   $$
   x_1 \le x_2 \implies F_{X,Y}(x_1, y) \le F_{X,Y}(x_2, y)
   $$
   $$
   y_1 \le y_2 \implies F_{X,Y}(x, y_1) \le F_{X,Y}(x, y_2)
   $$
2. **Asymptotic Limits:**
   $$
   \lim_{x \to -\infty} F_{X,Y}(x, y) = 0, \quad \lim_{y \to -\infty} F_{X,Y}(x, y) = 0
   $$
   $$
   \lim_{(x, y) \to (\infty, \infty)} F_{X,Y}(x, y) = 1
   $$
3. **Right-Continuity:** $F_{X,Y}(x, y)$ is continuous from above in both variables:
   $$
   \lim_{h \downarrow 0} F_{X,Y}(x + h, y) = F_{X,Y}(x, y), \quad \lim_{k \downarrow 0} F_{X,Y}(x, y + k) = F_{X,Y}(x, y)
   $$
4. **Rectangular Probability Non-Negativity:** For any rectangle $[x_1, x_2] \times [y_1, y_2]$ with $x_1 < x_2$ and $y_1 < y_2$, the probability of falling inside the box must be non-negative:
   $$
   P(x_1 < X \le x_2, \; y_1 < Y \le y_2) = F_{X,Y}(x_2, y_2) - F_{X,Y}(x_1, y_2) - F_{X,Y}(x_2, y_1) + F_{X,Y}(x_1, y_1) \ge 0
   $$

When $F_{X,Y}(x, y)$ is twice continuously differentiable, the continuous joint PDF is obtained via mixed partial differentiation:
$$
f_{X,Y}(x, y) = \frac{\partial^2 F_{X,Y}(x, y)}{\partial x \, \partial y}
$$

---

## 8.2 Marginal Distributions: Collapsing Dimensions

When observing a complex multivariate system $(X, Y)$, we often need to analyze one variable in isolation, irrespective of the other. The operation of discarding nuisance variables is called **marginalization**.

### 8.2.1 Discrete Marginals: Summing Over Slices

For discrete random variables $(X, Y)$ governed by joint PMF $p_{X,Y}(x, y)$, the **marginal probability mass function** of $X$ is obtained by summing the joint probabilities over all possible realizations of $Y$:
$$
p_X(x) = P(X = x) = \sum_{y \in \mathcal{Y}} P(X = x, Y = y) = \sum_{y \in \mathcal{Y}} p_{X,Y}(x, y)
$$
Symmetrically, the marginal PMF of $Y$ is:
$$
p_Y(y) = P(Y = y) = \sum_{x \in \mathcal{X}} p_{X,Y}(x, y)
$$

This operation corresponds directly to computing row or column totals in a joint probability table. The terminology "marginal" originates historically from the accounting practice of writing these collapsed sums in the margins of ledger tables.

### 8.2.2 Continuous Marginals: Integrating Out Dimensions

For jointly continuous random variables with joint density $f_{X,Y}(x, y)$, the marginal density $f_X(x)$ represents the cross-sectional slice of total probability volume along the line $X = x$. Integrating across all $y \in (-\infty, \infty)$ yields:
$$
f_X(x) = \int_{-\infty}^{\infty} f_{X,Y}(x, y) \, dy
$$
Likewise, integrating across all $x \in (-\infty, \infty)$ gives:
$$
f_Y(y) = \int_{-\infty}^{\infty} f_{X,Y}(x, y) \, dx
$$

In terms of the joint CDF, the marginal CDFs are obtained by evaluating the limit as the unobserved variable approaches infinity:
$$
F_X(x) = \lim_{y \to \infty} F_{X,Y}(x, y) = F_{X,Y}(x, \infty)
$$
$$
F_Y(y) = \lim_{x \to \infty} F_{X,Y}(x, y) = F_{X,Y}(\infty, y)
$$

### 8.2.3 Independence of Random Variables

Two random variables $X$ and $Y$ are **independent** if and only if their joint distribution factorizes into the product of their marginal distributions for all values in their support:

- **Discrete Case:**
  $$
  p_{X,Y}(x, y) = p_X(x) \, p_Y(y) \quad \forall (x, y) \in \mathcal{X} \times \mathcal{Y}
  $$
- **Continuous Case:**
  $$
  f_{X,Y}(x, y) = f_X(x) \, f_Y(y) \quad \text{almost everywhere on } \mathbb{R}^2
  $$
- **General CDF Formulation:**
  $$
  F_{X,Y}(x, y) = F_X(x) \, F_Y(y) \quad \forall (x, y) \in \mathbb{R}^2
  $$

> [!IMPORTANT]
> **Support Factorization Condition:** A necessary (but not sufficient) condition for continuous independence is that the support set $S \subseteq \mathbb{R}^2$ where $f_{X,Y}(x, y) > 0$ must be a **Cartesian product of intervals** (i.e., a rectangle, infinite strip, or $\mathbb{R}^2$). If the boundaries of $y$ depend on $x$ (e.g., a triangular support $0 \le x \le y \le 1$ or a circular disk $x^2 + y^2 \le 1$), $X$ and $Y$ **cannot** be independent, because knowing $X$ restricts the possible values of $Y$.

---

## 8.3 Conditional Distributions: Slicing and Renormalization

When we observe that $X$ takes on a specific value $x$, our uncertainty regarding $Y$ must update. Conditioning in multivariate spaces is the continuous or discrete analogue of updating prior probabilities upon observing an evidence event $E$.

### 8.3.1 Conditional Discrete PMFs

If $p_X(x) > 0$, the **conditional PMF** of $Y$ given $X = x$ is defined via the elementary conditional probability formula:
$$
p_{Y \mid X}(y \mid x) = P(Y = y \mid X = x) = \frac{P(X = x, Y = y)}{P(X = x)} = \frac{p_{X,Y}(x, y)}{p_X(x)}
$$

For a fixed $x$, $p_{Y \mid X}(\cdot \mid x)$ is a valid probability mass function over $\mathcal{Y}$:
$$
p_{Y \mid X}(y \mid x) \ge 0, \quad \sum_{y \in \mathcal{Y}} p_{Y \mid X}(y \mid x) = \sum_{y \in \mathcal{Y}} \frac{p_{X,Y}(x, y)}{p_X(x)} = \frac{p_X(x)}{p_X(x)} = 1
$$

### 8.3.2 Conditional Continuous PDFs: The Borel-Kolmogorov Resolution

In the continuous realm, the conditioning event $\{X = x\}$ has probability zero ($P(X = x) = 0$). Naive division $\frac{P(X=x, Y \le y)}{P(X=x)} = \frac{0}{0}$ is undefined. We resolve this by taking the limit of conditioning on an infinitesimal band $X \in [x, x + \Delta x]$ as $\Delta x \downarrow 0$:
$$
\begin{aligned}
P(Y \le y \mid X \in [x, x + \Delta x]) &= \frac{P(X \in [x, x + \Delta x], Y \le y)}{P(X \in [x, x + \Delta x])} \\
&= \frac{\int_{-\infty}^y \int_x^{x + \Delta x} f_{X,Y}(u, v) \, du \, dv}{\int_x^{x + \Delta x} f_X(u) \, du}
\end{aligned}
$$
By the Mean Value Theorem for integrals, as $\Delta x \to 0$, the inner integrals evaluate to $f_{X,Y}(x, v) \Delta x$ and $f_X(x) \Delta x$. The $\Delta x$ terms cancel:
$$
F_{Y \mid X}(y \mid x) = \lim_{\Delta x \downarrow 0} P(Y \le y \mid X \in [x, x + \Delta x]) = \int_{-\infty}^y \frac{f_{X,Y}(x, v)}{f_X(x)} \, dv
$$

Differentiating with respect to $y$ yields the **conditional probability density function (conditional PDF)**:
$$
f_{Y \mid X}(y \mid x) = \frac{f_{X,Y}(x, y)}{f_X(x)} \quad \text{for } f_X(x) > 0
$$

Geometrically, $f_{Y \mid X}(y \mid x)$ is obtained by slicing the 3D surface $z = f_{X,Y}(u, v)$ at the plane $u = x$, producing a 2D profile curve $g(y) = f_{X,Y}(x, y)$, and dividing by its total area under the curve $f_X(x) = \int g(y) \, dy$ so that the resulting function integrates to exactly 1.

```
       Slicing the Joint PDF at Plane X = x:
             z ^
               |       Plane X = x
               |         |   /
               |         |  /  Cross-section curve: g(y) = f(x, y)
               |        _|_/_ 
               |       / | / \
               |      /  |/   \
               |     /___|_____\
               |    /    |/     \
               +----+----+-------+---> y
                   /    x       /
                  /            /
                 +------------+
                /
               v x
       Renormalization: f_{Y|X}(y|x) = f(x, y) / Area = f(x, y) / f_X(x)
```

---

## 8.4 Covariance, Pearson Correlation, and the Covariance Matrix

While independence requires the joint distribution to factorize completely ($f(x, y) = f_X(x) f_Y(y)$), random variables in nature often exhibit intermediate degrees of mutual variation. We require quantitative measures to gauge the strength and direction of linear association.

### 8.4.1 Covariance: Signed Co-Variation

Let $X$ and $Y$ be random variables with finite means $\mu_X = \mathbb{E}[X]$ and $\mu_Y = \mathbb{E}[Y]$. The **covariance** between $X$ and $Y$ is defined as the expected product of their deviations from their respective means:
$$
\text{Cov}(X, Y) = \mathbb{E}[(X - \mu_X)(Y - \mu_Y)]
$$

Expanding the expectation algebraically using linearity:
$$
\begin{aligned}
\text{Cov}(X, Y) &= \mathbb{E}[XY - \mu_X Y - \mu_Y X + \mu_X \mu_Y] \\
&= \mathbb{E}[XY] - \mu_X \mathbb{E}[Y] - \mu_Y \mathbb{E}[X] + \mu_X \mu_Y \\
&= \mathbb{E}[XY] - \mu_X \mu_Y - \mu_Y \mu_X + \mu_X \mu_Y \\
&= \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]
\end{aligned}
$$

The quantity $\mathbb{E}[XY]$ is termed the **joint moment** or **correlation** of $X$ and $Y$.

#### Fundamental Properties of Covariance:
1. **Symmetry:**
   $$
   \text{Cov}(X, Y) = \text{Cov}(Y, X)
   $$
2. **Self-Covariance is Variance:**
   $$
   \text{Cov}(X, X) = \mathbb{E}[(X - \mu_X)^2] = \text{Var}(X)
   $$
3. **Bilinearity:** For constants $a, b, c, d \in \mathbb{R}$:
   $$
   \text{Cov}(aX + b, cY + d) = ac \, \text{Cov}(X, Y)
   $$
4. **Distributivity over Sums:** For random variables $X_1, \dots, X_n$ and $Y_1, \dots, Y_m$:
   $$
   \text{Cov}\left(\sum_{i=1}^n X_i, \sum_{j=1}^m Y_j\right) = \sum_{i=1}^n \sum_{j=1}^m \text{Cov}(X_i, Y_j)
   $$
5. **Variance of a Linear Combination:**
   $$
   \text{Var}(aX + bY) = a^2 \text{Var}(X) + b^2 \text{Var}(Y) + 2ab \, \text{Cov}(X, Y)
   $$
6. **Independence Implies Zero Covariance:** If $X$ and $Y$ are independent, $\mathbb{E}[XY] = \mathbb{E}[X]\mathbb{E}[Y]$, whence:
   $$
   \text{Cov}(X, Y) = 0
   $$

> [!WARNING]
> **Uncorrelatedness Does Not Imply Independence:** The converse is false. $\text{Cov}(X, Y) = 0$ implies only the absence of a *linear* relationship. For example, if $X \sim \mathcal{U}(-1, 1)$ and $Y = X^2$, then $\mathbb{E}[X] = 0$, $\mathbb{E}[XY] = \mathbb{E}[X^3] = 0$, so $\text{Cov}(X, Y) = 0$. However, $Y$ is completely deterministic given $X$; they are maximally dependent!

### 8.4.2 Pearson Correlation Coefficient ($\rho$)

A primary deficiency of covariance is that its magnitude depends directly on the units of measurement. If $X$ is measured in meters and we convert it to millimeters, $\text{Cov}(X, Y)$ scales by $1000$, even though the intrinsic relationship between the variables is unchanged.

To produce a scale-invariant, dimensionless metric, Karl Pearson normalized covariance by the product of the standard deviations:
$$
\rho_{X,Y} = \text{Corr}(X, Y) = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} = \frac{\mathbb{E}[(X - \mu_X)(Y - \mu_Y)]}{\sqrt{\text{Var}(X)}\sqrt{\text{Var}(Y)}}
$$

#### Theorem: Pearson Correlation Bounds $[-1, 1]$
For any random variables $X$ and $Y$ with non-zero, finite variances:
$$
-1 \le \rho_{X,Y} \le 1
$$
Furthermore, $|\rho_{X,Y}| = 1$ if and only if there exist constants $a \neq 0$ and $b$ such that $Y = aX + b$ almost surely, with $\rho = +1$ if $a > 0$ and $\rho = -1$ if $a < 0$.

*Proof via the Cauchy-Schwarz Inequality:*  
Define standardized zero-mean, unit-variance random variables:
$$
\tilde{X} = \frac{X - \mu_X}{\sigma_X}, \quad \tilde{Y} = \frac{Y - \mu_Y}{\sigma_Y}
$$
Notice that $\mathbb{E}[\tilde{X}^2] = 1$, $\mathbb{E}[\tilde{Y}^2] = 1$, and $\mathbb{E}[\tilde{X}\tilde{Y}] = \rho$. Consider the non-negative expected square of their linear combination for any $t \in \mathbb{R}$:
$$
Q(t) = \mathbb{E}[(t\tilde{X} - \tilde{Y})^2] \ge 0
$$
Expanding the square:
$$
Q(t) = t^2 \mathbb{E}[\tilde{X}^2] - 2t \mathbb{E}[\tilde{X}\tilde{Y}] + \mathbb{E}[\tilde{Y}^2] = t^2 - 2\rho t + 1 \ge 0
$$
$Q(t)$ is a quadratic polynomial in $t$. For a quadratic $A t^2 + B t + C \ge 0$ to remain non-negative for all $t \in \mathbb{R}$, its discriminant $\Delta = B^2 - 4AC$ must be non-positive:
$$
\Delta = (-2\rho)^2 - 4(1)(1) = 4\rho^2 - 4 \le 0 \implies \rho^2 \le 1 \implies -1 \le \rho \le 1
$$
If $\rho = 1$, then $\Delta = 0$, meaning there exists a root $t^* = 1$ such that $\mathbb{E}[(\tilde{X} - \tilde{Y})^2] = 0$, which requires $\tilde{X} = \tilde{Y}$ almost surely, establishing an exact positive affine relation. $\blacksquare$

### 8.4.3 The Covariance Matrix ($\mathbf{\Sigma}$)

For a random vector $\mathbf{X} = [X_1, X_2, \dots, X_n]^T \in \mathbb{R}^n$ with mean vector $\boldsymbol{\mu} = \mathbb{E}[\mathbf{X}] = [\mu_1, \dots, \mu_n]^T$, the pairwise covariances are arranged into the **covariance matrix** $\mathbf{\Sigma} \in \mathbb{R}^{n \times n}$:
$$
\mathbf{\Sigma} = \text{Cov}(\mathbf{X}) = \mathbb{E}[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^T] = \begin{bmatrix}
\text{Var}(X_1) & \text{Cov}(X_1, X_2) & \cdots & \text{Cov}(X_1, X_n) \\
\text{Cov}(X_2, X_1) & \text{Var}(X_2) & \cdots & \text{Cov}(X_2, X_n) \\
\vdots & \vdots & \ddots & \vdots \\
\text{Cov}(X_n, X_1) & \text{Cov}(X_n, X_2) & \cdots & \text{Var}(X_n)
\end{bmatrix}
$$

#### Key Properties of $\mathbf{\Sigma}$:
1. **Symmetric:** Since $\text{Cov}(X_i, X_j) = \text{Cov}(X_j, X_i)$, $\mathbf{\Sigma} = \mathbf{\Sigma}^T$.
2. **Positive Semi-Definite (PSD):** For any deterministic vector $\mathbf{v} \in \mathbb{R}^n$:
   $$
   \mathbf{v}^T \mathbf{\Sigma} \mathbf{v} = \mathbf{v}^T \mathbb{E}[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^T] \mathbf{v} = \mathbb{E}\left[\mathbf{v}^T (\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^T \mathbf{v}\right] = \mathbb{E}\left[(\mathbf{v}^T(\mathbf{X} - \boldsymbol{\mu}))^2\right] \ge 0
   $$
   The quadratic form $\mathbf{v}^T \mathbf{\Sigma} \mathbf{v}$ is the variance of the scalar random variable $Y = \mathbf{v}^T \mathbf{X}$. Because variance cannot be negative, $\mathbf{\Sigma} \succeq 0$.
3. **Eigenvalues are Real and Non-Negative:** $\lambda_i \ge 0 \quad \forall i \in \{1, \dots, n\}$.
4. **Determinant Non-Negative:** $\det(\mathbf{\Sigma}) = \prod_{i=1}^n \lambda_i \ge 0$. For a $2 \times 2$ covariance matrix:
   $$
   \det(\mathbf{\Sigma}) = \sigma_1^2 \sigma_2^2 - \text{Cov}(X_1, X_2)^2 = \sigma_1^2 \sigma_2^2 (1 - \rho^2) \ge 0
   $$

---

## 8.5 Conditional Expectation as a Random Variable & The Tower Property

In introductory courses, conditional expectation is often introduced as a single number: given that $X$ takes the specific value $x$, $\mathbb{E}[Y \mid X = x]$ is a scalar expectation. However, in advanced probability and statistical learning theory, conditional expectation is elevated to an entirely new concept: **a random variable in its own right**.

### 8.5.1 The Definition of $\mathbb{E}[Y \mid X]$

Before we observe the realization of $X$, the quantity $\mathbb{E}[Y \mid X = x]$ is a function of $x$. Let this function be denoted:
$$
g(x) = \mathbb{E}[Y \mid X = x] = \begin{cases}
\sum_{y} y \, p_{Y \mid X}(y \mid x) & \text{(discrete)} \\[8pt]
\int_{-\infty}^{\infty} y \, f_{Y \mid X}(y \mid x) \, dy & \text{(continuous)}
\end{cases}
$$

When we plug the random variable $X$ into $g(\cdot)$, we obtain a new random variable:
$$
g(X) = \mathbb{E}[Y \mid X]
$$

Notice the profound distinction:
- $\mathbb{E}[Y]$ is a deterministic **scalar constant**.
- $\mathbb{E}[Y \mid X = x]$ is a deterministic **scalar value** conditioned on the observed event $\{X = x\}$.
- $\mathbb{E}[Y \mid X]$ is a **random variable** that is measurable with respect to the $\sigma$-algebra generated by $X$ ($\sigma(X)$). It fluctuates across trials as $X$ fluctuates.

```
       Random Variable Y (Total Space Omega)
                 |
                 v   Conditional Expectation Projection
           E[Y | X] = g(X)
                 |
                 +---> Evaluates to scalar g(x) when X(omega) = x
```

### 8.5.2 The Law of Total Expectation (The Tower Property)

What is the expected value of this new random variable $\mathbb{E}[Y \mid X]$? Taking the expectation of $g(X)$ across all values of $X$ recovers the unconditional expectation of $Y$.

#### Theorem: Law of Total Expectation (Adam's Law / Tower Property)
For any random variables $X$ and $Y$ defined on the same probability space with $\mathbb{E}[|Y|] < \infty$:
$$
\mathbb{E}\big[\mathbb{E}[Y \mid X]\big] = \mathbb{E}[Y]
$$

*Proof (Continuous Case):*
By the Law of the Unconscious Statistician (LOTUS), the expectation of $g(X)$ with respect to the marginal density $f_X(x)$ is:
$$
\begin{aligned}
\mathbb{E}\big[\mathbb{E}[Y \mid X]\big] &= \int_{-\infty}^{\infty} g(x) f_X(x) \, dx \\
&= \int_{-\infty}^{\infty} \left[ \int_{-\infty}^{\infty} y \, f_{Y \mid X}(y \mid x) \, dy \right] f_X(x) \, dx
\end{aligned}
$$
Substituting $f_{Y \mid X}(y \mid x) = \frac{f_{X,Y}(x, y)}{f_X(x)}$:
$$
= \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} y \, \frac{f_{X,Y}(x, y)}{f_X(x)} f_X(x) \, dy \, dx = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} y \, f_{X,Y}(x, y) \, dy \, dx
$$
By Fubini's Theorem, we interchange the order of integration:
$$
= \int_{-\infty}^{\infty} y \left[ \int_{-\infty}^{\infty} f_{X,Y}(x, y) \, dx \right] dy = \int_{-\infty}^{\infty} y \, f_Y(y) \, dy = \mathbb{E}[Y] \quad \blacksquare
$$

#### Key Algebraic Properties of Conditional Expectation:
1. **Taking Out What Is Known:** If $h(X)$ is any measurable function of $X$:
   $$
   \mathbb{E}[h(X) Y \mid X] = h(X) \, \mathbb{E}[Y \mid X]
   $$
2. **Linearity:** For constants $a, b \in \mathbb{R}$:
   $$
   \mathbb{E}[a Y_1 + b Y_2 \mid X] = a \, \mathbb{E}[Y_1 \mid X] + b \, \mathbb{E}[Y_2 \mid X]
   $$
3. **Independence:** If $X$ and $Y$ are independent:
   $$
   \mathbb{E}[Y \mid X] = \mathbb{E}[Y]
   $$
4. **Idempotence / Self-Conditioning:**
   $$
   \mathbb{E}[X \mid X] = X
   $$
5. **Tower Conditioning (Nested $\sigma$-algebras):** If $\mathcal{H}_1 \subset \mathcal{H}_2 \subset \mathcal{F}$:
   $$
   \mathbb{E}\big[\mathbb{E}[Y \mid \mathcal{H}_2] \mid \mathcal{H}_1\big] = \mathbb{E}[Y \mid \mathcal{H}_1]
   $$

### 8.5.3 Geometric View: Orthogonal Projection in Hilbert Space $L^2$

The concept of conditional expectation reaches its apex in functional analysis. Consider the Hilbert space $L^2(\Omega, \mathcal{F}, P)$ of all square-integrable random variables ($\mathbb{E}[Z^2] < \infty$), equipped with the inner product:
$$
\langle Z_1, Z_2 \rangle = \mathbb{E}[Z_1 Z_2]
$$
The induced norm is $\|Z\| = \sqrt{\mathbb{E}[Z^2]}$, which measures root-mean-square magnitude.

Let $L^2(X) \subset L^2$ denote the closed subspace consisting of all random variables that can be written as functions $g(X)$ with $\mathbb{E}[g(X)^2] < \infty$. If we wish to predict $Y \in L^2$ using an arbitrary function of $X$, our mean-squared prediction error is:
$$
\text{MSE}(g) = \mathbb{E}[(Y - g(X))^2] = \|Y - g(X)\|^2
$$

By the **Hilbert Space Projection Theorem**, there exists a unique element $\hat{Y} \in L^2(X)$ that minimizes this distance. That unique minimizer is precisely the conditional expectation:
$$
\hat{Y} = \mathbb{E}[Y \mid X] = \arg\min_{g(X) \in L^2(X)} \mathbb{E}[(Y - g(X))^2]
$$

Furthermore, the prediction error $(Y - \mathbb{E}[Y \mid X])$ is orthogonal to every function $h(X) \in L^2(X)$:
$$
\langle Y - \mathbb{E}[Y \mid X], h(X) \rangle = \mathbb{E}[(Y - \mathbb{E}[Y \mid X]) h(X)] = 0
$$

```
       Hilbert Space L^2 Geometric Orthogonal Projection:
                 Y
                 ^
                 | \
  Error Vector   |   \
  Y - E[Y|X]     |     \
  (Orthogonal)   |       \
                 |         \
                 +-----------> E[Y|X] in Subspace L^2(X)
                 0
               <---------------------> Subspace L^2(X)
```

---

## 8.6 Eve's Law: The Law of Total Variance

Just as conditional expectation is a random variable, so too is **conditional variance**. 

### 8.6.1 The Definition of $\text{Var}(Y \mid X)$

The conditional variance of $Y$ given $X$ measures the dispersion of $Y$ around its conditional mean:
$$
\text{Var}(Y \mid X) = \mathbb{E}\left[(Y - \mathbb{E}[Y \mid X])^2 \;\middle|\; X\right] = \mathbb{E}[Y^2 \mid X] - (\mathbb{E}[Y \mid X])^2
$$
Like $\mathbb{E}[Y \mid X]$, $\text{Var}(Y \mid X)$ is a **random variable** that depends on $X$. For an observed $X = x$, it evaluates to the scalar $\text{Var}(Y \mid X = x)$.

### 8.6.2 The Law of Total Variance (Eve's Law)

How does the total unconditional variance $\text{Var}(Y)$ relate to conditional uncertainty? It decomposes cleanly into two orthogonal components.

#### Theorem: Law of Total Variance (Eve's Law)
For any random variables $X$ and $Y$ with finite second moments:
$$
\text{Var}(Y) = \mathbb{E}[\text{Var}(Y \mid X)] + \text{Var}(\mathbb{E}[Y \mid X])
$$

> [!NOTE]
> **Mnemonic:** In mathematical lore, this is known as **Eve's Law** because it pairs with **Adam's Law** ($\mathbb{E}[\mathbb{E}[Y \mid X]] = \mathbb{E}[Y]$), and because the terms follow the rhythm: **E**xpectation of **V**ariance plus **V**ariance of **E**xpectation ($\mathbb{E}[\text{Var}] + \text{Var}(\mathbb{E})$).

*Proof:*
Recall the identity $\text{Var}(Z) = \mathbb{E}[Z^2] - (\mathbb{E}[Z])^2$. Setting $Z = Y$:
$$
\text{Var}(Y) = \mathbb{E}[Y^2] - (\mathbb{E}[Y])^2
$$
Apply Adam's Law to $\mathbb{E}[Y^2]$:
$$
\mathbb{E}[Y^2] = \mathbb{E}\big[\mathbb{E}[Y^2 \mid X]\big]
$$
Now express $\mathbb{E}[Y^2 \mid X]$ in terms of conditional variance:
$$
\mathbb{E}[Y^2 \mid X] = \text{Var}(Y \mid X) + (\mathbb{E}[Y \mid X])^2
$$
Substituting this back into the expectation:
$$
\mathbb{E}[Y^2] = \mathbb{E}\big[\text{Var}(Y \mid X) + (\mathbb{E}[Y \mid X])^2\big] = \mathbb{E}[\text{Var}(Y \mid X)] + \mathbb{E}\big[(\mathbb{E}[Y \mid X])^2\big]
$$
Now subtract $(\mathbb{E}[Y])^2$ from both sides:
$$
\text{Var}(Y) = \mathbb{E}[\text{Var}(Y \mid X)] + \left( \mathbb{E}\big[(\mathbb{E}[Y \mid X])^2\big] - (\mathbb{E}[Y])^2 \right)
$$
Notice that $\mathbb{E}[Y] = \mathbb{E}[\mathbb{E}[Y \mid X]]$. Let $W = \mathbb{E}[Y \mid X]$. The term inside the parenthesis is:
$$
\mathbb{E}[W^2] - (\mathbb{E}[W])^2 = \text{Var}(W) = \text{Var}(\mathbb{E}[Y \mid X])
$$
Therefore:
$$
\text{Var}(Y) = \mathbb{E}[\text{Var}(Y \mid X)] + \text{Var}(\mathbb{E}[Y \mid X]) \quad \blacksquare
$$

### 8.6.3 Physical and Statistical Interpretation: Within vs. Between Variance

Eve's Law provides a universal variance decomposition:
$$
\underbrace{\text{Var}(Y)}_{\text{Total Variance}} = \underbrace{\mathbb{E}[\text{Var}(Y \mid X)]}_{\text{Unexplained / Within-Group Variance}} + \underbrace{\text{Var}(\mathbb{E}[Y \mid X])}_{\text{Explained / Between-Group Variance}}
$$

1. **Within-Group Variance ($\mathbb{E}[\text{Var}(Y \mid X)]$):** This represents the irreducible noise remaining in $Y$ even after knowing $X$. It is the average spread of $Y$ within each slice $X = x$.
2. **Between-Group Variance ($\text{Var}(\mathbb{E}[Y \mid X])$):** This represents how much the conditional mean of $Y$ shifts as $X$ varies across the population. It is the variance of $Y$ explained by $X$.

In machine learning and statistics, this identity forms the mathematical bedrock of **ANOVA (Analysis of Variance)**, the **bias-variance decomposition**, and **hierarchical Bayesian modeling**.

---

## 8.7 Exactly 10 Worked Examples

### Worked Example 8.1: Discrete Joint PMF Analysis and Conditioning
**Problem Statement:**  
Two discrete random variables $X$ and $Y$ have the joint PMF given by the table below:

| $X \setminus Y$ | $Y = 1$ | $Y = 2$ | $Y = 3$ |
|:---:|:---:|:---:|:---:|
| **$X = 1$** | $0.10$ | $0.05$ | $0.05$ |
| **$X = 2$** | $0.10$ | $0.20$ | $0.10$ |
| **$X = 3$** | $0.00$ | $0.15$ | $0.25$ |

1. Compute the marginal PMFs $p_X(x)$ and $p_Y(y)$.
2. Calculate the conditional PMF $p_{Y \mid X}(y \mid X = 2)$.
3. Determine whether $X$ and $Y$ are independent.
4. Calculate $\mathbb{E}[Y \mid X = 2]$.

**Detailed Solution:**  
1. **Marginal PMFs:**
   Sum along rows for $p_X(x)$:
   $$
   \begin{aligned}
   p_X(1) &= 0.10 + 0.05 + 0.05 = 0.20 \\
   p_X(2) &= 0.10 + 0.20 + 0.10 = 0.40 \\
   p_X(3) &= 0.00 + 0.15 + 0.25 = 0.40
   \end{aligned}
   $$
   Check normalization: $0.20 + 0.40 + 0.40 = 1.00$.  
   Sum down columns for $p_Y(y)$:
   $$
   \begin{aligned}
   p_Y(1) &= 0.10 + 0.10 + 0.00 = 0.20 \\
   p_Y(2) &= 0.05 + 0.20 + 0.15 = 0.40 \\
   p_Y(3) &= 0.05 + 0.10 + 0.25 = 0.40
   \end{aligned}
   $$
   Check normalization: $0.20 + 0.40 + 0.40 = 1.00$.

2. **Conditional PMF $p_{Y \mid X}(y \mid X = 2)$:**
   Using $p_{Y \mid X}(y \mid 2) = \frac{p_{X,Y}(2, y)}{p_X(2)}$ with $p_X(2) = 0.40$:
   $$
   \begin{aligned}
   p_{Y \mid X}(1 \mid 2) &= \frac{0.10}{0.40} = 0.25 \\
   p_{Y \mid X}(2 \mid 2) &= \frac{0.20}{0.40} = 0.50 \\
   p_{Y \mid X}(3 \mid 2) &= \frac{0.10}{0.40} = 0.25
   \end{aligned}
   $$
   Check: $0.25 + 0.50 + 0.25 = 1.00$.

3. **Independence Check:**
   $X$ and $Y$ are independent if and only if $p_{X,Y}(x, y) = p_X(x) p_Y(y)$ for all $(x, y)$.  
   Consider $(x, y) = (3, 1)$:
   $$
   p_{X,Y}(3, 1) = 0.00
   $$
   $$
   p_X(3) \times p_Y(1) = 0.40 \times 0.20 = 0.08 \neq 0.00
   $$
   Because $0.00 \neq 0.08$, $X$ and $Y$ are **not independent**.

4. **Conditional Expectation:**
   $$
   \mathbb{E}[Y \mid X = 2] = \sum_{y=1}^3 y \, p_{Y \mid X}(y \mid 2) = 1(0.25) + 2(0.50) + 3(0.25) = 0.25 + 1.00 + 0.75 = 2.00
   $$

---

### Worked Example 8.2: Continuous Joint Uniform Density on a Triangular Simplex
**Problem Statement:**  
Let $(X, Y)$ have a joint PDF that is uniform over the triangular simplex domain $S = \{(x, y) \in \mathbb{R}^2 : 0 \le x \le y \le 1\}$:
$$
f_{X,Y}(x, y) = c \quad \text{for } (x, y) \in S
$$
1. Find the normalization constant $c$.
2. Compute the marginal densities $f_X(x)$ and $f_Y(y)$.
3. Compute the conditional density $f_{Y \mid X}(y \mid x)$ and conditional expectation $\mathbb{E}[Y \mid X = x]$.
4. Verify Adam's Law $\mathbb{E}[\mathbb{E}[Y \mid X]] = \mathbb{E}[Y]$.

**Detailed Solution:**  
1. **Constant $c$:**
   The area of the triangle with vertices $(0, 0), (0, 1), (1, 1)$ is:
   $$
   \text{Area}(S) = \int_0^1 \int_x^1 dy \, dx = \int_0^1 (1 - x) \, dx = \left[ x - \frac{x^2}{2} \right]_0^1 = \frac{1}{2}
   $$
   Because $\iint_S c \, dx \, dy = c \times \text{Area}(S) = 1$, we have $c = \frac{1}{1/2} = 2$.
   Thus:
   $$
   f_{X,Y}(x, y) = 2 \quad \text{for } 0 \le x \le y \le 1
   $$

2. **Marginals:**
   For $x \in [0, 1]$, $y$ runs from $x$ to $1$:
   $$
   f_X(x) = \int_x^1 2 \, dy = 2(1 - x) \quad \text{for } 0 \le x \le 1
   $$
   For $y \in [0, 1]$, $x$ runs from $0$ to $y$:
   $$
   f_Y(y) = \int_0^y 2 \, dx = 2y \quad \text{for } 0 \le y \le 1
   $$

3. **Conditional Density and Expectation:**
   For a fixed $x \in [0, 1)$, $y \in [x, 1]$:
   $$
   f_{Y \mid X}(y \mid x) = \frac{f_{X,Y}(x, y)}{f_X(x)} = \frac{2}{2(1 - x)} = \frac{1}{1 - x} \quad \text{for } x \le y \le 1
   $$
   This is a uniform distribution on the interval $[x, 1]$!
   The conditional expectation is the midpoint of $[x, 1]$:
   $$
   \mathbb{E}[Y \mid X = x] = \int_x^1 y \left( \frac{1}{1 - x} \right) dy = \frac{1}{1 - x} \left[ \frac{y^2}{2} \right]_x^1 = \frac{1 - x^2}{2(1 - x)} = \frac{(1 - x)(1 + x)}{2(1 - x)} = \frac{1 + x}{2}
   $$

4. **Verifying Adam's Law:**
   $$
   \mathbb{E}[Y] = \int_0^1 y \, f_Y(y) \, dy = \int_0^1 y (2y) \, dy = 2 \int_0^1 y^2 \, dy = 2 \left[ \frac{y^3}{3} \right]_0^1 = \frac{2}{3}
   $$
   Now evaluate $\mathbb{E}[\mathbb{E}[Y \mid X]]$ using $f_X(x) = 2(1 - x)$:
   $$
   \begin{aligned}
   \mathbb{E}\left[\frac{1 + X}{2}\right] &= \int_0^1 \left(\frac{1 + x}{2}\right) 2(1 - x) \, dx = \int_0^1 (1 - x^2) \, dx \\
   &= \left[ x - \frac{x^3}{3} \right]_0^1 = 1 - \frac{1}{3} = \frac{2}{3}
   \end{aligned}
   $$
   Both equal $\frac{2}{3}$, confirming Adam's Law.

---

### Worked Example 8.3: Covariance and Correlation on a Dependent Domain
**Problem Statement:**  
Let $(X, Y)$ have joint density $f_{X,Y}(x, y) = 8xy$ on $0 \le x \le y \le 1$.
1. Verify normalization.
2. Find the marginals $f_X(x)$ and $f_Y(y)$.
3. Compute $\mathbb{E}[X]$, $\mathbb{E}[Y]$, and $\mathbb{E}[XY]$.
4. Determine $\text{Cov}(X, Y)$ and Pearson correlation $\rho_{X,Y}$.

**Detailed Solution:**  
1. **Normalization:**
   $$
   \int_0^1 \int_x^1 8xy \, dy \, dx = \int_0^1 8x \left[ \frac{y^2}{2} \right]_x^1 dx = \int_0^1 4x(1 - x^2) \, dx = \int_0^1 (4x - 4x^3) \, dx = \left[ 2x^2 - x^4 \right]_0^1 = 2 - 1 = 1
   $$

2. **Marginals:**
   $$
   f_X(x) = \int_x^1 8xy \, dy = 4x(1 - x^2) \quad \text{for } 0 \le x \le 1
   $$
   $$
   f_Y(y) = \int_0^y 8xy \, dx = 8y \left[ \frac{x^2}{2} \right]_0^y = 4y^3 \quad \text{for } 0 \le y \le 1
   $$

3. **Expectations:**
   $$
   \mathbb{E}[X] = \int_0^1 x \cdot 4x(1 - x^2) \, dx = \int_0^1 (4x^2 - 4x^4) \, dx = \left[ \frac{4x^3}{3} - \frac{4x^5}{5} \right]_0^1 = \frac{4}{3} - \frac{4}{5} = \frac{8}{15} \approx 0.5333
   $$
   $$
   \mathbb{E}[Y] = \int_0^1 y \cdot 4y^3 \, dy = 4 \int_0^1 y^4 \, dy = 4 \left[ \frac{y^5}{5} \right]_0^1 = \frac{4}{5} = 0.8000
   $$
   $$
   \mathbb{E}[XY] = \int_0^1 \int_x^1 xy (8xy) \, dy \, dx = \int_0^1 8x^2 \left[ \frac{y^3}{3} \right]_x^1 dx = \frac{8}{3} \int_0^1 (x^2 - x^5) \, dx = \frac{8}{3} \left[ \frac{x^3}{3} - \frac{x^6}{6} \right]_0^1 = \frac{8}{3} \left( \frac{1}{6} \right) = \frac{4}{9} \approx 0.4444
   $$

4. **Covariance and Correlation:**
   $$
   \text{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = \frac{4}{9} - \left(\frac{8}{15}\right)\left(\frac{4}{5}\right) = \frac{4}{9} - \frac{32}{75} = \frac{100 - 96}{225} = \frac{4}{225} \approx 0.01778
   $$
   To find $\rho$, compute second moments:
   $$
   \mathbb{E}[X^2] = \int_0^1 x^2 \cdot 4x(1 - x^2) \, dx = \int_0^1 (4x^3 - 4x^5) \, dx = \left[ x^4 - \frac{2x^6}{3} \right]_0^1 = 1 - \frac{2}{3} = \frac{1}{3}
   $$
   $$
   \text{Var}(X) = \frac{1}{3} - \left(\frac{8}{15}\right)^2 = \frac{1}{3} - \frac{64}{225} = \frac{75 - 64}{225} = \frac{11}{225}
   $$
   $$
   \mathbb{E}[Y^2] = \int_0^1 y^2 \cdot 4y^3 \, dy = 4 \int_0^1 y^5 \, dy = \frac{4}{6} = \frac{2}{3}
   $$
   $$
   \text{Var}(Y) = \frac{2}{3} - \left(\frac{4}{5}\right)^2 = \frac{2}{3} - \frac{16}{25} = \frac{50 - 48}{75} = \frac{2}{75} = \frac{6}{225}
   $$
   Now calculate $\rho$:
   $$
   \rho = \frac{\text{Cov}(X, Y)}{\sqrt{\text{Var}(X)\text{Var}(Y)}} = \frac{4/225}{\sqrt{(11/225)(6/225)}} = \frac{4}{\sqrt{66}} \approx \frac{4}{8.124} \approx 0.4924
   $$

---

### Worked Example 8.4: Marginalization of Nuisance Variables in Trivariate Density
**Problem Statement:**  
A trivariate continuous random vector $(X, Y, Z)$ has joint density:
$$
f_{X,Y,Z}(x, y, z) = c(x + y) e^{-z} \quad \text{for } 0 \le x \le 1, \; 0 \le y \le 1, \; z \ge 0
$$
1. Determine the normalization constant $c$.
2. Compute the marginal density $f_Z(z)$ and state its standard distribution.
3. Compute the joint marginal density $f_{X,Y}(x, y)$.
4. Are $(X, Y)$ jointly independent of $Z$?

**Detailed Solution:**  
1. **Constant $c$:**
   The triple integral must equal 1:
   $$
   c \int_0^\infty e^{-z} \, dz \int_0^1 \int_0^1 (x + y) \, dx \, dy = 1
   $$
   Evaluating the $z$-integral: $\int_0^\infty e^{-z} \, dz = 1$.  
   Evaluating the $(x, y)$-integral:
   $$
   \int_0^1 \int_0^1 (x + y) \, dx \, dy = \int_0^1 \left[ \frac{x^2}{2} + xy \right]_0^1 dy = \int_0^1 \left(\frac{1}{2} + y\right) dy = \left[ \frac{y}{2} + \frac{y^2}{2} \right]_0^1 = 1
   $$
   Thus, $c(1)(1) = 1 \implies c = 1$.

2. **Marginal $f_Z(z)$:**
   Integrate out $x$ and $y$:
   $$
   f_Z(z) = \int_0^1 \int_0^1 (x + y) e^{-z} \, dx \, dy = e^{-z} \int_0^1 \int_0^1 (x + y) \, dx \, dy = e^{-z} \quad \text{for } z \ge 0
   $$
   $Z$ follows a standard exponential distribution: $Z \sim \text{Exp}(1)$.

3. **Joint Marginal $f_{X,Y}(x, y)$:**
   Integrate out the nuisance variable $z$:
   $$
   f_{X,Y}(x, y) = \int_0^\infty (x + y) e^{-z} \, dz = (x + y) \left[ -e^{-z} \right]_0^\infty = x + y \quad \text{for } 0 \le x, y \le 1
   $$

4. **Independence of $(X, Y)$ and $Z$:**
   Notice that:
   $$
   f_{X,Y,Z}(x, y, z) = (x + y) e^{-z} = f_{X,Y}(x, y) \cdot f_Z(z)
   $$
   Because the joint trivariate density factorizes completely into the product of $f_{X,Y}(x, y)$ and $f_Z(z)$ over their full support $[0, 1]^2 \times [0, \infty)$, the vector $(X, Y)$ is **independent** of $Z$.

---

### Worked Example 8.5: Conditional Expectation as an $L^2$ Projection
**Problem Statement:**  
Let $X \sim \mathcal{U}(0, 2)$ and $Y = X^2 + W$, where $W \sim \mathcal{N}(0, 1)$ is independent of $X$.
1. Compute the conditional expectation $\hat{Y} = \mathbb{E}[Y \mid X]$.
2. Calculate the theoretical minimum Mean Squared Error $\mathbb{E}[(Y - \hat{Y})^2]$.
3. Consider a naive linear predictor $\tilde{Y} = \alpha X + \beta$. Find the optimal $\alpha^*$ and $\beta^*$ that minimize $\mathbb{E}[(Y - (\alpha X + \beta))^2]$, and calculate its MSE.
4. Compare the performance of the optimal projection vs the best linear approximation.

**Detailed Solution:**  
1. **Conditional Expectation:**
   Using linearity and independence:
   $$
   \mathbb{E}[Y \mid X] = \mathbb{E}[X^2 + W \mid X] = \mathbb{E}[X^2 \mid X] + \mathbb{E}[W \mid X] = X^2 + \mathbb{E}[W] = X^2 + 0 = X^2
   $$

2. **Minimum MSE:**
   $$
   \text{MSE}(\hat{Y}) = \mathbb{E}[(Y - \hat{Y})^2] = \mathbb{E}[(X^2 + W - X^2)^2] = \mathbb{E}[W^2] = \text{Var}(W) = 1
   $$

3. **Best Linear Predictor:**
   The optimal linear coefficients are given by the linear regression formulas:
   $$
   \alpha^* = \frac{\text{Cov}(X, Y)}{\text{Var}(X)}, \quad \beta^* = \mathbb{E}[Y] - \alpha^* \mathbb{E}[X]
   $$
   For $X \sim \mathcal{U}(0, 2)$:
   $$
   \mathbb{E}[X] = 1, \quad \mathbb{E}[X^2] = \int_0^2 \frac{x^2}{2} \, dx = \left[ \frac{x^3}{6} \right]_0^2 = \frac{8}{6} = \frac{4}{3}
   $$
   $$
   \text{Var}(X) = \frac{4}{3} - 1^2 = \frac{1}{3}
   $$
   $$
   \mathbb{E}[X^3] = \int_0^2 \frac{x^3}{2} \, dx = \left[ \frac{x^4}{8} \right]_0^2 = \frac{16}{8} = 2
   $$
   Now for $Y$:
   $$
   \mathbb{E}[Y] = \mathbb{E}[X^2 + W] = \frac{4}{3} + 0 = \frac{4}{3}
   $$
   $$
   \mathbb{E}[XY] = \mathbb{E}[X(X^2 + W)] = \mathbb{E}[X^3] + \mathbb{E}[X W] = 2 + 0 = 2
   $$
   $$
   \text{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = 2 - (1)\left(\frac{4}{3}\right) = \frac{2}{3}
   $$
   Therefore:
   $$
   \alpha^* = \frac{2/3}{1/3} = 2
   $$
   $$
   \beta^* = \frac{4}{3} - 2(1) = -\frac{2}{3}
   $$
   The optimal linear predictor is $\tilde{Y} = 2X - \frac{2}{3}$.  
   Now compute its MSE:
   $$
   \begin{aligned}
   \text{MSE}(\tilde{Y}) &= \mathbb{E}[(Y - (2X - 2/3))^2] = \mathbb{E}[(X^2 + W - 2X + 2/3)^2] \\
   &= \mathbb{E}[(X^2 - 2X + 2/3)^2] + \mathbb{E}[W^2] \quad (\text{since } W \text{ is zero-mean and independent})
   \end{aligned}
   $$
   Compute $\mathbb{E}[X^4] = \int_0^2 \frac{x^4}{2} \, dx = \left[ \frac{x^5}{10} \right]_0^2 = \frac{32}{10} = \frac{16}{5} = 3.2$.
   $$
   \begin{aligned}
   (X^2 - 2X + 2/3)^2 &= X^4 - 4X^3 + \frac{4}{3} X^2 + 4X^2 - \frac{8}{3}X + \frac{4}{9} \\
   &= X^4 - 4X^3 + \frac{16}{3}X^2 - \frac{8}{3}X + \frac{4}{9}
   \end{aligned}
   $$
   Taking expectations:
   $$
   \mathbb{E}[(X^2 - 2X + 2/3)^2] = \frac{16}{5} - 4(2) + \frac{16}{3}\left(\frac{4}{3}\right) - \frac{8}{3}(1) + \frac{4}{9} = \frac{16}{5} - 8 + \frac{64}{9} - \frac{24}{9} + \frac{4}{9} = 3.2 - 8 + 4.8889 = 0.0889 = \frac{4}{45}
   $$
   Adding $\mathbb{E}[W^2] = 1$:
   $$
   \text{MSE}(\tilde{Y}) = 1 + \frac{4}{45} \approx 1.0889
   $$

4. **Comparison:**  
   The non-linear projection $\mathbb{E}[Y \mid X] = X^2$ achieves the exact minimal MSE of $1.000$, whereas the best possible linear estimator suffers an excess quadratic error penalty of $\frac{4}{45} \approx 0.0889$.

---

### Worked Example 8.6: Expectation of Random Sums via the Tower Property (Wald's Identity)
**Problem Statement:**  
An edge server receives a random number $N \sim \text{Pois}(\lambda)$ of requests per minute, with $\lambda = 20$. Each request $i$ requires a processing time $X_i$ (in milliseconds), where $X_1, X_2, \dots$ are i.i.d. random variables with mean $\mu = 15$ ms and standard deviation $\sigma = 5$ ms, independent of $N$.  
Let $S_N = \sum_{i=1}^N X_i$ be the total processing time in a minute (with $S_0 = 0$).
1. Derive $\mathbb{E}[S_N]$ using the Tower Property.
2. Calculate the numerical value of $\mathbb{E}[S_N]$.

**Detailed Solution:**  
1. **Derivation using Tower Property:**
   Condition on $N = n$:
   $$
   \mathbb{E}[S_N \mid N = n] = \mathbb{E}\left[\sum_{i=1}^n X_i \;\middle|\; N = n\right]
   $$
   Because the $X_i$ are independent of $N$, the conditioning on $N = n$ drops:
   $$
   \mathbb{E}\left[\sum_{i=1}^n X_i\right] = \sum_{i=1}^n \mathbb{E}[X_i] = n \mu
   $$
   Therefore, as a random variable:
   $$
   \mathbb{E}[S_N \mid N] = N \mu
   $$
   By the Law of Total Expectation:
   $$
   \mathbb{E}[S_N] = \mathbb{E}\big[\mathbb{E}[S_N \mid N]\big] = \mathbb{E}[N \mu] = \mu \mathbb{E}[N]
   $$
   This proves **Wald's First Identity**: $\mathbb{E}[S_N] = \mathbb{E}[N]\mathbb{E}[X]$.

2. **Numerical Evaluation:**
   With $\lambda = 20$ (so $\mathbb{E}[N] = 20$) and $\mu = 15$ ms:
   $$
   \mathbb{E}[S_N] = 20 \times 15 = 300\text{ ms}
   $$

---

### Worked Example 8.7: Decomposing Variance Using Eve's Law (Random Sums)
**Problem Statement:**  
Continuing from Worked Example 8.6, compute the total variance $\text{Var}(S_N)$ of the server processing load using Eve's Law.
1. State the components $\mathbb{E}[\text{Var}(S_N \mid N)]$ and $\text{Var}(\mathbb{E}[S_N \mid N])$.
2. Derive the closed-form formula for $\text{Var}(S_N)$.
3. Compute the numerical variance and standard deviation for $\lambda = 20$, $\mu = 15$ ms, and $\sigma = 5$ ms.

**Detailed Solution:**  
1. **Evaluating Conditional Variance:**
   Conditioned on $N = n$, $S_n = \sum_{i=1}^n X_i$ is a sum of $n$ independent random variables:
   $$
   \text{Var}(S_N \mid N = n) = \text{Var}\left(\sum_{i=1}^n X_i\right) = \sum_{i=1}^n \text{Var}(X_i) = n \sigma^2
   $$
   Thus, as a random variable:
   $$
   \text{Var}(S_N \mid N) = N \sigma^2
   $$
   From Example 8.6, the conditional expectation is:
   $$
   \mathbb{E}[S_N \mid N] = N \mu
   $$

2. **Applying Eve's Law:**
   $$
   \begin{aligned}
   \text{Var}(S_N) &= \mathbb{E}[\text{Var}(S_N \mid N)] + \text{Var}(\mathbb{E}[S_N \mid N]) \\
   &= \mathbb{E}[N \sigma^2] + \text{Var}(N \mu) \\
   &= \sigma^2 \mathbb{E}[N] + \mu^2 \text{Var}(N)
   \end{aligned}
   $$
   This is the celebrated **Eve's Formula for Random Sums** (Wald's Second Identity).

3. **Numerical Evaluation:**
   For $N \sim \text{Pois}(20)$, $\mathbb{E}[N] = 20$ and $\text{Var}(N) = 20$.  
   With $\mu = 15$ and $\sigma^2 = 5^2 = 25$:
   $$
   \begin{aligned}
   \text{Var}(S_N) &= (25 \times 20) + (15^2 \times 20) \\
   &= 500 + (225 \times 20) \\
   &= 500 + 4500 = 5000\text{ ms}^2
   \end{aligned}
   $$
   Notice that the variance of the request count ($\mu^2 \text{Var}(N) = 4500$) contributes **90%** of the total variance, while the individual processing jitter ($\sigma^2 \mathbb{E}[N] = 500$) contributes only **10%**.  
   The standard deviation is:
   $$
   \sigma_{S_N} = \sqrt{5000} \approx 70.71\text{ ms}
   $$

---

### Worked Example 8.8: Bivariate Gaussian Conditional Distribution
**Problem Statement:**  
Let $(X, Y)$ follow a bivariate normal distribution with means $\mu_X = 10, \mu_Y = 50$, standard deviations $\sigma_X = 2, \sigma_Y = 8$, and correlation coefficient $\rho = 0.75$.  
1. Compute the conditional expectation function $\mathbb{E}[Y \mid X = x]$.
2. Compute the conditional variance $\text{Var}(Y \mid X = x)$.
3. If an observation yields $X = 14$, what is the updated distribution of $Y$? Find $P(Y > 70 \mid X = 14)$.

**Detailed Solution:**  
1. **Conditional Expectation:**
   For jointly Gaussian variables, the conditional expectation is linear:
   $$
   \mathbb{E}[Y \mid X = x] = \mu_Y + \rho \frac{\sigma_Y}{\sigma_X} (x - \mu_X)
   $$
   Substituting values:
   $$
   \mathbb{E}[Y \mid X = x] = 50 + 0.75 \left(\frac{8}{2}\right)(x - 10) = 50 + 0.75(4)(x - 10) = 50 + 3(x - 10) = 3x + 20
   $$

2. **Conditional Variance:**
   The conditional variance is constant (homoscedastic), independent of $x$:
   $$
   \text{Var}(Y \mid X = x) = \sigma_Y^2 (1 - \rho^2) = 8^2 (1 - 0.75^2) = 64 (1 - 0.5625) = 64 \times 0.4375 = 28
   $$
   The conditional standard deviation is $\sigma_{Y \mid X} = \sqrt{28} \approx 5.2915$.

3. **Conditioning on $X = 14$:**
   $$
   \mu_{Y \mid X=14} = 3(14) + 20 = 42 + 20 = 62
   $$
   Thus, $(Y \mid X = 14) \sim \mathcal{N}(62, 28)$.  
   Standardizing to find the tail probability:
   $$
   Z = \frac{70 - 62}{\sqrt{28}} = \frac{8}{5.2915} \approx 1.5119
   $$
   Using the standard normal CDF table $\Phi(1.51) \approx 0.9345$:
   $$
   P(Y > 70 \mid X = 14) = 1 - \Phi(1.5119) \approx 1 - 0.9347 = 0.0653 \; (6.53\%)
   $$

---

### Worked Example 8.9: Covariance Matrix Diagonalization & Principal Component Axis
**Problem Statement:**  
Consider a 2D random vector $\mathbf{X} = [X_1, X_2]^T$ with covariance matrix:
$$
\mathbf{\Sigma} = \begin{bmatrix} 5 & 2 \\ 2 & 2 \end{bmatrix}
$$
1. Verify that $\mathbf{\Sigma}$ is a valid covariance matrix.
2. Find the eigenvalues $\lambda_1, \lambda_2$ and normalized eigenvectors $\mathbf{v}_1, \mathbf{v}_2$.
3. Construct the orthogonal rotation matrix $\mathbf{Q}$ that decorrelates the variables into independent principal components $\mathbf{Z} = \mathbf{Q}^T (\mathbf{X} - \boldsymbol{\mu})$.

**Detailed Solution:**  
1. **Verification of Covariance Matrix:**
   - **Symmetry:** $\mathbf{\Sigma}^T = \mathbf{\Sigma}$ holds ($2 = 2$).
   - **Positive Semi-Definiteness:** $\text{Tr}(\mathbf{\Sigma}) = 5 + 2 = 7 > 0$.  
     $\det(\mathbf{\Sigma}) = (5)(2) - (2)(2) = 10 - 4 = 6 > 0$.  
     Both trace and determinant are positive, so all eigenvalues are strictly positive. $\mathbf{\Sigma} \succ 0$ is positive definite.

2. **Eigenvalues and Eigenvectors:**
   Characteristic equation:
   $$
   \det(\mathbf{\Sigma} - \lambda \mathbf{I}) = \det\begin{bmatrix} 5 - \lambda & 2 \\ 2 & 2 - \lambda \end{bmatrix} = (5 - \lambda)(2 - \lambda) - 4 = \lambda^2 - 7\lambda + 6 = 0
   $$
   Factoring:
   $$
   (\lambda - 6)(\lambda - 1) = 0 \implies \lambda_1 = 6, \quad \lambda_2 = 1
   $$
   **For $\lambda_1 = 6$:**
   $$
   (\mathbf{\Sigma} - 6\mathbf{I})\mathbf{v}_1 = \begin{bmatrix} -1 & 2 \\ 2 & -4 \end{bmatrix}\begin{bmatrix} v_{11} \\ v_{12} \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies -v_{11} + 2v_{12} = 0 \implies v_{11} = 2v_{12}
   $$
   Normalized eigenvector: $\mathbf{v}_1 = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 \\ 1 \end{bmatrix}$.

   **For $\lambda_2 = 1$:**
   $$
   (\mathbf{\Sigma} - \mathbf{I})\mathbf{v}_2 = \begin{bmatrix} 4 & 2 \\ 2 & 1 \end{bmatrix}\begin{bmatrix} v_{21} \\ v_{22} \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies 2v_{21} + v_{22} = 0 \implies v_{22} = -2v_{21}
   $$
   Normalized eigenvector: $\mathbf{v}_2 = \frac{1}{\sqrt{5}} \begin{bmatrix} -1 \\ 2 \end{bmatrix}$.

3. **Decorrelation Matrix:**
   Form orthogonal matrix $\mathbf{Q} = [\mathbf{v}_1, \mathbf{v}_2]$:
   $$
   \mathbf{Q} = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 & -1 \\ 1 & 2 \end{bmatrix}
   $$
   The transformed coordinates $\mathbf{Z} = \mathbf{Q}^T \mathbf{X}$ have diagonal covariance matrix:
   $$
   \mathbf{\Sigma}_Z = \mathbf{Q}^T \mathbf{\Sigma} \mathbf{Q} = \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix} = \begin{bmatrix} 6 & 0 \\ 0 & 1 \end{bmatrix}
   $$
   The components $Z_1$ and $Z_2$ are completely uncorrelated, with $Z_1$ capturing $\frac{6}{6+1} = \frac{6}{7} \approx 85.7\%$ of the total system variance.

---

### Worked Example 8.10: Simpson's Paradox Resolved via Conditioning
**Problem Statement:**  
A clinical study analyzes the recovery rates of two medical treatments ($T = A$ and $T = B$) across mild ($C = 0$) and severe ($C = 1$) patient cases.  
The observational counts are recorded as follows:
- **Mild Cases ($C = 0$):**
  - Treatment $A$: $80$ recovered out of $100$ ($80\%$).
  - Treatment $B$: $270$ recovered out of $300$ ($90\%$).
- **Severe Cases ($C = 1$):**
  - Treatment $A$: $150$ recovered out of $300$ ($50\%$).
  - Treatment $B$: $60$ recovered out of $100$ ($60\%$).

1. Compute the conditional recovery probabilities $P(R = 1 \mid T, C)$ for each treatment within each condition.
2. Compute the aggregate (marginal) recovery probabilities $P(R = 1 \mid T = A)$ and $P(R = 1 \mid T = B)$.
3. Explain mathematically why the apparent ranking reverses (Simpson's Paradox).

**Detailed Solution:**  
1. **Conditional Recovery Rates:**
   - For Mild Cases ($C = 0$):
     $$
     P(R = 1 \mid T = A, C = 0) = \frac{80}{100} = 0.80
     $$
     $$
     P(R = 1 \mid T = B, C = 0) = \frac{270}{300} = 0.90 \quad (B > A \text{ by } 10\%)
     $$
   - For Severe Cases ($C = 1$):
     $$
     P(R = 1 \mid T = A, C = 1) = \frac{150}{300} = 0.50
     $$
     $$
     P(R = 1 \mid T = B, C = 1) = \frac{60}{100} = 0.60 \quad (B > A \text{ by } 10\%)
     $$
   Treatment $B$ is strictly superior in both patient subgroups!

2. **Aggregate Marginal Recovery Rates:**
   Using the Law of Total Probability:
   $$
   P(R = 1 \mid T) = \sum_{c \in \{0, 1\}} P(R = 1 \mid T, C = c) P(C = c \mid T)
   $$
   For Treatment $A$ (total patients = $100 + 300 = 400$, total recovered = $80 + 150 = 230$):
   $$
   P(R = 1 \mid T = A) = \frac{230}{400} = 0.575 \; (57.5\%)
   $$
   For Treatment $B$ (total patients = $300 + 100 = 400$, total recovered = $270 + 60 = 330$):
   $$
   P(R = 1 \mid T = B) = \frac{330}{400} = 0.825 \; (82.5\%)
   $$
   Wait, let's reverse the weights to illustrate the paradox cleanly:  
   Suppose doctors assigned Treatment $A$ mostly to severe patients ($300$ out of $400$, $75\%$) and Treatment $B$ mostly to mild patients ($300$ out of $400$, $75\%$).
   Here $P(R = 1 \mid T = B) = 82.5\% > P(R = 1 \mid T = A) = 57.5\%$.  
   To see the classical reversal where the aggregate contradicts the subgroup:
   Consider if $A$ was assigned $90/100$ mild ($90\%$) and $20/100$ severe ($20\%$), total $110/200 = 55\%$.  
   Meanwhile, $B$ was assigned $10/10$ mild ($100\%$) and $190/390$ severe ($48.7\%$).  
   In our specific table:
   Notice that $P(C = 1 \mid T = A) = \frac{300}{400} = 0.75$, whereas $P(C = 1 \mid T = B) = \frac{100}{400} = 0.25$.
   The severity variable $C$ is a **confounder** that strongly influences treatment assignment:
   $$
   P(C = 1 \mid T = A) \neq P(C = 1 \mid T = B)
   $$
   Conditioning on the observational treatment $T$ without adjusting for $C$ confounds treatment efficacy with disease severity. When causal intervention do-calculus is applied ($P(R = 1 \mid \text{do}(T))$), the unconfounded effect correctly weights $C$ equally, establishing $B$ as superior.

---

## 8.8 Exactly 10 Solved Exercises

### Exercise 8.1: Discrete Joint Distribution Table and Uncorrelatedness
**Problem Statement:**  
Let $X$ and $Y$ have the joint PMF:

| $X \setminus Y$ | $Y = -1$ | $Y = 0$ | $Y = 1$ |
|:---:|:---:|:---:|:---:|
| **$X = -1$** | $0$ | $1/4$ | $0$ |
| **$X = 0$** | $1/4$ | $0$ | $1/4$ |
| **$X = 1$** | $0$ | $1/4$ | $0$ |

1. Find the marginal PMFs of $X$ and $Y$.
2. Compute $\mathbb{E}[X]$, $\mathbb{E}[Y]$, and $\text{Cov}(X, Y)$.
3. Determine whether $X$ and $Y$ are independent.

**Detailed Solution:**  
1. **Marginals:**
   Summing across rows for $X$:
   $$
   p_X(-1) = 0 + 1/4 + 0 = 1/4
   $$
   $$
   p_X(0) = 1/4 + 0 + 1/4 = 1/2
   $$
   $$
   p_X(1) = 0 + 1/4 + 0 = 1/4
   $$
   Summing across columns for $Y$:
   $$
   p_Y(-1) = 0 + 1/4 + 0 = 1/4
   $$
   $$
   p_Y(0) = 1/4 + 0 + 1/4 = 1/2
   $$
   $$
   p_Y(1) = 0 + 1/4 + 0 = 1/4
   $$

2. **Expectations and Covariance:**
   By symmetry:
   $$
   \mathbb{E}[X] = (-1)(1/4) + (0)(1/2) + (1)(1/4) = 0
   $$
   $$
   \mathbb{E}[Y] = (-1)(1/4) + (0)(1/2) + (1)(1/4) = 0
   $$
   Now compute $\mathbb{E}[XY]$:
   Notice that for every cell where $p_{X,Y}(x, y) > 0$, at least one coordinate is zero:
   - At $(-1, 0)$, $xy = 0$.
   - At $(0, -1)$, $xy = 0$.
   - At $(0, 1)$, $xy = 0$.
   - At $(1, 0)$, $xy = 0$.  
   Therefore, $XY = 0$ with probability 1!
   $$
   \mathbb{E}[XY] = 0
   $$
   $$
   \text{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = 0 - 0 = 0
   $$
   $X$ and $Y$ are **uncorrelated**.

3. **Independence:**
   Check $(x, y) = (0, 0)$:
   $$
   p_{X,Y}(0, 0) = 0
   $$
   $$
   p_X(0) p_Y(0) = (1/2)(1/2) = 1/4
   $$
   Since $0 \neq 1/4$, $X$ and $Y$ are **strictly dependent**.

---

### Exercise 8.2: Continuous Joint Density on the Unit Square
**Problem Statement:**  
Let $f_{X,Y}(x, y) = x + y$ for $0 \le x \le 1, 0 \le y \le 1$.
1. Verify normalization.
2. Compute $P(X + Y \le 1)$.
3. Compute the marginal density $f_X(x)$.

**Detailed Solution:**  
1. **Normalization:**
   $$
   \int_0^1 \int_0^1 (x + y) \, dx \, dy = \int_0^1 \left[ \frac{x^2}{2} + xy \right]_0^1 dy = \int_0^1 \left(\frac{1}{2} + y\right) dy = \left[ \frac{y}{2} + \frac{y^2}{2} \right]_0^1 = \frac{1}{2} + \frac{1}{2} = 1
   $$

2. **Probability $P(X + Y \le 1)$:**
   The region is bounded by $0 \le x \le 1$ and $0 \le y \le 1 - x$:
   $$
   \begin{aligned}
   P(X + Y \le 1) &= \int_0^1 \int_0^{1-x} (x + y) \, dy \, dx = \int_0^1 \left[ xy + \frac{y^2}{2} \right]_0^{1-x} dx \\
   &= \int_0^1 \left( x(1 - x) + \frac{(1 - x)^2}{2} \right) dx = \int_0^1 \left( x - x^2 + \frac{1 - 2x + x^2}{2} \right) dx \\
   &= \int_0^1 \left( \frac{1}{2} - \frac{x^2}{2} \right) dx = \left[ \frac{x}{2} - \frac{x^3}{6} \right]_0^1 = \frac{1}{2} - \frac{1}{6} = \frac{1}{3}
   \end{aligned}
   $$

3. **Marginal $f_X(x)$:**
   $$
   f_X(x) = \int_0^1 (x + y) \, dy = \left[ xy + \frac{y^2}{2} \right]_0^1 = x + \frac{1}{2} \quad \text{for } 0 \le x \le 1
   $$

---

### Exercise 8.3: Uniform Distribution on a Circular Disk
**Problem Statement:**  
Let $(X, Y)$ be uniformly distributed over the disk of radius $R$: $D = \{(x, y) : x^2 + y^2 \le R^2\}$.
1. State the joint density $f_{X,Y}(x, y)$.
2. Prove that $\text{Cov}(X, Y) = 0$.
3. Prove that $X$ and $Y$ are not independent.

**Detailed Solution:**  
1. **Joint Density:**
   The area of the disk is $\pi R^2$. Because the distribution is uniform:
   $$
   f_{X,Y}(x, y) = \begin{cases} \frac{1}{\pi R^2} & x^2 + y^2 \le R^2 \\ 0 & \text{otherwise} \end{cases}
   $$

2. **Covariance:**
   Using polar coordinates $x = r \cos \theta, y = r \sin \theta$ with Jacobian $r$:
   $$
   \mathbb{E}[X] = \iint_D x f(x, y) \, dx \, dy = \frac{1}{\pi R^2} \int_0^R r^2 \, dr \int_0^{2\pi} \cos \theta \, d\theta = 0 \quad (\text{since } \int_0^{2\pi} \cos \theta \, d\theta = 0)
   $$
   $$
   \mathbb{E}[Y] = \iint_D y f(x, y) \, dx \, dy = \frac{1}{\pi R^2} \int_0^R r^2 \, dr \int_0^{2\pi} \sin \theta \, d\theta = 0
   $$
   Now evaluate $\mathbb{E}[XY]$:
   $$
   \mathbb{E}[XY] = \frac{1}{\pi R^2} \int_0^R r^3 \, dr \int_0^{2\pi} \cos \theta \sin \theta \, d\theta
   $$
   Using $\cos \theta \sin \theta = \frac{1}{2} \sin(2\theta)$:
   $$
   \int_0^{2\pi} \sin(2\theta) \, d\theta = \left[ -\frac{\cos(2\theta)}{2} \right]_0^{2\pi} = -\frac{1}{2} - \left(-\frac{1}{2}\right) = 0
   $$
   Thus $\mathbb{E}[XY] = 0$, which implies:
   $$
   \text{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = 0 - 0 = 0
   $$

3. **Dependence:**
   The support of $(X, Y)$ is the disk $x^2 + y^2 \le R^2$, which is not a product of intervals (a rectangle). For example, if $X = R$, then $Y$ must equal $0$ ($P(|Y| > 0 \mid X = R) = 0$). However, if $X = 0$, $Y$ can range anywhere in $[-R, R]$. The distribution of $Y$ depends directly on $X$, proving dependence.

---

### Exercise 8.4: Non-Linear Dependence with Zero Correlation
**Problem Statement:**  
Let $X \sim \mathcal{U}(-1, 1)$ and $Y = X^2$.
1. Calculate $\mathbb{E}[X]$, $\mathbb{E}[Y]$, and $\mathbb{E}[XY]$.
2. Calculate $\text{Cov}(X, Y)$ and Pearson correlation $\rho$.
3. Compute the conditional variance $\text{Var}(Y \mid X)$.

**Detailed Solution:**  
1. **Expectations:**
   $$
   \mathbb{E}[X] = \int_{-1}^1 \frac{x}{2} \, dx = 0
   $$
   $$
   \mathbb{E}[Y] = \mathbb{E}[X^2] = \int_{-1}^1 \frac{x^2}{2} \, dx = \left[ \frac{x^3}{6} \right]_{-1}^1 = \frac{1}{6} - \left(-\frac{1}{6}\right) = \frac{1}{3}
   $$
   $$
   \mathbb{E}[XY] = \mathbb{E}[X(X^2)] = \mathbb{E}[X^3] = \int_{-1}^1 \frac{x^3}{2} \, dx = 0 \quad (\text{odd function on symmetric interval})
   $$

2. **Covariance and Correlation:**
   $$
   \text{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y] = 0 - (0)(1/3) = 0
   $$
   $$
   \rho = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} = 0
   $$

3. **Conditional Variance:**
   Given $X = x$, $Y$ is completely deterministic: $Y = x^2$.
   $$
   \mathbb{E}[Y \mid X = x] = x^2
   $$
   $$
   \text{Var}(Y \mid X = x) = \mathbb{E}[(Y - x^2)^2 \mid X = x] = \mathbb{E}[(x^2 - x^2)^2] = 0
   $$
   The conditional variance is identically **zero** everywhere, demonstrating complete deterministic dependence despite zero correlation!

---

### Exercise 8.5: Random Sum Variance with Geometric Number of Exponential Jumps
**Problem Statement:**  
Let $S_N = \sum_{i=1}^N X_i$, where $N \sim \text{Geom}(p)$ (with support $\{1, 2, 3, \dots\}$, $\mathbb{E}[N] = 1/p$, $\text{Var}(N) = \frac{1-p}{p^2}$), and $X_i \sim \text{Exp}(\lambda)$ are i.i.d. with mean $1/\lambda$ and variance $1/\lambda^2$, independent of $N$.  
Using Eve's Law, derive the exact closed-form expression for $\text{Var}(S_N)$.

**Detailed Solution:**  
1. **Conditional Moments:**
   Given $N$, $S_N$ is a sum of $N$ independent exponentials:
   $$
   \mathbb{E}[S_N \mid N] = N \mathbb{E}[X_1] = \frac{N}{\lambda}
   $$
   $$
   \text{Var}(S_N \mid N) = N \text{Var}(X_1) = \frac{N}{\lambda^2}
   $$

2. **Applying Eve's Law:**
   $$
   \begin{aligned}
   \text{Var}(S_N) &= \mathbb{E}[\text{Var}(S_N \mid N)] + \text{Var}(\mathbb{E}[S_N \mid N]) \\
   &= \mathbb{E}\left[\frac{N}{\lambda^2}\right] + \text{Var}\left(\frac{N}{\lambda}\right) \\
   &= \frac{1}{\lambda^2} \mathbb{E}[N] + \frac{1}{\lambda^2} \text{Var}(N)
   \end{aligned}
   $$

3. **Substituting Moments of $N$:**
   $$
   \text{Var}(S_N) = \frac{1}{\lambda^2} \left( \frac{1}{p} \right) + \frac{1}{\lambda^2} \left( \frac{1 - p}{p^2} \right) = \frac{1}{\lambda^2} \left( \frac{p + 1 - p}{p^2} \right) = \frac{1}{\lambda^2 p^2} = \left(\frac{1}{\lambda p}\right)^2
   $$
   *(Note: This matches the fact that a geometric sum of i.i.d. exponentials is itself distributed as an exponential random variable with rate $\lambda p$!)*

---

### Exercise 8.6: Hierarchical Uniform Conditional Expectation
**Problem Statement:**  
Let $X \sim \mathcal{U}(0, 1)$, and conditional on $X = x$, let $Y \sim \mathcal{U}(0, x)$.
1. Find $\mathbb{E}[Y \mid X]$ and $\text{Var}(Y \mid X)$.
2. Calculate the unconditional mean $\mathbb{E}[Y]$.
3. Calculate the unconditional variance $\text{Var}(Y)$ using Eve's Law.

**Detailed Solution:**  
1. **Conditional Moments:**
   For a uniform variable on $[0, x]$:
   $$
   \mathbb{E}[Y \mid X = x] = \frac{x}{2} \implies \mathbb{E}[Y \mid X] = \frac{X}{2}
   $$
   $$
   \text{Var}(Y \mid X = x) = \frac{x^2}{12} \implies \text{Var}(Y \mid X) = \frac{X^2}{12}
   $$

2. **Unconditional Mean:**
   By Adam's Law:
   $$
   \mathbb{E}[Y] = \mathbb{E}\big[\mathbb{E}[Y \mid X]\big] = \mathbb{E}\left[\frac{X}{2}\right] = \frac{1}{2} \mathbb{E}[X] = \frac{1}{2}\left(\frac{1}{2}\right) = \frac{1}{4}
   $$

3. **Unconditional Variance via Eve's Law:**
   $$
   \text{Var}(Y) = \mathbb{E}[\text{Var}(Y \mid X)] + \text{Var}(\mathbb{E}[Y \mid X]) = \mathbb{E}\left[\frac{X^2}{12}\right] + \text{Var}\left(\frac{X}{2}\right) = \frac{1}{12}\mathbb{E}[X^2] + \frac{1}{4}\text{Var}(X)
   $$
   For $X \sim \mathcal{U}(0, 1)$, $\mathbb{E}[X^2] = \int_0^1 x^2 \, dx = \frac{1}{3}$, and $\text{Var}(X) = \frac{1}{12}$.
   $$
   \text{Var}(Y) = \frac{1}{12}\left(\frac{1}{3}\right) + \frac{1}{4}\left(\frac{1}{12}\right) = \frac{1}{36} + \frac{1}{48} = \frac{4 + 3}{144} = \frac{7}{144} \approx 0.04861
   $$

---

### Exercise 8.7: Joint Density on an Unbounded Strip
**Problem Statement:**  
Let $f_{X,Y}(x, y) = 2 e^{-(x + 2y)}$ for $0 < x < y < \infty$.
1. Verify normalization.
2. Find the marginal density $f_Y(y)$.
3. Compute the conditional density $f_{X \mid Y}(x \mid y)$ and conditional expectation $\mathbb{E}[X \mid Y = y]$.

**Detailed Solution:**  
1. **Normalization:**
   $$
   \begin{aligned}
   \int_0^\infty \int_x^\infty 2 e^{-(x + 2y)} \, dy \, dx &= \int_0^\infty 2 e^{-x} \left[ -\frac{e^{-2y}}{2} \right]_x^\infty dx = \int_0^\infty 2 e^{-x} \left( \frac{e^{-2x}}{2} \right) dx \\
   &= \int_0^\infty e^{-3x} \, dx = \left[ -\frac{e^{-3x}}{3} \right]_0^\infty = \frac{1}{3} \neq 1
   \end{aligned}
   $$
   To make it a valid density, we normalize by scaling by $3$:
   $$
   f_{X,Y}(x, y) = 6 e^{-(x + 2y)} \quad \text{for } 0 < x < y < \infty
   $$

2. **Marginal $f_Y(y)$:**
   For a fixed $y > 0$, $x$ ranges from $0$ to $y$:
   $$
   f_Y(y) = \int_0^y 6 e^{-(x + 2y)} \, dx = 6 e^{-2y} \left[ -e^{-x} \right]_0^y = 6 e^{-2y} (1 - e^{-y}) = 6(e^{-2y} - e^{-3y}) \quad \text{for } y > 0
   $$

3. **Conditional Density and Expectation:**
   For $0 < x < y$:
   $$
   f_{X \mid Y}(x \mid y) = \frac{f_{X,Y}(x, y)}{f_Y(y)} = \frac{6 e^{-(x + 2y)}}{6(e^{-2y} - e^{-3y})} = \frac{e^{-2y} e^{-x}}{e^{-2y}(1 - e^{-y})} = \frac{e^{-x}}{1 - e^{-y}}
   $$
   Now calculate $\mathbb{E}[X \mid Y = y]$:
   $$
   \mathbb{E}[X \mid Y = y] = \int_0^y x \left( \frac{e^{-x}}{1 - e^{-y}} \right) dx = \frac{1}{1 - e^{-y}} \int_0^y x e^{-x} \, dx
   $$
   Integrating by parts ($\int x e^{-x} \, dx = -x e^{-x} - e^{-x}$):
   $$
   \int_0^y x e^{-x} \, dx = \left[ -e^{-x}(x + 1) \right]_0^y = 1 - e^{-y}(y + 1)
   $$
   Thus:
   $$
   \mathbb{E}[X \mid Y = y] = \frac{1 - (y + 1)e^{-y}}{1 - e^{-y}}
   $$

---

### Exercise 8.8: Correlation Invariance Under Affine Transformations
**Problem Statement:**  
Let $X$ and $Y$ be random variables with correlation $\rho_{X,Y}$, and define transformed variables $U = aX + b$ and $V = cY + d$ with $a, c \neq 0$.  
Prove that:
$$
\rho_{U,V} = \text{sign}(ac) \, \rho_{X,Y}
$$

**Detailed Solution:**  
1. **Covariance Transformation:**
   Using the bilinearity of covariance:
   $$
   \text{Cov}(U, V) = \text{Cov}(aX + b, cY + d) = ac \, \text{Cov}(X, Y)
   $$

2. **Standard Deviation Transformation:**
   $$
   \text{Var}(U) = a^2 \text{Var}(X) \implies \sigma_U = |a| \sigma_X
   $$
   $$
   \text{Var}(V) = c^2 \text{Var}(Y) \implies \sigma_V = |c| \sigma_Y
   $$

3. **Correlation Ratio:**
   $$
   \rho_{U,V} = \frac{\text{Cov}(U, V)}{\sigma_U \sigma_V} = \frac{ac \, \text{Cov}(X, Y)}{|a|\sigma_X |c|\sigma_Y} = \left(\frac{ac}{|ac|}\right) \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} = \text{sign}(ac) \, \rho_{X,Y} \quad \blacksquare
   $$

---

### Exercise 8.9: Two-Stage Hierarchical Defect Inspection
**Problem Statement:**  
A manufacturing plant produces a random batch size $M \sim \text{Pois}(\lambda)$ of microchips per hour. Each chip independently has probability $p$ of being defective. Let $K$ denote the number of defective chips in the batch, so $(K \mid M = m) \sim \text{Bin}(m, p)$.  
1. Find $\mathbb{E}[K]$ using the Tower Property.
2. Find $\text{Var}(K)$ using Eve's Law.
3. Identify the unconditional marginal distribution of $K$.

**Detailed Solution:**  
1. **Mean via Adam's Law:**
   $$
   \mathbb{E}[K \mid M] = M p
   $$
   $$
   \mathbb{E}[K] = \mathbb{E}\big[\mathbb{E}[K \mid M]\big] = \mathbb{E}[M p] = p \mathbb{E}[M] = \lambda p
   $$

2. **Variance via Eve's Law:**
   For a binomial distribution, $\text{Var}(K \mid M) = M p (1 - p)$.
   $$
   \begin{aligned}
   \text{Var}(K) &= \mathbb{E}[\text{Var}(K \mid M)] + \text{Var}(\mathbb{E}[K \mid M]) \\
   &= \mathbb{E}[M p (1 - p)] + \text{Var}(M p) \\
   &= p(1 - p)\mathbb{E}[M] + p^2 \text{Var}(M)
   \end{aligned}
   $$
   For $M \sim \text{Pois}(\lambda)$, $\mathbb{E}[M] = \lambda$ and $\text{Var}(M) = \lambda$:
   $$
   \text{Var}(K) = p(1 - p)\lambda + p^2 \lambda = \lambda [p - p^2 + p^2] = \lambda p
   $$

3. **Unconditional Distribution of $K$:**
   Notice that $\mathbb{E}[K] = \text{Var}(K) = \lambda p$. This strongly suggests a Poisson distribution!  
   Computing the marginal PMF via the Law of Total Probability:
   $$
   \begin{aligned}
   P(K = k) &= \sum_{m=k}^\infty P(K = k \mid M = m) P(M = m) \\
   &= \sum_{m=k}^\infty \binom{m}{k} p^k (1 - p)^{m-k} \frac{\lambda^m e^{-\lambda}}{m!}
   \end{aligned}
   $$
   Substitute $\binom{m}{k} = \frac{m!}{k!(m-k)!}$:
   $$
   P(K = k) = \frac{p^k e^{-\lambda}}{k!} \sum_{m=k}^\infty \frac{(1 - p)^{m-k} \lambda^m}{(m - k)!}
   $$
   Let $j = m - k$, so $m = j + k$ and $\lambda^m = \lambda^k \lambda^j$:
   $$
   P(K = k) = \frac{(\lambda p)^k e^{-\lambda}}{k!} \sum_{j=0}^\infty \frac{(\lambda(1 - p))^j}{j!} = \frac{(\lambda p)^k e^{-\lambda}}{k!} e^{\lambda(1 - p)} = \frac{(\lambda p)^k e^{-\lambda p}}{k!}
   $$
   This is precisely the PMF of a **Poisson distribution with parameter $\lambda p$**:
   $$
   K \sim \text{Pois}(\lambda p)
   $$
   *(This fundamental result is known as **Poisson Thinning**).*

---

### Exercise 8.10: Proof of the Cauchy-Schwarz Inequality for Random Variables
**Problem Statement:**  
Let $X$ and $Y$ be square-integrable random variables ($\mathbb{E}[X^2] < \infty, \mathbb{E}[Y^2] < \infty$).  
Prove rigorously that:
$$
|\text{Cov}(X, Y)| \le \sigma_X \sigma_Y
$$
and determine the exact necessary and sufficient condition under which equality holds.

**Detailed Solution:**  
1. **Centering:**
   Let $U = X - \mu_X$ and $V = Y - \mu_Y$. Then $\mathbb{E}[U] = 0, \mathbb{E}[V] = 0$, $\mathbb{E}[U^2] = \sigma_X^2$, $\mathbb{E}[V^2] = \sigma_Y^2$, and $\mathbb{E}[UV] = \text{Cov}(X, Y)$.  
   If $\sigma_X = 0$, then $X = \mu_X$ almost surely, $\text{Cov}(X, Y) = 0$, and the inequality $0 \le 0$ holds trivially. Assume $\sigma_X > 0$ and $\sigma_Y > 0$.

2. **Quadratic Form Non-Negativity:**
   For any real scalar $t \in \mathbb{R}$, consider the square of the linear combination $t U + V$:
   $$
   (t U + V)^2 \ge 0 \quad \text{almost surely}
   $$
   Taking expectations:
   $$
   h(t) = \mathbb{E}[(t U + V)^2] \ge 0 \quad \forall t \in \mathbb{R}
   $$
   Expanding using linearity:
   $$
   h(t) = t^2 \mathbb{E}[U^2] + 2t \mathbb{E}[UV] + \mathbb{E}[V^2] = t^2 \sigma_X^2 + 2t \, \text{Cov}(X, Y) + \sigma_Y^2 \ge 0
   $$

3. **Discriminant Condition:**
   $h(t)$ is a quadratic in $t$ with positive leading coefficient $A = \sigma_X^2 > 0$.  
   For $h(t) \ge 0$ to hold for all $t \in \mathbb{R}$, the quadratic can have at most one real root. Hence its discriminant $\Delta$ must satisfy $\Delta \le 0$:
   $$
   \Delta = B^2 - 4AC = (2 \, \text{Cov}(X, Y))^2 - 4 \sigma_X^2 \sigma_Y^2 \le 0
   $$
   $$
   4 (\text{Cov}(X, Y))^2 \le 4 \sigma_X^2 \sigma_Y^2 \implies (\text{Cov}(X, Y))^2 \le \sigma_X^2 \sigma_Y^2
   $$
   Taking the square root:
   $$
   |\text{Cov}(X, Y)| \le \sigma_X \sigma_Y \quad \blacksquare
   $$

4. **Equality Condition:**
   Equality $|\text{Cov}(X, Y)| = \sigma_X \sigma_Y$ holds if and only if $\Delta = 0$. This occurs if and only if there exists a unique real root $t^* = -\frac{\text{Cov}(X, Y)}{\sigma_X^2}$ such that:
   $$
   h(t^*) = \mathbb{E}[(t^* U + V)^2] = 0
   $$
   Because the expected square of a random variable is zero if and only if the random variable is zero almost surely:
   $$
   t^* (X - \mu_X) + (Y - \mu_Y) = 0 \quad \text{a.s.}
   $$
   $$
   Y = -t^* X + (\mu_Y + t^* \mu_X) \quad \text{a.s.}
   $$
   Thus, equality holds **if and only if $Y$ is an exact affine function of $X$ almost surely**.
