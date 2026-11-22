# Chapter 11: Statistical Estimation: Maximum Likelihood (MLE) and Bayesian MAP

> *"The purpose of statistical estimation is not to invent certainty where none exists, but to construct optimal mathematical sieves that extract the maximum quantity of truth from finite, noisy data."*  
> — **Ronald Aylmer Fisher**, *On the Mathematical Foundations of Theoretical Statistics* (1922)

---

## 11.1 Likelihood and Log-Likelihood: Parametric Inversion

In pure probability theory, we assume a known data-generating distribution $P$ and deduce the probability of observing various data realizations $\mathbf{x}$. In mathematical statistics and machine learning, we face the inverse problem: **we observe empirical data $\mathbf{x}$ and must infer the underlying parameters $\theta$ that generated it.**

### 11.1.1 Parametric Statistical Models

A **parametric statistical model** is a formal triplet $(\mathcal{X}, \mathcal{F}, \mathcal{P})$, where:
- $\mathcal{X} \subseteq \mathbb{R}^n$ is the sample space of observable datasets.
- $\mathcal{F}$ is the $\sigma$-algebra of observable events.
- $\mathcal{P} = \{P_\theta : \theta \in \Theta\}$ is a family of candidate probability distributions indexed by a parameter vector $\theta$ residing in a parameter space $\Theta \subseteq \mathbb{R}^d$.

Let $\mathbf{X} = (X_1, X_2, \dots, X_n)$ be a vector of independent, identically distributed (i.i.d.) observations sampled from an unknown true distribution $P_{\theta_0} \in \mathcal{P}$, with density or mass function $f(x; \theta)$.

### 11.1.2 The Likelihood Function

When the parameter $\theta$ is fixed, $f(\mathbf{x}; \theta)$ is a probability density over $\mathbf{x}$. However, once data $\mathbf{x} = (x_1, \dots, x_n)$ has been observed, $\mathbf{x}$ is fixed and constant.  
The **likelihood function** $L: \Theta \to [0, \infty)$ reverses the roles of data and parameters:
$$
L(\theta; \mathbf{x}) = \prod_{i=1}^n f(x_i; \theta)
$$

> [!WARNING]
> **Likelihood is Not a Probability Distribution on $\Theta$:** The likelihood function $L(\theta; \mathbf{x})$ evaluates the plausibility of parameter $\theta$ given the data. It does **not** integrate to 1 over $\Theta$ ($\int_\Theta L(\theta; \mathbf{x}) d\theta \neq 1$), and $L(\theta; \mathbf{x})$ is **not** the probability of $\theta$. In frequentist statistics, $\theta$ is a fixed, deterministic unknown, not a random variable.

### 11.1.3 The Log-Likelihood Function and Numerical Stability

In computational implementations, computing the raw likelihood $L(\theta; \mathbf{x})$ by multiplying $n$ small probabilities quickly leads to numerical underflow (e.g., $10^{-300} \to 0$). Because the natural logarithm is a strictly monotonically increasing function on $(0, \infty)$, maximizing the product is mathematically equivalent to maximizing the sum of logarithms:
$$
\ell(\theta; \mathbf{x}) = \ln L(\theta; \mathbf{x}) = \sum_{i=1}^n \ln f(x_i; \theta)
$$

The log-likelihood $\ell(\theta; \mathbf{x})$ converts multiplicative probability models into additive linear structures, making differentiation and numerical optimization dramatically more tractable.

```
       Probability Density f(x; theta)   vs.   Likelihood Function L(theta; x)
       Fixed theta, Variable x                 Fixed x (Observed), Variable theta
            f(x; theta)                              L(theta; x)
                ^                                        ^
              / | \                                    / | \    <-- Peak = theta_MLE
             /  |  \                                  /  |  \
            /   |   \                                /   |   \
           +----+----+----> x                       +----+----+----> theta
          Area under curve = 1                     Integral NOT equal to 1!
```

### 11.1.4 The Score Function: Gradient of Belief

The sensitivity of the log-likelihood to variations in $\theta$ is measured by the **score function** $S(\theta)$, defined as the gradient of the log-likelihood:
$$
S(\theta) = \nabla_\theta \ell(\theta; \mathbf{X}) = \sum_{i=1}^n \nabla_\theta \ln f(X_i; \theta)
$$

#### Theorem: Zero Expected Score
Under standard regularity conditions (allowing the interchange of differentiation and integration), the expected value of the score function evaluated at the true parameter $\theta_0$ is identically zero:
$$
\mathbb{E}_{\theta_0}[S(\theta_0)] = \mathbf{0}
$$

*Proof:*  
For a single observation $X$:
$$
\mathbb{E}_\theta[\nabla_\theta \ln f(X; \theta)] = \int_{\mathcal{X}} \left( \nabla_\theta \ln f(x; \theta) \right) f(x; \theta) \, dx
$$
Using the chain rule $\nabla_\theta \ln f(x; \theta) = \frac{\nabla_\theta f(x; \theta)}{f(x; \theta)}$:
$$
= \int_{\mathcal{X}} \frac{\nabla_\theta f(x; \theta)}{f(x; \theta)} f(x; \theta) \, dx = \int_{\mathcal{X}} \nabla_\theta f(x; \theta) \, dx
$$
Interchanging integration and gradient:
$$
= \nabla_\theta \left( \int_{\mathcal{X}} f(x; \theta) \, dx \right) = \nabla_\theta (1) = \mathbf{0}
$$
Summing over $n$ i.i.d. observations yields $\mathbb{E}[S(\theta)] = \sum_{i=1}^n \mathbf{0} = \mathbf{0}$. $\blacksquare$

---

## 11.2 Maximum Likelihood Estimation (MLE)

The principle of **Maximum Likelihood Estimation**, championed by R. A. Fisher in 1922, dictates that the optimal estimate of an unknown parameter $\theta$ is that value which renders the observed data most probable.

### 11.2.1 The MLE Optimization Problem

The **Maximum Likelihood Estimator (MLE)** is defined as:
$$
\hat{\theta}_{\text{MLE}} = \arg\max_{\theta \in \Theta} L(\theta; \mathbf{x}) = \arg\max_{\theta \in \Theta} \ell(\theta; \mathbf{x})
$$

When $\ell(\theta; \mathbf{x})$ is smooth and strictly concave over an unconstrained interior parameter domain $\Theta$, $\hat{\theta}_{\text{MLE}}$ is found by solving the **likelihood equations**:
$$
S(\hat{\theta}) = \nabla_\theta \ell(\hat{\theta}; \mathbf{x}) = \mathbf{0}
$$
subject to the negative-definite Hessian condition $\nabla_\theta^2 \ell(\hat{\theta}; \mathbf{x}) \prec 0$.

### 11.2.2 Canonical Examples of MLE

#### 1. Bernoulli Parameter $p$:
For $X_i \sim \text{Bernoulli}(p)$ with $k = \sum_{i=1}^n x_i$:
$$
\ell(p) = \sum_{i=1}^n [x_i \ln p + (1 - x_i) \ln(1 - p)] = k \ln p + (n - k) \ln(1 - p)
$$
Setting the score to zero:
$$
\frac{d\ell}{dp} = \frac{k}{p} - \frac{n - k}{1 - p} = 0 \implies k(1 - p) = (n - k)p \implies k = np \implies \hat{p}_{\text{MLE}} = \frac{k}{n} = \bar{X}
$$

#### 2. Poisson Parameter $\lambda$:
For $X_i \sim \text{Pois}(\lambda)$:
$$
\ell(\lambda) = \sum_{i=1}^n [x_i \ln \lambda - \lambda - \ln(x_i!)] = \ln \lambda \sum_{i=1}^n x_i - n\lambda - \sum_{i=1}^n \ln(x_i!)
$$
Setting the derivative to zero:
$$
\frac{d\ell}{d\lambda} = \frac{1}{\lambda} \sum_{i=1}^n x_i - n = 0 \implies \hat{\lambda}_{\text{MLE}} = \frac{1}{n} \sum_{i=1}^n x_i = \bar{X}
$$

#### 3. Exponential Parameter $\lambda$:
For $X_i \sim \text{Exp}(\lambda)$ with density $f(x) = \lambda e^{-\lambda x}$:
$$
\ell(\lambda) = \sum_{i=1}^n [\ln \lambda - \lambda x_i] = n \ln \lambda - \lambda \sum_{i=1}^n x_i
$$
$$
\frac{d\ell}{d\lambda} = \frac{n}{\lambda} - \sum_{i=1}^n x_i = 0 \implies \hat{\lambda}_{\text{MLE}} = \frac{n}{\sum_{i=1}^n x_i} = \frac{1}{\bar{X}}
$$

---

## 11.3 Estimator Properties: Bias, Consistency, and Bessel’s Correction

An estimator $\hat{\theta}_n = g(X_1, \dots, X_n)$ is a rule (a function of the data) for guessing the unknown true parameter $\theta$. Because the data $\mathbf{X}$ is random, $\hat{\theta}_n$ is itself a **random variable** with its own sampling distribution. We evaluate estimators through three fundamental criteria: **bias**, **variance**, and **consistency**.

### 11.3.1 Bias and Unbiasedness

