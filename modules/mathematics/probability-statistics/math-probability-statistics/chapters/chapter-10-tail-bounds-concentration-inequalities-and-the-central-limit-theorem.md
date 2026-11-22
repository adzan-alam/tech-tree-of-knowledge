# Chapter 10: Tail Bounds, Concentration Inequalities, and the Central Limit Theorem

> *"The Law of Large Numbers is the bridge connecting the mathematical abstraction of probability with the empirical reality of the physical world. Without concentration of measure, science itself—the ability to measure invariant laws from noisy samples—would be fundamentally impossible."*  
> — **Pafnuty Chebyshev**, *Mémoire sur les nombres premiers* (1867)

---

## 10.1 Markov’s and Chebyshev’s Inequalities: Bounding the Unseen

In practical computer science, algorithm design, distributed systems, and statistical learning, we rarely possess complete knowledge of a random variable's exact probability density function. Frequently, only coarse aggregate metrics—such as the mean $\mathbb{E}[X]$ or the variance $\text{Var}(X)$—are accessible.

**Concentration inequalities** allow us to answer a fundamental question: *How tightly does a random variable cluster around its expected value, and what is the maximum possible probability of an extreme deviation?*

### 10.1.1 Markov’s Inequality: The Non-Negative Anchor

The foundational bedrock of all concentration bounds is **Markov’s Inequality**. It applies to any non-negative random variable and asserts that a random variable cannot take large values with high probability without inflating its expectation.

#### Theorem: Markov’s Inequality
Let $X$ be a non-negative random variable ($X \ge 0$ almost surely) with finite expectation $\mathbb{E}[X] < \infty$. Then for any threshold $a > 0$:
$$
P(X \ge a) \le \frac{\mathbb{E}[X]}{a}
$$

*Proof:*  
Let $\mathbb{I}_{\{X \ge a\}}$ be the indicator random variable of the event $\{X \ge a\}$, which equals $1$ if $X \ge a$ and $0$ if $X < a$.  
Because $X \ge 0$, we have the pointwise inequality for all $\omega \in \Omega$:
$$
X \ge a \cdot \mathbb{I}_{\{X \ge a\}}
$$
Taking mathematical expectation on both sides and utilizing the monotonicity of expectation:
$$
\mathbb{E}[X] \ge \mathbb{E}[a \cdot \mathbb{I}_{\{X \ge a\}}] = a \, \mathbb{E}[\mathbb{I}_{\{X \ge a\}}] = a \, P(X \ge a)
$$
Dividing by $a > 0$ yields the desired bound:
$$
P(X \ge a) \le \frac{\mathbb{E}[X]}{a} \quad \blacksquare
$$

```
               Geometric Intuition of Markov's Inequality
      Density f(x)
          ^
          |      Shaded Area = P(X >= a)
          |              +---------+
          |             /|         |
          |            / |         |
          |           /  |/////////|
          |          /   |/////////|
          +---------+----+---------+---------> x
          0              a
          Area * a <= Total Area Under Curve * x = E[X]
```

### 10.1.2 Chebyshev’s Inequality: Leveraging Variance

Markov's bound is often loose because it uses only first-moment information ($\mathbb{E}[X]$). When the second moment $\text{Var}(X) = \sigma^2$ is known, we can apply Markov’s inequality to the squared deviation $(X - \mu)^2$.

#### Theorem: Chebyshev’s Inequality
Let $X$ be any random variable with mean $\mu = \mathbb{E}[X]$ and finite variance $\sigma^2 = \text{Var}(X) < \infty$. Then for any $k > 0$:
$$
P(|X - \mu| \ge k\sigma) \le \frac{1}{k^2}
$$
Or equivalently, for any deviation $\epsilon > 0$:
$$
P(|X - \mu| \ge \epsilon) \le \frac{\sigma^2}{\epsilon^2}
$$

*Proof:*  
Notice that $|X - \mu| \ge \epsilon \iff (X - \mu)^2 \ge \epsilon^2$.  
Because $(X - \mu)^2$ is a non-negative random variable, we apply Markov's inequality directly to $(X - \mu)^2$ with threshold $\epsilon^2$:
$$
P(|X - \mu| \ge \epsilon) = P\left((X - \mu)^2 \ge \epsilon^2\right) \le \frac{\mathbb{E}[(X - \mu)^2]}{\epsilon^2} = \frac{\sigma^2}{\epsilon^2}
$$
Setting $\epsilon = k\sigma$ yields:
$$
P(|X - \mu| \ge k\sigma) \le \frac{\sigma^2}{(k\sigma)^2} = \frac{1}{k^2} \quad \blacksquare
$$

#### Implications:
- For $k = 2$: At most $\frac{1}{4} = 25\%$ of observations can deviate by $2\sigma$ or more from the mean.
- For $k = 3$: At most $\frac{1}{9} \approx 11.1\%$ can deviate by $3\sigma$ or more.
- For $k = 10$: At most $\frac{1}{100} = 1\%$ can deviate by $10\sigma$ or more.

### 10.1.3 Cantelli’s Inequality (One-Sided Chebyshev)

Chebyshev's bound is inherently symmetric (two-sided). When we care only about one tail (e.g., $P(X - \mu \ge \epsilon)$), applying Chebyshev yields an upper bound of $\frac{\sigma^2}{2\epsilon^2}$ or $\frac{\sigma^2}{\epsilon^2}$. **Cantelli’s Inequality** establishes a strictly tighter bound for single tails.

#### Theorem: Cantelli’s Inequality
For any random variable $X$ with mean $\mu$ and variance $\sigma^2$, and any $\epsilon > 0$:
$$
P(X - \mu \ge \epsilon) \le \frac{\sigma^2}{\sigma^2 + \epsilon^2} = \frac{1}{1 + k^2} \quad (\text{where } \epsilon = k\sigma)
$$

---

## 10.2 The Chernoff Bound & Moment Generating Functions: Exponential Decay

While Chebyshev’s bound provides a power-law decay of $O(1/k^2)$, many random variables in computational science (especially sums of independent variables) exhibit **exponential tail decay**. The method of **Chernoff bounding** transforms the random variable into the exponential domain to extract this sharp decay.

### 10.2.1 The Chernoff Bounding Technique

Let $X$ be a random variable with Moment Generating Function $M_X(t) = \mathbb{E}[e^{tX}]$ defined in an open interval around $t = 0$. For any target threshold $a \in \mathbb{R}$ and any strictly positive parameter $t > 0$:
$$
X \ge a \iff tX \ge ta \iff e^{tX} \ge e^{ta}
$$
Because $e^{tX}$ is strictly non-negative, Markov's inequality applies:
$$
P(X \ge a) = P(e^{tX} \ge e^{ta}) \le \frac{\mathbb{E}[e^{tX}]}{e^{ta}} = e^{-ta} M_X(t)
$$
Because this inequality holds for **every** $t > 0$, we can optimize $t$ to find the tightest possible upper bound:
$$
P(X \ge a) \le \inf_{t > 0} e^{-ta} M_X(t) = \exp\left( -\sup_{t > 0} [ta - \ln M_X(t)] \right)
$$

The exponent $\sup_{t > 0} [ta - \ln M_X(t)]$ is the **Fenchel-Legendre transform** (or convex dual) of the cumulant generating function $\psi_X(t) = \ln M_X(t)$, denoted $I(a)$. In Cramér’s Large Deviation Theory, $I(a)$ is called the **rate function**.

