# Chapter 5: Linearity, the Power Rule, and Polynomial Calculus

> *"In the dawn of calculus, finding the slope of a curve demanded a painstaking siege of algebraic manipulation and vanishing steps for every single equation. The discovery of operational rules transformed this grueling labor into swift, mechanical calculation — turning what was once a creative ordeal into an exact, reproducible science."*

---

## 5.1 The Transition from First Principles to Operational Rules

In Chapter 4, we saw that evaluating the formal limit:

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

from scratch for every function is computationally exhaustive. Even for modest polynomials, expanding powers of $(x+h)$ generates sprawling binomial coefficients.

Fortunately, mathematics is the art of recognizing structural invariants. When we analyze the limit definition applied to common functional forms, universal algebraic patterns emerge. Once these patterns are proven once and for all, they become **operational derivative rules**. These rules allow an engineer or scientist to differentiate any polynomial or rational power expression in seconds with 100% precision.

---

## 5.2 The Foundations of Linearity

Differentiation is a **linear operator**. In advanced mathematics and physics simulation, an operator $L$ is called *linear* if it satisfies two inviolable axioms:
1. **Additivity:** $L[f + g] = L[f] + L[g]$
2. **Homogeneity (Scalar Multiplication):** $L[c \cdot f] = c \cdot L[f]$

Let us prove both axioms directly from the fundamental limit laws.

### Theorem 1: The Constant Rule
For any real constant $c \in \mathbb{R}$:

$$\frac{d}{dx}[c] = 0$$

*Proof:* Let $f(x) = c$. Then $f(x+h) = c$.
$$\frac{d}{dx}[c] = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} = \lim_{h \to 0} \frac{c - c}{h} = \lim_{h \to 0} \frac{0}{h} = \lim_{h \to 0} 0 = 0 \quad \blacksquare$$

### Theorem 2: The Constant Multiple Rule
If $f(x)$ is differentiable and $c \in \mathbb{R}$ is any constant scalar:

$$\frac{d}{dx}[c \cdot f(x)] = c \cdot \frac{df}{dx} = c \cdot f'(x)$$

*Proof:* Let $g(x) = c \cdot f(x)$.
$$\frac{d}{dx}[g(x)] = \lim_{h \to 0} \frac{c \cdot f(x+h) - c \cdot f(x)}{h} = \lim_{h \to 0} c \cdot \left[ \frac{f(x+h) - f(x)}{h} \right]$$
By the constant multiple limit law, the scalar $c$ factors outside the limit:
$$= c \cdot \left( \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} \right) = c \cdot f'(x) \quad \blacksquare$$

### Theorem 3: The Sum and Difference Rules
If $f(x)$ and $g(x)$ are both differentiable at $x$:

$$\frac{d}{dx}[f(x) \pm g(x)] = f'(x) \pm g'(x)$$

*Proof:* Let $S(x) = f(x) + g(x)$.
$$\frac{dS}{dx} = \lim_{h \to 0} \frac{[f(x+h) + g(x+h)] - [f(x) + g(x)]}{h}$$
Regroup the terms in the numerator by function:
$$= \lim_{h \to 0} \left[ \frac{f(x+h) - f(x)}{h} + \frac{g(x+h) - g(x)}{h} \right]$$
By the limit sum law, the limit of a sum is the sum of the limits:
$$= \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} + \lim_{h \to 0} \frac{g(x+h) - g(x)}{h} = f'(x) + g'(x) \quad \blacksquare$$
An identical argument using a subtraction sign establishes the difference rule.

Together, these rules mean we can differentiate any sum of terms term-by-term, pulling constant multipliers along untouched!

---

## 5.3 The Sovereign Power Rule

The most famous shortcut in all of calculus is the **Power Rule**:

$$\frac{d}{dx}\left[x^n\right] = n x^{n-1}$$

This formula holds true for **any real number exponent $n$**: positive integers, zero, negative integers, rational fractions, and irrational numbers alike!

### Proof for Positive Integers $n \in \mathbb{N}$ via the Binomial Theorem
Recall Newton's Binomial Expansion for $(x+h)^n$:

$$(x+h)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} h^k = x^n + \binom{n}{1} x^{n-1} h + \binom{n}{2} x^{n-2} h^2 + \dots + h^n$$