The **bias** of an estimator $\hat{\theta}$ is the difference between its expected value and the true parameter value:
$$
\text{Bias}(\hat{\theta}) = \mathbb{E}[\hat{\theta}] - \theta
$$
- An estimator is **unbiased** if $\text{Bias}(\hat{\theta}) = 0$, meaning $\mathbb{E}[\hat{\theta}] = \theta$ for all $\theta \in \Theta$.
- An estimator is **asymptotically unbiased** if $\lim_{n \to \infty} \mathbb{E}[\hat{\theta}_n] = \theta$.

### 11.3.2 The Mean Squared Error (MSE) Bias-Variance Decomposition

The overall quality of an estimator is gauged by its **Mean Squared Error (MSE)**:
$$
\text{MSE}(\hat{\theta}) = \mathbb{E}[(\hat{\theta} - \theta)^2]
$$

#### Theorem: Bias-Variance Decomposition
$$
\text{MSE}(\hat{\theta}) = \text{Var}(\hat{\theta}) + \big(\text{Bias}(\hat{\theta})\big)^2
$$

*Proof:*  
Add and subtract $\mathbb{E}[\hat{\theta}]$ inside the square:
$$
\begin{aligned}
\mathbb{E}[(\hat{\theta} - \theta)^2] &= \mathbb{E}\left[ \big( (\hat{\theta} - \mathbb{E}[\hat{\theta}]) + (\mathbb{E}[\hat{\theta}] - \theta) \big)^2 \right] \\
&= \mathbb{E}\left[ (\hat{\theta} - \mathbb{E}[\hat{\theta}])^2 \right] + 2 \mathbb{E}\left[ (\hat{\theta} - \mathbb{E}[\hat{\theta}])(\mathbb{E}[\hat{\theta}] - \theta) \right] + (\mathbb{E}[\hat{\theta}] - \theta)^2
\end{aligned}
$$
Because $(\mathbb{E}[\hat{\theta}] - \theta) = \text{Bias}(\hat{\theta})$ is a constant deterministic scalar:
$$
\mathbb{E}[(\hat{\theta} - \mathbb{E}[\hat{\theta}])(\mathbb{E}[\hat{\theta}] - \theta)] = (\mathbb{E}[\hat{\theta}] - \theta) \underbrace{\mathbb{E}[\hat{\theta} - \mathbb{E}[\hat{\theta}]]}_{= 0} = 0
$$
Thus:
$$
\text{MSE}(\hat{\theta}) = \text{Var}(\hat{\theta}) + \text{Bias}^2(\hat{\theta}) \quad \blacksquare
$$

### 11.3.3 Bessel’s Correction: The Bias of the Gaussian Variance MLE

Consider i.i.d. observations $X_1, \dots, X_n \sim \mathcal{N}(\mu, \sigma^2)$ where both $\mu$ and $\sigma^2$ are unknown.  
The Maximum Likelihood Estimator for variance is:
$$
\hat{\sigma}_{\text{MLE}}^2 = \frac{1}{n} \sum_{i=1}^n (X_i - \bar{X})^2
$$

What is the expected value of $\hat{\sigma}_{\text{MLE}}^2$?  
Expand the sum of squares:
$$
\sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n \left( (X_i - \mu) - (\bar{X} - \mu) \right)^2 = \sum_{i=1}^n (X_i - \mu)^2 - n(\bar{X} - \mu)^2
$$
Taking expectations on both sides:
$$
\mathbb{E}\left[ \sum_{i=1}^n (X_i - \bar{X})^2 \right] = \sum_{i=1}^n \mathbb{E}[(X_i - \mu)^2] - n \mathbb{E}[(\bar{X} - \mu)^2]
$$
By definition, $\mathbb{E}[(X_i - \mu)^2] = \sigma^2$, and $\mathbb{E}[(\bar{X} - \mu)^2] = \text{Var}(\bar{X}) = \frac{\sigma^2}{n}$.  
Substituting:
$$
\mathbb{E}\left[ \sum_{i=1}^n (X_i - \bar{X})^2 \right] = n\sigma^2 - n\left(\frac{\sigma^2}{n}\right) = n\sigma^2 - \sigma^2 = (n - 1)\sigma^2
$$
Dividing by $n$:
$$
\mathbb{E}[\hat{\sigma}_{\text{MLE}}^2] = \frac{n - 1}{n} \sigma^2
$$

The Maximum Likelihood Estimator systematically **underestimates** the true variance by a factor of $\frac{n - 1}{n}$!  
This occurs because the deviations are measured relative to the empirical sample mean $\bar{X}$ (which is chosen specifically to minimize the sum of squared errors), rather than the true theoretical mean $\mu$. This consumes exactly **one degree of freedom**.

To create an unbiased estimator, Friedrich Bessel applied the correction factor $\frac{n}{n - 1}$:
$$
s^2 = \frac{n}{n - 1} \hat{\sigma}_{\text{MLE}}^2 = \frac{1}{n - 1} \sum_{i=1}^n (X_i - \bar{X})^2
$$
$$
\mathbb{E}[s^2] = \frac{n}{n - 1} \left( \frac{n - 1}{n} \sigma^2 \right) = \sigma^2
$$
The quantity $s^2$ is the canonical **unbiased sample variance**.

---

## 11.4 Fisher Information and the Cramér-Rao Lower Bound (CRLB)

How accurate can an unbiased estimator possibly be? Is there a theoretical fundamental limit on minimum achievable variance, akin to the speed of light in physics?  
The **Cramér-Rao Lower Bound (CRLB)** establishes this universal bound.

### 11.4.1 Fisher Information

The **Fisher Information** $\mathcal{I}(\theta)$ measures the curvature of the log-likelihood function. If the log-likelihood is sharply curved around the peak, small changes in $\theta$ cause dramatic drops in probability, meaning the data contains abundant information about $\theta$. If the log-likelihood is flat, the data carries minimal information.

For a single observation $X$, the Fisher Information is defined as the variance of the score:
$$
\mathcal{I}_1(\theta) = \mathbb{E}\left[ (S(X; \theta))^2 \right] = \mathbb{E}\left[ \left( \frac{\partial}{\partial \theta} \ln f(X; \theta) \right)^2 \right]
$$

#### Theorem: Second-Derivative Form of Fisher Information
Under standard regularity conditions:
$$
\mathcal{I}_1(\theta) = -\mathbb{E}\left[ \frac{\partial^2}{\partial \theta^2} \ln f(X; \theta) \right]
$$

*Proof:*  
Differentiate the identity $\int f(x; \theta) \frac{\partial}{\partial \theta} \ln f(x; \theta) \, dx = 0$ with respect to $\theta$:
$$
\int \left[ \frac{\partial f(x; \theta)}{\partial \theta} \frac{\partial \ln f(x; \theta)}{\partial \theta} + f(x; \theta) \frac{\partial^2 \ln f(x; \theta)}{\partial \theta^2} \right] dx = 0
$$
Since $\frac{\partial f(x; \theta)}{\partial \theta} = f(x; \theta) \frac{\partial \ln f(x; \theta)}{\partial \theta}$:
$$
\int f(x; \theta) \left( \frac{\partial \ln f(x; \theta)}{\partial \theta} \right)^2 dx + \int f(x; \theta) \frac{\partial^2 \ln f(x; \theta)}{\partial \theta^2} \, dx = 0
$$
$$
\mathbb{E}\left[ \left( \frac{\partial \ln f(X; \theta)}{\partial \theta} \right)^2 \right] = -\mathbb{E}\left[ \frac{\partial^2 \ln f(X; \theta)}{\partial \theta^2} \right] \quad \blacksquare
$$

For $n$ independent observations, Fisher Information is additive:
$$
\mathcal{I}_n(\theta) = n \mathcal{I}_1(\theta)
$$

### 11.4.2 The Cramér-Rao Inequality

#### Theorem: Cramér-Rao Lower Bound (CRLB)
Let $X_1, \dots, X_n$ be i.i.d. observations with joint density $f(\mathbf{x}; \theta)$, and let $\hat{\theta} = g(\mathbf{X})$ be any unbiased estimator of $\theta$ ($\mathbb{E}[\hat{\theta}] = \theta$). Then:
$$
\text{Var}(\hat{\theta}) \ge \frac{1}{\mathcal{I}_n(\theta)} = \frac{1}{n \mathcal{I}_1(\theta)}
$$

*Proof via Cauchy-Schwarz:*  
Recall the Cauchy-Schwarz inequality for random variables: $(\text{Cov}(U, V))^2 \le \text{Var}(U)\text{Var}(V)$.  
Let $U = \hat{\theta}$ and $V = S(\theta) = \frac{\partial \ell}{\partial \theta}$.  
Since $\mathbb{E}[V] = 0$, the covariance is:
$$
\text{Cov}(\hat{\theta}, S(\theta)) = \mathbb{E}[\hat{\theta} S(\theta)] = \int \hat{\theta}(\mathbf{x}) \left( \frac{\nabla_\theta f(\mathbf{x}; \theta)}{f(\mathbf{x}; \theta)} \right) f(\mathbf{x}; \theta) \, d\mathbf{x} = \nabla_\theta \int \hat{\theta}(\mathbf{x}) f(\mathbf{x}; \theta) \, d\mathbf{x}
$$
Because $\hat{\theta}$ is unbiased, $\int \hat{\theta}(\mathbf{x}) f(\mathbf{x}; \theta) \, d\mathbf{x} = \mathbb{E}[\hat{\theta}] = \theta$. Thus:
$$
\text{Cov}(\hat{\theta}, S(\theta)) = \nabla_\theta(\theta) = 1
$$
Applying Cauchy-Schwarz:
$$
1^2 \le \text{Var}(\hat{\theta}) \text{Var}(S(\theta)) = \text{Var}(\hat{\theta}) \mathcal{I}_n(\theta)
$$
Dividing by $\mathcal{I}_n(\theta) > 0$ yields:
$$
\text{Var}(\hat{\theta}) \ge \frac{1}{\mathcal{I}_n(\theta)} \quad \blacksquare
$$