```
                   The Chernoff Bound Optimization
         Bound g(t) = e^(-ta) M_X(t)
             ^
             | \                     /
             |  \                   /
             |   \                 /
             |    \               /
             |     \   t*        /
             |      \_  |  _____/
             |        \_v_/   <-- Optimal Tightest Bound: inf_{t > 0} g(t)
             +----------+---------------------> t
                        t*
```

---

## 10.3 Hoeffding’s Inequality and Sub-Gaussian Random Variables

When dealing with sums of bounded independent random variables (such as Bernoulli trials, bounded rewards in Reinforcement Learning, or bounded losses in PAC learning), **Hoeffding’s Inequality** provides an exceptionally powerful exponential concentration bound.

### 10.3.1 Hoeffding’s Lemma

#### Lemma: Hoeffding's Lemma
Let $X$ be a zero-mean random variable ($\mathbb{E}[X] = 0$) supported on the compact interval $[a, b]$ with $a < b$. Then for all $t \in \mathbb{R}$:
$$
\mathbb{E}[e^{tX}] \le \exp\left( \frac{t^2 (b - a)^2}{8} \right)
$$

*Proof Sketch:*  
By convexity of the exponential function $u \mapsto e^{tu}$, the curve $e^{tx}$ on $x \in [a, b]$ lies below the secant line connecting $(a, e^{ta})$ and $(b, e^{tb})$:
$$
e^{tx} \le \frac{b - x}{b - a} e^{ta} + \frac{x - a}{b - a} e^{tb}
$$
Taking expectations on both sides, using $\mathbb{E}[X] = 0$:
$$
\mathbb{E}[e^{tX}] \le \frac{b}{b - a} e^{ta} - \frac{a}{b - a} e^{tb} = (1 - p + p e^{t(b - a)}) e^{-pt(b - a)}
$$
where $p = -\frac{a}{b - a} \in [0, 1]$. Defining $u = t(b - a)$, let $\psi(u) = -pu + \ln(1 - p + pe^u)$. A Taylor expansion around $u = 0$ reveals that $\psi(0) = 0, \psi'(0) = 0$, and $\psi''(u) \le \frac{1}{4}$ for all $u$. Thus $\psi(u) \le \frac{u^2}{8} = \frac{t^2(b - a)^2}{8}$. Exponentiating yields the lemma. $\blacksquare$

### 10.3.2 Hoeffding’s Inequality for Sums

#### Theorem: Hoeffding’s Inequality
Let $X_1, X_2, \dots, X_n$ be independent random variables such that $X_i \in [a_i, b_i]$ almost surely. Let $S_n = \sum_{i=1}^n X_i$ and let $\bar{X}_n = \frac{1}{n} S_n$ denote the empirical sample mean. Then for any $\epsilon > 0$:
$$
P(S_n - \mathbb{E}[S_n] \ge t) \le \exp\left( -\frac{2t^2}{\sum_{i=1}^n (b_i - a_i)^2} \right)
$$
And for the empirical mean $\bar{X}_n$:
$$
P(\bar{X}_n - \mathbb{E}[\bar{X}_n] \ge \epsilon) \le \exp\left( -\frac{2n^2 \epsilon^2}{\sum_{i=1}^n (b_i - a_i)^2} \right)
$$
For the two-sided deviation:
$$
P(|\bar{X}_n - \mathbb{E}[\bar{X}_n]| \ge \epsilon) \le 2 \exp\left( -\frac{2n^2 \epsilon^2}{\sum_{i=1}^n (b_i - a_i)^2} \right)
$$

When all $X_i \in [0, 1]$ (e.g., Bernoulli trials), $b_i - a_i = 1$, so:
$$
P(|\bar{X}_n - \mathbb{E}[\bar{X}_n]| \ge \epsilon) \le 2 e^{-2n \epsilon^2}
$$

### 10.3.3 Sub-Gaussian Random Variables

Hoeffding's Lemma motivates a profound generalization in high-dimensional probability: **Sub-Gaussianity**.  
A random variable $X$ with mean $\mu$ is called **sub-Gaussian** with variance proxy $\sigma^2$ (denoted $X \in \mathcal{SG}(\sigma^2)$) if its centered MGF is dominated by a Gaussian MGF:
$$
\mathbb{E}[e^{t(X - \mu)}] \le \exp\left( \frac{1}{2} \sigma^2 t^2 \right) \quad \forall t \in \mathbb{R}
$$

Sub-Gaussian variables satisfy Gaussian-like tail decay:
$$
P(|X - \mu| \ge \epsilon) \le 2 \exp\left( -\frac{\epsilon^2}{2\sigma^2} \right)
$$
Every bounded random variable $X \in [a, b]$ is sub-Gaussian with proxy $\sigma^2 = \frac{(b - a)^2}{4}$.

---

## 10.4 The Laws of Large Numbers: WLLN vs. SLLN

The foundational premise of empirical science is that repeated independent observations converge to the true theoretical expectation. Probability theory distinguishes two distinct modes of asymptotic convergence.

### 10.4.1 The Weak Law of Large Numbers (Convergence in Probability)

Let $X_1, X_2, \dots$ be independent and identically distributed (i.i.d.) random variables with finite mean $\mu = \mathbb{E}[X_i]$ and finite variance $\sigma^2 < \infty$. The empirical average is $\bar{X}_n = \frac{1}{n} \sum_{i=1}^n X_i$.

#### Theorem: Weak Law of Large Numbers (WLLN / Khinchin's Law)
For any $\epsilon > 0$:
$$
\lim_{n \to \infty} P(|\bar{X}_n - \mu| \ge \epsilon) = 0
$$
That is, $\bar{X}_n \xrightarrow{P} \mu$ (convergence in probability).

*Proof via Chebyshev's Inequality:*  
By linearity of expectation: $\mathbb{E}[\bar{X}_n] = \frac{1}{n} \sum_{i=1}^n \mathbb{E}[X_i] = \mu$.  
Because the $X_i$ are independent: $\text{Var}(\bar{X}_n) = \frac{1}{n^2} \sum_{i=1}^n \text{Var}(X_i) = \frac{n\sigma^2}{n^2} = \frac{\sigma^2}{n}$.  
Applying Chebyshev's inequality to $\bar{X}_n$:
$$
P(|\bar{X}_n - \mu| \ge \epsilon) \le \frac{\text{Var}(\bar{X}_n)}{\epsilon^2} = \frac{\sigma^2}{n \epsilon^2}
$$
Taking the limit as $n \to \infty$:
$$
\lim_{n \to \infty} P(|\bar{X}_n - \mu| \ge \epsilon) \le \lim_{n \to \infty} \frac{\sigma^2}{n \epsilon^2} = 0 \quad \blacksquare
$$

*(Note: Khinchin proved that finite variance is not required; the WLLN holds whenever $\mathbb{E}[|X_i|] < \infty$).*

### 10.4.2 The Strong Law of Large Numbers (Almost Sure Convergence)

The Weak Law states that for any fixed, large $n$, the probability of a deviation is tiny. It does not preclude the possibility that an infinite sequence of sample averages might intermittently spike away from $\mu$ infinitely often. The **Strong Law of Large Numbers (SLLN)** guarantees that with probability 1, the entire trajectory converges to $\mu$.

