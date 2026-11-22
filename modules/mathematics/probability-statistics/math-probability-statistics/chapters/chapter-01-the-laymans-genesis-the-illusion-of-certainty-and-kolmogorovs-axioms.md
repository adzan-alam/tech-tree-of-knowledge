# Chapter 1: The Layman's Genesis: The Illusion of Certainty and Kolmogorov's Axioms

## 1.1 The Illusion of Determinism and the Genesis of Probability

For millennia, human philosophy and early mechanics operated under the intoxicating premise of absolute determinism. In its classical culmination, Pierre-Simon Laplace articulated the pinnacle of clockwork physical determinism in his 1814 philosophical essay:

> *"An intellect which at a certain moment would know all forces that set nature in motion, and all positions of all items of which nature is composed, if this intellect were also vast enough to submit these data to analysis, it would embrace in a single formula the movements of the greatest bodies of the universe and those of the tiniest atom; for such an intellect nothing would be uncertain and the future just like the past would be present before its eyes."*
> — Pierre-Simon Laplace, *A Philosophical Essay on Probabilities* (1814)

This theoretical construct—subsequently known as **Laplace's Demon**—asserted that uncertainty is never an intrinsic property of the physical universe, but merely a confession of human epistemic ignorance. If one could measure the exact coordinates, linear momenta, micro-surface friction, and atmospheric drag of a tossed brass coin, Newtonian mechanics guarantees that the outcome ($ \text{Heads} $ or $ \text{Tails} $) is predetermined from the millisecond it breaks contact with the thumb.

Yet, as mathematics, thermodynamics, and dynamical systems evolved across the 19th and 20th centuries, this illusion of clockwork certainty collapsed under three insurmountable pillars:

```
+---------------------------------------------------------------------------------------------------+
|                            THE COLLAPSE OF LAPLACIAN DETERMINISM                                  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. NONLINEAR DYNAMICS & CHAOS THEORY (Poincaré, Lorenz)                                          |
|     - Deterministic equations can exhibit exponential sensitivity to initial conditions.         |
|     - Lyapunov exponent λ > 0 implies trajectory divergence: Δx(t) ~ Δx(0) * e^(λt).              |
|     - Infinitesimally unmeasurable thermal fluctuations amplify into macroscopic divergence.     |
|                                                                                                   |
|  2. STATISTICAL MECHANICS & MACROSCOPIC AGGREGATION (Boltzmann, Gibbs)                            |
|     - A single mole of ideal gas contains N_A ≈ 6.022 x 10^23 particles.                          |
|     - Tracking 6N phase-space coordinates is computationally impossible for any physical computer.|
|     - Macroscopic state variables (Pressure, Temperature, Entropy) are fundamentally statistical.|
|                                                                                                   |
|  3. QUANTUM MECHANICAL INDETERMINACY (Heisenberg, Born)                                           |
|     - Intrinsic ontological indeterminacy at microscopic scales.                                  |
|     - Wavefunction collapse follows Born's probabilistic rule: P(x ∈ [a, b]) = ∫ |ψ(x)|^2 dx.     |
|     - Uncertainty is not merely an observer defect; it is woven into the fabric of reality.       |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

Probability theory is the mathematical calculus developed to tame, quantify, and reason rigorously about this inescapable uncertainty. Rather than surrendering to chaotic ignorance, probability constructs a precise language of degrees of belief, stochastic frequencies, and expectation invariants.

---

## 1.2 Historical Paradoxes: Why Intuition Fails Without Formal Axioms

Before probability was anchored in rigorous mathematics, early pioneers relied on qualitative intuition and naive counting. The human brain, evolved for linear pattern recognition in immediate ancestral environments, suffers systematic cognitive biases when assessing compounding risks, geometric probabilities, and conditional observations.

### 1. Chevalier de Méré's Gambling Dilemma (1654)
In 1654, the French nobleman and seasoned gambler Antoine Gombaud, Chevalier de Méré, approached the mathematicians Blaise Pascal and Pierre de Fermat with a perplexing betting contradiction.

Under established 17th-century gambling custom, de Méré bet that he could roll at least one $6$ in $4$ tosses of a fair six-sided die. His practical experience showed this bet to be consistently profitable. Using naive linear proportional reasoning, he calculated:
- The chance of rolling a $6$ on one roll is $\frac{1}{6}$.
- Therefore, in $4$ rolls, the expected chance of getting at least one $6$ appeared to be $4 \times \frac{1}{6} = \frac{4}{6} = \frac{2}{3} \approx 66.7\%$.

Emboldened by this success, de Méré devised a new game: betting that he would roll at least one double-six ($ (6, 6) $) in $24$ tosses of a pair of fair dice. By his naive linear rule:
- There are $6 \times 6 = 36$ distinct outcomes for two dice. The chance of a double-six on a single toss is $\frac{1}{36}$.
- In $24$ tosses, he reasoned the chance should be $24 \times \frac{1}{36} = \frac{24}{36} = \frac{2}{3}$.

To his financial dismay, de Méré began steadily losing money on the $24$-roll double-six bet. He claimed that the arithmetic of dice was broken.

Pascal and Fermat analyzed the problem by considering the **complementary event** (the probability of *never* rolling the target):

#### The 4-Roll Single Die Game:
The probability of failing to roll a $6$ in a single toss is $\frac{5}{6}$. Because the rolls are stochastically independent, the probability of failing $4$ consecutive times is:
$$P(\text{No } 6 \text{ in } 4 \text{ rolls}) = \left(\frac{5}{6}\right)^4 = \frac{625}{1296} \approx 0.48225.$$
Applying the complement rule:
$$P(\text{At least one } 6) = 1 - \left(\frac{5}{6}\right)^4 = 1 - 0.48225 = 0.51775 \approx 51.78\%.$$
Because $51.78\% > 50\%$, the game has a positive expected value, confirming de Méré's profit.

#### The 24-Roll Double Dice Game:
The probability of failing to roll a double-six in a single toss of two dice is $\frac{35}{36}$. In $24$ independent tosses:
$$P(\text{No } (6, 6) \text{ in } 24 \text{ rolls}) = \left(\frac{35}{36}\right)^{24} \approx 0.508596.$$
Therefore:
$$P(\text{At least one } (6, 6)) = 1 - \left(\frac{35}{36}\right)^{24} \approx 1 - 0.508596 = 0.491404 \approx 49.14\%.$$
Because $49.14\% < 50\%$, the game has a negative expected return. In $1,000$ games at \$1 per game, de Méré loses on average \$17.19. Naive linear addition failed because probabilities of overlapping events are not disjoint!

---

### 2. The Monty Hall Dilemma
On the American television game show *Let's Make a Deal*, hosted by Monty Hall, a contestant faces three closed doors:
- Behind one door is a luxury sports car.
- Behind the other two doors are goats.

The game proceeds as follows:
1. The contestant chooses Door 1.
2. Monty Hall, who knows what is behind every door, opens one of the remaining doors (say, Door 3), revealing a goat.
3. Monty asks: *"Do you want to stick with Door 1, or switch to Door 2?"*

Intuition overwhelmingly suggests that switching is irrelevant: with two unopened doors remaining, each door surely has a $50/50$ chance. Even prominent mathematicians famously asserted this fallacy when Marilyn vos Savant published the correct solution in 1990.

The formal resolution rests on **conditional probability and information partitioning**:
- Let $C \in \{1, 2, 3\}$ be the door concealing the car ($P(C = 1) = P(C = 2) = P(C = 3) = \frac{1}{3}$).
- Let the contestant choose Door 1. The prior probability that the car is behind Door 1 is:
  $$P(C = 1) = \frac{1}{3}.$$
- The probability that the car is behind *either* Door 2 or Door 3 is:
  $$P(C \in \{2, 3\}) = \frac{2}{3}.$$
- Crucially, Monty cannot open Door 1, and Monty cannot open the door concealing the car. Monty's action is constrained:
  - If the car is behind Door 1 (prob $\frac{1}{3}$), Monty flips a coin and opens Door 2 or 3. If you switch, you lose.
  - If the car is behind Door 2 (prob $\frac{1}{3}$), Monty is *forced* to open Door 3. If you switch to Door 2, you win.
  - If the car is behind Door 3 (prob $\frac{1}{3}$), Monty is *forced* to open Door 2. If you switch to Door 2, you win.
- By switching, the contestant captures the entire $\frac{2}{3}$ probability mass originally residing across $\{2, 3\}$, channeled entirely onto the remaining unopened door! Switching doubles the win probability from $33.3\%$ to $66.7\%$.

---

### 3. Bertrand's Paradox (1889): The Danger of Undefined Continuums
Joseph Bertrand demonstrated in 1889 that without a rigorous measure space, asking for the "probability" of an event on a continuous infinite set is mathematically ill-posed.

Consider an equilateral triangle inscribed inside a circle of radius $R$. Suppose a chord of the circle is chosen "at random". What is the probability that the chord is longer than the side of the inscribed equilateral triangle ($L = \sqrt{3}R$)?

```
     Method 1: Random Endpoints         Method 2: Random Radius          Method 3: Random Midpoint
          P = 1/3 ≈ 0.333                   P = 1/2 = 0.500                  P = 1/4 = 0.250
