# Chapter 6: Continuous Random Variables, PDFs, and Variable Transformations

## 6.1 The Continuum Transition: The Paradox of Zero-Probability Events

In discrete probability, every possible outcome $x$ possesses a discrete packet of probability mass $p_X(x) > 0$. If an event occurs, it must correspond to an outcome with strictly positive probability.

In continuous physical reality, however, measurements do not live on discrete integer lattices:
- The precise voltage noise across a resistor: $V \in \mathbb{R}$.
- The exact time an autonomous vehicle's brake pad engages: $t \in [0, \infty)$.
- The angle of a robotic arm joint: $\theta \in [-\pi, \pi]$.

When we measure a continuous physical quantity with infinite precision, a profound mathematical paradox arises:
**The probability of observing any single, infinitely precise real number is identically zero!**
$$P(X = 3.1415926535\dots) = 0$$

```
+---------------------------------------------------------------------------------------------------+
|                           THE PARADOX OF CONTINUOUS PROBABILITY                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  QUESTION: If every individual point x has probability P(X = x) = 0, how can their union have    |
|            probability P(X ∈ ℝ) = 1? Does this not contradict Kolmogorov's Axiom 3?               |
|                                                                                                   |
|  RESOLUTION:                                                                                      |
|  Kolmogorov's Axiom 3 guarantees Countable Additivity (sums over countably infinite sets).        |
|  The real continuum ℝ is UNCOUNTABLY INFINITE (Cantor's diagonal argument).                       |
|  One cannot sum uncountably many zeroes to get 1; one must INTEGRATE a continuous DENSITY.       |
|                                                                                                   |
|  PHYSICAL ANALOGY (CLASSICAL DENSITY):                                                            |
|  A 1-meter steel rod of mass M = 1 kg has non-zero mass.                                          |
|  What is the mass of a single mathematical point on the rod at x = 0.5 m?                         |
|  The mass of a zero-dimensional geometric point is ZERO!                                          |
|  Mass only exists across intervals: Mass = ∫ ρ(x) dx.                                             |
|  Similarly, probability only exists across intervals: P(a ≤ X ≤ b) = ∫ f(x) dx.                   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

In continuous probability, a probability of zero does **not** mean an event is physically impossible. Any single point $\omega$ that actually occurs had prior probability $P(\{\omega\}) = 0$. In continuous spaces, "impossible" means the empty set $\emptyset$, whereas probability zero merely designates a set of measure zero.

---

## 6.2 Probability Density Functions (PDFs) and Continuous Cumulative Distributions

### Definition: Continuous Random Variable
A random variable $X$ is **continuous** if its Cumulative Distribution Function $F_X(x) = P(X \le x)$ is continuous everywhere on $\mathbb{R}$, and can be represented as the integral of a non-negative function $f_X$:
$$F_X(x) = \int_{-\infty}^x f_X(t) \, dt \quad \forall x \in \mathbb{R}$$
The integrand $f_X: \mathbb{R} \to [0, \infty)$ is called the **Probability Density Function (PDF)** of $X$.

By the Fundamental Theorem of Calculus, at every point where $f_X(x)$ is continuous:
$$f_X(x) = \frac{d}{dx} F_X(x) = F'_X(x)$$

### Crucial Distinction: Density is NOT Probability
Students frequently commit the error of treating $f_X(x)$ as a probability.
- Probability $P(A)$ must satisfy $0 \le P(A) \le 1$.
- Probability Density $f_X(x)$ can be **arbitrarily large** ($f_X(x) > 1$ or even $f_X(x) \to \infty$).
For example, for a uniform random variable on $[0, 0.01]$, the density is constant at $f_X(x) = \frac{1}{0.01} = 100$.

The density represents the probability mass per unit length. For an infinitesimal interval $[x, x + dx]$:
$$P(x \le X \le x + dx) = F_X(x + dx) - F_X(x) \approx f_X(x) \, dx$$

#### Foundational Invariants of a Valid PDF:
1. **Non-negativity:** For all $x \in \mathbb{R}$:
   $$f_X(x) \ge 0$$
2. **Total Area Normalization:**
   $$\int_{-\infty}^\infty f_X(x) \, dx = 1$$
3. **Interval Probabilities:**
   For any real numbers $a \le b$:
   $$P(a \le X \le b) = \int_a^b f_X(x) \, dx = F_X(b) - F_X(a)$$
   Because single points have probability zero, boundary inclusion is irrelevant:
   $$P(a \le X \le b) = P(a < X \le b) = P(a \le X < b) = P(a < X < b).$$

---

## 6.3 Canonical Continuous Probability Distributions

Below we examine the core continuous distributions that serve as the building blocks of physical simulation, signal processing, and machine learning.

```
+---------------------------------------------------------------------------------------------------+
|                               CANONICAL CONTINUOUS DISTRIBUTIONS                                  |
+---------------------------------------------------------------------------------------------------+
| Distribution   | Notation         | Density Function f(x)                     | Support           |
+----------------+------------------+-------------------------------------------+-------------------+
| Uniform        | U(a, b)          | 1 / (b - a)                               | [a, b]            |
| Exponential    | Exp(λ)           | λ e^(-λx)                                 | [0, ∞)            |
| Gamma          | Gamma(α, β)      | (β^α / Γ(α)) x^(α-1) e^(-βx)              | [0, ∞)            |
| Beta           | Beta(α, β)       | (1 / B(α, β)) x^(α-1) (1 - x)^(β-1)       | [0, 1]            |
| Cauchy         | Cauchy(x_0, γ)   | (1 / π) [γ / ((x - x_0)^2 + γ^2)]         | (-∞, ∞)           |
+---------------------------------------------------------------------------------------------------+
```

---

### 1. The Continuous Uniform Distribution: $\mathcal{U}(a, b)$
The continuous analogue of equal likelihood. A variable $X$ is distributed uniformly over an interval $[a, b]$ ($a < b$) if its density is completely flat across $[a, b]$ and zero elsewhere.

#### PDF and CDF:
$$f_X(x) = \begin{cases} \frac{1}{b - a} & a \le x \le b \\ 0 & \text{otherwise} \end{cases}$$
$$F_X(x) = \begin{cases} 0 & x < a \\ \frac{x - a}{b - a} & a \le x \le b \\ 1 & x > b \end{cases}$$

#### Principle of Maximum Entropy:
Among all continuous probability distributions supported strictly on a bounded interval $[a, b]$, the uniform distribution maximizes Shannon differential entropy:
$$h(X) = -\int_a^b f(x) \ln f(x) \, dx = \ln(b - a).$$
It represents the state of maximum ignorance regarding the location of $X$ within $[a, b]$.

---

### 2. The Exponential Distribution: $\text{Exp}(\lambda)$
The Exponential distribution models the **continuous waiting time** between Poisson events occurring independently at a constant average rate $\lambda > 0$.

#### PDF and CDF:
$$f_X(x) = \begin{cases} \lambda e^{-\lambda x} & x \ge 0 \\ 0 & x < 0 \end{cases}$$
$$F_X(x) = \int_0^x \lambda e^{-\lambda t} \, dt = \left[ -e^{-\lambda t} \right]_0^x = 1 - e^{-\lambda x}, \quad x \ge 0$$
The survival function (tail probability) is remarkably clean:
$$S_X(x) = P(X > x) = 1 - F_X(x) = e^{-\lambda x}$$

#### Theorem 6.1: Continuous Memoryless Property
The Exponential distribution is the **unique** continuous distribution on $[0, \infty)$ possessing the memoryless property:
$$P(X > s + t \mid X > s) = P(X > t) \quad \forall s, t \ge 0$$

*Proof:*
By definition of conditional probability:
$$P(X > s + t \mid X > s) = \frac{P(X > s + t \cap X > s)}{P(X > s)} = \frac{P(X > s + t)}{P(X > s)}.$$
Substituting the exponential survival function:
$$P(X > s + t \mid X > s) = \frac{e^{-\lambda(s + t)}}{e^{-\lambda s}} = \frac{e^{-\lambda s} e^{-\lambda t}}{e^{-\lambda s}} = e^{-\lambda t} = P(X > t). \quad \blacksquare$$

#### Duality Between Poisson and Exponential Distributions:
Consider a Poisson arrival process with rate $\lambda$.
The count of arrivals in time $t$ is $N(t) \sim \text{Pois}(\lambda t)$.
The waiting time $T_1$ until the *first arrival* exceeds $t$ if and only if *zero arrivals* occur in $[0, t]$:
$$P(T_1 > t) = P(N(t) = 0) = \frac{(\lambda t)^0 e^{-\lambda t}}{0!} = e^{-\lambda t}.$$
Differentiating:
$$F_{T_1}(t) = 1 - e^{-\lambda t} \implies f_{T_1}(t) = \lambda e^{-\lambda t}.$$
The inter-arrival times of a Poisson process are exponentially distributed!

---

### 3. The Gamma Distribution: $\text{Gamma}(\alpha, \beta)$
While the Exponential distribution models the waiting time for the *first* arrival, the Gamma distribution models the waiting time for the **$\alpha$-th arrival** in a Poisson process.

#### The Gamma Function:
The distribution relies on Euler's Gamma function $\Gamma(\alpha)$, which extends the factorial to real numbers:
$$\Gamma(\alpha) = \int_0^\infty t^{\alpha - 1} e^{-t} \, dt, \quad \alpha > 0$$
Integrating by parts proves the recurrence relation:
$$\Gamma(\alpha + 1) = \alpha \Gamma(\alpha).$$
For any positive integer $n$: $\Gamma(n) = (n - 1)!$. For half-integers: $\Gamma(1/2) = \sqrt{\pi}$.

#### PDF:
For shape parameter $\alpha > 0$ and rate parameter $\beta > 0$:
$$f_X(x) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha - 1} e^{-\beta x}, \quad x \ge 0$$

#### Connection to Chi-Squared ($\chi^2(k)$):
When $\alpha = k/2$ and $\beta = 1/2$, the Gamma distribution becomes the **Chi-Squared distribution** with $k$ degrees of freedom ($\chi^2(k)$), which models the sum of squares of $k$ independent standard normal variables:
$$\sum_{i=1}^k Z_i^2 \sim \chi^2(k) \equiv \text{Gamma}\left(\frac{k}{2}, \frac{1}{2}\right).$$

---

### 4. The Beta Distribution: $\text{Beta}(\alpha, \beta)$
The Beta distribution is defined on the bounded unit interval $[0, 1]$, making it the canonical prior distribution for probabilities, proportions, and coin biases $\theta \in [0, 1]$.

#### The Beta Function:
$$\text{B}(\alpha, \beta) = \int_0^1 x^{\alpha - 1} (1 - x)^{\beta - 1} \, dx = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha + \beta)}$$

#### PDF:
$$f_X(x) = \frac{1}{\text{B}(\alpha, \beta)} x^{\alpha - 1} (1 - x)^{\beta - 1}, \quad x \in [0, 1]$$
- When $\alpha = 1, \beta = 1$: Collapses identically to the continuous uniform distribution $\mathcal{U}(0, 1)$.
- When $\alpha = \beta$: Symmetric around $x = 0.5$.
- When $\alpha > 1, \beta > 1$: Bell-shaped unimodal distribution on $[0, 1]$.
- When $\alpha < 1, \beta < 1$: U-shaped bimodal distribution with infinite density poles at $0$ and $1$.

---

### 5. The Cauchy Distribution: The Pathological Heavy Tail
Named after Augustin-Louis Cauchy, this distribution represents the ratio of two independent standard normal variables ($Z_1 / Z_2$), or the intersection of a rotating ray with a line.

#### Standard Cauchy PDF:
$$f_X(x) = \frac{1}{\pi (1 + x^2)}, \quad x \in (-\infty, \infty)$$

#### The Failure of the Mean:
Attempting to calculate the expectation of a Cauchy random variable:
$$E[X] = \int_{-\infty}^\infty \frac{x}{\pi(1 + x^2)} \, dx = \lim_{R \to \infty} \int_{-R}^R \frac{x}{\pi(1 + x^2)} \, dx.$$
While the symmetric Cauchy principal value $\lim_{R \to \infty} \left[ \frac{\ln(1 + R^2) - \ln(1 + R^2)}{2\pi} \right] = 0$, the integral is **not absolutely convergent**:
$$\int_{-\infty}^\infty \frac{|x|}{\pi(1 + x^2)} \, dx = \infty.$$
In Lebesgue integration, when both positive and negative infinities clash ($\infty - \infty$), the expectation is formally **undefined**.
The Cauchy distribution has no mean, no variance, and violates the standard Central Limit Theorem! (The average of $n$ independent Cauchy variables $\frac{1}{n} \sum_{i=1}^n X_i$ is identically another Cauchy variable with no reduction in dispersion!).

---

## 6.4 The Jacobian Transformation of Random Variables

In physics and engineering, we frequently measure an input variable $X$ (e.g., voltage, temperature, velocity), but need the probability distribution of an output variable $Y = g(X)$ (e.g., power $P = V^2 / R$, kinetic energy $E = \frac{1}{2} m v^2$).

```
+---------------------------------------------------------------------------------------------------+
|                        1D TRANSFORMATION DENSITY CONSERVATION                                     |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  Probability mass over an infinitesimal interval must be conserved under coordinate mapping:      |
|                                                                                                   |
|                   P(x ≤ X ≤ x + dx)  =  P(y ≤ Y ≤ y + dy)                                         |
|                                                                                                   |
|                                f_X(x) |dx| = f_Y(y) |dy|                                          |
|                                                                                                   |
|                                f_Y(y) = f_X(x) |dx / dy|                                          |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Theorem 6.2: 1D Monotonic Transformation Rule
Let $X$ be a continuous random variable with PDF $f_X(x)$ and support $\mathcal{X}$. Let $Y = g(X)$ be a strictly monotonic (either strictly increasing or strictly decreasing) and continuously differentiable function on $\mathcal{X}$.
Then the PDF of $Y$ on its support $\mathcal{Y} = g(\mathcal{X})$ is:
$$f_Y(y) = f_X(g^{-1}(y)) \left| \frac{d}{dy} g^{-1}(y) \right| = \frac{f_X(x)}{|g'(x)|} \Bigg|_{x = g^{-1}(y)}$$

*Proof:*
- **Case 1: $g$ is strictly increasing ($g'(x) > 0$):**
  The CDF of $Y$ is:
  $$F_Y(y) = P(Y \le y) = P(g(X) \le y) = P(X \le g^{-1}(y)) = F_X(g^{-1}(y)).$$
  Differentiating with respect to $y$ via the Chain Rule:
  $$f_Y(y) = \frac{d}{dy} F_X(g^{-1}(y)) = f_X(g^{-1}(y)) \cdot \frac{d}{dy} g^{-1}(y).$$
  Since $g$ is increasing, $\frac{d}{dy} g^{-1}(y) > 0$, so $\frac{d}{dy} g^{-1}(y) = \left| \frac{d}{dy} g^{-1}(y) \right|$.
- **Case 2: $g$ is strictly decreasing ($g'(x) < 0$):**
  $$F_Y(y) = P(Y \le y) = P(g(X) \le y) = P(X \ge g^{-1}(y)) = 1 - F_X(g^{-1}(y)).$$
  Differentiating:
  $$f_Y(y) = -f_X(g^{-1}(y)) \cdot \frac{d}{dy} g^{-1}(y) = f_X(g^{-1}(y)) \left( -\frac{d}{dy} g^{-1}(y) \right) = f_X(g^{-1}(y)) \left| \frac{d}{dy} g^{-1}(y) \right|.$$
Combining both cases proves the theorem. $\blacksquare$

### Non-Monotonic Transformations (Multiple Branches)
If $g$ is non-monotonic (e.g., $Y = X^2$), the equation $y = g(x)$ has multiple inverse solutions $x_1, x_2, \dots, x_k$.
By partitioning the domain into monotonic regions:
$$f_Y(y) = \sum_{k} f_X(x_k) \left| \frac{dx_k}{dy} \right| = \sum_{k} \frac{f_X(x_k)}{|g'(x_k)|}$$

---

## 6.5 The Probability Integral Transform (Inverse CDF Sampling)

How do computers generate pseudo-random numbers following arbitrary probability distributions?
Every computing system can natively generate pseudo-random floats uniformly distributed on the unit interval: $U \sim \mathcal{U}(0, 1)$.
The **Probability Integral Transform** proves that we can transform $U$ into *any* desired continuous distribution using the inverse CDF.

### Theorem 6.3: The Probability Integral Transform
1. If $X$ is a continuous random variable with strictly increasing CDF $F_X$, then the transformed variable $U = F_X(X)$ is uniformly distributed on $(0, 1)$:
   $$U \sim \mathcal{U}(0, 1)$$
2. Conversely, if $U \sim \mathcal{U}(0, 1)$, then the variable:
   $$X = F_X^{-1}(U)$$
   has exactly the CDF $F_X$.

*Proof of (2):*
Compute the CDF of $X = F_X^{-1}(U)$:
$$P(X \le x) = P(F_X^{-1}(U) \le x).$$
Since $F_X$ is strictly increasing, applying $F_X$ to both sides preserves the inequality:
$$P(F_X(F_X^{-1}(U)) \le F_X(x)) = P(U \le F_X(x)).$$
For a standard uniform variable $U \sim \mathcal{U}(0, 1)$, $P(U \le u) = u$ for all $u \in [0, 1]$.
Substituting $u = F_X(x)$:
$$P(U \le F_X(x)) = F_X(x).$$
Thus, the variable $X = F_X^{-1}(U)$ matches the target CDF $F_X(x)$ perfectly. $\blacksquare$

*Practical Example (Generating Exponential Variables):*
For an Exponential distribution, $F_X(x) = 1 - e^{-\lambda x}$.
Set $U = 1 - e^{-\lambda X} \iff 1 - U = e^{-\lambda X} \iff \ln(1 - U) = -\lambda X$.
$$X = -\frac{1}{\lambda} \ln(1 - U).$$
Since $1 - U$ is also distributed as $\mathcal{U}(0, 1)$, an exponential random variable is generated in one line of code:
$$X = -\frac{1}{\lambda} \ln(U).$$

---

## 6.5 Worked Examples: First-Principles Solutions

---

### Example 6.1: Normalization, CDF, and Quantile Calculation
**Problem:** A continuous random variable $X$ models the physical displacement of an oscillating pendulum, with probability density given by:
$$f_X(x) = \begin{cases} c(4 - x^2) & -2 \le x \le 2 \\ 0 & \text{otherwise} \end{cases}$$
1. Find the normalization constant $c$.
2. Derive the Cumulative Distribution Function $F_X(x)$.
3. Calculate the probability $P(-1 \le X \le 1)$.
4. Find the median $m$ such that $F_X(m) = 0.50$.

**Solution:**
1. A valid PDF must integrate to unity over its entire support:
$$\int_{-\infty}^\infty f_X(x) \, dx = \int_{-2}^2 c(4 - x^2) \, dx = 1.$$
Since $4 - x^2$ is an even function:
$$c \int_{-2}^2 (4 - x^2) \, dx = 2c \int_0^2 (4 - x^2) \, dx = 2c \left[ 4x - \frac{x^3}{3} \right]_0^2 = 2c \left( 8 - \frac{8}{3} \right) = 2c \left(\frac{16}{3}\right) = \frac{32}{3} c.$$
Setting the integral to 1:
$$\frac{32}{3} c = 1 \implies c = \frac{3}{32} = 0.09375.$$

2. For $x \in [-2, 2]$, the CDF is:
$$F_X(x) = \int_{-2}^x \frac{3}{32}(4 - t^2) \, dt = \frac{3}{32} \left[ 4t - \frac{t^3}{3} \right]_{-2}^x = \frac{3}{32} \left[ \left(4x - \frac{x^3}{3}\right) - \left(-8 - \left(-\frac{8}{3}\right)\right) \right]$$
$$F_X(x) = \frac{3}{32} \left( 4x - \frac{x^3}{3} + \frac{16}{3} \right) = \frac{3}{8} x - \frac{x^3}{32} + \frac{1}{2}, \quad x \in [-2, 2].$$
For $x < -2$, $F_X(x) = 0$. For $x > 2$, $F_X(x) = 1$.

3. To compute $P(-1 \le X \le 1)$:
$$P(-1 \le X \le 1) = F_X(1) - F_X(-1) = \int_{-1}^1 \frac{3}{32}(4 - x^2) \, dx = 2 \times \frac{3}{32} \left[ 4x - \frac{x^3}{3} \right]_0^1 = \frac{3}{16} \left( 4 - \frac{1}{3} \right) = \frac{3}{16} \left(\frac{11}{3}\right) = \frac{11}{16} = 0.6875 \quad (68.75\%).$$

4. The density is strictly symmetric about $x = 0$ ($f_X(-x) = f_X(x)$).
By symmetry:
$$F_X(0) = \frac{3}{8}(0) - 0 + \frac{1}{2} = 0.50.$$
Therefore, the median is $m = 0$.

---

### Example 6.2: Kinetic Energy Distribution from Uniform Velocity
**Problem:** A particles velocity $V$ is distributed uniformly over the interval $[0, v_{\max}]$, so $V \sim \mathcal{U}(0, v_{\max})$.
The particle has mass $m$. The kinetic energy is given by:
$$E = g(V) = \frac{1}{2} m V^2.$$
1. Determine the support of $E$.
2. Derive the Probability Density Function $f_E(e)$ using the Jacobian transformation rule.
3. Check that $f_E(e)$ integrates to 1.

**Solution:**
1. Since $V \in [0, v_{\max}]$, the kinetic energy ranges from $e_{\min} = \frac{1}{2} m(0)^2 = 0$ to $e_{\max} = \frac{1}{2} m v_{\max}^2$.
Support of $E$: $\mathcal{E} = [0, \frac{1}{2} m v_{\max}^2]$.

2. The transformation $g(v) = \frac{1}{2} m v^2$ is strictly increasing on $v \ge 0$.
The inverse function is:
$$e = \frac{1}{2} m v^2 \implies v = g^{-1}(e) = \sqrt{\frac{2e}{m}} = \left(\frac{2}{m}\right)^{1/2} e^{1/2}.$$
The derivative of the inverse function is:
$$\frac{dv}{de} = \frac{d}{de} \left[ \left(\frac{2}{m}\right)^{1/2} e^{1/2} \right] = \frac{1}{2} \left(\frac{2}{m}\right)^{1/2} e^{-1/2} = \frac{1}{\sqrt{2me}}.$$
Applying the Jacobian Transformation Rule (Theorem 6.2):
$$f_E(e) = f_V(g^{-1}(e)) \left| \frac{dv}{de} \right|.$$
Since $V \sim \mathcal{U}(0, v_{\max})$, its density is constant: $f_V(v) = \frac{1}{v_{\max}}$.
Substituting:
$$f_E(e) = \frac{1}{v_{\max}} \frac{1}{\sqrt{2me}} = \frac{1}{v_{\max} \sqrt{2m}} e^{-1/2}, \quad 0 < e \le \frac{1}{2} m v_{\max}^2.$$

3. **Normalization Verification:**
$$\int_0^{\frac{1}{2} m v_{\max}^2} \frac{1}{v_{\max} \sqrt{2m}} e^{-1/2} \, de = \frac{1}{v_{\max} \sqrt{2m}} \left[ 2 e^{1/2} \right]_0^{\frac{1}{2} m v_{\max}^2} = \frac{1}{v_{\max} \sqrt{2m}} \left( 2 \sqrt{\frac{1}{2} m v_{\max}^2} \right) = \frac{1}{v_{\max} \sqrt{2m}} ( \sqrt{2m} v_{\max} ) = 1. \quad \blacksquare$$
Notice that as $e \to 0^+$, $f_E(e) \propto e^{-1/2} \to \infty$. The probability density has an integrable singularity at $e = 0$, illustrating that continuous densities can be unbounded.

---

### Example 6.3: Square of a Standard Normal: Derivation of Chi-Squared $\chi^2(1)$
**Problem:** Let $Z \sim \mathcal{N}(0, 1)$ be a standard normal random variable with PDF:
$$\phi(z) = \frac{1}{\sqrt{2\pi}} e^{-z^2 / 2}, \quad z \in (-\infty, \infty).$$
Derive the Probability Density Function of $Y = Z^2$.

**Solution:**
The transformation $g(z) = z^2$ maps $(-\infty, \infty)$ onto $[0, \infty)$ and is non-monotonic (it is a two-to-one mapping).
We use the CDF method:
For $y > 0$:
$$F_Y(y) = P(Y \le y) = P(Z^2 \le y) = P(-\sqrt{y} \le Z \le \sqrt{y}).$$
By symmetry of the standard normal distribution:
$$P(-\sqrt{y} \le Z \le \sqrt{y}) = \Phi(\sqrt{y}) - \Phi(-\sqrt{y}) = \Phi(\sqrt{y}) - [1 - \Phi(\sqrt{y})] = 2\Phi(\sqrt{y}) - 1.$$
Now differentiate with respect to $y$ using the Leibniz / Chain Rule:
$$f_Y(y) = \frac{d}{dy} F_Y(y) = 2 \frac{d}{dy} \Phi(\sqrt{y}) = 2 \phi(\sqrt{y}) \cdot \frac{d}{dy}(\sqrt{y}).$$
Since $\frac{d}{dy}(\sqrt{y}) = \frac{1}{2\sqrt{y}}$:
$$f_Y(y) = 2 \left( \frac{1}{\sqrt{2\pi}} e^{-(\sqrt{y})^2 / 2} \right) \left(\frac{1}{2\sqrt{y}}\right) = \frac{1}{\sqrt{2\pi}} y^{-1/2} e^{-y / 2}, \quad y > 0.$$
Recognize that $\sqrt{\pi} = \Gamma(1/2)$:
$$f_Y(y) = \frac{(1/2)^{1/2}}{\Gamma(1/2)} y^{1/2 - 1} e^{-y / 2}.$$
This is identically a **Gamma distribution** with shape $\alpha = 1/2$ and rate $\beta = 1/2$:
$$Y = Z^2 \sim \text{Gamma}\left(\frac{1}{2}, \frac{1}{2}\right) \equiv \chi^2(1).$$
The square of a standard normal is a Chi-Squared variable with 1 degree of freedom. $\blacksquare$

---

### Example 6.4: The Log-Normal Distribution
**Problem:** In finance, stock prices are modeled as $S = e^X$, where $X \sim \mathcal{N}(\mu, \sigma^2)$ is a normally distributed log-return with PDF:
$$f_X(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right).$$
1. Derive the Probability Density Function $f_S(s)$ of the stock price $S$.
2. State its support.

**Solution:**
1. The transformation $s = g(x) = e^x$ is strictly increasing for all $x \in \mathbb{R}$.
The inverse transformation is:
$$x = g^{-1}(s) = \ln s, \quad s > 0.$$
The derivative of the inverse function is:
$$\frac{dx}{ds} = \frac{d}{ds}(\ln s) = \frac{1}{s}.$$
Since $s > 0$, $\left| \frac{dx}{ds} \right| = \frac{1}{s}$.
Applying the Jacobian Transformation Rule (Theorem 6.2):
$$f_S(s) = f_X(g^{-1}(s)) \left| \frac{dx}{ds} \right| = f_X(\ln s) \cdot \frac{1}{s}.$$
Substituting the normal density $f_X$:
$$f_S(s) = \frac{1}{s \sigma \sqrt{2\pi}} \exp\left( -\frac{(\ln s - \mu)^2}{2\sigma^2} \right), \quad s > 0.$$

2. The support of $S$ is $\mathcal{S} = (0, \infty)$.
Because $e^x > 0$ for all real $x$, stock prices can never be negative under a log-normal model.

---

### Example 6.5: Inverse CDF Sampling for the Cauchy Distribution
**Problem:** A physics simulation requires generating random impact positions following a standard Cauchy distribution:
$$f_X(x) = \frac{1}{\pi (1 + x^2)}, \quad x \in (-\infty, \infty).$$
1. Derive the Cumulative Distribution Function $F_X(x)$.
2. Derive the analytical inverse CDF formula $F_X^{-1}(u)$.
3. Specify the exact mathematical algorithm to generate standard Cauchy random variates using a uniform pseudo-random number generator $U \sim \mathcal{U}(0, 1)$.

**Solution:**
1. The CDF is the integral of the Cauchy density:
$$F_X(x) = \int_{-\infty}^x \frac{1}{\pi(1 + t^2)} \, dt = \frac{1}{\pi} [\arctan(t)]_{-\infty}^x = \frac{1}{\pi} \left( \arctan(x) - \left(-\frac{\pi}{2}\right) \right) = \frac{1}{\pi} \arctan(x) + \frac{1}{2}.$$

2. To invert the CDF, set $u = F_X(x)$ and solve for $x$:
$$u = \frac{1}{\pi} \arctan(x) + \frac{1}{2} \iff u - \frac{1}{2} = \frac{1}{\pi} \arctan(x).$$
$$\arctan(x) = \pi \left( u - \frac{1}{2} \right).$$
Taking the tangent of both sides:
$$x = F_X^{-1}(u) = \tan\left( \pi \left( u - \frac{1}{2} \right) \right).$$

3. **Algorithm:**
- Generate a uniform pseudo-random float: $U \sim \mathcal{U}(0, 1)$.
- Compute $X = \tan\left( \pi(U - 0.5) \right)$.
By Theorem 6.3 (Probability Integral Transform), $X$ is distributed exactly according to the standard Cauchy distribution.

---

### Example 6.6: Exponential Server Reliability and Race Condition
**Problem:** A dual-redundant cloud service has two independent worker nodes, $A$ and $B$.
Their operational lifetimes until hardware failure are exponentially distributed:
$$T_A \sim \text{Exp}(\lambda_A = 0.02 \text{ hr}^{-1}), \quad T_B \sim \text{Exp}(\lambda_B = 0.03 \text{ hr}^{-1}).$$
1. What is the distribution of the time $T_{\min} = \min(T_A, T_B)$ until the *first* node failure occurs?
2. What is the probability that Node $A$ fails *before* Node $B$ ($P(T_A < T_B)$)?
3. What is the expected time until the first failure?

**Solution:**
1. Compute the survival function of $T_{\min}$:
The first failure occurs after time $t$ if and only if *both* nodes survive past time $t$:
$$P(T_{\min} > t) = P(T_A > t \cap T_B > t).$$
Because the nodes fail independently:
$$P(T_{\min} > t) = P(T_A > t) P(T_B > t) = e^{-\lambda_A t} e^{-\lambda_B t} = e^{-(\lambda_A + \lambda_B) t}.$$
The CDF of $T_{\min}$ is:
$$F_{T_{\min}}(t) = 1 - e^{-(\lambda_A + \lambda_B) t}.$$
This is identically an **Exponential distribution** with rate $\lambda_{\text{total}} = \lambda_A + \lambda_B$:
$$T_{\min} \sim \text{Exp}(\lambda_A + \lambda_B) = \text{Exp}(0.02 + 0.03) = \text{Exp}(0.05 \text{ hr}^{-1}).$$

2. To find the probability that $A$ fails before $B$:
$$P(T_A < T_B) = \int_0^\infty \int_0^{t_B} f_{T_A, T_B}(t_A, t_B) \, dt_A \, dt_B = \int_0^\infty f_{T_B}(t_B) \left[ \int_0^{t_B} \lambda_A e^{-\lambda_A t_A} \, dt_A \right] dt_B$$
$$= \int_0^\infty \lambda_B e^{-\lambda_B t_B} (1 - e^{-\lambda_A t_B}) \, dt_B = \int_0^\infty \lambda_B e^{-\lambda_B t_B} \, dt_B - \lambda_B \int_0^\infty e^{-(\lambda_A + \lambda_B) t_B} \, dt_B$$
$$= 1 - \frac{\lambda_B}{\lambda_A + \lambda_B} = \frac{\lambda_A}{\lambda_A + \lambda_B}.$$
Substituting the numerical values:
$$P(T_A < T_B) = \frac{0.02}{0.02 + 0.03} = \frac{0.02}{0.05} = 0.40 \quad (40.0\%).$$
The probability that a specific exponential component fails first in a pool of independent components is simply its rate divided by the sum of all rates!

3. Expected time until first failure:
$$E[T_{\min}] = \frac{1}{\lambda_A + \lambda_B} = \frac{1}{0.05} = 20.0 \text{ hours}.$$

---

### Example 6.7: The Beta Distribution Mode and Asymmetry
**Problem:** A machine learning model outputs confidence calibration scores following a Beta distribution with parameters $\alpha = 3$ and $\beta = 2$:
$$f_X(x) = \frac{1}{\text{B}(3, 2)} x^{3 - 1} (1 - x)^{2 - 1} = \frac{\Gamma(5)}{\Gamma(3)\Gamma(2)} x^2 (1 - x), \quad x \in [0, 1].$$
1. Compute the normalization constant $\frac{1}{\text{B}(3, 2)}$.
2. Find the mode $\hat{x}$ (the peak of the density function).
3. Compute the expectation $E[X]$.
4. Calculate the probability $P(X \ge 0.5)$.

**Solution:**
1. Evaluating the Gamma functions:
$$\Gamma(5) = 4! = 24, \quad \Gamma(3) = 2! = 2, \quad \Gamma(2) = 1! = 1.$$
$$\frac{1}{\text{B}(3, 2)} = \frac{24}{2 \times 1} = 12.$$
The PDF is:
$$f_X(x) = 12 x^2 (1 - x) = 12x^2 - 12x^3, \quad x \in [0, 1].$$

2. To find the mode, differentiate $f_X(x)$ and set to zero:
$$f'_X(x) = 24x - 36x^2 = 12x(2 - 3x) = 0.$$
For $x \in (0, 1)$, the root is:
$$2 - 3x = 0 \implies \hat{x} = \frac{2}{3} \approx 0.6667.$$
General formula for Beta mode: $\hat{x} = \frac{\alpha - 1}{\alpha + \beta - 2} = \frac{3 - 1}{3 + 2 - 2} = \frac{2}{3}$.

3. Expectation of a Beta distribution:
$$E[X] = \frac{\alpha}{\alpha + \beta} = \frac{3}{3 + 2} = \frac{3}{5} = 0.60.$$
Notice that the mean ($0.60$) is less than the mode ($0.67$), reflecting left-skewness.

4. To compute $P(X \ge 0.5)$:
$$P(X \ge 0.5) = \int_{0.5}^1 (12x^2 - 12x^3) \, dx = \left[ 4x^3 - 3x^4 \right]_{0.5}^1 = (4(1) - 3(1)) - (4(0.5)^3 - 3(0.5)^4)$$
$$= 1 - (4(0.125) - 3(0.0625)) = 1 - (0.50 - 0.1875) = 1 - 0.3125 = 0.6875 \quad (68.75\%).$$

---

### Example 6.8: Derivation of the Rayleigh Distribution in Wireless Signal Fading
**Problem:** In wireless communications (multipath fading), an incoming signal has orthogonal in-phase and quadrature baseband components:
$$X \sim \mathcal{N}(0, \sigma^2), \quad Y \sim \mathcal{N}(0, \sigma^2), \quad X \perp Y.$$
The received envelope amplitude is $R = \sqrt{X^2 + Y^2}$.
Derive the Probability Density Function $f_R(r)$ for $r \ge 0$.

**Solution:**
The joint PDF of $X$ and $Y$ by independence is:
$$f_{X, Y}(x, y) = f_X(x) f_Y(y) = \frac{1}{2\pi \sigma^2} \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right).$$
Convert to polar coordinates $(r, \theta)$ where $x = r \cos\theta, y = r \sin\theta$:
$$x^2 + y^2 = r^2, \quad dx \, dy = r \, dr \, d\theta \quad (\text{Jacobian determinant } J = r).$$
The joint density in polar coordinates is:
$$f_{R, \Theta}(r, \theta) = f_{X, Y}(r\cos\theta, r\sin\theta) \cdot r = \frac{r}{2\pi \sigma^2} \exp\left(-\frac{r^2}{2\sigma^2}\right), \quad r \ge 0, \theta \in [0, 2\pi).$$
To find the marginal distribution of the amplitude $R$, integrate out the angle $\theta$:
$$f_R(r) = \int_0^{2\pi} f_{R, \Theta}(r, \theta) \, d\theta = \frac{r}{2\pi \sigma^2} \exp\left(-\frac{r^2}{2\sigma^2}\right) \int_0^{2\pi} d\theta = \frac{r}{2\pi \sigma^2} \exp\left(-\frac{r^2}{2\sigma^2}\right) (2\pi).$$
$$f_R(r) = \frac{r}{\sigma^2} \exp\left(-\frac{r^2}{2\sigma^2}\right), \quad r \ge 0.$$
This is the celebrated **Rayleigh Distribution**, proving that the Euclidean magnitude of two zero-mean independent Gaussians is Rayleigh distributed. $\blacksquare$

---

### Example 6.9: The Pareto Distribution and the 80/20 Rule
**Problem:** Internet file transfer sizes follow a Pareto distribution with minimum file size $x_m = 10\text{ KB}$ and shape parameter $\alpha = 1.16$:
$$f_X(x) = \frac{\alpha x_m^\alpha}{x^{\alpha + 1}}, \quad x \ge x_m.$$
1. Derive the Cumulative Distribution Function $F_X(x)$ and Survival Function $S_X(x)$.
2. Calculate the probability that a randomly chosen file transfer exceeds $100\text{ KB}$.
3. Prove that for $\alpha = \log_4(5) \approx 1.161$, the top $20\%$ of files account for $80\%$ of total bandwidth (the Pareto 80/20 principle).

**Solution:**
1. The CDF is:
$$F_X(x) = \int_{x_m}^x \frac{\alpha x_m^\alpha}{t^{\alpha + 1}} \, dt = \alpha x_m^\alpha \left[ -\frac{1}{\alpha t^\alpha} \right]_{x_m}^x = x_m^\alpha \left( \frac{1}{x_m^\alpha} - \frac{1}{x^\alpha} \right) = 1 - \left(\frac{x_m}{x}\right)^\alpha, \quad x \ge x_m.$$
The survival function is:
$$S_X(x) = P(X > x) = \left(\frac{x_m}{x}\right)^\alpha.$$

2. For $x = 100\text{ KB}$ with $x_m = 10\text{ KB}$ and $\alpha = 1.16$:
$$P(X > 100) = \left(\frac{10}{100}\right)^{1.16} = (0.10)^{1.16} = 10^{-1.16} \approx 0.06918 \quad (6.92\%).$$

3. **Derivation of the 80/20 Rule:**
The cumulative fraction of items exceeding threshold $x$ is $p = S_X(x) = (x_m / x)^\alpha \implies x = x_m p^{-1/\alpha}$.
The total mass contributed by files of size $> x$ is given by the top Lorenz curve:
$$L(p) = \frac{\int_x^\infty t f(t) \, dt}{\int_{x_m}^\infty t f(t) \, dt}.$$
For a Pareto distribution:
$$\int_x^\infty t \left( \frac{\alpha x_m^\alpha}{t^{\alpha + 1}} \right) dt = \alpha x_m^\alpha \int_x^\infty t^{-\alpha} \, dt = \frac{\alpha}{\alpha - 1} x_m^\alpha x^{1 - \alpha}.$$
The denominator is the total expectation ($\text{at } x = x_m$): $\frac{\alpha}{\alpha - 1} x_m$.
Dividing:
$$L(p) = \frac{x^{1 - \alpha}}{x_m^{1 - \alpha}} = \left(\frac{x_m}{x}\right)^{\alpha - 1}.$$
Since $p = (x_m / x)^\alpha \implies x_m / x = p^{1/\alpha}$:
$$L(p) = \left(p^{1/\alpha}\right)^{\alpha - 1} = p^{1 - 1/\alpha} = p^{(\alpha - 1)/\alpha}.$$
Setting $p = 0.20$ (top $20\%$) and requiring $L(0.20) = 0.80$ (80% of bandwidth):
$$(0.20)^{(\alpha - 1)/\alpha} = 0.80 \iff \left(\frac{1}{5}\right)^{(\alpha - 1)/\alpha} = \frac{4}{5}.$$
Taking logarithms:
$$\frac{\alpha - 1}{\alpha} \ln(0.20) = \ln(0.80) \implies \left(1 - \frac{1}{\alpha}\right)(-\ln 5) = \ln 4 - \ln 5.$$
$$1 - \frac{1}{\alpha} = 1 - \frac{\ln 4}{\ln 5} \implies \frac{1}{\alpha} = \frac{\ln 4}{\ln 5} \implies \alpha = \frac{\ln 5}{\ln 4} = \log_4(5) \approx 1.16096. \quad \blacksquare$$

---

### Example 6.10: Triangular Distribution via Sum of Two Uniforms
**Problem:** Let $X \sim \mathcal{U}(0, 1)$ and $Y \sim \mathcal{U}(0, 1)$ be independent standard uniform random variables.
Prove by continuous convolution that their sum $Z = X + Y$ follows a symmetric **Triangular distribution** on $[0, 2]$:
$$f_Z(z) = \begin{cases} z & 0 \le z \le 1 \\ 2 - z & 1 < z \le 2 \\ 0 & \text{otherwise} \end{cases}$$

**Solution:**
The continuous convolution formula for the sum of two independent variables is:
$$f_Z(z) = \int_{-\infty}^\infty f_X(x) f_Y(z - x) \, dx.$$
Since $X \sim \mathcal{U}(0, 1)$, $f_X(x) = 1$ for $0 \le x \le 1$ and zero elsewhere.
Thus, the integral limits contract to $[0, 1]$:
$$f_Z(z) = \int_0^1 f_Y(z - x) \, dx.$$
Similarly, $f_Y(z - x) = 1$ if and only if $0 \le z - x \le 1 \iff z - 1 \le x \le z$.
Intersecting the two constraints on $x$:
$$x \in [0, 1] \cap [z - 1, z] \implies \max(0, z - 1) \le x \le \min(1, z).$$
Now evaluate across the two distinct regions of $z \in [0, 2]$:
- **Region 1: $0 \le z \le 1$:**
  Here $z - 1 \le 0$ and $z \le 1$.
  The integration interval is $[\max(0, z - 1), \min(1, z)] = [0, z]$.
  $$f_Z(z) = \int_0^z 1 \, dx = z.$$
- **Region 2: $1 < z \le 2$:**
  Here $z - 1 > 0$ and $z > 1$.
  The integration interval is $[\max(0, z - 1), \min(1, z)] = [z - 1, 1]$.
  $$f_Z(z) = \int_{z - 1}^1 1 \, dx = 1 - (z - 1) = 2 - z.$$
For $z < 0$ or $z > 2$, the intersection is empty, so $f_Z(z) = 0$.
Combining the cases:
$$f_Z(z) = \begin{cases} z & 0 \le z \le 1 \\ 2 - z & 1 < z \le 2 \\ 0 & \text{otherwise} \end{cases}$$
This proves that the sum of two independent uniform variables produces a triangular density. $\blacksquare$

---

## 6.6 Solved Practice Exercises

---

### Exercise 6.1: Differentiating an Integral CDF with Variable Limits
**Problem:** A continuous random variable $X$ has CDF given by:
$$F_X(x) = \int_0^{x^2} \frac{1}{\sqrt{2\pi}} e^{-t/2} \, dt, \quad x \ge 0.$$
Compute the Probability Density Function $f_X(x)$ for $x > 0$ using Leibniz's Integral Rule.

**Solution:**
By Leibniz's Integral Rule:
$$\frac{d}{dx} \left[ \int_{a(x)}^{b(x)} g(t) \, dt \right] = g(b(x)) \cdot b'(x) - g(a(x)) \cdot a'(x).$$
Here $a(x) = 0$ (constant), $b(x) = x^2 \implies b'(x) = 2x$, and $g(t) = \frac{1}{\sqrt{2\pi}} e^{-t/2}$.
Differentiating $F_X(x)$:
$$f_X(x) = \frac{d}{dx} F_X(x) = g(x^2) \cdot (2x) - 0 = \frac{1}{\sqrt{2\pi}} e^{-x^2 / 2} \cdot 2x = \sqrt{\frac{2}{\pi}} x e^{-x^2 / 2}, \quad x > 0.$$
*(Notice that this is the Chi distribution with 2 degrees of freedom, also known as the Rayleigh distribution with $\sigma = 1$).* $\blacksquare$

---

### Exercise 6.2: Distribution of the Reciprocal of an Exponential Variable
**Problem:** Let $X \sim \text{Exp}(\lambda)$ with PDF $f_X(x) = \lambda e^{-\lambda x}$ for $x > 0$.
Find the Probability Density Function of $Y = 1 / X$.

**Solution:**
The transformation $y = g(x) = 1/x$ maps $(0, \infty)$ onto $(0, \infty)$ and is strictly decreasing for $x > 0$.
The inverse function is:
$$x = g^{-1}(y) = \frac{1}{y}, \quad y > 0.$$
The derivative of the inverse function is:
$$\frac{dx}{dy} = -\frac{1}{y^2} \implies \left| \frac{dx}{dy} \right| = \frac{1}{y^2}.$$
Applying the Jacobian Transformation Rule:
$$f_Y(y) = f_X\left(\frac{1}{y}\right) \left| \frac{dx}{dy} \right| = \left( \lambda e^{-\lambda / y} \right) \left( \frac{1}{y^2} \right) = \frac{\lambda}{y^2} e^{-\lambda / y}, \quad y > 0. \quad \blacksquare$$

---

### Exercise 6.3: Continuous Memoryless Differential Equation Proof
**Problem:** Let $S(x) = P(X > x)$ be the survival function of a continuous non-negative random variable satisfying the memoryless property $S(s + t) = S(s) S(t)$ for all $s, t \ge 0$, with $S(0) = 1$ and $S'(0) = -\lambda < 0$.
Prove by solving a differential equation that $S(x) = e^{-\lambda x}$.

**Solution:**
By the definition of the derivative:
$$S'(x) = \lim_{h \to 0} \frac{S(x + h) - S(x)}{h}.$$
Using the memoryless property $S(x + h) = S(x) S(h)$:
$$S'(x) = \lim_{h \to 0} \frac{S(x) S(h) - S(x)}{h} = S(x) \lim_{h \to 0} \frac{S(h) - 1}{h}.$$
Since $S(0) = 1$, the limit is simply the derivative at zero:
$$\lim_{h \to 0} \frac{S(h) - S(0)}{h} = S'(0) = -\lambda.$$
Therefore:
$$S'(x) = -\lambda S(x) \iff \frac{S'(x)}{S(x)} = -\lambda.$$
Integrating both sides with respect to $x$:
$$\ln S(x) = -\lambda x + C \implies S(x) = A e^{-\lambda x}.$$
Using the initial condition $S(0) = 1$:
$$A e^0 = 1 \implies A = 1.$$
Thus:
$$S(x) = e^{-\lambda x} \implies F_X(x) = 1 - e^{-\lambda x}.$$
This proves that the Exponential distribution is the unique differentiable continuous memoryless distribution. $\blacksquare$

---

### Exercise 6.4: The Weibull Hazard Rate Function
**Problem:** In material science and reliability engineering, the **hazard rate** (failure rate) is defined as:
$$h(x) = \frac{f(x)}{S(x)} = \frac{f(x)}{1 - F(x)}.$$
For a **Weibull distribution** with CDF $F(x) = 1 - \exp(-(x / \lambda)^k)$ ($x \ge 0$, shape $k > 0$, scale $\lambda > 0$):
1. Derive the PDF $f(x)$.
2. Derive the hazard rate function $h(x)$.
3. Explain how $k < 1$, $k = 1$, and $k > 1$ model infant mortality, random failure, and aging wear-out.

**Solution:**
1. Differentiating the CDF:
$$f(x) = \frac{d}{dx} \left[ 1 - e^{-(x/\lambda)^k} \right] = -e^{-(x/\lambda)^k} \left( -k \left(\frac{x}{\lambda}\right)^{k - 1} \frac{1}{\lambda} \right) = \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k - 1} e^{-(x/\lambda)^k}, \quad x \ge 0.$$

2. The survival function is $S(x) = 1 - F(x) = e^{-(x/\lambda)^k}$.
The hazard rate is:
$$h(x) = \frac{f(x)}{S(x)} = \frac{\frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k - 1} e^{-(x/\lambda)^k}}{e^{-(x/\lambda)^k}} = \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k - 1}.$$

