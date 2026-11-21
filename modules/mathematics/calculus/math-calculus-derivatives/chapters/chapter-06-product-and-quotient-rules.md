# Chapter 6: The Product and Quotient Rules — Geometry of Compounding Rates

> *"When two quantities are multiplying together, the rate at which their product expands does not obey naive intuition. The growth of a territory is not just the sum of changes along its borders, but the simultaneous outward push of both length and width creating new area across two dimensions."*

---

## 6.1 The Fallacy of Naive Multiplication

When beginners first encounter the sum rule $\frac{d}{dx}[u + v] = u' + v'$, they frequently jump to the seductive assumption that the derivative of a product must simply be the product of the derivatives:

$$\frac{d}{dx}[u \cdot v] \stackrel{?}{=} u' \cdot v' \quad \mathbf{(CATASTROPHICALLY\ FALSE)}$$

To understand why this is completely wrong, test it on the simplest possible quadratic function:

$$f(x) = x^2 = x \cdot x$$

Let $u(x) = x$ and $v(x) = x$.
We already know with absolute certainty from first principles (Chapter 4) and the power rule (Chapter 5) that:

$$\frac{d}{dx}[x^2] = 2x$$

Now test the naive guess:
$$u'(x) = \frac{d}{dx}[x] = 1, \quad v'(x) = \frac{d}{dx}[x] = 1$$
$$u'(x) \cdot v'(x) = 1 \cdot 1 = 1$$

If the naive guess were true, the derivative of $x^2$ would be $1$ everywhere — meaning a curved parabolic trajectory would have a constant slope of $1$, which is absurd.

Rates of change of products do not multiply; they compound across shared boundaries.

---

## 6.2 The Geometric Proof: The Expanding Rectangle

To see why the correct rule takes the shape it does, imagine a rectangular metal plate being heated in an industrial furnace. 

```
                    u(x)             Δu
             +--------------------+-------+
             |                    |       |
             |                    |  ΔA_2 |
        v(x) |      Area =        | = vΔu |
             |      u(x)·v(x)     |       |
             |                    |       |
             +--------------------+-------+
         Δv  |     ΔA_1 = uΔv     | ΔA_3  |
             +--------------------+-------+
```

Let:
- $u(x)$ be the horizontal length of the plate.
- $v(x)$ be the vertical width of the plate.
- $A(x) = u(x) \cdot v(x)$ be the total surface area.

Suppose the control parameter $x$ increases by a small step $h = \Delta x$. As a consequence:
- The length grows from $u$ to $u + \Delta u$.
- The width grows from $v$ to $v + \Delta v$.

The new expanded area is:

$$A_{\text{new}} = (u + \Delta u)(v + \Delta v) = u \cdot v + u \cdot \Delta v + v \cdot \Delta u + \Delta u \cdot \Delta v$$

The net change in area $\Delta A = A_{\text{new}} - A_{\text{initial}}$ consists of three distinct geometric sub-regions:

$$\Delta A = \underbrace{u \cdot \Delta v}_{\text{bottom strip}} + \underbrace{v \cdot \Delta u}_{\text{side strip}} + \underbrace{\Delta u \cdot \Delta v}_{\text{corner patch}}$$

Now divide the entire equation by the step $\Delta x$:

$$\frac{\Delta A}{\Delta x} = u \frac{\Delta v}{\Delta x} + v \frac{\Delta u}{\Delta x} + \Delta u \frac{\Delta v}{\Delta x}$$

Take the limit as $\Delta x \to 0$:
1. $\lim_{\Delta x \to 0} \frac{\Delta v}{\Delta x} = v' = \frac{dv}{dx}$ (the rate of change of width).
2. $\lim_{\Delta x \to 0} \frac{\Delta u}{\Delta x} = u' = \frac{du}{dx}$ (the rate of change of length).
3. Because $u(x)$ is differentiable (and therefore continuous), as $\Delta x \to 0$, the change $\Delta u \to 0$.
4. Look at the tiny corner patch: $\lim_{\Delta x \to 0} \left(\Delta u \frac{\Delta v}{\Delta x}\right) = 0 \cdot v' = 0$.