```

1. **Method 1 (Random Endpoints):** Fix one endpoint of the chord at a triangle vertex. The second endpoint is chosen uniformly along the circle circumference. A regular inscribed triangle divides the circumference into three equal arcs of $120^\circ$. A chord is longer than $\sqrt{3}R$ if and only if its second endpoint falls in the opposite $120^\circ$ arc. Therefore:
   $$P = \frac{120^\circ}{360^\circ} = \frac{1}{3}.$$

2. **Method 2 (Random Radial Distance):** Choose a radius uniformly at random, and choose a point along this radius uniformly at distance $r \in [0, R]$. Construct the chord perpendicular to the radius at this point. The distance from the center to any side of the inscribed triangle is $\frac{R}{2}$. The chord is longer than $\sqrt{3}R$ if and only if $r < \frac{R}{2}$. Therefore:
   $$P = \frac{R/2}{R} = \frac{1}{2}.$$

3. **Method 3 (Random Midpoint inside the Disc):** A chord is uniquely determined by its midpoint. Choose a point uniformly at random within the interior of the circle of radius $R$. A chord is longer than $\sqrt{3}R$ if and only if its midpoint falls inside the concentric circle inscribed within the equilateral triangle, which has radius $\frac{R}{2}$. The ratio of areas is:
   $$P = \frac{\pi (R/2)^2}{\pi R^2} = \frac{1}{4}.$$

Three completely defensible intuitive interpretations yielded three mutually contradictory answers ($\frac{1}{3}, \frac{1}{2}, \frac{1}{4}$). Bertrand's paradox proved that in continuous domains, "at random" is completely undefined until one formally specifies the underlying **measure space** and transformation invariance group (e.g., translation and rotation invariance, as Edwin Jaynes later proved selects Method 2 under maximum entropy).

---

## 1.3 Measure-Theoretic Foundations: The Probability Space $(\Omega, \mathcal{F}, P)$

To eliminate paradoxes and establish probability as a rigorous branch of pure mathematics on par with Euclidean geometry and real analysis, the Russian mathematician **Andrey Kolmogorov** published *Foundations of the Theory of Probability* (*Grundbegriffe der Wahrscheinlichkeitsrechnung*) in 1933.

Kolmogorov grounded probability in Henri Lebesgue's **measure theory**. A rigorous probabilistic model consists of an immutable mathematical triplet known as a **Probability Space**:
$$(\Omega, \mathcal{F}, P)$$

```
+---------------------------------------------------------------------------------------------------+
|                               THE PROBABILITY SPACE TRIPLET                                       |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. SAMPLE SPACE (Ω):                                                                             |
|     The set of all possible elementary outcomes ω.                                                |
|     - Discrete & Finite: Ω = {1, 2, 3, 4, 5, 6} (Die roll)                                        |
|     - Discrete & Infinite: Ω = {0, 1, 2, ...} (Poisson packet arrivals)                           |
|     - Continuous & Uncountable: Ω = ℝ (Thermal sensor noise) or Ω = [0, 1]^3 (Spatial volume)     |
|                                                                                                   |
|  2. σ-ALGEBRA (F):                                                                                |
|     The collection of valid "measurable events" (subsets of Ω) to which probabilities can be      |
|     assigned without logical contradiction.                                                       |
|     - Must be closed under complementation: A ∈ F ⇒ A^c ∈ F                                       |
|     - Must be closed under countable unions: A_1, A_2, ... ∈ F ⇒ ⋃ A_i ∈ F                        |
|                                                                                                   |
|  3. PROBABILITY MEASURE (P):                                                                      |
|     A real-valued function P: F → [0, 1] mapping events to certainty weights.                    |
|     - Governed strictly by Kolmogorov's Three Axioms.                                             |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Why Not Assign Probabilities to All Subsets ($2^\Omega$)?
For finite or countably infinite sample spaces, the $\sigma$-algebra $\mathcal{F}$ can indeed be chosen as the entire power set $\mathcal{P}(\Omega) = 2^\Omega$.

However, for uncountably infinite spaces such as the real line $\Omega = \mathbb{R}$ or the unit interval $[0, 1]$, Giuseppe Vitali proved in 1905 that assuming the **Axiom of Choice**, it is mathematically impossible to construct a translation-invariant probability measure that assigns a consistent probability to *every* arbitrary subset of $[0, 1]$ while preserving countable additivity!

Non-measurable pathological sets (such as the **Vitali set**) create paradoxes where an uncountable set can be decomposed into disjoint congruent pieces that sum to contradictory values (the celebrated **Banach-Tarski Paradox** in $\mathbb{R}^3$).

Thus, modern mathematics defines $\mathcal{F}$ as the **Borel $\sigma$-algebra** $\mathcal{B}(\mathbb{R})$, which is the smallest $\sigma$-algebra generated by all open intervals $(a, b) \subset \mathbb{R}$. The Borel $\sigma$-algebra contains all singletons, open sets, closed sets, compact sets, countable unions, and intersections encountered in physical reality, while safely excluding non-measurable pathological sets.

---

## 1.4 The Three Kolmogorov Axioms

Let $\Omega$ be a sample space and $\mathcal{F}$ be a valid $\sigma$-algebra over $\Omega$. A function $P: \mathcal{F} \to \mathbb{R}$ is a **Probability Measure** if and only if it satisfies the following three foundational axioms:

### Axiom 1: Non-Negativity
For every event $A \in \mathcal{F}$:
$$P(A) \ge 0$$
*Physical Interpretation:* Probabilities cannot be negative. Negative quantities of certainty are physically meaningless in classical probability.

### Axiom 2: Normalization (Unit Measure)
The probability of the entire sample space $\Omega$ is unity:
$$P(\Omega) = 1$$
*Physical Interpretation:* The universe of discourse is complete. When an experiment is conducted, *some* outcome in $\Omega$ is guaranteed to occur.

### Axiom 3: Countable Additivity ($\sigma$-Additivity)
If $A_1, A_2, A_3, \dots$ is a countable sequence of pairwise disjoint (mutually exclusive) events in $\mathcal{F}$—meaning $A_i \cap A_j = \emptyset$ whenever $i \ne j$—then:
$$P\left(\bigcup_{i=1}^\infty A_i\right) = \sum_{i=1}^\infty P(A_i)$$
*Physical Interpretation:* If events share no common outcomes, the probability that at least one of them occurs is simply the infinite sum of their individual probabilities.

---

## 1.5 Rigorous Theorems and Corollaries Derived from the Axioms

Every theorem, formula, and statistical distribution in classical probability theory is derived purely from these three axioms. Below are the foundational theorems proven strictly from first principles.

### Theorem 1.1: Probability of the Impossible Event ($\emptyset$)
$$P(\emptyset) = 0$$

*Proof:*
Consider the countable sequence of events where $A_1 = \Omega$, and $A_i = \emptyset$ for all $i \ge 2$.
Because $\Omega \cap \emptyset = \emptyset$, these events are pairwise disjoint.
Their infinite union is:
$$\bigcup_{i=1}^\infty A_i = \Omega \cup \emptyset \cup \emptyset \cup \dots = \Omega.$$
Applying Axiom 3 (Countable Additivity):
$$P(\Omega) = P\left(\bigcup_{i=1}^\infty A_i\right) = P(\Omega) + \sum_{i=2}^\infty P(\emptyset).$$
By Axiom 2, $P(\Omega) = 1$:
$$1 = 1 + \sum_{i=2}^\infty P(\emptyset) \implies \sum_{i=2}^\infty P(\emptyset) = 0.$$
By Axiom 1, $P(\emptyset) \ge 0$. An infinite series of non-negative real numbers can sum to zero if and only if every term is identically zero. Therefore:
$$P(\emptyset) = 0. \quad \blacksquare$$

### Theorem 1.2: Finite Additivity
For any finite sequence of $n$ mutually disjoint events $A_1, A_2, \dots, A_n$:
$$P\left(\bigcup_{i=1}^n A_i\right) = \sum_{i=1}^n P(A_i)$$

*Proof:*
Define an infinite sequence $B_1, B_2, \dots$ where $B_i = A_i$ for $1 \le i \le n$, and $B_i = \emptyset$ for all $i > n$.
All $B_i$ are pairwise disjoint.
Applying Axiom 3 and Theorem 1.1:
$$P\left(\bigcup_{i=1}^n A_i\right) = P\left(\bigcup_{i=1}^\infty B_i\right) = \sum_{i=1}^\infty P(B_i) = \sum_{i=1}^n P(A_i) + \sum_{i=n+1}^\infty P(\emptyset) = \sum_{i=1}^n P(A_i) + 0 = \sum_{i=1}^n P(A_i). \quad \blacksquare$$

