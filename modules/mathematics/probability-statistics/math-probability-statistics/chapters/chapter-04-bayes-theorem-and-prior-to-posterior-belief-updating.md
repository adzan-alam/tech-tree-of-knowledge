# Chapter 4: Bayes' Theorem and Prior-to-Posterior Belief Updating

## 4.1 Historical Genesis: Thomas Bayes and Pierre-Simon Laplace

Probability theory was born in the 17th century as a calculus of deductive frequencies—calculating the likelihood of forward events given known mechanical parameters (e.g., *"Given a fair coin with $P(H) = 0.5$, what is the probability of rolling 7 heads in 10 tosses?"*).

However, in the physical sciences, computational perception, and engineering, nature presents us with the exact inverse challenge:
We do not know the true physical parameters of the universe; we only observe the noisy, incomplete sensory consequences.
- An autonomous vehicle does not observe the true obstacle coordinates; it observes noisy LIDAR reflections and camera pixel intensities.
- A medical clinician does not observe the microscopic viral particle count in a patient's bloodstream; they observe a chemical color change on an assay strip.
- A seismologist does not observe the slip displacement along an active fault 15 kilometers underground; they observe accelerometer traces at surface monitoring stations.

How do we invert causality? How do we reason from observed effects back to unobserved causes?

```
+---------------------------------------------------------------------------------------------------+
|                              FORWARD VS INVERSE PROBABILITY                                       |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  FORWARD PROBABILITY (Deductive, Classical):                                                      |
|                 [ Known Model / Parameters θ ]  ======>  [ Predicted Data D ]                     |
|                                                                                                   |
|  INVERSE PROBABILITY (Inductive, Bayesian):                                                       |
|                 [ Observed Sensory Data D ]     ======>  [ Inferred Model θ ]                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

In an essay read before the Royal Society of London in 1763—two years after the death of the English Presbyterian minister **Thomas Bayes**—his friend Richard Price presented Bayes' pioneering solution: *An Essay towards solving a Problem in the Doctrine of Chances*. Independently and with far greater mathematical generality, the French polymath **Pierre-Simon Laplace** formulated the definitive theorem in his 1774 memoir: *Mémoire sur la probabilité des causes par les événements*.

Laplace proved that probability is not merely an objective counting of coin tosses, but the rational mathematical quantification of **degrees of belief under incomplete information**. Bayes' Theorem is the optimal mathematical calculus for updating those beliefs in response to empirical evidence.

---

## 4.2 Derivation of Bayes' Theorem

Bayes' Theorem is not a speculative philosophical heuristic; it is an inescapable mathematical identity derived directly from Kolmogorov's definition of conditional probability and the Law of Total Probability.

### Theorem 4.1: Bayes' Theorem (Two-Event Form)
Let $A$ and $B$ be events in a probability space $(\Omega, \mathcal{F}, P)$ with $P(A) > 0$ and $P(B) > 0$. Then:
$$P(A \mid B) = \frac{P(B \mid A) P(A)}{P(B)}$$

*Proof:*
By the definition of conditional probability (Chapter 3):
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$
Applying the Multiplication Rule to the numerator:
$$P(A \cap B) = P(B \mid A) P(A).$$
Substituting this expression into the numerator yields:
$$P(A \mid B) = \frac{P(B \mid A) P(A)}{P(B)}. \quad \blacksquare$$

### Theorem 4.2: Bayes' Theorem (Partition Form)
Let $\{H_1, H_2, \dots, H_k\}$ be a partition of the sample space $\Omega$ (a mutually exclusive and collectively exhaustive set of competing hypotheses) such that $P(H_i) > 0$ for all $i$. For any observed evidence event $E$ with $P(E) > 0$:
$$P(H_i \mid E) = \frac{P(E \mid H_i) P(H_i)}{\sum_{j=1}^k P(E \mid H_j) P(H_j)}$$

*Proof:*
By Theorem 4.1 applied to hypothesis $H_i$ and evidence $E$:
$$P(H_i \mid E) = \frac{P(E \mid H_i) P(H_i)}{P(E)}.$$
By the Law of Total Probability (Theorem 3.4), the marginal probability of the evidence $P(E)$ across the partition $\{H_1, \dots, H_k\}$ is:
$$P(E) = \sum_{j=1}^k P(E \cap H_j) = \sum_{j=1}^k P(E \mid H_j) P(H_j).$$
Substituting this denominator completes the proof. $\blacksquare$

---

## 4.3 The Anatomy of Bayesian Inference

Bayes' Theorem can be conceptualized as a cognitive engine with four distinct structural components:

```
                                      LIKELIHOOD        PRIOR
                                       P(E | H)   ×   P(H)
                       POSTERIOR  =  -------------------------
                        P(H | E)               P(E)
                                             EVIDENCE