The corner patch vanishes completely in the limit! We are left with the exact, inviolable **Product Rule**:

$$\frac{d}{dx}[u(x) \cdot v(x)] = u(x) \frac{dv}{dx} + v(x) \frac{du}{dx} = u v' + v u'$$

In words: *"The derivative of a product is the first function times the derivative of the second, plus the second function times the derivative of the first."*

### Verification on $f(x) = x \cdot x$:
$$f'(x) = x \frac{d}{dx}[x] + x \frac{d}{dx}[x] = x(1) + x(1) = 2x$$
The formula delivers the exact truth.

---

## 6.3 The Extended Product Rule for Multiple Factors

What if a system depends on the simultaneous product of three or more interacting subsystems?
For example, in aerodynamics, aerodynamic drag force is modeled as:

$$F_{\text{drag}} = \frac{1}{2} \cdot \rho(h) \cdot v^2(t) \cdot C_D(\alpha)$$

where air density $\rho$, velocity $v$, and drag coefficient $C_D$ all vary dynamically.

For three functions $u(x), v(x), w(x)$, group the first two together: $[u \cdot v] \cdot w$.
Apply the standard product rule:

$$\frac{d}{dx}[(u v) w] = (u v) \frac{dw}{dx} + w \frac{d}{dx}[u v]$$
$$= u v w' + w (u v' + v u') = u v w' + u v' w + u' v w$$

Rearranging symmetrically:

$$\frac{d}{dx}[u \cdot v \cdot w] = u' v w + u v' w + u v w'$$

Each function takes a turn being differentiated while all other factors remain untouched. This pattern extends by mathematical induction to any finite product of $n$ functions:

$$\frac{d}{dx}\left[\prod_{k=1}^n f_k(x)\right] = \sum_{k=1}^n \left( f_k'(x) \prod_{j \neq k} f_j(x) \right)$$

---

## 6.4 The Quotient Rule: Division of Competing Rates

Now consider a ratio of two differentiable functions:

$$f(x) = \frac{u(x)}{v(x)} \quad (\text{where } v(x) \neq 0)$$

### First Principles Limit Derivation
Construct the difference quotient directly:

$$\frac{f(x+h) - f(x)}{h} = \frac{\frac{u(x+h)}{v(x+h)} - \frac{u(x)}{v(x)}}{h}$$

Place the numerator fractions over a common denominator $v(x+h) v(x)$:

$$= \frac{u(x+h) v(x) - u(x) v(x+h)}{h \cdot v(x+h) v(x)}$$

Now perform the classic mathematical technique of adding and subtracting the cross-term $u(x) v(x)$ inside the numerator:

$$= \frac{[u(x+h) v(x) - u(x) v(x)] - [u(x) v(x+h) - u(x) v(x)]}{h \cdot v(x+h) v(x)}$$

Factor $v(x)$ from the first group and $u(x)$ from the second group:

$$= \frac{v(x) [u(x+h) - u(x)] - u(x) [v(x+h) - v(x)]}{h \cdot v(x+h) v(x)}$$

Distribute the division by $h$:

$$= \frac{v(x) \left(\frac{u(x+h) - u(x)}{h}\right) - u(x) \left(\frac{v(x+h) - v(x)}{h}\right)}{v(x+h) v(x)}$$

Now take the limit as $h \to 0$:
- $\lim_{h \to 0} \frac{u(x+h) - u(x)}{h} = u'(x)$
- $\lim_{h \to 0} \frac{v(x+h) - v(x)}{h} = v'(x)$
- By continuity of $v$, $\lim_{h \to 0} v(x+h) = v(x)$, so the denominator becomes $v(x) \cdot v(x) = [v(x)]^2$.

We arrive at the universal **Quotient Rule**:

$$\frac{d}{dx}\left[\frac{u(x)}{v(x)}\right] = \frac{v(x) u'(x) - u(x) v'(x)}{[v(x)]^2} = \frac{v u' - u v'}{v^2}$$

### The Universal Caution: The Negative Sign
Because addition is commutative, in the product rule $u v' + v u' = v u' + u v'$. Order does not matter.
**In the quotient rule, order is vital.** Subtraction is not commutative:

$$v u' - u v' \neq u v' - v u'$$

Always begin with the denominator multiplying the derivative of the numerator:
$$\mathbf{\frac{(\text{Denominator}) \cdot (\text{Numerator})' - (\text{Numerator}) \cdot (\text{Denominator})'}{(\text{Denominator})^2}}$$

---

## 6.5 Ten Progressive Worked Numerical Examples

### Example 6.1: Differentiating a Product of Two Polynomials
**Problem:** Differentiate $f(x) = (2x^2 - 3)(4x^3 + 5x)$.

**Step 1:** Identify $u(x)$ and $v(x)$:
- $u(x) = 2x^2 - 3 \implies u'(x) = 4x$
- $v(x) = 4x^3 + 5x \implies v'(x) = 12x^2 + 5$

**Step 2:** Apply the product rule:
$$f'(x) = u(x) v'(x) + v(x) u'(x)$$
$$f'(x) = (2x^2 - 3)(12x^2 + 5) + (4x^3 + 5x)(4x)$$

**Step 3:** Expand each product:
$$(2x^2 - 3)(12x^2 + 5) = 24x^4 + 10x^2 - 36x^2 - 15 = 24x^4 - 26x^2 - 15$$
$$(4x^3 + 5x)(4x) = 16x^4 + 20x^2$$

**Step 4:** Combine like terms:
$$f'(x) = (24x^4 - 26x^2 - 15) + (16x^4 + 20x^2) = 40x^4 - 6x^2 - 15$$

**Step 5:** Verification via direct expansion:
$$f(x) = (2x^2 - 3)(4x^3 + 5x) = 8x^5 + 10x^3 - 12x^3 - 15x = 8x^5 - 2x^3 - 15x$$
$$\frac{d}{dx}[8x^5 - 2x^3 - 15x] = 40x^4 - 6x^2 - 15$$
Both methods match identically.

---

### Example 6.2: Product Rule with Radical Factor
**Problem:** Differentiate $g(x) = \sqrt{x}(3x^2 - 8x + 2)$ for $x > 0$.

**Step 1:** Express radicals in power notation:
- $u(x) = x^{1/2} \implies u'(x) = \frac{1}{2}x^{-1/2} = \frac{1}{2\sqrt{x}}$
- $v(x) = 3x^2 - 8x + 2 \implies v'(x) = 6x - 8$

**Step 2:** Apply the product rule:
$$g'(x) = u \cdot v' + v \cdot u' = x^{1/2}(6x - 8) + (3x^2 - 8x + 2)\left(\frac{1}{2}x^{-1/2}\right)$$

**Step 3:** Distribute powers:
$$x^{1/2}(6x - 8) = 6x^{3/2} - 8x^{1/2}$$
$$(3x^2 - 8x + 2)\left(\frac{1}{2}x^{-1/2}\right) = \frac{3}{2}x^{3/2} - 4x^{1/2} + x^{-1/2}$$

**Step 4:** Collect like fractional powers:
$$g'(x) = \left(6 + \frac{3}{2}\right)x^{3/2} + (-8 - 4)x^{1/2} + x^{-1/2} = \frac{15}{2}x^{3/2} - 12x^{1/2} + \frac{1}{\sqrt{x}}$$

---

### Example 6.3: Quotient Rule on a Rational Function
**Problem:** Differentiate $y = \frac{3x - 5}{2x + 7}$ for $x \neq -7/2$.

**Step 1:** Identify numerator and denominator:
- Numerator $u = 3x - 5 \implies u' = 3$
- Denominator $v = 2x + 7 \implies v' = 2$

**Step 2:** Set up the quotient rule formula:
$$\frac{dy}{dx} = \frac{v u' - u v'}{v^2} = \frac{(2x + 7)(3) - (3x - 5)(2)}{(2x + 7)^2}$$

**Step 3:** Expand the numerator carefully:
$$(2x + 7)(3) = 6x + 21$$
$$(3x - 5)(2) = 6x - 10$$
$$(6x + 21) - (6x - 10) = 6x + 21 - 6x + 10 = 31$$

**Step 4:** Write the simplified derivative:
$$\frac{dy}{dx} = \frac{31}{(2x + 7)^2}$$

Notice that the numerator simplified to a constant, and because the denominator is squared, the derivative is strictly positive for all $x \neq -7/2$. The curve is strictly increasing throughout its domain.

---

### Example 6.4: Rational Function with Quadratic Numerator
**Problem:** Differentiate $f(x) = \frac{x^2 + 4x - 5}{x - 3}$ for $x \neq 3$.

**Step 1:** Define terms:
- $u = x^2 + 4x - 5 \implies u' = 2x + 4$
- $v = x - 3 \implies v' = 1$

**Step 2:** Apply quotient rule:
$$f'(x) = \frac{(x - 3)(2x + 4) - (x^2 + 4x - 5)(1)}{(x - 3)^2}$$

**Step 3:** Expand and simplify the numerator:
$$(x - 3)(2x + 4) = 2x^2 + 4x - 6x - 12 = 2x^2 - 2x - 12$$
$$(x^2 + 4x - 5)(1) = x^2 + 4x - 5$$
$$\text{Numerator} = (2x^2 - 2x - 12) - (x^2 + 4x - 5) = 2x^2 - 2x - 12 - x^2 - 4x + 5$$
$$= x^2 - 6x - 7$$

**Step 4:** Write the derivative:
$$f'(x) = \frac{x^2 - 6x - 7}{(x - 3)^2} = \frac{(x - 7)(x + 1)}{(x - 3)^2}$$

---

### Example 6.5: Dynamic Electrical Power in an AC Subsystem
**Problem:** In an electrical circuit, the time-varying voltage across a load is $V(t) = 120 + 10t$ volts, and the time-varying current is $I(t) = 5 - 0.2t$ amperes. Compute the instantaneous rate of change of power dissipation $\frac{dP}{dt}$ at $t = 10$ seconds.

**Step 1:** Power is the product of voltage and current: $P(t) = V(t) \cdot I(t)$.
By the product rule:
$$\frac{dP}{dt} = V(t) \frac{dI}{dt} + I(t) \frac{dV}{dt}$$

**Step 2:** Compute individual derivatives:
$$\frac{dV}{dt} = \frac{d}{dt}[120 + 10t] = 10\text{ V/s}$$
$$\frac{dI}{dt} = \frac{d}{dt}[5 - 0.2t] = -0.2\text{ A/s}$$

**Step 3:** Evaluate state at $t = 10$ seconds:
$$V(10) = 120 + 10(10) = 120 + 100 = 220\text{ V}$$
$$I(10) = 5 - 0.2(10) = 5 - 2 = 3\text{ A}$$

**Step 4:** Substitute into the product rule:
$$\left.\frac{dP}{dt}\right|_{t=10} = (220\text{ V})(-0.2\text{ A/s}) + (3\text{ A})(10\text{ V/s})$$
$$\frac{dP}{dt} = -44\text{ W/s} + 30\text{ W/s} = -14\text{ W/s}$$

**Conclusion:** At $t = 10\text{ s}$, despite voltage rising at $+10\text{ V/s}$, the declining current causes total power dissipation to decrease at $-14\text{ W/s}$.

---

### Example 6.6: Extended Product Rule for Three Monomial Factors
**Problem:** Differentiate $f(x) = (x - 1)(x + 2)(2x - 3)$ using the 3-term product rule.

**Step 1:** Identify components:
- $u = x - 1 \implies u' = 1$
- $v = x + 2 \implies v' = 1$
- $w = 2x - 3 \implies w' = 2$

**Step 2:** Apply formula $f'(x) = u' v w + u v' w + u v w'$:
$$f'(x) = (1)(x + 2)(2x - 3) + (x - 1)(1)(2x - 3) + (x - 1)(x + 2)(2)$$

**Step 3:** Expand each term:
- Term 1: $(x + 2)(2x - 3) = 2x^2 - 3x + 4x - 6 = 2x^2 + x - 6$
- Term 2: $(x - 1)(2x - 3) = 2x^2 - 3x - 2x + 3 = 2x^2 - 5x + 3$
- Term 3: $2(x - 1)(x + 2) = 2(x^2 + x - 2) = 2x^2 + 2x - 4$

**Step 4:** Sum the three quadratic expressions:
$$f'(x) = (2x^2 + x - 6) + (2x^2 - 5x + 3) + (2x^2 + 2x - 4)$$
$$f'(x) = (2 + 2 + 2)x^2 + (1 - 5 + 2)x + (-6 + 3 - 4) = 6x^2 - 2x - 7$$

---

### Example 6.7: Locating Horizontal Tangent Coordinates on a Rational Curve
**Problem:** Find all points on the graph of $y = \frac{x}{x^2 + 4}$ where the tangent line is horizontal.

**Step 1:** A horizontal tangent occurs when $\frac{dy}{dx} = 0$.

**Step 2:** Differentiate using the quotient rule:
- Numerator $u = x \implies u' = 1$
- Denominator $v = x^2 + 4 \implies v' = 2x$

$$\frac{dy}{dx} = \frac{(x^2 + 4)(1) - (x)(2x)}{(x^2 + 4)^2} = \frac{x^2 + 4 - 2x^2}{(x^2 + 4)^2} = \frac{4 - x^2}{(x^2 + 4)^2}$$

**Step 3:** A fraction equals zero if and only if its numerator is zero (and denominator is non-zero):
$$4 - x^2 = 0 \implies x^2 = 4 \implies x = \pm 2$$
(Note that $(x^2 + 4)^2 \ge 16 > 0$ for all real $x$, so no division by zero occurs).

**Step 4:** Calculate $y$-values:
- At $x = 2$: $y(2) = \frac{2}{2^2 + 4} = \frac{2}{4 + 4} = \frac{2}{8} = \frac{1}{4} = 0.25$.
- At $x = -2$: $y(-2) = \frac{-2}{(-2)^2 + 4} = \frac{-2}{4 + 4} = -\frac{2}{8} = -\frac{1}{4} = -0.25$.

**Conclusion:** Horizontal tangents occur at $(2, 0.25)$ (a local maximum) and $(-2, -0.25)$ (a local minimum).

---

### Example 6.8: Normal Line to a Rational Hyperbola
**Problem:** Find the equation of the normal line to the curve $y = \frac{2x}{x + 1}$ at the point $(1, 1)$.

**Step 1:** Verify the contact point:
$$y(1) = \frac{2(1)}{1 + 1} = \frac{2}{2} = 1 \implies P(1, 1)$$

**Step 2:** Compute $\frac{dy}{dx}$ via quotient rule:
$$\frac{dy}{dx} = \frac{(x + 1)\frac{d}{dx}[2x] - (2x)\frac{d}{dx}[x + 1]}{(x + 1)^2} = \frac{(x + 1)(2) - (2x)(1)}{(x + 1)^2} = \frac{2x + 2 - 2x}{(x + 1)^2} = \frac{2}{(x + 1)^2}$$

**Step 3:** Evaluate tangent slope at $x = 1$:
$$m_{\text{tan}} = \frac{2}{(1 + 1)^2} = \frac{2}{2^2} = \frac{2}{4} = \frac{1}{2}$$

**Step 4:** Determine normal slope:
$$m_{\text{norm}} = -\frac{1}{m_{\text{tan}}} = -\frac{1}{1/2} = -2$$

**Step 5:** Write normal line equation:
$$y - 1 = -2(x - 1) \implies y - 1 = -2x + 2 \implies y = -2x + 3$$
Or in standard form: $2x + y - 3 = 0$.

---

### Example 6.9: Successive Second Derivative of a Rational Function
**Problem:** For $y = \frac{x}{x - 1}$ ($x \neq 1$), find the second derivative $\frac{d^2y}{dx^2}$.

**Step 1:** Compute the first derivative $\frac{dy}{dx}$:
$$\frac{dy}{dx} = \frac{(x - 1)(1) - x(1)}{(x - 1)^2} = \frac{x - 1 - x}{(x - 1)^2} = \frac{-1}{(x - 1)^2} = -(x - 1)^{-2}$$

**Step 2:** Compute the second derivative:
$$\frac{d^2y}{dx^2} = \frac{d}{dx}\left[-(x - 1)^{-2}\right]$$
Using the quotient rule on $\frac{-1}{(x - 1)^2}$:
- Numerator $u = -1 \implies u' = 0$
- Denominator $v = (x - 1)^2 = x^2 - 2x + 1 \implies v' = 2x - 2 = 2(x - 1)$

$$\frac{d^2y}{dx^2} = \frac{(x - 1)^2(0) - (-1)[2(x - 1)]}{[(x - 1)^2]^2} = \frac{2(x - 1)}{(x - 1)^4}$$

**Step 3:** Cancel the common factor $(x - 1)$:
$$\frac{d^2y}{dx^2} = \frac{2}{(x - 1)^3}$$

---

### Example 6.10: Rate of Change of Drone Thrust-to-Weight Ratio
**Problem:** A quadcopter drone with variable payload burns fuel during high-altitude climb. Its thrust in newtons is $T(t) = 40 + 2t$, and its total mass in kilograms is $M(t) = 4 - 0.05t$. Calculate the rate of change of the thrust-to-mass ratio $R(t) = \frac{T(t)}{M(t)}$ at $t = 20$ seconds.

**Step 1:** Apply quotient rule to $R(t) = \frac{T(t)}{M(t)}$:
$$R'(t) = \frac{M(t) T'(t) - T(t) M'(t)}{[M(t)]^2}$$

**Step 2:** Compute derivatives:
$$T'(t) = 2\text{ N/s}$$
$$M'(t) = -0.05\text{ kg/s}$$

**Step 3:** Evaluate state at $t = 20\text{ s}$:
$$T(20) = 40 + 2(20) = 80\text{ N}$$
$$M(20) = 4 - 0.05(20) = 4 - 1.0 = 3\text{ kg}$$

**Step 4:** Calculate $R'(20)$:
$$R'(20) = \frac{3(2) - (80)(-0.05)}{3^2} = \frac{6 - (-4.0)}{9} = \frac{6 + 4}{9} = \frac{10}{9} \approx 1.111\text{ N/(kg}\cdot\text{s)}$$

**Conclusion:** At $t = 20\text{ s}$, the thrust-to-mass ratio is accelerating upward at $\frac{10}{9} \approx 1.111\text{ (m/s}^2)/\text{s}$.

---

## 6.6 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Direct Product Rule Applications
- **Exercise 6.1:** Differentiate $f(x) = (3x - 4)(5x + 2)$ using the product rule.
- **Exercise 6.2:** Differentiate $g(x) = (x^2 + 1)(2x^3 - 4x)$.

### Tier 2: Direct Quotient Rule Applications
- **Exercise 6.3:** Differentiate $y = \frac{4x + 1}{3x - 2}$ for $x \neq 2/3$.
- **Exercise 6.4:** Differentiate $f(t) = \frac{t^2}{2t + 5}$.

### Tier 3: Radicals and Negative Powers with Products & Quotients
- **Exercise 6.5:** Differentiate $h(x) = \frac{\sqrt{x}}{x^2 + 1}$ for $x > 0$.
- **Exercise 6.6:** Differentiate $y = (x^3 - 2x)(x^{-2} + 4)$.

### Tier 4: Geometric Applications & Tangent Geometry
- **Exercise 6.7:** Find the equation of the line tangent to $y = \frac{x - 1}{x + 1}$ at $x = 3$.
- **Exercise 6.8:** Find all points on the curve $y = \frac{x^2}{x - 2}$ where the tangent line is horizontal.

### Tier 5: Multi-Factor Products & Kinematics Modeling
- **Exercise 6.9:** Differentiate $P(x) = (x + 1)(x + 2)(x + 3)$ using the 3-factor product rule.
- **Exercise 6.10:** In a communications satellite, signal power to noise ratio is $S(t) = \frac{100 - t}{t^2 + 4}$ for $t \ge 0$. Find the exact rate of change $S'(t)$ at $t = 6$ seconds.

---

## 6.7 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 6.1
Differentiate $f(x) = (3x - 4)(5x + 2)$.
1. $u = 3x - 4 \implies u' = 3$.
2. $v = 5x + 2 \implies v' = 5$.
3. Product rule:
$$f'(x) = u v' + v u' = (3x - 4)(5) + (5x + 2)(3)$$
$$f'(x) = (15x - 20) + (15x + 6) = 30x - 14$$
**Final Answer:** $f'(x) = 30x - 14$.

---

### Solution to Exercise 6.2
Differentiate $g(x) = (x^2 + 1)(2x^3 - 4x)$.
1. $u = x^2 + 1 \implies u' = 2x$.
2. $v = 2x^3 - 4x \implies v' = 6x^2 - 4$.
3. Product rule:
$$g'(x) = (x^2 + 1)(6x^2 - 4) + (2x^3 - 4x)(2x)$$
$$= (6x^4 - 4x^2 + 6x^2 - 4) + (4x^4 - 8x^2)$$
$$= (6x^4 + 2x^2 - 4) + (4x^4 - 8x^2) = 10x^4 - 6x^2 - 4$$
**Final Answer:** $g'(x) = 10x^4 - 6x^2 - 4$.

---

### Solution to Exercise 6.3
Differentiate $y = \frac{4x + 1}{3x - 2}$.
1. $u = 4x + 1 \implies u' = 4$.
2. $v = 3x - 2 \implies v' = 3$.
3. Quotient rule:
$$\frac{dy}{dx} = \frac{(3x - 2)(4) - (4x + 1)(3)}{(3x - 2)^2}$$
$$= \frac{12x - 8 - (12x + 3)}{(3x - 2)^2} = \frac{12x - 8 - 12x - 3}{(3x - 2)^2} = \frac{-11}{(3x - 2)^2}$$
**Final Answer:** $\frac{dy}{dx} = -\frac{11}{(3x - 2)^2}$.

---

### Solution to Exercise 6.4
Differentiate $f(t) = \frac{t^2}{2t + 5}$.
1. $u = t^2 \implies u' = 2t$.
2. $v = 2t + 5 \implies v' = 2$.
3. Quotient rule:
$$f'(t) = \frac{(2t + 5)(2t) - (t^2)(2)}{(2t + 5)^2} = \frac{4t^2 + 10t - 2t^2}{(2t + 5)^2} = \frac{2t^2 + 10t}{(2t + 5)^2} = \frac{2t(t + 5)}{(2t + 5)^2}$$
**Final Answer:** $f'(t) = \frac{2t(t + 5)}{(2t + 5)^2}$.

---

### Solution to Exercise 6.5
Differentiate $h(x) = \frac{\sqrt{x}}{x^2 + 1}$.
1. $u = x^{1/2} \implies u' = \frac{1}{2}x^{-1/2} = \frac{1}{2\sqrt{x}}$.
2. $v = x^2 + 1 \implies v' = 2x$.
3. Quotient rule:
$$h'(x) = \frac{(x^2 + 1)\left(\frac{1}{2\sqrt{x}}\right) - \sqrt{x}(2x)}{(x^2 + 1)^2}$$
Multiply numerator and denominator by $2\sqrt{x}$:
$$h'(x) = \frac{(x^2 + 1) - 2x \cdot (2x)}{2\sqrt{x}(x^2 + 1)^2} = \frac{x^2 + 1 - 4x^2}{2\sqrt{x}(x^2 + 1)^2} = \frac{1 - 3x^2}{2\sqrt{x}(x^2 + 1)^2}$$
**Final Answer:** $h'(x) = \frac{1 - 3x^2}{2\sqrt{x}(x^2 + 1)^2}$.

---

### Solution to Exercise 6.6
Differentiate $y = (x^3 - 2x)(x^{-2} + 4)$.
1. Expand before differentiating (or use product rule):
$$y = x^3(x^{-2}) + 4x^3 - 2x(x^{-2}) - 8x = x + 4x^3 - 2x^{-1} - 8x = 4x^3 - 7x - 2x^{-1}$$
2. Differentiate term by term:
$$\frac{dy}{dx} = 12x^2 - 7 - 2(-1x^{-2}) = 12x^2 - 7 + \frac{2}{x^2}$$
**Final Answer:** $\frac{dy}{dx} = 12x^2 - 7 + \frac{2}{x^2}$.

---

### Solution to Exercise 6.7
Find tangent line to $y = \frac{x - 1}{x + 1}$ at $x = 3$.
1. Contact point: $y(3) = \frac{3 - 1}{3 + 1} = \frac{2}{4} = \frac{1}{2} \implies P(3, 0.5)$.
2. Derivative via quotient rule:
$$\frac{dy}{dx} = \frac{(x + 1)(1) - (x - 1)(1)}{(x + 1)^2} = \frac{x + 1 - x + 1}{(x + 1)^2} = \frac{2}{(x + 1)^2}$$
3. Slope at $x = 3$:
$$m = \frac{2}{(3 + 1)^2} = \frac{2}{16} = \frac{1}{8}$$
4. Tangent line:
$$y - \frac{1}{2} = \frac{1}{8}(x - 3) \implies y = \frac{1}{8}x - \frac{3}{8} + \frac{4}{8} \implies y = \frac{1}{8}x + \frac{1}{8}$$
Or in standard form: $x - 8y + 1 = 0$.
**Final Answer:** $y = \frac{1}{8}x + \frac{1}{8}$ (or $x - 8y + 1 = 0$).

---

### Solution to Exercise 6.8
Find horizontal tangents for $y = \frac{x^2}{x - 2}$ ($x \neq 2$).
1. Compute $\frac{dy}{dx}$:
$$\frac{dy}{dx} = \frac{(x - 2)(2x) - (x^2)(1)}{(x - 2)^2} = \frac{2x^2 - 4x - x^2}{(x - 2)^2} = \frac{x^2 - 4x}{(x - 2)^2} = \frac{x(x - 4)}{(x - 2)^2}$$
2. Set $\frac{dy}{dx} = 0 \implies x(x - 4) = 0 \implies x = 0$ or $x = 4$.
3. Compute coordinates:
- At $x = 0$: $y(0) = \frac{0}{-2} = 0 \implies (0, 0)$.
- At $x = 4$: $y(4) = \frac{4^2}{4 - 2} = \frac{16}{2} = 8 \implies (4, 8)$.
**Final Answer:** $(0, 0)$ and $(4, 8)$.

---

### Solution to Exercise 6.9
Differentiate $P(x) = (x + 1)(x + 2)(x + 3)$.
1. Identify components: $u = x+1 (u'=1)$, $v = x+2 (v'=1)$, $w = x+3 (w'=1)$.
2. Apply formula:
$$P'(x) = (1)(x+2)(x+3) + (x+1)(1)(x+3) + (x+1)(x+2)(1)$$
3. Expand:
$$(x^2 + 5x + 6) + (x^2 + 4x + 3) + (x^2 + 3x + 2) = 3x^2 + 12x + 11$$
**Final Answer:** $P'(x) = 3x^2 + 12x + 11$.

---

### Solution to Exercise 6.10
Evaluate $S'(6)$ for $S(t) = \frac{100 - t}{t^2 + 4}$.
1. Apply quotient rule:
- $u = 100 - t \implies u' = -1$
- $v = t^2 + 4 \implies v' = 2t$
$$S'(t) = \frac{(t^2 + 4)(-1) - (100 - t)(2t)}{(t^2 + 4)^2} = \frac{-t^2 - 4 - 200t + 2t^2}{(t^2 + 4)^2} = \frac{t^2 - 200t - 4}{(t^2 + 4)^2}$$
2. Substitute $t = 6$:
- Numerator: $6^2 - 200(6) - 4 = 36 - 1200 - 4 = -1168$.
- Denominator: $(6^2 + 4)^2 = (36 + 4)^2 = 40^2 = 1600$.
$$S'(6) = \frac{-1168}{1600} = -\frac{73}{100} = -0.73$$
**Final Answer:** $S'(6) = -0.73$.