#### Theorem: Strong Law of Large Numbers (Kolmogorov's SLLN)
Let $X_1, X_2, \dots$ be i.i.d. random variables. Then:
$$
P\left( \lim_{n \to \infty} \bar{X}_n = \mu \right) = 1
$$
if and only if $\mathbb{E}[|X_1|] < \infty$, in which case $\mu = \mathbb{E}[X_1]$.  
That is, $\bar{X}_n \xrightarrow{\text{a.s.}} \mu$ (almost sure convergence).

```
         Convergence Modes: Weak vs. Strong Law
      Trajectory X_bar_n(omega)
          ^
     mu+e |---------------------------------------------
          |     /\
       mu |----+--\----+--/\-----+---------------------> n
          |        \--/     \----/
     mu-e |---------------------------------------------
          Weak Law: P(|X_bar_n - mu| > e) -> 0 for large n.
          Strong Law: Trajectory stays inside tube for ALL n > N(omega) a.s.
```

---

## 10.5 The Central Limit Theorem (CLT) & The Berry-Esseen Bound

The Laws of Large Numbers tell us *where* the sample mean goes ($\bar{X}_n \to \mu$). The **Central Limit Theorem** tells us *how* it fluctuates around $\mu$, revealing that the standardized error distribution is universally Gaussian, regardless of the underlying parent distribution!

### 10.5.1 The Lindeberg-Lévy Central Limit Theorem

#### Theorem: Lindeberg-Lévy CLT
Let $X_1, X_2, \dots$ be i.i.d. random variables with mean $\mu$ and finite, non-zero variance $\sigma^2 \in (0, \infty)$. Define the standardized sum:
$$
Z_n = \frac{\sum_{i=1}^n X_i - n\mu}{\sigma \sqrt{n}} = \frac{\bar{X}_n - \mu}{\sigma / \sqrt{n}}
$$
Then as $n \to \infty$, $Z_n$ converges in distribution to a standard normal random variable:
$$
Z_n \xrightarrow{d} \mathcal{N}(0, 1)
$$
That is, for every $z \in \mathbb{R}$:
$$
\lim_{n \to \infty} P(Z_n \le z) = \Phi(z) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^z e^{-u^2 / 2} \, du
$$

### 10.5.2 Proof Sketch via Characteristic Functions

*Proof:*  
Assume without loss of generality that $\mu = 0$ and $\sigma = 1$ (standardized inputs).  
The characteristic function of $X_1$ is $\phi_X(t) = \mathbb{E}[e^{itX_1}]$. Since $\mathbb{E}[X_1] = 0$ and $\mathbb{E}[X_1^2] = 1$, Taylor expanding $\phi_X(t)$ around $t = 0$:
$$
\phi_X(t) = \mathbb{E}\left[ 1 + itX_1 - \frac{t^2 X_1^2}{2} + o(t^2) \right] = 1 + 0 - \frac{t^2}{2} + o(t^2) = 1 - \frac{t^2}{2} + o(t^2)
$$
Now consider the standardized sum $Z_n = \frac{1}{\sqrt{n}} \sum_{i=1}^n X_i$. By independence:
$$
\phi_{Z_n}(t) = \mathbb{E}\left[ \exp\left( it \frac{1}{\sqrt{n}} \sum_{j=1}^n X_j \right) \right] = \prod_{j=1}^n \phi_X\left(\frac{t}{\sqrt{n}}\right) = \left[ \phi_X\left(\frac{t}{\sqrt{n}}\right) \right]^n
$$
Substituting the Taylor expansion:
$$
\phi_{Z_n}(t) = \left[ 1 - \frac{t^2}{2n} + o\left(\frac{t^2}{n}\right) \right]^n
$$
Taking the limit as $n \to \infty$, recall the fundamental calculus identity $\lim_{n \to \infty} (1 + \frac{a}{n})^n = e^a$. Setting $a = -t^2 / 2$:
$$
\lim_{n \to \infty} \phi_{Z_n}(t) = \exp\left(-\frac{t^2}{2}\right)
$$
The limit $\exp(-t^2 / 2)$ is the characteristic function of the standard normal distribution $\mathcal{N}(0, 1)$!  
By **Lévy’s Continuity Theorem**, convergence of characteristic functions pointwise implies convergence in distribution:
$$
Z_n \xrightarrow{d} \mathcal{N}(0, 1) \quad \blacksquare
$$

### 10.5.3 Non-Asymptotic Convergence: The Berry-Esseen Theorem

The classical CLT is an asymptotic theorem ($n \to \infty$). In engineering and computer science, we must know: *How accurate is the Gaussian approximation for a finite $n$?*

The **Berry-Esseen Theorem** provides a rigorous, non-asymptotic bound on the maximum error between the empirical CDF $F_n(z) = P(Z_n \le z)$ and the Gaussian CDF $\Phi(z)$.

#### Theorem: Berry-Esseen Theorem
Let $X_1, X_2, \dots, X_n$ be i.i.d. random variables with mean $\mu$, variance $\sigma^2 > 0$, and finite third absolute moment $\rho = \mathbb{E}[|X_1 - \mu|^3] < \infty$. Then:
$$
\sup_{z \in \mathbb{R}} |P(Z_n \le z) - \Phi(z)| \le \frac{C \cdot \rho}{\sigma^3 \sqrt{n}}
$$
where $C$ is a universal numerical constant. The current best proved bound (Shevtsova, 2011) establishes:
$$
C \le 0.4748
$$

> [!TIP]
> **Key Takeaway:** The convergence to normality proceeds at a universal rate of $O(1/\sqrt{n})$. The constant is governed entirely by the **skewness** $\frac{\rho}{\sigma^3}$. Highly skewed distributions (such as exponential or heavy-tailed log-normal) require significantly larger $n$ before the Gaussian approximation is valid.

---

## 10.6 Exactly 10 Worked Examples

### Worked Example 10.1: Markov’s Inequality on Server Latency
**Problem Statement:**  
A cloud microservice experiences response latency $T$ (in milliseconds) with mean $\mathbb{E}[T] = 40$ ms.  
1. Use Markov’s inequality to upper bound the probability that a request takes at least $200$ ms.
2. If $T \sim \text{Exp}(1/40)$ is exponentially distributed, compute the exact probability $P(T \ge 200)$ and compare it to Markov's bound.

**Detailed Solution:**  
1. **Markov's Bound:**
   Latency is non-negative ($T \ge 0$). Applying Markov’s inequality with $a = 200$:
   $$
   P(T \ge 200) \le \frac{\mathbb{E}[T]}{200} = \frac{40}{200} = 0.20 \; (20\%)
   $$

2. **Exact Exponential Tail:**
   For $T \sim \text{Exp}(\lambda)$ with $\lambda = 1/40$:
   $$
   P(T \ge 200) = e^{-\lambda(200)} = e^{-200 / 40} = e^{-5} \approx 0.006738 \; (0.67\%)
   $$
   Markov’s bound guarantees $P \le 20\%$, whereas the true probability is under $0.7\%$. Markov’s inequality is universally safe but inherently conservative because it assumes worst-case tail mass placement.

---

