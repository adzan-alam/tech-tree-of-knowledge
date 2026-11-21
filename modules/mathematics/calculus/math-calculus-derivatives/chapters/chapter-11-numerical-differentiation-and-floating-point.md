# Chapter 11: Numerical Differentiation, Taylor Series, and Floating-Point Error

> *"Analytic formulas exist in the pristine heaven of pure symbols, but reality runs on physical silicon. When a flight controller processes turbulent sensor streams, or a physics simulator integrates rigid-body collisions, there are no symbolic equations to differentiate — only discrete floating-point numbers subject to finite bit-depth, truncation, and roundoff noise."*

---

## 11.1 Beyond Analytic Symbols: Why Numerical Calculus is Essential

Throughout Chapters 4 through 10, we manipulated smooth symbolic formulas using algebraic rules. In practical science, robotics, and software engineering, you will constantly face situations where symbolic differentiation is impossible or impractical:

1. **Discrete Experimental Data:** An inertial measurement unit (IMU) on a drone outputs orientation samples at $500\text{ Hz}$. You must estimate angular velocity and acceleration from a stream of raw numbers.
2. **Black-Box Simulation Functions:** A finite-element aerodynamics engine computes drag given wing sweep angle $\alpha$, but has no closed-form algebraic formula.
3. **Loss Functions in Machine Learning:** Gradients must be estimated through complex computational graphs where numerical perturbation verifies backward-mode automatic differentiation.
4. **Non-Integrable / Transcendental Equations:** Finding equilibrium states where equations cannot be solved algebraically.

To compute derivatives in computer code, we must translate the continuous limit $\lim_{h \to 0}$ into discrete algorithms known as **finite difference stencils**.

---

## 11.2 Deriving Stencils from the Taylor Series

The **Taylor Series** is the master key to numerical analysis. Any sufficiently smooth function $f(x)$ can be expanded into an infinite polynomial series near $x$:

$$f(x + h) = f(x) + f'(x) h + \frac{f''(x)}{2!} h^2 + \frac{f'''(x)}{3!} h^3 + \frac{f^{(4)}(x)}{4!} h^4 + \dots$$

$$f(x - h) = f(x) - f'(x) h + \frac{f''(x)}{2!} h^2 - \frac{f'''(x)}{3!} h^3 + \frac{f^{(4)}(x)}{4!} h^4 - \dots$$

By taking linear combinations of these expansions, we systematically derive the three fundamental difference stencils.

### 1. The Forward Difference Stencil
From the expansion of $f(x+h)$:

$$f(x+h) - f(x) = f'(x) h + \frac{f''(x)}{2} h^2 + \mathcal{O}(h^3)$$

Divide both sides by $h$:

$$D_+ f(x) = \frac{f(x+h) - f(x)}{h} = f'(x) + \underbrace{\frac{f''(x)}{2} h}_{\text{Leading Error Term}} + \mathcal{O}(h^2)$$

Rearranging:

$$f'(x) = \frac{f(x+h) - f(x)}{h} + \mathcal{O}(h)$$

The error is proportional to the first power of step size $h$. We say the Forward Difference is **first-order accurate** ($\mathcal{O}(h)$). If you halve $h$, the error is cut in half ($2\times$ improvement).

### 2. The Backward Difference Stencil
From the expansion of $f(x-h)$:

$$f(x) - f(x-h) = f'(x) h - \frac{f''(x)}{2} h^2 + \mathcal{O}(h^3)$$

$$D_- f(x) = \frac{f(x) - f(x-h)}{h} = f'(x) - \frac{f''(x)}{2} h + \mathcal{O}(h^2)$$

The Backward Difference is also **first-order accurate** ($\mathcal{O}(h)$). In real-time physical simulation (where future data $f(x+h)$ has not yet arrived), backward difference is the only causal stencil available.

### 3. The Central Difference Stencil (The Sovereign Stencil)
Now subtract the $f(x-h)$ expansion from the $f(x+h)$ expansion:

$$f(x+h) - f(x-h) = \left[f(x) + f'(x) h + \frac{f''(x)}{2} h^2 + \frac{f'''(x)}{6} h^3 + \dots\right] - \left[f(x) - f'(x) h + \frac{f''(x)}{2} h^2 - \frac{f'''(x)}{6} h^3 + \dots\right]$$

Notice the symmetry:
- $f(x) - f(x) = 0$
- $f'(x) h - (-f'(x) h) = 2 f'(x) h$
- $\frac{f''(x)}{2} h^2 - \frac{f''(x)}{2} h^2 = 0 \quad \mathbf{(THE\ EVEN\ ERROR\ TERM\ CANCELS\ EXACTLY!)}$
- $\frac{f'''(x)}{6} h^3 - \left(-\frac{f'''(x)}{6} h^3\right) = \frac{2 f'''(x)}{6} h^3 = \frac{f'''(x)}{3} h^3$

Dividing by $2h$:

$$D_0 f(x) = \frac{f(x+h) - f(x-h)}{2h} = f'(x) + \frac{f'''(x)}{6} h^2 + \mathcal{O}(h^4)$$

