# Chapter 9: The Gaussian Normal Distribution and Multivariate Normals

> *"The Gaussian distribution is not merely one probability distribution among many. It is the central sun around which the entire solar system of mathematical statistics revolves; an inevitable mathematical attractor born from the accumulation of microscopic independent perturbations."*  
> — **Carl Friedrich Gauss**, *Theoria Motus Corporum Coelestium* (1809)

---

## 9.1 The Univariate Normal Distribution: Genesis and Normalization

No single mathematical function has exercised a more pervasive influence across the physical, biological, computational, and social sciences than the Gaussian normal distribution. Known informally as the "bell curve", it emerges spontaneously in astronomical measurement errors, quantum thermal noise, thermal velocities of ideal gas molecules (Maxwell-Boltzmann distribution), biometric traits, and algorithmic machine learning representations.

### 9.1.1 Historical Evolution: From de Moivre to Gauss

The normal distribution was not discovered in a single flash of insight; it was forged through three distinct mathematical crises:
1. **Abraham de Moivre (1738):** Seeking to approximate symmetric binomial probabilities $\binom{n}{k} (1/2)^n$ for large $n$ (such as coin flips in gambling games), de Moivre discovered that the binomial coefficients asymptotically scale according to the exponential curve $e^{-x^2}$.
2. **Pierre-Simon Laplace (1774, 1812):** Laplace generalized de Moivre's result to arbitrary success probabilities $p \in (0, 1)$, establishing the early foundation of the Central Limit Theorem. Laplace demonstrated that the sum of independent, identically distributed measurement disturbances converges inexorably toward this curve.
3. **Carl Friedrich Gauss (1809):** In his landmark treatise on celestial mechanics, Gauss derived the distribution from first principles of inverse probability. Gauss asked: *What error distribution uniquely guarantees that the arithmetic mean of repeated astronomical observations represents the most probable value of the true position?* He proved that the unique probability density satisfying this axiom is the exponential quadratic function:
   $$
   f(x) \propto \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)
   $$

```
               The Universal Bell Curve N(mu, sigma^2)
                              f(x)
                               ^
                             / | \         Peak = 1 / (sigma * sqrt(2*pi))
                            /  |  \
                           /   |   \
                         /     |     \
                       /       |       \
                     /         |         \
         -----------+----------+----------+-----------> x
                  mu-sigma     mu       mu+sigma
                   <-------- 68.27% -------->
             <-------------- 95.45% -------------->
       <-------------------- 99.73% -------------------->
```

### 9.1.2 The Univariate Gaussian Density Function

A continuous random variable $X$ is said to follow a **normal (or Gaussian) distribution** with mean parameter $\mu \in \mathbb{R}$ and variance parameter $\sigma^2 > 0$—denoted $X \sim \mathcal{N}(\mu, \sigma^2)$—if its probability density function is given by:
$$
f_X(x; \mu, \sigma^2) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right) \quad \text{for } x \in (-\infty, \infty)
$$

When $\mu = 0$ and $\sigma = 1$, the variable is termed the **standard normal random variable**, traditionally denoted $Z \sim \mathcal{N}(0, 1)$, with PDF:
$$
\phi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2 / 2}
$$
and cumulative distribution function:
$$
\Phi(z) = P(Z \le z) = \int_{-\infty}^z \frac{1}{\sqrt{2\pi}} e^{-u^2 / 2} \, du
$$

### 9.1.3 The Polar Coordinate Evaluation of the Gaussian Integral

A cornerstone of mathematical analysis is the evaluation of the total area under the unnormalized Gaussian curve:
$$
I = \int_{-\infty}^\infty e^{-x^2 / 2} \, dx
$$
The integrand $e^{-x^2 / 2}$ possesses no elementary antiderivative (Liouville's theorem on integration in finite terms). Siméon Denis Poisson solved this intractable one-dimensional integral by elevating it to two dimensions.

#### Theorem: The Gaussian Integral
$$
\int_{-\infty}^\infty e^{-x^2 / 2} \, dx = \sqrt{2\pi}
$$

*Proof (Poisson's Polar Coordinate Method):*  
Consider the square of the integral $I$:
$$
I^2 = \left( \int_{-\infty}^\infty e^{-x^2 / 2} \, dx \right) \left( \int_{-\infty}^\infty e^{-y^2 / 2} \, dy \right)
$$
Because the variables of integration are dummy variables, we combine them into a single double integral over the entire Euclidean plane $\mathbb{R}^2$:
$$
I^2 = \int_{-\infty}^\infty \int_{-\infty}^\infty e^{-(x^2 + y^2)/2} \, dx \, dy
$$
We transform the Cartesian coordinates $(x, y)$ to polar coordinates $(r, \theta)$, where:
$$
x = r \cos \theta, \quad y = r \sin \theta, \quad x^2 + y^2 = r^2
$$
The Jacobian determinant of this coordinate transformation is:
$$
J = \begin{vmatrix} \frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} \\ \frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta} \end{vmatrix} = \begin{vmatrix} \cos \theta & -r \sin \theta \\ \sin \theta & r \cos \theta \end{vmatrix} = r \cos^2 \theta + r \sin^2 \theta = r
$$
Thus, the differential area element transforms as $dx \, dy = r \, dr \, d\theta$. The planar limits span $r \in [0, \infty)$ and $\theta \in [0, 2\pi)$:
$$
I^2 = \int_0^{2\pi} d\theta \int_0^\infty r e^{-r^2 / 2} \, dr
$$
The angular integral evaluates immediately to $2\pi$:
$$
I^2 = 2\pi \int_0^\infty r e^{-r^2 / 2} \, dr
$$
For the radial integral, substitute $u = r^2 / 2$, so $du = r \, dr$. The integration limits remain $u \in [0, \infty)$:
$$
\int_0^\infty r e^{-r^2 / 2} \, dr = \int_0^\infty e^{-u} \, du = \left[ -e^{-u} \right]_0^\infty = 0 - (-1) = 1
$$
Substituting this result into $I^2$:
$$
I^2 = 2\pi(1) = 2\pi \implies I = \sqrt{2\pi}
$$
Because the integrand is strictly positive, the positive root is taken. Performing the linear change of variable $z = \frac{x - \mu}{\sigma}$ ($dx = \sigma \, dz$) yields:
$$
\int_{-\infty}^\infty \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right) dx = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty e^{-z^2 / 2} \, dz = \frac{\sqrt{2\pi}}{\sqrt{2\pi}} = 1 \quad \blacksquare
$$

---

## 9.2 Moments and the Moment Generating Function of the Gaussian

The Gaussian distribution possesses extraordinary algebraic symmetry. Every odd central moment vanishes, and every even central moment is an exact combinatorial function of the variance $\sigma^2$.

### 9.2.1 Derivation of the MGF via Completing the Square

Let $X \sim \mathcal{N}(\mu, \sigma^2)$. The Moment Generating Function $M_X(t) = \mathbb{E}[e^{tX}]$ is derived by direct integration:
$$
M_X(t) = \int_{-\infty}^\infty e^{tx} \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right) dx
$$
Substitute $z = \frac{x - \mu}{\sigma}$, so $x = \mu + \sigma z$ and $dx = \sigma \, dz$:
$$
\begin{aligned}
M_X(t) &= \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty e^{t(\mu + \sigma z)} e^{-z^2 / 2} \, dz \\
&= e^{\mu t} \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty \exp\left( -\frac{1}{2}(z^2 - 2\sigma t z) \right) dz
\end{aligned}
$$
We complete the square in the exponent:
$$
z^2 - 2\sigma t z = (z - \sigma t)^2 - \sigma^2 t^2
$$
Substituting this back into the exponential:
$$
\begin{aligned}
M_X(t) &= e^{\mu t} \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty \exp\left( -\frac{1}{2}(z - \sigma t)^2 + \frac{1}{2}\sigma^2 t^2 \right) dz \\
&= e^{\mu t + \frac{1}{2}\sigma^2 t^2} \underbrace{\left[ \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty e^{-\frac{1}{2}(z - \sigma t)^2} dz \right]}_{= 1 \text{ (integral of standard normal shifted by } \sigma t)}
\end{aligned}
$$
Thus, we arrive at the closed-form **Gaussian Moment Generating Function**:
$$
M_X(t) = \exp\left( \mu t + \frac{1}{2}\sigma^2 t^2 \right)
$$

### 9.2.2 Higher Central Moments and Isserlis' Theorem

For a centered Gaussian random variable $Z \sim \mathcal{N}(0, \sigma^2)$, its MGF expands as:
$$
M_Z(t) = \exp\left(\frac{1}{2}\sigma^2 t^2\right) = \sum_{k=0}^\infty \frac{1}{k!} \left( \frac{\sigma^2 t^2}{2} \right)^k = \sum_{k=0}^\infty \frac{\sigma^{2k}}{2^k k!} t^{2k}
$$
Matching this Taylor expansion with the canonical series definition $M_Z(t) = \sum_{n=0}^\infty \frac{\mathbb{E}[Z^n]}{n!} t^n$:
1. **Odd Moments:** Because the series contains only even powers of $t^{2k}$, the coefficient of $t^{2k+1}$ is identically zero:
   $$
   \mathbb{E}[Z^{2k+1}] = 0 \quad \forall k \in \{0, 1, 2, \dots\}
   $$