### Worked Example 10.2: Chebyshev’s Inequality vs. Exact Uniform Tail
**Problem Statement:**  
Let $X \sim \mathcal{U}(-A, A)$ be a continuous uniform random variable.  
1. Compute the mean $\mu$ and standard deviation $\sigma$.
2. For $k = \sqrt{2}$, evaluate the Chebyshev bound for $P(|X - \mu| \ge k\sigma)$.
3. Compute the exact probability $P(|X - \mu| \ge k\sigma)$.

**Detailed Solution:**  
1. **Parameters:**
   $$
   \mu = \mathbb{E}[X] = 0
   $$
   $$
   \sigma^2 = \text{Var}(X) = \frac{(A - (-A))^2}{12} = \frac{4A^2}{12} = \frac{A^2}{3} \implies \sigma = \frac{A}{\sqrt{3}}
   $$

2. **Chebyshev Bound:**
   For $k = \sqrt{2}$:
   $$
   P(|X| \ge \sqrt{2}\sigma) \le \frac{1}{k^2} = \frac{1}{(\sqrt{2})^2} = \frac{1}{2} = 0.50 \; (50\%)
   $$

3. **Exact Probability:**
   The threshold is $k\sigma = \sqrt{2} \left(\frac{A}{\sqrt{3}}\right) = A \sqrt{\frac{2}{3}} \approx 0.8165 A$.  
   Since $X \sim \mathcal{U}(-A, A)$, its PDF is $f(x) = \frac{1}{2A}$ on $[-A, A]$.
   $$
   P(|X| \ge 0.8165 A) = 2 \int_{0.8165 A}^A \frac{1}{2A} \, dx = 2 \left( \frac{A - 0.8165 A}{2A} \right) = 1 - \sqrt{\frac{2}{3}} \approx 1 - 0.8165 = 0.1835 \; (18.35\%)
   $$
   The Chebyshev bound is $50\%$, while the true tail probability is $18.35\%$.

---

### Worked Example 10.3: Cantelli’s One-Sided Inequality Comparison
**Problem Statement:**  
A hedge fund portfolio has expected daily return $\mu = 0\%$ and daily volatility $\sigma = 2\%$. The fund triggers a margin liquidation if the return drops below $-4\%$ ($X \le -4\%$, an adverse deviation of $2\sigma$).  
1. Upper-bound the probability of liquidation using two-sided Chebyshev.
2. Upper-bound the probability using Cantelli’s one-sided inequality.

**Detailed Solution:**  
1. **Chebyshev Two-Sided Bound:**
   Liquidation occurs if $X - \mu \le -4\% \implies |X - \mu| \ge 4\% = 2\sigma$.  
   Chebyshev gives:
   $$
   P(|X - \mu| \ge 2\sigma) \le \frac{1}{2^2} = 0.25
   $$
   Bounding the single lower tail by the two-sided probability:
   $$
   P(X - \mu \le -4\%) \le P(|X - \mu| \ge 4\%) \le 0.25 \; (25\%)
   $$

2. **Cantelli’s One-Sided Bound:**
   Let $Y = -(X - \mu)$, so $\mathbb{E}[Y] = 0$ and $\text{Var}(Y) = \sigma^2 = 2^2 = 4$.  
   The liquidation event is $Y \ge 4\% = 2\sigma$, so $k = 2$.  
   Applying Cantelli’s inequality:
   $$
   P(Y \ge 2\sigma) \le \frac{1}{1 + k^2} = \frac{1}{1 + 2^2} = \frac{1}{1 + 4} = \frac{1}{5} = 0.20 \; (20\%)
   $$
   Cantelli reduces the bound from $25\%$ to $20\%$, yielding an immediate $20\%$ relative tightening of the tail risk bound.

---

### Worked Example 10.4: Optimal Chernoff Bound for Poisson Tail
**Problem Statement:**  
Let $X \sim \text{Pois}(\lambda)$ with $\lambda = 10$. We wish to bound the probability of an extreme surge $P(X \ge 30)$.  
1. Derive the generic Chernoff bound for $P(X \ge a)$ as a function of $t$.
2. Find the optimal parameter $t^*$ that minimizes the bound.
3. Compute the numerical bound for $\lambda = 10, a = 30$, and compare with Chebyshev's inequality.

**Detailed Solution:**  
1. **Chernoff Bound Formulation:**
   The MGF of a Poisson random variable is $M_X(t) = \exp(\lambda(e^t - 1))$.  
   Applying Chernoff's method:
   $$
   P(X \ge a) \le e^{-ta} M_X(t) = \exp\left( -ta + \lambda(e^t - 1) \right)
   $$

2. **Optimizing $t$:**
   Let $g(t) = -ta + \lambda(e^t - 1)$. Differentiating with respect to $t$ and setting to zero:
   $$
   g'(t) = -a + \lambda e^t = 0 \implies e^t = \frac{a}{\lambda} \implies t^* = \ln\left(\frac{a}{\lambda}\right)
   $$
   Since $a > \lambda$ ($30 > 10$), $t^* = \ln(3) > 0$.  
   Substituting $t^*$ back into $g(t)$:
   $$
   g(t^*) = -a \ln\left(\frac{a}{\lambda}\right) + \lambda\left(\frac{a}{\lambda} - 1\right) = -a \ln\left(\frac{a}{\lambda}\right) + (a - \lambda)
   $$
   Thus, the optimal Chernoff bound is:
   $$
   P(X \ge a) \le \exp\left( -(a \ln(a/\lambda) - a + \lambda) \right) = \left( \frac{e \lambda}{a} \right)^a e^{-\lambda}
   $$

3. **Numerical Evaluation ($\lambda = 10, a = 30$):**
   $$
   g(t^*) = -30 \ln(3) + (30 - 10) = -30(1.09861) + 20 = -32.958 + 20 = -12.958
   $$
   $$
   P(X \ge 30) \le e^{-12.958} \approx 2.36 \times 10^{-6}
   $$
   **Comparison with Chebyshev:**
   For $X \sim \text{Pois}(10)$, $\mu = 10, \sigma = \sqrt{10} \approx 3.162$.  
   Deviation: $a - \mu = 30 - 10 = 20 = k \sigma \implies k = \frac{20}{\sqrt{10}} = \sqrt{40} \approx 6.325$.  
   Chebyshev gives:
   $$
   P(X \ge 30) \le \frac{1}{k^2} = \frac{1}{40} = 0.025 \; (2.5 \times 10^{-2})
   $$
   The Chernoff bound ($2.36 \times 10^{-6}$) is **over 10,000 times tighter** than Chebyshev!

---

### Worked Example 10.5: Hoeffding PAC Sample Complexity for Biased Coin
**Problem Statement:**  
An AI alignment researcher wishes to estimate the unknown probability $p = P(\text{Helpful})$ of an LLM response. The researcher samples $n$ independent generations and computes the empirical average $\hat{p} = \frac{1}{n} \sum_{i=1}^n X_i$, where $X_i \in \{0, 1\}$.  
Using Hoeffding’s inequality, determine the minimum sample size $n$ required to guarantee that:
$$
P(|\hat{p} - p| \ge 0.01) \le 0.01
$$
(i.e., accuracy within $\pm 0.01$ with $99\%$ confidence).

**Detailed Solution:**  
1. **Hoeffding Two-Sided Formula:**
   Since each $X_i \in [0, 1]$, $b_i - a_i = 1$:
   $$
   P(|\hat{p} - p| \ge \epsilon) \le 2 \exp(-2n \epsilon^2)
   $$