$$f'(x) = \frac{f(x+h) - f(x-h)}{2h} + \mathcal{O}(h^2)$$

Because the $h^1$ error term vanished by geometric symmetry, the leading error term scales with **$h^2$**!
The Central Difference is **second-order accurate** ($\mathcal{O}(h^2)$).
If you halve $h$, the error drops by a factor of $2^2 = \mathbf{4\times}$!

```
     Forward:  f(x) ---------> f(x+h)         (O(h) error)
     Backward: f(x-h) <------- f(x)           (O(h) error)
     Central:  f(x-h) <====== f(x) ======> f(x+h)   (O(h^2) error - symmetric!)
```

### 4. The Second Derivative Stencil
Add the two Taylor expansions together:

$$f(x+h) + f(x-h) = 2 f(x) + f''(x) h^2 + \frac{f^{(4)}(x)}{12} h^4 + \dots$$

Subtract $2f(x)$ and divide by $h^2$:

$$D^2 f(x) = \frac{f(x+h) - 2f(x) + f(x-h)}{h^2} = f''(x) + \frac{f^{(4)}(x)}{12} h^2 + \mathcal{O}(h^4)$$

This second-order stencil computes acceleration directly from three spatial samples with $\mathcal{O}(h^2)$ precision!

---

## 11.3 The Catastrophic Cancellation Dilemma (The U-Curve)

In mathematical theory, as $h \to 0$, the finite difference quotient converges toward the exact derivative:

$$\lim_{h \to 0} \frac{f(x+h) - f(x-h)}{2h} = f'(x)$$

In a physical computer using IEEE 754 floating-point numbers (standard 64-bit `Float64` or `double`), this mathematical limit **fails catastrophically**.

### The Two Competing Errors
When computing derivatives on a digital computer, total error is the sum of two opposing phenomena:

1. **Truncation Error (Mathematical):** The error caused by chopping off higher-order Taylor terms.
   For central difference: $E_{\text{trunc}} \approx \frac{M}{6} h^2$. As $h \to 0$, truncation error decreases.
2. **Roundoff Error (Floating-Point Hardware):** A 64-bit float has 53 bits of mantissa, providing roughly 15 to 17 decimal digits of precision ($\epsilon_{\text{mach}} \approx 2.22 \times 10^{-16}$).
   When $h$ is very small, $f(x+h)$ and $f(x-h)$ are nearly identical numbers. When two numbers sharing the first 14 digits are subtracted, the leading digits cancel to zero, leaving only random rounding noise. This is **catastrophic cancellation**.
   Dividing this tiny rounding noise by a microscopic $h$ amplifies the error:
   $$E_{\text{roundoff}} \approx \frac{2 \epsilon_{\text{mach}} |f(x)|}{2h} = \frac{\epsilon_{\text{mach}} |f(x)|}{h}$$

### Total Computational Error
$$E_{\text{total}}(h) = \frac{M}{6} h^2 + \frac{\epsilon_{\text{mach}}}{h}$$

Look at the dependency on $h$:
- If $h$ is too large ($h = 0.5$): Truncation error dominates ($\approx h^2$).
- If $h$ is too small ($h = 10^{-15}$): Roundoff error explodes ($\approx \frac{10^{-16}}{10^{-15}} = 0.1 \implies 10\%$ error!).
- If $h = 10^{-18}$: $f(x+h)$ rounds to exactly $f(x-h)$, giving $\frac{0}{10^{-18}} = 0$ (100% error!).

```
      Total Error
       E ^
         | \                                 /  Truncation Error ~ h^2
         |  \                               /
         |   \                             /
         |    \     Optimal Step h*       /
         |     \           |             /
         |      \          v            /
         |       '._       .          .'
         |          '-..._____...-''
         |       Roundoff Error ~ 1/h
         +---------------------------------------------> Step Size h
                 10^-16    10^-5        10^-1
```

### Finding the Optimal Step Size $h^*$
Differentiate $E_{\text{total}}(h)$ with respect to $h$ and set to zero:

$$\frac{dE}{dh} = \frac{M}{3} h - \frac{\epsilon_{\text{mach}}}{h^2} = 0 \implies \frac{M}{3} h = \frac{\epsilon_{\text{mach}}}{h^2} \implies h^3 = \frac{3 \epsilon_{\text{mach}}}{M}$$

$$h_{\text{opt}} \approx \left(\epsilon_{\text{mach}}\right)^{1/3} \approx \left(10^{-16}\right)^{1/3} \approx 10^{-5.3} \approx \mathbf{10^{-5}}$$

> [!IMPORTANT]
> **The Golden Rule of Numerical Differentiation:**
> - For **Central Differences** ($\mathcal{O}(h^2)$): Choose $h \approx \sqrt[3]{\epsilon_{\text{mach}}} \approx \mathbf{10^{-5}}$ (yields $\approx 10$ to $11$ digits of precision).
> - For **Forward Differences** ($\mathcal{O}(h)$): Choose $h \approx \sqrt{\epsilon_{\text{mach}}} \approx \mathbf{10^{-8}}$ (yields $\approx 7$ to $8$ digits of precision).
> **Never** choose $h = 10^{-16}$ in floating-point code!