3. **Behavior Across $k$:**
- **$k = 1$:** $h(x) = \frac{1}{\lambda}$ (constant failure rate; collapses to the memoryless Exponential distribution).
- **$k < 1$:** Since $k - 1 < 0$, $h(x)$ strictly decreases over time. This models **infant mortality** or burn-in (defective components fail early; survivors become more reliable).
- **$k > 1$:** Since $k - 1 > 0$, $h(x)$ strictly increases over time. This models **wear-out and physical fatigue** (older mechanical components are increasingly prone to failure). $\blacksquare$

---

### Exercise 6.5: Ratio of Two Independent Standard Uniforms
**Problem:** Let $X \sim \mathcal{U}(0, 1)$ and $Y \sim \mathcal{U}(0, 1)$ be independent. Find the Probability Density Function of their ratio $Z = X / Y$.

**Solution:**
The joint density is $f_{X, Y}(x, y) = 1$ on the unit square $[0, 1] \times [0, 1]$.
For $z > 0$, the CDF is:
$$F_Z(z) = P\left(\frac{X}{Y} \le z\right) = P(X \le zY).$$
We integrate over the region in the unit square where $x \le z y$:
- **Case 1: $0 < z \le 1$:**
  The line $x = z y$ cuts the unit square into a triangle with vertices at $(0, 0)$, $(z, 1)$, and $(0, 1)$.
  Base along $y = 1$ is $z$, height along $y$-axis is $1$.
  $$F_Z(z) = \text{Area}(\text{Triangle}) = \frac{1}{2} \times z \times 1 = \frac{z}{2}.$$
  Differentiating:
  $$f_Z(z) = \frac{d}{dz}\left(\frac{z}{2}\right) = \frac{1}{2}, \quad 0 < z \le 1.$$
