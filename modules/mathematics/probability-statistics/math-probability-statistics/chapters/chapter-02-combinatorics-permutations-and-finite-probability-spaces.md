# Chapter 2: Combinatorics, Permutations, and Finite Probability Spaces

## 2.1 The Foundations of Combinatorial Enumeration

In finite sample spaces where all elementary outcomes are equally likely (the classical Laplacian assumption), computing the probability of an arbitrary event $A \subseteq \Omega$ reduces to a ratio of discrete cardinalities:
$$P(A) = \frac{|A|}{|\Omega|} = \frac{\text{Number of Favorable Outcomes}}{\text{Total Number of Possible Outcomes}}$$

While the formula appears elementary, evaluating the cardinalities $|A|$ and $|\Omega|$ for complex real-world systems—such as cryptographic key spaces, genomic sequences, network routing topologies, or multi-agent action combinations—quickly defies brute-force enumeration. A standard 52-card deck has $52! \approx 8.0658 \times 10^{67}$ possible permutations, a number vastly exceeding the estimated number of atoms in our galaxy ($\approx 10^{68}$).

Combinatorics is the rigorous mathematical discipline of counting configurations without listing them explicitly. All combinatorial analysis rests on two foundational counting principles:

```
+---------------------------------------------------------------------------------------------------+
|                              THE FUNDAMENTAL PRINCIPLES OF COUNTING                               |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. THE RULE OF PRODUCT (MULTIPLICATION PRINCIPLE):                                               |
|     If a composite procedure can be broken down into k sequential stages such that:               |
|     - Stage 1 can be completed in n_1 distinct ways,                                              |
|     - Stage 2 can be completed in n_2 distinct ways (regardless of the choice in Stage 1),        |
|     - ...                                                                                         |
|     - Stage k can be completed in n_k distinct ways,                                              |
|     Then the total number of distinct composite outcomes is:                                      |
|                             N = n_1 × n_2 × n_3 × ... × n_k                                       |
|                                                                                                   |
|  2. THE RULE OF SUM (ADDITION PRINCIPLE):                                                         |
|     If an event A can occur via k mutually exclusive and exhaustive alternatives A_1, ..., A_k     |
|     where A_i ∩ A_j = ∅ for all i ≠ j, and alternative A_i can occur in |A_i| ways, then:        |
|                             |A| = |A_1| + |A_2| + ... + |A_k|                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2.2 Permutations: Ordered Sequences

A **permutation** is an ordered arrangement of distinct objects. Order matters: the sequence $(A, B, C)$ is distinct from $(C, B, A)$.

### 1. Permutations of $n$ Distinct Objects
Suppose we wish to arrange all $n$ distinct objects in a linear sequence:
- The first position can be occupied by any of the $n$ items.
- The second position can be occupied by any of the remaining $n - 1$ items.
- The third position can be occupied by any of the remaining $n - 2$ items.
- Continuing down to the final position, which has only $1$ remaining item.

By the Rule of Product, the total number of linear permutations is given by the **factorial** function:
$$n! = n \times (n - 1) \times (n - 2) \times \dots \times 3 \times 2 \times 1$$
By convention, the empty product defines $0! = 1$, which aligns with the algebraic property $\Gamma(n + 1) = n!$ and ensures that $\frac{n!}{(n - n)!} = \frac{n!}{0!} = n!$.

### 2. Stirling's Asymptotic Approximation
For large $n$, computing $n!$ exactly causes integer overflow. James Stirling (1730) established the asymptotic equivalence:
$$n! \sim \sqrt{2\pi n} \left(\frac{n}{e}\right)^n \quad \text{as } n \to \infty$$
More precisely, the approximation satisfies the non-asymptotic bounds:
$$\sqrt{2\pi n} \left(\frac{n}{e}\right)^n e^{\frac{1}{12n + 1}} < n! < \sqrt{2\pi n} \left(\frac{n}{e}\right)^n e^{\frac{1}{12n}}$$
Stirling's approximation is foundational in statistical mechanics (deriving Maxwell-Boltzmann and Gibbs distributions) and information theory (Shannon entropy of combinatorial codes).

### 3. $k$-Permutations of $n$ Objects (Sampling Without Replacement)
When choosing and ordering $k$ objects from a set of $n$ distinct objects ($0 \le k \le n$):
$$P(n, k) = n \times (n - 1) \times (n - 2) \times \dots \times (n - k + 1) = \frac{n!}{(n - k)!}$$

### 4. Permutations With Replacement
When an object can be selected repeatedly across $k$ positions:
$$N = n^k$$
For example, a 64-bit cryptographic hash can produce $2^{64} \approx 1.84 \times 10^{19}$ distinct states.

---

## 2.3 Combinations and the Binomial Theorem

A **combination** is an unordered selection of objects. Order does not matter: the collection $\{A, B, C\}$ is identical to $\{C, B, A\}$.

### 1. Binomial Coefficients
The number of ways to choose an unordered subset of $k$ elements from a set of $n$ distinct elements is denoted by the binomial coefficient $\binom{n}{k}$ (read *"n choose k"*):
$$\binom{n}{k} = \frac{P(n, k)}{k!} = \frac{n!}{k!(n - k)!}, \quad 0 \le k \le n$$

### 2. Fundamental Properties of Binomial Coefficients
1. **Symmetry:**
   $$\binom{n}{k} = \binom{n}{n - k}$$
   *Proof:* Choosing $k$ elements to include is equivalent to choosing $n - k$ elements to exclude.
2. **Pascal's Recurrence Identity:**
   $$\binom{n}{k} = \binom{n - 1}{k - 1} + \binom{n - 1}{k}$$
   *Proof:* Focus on a specific element $x$. A subset of size $k$ either contains $x$ (requiring $k - 1$ more elements chosen from the remaining $n - 1$) or does not contain $x$ (requiring all $k$ elements chosen from the remaining $n - 1$).
3. **The Binomial Theorem:**
   For any real numbers $x, y$ and integer $n \ge 0$:
   $$(x + y)^n = \sum_{k=0}^n \binom{n}{k} x^k y^{n - k}$$
   Setting $x = 1, y = 1$ yields the total number of subsets of an $n$-element set:
   $$\sum_{k=0}^n \binom{n}{k} = 2^n$$
   Setting $x = -1, y = 1$ proves that the number of even-sized subsets equals the number of odd-sized subsets:
   $$\sum_{k=0}^n (-1)^k \binom{n}{k} = 0 \implies \sum_{k \text{ even}} \binom{n}{k} = \sum_{k \text{ odd}} \binom{n}{k} = 2^{n - 1}$$
4. **Vandermonde's Convolution Identity:**
   For integers $m, n, k$:
   $$\binom{m + n}{k} = \sum_{j=0}^k \binom{m}{j} \binom{n}{k - j}$$
   *Proof:* Splitting a pool of $m$ men and $n$ women, choosing $k$ people requires choosing $j$ men and $k - j$ women across all valid $j$.

---

## 2.4 Multisets and the Stars-and-Bars Theorem

How many ways can we distribute $k$ indistinguishable (identical) items into $n$ distinguishable bins?
Equivalently, how many non-negative integer solutions exist for:
$$x_1 + x_2 + x_3 + \dots + x_n = k, \quad x_i \in \{0, 1, 2, \dots\}$$

The **Stars-and-Bars** method, formalized by William Feller, conceptualizes this as arranging $k$ identical stars ($*$) and $n - 1$ identical bars ($|$) in a linear row of length $k + n - 1$:
$$* * * | * * | | * * * * \quad \implies x_1 = 3, x_2 = 2, x_3 = 0, x_4 = 4$$
The number of distinct arrangements corresponds to choosing the positions of the $n - 1$ bars out of $k + n - 1$ total positions:
$$\binom{k + n - 1}{n - 1} = \binom{k + n - 1}{k}$$

If we require strictly positive integers ($x_i \ge 1$ for all $i$, meaning no bin is empty), we place one item in each of the $n$ bins upfront, leaving $k - n$ items to distribute freely:
$$\binom{(k - n) + n - 1}{n - 1} = \binom{k - 1}{n - 1}$$

---

## 2.5 Multinomial Coefficients and General Partitions

When partitioning a set of $n$ distinct objects into $r$ distinct groups such that group $1$ receives $k_1$ items, group $2$ receives $k_2$ items, ..., and group $r$ receives $k_r$ items (where $\sum_{i=1}^r k_i = n$):
$$\binom{n}{k_1, k_2, \dots, k_r} = \frac{n!}{k_1! k_2! \cdots k_r!}$$

*Derivation:*
- Choose $k_1$ items for group 1: $\binom{n}{k_1} = \frac{n!}{k_1!(n - k_1)!}$.
- Choose $k_2$ items for group 2 from the remaining $n - k_1$: $\binom{n - k_1}{k_2} = \frac{(n - k_1)!}{k_2!(n - k_1 - k_2)!}$.
- Continuing sequentially, all intermediate factorial terms cancel out telescopically:
$$\frac{n!}{k_1!(n - k_1)!} \times \frac{(n - k_1)!}{k_2!(n - k_1 - k_2)!} \times \dots \times \frac{k_r!}{k_r! 0!} = \frac{n!}{k_1! k_2! \cdots k_r!}.$$

The **Multinomial Theorem** generalizes the Binomial Theorem:
$$(x_1 + x_2 + \dots + x_r)^n = \sum_{k_1 + \dots + k_r = n} \binom{n}{k_1, k_2, \dots, k_r} x_1^{k_1} x_2^{k_2} \cdots x_r^{k_r}$$

---

## 2.6 Landmark Combinatorial Paradigms

### 1. The Birthday Collision Paradox
In a room of $k$ randomly assembled people, what is the probability $P(k)$ that at least two people share the same birthday? (Assume 365 days in a year, uniform distribution, and independent birthdays).

The total number of possible birthday assignments is:
$$|\Omega| = 365^k$$
The number of configurations where all $k$ people have distinct birthdays is the number of $k$-permutations from $365$:
$$|A^c| = P(365, k) = 365 \times 364 \times 363 \times \dots \times (365 - k + 1)$$
The probability that all birthdays are distinct is:
$$P(\text{All Distinct}) = \frac{P(365, k)}{365^k} = \prod_{i=0}^{k-1} \left(1 - \frac{i}{365}\right)$$
Using the Taylor expansion $1 - x \approx e^{-x}$ for small $x$:
$$\prod_{i=0}^{k-1} \left(1 - \frac{i}{365}\right) \approx \prod_{i=0}^{k-1} e^{-i / 365} = \exp\left(-\sum_{i=0}^{k-1} \frac{i}{365}\right) = \exp\left(-\frac{k(k - 1)}{2 \times 365}\right) \approx e^{-k^2 / 730}$$
Therefore:
$$P(\text{At least one shared birthday}) = 1 - e^{-k^2 / 730}$$
Setting $P(k) \ge 0.5$:
$$1 - e^{-k^2 / 730} \ge 0.5 \implies e^{-k^2 / 730} \le 0.5 \implies -\frac{k^2}{730} \le \ln(0.5) \implies k^2 \ge 730 \ln(2) \approx 730 \times 0.69315 \approx 506$$
$$k \ge \sqrt{506} \approx 22.49 \implies k^* = 23 \text{ people!}$$
In a group of just $23$ people, there are $\binom{23}{2} = \frac{23 \times 22}{2} = 253$ distinct pairs of people who could potentially share a birthday. Because the number of pairs grows quadratically ($\mathcal{O}(k^2)$), collision probabilities surge rapidly.

### 2. Derangements and the Hat-Check Problem
A **derangement** is a permutation of $n$ elements in which *no element appears in its original position*.
Let $!n$ denote the number of derangements of $n$ items (also written $D_n$).
Using the Principle of Inclusion-Exclusion:
Let $A_i$ be the set of permutations where element $i$ remains in position $i$ (a fixed point).
Then $|A_i| = (n - 1)!$, $|A_i \cap A_j| = (n - 2)!$, and in general the intersection of $k$ such sets has size $(n - k)!$.
There are $\binom{n}{k}$ ways to choose $k$ fixed points.
By Inclusion-Exclusion, the number of permutations with at least one fixed point is:
$$\left|\bigcup_{i=1}^n A_i\right| = \sum_{k=1}^n (-1)^{k-1} \binom{n}{k} (n - k)! = \sum_{k=1}^n (-1)^{k-1} \frac{n!}{k!(n - k)!} (n - k)! = n! \sum_{k=1}^n \frac{(-1)^{k-1}}{k!}$$
The number of derangements is the complement:
$$!n = n! - \left|\bigcup_{i=1}^n A_i\right| = n! - n! \sum_{k=1}^n \frac{(-1)^{k-1}}{k!} = n! \sum_{k=0}^n \frac{(-1)^k}{k!}$$
The probability that a uniformly random permutation is a derangement is:
$$P(\text{Derangement}) = \frac{!n}{n!} = \sum_{k=0}^n \frac{(-1)^k}{k!} = 1 - 1 + \frac{1}{2!} - \frac{1}{3!} + \dots + \frac{(-1)^n}{n!}$$
As $n \to \infty$, this series converges to the Taylor series of $e^{-1}$:
$$\lim_{n \to \infty} P(\text{Derangement}) = \frac{1}{e} \approx 0.367879 \quad (36.79\%)$$
Remarkably, whether checking $10$ hats or $10,000,000$ hats, the probability that *nobody* gets their own hat back is almost exactly $1/e$!

---

## 2.7 Worked Examples: First-Principles Solutions

---

### Example 2.1: Exact Birthday Collision Probabilities
**Problem:** A classroom contains $k = 30$ students. Assume a non-leap year of $d = 365$ equally likely days, with independent birthdays.
1. Formulate and compute the exact probability $P(k = 30)$ that at least two students share a birthday.
2. Compute the approximate probability using the exponential approximation $P \approx 1 - e^{-k(k - 1) / (2d)}$.
3. Compute the probability for a group of $k = 50$ students.

**Solution:**
1. The total number of possible birthday assignments is:
$$|\Omega| = 365^{30}.$$
The number of outcomes where all 30 students have distinct birthdays is:
$$|A^c| = P(365, 30) = \frac{365!}{(365 - 30)!} = 365 \times 364 \times \dots \times 336.$$
The exact probability that all birthdays are distinct is:
$$P(A^c) = \prod_{i=0}^{29} \left(1 - \frac{i}{365}\right) = \left(1\right) \left(\frac{364}{365}\right) \left(\frac{363}{365}\right) \cdots \left(\frac{336}{365}\right).$$
Computing the product of logarithms:
$$\ln P(A^c) = \sum_{i=0}^{29} \ln\left(1 - \frac{i}{365}\right) \approx -1.22467.$$
Exponentiating:
$$P(A^c) = e^{-1.22467} \approx 0.29368.$$
By the complement rule:
$$P(\text{At least one shared birthday}) = 1 - P(A^c) = 1 - 0.29368 = 0.70632 \approx 70.63\%.$$

2. **Exponential Approximation:**
The number of distinct student pairs is $\binom{30}{2} = \frac{30 \times 29}{2} = 435$.
$$P_{\text{approx}} = 1 - \exp\left(-\frac{30 \times 29}{2 \times 365}\right) = 1 - \exp\left(-\frac{435}{365}\right) = 1 - \exp(-1.19178) \approx 1 - 0.30368 = 0.69632 \approx 69.63\%.$$
The approximation error is only $\approx 1.0\%$.

3. **For $k = 50$ students:**
$$\ln P(A^c) = \sum_{i=0}^{49} \ln\left(1 - \frac{i}{365}\right) \approx -3.4988.$$
$$P(A^c) = e^{-3.4988} \approx 0.02994.$$
$$P(\text{Collision for } k = 50) = 1 - 0.02994 = 0.97006 \approx 97.01\%.$$
In a group of 50 people, a shared birthday is virtually certain ($97.0\%$).

---

### Example 2.2: Poker Hand Probability: Full House vs Flush
**Problem:** In a standard 5-card poker hand dealt from a well-shuffled 52-card deck:
1. Calculate the total size of the sample space $|\Omega|$.
2. Derive the exact combinatorial count and probability of being dealt a **Full House** (three cards of one rank and two cards of another rank).
3. Derive the exact combinatorial count and probability of being dealt a **Flush** (all five cards of the same suit, excluding straight flushes and royal flushes).
4. Prove from first principles which hand ranks higher.

**Solution:**
1. A poker hand is an unordered selection of 5 cards from 52 cards without replacement:
$$|\Omega| = \binom{52}{5} = \frac{52 \times 51 \times 50 \times 49 \times 48}{5 \times 4 \times 3 \times 2 \times 1} = 2,598,960.$$

2. **Full House Combinatorics:**
A Full House consists of three cards of rank $R_1$ and two cards of rank $R_2$ ($R_1 \ne R_2$).
- Choose the rank for the three-of-a-kind: There are $\binom{13}{1} = 13$ ranks available.
- Choose 3 of the 4 cards of that rank: $\binom{4}{3} = 4$ ways.
- Choose the rank for the pair from the remaining 12 ranks: $\binom{12}{1} = 12$ ranks available.
- Choose 2 of the 4 cards of that rank: $\binom{4}{2} = 6$ ways.
By the Rule of Product:
$$N_{\text{Full House}} = \binom{13}{1} \binom{4}{3} \times \binom{12}{1} \binom{4}{2} = 13 \times 4 \times 12 \times 6 = 3,744 \text{ hands}.$$
The probability is:
$$P(\text{Full House}) = \frac{3,744}{2,598,960} \approx 0.00144058 \quad (\approx 1 \text{ in } 694.16 \text{ hands, or } 0.144\%).$$

3. **Flush Combinatorics:**
A flush consists of 5 cards of the same suit.
- Choose 1 of the 4 suits: $\binom{4}{1} = 4$ suits.
- Choose 5 of the 13 cards in that suit: $\binom{13}{5} = \frac{13 \times 12 \times 11 \times 10 \times 9}{120} = 1,287$ ways.
Total hands with 5 cards of the same suit: $4 \times 1,287 = 5,148$.
However, this count includes **Straight Flushes** (sequences of 5 consecutive cards of the same suit).
In any suit, there are 10 possible straight flushes: (A-2-3-4-5, 2-3-4-5-6, ..., 10-J-Q-K-A).
Across all 4 suits, there are $4 \times 10 = 40$ straight flushes (including 4 Royal Flushes).
Subtracting straight flushes:
$$N_{\text{Flush}} = 5,148 - 40 = 5,108 \text{ hands}.$$
The probability is:
$$P(\text{Flush}) = \frac{5,108}{2,598,960} \approx 0.0019654 \quad (\approx 1 \text{ in } 508.8 \text{ hands, or } 0.197\%).$$

4. **Ranking Comparison:**
$$P(\text{Full House}) = 0.001441 < P(\text{Flush}) = 0.001965.$$
Because a Full House is strictly rarer than a Flush ($3,744 < 5,108$), standard poker rules dictate that a Full House defeats a Flush.

---

### Example 2.3: Poker Hand: Two Pair vs Three of a Kind
**Problem:** In a standard 5-card poker hand:
1. Derive the combinatorial count and probability of **Two Pair** (two cards of rank $R_1$, two cards of rank $R_2$, and one kicker of rank $R_3$).
2. Derive the combinatorial count and probability of **Three of a Kind** (three cards of rank $R_1$ and two kickers of distinct ranks $R_2, R_3$).

**Solution:**
1. **Two Pair Combinatorics:**
- Choose the 2 ranks for the two pairs simultaneously from the 13 available ranks: $\binom{13}{2} = 78$ ways.
  *(Note: We must choose both ranks together $\binom{13}{2}$, NOT sequentially $\binom{13}{1} \binom{12}{1}$, because the order of the pairs does not matter—a pair of Kings and a pair of 4s is identical to a pair of 4s and a pair of Kings).*
- For each chosen rank, choose 2 of the 4 cards: $\binom{4}{2} \times \binom{4}{2} = 6 \times 6 = 36$ ways.
- Choose the rank of the 5th card (the kicker) from the remaining 11 ranks: $\binom{11}{1} = 11$ ways.
- Choose 1 of the 4 cards of the kicker rank: $\binom{4}{1} = 4$ ways.
By the Rule of Product:
$$N_{\text{Two Pair}} = \binom{13}{2} \binom{4}{2} \binom{4}{2} \times \binom{11}{1} \binom{4}{1} = 78 \times 36 \times 11 \times 4 = 123,552 \text{ hands}.$$
The probability is:
$$P(\text{Two Pair}) = \frac{123,552}{2,598,960} \approx 0.047539 \quad (4.75\%).$$

2. **Three of a Kind Combinatorics:**
- Choose 1 rank for the three-of-a-kind: $\binom{13}{1} = 13$ ranks.
- Choose 3 of the 4 cards of that rank: $\binom{4}{3} = 4$ ways.
- The remaining 2 cards must have distinct ranks (otherwise it would be a Full House). Choose 2 distinct ranks from the remaining 12 ranks: $\binom{12}{2} = 66$ ways.
- For each of the two kicker ranks, choose 1 of the 4 cards: $\binom{4}{1} \times \binom{4}{1} = 4 \times 4 = 16$ ways.
By the Rule of Product:
$$N_{\text{Three of a Kind}} = \binom{13}{1} \binom{4}{3} \times \binom{12}{2} \binom{4}{1} \binom{4}{1} = 13 \times 4 \times 66 \times 16 = 54,912 \text{ hands}.$$
The probability is:
$$P(\text{Three of a Kind}) = \frac{54,912}{2,598,960} \approx 0.021128 \quad (2.11\%).$$
Because $54,912 < 123,552$, Three of a Kind is more than twice as rare as Two Pair, correctly explaining why Three of a Kind ranks higher.

---

### Example 2.4: Stars and Bars for Cloud Server Load Balancing
**Problem:** A cloud load balancer receives $k = 20$ identical API requests that must be distributed across $n = 5$ distinct worker server threads.
1. How many ways can the 20 requests be distributed if some worker threads are allowed to receive zero requests ($x_i \ge 0$)?
2. How many ways can the requests be distributed if every worker thread must receive at least one request to maintain keep-alive status ($x_i \ge 1$)?
3. If each valid configuration under (1) is equally likely, what is the probability that all 20 requests land on a single server?

**Solution:**
1. This is equivalent to finding the number of non-negative integer solutions to:
$$x_1 + x_2 + x_3 + x_4 + x_5 = 20, \quad x_i \in \{0, 1, 2, \dots\}.$$
Applying the Stars-and-Bars formula for non-negative integers:
$$N_1 = \binom{k + n - 1}{n - 1} = \binom{20 + 5 - 1}{5 - 1} = \binom{24}{4}.$$
Evaluating the binomial coefficient:
$$\binom{24}{4} = \frac{24 \times 23 \times 22 \times 21}{4 \times 3 \times 2 \times 1} = 24 \times 23 \times 11 \times 7 = 10,626 \text{ configurations}.$$

2. For strictly positive integers ($x_i \ge 1$ for all $i$):
Each of the 5 servers receives 1 request upfront, leaving $20 - 5 = 15$ requests to distribute freely:
$$N_2 = \binom{k - 1}{n - 1} = \binom{20 - 1}{5 - 1} = \binom{19}{4}.$$
Evaluating:
$$\binom{19}{4} = \frac{19 \times 18 \times 17 \times 16}{24} = 19 \times 3 \times 17 \times 4 = 3,876 \text{ configurations}.$$

3. A single server receiving all 20 requests corresponds to outcomes of the form $(20, 0, 0, 0, 0)$, $(0, 20, 0, 0, 0)$, etc.
There are exactly $n = 5$ such configurations.
The probability under uniform selection is:
$$P(\text{All on One Server}) = \frac{5}{10,626} \approx 0.0004705 \quad (0.047\%).$$

---

### Example 2.5: Multinomial Permutations of Strings
**Problem:**
1. Calculate the number of distinct permutations of the letters in the word **"MISSISSIPPI"**.
2. If the letters are arranged in a uniformly random sequence, what is the probability that all four 'S' letters appear contiguously (as a single block "SSSS")?

**Solution:**
1. The word "MISSISSIPPI" contains $n = 11$ total letters, with the letter frequencies:
- $\text{M}: 1$
- $\text{I}: 4$
- $\text{S}: 4$
- $\text{P}: 2$
Notice that $1 + 4 + 4 + 2 = 11$.
The number of distinct permutations is given by the multinomial coefficient:
$$\binom{11}{1, 4, 4, 2} = \frac{11!}{1! \times 4! \times 4! \times 2!}.$$
Evaluating step-by-step:
$$11! = 39,916,800$$
$$1! \times 4! \times 4! \times 2! = 1 \times 24 \times 24 \times 2 = 1,152$$
$$N_{\text{total}} = \frac{39,916,800}{1,152} = 34,650 \text{ distinct permutations}.$$

2. To find the permutations where all four 'S' letters are contiguous, bundle "SSSS" into a single super-letter $\mathbf{S}^*$.
Now we arrange the set of $n' = 8$ items:
- $\mathbf{S}^*: 1$
- $\text{M}: 1$
- $\text{I}: 4$
- $\text{P}: 2$
Notice that $1 + 1 + 4 + 2 = 8$.
The number of permutations of these 8 items is:
$$N_{\text{contiguous}} = \frac{8!}{1! \times 1! \times 4! \times 2!} = \frac{40,320}{1 \times 1 \times 24 \times 2} = \frac{40,320}{48} = 840.$$
The probability of this event occurring by random chance is:
$$P(\text{SSSS contiguous}) = \frac{N_{\text{contiguous}}}{N_{\text{total}}} = \frac{840}{34,650} = \frac{4}{165} \approx 0.02424 \quad (2.42\%).$$

---

### Example 2.6: The Hat-Check Problem with $n = 6$ Guests
**Problem:** Six guests attend a dinner party and check their coats. At departure, the coats are handed back in a uniformly random permutation.
1. Calculate the exact number of derangements $!6$ (where no guest receives their own coat).
2. Calculate the exact probability that *at least one* guest receives their own coat.
3. Calculate the exact probability that *exactly two* guests receive their own coats.

**Solution:**
1. The total number of permutations of 6 items is:
$$|\Omega| = 6! = 720.$$
The number of derangements $!n$ is given by:
$$!n = n! \sum_{k=0}^n \frac{(-1)^k}{k!}.$$
For $n = 6$:
$$!6 = 6! \left[ 1 - 1 + \frac{1}{2!} - \frac{1}{3!} + \frac{1}{4!} - \frac{1}{5!} + \frac{1}{6!} \right]$$
$$!6 = 720 \left[ \frac{1}{2} - \frac{1}{6} + \frac{1}{24} - \frac{1}{120} + \frac{1}{720} \right]$$
$$!6 = 360 - 120 + 30 - 6 + 1 = 265 \text{ derangements}.$$

2. The event that at least one person gets their own coat is the complement of a derangement:
$$P(\text{At least one fixed point}) = 1 - \frac{!6}{6!} = 1 - \frac{265}{720} = \frac{455}{720} = \frac{91}{144} \approx 0.63194 \quad (63.19\%).$$

3. For **exactly two** guests to receive their own coats:
- Choose which 2 guests get their own coats: $\binom{6}{2} = 15$ ways.
- The remaining $6 - 2 = 4$ guests must *all* receive someone else's coat (a derangement of the remaining 4 items):
  $$!4 = 4! \left( \frac{1}{2} - \frac{1}{6} + \frac{1}{24} \right) = 24 \left( \frac{12 - 4 + 1}{24} \right) = 9 \text{ derangements}.$$
By the Rule of Product:
$$N_{\text{exactly 2}} = \binom{6}{2} \times !4 = 15 \times 9 = 135.$$
The probability is:
$$P(\text{Exactly 2}) = \frac{135}{720} = \frac{3}{16} = 0.1875 \quad (18.75\%).$$

---

### Example 2.7: André's Reflection Principle and Bertrand's Ballot Theorem
**Problem:** In an election between two candidates, Candidate $A$ receives $a$ votes and Candidate $B$ receives $b$ votes, where $a > b$. Suppose the ballots are unsealed and counted in a uniformly random sequential order.
Prove that the probability that Candidate $A$ stays *strictly ahead* of Candidate $B$ throughout the entire ballot counting process is:
$$P(A \text{ strictly leads}) = \frac{a - b}{a + b}.$$

**Solution:**
Let $n = a + b$ be the total number of votes.
Represent the vote count as a lattice path in $\mathbb{Z}^2$ starting from the origin $(0, 0)$ and ending at $(n, a - b)$:
- A vote for $A$ is a step up: $+1$.
- A vote for $B$ is a step down: $-1$.
After $k$ votes, the vertical position $S_k$ represents the lead of $A$ over $B$.
The total number of paths from $(0, 0)$ to $(n, a - b)$ containing $a$ up-steps and $b$ down-steps is:
$$|\Omega| = \binom{a + b}{a} = \binom{a + b}{b}.$$

The condition that $A$ strictly leads throughout means $S_k > 0$ for all $k \in \{1, 2, \dots, n\}$.
This requires two conditions:
1. The very first step must be an up-step: $S_1 = 1$. (Thus, the path moves from $(0, 0)$ to $(1, 1)$).
2. The remaining path from $(1, 1)$ to $(n, a - b)$ must never touch the horizontal line $y = 0$.

The total number of paths from $(1, 1)$ to $(n, a - b)$ has $a - 1$ remaining up-steps and $b$ remaining down-steps:
$$N_{\text{total from (1, 1)}} = \binom{(a - 1) + b}{b} = \binom{a + b - 1}{b}.$$

Now we count the "bad" paths that start at $(1, 1)$ and touch or cross $y = 0$ at least once.
**Désiré André's Reflection Principle (1887):**
Let $T$ be the first point where a bad path touches $y = 0$.
Reflect the portion of the path from $(0, 0)$ up to $T$ across the line $y = 0$.
The reflected path starts at $(0, 0)$'s reflection, which is $(0, 0)$, but if we reflect the path from $(1, 1)$ to $T$, the reflected prefix starts at $(1, -1)$.
Because every bad path touches $y = 0$, there is a strict 1-to-1 bijection between:
- Paths from $(1, 1)$ to $(n, a - b)$ that touch $y = 0$, and
- *All* unrestricted paths from $(1, -1)$ to $(n, a - b)$.

An unrestricted path from $(1, -1)$ to $(n, a - b)$ must traverse $n - 1$ steps with net vertical displacement:
$$\Delta y = (a - b) - (-1) = a - b + 1.$$
Let $u$ be the up-steps and $d$ be the down-steps:
$$u + d = a + b - 1$$
$$u - d = a - b + 1$$
Adding the two equations: $2u = 2a \implies u = a$, which means $d = b - 1$.
The number of such paths is:
$$N_{\text{bad}} = \binom{a + b - 1}{b - 1}.$$

Subtracting the bad paths yields the number of favorable paths:
$$N_{\text{good}} = \binom{a + b - 1}{b} - \binom{a + b - 1}{b - 1}.$$
Using the factorial expansion:
$$N_{\text{good}} = \frac{(a + b - 1)!}{b!(a - 1)!} - \frac{(a + b - 1)!}{(b - 1)! a!} = \frac{(a + b - 1)!}{b! a!} [a - b] = \frac{a - b}{a + b} \frac{(a + b)!}{a! b!} = \frac{a - b}{a + b} \binom{a + b}{a}.$$
Dividing by the total number of paths $|\Omega| = \binom{a + b}{a}$:
$$P(A \text{ strictly leads}) = \frac{N_{\text{good}}}{|\Omega|} = \frac{a - b}{a + b}. \quad \blacksquare$$

---

### Example 2.8: Vandermonde's Identity and Hypergeometric Sampling
**Problem:** A software quality assurance team consists of $m = 10$ backend engineers and $w = 15$ frontend engineers. A task force of $k = 5$ engineers is selected uniformly at random.
1. Use Vandermonde's Convolution Identity to express the total number of task force combinations as a sum over the number of backend engineers selected.
2. Calculate the exact probability that the task force contains *at least 3* backend engineers.

**Solution:**
1. Total team size is $n = m + w = 10 + 15 = 25$.
The total number of task force combinations is:
$$|\Omega| = \binom{25}{5} = \frac{25 \times 24 \times 23 \times 22 \times 21}{120} = 53,130.$$
By Vandermonde's Identity:
$$\binom{10 + 15}{5} = \sum_{j=0}^5 \binom{10}{j} \binom{15}{5 - j}.$$
Each term $\binom{10}{j} \binom{15}{5 - j}$ represents the number of ways to choose exactly $j$ backend engineers and $5 - j$ frontend engineers.

2. To have at least 3 backend engineers, $j \in \{3, 4, 5\}$:
- For $j = 3$ backend engineers:
  $$N_3 = \binom{10}{3} \binom{15}{2} = 120 \times 105 = 12,600.$$
- For $j = 4$ backend engineers:
  $$N_4 = \binom{10}{4} \binom{15}{1} = 210 \times 15 = 3,150.$$
- For $j = 5$ backend engineers:
  $$N_5 = \binom{10}{5} \binom{15}{0} = 252 \times 1 = 252.$$

Summing favorable cases:
$$N_{\text{at least 3}} = 12,600 + 3,150 + 252 = 16,002.$$
The probability is:
$$P(\text{At least 3 backend}) = \frac{16,002}{53,130} = \frac{2,667}{8,855} \approx 0.30118 \quad (30.12\%).$$

---

### Example 2.9: Multinomial Expansion and Coefficient Extraction
**Problem:** In the algebraic expansion of the trinomial:
$$(2x - y + 3z)^8$$
1. Find the general term using the Multinomial Theorem.
2. Determine the exact coefficient of the term $x^3 y^2 z^3$.
3. Find the sum of all coefficients in the expansion.

**Solution:**
1. By the Multinomial Theorem:
$$(u + v + w)^8 = \sum_{k_1 + k_2 + k_3 = 8} \binom{8}{k_1, k_2, k_3} u^{k_1} v^{k_2} w^{k_3}.$$
Substituting $u = 2x$, $v = -y$, and $w = 3z$:
$$(2x - y + 3z)^8 = \sum_{k_1 + k_2 + k_3 = 8} \frac{8!}{k_1! k_2! k_3!} (2x)^{k_1} (-y)^{k_2} (3z)^{k_3}.$$
The general term is:
$$T(k_1, k_2, k_3) = \frac{8!}{k_1! k_2! k_3!} 2^{k_1} (-1)^{k_2} 3^{k_3} x^{k_1} y^{k_2} z^{k_3}.$$

2. For the term $x^3 y^2 z^3$, we set $k_1 = 3, k_2 = 2, k_3 = 3$.
Notice $3 + 2 + 3 = 8$.
The multinomial coefficient is:
$$\binom{8}{3, 2, 3} = \frac{8!}{3! \times 2! \times 3!} = \frac{40,320}{6 \times 2 \times 6} = \frac{40,320}{72} = 560.$$
The numerical factor is:
$$2^3 \times (-1)^2 \times 3^3 = 8 \times 1 \times 27 = 216.$$
Multiplying:
$$\text{Coefficient} = 560 \times 216 = 120,960.$$
Thus, the term is $+120,960 x^3 y^2 z^3$.

3. The sum of all coefficients is found by setting all variables to $1$:
$$\text{Sum of coefficients} = (2(1) - (1) + 3(1))^8 = (2 - 1 + 3)^8 = 4^8 = (2^2)^8 = 2^{16} = 65,536.$$

---

### Example 2.10: Secret Santa Exchange and Permutation Cycles
**Problem:** In a company of $n = 8$ employees, names are drawn from a hat for a Secret Santa gift exchange. Each assignment is a bijection from the set of 8 employees to itself (a permutation $\pi \in S_8$).
1. What is the total number of valid Secret Santa assignments such that nobody gives a gift to themselves (i.e., $\pi$ is a derangement)?
2. What is the probability that the gift exchange forms a **single connected cycle of length 8** (where person 1 gives to person 2, ..., person 8 gives to person 1)?

**Solution:**
1. A valid assignment where nobody gives a gift to themselves is a derangement of $n = 8$ items.
Using the derangement formula:
$$!8 = 8! \sum_{k=0}^8 \frac{(-1)^k}{k!}.$$
$$8! = 40,320.$$
Computing the alternating sum:
$$!8 = 40,320 \left[ \frac{1}{2} - \frac{1}{6} + \frac{1}{24} - \frac{1}{120} + \frac{1}{720} - \frac{1}{5,040} + \frac{1}{40,320} \right]$$
$$!8 = 20,160 - 6,720 + 1,680 - 336 + 56 - 8 + 1 = 14,833 \text{ valid assignments}.$$

2. A permutation forms a **single cycle of length 8** if it can be written as $(c_1, c_2, \dots, c_8)$.
The number of distinct cycles of length $n$ in the symmetric group $S_n$ is:
$$N_{\text{single cycle}} = (n - 1)!.$$
*Proof:* Fix person 1 as the anchor of the cycle to eliminate rotational equivalence. The remaining $n - 1$ positions in the cycle can be filled by any permutation of the remaining $n - 1$ people in $(n - 1)!$ ways.
For $n = 8$:
$$N_{\text{single cycle}} = (8 - 1)! = 7! = 5,040.$$
Every single cycle of length 8 is automatically a derangement (contains no 1-cycles / fixed points).
The probability that a uniformly random permutation forms a single cycle is:
$$P(\text{Single Cycle} \mid \text{Uniform } S_8) = \frac{7!}{8!} = \frac{1}{8} = 12.5\%.$$
The conditional probability that a *valid Secret Santa* forms a single cycle is:
$$P(\text{Single Cycle} \mid \text{Derangement}) = \frac{5,040}{14,833} \approx 0.33978 \quad (33.98\%).$$

---

## 2.8 Solved Practice Exercises

---

### Exercise 2.1: Four-of-a-Kind Poker Probability
**Problem:** In a standard 5-card poker hand dealt from a 52-card deck:
1. Derive the combinatorial count of **Four-of-a-Kind** hands.
2. Compute the exact probability of being dealt Four-of-a-Kind.

**Solution:**
1. A Four-of-a-Kind hand consists of all 4 cards of rank $R_1$ and 1 kicker of rank $R_2$ ($R_1 \ne R_2$).
- Choose the rank for the four-of-a-kind: $\binom{13}{1} = 13$ ways.
- Choose all 4 cards of that rank: $\binom{4}{4} = 1$ way.
- Choose the rank of the 5th card (the kicker) from the remaining 12 ranks: $\binom{12}{1} = 12$ ranks.
- Choose 1 of the 4 cards of that rank: $\binom{4}{1} = 4$ ways.
By the Rule of Product:
$$N_{\text{Four-of-a-Kind}} = \binom{13}{1} \binom{4}{4} \times \binom{12}{1} \binom{4}{1} = 13 \times 1 \times 12 \times 4 = 624 \text{ hands}.$$

2. The probability is:
$$P(\text{Four-of-a-Kind}) = \frac{624}{2,598,960} = \frac{1}{4,165} \approx 0.000240096 \quad (0.024\%).$$

---

### Exercise 2.2: Birthday Collision for 99% Certainty
**Problem:** Find the minimum number of people $k$ needed such that the probability of at least one shared birthday exceeds $99\%$ ($P \ge 0.99$).

**Solution:**
Using the exponential approximation:
$$1 - e^{-k^2 / (2 \times 365)} \ge 0.99 \iff e^{-k^2 / 730} \le 0.01.$$
Taking natural logarithms:
$$-\frac{k^2}{730} \le \ln(0.01) = -\ln(100) \approx -4.60517.$$
$$k^2 \ge 730 \times 4.60517 \approx 3,361.77 \implies k \ge \sqrt{3,361.77} \approx 57.98.$$
Rounding up to the nearest integer:
$$k^* = 58 \text{ people}.$$
In a group of only 58 people, there is a $>99\%$ probability of a shared birthday.

---

### Exercise 2.3: Multiset Allocation with Upper Bounds
**Problem:** In how many ways can $k = 12$ identical tasks be allocated to $n = 3$ worker threads such that no thread receives more than 5 tasks ($0 \le x_i \le 5$ for all $i \in \{1, 2, 3\}$)?

**Solution:**
We seek the number of integer solutions to:
$$x_1 + x_2 + x_3 = 12, \quad 0 \le x_i \le 5.$$
We use the Principle of Inclusion-Exclusion.
Let $S$ be the set of all non-negative integer solutions without upper bounds:
$$|S| = \binom{12 + 3 - 1}{3 - 1} = \binom{14}{2} = \frac{14 \times 13}{2} = 91.$$
Let $A_i$ be the property that worker $i$ receives $\ge 6$ tasks ($x_i \ge 6$).
To count $|A_1|$, give 6 tasks to worker 1 upfront. The remaining $12 - 6 = 6$ tasks can be distributed freely:
$$|A_1| = \binom{6 + 3 - 1}{3 - 1} = \binom{8}{2} = \frac{8 \times 7}{2} = 28.$$
By symmetry, $|A_1| = |A_2| = |A_3| = 28$.
Now consider the intersection $|A_1 \cap A_2|$ where both workers 1 and 2 receive $\ge 6$ tasks.
Upfront tasks: $6 + 6 = 12$. Remaining tasks: $12 - 12 = 0$.
$$|A_1 \cap A_2| = \binom{0 + 3 - 1}{3 - 1} = \binom{2}{2} = 1.$$
There are $\binom{3}{2} = 3$ such pairs.
Triple intersection $|A_1 \cap A_2 \cap A_3|$ requires $6 \times 3 = 18 > 12$ tasks, which is impossible ($|A_1 \cap A_2 \cap A_3| = 0$).
By Inclusion-Exclusion, the number of violating solutions is:
$$\left|A_1 \cup A_2 \cup A_3\right| = \sum |A_i| - \sum |A_i \cap A_j| = 3(28) - 3(1) = 84 - 3 = 81.$$
The number of valid solutions satisfying all upper bounds is:
$$N_{\text{valid}} = |S| - \left|A_1 \cup A_2 \cup A_3\right| = 91 - 81 = 10 \text{ configurations}.$$

---

### Exercise 2.4: Permutations with Forbidden Adjacent Pairs
**Problem:** In how many ways can 4 married couples (8 people) be seated in a row of 8 chairs such that no husband sits next to his own wife?

**Solution:**
Total unrestricted seating arrangements: $|\Omega| = 8! = 40,320$.
Let $A_i$ be the event that couple $i$ sits together ($i \in \{1, 2, 3, 4\}$).
Treat couple $i$ as a single block: the block can be ordered internally in $2!$ ways.
There are now 7 entities to arrange:
$$|A_i| = 2! \times 7! = 2 \times 5,040 = 10,080.$$
For two couples $i, j$ sitting together:
$$|A_i \cap A_j| = (2!)^2 \times 6! = 4 \times 720 = 2,880.$$
For three couples:
$$|A_i \cap A_j \cap A_k| = (2!)^3 \times 5! = 8 \times 120 = 960.$$
For all four couples sitting together:
$$|A_1 \cap A_2 \cap A_3 \cap A_4| = (2!)^4 \times 4! = 16 \times 24 = 384.$$
Applying Inclusion-Exclusion:
$$\left|\bigcup_{i=1}^4 A_i\right| = \binom{4}{1}(10,080) - \binom{4}{2}(2,880) + \binom{4}{3}(960) - \binom{4}{4}(384)$$
$$\left|\bigcup_{i=1}^4 A_i\right| = 4(10,080) - 6(2,880) + 4(960) - 1(384) = 40,320 - 17,280 + 3,840 - 384 = 26,496.$$
The number of arrangements where no couple sits together is:
$$N = 8! - 26,496 = 40,320 - 26,496 = 13,824 \text{ arrangements}.$$

---

### Exercise 2.5: Straight Poker Probability
**Problem:** Calculate the exact combinatorial count and probability of a standard **Straight** (5 cards of sequential ranks, not all of the same suit).

**Solution:**
The possible straight sequences are determined by their highest card:
- 5-high (A-2-3-4-5)
- 6-high (2-3-4-5-6)
- ...
- A-high (10-J-Q-K-A)
There are exactly 10 possible rank sequences.
For each of the 5 cards in the sequence, any of the 4 suits may be chosen:
$$\text{Total sequences with suits} = 10 \times 4^5 = 10 \times 1,024 = 10,240.$$
This count includes Straight Flushes (where all 5 cards have the same suit).
There are 4 suits, so there are $10 \times 4 = 40$ straight flushes.
Subtracting straight flushes:
$$N_{\text{Straight}} = 10,240 - 40 = 10,200 \text{ hands}.$$
The probability is:
$$P(\text{Straight}) = \frac{10,200}{2,598,960} \approx 0.00392465 \quad (0.392\%).$$

---

### Exercise 2.6: The Weak Ballot Theorem (Allowing Ties)
**Problem:** In an election, Candidate $A$ receives $a$ votes and Candidate $B$ receives $b$ votes, with $a \ge b$. Prove that the probability that Candidate $A$ remains *weakly ahead* ($S_k \ge 0$, ties allowed) throughout the ballot counting is:
$$P(A \text{ weakly leads}) = \frac{a + 1 - b}{a + 1}.$$

**Solution:**
Add a single fictitious vote for Candidate $A$ at the very beginning of the count.
Now Candidate $A$ has $a + 1$ votes and Candidate $B$ has $b$ votes.
A path from $(0, 0)$ to $(a + b, a - b)$ satisfying $S_k \ge 0$ for all $k$ is in strict 1-to-1 correspondence with a path with the extra initial $A$ vote satisfying $S_k' > 0$ for all $k \in \{1, 2, \dots, a + b + 1\}$.
Applying Bertrand's Ballot Theorem (Example 2.7) with $a' = a + 1$ and $b' = b$:
$$P = \frac{a' - b'}{a' + b'} \times \frac{|\Omega'|}{|\Omega|} = \frac{(a + 1) - b}{(a + 1) + b} \times \frac{\binom{a + b + 1}{a + 1}}{\binom{a + b}{a}}.$$
Notice that:
$$\frac{\binom{a + b + 1}{a + 1}}{\binom{a + b}{a}} = \frac{\frac{(a + b + 1)!}{(a + 1)! b!}}{\frac{(a + b)!}{a! b!}} = \frac{a + b + 1}{a + 1}.$$
Multiplying:
$$P(A \text{ weakly leads}) = \frac{a + 1 - b}{a + b + 1} \times \frac{a + b + 1}{a + 1} = \frac{a + 1 - b}{a + 1}. \quad \blacksquare$$

---

### Exercise 2.7: Derangement Recurrence Relation
**Problem:** Prove algebraically that the number of derangements $D_n = !n$ satisfies the recurrence:
$$D_n = (n - 1)(D_{n-1} + D_{n-2}) \quad \forall n \ge 3.$$

**Solution:**
Consider element 1 in the derangement. Element 1 must be placed in one of the $n - 1$ other positions; say, position $k \in \{2, 3, \dots, n\}$. There are $n - 1$ choices for $k$.
Now consider the fate of element $k$:
- **Case 1 (Element $k$ is placed in position 1):** Elements 1 and $k$ have swapped positions. The remaining $n - 2$ elements must form a derangement among the remaining $n - 2$ positions. There are $D_{n-2}$ ways.
- **Case 2 (Element $k$ is NOT placed in position 1):** Element 1 is in position $k$. Now consider elements $\{2, \dots, n\} \setminus \{k\}$ along with element $k$, which cannot go to position 1. This is equivalent to deranging $n - 1$ elements. There are $D_{n-1}$ ways.

Because these cases are mutually exclusive and exhaustive:
$$D_n = (n - 1)(D_{n-1} + D_{n-2}). \quad \blacksquare$$

---

### Exercise 2.8: Circular Permutations
**Problem:** Find the number of distinct ways to seat $n$ people around a circular dinner table if two seatings are considered identical whenever every person has the exact same neighbors to their left and right (i.e., rotations are identical).

**Solution:**
In a linear row, there are $n!$ arrangements.
For any specific circular arrangement, there are $n$ distinct rotations along the circle that produce the exact same relative neighborhood seating:
$$(\text{Person } 1 \text{ at seat } 1, 2, \dots, n).$$
Dividing by the rotational symmetry factor of $n$:
$$N_{\text{circular}} = \frac{n!}{n} = (n - 1)!.$$
Equivalently, fix person 1 at the top of the table to break rotational symmetry. The remaining $n - 1$ seats can be assigned in $(n - 1)!$ distinct ways. $\blacksquare$

---

### Exercise 2.9: Multinomial Coefficient Extraction
**Problem:** Find the coefficient of $x^2 y^3 z^2$ in the algebraic expansion of:
$$(x - 2y + 3z)^7.$$

**Solution:**
Here $n = 7$, with powers $k_1 = 2, k_2 = 3, k_3 = 2$.
Check sum of powers: $2 + 3 + 2 = 7$.
The multinomial coefficient is:
$$\binom{7}{2, 3, 2} = \frac{7!}{2! \times 3! \times 2!} = \frac{5,040}{2 \times 6 \times 2} = \frac{5,040}{24} = 210.$$
The term is:
$$\binom{7}{2, 3, 2} (x)^2 (-2y)^3 (3z)^2 = 210 \times 1 \times (-8) \times 9 \times x^2 y^3 z^2.$$
Multiplying:
$$\text{Coefficient} = 210 \times (-72) = -15,120.$$

---

### Exercise 2.10: Stirling Numbers of the Second Kind
**Problem:** The Stirling number of the second kind, denoted $\left\{ \begin{matrix} n \\ k \end{matrix} \right\}$ or $S(n, k)$, is the number of ways to partition a set of $n$ labeled objects into $k$ non-empty unlabeled subsets.
Calculate $\left\{ \begin{matrix} 5 \\ 3 \end{matrix} \right\}$, the number of ways to distribute 5 distinct computing jobs across 3 identical processor cores such that no core is idle.

**Solution:**
The explicit formula for Stirling numbers of the second kind via Inclusion-Exclusion is:
$$\left\{ \begin{matrix} n \\ k \end{matrix} \right\} = \frac{1}{k!} \sum_{j=0}^k (-1)^{k - j} \binom{k}{j} j^n.$$
For $n = 5, k = 3$:
$$\left\{ \begin{matrix} 5 \\ 3 \end{matrix} \right\} = \frac{1}{3!} \left[ \binom{3}{0} (-1)^3 0^5 + \binom{3}{1} (-1)^2 1^5 + \binom{3}{2} (-1)^1 2^5 + \binom{3}{3} (-1)^0 3^5 \right].$$
Evaluating the terms:
- $j = 0$: $0$
- $j = 1$: $3 \times 1 \times 1 = 3$
- $j = 2$: $3 \times (-1) \times 32 = -96$
- $j = 3$: $1 \times 1 \times 243 = 243$
Sum inside the bracket:
$$3 - 96 + 243 = 150.$$
Dividing by $3! = 6$:
$$\left\{ \begin{matrix} 5 \\ 3 \end{matrix} \right\} = \frac{150}{6} = 25 \text{ partitions}.$$
There are exactly 25 ways to distribute the 5 jobs across 3 identical cores without idle cores. $\blacksquare$