### Theorem 1.3: The Complement Rule
For any event $A \in \mathcal{F}$, its complement $A^c = \Omega \setminus A$ satisfies:
$$P(A^c) = 1 - P(A)$$

*Proof:*
By definition of set complement, $A \cup A^c = \Omega$ and $A \cap A^c = \emptyset$.
Because $A$ and $A^c$ are disjoint, we apply Theorem 1.2 (Finite Additivity for $n = 2$):
$$P(A \cup A^c) = P(A) + P(A^c).$$
Substituting $P(A \cup A^c) = P(\Omega) = 1$ from Axiom 2:
$$1 = P(A) + P(A^c) \implies P(A^c) = 1 - P(A). \quad \blacksquare$$

### Theorem 1.4: Monotonicity
If $A, B \in \mathcal{F}$ and $A \subseteq B$, then:
$$P(B \setminus A) = P(B) - P(A), \quad \text{and} \quad P(A) \le P(B)$$

*Proof:*
The set $B$ can be decomposed into two disjoint sets: $B = A \cup (B \setminus A)$, where $A \cap (B \setminus A) = \emptyset$.
By finite additivity:
$$P(B) = P(A) + P(B \setminus A) \implies P(B \setminus A) = P(B) - P(A).$$
By Axiom 1, $P(B \setminus A) \ge 0$. Therefore:
$$P(B) - P(A) \ge 0 \implies P(A) \le P(B). \quad \blacksquare$$

### Theorem 1.5: Universal Probability Boundedness
For every event $A \in \mathcal{F}$:
$$0 \le P(A) \le 1$$

*Proof:*
For any event $A$, $\emptyset \subseteq A \subseteq \Omega$.
Applying Monotonicity (Theorem 1.4):
$$P(\emptyset) \le P(A) \le P(\Omega).$$
Substituting $P(\emptyset) = 0$ (Theorem 1.1) and $P(\Omega) = 1$ (Axiom 2):
$$0 \le P(A) \le 1. \quad \blacksquare$$

### Theorem 1.6: The Inclusion-Exclusion Principle (Two Events)
For any two arbitrary events $A, B \in \mathcal{F}$ (not necessarily disjoint):
$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

*Proof:*
We partition $A \cup B$ into three mutually disjoint subsets:
1. $A \setminus B = A \cap B^c$ (outcomes in $A$ only)
2. $B \setminus A = B \cap A^c$ (outcomes in $B$ only)
3. $A \cap B$ (outcomes in both $A$ and $B$)

Notice that:
- $A \cup B = (A \setminus B) \cup (B \setminus A) \cup (A \cap B)$
- $A = (A \setminus B) \cup (A \cap B)$
- $B = (B \setminus A) \cup (A \cap B)$

By finite additivity on disjoint sets:
$$P(A) = P(A \setminus B) + P(A \cap B) \implies P(A \setminus B) = P(A) - P(A \cap B)$$
$$P(B) = P(B \setminus A) + P(A \cap B) \implies P(B \setminus A) = P(B) - P(A \cap B)$$

Now, applying finite additivity to the disjoint decomposition of $A \cup B$:
$$P(A \cup B) = P(A \setminus B) + P(B \setminus A) + P(A \cap B)$$
Substituting our expressions:
$$P(A \cup B) = [P(A) - P(A \cap B)] + [P(B) - P(A \cap B)] + P(A \cap B) = P(A) + P(B) - P(A \cap B). \quad \blacksquare$$

### Theorem 1.7: Boole's Inequality (The Union Bound)
For any countable collection of events $A_1, A_2, A_3, \dots$:
$$P\left(\bigcup_{i=1}^\infty A_i\right) \le \sum_{i=1}^\infty P(A_i)$$

*Proof:*
Construct a disjointified sequence of sets $E_1, E_2, E_3, \dots$ defined as:
- $E_1 = A_1$
- $E_2 = A_2 \setminus A_1$
- $E_3 = A_3 \setminus (A_1 \cup A_2)$
- In general, $E_k = A_k \setminus \left(\bigcup_{j=1}^{k-1} A_j\right)$.

By construction:
1. The sets $E_k$ are pairwise disjoint.
2. $\bigcup_{k=1}^\infty E_k = \bigcup_{k=1}^\infty A_k$.
3. $E_k \subseteq A_k$ for every $k$.

By Monotonicity (Theorem 1.4), $P(E_k) \le P(A_k)$.
Applying Axiom 3 to the disjoint sets $E_k$:
$$P\left(\bigcup_{i=1}^\infty A_i\right) = P\left(\bigcup_{k=1}^\infty E_k\right) = \sum_{k=1}^\infty P(E_k) \le \sum_{k=1}^\infty P(A_k). \quad \blacksquare$$

### Theorem 1.8: Continuity of Probability Measures
1. **Continuity from Below:** If $A_1 \subseteq A_2 \subseteq A_3 \subseteq \dots$ is an increasing sequence of events such that $A_n \uparrow A = \bigcup_{n=1}^\infty A_n$, then:
   $$\lim_{n \to \infty} P(A_n) = P(A)$$
2. **Continuity from Above:** If $B_1 \supseteq B_2 \supseteq B_3 \supseteq \dots$ is a decreasing sequence of events such that $B_n \downarrow B = \bigcap_{n=1}^\infty B_n$, then:
   $$\lim_{n \to \infty} P(B_n) = P(B)$$

*Proof:*
To prove (1), define disjoint increments: $C_1 = A_1$, and $C_k = A_k \setminus A_{k-1}$ for $k \ge 2$.
Then $A_n = \bigcup_{k=1}^n C_k$ and $A = \bigcup_{k=1}^\infty C_k$.
By finite additivity: $P(A_n) = \sum_{k=1}^n P(C_k)$.
By Axiom 3: $P(A) = \sum_{k=1}^\infty P(C_k)$.
By definition of infinite series convergence:
$$\lim_{n \to \infty} P(A_n) = \lim_{n \to \infty} \sum_{k=1}^n P(C_k) = \sum_{k=1}^\infty P(C_k) = P(A). \quad \blacksquare$$
Part (2) follows immediately by De Morgan's Laws and the complement rule.

---

## 1.6 Worked Examples: First-Principles Solutions

---

### Example 1.1: Chevalier de Méré's Critical Tossing Threshold
**Problem:** In gambling with two fair dice, Chevalier de Méré sought the minimum number of independent rolls $n$ required so that the probability of rolling at least one double-six ($ (6, 6) $) is strictly greater than $50\%$ ($P > 0.5$).
1. Derive the analytical inequality for $n$.
2. Compute the exact minimum integer $n^*$.
3. Compare with de Méré's naive linear estimate of $n = 24$.

**Solution:**
1. The sample space for rolling two fair dice consists of $|\Omega| = 6 \times 6 = 36$ equally likely ordered pairs $(i, j)$ with $i, j \in \{1, \dots, 6\}$.
The event $E = \{(6, 6)\}$ has probability:
$$P(E) = \frac{1}{36}.$$
The complement event $E^c$ (no double-six on a single roll) has probability:
$$P(E^c) = 1 - P(E) = 1 - \frac{1}{36} = \frac{35}{36}.$$
For $n$ stochastically independent rolls, the probability of obtaining no double-six on any roll is:
$$P(\text{No double-six in } n \text{ rolls}) = \left(\frac{35}{36}\right)^n.$$
Using the complement rule (Theorem 1.3), the probability of at least one double-six is:
$$P(\text{At least one } (6, 6)) = 1 - \left(\frac{35}{36}\right)^n.$$
We require:
$$1 - \left(\frac{35}{36}\right)^n > 0.5 \iff \left(\frac{35}{36}\right)^n < 0.5.$$

2. Taking the natural logarithm of both sides (reversing the inequality because $\ln(35/36) < 0$):
$$n \ln\left(\frac{35}{36}\right) < \ln(0.5) \iff n > \frac{\ln(0.5)}{\ln(35/36)}.$$
Evaluating numerically:
$$\ln(0.5) \approx -0.693147$$
$$\ln(35/36) = \ln(35) - \ln(36) \approx 3.555348 - 3.583519 = -0.028171$$
$$n > \frac{-0.693147}{-0.028171} \approx 24.605.$$
Because $n$ must be an integer, the smallest integer satisfying the inequality is:
$$n^* = \lceil 24.605 \rceil = 25.$$

3. **Comparison:** For $n = 24$:
$$P = 1 - \left(\frac{35}{36}\right)^{24} \approx 1 - 0.508596 = 0.491404 \approx 49.14\% < 50\%.$$
For $n = 25$:
$$P = 1 - \left(\frac{35}{36}\right)^{25} \approx 1 - 0.494468 = 0.505532 \approx 50.55\% > 50\%.$$
De Méré's naive linear calculation ($24 \times \frac{1}{36} = \frac{2}{3} \approx 66.7\%$) overlooked that overlapping occurrences across trials cannot be linearly summed without subtracting intersection terms. At $n = 24$, the gambler has a $49.14\%$ chance, explaining his steady losses. Exactly $25$ rolls are required to turn the odds in his favor.

