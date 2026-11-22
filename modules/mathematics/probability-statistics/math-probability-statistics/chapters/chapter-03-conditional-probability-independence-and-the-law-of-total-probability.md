# Chapter 3: Conditional Probability, Independence, and the Law of Total Probability

## 3.1 The Geometry of Reduced Sample Spaces: Conditioning as Information Restriction

In real-world physical systems, computational intelligence, and decision theory, observations rarely occur in a state of absolute epistemic vacuum. An autonomous robot does not compute obstacle probabilities over an unconstrained universe; it observes a distance reading from an ultrasonic sensor. A financial quantitative model does not price options in isolation; it observes the Federal Reserve's interest rate announcement. A medical diagnostic algorithm does not estimate disease prevalence in the abstract; it conditions on a patient's genetic sequence and blood test markers.

In classical probability on a space $(\Omega, \mathcal{F}, P)$, the prior probability $P(A)$ measures the likelihood of an event $A$ before any observation is made. When we learn that another event $B$ has occurred ($P(B) > 0$), our entire universe of discourse contracts:

```
+---------------------------------------------------------------------------------------------------+
|                        GEOMETRIC CONTRACTION OF THE SAMPLE SPACE                                  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|     ORIGINAL UNIVERSE (Ω):                     CONDITIONED UNIVERSE (B):                          |
|     +-------------------------+                 +-------------------------+                       |
|     |  Ω                      |                 |                         |                       |
|     |      +--------+         |                 |                         |                       |
|     |      |   A    |         |                 |                         |                       |
|     |    +-+---+    |         |                 |      +----+             |                       |
|     |    | |A∩B|    |         |  ==[ GIVEN B ]==>      |A∩B |             |                       |
|     |    | +---+----+         |                 |    +-+----+             |                       |
|     |    |     |              |                 |    | B  |               |                       |
|     |    |  B  |              |                 |    |    |               |                       |
|     |    +-----+              |                 |    +----+               |                       |
|     +-------------------------+                 +-------------------------+                       |
|     P(A) = Area(A) / Area(Ω)                    P(A | B) = Area(A ∩ B) / Area(B)                  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

Every outcome $\omega \in \Omega \setminus B$ is now known to be impossible: its effective posterior certainty collapses to zero. The set $B$ replaces $\Omega$ as the new **effective sample space**. To ensure that the total probability of this new restricted universe remains normalized to unity ($P(B \mid B) = 1$), all probabilities of surviving subsets $A \cap B$ must be scaled inversely by the probability mass of the conditioning set: $\frac{1}{P(B)}$.

---

## 3.2 Formal Definition and Axiomatic Consistency

### Definition: Conditional Probability
Let $(\Omega, \mathcal{F}, P)$ be a probability space, and let $B \in \mathcal{F}$ be an event with non-zero probability ($P(B) > 0$). For any event $A \in \mathcal{F}$, the **conditional probability of $A$ given $B$**, denoted $P(A \mid B)$, is defined as:
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

If $P(B) = 0$, the ratio $\frac{0}{0}$ is formally undefined in standard Kolmogorov probability. (Conditioning on null events requires the advanced apparatus of Radon-Nikodym derivatives and conditional expectation, explored in Chapter 8).

### Theorem 3.1: Conditional Probability as a Valid Probability Measure
For any fixed conditioning event $B \in \mathcal{F}$ with $P(B) > 0$, the function $P_B: \mathcal{F} \to [0, 1]$ defined by $P_B(A) = P(A \mid B)$ is a strictly valid probability measure satisfying all three of Kolmogorov's axioms.

*Proof:*
1. **Axiom 1 (Non-negativity):**
   By Kolmogorov's Axiom 1, $P(A \cap B) \ge 0$. Since $P(B) > 0$, their quotient satisfies:
   $$P_B(A) = \frac{P(A \cap B)}{P(B)} \ge 0.$$
2. **Axiom 2 (Normalization):**
   Setting $A = \Omega$:
   $$P_B(\Omega) = \frac{P(\Omega \cap B)}{P(B)} = \frac{P(B)}{P(B)} = 1.$$
3. **Axiom 3 (Countable Additivity):**
   Let $A_1, A_2, A_3, \dots$ be a countable sequence of pairwise disjoint events ($A_i \cap A_j = \emptyset$ for $i \ne j$).
   Then $(A_i \cap B) \cap (A_j \cap B) = (A_i \cap A_j) \cap B = \emptyset \cap B = \emptyset$.
   Thus, the sequence $(A_i \cap B)$ is also pairwise disjoint.
   Applying Kolmogorov's Axiom 3 to the numerator:
   $$P_B\left(\bigcup_{i=1}^\infty A_i\right) = \frac{P\left(\left(\bigcup_{i=1}^\infty A_i\right) \cap B\right)}{P(B)} = \frac{P\left(\bigcup_{i=1}^\infty (A_i \cap B)\right)}{P(B)} = \frac{\sum_{i=1}^\infty P(A_i \cap B)}{P(B)} = \sum_{i=1}^\infty \frac{P(A_i \cap B)}{P(B)} = \sum_{i=1}^\infty P_B(A_i).$$

Because $P_B(\cdot)$ is a legitimate probability measure, **all previously proven theorems** (the complement rule, monotonicity, inclusion-exclusion, Boole's inequality, continuity) apply unconditionally under conditioning:
- Complement: $P(A^c \mid B) = 1 - P(A \mid B)$
- Monotonicity: $A_1 \subseteq A_2 \implies P(A_1 \mid B) \le P(A_2 \mid B)$
- Inclusion-Exclusion: $P(A_1 \cup A_2 \mid B) = P(A_1 \mid B) + P(A_2 \mid B) - P(A_1 \cap A_2 \mid B)$

> [!WARNING] Common Conditioning Error
> Conditioning applies to the *event* being evaluated, NOT to the conditioning bar:
> $$P(A \mid B^c) \ne 1 - P(A \mid B)$$
> A hypothesis given one condition and the same hypothesis given the opposite condition are completely unrelated values! The correct complement rule is $P(A^c \mid B) = 1 - P(A \mid B)$.

---

## 3.3 The General Multiplication Rule and Chain Rule

Rearranging the definition of conditional probability yields the **Multiplication Rule**:
$$P(A \cap B) = P(A \mid B) P(B) = P(B \mid A) P(A)$$

This formulation enables the decomposition of complex simultaneous joint events into a sequence of simpler conditional stages.

### Theorem 3.2: The General Chain Rule of Conditional Probability
For any finite sequence of $n$ events $A_1, A_2, \dots, A_n$ such that $P(A_1 \cap A_2 \cap \dots \cap A_{n-1}) > 0$:
$$P\left(\bigcap_{i=1}^n A_i\right) = P(A_1) P(A_2 \mid A_1) P(A_3 \mid A_1 \cap A_2) P(A_4 \mid A_1 \cap A_2 \cap A_3) \cdots P(A_n \mid A_1 \cap \dots \cap A_{n-1})$$

*Proof:*
By mathematical induction.
**Base Case ($n = 2$):** $P(A_1 \cap A_2) = P(A_1) P(A_2 \mid A_1)$ holds directly from the multiplication rule.
**Inductive Step:** Assume the formula holds for $k \ge 2$:
$$P\left(\bigcap_{i=1}^k A_i\right) = P(A_1) \prod_{j=2}^k P\left(A_j \;\middle|\; \bigcap_{m=1}^{j-1} A_m\right).$$
Now let $B = \bigcap_{i=1}^k A_i$. Then $\bigcap_{i=1}^{k+1} A_i = B \cap A_{k+1}$.
Applying the base case to $B$ and $A_{k+1}$:
$$P(B \cap A_{k+1}) = P(B) P(A_{k+1} \mid B) = P\left(\bigcap_{i=1}^k A_i\right) P\left(A_{k+1} \;\middle|\; \bigcap_{i=1}^k A_i\right).$$
Substituting the inductive hypothesis for $P\left(\bigcap_{i=1}^k A_i\right)$ completes the induction. $\blacksquare$

*Practical Significance:* The Chain Rule is the architectural backbone of:
- **Autoregressive Large Language Models (LLMs):** Generating text token-by-token:
  $$P(w_1, w_2, \dots, w_T) = \prod_{t=1}^T P(w_t \mid w_1, \dots, w_{t-1}).$$
- **Markov Chains and Reinforcement Learning:** Decomposing multi-step trajectory likelihoods $\tau = (s_0, a_0, s_1, a_1, \dots, s_T)$.

---

## 3.4 Stochastic Independence vs Mutual Exclusivity

### Definition: Stochastic Independence
Two events $A$ and $B$ are **stochastically independent** (denoted $A \perp B$) if and only if:
$$P(A \cap B) = P(A) P(B)$$

If $P(B) > 0$, this definition is equivalent to:
$$P(A \mid B) = P(A)$$
In words: knowing that event $B$ occurred provides zero information about whether event $A$ will occur; the posterior probability of $A$ given $B$ is identical to its prior probability.

### Critical Distinction: Independence vs Disjointness (Mutual Exclusivity)
Students frequently conflate *independence* with *disjointness* ($A \cap B = \emptyset$). In reality, they are almost polar opposites:

```
+---------------------------------------------------------------------------------------------------+
|                        INDEPENDENCE VS MUTUAL EXCLUSIVITY COMPARISON                              |
+---------------------------------------------------------------------------------------------------+
| Property              | Mutually Exclusive (Disjoint)        | Stochastically Independent         |
+-----------------------+--------------------------------------+------------------------------------+
| Set Relation          | A ∩ B = ∅                            | A ∩ B ≠ ∅ (in general)             |
| Probability of Joint  | P(A ∩ B) = 0                         | P(A ∩ B) = P(A) P(B)               |
| Information Imparted  | MAXIMAL INFORMATION:                 | ZERO INFORMATION:                  |
|                       | Knowing B occurred guarantees A      | Knowing B occurred reveals         |
|                       | DID NOT occur: P(A | B) = 0.         | nothing about A: P(A | B) = P(A).  |
| Can both hold?        | ONLY if at least one event is an     | Yes, for arbitrary non-trivial     |
|                       | impossible event (P(A)=0 or P(B)=0). | events with P(A) > 0, P(B) > 0.    |
+-----------------------+--------------------------------------+------------------------------------+
```

### Theorem 3.3: Independence Invariance Under Complements
If $A$ and $B$ are independent, then:
1. $A$ and $B^c$ are independent.
2. $A^c$ and $B$ are independent.
3. $A^c$ and $B^c$ are independent.

*Proof of (1):*
Express $A$ as the disjoint union $A = (A \cap B) \cup (A \cap B^c)$.
By finite additivity:
$$P(A) = P(A \cap B) + P(A \cap B^c) \implies P(A \cap B^c) = P(A) - P(A \cap B).$$
Since $A$ and $B$ are independent, $P(A \cap B) = P(A) P(B)$:
$$P(A \cap B^c) = P(A) - P(A) P(B) = P(A) [1 - P(B)] = P(A) P(B^c).$$
Thus, $A$ and $B^c$ satisfy the definition of independence. $\blacksquare$

### Mutual Independence vs Pairwise Independence
For a collection of $n \ge 3$ events $A_1, A_2, \dots, A_n$:
- **Pairwise Independence:** $P(A_i \cap A_j) = P(A_i) P(A_j)$ for all $i \ne j$.
- **Mutual (Collective) Independence:** For *every* subset of indices $\{i_1, i_2, \dots, i_k\} \subseteq \{1, \dots, n\}$ with $2 \le k \le n$:
  $$P\left(\bigcap_{j=1}^k A_{i_j}\right) = \prod_{j=1}^k P(A_{i_j})$$

> [!CAUTION] Pairwise Independence Does NOT Imply Mutual Independence
> A classic counterexample by Sergei Bernstein:
> Toss two fair coins: let $A$ be "First coin is Heads" ($P(A) = 1/2$), let $B$ be "Second coin is Heads" ($P(B) = 1/2$), and let $C$ be "Both coins show the same face" ($P(C) = 1/2$).
> Here:
> - $P(A \cap B) = 1/4 = P(A)P(B)$ (Independent).
> - $P(A \cap C) = 1/4 = P(A)P(C)$ (Independent).
> - $P(B \cap C) = 1/4 = P(B)P(C)$ (Independent).
> Yet $P(A \cap B \cap C) = P(HH) = 1/4 \ne P(A)P(B)P(C) = 1/8$! Knowing both $A$ and $B$ occurred fully determines $C$ with certainty ($P(C \mid A \cap B) = 1$). Pairwise independence is completely insufficient for collective independence.

---

## 3.5 Conditional Independence

In graphical probabilistic models, Bayesian networks, and machine learning, **conditional independence** is the single most important structural property enabling tractable inference over high-dimensional distributions.

### Definition: Conditional Independence
Two events $A$ and $B$ are said to be **conditionally independent given $C$** (denoted $A \perp B \mid C$) if and only if:
$$P(A \cap B \mid C) = P(A \mid C) P(B \mid C)$$

Equivalently, for $P(B \cap C) > 0$:
$$P(A \mid B \cap C) = P(A \mid C)$$
In words: once the background state $C$ is known, learning that $B$ also occurred provides no additional information about $A$.

*Physical Example (Naive Bayes / Sensor Redundancy):*
Let $C$ be the event that an autonomous drone's battery is overheating.
Let $A$ be a high temperature reading on Sensor 1, and $B$ be a high temperature reading on Sensor 2.
Unconditionally, $A$ and $B$ are strongly correlated (if Sensor 1 reads hot, Sensor 2 is very likely hot).
However, conditioned on knowing the ground-truth physical engine temperature $C$, the manufacturing noise of Sensor 1 is independent of the noise of Sensor 2:
$$P(A \cap B \mid C) = P(A \mid C) P(B \mid C).$$

---

## 3.6 Partitions and the Law of Total Probability

### Definition: Partition of a Sample Space
A collection of events $\{B_1, B_2, \dots, B_k\}$ (finite or countably infinite) is a **partition** of $\Omega$ if:
1. **Mutually Exclusive:** $B_i \cap B_j = \emptyset$ for all $i \ne j$.
2. **Collectively Exhaustive:** $\bigcup_{i=1}^k B_i = \Omega$.
3. **Non-Trivial:** $P(B_i) > 0$ for all $i$.

### Theorem 3.4: The Law of Total Probability
Let $\{B_1, B_2, \dots, B_k\}$ be a partition of $\Omega$. For any arbitrary event $A \in \mathcal{F}$:
$$P(A) = \sum_{i=1}^k P(A \cap B_i) = \sum_{i=1}^k P(A \mid B_i) P(B_i)$$

*Proof:*
Because $\{B_1, \dots, B_k\}$ partitions $\Omega$, the event $A$ can be decomposed as:
$$A = A \cap \Omega = A \cap \left(\bigcup_{i=1}^k B_i\right) = \bigcup_{i=1}^k (A \cap B_i).$$
For any $i \ne j$:
$$(A \cap B_i) \cap (A \cap B_j) = A \cap (B_i \cap B_j) = A \cap \emptyset = \emptyset.$$
Thus, the subsets $A \cap B_i$ are pairwise disjoint.
Applying Axiom 3 (Countable/Finite Additivity):
$$P(A) = P\left(\bigcup_{i=1}^k (A \cap B_i)\right) = \sum_{i=1}^k P(A \cap B_i).$$
By the Multiplication Rule, $P(A \cap B_i) = P(A \mid B_i) P(B_i)$.
Substituting yields the theorem. $\blacksquare$

*Conceptual Interpretation:* The Law of Total Probability is the mathematical formalization of **divide and conquer** (conditioning on hypotheses). When a direct probability $P(A)$ is difficult to compute, we slice reality into exhaustive scenarios $B_i$, evaluate the local conditional probability $P(A \mid B_i)$ within each scenario, and take the weighted average weighted by the scenario likelihoods $P(B_i)$.

---

## 3.7 Cognitive Traps and Conditioning Fallacies

Human probabilistic reasoning is vulnerable to systematic structural illusions when conditioning:

### 1. Simpson's Paradox
Simpson's Paradox occurs when a statistical trend or association appears in every individual subpopulation, but reverses direction when the subpopulations are aggregated.

*The Classic Example (Bickel et al., 1975 UC Berkeley Admissions):*
- Overall university data showed that male applicants were admitted at a significantly higher rate than female applicants ($44\%$ vs $35\%$). Accusations of systemic institutional bias arose.
- However, when the admissions data was broken down department by department ($B_i$):
  - In Department A: Female admission rate $= 82\%$, Male admission rate $= 62\%$ (Female advantage).
  - In Department B: Female admission rate $= 68\%$, Male admission rate $= 63\%$ (Female advantage).
  - In Department C: Female admission rate $= 34\%$, Male admission rate $= 37\%$ (Near parity).
  - Across almost every individual department, women were admitted at *equal or higher* rates than men!

*The Mathematical Explanation via Total Probability:*
Let $A$ be the event of admission, and $M$ be the event that the applicant is male.
$$P(A \mid M) = \sum_{i} P(A \mid M, B_i) P(B_i \mid M)$$
$$P(A \mid F) = \sum_{i} P(A \mid F, B_i) P(B_i \mid F)$$
Even though $P(A \mid F, B_i) \ge P(A \mid M, B_i)$ in every single department $B_i$, the overall rate $P(A \mid F) < P(A \mid M)$ because women disproportionately applied to highly competitive, low-acceptance departments (large $P(B_i \mid F)$ for departments with low $P(A \mid B_i)$), whereas men disproportionately applied to high-acceptance engineering and chemistry departments.
Ignoring confounding latent variables when conditioning leads to completely inverted conclusions!

---

## 3.8 Worked Examples: First-Principles Solutions

---

### Example 3.1: Multi-Stage Polya Urn Model
**Problem:** An urn initially contains $r = 5$ red balls and $b = 7$ blue balls (total $12$ balls). A ball is drawn at random, its color is noted, and it is returned to the urn along with $c = 3$ additional balls of the *same color* (the Polya contagion process). A second ball is then drawn from the urn.
1. What is the probability that the second ball drawn is red?
2. What is the conditional probability that the first ball was red, given that the second ball drawn was red?

**Solution:**
1. Let $R_1$ be the event that the first ball is red, and $B_1$ be the event that the first ball is blue.
The initial probabilities are:
$$P(R_1) = \frac{5}{12}, \quad P(B_1) = \frac{7}{12}.$$
Notice that $\{R_1, B_1\}$ forms a valid partition of the sample space $\Omega$.
Let $R_2$ be the event that the second ball drawn is red.
- If $R_1$ occurs: The red ball is returned along with 3 more red balls.
  The urn now contains $5 + 3 = 8$ red balls and $7$ blue balls (total $12 + 3 = 15$ balls).
  The conditional probability of drawing red on the second draw is:
  $$P(R_2 \mid R_1) = \frac{8}{15}.$$
- If $B_1$ occurs: The blue ball is returned along with 3 more blue balls.
  The urn now contains $5$ red balls and $7 + 3 = 10$ blue balls (total $15$ balls).
  The conditional probability is:
  $$P(R_2 \mid B_1) = \frac{5}{15} = \frac{1}{3}.$$

Applying the Law of Total Probability (Theorem 3.4):
$$P(R_2) = P(R_2 \mid R_1) P(R_1) + P(R_2 \mid B_1) P(B_1).$$
Substituting the values:
$$P(R_2) = \left(\frac{8}{15}\right) \left(\frac{5}{12}\right) + \left(\frac{5}{15}\right) \left(\frac{7}{12}\right) = \frac{40}{180} + \frac{35}{180} = \frac{75}{180} = \frac{5}{12}.$$
*Remarkable Invariant:* $P(R_2) = \frac{5}{12} = P(R_1)$. In a Polya urn process, the marginal probability of drawing a red ball on *any* subsequent step $n$ remains strictly constant and equal to the initial proportion!

2. To find $P(R_1 \mid R_2)$, apply the definition of conditional probability:
$$P(R_1 \mid R_2) = \frac{P(R_1 \cap R_2)}{P(R_2)} = \frac{P(R_2 \mid R_1) P(R_1)}{P(R_2)}.$$
Using the numbers computed in part 1:
$$P(R_1 \cap R_2) = \frac{8}{15} \times \frac{5}{12} = \frac{40}{180} = \frac{2}{9}.$$
$$P(R_1 \mid R_2) = \frac{40/180}{75/180} = \frac{40}{75} = \frac{8}{15} \approx 0.5333 \quad (53.33\%).$$
Observing that the second ball is red updates our belief that the first ball was red from its prior of $\frac{5}{12} \approx 41.67\%$ up to $53.33\%$.

---

### Example 3.2: The Chain Rule in Autonomous Robot Navigation
**Problem:** An autonomous rover traverses a rough planetary terrain through four consecutive hazard zones: $Z_1, Z_2, Z_3, Z_4$.
Let $S_i$ be the event that the rover successfully crosses zone $Z_i$ without mechanical failure.
Empirical sensor tracking establishes:
- Prior survival in Zone 1: $P(S_1) = 0.95$.
- Survival in Zone 2 given Zone 1 survived: $P(S_2 \mid S_1) = 0.90$.
- Survival in Zone 3 given Zones 1 and 2 survived: $P(S_3 \mid S_1 \cap S_2) = 0.85$.
- Survival in Zone 4 given Zones 1, 2, and 3 survived: $P(S_4 \mid S_1 \cap S_2 \cap S_3) = 0.80$.
1. Compute the probability that the rover successfully completes the entire 4-zone mission.
2. Given that the rover fails during the mission, what is the probability that it failed specifically in Zone 2?

**Solution:**
1. The event that the rover completes the entire mission is the intersection of all four survival events:
$$S = S_1 \cap S_2 \cap S_3 \cap S_4.$$
Applying the General Chain Rule of Conditional Probability (Theorem 3.2):
$$P(S) = P(S_1) \cdot P(S_2 \mid S_1) \cdot P(S_3 \mid S_1 \cap S_2) \cdot P(S_4 \mid S_1 \cap S_2 \cap S_3).$$
Substituting the conditional values:
$$P(S) = 0.95 \times 0.90 \times 0.85 \times 0.80 = 0.95 \times 0.90 \times 0.68 = 0.5814 \quad (58.14\%).$$

2. The rover fails the mission if the complement event $F = S^c$ occurs:
$$P(F) = 1 - P(S) = 1 - 0.5814 = 0.4186.$$
The event that the rover fails *specifically in Zone 2* means that it successfully survived Zone 1, but failed in Zone 2:
$$F_2 = S_1 \cap S_2^c.$$
By the Multiplication Rule and the complement rule for conditioned events:
$$P(F_2) = P(S_1) P(S_2^c \mid S_1) = P(S_1) [1 - P(S_2 \mid S_1)] = 0.95 \times (1 - 0.90) = 0.95 \times 0.10 = 0.095.$$
The conditional probability that failure occurred in Zone 2, given that the mission failed, is:
$$P(F_2 \mid F) = \frac{P(F_2 \cap F)}{P(F)}.$$
Since $F_2 \subseteq F$ (failing in Zone 2 is a subset of failing the mission), $F_2 \cap F = F_2$.
Therefore:
$$P(F_2 \mid F) = \frac{P(F_2)}{P(F)} = \frac{0.095}{0.4186} \approx 0.2269 \quad (22.69\%).$$

---

### Example 3.3: Sergei Bernstein's Counterexample: Pairwise vs Mutual Independence
**Problem:** Toss two fair, independent coins. Let the sample space be $\Omega = \{HH, HT, TH, TT\}$, where each elementary outcome has probability $\frac{1}{4}$.
Define three events:
- $A$: "The first coin lands Heads" $= \{HH, HT\}$.
- $B$: "The second coin lands Heads" $= \{HH, TH\}$.
- $C$: "Both coins land on the same face" $= \{HH, TT\}$.
1. Show that $A, B, C$ are pairwise independent.
2. Show that $A, B, C$ are NOT mutually independent.
3. Compute $P(C \mid A \cap B)$ and explain the collapse of independence.

**Solution:**
1. First, compute individual marginal probabilities:
$$P(A) = \frac{|\{HH, HT\}|}{4} = \frac{2}{4} = \frac{1}{2}.$$
$$P(B) = \frac{|\{HH, TH\}|}{4} = \frac{2}{4} = \frac{1}{2}.$$
$$P(C) = \frac{|\{HH, TT\}|}{4} = \frac{2}{4} = \frac{1}{2}.$$
Now evaluate all pairwise intersections:
- $A \cap B = \{HH, HT\} \cap \{HH, TH\} = \{HH\} \implies P(A \cap B) = \frac{1}{4}$.
  Check: $P(A) P(B) = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4} = P(A \cap B)$. (Independent!).
- $A \cap C = \{HH, HT\} \cap \{HH, TT\} = \{HH\} \implies P(A \cap C) = \frac{1}{4}$.
  Check: $P(A) P(C) = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4} = P(A \cap C)$. (Independent!).
- $B \cap C = \{HH, TH\} \cap \{HH, TT\} = \{HH\} \implies P(B \cap C) = \frac{1}{4}$.
  Check: $P(B) P(C) = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4} = P(B \cap C)$. (Independent!).
All three pairs are mutually pairwise independent.

2. Now evaluate the triple intersection:
$$A \cap B \cap C = \{HH\}.$$
$$P(A \cap B \cap C) = \frac{1}{4}.$$
However, the product of all three marginal probabilities is:
$$P(A) P(B) P(C) = \frac{1}{2} \times \frac{1}{2} \times \frac{1}{2} = \frac{1}{8}.$$
Because $P(A \cap B \cap C) = \frac{1}{4} \ne \frac{1}{8} = P(A) P(B) P(C)$, the events $A, B, C$ fail mutual independence.

3. Evaluating the conditional probability:
$$P(C \mid A \cap B) = \frac{P(A \cap B \cap C)}{P(A \cap B)} = \frac{1/4}{1/4} = 1.00 \quad (100\%).$$
*Explanation:* While knowing $A$ alone tells you nothing about $C$ ($P(C \mid A) = \frac{1/4}{1/2} = \frac{1}{2} = P(C)$), knowing *both* $A$ and $B$ reveals that both coins showed Heads. Thus they must show the same face, guaranteeing $C$ with $100\%$ certainty. Information interacts non-linearly across conditioning sets!

---

### Example 3.4: Law of Total Probability in Semiconductor Manufacturing
**Problem:** A semiconductor foundry manufactures microprocessors across three production fabrication lines: Line 1, Line 2, and Line 3.
- Line 1 produces $50\%$ of all chips ($P(L_1) = 0.50$), with a defect rate of $1.5\%$ ($P(D \mid L_1) = 0.015$).
- Line 2 produces $30\%$ of all chips ($P(L_2) = 0.30$), with a defect rate of $2.5\%$ ($P(D \mid L_2) = 0.025$).
- Line 3 produces $20\%$ of all chips ($P(L_3) = 0.20$), with a defect rate of $6.0\%$ ($P(D \mid L_3) = 0.060$).
1. Calculate the overall defect rate $P(D)$ across the entire foundry output.
2. If a randomly selected chip from the warehouse is tested and found to be defective, which fabrication line is most likely responsible?

**Solution:**
1. The production lines $\{L_1, L_2, L_3\}$ form a partition of the sample space of manufactured chips:
$$L_1 \cup L_2 \cup L_3 = \Omega, \quad L_i \cap L_j = \emptyset \text{ for } i \ne j.$$
Applying the Law of Total Probability (Theorem 3.4):
$$P(D) = \sum_{i=1}^3 P(D \mid L_i) P(L_i) = P(D \mid L_1) P(L_1) + P(D \mid L_2) P(L_2) + P(D \mid L_3) P(L_3).$$
Substituting the parameters:
$$P(D) = (0.015)(0.50) + (0.025)(0.30) + (0.060)(0.20) = 0.0075 + 0.0075 + 0.0120 = 0.0270 \quad (2.70\%).$$
The overall factory defect rate is $2.70\%$.

2. To identify the responsible line, compute the posterior probabilities $P(L_i \mid D)$ using conditional probability:
$$P(L_i \mid D) = \frac{P(D \cap L_i)}{P(D)} = \frac{P(D \mid L_i) P(L_i)}{P(D)}.$$
- For Line 1:
  $$P(L_1 \mid D) = \frac{0.0075}{0.0270} = \frac{75}{270} = \frac{5}{18} \approx 0.2778 \quad (27.78\%).$$
- For Line 2:
  $$P(L_2 \mid D) = \frac{0.0075}{0.0270} = \frac{5}{18} \approx 0.2778 \quad (27.78\%).$$
- For Line 3:
  $$P(L_3 \mid D) = \frac{0.0120}{0.0270} = \frac{120}{270} = \frac{8}{18} = \frac{4}{9} \approx 0.4444 \quad (44.44\%).$$
Even though Line 3 manufactures only $20\%$ of all chips, its high defect rate ($6\%$) causes it to be responsible for $44.44\%$ of all defective chips found in the warehouse. Line 3 is the most likely culprit.

---

### Example 3.5: Numerical Demonstration of Simpson's Paradox
**Problem:** Construct an explicit numerical clinical trial dataset comparing two medical treatments, Drug $A$ and Drug $B$, across two patient groups (Mild Illness and Severe Illness).
Demonstrate that Drug $A$ has a higher recovery rate in the Mild group *and* a higher recovery rate in the Severe group, yet Drug $B$ has a higher recovery rate overall in the aggregated patient population.

**Solution:**
Let the clinical trial data be structured as follows:

#### Subpopulation 1: Mild Illness ($M$)
- **Drug A:** 80 recoveries out of 100 patients treated.
  $$P(\text{Recovery} \mid \text{Drug } A, M) = \frac{80}{100} = 80.0\%.$$
- **Drug B:** 270 recoveries out of 360 patients treated.
  $$P(\text{Recovery} \mid \text{Drug } B, M) = \frac{270}{360} = 75.0\%.$$
*(Drug A wins in the Mild group: $80\% > 75\%$).*

#### Subpopulation 2: Severe Illness ($S$)
- **Drug A:** 120 recoveries out of 400 patients treated.
  $$P(\text{Recovery} \mid \text{Drug } A, S) = \frac{120}{400} = 30.0\%.$$
- **Drug B:** 20 recoveries out of 100 patients treated.
  $$P(\text{Recovery} \mid \text{Drug } B, S) = \frac{20}{100} = 20.0\%.$$
*(Drug A wins in the Severe group: $30\% > 20\%$).*

#### Aggregated Combined Population
Now combine both groups to assess overall recovery rates:
- **Total Drug A Patients:** $100 + 400 = 500$ patients.
  Total Recoveries: $80 + 120 = 200$.
  $$P(\text{Recovery} \mid \text{Drug } A) = \frac{200}{500} = 40.0\%.$$
- **Total Drug B Patients:** $360 + 100 = 460$ patients.
  Total Recoveries: $270 + 20 = 290$.
  $$P(\text{Recovery} \mid \text{Drug } B) = \frac{290}{460} \approx 63.04\%.$$
*(Drug B wins overwhelmingly in the aggregate: $63.04\% \gg 40.0\%$).*

**Mathematical Breakdown via Total Probability:**
Drug $A$ was predominantly tested on severe patients ($400 / 500 = 80\%$ of its test pool), who have a low baseline recovery rate ($30\%$).
Drug $B$ was predominantly tested on mild patients ($360 / 460 = 78.3\%$ of its test pool), who have a high baseline recovery rate ($75\%$).
The latent confounding factor (disease severity) heavily distorted the unconditional aggregate measure, creating the complete illusion that the inferior drug was superior.

---

### Example 3.6: Berkson's Fallacy (Collider Bias)
**Problem:** In a general population, two distinct health conditions—High Blood Pressure ($H$) and Diabetes ($D$)—are completely independent:
$$P(H) = 0.20, \quad P(D) = 0.10, \quad P(H \cap D) = P(H) P(D) = 0.02.$$
Suppose a medical research hospital conducts a study sampling *only hospitalized patients* ($K$). Hospital admission occurs if a person has High Blood Pressure, Diabetes, or both ($K = H \cup D$).
1. Calculate the probability of hospital admission $P(K)$.
2. Calculate the conditional probability of Diabetes given High Blood Pressure among hospitalized patients ($P(D \mid H \cap K)$).
3. Calculate the conditional probability of Diabetes among hospitalized patients without High Blood Pressure ($P(D \mid H^c \cap K)$).
4. Prove that conditioning on the collider $K$ induces a false negative correlation between the two independent diseases.

**Solution:**
1. The probability of hospitalization is:
$$P(K) = P(H \cup D) = P(H) + P(D) - P(H \cap D) = 0.20 + 0.10 - 0.02 = 0.28.$$

2. For a hospitalized patient with High Blood Pressure ($H \cap K$):
Notice that if someone has High Blood Pressure, they are already hospitalized, so $H \cap K = H$.
The joint event of having both diseases while hospitalized is $(D \cap H) \cap K = D \cap H$.
Therefore:
$$P(D \mid H \cap K) = \frac{P(D \cap H)}{P(H)} = \frac{0.02}{0.20} = 0.10 \quad (10.0\%).$$

3. For a hospitalized patient *without* High Blood Pressure ($H^c \cap K$):
Since admission requires $H$ or $D$, a hospitalized patient without $H$ *must* have Diabetes:
$$H^c \cap K = H^c \cap (H \cup D) = (H^c \cap H) \cup (H^c \cap D) = \emptyset \cup (H^c \cap D) = H^c \cap D.$$
By independence:
$$P(H^c \cap D) = P(H^c) P(D) = (1 - 0.20)(0.10) = (0.80)(0.10) = 0.08.$$
The probability of having Diabetes given this condition is:
$$P(D \mid H^c \cap K) = \frac{P(D \cap H^c \cap K)}{P(H^c \cap K)} = \frac{P(D \cap H^c)}{P(D \cap H^c)} = 1.00 \quad (100.0\%).$$

4. **Conclusion:**
In the general population, knowing someone does not have High Blood Pressure leaves the probability of Diabetes at $10\%$.
In the hospital, knowing someone does not have High Blood Pressure increases the probability of Diabetes tenfold to $100\%$!
Among hospitalized patients:
$$P(D \mid H) = 0.10 < P(D \mid H^c) = 1.00.$$
A researcher surveying hospital patients would falsely conclude that High Blood Pressure "protects" against Diabetes (negative correlation), purely because the study conditioned on a shared effect (the collider $K$).

---

### Example 3.7: Gambler's Ruin Difference Equations via Total Probability
**Problem:** A gambler begins with initial capital $k$ dollars ($0 \le k \le N$). At each round, the gambler bets \$1, winning \$1 with probability $p$ and losing \$1 with probability $q = 1 - p$. The game ends when the gambler either goes broke (\$0, ruin) or reaches the goal of \$N (fortune).
Let $R_k$ be the probability of ruin starting from capital $k$.
1. Use the Law of Total Probability to formulate the linear recurrence relation for $R_k$.
2. State the boundary conditions at $k = 0$ and $k = N$.
3. Solve for $R_k$ in the fair coin case ($p = q = 0.5$).

**Solution:**
1. Let $W$ be the event of winning the first bet ($P(W) = p$), and $L$ be the event of losing the first bet ($P(L) = q$).
Conditioning on the first bet using the Law of Total Probability:
$$R_k = P(\text{Ruin} \mid W) P(W) + P(\text{Ruin} \mid L) P(L).$$
If the gambler wins the first bet, their capital becomes $k + 1$, and their future probability of ruin is $R_{k+1}$.
If the gambler loses the first bet, their capital becomes $k - 1$, and their future probability of ruin is $R_{k-1}$.
Therefore:
$$R_k = p R_{k+1} + q R_{k-1}.$$

2. **Boundary Conditions:**
- If the gambler has \$0, they are already ruined:
  $$R_0 = 1.$$
- If the gambler reaches \$N, they have won and cannot be ruined:
  $$R_N = 0.$$

3. **Solving for the Fair Case ($p = q = 0.5$):**
Substitute $p = 0.5, q = 0.5$:
$$R_k = 0.5 R_{k+1} + 0.5 R_{k-1} \implies 2 R_k = R_{k+1} + R_{k-1} \implies R_{k+1} - R_k = R_k - R_{k-1}.$$
This states that the second difference is zero; the sequence $R_k$ is an arithmetic progression:
$$R_k = A + B k.$$
Applying the boundary conditions:
- At $k = 0$: $R_0 = A + B(0) = A = 1$.
- At $k = N$: $R_N = 1 + B(N) = 0 \implies B = -\frac{1}{N}$.
Therefore, the ruin probability is:
$$R_k = 1 - \frac{k}{N}.$$
The probability of reaching \$N before ruin is $1 - R_k = \frac{k}{N}$.
For example, a gambler starting with \$10 aiming for \$100 in a fair game has a ruin probability of $1 - \frac{10}{100} = 90\%$.

---

### Example 3.8: The Prosecutor's Fallacy
**Problem:** A rare crime is committed in a city of $N = 1,000,000$ residents. A forensic DNA sample recovered from the crime scene matches a suspect.
The laboratory analyst testifies: *"The probability that an innocent person's DNA matches this sample is only 1 in 100,000 ($10^{-5}$)."*
The prosecutor argues: *"Therefore, there is a $99.999\%$ chance that the suspect is guilty."*
1. Formulate the mathematical error in the prosecutor's argument using conditional probability.
2. Assuming the suspect was found purely through a random database dragnet search with no other corroborating evidence (prior probability of guilt $P(G) = \frac{1}{1,000,000}$), compute the true posterior probability $P(G \mid M)$ that the suspect is guilty given the DNA match.

**Solution:**
1. The prosecutor committed the **transposition of conditionals** (the Prosecutor's Fallacy), confusing:
$$P(\text{Match} \mid \text{Innocent}) \quad \text{with} \quad P(\text{Innocent} \mid \text{Match}).$$
The laboratory analyst stated that $P(M \mid I) = 10^{-5}$.
The prosecutor falsely equated this to $P(I \mid M) = 10^{-5} \implies P(G \mid M) = 1 - 10^{-5} = 0.99999$.
These two conditional probabilities are fundamentally different mathematical quantities!

2. Let $G$ be the event that the suspect is guilty, and $I = G^c$ be the event that the suspect is innocent.
The prior probabilities across the $1,000,000$ citizens are:
$$P(G) = \frac{1}{1,000,000} = 10^{-6}, \quad P(I) = 1 - 10^{-6} \approx 1.$$
Assuming the true perpetrator is guaranteed to match: $P(M \mid G) = 1$.
The false positive rate is: $P(M \mid I) = 10^{-5}$.
By the Law of Total Probability, the overall probability of a match in the population is:
$$P(M) = P(M \mid G) P(G) + P(M \mid I) P(I) = (1)(10^{-6}) + (10^{-5})(1 - 10^{-6}) \approx 10^{-6} + 10^{-5} = 1.1 \times 10^{-5}.$$
Applying conditional probability:
$$P(G \mid M) = \frac{P(M \mid G) P(G)}{P(M)} = \frac{10^{-6}}{1.1 \times 10^{-5}} = \frac{1}{11} \approx 0.0909 \quad (9.09\%!).$$
In a city of $1,000,000$ people, a match rate of $1$ in $100,000$ produces approximately $10$ innocent matches alongside the $1$ guilty perpetrator.
Thus, given only the match, the suspect is far more likely to be innocent than guilty ($90.9\%$ innocent vs $9.1\%$ guilty). The prosecutor's claim of $99.999\%$ certainty was off by an order of magnitude.

---

### Example 3.9: Genetic Linkage and Recombination
**Problem:** In classical genetics, two gene loci $A$ and $B$ reside on the same chromosome. During meiosis, genetic crossover (recombination) occurs between the loci with probability $\theta \in [0, 0.5]$ (the recombination frequency).
A parent possesses genotype $AB / ab$ (alleles $A$ and $B$ on one chromosome, $a$ and $b$ on the homologous chromosome).
1. State the probabilities of the four gamete combinations produced: $AB, Ab, aB, ab$.
2. If $\theta = 0.05$ ($5$ centimorgans, tight genetic linkage), calculate the conditional probability that a gamete carries allele $B$ given that it carries allele $A$.
3. What is the conditional probability if the genes are on separate chromosomes (independent assortment, $\theta = 0.5$)?

**Solution:**
1. The non-recombinant gametes are $AB$ and $ab$, produced with equal probability:
$$P(AB) = P(ab) = \frac{1 - \theta}{2}.$$
The recombinant gametes resulting from chromosomal crossover are $Ab$ and $aB$:
$$P(Ab) = P(aB) = \frac{\theta}{2}.$$
Notice the sum of all four probabilities:
$$2 \left(\frac{1 - \theta}{2}\right) + 2 \left(\frac{\theta}{2}\right) = (1 - \theta) + \theta = 1.$$

2. The event that a gamete carries allele $A$ is:
$$\text{Carrier of } A = AB \cup Ab.$$
$$P(A) = P(AB) + P(Ab) = \frac{1 - \theta}{2} + \frac{\theta}{2} = \frac{1}{2}.$$
The joint event that a gamete carries both $A$ and $B$ is simply $AB$:
$$P(A \cap B) = P(AB) = \frac{1 - \theta}{2}.$$
The conditional probability of carrying $B$ given $A$ is:
$$P(B \mid A) = \frac{P(A \cap B)}{P(A)} = \frac{(1 - \theta)/2}{1/2} = 1 - \theta.$$
For $\theta = 0.05$:
$$P(B \mid A) = 1 - 0.05 = 0.95 \quad (95.0\%).$$
Because the genes are physically linked, observing allele $A$ drastically elevates the likelihood of observing allele $B$.

3. Under independent assortment ($\theta = 0.5$):
$$P(B \mid A) = 1 - 0.5 = 0.50 = P(B).$$
The alleles sort completely independently ($A \perp B$).

---

### Example 3.10: Uncorrelated Dependent Events
**Problem:** Let $\Omega = \{-1, 0, 1\}$ with uniform probability measure $P(\{-1\}) = P(\{0\}) = P(\{1\}) = \frac{1}{3}$.
Let $X(\omega) = \omega$, so $X \in \{-1, 0, 1\}$.
Let $Y = X^2$, so $Y \in \{0, 1\}$.
1. Show that $X$ and $Y$ are strictly dependent random variables.
2. Define the events $A = \{X = 0\}$ and $B = \{Y = 0\}$. Determine whether $A$ and $B$ are independent.
3. Show that $E[XY] = E[X]E[Y]$, proving that zero covariance does NOT imply statistical independence.

**Solution:**
1. A random variable $Y$ is a deterministic function of $X$ ($Y = X^2$).
If $X = 1$, then $Y = 1$ with certainty. If $X = 0$, then $Y = 0$ with certainty.
They are completely functionally dependent.

2. Evaluate events $A$ and $B$:
- $A = \{X = 0\} = \{0\} \implies P(A) = \frac{1}{3}$.
- $B = \{Y = 0\} = \{X^2 = 0\} = \{0\} \implies P(B) = \frac{1}{3}$.
- $A \cap B = \{0\} \cap \{0\} = \{0\} \implies P(A \cap B) = \frac{1}{3}$.
Check independence:
$$P(A) P(B) = \frac{1}{3} \times \frac{1}{3} = \frac{1}{9}.$$
Because $P(A \cap B) = \frac{1}{3} \ne \frac{1}{9} = P(A) P(B)$, the events are strictly dependent.

3. Calculate expectations:
$$E[X] = (-1)\left(\frac{1}{3}\right) + (0)\left(\frac{1}{3}\right) + (1)\left(\frac{1}{3}\right) = -\frac{1}{3} + 0 + \frac{1}{3} = 0.$$
$$E[Y] = E[X^2] = (-1)^2\left(\frac{1}{3}\right) + (0)^2\left(\frac{1}{3}\right) + (1)^2\left(\frac{1}{3}\right) = \frac{1}{3} + 0 + \frac{1}{3} = \frac{2}{3}.$$
$$E[XY] = E[X \cdot X^2] = E[X^3] = (-1)^3\left(\frac{1}{3}\right) + (0)^3\left(\frac{1}{3}\right) + (1)^3\left(\frac{1}{3}\right) = -\frac{1}{3} + 0 + \frac{1}{3} = 0.$$
Now compare:
$$E[XY] = 0, \quad E[X] E[Y] = (0) \left(\frac{2}{3}\right) = 0.$$
Thus:
$$\text{Cov}(X, Y) = E[XY] - E[X] E[Y] = 0 - 0 = 0.$$
$X$ and $Y$ have exactly zero linear correlation (zero covariance), yet they are completely non-linearly dependent ($Y = X^2$). Independence implies zero covariance, but zero covariance does NOT imply independence. $\blacksquare$

---

## 3.9 Solved Practice Exercises

---

### Exercise 3.1: Reciprocity of Conditional Probability Updates
**Problem:** Prove that for any two events $A, B \in \mathcal{F}$ with $P(A) > 0$ and $P(B) > 0$:
$$P(A \mid B) > P(A) \iff P(B \mid A) > P(B).$$

**Solution:**
From the definition of conditional probability:
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$
The condition $P(A \mid B) > P(A)$ is equivalent to:
$$\frac{P(A \cap B)}{P(B)} > P(A) \iff P(A \cap B) > P(A) P(B).$$
Dividing both sides of this symmetric inequality by $P(A) > 0$:
$$\frac{P(A \cap B)}{P(A)} > P(B).$$
By definition of $P(B \mid A)$:
$$P(B \mid A) > P(B).$$
Both statements are logically equivalent to $P(A \cap B) > P(A) P(B)$ (positive stochastic correlation). $\blacksquare$

---

### Exercise 3.2: The Three Prisoners Problem
**Problem:** Three prisoners, $A, B, C$, are condemned to death. The governor randomly chooses one to be pardoned, with equal probability $\frac{1}{3}$, keeping the identity secret.
Prisoner $A$ asks the guard to name one of the other two prisoners who will be executed. The guard truthfully replies: *"Prisoner $B$ will be executed."*
Prisoner $A$ concludes that his chances of survival have improved from $\frac{1}{3}$ to $\frac{1}{2}$. Is Prisoner $A$ correct?

**Solution:**
Let $A, B, C$ denote the events that prisoners $A, B, C$ are pardoned, each with prior probability $\frac{1}{3}$.
Let $g_B$ denote the event that the guard names $B$.
The guard follows these rules:
- If $B$ is pardoned (prob $\frac{1}{3}$), the guard cannot name $B$; he must name $C$: $P(g_B \mid B) = 0$.
- If $C$ is pardoned (prob $\frac{1}{3}$), the guard cannot name $C$; he must name $B$: $P(g_B \mid C) = 1$.
- If $A$ is pardoned (prob $\frac{1}{3}$), the guard flips a coin between $B$ and $C$: $P(g_B \mid A) = \frac{1}{2}$.

Apply the Law of Total Probability to find $P(g_B)$:
$$P(g_B) = P(g_B \mid A)P(A) + P(g_B \mid B)P(B) + P(g_B \mid C)P(C) = \left(\frac{1}{2}\right)\left(\frac{1}{3}\right) + (0)\left(\frac{1}{3}\right) + (1)\left(\frac{1}{3}\right) = \frac{1}{6} + \frac{1}{3} = \frac{1}{2}.$$
Now compute Prisoner $A$'s posterior survival probability:
$$P(A \mid g_B) = \frac{P(g_B \mid A) P(A)}{P(g_B)} = \frac{(1/2)(1/3)}{1/2} = \frac{1/6}{1/2} = \frac{1}{3}.$$
Prisoner $A$'s survival probability remains unchanged at $\frac{1}{3}$.
Meanwhile, for Prisoner $C$:
$$P(C \mid g_B) = \frac{P(g_B \mid C) P(C)}{P(g_B)} = \frac{(1)(1/3)}{1/2} = \frac{1/3}{1/2} = \frac{2}{3}.$$
The guard's information flows entirely to Prisoner $C$. Prisoner $A$ is incorrect.

---

### Exercise 3.3: Conditional Decomposition of the Two-Envelope Paradox
**Problem:** Two indistinguishable envelopes contain money: one envelope contains $X$ dollars, and the other contains $2X$ dollars. You choose one envelope at random and observe it contains $V$ dollars.
A fallacious argument asserts:
> *"The other envelope is equally likely to contain $V/2$ or $2V$. Thus its expected value is $\frac{1}{2}(V/2) + \frac{1}{2}(2V) = \frac{5}{4}V = 1.25V > V$. Therefore, you should always switch."*

Identify the exact conditional error in this reasoning.

**Solution:**
The error lies in confusing the fixed underlying parameter $X$ with the observed random variable $V$.
Let the two envelopes contain amounts $x$ and $2x$. The total money in the system is $3x$.
Let $E_1$ be the event that you picked the smaller envelope ($V = x$), and $E_2$ be the event that you picked the larger envelope ($V = 2x$).
By symmetry:
$$P(E_1) = P(E_2) = \frac{1}{2}.$$
If you switch:
- In event $E_1$ (prob $\frac{1}{2}$), you gain $+x$.
- In event $E_2$ (prob $\frac{1}{2}$), you lose $-x$.
The true expected net gain from switching is:
$$E[\Delta] = \frac{1}{2}(+x) + \frac{1}{2}(-x) = 0.$$
The fallacy occurs because the formula $\frac{1}{2}(V/2) + \frac{1}{2}(2V)$ treats $V$ as a constant while implicitly conditioning on two different incompatible worlds where $X = V$ (in the $2V$ branch) and $X = V/2$ (in the $V/2$ branch). One cannot equate variables across disjoint prior distributions. $\blacksquare$

---

### Exercise 3.4: Three-Way Conditional Independence
**Problem:** Let $A, B, C$ be events. Prove or disprove: If $A \perp B \mid C$ and $A \perp C \mid B$, does it necessarily follow that $A \perp (B \cap C)$?

**Solution:**
**Disproof by Counterexample:**
Let the sample space be $\Omega = \{1, 2, 3, 4, 5\}$ with probabilities $P(\{\omega\}) = 1/5$.
Let:
- $C = \{1, 2\}$
- $B = \{1, 3\}$
- $A = \{1, 4\}$
Notice:
$B \cap C = \{1\}$.
$A \cap (B \cap C) = \{1\} \implies P(A \cap (B \cap C)) = 1/5$.
$P(B \cap C) = 1/5$.
If $A \perp (B \cap C)$, we would require $P(A \cap (B \cap C)) = P(A) P(B \cap C) = (2/5)(1/5) = 2/25 \ne 1/5$.
Thus $A$ is dependent on $B \cap C$.
Conditional independence along individual margins does not imply joint conditional independence. $\blacksquare$

---

### Exercise 3.5: Multi-Hop Network Routing Reliability
**Problem:** A communication packet travels from node $S$ to node $D$ through two intermediate routers $R_1$ and $R_2$ in series: $S \to R_1 \to R_2 \to D$.
- The link $S \to R_1$ delivers the packet with probability $p_1 = 0.98$.
- Given that the packet reaches $R_1$, the link $R_1 \to R_2$ delivers it with probability $p_2 = 0.95$.
- Given that the packet reaches $R_2$, the link $R_2 \to D$ delivers it with probability $p_3 = 0.92$.
Calculate the end-to-end packet delivery probability.

**Solution:**
Let $A_1$ be the event that the packet reaches $R_1$.
Let $A_2$ be the event that the packet reaches $R_2$.
Let $A_3$ be the event that the packet reaches $D$.
The packet arrives at $D$ if and only if $A_1 \cap A_2 \cap A_3$ occurs.
Applying the Chain Rule (Theorem 3.2):
$$P(A_1 \cap A_2 \cap A_3) = P(A_1) P(A_2 \mid A_1) P(A_3 \mid A_1 \cap A_2).$$
Since delivery from $R_2$ to $D$ depends only on the packet having reached $R_2$ ($P(A_3 \mid A_1 \cap A_2) = P(A_3 \mid A_2) = p_3$):
$$P(\text{Delivery}) = p_1 \cdot p_2 \cdot p_3 = 0.98 \times 0.95 \times 0.92 = 0.85652 \quad (85.65\%).$$

---

### Exercise 3.6: Birthday Collision via the Conditional Chain Rule
**Problem:** Derive the exact birthday non-collision probability formula $P(\text{All distinct}) = \prod_{i=0}^{k-1} (1 - i/365)$ strictly using the conditional Chain Rule.

**Solution:**
Let $A_i$ be the event that person $i$'s birthday is distinct from the birthdays of all preceding people $\{1, 2, \dots, i - 1\}$.
The event that all $k$ birthdays are distinct is:
$$E = \bigcap_{i=1}^k A_i.$$
Applying the Chain Rule:
$$P(E) = P(A_1) P(A_2 \mid A_1) P(A_3 \mid A_1 \cap A_2) \cdots P(A_k \mid A_1 \cap \dots \cap A_{k-1}).$$
- Person 1 can have any birthday: $P(A_1) = \frac{365}{365} = 1 - \frac{0}{365}$.
- Given that person 1 has a birthday, person 2 must avoid that 1 day out of 365: $P(A_2 \mid A_1) = \frac{364}{365} = 1 - \frac{1}{365}$.
- Given that persons 1 and 2 have distinct birthdays, person 3 must avoid those 2 days: $P(A_3 \mid A_1 \cap A_2) = \frac{363}{365} = 1 - \frac{2}{365}$.
- In general, for person $i$: $P(A_i \mid \bigcap_{j=1}^{i-1} A_j) = \frac{365 - (i - 1)}{365} = 1 - \frac{i - 1}{365}$.
Multiplying all conditional terms:
$$P(E) = \prod_{i=1}^k \left(1 - \frac{i - 1}{365}\right) = \prod_{m=0}^{k-1} \left(1 - \frac{m}{365}\right). \quad \blacksquare$$

---

### Exercise 3.7: Imperfect Diagnostic Test Modeling
**Problem:** A medical condition has prevalence $\theta = 0.01$ ($1\%$). A screening test has sensitivity $P(T^+ \mid C) = 0.95$ and specificity $P(T^- \mid C^c) = 0.90$.
Calculate the total expected test positivity rate $P(T^+)$ in a mass screening population.

**Solution:**
The condition status $\{C, C^c\}$ partitions the population.
By the Law of Total Probability:
$$P(T^+) = P(T^+ \mid C) P(C) + P(T^+ \mid C^c) P(C^c).$$
We are given:
- $P(C) = 0.01 \implies P(C^c) = 1 - 0.01 = 0.99$.
- Sensitivity: $P(T^+ \mid C) = 0.95$.
- Specificity: $P(T^- \mid C^c) = 0.90 \implies P(T^+ \mid C^c) = 1 - 0.90 = 0.10$ (false positive rate).
Substituting:
$$P(T^+) = (0.95)(0.01) + (0.10)(0.99) = 0.0095 + 0.0990 = 0.1085 \quad (10.85\%).$$
Over $10.8\%$ of the population will test positive, even though only $1\%$ are infected.

---

### Exercise 3.8: Simpson's Paradox Reversal Condition
**Problem:** Suppose $P(A \mid B_1) > P(A \mid B_2)$ and $P(A \mid B_1^c) > P(A \mid B_2^c)$. Under what mathematical condition on the weights $w_1 = P(B_1)$ and $w_2 = P(B_2)$ can the overall inequality reverse ($P(A \mid B_1) < P(A \mid B_2)$)?

**Solution:**
Let $a_1 = P(A \mid B_1), a_2 = P(A \mid B_1^c)$ and $b_1 = P(A \mid B_2), b_2 = P(A \mid B_2^c)$.
By assumption: $a_1 > b_1$ and $a_2 > b_2$.
By Total Probability:
$$P(A) = a_1 P(B_1) + a_2 (1 - P(B_1))$$
$$P(A) = b_1 P(B_2) + b_2 (1 - P(B_2)).$$
A reversal between two treatments $T_1$ and $T_2$ occurs if:
$$P(A \mid T_1) = a_1 w_1 + a_2 (1 - w_1) < P(A \mid T_2) = b_1 w_2 + b_2 (1 - w_2).$$
This occurs if and only if the difference in baseline success rates $|a_1 - a_2|$ is large and the subpopulation assignment weights $w_1$ and $w_2$ differ drastically:
$$w_2 - w_1 > \frac{a_2 - b_2}{(a_1 - a_2) + (b_2 - b_1)}.$$
A severe imbalance in confounder distribution outweighs the local treatment effect. $\blacksquare$

---

### Exercise 3.9: The Markov Property as Conditional Independence
**Problem:** A stochastic process $\{S_t\}_{t=0}^\infty$ is said to be a **first-order Markov Chain** if:
$$P(S_{t+1} = s_{t+1} \mid S_t = s_t, S_{t-1} = s_{t-1}, \dots, S_0 = s_0) = P(S_{t+1} = s_{t+1} \mid S_t = s_t).$$
Express this property in terms of conditional independence.

**Solution:**
In terms of conditional independence:
$$S_{t+1} \perp (S_0, S_1, \dots, S_{t-1}) \;\middle|\; S_t.$$
*Interpretation:* Given the present state $S_t$, the future state $S_{t+1}$ is conditionally independent of the entire past history $(S_0, \dots, S_{t-1})$. The present state constitutes a complete information Markov blanket separating past from future. $\blacksquare$

---

### Exercise 3.10: Zero-Probability Conditioning
**Problem:** Explain why conditioning on an event with $P(B) = 0$ is undefined in classical Kolmogorov probability, and describe how modern measure theory resolves this using limits.

**Solution:**
In Kolmogorov's elementary definition:
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$
If $P(B) = 0$, by Monotonicity $A \cap B \subseteq B \implies P(A \cap B) = 0$.
The formula yields the indeterminate form $\frac{0}{0}$, which has no unique value in $\mathbb{R}$.
In continuous spaces (such as a 2D coordinate $(X, Y)$ on $\mathbb{R}^2$), any specific point $(x_0, y_0)$ or line $X = x_0$ has probability measure zero ($P(X = x_0) = 0$).
To condition on $X = x_0$, modern probability theory defines conditional probability as the limit of an infinitesimal strip:
$$P(A \mid X = x_0) = \lim_{\epsilon \to 0^+} P(A \mid x_0 - \epsilon \le X \le x_0 + \epsilon) = \frac{f_{X, A}(x_0)}{f_X(x_0)},$$
formalized via Radon-Nikodym derivatives with respect to the marginal density $f_X(x)$. $\blacksquare$
