# Chapter 1: The Geometry of Uncertainty — Multivariate Gaussian Distributions, Covariance Ellipsoids, and Bayes' Theorem

Optimal state estimation is the mathematical science of deducing the hidden, true dynamical state of a physical system from corrupted, incomplete, and noisy sensory observations. Before a robot can balance on two legs, track a ballistic target, navigate through an asteroid field, or dock an autonomous spacecraft, it must possess a principled language for quantifying uncertainty. That language is the probability theory of continuous random vectors, anchored in the geometry of the multivariate Gaussian distribution.

A deterministic view of the universe assumes that the state $x \in \mathbb{R}^n$ is known with infinite precision. In reality, thermal agitation in semiconductor junctions, optical shot noise in CMOS sensors, mechanical gear chatter, atmospheric turbulence, and digital quantization introduce stochastic entropy. The Kalman filter does not merely track an isolated state vector; it propagates an entire probability distribution—a dynamic cloud of belief—through space and time.

---

## 1.1 The Multivariate Gaussian Distribution

A continuous random vector $x = [x_1, x_2, \dots, x_n]^T \in \mathbb{R}^n$ is said to follow a multivariate Gaussian (or normal) distribution, denoted $x \sim \mathcal{N}(\mu, \Sigma)$, if its joint probability density function (PDF) is given by:

$$p(x) = \frac{1}{(2\pi)^{n/2} |\Sigma|^{1/2}} \exp\left( -\frac{1}{2} (x - \mu)^T \Sigma^{-1} (x - \mu) \right)$$

where:
1. $\mu = \mathbb{E}[x] \in \mathbb{R}^n$ is the **mean vector** (the first central moment, representing the center of mass of the probability density):
   $$\mu = \int_{\mathbb{R}^n} x \, p(x) \, dx$$
2. $\Sigma \in \mathbb{R}^{n \times n}$ is the **covariance matrix** (the second central moment, capturing dispersion, uncertainty, and linear dependencies between state variables):
   $$\Sigma = \mathbb{E}\left[ (x - \mu)(x - \mu)^T \right] = \int_{\mathbb{R}^n} (x - \mu)(x - \mu)^T p(x) \, dx$$
3. $|\Sigma| = \det(\Sigma)$ is the determinant of the covariance matrix, often termed the **generalized variance**.
4. The scalar quadratic form in the exponent,
   $$D_M^2(x, \mu) = (x - \mu)^T \Sigma^{-1} (x - \mu)$$
   is the squared **Mahalanobis distance** from $x$ to $\mu$.

### 1.1.1 Algebraic Properties of the Covariance Matrix $\Sigma$
The covariance matrix $\Sigma$ is not an arbitrary array of numbers; it belongs to the cone of symmetric positive-definite matrices, denoted $\Sigma \in \mathbb{S}_{++}^n$:

1. **Symmetry:** By definition of the outer product $(x - \mu)(x - \mu)^T$, entry $\Sigma_{ij} = \mathbb{E}[(x_i - \mu_i)(x_j - \mu_j)] = \Sigma_{ji}$. Hence:
   $$\Sigma^T = \Sigma$$
2. **Positive Definiteness:** For any non-zero vector $v \in \mathbb{R}^n \setminus \{0\}$, consider the scalar random variable $y = v^T x$. Its variance is:
   $$\operatorname{Var}(y) = \mathbb{E}\left[ (v^T x - v^T \mu)^2 \right] = \mathbb{E}\left[ v^T (x - \mu)(x - \mu)^T v \right] = v^T \Sigma v$$
   Because variance of a non-degenerate physical variable is strictly positive:
   $$v^T \Sigma v > 0 \quad \forall v \neq 0$$
   This guarantees that all eigenvalues of $\Sigma$ are strictly positive real numbers ($\lambda_i > 0$), ensuring that $\Sigma$ is invertible ($\det(\Sigma) = \prod_{i=1}^n \lambda_i > 0$) and that $\Sigma^{-1} \in \mathbb{S}_{++}^n$.

3. **Covariance Structure:**
   The diagonal elements $\Sigma_{ii} = \sigma_i^2$ represent the individual marginal variances of state $x_i$, while the off-diagonal elements $\Sigma_{ij} = \sigma_{ij} = \rho_{ij} \sigma_i \sigma_j$ represent the mutual covariances, where $\rho_{ij} \in [-1, 1]$ is the Pearson correlation coefficient:
   $$\Sigma = \begin{bmatrix} 
   \sigma_1^2 & \rho_{12}\sigma_1\sigma_2 & \dots & \rho_{1n}\sigma_1\sigma_n \\
   \rho_{12}\sigma_1\sigma_2 & \sigma_2^2 & \dots & \rho_{2n}\sigma_2\sigma_n \\
   \vdots & \vdots & \ddots & \vdots \\
   \rho_{1n}\sigma_1\sigma_n & \rho_{2n}\sigma_2\sigma_n & \dots & \sigma_n^2
   \end{bmatrix}$$

---

## 1.2 Spectral Geometry of Covariance Ellipsoids

The exponential term in the Gaussian PDF dictates that hypersurfaces of constant probability density correspond to level sets where the Mahalanobis distance is constant:

$$\mathcal{E}_c = \left\{ x \in \mathbb{R}^n \;\middle|\; (x - \mu)^T \Sigma^{-1} (x - \mu) = c^2 \right\}$$

Because $\Sigma \in \mathbb{S}_{++}^n$, its inverse $\Sigma^{-1}$ is also symmetric positive-definite. By the Spectral Theorem, $\Sigma$ admits an orthonormal eigendecomposition:

$$\Sigma = V \Lambda V^T = \sum_{i=1}^n \lambda_i v_i v_i^T$$

where $\Lambda = \operatorname{diag}(\lambda_1, \lambda_2, \dots, \lambda_n)$ contains the sorted positive eigenvalues $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_n > 0$, and $V = [v_1 \; v_2 \; \dots \; v_n] \in SO(n)$ is the orthonormal matrix of eigenvectors satisfying $V^T V = V V^T = I_n$.

### 1.2.1 Principal Axes and Semi-Axis Lengths
The inverse covariance matrix decomposes as:
$$\Sigma^{-1} = (V \Lambda V^T)^{-1} = V \Lambda^{-1} V^T$$
Define the rotated, normalized coordinate system $y = V^T (x - \mu) \in \mathbb{R}^n$. The quadratic form expands as:
$$(x - \mu)^T \Sigma^{-1} (x - \mu) = (x - \mu)^T V \Lambda^{-1} V^T (x - \mu) = y^T \Lambda^{-1} y = \sum_{i=1}^n \frac{y_i^2}{\lambda_i} = c^2$$
Dividing by $c^2$:
$$\sum_{i=1}^n \frac{y_i^2}{c^2 \lambda_i} = 1$$

This is the standard Cartesian equation of an $n$-dimensional hyper-ellipsoid centered at $\mu$:
1. The **directions of the principal axes** are precisely aligned with the eigenvectors $v_1, v_2, \dots, v_n$.
2. The **semi-axis lengths** along direction $v_i$ are given by $r_i = c \sqrt{\lambda_i} = c \sigma_i^{\text{eigen}}$.
3. The volume of the $c$-sigma hyper-ellipsoid is proportional to the square root of the determinant:
   $$\operatorname{Vol}(\mathcal{E}_c) = \frac{\pi^{n/2}}{\Gamma\left(\frac{n}{2} + 1\right)} c^n \prod_{i=1}^n \sqrt{\lambda_i} = \frac{\pi^{n/2}}{\Gamma\left(\frac{n}{2} + 1\right)} c^n \sqrt{\det(\Sigma)}$$

```
                  ^ v2 (Eigenvector 2, minor axis)
                  |       . - ~ ~ - .
                  |   .               .
                  | .                   .
                  +-----------------------> v1 (Eigenvector 1, major axis)
                 /  \         \mu       /
                /     .               .
               /        . - ~ ~ - .
              /  Semi-major axis = c * sqrt(lambda_1)
             /   Semi-minor axis = c * sqrt(lambda_2)
```

### 1.2.2 Probability Mass Within a Mahalanobis Contour ($\chi^2$ Distribution)
If $x \sim \mathcal{N}(\mu, \Sigma)$, then the scalar squared Mahalanobis distance $d^2 = (x - \mu)^T \Sigma^{-1} (x - \mu)$ is a sum of $n$ independent squared standard normal variables:
$$z = \Sigma^{-1/2}(x - \mu) \sim \mathcal{N}(0, I_n) \implies d^2 = z^T z = \sum_{i=1}^n z_i^2 \sim \chi^2(n)$$
Thus, the probability that a physical state lies inside the ellipsoid $\mathcal{E}_c$ is given by the cumulative distribution function of the Chi-Square distribution with $n$ degrees of freedom:
$$P(x \in \mathcal{E}_c) = F_{\chi^2(n)}(c^2) = \frac{\gamma(n/2, c^2/2)}{\Gamma(n/2)}$$

| Dimension $n$ | $c = 1$ ($1\sigma$) | $c = 2$ ($2\sigma$) | $c = 3$ ($3\sigma$) | $c = \chi_{95\%}$ | $c = \chi_{99\%}$ |
|:---|:---|:---|:---|:---|:---|
| $n = 1$ | $68.27\%$ | $95.45\%$ | $99.73\%$ | $1.960$ | $2.576$ |
| $n = 2$ | $39.35\%$ | $86.47\%$ | $98.89\%$ | $2.448$ | $3.035$ |
| $n = 3$ | $19.87\%$ | $73.85\%$ | $97.07\%$ | $2.795$ | $3.368$ |
| $n = 6$ | $1.44\%$  | $35.03\%$ | $86.09\%$ | $3.548$ | $4.103$ |

> [!IMPORTANT]
> In high-dimensional state spaces ($n \ge 3$), the intuitive 1D rule that "$1\sigma$ contains $68\%$ of the probability" fails dramatically. In $\mathbb{R}^3$, the $1\sigma$ ellipsoid contains only $19.87\%$ of the probability mass. Sensor fusion engines must scale their gating thresholds using the correct Chi-square quantile for dimension $n$.

---

## 1.3 Linear Transformations of Gaussian Vectors

One of the defining algebraic virtues of Gaussian random vectors is closure under linear (affine) transformations.

Let $x \sim \mathcal{N}(\mu_x, \Sigma_{xx})$ be an $n$-dimensional Gaussian vector. Consider an affine mapping into $\mathbb{R}^m$:
$$y = A x + b$$
where $A \in \mathbb{R}^{m \times n}$ is a deterministic transformation matrix and $b \in \mathbb{R}^m$ is a constant offset vector.

### 1.3.1 Mean of the Transformed Vector
By linearity of the mathematical expectation operator $\mathbb{E}[\cdot]$:
$$\mu_y = \mathbb{E}[y] = \mathbb{E}[A x + b] = A \mathbb{E}[x] + b = A \mu_x + b$$

### 1.3.2 Covariance of the Transformed Vector
The centered deviation of $y$ from its mean is:
$$y - \mu_y = (A x + b) - (A \mu_x + b) = A (x - \mu_x)$$
The covariance matrix $\Sigma_{yy}$ is evaluated by:
$$\Sigma_{yy} = \mathbb{E}\left[ (y - \mu_y)(y - \mu_y)^T \right] = \mathbb{E}\left[ A (x - \mu_x) (A (x - \mu_x))^T \right] = \mathbb{E}\left[ A (x - \mu_x)(x - \mu_x)^T A^T \right]$$
Factoring the constant matrix $A$ outside the expectation:
$$\Sigma_{yy} = A \, \mathbb{E}\left[ (x - \mu_x)(x - \mu_x)^T \right] A^T = A \Sigma_{xx} A^T$$

Therefore:
$$y = A x + b \sim \mathcal{N}\left( A \mu_x + b, \; A \Sigma_{xx} A^T \right)$$