---

### Example 1.2: Rigorous Verification of a $\sigma$-Algebra
**Problem:** Let the sample space be $\Omega = \{a, b, c, d\}$. Determine whether the following collections of subsets qualify as valid $\sigma$-algebras over $\Omega$:
1. $\mathcal{F}_1 = \{\emptyset, \{a\}, \{b, c, d\}, \Omega\}$
2. $\mathcal{F}_2 = \{\emptyset, \{a, b\}, \{c, d\}, \Omega\}$
3. $\mathcal{F}_3 = \{\emptyset, \{a\}, \{b\}, \{a, b\}, \{c, d\}, \{a, c, d\}, \{b, c, d\}, \Omega\}$
4. $\mathcal{F}_4 = \{\emptyset, \{a\}, \{b\}, \{a, b\}, \Omega\}$

**Solution:**
A collection $\mathcal{F} \subseteq 2^\Omega$ is a $\sigma$-algebra if and only if:
- **Condition 1:** $\emptyset \in \mathcal{F}$ and $\Omega \in \mathcal{F}$.
- **Condition 2 (Complement Closure):** If $A \in \mathcal{F}$, then $A^c = \Omega \setminus A \in \mathcal{F}$.
- **Condition 3 (Countable Union Closure):** If $A_1, A_2, \dots \in \mathcal{F}$, then $\bigcup_{i=1}^\infty A_i \in \mathcal{F}$. (For finite sets, closure under finite unions is equivalent).

1. **For $\mathcal{F}_1$:**
   - $\emptyset, \Omega \in \mathcal{F}_1$ (Satisfied).
   - Complements: $\emptyset^c = \Omega \in \mathcal{F}_1$, $\{a\}^c = \{b, c, d\} \in \mathcal{F}_1$, $\{b, c, d\}^c = \{a\} \in \mathcal{F}_1$. (Satisfied).
   - Unions: $\{a\} \cup \{b, c, d\} = \Omega \in \mathcal{F}_1$. All unions trivial. (Satisfied).
   - **Conclusion:** $\mathcal{F}_1$ is a valid $\sigma$-algebra (the smallest $\sigma$-algebra containing $\{a\}$).

2. **For $\mathcal{F}_2$:**
   - $\emptyset, \Omega \in \mathcal{F}_2$.
   - Complements: $\{a, b\}^c = \{c, d\} \in \mathcal{F}_2$.
   - Unions: $\{a, b\} \cup \{c, d\} = \Omega \in \mathcal{F}_2$.
   - **Conclusion:** $\mathcal{F}_2$ is a valid $\sigma$-algebra.

3. **For $\mathcal{F}_3$:**
   - Contains 8 elements ($2^3$).
   - Check complements:
     - $\{a\}^c = \{b, c, d\} \in \mathcal{F}_3$.
     - $\{b\}^c = \{a, c, d\} \in \mathcal{F}_3$.
     - $\{a, b\}^c = \{c, d\} \in \mathcal{F}_3$.
   - Check unions:
     - $\{a\} \cup \{b\} = \{a, b\} \in \mathcal{F}_3$.
     - $\{a\} \cup \{c, d\} = \{a, c, d\} \in \mathcal{F}_3$.
     - $\{b\} \cup \{c, d\} = \{b, c, d\} \in \mathcal{F}_3$.
   - **Conclusion:** $\mathcal{F}_3$ is a valid $\sigma$-algebra (generated by the partition $\{\{a\}, \{b\}, \{c, d\}\}$).

4. **For $\mathcal{F}_4$:**
   - Notice that $\{a\} \in \mathcal{F}_4$, but its complement $\{a\}^c = \{b, c, d\} \notin \mathcal{F}_4$.
   - Similarly, $\{b\} \in \mathcal{F}_4$, but $\{a, c, d\} \notin \mathcal{F}_4$.
   - **Conclusion:** $\mathcal{F}_4$ fails complement closure. **Not a $\sigma$-algebra.**

---

### Example 1.3: Fréchet Probability Bounds for Two Events
**Problem:** In an autonomous vehicle sensor suite, let $A$ denote the event that the primary camera detects an obstacle ($P(A) = 0.85$), and let $B$ denote the event that the LIDAR detects an obstacle ($P(B) = 0.75$). No assumptions are made regarding sensor independence.
1. Derive and compute the sharpest possible lower and upper bounds for the probability that *both* sensors detect the obstacle ($P(A \cap B)$).
2. Derive and compute the sharpest bounds for the probability that *at least one* sensor detects the obstacle ($P(A \cup B)$).

**Solution:**
1. **Bounds for $P(A \cap B)$:**
   By the Inclusion-Exclusion Principle (Theorem 1.6):
   $$P(A \cup B) = P(A) + P(B) - P(A \cap B) \implies P(A \cap B) = P(A) + P(B) - P(A \cup B).$$
   Because $P(A \cup B) \le P(\Omega) = 1$ (Theorem 1.5):
   $$P(A \cap B) \ge P(A) + P(B) - 1.$$
   Furthermore, by Axiom 1, $P(A \cap B) \ge 0$. Thus:
   $$P(A \cap B) \ge \max(0, P(A) + P(B) - 1).$$
   This is known as the **Bonferroni / Fréchet lower bound**.
   Evaluating numerically:
   $$P(A \cap B) \ge \max(0, 0.85 + 0.75 - 1) = \max(0, 0.60) = 0.60.$$

   For the upper bound: because $A \cap B \subseteq A$ and $A \cap B \subseteq B$, Monotonicity (Theorem 1.4) dictates:
   $$P(A \cap B) \le P(A) \quad \text{and} \quad P(A \cap B) \le P(B) \implies P(A \cap B) \le \min(P(A), P(B)).$$
   Evaluating numerically:
   $$P(A \cap B) \le \min(0.85, 0.75) = 0.75.$$
   Therefore:
   $$0.60 \le P(A \cap B) \le 0.75.$$

2. **Bounds for $P(A \cup B)$:**
   Because $A \subseteq A \cup B$ and $B \subseteq A \cup B$:
   $$P(A \cup B) \ge \max(P(A), P(B)) = \max(0.85, 0.75) = 0.85.$$
   For the upper bound, by Boole's Inequality (Theorem 1.7) and Axiom 2:
   $$P(A \cup B) \le \min(1, P(A) + P(B)) = \min(1, 0.85 + 0.75) = \min(1, 1.60) = 1.00.$$
   Therefore:
   $$0.85 \le P(A \cup B) \le 1.00.$$

---

### Example 1.4: Inclusion-Exclusion for Three Intersecting Systems
**Problem:** A data center operates three parallel power supplies $A, B, C$. Over a 1-year period, the individual failure probabilities are:
$$P(A) = 0.08, \quad P(B) = 0.06, \quad P(C) = 0.05.$$
Joint failure probabilities due to common-cause thermal or electrical surges are:
$$P(A \cap B) = 0.02, \quad P(A \cap C) = 0.015, \quad P(B \cap C) = 0.012, \quad P(A \cap B \cap C) = 0.005.$$
1. Calculate the probability that *at least one* power supply fails during the year ($P(A \cup B \cup C)$).
2. Calculate the probability that *all three* power supplies continue to function without interruption.
3. Calculate the probability that *exactly one* power supply fails.

**Solution:**
1. Applying the Generalized Inclusion-Exclusion Principle for three events:
   $$P(A \cup B \cup C) = [P(A) + P(B) + P(C)] - [P(A \cap B) + P(A \cap C) + P(B \cap C)] + P(A \cap B \cap C).$$
   Summing individual probabilities:
   $$S_1 = 0.08 + 0.06 + 0.05 = 0.190.$$
   Summing pairwise intersections:
   $$S_2 = 0.020 + 0.015 + 0.012 = 0.047.$$
   Triple intersection:
   $$S_3 = 0.005.$$
   Therefore:
   $$P(A \cup B \cup C) = 0.190 - 0.047 + 0.005 = 0.148 \quad (14.8\%).$$

2. All three power supplies function if and only if no power supply fails, which is the complement $(A \cup B \cup C)^c$:
   $$P(\text{No failures}) = 1 - P(A \cup B \cup C) = 1 - 0.148 = 0.852 \quad (85.2\%).$$

3. The event that *exactly one* power supply fails can be expressed as:
   $$P(\text{Exactly 1}) = P(A \cap B^c \cap C^c) + P(A^c \cap B \cap C^c) + P(A^c \cap B^c \cap C).$$
   For component $A$ failing alone:
   $$P(A \cap B^c \cap C^c) = P(A) - P(A \cap B) - P(A \cap C) + P(A \cap B \cap C) = 0.08 - 0.02 - 0.015 + 0.005 = 0.050.$$
   For component $B$ failing alone:
   $$P(A^c \cap B \cap C^c) = P(B) - P(A \cap B) - P(B \cap C) + P(A \cap B \cap C) = 0.06 - 0.02 - 0.012 + 0.005 = 0.033.$$
   For component $C$ failing alone:
   $$P(A^c \cap B^c \cap C) = P(C) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C) = 0.05 - 0.015 - 0.012 + 0.005 = 0.028.$$
   Summing the three disjoint outcomes:
   $$P(\text{Exactly 1 failure}) = 0.050 + 0.033 + 0.028 = 0.111 \quad (11.1\%).$$