Notice that the binomial coefficient $\binom{n}{1} = n$. Substituting this into the formal derivative limit:

$$\frac{d}{dx}[x^n] = \lim_{h \to 0} \frac{(x+h)^n - x^n}{h}$$
$$= \lim_{h \to 0} \frac{\left( x^n + n x^{n-1} h + \binom{n}{2} x^{n-2} h^2 + \dots + h^n \right) - x^n}{h}$$

The leading $x^n$ terms cancel exactly:

$$= \lim_{h \to 0} \frac{n x^{n-1} h + \binom{n}{2} x^{n-2} h^2 + \dots + h^n}{h}$$

Factor out $h$ from every remaining term in the numerator:

$$= \lim_{h \to 0} \frac{h \cdot \left[ n x^{n-1} + \binom{n}{2} x^{n-2} h + \dots + h^{n-1} \right]}{h}$$

For all $h \neq 0$, cancel $h$:

$$= \lim_{h \to 0} \left[ n x^{n-1} + \binom{n}{2} x^{n-2} h + \dots + h^{n-1} \right]$$

Now take the limit as $h \to 0$. Every single term after the first contains at least one factor of $h$, meaning every subsequent term vanishes into zero:

$$= n x^{n-1} + 0 + 0 + \dots + 0 = n x^{n-1} \quad \blacksquare$$

### Extension to Fractional and Negative Powers
Consider $f(x) = x^{1/2} = \sqrt{x}$. Applying the power rule with $n = \frac{1}{2}$:

$$\frac{d}{dx}[x^{1/2}] = \frac{1}{2} x^{\frac{1}{2} - 1} = \frac{1}{2} x^{-1/2} = \frac{1}{2\sqrt{x}}$$

This matches our first-principles conjugate derivation in Chapter 4 down to the exact digit!

Consider $f(x) = x^{-1} = \frac{1}{x}$. Applying the power rule with $n = -1$:

$$\frac{d}{dx}[x^{-1}] = (-1) x^{-1 - 1} = -1 x^{-2} = -\frac{1}{x^2}$$

This matches our first-principles common-denominator derivation in Chapter 4!

---

## 5.4 Strategic Algebraic Preparation: Rewriting Before Differentiating

In differential calculus, students often make errors not in calculus, but in pre-calculus algebra. Many expressions that appear complicated can be converted into standard power form $k x^n$ prior to applying any derivative rule:

| Expression | Algebraic Rewrite ($k x^n$) | Power Rule Derivative | Simplified Form |
| :--- | :--- | :--- | :--- |
| $f(x) = \frac{1}{x^5}$ | $x^{-5}$ | $-5 x^{-5-1} = -5 x^{-6}$ | $-\frac{5}{x^6}$ |
| $f(x) = \sqrt[3]{x}$ | $x^{1/3}$ | $\frac{1}{3} x^{\frac{1}{3} - 1} = \frac{1}{3} x^{-2/3}$ | $\frac{1}{3\sqrt[3]{x^2}}$ |
| $f(x) = \frac{4}{\sqrt{x}}$ | $4 x^{-1/2}$ | $4 \left(-\frac{1}{2}\right) x^{-\frac{1}{2} - 1} = -2 x^{-3/2}$ | $-\frac{2}{x\sqrt{x}}$ |
| $f(x) = \frac{6x^3 - 4x}{x}$ | $6x^2 - 4$ | $6(2x) - 0 = 12x$ | $12x$ |
| $f(x) = (2x - 3)^2$ | $4x^2 - 12x + 9$ | $4(2x) - 12(1) + 0 = 8x - 12$ | $8x - 12$ |

> [!TIP]
> **Golden Rule of Polynomial Calculus:** Whenever possible, expand products and divide through by monomial denominators **before** applying derivative rules. Transforming an algebraic quotient into a sum of simple powers turns a complicated quotient calculation into basic power-rule operations.

---

## 5.5 Higher-Order Derivatives and Nilpotence

Because the derivative of a function $f(x)$ is itself a function $f'(x)$, we can differentiate it again!