2. **Even Moments:** Equating coefficients for $t^{2k}$:
   $$
   \frac{\mathbb{E}[Z^{2k}]}{(2k)!} = \frac{\sigma^{2k}}{2^k k!} \implies \mathbb{E}[Z^{2k}] = \frac{(2k)!}{2^k k!} \sigma^{2k}
   $$
   Recognizing that $\frac{(2k)!}{2^k k!} = (2k - 1)!! = (2k - 1)(2k - 3) \cdots 3 \cdot 1$ (the double factorial):
   $$
   \mathbb{E}[Z^{2k}] = (2k - 1)!! \, \sigma^{2k}
   $$
   In particular:
   - Second moment: $\mathbb{E}[Z^2] = 1!! \, \sigma^2 = \sigma^2$.
   - Fourth moment: $\mathbb{E}[Z^4] = 3!! \, \sigma^4 = 3\sigma^4$.
   - Kurtosis: $\text{Kurt}(X) = \frac{\mathbb{E}[(X - \mu)^4]}{\sigma^4} = \frac{3\sigma^4}{\sigma^4} = 3$ (Excess Kurtosis $\gamma_2 = 3 - 3 = 0$).

This combinatorial result generalizes to higher dimensions as **Isserlis' Theorem (Wick's Probability Theorem)**, which states that the expectation of a product of jointly Gaussian random variables equals the sum over all possible pairwise combinations of covariances.

---

## 9.3 The Multivariate Normal Distribution

In modern machine learning, robotics, signal processing, and physics simulation, variables do not exist in isolation. A drone's state estimator tracks a 12-dimensional vector of positions, linear velocities, angular orientations, and angular velocities. The standard multidimensional generalization of the Gaussian distribution is the **Multivariate Normal (MVN)** distribution.

### 9.3.1 Definition via Linear Representation

Let $\mathbf{Z} = [Z_1, Z_2, \dots, Z_k]^T \in \mathbb{R}^k$ be a vector of $k$ independent, identically distributed standard normal random variables, $Z_i \sim \mathcal{N}(0, 1)$. The joint density of $\mathbf{Z}$ is the product of its marginals:
$$
f_{\mathbf{Z}}(\mathbf{z}) = \prod_{i=1}^k \frac{1}{\sqrt{2\pi}} e^{-z_i^2 / 2} = \frac{1}{(2\pi)^{k/2}} \exp\left( -\frac{1}{2} \sum_{i=1}^k z_i^2 \right) = \frac{1}{(2\pi)^{k/2}} \exp\left( -\frac{1}{2} \mathbf{z}^T \mathbf{z} \right)
$$

A random vector $\mathbf{X} \in \mathbb{R}^n$ is said to follow a **multivariate normal distribution** with mean vector $\boldsymbol{\mu} \in \mathbb{R}^n$ and covariance matrix $\mathbf{\Sigma} \in \mathbb{R}^{n \times n}$—denoted $\mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \mathbf{\Sigma})$—if it can be expressed as an affine transformation of standard normal variables:
$$
\mathbf{X} = \mathbf{A} \mathbf{Z} + \boldsymbol{\mu}
$$
where $\mathbf{A} \in \mathbb{R}^{n \times k}$ is a deterministic matrix satisfying:
$$
\mathbf{\Sigma} = \mathbf{A} \mathbf{A}^T
$$

### 9.3.2 The Multivariate Normal Density Function

When $\mathbf{\Sigma}$ is strictly positive definite (and therefore invertible, $\det(\mathbf{\Sigma}) > 0$), the multivariate change of variables theorem applied to $\mathbf{X} = \mathbf{A}\mathbf{Z} + \boldsymbol{\mu}$ yields the closed-form density function:
$$
f_{\mathbf{X}}(\mathbf{x}; \boldsymbol{\mu}, \mathbf{\Sigma}) = \frac{1}{(2\pi)^{n/2} \sqrt{\det(\mathbf{\Sigma})}} \exp\left( -\frac{1}{2} (\mathbf{x} - \boldsymbol{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu}) \right)
$$

```
               Bivariate Normal Distribution Surface
                             f(x1, x2)
                                 ^
                               / | \        Peak = 1 / (2*pi*sqrt(|Sigma|))
                             /   |   \
                           /     |     \
                         /  Contours of  \
                       /   Equal Density   \
                     /    (Ellipses)        \
                    +------------------------+
                   /                        /
                  /      (x - mu)^T        /
                 /     Sigma^-1 (x - mu)  /
                /          = c^2         /
               +------------------------+
```

---

## 9.4 Geometric Intuition: The Mahalanobis Distance and Error Ellipsoids

The multivariate Gaussian density is uniquely dictated by the quadratic form in its exponent:
$$
d_M^2(\mathbf{x}) = (\mathbf{x} - \boldsymbol{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu})
$$
This quantity is termed the squared **Mahalanobis distance**.

### 9.4.1 Mahalanobis vs. Euclidean Distance

In standard Euclidean space, the distance from a point $\mathbf{x}$ to $\boldsymbol{\mu}$ is $d_E^2(\mathbf{x}) = (\mathbf{x} - \boldsymbol{\mu})^T (\mathbf{x} - \boldsymbol{\mu})$. Level sets of Euclidean distance form spheres. However, Euclidean distance treats all coordinate axes as orthogonal, uncorrelated, and possessing identical variance.

The Mahalanobis distance warps space to account for two fundamental statistical realities:
1. **Unequal Variances:** Deviating by $2$ units along an axis with $\sigma = 10$ is statistically minor, whereas deviating by $2$ units along an axis with $\sigma = 0.1$ is an extreme outlier.
2. **Correlations:** If two variables are highly positively correlated, points deviating along the line $x_2 = x_1$ are expected, whereas deviations perpendicular to this line ($x_2 = -x_1$) represent severe anomalies.

The Mahalanobis metric standardizes the coordinate system by rotating along the principal axes of covariance and scaling by the reciprocal standard deviations.

### 9.4.2 Spectral Decomposition and Principal Axes of Error Ellipses

Because $\mathbf{\Sigma}$ is symmetric and positive definite, the Spectral Theorem guarantees the existence of an orthogonal matrix $\mathbf{Q} = [\mathbf{v}_1, \dots, \mathbf{v}_n]$ of eigenvectors and a diagonal matrix of positive eigenvalues $\mathbf{\Lambda} = \text{diag}(\lambda_1, \dots, \lambda_n)$ such that:
$$
\mathbf{\Sigma} = \mathbf{Q} \mathbf{\Lambda} \mathbf{Q}^T \implies \mathbf{\Sigma}^{-1} = \mathbf{Q} \mathbf{\Lambda}^{-1} \mathbf{Q}^T
$$
Substitute this into the Mahalanobis quadratic form:
$$
d_M^2(\mathbf{x}) = (\mathbf{x} - \boldsymbol{\mu})^T \mathbf{Q} \mathbf{\Lambda}^{-1} \mathbf{Q}^T (\mathbf{x} - \boldsymbol{\mu}) = \mathbf{y}^T \mathbf{\Lambda}^{-1} \mathbf{y} = \sum_{i=1}^n \frac{y_i^2}{\lambda_i}
$$
where $\mathbf{y} = \mathbf{Q}^T (\mathbf{x} - \boldsymbol{\mu})$ represents the coordinates of $\mathbf{x}$ rotated into the eigenvector frame.

The level sets where density is constant ($f_{\mathbf{X}}(\mathbf{x}) = \text{const}$) correspond to:
$$
d_M^2(\mathbf{x}) = \sum_{i=1}^n \frac{y_i^2}{\lambda_i} = c^2
$$
This is the canonical Cartesian equation of an **$n$-dimensional hyper-ellipsoid**:
- The center is located at the mean vector $\boldsymbol{\mu}$.
- The principal axes are aligned with the eigenvectors $\mathbf{v}_i$ of $\mathbf{\Sigma}$.
- The semi-axis lengths are given by $c \sqrt{\lambda_i} = c \sigma_i$.

```
               Geometry of the 2D Error Ellipse
                    x2 ^
                       |        .  *  .
                       |      *         *  Principal Axis 1 (v1)
                       |    *      /\     *   Length = 2 * c * sqrt(lambda_1)
                       |   *      /  \      *
                       |  *      /    \      *
                       |  *     /  mu  \     *
                       |  *     \      /     *
                       |   *     \    /     *
                       |    *     \  /    *   Principal Axis 2 (v2)
                       |      *    \/   *     Length = 2 * c * sqrt(lambda_2)
                       |        .  *  .
                       +------------------------> x1
```

### 9.4.3 Distribution of the Mahalanobis Distance: Chi-Square Connection

What is the probability that a realization $\mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \mathbf{\Sigma})$ falls inside an error ellipsoid of radius $c$?

Let $\mathbf{Z} = \mathbf{\Lambda}^{-1/2} \mathbf{Q}^T (\mathbf{X} - \boldsymbol{\mu})$. Because $\mathbf{X}$ is Gaussian, $\mathbf{Z}$ is a vector of $n$ independent standard normal variables $Z_i \sim \mathcal{N}(0, 1)$. The squared Mahalanobis distance is:
$$
d_M^2(\mathbf{X}) = \mathbf{Z}^T \mathbf{Z} = \sum_{i=1}^n Z_i^2
$$
By definition, the sum of squares of $n$ independent standard normal variables follows a **Chi-Square distribution with $n$ degrees of freedom**:
$$
d_M^2(\mathbf{X}) \sim \chi^2(n)
$$
Therefore, the probability of falling within the ellipsoid $d_M^2(\mathbf{X}) \le c^2$ is exactly given by the cumulative distribution function of $\chi^2(n)$:
$$
P(d_M^2(\mathbf{X}) \le c^2) = F_{\chi^2(n)}(c^2)
$$

For a 2D Gaussian ($n = 2$), the $\chi^2(2)$ distribution is an exponential distribution with rate parameter $1/2$:
$$
F_{\chi^2(2)}(c^2) = 1 - e^{-c^2 / 2}
$$
To capture a specific probability mass $1 - \alpha$ (e.g., $95\%$ confidence):
$$
1 - e^{-c^2 / 2} = 1 - \alpha \implies e^{-c^2 / 2} = \alpha \implies c^2 = -2 \ln(\alpha) \implies c = \sqrt{-2 \ln(\alpha)}
$$
- For $95\%$ confidence ($\alpha = 0.05$): $c = \sqrt{-2 \ln(0.05)} = \sqrt{2 \ln(20)} \approx \sqrt{5.991} \approx 2.447$.
- For $99\%$ confidence ($\alpha = 0.01$): $c = \sqrt{-2 \ln(0.01)} = \sqrt{2 \ln(100)} \approx \sqrt{9.210} \approx 3.035$.

