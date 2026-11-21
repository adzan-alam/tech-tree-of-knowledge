# Chapter 4: The Formal Definition of the Derivative — First Principles, Tangents, and Notation

> *"The derivative is not an isolated number or an arbitrary algebraic trick. It is a new engine of knowledge: an operator that accepts a function describing the state of the world and outputs a new function describing its rate of change at every conceivable moment."*

---

## 4.1 The Core Definition: From Difference Quotient to Derivative

In Chapters 1 through 3, we traced how average rates of change over finite intervals collapse into instantaneous rates of change through the machinery of limits. Now, we elevate this discovery into the foundational pillar of differential calculus: the **formal definition of the derivative**.

Let $f$ be a real-valued function defined on an open interval containing the point $x$. The **derivative of $f$ at $x$**, denoted by $f'(x)$, is defined by the limit:

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

provided this limit exists.

If the limit exists, we say that $f$ is **differentiable** at $x$. The process of computing this limit is called **differentiation**.

### The Alternative Point-Formulation
An equivalent definition focuses on a fixed anchor coordinate $a$ and a variable coordinate $x$:

$$f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a}$$

Notice the exact equivalence: if we define the displacement step $h = x - a$, then $x = a + h$. As $x \to a$, the difference $h \to 0$, converting $\frac{f(x) - f(a)}{x - a}$ directly into $\frac{f(a + h) - f(a)}{h}$. Both formulations are mathematically identical; the $h$-notation is universally favored when deriving general formulas for all $x$, while the $(x - a)$ formulation is exceptionally lucid when proving theoretical theorems about behavior at a specific target point.

---

## 4.2 First-Principles Derivations of Canonical Functions

Before developing shortcut rules in subsequent chapters, a student of mathematics must construct the derivatives of fundamental functions directly from first principles.

### 1. The Constant Function: $f(x) = c$
A constant function never changes. If $f(x) = c$ for all $x$:

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} = \lim_{h \to 0} \frac{c - c}{h} = \lim_{h \to 0} \frac{0}{h}$$

Because $h \neq 0$ inside the limit, $\frac{0}{h}$ is strictly $0$ before any limit is even evaluated:

$$f'(x) = \lim_{h \to 0} 0 = 0$$

*Geometric reality:* A horizontal line has an inclination of zero at every point.

### 2. The Linear Function: $f(x) = mx + b$
For any straight line:

$$f(x+h) = m(x+h) + b = mx + mh + b$$
$$f(x+h) - f(x) = (mx + mh + b) - (mx + b) = mh$$
$$f'(x) = \lim_{h \to 0} \frac{mh}{h} = \lim_{h \to 0} m = m$$

*Geometric reality:* The rate of change of a linear graph is its constant slope $m$.

### 3. The Parabolic Function: $f(x) = x^2$
For a squaring operation:

$$f(x+h) = (x+h)^2 = x^2 + 2xh + h^2$$
$$f(x+h) - f(x) = (x^2 + 2xh + h^2) - x^2 = 2xh + h^2 = h(2x + h)$$
$$\frac{f(x+h) - f(x)}{h} = \frac{h(2x + h)}{h} = 2x + h \quad (\text{for } h \neq 0)$$
$$f'(x) = \lim_{h \to 0} (2x + h) = 2x + 0 = 2x$$

*Geometric reality:* At $x = 1$, the slope is $2(1) = 2$. At $x = 0$ (the vertex), the slope is $0$. At $x = -3$, the slope is $-6$. The slope changes smoothly and linearly with $x$.

