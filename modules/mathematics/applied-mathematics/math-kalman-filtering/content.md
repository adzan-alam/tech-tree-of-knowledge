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


---

# Chapter 2: The Philosophy of Estimation — Hidden True States, Noisy Sensors, and Naive Dead-Reckoning Drift

Every robotic system that moves through physical space operates under a fundamental epistemic veil: the controller can never directly perceive the true physical state of the universe. Instead, it must infer that state through an imperfect array of physical transducers—MEMS accelerometers, vibrating structure gyroscopes, optical wheel encoders, time-of-flight rangefinders, and GNSS receivers.

When an autonomous system attempts to maintain its belief about position purely by integrating internal proprioceptive signals—a process known as **dead-reckoning**—it encounters a ruthless law of stochastic calculus: **entropy accumulates monotonically**. Without external reference corrections, sensor noise, calibration offsets, and unmodeled friction combine to produce unbounded tracking drift. This chapter establishes the mathematical mechanisms of state propagation, stochastic drift, and the fundamental imperative for recursive Bayesian filtering.

---

## 2.1 State-Space Representations: Truth, Control, and Observations

A dynamical physical system is characterized by a latent (hidden) state vector $x(t) \in \mathbb{R}^n$, an active control input vector $u(t) \in \mathbb{R}^p$, and an observable measurement vector $z(t) \in \mathbb{R}^m$.

```
                       Stochastic Disturbance w(t)
                                 |
                                 v
 Control u(t) ---> [ Physical Dynamics x_dot = f(x, u, w) ] ---> True State x(t)
                                                                       |
                                                                       v
                            Sensor Noise v(t) -----------> [ Sensor h(x, v) ]
                                                                       |
                                                                       v
                                                           Observation z(t)
```

### 2.1.1 Continuous-Time Formulation
In continuous time, physical motion is governed by stochastic differential equations (SDEs) driven by continuous white noise:
$$\dot{x}(t) = f(x(t), u(t), t) + G(t) w_c(t)$$
$$z(t) = h(x(t), t) + v_c(t)$$
where:
- $w_c(t) \in \mathbb{R}^q$ is continuous zero-mean Gaussian white process noise with spectral density $Q_c(t)$:
  $$\mathbb{E}[w_c(t)] = 0, \quad \mathbb{E}[w_c(t) w_c^T(\tau)] = Q_c(t) \delta(t - \tau)$$
- $v_c(t) \in \mathbb{R}^m$ is continuous zero-mean Gaussian white measurement noise with spectral density $R_c(t)$:
  $$\mathbb{E}[v_c(t)] = 0, \quad \mathbb{E}[v_c(t) v_c^T(\tau)] = R_c(t) \delta(t - \tau)$$
- $\delta(t - \tau)$ is the Dirac delta generalized function.

### 2.1.2 Discrete-Time Formulation
Microcontrollers and flight computers execute at discrete sampling intervals $t_k = k \Delta t$. Integrating the continuous dynamics across the time step $[t_{k-1}, t_k]$ yields the discrete-time stochastic difference equations:

$$x_k = f_k(x_{k-1}, u_{k-1}) + w_k$$
$$z_k = h_k(x_k) + v_k$$

where the discrete noise sequences are white, zero-mean, and uncorrelated across time:
$$\mathbb{E}[w_k] = 0, \quad \mathbb{E}[w_j w_k^T] = Q_k \delta_{jk}$$
$$\mathbb{E}[v_k] = 0, \quad \mathbb{E}[v_j v_k^T] = R_k \delta_{jk}$$
$$\mathbb{E}[w_j v_k^T] = 0 \quad \forall j, k$$
Here $\delta_{jk}$ is the Kronecker delta ($\delta_{jk} = 1$ if $j=k$, and $0$ otherwise).

---

## 2.2 The Mechanics of Dead-Reckoning Drift

Dead-reckoning is the process of estimating one's current position by projecting forward from a previously known position using measured speed, acceleration, or wheel rotations.

### 2.2.1 1D Random Walk: The Velocity Integration Problem
Consider a 1D autonomous ground vehicle whose forward velocity $v_k$ is measured by a wheel encoder or tachometer:
$$z_{v,k} = v_k + \eta_k$$
where $\eta_k \sim \mathcal{N}(0, \sigma_v^2)$ is discrete zero-mean white noise with variance $\sigma_v^2$.
The vehicle estimates its position by discrete integration with time step $\Delta t$:
$$\hat{p}_k = \hat{p}_{k-1} + z_{v,k} \Delta t = \hat{p}_0 + \Delta t \sum_{i=1}^k (v_i + \eta_i) = \left( p_0 + \Delta t \sum_{i=1}^k v_i \right) + \Delta t \sum_{i=1}^k \eta_i$$
The true position is $p_k = p_0 + \Delta t \sum_{i=1}^k v_i$. The estimation error is:
$$e_k = \hat{p}_k - p_k = \Delta t \sum_{i=1}^k \eta_i$$

Taking the mathematical expectation:
$$\mathbb{E}[e_k] = \Delta t \sum_{i=1}^k \mathbb{E}[\eta_i] = 0 \quad \text{(The estimator is nominally unbiased)}$$
However, evaluating the variance of the error accumulated after $k$ steps ($t = k \Delta t$):
$$\sigma_{p,k}^2 = \mathbb{E}[e_k^2] = \Delta t^2 \mathbb{E}\left[ \left( \sum_{i=1}^k \eta_i \right)^2 \right] = \Delta t^2 \sum_{i=1}^k \mathbb{E}[\eta_i^2] = \Delta t^2 (k \sigma_v^2) = (k \Delta t) (\sigma_v^2 \Delta t) = t \cdot (\sigma_v^2 \Delta t)$$

Taking the standard deviation:
$$\sigma_{p}(t) = \sigma_v \sqrt{\Delta t} \cdot \sqrt{t} \propto \sqrt{t}$$

This is the classic **Brownian Motion / Random Walk** result:
- After 1 minute ($60\text{ s}$), position uncertainty grows by $\sqrt{60} \approx 7.75\times$.
- After 1 hour ($3600\text{ s}$), position uncertainty grows by $\sqrt{3600} = 60\times$.
- As $t \to \infty$, $\sigma_p(t) \to \infty$. **Uncertainty is unbounded.**

```
 Position Uncertainty \sigma_p(t)
        ^
        |                                       . - ~ ~ (Random Walk ~ sqrt(t))
        |                             . - ~ ~
        |                    . - ~ ~
        |             . - ~
        |       . - ~
        | . - ~
        +----------------------------------------------------> Time t
```

---

## 2.3 IMU Accelerometer Double Integration and Cubic Drift

In aerospace vehicles, submarines, and drones, GPS/GNSS signals are frequently unavailable or jammed. The navigation system must rely on an **Inertial Measurement Unit (IMU)** consisting of tri-axial accelerometers and gyroscopes.

Accelerometers measure specific force $f(t) = a(t) - g$. Position is obtained by double integrating the measured acceleration:
$$\hat{a}(t) = a(t) + b_a(t) + \eta_a(t)$$
where:
1. $a(t)$ is the true kinematic acceleration.
2. $b_a(t)$ is the **sensor bias** (an unknown, slowly drifting offset caused by temperature and mechanical stress).
3. $\eta_a(t)$ is Gaussian white noise with spectral density $S_a = \sigma_a^2$.

### 2.3.1 Impact of Accelerometer White Noise
Assume momentarily that the bias is perfectly calibrated ($b_a = 0$), leaving only white noise $\eta_a(t)$.
Velocity is obtained by single integration:
$$v(t) = v(0) + \int_0^t (a(\tau) + \eta_a(\tau)) d\tau \implies e_v(t) = \int_0^t \eta_a(\tau) d\tau$$
Position is obtained by double integration:
$$p(t) = p(0) + \int_0^t v(\tau) d\tau = p(0) + \int_0^t \left( v(0) + \int_0^\tau (a(s) + \eta_a(s)) ds \right) d\tau$$
The position error due to noise is:
$$e_p(t) = \int_0^t \int_0^\tau \eta_a(s) \, ds \, d\tau$$
Applying integration by parts or Cauchy's formula for repeated integration:
$$e_p(t) = \int_0^t (t - \tau) \eta_a(\tau) d\tau$$

The variance of position error is:
$$\mathbb{E}[e_p^2(t)] = \mathbb{E}\left[ \left( \int_0^t (t - \tau) \eta_a(\tau) d\tau \right) \left( \int_0^t (t - s) \eta_a(s) ds \right) \right]$$
Using the continuous white noise property $\mathbb{E}[\eta_a(\tau) \eta_a(s)] = S_a \delta(\tau - s)$:
$$\mathbb{E}[e_p^2(t)] = \int_0^t \int_0^t (t - \tau)(t - s) S_a \delta(\tau - s) \, d\tau \, ds = S_a \int_0^t (t - \tau)^2 d\tau$$
Evaluating the integral:
$$\int_0^t (t - \tau)^2 d\tau = \left[ -\frac{(t - \tau)^3}{3} \right]_0^t = 0 - \left( -\frac{t^3}{3} \right) = \frac{t^3}{3}$$

Therefore, the position variance under accelerometer white noise is:
$$\sigma_p^2(t) = \frac{1}{3} S_a t^3 \implies \sigma_p(t) = \sqrt{\frac{S_a}{3}} \, t^{3/2} \propto t^{1.5}$$

### 2.3.2 Impact of Constant Accelerometer Bias
Now consider a constant, uncalibrated accelerometer bias $b_a \neq 0$:
$$\hat{a}(t) = a(t) + b_a$$
Integrating twice with respect to time:
$$e_v(t) = \int_0^t b_a \, d\tau = b_a t$$
$$e_p(t) = \int_0^t e_v(\tau) d\tau = \int_0^t b_a \tau \, d\tau = \frac{1}{2} b_a t^2$$

The position error caused by constant accelerometer bias explodes **quadratically** with time:
$$e_p(t) \propto t^2$$

> [!CAUTION]
> **The Catastrophic Reality of Consumer MEMS IMUs:**
> Consider a standard commercial drone MEMS accelerometer with a tiny residual bias of $b_a = 0.05\text{ m/s}^2$ (roughly $5\text{ mg}$, common in smartphones and consumer drones).
> - After $t = 10\text{ s}$: $e_p = \frac{1}{2}(0.05)(10)^2 = 2.5\text{ m}$.
> - After $t = 60\text{ s}$ (1 minute): $e_p = \frac{1}{2}(0.05)(60)^2 = 90\text{ m}$!
> - After $t = 300\text{ s}$ (5 minutes): $e_p = \frac{1}{2}(0.05)(300)^2 = 2,250\text{ m} = 2.25\text{ km}$!
> Within five minutes, dead-reckoning reports that the drone is miles away from its true location. Without sensor fusion, open-loop inertial navigation is suicidal.

---

## 2.4 Gyroscope Bias and Angular Orientation Drift

Position integration depends fundamentally on having an accurate orientation estimate to rotate accelerometer measurements from the sensor body frame into the navigation world frame:
$$a_{\text{world}}(t) = R_{\text{body}}^{\text{world}}(t) a_{\text{body}}(t) - g_{\text{world}}$$
A tri-axial gyroscope measures angular velocity $\omega(t)$.
Like accelerometers, gyroscopes suffer from rate bias $b_g$:
$$\hat{\omega}(t) = \omega(t) + b_g + \eta_g(t)$$
Integrating angular rate to obtain heading angle $\theta(t)$:
$$e_\theta(t) = b_g t + \int_0^t \eta_g(\tau) d\tau$$
A constant gyro bias $b_g$ induces a linear heading error $e_\theta(t) = b_g t$.

### 2.4.1 The Gravity Leakage Disaster
When the estimated roll or pitch angle drifts by small angle $\delta\theta$, the gravity compensation vector $g_{\text{world}} = [0, 0, -9.81]^T\text{ m/s}^2$ is incorrectly rotated.
The tilt error leaks a component of gravity into the horizontal plane:
$$a_{\text{horizontal, error}} = g \sin(\delta\theta) \approx g \cdot \delta\theta = g \cdot (b_g t)$$
Integrating this false horizontal acceleration once yields velocity error:
$$e_v(t) = \int_0^t g b_g \tau \, d\tau = \frac{1}{2} g b_g t^2$$
Integrating again yields horizontal position error:
$$e_p(t) = \int_0^t \frac{1}{2} g b_g \tau^2 d\tau = \frac{1}{6} g b_g t^3$$

> [!WARNING]
> Because of **gravity leakage**, an uncorrected gyroscope bias causes horizontal position drift that scales as $t^3$ (cubic in time)!
> If a drone gyro has a tiny bias of $0.1^\circ/\text{s} = 0.001745\text{ rad/s}$:
> After $60\text{ s}$: $e_p = \frac{1}{6}(9.81)(0.001745)(60)^3 \approx 616\text{ meters}$!
> Gyroscope errors are far more lethal to navigation than accelerometer errors because they weaponize the Earth's gravitational acceleration against the state estimator.

---

## 2.5 The Philosophical Imperative for Sensor Fusion

The mathematical realities established above dictate a fundamental operational duality:

```
+------------------------------------+------------------------------------+
|  PROPRIOCEPTIVE / INERTIAL SENSORS | EXTEROCEPTIVE / ABSOLUTE SENSORS   |
|  (IMU, Encoders, Gyros)            | (GPS, Camera, LiDAR, Landmarks)    |
+------------------------------------+------------------------------------+
| High bandwidth (100 Hz - 2000 Hz)  | Low bandwidth (1 Hz - 30 Hz)       |
| Low latency (< 1 ms)               | High latency (20 ms - 200 ms)      |
| Complete internal autonomy         | Subject to occlusions, jamming     |
| Continuous, smooth trajectories    | Discrete, jumpy fixes              |
| Monotonically diverging drift      | Zero long-term drift (bounded var) |
+------------------------------------+------------------------------------+
```

Neither sensor class is sufficient on its own:
- An autonomous car relying only on an IMU will crash into a guardrail within 30 seconds due to cubic integration drift.
- An autonomous car relying only on GPS will lose control during rapid evasive steering maneuvers due to the $1\text{ Hz}$ update rate and $100\text{ ms}$ latency.

The Kalman filter is the optimal mathematical synthesis that unites these two worlds: it uses high-rate inertial integration to propagate the state forward between sensor frames, and uses low-rate exteroceptive measurements to bound the drift, estimate the hidden biases, and collapse the uncertainty.

---

## 2.6 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 2.1 – 2.10)

#### Problem 2.1: 1D Odometry Random Walk Variance Accumulation
**Statement:**
A warehouse AGV (Automated Guided Vehicle) measures its forward speed with a wheel encoder sampled at frequency $f = 50\text{ Hz}$ ($\Delta t = 0.02\text{ s}$). The speed measurement noise has standard deviation $\sigma_v = 0.05\text{ m/s}$.
1. Derive the variance and standard deviation of position error after $t = 10\text{ s}$, $t = 60\text{ s}$, and $t = 600\text{ s}$ of open-loop dead-reckoning.
2. Determine how long the AGV can travel before its $3\sigma$ position uncertainty exceeds $0.5\text{ m}$ (the width of an aisle tolerance).

**Given Data:**
- $\Delta t = 0.02\text{ s}$, $\sigma_v = 0.05\text{ m/s}$.
- Tolerance: $3 \sigma_p(t) \le 0.5\text{ m} \implies \sigma_p(t) \le 0.1667\text{ m}$.

**Step-by-Step Derivation:**
1. **Variance Formula:**
   From Section 2.2.1, the position variance after $k$ steps ($t = k \Delta t$) is:
   $$\sigma_p^2(t) = \sigma_v^2 \Delta t \cdot t = (0.05)^2 (0.02) t = (0.0025)(0.02) t = 5 \times 10^{-5} t\text{ m}^2$$
   The standard deviation is:
   $$\sigma_p(t) = \sqrt{5 \times 10^{-5} t} = 0.007071 \sqrt{t}\text{ m}$$
2. **Evaluations at Specific Times:**
   - At $t = 10\text{ s}$:
     $$\sigma_p^2(10) = 5 \times 10^{-5} \times 10 = 5 \times 10^{-4}\text{ m}^2 \implies \sigma_p(10) = \sqrt{0.0005} \approx 0.02236\text{ m} = 2.24\text{ cm}$$
   - At $t = 60\text{ s}$ (1 min):
     $$\sigma_p^2(60) = 5 \times 10^{-5} \times 60 = 0.0030\text{ m}^2 \implies \sigma_p(60) = \sqrt{0.0030} \approx 0.05477\text{ m} = 5.48\text{ cm}$$
   - At $t = 600\text{ s}$ (10 min):
     $$\sigma_p^2(600) = 5 \times 10^{-5} \times 600 = 0.030\text{ m}^2 \implies \sigma_p(600) = \sqrt{0.030} \approx 0.17321\text{ m} = 17.32\text{ cm}$$
3. **Time to Exceed Tolerance:**
   $$3 \sigma_p(t) = 3 (0.007071 \sqrt{t}) = 0.021213 \sqrt{t} = 0.5\text{ m}$$
   $$\sqrt{t} = \frac{0.5}{0.021213} \approx 23.5702$$
   $$t_{\text{limit}} = (23.5702)^2 \approx 555.56\text{ s} \approx 9.26\text{ minutes}$$

**Final Answer:**
- At $t = 10\text{ s}$: $\sigma_p \approx 0.0224\text{ m}$ ($2.24\text{ cm}$).
- At $t = 60\text{ s}$: $\sigma_p \approx 0.0548\text{ m}$ ($5.48\text{ cm}$).
- At $t = 600\text{ s}$: $\sigma_p \approx 0.1732\text{ m}$ ($17.32\text{ cm}$).
- Safe operating duration: $t_{\text{limit}} \approx 555.6\text{ s}$ ($9.26\text{ min}$).

**Verification:**
At $t = 555.56\text{ s}$, $\sigma_p = \sqrt{5 \times 10^{-5} \times 555.56} = \sqrt{0.027778} = 0.16667\text{ m}$. $3\sigma_p = 3 \times 0.16667 = 0.5000\text{ m}$. Exact match.

---

#### Problem 2.2: Accelerometer Double Integration Drift Under Constant Bias
**Statement:**
A spacecraft navigation system undergoes an orbital burn where the primary accelerometer has an unmodeled residual bias $b_a = 0.002\text{ m/s}^2$ ($2\text{ mm/s}^2 \approx 0.2\text{ mg}$).
Compute:
1. The velocity error $e_v(t)$ and position error $e_p(t)$ after $t = 30\text{ s}$, $t = 120\text{ s}$, and $t = 600\text{ s}$.
2. The time required for the position error to reach $100.0\text{ m}$.

**Given Data:**
- Bias: $b_a = 0.002\text{ m/s}^2$. Initial errors: $e_v(0) = 0, e_p(0) = 0$.

**Step-by-Step Derivation:**
1. **Error Kinematics:**
   $$e_a(t) = b_a = 0.002\text{ m/s}^2$$
   $$e_v(t) = \int_0^t b_a d\tau = b_a t = 0.002 t\text{ m/s}$$
   $$e_p(t) = \int_0^t e_v(\tau) d\tau = \frac{1}{2} b_a t^2 = 0.001 t^2\text{ m}$$
2. **Evaluations at Specific Times:**
   - At $t = 30\text{ s}$:
     $$e_v(30) = 0.002 \times 30 = 0.06\text{ m/s}$$
     $$e_p(30) = 0.001 \times (30)^2 = 0.001 \times 900 = 0.90\text{ m}$$
   - At $t = 120\text{ s}$ (2 min):
     $$e_v(120) = 0.002 \times 120 = 0.24\text{ m/s}$$
     $$e_p(120) = 0.001 \times (120)^2 = 0.001 \times 14400 = 14.40\text{ m}$$
   - At $t = 600\text{ s}$ (10 min):
     $$e_v(600) = 0.002 \times 600 = 1.20\text{ m/s}$$
     $$e_p(600) = 0.001 \times (600)^2 = 0.001 \times 360000 = 360.00\text{ m}$$
3. **Time to Reach $100\text{ m}$:**
   $$e_p(t) = 0.001 t^2 = 100.0\text{ m} \implies t^2 = \frac{100.0}{0.001} = 100,000\text{ s}^2$$
   $$t = \sqrt{100,000} \approx 316.23\text{ s} \approx 5.27\text{ minutes}$$

**Final Answer:**
- At $t = 30\text{ s}$: $e_v = 0.06\text{ m/s}, e_p = 0.90\text{ m}$.
- At $t = 120\text{ s}$: $e_v = 0.24\text{ m/s}, e_p = 14.40\text{ m}$.
- At $t = 600\text{ s}$: $e_v = 1.20\text{ m/s}, e_p = 360.00\text{ m}$.
- Time to $100\text{ m}$ error: $t \approx 316.2\text{ s}$ ($5.27\text{ min}$).

**Verification:**
At $t = 316.23\text{ s}$: $e_p = 0.001(316.23)^2 = 0.001(100,000) = 100.0\text{ m}$. Quadratic growth verified.

---

#### Problem 2.3: Accelerometer White Noise Double Integration ($t^3$ Growth)
**Statement:**
A tactical-grade IMU has an accelerometer white noise spectral density of $S_a = 1.0 \times 10^{-4}\text{ (m/s}^2)^2/\text{Hz}$ (velocity random walk $\text{VRW} \approx 0.01\text{ m/s}/\sqrt{\text{s}}$).
Assuming zero bias:
1. Compute the analytical position variance $\sigma_p^2(t)$ and standard deviation $\sigma_p(t)$ after $t = 10\text{ s}$, $t = 60\text{ s}$, and $t = 300\text{ s}$.
2. Compare the position uncertainty at $t = 60\text{ s}$ with the error caused by a constant bias of $b_a = 0.01\text{ m/s}^2$.

**Given Data:**
- $S_a = 1.0 \times 10^{-4}\text{ m}^2/\text{s}^3$.
- Bias for comparison: $b_a = 0.01\text{ m/s}^2$.

**Step-by-Step Derivation:**
1. **Variance Formula:**
   From Section 2.3.1:
   $$\sigma_p^2(t) = \frac{1}{3} S_a t^3 = \frac{1}{3} (1.0 \times 10^{-4}) t^3 = 3.3333 \times 10^{-5} t^3\text{ m}^2$$
   $$\sigma_p(t) = \sqrt{\frac{S_a}{3}} t^{3/2} = \sqrt{3.3333 \times 10^{-5}} t^{1.5} = 0.0057735 t^{1.5}\text{ m}$$
2. **Evaluations at Specific Times:**
   - At $t = 10\text{ s}$:
     $$\sigma_p(10) = 0.0057735 \times 10^{1.5} = 0.0057735 \times 31.6228 \approx 0.1826\text{ m}$$
   - At $t = 60\text{ s}$:
     $$\sigma_p(60) = 0.0057735 \times 60^{1.5} = 0.0057735 \times 464.758 \approx 2.6833\text{ m}$$
   - At $t = 300\text{ s}$ (5 min):
     $$\sigma_p(300) = 0.0057735 \times 300^{1.5} = 0.0057735 \times 5196.15 \approx 30.00\text{ m}$$
3. **Comparison with Constant Bias at $t = 60\text{ s}$:**
   Position error from constant bias $b_a = 0.01\text{ m/s}^2$:
   $$e_{p,\text{bias}}(60) = \frac{1}{2} b_a t^2 = \frac{1}{2}(0.01)(60)^2 = 0.005 \times 3600 = 18.00\text{ m}$$
   Ratio:
   $$\frac{e_{p,\text{bias}}}{\sigma_p} = \frac{18.00}{2.6833} \approx 6.71$$
   The constant bias error is nearly $7\times$ larger than the $1\sigma$ noise dispersion.

**Final Answer:**
- At $t = 10\text{ s}$: $\sigma_p \approx 0.183\text{ m}$.
- At $t = 60\text{ s}$: $\sigma_p \approx 2.683\text{ m}$.
- At $t = 300\text{ s}$: $\sigma_p \approx 30.00\text{ m}$.
- Bias error ($18.0\text{ m}$) dominates white noise ($2.68\text{ m}$) at 1 minute.

**Verification:**
Ratio of $\sigma_p(300)/\sigma_p(60) = (300/60)^{1.5} = 5^{1.5} = 5\sqrt{5} \approx 11.18$. Indeed: $2.6833 \times 11.1803 = 30.00\text{ m}$. Exact scaling verified.

---

#### Problem 2.4: Gravity Leakage Induced by Gyroscope Bias
**Statement:**
A micro-aerial vehicle (drone) in level flight experiences an uncalibrated pitch gyroscope bias $b_g = 0.05^\circ/\text{s} \approx 8.7266 \times 10^{-4}\text{ rad/s}$.
The true horizontal acceleration is zero. Gravitational acceleration is $g = 9.81\text{ m/s}^2$.
1. Compute the tilt error $\delta\theta(t)$ after $t = 20\text{ s}$ and $t = 60\text{ s}$.
2. Derive the false horizontal acceleration $a_{\text{false}}(t)$ induced by gravity leakage.
3. Compute the resulting horizontal position drift $e_p(t)$ after $t = 20\text{ s}$ and $t = 60\text{ s}$.

**Given Data:**
- $b_g = 8.7266 \times 10^{-4}\text{ rad/s}$, $g = 9.81\text{ m/s}^2$.

**Step-by-Step Derivation:**
1. **Tilt Error:**
   $$\delta\theta(t) = b_g t$$
   - At $t = 20\text{ s}$: $\delta\theta(20) = (8.7266 \times 10^{-4})(20) = 0.017453\text{ rad} = 1.00^\circ$.
   - At $t = 60\text{ s}$: $\delta\theta(60) = (8.7266 \times 10^{-4})(60) = 0.052360\text{ rad} = 3.00^\circ$.
2. **False Horizontal Acceleration:**
   Under small angles $\sin(\delta\theta) \approx \delta\theta$:
   $$a_{\text{false}}(t) = g \sin(\delta\theta(t)) \approx g b_g t = (9.81)(8.7266 \times 10^{-4}) t = 0.0085608 t\text{ m/s}^2$$
3. **Horizontal Position Drift:**
   Integrating false acceleration twice:
   $$v_{\text{drift}}(t) = \int_0^t a_{\text{false}}(\tau) d\tau = \frac{1}{2} g b_g t^2 = \frac{1}{2}(0.0085608) t^2 = 0.0042804 t^2\text{ m/s}$$
   $$e_p(t) = \int_0^t v_{\text{drift}}(\tau) d\tau = \frac{1}{6} g b_g t^3 = \frac{1}{6}(0.0085608) t^3 = 0.0014268 t^3\text{ m}$$
4. **Numerical Evaluations:**
   - At $t = 20\text{ s}$:
     $$e_p(20) = 0.0014268 \times (20)^3 = 0.0014268 \times 8000 = 11.414\text{ m}$$
   - At $t = 60\text{ s}$:
     $$e_p(60) = 0.0014268 \times (60)^3 = 0.0014268 \times 216000 = 308.19\text{ m}$$

**Final Answer:**
- At $t = 20\text{ s}$: Tilt error $\delta\theta = 1.0^\circ$, position drift $e_p \approx 11.41\text{ m}$.
- At $t = 60\text{ s}$: Tilt error $\delta\theta = 3.0^\circ$, position drift $e_p \approx 308.19\text{ m}$.
- Cubic scaling: In just 1 minute, a $0.05^\circ/\text{s}$ gyro bias produces over $300\text{ m}$ of position error!

**Verification:**
Ratio: $(60/20)^3 = 3^3 = 27$. $11.414 \times 27 = 308.18\text{ m}$. Exact cubic match.

---

#### Problem 2.5: Differential Drive Robot Slip and Angular Odometry Divergence
**Statement:**
A two-wheeled differential drive robot has wheel baseline $W = 0.5\text{ m}$ and nominal wheel radius $r = 0.1\text{ m}$. Wheel encoders sample at $\Delta t = 0.05\text{ s}$. 
Due to a $1\%$ wheel radius calibration error on the right wheel ($r_R = 1.01 r_L$), the robot travels nominally straight at commanded speed $v = 1.0\text{ m/s}$ ($v_L = v_R = 1.0\text{ m/s}$).
1. Calculate the false yaw rate $\omega_{\text{false}}$ induced by the wheel mismatch.
2. Determine the heading error $\theta(t)$ after $t = 30\text{ s}$ of motion.
3. Compute the true trajectory coordinates $(x(t), y(t))$ compared to the dead-reckoned trajectory $(\hat{x}(t), \hat{y}(t))$ and find the net position error after $t = 30\text{ s}$.

**Given Data:**
- $W = 0.5\text{ m}, v_L = 1.0\text{ m/s}, v_R = 1.01\text{ m/s}, t = 30\text{ s}$.

**Step-by-Step Derivation:**
1. **False Yaw Rate:**
   Kinematics of a differential drive robot:
   $$\omega = \frac{v_R - v_L}{W} = \frac{1.01 - 1.00}{0.5} = \frac{0.01}{0.5} = 0.02\text{ rad/s}$$
   The actual forward speed is $v_{\text{mid}} = \frac{v_R + v_L}{2} = \frac{2.01}{2} = 1.005\text{ m/s}$.
2. **Heading Error:**
   $$\theta(t) = \omega t = 0.02 \times 30 = 0.60\text{ rad} \approx 34.38^\circ$$
3. **Dead-Reckoned Trajectory:**
   The robot firmware assumes $v_R = v_L = 1.0\text{ m/s} \implies \hat{\omega} = 0$:
   $$\hat{x}(30) = \int_0^{30} 1.0 \, dt = 30.0\text{ m}, \quad \hat{y}(30) = 0.0\text{ m}$$
4. **True Trajectory:**
   The robot follows a circular arc of radius $R_{\text{curve}} = \frac{v_{\text{mid}}}{\omega} = \frac{1.005}{0.02} = 50.25\text{ m}$:
   $$x(t) = R_{\text{curve}} \sin(\omega t) = 50.25 \sin(0.60) = 50.25 \times 0.564642 \approx 28.373\text{ m}$$
   $$y(t) = R_{\text{curve}} (1 - \cos(\omega t)) = 50.25 (1 - \cos(0.60)) = 50.25 (1 - 0.825336) = 50.25(0.174664) \approx 8.777\text{ m}$$
5. **Net Position Error:**
   $$e = \sqrt{(\hat{x} - x)^2 + (\hat{y} - y)^2} = \sqrt{(30.0 - 28.373)^2 + (0 - 8.777)^2} = \sqrt{(1.627)^2 + (-8.777)^2} = \sqrt{2.647 + 77.036} = \sqrt{79.683} \approx 8.926\text{ m}$$

**Final Answer:**
- False yaw rate: $\omega = 0.02\text{ rad/s}$.
- Heading error: $\theta(30) = 0.60\text{ rad} \approx 34.38^\circ$.
- Dead-reckoned pose: $[30.0, 0.0]^T\text{ m}$. True pose: $[28.37, 8.78]^T\text{ m}$.
- Total position error: $e \approx 8.93\text{ m}$.

**Verification:**
A mere $1\%$ physical tire compression causes the robot to deviate laterally by nearly $9\text{ meters}$ after only $30\text{ meters}$ of forward travel.

---

#### Problem 2.6: Continuous-to-Discrete Process Noise Covariance Integration
**Statement:**
A 1D continuous double integrator (acceleration input) is described by:
$$\dot{x}(t) = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} x(t) + \begin{bmatrix} 0 \\ 1 \end{bmatrix} w_c(t)$$
where $x = [p, v]^T$ and $w_c(t)$ is zero-mean continuous white acceleration noise with power spectral density $q_c = 0.2\text{ (m/s}^2)^2/\text{Hz}$.
Compute the exact discrete-time process noise covariance matrix $Q_k$ over time step $\Delta t = 0.1\text{ s}$ using the continuous-to-discrete integral:
$$Q_k = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$$

**Given Data:**
- $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}, Q_c = q_c = 0.2, \Delta t = 0.1\text{ s}$.

**Step-by-Step Derivation:**
1. **Matrix Exponential $e^{A \tau}$:**
   Since $A^2 = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$, the Taylor series terminates:
   $$e^{A \tau} = I + A \tau = \begin{bmatrix} 1 & \tau \\ 0 & 1 \end{bmatrix}$$
2. **Matrix Product $e^{A \tau} G$:**
   $$e^{A \tau} G = \begin{bmatrix} 1 & \tau \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \tau \\ 1 \end{bmatrix}$$
3. **Integrand Matrix:**
   $$(e^{A \tau} G) q_c (e^{A \tau} G)^T = q_c \begin{bmatrix} \tau \\ 1 \end{bmatrix} \begin{bmatrix} \tau & 1 \end{bmatrix} = q_c \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix}$$
4. **Integration Across $[0, \Delta t]$:**
   $$Q_k = q_c \int_0^{\Delta t} \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix} d\tau = q_c \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
5. **Numerical Evaluation with $\Delta t = 0.1\text{ s}, q_c = 0.2$:**
   $$\frac{\Delta t^3}{3} = \frac{0.001}{3} \approx 0.00033333$$
   $$\frac{\Delta t^2}{2} = \frac{0.01}{2} = 0.005$$
   $$\Delta t = 0.1$$
   $$Q_k = 0.2 \begin{bmatrix} \frac{0.001}{3} & 0.005 \\ 0.005 & 0.1 \end{bmatrix} = \begin{bmatrix} \frac{0.0002}{3} & 0.001 \\ 0.001 & 0.02 \end{bmatrix} = \begin{bmatrix} 6.6667 \times 10^{-5} & 1.0000 \times 10^{-3} \\ 1.0000 \times 10^{-3} & 2.0000 \times 10^{-2} \end{bmatrix}$$

**Final Answer:**
- Analytical: $Q_k = q_c \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$.
- Numerical: $Q_k = \begin{bmatrix} 6.667 \times 10^{-5} & 1.000 \times 10^{-3} \\ 1.000 \times 10^{-3} & 0.0200 \end{bmatrix}\text{ (units: m}^2, \text{m}^2/\text{s}, \text{m}^2/\text{s}^2)$.

**Verification:**
Determinant: $\det(Q_k) = q_c^2 \left( \frac{\Delta t^4}{3} - \frac{\Delta t^4}{4} \right) = q_c^2 \frac{\Delta t^4}{12} = (0.04) \frac{10^{-4}}{12} = 3.333 \times 10^{-7} > 0$. Strictly positive definite.

---

#### Problem 2.7: Allan Variance Analysis of IMU Noise Processes
**Statement:**
An inertial sensor engineer characterizes a MEMS gyroscope by computing its **Allan Variance** $\sigma_A^2(\tau)$ as a function of cluster averaging time $\tau$.
The empirical log-log plot exhibits three characteristic slope regimes:
- Regime 1: Slope $-1$ for $\tau \in [0.01\text{ s}, 1\text{ s}]$ with coefficient $N = 0.002\text{ rad}/\sqrt{\text{s}}$ (Angle Random Walk).
- Regime 2: Slope $0$ (flat bottom) for $\tau \in [10\text{ s}, 100\text{ s}]$ with minimum $\sigma_{\text{min}} = 1.5 \times 10^{-5}\text{ rad/s}$ (In-Run Bias Instability $B$).
- Regime 3: Slope $+1$ for $\tau > 300\text{ s}$ with coefficient $K = 1.0 \times 10^{-6}\text{ rad}/\text{s}^{3/2}$ (Rate Random Walk).
1. Explain the physical mechanism generating each of the three regimes.
2. Determine the optimal averaging time $\tau^*$ to minimize bias estimation error.
3. Express the continuous white noise spectral density $Q_c$ in terms of $N$.

**Given Data:**
- $N = 0.002\text{ rad}/\sqrt{\text{s}}$, $B = 1.5 \times 10^{-5}\text{ rad/s}$, $K = 1.0 \times 10^{-6}\text{ rad}/\text{s}^{3/2}$.

**Step-by-Step Derivation:**
1. **Physical Mechanisms:**
   - **Regime 1 (Angle Random Walk / White Noise):** Caused by thermal white noise in the capacitive readout electronics. Averaging over longer time windows $\tau$ suppresses white noise as $1/\sqrt{\tau}$ (slope $-0.5$ on Allan deviation, slope $-1$ on Allan variance).
   - **Regime 2 (In-Run Bias Instability / Flicker Noise):** Caused by low-frequency $1/f$ flicker noise in the electronics and micro-resonator mechanical anchors. The flat minimum represents the fundamental noise floor below which averaging provides zero benefit.
   - **Regime 3 (Rate Random Walk / Brown Noise):** Caused by slow thermal gradients, mechanical aging, and environmental temperature fluctuations that cause the gyro bias itself to wander as a Wiener process ($\dot{b} = w_b$). Over long time horizons, drift dominates and error grows as $\sqrt{\tau}$.
2. **Optimal Averaging Window:**
   The optimal averaging duration $\tau^*$ is the cluster time at the flat valley (Regime 2), typically between $10\text{ s}$ and $100\text{ s}$. Choosing $\tau^* \approx 30\text{ s}$ achieves the minimum estimation variance $\sigma_{\text{bias}} \approx B = 1.5 \times 10^{-5}\text{ rad/s}$.
3. **Continuous Spectral Density $Q_c$:**
   By IEEE Standard 952 for gyro testing, the angle random walk parameter $N$ is directly related to the continuous white noise spectral density $Q_c$ by:
   $$Q_c = N^2 = (0.002)^2 = 4.0 \times 10^{-6}\text{ (rad/s)}^2/\text{Hz}$$

**Final Answer:**
- Regime 1: High-frequency white noise ($1/\sqrt{\tau}$).
- Regime 2: $1/f$ flicker noise / in-run bias stability floor ($B \approx 1.5 \times 10^{-5}\text{ rad/s}$).
- Regime 3: Long-term temperature drift / rate random walk ($\sqrt{\tau}$).
- Optimal averaging window: $\tau^* \approx 30\text{ s}$.
- Spectral density: $Q_c = 4.0 \times 10^{-6}\text{ rad}^2/\text{s}$.

**Verification:**
Allan variance decomposition conforms exactly to IEEE Std 952-1997 for inertial sensor modeling.

---

#### Problem 2.8: Latency-Induced Estimation Error in High-Speed Visual Tracking
**Statement:**
An autonomous drone flies at constant speed $v = 15.0\text{ m/s}$ along a straight trajectory. An onboard neural camera detects visual landmarks and computes position fixes, but the perception pipeline introduces an image processing and neural inference latency of $\tau_{\text{delay}} = 80\text{ ms}$ ($0.080\text{ s}$).
1. Calculate the spatial lag $d_{\text{lag}}$ between the reported camera position and the drone's actual physical position at the moment the measurement is received.
2. If the drone controller feeds this delayed visual measurement directly into its flight feedback loop without latency compensation, calculate the resulting position tracking error.
3. Show how a Kalman filter uses high-rate IMU forward propagation to project the delayed visual measurement forward to the current timestamp.

**Given Data:**
- $v = 15.0\text{ m/s}, \tau_{\text{delay}} = 0.080\text{ s}$.

**Step-by-Step Derivation:**
1. **Spatial Lag:**
   During the $80\text{ ms}$ required for feature detection and neural inference, the drone continues moving at $15\text{ m/s}$:
   $$d_{\text{lag}} = v \cdot \tau_{\text{delay}} = (15.0\text{ m/s})(0.080\text{ s}) = 1.20\text{ m}$$
2. **Uncompensated Tracking Error:**
   The camera measurement arriving at timestamp $t$ reflects physical state at $t - \tau_{\text{delay}}$. Treating it as instantaneous introduces an unmodeled position bias of $1.20\text{ meters}$. At $15\text{ m/s}$, an unmodeled $1.2\text{ m}$ position error can cause catastrophic collision with trees or building facades.
3. **Kalman Filter Forward Compensation:**
   Let the measurement arrive at current time $t_k$, tagged with acquisition timestamp $t_{\text{meas}} = t_k - \tau_{\text{delay}}$.
   The Kalman filter resolves this latency via two standard approaches:
   - **Method A (Measurement Prediction):** Project the state estimate back to the measurement time:
     $$\hat{z}_k = h(\hat{x}_{t_{\text{meas}}})$$
     Compute residual $y = z_{\text{meas}} - \hat{z}_k$, and project the correction forward across the IMU trajectory.
   - **Method B (State Forward Projection):** Correct the historical state $\hat{x}(t_{\text{meas}})$ and re-integrate the high-rate cached IMU buffer forward from $t_{\text{meas}}$ to $t_k$:
     $$\hat{x}(t_k) = \hat{x}_{\text{corrected}}(t_{\text{meas}}) + \int_{t_{\text{meas}}}^{t_k} v_{\text{IMU}}(\tau) d\tau$$
   This eliminates the entire $1.20\text{ m}$ spatial lag.

**Final Answer:**
- Spatial lag: $d_{\text{lag}} = 1.20\text{ m}$.
- Direct feedback tracking error: $1.20\text{ m}$ systematic lag.
- Resolved by re-integrating buffered IMU propagation across the $80\text{ ms}$ latency window.

**Verification:**
At $\tau_{\text{delay}} \to 0$, $d_{\text{lag}} \to 0$. At high speeds ($v = 30\text{ m/s}$), lag doubles to $2.40\text{ m}$, illustrating why high-speed autonomy requires explicit delay compensation.

---

#### Problem 2.9: The Gauss-Markov Random Walk Model for Sensor Bias
**Statement:**
In reality, sensor bias does not remain strictly constant; it drifts over time as a first-order Gauss-Markov process:
$$\dot{b}(t) = -\frac{1}{\tau_c} b(t) + w_b(t)$$
where $\tau_c = 300\text{ s}$ is the correlation time constant, and $w_b(t)$ is continuous white noise with spectral density $q_b = 2.0 \times 10^{-6}\text{ (m/s}^2)^2/\text{s}$.
1. Derive the continuous steady-state variance $\sigma_{b,\infty}^2$ of the bias.
2. Discretize the Gauss-Markov process for time step $\Delta t = 1.0\text{ s}$:
   $$b_k = \phi b_{k-1} + w_{b,k}$$
   Compute the discrete transition factor $\phi$ and discrete noise variance $Q_b$.

**Given Data:**
- $\tau_c = 300\text{ s}, q_b = 2.0 \times 10^{-6}, \Delta t = 1.0\text{ s}$.

**Step-by-Step Derivation:**
1. **Steady-State Continuous Variance:**
   The Lyapunov equation for the variance $\sigma_b^2(t)$ of $\dot{b} = -\frac{1}{\tau_c} b + w_b$ is:
   $$\frac{d \sigma_b^2}{dt} = -2 \frac{1}{\tau_c} \sigma_b^2 + q_b$$
   In steady state ($\frac{d \sigma_b^2}{dt} = 0$):
   $$-\frac{2}{\tau_c} \sigma_{b,\infty}^2 + q_b = 0 \implies \sigma_{b,\infty}^2 = \frac{q_b \tau_c}{2}$$
   Evaluating numerically:
   $$\sigma_{b,\infty}^2 = \frac{(2.0 \times 10^{-6})(300)}{2} = \frac{6.0 \times 10^{-4}}{2} = 3.0 \times 10^{-4}\text{ (m/s}^2)^2$$
   $$\sigma_{b,\infty} = \sqrt{3.0 \times 10^{-4}} \approx 0.01732\text{ m/s}^2 \approx 1.76\text{ mg}$$
2. **Discretization:**
   - Transition factor:
     $$\phi = e^{-\Delta t / \tau_c} = e^{-1.0 / 300} = e^{-0.0033333} \approx 1 - 0.0033333 = 0.996672$$
   - Discrete noise variance:
     $$Q_b = \sigma_{b,\infty}^2 (1 - \phi^2) = \sigma_{b,\infty}^2 (1 - e^{-2 \Delta t / \tau_c})$$
     Using linear approximation for $2 \Delta t / \tau_c \ll 1$:
     $$1 - e^{-2/300} \approx \frac{2}{300}$$
     $$Q_b \approx \left(\frac{q_b \tau_c}{2}\right) \left(\frac{2 \Delta t}{\tau_c}\right) = q_b \Delta t = (2.0 \times 10^{-6})(1.0) = 2.0 \times 10^{-6}\text{ (m/s}^2)^2$$
     Using exact exponential:
     $$1 - (0.996672)^2 = 1 - 0.993355 = 0.006645$$
     $$Q_b = (3.0 \times 10^{-4})(0.006645) \approx 1.9935 \times 10^{-6}\text{ (m/s}^2)^2$$

**Final Answer:**
- Steady-state variance: $\sigma_{b,\infty}^2 = 3.0 \times 10^{-4}\text{ m}^2/\text{s}^4$ ($\sigma_{b,\infty} \approx 0.0173\text{ m/s}^2$).
- Discrete transition factor: $\phi \approx 0.99667$.
- Discrete noise variance: $Q_b \approx 1.994 \times 10^{-6}\text{ m}^2/\text{s}^4$.

**Verification:**
As $\tau_c \to \infty$ (pure random walk), $\phi \to 1.0$ and $Q_b \to q_b \Delta t$. The Gauss-Markov model prevents the bias from drifting to infinity, bounded by physical thermal limits.

---

#### Problem 2.10: Optimal Measurement Sampling Rate vs Process Noise Growth
**Statement:**
A mobile robot tracks 1D position with process noise variance growing as $\sigma_p^2(t) = q_p t$ with $q_p = 0.1\text{ m}^2/\text{s}$.
An optical positioning beacon provides measurements with fixed accuracy variance $R = 0.05\text{ m}^2$.
To maintain position uncertainty strictly below $\sigma_{\max} = 0.2\text{ m}$ at all times ($\sigma_p^2 \le 0.04\text{ m}^2$), compute:
1. The maximum allowable time interval $\Delta t_{\max}$ between successive beacon measurements.
2. The minimum required beacon update frequency $f_{\min}$.

**Given Data:**
- $q_p = 0.1\text{ m}^2/\text{s}, R = 0.05\text{ m}^2$. Maximum allowable variance $P_{\max} = 0.04\text{ m}^2$.

**Step-by-Step Derivation:**
1. Assume the filter has converged to a cyclic steady-state where:
   - Immediately after an update: variance is $P_{\text{post}}$.
   - Immediately before the next update (after time $\Delta t$): variance is $P_{\text{prior}} = P_{\text{post}} + q_p \Delta t$.
2. The measurement update formula gives:
   $$\frac{1}{P_{\text{post}}} = \frac{1}{P_{\text{prior}}} + \frac{1}{R} \implies P_{\text{post}} = \frac{P_{\text{prior}} R}{P_{\text{prior}} + R}$$
3. The peak uncertainty occurs immediately before the measurement update:
   $$P_{\text{prior}} \le P_{\max} = 0.04\text{ m}^2$$
4. Evaluating $P_{\text{post}}$ when $P_{\text{prior}} = 0.04$:
   $$P_{\text{post}} = \frac{0.04 \times 0.05}{0.04 + 0.05} = \frac{0.0020}{0.09} = \frac{2}{90} = \frac{1}{45} \approx 0.02222\text{ m}^2$$
5. The allowable variance growth during the interval is:
   $$\Delta P = P_{\text{prior}} - P_{\text{post}} = 0.04000 - 0.02222 = 0.01778\text{ m}^2$$
6. Using the process noise growth $\Delta P = q_p \Delta t$:
   $$\Delta t_{\max} = \frac{\Delta P}{q_p} = \frac{0.017778}{0.1} \approx 0.17778\text{ s}$$
7. Minimum update frequency:
   $$f_{\min} = \frac{1}{\Delta t_{\max}} = \frac{1}{0.17778} \approx 5.625\text{ Hz}$$

**Final Answer:**
- Maximum sampling interval: $\Delta t_{\max} \approx 0.178\text{ s}$ ($178\text{ ms}$).
- Minimum beacon frequency: $f_{\min} \approx 5.63\text{ Hz}$ (or at least $6\text{ Hz}$).

**Verification:**
At $\Delta t = 0.17778\text{ s}$: $P_{\text{prior}} = 0.02222 + (0.1)(0.17778) = 0.02222 + 0.01778 = 0.04000\text{ m}^2$. $\sqrt{0.04} = 0.20\text{ m} = \sigma_{\max}$. Exact match.

---

### Section 2: Solved Exercises (Problems 2.11 – 2.20)

#### Problem 2.11: Temperature-Induced Bias Drift in Piezoresistive Accelerometers
**Statement:**
A missile's accelerometer has a temperature sensitivity coefficient $k_T = 0.005\text{ (m/s}^2)/^\circ\text{C}$.
During boost phase, aerodynamic heating causes the sensor temperature to rise linearly:
$$T(t) = T_0 + \alpha_T t$$
where $\alpha_T = 2.0^\circ\text{C/s}$.
1. Find the resulting time-varying acceleration bias $b_a(t)$.
2. Calculate the position error $e_p(t)$ accumulated after $t = 20\text{ s}$ of boost.

**Given Data:**
- $k_T = 0.005, \alpha_T = 2.0, t = 20\text{ s}$.

**Step-by-Step Derivation:**
1. **Time-Varying Bias:**
   $$b_a(t) = k_T (T(t) - T_0) = k_T \alpha_T t = (0.005)(2.0) t = 0.01 t\text{ m/s}^2$$
   The bias increases linearly at $0.01\text{ m/s}^2\text{ per second}$.
2. **Position Error Integration:**
   $$e_v(t) = \int_0^t b_a(\tau) d\tau = \int_0^t 0.01 \tau \, d\tau = \frac{0.01}{2} t^2 = 0.005 t^2\text{ m/s}$$
   $$e_p(t) = \int_0^t e_v(\tau) d\tau = \int_0^t 0.005 \tau^2 d\tau = \frac{0.005}{3} t^3\text{ m}$$
3. **Evaluation at $t = 20\text{ s}$:**
   $$e_p(20) = \frac{0.005}{3} (20)^3 = \frac{0.005 \times 8000}{3} = \frac{40.0}{3} \approx 13.333\text{ m}$$

**Final Answer:**
- $b_a(t) = 0.01 t\text{ m/s}^2$.
- Position error after $20\text{ s}$: $e_p \approx 13.33\text{ m}$.

**Verification:**
At $t=20\text{ s}$, average acceleration bias is $\bar{b} = 0.1\text{ m/s}^2$. Centroid of linear ramp is at $2/3$ duration, yielding exact $t^3/6$ coefficient.

---

#### Problem 2.12: Quantization Noise Modeling in Digital Encoders
**Statement:**
An optical shaft encoder has $N = 4096$ counts per revolution. The measurement quantization step is $\Delta \theta = \frac{2\pi}{N}\text{ rad}$.
1. Compute the numerical value of $\Delta \theta$ in milliradians.
2. Assuming uniform distribution over $[-\frac{\Delta\theta}{2}, \frac{\Delta\theta}{2}]$, compute the equivalent quantization noise variance $\sigma_q^2$ and standard deviation $\sigma_q$.
3. When using this encoder in a Kalman filter, explain why setting measurement covariance $R = \sigma_q^2$ is mathematically justified.

**Given Data:**
- $N = 4096$.

**Step-by-Step Derivation:**
1. **Quantization Step:**
   $$\Delta\theta = \frac{2\pi}{4096} = \frac{\pi}{2048} \approx 0.00153398\text{ rad} \approx 1.534\text{ mrad}$$
2. **Uniform Noise Variance:**
   For a continuous uniform random variable $e \sim \mathcal{U}(-a, a)$ with width $w = 2a = \Delta\theta$:
   $$\sigma_q^2 = \frac{w^2}{12} = \frac{(\Delta\theta)^2}{12}$$
   Evaluating numerically:
   $$\sigma_q^2 = \frac{(0.00153398)^2}{12} = \frac{2.3531 \times 10^{-6}}{12} \approx 1.9609 \times 10^{-7}\text{ rad}^2$$
   $$\sigma_q = \frac{\Delta\theta}{\sqrt{12}} = \frac{0.00153398}{3.4641} \approx 0.0004428\text{ rad} \approx 0.443\text{ mrad}$$
3. **Kalman Justification:**
   By the Central Limit Theorem, when high-rate encoder measurements are integrated across multiple time steps, the cumulative effect of independent uniform quantization errors converges rapidly to an equivalent Gaussian distribution with identical variance $R = \sigma_q^2$.

**Final Answer:**
- $\Delta\theta \approx 1.534\text{ mrad}$.
- $\sigma_q^2 \approx 1.961 \times 10^{-7}\text{ rad}^2$ ($\sigma_q \approx 0.443\text{ mrad}$).
- Justified by Central Limit Theorem and second-moment matching.

**Verification:**
Standard quantization noise theorem $\sigma^2 = \Delta^2 / 12$ holds for fine quantization where signal spans many quantization bins.

---

#### Problem 2.13: Wheel Encoder Scale Factor Calibration
**Statement:**
A mobile robot travels an independently surveyed calibration distance of $D_{\text{true}} = 100.000\text{ m}$. 
The left wheel encoder records $N_L = 318,310$ pulses, and the right wheel records $N_R = 321,493$ pulses. 
Both encoders have $C = 1000\text{ pulses/revolution}$.
1. Compute the effective wheel radii $r_L$ and $r_R$.
2. Compute the percentage difference $\Delta r / \bar{r}$.
3. Predict the lateral heading error accumulated per kilometer if this calibration error is neglected.

**Given Data:**
- $D = 100\text{ m}, C = 1000$. Wheel baseline $W = 0.6\text{ m}$.

**Step-by-Step Derivation:**
1. **Effective Radii:**
   Distance traveled: $D = 2\pi r \frac{N}{C} \implies r = \frac{D C}{2\pi N}$.
   $$r_L = \frac{100.0 \times 1000}{2\pi (318310)} = \frac{100000}{2000000.2} \approx 0.050000\text{ m} = 5.000\text{ cm}$$
   $$r_R = \frac{100.0 \times 1000}{2\pi (321493)} = \frac{100000}{2020000.8} \approx 0.049505\text{ m} = 4.9505\text{ cm}$$
2. **Percentage Difference:**
   $$\bar{r} = \frac{0.050000 + 0.049505}{2} = 0.0497525\text{ m}$$
   $$\Delta r = 0.050000 - 0.049505 = 0.000495\text{ m}$$
   $$\frac{\Delta r}{\bar{r}} = \frac{0.000495}{0.0497525} \times 100\% \approx 0.995\% \approx 1.0\%$$
3. **Heading Error per Kilometer:**
   Over $1000\text{ m}$, the left wheel indicates $1000\text{ m}$ while the right indicates $990.05\text{ m}$ ($\Delta s = 9.95\text{ m}$).
   $$\Delta\theta = \frac{\Delta s}{W} = \frac{9.95\text{ m}}{0.6\text{ m}} \approx 16.58\text{ rad} \approx 950^\circ \approx 2.64\text{ full rotations!}$$

**Final Answer:**
- $r_L \approx 5.000\text{ cm}, r_R \approx 4.951\text{ cm}$.
- Mismatch: $\approx 0.995\%$.
- Angular error: $\Delta\theta \approx 16.58\text{ rad}$ ($950^\circ$) per kilometer.

**Verification:**
Without calibration, the robot turns in circles rather than driving in a straight line, underscoring the severity of uncalibrated dead-reckoning.

---

#### Problem 2.14: Discrete Integration Error of High-G Shock
**Statement:**
A planetary lander experiences a sharp touchdown impact acceleration modeled as a triangular pulse of peak $a_{\max} = 100\text{ m/s}^2$ and duration $T_{\text{shock}} = 0.04\text{ s}$ ($40\text{ ms}$).
The onboard flight computer samples the accelerometer at discrete time step $\Delta t = 0.02\text{ s}$ ($50\text{ Hz}$) and integrates velocity via forward Euler:
$$v_{k+1} = v_k + a_k \Delta t$$
Depending on sampling phase, the computer samples at $t = 0, 0.02, 0.04\text{ s}$.
1. Compute the true change in velocity $\Delta v_{\text{true}} = \int_0^{T} a(t) dt$.
2. Compute the estimated velocity change $\Delta v_{\text{Euler}}$ if the sample catches the peak ($a(0.02) = 100$) versus if it misses the peak.
3. Compute the maximum integration error.

**Given Data:**
- Peak $a_{\max} = 100\text{ m/s}^2$, base duration $T = 0.04\text{ s}$.

**Step-by-Step Derivation:**
1. **True Velocity Change:**
   Area of triangular pulse:
   $$\Delta v_{\text{true}} = \frac{1}{2} \times \text{base} \times \text{height} = \frac{1}{2} (0.04) (100) = 2.00\text{ m/s}$$
2. **Forward Euler Integration:**
   - Case A (Sampling hits peak at $t = 0.02\text{ s}$):
     Samples are $a(0) = 0$, $a(0.02) = 100$, $a(0.04) = 0$.
     $$\Delta v = (a(0) + a(0.02)) \Delta t = (0 + 100)(0.02) = 2.00\text{ m/s}$$
     (Exact match by coincidence of symmetry).
   - Case B (Sampling phase offset by $0.01\text{ s}$):
     Samples at $t = 0.01\text{ s}$ ($a = 50$) and $t = 0.03\text{ s}$ ($a = 50$).
     $$\Delta v = (50 + 50)(0.02) = 2.00\text{ m/s}$$.
   - Case C (Coarse sampling $\Delta t = 0.03\text{ s}$ where pulse is undersampled):
     Samples at $0$ and $0.03$ ($a = 25$): $\Delta v = (25)(0.03) = 0.75\text{ m/s}$.
     Error = $2.00 - 0.75 = 1.25\text{ m/s}$ ($62.5\%$ error).

**Final Answer:**
- True velocity change: $\Delta v_{\text{true}} = 2.00\text{ m/s}$.
- Undersampling can produce errors exceeding $60\%$, emphasizing that IMU sampling rates must exceed shock bandwidth by at least $5\times$ to $10\times$ (typically $\ge 500\text{ Hz}$).

**Verification:**
Nyquist theorem requires sampling at $> 2\times$ the highest frequency content of the shock pulse to prevent aliasing.

---

#### Problem 2.15: Analytical Derivation of the Continuous-Time Velocity Random Walk (VRW)
**Statement:**
In inertial specifications, accelerometer noise is specified as Velocity Random Walk ($\text{VRW}$) in units of $\text{m/s}/\sqrt{\text{hour}}$.
Given a sensor with $\text{VRW} = 0.06\text{ m/s}/\sqrt{\text{hour}}$:
1. Convert $\text{VRW}$ to SI units ($\text{m/s}/\sqrt{\text{s}}$).
2. Compute the continuous white noise spectral density $S_a$.
3. Compute the standard deviation of velocity error accumulated after 1 hour of integration.

**Given Data:**
- $\text{VRW} = 0.06\text{ m/s}/\sqrt{\text{hour}}$. $1\text{ hour} = 3600\text{ s}$.

**Step-by-Step Derivation:**
1. **Unit Conversion:**
   $$\text{VRW}_{\text{SI}} = \frac{0.06\text{ m/s}}{\sqrt{3600\text{ s}}} = \frac{0.06}{60} = 0.0010\text{ m/s}/\sqrt{\text{s}} = 1.0 \times 10^{-3}\text{ m/s}^{1.5}$$
2. **Spectral Density $S_a$:**
   $$\sigma_v(t) = \text{VRW} \cdot \sqrt{t} = \sqrt{S_a t} \implies S_a = (\text{VRW}_{\text{SI}})^2 = (1.0 \times 10^{-3})^2 = 1.0 \times 10^{-6}\text{ m}^2/\text{s}^3$$
3. **Velocity Error After 1 Hour:**
   $$\sigma_v(3600) = \text{VRW} \cdot \sqrt{1\text{ hour}} = 0.06\text{ m/s}$$
   Alternatively:
   $$\sigma_v(3600) = (1.0 \times 10^{-3}) \sqrt{3600} = 1.0 \times 10^{-3} \times 60 = 0.06\text{ m/s}$$

**Final Answer:**
- $\text{VRW}_{\text{SI}} = 1.0 \times 10^{-3}\text{ m/s}/\sqrt{\text{s}}$.
- Spectral density: $S_a = 1.0 \times 10^{-6}\text{ m}^2/\text{s}^3$.
- 1-hour velocity uncertainty: $\sigma_v = 0.06\text{ m/s}$.

**Verification:**
Direct conversion: $0.06 / \sqrt{3600} = 10^{-3}$. Formulation is algebraically consistent.

---

#### Problem 2.16: Cross-Axis Sensitivity Matrix Modeling
**Statement:**
Due to mechanical non-orthogonality and packaging misalignment, a real 3-axis accelerometer measures specific force distorted by a non-orthogonality matrix $M$ and scale factor errors:
$$\hat{a} = (I + S + M) a_{\text{true}} + b_a + v$$
where:
$$S + M = \begin{bmatrix} 0.01 & 0.002 & -0.001 \\ 0.003 & -0.015 & 0.002 \\ -0.002 & 0.001 & 0.005 \end{bmatrix}$$
For a true acceleration $a_{\text{true}} = [0, 0, 9.81]^T\text{ m/s}^2$ (stationary on test bench under 1g gravity), compute the cross-axis false acceleration leaked into the horizontal $x$ and $y$ channels.

**Given Data:**
- $a_{\text{true}} = [0, 0, 9.81]^T$.

**Step-by-Step Derivation:**
1. Compute distortion vector $\Delta a = (S + M) a_{\text{true}}$:
   $$\Delta a = \begin{bmatrix} 0.01 & 0.002 & -0.001 \\ 0.003 & -0.015 & 0.002 \\ -0.002 & 0.001 & 0.005 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 9.81 \end{bmatrix} = \begin{bmatrix} -0.001 \times 9.81 \\ 0.002 \times 9.81 \\ 0.005 \times 9.81 \end{bmatrix} = \begin{bmatrix} -0.00981 \\ 0.01962 \\ 0.04905 \end{bmatrix}\text{ m/s}^2$$
2. The leaked horizontal accelerations are:
   $$\Delta a_x = -0.00981\text{ m/s}^2 \approx -1.0\text{ mg}$$
   $$\Delta a_y = +0.01962\text{ m/s}^2 \approx +2.0\text{ mg}$$

**Final Answer:**
- False x-acceleration: $-9.81\text{ mm/s}^2$.
- False y-acceleration: $+19.62\text{ mm/s}^2$.

**Verification:**
Even with zero actual horizontal motion, imperfect sensor alignment fools dead-reckoning into integrating a phantom horizontal velocity of nearly $2\text{ cm/s}$ per second.

---

#### Problem 2.17: Multi-Rate Sensor Fusion Timing and Buffer Synchronization
**Statement:**
A robot controller processes high-rate IMU telemetry at $f_{\text{IMU}} = 200\text{ Hz}$ ($\Delta t = 5\text{ ms}$) and visual odometry at $f_{\text{VO}} = 10\text{ Hz}$ ($\Delta t_{\text{VO}} = 100\text{ ms}$).
1. How many IMU propagation cycles occur between each visual odometry measurement?
2. If the visual odometry measurement requires $35\text{ ms}$ of computation, how many IMU ticks back in history does the visual measurement correspond to?
3. State the ring buffer capacity required to maintain $200\text{ ms}$ of IMU history for delayed state fusion.

**Given Data:**
- $f_{\text{IMU}} = 200\text{ Hz} \implies \Delta t = 5\text{ ms}$. $f_{\text{VO}} = 10\text{ Hz} \implies \Delta t_{\text{VO}} = 100\text{ ms}$.
- Latency = $35\text{ ms}$. Buffer depth target = $200\text{ ms}$.

**Step-by-Step Derivation:**
1. **IMU Steps per Visual Frame:**
   $$N_{\text{steps}} = \frac{f_{\text{IMU}}}{f_{\text{VO}}} = \frac{200}{10} = 20\text{ IMU integration steps}$$
2. **Historical Delay Steps:**
   $$\text{Delay ticks} = \frac{35\text{ ms}}{5\text{ ms}} = 7\text{ IMU ticks in the past}$$
3. **Ring Buffer Capacity:**
   $$\text{Capacity} = \frac{200\text{ ms}}{5\text{ ms}} = 40\text{ frames}$$

**Final Answer:**
- 20 IMU steps per visual frame.
- Measurement corresponds to 7 ticks in the past.
- Ring buffer capacity: At least 40 states.

**Verification:**
$40 \times 5\text{ ms} = 200\text{ ms}$, ensuring ample history to roll back state and re-propagate.

---

#### Problem 2.18: Earth Rotation Effect on Gyroscope Dead-Reckoning
**Statement:**
The Earth rotates at an angular rate of $\omega_{\text{Earth}} \approx 7.2921 \times 10^{-5}\text{ rad/s}$ ($15.04^\circ/\text{hour}$).
A stationary high-precision optical gyro located at latitude $\phi = 45^\circ\text{ N}$ has zero sensor bias.
If the navigation computer fails to subtract the Earth rotation rate from the vertical gyro measurement:
1. Compute the vertical component of Earth rate measured by the gyro: $\omega_z = \omega_{\text{Earth}} \sin\phi$.
2. Compute the resulting heading error accumulated over 1 hour ($3600\text{ s}$).

**Given Data:**
- $\omega_{\text{Earth}} = 7.2921 \times 10^{-5}\text{ rad/s}$, $\phi = 45^\circ$.

**Step-by-Step Derivation:**
1. **Vertical Component:**
   $$\omega_z = \omega_{\text{Earth}} \sin(45^\circ) = (7.2921 \times 10^{-5})\left(\frac{\sqrt{2}}{2}\right) \approx 5.1563 \times 10^{-5}\text{ rad/s}$$
2. **Heading Error After 1 Hour:**
   $$\Delta\psi = \omega_z \times 3600\text{ s} = (5.1563 \times 10^{-5}) \times 3600 \approx 0.18563\text{ rad} \approx 10.635^\circ$$

**Final Answer:**
- Measured rate: $\omega_z \approx 5.156 \times 10^{-5}\text{ rad/s}$.
- Heading error after 1 hour: $\Delta\psi \approx 10.64^\circ$.

**Verification:**
$15.04^\circ/\text{hour} \times \sin(45^\circ) = 15.04 \times 0.7071 = 10.635^\circ/\text{hour}$. Exact match.

---

#### Problem 2.19: The Zero-Velocity Update (ZUPT) Mechanism
**Statement:**
A walking humanoid robot has foot contact sensors that detect when the stance foot is firmly planted on the ground ($v_{\text{true}} = 0$).
During stance phase, the IMU onboard the foot continues to integrate small noise and drift.
Explain mathematically how treating $z_{\text{ZUPT}} = 0\text{ m/s}$ with small covariance $R_{\text{ZUPT}} = 10^{-6}\text{ m}^2/\text{s}^2$ inside a Kalman filter resets velocity error and estimates accelerometer bias.

**Given Data:**
- Stance condition: $v = 0$. Measurement model: $z = v + \eta, R = 10^{-6}$.

**Step-by-Step Derivation:**
1. **Measurement Innovation:**
   The filter predicts foot velocity $\hat{v}_{k|k-1}$ from IMU integration.
   When stance is detected, observation $z = 0$:
   $$y = z - \hat{v}_{k|k-1} = -\hat{v}_{k|k-1}$$
2. **Velocity Reset:**
   Because $R \approx 0$, the Kalman gain for velocity is near unity ($K_v \approx 1$):
   $$\hat{v}_{k|k} = \hat{v}_{k|k-1} + K_v (-\hat{v}_{k|k-1}) \approx 0$$
   Velocity error is reset to zero on every footstep.
3. **Bias Observability:**
   In the error-state Kalman filter, velocity error $\delta v$ is coupled to accelerometer bias error $\delta b_a$ via $\delta \dot{v} = \delta b_a$.
   Because velocity error is driven to zero while the drift rate is known, the cross-covariance term $P_{v, b_a}$ enables the filter to observe and calibrate the accelerometer bias $b_a$ during every single stance phase!

**Final Answer:**
- ZUPT transforms an open-loop unbounded $t^3$ drift into a bounded error that resets to zero on every walking step ($\approx 1\text{ Hz}$).

**Verification:**
Standard pedestrian navigation systems (e.g. shoe-mounted IMUs) achieve $< 0.5\%$ distance error solely through ZUPT corrections.

---

#### Problem 2.20: Synthesis of the Sensor Fusion Paradigm
**Statement:**
Formulate the master trade-off equation demonstrating why combining a drifting high-rate process model with a noisy low-rate observation produces a strictly bounded steady-state estimation covariance.

**Given Data:**
- Discrete process noise variance $\Delta P_{\text{proc}} = q \Delta t$.
- Measurement noise variance $R$.

**Step-by-Step Derivation:**
1. Across interval $\Delta t$, state uncertainty expands:
   $$P_{\text{prior}} = P + q \Delta t$$
2. Measurement update contracts uncertainty:
   $$P_{\text{post}} = \left( P_{\text{prior}}^{-1} + R^{-1} \right)^{-1} = \frac{(P + q \Delta t) R}{P + q \Delta t + R}$$
3. In steady state ($P_{\text{post}} = P$):
   $$P (P + q \Delta t + R) = (P + q \Delta t) R$$
   $$P^2 + P q \Delta t + P R = P R + q R \Delta t$$
   $$P^2 + (q \Delta t) P - q R \Delta t = 0$$
4. Solving the positive root of the quadratic equation:
   $$P_\infty = -\frac{q \Delta t}{2} + \sqrt{\left(\frac{q \Delta t}{2}\right)^2 + q R \Delta t}$$
5. As $t \to \infty$, $P_\infty$ remains strictly finite and constant:
   $$\lim_{t \to \infty} P(t) = P_\infty < \infty$$

**Final Answer:**
- Steady-state variance is unconditionally bounded: $P_\infty = -\frac{q \Delta t}{2} + \sqrt{\frac{q^2 \Delta t^2}{4} + q R \Delta t}$.
- Concludes the philosophical imperative: sensory observation permanently halts the unbounded divergence of dead-reckoning entropy.

**Verification:**
If $R \to \infty$ (no measurements), $P_\infty \to \infty$ (unbounded drift). If $R \to 0$ (perfect sensor), $P_\infty \to 0$. The formula perfectly captures the physical extremes.


---

# Chapter 3: The 1D Scalar Kalman Filter — Mechanics of Belief Propagation and Gain Tuning

Before confronting the full algebraic complexity of high-dimensional matrix equations, the profound intuition, mechanics, and geometric elegance of optimal filtering can be mastered in the one-dimensional scalar domain. The 1D scalar Kalman filter is not an approximation or a toy model; it is the exact, optimal Bayesian estimator for a single physical degree of freedom subjected to linear dynamics and Gaussian noise.

Every fundamental concept of modern estimation theory—the tension between model prediction and empirical observation, the contracting nature of information gain, the role of process noise in preventing filter overconfidence, and the steady-state convergence of the algebraic Riccati equation—manifests with pristine clarity in the scalar equations.

---

## 3.1 The Scalar Dynamic and Measurement Models

Consider a scalar physical quantity $x \in \mathbb{R}$ (such as temperature in a chemical reactor, altitude of a balloon, or voltage on a lithium-ion battery). The physical state evolves at discrete time steps $k = 1, 2, 3, \dots$ according to the linear stochastic recurrence:

$$x_k = a x_{k-1} + b u_{k-1} + w_k$$

and is observed through a noisy linear transducer:

$$z_k = c x_k + v_k$$

where:
1. $a \in \mathbb{R}$ is the **state transition scalar** (describing natural dissipation, decay, or growth).
2. $b \in \mathbb{R}$ is the **control input gain**, and $u_{k-1} \in \mathbb{R}$ is the known deterministic control command.
3. $c \in \mathbb{R}$ is the **measurement sensitivity scalar** (relating physical state units to sensor output units).
4. $w_k \sim \mathcal{N}(0, q)$ is independent, zero-mean Gaussian **process noise** with variance $q \ge 0$.
5. $v_k \sim \mathcal{N}(0, r)$ is independent, zero-mean Gaussian **measurement noise** with variance $r > 0$.
6. The initial state is uncertain: $x_0 \sim \mathcal{N}(\hat{x}_0, p_0)$ with initial variance $p_0 > 0$.
7. $w_k, v_k$, and $x_0$ are mutually uncorrelated for all time steps.

---

## 3.2 The Five Canonical Scalar Kalman Equations

At each discrete time step $k$, the Kalman filter executes a two-phase recursive cycle: the **Predict Step** (time propagation) and the **Update Step** (measurement incorporation).

```
        Initial Belief: N(\hat{x}_0, p_0)
                     |
                     v
             +---------------+
             | PREDICT STEP  | <--- Dynamics: a, b, u, q
             +---------------+
                     |
       Prior Belief: N(\hat{x}_{k|k-1}, p_{k|k-1})
                     |
                     v
             +---------------+
             |  UPDATE STEP  | <--- Sensor: z_k, c, r
             +---------------+
                     |
    Posterior Belief: N(\hat{x}_{k|k}, p_{k|k})
                     |
                     +---- Loops to next step (k -> k+1)
```

### Phase 1: The Predict Step (A Priori Belief Propagation)
Before the sensor measurement $z_k$ arrives, the filter projects its belief forward in time using its mathematical model of physical dynamics:

1. **State Prediction (A Priori Mean):**
   $$\hat{x}_{k|k-1} = \mathbb{E}[x_k \mid z_{1:k-1}] = \mathbb{E}[a x_{k-1} + b u_{k-1} + w_k \mid z_{1:k-1}]$$
   $$\hat{x}_{k|k-1} = a \hat{x}_{k-1|k-1} + b u_{k-1}$$

2. **Covariance Prediction (A Priori Variance Expansion):**
   The a priori estimation error is $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1} = a(x_{k-1} - \hat{x}_{k-1|k-1}) + w_k = a \tilde{x}_{k-1|k-1} + w_k$.
   Because $w_k$ is independent of the past estimation error:
   $$p_{k|k-1} = \mathbb{E}[\tilde{x}_{k|k-1}^2] = a^2 \mathbb{E}[\tilde{x}_{k-1|k-1}^2] + \mathbb{E}[w_k^2] = a^2 p_{k-1|k-1} + q$$
   Notice that if $q > 0$, uncertainty **expands** during the predict step ($p_{k|k-1} > a^2 p_{k-1|k-1}$).

---

### Phase 2: The Update Step (A Posteriori Belief Correction)
When the new measurement $z_k$ arrives, the filter compares it to its predicted measurement $c \hat{x}_{k|k-1}$:

3. **Measurement Innovation (Residual) and Innovation Variance:**
   The innovation $y_k$ is the unexpected new information delivered by the sensor:
   $$y_k = z_k - c \hat{x}_{k|k-1}$$
   The variance of this innovation residual is:
   $$s_k = \operatorname{Var}(y_k) = \operatorname{Var}(c(x_k - \hat{x}_{k|k-1}) + v_k) = c^2 p_{k|k-1} + r$$

4. **The Optimal Kalman Gain:**
   The Kalman gain $K_k$ determines how much weight to place on the new measurement relative to the prior prediction:
   $$K_k = \frac{c \, p_{k|k-1}}{s_k} = \frac{c \, p_{k|k-1}}{c^2 p_{k|k-1} + r}$$
   If $c = 1$ (direct state measurement), this simplifies to the iconic form:
   $$K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r}$$

5. **State Update (A Posteriori Mean):**
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k = \hat{x}_{k|k-1} + K_k (z_k - c \hat{x}_{k|k-1})$$
   Rearranging in convex combination form (for $c = 1$):
   $$\hat{x}_{k|k} = (1 - K_k) \hat{x}_{k|k-1} + K_k z_k$$

6. **Covariance Update (A Posteriori Variance Contraction):**
   $$p_{k|k} = (1 - K_k c) p_{k|k-1}$$
   Because $K_k c = \frac{c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} \in [0, 1]$, the factor $(1 - K_k c) \le 1$.
   The measurement update **strictly contracts** the uncertainty:
   $$p_{k|k} \le p_{k|k-1}$$

---

## 3.3 Asymptotic Limits of the Kalman Gain

The scalar gain formula $K = \frac{p}{p + r}$ embodies the entire philosophy of Bayesian rationality. Let us examine the limiting regimes:

### 3.3.1 Perfect Sensor ($r \to 0$)
When sensor noise variance approaches zero ($r \to 0$):
$$\lim_{r \to 0} K_k = \lim_{r \to 0} \frac{p_{k|k-1}}{p_{k|k-1} + r} = \frac{p_{k|k-1}}{p_{k|k-1}} = 1$$
$$\hat{x}_{k|k} = (1 - 1)\hat{x}_{k|k-1} + 1 \cdot z_k = z_k$$
$$p_{k|k} = (1 - 1) p_{k|k-1} = 0$$
The filter discards its historical prediction entirely, locks onto the sensor reading, and declares zero uncertainty.

### 3.3.2 Broken / Infinite Noise Sensor ($r \to \infty$)
When sensor noise approaches infinity ($r \to \infty$):
$$\lim_{r \to \infty} K_k = \lim_{r \to \infty} \frac{p_{k|k-1}}{p_{k|k-1} + r} = 0$$
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + 0 \cdot (z_k - \hat{x}_{k|k-1}) = \hat{x}_{k|k-1}$$
$$p_{k|k} = (1 - 0) p_{k|k-1} = p_{k|k-1}$$
The filter completely ignores the sensor reading and relies purely on its dynamic model.

### 3.3.3 Absolute Prior Certainty ($p_{k|k-1} \to 0$)
If prior certainty is infinite ($p_{k|k-1} \to 0$):
$$K_k = \frac{0}{0 + r} = 0 \implies \hat{x}_{k|k} = \hat{x}_{k|k-1}$$
A filter that believes it knows the truth with absolute zero variance will never adjust its belief, regardless of sensor data. (This is known as **filter divergence** or **arrogance**).

### 3.3.4 Absolute Prior Ignorance ($p_{k|k-1} \to \infty$)
When prior uncertainty is immense ($p_{k|k-1} \to \infty$):
$$\lim_{p \to \infty} K_k = \lim_{p \to \infty} \frac{p}{p + r} = 1 \implies \hat{x}_{k|k} = z_k, \quad p_{k|k} = r$$
The filter instantly initializes itself to the first sensor reading with variance $r$.

---

## 3.4 Steady-State Convergence and the Scalar Algebraic Riccati Equation

In time-invariant systems where $a, c, q, r$ are constant, the sequence of prior variances $p_{k|k-1}$ and posterior variances $p_{k|k}$ converges as $k \to \infty$ to a stationary, fixed-point limit:

$$\lim_{k \to \infty} p_{k|k-1} = p_\infty^{-}, \quad \lim_{k \to \infty} p_{k|k} = p_\infty^{+}$$

Combining the predict equation $p_{k+1|k} = a^2 p_{k|k} + q$ and update equation $p_{k|k} = \frac{p_{k|k-1} r}{c^2 p_{k|k-1} + r}$:

$$p_{k+1|k} = a^2 \left( \frac{p_{k|k-1} r}{c^2 p_{k|k-1} + r} \right) + q$$

Setting $p_{k+1|k} = p_{k|k-1} = p_\infty$:

$$p_\infty = \frac{a^2 r p_\infty}{c^2 p_\infty + r} + q$$

Multiplying both sides by the denominator $(c^2 p_\infty + r)$:

$$p_\infty (c^2 p_\infty + r) = a^2 r p_\infty + q (c^2 p_\infty + r)$$
$$c^2 p_\infty^2 + r p_\infty = a^2 r p_\infty + c^2 q p_\infty + q r$$
$$c^2 p_\infty^2 + \left[ (1 - a^2)r - c^2 q \right] p_\infty - q r = 0$$

This is the **Scalar Discrete Algebraic Riccati Equation (DARE)**!
It is a quadratic equation in $p_\infty$:
$$A p_\infty^2 + B p_\infty + C = 0$$
where:
$$A = c^2 > 0, \quad B = (1 - a^2)r - c^2 q, \quad C = -q r \le 0$$

Because $A > 0$ and $C \le 0$, the discriminant $\Delta = B^2 - 4AC = B^2 + 4 c^2 q r \ge 0$ is always non-negative.
By Descartes' Rule of Signs, there is **exactly one strictly positive real root**:

$$p_\infty = \frac{-B + \sqrt{B^2 + 4 c^2 q r}}{2 c^2}$$

The steady-state Kalman gain is:
$$K_\infty = \frac{c p_\infty}{c^2 p_\infty + r}$$

> [!TIP]
> In embedded microcontrollers with constrained compute resources, one does not need to compute the covariance update in real time. The steady-state gain $K_\infty$ can be pre-computed offline, transforming the Kalman filter into a single-line static recursive IIR filter:
> $$\hat{x}_k = (a \hat{x}_{k-1} + b u_{k-1}) + K_\infty (z_k - c (a \hat{x}_{k-1} + b u_{k-1}))$$

---

## 3.5 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 3.1 – 3.10)

#### Problem 3.1: Complete 3-Step Execution of a 1D Temperature Filter
**Statement:**
A chemical reactor's core temperature $x_k \in \mathbb{R}$ remains nominally constant over short intervals: $x_k = x_{k-1} + w_k$ ($a = 1, b = 0$), with process noise variance $q = 0.5\text{ }^\circ\text{C}^2$.
A temperature sensor provides direct measurements: $z_k = x_k + v_k$ ($c = 1$) with noise variance $r = 2.0\text{ }^\circ\text{C}^2$.
Initial belief is $x_0 \sim \mathcal{N}(\hat{x}_0 = 20.0, p_0 = 4.0\text{ }^\circ\text{C}^2)$.
The sensor records three successive readings:
- Step 1: $z_1 = 23.5^\circ\text{C}$
- Step 2: $z_2 = 22.0^\circ\text{C}$
- Step 3: $z_3 = 24.5^\circ\text{C}$
Execute the full Kalman filter algorithm for all three steps. At each step $k \in \{1, 2, 3\}$, compute:
1. Prior estimate $\hat{x}_{k|k-1}$ and prior variance $p_{k|k-1}$.
2. Innovation $y_k$ and innovation variance $s_k$.
3. Kalman gain $K_k$.
4. Posterior estimate $\hat{x}_{k|k}$ and posterior variance $p_{k|k}$.

**Given Data:**
- $a = 1, b = 0, c = 1, q = 0.5, r = 2.0$. Initial: $\hat{x}_0 = 20.0, p_0 = 4.0$.
- Measurements: $z_1 = 23.5, z_2 = 22.0, z_3 = 24.5$.

**Step-by-Step Derivation:**

**Step 1 ($k = 1$):**
1. **Predict:**
   $$\hat{x}_{1|0} = a \hat{x}_0 = 1.0(20.0) = 20.0^\circ\text{C}$$
   $$p_{1|0} = a^2 p_0 + q = 1^2(4.0) + 0.5 = 4.5^\circ\text{C}^2$$
2. **Innovation & Variance:**
   $$y_1 = z_1 - c \hat{x}_{1|0} = 23.5 - 20.0 = 3.5^\circ\text{C}$$
   $$s_1 = c^2 p_{1|0} + r = 4.5 + 2.0 = 6.5^\circ\text{C}^2$$
3. **Kalman Gain:**
   $$K_1 = \frac{c p_{1|0}}{s_1} = \frac{4.5}{6.5} = \frac{9}{13} \approx 0.692308$$
4. **Update:**
   $$\hat{x}_{1|1} = \hat{x}_{1|0} + K_1 y_1 = 20.0 + \frac{9}{13}(3.5) = 20.0 + \frac{31.5}{13} = 20.0 + 2.42308 = 22.42308^\circ\text{C}$$
   $$p_{1|1} = (1 - K_1) p_{1|0} = \left(1 - \frac{9}{13}\right) 4.5 = \frac{4}{13}(4.5) = \frac{18.0}{13} \approx 1.384615^\circ\text{C}^2$$

---

**Step 2 ($k = 2$):**
1. **Predict:**
   $$\hat{x}_{2|1} = \hat{x}_{1|1} = 22.42308^\circ\text{C}$$
   $$p_{2|1} = p_{1|1} + q = \frac{18}{13} + \frac{6.5}{13} = \frac{24.5}{13} = \frac{49}{26} \approx 1.884615^\circ\text{C}^2$$
2. **Innovation & Variance:**
   $$y_2 = z_2 - \hat{x}_{2|1} = 22.0 - 22.42308 = -0.42308^\circ\text{C}$$
   $$s_2 = p_{2|1} + r = 1.884615 + 2.0 = 3.884615^\circ\text{C}^2$$
3. **Kalman Gain:**
   $$K_2 = \frac{p_{2|1}}{s_2} = \frac{1.884615}{3.884615} = \frac{49/26}{101/26} = \frac{49}{101} \approx 0.485149$$
4. **Update:**
   $$\hat{x}_{2|2} = 22.42308 + 0.485149(-0.42308) = 22.42308 - 0.20526 = 22.21782^\circ\text{C}$$
   $$p_{2|2} = (1 - K_2) p_{2|1} = \left(1 - \frac{49}{101}\right) \frac{49}{26} = \frac{52}{101} \times \frac{49}{26} = \frac{2 \times 49}{101} = \frac{98}{101} \approx 0.970297^\circ\text{C}^2$$

---

**Step 3 ($k = 3$):**
1. **Predict:**
   $$\hat{x}_{3|2} = \hat{x}_{2|2} = 22.21782^\circ\text{C}$$
   $$p_{3|2} = p_{2|2} + q = \frac{98}{101} + 0.5 = \frac{98 + 50.5}{101} = \frac{148.5}{101} = \frac{297}{202} \approx 1.470297^\circ\text{C}^2$$
2. **Innovation & Variance:**
   $$y_3 = z_3 - \hat{x}_{3|2} = 24.5 - 22.21782 = 2.28218^\circ\text{C}$$
   $$s_3 = p_{3|2} + r = 1.470297 + 2.0 = 3.470297^\circ\text{C}^2$$
3. **Kalman Gain:**
   $$K_3 = \frac{p_{3|2}}{s_3} = \frac{1.470297}{3.470297} = \frac{297/202}{701/202} = \frac{297}{701} \approx 0.423680$$
4. **Update:**
   $$\hat{x}_{3|3} = 22.21782 + 0.423680(2.28218) = 22.21782 + 0.96691 = 23.18473^\circ\text{C}$$
   $$p_{3|3} = (1 - K_3) p_{3|2} = \left(1 - \frac{297}{701}\right) \frac{297}{202} = \frac{404}{701} \times \frac{297}{202} = \frac{2 \times 297}{701} = \frac{594}{701} \approx 0.847361^\circ\text{C}^2$$

**Final Answer:**
- **Step 1:** $\hat{x}_{1|1} \approx 22.423^\circ\text{C}$, $p_{1|1} \approx 1.385^\circ\text{C}^2$, $K_1 \approx 0.692$.
- **Step 2:** $\hat{x}_{2|2} \approx 22.218^\circ\text{C}$, $p_{2|2} \approx 0.970^\circ\text{C}^2$, $K_2 \approx 0.485$.
- **Step 3:** $\hat{x}_{3|3} \approx 23.185^\circ\text{C}$, $p_{3|3} \approx 0.847^\circ\text{C}^2$, $K_3 \approx 0.424$.

**Verification:**
Notice the monotonic convergence of variance: $p_0 = 4.0 \to p_1 = 1.385 \to p_2 = 0.970 \to p_3 = 0.847$.
The gain decays smoothly from $0.692 \to 0.485 \to 0.424$, stabilizing belief as confidence accumulates.

---

#### Problem 3.2: Steady-State Variance and Gain from the Algebraic Riccati Equation
**Statement:**
For the system in Problem 3.1 ($a = 1, c = 1, q = 0.5, r = 2.0$):
1. Write down the continuous-operation Algebraic Riccati Equation for the a priori steady-state variance $p_\infty^{-}$.
2. Solve analytically for $p_\infty^{-}$.
3. Compute the steady-state Kalman gain $K_\infty$ and the steady-state posterior variance $p_\infty^{+}$.
4. Compare $p_\infty^{+}$ with the step 3 variance $p_{3|3} \approx 0.8474$ from Problem 3.1.

**Given Data:**
- $a = 1, c = 1, q = 0.5, r = 2.0$.

**Step-by-Step Derivation:**
1. **Algebraic Riccati Equation Formulation:**
   Using the formula from Section 3.4 with $a = 1, c = 1$:
   $$c^2 (p_\infty^-)^2 + \left[ (1 - a^2)r - c^2 q \right] p_\infty^- - q r = 0$$
   $$(1)^2 (p_\infty^-)^2 + \left[ (1 - 1)(2.0) - (1)(0.5) \right] p_\infty^- - (0.5)(2.0) = 0$$
   $$(p_\infty^-)^2 - 0.5 p_\infty^- - 1.0 = 0$$
2. **Solving the Quadratic Equation:**
   $$p_\infty^- = \frac{0.5 \pm \sqrt{(-0.5)^2 - 4(1)(-1.0)}}{2} = \frac{0.5 \pm \sqrt{0.25 + 4.0}}{2} = \frac{0.5 \pm \sqrt{4.25}}{2} = \frac{0.5 \pm 2.061553}{2}$$
   Taking the physically meaningful positive root:
   $$p_\infty^- = \frac{0.5 + 2.061553}{2} = \frac{2.561553}{2} \approx 1.280776^\circ\text{C}^2$$
3. **Steady-State Kalman Gain:**
   $$K_\infty = \frac{p_\infty^-}{p_\infty^- + r} = \frac{1.280776}{1.280776 + 2.0} = \frac{1.280776}{3.280776} \approx 0.390388$$
4. **Steady-State Posterior Variance:**
   $$p_\infty^+ = (1 - K_\infty) p_\infty^- = (1 - 0.390388) \times 1.280776 = 0.609612 \times 1.280776 \approx 0.780776^\circ\text{C}^2$$
   Alternatively:
   $$p_\infty^+ = p_\infty^- - q = 1.280776 - 0.500000 = 0.780776^\circ\text{C}^2$$
5. **Comparison:**
   At Step 3, $p_{3|3} \approx 0.8474$.
   The variance is already within $8.5\%$ of its infinite-time theoretical limit ($0.7808$).

**Final Answer:**
- Prior steady-state variance: $p_\infty^- \approx 1.2808^\circ\text{C}^2$.
- Steady-state Kalman gain: $K_\infty \approx 0.3904$.
- Posterior steady-state variance: $p_\infty^+ \approx 0.7808^\circ\text{C}^2$.

**Verification:**
Check Riccati balance:
$p_\infty^- = a^2 p_\infty^+ + q = 1^2(0.780776) + 0.5 = 1.280776$.
$p_\infty^+ = \frac{p_\infty^- r}{p_\infty^- + r} = \frac{1.280776 \times 2.0}{3.280776} = \frac{2.561552}{3.280776} = 0.780776$. Exactly balanced.

---

#### Problem 3.3: Damped Dynamic System ($a < 1$) Riccati Solution
**Statement:**
A decaying RC electrical filter voltage satisfies $x_k = 0.8 x_{k-1} + w_k$ ($a = 0.8, b = 0$).
Process noise variance is $q = 0.36\text{ V}^2$, and measurement noise variance is $r = 1.0\text{ V}^2$ with direct observation ($c = 1$).
1. Solve the Discrete Algebraic Riccati Equation for the steady-state prior variance $p_\infty^-$.
2. Compute the steady-state gain $K_\infty$ and posterior variance $p_\infty^+$.
3. Compute the open-loop variance if no measurements were available ($K = 0$).

**Given Data:**
- $a = 0.8, c = 1, q = 0.36, r = 1.0$.

**Step-by-Step Derivation:**
1. **Riccati Equation Formulation:**
   $$A = c^2 = 1.0$$
   $$B = (1 - a^2)r - c^2 q = (1 - 0.64)(1.0) - (1)(0.36) = 0.36 - 0.36 = 0.0$$
   $$C = -q r = -(0.36)(1.0) = -0.36$$
   The linear term vanishes identically ($B = 0$)!
   $$(p_\infty^-)^2 - 0.36 = 0 \implies (p_\infty^-)^2 = 0.36$$
   $$p_\infty^- = \sqrt{0.36} = 0.60\text{ V}^2$$
2. **Steady-State Gain and Posterior Variance:**
   $$K_\infty = \frac{p_\infty^-}{p_\infty^- + r} = \frac{0.60}{0.60 + 1.0} = \frac{0.60}{1.60} = \frac{3}{8} = 0.375$$
   $$p_\infty^+ = (1 - K_\infty) p_\infty^- = (1 - 0.375)(0.60) = 0.625 \times 0.60 = 0.375\text{ V}^2$$
3. **Open-Loop Variance (Without Measurements):**
   If $K = 0$, variance evolves as $p_{k} = a^2 p_{k-1} + q$:
   $$p_{\text{open},\infty} = a^2 p_{\text{open},\infty} + q \implies p_{\text{open},\infty} (1 - a^2) = q$$
   $$p_{\text{open},\infty} = \frac{q}{1 - a^2} = \frac{0.36}{1 - 0.64} = \frac{0.36}{0.36} = 1.00\text{ V}^2$$

**Final Answer:**
- Prior steady-state variance: $p_\infty^- = 0.60\text{ V}^2$.
- Kalman gain: $K_\infty = 0.375$.
- Posterior steady-state variance: $p_\infty^+ = 0.375\text{ V}^2$.
- Open-loop variance: $p_{\text{open}} = 1.00\text{ V}^2$ ($62.5\%$ reduction achieved by Kalman filter).

**Verification:**
Predict step check: $p_\infty^- = a^2 p_\infty^+ + q = (0.64)(0.375) + 0.36 = 0.24 + 0.36 = 0.60\text{ V}^2$. Matches perfectly.

---

#### Problem 3.4: Filter Overconfidence and Divergence Under Zero Process Noise ($q = 0$)
**Statement:**
An engineer mistakenly assumes that a physical system has zero process disturbance, setting $q = 0$ for a random constant parameter $x_k = x_{k-1}$ ($a = 1, b = 0, c = 1$).
Measurement noise is $r = 1.0$. The initial variance is $p_0 = 1.0$.
1. Derive a closed-form formula for $p_{k|k}$ and $K_k$ as a function of time step $k$.
2. Compute the Kalman gain at $k = 1, 10, 100, 1000$.
3. Explain why the filter becomes completely "blind" to genuine physical parameter shifts when $q = 0$.

**Given Data:**
- $a = 1, c = 1, q = 0, r = 1.0, p_0 = 1.0$.

**Step-by-Step Derivation:**
1. **Recurrence Relation:**
   - At $k = 1$:
     $$p_{1|0} = p_0 + q = 1.0 + 0 = 1.0$$
     $$K_1 = \frac{p_{1|0}}{p_{1|0} + r} = \frac{1.0}{1.0 + 1.0} = \frac{1}{2} = 0.5$$
     $$p_{1|1} = (1 - K_1) p_{1|0} = \frac{1}{2} (1.0) = \frac{1}{2}\text{ m}^2$$
   - At $k = 2$:
     $$p_{2|1} = p_{1|1} + 0 = \frac{1}{2}$$
     $$K_2 = \frac{1/2}{1/2 + 1} = \frac{1/2}{3/2} = \frac{1}{3}$$
     $$p_{2|2} = \left(1 - \frac{1}{3}\right) \frac{1}{2} = \frac{2}{3} \times \frac{1}{2} = \frac{1}{3}$$
   - By mathematical induction, for any step $k$:
     $$p_{k|k} = \frac{1}{k + 1}$$
     $$p_{k+1|k} = p_{k|k} = \frac{1}{k + 1}$$
     $$K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r} = \frac{\frac{1}{k}}{\frac{1}{k} + 1} = \frac{1}{k + 1}$$
2. **Gain Values:**
   - $k = 1$: $K_1 = 1/2 = 0.500$
   - $k = 10$: $K_{10} = 1/11 \approx 0.0909$
   - $k = 100$: $K_{100} = 1/101 \approx 0.00990$
   - $k = 1000$: $K_{1000} = 1/1001 \approx 0.000999$
3. **Filter Blindness / Divergence:**
   As $k \to \infty$, $K_k \to 0$.
   If at $k = 500$, the physical parameter suddenly jumps from $x = 0$ to $x = 10$, the innovation residual becomes $y = 10 - 0 = 10$.
   However, the state update is:
   $$\hat{x} \leftarrow \hat{x} + K_{500}(10) = 0 + \left(\frac{1}{501}\right)(10) \approx 0.02$$
   The filter ignores the $10\text{-unit}$ jump because it has concluded that its error variance is essentially zero ($p \approx 0.002$). Setting $q > 0$ keeps $p$ bounded away from zero, preserving the filter's agility.

**Final Answer:**
- Closed-form formulas: $p_{k|k} = \frac{1}{k + 1}$, $K_k = \frac{1}{k + 1}$.
- Gains: $K_1 = 0.5, K_{10} \approx 0.091, K_{100} \approx 0.0099, K_{1000} \approx 0.001$.
- Physical consequence: Filter divergence (permanent loss of adaptivity caused by $q = 0$).

**Verification:**
Sample average estimator: $\hat{x}_k = \frac{1}{k} \sum_{i=1}^k z_i$ has exact recursive update $\hat{x}_k = \hat{x}_{k-1} + \frac{1}{k}(z_k - \hat{x}_{k-1})$, which matches the Kalman update when $p_0 \to \infty$.

---

#### Problem 3.5: Influence of Measurement Scale Factor $c \neq 1$
**Statement:**
A depth sensor measures water depth $x$ in feet, but the transducer output is digitized as an electrical voltage $z = 0.2 x + v$ ($c = 0.2\text{ V/ft}$).
Sensor voltage noise has variance $r = 0.04\text{ V}^2$ ($\sigma_v = 0.2\text{ V}$).
Process depth disturbance is $q = 0.5\text{ ft}^2$, and the depth remains nominally constant ($a = 1, b = 0$).
Given a prior estimate with variance $p_{k|k-1} = 2.0\text{ ft}^2$:
1. Compute the innovation variance $s_k$.
2. Compute the optimal Kalman gain $K_k$ and state its physical units.
3. If an innovation voltage residual $y_k = 0.6\text{ V}$ is observed, compute the depth correction $\Delta \hat{x}_k$.
4. Compute the updated posterior variance $p_{k|k}$.

**Given Data:**
- $a = 1, c = 0.2\text{ V/ft}, r = 0.04\text{ V}^2, q = 0.5\text{ ft}^2, p_{k|k-1} = 2.0\text{ ft}^2$.
- Residual: $y_k = 0.6\text{ V}$.

**Step-by-Step Derivation:**
1. **Innovation Variance:**
   $$s_k = c^2 p_{k|k-1} + r = (0.2)^2 (2.0) + 0.04 = (0.04)(2.0) + 0.04 = 0.08 + 0.04 = 0.12\text{ V}^2$$
2. **Kalman Gain:**
   $$K_k = \frac{c \, p_{k|k-1}}{s_k} = \frac{0.2 \times 2.0}{0.12} = \frac{0.40}{0.12} = \frac{10}{3} \approx 3.3333\text{ ft/V}$$
   The units of $K_k$ are $[\text{state units}] / [\text{measurement units}] = \text{ft/V}$.
3. **State Correction:**
   $$\Delta \hat{x}_k = K_k y_k = \left(\frac{10}{3}\text{ ft/V}\right) (0.6\text{ V}) = \frac{6.0}{3} = 2.0\text{ ft}$$
4. **Posterior Variance:**
   $$p_{k|k} = (1 - K_k c) p_{k|k-1} = \left( 1 - \frac{10}{3} \times 0.2 \right) (2.0) = \left( 1 - \frac{2}{3} \right)(2.0) = \left(\frac{1}{3}\right)(2.0) = \frac{2}{3} \approx 0.6667\text{ ft}^2$$

**Final Answer:**
- Innovation variance: $s_k = 0.12\text{ V}^2$.
- Kalman gain: $K_k = 10/3 \approx 3.333\text{ ft/V}$.
- Depth correction: $\Delta \hat{x} = 2.0\text{ ft}$.
- Posterior variance: $p_{k|k} = 2/3 \approx 0.667\text{ ft}^2$.

**Verification:**
Equivalent sensor noise in state units: $r_{\text{state}} = r / c^2 = 0.04 / 0.04 = 1.0\text{ ft}^2$.
Using standard $c=1$ formula: $K_{\text{state}} = \frac{p}{p + r_{\text{state}}} = \frac{2.0}{2.0 + 1.0} = \frac{2}{3}$.
Then $K = K_{\text{state}} / c = (2/3) / 0.2 = 10/3\text{ ft/V}$.
Posterior variance: $p_{\text{post}} = (1 - K_{\text{state}}) p = (1 - 2/3)(2.0) = 2/3\text{ ft}^2$. Exact match.

---

#### Problem 3.6: Innovation Sequence Whiteness Verification
**Statement:**
Let $y_k = z_k - c \hat{x}_{k|k-1}$ be the innovation sequence of a scalar Kalman filter.
Prove analytically that under optimal filter tuning:
1. $\mathbb{E}[y_k] = 0$ (zero mean).
2. $\mathbb{E}[y_j y_k] = 0$ for all $j \neq k$ (white noise property).

**Given Data:**
- $z_k = c x_k + v_k$, $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$.

**Step-by-Step Derivation:**
1. Express innovation in terms of estimation error and measurement noise:
   $$y_k = (c x_k + v_k) - c \hat{x}_{k|k-1} = c(x_k - \hat{x}_{k|k-1}) + v_k = c \tilde{x}_{k|k-1} + v_k$$
2. **Zero Mean:**
   $$\mathbb{E}[y_k] = c \mathbb{E}[\tilde{x}_{k|k-1}] + \mathbb{E}[v_k] = c(0) + 0 = 0$$
3. **Autocorrelation for $j < k$:**
   Consider an earlier step $j < k$. The innovation at step $j$ is $y_j$.
   Note that the prediction $\hat{x}_{k|k-1}$ is conditioned on all measurements up to step $k-1$, which includes $z_j$ and $y_j$:
   $$\mathbb{E}[y_k \mid z_{1:k-1}] = c \mathbb{E}[\tilde{x}_{k|k-1} \mid z_{1:k-1}] + \mathbb{E}[v_k \mid z_{1:k-1}] = 0 + 0 = 0$$
4. Using the law of total expectation:
   $$\mathbb{E}[y_j y_k] = \mathbb{E}\left[ \mathbb{E}[y_j y_k \mid z_{1:k-1}] \right] = \mathbb{E}\left[ y_j \mathbb{E}[y_k \mid z_{1:k-1}] \right] = \mathbb{E}[y_j \cdot 0] = 0$$
5. Therefore:
   $$\mathbb{E}[y_j y_k] = s_k \delta_{jk}$$
   The innovation sequence is strictly white.

**Final Answer:**
- $\mathbb{E}[y_k] = 0$ and $\mathbb{E}[y_j y_k] = 0$ for all $j \neq k$.
- Proves that all predictable information has been extracted; only pure white noise remains.

**Verification:**
If $\mathbb{E}[y_j y_k] \neq 0$, the residual would contain predictable structure, which contradicts the optimality of the Kalman filter.

---

#### Problem 3.7: Monotonic Variance Contraction Proof
**Statement:**
Prove that for any valid scalar measurement with sensitivity $c \neq 0$ and noise variance $r > 0$, the posterior variance $p_{k|k}$ is strictly less than the prior variance $p_{k|k-1}$, provided $p_{k|k-1} > 0$.

**Given Data:**
- $p_{k|k} = (1 - K_k c) p_{k|k-1}$ where $K_k = \frac{c p_{k|k-1}}{c^2 p_{k|k-1} + r}$.

**Step-by-Step Derivation:**
1. Substitute $K_k$ into the variance update formula:
   $$p_{k|k} = \left( 1 - \frac{c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} \right) p_{k|k-1}$$
2. Combine into a single fraction:
   $$1 - \frac{c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} = \frac{(c^2 p_{k|k-1} + r) - c^2 p_{k|k-1}}{c^2 p_{k|k-1} + r} = \frac{r}{c^2 p_{k|k-1} + r}$$
3. Therefore:
   $$p_{k|k} = \frac{r p_{k|k-1}}{c^2 p_{k|k-1} + r} = p_{k|k-1} \left( \frac{r}{c^2 p_{k|k-1} + r} \right)$$
4. Since $c \neq 0$ and $p_{k|k-1} > 0$, the product $c^2 p_{k|k-1} > 0$.
   Therefore:
   $$c^2 p_{k|k-1} + r > r \implies \frac{r}{c^2 p_{k|k-1} + r} < 1$$
5. Multiplying by positive $p_{k|k-1}$:
   $$p_{k|k} < p_{k|k-1}$$
   The uncertainty strictly decreases.

**Final Answer:**
- $p_{k|k} = p_{k|k-1} \left(\frac{r}{c^2 p_{k|k-1} + r}\right) < p_{k|k-1}$ proven rigorously.

**Verification:**
The difference is $\Delta p = p_{k|k-1} - p_{k|k} = \frac{c^2 p_{k|k-1}^2}{c^2 p_{k|k-1} + r} = K_k^2 s_k > 0$, confirming positive variance reduction.

---

#### Problem 3.8: Closed-Loop Pole and Time Constant of the Error Dynamics
**Statement:**
Consider a scalar state $x_k = a x_{k-1} + w_k$ updated with steady-state gain $K_\infty$ and $c = 1$.
1. Derive the closed-loop error dynamics equation $\tilde{x}_{k|k} = \lambda_{\text{cl}} \tilde{x}_{k-1|k-1} + \dots$
2. Express the closed-loop eigenvalue $\lambda_{\text{cl}}$ in terms of $a$ and $K_\infty$.
3. For $a = 1.0$ and $K_\infty = 0.4$, compute the discrete closed-loop pole $\lambda_{\text{cl}}$ and the equivalent exponential decay time constant in steps $\tau_{\text{steps}} = -\frac{1}{\ln(\lambda_{\text{cl}})}$.

**Given Data:**
- $a = 1.0, c = 1, K_\infty = 0.4$.

**Step-by-Step Derivation:**
1. State update:
   $$\hat{x}_{k|k} = a \hat{x}_{k-1|k-1} + K_\infty (x_k + v_k - a \hat{x}_{k-1|k-1})$$
   $$\hat{x}_{k|k} = (1 - K_\infty) a \hat{x}_{k-1|k-1} + K_\infty x_k + K_\infty v_k$$
2. True state:
   $$x_k = a x_{k-1} + w_k$$
3. Estimation error $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$:
   $$\tilde{x}_{k|k} = x_k - (1 - K_\infty) a \hat{x}_{k-1|k-1} - K_\infty x_k - K_\infty v_k = (1 - K_\infty) x_k - (1 - K_\infty) a \hat{x}_{k-1|k-1} - K_\infty v_k$$
   Substitute $x_k = a x_{k-1} + w_k$:
   $$\tilde{x}_{k|k} = (1 - K_\infty) (a x_{k-1} + w_k) - (1 - K_\infty) a \hat{x}_{k-1|k-1} - K_\infty v_k$$
   $$\tilde{x}_{k|k} = a(1 - K_\infty)(x_{k-1} - \hat{x}_{k-1|k-1}) + (1 - K_\infty) w_k - K_\infty v_k$$
   $$\tilde{x}_{k|k} = \underbrace{a(1 - K_\infty)}_{\lambda_{\text{cl}}} \tilde{x}_{k-1|k-1} + (1 - K_\infty) w_k - K_\infty v_k$$
4. Closed-loop pole:
   $$\lambda_{\text{cl}} = a(1 - K_\infty) = 1.0(1 - 0.4) = 0.60$$
5. Time constant:
   $$\tau_{\text{steps}} = -\frac{1}{\ln(\lambda_{\text{cl}})} = -\frac{1}{\ln(0.60)} = -\frac{1}{-0.510826} \approx 1.9576\text{ steps}$$

**Final Answer:**
- Error dynamics: $\tilde{x}_{k|k} = a(1 - K_\infty)\tilde{x}_{k-1|k-1} + \dots$
- Closed-loop pole: $\lambda_{\text{cl}} = a(1 - K_\infty) = 0.60$.
- Time constant: $\tau \approx 1.96\text{ steps}$ (errors decay by $63.2\%$ in less than 2 steps).

**Verification:**
After 5 steps, $(0.60)^5 = 0.07776$. Over $92.2\%$ of an initial estimation disturbance is eliminated.

---

#### Problem 3.9: Unstable Plant ($a > 1$) Stabilization by Kalman Filtering
**Statement:**
An inverted pendulum angle in the unstable regime behaves as $x_k = 1.2 x_{k-1} + w_k$ ($a = 1.2 > 1$).
Process noise variance is $q = 0.44$, and measurement noise variance is $r = 1.0$ ($c = 1$).
1. Explain why open-loop estimation divergence is exponential without measurements.
2. Solve the DARE to find the steady-state prior variance $p_\infty^-$.
3. Compute the closed-loop pole $\lambda_{\text{cl}} = a(1 - K_\infty)$ and verify that the estimation error dynamics are asymptotically stable ($|\lambda_{\text{cl}}| < 1$).

**Given Data:**
- $a = 1.2, c = 1, q = 0.44, r = 1.0$.

**Step-by-Step Derivation:**
1. **Open-Loop Divergence:**
   Without measurements ($K = 0$), $p_k = a^2 p_{k-1} + q = 1.44 p_{k-1} + 0.44$.
   Since $a^2 = 1.44 > 1$, the variance grows exponentially: $p_k \sim (1.44)^k \to \infty$.
2. **Algebraic Riccati Equation:**
   $$A = 1.0$$
   $$B = (1 - a^2)r - c^2 q = (1 - 1.44)(1.0) - (1)(0.44) = -0.44 - 0.44 = -0.88$$
   $$C = -q r = -(0.44)(1.0) = -0.44$$
   $$(p_\infty^-)^2 - 0.88 p_\infty^- - 0.44 = 0$$
   $$p_\infty^- = \frac{0.88 \pm \sqrt{(-0.88)^2 - 4(1)(-0.44)}}{2} = \frac{0.88 \pm \sqrt{0.7744 + 1.76}}{2} = \frac{0.88 \pm \sqrt{2.5344}}{2} = \frac{0.88 \pm 1.59198}{2}$$
   $$p_\infty^- = \frac{0.88 + 1.59198}{2} = \frac{2.47198}{2} \approx 1.23599$$
3. **Steady-State Gain:**
   $$K_\infty = \frac{p_\infty^-}{p_\infty^- + r} = \frac{1.23599}{1.23599 + 1.0} = \frac{1.23599}{2.23599} \approx 0.55277$$
4. **Closed-Loop Pole:**
   $$\lambda_{\text{cl}} = a(1 - K_\infty) = 1.2(1 - 0.55277) = 1.2(0.44723) \approx 0.536676$$
   Since $|\lambda_{\text{cl}}| = 0.5367 < 1.0$, the estimation error is **asymptotically stable**!

**Final Answer:**
- Prior variance: $p_\infty^- \approx 1.236$.
- Kalman gain: $K_\infty \approx 0.553$.
- Closed-loop pole: $\lambda_{\text{cl}} \approx 0.537 < 1.0$ (estimation error is exponentially stable despite unstable plant dynamics).

**Verification:**
Riccati formula check: $p_\infty^+ = (1 - K_\infty) p_\infty^- = (0.44723)(1.23599) \approx 0.55277$.
$a^2 p_\infty^+ + q = (1.44)(0.55277) + 0.44 = 0.79599 + 0.44 = 1.23599 = p_\infty^-$. Exact balance.

---

#### Problem 3.10: Optimal Tuning Trade-off: Tracking vs Noise Rejection
**Statement:**
A position tracking filter has sensor noise $r = 1.0$. The engineer must choose the process noise parameter $q$.
1. If $q$ is chosen very small ($q = 0.01$), compute the steady-state gain $K_\infty$, the closed-loop pole $\lambda_{\text{cl}}$, and evaluate noise filtering.
2. If $q$ is chosen very large ($q = 100.0$), compute $K_\infty$, $\lambda_{\text{cl}}$, and evaluate agility.
3. Formulate the engineering trade-off governed by $q/r$.

**Given Data:**
- $a = 1.0, c = 1.0, r = 1.0$. Case A: $q = 0.01$. Case B: $q = 100.0$.

**Step-by-Step Derivation:**
1. **Case A ($q = 0.01$, Small Process Noise):**
   DARE: $(p_\infty^-)^2 - q p_\infty^- - q r = 0 \implies (p_\infty^-)^2 - 0.01 p_\infty^- - 0.01 = 0$.
   $$p_\infty^- = \frac{0.01 + \sqrt{0.0001 + 0.04}}{2} = \frac{0.01 + \sqrt{0.0401}}{2} \approx \frac{0.01 + 0.20025}{2} \approx 0.1051$$
   $$K_\infty = \frac{0.1051}{1.1051} \approx 0.0951$$
   $$\lambda_{\text{cl}} = 1 - 0.0951 = 0.9049$$
   - Result: Heavy smoothing, excellent sensor noise rejection ($90\%$ of noise filtered out), but sluggish response (pole at $0.905$, slow tracking of maneuvers).
2. **Case B ($q = 100.0$, Large Process Noise):**
   DARE: $(p_\infty^-)^2 - 100 p_\infty^- - 100 = 0$.
   $$p_\infty^- = \frac{100 + \sqrt{10000 + 400}}{2} = \frac{100 + \sqrt{10400}}{2} \approx \frac{100 + 101.980}{2} \approx 100.99$$
   $$K_\infty = \frac{100.99}{101.99} \approx 0.9902$$
   $$\lambda_{\text{cl}} = 1 - 0.9902 = 0.0098$$
   - Result: Ultra-fast tracking ($\lambda_{\text{cl}} \approx 0.01$, step response in 1 tick), but virtually zero noise rejection ($99\%$ of sensor noise passes directly into estimate).
3. **Engineering Synthesis:**
   The ratio $\gamma = q / r$ is the fundamental signal-to-noise ratio of the estimator:
   - High $q/r \implies$ agile tracking, noisy estimates.
   - Low $q/r \implies$ smooth estimates, lagging tracking.

**Final Answer:**
- Case A ($q=0.01$): $K_\infty \approx 0.095, \lambda_{\text{cl}} \approx 0.905$ (high noise attenuation, slow tracking).
- Case B ($q=100$): $K_\infty \approx 0.990, \lambda_{\text{cl}} \approx 0.010$ (ultra-fast tracking, poor noise attenuation).
- Governed entirely by ratio $q/r$.

**Verification:**
Formula $\lim_{q/r \to 0} K_\infty = 0$ and $\lim_{q/r \to \infty} K_\infty = 1$. The numerical results match the theoretical limits.

---

### Section 2: Solved Exercises (Problems 3.11 – 3.20)

#### Problem 3.11: Convergence Rate to Steady-State Riccati Variance
**Statement:**
For the system $a = 1, c = 1, q = 1.0, r = 1.0$ with initial variance $p_0 = 10.0$:
1. Compute the steady-state prior variance $p_\infty^-$.
2. Compute $p_{1|0}, p_{2|1}, p_{3|2}, p_{4|3}$.
3. Show that the error $\delta p_k = p_{k|k-1} - p_\infty^-$ contracts geometrically.

**Given Data:**
- $a = 1, c = 1, q = 1, r = 1, p_0 = 10.0$.

**Step-by-Step Derivation:**
1. **Steady-State Variance:**
   DARE: $p^2 - p - 1 = 0 \implies p = \frac{1 + \sqrt{5}}{2} = \phi \approx 1.618034$ (the Golden Ratio!).
   $$p_\infty^- \approx 1.618034$$
2. **Step-by-Step Variance Propagation:**
   Recurrence: $p_{k+1|k} = \frac{p_{k|k-1} r}{p_{k|k-1} + r} + q = \frac{p_{k|k-1}}{p_{k|k-1} + 1} + 1$:
   - $k=0 \implies p_{1|0} = \frac{10}{10+1} + 1 = \frac{10}{11} + 1 = \frac{21}{11} \approx 1.90909$ ($\delta_1 = +0.291$)
   - $k=1 \implies p_{2|1} = \frac{21/11}{32/11} + 1 = \frac{21}{32} + 1 = \frac{53}{32} \approx 1.65625$ ($\delta_2 = +0.0382$)
   - $k=2 \implies p_{3|2} = \frac{53/32}{85/32} + 1 = \frac{53}{85} + 1 = \frac{138}{85} \approx 1.62353$ ($\delta_3 = +0.0055$)
   - $k=3 \implies p_{4|3} = \frac{138/85}{223/85} + 1 = \frac{138}{223} + 1 = \frac{361}{223} \approx 1.61883$ ($\delta_4 = +0.0008$)
3. **Geometric Contraction:**
   Notice the ratios of Fibonacci numbers: $\frac{21}{11}, \frac{53}{32}, \frac{138}{85}, \frac{361}{223}$.
   Error drops by a factor of $\approx 7\times$ on each iteration ($\frac{0.0382}{0.291} \approx 0.13, \frac{0.0055}{0.0382} \approx 0.14$).

**Final Answer:**
- $p_\infty^- = \frac{1+\sqrt{5}}{2} \approx 1.618$.
- Sequence: $p_{1|0} \approx 1.909, p_{2|1} \approx 1.656, p_{3|2} \approx 1.624, p_{4|3} \approx 1.619$.
- Geometric convergence to the Golden Ratio verified.

**Verification:**
The continued fraction expansion of the Golden Ratio generates this exact sequence.

---

#### Problem 3.12: Minimum Mean Squared Error (MMSE) Optimality of Scalar Gain
**Statement:**
Let $\hat{x} = \hat{x}^- + K (z - \hat{x}^-)$ be a linear estimator of $x$, where $z = x + v$.
Prove by direct differentiation that the mean squared error $J(K) = \mathbb{E}[(x - \hat{x})^2]$ is minimized strictly at $K = \frac{p^-}{p^- + r}$.

**Given Data:**
- Error: $e = x - \hat{x} = (x - \hat{x}^-) - K(x - \hat{x}^- + v) = (1 - K)\tilde{x}^- - K v$.

**Step-by-Step Derivation:**
1. Compute squared error:
   $$e^2 = (1 - K)^2 (\tilde{x}^-)^2 - 2 K(1 - K)\tilde{x}^- v + K^2 v^2$$
2. Take expectation, noting $\mathbb{E}[\tilde{x}^- v] = 0$:
   $$J(K) = \mathbb{E}[e^2] = (1 - K)^2 p^- + K^2 r = (1 - 2K + K^2) p^- + K^2 r = p^- - 2 K p^- + K^2 (p^- + r)$$
3. Differentiate with respect to scalar $K$:
   $$\frac{d J(K)}{d K} = -2 p^- + 2 K (p^- + r) = 0$$
4. Solve for $K$:
   $$2 K (p^- + r) = 2 p^- \implies K^* = \frac{p^-}{p^- + r}$$
5. Second derivative check:
   $$\frac{d^2 J}{d K^2} = 2 (p^- + r) > 0$$
   Since $p^- > 0$ and $r > 0$, the second derivative is strictly positive, guaranteeing a strict global minimum.

**Final Answer:**
- $K^* = \frac{p^-}{p^- + r}$ proven to uniquely minimize MSE.

**Verification:**
At $K = K^*$, $J(K^*) = p^- - 2\frac{(p^-)^2}{p^-+r} + \frac{(p^-)^2}{(p^-+r)^2}(p^-+r) = p^- - \frac{(p^-)^2}{p^-+r} = p^-(1 - K^*) = p^+$. Matches standard formula.

---

#### Problem 3.13: Correlation Between Prior Error and Measurement
**Statement:**
In a scalar Kalman filter with $c = 1$, compute the correlation between the a priori estimation error $\tilde{x}_{k|k-1}$ and the measurement $z_k$:
$$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k)$$

**Given Data:**
- $z_k = x_k + v_k$, $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$.

**Step-by-Step Derivation:**
1. Express $z_k$ in terms of $\hat{x}_{k|k-1}$ and $\tilde{x}_{k|k-1}$:
   $$z_k = (\hat{x}_{k|k-1} + \tilde{x}_{k|k-1}) + v_k$$
2. Compute covariance:
   $$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = \mathbb{E}[\tilde{x}_{k|k-1} (z_k - \mathbb{E}[z_k])]$$
   $$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = \mathbb{E}[\tilde{x}_{k|k-1} (\tilde{x}_{k|k-1} + v_k)] = \mathbb{E}[\tilde{x}_{k|k-1}^2] + \mathbb{E}[\tilde{x}_{k|k-1} v_k]$$
3. Because measurement noise $v_k$ is independent of the past state error:
   $$\mathbb{E}[\tilde{x}_{k|k-1} v_k] = 0$$
4. Therefore:
   $$\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = \mathbb{E}[\tilde{x}_{k|k-1}^2] = p_{k|k-1}$$

**Final Answer:**
- $\operatorname{Cov}(\tilde{x}_{k|k-1}, z_k) = p_{k|k-1}$.

**Verification:**
The measurement is inherently correlated with the prior estimation error by exactly the prior variance.

---

#### Problem 3.14: Correlation Between A Posteriori Error and Measurement Noise
**Statement:**
Show that after the measurement update, the a posteriori estimation error $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$ is correlated with the measurement noise $v_k$:
$$\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = -K_k r$$

**Given Data:**
- $\tilde{x}_{k|k} = (1 - K_k) \tilde{x}_{k|k-1} - K_k v_k$.

**Step-by-Step Derivation:**
1. Expand the error covariance with $v_k$:
   $$\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = \mathbb{E}[\tilde{x}_{k|k} v_k] = \mathbb{E}\left[ ((1 - K_k)\tilde{x}_{k|k-1} - K_k v_k) v_k \right]$$
2. Distribute expectation:
   $$\mathbb{E}[\tilde{x}_{k|k} v_k] = (1 - K_k) \mathbb{E}[\tilde{x}_{k|k-1} v_k] - K_k \mathbb{E}[v_k^2]$$
3. Since $\mathbb{E}[\tilde{x}_{k|k-1} v_k] = 0$ and $\mathbb{E}[v_k^2] = r$:
   $$\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = -K_k r$$

**Final Answer:**
- $\operatorname{Cov}(\tilde{x}_{k|k}, v_k) = -K_k r$.

**Verification:**
The negative sign reveals that if a measurement has a positive noise spike ($v_k > 0$), the updated estimate $\hat{x}_{k|k}$ overshoots upward, causing the true state error $\tilde{x}_{k|k} = x - \hat{x}$ to become negative.

---

#### Problem 3.15: Analytical Proof of Orthogonality of Innovation to Estimated State
**Statement:**
Prove that the a posteriori state estimate $\hat{x}_{k|k}$ is uncorrelated with the innovation residual $y_k$:
$$\mathbb{E}[\hat{x}_{k|k} y_k] = \dots \quad \text{Show that } \mathbb{E}[\tilde{x}_{k|k} y_k] = 0$$

**Given Data:**
- $\tilde{x}_{k|k} = (1 - K_k) \tilde{x}_{k|k-1} - K_k v_k$, $y_k = \tilde{x}_{k|k-1} + v_k$.

**Step-by-Step Derivation:**
1. Compute the product:
   $$\tilde{x}_{k|k} y_k = \left( (1 - K_k) \tilde{x}_{k|k-1} - K_k v_k \right) (\tilde{x}_{k|k-1} + v_k)$$
   $$= (1 - K_k) \tilde{x}_{k|k-1}^2 + (1 - K_k) \tilde{x}_{k|k-1} v_k - K_k \tilde{x}_{k|k-1} v_k - K_k v_k^2$$
2. Take expectation:
   $$\mathbb{E}[\tilde{x}_{k|k} y_k] = (1 - K_k) p_{k|k-1} - K_k r$$
3. Substitute optimal gain $K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r}$:
   $$(1 - K_k) p_{k|k-1} - K_k r = \left( \frac{r}{p_{k|k-1} + r} \right) p_{k|k-1} - \left( \frac{p_{k|k-1}}{p_{k|k-1} + r} \right) r = \frac{r p_{k|k-1} - p_{k|k-1} r}{p_{k|k-1} + r} = 0$$

**Final Answer:**
- $\mathbb{E}[\tilde{x}_{k|k} y_k] = 0$ identically.
- The posterior estimation error is strictly orthogonal to the measurement innovation.

**Verification:**
This is the celebrated **Orthogonality Principle** of optimal linear filtering.

---

#### Problem 3.16: Scalar Filter Sensitivity to Incorrect Noise Parameter Modeling
**Statement:**
A true physical system has noise parameters $q_{\text{true}} = 1.0$ and $r_{\text{true}} = 1.0$ ($a = 1, c = 1$).
An engineer incorrectly configures the Kalman filter with modeled values $q_{\text{model}} = 0.1$ and $r_{\text{model}} = 10.0$.
1. Compute the modeled steady-state gain $K_{\text{model}}$.
2. Compute the true steady-state estimation variance $p_{\text{actual}}$ achieved by this poorly tuned filter.
3. Compare $p_{\text{actual}}$ with the optimal variance $p_{\text{optimal}}$ achieved with correct noise models.

**Given Data:**
- True: $q = 1, r = 1$. Modeled: $q_m = 0.1, r_m = 10.0$.

**Step-by-Step Derivation:**
1. **Modeled Gain:**
   Modeled DARE: $p^2 - 0.1 p - 1.0 = 0 \implies p = \frac{0.1 + \sqrt{0.01 + 4.0}}{2} = \frac{0.1 + 2.0025}{2} \approx 1.05125$.
   $$K_{\text{model}} = \frac{1.05125}{1.05125 + 10.0} = \frac{1.05125}{11.05125} \approx 0.095125$$
2. **Actual Variance Under Suboptimal Gain:**
   Error dynamics with gain $K$:
   $$\tilde{x}_k = (1 - K) \tilde{x}_{k-1} + (1 - K) w_k - K v_k$$
   In steady state:
   $$p_{\text{actual}} = (1 - K)^2 p_{\text{actual}} + (1 - K)^2 q_{\text{true}} + K^2 r_{\text{true}}$$
   $$p_{\text{actual}} [1 - (1 - K)^2] = (1 - K)^2 q_{\text{true}} + K^2 r_{\text{true}}$$
   Notice $1 - (1 - K)^2 = 2K - K^2 = K(2 - K)$.
   $$p_{\text{actual}} = \frac{(1 - K)^2 q_{\text{true}} + K^2 r_{\text{true}}}{K(2 - K)}$$
   Substitute $K = 0.095125, q_{\text{true}} = 1.0, r_{\text{true}} = 1.0$:
   $$1 - K = 0.904875 \implies (1 - K)^2 = 0.818798$$
   $$K^2 = (0.095125)^2 = 0.009049$$
   $$\text{Numerator} = 0.818798(1.0) + 0.009049(1.0) = 0.827847$$
   $$\text{Denominator} = 0.095125 (2 - 0.095125) = 0.095125 \times 1.904875 \approx 0.181201$$
   $$p_{\text{actual}} = \frac{0.827847}{0.181201} \approx 4.56866$$
3. **Optimal Variance:**
   With true parameters $q = 1, r = 1$, from Problem 3.11:
   $$p_\infty^- \approx 1.618034, \quad K_{\text{opt}} = \frac{1.618034}{2.618034} \approx 0.618034$$
   $$p_{\text{optimal}} = (1 - 0.618034)(1.618034) = 0.381966 \times 1.618034 \approx 0.618034$$
4. **Degradation Ratio:**
   $$\frac{p_{\text{actual}}}{p_{\text{optimal}}} = \frac{4.5687}{0.6180} \approx 7.39$$
   Poor tuning increased the error variance by over $739\%$!

**Final Answer:**
- Modeled gain: $K_{\text{model}} \approx 0.0951$.
- Actual variance: $p_{\text{actual}} \approx 4.569$.
- Optimal variance: $p_{\text{optimal}} \approx 0.618$.
- Estimation variance increased by a factor of $7.4\times$.

**Verification:**
Under-reporting process noise causes the filter to heavily discount new measurements ($K \approx 0.095$ instead of $0.618$), creating massive tracking lag against real disturbances.

---

#### Problem 3.17: Infinite Impulse Response (IIR) Filter Equivalence
**Statement:**
Show that in steady state, a 1D scalar Kalman filter with $a = 1, c = 1$ is mathematically identical to a standard first-order exponential moving average (low-pass) filter:
$$\hat{x}_k = (1 - \alpha) \hat{x}_{k-1} + \alpha z_k$$
Express the smoothing factor $\alpha$ and the $3\text{ dB}$ cutoff frequency $f_c$ in terms of $K_\infty$ and sampling frequency $f_s$.

**Given Data:**
- Steady-state gain $K_\infty$, sampling frequency $f_s = 1/\Delta t$.

**Step-by-Step Derivation:**
1. Steady-state Kalman update:
   $$\hat{x}_k = \hat{x}_{k-1} + K_\infty (z_k - \hat{x}_{k-1}) = (1 - K_\infty) \hat{x}_{k-1} + K_\infty z_k$$
2. Equating with exponential moving average $\hat{x}_k = (1 - \alpha)\hat{x}_{k-1} + \alpha z_k$:
   $$\alpha \equiv K_\infty$$
3. Transfer function in Z-domain:
   $$X(z) = (1 - \alpha) z^{-1} X(z) + \alpha Z(z) \implies H(z) = \frac{X(z)}{Z(z)} = \frac{\alpha}{1 - (1 - \alpha) z^{-1}}$$
4. For discrete low-pass filter, the equivalent continuous cut-off frequency $\omega_c = 2\pi f_c$ satisfies:
   $$\alpha = 1 - e^{-\omega_c \Delta t} \approx \omega_c \Delta t = 2\pi f_c \Delta t = \frac{2\pi f_c}{f_s}$$
   $$f_c \approx \frac{K_\infty f_s}{2\pi}$$

**Final Answer:**
- $\alpha = K_\infty$.
- Cut-off frequency: $f_c \approx \frac{K_\infty f_s}{2\pi}$.

**Verification:**
At $K_\infty \to 1$, $f_c \to f_s / (2\pi)$ (all frequencies pass). At $K_\infty \to 0$, $f_c \to 0$ (all noise blocked).

---

#### Problem 3.18: Closed-Loop Variance Evolution with Missing Measurements
**Statement:**
A scalar Kalman filter operates in steady state with prior variance $p_\infty^- = 1.0$ and $q = 0.2$ ($a = 1, c = 1, r = 1$).
A communication dropout occurs, and no measurements arrive for 4 consecutive steps.
Calculate the prior variance $p_{k|k-1}$ for each of the 4 missed steps.

**Given Data:**
- $p_{1|0} = 1.0, q = 0.2, a = 1$. Missed measurements: $K = 0$.

**Step-by-Step Derivation:**
1. When a measurement is missed, no measurement update occurs:
   $$p_{k|k} = p_{k|k-1}$$
2. The variance propagation across each step is:
   $$p_{k+1|k} = a^2 p_{k|k} + q = p_{k|k-1} + q$$
3. Step-by-step:
   - Miss 1 ($k = 1$): $p_{1|1} = p_{1|0} = 1.0 \implies p_{2|1} = 1.0 + 0.2 = 1.20$
   - Miss 2 ($k = 2$): $p_{2|2} = p_{2|1} = 1.20 \implies p_{3|2} = 1.20 + 0.2 = 1.40$
   - Miss 3 ($k = 3$): $p_{3|3} = p_{3|2} = 1.40 \implies p_{4|3} = 1.40 + 0.2 = 1.60$
   - Miss 4 ($k = 4$): $p_{4|4} = p_{4|3} = 1.60 \implies p_{5|4} = 1.60 + 0.2 = 1.80$

**Final Answer:**
- Variances: $p_{2|1} = 1.20, p_{3|2} = 1.40, p_{4|3} = 1.60, p_{5|4} = 1.80$.
- Linear uncertainty accumulation during communication blackouts.

**Verification:**
$p_{k+m|k+m-1} = p_{k|k-1} + m \cdot q = 1.0 + 4(0.2) = 1.80$. Exact linear growth.

---

#### Problem 3.19: Optimal Gain When Prior and Measurement Variances are Equal
**Statement:**
If prior variance equals measurement noise variance ($p_{k|k-1} = r$) with $c = 1$:
1. Compute the Kalman gain $K_k$.
2. Compute the posterior variance $p_{k|k}$.
3. Show that the new estimate is the simple arithmetic average of prediction and measurement.

**Given Data:**
- $p_{k|k-1} = r, c = 1$.

**Step-by-Step Derivation:**
1. **Kalman Gain:**
   $$K_k = \frac{p_{k|k-1}}{p_{k|k-1} + r} = \frac{r}{r + r} = \frac{r}{2r} = \frac{1}{2} = 0.5$$
2. **Posterior Variance:**
   $$p_{k|k} = (1 - K_k) p_{k|k-1} = (1 - 0.5) r = 0.5 r = \frac{r}{2}$$
3. **State Update:**
   $$\hat{x}_{k|k} = (1 - K_k)\hat{x}_{k|k-1} + K_k z_k = 0.5 \hat{x}_{k|k-1} + 0.5 z_k = \frac{\hat{x}_{k|k-1} + z_k}{2}$$

**Final Answer:**
- Gain: $K_k = 0.5$.
- Posterior variance: $p_{k|k} = r/2$ (uncertainty halved).
- Estimate: Exactly equal to the arithmetic midpoint $\frac{\hat{x} + z}{2}$.

**Verification:**
When two sources have identical variance $r$, equal weighting ($w_1 = w_2 = 0.5$) is optimal, cutting variance in half.

---

#### Problem 3.20: Synthesis of the 1D Scalar Kalman Filter
**Statement:**
Synthesize a standalone, robust TypeScript function implementing a single tick of the scalar Kalman filter with clamping against negative variance.

**Given Data:**
- Inputs: `x_prev`, `p_prev`, `u`, `z`, `a`, `b`, `c`, `q`, `r`.

**Step-by-Step Derivation:**
1. Predict state: `x_prior = a * x_prev + b * u`
2. Predict variance: `p_prior = a * a * p_prev + q`
3. Innovation: `y = z - c * x_prior`
4. Innovation variance: `s = c * c * p_prior + r`
5. Gain: `K = (c * p_prior) / s`
6. State update: `x_post = x_prior + K * y`
7. Variance update: `p_post = Math.max(0, (1 - K * c) * p_prior)`

**Final Answer:**
```typescript
function scalarKalmanStep(
  x_prev: number, p_prev: number, u: number, z: number,
  a: number, b: number, c: number, q: number, r: number
): { x_post: number; p_post: number; K: number; y: number } {
  // 1. Predict
  const x_prior = a * x_prev + b * u;
  const p_prior = a * a * p_prev + q;
  // 2. Innovation
  const y = z - c * x_prior;
  const s = c * c * p_prior + r;
  // 3. Gain
  const K = (c * p_prior) / s;
  // 4. Update
  const x_post = x_prior + K * y;
  const p_post = Math.max(0, (1.0 - K * c) * p_prior);
  return { x_post, p_post, K, y };
}
```

**Verification:**
Running with inputs from Problem 3.1 reproduces $x_1 = 22.423, p_1 = 1.385, K_1 = 0.692$.


---

# Chapter 4: Linear Dynamic Systems and State-Space Modeling

## 4.1 Introduction: Continuous Physical Reality and Discrete Computation

Physical robots exist in a continuous temporal continuum governed by differential equations of Newtonian mechanics, electrodynamics, and fluid dynamics. However, the microprocessors and digital signal processors that compute state estimates operate in discrete time, triggered by periodic timer interrupts at rates such as $50\text{ Hz}$, $200\text{ Hz}$, or $1\text{ kHz}$.

Bridging the continuous-time physics of the robot:
$$\dot{x}(t) = A x(t) + B u(t) + G w_c(t)$$
and the discrete-time estimation recursion:
$$x_k = F x_{k-1} + B_d u_{k-1} + w_k$$
requires mathematically rigorous discretization. A naive forward Euler approximation ($\dot{x} \approx \frac{x_{k} - x_{k-1}}{\Delta t}$) introduces severe truncation errors, distorts system poles, and critically fails to capture the true covariance structure of process noise.

In this chapter, we develop the exact state-space formulation of continuous linear time-invariant (LTI) systems, derive the analytical matrix exponential for state transition, establish the continuous-to-discrete noise covariance integral, master Charles Van Loan’s unified block matrix exponential method, and formalize standard robotic motion models: Constant Velocity (CV), Constant Acceleration (CA), and the Singer Gauss-Markov acceleration model.

---

## 4.2 Continuous-Time State-Space Representation

A continuous-time linear time-invariant (LTI) dynamic system driven by deterministic control inputs and stochastic process noise is defined on $t \in [0, \infty)$ by:

$$\dot{x}(t) = A x(t) + B u(t) + G w_c(t)$$
$$z(t) = C x(t) + D u(t) + v_c(t)$$

where:
- $x(t) \in \mathbb{R}^n$ is the state vector.
- $u(t) \in \mathbb{R}^p$ is the known deterministic control input vector.
- $w_c(t) \in \mathbb{R}^q$ is zero-mean continuous white process noise with power spectral density matrix $Q_c \in \mathbb{S}_+^q$:
  $$\mathbb{E}[w_c(t)] = 0, \quad \mathbb{E}[w_c(t) w_c^T(\tau)] = Q_c \delta(t - \tau)$$
  where $\delta(t - \tau)$ is the Dirac delta function.
- $A \in \mathbb{R}^{n \times n}$ is the system dynamics matrix.
- $B \in \mathbb{R}^{n \times p}$ is the control input gain matrix.
- $G \in \mathbb{R}^{n \times q}$ is the noise input coupling matrix.
- $z(t) \in \mathbb{R}^m$ is the observation vector with continuous measurement noise $v_c(t)$.

### 4.2.1 The General Solution via Integrating Factors
To solve the linear vector differential equation over the sampling interval $[t_{k-1}, t_k]$ where $\Delta t = t_k - t_{k-1}$, we pre-multiply both sides by the matrix integrating factor $e^{-At}$:

$$e^{-At} \dot{x}(t) - e^{-At} A x(t) = e^{-At} B u(t) + e^{-At} G w_c(t)$$

Recognizing the left-hand side as the total time derivative $\frac{d}{dt}\left(e^{-At} x(t)\right)$:

$$\frac{d}{dt}\left(e^{-At} x(t)\right) = e^{-At} B u(t) + e^{-At} G w_c(t)$$

Integrating both sides from $t_{k-1}$ to $t_k$:

$$e^{-A t_k} x(t_k) - e^{-A t_{k-1}} x(t_{k-1}) = \int_{t_{k-1}}^{t_k} e^{-A \tau} B u(\tau) d\tau + \int_{t_{k-1}}^{t_k} e^{-A \tau} G w_c(\tau) d\tau$$

Multiplying through by $e^{A t_k}$ and setting $\tau' = t_k - \tau$:

$$x(t_k) = e^{A(t_k - t_{k-1})} x(t_{k-1}) + \int_{t_{k-1}}^{t_k} e^{A(t_k - \tau)} B u(\tau) d\tau + \int_{t_{k-1}}^{t_k} e^{A(t_k - \tau)} G w_c(\tau) d\tau$$

Under the standard Zero-Order Hold (ZOH) assumption, the control input $u(t)$ is held constant across the interval: $u(t) = u_{k-1}$ for $t \in [t_{k-1}, t_k)$. Substituting $\Delta t = t_k - t_{k-1}$ and $\lambda = t_k - \tau$:

$$x_k = F x_{k-1} + B_d u_{k-1} + w_k$$

where the discrete system matrices are defined by:
$$F = e^{A \Delta t}$$
$$B_d = \int_0^{\Delta t} e^{A \lambda} d\lambda \, B$$
$$w_k = \int_0^{\Delta t} e^{A(\Delta t - \tau)} G w_c(t_{k-1} + \tau) d\tau$$

---

## 4.3 The Discrete Process Noise Covariance $Q_k$

The discrete process disturbance vector $w_k$ is a linear functional of Gaussian white noise; hence, $w_k$ is a zero-mean discrete Gaussian random vector: $w_k \sim \mathcal{N}(0, Q_k)$.

### 4.3.1 Derivation of the Covariance Integral
The covariance matrix $Q_k = \mathbb{E}[w_k w_k^T]$ is computed by taking the expectation of the outer product of the integral:

$$Q_k = \mathbb{E}\left[ \left(\int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G w_c(t_{k-1} + \tau_1) d\tau_1\right) \left(\int_0^{\Delta t} e^{A(\Delta t - \tau_2)} G w_c(t_{k-1} + \tau_2) d\tau_2\right)^T \right]$$

Applying the transpose to the second integrand and pulling the deterministic matrices outside the expectation:

$$Q_k = \int_0^{\Delta t} \int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G \, \mathbb{E}[w_c(t_{k-1} + \tau_1) w_c^T(t_{k-1} + \tau_2)] \, G^T e^{A^T(\Delta t - \tau_2)} d\tau_1 d\tau_2$$

Using the white noise autocorrelation property $\mathbb{E}[w_c(t_1) w_c^T(t_2)] = Q_c \delta(\tau_1 - \tau_2)$:

$$Q_k = \int_0^{\Delta t} \int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G Q_c \delta(\tau_1 - \tau_2) G^T e^{A^T(\Delta t - \tau_2)} d\tau_1 d\tau_2$$

Evaluating the inner integral with respect to $\tau_2$ collapses the Dirac delta at $\tau_2 = \tau_1$:

$$Q_k = \int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G Q_c G^T e^{A^T(\Delta t - \tau_1)} d\tau_1$$

Substituting the dummy variable of integration $\tau = \Delta t - \tau_1$ (with $d\tau = -d\tau_1$, changing limits from $[0, \Delta t]$ to $[\Delta t, 0]$):

$$Q_k = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$$

This fundamental integral dictates the exact discrete covariance. Notice that even if the continuous noise enters only a subset of state derivatives (e.g. acceleration disturbance in a position-velocity model where $G = [0, 1]^T$), the matrix exponential $e^{A \tau}$ cross-couples the noise into velocity and position, generating non-zero off-diagonal covariance entries.

---

## 4.4 Analytical Discretization of Standard Kinematic Models

### 4.4.1 Constant Velocity (CV) Kinematic Model (1D)
In tracking and navigation, the 1D Constant Velocity model assumes position $p(t)$ and velocity $v(t) = \dot{p}(t)$, with unknown acceleration treated as zero-mean continuous white noise $w_c(t) \sim \mathcal{N}(0, \tilde{q})$:

$$\begin{bmatrix} \dot{p}(t) \\ \dot{v}(t) \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} p(t) \\ v(t) \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} w_c(t)$$

Here, $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, $G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$, and $Q_c = \tilde{q}$ (acceleration spectral density, in $\text{m}^2/\text{s}^3$).

#### State Transition Matrix $F$:
Since $A^2 = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$, the matrix exponential series terminates after two terms:
$$F = e^{A \Delta t} = I + A \Delta t = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$$

#### Process Noise Covariance $Q_k$:
Evaluating $e^{A \tau} G$:
$$e^{A \tau} G = \begin{bmatrix} 1 & \tau \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \tau \\ 1 \end{bmatrix}$$

The integrand is:
$$e^{A \tau} G Q_c G^T e^{A^T \tau} = \tilde{q} \begin{bmatrix} \tau \\ 1 \end{bmatrix} \begin{bmatrix} \tau & 1 \end{bmatrix} = \tilde{q} \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix}$$

Integrating element by element from $0$ to $\Delta t$:
$$Q_k = \tilde{q} \int_0^{\Delta t} \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix} d\tau = \tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$

This is the famous Continuous White Noise Acceleration (CWNA) covariance matrix. Notice the correlation coefficient:
$$\rho_{pv} = \frac{Q_{12}}{\sqrt{Q_{11} Q_{22}}} = \frac{\frac{1}{2} \Delta t^2}{\sqrt{\frac{1}{3} \Delta t^3 \cdot \Delta t}} = \frac{1/2}{\sqrt{1/3}} = \frac{\sqrt{3}}{2} \approx 0.8660$$
Position and velocity perturbations are positively correlated with a fixed correlation coefficient of $86.6\%$, regardless of the sampling interval $\Delta t$ or noise intensity $\tilde{q}$.

### 4.4.2 Piecewise Constant White Acceleration (Discrete Approximation)
An alternative heuristic often found in early literature assumes acceleration is constant over the sample interval $[t_{k-1}, t_k)$ with variance $\sigma_a^2$: $a_k \sim \mathcal{N}(0, \sigma_a^2)$. Under constant acceleration:
$$\Delta p = \frac{1}{2} a_k \Delta t^2, \quad \Delta v = a_k \Delta t$$
The noise vector is $w_k = \begin{bmatrix} \frac{1}{2} \Delta t^2 \\ \Delta t \end{bmatrix} a_k$.
Its covariance is:
$$Q_{\text{discrete}} = \mathbb{E}[w_k w_k^T] = \sigma_a^2 \begin{bmatrix} \frac{\Delta t^4}{4} & \frac{\Delta t^3}{2} \\ \frac{\Delta t^3}{2} & \Delta t^2 \end{bmatrix}$$
Here, the rank of $Q_{\text{discrete}}$ is strictly $1$ ($\det(Q) = \sigma_a^4 (\frac{\Delta t^6}{4} - \frac{\Delta t^6}{4}) = 0$). In contrast, the continuous-time integrated $Q_k$ derived in Section 4.4.1 has rank $2$ ($\det(Q_k) = \tilde{q}^2 (\frac{\Delta t^4}{3} - \frac{\Delta t^4}{4}) = \frac{\tilde{q}^2 \Delta t^4}{12} > 0$). Rank deficiency in $Q$ can cause numerical divergence and singularity in RTS smoothers. The continuous integration approach is mathematically superior and strictly preferred.

---

## 4.5 Constant Acceleration (CA) Kinematic Model (1D)

When tracking agile targets or maneuvering vehicles, acceleration cannot be modeled as white noise. The Constant Acceleration (CA) model augments the state with acceleration $a(t)$:
$$x(t) = \begin{bmatrix} p(t) \\ v(t) \\ a(t) \end{bmatrix}, \quad \dot{x}(t) = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix} x(t) + \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} w_j(t)$$
where $w_j(t) \sim \mathcal{N}(0, \tilde{q}_j)$ is continuous jerk white noise ($\text{m}^2/\text{s}^5$).

### 4.5.1 State Transition Matrix $F$:
Since $A^2 = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$ and $A^3 = 0$:
$$F = I + A \Delta t + \frac{1}{2} A^2 \Delta t^2 = \begin{bmatrix} 1 & \Delta t & \frac{1}{2} \Delta t^2 \\ 0 & 1 & \Delta t \\ 0 & 0 & 1 \end{bmatrix}$$

### 4.5.2 Process Covariance Matrix $Q_k$:
Evaluating $e^{A \tau} G$:
$$e^{A \tau} G = \begin{bmatrix} 1 & \tau & \frac{1}{2} \tau^2 \\ 0 & 1 & \tau \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \frac{1}{2} \tau^2 \\ \tau \\ 1 \end{bmatrix}$$

The outer product is:
$$e^{A \tau} G Q_c G^T e^{A^T \tau} = \tilde{q}_j \begin{bmatrix} \frac{1}{4} \tau^4 & \frac{1}{2} \tau^3 & \frac{1}{2} \tau^2 \\ \frac{1}{2} \tau^3 & \tau^2 & \tau \\ \frac{1}{2} \tau^2 & \tau & 1 \end{bmatrix}$$

Integrating each element from $0$ to $\Delta t$:
$$Q_k = \tilde{q}_j \begin{bmatrix} \frac{\Delta t^5}{20} & \frac{\Delta t^4}{8} & \frac{\Delta t^3}{6} \\ \frac{\Delta t^4}{8} & \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^3}{6} & \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$

$\det(Q_k) = \frac{\tilde{q}_j^3 \Delta t^9}{720} > 0$. The covariance is strictly positive-definite ($\mathbb{S}_{++}^3$).

---

## 4.6 The Singer Acceleration Model (Gauss-Markov Process)

In real physical targets (such as aircraft, ground robots, or evasive missiles), acceleration is neither white noise nor purely constant. An accelerating vehicle maintains a maneuver for an characteristic correlation time $\tau_m = 1/\alpha$ before returning to zero or changing direction.

Robert A. Singer (1970) modeled acceleration as a zero-mean stationary first-order Gauss-Markov process:
$$\dot{a}(t) = -\alpha a(t) + w_s(t)$$
where $\alpha = 1/\tau_m$ is the maneuver decay rate, and $w_s(t)$ has spectral density $Q_c = 2 \alpha \sigma_m^2$, ensuring that the steady-state variance of acceleration equals $\sigma_m^2$.

The full continuous state equation is:
$$\begin{bmatrix} \dot{p} \\ \dot{v} \\ \dot{a} \end{bmatrix} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & -\alpha \end{bmatrix} \begin{bmatrix} p \\ v \\ a \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} w_s(t)$$

The state transition matrix is:
$$F = e^{A \Delta t} = \begin{bmatrix} 1 & \Delta t & \frac{e^{-\alpha \Delta t} - 1 + \alpha \Delta t}{\alpha^2} \\ 0 & 1 & \frac{1 - e^{-\alpha \Delta t}}{\alpha} \\ 0 & 0 & e^{-\alpha \Delta t} \end{bmatrix}$$

Notice the asymptotic behavior:
- As $\alpha \to 0$ ($\tau_m \to \infty$, non-decaying acceleration), $F \to \begin{bmatrix} 1 & \Delta t & \frac{1}{2}\Delta t^2 \\ 0 & 1 & \Delta t \\ 0 & 0 & 1 \end{bmatrix}$, exactly recovering the Constant Acceleration model.
- As $\alpha \to \infty$ ($\tau_m \to 0$, instantaneous white acceleration), $a(t)$ decorrelates instantaneously, recovering the Constant Velocity model.

---

## 4.7 Van Loan's Method: Universal Numerical Discretization

When the system matrix $A$ is large, non-nilpotent, or contains complex cross-coupling (e.g. Coriolis terms or flexible modes), closed-form analytical integration of $Q_k = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$ is algebraically prohibitive.

In 1978, Charles F. Van Loan published a groundbreaking theorem showing that both $F$ and $Q_k$ can be computed simultaneously by taking a single matrix exponential of a $2n \times 2n$ block matrix.

### 4.7.1 Van Loan Theorem
Construct the block matrix $\mathcal{M} \in \mathbb{R}^{2n \times 2n}$:
$$\mathcal{M} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix}$$

Compute the matrix exponential of $\mathcal{M} \Delta t$:
$$\mathcal{E} = \exp(\mathcal{M} \Delta t) = \begin{bmatrix} \Phi_{11} & \Phi_{12} \\ 0 & \Phi_{22} \end{bmatrix}$$

Then:
$$\Phi_{22} = F^T = (e^{A \Delta t})^T \implies F = \Phi_{22}^T$$
$$\Phi_{12} = F^{-1} Q_k \implies Q_k = F \, \Phi_{12} = \Phi_{22}^T \Phi_{12}$$

### 4.7.2 Proof of Van Loan's Theorem
Consider the linear matrix differential equation:
$$\frac{d}{dt} \begin{bmatrix} \Phi_{11}(t) & \Phi_{12}(t) \\ 0 & \Phi_{22}(t) \end{bmatrix} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix} \begin{bmatrix} \Phi_{11}(t) & \Phi_{12}(t) \\ 0 & \Phi_{22}(t) \end{bmatrix}$$
with initial condition $\mathcal{E}(0) = I_{2n}$.

From the bottom-right block:
$$\dot{\Phi}_{22}(t) = A^T \Phi_{22}(t), \quad \Phi_{22}(0) = I \implies \Phi_{22}(t) = e^{A^T t} = (e^{At})^T$$
At $t = \Delta t$, $\Phi_{22}(\Delta t) = F^T$.

From the top-right block:
$$\dot{\Phi}_{12}(t) = -A \Phi_{12}(t) + G Q_c G^T \Phi_{22}(t) = -A \Phi_{12}(t) + G Q_c G^T e^{A^T t}$$
Applying the integrating factor $e^{At}$:
$$\frac{d}{dt}\left(e^{At} \Phi_{12}(t)\right) = e^{At} G Q_c G^T e^{A^T t}$$
Integrating from $0$ to $\Delta t$ with $\Phi_{12}(0) = 0$:
$$e^{A \Delta t} \Phi_{12}(\Delta t) = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau = Q_k$$
Pre-multiplying by $\Phi_{22}^T = e^{A \Delta t} = F$:
$$Q_k = F \, \Phi_{12}(\Delta t)$$
Since $\Phi_{12} = F^{-1} Q_k$, and $Q_k$ is symmetric, we can enforce symmetry numerically via $Q_k \leftarrow \frac{1}{2}(F \Phi_{12} + (F \Phi_{12})^T)$. $\blacksquare$

---

## 4.8 Mathematical Problem Set

### Problem 4.1 (Worked Example): Derivation of 1D Constant Velocity CWNA Matrices
**Problem Statement:** A 1D robotic rover follows continuous dynamics $\dot{p} = v, \dot{v} = w_c(t)$, where $w_c(t)$ has spectral density $\tilde{q} = 0.36\text{ m}^2/\text{s}^3$. For a sampling interval $\Delta t = 0.1\text{ s}$, compute the numerical values of the state transition matrix $F$ and the discrete process covariance matrix $Q_k$. Compute the standard deviations of position and velocity uncertainty introduced over one step.

**Given Data:**
- State: $x = [p, v]^T$
- Continuous matrices: $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, $G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$
- $\tilde{q} = 0.36\text{ m}^2/\text{s}^3$, $\Delta t = 0.1\text{ s}$.

**Step-by-Step Derivation:**
1. State transition matrix:
   $$F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1.0 & 0.1 \\ 0.0 & 1.0 \end{bmatrix}$$
2. Covariance matrix formula:
   $$Q_k = \tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
3. Computing components:
   $$\frac{\Delta t^3}{3} = \frac{0.001}{3} \approx 3.3333 \times 10^{-4}\text{ s}^3$$
   $$\frac{\Delta t^2}{2} = \frac{0.01}{2} = 5.0 \times 10^{-3}\text{ s}^2$$
   $$\Delta t = 0.1\text{ s}$$
4. Multiplying by $\tilde{q} = 0.36$:
   $$Q_{11} = 0.36 \times \frac{0.001}{3} = 1.2 \times 10^{-4}\text{ m}^2$$
   $$Q_{12} = Q_{21} = 0.36 \times 0.005 = 1.8 \times 10^{-3}\text{ m}^2/\text{s}$$
   $$Q_{22} = 0.36 \times 0.1 = 3.6 \times 10^{-2}\text{ m}^2/\text{s}^2$$
5. Standard deviations:
   $$\sigma_p = \sqrt{Q_{11}} = \sqrt{1.2 \times 10^{-4}} \approx 0.01095\text{ m} \approx 1.10\text{ cm}$$
   $$\sigma_v = \sqrt{Q_{22}} = \sqrt{0.036} \approx 0.1897\text{ m/s}$$

**Final Result:**
$$F = \begin{bmatrix} 1.0 & 0.1 \\ 0.0 & 1.0 \end{bmatrix}, \quad Q_k = \begin{bmatrix} 1.2 \times 10^{-4} & 1.8 \times 10^{-3} \\ 1.8 \times 10^{-3} & 3.6 \times 10^{-2} \end{bmatrix}$$
$$\sigma_p = 1.095\text{ cm}, \quad \sigma_v = 0.1897\text{ m/s}$$

---

### Problem 4.2 (Worked Example): Determinant and Condition Number of CWNA Covariance
**Problem Statement:** Prove that the determinant of the 2D CWNA covariance matrix $Q_k$ is strictly positive for any $\Delta t > 0, \tilde{q} > 0$. Compute the condition number $\kappa(Q_k)$ as a function of $\Delta t$ and evaluate it for $\Delta t = 0.01\text{ s}$.

**Step-by-Step Derivation:**
1. Determinant formula:
   $$\det(Q_k) = \det\left(\tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}\right) = \tilde{q}^2 \left( \frac{\Delta t^4}{3} - \frac{\Delta t^4}{4} \right) = \frac{\tilde{q}^2 \Delta t^4}{12}$$
   Since $\tilde{q} > 0$ and $\Delta t > 0$, $\det(Q_k) = \frac{\tilde{q}^2 \Delta t^4}{12} > 0$ strictly.
2. Eigenvalues of $Q_k$:
   $$\operatorname{tr}(Q_k) = \tilde{q} \Delta t \left(1 + \frac{\Delta t^2}{3}\right)$$
   For small $\Delta t \ll 1$, $\Delta t^2/3 \ll 1$, so $\operatorname{tr}(Q_k) \approx \tilde{q} \Delta t$.
   Since $\lambda_1 \lambda_2 = \det(Q_k)$ and $\lambda_1 + \lambda_2 = \operatorname{tr}(Q_k)$:
   $$\lambda_{\max} \approx \operatorname{tr}(Q_k) \approx \tilde{q} \Delta t$$
   $$\lambda_{\min} = \frac{\det(Q_k)}{\lambda_{\max}} \approx \frac{\tilde{q}^2 \Delta t^4 / 12}{\tilde{q} \Delta t} = \frac{\tilde{q} \Delta t^3}{12}$$
3. Condition number:
   $$\kappa(Q_k) = \frac{\lambda_{\max}}{\lambda_{\min}} \approx \frac{\tilde{q} \Delta t}{\frac{1}{12} \tilde{q} \Delta t^3} = \frac{12}{\Delta t^2}$$
4. For $\Delta t = 0.01\text{ s}$:
   $$\kappa(Q_k) \approx \frac{12}{(0.01)^2} = \frac{12}{10^{-4}} = 1.2 \times 10^5$$

**Final Result:**
$$\det(Q_k) = \frac{\tilde{q}^2 \Delta t^4}{12} > 0, \quad \kappa(Q_k) \approx \frac{12}{\Delta t^2} = 1.2 \times 10^5\text{ at }\Delta t = 0.01\text{ s}$$
*Physical Insight:* As sampling rate increases ($\Delta t \to 0$), the covariance matrix becomes extremely ill-conditioned ($\kappa \propto \Delta t^{-2}$), necessitating double precision arithmetic and Cholesky decomposition.

---

### Problem 4.3 (Worked Example): Deterministic Control Input Discretization $B_d$
**Problem Statement:** An electric robotic rail cart has state $x = [p, v]^T$ and motor input $u(t)$ generating force per unit mass (acceleration):
$$\dot{p} = v, \quad \dot{v} = -\gamma v + b_0 u(t)$$
where $\gamma = 0.5\text{ s}^{-1}$ is viscous friction and $b_0 = 2.0\text{ m}/(\text{s}^2 \cdot \text{V})$. Compute the continuous dynamics matrix $A$ and control matrix $B$. Derive the exact discrete matrices $F = e^{A \Delta t}$ and $B_d = \int_0^{\Delta t} e^{A \tau} d\tau B$ for $\Delta t = 0.2\text{ s}$.

**Step-by-Step Derivation:**
1. Continuous matrices:
   $$A = \begin{bmatrix} 0 & 1 \\ 0 & -\gamma \end{bmatrix}, \quad B = \begin{bmatrix} 0 \\ b_0 \end{bmatrix}$$
2. State transition matrix $F$:
   Eigenvalues of $A$ are $\lambda_1 = 0, \lambda_2 = -\gamma$.
   Using inverse Laplace transform $\mathcal{L}^{-1}\{(sI - A)^{-1}\}$:
   $$(sI - A)^{-1} = \begin{bmatrix} s & -1 \\ 0 & s + \gamma \end{bmatrix}^{-1} = \frac{1}{s(s+\gamma)} \begin{bmatrix} s+\gamma & 1 \\ 0 & s \end{bmatrix} = \begin{bmatrix} \frac{1}{s} & \frac{1}{s(s+\gamma)} \\ 0 & \frac{1}{s+\gamma} \end{bmatrix}$$
   Partial fraction expansion: $\frac{1}{s(s+\gamma)} = \frac{1}{\gamma}\left(\frac{1}{s} - \frac{1}{s+\gamma}\right)$.
   Taking inverse Laplace transform:
   $$e^{At} = \begin{bmatrix} 1 & \frac{1 - e^{-\gamma t}}{\gamma} \\ 0 & e^{-\gamma t} \end{bmatrix}$$
   At $\Delta t = 0.2, \gamma = 0.5$: $\gamma \Delta t = 0.1$.
   $$e^{-0.1} \approx 0.904837$$
   $$\frac{1 - e^{-0.1}}{0.5} = \frac{0.095163}{0.5} = 0.190325\text{ s}$$
   $$F = \begin{bmatrix} 1.0 & 0.190325 \\ 0.0 & 0.904837 \end{bmatrix}$$
3. Discrete input matrix $B_d$:
   $$B_d = \int_0^{\Delta t} \begin{bmatrix} 1 & \frac{1 - e^{-\gamma \tau}}{\gamma} \\ 0 & e^{-\gamma \tau} \end{bmatrix} \begin{bmatrix} 0 \\ b_0 \end{bmatrix} d\tau = b_0 \int_0^{\Delta t} \begin{bmatrix} \frac{1 - e^{-\gamma \tau}}{\gamma} \\ e^{-\gamma \tau} \end{bmatrix} d\tau$$
   Top entry:
   $$\int_0^{\Delta t} \frac{1 - e^{-\gamma \tau}}{\gamma} d\tau = \frac{1}{\gamma}\left[\tau + \frac{e^{-\gamma \tau}}{\gamma}\right]_0^{\Delta t} = \frac{1}{\gamma}\left(\Delta t + \frac{e^{-\gamma \Delta t} - 1}{\gamma}\right) = \frac{\Delta t}{\gamma} - \frac{1 - e^{-\gamma \Delta t}}{\gamma^2}$$
   Evaluating numerically:
   $$\frac{0.2}{0.5} - \frac{0.095163}{0.25} = 0.4 - 0.380652 = 0.019348$$
   Bottom entry:
   $$\int_0^{\Delta t} e^{-\gamma \tau} d\tau = \frac{1 - e^{-\gamma \Delta t}}{\gamma} = \frac{0.095163}{0.5} = 0.190325$$
   Multiplying by $b_0 = 2.0$:
   $$B_d = \begin{bmatrix} 2.0 \times 0.019348 \\ 2.0 \times 0.190325 \end{bmatrix} = \begin{bmatrix} 0.038696 \\ 0.380650 \end{bmatrix}$$

**Final Result:**
$$F = \begin{bmatrix} 1.0 & 0.190325 \\ 0.0 & 0.904837 \end{bmatrix}, \quad B_d = \begin{bmatrix} 0.03870 \\ 0.38065 \end{bmatrix}$$

---

### Problem 4.4 (Worked Example): Van Loan Matrix Exponential Verification
**Problem Statement:** Consider a scalar damped velocity state $\dot{v} = -a v + w_c(t)$ with $a = 2.0\text{ s}^{-1}$, $w_c(t)$ spectral density $Q_c = 4.0\text{ (m/s)}^2/\text{s}$, and $\Delta t = 0.5\text{ s}$.
1. Analytically calculate $F = e^{-a \Delta t}$ and $Q_k = \int_0^{\Delta t} e^{-2 a \tau} Q_c d\tau$.
2. Form the Van Loan matrix $\mathcal{M} = \begin{bmatrix} a & Q_c \\ 0 & -a \end{bmatrix}$ and show that its matrix exponential yields the exact same $F$ and $Q_k$.

**Step-by-Step Derivation:**
1. Analytical calculation:
   $$F = e^{-2 \times 0.5} = e^{-1.0} \approx 0.367879$$
   $$Q_k = \int_0^{0.5} e^{-4 \tau} (4.0) d\tau = 4.0 \left[ \frac{1 - e^{-4 \times 0.5}}{4} \right] = 1 - e^{-2.0} = 1 - 0.135335 = 0.864665\text{ (m/s)}^2$$
2. Van Loan matrix formulation:
   In our 1D case, $A = [-a] = [-2]$.
   $$\mathcal{M} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix} = \begin{bmatrix} 2 & 4 \\ 0 & -2 \end{bmatrix}$$
   Multiply by $\Delta t = 0.5$:
   $$\mathcal{M} \Delta t = \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix}$$
3. Matrix exponential $\exp(\mathcal{M} \Delta t)$:
   Note that $(\mathcal{M} \Delta t)^2 = \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I_2$.
   Any matrix whose square is $I$ satisfies:
   $$\exp(M) = \cosh(1) I + \sinh(1) M$$
   $$\cosh(1) = \frac{e + e^{-1}}{2} \approx 1.543081, \quad \sinh(1) = \frac{e - e^{-1}}{2} \approx 1.175201$$
   $$\mathcal{E} = 1.543081 \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + 1.175201 \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 2.718282 & 2.350402 \\ 0 & 0.367879 \end{bmatrix}$$
4. Extracting Van Loan blocks:
   $$\Phi_{22} = 0.367879 \implies F = \Phi_{22}^T = 0.367879 = e^{-1}$$
   $$\Phi_{12} = 2.350402$$
   $$Q_k = F \Phi_{12} = 0.367879 \times 2.350402 = 0.864665$$

**Final Result:**
$$F = 0.367879, \quad Q_k = 0.864665\text{ (m/s)}^2$$
The Van Loan method produces the identical result to 6 decimal places.

---

### Problem 4.5 (Worked Example): 2D Coordinated Turn (CT) Model Discretization
**Problem Statement:** A planar drone executes a coordinated turn with constant turn rate $\omega = 0.2\text{ rad/s}$. The state is $x = [p_x, v_x, p_y, v_y]^T$, with continuous dynamics:
$$\dot{p}_x = v_x, \quad \dot{v}_x = -\omega v_y, \quad \dot{p}_y = v_y, \quad \dot{v}_y = \omega v_x$$
Derive the closed-form discrete state transition matrix $F = e^{A \Delta t}$ for sampling interval $\Delta t = 0.5\text{ s}$.

**Step-by-Step Derivation:**
1. Grouping coordinates: write $A$ in block form or reorder state to $[p_x, p_y, v_x, v_y]^T$:
   Let $p = [p_x, p_y]^T, v = [v_x, v_y]^T$.
   $$\dot{p} = v, \quad \dot{v} = \Omega v, \quad \Omega = \begin{bmatrix} 0 & -\omega \\ \omega & 0 \end{bmatrix}$$
2. State transition for velocity:
   Since $\Omega^2 = -\omega^2 I_2$:
   $$e^{\Omega t} = \cos(\omega t) I_2 + \frac{\sin(\omega t)}{\omega} \Omega = \begin{bmatrix} \cos(\omega t) & -\sin(\omega t) \\ \sin(\omega t) & \cos(\omega t) \end{bmatrix} = R(\omega t)$$
   This is the standard 2D rotation matrix.
3. Position transition:
   $$p(t) = p(0) + \int_0^t e^{\Omega \tau} d\tau \, v(0)$$
   $$\int_0^t R(\omega \tau) d\tau = \begin{bmatrix} \frac{\sin(\omega t)}{\omega} & -\frac{1 - \cos(\omega t)}{\omega} \\ \frac{1 - \cos(\omega t)}{\omega} & \frac{\sin(\omega t)}{\omega} \end{bmatrix}$$
4. Numerical evaluation at $\omega = 0.2\text{ rad/s}, \Delta t = 0.5\text{ s}$:
   $$\theta = \omega \Delta t = 0.2 \times 0.5 = 0.1\text{ rad}$$
   $$\cos(0.1) \approx 0.995004, \quad \sin(0.1) \approx 0.099833$$
   $$\frac{\sin(0.1)}{0.2} = 0.499167\text{ s}, \quad \frac{1 - \cos(0.1)}{0.2} = \frac{0.004996}{0.2} = 0.024979\text{ s}$$
5. Full $4 \times 4$ state transition matrix:
   $$F = \begin{bmatrix} 1 & 0.499167 & 0 & -0.024979 \\ 0 & 0.995004 & 0 & -0.099833 \\ 0 & 0.024979 & 1 & 0.499167 \\ 0 & 0.099833 & 0 & 0.995004 \end{bmatrix}$$

**Final Result:**
$$F(\Delta t) = \begin{bmatrix} 1 & \frac{\sin(\omega \Delta t)}{\omega} & 0 & -\frac{1 - \cos(\omega \Delta t)}{\omega} \\ 0 & \cos(\omega \Delta t) & 0 & -\sin(\omega \Delta t) \\ 0 & \frac{1 - \cos(\omega \Delta t)}{\omega} & 1 & \frac{\sin(\omega \Delta t)}{\omega} \\ 0 & \sin(\omega \Delta t) & 0 & \cos(\omega \Delta t) \end{bmatrix}$$

---

### Problem 4.6 (Worked Example): Singer Acceleration Model Discretization
**Problem Statement:** An agile quadrotor has maneuver time constant $\tau_m = 5.0\text{ s}$ ($\alpha = 0.2\text{ s}^{-1}$) and maneuver acceleration variance $\sigma_m^2 = 4.0\text{ m}^2/\text{s}^4$. Compute the discrete state transition matrix $F$ and the discrete acceleration variance $Q_{33}$ for $\Delta t = 0.1\text{ s}$.

**Step-by-Step Derivation:**
1. Given parameters: $\alpha = 0.2$, $\Delta t = 0.1 \implies \alpha \Delta t = 0.02$.
   $$e^{-\alpha \Delta t} = e^{-0.02} \approx 0.980199$$
2. Computing elements of $F$:
   $$F_{11} = 1.0, \quad F_{12} = \Delta t = 0.1$$
   $$F_{13} = \frac{e^{-\alpha \Delta t} - 1 + \alpha \Delta t}{\alpha^2} = \frac{0.980199 - 1 + 0.02}{0.04} = \frac{0.00019867}{0.04} = 0.004967\text{ s}^2$$
   *(Notice that $\frac{1}{2}\Delta t^2 = 0.005$, very close).*
   $$F_{22} = 1.0, \quad F_{23} = \frac{1 - e^{-\alpha \Delta t}}{\alpha} = \frac{1 - 0.980199}{0.2} = \frac{0.019801}{0.2} = 0.099007\text{ s}$$
   $$F_{33} = e^{-\alpha \Delta t} = 0.980199$$
3. Discrete acceleration variance $Q_{33}$:
   From the Singer model, continuous noise spectral density is $Q_c = 2 \alpha \sigma_m^2 = 2 (0.2) (4.0) = 1.6\text{ m}^2/\text{s}^5$.
   $$Q_{33} = \int_0^{\Delta t} e^{-2\alpha \tau} Q_c d\tau = Q_c \left[\frac{1 - e^{-2\alpha \Delta t}}{2\alpha}\right] = 2\alpha \sigma_m^2 \frac{1 - e^{-2\alpha \Delta t}}{2\alpha} = \sigma_m^2 (1 - e^{-2\alpha \Delta t})$$
4. Numerical evaluation:
   $$2\alpha \Delta t = 0.04 \implies e^{-0.04} \approx 0.960789$$
   $$Q_{33} = 4.0 \times (1 - 0.960789) = 4.0 \times 0.039211 = 0.15684\text{ m}^2/\text{s}^4$$

**Final Result:**
$$F = \begin{bmatrix} 1.0 & 0.1 & 0.004967 \\ 0.0 & 1.0 & 0.099007 \\ 0.0 & 0.0 & 0.980199 \end{bmatrix}, \quad Q_{33} = 0.15684\text{ m}^2/\text{s}^4$$

---

### Problem 4.7 (Worked Example): CA Model Jerk Discretization
**Problem Statement:** A robotic elevator follows a Constant Acceleration model driven by jerk white noise with $\tilde{q}_j = 0.05\text{ m}^2/\text{s}^5$ and $\Delta t = 0.2\text{ s}$. Compute the complete $3 \times 3$ matrix $Q_k$ and the correlation coefficient $\rho_{pa}$ between position and acceleration.

**Step-by-Step Derivation:**
1. Using the formula derived in Section 4.5.2:
   $$Q_k = \tilde{q}_j \begin{bmatrix} \frac{\Delta t^5}{20} & \frac{\Delta t^4}{8} & \frac{\Delta t^3}{6} \\ \frac{\Delta t^4}{8} & \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^3}{6} & \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
2. Evaluating powers of $\Delta t = 0.2$:
   $$\Delta t = 0.2, \quad \Delta t^2 = 0.04, \quad \Delta t^3 = 0.008, \quad \Delta t^4 = 0.0016, \quad \Delta t^5 = 0.00032$$
3. Dividing by coefficients:
   $$\frac{\Delta t^5}{20} = 1.6 \times 10^{-5}, \quad \frac{\Delta t^4}{8} = 2.0 \times 10^{-4}, \quad \frac{\Delta t^3}{6} \approx 1.3333 \times 10^{-3}$$
   $$\frac{\Delta t^3}{3} \approx 2.6667 \times 10^{-3}, \quad \frac{\Delta t^2}{2} = 2.0 \times 10^{-2}, \quad \Delta t = 0.2$$
4. Multiplying by $\tilde{q}_j = 0.05$:
   $$Q_{11} = 8.0 \times 10^{-7}\text{ m}^2$$
   $$Q_{12} = Q_{21} = 1.0 \times 10^{-5}\text{ m}^2/\text{s}$$
   $$Q_{13} = Q_{31} = 6.6667 \times 10^{-5}\text{ m}^2/\text{s}^2$$
   $$Q_{22} = 1.3333 \times 10^{-4}\text{ m}^2/\text{s}^2$$
   $$Q_{23} = Q_{32} = 1.0 \times 10^{-3}\text{ m}^2/\text{s}^3$$
   $$Q_{33} = 1.0 \times 10^{-2}\text{ m}^2/\text{s}^4$$
5. Position-acceleration correlation:
   $$\rho_{pa} = \frac{Q_{13}}{\sqrt{Q_{11} Q_{33}}} = \frac{\frac{\tilde{q}_j \Delta t^3}{6}}{\sqrt{\frac{\tilde{q}_j \Delta t^5}{20} \cdot \tilde{q}_j \Delta t}} = \frac{1/6}{\sqrt{1/20}} = \frac{\sqrt{20}}{6} = \frac{2\sqrt{5}}{6} = \frac{\sqrt{5}}{3} \approx 0.745356$$

**Final Result:**
$$Q_k = \begin{bmatrix} 8.00 \times 10^{-7} & 1.00 \times 10^{-5} & 6.67 \times 10^{-5} \\ 1.00 \times 10^{-5} & 1.33 \times 10^{-4} & 1.00 \times 10^{-3} \\ 6.67 \times 10^{-5} & 1.00 \times 10^{-3} & 1.00 \times 10^{-2} \end{bmatrix}, \quad \rho_{pa} = \frac{\sqrt{5}}{3} \approx 0.7454$$

---

### Problem 4.8 (Worked Example): Truncation Error in Euler vs Matrix Exponential
**Problem Statement:** A continuous system has $A = \begin{bmatrix} 0 & 10 \\ -10 & 0 \end{bmatrix}$. Compare the true matrix exponential $F = e^{A \Delta t}$ with the forward Euler approximation $F_{\text{Euler}} = I + A \Delta t$ for $\Delta t = 0.05\text{ s}$. Compute the spectral radius $\rho(F)$ versus $\rho(F_{\text{Euler}})$.

**Step-by-Step Derivation:**
1. True matrix exponential:
   $A$ represents an undamped harmonic oscillator with $\omega = 10\text{ rad/s}$.
   $$F = \begin{bmatrix} \cos(\omega \Delta t) & \sin(\omega \Delta t) \\ -\sin(\omega \Delta t) & \cos(\omega \Delta t) \end{bmatrix}$$
   At $\Delta t = 0.05\text{ s}$, $\omega \Delta t = 0.5\text{ rad}$.
   $$\cos(0.5) \approx 0.877583, \quad \sin(0.5) \approx 0.479426$$
   $$F = \begin{bmatrix} 0.877583 & 0.479426 \\ -0.479426 & 0.877583 \end{bmatrix}$$
   The eigenvalues of $F$ lie strictly on the unit circle: $|\lambda| = \cos^2(0.5) + \sin^2(0.5) = 1.0$.
   $$\rho(F) = 1.000000$$
2. Forward Euler approximation:
   $$F_{\text{Euler}} = I + A \Delta t = \begin{bmatrix} 1 & 10(0.05) \\ -10(0.05) & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0.5 \\ -0.5 & 1 \end{bmatrix}$$
   Eigenvalues of $F_{\text{Euler}}$:
   $$\det(\lambda I - F_{\text{Euler}}) = (\lambda - 1)^2 + 0.25 = 0 \implies \lambda = 1 \pm 0.5 i$$
   Magnitude:
   $$|\lambda| = \sqrt{1^2 + 0.5^2} = \sqrt{1.25} \approx 1.118034$$
   $$\rho(F_{\text{Euler}}) = 1.118034 > 1.0$$

**Final Result:**
$$\rho(F) = 1.000000\text{ (conserves energy)}, \quad \rho(F_{\text{Euler}}) = 1.118034\text{ (unstable growth)}$$
*Physical Consequence:* Forward Euler artificially adds energy to the system, causing the unforced oscillator state estimate to diverge exponentially by $11.8\%$ every 50 ms.

---

### Problem 4.9 (Worked Example): Observability under Periodic Sampling
**Problem Statement:** A continuous oscillator $\dot{x} = \begin{bmatrix} 0 & \omega \\ -\omega & 0 \end{bmatrix} x$ is observed via $z = [1, 0] x$. Determine the sampling intervals $\Delta t$ for which the discrete system loses observability (pathological sampling).

**Step-by-Step Derivation:**
1. Discrete state transition:
   $$F = \begin{bmatrix} \cos(\omega \Delta t) & \sin(\omega \Delta t) \\ -\sin(\omega \Delta t) & \cos(\omega \Delta t) \end{bmatrix}, \quad H = \begin{bmatrix} 1 & 0 \end{bmatrix}$$
2. Discrete observability matrix:
   $$\mathcal{O} = \begin{bmatrix} H \\ H F \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ \cos(\omega \Delta t) & \sin(\omega \Delta t) \end{bmatrix}$$
3. Determinant of observability matrix:
   $$\det(\mathcal{O}) = 1 \cdot \sin(\omega \Delta t) - 0 = \sin(\omega \Delta t)$$
4. Rank condition:
   $\operatorname{rank}(\mathcal{O}) < 2 \iff \sin(\omega \Delta t) = 0 \iff \omega \Delta t = k \pi$ for $k \in \mathbb{Z}^+$.
   $$\Delta t = \frac{k \pi}{\omega} = \frac{k}{2 f_0}$$

**Final Result:**
$$\Delta t = \frac{k \pi}{\omega}\text{ for }k = 1, 2, 3, \dots$$
*Engineering Significance:* If sampling occurs at twice the natural frequency (or integer multiples of the half-period), velocity oscillations are completely masked at sampling instants, rendering the system unobservable.

---

### Problem 4.10 (Worked Example): Van Loan Algorithm Implementation in Pseudocode
**Problem Statement:** Specify the exact numerical algorithm for Van Loan discretization using matrix exponentiation via scaling-and-squaring with Padé approximation. State the computational complexity for state dimension $n$.

**Step-by-Step Derivation:**
1. Algorithm steps:
   - Input: $A \in \mathbb{R}^{n \times n}, G \in \mathbb{R}^{n \times q}, Q_c \in \mathbb{S}_+^q, \Delta t > 0$.
   - Compute $W = G Q_c G^T \in \mathbb{R}^{n \times n}$.
   - Form $2n \times 2n$ block matrix:
     $$\mathcal{M} = \begin{bmatrix} -A & W \\ 0 & A^T \end{bmatrix}$$
   - Scale matrix: $\tilde{\mathcal{M}} = \mathcal{M} \Delta t$.
   - Compute matrix exponential $\mathcal{E} = \operatorname{expm}(\tilde{\mathcal{M}})$ using degree-13 Padé approximant with scaling and squaring.
   - Partition $\mathcal{E}$ into $n \times n$ blocks:
     $$\mathcal{E} = \begin{bmatrix} \Phi_{11} & \Phi_{12} \\ \Phi_{21} & \Phi_{22} \end{bmatrix}$$
   - Extract:
     $$F = \Phi_{22}^T$$
     $$Q_k = F \, \Phi_{12}$$
   - Enforce numerical symmetry:
     $$Q_k \leftarrow \frac{1}{2}(Q_k + Q_k^T)$$
2. Computational Complexity:
   Matrix multiplication of $2n \times 2n$ matrices requires $(2n)^3 = 8 n^3$ flops.
   Degree-13 Padé approximation requires ~6 matrix multiplications:
   $$\text{Flops} \approx 6 \times 8 n^3 = 48 n^3$$
   For $n = 6$ (typical robotic pose-velocity), $48 \times 216 \approx 10,368$ flops, taking less than $2\mu\text{s}$ on modern hardware.

**Final Result:**
$$\text{Computational Complexity} = \mathcal{O}(n^3)\text{ flops}$$

---

### Problem 4.11 (Solved Exercise): 3D Constant Velocity Decoupled Noise Formulation
**Problem Statement:** A 3D aerial drone follows uncoupled 3D Constant Velocity dynamics with isotropic acceleration spectral density $\tilde{q} = 0.5\text{ m}^2/\text{s}^3$ along $x, y, z$. For $\Delta t = 0.05\text{ s}$, write the full $6 \times 6$ matrix $Q_k$ using the Kronecker product $\otimes$.

**Step-by-Step Solution:**
1. The 1D CWNA matrix for $\Delta t = 0.05$ is:
   $$Q_{\text{1D}} = \tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
   $$\frac{\Delta t^3}{3} = \frac{0.000125}{3} \approx 4.1667 \times 10^{-5}$$
   $$\frac{\Delta t^2}{2} = \frac{0.0025}{2} = 1.25 \times 10^{-3}$$
   $$\Delta t = 0.05$$
   $$Q_{\text{1D}} = 0.5 \begin{bmatrix} 4.1667 \times 10^{-5} & 1.25 \times 10^{-3} \\ 1.25 \times 10^{-3} & 0.05 \end{bmatrix} = \begin{bmatrix} 2.0833 \times 10^{-5} & 6.25 \times 10^{-4} \\ 6.25 \times 10^{-4} & 2.5 \times 10^{-2} \end{bmatrix}$$
2. Reordering state vector to $x = [p_x, v_x, p_y, v_y, p_z, v_z]^T$:
   $$Q_k = I_3 \otimes Q_{\text{1D}} = \begin{bmatrix} Q_{\text{1D}} & 0 & 0 \\ 0 & Q_{\text{1D}} & 0 \\ 0 & 0 & Q_{\text{1D}} \end{bmatrix}$$

**Final Answer:**
$$Q_k = \operatorname{diag}(Q_{\text{1D}}, Q_{\text{1D}}, Q_{\text{1D}}), \quad Q_{\text{1D}} = \begin{bmatrix} 2.083 \times 10^{-5} & 6.250 \times 10^{-4} \\ 6.250 \times 10^{-4} & 2.500 \times 10^{-2} \end{bmatrix}$$

---

### Problem 4.12 (Solved Exercise): Cayley-Hamilton Calculation of Matrix Exponential
**Problem Statement:** Use the Cayley-Hamilton theorem to compute $e^{A t}$ for $A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$.

**Step-by-Step Solution:**
1. Characteristic polynomial of $A$:
   $$p(\lambda) = \det(\lambda I - A) = (\lambda - 1)(\lambda - 3) = \lambda^2 - 4\lambda + 3$$
   Eigenvalues are $\lambda_1 = 1, \lambda_2 = 3$.
2. By Cayley-Hamilton, $e^{At} = \alpha_0(t) I + \alpha_1(t) A$, where the scalar coefficients satisfy:
   $$e^{\lambda_1 t} = \alpha_0 + \alpha_1 \lambda_1 \implies e^t = \alpha_0 + \alpha_1$$
   $$e^{\lambda_2 t} = \alpha_0 + \alpha_1 \lambda_2 \implies e^{3t} = \alpha_0 + 3 \alpha_1$$
3. Subtracting equations:
   $$2 \alpha_1 = e^{3t} - e^t \implies \alpha_1 = \frac{e^{3t} - e^t}{2}$$
   $$\alpha_0 = e^t - \alpha_1 = e^t - \frac{e^{3t} - e^t}{2} = \frac{3e^t - e^{3t}}{2}$$
4. Reconstructing matrix:
   $$e^{At} = \frac{3e^t - e^{3t}}{2} \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + \frac{e^{3t} - e^t}{2} \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$$
   Top-left: $\frac{3e^t - e^{3t} + e^{3t} - e^t}{2} = e^t$.
   Top-right: $2 \times \frac{e^{3t} - e^t}{2} = e^{3t} - e^t$.
   Bottom-left: $0$.
   Bottom-right: $\frac{3e^t - e^{3t} + 3(e^{3t} - e^t)}{2} = e^{3t}$.

**Final Answer:**
$$e^{At} = \begin{bmatrix} e^t & e^{3t} - e^t \\ 0 & e^{3t} \end{bmatrix}$$

---

### Problem 4.13 (Solved Exercise): Continuous vs Discrete Riccati Propagation
**Problem Statement:** Show that the continuous propagation of state covariance $\dot{P} = A P + P A^T + G Q_c G^T$ over $[0, \Delta t]$ with initial condition $P(0)$ yields exactly $P(\Delta t) = F P(0) F^T + Q_k$.

**Step-by-Step Solution:**
1. Pre-multiply differential equation by $e^{-At}$ and post-multiply by $e^{-A^T t}$:
   $$e^{-At} \dot{P}(t) e^{-A^T t} - e^{-At} A P(t) e^{-A^T t} - e^{-At} P(t) A^T e^{-A^T t} = e^{-At} G Q_c G^T e^{-A^T t}$$
2. Recognize total derivative:
   $$\frac{d}{dt}\left( e^{-At} P(t) e^{-A^T t} \right) = e^{-At} G Q_c G^T e^{-A^T t}$$
3. Integrate from $0$ to $\Delta t$:
   $$e^{-A \Delta t} P(\Delta t) e^{-A^T \Delta t} - P(0) = \int_0^{\Delta t} e^{-A \tau} G Q_c G^T e^{-A^T \tau} d\tau$$
4. Pre-multiply by $e^{A \Delta t} = F$ and post-multiply by $e^{A^T \Delta t} = F^T$:
   $$P(\Delta t) = F P(0) F^T + \int_0^{\Delta t} e^{A(\Delta t - \tau)} G Q_c G^T e^{A^T(\Delta t - \tau)} d\tau$$
5. Setting $\lambda = \Delta t - \tau$, the integral becomes $\int_0^{\Delta t} e^{A \lambda} G Q_c G^T e^{A^T \lambda} d\lambda = Q_k$.
   $$P(\Delta t) = F P(0) F^T + Q_k \quad \blacksquare$$

---

### Problem 4.14 (Solved Exercise): Discrete Transfer Function Poles and Stability
**Problem Statement:** A continuous plant has poles at $s = -1 \pm 5 i$. Compute the sampling interval $\Delta t$ and discrete pole locations $z_1, z_2$ in the $z$-plane for $\Delta t = 0.1\text{ s}$. Is the discrete system stable?

**Step-by-Step Solution:**
1. Under exact discretization, continuous poles map via $z_i = e^{s_i \Delta t}$.
2. Continuous poles: $s = -1 \pm 5 i$.
   $$z = e^{(-1 \pm 5 i) 0.1} = e^{-0.1} e^{\pm 0.5 i} = e^{-0.1} (\cos(0.5) \pm i \sin(0.5))$$
3. Numerical calculation:
   $$e^{-0.1} \approx 0.904837$$
   $$\cos(0.5) \approx 0.877583, \quad \sin(0.5) \approx 0.479426$$
   $$z_1, z_2 = 0.904837 (0.877583 \pm 0.479426 i) \approx 0.794070 \pm 0.433803 i$$
4. Magnitude:
   $$|z| = e^{-0.1} \approx 0.904837 < 1.0$$

**Final Answer:**
$$z_1, z_2 = 0.7941 \pm 0.4338 i, \quad |z| = 0.9048 < 1.0\text{ (Asymptotically Stable)}$$

---

### Problem 4.15 (Solved Exercise): Zero-Order Hold Frequency Response Distortion
**Problem Statement:** The continuous-time frequency response $H_c(j\omega)$ differs from the discrete ZOH equivalent $H_d(e^{j\omega \Delta t})$. Write the exact mathematical transfer function of a ZOH hold circuit and evaluate its phase lag at the Nyquist frequency $\omega_N = \frac{\pi}{\Delta t}$.

**Step-by-Step Solution:**
1. The impulse response of a zero-order hold is a rectangular pulse of duration $\Delta t$: $h_{\text{ZOH}}(t) = 1$ for $t \in [0, \Delta t)$, $0$ elsewhere.
2. Laplace transform:
   $$H_{\text{ZOH}}(s) = \frac{1 - e^{-s \Delta t}}{s}$$
3. Evaluating on the frequency axis $s = j\omega$:
   $$H_{\text{ZOH}}(j\omega) = \frac{1 - e^{-j\omega \Delta t}}{j\omega} = e^{-j\omega \Delta t / 2} \frac{e^{j\omega \Delta t / 2} - e^{-j\omega \Delta t / 2}}{j\omega} = e^{-j\omega \Delta t / 2} \Delta t \operatorname{sinc}\left(\frac{\omega \Delta t}{2}\right)$$
4. Phase lag:
   $$\angle H_{\text{ZOH}}(j\omega) = -\frac{\omega \Delta t}{2}\text{ radians}$$
5. At the Nyquist frequency $\omega_N = \frac{\pi}{\Delta t}$:
   $$\angle H_{\text{ZOH}}(j\omega_N) = -\frac{\pi}{2}\text{ radians} = -90^\circ$$

**Final Answer:**
$$H_{\text{ZOH}}(j\omega) = \Delta t \operatorname{sinc}\left(\frac{\omega \Delta t}{2}\right) e^{-j\omega \Delta t / 2}, \quad \text{Phase lag at Nyquist} = -90^\circ$$

---

### Problem 4.16 (Solved Exercise): Decoupled Kinematic States under Orthogonal Geometry
**Problem Statement:** Prove that for a robot navigating in 3D Cartesian space under continuous white acceleration noise along orthogonal coordinate axes $x, y, z$, the $6 \times 6$ estimation covariance remains permanently block-diagonal if the initial covariance $P_0$ is block-diagonal and measurements are linear Cartesian positions.

**Step-by-Step Solution:**
1. State vector $X = [x, y, z]^T$ where each subvector is $x_i = [p_i, v_i]^T$.
2. Dynamics matrix $F = \operatorname{diag}(F_{\text{1D}}, F_{\text{1D}}, F_{\text{1D}})$ and process covariance $Q = \operatorname{diag}(Q_{\text{1D}}, Q_{\text{1D}}, Q_{\text{1D}})$.
3. Measurement matrix $H = \operatorname{diag}(H_{\text{1D}}, H_{\text{1D}}, H_{\text{1D}})$ where $H_{\text{1D}} = [1, 0]$, and measurement noise $R = \operatorname{diag}(r_x, r_y, r_z)$.
4. If $P_{0}$ is block-diagonal with $2 \times 2$ blocks along the diagonal, then $F P_0 F^T + Q$ is the direct sum of three $2 \times 2$ matrix products, hence strictly block-diagonal.
5. In the update step, $S = H P^- H^T + R$ is diagonal ($3 \times 3$). Its inverse $S^{-1}$ is diagonal.
6. Kalman gain $K = P^- H^T S^{-1}$ consists of three decoupled $2 \times 1$ blocks.
7. Updated covariance $P^+ = (I - K H) P^-$ preserves the block-diagonal structure.
8. By induction, cross-axis covariances (e.g. $\mathbb{E}[(p_x - \hat{p}_x)(p_y - \hat{p}_y)]$) remain identically zero for all $k \ge 0$. $\blacksquare$

---

### Problem 4.17 (Solved Exercise): Continuous State-Space Formulation of a Spring-Mass-Damper
**Problem Statement:** A robotic suspension has mass $m = 2\text{ kg}$, damping coefficient $c = 6\text{ N}\cdot\text{s/m}$, and spring constant $k = 20\text{ N/m}$. An external white noise force $w_c(t)$ with spectral density $S_F = 8\text{ N}^2/\text{Hz}$ acts on the mass. Write the continuous state-space matrices $(A, G, Q_c)$ for state $x = [p, v]^T$.

**Step-by-Step Solution:**
1. Equation of motion:
   $$m \ddot{p} + c \dot{p} + k p = w_c(t) \implies \ddot{p} = -\frac{k}{m} p - \frac{c}{m} \dot{p} + \frac{1}{m} w_c(t)$$
2. Numerical parameters:
   $$\frac{k}{m} = \frac{20}{2} = 10\text{ s}^{-2}, \quad \frac{c}{m} = \frac{6}{2} = 3\text{ s}^{-1}, \quad \frac{1}{m} = 0.5\text{ kg}^{-1}$$
3. State vector $x = [p, v]^T$:
   $$\begin{bmatrix} \dot{p} \\ \dot{v} \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -10 & -3 \end{bmatrix} \begin{bmatrix} p \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ 0.5 \end{bmatrix} w_c(t)$$
4. Process noise:
   $Q_c = S_F = 8.0\text{ N}^2/\text{Hz}$.

**Final Answer:**
$$A = \begin{bmatrix} 0 & 1 \\ -10 & -3 \end{bmatrix}, \quad G = \begin{bmatrix} 0 \\ 0.5 \end{bmatrix}, \quad Q_c = 8.0\text{ N}^2\cdot\text{s}$$

---

### Problem 4.18 (Solved Exercise): Sampling Invariance of State Steady-State Variance
**Problem Statement:** For the 1D velocity model $\dot{v} = -a v + w_c(t)$, prove that as $\Delta t \to 0$, the discrete steady-state velocity variance $p_\infty$ predicted by the continuous Lyapunov equation $\dot{P} = -2 a P + Q_c = 0$ matches the discrete steady-state variance.

**Step-by-Step Solution:**
1. Continuous Lyapunov equation:
   $$-2 a P_\infty + Q_c = 0 \implies P_\infty = \frac{Q_c}{2a}$$
2. Discrete model:
   $$F = e^{-a \Delta t}, \quad Q_k = Q_c \frac{1 - e^{-2a \Delta t}}{2a}$$
3. Discrete unobserved propagation:
   $$P_{k+1} = F^2 P_k + Q_k = e^{-2a \Delta t} P_k + Q_c \frac{1 - e^{-2a \Delta t}}{2a}$$
4. Setting steady-state $P_{k+1} = P_k = P_\infty$:
   $$P_\infty (1 - e^{-2a \Delta t}) = Q_c \frac{1 - e^{-2a \Delta t}}{2a}$$
5. Dividing both sides by $(1 - e^{-2a \Delta t})$:
   $$P_\infty = \frac{Q_c}{2a}$$
   This holds exactly for *any* $\Delta t > 0$, not merely in the limit $\Delta t \to 0$. $\blacksquare$

---

### Problem 4.19 (Solved Exercise): Continuous White Acceleration to Discrete Velocity Jump
**Problem Statement:** A continuous white acceleration $w_c(t)$ with spectral density $\tilde{q} = 1.0\text{ m}^2/\text{s}^3$ acts on a velocity state over $\Delta t = 0.01\text{ s}$. Compute the root-mean-square velocity change $\Delta v_{\text{rms}}$ and compare it with the heuristic discrete formula $\Delta v = \sigma_a \Delta t$.

**Step-by-Step Solution:**
1. Under continuous CWNA:
   $$Q_{vv} = \tilde{q} \Delta t = 1.0 \times 0.01 = 0.01\text{ m}^2/\text{s}^2$$
   $$\Delta v_{\text{rms}} = \sqrt{Q_{vv}} = \sqrt{0.01} = 0.1\text{ m/s}$$
2. Notice the scaling: $\Delta v_{\text{rms}} \propto \sqrt{\Delta t}$.
   If one naively assumes acceleration is a discrete random variable with fixed variance $\sigma_a^2$, $\Delta v = \sigma_a \Delta t \propto \Delta t$.
3. As $\Delta t \to 0$, the continuous white noise produces velocity increments scaling as $\mathcal{O}(\Delta t^{1/2})$, consistent with Brownian motion (Wiener process), whereas discrete heuristics incorrectly scale as $\mathcal{O}(\Delta t)$.

**Final Answer:**
$$\Delta v_{\text{rms}} = \sqrt{\tilde{q} \Delta t} = 0.1\text{ m/s}$$

---

### Problem 4.20 (Solved Exercise): Coordinate Transformation of Process Covariance
**Problem Statement:** A 2D robot's process noise covariance $Q_{\text{robot}}$ is known in body coordinates $(x_b, y_b)$ where $\sigma_x^2 = 0.04, \sigma_y^2 = 0.01, \sigma_{xy} = 0$. If the robot's heading relative to the world frame is $\theta = 45^\circ$, compute the world-frame process noise covariance $Q_{\text{world}} = R(\theta) Q_{\text{robot}} R^T(\theta)$.

**Step-by-Step Solution:**
1. Rotation matrix for $\theta = 45^\circ$ ($\cos 45^\circ = \sin 45^\circ = \frac{1}{\sqrt{2}}$):
   $$R = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}$$
2. Robot frame covariance:
   $$Q_{\text{robot}} = \begin{bmatrix} 0.04 & 0 \\ 0 & 0.01 \end{bmatrix}$$
3. Transformation:
   $$Q_{\text{world}} = \frac{1}{2} \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} 0.04 & 0 \\ 0 & 0.01 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}$$
   $$= \frac{1}{2} \begin{bmatrix} 0.04 & -0.01 \\ 0.04 & 0.01 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 0.05 & 0.03 \\ 0.03 & 0.05 \end{bmatrix} = \begin{bmatrix} 0.025 & 0.015 \\ 0.015 & 0.025 \end{bmatrix}$$
4. Invariant checks:
   $$\operatorname{tr}(Q_{\text{world}}) = 0.025 + 0.025 = 0.05 = \operatorname{tr}(Q_{\text{robot}})$$
   $$\det(Q_{\text{world}}) = (0.025)^2 - (0.015)^2 = 0.000625 - 0.000225 = 0.0004 = \det(Q_{\text{robot}})$$

**Final Answer:**
$$Q_{\text{world}} = \begin{bmatrix} 0.025 & 0.015 \\ 0.015 & 0.025 \end{bmatrix}$$
All tensor invariants (trace, determinant) are strictly preserved.


---

# Chapter 5: The Discrete Multivariable Kalman Filter Cycle: Predict and Update

## 5.1 Introduction: The Multivariable State Space

In physical robotics, states are rarely scalar quantities. An autonomous manipulator arm, humanoid balance controller, or aerial drone possesses interconnected position coordinates, linear velocities, angular orientations, angular velocities, and sensor bias parameters spanning state dimensions $n \in [4, 20]$. Furthermore, modern robotic platforms deploy diverse sensor suites—laser rangefinders, wheel encoders, visual fiducial trackers, IMUs, and GPS receivers—generating multivariable measurement vectors $z_k \in \mathbb{R}^m$.

The discrete multivariable Kalman Filter is the optimal recursive minimum-variance Bayesian estimator for such linear Gaussian systems. It propagates the full multivariate mean vector $\hat{x} \in \mathbb{R}^n$ and the full error covariance matrix $P \in \mathbb{S}_+^n$, continuously balancing dynamic model prediction against stochastic measurement correction.

In this chapter, we formalize the canonical five-step multivariable Kalman filter cycle, analyze the numerical stability vulnerabilities of the textbook covariance update, derive the Joseph stabilized covariance equation, establish the sequential scalar update technique, and develop exact computational solutions across 20 rigorous problems.

---

## 5.2 The Canonical Discrete Kalman Filter Cycle

Let the latent physical state at discrete time step $k \in \mathbb{N}$ be $x_k \in \mathbb{R}^n$, governed by linear dynamics and observed through linear measurements:

$$x_k = F_k x_{k-1} + B_k u_{k-1} + w_k$$
$$z_k = H_k x_k + v_k$$

where:
- $F_k \in \mathbb{R}^{n \times n}$ is the state transition matrix.
- $B_k \in \mathbb{R}^{n \times p}$ is the control input matrix.
- $u_{k-1} \in \mathbb{R}^p$ is the known deterministic control input vector.
- $w_k \sim \mathcal{N}(0, Q_k)$ is zero-mean Gaussian process noise with covariance $Q_k \in \mathbb{S}_+^n$.
- $z_k \in \mathbb{R}^m$ is the observation vector.
- $H_k \in \mathbb{R}^{m \times n}$ is the measurement sensitivity matrix.
- $v_k \sim \mathcal{N}(0, R_k)$ is zero-mean Gaussian measurement noise with covariance $R_k \in \mathbb{S}_{++}^m$.
- $w_k$ and $v_j$ are mutually independent for all $k, j$: $\mathbb{E}[w_k v_j^T] = 0$.

```
+---------------------------------------------------------------------------------------------------+
|                            THE RECURSIVE KALMAN FILTER CYCLE                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Prior State & Covariance: [ \hat{x}_{k-1|k-1}, P_{k-1|k-1} ]                                   |
|                                     |                                                             |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 1. TIME UPDATE (PREDICT STEP)                                                             |   |
|   |    \hat{x}_{k|k-1} = F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}                                  |   |
|   |    P_{k|k-1}       = F_k P_{k-1|k-1} F_k^T + Q_k                                          |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|               (New measurement arrives: z_k \in \mathbb{R}^m)                                     |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 2. INNOVATION & RESIDUAL COVARIANCE                                                       |   |
|   |    y_k = z_k - H_k \hat{x}_{k|k-1}                                                        |   |
|   |    S_k = H_k P_{k|k-1} H_k^T + R_k                                                        |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 3. OPTIMAL KALMAN GAIN COMPUTATION                                                        |   |
|   |    K_k = P_{k|k-1} H_k^T S_k^{-1}                                                         |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|                                     v                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | 4. MEASUREMENT UPDATE (CORRECTION STEP)                                                   |   |
|   |    \hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k                                              |   |
|   |    P_{k|k}       = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T  (Joseph Form)|   |
|   +-------------------------------------------------------------------------------------------+   |
|                                     |                                                             |
|                                     +---------------------------------> Next Step (k+1)           |
+---------------------------------------------------------------------------------------------------+
```

---

## 5.3 Detailed Examination of the Five Steps

### Step 1: State Prediction (Time Update)
$$\hat{x}_{k|k-1} = F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}$$
Taking the mathematical expectation of the system dynamics conditioned on all previous observations $Z_{1:k-1} = \{z_1, \dots, z_{k-1}\}$:
$$\mathbb{E}[x_k | Z_{1:k-1}] = F_k \mathbb{E}[x_{k-1} | Z_{1:k-1}] + B_k u_{k-1} + \mathbb{E}[w_k | Z_{1:k-1}]$$
Since process noise $w_k$ has zero mean and is independent of past measurements, $\mathbb{E}[w_k | Z_{1:k-1}] = 0$. Thus:
$$\hat{x}_{k|k-1} = F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}$$

### Step 2: Covariance Prediction
$$P_{k|k-1} = F_k P_{k-1|k-1} F_k^T + Q_k$$
Define the prior estimation error $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$. Subtracting the state estimate from true state:
$$\tilde{x}_{k|k-1} = (F_k x_{k-1} + B_k u_{k-1} + w_k) - (F_k \hat{x}_{k-1|k-1} + B_k u_{k-1}) = F_k \tilde{x}_{k-1|k-1} + w_k$$
Taking the expectation of the outer product:
$$P_{k|k-1} = \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] = \mathbb{E}[(F_k \tilde{x}_{k-1|k-1} + w_k)(F_k \tilde{x}_{k-1|k-1} + w_k)^T]$$
Expanding and noting that cross-terms vanish because $w_k$ is uncorrelated with the prior error $\tilde{x}_{k-1|k-1}$:
$$P_{k|k-1} = F_k \mathbb{E}[\tilde{x}_{k-1|k-1} \tilde{x}_{k-1|k-1}^T] F_k^T + \mathbb{E}[w_k w_k^T] = F_k P_{k-1|k-1} F_k^T + Q_k$$
Because $P_{k-1|k-1} \in \mathbb{S}_+^n$ and $Q_k \in \mathbb{S}_+^n$, the predicted covariance $P_{k|k-1}$ is guaranteed to be symmetric positive semi-definite in exact arithmetic.

### Step 3: Innovation and Residual Covariance
$$y_k = z_k - H_k \hat{x}_{k|k-1}$$
$$S_k = H_k P_{k|k-1} H_k^T + R_k$$
The vector $y_k \in \mathbb{R}^m$ is the **innovation** (or measurement residual). It represents the brand-new, unpredictable information delivered by the sensor at time step $k$.
The measurement error is:
$$\tilde{z}_k = z_k - \hat{z}_{k|k-1} = (H_k x_k + v_k) - H_k \hat{x}_{k|k-1} = H_k \tilde{x}_{k|k-1} + v_k$$
The covariance of the innovation is:
$$S_k = \mathbb{E}[y_k y_k^T] = \mathbb{E}[(H_k \tilde{x}_{k|k-1} + v_k)(H_k \tilde{x}_{k|k-1} + v_k)^T] = H_k P_{k|k-1} H_k^T + R_k$$
Because $R_k \in \mathbb{S}_{++}^m$ (strictly positive definite) and $H_k P_{k|k-1} H_k^T \in \mathbb{S}_+^m$, the innovation covariance $S_k \in \mathbb{S}_{++}^m$ is strictly positive definite and therefore always invertible.

### Step 4: Optimal Kalman Gain
$$K_k = P_{k|k-1} H_k^T S_k^{-1} = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + R_k)^{-1}$$
$K_k \in \mathbb{R}^{n \times m}$ is the weighting matrix that maps the $m$-dimensional innovation into the $n$-dimensional state correction. It solves the unconstrained optimization problem of minimizing the posterior mean squared error $\operatorname{tr}(P_{k|k})$.

### Step 5: State Update (Measurement Update)
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k = \hat{x}_{k|k-1} + K_k (z_k - H_k \hat{x}_{k|k-1})$$
The posterior state estimate is an affine combination of the prior prediction and the innovation residual.

---

## 5.4 The Covariance Update: Textbook Formula vs Joseph Stabilized Form

In standard introductory textbooks, the posterior covariance is written as:
$$P_{k|k} = (I - K_k H_k) P_{k|k-1}$$

### 5.4.1 Derivation of the General Covariance Update for Any Linear Gain $K$
Let $K$ be *any* arbitrary linear gain matrix (optimal or sub-optimal). The posterior state error is:
$$\tilde{x}_{k|k} = x_k - \hat{x}_{k|k} = x_k - (\hat{x}_{k|k-1} + K (z_k - H_k \hat{x}_{k|k-1}))$$
Substituting $z_k = H_k x_k + v_k$:
$$\tilde{x}_{k|k} = x_k - \hat{x}_{k|k-1} - K (H_k x_k + v_k - H_k \hat{x}_{k|k-1}) = \tilde{x}_{k|k-1} - K H_k \tilde{x}_{k|k-1} - K v_k$$
$$\tilde{x}_{k|k} = (I - K H_k) \tilde{x}_{k|k-1} - K v_k$$

Now take the expectation of the outer product $\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k}^T]$:
$$P_{k|k} = \mathbb{E}\left[ \left( (I - K H_k) \tilde{x}_{k|k-1} - K v_k \right) \left( (I - K H_k) \tilde{x}_{k|k-1} - K v_k \right)^T \right]$$

Since measurement noise $v_k$ is uncorrelated with the prior error $\tilde{x}_{k|k-1}$ ($\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$):
$$P_{k|k} = (I - K H_k) \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] (I - K H_k)^T + K \mathbb{E}[v_k v_k^T] K^T$$
$$P_{k|k} = (I - K H_k) P_{k|k-1} (I - K H_k)^T + K R_k K^T$$

This is the **Joseph Stabilized Covariance Update Equation** (named after Peter D. Joseph).

### 5.4.2 Why the Textbook Formula Fails in Production
If we expand the Joseph form:
$$P_{k|k} = (I - K H_k) P_{k|k-1} (I - K H_k)^T + K R_k K^T$$
$$= P_{k|k-1} - K H_k P_{k|k-1} - P_{k|k-1} H_k^T K^T + K H_k P_{k|k-1} H_k^T K^T + K R_k K^T$$
$$= P_{k|k-1} - K H_k P_{k|k-1} - P_{k|k-1} H_k^T K^T + K (H_k P_{k|k-1} H_k^T + R_k) K^T$$

Now, **if and only if** $K$ is the mathematically exact optimal Kalman gain $K = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + R_k)^{-1}$:
$$K (H_k P_{k|k-1} H_k^T + R_k) K^T = \left( P_{k|k-1} H_k^T S_k^{-1} \right) S_k K^T = P_{k|k-1} H_k^T K^T$$

Substituting this back cancels the third term:
$$P_{k|k} = P_{k|k-1} - K H_k P_{k|k-1} - P_{k|k-1} H_k^T K^T + P_{k|k-1} H_k^T K^T = (I - K H_k) P_{k|k-1}$$

This simplifies to the textbook formula. However, in IEEE 754 floating-point computation:
1. **Loss of Symmetry:** $(I - K H_k) P_{k|k-1}$ is the product of two non-commuting symmetric matrices. Roundoff errors immediately destroy the symmetry of $P_{k|k}$.
2. **Loss of Positive Definiteness:** In high-confidence sensor updates ($R \ll P$), $(I - K H_k) \approx 0$. Subtracting two nearly equal large numbers causes catastrophic cancellation, producing eigenvalues of $P$ that are negative ($\lambda < 0$). A negative variance is a physical impossibility that causes Cholesky decomposition to crash and the filter to diverge.
3. **The Joseph Form Guarantee:** Notice that the Joseph equation has the structural form:
   $$P_{k|k} = M P_{k|k-1} M^T + K R_k K^T$$
   For any vector $z \neq 0$:
   $$z^T P_{k|k} z = z^T M P_{k|k-1} M^T z + z^T K R_k K^T z = (M^T z)^T P_{k|k-1} (M^T z) + (K^T z)^T R_k (K^T z)$$
   Since $P_{k|k-1} \ge 0$ and $R_k > 0$, both terms are non-negative for any $z$. Thus, **the Joseph form guarantees that $P_{k|k}$ is symmetric positive semi-definite for any gain $K$ and in the presence of arbitrary floating-point roundoff.**

---

## 5.5 Sequential Scalar Measurement Updates

When the measurement noise covariance $R_k$ is diagonal:
$$R_k = \operatorname{diag}(r_1, r_2, \dots, r_m)$$
the sensor observations are mutually uncorrelated. In this case, an $m$-dimensional vector measurement update can be broken down into $m$ consecutive scalar measurement updates ($m=1$).

### Advantages of Sequential Scalar Updates:
1. **No Matrix Inversion:** Each scalar update requires inverting a single scalar $s_i = H_i P H_i^T + r_i$, completely eliminating the $m \times m$ matrix inversion $S_k^{-1}$.
2. **Computational Speed:** Reduces the computational complexity from $\mathcal{O}(m^3 + m^2 n + m n^2)$ to $\mathcal{O}(m n^2)$.
3. **Selective Rejection:** Outlier sensors can be individually detected and rejected via scalar Chi-square gating without discarding valid measurements from other sensors arriving at the same timestamp.

---

## 5.6 Mathematical Problem Set

### Problem 5.1 (Worked Example): Complete 2D Constant Velocity Filter Step
**Problem Statement:** A 1D robot is tracking its position and velocity with state $x = [p, v]^T$. At time step $k-1$, the posterior estimate and covariance are:
$$\hat{x}_{k-1|k-1} = \begin{bmatrix} 10.0 \\ 2.0 \end{bmatrix}, \quad P_{k-1|k-1} = \begin{bmatrix} 1.0 & 0.2 \\ 0.2 & 0.5 \end{bmatrix}$$
The dynamics follow a Constant Velocity model with $\Delta t = 1.0\text{ s}$ and process noise covariance:
$$F = \begin{bmatrix} 1.0 & 1.0 \\ 0.0 & 1.0 \end{bmatrix}, \quad Q = \begin{bmatrix} 0.1 & 0.05 \\ 0.05 & 0.2 \end{bmatrix}$$
At step $k$, a direct position measurement arrives: $z_k = 12.8\text{ m}$ with measurement sensitivity $H = [1.0, 0.0]$ and noise variance $R = 0.5\text{ m}^2$. Compute:
1. The prior predicted state $\hat{x}_{k|k-1}$ and prior covariance $P_{k|k-1}$.
2. The innovation $y_k$, innovation variance $S_k$, and Kalman gain vector $K_k$.
3. The posterior state estimate $\hat{x}_{k|k}$ and posterior covariance $P_{k|k}$ using both the textbook formula and Joseph form.

**Given Data:**
- State dimension $n = 2$, measurement dimension $m = 1$.
- Prior: $\hat{x}_{k-1|k-1} = [10.0, 2.0]^T$, $P_{k-1|k-1} = \begin{bmatrix} 1.0 & 0.2 \\ 0.2 & 0.5 \end{bmatrix}$.
- Transition: $F = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, $Q = \begin{bmatrix} 0.1 & 0.05 \\ 0.05 & 0.2 \end{bmatrix}$.
- Observation: $z_k = 12.8$, $H = [1, 0]$, $R = 0.5$.

**Step-by-Step Derivation:**
1. State prediction:
   $$\hat{x}_{k|k-1} = F \hat{x}_{k-1|k-1} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 10.0 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 12.0 \\ 2.0 \end{bmatrix}$$
2. Covariance prediction:
   $$F P_{k-1|k-1} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1.0 & 0.2 \\ 0.2 & 0.5 \end{bmatrix} = \begin{bmatrix} 1.2 & 0.7 \\ 0.2 & 0.5 \end{bmatrix}$$
   $$F P_{k-1|k-1} F^T = \begin{bmatrix} 1.2 & 0.7 \\ 0.2 & 0.5 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1.9 & 0.7 \\ 0.7 & 0.5 \end{bmatrix}$$
   Adding process noise $Q$:
   $$P_{k|k-1} = \begin{bmatrix} 1.9 & 0.7 \\ 0.7 & 0.5 \end{bmatrix} + \begin{bmatrix} 0.1 & 0.05 \\ 0.05 & 0.2 \end{bmatrix} = \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix}$$
3. Innovation and residual covariance:
   $$\hat{z}_{k|k-1} = H \hat{x}_{k|k-1} = [1, 0] \begin{bmatrix} 12.0 \\ 2.0 \end{bmatrix} = 12.0\text{ m}$$
   $$y_k = z_k - \hat{z}_{k|k-1} = 12.8 - 12.0 = 0.8\text{ m}$$
   $$S_k = H P_{k|k-1} H^T + R = P_{11} + R = 2.0 + 0.5 = 2.5\text{ m}^2$$
4. Kalman gain:
   $$P_{k|k-1} H^T = \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 2.0 \\ 0.75 \end{bmatrix}$$
   $$K_k = \frac{1}{S_k} P_{k|k-1} H^T = \frac{1}{2.5} \begin{bmatrix} 2.0 \\ 0.75 \end{bmatrix} = \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix}$$
5. State update:
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k = \begin{bmatrix} 12.0 \\ 2.0 \end{bmatrix} + \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix} (0.8) = \begin{bmatrix} 12.0 + 0.64 \\ 2.0 + 0.24 \end{bmatrix} = \begin{bmatrix} 12.64 \\ 2.24 \end{bmatrix}$$
   *Crucial Observation:* Measuring position $z_k = 12.8\text{ m}$ (higher than predicted $12.0\text{ m}$) not only increased estimated position to $12.64\text{ m}$, but also increased estimated velocity from $2.0\text{ m/s}$ to $2.24\text{ m/s}$, through the dynamic cross-correlation $P_{12} = 0.75$!
6. Covariance update (textbook formula):
   $$K_k H = \begin{bmatrix} 0.8 \\ 0.3 \end{bmatrix} \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 0.8 & 0.0 \\ 0.3 & 0.0 \end{bmatrix}$$
   $$I - K_k H = \begin{bmatrix} 0.2 & 0.0 \\ -0.3 & 1.0 \end{bmatrix}$$
   $$P_{k|k} = (I - K_k H) P_{k|k-1} = \begin{bmatrix} 0.2 & 0.0 \\ -0.3 & 1.0 \end{bmatrix} \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix} = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix}$$
7. Verification via Joseph form:
   $$M = I - K H = \begin{bmatrix} 0.2 & 0.0 \\ -0.3 & 1.0 \end{bmatrix}$$
   $$M P_{k|k-1} M^T = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix} \begin{bmatrix} 0.2 & -0.3 \\ 0.0 & 1.0 \end{bmatrix} = \begin{bmatrix} 0.08 & 0.03 \\ 0.03 & 0.43 \end{bmatrix}$$
   $$K R K^T = 0.5 \begin{bmatrix} 0.8 \\ 0.3 \end{bmatrix} \begin{bmatrix} 0.8 & 0.3 \end{bmatrix} = 0.5 \begin{bmatrix} 0.64 & 0.24 \\ 0.24 & 0.09 \end{bmatrix} = \begin{bmatrix} 0.32 & 0.12 \\ 0.12 & 0.045 \end{bmatrix}$$
   Summing:
   $$P_{\text{Joseph}} = \begin{bmatrix} 0.08 + 0.32 & 0.03 + 0.12 \\ 0.03 + 0.12 & 0.43 + 0.045 \end{bmatrix} = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix}$$

**Final Result:**
$$\hat{x}_{k|k} = \begin{bmatrix} 12.64 \\ 2.24 \end{bmatrix}, \quad P_{k|k} = \begin{bmatrix} 0.40 & 0.15 \\ 0.15 & 0.475 \end{bmatrix}$$

---

### Problem 5.2 (Worked Example): Numerical Demonstration of Joseph Form Resilience
**Problem Statement:** Suppose due to severe single-precision truncation or an imperfect gain computation, the gain applied is perturbed: $K_{\text{sub}} = \begin{bmatrix} 0.95 \\ 0.35 \end{bmatrix}$.
Evaluate the resulting $P$ using:
1. The textbook formula $P_{\text{textbook}} = (I - K_{\text{sub}} H) P_{k|k-1}$.
2. The Joseph form $P_{\text{Joseph}} = (I - K_{\text{sub}} H) P_{k|k-1} (I - K_{\text{sub}} H)^T + K_{\text{sub}} R K_{\text{sub}}^T$.
Demonstrate that $P_{\text{textbook}}$ is non-symmetric while $P_{\text{Joseph}}$ is strictly symmetric and positive-definite.

**Step-by-Step Derivation:**
1. Given prior $P_{k|k-1} = \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix}$, $H = [1, 0]$, $R = 0.5$.
2. Textbook formula:
   $$I - K_{\text{sub}} H = \begin{bmatrix} 1 - 0.95 & 0 \\ -0.35 & 1 \end{bmatrix} = \begin{bmatrix} 0.05 & 0 \\ -0.35 & 1 \end{bmatrix}$$
   $$P_{\text{textbook}} = \begin{bmatrix} 0.05 & 0 \\ -0.35 & 1 \end{bmatrix} \begin{bmatrix} 2.0 & 0.75 \\ 0.75 & 0.70 \end{bmatrix} = \begin{bmatrix} 0.10 & 0.0375 \\ -0.70 + 0.75 & -0.2625 + 0.70 \end{bmatrix} = \begin{bmatrix} 0.10 & 0.0375 \\ 0.05 & 0.4375 \end{bmatrix}$$
   *Notice:* $P_{12} = 0.0375 \neq P_{21} = 0.0500$. The textbook formula has completely lost symmetry!
3. Joseph form calculation:
   $$M = \begin{bmatrix} 0.05 & 0 \\ -0.35 & 1 \end{bmatrix}$$
   $$M P_{k|k-1} = \begin{bmatrix} 0.10 & 0.0375 \\ 0.05 & 0.4375 \end{bmatrix}$$
   $$M P_{k|k-1} M^T = \begin{bmatrix} 0.10 & 0.0375 \\ 0.05 & 0.4375 \end{bmatrix} \begin{bmatrix} 0.05 & -0.35 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 0.005 & 0.0025 \\ 0.0025 & 0.420 \end{bmatrix}$$
   $$K_{\text{sub}} R K_{\text{sub}}^T = 0.5 \begin{bmatrix} 0.95 \\ 0.35 \end{bmatrix} \begin{bmatrix} 0.95 & 0.35 \end{bmatrix} = 0.5 \begin{bmatrix} 0.9025 & 0.3325 \\ 0.3325 & 0.1225 \end{bmatrix} = \begin{bmatrix} 0.45125 & 0.16625 \\ 0.16625 & 0.06125 \end{bmatrix}$$
   Summing:
   $$P_{\text{Joseph}} = \begin{bmatrix} 0.005 + 0.45125 & 0.0025 + 0.16625 \\ 0.0025 + 0.16625 & 0.420 + 0.06125 \end{bmatrix} = \begin{bmatrix} 0.45625 & 0.16875 \\ 0.16875 & 0.48125 \end{bmatrix}$$
4. Positive definiteness check of $P_{\text{Joseph}}$:
   $$\det(P_{\text{Joseph}}) = (0.45625)(0.48125) - (0.16875)^2 = 0.21957 - 0.02848 = 0.19109 > 0$$
   $P_{11} = 0.45625 > 0$. Both eigenvalues are strictly positive.

**Final Result:**
$$P_{\text{textbook}} = \begin{bmatrix} 0.100 & 0.0375 \\ 0.050 & 0.4375 \end{bmatrix}\text{ (Asymmetric!)}, \quad P_{\text{Joseph}} = \begin{bmatrix} 0.45625 & 0.16875 \\ 0.16875 & 0.48125 \end{bmatrix}\text{ (Symmetric, Positive-Definite)}$$

---

### Problem 5.3 (Worked Example): Vector Measurement Inversion via Cholesky
**Problem Statement:** A 4D robot receives simultaneous position measurements from two independent GPS receivers:
$$z_k = \begin{bmatrix} z_1 \\ z_2 \end{bmatrix}, \quad H = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 1 & 0 & 0 & 0 \end{bmatrix}$$
The predicted position variance is $P_{11} = 4.0\text{ m}^2$, with noise covariances $R = \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 3.0 \end{bmatrix}$.
1. Compute the innovation covariance $S \in \mathbb{R}^{2 \times 2}$.
2. Compute the Cholesky factor $L$ such that $S = L L^T$.
3. Invert $S$ using forward and back-substitution on $L$.

**Step-by-Step Derivation:**
1. Computing $H P H^T$:
   $$H P = \begin{bmatrix} P_{11} & P_{12} & P_{13} & P_{14} \\ P_{11} & P_{12} & P_{13} & P_{14} \end{bmatrix}$$
   $$H P H^T = \begin{bmatrix} P_{11} & P_{11} \\ P_{11} & P_{11} \end{bmatrix} = \begin{bmatrix} 4.0 & 4.0 \\ 4.0 & 4.0 \end{bmatrix}$$
   $$S = H P H^T + R = \begin{bmatrix} 4.0 & 4.0 \\ 4.0 & 4.0 \end{bmatrix} + \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 3.0 \end{bmatrix} = \begin{bmatrix} 6.0 & 4.5 \\ 4.5 & 7.0 \end{bmatrix}$$
2. Cholesky decomposition $S = L L^T = \begin{bmatrix} L_{11} & 0 \\ L_{21} & L_{22} \end{bmatrix} \begin{bmatrix} L_{11} & L_{21} \\ 0 & L_{22} \end{bmatrix}$:
   $$L_{11} = \sqrt{S_{11}} = \sqrt{6.0} \approx 2.449490$$
   $$L_{21} = \frac{S_{21}}{L_{11}} = \frac{4.5}{\sqrt{6.0}} \approx 1.837117$$
   $$L_{22} = \sqrt{S_{22} - L_{21}^2} = \sqrt{7.0 - \frac{20.25}{6.0}} = \sqrt{7.0 - 3.375} = \sqrt{3.625} \approx 1.903943$$
   $$L = \begin{bmatrix} 2.449490 & 0 \\ 1.837117 & 1.903943 \end{bmatrix}$$
3. Matrix inversion via Cholesky:
   $$\det(S) = (6.0)(7.0) - (4.5)^2 = 42.0 - 20.25 = 21.75$$
   $$S^{-1} = \frac{1}{21.75} \begin{bmatrix} 7.0 & -4.5 \\ -4.5 & 6.0 \end{bmatrix} \approx \begin{bmatrix} 0.321839 & -0.206897 \\ -0.206897 & 0.275862 \end{bmatrix}$$
   Check product: $S S^{-1} = I_2$.

**Final Result:**
$$L = \begin{bmatrix} 2.4495 & 0 \\ 1.8371 & 1.9039 \end{bmatrix}, \quad S^{-1} = \begin{bmatrix} 0.3218 & -0.2069 \\ -0.2069 & 0.2759 \end{bmatrix}$$

---

### Problem 5.4 (Worked Example): Equivalence of Vector Update and Sequential Scalar Updates
**Problem Statement:** Consider a prior state $x = [p, v]^T$ with $P = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$. Two uncorrelated measurements arrive at step $k$: position $z_1 = 3.0$ with $H_1 = [1, 0], R_1 = 2$, and velocity $z_2 = 1.0$ with $H_2 = [0, 1], R_2 = 2$.
Show that processing $z = [z_1, z_2]^T$ simultaneously in a single vector update produces the exact same posterior covariance $P_{k|k}$ as processing $z_1$ first and then $z_2$ sequentially.

**Step-by-Step Derivation:**
1. Simultaneous Vector Update:
   $$H = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I_2, \quad R = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = 2 I_2$$
   $$S = H P H^T + R = 2 I_2 + 2 I_2 = 4 I_2 \implies S^{-1} = 0.25 I_2$$
   $$K = P H^T S^{-1} = (2 I_2) (0.25 I_2) = 0.5 I_2$$
   $$P_{\text{post}} = (I - K H) P = (I_2 - 0.5 I_2) (2 I_2) = 0.5 \times 2 I_2 = 1.0 I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$
2. Sequential Scalar Update:
   - Step 2a: Update with $z_1$ ($H_1 = [1, 0], R_1 = 2$):
     $$s_1 = H_1 P H_1^T + R_1 = P_{11} + R_1 = 2 + 2 = 4$$
     $$K_1 = \frac{1}{s_1} P H_1^T = \frac{1}{4} \begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 0 \end{bmatrix}$$
     $$P^{(1)} = (I - K_1 H_1) P = \left(\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0.5 & 0 \\ 0 & 0 \end{bmatrix}\right) \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 0.5 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$
   - Step 2b: Update with $z_2$ using intermediate $P^{(1)}$ ($H_2 = [0, 1], R_2 = 2$):
     $$s_2 = H_2 P^{(1)} H_2^T + R_2 = P^{(1)}_{22} + R_2 = 2 + 2 = 4$$
     $$K_2 = \frac{1}{s_2} P^{(1)} H_2^T = \frac{1}{4} \begin{bmatrix} 0 \\ 2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0.5 \end{bmatrix}$$
     $$P^{(2)} = (I - K_2 H_2) P^{(1)} = \left(\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0 & 0 \\ 0 & 0.5 \end{bmatrix}\right) \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0.5 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$

**Final Result:**
$$P_{\text{vector}} = P_{\text{sequential}} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$
Sequential updating is algebraically identical to vector updating for uncorrelated sensor noise.

---

### Problem 5.5 (Worked Example): Monotonic Covariance Contraction Proof
**Problem Statement:** Prove that for any valid measurement sensitivity matrix $H$ and measurement noise covariance $R > 0$, the posterior covariance is strictly less than or equal to the prior covariance in the Loewner partial order:
$$P_{k|k} \le P_{k|k-1}$$
(i.e. $P_{k|k-1} - P_{k|k}$ is positive semi-definite).

**Step-by-Step Derivation:**
1. From the optimal covariance update formula:
   $$P_{k|k} = (I - K_k H_k) P_{k|k-1} = P_{k|k-1} - K_k H_k P_{k|k-1}$$
2. Difference between prior and posterior:
   $$\Delta P = P_{k|k-1} - P_{k|k} = K_k H_k P_{k|k-1}$$
3. Recall that $K_k = P_{k|k-1} H_k^T S_k^{-1}$. Therefore:
   $$\Delta P = \left( P_{k|k-1} H_k^T S_k^{-1} \right) H_k P_{k|k-1} = P_{k|k-1} H_k^T S_k^{-1} H_k P_{k|k-1}$$
4. Let $B = H_k P_{k|k-1} \in \mathbb{R}^{m \times n}$. Then:
   $$\Delta P = B^T S_k^{-1} B$$
5. Since $S_k = H_k P_{k|k-1} H_k^T + R_k$, and $R_k \in \mathbb{S}_{++}^m$, $S_k$ is strictly positive definite. Hence $S_k^{-1} \in \mathbb{S}_{++}^m$.
6. For any arbitrary non-zero vector $z \in \mathbb{R}^n$:
   $$z^T \Delta P z = z^T B^T S_k^{-1} B z = (B z)^T S_k^{-1} (B z)$$
   Let $w = B z \in \mathbb{R}^m$. Since $S_k^{-1}$ is positive definite:
   $$w^T S_k^{-1} w \ge 0$$
   with equality if and only if $w = B z = 0$.
7. Thus, $\Delta P = P_{k|k-1} - P_{k|k} \ge 0$, which proves that $P_{k|k} \le P_{k|k-1}$ in the Loewner order. $\blacksquare$

---

### Problem 5.6 (Worked Example): Asymptotic Analysis: Perfect Measurement ($R \to 0$)
**Problem Statement:** Let a scalar state have prior variance $P^- = 5.0$. Evaluate the Kalman gain $K$ and posterior variance $P^+$ as measurement noise $R \to 0$ for $H = 1$. What happens if $H = [1, 1]$ for a 2D state $x = [x_1, x_2]^T$ with $P^- = I_2$?

**Step-by-Step Derivation:**
1. 1D Scalar Case:
   $$S = H P^- H^T + R = 5.0 + R$$
   $$K = \frac{P^- H^T}{S} = \frac{5.0}{5.0 + R} \to 1.0\text{ as }R \to 0$$
   $$P^+ = (1 - K) P^- = \left(1 - \frac{5.0}{5.0 + R}\right) 5.0 = \frac{5.0 R}{5.0 + R} \to 0\text{ as }R \to 0$$
2. 2D State Case with rank-1 measurement:
   $$H = [1, 1], \quad P^- = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$
   $$S = H P^- H^T + R = [1, 1] \begin{bmatrix} 1 \\ 1 \end{bmatrix} + R = 2.0 + R$$
   As $R \to 0$, $S \to 2.0$.
   $$K = P^- H^T S^{-1} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} \frac{1}{2} = \begin{bmatrix} 0.5 \\ 0.5 \end{bmatrix}$$
   $$P^+ = (I - K H) P^- = \left( \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0.5 & 0.5 \\ 0.5 & 0.5 \end{bmatrix} \right) I_2 = \begin{bmatrix} 0.5 & -0.5 \\ -0.5 & 0.5 \end{bmatrix}$$
3. Eigenvalues of $P^+$:
   $$\det(\lambda I - P^+) = \lambda(\lambda - 1) = 0 \implies \lambda_1 = 0, \lambda_2 = 1.0$$
   The variance in the direction of the measurement $(x_1 + x_2)$ collapses to exactly zero ($\lambda_1 = 0$). However, the orthogonal subspace $(x_1 - x_2)$ was unobserved by $H$, so its variance remains completely unchanged at $1.0$!

**Final Result:**
$$\text{Scalar: }P^+ \to 0; \quad \text{2D: }P^+ = \begin{bmatrix} 0.5 & -0.5 \\ -0.5 & 0.5 \end{bmatrix}\text{ with eigenvalues }\{0, 1\}$$

---

### Problem 5.7 (Worked Example): Cross-Covariance Conditioning in Multi-State Systems
**Problem Statement:** A 2D state $x = [p, v]^T$ has prior covariance $P = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$. A sensor measures position only ($H = [1, 0]$) with noise $R = 2$.
1. Compute the posterior covariance $P_{k|k}$.
2. Determine by what percentage the unmeasured velocity variance $P_{22}$ was reduced purely through cross-covariance conditioning.

**Step-by-Step Derivation:**
1. Prior covariance elements: $P_{11} = 4, P_{12} = 2, P_{22} = 3$.
2. Innovation variance:
   $$S = H P H^T + R = P_{11} + R = 4 + 2 = 6$$
3. Kalman gain:
   $$K = \frac{1}{S} \begin{bmatrix} P_{11} \\ P_{12} \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 4 \\ 2 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix}$$
4. Covariance update:
   $$P_{k|k} = P - K S K^T = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix} - 6 \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix} \begin{bmatrix} 2/3 & 1/3 \end{bmatrix}$$
   $$K S K^T = 6 \begin{bmatrix} 4/9 & 2/9 \\ 2/9 & 1/9 \end{bmatrix} = \begin{bmatrix} 8/3 & 4/3 \\ 4/3 & 2/3 \end{bmatrix} \approx \begin{bmatrix} 2.667 & 1.333 \\ 1.333 & 0.667 \end{bmatrix}$$
   $$P_{k|k} = \begin{bmatrix} 4 - 8/3 & 2 - 4/3 \\ 2 - 4/3 & 3 - 2/3 \end{bmatrix} = \begin{bmatrix} 4/3 & 2/3 \\ 2/3 & 7/3 \end{bmatrix} \approx \begin{bmatrix} 1.333 & 0.667 \\ 0.667 & 2.333 \end{bmatrix}$$
5. Reduction in velocity variance $P_{22}$:
   $$P_{22}^- = 3.0, \quad P_{22}^+ = \frac{7}{3} \approx 2.3333$$
   $$\Delta P_{22} = 3.0 - 2.3333 = 0.6667$$
   $$\% \text{ Reduction} = \frac{0.6667}{3.0} \times 100\% = 22.22\%$$

**Final Result:**
$$P_{k|k} = \begin{bmatrix} 1.333 & 0.667 \\ 0.667 & 2.333 \end{bmatrix}, \quad \text{Velocity variance reduced by }22.22\%$$

---

### Problem 5.8 (Worked Example): Computational Flop Count Comparison
**Problem Statement:** For state dimension $n$ and measurement dimension $m$, calculate the exact floating-point operation (flop) counts for:
1. The textbook covariance update: $P^+ = (I - K H) P^-$.
2. The Joseph form covariance update: $P^+ = (I - K H) P^- (I - K H)^T + K R K^T$.
Evaluate the ratio of flop counts for $n = 15, m = 6$.

**Step-by-Step Derivation:**
1. Textbook formula operations:
   - Compute $A = K H$: $K \in \mathbb{R}^{n \times m}, H \in \mathbb{R}^{m \times n} \implies 2 n^2 m$ flops.
   - Subtract $M = I - A$: $n$ flops.
   - Multiply $M P^-$: $M \in \mathbb{R}^{n \times n}, P^- \in \mathbb{R}^{n \times n} \implies 2 n^3$ flops.
   - Total: $\text{Flops}_{\text{textbook}} \approx 2 n^3 + 2 n^2 m$.
2. Joseph form operations:
   - Compute $M = I - K H$: $2 n^2 m + n$ flops.
   - Compute $T_1 = M P^-$: $2 n^3$ flops.
   - Compute $T_2 = T_1 M^T$: taking advantage of symmetry, $n^3$ flops.
   - Compute $T_3 = K R$: $K \in \mathbb{R}^{n \times m}, R \in \mathbb{R}^{m \times m} \implies 2 n m^2$ flops.
   - Compute $T_4 = T_3 K^T$: taking advantage of symmetry, $n^2 m$ flops.
   - Add $T_2 + T_4$: $n^2 / 2$ flops.
   - Total: $\text{Flops}_{\text{Joseph}} \approx 3 n^3 + 3 n^2 m + 2 n m^2$.
3. Evaluation for $n = 15, m = 6$:
   - $n^3 = 3375, n^2 = 225, m^2 = 36$.
   - $\text{Flops}_{\text{textbook}} = 2(3375) + 2(225)(6) = 6750 + 2700 = 9,450\text{ flops}$.
   - $\text{Flops}_{\text{Joseph}} = 3(3375) + 3(225)(6) + 2(15)(36) = 10125 + 4050 + 1080 = 15,255\text{ flops}$.
   - Ratio:
     $$\frac{\text{Flops}_{\text{Joseph}}}{\text{Flops}_{\text{textbook}}} = \frac{15,255}{9,450} \approx 1.614$$

**Final Result:**
$$\text{Flops}_{\text{textbook}} = 9,450, \quad \text{Flops}_{\text{Joseph}} = 15,255 \quad (\text{Overhead factor } \approx 1.61\times)$$
*Conclusion:* The Joseph form costs roughly $60\%$ more operations, which is completely negligible (less than $5\mu\text{s}$) compared to the catastrophe of filter divergence.

---

### Problem 5.9 (Worked Example): Singular Innovation Covariance Detection
**Problem Statement:** A software bug in a multi-camera pipeline passes two identical cameras with identical noise models as two distinct sensors, creating $z = [z_1, z_2]^T$ with $H = \begin{bmatrix} 1 & 0 \\ 1 & 0 \end{bmatrix}$ and $R = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$ (perfectly correlated noise). Show that $S$ is singular. How should a robust engine handle this?

**Step-by-Step Derivation:**
1. Given $P^- = \begin{bmatrix} p_{11} & p_{12} \\ p_{12} & p_{22} \end{bmatrix}$.
2. Innovation covariance:
   $$H P^- H^T = \begin{bmatrix} p_{11} & p_{11} \\ p_{11} & p_{11} \end{bmatrix}$$
   $$S = H P^- H^T + R = \begin{bmatrix} p_{11} + 1 & p_{11} + 1 \\ p_{11} + 1 & p_{11} + 1 \end{bmatrix}$$
3. Determinant of $S$:
   $$\det(S) = (p_{11} + 1)^2 - (p_{11} + 1)^2 = 0$$
   The rank of $S$ is strictly $1$.
4. Robust Handling:
   - When attempting Cholesky decomposition $S = L L^T$, $L_{22} = \sqrt{S_{22} - L_{21}^2} = 0$.
   - A robust engine detects $L_{ii} \le \epsilon$ ($10^{-12}$) and throws an explicit `SingularInnovationException` or applies pseudoinverse via SVD/regularization: $S_{\text{reg}} = S + \epsilon I_m$.
   - Best practice: prune redundant duplicate measurements before passing to the Kalman filter.

**Final Result:**
$$\det(S) = 0\text{ (Singular matrix, non-invertible)}$$

---

### Problem 5.10 (Worked Example): Full Multivariable Cycle Python/TypeScript Prototype
**Problem Statement:** Write a complete algorithmic specification for a single step of the multivariable linear Kalman filter, explicitly enforcing the Joseph stabilized covariance update.

**Step-by-Step Derivation:**
1. Input variables: $\hat{x} \in \mathbb{R}^n, P \in \mathbb{R}^{n \times n}, F \in \mathbb{R}^{n \times n}, B \in \mathbb{R}^{n \times p}, u \in \mathbb{R}^p, Q \in \mathbb{R}^{n \times n}, z \in \mathbb{R}^m, H \in \mathbb{R}^{m \times n}, R \in \mathbb{R}^{m \times m}$.
2. Predict Phase:
   $$\hat{x} \leftarrow F \hat{x} + B u$$
   $$P \leftarrow F P F^T + Q$$
   $$P \leftarrow \frac{1}{2}(P + P^T)$$
3. Innovation Phase:
   $$y \leftarrow z - H \hat{x}$$
   $$S \leftarrow H P H^T + R$$
   $$S \leftarrow \frac{1}{2}(S + S^T)$$
4. Gain Phase:
   $$L \leftarrow \operatorname{Cholesky}(S) \quad (S = L L^T)$$
   $$K \leftarrow P H^T (L L^T)^{-1}$$
5. Update Phase:
   $$\hat{x} \leftarrow \hat{x} + K y$$
   $$M \leftarrow I_n - K H$$
   $$P \leftarrow M P M^T + K R K^T$$
   $$P \leftarrow \frac{1}{2}(P + P^T)$$
6. Output: Updated $(\hat{x}, P, y, S, K)$.

**Final Result:**
Complete algorithm specified with symmetric guarantees at every stage.

---

### Problem 5.11 (Solved Exercise): Trace Minimization Property of Posterior Covariance
**Problem Statement:** For scalar state $x$ with prior $p = 4$, $h = 1$, and $r = 1$, plot or tabulate the posterior variance $p(K) = (1 - K)^2 p + K^2 r$ as a function of $K \in [0, 1]$ in steps of $0.2$, and verify that the minimum occurs at $K = \frac{p}{p + r} = 0.8$.

**Step-by-Step Solution:**
1. Expression: $p(K) = 4 (1 - K)^2 + 1 \cdot K^2 = 4(1 - 2K + K^2) + K^2 = 5 K^2 - 8 K + 4$.
2. Evaluating values:
   - $K = 0.0$: $p(0.0) = 4.000$
   - $K = 0.2$: $p(0.2) = 5(0.04) - 8(0.2) + 4 = 0.2 - 1.6 + 4 = 2.600$
   - $K = 0.4$: $p(0.4) = 5(0.16) - 8(0.4) + 4 = 0.8 - 3.2 + 4 = 1.600$
   - $K = 0.6$: $p(0.6) = 5(0.36) - 8(0.6) + 4 = 1.8 - 4.8 + 4 = 1.000$
   - $K = 0.8$: $p(0.8) = 5(0.64) - 8(0.8) + 4 = 3.2 - 6.4 + 4 = 0.800$
   - $K = 1.0$: $p(1.0) = 5(1.00) - 8(1.0) + 4 = 5.0 - 8.0 + 4 = 1.000$
3. Verification:
   $$\frac{d p(K)}{dK} = 10 K - 8 = 0 \implies K^* = 0.80$$
   $$p(K^*) = 0.800$$
   Textbook formula: $(1 - 0.8) \times 4 = 0.2 \times 4 = 0.800$.

**Final Answer:**
$$\min_K p(K) = 0.800\text{ at }K^* = 0.80$$

---

### Problem 5.12 (Solved Exercise): Zero Gain Behavior
**Problem Statement:** If a sensor measurement is completely ignored by setting $K_k = 0$, show that the Joseph form evaluates to $P_{k|k} = P_{k|k-1}$ and $\hat{x}_{k|k} = \hat{x}_{k|k-1}$.

**Step-by-Step Solution:**
1. Set $K_k = 0_{n \times m}$.
2. State update:
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + 0 \cdot y_k = \hat{x}_{k|k-1}$$
3. Joseph form update:
   $$M = I - K_k H_k = I - 0 = I$$
   $$P_{k|k} = I P_{k|k-1} I^T + 0 R_k 0^T = P_{k|k-1}$$
4. Both state and covariance remain identically equal to the prior prediction. $\blacksquare$

---

### Problem 5.13 (Solved Exercise): Infinite Measurement Noise Limit
**Problem Statement:** Let measurement noise covariance $R_k = \rho I_m$. Prove that $\lim_{\rho \to \infty} K_k = 0_{n \times m}$ and $\lim_{\rho \to \infty} P_{k|k} = P_{k|k-1}$.

**Step-by-Step Solution:**
1. Kalman gain formula:
   $$K_k = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + \rho I_m)^{-1}$$
2. Pulling out $\rho$:
   $$(H_k P_{k|k-1} H_k^T + \rho I_m)^{-1} = \frac{1}{\rho} \left( \frac{1}{\rho} H_k P_{k|k-1} H_k^T + I_m \right)^{-1}$$
3. Taking the limit as $\rho \to \infty$:
   $$\lim_{\rho \to \infty} \frac{1}{\rho} (0 + I_m)^{-1} = \lim_{\rho \to \infty} \frac{1}{\rho} I_m = 0_{m \times m}$$
4. Therefore:
   $$\lim_{\rho \to \infty} K_k = P_{k|k-1} H_k^T (0) = 0_{n \times m}$$
5. Substituting into the Joseph update:
   $$\lim_{\rho \to \infty} P_{k|k} = (I - 0) P_{k|k-1} (I - 0)^T + \lim_{\rho \to \infty} (P H^T \rho^{-1}) (\rho I) (\rho^{-1} H P) = P_{k|k-1} + 0 = P_{k|k-1} \quad \blacksquare$$

---

### Problem 5.14 (Solved Exercise): Zero Process Noise Asymptotics
**Problem Statement:** In a static parameter estimation problem, $F = I_n$ and $Q = 0$. Show that if $H = I_n$ and $R = r I_n$, the covariance after $N$ identical measurements scales as $P_N = \frac{1}{N + r P_0^{-1}} I_n \approx \frac{r}{N} I_n$.

**Step-by-Step Solution:**
1. For static parameter estimation in information form:
   $$P_N^{-1} = P_0^{-1} + \sum_{k=1}^N H^T R^{-1} H$$
2. Since $H = I$ and $R^{-1} = \frac{1}{r} I$:
   $$P_N^{-1} = P_0^{-1} + N \frac{1}{r} I$$
3. If $P_0 = p_0 I$:
   $$P_N^{-1} = \left(\frac{1}{p_0} + \frac{N}{r}\right) I = \left(\frac{r + N p_0}{p_0 r}\right) I$$
4. Inverting:
   $$P_N = \frac{p_0 r}{N p_0 + r} I = \frac{r}{N + r / p_0} I$$
5. As $N \to \infty$, $P_N \to \frac{r}{N} I \propto \frac{1}{N}$.

**Final Answer:**
$$P_N = \frac{r}{N + r / p_0} I_n \approx \frac{r}{N} I_n\text{ as }N \to \infty$$

---

### Problem 5.15 (Solved Exercise): Information Matrix Update
**Problem Statement:** Define the information matrix $Y = P^{-1}$ and information state vector $\hat{y} = P^{-1} \hat{x}$. Show that the measurement update can be written as simple matrix additions:
$$Y_{k|k} = Y_{k|k-1} + H_k^T R_k^{-1} H_k$$
$$\hat{y}_{k|k} = \hat{y}_{k|k-1} + H_k^T R_k^{-1} z_k$$

**Step-by-Step Solution:**
1. By the Woodbury matrix identity:
   $$(A + U C V)^{-1} = A^{-1} - A^{-1} U (C^{-1} + V A^{-1} U)^{-1} V A^{-1}$$
2. In the Kalman filter, $P_{k|k} = (P_{k|k-1}^{-1} + H_k^T R_k^{-1} H_k)^{-1}$.
   Taking the direct inverse of both sides:
   $$Y_{k|k} = P_{k|k}^{-1} = P_{k|k-1}^{-1} + H_k^T R_k^{-1} H_k = Y_{k|k-1} + H_k^T R_k^{-1} H_k$$
3. For the information state vector $\hat{y}_{k|k} = P_{k|k}^{-1} \hat{x}_{k|k}$:
   $$\hat{x}_{k|k} = P_{k|k} (P_{k|k-1}^{-1} \hat{x}_{k|k-1} + H_k^T R_k^{-1} z_k)$$
   Multiplying both sides by $P_{k|k}^{-1}$:
   $$\hat{y}_{k|k} = \hat{y}_{k|k-1} + H_k^T R_k^{-1} z_k \quad \blacksquare$$

---

### Problem 5.16 (Solved Exercise): Underdetermined Observation Subspace
**Problem Statement:** A 3D state $x = [x_1, x_2, x_3]^T$ has prior $P^- = \operatorname{diag}(1, 4, 9)$. A single scalar sensor measures $z = x_1 + x_2$ with $R = 1$. Write $H$, compute $S$, $K$, and show which state components remain completely uninfluenced by the update.

**Step-by-Step Solution:**
1. Measurement sensitivity: $H = [1, 1, 0]$.
2. Innovation variance:
   $$S = H P^- H^T + R = [1, 1, 0] \begin{bmatrix} 1 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 9 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} + 1 = (1 + 4 + 0) + 1 = 6$$
3. Kalman gain:
   $$K = \frac{1}{S} P^- H^T = \frac{1}{6} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 9 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 1 \\ 4 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/6 \\ 2/3 \\ 0 \end{bmatrix}$$
4. State update:
   $$\hat{x}_3^+ = \hat{x}_3^- + K_3 y = \hat{x}_3^- + 0 \cdot y = \hat{x}_3^-$$
   The third state component $x_3$ has $K_3 = 0$, meaning its estimate and variance ($P_{33}^+ = 9$) are completely uninfluenced by the observation.

**Final Answer:**
$$K = \begin{bmatrix} 1/6 \\ 2/3 \\ 0 \end{bmatrix}, \quad x_3\text{ is completely unaffected}$$

---

### Problem 5.17 (Solved Exercise): Cross-Correlation Growth in Predict Step
**Problem Statement:** Start with an uncorrelated prior $P_{k-1|k-1} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ and $Q = 0$. For state transition $F = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, compute $P_{k|k-1}$ and the correlation coefficient $\rho_{12}$.

**Step-by-Step Solution:**
1. Covariance prediction:
   $$P_{k|k-1} = F P_{k-1|k-1} F^T = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$$
2. Correlation coefficient:
   $$\rho_{12} = \frac{P_{12}}{\sqrt{P_{11} P_{22}}} = \frac{1}{\sqrt{2 \times 1}} = \frac{1}{\sqrt{2}} \approx 0.7071$$
3. Even though the prior had zero cross-correlation ($\rho = 0$), dynamic evolution alone generated strong positive correlation ($\rho \approx 70.7\%$).

**Final Answer:**
$$P_{k|k-1} = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}, \quad \rho_{12} = \frac{1}{\sqrt{2}} \approx 0.7071$$

---

### Problem 5.18 (Solved Exercise): Effect of Measurement Delay
**Problem Statement:** A measurement $z_{k-d}$ arrives with a known delay of $d = 2$ steps. Describe how the linear Kalman filter can incorporate this delayed measurement without re-filtering the entire history from step 0.

**Step-by-Step Solution:**
1. Maintain a fixed rolling buffer of state estimates and covariances from step $k-d$ to $k$: $\{\hat{x}_{i|i}, P_{i|i}, u_i, z_i\}$ for $i \in [k-d, k]$.
2. At the current step $k$, when $z_{k-d}$ arrives:
   - Roll back state to step $k-d$: take $(\hat{x}_{k-d|k-d-1}, P_{k-d|k-d-1})$.
   - Execute the measurement update at step $k-d$ with the delayed $z_{k-d}$ to obtain updated $(\hat{x}_{k-d|k-d}, P_{k-d|k-d})$.
   - Re-propagate (forward pass) through steps $i = k-d+1, \dots, k$ using the stored control inputs $u_{i-1}$ and any measurements $z_i$ that arrived on those steps.
3. This forward playback restores the exact optimal state estimate at time step $k$ with zero latency distortion.

**Final Answer:**
Buffer roll-back and replay over interval $[k-d, k]$ restores exact Bayesian optimality.

---

### Problem 5.19 (Solved Exercise): Eigenvalue Contraction under Update
**Problem Statement:** Let $P^- = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$. Compute the eigenvalues of $P^-$. For $H = [1, 0]$ and $R = 1$, compute $P^+$ and verify that its eigenvalues are strictly less than or equal to those of $P^-$.

**Step-by-Step Solution:**
1. Eigenvalues of $P^-$:
   $$\det(\lambda I - P^-) = (\lambda - 2)^2 - 1 = 0 \implies \lambda = 2 \pm 1 \implies \lambda_1 = 3, \lambda_2 = 1$$
2. Measurement update:
   $$S = P_{11}^- + R = 2 + 1 = 3$$
   $$K = \frac{1}{3} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix}$$
   $$P^+ = P^- - K S K^T = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix} - 3 \begin{bmatrix} 4/9 & 2/9 \\ 2/9 & 1/9 \end{bmatrix} = \begin{bmatrix} 2 - 4/3 & 1 - 2/3 \\ 1 - 2/3 & 2 - 1/3 \end{bmatrix} = \begin{bmatrix} 2/3 & 1/3 \\ 1/3 & 5/3 \end{bmatrix}$$
3. Eigenvalues of $P^+$:
   $$\det(\lambda I - P^+) = (\lambda - 2/3)(\lambda - 5/3) - 1/9 = \lambda^2 - \frac{7}{3}\lambda + \frac{10}{9} - \frac{1}{9} = \lambda^2 - \frac{7}{3}\lambda + 1 = 0$$
   $$\lambda = \frac{7/3 \pm \sqrt{49/9 - 4}}{2} = \frac{7/3 \pm \sqrt{13}/3}{2} = \frac{7 \pm \sqrt{13}}{6}$$
   $$\lambda_1^+ = \frac{7 + 3.60555}{6} = \frac{10.60555}{6} \approx 1.7676$$
   $$\lambda_2^+ = \frac{7 - 3.60555}{6} = \frac{3.39445}{6} \approx 0.5657$$
4. Comparison:
   $$\lambda_1^+ = 1.7676 < \lambda_1^- = 3.0$$
   $$\lambda_2^+ = 0.5657 < \lambda_2^- = 1.0$$
   Both eigenvalues strictly contracted.

**Final Answer:**
$$\text{Prior: }\{1.0, 3.0\}, \quad \text{Posterior: }\{0.5657, 1.7676\}$$

---

### Problem 5.20 (Solved Exercise): Positive Definiteness Check in Floating Point
**Problem Statement:** In a tracking application with near-zero measurement noise $R = 10^{-14}$, a 64-bit IEEE double implementation of the textbook formula produces $P^+ = \begin{bmatrix} 1.0 \times 10^{-16} & 2.0 \times 10^{-8} \\ 2.0 \times 10^{-8} & 1.0 \end{bmatrix}$. Compute the determinant of $P^+$ and determine if it remains positive definite.

**Step-by-Step Solution:**
1. Determinant calculation:
   $$\det(P^+) = P_{11} P_{22} - P_{12}^2 = (1.0 \times 10^{-16})(1.0) - (2.0 \times 10^{-8})^2$$
   $$\det(P^+) = 1.0 \times 10^{-16} - 4.0 \times 10^{-16} = -3.0 \times 10^{-16} < 0$$
2. Since $\det(P^+) < 0$, one eigenvalue must be strictly negative!
   Eigenvalues satisfy $\lambda_1 \lambda_2 = -3.0 \times 10^{-16} < 0$.
3. When the engine subsequently attempts Cholesky factorization $L_{11} = \sqrt{P_{11}} = 10^{-8}$, but in step 2:
   $$L_{22} = \sqrt{P_{22} - L_{21}^2} = \sqrt{1.0 - (2.0)^2} = \sqrt{-3.0} \implies \text{NaN (Crash!)}$$
4. This exemplifies why the Joseph stabilized update is mandatory for production robotic state estimators.

**Final Answer:**
$$\det(P^+) = -3.0 \times 10^{-16} < 0\text{ (Indefinite matrix, Cholesky fails)}$$


---

# Chapter 6: Rigorous Mathematical Derivation of the Optimal Kalman Gain Matrix

## 6.1 Introduction: Optimality in Stochastic Estimation

In engineering systems, many ad-hoc estimators can blend sensor signals and dynamic models. One could choose an arbitrary gain matrix $K$ and update states via $\hat{x}_{k|k} = \hat{x}_{k|k-1} + K y_k$. However, Rudolph E. Kalman’s historic 1960 breakthrough was not merely presenting a recursive filter; it was proving that among all possible linear estimators, the Kalman Gain $K_k^*$ is the **unique, mathematically optimal gain** that minimizes the total mean-squared estimation error.

Furthermore, if the noise processes are Gaussian, the Kalman Filter is not merely the best *linear* estimator—it is the absolute optimal Minimum Mean Square Error (MMSE) estimator across all conceivable nonlinear estimators.

In this chapter, we provide a complete, rigorous first-principles derivation of the multivariable optimal Kalman gain matrix $K_k$. We formulate the Linear Unbiased Minimum Variance Estimator (LUMVE) problem, apply matrix calculus identities to minimize the trace of the posterior covariance, verify the second-order sufficiency condition via the Hessian tensor, prove the geometric Orthogonality Principle, and demonstrate the statistical whiteness of the innovation sequence across 20 rigorous problems.

---

## 6.2 Problem Formulation: Linear Unbiased Minimum Variance Estimator (LUMVE)

Consider a linear discrete system:
$$x_k = F_k x_{k-1} + B_k u_{k-1} + w_k$$
$$z_k = H_k x_k + v_k$$
with zero-mean white process noise $w_k \sim \mathcal{N}(0, Q_k)$ and measurement noise $v_k \sim \mathcal{N}(0, R_k)$, where $R_k \in \mathbb{S}_{++}^m$.

Let the prior state estimate at time step $k$ be $\hat{x}_{k|k-1}$ with prior error $\tilde{x}_{k|k-1} = x_k - \hat{x}_{k|k-1}$ satisfying:
$$\mathbb{E}[\tilde{x}_{k|k-1}] = 0$$
$$\mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] = P_{k|k-1}$$

### 6.2.1 The Linear Structure Assumption
We restrict our attention to estimators that update the state estimate as a linear function of the prior estimate and the new observation $z_k$:
$$\hat{x}_{k|k} = C_k \hat{x}_{k|k-1} + K_k z_k$$
where $C_k \in \mathbb{R}^{n \times n}$ and $K_k \in \mathbb{R}^{n \times m}$ are parameter matrices to be determined.

### 6.2.2 The Unbiasedness Constraint
An estimator is unbiased if the expected value of the estimate equals the expected value of the true state:
$$\mathbb{E}[\hat{x}_{k|k}] = \mathbb{E}[x_k]$$

Substituting the linear structure:
$$\mathbb{E}[\hat{x}_{k|k}] = C_k \mathbb{E}[\hat{x}_{k|k-1}] + K_k \mathbb{E}[z_k] = C_k \mathbb{E}[x_k] + K_k \mathbb{E}[H_k x_k + v_k]$$
Since $\mathbb{E}[v_k] = 0$:
$$\mathbb{E}[\hat{x}_{k|k}] = (C_k + K_k H_k) \mathbb{E}[x_k]$$
For this equality to hold for any arbitrary true state expectation $\mathbb{E}[x_k]$, we must have:
$$C_k + K_k H_k = I_n \implies C_k = I_n - K_k H_k$$

Substituting $C_k$ back into the update structure:
$$\hat{x}_{k|k} = (I_n - K_k H_k) \hat{x}_{k|k-1} + K_k z_k = \hat{x}_{k|k-1} + K_k (z_k - H_k \hat{x}_{k|k-1})$$
Defining the innovation $y_k = z_k - H_k \hat{x}_{k|k-1}$:
$$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k$$

The unbiasedness constraint forces the update to be an affine combination driven by the innovation residual $y_k$.

---

## 6.3 The Optimization Objective: Minimizing the Error Variance

Define the posterior estimation error vector $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$. As shown in Chapter 5:
$$\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$$

The posterior error covariance matrix $P_{k|k} = \mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k}^T]$ is given by the Joseph equation:
$$P_{k|k} = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T$$

We desire to find the gain matrix $K_k$ that minimizes the total mean squared error (MSE):
$$J(K_k) = \mathbb{E}[\|\tilde{x}_{k|k}\|^2] = \mathbb{E}[\tilde{x}_{k|k}^T \tilde{x}_{k|k}] = \mathbb{E}[\operatorname{tr}(\tilde{x}_{k|k} \tilde{x}_{k|k}^T)] = \operatorname{tr}(P_{k|k})$$

The trace of a covariance matrix is the sum of its eigenvalues, which geometrically equals the sum of the squared semi-axes of the uncertainty ellipsoid. Minimizing $\operatorname{tr}(P_{k|k})$ minimizes the bounding sphere of estimation uncertainty.

---

## 6.4 Matrix Calculus Identities

To differentiate the scalar cost function $J(K_k)$ with respect to the matrix $K_k \in \mathbb{R}^{n \times m}$, we recall the fundamental identities of matrix calculus:

1. **Derivative of linear trace:**
   $$\frac{\partial \operatorname{tr}(A X B)}{\partial X} = A^T B^T$$
   $$\frac{\partial \operatorname{tr}(X A)}{\partial X} = A^T$$

2. **Derivative of quadratic trace with symmetric kernel:**
   For symmetric $B = B^T$:
   $$\frac{\partial \operatorname{tr}(X B X^T)}{\partial X} = 2 X B$$
   $$\frac{\partial \operatorname{tr}(A X B X^T C)}{\partial X} = A^T C^T X B^T + C A X B$$

3. **Chain rule for affine transformations:**
   Let $M = I - X H$. Then:
   $$\frac{\partial \operatorname{tr}(M P M^T)}{\partial X} = -2 M P H^T = -2 (I - X H) P H^T$$

---

## 6.5 Complete First-Principles Derivation of $K_k^*$

### Step 1: Expand the Cost Function
Expand the Joseph expression inside the trace operator:
$$J(K_k) = \operatorname{tr}\left( (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T \right)$$
$$= \operatorname{tr}\left( P_{k|k-1} - K_k H_k P_{k|k-1} - P_{k|k-1} H_k^T K_k^T + K_k H_k P_{k|k-1} H_k^T K_k^T + K_k R_k K_k^T \right)$$

Using the linearity and cyclic property of the trace ($\operatorname{tr}(A B) = \operatorname{tr}(B A)$ and $\operatorname{tr}(A^T) = \operatorname{tr}(A)$):
$$\operatorname{tr}(P_{k|k-1} H_k^T K_k^T) = \operatorname{tr}((K_k H_k P_{k|k-1})^T) = \operatorname{tr}(K_k H_k P_{k|k-1})$$

Combining the cross-terms:
$$J(K_k) = \operatorname{tr}(P_{k|k-1}) - 2 \operatorname{tr}(K_k H_k P_{k|k-1}) + \operatorname{tr}\left( K_k (H_k P_{k|k-1} H_k^T + R_k) K_k^T \right)$$

Let $S_k = H_k P_{k|k-1} H_k^T + R_k \in \mathbb{S}_{++}^m$ denote the innovation covariance. Then:
$$J(K_k) = \operatorname{tr}(P_{k|k-1}) - 2 \operatorname{tr}(K_k H_k P_{k|k-1}) + \operatorname{tr}(K_k S_k K_k^T)$$

### Step 2: Differentiate with Respect to $K_k$
Applying our matrix calculus identities:
- Term 1: $\operatorname{tr}(P_{k|k-1})$ does not depend on $K_k$:
  $$\frac{\partial \operatorname{tr}(P_{k|k-1})}{\partial K_k} = 0$$
- Term 2: Linear in $K_k$:
  $$\frac{\partial}{\partial K_k} \left[ -2 \operatorname{tr}(K_k H_k P_{k|k-1}) \right] = -2 (H_k P_{k|k-1})^T = -2 P_{k|k-1} H_k^T$$
  (since $P_{k|k-1}$ is symmetric: $P_{k|k-1}^T = P_{k|k-1}$).
- Term 3: Quadratic in $K_k$ with symmetric kernel $S_k$:
  $$\frac{\partial \operatorname{tr}(K_k S_k K_k^T)}{\partial K_k} = 2 K_k S_k$$

Combining the gradients:
$$\frac{\partial J(K_k)}{\partial K_k} = -2 P_{k|k-1} H_k^T + 2 K_k S_k$$

### Step 3: Set Gradient to Zero and Solve
Setting the gradient equal to the zero matrix $0_{n \times m}$:
$$-2 P_{k|k-1} H_k^T + 2 K_k S_k = 0_{n \times m}$$
$$K_k S_k = P_{k|k-1} H_k^T$$

Since $R_k \in \mathbb{S}_{++}^m$ and $H_k P_{k|k-1} H_k^T \in \mathbb{S}_+^m$, the innovation covariance $S_k$ is strictly positive-definite ($\lambda_i(S_k) > 0$), which guarantees that $S_k$ is non-singular and invertible. Post-multiplying both sides by $S_k^{-1}$:

$$\mathbf{K_k^* = P_{k|k-1} H_k^T S_k^{-1} = P_{k|k-1} H_k^T (H_k P_{k|k-1} H_k^T + R_k)^{-1}}$$

$\blacksquare$

---

## 6.6 Second-Order Sufficiency Condition (Global Minimality)

To confirm that $K_k^*$ achieves a strict global minimum (rather than a saddle point or maximum), we compute the second variation of $J(K)$.

Let $\Delta K \in \mathbb{R}^{n \times m}$ be an arbitrary perturbation matrix. Consider the scalar cost of $K + \Delta K$:
$$J(K + \Delta K) = \operatorname{tr}\left( (K + \Delta K) S (K + \Delta K)^T - 2 (K + \Delta K) H P + P \right)$$
$$= J(K) + \operatorname{tr}\left( \Delta K S K^T + K S \Delta K^T - 2 \Delta K H P \right) + \operatorname{tr}(\Delta K S \Delta K^T)$$

At $K = K^*$, $K^* S = P H^T$, so the first-order linear perturbation term vanishes:
$$\operatorname{tr}\left( 2 \Delta K (S K^{*T} - H P) \right) = 0$$

Thus:
$$J(K^* + \Delta K) - J(K^*) = \operatorname{tr}(\Delta K \, S_k \, \Delta K^T)$$

Let the rows of $\Delta K$ be $\delta k_1^T, \dots, \delta k_n^T$. Then:
$$\operatorname{tr}(\Delta K S_k \Delta K^T) = \sum_{i=1}^n \delta k_i^T S_k \delta k_i$$

Since $S_k \in \mathbb{S}_{++}^m$ is strictly positive-definite:
$$\delta k_i^T S_k \delta k_i > 0 \quad \forall \, \delta k_i \neq 0$$

Therefore:
$$J(K^* + \Delta K) > J(K^*) \quad \forall \, \Delta K \neq 0$$

The cost function $J(K)$ is strictly convex in $K_k$, and $K_k^*$ is the **unique global minimum**. $\blacksquare$

---

## 6.7 The Orthogonality Principle

The geometric cornerstone of optimal estimation in Hilbert spaces is the **Orthogonality Principle**:

> **Theorem (The Orthogonality Principle):** An estimator $\hat{x}_{k|k}$ minimizes the mean squared error if and only if the estimation error $\tilde{x}_{k|k} = x_k - \hat{x}_{k|k}$ is statistically orthogonal to all past and present measurements $z_1, \dots, z_k$, and equivalently, orthogonal to the innovation $y_k$:
> $$\mathbb{E}[\tilde{x}_{k|k} y_k^T] = 0_{n \times m}$$

### Proof:
Substitute $\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$ and $y_k = H_k \tilde{x}_{k|k-1} + v_k$:
$$\mathbb{E}[\tilde{x}_{k|k} y_k^T] = \mathbb{E}\left[ \left( (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k \right) \left( H_k \tilde{x}_{k|k-1} + v_k \right)^T \right]$$

Since $\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$:
$$\mathbb{E}[\tilde{x}_{k|k} y_k^T] = (I - K_k H_k) \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] H_k^T - K_k \mathbb{E}[v_k v_k^T]$$
$$= (I - K_k H_k) P_{k|k-1} H_k^T - K_k R_k = P_{k|k-1} H_k^T - K_k (H_k P_{k|k-1} H_k^T + R_k)$$
$$= P_{k|k-1} H_k^T - K_k S_k$$

Setting $\mathbb{E}[\tilde{x}_{k|k} y_k^T] = 0$ yields:
$$K_k S_k = P_{k|k-1} H_k^T \implies K_k = P_{k|k-1} H_k^T S_k^{-1}$$

The Orthogonality Principle directly produces the optimal Kalman gain. Geometrically, the optimal estimate $\hat{x}_{k|k}$ is the orthogonal projection of the true state $x_k$ onto the linear subspace spanned by the observations.

---

## 6.8 Whiteness of the Innovation Sequence

A critical diagnostic property of an optimal Kalman Filter is that the innovation sequence $\{y_1, y_2, \dots, y_k\}$ must be **white noise**:

$$\mathbb{E}[y_j y_k^T] = S_k \delta_{jk} = \begin{cases} S_k & \text{if } j = k \\ 0 & \text{if } j \neq k \end{cases}$$

### Proof:
Without loss of generality, assume $j < k$.
The innovation at step $k$ is:
$$y_k = z_k - H_k \hat{x}_{k|k-1} = H_k (x_k - \hat{x}_{k|k-1}) + v_k = H_k \tilde{x}_{k|k-1} + v_k$$

The prior error propagates as:
$$\tilde{x}_{k|k-1} = F_k \tilde{x}_{k-1|k-1} + w_k = F_k ((I - K_{k-1} H_{k-1}) \tilde{x}_{k-1|k-2} - K_{k-1} v_{k-1}) + w_k$$

By induction, $\tilde{x}_{k|k-1}$ is a linear combination of errors orthogonal to all measurements up to step $k-1$.
Since $j \le k-1$, the measurement $z_j$ and innovation $y_j$ are fully contained in the information set $Z_{1:k-1}$.
By the law of total expectation:
$$\mathbb{E}[y_k y_j^T] = \mathbb{E}\left[ \mathbb{E}[y_k | Z_{1:k-1}] y_j^T \right]$$

Evaluating the conditional expectation:
$$\mathbb{E}[y_k | Z_{1:k-1}] = \mathbb{E}[z_k - H_k \hat{x}_{k|k-1} | Z_{1:k-1}] = H_k \hat{x}_{k|k-1} - H_k \hat{x}_{k|k-1} = 0$$

Therefore:
$$\mathbb{E}[y_k y_j^T] = 0 \quad \forall \, j < k$$

If the innovations from an operational Kalman filter exhibit autocorrelation ($\mathbb{E}[y_k y_{k-1}^T] \neq 0$), the filter is sub-optimal: the dynamic model or sensor noise parameters $(Q, R)$ are misspecified.

---

## 6.9 Mathematical Problem Set

### Problem 6.1 (Worked Example): Trace Calculus Derivative Step-by-Step
**Problem Statement:** Let $f(K) = \operatorname{tr}(K S K^T - 2 K M)$ where $S \in \mathbb{S}_{++}^2$ and $M \in \mathbb{R}^{2 \times 2}$.
$$S = \begin{bmatrix} 5 & 1 \\ 1 & 2 \end{bmatrix}, \quad M = \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix}$$
1. Compute the analytical gradient $\nabla_K f(K) \in \mathbb{R}^{2 \times 2}$.
2. Solve for the stationary point $K^*$.
3. Evaluate $f(K^*)$ and verify that it is smaller than $f(0)$.

**Step-by-Step Derivation:**
1. Analytical gradient:
   $$\nabla_K f(K) = 2 K S - 2 M^T$$
2. Setting gradient to zero:
   $$2 K S - 2 M^T = 0 \implies K S = M^T \implies K^* = M^T S^{-1}$$
3. Numerical inversion of $S$:
   $$\det(S) = (5)(2) - (1)(1) = 10 - 1 = 9$$
   $$S^{-1} = \frac{1}{9} \begin{bmatrix} 2 & -1 \\ -1 & 5 \end{bmatrix}$$
   $$M^T = \begin{bmatrix} 3 & 1 \\ 4 & 2 \end{bmatrix}$$
   $$K^* = \begin{bmatrix} 3 & 1 \\ 4 & 2 \end{bmatrix} \left( \frac{1}{9} \begin{bmatrix} 2 & -1 \\ -1 & 5 \end{bmatrix} \right) = \frac{1}{9} \begin{bmatrix} 6 - 1 & -3 + 5 \\ 8 - 2 & -4 + 10 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 5 & 2 \\ 6 & 6 \end{bmatrix} \approx \begin{bmatrix} 0.5556 & 0.2222 \\ 0.6667 & 0.6667 \end{bmatrix}$$
4. Cost at $K = 0$:
   $$f(0) = \operatorname{tr}(0) = 0$$
5. Cost at $K^*$:
   $$f(K^*) = \operatorname{tr}(K^* S K^{*T} - 2 K^* M) = \operatorname{tr}(M^T S^{-1} S S^{-1} M - 2 M^T S^{-1} M) = -\operatorname{tr}(M^T S^{-1} M)$$
   $$M^T S^{-1} M = K^* M = \frac{1}{9} \begin{bmatrix} 5 & 2 \\ 6 & 6 \end{bmatrix} \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 15 + 2 & 20 + 4 \\ 18 + 6 & 24 + 12 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 17 & 24 \\ 24 & 36 \end{bmatrix}$$
   $$f(K^*) = -\frac{1}{9} \operatorname{tr}\left( \begin{bmatrix} 17 & 24 \\ 24 & 36 \end{bmatrix} \right) = -\frac{17 + 36}{9} = -\frac{53}{9} \approx -5.8889 < 0$$

**Final Result:**
$$K^* = \frac{1}{9}\begin{bmatrix} 5 & 2 \\ 6 & 6 \end{bmatrix}, \quad f(K^*) = -\frac{53}{9} \approx -5.889 < f(0) = 0$$

---

### Problem 6.2 (Worked Example): Invariance to State Linear Transformation
**Problem Statement:** Let a linear change of state coordinates be defined by $x' = T x$, where $T \in \mathbb{R}^{n \times n}$ is invertible. Prove that the Kalman filter is coordinate-invariant: the state estimate in transformed coordinates satisfies $\hat{x}' = T \hat{x}$ and covariance satisfies $P' = T P T^T$.

**Step-by-Step Derivation:**
1. Transformed system matrices:
   $$x'_k = T x_k = T (F x_{k-1} + w_k) = (T F T^{-1}) x'_{k-1} + T w_k \implies F' = T F T^{-1}, \quad Q' = T Q T^T$$
   $$z_k = H x_k + v_k = (H T^{-1}) x'_k + v_k \implies H' = H T^{-1}, \quad R' = R$$
2. Prior covariance transformation:
   $$P_{k|k-1}' = F' P_{k-1|k-1}' F'^T + Q' = (T F T^{-1}) (T P_{k-1|k-1} T^T) (T^{-T} F^T T^T) + T Q T^T$$
   $$= T (F P_{k-1|k-1} F^T + Q) T^T = T P_{k|k-1} T^T$$
3. Innovation covariance invariance:
   $$S' = H' P' H'^T + R' = (H T^{-1}) (T P T^T) (T^{-T} H^T) + R = H P H^T + R = S$$
   The innovation covariance $S$ is strictly identical!
4. Transformed Kalman gain:
   $$K' = P' H'^T S'^{-1} = (T P T^T) (T^{-T} H^T) S^{-1} = T (P H^T S^{-1}) = T K$$
5. State update:
   $$\hat{x}'_{k|k} = \hat{x}'_{k|k-1} + K' y_k = T \hat{x}_{k|k-1} + T K y_k = T (\hat{x}_{k|k-1} + K y_k) = T \hat{x}_{k|k}$$
6. Posterior covariance:
   $$P'_{k|k} = (I - K' H') P'_{k|k-1} = (I - T K H T^{-1}) (T P_{k|k-1} T^T) = T (I - K H) P_{k|k-1} T^T = T P_{k|k} T^T \quad \blacksquare$$

---

### Problem 6.3 (Worked Example): Innovation Autocorrelation Test
**Problem Statement:** A Kalman filter produces a scalar innovation sequence $y_k$ with empirical lag-1 sample autocorrelation $\hat{\rho}_1 = \frac{\sum_{k=1}^N y_k y_{k-1}}{\sum_{k=1}^N y_k^2}$. For $N = 1000$, $\hat{\rho}_1 = 0.12$. Using the $95\%$ confidence bound for white noise ($|\hat{\rho}_1| \le \frac{1.96}{\sqrt{N}}$), test whether the filter is optimal.

**Step-by-Step Derivation:**
1. Under the null hypothesis $H_0$ that the innovations are independent and identically distributed white noise:
   $$\hat{\rho}_1 \sim \mathcal{N}\left(0, \frac{1}{N}\right)$$
2. Two-tailed $95\%$ confidence bounds ($\alpha = 0.05$):
   $$\text{Threshold} = \pm \frac{1.96}{\sqrt{N}} = \pm \frac{1.96}{\sqrt{1000}} \approx \pm \frac{1.96}{31.6228} \approx \pm 0.0620$$
3. Test comparison:
   $$|\hat{\rho}_1| = 0.12 > 0.0620$$
4. Conclusion:
   The empirical autocorrelation of $0.12$ exceeds the $95\%$ critical threshold. $H_0$ is rejected with $p < 0.001$.
   The filter is demonstrably sub-optimal. The lag-1 positive correlation indicates the filter is sluggish (underestimating process noise $Q$ or overestimating measurement noise $R$).

**Final Result:**
$$\text{Threshold} = \pm 0.0620, \quad |\hat{\rho}_1| = 0.12 > 0.0620 \implies \mathbf{Sub\text{-}Optimal\ (Reject\ H_0)}$$

---

### Problem 6.4 (Worked Example): Weighted Trace Minimization Invariance
**Problem Statement:** Suppose instead of minimizing the unweighted trace $\operatorname{tr}(P)$, an engineer chooses to minimize a weighted sum of estimation variances $J_W(K) = \operatorname{tr}(W P)$ for any arbitrary symmetric positive-definite weight matrix $W \in \mathbb{S}_{++}^n$. Prove that the resulting optimal Kalman gain $K_W^*$ is completely independent of $W$ and identical to the standard Kalman gain $K^*$.

**Step-by-Step Derivation:**
1. Weighted objective function:
   $$J_W(K) = \operatorname{tr}(W P) = \operatorname{tr}\left( W \left[ (I - K H) P^- (I - K H)^T + K R K^T \right] \right)$$
2. Expanding:
   $$J_W(K) = \operatorname{tr}(W P^-) - 2 \operatorname{tr}(W K H P^-) + \operatorname{tr}(W K S K^T)$$
3. Differentiating with respect to $K$:
   $$\frac{\partial}{\partial K} \left[ -2 \operatorname{tr}(W K H P^-) \right] = -2 W^T (H P^-)^T = -2 W P^- H^T$$
   $$\frac{\partial}{\partial K} \left[ \operatorname{tr}(W K S K^T) \right] = 2 W K S$$
   Combining:
   $$\frac{\partial J_W(K)}{\partial K} = -2 W P^- H^T + 2 W K S = 0$$
4. Pre-multiplying by $W^{-1}$ (which exists because $W \in \mathbb{S}_{++}^n$):
   $$-P^- H^T + K S = 0 \implies K S = P^- H^T \implies K_W^* = P^- H^T S^{-1} = K^*$$
5. Thus, the optimal Kalman gain minimizes *every* quadratic error metric simultaneously, independent of the weighting matrix $W$. $\blacksquare$

---

### Problem 6.5 (Worked Example): Scalar LUMVE vs Ordinary Least Squares
**Problem Statement:** A constant parameter $\theta$ is observed by two sensors: $z_1 = \theta + v_1, z_2 = \theta + v_2$, where $\mathbb{E}[v_1] = \mathbb{E}[v_2] = 0$, $\operatorname{Var}(v_1) = \sigma_1^2 = 1.0$, and $\operatorname{Var}(v_2) = \sigma_2^2 = 9.0$.
Compare the estimation variance of:
1. Ordinary Least Squares (sample mean: $\hat{\theta}_{\text{OLS}} = \frac{1}{2}(z_1 + z_2)$).
2. The optimal LUMVE estimate $\hat{\theta}_{\text{LUMVE}} = w_1 z_1 + w_2 z_2$.

**Step-by-Step Derivation:**
1. Ordinary Least Squares variance:
   $$\operatorname{Var}(\hat{\theta}_{\text{OLS}}) = \operatorname{Var}\left(\frac{1}{2} z_1 + \frac{1}{2} z_2\right) = \frac{1}{4} \sigma_1^2 + \frac{1}{4} \sigma_2^2 = \frac{1.0 + 9.0}{4} = \frac{10.0}{4} = 2.50$$
   *Shocking Result:* Notice that $\operatorname{Var}(\hat{\theta}_{\text{OLS}}) = 2.50 > \sigma_1^2 = 1.0$. Naively averaging the high-precision sensor with the noisy sensor produces an estimate that is $2.5\times$ *worse* than discarding sensor 2 altogether!
2. LUMVE optimization:
   Constraint: $w_1 + w_2 = 1 \implies w_2 = 1 - w_1$.
   $$\operatorname{Var}(\hat{\theta}) = w_1^2 \sigma_1^2 + (1 - w_1)^2 \sigma_2^2 = w_1^2 (1) + (1 - 2 w_1 + w_1^2) (9) = 10 w_1^2 - 18 w_1 + 9$$
   Differentiating:
   $$20 w_1 - 18 = 0 \implies w_1^* = \frac{18}{20} = 0.90, \quad w_2^* = 0.10$$
   $$\operatorname{Var}(\hat{\theta}_{\text{LUMVE}}) = (0.9)^2 (1) + (0.1)^2 (9) = 0.81 + 0.09 = 0.90$$
3. Comparison:
   $$\operatorname{Var}(\hat{\theta}_{\text{LUMVE}}) = 0.90 < \sigma_1^2 = 1.00 < \operatorname{Var}(\hat{\theta}_{\text{OLS}}) = 2.50$$

**Final Result:**
$$\operatorname{Var}(\hat{\theta}_{\text{OLS}}) = 2.50, \quad \operatorname{Var}(\hat{\theta}_{\text{LUMVE}}) = 0.90 \quad (\text{LUMVE reduces variance by }64\%)$$

---

### Problem 6.6 (Worked Example): Innovation Sequence Zero-Mean Property
**Problem Statement:** Prove that for any linear system with zero-mean noise, the innovation sequence satisfies $\mathbb{E}[y_k] = 0$ for all $k \ge 1$, and that the cumulative sum $C_N = \sum_{k=1}^N y_k$ is a martingale.

**Step-by-Step Derivation:**
1. True measurement and predicted measurement:
   $$z_k = H_k x_k + v_k$$
   $$\hat{z}_{k|k-1} = H_k \hat{x}_{k|k-1}$$
   $$y_k = z_k - \hat{z}_{k|k-1} = H_k (x_k - \hat{x}_{k|k-1}) + v_k = H_k \tilde{x}_{k|k-1} + v_k$$
2. Expectation:
   $$\mathbb{E}[y_k] = H_k \mathbb{E}[\tilde{x}_{k|k-1}] + \mathbb{E}[v_k] = H_k (0) + 0 = 0$$
3. Martingale property:
   Consider the cumulative sum $C_N = \sum_{k=1}^N y_k$.
   Condition on information up to step $N-1$:
   $$\mathbb{E}[C_N | Z_{1:N-1}] = \mathbb{E}[C_{N-1} + y_N | Z_{1:N-1}] = C_{N-1} + \mathbb{E}[y_N | Z_{1:N-1}]$$
   As proved in Section 6.8, $\mathbb{E}[y_N | Z_{1:N-1}] = 0$.
   Therefore:
   $$\mathbb{E}[C_N | Z_{1:N-1}] = C_{N-1}$$
   This satisfies the definition of a discrete-time martingale. $\blacksquare$

---

### Problem 6.7 (Worked Example): Gain Sensitivity to Covariance Mismatch
**Problem Statement:** A 1D system has true measurement noise $r_{\text{true}} = 1.0$. An engineer incorrectly configures the filter with $r_{\text{filter}} = 4.0$. If prior variance is $p = 4.0$ and $h = 1$:
1. Compute the filter gain $K_{\text{sub}}$ and true resulting posterior variance $p_{\text{true}}$.
2. Compare with the optimal posterior variance $p^*$ achieved if $r_{\text{true}}$ were known.

**Step-by-Step Derivation:**
1. Gain computed by filter:
   $$K_{\text{sub}} = \frac{p}{p + r_{\text{filter}}} = \frac{4.0}{4.0 + 4.0} = \frac{4.0}{8.0} = 0.50$$
2. True posterior variance (using Joseph form with $r_{\text{true}} = 1.0$):
   $$p_{\text{true}} = (1 - K_{\text{sub}})^2 p + K_{\text{sub}}^2 r_{\text{true}} = (1 - 0.5)^2 (4.0) + (0.5)^2 (1.0) = (0.25)(4.0) + (0.25)(1.0) = 1.0 + 0.25 = 1.25$$
3. Optimal gain and variance if correctly tuned:
   $$K^* = \frac{p}{p + r_{\text{true}}} = \frac{4.0}{4.0 + 1.0} = 0.80$$
   $$p^* = (1 - K^*) p = (1 - 0.8)(4.0) = 0.2 \times 4.0 = 0.80$$
4. Degradation:
   $$\text{Excess Variance} = p_{\text{true}} - p^* = 1.25 - 0.80 = 0.45 \quad (+56.25\%)$$

**Final Result:**
$$K_{\text{sub}} = 0.50, \quad p_{\text{true}} = 1.25, \quad p^* = 0.80 \quad (\text{Variance degraded by }56.25\%)$$

---

### Problem 6.8 (Worked Example): Orthogonality of Prior Error and Innovation
**Problem Statement:** Prove that the prior state error $\tilde{x}_{k|k-1}$ and the measurement innovation $y_k$ are not orthogonal, but satisfy $\mathbb{E}[\tilde{x}_{k|k-1} y_k^T] = P_{k|k-1} H_k^T$.

**Step-by-Step Derivation:**
1. Express innovation:
   $$y_k = H_k \tilde{x}_{k|k-1} + v_k$$
2. Multiply by prior error and take expectation:
   $$\mathbb{E}[\tilde{x}_{k|k-1} y_k^T] = \mathbb{E}[\tilde{x}_{k|k-1} (H_k \tilde{x}_{k|k-1} + v_k)^T] = \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] H_k^T + \mathbb{E}[\tilde{x}_{k|k-1} v_k^T]$$
3. Since $v_k$ is independent of past and current prior error:
   $$\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$$
4. Therefore:
   $$\mathbb{E}[\tilde{x}_{k|k-1} y_k^T] = P_{k|k-1} H_k^T \neq 0 \quad \blacksquare$$

---

### Problem 6.9 (Worked Example): Derivation of Kalman Gain via Bayesian Gaussian Conditioning
**Problem Statement:** Derive the multivariable Kalman Gain $K_k$ directly from the conditioning formulas of a joint Gaussian distribution without taking any matrix derivatives.

**Step-by-Step Derivation:**
1. The state $x_k$ and observation $z_k$ conditioned on $Z_{1:k-1}$ are jointly Gaussian:
   $$\begin{bmatrix} x_k \\ z_k \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} \hat{x}_{k|k-1} \\ H_k \hat{x}_{k|k-1} \end{bmatrix}, \begin{bmatrix} \Sigma_{xx} & \Sigma_{xz} \\ \Sigma_{zx} & \Sigma_{zz} \end{bmatrix} \right)$$
2. Covariances:
   $$\Sigma_{xx} = \operatorname{Cov}(x_k) = P_{k|k-1}$$
   $$\Sigma_{xz} = \operatorname{Cov}(x_k, z_k) = \mathbb{E}[\tilde{x}_{k|k-1} (H_k \tilde{x}_{k|k-1} + v_k)^T] = P_{k|k-1} H_k^T$$
   $$\Sigma_{zz} = \operatorname{Cov}(z_k) = H_k P_{k|k-1} H_k^T + R_k = S_k$$
3. By the Schur complement Gaussian conditioning theorem (derived in Chapter 1):
   $$p(x_k | z_k) = \mathcal{N}(\mu_{x|z}, \Sigma_{x|z})$$
   $$\mu_{x|z} = \mu_x + \Sigma_{xz} \Sigma_{zz}^{-1} (z_k - \mu_z) = \hat{x}_{k|k-1} + (P_{k|k-1} H_k^T S_k^{-1}) (z_k - H_k \hat{x}_{k|k-1})$$
   $$\Sigma_{x|z} = \Sigma_{xx} - \Sigma_{xz} \Sigma_{zz}^{-1} \Sigma_{zx} = P_{k|k-1} - (P_{k|k-1} H_k^T S_k^{-1}) H_k P_{k|k-1}$$
4. Identifying terms:
   $$K_k = \Sigma_{xz} \Sigma_{zz}^{-1} = P_{k|k-1} H_k^T S_k^{-1}$$
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k$$
   $$P_{k|k} = (I - K_k H_k) P_{k|k-1}$$
   The Kalman gain emerges purely as the linear regression coefficient of joint Gaussian conditioning. $\blacksquare$

---

### Problem 6.10 (Worked Example): Rank-1 Kalman Gain Update
**Problem Statement:** For a scalar measurement ($m = 1$), $H = h^T \in \mathbb{R}^{1 \times n}$ and $R = r > 0$. Show that the Kalman gain is a vector $k \in \mathbb{R}^n$, and write the posterior covariance update in outer-product form.

**Step-by-Step Derivation:**
1. Innovation variance:
   $$s = h^T P^- h + r \quad (\text{a scalar})$$
2. Kalman gain vector:
   $$k = \frac{1}{s} P^- h = \frac{P^- h}{h^T P^- h + r} \in \mathbb{R}^n$$
3. Covariance update:
   $$P^+ = P^- - k s k^T = P^- - s \left(\frac{P^- h}{s}\right) \left(\frac{P^- h}{s}\right)^T = P^- - \frac{1}{s} (P^- h)(P^- h)^T$$
4. Let $v = P^- h \in \mathbb{R}^n$. Then:
   $$P^+ = P^- - \frac{1}{s} v v^T$$
   The covariance update is a symmetric rank-1 downdate, which can be computed in $\mathcal{O}(n^2)$ operations without any matrix inversions.

**Final Result:**
$$P^+ = P^- - \frac{(P^- h)(P^- h)^T}{h^T P^- h + r}$$

---

### Problem 6.11 (Solved Exercise): Trace Derivative of Symmetric Form
**Problem Statement:** For symmetric $A = A^T$, verify that $\frac{\partial \operatorname{tr}(X A X^T)}{\partial X} = 2 X A$ by expanding the component-wise derivatives for $2 \times 2$ matrices.

**Step-by-Step Solution:**
1. Let $X = \begin{bmatrix} x_{11} & x_{12} \\ x_{21} & x_{22} \end{bmatrix}, A = \begin{bmatrix} a & b \\ b & c \end{bmatrix}$.
2. Compute $X A$:
   $$X A = \begin{bmatrix} a x_{11} + b x_{12} & b x_{11} + c x_{12} \\ a x_{21} + b x_{22} & b x_{21} + c x_{22} \end{bmatrix}$$
3. Diagonal elements of $(X A) X^T$:
   $$[(X A) X^T]_{11} = (a x_{11} + b x_{12}) x_{11} + (b x_{11} + c x_{12}) x_{12} = a x_{11}^2 + 2 b x_{11} x_{12} + c x_{12}^2$$
   $$[(X A) X^T]_{22} = a x_{21}^2 + 2 b x_{21} x_{22} + c x_{22}^2$$
4. Trace:
   $$\operatorname{tr}(X A X^T) = a x_{11}^2 + 2 b x_{11} x_{12} + c x_{12}^2 + a x_{21}^2 + 2 b x_{21} x_{22} + c x_{22}^2$$
5. Partial derivatives:
   $$\frac{\partial \text{tr}}{\partial x_{11}} = 2 a x_{11} + 2 b x_{12} = 2 [X A]_{11}$$
   $$\frac{\partial \text{tr}}{\partial x_{12}} = 2 b x_{11} + 2 c x_{12} = 2 [X A]_{12}$$
   $$\frac{\partial \text{tr}}{\partial x_{21}} = 2 [X A]_{21}, \quad \frac{\partial \text{tr}}{\partial x_{22}} = 2 [X A]_{22}$$
6. Assembling into matrix form: $\frac{\partial \operatorname{tr}(X A X^T)}{\partial X} = 2 X A$. $\blacksquare$

---

### Problem 6.12 (Solved Exercise): Non-Symmetric Kernel Trace Derivative
**Problem Statement:** If $B$ is not symmetric, prove that $\frac{\partial \operatorname{tr}(X B X^T)}{\partial X} = X(B + B^T)$.

**Step-by-Step Solution:**
1. Decompose $B$ into symmetric and skew-symmetric parts:
   $$B = B_{\text{sym}} + B_{\text{skew}}, \quad B_{\text{sym}} = \frac{1}{2}(B + B^T), \quad B_{\text{skew}} = \frac{1}{2}(B - B^T)$$
2. For any skew-symmetric matrix $M$, $\operatorname{tr}(X M X^T) = 0$ because $X M X^T$ is skew-symmetric.
3. Therefore:
   $$\operatorname{tr}(X B X^T) = \operatorname{tr}(X B_{\text{sym}} X^T)$$
4. Applying the symmetric identity:
   $$\frac{\partial \operatorname{tr}(X B_{\text{sym}} X^T)}{\partial X} = 2 X B_{\text{sym}} = 2 X \left(\frac{B + B^T}{2}\right) = X(B + B^T) \quad \blacksquare$$

---

### Problem 6.13 (Solved Exercise): Correlation between Prior and Posterior Errors
**Problem Statement:** Show that the cross-covariance between prior error $\tilde{x}_{k|k-1}$ and posterior error $\tilde{x}_{k|k}$ equals the posterior covariance: $\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k-1}^T] = P_{k|k}$.

**Step-by-Step Solution:**
1. Express posterior error:
   $$\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$$
2. Post-multiply by $\tilde{x}_{k|k-1}^T$ and take expectation:
   $$\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k-1}^T] = (I - K_k H_k) \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] - K_k \mathbb{E}[v_k \tilde{x}_{k|k-1}^T]$$
3. Since $\mathbb{E}[v_k \tilde{x}_{k|k-1}^T] = 0$:
   $$\mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k-1}^T] = (I - K_k H_k) P_{k|k-1} = P_{k|k} \quad \blacksquare$$

---

### Problem 6.14 (Solved Exercise): Innovation Covariance Determinant and Entropy
**Problem Statement:** Show that the conditional differential entropy of the measurement $h(z_k | Z_{1:k-1})$ is given by $\frac{1}{2} \ln((2\pi e)^m \det(S_k))$.

**Step-by-Step Solution:**
1. The measurement conditioned on past data is Gaussian:
   $$z_k | Z_{1:k-1} \sim \mathcal{N}(H_k \hat{x}_{k|k-1}, S_k)$$
2. The differential entropy of an $m$-dimensional Gaussian random vector with covariance $S$ is:
   $$h(X) = \frac{1}{2} \ln\left((2\pi e)^m \det(S)\right)$$
3. Substituting $S = S_k$ directly yields the result.
   As measurements are assimilated, $\det(S_k)$ decreases towards steady-state, reflecting reduced surprise. $\blacksquare$

---

### Problem 6.15 (Solved Exercise): Gain Behavior with Correlated Process and Measurement Noise
**Problem Statement:** If process noise and measurement noise are correlated such that $\mathbb{E}[w_k v_k^T] = M_k \neq 0$, derive the modified optimal Kalman gain.

**Step-by-Step Solution:**
1. The prior error is $\tilde{x}_{k|k-1} = F \tilde{x}_{k-1|k-1} + w_k$.
   The cross-correlation between prior error and measurement noise is:
   $$\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = \mathbb{E}[w_k v_k^T] = M_k$$
2. Posterior error: $\tilde{x}_{k|k} = (I - K H) \tilde{x}_{k|k-1} - K v_k$.
3. Expand $P_{k|k} = \mathbb{E}[\tilde{x}_{k|k} \tilde{x}_{k|k}^T]$ retaining cross-terms:
   $$P_{k|k} = (I - K H) P^- (I - K H)^T + K R K^T - (I - K H) M_k K^T - K M_k^T (I - K H)^T$$
4. Differentiating with respect to $K$ and setting to zero:
   $$-2 (I - K H) P^- H^T + 2 K R - 2 (I - K H) M_k + 2 K H M_k = 0$$
   Solving for $K$:
   $$K (H P^- H^T + R + H M_k + M_k^T H^T) = P^- H^T + M_k$$

**Final Answer:**
$$K_k^* = (P_{k|k-1} H_k^T + M_k) (H_k P_{k|k-1} H_k^T + R_k + H_k M_k + M_k^T H_k^T)^{-1}$$

---

### Problem 6.16 (Solved Exercise): Linear Regression Equivalence
**Problem Statement:** For a static state $x$ with $z_i = x + v_i$ ($i = 1, \dots, N$) and independent $v_i \sim \mathcal{N}(0, \sigma^2)$, show that the batch maximum likelihood estimate $\hat{x}_{\text{ML}} = \frac{1}{N} \sum z_i$ is identical to the Kalman filter estimate with diffuse prior $P_0 \to \infty$.

**Step-by-Step Solution:**
1. In information form (Problem 5.14):
   $$P_N^{-1} = P_0^{-1} + N \frac{1}{\sigma^2}$$
   As $P_0 \to \infty$, $P_0^{-1} \to 0$, so $P_N = \frac{\sigma^2}{N}$.
2. Information state vector:
   $$\hat{y}_N = P_0^{-1} \hat{x}_0 + \sum_{i=1}^N \frac{z_i}{\sigma^2} = \frac{1}{\sigma^2} \sum_{i=1}^N z_i$$
3. State estimate:
   $$\hat{x}_N = P_N \hat{y}_N = \left(\frac{\sigma^2}{N}\right) \left(\frac{1}{\sigma^2} \sum_{i=1}^N z_i\right) = \frac{1}{N} \sum_{i=1}^N z_i = \hat{x}_{\text{ML}} \quad \blacksquare$$

---

### Problem 6.17 (Solved Exercise): Verification of Orthogonality in Problem 5.1
**Problem Statement:** Using the numerical values from Problem 5.1 ($\hat{x}_{k|k} = [12.64, 2.24]^T, K = [0.8, 0.3]^T, S = 2.5$), verify numerically that $\mathbb{E}[\tilde{x}_{k|k} y_k] = 0$.

**Step-by-Step Solution:**
1. From Section 6.7:
   $$\mathbb{E}[\tilde{x}_{k|k} y_k] = P^- H^T - K S$$
2. From Problem 5.1:
   $$P^- H^T = \begin{bmatrix} 2.0 \\ 0.75 \end{bmatrix}, \quad K = \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix}, \quad S = 2.5$$
3. Multiply $K S$:
   $$K S = \begin{bmatrix} 0.80 \\ 0.30 \end{bmatrix} \times 2.5 = \begin{bmatrix} 2.00 \\ 0.75 \end{bmatrix}$$
4. Subtract:
   $$\mathbb{E}[\tilde{x}_{k|k} y_k] = \begin{bmatrix} 2.00 \\ 0.75 \end{bmatrix} - \begin{bmatrix} 2.00 \\ 0.75 \end{bmatrix} = \begin{bmatrix} 0.00 \\ 0.00 \end{bmatrix}$$
   The orthogonality condition holds exactly. $\blacksquare$

---

### Problem 6.18 (Solved Exercise): Whiteness of Second Lag Innovations
**Problem Statement:** Prove algebraically that $\mathbb{E}[y_k y_{k-2}^T] = 0$.

**Step-by-Step Solution:**
1. The measurement update at step $k-2$ produces posterior error $\tilde{x}_{k-2|k-2}$, which is orthogonal to $y_{k-2}$ by the Orthogonality Principle: $\mathbb{E}[\tilde{x}_{k-2|k-2} y_{k-2}^T] = 0$.
2. State error propagates through two steps of dynamics:
   $$\tilde{x}_{k|k-1} = F_k F_{k-1} \tilde{x}_{k-2|k-2} + F_k w_{k-1} + w_k$$
3. The innovation at step $k$ is $y_k = H_k \tilde{x}_{k|k-1} + v_k$.
4. Taking expectation $\mathbb{E}[y_k y_{k-2}^T]$:
   $$\mathbb{E}[y_k y_{k-2}^T] = H_k F_k F_{k-1} \mathbb{E}[\tilde{x}_{k-2|k-2} y_{k-2}^T] + H_k F_k \mathbb{E}[w_{k-1} y_{k-2}^T] + H_k \mathbb{E}[w_k y_{k-2}^T] + \mathbb{E}[v_k y_{k-2}^T]$$
5. All four terms are strictly zero:
   - Term 1 is zero by orthogonality at step $k-2$.
   - Terms 2, 3, and 4 are zero because future process and measurement noise are independent of past innovations.
6. Thus $\mathbb{E}[y_k y_{k-2}^T] = 0$. $\blacksquare$

---

### Problem 6.19 (Solved Exercise): Determinant of Updated Covariance Matrix
**Problem Statement:** Prove that $\det(P_{k|k}) = \det(P_{k|k-1}) \frac{\det(R_k)}{\det(S_k)}$.

**Step-by-Step Solution:**
1. Using the matrix determinant lemma and Schur complements on the block matrix:
   $$\mathcal{M} = \begin{bmatrix} P_{k|k-1} & P_{k|k-1} H_k^T \\ H_k P_{k|k-1} & S_k \end{bmatrix}$$
2. The Schur complement of $S_k$ is:
   $$\mathcal{M} / S_k = P_{k|k-1} - P_{k|k-1} H_k^T S_k^{-1} H_k P_{k|k-1} = P_{k|k}$$
   Thus: $\det(\mathcal{M}) = \det(S_k) \det(P_{k|k})$.
3. The Schur complement of $P_{k|k-1}$ is:
   $$\mathcal{M} / P_{k|k-1} = S_k - H_k P_{k|k-1} P_{k|k-1}^{-1} P_{k|k-1} H_k^T = S_k - H_k P_{k|k-1} H_k^T = R_k$$
   Thus: $\det(\mathcal{M}) = \det(P_{k|k-1}) \det(R_k)$.
4. Equating the two determinant expressions:
   $$\det(S_k) \det(P_{k|k}) = \det(P_{k|k-1}) \det(R_k)$$
   $$\det(P_{k|k}) = \det(P_{k|k-1}) \frac{\det(R_k)}{\det(S_k)} \quad \blacksquare$$

---

### Problem 6.20 (Solved Exercise): Entropy Reduction under Optimal Measurement Update
**Problem Statement:** Using the determinant relation from Problem 6.19, compute the exact reduction in differential entropy $\Delta h = h(x_k | Z_{1:k-1}) - h(x_k | Z_{1:k})$.

**Step-by-Step Solution:**
1. For Gaussian state distributions:
   $$h(x_k | Z_{1:k-1}) = \frac{1}{2} \ln\left((2\pi e)^n \det(P_{k|k-1})\right)$$
   $$h(x_k | Z_{1:k}) = \frac{1}{2} \ln\left((2\pi e)^n \det(P_{k|k})\right)$$
2. Entropy difference:
   $$\Delta h = \frac{1}{2} \ln\left( \frac{\det(P_{k|k-1})}{\det(P_{k|k})} \right)$$
3. Substituting the determinant formula from Problem 6.19:
   $$\frac{\det(P_{k|k-1})}{\det(P_{k|k})} = \frac{\det(S_k)}{\det(R_k)}$$
4. Therefore:
   $$\Delta h = \frac{1}{2} \ln\left(\frac{\det(S_k)}{\det(R_k)}\right) = \frac{1}{2} \ln\det(I_m + R_k^{-1} H_k P_{k|k-1} H_k^T) \ge 0$$
   This equals the mutual information $I(x_k; z_k | Z_{1:k-1})$, proving that an optimal Kalman update always extracts non-negative information from sensors. $\blacksquare$


---

# Chapter 7: Observability, Controllability, and the Discrete Algebraic Riccati Equation (DARE)

## 7.1 Introduction: Long-Term Convergence and Structural Stability

A real-time robotics state estimator must run continuously for minutes, hours, or days without numerical divergence, runaway covariance growth, or catastrophic loss of tracking. Will the estimation covariance matrix $P_k$ remain bounded as $k \to \infty$? Does $P_k$ converge to a unique, stable steady-state matrix $P_\infty$, or does it depend perpetually on the initialization $P_0$?

The answers to these foundational questions lie in the structural properties of the dynamic system: **observability** and **controllability** (detectability and stabilizability). If a physical state (such as an IMU gyroscope bias or wheel slip) is mathematically unobservable from the sensor suite, its variance will accumulate unbounded growth driven by process noise. Conversely, if the system is observable and noise-controllable, the Kalman Filter behaves as an exponentially stable linear dynamical system whose steady-state covariance satisfies the **Discrete Algebraic Riccati Equation (DARE)**.

In this chapter, we develop the rigorous theory of observability and detectability, derive the Kalman rank and Popov-Belevitch-Hautus (PBH) tests, establish the existence and uniqueness theorems for the DARE, solve the algebraic Riccati equation in closed form for 2nd-order kinematic systems, and master numerical solvers across 20 comprehensive problems.

---

## 7.2 Observability and the Kalman Observability Matrix

A dynamic system is **observable** if the initial state $x_0$ can be uniquely determined from a finite sequence of noise-free observations $\{z_0, z_1, \dots, z_{N-1}\}$ and known control inputs $\{u_0, \dots, u_{N-2}\}$.

### 7.2.1 Algebraic Formulation
Consider the deterministic unforced discrete system:
$$x_k = F x_{k-1} = F^k x_0$$
$$z_k = H x_k = H F^k x_0$$

Stacking the observations from $k = 0$ to $k = n-1$ into a single vector $Z \in \mathbb{R}^{mn}$:
$$Z = \begin{bmatrix} z_0 \\ z_1 \\ z_2 \\ \vdots \\ z_{n-1} \end{bmatrix} = \begin{bmatrix} H \\ H F \\ H F^2 \\ \vdots \\ H F^{n-1} \end{bmatrix} x_0 = \mathcal{O} \, x_0$$

where $\mathcal{O} \in \mathbb{R}^{mn \times n}$ is the **Kalman Observability Matrix**:
$$\mathcal{O} = \begin{bmatrix} H \\ H F \\ H F^2 \\ \vdots \\ H F^{n-1} \end{bmatrix}$$

### 7.2.2 The Kalman Rank Condition
For $x_0$ to be uniquely solvable from $Z$, the linear mapping $\mathcal{O} x_0 = Z$ must have a trivial nullspace:
$$\operatorname{ker}(\mathcal{O}) = \{x \in \mathbb{R}^n : \mathcal{O} x = 0\} = \{0\}$$

By the rank-nullity theorem, this is equivalent to the **Kalman Observability Rank Condition**:
$$\operatorname{rank}(\mathcal{O}) = n$$

If $\operatorname{rank}(\mathcal{O}) < n$, the system is **unobservable**. Any initial state vector in the nullspace $x_0 \in \operatorname{ker}(\mathcal{O})$ produces identically zero sensor outputs for all time ($z_k = 0 \, \forall k$). Such states are invisible to the sensor suite.

By the Cayley-Hamilton theorem, higher powers $F^k$ for $k \ge n$ are linear combinations of $\{I, F, \dots, F^{n-1}\}$. Hence, extending the observability matrix beyond $n$ blocks adds no new linearly independent rows.

---

## 7.3 Detectability and the PBH Rank Test

In physical systems, complete observability is sometimes impossible. For example, in visual-inertial odometry without GPS or magnetometer, the absolute global yaw angle and absolute global translation $(x, y, z)$ are mathematically unobservable. Does an unobservable state prevent the Kalman filter from converging?

The critical concept is **detectability**:
- An unobservable mode with continuous eigenvalue $\lambda$ is **stable** if $|\lambda| < 1$ (discrete-time) or $\operatorname{Re}(\lambda) < 0$ (continuous-time).
- A system is **detectable** if all its unobservable modes are asymptotically stable.

If all unobservable states decay to zero on their own (such as viscous damping or stable thermal modes), the estimation error in those states will asymptotically vanish even without sensor measurements.

### 7.3.1 The Popov-Belevitch-Hautus (PBH) Observability Test
The PBH test evaluates observability eigenmode-by-eigenmode without computing matrix powers:

> **Theorem (PBH Observability Test):** The pair $(F, H)$ is observable if and only if:
> $$\operatorname{rank}\begin{bmatrix} \lambda I_n - F \\ H \end{bmatrix} = n \quad \forall \, \lambda \in \mathbb{C}$$
> It suffices to test only the eigenvalues $\lambda$ of $F$.

> **Theorem (PBH Detectability Test):** The pair $(F, H)$ is detectable if and only if:
> $$\operatorname{rank}\begin{bmatrix} \lambda I_n - F \\ H \end{bmatrix} = n \quad \forall \, \lambda \in \mathbb{C} \text{ such that } |\lambda| \ge 1$$
> Only unstable and marginally stable modes must be observable.

---

## 7.4 Controllability and Stabilizability of Process Noise

A dual property governs process noise excitation. If the process noise covariance is factorized as $Q = G_w Q_w G_w^T$ where $Q_w \in \mathbb{S}_{++}^p$:
- The pair $(F, G_w)$ is **controllable** if process noise excites every state dimension:
  $$\operatorname{rank}(\mathcal{C}) = \operatorname{rank}\begin{bmatrix} G_w & F G_w & F^2 G_w & \dots & F^{n-1} G_w \end{bmatrix} = n$$
- The pair $(F, G_w)$ is **stabilizable** if all uncontrollable modes are asymptotically stable ($|\lambda| < 1$).

If an unstable mode is not excited by process noise, its true variance does not grow; however, to guarantee that the Kalman filter does not experience covariance collapse ($P \to 0$ in an unexcited subspace), stabilizability is required.

---

## 7.5 The Discrete Algebraic Riccati Equation (DARE)

When the system matrices $(F, H, Q, R)$ are time-invariant, the recursive covariance equations:
$$P_{k|k-1} = F P_{k-1|k-1} F^T + Q$$
$$P_{k|k} = P_{k|k-1} - P_{k|k-1} H^T (H P_{k|k-1} H^T + R)^{-1} H P_{k|k-1}$$
can be combined into a single recursion for the prior covariance $P_{k+1|k}$:

$$P_{k+1|k} = F \left[ P_{k|k-1} - P_{k|k-1} H^T (H P_{k|k-1} H^T + R)^{-1} H P_{k|k-1} \right] F^T + Q$$

As $k \to \infty$, the sequence of covariance matrices $P_{k+1|k}$ converges to a stationary matrix $P_\infty \in \mathbb{S}_+^n$ satisfying the **Discrete Algebraic Riccati Equation (DARE)**:

$$P_\infty = F P_\infty F^T + Q - F P_\infty H^T (H P_\infty H^T + R)^{-1} H P_\infty F^T$$

The corresponding steady-state Kalman Gain is:
$$K_\infty = P_\infty H^T (H P_\infty H^T + R)^{-1}$$

The closed-loop estimation error dynamics are governed by:
$$\tilde{x}_{k+1|k} = F (I - K_\infty H) \tilde{x}_{k|k-1} + w_k - F K_\infty v_k$$
Let $F_{\text{cl}} = F(I - K_\infty H)$ be the closed-loop error transition matrix.

### 7.5.1 The Fundamental Convergence Theorem
> **Theorem (Kalman-Bucy Convergence Theorem):** If:
> 1. The pair $(F, H)$ is **detectable**, and
> 2. The pair $(F, Q^{1/2})$ is **stabilizable** (where $Q = Q^{1/2} (Q^{1/2})^T$),
>
> Then:
> - There exists a **unique symmetric positive semi-definite solution** $P_\infty \ge 0$ to the DARE.
> - For any initial covariance $P_0 \ge 0$, $\lim_{k \to \infty} P_{k|k-1} = P_\infty$.
> - The steady-state closed-loop matrix $F_{\text{cl}} = F(I - K_\infty H)$ is strictly asymptotically stable: all eigenvalues lie strictly inside the open unit disk in the complex plane ($|\lambda_i(F_{\text{cl}})| < 1$).

If in addition $(F, Q^{1/2})$ is controllable, $P_\infty$ is strictly positive definite ($P_\infty > 0$).

---

## 7.6 Mathematical Problem Set

### Problem 7.1 (Worked Example): Observability Rank Test of 2D Kinematics
**Problem Statement:** A 2D kinematic robot has state $x = [p, v]^T$ and transition matrix $F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$ with $\Delta t = 0.1\text{ s}$.
1. Evaluate the observability matrix $\mathcal{O}_p$ when only position is measured ($H_p = [1, 0]$).
2. Evaluate the observability matrix $\mathcal{O}_v$ when only velocity is measured ($H_v = [0, 1]$).
Determine which sensor configuration makes the system fully observable.

**Given Data:**
- $n = 2, \Delta t = 0.1\text{ s}$.
- $F = \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix}$.
- $H_p = [1, 0]$, $H_v = [0, 1]$.

**Step-by-Step Derivation:**
1. Position sensor configuration ($H_p = [1, 0]$):
   $$H_p F = [1, 0] \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix} = [1, 0.1]$$
   $$\mathcal{O}_p = \begin{bmatrix} H_p \\ H_p F \end{bmatrix} = \begin{bmatrix} 1.0 & 0.0 \\ 1.0 & 0.1 \end{bmatrix}$$
   Determinant:
   $$\det(\mathcal{O}_p) = (1.0)(0.1) - (0.0)(1.0) = 0.1 \neq 0$$
   $\operatorname{rank}(\mathcal{O}_p) = 2 = n$. The system is **fully observable** from position measurements alone.
2. Velocity sensor configuration ($H_v = [0, 1]$):
   $$H_v F = [0, 1] \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix} = [0, 1.0]$$
   $$\mathcal{O}_v = \begin{bmatrix} H_v \\ H_v F \end{bmatrix} = \begin{bmatrix} 0.0 & 1.0 \\ 0.0 & 1.0 \end{bmatrix}$$
   Determinant:
   $$\det(\mathcal{O}_v) = (0.0)(1.0) - (1.0)(0.0) = 0$$
   $\operatorname{rank}(\mathcal{O}_v) = 1 < 2$. The system is **unobservable** from velocity measurements alone.
3. Physical Interpretation:
   Observing position over two consecutive steps enables velocity estimation via $\hat{v} \approx \frac{z_1 - z_0}{\Delta t}$.
   Observing velocity over time reveals nothing about absolute position $p_0$, because shifting position by an arbitrary constant $c$ leaves velocity unchanged.

**Final Result:**
$$\operatorname{rank}(\mathcal{O}_p) = 2\text{ (Observable)}, \quad \operatorname{rank}(\mathcal{O}_v) = 1\text{ (Unobservable)}$$

---

### Problem 7.2 (Worked Example): PBH Detectability Analysis for Velocity-Only Sensing
**Problem Statement:** For the unobservable velocity-sensing system from Problem 7.1 ($H_v = [0, 1]$), determine whether the system is detectable using the PBH test.

**Step-by-Step Derivation:**
1. Eigenvalues of $F = \begin{bmatrix} 1 & 0.1 \\ 0 & 1 \end{bmatrix}$:
   $$\det(\lambda I - F) = (\lambda - 1)^2 = 0 \implies \lambda_1 = \lambda_2 = 1.0$$
   The eigenvalue is $\lambda = 1.0$, which lies on the unit circle ($|\lambda| = 1 \ge 1$).
2. Form the PBH matrix at $\lambda = 1.0$:
   $$\mathcal{M}_{\text{PBH}} = \begin{bmatrix} \lambda I_2 - F \\ H_v \end{bmatrix} = \begin{bmatrix} 0 & -0.1 \\ 0 & 0 \\ 0 & 1 \end{bmatrix}$$
3. Evaluate the rank of $\mathcal{M}_{\text{PBH}}$:
   Notice that the entire first column is identically zero: $\begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$.
   The second column is $\begin{bmatrix} -0.1 \\ 0 \\ 1 \end{bmatrix} \neq 0$.
   Therefore:
   $$\operatorname{rank}(\mathcal{M}_{\text{PBH}}) = 1 < 2$$
4. Detectability evaluation:
   Because the unobservable eigenvalue $\lambda = 1.0$ is marginally unstable ($|\lambda| \ge 1$) and fails the PBH rank condition, the system is **not detectable**.
   *Consequence:* In a Kalman filter with velocity-only sensing, the position estimation variance $P_{11}$ will grow linearly towards infinity ($P_{11} \to \infty$ as $k \to \infty$).

**Final Result:**
$$\operatorname{rank}(\mathcal{M}_{\text{PBH}}) = 1 < 2 \implies \mathbf{Not\ Detectable\ (Position\ covariance\ diverges)}$$

---

### Problem 7.3 (Worked Example): Analytical DARE Solution for 1D State
**Problem Statement:** A 1D scalar system has $x_k = a x_{k-1} + w_k$ and $z_k = c x_k + v_k$ with $a = 1.0, c = 1.0, q = 3.0, r = 1.0$.
1. Formulate the scalar DARE for the steady-state prior variance $p_\infty$.
2. Solve the quadratic equation analytically for $p_\infty$.
3. Compute the steady-state Kalman gain $K_\infty$ and the closed-loop pole $\lambda_{\text{cl}}$.

**Step-by-Step Derivation:**
1. Scalar DARE formula:
   $$p_\infty = a^2 p_\infty + q - \frac{a^2 c^2 p_\infty^2}{c^2 p_\infty + r}$$
   Substitute $a = 1, c = 1, q = 3, r = 1$:
   $$p_\infty = p_\infty + 3 - \frac{p_\infty^2}{p_\infty + 1}$$
2. Subtract $p_\infty$ from both sides:
   $$0 = 3 - \frac{p_\infty^2}{p_\infty + 1} \implies \frac{p_\infty^2}{p_\infty + 1} = 3$$
3. Cross-multiplying:
   $$p_\infty^2 = 3 (p_\infty + 1) = 3 p_\infty + 3$$
   $$p_\infty^2 - 3 p_\infty - 3 = 0$$
4. Solving the quadratic equation via the quadratic formula:
   $$p_\infty = \frac{3 \pm \sqrt{(-3)^2 - 4(1)(-3)}}{2} = \frac{3 \pm \sqrt{9 + 12}}{2} = \frac{3 \pm \sqrt{21}}{2}$$
   Since variance must be positive semi-definite ($p_\infty \ge 0$), we take the positive root ($\sqrt{21} \approx 4.582576$):
   $$p_\infty = \frac{3 + 4.582576}{2} = \frac{7.582576}{2} \approx 3.791288$$
5. Steady-state Kalman gain:
   $$K_\infty = \frac{c p_\infty}{c^2 p_\infty + r} = \frac{3.791288}{3.791288 + 1.0} = \frac{3.791288}{4.791288} \approx 0.791288$$
6. Closed-loop pole:
   $$\lambda_{\text{cl}} = a (1 - K_\infty c) = 1.0 \times (1 - 0.791288) = 0.208712$$
   Notice that $|\lambda_{\text{cl}}| = 0.2087 < 1.0$. The open-loop marginally stable pole at $\lambda = 1.0$ was shifted deep inside the unit circle to $0.2087$.

**Final Result:**
$$p_\infty = \frac{3 + \sqrt{21}}{2} \approx 3.7913, \quad K_\infty \approx 0.7913, \quad \lambda_{\text{cl}} \approx 0.2087$$

---

### Problem 7.4 (Worked Example): Fixed-Point Iteration Convergence of DARE
**Problem Statement:** For the system in Problem 7.3 ($a=1, c=1, q=3, r=1$), simulate the Riccati recursion starting from an initial guess $p_0 = 100.0$. Show that within 5 iterations, $p_k$ converges to within $0.001$ of $p_\infty \approx 3.791288$.

**Step-by-Step Derivation:**
1. Recursive formula:
   $$p_{k+1} = p_k + 3 - \frac{p_k^2}{p_k + 1} = 3 + \frac{p_k(p_k + 1) - p_k^2}{p_k + 1} = 3 + \frac{p_k}{p_k + 1}$$
2. Iteration values:
   - $k = 0$: $p_0 = 100.0$
   - $k = 1$: $p_1 = 3 + \frac{100}{101} = 3 + 0.990099 = 3.990099$
     *(In just one single step, variance collapsed from 100 to 3.99!)*
   - $k = 2$: $p_2 = 3 + \frac{3.990099}{4.990099} = 3 + 0.799603 = 3.799603$
   - $k = 3$: $p_3 = 3 + \frac{3.799603}{4.799603} = 3 + 0.791650 = 3.791650$
   - $k = 4$: $p_4 = 3 + \frac{3.791650}{4.791650} = 3 + 0.791303 = 3.791303$
   - $k = 5$: $p_5 = 3 + \frac{3.791303}{4.791303} = 3 + 0.791288 = 3.791288$
3. Error:
   $$|p_5 - p_\infty| = |3.791288 - 3.791288| < 10^{-6}$$

**Final Result:**
$$p_0 = 100.000, \quad p_1 = 3.990, \quad p_2 = 3.800, \quad p_3 = 3.7916, \quad p_5 = 3.791288$$
Convergence is exponentially rapid with contraction factor $\approx \lambda_{\text{cl}}^2 \approx (0.2087)^2 \approx 0.0435$.

---

### Problem 7.5 (Worked Example): Analytical 2D DARE for Continuous Kinematics
**Problem Statement:** Consider a continuous 1D kinematic tracking system $\dot{p} = v, \dot{v} = w_c$ with position measurement $z = p + v_c$. Continuous parameters are $Q_c = \tilde{q}$ and $R_c = \tilde{r}$. The continuous algebraic Riccati equation (CARE) is:
$$A P_\infty + P_\infty A^T + G Q_c G^T - P_\infty C^T R_c^{-1} C P_\infty = 0$$
where $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}, C = \begin{bmatrix} 1 & 0 \end{bmatrix}$.
Derive the exact closed-form analytical expressions for the steady-state continuous covariance elements $P_{11}, P_{12}, P_{22}$.

**Step-by-Step Derivation:**
1. Let $P_\infty = \begin{bmatrix} P_{11} & P_{12} \\ P_{12} & P_{22} \end{bmatrix}$.
2. Compute $A P_\infty + P_\infty A^T$:
   $$A P_\infty = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} P_{11} & P_{12} \\ P_{12} & P_{22} \end{bmatrix} = \begin{bmatrix} P_{12} & P_{22} \\ 0 & 0 \end{bmatrix}$$
   $$A P_\infty + P_\infty A^T = \begin{bmatrix} 2 P_{12} & P_{22} \\ P_{22} & 0 \end{bmatrix}$$
3. Noise injection term:
   $$G Q_c G^T = \begin{bmatrix} 0 \\ 1 \end{bmatrix} \tilde{q} \begin{bmatrix} 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & \tilde{q} \end{bmatrix}$$
4. Measurement update term:
   $$C^T R_c^{-1} C = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \frac{1}{\tilde{r}} \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 1/\tilde{r} & 0 \\ 0 & 0 \end{bmatrix}$$
   $$P_\infty C^T R_c^{-1} C P_\infty = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11} \\ P_{12} \end{bmatrix} \begin{bmatrix} P_{11} & P_{12} \end{bmatrix} = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11}^2 & P_{11} P_{12} \\ P_{11} P_{12} & P_{12}^2 \end{bmatrix}$$
5. Assembling the three algebraic equations:
   - $(1, 1)$ element: $2 P_{12} - \frac{1}{\tilde{r}} P_{11}^2 = 0 \implies P_{12} = \frac{P_{11}^2}{2 \tilde{r}}$
   - $(2, 2)$ element: $\tilde{q} - \frac{1}{\tilde{r}} P_{12}^2 = 0 \implies P_{12}^2 = \tilde{q} \tilde{r} \implies P_{12} = \sqrt{\tilde{q} \tilde{r}}$
   - $(1, 2)$ element: $P_{22} - \frac{1}{\tilde{r}} P_{11} P_{12} = 0 \implies P_{22} = \frac{P_{11} P_{12}}{\tilde{r}}$
6. Solving for $P_{11}$:
   $$P_{12} = \sqrt{\tilde{q} \tilde{r}}$$
   From $(1, 1)$: $P_{11}^2 = 2 \tilde{r} P_{12} = 2 \tilde{r} \sqrt{\tilde{q} \tilde{r}} = 2 \tilde{q}^{1/2} \tilde{r}^{3/2}$
   $$P_{11} = \sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}$$
7. Solving for $P_{22}$:
   $$P_{22} = \frac{P_{11} P_{12}}{\tilde{r}} = \frac{(\sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}) (\tilde{q}^{1/2} \tilde{r}^{1/2})}{\tilde{r}} = \sqrt{2} \tilde{q}^{3/4} \tilde{r}^{1/4}$$
8. Continuous Kalman Gain:
   $$K = P_\infty C^T R_c^{-1} = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11} \\ P_{12} \end{bmatrix} = \begin{bmatrix} \sqrt{2} (\tilde{q}/\tilde{r})^{1/4} \\ (\tilde{q}/\tilde{r})^{1/2} \end{bmatrix}$$

**Final Result:**
$$P_{11} = \sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}, \quad P_{12} = \sqrt{\tilde{q} \tilde{r}}, \quad P_{22} = \sqrt{2} \tilde{q}^{3/4} \tilde{r}^{1/4}$$
$$K = \begin{bmatrix} \sqrt{2} \omega_0 \\ \omega_0^2 \end{bmatrix} \quad \text{where } \omega_0 = (\tilde{q}/\tilde{r})^{1/4}$$
*Physical Remark:* The closed-loop estimator poles form a critically damped 2nd-order Butterworth filter with natural frequency $\omega_0 = (\tilde{q}/\tilde{r})^{1/4}$ and damping ratio $\zeta = 1/\sqrt{2} \approx 0.707$.

---

### Problem 7.6 (Worked Example): Symplectic Matrix Formulation of DARE
**Problem Statement:** Formulate the $2n \times 2n$ symplectic pencil for solving the discrete algebraic Riccati equation:
$$\mathcal{Z} = \begin{bmatrix} F + Q F^{-T} H^T R^{-1} H & -Q F^{-T} \\ -F^{-T} H^T R^{-1} H & F^{-T} \end{bmatrix}$$
Show that the eigenvalues of $\mathcal{Z}$ occur in reciprocal pairs $(\lambda, 1/\lambda)$.

**Step-by-Step Derivation:**
1. A matrix $\mathcal{Z} \in \mathbb{R}^{2n \times 2n}$ is symplectic if:
   $$\mathcal{Z}^T J \mathcal{Z} = J \quad \text{where } J = \begin{bmatrix} 0 & I_n \\ -I_n & 0 \end{bmatrix}$$
2. Consider the characteristic polynomial:
   $$\det(\lambda I_{2n} - \mathcal{Z}) = 0$$
   Using the symplectic property: $\mathcal{Z}^{-1} = -J \mathcal{Z}^T J$.
   $$\det(\lambda I - \mathcal{Z}) = \det\left(\lambda I - (-J \mathcal{Z}^T J)\right) = \det\left(-J (\lambda I - \mathcal{Z}^T) J\right) = \det(\lambda I - \mathcal{Z}^T) = \det(\lambda I - \mathcal{Z})$$
3. Inverting the eigenvalue relation:
   $$\det\left(\lambda^{-1} I - \mathcal{Z}\right) = \det\left(\lambda^{-1} \mathcal{Z} (\mathcal{Z}^{-1} - \lambda I)\right) = \lambda^{-2n} \det(\mathcal{Z}) \det(\mathcal{Z}^{-1} - \lambda I) = \lambda^{-2n} \det(\mathcal{Z} - \lambda I)$$
4. Therefore, if $\lambda$ is an eigenvalue of $\mathcal{Z}$, then $1/\lambda$ must also be an eigenvalue with the exact same multiplicity.
5. In stable Kalman filtering, exactly $n$ eigenvalues lie strictly inside the unit circle ($|\lambda_i| < 1$), and exactly $n$ eigenvalues lie strictly outside ($|\lambda_i| > 1$). The stable invariant subspace spanned by the $n$ stable eigenvectors yields the unique positive semi-definite DARE solution $P_\infty$. $\blacksquare$

---

### Problem 7.7 (Worked Example): Unobservable Subspace Projection
**Problem Statement:** A 3D system has $F = \operatorname{diag}(0.5, 0.8, 1.0)$ and $H = [1, 1, 0]$.
1. Compute the observability matrix $\mathcal{O}$.
2. Determine the unobservable subspace $\operatorname{ker}(\mathcal{O})$ and find an orthonormal basis for it.

**Step-by-Step Derivation:**
1. Observability matrix rows:
   $$H = [1, 1, 0]$$
   $$H F = [1, 1, 0] \operatorname{diag}(0.5, 0.8, 1.0) = [0.5, 0.8, 0]$$
   $$H F^2 = [1, 1, 0] \operatorname{diag}(0.25, 0.64, 1.0) = [0.25, 0.64, 0]$$
   $$\mathcal{O} = \begin{bmatrix} 1.0 & 1.0 & 0.0 \\ 0.5 & 0.8 & 0.0 \\ 0.25 & 0.64 & 0.0 \end{bmatrix}$$
2. Nullspace of $\mathcal{O}$:
   Notice that column 3 of $\mathcal{O}$ is identically zero: $\begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$.
   The upper $2 \times 2$ submatrix has determinant $(1.0)(0.8) - (1.0)(0.5) = 0.3 \neq 0$.
   Hence, the first two columns are linearly independent.
   The nullspace satisfies $\mathcal{O} x = 0$:
   $$\begin{bmatrix} 1.0 & 1.0 \\ 0.5 & 0.8 \\ 0.25 & 0.64 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} + x_3 \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} \implies x_1 = 0, x_2 = 0, x_3 \in \mathbb{R}$$
3. Orthonormal basis for unobservable subspace:
   $$\operatorname{ker}(\mathcal{O}) = \operatorname{span}\left( \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \right)$$
4. Detectability check:
   The unobservable mode corresponds to eigenvalue $\lambda_3 = 1.0$.
   Since $|\lambda_3| = 1.0 \ge 1.0$, the system is **not detectable**.

**Final Result:**
$$\operatorname{ker}(\mathcal{O}) = \operatorname{span}\left([0, 0, 1]^T\right), \quad \operatorname{rank}(\mathcal{O}) = 2 < 3\text{ (Not Detectable)}$$

---

### Problem 7.8 (Worked Example): Stabilization of an Unstable Plant
**Problem Statement:** An inverted robotic pendulum on a cart has an unstable discrete plant pole $a = 1.2 > 1.0$. Process noise is $q = 1.0$, measurement sensitivity is $c = 1.0$, and measurement noise is $r = 1.0$.
1. Solve for the steady-state prior variance $p_\infty$.
2. Compute the steady-state gain $K_\infty$ and the closed-loop pole $\lambda_{\text{cl}}$.
3. Verify that the estimator is strictly stable despite the unstable physical plant.

**Step-by-Step Derivation:**
1. DARE for scalar state:
   $$p_\infty = a^2 p_\infty + q - \frac{a^2 c^2 p_\infty^2}{c^2 p_\infty + r} = \frac{a^2 p_\infty r + q(c^2 p_\infty + r)}{c^2 p_\infty + r}$$
   Substitute $a = 1.2 \implies a^2 = 1.44$, $c = 1, q = 1, r = 1$:
   $$p_\infty = \frac{1.44 p_\infty (1) + 1(p_\infty + 1)}{p_\infty + 1} = \frac{2.44 p_\infty + 1}{p_\infty + 1}$$
2. Multiplying through by $(p_\infty + 1)$:
   $$p_\infty (p_\infty + 1) = 2.44 p_\infty + 1 \implies p_\infty^2 + p_\infty = 2.44 p_\infty + 1$$
   $$p_\infty^2 - 1.44 p_\infty - 1 = 0$$
3. Quadratic formula:
   $$p_\infty = \frac{1.44 \pm \sqrt{(-1.44)^2 - 4(1)(-1)}}{2} = \frac{1.44 \pm \sqrt{2.0736 + 4}}{2} = \frac{1.44 \pm \sqrt{6.0736}}{2}$$
   $$\sqrt{6.0736} \approx 2.464467$$
   $$p_\infty = \frac{1.44 + 2.464467}{2} = \frac{3.904467}{2} \approx 1.952234$$
4. Steady-state Kalman gain:
   $$K_\infty = \frac{p_\infty}{p_\infty + r} = \frac{1.952234}{1.952234 + 1.0} = \frac{1.952234}{2.952234} \approx 0.661273$$
5. Closed-loop pole:
   $$\lambda_{\text{cl}} = a (1 - K_\infty c) = 1.2 \times (1 - 0.661273) = 1.2 \times 0.338727 \approx 0.406472$$
6. Stability check:
   $$|\lambda_{\text{cl}}| = 0.4065 < 1.0$$
   The unstable plant pole ($a = 1.2$) has been successfully shifted to a stable pole at $0.4065$!

**Final Result:**
$$p_\infty \approx 1.9522, \quad K_\infty \approx 0.6613, \quad \lambda_{\text{cl}} \approx 0.4065\text{ (Strictly Stable)}$$

---

### Problem 7.9 (Worked Example): Covariance Windup under Zero Measurement Updates
**Problem Statement:** An autonomous rover loses GPS tracking for $N$ consecutive time steps while running a Constant Velocity model ($F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}, Q = \tilde{q} \begin{bmatrix} \Delta t^3/3 & \Delta t^2/2 \\ \Delta t^2/2 & \Delta t \end{bmatrix}$). Derive the analytical formula for position variance $P_{11}(k)$ as a function of elapsed time $T = k \Delta t$ when starting from initial covariance $P_0 = 0$.

**Step-by-Step Derivation:**
1. Under zero measurements ($H = 0$ or $R \to \infty$), the filter runs open-loop:
   $$P_k = F P_{k-1} F^T + Q_k$$
   With $P_0 = 0$, $P_k = \sum_{j=0}^{k-1} F^j Q (F^T)^j$.
2. In continuous time (Section 4.3), $P(t) = \int_0^t e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$.
   Here $e^{A \tau} G = \begin{bmatrix} \tau \\ 1 \end{bmatrix}$.
3. Position variance integrand:
   $$[e^{A \tau} G Q_c G^T e^{A^T \tau}]_{11} = \tilde{q} \tau^2$$
4. Integrating from $0$ to $T$:
   $$P_{11}(T) = \tilde{q} \int_0^T \tau^2 d\tau = \frac{1}{3} \tilde{q} T^3$$
5. Velocity variance:
   $$P_{22}(T) = \tilde{q} \int_0^T 1 \, d\tau = \tilde{q} T$$
   Position uncertainty accumulates cubically: $\sigma_p(T) = \sqrt{\frac{1}{3} \tilde{q}} \, T^{3/2}$.

**Final Result:**
$$P_{11}(T) = \frac{1}{3} \tilde{q} T^3 \implies \sigma_p(T) \propto T^{3/2}$$

---

### Problem 7.10 (Worked Example): Numerical DARE Doubling Algorithm Specification
**Problem Statement:** Specify the structure of the Anderson-Moore Matrix Sign / Doubling Algorithm for solving the DARE in $\mathcal{O}(\log_2(\text{iterations}))$ convergence.

**Step-by-Step Derivation:**
1. Initialization:
   $$A_0 = F(I + R^{-1} H P_0 H^T)^{-1}$$
   $$P_0 = Q$$
   $$G_0 = F H^T (H P_0 H^T + R)^{-1} H F^T$$
2. Doubling recursion (for $k = 0, 1, 2, \dots$):
   $$A_{k+1} = A_k (I + G_k P_k)^{-1} A_k$$
   $$P_{k+1} = P_k + A_k (I + G_k P_k)^{-1} P_k A_k^T$$
   $$G_{k+1} = G_k + A_k^T G_k (I + P_k G_k)^{-1} A_k$$
3. Termination condition:
   $$\|P_{k+1} - P_k\|_\infty < \epsilon \quad (\text{typically } 10^{-12})$$
4. Convergence rate:
   Each iteration squares the effective time horizon: $2^k$ steps.
   Convergence to double precision typically occurs in just $4$ to $6$ iterations.

**Final Result:**
Doubling algorithm converges quadratically: $\mathcal{O}(\log_2(1/\epsilon))$.

---

### Problem 7.11 (Solved Exercise): Observability of a 3-State Damped Oscillator
**Problem Statement:** A continuous oscillator has $\ddot{x} + 2\zeta \omega_n \dot{x} + \omega_n^2 x = 0$ with an unknown constant sensor bias $b$ ($\dot{b} = 0$). State is $[x, \dot{x}, b]^T$, with measurement $z = x + b$. Prove that the system is unobservable.

**Step-by-Step Solution:**
1. Continuous matrices:
   $$A = \begin{bmatrix} 0 & 1 & 0 \\ -\omega_n^2 & -2\zeta\omega_n & 0 \\ 0 & 0 & 0 \end{bmatrix}, \quad C = \begin{bmatrix} 1 & 0 & 1 \end{bmatrix}$$
2. Observability matrix rows:
   $$C = \begin{bmatrix} 1 & 0 & 1 \end{bmatrix}$$
   $$C A = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}$$
   $$C A^2 = \begin{bmatrix} -\omega_n^2 & -2\zeta\omega_n & 0 \end{bmatrix}$$
   $$\mathcal{O} = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 0 \\ -\omega_n^2 & -2\zeta\omega_n & 0 \end{bmatrix}$$
3. Determinant of $\mathcal{O}$:
   Expand along third column:
   $$\det(\mathcal{O}) = 1 \cdot \det\begin{bmatrix} 0 & 1 \\ -\omega_n^2 & -2\zeta\omega_n \end{bmatrix} = 1 \cdot (0 - (-\omega_n^2)) = \omega_n^2 \neq 0$$
   Wait! $\det(\mathcal{O}) = \omega_n^2 \neq 0$!
   The rank is 3! Thus, the system is **observable**!
   *Physical Reason:* Because $x(t)$ oscillates while $b$ is static, the Kalman filter can separate the alternating AC signal from the constant DC offset. Unobservability only occurs if $\omega_n = 0$.

**Final Answer:**
$$\det(\mathcal{O}) = \omega_n^2 \implies \operatorname{rank}(\mathcal{O}) = 3\text{ (Fully Observable for }\omega_n \neq 0)$$

---

### Problem 7.12 (Solved Exercise): Zero Noise Riccati Collapse
**Problem Statement:** For a 1D scalar system with $a = 1, c = 1, r = 1$, solve the DARE when process noise is identically zero ($q = 0$). Explain the physical implications.

**Step-by-Step Solution:**
1. DARE with $q = 0$:
   $$p_\infty = p_\infty + 0 - \frac{p_\infty^2}{p_\infty + 1} \implies \frac{p_\infty^2}{p_\infty + 1} = 0 \implies p_\infty = 0$$
2. Steady-state gain:
   $$K_\infty = \frac{p_\infty}{p_\infty + r} = \frac{0}{0 + 1} = 0$$
3. Closed-loop pole:
   $$\lambda_{\text{cl}} = a (1 - K_\infty c) = 1.0 (1 - 0) = 1.0$$
4. Physical Implication:
   When $q = 0$, the filter assumes the model is absolutely perfect. Over time, $P_k \to 0$ and $K_k \to 0$. The filter completely closes its eyes to future sensor measurements. If the true physical state ever changes, the filter will permanently diverge. Process noise $q > 0$ is essential to prevent filter death.

**Final Answer:**
$$p_\infty = 0, \quad K_\infty = 0\text{ (Filter permanently ignores sensors)}$$

---

### Problem 7.13 (Solved Exercise): Controllability Rank Test of Kinematic Noise
**Problem Statement:** For the 2D Constant Velocity model with $F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$, test the controllability of the discrete noise coupling matrix $G_d = \begin{bmatrix} \Delta t^2 / 2 \\ \Delta t \end{bmatrix}$.

**Step-by-Step Solution:**
1. Controllability matrix $\mathcal{C} = \begin{bmatrix} G_d & F G_d \end{bmatrix}$.
2. Compute $F G_d$:
   $$F G_d = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \Delta t^2 / 2 \\ \Delta t \end{bmatrix} = \begin{bmatrix} \frac{1}{2}\Delta t^2 + \Delta t^2 \\ \Delta t \end{bmatrix} = \begin{bmatrix} \frac{3}{2}\Delta t^2 \\ \Delta t \end{bmatrix}$$
3. Controllability matrix:
   $$\mathcal{C} = \begin{bmatrix} \frac{1}{2}\Delta t^2 & \frac{3}{2}\Delta t^2 \\ \Delta t & \Delta t \end{bmatrix}$$
4. Determinant:
   $$\det(\mathcal{C}) = \left(\frac{1}{2}\Delta t^2\right)(\Delta t) - \left(\frac{3}{2}\Delta t^2\right)(\Delta t) = \frac{1}{2}\Delta t^3 - \frac{3}{2}\Delta t^3 = -\Delta t^3 \neq 0$$
5. For any $\Delta t > 0$, $\det(\mathcal{C}) \neq 0 \implies \operatorname{rank}(\mathcal{C}) = 2$.
   The process noise excites all 2 degrees of freedom.

**Final Answer:**
$$\operatorname{rank}(\mathcal{C}) = 2\text{ (Fully Controllable)}$$

---

### Problem 7.14 (Solved Exercise): Closed-Loop Error Eigenvalues
**Problem Statement:** Prove that the closed-loop state matrix $F_{\text{cl}} = F(I - K H)$ has eigenvalues identical to $(I - K H) F$.

**Step-by-Step Solution:**
1. Recall the matrix determinant property for any two square matrices $A, B$:
   $$\det(\lambda I - A B) = \det(\lambda I - B A)$$
2. Set $A = F$ and $B = I - K H$:
   $$\det(\lambda I - F(I - K H)) = \det(\lambda I - (I - K H) F)$$
3. Since their characteristic polynomials are identically equal, their eigenvalues are identical. $\blacksquare$

---

### Problem 7.15 (Solved Exercise): Effect of Sampling Rate on Steady-State Gain
**Problem Statement:** In the continuous 2D system of Problem 7.5, how does the steady-state position gain $K_p$ scale with the ratio $\tilde{q} / \tilde{r}$? If sensor noise variance $\tilde{r}$ is reduced by a factor of 16, by what factor does $K_p$ increase?

**Step-by-Step Solution:**
1. From Problem 7.5:
   $$K_p = \sqrt{2} \left(\frac{\tilde{q}}{\tilde{r}}\right)^{1/4}$$
2. The gain scales with the fourth root of the signal-to-noise ratio:
   $$K_p \propto \tilde{r}^{-1/4}$$
3. If $\tilde{r}$ is divided by 16 ($\tilde{r}_{\text{new}} = \tilde{r} / 16$):
   $$\left(\frac{\tilde{r}}{16}\right)^{-1/4} = (16)^{1/4} \tilde{r}^{-1/4} = 2 \tilde{r}^{-1/4}$$
4. The steady-state gain doubles ($2\times$).

**Final Answer:**
$$K_p\text{ increases by a factor of }2.0$$

---

### Problem 7.16 (Solved Exercise): Discrete Algebraic Riccati Equation for Posterior Covariance
**Problem Statement:** Show that the posterior steady-state covariance $P_\infty^+ = (I - K_\infty H) P_\infty$ satisfies the alternative DARE:
$$P_\infty^+ = (I - P_\infty^+ H^T R^{-1} H) (F P_\infty^+ F^T + Q)$$

**Step-by-Step Solution:**
1. In information form (Problem 5.15):
   $$(P_{k|k})^{-1} = (P_{k|k-1})^{-1} + H^T R^{-1} H$$
2. Since $P_{k|k-1} = F P_{k-1|k-1} F^T + Q$, at steady state:
   $$(P_\infty^+)^{-1} = (F P_\infty^+ F^T + Q)^{-1} + H^T R^{-1} H$$
3. Applying the matrix inversion lemma yields the alternative posterior DARE. $\blacksquare$

---

### Problem 7.17 (Solved Exercise): Detectability with Decoupled States
**Problem Statement:** A 2D system has $F = \begin{bmatrix} 0.5 & 0 \\ 0 & 1.5 \end{bmatrix}$ and $H = [1, 0]$. Determine if the system is detectable.

**Step-by-Step Solution:**
1. Eigenvalues: $\lambda_1 = 0.5$ (stable), $\lambda_2 = 1.5$ (unstable).
2. For $\lambda_1 = 0.5$: $|\lambda_1| < 1$, so it does not require observability for detectability.
3. For $\lambda_2 = 1.5$: $|\lambda_2| \ge 1$. Evaluate PBH rank:
   $$\mathcal{M}_{\text{PBH}} = \begin{bmatrix} 1.5 - 0.5 & 0 \\ 0 & 1.5 - 1.5 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 1.0 & 0 \\ 0 & 0 \\ 1.0 & 0 \end{bmatrix}$$
   Column 2 is identically zero. Thus $\operatorname{rank}(\mathcal{M}_{\text{PBH}}) = 1 < 2$.
4. The unstable mode $\lambda_2 = 1.5$ is unobservable. The system is **not detectable**.

**Final Answer:**
$$\mathbf{Not\ Detectable\ (Unstable\ mode\ }\lambda=1.5\mathbf{\ is\ unobserved)}$$

---

### Problem 7.18 (Solved Exercise): DARE Upper Bound via Observability Gramian
**Problem Statement:** Prove that if $(F, H)$ is observable, the steady-state prior covariance is bounded from above by $P_\infty \le \mathcal{O}^{-1} \mathcal{R} \mathcal{O}^{-T} + \dots$ where $\mathcal{O}$ is the observability matrix.

**Step-by-Step Solution:**
1. A batch least-squares estimator using $n$ observations achieves covariance:
   $$P_{\text{batch}} = (\mathcal{O}^T \mathcal{R}^{-1} \mathcal{O})^{-1}$$
2. Since the Kalman Filter is the optimal minimum variance estimator, its posterior covariance cannot exceed that of any sub-optimal linear estimator:
   $$P_\infty^+ \le (\mathcal{O}^T \mathcal{R}^{-1} \mathcal{O})^{-1}$$
3. This establishes a strict analytical upper bound on steady-state filter uncertainty. $\blacksquare$

---

### Problem 7.19 (Solved Exercise): Monotonic Convergence of Riccati Iteration
**Problem Statement:** Prove that if the initial covariance is chosen as $P_0 = 0$, the sequence of prior covariances generated by the Kalman recursion is monotonically non-decreasing: $P_0 \le P_1 \le P_2 \le \dots \le P_\infty$.

**Step-by-Step Solution:**
1. Base step: $P_0 = 0$. Since $P_1 = F P_0 F^T + Q = Q \ge 0$, we have $P_0 \le P_1$.
2. Inductive step: Assume $P_{k-1} \le P_k$.
   The Riccati mapping $\psi(P) = F P F^T + Q - F P H^T (H P H^T + R)^{-1} H P F^T$ can be rewritten as:
   $$\psi(P) = \min_K \left[ (F - K H) P (F - K H)^T + K R K^T + Q \right]$$
3. Because the matrix quadratic form is an increasing operator in $P$, $\psi(A) \le \psi(B)$ whenever $A \le B$.
4. Therefore, $P_k \le P_{k+1}$ for all $k$.
5. By the monotone convergence theorem for bounded symmetric operators, $P_k \to P_\infty$. $\blacksquare$

---

### Problem 7.20 (Solved Exercise): DARE Spectral Radius Condition
**Problem Statement:** Show that if $\rho(F) < 1$ (the open-loop physical system is asymptotically stable), then $(F, H)$ is automatically detectable for *any* choice of measurement matrix $H$ (even $H = 0$).

**Step-by-Step Solution:**
1. By definition, detectability requires that all unobservable eigenvalues satisfy $|\lambda| < 1$.
2. If $\rho(F) < 1$, *all* eigenvalues of $F$ satisfy $|\lambda_i| < 1$.
3. Thus, every unobservable mode is strictly stable, regardless of $H$.
4. The system is unconditionally detectable. $\blacksquare$


---

# Chapter 8: The Extended Kalman Filter (EKF): Nonlinear Systems and Taylor Linearization

## 8.1 Introduction: Conquering Physical Nonlinearity

In the physical world, pure linearity is an idealized mathematical fiction. Robotic platforms rotate on non-Euclidean manifolds, kinematic velocities couple through trigonometric projections, acoustic and electromagnetic sensors measure ranges via Euclidean norms ($\sqrt{x^2 + y^2}$), and cameras project 3D rays through perspective division ($u = f_x \frac{X}{Z}$).

When the state propagation function $f(\cdot)$ or observation function $h(\cdot)$ is nonlinear:
$$x_k = f(x_{k-1}, u_{k-1}) + w_k$$
$$z_k = h(x_k) + v_k$$
the linear Kalman filter equations no longer apply. If a Gaussian random vector is passed through a nonlinear mapping, the output probability distribution is fundamentally non-Gaussian (skewed, multi-modal, or heavy-tailed).

The **Extended Kalman Filter (EKF)** is the classic workhorse of aerospace and robotics estimation. It resolves nonlinearity through **first-order multivariable Taylor series linearization** around the current state estimate.

In this chapter, we derive the mathematical foundations of the EKF, formulate the exact Jacobian matrices for differential-drive robots and range-bearing radar systems, analyze the critical phenomenon of angle-wrapping, expose the failure modes and divergence pathologies of first-order linearization, and solve 20 rigorous problems.

---

## 8.2 The Nonlinear State-Space Formulation

Consider the discrete nonlinear dynamic system:
$$x_k = f(x_{k-1}, u_{k-1}) + w_k$$
$$z_k = h(x_k) + v_k$$
where:
- $x_k \in \mathbb{R}^n$ is the state vector.
- $u_{k-1} \in \mathbb{R}^p$ is the deterministic control input.
- $w_k \sim \mathcal{N}(0, Q_k)$ is zero-mean Gaussian process noise.
- $z_k \in \mathbb{R}^m$ is the observation vector.
- $v_k \sim \mathcal{N}(0, R_k)$ is zero-mean Gaussian measurement noise.
- $f : \mathbb{R}^n \times \mathbb{R}^p \to \mathbb{R}^n$ and $h : \mathbb{R}^n \to \mathbb{R}^m$ are continuously differentiable $\mathcal{C}^1$ vector functions.

### 8.2.1 Multivariable Taylor Series Expansion
Let $\hat{x}_{k-1|k-1}$ be the posterior estimate at step $k-1$ with estimation error $\tilde{x}_{k-1|k-1} = x_{k-1} - \hat{x}_{k-1|k-1}$.
Expanding $f(x_{k-1}, u_{k-1})$ in a multivariable Taylor series around the estimate $\hat{x}_{k-1|k-1}$:

$$f(x_{k-1}, u_{k-1}) = f(\hat{x}_{k-1|k-1}, u_{k-1}) + \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}, u_{k-1}} (x_{k-1} - \hat{x}_{k-1|k-1}) + \mathcal{O}(\|\tilde{x}_{k-1|k-1}\|^2)$$

Neglecting higher-order terms $\mathcal{O}(\|\tilde{x}\|^2)$ yields the linear affine approximation:
$$x_k \approx f(\hat{x}_{k-1|k-1}, u_{k-1}) + F_k \tilde{x}_{k-1|k-1} + w_k$$
where $F_k \in \mathbb{R}^{n \times n}$ is the **State Transition Jacobian Matrix**:
$$F_k = \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}, u_{k-1}} = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_n}{\partial x_1} & \cdots & \frac{\partial f_n}{\partial x_n} \end{bmatrix}$$

Similarly, expanding the measurement function $h(x_k)$ around the predicted prior state $\hat{x}_{k|k-1}$:
$$h(x_k) = h(\hat{x}_{k|k-1}) + \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}} (x_k - \hat{x}_{k|k-1}) + \mathcal{O}(\|\tilde{x}_{k|k-1}\|^2)$$
$$z_k \approx h(\hat{x}_{k|k-1}) + H_k \tilde{x}_{k|k-1} + v_k$$
where $H_k \in \mathbb{R}^{m \times n}$ is the **Measurement Sensitivity Jacobian Matrix**:
$$H_k = \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}} = \begin{bmatrix} \frac{\partial h_1}{\partial x_1} & \cdots & \frac{\partial h_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial h_m}{\partial x_1} & \cdots & \frac{\partial h_m}{\partial x_n} \end{bmatrix}$$

---

## 8.3 The Extended Kalman Filter Algorithmic Cycle

The operational cycle of the EKF preserves the elegant two-phase structure of the linear filter, but with a crucial distinction:
- **State means** are propagated directly through the full nonlinear functions $f(\cdot)$ and $h(\cdot)$.
- **Covariances** are propagated linearly through the local Jacobian matrices $F_k$ and $H_k$.

```
+---------------------------------------------------------------------------------------------------+
|                           EXTENDED KALMAN FILTER (EKF) CYCLE                                      |
+---------------------------------------------------------------------------------------------------+
| 1. PREDICT PHASE (TIME UPDATE):                                                                   |
|    - Prior state mean (Nonlinear):                                                                |
|         \hat{x}_{k|k-1} = f(\hat{x}_{k-1|k-1}, u_{k-1})                                           |
|    - Compute State Jacobian:                                                                      |
|         F_k = \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}, u_{k-1}}           |
|    - Prior covariance (Linearized):                                                               |
|         P_{k|k-1} = F_k P_{k-1|k-1} F_k^T + Q_k                                                  |
|                                                                                                   |
| 2. UPDATE PHASE (MEASUREMENT UPDATE):                                                             |
|    - Compute Measurement Jacobian:                                                                |
|         H_k = \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}}                       |
|    - Innovation residual (Nonlinear):                                                             |
|         y_k = z_k - h(\hat{x}_{k|k-1})                                                            |
|    - Innovation covariance:                                                                       |
|         S_k = H_k P_{k|k-1} H_k^T + R_k                                                           |
|    - Kalman Gain:                                                                                 |
|         K_k = P_{k|k-1} H_k^T S_k^{-1}                                                            |
|    - Posterior state mean:                                                                        |
|         \hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k y_k                                                |
|    - Posterior covariance (Joseph Stabilized Form):                                               |
|         P_{k|k} = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T                        |
+---------------------------------------------------------------------------------------------------+
```

---

## 8.4 Case Study 1: Differential-Drive Mobile Robot Kinematics

Consider a two-wheeled differential drive mobile robot operating in a 2D plane. The state is $x = [p_x, p_y, \theta]^T$, representing position coordinates and heading angle.
Control inputs are forward linear velocity $v_k$ and angular yaw rate $\omega_k$: $u = [v, \omega]^T$.

### 8.4.1 Exact Arc Kinematics vs Small-Angle Euler
Over sampling interval $\Delta t$, if $\omega \neq 0$, the robot moves along a circular arc of radius $R = v/\omega$:
$$f(x, u) = \begin{bmatrix} p_x + \frac{v}{\omega} (\sin(\theta + \omega \Delta t) - \sin\theta) \\ p_y - \frac{v}{\omega} (\cos(\theta + \omega \Delta t) - \cos\theta) \\ \theta + \omega \Delta t \end{bmatrix}$$

For small $\omega \Delta t \ll 1$ (or using the mid-point orientation $\theta + \frac{1}{2}\omega \Delta t$):
$$f(x, u) \approx \begin{bmatrix} p_x + v \Delta t \cos\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ p_y + v \Delta t \sin\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ \theta + \omega \Delta t \end{bmatrix}$$

### 8.4.2 State Jacobian Matrix $F_k$
Differentiating with respect to state $x = [p_x, p_y, \theta]^T$:
$$\frac{\partial f_1}{\partial p_x} = 1, \quad \frac{\partial f_1}{\partial p_y} = 0, \quad \frac{\partial f_1}{\partial \theta} = -v \Delta t \sin\left(\theta + \frac{1}{2}\omega \Delta t\right)$$
$$\frac{\partial f_2}{\partial p_x} = 0, \quad \frac{\partial f_2}{\partial p_y} = 1, \quad \frac{\partial f_2}{\partial \theta} = v \Delta t \cos\left(\theta + \frac{1}{2}\omega \Delta t\right)$$
$$\frac{\partial f_3}{\partial p_x} = 0, \quad \frac{\partial f_3}{\partial p_y} = 0, \quad \frac{\partial f_3}{\partial \theta} = 1$$

$$F_k = \begin{bmatrix} 1 & 0 & -v \Delta t \sin\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ 0 & 1 & v \Delta t \cos\left(\theta + \frac{1}{2}\omega \Delta t\right) \\ 0 & 0 & 1 \end{bmatrix}$$

Notice that heading uncertainty couples directly into position covariance through forward velocity $v$ and the trigonometric terms.

---

## 8.5 Case Study 2: Range-Bearing Radar Sensor Update

Let a stationary radar sensor at the origin $(0, 0)$ observe a target robot at state $x = [p_x, v_x, p_y, v_y]^T$.
The sensor measures range $r$ and bearing angle $\phi$:
$$z_k = h(x_k) + v_k = \begin{bmatrix} \sqrt{p_x^2 + p_y^2} \\ \operatorname{atan2}(p_y, p_x) \end{bmatrix} + v_k$$

### 8.5.1 Measurement Jacobian Matrix $H_k$
Let $\rho = \sqrt{p_x^2 + p_y^2}$ be the Euclidean distance.
1. Differentiating range $h_1 = \sqrt{p_x^2 + p_y^2}$:
   $$\frac{\partial h_1}{\partial p_x} = \frac{p_x}{\sqrt{p_x^2 + p_y^2}} = \frac{p_x}{\rho}, \quad \frac{\partial h_1}{\partial p_y} = \frac{p_y}{\rho}, \quad \frac{\partial h_1}{\partial v_x} = 0, \quad \frac{\partial h_1}{\partial v_y} = 0$$
2. Differentiating bearing $h_2 = \operatorname{atan2}(p_y, p_x)$:
   Recall that $\frac{d}{dx}\operatorname{atan2}(y, x) = -\frac{y}{x^2 + y^2}$ and $\frac{d}{dy}\operatorname{atan2}(y, x) = \frac{x}{x^2 + y^2}$.
   $$\frac{\partial h_2}{\partial p_x} = -\frac{p_y}{\rho^2}, \quad \frac{\partial h_2}{\partial p_y} = \frac{p_x}{\rho^2}, \quad \frac{\partial h_2}{\partial v_x} = 0, \quad \frac{\partial h_2}{\partial v_y} = 0$$

Assembling the $2 \times 4$ Jacobian matrix:
$$H_k = \begin{bmatrix} \frac{p_x}{\rho} & 0 & \frac{p_y}{\rho} & 0 \\ -\frac{p_y}{\rho^2} & 0 & \frac{p_x}{\rho^2} & 0 \end{bmatrix}$$

### 8.5.2 Angle Wrapping: The Silent Filter Killer
When computing the innovation for angular measurements:
$$y_\phi = z_\phi - h_\phi(\hat{x})$$
both $z_\phi$ and $h_\phi$ lie in $[-\pi, \pi]$.
If $z_\phi = +\pi - 0.05$ ($+177^\circ$) and $h_\phi = -\pi + 0.05$ ($-177^\circ$), the true physical difference is only $0.10\text{ rad}$ ($5.7^\circ$).
However, a naive subtraction yields:
$$y_\phi = (+\pi - 0.05) - (-\pi + 0.05) = 2\pi - 0.10 \approx +6.18\text{ rad} \approx +354^\circ!$$
This massive spurious innovation injects an enormous false correction into the state, causing instant filter divergence.

**Strict Mandate:** Every angular innovation **must** be normalized to the interval $[-\pi, \pi]$:
$$y_\phi \leftarrow \operatorname{atan2}(\sin(y_\phi), \cos(y_\phi)) = \operatorname{fmod}(y_\phi + \pi, 2\pi) - \pi$$

---

## 8.6 Pathologies of the Extended Kalman Filter

While computationally efficient ($\mathcal{O}(n^3)$), the EKF exhibits several fundamental theoretical pathologies:

1. **Nonzero Mean Truncation Bias:**
   In truth, $\mathbb{E}[f(x)] \neq f(\mathbb{E}[x])$ for nonlinear functions (Jensen’s inequality). The Taylor approximation discards the second-order Hessian term:
   $$\mathbb{E}[f(x)] \approx f(\hat{x}) + \frac{1}{2} \sum_{i=1}^n e_i \operatorname{tr}\left( \nabla^2 f_i(\hat{x}) P \right)$$
   Discarding this term introduces an unmodeled persistent estimation bias.
2. **False Consistency and Overconfidence:**
   Because the Jacobian $H = \left.\frac{\partial h}{\partial x}\right|_{\hat{x}}$ is evaluated at the estimated state $\hat{x}$ rather than the latent true state $x$, errors in $\hat{x}$ cause $H$ to be miscalculated. In SLAM applications, this creates spurious information along unobservable degrees of freedom (e.g. spurious orientation certainty), causing the filter to become falsely overconfident and diverge.
3. **Singularities in Jacobians:**
   In range-bearing tracking, as the target approaches the origin ($\rho \to 0$), the bearing Jacobian entries $-\frac{p_y}{\rho^2} \to \infty$. The Jacobian becomes unbounded, causing numerical explosion.

---

## 8.7 Mathematical Problem Set

### Problem 8.1 (Worked Example): Complete Range-Bearing EKF Update Step
**Problem Statement:** A 2D tracking system tracks state $x = [p_x, p_y]^T$. Prior estimate and covariance at step $k$ are:
$$\hat{x}_{k|k-1} = \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix}\text{ m}, \quad P_{k|k-1} = \begin{bmatrix} 2.0 & 0.0 \\ 0.0 & 2.0 \end{bmatrix}\text{ m}^2$$
A sensor measures range $r$ and bearing $\phi$:
$$z_k = \begin{bmatrix} 5.2\text{ m} \\ 0.95\text{ rad} \end{bmatrix}$$
with measurement noise covariance $R = \operatorname{diag}(0.1\text{ m}^2, 0.01\text{ rad}^2)$.
1. Compute the predicted measurement $\hat{z}_{k|k-1}$ and innovation $y_k$.
2. Compute the measurement Jacobian $H_k$.
3. Compute the innovation covariance $S_k$ and Kalman gain $K_k$.
4. Compute the posterior state estimate $\hat{x}_{k|k}$ and posterior covariance $P_{k|k}$.

**Step-by-Step Derivation:**
1. Predicted measurement:
   $$\rho = \sqrt{p_x^2 + p_y^2} = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = 5.0\text{ m}$$
   $$\hat{\phi} = \operatorname{atan2}(4.0, 3.0) \approx 0.927295\text{ rad} \approx 53.13^\circ$$
   $$\hat{z}_{k|k-1} = \begin{bmatrix} 5.0 \\ 0.927295 \end{bmatrix}$$
   Innovation:
   $$y_k = z_k - \hat{z}_{k|k-1} = \begin{bmatrix} 5.2 - 5.0 \\ 0.95 - 0.927295 \end{bmatrix} = \begin{bmatrix} 0.20 \\ 0.022705 \end{bmatrix}$$
2. Measurement Jacobian $H_k$:
   $$\frac{p_x}{\rho} = \frac{3}{5} = 0.60, \quad \frac{p_y}{\rho} = \frac{4}{5} = 0.80$$
   $$\rho^2 = 25.0$$
   $$-\frac{p_y}{\rho^2} = -\frac{4}{25} = -0.16\text{ m}^{-1}, \quad \frac{p_x}{\rho^2} = \frac{3}{25} = 0.12\text{ m}^{-1}$$
   $$H_k = \begin{bmatrix} 0.60 & 0.80 \\ -0.16 & 0.12 \end{bmatrix}$$
3. Innovation covariance $S_k = H_k P H_k^T + R$:
   Notice that $P = 2 I_2$, so $H P H^T = 2 H H^T$:
   $$[H H^T]_{11} = 0.6^2 + 0.8^2 = 0.36 + 0.64 = 1.00$$
   $$[H H^T]_{12} = (0.6)(-0.16) + (0.8)(0.12) = -0.096 + 0.096 = 0.00$$
   $$[H H^T]_{22} = (-0.16)^2 + (0.12)^2 = 0.0256 + 0.0144 = 0.040$$
   $$H P H^T = 2 \begin{bmatrix} 1.00 & 0.00 \\ 0.00 & 0.040 \end{bmatrix} = \begin{bmatrix} 2.00 & 0.00 \\ 0.00 & 0.080 \end{bmatrix}$$
   Adding $R = \begin{bmatrix} 0.1 & 0 \\ 0 & 0.01 \end{bmatrix}$:
   $$S_k = \begin{bmatrix} 2.00 + 0.10 & 0.00 \\ 0.00 & 0.080 + 0.010 \end{bmatrix} = \begin{bmatrix} 2.10 & 0.00 \\ 0.00 & 0.090 \end{bmatrix}$$
   Because $S_k$ is diagonal:
   $$S_k^{-1} = \begin{bmatrix} 1/2.1 & 0 \\ 0 & 1/0.09 \end{bmatrix} \approx \begin{bmatrix} 0.476190 & 0 \\ 0 & 11.111111 \end{bmatrix}$$
4. Kalman gain $K_k = P H_k^T S_k^{-1}$:
   $$P H_k^T = 2 \begin{bmatrix} 0.60 & -0.16 \\ 0.80 & 0.12 \end{bmatrix} = \begin{bmatrix} 1.20 & -0.32 \\ 1.60 & 0.24 \end{bmatrix}$$
   $$K_k = \begin{bmatrix} 1.20 & -0.32 \\ 1.60 & 0.24 \end{bmatrix} \begin{bmatrix} 0.476190 & 0 \\ 0 & 11.111111 \end{bmatrix} = \begin{bmatrix} 0.571429 & -3.555556 \\ 0.761905 & 2.666667 \end{bmatrix}$$
5. Posterior state estimate:
   $$\hat{x}_{k|k} = \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix} + \begin{bmatrix} 0.571429 & -3.555556 \\ 0.761905 & 2.666667 \end{bmatrix} \begin{bmatrix} 0.20 \\ 0.022705 \end{bmatrix}$$
   $$\hat{p}_x = 3.0 + 0.571429(0.20) - 3.555556(0.022705) = 3.0 + 0.114286 - 0.080729 = 3.033557\text{ m}$$
   $$\hat{p}_y = 4.0 + 0.761905(0.20) + 2.666667(0.022705) = 4.0 + 0.152381 + 0.060547 = 4.212928\text{ m}$$
6. Posterior covariance:
   $$K_k S_k K_k^T = \begin{bmatrix} 0.5714 & -3.5556 \\ 0.7619 & 2.6667 \end{bmatrix} \begin{bmatrix} 2.1 & 0 \\ 0 & 0.09 \end{bmatrix} K_k^T$$
   $$P_{k|k} = P - K_k S_k K_k^T \approx \begin{bmatrix} 0.1764 & 0.0877 \\ 0.0877 & 0.1415 \end{bmatrix}$$

**Final Result:**
$$\hat{x}_{k|k} = \begin{bmatrix} 3.0336 \\ 4.2129 \end{bmatrix}\text{ m}, \quad P_{k|k} \approx \begin{bmatrix} 0.1764 & 0.0877 \\ 0.0877 & 0.1415 \end{bmatrix}\text{ m}^2$$

---

### Problem 8.2 (Worked Example): Numerical Finite-Difference Jacobian Approximation
**Problem Statement:** In many robotics applications, deriving analytical Jacobians for complex kinematic trees is prone to human algebra errors. Specify the central difference numerical Jacobian approximation formula and determine the optimal perturbation step size $\epsilon$ for 64-bit IEEE double floats ($\epsilon_{\text{mach}} \approx 2.22 \times 10^{-16}$).

**Step-by-Step Derivation:**
1. Central difference formula for column $j$ of Jacobian matrix $J = \frac{\partial g}{\partial x} \in \mathbb{R}^{m \times n}$:
   $$J_{:, j} = \frac{g(x + \epsilon e_j) - g(x - \epsilon e_j)}{2 \epsilon}$$
   where $e_j$ is the $j$-th standard basis vector.
2. Truncation error of central difference:
   By Taylor expansion:
   $$g(x + \epsilon) = g(x) + g'(x)\epsilon + \frac{1}{2} g''(x)\epsilon^2 + \frac{1}{6} g'''(x)\epsilon^3 + \dots$$
   $$g(x - \epsilon) = g(x) - g'(x)\epsilon + \frac{1}{2} g''(x)\epsilon^2 - \frac{1}{6} g'''(x)\epsilon^3 + \dots$$
   Subtracting:
   $$\frac{g(x + \epsilon) - g(x - \epsilon)}{2\epsilon} = g'(x) + \frac{1}{6} g'''(x) \epsilon^2$$
   The truncation error scales as $\mathcal{O}(\epsilon^2)$.
3. Roundoff error in floating-point:
   Evaluating $g(x)$ has relative precision $\epsilon_{\text{mach}}$. Subtracting two values introduces absolute error $\sim \epsilon_{\text{mach}} |g(x)|$.
   Dividing by $2\epsilon$ magnifies the roundoff error to $\frac{\epsilon_{\text{mach}}}{\epsilon}$.
4. Total error:
   $$E(\epsilon) \approx C_1 \epsilon^2 + C_2 \frac{\epsilon_{\text{mach}}}{\epsilon}$$
   Differentiating with respect to $\epsilon$ and setting to zero:
   $$2 C_1 \epsilon - C_2 \frac{\epsilon_{\text{mach}}}{\epsilon^2} = 0 \implies \epsilon^3 \sim \epsilon_{\text{mach}} \implies \epsilon^* \sim \epsilon_{\text{mach}}^{1/3}$$
5. Numerical value for double precision:
   $$\epsilon^* \approx (2.22 \times 10^{-16})^{1/3} \approx 6.06 \times 10^{-6}$$

**Final Result:**
$$\epsilon^* = \epsilon_{\text{mach}}^{1/3} \approx 10^{-6} \implies J_{:, j} \approx \frac{g(x + 10^{-6} e_j) - g(x - 10^{-6} e_j)}{2 \times 10^{-6}}$$

---

### Problem 8.3 (Worked Example): Angle-Wrapping Failure Simulation
**Problem Statement:** An autonomous car has prior heading estimate $\hat{\theta} = -3.10\text{ rad}$ ($-177.62^\circ$) with variance $P_\theta = 0.04\text{ rad}^2$. A compass measures heading $z_\theta = +3.12\text{ rad}$ ($+178.76^\circ$) with variance $R_\theta = 0.01\text{ rad}^2$.
1. Compute the Kalman gain $K_\theta$.
2. Compute the posterior estimate $\hat{\theta}_{\text{naive}}$ without angle wrapping.
3. Compute the posterior estimate $\hat{\theta}_{\text{correct}}$ with proper angle wrapping.

**Step-by-Step Derivation:**
1. Kalman gain:
   $$S = P_\theta + R_\theta = 0.04 + 0.01 = 0.05$$
   $$K_\theta = \frac{P_\theta}{S} = \frac{0.04}{0.05} = 0.80$$
2. Naive computation (no wrapping):
   $$y_{\text{naive}} = z_\theta - \hat{\theta} = 3.12 - (-3.10) = +6.22\text{ rad}$$
   $$\hat{\theta}_{\text{naive}} = \hat{\theta} + K_\theta y_{\text{naive}} = -3.10 + 0.80(6.22) = -3.10 + 4.976 = +1.876\text{ rad} \approx +107.48^\circ!$$
   *Disaster:* The true heading is nearly due West ($180^\circ$). But the naive filter reports heading East-Southeast ($+107^\circ$), an error of over $72^\circ$!
3. Correct computation (with angle wrapping):
   $$y_{\text{raw}} = 6.22\text{ rad}$$
   Wrap to $[-\pi, \pi]$:
   $$y_{\text{wrapped}} = 6.22 - 2\pi = 6.22 - 6.283185 = -0.063185\text{ rad} \approx -3.62^\circ$$
   $$\hat{\theta}_{\text{correct}} = \hat{\theta} + K_\theta y_{\text{wrapped}} = -3.10 + 0.80(-0.063185) = -3.10 - 0.050548 = -3.150548\text{ rad}$$
   Normalize to $[-\pi, \pi]$:
   $$-3.150548 + 2\pi \approx +3.132637\text{ rad} \approx +179.49^\circ$$

**Final Result:**
$$\hat{\theta}_{\text{naive}} = +1.876\text{ rad}\text{ (Catastrophic Failure)}, \quad \hat{\theta}_{\text{correct}} = +3.133\text{ rad}\text{ (Exact Physical Belief)}$$

---

### Problem 8.4 (Worked Example): Jensen's Inequality Bias in Radar Range
**Problem Statement:** A 1D position state $x \sim \mathcal{N}(0, \sigma^2)$ is measured by a range sensor that reports magnitude $z = |x| + v$ or distance from origin $h(x) = \sqrt{x^2} = |x|$.
1. Compute the EKF predicted measurement $\hat{z}_{\text{EKF}} = h(\hat{x})$ when $\hat{x} = 0$.
2. Compute the true expected measurement $\mathbb{E}[h(x)] = \mathbb{E}[|x|]$.
3. Quantify the linearization bias when $\sigma = 2.0\text{ m}$.

**Step-by-Step Derivation:**
1. EKF prediction:
   $$\hat{z}_{\text{EKF}} = h(\mathbb{E}[x]) = h(0) = |0| = 0.0\text{ m}$$
2. True expectation:
   Since $x \sim \mathcal{N}(0, \sigma^2)$, $|x|$ follows a half-normal distribution:
   $$\mathbb{E}[|x|] = \int_{-\infty}^\infty |x| \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{x^2}{2\sigma^2}} dx = 2 \int_0^\infty x \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{x^2}{2\sigma^2}} dx$$
   Substitute $u = \frac{x^2}{2\sigma^2}, du = \frac{x}{\sigma^2} dx$:
   $$\mathbb{E}[|x|] = \frac{2\sigma^2}{\sqrt{2\pi}\sigma} \int_0^\infty e^{-u} du = \sqrt{\frac{2}{\pi}} \sigma \approx 0.797885 \sigma$$
3. For $\sigma = 2.0\text{ m}$:
   $$\mathbb{E}[|x|] = 0.797885 \times 2.0 \approx 1.59577\text{ m}$$
   EKF prediction: $\hat{z}_{\text{EKF}} = 0.0\text{ m}$.
   Bias:
   $$\text{Bias} = \mathbb{E}[h(x)] - h(\mathbb{E}[x]) = 1.5958 - 0.0 = 1.5958\text{ m}$$
   The EKF predicts an observed range of $0\text{ m}$, when on average the sensor will report $1.6\text{ m}$.

**Final Result:**
$$\hat{z}_{\text{EKF}} = 0.0\text{ m}, \quad \mathbb{E}[h(x)] = 1.5958\text{ m} \quad (\text{Linearization Bias} = 1.5958\text{ m})$$

---

### Problem 8.5 (Worked Example): Jacobian of Dubins Airplane Kinematics
**Problem Statement:** A 3D fixed-wing drone follows Dubins kinematics with airspeed $V$, flight path angle $\gamma$, and yaw rate $\omega$:
$$\dot{x} = V \cos\theta \cos\gamma, \quad \dot{y} = V \sin\theta \cos\gamma, \quad \dot{z} = V \sin\gamma, \quad \dot{\theta} = \omega$$
Derive the continuous Jacobian matrix $A = \frac{\partial f}{\partial [x, y, z, \theta]^T}$.

**Step-by-Step Derivation:**
1. State vector $X = [x, y, z, \theta]^T \in \mathbb{R}^4$.
2. Compute partial derivatives for each component:
   - For $\dot{x} = V \cos\theta \cos\gamma$:
     $$\frac{\partial \dot{x}}{\partial x} = 0, \quad \frac{\partial \dot{x}}{\partial y} = 0, \quad \frac{\partial \dot{x}}{\partial z} = 0, \quad \frac{\partial \dot{x}}{\partial \theta} = -V \sin\theta \cos\gamma$$
   - For $\dot{y} = V \sin\theta \cos\gamma$:
     $$\frac{\partial \dot{y}}{\partial x} = 0, \quad \frac{\partial \dot{y}}{\partial y} = 0, \quad \frac{\partial \dot{y}}{\partial z} = 0, \quad \frac{\partial \dot{y}}{\partial \theta} = V \cos\theta \cos\gamma$$
   - For $\dot{z} = V \sin\gamma$:
     $$\frac{\partial \dot{z}}{\partial x} = 0, \quad \frac{\partial \dot{z}}{\partial y} = 0, \quad \frac{\partial \dot{z}}{\partial z} = 0, \quad \frac{\partial \dot{z}}{\partial \theta} = 0$$
   - For $\dot{\theta} = \omega$:
     $$\frac{\partial \dot{\theta}}{\partial x} = 0, \quad \frac{\partial \dot{\theta}}{\partial y} = 0, \quad \frac{\partial \dot{\theta}}{\partial z} = 0, \quad \frac{\partial \dot{\theta}}{\partial \theta} = 0$$
3. Assembling $4 \times 4$ continuous Jacobian $A$:
   $$A = \begin{bmatrix} 0 & 0 & 0 & -V \sin\theta \cos\gamma \\ 0 & 0 & 0 & V \cos\theta \cos\gamma \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}$$

**Final Result:**
$$A = \begin{bmatrix} 0 & 0 & 0 & -V \sin\theta \cos\gamma \\ 0 & 0 & 0 & V \cos\theta \cos\gamma \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}$$

---

### Problem 8.6 (Worked Example): Analytical vs Numerical Jacobian Verification
**Problem Statement:** For the range-bearing measurement function $h(x) = [\sqrt{x^2 + y^2}, \operatorname{atan2}(y, x)]^T$ evaluated at $(x, y) = (3.0, 4.0)$, compute the central difference numerical Jacobian with step size $\epsilon = 10^{-6}$ and compare each entry against the analytical Jacobian from Problem 8.1.

**Step-by-Step Derivation:**
1. Perturbations in $x$:
   $$x^+ = 3.0 + 10^{-6}, \quad x^- = 3.0 - 10^{-6}, \quad y = 4.0$$
   - Range:
     $$h_1(x^+, 4.0) = \sqrt{(3.000001)^2 + 16} = \sqrt{9.000006 + 16} = \sqrt{25.000006} \approx 5.000000600$$
     $$h_1(x^-, 4.0) = \sqrt{(2.999999)^2 + 16} = \sqrt{8.999994 + 16} = \sqrt{24.999994} \approx 4.999999400$$
     $$\frac{\partial h_1}{\partial x} \approx \frac{5.000000600 - 4.999999400}{2 \times 10^{-6}} = \frac{1.200 \times 10^{-6}}{2 \times 10^{-6}} = 0.600000000$$
     Analytical value: $3/5 = 0.600000000$. Error: $< 10^{-12}$.
   - Bearing:
     $$h_2(x^+, 4.0) = \operatorname{atan2}(4.0, 3.000001) \approx 0.927295058$$
     $$h_2(x^-, 4.0) = \operatorname{atan2}(4.0, 2.999999) \approx 0.927295378$$
     $$\frac{\partial h_2}{\partial x} \approx \frac{0.927295058 - 0.927295378}{2 \times 10^{-6}} = \frac{-0.320 \times 10^{-6}}{2 \times 10^{-6}} = -0.160000000$$
     Analytical value: $-4/25 = -0.160000000$. Error: $< 10^{-12}$.

**Final Result:**
Numerical Jacobian matches analytical Jacobian to 9 decimal places.

---

### Problem 8.7 (Worked Example): High-Curvature Nonlinear Divergence Case Study
**Problem Statement:** Consider a scalar state with cubic dynamics $x_k = x_{k-1}^3 + w_k$ and direct linear observation $z_k = x_k + v_k$. If true state is $x_0 = 1.5$ and the filter is initialized with $\hat{x}_0 = 0.5$ and $P_0 = 0.1$, show how the EKF predicts the state and explain why divergence occurs.

**Step-by-Step Derivation:**
1. State propagation:
   True state at $k=1$: $x_1 = (1.5)^3 = 3.375$.
2. EKF predicted state:
   $$\hat{x}_{1|0} = f(\hat{x}_0) = (0.5)^3 = 0.125$$
3. Jacobian of $f(x) = x^3$:
   $$F = \left.\frac{\partial f}{\partial x}\right|_{\hat{x}_0} = 3 \hat{x}_0^2 = 3(0.5)^2 = 0.75$$
4. Covariance prediction (assume $Q = 0.01$):
   $$P_{1|0} = F^2 P_0 + Q = (0.75)^2 (0.1) + 0.01 = 0.5625(0.1) + 0.01 = 0.06625$$
5. Failure analysis:
   Notice that the Jacobian at $\hat{x}_0 = 0.5$ was $F = 0.75 < 1.0$. The filter believed the system was *contractive*, shrinking covariance from $0.1$ to $0.066$.
   However, around the true state $x_0 = 1.5$, the true Jacobian is $3(1.5)^2 = 6.75 \gg 1.0$, which is *explosively expansive*!
   The EKF severely underestimates its uncertainty, causing the Kalman gain to remain small and the filter to diverge completely.

**Final Result:**
$$\text{Linearized }F = 0.75\text{ (Contractive)} \neq \text{True }F = 6.75\text{ (Explosive)} \implies \mathbf{Severe\ EKF\ Divergence}$$

---

### Problem 8.8 (Worked Example): Iterated Extended Kalman Filter (IEKF) Formulation
**Problem Statement:** In systems with highly nonlinear measurement equations $h(x)$, the standard EKF linearizes once at $\hat{x}_{k|k-1}$. The Iterated EKF (IEKF) performs a Gauss-Newton optimization loop to re-linearize $h(x)$ around updated estimates. Write the exact mathematical iteration for the IEKF measurement update.

**Step-by-Step Derivation:**
1. Initialize iteration index $i = 0$:
   $$\eta_0 = \hat{x}_{k|k-1}$$
2. For iteration $i = 0, 1, \dots, N_{\max}-1$:
   - Evaluate measurement Jacobian at current iterate:
     $$H_i = \left. \frac{\partial h}{\partial x} \right|_{\eta_i}$$
   - Compute iterate innovation covariance:
     $$S_i = H_i P_{k|k-1} H_i^T + R_k$$
   - Compute iterate gain:
     $$K_i = P_{k|k-1} H_i^T S_i^{-1}$$
   - Update state iterate:
     $$\eta_{i+1} = \hat{x}_{k|k-1} + K_i \left[ z_k - h(\eta_i) - H_i (\hat{x}_{k|k-1} - \eta_i) \right]$$
   - Convergence check: if $\|\eta_{i+1} - \eta_i\| < \epsilon$, break.
3. Final update:
   $$\hat{x}_{k|k} = \eta_{\text{final}}$$
   $$P_{k|k} = (I - K_{\text{final}} H_{\text{final}}) P_{k|k-1} (I - K_{\text{final}} H_{\text{final}})^T + K_{\text{final}} R K_{\text{final}}^T$$

**Final Result:**
The IEKF solves the maximum a posteriori (MAP) optimization problem via Gauss-Newton, eliminating first-order measurement linearization error.

---

### Problem 8.9 (Worked Example): Perspective Camera Projection Jacobian
**Problem Statement:** A pinhole camera with focal length $f$ observes a 3D point $X = [X, Y, Z]^T$ in camera coordinates. The pixel projection is:
$$u = f \frac{X}{Z}, \quad v = f \frac{Y}{Z}$$
Derive the $2 \times 3$ measurement Jacobian $H = \frac{\partial [u, v]^T}{\partial [X, Y, Z]^T}$.

**Step-by-Step Derivation:**
1. Differentiating $u = f X Z^{-1}$:
   $$\frac{\partial u}{\partial X} = \frac{f}{Z}, \quad \frac{\partial u}{\partial Y} = 0, \quad \frac{\partial u}{\partial Z} = -\frac{f X}{Z^2}$$
2. Differentiating $v = f Y Z^{-1}$:
   $$\frac{\partial v}{\partial X} = 0, \quad \frac{\partial v}{\partial Y} = \frac{f}{Z}, \quad \frac{\partial v}{\partial Z} = -\frac{f Y}{Z^2}$$
3. Assembling the Jacobian matrix:
   $$H = \begin{bmatrix} \frac{f}{Z} & 0 & -\frac{f X}{Z^2} \\ 0 & \frac{f}{Z} & -\frac{f Y}{Z^2} \end{bmatrix} = \frac{1}{Z} \begin{bmatrix} f & 0 & -u \\ 0 & f & -v \end{bmatrix}$$

**Final Result:**
$$H = \begin{bmatrix} \frac{f}{Z} & 0 & -\frac{f X}{Z^2} \\ 0 & \frac{f}{Z} & -\frac{f Y}{Z^2} \end{bmatrix}$$

---

### Problem 8.10 (Worked Example): Loss of S-Matrix Invertibility near Singularities
**Problem Statement:** In a polar coordinate tracking system, bearing measurement noise variance is $R_\phi = 0.01\text{ rad}^2$. Prior position covariance is $P = \sigma^2 I_2$ with $\sigma = 1.0\text{ m}$. Compute the bearing innovation variance $S_\phi$ as the estimated distance to origin $\rho \to 0$.

**Step-by-Step Derivation:**
1. Bearing Jacobian vector from Problem 8.1:
   $$H_\phi = \begin{bmatrix} -\frac{p_y}{\rho^2} & \frac{p_x}{\rho^2} \end{bmatrix}$$
2. Innovation variance:
   $$S_\phi = H_\phi P H_\phi^T + R_\phi = \sigma^2 H_\phi H_\phi^T + R_\phi$$
3. Inner product $H_\phi H_\phi^T$:
   $$H_\phi H_\phi^T = \left(-\frac{p_y}{\rho^2}\right)^2 + \left(\frac{p_x}{\rho^2}\right)^2 = \frac{p_y^2 + p_x^2}{\rho^4} = \frac{\rho^2}{\rho^4} = \frac{1}{\rho^2}$$
4. Innovation variance:
   $$S_\phi = \frac{\sigma^2}{\rho^2} + R_\phi = \frac{1.0}{\rho^2} + 0.01$$
5. Limit as $\rho \to 0$:
   $$\lim_{\rho \to 0} S_\phi = \lim_{\rho \to 0} \left(\frac{1.0}{\rho^2} + 0.01\right) = +\infty$$
   As $\rho \to 0$, $S_\phi \to \infty$, and the Kalman gain $K_\phi = P H_\phi^T S_\phi^{-1} \to 0$. The filter becomes completely paralyzed and loses numerical conditioning.

**Final Result:**
$$S_\phi = \frac{\sigma^2}{\rho^2} + R_\phi \to \infty\text{ as }\rho \to 0$$

---

### Problem 8.11 (Solved Exercise): Jacobian of Unicycle Heading Model
**Problem Statement:** For a unicycle robot state $[x, y, \theta]^T$ moving with constant speed $v$ and turn rate $\omega = 0$, evaluate the state transition Jacobian $F$ for $\Delta t = 0.1\text{ s}$ at $\theta = 0, \pi/2, \pi$.

**Step-by-Step Solution:**
1. From Section 8.4:
   $$F = \begin{bmatrix} 1 & 0 & -v \Delta t \sin\theta \\ 0 & 1 & v \Delta t \cos\theta \\ 0 & 0 & 1 \end{bmatrix}$$
2. At $\theta = 0$:
   $$F = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0.1 v \\ 0 & 0 & 1 \end{bmatrix}$$
3. At $\theta = \pi/2$:
   $$F = \begin{bmatrix} 1 & 0 & -0.1 v \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
4. At $\theta = \pi$:
   $$F = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & -0.1 v \\ 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
Transition matrices derived analytically for each cardinal heading.

---

### Problem 8.12 (Solved Exercise): 3D Range Measurement Jacobian
**Problem Statement:** A 3D beacon at $(x_b, y_b, z_b) = (10, 0, 0)$ measures Euclidean distance to a drone at $(p_x, p_y, p_z)$. Evaluate $H = \frac{\partial \rho}{\partial [p_x, p_y, p_z]}$ at drone position $(2, 6, 0)$.

**Step-by-Step Solution:**
1. Range formula:
   $$\rho = \sqrt{(p_x - x_b)^2 + (p_y - y_b)^2 + (p_z - z_b)^2}$$
2. Numerical coordinates:
   $$\Delta x = 2 - 10 = -8, \quad \Delta y = 6 - 0 = 6, \quad \Delta z = 0 - 0 = 0$$
   $$\rho = \sqrt{(-8)^2 + 6^2 + 0} = \sqrt{64 + 36} = \sqrt{100} = 10.0\text{ m}$$
3. Gradient:
   $$\frac{\partial \rho}{\partial p_x} = \frac{\Delta x}{\rho} = \frac{-8}{10} = -0.80$$
   $$\frac{\partial \rho}{\partial p_y} = \frac{\Delta y}{\rho} = \frac{6}{10} = 0.60$$
   $$\frac{\partial \rho}{\partial p_z} = \frac{\Delta z}{\rho} = \frac{0}{10} = 0.00$$

**Final Answer:**
$$H = \begin{bmatrix} -0.80 & 0.60 & 0.00 \end{bmatrix}$$

---

### Problem 8.13 (Solved Exercise): Second-Order Truncation Bound
**Problem Statement:** For a scalar measurement $h(x) = x^2$ with prior distribution $x \sim \mathcal{N}(\mu, \sigma^2)$, compute the exact error of the first-order Taylor approximation $h_{\text{linear}}(x) = \mu^2 + 2\mu(x - \mu)$ in expected value.

**Step-by-Step Solution:**
1. True expectation:
   $$\mathbb{E}[h(x)] = \mathbb{E}[x^2] = \mu^2 + \sigma^2$$
2. Linearized expectation:
   $$\mathbb{E}[h_{\text{linear}}(x)] = \mu^2 + 2\mu(\mathbb{E}[x] - \mu) = \mu^2 + 2\mu(0) = \mu^2$$
3. Truncation error:
   $$\text{Error} = \mathbb{E}[h(x)] - \mathbb{E}[h_{\text{linear}}(x)] = (\mu^2 + \sigma^2) - \mu^2 = \sigma^2$$
4. The truncation error equals the state variance $\sigma^2$ regardless of $\mu$.

**Final Answer:**
$$\text{Expected Truncation Error} = \sigma^2$$

---

### Problem 8.14 (Solved Exercise): Complex Step Differentiation for EKF Jacobians
**Problem Statement:** Explain the complex step differentiation method $g'(x) \approx \frac{\operatorname{Im}(g(x + i h))}{h}$ and prove that it suffers zero subtractive cancellation error compared to finite differences.

**Step-by-Step Solution:**
1. Expand $g(x + i h)$ in complex Taylor series:
   $$g(x + i h) = g(x) + i h g'(x) - \frac{h^2}{2} g''(x) - i \frac{h^3}{6} g'''(x) + \dots$$
2. Take the imaginary part:
   $$\operatorname{Im}(g(x + i h)) = h g'(x) - \frac{h^3}{6} g'''(x) + \dots$$
3. Divide by $h$:
   $$\frac{\operatorname{Im}(g(x + i h))}{h} = g'(x) - \frac{h^2}{6} g'''(x) + \dots$$
4. Notice that unlike finite difference $(g(x+h) - g(x))/h$, there is **no subtraction** of two function evaluations! Subtractive cancellation is mathematically impossible. One can set $h = 10^{-100}$ and achieve machine precision accuracy ($\sim 10^{-16}$) for the derivative. $\blacksquare$

---

### Problem 8.15 (Solved Exercise): GPS Pseudorange Jacobian
**Problem Statement:** A GPS receiver at position $x_r = [x, y, z]^T$ with clock bias $c \delta t$ observes satellite $s$ at $x_s = [x_s, y_s, z_s]^T$. Pseudorange is $\rho_s = \|x_r - x_s\| + c \delta t$. Derive the Jacobian row with respect to state $[x, y, z, c \delta t]^T$.

**Step-by-Step Solution:**
1. State is $X = [x, y, z, c \delta t]^T \in \mathbb{R}^4$.
2. Let $r = \sqrt{(x - x_s)^2 + (y - y_s)^2 + (z - z_s)^2}$ be the geometric range.
3. Partial derivatives:
   $$\frac{\partial \rho_s}{\partial x} = \frac{x - x_s}{r}, \quad \frac{\partial \rho_s}{\partial y} = \frac{y - y_s}{r}, \quad \frac{\partial \rho_s}{\partial z} = \frac{z - z_s}{r}, \quad \frac{\partial \rho_s}{\partial (c \delta t)} = 1$$
4. Let $u_s = \frac{x_r - x_s}{r}$ be the unit line-of-sight vector pointing from the satellite to the receiver.
   $$H_s = \begin{bmatrix} u_{s, x} & u_{s, y} & u_{s, z} & 1 \end{bmatrix}$$

**Final Answer:**
$$H_s = \begin{bmatrix} \frac{x - x_s}{r} & \frac{y - y_s}{r} & \frac{z - z_s}{r} & 1 \end{bmatrix}$$

---

### Problem 8.16 (Solved Exercise): Innovation Gating in Nonlinear Updates
**Problem Statement:** Why must Normalized Innovation Squared (NIS) gating $\epsilon = y_k^T S_k^{-1} y_k \le \chi^2_{\text{thresh}}$ be performed *after* angle wrapping is applied to the innovation $y_k$?

**Step-by-Step Solution:**
1. If angle wrapping is omitted, an innovation can take false values around $2\pi \approx 6.28\text{ rad}$.
2. For angular variance $S = 0.01\text{ rad}^2$, unwrapped NIS would be:
   $$\epsilon_{\text{unwrapped}} = \frac{(6.28)^2}{0.01} = \frac{39.44}{0.01} = 3944$$
3. Since $\chi^2(1)_{0.99} \approx 6.63$, the filter would falsely detect an extreme $3900\sigma$ sensor failure and reject a perfectly valid measurement.
4. Wrapping ensures $y \in [-\pi, \pi]$, yielding true physical Mahalanobis distances. $\blacksquare$

---

### Problem 8.17 (Solved Exercise): Non-Positive Definite Posterior in High-Curvature EKF
**Problem Statement:** In an EKF running standard update $P^+ = (I - K H) P^-$, roundoff error with large Jacobian entries produces $P^+ = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}$. Verify that $P^+$ has a negative eigenvalue and explain how the Joseph form prevents this.

**Step-by-Step Solution:**
1. Characteristic polynomial of $P^+$:
   $$\det(\lambda I - P^+) = (\lambda - 1)^2 - 4 = 0 \implies \lambda - 1 = \pm 2 \implies \lambda_1 = 3, \lambda_2 = -1$$
   The eigenvalue $\lambda_2 = -1$ is strictly negative.
2. In contrast, the Joseph update computes:
   $$P_{\text{Joseph}} = M P^- M^T + K R K^T$$
   which is the sum of two congruence transformations of positive semi-definite matrices. For any vector $z$: $z^T P_{\text{Joseph}} z \ge 0$, mathematically preventing negative eigenvalues. $\blacksquare$

---

### Problem 8.18 (Solved Exercise): Doppler Radar Radial Velocity Jacobian
**Problem Statement:** A radar measures radial velocity $\dot{\rho} = \frac{p_x v_x + p_y v_y}{\sqrt{p_x^2 + p_y^2}}$ of state $[p_x, p_y, v_x, v_y]^T$. Compute $\frac{\partial \dot{\rho}}{\partial v_x}$ and $\frac{\partial \dot{\rho}}{\partial v_y}$.

**Step-by-Step Solution:**
1. Radial velocity is linear in velocity variables $(v_x, v_y)$:
   $$\dot{\rho} = \left(\frac{p_x}{\rho}\right) v_x + \left(\frac{p_y}{\rho}\right) v_y$$
2. Direct differentiation yields:
   $$\frac{\partial \dot{\rho}}{\partial v_x} = \frac{p_x}{\rho}, \quad \frac{\partial \dot{\rho}}{\partial v_y} = \frac{p_y}{\rho}$$

**Final Answer:**
$$\frac{\partial \dot{\rho}}{\partial [v_x, v_y]} = \begin{bmatrix} \frac{p_x}{\rho} & \frac{p_y}{\rho} \end{bmatrix}$$

---

### Problem 8.19 (Solved Exercise): Condition for EKF Asymptotic Stability
**Problem Statement:** What mathematical conditions on the Jacobian matrices $F_k$ and $H_k$ along the true state trajectory guarantee exponential stability of the EKF?

**Step-by-Step Solution:**
By the Boutayeb and Darouach theorem (1997):
1. The Jacobians $F_k$ and $H_k$ must be uniformly bounded: $\|F_k\| \le \bar{f}, \|H_k\| \le \bar{h}$.
2. The pair $(F_k, H_k)$ must be uniformly completely observable:
   $$\sum_{i=k}^{k+N} \Phi^T(i, k) H_i^T R_i^{-1} H_i \Phi(i, k) \ge \alpha I > 0$$
3. The initial error $\|\tilde{x}_0\|$ and noise bounds must be sufficiently small such that higher-order Taylor terms remain dominated by linear contraction. $\blacksquare$

---

### Problem 8.20 (Solved Exercise): Jacobian Sparsity in Landmark SLAM
**Problem Statement:** In a 2D SLAM system with robot pose $[x_r, y_r, \theta_r]$ and $M = 100$ 2D landmark positions $[l_{1x}, l_{1y}, \dots, l_{Mx}, l_{My}]$, total state dimension is $n = 3 + 200 = 203$. When observing landmark $j$, how many non-zero entries exist in the $2 \times 203$ Jacobian matrix $H$?

**Step-by-Step Solution:**
1. The observation depends strictly on robot pose $(x_r, y_r, \theta_r)$ and the single observed landmark $(l_{jx}, l_{jy})$:
   $$z = h(x_r, y_r, \theta_r, l_{jx}, l_{jy})$$
2. All partial derivatives with respect to the other 99 landmarks are identically zero:
   $$\frac{\partial h}{\partial l_{ix}} = 0, \quad \frac{\partial h}{\partial l_{iy}} = 0 \quad \forall \, i \neq j$$
3. Active columns in $H$:
   - Robot pose: columns 1, 2, 3 (3 columns).
   - Landmark $j$: columns $3 + 2j - 1$ and $3 + 2j$ (2 columns).
4. Total non-zero columns: $3 + 2 = 5$ columns out of 203.
   Total non-zero entries in $2 \times 203$ matrix: $2 \times 5 = 10$ entries.
   Sparsity: $\frac{203 \times 2 - 10}{203 \times 2} = \frac{396}{406} \approx 97.54\%$ sparse.

**Final Answer:**
$$\text{Non-zero entries} = 10\text{ (Sparsity } = 97.54\%)$$


---

# Chapter 9: The Unscented Kalman Filter (UKF) and Sigma-Point Transforms

## 9.1 Introduction: Beyond the Tyranny of Jacobians

In 1997, Jeffrey K. Julier and Jeffrey K. Uhlmann published a foundational insight that revolutionized nonlinear stochastic state estimation:

> *"It is easier to approximate a probability distribution than it is to approximate an arbitrary nonlinear function or transformation."*

The Extended Kalman Filter linearizes nonlinear dynamics by taking analytical or numerical Jacobians at a single point: the mean estimate. This first-order truncation discards all higher-order derivatives (Hessians, cubics), introducing severe estimation biases and often causing catastrophic divergence under high uncertainty or sharp geometric curvature.

The **Unscented Kalman Filter (UKF)** completely abandons analytical differentiation. Instead, it employs the **Unscented Transform (UT)**: a deterministic sampling methodology that captures the exact mean and covariance of a random vector using a minimal set of $2n+1$ intelligently chosen **sigma points**. When propagated through the true, unlinearized nonlinear equations, these sigma points capture the posterior mean and covariance with **third-order Taylor series accuracy** for Gaussian distributions, compared to merely first-order accuracy in the EKF.

In this chapter, we derive the mathematical mechanics of the Merwe scaled unscented transform, master the Cholesky matrix square root computation, prove third-order accuracy via multivariable Taylor expansions, develop specialized methods for angular states on manifolds, and solve 20 rigorous problems.

---

## 9.2 The Scaled Unscented Transform Mechanics

Let $x \in \mathbb{R}^n$ be a random vector with mean $\bar{x} \in \mathbb{R}^n$ and covariance $P \in \mathbb{S}_{++}^n$. We wish to propagate $x$ through an arbitrary nonlinear vector transformation $y = g(x) \in \mathbb{R}^m$.

### 9.2.1 Deterministic Sigma-Point Generation
The Scaled Unscented Transform deterministically constructs a set of $2n+1$ weighted sigma points $\mathcal{X}_i \in \mathbb{R}^n$ ($i = 0, \dots, 2n$):

$$\mathcal{X}_0 = \bar{x}$$
$$\mathcal{X}_i = \bar{x} + \left( \sqrt{(n + \lambda) P} \right)_i, \quad i = 1, \dots, n$$
$$\mathcal{X}_{i+n} = \bar{x} - \left( \sqrt{(n + \lambda) P} \right)_i, \quad i = 1, \dots, n$$

where:
- $\left( \sqrt{(n + \lambda) P} \right)_i$ denotes the $i$-th column of the lower-triangular matrix square root $L$, computed via Cholesky decomposition:
  $$L L^T = (n + \lambda) P$$
- $\lambda = \alpha^2 (n + \kappa) - n$ is the composite scaling parameter.
- $\alpha \in (0, 1]$ controls the spread of the sigma points around $\bar{x}$ (typically $\alpha = 10^{-3}$ or $\alpha = 1.0$). Small $\alpha$ prevents sampling points far from the mean, avoiding non-local nonlinearities.
- $\kappa \ge 0$ is a secondary scaling parameter (typically $\kappa = 0$ or $\kappa = 3 - n$).
- $\beta \ge 0$ incorporates prior knowledge of the distribution higher moments ($\beta = 2.0$ is mathematically optimal for Gaussian distributions).

### 9.2.2 Weighting Coefficients
Each sigma point $\mathcal{X}_i$ is assigned two scalar weights: $W_i^{(m)}$ for calculating the mean, and $W_i^{(c)}$ for calculating the covariance:

For the central point ($i = 0$):
$$W_0^{(m)} = \frac{\lambda}{n + \lambda}$$
$$W_0^{(c)} = \frac{\lambda}{n + \lambda} + (1 - \alpha^2 + \beta)$$

For the remaining symmetric pairs ($i = 1, \dots, 2n$):
$$W_i^{(m)} = W_i^{(c)} = \frac{1}{2(n + \lambda)}$$

### 9.2.3 Fundamental Weight Invariants
Notice that the sum of the mean weights satisfies:
$$\sum_{i=0}^{2n} W_i^{(m)} = \frac{\lambda}{n + \lambda} + 2n \left(\frac{1}{2(n + \lambda)}\right) = \frac{\lambda + n}{n + \lambda} = 1.0$$
Similarly, $\sum_{i=0}^{2n} W_i^{(c)} = 1.0 + (1 - \alpha^2 + \beta)$.

---

## 9.3 Nonlinear Propagation and Statistical Recombination

Once the $2n+1$ sigma points are generated, each point is passed individually through the full nonlinear vector function:

$$\mathcal{Y}_i = g(\mathcal{X}_i), \quad i = 0, \dots, 2n$$

No Jacobians, partial derivatives, or approximations of $g(\cdot)$ are evaluated.

### 9.3.1 Posterior Mean and Covariance Reconstruction
The transformed mean vector $\bar{y} \in \mathbb{R}^m$ and covariance matrix $P_y \in \mathbb{S}_+^m$ are computed by weighted summation:

$$\bar{y} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{Y}_i$$
$$P_y = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{Y}_i - \bar{y}) (\mathcal{Y}_i - \bar{y})^T$$

Furthermore, the cross-covariance matrix between the input state and output measurement is:
$$P_{xy} = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{X}_i - \bar{x}) (\mathcal{Y}_i - \bar{y})^T \in \mathbb{R}^{n \times m}$$

---

## 9.4 The Complete UKF Algorithmic Cycle

For a nonlinear stochastic discrete system:
$$x_k = f(x_{k-1}, u_{k-1}) + w_k, \quad w_k \sim \mathcal{N}(0, Q_k)$$
$$z_k = h(x_k) + v_k, \quad v_k \sim \mathcal{N}(0, R_k)$$

```
+---------------------------------------------------------------------------------------------------+
|                        UNSCENTED KALMAN FILTER (UKF) CYCLE                                        |
+---------------------------------------------------------------------------------------------------+
| 1. PREDICT PHASE:                                                                                 |
|    a. Generate 2n+1 sigma points from prior:                                                      |
|       \mathcal{X}_{k-1|k-1}^{(i)} from (\hat{x}_{k-1|k-1}, P_{k-1|k-1})                           |
|    b. Propagate sigma points through nonlinear dynamics:                                          |
|       \mathcal{X}_{k|k-1}^{*(i)} = f(\mathcal{X}_{k-1|k-1}^{(i)}, u_{k-1})                        |
|    c. Recombine predicted state mean and covariance:                                              |
|       \hat{x}_{k|k-1} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{X}_{k|k-1}^{*(i)}                     |
|       P_{k|k-1}       = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{X}^{*(i)} - \hat{x})                 |
|                                                  (\mathcal{X}^{*(i)} - \hat{x})^T + Q_k           |
|                                                                                                   |
| 2. UPDATE PHASE:                                                                                  |
|    a. Re-sample sigma points from (\hat{x}_{k|k-1}, P_{k|k-1}):                                   |
|       \mathcal{X}_{k|k-1}^{(i)} (or reuse dynamic points)                                         |
|    b. Propagate sigma points through nonlinear measurement function:                              |
|       \mathcal{Z}_k^{(i)} = h(\mathcal{X}_{k|k-1}^{(i)})                                          |
|    c. Predicted measurement mean and innovation covariance:                                       |
|       \hat{z}_{k|k-1} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{Z}_k^{(i)}                            |
|       S_k             = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{Z}^{(i)} - \hat{z})                   |
|                                                  (\mathcal{Z}^{(i)} - \hat{z})^T + R_k            |
|    d. State-Measurement Cross-Covariance:                                                         |
|       P_{xz, k}       = \sum_{i=0}^{2n} W_i^{(c)} (\mathcal{X}^{(i)} - \hat{x})                  |
|                                                  (\mathcal{Z}^{(i)} - \hat{z})^T                  |
|    e. Kalman Gain and Measurement Update:                                                         |
|       K_k             = P_{xz, k} S_k^{-1}                                                        |
|       \hat{x}_{k|k}   = \hat{x}_{k|k-1} + K_k (z_k - \hat{z}_{k|k-1})                             |
|       P_{k|k}         = P_{k|k-1} - K_k S_k K_k^T                                                 |
+---------------------------------------------------------------------------------------------------+
```

---

## 9.5 Mathematical Proof: 3rd-Order Taylor Accuracy of the Unscented Transform

To understand why the UKF drastically outperforms the EKF, we compare the Taylor series expansion of the true posterior mean against the UKF sigma-point mean.

### 9.5.1 True Mean Expansion
Let $x = \bar{x} + \delta x$ where $\mathbb{E}[\delta x] = 0$ and $\mathbb{E}[\delta x \delta x^T] = P$.
Expand $g(x)$ in a multivariable Taylor series around $\bar{x}$:
$$g(x) = g(\bar{x}) + \nabla g \cdot \delta x + \frac{1}{2} D_{\delta x}^2 g + \frac{1}{6} D_{\delta x}^3 g + \frac{1}{24} D_{\delta x}^4 g + \dots$$
Taking the expectation:
$$\mathbb{E}[g(x)] = g(\bar{x}) + \nabla g \cdot \mathbb{E}[\delta x] + \frac{1}{2} \mathbb{E}[D_{\delta x}^2 g] + \frac{1}{6} \mathbb{E}[D_{\delta x}^3 g] + \dots$$

Since the prior distribution is Gaussian:
- $\mathbb{E}[\delta x] = 0$ (first moment vanishes).
- $\mathbb{E}[D_{\delta x}^3 g] = 0$ (all odd central moments of a Gaussian vanish identically).
- $\frac{1}{2} \mathbb{E}[D_{\delta x}^2 g] = \frac{1}{2} \sum_{i,j} \frac{\partial^2 g}{\partial x_i \partial x_j} P_{ij} = \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P)$.

Thus, the exact true mean is:
$$\bar{y}_{\text{true}} = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + \mathcal{O}(D^4)$$

### 9.5.2 EKF Mean Approximation
The EKF linearizes at $\bar{x}$:
$$\bar{y}_{\text{EKF}} = g(\bar{x})$$
**Error:** $\bar{y}_{\text{true}} - \bar{y}_{\text{EKF}} = \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) = \mathcal{O}(\|P\|)$. The EKF has a non-zero error at the 2nd order!

### 9.5.3 UKF Mean Approximation
Expand the sigma points $\mathcal{X}_i = \bar{x} + \Delta x_i$ where $\Delta x_0 = 0$, $\Delta x_i = \sigma_i$, $\Delta x_{i+n} = -\sigma_i$:
$$\mathcal{Y}_i = g(\bar{x} + \Delta x_i) = g(\bar{x}) + \nabla g \cdot \Delta x_i + \frac{1}{2} \Delta x_i^T \nabla^2 g \, \Delta x_i + \frac{1}{6} D_{\Delta x_i}^3 g + \dots$$

Form the weighted sum $\bar{y}_{\text{UKF}} = \sum_{i=0}^{2n} W_i^{(m)} \mathcal{Y}_i$:
$$\bar{y}_{\text{UKF}} = \left(\sum W_i^{(m)}\right) g(\bar{x}) + \nabla g \sum W_i^{(m)} \Delta x_i + \frac{1}{2} \sum W_i^{(m)} \Delta x_i^T \nabla^2 g \, \Delta x_i + \frac{1}{6} \sum W_i^{(m)} D_{\Delta x_i}^3 g + \dots$$

1. $\sum W_i^{(m)} = 1.0$.
2. Because sigma points are symmetric pairs ($\Delta x_{i+n} = -\Delta x_i$ with equal weights), the odd sum vanishes identically:
   $$\sum_{i=0}^{2n} W_i^{(m)} \Delta x_i = W_0 (0) + \sum_{i=1}^n \frac{1}{2(n+\lambda)} (\sigma_i - \sigma_i) = 0$$
3. For the second-order term:
   $$\sum_{i=0}^{2n} W_i^{(m)} \Delta x_i \Delta x_i^T = 2 \sum_{i=1}^n \frac{1}{2(n+\lambda)} \sigma_i \sigma_i^T = \frac{1}{n+\lambda} \sum_{i=1}^n (\sqrt{(n+\lambda)P})_i (\sqrt{(n+\lambda)P})_i^T = \frac{1}{n+\lambda} (n+\lambda) P = P$$
   Therefore:
   $$\frac{1}{2} \sum_{i=0}^{2n} W_i^{(m)} \Delta x_i^T \nabla^2 g \, \Delta x_i = \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P)$$
4. For the third-order term:
   All symmetric odd powers vanish: $\sum W_i^{(m)} \Delta x_i^3 = 0$.

Thus:
$$\bar{y}_{\text{UKF}} = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + 0 + \mathcal{O}(D^4)$$

Comparing with $\bar{y}_{\text{true}}$:
$$\bar{y}_{\text{true}} - \bar{y}_{\text{UKF}} = 0 + 0 + 0 + \mathcal{O}(D^4)$$

The UKF matches the true posterior mean **exactly through 3rd-order Taylor terms**! $\blacksquare$

---

## 9.6 Mathematical Problem Set

### Problem 9.1 (Worked Example): Deterministic Sigma-Point Generation in 2D
**Problem Statement:** A 2D robotic state has mean $\bar{x} = \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix}$ and covariance $P = \begin{bmatrix} 4.0 & 1.2 \\ 1.2 & 1.0 \end{bmatrix}$.
Using standard parameters $\alpha = 1.0, \beta = 2.0, \kappa = 0$:
1. Compute the scaling parameter $\lambda$ and weights $W_0^{(m)}, W_0^{(c)}, W_i^{(m)}, W_i^{(c)}$.
2. Compute the Cholesky factor $L = \sqrt{(n + \lambda) P}$.
3. Generate all $2n+1 = 5$ sigma points.

**Step-by-Step Derivation:**
1. Parameters: $n = 2, \alpha = 1.0, \beta = 2.0, \kappa = 0$.
   $$\lambda = \alpha^2 (n + \kappa) - n = 1.0^2 (2 + 0) - 2 = 0$$
   $$n + \lambda = 2 + 0 = 2$$
   Weights:
   $$W_0^{(m)} = \frac{\lambda}{n + \lambda} = \frac{0}{2} = 0.0$$
   $$W_0^{(c)} = \frac{\lambda}{n + \lambda} + (1 - \alpha^2 + \beta) = 0 + (1 - 1 + 2) = 2.0$$
   For $i = 1, 2, 3, 4$:
   $$W_i^{(m)} = W_i^{(c)} = \frac{1}{2(n + \lambda)} = \frac{1}{2(2)} = \frac{1}{4} = 0.25$$
   Check invariant: $\sum W_i^{(m)} = 0 + 4(0.25) = 1.0$.
2. Matrix square root $M = (n + \lambda) P = 2 P$:
   $$M = 2 \begin{bmatrix} 4.0 & 1.2 \\ 1.2 & 1.0 \end{bmatrix} = \begin{bmatrix} 8.0 & 2.4 \\ 2.4 & 2.0 \end{bmatrix}$$
   Compute lower-triangular Cholesky factor $L = \begin{bmatrix} L_{11} & 0 \\ L_{21} & L_{22} \end{bmatrix}$:
   $$L_{11} = \sqrt{M_{11}} = \sqrt{8.0} \approx 2.828427$$
   $$L_{21} = \frac{M_{21}}{L_{11}} = \frac{2.4}{\sqrt{8.0}} = \frac{2.4}{2.828427} \approx 0.848528$$
   $$L_{22} = \sqrt{M_{22} - L_{21}^2} = \sqrt{2.0 - (0.848528)^2} = \sqrt{2.0 - 0.720} = \sqrt{1.28} \approx 1.131371$$
   $$L = \begin{bmatrix} 2.828427 & 0.000000 \\ 0.848528 & 1.131371 \end{bmatrix}$$
3. Generate 5 sigma points:
   - Central point $\mathcal{X}_0 = \bar{x}$:
     $$\mathcal{X}_0 = \begin{bmatrix} 2.0 \\ -1.0 \end{bmatrix}$$
   - Positive perturbations ($i = 1, 2$):
     $$\mathcal{X}_1 = \bar{x} + L_{:, 1} = \begin{bmatrix} 2.0 + 2.828427 \\ -1.0 + 0.848528 \end{bmatrix} = \begin{bmatrix} 4.828427 \\ -0.151472 \end{bmatrix}$$
     $$\mathcal{X}_2 = \bar{x} + L_{:, 2} = \begin{bmatrix} 2.0 + 0.000000 \\ -1.0 + 1.131371 \end{bmatrix} = \begin{bmatrix} 2.000000 \\ 0.131371 \end{bmatrix}$$
   - Negative perturbations ($i = 3, 4$):
     $$\mathcal{X}_3 = \bar{x} - L_{:, 1} = \begin{bmatrix} 2.0 - 2.828427 \\ -1.0 - 0.848528 \end{bmatrix} = \begin{bmatrix} -0.828427 \\ -1.848528 \end{bmatrix}$$
     $$\mathcal{X}_4 = \bar{x} - L_{:, 2} = \begin{bmatrix} 2.0 - 0.000000 \\ -1.0 - 1.131371 \end{bmatrix} = \begin{bmatrix} 2.000000 \\ -2.131371 \end{bmatrix}$$

**Final Result:**
$$\mathcal{X} = \begin{bmatrix} 2.0000 & 4.8284 & 2.0000 & -0.8284 & 2.0000 \\ -1.0000 & -0.1515 & 0.1314 & -1.8485 & -2.1314 \end{bmatrix}$$

---

### Problem 9.2 (Worked Example): Nonlinear Polar Transformation Benchmark: UKF vs EKF
**Problem Statement:** A 2D target is at Cartesian coordinates $(x, y)$ with mean $\bar{x} = \begin{bmatrix} 0.0 \\ 10.0 \end{bmatrix}$ and covariance $P = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 0.01 \end{bmatrix}$. A sensor measures range $\rho = \sqrt{x^2 + y^2}$.
1. Compute the true expected range $\mathbb{E}[\sqrt{x^2 + y^2}]$ numerically via Monte Carlo or series expansion.
2. Compute the EKF predicted range $\hat{\rho}_{\text{EKF}} = h(\bar{x})$.
3. Compute the UKF predicted range $\hat{\rho}_{\text{UKF}}$ using the 5 sigma points.
Show that the UKF captures the nonlinear curvature while the EKF fails completely.

**Step-by-Step Derivation:**
1. True range expansion:
   $$\rho = \sqrt{x^2 + y^2} = y \sqrt{1 + (x/y)^2} \approx y \left(1 + \frac{x^2}{2 y^2}\right) = y + \frac{x^2}{2 y}$$
   Taking expectation:
   $$\mathbb{E}[\rho] \approx \bar{y} + \frac{\mathbb{E}[x^2]}{2 \bar{y}} = 10.0 + \frac{1.0}{2(10.0)} = 10.0 + 0.05 = 10.0500\text{ m}$$
2. EKF prediction:
   $$\hat{\rho}_{\text{EKF}} = \sqrt{\bar{x}^2 + \bar{y}^2} = \sqrt{0^2 + 10^2} = 10.0000\text{ m}$$
   The EKF predicts $10.0000\text{ m}$, missing the $0.05\text{ m}$ curvature offset entirely!
3. UKF prediction:
   $n = 2, \alpha = 1.0, \beta = 2.0, \kappa = 0 \implies \lambda = 0, n + \lambda = 2$.
   $M = 2 P = \begin{bmatrix} 2.0 & 0.0 \\ 0.0 & 0.02 \end{bmatrix}$.
   Cholesky factor $L = \begin{bmatrix} \sqrt{2} & 0 \\ 0 & \sqrt{0.02} \end{bmatrix} \approx \begin{bmatrix} 1.414214 & 0 \\ 0 & 0.141421 \end{bmatrix}$.
   Sigma points:
   $$\mathcal{X}_0 = [0, 10]^T \implies \rho_0 = 10.000000$$
   $$\mathcal{X}_1 = [\sqrt{2}, 10]^T \implies \rho_1 = \sqrt{2 + 100} = \sqrt{102} \approx 10.099505$$
   $$\mathcal{X}_2 = [0, 10 + \sqrt{0.02}]^T \implies \rho_2 = 10 + 0.141421 = 10.141421$$
   $$\mathcal{X}_3 = [-\sqrt{2}, 10]^T \implies \rho_3 = \sqrt{2 + 100} = \sqrt{102} \approx 10.099505$$
   $$\mathcal{X}_4 = [0, 10 - \sqrt{0.02}]^T \implies \rho_4 = 10 - 0.141421 = 9.858579$$
   Weights: $W_0^{(m)} = 0, W_1^{(m)} = W_2^{(m)} = W_3^{(m)} = W_4^{(m)} = 0.25$.
   UKF mean:
   $$\hat{\rho}_{\text{UKF}} = 0.25 (10.099505 + 10.141421 + 10.099505 + 9.858579) = 0.25 (40.199010) = 10.049753\text{ m}$$
4. Comparison:
   $$\text{True: } 10.0500\text{ m}, \quad \text{UKF: } 10.0498\text{ m (Error: } 0.0002\text{ m)}, \quad \text{EKF: } 10.0000\text{ m (Error: } 0.0500\text{ m)}$$
   The UKF captures $99.6\%$ of the nonlinear curvature shift, while the EKF captures $0\%$.

**Final Result:**
$$\hat{\rho}_{\text{true}} \approx 10.0500\text{ m}, \quad \hat{\rho}_{\text{UKF}} = 10.0498\text{ m}, \quad \hat{\rho}_{\text{EKF}} = 10.0000\text{ m}$$

---

### Problem 9.3 (Worked Example): Cross-Covariance and Kalman Gain in UKF
**Problem Statement:** Using the sigma points and evaluations from Problem 9.2:
1. Compute the UKF predicted range variance $P_\rho$ (assume $R = 0.01$).
2. Compute the state-measurement cross-covariance vector $P_{x\rho} \in \mathbb{R}^2$.
3. Compute the UKF Kalman gain vector $K \in \mathbb{R}^2$.

**Step-by-Step Derivation:**
1. Predicted measurement variance:
   Deviations $\tilde{\rho}_i = \mathcal{Y}_i - \hat{\rho}_{\text{UKF}}$:
   $$\tilde{\rho}_0 = 10.000000 - 10.049753 = -0.049753$$
   $$\tilde{\rho}_1 = 10.099505 - 10.049753 = +0.049752$$
   $$\tilde{\rho}_2 = 10.141421 - 10.049753 = +0.091668$$
   $$\tilde{\rho}_3 = 10.099505 - 10.049753 = +0.049752$$
   $$\tilde{\rho}_4 = 9.858579 - 10.049753 = -0.191174$$
   Weights: $W_0^{(c)} = 2.0, W_1^{(c)} = W_2^{(c)} = W_3^{(c)} = W_4^{(c)} = 0.25$.
   $$P_{\rho, \text{meas}} = W_0^{(c)} \tilde{\rho}_0^2 + 0.25 (\tilde{\rho}_1^2 + \tilde{\rho}_2^2 + \tilde{\rho}_3^2 + \tilde{\rho}_4^2)$$
   $$W_0^{(c)} \tilde{\rho}_0^2 = 2.0 (-0.049753)^2 = 2.0 (0.002475) = 0.004950$$
   $$\tilde{\rho}_1^2 = 0.002475, \quad \tilde{\rho}_2^2 = 0.008403, \quad \tilde{\rho}_3^2 = 0.002475, \quad \tilde{\rho}_4^2 = 0.036547$$
   Sum of peripheral squared deviations: $0.002475 + 0.008403 + 0.002475 + 0.036547 = 0.049900$
   $$0.25 \times 0.049900 = 0.012475$$
   $$P_{\rho, \text{meas}} = 0.004950 + 0.012475 = 0.017425$$
   Adding sensor noise $R = 0.01$:
   $$S = P_\rho = 0.017425 + 0.010000 = 0.027425$$
2. Cross-covariance vector $P_{x\rho} = \sum_{i=0}^4 W_i^{(c)} (\mathcal{X}_i - \bar{x}) \tilde{\rho}_i$:
   - For $x$-component (first row):
     $$\mathcal{X}_0 - \bar{x} = [0, 0]^T$$
     $$\mathcal{X}_1 - \bar{x} = [+\sqrt{2}, 0]^T \implies 0.25(+\sqrt{2})(+0.049752) \approx +0.017590$$
     $$\mathcal{X}_2 - \bar{x} = [0, +\sqrt{0.02}]^T \implies 0$$
     $$\mathcal{X}_3 - \bar{x} = [-\sqrt{2}, 0]^T \implies 0.25(-\sqrt{2})(+0.049752) \approx -0.017590$$
     $$\mathcal{X}_4 - \bar{x} = [0, -\sqrt{0.02}]^T \implies 0$$
     Notice: $+0.017590 - 0.017590 = 0.000000$! $P_{x\rho}[1] = 0.0$.
   - For $y$-component (second row):
     $$\mathcal{X}_1 \text{ and } \mathcal{X}_3 \implies 0$$
     $$\mathcal{X}_2 - \bar{x} = [0, +0.141421]^T \implies 0.25(+0.141421)(+0.091668) = +0.003241$$
     $$\mathcal{X}_4 - \bar{x} = [0, -0.141421]^T \implies 0.25(-0.141421)(-0.191174) = +0.006760$$
     Sum: $P_{x\rho}[2] = 0.003241 + 0.006760 = 0.010001 \approx 0.0100$.
   $$P_{x\rho} = \begin{bmatrix} 0.0000 \\ 0.0100 \end{bmatrix}$$
3. Kalman Gain:
   $$K = \frac{1}{S} P_{x\rho} = \frac{1}{0.027425} \begin{bmatrix} 0.0000 \\ 0.0100 \end{bmatrix} = \begin{bmatrix} 0.0000 \\ 0.3646 \end{bmatrix}$$

**Final Result:**
$$S = 0.02743, \quad P_{x\rho} = \begin{bmatrix} 0.0000 \\ 0.0100 \end{bmatrix}, \quad K = \begin{bmatrix} 0.0000 \\ 0.3646 \end{bmatrix}$$

---

### Problem 9.4 (Worked Example): Non-Positive Semi-Definite Covariance Prevention in UKF
**Problem Statement:** In the Merwe scaled unscented transform, if $\alpha$ is chosen too large (e.g. $\alpha = 2.0$), show that $W_0^{(c)}$ can become negative, potentially causing the reconstructed covariance $P$ to lose positive semi-definiteness. Derive the parameter condition ensuring $W_0^{(c)} \ge 0$.

**Step-by-Step Derivation:**
1. Weight formula:
   $$W_0^{(c)} = \frac{\lambda}{n + \lambda} + (1 - \alpha^2 + \beta)$$
   where $\lambda = \alpha^2(n + \kappa) - n$.
   $$\frac{\lambda}{n + \lambda} = 1 - \frac{n}{n + \lambda} = 1 - \frac{n}{\alpha^2(n + \kappa)}$$
2. Substituting:
   $$W_0^{(c)} = 1 - \frac{n}{\alpha^2(n + \kappa)} + 1 - \alpha^2 + \beta = 2 + \beta - \alpha^2 - \frac{n}{\alpha^2(n + \kappa)}$$
3. Setting $W_0^{(c)} \ge 0$:
   For standard Gaussian tuning $\beta = 2.0$ and $\kappa = 0$:
   $$W_0^{(c)} = 4 - \alpha^2 - \frac{1}{\alpha^2}$$
4. Multiply through by $\alpha^2$:
   $$-\alpha^4 + 4\alpha^2 - 1 \ge 0 \implies \alpha^4 - 4\alpha^2 + 1 \le 0$$
   Roots of quadratic in $\alpha^2$:
   $$\alpha^2 = \frac{4 \pm \sqrt{16 - 4}}{2} = 2 \pm \sqrt{3} \approx 2 \pm 1.732 \implies \alpha^2 \in [0.268, 3.732]$$
   $$\alpha \in [\sqrt{2 - \sqrt{3}}, \sqrt{2 + \sqrt{3}}] \approx [0.5176, 1.9318]$$
5. If $\alpha < 0.5176$ (such as standard $\alpha = 10^{-3}$), $W_0^{(c)}$ is strictly negative:
   $$W_0^{(c)} \approx -\frac{1}{\alpha^2} = -10^6!$$
6. Engineering Fix:
   When $W_0^{(c)} < 0$, if $\mathcal{Y}_0 \approx \bar{y}$, the negative term is tiny. However, if numerical roundoff introduces negative eigenvalues into $P_y$, enforce positive semi-definiteness via spectral clipping:
   $$P \leftarrow V \max(\Lambda, 0) V^T + 10^{-12} I$$

**Final Result:**
$$W_0^{(c)} \ge 0 \iff \alpha \in [0.518, 1.932]\text{ (for }\kappa=0, \beta=2\text{)}$$

---

### Problem 9.5 (Worked Example): Angular Manifold Sigma Points
**Problem Statement:** An autonomous rover orientation state is $\theta \in \mathbb{S}^1$ (the circle group $SO(2)$). Explain why calculating the UKF mean heading via scalar weighted sum $\bar{\theta} = \sum W_i^{(m)} \theta_i$ violates the Riemannian manifold geometry, and provide the exact circular vector averaging algorithm.

**Step-by-Step Derivation:**
1. Failure of Euclidean averaging:
   Suppose two sigma points are $\theta_1 = +179^\circ = +3.1241\text{ rad}$ and $\theta_2 = -179^\circ = -3.1241\text{ rad}$ with weights $0.5, 0.5$.
   Scalar weighted sum:
   $$\bar{\theta}_{\text{scalar}} = 0.5(+179^\circ) + 0.5(-179^\circ) = 0^\circ$$
   *Absurdity:* The average of two headings pointing nearly due West is calculated as pointing due East!
2. Riemannian Circular Vector Averaging:
   Map each angular sigma point onto the unit circle on the 2D plane:
   $$\bar{c} = \sum_{i=0}^{2n} W_i^{(m)} \cos(\theta_i)$$
   $$\bar{s} = \sum_{i=0}^{2n} W_i^{(m)} \sin(\theta_i)$$
3. The true intrinsic Fréchet / Karcher mean on $\mathbb{S}^1$ is:
   $$\bar{\theta}_{\text{circular}} = \operatorname{atan2}(\bar{s}, \bar{c})$$
4. Evaluation for our example:
   $$\cos(179^\circ) = \cos(-179^\circ) = -0.999848 \implies \bar{c} = -0.999848$$
   $$\sin(179^\circ) = +0.017452, \quad \sin(-179^\circ) = -0.017452 \implies \bar{s} = 0$$
   $$\bar{\theta} = \operatorname{atan2}(0, -0.999848) = 180^\circ = \pi\text{ rad}$$
   The circular mean correctly computes due West ($180^\circ$).

**Final Result:**
$$\bar{\theta} = \operatorname{atan2}\left( \sum W_i^{(m)} \sin\theta_i, \, \sum W_i^{(m)} \cos\theta_i \right)$$

---

### Problem 9.6 (Worked Example): Flop Count Analysis: UKF vs EKF
**Problem Statement:** For state dimension $n$ and measurement dimension $m$:
1. State the number of function evaluations required by EKF with finite differences versus UKF.
2. Compare the computational complexity in big-$\mathcal{O}$ notation.

**Step-by-Step Derivation:**
1. Function evaluations:
   - EKF with analytical Jacobians: 1 evaluation of $f(x)$, 1 evaluation of $h(x)$.
   - EKF with central finite differences: $2n$ evaluations of $f(x)$ for $F$, $2n$ evaluations of $h(x)$ for $H$. Total: $4n$ evaluations.
   - UKF: exactly $2n+1$ evaluations of $f(x)$, and $2n+1$ evaluations of $h(x)$. Total: $4n + 2$ evaluations.
   Function evaluation count is nearly identical between numerical EKF and UKF!
2. Linear algebra operations:
   - UKF requires Cholesky decomposition of $n \times n$ covariance: $\frac{1}{3} n^3$ flops.
   - Matrix outer product reconstructions:
     $$P_{k|k-1}: (2n+1) n^2 \approx 2 n^3\text{ flops}$$
     $$S_k: (2n+1) m^2 \approx 2 n m^2\text{ flops}$$
     $$P_{xz}: (2n+1) n m \approx 2 n^2 m\text{ flops}$$
   - Kalman gain solve and update: $\mathcal{O}(m^3 + n m^2 + n^2 m)$ flops.
3. Total asymptotic complexity:
   Both EKF and UKF have identical computational scaling:
   $$\text{Complexity} = \mathcal{O}(n^3 + n^2 m + m^3)\text{ flops}$$

**Final Result:**
Both EKF and UKF scale identically as $\mathcal{O}(n^3)$; UKF requires zero Jacobian code while providing 3rd-order accuracy.

---

### Problem 9.7 (Worked Example): Cholesky Factorization Algorithm Specification
**Problem Statement:** Write the exact algorithmic pseudo-code for the Cholesky factorization $A = L L^T$ of a symmetric positive-definite matrix $A \in \mathbb{R}^{n \times n}$.

**Step-by-Step Derivation:**
1. Algorithm (Cholesky-Banachiewicz):
   For $j = 0$ to $n-1$:
     - Diagonal element:
       $$L_{j, j} = \sqrt{A_{j, j} - \sum_{k=0}^{j-1} L_{j, k}^2}$$
       If $L_{j, j} \le 0$ or NaN, throw `NonPositiveDefiniteMatrixException`.
     - Sub-diagonal elements (for $i = j+1$ to $n-1$):
       $$L_{i, j} = \frac{1}{L_{j, j}} \left( A_{i, j} - \sum_{k=0}^{j-1} L_{i, k} L_{j, k} \right)$$
2. Flop count:
   $$\sum_{j=1}^n \left( 1 + \sum_{i=j+1}^n 2 j \right) \approx \frac{1}{3} n^3\text{ flops}$$

**Final Result:**
Deterministic $\frac{1}{3}n^3$ algorithm; failure to take real square root directly detects covariance loss of positive definiteness.

---

### Problem 9.8 (Worked Example): Unscented Transform on a Pure Quadratic Function
**Problem Statement:** Let scalar $x \sim \mathcal{N}(0, \sigma^2)$ with $\sigma = 2$. Compute the true mean and variance of $y = x^2$. Show that the Unscented Transform with $\alpha = 1, \beta = 2, \kappa = 2$ ($n=1$) calculates the exact true mean and variance.

**Step-by-Step Derivation:**
1. Analytical true values:
   $x \sim \mathcal{N}(0, 4)$.
   $$\mathbb{E}[y] = \mathbb{E}[x^2] = \sigma^2 = 4.0$$
   $$\operatorname{Var}(y) = \mathbb{E}[x^4] - (\mathbb{E}[x^2])^2 = 3\sigma^4 - \sigma^4 = 2\sigma^4 = 2(16) = 32.0$$
2. Unscented Transform:
   $n = 1, \alpha = 1, \beta = 2, \kappa = 2$.
   $$\lambda = \alpha^2(n + \kappa) - n = 1(1 + 2) - 1 = 2$$
   $$n + \lambda = 1 + 2 = 3$$
   Weights:
   $$W_0^{(m)} = \frac{\lambda}{n + \lambda} = \frac{2}{3}$$
   $$W_0^{(c)} = \frac{2}{3} + (1 - 1 + 2) = \frac{2}{3} + 2 = \frac{8}{3}$$
   $$W_1^{(m)} = W_1^{(c)} = W_2^{(m)} = W_2^{(c)} = \frac{1}{2(3)} = \frac{1}{6}$$
   Sigma points:
   $$\sqrt{(n + \lambda) P} = \sqrt{3 \times 4} = \sqrt{12} = 2\sqrt{3}$$
   $$\mathcal{X}_0 = 0$$
   $$\mathcal{X}_1 = +2\sqrt{3} \implies \mathcal{Y}_1 = (2\sqrt{3})^2 = 12$$
   $$\mathcal{X}_2 = -2\sqrt{3} \implies \mathcal{Y}_2 = (-2\sqrt{3})^2 = 12$$
   $$\mathcal{Y}_0 = 0^2 = 0$$
3. Reconstructed mean:
   $$\bar{y}_{\text{UKF}} = W_0^{(m)} \mathcal{Y}_0 + W_1^{(m)} \mathcal{Y}_1 + W_2^{(m)} \mathcal{Y}_2 = \frac{2}{3}(0) + \frac{1}{6}(12) + \frac{1}{6}(12) = 0 + 2 + 2 = 4.0$$
   Exact match: $\bar{y}_{\text{UKF}} = \bar{y}_{\text{true}} = 4.0$!
4. Reconstructed variance:
   Deviations: $\mathcal{Y}_0 - \bar{y} = -4, \mathcal{Y}_1 - \bar{y} = +8, \mathcal{Y}_2 - \bar{y} = +8$.
   $$P_{y, \text{UKF}} = W_0^{(c)} (-4)^2 + W_1^{(c)} (8)^2 + W_2^{(c)} (8)^2 = \frac{8}{3}(16) + \frac{1}{6}(64) + \frac{1}{6}(64) = \frac{128}{3} + \frac{128}{6} = \frac{128}{3} + \frac{64}{3} = \frac{192}{3} = 32.0$$
   Exact match: $P_{y, \text{UKF}} = \operatorname{Var}(y)_{\text{true}} = 32.0$!

**Final Result:**
$$\bar{y}_{\text{UKF}} = 4.0\text{ (Exact)}, \quad P_y = 32.0\text{ (Exact to machine precision)}$$

---

### Problem 9.9 (Worked Example): Square Root UKF (SR-UKF) Architecture
**Problem Statement:** In embedded robotics, the Square Root UKF (SR-UKF) propagates the Cholesky factor $S$ directly ($P = S S^T$) without ever squaring or inverting $P$. State the two linear algebra primitives that enable SR-UKF.

**Step-by-Step Derivation:**
1. QR Decomposition (Householder / Givens):
   To propagate covariance square root $S = \sqrt{P}$:
   Form the matrix of weighted sigma point deviations $A = \sqrt{W_1^{(c)}} [\mathcal{X}_1 - \hat{x}, \dots, \mathcal{X}_{2n} - \hat{x}, \sqrt{Q}]$.
   Compute QR decomposition: $A^T = Q R_T$.
   Then the upper-triangular factor $R_T^T$ is the exact updated Cholesky factor!
2. Cholesky Rank-1 Update / Downdate:
   For the central point weight $W_0^{(c)}$:
   If $W_0^{(c)} > 0$, perform Cholesky update: $\operatorname{cholupdate}(S, \mathcal{X}_0 - \hat{x}, +\sqrt{W_0^{(c)}})$.
   If $W_0^{(c)} < 0$, perform Cholesky downdate: $\operatorname{choldowndate}(S, \mathcal{X}_0 - \hat{x}, -\sqrt{|W_0^{(c)}|})$.
3. Benefit:
   Condition number is halved: $\kappa(S) = \sqrt{\kappa(P)}$, guaranteeing that SR-UKF runs in single-precision floating-point without loss of positive definiteness.

**Final Result:**
SR-UKF operates via QR factorization and Cholesky rank-1 downdating.

---

### Problem 9.10 (Worked Example): High-Dimensional Sigma-Point Weight Collapse
**Problem Statement:** As state dimension $n$ grows large (e.g. $n = 50$ in whole-body humanoid control), show what happens to the central weight $W_0^{(m)}$ if $\alpha = 1.0$ and $\kappa = 0$.

**Step-by-Step Derivation:**
1. $\lambda = \alpha^2(n + \kappa) - n = 1.0(n + 0) - n = 0$.
2. For $\lambda = 0$:
   $$W_0^{(m)} = \frac{0}{n + 0} = 0.0$$
   $$W_i^{(m)} = \frac{1}{2n} = \frac{1}{100} = 0.01$$
3. What if $\kappa = 3 - n$?
   Then $\lambda = 3 - n = 3 - 50 = -47$.
   $$n + \lambda = 50 - 47 = 3$$
   $$W_0^{(m)} = \frac{-47}{3} \approx -15.6667$$
   The central weight becomes massively negative ($-15.7$), while peripheral weights become positive ($+0.1667$).
   This causes extreme cancellation errors in floating point.
4. Lesson: In high dimensions ($n > 3$), always keep $\alpha \in [10^{-4}, 10^{-2}]$ and $\kappa = 0$, ensuring $\lambda$ scales proportionally with $n$.

**Final Result:**
In high dimensions, setting $\kappa = 3-n$ causes severe negative weight collapse; use $\alpha \ll 1, \kappa = 0$.

---

### Problem 9.11 (Solved Exercise): Number of Sigma Points in UKF
**Problem Statement:** Compare the number of sigma points generated by the canonical symmetric Unscented Transform ($2n+1$), the Minimum Sigma-Point simplex transform ($n+1$), and the 5th-order Gauss-Hermite cubature ($2n^2 + 1$) for $n = 6$.

**Step-by-Step Solution:**
1. Symmetric UKF: $2n + 1 = 2(6) + 1 = 13$ points.
2. Simplex UKF: $n + 1 = 6 + 1 = 7$ points.
3. 5th-order Cubature: $2n^2 + 1 = 2(36) + 1 = 73$ points.

**Final Answer:**
$$\text{Simplex: } 7, \quad \text{Canonical: } 13, \quad \text{Cubature: } 73$$

---

### Problem 9.12 (Solved Exercise): Reconstructing Covariance from Sigma Points
**Problem Statement:** Verify that passing sigma points through the identity transformation $g(x) = x$ reconstructs the exact original covariance $P$.

**Step-by-Step Solution:**
1. If $g(x) = x$, then $\mathcal{Y}_i = \mathcal{X}_i$.
2. $\bar{y} = \sum W_i^{(m)} \mathcal{X}_i = \bar{x}$.
3. Deviations: $\mathcal{Y}_i - \bar{y} = \mathcal{X}_i - \bar{x} = \Delta x_i$.
4. Covariance:
   $$P_y = \sum_{i=0}^{2n} W_i^{(c)} \Delta x_i \Delta x_i^T = W_0^{(c)} (0) + 2 \sum_{i=1}^n \frac{1}{2(n+\lambda)} \sigma_i \sigma_i^T = \frac{1}{n+\lambda} (n+\lambda) P = P \quad \blacksquare$$

---

### Problem 9.13 (Solved Exercise): Parameter Tuning Rules of Thumb
**Problem Statement:** Summarize the standard textbook recommendations for UKF parameters $(\alpha, \beta, \kappa)$ for Gaussian tracking.

**Step-by-Step Solution:**
- $\alpha$: spread parameter. Default $\alpha = 10^{-3}$ for severe nonlinearities to prevent sampling far from the mean; $\alpha = 1.0$ for mild polynomial nonlinearities.
- $\beta$: distribution shape. $\beta = 2.0$ is strictly optimal for Gaussian distributions.
- $\kappa$: secondary scaling. $\kappa = 0$ for general multivariable systems; $\kappa = 3 - n$ for $n \le 3$.

**Final Answer:**
$$\alpha = 10^{-3}, \quad \beta = 2.0, \quad \kappa = 0$$

---

### Problem 9.14 (Solved Exercise): Comparison on Radar Range-Bearing
**Problem Statement:** Under what sensor geometry conditions does UKF show the largest accuracy advantage over EKF in radar tracking?

**Step-by-Step Solution:**
1. Low range-to-bearing-uncertainty ratio: when range $\rho$ is small relative to cross-track position uncertainty $\sigma_{\text{cross}} = \rho \sigma_\phi$.
2. Large angular uncertainty: when bearing noise $\sigma_\phi > 5^\circ$ ($0.087\text{ rad}$), the banana-shaped posterior distribution severely violates Taylor linearization.
3. Rapid high-g maneuvers where vehicle acceleration changes significantly over $\Delta t$. $\blacksquare$

---

### Problem 9.15 (Solved Exercise): Cholesky Failure Recovery
**Problem Statement:** If numerical roundoff causes the predicted covariance $P_{k|k-1}$ to have a minimum eigenvalue $\lambda_{\min} = -10^{-15}$, how should the UKF recover before calling Cholesky factorization?

**Step-by-Step Solution:**
1. Enforce symmetry: $P \leftarrow \frac{1}{2}(P + P^T)$.
2. Compute eigenvalue decomposition: $P = V \Lambda V^T$.
3. Threshold eigenvalues: $\Lambda_{ii} \leftarrow \max(\Lambda_{ii}, 10^{-12})$.
4. Reconstruct: $P \leftarrow V \Lambda V^T$.
5. Alternatively, add diagonal jitter: $P \leftarrow P + (|\lambda_{\min}| + 10^{-12}) I_n$. $\blacksquare$

---

### Problem 9.16 (Solved Exercise): Scalar Cubic Transformation Benchmark
**Problem Statement:** Let $x \sim \mathcal{N}(0, 1)$ and $y = x^3$. Compute $\mathbb{E}[y]$ using EKF versus UKF.

**Step-by-Step Solution:**
1. True expectation: since $x^3$ is an odd function and Gaussian is symmetric around $0$, $\mathbb{E}[x^3] = 0$.
2. EKF: $g(\mathbb{E}[x]) = 0^3 = 0$.
3. UKF: sigma points are $0, +\sqrt{3}, -\sqrt{3}$.
   $$\mathcal{Y}_0 = 0, \quad \mathcal{Y}_1 = (\sqrt{3})^3 = 3\sqrt{3}, \quad \mathcal{Y}_2 = (-\sqrt{3})^3 = -3\sqrt{3}$$
   $$\bar{y}_{\text{UKF}} = W_0(0) + W_1(3\sqrt{3}) + W_1(-3\sqrt{3}) = 0$$
4. Both correctly predict $0$ due to odd symmetry. $\blacksquare$

---

### Problem 9.17 (Solved Exercise): Unscented Transform on Quaternion Dynamics
**Problem Statement:** Why cannot unit quaternions $q \in \mathbb{S}^3$ ($\|q\| = 1$) be directly averaged using the standard UKF weighted sum?

**Step-by-Step Solution:**
1. Linear combinations of unit quaternions do not preserve unit norm: $\|\sum W_i q_i\| \neq 1$.
2. Quaternions possess a double-cover ambiguity: $q$ and $-q$ represent the identical physical 3D rotation. If $\mathcal{X}_1 = q$ and $\mathcal{X}_2 = -q$, linear averaging yields $\frac{q - q}{2} = 0$, a singularity!
3. Solution: operate UKF on a 3-dimensional Lie algebra error vector $\delta \theta \in \mathbb{R}^3$ via $\exp(\delta \theta / 2)$ (Unscented Quaternion Estimator - USQUE). $\blacksquare$

---

### Problem 9.18 (Solved Exercise): Central Sigma Point Weight Vanishing
**Problem Statement:** Under what parameter combination does the central sigma point have weight $W_0^{(m)} = 0$?

**Step-by-Step Solution:**
1. Formula: $W_0^{(m)} = \frac{\lambda}{n + \lambda}$.
2. $W_0^{(m)} = 0 \iff \lambda = 0$.
3. Since $\lambda = \alpha^2(n + \kappa) - n$:
   $$\lambda = 0 \iff \alpha^2(n + \kappa) = n \iff \alpha = \sqrt{\frac{n}{n + \kappa}}$$
4. For $\kappa = 0$, this occurs when $\alpha = 1.0$.

**Final Answer:**
$$W_0^{(m)} = 0 \iff \alpha = 1.0\text{ and }\kappa = 0$$

---

### Problem 9.19 (Solved Exercise): Innovation Whiteness in UKF
**Problem Statement:** Is the innovation sequence $y_k = z_k - \hat{z}_{k|k-1}$ of a properly tuned UKF statistically white?

**Step-by-Step Solution:**
1. Because the UKF captures the true posterior mean and covariance to 3rd order, the residual $y_k$ reflects purely unpredictable innovation.
2. By the Orthogonality Principle, the innovation sequence remains uncorrelated across time: $\mathbb{E}[y_j y_k^T] \approx S_k \delta_{jk}$, confirmed by autocorrelation diagnostic tests. $\blacksquare$

---

### Problem 9.20 (Solved Exercise): Non-Local Nonlinearity Failure
**Problem Statement:** If $\alpha = 1.0$, sigma points are placed at distance $\sqrt{n} \sigma$. For $n = 20$, $\sqrt{20} \approx 4.47\sigma$. Why does this cause severe estimation errors if $g(x)$ has localized features (such as obstacle boundaries)?

**Step-by-Step Solution:**
1. A sigma point placed $4.5\sigma$ away samples the function deep in the extreme tails of the Gaussian distribution.
2. If the physical sensor has a step-discontinuity (e.g. laser beam hitting an obstacle corner at $2\sigma$), the sigma point samples the wrong geometric surface.
3. Setting $\alpha = 10^{-3}$ contracts the sigma points tightly within $0.004\sigma$ of the mean, sampling purely the local curvature and preventing tail contamination. $\blacksquare$


---

# Chapter 10: Multi-Sensor Fusion Architectures: IMU, GPS, and Visual Odometry

## 10.1 Introduction: The Sensor Heterogeneity Challenge

Autonomous physical robots—from quadrupedal humanoids navigating unstructured rubble to aerial drones mapping GPS-denied tunnels—cannot rely on any single sensing modality. Each physical sensor has fundamental physical failure modes:
- **Inertial Measurement Units (IMU):** Provide instantaneous high-bandwidth acceleration and angular velocity at $500\text{--}2000\text{ Hz}$, but suffer from unconstrained quadratic position drift and cubic gyro-bias drift.
- **Global Positioning System (GPS / GNSS):** Provides bounded global position fixes at $1\text{--}10\text{ Hz}$, but is vulnerable to satellite occlusions, multipath reflections, and complete signal loss in indoor or urban canyons.
- **Visual Odometry (VO) / Visual-Inertial Navigation (VINS):** Tracks hundreds of optical feature points at $30\text{--}60\text{ Hz}$, but fails in textureless environments, low light, or under high-velocity motion blur.
- **Wheel Encoders:** Provide precise relative velocity at high frequency, but slip on ice, sand, or wet surfaces.

The holy grail of robotic state estimation is **multi-sensor fusion**: mathematically fusing complementary sensor streams into a unified, dynamically consistent, high-rate belief state.

In this chapter, we master modern multi-sensor fusion architectures. We contrast loosely-coupled and tightly-coupled paradigms, formalize high-rate IMU strapdown mechanization on the 3D rotation group $SO(3)$, and derive the industry-standard **Error-State Kalman Filter (ESKF)** across 20 rigorous mathematical problems.

---

## 10.2 Fusion Topologies: Loosely vs Tightly Coupled

```
LOOSELY-COUPLED ARCHITECTURE:
+------------+       +-------------------+       +-----------------------+
|  Camera /  | ----> | Standalone Vision | ----> | Trajectory Pose (x,q) | ----\
|  Features  |       | Engine (ORB/PTAM) |       +-----------------------+      \
+------------+       +-------------------+                                       \     +------------------+
                                                                                  ===> | Central Fusion   |
+------------+       +-------------------+       +-----------------------+       /     | Kalman Filter    |
| GPS Signal | ----> | Standalone GNSS   | ----> | Global Position (lat) | -----/      +------------------+
| Receivers  |       | Position Engine   |       +-----------------------+             /
+------------+       +-------------------+                                            /
                                                                                     /
+------------+                                                                      /
|    IMU     | --------------------------------------------------------------------/
+------------+

TIGHTLY-COUPLED ARCHITECTURE:
+------------+       +-----------------------------------------------------------+
|  Camera    | ----> | Raw Feature Pixel Coordinates (u, v)                      | ----\
+------------+       +-----------------------------------------------------------+      \
                                                                                         \     +------------------+
+------------+       +-----------------------------------------------------------+        ===> | Unified Error-   |
| GPS Engine | ----> | Raw Pseudorange & Carrier Phase (\rho_i, \phi_i)          | ------/     | State Kalman     |
+------------+       +-----------------------------------------------------------+             | Filter (ESKF)    |
                                                                                               +------------------+
+------------+       +-----------------------------------------------------------+             /
|    IMU     | ----> | High-Rate Specific Force & Angular Velocity (a_b, \omega_b)| -----------/
+------------+       +-----------------------------------------------------------+
```

### 10.2.1 Loosely-Coupled Fusion
In a loosely-coupled system, independent sub-systems process raw sensor data into intermediate pose or velocity estimates before presenting them to a master Kalman filter.
- *Advantage:* Highly modular; sub-systems can be swapped out easily.
- *Fatal Flaw:* When GPS tracks fewer than 4 satellites, or when a camera tracks fewer than 5 features, the independent sub-systems fail completely and output nothing. The master filter receives zero information, even though 3 visible satellites or 4 visual tracks contain immense spatial constraints.

### 10.2.2 Tightly-Coupled Fusion
In a tightly-coupled architecture, raw measurements (raw GPS pseudoranges $\rho_i$, raw pixel coordinates $(u, v)$) are fed directly into the state estimator.
- *Advantage:* Information is retained even under severe sensor degradation (e.g. tracking a single satellite or 2 visual features updates the filter).
- *Trade-off:* Higher computational complexity and tighter mathematical modeling requirements.

---

## 10.3 High-Rate IMU Strapdown Mechanization

An IMU rigidly mounted to the robot chassis measures body-frame specific force $a_b \in \mathbb{R}^3$ and body-frame angular rate $\omega_b \in \mathbb{R}^3$:
$$a_b(t) = R_n^b(t) (a_n(t) - g^n) + b_a(t) + \eta_a(t)$$
$$\omega_b(t) = \omega_{nb}^b(t) + b_g(t) + \eta_g(t)$$

where:
- $R_n^b \in SO(3)$ is the rotation matrix from world navigation frame to robot body frame.
- $g^n = [0, 0, -9.80665]^T\text{ m/s}^2$ is the gravity vector in navigation coordinates.
- $b_a, b_g \in \mathbb{R}^3$ are sensor biases, modeled as stochastic random walks:
  $$\dot{b}_a(t) = \eta_{ba}(t), \quad \dot{b}_g(t) = \eta_{bg}(t)$$
- $\eta_a, \eta_g, \eta_{ba}, \eta_{bg}$ are zero-mean Gaussian white noise processes.

### 10.3.1 Continuous Kinematics in the Navigation Frame
The continuous equations of motion in the navigation frame are:
$$\dot{p}^n(t) = v^n(t)$$
$$\dot{v}^n(t) = R_b^n(t) (a_b(t) - b_a(t)) + g^n$$
$$\dot{R}_b^n(t) = R_b^n(t) [\omega_b(t) - b_g(t)]_\times$$

where $[\omega]_\times$ denotes the $3 \times 3$ skew-symmetric cross-product matrix:
$$[\omega]_\times = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$

Using unit quaternions $q = [q_w, q_x, q_y, q_z]^T \in \mathbb{S}^3$:
$$\dot{q}_b^n(t) = \frac{1}{2} q_b^n(t) \otimes \begin{bmatrix} 0 \\ \omega_b(t) - b_g(t) \end{bmatrix}$$

---

## 10.4 The Error-State Kalman Filter (ESKF)

Standard EKF formulation fails when directly applied to 3D attitude estimation because the 4-parameter unit quaternion $q \in \mathbb{S}^3$ is subject to a strict norm constraint $\|q\| = 1$. The $4 \times 4$ covariance matrix of $q$ is permanently singular (rank 3), causing numerical collapse.

The **Error-State Kalman Filter (ESKF)** solves this problem with mathematical perfection by decomposing the physical state into three entities:
1. **True State $x_t$:** The physical reality.
2. **Nominal State $x_{\text{nom}}$:** High-rate, non-linear integration of IMU measurements without considering noise.
3. **Error State $\delta x$:** Low-rate, small, linear stochastic perturbation.

$$x_t = x_{\text{nom}} \oplus \delta x$$

```
+---------------------------------------------------------------------------------------------------+
|                           THE ESKF THREE-TIER ARCHITECTURE                                        |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    HIGH-RATE IMU (500-1000 Hz)                                                                    |
|              |                                                                                    |
|              v                                                                                    |
|    +------------------------------------------------------------------------------------------+   |
|    | NOMINAL STATE INTEGRATOR (Strapdown Mechanization on SO(3) Manifold)                     |   |
|    |    p_{k} = p_{k-1} + v_{k-1}\Delta t + \frac{1}{2}(R(q)(a_b - b_a) + g)\Delta t^2         |   |
|    |    v_{k} = v_{k-1} + (R(q)(a_b - b_a) + g)\Delta t                                       |   |
|    |    q_{k} = q_{k-1} \otimes \exp\left(\frac{1}{2}(\omega_b - b_g)\Delta t\right)          |   |
|    +------------------------------------------------------------------------------------------+   |
|              |                                                ^                                   |
|              |                                                | Reset / Error Injection           |
|              v                                                | q <- q \otimes exp(\delta\theta/2)|
|    +------------------------------------------------------+   | \delta x <- 0                     |
|    | ERROR-STATE KALMAN FILTER (\delta x \in \mathbb{R}^{15}) |   |                                   |
|    |    \delta x = [\delta p, \delta v, \delta \theta, \delta b_a, \delta b_g]^T              |   |
|    |    Operates strictly in linear Euclidean tangent space!  |                                   |
|    +------------------------------------------------------+   |                                   |
|              ^                                                |                                   |
|              | Low-rate corrections (GPS, Vision, 1-30 Hz)    |                                   |
|              +------------------------------------------------+                                   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 10.4.1 The 15-Dimensional Error State Vector
The error state vector $\delta x \in \mathbb{R}^{15}$ is defined strictly in the Euclidean tangent space:
$$\delta x = \begin{bmatrix} \delta p \\ \delta v \\ \delta \theta \\ \delta b_a \\ \delta b_g \end{bmatrix} \in \mathbb{R}^{15}$$
where:
- $\delta p = p_t - p_{\text{nom}} \in \mathbb{R}^3$ (position error).
- $\delta v = v_t - v_{\text{nom}} \in \mathbb{R}^3$ (velocity error).
- $\delta \theta \in \mathbb{R}^3$ is the **minimal 3-parameter rotation error vector** in the Lie algebra $\mathfrak{so}(3)$:
  $$R_t = R_{\text{nom}} \operatorname{Exp}(\delta \theta) \approx R_{\text{nom}} (I + [\delta \theta]_\times)$$
  $$q_t = q_{\text{nom}} \otimes \begin{bmatrix} 1 \\ \frac{1}{2} \delta \theta \end{bmatrix}$$
- $\delta b_a = b_{a, t} - b_{a, \text{nom}} \in \mathbb{R}^3$ (accelerometer bias error).
- $\delta b_g = b_{g, t} - b_{g, \text{nom}} \in \mathbb{R}^3$ (gyroscope bias error).

### 10.4.2 Linearized Error-State Differential Equations
Differentiating each error component yields strictly linear continuous dynamics:
$$\delta \dot{p} = \delta v$$
$$\delta \dot{v} = -R_{\text{nom}} [a_b - b_a]_\times \delta \theta - R_{\text{nom}} \delta b_a - R_{\text{nom}} \eta_a$$
$$\delta \dot{\theta} = -[\omega_b - b_g]_\times \delta \theta - \delta b_g - \eta_g$$
$$\delta \dot{b}_a = \eta_{ba}$$
$$\delta \dot{b}_g = \eta_{bg}$$

In matrix form:
$$\delta \dot{x}(t) = F_c(t) \delta x(t) + G_c(t) w(t)$$

where:
$$F_c = \begin{bmatrix} 0_{3\times 3} & I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \\ 0_{3\times 3} & 0_{3\times 3} & -R_{\text{nom}} [a_b - b_a]_\times & -R_{\text{nom}} & 0_{3\times 3} \\ 0_{3\times 3} & 0_{3\times 3} & -[\omega_b - b_g]_\times & 0_{3\times 3} & -I_3 \\ 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \\ 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix}$$

Notice that because $\delta \theta$ is always near zero (reset after every update), the linearization point is permanently exact, virtually eliminating Taylor truncation errors.

---

## 10.5 The Reset Operation

When a low-rate sensor (e.g. GPS or Camera) arrives, the ESKF computes the optimal error state estimate:
$$\hat{\delta x} = [\hat{\delta p}, \hat{\delta v}, \hat{\delta \theta}, \hat{\delta b}_a, \hat{\delta b}_g]^T$$

This error must immediately be **injected into the nominal state**:
$$p_{\text{nom}} \leftarrow p_{\text{nom}} + \hat{\delta p}$$
$$v_{\text{nom}} \leftarrow v_{\text{nom}} + \hat{\delta v}$$
$$q_{\text{nom}} \leftarrow q_{\text{nom}} \otimes \begin{bmatrix} \cos(\|\hat{\delta \theta}\|/2) \\ \frac{\hat{\delta \theta}}{\|\hat{\delta \theta}\|} \sin(\|\hat{\delta \theta}\|/2) \end{bmatrix}$$
$$b_{a, \text{nom}} \leftarrow b_{a, \text{nom}} + \hat{\delta b}_a$$
$$b_{g, \text{nom}} \leftarrow b_{g, \text{nom}} + \hat{\delta b}_g$$

### Resetting the Error State to Zero:
After injection, the error state is reset:
$$\hat{\delta x} \leftarrow 0_{15 \times 1}$$

### Covariance Reset Projection:
Because orientation injection updates the reference frame, the covariance matrix must be projected:
$$P \leftarrow G P G^T$$
where $G = \operatorname{diag}\left(I_3, I_3, I_3 - \frac{1}{2}[\hat{\delta \theta}]_\times, I_3, I_3\right)$. For small corrections, $G \approx I_{15}$.

---

## 10.6 Mathematical Problem Set

### Problem 10.1 (Worked Example): Strapdown Quaternion Integration Step
**Problem Statement:** An autonomous quadrotor has current orientation quaternion $q_0 = [1, 0, 0, 0]^T$ (identity rotation). Gyroscope rate measurement is $\omega_b = [0.02, -0.01, 0.05]^T\text{ rad/s}$ with estimated gyro bias $b_g = [0.00, 0.00, 0.01]^T\text{ rad/s}$.
For sampling interval $\Delta t = 0.01\text{ s}$ ($100\text{ Hz}$):
1. Compute the unbiased angular velocity $\tilde{\omega}_b$.
2. Compute the delta-angle rotation vector $\Delta \theta$.
3. Compute the updated unit quaternion $q_1$ via exact zeroth-order quaternion integration.

**Step-by-Step Derivation:**
1. Unbiased angular rate:
   $$\tilde{\omega}_b = \omega_b - b_g = \begin{bmatrix} 0.02 - 0.00 \\ -0.01 - 0.00 \\ 0.05 - 0.01 \end{bmatrix} = \begin{bmatrix} 0.02 \\ -0.01 \\ 0.04 \end{bmatrix}\text{ rad/s}$$
2. Delta-angle vector:
   $$\Delta \theta = \tilde{\omega}_b \Delta t = \begin{bmatrix} 0.02 \\ -0.01 \\ 0.04 \end{bmatrix} (0.01) = \begin{bmatrix} 0.0002 \\ -0.0001 \\ 0.0004 \end{bmatrix}\text{ rad}$$
   Magnitude of rotation:
   $$\|\Delta \theta\| = \sqrt{(2\times 10^{-4})^2 + (-1\times 10^{-4})^2 + (4\times 10^{-4})^2} = 10^{-4} \sqrt{4 + 1 + 16} = 10^{-4} \sqrt{21} \approx 4.582576 \times 10^{-4}\text{ rad}$$
3. Delta quaternion $\Delta q = \exp(\Delta \theta / 2)$:
   $$\frac{\|\Delta \theta\|}{2} \approx 2.291288 \times 10^{-4}\text{ rad}$$
   $$\cos\left(\frac{\|\Delta \theta\|}{2}\right) \approx 1 - \frac{(2.2913 \times 10^{-4})^2}{2} \approx 1.000000000 - 2.62 \times 10^{-8} \approx 0.999999974$$
   $$\sin\left(\frac{\|\Delta \theta\|}{2}\right) \approx 2.291288 \times 10^{-4}$$
   $$\Delta q = \begin{bmatrix} \cos(\|\Delta \theta\|/2) \\ \frac{\Delta \theta}{\|\Delta \theta\|} \sin(\|\Delta \theta\|/2) \end{bmatrix} = \begin{bmatrix} 0.999999974 \\ 1.000000 \times 10^{-4} \\ -0.500000 \times 10^{-4} \\ 2.000000 \times 10^{-4} \end{bmatrix}$$
4. Quaternion multiplication $q_1 = q_0 \otimes \Delta q$:
   Since $q_0 = [1, 0, 0, 0]^T$, $q_1 = \Delta q$:
   $$q_1 = \begin{bmatrix} 0.999999974 \\ 0.000100000 \\ -0.000050000 \\ 0.000200000 \end{bmatrix}$$
   Norm check:
   $$\|q_1\|^2 = (0.999999974)^2 + (10^{-4})^2 + (0.5\times 10^{-4})^2 + (2\times 10^{-4})^2 \approx 1 - 5.25\times 10^{-8} + 5.25\times 10^{-8} = 1.000000000$$

**Final Result:**
$$q_1 = [0.99999997, \, 0.00010000, \, -0.00005000, \, 0.00020000]^T$$

---

### Problem 10.2 (Worked Example): Gravity Compensation in Strapdown Acceleration
**Problem Statement:** An aerial drone hovers statically in the air with pitch angle $\theta = 30^\circ$, roll $\phi = 0^\circ$, yaw $\psi = 0^\circ$. True acceleration in navigation frame is $a^n = 0$.
1. Compute the rotation matrix $R_n^b$.
2. What specific force $a_b$ does the body-frame accelerometer measure in steady hover?
3. Show how the strapdown mechanization computes $\dot{v}^n = R_b^n a_b + g^n = 0$.

**Step-by-Step Derivation:**
1. Pitch rotation matrix $R_b^n$ (pitch by $\theta = 30^\circ$ around $y$-axis):
   $$R_b^n = \begin{bmatrix} \cos 30^\circ & 0 & \sin 30^\circ \\ 0 & 1 & 0 \\ -\sin 30^\circ & 0 & \cos 30^\circ \end{bmatrix} = \begin{bmatrix} \frac{\sqrt{3}}{2} & 0 & \frac{1}{2} \\ 0 & 1 & 0 \\ -\frac{1}{2} & 0 & \frac{\sqrt{3}}{2} \end{bmatrix} \approx \begin{bmatrix} 0.866025 & 0 & 0.500000 \\ 0 & 1 & 0 \\ -0.500000 & 0 & 0.866025 \end{bmatrix}$$
   The transpose is $R_n^b = (R_b^n)^T$:
   $$R_n^b = \begin{bmatrix} 0.866025 & 0 & -0.500000 \\ 0 & 1 & 0 \\ 0.500000 & 0 & 0.866025 \end{bmatrix}$$
2. Accelerometer specific force:
   Accelerometers measure specific force $f = a - g$.
   In navigation frame, $a^n = 0$ and $g^n = [0, 0, -9.80665]^T$.
   $$f^n = a^n - g^n = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ -9.80665 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ +9.80665 \end{bmatrix}\text{ m/s}^2$$
   Transforming to body frame:
   $$a_b = R_n^b f^n = \begin{bmatrix} 0.866025 & 0 & -0.500000 \\ 0 & 1 & 0 \\ 0.500000 & 0 & 0.866025 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 9.80665 \end{bmatrix} = \begin{bmatrix} -0.500000 \times 9.80665 \\ 0 \\ 0.866025 \times 9.80665 \end{bmatrix} = \begin{bmatrix} -4.903325 \\ 0.000000 \\ 8.492795 \end{bmatrix}\text{ m/s}^2$$
3. Strapdown navigation acceleration calculation:
   $$\dot{v}^n = R_b^n a_b + g^n$$
   $$R_b^n a_b = \begin{bmatrix} 0.866025 & 0 & 0.500000 \\ 0 & 1 & 0 \\ -0.500000 & 0 & 0.866025 \end{bmatrix} \begin{bmatrix} -4.903325 \\ 0 \\ 8.492795 \end{bmatrix}$$
   - $x$-component: $0.866025(-4.903325) + 0.500000(8.492795) = -4.246397 + 4.246397 = 0.000000$.
   - $y$-component: $0$.
   - $z$-component: $-0.500000(-4.903325) + 0.866025(8.492795) = +2.451663 + 7.354988 = +9.806651$.
   Adding gravity $g^n = [0, 0, -9.80665]^T$:
   $$\dot{v}^n = \begin{bmatrix} 0 \\ 0 \\ +9.80665 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ -9.80665 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}\text{ m/s}^2$$

**Final Result:**
$$\dot{v}^n = [0, 0, 0]^T\text{ m/s}^2\text{ (Exact Dynamic Equilibrium)}$$

---

### Problem 10.3 (Worked Example): GPS Position Measurement Jacobian in ESKF
**Problem Statement:** A GPS receiver provides 3D Cartesian position in navigation frame: $z_{\text{GPS}} = p_t + v_{\text{GPS}}$ with noise covariance $R_{\text{GPS}} = \operatorname{diag}(4.0, 4.0, 9.0)\text{ m}^2$.
1. Express the GPS measurement residual $y$ in terms of nominal position $p_{\text{nom}}$ and error state $\delta x \in \mathbb{R}^{15}$.
2. Write the $3 \times 15$ measurement sensitivity matrix $H_{\text{GPS}}$.

**Step-by-Step Derivation:**
1. True position is related to error state by:
   $$p_t = p_{\text{nom}} + \delta p$$
2. Measurement model:
   $$z_{\text{GPS}} = p_t + v_{\text{GPS}} = p_{\text{nom}} + \delta p + v_{\text{GPS}}$$
3. Measurement residual:
   $$y = z_{\text{GPS}} - p_{\text{nom}} = \delta p + v_{\text{GPS}}$$
4. Expressing in terms of the full 15D error state $\delta x = [\delta p, \delta v, \delta \theta, \delta b_a, \delta b_g]^T$:
   $$y = \begin{bmatrix} I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix} \begin{bmatrix} \delta p \\ \delta v \\ \delta \theta \\ \delta b_a \\ \delta b_g \end{bmatrix} + v_{\text{GPS}}$$
5. Measurement matrix:
   $$H_{\text{GPS}} = \begin{bmatrix} I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix} \in \mathbb{R}^{3 \times 15}$$

**Final Result:**
$$H_{\text{GPS}} = \begin{bmatrix} 1 & 0 & 0 & 0 & \cdots & 0 \\ 0 & 1 & 0 & 0 & \cdots & 0 \\ 0 & 0 & 1 & 0 & \cdots & 0 \end{bmatrix} = \begin{bmatrix} I_3 & 0_{3\times 12} \end{bmatrix}$$
*Remark:* Notice that $H_{\text{GPS}}$ is completely constant and linear—no Jacobians, no trigonometric derivatives!

---

### Problem 10.4 (Worked Example): Visual Feature Pixel Coordinate Jacobian in ESKF
**Problem Statement:** A calibrated camera mounted to the robot at pose $(p_{\text{nom}}, R_{\text{nom}})$ observes a known 3D world landmark at $p_w \in \mathbb{R}^3$.
In camera coordinates, the landmark is $p_c = R_c^w (p_w - p_w^c)$.
Derive the analytical sensitivity of camera point $p_c$ with respect to position error $\delta p$ and orientation error $\delta \theta$.

**Step-by-Step Derivation:**
1. Let camera frame coincide with body frame for simplicity ($R_c^w = R_n^b = (R_b^n)^T$).
   $$p_c = (R_t)^T (p_w - p_t)$$
2. Substitute error perturbations:
   $$p_t = p_{\text{nom}} + \delta p$$
   $$R_t \approx R_{\text{nom}} (I + [\delta \theta]_\times) \implies R_t^T \approx (I - [\delta \theta]_\times) R_{\text{nom}}^T$$
3. Expand $p_c$:
   $$p_c \approx (I - [\delta \theta]_\times) R_{\text{nom}}^T (p_w - p_{\text{nom}} - \delta p)$$
   Let $p_{c, \text{nom}} = R_{\text{nom}}^T (p_w - p_{\text{nom}})$.
   $$p_c \approx p_{c, \text{nom}} - R_{\text{nom}}^T \delta p - [\delta \theta]_\times p_{c, \text{nom}}$$
4. Using the skew-symmetric identity $[a]_\times b = -[b]_\times a$:
   $$-[\delta \theta]_\times p_{c, \text{nom}} = +[p_{c, \text{nom}}]_\times \delta \theta$$
5. Thus:
   $$\delta p_c = p_c - p_{c, \text{nom}} = -R_{\text{nom}}^T \delta p + [p_{c, \text{nom}}]_\times \delta \theta$$
6. Sensitivity matrices:
   $$\frac{\partial p_c}{\partial \delta p} = -R_{\text{nom}}^T \in \mathbb{R}^{3 \times 3}$$
   $$\frac{\partial p_c}{\partial \delta \theta} = [p_{c, \text{nom}}]_\times \in \mathbb{R}^{3 \times 3}$$

**Final Result:**
$$\frac{\partial p_c}{\partial \delta x} = \begin{bmatrix} -R_{\text{nom}}^T & 0_{3\times 3} & [p_{c, \text{nom}}]_\times & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix}$$

---

### Problem 10.5 (Worked Example): Lie Group Quaternion Error Injection Step
**Problem Statement:** The ESKF measurement update produces an estimated orientation correction $\hat{\delta \theta} = [0.02, -0.04, 0.01]^T\text{ rad}$. The current nominal quaternion is $q_{\text{nom}} = [0.707107, 0, 0.707107, 0]^T$ ($90^\circ$ pitch).
Execute the exact Lie group error injection and normalize the resulting quaternion.

**Step-by-Step Derivation:**
1. Compute error quaternion $\delta q = \exp(\hat{\delta \theta} / 2)$:
   $$\|\hat{\delta \theta}\| = \sqrt{0.02^2 + (-0.04)^2 + 0.01^2} = \sqrt{0.0004 + 0.0016 + 0.0001} = \sqrt{0.0021} \approx 0.04582576\text{ rad}$$
   $$\frac{\|\hat{\delta \theta}\|}{2} \approx 0.02291288\text{ rad}$$
   $$\cos(0.022913) \approx 0.999737$$
   $$\sin(0.022913) \approx 0.022911$$
   $$\delta q = \begin{bmatrix} 0.999737 \\ \frac{0.02}{0.045826} (0.022911) \\ \frac{-0.04}{0.045826} (0.022911) \\ \frac{0.01}{0.045826} (0.022911) \end{bmatrix} = \begin{bmatrix} 0.999737 \\ 0.010000 \\ -0.020000 \\ 0.005000 \end{bmatrix}$$
2. Quaternion multiplication $q_{\text{new}} = q_{\text{nom}} \otimes \delta q$:
   Given $q_{\text{nom}} = [w_1, x_1, y_1, z_1]^T = [0.707107, 0, 0.707107, 0]^T$.
   $$\delta q = [w_2, x_2, y_2, z_2]^T = [0.999737, 0.010, -0.020, 0.005]^T$$
   Formulas:
   $$w_{\text{new}} = w_1 w_2 - x_1 x_2 - y_1 y_2 - z_1 z_2 = (0.707107)(0.999737) - (0.707107)(-0.020) = 0.706921 + 0.014142 = 0.721063$$
   $$x_{\text{new}} = w_1 x_2 + x_1 w_2 + y_1 z_2 - z_1 y_2 = (0.707107)(0.010) + (0.707107)(0.005) = 0.007071 + 0.003536 = 0.010607$$
   $$y_{\text{new}} = w_1 y_2 - x_1 z_2 + y_1 w_2 + z_1 x_2 = (0.707107)(-0.020) + (0.707107)(0.999737) = -0.014142 + 0.706921 = 0.692779$$
   $$z_{\text{new}} = w_1 z_2 + x_1 y_2 - y_1 x_2 + z_1 w_2 = (0.707107)(0.005) - (0.707107)(0.010) = 0.003536 - 0.007071 = -0.003535$$
3. Normalization:
   $$\|q_{\text{new}}\| = \sqrt{0.721063^2 + 0.010607^2 + 0.692779^2 + (-0.003535)^2} = \sqrt{0.519932 + 0.000112 + 0.479943 + 0.000012} = \sqrt{1.000000} = 1.000000$$

**Final Result:**
$$q_{\text{new}} = [0.721063, \, 0.010607, \, 0.692779, \, -0.003535]^T$$

---

### Problem 10.6 (Worked Example): Gyroscope Bias Unobservability in Pure Acceleration
**Problem Statement:** An aerial robot hovers without rotating ($\omega = 0, R = I$). It receives GPS position updates $z = p + v$. Prove via the observability matrix that the gyroscope bias $b_g$ is mathematically unobservable from position measurements alone during unaccelerated hover.

**Step-by-Step Derivation:**
1. Error dynamics matrix during hover ($R = I, a = [0, 0, g]^T, \omega = 0$):
   $$\delta \dot{p} = \delta v$$
   $$\delta \dot{v} = -[g]_\times \delta \theta - \delta b_a$$
   $$\delta \dot{\theta} = -\delta b_g$$
   $$\delta \dot{b}_a = 0, \quad \delta \dot{b}_g = 0$$
2. Let $g = [0, 0, -g_0]^T$. Then:
   $$-[g]_\times = \begin{bmatrix} 0 & -g_0 & 0 \\ g_0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
3. Differentiating position output:
   $$z = \delta p$$
   $$\dot{z} = \delta v$$
   $$\ddot{z} = \delta \dot{v} = -[g]_\times \delta \theta - \delta b_a$$
   $$z^{(3)} = -[g]_\times \delta \dot{\theta} - \delta \dot{b}_a = -[g]_\times (-\delta b_g) = [g]_\times \delta b_g$$
4. Look at the $z$-axis (yaw):
   $$[g]_\times \delta b_g = \begin{bmatrix} 0 & g_0 & 0 \\ -g_0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} \delta b_{gx} \\ \delta b_{gy} \\ \delta b_{gz} \end{bmatrix} = \begin{bmatrix} g_0 \delta b_{gy} \\ -g_0 \delta b_{gx} \\ 0 \end{bmatrix}$$
   Notice that $\delta b_{gz}$ (the vertical yaw gyro bias) is multiplied by 0!
   It does not appear in $z, \dot{z}, \ddot{z}, z^{(3)}$, or any higher derivative.
5. Therefore, the yaw gyro bias $\delta b_{gz}$ is strictly in the nullspace of the observability matrix.
   *Physical Meaning:* Tilting causes gravity leakage into the horizontal accelerometers, enabling the filter to observe roll and pitch gyro biases ($b_{gx}, b_{gy}$). But horizontal rotation around the gravity vector causes zero gravitational change, making yaw bias completely unobservable without a magnetometer or visual feature tracker.

**Final Result:**
$$\operatorname{ker}(\mathcal{O}) \supset \operatorname{span}\left([0, \dots, \delta b_{gz}]^T\right) \implies \mathbf{Yaw\ gyro\ bias\ is\ mathematically\ unobservable}$$

---

### Problem 10.7 (Worked Example): Zero-Velocity Update (ZUPT) Constraint
**Problem Statement:** A humanoid robot or walking biped has its foot planted firmly on the ground. A Zero-Velocity detector triggers a pseudo-measurement $z_{\text{ZUPT}} = [0, 0, 0]^T\text{ m/s}$ with noise covariance $R_{\text{ZUPT}} = 10^{-4} I_3\text{ (m/s)}^2$.
1. Formulate the $3 \times 15$ measurement matrix $H_{\text{ZUPT}}$.
2. If velocity error covariance before ZUPT is $P_{vv} = 0.04 I_3$, compute the velocity Kalman gain and updated velocity variance.

**Step-by-Step Derivation:**
1. Measurement sensitivity:
   $z_{\text{ZUPT}}$ observes true velocity $v_t = v_{\text{nom}} + \delta v = 0$.
   Residual: $y = 0 - v_{\text{nom}} = -\delta v + v$.
   $$H_{\text{ZUPT}} = \begin{bmatrix} 0_{3\times 3} & I_3 & 0_{3\times 3} & 0_{3\times 3} & 0_{3\times 3} \end{bmatrix} \in \mathbb{R}^{3 \times 15}$$
2. Scalar decoupled update along each axis:
   Prior variance $P^- = 0.04$, measurement noise $R = 0.0001$.
   $$S = P^- + R = 0.04 + 0.0001 = 0.0401$$
   $$K = \frac{P^-}{S} = \frac{0.04}{0.0401} \approx 0.9975$$
   Updated variance:
   $$P^+ = (1 - K) P^- = (1 - 0.9975)(0.04) \approx (0.0025)(0.04) = 0.00009975 \approx 10^{-4}\text{ m}^2/\text{s}^2$$
3. Result:
   Velocity uncertainty contracts by a factor of 400 ($\sigma_v$ drops from $20\text{ cm/s}$ to $1\text{ cm/s}$), resetting accumulated foot drift.

**Final Result:**
$$K \approx 0.9975, \quad P_{vv}^+ \approx 1.0 \times 10^{-4} I_3\text{ m}^2/\text{s}^2$$

---

### Problem 10.8 (Worked Example): Accelerometer Bias Drift over 60 Seconds
**Problem Statement:** An uncalibrated drone accelerometer has constant unestimated bias $b_a = 0.05\text{ m/s}^2$ along the forward axis. If the robot travels for $t = 60\text{ s}$ without external position or velocity measurements, compute the resulting velocity error $\Delta v(60)$ and position drift $\Delta p(60)$.

**Step-by-Step Derivation:**
1. Error kinematics:
   $$\dot{v} = b_a \implies \Delta v(t) = b_a t$$
   $$\dot{p} = v \implies \Delta p(t) = \frac{1}{2} b_a t^2$$
2. Evaluate at $t = 60\text{ s}$:
   $$\Delta v(60) = 0.05 \times 60 = 3.0\text{ m/s}$$
   $$\Delta p(60) = \frac{1}{2} (0.05) (60)^2 = 0.025 \times 3600 = 90.0\text{ m}$$

**Final Result:**
$$\Delta v(60) = 3.0\text{ m/s}, \quad \Delta p(60) = 90.0\text{ m}$$
A tiny $5\text{ cm/s}^2$ bias causes nearly a 100-meter crash within 1 minute.

---

### Problem 10.9 (Worked Example): Covariance Reset Matrix Projection
**Problem Statement:** Prove that when an attitude error correction $\hat{\delta \theta}$ is injected into the nominal quaternion, the orientation error state $\delta \theta^+ = \delta \theta^- - \hat{\delta \theta}$ satisfies the first-order covariance projection $P_{\theta\theta}^+ \approx (I - \frac{1}{2}[\hat{\delta \theta}]_\times) P_{\theta\theta} (I - \frac{1}{2}[\hat{\delta \theta}]_\times)^T$.

**Step-by-Step Derivation:**
1. By the Baker-Campbell-Hausdorff (BCH) formula on $SO(3)$:
   $$\operatorname{Exp}(\delta \theta^+) = \operatorname{Exp}(-\hat{\delta \theta}) \operatorname{Exp}(\delta \theta^-) \approx \operatorname{Exp}\left( \delta \theta^- - \hat{\delta \theta} - \frac{1}{2} [\hat{\delta \theta}]_\times \delta \theta^- \right)$$
2. For small perturbations:
   $$\delta \theta^+ \approx \left( I - \frac{1}{2}[\hat{\delta \theta}]_\times \right) (\delta \theta^- - \hat{\delta \theta})$$
3. Taking covariance:
   $$P_{\theta\theta}^+ = \mathbb{E}[\delta \theta^+ (\delta \theta^+)^T] = \left( I - \frac{1}{2}[\hat{\delta \theta}]_\times \right) P_{\theta\theta} \left( I - \frac{1}{2}[\hat{\delta \theta}]_\times \right)^T \quad \blacksquare$$

---

### Problem 10.10 (Worked Example): High-Rate IMU Discretization via Mid-Point Method
**Problem Statement:** Write the exact numerical update equations for the nominal state $(p, v, q)$ using mid-point (Heun’s) integration over IMU interval $\Delta t$.

**Step-by-Step Derivation:**
1. Inputs: $(a_{b, k-1}, \omega_{b, k-1})$ and $(a_{b, k}, \omega_{b, k})$.
2. Mid-point angular rate:
   $$\bar{\omega} = \frac{1}{2}(\omega_{b, k-1} + \omega_{b, k}) - b_g$$
   $$\Delta \theta = \bar{\omega} \Delta t$$
   $$q_k = q_{k-1} \otimes \begin{bmatrix} \cos(\|\Delta \theta\|/2) \\ \frac{\Delta \theta}{\|\Delta \theta\|} \sin(\|\Delta \theta\|/2) \end{bmatrix}$$
3. Mid-point acceleration in navigation frame:
   $$a_{n, k-1} = R(q_{k-1}) (a_{b, k-1} - b_a) + g^n$$
   $$a_{n, k} = R(q_k) (a_{b, k} - b_a) + g^n$$
   $$\bar{a}_n = \frac{1}{2}(a_{n, k-1} + a_{n, k})$$
4. Velocity and Position:
   $$v_k = v_{k-1} + \bar{a}_n \Delta t$$
   $$p_k = p_{k-1} + v_{k-1} \Delta t + \frac{1}{2} \bar{a}_n \Delta t^2$$

**Final Result:**
Mid-point integration achieves 2nd-order Runge-Kutta accuracy ($\mathcal{O}(\Delta t^2)$), suppressing truncation drift.

---

### Problem 10.11 (Solved Exercise): Number of Parameters: Quaternions vs Euler Angles
**Problem Statement:** Why does the ESKF use unit quaternions $q \in \mathbb{S}^3$ for nominal state propagation but a 3D rotation vector $\delta \theta \in \mathbb{R}^3$ for error state estimation?

**Step-by-Step Solution:**
1. Nominal state: Euler angles suffer from gimbal lock (singularity at pitch $\pm 90^\circ$). Quaternions provide smooth, singularity-free global parameterization of $SO(3)$.
2. Error state: Quaternions have 4 parameters with a unit-norm constraint ($\|q\| = 1$), producing a singular $4 \times 4$ covariance. The minimal 3D tangent vector $\delta \theta \in \mathfrak{so}(3)$ has no constraints, producing a non-singular $3 \times 3$ covariance. $\blacksquare$

---

### Problem 10.12 (Solved Exercise): Multipath Rejection in GPS Fusion
**Problem Statement:** In an urban canyon, a GPS position measurement jumps by $50\text{ m}$ due to multipath reflection from a skyscraper. If prior position variance is $P = 1.0\text{ m}^2$ and GPS noise is $R = 4.0\text{ m}^2$, compute the NIS test statistic and show that Chi-square gating rejects this fault.

**Step-by-Step Solution:**
1. Residual: $y = 50.0\text{ m}$.
2. Innovation variance: $S = P + R = 1.0 + 4.0 = 5.0\text{ m}^2$.
3. Normalized Innovation Squared:
   $$\epsilon = \frac{y^2}{S} = \frac{2500}{5.0} = 500$$
4. Threshold for 1 DoF at $\alpha = 0.001$: $\chi^2(1)_{0.999} = 10.828$.
5. Since $\epsilon = 500 \gg 10.828$, the measurement is decisively rejected as an outlier.

**Final Answer:**
$$\epsilon = 500 > 10.828 \implies \mathbf{Measurement\ Rejected}$$

---

### Problem 10.13 (Solved Exercise): Accelerometer Gravity Vector Normalization
**Problem Statement:** In static initial alignment, a stationary robot measures specific force $a_b = [0.1, -0.2, 9.8]^T\text{ m/s}^2$. Compute the estimated roll and pitch angles.

**Step-by-Step Solution:**
1. In static conditions, $a_b = -R_n^b g^n = R_n^b [0, 0, g]^T$.
   For roll $\phi$ and pitch $\theta$:
   $$a_{bx} = -g \sin\theta \implies \sin\theta = -\frac{a_{bx}}{g} = -\frac{0.1}{9.80665} \approx -0.0102 \implies \theta \approx -0.58^\circ$$
   $$a_{by} = g \cos\theta \sin\phi \implies \sin\phi \approx \frac{a_{by}}{g} = \frac{-0.2}{9.80665} \approx -0.0204 \implies \phi \approx -1.17^\circ$$

**Final Answer:**
$$\text{Roll } \phi \approx -1.17^\circ, \quad \text{Pitch } \theta \approx -0.58^\circ$$

---

### Problem 10.14 (Solved Exercise): Visual Keyframe Delay Handling
**Problem Statement:** Visual odometry takes $50\text{ ms}$ of compute time, delivering pose estimates at time $t - 50\text{ ms}$. How does a production ESKF buffer and apply this delayed visual measurement?

**Step-by-Step Solution:**
1. Maintain an IMU state ring buffer storing nominal states $(p, v, q, b)$ and covariance $P$ at every high-rate step ($1\text{ kHz}$).
2. When the VO estimate for timestamp $t - 50\text{ ms}$ arrives:
   - Interpolate the stored nominal state at $t - 50\text{ ms}$.
   - Compute visual innovation $y = z_{\text{VO}} - p_{\text{nom}}(t - 50\text{ ms})$.
   - Execute the measurement update and error injection on the historical state at $t - 50\text{ ms}$.
   - Re-integrate all subsequent IMU packets up to the current timestamp $t$. $\blacksquare$

---

### Problem 10.15 (Solved Exercise): Continuous Noise Spectral Density of IMU
**Problem Statement:** An IMU datasheet specifies accelerometer noise density $N_a = 100\text{ }\mu\text{g}/\sqrt{\text{Hz}}$. Convert this into SI continuous spectral density $Q_c$ in $(\text{m/s}^2)^2/\text{Hz}$.

**Step-by-Step Solution:**
1. $1\text{ }\mu\text{g} = 10^{-6} \times 9.80665\text{ m/s}^2 \approx 9.80665 \times 10^{-6}\text{ m/s}^2$.
2. $N_a = 100 \times 9.80665 \times 10^{-6} = 9.80665 \times 10^{-4}\text{ m/s}^2/\sqrt{\text{Hz}}$.
3. Continuous spectral density:
   $$Q_c = N_a^2 = (9.80665 \times 10^{-4})^2 \approx 9.617 \times 10^{-7}\text{ (m/s}^2)^2/\text{Hz}$$

**Final Answer:**
$$Q_c \approx 9.617 \times 10^{-7}\text{ m}^2/\text{s}^3$$

---

### Problem 10.16 (Solved Exercise): Skew-Symmetric Matrix Properties
**Problem Statement:** Verify the identity $[\omega]_\times v = -[v]_\times \omega$ for $\omega = [1, 2, 3]^T, v = [4, 5, 6]^T$.

**Step-by-Step Solution:**
1. Skew-symmetric multiplication corresponds to the vector cross-product:
   $$[\omega]_\times v = \omega \times v$$
2. Since cross-product is anti-commutative:
   $$\omega \times v = -(v \times \omega) = -[v]_\times \omega$$
3. Numerical check:
   $$\omega \times v = [2(6) - 3(5), \, 3(4) - 1(6), \, 1(5) - 2(4)]^T = [-3, \, 6, \, -3]^T$$
   $$-[v]_\times \omega = -[5(3) - 6(2), \, 6(1) - 4(3), \, 4(2) - 5(1)]^T = -[3, \, -6, \, 3]^T = [-3, \, 6, \, -3]^T \quad \blacksquare$$

---

### Problem 10.17 (Solved Exercise): Barometer Altitude Fusion
**Problem Statement:** A barometric pressure sensor provides altitude $z_{\text{baro}} = p_z + v_{\text{baro}}$ with variance $R = 0.25\text{ m}^2$. Write the measurement matrix $H_{\text{baro}} \in \mathbb{R}^{1 \times 15}$.

**Step-by-Step Solution:**
1. $z_{\text{baro}}$ observes the 3rd component of position: $p_z$.
2. In the 15D error state $\delta x = [\delta p_x, \delta p_y, \delta p_z, \dots]^T$:
   $$H_{\text{baro}} = \begin{bmatrix} 0 & 0 & 1 & 0 & 0 & \cdots & 0 \end{bmatrix} \in \mathbb{R}^{1 \times 15}$$

**Final Answer:**
$$H_{\text{baro}} = [0, 0, 1, 0_{1\times 12}]$$

---

### Problem 10.18 (Solved Exercise): Magnetometer Yaw Heading Observability
**Problem Statement:** Explain why adding a 3-axis magnetometer restores observability to the yaw gyroscope bias $\delta b_{gz}$ that was proved unobservable in Problem 10.6.

**Step-by-Step Solution:**
1. The Earth's magnetic field vector $B^n$ has a non-zero horizontal component pointing towards magnetic North: $B^n = [B_N, 0, B_D]^T$.
2. Rotation around the vertical axis (yaw) rotates the horizontal magnetic vector in body coordinates:
   $$B^b = R_n^b(\psi) B^n$$
3. Taking derivative with respect to yaw angle:
   $$\frac{\partial B^b}{\partial \psi} \neq 0$$
4. This adds linearly independent rows to the observability matrix relating $\delta \theta_z$ and $\delta b_{gz}$ to the measurements, making yaw bias fully observable. $\blacksquare$

---

### Problem 10.19 (Solved Exercise): Accelerometer Random Walk Variance Growth
**Problem Statement:** If accelerometer bias is a random walk with $\dot{b}_a = \eta_{ba}$ where $\operatorname{Var}(\eta_{ba}) = Q_{ba} = 10^{-6}\text{ (m/s}^2)^2/\text{s}$, compute the standard deviation of bias drift after $t = 1\text{ hour}$ ($3600\text{ s}$).

**Step-by-Step Solution:**
1. Variance of random walk:
   $$\sigma_{ba}^2(t) = Q_{ba} t$$
2. For $t = 3600\text{ s}$:
   $$\sigma_{ba}^2(3600) = 10^{-6} \times 3600 = 3.6 \times 10^{-3}\text{ (m/s}^2)^2$$
3. Standard deviation:
   $$\sigma_{ba} = \sqrt{3.6 \times 10^{-3}} \approx 0.0600\text{ m/s}^2$$

**Final Answer:**
$$\sigma_{ba} = 6.0\text{ cm/s}^2\text{ after 1 hour}$$

---

### Problem 10.20 (Solved Exercise): Asynchronous Multi-Sensor Pipeline Scheduling
**Problem Statement:** A robot receives IMU at $500\text{ Hz}$, Wheel Encoders at $100\text{ Hz}$, Camera at $30\text{ Hz}$, and GPS at $5\text{ Hz}$. Detail the chronological execution queue for a single $1\text{ s}$ window.

**Step-by-Step Solution:**
1. Maintain an event-driven priority queue sorted by timestamp $t_k$.
2. During $1\text{ s}$, exactly:
   - 500 IMU events trigger nominal strapdown propagation and error covariance prediction ($\Delta t = 2\text{ ms}$).
   - 100 Wheel Encoder events trigger velocity updates.
   - 30 Camera events trigger visual feature/pose updates.
   - 5 GPS events trigger absolute geodetic position updates.
3. Every measurement update executes the ESKF correction, injects error into the nominal state, resets $\delta x \leftarrow 0$, and continues high-rate IMU propagation. $\blacksquare$


---

# Chapter 11: Optimal Smoothing and Fault Detection: Rauch-Tung-Striebel (RTS) and Chi-Square Gating

## 11.1 Introduction: Causal Real-Time Filtering vs Non-Causal Optimal Smoothing

In real-time feedback control, an autonomous robot must act causally: at time step $k$, the controller can only utilize sensor observations received up to the present moment, computing the causal filtering posterior $p(x_k | z_{1:k})$.

However, in numerous critical robotic and scientific applications—post-mission trajectory reconstruction, ground-truth generation for sensor calibration, map optimization in SLAM, flight test data analysis, and fixed-lag visual-inertial pipelines—we have access to future measurements $z_{k+1}, \dots, z_N$.

By conditioning on the **entire measurement history** $z_{1:N}$ where $N > k$, the **optimal fixed-interval smoother** $p(x_k | z_{1:N})$ extracts future measurement information backwards through the dynamic equations of motion, dramatically reducing estimation variance and eliminating causal filtering phase lag.

Furthermore, in real physical operating environments, sensors suffer from non-Gaussian faults: GPS multipath spikes, visual tracking losses, LiDAR dust reflections, and hardware sensor failures. Feeding these corrupt measurements into a Kalman filter causes catastrophic belief corruption. A production state estimator requires rigorous statistical fault detection through **Chi-square innovation gating**.

In this chapter, we derive the classical **Rauch-Tung-Striebel (RTS) backward smoother**, prove monotonic variance contraction ($P_{k|N} \le P_{k|k}$), formulate the Normalized Innovation Squared (NIS) and Normalized Estimation Error Squared (NEES) metrics, establish Chi-square outlier rejection algorithms, and solve 20 rigorous problems.

---

## 11.2 The Three Classes of Optimal Smoothers

Depending on the operational time horizon, optimal smoothers are classified into three distinct architectures:

1. **Fixed-Interval Smoothing:**
   The total observation time interval $[0, T]$ is fixed with $N$ total measurements. The algorithm computes the smoothed state trajectory $\hat{x}_{k|N}$ for all $k \in [0, N]$.
   *Applications:* Post-flight trajectory reconstruction, SLAM loop closure, calibration.
2. **Fixed-Lag Smoothing:**
   Estimates the state at a constant time lag $L$: $\hat{x}_{k-L|k}$. As new measurements arrive at step $k$, the estimate at step $k-L$ is updated.
   *Applications:* Real-time vision-based navigation where camera processing latency is constant ($L \approx 3\text{--}5$ frames).
3. **Fixed-Point Smoothing:**
   Estimates the state at a single specific historical instant $k_0$: $\hat{x}_{k_0|k}$ as time $k$ marches forward.
   *Applications:* Initial state determination, launch vehicle staging point estimation.

---

## 11.3 The Rauch-Tung-Striebel (RTS) Fixed-Interval Smoother

In 1965, Herbert E. Rauch, F. Tung, and Charlotte T. Striebel published an exceptionally elegant two-pass recursive algorithm for optimal fixed-interval smoothing in linear dynamic systems.

```
+---------------------------------------------------------------------------------------------------+
|                        RAUCH-TUNG-STRIEBEL (RTS) SMOOTHER PIPELINE                                |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
| FORWARD PASS (Causal Kalman Filter: k = 0, 1, ..., N):                                            |
|   - Compute and store trajectory in memory cache:                                                 |
|       { \hat{x}_{k|k-1}, P_{k|k-1}, \hat{x}_{k|k}, P_{k|k}, F_k }                                  |
|   - Final boundary condition at step N:                                                           |
|       \hat{x}_{N|N} \text{ and } P_{N|N} are already optimal!                                      |
|                                                                                                   |
| BACKWARD PASS (Optimal Smoother: k = N-1, N-2, ..., 0):                                           |
|   1. Compute Smoother Gain Matrix:                                                                |
|         C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}                                                    |
|                                                                                                   |
|   2. Backward State Mean Update:                                                                  |
|         \hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - \hat{x}_{k+1|k})                   |
|                                                                                                   |
|   3. Backward Covariance Update:                                                                  |
|         P_{k|N} = P_{k|k} + C_k (P_{k+1|N} - P_{k+1|k}) C_k^T                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 11.3.1 Mathematical Derivation of RTS Equations
The joint distribution of state $x_k$ and future state $x_{k+1}$ conditioned on measurements up to step $k$ ($Z_{1:k}$) is Gaussian:

$$p(x_k, x_{k+1} | Z_{1:k}) = \mathcal{N}\left( \begin{bmatrix} \hat{x}_{k|k} \\ \hat{x}_{k+1|k} \end{bmatrix}, \begin{bmatrix} P_{k|k} & P_{k|k} F_{k+1}^T \\ F_{k+1} P_{k|k} & P_{k+1|k} \end{bmatrix} \right)$$

Applying the Gaussian conditioning theorem to find $p(x_k | x_{k+1}, Z_{1:k})$:
$$\mathbb{E}[x_k | x_{k+1}, Z_{1:k}] = \hat{x}_{k|k} + P_{k|k} F_{k+1}^T P_{k+1|k}^{-1} (x_{k+1} - \hat{x}_{k+1|k}) = \hat{x}_{k|k} + C_k (x_{k+1} - \hat{x}_{k+1|k})$$
where $C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$ is the **Smoother Gain Matrix**.

The conditional covariance is:
$$\operatorname{Cov}(x_k | x_{k+1}, Z_{1:k}) = P_{k|k} - C_k P_{k+1|k} C_k^T$$

Now, condition on the complete future measurement dataset $Z_{1:N}$. By the Markov property of state transitions, given $x_{k+1}$, past state $x_k$ is conditionally independent of future measurements $z_{k+1:N}$:
$$p(x_k | x_{k+1}, Z_{1:N}) = p(x_k | x_{k+1}, Z_{1:k})$$

Applying the law of total expectation:
$$\hat{x}_{k|N} = \mathbb{E}[x_k | Z_{1:N}] = \mathbb{E}\left[ \mathbb{E}[x_k | x_{k+1}, Z_{1:k}] \Big| Z_{1:N} \right]$$
$$= \mathbb{E}\left[ \hat{x}_{k|k} + C_k (x_{k+1} - \hat{x}_{k+1|k}) \Big| Z_{1:N} \right]$$
$$= \hat{x}_{k|k} + C_k (\mathbb{E}[x_{k+1} | Z_{1:N}] - \hat{x}_{k+1|k})$$
$$\hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - \hat{x}_{k+1|k})$$

Applying the law of total variance:
$$\operatorname{Cov}(x_k | Z_{1:N}) = \mathbb{E}[\operatorname{Cov}(x_k | x_{k+1}, Z_{1:N})] + \operatorname{Cov}(\mathbb{E}[x_k | x_{k+1}, Z_{1:N}])$$
$$= (P_{k|k} - C_k P_{k+1|k} C_k^T) + \operatorname{Cov}(\hat{x}_{k|k} + C_k x_{k+1} | Z_{1:N})$$
$$= P_{k|k} - C_k P_{k+1|k} C_k^T + C_k P_{k+1|N} C_k^T$$
$$P_{k|N} = P_{k|k} + C_k (P_{k+1|N} - P_{k+1|k}) C_k^T$$

$\blacksquare$

---

## 11.4 Monotonic Variance Contraction in RTS Smoothing

A fundamental theoretical property of the RTS smoother is that the smoothed covariance is strictly less than or equal to the causal filtering covariance:

$$P_{k|N} \le P_{k|k} \quad \forall \, k \in [0, N]$$

### Proof:
Recall from Chapter 5 that every Kalman measurement update contracts prior covariance:
$$P_{k+1|k+1} \le P_{k+1|k} \implies P_{k+1|k+1} - P_{k+1|k} \le 0$$

At the terminal step $k = N-1$:
$$P_{N|N} - P_{N|N-1} \le 0$$

Since $C_{N-1} (P_{N|N} - P_{N|N-1}) C_{N-1}^T$ is a congruence transformation of a negative semi-definite matrix:
$$C_{N-1} (P_{N|N} - P_{N|N-1}) C_{N-1}^T \le 0$$

Therefore:
$$P_{N-1|N} = P_{N-1|N-1} + C_{N-1} (P_{N|N} - P_{N|N-1}) C_{N-1}^T \le P_{N-1|N-1}$$

By induction backwards from $k = N-1$ down to $0$, $P_{k+1|N} - P_{k+1|k} \le 0$ for all $k$. Hence:
$$P_{k|N} \le P_{k|k} \quad \blacksquare$$

The RTS smoother strictly reduces or maintains uncertainty across the entire trajectory.

---

## 11.5 Statistical Fault Detection: Chi-Square Innovation Gating

In real-world robotics, sensors occasionally generate outliers—gross errors caused by camera lens flare, GPS multi-path, or LiDAR dust particles—that violate the Gaussian noise model.

### 11.5.1 Normalized Innovation Squared (NIS)
Let the measurement innovation at step $k$ be $y_k = z_k - H_k \hat{x}_{k|k-1} \in \mathbb{R}^m$, with innovation covariance $S_k = H_k P_{k|k-1} H_k^T + R_k \in \mathbb{S}_{++}^m$.
The **Normalized Innovation Squared (NIS)** test statistic is defined by the squared Mahalanobis distance:

$$\epsilon_{y, k} = y_k^T S_k^{-1} y_k$$

### 11.5.2 Distribution under the Null Hypothesis
Under the null hypothesis $H_0$ that the system dynamic model is correct and the sensor noise is Gaussian:
$$y_k \sim \mathcal{N}(0, S_k)$$
Since $S_k$ is symmetric positive-definite, it admits Cholesky factorization $S_k = L L^T$.
Let $w = L^{-1} y_k$. Then:
$$\mathbb{E}[w] = L^{-1} \mathbb{E}[y_k] = 0$$
$$\operatorname{Cov}(w) = L^{-1} \operatorname{Cov}(y_k) L^{-T} = L^{-1} S_k L^{-T} = L^{-1} (L L^T) L^{-T} = I_m$$
Thus $w \sim \mathcal{N}(0, I_m)$ is a vector of $m$ independent standard normal variables.
The test statistic is:
$$\epsilon_{y, k} = y_k^T S_k^{-1} y_k = y_k^T L^{-T} L^{-1} y_k = w^T w = \sum_{i=1}^m w_i^2$$

By definition, the sum of squares of $m$ independent standard normal random variables follows a **Chi-square distribution with $m$ degrees of freedom**:

$$\mathbf{\epsilon_{y, k} \sim \chi_m^2}$$

### 11.5.3 Chi-Square Hypothesis Testing and Gating Rules
To detect and reject outliers, we establish a statistical confidence threshold $\gamma_\alpha$ such that:
$$P(\epsilon_{y, k} > \gamma_\alpha | H_0) = \alpha$$
where $\alpha$ is the significance level (false alarm rate, typically $\alpha = 0.05, 0.01,$ or $0.001$).

| Measurement Dimension $m$ | $95\%$ Confidence ($\alpha = 0.05$) | $99\%$ Confidence ($\alpha = 0.01$) | $99.9\%$ Confidence ($\alpha = 0.001$) |
| :---: | :---: | :---: | :---: |
| **$m = 1$** (Scalar Sensor) | $3.841$ | $6.635$ | $10.828$ |
| **$m = 2$** (2D Position / Pixel) | $5.991$ | $9.210$ | $13.816$ |
| **$m = 3$** (3D Position) | $7.815$ | $11.345$ | $16.266$ |
| **$m = 4$** (GPS Pseudorange) | $9.488$ | $13.277$ | $18.467$ |
| **$m = 6$** (Full 6-DoF Pose) | $12.592$ | $16.812$ | $22.458$ |

### Gating Decision Logic:
- **Case 1: Acceptance ($\epsilon_{y, k} \le \gamma_\alpha$):**
  The measurement is consistent with prior belief and sensor noise. Execute standard Kalman measurement update.
- **Case 2: Rejection ($\epsilon_{y, k} > \gamma_\alpha$):**
  The measurement is an anomaly or outlier. **Do not update the state.** Set $\hat{x}_{k|k} = \hat{x}_{k|k-1}$ and $P_{k|k} = P_{k|k-1}$.
- **Case 3: Soft Gating (Adaptive Noise Inflation):**
  Rather than binary rejection, inflate measurement noise by an adaptive scaling factor $\kappa > 1$:
  $$\tilde{R}_k = \frac{\epsilon_{y, k}}{\gamma_\alpha} R_k$$
  This allows large maneuvers to be accommodated without filter divergence.

---

## 11.6 Normalized Estimation Error Squared (NEES)

To verify the consistency of a Kalman filter in simulation or benchmark environments where ground-truth state $x_k$ is known, we evaluate the **Normalized Estimation Error Squared (NEES)**:

$$\epsilon_{x, k} = (x_k - \hat{x}_{k|k})^T P_{k|k}^{-1} (x_k - \hat{x}_{k|k}) \sim \chi_n^2$$

For $N_{\text{mc}}$ Monte Carlo runs, the average NEES $\bar{\epsilon}_k = \frac{1}{N_{\text{mc}}} \sum_{i=1}^{N_{\text{mc}}} \epsilon_{x, k}^{(i)}$ satisfies:
$$N_{\text{mc}} \bar{\epsilon}_k \sim \chi_{n \cdot N_{\text{mc}}}^2$$

If $\bar{\epsilon}_k > \text{threshold}$, the filter is **overconfident** (optimistic $P$). If $\bar{\epsilon}_k < \text{threshold}$, the filter is **conservative** (pessimistic $P$).

---

## 11.7 Mathematical Problem Set

### Problem 11.1 (Worked Example): Complete 2-Step RTS Backward Pass
**Problem Statement:** A 1D tracking system has state $x_k$ and transition $F = 1.0, Q = 1.0$.
A 2-step causal filter run produces the cached estimates:
- Step 0: $\hat{x}_{0|0} = 0.0, \quad P_{0|0} = 1.0$.
- Step 1: $\hat{x}_{1|0} = 0.0, \quad P_{1|0} = 2.0$. Measurement $z_1 = 3.0$ arrives ($H = 1, R = 2$).
  $$S_1 = 4.0, \quad K_1 = 0.5, \quad \hat{x}_{1|1} = 1.5, \quad P_{1|1} = 1.0$$
- Step 2: $\hat{x}_{2|1} = 1.5, \quad P_{2|1} = 2.0$. Measurement $z_2 = 5.5$ arrives ($H = 1, R = 2$).
  $$S_2 = 4.0, \quad K_2 = 0.5, \quad \hat{x}_{2|2} = 3.5, \quad P_{2|2} = 1.0$$
Execute the RTS backward smoother to compute smoothed state $\hat{x}_{1|2}, \hat{x}_{0|2}$ and covariances $P_{1|2}, P_{0|2}$.

**Step-by-Step Derivation:**
1. Step $N = 2$ (Terminal Boundary):
   $$\hat{x}_{2|2} = 3.5, \quad P_{2|2} = 1.0$$
2. Backward Pass to Step $k = 1$:
   - Smoother gain:
     $$C_1 = P_{1|1} F^T P_{2|1}^{-1} = 1.0 \times 1.0 \times \frac{1}{2.0} = 0.50$$
   - Smoothed state:
     $$\hat{x}_{1|2} = \hat{x}_{1|1} + C_1 (\hat{x}_{2|2} - \hat{x}_{2|1}) = 1.5 + 0.50 (3.5 - 1.5) = 1.5 + 0.50(2.0) = 1.5 + 1.0 = 2.50$$
     *(Notice: future measurement $z_2 = 5.5$ pulled the estimate at step 1 up from $1.5$ to $2.5$!)*
   - Smoothed covariance:
     $$P_{1|2} = P_{1|1} + C_1 (P_{2|2} - P_{2|1}) C_1^T = 1.0 + (0.5)^2 (1.0 - 2.0) = 1.0 + 0.25 (-1.0) = 1.0 - 0.25 = 0.75$$
     *(Notice: variance contracted from $1.0$ down to $0.75$!).*
3. Backward Pass to Step $k = 0$:
   - Smoother gain:
     $$C_0 = P_{0|0} F^T P_{1|0}^{-1} = 1.0 \times 1.0 \times \frac{1}{2.0} = 0.50$$
   - Smoothed state:
     $$\hat{x}_{0|2} = \hat{x}_{0|0} + C_0 (\hat{x}_{1|2} - \hat{x}_{1|0}) = 0.0 + 0.50 (2.50 - 0.0) = 1.25$$
   - Smoothed covariance:
     $$P_{0|2} = P_{0|0} + C_0 (P_{1|2} - P_{1|0}) C_0^T = 1.0 + (0.5)^2 (0.75 - 2.0) = 1.0 + 0.25 (-1.25) = 1.0 - 0.3125 = 0.6875$$

**Final Result:**
$$\hat{x}_{0|2} = 1.25, \quad P_{0|2} = 0.6875; \quad \hat{x}_{1|2} = 2.50, \quad P_{1|2} = 0.7500; \quad \hat{x}_{2|2} = 3.50, \quad P_{2|2} = 1.0000$$

---

### Problem 11.2 (Worked Example): Chi-Square Outlier Gating Test in 2D
**Problem Statement:** A 2D mobile robot has predicted position $\hat{p} = [10.0, 5.0]^T\text{ m}$ with predicted covariance $P = \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 1.0 \end{bmatrix}\text{ m}^2$.
A GPS receiver reports $z_{\text{GPS}} = [14.0, 9.0]^T\text{ m}$ with noise covariance $R = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix}\text{ m}^2$.
1. Compute the innovation vector $y \in \mathbb{R}^2$.
2. Compute the innovation covariance $S \in \mathbb{R}^{2 \times 2}$ and its inverse $S^{-1}$.
3. Compute the Normalized Innovation Squared $\epsilon_y = y^T S^{-1} y$.
4. At a $99\%$ confidence level ($\alpha = 0.01, \gamma = 9.210$), determine whether the GPS measurement should be accepted or rejected.

**Step-by-Step Derivation:**
1. Innovation vector:
   $$y = z_{\text{GPS}} - \hat{p} = \begin{bmatrix} 14.0 - 10.0 \\ 9.0 - 5.0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 4.0 \end{bmatrix}\text{ m}$$
2. Innovation covariance:
   $$S = P + R = \begin{bmatrix} 2.0 & 0.5 \\ 0.5 & 1.0 \end{bmatrix} + \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix} = \begin{bmatrix} 3.0 & 0.5 \\ 0.5 & 2.0 \end{bmatrix}$$
   Determinant:
   $$\det(S) = (3.0)(2.0) - (0.5)^2 = 6.0 - 0.25 = 5.75$$
   Inverse:
   $$S^{-1} = \frac{1}{5.75} \begin{bmatrix} 2.0 & -0.5 \\ -0.5 & 3.0 \end{bmatrix} \approx \begin{bmatrix} 0.347826 & -0.086957 \\ -0.086957 & 0.521739 \end{bmatrix}$$
3. Normalized Innovation Squared (NIS):
   $$S^{-1} y = \frac{1}{5.75} \begin{bmatrix} 2.0(4.0) - 0.5(4.0) \\ -0.5(4.0) + 3.0(4.0) \end{bmatrix} = \frac{1}{5.75} \begin{bmatrix} 8.0 - 2.0 \\ -2.0 + 12.0 \end{bmatrix} = \frac{1}{5.75} \begin{bmatrix} 6.0 \\ 10.0 \end{bmatrix} \approx \begin{bmatrix} 1.043478 \\ 1.739130 \end{bmatrix}$$
   $$\epsilon_y = y^T (S^{-1} y) = \begin{bmatrix} 4.0 & 4.0 \end{bmatrix} \begin{bmatrix} 1.043478 \\ 1.739130 \end{bmatrix} = 4.0(1.043478 + 1.739130) = 4.0(2.782609) \approx 11.1304$$
4. Hypothesis test comparison:
   Degrees of freedom: $m = 2$.
   Critical threshold at $99\%$ confidence: $\chi^2(2)_{0.99} = 9.210$.
   $$\epsilon_y = 11.1304 > 9.210$$
   The test statistic exceeds the $99\%$ threshold ($p \approx 0.0038 < 0.01$).
   The measurement is **rejected** as a statistical outlier.

**Final Result:**
$$\epsilon_y = 11.130 > 9.210 \implies \mathbf{REJECT\ GPS\ MEASUREMENT}$$

---

### Problem 11.3 (Worked Example): Fixed-Lag Smoother Formulation
**Problem Statement:** In visual-inertial odometry, a fixed lag of $L = 2$ frames is used. State is augmented as $X_k = [x_k, x_{k-1}, x_{k-2}]^T$. Write the state transition matrix $F_{\text{aug}}$ and explain how standard Kalman measurement updates at step $k$ immediately smooth historical states $x_{k-1}$ and $x_{k-2}$.

**Step-by-Step Derivation:**
1. Augmented state vector:
   $$X_k = \begin{bmatrix} x_k \\ x_{k-1} \\ x_{k-2} \end{bmatrix} \in \mathbb{R}^{3n}$$
2. Augmented state transition:
   $$X_k = \begin{bmatrix} F & 0 & 0 \\ I_n & 0 & 0 \\ 0 & I_n & 0 \end{bmatrix} \begin{bmatrix} x_{k-1} \\ x_{k-2} \\ x_{k-3} \end{bmatrix} + \begin{bmatrix} I_n \\ 0 \\ 0 \end{bmatrix} w_k$$
3. Augmented Covariance:
   $$P_{\text{aug}} = \begin{bmatrix} P_{00} & P_{01} & P_{02} \\ P_{10} & P_{11} & P_{12} \\ P_{20} & P_{21} & P_{22} \end{bmatrix} \in \mathbb{R}^{3n \times 3n}$$
4. Measurement update at step $k$:
   Measurement $z_k$ observes the current state: $H_{\text{aug}} = [H, 0, 0]$.
   Kalman Gain:
   $$K_{\text{aug}} = P_{\text{aug}} H_{\text{aug}}^T S_k^{-1} = \begin{bmatrix} P_{00} H^T \\ P_{10} H^T \\ P_{20} H^T \end{bmatrix} S_k^{-1} = \begin{bmatrix} K_0 \\ K_1 \\ K_2 \end{bmatrix}$$
5. State update:
   $$\hat{x}_{k-1|k} = \hat{x}_{k-1|k-1} + K_1 (z_k - H \hat{x}_{k|k-1})$$
   $$\hat{x}_{k-2|k} = \hat{x}_{k-2|k-1} + K_2 (z_k - H \hat{x}_{k|k-1})$$
   The measurement $z_k$ directly updates and refines historical states through the off-diagonal cross-covariances $P_{10}$ and $P_{20}$.

**Final Result:**
Augmented state Kalman filter performs real-time causal fixed-lag smoothing.

---

### Problem 11.4 (Worked Example): Asymptotic Variance Reduction of Smoothing over Filtering
**Problem Statement:** For a 1D random walk with position measurements: $x_k = x_{k-1} + w_k, z_k = x_k + v_k$ with $q = 1, r = 1$.
1. Compute the steady-state filtering variance $p_\infty$.
2. Compute the steady-state smoother gain $C_\infty$.
3. Compute the steady-state smoothed variance $p_{\text{smooth},\infty}$ in the interior of a long trajectory ($k \ll N$).
4. Calculate the percentage variance reduction achieved by smoothing.

**Step-by-Step Derivation:**
1. Steady-state filtering prior variance (from Problem 7.3):
   $$p_\infty = \frac{1 + \sqrt{1 + 4(1)(1)}}{2} = \frac{1 + \sqrt{5}}{2} \approx 1.618034\text{ (The Golden Ratio!)}$$
   Filtering posterior variance:
   $$p_{\text{filt}} = \frac{p_\infty r}{p_\infty + r} = \frac{1.618034}{2.618034} = \frac{1}{\phi} = \phi - 1 \approx 0.618034$$
2. Steady-state smoother gain:
   $$C_\infty = p_{\text{filt}} F^T p_\infty^{-1} = \frac{0.618034}{1.618034} \approx 0.381966$$
   Notice that $C_\infty = (\phi - 1)/\phi = 1/\phi^2 \approx 0.381966$.
3. Smoothed variance recursion at steady-state:
   $$p_{\text{smooth}} = p_{\text{filt}} + C_\infty (p_{\text{smooth}} - p_\infty) C_\infty$$
   $$p_{\text{smooth}} (1 - C_\infty^2) = p_{\text{filt}} - C_\infty^2 p_\infty$$
   Substitute $p_{\text{filt}} = 0.618034, p_\infty = 1.618034, C_\infty = 0.381966 \implies C_\infty^2 \approx 0.145898$:
   $$1 - C_\infty^2 = 1 - 0.145898 = 0.854102$$
   $$p_{\text{filt}} - C_\infty^2 p_\infty = 0.618034 - (0.145898)(1.618034) = 0.618034 - 0.236068 = 0.381966$$
   $$p_{\text{smooth}} = \frac{0.381966}{0.854102} \approx 0.447214$$
   Notice: $0.447214 = \frac{1}{\sqrt{5}} = \frac{1}{2.236068}$!
4. Percentage reduction in estimation variance:
   $$\text{Reduction} = \frac{p_{\text{filt}} - p_{\text{smooth}}}{p_{\text{filt}}} = \frac{0.618034 - 0.447214}{0.618034} = \frac{0.170820}{0.618034} \approx 27.64\%$$

**Final Result:**
$$p_{\text{filt}} = 0.6180, \quad p_{\text{smooth}} = 0.4472 = \frac{1}{\sqrt{5}} \quad (\text{Smoothing reduces variance by }27.64\%)$$

---

### Problem 11.5 (Worked Example): Two-Filter Smoother Form (Fraser-Potter)
**Problem Statement:** In 1969, Donald C. Fraser and James E. Potter formulated an alternative smoothing algorithm by running two independent Kalman filters: a forward filter from $0 \to k$, and a backward filter from $N \to k$. Write the information fusion formula combining the forward estimate $(\hat{x}_f, P_f)$ and backward estimate $(\hat{x}_b, P_b)$ into the smoothed estimate $\hat{x}_s$.

**Step-by-Step Derivation:**
1. Forward filter generates causal belief $p(x_k | z_{1:k}) = \mathcal{N}(\hat{x}_f, P_f)$.
2. Backward filter generates anti-causal belief $p(z_{k+1:N} | x_k) \propto \mathcal{N}(\hat{x}_b, P_b)$.
3. By Bayes' theorem, conditioned on the independent forward and backward measurement sets:
   $$p(x_k | z_{1:N}) \propto p(x_k | z_{1:k}) p(z_{k+1:N} | x_k)$$
4. The product of two Gaussian PDFs is Gaussian with information matrix addition:
   $$P_s^{-1} = P_f^{-1} + P_b^{-1}$$
   $$P_s^{-1} \hat{x}_s = P_f^{-1} \hat{x}_f + P_b^{-1} \hat{x}_b$$
5. Solving for smoothed covariance and state:
   $$P_s = (P_f^{-1} + P_b^{-1})^{-1}$$
   $$\hat{x}_s = P_s (P_f^{-1} \hat{x}_f + P_b^{-1} \hat{x}_b)$$

**Final Result:**
Fraser-Potter smoother fuses forward and backward information matrices via $P_s^{-1} = P_f^{-1} + P_b^{-1}$.

---

### Problem 11.6 (Worked Example): Monte Carlo NEES Consistency Evaluation
**Problem Statement:** A 4-state Kalman filter ($n = 4$) is evaluated across $N_{\text{mc}} = 50$ Monte Carlo simulation trials. At step $k = 100$, the average NEES is $\bar{\epsilon}_{100} = 6.2$. Using the $95\%$ two-tailed Chi-square acceptance interval for $N_{\text{mc}} \bar{\epsilon} \sim \chi^2(n \cdot N_{\text{mc}})$, test if the filter is statistically consistent.

**Step-by-Step Derivation:**
1. Degrees of freedom:
   $$d = n \cdot N_{\text{mc}} = 4 \times 50 = 200$$
2. Expected value and standard deviation of $\chi^2(200)$:
   $$\mathbb{E}[\chi^2(d)] = d = 200$$
   $$\operatorname{Var}(\chi^2(d)) = 2 d = 400 \implies \sigma = \sqrt{400} = 20$$
3. For $d = 200$, using Gaussian approximation for $\chi^2$:
   $$95\% \text{ interval: } [d - 1.96\sigma, d + 1.96\sigma] = [200 - 1.96(20), 200 + 1.96(20)] = [200 - 39.2, 200 + 39.2] = [160.8, 239.2]$$
   Dividing by $N_{\text{mc}} = 50$ to get bounds for $\bar{\epsilon}$:
   $$\bar{\epsilon}_{\text{lower}} = \frac{160.8}{50} = 3.216$$
   $$\bar{\epsilon}_{\text{upper}} = \frac{239.2}{50} = 4.784$$
4. Test evaluation:
   $$\bar{\epsilon}_{100} = 6.2 > 4.784$$
5. Conclusion:
   The empirical NEES significantly exceeds the upper $95\%$ bound. The filter estimation error is substantially larger than what its covariance $P$ claims.
   The filter is **statistically inconsistent and overconfident** (optimistic covariance). Process noise $Q$ must be increased or sensor noise $R$ adjusted.

**Final Result:**
$$\bar{\epsilon} = 6.2 \notin [3.22, 4.78] \implies \mathbf{Inconsistent\ (Overconfident\ Filter)}$$

---

### Problem 11.7 (Worked Example): Reversible Dynamic Inversion in Backward Pass
**Problem Statement:** In the RTS smoother gain $C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$, show that if the transition matrix $F$ is invertible, $C_k$ can be computed without inverting the prior covariance $P_{k+1|k}$.

**Step-by-Step Derivation:**
1. Recall covariance prediction:
   $$P_{k+1|k} = F P_{k|k} F^T + Q$$
2. Invert both sides:
   $$P_{k+1|k}^{-1} = (F P_{k|k} F^T + Q)^{-1}$$
3. Applying the push-through matrix identity:
   $$P_{k|k} F^T (F P_{k|k} F^T + Q)^{-1} = (P_{k|k}^{-1} + F^T Q^{-1} F)^{-1} F^T Q^{-1}$$
4. For zero process noise ($Q \to 0$):
   $$C_k = P_{k|k} F^T (F P_{k|k} F^T)^{-1} = P_{k|k} F^T F^{-T} P_{k|k}^{-1} F^{-1} = F^{-1}$$
5. Under deterministic dynamics, the smoother gain is simply the backward dynamic state transition $F^{-1}$. $\blacksquare$

---

### Problem 11.8 (Worked Example): Sequential Chi-Square Gating for Multi-Sensor Suites
**Problem Statement:** A robot receives a 3D sensor packet consisting of horizontal laser range $(x, y)$ and vertical ultrasonic altitude $z$. Instead of rejecting the entire 3D packet when the ultrasonic sensor gets a false echo, formulate the sequential scalar gating pipeline.

**Step-by-Step Derivation:**
1. Assume sensor noise is uncorrelated: $R = \operatorname{diag}(r_x, r_y, r_z)$.
2. Evaluate measurement 1 ($z_x$):
   $$s_x = H_x P H_x^T + r_x \implies \epsilon_x = \frac{(z_x - \hat{x})^2}{s_x}$$
   Test: if $\epsilon_x \le \chi^2(1)_{0.99} = 6.635$, apply scalar update to $(\hat{x}, P)$; else discard $z_x$.
3. Evaluate measurement 2 ($z_y$):
   Using updated covariance $P^{(1)}$, test $\epsilon_y = \frac{(z_y - \hat{y}^{(1)})^2}{s_y}$.
   If $\epsilon_y \le 6.635$, apply update; else discard $z_y$.
4. Evaluate measurement 3 ($z_z$):
   Using updated covariance $P^{(2)}$, test $\epsilon_z = \frac{(z_z - \hat{z}^{(2)})^2}{s_z}$.
   If $\epsilon_z > 6.635$ (ultrasonic glitch), discard $z_z$.
5. Benefit:
   Horizontal position $(x, y)$ was successfully updated, while the corrupt vertical altitude was isolated and eliminated.

**Final Result:**
Sequential gating isolates faulty sensor channels without discarding valid concurrent channels.

---

### Problem 11.9 (Worked Example): Smoother Boundary Condition at $k = 0$
**Problem Statement:** In a 100-step trajectory, prove why the smoothed initial state $\hat{x}_{0|N}$ is vastly more accurate than the filtered initial estimate $\hat{x}_{0|0}$.

**Step-by-Step Derivation:**
1. At $k = 0$, the filter has only seen $z_0$:
   $$P_{0|0}^{-1} = P_{\text{prior}}^{-1} + H_0^T R_0^{-1} H_0$$
2. The smoothed estimate $\hat{x}_{0|N}$ is conditioned on all $N$ measurements $\{z_0, z_1, \dots, z_N\}$.
3. In information form:
   $$P_{0|N}^{-1} = P_{\text{prior}}^{-1} + \sum_{k=0}^N \Phi^T(k, 0) H_k^T R_k^{-1} H_k \Phi(k, 0)$$
4. The information matrix is accumulated over all $N$ future measurements.
   As $N \to \infty$, $P_{0|N}^{-1} \to \infty \implies P_{0|N} \to 0$.
   The initial position and velocity can be resolved with near-arbitrary precision in post-processing. $\blacksquare$

---

### Problem 11.10 (Worked Example): Memory Complexity of RTS Smoother
**Problem Statement:** A high-rate robotics pipeline runs at $500\text{ Hz}$ for $10\text{ minutes}$ ($600\text{ s}$) with state dimension $n = 15$. Compute the total memory required in megabytes (MB) to cache the forward filter trajectory for RTS backward smoothing in 64-bit IEEE double precision.

**Step-by-Step Derivation:**
1. Number of time steps:
   $$N = 500\text{ Hz} \times 600\text{ s} = 300,000\text{ steps}$$
2. Storage per time step:
   - State vector $\hat{x}_{k|k} \in \mathbb{R}^{15}$: 15 doubles.
   - Predicted state $\hat{x}_{k+1|k} \in \mathbb{R}^{15}$: 15 doubles.
   - Covariance $P_{k|k} \in \mathbb{S}^{15}$: symmetric, $\frac{15 \times 16}{2} = 120$ doubles.
   - Predicted covariance $P_{k+1|k} \in \mathbb{S}^{15}$: 120 doubles.
   - Total doubles per step: $15 + 15 + 120 + 120 = 270$ doubles.
3. Total bytes:
   Each double is 8 bytes.
   $$\text{Bytes per step} = 270 \times 8 = 2,160\text{ bytes} \approx 2.16\text{ KB}$$
   $$\text{Total bytes} = 300,000 \times 2,160 = 648,000,000\text{ bytes}$$
4. In megabytes:
   $$\text{Total Memory} = \frac{648,000,000}{1024^2} \approx 617.98\text{ MB}$$

**Final Result:**
$$\text{Memory Required} \approx 618\text{ MB}$$
Easily fits in RAM on modern robotics onboard computers.

---

### Problem 11.11 (Solved Exercise): Chi-Square Quantiles for Alpha = 0.05
**Problem Statement:** Look up or compute the critical value $\chi^2(m)_{0.95}$ for $m = 1, 2, 3, 4, 5$.

**Step-by-Step Solution:**
From the cumulative Chi-square distribution:
- $m = 1$: $3.841$
- $m = 2$: $5.991$
- $m = 3$: $7.815$
- $m = 4$: $9.488$
- $m = 5$: $11.070$

**Final Answer:**
$$\chi_{0.95}^2 = \{3.841, 5.991, 7.815, 9.488, 11.070\}$$

---

### Problem 11.12 (Solved Exercise): Smoother Symmetry Preservation
**Problem Statement:** Prove that the RTS backward covariance update $P_{k|N} = P_{k|k} + C_k (P_{k+1|N} - P_{k+1|k}) C_k^T$ guarantees that $P_{k|N}$ is symmetric.

**Step-by-Step Solution:**
1. $P_{k|k}$ is symmetric by definition ($P_{k|k}^T = P_{k|k}$).
2. The perturbation term is $\Delta = C_k (P_{k+1|N} - P_{k+1|k}) C_k^T$.
3. Take transpose:
   $$\Delta^T = (C_k (P_{k+1|N} - P_{k+1|k}) C_k^T)^T = (C_k^T)^T (P_{k+1|N} - P_{k+1|k})^T C_k^T = C_k (P_{k+1|N} - P_{k+1|k}) C_k^T = \Delta$$
4. Since the sum of two symmetric matrices is symmetric, $P_{k|N}$ is strictly symmetric. $\blacksquare$

---

### Problem 11.13 (Solved Exercise): Terminal Boundary Condition of RTS
**Problem Statement:** Show that at the final step $k = N$, the smoother update equations evaluate to $\hat{x}_{N|N}$ and $P_{N|N}$.

**Step-by-Step Solution:**
At step $N$, the forward filter has already processed all measurements $z_{1:N}$.
By definition:
$$\hat{x}_{N|N} = \mathbb{E}[x_N | z_{1:N}]$$
$$P_{N|N} = \operatorname{Cov}(x_N | z_{1:N})$$
No backward step is required at $k = N$; it serves as the initial boundary condition for the backward recursion. $\blacksquare$

---

### Problem 11.14 (Solved Exercise): False Alarm Rate in Innovation Gating
**Problem Statement:** If a filter sets its rejection gate at $\gamma = \chi^2(3)_{0.99} = 11.345$, on average how many perfectly valid, fault-free measurements will be rejected out of 10,000 incoming updates?

**Step-by-Step Solution:**
1. Significance level $\alpha = 1 - 0.99 = 0.01 = 1\%$.
2. For $N = 10,000$ independent Gaussian measurements under $H_0$:
   $$\text{Expected Rejections} = \alpha \times N = 0.01 \times 10,000 = 100$$
3. Exactly $100$ valid measurements are discarded as false alarms.

**Final Answer:**
$$100\text{ valid measurements (1.0\%)}$$

---

### Problem 11.15 (Solved Exercise): Fixed-Interval vs Fixed-Lag Latency
**Problem Statement:** Compare the algorithmic latency of fixed-interval smoothing versus fixed-lag smoothing in an autonomous driving car.

**Step-by-Step Solution:**
1. Fixed-interval smoothing requires waiting until the entire mission terminates before computing the backward pass. Latency is infinite in real-time.
2. Fixed-lag smoothing delivers smoothed estimates with a deterministic latency of $L \Delta t$ (e.g. $100\text{ ms}$). This is compatible with perception pipelines that can tolerate $100\text{ ms}$ delay for map building. $\blacksquare$

---

### Problem 11.16 (Solved Exercise): Covariance Invertibility in Smoother Gain
**Problem Statement:** Why does computing $C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$ require $P_{k+1|k}$ to be strictly positive-definite? How does process noise $Q > 0$ guarantee this?

**Step-by-Step Solution:**
1. $P_{k+1|k} = F P_{k|k} F^T + Q$.
2. If $Q \in \mathbb{S}_{++}^n$ (strictly positive-definite), then for any $z \neq 0$:
   $$z^T P_{k+1|k} z = (F^T z)^T P_{k|k} (F^T z) + z^T Q z \ge 0 + z^T Q z > 0$$
3. Thus $P_{k+1|k}$ has strictly positive eigenvalues ($\lambda_{\min} \ge \lambda_{\min}(Q) > 0$), guaranteeing that $P_{k+1|k}^{-1}$ always exists and is well-conditioned. $\blacksquare$

---

### Problem 11.17 (Solved Exercise): RTS Smoothing on Nonlinear Systems (Extended RTS)
**Problem Statement:** How is the RTS smoother applied to nonlinear systems modeled by an Extended Kalman Filter?

**Step-by-Step Solution:**
1. In the forward pass, save the linearized Jacobians $F_k = \left.\frac{\partial f}{\partial x}\right|_{\hat{x}_{k-1|k-1}}$ along with state and covariance trajectories.
2. In the backward pass, evaluate the smoother gain using the saved Jacobian:
   $$C_k = P_{k|k} F_{k+1}^T P_{k+1|k}^{-1}$$
3. Propagate state using the nonlinear dynamic model:
   $$\hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - f(\hat{x}_{k|k}, u_k)) \quad \blacksquare$$

---

### Problem 11.18 (Solved Exercise): Innovation Whiteness Re-test
**Problem Statement:** If a sensor exhibits slow bias drift, how does the cumulative sum of innovations $\sum y_k$ detect this drift before the instantaneous NIS triggers?

**Step-by-Step Solution:**
1. A small bias $b = 0.5\sigma$ produces instantaneous NIS $\epsilon = (0.5)^2 = 0.25$, which never triggers the $\chi^2$ threshold ($3.84$).
2. However, the cumulative sum $S_N = \sum_{k=1}^N y_k$ accumulates as $N \cdot b$, growing linearly with time.
3. The CUSUM (cumulative sum) test triggers when $|S_N| > h \sqrt{N}$, detecting subtle systematic biases within seconds. $\blacksquare$

---

### Problem 11.19 (Solved Exercise): Zero Gain Smoother Invariance
**Problem Statement:** If $C_k = 0$, what do the smoothed state and covariance evaluate to?

**Step-by-Step Solution:**
1. $\hat{x}_{k|N} = \hat{x}_{k|k} + 0 = \hat{x}_{k|k}$.
2. $P_{k|N} = P_{k|k} + 0 = P_{k|k}$.
3. If future measurements convey zero information about state $k$ ($C_k = 0$), the smoothed estimate remains identically equal to the causal filter estimate. $\blacksquare$

---

### Problem 11.20 (Solved Exercise): Computational Complexity of Fixed-Interval RTS
**Problem Statement:** For a trajectory of $N$ steps with state dimension $n$, compute the total flop count of the RTS backward pass.

**Step-by-Step Solution:**
At each backward step $k$:
1. Solve $P_{k+1|k} X = F_{k+1} P_{k|k}$ via Cholesky decomposition: $\frac{1}{3} n^3 + 2 n^3 = \frac{7}{3} n^3$ flops.
2. State update: $\mathcal{O}(n^2)$ flops.
3. Covariance update: $C_k \Delta P C_k^T \approx 2 n^3$ flops.
Total per step: $\sim \frac{13}{3} n^3$ flops.
Across $N$ steps:
$$\text{Total Flops} \approx \frac{13}{3} N n^3$$
For $N = 10,000, n = 6$: $\frac{13}{3} \times 10000 \times 216 \approx 9.36 \times 10^6\text{ flops}$, executing in under $10\text{ ms}$.

**Final Answer:**
$$\text{Complexity} = \mathcal{O}(N n^3)\text{ flops}$$


---

# Chapter 12: Production TypeScript Kalman Filter Engine and Capstone Synthesis

## 12.1 Architecture of the Production TypeScript Kalman Filtering Engine

In production autonomous robotics, state estimation algorithms cannot rely on heavyweight interpreted scientific packages (such as NumPy or SciPy) or garbage-collected black-box libraries with unpredictable allocation latencies. A flight controller for a quadrotor operating at $1\text{ kHz}$, a surgical manipulator controller, or an autonomous vehicle perception pipeline requires a **zero-dependency, numerically stable, deterministic TypeScript engine**.

The file `kalman-filter-engine.ts` serves as this industrial foundation. It encapsulates the full spectrum of estimation algorithms developed across this treatise:

```
+---------------------------------------------------------------------------------------------------+
|                            kalman-filter-engine.ts ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | LINEAR ALGEBRA SUBSYSTEM                                                                    |  |
|  |   - Vector: Dot products, Euclidean norms, element-wise arithmetic, outer products          |  |
|  |   - Matrix: Addition, multiplication, transpose, trace, determinant, symmetry enforcement   |  |
|  |   - Cholesky Factorization: A = L L^T (O(n^3/3) with strict positive-definiteness checks)    |  |
|  |   - Linear System Solver: L L^T x = b via forward and backward substitution                 |  |
|  |   - Matrix Inversion: Numerically stable inversion with post-hoc symmetry enforcement       |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|         +--------------------------------------+------------------------------------+             |
|         |                                      |                                    |             |
|         v                                      v                                    v             |
|  +-----------------------+     +-------------------------------+     +-----------------------+    |
|  | ScalarKalmanFilter    |     | LinearKalmanFilter            |     | ExtendedKalmanFilter  |    |
|  | - 1D state & meas     |     | - Multivariable state & meas  |     | - Nonlinear f(x,u)    |    |
|  | - Exact DARE p_\infty |     | - Joseph Stabilized P update  |     | - Nonlinear h(x)      |    |
|  | - Gain tuning metrics |     | - Cholesky innovation solve   |     | - Finite-diff Jacobians|   |
|  +-----------------------+     +-------------------------------+     +-----------------------+    |
|                                                |                                                  |
|         +--------------------------------------+------------------------------------+             |
|         |                                                                           |             |
|         v                                                                           v             |
|  +-------------------------------+                                           +------------------+ |
|  | UnscentedKalmanFilter (UKF)   |                                           | RTSSmoother      | |
|  | - Scaled Merwe transform      |                                           | - Forward cache  | |
|  | - Deterministic 2n+1 sigmas   |                                           | - Backward pass  | |
|  | - 3rd-order Taylor accuracy   |                                           | - P_s <= P_filt  | |
|  +-------------------------------+                                           +------------------+ |
|                                                |                                                  |
|                                                v                                                  |
|                                  +---------------------------+                                    |
|                                  | ChiSquareGating           |                                    |
|                                  | - NIS test: y^T S^-1 y    |                                    |
|                                  | - Exact Chi-square bounds |                                    |
|                                  | - Outlier rejection       |                                    |
|                                  +---------------------------+                                    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 12.2 Ten Civilizational Grand Gauntlets

### Problem 12.1 (Grand Gauntlet): First-Principles Matrix Calculus Derivation of the Multivariable Kalman Gain
**Problem Statement:** Provide an uncompromising, step-by-step first-principles derivation of the multivariable Kalman Gain matrix $K_k^* \in \mathbb{R}^{n \times m}$ that minimizes the posterior mean squared error $\operatorname{tr}(P_{k|k})$, including full matrix derivative expansions and second-order sufficiency verification.

**Step-by-Step Derivation:**
1. State update: $\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k (z_k - H_k \hat{x}_{k|k-1})$.
2. Posterior error: $\tilde{x}_{k|k} = (I - K_k H_k) \tilde{x}_{k|k-1} - K_k v_k$.
3. Posterior covariance (Joseph form):
   $$P_{k|k} = (I - K_k H_k) P_{k|k-1} (I - K_k H_k)^T + K_k R_k K_k^T$$
4. Cost function:
   $$J(K_k) = \operatorname{tr}(P_{k|k}) = \operatorname{tr}(P_{k|k-1}) - 2 \operatorname{tr}(K_k H_k P_{k|k-1}) + \operatorname{tr}(K_k S_k K_k^T)$$
   where $S_k = H_k P_{k|k-1} H_k^T + R_k \in \mathbb{S}_{++}^m$.
5. Matrix gradient:
   $$\frac{\partial \operatorname{tr}(K_k H_k P_{k|k-1})}{\partial K_k} = (H_k P_{k|k-1})^T = P_{k|k-1} H_k^T$$
   $$\frac{\partial \operatorname{tr}(K_k S_k K_k^T)}{\partial K_k} = 2 K_k S_k$$
   $$\nabla_{K_k} J(K_k) = -2 P_{k|k-1} H_k^T + 2 K_k S_k = 0 \implies K_k S_k = P_{k|k-1} H_k^T$$
6. Since $R_k > 0$, $S_k$ is strictly positive definite and invertible:
   $$K_k^* = P_{k|k-1} H_k^T S_k^{-1}$$
7. Second-order variation:
   $$J(K^* + \Delta K) - J(K^*) = \operatorname{tr}(\Delta K S_k \Delta K^T) = \sum_{i=1}^n \delta k_i^T S_k \delta k_i > 0 \quad \forall \, \Delta K \neq 0$$
   The solution is the unique global minimum. $\blacksquare$

---

### Problem 12.2 (Grand Gauntlet): Algebraic Proof of the Joseph Stabilized Covariance Form
**Problem Statement:** Prove algebraically that for any arbitrary gain $K$ (optimal or sub-optimal), the posterior error covariance satisfies $P_{k|k} = (I - K H) P_{k|k-1} (I - K H)^T + K R K^T$. Prove that $P_{k|k}$ is strictly positive semi-definite under arbitrary floating-point truncation.

**Step-by-Step Derivation:**
1. Error equation: $\tilde{x}_{k|k} = M \tilde{x}_{k|k-1} - K v_k$ where $M = I - K H$.
2. Outer product expectation:
   $$P_{k|k} = \mathbb{E}[(M \tilde{x}_{k|k-1} - K v_k)(M \tilde{x}_{k|k-1} - K v_k)^T]$$
   $$= M \mathbb{E}[\tilde{x}_{k|k-1} \tilde{x}_{k|k-1}^T] M^T - M \mathbb{E}[\tilde{x}_{k|k-1} v_k^T] K^T - K \mathbb{E}[v_k \tilde{x}_{k|k-1}^T] M^T + K \mathbb{E}[v_k v_k^T] K^T$$
3. Since $v_k$ is independent of prior error: $\mathbb{E}[\tilde{x}_{k|k-1} v_k^T] = 0$.
   $$P_{k|k} = M P_{k|k-1} M^T + K R_k K^T = (I - K H) P_{k|k-1} (I - K H)^T + K R_k K^T$$
4. Positive semi-definiteness:
   For any non-zero vector $z \in \mathbb{R}^n$:
   $$z^T P_{k|k} z = z^T M P_{k|k-1} M^T z + z^T K R_k K^T z = (M^T z)^T P_{k|k-1} (M^T z) + (K^T z)^T R_k (K^T z)$$
   Because $P_{k|k-1} \ge 0$ and $R_k > 0$, both quadratic forms are non-negative:
   $$z^T P_{k|k} z \ge 0 \quad \forall \, z \in \mathbb{R}^n \implies P_{k|k} \in \mathbb{S}_+^n \quad \blacksquare$$

---

### Problem 12.3 (Grand Gauntlet): Van Loan Discretization Proof
**Problem Statement:** Prove Charles Van Loan's theorem: if $\mathcal{M} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix}$ and $\exp(\mathcal{M} \Delta t) = \begin{bmatrix} \Phi_{11} & \Phi_{12} \\ 0 & \Phi_{22} \end{bmatrix}$, then $F = \Phi_{22}^T$ and $Q_k = \Phi_{22}^T \Phi_{12}$.

**Step-by-Step Derivation:**
1. Consider the linear matrix differential equation $\dot{\Phi}(t) = \mathcal{M} \Phi(t)$ with $\Phi(0) = I_{2n}$.
2. Block equations:
   $$\dot{\Phi}_{22}(t) = A^T \Phi_{22}(t), \quad \Phi_{22}(0) = I_n \implies \Phi_{22}(t) = e^{A^T t} = (e^{At})^T$$
   At $t = \Delta t$: $\Phi_{22}(\Delta t) = F^T \implies F = \Phi_{22}^T$.
3. Top-right block equation:
   $$\dot{\Phi}_{12}(t) = -A \Phi_{12}(t) + G Q_c G^T \Phi_{22}(t) = -A \Phi_{12}(t) + G Q_c G^T e^{A^T t}$$
4. Integrating factor $e^{At}$:
   $$\frac{d}{dt}\left( e^{At} \Phi_{12}(t) \right) = e^{At} G Q_c G^T e^{A^T t}$$
5. Integrating from $0$ to $\Delta t$ with $\Phi_{12}(0) = 0$:
   $$e^{A \Delta t} \Phi_{12}(\Delta t) = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau = Q_k$$
6. Pre-multiplying by $F = \Phi_{22}^T = e^{A \Delta t}$:
   $$Q_k = F \, \Phi_{12}(\Delta t) = \Phi_{22}^T \Phi_{12} \quad \blacksquare$$

---

### Problem 12.4 (Grand Gauntlet): Analytical DARE Solution for 2nd-Order Kinematics
**Problem Statement:** Derive the exact closed-form analytical steady-state covariance $P_\infty$ for the continuous 2D kinematic tracking system with $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, continuous acceleration noise $Q_c = \tilde{q}$, and continuous position noise $R_c = \tilde{r}$.

**Step-by-Step Derivation:**
1. Continuous Algebraic Riccati Equation (CARE):
   $$A P + P A^T + G Q_c G^T - P C^T R_c^{-1} C P = 0$$
   where $G = [0, 1]^T, C = [1, 0]$.
2. Let $P = \begin{bmatrix} P_{11} & P_{12} \\ P_{12} & P_{22} \end{bmatrix}$.
   $$A P + P A^T = \begin{bmatrix} 2 P_{12} & P_{22} \\ P_{22} & 0 \end{bmatrix}, \quad G Q_c G^T = \begin{bmatrix} 0 & 0 \\ 0 & \tilde{q} \end{bmatrix}, \quad P C^T R_c^{-1} C P = \frac{1}{\tilde{r}} \begin{bmatrix} P_{11}^2 & P_{11} P_{12} \\ P_{11} P_{12} & P_{12}^2 \end{bmatrix}$$
3. Solving system of equations:
   $$(2, 2): \tilde{q} - \frac{P_{12}^2}{\tilde{r}} = 0 \implies P_{12} = \sqrt{\tilde{q} \tilde{r}}$$
   $$(1, 1): 2 P_{12} - \frac{P_{11}^2}{\tilde{r}} = 0 \implies P_{11}^2 = 2 \tilde{r} \sqrt{\tilde{q} \tilde{r}} = 2 \tilde{q}^{1/2} \tilde{r}^{3/2} \implies P_{11} = \sqrt{2} \tilde{q}^{1/4} \tilde{r}^{3/4}$$
   $$(1, 2): P_{22} - \frac{P_{11} P_{12}}{\tilde{r}} = 0 \implies P_{22} = \frac{(\sqrt{2}\tilde{q}^{1/4}\tilde{r}^{3/4})(\sqrt{\tilde{q}\tilde{r}})}{\tilde{r}} = \sqrt{2} \tilde{q}^{3/4} \tilde{r}^{1/4}$$
4. Steady-state continuous Kalman gain:
   $$K = P C^T R_c^{-1} = \begin{bmatrix} \sqrt{2} (\tilde{q}/\tilde{r})^{1/4} \\ (\tilde{q}/\tilde{r})^{1/2} \end{bmatrix}$$
   The estimator forms a critically damped Butterworth filter with cutoff $\omega_0 = (\tilde{q}/\tilde{r})^{1/4}$. $\blacksquare$

---

### Problem 12.5 (Grand Gauntlet): Third-Order Taylor Accuracy Proof of the Unscented Transform
**Problem Statement:** Prove that the Merwe scaled unscented transform reproduces the exact posterior mean through 3rd-order Taylor terms for any Gaussian input distribution.

**Step-by-Step Derivation:**
1. True Taylor expansion of $g(x)$ around $\bar{x}$ with $x - \bar{x} = \delta x$:
   $$\mathbb{E}[g(x)] = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + \mathcal{O}(D^4)$$
   (Odd moments vanish due to Gaussian symmetry).
2. Sigma-point expansion: $\mathcal{X}_i = \bar{x} + \Delta x_i$.
   $$\bar{y}_{\text{UKF}} = \sum_{i=0}^{2n} W_i^{(m)} g(\bar{x} + \Delta x_i) = g(\bar{x}) \sum W_i^{(m)} + \nabla g \sum W_i^{(m)} \Delta x_i + \frac{1}{2} \sum W_i^{(m)} \Delta x_i^T \nabla^2 g \Delta x_i + \frac{1}{6} \sum W_i^{(m)} D^3 g$$
3. By construction:
   - $\sum W_i^{(m)} = 1$.
   - $\sum W_i^{(m)} \Delta x_i = 0$ (symmetric pairs $\Delta x_{i+n} = -\Delta x_i$).
   - $\sum W_i^{(m)} \Delta x_i \Delta x_i^T = P$ (by Cholesky scaling).
   - $\sum W_i^{(m)} D^3 g = 0$ (odd symmetric terms cancel).
4. Thus:
   $$\bar{y}_{\text{UKF}} = g(\bar{x}) + \frac{1}{2} \operatorname{tr}(\nabla^2 g \cdot P) + \mathcal{O}(D^4) = \mathbb{E}[g(x)] + \mathcal{O}(D^4) \quad \blacksquare$$

---

### Problem 12.6 (Grand Gauntlet): Lie Group Error State Derivation for Quaternion ESKF on SO(3)
**Problem Statement:** Derive the linearized differential equation $\delta \dot{\theta} = -[\omega_b - b_g]_\times \delta \theta - \delta b_g - \eta_g$ on the Lie algebra $\mathfrak{so}(3)$.

**Step-by-Step Derivation:**
1. True and nominal kinematics:
   $$\dot{R}_t = R_t [\omega_t]_\times, \quad \dot{R}_{\text{nom}} = R_{\text{nom}} [\omega_{\text{nom}}]_\times$$
   where $\omega_t = \omega_b - b_{g, t} - \eta_g$, and $\omega_{\text{nom}} = \omega_b - b_{g, \text{nom}}$.
2. Error rotation definition:
   $$R_t = R_{\text{nom}} \operatorname{Exp}(\delta \theta) \approx R_{\text{nom}} (I + [\delta \theta]_\times)$$
3. Differentiating both sides:
   $$\dot{R}_t = \dot{R}_{\text{nom}} (I + [\delta \theta]_\times) + R_{\text{nom}} [\delta \dot{\theta}]_\times$$
4. Substitute kinematic equations:
   $$R_t [\omega_t]_\times = R_{\text{nom}} [\omega_{\text{nom}}]_\times (I + [\delta \theta]_\times) + R_{\text{nom}} [\delta \dot{\theta}]_\times$$
   $$R_{\text{nom}} (I + [\delta \theta]_\times) [\omega_t]_\times = R_{\text{nom}} [\omega_{\text{nom}}]_\times + R_{\text{nom}} [\omega_{\text{nom}}]_\times [\delta \theta]_\times + R_{\text{nom}} [\delta \dot{\theta}]_\times$$
5. Pre-multiply by $R_{\text{nom}}^T$:
   $$[\omega_t]_\times + [\delta \theta]_\times [\omega_t]_\times = [\omega_{\text{nom}}]_\times + [\omega_{\text{nom}}]_\times [\delta \theta]_\times + [\delta \dot{\theta}]_\times$$
6. Using the Lie bracket identity $[a]_\times [b]_\times - [b]_\times [a]_\times = [a \times b]_\times = [[a]_\times b]_\times$:
   $$[\delta \dot{\theta}]_\times = [\omega_t - \omega_{\text{nom}}]_\times + [\delta \theta \times \omega_{\text{nom}}]_\times = [-\delta b_g - \eta_g]_\times - [\omega_{\text{nom}} \times \delta \theta]_\times$$
7. Stripping the skew-symmetric operator:
   $$\delta \dot{\theta} = -[\omega_{\text{nom}}]_\times \delta \theta - \delta b_g - \eta_g \quad \blacksquare$$

---

### Problem 12.7 (Grand Gauntlet): Monotonic Variance Contraction under Measurement Updates
**Problem Statement:** Prove that for any prior covariance $P_{k|k-1} \ge 0$, measurement matrix $H$, and measurement noise $R > 0$, the posterior covariance satisfies $P_{k|k} \le P_{k|k-1}$ in the Loewner order.

**Step-by-Step Derivation:**
1. Difference: $\Delta P = P_{k|k-1} - P_{k|k} = K_k H_k P_{k|k-1}$.
2. Substitute optimal gain $K_k = P_{k|k-1} H_k^T S_k^{-1}$:
   $$\Delta P = P_{k|k-1} H_k^T S_k^{-1} H_k P_{k|k-1}$$
3. Let $B = H_k P_{k|k-1}$. Then $\Delta P = B^T S_k^{-1} B$.
4. For any $z \in \mathbb{R}^n$:
   $$z^T \Delta P z = (B z)^T S_k^{-1} (B z) \ge 0$$
   since $S_k^{-1} \in \mathbb{S}_{++}^m$.
5. Thus $\Delta P \ge 0 \implies P_{k|k} \le P_{k|k-1}$. $\blacksquare$

---

### Problem 12.8 (Grand Gauntlet): Optimality Proof of the Rauch-Tung-Striebel Backward Smoother
**Problem Statement:** Prove that the RTS smoother produces the absolute minimum variance linear estimate of state $x_k$ given all observations $Z_{1:N}$.

**Step-by-Step Derivation:**
1. The conditional distribution $p(x_k | Z_{1:N})$ is Gaussian by linear system properties.
2. By the Rao-Blackwell and total expectation theorems:
   $$\hat{x}_{k|N} = \mathbb{E}[x_k | Z_{1:N}] = \mathbb{E}[\mathbb{E}[x_k | x_{k+1}, Z_{1:k}] | Z_{1:N}]$$
3. Because $x_k$ and $x_{k+1}$ conditioned on $Z_{1:k}$ are jointly Gaussian with linear regression coefficient $C_k = P_{k|k} F^T P_{k+1|k}^{-1}$, the inner expectation is affine:
   $$\mathbb{E}[x_k | x_{k+1}, Z_{1:k}] = \hat{x}_{k|k} + C_k (x_{k+1} - \hat{x}_{k+1|k})$$
4. Taking expectation with respect to $p(x_{k+1} | Z_{1:N})$ directly gives:
   $$\hat{x}_{k|N} = \hat{x}_{k|k} + C_k (\hat{x}_{k+1|N} - \hat{x}_{k+1|k})$$
5. Because the conditional expectation is the unique MMSE estimator in Hilbert space, the RTS smoother is mathematically optimal. $\blacksquare$

---

### Problem 12.9 (Grand Gauntlet): Whiteness and Orthogonality Proof of the Innovation Sequence
**Problem Statement:** Prove that the innovation sequence $y_k = z_k - H_k \hat{x}_{k|k-1}$ is orthogonal to all past measurements $Z_{1:k-1}$ and that $\mathbb{E}[y_j y_k^T] = S_k \delta_{jk}$.

**Step-by-Step Derivation:**
1. Condition on information set $Z_{1:k-1}$:
   $$\mathbb{E}[y_k | Z_{1:k-1}] = \mathbb{E}[z_k | Z_{1:k-1}] - H_k \hat{x}_{k|k-1} = H_k \hat{x}_{k|k-1} - H_k \hat{x}_{k|k-1} = 0$$
2. For any $j < k$, $y_j$ is a measurable function of $Z_{1:k-1}$.
   $$\mathbb{E}[y_k y_j^T] = \mathbb{E}[\mathbb{E}[y_k | Z_{1:k-1}] y_j^T] = \mathbb{E}[0 \cdot y_j^T] = 0$$
3. For $j = k$:
   $$\mathbb{E}[y_k y_k^T] = H_k P_{k|k-1} H_k^T + R_k = S_k$$
4. Thus $\mathbb{E}[y_j y_k^T] = S_k \delta_{jk}$. $\blacksquare$

---

### Problem 12.10 (Grand Gauntlet): Chi-Square Distribution Proof of the Normalized Innovation Squared (NIS)
**Problem Statement:** Prove that $\epsilon_{y, k} = y_k^T S_k^{-1} y_k \sim \chi_m^2$ when $y_k \sim \mathcal{N}(0, S_k)$ with $S_k \in \mathbb{S}_{++}^m$.

**Step-by-Step Derivation:**
1. Cholesky factorization: $S_k = L L^T$ where $L$ is invertible.
2. Define standardized variable $w = L^{-1} y_k$.
   $$\mathbb{E}[w] = 0, \quad \operatorname{Cov}(w) = L^{-1} S_k L^{-T} = L^{-1} (L L^T) L^{-T} = I_m$$
3. The components $w_1, \dots, w_m$ are independent standard normal random variables: $w_i \sim \mathcal{N}(0, 1)$.
4. Quadratic form:
   $$\epsilon_{y, k} = y_k^T S_k^{-1} y_k = y_k^T (L^{-T} L^{-1}) y_k = (L^{-1} y_k)^T (L^{-1} y_k) = w^T w = \sum_{i=1}^m w_i^2$$
5. By definition of the Chi-square distribution, the sum of squares of $m$ independent standard normal variables follows $\chi_m^2$. $\blacksquare$

---

## 12.3 Ten Capstone Mastery Problems

### Problem 12.11 (Capstone Mastery): 6-DoF Quadrotor State Estimation Fusing IMU, Barometer, and Rangefinder
**Problem Statement:** A 6-DoF quadrotor hovers indoors. Its state is $x = [p_z, v_z, b_{az}]^T$. An IMU reports vertical acceleration $a_z$ at $500\text{ Hz}$ ($Q_a = 0.04$). A barometer reports altitude $z_{\text{baro}}$ at $20\text{ Hz}$ ($R_{\text{baro}} = 0.25$), and an ultrasonic rangefinder reports ground distance $z_{\text{range}}$ at $50\text{ Hz}$ ($R_{\text{range}} = 0.01$). Formulate the complete discrete ESKF matrices and compute steady-state vertical altitude accuracy.

**Step-by-Step Derivation:**
1. State vector: $x = [p_z, v_z, b_{az}]^T$.
   $$F = \begin{bmatrix} 1 & \Delta t & -\frac{1}{2}\Delta t^2 \\ 0 & 1 & -\Delta t \\ 0 & 0 & 1 \end{bmatrix}, \quad Q = Q_a \begin{bmatrix} \Delta t^4 / 4 & \Delta t^3 / 2 & 0 \\ \Delta t^3 / 2 & \Delta t^2 & 0 \\ 0 & 0 & q_b \Delta t \end{bmatrix}$$
2. Measurement matrices:
   $$H_{\text{baro}} = [1, 0, 0], \quad H_{\text{range}} = [1, 0, 0]$$
3. Steady-state information accumulation:
   The rangefinder arrives at $50\text{ Hz}$ with $R = 0.01\text{ m}^2$, providing information rate $50 / 0.01 = 5000\text{ m}^{-2}\text{s}^{-1}$.
   The continuous CARE gives steady-state altitude variance:
   $$P_{11} \approx \sqrt{2} Q_a^{1/4} (R_{\text{eff}})^{3/4} \approx 0.0031\text{ m}^2 \implies \sigma_z \approx 5.5\text{ cm}$$

**Final Result:**
$$\sigma_z \approx 5.5\text{ cm}\text{ steady-state vertical accuracy}$$

---

### Problem 12.12 (Capstone Mastery): Autonomous Mobile Robot Localization Fusing Encoders and 2D Range-Bearing Landmarks
**Problem Statement:** A differential drive robot navigates a warehouse with 4 known radio beacons. Wheel encoders provide forward speed $v = 1.0\text{ m/s}$ and yaw rate $\omega = 0.1\text{ rad/s}$. When observing beacon 1 at $(x_b, y_b) = (10, 5)$, compute the full EKF measurement update.

**Step-by-Step Derivation:**
1. Robot pose $\hat{x} = [2.0, 3.0, 0.2]^T$.
2. Range to beacon: $\Delta x = 10 - 2 = 8, \Delta y = 5 - 3 = 2 \implies \rho = \sqrt{64 + 4} = \sqrt{68} \approx 8.246\text{ m}$.
3. Bearing in world frame: $\phi_{\text{world}} = \operatorname{atan2}(2, 8) \approx 0.245\text{ rad}$.
   Relative bearing: $\phi_{\text{rel}} = \phi_{\text{world}} - \theta = 0.245 - 0.200 = 0.045\text{ rad}$.
4. Compute Jacobian $H \in \mathbb{R}^{2 \times 3}$:
   $$H = \begin{bmatrix} -\frac{\Delta x}{\rho} & -\frac{\Delta y}{\rho} & 0 \\ \frac{\Delta y}{\rho^2} & -\frac{\Delta x}{\rho^2} & -1 \end{bmatrix} = \begin{bmatrix} -0.970 & -0.243 & 0.0 \\ 0.029 & -0.118 & -1.0 \end{bmatrix}$$
5. Apply Kalman update with Joseph stabilized covariance.

**Final Result:**
Full $3 \times 3$ pose covariance updated with zero linearization singularity.

---

### Problem 12.13 (Capstone Mastery): Real-Time Visual-Inertial Odometry (VIO) State Estimation with Camera Delay
**Problem Statement:** A stereo camera pipeline tracking 50 visual features delivers pose updates with a deterministic $60\text{ ms}$ processing delay. Formulate the rolling state buffer and playback algorithm.

**Step-by-Step Derivation:**
1. Ring buffer size: for $500\text{ Hz}$ IMU and $60\text{ ms}$ delay, buffer capacity $K = 0.060 \times 500 = 30$ frames.
2. At time $t_k$, when camera frame for $t_{k-30}$ arrives:
   - Retrieve stored nominal state $x_{\text{nom}}(t_{k-30})$ and covariance $P(t_{k-30})$.
   - Compute visual reprojection residuals for all 50 features.
   - Apply ESKF update to error state $\delta x$.
   - Inject error into $x_{\text{nom}}(t_{k-30})$ and reset $\delta x \leftarrow 0$.
   - Re-propagate nominal IMU strapdown through the 30 subsequent stored IMU packets to step $k$.

**Final Result:**
Deterministic latency compensation with zero phase lag distortion.

---

### Problem 12.14 (Capstone Mastery): Spacecraft Attitude Determination via Multiplicative EKF (MEKF) with Star Tracker and Gyros
**Problem Statement:** A spacecraft tracks attitude quaternion $q \in \mathbb{S}^3$ using 3-axis rate gyros and a star tracker observing unit star vectors $v_i^n$. Formulate the Multiplicative EKF (MEKF) measurement sensitivity.

**Step-by-Step Derivation:**
1. Star observation model: $z_i = R_b^n v_i^b + v_i$.
2. Measurement sensitivity on Lie algebra $\delta \theta \in \mathfrak{so}(3)$:
   $$h(\delta \theta) = R_{\text{nom}} (I + [\delta \theta]_\times) v_i^b = R_{\text{nom}} v_i^b - R_{\text{nom}} [v_i^b]_\times \delta \theta$$
   $$H_i = -R_{\text{nom}} [v_i^b]_\times \in \mathbb{R}^{3 \times 3}$$
3. Star tracker update refines attitude without quaternion norm degradation.

**Final Result:**
$$H_i = -R_{\text{nom}} [v_i^b]_\times$$

---

### Problem 12.15 (Capstone Mastery): GPS Outage Bridging with Zero-Velocity Updates (ZUPT) and RTS Smoothing
**Problem Statement:** An underground inspection robot travels for $120\text{ s}$ through a GPS-denied tunnel, stopping every $20\text{ s}$ for a 3-second ZUPT. Compare the maximum position drift under causal filtering versus RTS post-smoothing.

**Step-by-Step Derivation:**
1. During each 20s travel segment, causal dead-reckoning drift accumulates: $\sigma_p \approx \frac{1}{2} b_a t^2 \approx 0.025 (400) = 10.0\text{ m}$.
2. ZUPT resets velocity error to near zero, stopping further quadratic growth, but leaves historical position drift uncorrected causally.
3. RTS backward smoothing propagates the post-outage GPS fix and intermediate ZUPT constraints backwards in time:
   $$\sigma_{p, \text{RTS}}(t) \le 0.45\text{ m}$$
   Smoothing reduces maximum position drift by over $95\%$.

**Final Result:**
$$\text{Causal Drift} = 10.0\text{ m}, \quad \text{RTS Smoothed Drift} = 0.45\text{ m} \quad (\mathbf{95.5\%\ Drift\ Reduction})$$

---

### Problem 12.16 (Capstone Mastery): Multi-Target Radar Tracking with Kalman Gating and Nearest-Neighbor Association
**Problem Statement:** A radar tracks 3 aircraft. A new measurement $z$ arrives. Formulate the Global Nearest Neighbor (GNN) association rule using the Mahalanobis distance.

**Step-by-Step Derivation:**
1. For each target track $i \in \{1, 2, 3\}$, compute predicted measurement $\hat{z}_i$ and innovation covariance $S_i$.
2. Compute Mahalanobis distance:
   $$d_i^2 = (z - \hat{z}_i)^T S_i^{-1} (z - \hat{z}_i)$$
3. Gating check: if $d_i^2 > \chi^2(m)_{0.99}$, track $i$ is disqualified.
4. Association decision:
   $$i^* = \arg\min_{i} d_i^2 \quad \text{subject to } d_i^2 \le \gamma$$

**Final Result:**
Optimal assignment minimizing total statistical distance.

---

### Problem 12.17 (Capstone Mastery): Battery State of Charge (SoC) and Internal Resistance Estimation via Dual EKF
**Problem Statement:** In electric autonomous robots, battery state $x = [\text{SoC}, V_{\text{RC}}]^T$ and parameter $\theta = R_0$ (internal resistance) are coupled nonlinearly. Specify the Dual EKF architecture.

**Step-by-Step Derivation:**
1. Filter 1 (State Filter): estimates $\text{SoC}_k$ assuming parameter $\hat{R}_{0, k-1}$ is known.
2. Filter 2 (Parameter Filter): estimates internal resistance $R_{0, k}$ treated as a slow random walk ($R_{0, k} = R_{0, k-1} + w_\theta$), using the updated state $\hat{x}_k$ from Filter 1.
3. Concurrent execution decouples fast electrical dynamics from slow battery degradation.

**Final Result:**
Dual EKF provides real-time state of charge and health tracking.

---

### Problem 12.18 (Capstone Mastery): Inverted Pendulum State Estimation under Stochastic Torque Disturbances
**Problem Statement:** A humanoid balancing robot stabilizes an inverted pendulum $\ddot{\theta} - \frac{g}{L} \sin\theta = \frac{\tau}{m L^2} + w(t)$. Design a discrete EKF estimating angle and angular velocity under wind gusts.

**Step-by-Step Derivation:**
1. Continuous state $x = [\theta, \dot{\theta}]^T$.
   $$f(x, u) = \begin{bmatrix} \dot{\theta} \\ \frac{g}{L} \sin\theta + \frac{\tau}{m L^2} \end{bmatrix}$$
2. Continuous Jacobian:
   $$A = \begin{bmatrix} 0 & 1 \\ \frac{g}{L} \cos\theta & 0 \end{bmatrix}$$
3. Discretize via Van Loan method and implement with Joseph form.

**Final Result:**
Full EKF stabilizing dynamic balance under torque noise.

---

### Problem 12.19 (Capstone Mastery): Fault-Tolerant Aircraft Airspeed Sensor Fusion with Chi-Square Gating
**Problem Statement:** An autonomous aircraft fuses pitot tube airspeed, GPS groundspeed, and wind velocity estimates. When ice blocks the pitot tube (causing output to freeze at $80\text{ knots}$), demonstrate how Chi-square gating detects the sensor freeze and isolates the pitot tube.

**Step-by-Step Derivation:**
1. Aircraft accelerates from $80\text{ knots}$ to $120\text{ knots}$ (measured by GPS and throttle).
2. Frozen pitot reports $z_{\text{pitot}} = 80\text{ knots}$.
3. Predicted airspeed $\hat{v} = 120\text{ knots}$, with innovation $y = 80 - 120 = -40\text{ knots}$.
4. NIS evaluation:
   $$\epsilon = \frac{(-40)^2}{S} = \frac{1600}{25} = 64 \gg \chi^2(1)_{0.999} = 10.828$$
5. Pitot measurement is discarded; flight computer flags sensor failure and switches to synthetic airspeed from GPS-inertial fusion.

**Final Result:**
$$\epsilon = 64 > 10.83 \implies \mathbf{Fault\ Isolated,\ Flight\ Safety\ Maintained}$$

---

### Problem 12.20 (Capstone Mastery): Complete Autonomous Embodied AI Perception-Estimation-Control Loop Integration
**Problem Statement:** Formulate the end-to-end mathematical contract connecting sensor perception, optimal state estimation (Kalman Filtering), and optimal feedback control (Linear Quadratic Regulator / Model Predictive Control). State the Separation Principle.

**Step-by-Step Derivation:**
1. The physical system is governed by:
   $$x_{k+1} = F x_k + B u_k + w_k, \quad z_k = H x_k + v_k$$
2. The Kalman filter computes the optimal state belief:
   $$\hat{x}_k = \mathbb{E}[x_k | z_{1:k}]$$
3. The optimal control law computes actuator inputs:
   $$u_k = -K_{\text{LQR}} \hat{x}_k$$
4. **The Separation Principle (Certainty Equivalence Theorem):**
   For linear quadratic Gaussian (LQG) systems, the optimal controller design is strictly decoupled from the optimal estimator design:
   - The Kalman filter gain $K_k^*$ is computed independently of the control cost matrices $(Q_c, R_c)$.
   - The LQR gain $K_{\text{LQR}}^*$ is computed independently of the noise covariances $(Q, R)$.
   - Cascading the optimal estimator with the optimal deterministic controller achieves the mathematically optimal closed-loop cyber-physical autonomous agent. $\blacksquare$

**Final Result:**
The Separation Principle guarantees complete optimality of the Embodied AI loop.


---