- **First Derivative:** $f'(x) = \frac{dy}{dx}$ (Rate of change of $y$)
- **Second Derivative:** $f''(x) = \frac{d^2y}{dx^2} = \frac{d}{dx}\left[\frac{dy}{dx}\right]$ (Rate of change of the rate of change; acceleration, concavity)
- **Third Derivative:** $f'''(x) = \frac{d^3y}{dx^3} = \frac{d}{dx}\left[\frac{d^2y}{dx^2}\right]$ (Jerk)
- **$n$-th Derivative:** $f^{(n)}(x) = \frac{d^ny}{dx^n}$

### The Nilpotent Property of Polynomials
Notice what happens to the power of $x$ at each differentiation step: it decreases by $1$.
For a degree-$n$ polynomial:

$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0$$

- $P'(x)$ has degree $n - 1$.
- $P''(x)$ has degree $n - 2$.
- The $n$-th derivative $P^{(n)}(x)$ is a constant: $P^{(n)}(x) = n! \cdot a_n$.
- The $(n+1)$-th derivative and all subsequent derivatives are **identically zero**:

$$\frac{d^{n+1}}{dx^{n+1}}[P(x)] \equiv 0$$

In algebra, an operator that drives elements to zero after repeated applications is called **nilpotent**. The differentiation operator is nilpotent on the vector space of polynomials!

---

## 5.6 Ten Progressive Worked Numerical Examples

### Example 5.1: Differentiating an 8th-Degree Polynomial
**Problem:** Differentiate $f(x) = \frac{1}{8}x^8 - \frac{2}{5}x^5 + 4x^3 - 7x + 19$.

**Step 1:** Apply linearity: differentiate term by term.
$$f'(x) = \frac{d}{dx}\left[\frac{1}{8}x^8\right] - \frac{d}{dx}\left[\frac{2}{5}x^5\right] + \frac{d}{dx}[4x^3] - \frac{d}{dx}[7x] + \frac{d}{dx}[19]$$

**Step 2:** Apply the Constant Multiple and Power Rules:
- $\frac{d}{dx}\left[\frac{1}{8}x^8\right] = \frac{1}{8} \cdot (8x^7) = x^7$
- $\frac{d}{dx}\left[\frac{2}{5}x^5\right] = \frac{2}{5} \cdot (5x^4) = 2x^4$
- $\frac{d}{dx}[4x^3] = 4 \cdot (3x^2) = 12x^2$
- $\frac{d}{dx}[7x] = 7 \cdot (1x^0) = 7(1) = 7$
- $\frac{d}{dx}[19] = 0$

**Step 3:** Assemble the derivative:
$$f'(x) = x^7 - 2x^4 + 12x^2 - 7$$

---

### Example 5.2: Rewriting and Differentiating Fractional and Radical Powers
**Problem:** Differentiate $g(x) = 6\sqrt[3]{x^2} - \frac{5}{\sqrt{x}} + 2x^{-4}$.

**Step 1:** Rewrite each term as a standard power $k x^n$:
- $6\sqrt[3]{x^2} = 6(x^{2/3}) = 6x^{2/3}$
- $\frac{5}{\sqrt{x}} = \frac{5}{x^{1/2}} = 5x^{-1/2}$
- $2x^{-4} = 2x^{-4}$

$$g(x) = 6x^{2/3} - 5x^{-1/2} + 2x^{-4}$$

**Step 2:** Differentiate each term using $\frac{d}{dx}[x^n] = n x^{n-1}$:
- $\frac{d}{dx}[6x^{2/3}] = 6 \cdot \left(\frac{2}{3}\right) x^{\frac{2}{3} - 1} = 4 x^{-1/3} = \frac{4}{\sqrt[3]{x}}$
- $\frac{d}{dx}[-5x^{-1/2}] = -5 \cdot \left(-\frac{1}{2}\right) x^{-\frac{1}{2} - 1} = \frac{5}{2} x^{-3/2} = \frac{5}{2x^{3/2}} = \frac{5}{2x\sqrt{x}}$
- $\frac{d}{dx}[2x^{-4}] = 2 \cdot (-4) x^{-4 - 1} = -8 x^{-5} = -\frac{8}{x^5}$

**Step 3:** Recombine into standard radical/fractional form:
$$g'(x) = \frac{4}{\sqrt[3]{x}} + \frac{5}{2x\sqrt{x}} - \frac{8}{x^5}$$

---

### Example 5.3: Splitting a Multi-Term Quotient
**Problem:** Differentiate $y = \frac{4x^5 - 9x^3 + 2x^2 - 7}{x^2}$ for $x \neq 0$.

**Step 1:** Divide each term in the numerator by the monomial denominator $x^2$:
$$y = \frac{4x^5}{x^2} - \frac{9x^3}{x^2} + \frac{2x^2}{x^2} - \frac{7}{x^2} = 4x^3 - 9x + 2 - 7x^{-2}$$

**Step 2:** Differentiate term by term using power rules:
$$\frac{dy}{dx} = 4(3x^2) - 9(1) + 0 - 7(-2x^{-3})$$
$$\frac{dy}{dx} = 12x^2 - 9 + 14x^{-3} = 12x^2 - 9 + \frac{14}{x^3}$$

---

### Example 5.4: Successive Derivatives of a Quintic Polynomial
**Problem:** For $f(x) = 2x^5 - 5x^4 + 3x^2 - 11$, compute all derivatives from the 1st through the 6th.

- **1st Derivative:** $f'(x) = 2(5x^4) - 5(4x^3) + 3(2x) - 0 = 10x^4 - 20x^3 + 6x$
- **2nd Derivative:** $f''(x) = 10(4x^3) - 20(3x^2) + 6(1) = 40x^3 - 60x^2 + 6$
- **3rd Derivative:** $f'''(x) = 40(3x^2) - 60(2x) + 0 = 120x^2 - 120x$
- **4th Derivative:** $f^{(4)}(x) = 120(2x) - 120(1) = 240x - 120$
- **5th Derivative:** $f^{(5)}(x) = 240(1) - 0 = 240 = 5! \cdot 2 = 120 \cdot 2$
- **6th Derivative:** $f^{(6)}(x) = \frac{d}{dx}[240] = 0$