---

## 9.5 Affine Transformations, Marginals, and Conditional Normals

The mathematical elegance of the multivariate normal distribution stems from its closure under linear operations:
1. Any linear or affine transformation of a Gaussian is Gaussian.
2. Every marginal distribution of a Gaussian is Gaussian.
3. Every conditional distribution of a Gaussian is Gaussian.

### 9.5.1 Affine Transformations

#### Theorem: Linear Closure
Let $\mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \mathbf{\Sigma})$ be an $n$-dimensional normal vector. Let $\mathbf{A} \in \mathbb{R}^{m \times n}$ and $\mathbf{b} \in \mathbb{R}^m$ be deterministic. Then the transformed vector $\mathbf{Y} = \mathbf{A}\mathbf{X} + \mathbf{b} \in \mathbb{R}^m$ is multivariate normal:
$$
\mathbf{Y} \sim \mathcal{N}\left(\mathbf{A}\boldsymbol{\mu} + \mathbf{b}, \; \mathbf{A}\mathbf{\Sigma}\mathbf{A}^T\right)
$$

*Proof:*  
The characteristic function of $\mathbf{X}$ is $\phi_{\mathbf{X}}(\mathbf{t}) = \mathbb{E}[e^{i \mathbf{t}^T \mathbf{X}}] = \exp\left( i \mathbf{t}^T \boldsymbol{\mu} - \frac{1}{2} \mathbf{t}^T \mathbf{\Sigma} \mathbf{t} \right)$.  
The characteristic function of $\mathbf{Y}$ is:
$$
\begin{aligned}
\phi_{\mathbf{Y}}(\mathbf{s}) &= \mathbb{E}[e^{i \mathbf{s}^T (\mathbf{A}\mathbf{X} + \mathbf{b})}] = e^{i \mathbf{s}^T \mathbf{b}} \mathbb{E}[e^{i (\mathbf{A}^T \mathbf{s})^T \mathbf{X}}] \\
&= e^{i \mathbf{s}^T \mathbf{b}} \exp\left( i (\mathbf{A}^T \mathbf{s})^T \boldsymbol{\mu} - \frac{1}{2} (\mathbf{A}^T \mathbf{s})^T \mathbf{\Sigma} (\mathbf{A}^T \mathbf{s}) \right) \\
&= \exp\left( i \mathbf{s}^T (\mathbf{A}\boldsymbol{\mu} + \mathbf{b}) - \frac{1}{2} \mathbf{s}^T (\mathbf{A}\mathbf{\Sigma}\mathbf{A}^T) \mathbf{s} \right)
\end{aligned}
$$
By the uniqueness theorem of characteristic functions, $\mathbf{Y}$ is strictly normal with mean $\mathbf{A}\boldsymbol{\mu} + \mathbf{b}$ and covariance $\mathbf{A}\mathbf{\Sigma}\mathbf{A}^T$. $\blacksquare$

### 9.5.2 Partitioning and Block Inversion (Schur Complements)

Consider partitioning an $n$-dimensional Gaussian vector into two subvectors $\mathbf{X}_1 \in \mathbb{R}^p$ and $\mathbf{X}_2 \in \mathbb{R}^q$ with $p + q = n$:
$$
\mathbf{X} = \begin{bmatrix} \mathbf{X}_1 \\ \mathbf{X}_2 \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} \boldsymbol{\mu}_1 \\ \boldsymbol{\mu}_2 \end{bmatrix}, \; \begin{bmatrix} \mathbf{\Sigma}_{11} & \mathbf{\Sigma}_{12} \\ \mathbf{\Sigma}_{21} & \mathbf{\Sigma}_{22} \end{bmatrix} \right)
$$
where $\mathbf{\Sigma}_{21} = \mathbf{\Sigma}_{12}^T$.

#### 1. Marginal Distributions:
Marginal distributions are obtained by simply selecting the corresponding sub-block:
$$
\mathbf{X}_1 \sim \mathcal{N}(\boldsymbol{\mu}_1, \mathbf{\Sigma}_{11})
$$
$$
\mathbf{X}_2 \sim \mathcal{N}(\boldsymbol{\mu}_2, \mathbf{\Sigma}_{22})
$$

#### 2. Conditional Distributions:
When we observe that $\mathbf{X}_2$ takes the specific vector value $\mathbf{x}_2$, the updated conditional distribution of $\mathbf{X}_1$ remains multivariate Gaussian:
$$
(\mathbf{X}_1 \mid \mathbf{X}_2 = \mathbf{x}_2) \sim \mathcal{N}(\boldsymbol{\mu}_{1|2}, \; \mathbf{\Sigma}_{1|2})
$$
where:
$$
\boldsymbol{\mu}_{1|2} = \boldsymbol{\mu}_1 + \mathbf{\Sigma}_{12} \mathbf{\Sigma}_{22}^{-1} (\mathbf{x}_2 - \boldsymbol{\mu}_2)
$$
$$
\mathbf{\Sigma}_{1|2} = \mathbf{\Sigma}_{11} - \mathbf{\Sigma}_{12} \mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21}
$$

The matrix $\mathbf{\Sigma}_{1|2} = \mathbf{\Sigma}_{11} - \mathbf{\Sigma}_{12} \mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21}$ is known in linear algebra as the **Schur complement** of $\mathbf{\Sigma}_{22}$ in $\mathbf{\Sigma}$.

> [!IMPORTANT]
> **Homoscedasticity of Conditional Gaussians:** Notice that the conditional covariance $\mathbf{\Sigma}_{1|2}$ depends **only** on the prior covariance blocks ($\mathbf{\Sigma}_{11}, \mathbf{\Sigma}_{12}, \mathbf{\Sigma}_{22}$) and is completely independent of the observed realization $\mathbf{x}_2$! The observed value shifts the conditional mean $\boldsymbol{\mu}_{1|2}$, but does not alter the remaining uncertainty ellipse. This property is what makes the **Kalman Filter** computationally tractable: error covariances can be pre-computed offline prior to receiving sensor telemetry.

---

## 9.6 Exactly 10 Worked Examples

### Worked Example 9.1: Polar Coordinate Evaluation of $\int_{-\infty}^\infty e^{-a x^2} dx$
**Problem Statement:**  
Evaluate the parameterized Gaussian integral $J(a) = \int_{-\infty}^\infty e^{-a x^2} \, dx$ for any constant $a > 0$ using double polar integration. Then verify that the normalizer of $\mathcal{N}(\mu, \sigma^2)$ equals $\frac{1}{\sigma \sqrt{2\pi}}$.

**Detailed Solution:**  
1. **Squaring $J(a)$:**
   $$
   J(a)^2 = \left( \int_{-\infty}^\infty e^{-a x^2} \, dx \right) \left( \int_{-\infty}^\infty e^{-a y^2} \, dy \right) = \int_{-\infty}^\infty \int_{-\infty}^\infty e^{-a(x^2 + y^2)} \, dx \, dy
   $$

2. **Polar Conversion:**
   With $x^2 + y^2 = r^2$ and $dx \, dy = r \, dr \, d\theta$:
   $$
   J(a)^2 = \int_0^{2\pi} d\theta \int_0^\infty r e^{-a r^2} \, dr = 2\pi \int_0^\infty r e^{-a r^2} \, dr
   $$

3. **Integration via Substitution:**
   Let $u = a r^2$, so $du = 2a r \, dr \implies r \, dr = \frac{du}{2a}$:
   $$
   \int_0^\infty r e^{-a r^2} \, dr = \frac{1}{2a} \int_0^\infty e^{-u} \, du = \frac{1}{2a} \left[ -e^{-u} \right]_0^\infty = \frac{1}{2a} (0 - (-1)) = \frac{1}{2a}
   $$
   Multiplying by $2\pi$:
   $$
   J(a)^2 = 2\pi \left(\frac{1}{2a}\right) = \frac{\pi}{a} \implies J(a) = \sqrt{\frac{\pi}{a}}
   $$

4. **Normalization of $\mathcal{N}(\mu, \sigma^2)$:**
   For $f(x) = C \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)$, let $u = x - \mu$:
   $$
   \int_{-\infty}^\infty \exp\left( -\frac{u^2}{2\sigma^2} \right) du = J\left(\frac{1}{2\sigma^2}\right) = \sqrt{\frac{\pi}{1 / (2\sigma^2)}} = \sqrt{2\pi \sigma^2} = \sigma \sqrt{2\pi}
   $$
   For the integral of $f(x)$ to equal 1, the constant must be $C = \frac{1}{\sigma \sqrt{2\pi}}$.

---

### Worked Example 9.2: Derivation of Gaussian Fourth Moment and Kurtosis
**Problem Statement:**  
Let $X \sim \mathcal{N}(\mu, \sigma^2)$.  
1. Use the MGF $M_X(t) = \exp(\mu t + \frac{1}{2}\sigma^2 t^2)$ to compute the fourth central moment $\mu_4 = \mathbb{E}[(X - \mu)^4]$.
2. Compute the excess kurtosis $\gamma_2 = \frac{\mu_4}{\sigma^4} - 3$.