```

```
+---------------------------------------------------------------------------------------------------+
|                                   THE FOUR PILLARS OF BAYES                                       |
+---------------------------------------------------------------------------------------------------+
| Component             | Mathematical Term | Epistemic Role & Physical Meaning                     |
+-----------------------+-------------------+-------------------------------------------------------+
| PRIOR                 | P(H)              | Our degree of belief in hypothesis H BEFORE           |
|                       |                   | observing the current evidence E. Formed from past    |
|                       |                   | experiments, physical constraints, or base rates.     |
+-----------------------+-------------------+-------------------------------------------------------+
| LIKELIHOOD            | P(E | H)          | The probability that nature/sensors would generate     |
|                       |                   | evidence E, assuming hypothesis H is strictly true.   |
|                       |                   | Derived directly from the forward physical model.     |
+-----------------------+-------------------+-------------------------------------------------------+
| EVIDENCE / MARGINAL   | P(E)              | The total probability of observing evidence E across  |
|                       |                   | all conceivable hypotheses: P(E) = ∑ P(E|H_j) P(H_j). |
|                       |                   | Acts as an indispensable normalizing constant.        |
+-----------------------+-------------------+-------------------------------------------------------+
| POSTERIOR             | P(H | E)          | Our revised degree of belief in hypothesis H AFTER    |
|                       |                   | incorporating the observed evidence E.                |
+-----------------------+-------------------+-------------------------------------------------------+
```

Because the evidence denominator $P(E)$ does not depend on any specific hypothesis $H_i$ (it is a constant sum over all candidate hypotheses), Bayes' Theorem is often expressed in its proportional form:
$$\text{Posterior} \propto \text{Likelihood} \times \text{Prior}$$
$$P(H \mid E) \propto P(E \mid H) P(H)$$

This proportionality encapsulates the fundamental principle of scientific learning:
A hypothesis attains a high posterior belief if and only if it was **plausible upfront** (high prior $P(H)$) **AND** it **accurately predicts the observed evidence** (high likelihood $P(E \mid H)$).

---

## 4.4 The Odds Form of Bayes' Rule and the Bayes Factor

In many binary classification problems (e.g., Disease vs Healthy, Spam vs Ham, Signal vs Noise), evaluating the evidence denominator $P(E)$ is computationally redundant. We can express Bayes' Rule in terms of **odds**.

### Definition: Odds
The odds of an event $A$ is the ratio of the probability that $A$ occurs to the probability that $A$ does not occur:
$$O(A) = \frac{P(A)}{P(A^c)} = \frac{P(A)}{1 - P(A)}$$
Conversely, probability can be recovered from odds:
$$P(A) = \frac{O(A)}{1 + O(A)}$$

### Theorem 4.3: The Odds Form of Bayes' Theorem
Let $H_1$ and $H_2$ be two competing hypotheses. The posterior odds of $H_1$ relative to $H_2$ after observing evidence $E$ is:
$$\frac{P(H_1 \mid E)}{P(H_2 \mid E)} = \frac{P(H_1)}{P(H_2)} \times \frac{P(E \mid H_1)}{P(E \mid H_2)}$$

$$\text{Posterior Odds} = \text{Prior Odds} \times \text{Bayes Factor}$$

where the ratio:
$$\text{BF}_{12} = \frac{P(E \mid H_1)}{P(E \mid H_2)}$$
is the **Bayes Factor** (or **Likelihood Ratio**).

*Proof:*
Apply Bayes' Theorem to $H_1$ and $H_2$ individually:
$$P(H_1 \mid E) = \frac{P(E \mid H_1) P(H_1)}{P(E)}$$
$$P(H_2 \mid E) = \frac{P(E \mid H_2) P(H_2)}{P(E)}$$
Dividing the first equation by the second equation, the common denominator $P(E)$ cancels out exactly:
$$\frac{P(H_1 \mid E)}{P(H_2 \mid E)} = \frac{\frac{P(E \mid H_1) P(H_1)}{P(E)}}{\frac{P(E \mid H_2) P(H_2)}{P(E)}} = \frac{P(H_1)}{P(H_2)} \times \frac{P(E \mid H_1)}{P(E \mid H_2)}. \quad \blacksquare$$

### The Log-Odds (Logit) Representation: Additive Evidence
Taking the natural logarithm of both sides:
$$\ln\left(\frac{P(H_1 \mid E)}{P(H_2 \mid E)}\right) = \ln\left(\frac{P(H_1)}{P(H_2)}\right) + \ln\left(\frac{P(E \mid H_1)}{P(E \mid H_2)}\right)$$
$$\text{Log-Posterior Odds} = \text{Log-Prior Odds} + \text{Log-Likelihood Ratio}$$

In log-odds space, Bayesian updating transforms from non-linear multiplication into simple **additive accumulation of evidence**. This formulation is the mathematical foundation of:
- Logistic regression and neural network logits.
- Occupancy grid mapping in autonomous robotics (Moravec-Elfes algorithm).
- Alan Turing's wartime cryptographic cryptanalysis at Bletchley Park using "bans" and "decibans" to crack the Enigma cipher.

---

## 4.5 Recursive Bayesian Updating: Today's Posterior is Tomorrow's Prior

In dynamical physical systems, evidence arrives not as a single isolated snapshot, but as a continuous temporal stream: $E_1, E_2, E_3, \dots, E_t$.
How does an intelligent agent update its beliefs over time?

Suppose an agent possesses prior $P(H)$ and observes first piece of evidence $E_1$.
Applying Bayes' Theorem:
$$P(H \mid E_1) = \frac{P(E_1 \mid H) P(H)}{P(E_1)}.$$
Now suppose a second piece of evidence $E_2$ arrives.
Conditioning on both observations $E_1$ and $E_2$:
$$P(H \mid E_1 \cap E_2) = \frac{P(E_1 \cap E_2 \mid H) P(H)}{P(E_1 \cap E_2)}.$$
Using the Multiplication Rule: $P(E_1 \cap E_2 \mid H) = P(E_2 \mid H \cap E_1) P(E_1 \mid H)$:
$$P(H \mid E_1 \cap E_2) = \frac{P(E_2 \mid H \cap E_1) P(E_1 \mid H) P(H)}{P(E_2 \mid E_1) P(E_1)} = \frac{P(E_2 \mid H \cap E_1)}{P(E_2 \mid E_1)} \left[ \frac{P(E_1 \mid H) P(H)}{P(E_1)} \right].$$
Notice the term in the brackets is precisely $P(H \mid E_1)$!
Therefore:
$$P(H \mid E_1 \cap E_2) = \frac{P(E_2 \mid H \cap E_1) P(H \mid E_1)}{P(E_2 \mid E_1)}$$

```
+---------------------------------------------------------------------------------------------------+
|                            THE RECURSIVE BAYESIAN FILTER CYCLE                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|              [ PRIOR P(H) ]                                                                       |
|                     |                                                                             |
|                     v  + Evidence E_1                                                             |
|           [ POSTERIOR P(H | E_1) ]  ======>  Acts as NEW PRIOR for next step                      |
|                     |                                                                             |
|                     v  + Evidence E_2                                                             |
|         [ POSTERIOR P(H | E_1, E_2) ] ======> Acts as NEW PRIOR for next step                     |
|                     |                                                                             |
|                     v  + Evidence E_3                                                             |
|                    ...                                                                            |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

If observations are conditionally independent given $H$ ($E_1 \perp E_2 \mid H$), then $P(E_2 \mid H \cap E_1) = P(E_2 \mid H)$, and the update reduces to:
$$P(H \mid E_1 \cap E_2) = \frac{P(E_2 \mid H) P(H \mid E_1)}{P(E_2 \mid E_1)}.$$
This recursive property proves that a Bayesian agent does not need to store the historical archive of all past raw measurements. The current posterior distribution serves as a **sufficient statistic** summarizing all past information.

---

## 4.6 Real-World Applications and Cognitive Traps

### 1. The Base-Rate Fallacy in Medical Diagnostics
Consider a rare, severe genetic condition affecting $1$ in $1,000$ individuals in the general population (prior prevalence $P(D) = 0.001$).
A biomedical diagnostic screening test boasts high laboratory metrics:
- **Sensitivity (True Positive Rate):** $P(T^+ \mid D) = 0.99$ ($99\%$ of infected patients test positive).
- **Specificity (True Negative Rate):** $P(T^- \mid D^c) = 0.98$ ($98\%$ of healthy patients test negative; false positive rate $P(T^+ \mid D^c) = 0.02$).

A patient randomly selected from the general population tests positive ($T^+$).
What is the actual probability that the patient has the condition?

Most people (including a startling majority of practicing physicians in empirical psychological studies) intuitively guess $\approx 95\%$ to $98\%$.
Let us evaluate using Bayes' Theorem:
$$P(D \mid T^+) = \frac{P(T^+ \mid D) P(D)}{P(T^+ \mid D) P(D) + P(T^+ \mid D^c) P(D^c)}.$$
Substitute the exact parameters:
- Numerator (True Positives): $0.99 \times 0.001 = 0.00099$.
- False Positives: $0.02 \times (1 - 0.001) = 0.02 \times 0.999 = 0.01998$.
- Total Positive Tests: $P(T^+) = 0.00099 + 0.01998 = 0.02097$.
Now calculate the posterior:
$$P(D \mid T^+) = \frac{0.00099}{0.02097} \approx 0.0472 \quad (4.72\%!).$$
Even after testing positive on a $99\%$ accurate test, the probability that the patient actually has the disease is **under 5%**!

*Why?* Out of $100,000$ people:
- $100$ have the disease; $99$ of them test positive.
- $99,900$ are healthy; $2\%$ of them ($1,998$ people) test positive as false alarms.
Among all $99 + 1,998 = 2,097$ positive test results, the $1,998$ healthy false alarms overwhelmingly dwarf the $99$ true cases by twenty to one!