2. **Setting the Confidence Threshold:**
   We require $2 \exp(-2n \epsilon^2) \le \delta$, where $\epsilon = 0.01$ and $\delta = 0.01$:
   $$
   \exp(-2n \epsilon^2) \le \frac{\delta}{2}
   $$
   Taking natural logs:
   $$
   -2n \epsilon^2 \le \ln\left(\frac{\delta}{2}\right) \implies 2n \epsilon^2 \ge \ln\left(\frac{2}{\delta}\right) \implies n \ge \frac{\ln(2/\delta)}{2\epsilon^2}
   $$

3. **Plugging in Numerical Values:**
   $$
   \frac{2}{\delta} = \frac{2}{0.01} = 200
   $$
   $$
   \ln(200) \approx 5.2983
   $$
   $$
   2\epsilon^2 = 2(0.01)^2 = 2(0.0001) = 0.0002
   $$
   $$
   n \ge \frac{5.2983}{0.0002} = \frac{5.2983 \times 10000}{2} = 5.2983 \times 5000 = 26,491.5
   $$
   Rounding up: $n = 26,492$ samples guarantee the PAC condition.

---

### Worked Example 10.6: Weak Law of Large Numbers with Growing Variances
**Problem Statement:**  
Let $X_1, X_2, \dots$ be independent zero-mean random variables ($\mathbb{E}[X_i] = 0$) whose variances grow with index $i$: $\text{Var}(X_i) = i^\alpha$.  
Find the range of $\alpha \in \mathbb{R}$ for which the empirical mean $\bar{X}_n = \frac{1}{n} \sum_{i=1}^n X_i$ obeys the Weak Law of Large Numbers ($\bar{X}_n \xrightarrow{P} 0$).

**Detailed Solution:**  
1. **Variance of $\bar{X}_n$:**
   Because the $X_i$ are independent:
   $$
   \text{Var}(\bar{X}_n) = \frac{1}{n^2} \sum_{i=1}^n \text{Var}(X_i) = \frac{1}{n^2} \sum_{i=1}^n i^\alpha
   $$

2. **Asymptotic Growth of the Sum:**
   By the Euler-Maclaurin summation formula / integral test:
   $$
   \sum_{i=1}^n i^\alpha \sim \int_0^n x^\alpha \, dx = \frac{n^{\alpha + 1}}{\alpha + 1} \quad \text{for } \alpha > -1
   $$
   Thus, for $\alpha > -1$:
   $$
   \text{Var}(\bar{X}_n) \sim \frac{1}{n^2} \frac{n^{\alpha + 1}}{\alpha + 1} = \frac{n^{\alpha - 1}}{\alpha + 1}
   $$

3. **Chebyshev Convergence Criterion:**
   Applying Chebyshev's inequality:
   $$
   P(|\bar{X}_n| \ge \epsilon) \le \frac{\text{Var}(\bar{X}_n)}{\epsilon^2} \sim \frac{n^{\alpha - 1}}{(\alpha + 1)\epsilon^2}
   $$
   For the limit to vanish ($P(|\bar{X}_n| \ge \epsilon) \to 0$ as $n \to \infty$), the exponent of $n$ must be strictly negative:
   $$
   \alpha - 1 < 0 \implies \alpha < 1
   $$
   For $\alpha \le -1$: $\sum_{i=1}^n i^\alpha$ grows at most logarithmically ($\ln n$) or converges to a constant, so $\text{Var}(\bar{X}_n) = O(\frac{\ln n}{n^2}) \to 0$.  
   Therefore, the WLLN holds if and only if $\alpha < 1$.

---

### Worked Example 10.7: Central Limit Theorem for Uniform Sums (Bates Distribution)
**Problem Statement:**  
Let $X_1, X_2, \dots, X_{12} \sim \text{i.i.d. } \mathcal{U}(0, 1)$ be 12 independent uniform random variables.  
(Note: Historically, $n = 12$ uniforms was the standard method for generating Gaussian variates on early computers).  
Let $S_{12} = \sum_{i=1}^{12} X_i$.  
1. Compute $\mathbb{E}[S_{12}]$ and $\text{Var}(S_{12})$.
2. Use the Central Limit Theorem to approximate $P(5 \le S_{12} \le 7)$.

**Detailed Solution:**  
1. **Moments:**
   For $X_i \sim \mathcal{U}(0, 1)$, $\mathbb{E}[X_i] = \frac{1}{2}$, $\text{Var}(X_i) = \frac{1}{12}$.
   $$
   \mathbb{E}[S_{12}] = 12 \times \frac{1}{2} = 6
   $$
   $$
   \text{Var}(S_{12}) = 12 \times \frac{1}{12} = 1 \implies \sigma_{S_{12}} = 1
   $$
   Notice that $S_{12} - 6$ has mean 0 and standard deviation **exactly 1**!

2. **CLT Approximation:**
   By the CLT, $S_{12} \approx \mathcal{N}(6, 1)$.  
   $$
   P(5 \le S_{12} \le 7) = P\left( \frac{5 - 6}{1} \le \frac{S_{12} - 6}{1} \le \frac{7 - 6}{1} \right) = P(-1 \le Z \le 1)
   $$
   $$
   P(-1 \le Z \le 1) = \Phi(1) - \Phi(-1) = 2\Phi(1) - 1 \approx 2(0.84134) - 1 = 0.68268 \; (68.27\%)
   $$

---

### Worked Example 10.8: Non-Asymptotic Berry-Esseen Error Assessment
**Problem Statement:**  
We toss a fair coin $n = 100$ times. Let $X_i \in \{0, 1\}$ with $P(X_i = 1) = 0.5$, and let $Z_{100} = \frac{\sum X_i - 50}{\sqrt{25}} = \frac{\sum X_i - 50}{5}$.  
1. Compute the third central moment $\rho = \mathbb{E}[|X_i - \mu|^3]$.
2. Compute the Berry-Esseen upper bound on the maximum approximation error $\sup_z |F_{100}(z) - \Phi(z)|$ using $C = 0.4748$.

**Detailed Solution:**  
1. **Third Absolute Moment:**
   $\mu = 0.5, \sigma = 0.5 \implies \sigma^3 = 0.125$.  
   $X_i - \mu = \pm 0.5$ with probability $0.5$ each.  
   $$
   |X_i - \mu|^3 = |0.5|^3 = 0.125
   $$
   $$
   \rho = \mathbb{E}[|X_i - \mu|^3] = 0.125
   $$

2. **Berry-Esseen Bound:**
   $$
   \text{Error} \le \frac{C \rho}{\sigma^3 \sqrt{n}} = \frac{0.4748 \times 0.125}{0.125 \times \sqrt{100}} = \frac{0.4748}{10} = 0.04748 \approx 4.75\%
   $$
   The true CDF of the standardized binomial sum matches the normal CDF to within an absolute error of at most $0.0475$ everywhere on the real line.

---