- **Case 2: $z > 1$:**
  It is simpler to integrate the complementary triangle where $x > z y$:
  Vertices at $(0, 0)$, $(1, 1/z)$, and $(1, 0)$.
  Base along $x = 1$ is $1/z$, height is $1$.
  $$P(Z > z) = \frac{1}{2} \times 1 \times \frac{1}{z} = \frac{1}{2z}.$$
  Thus:
  $$F_Z(z) = 1 - \frac{1}{2z}.$$
  Differentiating:
  $$f_Z(z) = \frac{d}{dz}\left(1 - \frac{1}{2z}\right) = \frac{1}{2z^2}, \quad z > 1.$$
Combining the cases:
$$f_Z(z) = \begin{cases} \frac{1}{2} & 0 < z \le 1 \\ \frac{1}{2z^2} & z > 1 \\ 0 & \text{otherwise} \end{cases} \quad \blacksquare$$

---

### Exercise 6.6: Inverse CDF Formula for Pareto Sampling
**Problem:** Derive the explicit inverse CDF sampling formula to generate random variates from a Pareto distribution with minimum scale $x_m$ and shape $\alpha$, using a standard uniform generator $U \sim \mathcal{U}(0, 1)$.

**Solution:**
From Example 6.9, the Pareto CDF is:
$$F_X(x) = 1 - \left(\frac{x_m}{x}\right)^\alpha, \quad x \ge x_m.$$
Set $u = F_X(x)$ and solve for $x$:
$$u = 1 - \left(\frac{x_m}{x}\right)^\alpha \iff 1 - u = \left(\frac{x_m}{x}\right)^\alpha.$$
Raising both sides to the power $1 / \alpha$:
$$(1 - u)^{1/\alpha} = \frac{x_m}{x} \iff x = \frac{x_m}{(1 - u)^{1/\alpha}} = x_m (1 - u)^{-1/\alpha}.$$
Since $1 - U \sim \mathcal{U}(0, 1)$ whenever $U \sim \mathcal{U}(0, 1)$, we can simplify the generator to:
$$X = x_m U^{-1/\alpha}. \quad \blacksquare$$