All derivatives of order $n \ge 6$ are identically zero.

---

### Example 5.5: Finding Points with Specified Tangent Slope
**Problem:** Find all points on the cubic curve $y = x^3 - 9x^2 + 15x - 4$ where the tangent line has a slope of $m = -12$.

**Step 1:** Compute the slope function $\frac{dy}{dx}$:
$$\frac{dy}{dx} = 3x^2 - 18x + 15$$

**Step 2:** Set $\frac{dy}{dx} = -12$:
$$3x^2 - 18x + 15 = -12$$
$$3x^2 - 18x + 27 = 0$$

**Step 3:** Divide through by $3$:
$$x^2 - 6x + 9 = 0$$

**Step 4:** Factor the perfect square:
$$(x - 3)^2 = 0 \implies x = 3$$

**Step 5:** Determine the corresponding $y$-coordinate on the curve:
$$y(3) = 3^3 - 9(3)^2 + 15(3) - 4 = 27 - 9(9) + 45 - 4 = 27 - 81 + 45 - 4 = -13$$

**Conclusion:** The tangent line has slope $-12$ at exactly one point: $(3, -13)$.

---

### Example 5.6: Tangent Line Parallel to a Target Line
**Problem:** Find the equation of the tangent line to $f(x) = 2x^3 - 4x + 1$ that is parallel to the line $y = 20x - 7$.

**Step 1:** Identify the required slope:
The target line $y = 20x - 7$ has slope $m = 20$. Parallel lines have equal slopes, so we require $f'(x) = 20$.

**Step 2:** Differentiate $f(x)$:
$$f'(x) = 6x^2 - 4$$

**Step 3:** Solve for $x$:
$$6x^2 - 4 = 20 \implies 6x^2 = 24 \implies x^2 = 4 \implies x = \pm 2$$

There are two distinct contact points!

**Step 4:** Case A: $x_1 = 2$:
$$y_1 = f(2) = 2(2)^3 - 4(2) + 1 = 2(8) - 8 + 1 = 16 - 8 + 1 = 9 \implies P_1(2, 9)$$
Tangent line at $P_1$:
$$y - 9 = 20(x - 2) \implies y = 20x - 40 + 9 \implies y = 20x - 31$$