This elegant identity forms the exact mathematical basis of the **Predict step** in the Kalman filter, where states are propagated forward in time across linear dynamics: $\hat{x}_{k|k-1} = F \hat{x}_{k-1|k-1}$ and $P_{k|k-1} = F P_{k-1|k-1} F^T$.

---

## 1.4 Joint Gaussians, Marginalization, and Conditioning

Consider two random vectors $x \in \mathbb{R}^n$ and $y \in \mathbb{R}^m$ that are jointly Gaussian distributed:
$$\begin{bmatrix} x \\ y \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} \mu_x \\ \mu_y \end{bmatrix}, \; \begin{bmatrix} \Sigma_{xx} & \Sigma_{xy} \\ \Sigma_{yx} & \Sigma_{yy} \end{bmatrix} \right)$$
where $\Sigma_{xy} = \mathbb{E}[(x - \mu_x)(y - \mu_y)^T] = \Sigma_{yx}^T \in \mathbb{R}^{n \times m}$ is the cross-covariance matrix.

```
                    Joint Space (x, y)
             ^ y
             |           .-------.
             |         .'         `.
             |        /    Joint    \
             |       |  Distribution |
             |        \             /
             |         `.         .'
             |           `-------'
             +----------------------------> x
                    /             \
                   / Marginalize   \ Condition on y = z
                  v                 v
            p(x) = N(mu_x, S_xx)   p(x|y=z) = N(mu_{x|y}, S_{x|y})
```

### 1.4.1 Marginal Distributions
To obtain the marginal probability density $p(x)$, we integrate out all components of $y$:
$$p(x) = \int_{\mathbb{R}^m} p(x, y) \, dy$$
For a joint Gaussian, marginalization is computationally trivial: one simply drops the irrelevant rows and columns from the mean vector and covariance matrix!
$$p(x) = \mathcal{N}(\mu_x, \Sigma_{xx})$$
$$p(y) = \mathcal{N}(\mu_y, \Sigma_{yy})$$
No integration is required.

### 1.4.2 Conditional Distributions and the Schur Complement
In state estimation, observing a physical sensor measurement $y = z_{\text{meas}}$ provides information about the hidden state $x$. We seek the **conditional distribution** $p(x | y = z)$.

By Bayes' Rule:
$$p(x | y) = \frac{p(x, y)}{p(y)}$$
Through completing the square on the partitioned inverse covariance (the information matrix $\Lambda = \Sigma^{-1}$), one obtains the monumental **Gaussian Conditioning Theorem**:

$$x \mid (y = z) \sim \mathcal{N}\left( \mu_{x|y}, \; \Sigma_{x|y} \right)$$

where:
$$\mu_{x|y} = \mu_x + \Sigma_{xy} \Sigma_{yy}^{-1} (z - \mu_y)$$
$$\Sigma_{x|y} = \Sigma_{xx} - \Sigma_{xy} \Sigma_{yy}^{-1} \Sigma_{yx}$$

### 1.4.3 Deep Physical Insights into the Conditioning Formula
1. **The Innovation Residual:** The term $(z - \mu_y)$ represents the difference between the actual sensor observation $z$ and its prior expected value $\mu_y$. It is called the **innovation** or **measurement residual**.
2. **The Optimal Gain:** The matrix $K = \Sigma_{xy} \Sigma_{yy}^{-1} \in \mathbb{R}^{n \times m}$ weights the innovation. If the sensor is completely uncorrelated with the state ($\Sigma_{xy} = 0$), then $K = 0$, and the measurement is ignored: $\mu_{x|y} = \mu_x$.
3. **The Schur Complement and Variance Contraction:** The posterior covariance $\Sigma_{x|y}$ is precisely the **Schur complement** of block $\Sigma_{yy}$ in the joint covariance matrix. Because $\Sigma$ is positive definite, the term $\Sigma_{xy} \Sigma_{yy}^{-1} \Sigma_{yx} \ge 0$ is positive semi-definite. Therefore:
   $$\Sigma_{x|y} \le \Sigma_{xx}$$
   Every measurement containing non-zero cross-correlation **strictly reduces or preserves** uncertainty in the Loewner ordering ($A \le B \iff B - A \in \mathbb{S}_+^n$).
4. **Data Independence of Uncertainty:** Notice that $\Sigma_{x|y}$ depends only on the prior covariances $\Sigma_{xx}, \Sigma_{xy}, \Sigma_{yy}$, and is **completely independent of the actual measurement value $z$**. In linear Gaussian systems, uncertainty contraction can be computed offline before a single sensor photon has arrived!

---

## 1.5 The Principle of Maximum Likelihood and Bayesian Fusion

Let a hidden scalar physical state be $x \in \mathbb{R}$. We possess two independent, unbiased sensory estimates of $x$:
- Sensor 1: $z_1 = x + v_1, \quad v_1 \sim \mathcal{N}(0, \sigma_1^2)$
- Sensor 2: $z_2 = x + v_2, \quad v_2 \sim \mathcal{N}(0, \sigma_2^2)$

We seek the optimal fused estimate $\hat{x}$ that minimizes the variance of the error $\tilde{x} = \hat{x} - x$.
Formulating as a linear combination $\hat{x} = w_1 z_1 + w_2 z_2$:
$$\mathbb{E}[\hat{x}] = w_1 \mathbb{E}[z_1] + w_2 \mathbb{E}[z_2] = (w_1 + w_2) x$$
For unbiasedness, we must have $w_1 + w_2 = 1 \implies w_2 = 1 - w_1$.
The variance of the fused estimator is:
$$\sigma_{\text{fused}}^2 = \operatorname{Var}(w_1 z_1 + (1 - w_1) z_2) = w_1^2 \sigma_1^2 + (1 - w_1)^2 \sigma_2^2$$
To find the optimal weight $w_1$, we minimize $\sigma_{\text{fused}}^2$ with respect to $w_1$:
$$\frac{d \sigma_{\text{fused}}^2}{d w_1} = 2 w_1 \sigma_1^2 - 2(1 - w_1) \sigma_2^2 = 0 \implies w_1 (\sigma_1^2 + \sigma_2^2) = \sigma_2^2$$
$$w_1 = \frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2} = \frac{1/\sigma_1^2}{1/\sigma_1^2 + 1/\sigma_2^2}$$
$$w_2 = \frac{\sigma_1^2}{\sigma_1^2 + \sigma_2^2} = \frac{1/\sigma_2^2}{1/\sigma_1^2 + 1/\sigma_2^2}$$

Substituting back into the fused variance:
$$\sigma_{\text{fused}}^2 = \left(\frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2}\right)^2 \sigma_1^2 + \left(\frac{\sigma_1^2}{\sigma_1^2 + \sigma_2^2}\right)^2 \sigma_2^2 = \frac{\sigma_1^2 \sigma_2^4 + \sigma_1^4 \sigma_2^2}{(\sigma_1^2 + \sigma_2^2)^2} = \frac{\sigma_1^2 \sigma_2^2 (\sigma_1^2 + \sigma_2^2)}{(\sigma_1^2 + \sigma_2^2)^2} = \frac{\sigma_1^2 \sigma_2^2}{\sigma_1^2 + \sigma_2^2}$$
Expressed in terms of **information** (precision $I = 1/\sigma^2$):
$$I_{\text{fused}} = \frac{1}{\sigma_{\text{fused}}^2} = \frac{\sigma_1^2 + \sigma_2^2}{\sigma_1^2 \sigma_2^2} = \frac{1}{\sigma_1^2} + \frac{1}{\sigma_2^2} = I_1 + I_2$$
$$\hat{x} = \frac{I_1 z_1 + I_2 z_2}{I_1 + I_2}$$

```
                Density
                   ^            Fused Estimate (Narrower than both)
                   |                 |  
                   |               .-+-.
                   |              /  |  \
                   |   Sensor 1  /   |   \    Sensor 2
                   |     .--.   /    |    \    .---.
                   |    /    \ /     |     \  /     \
                   |   /      X      |      X/       \
                   +--+------+-------+-------+--------+----> State x
                            z1      x_hat    z2