---

### Exercise 6.7: Maximum of $n$ Independent Exponentials
**Problem:** Let $X_1, X_2, \dots, X_n$ be i.i.d. Exponential random variables with rate $\lambda$.
Find the CDF and PDF of the maximum $M = \max(X_1, X_2, \dots, X_n)$.

**Solution:**
The maximum $M \le x$ if and only if *every* individual $X_i \le x$:
$$F_M(x) = P(M \le x) = P\left(\bigcap_{i=1}^n \{X_i \le x\}\right).$$
By stochastic independence:
$$F_M(x) = \prod_{i=1}^n P(X_i \le x) = [F_X(x)]^n.$$
For $X_i \sim \text{Exp}(\lambda)$, $F_X(x) = 1 - e^{-\lambda x}$ for $x \ge 0$.
Therefore, the CDF of the maximum is:
$$F_M(x) = (1 - e^{-\lambda x})^n, \quad x \ge 0.$$
Differentiating to find the PDF:
$$f_M(x) = \frac{d}{dx} \left[ (1 - e^{-\lambda x})^n \right] = n (1 - e^{-\lambda x})^{n - 1} \left( \lambda e^{-\lambda x} \right) = n \lambda e^{-\lambda x} (1 - e^{-\lambda x})^{n - 1}, \quad x \ge 0. \quad \blacksquare$$