**Detailed Solution:**  
1. **Centered Variable MGF:**
   Let $Z = X - \mu \sim \mathcal{N}(0, \sigma^2)$. Its MGF is:
   $$
   M_Z(t) = \exp\left(\frac{1}{2}\sigma^2 t^2\right)
   $$
   Taylor expanding the exponential function $e^u = 1 + u + \frac{u^2}{2!} + \frac{u^3}{3!} + \dots$ around $u = 0$, where $u = \frac{1}{2}\sigma^2 t^2$:
   $$
   M_Z(t) = 1 + \left(\frac{1}{2}\sigma^2 t^2\right) + \frac{1}{2!} \left(\frac{1}{2}\sigma^2 t^2\right)^2 + \frac{1}{3!} \left(\frac{1}{2}\sigma^2 t^2\right)^3 + \dots
   $$
   $$
   M_Z(t) = 1 + \frac{1}{2}\sigma^2 t^2 + \frac{1}{8}\sigma^4 t^4 + \frac{1}{48}\sigma^6 t^6 + \dots
   $$

2. **Extracting the Fourth Moment:**
   The series definition of the MGF is:
   $$
   M_Z(t) = \sum_{k=0}^\infty \frac{\mathbb{E}[Z^k]}{k!} t^k = 1 + \mathbb{E}[Z] t + \frac{\mathbb{E}[Z^2]}{2!} t^2 + \frac{\mathbb{E}[Z^3]}{3!} t^3 + \frac{\mathbb{E}[Z^4]}{4!} t^4 + \dots
   $$
   Equating the coefficient of $t^4$:
   $$
   \frac{\mathbb{E}[Z^4]}{4!} = \frac{1}{8}\sigma^4 \implies \mathbb{E}[Z^4] = 4! \left(\frac{1}{8}\sigma^4\right) = 24 \left(\frac{1}{8}\sigma^4\right) = 3\sigma^4
   $$
   Thus, $\mu_4 = \mathbb{E}[(X - \mu)^4] = 3\sigma^4$.

3. **Excess Kurtosis:**
   $$
   \gamma_2 = \frac{\mu_4}{\sigma^4} - 3 = \frac{3\sigma^4}{\sigma^4} - 3 = 3 - 3 = 0
   $$
   A normal distribution has zero excess kurtosis (it is **mesokurtic**).

---

### Worked Example 9.3: Affine Transformation and Standardization
**Problem Statement:**  
Let $X \sim \mathcal{N}(25, 16)$ (so $\mu = 25, \sigma^2 = 16$).  
1. Define $Y = -3X + 15$. Find the exact distribution of $Y$.
2. Compute $P(X \le 33)$.
3. Compute $P(Y \ge -60)$.

**Detailed Solution:**  
1. **Distribution of $Y$:**
   An affine transformation of a Gaussian is Gaussian: $Y \sim \mathcal{N}(\mu_Y, \sigma_Y^2)$.
   $$
   \mu_Y = -3\mu_X + 15 = -3(25) + 15 = -75 + 15 = -60
   $$
   $$
   \sigma_Y^2 = (-3)^2 \sigma_X^2 = 9(16) = 144 \implies \sigma_Y = \sqrt{144} = 12
   $$
   Thus, $Y \sim \mathcal{N}(-60, 144)$.

2. **Evaluating $P(X \le 33)$:**
   Standardize $X$ with $\mu = 25, \sigma = 4$:
   $$
   Z = \frac{33 - 25}{4} = \frac{8}{4} = 2.0
   $$
   $$
   P(X \le 33) = \Phi(2.0) \approx 0.97725 \; (97.725\%)
   $$

3. **Evaluating $P(Y \ge -60)$:**
   Standardize $Y$ with $\mu_Y = -60, \sigma_Y = 12$:
   $$
   Z_Y = \frac{-60 - (-60)}{12} = 0.0
   $$
   $$
   P(Y \ge -60) = 1 - \Phi(0.0) = 1 - 0.5 = 0.5000 \; (50.0\%)
   $$

---

### Worked Example 9.4: Independent Gaussian Sums via MGF Factorization
**Problem Statement:**  
Let $X_1 \sim \mathcal{N}(\mu_1, \sigma_1^2)$ and $X_2 \sim \mathcal{N}(\mu_2, \sigma_2^2)$ be independent random variables. Prove rigorously using MGFs that their sum $S = X_1 + X_2$ follows $\mathcal{N}(\mu_1 + \mu_2, \sigma_1^2 + \sigma_2^2)$.

**Detailed Solution:**  
1. **Factorization of MGF under Independence:**
   Because $X_1$ and $X_2$ are independent:
   $$
   M_S(t) = \mathbb{E}[e^{t(X_1 + X_2)}] = \mathbb{E}[e^{t X_1} e^{t X_2}] = \mathbb{E}[e^{t X_1}] \mathbb{E}[e^{t X_2}] = M_{X_1}(t) M_{X_2}(t)
   $$

2. **Substituting Gaussian MGFs:**
   $$
   M_{X_1}(t) = \exp\left(\mu_1 t + \frac{1}{2}\sigma_1^2 t^2\right)
   $$
   $$
   M_{X_2}(t) = \exp\left(\mu_2 t + \frac{1}{2}\sigma_2^2 t^2\right)
   $$
   Multiplying the exponentials:
   $$
   \begin{aligned}
   M_S(t) &= \exp\left(\mu_1 t + \frac{1}{2}\sigma_1^2 t^2\right) \exp\left(\mu_2 t + \frac{1}{2}\sigma_2^2 t^2\right) \\
   &= \exp\left( (\mu_1 + \mu_2)t + \frac{1}{2}(\sigma_1^2 + \sigma_2^2)t^2 \right)
   \end{aligned}
   $$

3. **Identification:**
   This expression matches the unique functional form of the MGF of a normal random variable with mean $\mu_S = \mu_1 + \mu_2$ and variance $\sigma_S^2 = \sigma_1^2 + \sigma_2^2$.  
   By the uniqueness theorem of Moment Generating Functions:
   $$
   S \sim \mathcal{N}(\mu_1 + \mu_2, \; \sigma_1^2 + \sigma_2^2) \quad \blacksquare
   $$

---

### Worked Example 9.5: Standard Bivariate Normal Rotational Invariance
**Problem Statement:**  
Let $(Z_1, Z_2)$ have joint density $f(z_1, z_2) = \frac{1}{2\pi} e^{-(z_1^2 + z_2^2)/2}$. Let $(W_1, W_2)$ be obtained by rotating the coordinate axes by an arbitrary angle $\theta$:
$$
\begin{bmatrix} W_1 \\ W_2 \end{bmatrix} = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \begin{bmatrix} Z_1 \\ Z_2 \end{bmatrix}
$$
1. Prove that $W_1$ and $W_2$ are independent standard normal variables.
2. What does this demonstrate about the geometry of bivariate standard normal noise?

**Detailed Solution:**  
1. **Affine Transformation Form:**
   Let $\mathbf{W} = \mathbf{R} \mathbf{Z}$, where $\mathbf{R} = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}$.  
   The mean vector of $\mathbf{Z}$ is $\boldsymbol{\mu} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$, and its covariance matrix is $\mathbf{\Sigma} = \mathbf{I}_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$.  
   Using the theorem of affine Gaussian transformations:
   $$
   \mathbb{E}[\mathbf{W}] = \mathbf{R} \boldsymbol{\mu} = \mathbf{R} \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}
   $$
   The covariance matrix of $\mathbf{W}$ is:
   $$
   \text{Cov}(\mathbf{W}) = \mathbf{R} \mathbf{\Sigma} \mathbf{R}^T = \mathbf{R} \mathbf{I}_2 \mathbf{R}^T = \mathbf{R} \mathbf{R}^T
   $$
   Evaluating $\mathbf{R}\mathbf{R}^T$:
   $$
   \begin{aligned}
   \mathbf{R}\mathbf{R}^T &= \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \begin{bmatrix} \cos \theta & \sin \theta \\ -\sin \theta & \cos \theta \end{bmatrix} \\
   &= \begin{bmatrix} \cos^2 \theta + \sin^2 \theta & \cos \theta \sin \theta - \sin \theta \cos \theta \\ \sin \theta \cos \theta - \cos \theta \sin \theta & \sin^2 \theta + \cos^2 \theta \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \mathbf{I}_2
   \end{aligned}
   $$
   Because $\mathbf{W}$ is jointly Gaussian with zero mean and identity covariance $\mathbf{I}_2$, its joint density is:
   $$
   f_{\mathbf{W}}(w_1, w_2) = \frac{1}{2\pi} e^{-(w_1^2 + w_2^2)/2} = \left(\frac{1}{\sqrt{2\pi}} e^{-w_1^2/2}\right) \left(\frac{1}{\sqrt{2\pi}} e^{-w_2^2/2}\right)
   $$
   $W_1$ and $W_2$ are independent standard normal variables: $W_1, W_2 \sim \text{i.i.d. } \mathcal{N}(0, 1)$.

2. **Geometric Interpretation:**
   Standard bivariate normal density is **completely isotropic (rotationally invariant)**. The contours of equal probability density are perfect circles centered at the origin, with no preferred orientation.

---

### Worked Example 9.6: Conditional Distribution of Bivariate Gaussian via Schur Complement
**Problem Statement:**  
Let $(X, Y)$ have joint Gaussian distribution with parameters:
$$
\boldsymbol{\mu} = \begin{bmatrix} 2 \\ 5 \end{bmatrix}, \quad \mathbf{\Sigma} = \begin{bmatrix} 4 & 3 \\ 3 & 9 \end{bmatrix}
$$
1. Extract the marginal variances $\sigma_X^2, \sigma_Y^2$ and correlation coefficient $\rho$.
2. Compute the conditional expectation function $\mathbb{E}[Y \mid X = x]$ and conditional variance $\text{Var}(Y \mid X = x)$.
3. If $X = 6$ is observed, state the numerical conditional distribution of $Y$.

**Detailed Solution:**  
1. **Marginal Parameters:**
   $$
   \sigma_X^2 = 4 \implies \sigma_X = 2
   $$
   $$
   \sigma_Y^2 = 9 \implies \sigma_Y = 3
   $$
   $$
   \text{Cov}(X, Y) = 3
   $$
   $$
   \rho = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y} = \frac{3}{2 \times 3} = \frac{3}{6} = 0.50
   $$

