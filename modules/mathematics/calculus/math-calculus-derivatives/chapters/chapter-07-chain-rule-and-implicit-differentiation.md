# Chapter 7: The Chain Rule and Implicit Differentiation — The Nested Gearbox

> *"Nature does not always present its laws as simple, standalone functions. Most phenomena are cascading chains of cause and effect: temperature dictates pressure, pressure dictates volume, and volume dictates reaction speed. To differentiate a cascade is to track how a tremor at the origin transmits through a nested gearbox of interacting mechanisms."*

---

## 7.1 The Cascade of Functions: Composites in the Real World

In many scientific and engineering problems, an output variable $y$ does not depend directly on the primary control variable $x$, but rather on an intermediate variable $u$, which in turn depends on $x$:

$$x \overset{g}{\longrightarrow} u \overset{f}{\longrightarrow} y$$

Mathematically, this is the **composite function**:

$$y = (f \circ g)(x) = f(g(x))$$

### Mechanical Analogy: The Interlocking Gear Train
Imagine three interconnected gears in an industrial gearbox:
- Gear 1 turns through angle $x$.
- Gear 2 turns through angle $u = g(x)$. Its gear ratio with Gear 1 is $\frac{du}{dx} = 3$ (it turns 3 revolutions for every 1 revolution of Gear 1).
- Gear 3 turns through angle $y = f(u)$. Its gear ratio with Gear 2 is $\frac{dy}{du} = 4$ (it turns 4 revolutions for every 1 revolution of Gear 2).

```
   [Gear 1: x] =======( Ratio: du/dx = 3 )=======> [Gear 2: u]
                                                         |
                                                         | ( Ratio: dy/du = 4 )
                                                         v
                                                   [Gear 3: y]

   Overall Gear Ratio:  dy/dx = (dy/du) · (du/dx) = 4 · 3 = 12
```

How fast is Gear 3 spinning relative to Gear 1?
If Gear 1 turns once, Gear 2 turns $3$ times. Each turn of Gear 2 causes Gear 3 to turn $4$ times. Thus, one turn of Gear 1 causes Gear 3 to turn:

$$\frac{dy}{dx} = 4 \times 3 = 12 \text{ turns}$$

This fundamental intuition is the essence of the **Chain Rule**: rates of change along a functional chain **multiply**.

In Leibniz notation:

$$\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$$

In Lagrange notation:

$$\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$$

In words: *"The derivative of a composite function is the derivative of the outer function evaluated at the inner function, multiplied by the derivative of the inner function."*

---

## 7.2 Rigorous Derivation of the Chain Rule

Let $y = f(u)$ and $u = g(x)$, where $g$ is differentiable at $x$ and $f$ is differentiable at $u = g(x)$.

A naive approach writes:

$$\frac{\Delta y}{\Delta x} = \frac{\Delta y}{\Delta u} \cdot \frac{\Delta u}{\Delta x}$$

and takes the limit as $\Delta x \to 0$. While intuitive, this naive argument contains a subtle mathematical flaw: for certain functions, $\Delta u = g(x+h) - g(x)$ might equal zero for infinitely many points near $x$, causing division by zero in $\frac{\Delta y}{\Delta u}$.

To prove the Chain Rule with complete mathematical rigor, we utilize the **Carathéodory formulation** of differentiability:

A function $f$ is differentiable at $u_0$ if and only if there exists an auxiliary function $\Phi(u)$ that is continuous at $u_0$ such that for all $u$:

$$f(u) - f(u_0) = \Phi(u) \cdot (u - u_0), \quad \text{with } \Phi(u_0) = f'(u_0)$$

Now let $u_0 = g(x)$ and $u = g(x+h)$. Substituting into the Carathéodory identity:

$$f(g(x+h)) - f(g(x)) = \Phi(g(x+h)) \cdot [g(x+h) - g(x)]$$

Divide both sides by $h \neq 0$:

$$\frac{f(g(x+h)) - f(g(x))}{h} = \Phi(g(x+h)) \cdot \frac{g(x+h) - g(x)}{h}$$