**Step 5:** Case B: $x_2 = -2$:
$$y_2 = f(-2) = 2(-2)^3 - 4(-2) + 1 = 2(-8) + 8 + 1 = -16 + 8 + 1 = -7 \implies P_2(-2, -7)$$
Tangent line at $P_2$:
$$y - (-7) = 20(x - (-2)) \implies y + 7 = 20x + 40 \implies y = 20x + 33$$

**Conclusion:** Two parallel tangent lines exist: $y = 20x - 31$ and $y = 20x + 33$.

---

### Example 5.7: Structural Engineering Beam Deflection
**Problem:** In civil engineering, the deflection curve of a cantilever beam of length $L = 6\text{ m}$ carrying a uniform distributed load is:
$$w(x) = \frac{w_0}{24EI}\left(x^4 - 4Lx^3 + 6L^2x^2\right)$$
where $E, I, w_0$ are structural constants. Find the expression for the shear force, which is proportional to the third derivative: $V(x) = -EI \frac{d^3w}{dx^3}$.

**Step 1:** Let $C = \frac{w_0}{24EI}$.
$$w(x) = C(x^4 - 24x^3 + 216x^2) \quad (\text{using } L = 6)$$

**Step 2:** First derivative (slope of deflection):
$$\frac{dw}{dx} = C(4x^3 - 72x^2 + 432x)$$

**Step 3:** Second derivative (bending moment curvature):
$$\frac{d^2w}{dx^2} = C(12x^2 - 144x + 432)$$

**Step 4:** Third derivative:
$$\frac{d^3w}{dx^3} = C(24x - 144) = \frac{w_0}{24EI}(24x - 144) = \frac{w_0}{EI}(x - 6)$$

**Step 5:** Calculate the shear force $V(x)$:
$$V(x) = -EI \frac{d^3w}{dx^3} = -EI \left[\frac{w_0}{EI}(x - 6)\right] = -w_0(x - 6) = w_0(6 - x)$$

**Conclusion:** At the built-in support ($x = 0$), shear force is maximum: $V(0) = 6w_0$. At the free tip ($x = 6$), shear force drops to zero: $V(6) = 0$.

---

### Example 5.8: Evaluating Fractional Derivatives at a Specified Coordinate
**Problem:** For $f(x) = 32x^{-1/2} + 3x^{5/4}$, calculate the exact numerical value of $f'(16)$.

**Step 1:** Differentiate each term using the power rule:
$$f'(x) = 32\left(-\frac{1}{2}\right)x^{-\frac{1}{2} - 1} + 3\left(\frac{5}{4}\right)x^{\frac{5}{4} - 1}$$
$$f'(x) = -16 x^{-3/2} + \frac{15}{4} x^{1/4}$$

**Step 2:** Substitute $x = 16$:
$$16^{1/4} = \sqrt[4]{16} = 2$$
$$16^{-3/2} = \frac{1}{(16^{1/2})^3} = \frac{1}{4^3} = \frac{1}{64}$$

**Step 3:** Calculate numerical terms:
$$-16 x^{-3/2} = -16 \cdot \frac{1}{64} = -\frac{16}{64} = -\frac{1}{4} = -0.25$$
$$\frac{15}{4} x^{1/4} = \frac{15}{4} \cdot 2 = \frac{30}{4} = \frac{15}{2} = 7.5$$

**Step 4:** Add the values:
$$f'(16) = -0.25 + 7.50 = 7.25 = \frac{29}{4}$$

**Conclusion:** $f'(16) = \frac{29}{4} = 7.25$.

---

### Example 5.9: Physics Simulator Kinematics Hierarchy
**Problem:** In a 2D physics engine, a projectile follows horizontal position $x(t) = \frac{1}{6}t^4 - t^3 + 3t^2 + 8$ meters. Compute position, velocity, and acceleration at $t = 3$ seconds.

**Step 1:** Position at $t = 3$:
$$x(3) = \frac{1}{6}(3^4) - (3^3) + 3(3^2) + 8 = \frac{81}{6} - 27 + 27 + 8 = 13.5 + 8 = 21.5\text{ m}$$

**Step 2:** Velocity $v(t) = x'(t)$:
$$v(t) = \frac{d}{dt}\left[\frac{1}{6}t^4 - t^3 + 3t^2 + 8\right] = \frac{4}{6}t^3 - 3t^2 + 6t = \frac{2}{3}t^3 - 3t^2 + 6t$$
Evaluate at $t = 3$:
$$v(3) = \frac{2}{3}(27) - 3(9) + 6(3) = 18 - 27 + 18 = 9\text{ m/s}$$