---

## 11.4 Richardson Extrapolation: Boosting to $\mathcal{O}(h^4)$

Can we achieve higher precision without shrinking $h$ into roundoff noise? Yes, through **Richardson Extrapolation**.

Let $D(h)$ denote the central difference computed with step $h$:

$$D(h) = f'(x) + c_1 h^2 + c_2 h^4 + \dots$$

Now compute the central difference with half the step size, $h/2$:

$$D\left(\frac{h}{2}\right) = f'(x) + c_1 \left(\frac{h}{2}\right)^2 + c_2 \left(\frac{h}{2}\right)^4 + \dots = f'(x) + \frac{c_1}{4} h^2 + \frac{c_2}{16} h^4 + \dots$$

Multiply $D(h/2)$ by $4$ and subtract $D(h)$:

$$4 D\left(\frac{h}{2}\right) - D(h) = 4 f'(x) - f'(x) + (c_1 h^2 - c_1 h^2) + \left(\frac{c_2}{4} - c_2\right) h^4 + \dots$$
$$4 D\left(\frac{h}{2}\right) - D(h) = 3 f'(x) - \frac{3}{4} c_2 h^4 + \dots$$

Divide by $3$:

$$f_{\text{extrap}}'(x) = \frac{4 D(h/2) - D(h)}{3} = f'(x) + \mathcal{O}(h^4)$$

By combining two evaluations at moderate step sizes ($h$ and $h/2$), the $h^2$ error term is completely annihilated, producing a **fourth-order accurate** estimate ($\mathcal{O}(h^4)$) completely immune to roundoff noise!

---

## 11.5 The Newton-Raphson Root-Finding Engine

Differentiation is not just for finding rates; it is the most powerful tool for solving non-linear equations $f(x) = 0$.

Suppose we have an estimate $x_n$ near a root. We replace the curve $y = f(x)$ with its tangent line at $(x_n, f(x_n))$:

$$y - f(x_n) = f'(x_n)(x - x_n)$$

The tangent line intersects the horizontal axis ($y = 0$) at a new, vastly superior estimate $x_{n+1}$:

$$0 - f(x_n) = f'(x_n)(x_{n+1} - x_n)$$
$$-f(x_n) = f'(x_n)(x_{n+1} - x_n) \implies x_{n+1} - x_n = -\frac{f(x_n)}{f'(x_n)}$$

$$\mathbf{x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}}$$

```
       y ^                                .--* (x_0, f(x_0))
         |                             .-'  /
         |                          .-'    / Tangent Line
         |                       .-'      /
         |     Exact Root r   .-'        /
       --+------------*------+----------*----------> x
         |          .'      x_1        x_0
         |       .-'
```

