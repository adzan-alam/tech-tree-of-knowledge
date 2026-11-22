# Chapter 5: Discrete Random Variables, PMFs, and Canonical Distributions

## 5.1 From Abstract Outcomes to Numerical Realities

In Chapters 1 through 4, we formulated probability over set-theoretic events $A \subseteq \Omega$. While mathematically rigorous, manipulating arbitrary sets of abstract outcomes—such as $\omega = (\text{Heads}, \text{Tails}, \text{Heads})$ or $\omega = \text{"Patient exhibits fever and elevated leukocytes"}$—becomes cumbersome when building numerical algorithms, control systems, and machine learning models.

In computational systems, we require quantitative measurements:
- How many data packets arrived at a router in the last millisecond?
- What is the number of bit errors detected across a deep-space transmission frame?
- How many independent sensor failures occurred before the flight controller triggered failsafe redundancy?

To bridge the qualitative sample space $\Omega$ with the quantitative real numbers $\mathbb{R}$, probability theory introduces the concept of a **Random Variable**.

```
+---------------------------------------------------------------------------------------------------+
|                           THE RANDOM VARIABLE AS A MEASURABLE FUNCTION                            |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|        SAMPLE SPACE (Ω)                             REAL LINE (ℝ)                                 |
|       +-----------------+                          +----------------------------+                 |
|       |     ω_1 (HH)    |        X(ω)              |                            |                 |
|       |                 |  ===================>    |  ... -1   0   1   2   3 ...|                 |
|       |     ω_2 (HT)    |   (Mapping from          |           ^   ^   ^        |                 |
|       |     ω_3 (TH)    |    Outcomes to Reals)    |           |   |   |        |                 |
|       |     ω_4 (TT)    |                          |          X(TT) |  X(HH)    |                 |
|       +-----------------+                          |             X(HT),X(TH)    |                 |
|                                                    +----------------------------+                 |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Definition: Random Variable
Let $(\Omega, \mathcal{F}, P)$ be a probability space. A **Random Variable** $X$ is a measurable function mapping the sample space $\Omega$ into the real line $\mathbb{R}$:
$$X: \Omega \to \mathbb{R}$$
The term *"random variable"* is technically a historical misnomer: $X$ is neither random nor a variable; it is a **deterministic function** whose input is a random outcome $\omega \in \Omega$. The randomness resides entirely in the underlying selection of $\omega$ according to the probability measure $P$.

*Measurability Requirement:* For $X$ to be a valid random variable, the inverse image of any Borel interval $(-\infty, x]$ must be a valid measurable event in the $\sigma$-algebra $\mathcal{F}$:
$$\{\omega \in \Omega : X(\omega) \le x\} = X^{-1}((-\infty, x]) \in \mathcal{F} \quad \forall x \in \mathbb{R}.$$
This ensures that the probability $P(X \le x)$ is always mathematically well-defined.

---

## 5.2 Probability Mass Functions (PMFs) and Cumulative Distribution Functions (CDFs)

A random variable $X$ is **discrete** if its range (the set of possible values it can take) is finite or countably infinite:
$$\text{Range}(X) = \{x_1, x_2, x_3, \dots\} \subset \mathbb{R}.$$

### 1. The Probability Mass Function (PMF)
The probability distribution of a discrete random variable is completely characterized by its **Probability Mass Function (PMF)**, denoted $p_X(x)$:
$$p_X(x) = P(X = x) = P(\{\omega \in \Omega : X(\omega) = x\})$$

#### Essential Properties of a PMF:
1. **Non-negativity:** For all $x \in \mathbb{R}$:
   $$p_X(x) \ge 0$$
   (with $p_X(x) = 0$ for all $x \notin \text{Range}(X)$).
2. **Total Probability Normalization:**
   $$\sum_{x \in \text{Range}(X)} p_X(x) = 1$$
3. **Probability of Any Subset $A \subset \mathbb{R}$:**
   $$P(X \in A) = \sum_{x \in A \cap \text{Range}(X)} p_X(x)$$

---

### 2. The Cumulative Distribution Function (CDF)
While the PMF is specific to discrete random variables, the **Cumulative Distribution Function (CDF)** provides a universal representation applicable to discrete, continuous, and mixed random variables alike.

### Definition: Cumulative Distribution Function
The Cumulative Distribution Function $F_X: \mathbb{R} \to [0, 1]$ of a random variable $X$ is defined as:
$$F_X(x) = P(X \le x) = P(\{\omega \in \Omega : X(\omega) \le x\})$$

For a discrete random variable with range $\{x_1, x_2, \dots\}$:
$$F_X(x) = \sum_{x_i \le x} p_X(x_i)$$

#### Foundational Invariants of Any CDF:
1. **Monotone Non-Decreasing:** If $x_1 \le x_2$, then $F_X(x_1) \le F_X(x_2)$.
   *Proof:* Since $(-\infty, x_1] \subseteq (-\infty, x_2]$, by Monotonicity (Theorem 1.4), $P(X \le x_1) \le P(X \le x_2)$.
2. **Asymptotic Limits:**
   $$\lim_{x \to -\infty} F_X(x) = 0 \quad \text{and} \quad \lim_{x \to +\infty} F_X(x) = 1$$
   *Proof:* Follows directly from Continuity of Measure (Theorem 1.8) applied to intervals $(-\infty, -n]$ and $(-\infty, n]$.
3. **Right-Continuity:** For every $x_0 \in \mathbb{R}$:
   $$\lim_{x \to x_0^+} F_X(x) = F_X(x_0)$$
   A CDF is always continuous from the right, but may feature discontinuous jump discontinuities from the left at discrete probability atoms.
4. **Step Discontinuities and Mass Atoms:**
   The height of the vertical jump of $F_X(x)$ at any point $x$ is precisely the probability mass located at that point:
   $$P(X = x) = F_X(x) - \lim_{t \to x^-} F_X(t) = F_X(x) - F_X(x^-)$$
5. **Interval Probability Calculation:**
   For any interval $(a, b]$:
   $$P(a < X \le b) = F_X(b) - F_X(a)$$

---

## 5.3 Canonical Discrete Probability Distributions

In stochastic modeling and computational engineering, a small family of canonical distributions describes the overwhelming majority of discrete phenomena. Below, we derive each canonical family from first principles.

```
+---------------------------------------------------------------------------------------------------+
|                               CANONICAL DISCRETE DISTRIBUTIONS                                    |
+---------------------------------------------------------------------------------------------------+
| Distribution       | Notation      | Physical Mechanism / Domain              | Support (Range)   |
+--------------------+---------------+------------------------------------------+-------------------+
| Bernoulli          | Bern(p)       | Single binary trial (Success / Failure)  | {0, 1}            |
| Binomial           | Bin(n, p)     | Count of successes in n independent Bern | {0, 1, ..., n}    |
| Geometric          | Geom(p)       | Number of trials until 1st success       | {1, 2, 3, ...}    |
| Negative Binomial  | NegBin(r, p)  | Number of trials until r-th success      | {r, r+1, ...}     |
| Hypergeometric     | Hyper(N, K, n)| Sampling WITHOUT replacement             | {0, ..., min(n,K)}|
| Poisson            | Pois(λ)       | Rare event arrivals in continuous space  | {0, 1, 2, ...}    |
+---------------------------------------------------------------------------------------------------+
```

---

### 1. The Bernoulli Distribution: $\text{Bern}(p)$
The most fundamental building block of discrete probability.
A trial results in either **Success** ($X = 1$) with probability $p \in [0, 1]$, or **Failure** ($X = 0$) with probability $q = 1 - p$.

#### PMF:
$$p_X(x) = \begin{cases} p & \text{if } x = 1 \\ 1 - p & \text{if } x = 0 \\ 0 & \text{otherwise} \end{cases} \quad \iff \quad p_X(x) = p^x (1 - p)^{1 - x}, \quad x \in \{0, 1\}$$

#### Moments:
- **Expectation:** $E[X] = 1(p) + 0(1 - p) = p$.
- **Variance:** $E[X^2] = 1^2(p) + 0^2(1 - p) = p \implies \text{Var}(X) = E[X^2] - (E[X])^2 = p - p^2 = p(1 - p)$.

---

### 2. The Binomial Distribution: $\text{Bin}(n, p)$
Consider $n$ independent and identically distributed (i.i.d.) Bernoulli trials: $X = \sum_{i=1}^n Y_i$, where $Y_i \sim \text{Bern}(p)$.
$X$ counts the total number of successes in $n$ trials.

#### Derivation of PMF:
Any specific sequence of $k$ successes and $n - k$ failures (e.g., $SS \dots S FF \dots F$) has probability:
$$P(\text{Sequence}) = p^k (1 - p)^{n - k} \quad \text{(by stochastic independence)}.$$
By combinatorics (Chapter 2), the number of distinct ways to choose which $k$ of the $n$ positions contain successes is given by the binomial coefficient $\binom{n}{k}$.
Because these sequences are mutually disjoint, we apply Finite Additivity:
$$p_X(k) = P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}, \quad k \in \{0, 1, 2, \dots, n\}$$

#### Normalization Verification:
$$\sum_{k=0}^n \binom{n}{k} p^k (1 - p)^{n - k} = [p + (1 - p)]^n = 1^n = 1 \quad \text{(via the Binomial Theorem)}.$$

#### Moments:
By linearity of expectation (Chapter 7):
- $E[X] = E\left[\sum_{i=1}^n Y_i\right] = \sum_{i=1}^n E[Y_i] = n p$.
- Since trials are independent: $\text{Var}(X) = \sum_{i=1}^n \text{Var}(Y_i) = n p (1 - p)$.

---

### 3. The Geometric Distribution: $\text{Geom}(p)$
Let an endless sequence of independent Bernoulli trials with success probability $p$ be conducted.
Let $X$ be the **number of trials required to observe the first success**.

#### Derivation of PMF:
For the first success to occur on trial $k$ ($k \in \{1, 2, 3, \dots\}$), the first $k - 1$ trials must be failures, followed immediately by success on trial $k$:
$$\underbrace{F \times F \times \dots \times F}_{k - 1 \text{ failures}} \times \underbrace{S}_{1 \text{ success}}$$
By independence:
$$p_X(k) = P(X = k) = (1 - p)^{k - 1} p, \quad k \in \{1, 2, 3, \dots\}$$

#### CDF and the Tail Probability:
The event $X > k$ means that the first $k$ trials were *all* failures:
$$P(X > k) = (1 - p)^k.$$
The CDF is the complement:
$$F_X(k) = P(X \le k) = 1 - P(X > k) = 1 - (1 - p)^k.$$

#### Theorem 5.1: The Memoryless Property of the Geometric Distribution
The Geometric distribution is the **only** discrete distribution possessing the memoryless property:
$$P(X > s + t \mid X > s) = P(X > t) \quad \forall s, t \in \{1, 2, 3, \dots\}$$

*Proof:*
By the definition of conditional probability:
$$P(X > s + t \mid X > s) = \frac{P(X > s + t \cap X > s)}{P(X > s)}.$$
Since $s + t > s$, the event $X > s + t$ is a strict subset of $X > s$. Therefore:
$$P(X > s + t \cap X > s) = P(X > s + t).$$
Substituting the tail probabilities:
$$P(X > s + t \mid X > s) = \frac{(1 - p)^{s + t}}{(1 - p)^s} = \frac{(1 - p)^s (1 - p)^t}{(1 - p)^s} = (1 - p)^t = P(X > t). \quad \blacksquare$$
*Physical Meaning:* If you have already flipped tails 50 consecutive times, the coin does not "remember" its past failures; the remaining waiting time until the first heads is identically distributed to starting fresh from trial 1! (The Gambler's Fallacy refuted).

---

### 4. The Negative Binomial Distribution: $\text{NegBin}(r, p)$
Let an endless sequence of independent Bernoulli trials with success probability $p$ be conducted.
Let $X$ be the **total number of trials required to observe exactly $r$ successes** ($r \ge 1$).

#### Derivation of PMF:
For the $r$-th success to occur on trial $k$ ($k \ge r$):
1. In the first $k - 1$ trials, there must be exactly $r - 1$ successes and $(k - 1) - (r - 1) = k - r$ failures in any order. The number of such sequences is $\binom{k - 1}{r - 1}$.
2. Trial $k$ must be a success (probability $p$).
By the Multiplication Rule:
$$p_X(k) = P(X = k) = \binom{k - 1}{r - 1} p^{r - 1} (1 - p)^{k - r} \times p = \binom{k - 1}{r - 1} p^r (1 - p)^{k - r}, \quad k \in \{r, r+1, r+2, \dots\}$$
Notice that when $r = 1$, $\binom{k - 1}{0} = 1$, and the Negative Binomial collapses identically to the Geometric distribution: $\text{NegBin}(1, p) \equiv \text{Geom}(p)$.
Furthermore, a Negative Binomial variable is the sum of $r$ independent Geometric random variables:
$$X = \sum_{j=1}^r G_j \implies E[X] = \frac{r}{p}, \quad \text{Var}(X) = \frac{r(1 - p)}{p^2}.$$

---

### 5. The Hypergeometric Distribution: $\text{Hypergeom}(N, K, n)$
Consider a finite population of $N$ items containing exactly $K$ "success" items and $N - K$ "failure" items.
We draw a sample of $n$ items **without replacement**.
Let $X$ be the number of success items in our sample.

#### Derivation of PMF:
- The total number of ways to choose $n$ items from $N$ items without replacement is $\binom{N}{n}$.
- The number of ways to choose $k$ successes from the $K$ available success items is $\binom{K}{k}$.
- The remaining $n - k$ items in the sample must be chosen from the $N - K$ failure items in $\binom{N - K}{n - k}$ ways.
By the Rule of Product:
$$p_X(k) = P(X = k) = \frac{\binom{K}{k} \binom{N - K}{n - k}}{\binom{N}{n}}, \quad \max(0, n - (N - K)) \le k \le \min(n, K)$$

#### Asymptotic Convergence to the Binomial:
When the population size $N \to \infty$ while the success proportion $p = \frac{K}{N}$ remains constant, drawing without replacement becomes indistinguishable from drawing with replacement:
$$\lim_{N \to \infty} \frac{\binom{pN}{k} \binom{(1 - p)N}{n - k}}{\binom{N}{n}} = \binom{n}{k} p^k (1 - p)^{n - k} \quad (\text{Binomial limit}).$$

---

### 6. The Poisson Distribution: $\text{Pois}(\lambda)$
Named after Siméon Denis Poisson (1837), the Poisson distribution models the number of discrete events occurring within a fixed interval of continuous time, space, or volume, where events occur independently at a constant average rate $\lambda > 0$.

#### PMF:
$$p_X(k) = P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad k \in \{0, 1, 2, \dots\}$$

#### Normalization Verification:
$$\sum_{k=0}^\infty \frac{\lambda^k e^{-\lambda}}{k!} = e^{-\lambda} \sum_{k=0}^\infty \frac{\lambda^k}{k!} = e^{-\lambda} \left(e^\lambda\right) = e^0 = 1 \quad (\text{Taylor series of } e^\lambda).$$

#### Moments:
- **Expectation:** $E[X] = \lambda$.
- **Variance:** $\text{Var}(X) = \lambda$.
*(The equality of mean and variance, $E[X] = \text{Var}(X) = \lambda$, is the unique statistical fingerprint of a Poisson process).*

---

## 5.4 The Poisson Limit Theorem (The Law of Rare Events)

The Poisson distribution is the mathematical limit of a Binomial distribution when the number of trials $n$ approaches infinity while the probability of success on each trial $p$ approaches zero, such that their expected product $n p = \lambda$ remains constant.

### Theorem 5.2: The Poisson Limit of the Binomial Distribution
Let $X_n \sim \text{Bin}(n, p_n)$ such that as $n \to \infty$, $p_n \to 0$ with $n p_n \to \lambda > 0$. Then for every fixed integer $k \ge 0$:
$$\lim_{n \to \infty} P(X_n = k) = \frac{\lambda^k e^{-\lambda}}{k!}$$

*Proof:*
From the Binomial PMF, substitute $p = \frac{\lambda}{n}$:
$$P(X_n = k) = \binom{n}{k} \left(\frac{\lambda}{n}\right)^k \left(1 - \frac{\lambda}{n}\right)^{n - k}.$$
Expand the binomial coefficient and rearrange algebraically:
$$P(X_n = k) = \frac{n(n - 1)(n - 2)\cdots(n - k + 1)}{k!} \frac{\lambda^k}{n^k} \left(1 - \frac{\lambda}{n}\right)^n \left(1 - \frac{\lambda}{n}\right)^{-k}$$
$$P(X_n = k) = \frac{\lambda^k}{k!} \times \left[ \frac{n}{n} \cdot \frac{n - 1}{n} \cdot \frac{n - 2}{n} \cdots \frac{n - k + 1}{n} \right] \times \left(1 - \frac{\lambda}{n}\right)^n \times \left(1 - \frac{\lambda}{n}\right)^{-k}.$$
Now take the limit as $n \to \infty$ of each factor individually:
1. For fixed $k$, the product of fractions has $k$ terms:
   $$\lim_{n \to \infty} \left(1\right) \left(1 - \frac{1}{n}\right) \left(1 - \frac{2}{n}\right) \cdots \left(1 - \frac{k - 1}{n}\right) = 1 \times 1 \times \dots \times 1 = 1.$$
2. By the foundational calculus definition of Euler's exponential constant:
   $$\lim_{n \to \infty} \left(1 - \frac{\lambda}{n}\right)^n = e^{-\lambda}.$$
3. Because $k$ is fixed and $\frac{\lambda}{n} \to 0$:
   $$\lim_{n \to \infty} \left(1 - \frac{\lambda}{n}\right)^{-k} = (1 - 0)^{-k} = 1.$$
Multiplying the limits:
$$\lim_{n \to \infty} P(X_n = k) = \frac{\lambda^k}{k!} \times 1 \times e^{-\lambda} \times 1 = \frac{\lambda^k e^{-\lambda}}{k!}. \quad \blacksquare$$

*Significance in Computer Science & Networking:*
A web server receives requests from $n = 10,000,000$ potential internet clients, each having an infinitesimal chance $p = 10^{-7}$ of clicking in any given millisecond. Modeling this as $\text{Bin}(10^7, 10^{-7})$ is computationally intractable; the Poisson limit $\text{Pois}(\lambda = 1.0)$ provides an instant, exact analytical representation.

---

## 5.5 Worked Examples: First-Principles Solutions

---

### Example 5.1: Binomial Error Correction in Wireless Telemetry
**Problem:** A deep-space probe transmits telemetry packets consisting of $n = 127$ bits across an interplanetary radio link with independent bit error probability $p = 0.005$ ($0.5\%$).
The receiver employs a Bose-Chaudhuri-Hocquenghem (BCH) forward error-correcting code capable of correcting up to $t = 3$ bit errors per packet. If more than 3 errors occur, the entire packet is corrupted and discarded.
1. State the distribution of the number of bit errors $X$.
2. Calculate the exact probability that a transmitted packet is successfully decoded without corruption ($P(X \le 3)$).
3. Compute the expected number of bit errors per packet $E[X]$ and the variance $\text{Var}(X)$.

**Solution:**
1. Because bits are transmitted independently across a memoryless channel with constant error probability $p = 0.005$, the number of errors $X$ follows a **Binomial distribution**:
$$X \sim \text{Bin}(n = 127, p = 0.005).$$

2. A packet is successfully decoded if $X \le 3$:
$$P(X \le 3) = \sum_{k=0}^3 \binom{127}{k} (0.005)^k (0.995)^{127 - k}.$$
We compute the probability of $k = 0, 1, 2, 3$ errors:
- **$k = 0$ errors:**
  $$P(X = 0) = \binom{127}{0} (0.005)^0 (0.995)^{127} = (0.995)^{127} \approx 0.528994.$$
- **$k = 1$ error:**
  $$P(X = 1) = \binom{127}{1} (0.005)^1 (0.995)^{126} = 127 \times 0.005 \times (0.995)^{126} = 127 \times 0.005 \times 0.531652 \approx 0.337599.$$
- **$k = 2$ errors:**
  $$P(X = 2) = \binom{127}{2} (0.005)^2 (0.995)^{125} = \frac{127 \times 126}{2} \times 0.000025 \times 0.534324 = 8,001 \times 0.000025 \times 0.534324 \approx 0.106878.$$
- **$k = 3$ errors:**
  $$P(X = 3) = \binom{127}{3} (0.005)^3 (0.995)^{124} = \frac{127 \times 126 \times 125}{6} \times 0.000000125 \times 0.537009 = 333,375 \times 1.25 \times 10^{-7} \times 0.537009 \approx 0.022378.$$

Summing these mutually disjoint cases:
$$P(X \le 3) = 0.528994 + 0.337599 + 0.106878 + 0.022378 = 0.995849 \quad (99.585\%).$$
The packet corruption loss rate is:
$$P(\text{Packet Corrupted}) = 1 - P(X \le 3) = 1 - 0.995849 = 0.004151 \quad (0.415\%).$$

3. **Moments:**
- $E[X] = n p = 127 \times 0.005 = 0.635 \text{ errors/packet}$.
- $\text{Var}(X) = n p (1 - p) = 127 \times 0.005 \times 0.995 = 0.631825$.
- Standard deviation: $\sigma = \sqrt{0.631825} \approx 0.7949 \text{ errors}$.

---

### Example 5.2: Poisson Web Server Traffic Capacity Planning
**Problem:** A cloud web server receives incoming API requests modeled as a homogeneous Poisson process with an average arrival rate of $\lambda = 4.0$ requests per second.
The server can process at most $8$ requests in any 1-second window before its thread pool is saturated and incoming requests are throttled (dropped).
1. What is the probability that in any given 1-second interval, the server receives *exactly 4* requests?
2. What is the probability that the server experiences request throttling ($X > 8$)?
3. What is the probability of zero requests during a 2-second interval?

**Solution:**
1. Let $X$ be the number of requests in a 1-second window. Then $X \sim \text{Pois}(\lambda = 4.0)$.
The PMF is:
$$p_X(k) = \frac{4^k e^{-4}}{k!}.$$
For $k = 4$:
$$P(X = 4) = \frac{4^4 e^{-4}}{4!} = \frac{256 \times e^{-4}}{24} = \frac{32}{3} e^{-4} \approx 10.6667 \times 0.0183156 \approx 0.195367 \quad (19.54\%).$$

2. Throttling occurs if $X > 8$. By the complement rule:
$$P(X > 8) = 1 - P(X \le 8) = 1 - \sum_{k=0}^8 \frac{4^k e^{-4}}{k!} = 1 - e^{-4} \sum_{k=0}^8 \frac{4^k}{k!}.$$
Computing the partial sum:
$$\sum_{k=0}^8 \frac{4^k}{k!} = 1 + 4 + \frac{16}{2} + \frac{64}{6} + \frac{256}{24} + \frac{1024}{120} + \frac{4096}{720} + \frac{16384}{5040} + \frac{65536}{40320}$$
$$= 1 + 4 + 8 + 10.6667 + 10.6667 + 8.5333 + 5.6889 + 3.2508 + 1.6254 = 53.4318.$$
Multiplying by $e^{-4} \approx 0.0183156$:
$$P(X \le 8) = 53.4318 \times 0.0183156 \approx 0.97863.$$
Therefore:
$$P(X > 8) = 1 - 0.97863 = 0.02137 \quad (2.14\%).$$
The server drops requests in approximately $2.14\%$ of 1-second operating windows.

3. For a 2-second window, the rate scales proportionally with time:
$$\lambda_{2s} = \lambda \times t = 4.0 \times 2 = 8.0.$$
Let $Y \sim \text{Pois}(\lambda = 8.0)$ be the request count in 2 seconds.
The probability of zero requests is:
$$P(Y = 0) = \frac{8^0 e^{-8}}{0!} = e^{-8} \approx 0.00033546 \quad (0.0335\%).$$

---

### Example 5.3: Geometric Failure Tracking in Industrial Robotics
**Problem:** An industrial robotic welding arm operates in high-precision cycles. The probability that the robotic gripper misaligns on any single welding cycle is $p = 0.02$ ($2\%$). The cycles are stochastically independent.
Let $X$ be the number of welding cycles executed until the first misalignment occurs.
1. State the distribution and support of $X$.
2. Calculate the probability that the robot operates for *at least 50 cycles* without a misalignment ($P(X > 50)$).
3. If the robot has already completed 40 cycles without misalignment, what is the conditional probability that it will complete at least 50 total cycles without misalignment?

**Solution:**
1. $X$ models the trial index of the first success (misalignment) in a sequence of independent Bernoulli trials.
Therefore, $X$ follows a **Geometric distribution**:
$$X \sim \text{Geom}(p = 0.02), \quad \text{Support: } \{1, 2, 3, \dots\}.$$

2. The event $X > 50$ means that the first 50 consecutive welding cycles were all successful:
$$P(X > 50) = (1 - p)^{50} = (0.98)^{50}.$$
Evaluating numerically:
$$(0.98)^{50} = \exp(50 \ln(0.98)) \approx \exp(50 \times (-0.0202027)) = \exp(-1.010135) \approx 0.36417 \quad (36.42\%).$$
There is a $36.42\%$ chance of reaching 50 cycles without a flaw.

3. We seek $P(X > 50 \mid X > 40)$.
By Theorem 5.1 (The Memoryless Property of the Geometric Distribution):
$$P(X > s + t \mid X > s) = P(X > t).$$
Here $s = 40$ and $s + t = 50 \implies t = 10$.
Therefore:
$$P(X > 50 \mid X > 40) = P(X > 10) = (1 - p)^{10} = (0.98)^{10}.$$
Evaluating numerically:
$$(0.98)^{10} \approx 0.81707 \quad (81.71\%).$$
*Physical Meaning:* The fact that the robot survived 40 cycles provides zero "wear-and-tear" information in a memoryless process; the probability of surviving the next 10 cycles is identically $(0.98)^{10} \approx 81.71\%$.

---

### Example 5.4: Negative Binomial Quality Control
**Problem:** A silicon wafer fabrication plant conducts automated optical inspection. The probability that an inspected wafer has a lithographic defect is $p = 0.05$ ($5\%$). Wafers are inspected sequentially until a quality control batch discovers exactly $r = 4$ defective wafers, at which point the line is paused for recalibration.
Let $X$ be the total number of wafers inspected when the 4th defect is found.
1. What is the probability that the line pauses on exactly the 20th wafer inspected ($P(X = 20)$)?
2. What is the expected number of wafers inspected before pausing, and what is the standard deviation?

**Solution:**
1. $X$ models the number of trials required to achieve $r = 4$ successes with $p = 0.05$.
Therefore:
$$X \sim \text{NegBin}(r = 4, p = 0.05).$$
The PMF is:
$$P(X = k) = \binom{k - 1}{r - 1} p^r (1 - p)^{k - r}, \quad k \ge r.$$
For $k = 20$ and $r = 4$:
$$P(X = 20) = \binom{20 - 1}{4 - 1} (0.05)^4 (0.95)^{20 - 4} = \binom{19}{3} (0.05)^4 (0.95)^{16}.$$
Compute the components:
$$\binom{19}{3} = \frac{19 \times 18 \times 17}{3 \times 2 \times 1} = 19 \times 3 \times 17 = 969.$$
$$(0.05)^4 = 0.00000625 = 6.25 \times 10^{-6}.$$
$$(0.95)^{16} \approx 0.440126.$$
Multiplying:
$$P(X = 20) = 969 \times 6.25 \times 10^{-6} \times 0.440126 \approx 0.0026655 \quad (0.267\%).$$

2. **Moments:**
- Expected number of inspected wafers:
  $$E[X] = \frac{r}{p} = \frac{4}{0.05} = 80 \text{ wafers}.$$
- Variance:
  $$\text{Var}(X) = \frac{r(1 - p)}{p^2} = \frac{4 \times 0.95}{(0.05)^2} = \frac{3.8}{0.0025} = 1,520.$$
- Standard deviation:
  $$\sigma = \sqrt{1,520} \approx 38.99 \text{ wafers}.$$
On average, 80 wafers are inspected before the 4th defect halts the line.

---

### Example 5.5: Hypergeometric Tag-and-Recapture (Lincoln-Petersen Estimator)
**Problem:** A marine biology team estimates the unknown fish population $N$ of a protected lake.
- In Stage 1: The team captures, tags, and releases $K = 100$ fish back into the lake.
- In Stage 2: After allowing the tagged fish to disperse randomly, the team catches a sample of $n = 60$ fish and observes that exactly $k = 12$ of them are tagged.
1. State the exact probability of observing $k = 12$ tagged fish as a function of the total population $N$.
2. Derive the **Maximum Likelihood Estimate** $\hat{N}_{\text{MLE}}$ of the total fish population.

**Solution:**
1. The number of tagged fish in the second sample follows a **Hypergeometric distribution**:
$$k \sim \text{Hypergeom}(N, K = 100, n = 60).$$
The probability of observing $k = 12$ tagged fish is:
$$L(N) = P(k = 12 \mid N) = \frac{\binom{K}{k} \binom{N - K}{n - k}}{\binom{N}{n}} = \frac{\binom{100}{12} \binom{N - 100}{48}}{\binom{N}{60}}.$$

2. To find the integer $N$ maximizing the likelihood $L(N)$, we consider the ratio of successive likelihoods:
$$\frac{L(N)}{L(N - 1)} = \frac{\frac{\binom{100}{12} \binom{N - 100}{48}}{\binom{N}{60}}}{\frac{\binom{100}{12} \binom{N - 1 - 100}{48}}{\binom{N - 1}{60}}} = \frac{\binom{N - 100}{48}}{\binom{N - 101}{48}} \times \frac{\binom{N - 1}{60}}{\binom{N}{60}}.$$
Expanding the binomial coefficients:
$$\frac{\binom{N - 100}{48}}{\binom{N - 101}{48}} = \frac{\frac{(N - 100)!}{48! (N - 148)!}}{\frac{(N - 101)!}{48! (N - 149)!}} = \frac{N - 100}{N - 148}.$$
$$\frac{\binom{N - 1}{60}}{\binom{N}{60}} = \frac{\frac{(N - 1)!}{60! (N - 61)!}}{\frac{N!}{60! (N - 60)!}} = \frac{N - 60}{N}.$$
Therefore:
$$\frac{L(N)}{L(N - 1)} = \frac{(N - 100)(N - 60)}{N(N - 148)} = \frac{N^2 - 160N + 6000}{N^2 - 148N}.$$
The likelihood $L(N)$ increases as long as the ratio is $\ge 1$:
$$\frac{N^2 - 160N + 6000}{N^2 - 148N} \ge 1 \iff N^2 - 160N + 6000 \ge N^2 - 148N.$$
$$-160N + 6000 \ge -148N \iff 12N \le 6000 \iff N \le \frac{6000}{12} = 500.$$
The ratio $\frac{L(N)}{L(N - 1)} > 1$ for $N < 500$, equals $1$ at $N = 500$, and is $< 1$ for $N > 500$.
Thus, the likelihood peaks at:
$$\hat{N}_{\text{MLE}} = \frac{K \cdot n}{k} = \frac{100 \times 60}{12} = 500 \text{ fish}.$$
This is the classic **Lincoln-Petersen capture-recapture estimator**: $\frac{k}{n} \approx \frac{K}{N} \implies N \approx \frac{K n}{k}$.

---

### Example 5.6: Le Cam's Inequality and Poisson Approximation Error
**Problem:** Lucien Le Cam proved in 1960 that when approximating the sum of $n$ independent Bernoulli variables with probabilities $p_i$ by a Poisson distribution with $\lambda = \sum p_i$, the total variation distance between the true distribution and the Poisson approximation is strictly bounded by:
$$d_{\text{TV}}(P_{\text{Bin}}, P_{\text{Pois}}) = \frac{1}{2} \sum_{k=0}^\infty |P(X = k) - P(Y = k)| \le \sum_{i=1}^n p_i^2.$$
Consider $n = 1,000$ microchip logic gates on an ASIC, each having independent failure probability $p = 0.002$ ($0.2\%$).
1. Compute the exact Binomial probability of observing *exactly 3 failures* ($X \sim \text{Bin}(1000, 0.002)$).
2. Compute the Poisson approximation with $\lambda = n p$.
3. Compute Le Cam's upper bound on the total approximation error.

**Solution:**
1. **Exact Binomial Probability:**
$$P(X = 3) = \binom{1000}{3} (0.002)^3 (0.998)^{997}.$$
$$\binom{1000}{3} = \frac{1000 \times 999 \times 998}{6} = 166,167,000.$$
$$(0.002)^3 = 8 \times 10^{-9}.$$
$$(0.998)^{997} \approx 0.135767.$$
$$P(X = 3) = 166,167,000 \times 8 \times 10^{-9} \times 0.135767 \approx 1.329336 \times 0.135767 \approx 0.180479 \quad (18.048\%).$$

2. **Poisson Approximation:**
$$\lambda = n p = 1,000 \times 0.002 = 2.0.$$
$$P(Y = 3) = \frac{2^3 e^{-2}}{3!} = \frac{8 e^{-2}}{6} = \frac{4}{3} e^{-2} \approx 1.33333 \times 0.135335 \approx 0.180447 \quad (18.045\%).$$
The absolute error on this individual probability is:
$$|0.180479 - 0.180447| = 0.000032 \quad (0.0032\%!).$$

3. **Le Cam's Global Error Bound:**
Because all $p_i = p = 0.002$:
$$\sum_{i=1}^n p_i^2 = n p^2 = 1,000 \times (0.002)^2 = 1,000 \times 0.000004 = 0.004.$$
Le Cam's inequality guarantees that across the *entire infinite distribution*, the sum of absolute errors between the Binomial and Poisson probabilities cannot exceed $2 \times 0.004 = 0.008$. The approximation is exceptionally accurate.

---

### Example 5.7: The Coupon Collector's Problem as a Sum of Geometrics
**Problem:** A brand of cereal places one of $n = 5$ distinct collectible superhero toys inside each box, with each toy being equally likely ($p = 1/5$). A child wishes to collect all 5 distinct toys.
Let $T$ be the total number of cereal boxes purchased until the complete set of 5 toys is obtained.
1. Decompose $T$ into a sum of independent Geometric random variables.
2. Calculate the expected number of boxes required to complete the collection.
3. Calculate the variance of $T$.

**Solution:**
1. Let $T_i$ be the number of additional boxes purchased to collect the $i$-th distinct toy after having already collected $i - 1$ distinct toys ($i \in \{1, 2, 3, 4, 5\}$).
The total number of boxes is:
$$T = \sum_{i=1}^5 T_i.$$
- To get the 1st toy: any box has a new toy, so $p_1 = \frac{5}{5} = 1 \implies T_1 \sim \text{Geom}(1)$.
- To get the 2nd toy: 1 toy is already owned, 4 are new. Success probability is $p_2 = \frac{5 - 1}{5} = \frac{4}{5} \implies T_2 \sim \text{Geom}(4/5)$.
- To get the 3rd toy: 2 toys owned, 3 new. $p_3 = \frac{5 - 2}{5} = \frac{3}{5} \implies T_3 \sim \text{Geom}(3/5)$.
- To get the 4th toy: 3 toys owned, 2 new. $p_4 = \frac{5 - 3}{5} = \frac{2}{5} \implies T_4 \sim \text{Geom}(2/5)$.
- To get the 5th toy: 4 toys owned, 1 new. $p_5 = \frac{5 - 4}{5} = \frac{1}{5} \implies T_5 \sim \text{Geom}(1/5)$.
The variables $T_1, T_2, T_3, T_4, T_5$ are stochastically independent.

2. **Expectation:**
By linearity of expectation:
$$E[T] = \sum_{i=1}^5 E[T_i] = \sum_{i=1}^5 \frac{1}{p_i} = \frac{5}{5} + \frac{5}{4} + \frac{5}{3} + \frac{5}{2} + \frac{5}{1} = 5 \left[ 1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \frac{1}{5} \right].$$
The term in brackets is the Harmonic number $H_5$:
$$H_5 = 1 + 0.5 + 0.3333 + 0.25 + 0.2 = \frac{137}{60} \approx 2.2833.$$
$$E[T] = 5 \times \frac{137}{60} = \frac{137}{12} \approx 11.417 \text{ boxes}.$$
On average, the child must purchase $\approx 11.4$ boxes to find all 5 toys.

3. **Variance:**
Because the $T_i$ are independent:
$$\text{Var}(T) = \sum_{i=1}^5 \text{Var}(T_i) = \sum_{i=1}^5 \frac{1 - p_i}{p_i^2}.$$
- $i = 1$: $\frac{1 - 1}{1^2} = 0$.
- $i = 2$: $\frac{1 - 4/5}{(4/5)^2} = \frac{0.20}{0.64} = \frac{5}{16} = 0.3125$.
- $i = 3$: $\frac{1 - 3/5}{(3/5)^2} = \frac{0.40}{0.36} = \frac{10}{9} \approx 1.1111$.
- $i = 4$: $\frac{1 - 2/5}{(2/5)^2} = \frac{0.60}{0.16} = \frac{15}{4} = 3.7500$.
- $i = 5$: $\frac{1 - 1/5}{(1/5)^2} = \frac{0.80}{0.04} = 20.0000$.
Summing variances:
$$\text{Var}(T) = 0 + 0.3125 + 1.1111 + 3.7500 + 20.0000 = 25.1736.$$
Standard deviation: $\sigma = \sqrt{25.1736} \approx 5.017 \text{ boxes}$.

---

### Example 5.8: Extracting PMFs and Probabilities from a Step-Function CDF
**Problem:** A discrete random variable $X$ has the Cumulative Distribution Function (CDF):
$$F_X(x) = \begin{cases} 0 & x < 1 \\ 0.20 & 1 \le x < 3 \\ 0.55 & 3 \le x < 4 \\ 0.85 & 4 \le x < 7 \\ 1.00 & x \ge 7 \end{cases}$$
1. Identify the range (support) of $X$.
2. Determine the Probability Mass Function $p_X(x)$ for all values in its range.
3. Compute the probabilities: $P(X = 3)$, $P(X \le 4)$, $P(2 < X \le 6)$, and $P(X > 3)$.

**Solution:**
1. The jump discontinuities of $F_X(x)$ occur at $x = 1, 3, 4, 7$.
Therefore, the support of $X$ is the discrete set:
$$\text{Range}(X) = \{1, 3, 4, 7\}.$$

2. The probability mass at each jump point is the height of the vertical step: $p_X(x) = F_X(x) - F_X(x^-)$:
- At $x = 1$: $p_X(1) = F(1) - F(1^-) = 0.20 - 0 = 0.20$.
- At $x = 3$: $p_X(3) = F(3) - F(3^-) = 0.55 - 0.20 = 0.35$.
- At $x = 4$: $p_X(4) = F(4) - F(4^-) = 0.85 - 0.55 = 0.30$.
- At $x = 7$: $p_X(7) = F(7) - F(7^-) = 1.00 - 0.85 = 0.15$.
Check normalization: $0.20 + 0.35 + 0.30 + 0.15 = 1.00$.

3. **Evaluating Probabilities:**
- $P(X = 3) = p_X(3) = 0.35$.
- $P(X \le 4) = F_X(4) = 0.85$.
- $P(2 < X \le 6) = F_X(6) - F_X(2) = 0.85 - 0.20 = 0.65$.
  *(Check: $X \in \{3, 4\} \implies 0.35 + 0.30 = 0.65$).*
- $P(X > 3) = 1 - P(X \le 3) = 1 - F_X(3) = 1 - 0.55 = 0.45$.

---

### Example 5.9: Convolution Sum of Independent Poisson Random Variables
**Problem:** Let $X \sim \text{Pois}(\lambda_1)$ and $Y \sim \text{Pois}(\lambda_2)$ be independent random variables representing arrival traffic from two separate network routers.
Prove by discrete convolution that their sum $Z = X + Y$ follows a Poisson distribution with parameter $\lambda = \lambda_1 + \lambda_2$:
$$Z \sim \text{Pois}(\lambda_1 + \lambda_2).$$

**Solution:**
The sum $Z = X + Y$ takes non-negative integer values $n \in \{0, 1, 2, \dots\}$.
The event $\{X + Y = n\}$ can occur via mutually exclusive partitions where $X = k$ and $Y = n - k$ for $k \in \{0, 1, \dots, n\}$.
By the discrete convolution formula:
$$P(Z = n) = \sum_{k=0}^n P(X = k, Y = n - k).$$
Since $X$ and $Y$ are independent:
$$P(X = k, Y = n - k) = P(X = k) P(Y = n - k) = \left( \frac{\lambda_1^k e^{-\lambda_1}}{k!} \right) \left( \frac{\lambda_2^{n - k} e^{-\lambda_2}}{(n - k)!} \right).$$
Substitute and factor out terms independent of $k$:
$$P(Z = n) = e^{-(\lambda_1 + \lambda_2)} \sum_{k=0}^n \frac{\lambda_1^k \lambda_2^{n - k}}{k! (n - k)!}.$$
Multiply and divide by $n!$:
$$P(Z = n) = \frac{e^{-(\lambda_1 + \lambda_2)}}{n!} \sum_{k=0}^n \frac{n!}{k! (n - k)!} \lambda_1^k \lambda_2^{n - k} = \frac{e^{-(\lambda_1 + \lambda_2)}}{n!} \sum_{k=0}^n \binom{n}{k} \lambda_1^k \lambda_2^{n - k}.$$
By the Binomial Theorem, the sum is identically $(\lambda_1 + \lambda_2)^n$:
$$\sum_{k=0}^n \binom{n}{k} \lambda_1^k \lambda_2^{n - k} = (\lambda_1 + \lambda_2)^n.$$
Substituting:
$$P(Z = n) = \frac{(\lambda_1 + \lambda_2)^n e^{-(\lambda_1 + \lambda_2)}}{n!}.$$
This is precisely the PMF of a Poisson distribution with rate $\lambda_1 + \lambda_2$.
Therefore, $X + Y \sim \text{Pois}(\lambda_1 + \lambda_2)$. $\blacksquare$

---

### Example 5.10: The Zero-Truncated Poisson Distribution
**Problem:** In hospital emergency admissions, a medical database only records patients who visit the clinic at least once; individuals with zero clinic visits are never registered in the system (zero-truncation).
Suppose the underlying count of visits follows $X \sim \text{Pois}(\lambda)$, but we can only observe the conditional distribution given $X \ge 1$.
1. Derive the Probability Mass Function of the **Zero-Truncated Poisson Distribution** $Y = (X \mid X \ge 1)$.
2. Calculate the expectation $E[Y]$.

**Solution:**
1. For an unconstrained Poisson variable $X$:
$$P(X = 0) = e^{-\lambda}.$$
$$P(X \ge 1) = 1 - P(X = 0) = 1 - e^{-\lambda}.$$
For any $k \in \{1, 2, 3, \dots\}$, applying the definition of conditional probability:
$$p_Y(k) = P(X = k \mid X \ge 1) = \frac{P(X = k \cap X \ge 1)}{P(X \ge 1)}.$$
Since $k \ge 1$, $\{X = k\} \subseteq \{X \ge 1\}$, so the numerator is simply $P(X = k)$:
$$p_Y(k) = \frac{\frac{\lambda^k e^{-\lambda}}{k!}}{1 - e^{-\lambda}} = \frac{\lambda^k}{(e^\lambda - 1) k!}, \quad k \in \{1, 2, 3, \dots\}.$$

2. To compute $E[Y]$:
$$E[Y] = \sum_{k=1}^\infty k \cdot p_Y(k) = \sum_{k=1}^\infty k \frac{\lambda^k}{(e^\lambda - 1) k!} = \frac{1}{e^\lambda - 1} \sum_{k=1}^\infty \frac{\lambda^k}{(k - 1)!}.$$
Let $j = k - 1$. As $k$ goes from $1$ to $\infty$, $j$ goes from $0$ to $\infty$:
$$\sum_{k=1}^\infty \frac{\lambda^k}{(k - 1)!} = \lambda \sum_{j=0}^\infty \frac{\lambda^j}{j!} = \lambda e^\lambda.$$
Substituting:
$$E[Y] = \frac{\lambda e^\lambda}{e^\lambda - 1} = \frac{\lambda}{1 - e^{-\lambda}}.$$
Since $1 - e^{-\lambda} < 1$, $E[Y] > \lambda$, correctly reflecting that removing zero values shifts the distribution's center of mass upward.

---

## 5.6 Solved Practice Exercises

---

### Exercise 5.1: Mode of the Binomial Distribution
**Problem:** Prove that the mode $\hat{k}$ of a Binomial distribution $X \sim \text{Bin}(n, p)$ satisfies:
$$(n + 1)p - 1 \le \hat{k} \le (n + 1)p.$$

**Solution:**
The mode $\hat{k}$ is the integer maximizing $p(k) = \binom{n}{k} p^k (1 - p)^{n - k}$.
Consider the ratio of consecutive terms:
$$\frac{p(k)}{p(k - 1)} = \frac{\binom{n}{k} p^k (1 - p)^{n - k}}{\binom{n}{k - 1} p^{k - 1} (1 - p)^{n - k + 1}} = \frac{\frac{n!}{k!(n - k)!}}{\frac{n!}{(k - 1)!(n - k + 1)!}} \frac{p}{1 - p} = \frac{n - k + 1}{k} \frac{p}{1 - p}.$$
The sequence $p(k)$ increases as long as the ratio is $\ge 1$:
$$\frac{n - k + 1}{k} \frac{p}{1 - p} \ge 1 \iff (n - k + 1)p \ge k(1 - p).$$
$$np - kp + p \ge k - kp \iff (n + 1)p \ge k.$$
Thus, $p(k) \ge p(k - 1)$ for all $k \le (n + 1)p$.
The terms increase up to $k = \lfloor (n + 1)p \rfloor$, after which they strictly decrease.
Therefore, the mode $\hat{k}$ is $\lfloor (n + 1)p \rfloor$, which satisfies:
$$(n + 1)p - 1 \le \hat{k} \le (n + 1)p. \quad \blacksquare$$

---

### Exercise 5.2: Memoryless Geometric Characterization
**Problem:** Prove that if a discrete random variable $X$ supported on $\{1, 2, 3, \dots\}$ satisfies the memoryless property $P(X > s + t \mid X > s) = P(X > t)$ for all positive integers $s, t$, then $X$ must be geometrically distributed.

**Solution:**
Let $G(k) = P(X > k)$ denote the survival function.
The memoryless condition states:
$$\frac{P(X > s + t)}{P(X > s)} = P(X > t) \iff G(s + t) = G(s) G(t).$$
Setting $s = 1, t = 1$: $G(2) = G(1)^2$.
Setting $s = 2, t = 1$: $G(3) = G(2)G(1) = G(1)^3$.
By mathematical induction, for any positive integer $k$:
$$G(k) = G(1)^k.$$
Since $0 \le P(X > 1) \le 1$, let $q = G(1) = P(X > 1) = 1 - p$ for some $p \in (0, 1]$.
Then:
$$P(X > k) = q^k = (1 - p)^k.$$
The PMF is recovered as:
$$P(X = k) = P(X > k - 1) - P(X > k) = (1 - p)^{k - 1} - (1 - p)^k = (1 - p)^{k - 1}[1 - (1 - p)] = (1 - p)^{k - 1} p.$$
This is identically the Geometric distribution $\text{Geom}(p)$. Thus, the Geometric distribution is the unique memoryless discrete distribution. $\blacksquare$

---

### Exercise 5.3: Finite Population Correction in Hypergeometric Variance
**Problem:** The variance of a Hypergeometric distribution $X \sim \text{Hypergeom}(N, K, n)$ with $p = K / N$ is:
$$\text{Var}(X) = n p (1 - p) \left( \frac{N - n}{N - 1} \right).$$
Show that $\text{Var}_{\text{Hyper}}(X) < \text{Var}_{\text{Bin}}(X)$ for any sample size $n > 1$, and explain why sampling without replacement reduces variance.

**Solution:**
For the Binomial distribution with identical parameters, $\text{Var}_{\text{Bin}}(X) = n p (1 - p)$.
Comparing the two:
$$\frac{\text{Var}_{\text{Hyper}}(X)}{\text{Var}_{\text{Bin}}(X)} = \frac{N - n}{N - 1}.$$
Since $n > 1$:
$$N - n < N - 1 \implies \frac{N - n}{N - 1} < 1.$$
Therefore:
$$\text{Var}_{\text{Hyper}}(X) < \text{Var}_{\text{Bin}}(X).$$
*Physical Explanation:*
In sampling with replacement (Binomial), every draw is independent; observing successes does not restrict future draws.
In sampling without replacement (Hypergeometric), drawing a success removes a success from the pool, making future draws slightly more likely to be failures (negative covariance between trials). This self-correcting negative correlation suppresses extreme swings, strictly reducing the variance. $\blacksquare$

---

### Exercise 5.4: Maximum Likelihood Estimator of Poisson Parameter
**Problem:** Given an i.i.d. sample of $m$ observations $\mathbf{k} = (k_1, k_2, \dots, k_m)$ from a Poisson distribution $\text{Pois}(\lambda)$:
Derive the Maximum Likelihood Estimator $\hat{\lambda}_{\text{MLE}}$.

**Solution:**
The likelihood function is:
$$L(\lambda; \mathbf{k}) = \prod_{i=1}^m \frac{\lambda^{k_i} e^{-\lambda}}{k_i!} = \frac{\lambda^{\sum k_i} e^{-m\lambda}}{\prod k_i!}.$$
Taking the natural logarithm (log-likelihood):
$$\ell(\lambda) = \ln L(\lambda) = \left(\sum_{i=1}^m k_i\right) \ln\lambda - m\lambda - \sum_{i=1}^m \ln(k_i!).$$
Differentiating with respect to $\lambda$:
$$\frac{d\ell}{d\lambda} = \frac{\sum_{i=1}^m k_i}{\lambda} - m = 0.$$
Solving for $\lambda$:
$$\frac{\sum k_i}{\lambda} = m \implies \hat{\lambda}_{\text{MLE}} = \frac{1}{m} \sum_{i=1}^m k_i = \bar{k}.$$
Checking the second derivative:
$$\frac{d^2\ell}{d\lambda^2} = -\frac{\sum k_i}{\lambda^2} < 0 \quad (\text{strictly concave, guaranteeing a global maximum}).$$
The MLE is the sample mean $\bar{k}$. $\blacksquare$

---

### Exercise 5.5: Negative Binomial Distribution of Failures
**Problem:** In alternative textbooks, the Negative Binomial distribution is defined as the number of **failures** $Y$ observed before $r$ successes, so $Y \in \{0, 1, 2, \dots\}$.
Derive the PMF of $Y$ from first principles.

**Solution:**
Let $Y = y$ be the number of failures. The total number of trials conducted is $k = y + r$.
The final trial must be a success (the $r$-th success).
In the preceding $y + r - 1$ trials, there must be exactly $r - 1$ successes and $y$ failures in any order.
The number of ways to choose the positions of the $y$ failures is:
$$\binom{(y + r - 1)}{y} = \binom{y + r - 1}{r - 1}.$$
The probability of any such sequence is $p^r (1 - p)^y$.
Therefore:
$$p_Y(y) = \binom{y + r - 1}{y} p^r (1 - p)^y = \binom{y + r - 1}{r - 1} p^r (1 - p)^y, \quad y \in \{0, 1, 2, \dots\}. \quad \blacksquare$$

---

### Exercise 5.6: The Skellam Distribution (Difference of Two Poissons)
**Problem:** Let $X \sim \text{Pois}(\lambda_1)$ and $Y \sim \text{Pois}(\lambda_2)$ be independent Poisson variables.
Formulate the probability that $X = Y$ (a tied score in sports modeling).

**Solution:**
The event $\{X = Y\}$ can occur when $X = k$ and $Y = k$ for any integer $k \ge 0$.
By independence:
$$P(X = Y) = \sum_{k=0}^\infty P(X = k) P(Y = k) = \sum_{k=0}^\infty \left(\frac{\lambda_1^k e^{-\lambda_1}}{k!}\right) \left(\frac{\lambda_2^k e^{-\lambda_2}}{k!}\right) = e^{-(\lambda_1 + \lambda_2)} \sum_{k=0}^\infty \frac{(\lambda_1 \lambda_2)^k}{(k!)^2}.$$
Using the mathematical identity for the Modified Bessel Function of the first kind of order 0:
$$I_0(z) = \sum_{k=0}^\infty \frac{(z/2)^{2k}}{(k!)^2}.$$
Setting $z = 2\sqrt{\lambda_1 \lambda_2}$:
$$P(X = Y) = e^{-(\lambda_1 + \lambda_2)} I_0(2\sqrt{\lambda_1 \lambda_2}). \quad \blacksquare$$

---

### Exercise 5.7: Geometric Mean and Variance via Infinite Series
**Problem:** Prove directly from the PMF $p(k) = (1 - p)^{k - 1} p$ that $E[X] = \frac{1}{p}$.

**Solution:**
By definition of expectation:
$$E[X] = \sum_{k=1}^\infty k (1 - p)^{k - 1} p = p \sum_{k=1}^\infty k q^{k - 1}, \quad \text{where } q = 1 - p.$$
Notice that $k q^{k - 1} = \frac{d}{dq} (q^k)$.
Interchanging summation and differentiation for $|q| < 1$:
$$\sum_{k=1}^\infty k q^{k - 1} = \frac{d}{dq} \left( \sum_{k=0}^\infty q^k \right) = \frac{d}{dq} \left( \frac{1}{1 - q} \right) = \frac{1}{(1 - q)^2}.$$
Since $1 - q = p$:
$$\sum_{k=1}^\infty k q^{k - 1} = \frac{1}{p^2}.$$
Multiplying by $p$:
$$E[X] = p \times \frac{1}{p^2} = \frac{1}{p}. \quad \blacksquare$$

---

### Exercise 5.8: Probability Generating Function of the Binomial Distribution
**Problem:** The Probability Generating Function (PGF) of a non-negative discrete random variable is defined as $G_X(s) = E[s^X] = \sum_{k=0}^\infty p_X(k) s^k$.
Derive $G_X(s)$ for $X \sim \text{Bin}(n, p)$.

**Solution:**
$$G_X(s) = \sum_{k=0}^n \binom{n}{k} p^k (1 - p)^{n - k} s^k = \sum_{k=0}^n \binom{n}{k} (ps)^k (1 - p)^{n - k}.$$
By the Binomial Theorem:
$$G_X(s) = (ps + 1 - p)^n = (q + ps)^n, \quad \text{where } q = 1 - p. \quad \blacksquare$$

---

### Exercise 5.9: The Poisson Splitting Theorem
**Problem:** Events arrive according to a Poisson process $N \sim \text{Pois}(\lambda)$. Each event is independently classified as Type 1 with probability $p$ and Type 2 with probability $1 - p$.
Prove that the number of Type 1 events $N_1$ follows $\text{Pois}(\lambda p)$ and is stochastically independent of the number of Type 2 events $N_2$.

**Solution:**
Condition on the total number of events $N = n$:
Given $N = n$, $N_1 \sim \text{Bin}(n, p)$ and $N_2 = n - N_1$.
By the Law of Total Probability:
$$P(N_1 = j, N_2 = k) = P(N_1 = j, N_2 = k \mid N = j + k) P(N = j + k).$$
$$P(N_1 = j, N_2 = k) = \left[ \binom{j + k}{j} p^j (1 - p)^k \right] \times \left[ \frac{\lambda^{j + k} e^{-\lambda}}{(j + k)!} \right].$$
Expanding the binomial coefficient:
$$P(N_1 = j, N_2 = k) = \frac{(j + k)!}{j! k!} p^j (1 - p)^k \frac{\lambda^j \lambda^k e^{-\lambda p} e^{-\lambda (1 - p)}}{(j + k)!}.$$
The $(j + k)!$ factor cancels out cleanly:
$$P(N_1 = j, N_2 = k) = \left( \frac{(\lambda p)^j e^{-\lambda p}}{j!} \right) \times \left( \frac{(\lambda(1 - p))^k e^{-\lambda(1 - p)}}{k!} \right).$$
The joint distribution factors into the product of two marginal Poisson PMFs:
$$P(N_1 = j, N_2 = k) = P(N_1 = j) P(N_2 = k).$$
Thus, $N_1 \sim \text{Pois}(\lambda p)$, $N_2 \sim \text{Pois}(\lambda(1 - p))$, and $N_1 \perp N_2$. $\blacksquare$

---

### Exercise 5.10: Poisson Tail Concentration Bound
**Problem:** Using Markov's inequality applied to the moment generating function, prove that for $X \sim \text{Pois}(\lambda)$ and any $t > 1$:
$$P(X \ge t\lambda) \le \exp(-\lambda(t \ln t - t + 1)).$$

**Solution:**
The Moment Generating Function of a Poisson variable is:
$$M_X(s) = E[e^{sX}] = \exp(\lambda(e^s - 1)).$$
Applying Chernoff's bounding technique for any $s > 0$:
$$P(X \ge a) = P(e^{sX} \ge e^{sa}) \le \frac{E[e^{sX}]}{e^{sa}} = \exp(\lambda(e^s - 1) - sa).$$
Setting $a = t\lambda$:
$$P(X \ge t\lambda) \le \exp(\lambda(e^s - 1) - st\lambda) = \exp(\lambda(e^s - 1 - st)).$$
To minimize the upper bound, optimize over $s > 0$:
$$\frac{d}{ds} (e^s - 1 - st) = e^s - t = 0 \implies s^* = \ln t.$$
Since $t > 1$, $s^* > 0$.
Substituting $s^* = \ln t$:
$$e^{s^*} - 1 - s^* t = t - 1 - t \ln t = -(t \ln t - t + 1).$$
Exponentiating:
$$P(X \ge t\lambda) \le \exp(-\lambda(t \ln t - t + 1)). \quad \blacksquare$$