### 4. The Cubic Function: $f(x) = x^3$
Using the binomial expansion $(x+h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$:

$$f(x+h) - f(x) = (x^3 + 3x^2h + 3xh^2 + h^3) - x^3 = 3x^2h + 3xh^2 + h^3 = h(3x^2 + 3xh + h^2)$$
$$\frac{f(x+h) - f(x)}{h} = 3x^2 + 3xh + h^2$$
$$f'(x) = \lim_{h \to 0} (3x^2 + 3xh + h^2) = 3x^2 + 0 + 0 = 3x^2$$

### 5. The Square Root Function: $f(x) = \sqrt{x}$ (for $x > 0$)
Using algebraic conjugate multiplication:

$$\frac{f(x+h) - f(x)}{h} = \frac{\sqrt{x+h} - \sqrt{x}}{h} \cdot \frac{\sqrt{x+h} + \sqrt{x}}{\sqrt{x+h} + \sqrt{x}}$$
$$= \frac{(x+h) - x}{h(\sqrt{x+h} + \sqrt{x})} = \frac{h}{h(\sqrt{x+h} + \sqrt{x})} = \frac{1}{\sqrt{x+h} + \sqrt{x}}$$
$$f'(x) = \lim_{h \to 0} \frac{1}{\sqrt{x+h} + \sqrt{x}} = \frac{1}{\sqrt{x} + \sqrt{x}} = \frac{1}{2\sqrt{x}}$$

### 6. The Reciprocal Function: $f(x) = \frac{1}{x}$ (for $x \neq 0$)
Using common denominators:

$$f(x+h) - f(x) = \frac{1}{x+h} - \frac{1}{x} = \frac{x - (x+h)}{x(x+h)} = \frac{-h}{x(x+h)}$$
$$\frac{f(x+h) - f(x)}{h} = \frac{-h}{h \cdot x(x+h)} = \frac{-1}{x(x+h)}$$
$$f'(x) = \lim_{h \to 0} \frac{-1}{x(x+h)} = \frac{-1}{x^2}$$

---

## 4.3 The Great Mathematical Notations

Calculus was independently discovered by Sir Isaac Newton and Gottfried Wilhelm Leibniz in the late 17th century, and subsequently refined by Joseph-Louis Lagrange and Leonhard Euler. Each master introduced a notation emphasizing a unique perspective:

| Notation | Creator | Syntax | Primary Strength & Domain |
| :--- | :--- | :--- | :--- |
| **Leibniz** | Gottfried Wilhelm Leibniz | $\frac{df}{dx}, \frac{dy}{dx}$ | Expresses derivative as an infinitesimal ratio. Dimensional analysis is trivial (units of $y$ over units of $x$). Makes chain rule algebraic: $\frac{dy}{dt} = \frac{dy}{dx}\frac{dx}{dt}$. |
| **Lagrange** | Joseph-Louis Lagrange | $f'(x), f''(x), f^{(n)}(x)$ | Pure functional representation. Clean, concise, emphasizes that the derivative is itself a function of $x$. |
| **Newton** | Sir Isaac Newton | $\dot{x}, \ddot{x}$ | Time derivatives in classical mechanics, orbital mechanics, physics simulations ($\dot{x} = v$, $\ddot{x} = a$). |
| **Euler** | Leonhard Euler | $D f, D_x f$ | Operational calculus and linear differential operators in advanced analysis and differential equations. |

In this treatise and in physics simulation code, we move fluently between Leibniz notation (when tracking physical units and coordinate transforms) and Lagrange notation (when evaluating algebraic functions at specific numerical coordinates).

---

## 4.4 Differentiability Implies Continuity

A critical theorem establishes the relationship between smoothness and unbroken connectivity:

> **Theorem:** If a function $f$ is differentiable at a point $x = c$, then $f$ is continuous at $x = c$.

### Direct Proof
Recall the definition of continuity: $f$ is continuous at $c$ if and only if $\lim_{x \to c} f(x) = f(c)$, which is equivalent to stating:

$$\lim_{x \to c} [f(x) - f(c)] = 0$$

Let us rewrite the difference $f(x) - f(c)$ by multiplying and dividing by the non-zero quantity $(x - c)$ for all $x \neq c$:

$$f(x) - f(c) = \frac{f(x) - f(c)}{x - c} \cdot (x - c)$$

Now take the limit as $x \to c$ on both sides and apply the limit product rule:

$$\lim_{x \to c} [f(x) - f(c)] = \lim_{x \to c} \left[ \frac{f(x) - f(c)}{x - c} \cdot (x - c) \right] = \left( \lim_{x \to c} \frac{f(x) - f(c)}{x - c} \right) \cdot \left( \lim_{x \to c} (x - c) \right)$$

Because $f$ is differentiable at $c$, the first limit exists and equals the finite real number $f'(c)$. The second limit evaluates to $(c - c) = 0$:

$$\lim_{x \to c} [f(x) - f(c)] = f'(c) \cdot 0 = 0$$

Therefore:

$$\lim_{x \to c} f(x) = f(c)$$

This confirms that $f$ is continuous at $c$. $\blacksquare$

### The Crucial Counterexample: Continuity Does NOT Imply Differentiability
While differentiability guarantees continuity, **the reverse is false**. A function can be continuous everywhere without being differentiable.

Consider the absolute value function $f(x) = |x|$ at the origin $c = 0$:
1. $f(0) = |0| = 0$.
2. $\lim_{x \to 0} |x| = 0 = f(0)$. Thus, $f(x)$ is continuous at $x = 0$.
3. Now test differentiability using the difference quotient limit:

$$\frac{f(0 + h) - f(0)}{h} = \frac{|h| - 0}{h} = \frac{|h|}{h}$$

- Approaching from the right ($h \to 0^+$): $h > 0 \implies |h| = h \implies \frac{h}{h} = +1$.
- Approaching from the left ($h \to 0^-$): $h < 0 \implies |h| = -h \implies \frac{-h}{h} = -1$.

Because the left-hand limit ($-1$) does not match the right-hand limit ($+1$), the two-sided limit **does not exist**. The curve possesses a sharp corner or "kink" at $x = 0$. A tangent line cannot settle on a single inclination.

```
       y ^            /
         |           /
         |          /  f(x) = |x|
         |  \      /
         |   \    /
         |    \  /
         +-----*-----> x
             (0,0)  Corner: DNE!
```

### Three Modes of Differentiability Failure
1. **Sharp Corners and Cusps:** Left-hand and right-hand slopes approach different finite numbers (e.g., $f(x) = |x|$).
2. **Vertical Tangents:** The slope grows without bound toward $+\infty$ or $-\infty$ (e.g., $f(x) = x^{1/3}$ at $x = 0$).
3. **Discontinuities:** Any break, jump, or vertical asymptote automatically destroys differentiability.

---

## 4.5 Tangent and Normal Lines to a Curve

At any point $P(x_0, y_0)$ on a differentiable curve $y = f(x)$, where $y_0 = f(x_0)$:

### 1. The Tangent Line
The tangent line passes through $(x_0, y_0)$ with slope $m_{\text{tan}} = f'(x_0)$:

$$y - y_0 = f'(x_0)(x - x_0)$$

### 2. The Normal Line
The **normal line** is perpendicular to the tangent line at the point of contact. In Cartesian geometry, two non-vertical lines are perpendicular if and only if their slopes are negative reciprocals:

$$m_{\text{norm}} \cdot m_{\text{tan}} = -1 \implies m_{\text{norm}} = -\frac{1}{f'(x_0)} \quad (\text{provided } f'(x_0) \neq 0)$$

The equation of the normal line is:

$$y - y_0 = -\frac{1}{f'(x_0)}(x - x_0)$$

In physics simulations (such as collision response against curved surfaces, optical reflection, or ray marching), computing the surface normal vector and normal line equation is fundamental to resolving elastic rebound forces.

---

## 4.6 Ten Progressive Worked Numerical Examples

### Example 4.1: First-Principles Polynomial Derivative
**Problem:** Given $f(x) = 5x^2 - 3x + 8$, compute the derivative function $f'(x)$ using the formal limit definition.

**Step 1:** Write the limit definition:
$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

**Step 2:** Expand $f(x+h)$:
$$f(x+h) = 5(x+h)^2 - 3(x+h) + 8 = 5(x^2 + 2xh + h^2) - 3x - 3h + 8$$
$$f(x+h) = 5x^2 + 10xh + 5h^2 - 3x - 3h + 8$$

**Step 3:** Subtract $f(x) = 5x^2 - 3x + 8$:
$$f(x+h) - f(x) = (5x^2 + 10xh + 5h^2 - 3x - 3h + 8) - (5x^2 - 3x + 8)$$
$$= 10xh + 5h^2 - 3h$$

**Step 4:** Factor out the vanishing factor $h$:
$$f(x+h) - f(x) = h(10x + 5h - 3)$$

**Step 5:** Divide by $h$:
$$\frac{f(x+h) - f(x)}{h} = 10x + 5h - 3 \quad (\text{for } h \neq 0)$$

**Step 6:** Evaluate the limit as $h \to 0$:
$$f'(x) = \lim_{h \to 0} (10x + 5h - 3) = 10x + 5(0) - 3 = 10x - 3$$

**Conclusion:** The derivative is $f'(x) = 10x - 3$.

---

### Example 4.2: First-Principles Radical Derivative
**Problem:** Derive the derivative of $f(x) = \sqrt{4x + 1}$ for $x > -1/4$ directly from first principles.

**Step 1:** Construct the difference quotient:
$$\frac{f(x+h) - f(x)}{h} = \frac{\sqrt{4(x+h) + 1} - \sqrt{4x + 1}}{h} = \frac{\sqrt{4x + 4h + 1} - \sqrt{4x + 1}}{h}$$

**Step 2:** Multiply by the conjugate expression:
$$\frac{\sqrt{4x + 4h + 1} - \sqrt{4x + 1}}{h} \cdot \frac{\sqrt{4x + 4h + 1} + \sqrt{4x + 1}}{\sqrt{4x + 4h + 1} + \sqrt{4x + 1}}$$

**Step 3:** Apply the difference of squares $(a - b)(a + b) = a^2 - b^2$:
$$= \frac{(4x + 4h + 1) - (4x + 1)}{h(\sqrt{4x + 4h + 1} + \sqrt{4x + 1})} = \frac{4h}{h(\sqrt{4x + 4h + 1} + \sqrt{4x + 1})}$$

**Step 4:** Cancel $h \neq 0$:
$$= \frac{4}{\sqrt{4x + 4h + 1} + \sqrt{4x + 1}}$$

**Step 5:** Evaluate the limit as $h \to 0$:
$$f'(x) = \lim_{h \to 0} \frac{4}{\sqrt{4x + 4h + 1} + \sqrt{4x + 1}} = \frac{4}{\sqrt{4x + 1} + \sqrt{4x + 1}} = \frac{4}{2\sqrt{4x + 1}} = \frac{2}{\sqrt{4x + 1}}$$

**Conclusion:** $f'(x) = \frac{2}{\sqrt{4x + 1}}$.

---

### Example 4.3: First-Principles Rational Function Derivative
**Problem:** Derive the derivative of $f(x) = \frac{3}{2x - 1}$ for $x \neq 1/2$.

**Step 1:** Form the difference $f(x+h) - f(x)$:
$$f(x+h) - f(x) = \frac{3}{2(x+h) - 1} - \frac{3}{2x - 1} = \frac{3}{2x + 2h - 1} - \frac{3}{2x - 1}$$

**Step 2:** Find a common denominator:
$$= \frac{3(2x - 1) - 3(2x + 2h - 1)}{(2x + 2h - 1)(2x - 1)} = \frac{6x - 3 - (6x + 6h - 3)}{(2x + 2h - 1)(2x - 1)} = \frac{-6h}{(2x + 2h - 1)(2x - 1)}$$

**Step 3:** Divide by $h$:
$$\frac{f(x+h) - f(x)}{h} = \frac{-6h}{h(2x + 2h - 1)(2x - 1)} = \frac{-6}{(2x + 2h - 1)(2x - 1)}$$

**Step 4:** Evaluate the limit as $h \to 0$:
$$f'(x) = \lim_{h \to 0} \frac{-6}{(2x + 2h - 1)(2x - 1)} = \frac{-6}{(2x - 1)(2x - 1)} = \frac{-6}{(2x - 1)^2}$$

**Conclusion:** $f'(x) = -\frac{6}{(2x - 1)^2}$.

---

### Example 4.4: Derivative at a Target Point via Alternative Limit
**Problem:** For $f(x) = x^3 - 4x$, calculate $f'(-2)$ using the point formulation $f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a}$.

**Step 1:** Identify $a = -2$ and calculate $f(a)$:
$$f(-2) = (-2)^3 - 4(-2) = -8 + 8 = 0$$

**Step 2:** Form the difference quotient:
$$\frac{f(x) - f(-2)}{x - (-2)} = \frac{(x^3 - 4x) - 0}{x + 2} = \frac{x(x^2 - 4)}{x + 2}$$

**Step 3:** Factor $x^2 - 4$:
$$\frac{x(x - 2)(x + 2)}{x + 2}$$

**Step 4:** Cancel $(x + 2)$ for $x \neq -2$:
$$= x(x - 2)$$

**Step 5:** Take the limit as $x \to -2$:
$$f'(-2) = \lim_{x \to -2} [x(x - 2)] = (-2)(-2 - 2) = (-2)(-4) = 8$$

**Conclusion:** The instantaneous rate of change at $x = -2$ is $8$.

---

### Example 4.5: Proof of Non-Differentiability at a Sharp Corner
**Problem:** Mathematically prove that $f(x) = |3x - 12|$ is continuous but not differentiable at $x = 4$.

**Step 1:** Test continuity at $x = 4$:
$$f(4) = |3(4) - 12| = |0| = 0$$
$$\lim_{x \to 4} |3x - 12| = |3(4) - 12| = 0 = f(4)$$
The function is continuous at $x = 4$.

**Step 2:** Form the difference quotient at $x = 4$:
$$\frac{f(4 + h) - f(4)}{h} = \frac{|3(4+h) - 12| - 0}{h} = \frac{|12 + 3h - 12|}{h} = \frac{|3h|}{h} = \frac{3|h|}{h}$$

**Step 3:** Evaluate the left-hand limit ($h \to 0^-$):
For $h < 0$, $|h| = -h$:
$$\lim_{h \to 0^-} \frac{3(-h)}{h} = \lim_{h \to 0^-} (-3) = -3$$

**Step 4:** Evaluate the right-hand limit ($h \to 0^+$):
For $h > 0$, $|h| = +h$:
$$\lim_{h \to 0^+} \frac{3(h)}{h} = \lim_{h \to 0^+} (+3) = +3$$

**Step 5:** Conclude:
Because $\lim_{h \to 0^-} \neq \lim_{h \to 0^+}$ ($-3 \neq +3$), the two-sided limit does not exist. $f$ is not differentiable at $x = 4$.

---

### Example 4.6: Investigation of a Vertical Tangent
**Problem:** Investigate the differentiability of $f(x) = x^{1/3}$ at $x = 0$.

**Step 1:** Construct the difference quotient at $x = 0$:
$$\frac{f(0 + h) - f(0)}{h} = \frac{h^{1/3} - 0}{h} = \frac{h^{1/3}}{h^1} = \frac{1}{h^{2/3}}$$

**Step 2:** Take the limit as $h \to 0$:
Notice that $h^{2/3} = (\sqrt[3]{h})^2 \ge 0$ for all real $h \neq 0$.
As $h \to 0$, $h^{2/3}$ is positive and approaches zero.
$$\lim_{h \to 0} \frac{1}{h^{2/3}} = +\infty$$

**Conclusion:** The limit does not yield a finite real number; the slope approaches positive infinity from both sides. The curve has a **vertical tangent** at the origin, meaning $f$ is not differentiable at $x = 0$.

---

### Example 4.7: Tangent and Normal Lines to a Square Root Curve
**Problem:** For $f(x) = \sqrt{x}$, determine the equations of both the tangent line and the normal line at $x_0 = 9$.

**Step 1:** Determine the contact point $(x_0, y_0)$:
$$y_0 = f(9) = \sqrt{9} = 3 \implies P(9, 3)$$

**Step 2:** Compute the derivative at $x_0 = 9$ using $f'(x) = \frac{1}{2\sqrt{x}}$:
$$m_{\text{tan}} = f'(9) = \frac{1}{2\sqrt{9}} = \frac{1}{2(3)} = \frac{1}{6}$$

**Step 3:** Formulate the tangent line equation:
$$y - 3 = \frac{1}{6}(x - 9) \implies y - 3 = \frac{1}{6}x - \frac{9}{6} = \frac{1}{6}x - \frac{3}{2}$$
$$y = \frac{1}{6}x + \frac{3}{2} \quad \text{or} \quad x - 6y + 9 = 0$$

**Step 4:** Formulate the normal line equation:
The normal slope is $m_{\text{norm}} = -\frac{1}{m_{\text{tan}}} = -\frac{1}{1/6} = -6$:
$$y - 3 = -6(x - 9) \implies y - 3 = -6x + 54$$
$$y = -6x + 57 \quad \text{or} \quad 6x + y - 57 = 0$$

---

### Example 4.8: Rocket Telemetry Instantaneous Velocity
**Problem:** A sounding rocket's altitude in meters during the first stage burn is given by $s(t) = 4t^3 + 2t^2$. Using first principles, determine its velocity at $t = 2$ seconds.

**Step 1:** Recall that instantaneous velocity is the derivative of position: $v(t) = s'(t) = \lim_{h \to 0} \frac{s(t+h) - s(t)}{h}$.

**Step 2:** Evaluate $s(2)$:
$$s(2) = 4(2)^3 + 2(2)^2 = 4(8) + 2(4) = 32 + 8 = 40\text{ m}$$

**Step 3:** Expand $s(2+h)$:
$$s(2+h) = 4(2+h)^3 + 2(2+h)^2$$
$$= 4(8 + 12h + 6h^2 + h^3) + 2(4 + 4h + h^2)$$
$$= (32 + 48h + 24h^2 + 4h^3) + (8 + 8h + 2h^2)$$
$$= 40 + 56h + 26h^2 + 4h^3$$

**Step 4:** Subtract $s(2) = 40$:
$$s(2+h) - s(2) = 56h + 26h^2 + 4h^3 = h(56 + 26h + 4h^2)$$

**Step 5:** Divide by $h$ and take the limit:
$$v(2) = \lim_{h \to 0} (56 + 26h + 4h^2) = 56 + 0 + 0 = 56\text{ m/s}$$

**Conclusion:** At $t = 2$ seconds, the rocket's instantaneous vertical velocity is $56\text{ m/s}$.

---

### Example 4.9: Finding Horizontal Tangents
**Problem:** Find all points on the parabola $f(x) = x^2 - 6x + 8$ where the tangent line is horizontal.

**Step 1:** A horizontal line has slope $m = 0$. Therefore, we must find all $x$ where $f'(x) = 0$.

**Step 2:** Compute $f'(x)$ from first principles:
$$f(x+h) = (x+h)^2 - 6(x+h) + 8 = x^2 + 2xh + h^2 - 6x - 6h + 8$$
$$f(x+h) - f(x) = 2xh + h^2 - 6h = h(2x + h - 6)$$
$$f'(x) = \lim_{h \to 0} (2x + h - 6) = 2x - 6$$

**Step 3:** Set $f'(x) = 0$:
$$2x - 6 = 0 \implies 2x = 6 \implies x = 3$$

**Step 4:** Find the corresponding $y$-coordinate:
$$y = f(3) = 3^2 - 6(3) + 8 = 9 - 18 + 8 = -1$$

**Conclusion:** The tangent line is horizontal at exactly one point: $(3, -1)$ (the vertex of the parabola).

---

### Example 4.10: Demonstrating a Cusp (Continuous Without Derivative)
**Problem:** Examine the curve $f(x) = x^{2/3}$ at $x = 0$. Determine if it is continuous and whether $f'(0)$ exists.

**Step 1:** Continuity at $x = 0$:
$f(0) = 0^{2/3} = 0$.
$\lim_{x \to 0} x^{2/3} = 0 = f(0)$.
The function is continuous at the origin.

**Step 2:** Evaluate the difference quotient for the derivative at $x = 0$:
$$\frac{f(0+h) - f(0)}{h} = \frac{h^{2/3} - 0}{h} = \frac{h^{2/3}}{h^1} = \frac{1}{h^{1/3}}$$

**Step 3:** Evaluate one-sided limits of $\frac{1}{h^{1/3}}$:
- As $h \to 0^+$: $h$ is positive, so $h^{1/3} > 0 \implies \lim_{h \to 0^+} \frac{1}{h^{1/3}} = +\infty$.
- As $h \to 0^-$: $h$ is negative, so $h^{1/3} < 0 \implies \lim_{h \to 0^-} \frac{1}{h^{1/3}} = -\infty$.

**Step 4:** Physical and geometric interpretation:
From the right, the tangent line becomes infinitely steep in the upward direction ($+\infty$). From the left, it becomes infinitely steep in the downward direction ($-\infty$). The curve forms a sharp, needle-like point called a **cusp**.

**Conclusion:** $f(x) = x^{2/3}$ is continuous at $x = 0$, but $f'(0)$ does not exist.

---

## 4.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Polynomial First-Principles Derivations
- **Exercise 4.1:** Using the formal definition $f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$, derive the derivative of $f(x) = 7x + 12$.
- **Exercise 4.2:** Derive the derivative of $f(x) = 3x^2 - 4x$ from first principles.

### Tier 2: Radicals and Fractions via First Principles
- **Exercise 4.3:** Derive the derivative of $f(x) = \sqrt{2x + 5}$ from first principles.
- **Exercise 4.4:** Derive the derivative of $f(x) = \frac{1}{x+2}$ from first principles for $x \neq -2$.

### Tier 3: Tangent and Normal Line Construction
- **Exercise 4.5:** Find the equation of the tangent line to the curve $y = 2x^2 - 5x + 1$ at $x = 2$.
- **Exercise 4.6:** Find the equation of the normal line to the curve $y = x^3$ at $x = 1$.

### Tier 4: Kinematics and Physical Rates
- **Exercise 4.7:** A particle moves along a straight rail such that its position in meters is $s(t) = 5t^2 - 20t + 15$. Find the exact time $t$ when the particle momentarily comes to rest (velocity $v = 0$).
- **Exercise 4.8:** The surface area of an expanding spherical weather balloon is $A(r) = 4\pi r^2$. Find the instantaneous rate of change of surface area with respect to radius $r$ when $r = 5\text{ m}$.

### Tier 5: Theoretical Analysis & Rigorous Proofs
- **Exercise 4.9:** Let $f(x) = \begin{cases} x^2 \sin(1/x), & x \neq 0 \\ 0, & x = 0 \end{cases}$. Prove using the limit definition of the derivative that $f'(0)$ exists and find its value.
- **Exercise 4.10:** Prove that if $f(x) = |x - 2| + |x + 2|$, the derivative $f'(x)$ is equal to $0$ for all $x \in (-2, 2)$.

---

## 4.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 4.1
Derive the derivative of $f(x) = 7x + 12$ from first principles.
1. Form $f(x+h)$:
$$f(x+h) = 7(x+h) + 12 = 7x + 7h + 12$$
2. Subtract $f(x)$:
$$f(x+h) - f(x) = (7x + 7h + 12) - (7x + 12) = 7h$$
3. Divide by $h$:
$$\frac{f(x+h) - f(x)}{h} = \frac{7h}{h} = 7 \quad (\text{for } h \neq 0)$$
4. Take the limit:
$$f'(x) = \lim_{h \to 0} 7 = 7$$
**Final Answer:** $f'(x) = 7$.

---

### Solution to Exercise 4.2
Derive the derivative of $f(x) = 3x^2 - 4x$ from first principles.
1. Form $f(x+h)$:
$$f(x+h) = 3(x+h)^2 - 4(x+h) = 3(x^2 + 2xh + h^2) - 4x - 4h = 3x^2 + 6xh + 3h^2 - 4x - 4h$$
2. Subtract $f(x) = 3x^2 - 4x$:
$$f(x+h) - f(x) = 6xh + 3h^2 - 4h = h(6x + 3h - 4)$$
3. Divide by $h$:
$$\frac{f(x+h) - f(x)}{h} = 6x + 3h - 4$$
4. Take the limit as $h \to 0$:
$$f'(x) = \lim_{h \to 0} (6x + 3h - 4) = 6x - 4$$
**Final Answer:** $f'(x) = 6x - 4$.

---

### Solution to Exercise 4.3
Derive the derivative of $f(x) = \sqrt{2x + 5}$ from first principles.
1. Form the difference quotient:
$$\frac{\sqrt{2(x+h) + 5} - \sqrt{2x + 5}}{h} = \frac{\sqrt{2x + 2h + 5} - \sqrt{2x + 5}}{h}$$
2. Multiply by the conjugate:
$$\frac{(\sqrt{2x + 2h + 5} - \sqrt{2x + 5})(\sqrt{2x + 2h + 5} + \sqrt{2x + 5})}{h(\sqrt{2x + 2h + 5} + \sqrt{2x + 5})}$$
3. Expand numerator:
$$= \frac{(2x + 2h + 5) - (2x + 5)}{h(\sqrt{2x + 2h + 5} + \sqrt{2x + 5})} = \frac{2h}{h(\sqrt{2x + 2h + 5} + \sqrt{2x + 5})}$$
4. Cancel $h$:
$$= \frac{2}{\sqrt{2x + 2h + 5} + \sqrt{2x + 5}}$$
5. Evaluate limit as $h \to 0$:
$$f'(x) = \frac{2}{\sqrt{2x + 5} + \sqrt{2x + 5}} = \frac{2}{2\sqrt{2x + 5}} = \frac{1}{\sqrt{2x + 5}}$$
**Final Answer:** $f'(x) = \frac{1}{\sqrt{2x + 5}}$.

---

### Solution to Exercise 4.4
Derive the derivative of $f(x) = \frac{1}{x+2}$ from first principles.
1. Difference in numerator:
$$f(x+h) - f(x) = \frac{1}{x+h+2} - \frac{1}{x+2} = \frac{(x+2) - (x+h+2)}{(x+h+2)(x+2)} = \frac{-h}{(x+h+2)(x+2)}$$
2. Divide by $h$:
$$\frac{f(x+h) - f(x)}{h} = \frac{-h}{h(x+h+2)(x+2)} = \frac{-1}{(x+h+2)(x+2)}$$
3. Take limit as $h \to 0$:
$$f'(x) = \lim_{h \to 0} \frac{-1}{(x+h+2)(x+2)} = \frac{-1}{(x+2)^2}$$
**Final Answer:** $f'(x) = -\frac{1}{(x+2)^2}$.

---

### Solution to Exercise 4.5
Find the tangent line to $y = 2x^2 - 5x + 1$ at $x = 2$.
1. Find $y_0 = f(2)$:
$$y_0 = 2(2)^2 - 5(2) + 1 = 2(4) - 10 + 1 = 8 - 10 + 1 = -1 \implies P(2, -1)$$
2. Compute derivative $f'(x)$:
From $f(x) = 2x^2 - 5x + 1$, $f'(x) = 4x - 5$.
3. Evaluate slope at $x = 2$:
$$m = f'(2) = 4(2) - 5 = 8 - 5 = 3$$
4. Point-slope equation:
$$y - (-1) = 3(x - 2) \implies y + 1 = 3x - 6 \implies y = 3x - 7$$
**Final Answer:** $y = 3x - 7$.

---

### Solution to Exercise 4.6
Find the normal line to $y = x^3$ at $x = 1$.
1. Contact point: $y_0 = 1^3 = 1 \implies P(1, 1)$.
2. Tangent slope: $f'(x) = 3x^2 \implies m_{\text{tan}} = 3(1)^2 = 3$.
3. Normal slope: $m_{\text{norm}} = -\frac{1}{m_{\text{tan}}} = -\frac{1}{3}$.
4. Line equation:
$$y - 1 = -\frac{1}{3}(x - 1) \implies y - 1 = -\frac{1}{3}x + \frac{1}{3} \implies y = -\frac{1}{3}x + \frac{4}{3}$$
**Final Answer:** $y = -\frac{1}{3}x + \frac{4}{3}$ (or $x + 3y - 4 = 0$).

---

### Solution to Exercise 4.7
Find when the particle $s(t) = 5t^2 - 20t + 15$ comes to rest.
1. Velocity is $v(t) = s'(t)$.
2. Differentiate $s(t)$:
$$s'(t) = 10t - 20$$
3. Set $v(t) = 0$:
$$10t - 20 = 0 \implies 10t = 20 \implies t = 2\text{ s}$$
**Final Answer:** $t = 2$ seconds.

---

### Solution to Exercise 4.8
Find $\frac{dA}{dr}$ for $A(r) = 4\pi r^2$ at $r = 5\text{ m}$.
1. Differentiate with respect to $r$:
$$\frac{dA}{dr} = \lim_{h \to 0} \frac{4\pi(r+h)^2 - 4\pi r^2}{h} = 4\pi \lim_{h \to 0} \frac{2rh + h^2}{h} = 4\pi(2r) = 8\pi r$$
2. Evaluate at $r = 5$:
$$\left.\frac{dA}{dr}\right|_{r=5} = 8\pi(5) = 40\pi \approx 125.66\text{ m}^2/\text{m}$$
**Final Answer:** $40\pi\text{ m}^2/\text{m}$ (or $\approx 125.66\text{ m}$).

---

### Solution to Exercise 4.9
Evaluate $f'(0)$ for $f(x) = \begin{cases} x^2 \sin(1/x), & x \neq 0 \\ 0, & x = 0 \end{cases}$.
1. Apply the formal limit definition at $x = 0$:
$$f'(0) = \lim_{h \to 0} \frac{f(0 + h) - f(0)}{h} = \lim_{h \to 0} \frac{h^2 \sin(1/h) - 0}{h} = \lim_{h \to 0} [h \sin(1/h)]$$
2. Apply the Squeeze Theorem:
Since $-1 \le \sin(1/h) \le 1$, for any $h$:
$$-|h| \le h \sin(1/h) \le |h|$$
3. As $h \to 0$, both $-|h| \to 0$ and $|h| \to 0$.
4. Therefore, $\lim_{h \to 0} [h \sin(1/h)] = 0$.
**Final Answer:** $f'(0)$ exists and equals $0$.

---

### Solution to Exercise 4.10
Prove that for $f(x) = |x - 2| + |x + 2|$, $f'(x) = 0$ for all $x \in (-2, 2)$.
1. For any $x \in (-2, 2)$:
Since $x > -2$, $x + 2 > 0 \implies |x + 2| = x + 2$.
Since $x < 2$, $x - 2 < 0 \implies |x - 2| = -(x - 2) = 2 - x$.
2. Substitute these into $f(x)$:
$$f(x) = (2 - x) + (x + 2) = 4$$
3. For every $x \in (-2, 2)$, $f(x)$ is the constant function $f(x) = 4$.
4. The derivative of a constant function is $0$:
$$f'(x) = \lim_{h \to 0} \frac{4 - 4}{h} = 0$$
**Final Answer:** For all $x \in (-2, 2)$, $f(x) \equiv 4$, therefore $f'(x) = 0$.