An unbiased estimator that achieves equality in the CRLB ($\text{Var}(\hat{\theta}) = \frac{1}{\mathcal{I}_n(\theta)}$) is termed an **efficient estimator**.

### 11.4.3 Asymptotic Optimality of the MLE

The crowning theoretical triumph of Maximum Likelihood Estimation is that, under broad regularity conditions, **the MLE is asymptotically efficient**:
$$
\sqrt{n}(\hat{\theta}_{\text{MLE}} - \theta_0) \xrightarrow{d} \mathcal{N}\left(0, \; \frac{1}{\mathcal{I}_1(\theta_0)}\right)
$$
As $n \to \infty$, no competing estimator can achieve a smaller asymptotic variance than the MLE!

---

## 11.5 Maximum A Posteriori (MAP) Estimation and Conjugate Priors

In the frequentist MLE paradigm, parameters are fixed constants, and probability refers solely to long-run frequencies of data. In the **Bayesian paradigm**, the parameter $\theta$ is itself a random variable endowed with a **prior distribution** $p(\theta)$ reflecting our state of belief before seeing data.

### 11.5.1 The MAP Formulation

By Bayes' Theorem, observing data $\mathbf{x}$ updates our prior belief $p(\theta)$ into the **posterior distribution** $p(\theta \mid \mathbf{x})$:
$$
p(\theta \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid \theta) p(\theta)}{p(\mathbf{x})} = \frac{L(\theta; \mathbf{x}) p(\theta)}{\int_\Theta L(\theta'; \mathbf{x}) p(\theta') \, d\theta'} \propto L(\theta; \mathbf{x}) p(\theta)
$$

The **Maximum A Posteriori (MAP)** estimator chooses the parameter value that maximizes the posterior density:
$$
\hat{\theta}_{\text{MAP}} = \arg\max_{\theta \in \Theta} p(\theta \mid \mathbf{x}) = \arg\max_{\theta \in \Theta} [L(\theta; \mathbf{x}) p(\theta)]
$$
Taking logarithms:
$$
\hat{\theta}_{\text{MAP}} = \arg\max_{\theta \in \Theta} \big[ \ell(\theta; \mathbf{x}) + \ln p(\theta) \big]
$$

```
              Comparison: MLE vs. MAP Estimation
       Log-Likelihood ell(theta)   Prior ln p(theta)       Posterior ln p(theta|x)
              Peak = theta_MLE           Peak = theta_0          Peak = theta_MAP
                   ^                         ^                         ^
                 / | \                     / | \                     / | \
                /  |  \                   /  |  \                   /  |  \
               +---+---+-> theta         +---+---+-> theta         +---+---+-> theta
         theta_MAP is pulled toward the prior mode (Regularization Effect)
```

### 11.5.2 Conjugate Priors

Evaluating the denominator $p(\mathbf{x}) = \int L(\theta; \mathbf{x}) p(\theta) d\theta$ is often computationally intractable in high dimensions. A prior $p(\theta)$ is called a **conjugate prior** for likelihood $L(\theta; \mathbf{x})$ if the resulting posterior distribution $p(\theta \mid \mathbf{x})$ belongs to the exact same probability family as the prior.

| Likelihood Model | Parameter | Conjugate Prior | Posterior Distribution |
|:---|:---|:---|:---|
| **Bernoulli / Binomial** | $p \in [0, 1]$ | $\text{Beta}(\alpha, \beta)$ | $\text{Beta}(\alpha + k, \; \beta + n - k)$ |
| **Poisson** | $\lambda > 0$ | $\text{Gamma}(\alpha, \beta)$ | $\text{Gamma}(\alpha + \sum x_i, \; \beta + n)$ |
| **Exponential** | $\lambda > 0$ | $\text{Gamma}(\alpha, \beta)$ | $\text{Gamma}(\alpha + n, \; \beta + \sum x_i)$ |
| **Gaussian (known $\sigma^2$)** | $\mu \in \mathbb{R}$ | $\mathcal{N}(\mu_0, \sigma_0^2)$ | $\mathcal{N}(\mu_{\text{post}}, \sigma_{\text{post}}^2)$ |
| **Categorical / Multinomial** | $\mathbf{p} \in \Delta^K$ | $\text{Dirichlet}(\boldsymbol{\alpha})$ | $\text{Dirichlet}(\boldsymbol{\alpha} + \mathbf{k})$ |

### 11.5.3 Machine Learning Regularization as Bayesian MAP

The connection between Bayesian MAP estimation and classical Machine Learning regularization is mathematically exact:
1. **Gaussian Prior $\leftrightarrow L_2$ Regularization (Ridge Regression):**  
   If parameters $w_j \sim \text{i.i.d. } \mathcal{N}(0, \sigma_0^2)$, the log-prior is:
   $$
   \ln p(\mathbf{w}) = \sum_{j=1}^d \ln\left(\frac{1}{\sigma_0 \sqrt{2\pi}} e^{-w_j^2 / (2\sigma_0^2)}\right) = -\frac{1}{2\sigma_0^2} \|\mathbf{w}\|_2^2 + \text{const}
   $$
   The MAP objective becomes:
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\max_{\mathbf{w}} \left[ \ell(\mathbf{w}; \mathbf{x}) - \frac{\lambda}{2} \|\mathbf{w}\|_2^2 \right] \quad \left(\text{where } \lambda = \frac{1}{\sigma_0^2}\right)
   $$
2. **Laplace Prior $\leftrightarrow L_1$ Regularization (Lasso Regression):**  
   If parameters $w_j \sim \text{i.i.d. } \text{Laplace}(0, b)$ with density $f(w) = \frac{1}{2b} e^{-|w|/b}$:
   $$
   \ln p(\mathbf{w}) = -\frac{1}{b} \sum_{j=1}^d |w_j| + \text{const} = -\frac{1}{b} \|\mathbf{w}\|_1 + \text{const}
   $$
   The MAP objective becomes:
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\max_{\mathbf{w}} \left[ \ell(\mathbf{w}; \mathbf{x}) - \lambda \|\mathbf{w}\|_1 \right] \quad \left(\text{where } \lambda = \frac{1}{b}\right)
   $$
   The sharp non-differentiable cusp of the Laplace prior at $w_j = 0$ is what forces small coefficients to become exactly zero, driving **sparse feature selection**.

---

## 11.6 Exactly 10 Worked Examples

### Worked Example 11.1: Bernoulli MLE and Fisher Information
**Problem Statement:**  
Let $X_1, \dots, X_n \sim \text{i.i.d. } \text{Bernoulli}(p)$ with $p \in (0, 1)$.  
1. Derive the score function $S(p)$ and verify that $\mathbb{E}[S(p)] = 0$.
2. Compute the Fisher Information $\mathcal{I}_n(p)$.
3. State the Cramér-Rao Lower Bound and verify that the MLE $\hat{p} = \bar{X}$ is efficient.

**Detailed Solution:**  
1. **Score Function:**
   $$
   \ell(p) = \sum_{i=1}^n [X_i \ln p + (1 - X_i)\ln(1 - p)]
   $$
   $$
   S(p) = \frac{d\ell}{dp} = \frac{\sum_{i=1}^n X_i}{p} - \frac{n - \sum_{i=1}^n X_i}{1 - p} = \frac{\sum X_i - np}{p(1 - p)}
   $$
   Taking expectation:
   $$
   \mathbb{E}[S(p)] = \frac{\mathbb{E}[\sum X_i] - np}{p(1 - p)} = \frac{np - np}{p(1 - p)} = 0
   $$

2. **Fisher Information:**
   Using the second derivative form:
   $$
   \frac{d^2 \ell}{dp^2} = -\frac{\sum X_i}{p^2} - \frac{n - \sum X_i}{(1 - p)^2}
   $$
   Taking the negative expectation:
   $$
   \mathcal{I}_n(p) = -\mathbb{E}\left[\frac{d^2 \ell}{dp^2}\right] = \frac{np}{p^2} + \frac{n(1 - p)}{(1 - p)^2} = \frac{n}{p} + \frac{n}{1 - p} = \frac{n(1 - p) + np}{p(1 - p)} = \frac{n}{p(1 - p)}
   $$

3. **CRLB and Efficiency:**
   The CRLB for any unbiased estimator of $p$ is:
   $$
   \text{Var}(\hat{p}) \ge \frac{1}{\mathcal{I}_n(p)} = \frac{p(1 - p)}{n}
   $$
   The variance of the sample mean $\hat{p} = \bar{X}$ is:
   $$
   \text{Var}(\bar{X}) = \frac{\text{Var}(X_1)}{n} = \frac{p(1 - p)}{n}
   $$
   Because $\text{Var}(\hat{p})$ meets the CRLB with exact equality, the Bernoulli MLE is **strictly efficient**.

---

### Worked Example 11.2: Joint Gaussian MLE for Mean and Variance
**Problem Statement:**  
Let $X_1, \dots, X_n \sim \text{i.i.d. } \mathcal{N}(\mu, \sigma^2)$. Derive the joint Maximum Likelihood Estimators $(\hat{\mu}_{\text{MLE}}, \hat{\sigma}_{\text{MLE}}^2)$ by maximizing the log-likelihood function.

**Detailed Solution:**  
1. **Log-Likelihood:**
   $$
   L(\mu, \sigma^2) = \prod_{i=1}^n \frac{1}{\sqrt{2\pi \sigma^2}} \exp\left( -\frac{(X_i - \mu)^2}{2\sigma^2} \right) = (2\pi \sigma^2)^{-n/2} \exp\left( -\frac{1}{2\sigma^2} \sum_{i=1}^n (X_i - \mu)^2 \right)
   $$
   $$
   \ell(\mu, \sigma^2) = -\frac{n}{2} \ln(2\pi) - \frac{n}{2} \ln(\sigma^2) - \frac{1}{2\sigma^2} \sum_{i=1}^n (X_i - \mu)^2
   $$

2. **Differentiating with respect to $\mu$:**
   $$
   \frac{\partial \ell}{\partial \mu} = \frac{1}{\sigma^2} \sum_{i=1}^n (X_i - \mu) = 0 \implies \sum_{i=1}^n X_i - n\mu = 0 \implies \hat{\mu}_{\text{MLE}} = \frac{1}{n} \sum_{i=1}^n X_i = \bar{X}
   $$

3. **Differentiating with respect to $\theta = \sigma^2$:**
   $$
   \frac{\partial \ell}{\partial (\sigma^2)} = -\frac{n}{2\sigma^2} + \frac{1}{2(\sigma^2)^2} \sum_{i=1}^n (X_i - \mu)^2 = 0
   $$
   Multiply by $2(\sigma^2)^2$:
   $$
   -n \sigma^2 + \sum_{i=1}^n (X_i - \mu)^2 = 0 \implies \hat{\sigma}_{\text{MLE}}^2 = \frac{1}{n} \sum_{i=1}^n (X_i - \bar{X})^2
   $$

---

### Worked Example 11.3: Bias of Variance MLE and Bessel's Correction
**Problem Statement:**  
Given $X_1, \dots, X_n \sim \text{i.i.d. } \mathcal{N}(\mu, \sigma^2)$ with unknown $\mu$, verify that $\hat{\sigma}_{\text{MLE}}^2 = \frac{1}{n} \sum_{i=1}^n (X_i - \bar{X})^2$ has bias $-\frac{\sigma^2}{n}$, and prove that $s^2 = \frac{1}{n - 1} \sum_{i=1}^n (X_i - \bar{X})^2$ is unbiased.

**Detailed Solution:**  
1. **Algebraic Identity:**
   Write $X_i - \bar{X} = (X_i - \mu) - (\bar{X} - \mu)$.  
   $$
   \sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n (X_i - \mu)^2 - 2(\bar{X} - \mu)\sum_{i=1}^n (X_i - \mu) + n(\bar{X} - \mu)^2
   $$
   Since $\sum_{i=1}^n (X_i - \mu) = n(\bar{X} - \mu)$:
   $$
   \sum_{i=1}^n (X_i - \bar{X})^2 = \sum_{i=1}^n (X_i - \mu)^2 - 2n(\bar{X} - \mu)^2 + n(\bar{X} - \mu)^2 = \sum_{i=1}^n (X_i - \mu)^2 - n(\bar{X} - \mu)^2
   $$

2. **Taking Expectations:**
   $$
   \mathbb{E}\left[\sum_{i=1}^n (X_i - \bar{X})^2\right] = \sum_{i=1}^n \mathbb{E}[(X_i - \mu)^2] - n \mathbb{E}[(\bar{X} - \mu)^2] = n\sigma^2 - n \left(\frac{\sigma^2}{n}\right) = (n - 1)\sigma^2
   $$

3. **Evaluating Bias:**
   $$
   \mathbb{E}[\hat{\sigma}_{\text{MLE}}^2] = \frac{1}{n} (n - 1)\sigma^2 = \left( \frac{n - 1}{n} \right) \sigma^2
   $$
   $$
   \text{Bias}(\hat{\sigma}_{\text{MLE}}^2) = \mathbb{E}[\hat{\sigma}_{\text{MLE}}^2] - \sigma^2 = \frac{n - 1}{n}\sigma^2 - \sigma^2 = -\frac{\sigma^2}{n}
   $$

4. **Bessel's Unbiased Estimator:**
   $$
   \mathbb{E}[s^2] = \mathbb{E}\left[ \frac{1}{n - 1} \sum_{i=1}^n (X_i - \bar{X})^2 \right] = \frac{1}{n - 1} (n - 1)\sigma^2 = \sigma^2
   $$
   Thus $s^2$ is strictly unbiased.

---

### Worked Example 11.4: Fisher Information of the Exponential Distribution
**Problem Statement:**  
Let $X_1, \dots, X_n \sim \text{i.i.d. } \text{Exp}(\lambda)$ with PDF $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$.  
1. Compute the Fisher Information $\mathcal{I}_1(\lambda)$ for a single sample.
2. Determine the Cramér-Rao Lower Bound for unbiased estimators of $\lambda$.
3. What is the asymptotic variance of $\hat{\lambda}_{\text{MLE}} = 1/\bar{X}$?

**Detailed Solution:**  
1. **Fisher Information:**
   $$
   \ln f(x; \lambda) = \ln \lambda - \lambda x
   $$
   $$
   \frac{\partial}{\partial \lambda} \ln f(x; \lambda) = \frac{1}{\lambda} - x
   $$
   $$
   \frac{\partial^2}{\partial \lambda^2} \ln f(x; \lambda) = -\frac{1}{\lambda^2}
   $$
   Taking negative expectation:
   $$
   \mathcal{I}_1(\lambda) = -\mathbb{E}\left[ -\frac{1}{\lambda^2} \right] = \frac{1}{\lambda^2}
   $$
   For $n$ observations: $\mathcal{I}_n(\lambda) = \frac{n}{\lambda^2}$.

2. **CRLB:**
   $$
   \text{Var}(\hat{\lambda}) \ge \frac{1}{\mathcal{I}_n(\lambda)} = \frac{\lambda^2}{n}
   $$

3. **Asymptotic Variance of MLE:**
   By the asymptotic efficiency theorem of MLE:
   $$
   \sqrt{n}(\hat{\lambda}_{\text{MLE}} - \lambda) \xrightarrow{d} \mathcal{N}\left(0, \frac{1}{\mathcal{I}_1(\lambda)}\right) = \mathcal{N}(0, \lambda^2)
   $$
   The asymptotic variance of $\hat{\lambda}_{\text{MLE}}$ is $\frac{\lambda^2}{n}$.

---

### Worked Example 11.5: Beta-Binomial Bayesian Updating
**Problem Statement:**  
We model click-through rate $p \in [0, 1]$ of an ad. Our prior belief is $p \sim \text{Beta}(\alpha, \beta)$ with prior hyperparameters $\alpha = 2, \beta = 8$ (prior mean $\mu_0 = \frac{2}{2+8} = 0.20$).  
We show the ad to $n = 100$ users and observe $k = 30$ clicks.  
1. Derive the posterior distribution $p(\theta \mid k)$.
2. Compute the posterior mean $\mathbb{E}[p \mid k]$.
3. Compute the Maximum A Posteriori estimate $\hat{p}_{\text{MAP}}$.

**Detailed Solution:**  
1. **Posterior Derivation:**
   Likelihood: $L(p) = \binom{n}{k} p^k (1 - p)^{n - k} \propto p^k (1 - p)^{n - k}$.  
   Prior: $p(p) = \frac{1}{\text{B}(\alpha, \beta)} p^{\alpha - 1} (1 - p)^{\beta - 1} \propto p^{\alpha - 1} (1 - p)^{\beta - 1}$.  
   Multiplying:
   $$
   p(p \mid k) \propto L(p) p(p) \propto p^k (1 - p)^{n - k} \cdot p^{\alpha - 1} (1 - p)^{\beta - 1} = p^{(\alpha + k) - 1} (1 - p)^{(\beta + n - k) - 1}
   $$
   This is the functional kernel of a Beta distribution:
   $$
   (p \mid k) \sim \text{Beta}(\alpha_{\text{post}}, \; \beta_{\text{post}}) = \text{Beta}(\alpha + k, \; \beta + n - k)
   $$
   With $\alpha = 2, \beta = 8, n = 100, k = 30$:
   $$
   \alpha_{\text{post}} = 2 + 30 = 32, \quad \beta_{\text{post}} = 8 + (100 - 30) = 8 + 70 = 78
   $$
   $(p \mid k) \sim \text{Beta}(32, 78)$.

2. **Posterior Mean:**
   $$
   \mathbb{E}[p \mid k] = \frac{\alpha_{\text{post}}}{\alpha_{\text{post}} + \beta_{\text{post}}} = \frac{32}{32 + 78} = \frac{32}{110} \approx 0.29091 \; (29.09\%)
   $$
   Notice that the posterior mean is a weighted average between the prior mean ($0.20$) and the MLE ($30/100 = 0.30$):
   $$
   \mathbb{E}[p \mid k] = \left(\frac{10}{110}\right)(0.20) + \left(\frac{100}{110}\right)(0.30) \approx 0.01818 + 0.27273 = 0.29091
   $$

3. **MAP Estimate:**
   The mode of a $\text{Beta}(\alpha, \beta)$ distribution is $\frac{\alpha - 1}{\alpha + \beta - 2}$ (for $\alpha, \beta > 1$):
   $$
   \hat{p}_{\text{MAP}} = \frac{32 - 1}{32 + 78 - 2} = \frac{31}{108} \approx 0.28704 \; (28.70\%)
   $$

---

### Worked Example 11.6: Normal-Normal Bayesian Conjugate Updating (Gaussian Filtering)
**Problem Statement:**  
A robot sensor measures temperature $X \sim \mathcal{N}(\mu, \sigma^2)$ with known sensor noise variance $\sigma^2 = 4$.  
The prior distribution on the true mean temperature is $\mu \sim \mathcal{N}(\mu_0, \sigma_0^2)$ with prior mean $\mu_0 = 20^\circ\text{C}$ and prior variance $\sigma_0^2 = 9$.  
The robot takes $n = 4$ independent measurements with sample mean $\bar{x} = 26^\circ\text{C}$.  
1. Compute the posterior precision $\tau_{\text{post}} = 1/\sigma_{\text{post}}^2$.
2. Compute the posterior mean $\mu_{\text{post}}$ and posterior variance $\sigma_{\text{post}}^2$.

**Detailed Solution:**  
1. **Precisions (Inverse Variances):**
   Prior precision: $\tau_0 = \frac{1}{\sigma_0^2} = \frac{1}{9} \approx 0.1111$.  
   Sensor sample mean precision: $\tau_{\text{data}} = \frac{n}{\sigma^2} = \frac{4}{4} = 1.0$.  
   In Gaussian conjugate updating, precisions are additive:
   $$
   \tau_{\text{post}} = \tau_0 + \tau_{\text{data}} = \frac{1}{9} + 1 = \frac{10}{9} \approx 1.1111
   $$
   Thus, posterior variance is:
   $$
   \sigma_{\text{post}}^2 = \frac{1}{\tau_{\text{post}}} = \frac{9}{10} = 0.90
   $$

2. **Posterior Mean:**
   The posterior mean is the precision-weighted average:
   $$
   \mu_{\text{post}} = \frac{\tau_0 \mu_0 + \tau_{\text{data}} \bar{x}}{\tau_{\text{post}}} = \frac{\frac{1}{9}(20) + 1(26)}{10/9} = \frac{\frac{20}{9} + \frac{234}{9}}{10/9} = \frac{254}{10} = 25.4^\circ\text{C}
   $$
   The posterior belief is $\mu \mid \mathbf{x} \sim \mathcal{N}(25.4, \; 0.90)$.  
   Notice that the data dominated the prior (weight $1.0$ vs $0.111$), pulling the mean from $20.0$ to $25.4$.

---

### Worked Example 11.7: Multinomial MLE and Laplace Smoothing
**Problem Statement:**  
A language model encounters a vocabulary of $V = 5$ tokens. In a small training corpus of $N = 20$ words, the observed counts are $\mathbf{k} = [10, 6, 4, 0, 0]^T$.  
1. Compute the standard MLE probabilities $\hat{\mathbf{p}}_{\text{MLE}}$.
2. Explain the "zero-frequency problem" in language modeling.
3. Compute the Bayesian MAP probabilities under a uniform Dirichlet prior $\text{Dirichlet}(\alpha_1, \dots, \alpha_V)$ with $\alpha_j = 2$ (Laplace / Lidstone add-one smoothing).

**Detailed Solution:**  
1. **MLE Probabilities:**
   For a multinomial distribution, $\hat{p}_j = k_j / N$:
   $$
   \hat{\mathbf{p}}_{\text{MLE}} = \begin{bmatrix} 10/20 \\ 6/20 \\ 4/20 \\ 0/20 \\ 0/20 \end{bmatrix} = \begin{bmatrix} 0.50 \\ 0.30 \\ 0.20 \\ 0.00 \\ 0.00 \end{bmatrix}
   $$

2. **Zero-Frequency Problem:**
   If token 4 or 5 appears in a test sentence, the joint likelihood under the MLE model is $\prod p(w_i) = 0$. The model assigns zero probability to the entire sequence and suffers infinite perplexity ($\ln 0 = -\infty$).

3. **Bayesian Dirichlet MAP (Smoothing):**
   Prior: $p(\mathbf{p}) \propto \prod_{j=1}^V p_j^{\alpha_j - 1}$.  
   Posterior: $p(\mathbf{p} \mid \mathbf{k}) \propto \prod_{j=1}^V p_j^{k_j + \alpha_j - 1}$.  
   The MAP mode for a Dirichlet posterior is:
   $$
   \hat{p}_j^{\text{MAP}} = \frac{k_j + \alpha_j - 1}{\sum_{m=1}^V (k_m + \alpha_m - 1)} = \frac{k_j + (2 - 1)}{\sum_{m=1}^5 (k_m + 1)} = \frac{k_j + 1}{N + V}
   $$
   Here $N = 20$ and $V = 5$, so $N + V = 25$:
   $$
   \begin{aligned}
   \hat{p}_1^{\text{MAP}} &= \frac{10 + 1}{25} = \frac{11}{25} = 0.44 \\
   \hat{p}_2^{\text{MAP}} &= \frac{6 + 1}{25} = \frac{7}{25} = 0.28 \\
   \hat{p}_3^{\text{MAP}} &= \frac{4 + 1}{25} = \frac{5}{25} = 0.20 \\
   \hat{p}_4^{\text{MAP}} &= \frac{0 + 1}{25} = \frac{1}{25} = 0.04 \\
   \hat{p}_5^{\text{MAP}} &= \frac{0 + 1}{25} = \frac{1}{25} = 0.04
   \end{aligned}
   $$
   Unseen tokens now receive a non-zero probability of $4\%$, resolving the zero-frequency failure.

---

### Worked Example 11.8: Deriving Ridge Regression as Gaussian MAP
**Problem Statement:**  
Consider the standard linear regression model $y_i = \mathbf{x}_i^T \mathbf{w} + \epsilon_i$, where $\epsilon_i \sim \text{i.i.d. } \mathcal{N}(0, \sigma^2)$.  
Assume an independent Gaussian prior on the weights: $\mathbf{w} \sim \mathcal{N}(\mathbf{0}, \sigma_0^2 \mathbf{I})$.  
Prove that the MAP estimator $\hat{\mathbf{w}}_{\text{MAP}}$ is mathematically identical to Ridge Regression ($L_2$ regularization) with parameter $\lambda = \frac{\sigma^2}{\sigma_0^2}$.

**Detailed Solution:**  
1. **Likelihood Function:**
   $$
   p(\mathbf{y} \mid \mathbf{X}, \mathbf{w}) = \left(\frac{1}{2\pi \sigma^2}\right)^{n/2} \exp\left( -\frac{1}{2\sigma^2} \sum_{i=1}^n (y_i - \mathbf{x}_i^T \mathbf{w})^2 \right) = (2\pi \sigma^2)^{-n/2} \exp\left( -\frac{1}{2\sigma^2} \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 \right)
   $$
   $$
   \ln p(\mathbf{y} \mid \mathbf{X}, \mathbf{w}) = -\frac{n}{2}\ln(2\pi \sigma^2) - \frac{1}{2\sigma^2} \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2
   $$

2. **Prior Distribution:**
   $$
   p(\mathbf{w}) = (2\pi \sigma_0^2)^{-d/2} \exp\left( -\frac{1}{2\sigma_0^2} \|\mathbf{w}\|_2^2 \right)
   $$
   $$
   \ln p(\mathbf{w}) = -\frac{d}{2}\ln(2\pi \sigma_0^2) - \frac{1}{2\sigma_0^2} \|\mathbf{w}\|_2^2
   $$

3. **MAP Objective:**
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\max_{\mathbf{w}} \big[ \ln p(\mathbf{y} \mid \mathbf{X}, \mathbf{w}) + \ln p(\mathbf{w}) \big]
   $$
   Discarding terms independent of $\mathbf{w}$:
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\max_{\mathbf{w}} \left[ -\frac{1}{2\sigma^2} \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 - \frac{1}{2\sigma_0^2} \|\mathbf{w}\|_2^2 \right]
   $$
   Multiplying by $-2\sigma^2$ converts the maximization into a minimization:
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\min_{\mathbf{w}} \left[ \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 + \left(\frac{\sigma^2}{\sigma_0^2}\right) \|\mathbf{w}\|_2^2 \right]
   $$
   Setting $\lambda = \frac{\sigma^2}{\sigma_0^2}$, this is precisely the **Ridge Regression objective**:
   $$
   J(\mathbf{w}) = \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 + \lambda \|\mathbf{w}\|_2^2 \quad \blacksquare
   $$
   The analytical solution is $\hat{\mathbf{w}}_{\text{MAP}} = (\mathbf{X}^T \mathbf{X} + \lambda \mathbf{I})^{-1} \mathbf{X}^T \mathbf{y}$.

---

### Worked Example 11.9: Deriving Lasso Regression as Laplace MAP
**Problem Statement:**  
Continuing from Worked Example 11.8, replace the Gaussian prior on weights with an independent Laplace prior: $p(w_j) = \frac{1}{2b} \exp\left( -\frac{|w_j|}{b} \right)$.  
Prove that the MAP estimator is equivalent to Lasso Regression ($L_1$ regularization).

**Detailed Solution:**  
1. **Log-Prior for Laplace Distribution:**
   $$
   p(\mathbf{w}) = \prod_{j=1}^d \frac{1}{2b} \exp\left( -\frac{|w_j|}{b} \right) = \left(\frac{1}{2b}\right)^d \exp\left( -\frac{1}{b} \sum_{j=1}^d |w_j| \right) = \left(\frac{1}{2b}\right)^d \exp\left( -\frac{1}{b} \|\mathbf{w}\|_1 \right)
   $$
   $$
   \ln p(\mathbf{w}) = -d \ln(2b) - \frac{1}{b} \|\mathbf{w}\|_1
   $$

2. **MAP Optimization:**
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\max_{\mathbf{w}} \left[ -\frac{1}{2\sigma^2} \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 - \frac{1}{b} \|\mathbf{w}\|_1 \right]
   $$
   Multiplying by $-2\sigma^2$:
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\min_{\mathbf{w}} \left[ \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 + \left(\frac{2\sigma^2}{b}\right) \|\mathbf{w}\|_1 \right]
   $$
   Setting $\lambda = \frac{2\sigma^2}{b}$:
   $$
   \hat{\mathbf{w}}_{\text{MAP}} = \arg\min_{\mathbf{w}} \left[ \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 + \lambda \|\mathbf{w}\|_1 \right] \quad \blacksquare
   $$
   This is the standard **Lasso Regression objective**.

---

### Worked Example 11.10: Information Matrix Equivalence Proof
**Problem Statement:**  
Let $f(x; \theta)$ be a twice-differentiable probability density satisfying the regularity condition that its support does not depend on $\theta$, and $\int \nabla_\theta^2 f(x; \theta) dx = \mathbf{0}$.  
Prove the fundamental identity of Fisher Information:
$$
\mathbb{E}\left[ \left( \frac{\partial \ln f(X; \theta)}{\partial \theta} \right)^2 \right] = -\mathbb{E}\left[ \frac{\partial^2 \ln f(X; \theta)}{\partial \theta^2} \right]
$$

**Detailed Solution:**  
1. **First Derivative Expansion:**
   By the chain rule:
   $$
   \frac{\partial \ln f(x; \theta)}{\partial \theta} = \frac{1}{f(x; \theta)} \frac{\partial f(x; \theta)}{\partial \theta}
   $$

2. **Second Derivative Expansion:**
   Differentiating again using the quotient rule:
   $$
   \begin{aligned}
   \frac{\partial^2 \ln f(x; \theta)}{\partial \theta^2} &= \frac{\partial}{\partial \theta} \left( \frac{1}{f(x; \theta)} \frac{\partial f(x; \theta)}{\partial \theta} \right) \\
   &= -\frac{1}{f(x; \theta)^2} \left( \frac{\partial f(x; \theta)}{\partial \theta} \right)^2 + \frac{1}{f(x; \theta)} \frac{\partial^2 f(x; \theta)}{\partial \theta^2} \\
   &= -\left( \frac{\partial \ln f(x; \theta)}{\partial \theta} \right)^2 + \frac{1}{f(x; \theta)} \frac{\partial^2 f(x; \theta)}{\partial \theta^2}
   \end{aligned}
   $$

3. **Taking Expectations:**
   Integrate with respect to $f(x; \theta) \, dx$:
   $$
   \mathbb{E}\left[ \frac{\partial^2 \ln f(X; \theta)}{\partial \theta^2} \right] = -\mathbb{E}\left[ \left( \frac{\partial \ln f(X; \theta)}{\partial \theta} \right)^2 \right] + \int \frac{1}{f(x; \theta)} \frac{\partial^2 f(x; \theta)}{\partial \theta^2} f(x; \theta) \, dx
   $$
   The second integral simplifies to:
   $$
   \int \frac{\partial^2 f(x; \theta)}{\partial \theta^2} \, dx = \frac{\partial^2}{\partial \theta^2} \int f(x; \theta) \, dx = \frac{\partial^2}{\partial \theta^2} (1) = 0
   $$
   Therefore:
   $$
   \mathbb{E}\left[ \frac{\partial^2 \ln f(X; \theta)}{\partial \theta^2} \right] = -\mathbb{E}\left[ \left( \frac{\partial \ln f(X; \theta)}{\partial \theta} \right)^2 \right]
   $$
   Negating both sides proves the equivalence. $\blacksquare$

---

## 11.7 Exactly 10 Solved Exercises

### Exercise 11.1: MLE for the Continuous Uniform Distribution $\mathcal{U}(0, \theta)$
**Problem Statement:**  
Let $X_1, \dots, X_n \sim \text{i.i.d. } \mathcal{U}(0, \theta)$ where $\theta > 0$.  
1. Derive the Maximum Likelihood Estimator $\hat{\theta}_{\text{MLE}}$.
2. Compute the bias of $\hat{\theta}_{\text{MLE}}$.
3. Construct an exact unbiased estimator $\tilde{\theta}$.

**Detailed Solution:**  
1. **Likelihood Function:**
   $$
   f(x; \theta) = \frac{1}{\theta} \cdot \mathbb{I}_{\{0 \le x \le \theta\}}
   $$
   $$
   L(\theta; \mathbf{x}) = \prod_{i=1}^n \frac{1}{\theta} \mathbb{I}_{\{0 \le x_i \le \theta\}} = \frac{1}{\theta^n} \mathbb{I}_{\{\max(x_1, \dots, x_n) \le \theta\}}
   $$
   For any $\theta < \max(x_i)$, $L(\theta) = 0$. For $\theta \ge \max(x_i)$, $L(\theta) = 1/\theta^n$, which is a strictly decreasing function of $\theta$.  
   To maximize $L(\theta)$, we must choose the smallest permissible value of $\theta$:
   $$
   \hat{\theta}_{\text{MLE}} = X_{(n)} = \max(X_1, X_2, \dots, X_n)
   $$

2. **Distribution and Expectation of $X_{(n)}$:**
   CDF of $X_{(n)}$:
   $$
   F_{X_{(n)}}(t) = P(X_{(n)} \le t) = [P(X_1 \le t)]^n = \left(\frac{t}{\theta}\right)^n \quad \text{for } 0 \le t \le \theta
   $$
   PDF of $X_{(n)}$:
   $$
   f_{X_{(n)}}(t) = \frac{d}{dt} \left(\frac{t}{\theta}\right)^n = \frac{n t^{n - 1}}{\theta^n}
   $$
   Expectation:
   $$
   \mathbb{E}[X_{(n)}] = \int_0^\theta t \left( \frac{n t^{n - 1}}{\theta^n} \right) dt = \frac{n}{\theta^n} \int_0^\theta t^n \, dt = \frac{n}{\theta^n} \left[ \frac{t^{n + 1}}{n + 1} \right]_0^\theta = \frac{n}{n + 1} \theta
   $$
   Bias:
   $$
   \text{Bias}(\hat{\theta}_{\text{MLE}}) = \frac{n}{n + 1}\theta - \theta = -\frac{\theta}{n + 1}
   $$

3. **Unbiased Correction:**
   Multiply by $\frac{n + 1}{n}$:
   $$
   \tilde{\theta} = \frac{n + 1}{n} X_{(n)} = \frac{n + 1}{n} \max(X_1, \dots, X_n)
   $$
   $$
   \mathbb{E}[\tilde{\theta}] = \frac{n + 1}{n} \left(\frac{n}{n + 1}\theta\right) = \theta \quad (\text{strictly unbiased})
   $$

---

### Exercise 11.2: MLE of the Geometric Distribution Parameter
**Problem Statement:**  
Let $X_1, \dots, X_n \sim \text{i.i.d. } \text{Geom}(p)$ with PMF $P(X = k) = (1 - p)^{k - 1} p$ for $k \in \{1, 2, 3, \dots\}$.  
1. Derive $\hat{p}_{\text{MLE}}$.
2. Compute the Fisher Information $\mathcal{I}_1(p)$.

**Detailed Solution:**  
1. **Likelihood Function:**
   $$
   L(p) = \prod_{i=1}^n (1 - p)^{X_i - 1} p = p^n (1 - p)^{\sum X_i - n}
   $$
   $$
   \ell(p) = n \ln p + \left(\sum_{i=1}^n X_i - n\right) \ln(1 - p)
   $$
   Setting the score to zero:
   $$
   \frac{d\ell}{dp} = \frac{n}{p} - \frac{\sum X_i - n}{1 - p} = 0 \implies n(1 - p) = p\left(\sum X_i - n\right) \implies n = p \sum_{i=1}^n X_i
   $$
   $$
   \hat{p}_{\text{MLE}} = \frac{n}{\sum_{i=1}^n X_i} = \frac{1}{\bar{X}}
   $$

2. **Fisher Information:**
   $$
   \frac{d^2 \ell}{dp^2} = -\frac{n}{p^2} - \frac{\sum X_i - n}{(1 - p)^2}
   $$
   Since $\mathbb{E}[X_i] = 1/p$, $\mathbb{E}[\sum X_i - n] = \frac{n}{p} - n = \frac{n(1 - p)}{p}$:
   $$
   \mathcal{I}_n(p) = -\mathbb{E}\left[\frac{d^2 \ell}{dp^2}\right] = \frac{n}{p^2} + \frac{n(1 - p) / p}{(1 - p)^2} = \frac{n}{p^2} + \frac{n}{p(1 - p)} = \frac{n(1 - p) + np}{p^2 (1 - p)} = \frac{n}{p^2 (1 - p)}
   $$
   For a single sample: $\mathcal{I}_1(p) = \frac{1}{p^2 (1 - p)}$.

---

### Exercise 11.3: MSE Comparison of Sample Variance Estimators
**Problem Statement:**  
Consider estimators of $\sigma^2$ of the form $S_c^2 = c \sum_{i=1}^n (X_i - \bar{X})^2$ for Gaussian data.  
Recall that $\frac{1}{\sigma^2} \sum_{i=1}^n (X_i - \bar{X})^2 \sim \chi^2(n - 1)$.  
Find the scalar $c^*$ that minimizes the Mean Squared Error $\text{MSE}(S_c^2) = \mathbb{E}[(S_c^2 - \sigma^2)^2]$.

**Detailed Solution:**  
1. **Moments of Chi-Square Variable:**
   Let $W = \sum_{i=1}^n (X_i - \bar{X})^2 = \sigma^2 V$, where $V \sim \chi^2(n - 1)$.  
   $\mathbb{E}[V] = n - 1$, and $\text{Var}(V) = 2(n - 1)$.  
   $$
   \mathbb{E}[W] = (n - 1)\sigma^2
   $$
   $$
   \mathbb{E}[W^2] = \text{Var}(W) + (\mathbb{E}[W])^2 = 2(n - 1)\sigma^4 + (n - 1)^2 \sigma^4 = (n - 1)(n + 1)\sigma^4
   $$

2. **MSE Expression:**
   $$
   S_c^2 = c W
   $$
   $$
   \text{MSE}(S_c^2) = \mathbb{E}[(c W - \sigma^2)^2] = c^2 \mathbb{E}[W^2] - 2c \sigma^2 \mathbb{E}[W] + \sigma^4
   $$
   $$
   \text{MSE}(c) = c^2 (n - 1)(n + 1)\sigma^4 - 2c (n - 1)\sigma^4 + \sigma^4
   $$

3. **Minimizing with respect to $c$:**
   $$
   \frac{d}{dc}\text{MSE}(c) = 2c (n - 1)(n + 1)\sigma^4 - 2(n - 1)\sigma^4 = 0
   $$
   Dividing by $2(n - 1)\sigma^4$:
   $$
   c(n + 1) - 1 = 0 \implies c^* = \frac{1}{n + 1}
   $$

4. **Significance:**
   - Bessel's unbiased estimator uses $c = \frac{1}{n - 1}$.
   - The MLE uses $c = \frac{1}{n}$.
   - The minimum MSE estimator uses $c^* = \frac{1}{n + 1}$.  
   The estimator $S_{1/(n+1)}^2 = \frac{1}{n + 1} \sum (X_i - \bar{X})^2$ accepts slight downward bias in exchange for a substantial reduction in variance, achieving strictly smaller MSE than the unbiased sample variance!

---

### Exercise 11.4: Fisher Information of the Cauchy Location Parameter
**Problem Statement:**  
Let $X \sim \text{Cauchy}(\theta, 1)$ with density $f(x; \theta) = \frac{1}{\pi(1 + (x - \theta)^2)}$.  
Prove that the Fisher Information for the location parameter $\theta$ is $\mathcal{I}_1(\theta) = 1/2$.

**Detailed Solution:**  
1. **Score Function:**
   $$
   \ln f(x; \theta) = -\ln \pi - \ln(1 + (x - \theta)^2)
   $$
   $$
   \frac{\partial \ln f(x; \theta)}{\partial \theta} = \frac{2(x - \theta)}{1 + (x - \theta)^2}
   $$

2. **Fisher Information Integral:**
   By substitution $u = x - \theta$:
   $$
   \mathcal{I}_1(\theta) = \mathbb{E}\left[ \left(\frac{2(X - \theta)}{1 + (X - \theta)^2}\right)^2 \right] = \int_{-\infty}^\infty \frac{4u^2}{(1 + u^2)^2} \frac{1}{\pi(1 + u^2)} \, du = \frac{4}{\pi} \int_{-\infty}^\infty \frac{u^2}{(1 + u^2)^3} \, du
   $$

3. **Evaluating the Integral via Trigonometric Substitution:**
   Let $u = \tan \theta$, so $1 + u^2 = \sec^2 \theta$ and $du = \sec^2 \theta \, d\theta$:
   $$
   \int_{-\infty}^\infty \frac{u^2}{(1 + u^2)^3} \, du = \int_{-\pi/2}^{\pi/2} \frac{\tan^2 \theta}{\sec^6 \theta} \sec^2 \theta \, d\theta = \int_{-\pi/2}^{\pi/2} \sin^2 \theta \cos^2 \theta \, d\theta
   $$
   Using $\sin \theta \cos \theta = \frac{1}{2} \sin(2\theta)$:
   $$
   = \frac{1}{4} \int_{-\pi/2}^{\pi/2} \sin^2(2\theta) \, d\theta = \frac{1}{4} \int_{-\pi/2}^{\pi/2} \frac{1 - \cos(4\theta)}{2} \, d\theta = \frac{1}{8} \left[ \theta \right]_{-\pi/2}^{\pi/2} = \frac{1}{8} (\pi) = \frac{\pi}{8}
   $$
   Multiplying by the prefactor $\frac{4}{\pi}$:
   $$
   \mathcal{I}_1(\theta) = \frac{4}{\pi} \left( \frac{\pi}{8} \right) = \frac{4}{8} = \frac{1}{2} \quad \blacksquare
   $$

---

### Exercise 11.5: Functional Invariance of Maximum Likelihood Estimators
**Problem Statement:**  
Prove the Zeiss-Halmos Invariance Theorem: If $\hat{\theta}$ is the MLE of parameter $\theta$, and $g: \Theta \to \Omega$ is an arbitrary function (not necessarily one-to-one), then $\hat{\omega} = g(\hat{\theta})$ is the MLE of $\omega = g(\theta)$.

**Detailed Solution:**  
1. **Profile Likelihood Definition:**
   For a many-to-one mapping $g$, define the induced likelihood over $\Omega$ by the profile likelihood:
   $$
   M(\omega; \mathbf{x}) = \sup_{\theta \in g^{-1}(\omega)} L(\theta; \mathbf{x})
   $$
   where $g^{-1}(\omega) = \{\theta \in \Theta : g(\theta) = \omega\}$.

2. **Maximizing Profile Likelihood:**
   $$
   \sup_{\omega \in \Omega} M(\omega; \mathbf{x}) = \sup_{\omega \in \Omega} \left( \sup_{\theta \in g^{-1}(\omega)} L(\theta; \mathbf{x}) \right) = \sup_{\theta \in \Theta} L(\theta; \mathbf{x})
   $$
   Because $\hat{\theta}$ maximizes $L(\theta; \mathbf{x})$ over all $\theta \in \Theta$:
   $$
   \sup_{\theta \in \Theta} L(\theta; \mathbf{x}) = L(\hat{\theta}; \mathbf{x})
   $$

3. **Evaluating at $\hat{\omega} = g(\hat{\theta})$:**
   Notice that $\hat{\theta} \in g^{-1}(g(\hat{\theta})) = g^{-1}(\hat{\omega})$. Therefore:
   $$
   M(\hat{\omega}; \mathbf{x}) = \sup_{\theta \in g^{-1}(\hat{\omega})} L(\theta; \mathbf{x}) \ge L(\hat{\theta}; \mathbf{x})
   $$
   Since $M(\omega; \mathbf{x}) \le L(\hat{\theta}; \mathbf{x})$ for all $\omega$, it follows that $M(\hat{\omega}; \mathbf{x}) = \sup_{\omega \in \Omega} M(\omega; \mathbf{x})$.  
   Thus, $\hat{\omega} = g(\hat{\theta})$ is the Maximum Likelihood Estimator of $\omega = g(\theta)$. $\blacksquare$

---

### Exercise 11.6: Gamma-Poisson Conjugate Bayesian Model
**Problem Statement:**  
Let $X_1, \dots, X_n \sim \text{i.i.d. } \text{Pois}(\lambda)$. Place a conjugate prior $\lambda \sim \text{Gamma}(\alpha, \beta)$ with density $p(\lambda) \propto \lambda^{\alpha - 1} e^{-\beta \lambda}$.  
1. Derive the posterior distribution $p(\lambda \mid \mathbf{x})$.
2. Compute the posterior mean $\mathbb{E}[\lambda \mid \mathbf{x}]$ and MAP estimator $\hat{\lambda}_{\text{MAP}}$.

**Detailed Solution:**  
1. **Posterior Derivation:**
   Likelihood: $L(\lambda) \propto \lambda^{\sum X_i} e^{-n\lambda}$.  
   Prior: $p(\lambda) \propto \lambda^{\alpha - 1} e^{-\beta \lambda}$.  
   Multiplying:
   $$
   p(\lambda \mid \mathbf{x}) \propto \lambda^{\sum X_i} e^{-n\lambda} \cdot \lambda^{\alpha - 1} e^{-\beta \lambda} = \lambda^{(\alpha + \sum X_i) - 1} e^{-(\beta + n)\lambda}
   $$
   This is a Gamma distribution:
   $$
   (\lambda \mid \mathbf{x}) \sim \text{Gamma}\left(\alpha + \sum_{i=1}^n X_i, \; \beta + n\right)
   $$

2. **Posterior Mean and MAP:**
   - Posterior Mean:
     $$
     \mathbb{E}[\lambda \mid \mathbf{x}] = \frac{\alpha_{\text{post}}}{\beta_{\text{post}}} = \frac{\alpha + \sum X_i}{\beta + n} = \left(\frac{\beta}{\beta + n}\right)\frac{\alpha}{\beta} + \left(\frac{n}{\beta + n}\right)\bar{X}
     $$
   - MAP Estimator (Mode of Gamma for $\alpha_{\text{post}} > 1$):
     $$
     \hat{\lambda}_{\text{MAP}} = \frac{\alpha_{\text{post}} - 1}{\beta_{\text{post}}} = \frac{\alpha + \sum X_i - 1}{\beta + n}
     $$

---

### Exercise 11.7: Asymptotic Confidence Intervals via Fisher Information (Wald CI)
**Problem Statement:**  
A website logs $n = 400$ server errors modeled as $X_i \sim \text{Pois}(\lambda)$ with observed sample mean $\bar{x} = 2.25$.  
Construct an asymptotic $95\%$ Wald confidence interval for $\lambda$ using the Fisher Information.

**Detailed Solution:**  
1. **Asymptotic Distribution of MLE:**
   For a Poisson distribution, $\hat{\lambda}_{\text{MLE}} = \bar{X}$, and $\mathcal{I}_1(\lambda) = 1/\lambda$.  
   By asymptotic normality of MLE:
   $$
   \hat{\lambda} \approx \mathcal{N}\left(\lambda, \; \frac{1}{n \mathcal{I}_1(\lambda)}\right) = \mathcal{N}\left(\lambda, \; \frac{\lambda}{n}\right)
   $$

2. **Standard Error:**
   Plugging in $\hat{\lambda} = 2.25$:
   $$
   \hat{\text{SE}} = \sqrt{\frac{\hat{\lambda}}{n}} = \sqrt{\frac{2.25}{400}} = \frac{1.5}{20} = 0.075
   $$

3. **Confidence Interval:**
   For $95\%$ confidence, $z_{0.025} = 1.96$:
   $$
   \text{CI}_{0.95} = \hat{\lambda} \pm 1.96 \, \hat{\text{SE}} = 2.25 \pm 1.96(0.075) = 2.25 \pm 0.147
   $$
   $$
   \text{CI}_{0.95} = [2.103, \; 2.397]
   $$

---

### Exercise 11.8: Analytical Solution of Multiple Linear Regression MLE
**Problem Statement:**  
Let $\mathbf{y} = \mathbf{X}\mathbf{w} + \boldsymbol{\epsilon}$, where $\mathbf{y} \in \mathbb{R}^n$, $\mathbf{X} \in \mathbb{R}^{n \times d}$ (with $\text{rank}(\mathbf{X}) = d$), and $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})$.  
Derive the Ordinary Least Squares / MLE weight vector $\hat{\mathbf{w}}_{\text{MLE}}$ by setting the gradient of the log-likelihood to zero.