### 2. The Naive Bayes Classifier Architecture
In natural language processing and spam classification, an email is represented as a high-dimensional vector of word tokens $\mathbf{w} = (w_1, w_2, \dots, w_V)$.
We wish to classify whether the email belongs to class $C \in \{\text{Spam}, \text{Ham}\}$.
By Bayes' Theorem:
$$P(C \mid \mathbf{w}) = \frac{P(\mathbf{w} \mid C) P(C)}{P(\mathbf{w})}.$$
The **Naive Bayes Assumption** posits that conditioned on the document class $C$, all word tokens are conditionally independent:
$$P(\mathbf{w} \mid C) = \prod_{j=1}^V P(w_j \mid C).$$
The optimal decision rule selects the class maximizing the posterior:
$$\hat{C} = \arg\max_{C} \left[ P(C) \prod_{j=1}^V P(w_j \mid C) \right].$$
In practice, taking the product of hundreds of probabilities between $0$ and $1$ triggers catastrophic floating-point underflow ($10^{-300} \to 0$). We take logarithms to transform the product into an inner product of log-likelihoods:
$$\hat{C} = \arg\max_{C} \left[ \ln P(C) + \sum_{j=1}^V \ln P(w_j \mid C) \right].$$

---

## 4.7 Worked Examples: First-Principles Solutions

---

### Example 4.1: Two-Stage Confirmatory Medical Screening
**Problem:** A patient undergoes screening for a rare medical condition with population prevalence $P(D) = 0.001$ ($1$ in $1,000$).
The laboratory screening test has:
- Sensitivity: $P(T_1^+ \mid D) = 0.99$
- Specificity: $P(T_1^- \mid D^c) = 0.98$ (false positive rate $P(T_1^+ \mid D^c) = 0.02$).
1. Compute the posterior probability $P(D \mid T_1^+)$ after the patient tests positive on Test 1.
2. Because the first test is positive, the clinician immediately orders a second, independent confirmatory test $T_2$ with identical characteristics:
   $$P(T_2^+ \mid D) = 0.99, \quad P(T_2^+ \mid D^c) = 0.02.$$
   Assume $T_1$ and $T_2$ are conditionally independent given disease status ($T_1 \perp T_2 \mid D$).
   Using the recursive Bayesian framework, compute the revised posterior probability $P(D \mid T_1^+ \cap T_2^+)$ after the second test also returns positive.

**Solution:**
1. **Stage 1 Update:**
Applying Bayes' Theorem with prior $P(D) = 0.001$:
$$P(D \mid T_1^+) = \frac{P(T_1^+ \mid D) P(D)}{P(T_1^+ \mid D) P(D) + P(T_1^+ \mid D^c) P(D^c)}.$$
Substitute the numbers:
$$\text{Numerator} = 0.99 \times 0.001 = 0.00099.$$
$$\text{Denominator} = (0.99 \times 0.001) + (0.02 \times 0.999) = 0.00099 + 0.01998 = 0.02097.$$
$$P(D \mid T_1^+) = \frac{0.00099}{0.02097} \approx 0.04721 \quad (4.72\%).$$
The patient's belief that they have the disease rises from $0.1\%$ to $4.72\%$.

2. **Stage 2 Update (Recursive Bayesian Filtering):**
The posterior from Stage 1 now becomes the **prior** for Stage 2:
$$P_{\text{new}}(D) = P(D \mid T_1^+) \approx 0.04721.$$
$$P_{\text{new}}(D^c) = 1 - 0.04721 = 0.95279.$$
Now condition on the second positive test result $T_2^+$:
$$P(D \mid T_1^+ \cap T_2^+) = \frac{P(T_2^+ \mid D) P_{\text{new}}(D)}{P(T_2^+ \mid D) P_{\text{new}}(D) + P(T_2^+ \mid D^c) P_{\text{new}}(D^c)}.$$
Substitute the updated values:
$$\text{Numerator} = 0.99 \times 0.04721 \approx 0.046738.$$
$$\text{Denominator} = (0.99 \times 0.04721) + (0.02 \times 0.95279) = 0.046738 + 0.019056 = 0.065794.$$
$$P(D \mid T_1^+ \cap T_2^+) = \frac{0.046738}{0.065794} \approx 0.71037 \quad (71.04\%!).$$
*Clinical Takeaway:* While a single positive test in a low-prevalence setting leaves the patient predominantly healthy ($4.72\%$ true positive), a second independent positive test dramatically surges the posterior belief to $71.04\%$. Sequential independent testing is essential for high-confidence diagnostics.

---

### Example 4.2: Naive Bayes Classification with Laplace Smoothing
**Problem:** An automated email filter evaluates incoming messages to classify them as either **Spam** ($S$) or **Ham** (legitimate, $H$).
Training data across $10,000$ historical emails establishes:
- Prior probability of Spam: $P(S) = 0.20 \implies P(H) = 0.80$.
The conditional word likelihoods $P(w_i \mid C)$ learned from the corpus are:
- Word $w_1 =$ "free": $P(\text{"free"} \mid S) = 0.60, \quad P(\text{"free"} \mid H) = 0.05$.
- Word $w_2 =$ "wire": $P(\text{"wire"} \mid S) = 0.40, \quad P(\text{"wire"} \mid H) = 0.01$.
- Word $w_3 =$ "meeting": $P(\text{"meeting"} \mid S) = 0.02, \quad P(\text{"meeting"} \mid H) = 0.30$.
A new email arrives containing the message: *"Free wire transfer meeting"*.
Assuming the Naive Bayes conditional independence model:
1. Compute the unnormalized posterior scores in log-space.
2. Compute the exact normalized posterior probability $P(S \mid \text{message})$.
3. Determine the final classification label.

**Solution:**
1. Under the Naive Bayes assumption:
$$\text{Score}(C) = \ln P(C) + \sum_{j=1}^3 \ln P(w_j \mid C).$$
- **For Spam ($S$):**
  $$\ln P(S) = \ln(0.20) \approx -1.6094$$
  $$\ln P(\text{"free"} \mid S) = \ln(0.60) \approx -0.5108$$
  $$\ln P(\text{"wire"} \mid S) = \ln(0.40) \approx -0.9163$$
  $$\ln P(\text{"meeting"} \mid S) = \ln(0.02) \approx -3.9120$$
  $$\text{Score}(S) = -1.6094 - 0.5108 - 0.9163 - 3.9120 = -6.9485.$$
  In linear likelihood:
  $$L(S) = e^{-6.9485} = 0.20 \times 0.60 \times 0.40 \times 0.02 = 0.00096.$$

- **For Ham ($H$):**
  $$\ln P(H) = \ln(0.80) \approx -0.2231$$
  $$\ln P(\text{"free"} \mid H) = \ln(0.05) \approx -2.9957$$
  $$\ln P(\text{"wire"} \mid H) = \ln(0.01) \approx -4.6052$$
  $$\ln P(\text{"meeting"} \mid H) = \ln(0.30) \approx -1.2040$$
  $$\text{Score}(H) = -0.2231 - 2.9957 - 4.6052 - 1.2040 = -9.0280.$$
  In linear likelihood:
  $$L(H) = e^{-9.0280} = 0.80 \times 0.05 \times 0.01 \times 0.30 = 0.00012.$$

2. Applying the normalizing evidence denominator:
$$P(E) = L(S) + L(H) = 0.00096 + 0.00012 = 0.00108.$$
The posterior probability of Spam is:
$$P(S \mid \text{message}) = \frac{L(S)}{P(E)} = \frac{0.00096}{0.00108} = \frac{96}{108} = \frac{8}{9} \approx 0.8889 \quad (88.89\%).$$
$$P(H \mid \text{message}) = 1 - 0.8889 = 0.1111 \quad (11.11\%).$$