---

### Exercise 6.8: Minimum of $n$ Independent Non-Identical Exponentials
**Problem:** Let $X_1, X_2, \dots, X_n$ be independent Exponential random variables with distinct rates $\lambda_1, \lambda_2, \dots, \lambda_n$.
Prove that the minimum $L = \min(X_1, \dots, X_n)$ is distributed as $\text{Exp}\left(\sum_{i=1}^n \lambda_i\right)$.

**Solution:**
The minimum $L > x$ if and only if *all* $X_i > x$:
$$P(L > x) = P\left(\bigcap_{i=1}^n \{X_i > x\}\right) = \prod_{i=1}^n P(X_i > x).$$
For an Exponential distribution, $P(X_i > x) = e^{-\lambda_i x}$.
Substituting:
$$P(L > x) = \prod_{i=1}^n e^{-\lambda_i x} = \exp\left( -\sum_{i=1}^n \lambda_i x \right) = \exp\left( -\left(\sum_{i=1}^n \lambda_i\right) x \right).$$
The CDF is:
$$F_L(x) = 1 - P(L > x) = 1 - \exp\left( -\left(\sum_{i=1}^n \lambda_i\right) x \right).$$
This is identically an Exponential distribution with rate $\lambda_{\text{sum}} = \sum_{i=1}^n \lambda_i$. $\blacksquare$