**Detailed Solution:**  
1. **Log-Likelihood:**
   $$
   \ell(\mathbf{w}) = -\frac{n}{2}\ln(2\pi\sigma^2) - \frac{1}{2\sigma^2} (\mathbf{y} - \mathbf{X}\mathbf{w})^T (\mathbf{y} - \mathbf{X}\mathbf{w})
   $$
   Expanding the quadratic form:
   $$
   (\mathbf{y} - \mathbf{X}\mathbf{w})^T (\mathbf{y} - \mathbf{X}\mathbf{w}) = \mathbf{y}^T \mathbf{y} - 2 \mathbf{w}^T \mathbf{X}^T \mathbf{y} + \mathbf{w}^T \mathbf{X}^T \mathbf{X} \mathbf{w}
   $$

2. **Gradient with respect to $\mathbf{w}$:**
   $$
   \nabla_{\mathbf{w}} \ell(\mathbf{w}) = -\frac{1}{2\sigma^2} \left( -2 \mathbf{X}^T \mathbf{y} + 2 \mathbf{X}^T \mathbf{X} \mathbf{w} \right) = \frac{1}{\sigma^2} \left( \mathbf{X}^T \mathbf{y} - \mathbf{X}^T \mathbf{X} \mathbf{w} \right)
   $$