2. **Conditional Formulas:**
   Using the bivariate Gaussian conditioning theorem:
   $$
   \mathbb{E}[Y \mid X = x] = \mu_Y + \rho \frac{\sigma_Y}{\sigma_X} (x - \mu_X)
   $$
   $$
   \mathbb{E}[Y \mid X = x] = 5 + (0.5)\left(\frac{3}{2}\right)(x - 2) = 5 + 0.75(x - 2) = 0.75x + 3.5
   $$
   Using Schur complement for variance:
   $$
   \text{Var}(Y \mid X = x) = \sigma_Y^2 (1 - \rho^2) = 9(1 - 0.5^2) = 9(1 - 0.25) = 9(0.75) = 6.75 = \frac{27}{4}
   $$

3. **Conditioning on $X = 6$:**
   $$
   \mu_{Y \mid X=6} = 0.75(6) + 3.5 = 4.5 + 3.5 = 8.0
   $$
   $$
   \sigma_{Y \mid X=6}^2 = 6.75
   $$
   Thus:
   $$
   (Y \mid X = 6) \sim \mathcal{N}(8.0, \; 6.75)
   $$

---

### Worked Example 9.7: Mahalanobis Distance and 95% Confidence Ellipse
**Problem Statement:**  
A 2D robotic localization system estimates vehicle position $\mathbf{x} = [x_1, x_2]^T$ with covariance matrix:
$$
\mathbf{\Sigma} = \begin{bmatrix} 2.5 & 1.5 \\ 1.5 & 2.5 \end{bmatrix}
$$
centered at $\boldsymbol{\mu} = [0, 0]^T$.
1. Compute the eigenvalues and eigenvectors of $\mathbf{\Sigma}$.
2. Determine the orientation angle $\theta$ and semi-axis lengths of the $95\%$ confidence ellipse.
3. Determine whether the observation $\mathbf{x}_{\text{obs}} = [2, 1]^T$ lies inside the $95\%$ confidence region.

**Detailed Solution:**  
1. **Eigenvalues:**
   $$
   \det(\mathbf{\Sigma} - \lambda \mathbf{I}) = (2.5 - \lambda)^2 - 1.5^2 = 0
   $$
   $$
   (2.5 - \lambda - 1.5)(2.5 - \lambda + 1.5) = (1 - \lambda)(4 - \lambda) = 0 \implies \lambda_1 = 4, \quad \lambda_2 = 1
   $$
   **Eigenvectors:**
   For $\lambda_1 = 4$:
   $$
   \begin{bmatrix} -1.5 & 1.5 \\ 1.5 & -1.5 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \mathbf{0} \implies v_1 = v_2 \implies \mathbf{v}_1 = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 \\ 1 \end{bmatrix}
   $$
   For $\lambda_2 = 1$:
   $$
   \begin{bmatrix} 1.5 & 1.5 \\ 1.5 & 1.5 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \mathbf{0} \implies v_2 = -v_1 \implies \mathbf{v}_2 = \frac{1}{\sqrt{2}} \begin{bmatrix} -1 \\ 1 \end{bmatrix}
   $$

2. **Ellipse Geometry:**
   - Orientation: $\mathbf{v}_1$ makes an angle of $\theta = \arctan(1/1) = 45^\circ$ with the $x_1$-axis.
   - For $95\%$ confidence in 2D ($n = 2$):
     $$
     c^2 = -2 \ln(1 - 0.95) = -2 \ln(0.05) \approx 5.9915 \implies c \approx 2.4477
     $$
   - Semi-major axis length:
     $$
     a = c \sqrt{\lambda_1} = 2.4477 \times \sqrt{4} = 2.4477 \times 2 = 4.8955
     $$
   - Semi-minor axis length:
     $$
     b = c \sqrt{\lambda_2} = 2.4477 \times \sqrt{1} = 2.4477
     $$

3. **Evaluating Observation $\mathbf{x}_{\text{obs}} = [2, 1]^T$:**
   First compute the inverse covariance matrix $\mathbf{\Sigma}^{-1}$:
   $$
   \det(\mathbf{\Sigma}) = (2.5)(2.5) - (1.5)(1.5) = 6.25 - 2.25 = 4
   $$
   $$
   \mathbf{\Sigma}^{-1} = \frac{1}{4} \begin{bmatrix} 2.5 & -1.5 \\ -1.5 & 2.5 \end{bmatrix} = \begin{bmatrix} 0.625 & -0.375 \\ -0.375 & 0.625 \end{bmatrix}
   $$
   Now compute the squared Mahalanobis distance $d_M^2$:
   $$
   d_M^2 = \mathbf{x}^T \mathbf{\Sigma}^{-1} \mathbf{x} = \begin{bmatrix} 2 & 1 \end{bmatrix} \begin{bmatrix} 0.625 & -0.375 \\ -0.375 & 0.625 \end{bmatrix} \begin{bmatrix} 2 \\ 1 \end{bmatrix}
   $$
   $$
   \begin{bmatrix} 2 & 1 \end{bmatrix} \begin{bmatrix} (0.625 \times 2) - (0.375 \times 1) \\ (-0.375 \times 2) + (0.625 \times 1) \end{bmatrix} = \begin{bmatrix} 2 & 1 \end{bmatrix} \begin{bmatrix} 1.25 - 0.375 \\ -0.75 + 0.625 \end{bmatrix} = \begin{bmatrix} 2 & 1 \end{bmatrix} \begin{bmatrix} 0.875 \\ -0.125 \end{bmatrix}
   $$
   $$
   d_M^2 = 2(0.875) + 1(-0.125) = 1.75 - 0.125 = 1.625
   $$
   Because $d_M^2 = 1.625 < 5.9915$, the point $[2, 1]^T$ lies **well inside** the $95\%$ confidence region (it is within the $\approx 55\%$ quantile contour).

---

### Worked Example 9.8: Cholesky Decomposition for Multivariate Gaussian Sampling
**Problem Statement:**  
To simulate correlated physical systems on a GPU, algorithms factorize the target covariance matrix $\mathbf{\Sigma}$ via **Cholesky decomposition** $\mathbf{\Sigma} = \mathbf{L} \mathbf{L}^T$, where $\mathbf{L}$ is lower-triangular.  
Given the $3 \times 3$ covariance matrix:
$$
\mathbf{\Sigma} = \begin{bmatrix}
4 & 2 & 2 \\
2 & 10 & 7 \\
2 & 7 & 14
\end{bmatrix}
$$
1. Compute the exact Cholesky factor $\mathbf{L}$.
2. Express the correlated random vector $\mathbf{X}$ as a linear combination of independent standard normal variates $\mathbf{Z} = [Z_1, Z_2, Z_3]^T \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$.

**Detailed Solution:**  
1. **Cholesky Factorization Algorithm:**
   Let $\mathbf{L} = \begin{bmatrix} L_{11} & 0 & 0 \\ L_{21} & L_{22} & 0 \\ L_{31} & L_{32} & L_{33} \end{bmatrix}$.  
   Equating entries of $\mathbf{L}\mathbf{L}^T = \mathbf{\Sigma}$:

   - **Column 1:**
     $$
     L_{11} = \sqrt{\Sigma_{11}} = \sqrt{4} = 2
     $$
     $$
     L_{21} = \frac{\Sigma_{21}}{L_{11}} = \frac{2}{2} = 1
     $$
     $$
     L_{31} = \frac{\Sigma_{31}}{L_{11}} = \frac{2}{2} = 1
     $$

   - **Column 2:**
     $$
     L_{22} = \sqrt{\Sigma_{22} - L_{21}^2} = \sqrt{10 - 1^2} = \sqrt{9} = 3
     $$
     $$
     L_{32} = \frac{\Sigma_{32} - L_{31} L_{21}}{L_{22}} = \frac{7 - (1)(1)}{3} = \frac{6}{3} = 2
     $$

   - **Column 3:**
     $$
     L_{33} = \sqrt{\Sigma_{33} - (L_{31}^2 + L_{32}^2)} = \sqrt{14 - (1^2 + 2^2)} = \sqrt{14 - 5} = \sqrt{9} = 3
     $$

   Thus, the exact lower-triangular Cholesky factor is:
   $$
   \mathbf{L} = \begin{bmatrix}
   2 & 0 & 0 \\
   1 & 3 & 0 \\
   1 & 2 & 3
   \end{bmatrix}
   $$

2. **Correlated Vector Representation:**
   The random vector $\mathbf{X} = \mathbf{L}\mathbf{Z}$ is computed by forward-substitution:
   $$
   \begin{aligned}
   X_1 &= 2 Z_1 \\
   X_2 &= Z_1 + 3 Z_2 \\
   X_3 &= Z_1 + 2 Z_2 + 3 Z_3
   \end{aligned}
   $$
   where $Z_1, Z_2, Z_3 \sim \text{i.i.d. } \mathcal{N}(0, 1)$.

---

### Worked Example 9.9: General Multivariate Partitioned Conditioning
**Problem Statement:**  
Let $\mathbf{X} = [X_1, X_2, X_3]^T \sim \mathcal{N}(\boldsymbol{\mu}, \mathbf{\Sigma})$ with:
$$
\boldsymbol{\mu} = \begin{bmatrix} 1 \\ 0 \\ -1 \end{bmatrix}, \quad \mathbf{\Sigma} = \begin{bmatrix} 2 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 2 \end{bmatrix}
$$
Partition the vector into target $X_1$ and observation vector $\mathbf{X}_{2:3} = [X_2, X_3]^T$.  
Compute the conditional distribution $(X_1 \mid \mathbf{X}_{2:3} = [1, 1]^T)$.