---

### Example 1.5: Continuity of Measure and Asymptotics on Continuous Domains
**Problem:** Let the sample space be the unit interval $\Omega = (0, 1]$ equipped with the standard Borel $\sigma$-algebra $\mathcal{B}((0, 1])$ and the uniform Lebesgue probability measure $P((a, b]) = b - a$ for $0 \le a \le b \le 1$.
Consider the sequence of events:
$$A_n = \left(\frac{1}{2n}, 1\right], \quad n = 1, 2, 3, \dots$$
1. Prove that $A_n$ is an increasing sequence of sets ($A_n \subseteq A_{n+1}$).
2. Determine the limit set $A = \bigcup_{n=1}^\infty A_n$.
3. Compute $\lim_{n \to \infty} P(A_n)$ directly and verify that it equals $P(A)$ using Theorem 1.8 (Continuity from Below).

**Solution:**
1. For any $n \ge 1$:
   $$\frac{1}{2(n+1)} < \frac{1}{2n}.$$
   Therefore, the interval $\left(\frac{1}{2(n+1)}, 1\right]$ strictly contains the interval $\left(\frac{1}{2n}, 1\right]$.
   Hence, $A_n \subset A_{n+1}$ for all $n \ge 1$, establishing that $A_n$ is an increasing sequence of events.

2. To find the limit set $A = \bigcup_{n=1}^\infty A_n$:
   A point $x \in (0, 1]$ belongs to $\bigcup_{n=1}^\infty A_n$ if and only if there exists some integer $n \ge 1$ such that $x > \frac{1}{2n}$.
   By the Archimedean property of the real numbers, for every $x > 0$, there exists an integer $n$ such that $n > \frac{1}{2x} \iff \frac{1}{2n} < x$.
   Thus, every $x \in (0, 1]$ is captured by some $A_n$.
   Therefore:
   $$A = \bigcup_{n=1}^\infty \left(\frac{1}{2n}, 1\right] = (0, 1] = \Omega.$$

3. By definition of Lebesgue measure on intervals:
   $$P(A_n) = 1 - \frac{1}{2n}.$$
   Taking the limit as $n \to \infty$:
   $$\lim_{n \to \infty} P(A_n) = \lim_{n \to \infty} \left(1 - \frac{1}{2n}\right) = 1 - 0 = 1.$$
   On the other hand, since $A = \Omega$, by Axiom 2:
   $$P(A) = P(\Omega) = 1.$$
   Thus, $\lim_{n \to \infty} P(A_n) = P\left(\bigcup_{n=1}^\infty A_n\right) = 1$, confirming Continuity from Below.

---

### Example 1.6: The Monty Hall Paradox with 4 Doors
**Problem:** In an expanded Monty Hall game with 4 closed doors ($1, 2, 3, 4$), one door conceals a sports car and the other three conceal goats.
1. The contestant chooses Door 1.
2. Monty Hall opens two doors revealing goats (say, Doors 3 and 4).
3. Monty offers the contestant the choice to stay with Door 1 or switch to Door 2.
Derive the exact probability of winning by staying versus switching.

**Solution:**
Let $C \in \{1, 2, 3, 4\}$ denote the door hiding the car. By uniform randomness:
$$P(C = 1) = P(C = 2) = P(C = 3) = P(C = 4) = \frac{1}{4}.$$
The contestant picks Door 1.
The prior probability that the car is behind Door 1 is:
$$P(\text{Win by Staying}) = P(C = 1) = \frac{1}{4}.$$
The complementary event that the car is behind one of the other three doors is:
$$P(C \in \{2, 3, 4\}) = 1 - P(C = 1) = 1 - \frac{1}{4} = \frac{3}{4}.$$
Monty Hall operates under strict host constraints:
- He cannot open the door chosen by the contestant (Door 1).
- He cannot open the door containing the car.
- He must open exactly two doors revealing goats.

Consider the conditional scenarios:
- **Case 1 ($C = 1$, probability $\frac{1}{4}$):** All three doors $\{2, 3, 4\}$ contain goats. Monty randomly selects two of them to open. If the contestant switches to the remaining door (Door 2), the contestant loses.
- **Case 2 ($C \in \{2, 3, 4\}$, probability $\frac{3}{4}$):**
  - If $C = 2$, Monty has no choice: he *must* open Doors 3 and 4. Switching to Door 2 wins.
  - If $C = 3$, Monty must open Doors 2 and 4. Switching to the remaining door (Door 3) wins.
  - If $C = 4$, Monty must open Doors 2 and 3. Switching to the remaining door (Door 4) wins.

In all cases where the car was originally among the three unchosen doors ($C \ne 1$), Monty's forced action reveals the other two goats, concentrating the entire $\frac{3}{4}$ probability mass onto the single unopened alternate door!
Therefore:
$$P(\text{Win by Switching}) = \frac{3}{4} = 75\%.$$
$$P(\text{Win by Staying}) = \frac{1}{4} = 25\%.$$
Switching triples the probability of winning from $25\%$ to $75\%$.

---