3. **Setting to Zero:**
   $$
   \mathbf{X}^T \mathbf{X} \hat{\mathbf{w}} = \mathbf{X}^T \mathbf{y}
   $$
   Because $\text{rank}(\mathbf{X}) = d$, $\mathbf{X}^T \mathbf{X}$ is invertible:
   $$
   \hat{\mathbf{w}}_{\text{MLE}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y} \quad \blacksquare
   $$

---

### Exercise 11.9: Jeffreys Prior for the Bernoulli Parameter
**Problem Statement:**  
Harold Jeffreys proposed an objective, reparameterization-invariant prior defined as $p(\theta) \propto \sqrt{\det \mathcal{I}(\theta)}$.  
Compute the Jeffreys prior for the Bernoulli distribution parameter $p \in (0, 1)$, and identify its standard distribution.

**Detailed Solution:**  
1. **Fisher Information:**
   From Worked Example 11.1, $\mathcal{I}_1(p) = \frac{1}{p(1 - p)}$.

2. **Computing the Prior:**
   $$
   p(p) \propto \sqrt{\mathcal{I}_1(p)} = \sqrt{\frac{1}{p(1 - p)}} = p^{-1/2} (1 - p)^{-1/2}
   $$

3. **Identification:**
   Recall the Beta PDF kernel $p^{\alpha - 1}(1 - p)^{\beta - 1}$.  
   Equating exponents:
   $$
   \alpha - 1 = -1/2 \implies \alpha = 1/2
   $$
   $$
   \beta - 1 = -1/2 \implies \beta = 1/2
   $$
   The Jeffreys prior for a Bernoulli distribution is the **arcsine distribution**:
   $$
   p \sim \text{Beta}\left(\frac{1}{2}, \; \frac{1}{2}\right)
   $$