**Detailed Solution:**  
1. **Partitioning the System:**
   $$
   \mu_1 = 1, \quad \boldsymbol{\mu}_{23} = \begin{bmatrix} 0 \\ -1 \end{bmatrix}
   $$
   $$
   \Sigma_{11} = 2, \quad \mathbf{\Sigma}_{1, 23} = \begin{bmatrix} 1 & 0 \end{bmatrix}, \quad \mathbf{\Sigma}_{23, 1} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}
   $$
   $$
   \mathbf{\Sigma}_{23, 23} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}
   $$

2. **Inverting the Observation Covariance:**
   $$
   \det(\mathbf{\Sigma}_{23, 23}) = (2)(2) - (1)(1) = 3
   $$
   $$
   \mathbf{\Sigma}_{23, 23}^{-1} = \frac{1}{3} \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}
   $$

3. **Computing the Regression Weight Matrix:**
   $$
   \mathbf{W} = \mathbf{\Sigma}_{1, 23} \mathbf{\Sigma}_{23, 23}^{-1} = \begin{bmatrix} 1 & 0 \end{bmatrix} \frac{1}{3} \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix} = \frac{1}{3} \begin{bmatrix} 2 & -1 \end{bmatrix} = \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \end{bmatrix}
   $$

4. **Conditional Mean:**
   Observation: $\mathbf{x}_{23} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$. Deviation: $\mathbf{x}_{23} - \boldsymbol{\mu}_{23} = \begin{bmatrix} 1 - 0 \\ 1 - (-1) \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$.
   $$
   \mu_{1|23} = \mu_1 + \mathbf{W}(\mathbf{x}_{23} - \boldsymbol{\mu}_{23}) = 1 + \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = 1 + \left(\frac{2}{3}(1) - \frac{1}{3}(2)\right) = 1 + 0 = 1.0
   $$

5. **Conditional Variance (Schur Complement):**
   $$
   \Sigma_{1|23} = \Sigma_{11} - \mathbf{W} \mathbf{\Sigma}_{23, 1} = 2 - \begin{bmatrix} \frac{2}{3} & -\frac{1}{3} \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = 2 - \frac{2}{3} = \frac{4}{3} \approx 1.3333
   $$
   Thus, $(X_1 \mid X_2 = 1, X_3 = 1) \sim \mathcal{N}\left(1.0, \; \frac{4}{3}\right)$.

---

### Worked Example 9.10: 1D Kalman Filter Measurement Update
**Problem Statement:**  
A physical parameter $X$ has prior belief $X \sim \mathcal{N}(\mu_0, \sigma_0^2)$ with $\mu_0 = 10, \sigma_0^2 = 4$.  
A sensor takes a noisy measurement $Y = X + V$, where sensor noise $V \sim \mathcal{N}(0, \sigma_v^2)$ is independent of $X$, with $\sigma_v^2 = 1$.  
1. Write the joint covariance matrix of $[X, Y]^T$.
2. Derive the Kalman gain $K$.
3. If the sensor reads $y = 12$, compute the posterior mean $\mu_{\text{post}}$ and posterior variance $\sigma_{\text{post}}^2$.

**Detailed Solution:**  
1. **Joint Distribution:**
   $$
   \mathbb{E}[Y] = \mathbb{E}[X + V] = \mu_0 + 0 = 10
   $$
   $$
   \text{Var}(Y) = \text{Var}(X + V) = \sigma_0^2 + \sigma_v^2 = 4 + 1 = 5
   $$
   $$
   \text{Cov}(X, Y) = \text{Cov}(X, X + V) = \text{Var}(X) + \text{Cov}(X, V) = \sigma_0^2 + 0 = 4
   $$
   The joint vector $[X, Y]^T$ is bivariate Gaussian:
   $$
   \begin{bmatrix} X \\ Y \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} 10 \\ 10 \end{bmatrix}, \; \begin{bmatrix} 4 & 4 \\ 4 & 5 \end{bmatrix} \right)
   $$

2. **Kalman Gain:**
   The Kalman gain is the regression coefficient:
   $$
   K = \frac{\text{Cov}(X, Y)}{\text{Var}(Y)} = \frac{\sigma_0^2}{\sigma_0^2 + \sigma_v^2} = \frac{4}{4 + 1} = \frac{4}{5} = 0.8
   $$

3. **Posterior Updating:**
   Using the conditional Gaussian equations:
   $$
   \mu_{\text{post}} = \mathbb{E}[X \mid Y = y] = \mu_0 + K(y - \mu_0) = 10 + 0.8(12 - 10) = 10 + 0.8(2) = 10 + 1.6 = 11.6
   $$
   $$
   \sigma_{\text{post}}^2 = \text{Var}(X \mid Y = y) = \sigma_0^2 - K \cdot \text{Cov}(X, Y) = 4 - 0.8(4) = 4 - 3.2 = 0.8
   $$
   In alternate form: $\sigma_{\text{post}}^2 = (1 - K)\sigma_0^2 = (1 - 0.8)(4) = 0.8$.  
   The updated posterior belief is $X \mid Y = 12 \sim \mathcal{N}(11.6, 0.8)$. Notice that the variance dropped precipitously from $4.0$ to $0.8$!

---

## 9.7 Exactly 10 Solved Exercises

### Exercise 9.1: Proof of Central Moments via Integration by Parts
**Problem Statement:**  
Let $Z \sim \mathcal{N}(0, 1)$. Prove by induction using integration by parts that:
$$
\mathbb{E}[Z^{2k}] = (2k - 1)!! \quad \forall k \ge 1
$$

**Detailed Solution:**  
1. **Integral Definition:**
   $$
   \mathbb{E}[Z^{2k}] = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty z^{2k} e^{-z^2 / 2} \, dz
   $$
   Split the integrand into $u = z^{2k - 1}$ and $dv = z e^{-z^2 / 2} dz$.

2. **Integration by Parts:**
   $$
   du = (2k - 1) z^{2k - 2} dz, \quad v = -e^{-z^2 / 2}
   $$
   Applying $\int u \, dv = [uv] - \int v \, du$:
   $$
   \mathbb{E}[Z^{2k}] = \frac{1}{\sqrt{2\pi}} \left( \left[ -z^{2k - 1} e^{-z^2 / 2} \right]_{-\infty}^\infty + \int_{-\infty}^\infty (2k - 1) z^{2k - 2} e^{-z^2 / 2} \, dz \right)
   $$
   Because the exponential term $e^{-z^2 / 2}$ dominates any polynomial $z^{2k - 1}$ as $z \to \pm\infty$, the boundary bracket $[uv]_{-\infty}^\infty$ vanishes identically to 0.

3. **Recurrence Relation:**
   $$
   \mathbb{E}[Z^{2k}] = (2k - 1) \left( \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty z^{2k - 2} e^{-z^2 / 2} \, dz \right) = (2k - 1) \mathbb{E}[Z^{2k - 2}]
   $$

4. **Induction Conclusion:**
   For $k = 1$: $\mathbb{E}[Z^2] = 1 = 1!!$.  
   Unrolling the recurrence:
   $$
   \mathbb{E}[Z^{2k}] = (2k - 1)(2k - 3) \cdots 3 \cdot 1 \cdot \mathbb{E}[Z^0] = (2k - 1)!! \quad \blacksquare
   $$

---

### Exercise 9.2: Truncated Normal Distribution (Hazard Rate Connection)
**Problem Statement:**  
Let $Z \sim \mathcal{N}(0, 1)$ be standard normal. Consider $Z$ conditioned on exceeding a threshold $c$, $W = (Z \mid Z > c)$.  
1. Write the conditional density $f_W(w)$.
2. Derive the conditional expectation $\mathbb{E}[Z \mid Z > c]$ in terms of $\phi(c)$ and $\Phi(c)$.
3. Evaluate $\mathbb{E}[Z \mid Z > 0]$ and $\mathbb{E}[Z \mid Z > 2]$.

**Detailed Solution:**  
1. **Conditional Density:**
   $$
   f_W(w) = \frac{\phi(w)}{P(Z > c)} = \frac{\phi(w)}{1 - \Phi(c)} \quad \text{for } w > c
   $$

2. **Deriving the Mean:**
   $$
   \mathbb{E}[Z \mid Z > c] = \int_c^\infty w \frac{\phi(w)}{1 - \Phi(c)} \, dw = \frac{1}{1 - \Phi(c)} \int_c^\infty w \frac{1}{\sqrt{2\pi}} e^{-w^2 / 2} \, dw
   $$
   Substitute $u = w^2 / 2$, so $du = w \, dw$:
   $$
   \int_c^\infty w e^{-w^2 / 2} \, dw = \int_{c^2 / 2}^\infty e^{-u} \, du = \left[ -e^{-u} \right]_{c^2 / 2}^\infty = e^{-c^2 / 2}
   $$
   Multiplying by $\frac{1}{\sqrt{2\pi}}$:
   $$
   \frac{1}{\sqrt{2\pi}} e^{-c^2 / 2} = \phi(c)
   $$
   Therefore:
   $$
   \mathbb{E}[Z \mid Z > c] = \frac{\phi(c)}{1 - \Phi(c)}
   $$
   This quantity is known as the **inverse Mills ratio** or the **Gaussian hazard function** $\lambda(c)$.

3. **Numerical Evaluations:**
   - For $c = 0$: $\phi(0) = \frac{1}{\sqrt{2\pi}} \approx 0.39894$, and $1 - \Phi(0) = 0.5$.
     $$
     \mathbb{E}[Z \mid Z > 0] = \frac{0.39894}{0.5} = \sqrt{\frac{2}{\pi}} \approx 0.79788
     $$
   - For $c = 2$: $\phi(2) = \frac{1}{\sqrt{2\pi}} e^{-2} \approx 0.05399$, and $1 - \Phi(2) = 1 - 0.97725 = 0.02275$.
     $$
     \mathbb{E}[Z \mid Z > 2] = \frac{0.05399}{0.02275} \approx 2.3732
     $$

---