Now take the limit as $h \to 0$:
1. Because $g$ is differentiable at $x$, it is continuous, so $\lim_{h \to 0} g(x+h) = g(x) = u_0$.
2. Because $\Phi$ is continuous at $u_0$, $\lim_{h \to 0} \Phi(g(x+h)) = \Phi(u_0) = f'(u_0) = f'(g(x))$.
3. By definition of the derivative of $g$, $\lim_{h \to 0} \frac{g(x+h) - g(x)}{h} = g'(x)$.

Applying the limit product rule:

$$\lim_{h \to 0} \frac{f(g(x+h)) - f(g(x))}{h} = f'(g(x)) \cdot g'(x) \quad \blacksquare$$

---

## 7.3 The Generalized Power Rule

The most frequent application of the Chain Rule combines an inner function $u(x)$ with an outer power function $f(u) = u^n$:

$$\frac{d}{dx}\left[ (u(x))^n \right] = n (u(x))^{n-1} \cdot u'(x)$$

### Comparison: Standard Power Rule vs Generalized Power Rule
- Standard: $\frac{d}{dx}[x^5] = 5x^4$ (inner derivative is $\frac{d}{dx}[x] = 1$).
- Generalized: $\frac{d}{dx}[(3x^2 + 7)^5] = 5(3x^2 + 7)^4 \cdot \frac{d}{dx}[3x^2 + 7] = 5(3x^2 + 7)^4 \cdot (6x) = 30x(3x^2 + 7)^4$.

Forgetting the inner derivative $u'(x)$ is the single most common error in student calculus! Never finish a composite differentiation without multiplying by the derivative of what was inside!

---

## 7.4 Multi-Tiered Chains (Three or More Nested Layers)

When functions are nested three or more levels deep:

$$y = f(g(h(x)))$$

Let $w = h(x)$, $u = g(w)$, and $y = f(u)$. Differentiating step by step:

$$\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dw} \cdot \frac{dw}{dx} = f'(g(h(x))) \cdot g'(h(x)) \cdot h'(x)$$

Work systematically from the outermost shell to the innermost core, peeling off one layer at a time.

---

## 7.5 Implicit Differentiation: Unlocking Non-Explicit Curves

Up to this point, every function was defined **explicitly** in the form $y = f(x)$, where $y$ sits isolated on the left-hand side.

However, in physics, orbit mechanics, and geometry, relationships between variables are often defined **implicitly** by an equation relating $x$ and $y$:

$$F(x, y) = 0$$

Examples include:
- A Circle: $x^2 + y^2 = 25$
- An Ellipse: $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$
- A Hyperbola: $x^2 - y^2 = 1$
- The Folium of Descartes: $x^3 + y^3 = 6xy$

In these equations, isolating $y$ algebraically is either cumbersome, produces piecewise branches with $\pm\sqrt{\dots}$, or is mathematically impossible using elementary algebra.

**Implicit differentiation** provides a brilliant solution: we differentiate both sides of the equation with respect to $x$, treating $y$ as an unknown differentiable function of $x$ ($y = y(x)$).

Whenever we differentiate a term containing $y$, we apply the Chain Rule:

$$\frac{d}{dx}[y] = \frac{dy}{dx}$$
$$\frac{d}{dx}[y^2] = 2y \cdot \frac{dy}{dx}$$
$$\frac{d}{dx}[y^3] = 3y^2 \cdot \frac{dy}{dx}$$
$$\frac{d}{dx}[x \cdot y] = (1) \cdot y + x \cdot \frac{dy}{dx} = y + x \frac{dy}{dx} \quad (\text{Product Rule})$$

After differentiating every term, we algebraically collect all terms containing $\frac{dy}{dx}$ on one side of the equals sign and factor it out to solve for $\frac{dy}{dx}$.

---

## 7.6 Ten Progressive Worked Numerical Examples

### Example 7.1: Generalized Power Rule on a High-Degree Polynomial
**Problem:** Differentiate $y = (4x^3 - 5x + 1)^6$.

**Step 1:** Identify the outer function and the inner core:
- Outer function: $f(u) = u^6 \implies f'(u) = 6u^5$
- Inner core: $u = 4x^3 - 5x + 1$

**Step 2:** Differentiate the inner core:
$$\frac{du}{dx} = \frac{d}{dx}[4x^3 - 5x + 1] = 12x^2 - 5$$