---

### Exercise 11.10: Regularity Condition Violation in CRLB
**Problem Statement:**  
Explain why the Cramér-Rao Lower Bound fails to apply to the estimator $\tilde{\theta} = \frac{n+1}{n} \max(X_1, \dots, X_n)$ for $X_i \sim \mathcal{U}(0, \theta)$, and compare its actual variance to the naive CRLB.

**Detailed Solution:**  
1. **Regularity Condition Failure:**
   The fundamental regularity condition required by the CRLB proof is that the domain of integration (support set $\mathcal{X}_\theta$) must **not** depend on the parameter $\theta$:
   $$
   \nabla_\theta \int_{\mathcal{X}_\theta} f(x; \theta) \, dx \neq \int_{\mathcal{X}_\theta} \nabla_\theta f(x; \theta) \, dx
   $$
   For $\mathcal{U}(0, \theta)$, the support is $[0, \theta]$. Differentiating the boundary with respect to $\theta$ introduces a Dirac delta boundary impulse via Leibniz's rule.

2. **Variance Comparison:**
   For $\tilde{\theta} = \frac{n+1}{n} X_{(n)}$:
   $$
   \mathbb{E}[\tilde{\theta}^2] = \left(\frac{n+1}{n}\right)^2 \mathbb{E}[X_{(n)}^2] = \left(\frac{n+1}{n}\right)^2 \int_0^\theta t^2 \left( \frac{n t^{n-1}}{\theta^n} \right) dt = \left(\frac{n+1}{n}\right)^2 \frac{n}{n+2} \theta^2 = \frac{(n+1)^2}{n(n+2)} \theta^2
   $$
   $$
   \text{Var}(\tilde{\theta}) = \left( \frac{(n+1)^2}{n(n+2)} - 1 \right) \theta^2 = \left( \frac{n^2 + 2n + 1 - (n^2 + 2n)}{n(n+2)} \right) \theta^2 = \frac{\theta^2}{n(n+2)} = O\left(\frac{1}{n^2}\right)
   $$
   Notice that the variance decays at rate **$O(1/n^2)$** (super-efficient / super-convergent), beating the CRLB's universal $O(1/n)$ speed limit! This proves that non-regular estimation problems with parameter-dependent supports operate outside the Cramér-Rao paradigm.