3. Because $P(S \mid \text{message}) = 88.89\% > 50\%$, the classifier labels the email as **Spam**.

---

### Example 4.3: Discrete Grid Robot Localization via Bayes Filter
**Problem:** An autonomous warehouse robot navigates along a 1D corridor consisting of 4 discrete grid cells: $\{x_1, x_2, x_3, x_4\}$.
Initially, the robot's position is completely unknown; it has a uniform prior distribution:
$$P(x_i) = 0.25 \quad \forall i \in \{1, 2, 3, 4\}.$$
The physical corridor features an obstacle (a metal pillar) located at cell $x_2$.
The robot is equipped with a noisy proximity sensor $S$.
- If the robot is in cell $x_2$ (at the pillar): $P(S = \text{Pillar} \mid x_2) = 0.90$.
- If the robot is in any other cell ($x_1, x_3, x_4$): $P(S = \text{Pillar} \mid x_i) = 0.10$ (false reflection noise).
The robot activates its sensor and observes $S = \text{Pillar}$.
Compute the updated belief distribution over all 4 cells.

**Solution:**
We apply Bayes' Theorem for each candidate position $x_i$:
$$P(x_i \mid S = \text{Pillar}) = \frac{P(S = \text{Pillar} \mid x_i) P(x_i)}{P(S = \text{Pillar})}.$$
Compute the unnormalized likelihood $\times$ prior products:
- For $x_1$: $L(x_1) = 0.10 \times 0.25 = 0.025$.
- For $x_2$: $L(x_2) = 0.90 \times 0.25 = 0.225$.
- For $x_3$: $L(x_3) = 0.10 \times 0.25 = 0.025$.
- For $x_4$: $L(x_4) = 0.10 \times 0.25 = 0.025$.

Compute the total marginal evidence $P(S = \text{Pillar})$ by summing over all cells:
$$P(S = \text{Pillar}) = \sum_{i=1}^4 L(x_i) = 0.025 + 0.225 + 0.025 + 0.025 = 0.300.$$
Now normalize each cell:
- $P(x_1 \mid S = \text{Pillar}) = \frac{0.025}{0.300} = \frac{1}{12} \approx 0.0833 \quad (8.33\%)$.
- $P(x_2 \mid S = \text{Pillar}) = \frac{0.225}{0.300} = \frac{9}{12} = \frac{3}{4} = 0.7500 \quad (75.00\%)$.
- $P(x_3 \mid S = \text{Pillar}) = \frac{0.025}{0.300} = \frac{1}{12} \approx 0.0833 \quad (8.33\%)$.
- $P(x_4 \mid S = \text{Pillar}) = \frac{0.025}{0.300} = \frac{1}{12} \approx 0.0833 \quad (8.33\%)$.

Check normalization: $0.0833 + 0.7500 + 0.0833 + 0.0833 = 1.000$.
The robot's confidence that it is at cell $x_2$ surged from a prior of $25\%$ to a posterior of $75\%$.

---

### Example 4.4: Beta-Binomial Conjugate Updating for Coin Bias
**Problem:** A manufacturing engineer inspects a machine producing mechanical fasteners. The probability of producing a defective fastener is an unknown parameter $\theta \in [0, 1]$.
The engineer expresses their prior uncertainty via a **Beta distribution** with hyperparameters $\alpha = 2, \beta = 8$:
$$p(\theta) = \frac{1}{\text{B}(\alpha, \beta)} \theta^{\alpha - 1} (1 - \theta)^{\beta - 1} = \frac{\Gamma(10)}{\Gamma(2)\Gamma(8)} \theta^1 (1 - \theta)^7.$$
The engineer draws a batch of $n = 20$ fasteners and observes $k = 4$ defective fasteners.
1. Derive the analytical formula for the posterior distribution $p(\theta \mid k)$.
2. Identify the updated hyperparameters $\alpha_{\text{post}}$ and $\beta_{\text{post}}$.
3. Compute the prior mean and the posterior mean of $\theta$.

**Solution:**
1. The binomial likelihood of observing $k = 4$ defects in $n = 20$ trials given parameter $\theta$ is:
$$p(k \mid \theta) = \binom{n}{k} \theta^k (1 - \theta)^{n - k} = \binom{20}{4} \theta^4 (1 - \theta)^{16}.$$
Applying Bayes' Theorem for continuous parameters:
$$p(\theta \mid k) \propto p(k \mid \theta) p(\theta).$$
Substituting the likelihood and prior:
$$p(\theta \mid k) \propto \left[ \theta^k (1 - \theta)^{n - k} \right] \times \left[ \theta^{\alpha - 1} (1 - \theta)^{\beta - 1} \right] = \theta^{(\alpha + k) - 1} (1 - \theta)^{(\beta + n - k) - 1}.$$
Notice that the functional form is identically another Beta distribution! This proves that the Beta family is **conjugate** to the Binomial likelihood.

2. The updated hyperparameters are:
$$\alpha_{\text{post}} = \alpha + k = 2 + 4 = 6.$$
$$\beta_{\text{post}} = \beta + (n - k) = 8 + (20 - 4) = 8 + 16 = 24.$$
Therefore:
$$\theta \mid k \sim \text{Beta}(6, 24).$$

3. The expectation of a Beta distribution $\text{Beta}(a, b)$ is given by $E[\theta] = \frac{a}{a + b}$.
- **Prior Mean:**
  $$E[\theta]_{\text{prior}} = \frac{\alpha}{\alpha + \beta} = \frac{2}{2 + 8} = \frac{2}{10} = 0.20 \quad (20.0\%).$$
- **Sample Mean:**
  $$\bar{\theta} = \frac{k}{n} = \frac{4}{20} = 0.20 \quad (20.0\%).$$
- **Posterior Mean:**
  $$E[\theta]_{\text{post}} = \frac{\alpha_{\text{post}}}{\alpha_{\text{post}} + \beta_{\text{post}}} = \frac{6}{6 + 24} = \frac{6}{30} = 0.20 \quad (20.0\%).$$
Notice that the posterior mean is a weighted combination of the prior mean and sample mean:
$$E[\theta]_{\text{post}} = \frac{\alpha + k}{\alpha + \beta + n} = \left(\frac{\alpha + \beta}{\alpha + \beta + n}\right) \left(\frac{\alpha}{\alpha + \beta}\right) + \left(\frac{n}{\alpha + \beta + n}\right) \left(\frac{k}{n}\right) = \left(\frac{10}{30}\right)(0.20) + \left(\frac{20}{30}\right)(0.20) = 0.20.$$
As the sample size $n \to \infty$, the weight on the prior vanishes, and the posterior converges to the sample mean.

---

### Example 4.5: The Monty Hall Paradox via Bayes' Table
**Problem:** Formulate the classic 3-door Monty Hall problem rigorously using Bayes' Theorem.
Let $C \in \{1, 2, 3\}$ be the location of the car ($P(C = i) = \frac{1}{3}$).
The contestant chooses Door 1.
Monty Hall opens Door 3, revealing a goat ($E = \text{"Host opens Door 3"}$).
Compute $P(C = 1 \mid E)$ and $P(C = 2 \mid E)$ using an explicit Bayesian update table.