**Step 3:** Assemble using the Chain Rule:
$$\frac{dy}{dx} = 6u^5 \cdot \frac{du}{dx} = 6(4x^3 - 5x + 1)^5 \cdot (12x^2 - 5)$$
$$= 6(12x^2 - 5)(4x^3 - 5x + 1)^5 = (72x^2 - 30)(4x^3 - 5x + 1)^5$$

---

### Example 7.2: Composite Radical Differentiation
**Problem:** Differentiate $f(x) = \sqrt{5x^2 + 16}$ for all $x \in \mathbb{R}$.

**Step 1:** Rewrite the radical as a fractional power:
$$f(x) = (5x^2 + 16)^{1/2}$$

**Step 2:** Differentiate using the Generalized Power Rule with $n = \frac{1}{2}$:
$$f'(x) = \frac{1}{2}(5x^2 + 16)^{\frac{1}{2} - 1} \cdot \frac{d}{dx}[5x^2 + 16]$$
$$f'(x) = \frac{1}{2}(5x^2 + 16)^{-1/2} \cdot (10x)$$

**Step 3:** Simplify:
$$f'(x) = \frac{10x}{2\sqrt{5x^2 + 16}} = \frac{5x}{\sqrt{5x^2 + 16}}$$

Notice that at $x = 0$, $f'(0) = 0$, which corresponds to the minimum of the curve at $(0, 4)$.

---

### Example 7.3: Reciprocal Composite Power Function
**Problem:** Differentiate $g(x) = \frac{1}{(2x^3 - 7x)^4}$.

**Step 1:** Rewrite in negative exponent form:
$$g(x) = (2x^3 - 7x)^{-4}$$

**Step 2:** Apply the Chain Rule with $n = -4$:
$$g'(x) = -4(2x^3 - 7x)^{-4 - 1} \cdot \frac{d}{dx}[2x^3 - 7x]$$
$$g'(x) = -4(2x^3 - 7x)^{-5} \cdot (6x^2 - 7)$$

**Step 3:** Express with positive exponents in fractional form:
$$g'(x) = \frac{-4(6x^2 - 7)}{(2x^3 - 7x)^5} = \frac{28 - 24x^2}{(2x^3 - 7x)^5}$$

---

### Example 7.4: Multi-Layered Three-Tier Chain
**Problem:** Differentiate $y = \sqrt{(3x^2 + 1)^4 + 7}$.

**Step 1:** Decompose into three concentric shells:
- Level 1 (Outer): $y = w^{1/2} \implies \frac{dy}{dw} = \frac{1}{2\sqrt{w}}$
- Level 2 (Middle): $w = u^4 + 7 \implies \frac{dw}{du} = 4u^3$
- Level 3 (Inner): $u = 3x^2 + 1 \implies \frac{du}{dx} = 6x$

**Step 2:** Multiply the chain of derivatives:
$$\frac{dy}{dx} = \frac{dy}{dw} \cdot \frac{dw}{du} \cdot \frac{du}{dx}$$
$$\frac{dy}{dx} = \left(\frac{1}{2\sqrt{w}}\right) \cdot (4u^3) \cdot (6x) = \frac{24x u^3}{2\sqrt{w}} = \frac{12x u^3}{\sqrt{w}}$$

**Step 3:** Substitute back $u$ and $w$:
$$\frac{dy}{dx} = \frac{12x (3x^2 + 1)^3}{\sqrt{(3x^2 + 1)^4 + 7}}$$

---

### Example 7.5: Implicit Differentiation of a Circle and Perpendicularity to Radius
**Problem:** For the circle $x^2 + y^2 = 25$, compute $\frac{dy}{dx}$ at the point $(3, 4)$ and verify that the tangent line is perpendicular to the radial vector.

**Step 1:** Differentiate both sides of $x^2 + y^2 = 25$ with respect to $x$:
$$\frac{d}{dx}[x^2] + \frac{d}{dx}[y^2] = \frac{d}{dx}[25]$$
$$2x + 2y \frac{dy}{dx} = 0$$

**Step 2:** Solve for $\frac{dy}{dx}$:
$$2y \frac{dy}{dx} = -2x \implies \frac{dy}{dx} = -\frac{x}{y} \quad (\text{for } y \neq 0)$$