### Worked Example 10.9: Monte Carlo Confidence Interval Sizing via CLT
**Problem Statement:**  
A physicist approximates the high-dimensional integral $\theta = \int_{\Omega} h(\mathbf{x}) d\mathbf{x}$ using Monte Carlo integration: $\hat{\theta}_N = \frac{1}{N} \sum_{i=1}^N h(\mathbf{X}_i)$.  
Pilot sampling shows that the sample variance of the integrand is $s^2 = 9.0$.  
How many Monte Carlo samples $N$ are needed to guarantee that the $95\%$ confidence interval has half-width at most $0.05$?

**Detailed Solution:**  
1. **Confidence Interval Half-Width:**
   By the CLT, the asymptotic distribution of the error is:
   $$
   \hat{\theta}_N - \theta \approx \mathcal{N}\left(0, \frac{\sigma^2}{N}\right)
   $$
   The $95\%$ confidence interval half-width is:
   $$
   \Delta = z_{0.025} \frac{\sigma}{\sqrt{N}} = 1.96 \frac{\sigma}{\sqrt{N}}
   $$

2. **Solving for $N$:**
   We require $\Delta \le 0.05$:
   $$
   1.96 \frac{\sqrt{9.0}}{\sqrt{N}} \le 0.05 \implies 1.96 \times \frac{3}{\sqrt{N}} \le 0.05
   $$
   $$
   \frac{5.88}{\sqrt{N}} \le 0.05 \implies \sqrt{N} \ge \frac{5.88}{0.05} = 117.6
   $$
   Squaring both sides:
   $$
   N \ge (117.6)^2 = 13,829.76
   $$
   At least $N = 13,830$ Monte Carlo evaluations are required.

---

### Worked Example 10.10: Sub-Gaussianity of Bounded Variables
**Problem Statement:**  
Let $X$ be a zero-mean random variable with support $[-M, M]$.  
Prove that $X$ is sub-Gaussian with proxy $\sigma^2 = M^2$, and state the resulting two-sided tail bound for the empirical mean of $n$ independent copies.

**Detailed Solution:**  
1. **Applying Hoeffding's Lemma:**
   Here $a = -M$ and $b = M$, so $b - a = 2M$.  
   Hoeffding's Lemma guarantees:
   $$
   \mathbb{E}[e^{tX}] \le \exp\left( \frac{t^2 (b - a)^2}{8} \right) = \exp\left( \frac{t^2 (2M)^2}{8} \right) = \exp\left( \frac{4M^2 t^2}{8} \right) = \exp\left( \frac{1}{2} M^2 t^2 \right)
   $$
   This matches the sub-Gaussian definition $\mathbb{E}[e^{tX}] \le \exp(\frac{1}{2}\sigma^2 t^2)$ with parameter $\sigma^2 = M^2$.

2. **Tail Bound for Empirical Mean:**
   For $\bar{X}_n = \frac{1}{n} \sum_{i=1}^n X_i$, the sum $\sum X_i$ is sub-Gaussian with proxy $n M^2$, so $\bar{X}_n$ is sub-Gaussian with proxy $\frac{n M^2}{n^2} = \frac{M^2}{n}$.  
   The resulting two-sided tail bound is:
   $$
   P(|\bar{X}_n| \ge \epsilon) \le 2 \exp\left( -\frac{n \epsilon^2}{2M^2} \right)
   $$

---

## 10.7 Exactly 10 Solved Exercises

### Exercise 10.1: Sharpness of Markov’s Inequality
**Problem Statement:**  
Prove that Markov’s inequality is sharp by constructing a valid random variable $X \ge 0$ such that $P(X \ge a) = \frac{\mathbb{E}[X]}{a}$ for a given $a > 0$.

**Detailed Solution:**  
1. **Construction:**
   Let $X$ be a discrete two-point random variable taking values in $\{0, a\}$:
   $$
   P(X = a) = p, \quad P(X = 0) = 1 - p \quad \text{where } p \in (0, 1]
   $$

2. **Expectation:**
   $$
   \mathbb{E}[X] = a \cdot p + 0 \cdot (1 - p) = a p
   $$

3. **Evaluating Markov's Bound:**
   $$
   \frac{\mathbb{E}[X]}{a} = \frac{ap}{a} = p
   $$
   The exact tail probability is:
   $$
   P(X \ge a) = P(X = a) = p
   $$
   Because $P(X \ge a) = \frac{\mathbb{E}[X]}{a} = p$, equality holds. Thus, Markov’s inequality cannot be improved without additional structural assumptions.

---

### Exercise 10.2: Sharpness of Chebyshev’s Inequality
**Problem Statement:**  
Construct a symmetric random variable $X$ that achieves exact equality in Chebyshev’s inequality $P(|X - \mu| \ge k\sigma) = \frac{1}{k^2}$ for any $k \ge 1$.

**Detailed Solution:**  
1. **Construction:**
   Let $X$ take three values $\{-k, 0, k\}$ with probabilities:
   $$
   P(X = -k) = \frac{1}{2k^2}, \quad P(X = k) = \frac{1}{2k^2}, \quad P(X = 0) = 1 - \frac{1}{k^2}
   $$
   Since $k \ge 1$, $1 - \frac{1}{k^2} \ge 0$, so this is a valid PMF.

2. **Mean and Variance:**
   By symmetry:
   $$
   \mu = \mathbb{E}[X] = (-k)\left(\frac{1}{2k^2}\right) + (0)\left(1 - \frac{1}{k^2}\right) + (k)\left(\frac{1}{2k^2}\right) = 0
   $$
   $$
   \sigma^2 = \text{Var}(X) = \mathbb{E}[X^2] = (-k)^2 \left(\frac{1}{2k^2}\right) + 0 + (k)^2 \left(\frac{1}{2k^2}\right) = \frac{k^2}{2k^2} + \frac{k^2}{2k^2} = \frac{1}{2} + \frac{1}{2} = 1 \implies \sigma = 1
   $$

3. **Evaluating the Tail:**
   With $\mu = 0$ and $\sigma = 1$, the deviation event $|X - \mu| \ge k\sigma$ is $|X| \ge k$:
   $$
   P(|X| \ge k) = P(X = -k) + P(X = k) = \frac{1}{2k^2} + \frac{1}{2k^2} = \frac{1}{k^2}
   $$
   Chebyshev’s bound gives $\frac{1}{k^2}$. Equality holds exactly, proving Chebyshev's inequality is tight.

---

### Exercise 10.3: Standard Normal Chernoff Bound Derivation
**Problem Statement:**  
Let $Z \sim \mathcal{N}(0, 1)$ be standard normal. Using the Chernoff bound, prove that:
$$
P(Z \ge a) \le e^{-a^2 / 2} \quad \forall a > 0
$$

**Detailed Solution:**  
1. **Chernoff Bound Setup:**
   The MGF of $Z \sim \mathcal{N}(0, 1)$ is $M_Z(t) = e^{t^2 / 2}$.  
   Applying Chernoff's method for $t > 0$:
   $$
   P(Z \ge a) \le e^{-ta} M_Z(t) = \exp\left( -ta + \frac{t^2}{2} \right)
   $$

2. **Minimizing over $t > 0$:**
   Let $g(t) = \frac{t^2}{2} - ta$. Differentiating:
   $$
   g'(t) = t - a = 0 \implies t^* = a
   $$
   Since $a > 0$, $t^* > 0$.  
   Evaluating $g(t^*)$:
   $$
   g(a) = \frac{a^2}{2} - a(a) = -\frac{a^2}{2}
   $$
   Thus:
   $$
   P(Z \ge a) \le e^{-a^2 / 2} \quad \blacksquare
   $$