```

Notice that:
$$\sigma_{\text{fused}}^2 = \frac{\sigma_1^2 \sigma_2^2}{\sigma_1^2 + \sigma_2^2} = \sigma_1^2 \left( \frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2} \right) < \sigma_1^2$$
$$\sigma_{\text{fused}}^2 = \sigma_2^2 \left( \frac{\sigma_1^2}{\sigma_1^2 + \sigma_2^2} \right) < \sigma_2^2$$
The variance of the fused estimate is **strictly smaller than the variance of either individual sensor alone**, even if one sensor is significantly noisier than the other! Fusing two independent unbiased measurements can never degrade the estimate.

---

## 1.6 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 1.1 – 1.10)

#### Problem 1.1: Eigendecomposition and Principal Axis Geometry of a 2D Robot Position Covariance
**Statement:**
The horizontal position $(x, y)$ of a mobile robot is uncertain, characterized by a bivariate Gaussian distribution with mean $\mu = [2.0, 3.0]^T\text{ m}$ and covariance matrix:
$$\Sigma = \begin{bmatrix} 4.0 & 1.8 \\ 1.8 & 1.0 \end{bmatrix}\text{ m}^2$$
1. Compute the eigenvalues $\lambda_1, \lambda_2$ and normalized eigenvectors $v_1, v_2$ of $\Sigma$.
2. Determine the orientation angle $\theta$ of the major principal axis relative to the global x-axis.
3. Compute the lengths of the semi-major and semi-minor axes of the $2\sigma$ ($c = 2$) confidence ellipse.
4. Calculate the physical area enclosed by the $2\sigma$ confidence ellipse.

**Given Data:**
- $\Sigma = \begin{bmatrix} 4.0 & 1.8 \\ 1.8 & 1.0 \end{bmatrix}$, $\mu = [2.0, 3.0]^T$, $c = 2.0$.

**Step-by-Step Derivation:**
1. **Eigenvalues Calculation:**
   The characteristic equation is $\det(\Sigma - \lambda I) = 0$:
   $$\det\begin{bmatrix} 4.0 - \lambda & 1.8 \\ 1.8 & 1.0 - \lambda \end{bmatrix} = (4.0 - \lambda)(1.0 - \lambda) - (1.8)^2 = 0$$
   $$\lambda^2 - 5.0 \lambda + 4.0 - 3.24 = \lambda^2 - 5.0 \lambda + 0.76 = 0$$
   Applying the quadratic formula:
   $$\lambda = \frac{5.0 \pm \sqrt{25.0 - 4(1)(0.76)}}{2} = \frac{5.0 \pm \sqrt{25.0 - 3.04}}{2} = \frac{5.0 \pm \sqrt{21.96}}{2} = \frac{5.0 \pm 4.68615}{2}$$
   $$\lambda_1 = \frac{5.0 + 4.68615}{2} = 4.843075\text{ m}^2$$
   $$\lambda_2 = \frac{5.0 - 4.68615}{2} = 0.156925\text{ m}^2$$
2. **Eigenvector for $\lambda_1$:**
   $$(\Sigma - \lambda_1 I) v_1 = \begin{bmatrix} 4.0 - 4.843075 & 1.8 \\ 1.8 & 1.0 - 4.843075 \end{bmatrix} \begin{bmatrix} v_{1x} \\ v_{1y} \end{bmatrix} = \begin{bmatrix} -0.843075 & 1.8 \\ 1.8 & -3.843075 \end{bmatrix} \begin{bmatrix} v_{1x} \\ v_{1y} \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   $$-0.843075 v_{1x} + 1.8 v_{1y} = 0 \implies v_{1y} = \frac{0.843075}{1.8} v_{1x} = 0.468375 v_{1x}$$
   Setting $v_{1x} = 1.0 \implies v_1 = [1.0, 0.468375]^T$.
   Normalizing:
   $$\|v_1\| = \sqrt{1.0^2 + 0.468375^2} = \sqrt{1.0 + 0.219375} = \sqrt{1.219375} = 1.104253$$
   $$v_1 = \begin{bmatrix} 1.0 / 1.104253 \\ 0.468375 / 1.104253 \end{bmatrix} = \begin{bmatrix} 0.905589 \\ 0.424155 \end{bmatrix}$$
3. **Major Axis Orientation:**
   $$\theta = \operatorname{atan2}(v_{1y}, v_{1x}) = \operatorname{atan2}(0.424155, 0.905589) = 0.43806\text{ rad} \approx 25.10^\circ$$
4. **Semi-Axis Lengths for $c = 2$:**
   $$a = c \sqrt{\lambda_1} = 2.0 \times \sqrt{4.843075} = 2.0 \times 2.20070 = 4.4014\text{ m}$$
   $$b = c \sqrt{\lambda_2} = 2.0 \times \sqrt{0.156925} = 2.0 \times 0.396138 = 0.7923\text{ m}$$
5. **Area of Confidence Ellipse:**
   $$\text{Area} = \pi \cdot a \cdot b = \pi \times 4.4014 \times 0.7923 = \pi \times 3.4872 \approx 10.955\text{ m}^2$$
   Alternatively, $\text{Area} = \pi c^2 \sqrt{\det(\Sigma)} = \pi (4.0) \sqrt{0.76} = 4 \pi (0.87178) \approx 10.955\text{ m}^2$.

**Final Answer:**
- Eigenvalues: $\lambda_1 \approx 4.8431\text{ m}^2$, $\lambda_2 \approx 0.1569\text{ m}^2$.
- Major axis orientation: $\theta \approx 25.10^\circ$.
- Semi-axis lengths: $a \approx 4.401\text{ m}$ (semi-major), $b \approx 0.792\text{ m}$ (semi-minor).
- Area of $2\sigma$ ellipse: $\approx 10.955\text{ m}^2$.

**Verification:**
Trace invariant: $\operatorname{tr}(\Sigma) = 4.0 + 1.0 = 5.0$. $\lambda_1 + \lambda_2 = 4.843075 + 0.156925 = 5.0000$.
Determinant invariant: $\det(\Sigma) = 4.0(1.0) - (1.8)^2 = 0.76$. $\lambda_1 \lambda_2 = (4.843075)(0.156925) = 0.7600$. Perfect match.

---

#### Problem 1.2: Mahalanobis Distance and Outlier Detection
**Statement:**
A mobile robot with nominal state $\mu = [10.0, 20.0]^T\text{ m}$ and covariance $\Sigma = \begin{bmatrix} 2.0 & 1.0 \\ 1.0 & 2.0 \end{bmatrix}\text{ m}^2$ receives an ultrasonic range beacon measurement indicating that its position is $x_{\text{meas}} = [13.0, 22.0]^T\text{ m}$.
1. Compute the Euclidean distance between $x_{\text{meas}}$ and $\mu$.
2. Compute the exact inverse covariance matrix $\Sigma^{-1}$.
3. Calculate the squared Mahalanobis distance $D_M^2(x_{\text{meas}}, \mu)$ and $D_M$.
4. Determine whether this measurement falls within the $95\%$ confidence boundary for a 2-DoF Gaussian system ($\chi_{2, 0.95}^2 = 5.991$).

**Given Data:**
- $\mu = [10.0, 20.0]^T$, $x = [13.0, 22.0]^T \implies \Delta x = x - \mu = [3.0, 2.0]^T$.
- $\Sigma = \begin{bmatrix} 2.0 & 1.0 \\ 1.0 & 2.0 \end{bmatrix}$, threshold $\chi_{\text{crit}}^2 = 5.991$.

**Step-by-Step Derivation:**
1. **Euclidean Distance:**
   $$d_{\text{Euclid}} = \|\Delta x\| = \sqrt{3.0^2 + 2.0^2} = \sqrt{9 + 4} = \sqrt{13} \approx 3.60555\text{ m}$$
2. **Matrix Inversion:**
   $$\det(\Sigma) = (2.0)(2.0) - (1.0)(1.0) = 4.0 - 1.0 = 3.0$$
   $$\Sigma^{-1} = \frac{1}{3.0} \begin{bmatrix} 2.0 & -1.0 \\ -1.0 & 2.0 \end{bmatrix} = \begin{bmatrix} 2/3 & -1/3 \\ -1/3 & 2/3 \end{bmatrix}$$
3. **Squared Mahalanobis Distance:**
   $$D_M^2 = \Delta x^T \Sigma^{-1} \Delta x = \begin{bmatrix} 3.0 & 2.0 \end{bmatrix} \left( \frac{1}{3.0} \begin{bmatrix} 2.0 & -1.0 \\ -1.0 & 2.0 \end{bmatrix} \right) \begin{bmatrix} 3.0 \\ 2.0 \end{bmatrix}$$
   $$\begin{bmatrix} 2.0 & -1.0 \\ -1.0 & 2.0 \end{bmatrix} \begin{bmatrix} 3.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 2(3) - 1(2) \\ -1(3) + 2(2) \end{bmatrix} = \begin{bmatrix} 6 - 2 \\ -3 + 4 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 1.0 \end{bmatrix}$$
   $$D_M^2 = \frac{1}{3.0} \begin{bmatrix} 3.0 & 2.0 \end{bmatrix} \begin{bmatrix} 4.0 \\ 1.0 \end{bmatrix} = \frac{1}{3.0} (3.0 \times 4.0 + 2.0 \times 1.0) = \frac{12.0 + 2.0}{3.0} = \frac{14.0}{3.0} \approx 4.6667$$
   $$D_M = \sqrt{4.6667} \approx 2.1602$$
4. **Outlier Hypothesis Test:**
   We compare $D_M^2$ to the critical value $\chi_{2, 0.95}^2 = 5.991$:
   $$D_M^2 = 4.6667 < 5.991$$
   Since $D_M^2 < \chi_{\text{crit}}^2$, the measurement lies well inside the $95\%$ confidence region (it is a valid measurement, not an outlier).

**Final Answer:**
- Euclidean distance: $d_{\text{Euclid}} \approx 3.606\text{ m}$.
- $\Sigma^{-1} = \begin{bmatrix} 0.6667 & -0.3333 \\ -0.3333 & 0.6667 \end{bmatrix}\text{ m}^{-2}$.
- Squared Mahalanobis distance: $D_M^2 = 14/3 \approx 4.667$ ($D_M \approx 2.160$).
- Outlier check: Valid measurement ($4.667 < 5.991$, inside $95\%$ confidence ellipse).

**Verification:**
Notice that because of the positive cross-correlation ($\sigma_{12} = 1.0 > 0$), deviations where $x$ and $y$ both increase are statistically favored over opposite deviations. If $\Delta x$ were $[3.0, -2.0]^T$:
$D_M^2 = \frac{1}{3} [3, -2] \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix} \begin{bmatrix} 3 \\ -2 \end{bmatrix} = \frac{1}{3} [3, -2] \begin{bmatrix} 8 \\ -7 \end{bmatrix} = \frac{24 + 14}{3} = \frac{38}{3} = 12.67 > 5.991$, which would be rejected as an extreme outlier despite having identical Euclidean distance! This demonstrates the statistical power of Mahalanobis gating.

---

#### Problem 1.3: Linear Coordinate Transformation of Gaussian Uncertainty
**Statement:**
A robotic end-effector tracking system measures pose in polar coordinates $p = [r, \theta]^T$, where $r \sim \mathcal{N}(5.0, 0.04)\text{ m}$ (standard deviation $0.2\text{ m}$) and $\theta \sim \mathcal{N}(\pi/6, 0.01)\text{ rad}$ (standard deviation $0.1\text{ rad}$), with correlation $\rho = 0.5$.
The robot controller requires Cartesian coordinates $(x, y)$ via the nonlinear mapping:
$$x = r \cos\theta, \quad y = r \sin\theta$$
1. Evaluate the nominal Cartesian mean position $(\mu_x, \mu_y)$.
2. Compute the Jacobian matrix $J = \left.\frac{\partial (x, y)}{\partial (r, \theta)}\right|_{(\mu_r, \mu_\theta)}$.
3. Using first-order linear covariance propagation $\Sigma_{xy} = J \Sigma_{r\theta} J^T$, calculate the Cartesian covariance matrix $\Sigma_{xy}$.
4. Compute the marginal standard deviations $\sigma_x$ and $\sigma_y$.

**Given Data:**
- $\mu_r = 5.0$, $\sigma_r^2 = 0.04$, $\sigma_r = 0.2$.
- $\mu_\theta = \pi/6 = 30^\circ$, $\sigma_\theta^2 = 0.01$, $\sigma_\theta = 0.1$.
- $\sigma_{r\theta} = \rho \sigma_r \sigma_\theta = 0.5(0.2)(0.1) = 0.01$.
- $\Sigma_{r\theta} = \begin{bmatrix} 0.04 & 0.01 \\ 0.01 & 0.01 \end{bmatrix}$.

**Step-by-Step Derivation:**
1. **Nominal Mean:**
   $$\mu_x = 5.0 \cos(\pi/6) = 5.0 \left(\frac{\sqrt{3}}{2}\right) \approx 4.33013\text{ m}$$
   $$\mu_y = 5.0 \sin(\pi/6) = 5.0 (0.5) = 2.50000\text{ m}$$
2. **Jacobian Evaluation:**
   $$J = \begin{bmatrix} \frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} \\ \frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta} \end{bmatrix} = \begin{bmatrix} \cos\theta & -r \sin\theta \\ \sin\theta & r \cos\theta \end{bmatrix}$$
   Evaluating at $\mu$:
   $$J = \begin{bmatrix} \frac{\sqrt{3}}{2} & -5.0(0.5) \\ 0.5 & 5.0\left(\frac{\sqrt{3}}{2}\right) \end{bmatrix} = \begin{bmatrix} 0.866025 & -2.500000 \\ 0.500000 & 4.330127 \end{bmatrix}$$
3. **Covariance Propagation $\Sigma_{xy} = J \Sigma_{r\theta} J^T$:**
   First compute $J \Sigma_{r\theta}$:
   $$J \Sigma_{r\theta} = \begin{bmatrix} 0.866025 & -2.5 \\ 0.5 & 4.330127 \end{bmatrix} \begin{bmatrix} 0.04 & 0.01 \\ 0.01 & 0.01 \end{bmatrix}$$
   $$\text{Row 1, Col 1:} \quad 0.866025(0.04) + (-2.5)(0.01) = 0.034641 - 0.025 = 0.009641$$
   $$\text{Row 1, Col 2:} \quad 0.866025(0.01) + (-2.5)(0.01) = 0.008660 - 0.025 = -0.016340$$
   $$\text{Row 2, Col 1:} \quad 0.5(0.04) + 4.330127(0.01) = 0.020 + 0.043301 = 0.063301$$
   $$\text{Row 2, Col 2:} \quad 0.5(0.01) + 4.330127(0.01) = 0.005 + 0.043301 = 0.048301$$
   $$J \Sigma_{r\theta} = \begin{bmatrix} 0.009641 & -0.016340 \\ 0.063301 & 0.048301 \end{bmatrix}$$
   Now compute $(J \Sigma_{r\theta}) J^T$:
   $$\Sigma_{xx} = 0.009641(0.866025) + (-0.016340)(-2.5) = 0.008350 + 0.040850 = 0.049200\text{ m}^2$$
   $$\Sigma_{yy} = 0.063301(0.5) + 0.048301(4.330127) = 0.031651 + 0.209150 = 0.240801\text{ m}^2$$
   $$\Sigma_{xy} = 0.009641(0.5) + (-0.016340)(4.330127) = 0.004821 - 0.070754 = -0.065933\text{ m}^2$$
   $$\Sigma_{\text{Cartesian}} = \begin{bmatrix} 0.04920 & -0.06593 \\ -0.06593 & 0.24080 \end{bmatrix}\text{ m}^2$$
4. **Marginal Standard Deviations:**
   $$\sigma_x = \sqrt{0.04920} \approx 0.2218\text{ m}$$
   $$\sigma_y = \sqrt{0.24080} \approx 0.4907\text{ m}$$

**Final Answer:**
- Mean position: $(\mu_x, \mu_y) \approx (4.330\text{ m}, 2.500\text{ m})$.
- Jacobian: $J \approx \begin{bmatrix} 0.8660 & -2.5000 \\ 0.5000 & 4.3301 \end{bmatrix}$.
- Cartesian covariance: $\Sigma_{xy} \approx \begin{bmatrix} 0.0492 & -0.0659 \\ -0.0659 & 0.2408 \end{bmatrix}\text{ m}^2$.
- Standard deviations: $\sigma_x \approx 0.222\text{ m}$, $\sigma_y \approx 0.491\text{ m}$.

**Verification:**
Notice that $\sigma_y$ ($0.491\text{ m}$) is substantially larger than $\sigma_x$ ($0.222\text{ m}$). This physically corresponds to the tangential uncertainty $r \sigma_\theta = 5.0 \times 0.1 = 0.5\text{ m}$, which projects predominantly onto the y-axis at $\theta = 30^\circ$, while radial uncertainty $\sigma_r = 0.2\text{ m}$ projects predominantly onto the x-axis.

---

#### Problem 1.4: Conditioning a Bivariate Gaussian on a Sensor Measurement
**Statement:**
A target's 1D position $x$ and velocity $v$ follow a prior joint Gaussian distribution:
$$\begin{bmatrix} x \\ v \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} 10.0 \\ 2.0 \end{bmatrix}, \; \begin{bmatrix} 5.0 & 2.0 \\ 2.0 & 4.0 \end{bmatrix} \right)$$
A position sensor measures the target's position as $z = 12.0\text{ m}$ with zero measurement noise (perfect measurement: $x = 12.0$).
1. Using the Gaussian Conditioning Theorem, compute the posterior conditional mean velocity $\mu_{v|x=12}$.
2. Compute the posterior conditional variance $\sigma_{v|x=12}^2$.
3. By what percentage is the velocity uncertainty reduced purely by observing position?

**Given Data:**
- Prior means: $\mu_x = 10.0, \mu_v = 2.0$.
- Prior covariance: $\Sigma_{xx} = 5.0, \Sigma_{vv} = 4.0, \Sigma_{xv} = \Sigma_{vx} = 2.0$.
- Measurement: $x = 12.0$.

**Step-by-Step Derivation:**
1. **Conditional Mean:**
   By the conditioning theorem:
   $$\mu_{v|x} = \mu_v + \Sigma_{vx} \Sigma_{xx}^{-1} (x_{\text{meas}} - \mu_x)$$
   Substitute known scalars:
   $$\mu_{v|x=12} = 2.0 + (2.0) (5.0)^{-1} (12.0 - 10.0) = 2.0 + \frac{2.0}{5.0} (2.0) = 2.0 + 0.4(2.0) = 2.0 + 0.8 = 2.8\text{ m/s}$$
2. **Conditional Variance:**
   $$\sigma_{v|x}^2 = \Sigma_{vv} - \Sigma_{vx} \Sigma_{xx}^{-1} \Sigma_{xv} = 4.0 - \frac{(2.0)(2.0)}{5.0} = 4.0 - \frac{4.0}{5.0} = 4.0 - 0.8 = 3.2\text{ m}^2/\text{s}^2$$
3. **Uncertainty Reduction:**
   Prior variance: $\sigma_{v,\text{prior}}^2 = 4.0$.
   Posterior variance: $\sigma_{v|x}^2 = 3.2$.
   $$\text{Reduction} = \frac{4.0 - 3.2}{4.0} \times 100\% = \frac{0.8}{4.0} \times 100\% = 20.0\%$$

**Final Answer:**
- Conditional mean velocity: $\mu_{v|x=12} = 2.8\text{ m/s}$.
- Conditional variance: $\sigma_{v|x}^2 = 3.2\text{ m}^2/\text{s}^2$.
- Uncertainty reduction: Exactly $20\%$.

**Verification:**
The correlation coefficient is $\rho = \frac{\Sigma_{xv}}{\sqrt{\Sigma_{xx} \Sigma_{vv}}} = \frac{2.0}{\sqrt{5.0 \times 4.0}} = \frac{2.0}{\sqrt{20.0}} = \frac{2.0}{4.4721} \approx 0.4472$.
The variance reduction formula states $\sigma_{v|x}^2 = \sigma_v^2 (1 - \rho^2) = 4.0 (1 - 4/20) = 4.0(1 - 0.2) = 4.0(0.8) = 3.2$. Exact match.

---

#### Problem 1.5: Optimal Bayesian Sensor Fusion of Two Independent Rangefinders
**Statement:**
Two independent laser rangefinders measure the distance $d$ from a docking spacecraft to a space station:
- Sensor A: measurement $z_A = 42.6\text{ m}$, accuracy variance $\sigma_A^2 = 0.36\text{ m}^2$ ($\sigma_A = 0.6\text{ m}$).
- Sensor B: measurement $z_B = 41.8\text{ m}$, accuracy variance $\sigma_B^2 = 0.16\text{ m}^2$ ($\sigma_B = 0.4\text{ m}$).
Assuming an uninformative (flat) prior:
1. Compute the optimal fusion weights $w_A$ and $w_B$.
2. Calculate the optimal fused distance estimate $\hat{d}$.
3. Calculate the fused variance $\sigma_{\text{fused}}^2$ and standard deviation $\sigma_{\text{fused}}$.
4. Express the fusion in precision/information form.

**Given Data:**
- $z_A = 42.6, \sigma_A^2 = 0.36$.
- $z_B = 41.8, \sigma_B^2 = 0.16$.

**Step-by-Step Derivation:**
1. **Optimal Weights:**
   $$w_A = \frac{\sigma_B^2}{\sigma_A^2 + \sigma_B^2} = \frac{0.16}{0.36 + 0.16} = \frac{0.16}{0.52} = \frac{16}{52} = \frac{4}{13} \approx 0.30769$$
   $$w_B = \frac{\sigma_A^2}{\sigma_A^2 + \sigma_B^2} = \frac{0.36}{0.36 + 0.16} = \frac{0.36}{0.52} = \frac{36}{52} = \frac{9}{13} \approx 0.69231$$
   Notice $w_A + w_B = 4/13 + 9/13 = 1.0$.
2. **Fused Distance Estimate:**
   $$\hat{d} = w_A z_A + w_B z_B = \frac{4}{13}(42.6) + \frac{9}{13}(41.8) = \frac{170.4 + 376.2}{13} = \frac{546.6}{13} = 42.04615\text{ m}$$
3. **Fused Variance:**
   $$\sigma_{\text{fused}}^2 = \frac{\sigma_A^2 \sigma_B^2}{\sigma_A^2 + \sigma_B^2} = \frac{0.36 \times 0.16}{0.52} = \frac{0.0576}{0.52} = \frac{576}{5200} = \frac{36}{325} \approx 0.110769\text{ m}^2$$
   $$\sigma_{\text{fused}} = \sqrt{0.110769} \approx 0.33282\text{ m}$$
4. **Information Form:**
   $$I_A = \frac{1}{\sigma_A^2} = \frac{1}{0.36} = \frac{100}{36} = 2.7778\text{ m}^{-2}$$
   $$I_B = \frac{1}{\sigma_B^2} = \frac{1}{0.16} = \frac{100}{16} = 6.2500\text{ m}^{-2}$$
   $$I_{\text{fused}} = I_A + I_B = 2.7778 + 6.2500 = 9.0278\text{ m}^{-2}$$
   $$\sigma_{\text{fused}}^2 = \frac{1}{I_{\text{fused}}} = \frac{1}{9.0278} \approx 0.11077\text{ m}^2$$

**Final Answer:**
- Weights: $w_A = 4/13 \approx 0.308$, $w_B = 9/13 \approx 0.692$.
- Fused estimate: $\hat{d} \approx 42.046\text{ m}$.
- Fused variance: $\sigma_{\text{fused}}^2 \approx 0.1108\text{ m}^2$ ($\sigma_{\text{fused}} \approx 0.333\text{ m}$).
- Information: $I_{\text{fused}} \approx 9.028\text{ m}^{-2}$.

**Verification:**
The fused standard deviation $\sigma_{\text{fused}} = 0.333\text{ m}$ is strictly less than both $\sigma_B = 0.40\text{ m}$ and $\sigma_A = 0.60\text{ m}$. Uncertainty was reduced by over $16.8\%$ relative to the best sensor alone.

---

#### Problem 1.6: 3D Covariance Ellipsoid Volume and Orientation in Drone Tracking
**Statement:**
A quadrotor's spatial position error covariance in 3D coordinates $(x, y, z)$ is given by the diagonal matrix:
$$\Sigma = \operatorname{diag}(0.25, 0.16, 0.09)\text{ m}^2$$
1. Compute the volume of the $1\sigma$ ($c = 1$) uncertainty ellipsoid.
2. Compute the volume of the $3\sigma$ ($c = 3$) uncertainty ellipsoid.
3. Determine the probability that the quadrotor's true position lies strictly inside the $1\sigma$, $2\sigma$, and $3\sigma$ ellipsoids.

**Given Data:**
- $\Sigma = \operatorname{diag}(\sigma_x^2, \sigma_y^2, \sigma_z^2) = \operatorname{diag}(0.25, 0.16, 0.09)$.
- Standard deviations: $\sigma_x = 0.5\text{ m}, \sigma_y = 0.4\text{ m}, \sigma_z = 0.3\text{ m}$.

**Step-by-Step Derivation:**
1. **Volume Formula in $\mathbb{R}^3$:**
   $$\operatorname{Vol}(\mathcal{E}_c) = \frac{4}{3} \pi a b c = \frac{4}{3} \pi (c \sigma_x)(c \sigma_y)(c \sigma_z) = \frac{4}{3} \pi c^3 \sqrt{\det(\Sigma)}$$
   $$\sqrt{\det(\Sigma)} = \sigma_x \sigma_y \sigma_z = (0.5)(0.4)(0.3) = 0.06\text{ m}^3$$
2. **Volume for $c = 1$:**
   $$\operatorname{Vol}(\mathcal{E}_1) = \frac{4}{3} \pi (1)^3 (0.06) = 0.08 \pi \approx 0.251327\text{ m}^3$$
3. **Volume for $c = 3$:**
   $$\operatorname{Vol}(\mathcal{E}_3) = \frac{4}{3} \pi (3)^3 (0.06) = 27 \times \operatorname{Vol}(\mathcal{E}_1) = 27 \times 0.251327 \approx 6.78584\text{ m}^3$$
4. **Probability Mass Calculation:**
   For $n = 3$, $D_M^2 \sim \chi^2(3)$. The CDF of $\chi^2(3)$ is:
   $$F(c^2) = 2 \Phi(c) - 1 - \sqrt{\frac{2}{\pi}} c e^{-c^2/2}$$
   where $\Phi(c)$ is the standard normal CDF.
   - For $c = 1$:
     $$F(1) = 2\Phi(1) - 1 - \sqrt{\frac{2}{\pi}}(1) e^{-0.5} = 2(0.841345) - 1 - 0.797885(0.606531) = 0.682689 - 0.483941 = 0.198748 \approx 19.87\%$$
   - For $c = 2$:
     $$F(4) = 2\Phi(2) - 1 - \sqrt{\frac{2}{\pi}}(2) e^{-2} = 2(0.977250) - 1 - 1.595769(0.135335) = 0.954500 - 0.215964 = 0.738536 \approx 73.85\%$$
   - For $c = 3$:
     $$F(9) = 2\Phi(3) - 1 - \sqrt{\frac{2}{\pi}}(3) e^{-4.5} = 2(0.998650) - 1 - 2.393654(0.011109) = 0.997300 - 0.026591 = 0.970709 \approx 97.07\%$$

**Final Answer:**
- $1\sigma$ volume: $\approx 0.251\text{ m}^3$.
- $3\sigma$ volume: $\approx 6.786\text{ m}^3$.
- Probabilities: $P(1\sigma) \approx 19.87\%$, $P(2\sigma) \approx 73.85\%$, $P(3\sigma) \approx 97.07\%$.

**Verification:**
Notice the dramatic difference from 1D: in 3D, a $1\sigma$ ellipsoid captures less than $20\%$ of probability mass, and even a $2\sigma$ ellipsoid leaves over $26\%$ of probability in the outer tail.

---

#### Problem 1.7: Linear Measurement Model with Correlated Observation Noise
**Statement:**
A robotic joint angle $\theta \sim \mathcal{N}(\mu_\theta, \sigma_\theta^2)$ is measured by two sensors on the same printed circuit board:
$$z_1 = \theta + v_1, \quad z_2 = \theta + v_2$$
Due to shared power supply noise and thermal coupling, the observation noise vector $v = [v_1, v_2]^T$ has covariance:
$$R = \begin{bmatrix} r_1 & r_c \\ r_c & r_2 \end{bmatrix} = \begin{bmatrix} 4.0 & 2.0 \\ 2.0 & 4.0 \end{bmatrix}\text{ mrad}^2$$
Find the optimal linear unbiased estimator $\hat{\theta} = w_1 z_1 + w_2 z_2$ ($w_1 + w_2 = 1$) that minimizes the error variance, compute the optimal weights, and evaluate the resulting fused variance $\sigma_{\text{fused}}^2$.

**Given Data:**
- $r_1 = 4.0, r_2 = 4.0, r_c = 2.0$. Constraint: $w_1 + w_2 = 1 \implies w_2 = 1 - w_1$.

**Step-by-Step Derivation:**
1. **Variance Formulation:**
   $$\operatorname{Var}(\hat{\theta}) = \operatorname{Var}(w_1 (\theta + v_1) + w_2 (\theta + v_2)) = \operatorname{Var}(\theta + w_1 v_1 + w_2 v_2)$$
   The estimation error is $\tilde{\theta} = \hat{\theta} - \theta = w_1 v_1 + w_2 v_2 = w^T v$.
   The error variance is:
   $$\sigma_e^2(w) = w^T R w = \begin{bmatrix} w_1 & 1 - w_1 \end{bmatrix} \begin{bmatrix} r_1 & r_c \\ r_c & r_2 \end{bmatrix} \begin{bmatrix} w_1 \\ 1 - w_1 \end{bmatrix}$$
   $$= w_1^2 r_1 + 2 w_1 (1 - w_1) r_c + (1 - w_1)^2 r_2$$
2. **Minimizing with Respect to $w_1$:**
   $$\frac{d \sigma_e^2}{d w_1} = 2 w_1 r_1 + 2(1 - 2w_1) r_c - 2(1 - w_1) r_2 = 0$$
   $$w_1 r_1 + r_c - 2 w_1 r_c - r_2 + w_1 r_2 = 0$$
   $$w_1 (r_1 + r_2 - 2 r_c) = r_2 - r_c$$
   $$w_1 = \frac{r_2 - r_c}{r_1 + r_2 - 2 r_c}$$
3. **Numerical Evaluation:**
   $$w_1 = \frac{4.0 - 2.0}{4.0 + 4.0 - 2(2.0)} = \frac{2.0}{8.0 - 4.0} = \frac{2.0}{4.0} = 0.5$$
   $$w_2 = 1 - w_1 = 0.5$$
4. **Fused Variance:**
   $$\sigma_e^2 = \begin{bmatrix} 0.5 & 0.5 \end{bmatrix} \begin{bmatrix} 4.0 & 2.0 \\ 2.0 & 4.0 \end{bmatrix} \begin{bmatrix} 0.5 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 0.5 & 0.5 \end{bmatrix} \begin{bmatrix} 3.0 \\ 3.0 \end{bmatrix} = 0.5(3.0) + 0.5(3.0) = 3.0\text{ mrad}^2$$

**Final Answer:**
- Optimal weights: $w_1 = 0.5, w_2 = 0.5$.
- Fused noise variance: $\sigma_e^2 = 3.0\text{ mrad}^2$ ($\sigma_e \approx 1.732\text{ mrad}$).

**Verification:**
If the noises were uncorrelated ($r_c = 0$), the fused variance would be $\frac{4 \times 4}{4 + 4} = 2.0\text{ mrad}^2$. Positive noise correlation increases the fused variance from $2.0$ to $3.0\text{ mrad}^2$ because the sensors partially share common-mode noise.

---

#### Problem 1.8: Negative Weights in Sensor Fusion with Highly Correlated Noise
**Statement:**
In a dual-sensor telemetry setup, sensor 1 has noise variance $r_1 = 1.0$, sensor 2 has noise variance $r_2 = 4.0$, and their noise cross-covariance is $r_c = 2.5$.
1. Compute the optimal weights $w_1$ and $w_2 = 1 - w_1$ for unbiased fusion.
2. Compute the resulting variance of the fused estimate $\sigma_e^2$.
3. Explain the physical mechanism by which the fused variance is strictly lower than both $r_1$ and $r_2$.

**Given Data:**
- $r_1 = 1.0, r_2 = 4.0, r_c = 2.5$.

**Step-by-Step Derivation:**
1. **Compute Weights:**
   Using the formula from Problem 1.7:
   $$w_1 = \frac{r_2 - r_c}{r_1 + r_2 - 2 r_c} = \frac{4.0 - 2.5}{1.0 + 4.0 - 2(2.5)} = \frac{1.5}{5.0 - 5.0}$$
   Notice that the denominator is $1.0 + 4.0 - 5.0 = 0$!
   Wait, let's examine the correlation coefficient:
   $$\rho = \frac{r_c}{\sqrt{r_1 r_2}} = \frac{2.5}{\sqrt{1.0 \times 4.0}} = \frac{2.5}{2.0} = 1.25 > 1.0$$
   A covariance of $r_c = 2.5$ violates the Cauchy-Schwarz inequality ($\det(R) = 4 - 6.25 = -2.25 < 0$), which is unphysical!
2. **Corrected Physical Cross-Covariance:**
   Let $r_c = 1.8 \implies \det(R) = 4.0 - 1.8^2 = 4.0 - 3.24 = 0.76 > 0$ ($\rho = 1.8 / 2.0 = 0.90$).
   Recomputing with physically valid $r_c = 1.8$:
   $$w_1 = \frac{r_2 - r_c}{r_1 + r_2 - 2 r_c} = \frac{4.0 - 1.8}{1.0 + 4.0 - 2(1.8)} = \frac{2.2}{5.0 - 3.6} = \frac{2.2}{1.4} = \frac{11}{7} \approx 1.5714$$
   $$w_2 = 1 - w_1 = 1 - \frac{11}{7} = -\frac{4}{7} \approx -0.5714$$
3. **Evaluating Fused Variance:**
   $$\sigma_e^2 = w^T R w = \begin{bmatrix} \frac{11}{7} & -\frac{4}{7} \end{bmatrix} \begin{bmatrix} 1.0 & 1.8 \\ 1.8 & 4.0 \end{bmatrix} \begin{bmatrix} 11/7 \\ -4/7 \end{bmatrix}$$
   $$\begin{bmatrix} 1.0 & 1.8 \\ 1.8 & 4.0 \end{bmatrix} \begin{bmatrix} 11/7 \\ -4/7 \end{bmatrix} = \frac{1}{7} \begin{bmatrix} 11(1.0) - 4(1.8) \\ 11(1.8) - 4(4.0) \end{bmatrix} = \frac{1}{7} \begin{bmatrix} 11 - 7.2 \\ 19.8 - 16 \end{bmatrix} = \frac{1}{7} \begin{bmatrix} 3.8 \\ 3.8 \end{bmatrix}$$
   $$\sigma_e^2 = \frac{1}{49} \begin{bmatrix} 11 & -4 \end{bmatrix} \begin{bmatrix} 3.8 \\ 3.8 \end{bmatrix} = \frac{1}{49} (11 - 4)(3.8) = \frac{7 \times 3.8}{49} = \frac{3.8}{7} \approx 0.54286$$

**Final Answer:**
- Weights: $w_1 = 11/7 \approx 1.571$, $w_2 = -4/7 \approx -0.571$ (negative weight on noisy sensor).
- Fused variance: $\sigma_e^2 = 3.8/7 \approx 0.543$.
- Physical mechanism: Because the noises are strongly positively correlated ($\rho = 0.90$), sensor 2 acts as a reference for the noise in sensor 1. By subtracting a scaled version of sensor 2 ($w_2 < 0$), the filter cancels common-mode noise, driving the final variance below the variance of both sensors ($0.543 < 1.0$).

**Verification:**
General formula for correlated fusion: $\sigma_e^2 = \frac{r_1 r_2 - r_c^2}{r_1 + r_2 - 2 r_c} = \frac{\det(R)}{r_1 + r_2 - 2 r_c} = \frac{0.76}{1.4} = \frac{76}{140} = \frac{38}{70} \approx 0.54286$. Exact match.

---

#### Problem 1.9: Linear Transformation and Invertibility of Covariance Under Rank Deficiency
**Statement:**
A 3-state vector $x = [x_1, x_2, x_3]^T \sim \mathcal{N}(0, I_3)$ is mapped to $\mathbb{R}^2$ via $y = A x$, where:
$$A = \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \end{bmatrix}$$
1. Compute the $2 \times 2$ covariance matrix $\Sigma_y = A \Sigma_x A^T$.
2. Determine whether $\Sigma_y$ is invertible.
3. Now consider mapping $x$ to $\mathbb{R}^4$ via $z = B x$, where:
   $$B = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 1 & 1 \end{bmatrix}$$
   Compute $\Sigma_z = B \Sigma_x B^T \in \mathbb{R}^{4 \times 4}$, determine its rank, and explain why $\Sigma_z$ is not invertible.

**Given Data:**
- $\Sigma_x = I_3$.

**Step-by-Step Derivation:**
1. **Compute $\Sigma_y$:**
   $$\Sigma_y = A I_3 A^T = A A^T = \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1^2 + 1^2 + 0 & 1(0) + 1(1) + 0(1) \\ 0(1) + 1(1) + 1(0) & 0^2 + 1^2 + 1^2 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$$
2. **Invertibility of $\Sigma_y$:**
   $$\det(\Sigma_y) = 2(2) - 1(1) = 4 - 1 = 3 \neq 0$$
   Since $\operatorname{rank}(A) = 2 = m$ (full row rank), $\Sigma_y$ is strictly positive definite and invertible.
3. **Compute $\Sigma_z$:**
   $$\Sigma_z = B B^T = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \\ 1 & 1 & 1 & 3 \end{bmatrix}$$
4. **Rank Analysis of $\Sigma_z$:**
   By Sylvester's rank inequality:
   $$\operatorname{rank}(B B^T) = \operatorname{rank}(B) = 3$$
   Since $\Sigma_z$ is a $4 \times 4$ matrix with rank 3:
   $$\det(\Sigma_z) = 0$$
   Row 4 is the exact linear sum of Rows 1, 2, and 3: $\text{Row}_4 = \text{Row}_1 + \text{Row}_2 + \text{Row}_3$.
   Therefore, $\Sigma_z$ is singular (positive semi-definite, not positive definite). The probability distribution in $\mathbb{R}^4$ is degenerate, confined to a 3-dimensional hyper-plane without any probability volume in the orthogonal direction.

**Final Answer:**
- $\Sigma_y = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ is strictly invertible ($\det = 3$).
- $\Sigma_z \in \mathbb{R}^{4 \times 4}$ has $\operatorname{rank}(\Sigma_z) = 3 < 4$, so $\det(\Sigma_z) = 0$ (non-invertible / degenerate Gaussian).

**Verification:**
Row 4 minus Rows 1,2,3: $[1, 1, 1, 3] - [1, 0, 0, 1] - [0, 1, 0, 1] - [0, 0, 1, 1] = [0, 0, 0, 0]$. Zero eigenvalue confirms singularity.

---

#### Problem 1.10: Information Matrix Parameterization of Gaussian Conditioning
**Statement:**
A Gaussian distribution can be parameterized in standard form $(\mu, \Sigma)$ or information (canonical) form $(\xi, \Lambda)$, where the **information matrix** is $\Lambda = \Sigma^{-1}$ and the **information vector** is $\xi = \Sigma^{-1} \mu$.
Given prior $\mu = [1, 2]^T$ and $\Sigma = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$:
1. Compute the prior information matrix $\Lambda$ and information vector $\xi$.
2. A linear measurement $z = H x + v$ arrives with $H = [1, 0]$ and measurement noise variance $R = 0.5$, with observed value $z = 3.0$.
   Using the information form update rules:
   $$\Lambda_{\text{post}} = \Lambda + H^T R^{-1} H, \quad \xi_{\text{post}} = \xi + H^T R^{-1} z$$
   compute $\Lambda_{\text{post}}$ and $\xi_{\text{post}}$.
3. Recover the posterior covariance $\Sigma_{\text{post}} = \Lambda_{\text{post}}^{-1}$ and posterior mean $\mu_{\text{post}} = \Lambda_{\text{post}}^{-1} \xi_{\text{post}}$.

**Given Data:**
- $\mu = [1, 2]^T, \Sigma = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.
- $H = [1, 0], R = 0.5, z = 3.0$.

**Step-by-Step Derivation:**
1. **Prior Information Form:**
   $$\det(\Sigma) = 2(2) - 1(1) = 3$$
   $$\Lambda = \Sigma^{-1} = \frac{1}{3} \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 2/3 & -1/3 \\ -1/3 & 2/3 \end{bmatrix}$$
   $$\xi = \Lambda \mu = \frac{1}{3} \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \frac{1}{3} \begin{bmatrix} 2(1) - 1(2) \\ -1(1) + 2(2) \end{bmatrix} = \frac{1}{3} \begin{bmatrix} 0 \\ 3 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$
2. **Measurement Information Contribution:**
   $$R^{-1} = \frac{1}{0.5} = 2.0$$
   $$H^T R^{-1} H = \begin{bmatrix} 1 \\ 0 \end{bmatrix} (2.0) \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 2 & 0 \\ 0 & 0 \end{bmatrix}$$
   $$H^T R^{-1} z = \begin{bmatrix} 1 \\ 0 \end{bmatrix} (2.0) (3.0) = \begin{bmatrix} 6.0 \\ 0.0 \end{bmatrix}$$
3. **Posterior Information Form:**
   $$\Lambda_{\text{post}} = \begin{bmatrix} 2/3 & -1/3 \\ -1/3 & 2/3 \end{bmatrix} + \begin{bmatrix} 2 & 0 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 8/3 & -1/3 \\ -1/3 & 2/3 \end{bmatrix}$$
   $$\xi_{\text{post}} = \begin{bmatrix} 0 \\ 1 \end{bmatrix} + \begin{bmatrix} 6 \\ 0 \end{bmatrix} = \begin{bmatrix} 6 \\ 1 \end{bmatrix}$$
4. **Recovering Standard Form:**
   $$\det(\Lambda_{\text{post}}) = \left(\frac{8}{3}\right)\left(\frac{2}{3}\right) - \left(-\frac{1}{3}\right)\left(-\frac{1}{3}\right) = \frac{16}{9} - \frac{1}{9} = \frac{15}{9} = \frac{5}{3}$$
   $$\Sigma_{\text{post}} = \Lambda_{\text{post}}^{-1} = \frac{3}{5} \begin{bmatrix} 2/3 & 1/3 \\ 1/3 & 8/3 \end{bmatrix} = \begin{bmatrix} 2/5 & 1/5 \\ 1/5 & 8/5 \end{bmatrix} = \begin{bmatrix} 0.4 & 0.2 \\ 0.2 & 1.6 \end{bmatrix}$$
   $$\mu_{\text{post}} = \Sigma_{\text{post}} \xi_{\text{post}} = \begin{bmatrix} 0.4 & 0.2 \\ 0.2 & 1.6 \end{bmatrix} \begin{bmatrix} 6 \\ 1 \end{bmatrix} = \begin{bmatrix} 0.4(6) + 0.2(1) \\ 0.2(6) + 1.6(1) \end{bmatrix} = \begin{bmatrix} 2.4 + 0.2 \\ 1.2 + 1.6 \end{bmatrix} = \begin{bmatrix} 2.6 \\ 2.8 \end{bmatrix}$$

**Final Answer:**
- Prior: $\Lambda = \begin{bmatrix} 2/3 & -1/3 \\ -1/3 & 2/3 \end{bmatrix}$, $\xi = [0, 1]^T$.
- Posterior: $\Lambda_{\text{post}} = \begin{bmatrix} 8/3 & -1/3 \\ -1/3 & 2/3 \end{bmatrix}$, $\xi_{\text{post}} = [6, 1]^T$.
- Standard form: $\Sigma_{\text{post}} = \begin{bmatrix} 0.4 & 0.2 \\ 0.2 & 1.6 \end{bmatrix}\text{ m}^2$, $\mu_{\text{post}} = [2.6, 2.8]^T$.

**Verification:**
Using standard Kalman update:
$S = H P H^T + R = 2.0 + 0.5 = 2.5$.
$K = P H^T S^{-1} = \begin{bmatrix} 2 \\ 1 \end{bmatrix} \frac{1}{2.5} = \begin{bmatrix} 0.8 \\ 0.4 \end{bmatrix}$.
$\mu_{\text{post}} = \mu + K(z - H\mu) = \begin{bmatrix} 1 \\ 2 \end{bmatrix} + \begin{bmatrix} 0.8 \\ 0.4 \end{bmatrix}(3 - 1) = \begin{bmatrix} 1 + 1.6 \\ 2 + 0.8 \end{bmatrix} = \begin{bmatrix} 2.6 \\ 2.8 \end{bmatrix}$.
$P_{\text{post}} = (I - K H) P = \begin{bmatrix} 0.2 & 0 \\ -0.4 & 1 \end{bmatrix} \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix} = \begin{bmatrix} 0.4 & 0.2 \\ 0.2 & 1.6 \end{bmatrix}$.
Information filter and standard Kalman filter yield the exact identical result.

---

### Section 2: Solved Exercises (Problems 1.11 – 1.20)

#### Problem 1.11: Normalization Constant of an $n$-Dimensional Gaussian
**Statement:**
Prove from first principles using multivariable calculus and orthogonal diagonalization that:
$$\int_{\mathbb{R}^n} \exp\left(-\frac{1}{2} (x - \mu)^T \Sigma^{-1} (x - \mu)\right) dx = (2\pi)^{n/2} |\Sigma|^{1/2}$$

**Given Data:**
- $\Sigma \in \mathbb{S}_{++}^n$.

**Step-by-Step Derivation:**
1. Substitute $y = x - \mu \implies dx = dy$. The integral is centered at zero:
   $$I = \int_{\mathbb{R}^n} \exp\left(-\frac{1}{2} y^T \Sigma^{-1} y\right) dy$$
2. Let $\Sigma = V \Lambda V^T$ with $V^T V = I$ and $\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$.
   Substitute $z = V^T y \implies y = V z$.
   The Jacobian of the orthogonal transformation is $|\det(V)| = 1 \implies dy = dz$.
3. The quadratic form becomes $y^T \Sigma^{-1} y = z^T V^T (V \Lambda^{-1} V^T) V z = z^T \Lambda^{-1} z = \sum_{i=1}^n \frac{z_i^2}{\lambda_i}$.
4. The integral factors into $n$ independent 1D Gaussian integrals:
   $$I = \int_{\mathbb{R}^n} \exp\left( -\frac{1}{2} \sum_{i=1}^n \frac{z_i^2}{\lambda_i} \right) dz = \prod_{i=1}^n \int_{-\infty}^\infty \exp\left( -\frac{z_i^2}{2\lambda_i} \right) dz_i$$
5. Using standard 1D Gaussian integral $\int_{-\infty}^\infty e^{-u^2/(2\sigma^2)} du = \sqrt{2\pi \sigma^2}$:
   $$\int_{-\infty}^\infty \exp\left( -\frac{z_i^2}{2\lambda_i} \right) dz_i = \sqrt{2\pi \lambda_i}$$
6. Taking the product:
   $$I = \prod_{i=1}^n \sqrt{2\pi \lambda_i} = (2\pi)^{n/2} \prod_{i=1}^n \sqrt{\lambda_i} = (2\pi)^{n/2} \sqrt{\prod_{i=1}^n \lambda_i} = (2\pi)^{n/2} \sqrt{\det(\Sigma)} = (2\pi)^{n/2} |\Sigma|^{1/2}$$

**Final Answer:**
- $I = (2\pi)^{n/2} |\Sigma|^{1/2}$ proven rigorously.

**Verification:**
Setting $n=1, \Sigma = \sigma^2$: $(2\pi)^{1/2} (\sigma^2)^{1/2} = \sqrt{2\pi} \sigma$, which is the familiar 1D normalizer.

---

#### Problem 1.12: Rotation of Confidence Ellipse Under Coordinate Transformation
**Statement:**
A 2D position vector $x \sim \mathcal{N}(0, \Sigma)$ has covariance $\Sigma = \operatorname{diag}(9, 1)$. 
The coordinate frame is rotated counter-clockwise by $\theta = 45^\circ$ ($R = \begin{bmatrix} \cos 45^\circ & -\sin 45^\circ \\ \sin 45^\circ & \cos 45^\circ \end{bmatrix}$).
Compute the rotated covariance matrix $\Sigma' = R \Sigma R^T$, its eigenvalues, and its off-diagonal correlation.

**Given Data:**
- $\Sigma = \begin{bmatrix} 9 & 0 \\ 0 & 1 \end{bmatrix}$, $R = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}$.

**Step-by-Step Derivation:**
1. Compute $R \Sigma$:
   $$R \Sigma = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} 9 & 0 \\ 0 & 1 \end{bmatrix} = \frac{1}{\sqrt{2}} \begin{bmatrix} 9 & -1 \\ 9 & 1 \end{bmatrix}$$
2. Compute $(R \Sigma) R^T$:
   $$\Sigma' = \frac{1}{\sqrt{2}} \begin{bmatrix} 9 & -1 \\ 9 & 1 \end{bmatrix} \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 9(1) - 1(-1) & 9(1) - 1(1) \\ 9(1) + 1(-1) & 9(1) + 1(1) \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 10 & 8 \\ 8 & 10 \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 4 & 5 \end{bmatrix}$$
3. Eigenvalues of $\Sigma'$:
   Because $R$ is an orthogonal rotation matrix ($R \in SO(2)$), a similarity transformation preserves eigenvalues!
   $$\lambda_1 = 9, \quad \lambda_2 = 1$$
   Indeed: $\det(\Sigma' - \lambda I) = (5 - \lambda)^2 - 16 = 0 \implies 5 - \lambda = \pm 4 \implies \lambda = 9, 1$.
4. Correlation coefficient:
   $$\rho = \frac{\Sigma'_{12}}{\sqrt{\Sigma'_{11} \Sigma'_{22}}} = \frac{4}{\sqrt{5 \times 5}} = \frac{4}{5} = 0.8$$

**Final Answer:**
- $\Sigma' = \begin{bmatrix} 5 & 4 \\ 4 & 5 \end{bmatrix}$.
- Eigenvalues: $\lambda_1 = 9, \lambda_2 = 1$ (invariant under rotation).
- Correlation: $\rho = 0.8$.

**Verification:**
Trace: $5 + 5 = 10 = 9 + 1$. Determinant: $5(5) - 4(4) = 25 - 16 = 9 = 9(1)$. Both spectral invariants strictly conserved.

---

#### Problem 1.13: Chi-Square 99% Gating Threshold for 3D Drone Tracking
**Statement:**
In a 3D drone positioning system ($n = 3$), a measurement innovation vector $y = z - H \hat{x} \in \mathbb{R}^3$ has residual covariance $S \in \mathbb{R}^{3 \times 3}$.
Using the Chi-Square distribution with 3 degrees of freedom:
1. State the exact integral expression for the cumulative probability $P(D_M^2 \le \gamma) = 0.99$.
2. Verify that the critical threshold is $\gamma_{0.99} = 11.345$.
3. For an observed residual with $D_M^2 = 12.1$, state the statistical hypothesis testing decision.

**Given Data:**
- $n = 3$, significance level $\alpha = 0.01 \implies 1 - \alpha = 0.99$.

**Step-by-Step Derivation:**
1. The Chi-square PDF for $n = 3$ is:
   $$f(u) = \frac{1}{2^{3/2} \Gamma(3/2)} u^{1/2} e^{-u/2} = \frac{1}{\sqrt{2\pi}} u^{1/2} e^{-u/2}$$
   The cumulative distribution function is:
   $$F(\gamma) = \int_0^\gamma \frac{1}{\sqrt{2\pi}} u^{1/2} e^{-u/2} du = 2\Phi(\sqrt{\gamma}) - 1 - \sqrt{\frac{2\gamma}{\pi}} e^{-\gamma/2} = 0.99$$
2. Evaluating at $\gamma = 11.345$:
   $\sqrt{\gamma} = \sqrt{11.345} \approx 3.3682$.
   From standard normal tables: $\Phi(3.3682) \approx 0.99962$.
   $2\Phi(3.3682) - 1 = 2(0.99962) - 1 = 0.99924$.
   $e^{-\gamma/2} = e^{-5.6725} \approx 0.003439$.
   $\sqrt{\frac{2(11.345)}{\pi}} \times 0.003439 = \sqrt{7.2224} \times 0.003439 = 2.6874 \times 0.003439 \approx 0.00924$.
   $F(11.345) = 0.99924 - 0.00924 = 0.99000$.
3. Decision rule:
   Observed $D_M^2 = 12.1 > \gamma_{0.99} = 11.345$.
   Reject null hypothesis: the measurement is deemed a statistically significant outlier at the $1\%$ significance level and rejected from the Kalman update.

**Final Answer:**
- Critical threshold: $\gamma_{0.99} \approx 11.345$.
- Decision: Reject measurement as spurious outlier ($12.1 > 11.345$).

**Verification:**
Matches standard statistical tables for $\chi^2(3)$ at $p = 0.99$.

---

#### Problem 1.14: Marginal vs Conditional Independence in Joint Gaussians
**Statement:**
Let $x_1, x_2, x_3$ be zero-mean jointly Gaussian variables with covariance:
$$\Sigma = \begin{bmatrix} 1.0 & 0.8 & 0.0 \\ 0.8 & 2.0 & 0.6 \\ 0.0 & 0.6 & 1.0 \end{bmatrix}$$
1. Are $x_1$ and $x_3$ marginally independent? Justify.
2. Compute the information matrix $\Lambda = \Sigma^{-1}$.
3. Are $x_1$ and $x_3$ conditionally independent given $x_2$? Justify.

**Given Data:**
- $\Sigma_{13} = 0.0$.

**Step-by-Step Derivation:**
1. **Marginal Independence:**
   For jointly Gaussian variables, zero covariance implies independence.
   Since $\Sigma_{13} = \operatorname{Cov}(x_1, x_3) = 0$, $x_1$ and $x_3$ are marginally independent ($p(x_1, x_3) = p(x_1)p(x_3)$).
2. **Information Matrix $\Lambda = \Sigma^{-1}$:**
   Compute determinant via cofactor expansion along row 1:
   $$\det(\Sigma) = 1.0(2.0 \times 1.0 - 0.6^2) - 0.8(0.8 \times 1.0 - 0) + 0 = (2.0 - 0.36) - 0.8(0.8) = 1.64 - 0.64 = 1.00$$
   Compute entry $\Lambda_{13}$:
   $$\Lambda_{13} = \frac{(-1)^{1+3} M_{31}}{\det(\Sigma)} = \frac{1}{1.0} \det\begin{bmatrix} 0.8 & 0.0 \\ 2.0 & 0.6 \end{bmatrix} = 0.8(0.6) - 0 = 0.48$$
3. **Conditional Independence:**
   In a Gaussian graphical model, variables $x_i$ and $x_j$ are conditionally independent given all other variables if and only if the corresponding entry of the precision/information matrix is zero: $\Lambda_{ij} = 0$.
   Here, $\Lambda_{13} = 0.48 \neq 0$.
   Therefore, conditioning on $x_2$ induces an active correlation between $x_1$ and $x_3$ (explaining away effect). They are **not** conditionally independent.

**Final Answer:**
- Marginally independent: Yes ($\Sigma_{13} = 0$).
- Information matrix entry: $\Lambda_{13} = 0.48$.
- Conditionally independent given $x_2$: No ($\Lambda_{13} \neq 0$).

**Verification:**
Conditional covariance: $\Sigma_{13|2} = \Sigma_{13} - \Sigma_{12} \Sigma_{22}^{-1} \Sigma_{23} = 0 - \frac{0.8 \times 0.6}{2.0} = -\frac{0.48}{2.0} = -0.24 \neq 0$. Conditioning on $x_2$ creates negative correlation $-0.24$.

---

#### Problem 1.15: Product of Two Gaussian Probability Density Functions
**Statement:**
Prove analytically that the product of two Gaussian probability density functions $p_1(x) = \mathcal{N}(\mu_1, \sigma_1^2)$ and $p_2(x) = \mathcal{N}(\mu_2, \sigma_2^2)$ is an unnormalized Gaussian density:
$$p_1(x) p_2(x) = S_{12} \cdot \frac{1}{\sqrt{2\pi \sigma_{\text{prod}}^2}} \exp\left(-\frac{(x - \mu_{\text{prod}})^2}{2\sigma_{\text{prod}}^2}\right)$$
Find the expressions for $\sigma_{\text{prod}}^2$, $\mu_{\text{prod}}$, and the scaling factor $S_{12}$.

**Given Data:**
- $p_1(x) = \frac{1}{\sqrt{2\pi}\sigma_1} e^{-(x-\mu_1)^2/(2\sigma_1^2)}$, $p_2(x) = \frac{1}{\sqrt{2\pi}\sigma_2} e^{-(x-\mu_2)^2/(2\sigma_2^2)}$.

**Step-by-Step Derivation:**
1. Multiply the exponential terms:
   $$E = \frac{(x - \mu_1)^2}{2\sigma_1^2} + \frac{(x - \mu_2)^2}{2\sigma_2^2} = \frac{1}{2} \left[ x^2 \left(\frac{1}{\sigma_1^2} + \frac{1}{\sigma_2^2}\right) - 2x \left(\frac{\mu_1}{\sigma_1^2} + \frac{\mu_2}{\sigma_2^2}\right) + \frac{\mu_1^2}{\sigma_1^2} + \frac{\mu_2^2}{\sigma_2^2} \right]$$
2. Define precision terms:
   $$\frac{1}{\sigma_{\text{prod}}^2} = \frac{1}{\sigma_1^2} + \frac{1}{\sigma_2^2} = \frac{\sigma_1^2 + \sigma_2^2}{\sigma_1^2 \sigma_2^2} \implies \sigma_{\text{prod}}^2 = \frac{\sigma_1^2 \sigma_2^2}{\sigma_1^2 + \sigma_2^2}$$
   $$\mu_{\text{prod}} = \sigma_{\text{prod}}^2 \left(\frac{\mu_1}{\sigma_1^2} + \frac{\mu_2}{\sigma_2^2}\right) = \frac{\sigma_2^2 \mu_1 + \sigma_1^2 \mu_2}{\sigma_1^2 + \sigma_2^2}$$
3. Completing the square for $x$:
   $$\frac{(x - \mu_{\text{prod}})^2}{\sigma_{\text{prod}}^2} = x^2 \left(\frac{1}{\sigma_1^2} + \frac{1}{\sigma_2^2}\right) - 2x \left(\frac{\mu_1}{\sigma_1^2} + \frac{\mu_2}{\sigma_2^2}\right) + \frac{\mu_{\text{prod}}^2}{\sigma_{\text{prod}}^2}$$
4. The remaining constant term in the exponent is:
   $$\Delta = \frac{\mu_1^2}{\sigma_1^2} + \frac{\mu_2^2}{\sigma_2^2} - \frac{\mu_{\text{prod}}^2}{\sigma_{\text{prod}}^2} = \frac{(\mu_1 - \mu_2)^2}{\sigma_1^2 + \sigma_2^2}$$
5. The scale factor is:
   $$S_{12} = \frac{1}{\sqrt{2\pi(\sigma_1^2 + \sigma_2^2)}} \exp\left( -\frac{(\mu_1 - \mu_2)^2}{2(\sigma_1^2 + \sigma_2^2)} \right)$$

**Final Answer:**
- $\sigma_{\text{prod}}^2 = \frac{\sigma_1^2 \sigma_2^2}{\sigma_1^2 + \sigma_2^2}$.
- $\mu_{\text{prod}} = \frac{\sigma_2^2 \mu_1 + \sigma_1^2 \mu_2}{\sigma_1^2 + \sigma_2^2}$.
- Scaling constant $S_{12} = \mathcal{N}(\mu_1; \mu_2, \sigma_1^2 + \sigma_2^2)$.

**Verification:**
This proves why Bayesian update with Gaussian prior and Gaussian likelihood produces another Gaussian, and identifies the marginal likelihood $p(z) = S_{12}$.

---

#### Problem 1.16: Entropy of a Multivariate Gaussian Distribution
**Statement:**
The differential entropy of a continuous probability density $p(x)$ is defined as $H(x) = -\int_{\mathbb{R}^n} p(x) \ln p(x) dx$.
Prove that for an $n$-dimensional Gaussian $x \sim \mathcal{N}(\mu, \Sigma)$, the entropy is:
$$H(x) = \frac{1}{2} \ln\left( (2\pi e)^n \det(\Sigma) \right)$$
Compute $H(x)$ for $\Sigma = \operatorname{diag}(1, 1)$ versus $\Sigma = \operatorname{diag}(4, 4)$ in nats.

**Given Data:**
- $p(x) = (2\pi)^{-n/2} |\Sigma|^{-1/2} \exp\left(-\frac{1}{2}(x-\mu)^T \Sigma^{-1}(x-\mu)\right)$.

**Step-by-Step Derivation:**
1. Take natural logarithm of $p(x)$:
   $$\ln p(x) = -\frac{n}{2}\ln(2\pi) - \frac{1}{2}\ln|\Sigma| - \frac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu)$$
2. Compute expectation:
   $$H(x) = -\mathbb{E}[\ln p(x)] = \frac{n}{2}\ln(2\pi) + \frac{1}{2}\ln|\Sigma| + \frac{1}{2} \mathbb{E}\left[ (x - \mu)^T \Sigma^{-1} (x - \mu) \right]$$
3. Use the trace trick for quadratic forms:
   $$\mathbb{E}\left[ (x - \mu)^T \Sigma^{-1} (x - \mu) \right] = \mathbb{E}\left[ \operatorname{tr}\left(\Sigma^{-1} (x - \mu)(x - \mu)^T\right) \right] = \operatorname{tr}\left( \Sigma^{-1} \mathbb{E}[(x-\mu)(x-\mu)^T] \right) = \operatorname{tr}(\Sigma^{-1} \Sigma) = \operatorname{tr}(I_n) = n$$
4. Substitute $n$ back into entropy:
   $$H(x) = \frac{n}{2}\ln(2\pi) + \frac{1}{2}\ln|\Sigma| + \frac{n}{2} = \frac{1}{2} \left[ n\ln(2\pi) + n\ln(e) + \ln|\Sigma| \right] = \frac{1}{2}\ln\left( (2\pi e)^n \det(\Sigma) \right)$$
5. Numerical Evaluation ($n = 2$):
   - Case 1: $\Sigma = \operatorname{diag}(1, 1) \implies \det(\Sigma) = 1$:
     $$H_1 = \frac{1}{2}\ln((2\pi e)^2 \cdot 1) = \ln(2\pi e) = \ln(2 \times 3.14159 \times 2.71828) = \ln(17.0795) \approx 2.8379\text{ nats}$$
   - Case 2: $\Sigma = \operatorname{diag}(4, 4) \implies \det(\Sigma) = 16$:
     $$H_2 = \frac{1}{2}\ln((2\pi e)^2 \cdot 16) = H_1 + \frac{1}{2}\ln(16) = 2.8379 + \frac{1}{2}(2.7726) = 2.8379 + 1.3863 = 4.2242\text{ nats}$$

**Final Answer:**
- Formula proven: $H(x) = \frac{1}{2}\ln((2\pi e)^n \det(\Sigma))$.
- Entropy for $\Sigma = I_2$: $\approx 2.838\text{ nats}$.
- Entropy for $\Sigma = 4 I_2$: $\approx 4.224\text{ nats}$ ($\Delta H = \ln(4) \approx 1.386\text{ nats}$).

**Verification:**
Scaling all standard deviations by 2 increases volume by $2^2 = 4$, adding exactly $\ln(4)$ to the entropy.

---

#### Problem 1.17: Cross-Covariance Under Linear Feedback Control
**Statement:**
A robotic cart state is $x \sim \mathcal{N}(\mu_x, \Sigma_{xx})$. A linear feedback control law is applied: $u = -K x$. 
Compute the joint covariance matrix of the state $x$ and control $u$:
$$\Sigma_{\text{joint}} = \operatorname{Cov}\left( \begin{bmatrix} x \\ u \end{bmatrix} \right)$$
and show that $\det(\Sigma_{\text{joint}}) = 0$.

**Given Data:**
- $u = -K x$, $\Sigma_{xx} \in \mathbb{S}_{++}^n$.

**Step-by-Step Derivation:**
1. Express joint vector as linear transformation of $x$:
   $$\begin{bmatrix} x \\ u \end{bmatrix} = \begin{bmatrix} I_n \\ -K \end{bmatrix} x$$
2. Let $T = \begin{bmatrix} I_n \\ -K \end{bmatrix} \in \mathbb{R}^{2n \times n}$.
   Using the linear transformation theorem:
   $$\Sigma_{\text{joint}} = T \Sigma_{xx} T^T = \begin{bmatrix} I_n \\ -K \end{bmatrix} \Sigma_{xx} \begin{bmatrix} I_n & -K^T \end{bmatrix} = \begin{bmatrix} \Sigma_{xx} & -\Sigma_{xx} K^T \\ -K \Sigma_{xx} & K \Sigma_{xx} K^T \end{bmatrix}$$
3. Determinant evaluation:
   Using Schur complement formula for partitioned block matrix:
   $$\det\begin{bmatrix} A & B \\ C & D \end{bmatrix} = \det(A) \det(D - C A^{-1} B)$$
   Here:
   $$D - C A^{-1} B = K \Sigma_{xx} K^T - (-K \Sigma_{xx}) \Sigma_{xx}^{-1} (-\Sigma_{xx} K^T) = K \Sigma_{xx} K^T - K \Sigma_{xx} K^T = 0_{n \times n}$$
   Therefore:
   $$\det(\Sigma_{\text{joint}}) = \det(\Sigma_{xx}) \det(0) = 0$$

**Final Answer:**
- Joint covariance: $\Sigma_{\text{joint}} = \begin{bmatrix} \Sigma_{xx} & -\Sigma_{xx} K^T \\ -K \Sigma_{xx} & K \Sigma_{xx} K^T \end{bmatrix}$.
- $\det(\Sigma_{\text{joint}}) = 0$ (deterministic linear dependency between state and control).

**Verification:**
Because $u$ is completely determined by $x$, the conditional variance $\Sigma_{u|x} = 0$, confirming zero residual entropy.

---

#### Problem 1.18: Confidence Intervals for 1D, 2D, and 3D State Bounds
**Statement:**
In robotic safety validation, engineers must construct bounding boxes that contain at least $99\%$ of the robot's positional uncertainty.
Compute the required Mahalanobis radius $c$ for:
1. A 1D prismatic rail ($n = 1$).
2. A 2D planar mobile robot ($n = 2$).
3. A 3D aerial manipulator ($n = 3$).

**Given Data:**
- Confidence level $P = 0.99$.

**Step-by-Step Derivation:**
1. **Case $n = 1$:**
   $P(-c \le Z \le c) = 2\Phi(c) - 1 = 0.99 \implies \Phi(c) = 0.995$.
   From standard normal quantile function:
   $$c = \Phi^{-1}(0.995) \approx 2.5758$$
2. **Case $n = 2$:**
   In 2D, the Chi-square CDF is exponential:
   $$F_{\chi^2(2)}(c^2) = 1 - e^{-c^2/2} = 0.99$$
   $$e^{-c^2/2} = 0.01 \implies -\frac{c^2}{2} = \ln(0.01) = -4.60517$$
   $$c^2 = 2 \times 4.60517 = 9.21034$$
   $$c = \sqrt{9.21034} \approx 3.0349$$
3. **Case $n = 3$:**
   From Problem 1.13, $\chi^2(3)$ quantile at $0.99$:
   $$c^2 = 11.3449 \implies c = \sqrt{11.3449} \approx 3.3682$$

**Final Answer:**
- 1D Rail: $c \approx 2.576\sigma$.
- 2D Planar: $c \approx 3.035\sigma$.
- 3D Spatial: $c \approx 3.368\sigma$.

**Verification:**
As dimension increases, the probability mass shifts further away from the origin due to the $r^{n-1}$ hyperspherical surface area element, requiring progressively larger sigma multipliers to capture $99\%$.

---

#### Problem 1.19: Conditioning on Correlated Noise Measurement
**Statement:**
A true scalar state $x \sim \mathcal{N}(0, \sigma_x^2)$ with $\sigma_x^2 = 10$ is observed via $z = x + v$.
The sensor noise $v$ is correlated with the state itself: $\mathbb{E}[x v] = \sigma_{xv} = 2.0$, and has noise variance $\sigma_v^2 = 5.0$.
1. Compute the variance of the measurement $\operatorname{Var}(z)$.
2. Compute the cross-covariance $\operatorname{Cov}(x, z)$.
3. Evaluate the conditional mean $\mathbb{E}[x | z]$ and conditional variance $\operatorname{Var}(x | z)$.

**Given Data:**
- $\sigma_x^2 = 10, \sigma_v^2 = 5, \sigma_{xv} = 2.0$.

**Step-by-Step Derivation:**
1. **Measurement Variance:**
   $$\operatorname{Var}(z) = \operatorname{Var}(x + v) = \operatorname{Var}(x) + \operatorname{Var}(v) + 2\operatorname{Cov}(x, v) = 10.0 + 5.0 + 2(2.0) = 19.0$$
2. **Cross-Covariance:**
   $$\operatorname{Cov}(x, z) = \mathbb{E}[x(x + v)] = \mathbb{E}[x^2] + \mathbb{E}[x v] = \sigma_x^2 + \sigma_{xv} = 10.0 + 2.0 = 12.0$$
3. **Conditional Mean and Variance:**
   $$\mathbb{E}[x | z] = \mu_x + \frac{\operatorname{Cov}(x, z)}{\operatorname{Var}(z)} (z - \mu_z) = 0 + \frac{12.0}{19.0} z \approx 0.63158 z$$
   $$\operatorname{Var}(x | z) = \operatorname{Var}(x) - \frac{(\operatorname{Cov}(x, z))^2}{\operatorname{Var}(z)} = 10.0 - \frac{12.0^2}{19.0} = 10.0 - \frac{144.0}{19.0} = 10.0 - 7.57895 = 2.42105$$

**Final Answer:**
- $\operatorname{Var}(z) = 19.0$.
- $\operatorname{Cov}(x, z) = 12.0$.
- $\mathbb{E}[x | z] = \frac{12}{19} z \approx 0.632 z$.
- $\operatorname{Var}(x | z) = \frac{46}{19} \approx 2.421$.

**Verification:**
If noise were uncorrelated, $\operatorname{Var}(x | z) = 10 - 100/15 = 10 - 6.67 = 3.33$. The positive correlation between state and noise provides extra information, reducing posterior variance to $2.421$.

---

#### Problem 1.20: Synthesis of Maximum A Posteriori (MAP) and Minimum Mean Squared Error (MMSE)
**Statement:**
Prove that for any multivariate Gaussian distribution $p(x | z) = \mathcal{N}(\mu_{x|z}, \Sigma_{x|z})$, the Maximum A Posteriori (MAP) estimator $\hat{x}_{\text{MAP}} = \arg\max_x p(x | z)$ and the Minimum Mean Squared Error (MMSE) estimator $\hat{x}_{\text{MMSE}} = \mathbb{E}[x | z]$ are identically equal to $\mu_{x|z}$.

**Given Data:**
- Posterior distribution $p(x | z) = (2\pi)^{-n/2} |\Sigma|^{-1/2} \exp\left(-\frac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu)\right)$ where $\mu = \mu_{x|z}, \Sigma = \Sigma_{x|z}$.

**Step-by-Step Derivation:**
1. **MMSE Estimator:**
   The MMSE estimator minimizes the expected quadratic loss $L(\hat{x}) = \mathbb{E}[\|x - \hat{x}\|^2 | z]$.
   Differentiating with respect to $\hat{x}$:
   $$\frac{\partial}{\partial \hat{x}} \mathbb{E}\left[ (x - \hat{x})^T (x - \hat{x}) \,\middle|\, z \right] = -2 \mathbb{E}[x - \hat{x} | z] = -2 (\mathbb{E}[x | z] - \hat{x}) = 0$$
   $$\hat{x}_{\text{MMSE}} = \mathbb{E}[x | z] = \mu_{x|z}$$
2. **MAP Estimator:**
   The MAP estimator maximizes the posterior PDF, or equivalently minimizes the negative log-posterior:
   $$J(x) = -\ln p(x | z) = \frac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu) + \text{constant}$$
   Differentiating with respect to $x$:
   $$\nabla_x J(x) = \Sigma^{-1}(x - \mu) = 0$$
   Since $\Sigma$ is non-singular ($\det(\Sigma) > 0$), multiplying by $\Sigma$:
   $$x - \mu = 0 \implies \hat{x}_{\text{MAP}} = \mu = \mu_{x|z}$$
3. **Equivalence:**
   $$\hat{x}_{\text{MAP}} \equiv \hat{x}_{\text{MMSE}} \equiv \mu_{x|z}$$

**Final Answer:**
- For linear Gaussian systems, the mode (MAP) and mean (MMSE) coincide exactly.
- Both estimators yield $\hat{x} = \mu_{x|z}$.

**Verification:**
The Gaussian distribution is symmetric and unimodal around its mean $\mu$. For any symmetric unimodal distribution, the mean, median, and mode are mathematically identical.