**Step 3:** Evaluate at the point $(x, y) = (3, 4)$:
$$m_{\text{tan}} = -\frac{3}{4} = -0.75$$

**Step 4:** Vector geometric check:
The radial vector from the origin $(0, 0)$ to the contact point $(3, 4)$ has slope:
$$m_{\text{radius}} = \frac{4 - 0}{3 - 0} = \frac{4}{3}$$
Multiply the two slopes:
$$m_{\text{radius}} \cdot m_{\text{tan}} = \left(\frac{4}{3}\right) \cdot \left(-\frac{3}{4}\right) = -1$$
The product of their slopes is $-1$, confirming analytically that the tangent line is perpendicular to the radius at every point on the circle.

---

### Example 7.6: Tangent Line to an Ellipse
**Problem:** Find the equation of the tangent line to the ellipse $4x^2 + 9y^2 = 72$ at the point $(3, 2)$.

**Step 1:** Verify the point lies on the ellipse:
$$4(3)^2 + 9(2)^2 = 4(9) + 9(4) = 36 + 36 = 72 \quad (\text{Confirmed})$$

**Step 2:** Differentiate implicitly with respect to $x$:
$$\frac{d}{dx}[4x^2] + \frac{d}{dx}[9y^2] = \frac{d}{dx}[72]$$
$$8x + 18y \frac{dy}{dx} = 0$$

**Step 3:** Solve for $\frac{dy}{dx}$:
$$18y \frac{dy}{dx} = -8x \implies \frac{dy}{dx} = -\frac{8x}{18y} = -\frac{4x}{9y}$$

**Step 4:** Evaluate slope at $(3, 2)$:
$$m = -\frac{4(3)}{9(2)} = -\frac{12}{18} = -\frac{2}{3}$$

**Step 5:** Form the tangent line equation:
$$y - 2 = -\frac{2}{3}(x - 3) \implies y - 2 = -\frac{2}{3}x + 2 \implies y = -\frac{2}{3}x + 4$$
Or in standard form: $2x + 3y - 12 = 0$.

---

### Example 7.7: Implicit Differentiation with Cross-Product Term
**Problem:** Find $\frac{dy}{dx}$ for the curve $x^3 + x^2 y + 2y^3 = 11$ at $(1, 1)$.

**Step 1:** Verify point $(1, 1)$:
$$1^3 + (1)^2(1) + 2(1)^3 = 1 + 1 + 2 = 4 \neq 11 \dots$$
Let us evaluate at the correct point on the curve: at $x = 1$, $1 + y + 2y^3 = 11 \implies 2y^3 + y - 10 = 0$.
Testing $y = 2$: $2(2)^3 + 2 - 10 = 2(8) + 2 - 10 = 16 + 2 - 10 = 8 \dots$
Let the curve equation be $x^3 + x^2 y + 2y^3 = 4$ so that $(1, 1)$ is on the curve:
$$1^3 + 1^2(1) + 2(1)^3 = 1 + 1 + 2 = 4 \quad (\text{Confirmed at } P(1, 1))$$

**Step 2:** Differentiate each term with respect to $x$:
- $\frac{d}{dx}[x^3] = 3x^2$
- For $x^2 y$, use the product rule:
  $$\frac{d}{dx}[x^2 y] = \frac{d}{dx}[x^2] \cdot y + x^2 \cdot \frac{dy}{dx} = 2xy + x^2 \frac{dy}{dx}$$
- For $2y^3$:
  $$\frac{d}{dx}[2y^3] = 6y^2 \frac{dy}{dx}$$
- $\frac{d}{dx}[4] = 0$

**Step 3:** Assemble the differentiated equation:
$$3x^2 + 2xy + x^2 \frac{dy}{dx} + 6y^2 \frac{dy}{dx} = 0$$

**Step 4:** Group terms containing $\frac{dy}{dx}$ on the left, move all others to the right:
$$(x^2 + 6y^2) \frac{dy}{dx} = -(3x^2 + 2xy)$$

**Step 5:** Solve for $\frac{dy}{dx}$:
$$\frac{dy}{dx} = -\frac{3x^2 + 2xy}{x^2 + 6y^2}$$