**Solution:**
Monty Hall's actions are constrained:
- He never opens Door 1 (the contestant's choice).
- He never opens the door hiding the car.
- If he has a choice of two goat doors, he picks uniformly at random ($p = 0.5$).

Let us evaluate the likelihood $P(E \mid C = i)$ for each hypothesis:
1. **Hypothesis $C = 1$:** The car is behind Door 1.
   Both Door 2 and Door 3 conceal goats. Monty flips a coin between Doors 2 and 3:
   $$P(E \mid C = 1) = \frac{1}{2}.$$
2. **Hypothesis $C = 2$:** The car is behind Door 2.
   Door 1 is chosen by the contestant. Door 2 has the car.
   Monty is *forced* to open Door 3:
   $$P(E \mid C = 2) = 1.0.$$
3. **Hypothesis $C = 3$:** The car is behind Door 3.
   Monty cannot reveal the car! Therefore:
   $$P(E \mid C = 3) = 0.0.$$

Now construct the Bayesian update table:

```
+---------------------------------------------------------------------------------------------------+
| Hypothesis C_i | Prior P(C_i) | Likelihood P(E | C_i) | Unnormalized Joint | Posterior P(C_i | E) |
+----------------+--------------+-----------------------+--------------------+----------------------+
| C = 1 (Door 1) | 1/3          | 1/2                   | 1/6                | (1/6)/(1/2) = 1/3    |
| C = 2 (Door 2) | 1/3          | 1                     | 1/3 = 2/6          | (2/6)/(1/2) = 2/3    |
| C = 3 (Door 3) | 1/3          | 0                     | 0                  | 0                    |
+----------------+--------------+-----------------------+--------------------+----------------------+
| TOTAL (EVIDENCE)| 1.0         |                       | P(E) = 3/6 = 1/2   | 1.0                  |
+---------------------------------------------------------------------------------------------------+
```

- Posterior probability of winning by staying: $P(C = 1 \mid E) = \frac{1}{3} \approx 33.3\%$.
- Posterior probability of winning by switching: $P(C = 2 \mid E) = \frac{2}{3} \approx 66.7\%$.
Bayes' Theorem confirms with mathematical finality that switching doubles the probability of winning.

---

### Example 4.6: Multi-Sensor Autonomous Target Identification
**Problem:** An autonomous defense turret monitors airspace for an incoming airborne target. The target is either a **Hostile Drone** ($H$, prior $P(H) = 0.05$) or a **Civilian Aircraft** ($C = H^c$, prior $P(C) = 0.95$).
The turret incorporates two independent sensor modalities:
1. **Radar Profile ($R$):**
   - $P(R = \text{Fast} \mid H) = 0.85$
   - $P(R = \text{Fast} \mid C) = 0.10$
2. **Infrared Thermal Signature ($I$):**
   - $P(I = \text{Hot} \mid H) = 0.90$
   - $P(I = \text{Hot} \mid C) = 0.05$
The sensors observe $E = \{R = \text{Fast}, I = \text{Hot}\}$. Assuming conditional independence ($R \perp I \mid H$ and $R \perp I \mid C$):
1. Compute the Bayes Factor for each sensor individually.
2. Compute the joint Bayes Factor for both sensors combined.
3. Compute the final posterior probability $P(H \mid E)$.

**Solution:**
1. **Individual Bayes Factors:**
- **Radar Bayes Factor:**
  $$\text{BF}_R = \frac{P(R = \text{Fast} \mid H)}{P(R = \text{Fast} \mid C)} = \frac{0.85}{0.10} = 8.5.$$
- **Infrared Bayes Factor:**
  $$\text{BF}_I = \frac{P(I = \text{Hot} \mid H)}{P(I = \text{Hot} \mid C)} = \frac{0.90}{0.05} = 18.0.$$

2. **Combined Bayes Factor:**
By conditional independence:
$$P(E \mid H) = P(R = \text{Fast} \mid H) \times P(I = \text{Hot} \mid H) = 0.85 \times 0.90 = 0.765.$$
$$P(E \mid C) = P(R = \text{Fast} \mid C) \times P(I = \text{Hot} \mid C) = 0.10 \times 0.05 = 0.005.$$
The combined Bayes Factor is the product of the individual Bayes Factors:
$$\text{BF}_{\text{combined}} = \frac{0.765}{0.005} = 153.0 = \text{BF}_R \times \text{BF}_I = 8.5 \times 18.0 = 153.0.$$

3. **Odds-Form Update:**
Prior Odds of Hostile vs Civilian:
$$O_{\text{prior}} = \frac{P(H)}{P(C)} = \frac{0.05}{0.95} = \frac{1}{19} \approx 0.05263.$$
Applying Theorem 4.3 (Odds Form of Bayes' Theorem):
$$O_{\text{post}} = O_{\text{prior}} \times \text{BF}_{\text{combined}} = \frac{1}{19} \times 153.0 = \frac{153}{19} \approx 8.0526.$$
Converting posterior odds back to probability:
$$P(H \mid E) = \frac{O_{\text{post}}}{1 + O_{\text{post}}} = \frac{8.0526}{1 + 8.0526} = \frac{8.0526}{9.0526} \approx 0.8895 \quad (88.95\%).$$
Fusing the two sensors raises our confidence that the target is hostile from a prior of $5.0\%$ to a commanding posterior of $88.95\%$.

---

### Example 4.7: Minimum Specificity for Diagnostic Utility
**Problem:** In a mass screening program for a virus with prevalence $\theta = 0.005$ ($0.5\%$), health officials require that a positive test result must mean the patient is *more likely infected than healthy* ($P(D \mid T^+) > 0.50$, positive predictive value $> 50\%$).
Assume the test has fixed sensitivity $P(T^+ \mid D) = 0.98$.
What is the minimum test specificity $s = P(T^- \mid D^c)$ required to satisfy this regulatory condition?

**Solution:**
From Bayes' Theorem:
$$P(D \mid T^+) = \frac{P(T^+ \mid D) P(D)}{P(T^+ \mid D) P(D) + P(T^+ \mid D^c) P(D^c)}.$$
Let $s$ be the specificity, so the false positive rate is $P(T^+ \mid D^c) = 1 - s$.
We require:
$$\frac{0.98 \times 0.005}{(0.98 \times 0.005) + (1 - s) \times 0.995} > 0.50.$$
Notice that a fraction $\frac{A}{A + B} > 0.50 \iff A > B$.
Therefore:
$$0.98 \times 0.005 > (1 - s) \times 0.995.$$
Evaluating the left-hand side:
$$0.98 \times 0.005 = 0.0049.$$
$$0.0049 > 0.995(1 - s) \iff 1 - s < \frac{0.0049}{0.995} \approx 0.0049246.$$
Solving for $s$:
$$s > 1 - 0.0049246 = 0.9950754 \approx 99.51\%.$$
*Public Health Takeaway:* In low-prevalence screening ($0.5\%$), an ordinary $98\%$ specific test is completely useless (producing over $70\%$ false alarms). The test specificity must exceed $99.51\%$ simply for a positive test to be more likely true than false.

---

### Example 4.8: Log-Odds Occupancy Grid Mapping
**Problem:** An autonomous mapping robot models an environment grid cell as a binary state $M \in \{1, 0\}$ (Occupied vs Free).
Initially, the robot has no knowledge: $P(M = 1) = 0.5 \implies \text{Log-Prior} = \ln(0.5 / 0.5) = 0$.
The robot takes 3 consecutive ultrasonic range readings of the cell.
The sensor model provides log-likelihood ratios $\Delta L = \ln\left(\frac{P(z \mid M = 1)}{P(z \mid M = 0)}\right)$:
- Reading 1 ($z_1 = \text{Obstacle}$): $\Delta L_1 = +1.2$.
- Reading 2 ($z_2 = \text{Obstacle}$): $\Delta L_2 = +0.8$.
- Reading 3 ($z_3 = \text{Clear}$): $\Delta L_3 = -0.6$.
Compute the log-odds and the final occupancy probability of the cell after all 3 measurements.

**Solution:**
In log-odds space, evidence updates additively:
$$L_t = L_0 + \sum_{i=1}^3 \Delta L_i.$$
- $L_0 = 0.0$.
- After reading 1: $L_1 = 0.0 + 1.2 = +1.2$.
- After reading 2: $L_2 = 1.2 + 0.8 = +2.0$.
- After reading 3: $L_3 = 2.0 - 0.6 = +1.4$.

The final log-odds is $L_3 = 1.4$.
To convert log-odds back to probability:
$$P(M = 1 \mid z_{1:3}) = \frac{1}{1 + e^{-L_3}} = \frac{1}{1 + e^{-1.4}} = \frac{1}{1 + 0.246597} = \frac{1}{1.246597} \approx 0.8022 \quad (80.22\%).$$
The cell has an $80.22\%$ probability of being occupied.

---

### Example 4.9: Forensic DNA Island Problem
**Problem:** A crime is committed on an isolated island with $N = 10,001$ inhabitants (the perpetrator plus $10,000$ innocent citizens).
A DNA profile left at the scene is found to match a suspect.
The laboratory reports that the DNA profile frequency in the population is $p = 1 / 1,000$.
Assume that prior to the DNA match, all $10,001$ inhabitants were equally likely to be the perpetrator ($P(\text{Guilty}) = \frac{1}{10,001}$).
Calculate the posterior probability that the suspect is guilty.

**Solution:**
Let $G$ be the event that the suspect is guilty, and $I$ be the event that the suspect is innocent.
- $P(G) = \frac{1}{10,001}$.
- $P(I) = \frac{10,000}{10,001}$.
The likelihood of a DNA match ($M$) is:
- $P(M \mid G) = 1.0$ (the true perpetrator always matches).
- $P(M \mid I) = p = \frac{1}{1,000} = 0.001$.

Applying Bayes' Theorem:
$$P(G \mid M) = \frac{P(M \mid G) P(G)}{P(M \mid G) P(G) + P(M \mid I) P(I)}.$$
Substitute the numbers:
$$\text{Numerator} = 1.0 \times \frac{1}{10,001} = \frac{1}{10,001}.$$
$$\text{Denominator} = \left(1.0 \times \frac{1}{10,001}\right) + \left(\frac{1}{1,000} \times \frac{10,000}{10,001}\right) = \frac{1}{10,001} + \frac{10}{10,001} = \frac{11}{10,001}.$$
Dividing numerator by denominator:
$$P(G \mid M) = \frac{\frac{1}{10,001}}{\frac{11}{10,001}} = \frac{1}{11} \approx 0.0909 \quad (9.09\%).$$
Even with a DNA match whose random match probability is $1$ in $1,000$, the suspect is only $9.09\%$ likely to be guilty, because among the $10,000$ innocent citizens, we expect $10,000 \times \frac{1}{1,000} = 10$ innocent individuals to match by sheer chance!

---

### Example 4.10: Sequential Tracking of a Loaded Die
**Problem:** A magician has two dice in his pocket:
- Die $A$ is a fair six-sided die ($P(6 \mid A) = \frac{1}{6}$).
- Die $B$ is a loaded die where a $6$ lands with probability $\frac{1}{2}$ ($P(6 \mid B) = \frac{1}{2}$).
The magician picks one die at random ($P(A) = P(B) = 0.5$) and rolls it repeatedly.
The sequence of outcomes is: $6, 6, 6$.
Compute the posterior probability that the chosen die is the loaded die after each of the three successive $6$s.

**Solution:**
We use recursive Bayesian updating:
- **Prior:** $P_0(B) = 0.5 \implies \text{Prior Odds } O_0 = 1.0$.
The Bayes Factor for rolling a $6$ is:
$$\text{BF} = \frac{P(6 \mid B)}{P(6 \mid A)} = \frac{1/2}{1/6} = 3.0.$$

- **After Roll 1 ($6$):**
  $$O_1 = O_0 \times \text{BF} = 1.0 \times 3.0 = 3.0.$$
  $$P_1(B) = \frac{O_1}{1 + O_1} = \frac{3}{1 + 3} = \frac{3}{4} = 0.7500 \quad (75.0\%).$$

- **After Roll 2 ($6$):**
  $$O_2 = O_1 \times \text{BF} = 3.0 \times 3.0 = 9.0.$$
  $$P_2(B) = \frac{O_2}{1 + O_2} = \frac{9}{1 + 9} = \frac{9}{10} = 0.9000 \quad (90.0\%).$$

- **After Roll 3 ($6$):**
  $$O_3 = O_2 \times \text{BF} = 9.0 \times 3.0 = 27.0.$$
  $$P_3(B) = \frac{O_3}{1 + O_3} = \frac{27}{1 + 27} = \frac{27}{28} \approx 0.9643 \quad (96.43\%).$$
After three consecutive sixes, the probability that the magician chose the loaded die reaches $96.43\%$.

---

## 4.8 Solved Practice Exercises

---

### Exercise 4.1: Positive Predictive Value Sensitivity to Prevalence
**Problem:** Prove analytically that for any diagnostic test with fixed sensitivity $S_e > 0$ and specificity $S_p < 1$, the Positive Predictive Value:
$$\text{PPV}(\theta) = \frac{S_e \theta}{S_e \theta + (1 - S_p)(1 - \theta)}$$
is a strictly increasing function of the prevalence $\theta \in (0, 1)$ ($d\text{PPV}/d\theta > 0$).

**Solution:**
Divide numerator and denominator by $S_e \theta$:
$$\text{PPV}(\theta) = \frac{1}{1 + \left(\frac{1 - S_p}{S_e}\right) \left(\frac{1 - \theta}{\theta}\right)} = \frac{1}{1 + C \cdot f(\theta)},$$
where $C = \frac{1 - S_p}{S_e} > 0$ is a strictly positive constant, and $f(\theta) = \frac{1 - \theta}{\theta} = \frac{1}{\theta} - 1$.
Differentiating $f(\theta)$ with respect to $\theta$:
$$f'(\theta) = -\frac{1}{\theta^2} < 0 \quad \forall \theta \in (0, 1).$$
Thus, $f(\theta)$ is strictly decreasing as $\theta$ increases.
As $f(\theta)$ decreases, the denominator $1 + C f(\theta)$ strictly decreases.
Because the denominator is strictly positive and decreasing, the reciprocal fraction $\text{PPV}(\theta)$ is strictly increasing:
$$\frac{d}{d\theta} \text{PPV}(\theta) > 0. \quad \blacksquare$$

---

### Exercise 4.2: Harold Jeffreys' Scale of Evidence
**Problem:** Sir Harold Jeffreys proposed an empirical scale for interpreting the Bayes Factor $\text{BF}_{10}$:
- $\text{BF} \in [1, 3]$: Barely worth mentioning.
- $\text{BF} \in [3, 10]$: Substantial evidence.
- $\text{BF} \in [10, 30]$: Strong evidence.
- $\text{BF} \in [30, 100]$: Very strong evidence.
- $\text{BF} > 100$: Decisive evidence.
If an astronomical spectral observation yields $\text{BF}_{10} = 45$ favoring the presence of an exoplanet atmosphere ($H_1$) over abiotic noise ($H_0$), and the prior odds were $1:10$ ($P(H_1) = 1/11$), compute the posterior probability $P(H_1 \mid E)$.

**Solution:**
Prior odds:
$$O_0 = \frac{P(H_1)}{P(H_0)} = \frac{1/11}{10/11} = \frac{1}{10} = 0.10.$$
Applying the Odds Form of Bayes' Rule:
$$O_{\text{post}} = O_0 \times \text{BF}_{10} = 0.10 \times 45 = 4.5.$$
Converting posterior odds to probability:
$$P(H_1 \mid E) = \frac{O_{\text{post}}}{1 + O_{\text{post}}} = \frac{4.5}{1 + 4.5} = \frac{4.5}{5.5} = \frac{9}{11} \approx 0.8182 \quad (81.82\%).$$
The observation provides "very strong" evidence, shifting the belief from $\approx 9.1\%$ to $81.82\%$.

---

### Exercise 4.3: Three-Hypotheses Geological Classification
**Problem:** A mining sensor classifies mineral samples into three categories: Gold ore ($G$, prior $0.02$), Silver ore ($S$, prior $0.08$), and Basalt waste rock ($W$, prior $0.90$).
A multi-spectral laser reflection measurement $X$ yields:
- $P(X \mid G) = 0.80$
- $P(X \mid S) = 0.30$
- $P(X \mid W) = 0.05$
Calculate the posterior probability that a sample is Gold ore given measurement $X$.

**Solution:**
Applying Bayes' Theorem for three hypotheses:
$$P(G \mid X) = \frac{P(X \mid G) P(G)}{P(X \mid G) P(G) + P(X \mid S) P(S) + P(X \mid W) P(W)}.$$
Compute the products:
- Gold: $0.80 \times 0.02 = 0.016$.
- Silver: $0.30 \times 0.08 = 0.024$.
- Basalt: $0.05 \times 0.90 = 0.045$.
Sum of marginal evidence:
$$P(X) = 0.016 + 0.024 + 0.045 = 0.085.$$
Posterior probability of Gold:
$$P(G \mid X) = \frac{0.016}{0.085} = \frac{16}{85} \approx 0.1882 \quad (18.82\%).$$
Posterior probability of Silver:
$$P(S \mid X) = \frac{0.024}{0.085} = \frac{24}{85} \approx 0.2824 \quad (28.24\%).$$
Posterior probability of Basalt:
$$P(W \mid X) = \frac{0.045}{0.085} = \frac{45}{85} \approx 0.5294 \quad (52.94\%).$$
Even with a high-intensity return, Basalt remains the single most likely classification ($52.9\%$) due to its dominant prior.

---

### Exercise 4.4: Laplace's Rule of Succession
**Problem:** Suppose an event with unknown probability $\theta$ has occurred $k$ times in $n$ independent trials. Assuming a uniform prior distribution $\theta \sim \mathcal{U}(0, 1) \equiv \text{Beta}(1, 1)$, prove **Laplace's Rule of Succession**:
$$P(\text{Success on trial } n + 1 \mid k \text{ successes in } n \text{ trials}) = \frac{k + 1}{n + 2}.$$

**Solution:**
The prior is $\text{Beta}(1, 1)$, so $\alpha = 1, \beta = 1$.
After observing $k$ successes and $n - k$ failures, by Beta-Binomial conjugacy (Example 4.4), the posterior distribution is:
$$\theta \mid k \sim \text{Beta}(\alpha + k, \beta + n - k) = \text{Beta}(k + 1, n - k + 1).$$
The probability of success on the next trial is the expected value of $\theta$ under this posterior distribution:
$$P(\text{Next is Success} \mid k) = E[\theta \mid k] = \int_0^1 \theta \cdot p(\theta \mid k) \, d\theta.$$
For a $\text{Beta}(a, b)$ distribution, the expectation is $\frac{a}{a + b}$.
Here $a = k + 1$ and $b = n - k + 1$.
Therefore:
$$E[\theta \mid k] = \frac{k + 1}{(k + 1) + (n - k + 1)} = \frac{k + 1}{n + 2}. \quad \blacksquare$$
*Famous Historical Context:* Laplace used this formula to calculate the probability that the sun will rise tomorrow, given that it has risen every day for the last 5,000 years ($n \approx 1,826,200$).

---

### Exercise 4.5: Posterior Mode (MAP) of Beta-Binomial Distribution
**Problem:** For the posterior distribution $\theta \sim \text{Beta}(\alpha + k, \beta + n - k)$ with $\alpha + k > 1$ and $\beta + n - k > 1$:
Derive the **Maximum A Posteriori (MAP)** estimate $\hat{\theta}_{\text{MAP}} = \arg\max_\theta p(\theta \mid k)$.

**Solution:**
The posterior density is proportional to:
$$p(\theta \mid k) \propto \theta^{\alpha + k - 1} (1 - \theta)^{\beta + n - k - 1}.$$
Taking the natural logarithm:
$$\ln p(\theta \mid k) = (\alpha + k - 1) \ln\theta + (\beta + n - k - 1) \ln(1 - \theta) + \text{constant}.$$
Differentiating with respect to $\theta$ and setting the derivative to zero:
$$\frac{d}{d\theta} \ln p(\theta \mid k) = \frac{\alpha + k - 1}{\theta} - \frac{\beta + n - k - 1}{1 - \theta} = 0.$$
Cross-multiplying:
$$(\alpha + k - 1)(1 - \theta) = (\beta + n - k - 1)\theta.$$
$$(\alpha + k - 1) - (\alpha + k - 1)\theta = (\beta + n - k - 1)\theta.$$
$$(\alpha + k - 1) = [(\alpha + k - 1) + (\beta + n - k - 1)]\theta = (\alpha + \beta + n - 2)\theta.$$
Solving for $\theta$:
$$\hat{\theta}_{\text{MAP}} = \frac{\alpha + k - 1}{\alpha + \beta + n - 2}. \quad \blacksquare$$

---

### Exercise 4.6: Gaussian-Gaussian Conjugate Bayesian Update
**Problem:** An unknown physical quantity $\mu$ is measured using an instrument with known sensor noise variance $\sigma^2$: $x \sim \mathcal{N}(\mu, \sigma^2)$.
The prior belief regarding $\mu$ is Gaussian: $\mu \sim \mathcal{N}(\mu_0, \sigma_0^2)$.
Prove that the posterior distribution $p(\mu \mid x)$ is Gaussian $\mathcal{N}(\mu_1, \sigma_1^2)$ with precision parameters:
$$\frac{1}{\sigma_1^2} = \frac{1}{\sigma_0^2} + \frac{1}{\sigma^2}, \quad \mu_1 = \sigma_1^2 \left( \frac{\mu_0}{\sigma_0^2} + \frac{x}{\sigma^2} \right).$$

**Solution:**
The prior PDF is:
$$p(\mu) \propto \exp\left(-\frac{(\mu - \mu_0)^2}{2\sigma_0^2}\right).$$
The likelihood of observation $x$ given $\mu$ is:
$$p(x \mid \mu) \propto \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right).$$
By Bayes' Theorem:
$$p(\mu \mid x) \propto p(x \mid \mu) p(\mu) \propto \exp\left( -\frac{1}{2} \left[ \frac{(\mu - \mu_0)^2}{\sigma_0^2} + \frac{(\mu - x)^2}{\sigma^2} \right] \right).$$
Expand the quadratic terms in the exponent:
$$\frac{\mu^2 - 2\mu\mu_0 + \mu_0^2}{\sigma_0^2} + \frac{\mu^2 - 2\mu x + x^2}{\sigma^2} = \mu^2 \left(\frac{1}{\sigma_0^2} + \frac{1}{\sigma^2}\right) - 2\mu \left(\frac{\mu_0}{\sigma_0^2} + \frac{x}{\sigma^2}\right) + \text{terms independent of } \mu.$$
Let $\frac{1}{\sigma_1^2} = \frac{1}{\sigma_0^2} + \frac{1}{\sigma^2}$.
Completing the square in $\mu$:
$$\frac{1}{\sigma_1^2} \left[ \mu^2 - 2\mu \sigma_1^2 \left(\frac{\mu_0}{\sigma_0^2} + \frac{x}{\sigma^2}\right) \right] = \frac{(\mu - \mu_1)^2}{\sigma_1^2} + \text{constant},$$
where $\mu_1 = \sigma_1^2 \left(\frac{\mu_0}{\sigma_0^2} + \frac{x}{\sigma^2}\right)$.
Thus:
$$p(\mu \mid x) \propto \exp\left(-\frac{(\mu - \mu_1)^2}{2\sigma_1^2}\right),$$
which is identically $\mathcal{N}(\mu_1, \sigma_1^2)$. $\blacksquare$

---

### Exercise 4.7: The Zero-Frequency Problem in Naive Bayes
**Problem:** In training a Naive Bayes spam classifier, a rare word $w^*$ appears zero times in the legitimate email training corpus ($N_{\text{Ham}} = 1,000$).
Explain why empirical maximum likelihood estimation ($P(w^* \mid H) = 0$) causes a catastrophic failure on future emails, and how Laplace add-one smoothing resolves it.

**Solution:**
Under empirical maximum likelihood, $P(w^* \mid H) = \frac{0}{1,000} = 0$.
In future classification, the posterior is proportional to the product:
$$P(H \mid \mathbf{w}) \propto P(H) \prod_{j=1}^V P(w_j \mid H).$$
If a future email contains $w^*$, the term $P(w^* \mid H) = 0$ acts as a **multiplicative veto**:
$$P(H \mid \mathbf{w}) = 0,$$
regardless of how many thousands of other strongly legitimate words (e.g., "mom", "meeting", "invoice") are present.
Laplace Add-One Smoothing adds a pseudo-count of 1 to every vocabulary word:
$$P(w_i \mid C) = \frac{N_{C, i} + 1}{N_C + |V|},$$
where $|V|$ is the total vocabulary size.
This ensures $P(w^* \mid H) > 0$ for all words, eliminating veto singularities. $\blacksquare$

---

### Exercise 4.8: The Uninformed Monty Hall Variant
**Problem:** Suppose Monty Hall does *not* know what is behind the doors. After the contestant chooses Door 1, Monty opens Door 3 completely at random. By pure luck, Door 3 reveals a goat.
Compute the probability of winning by switching to Door 2 under this uninformed host scenario.

**Solution:**
Let $C \in \{1, 2, 3\}$ be the location of the car ($P(C = i) = 1/3$).
Let $E$ be the event that Monty opens Door 3 *and reveals a goat*.
Since Monty chooses between Door 2 and Door 3 uniformly at random ($p = 0.5$) without knowing the contents:
- If $C = 1$: Door 3 has a goat. Monty opens Door 3 with probability $1/2$:
  $$P(E \mid C = 1) = \frac{1}{2}.$$
- If $C = 2$: Door 3 has a goat. Monty opens Door 3 with probability $1/2$:
  $$P(E \mid C = 2) = \frac{1}{2}.$$
- If $C = 3$: Door 3 has the car! Monty opening Door 3 reveals the car, not a goat:
  $$P(E \mid C = 3) = 0.$$

Applying Bayes' Theorem:
$$P(C = 1 \mid E) = \frac{(1/2)(1/3)}{(1/2)(1/3) + (1/2)(1/3) + (0)(1/3)} = \frac{1/6}{1/6 + 1/6} = \frac{1/6}{2/6} = \frac{1}{2}.$$
$$P(C = 2 \mid E) = \frac{(1/2)(1/3)}{2/6} = \frac{1}{2}.$$
Under the uninformed host scenario, switching provides zero advantage ($50/50$).
*Insight:* The advantage of switching in the standard Monty Hall problem arises purely from the host's informed agency filtering out negative evidence.

---

### Exercise 4.9: Negative Predictive Value (NPV)
**Problem:** In the medical screening scenario of Example 4.1 ($P(D) = 0.001$, sensitivity $S_e = 0.99$, specificity $S_p = 0.98$):
Calculate the **Negative Predictive Value** (NPV), the probability that a patient who tests negative is truly healthy ($P(D^c \mid T^-)$).

**Solution:**
From Bayes' Theorem:
$$P(D^c \mid T^-) = \frac{P(T^- \mid D^c) P(D^c)}{P(T^- \mid D^c) P(D^c) + P(T^- \mid D) P(D)}.$$
We are given:
- $P(D^c) = 0.999$, $P(D) = 0.001$.
- Specificity: $P(T^- \mid D^c) = 0.98$.
- False Negative Rate: $P(T^- \mid D) = 1 - S_e = 1 - 0.99 = 0.01$.
Substitute the values:
$$\text{Numerator} = 0.98 \times 0.999 = 0.97902.$$
$$\text{Denominator} = (0.98 \times 0.999) + (0.01 \times 0.001) = 0.97902 + 0.00001 = 0.97903.$$
$$P(D^c \mid T^-) = \frac{0.97902}{0.97903} \approx 0.9999898 \quad (99.999\%).$$
A negative test result provides near-absolute certainty that the patient is healthy.

---

### Exercise 4.10: Information Gain and Expected Entropy Reduction
**Problem:** Let $H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$ denote the Shannon entropy of a hypothesis distribution.
Prove that for any evidence observation $Y$, the expected conditional entropy is strictly bounded by the prior entropy:
$$E_Y [H(X \mid Y)] \le H(X),$$
with equality if and only if $X$ and $Y$ are stochastically independent.

**Solution:**
The difference between prior entropy and expected posterior entropy is the **Mutual Information** $I(X; Y)$:
$$I(X; Y) = H(X) - E_Y [H(X \mid Y)] = \sum_{x, y} P(x, y) \log_2\left(\frac{P(x, y)}{P(x) P(y)}\right) = D_{\text{KL}}(P(X, Y) \parallel P(X)P(Y)).$$
By Gibbs' Inequality (or Jensen's Inequality applied to the strictly concave function $\log_2$):
The Kullback-Leibler divergence $D_{\text{KL}}(P \parallel Q) \ge 0$ for any valid probability distributions $P$ and $Q$, with equality if and only if $P = Q$.
Since $D_{\text{KL}} \ge 0$:
$$H(X) - E_Y [H(X \mid Y)] \ge 0 \implies E_Y [H(X \mid Y)] \le H(X).$$
Equality holds if and only if $P(x, y) = P(x)P(y)$ for all $x, y$ (stochastic independence).
*Significance:* On average, Bayesian updating is guaranteed to reduce uncertainty (entropy). Observing evidence cannot increase expected uncertainty. $\blacksquare$