**Step 3:** Acceleration $a(t) = v'(t) = x''(t)$:
$$a(t) = \frac{d}{dt}\left[\frac{2}{3}t^3 - 3t^2 + 6t\right] = \frac{2}{3}(3t^2) - 3(2t) + 6 = 2t^2 - 6t + 6$$
Evaluate at $t = 3$:
$$a(3) = 2(3^2) - 6(3) + 6 = 2(9) - 18 + 6 = 18 - 18 + 6 = 6\text{ m/s}^2$$

**Conclusion:** At $t = 3\text{ s}$: position is $21.5\text{ m}$, velocity is $9\text{ m/s}$, acceleration is $6\text{ m/s}^2$.

---

### Example 5.10: Formulating the General $n$-th Derivative Formula
**Problem:** For the reciprocal function $f(x) = x^{-1}$, compute the first four derivatives, discover the pattern, and state the closed-form equation for the $n$-th derivative $f^{(n)}(x)$.

**Step 1:** Calculate first few derivatives:
- $f^{(1)}(x) = -1 x^{-2} = \frac{-1}{x^2}$
- $f^{(2)}(x) = (-1)(-2) x^{-3} = +2 x^{-3} = \frac{2}{x^3}$
- $f^{(3)}(x) = (2)(-3) x^{-4} = -6 x^{-4} = \frac{-6}{x^4}$
- $f^{(4)}(x) = (-6)(-4) x^{-5} = +24 x^{-5} = \frac{24}{x^5}$

**Step 2:** Identify structural patterns:
1. **Signs:** Alternating: $-, +, -, + \dots$ represented by $(-1)^n$.
2. **Coefficients:** $1, 2, 6, 24 \dots$ which are the factorials: $1!, 2!, 3!, 4! \dots = n!$.
3. **Powers of $x$:** $x^{-(n+1)} = \frac{1}{x^{n+1}}$.

**Step 3:** Synthesize the formula:
$$f^{(n)}(x) = (-1)^n \frac{n!}{x^{n+1}}$$

**Step 4:** Verify for $n = 3$:
$$f^{(3)}(x) = (-1)^3 \frac{3!}{x^{3+1}} = -1 \cdot \frac{6}{x^4} = -\frac{6}{x^4}$$
It matches step 1 identically.

---

## 5.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Polynomial Direct Power Rule Applications
- **Exercise 5.1:** Differentiate $f(x) = 4x^6 - 7x^4 + 9x^2 - 13x + 42$.
- **Exercise 5.2:** Differentiate $g(t) = \frac{1}{5}t^5 - \frac{4}{3}t^3 + 8t - \pi^2$.

### Tier 2: Radicals and Negative Exponents
- **Exercise 5.3:** Differentiate $y = 8\sqrt{x} - \frac{6}{\sqrt[3]{x}}$.
- **Exercise 5.4:** Differentiate $f(u) = 3u^{-3} - 5u^{-1} + 12$.

### Tier 3: Pre-Algebra Expansion & Monomial Division
- **Exercise 5.5:** Differentiate $h(x) = (3x - 2)(2x^2 + 5x - 1)$ by expanding before differentiating.
- **Exercise 5.6:** Differentiate $R(z) = \frac{9z^4 - 6z^3 + 4z}{2z^2}$ by splitting terms.

### Tier 4: Geometric Tangents & Intersections
- **Exercise 5.7:** Find the coordinates of all points on the curve $y = \frac{1}{3}x^3 - 4x + 5$ where the tangent line is horizontal.
- **Exercise 5.8:** Find the equation of the line normal to $y = 3x^2 - 8x + 2$ at the point $x = 1$.