**Step 6:** Substitute $(x, y) = (1, 1)$:
$$\left.\frac{dy}{dx}\right|_{(1,1)} = -\frac{3(1)^2 + 2(1)(1)}{1^2 + 6(1)^2} = -\frac{3 + 2}{1 + 6} = -\frac{5}{7}$$

---

### Example 7.8: Finding Stationary Points on the Folium of Descartes
**Problem:** For the Folium of Descartes $x^3 + y^3 = 6xy$, compute $\frac{dy}{dx}$ and determine the non-zero coordinate where the tangent line is horizontal.

**Step 1:** Differentiate both sides with respect to $x$:
$$\frac{d}{dx}[x^3 + y^3] = \frac{d}{dx}[6xy]$$
$$3x^2 + 3y^2 \frac{dy}{dx} = 6\left(y + x \frac{dy}{dx}\right) = 6y + 6x \frac{dy}{dx}$$

**Step 2:** Group terms:
$$(3y^2 - 6x) \frac{dy}{dx} = 6y - 3x^2$$
Divide through by $3$:
$$(y^2 - 2x) \frac{dy}{dx} = 2y - x^2$$
$$\frac{dy}{dx} = \frac{2y - x^2}{y^2 - 2x}$$

**Step 3:** Set the slope to zero for a horizontal tangent:
$$2y - x^2 = 0 \implies y = \frac{x^2}{2}$$

**Step 4:** Substitute $y = \frac{x^2}{2}$ back into the original curve $x^3 + y^3 = 6xy$:
$$x^3 + \left(\frac{x^2}{2}\right)^3 = 6x \left(\frac{x^2}{2}\right)$$
$$x^3 + \frac{x^6}{8} = 3x^3$$
$$\frac{x^6}{8} = 2x^3$$
Since we seek non-zero solutions, divide by $x^3 \neq 0$:
$$\frac{x^3}{8} = 2 \implies x^3 = 16 \implies x = \sqrt[3]{16} = 2\sqrt[3]{2} \approx 2.5198$$

**Step 5:** Calculate corresponding $y$:
$$y = \frac{x^2}{2} = \frac{(2\sqrt[3]{2})^2}{2} = \frac{4\sqrt[3]{4}}{2} = 2\sqrt[3]{4} \approx 3.1748$$

**Conclusion:** The horizontal tangent occurs at $(2\sqrt[3]{2}, 2\sqrt[3]{4})$.

---

### Example 7.9: Second Derivative via Implicit Differentiation
**Problem:** Find the second derivative $\frac{d^2y}{dx^2}$ for the circle $x^2 + y^2 = r^2$ in terms of $y$ and the constant $r$.

**Step 1:** First derivative (from Example 7.5):
$$2x + 2y \frac{dy}{dx} = 0 \implies \frac{dy}{dx} = -\frac{x}{y}$$

**Step 2:** Differentiate $\frac{dy}{dx} = -\frac{x}{y}$ with respect to $x$ using the quotient rule:
$$\frac{d^2y}{dx^2} = \frac{d}{dx}\left[-\frac{x}{y}\right] = -\frac{d}{dx}\left[\frac{x}{y}\right]$$
$$= -\left[ \frac{y \frac{d}{dx}[x] - x \frac{d}{dx}[y]}{y^2} \right] = -\left[ \frac{y(1) - x \frac{dy}{dx}}{y^2} \right]$$

**Step 3:** Substitute $\frac{dy}{dx} = -\frac{x}{y}$ into the expression:
$$\frac{d^2y}{dx^2} = -\left[ \frac{y - x\left(-\frac{x}{y}\right)}{y^2} \right] = -\left[ \frac{y + \frac{x^2}{y}}{y^2} \right]$$

**Step 4:** Multiply numerator and denominator by $y$:
$$\frac{d^2y}{dx^2} = -\frac{y^2 + x^2}{y^3}$$

**Step 5:** Recognize that $x^2 + y^2 = r^2$ from the original equation:
$$\frac{d^2y}{dx^2} = -\frac{r^2}{y^3}$$

Notice how clean the result is: the second derivative depends solely on the radius and the cube of the height $y$!