### Example 1.7: De Morgan's Laws and Complementation in Multi-Stage Systems
**Problem:** An integrated circuit undergoes $k = 4$ sequential fabrication stages. Let $F_i$ denote the event that a fatal defect is introduced during stage $i$. The probabilities are:
$$P(F_1) = 0.04, \quad P(F_2) = 0.03, \quad P(F_3) = 0.05, \quad P(F_4) = 0.02.$$
Assuming defects occur stochastically independently across stages:
1. Formulate the event $S$ that the chip is completely defect-free using De Morgan's Laws.
2. Calculate the exact production yield $P(S)$.
3. Use the Union Bound (Boole's Inequality) to compute a conservative lower bound for the yield, and compare with the exact result.

**Solution:**
1. The chip has at least one defect if the event $D = \bigcup_{i=1}^4 F_i$ occurs.
The chip is defect-free if $S = D^c = \left(\bigcup_{i=1}^4 F_i\right)^c$.
By De Morgan's Law for set complements:
$$S = \bigcap_{i=1}^4 F_i^c.$$
That is, the chip survives if and only if it survives stage 1 *and* stage 2 *and* stage 3 *and* stage 4.

2. Because the stages are independent, the complementary survival events $F_i^c$ are independent.
The survival probabilities at each stage are:
$$P(F_1^c) = 1 - 0.04 = 0.96$$
$$P(F_2^c) = 1 - 0.03 = 0.97$$
$$P(F_3^c) = 1 - 0.05 = 0.95$$
$$P(F_4^c) = 1 - 0.02 = 0.98$$
By stochastic independence:
$$P(S) = \prod_{i=1}^4 P(F_i^c) = 0.96 \times 0.97 \times 0.95 \times 0.98 = 0.867018 \approx 86.70\%.$$

3. Applying Boole's Inequality (Theorem 1.7) to the defect event:
$$P(D) = P\left(\bigcup_{i=1}^4 F_i\right) \le \sum_{i=1}^4 P(F_i) = 0.04 + 0.03 + 0.05 + 0.02 = 0.14.$$
Using the complement rule:
$$P(S) = 1 - P(D) \ge 1 - \sum_{i=1}^4 P(F_i) = 1 - 0.14 = 0.8600 \quad (86.00\%).$$
The first-order union bound provides a safe conservative lower bound of $86.00\%$, closely approximating the exact non-linear yield of $86.70\%$.

---

### Example 1.8: Measure Disjointification Technique
**Problem:** In measure theory, proving properties for general sequences of non-disjoint events $A_1, A_2, A_3, \dots$ relies on transforming them into pairwise disjoint sets.
Given an arbitrary sequence of events $A_n \in \mathcal{F}$, define:
$$E_1 = A_1, \quad E_n = A_n \setminus \left(\bigcup_{k=1}^{n-1} A_k\right) = A_n \cap \left(\bigcap_{k=1}^{n-1} A_k^c\right) \quad \text{for } n \ge 2.$$
1. Prove rigorously that the sets $E_n$ are pairwise disjoint ($E_i \cap E_j = \emptyset$ for $i \ne j$).
2. Prove that $\bigcup_{n=1}^\infty E_n = \bigcup_{n=1}^\infty A_n$.
3. Prove Boole's Inequality directly using this construction.

**Solution:**
1. Without loss of generality, assume $1 \le i < j$.
By definition of $E_j$:
$$E_j = A_j \setminus \left(\bigcup_{k=1}^{j-1} A_k\right) = A_j \cap \left(\bigcup_{k=1}^{j-1} A_k\right)^c.$$
Because $i < j$, the set $A_i$ is one of the terms in the union $\bigcup_{k=1}^{j-1} A_k$.
Therefore:
$$A_i \subseteq \bigcup_{k=1}^{j-1} A_k \implies \left(\bigcup_{k=1}^{j-1} A_k\right)^c \subseteq A_i^c.$$
Thus:
$$E_j \subseteq A_i^c.$$
Meanwhile, by definition of $E_i$, $E_i \subseteq A_i$.
Intersecting the two:
$$E_i \cap E_j \subseteq A_i \cap A_i^c = \emptyset.$$
Because probabilities and set sizes are non-negative, $E_i \cap E_j = \emptyset$ for all $i \ne j$.

2. **Containment in both directions:**
   - ($\subseteq$): For every $n$, $E_n = A_n \setminus (\dots) \subseteq A_n$.
     Therefore, $\bigcup_{n=1}^\infty E_n \subseteq \bigcup_{n=1}^\infty A_n$.
   - ($\supseteq$): Let $\omega \in \bigcup_{n=1}^\infty A_n$.
     Then $\omega \in A_k$ for at least one index $k$.
     By the Well-Ordering Principle of the positive integers, there exists a *smallest* integer $m \ge 1$ such that $\omega \in A_m$.
     Since $m$ is the smallest, $\omega \notin A_k$ for all $k < m$.
     Therefore, $\omega \notin \bigcup_{k=1}^{m-1} A_k$.
     Consequently:
     $$\omega \in A_m \setminus \left(\bigcup_{k=1}^{m-1} A_k\right) = E_m \subseteq \bigcup_{n=1}^\infty E_n.$$
   Hence, $\bigcup_{n=1}^\infty A_n \subseteq \bigcup_{n=1}^\infty E_n$.
   Combining both inclusions proves $\bigcup_{n=1}^\infty E_n = \bigcup_{n=1}^\infty A_n$.

3. **Proof of Boole's Inequality:**
   Because the sets $E_n$ are pairwise disjoint, we apply Axiom 3 (Countable Additivity):
   $$P\left(\bigcup_{n=1}^\infty A_n\right) = P\left(\bigcup_{n=1}^\infty E_n\right) = \sum_{n=1}^\infty P(E_n).$$
   Since $E_n \subseteq A_n$ for every $n$, Monotonicity (Theorem 1.4) guarantees $P(E_n) \le P(A_n)$.
   Substituting:
   $$\sum_{n=1}^\infty P(E_n) \le \sum_{n=1}^\infty P(A_n) \implies P\left(\bigcup_{n=1}^\infty A_n\right) \le \sum_{n=1}^\infty P(A_n). \quad \blacksquare$$

---

### Example 1.9: Geometric Probability and Uniform Continuous Measures
**Problem:** Two friends agree to meet at a designated coffee shop between 12:00 PM and 1:00 PM. Each person arrives at a time distributed uniformly at random during the 60-minute interval, independent of the other. Each person is willing to wait at most $15$ minutes for the other before leaving.
1. Formulate the sample space $\Omega$ and express the meeting event $M$ as a geometric region.
2. Calculate the exact probability that the two friends successfully meet.

**Solution:**
1. Let $x \in [0, 60]$ be the arrival time in minutes past 12:00 PM of the first friend, and $y \in [0, 60]$ be the arrival time of the second friend.
The sample space is the square in $\mathbb{R}^2$:
$$\Omega = [0, 60] \times [0, 60] \subset \mathbb{R}^2.$$
The total geometric area of $\Omega$ is:
$$\text{Area}(\Omega) = 60 \times 60 = 3600.$$
The two friends meet if and only if their arrival times differ by no more than $15$ minutes:
$$M = \{(x, y) \in \Omega : |x - y| \le 15\}.$$

2. The inequality $|x - y| \le 15$ is equivalent to:
$$-15 \le x - y \le 15 \iff x - 15 \le y \le x + 15.$$
Rather than integrating the irregular hexagon $M$ directly, it is vastly simpler to calculate the area of the complement $M^c$ (the event that they *miss* each other):
$$M^c = \{(x, y) \in \Omega : y > x + 15 \text{ or } y < x - 15\}.$$
The complement consists of two disjoint right isosceles triangles in the corners of the square:
- The upper-left triangle: vertices at $(0, 15)$, $(0, 60)$, and $(45, 60)$.
  Base $= 60 - 15 = 45$, Height $= 60 - 15 = 45$.
  $$\text{Area}(\text{Triangle}_1) = \frac{1}{2} \times 45 \times 45 = \frac{2025}{2} = 1012.5.$$
- The lower-right triangle: vertices at $(15, 0)$, $(60, 0)$, and $(60, 45)$.
  Base $= 45$, Height $= 45$.
  $$\text{Area}(\text{Triangle}_2) = \frac{1}{2} \times 45 \times 45 = 1012.5.$$

The total area of $M^c$ is:
$$\text{Area}(M^c) = 1012.5 + 1012.5 = 2025.$$
Applying the uniform continuous geometric probability measure:
$$P(M^c) = \frac{\text{Area}(M^c)}{\text{Area}(\Omega)} = \frac{2025}{3600} = \frac{9}{16} = 0.5625.$$
By the complement rule:
$$P(M) = 1 - P(M^c) = 1 - \frac{9}{16} = \frac{7}{16} = 0.4375 \quad (43.75\%).$$

---

### Example 1.10: The Symmetric Difference Metric Space
**Problem:** For any two events $A, B \in \mathcal{F}$, the symmetric difference is defined as:
$$A \Delta B = (A \setminus B) \cup (B \setminus A) = (A \cup B) \setminus (A \cap B).$$
1. Prove from the axioms that $P(A \Delta B) = P(A) + P(B) - 2P(A \cap B)$.
2. Prove that the function $d(A, B) = P(A \Delta B)$ satisfies the triangle inequality:
   $$d(A, C) \le d(A, B) + d(B, C) \quad \forall A, B, C \in \mathcal{F}.$$
   (This establishes that probability spaces induce a pseudometric space on events).

**Solution:**
1. Notice that $A \setminus B$ and $B \setminus A$ are disjoint sets by definition:
   $$(A \setminus B) \cap (B \setminus A) = (A \cap B^c) \cap (B \cap A^c) = (A \cap A^c) \cap (B \cap B^c) = \emptyset.$$
   Applying finite additivity (Theorem 1.2):
   $$P(A \Delta B) = P((A \setminus B) \cup (B \setminus A)) = P(A \setminus B) + P(B \setminus A).$$
   From Theorem 1.6, we know:
   $$P(A \setminus B) = P(A) - P(A \cap B)$$
   $$P(B \setminus A) = P(B) - P(A \cap B)$$
   Substituting these expressions:
   $$P(A \Delta B) = [P(A) - P(A \cap B)] + [P(B) - P(A \cap B)] = P(A) + P(B) - 2P(A \cap B). \quad \blacksquare$$

2. **Triangle Inequality Proof:**
   We use the set-theoretic inclusion property of symmetric differences:
   For any three sets $A, B, C$:
   $$A \Delta C \subseteq (A \Delta B) \cup (B \Delta C).$$
   *Verification:* If $\omega \in A \Delta C$, then $\omega$ belongs to exactly one of $A$ or $C$.
   - If $\omega \in A$ and $\omega \notin C$:
     - If $\omega \in B$, then $\omega \in B \setminus C \subseteq B \Delta C$.
     - If $\omega \notin B$, then $\omega \in A \setminus B \subseteq A \Delta B$.
   - A symmetric argument holds if $\omega \in C$ and $\omega \notin A$.
   In all cases, $\omega \in (A \Delta B) \cup (B \Delta C)$.

   Applying Monotonicity (Theorem 1.4):
   $$P(A \Delta C) \le P((A \Delta B) \cup (B \Delta C)).$$
   Applying Boole's Inequality (Theorem 1.7) for two events:
   $$P((A \Delta B) \cup (B \Delta C)) \le P(A \Delta B) + P(B \Delta C).$$
   Therefore:
   $$d(A, C) = P(A \Delta C) \le P(A \Delta B) + P(B \Delta C) = d(A, B) + d(B, C). \quad \blacksquare$$

---

## 1.7 Solved Practice Exercises

---

### Exercise 1.1: Relative Complements and Intersections
**Problem:** Prove directly from Kolmogorov's axioms that for any two events $A, B \in \mathcal{F}$:
$$P(A \cap B^c) = P(A) - P(A \cap B).$$

**Solution:**
Express the set $A$ as the union of two disjoint components:
$$A = (A \cap B) \cup (A \cap B^c).$$
To verify disjointness:
$$(A \cap B) \cap (A \cap B^c) = A \cap (B \cap B^c) = A \cap \emptyset = \emptyset.$$
Because these components are mutually exclusive, we apply Theorem 1.2 (Finite Additivity):
$$P(A) = P((A \cap B) \cup (A \cap B^c)) = P(A \cap B) + P(A \cap B^c).$$
Subtracting $P(A \cap B)$ from both sides:
$$P(A \cap B^c) = P(A) - P(A \cap B). \quad \blacksquare$$

---

### Exercise 1.2: General Bonferroni Fréchet Lower Bound for $n$ Events
**Problem:** Prove by mathematical induction that for any $n$ arbitrary events $A_1, A_2, \dots, A_n \in \mathcal{F}$:
$$P\left(\bigcap_{i=1}^n A_i\right) \ge \sum_{i=1}^n P(A_i) - (n - 1).$$

**Solution:**
**Base Case ($n = 2$):**
From Theorem 1.6:
$$P(A_1 \cup A_2) = P(A_1) + P(A_2) - P(A_1 \cap A_2).$$
Since $P(A_1 \cup A_2) \le 1$:
$$1 \ge P(A_1) + P(A_2) - P(A_1 \cap A_2) \implies P(A_1 \cap A_2) \ge P(A_1) + P(A_2) - 1.$$
The base case holds for $n = 2$ since $n - 1 = 1$.

**Inductive Step:**
Assume the inequality holds for some $k \ge 2$:
$$P\left(\bigcap_{i=1}^k A_i\right) \ge \sum_{i=1}^k P(A_i) - (k - 1).$$
Now consider $k + 1$ events. Let $B = \bigcap_{i=1}^k A_i$. Then:
$$\bigcap_{i=1}^{k+1} A_i = B \cap A_{k+1}.$$
Applying the base case to the two events $B$ and $A_{k+1}$:
$$P(B \cap A_{k+1}) \ge P(B) + P(A_{k+1}) - 1.$$
Substituting the inductive hypothesis for $P(B)$:
$$P\left(\bigcap_{i=1}^{k+1} A_i\right) \ge \left[\sum_{i=1}^k P(A_i) - (k - 1)\right] + P(A_{k+1}) - 1 = \sum_{i=1}^{k+1} P(A_i) - k.$$
Since $k = (k + 1) - 1$, the statement holds for $k + 1$.
By mathematical induction, the inequality holds for all integers $n \ge 2$. $\blacksquare$

---

### Exercise 1.3: Dice Threshold for Triple-Six
**Problem:** A player rolls three fair dice simultaneously.
1. Find the probability of obtaining at least one triple-six ($ (6, 6, 6) $) in a single roll.
2. Determine the minimum number of independent rolls $n$ needed for the probability of at least one triple-six to reach or exceed $90\%$ ($P \ge 0.90$).

**Solution:**
1. The sample space for rolling three fair six-sided dice has $|\Omega| = 6^3 = 216$ equally likely outcomes.
The event of rolling a triple-six is $E = \{(6, 6, 6)\}$.
$$P(E) = \frac{1}{216}.$$
The probability of failing to roll a triple-six on a single toss is:
$$P(E^c) = 1 - \frac{1}{216} = \frac{215}{216}.$$

2. In $n$ independent tosses, the probability of at least one triple-six is:
$$P(\text{At least one } (6, 6, 6)) = 1 - \left(\frac{215}{216}\right)^n.$$
Setting $P \ge 0.90$:
$$1 - \left(\frac{215}{216}\right)^n \ge 0.90 \iff \left(\frac{215}{216}\right)^n \le 0.10.$$
Taking natural logarithms (reversing inequality as $\ln(215/216) < 0$):
$$n \ln\left(\frac{215}{216}\right) \le \ln(0.10) \iff n \ge \frac{\ln(0.10)}{\ln(215/216)}.$$
Evaluating numerically:
$$\ln(0.10) \approx -2.302585$$
$$\ln(215/216) = \ln(215) - \ln(216) \approx 5.370638 - 5.375278 = -0.004640$$
$$n \ge \frac{-2.302585}{-0.004640} \approx 496.25.$$
Rounding up to the next integer:
$$n^* = 497 \text{ rolls}.$$

---

### Exercise 1.4: $\sigma$-Algebra Generated by a Single Arbitrary Event
**Problem:** Let $\Omega$ be an arbitrary non-empty set and let $A \subset \Omega$ be a non-trivial subset ($A \ne \emptyset$ and $A \ne \Omega$).
1. Construct the smallest $\sigma$-algebra containing $A$, denoted $\sigma(A)$.
2. Show that any $\sigma$-algebra containing $A$ must contain at least 4 distinct elements.

**Solution:**
1. A $\sigma$-algebra $\mathcal{F}$ containing $A$ must satisfy:
   - Axiom of sample space: $\Omega \in \mathcal{F}$ and $\emptyset \in \mathcal{F}$.
   - Given: $A \in \mathcal{F}$.
   - Axiom of complement: $A^c = \Omega \setminus A \in \mathcal{F}$.
   Consider the set:
   $$\mathcal{F}_0 = \{\emptyset, A, A^c, \Omega\}.$$
   Let us test closure:
   - Complements: $\emptyset^c = \Omega \in \mathcal{F}_0$, $\Omega^c = \emptyset \in \mathcal{F}_0$, $A^c \in \mathcal{F}_0$, $(A^c)^c = A \in \mathcal{F}_0$.
   - Finite unions: $A \cup A^c = \Omega \in \mathcal{F}_0$, $A \cup \emptyset = A \in \mathcal{F}_0$, $A \cup \Omega = \Omega \in \mathcal{F}_0$, etc.
   All axioms are satisfied.
   Therefore, $\sigma(A) = \{\emptyset, A, A^c, \Omega\}$.

2. Since $A \ne \emptyset$ and $A \ne \Omega$, the four sets $\emptyset, A, A^c, \Omega$ are all distinct:
   - $A \ne \emptyset$ by assumption.
   - $A \ne \Omega$ by assumption.
   - $A^c \ne \emptyset$ (since $A \ne \Omega$).
   - $A^c \ne \Omega$ (since $A \ne \emptyset$).
   - $A \ne A^c$ (if $A = A^c$, then $A \cap A^c = A \cap A = A = \emptyset$, contradicting $A \ne \emptyset$).
   Therefore, $|\sigma(A)| = 4$. Every $\sigma$-algebra containing non-trivial $A$ has cardinality at least 4.

---

### Exercise 1.5: Bonferroni's Second Inequality for Three Events
**Problem:** Prove the lower-bound Bonferroni inequality for three arbitrary events $A, B, C \in \mathcal{F}$:
$$P(A \cup B \cup C) \ge P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C).$$