### Quadratic Convergence
When near a simple root ($f'(r) \neq 0$), Newton-Raphson possesses **quadratic convergence**:

$$|x_{n+1} - r| \le C |x_n - r|^2$$

Each iteration **doubles the number of correct decimal digits**!
- Iteration 1: 2 correct digits
- Iteration 2: 4 correct digits
- Iteration 3: 8 correct digits
- Iteration 4: 16 correct digits (full machine precision in 4 steps!)

---

## 11.6 Ten Progressive Worked Numerical Examples

### Example 11.1: Stencil Comparison on a Cubic Polynomial
**Problem:** For $f(x) = x^3 - 4x + 2$, compute the exact derivative at $x = 2$, and compare against Forward, Backward, and Central Difference approximations using $h = 0.1$.

**Step 1:** Exact derivative:
$$f'(x) = 3x^2 - 4 \implies f'(2) = 3(2^2) - 4 = 12 - 4 = 8.000000$$

**Step 2:** Sample function values:
- $f(2) = 2^3 - 4(2) + 2 = 8 - 8 + 2 = 2.000000$
- $f(2 + 0.1) = f(2.1) = (2.1)^3 - 4(2.1) + 2 = 9.261 - 8.4 + 2 = 2.861000$
- $f(2 - 0.1) = f(1.9) = (1.9)^3 - 4(1.9) + 2 = 6.859 - 7.6 + 2 = 1.259000$

**Step 3:** Evaluate stencils:
1. **Forward Difference:**
   $$D_+ = \frac{f(2.1) - f(2)}{0.1} = \frac{2.861 - 2.0}{0.1} = \frac{0.861}{0.1} = 8.610000$$
   $$\text{Absolute Error} = |8.61 - 8.0| = 0.610000$$
2. **Backward Difference:**
   $$D_- = \frac{f(2) - f(1.9)}{0.1} = \frac{2.0 - 1.259}{0.1} = \frac{0.741}{0.1} = 7.410000$$
   $$\text{Absolute Error} = |7.41 - 8.0| = 0.590000$$
3. **Central Difference:**
   $$D_0 = \frac{f(2.1) - f(1.9)}{2(0.1)} = \frac{2.861 - 1.259}{0.2} = \frac{1.602}{0.2} = 8.010000$$
   $$\text{Absolute Error} = |8.01 - 8.0| = \mathbf{0.010000}$$

**Conclusion:** The Central Difference error ($0.01$) is over **$60\times$ smaller** than the one-sided stencils ($0.61$) for the exact same step size!

---

### Example 11.2: Convergence Rate Verification via Step Halving
**Problem:** Using the function from Example 11.1, recalculate the Central Difference with $h = 0.05$ (halving the step size) and verify the $\mathcal{O}(h^2)$ quadratic error reduction.

**Step 1:** Sample function values at $h = 0.05$:
- $f(2 + 0.05) = f(2.05) = (2.05)^3 - 4(2.05) + 2 = 8.615125 - 8.2 + 2 = 2.415125$
- $f(2 - 0.05) = f(1.95) = (1.95)^3 - 4(1.95) + 2 = 7.414875 - 7.8 + 2 = 1.614875$

**Step 2:** Central Difference with $h = 0.05$:
$$D_0(0.05) = \frac{2.415125 - 1.614875}{2(0.05)} = \frac{0.800250}{0.10} = 8.002500$$

**Step 3:** Error comparison:
- Error at $h = 0.10$: $E(0.10) = 8.010000 - 8.0 = 0.010000$
- Error at $h = 0.05$: $E(0.05) = 8.002500 - 8.0 = 0.002500$
- Error ratio:
  $$\frac{E(0.10)}{E(0.05)} = \frac{0.010000}{0.002500} = \mathbf{4.0000}$$

**Conclusion:** Halving $h$ reduced error by exactly $4\times = 2^2$, proving second-order convergence $\mathcal{O}(h^2)$.

---

### Example 11.3: Demonstrating Catastrophic Cancellation in Floating-Point
**Problem:** Estimate the derivative of $f(x) = \sin x$ at $x = 1.0$ using forward difference with step sizes ranging from $h = 10^{-2}$ down to $h = 10^{-16}$. Trace the error curve.

Exact derivative: $f'(1.0) = \cos(1.0) \approx 0.5403023058681397$.

| Step Size $h$ | Forward Difference $D_+(h)$ | Absolute Error $|D_+ - \cos(1)|$ | Primary Error Cause |
| :---: | :---: | :---: | :--- |
| $10^{-2}$ | $0.5360859812$ | $4.22 \times 10^{-3}$ | Truncation ($\approx \frac{1}{2}f''(x) h$) |
| $10^{-4}$ | $0.5402602334$ | $4.21 \times 10^{-5}$ | Truncation dominates |
| $10^{-6}$ | $0.5403018851$ | $4.21 \times 10^{-7}$ | Truncation dominates |
| $\mathbf{10^{-8}}$ | $\mathbf{0.5403023053}$ | $\mathbf{5.68 \times 10^{-10}}$ | **OPTIMAL REGION (Minimum Error)** |
| $10^{-10}$ | $0.5403023389$ | $3.30 \times 10^{-8}$ | Roundoff noise begins rising |
| $10^{-12}$ | $0.5403025609$ | $2.55 \times 10^{-7}$ | Roundoff noise growing |
| $10^{-14}$ | $0.5406788555$ | $3.76 \times 10^{-4}$ | Significant digit loss |
| $10^{-16}$ | $0.0000000000$ | $0.540302$ | **100% CATASTROPHIC CANCELLATION** ($f(x+h) == f(x)$) |

This empirical table verifies the theoretical U-curve: pushing $h$ below $10^{-8}$ for forward difference drastically degrades accuracy!

---

### Example 11.4: Second-Order Difference Stencil for Curvature
**Problem:** For $f(x) = \cos x$, compute the exact second derivative at $x = \frac{\pi}{3}$, and compare with the numerical second derivative stencil $D^2(h)$ with $h = 0.1$.

**Step 1:** Exact value:
$$f''(x) = -\cos x \implies f''\left(\frac{\pi}{3}\right) = -\cos\left(\frac{\pi}{3}\right) = -0.5000000$$

**Step 2:** Sample values at $x_0 = \frac{\pi}{3} \approx 1.04719755$:
- $f(x_0) = \cos(1.04719755) = 0.50000000$
- $f(x_0 + 0.1) = \cos(1.14719755) \approx 0.41103390$
- $f(x_0 - 0.1) = \cos(0.94719755) \approx 0.58416801$

**Step 3:** Apply the stencil:
$$D^2(0.1) = \frac{f(x_0 + h) - 2f(x_0) + f(x_0 - h)}{h^2}$$
$$\text{Numerator} = 0.41103390 - 2(0.50000000) + 0.58416801 = 0.41103390 - 1.00000000 + 0.58416801 = -0.00479809$$
$$\text{Denominator} = (0.1)^2 = 0.01$$
$$D^2(0.1) = \frac{-0.00479809}{0.01} = -0.479809$$

**Step 4:** Compare error:
$$\text{Error} = |-0.479809 - (-0.500000)| = 0.020191 \approx 4\%$$

---

### Example 11.5: Applying Richardson Extrapolation
**Problem:** Using the data from Examples 11.1 and 11.2 ($D_0(0.10) = 8.010000$ and $D_0(0.05) = 8.002500$ for $f'(2) = 8.0$), apply Richardson Extrapolation to eliminate the $h^2$ error.

**Step 1:** Apply formula $f_{\text{extrap}}' = \frac{4 D(h/2) - D(h)}{3}$:
$$f_{\text{extrap}}' = \frac{4(8.002500) - 8.010000}{3} = \frac{32.010000 - 8.010000}{3} = \frac{24.000000}{3} = \mathbf{8.000000}$$

**Conclusion:** The extrapolated result matches the exact analytic derivative $8.000000$ down to the final zero!

---

### Example 11.6: Differentiating a Discrete Telemetry Table
**Problem:** An autonomous drone's altimeter records altitude $z$ at $0.2\text{-second}$ intervals:

| Time $t$ (s) | Altitude $z(t)$ (m) |
| :---: | :---: |
| $1.0$ | $42.10$ |
| $1.2$ | $45.68$ |
| $1.4$ | $50.14$ |
| $1.6$ | $55.48$ |
| $1.8$ | $61.70$ |

Estimate the vertical velocity and vertical acceleration at $t = 1.4\text{ seconds}$.

**Step 1:** Step size is uniform: $h = \Delta t = 0.2\text{ s}$. Target index is $t_2 = 1.4\text{ s}$.

**Step 2:** Central difference for velocity $v(1.4) = z'(1.4)$:
$$v(1.4) \approx \frac{z(1.6) - z(1.2)}{2h} = \frac{55.48 - 45.68}{2(0.2)} = \frac{9.80}{0.40} = 24.50\text{ m/s}$$

**Step 3:** Second derivative stencil for acceleration $a(1.4) = z''(1.4)$:
$$a(1.4) \approx \frac{z(1.6) - 2z(1.4) + z(1.2)}{h^2} = \frac{55.48 - 2(50.14) + 45.68}{(0.2)^2}$$
$$\text{Numerator} = 55.48 - 100.28 + 45.68 = 0.88\text{ m}$$
$$\text{Denominator} = 0.04\text{ s}^2$$
$$a(1.4) \approx \frac{0.88}{0.04} = 22.00\text{ m/s}^2$$

**Conclusion:** At $t = 1.4\text{ s}$, vertical velocity is $24.50\text{ m/s}$ and vertical acceleration is $22.00\text{ m/s}^2$.

---

### Example 11.7: Newton-Raphson Calculation of $\sqrt{7}$
**Problem:** Use the Newton-Raphson method to compute $\sqrt{7}$ to 8 decimal places starting from initial guess $x_0 = 3.0$.

**Step 1:** Formulate as a root-finding problem:
$$x = \sqrt{7} \iff x^2 = 7 \iff f(x) = x^2 - 7 = 0$$

**Step 2:** Compute derivative:
$$f'(x) = 2x$$

**Step 3:** Formulate Newton iteration:
$$x_{n+1} = x_n - \frac{x_n^2 - 7}{2x_n} = \frac{2x_n^2 - (x_n^2 - 7)}{2x_n} = \frac{x_n^2 + 7}{2x_n} = \frac{1}{2}\left(x_n + \frac{7}{x_n}\right)$$

**Step 4:** Execute iterations:
- **Iteration 0:** $x_0 = 3.00000000$
- **Iteration 1:**
  $$x_1 = \frac{1}{2}\left(3 + \frac{7}{3}\right) = \frac{1}{2}\left(\frac{16}{3}\right) = \frac{8}{3} \approx 2.66666667$$
- **Iteration 2:**
  $$x_2 = \frac{1}{2}\left(2.66666667 + \frac{7}{2.66666667}\right) = \frac{1}{2}(2.66666667 + 2.62500000) = 2.64583333$$
- **Iteration 3:**
  $$x_3 = \frac{1}{2}\left(2.64583333 + \frac{7}{2.64583333}\right) = \frac{1}{2}(2.64583333 + 2.64566929) = 2.64575131$$
- **Iteration 4:**
  $$x_4 = \frac{1}{2}\left(2.64575131 + \frac{7}{2.64575131}\right) = 2.64575131$$

The value has converged to 8 decimal places in just 4 iterations!
$$\sqrt{7} \approx 2.64575131$$

---

### Example 11.8: Newton-Raphson on a Non-Linear Cubic Polynomial
**Problem:** Solve $x^3 - 2x - 5 = 0$ for its unique real root starting from $x_0 = 2.0$.

**Step 1:** $f(x) = x^3 - 2x - 5 \implies f'(x) = 3x^2 - 2$.
**Step 2:** Newton iteration:
$$x_{n+1} = x_n - \frac{x_n^3 - 2x_n - 5}{3x_n^2 - 2}$$

**Step 3:** Step-by-step computation:
- **Iteration 0:** $x_0 = 2.0$.
  $$f(2) = 8 - 4 - 5 = -1, \quad f'(2) = 3(4) - 2 = 10$$
  $$x_1 = 2 - \frac{-1}{10} = 2 + 0.1 = 2.100000$$
- **Iteration 1:** $x_1 = 2.1$.
  $$f(2.1) = (2.1)^3 - 2(2.1) - 5 = 9.261 - 4.2 - 5 = 0.061$$
  $$f'(2.1) = 3(2.1)^2 - 2 = 3(4.41) - 2 = 13.23 - 2 = 11.23$$
  $$x_2 = 2.1 - \frac{0.061}{11.23} = 2.1 - 0.00543188 = 2.094568$$
- **Iteration 2:** $x_2 = 2.094568$.
  $$f(2.094568) = (2.094568)^3 - 2(2.094568) - 5 \approx 0.000185$$
  $$f'(2.094568) = 3(2.094568)^2 - 2 \approx 11.1614$$
  $$x_3 = 2.094568 - \frac{0.000185}{11.1614} = 2.094551$$

**Conclusion:** The root is $x \approx 2.094551$.

---

### Example 11.9: Diagnosing Newton-Raphson Failure Modes
**Problem:** Demonstrate why Newton-Raphson fails to converge on $f(x) = x^{1/3}$ when starting from $x_0 = 1.0$.

**Step 1:** $f(x) = x^{1/3} \implies f'(x) = \frac{1}{3}x^{-2/3}$.
**Step 2:** Formulate the Newton step:
$$x_{n+1} = x_n - \frac{x_n^{1/3}}{\frac{1}{3}x_n^{-2/3}} = x_n - 3 x_n^{\frac{1}{3} - \left(-\frac{2}{3}\right)} = x_n - 3x_n^1 = -2x_n$$

**Step 3:** Trace the iteration sequence starting from $x_0 = 1$:
- $x_0 = 1$
- $x_1 = -2(1) = -2$
- $x_2 = -2(-2) = +4$
- $x_3 = -2(4) = -8$
- $x_4 = +16$
- $x_n = (-2)^n$

**Conclusion:** Instead of converging toward the root at $x = 0$, the iterations explode outward with alternating signs toward $\pm\infty$. Newton-Raphson fails because the derivative approaches infinity as $x \to 0$ ($f'(0)$ does not exist).

---

### Example 11.10: 2D Spatial Gradient Estimation for Autonomous Navigation
**Problem:** A robotic exploration vehicle navigates a potential field landscape modeled by elevation $U(x, y) = 3x^2 + 2y^2 - 4xy$. Using central differences with step $h = 0.01$, estimate the gradient vector $\nabla U = \langle \frac{\partial U}{\partial x}, \frac{\partial U}{\partial y} \rangle$ at $(2, 3)$, and compare with the analytic gradient.

**Step 1:** Analytic gradient:
$$\frac{\partial U}{\partial x} = 6x - 4y \implies \frac{\partial U}{\partial x}(2, 3) = 6(2) - 4(3) = 12 - 12 = 0$$
$$\frac{\partial U}{\partial y} = 4y - 4x \implies \frac{\partial U}{\partial y}(2, 3) = 4(3) - 4(2) = 12 - 8 = 4$$
$$\nabla U_{\text{exact}} = \langle 0, 4 \rangle$$

**Step 2:** Numerical partial difference for $\frac{\partial U}{\partial x}$ at $(2, 3)$ with $h = 0.01$:
- $U(2 + 0.01, 3) = U(2.01, 3) = 3(2.01)^2 + 2(3^2) - 4(2.01)(3) = 12.1203 + 18 - 24.12 = 6.0003$
- $U(2 - 0.01, 3) = U(1.99, 3) = 3(1.99)^2 + 2(3^2) - 4(1.99)(3) = 11.8803 + 18 - 23.88 = 6.0003$
$$\frac{\partial U}{\partial x} \approx \frac{6.0003 - 6.0003}{2(0.01)} = \frac{0.0000}{0.02} = 0.0000$$

**Step 3:** Numerical partial difference for $\frac{\partial U}{\partial y}$ at $(2, 3)$ with $h = 0.01$:
- $U(2, 3 + 0.01) = U(2, 3.01) = 3(2^2) + 2(3.01)^2 - 4(2)(3.01) = 12 + 18.1202 - 24.08 = 6.0402$
- $U(2, 3 - 0.01) = U(2, 2.99) = 3(2^2) + 2(2.99)^2 - 4(2)(2.99) = 12 + 17.8802 - 23.92 = 5.9602$
$$\frac{\partial U}{\partial y} \approx \frac{6.0402 - 5.9602}{2(0.01)} = \frac{0.0800}{0.02} = 4.0000$$

**Conclusion:** The estimated numerical gradient is $\langle 0.0000, 4.0000 \rangle$, matching the analytic gradient perfectly to four decimal places.

---

## 11.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Basic Stencil Computations
- **Exercise 11.1:** For $f(x) = 2x^2 + 5x$, compute the forward difference approximation of $f'(3)$ with $h = 0.1$ and compare to the exact derivative.
- **Exercise 11.2:** For $f(x) = 2x^2 + 5x$, compute the central difference approximation of $f'(3)$ with $h = 0.1$ and compare the error to Exercise 11.1.

### Tier 2: Second Derivative Stencils
- **Exercise 11.3:** For $f(x) = x^4$, use the second derivative stencil with $h = 0.1$ to estimate $f''(2)$ and compute the absolute error.
- **Exercise 11.4:** For $f(x) = \frac{1}{x}$, compute the central difference estimate of $f'(2)$ with $h = 0.05$.

### Tier 3: Richardson Extrapolation
- **Exercise 11.5:** Suppose a central difference computation gives $D(0.2) = 14.1200$ and $D(0.1) = 14.0300$. Use Richardson Extrapolation to find a fourth-order accurate derivative estimate.
- **Exercise 11.6:** An accelerometer records velocities: $v(0.0) = 0$, $v(0.1) = 1.25$, $v(0.2) = 2.80$, $v(0.3) = 4.65\text{ m/s}$. Estimate the acceleration at $t = 0.2\text{ s}$ using central difference.

### Tier 4: Newton-Raphson Iterations
- **Exercise 11.7:** Use the Newton-Raphson formula to perform two iterations for solving $x^2 - 11 = 0$ starting with $x_0 = 3.0$.
- **Exercise 11.8:** Perform two Newton-Raphson iterations to locate the root of $f(x) = \cos x - x$ starting with $x_0 = 0.5$ radians.

### Tier 5: Theoretical Error Analysis & Floating-Point Limits
- **Exercise 11.9:** Prove that for any quadratic polynomial $P(x) = ax^2 + bx + c$, the Central Difference stencil with any non-zero step size $h$ yields the **exact** derivative with zero truncation error!
- **Exercise 11.10:** If a 32-bit single-precision float has machine epsilon $\epsilon_{\text{mach}} \approx 1.19 \times 10^{-7}$, calculate the optimal step size $h^*$ for Central Difference numerical differentiation.

---

## 11.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 11.1
For $f(x) = 2x^2 + 5x$ at $x = 3$:
1. Exact derivative: $f'(x) = 4x + 5 \implies f'(3) = 4(3) + 5 = 17$.
2. Forward difference with $h = 0.1$:
- $f(3) = 2(9) + 5(3) = 18 + 15 = 33$.
- $f(3.1) = 2(3.1^2) + 5(3.1) = 2(9.61) + 15.5 = 19.22 + 15.5 = 34.72$.
$$D_+ = \frac{34.72 - 33}{0.1} = \frac{1.72}{0.1} = 17.20$$
3. Absolute error: $|17.20 - 17.00| = 0.20$.
**Final Answer:** $D_+ = 17.20$; Absolute error $= 0.20$.

---

### Solution to Exercise 11.2
For $f(x) = 2x^2 + 5x$ at $x = 3$ with $h = 0.1$:
1. $f(3 + 0.1) = f(3.1) = 34.72$.
2. $f(3 - 0.1) = f(2.9) = 2(2.9^2) + 5(2.9) = 2(8.41) + 14.5 = 16.82 + 14.5 = 31.32$.
3. Central difference:
$$D_0 = \frac{34.72 - 31.32}{2(0.1)} = \frac{3.40}{0.20} = 17.00$$
4. Absolute error: $|17.00 - 17.00| = 0.00$.
**Final Answer:** $D_0 = 17.00$; Absolute error $= 0.00$ (exact!).

---

### Solution to Exercise 11.3
Estimate $f''(2)$ for $f(x) = x^4$ with $h = 0.1$:
1. Exact second derivative: $f'(x) = 4x^3 \implies f''(x) = 12x^2 \implies f''(2) = 12(4) = 48.0$.
2. Sample points:
- $f(2) = 16$.
- $f(2.1) = 2.1^4 = 19.4481$.
- $f(1.9) = 1.9^4 = 13.0321$.
3. Apply stencil:
$$D^2(0.1) = \frac{19.4481 - 2(16) + 13.0321}{0.01} = \frac{19.4481 - 32 + 13.0321}{0.01} = \frac{0.4802}{0.01} = 48.02$$
4. Absolute error: $|48.02 - 48.00| = 0.02$.
**Final Answer:** $D^2 = 48.02$; Absolute error $= 0.02$.

---

### Solution to Exercise 11.4
For $f(x) = \frac{1}{x}$ at $x = 2$ with $h = 0.05$:
1. Exact derivative: $f'(x) = -\frac{1}{x^2} \implies f'(2) = -0.250000$.
2. Samples:
- $f(2.05) = \frac{1}{2.05} \approx 0.48780488$.
- $f(1.95) = \frac{1}{1.95} \approx 0.51282051$.
3. Central difference:
$$D_0 = \frac{0.48780488 - 0.51282051}{0.10} = \frac{-0.02501563}{0.10} = -0.250156$$
4. Absolute error: $|-0.250156 - (-0.250000)| = 0.000156$.
**Final Answer:** $D_0 \approx -0.250156$; Absolute error $\approx 0.000156$.

---

### Solution to Exercise 11.5
Richardson Extrapolation with $D(0.2) = 14.1200$ and $D(0.1) = 14.0300$:
$$f_{\text{extrap}}' = \frac{4 D(0.1) - D(0.2)}{3} = \frac{4(14.0300) - 14.1200}{3} = \frac{56.1200 - 14.1200}{3} = \frac{42.0000}{3} = 14.0000$$
**Final Answer:** $14.0000$.

---

### Solution to Exercise 11.6
Estimate acceleration at $t = 0.2\text{ s}$ from telemetry:
Given $v(0.1) = 1.25\text{ m/s}$ and $v(0.3) = 4.65\text{ m/s}$ with $h = 0.1\text{ s}$:
$$a(0.2) \approx \frac{v(0.3) - v(0.1)}{2h} = \frac{4.65 - 1.25}{2(0.1)} = \frac{3.40}{0.20} = 17.0\text{ m/s}^2$$
**Final Answer:** $a(0.2) \approx 17.0\text{ m/s}^2$.

---

### Solution to Exercise 11.7
Solve $x^2 - 11 = 0$ via Newton-Raphson starting with $x_0 = 3.0$:
Formula: $x_{n+1} = \frac{1}{2}\left(x_n + \frac{11}{x_n}\right)$.
- Iteration 1:
  $$x_1 = \frac{1}{2}\left(3 + \frac{11}{3}\right) = \frac{1}{2}\left(\frac{20}{3}\right) = \frac{10}{3} \approx 3.333333$$
- Iteration 2:
  $$x_2 = \frac{1}{2}\left(3.333333 + \frac{11}{3.333333}\right) = \frac{1}{2}(3.333333 + 3.300000) = 3.316667$$
(Note: $\sqrt{11} \approx 3.31662479$).
**Final Answer:** $x_1 \approx 3.333333$, $x_2 \approx 3.316667$.

---

### Solution to Exercise 11.8
Find root of $f(x) = \cos x - x$ starting with $x_0 = 0.5$:
1. $f'(x) = -\sin x - 1$.
2. Formula: $x_{n+1} = x_n - \frac{\cos x_n - x_n}{-\sin x_n - 1} = x_n + \frac{\cos x_n - x_n}{\sin x_n + 1}$.
- Iteration 0: $x_0 = 0.5$.
  $\cos(0.5) \approx 0.877583 \implies f(0.5) = 0.877583 - 0.5 = 0.377583$.
  $\sin(0.5) \approx 0.479426 \implies f'(0.5) = -1.479426$.
  $$x_1 = 0.5 - \frac{0.377583}{-1.479426} = 0.5 + 0.255222 = 0.755222$$
- Iteration 1: $x_1 = 0.755222$.
  $\cos(0.755222) \approx 0.728027 \implies f(0.755222) = 0.728027 - 0.755222 = -0.027195$.
  $\sin(0.755222) \approx 0.685548 \implies f'(0.755222) = -1.685548$.
  $$x_2 = 0.755222 - \frac{-0.027195}{-1.685548} = 0.755222 - 0.016134 = 0.7391$$
**Final Answer:** $x_1 \approx 0.7552$, $x_2 \approx 0.7391$.

---

### Solution to Exercise 11.9
Prove Central Difference is exact for any quadratic $P(x) = ax^2 + bx + c$:
1. Exact derivative: $P'(x) = 2ax + b$.
2. Compute $P(x+h) - P(x-h)$:
$$P(x+h) = a(x+h)^2 + b(x+h) + c = ax^2 + 2axh + ah^2 + bx + bh + c$$
$$P(x-h) = a(x-h)^2 + b(x-h) + c = ax^2 - 2axh + ah^2 + bx - bh + c$$
Subtracting:
$$P(x+h) - P(x-h) = 4axh + 2bh = 2h(2ax + b)$$
3. Divide by $2h$:
$$D_0 P(x) = \frac{2h(2ax + b)}{2h} = 2ax + b = P'(x) \quad \blacksquare$$
The error is identically zero for all $h \neq 0$.
**Final Answer:** Proved. Truncation error is identically zero because all third- and higher-order derivatives of a quadratic are zero ($P'''(x) \equiv 0$).

---

### Solution to Exercise 11.10
Optimal step size for single precision float ($\epsilon_{\text{mach}} \approx 1.19 \times 10^{-7}$):
For central differences:
$$h^* \approx (\epsilon_{\text{mach}})^{1/3} = (1.19 \times 10^{-7})^{1/3} \approx (119 \times 10^{-9})^{1/3} = \sqrt[3]{119} \times 10^{-3} \approx 4.92 \times 10^{-3} \approx 0.005$$
**Final Answer:** $h^* \approx 5 \times 10^{-3}$ (or $\approx 0.005$).