### Tier 5: Physics Modeling & Higher-Order Analysis
- **Exercise 5.9:** A drone ascender has height $h(t) = -t^4 + 8t^3 - 18t^2 + 50$ meters. Find its jerk $j(t) = h'''(t)$ at $t = 2$ seconds.
- **Exercise 5.10:** Prove that for $f(x) = x^{-2} = \frac{1}{x^2}$, the $n$-th derivative is $f^{(n)}(x) = (-1)^n \frac{(n+1)!}{x^{n+2}}$.

---

## 5.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 5.1
Differentiate $f(x) = 4x^6 - 7x^4 + 9x^2 - 13x + 42$.
Apply the power rule to each term:
- $\frac{d}{dx}[4x^6] = 4(6x^5) = 24x^5$
- $\frac{d}{dx}[-7x^4] = -7(4x^3) = -28x^3$
- $\frac{d}{dx}[9x^2] = 9(2x) = 18x$
- $\frac{d}{dx}[-13x] = -13(1) = -13$
- $\frac{d}{dx}[42] = 0$
$$f'(x) = 24x^5 - 28x^3 + 18x - 13$$
**Final Answer:** $f'(x) = 24x^5 - 28x^3 + 18x - 13$.

---

### Solution to Exercise 5.2
Differentiate $g(t) = \frac{1}{5}t^5 - \frac{4}{3}t^3 + 8t - \pi^2$.
Note that $\pi^2$ is a constant, so its derivative is $0$:
- $\frac{d}{dt}\left[\frac{1}{5}t^5\right] = \frac{1}{5}(5t^4) = t^4$
- $\frac{d}{dt}\left[-\frac{4}{3}t^3\right] = -\frac{4}{3}(3t^2) = -4t^2$
- $\frac{d}{dt}[8t] = 8$
- $\frac{d}{dt}[-\pi^2] = 0$
$$g'(t) = t^4 - 4t^2 + 8$$
**Final Answer:** $g'(t) = t^4 - 4t^2 + 8$.

---

### Solution to Exercise 5.3
Differentiate $y = 8\sqrt{x} - \frac{6}{\sqrt[3]{x}}$.
1. Rewrite in power form:
$$y = 8x^{1/2} - 6x^{-1/3}$$
2. Differentiate:
$$\frac{dy}{dx} = 8\left(\frac{1}{2}\right)x^{\frac{1}{2} - 1} - 6\left(-\frac{1}{3}\right)x^{-\frac{1}{3} - 1}$$
$$\frac{dy}{dx} = 4x^{-1/2} + 2x^{-4/3} = \frac{4}{\sqrt{x}} + \frac{2}{\sqrt[3]{x^4}} = \frac{4}{\sqrt{x}} + \frac{2}{x\sqrt[3]{x}}$$
**Final Answer:** $\frac{dy}{dx} = \frac{4}{\sqrt{x}} + \frac{2}{x\sqrt[3]{x}}$.

---

### Solution to Exercise 5.4
Differentiate $f(u) = 3u^{-3} - 5u^{-1} + 12$.
1. Apply the power rule:
$$f'(u) = 3(-3u^{-4}) - 5(-1u^{-2}) + 0$$
$$f'(u) = -9u^{-4} + 5u^{-2} = -\frac{9}{u^4} + \frac{5}{u^2}$$
**Final Answer:** $f'(u) = -\frac{9}{u^4} + \frac{5}{u^2}$.

---

### Solution to Exercise 5.5
Differentiate $h(x) = (3x - 2)(2x^2 + 5x - 1)$ by expanding first.
1. Expand the product:
$$h(x) = 3x(2x^2 + 5x - 1) - 2(2x^2 + 5x - 1)$$
$$h(x) = (6x^3 + 15x^2 - 3x) - (4x^2 + 10x - 2)$$
$$h(x) = 6x^3 + 11x^2 - 13x + 2$$
2. Differentiate term by term:
$$h'(x) = 6(3x^2) + 11(2x) - 13(1) + 0 = 18x^2 + 22x - 13$$
**Final Answer:** $h'(x) = 18x^2 + 22x - 13$.

---

### Solution to Exercise 5.6
Differentiate $R(z) = \frac{9z^4 - 6z^3 + 4z}{2z^2}$.
1. Divide through by the denominator $2z^2$:
$$R(z) = \frac{9z^4}{2z^2} - \frac{6z^3}{2z^2} + \frac{4z}{2z^2} = \frac{9}{2}z^2 - 3z + 2z^{-1}$$
2. Differentiate:
$$R'(z) = \frac{9}{2}(2z) - 3(1) + 2(-1z^{-2}) = 9z - 3 - \frac{2}{z^2}$$
**Final Answer:** $R'(z) = 9z - 3 - \frac{2}{z^2}$.

---

### Solution to Exercise 5.7
Find points on $y = \frac{1}{3}x^3 - 4x + 5$ where the tangent is horizontal ($m = 0$).
1. Compute $\frac{dy}{dx}$:
$$\frac{dy}{dx} = \frac{1}{3}(3x^2) - 4 = x^2 - 4$$
2. Set $\frac{dy}{dx} = 0$:
$$x^2 - 4 = 0 \implies x^2 = 4 \implies x = \pm 2$$
3. Find $y$-coordinates:
- At $x = 2$: $y(2) = \frac{1}{3}(8) - 4(2) + 5 = \frac{8}{3} - 8 + 5 = \frac{8}{3} - 3 = -\frac{1}{3}$.
- At $x = -2$: $y(-2) = \frac{1}{3}(-8) - 4(-2) + 5 = -\frac{8}{3} + 8 + 5 = -\frac{8}{3} + 13 = \frac{31}{3}$.
**Final Answer:** $(2, -\frac{1}{3})$ and $(-2, \frac{31}{3})$.

---

### Solution to Exercise 5.8
Find the normal line to $y = 3x^2 - 8x + 2$ at $x = 1$.
1. Contact point: $y(1) = 3(1)^2 - 8(1) + 2 = 3 - 8 + 2 = -3 \implies P(1, -3)$.
2. Tangent slope: $\frac{dy}{dx} = 6x - 8 \implies m_{\text{tan}} = 6(1) - 8 = -2$.
3. Normal slope: $m_{\text{norm}} = -\frac{1}{m_{\text{tan}}} = -\frac{1}{-2} = \frac{1}{2}$.
4. Normal line equation:
$$y - (-3) = \frac{1}{2}(x - 1) \implies y + 3 = \frac{1}{2}x - \frac{1}{2} \implies y = \frac{1}{2}x - \frac{7}{2}$$
Or in standard form: $x - 2y - 7 = 0$.
**Final Answer:** $y = \frac{1}{2}x - \frac{7}{2}$.

---

### Solution to Exercise 5.9
Find the jerk $j(2)$ for $h(t) = -t^4 + 8t^3 - 18t^2 + 50$.
1. Velocity $v(t) = h'(t) = -4t^3 + 24t^2 - 36t$.
2. Acceleration $a(t) = h''(t) = -12t^2 + 48t - 36$.
3. Jerk $j(t) = h'''(t) = -24t + 48$.
4. Evaluate at $t = 2$:
$$j(2) = -24(2) + 48 = -48 + 48 = 0\text{ m/s}^3$$
**Final Answer:** $0\text{ m/s}^3$.