**Solution:**
From the exact Inclusion-Exclusion formula for three events:
$$P(A \cup B \cup C) = [P(A) + P(B) + P(C)] - [P(A \cap B) + P(A \cap C) + P(B \cap C)] + P(A \cap B \cap C).$$
By Kolmogorov's Axiom 1 (Non-negativity):
$$P(A \cap B \cap C) \ge 0.$$
Therefore, dropping the non-negative term $P(A \cap B \cap C)$ yields:
$$P(A \cup B \cup C) \ge P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C). \quad \blacksquare$$

---

### Exercise 1.6: Continuity from Above and Singletons in Continuous Spaces
**Problem:** Let $\Omega = [0, 1]$ equipped with the uniform Lebesgue probability measure $P([a, b]) = b - a$.
Define the decreasing sequence of nested intervals:
$$B_n = \left[0, \frac{1}{n}\right], \quad n = 1, 2, 3, \dots$$
1. Determine the intersection set $B = \bigcap_{n=1}^\infty B_n$.
2. Compute $\lim_{n \to \infty} P(B_n)$ and prove that the probability of any single point in a continuous distribution is identically zero ($P(\{0\}) = 0$).

**Solution:**
1. For every $n \ge 1$, $0 \in [0, 1/n]$, so $0 \in \bigcap_{n=1}^\infty B_n$.
Suppose $x > 0$. By the Archimedean property, there exists an integer $N$ such that $\frac{1}{N} < x$, meaning $x \notin B_N$, and thus $x \notin \bigcap_{n=1}^\infty B_n$.
Similarly, no $x < 0$ belongs to any $B_n$.
Therefore:
$$B = \bigcap_{n=1}^\infty \left[0, \frac{1}{n}\right] = \{0\}.$$

2. By definition of Lebesgue measure on closed intervals:
$$P(B_n) = \frac{1}{n} - 0 = \frac{1}{n}.$$
Taking the limit as $n \to \infty$:
$$\lim_{n \to \infty} P(B_n) = \lim_{n \to \infty} \frac{1}{n} = 0.$$
By Theorem 1.8 (Continuity from Above):
$$P(B) = P\left(\bigcap_{n=1}^\infty B_n\right) = \lim_{n \to \infty} P(B_n) = 0.$$
Therefore:
$$P(\{0\}) = 0.$$
By translation invariance, $P(\{x\}) = 0$ for every individual point $x \in [0, 1]$. Continuous probabilities can only be non-zero over non-degenerate intervals. $\blacksquare$

---