---

### Exercise 6.9: Beta Distribution as an Order Statistic of Uniforms
**Problem:** Let $U_1, U_2, \dots, U_n$ be i.i.d. standard uniform variables $\mathcal{U}(0, 1)$. Let $U_{(k)}$ denote the $k$-th smallest value (the $k$-th order statistic).
Prove that $U_{(k)} \sim \text{Beta}(k, n - k + 1)$.

**Solution:**
The probability that $U_{(k)}$ falls in the infinitesimal interval $[u, u + du]$ requires:
1. Exactly $k - 1$ of the variables must fall strictly below $u$ (each with probability $u$).
2. Exactly 1 variable must fall in $[u, u + du]$ (with probability $du$).
3. The remaining $n - k$ variables must fall strictly above $u$ (each with probability $1 - u$).
The number of ways to partition the $n$ distinct variables into these three groups is given by the multinomial coefficient:
$$\frac{n!}{(k - 1)! \times 1! \times (n - k)!}.$$
Multiplying the probabilities:
$$f_{U_{(k)}}(u) \, du = \frac{n!}{(k - 1)! (n - k)!} u^{k - 1} (1 - u)^{n - k} \, du.$$
Notice that:
$$\frac{n!}{(k - 1)! (n - k)!} = \frac{\Gamma(n + 1)}{\Gamma(k) \Gamma(n - k + 1)} = \frac{1}{\text{B}(k, n - k + 1)}.$$
Thus:
$$f_{U_{(k)}}(u) = \frac{1}{\text{B}(k, n - k + 1)} u^{k - 1} (1 - u)^{(n - k + 1) - 1}, \quad u \in [0, 1].$$
This is identically $\text{Beta}(k, n - k + 1)$. $\blacksquare$