---

### Exercise 10.4: Hoeffding vs. Chebyshev Sample Complexity Comparison
**Problem Statement:**  
We wish to estimate the mean of i.i.d. random variables $X_i \in [0, 1]$ with variance $\sigma^2 \le 1/4$ such that $P(|\bar{X}_n - \mu| \ge \epsilon) \le \delta$.  
Compare the asymptotic scaling of $n$ required by Chebyshev’s inequality vs. Hoeffding’s inequality as $\delta \to 0$.

**Detailed Solution:**  
1. **Chebyshev Sample Complexity:**
   Chebyshev gives $P(|\bar{X}_n - \mu| \ge \epsilon) \le \frac{\sigma^2}{n \epsilon^2} \le \frac{1}{4n \epsilon^2}$.  
   Setting $\frac{1}{4n \epsilon^2} \le \delta$:
   $$
   n_{\text{Chebyshev}} \ge \frac{1}{4 \epsilon^2 \delta} = O\left(\frac{1}{\epsilon^2 \delta}\right)
   $$

2. **Hoeffding Sample Complexity:**
   Hoeffding gives $P(|\bar{X}_n - \mu| \ge \epsilon) \le 2 e^{-2n \epsilon^2}$.  
   Setting $2 e^{-2n \epsilon^2} \le \delta$:
   $$
   n_{\text{Hoeffding}} \ge \frac{\ln(2/\delta)}{2 \epsilon^2} = O\left(\frac{\ln(1/\delta)}{\epsilon^2}\right)
   $$

3. **Asymptotic Comparison:**
   As confidence increases ($\delta \to 0$), $n_{\text{Chebyshev}}$ scales as **$1/\delta$** (polynomial blowup), whereas $n_{\text{Hoeffding}}$ scales as **$\ln(1/\delta)$** (exponentially milder logarithmic growth). For $\delta = 10^{-6}$, $\frac{1}{\delta} = 10^6$ while $\ln(1/\delta) \approx 13.8$, representing a five-order-of-magnitude reduction in sample size!

---

### Exercise 10.5: Failure of the CLT for the Cauchy Distribution
**Problem Statement:**  
Let $X_1, X_2, \dots, X_n$ be i.i.d. standard Cauchy random variables with PDF $f(x) = \frac{1}{\pi(1 + x^2)}$ and characteristic function $\phi_X(t) = e^{-|t|}$.  
1. Find the characteristic function of the sample mean $\bar{X}_n = \frac{1}{n} \sum_{i=1}^n X_i$.
2. State the distribution of $\bar{X}_n$.
3. Explain why the Law of Large Numbers and the Central Limit Theorem fail completely.

**Detailed Solution:**  
1. **Characteristic Function of $\bar{X}_n$:**
   $$
   \phi_{\bar{X}_n}(t) = \mathbb{E}\left[ \exp\left( it \frac{1}{n} \sum_{j=1}^n X_j \right) \right] = \left[ \phi_X\left(\frac{t}{n}\right) \right]^n = \left[ e^{-|t/n|} \right]^n = e^{-n |t/n|} = e^{-|t|}
   $$

2. **Distribution of $\bar{X}_n$:**
   The characteristic function $\phi_{\bar{X}_n}(t) = e^{-|t|}$ is **identical** to that of a single standard Cauchy variable!  
   Therefore:
   $$
   \bar{X}_n \sim \text{Cauchy}(0, 1) \quad \forall n \ge 1
   $$
   Averaging $1,000,000$ Cauchy random variables produces no reduction in noise whatsoever!

3. **Failure of LLN and CLT:**
   The Cauchy PDF decays as $1/x^2$. The first moment integral $\int_{-\infty}^\infty \frac{|x|}{\pi(1+x^2)} dx = \infty$ diverges. Because $\mathbb{E}[|X|] = \infty$, the conditions of both Khinchin’s WLLN and the Lindeberg-Lévy CLT are violated.

---

### Exercise 10.6: Proof of Hoeffding’s Lemma for Zero-Mean Bounded Variables
**Problem Statement:**  
Let $X$ be a random variable with $\mathbb{E}[X] = 0$ and $a \le X \le b$. Prove that $\mathbb{E}[e^{tX}] \le \exp\left(\frac{t^2(b-a)^2}{8}\right)$.

**Detailed Solution:**  
1. **Convexity Upper Bound:**
   By convexity of $x \mapsto e^{tx}$, for any $x \in [a, b]$:
   $$
   e^{tx} \le \frac{b - x}{b - a} e^{ta} + \frac{x - a}{b - a} e^{tb}
   $$
   Taking expectations using $\mathbb{E}[X] = 0$:
   $$
   \mathbb{E}[e^{tX}] \le \frac{b}{b - a} e^{ta} - \frac{a}{b - a} e^{tb}
   $$

2. **Reparameterization:**
   Let $p = -\frac{a}{b - a}$. Notice $1 - p = \frac{b}{b - a}$. Since $a \le 0 \le b$, $p \in [0, 1]$.  
   Let $u = t(b - a)$. Then $ta = -pu$ and $tb = (1 - p)u$:
   $$
   \mathbb{E}[e^{tX}] \le (1 - p) e^{-pu} + p e^{(1 - p)u} = e^{-pu} (1 - p + p e^u)
   $$

3. **Bounding the Logarithm:**
   Define $\psi(u) = -pu + \ln(1 - p + pe^u)$. Differentiating:
   $$
   \psi'(u) = -p + \frac{pe^u}{1 - p + pe^u} \implies \psi'(0) = -p + p = 0
   $$
   $$
   \psi''(u) = \frac{pe^u(1 - p + pe^u) - (pe^u)^2}{(1 - p + pe^u)^2} = \frac{p(1 - p)e^u}{(1 - p + pe^u)^2}
   $$
   Let $\rho = \frac{pe^u}{1 - p + pe^u} \in (0, 1)$. Then $\psi''(u) = \rho(1 - \rho) \le \frac{1}{4}$ (since the maximum of $\rho(1 - \rho)$ on $[0, 1]$ is at $\rho = 1/2$, yielding $1/4$).

4. **Taylor Expansion:**
   By Taylor's theorem with remainder:
   $$
   \psi(u) = \psi(0) + \psi'(0)u + \frac{1}{2}\psi''(\xi)u^2 = 0 + 0 + \frac{1}{2}\left(\le \frac{1}{4}\right)u^2 \le \frac{u^2}{8}
   $$
   Substituting $u = t(b - a)$:
   $$
   \psi(u) \le \frac{t^2(b - a)^2}{8} \implies \mathbb{E}[e^{tX}] \le e^{\psi(u)} \le \exp\left( \frac{t^2(b - a)^2}{8} \right) \quad \blacksquare
   $$

---

### Exercise 10.7: Bernstein’s Inequality for Bounded Variables
**Problem Statement:**  
Let $X_1, \dots, X_n$ be independent zero-mean variables bounded by $|X_i| \le M$ with total variance $\sigma^2 = \sum \text{Var}(X_i)$. Bernstein’s inequality states:
$$
P(S_n \ge t) \le \exp\left( -\frac{t^2 / 2}{\sigma^2 + M t / 3} \right)
$$
Compare this bound with Hoeffding’s inequality when $\sigma^2 \ll n M^2$ (low variance regime).