---

### Solution to Exercise 5.10
Prove that for $f(x) = x^{-2}$, $f^{(n)}(x) = (-1)^n \frac{(n+1)!}{x^{n+2}}$.
1. Check base case $n = 1$:
$$f'(x) = -2 x^{-3} = (-1)^1 \frac{2!}{x^{1+2}} = -\frac{2}{x^3}$$
Formula holds for $n = 1$.
2. Compute second derivative ($n = 2$):
$$f''(x) = \frac{d}{dx}[-2x^{-3}] = (-2)(-3)x^{-4} = 6x^{-4} = (-1)^2 \frac{3!}{x^{2+2}} = \frac{6}{x^4}$$
Formula holds for $n = 2$.
3. General step from $k$ to $k+1$:
Assume $f^{(k)}(x) = (-1)^k (k+1)! x^{-(k+2)}$.
Differentiating:
$$f^{(k+1)}(x) = \frac{d}{dx}\left[(-1)^k (k+1)! x^{-(k+2)}\right] = (-1)^k (k+1)! \cdot [-(k+2)] x^{-(k+3)}$$
Notice that $[-(k+2)] = (-1) \cdot (k+2)$:
$$= (-1)^{k+1} \cdot [(k+1)! \cdot (k+2)] \cdot x^{-(k+3)} = (-1)^{k+1} (k+2)! x^{-(k+3)} = (-1)^{k+1} \frac{(k+2)!}{x^{k+3}}$$
By mathematical induction, the formula holds for all integers $n \ge 1$. $\blacksquare$
