# Chapter 7: Mathematical Expectation, Moments, Variance, and MGFs

## 7.1 Mathematical Expectation: The Physical Center of Mass

Probability distributions describe the complete dispersal of probability mass across a sample space. However, in scientific measurement, engineering decision-making, and machine learning, an intelligent agent must often summarize a complex distribution into canonical scalar descriptors:
- What is the typical, expected value of a sensor reading?
- What is the volatility or dispersion of a stock portfolio?
- Is the distribution skewed toward catastrophic tail losses?

The most foundational summary descriptor is **Mathematical Expectation** (also called the *expected value*, *population mean*, or *first moment*).

```
+---------------------------------------------------------------------------------------------------+
|                         EXPECTATION AS THE PHYSICAL CENTER OF MASS                                |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  PHYSICAL MECHANICS:                                                                              |
|  For a set of discrete point masses m_i located at positions x_i along a beam:                   |
|                                       x_cm = (∑ x_i m_i) / (∑ m_i)                                |
|  Since the total probability mass ∑ p_i = 1, the center of mass simplifies to:                    |
|                                       x_cm = ∑ x_i p_i                                            |
|                                                                                                   |
|  CONTINUOUS CONTINUUM:                                                                            |
|  For a continuous density mass distribution ρ(x):                                                 |
|                                       x_cm = ∫ x ρ(x) dx                                          |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Definitions: Discrete and Continuous Expectation
1. **Discrete Random Variable:** If $X$ has PMF $p_X(x)$:
   $$E[X] = \sum_{x \in \text{Range}(X)} x \cdot p_X(x)$$
2. **Continuous Random Variable:** If $X$ has PDF $f_X(x)$:
   $$E[X] = \int_{-\infty}^\infty x \cdot f_X(x) \, dx$$

### The Requirement of Absolute Convergence
In formal analysis, the expectation exists if and only if the sum or integral is **absolutely convergent**:
$$\sum_x |x| p_X(x) < \infty \quad \text{or} \quad \int_{-\infty}^\infty |x| f_X(x) \, dx < \infty.$$
If $\int_0^\infty x f(x) dx = \infty$ and $\int_{-\infty}^0 x f(x) dx = -\infty$, the net integral $\infty - \infty$ is an indeterminate form, and the expectation is undefined (as observed in the Cauchy distribution in Chapter 6).

### The St. Petersburg Paradox (Nicolas Bernoulli, 1713)
A casino offers a game: a fair coin is tossed repeatedly until Heads appears.
If Heads appears on toss $k$, the player wins $2^k$ dollars ($k \in \{1, 2, 3, \dots\}$).
The probability of Heads on toss $k$ is $P(K = k) = (1/2)^k$.
The theoretical expected payoff of the game is:
$$E[\text{Payoff}] = \sum_{k=1}^\infty 2^k \cdot P(K = k) = \sum_{k=1}^\infty 2^k \left(\frac{1}{2}\right)^k = \sum_{k=1}^\infty 1 = 1 + 1 + 1 + \dots = \infty.$$
While the mathematical expectation is infinite, no rational human would pay even \$50 to play this game!
*Resolution (Daniel Bernoulli, 1738):* Humans do not maximize expected monetary wealth; they maximize **expected utility** $E[U(W)]$. Because utility exhibits diminishing marginal returns (e.g., logarithmic utility $U(w) = \ln w$), the expected utility of the game is finite:
$$E[U] = \sum_{k=1}^\infty \ln(2^k) \left(\frac{1}{2}\right)^k = \ln 2 \sum_{k=1}^\infty \frac{k}{2^k} = 2 \ln 2 \approx 1.386 \implies \text{Certainty Equivalent} = e^{1.386} = \$4.00.$$
A rational agent with logarithmic risk aversion will pay at most \$4.00 to enter the game.

---

## 7.2 The Law of the Unconscious Statistician (LOTUS)

Suppose we have a random variable $X$ with known density $f_X(x)$, and we wish to compute the expectation of a transformed variable $Y = g(X)$ (e.g., kinetic energy $g(x) = \frac{1}{2} m x^2$, or financial utility $g(x) = \ln x$).

The naive approach requires two labor-intensive steps:
1. Use the Jacobian transformation rule to derive the PDF $f_Y(y)$.
2. Compute $E[Y] = \int y f_Y(y) \, dy$.

The celebrated **Law of the Unconscious Statistician (LOTUS)** proves that finding $f_Y(y)$ is completely unnecessary! We can compute $E[g(X)]$ directly by integrating $g(x)$ against the original density $f_X(x)$.

### Theorem 7.1: LOTUS (Law of the Unconscious Statistician)
1. **Discrete Case:**
   $$E[g(X)] = \sum_{x} g(x) \cdot p_X(x)$$
2. **Continuous Case:**
   $$E[g(X)] = \int_{-\infty}^\infty g(x) \cdot f_X(x) \, dx$$

*Proof (Continuous Monotonic Case):*
Assume $y = g(x)$ is strictly increasing and differentiable.
From Theorem 6.2, $f_Y(y) = f_X(x) \frac{dx}{dy}$ where $x = g^{-1}(y)$.
By definition of expectation:
$$E[Y] = \int_{-\infty}^\infty y \cdot f_Y(y) \, dy = \int_{-\infty}^\infty y \left( f_X(x) \frac{dx}{dy} \right) dy.$$
Applying integration by substitution, $y = g(x)$ and $dy = g'(x) dx$:
$$E[Y] = \int_{-\infty}^\infty g(x) \cdot f_X(x) \, dx. \quad \blacksquare$$

---

## 7.3 The Universal Linearity of Expectation

Among all operators in probability theory, expectation possesses the supreme mathematical property of **universal linearity**.

### Theorem 7.2: Universal Linearity of Expectation
Let $X_1, X_2, \dots, X_n$ be arbitrary random variables defined on the same probability space, and let $c_1, c_2, \dots, c_n \in \mathbb{R}$ be scalar constants. Then:
$$E\left[ \sum_{i=1}^n c_i X_i \right] = \sum_{i=1}^n c_i E[X_i]$$

> [!IMPORTANT] Independence is NOT Required
> Linearity of expectation holds **unconditionally** across all random variables, regardless of whether they are independent, positively correlated, negatively correlated, or non-linearly entangled!
> In contrast, $\text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y)$ holds *only* under zero covariance.

*Proof:*
By definition of joint expectation (Chapter 8):
$$E[X_1 + X_2] = \iint (x_1 + x_2) f_{X_1, X_2}(x_1, x_2) \, dx_1 \, dx_2$$
$$= \iint x_1 f_{X_1, X_2}(x_1, x_2) \, dx_1 \, dx_2 + \iint x_2 f_{X_1, X_2}(x_1, x_2) \, dx_1 \, dx_2$$
$$= \int x_1 \left( \int f_{X_1, X_2}(x_1, x_2) \, dx_2 \right) dx_1 + \int x_2 \left( \int f_{X_1, X_2}(x_1, x_2) \, dx_1 \right) dx_2$$
$$= \int x_1 f_{X_1}(x_1) \, dx_1 + \int x_2 f_{X_2}(x_2) \, dx_2 = E[X_1] + E[X_2]. \quad \blacksquare$$

*Algorithmic Superpower (The Method of Indicator Variables):*
Linearity of expectation allows solving seemingly intractable combinatorial problems by decomposing a complex count into a sum of simple binary indicators $I_i \in \{0, 1\}$.
Since $E[I_i] = P(I_i = 1)$, computing expected values reduces to finding marginal event probabilities without ever calculating joint distributions!

---

## 7.4 Variance, Standard Deviation, and Higher-Order Central Moments

While expectation locates the center of mass, **moments** quantify the shape, spread, asymmetry, and tail heaviness of a distribution.

### Definition: Raw Moments and Central Moments
- The **$k$-th Raw Moment** is $\mu_k' = E[X^k]$. (The 1st raw moment is the mean $\mu = E[X]$).
- The **$k$-th Central Moment** is the expectation of deviation from the mean:
  $$\mu_k = E\left[(X - \mu)^k\right]$$

---

### 1. Variance and Standard Deviation (2nd Central Moment)
The **Variance** measures the expected squared dispersion of a random variable around its mean:
$$\text{Var}(X) = \sigma^2 = E\left[(X - \mu)^2\right]$$
The **Standard Deviation** is the positive square root: $\sigma = \sqrt{\text{Var}(X)}$, restoring the units of measurement to the original scale of $X$.

#### Fundamental Invariance and Scaling Properties:
1. **Alternative Computational Formula:**
   $$\text{Var}(X) = E[X^2] - (E[X])^2$$
   *Proof:* $E[(X - \mu)^2] = E[X^2 - 2\mu X + \mu^2] = E[X^2] - 2\mu E[X] + \mu^2 = E[X^2] - 2\mu^2 + \mu^2 = E[X^2] - \mu^2$.
2. **Translation Invariance:** Adding a constant does not alter dispersion:
   $$\text{Var}(X + c) = \text{Var}(X)$$
3. **Quadratic Scaling:**
   $$\text{Var}(aX) = a^2 \text{Var}(X) \implies \sigma(aX) = |a| \sigma(X)$$
4. **Variance of Independent Sums:**
   If $X$ and $Y$ are independent (or uncorrelated):
   $$\text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y)$$
   $$\text{Var}(X - Y) = \text{Var}(X) + \text{Var}(Y) \quad (\text{variances always add!})$$

---

### 2. Skewness (3rd Standardized Moment): Asymmetry
The **Skewness** $\gamma_1$ quantifies the degree and direction of distribution asymmetry:
$$\gamma_1 = E\left[ \left(\frac{X - \mu}{\sigma}\right)^3 \right] = \frac{\mu_3}{\sigma^3} = \frac{E[(X - \mu)^3]}{\sigma^3}$$
- **$\gamma_1 = 0$:** Symmetric distribution (e.g., Gaussian, Uniform, Student's t).
- **$\gamma_1 > 0$ (Positive / Right-Skewed):** Elongated tail to the right; majority of mass concentrated on the left (e.g., Exponential, Pareto, income distributions). Typically, $\text{Mode} < \text{Median} < \text{Mean}$.
- **$\gamma_1 < 0$ (Negative / Left-Skewed):** Elongated tail to the left (e.g., human lifespan distributions). Typically, $\text{Mean} < \text{Median} < \text{Mode}$.

---

### 3. Kurtosis (4th Standardized Moment): Tail Heaviness
The **Kurtosis** $\beta_2$ measures the propensity of a distribution to generate extreme outliers (tail fatness):
$$\beta_2 = E\left[ \left(\frac{X - \mu}{\sigma}\right)^4 \right] = \frac{\mu_4}{\sigma^4}$$
The **Excess Kurtosis** $\gamma_2$ is calibrated relative to the standard normal distribution:
$$\gamma_2 = \beta_2 - 3$$
- **Mesokurtic ($\gamma_2 = 0$):** Gaussian tails ($\beta_2 = 3$).
- **Leptokurtic ($\gamma_2 > 0$):** "Fat tails" with high peak and heavy outlier probability (e.g., Student's t, Laplace, financial asset returns). Black Swan events are vastly more frequent than predicted by Gaussian models!
- **Platykurtic ($\gamma_2 < 0$):** "Thin tails" with low outlier probability (e.g., Uniform distribution has $\gamma_2 = -1.2$).

---

## 7.5 Moment Generating Functions (MGFs)

Manipulating higher moments by directly evaluating infinite sums or integrals becomes algebraically prohibitive. The **Moment Generating Function (MGF)** encapsulates all infinite moments of a probability distribution into a single analytical function.

### Definition: Moment Generating Function
The Moment Generating Function $M_X(t)$ of a random variable $X$ is defined as:
$$M_X(t) = E\left[e^{tX}\right], \quad t \in (-h, h) \text{ for some } h > 0$$
- Discrete: $M_X(t) = \sum_x e^{tx} p_X(x)$.
- Continuous: $M_X(t) = \int_{-\infty}^\infty e^{tx} f_X(x) \, dx$.
*(Notice that the continuous MGF is formally the bilateral Laplace transform of $f_X(x)$ with inverted sign $s = -t$)*.

### Theorem 7.3: Moment Generation Property
The $k$-th raw moment of $X$ is obtained by evaluating the $k$-th derivative of $M_X(t)$ at $t = 0$:
$$E[X^k] = M_X^{(k)}(0) = \frac{d^k}{dt^k} M_X(t) \Bigg|_{t = 0}$$

*Proof:*
Expand $e^{tX}$ as a Taylor series:
$$e^{tX} = \sum_{k=0}^\infty \frac{(tX)^k}{k!} = 1 + tX + \frac{t^2 X^2}{2!} + \frac{t^3 X^3}{3!} + \dots$$
Applying linearity of expectation:
$$M_X(t) = E\left[e^{tX}\right] = \sum_{k=0}^\infty \frac{t^k}{k!} E[X^k] = 1 + t E[X] + \frac{t^2}{2!} E[X^2] + \frac{t^3}{3!} E[X^3] + \dots$$
Differentiating $k$ times with respect to $t$ and setting $t = 0$ isolates the coefficient of $\frac{t^k}{k!}$, which is identically $E[X^k]$. $\blacksquare$

### Fundamental Properties of MGFs:
1. **Affine Transformation:** If $Y = aX + b$:
   $$M_Y(t) = E[e^{t(aX + b)}] = e^{bt} E[e^{(at)X}] = e^{bt} M_X(at)$$
2. **Sums of Independent Random Variables:**
   If $X$ and $Y$ are independent:
   $$M_{X + Y}(t) = E\left[e^{t(X + Y)}\right] = E\left[e^{tX} e^{tY}\right] = E\left[e^{tX}\right] E\left[e^{tY}\right] = M_X(t) \cdot M_Y(t)$$
   The MGF of an independent sum is the **simple product** of individual MGFs! This converts complex convolution integrals into elementary algebra.
3. **The Uniqueness Theorem:**
   If two random variables $X$ and $Y$ have MGFs that exist and agree on an open neighborhood around zero ($M_X(t) = M_Y(t)$ for all $|t| < h$), then $X$ and $Y$ have the **exact same probability distribution**:
   $$F_X(x) \equiv F_Y(x) \quad \forall x \in \mathbb{R}.$$

---

## 7.6 Worked Examples: First-Principles Solutions

---

### Example 7.1: Expectation via Survival Function Integration
**Problem:** In survival analysis and queueing theory, evaluating $\int x f(x) dx$ can be challenging.
1. Prove the **Tail Expectation Formula**: For any non-negative continuous random variable $X \ge 0$:
   $$E[X] = \int_0^\infty P(X > x) \, dx = \int_0^\infty [1 - F_X(x)] \, dx$$
2. Apply this formula to compute the expected value of an Exponentially distributed lifetime $X \sim \text{Exp}(\lambda)$.

**Solution:**
1. Express $P(X > x)$ as an integral of the PDF:
$$P(X > x) = \int_x^\infty f_X(t) \, dt.$$
Substitute this into the tail integral:
$$\int_0^\infty P(X > x) \, dx = \int_0^\infty \left( \int_x^\infty f_X(t) \, dt \right) dx.$$
The integration domain is the 2D planar region $0 \le x \le t < \infty$.
Interchange the order of integration via Fubini's Theorem:
$$\int_0^\infty \left( \int_x^\infty f_X(t) \, dt \right) dx = \int_0^\infty f_X(t) \left( \int_0^t dx \right) dt = \int_0^\infty f_X(t) [x]_0^t \, dt = \int_0^\infty t \cdot f_X(t) \, dt.$$
By definition, the right-hand side is $E[X]$.
Therefore:
$$E[X] = \int_0^\infty P(X > x) \, dx. \quad \blacksquare$$

2. For $X \sim \text{Exp}(\lambda)$, the survival function is $P(X > x) = e^{-\lambda x}$.
Applying the tail formula:
$$E[X] = \int_0^\infty e^{-\lambda x} \, dx = \left[ -\frac{1}{\lambda} e^{-\lambda x} \right]_0^\infty = 0 - \left(-\frac{1}{\lambda}\right) = \frac{1}{\lambda}.$$
The expectation is derived in a single elementary integration step, without integration by parts.

---

### Example 7.2: Method of Indicator Variables in Hash Table Collision Analysis
**Problem:** A distributed hash table allocates $m = 100$ distinct data keys uniformly at random across $n = 50$ server storage buckets.
Each key chooses a bucket independently with probability $1/n$.
1. What is the expected number of empty buckets remaining after all 100 keys are inserted?
2. What is the expected number of collisions (keys that share a bucket with at least one other key)?

**Solution:**
1. Let $E_j$ be the indicator variable for the event that bucket $j$ is empty ($j \in \{1, 2, \dots, n\}$):
$$I_j = \begin{cases} 1 & \text{if bucket } j \text{ is empty} \\ 0 & \text{otherwise} \end{cases}$$
The total number of empty buckets is $X = \sum_{j=1}^n I_j$.
For a specific bucket $j$, a key misses it with probability $1 - \frac{1}{n}$.
Because all $m$ keys are assigned independently:
$$P(I_j = 1) = P(\text{All } m \text{ keys miss bucket } j) = \left(1 - \frac{1}{n}\right)^m.$$
The expectation of an indicator variable is simply its probability:
$$E[I_j] = 1 \cdot P(I_j = 1) + 0 \cdot P(I_j = 0) = \left(1 - \frac{1}{n}\right)^m.$$
Applying **Linearity of Expectation** (Theorem 7.2):
$$E[X] = E\left[ \sum_{j=1}^n I_j \right] = \sum_{j=1}^n E[I_j] = n \left(1 - \frac{1}{n}\right)^m.$$
Notice that the bucket states are dependent (if bucket 1 is empty, the other buckets must hold more keys), yet linearity of expectation holds unconditionally!
Evaluating for $n = 50, m = 100$:
$$E[X] = 50 \left(1 - \frac{1}{50}\right)^{100} = 50 (0.98)^{100} \approx 50 \times 0.13262 = 6.631 \text{ empty buckets}.$$

2. Let $K_i$ be the number of keys assigned to bucket $i$. Then $E[K_i] = \frac{m}{n} = \frac{100}{50} = 2.0$.
A bucket contains *at least 2 keys* (a collision site) if $K_i \ge 2$.
Let $C_j$ be the indicator that bucket $j$ has $\ge 2$ keys:
$$P(C_j = 1) = 1 - P(K_j = 0) - P(K_j = 1).$$
$$P(K_j = 0) = (0.98)^{100} \approx 0.13262.$$
$$P(K_j = 1) = \binom{100}{1} \left(\frac{1}{50}\right)^1 \left(\frac{49}{50}\right)^{99} = 100 \times 0.02 \times (0.98)^{99} \approx 2 \times 0.135326 = 0.27065.$$
$$P(C_j = 1) = 1 - 0.13262 - 0.27065 = 0.59673.$$
The expected number of collision buckets is:
$$E[\text{Collision Buckets}] = n \cdot P(C_j = 1) = 50 \times 0.59673 \approx 29.84 \text{ buckets}.$$

---

### Example 7.3: Poisson Distribution Moments via MGF
**Problem:** Let $X \sim \text{Pois}(\lambda)$ be a Poisson random variable.
1. Derive the Moment Generating Function $M_X(t)$ in closed form.
2. Use $M_X(t)$ to derive $E[X]$, $E[X^2]$, and $\text{Var}(X)$.
3. Derive the Skewness $\gamma_1$ and Excess Kurtosis $\gamma_2$.

**Solution:**
1. By definition of the MGF:
$$M_X(t) = E[e^{tX}] = \sum_{k=0}^\infty e^{tk} \frac{\lambda^k e^{-\lambda}}{k!} = e^{-\lambda} \sum_{k=0}^\infty \frac{(\lambda e^t)^k}{k!}.$$
Recognize the Taylor series of the exponential function $\sum_{k=0}^\infty \frac{u^k}{k!} = e^u$ where $u = \lambda e^t$:
$$M_X(t) = e^{-\lambda} \cdot e^{\lambda e^t} = \exp\left( \lambda(e^t - 1) \right).$$

2. **Differentiating to Extract Moments:**
- **First Derivative:**
  $$M'_X(t) = \frac{d}{dt} \exp(\lambda(e^t - 1)) = \exp(\lambda(e^t - 1)) \cdot (\lambda e^t).$$
  Evaluate at $t = 0$:
  $$E[X] = M'_X(0) = \exp(\lambda(1 - 1)) \cdot (\lambda \cdot 1) = e^0 \cdot \lambda = \lambda.$$
- **Second Derivative:**
  Using the product rule:
  $$M''_X(t) = \frac{d}{dt} \left[ \lambda e^t \exp(\lambda(e^t - 1)) \right] = (\lambda e^t) \exp(\lambda(e^t - 1)) + (\lambda e^t)^2 \exp(\lambda(e^t - 1)).$$
  Evaluate at $t = 0$:
  $$E[X^2] = M''_X(0) = \lambda(1) + \lambda^2(1) = \lambda + \lambda^2.$$
- **Variance:**
  $$\text{Var}(X) = E[X^2] - (E[X])^2 = (\lambda + \lambda^2) - \lambda^2 = \lambda.$$

3. **Higher Moments and Shape Parameters:**
Differentiating further yields the central moments:
- Third central moment: $\mu_3 = E[(X - \lambda)^3] = \lambda$.
- Standard deviation: $\sigma = \sqrt{\lambda}$.
- **Skewness:**
  $$\gamma_1 = \frac{\mu_3}{\sigma^3} = \frac{\lambda}{(\sqrt{\lambda})^3} = \frac{\lambda}{\lambda^{3/2}} = \frac{1}{\sqrt{\lambda}}.$$
  Notice that $\gamma_1 > 0$ (right-skewed), and as $\lambda \to \infty$, $\gamma_1 \to 0$ (approaching Gaussian symmetry).
- Fourth central moment: $\mu_4 = E[(X - \lambda)^4] = 3\lambda^2 + \lambda$.
- **Kurtosis:**
  $$\beta_2 = \frac{\mu_4}{\sigma^4} = \frac{3\lambda^2 + \lambda}{(\sqrt{\lambda})^4} = \frac{3\lambda^2 + \lambda}{\lambda^2} = 3 + \frac{1}{\lambda}.$$
- **Excess Kurtosis:**
  $$\gamma_2 = \beta_2 - 3 = \frac{1}{\lambda}.$$
  As $\lambda \to \infty$, $\gamma_2 \to 0$, confirming asymptotic convergence to the normal distribution.

---

### Example 7.4: MGF of the Standard Normal Distribution
**Problem:** Let $Z \sim \mathcal{N}(0, 1)$ be a standard normal variable with PDF $\phi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2 / 2}$.
1. Derive $M_Z(t)$ in closed form by completing the square.
2. Expand $M_Z(t)$ as a power series to extract all raw moments $E[Z^k]$.

**Solution:**
1. By definition:
$$M_Z(t) = \int_{-\infty}^\infty e^{tz} \frac{1}{\sqrt{2\pi}} e^{-z^2 / 2} \, dz = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty \exp\left( -\frac{z^2 - 2tz}{2} \right) dz.$$
Complete the square in the exponent:
$$z^2 - 2tz = (z - t)^2 - t^2 \implies -\frac{z^2 - 2tz}{2} = -\frac{(z - t)^2}{2} + \frac{t^2}{2}.$$
Factor out the term independent of $z$:
$$M_Z(t) = \exp\left(\frac{t^2}{2}\right) \left[ \frac{1}{\sqrt{2\pi}} \int_{-\infty}^\infty \exp\left(-\frac{(z - t)^2}{2}\right) dz \right].$$
The bracketed term is the integral of a normal density with mean $t$ and variance 1, which integrates to exactly 1.
Therefore:
$$M_Z(t) = e^{t^2 / 2}, \quad \forall t \in \mathbb{R}.$$

2. Expand $e^{t^2 / 2}$ using the exponential Taylor series:
$$e^{t^2 / 2} = \sum_{m=0}^\infty \frac{(t^2 / 2)^m}{m!} = \sum_{m=0}^\infty \frac{t^{2m}}{2^m m!}.$$
Compare this with the general Taylor expansion of an MGF:
$$M_Z(t) = \sum_{k=0}^\infty E[Z^k] \frac{t^k}{k!}.$$
- For all odd powers $k = 2m + 1$: The expansion of $e^{t^2 / 2}$ contains no odd powers of $t$.
  Therefore:
  $$E[Z^{2m + 1}] = 0 \quad \forall m \ge 0 \quad (\text{all odd moments vanish by symmetry}).$$
- For even powers $k = 2m$:
  Equating coefficients of $t^{2m}$:
  $$\frac{E[Z^{2m}]}{(2m)!} = \frac{1}{2^m m!} \implies E[Z^{2m}] = \frac{(2m)!}{2^m m!} = (2m - 1)!!$$
  where $(2m - 1)!! = (2m - 1) \times (2m - 3) \times \dots \times 3 \times 1$ is the double factorial.
  - $m = 1 \implies E[Z^2] = 1!! = 1$.
  - $m = 2 \implies E[Z^4] = 3!! = 3 \times 1 = 3$. (Explaining why Gaussian kurtosis is $\beta_2 = 3$).
  - $m = 3 \implies E[Z^6] = 5!! = 5 \times 3 \times 1 = 15$.
  - $m = 4 \implies E[Z^8] = 7!! = 7 \times 5 \times 3 \times 1 = 105$.

---

### Example 7.5: Skewness and Kurtosis of the Exponential Distribution
**Problem:** Let $X \sim \text{Exp}(\lambda)$ with PDF $f_X(x) = \lambda e^{-\lambda x}$ for $x \ge 0$.
1. Derive the raw moments $E[X^k]$ for any positive integer $k$.
2. Compute the mean $\mu$ and variance $\sigma^2$.
3. Compute the Skewness $\gamma_1$ and Excess Kurtosis $\gamma_2$.

**Solution:**
1. By definition of raw moments:
$$E[X^k] = \int_0^\infty x^k \lambda e^{-\lambda x} \, dx.$$
Substitute $u = \lambda x \implies x = \frac{u}{\lambda}, dx = \frac{du}{\lambda}$:
$$E[X^k] = \int_0^\infty \left(\frac{u}{\lambda}\right)^k \lambda e^{-u} \frac{du}{\lambda} = \frac{1}{\lambda^k} \int_0^\infty u^k e^{-u} \, du.$$
The integral is Euler's Gamma function $\Gamma(k + 1) = k!$:
$$E[X^k] = \frac{k!}{\lambda^k}.$$

2. Evaluating for $k = 1, 2, 3, 4$:
- $E[X] = \mu = \frac{1!}{\lambda^1} = \frac{1}{\lambda}$.
- $E[X^2] = \frac{2!}{\lambda^2} = \frac{2}{\lambda^2}$.
- $\text{Var}(X) = \sigma^2 = E[X^2] - \mu^2 = \frac{2}{\lambda^2} - \frac{1}{\lambda^2} = \frac{1}{\lambda^2} \implies \sigma = \frac{1}{\lambda}$.
- $E[X^3] = \frac{3!}{\lambda^3} = \frac{6}{\lambda^3}$.
- $E[X^4] = \frac{4!}{\lambda^4} = \frac{24}{\lambda^4}$.

3. **Central Moments and Shape Parameters:**
- **Third Central Moment:**
  $$\mu_3 = E[(X - \mu)^3] = E[X^3] - 3\mu E[X^2] + 2\mu^3 = \frac{6}{\lambda^3} - 3\left(\frac{1}{\lambda}\right)\left(\frac{2}{\lambda^2}\right) + 2\left(\frac{1}{\lambda}\right)^3 = \frac{6 - 6 + 2}{\lambda^3} = \frac{2}{\lambda^3}.$$
- **Skewness:**
  $$\gamma_1 = \frac{\mu_3}{\sigma^3} = \frac{2 / \lambda^3}{(1 / \lambda)^3} = 2.0.$$
  The skewness of an Exponential distribution is **identically 2.0**, completely independent of the rate $\lambda$!
- **Fourth Central Moment:**
  $$\mu_4 = E[(X - \mu)^4] = E[X^4] - 4\mu E[X^3] + 6\mu^2 E[X^2] - 3\mu^4$$
  $$= \frac{24}{\lambda^4} - 4\left(\frac{1}{\lambda}\right)\left(\frac{6}{\lambda^3}\right) + 6\left(\frac{1}{\lambda^2}\right)\left(\frac{2}{\lambda^2}\right) - 3\left(\frac{1}{\lambda^4}\right) = \frac{24 - 24 + 12 - 3}{\lambda^4} = \frac{9}{\lambda^4}.$$
- **Kurtosis:**
  $$\beta_2 = \frac{\mu_4}{\sigma^4} = \frac{9 / \lambda^4}{(1 / \lambda)^4} = 9.0.$$
- **Excess Kurtosis:**
  $$\gamma_2 = \beta_2 - 3 = 9.0 - 3.0 = 6.0.$$
  An Exponential distribution has heavy excess kurtosis ($\gamma_2 = 6.0$), generating substantial tail events compared to a Gaussian.

---

### Example 7.6: Linearity of Expectation in Erdős-Rényi Random Graphs
**Problem:** In an Erdős-Rényi random graph $G(n, p)$, there are $n$ vertices. Every potential edge between two distinct vertices exists independently with probability $p \in (0, 1)$.
A **triangle** $K_3$ is a set of three vertices $\{u, v, w\}$ such that all three connecting edges $(u, v)$, $(v, w)$, and $(u, w)$ exist in the graph.
1. What is the expected total number of edges in $G(n, p)$?
2. What is the expected number of triangles in $G(n, p)$?

**Solution:**
1. The total number of pairs of vertices is $\binom{n}{2} = \frac{n(n - 1)}{2}$.
Let $I_e$ be the indicator that edge $e$ exists: $P(I_e = 1) = p$.
Total edges $M = \sum_{e} I_e$.
By Linearity of Expectation:
$$E[M] = \sum_{e} E[I_e] = \binom{n}{2} p = \frac{n(n - 1)}{2} p.$$

2. The total number of candidate triplets of vertices $\{u, v, w\}$ is $\binom{n}{3}$.
For a specific triplet $\{u, v, w\}$, let $I_{uvw}$ be the indicator that all three edges exist:
Since edge formations are independent:
$$P(I_{uvw} = 1) = P((u, v) \in E \cap (v, w) \in E \cap (u, w) \in E) = p \times p \times p = p^3.$$
The total number of triangles is $T = \sum_{\{u, v, w\}} I_{uvw}$.
Notice that different triangles share edges (e.g., $\{u, v, w\}$ and $\{u, v, x\}$ share edge $(u, v)$), so the indicator variables are *strongly dependent*.
However, by Linearity of Expectation (Theorem 7.2), dependence is completely irrelevant:
$$E[T] = E\left[ \sum_{\{u, v, w\}} I_{uvw} \right] = \sum_{\{u, v, w\}} E[I_{uvw}] = \binom{n}{3} p^3 = \frac{n(n - 1)(n - 2)}{6} p^3.$$
For $n = 100$ and $p = 0.05$:
$$E[T] = \frac{100 \times 99 \times 98}{6} (0.05)^3 = 161,700 \times 0.000125 = 20.2125 \text{ triangles}.$$

---

### Example 7.7: LOTUS on Non-Linear Power Transformations
**Problem:** The voltage $V$ across an electrical heater resistor of resistance $R = 10\,\Omega$ fluctuates uniformly between $100\text{ V}$ and $120\text{ V}$:
$$V \sim \mathcal{U}(100, 120).$$
The electrical power dissipated is given by Joule's Law:
$$P = g(V) = \frac{V^2}{R} = \frac{V^2}{10}.$$
1. Use LOTUS to compute the expected power dissipation $E[P]$.
2. Compare $E[P]$ with the naive estimate $g(E[V]) = \frac{(E[V])^2}{R}$.
3. Explain the discrepancy using Jensen's Inequality.

**Solution:**
1. The PDF of $V$ is $f_V(v) = \frac{1}{120 - 100} = \frac{1}{20}$ for $v \in [100, 120]$.
Applying LOTUS (Theorem 7.1):
$$E[P] = E\left[\frac{V^2}{10}\right] = \int_{100}^{120} \frac{v^2}{10} f_V(v) \, dv = \frac{1}{10} \int_{100}^{120} v^2 \left(\frac{1}{20}\right) dv = \frac{1}{200} \left[ \frac{v^3}{3} \right]_{100}^{120}$$
$$= \frac{1}{600} \left( 120^3 - 100^3 \right) = \frac{1}{600} (1,728,000 - 1,000,000) = \frac{728,000}{600} \approx 1,213.33 \text{ Watts}.$$

2. The expected voltage is the midpoint:
$$E[V] = \frac{100 + 120}{2} = 110\text{ V}.$$
The naive plug-in power is:
$$P_{\text{naive}} = \frac{(E[V])^2}{R} = \frac{110^2}{10} = \frac{12,100}{10} = 1,210.00 \text{ Watts}.$$

3. **Comparison and Jensen's Inequality:**
Notice that $E[P] = 1,213.33\text{ W} > P_{\text{naive}} = 1,210.00\text{ W}$.
The function $g(v) = v^2 / 10$ is strictly convex ($g''(v) = 2/10 > 0$).
By **Jensen's Inequality**: For any convex function $g$,
$$E[g(V)] \ge g(E[V]).$$
More specifically:
$$E[V^2] = (E[V])^2 + \text{Var}(V).$$
For a uniform distribution, $\text{Var}(V) = \frac{(b - a)^2}{12} = \frac{20^2}{12} = \frac{400}{12} = \frac{100}{3} \approx 33.33\text{ V}^2$.
Therefore:
$$E[P] = \frac{E[V^2]}{10} = \frac{(E[V])^2 + \text{Var}(V)}{10} = 1,210.00 + \frac{33.33}{10} = 1,210.00 + 3.33 = 1,213.33 \text{ Watts}.$$
The variance of the fluctuating voltage adds exactly $+3.33\text{ Watts}$ of real physical heat dissipation!

---

### Example 7.8: Sum of Independent Exponentials via MGF Uniqueness
**Problem:** Let $X_1, X_2, \dots, X_n$ be independent Exponential random variables with identical rate $\lambda$: $X_i \sim \text{Exp}(\lambda)$.
Prove using Moment Generating Functions that their sum:
$$S_n = \sum_{i=1}^n X_i$$
follows a **Gamma distribution** $\text{Gamma}(n, \lambda)$.

**Solution:**
First, derive the MGF of a single Exponential variable $X_i$:
$$M_{X_i}(t) = \int_0^\infty e^{tx} \lambda e^{-\lambda x} \, dx = \lambda \int_0^\infty e^{-(\lambda - t)x} \, dx = \frac{\lambda}{\lambda - t} = \left(1 - \frac{t}{\lambda}\right)^{-1}, \quad \text{for } t < \lambda.$$
Since $X_1, \dots, X_n$ are independent, the MGF of their sum is the product of their individual MGFs:
$$M_{S_n}(t) = \prod_{i=1}^n M_{X_i}(t) = \left[ \left(1 - \frac{t}{\lambda}\right)^{-1} \right]^n = \left(1 - \frac{t}{\lambda}\right)^{-n} = \left(\frac{\lambda}{\lambda - t}\right)^n.$$
Now compute the MGF of a Gamma distribution $Y \sim \text{Gamma}(\alpha = n, \beta = \lambda)$ with density $f_Y(y) = \frac{\lambda^n}{\Gamma(n)} y^{n - 1} e^{-\lambda y}$:
$$M_Y(t) = \int_0^\infty e^{ty} \frac{\lambda^n}{\Gamma(n)} y^{n - 1} e^{-\lambda y} \, dy = \frac{\lambda^n}{\Gamma(n)} \int_0^\infty y^{n - 1} e^{-(\lambda - t)y} \, dy.$$
Substitute $u = (\lambda - t)y \implies y = \frac{u}{\lambda - t}, dy = \frac{du}{\lambda - t}$:
$$M_Y(t) = \frac{\lambda^n}{\Gamma(n)} \frac{1}{(\lambda - t)^n} \int_0^\infty u^{n - 1} e^{-u} \, du = \frac{\lambda^n}{\Gamma(n)} \frac{\Gamma(n)}{(\lambda - t)^n} = \left(\frac{\lambda}{\lambda - t}\right)^n.$$
Because $M_{S_n}(t) \equiv M_Y(t)$ on $t < \lambda$, by the **MGF Uniqueness Theorem**, the distributions are identical:
$$S_n = \sum_{i=1}^n X_i \sim \text{Gamma}(n, \lambda).$$
The sum of $n$ independent Exponentials is an Erlang / Gamma distribution. $\blacksquare$

---

### Example 7.9: Truncated St. Petersburg Paradox
**Problem:** In the St. Petersburg game, the casino caps the maximum possible payout at $M = 2^{20} = \$1,048,576$ (approximately \$1 million).
If Heads appears on toss $k \le 20$, the player receives $2^k$ dollars. If Heads does not appear within the first 20 tosses ($k > 20$), the game ends and the player receives the cap $M = \$1,048,576$.
Compute the exact fair price (expected value) of this capped game.

**Solution:**
The payoff random variable $X$ is:
$$X = \begin{cases} 2^k & \text{for } k \in \{1, 2, \dots, 20\} \text{ with probability } (1/2)^k \\ 2^{20} & \text{if } k > 20 \text{ with probability } P(K > 20) = (1/2)^{20} \end{cases}$$
Compute the expectation:
$$E[X] = \sum_{k=1}^{20} 2^k P(K = k) + 2^{20} P(K > 20).$$
- Sum of the first 20 outcomes:
  $$\sum_{k=1}^{20} 2^k \left(\frac{1}{2}\right)^k = \sum_{k=1}^{20} 1 = 20 \times 1 = \$20.00.$$
- Payout for the capped tail:
  $$2^{20} \times \left(\frac{1}{2}\right)^{20} = 1 = \$1.00.$$
Summing both contributions:
$$E[X] = 20 + 1 = \$21.00.$$
*Real-World Financial Takeaway:* Even with a massive \$1,000,000 house bankroll, the fair mathematical value of the St. Petersburg game is merely **\$21.00**! The infinite expectation of the classical paradox relies entirely on payouts that exceed the total wealth of the observable universe occurring with probabilities smaller than $10^{-100}$.

---

### Example 7.10: Jensen's Inequality and Risk Aversion
**Problem:** An investor with wealth $W_0 = \$100,000$ considers a risky business venture.
With probability $p = 0.5$, the venture gains $+50\%$ (wealth becomes $\$150,000$); with probability $p = 0.5$, it loses $-40\%$ (wealth becomes $\$60,000$).
The investor has a logarithmic utility function $U(W) = \ln W$.
1. Compute the expected final wealth $E[W]$.
2. Compute the expected utility $E[U(W)]$.
3. Compute the **Certainty Equivalent** $W_{\text{CE}}$ such that $U(W_{\text{CE}}) = E[U(W)]$.
4. Determine whether the investor should accept the venture.

**Solution:**
1. Expected wealth:
$$E[W] = 0.5(\$150,000) + 0.5(\$60,000) = \$75,000 + \$30,000 = \$105,000.$$
Notice that expected wealth increases by $+\$5,000$ ($+5\%$).

2. Expected utility:
$$E[U(W)] = 0.5 \ln(150,000) + 0.5 \ln(60,000) = \ln\left( \sqrt{150,000 \times 60,000} \right) = \ln(\sqrt{9,000,000,000}) = \ln(94,868.33) \approx 11.4602.$$
Notice that the initial utility is:
$$U(W_0) = \ln(100,000) \approx 11.5129.$$

3. The Certainty Equivalent is:
$$U(W_{\text{CE}}) = \ln(W_{\text{CE}}) = \ln(94,868.33) \implies W_{\text{CE}} = \$94,868.33.$$

4. **Decision:**
Since $E[U(W)] = 11.4602 < U(W_0) = 11.5129$ (and $W_{\text{CE}} = \$94,868 < \$100,000$), the investor will **reject the venture**.
Even though expected nominal dollars increase by $+\$5,000$, the concavity of the utility function penalizes the downside risk of losing $\$40,000$ far more severely than it rewards the upside gain of $\$50,000$. Jensen's Inequality guarantees that for concave utility, $E[U(W)] < U(E[W])$.

---

## 7.7 Solved Practice Exercises

---

### Exercise 7.1: General Variance of a Linear Combination
**Problem:** Prove algebraically from the definition of variance that for any two random variables $X$ and $Y$ and scalars $a, b \in \mathbb{R}$:
$$\text{Var}(aX + bY) = a^2 \text{Var}(X) + b^2 \text{Var}(Y) + 2ab \text{Cov}(X, Y).$$

**Solution:**
Let $\mu_X = E[X]$ and $\mu_Y = E[Y]$. By linearity of expectation, $E[aX + bY] = a\mu_X + b\mu_Y$.
By definition of variance:
$$\text{Var}(aX + bY) = E\left[ \left( (aX + bY) - (a\mu_X + b\mu_Y) \right)^2 \right] = E\left[ \left( a(X - \mu_X) + b(Y - \mu_Y) \right)^2 \right].$$
Expand the square:
$$= E\left[ a^2(X - \mu_X)^2 + b^2(Y - \mu_Y)^2 + 2ab(X - \mu_X)(Y - \mu_Y) \right].$$
Applying linearity of expectation:
$$= a^2 E[(X - \mu_X)^2] + b^2 E[(Y - \mu_Y)^2] + 2ab E[(X - \mu_X)(Y - \mu_Y)].$$
Recognizing the definitions:
$$\text{Var}(aX + bY) = a^2 \text{Var}(X) + b^2 \text{Var}(Y) + 2ab \text{Cov}(X, Y). \quad \blacksquare$$

---

### Exercise 7.2: Expected Number of Alternating Runs in Coin Tosses
**Problem:** A fair coin is tossed $n$ times ($n \ge 2$). A **run** is a maximal sequence of consecutive identical outcomes (e.g., $HHTTTHT$ has 4 runs: $HH, TTT, H, T$).
Use indicator variables to compute the expected number of runs $R$.

**Solution:**
A new run begins at trial $i$ ($2 \le i \le n$) if and only if outcome $i$ differs from outcome $i - 1$.
The first run always begins at trial 1.
Let $I_i$ be the indicator that a run transition occurs at toss $i \in \{2, 3, \dots, n\}$:
$$I_i = \begin{cases} 1 & \text{if toss } i \ne \text{toss } i - 1 \\ 0 & \text{otherwise} \end{cases}$$
The total number of runs is:
$$R = 1 + \sum_{i=2}^n I_i.$$
Since the coin is fair, for any adjacent pair of tosses, the outcomes are $\{HH, HT, TH, TT\}$ with equal probability $\frac{1}{4}$.
A transition occurs for $HT$ or $TH$:
$$P(I_i = 1) = P(\text{toss } i \ne \text{toss } i - 1) = \frac{2}{4} = \frac{1}{2}.$$
Thus, $E[I_i] = \frac{1}{2}$.
By Linearity of Expectation:
$$E[R] = 1 + \sum_{i=2}^n E[I_i] = 1 + (n - 1) \left(\frac{1}{2}\right) = 1 + \frac{n - 1}{2} = \frac{n + 1}{2}.$$
For $n = 100$ coin tosses, the expected number of runs is $\frac{101}{2} = 50.5$. $\blacksquare$

---

### Exercise 7.3: MGF of the Continuous Uniform Distribution
**Problem:** Let $X \sim \mathcal{U}(a, b)$.
1. Derive the Moment Generating Function $M_X(t)$.
2. Use L'Hôpital's Rule to verify that $\lim_{t \to 0} M_X(t) = 1$ and $M'_X(0) = \frac{a + b}{2}$.

**Solution:**
1. The PDF is $f_X(x) = \frac{1}{b - a}$ on $[a, b]$.
$$M_X(t) = \int_a^b e^{tx} \frac{1}{b - a} \, dx = \frac{1}{b - a} \left[ \frac{e^{tx}}{t} \right]_a^b = \frac{e^{bt} - e^{at}}{t(b - a)}, \quad t \ne 0.$$

2. As $t \to 0$, the numerator and denominator both approach zero ($\frac{0}{0}$).
Applying L'Hôpital's Rule:
$$\lim_{t \to 0} M_X(t) = \lim_{t \to 0} \frac{b e^{bt} - a e^{at}}{b - a} = \frac{b - a}{b - a} = 1.0.$$
To find $E[X]$, expand the exponentials as Taylor series:
$$e^{bt} - e^{at} = \left(1 + bt + \frac{b^2 t^2}{2} + \dots\right) - \left(1 + at + \frac{a^2 t^2}{2} + \dots\right) = (b - a)t + \frac{b^2 - a^2}{2} t^2 + \mathcal{O}(t^3).$$
Divide by $t(b - a)$:
$$M_X(t) = 1 + \frac{b^2 - a^2}{2(b - a)} t + \mathcal{O}(t^2) = 1 + \left(\frac{a + b}{2}\right) t + \mathcal{O}(t^2).$$
The coefficient of $t$ is the mean:
$$E[X] = M'_X(0) = \frac{a + b}{2}. \quad \blacksquare$$

---

### Exercise 7.4: Failure of the MGF for the Cauchy Distribution
**Problem:** Prove that for a standard Cauchy distribution $f_X(x) = \frac{1}{\pi(1 + x^2)}$, the Moment Generating Function $M_X(t) = E[e^{tX}]$ does not exist for any $t \ne 0$.

**Solution:**
By definition:
$$M_X(t) = \int_{-\infty}^\infty e^{tx} \frac{1}{\pi(1 + x^2)} \, dx.$$
Suppose $t > 0$. Consider the integral over the positive half-line $[0, \infty)$:
$$\int_0^\infty \frac{e^{tx}}{\pi(1 + x^2)} \, dx.$$
By L'Hôpital's Rule:
$$\lim_{x \to \infty} \frac{e^{tx}}{x^2} = \lim_{x \to \infty} \frac{t^2 e^{tx}}{2} = \infty.$$
The exponential numerator $e^{tx}$ grows strictly faster than any polynomial $x^2$.
Therefore, there exists some $x_0 > 0$ such that $\frac{e^{tx}}{\pi(1 + x^2)} > 1$ for all $x \ge x_0$.
Thus:
$$\int_0^\infty \frac{e^{tx}}{\pi(1 + x^2)} \, dx \ge \int_{x_0}^\infty 1 \, dx = \infty.$$
The integral diverges to $+\infty$ for all $t > 0$.
By symmetry, for $t < 0$, the integral diverges as $x \to -\infty$.
Thus, $M_X(t)$ exists only at the trivial point $t = 0$. $\blacksquare$

---

### Exercise 7.5: Central Moments Expressed via Raw Moments
**Problem:** Express the 3rd central moment $\mu_3$ and 4th central moment $\mu_4$ strictly in terms of the raw moments $\mu_1', \mu_2', \mu_3', \mu_4'$.

**Solution:**
Let $\mu = \mu_1'$.
1. **Third Central Moment:**
$$\mu_3 = E[(X - \mu)^3] = E[X^3 - 3\mu X^2 + 3\mu^2 X - \mu^3] = E[X^3] - 3\mu E[X^2] + 3\mu^2 E[X] - \mu^3$$
$$= \mu_3' - 3\mu_1' \mu_2' + 3\mu_1' (\mu_1')^2 - (\mu_1')^3 = \mu_3' - 3\mu_1' \mu_2' + 2(\mu_1')^3.$$

2. **Fourth Central Moment:**
$$\mu_4 = E[(X - \mu)^4] = E[X^4 - 4\mu X^3 + 6\mu^2 X^2 - 4\mu^3 X + \mu^4]$$
$$= E[X^4] - 4\mu E[X^3] + 6\mu^2 E[X^2] - 4\mu^3 E[X] + \mu^4$$
$$= \mu_4' - 4\mu_1' \mu_3' + 6(\mu_1')^2 \mu_2' - 4(\mu_1')^3 \mu_1' + (\mu_1')^4$$
$$= \mu_4' - 4\mu_1' \mu_3' + 6(\mu_1')^2 \mu_2' - 3(\mu_1')^4. \quad \blacksquare$$

---

### Exercise 7.6: Skewness of the Binomial Distribution
**Problem:** Derive the skewness $\gamma_1$ of $X \sim \text{Bin}(n, p)$ and show that it vanishes when $p = 0.5$.

**Solution:**
Represent $X = \sum_{i=1}^n Y_i$ as the sum of $n$ i.i.d. Bernoulli variables $Y_i \sim \text{Bern}(p)$.
For a single Bernoulli variable $Y_i$:
- $\mu = p$
- $\sigma = \sqrt{p(1 - p)}$
- Third central moment:
  $$\mu_3 = E[(Y - p)^3] = (1 - p)^3 p + (0 - p)^3 (1 - p) = (1 - p)p [(1 - p)^2 - p^2]$$
  $$= p(1 - p) [(1 - 2p + p^2) - p^2] = p(1 - p)(1 - 2p).$$
For $n$ independent variables, central moments of order 3 add directly:
$$\mu_{3, X} = n \mu_{3, Y} = n p (1 - p) (1 - 2p).$$
The standard deviation of $X$ is $\sigma_X = \sqrt{n p (1 - p)}$.
The skewness is:
$$\gamma_1 = \frac{\mu_{3, X}}{\sigma_X^3} = \frac{n p (1 - p) (1 - 2p)}{[n p (1 - p)]^{3/2}} = \frac{1 - 2p}{\sqrt{n p (1 - p)}}.$$
When $p = 0.5$:
$$\gamma_1 = \frac{1 - 2(0.5)}{\sqrt{n(0.5)(0.5)}} = \frac{0}{\sqrt{0.25n}} = 0.$$
When $p = 0.5$, the Binomial distribution is perfectly symmetric. $\blacksquare$

---

### Exercise 7.7: Discrete Survival Function Expectation
**Problem:** Prove that for any non-negative integer-valued random variable $X \in \{0, 1, 2, \dots\}$:
$$E[X] = \sum_{k=1}^\infty P(X \ge k).$$

**Solution:**
Express $P(X \ge k)$ as the sum of probabilities:
$$P(X \ge k) = \sum_{j=k}^\infty P(X = j).$$
Now sum over all $k \ge 1$:
$$\sum_{k=1}^\infty P(X \ge k) = \sum_{k=1}^\infty \sum_{j=k}^\infty P(X = j).$$
Interchange the order of summation:
For any fixed value of $j \ge 1$, the index $k$ ranges from $1$ up to $j$:
$$\sum_{j=1}^\infty P(X = j) \left( \sum_{k=1}^j 1 \right) = \sum_{j=1}^\infty P(X = j) \cdot j = \sum_{j=0}^\infty j \cdot P(X = j) = E[X]. \quad \blacksquare$$

---

### Exercise 7.8: Characteristic Function of the Cauchy Distribution
**Problem:** The Characteristic Function of a random variable is $\varphi_X(t) = E[e^{itX}]$, where $i = \sqrt{-1}$.
Given that the characteristic function of a standard Cauchy variable is $\varphi_X(t) = e^{-|t|}$, explain why $\varphi_X(t)$ always exists for all distributions while the MGF $M_X(t)$ often diverges.

**Solution:**
By Euler's formula, $|e^{itX}| = |\cos(tX) + i\sin(tX)| = \sqrt{\cos^2(tX) + \sin^2(tX)} = 1$.
Therefore:
$$|\varphi_X(t)| = \left| \int_{-\infty}^\infty e^{itx} f(x) \, dx \right| \le \int_{-\infty}^\infty |e^{itx}| f(x) \, dx = \int_{-\infty}^\infty 1 \cdot f(x) \, dx = 1.$$
The integrand is strictly bounded on the complex unit circle for all real $t$ and $x$.
Thus, the characteristic function $\varphi_X(t)$ **always exists and is bounded by 1** for every conceivable probability distribution on $\mathbb{R}$, eliminating the exponential divergence that causes MGFs to fail. $\blacksquare$

---

### Exercise 7.9: Cumulant Generating Functions
**Problem:** The **Cumulant Generating Function (CGF)** is defined as $K_X(t) = \ln M_X(t)$.
Prove that for two independent random variables $X$ and $Y$, cumulants are strictly additive:
$$K_{X + Y}(t) = K_X(t) + K_Y(t).$$

**Solution:**
Since $X$ and $Y$ are independent, their MGFs multiply:
$$M_{X + Y}(t) = M_X(t) \cdot M_Y(t).$$
Taking the natural logarithm of both sides:
$$K_{X + Y}(t) = \ln M_{X + Y}(t) = \ln(M_X(t) \cdot M_Y(t)) = \ln M_X(t) + \ln M_Y(t) = K_X(t) + K_Y(t). \quad \blacksquare$$

---

### Exercise 7.10: Wald's Identity for Randomly Stopped Sums
**Problem:** Let $X_1, X_2, \dots$ be i.i.d. random variables with finite expectation $E[X]$, and let $N$ be a non-negative integer-valued random variable independent of all $X_i$ with finite expectation $E[N]$.
Prove **Wald's Identity**:
$$E\left[ \sum_{i=1}^N X_i \right] = E[N] \cdot E[X].$$

**Solution:**
Let $S_N = \sum_{i=1}^N X_i$. Condition on the value of $N = n$ using the Law of Total Expectation (Chapter 8):
$$E[S_N] = E[E[S_N \mid N]].$$
When conditioned on $N = n$:
$$E[S_N \mid N = n] = E\left[ \sum_{i=1}^n X_i \;\middle|\; N = n \right].$$
Since $N$ is independent of all $X_i$:
$$E\left[ \sum_{i=1}^n X_i \;\middle|\; N = n \right] = E\left[ \sum_{i=1}^n X_i \right].$$
Applying linearity of expectation across the fixed $n$ terms:
$$E\left[ \sum_{i=1}^n X_i \right] = \sum_{i=1}^n E[X_i] = n E[X].$$
Thus, as a random variable depending on $N$:
$$E[S_N \mid N] = N \cdot E[X].$$
Taking the outer expectation over $N$:
$$E[S_N] = E[N \cdot E[X]] = E[X] \cdot E[N]. \quad \blacksquare$$