### Exercise 1.7: Generalized Monty Hall with $N$ Doors and $k$ Opened Doors
**Problem:** Suppose there are $N \ge 3$ doors, behind one of which is a car, and behind the remaining $N - 1$ doors are goats.
1. The contestant chooses one door.
2. Monty Hall, who knows the location of the car, opens $k$ doors revealing goats, where $1 \le k \le N - 2$.
3. The contestant is allowed to switch to any of the remaining $N - 1 - k$ unopened doors.
Derive the general formula for the probability of winning by switching.

**Solution:**
Let $C$ denote the location of the car, with prior probability $P(C = i) = \frac{1}{N}$ for all $i \in \{1, \dots, N\}$.
Assume without loss of generality that the contestant chooses Door 1.
The probability that the car is behind Door 1 is:
$$P(\text{Car at Door 1}) = \frac{1}{N}.$$
The probability that the car is among the remaining $N - 1$ doors is:
$$P(\text{Car not at Door 1}) = 1 - \frac{1}{N} = \frac{N - 1}{N}.$$

Monty Hall opens $k$ goat doors from among the $N - 1$ unchosen doors.
There are now $(N - 1) - k = N - k - 1$ remaining unopened doors.
- If the car was behind Door 1 (probability $\frac{1}{N}$), switching to any of the $N - k - 1$ doors yields a loss.
- If the car was not behind Door 1 (probability $\frac{N - 1}{N}$), the car is guaranteed to be behind one of the $N - k - 1$ unopened doors. By symmetry, the car is equally likely to be behind any of these $N - k - 1$ doors.

Therefore, picking one of the remaining doors at random yields winning probability:
$$P(\text{Win by Switching}) = \frac{N - 1}{N} \times \frac{1}{N - k - 1} = \frac{N - 1}{N(N - k - 1)}.$$

**Sanity Check:** For standard Monty Hall ($N = 3, k = 1$):
$$P = \frac{3 - 1}{3(3 - 1 - 1)} = \frac{2}{3(1)} = \frac{2}{3}.$$
For Example 1.6 ($N = 4, k = 2$):
$$P = \frac{4 - 1}{4(4 - 2 - 1)} = \frac{3}{4(1)} = \frac{3}{4}.$$
The formula matches all known cases.

---

### Exercise 1.8: Subadditivity and Disjointification Bounds
**Problem:** Let $A_1, A_2, \dots, A_n$ be arbitrary events with $P(A_i) = 1 - \epsilon_i$ where $\epsilon_i \ll 1$.
Prove that:
$$P\left(\bigcap_{i=1}^n A_i\right) \ge 1 - \sum_{i=1}^n \epsilon_i.$$

**Solution:**
Consider the complement of the intersection using De Morgan's Law:
$$\left(\bigcap_{i=1}^n A_i\right)^c = \bigcup_{i=1}^n A_i^c.$$
Applying Boole's Inequality (Theorem 1.7) to the union of complements:
$$P\left(\bigcup_{i=1}^n A_i^c\right) \le \sum_{i=1}^n P(A_i^c).$$
Using the complement rule:
$$P(A_i^c) = 1 - P(A_i) = 1 - (1 - \epsilon_i) = \epsilon_i.$$
Substituting:
$$P\left(\bigcup_{i=1}^n A_i^c\right) \le \sum_{i=1}^n \epsilon_i.$$
Now apply the complement rule to the original intersection:
$$P\left(\bigcap_{i=1}^n A_i\right) = 1 - P\left(\left(\bigcap_{i=1}^n A_i\right)^c\right) = 1 - P\left(\bigcup_{i=1}^n A_i^c\right).$$
Because $P\left(\bigcup_{i=1}^n A_i^c\right) \le \sum_{i=1}^n \epsilon_i$, subtracting this upper bound yields:
$$P\left(\bigcap_{i=1}^n A_i\right) \ge 1 - \sum_{i=1}^n \epsilon_i. \quad \blacksquare$$
*Significance:* This inequality is the foundational tool in theoretical computer science and PAC learning for establishing union bounds over multiple high-probability conditions.

---

### Exercise 1.9: Countable Additivity vs Finite Additivity Failure
**Problem:** Consider the natural numbers $\Omega = \mathbb{N} = \{1, 2, 3, \dots\}$. Suppose someone attempts to define a "uniform" probability measure on $\mathbb{N}$ such that every single integer has the exact same probability:
$$P(\{k\}) = c \quad \forall k \in \mathbb{N}.$$
Prove using Kolmogorov's axioms that no such uniform probability measure can exist.

**Solution:**
We proceed by contradiction and case analysis on the constant $c$:
By Axiom 1 (Non-negativity), $c = P(\{k\}) \ge 0$.
The sample space $\Omega = \mathbb{N}$ can be written as the countable union of pairwise disjoint singletons:
$$\mathbb{N} = \bigcup_{k=1}^\infty \{k\}, \quad \text{where } \{i\} \cap \{j\} = \emptyset \text{ for } i \ne j.$$
Applying Axiom 3 (Countable Additivity):
$$P(\mathbb{N}) = P\left(\bigcup_{k=1}^\infty \{k\}\right) = \sum_{k=1}^\infty P(\{k\}) = \sum_{k=1}^\infty c.$$
By Axiom 2 (Normalization), $P(\mathbb{N}) = 1$. Thus:
$$\sum_{k=1}^\infty c = 1.$$
Now evaluate the two possible cases for $c$:
1. **Case 1 ($c = 0$):**
   $$\sum_{k=1}^\infty 0 = 0 \ne 1.$$
   Contradiction! (The total probability would be 0, violating Axiom 2).
2. **Case 2 ($c > 0$):**
   An infinite sum of a strictly positive constant $c > 0$ diverges to infinity:
   $$\sum_{k=1}^\infty c = +\infty \ne 1.$$
   Contradiction! (The total probability would be $+\infty$, violating Axiom 2).

Because no real number $c$ can satisfy both cases, no uniform probability measure can exist on a countably infinite set under Kolmogorov's axioms. $\blacksquare$

---

### Exercise 1.10: Limit Superior, Limit Inferior, and Infinitely Often Events
**Problem:** In measure theory, for a sequence of events $A_1, A_2, A_3, \dots$, the event that "infinitely many $A_n$ occur" (limit superior) is defined as:
$$\limsup_{n \to \infty} A_n = \bigcap_{k=1}^\infty \bigcup_{n=k}^\infty A_n.$$
1. Explain intuitively why this set-theoretic definition corresponds to "infinitely many $A_n$ occur".
2. Prove that if $\sum_{n=1}^\infty P(A_n) < \infty$, then $P(\limsup_{n \to \infty} A_n) = 0$ (The First Borel-Cantelli Lemma).

**Solution:**
1. **Intuitive Explanation:**
   Let $B_k = \bigcup_{n=k}^\infty A_n$. The event $B_k$ occurs if and only if at least one of the events $A_k, A_{k+1}, A_{k+2}, \dots$ occurs.
   The intersection $\bigcap_{k=1}^\infty B_k$ occurs if and only if:
   - For $k = 1$: at least one event in $A_1, A_2, \dots$ occurs.
   - For $k = 2$: at least one event in $A_2, A_3, \dots$ occurs.
   - ...
   - For *every* integer $k$: at least one event with index $n \ge k$ occurs.
   If only a finite number of events occurred, let $M$ be the maximum index among them. Then for all $k > M$, no event in $\{A_k, A_{k+1}, \dots\}$ could occur, making $B_k = \emptyset$, which would mean $\omega \notin \bigcap_{k=1}^\infty B_k$.
   Thus, $\omega \in \bigcap_{k=1}^\infty \bigcup_{n=k}^\infty A_n$ if and only if $\omega$ belongs to infinitely many $A_n$.

2. **Proof of the First Borel-Cantelli Lemma:**
   Notice that $B_k = \bigcup_{n=k}^\infty A_n$ is a decreasing sequence of events:
   $$B_1 \supseteq B_2 \supseteq B_3 \supseteq \dots$$
   By Theorem 1.8 (Continuity from Above):
   $$P\left(\limsup_{n \to \infty} A_n\right) = P\left(\bigcap_{k=1}^\infty B_k\right) = \lim_{k \to \infty} P(B_k) = \lim_{k \to \infty} P\left(\bigcup_{n=k}^\infty A_n\right).$$
   Applying Boole's Inequality (Theorem 1.7) to $B_k$:
   $$P\left(\bigcup_{n=k}^\infty A_n\right) \le \sum_{n=k}^\infty P(A_n).$$
   Because the infinite series $\sum_{n=1}^\infty P(A_n)$ converges by assumption:
   $$\lim_{k \to \infty} \sum_{n=k}^\infty P(A_n) = 0 \quad (\text{tail sum of a convergent series goes to zero}).$$
   By the Squeeze Theorem:
   $$0 \le P\left(\limsup_{n \to \infty} A_n\right) \le \lim_{k \to \infty} \sum_{n=k}^\infty P(A_n) = 0.$$
   Therefore:
   $$P\left(\limsup_{n \to \infty} A_n\right) = 0. \quad \blacksquare$$