### Exercise 9.3: Threshold Collision Probability
**Problem Statement:**  
Two autonomous cars $A$ and $B$ are approaching an intersection along perpendicular roads. Their arrival times (in seconds) are modeled as independent Gaussian random variables:
$$
T_A \sim \mathcal{N}(30, 4), \quad T_B \sim \mathcal{N}(32, 9)
$$
A collision occurs if $|T_A - T_B| \le 1$ second. Compute the exact collision probability $P(|T_A - T_B| \le 1)$.

**Detailed Solution:**  
1. **Distribution of the Difference:**
   Let $D = T_A - T_B$. Because $T_A$ and $T_B$ are independent Gaussians:
   $$
   \mu_D = \mathbb{E}[T_A] - \mathbb{E}[T_B] = 30 - 32 = -2
   $$
   $$
   \sigma_D^2 = \text{Var}(T_A) + (-1)^2 \text{Var}(T_B) = 4 + 9 = 13 \implies \sigma_D = \sqrt{13} \approx 3.60555
   $$
   Thus, $D \sim \mathcal{N}(-2, 13)$.

2. **Probability Calculation:**
   $$
   P(|D| \le 1) = P(-1 \le D \le 1)
   $$
   Standardizing with $\mu_D = -2, \sigma_D = \sqrt{13}$:
   $$
   Z_{\text{upper}} = \frac{1 - (-2)}{\sqrt{13}} = \frac{3}{3.60555} \approx 0.83205
   $$
   $$
   Z_{\text{lower}} = \frac{-1 - (-2)}{\sqrt{13}} = \frac{1}{3.60555} \approx 0.27735
   $$
   Using standard normal CDF values:
   $$
   \Phi(0.832) \approx 0.7973, \quad \Phi(0.277) \approx 0.6091
   $$
   $$
   P(|T_A - T_B| \le 1) = \Phi(0.83205) - \Phi(0.27735) \approx 0.7973 - 0.6091 = 0.1882 \; (18.82\%)
   $$

---

### Exercise 9.4: The Log-Normal Distribution
**Problem Statement:**  
Let $X \sim \mathcal{N}(\mu, \sigma^2)$ and define $Y = e^X$.  
1. Derive the PDF $f_Y(y)$ using the Jacobian transformation method.
2. Using the MGF of $X$, compute $\mathbb{E}[Y]$ and $\text{Var}(Y)$.

**Detailed Solution:**  
1. **Deriving the PDF:**
   $y = g(x) = e^x \implies x = g^{-1}(y) = \ln y$ for $y > 0$.  
   The Jacobian derivative is $\frac{dx}{dy} = \frac{1}{y}$.  
   $$
   f_Y(y) = f_X(\ln y) \left| \frac{dx}{dy} \right| = \frac{1}{y \sigma \sqrt{2\pi}} \exp\left( -\frac{(\ln y - \mu)^2}{2\sigma^2} \right) \quad \text{for } y > 0
   $$

2. **Moments via MGF:**
   Recall that $\mathbb{E}[Y^k] = \mathbb{E}[(e^X)^k] = \mathbb{E}[e^{k X}] = M_X(k)$.  
   Using $M_X(t) = \exp(\mu t + \frac{1}{2}\sigma^2 t^2)$:
   - For $k = 1$:
     $$
     \mathbb{E}[Y] = M_X(1) = \exp\left(\mu + \frac{1}{2}\sigma^2\right)
     $$
   - For $k = 2$:
     $$
     \mathbb{E}[Y^2] = M_X(2) = \exp\left(2\mu + \frac{1}{2}\sigma^2 (2)^2\right) = \exp(2\mu + 2\sigma^2)
     $$
   - Variance:
     $$
     \begin{aligned}
     \text{Var}(Y) &= \mathbb{E}[Y^2] - (\mathbb{E}[Y])^2 = e^{2\mu + 2\sigma^2} - \left(e^{\mu + \frac{1}{2}\sigma^2}\right)^2 \\
     &= e^{2\mu + 2\sigma^2} - e^{2\mu + \sigma^2} = e^{2\mu + \sigma^2} (e^{\sigma^2} - 1)
     \end{aligned}
     $$

---

### Exercise 9.5: Proof that Jointly Gaussian Uncorrelated Variables are Independent
**Problem Statement:**  
Let $\mathbf{X} = [X_1, X_2]^T$ be **jointly Gaussian** with covariance $\text{Cov}(X_1, X_2) = 0$. Prove that $X_1$ and $X_2$ are statistically independent.

**Detailed Solution:**  
1. **Covariance Matrix:**
   Since $\text{Cov}(X_1, X_2) = 0$, the covariance matrix is diagonal:
   $$
   \mathbf{\Sigma} = \begin{bmatrix} \sigma_1^2 & 0 \\ 0 & \sigma_2^2 \end{bmatrix}
   $$

2. **Determinant and Inverse:**
   $$
   \det(\mathbf{\Sigma}) = \sigma_1^2 \sigma_2^2 \implies \sqrt{\det(\mathbf{\Sigma})} = \sigma_1 \sigma_2
   $$
   $$
   \mathbf{\Sigma}^{-1} = \begin{bmatrix} \frac{1}{\sigma_1^2} & 0 \\ 0 & \frac{1}{\sigma_2^2} \end{bmatrix}
   $$

3. **Evaluating the Joint PDF:**
   $$
   (\mathbf{x} - \boldsymbol{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu}) = \begin{bmatrix} x_1 - \mu_1 & x_2 - \mu_2 \end{bmatrix} \begin{bmatrix} \frac{1}{\sigma_1^2} & 0 \\ 0 & \frac{1}{\sigma_2^2} \end{bmatrix} \begin{bmatrix} x_1 - \mu_1 \\ x_2 - \mu_2 \end{bmatrix} = \frac{(x_1 - \mu_1)^2}{\sigma_1^2} + \frac{(x_2 - \mu_2)^2}{\sigma_2^2}
   $$
   Substituting into the MVN density formula:
   $$
   \begin{aligned}
   f_{\mathbf{X}}(x_1, x_2) &= \frac{1}{2\pi \sigma_1 \sigma_2} \exp\left( -\frac{1}{2} \left[ \frac{(x_1 - \mu_1)^2}{\sigma_1^2} + \frac{(x_2 - \mu_2)^2}{\sigma_2^2} \right] \right) \\
   &= \left( \frac{1}{\sigma_1 \sqrt{2\pi}} \exp\left( -\frac{(x_1 - \mu_1)^2}{2\sigma_1^2} \right) \right) \left( \frac{1}{\sigma_2 \sqrt{2\pi}} \exp\left( -\frac{(x_2 - \mu_2)^2}{2\sigma_2^2} \right) \right) \\
   &= f_{X_1}(x_1) f_{X_2}(x_2)
   \end{aligned}
   $$
   Because the joint PDF factorizes into the product of marginal PDFs for all $(x_1, x_2) \in \mathbb{R}^2$, $X_1$ and $X_2$ are strictly independent. $\blacksquare$

---

### Exercise 9.6: Counterexample: Marginally Normal but Jointly Non-Gaussian
**Problem Statement:**  
Let $X \sim \mathcal{N}(0, 1)$. Let $S$ be a Rademacher random variable independent of $X$, with $P(S = 1) = P(S = -1) = 1/2$. Define $Y = S X$.  
1. Prove that $Y$ is standard normal: $Y \sim \mathcal{N}(0, 1)$.
2. Prove that $\text{Cov}(X, Y) = 0$.
3. Prove that $X$ and $Y$ are NOT independent and NOT jointly normal.

**Detailed Solution:**  
1. **Marginal Distribution of $Y$:**
   Using the Law of Total Probability for the CDF:
   $$
   P(Y \le y) = P(SX \le y \mid S = 1) P(S = 1) + P(SX \le y \mid S = -1) P(S = -1) = \frac{1}{2} P(X \le y) + \frac{1}{2} P(-X \le y)
   $$
   Because $X$ is symmetric about 0, $-X$ has the exact same distribution as $X$, so $P(-X \le y) = P(X \le y) = \Phi(y)$:
   $$
   P(Y \le y) = \frac{1}{2} \Phi(y) + \frac{1}{2} \Phi(y) = \Phi(y)
   $$
   Thus, $Y \sim \mathcal{N}(0, 1)$.

2. **Covariance:**
   $$
   \mathbb{E}[XY] = \mathbb{E}[X(SX)] = \mathbb{E}[S X^2]
   $$
   Because $S$ and $X$ are independent:
   $$
   \mathbb{E}[S X^2] = \mathbb{E}[S] \mathbb{E}[X^2] = 0 \times 1 = 0
   $$
   Since $\mathbb{E}[X] = 0$ and $\mathbb{E}[Y] = 0$, $\text{Cov}(X, Y) = 0 - 0 = 0$.

3. **Non-Independence and Non-Joint Normality:**
   Notice that $Y^2 = (SX)^2 = S^2 X^2 = 1 \cdot X^2 = X^2$.  
   Therefore, $|Y| = |X|$ with probability 1! If $X$ and $Y$ were independent, $P(|X| \le 1, |Y| > 2)$ would be $P(|X| \le 1) P(|Y| > 2) > 0$. But $|Y| = |X|$ makes this event impossible (probability 0).  
   Furthermore, if $X$ and $Y$ were jointly normal and uncorrelated, Exercise 9.5 proves they would have to be independent. Because they are not independent, they **cannot be jointly normal**. This demonstrates that marginal normality does NOT imply joint normality!

---

### Exercise 9.7: Emergence of the Chi-Square Distribution
**Problem Statement:**  
Let $Z_1, Z_2, \dots, Z_k \sim \text{i.i.d. } \mathcal{N}(0, 1)$, and define $W = \sum_{i=1}^k Z_i^2$.  
Using MGFs, prove that $W \sim \chi^2(k) = \text{Gamma}\left(\frac{k}{2}, \frac{1}{2}\right)$, and compute $\mathbb{E}[W]$ and $\text{Var}(W)$.