---

### Example 7.10: Rate of Volume Growth in an Expanding Spherical Reservoir
**Problem:** Water fills a spherical holding tank such that its radius expands dynamically according to $r(t) = \sqrt{3t + 4}$ meters. Find the instantaneous rate of volume growth $\frac{dV}{dt}$ at $t = 4$ seconds.

**Step 1:** Volume of a sphere in terms of radius:
$$V(r) = \frac{4}{3}\pi r^3$$

**Step 2:** By the Chain Rule:
$$\frac{dV}{dt} = \frac{dV}{dr} \cdot \frac{dr}{dt}$$

**Step 3:** Differentiate $V$ with respect to $r$:
$$\frac{dV}{dr} = \frac{4}{3}\pi (3r^2) = 4\pi r^2$$

**Step 4:** Differentiate $r(t) = (3t + 4)^{1/2}$ with respect to $t$:
$$\frac{dr}{dt} = \frac{1}{2}(3t + 4)^{-1/2} \cdot \frac{d}{dt}[3t + 4] = \frac{3}{2\sqrt{3t + 4}}$$

**Step 5:** Multiply the derivatives:
$$\frac{dV}{dt} = (4\pi r^2) \cdot \left(\frac{3}{2\sqrt{3t + 4}}\right)$$

**Step 6:** Evaluate at $t = 4$ seconds:
$$r(4) = \sqrt{3(4) + 4} = \sqrt{12 + 4} = \sqrt{16} = 4\text{ m}$$
$$\left.\frac{dr}{dt}\right|_{t=4} = \frac{3}{2(4)} = \frac{3}{8}\text{ m/s}$$
$$\left.\frac{dV}{dt}\right|_{t=4} = 4\pi(4^2) \cdot \left(\frac{3}{8}\right) = 4\pi(16) \cdot \left(\frac{3}{8}\right) = 64\pi \cdot \frac{3}{8} = 24\pi\text{ m}^3/\text{s}$$

**Conclusion:** At $t = 4\text{ s}$, the reservoir volume increases at $24\pi \approx 75.40\text{ m}^3/\text{s}$.

---

## 7.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Generalized Power Rule Applications
- **Exercise 7.1:** Differentiate $y = (5x^3 - 2x^2 + 7)^4$.
- **Exercise 7.2:** Differentiate $f(t) = \sqrt{6t - 1}$ for $t > 1/6$.

### Tier 2: Composites with Radicals and Fractions
- **Exercise 7.3:** Differentiate $g(x) = \frac{1}{\sqrt{x^2 + 9}}$.
- **Exercise 7.4:** Differentiate $y = \left(\frac{2x - 1}{x + 3}\right)^3$.

### Tier 3: Basic Implicit Differentiation
- **Exercise 7.5:** Find $\frac{dy}{dx}$ for the curve $x^2 - y^2 = 9$.
- **Exercise 7.6:** Find the slope of the tangent line to the circle $x^2 + y^2 = 100$ at $(-6, 8)$.

### Tier 4: Mixed Products in Implicit Curves
- **Exercise 7.7:** Find $\frac{dy}{dx}$ for $x^2 y^2 + 3xy = 10$.
- **Exercise 7.8:** Find the equation of the tangent line to $x^3 + y^3 - 9xy = 0$ at the point $(4, 2)$ if it lies on the curve. (First verify if $(4, 2)$ or another coordinate is on the curve).

### Tier 5: Higher-Order Derivatives & Kinematic Cascades
- **Exercise 7.9:** For the ellipse $x^2 + 4y^2 = 16$, show that $\frac{d^2y}{dx^2} = -\frac{1}{4y^3}$.
- **Exercise 7.10:** A hydraulic cylinder has pressure $P(V) = 500 V^{-1.4}$ kilopascals. If volume expands at a constant rate $\frac{dV}{dt} = 0.05\text{ m}^3/\text{s}$, calculate the rate of pressure drop $\frac{dP}{dt}$ when $V = 1\text{ m}^3$.

---