**Detailed Solution:**  
1. **Hoeffding’s Bound:**
   Since each $X_i \in [-M, M]$, $b_i - a_i = 2M$:
   $$
   P(S_n \ge t) \le \exp\left( -\frac{2t^2}{n(2M)^2} \right) = \exp\left( -\frac{t^2}{2n M^2} \right)
   $$

2. **Bernstein’s Bound for Moderate $t$:**
   When $t \le 3\sigma^2 / M$, the variance term $\sigma^2$ dominates the denominator:
   $$
   P(S_n \ge t) \le \exp\left( -\frac{t^2}{2\sigma^2 + 2Mt/3} \right) \approx \exp\left( -\frac{t^2}{2\sigma^2} \right)
   $$

3. **Comparison:**
   In the sparse regime where $X_i = 1$ with probability $p = 10^{-4}$ and $0$ otherwise, $\sigma^2 \approx n p M^2 = 10^{-4} n M^2$.  
   Hoeffding's exponent has denominator $2n M^2$, whereas Bernstein's denominator is governed by $2\sigma^2 = 2 \times 10^{-4} n M^2$. Bernstein's bound is approximately **10,000 times sharper** in the exponent because it adapts to low intrinsic variance.

---

### Exercise 10.8: Taylor Expansion of the Characteristic Function in CLT Proof
**Problem Statement:**  
Let $X$ have mean $\mu = 0$, variance $\sigma^2 = 1$, and characteristic function $\phi(t)$.  
Prove that $\lim_{n \to \infty} n \ln \phi(t / \sqrt{n}) = -\frac{1}{2}t^2$.

**Detailed Solution:**  
1. **Expansion of $\phi(u)$:**
   Since $\mathbb{E}[X] = 0$ and $\mathbb{E}[X^2] = 1$:
   $$
   \phi(u) = 1 - \frac{1}{2}u^2 + o(u^2) \quad \text{as } u \to 0
   $$

2. **Evaluating at $u = t / \sqrt{n}$:**
   $$
   \phi\left(\frac{t}{\sqrt{n}}\right) = 1 - \frac{t^2}{2n} + o\left(\frac{1}{n}\right)
   $$

3. **Logarithmic Expansion:**
   Using $\ln(1 + z) = z + O(z^2)$ as $z \to 0$:
   $$
   \ln \phi\left(\frac{t}{\sqrt{n}}\right) = \ln\left( 1 - \frac{t^2}{2n} + o\left(\frac{1}{n}\right) \right) = -\frac{t^2}{2n} + o\left(\frac{1}{n}\right)
   $$

4. **Multiplying by $n$ and Taking the Limit:**
   $$
   n \ln \phi\left(\frac{t}{\sqrt{n}}\right) = n \left[ -\frac{t^2}{2n} + o\left(\frac{1}{n}\right) \right] = -\frac{t^2}{2} + o(1)
   $$
   Taking $n \to \infty$:
   $$
   \lim_{n \to \infty} n \ln \phi\left(\frac{t}{\sqrt{n}}\right) = -\frac{t^2}{2} \quad \blacksquare
   $$

---

### Exercise 10.9: SLLN vs. WLLN Separation (Borel-Cantelli Counterexample)
**Problem Statement:**  
Construct a sequence of independent random variables $Y_n$ that converges to $0$ in probability ($Y_n \xrightarrow{P} 0$, obeying WLLN), but does NOT converge to $0$ almost surely ($Y_n \not\xrightarrow{\text{a.s.}} 0$, failing SLLN).

**Detailed Solution:**  
1. **Construction:**
   Let $Y_n$ be independent binary random variables defined by:
   $$
   P(Y_n = 1) = \frac{1}{n}, \quad P(Y_n = 0) = 1 - \frac{1}{n}
   $$

2. **Convergence in Probability (WLLN):**
   For any $\epsilon \in (0, 1)$:
   $$
   P(|Y_n - 0| \ge \epsilon) = P(Y_n = 1) = \frac{1}{n}
   $$
   Taking the limit as $n \to \infty$:
   $$
   \lim_{n \to \infty} P(|Y_n| \ge \epsilon) = \lim_{n \to \infty} \frac{1}{n} = 0
   $$
   Therefore, $Y_n \xrightarrow{P} 0$.

3. **Failure of Almost Sure Convergence (SLLN):**
   Consider the sum of probabilities of the events $A_n = \{Y_n = 1\}$:
   $$
   \sum_{n=1}^\infty P(A_n) = \sum_{n=1}^\infty \frac{1}{n} = \infty \quad (\text{Harmonic series diverges})
   $$
   Because the events $A_n$ are mutually independent, the **Second Borel-Cantelli Lemma** applies:
   $$
   P(A_n \text{ occurs infinitely often}) = P(\limsup_{n \to \infty} A_n) = 1
   $$
   With probability 1, $Y_n$ will equal $1$ for infinitely many indices $n$. Thus, $\lim_{n \to \infty} Y_n$ cannot converge to 0 almost surely.

---

### Exercise 10.10: Optimal Monte Carlo Sample Allocation
**Problem Statement:**  
Two independent Monte Carlo estimators $\hat{\theta}_1$ and $\hat{\theta}_2$ estimate the same target parameter $\theta$. Estimator 1 costs $c_1$ compute units per sample and has variance $\sigma_1^2$. Estimator 2 costs $c_2$ compute units per sample and has variance $\sigma_2^2$.  
Given total compute budget $C = n_1 c_1 + n_2 c_2$, find the optimal sample allocation ratio $n_1 / n_2$ to minimize the combined variance of $\hat{\theta} = \frac{1}{2}(\hat{\theta}_1 + \hat{\theta}_2)$.

**Detailed Solution:**  
1. **Variance Expression:**
   $$
   \text{Var}(\hat{\theta}) = \frac{1}{4} \left( \frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2} \right)
   $$

2. **Lagrangian Formulation:**
   We minimize $\frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}$ subject to $c_1 n_1 + c_2 n_2 = C$.  
   $$
   \mathcal{L}(n_1, n_2, \lambda) = \frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2} + \lambda (c_1 n_1 + c_2 n_2 - C)
   $$

3. **First-Order Optimality Conditions:**
   $$
   \frac{\partial \mathcal{L}}{\partial n_1} = -\frac{\sigma_1^2}{n_1^2} + \lambda c_1 = 0 \implies n_1 = \frac{\sigma_1}{\sqrt{\lambda c_1}}
   $$
   $$
   \frac{\partial \mathcal{L}}{\partial n_2} = -\frac{\sigma_2^2}{n_2^2} + \lambda c_2 = 0 \implies n_2 = \frac{\sigma_2}{\sqrt{\lambda c_2}}
   $$

4. **Optimal Allocation Ratio:**
   Dividing $n_1$ by $n_2$:
   $$
   \frac{n_1}{n_2} = \frac{\sigma_1 / \sqrt{c_1}}{\sigma_2 / \sqrt{c_2}} = \left(\frac{\sigma_1}{\sigma_2}\right) \sqrt{\frac{c_2}{c_1}}
   $$
   The optimal allocation is directly proportional to the standard deviation $\sigma_i$ and inversely proportional to the square root of the computational cost $\sqrt{c_i}$.