**Detailed Solution:**  
1. **MGF of a Single Squared Normal $Z^2$:**
   $$
   M_{Z^2}(t) = \mathbb{E}[e^{t Z^2}] = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty e^{t z^2} e^{-z^2 / 2} \, dz = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty e^{-\frac{1}{2}(1 - 2t)z^2} \, dz
   $$
   For the integral to converge, we require $1 - 2t > 0 \implies t < 1/2$.  
   Using the Gaussian integral $\int_{-\infty}^\infty e^{-a z^2 / 2} \, dz = \sqrt{\frac{2\pi}{a}}$ with $a = 1 - 2t$:
   $$
   M_{Z^2}(t) = \frac{1}{\sqrt{2\pi}} \sqrt{\frac{2\pi}{1 - 2t}} = (1 - 2t)^{-1/2}
   $$

2. **Sum of $k$ Independent Squared Normals:**
   $$
   M_W(t) = \prod_{i=1}^k M_{Z_i^2}(t) = \left( (1 - 2t)^{-1/2} \right)^k = (1 - 2t)^{-k/2}
   $$
   Recall that the MGF of a Gamma distribution $\text{Gamma}(\alpha, \beta)$ with PDF $f(w) = \frac{\beta^\alpha}{\Gamma(\alpha)} w^{\alpha - 1} e^{-\beta w}$ is:
   $$
   M(t) = \left( 1 - \frac{t}{\beta} \right)^{-\alpha}
   $$
   Setting $\alpha = \frac{k}{2}$ and $\beta = \frac{1}{2}$:
   $$
   M(t) = (1 - 2t)^{-k/2}
   $$
   This matches identically! Thus, $W \sim \text{Gamma}\left(\frac{k}{2}, \frac{1}{2}\right) \equiv \chi^2(k)$.

3. **Moments:**
   $$
   \mathbb{E}[W] = \sum_{i=1}^k \mathbb{E}[Z_i^2] = \sum_{i=1}^k 1 = k
   $$
   $$
   \text{Var}(W) = \sum_{i=1}^k \text{Var}(Z_i^2) = \sum_{i=1}^k (\mathbb{E}[Z_i^4] - (\mathbb{E}[Z_i^2])^2) = \sum_{i=1}^k (3 - 1) = \sum_{i=1}^k 2 = 2k
   $$

---

### Exercise 9.8: Elliptical Quantile Contours in $n$ Dimensions
**Problem Statement:**  
Let $\mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \mathbf{\Sigma})$ in $\mathbb{R}^n$. Find the exact radius multiplier $c$ such that the error ellipsoid $(\mathbf{x} - \boldsymbol{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu}) \le c^2$ contains $90\%$ of the probability mass for $n = 1$, $n = 2$, and $n = 3$.

**Detailed Solution:**  
1. **Distribution Framework:**
   $d_M^2(\mathbf{X}) = (\mathbf{X} - \boldsymbol{\mu})^T \mathbf{\Sigma}^{-1} (\mathbf{X} - \boldsymbol{\mu}) \sim \chi^2(n)$.  
   We require $c^2$ such that $F_{\chi^2(n)}(c^2) = 0.90$.

2. **Case $n = 1$:**
   For $n = 1$, $d_M^2 = Z^2$. The event $Z^2 \le c^2 \iff -c \le Z \le c$:
   $$
   P(-c \le Z \le c) = 2\Phi(c) - 1 = 0.90 \implies \Phi(c) = 0.95 \implies c \approx 1.645
   $$
   $$
   c^2 \approx (1.645)^2 \approx 2.706
   $$

3. **Case $n = 2$:**
   For $n = 2$, $F_{\chi^2(2)}(x) = 1 - e^{-x/2}$:
   $$
   1 - e^{-c^2 / 2} = 0.90 \implies e^{-c^2 / 2} = 0.10 \implies -\frac{c^2}{2} = \ln(0.10) = -\ln(10)
   $$
   $$
   c^2 = 2 \ln(10) \approx 2(2.302585) \approx 4.605 \implies c \approx \sqrt{4.605} \approx 2.146
   $$

4. **Case $n = 3$:**
   Using the $\chi^2(3)$ CDF table or numerical quantile:
   The $90\text{th}$ percentile of $\chi^2(3)$ is $c^2 \approx 6.251$:
   $$
   c = \sqrt{6.251} \approx 2.500
   $$

---

### Exercise 9.9: Degenerate Gaussian Random Vectors
**Problem Statement:**  
Let $Z_1 \sim \mathcal{N}(0, 1)$ and define $\mathbf{X} = [X_1, X_2]^T = [2Z_1, -3Z_1]^T$.  
1. Find the mean vector $\boldsymbol{\mu}$ and covariance matrix $\mathbf{\Sigma}$.
2. Compute $\det(\mathbf{\Sigma})$. Does $\mathbf{X}$ possess a density function on $\mathbb{R}^2$?
3. Describe the geometric support of $\mathbf{X}$.

**Detailed Solution:**  
1. **Mean and Covariance:**
   $$
   \boldsymbol{\mu} = \begin{bmatrix} \mathbb{E}[2Z_1] \\ \mathbb{E}[-3Z_1] \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}
   $$
   $$
   \mathbf{\Sigma} = \begin{bmatrix} \text{Var}(2Z_1) & \text{Cov}(2Z_1, -3Z_1) \\ \text{Cov}(-3Z_1, 2Z_1) & \text{Var}(-3Z_1) \end{bmatrix} = \begin{bmatrix} 4 & -6 \\ -6 & 9 \end{bmatrix}
   $$

2. **Determinant and Density:**
   $$
   \det(\mathbf{\Sigma}) = (4)(9) - (-6)(-6) = 36 - 36 = 0
   $$
   Because $\det(\mathbf{\Sigma}) = 0$, $\mathbf{\Sigma}$ is singular (rank 1), and $\mathbf{\Sigma}^{-1}$ does not exist.  
   Therefore, $\mathbf{X}$ does **not** have a probability density function on $\mathbb{R}^2$ with respect to 2D Lebesgue measure.

3. **Geometric Support:**
   Notice that:
   $$
   X_2 = -3Z_1 = -\frac{3}{2}(2Z_1) = -\frac{3}{2} X_1 \implies 3X_1 + 2X_2 = 0
   $$
   All probability mass is concentrated on the one-dimensional line $3x_1 + 2x_2 = 0$. On this subspace, it follows a 1D Gaussian distribution with variance $4 + 9 = 13$.

---

### Exercise 9.10: Maximum Entropy Property of the Gaussian
**Problem Statement:**  
Differential entropy of a continuous density $f(x)$ is defined as $h(f) = -\int_{-\infty}^\infty f(x) \ln f(x) \, dx$.  
Prove that among all continuous probability distributions with fixed mean $\mu$ and fixed variance $\sigma^2$, the Gaussian distribution uniquely maximizes differential entropy.

**Detailed Solution:**  
1. **Kullback-Leibler Divergence Non-Negativity:**
   Let $g(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-(x - \mu)^2 / (2\sigma^2)}$ be the Gaussian density with mean $\mu$ and variance $\sigma^2$. Let $f(x)$ be any arbitrary density with the same mean $\mu$ and variance $\sigma^2$.  
   The relative entropy (KL divergence) $D_{\text{KL}}(f \parallel g)$ is strictly non-negative:
   $$
   D_{\text{KL}}(f \parallel g) = \int_{-\infty}^\infty f(x) \ln\left(\frac{f(x)}{g(x)}\right) dx \ge 0
   $$
   with equality if and only if $f(x) = g(x)$ almost everywhere.

2. **Expanding the Relative Entropy:**
   $$
   D_{\text{KL}}(f \parallel g) = \int_{-\infty}^\infty f(x) \ln f(x) \, dx - \int_{-\infty}^\infty f(x) \ln g(x) \, dx = -h(f) - \int_{-\infty}^\infty f(x) \ln g(x) \, dx \ge 0
   $$
   $$
   h(f) \le -\int_{-\infty}^\infty f(x) \ln g(x) \, dx
   $$

3. **Evaluating $-\int f(x) \ln g(x) dx$:**
   $$
   \ln g(x) = \ln\left(\frac{1}{\sigma \sqrt{2\pi}}\right) - \frac{(x - \mu)^2}{2\sigma^2} = -\ln(\sigma \sqrt{2\pi}) - \frac{(x - \mu)^2}{2\sigma^2}
   $$
   Taking expectation with respect to $f$:
   $$
   -\int_{-\infty}^\infty f(x) \ln g(x) \, dx = \ln(\sigma \sqrt{2\pi}) \int f(x) \, dx + \frac{1}{2\sigma^2} \int (x - \mu)^2 f(x) \, dx
   $$
   Because $f$ is normalized ($\int f(x) dx = 1$) and has variance $\sigma^2$ ($\int (x - \mu)^2 f(x) dx = \sigma^2$):
   $$
   -\int_{-\infty}^\infty f(x) \ln g(x) \, dx = \ln(\sigma \sqrt{2\pi}) (1) + \frac{1}{2\sigma^2}(\sigma^2) = \ln(\sigma \sqrt{2\pi}) + \frac{1}{2} = \frac{1}{2} \ln(2\pi e \sigma^2)
   $$

4. **Entropy of the Gaussian:**
   When $f = g$, $D_{\text{KL}}(g \parallel g) = 0$, so $h(g) = \frac{1}{2} \ln(2\pi e \sigma^2)$.  
   Therefore:
   $$
   h(f) \le h(g) = \frac{1}{2} \ln(2\pi e \sigma^2) \quad \blacksquare
   $$
   This proves that the Gaussian is the unique **maximum entropy distribution** under second-moment constraints, which explains why nature defaults to Gaussian noise when only mean and variance are constrained.