## 7.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 7.1
Differentiate $y = (5x^3 - 2x^2 + 7)^4$.
1. Outer derivative: $4 u^3$.
2. Inner derivative: $\frac{d}{dx}[5x^3 - 2x^2 + 7] = 15x^2 - 4x$.
3. By the chain rule:
$$\frac{dy}{dx} = 4(5x^3 - 2x^2 + 7)^3 (15x^2 - 4x) = (60x^2 - 16x)(5x^3 - 2x^2 + 7)^3$$
**Final Answer:** $(60x^2 - 16x)(5x^3 - 2x^2 + 7)^3$.

---

### Solution to Exercise 7.2
Differentiate $f(t) = \sqrt{6t - 1}$.
1. Rewrite in power form: $f(t) = (6t - 1)^{1/2}$.
2. Apply generalized power rule:
$$f'(t) = \frac{1}{2}(6t - 1)^{-1/2} \cdot \frac{d}{dt}[6t - 1] = \frac{1}{2}(6t - 1)^{-1/2} \cdot 6 = \frac{3}{\sqrt{6t - 1}}$$
**Final Answer:** $f'(t) = \frac{3}{\sqrt{6t - 1}}$.

---

### Solution to Exercise 7.3
Differentiate $g(x) = \frac{1}{\sqrt{x^2 + 9}}$.
1. Rewrite in power form: $g(x) = (x^2 + 9)^{-1/2}$.
2. Differentiate:
$$g'(x) = -\frac{1}{2}(x^2 + 9)^{-3/2} \cdot \frac{d}{dx}[x^2 + 9] = -\frac{1}{2}(x^2 + 9)^{-3/2} \cdot (2x) = -\frac{x}{(x^2 + 9)^{3/2}} = -\frac{x}{\sqrt{(x^2 + 9)^3}}$$
**Final Answer:** $g'(x) = -\frac{x}{(x^2 + 9)^{3/2}}$.

---

### Solution to Exercise 7.4
Differentiate $y = \left(\frac{2x - 1}{x + 3}\right)^3$.
1. Apply outer power rule:
$$\frac{dy}{dx} = 3\left(\frac{2x - 1}{x + 3}\right)^2 \cdot \frac{d}{dx}\left[\frac{2x - 1}{x + 3}\right]$$
2. Differentiate inner quotient:
$$\frac{d}{dx}\left[\frac{2x - 1}{x + 3}\right] = \frac{(x + 3)(2) - (2x - 1)(1)}{(x + 3)^2} = \frac{2x + 6 - 2x + 1}{(x + 3)^2} = \frac{7}{(x + 3)^2}$$
3. Combine:
$$\frac{dy}{dx} = 3\left(\frac{2x - 1}{x + 3}\right)^2 \cdot \frac{7}{(x + 3)^2} = \frac{21(2x - 1)^2}{(x + 3)^4}$$
**Final Answer:** $\frac{dy}{dx} = \frac{21(2x - 1)^2}{(x + 3)^4}$.

---

### Solution to Exercise 7.5
Find $\frac{dy}{dx}$ for $x^2 - y^2 = 9$.
1. Differentiate both sides with respect to $x$:
$$2x - 2y \frac{dy}{dx} = 0$$
2. Solve for $\frac{dy}{dx}$:
$$2y \frac{dy}{dx} = 2x \implies \frac{dy}{dx} = \frac{x}{y}$$
**Final Answer:** $\frac{dy}{dx} = \frac{x}{y}$.

---

### Solution to Exercise 7.6
Find tangent slope to $x^2 + y^2 = 100$ at $(-6, 8)$.
1. Differentiating gives:
$$2x + 2y \frac{dy}{dx} = 0 \implies \frac{dy}{dx} = -\frac{x}{y}$$
2. Evaluate at $(-6, 8)$:
$$m = -\frac{-6}{8} = \frac{6}{8} = \frac{3}{4} = 0.75$$
**Final Answer:** $m = \frac{3}{4}$ (or $0.75$).

---