---

### Exercise 6.10: The Box-Muller Transformation
**Problem:** George Box and Mervin Muller (1958) proved that two independent standard normal variables can be generated from two independent standard uniforms $U_1, U_2 \sim \mathcal{U}(0, 1)$ via:
$$Z_1 = \sqrt{-2\ln U_1} \cos(2\pi U_2), \quad Z_2 = \sqrt{-2\ln U_1} \sin(2\pi U_2).$$
Prove that $Z_1, Z_2 \sim \mathcal{N}(0, 1)$ and $Z_1 \perp Z_2$ using the 2D Jacobian transformation.

**Solution:**
Invert the transformation to express $U_1$ and $U_2$ in terms of $Z_1$ and $Z_2$:
Squaring and adding:
$$Z_1^2 + Z_2^2 = -2\ln U_1 (\cos^2(2\pi U_2) + \sin^2(2\pi U_2)) = -2\ln U_1.$$
$$\ln U_1 = -\frac{Z_1^2 + Z_2^2}{2} \implies U_1 = \exp\left(-\frac{Z_1^2 + Z_2^2}{2}\right).$$
Dividing $Z_2$ by $Z_1$:
$$\frac{Z_2}{Z_1} = \tan(2\pi U_2) \implies 2\pi U_2 = \arctan\left(\frac{Z_2}{Z_1}\right) \implies U_2 = \frac{1}{2\pi} \arctan\left(\frac{Z_2}{Z_1}\right).$$
Now compute the Jacobian matrix $J = \frac{\partial(u_1, u_2)}{\partial(z_1, z_2)}$:
$$\frac{\partial u_1}{\partial z_1} = -z_1 \exp\left(-\frac{z_1^2 + z_2^2}{2}\right), \quad \frac{\partial u_1}{\partial z_2} = -z_2 \exp\left(-\frac{z_1^2 + z_2^2}{2}\right).$$
$$\frac{\partial u_2}{\partial z_1} = \frac{1}{2\pi} \frac{-z_2 / z_1^2}{1 + (z_2/z_1)^2} = -\frac{z_2}{2\pi(z_1^2 + z_2^2)}, \quad \frac{\partial u_2}{\partial z_2} = \frac{1}{2\pi} \frac{1/z_1}{1 + (z_2/z_1)^2} = \frac{z_1}{2\pi(z_1^2 + z_2^2)}.$$
The Jacobian determinant is:
$$\det(J) = \left(\frac{\partial u_1}{\partial z_1}\right)\left(\frac{\partial u_2}{\partial z_2}\right) - \left(\frac{\partial u_1}{\partial z_2}\right)\left(\frac{\partial u_2}{\partial z_1}\right)$$
$$= \exp\left(-\frac{z_1^2 + z_2^2}{2}\right) \left[ -z_1 \left(\frac{z_1}{2\pi(z_1^2 + z_2^2)}\right) - (-z_2) \left(-\frac{z_2}{2\pi(z_1^2 + z_2^2)}\right) \right]$$
$$= \exp\left(-\frac{z_1^2 + z_2^2}{2}\right) \left[ -\frac{z_1^2 + z_2^2}{2\pi(z_1^2 + z_2^2)} \right] = -\frac{1}{2\pi} \exp\left(-\frac{z_1^2 + z_2^2}{2}\right).$$
Taking the absolute value:
$$|\det(J)| = \frac{1}{2\pi} \exp\left(-\frac{z_1^2 + z_2^2}{2}\right).$$
Since $U_1, U_2 \sim \mathcal{U}(0, 1)$ are independent, $f_{U_1, U_2}(u_1, u_2) = 1$.
Therefore:
$$f_{Z_1, Z_2}(z_1, z_2) = f_{U_1, U_2}(u_1, u_2) |\det(J)| = \frac{1}{2\pi} \exp\left(-\frac{z_1^2 + z_2^2}{2}\right) = \left( \frac{1}{\sqrt{2\pi}} e^{-z_1^2 / 2} \right) \left( \frac{1}{\sqrt{2\pi}} e^{-z_2^2 / 2} \right).$$
The joint density factors into two independent standard normal densities. $\blacksquare$