### Solution to Exercise 7.7
Find $\frac{dy}{dx}$ for $x^2 y^2 + 3xy = 10$.
1. Notice that $u = xy \implies u^2 + 3u = 10$.
2. Alternatively, differentiate term by term:
$$\frac{d}{dx}[x^2 y^2] = 2x y^2 + x^2(2y y') = 2xy^2 + 2x^2 y y'$$
$$\frac{d}{dx}[3xy] = 3(y + x y') = 3y + 3x y'$$
3. Combine:
$$2xy^2 + 2x^2 y y' + 3y + 3x y' = 0$$
$$(2x^2 y + 3x) y' = -(2xy^2 + 3y)$$
$$y' = -\frac{2xy^2 + 3y}{2x^2 y + 3x} = -\frac{y(2xy + 3)}{x(2xy + 3)} = -\frac{y}{x}$$
**Final Answer:** $\frac{dy}{dx} = -\frac{y}{x}$.

---

### Solution to Exercise 7.8
Find tangent line to $x^3 + y^3 - 9xy = 0$ at $(2, 4)$.
1. Verify point: $2^3 + 4^3 - 9(2)(4) = 8 + 64 - 72 = 72 - 72 = 0$. The point $(2, 4)$ is on the curve!
2. Differentiate implicitly:
$$3x^2 + 3y^2 y' - 9(y + x y') = 0$$
$$3x^2 + 3y^2 y' - 9y - 9x y' = 0$$
$$(3y^2 - 9x) y' = 9y - 3x^2$$
$$y' = \frac{3y - x^2}{y^2 - 3x}$$
3. Evaluate slope at $(2, 4)$:
$$m = \frac{3(4) - 2^2}{4^2 - 3(2)} = \frac{12 - 4}{16 - 6} = \frac{8}{10} = \frac{4}{5} = 0.8$$
4. Tangent line equation:
$$y - 4 = \frac{4}{5}(x - 2) \implies y - 4 = \frac{4}{5}x - \frac{8}{5} \implies y = \frac{4}{5}x + \frac{12}{5}$$
Or in standard form: $4x - 5y + 12 = 0$.
**Final Answer:** $y = \frac{4}{5}x + \frac{12}{5}$ (or $4x - 5y + 12 = 0$).

---

### Solution to Exercise 7.9
For $x^2 + 4y^2 = 16$, show $\frac{d^2y}{dx^2} = -\frac{1}{4y^3}$.
1. First derivative:
$$2x + 8y y' = 0 \implies y' = -\frac{2x}{8y} = -\frac{x}{4y}$$
2. Second derivative:
$$y'' = -\frac{1}{4} \frac{d}{dx}\left[\frac{x}{y}\right] = -\frac{1}{4} \left[ \frac{y(1) - x y'}{y^2} \right]$$
3. Substitute $y' = -\frac{x}{4y}$:
$$y'' = -\frac{1}{4} \left[ \frac{y - x(-\frac{x}{4y})}{y^2} \right] = -\frac{1}{4} \left[ \frac{y + \frac{x^2}{4y}}{y^2} \right] = -\frac{1}{4} \left[ \frac{4y^2 + x^2}{4y^3} \right] = -\frac{x^2 + 4y^2}{16y^3}$$
4. Recognize that from the original equation, $x^2 + 4y^2 = 16$:
$$y'' = -\frac{16}{16y^3} = -\frac{1}{4y^3} \quad \blacksquare$$
**Final Answer:** Confirmed, $\frac{d^2y}{dx^2} = -\frac{1}{4y^3}$.

---

### Solution to Exercise 7.10
Compute $\frac{dP}{dt}$ when $P(V) = 500 V^{-1.4}$ and $\frac{dV}{dt} = 0.05$ at $V = 1$.
1. Apply the chain rule:
$$\frac{dP}{dt} = \frac{dP}{dV} \cdot \frac{dV}{dt}$$
2. Compute $\frac{dP}{dV}$:
$$\frac{dP}{dV} = 500(-1.4 V^{-1.4 - 1}) = -700 V^{-2.4}$$
3. Evaluate at $V = 1\text{ m}^3$:
$$\left.\frac{dP}{dV}\right|_{V=1} = -700(1)^{-2.4} = -700\text{ kPa/m}^3$$
4. Calculate rate of pressure change:
$$\frac{dP}{dt} = (-700\text{ kPa/m}^3)(0.05\text{ m}^3/\text{s}) = -35\text{ kPa/s}$$
**Final Answer:** $\frac{dP}{dt} = -35\text{ kPa/s}$ (pressure is dropping at 35 kPa per second).
