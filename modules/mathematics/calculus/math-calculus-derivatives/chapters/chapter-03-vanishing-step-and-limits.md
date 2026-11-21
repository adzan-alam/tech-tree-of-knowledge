# Chapter 3: The Vanishing Step — Limits, Infinitesimals, and the Tangent Line

> *"To calculate the instantaneous is not to halt time at a frozen point where all motion vanishes, but to decipher the precise destination toward which an unbroken sequence of finite measurements converges as the observational window contracts to nothingness."*

---

## 3.1 The Geometric Enigma: From Secant to Tangent

In Chapter 2, we examined secant lines cutting across arbitrary curves. For any smooth function $y = f(x)$, choosing two distinct points $P = (x_0, f(x_0))$ and $Q = (x_0 + h, f(x_0 + h))$ yielded the exact slope of the secant chord spanning between them:

$$m_{\text{sec}} = \frac{\Delta y}{\Delta x} = \frac{f(x_0 + h) - f(x_0)}{h}$$

Geometrically, a secant chord connects two distinct spatial locations. If you place a transparent straightedge across $P$ and $Q$ on a sheet of graph paper, the ruler slices right through the curve, crossing it at two separated points. 

Now perform an experiment in your mind or on a physical drafting board. Keep the anchor point $P$ firmly pinned in place at $x_0$. Gradually drag the wandering point $Q$ along the contour of the curve closer and closer to $P$. This means making the offset distance $h$ smaller and smaller:

$$h = 1.0 \longrightarrow 0.1 \longrightarrow 0.01 \longrightarrow 0.001 \longrightarrow 0.00001$$

Observe what happens to the straightedge:
1. As $Q$ slides toward $P$, the two intersection points merge together.
2. The secant line pivots around the pinned anchor point $P$.
3. With every shrinking step of $h$, the straightedge aligns more faithfully with the contour of the curve right around $P$.
4. In the extreme threshold of closeness, the line stops cutting across the curve like an intersecting chord and instead grazes against the curve at that single point, matching its direction and inclination.

This grazing line is the **tangent line** to the curve at $P$.

```
         y ^                                  . Q_1 (h = 1.0)
           |                               .'
           |                           _.-'  . Q_2 (h = 0.3)
           |                       _.-'   .-'
           |                   _.-'    .-' . Q_3 (h = 0.05)
           |               _.-'     .-'  .'
           |         P _.-'     _.-'  .-' 
           |         *=======--'---.-'--------> Tangent Line (h -> 0)
           |        /  '-._  .'
           |       /       ''
           |      /
           +------------------------------------> x
                 x_0     x_0+h
```

Yet right here lies the classic mathematical trap that troubled thinkers for two thousand years:
- If $h \neq 0$, no matter how tiny ($h = 10^{-12}$), the line is still technically a secant chord cutting across two distinct points separated by a picometer.
- If we stubbornly declare $h = 0$, both points coincide exactly: $Q = P$. The formula becomes:

$$m = \frac{f(x_0 + 0) - f(x_0)}{0} = \frac{f(x_0) - f(x_0)}{0} = \frac{0}{0}$$

At $h = 0$, the ratio collapses into the indeterminate form $0/0$. In arithmetic, dividing zero by zero is meaningless because any number multiplied by zero equals zero; the expression specifies no single value.

The breakthrough of calculus is the concept of the **limit**. We do not set $h = 0$. Instead, we investigate what value the ratio $\frac{f(x_0 + h) - f(x_0)}{h}$ relentlessly approaches as $h$ draws arbitrarily close to zero without ever needing to become zero.

---

## 3.2 What is a Limit? Intuition Before Formalism

Consider a modern automated drone navigating down a wind tunnel toward a landing pad located at coordinate $x = 2$ meters. The onboard computer calculates an aerodynamic thrust coefficient $C(x)$ modeled by:

$$C(x) = \frac{x^2 - 4}{x - 2}$$

If the sensor evaluates $C(2)$ directly, it attempts to compute:

$$C(2) = \frac{2^2 - 4}{2 - 2} = \frac{4 - 4}{0} = \frac{0}{0}$$

A naive processor would throw a hardware division-by-zero interrupt and crash. But examine the numerical values of $C(x)$ as the drone approaches $x = 2$ from both sides:

| Approaching from the Left ($x < 2$) | $C(x) = \frac{x^2 - 4}{x - 2}$ | Approaching from the Right ($x > 2$) | $C(x) = \frac{x^2 - 4}{x - 2}$ |
| :--- | :--- | :--- | :--- |
| $x = 1.9$ | $\frac{3.61 - 4}{-0.1} = \frac{-0.39}{-0.1} = 3.9$ | $x = 2.1$ | $\frac{4.41 - 4}{0.1} = \frac{0.41}{0.1} = 4.1$ |
| $x = 1.99$ | $\frac{3.9601 - 4}{-0.01} = \frac{-0.0399}{-0.01} = 3.99$ | $x = 2.01$ | $\frac{4.0401 - 4}{0.01} = \frac{0.0401}{0.01} = 4.01$ |
| $x = 1.999$ | $\frac{3.996001 - 4}{-0.001} = 3.999$ | $x = 2.001$ | $\frac{4.004001 - 4}{0.001} = 4.001$ |
| $x = 1.999999$ | $3.999999$ | $x = 2.000001$ | $4.000001$ |

Look at the progression:
As $x$ creeps toward $2$ from below ($1.9, 1.99, 1.999 \dots$), $C(x)$ rises toward $4.0$.
As $x$ creeps toward $2$ from above ($2.1, 2.01, 2.001 \dots$), $C(x)$ descends toward $4.0$.

There is no doubt what number $C(x)$ is heading toward. Its target destination is unambiguously **$4$**.

Algebra explains why: for any $x \neq 2$, the numerator factors as difference of two squares:

$$x^2 - 4 = (x - 2)(x + 2)$$

Therefore, whenever $x \neq 2$, the factor $(x - 2)$ is a non-zero real number. We are permitted to divide numerator and denominator by that non-zero quantity:

$$\frac{(x - 2)(x + 2)}{x - 2} = x + 2 \quad (\text{valid for all } x \neq 2)$$

The expression $x + 2$ is completely well-behaved at $x = 2$: $2 + 2 = 4$.

We write this behavior using limit notation:

$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = 4$$

In plain English: *"The limit of $\frac{x^2 - 4}{x - 2}$ as $x$ approaches $2$ equals $4$."*

---

## 3.3 One-Sided Limits and the Criteria for Existence

A limit exists at a point $x = c$ if and only if the function approaches the exact same target value whether you walk toward $c$ from the left (values smaller than $c$) or from the right (values larger than $c$).

### Left-Hand Limit
We denote approaching $c$ from numbers strictly less than $c$ with a minus superscript:

$$\lim_{x \to c^-} f(x) = L_1$$

### Right-Hand Limit
We denote approaching $c$ from numbers strictly greater than $c$ with a plus superscript:

$$\lim_{x \to c^+} f(x) = L_2$$

### The Two-Sided Limit Existence Theorem
The standard two-sided limit $\lim_{x \to c} f(x)$ exists and equals $L$ if and only if:

$$\lim_{x \to c^-} f(x) = L \quad \text{and} \quad \lim_{x \to c^+} f(x) = L$$

If the left-hand and right-hand paths lead to different values ($L_1 \neq L_2$), the two-sided limit **does not exist** (often abbreviated DNE).

#### Case 1: The Step Discontinuity (Switch State)
Consider a digital circuit voltage signal defined by the signum (sign) function:

$$V(t) = \frac{|t|}{t} = \begin{cases} -1, & \text{if } t < 0 \\ +1, & \text{if } t > 0 \end{cases}$$

- Approaching $t = 0$ from the left ($t = -0.1, -0.01, -0.001$): $V(t) = -1$. Thus $\lim_{t \to 0^-} V(t) = -1$.
- Approaching $t = 0$ from the right ($t = +0.1, +0.01, +0.001$): $V(t) = +1$. Thus $\lim_{t \to 0^+} V(t) = +1$.
- Since $-1 \neq +1$, $\lim_{t \to 0} \frac{|t|}{t}$ **does not exist**.

#### Case 2: Infinite Oscillation
Consider the high-frequency probe signal $s(x) = \sin(1/x)$ as $x \to 0$. As $x$ gets smaller, $1/x$ explodes toward infinity. The sine function oscillates between $-1$ and $+1$ infinitely many times inside every open neighborhood around $0$. Because the value never settles onto any single target number, $\lim_{x \to 0} \sin(1/x)$ **does not exist**.

---

## 3.4 Fundamental Limit Laws

When individual limits exist, they behave with algebraic regularity. If $\lim_{x \to c} f(x) = A$ and $\lim_{x \to c} g(x) = B$ where $A, B \in \mathbb{R}$:

1. **Sum Rule:** $\lim_{x \to c} [f(x) + g(x)] = A + B$
2. **Difference Rule:** $\lim_{x \to c} [f(x) - g(x)] = A - B$
3. **Constant Multiple Rule:** $\lim_{x \to c} [k \cdot f(x)] = k \cdot A$ for any constant $k$
4. **Product Rule:** $\lim_{x \to c} [f(x) \cdot g(x)] = A \cdot B$
5. **Quotient Rule:** $\lim_{x \to c} \left[\frac{f(x)}{g(x)}\right] = \frac{A}{B}$, provided the denominator limit $B \neq 0$
6. **Power Rule:** $\lim_{x \to c} [f(x)]^n = A^n$ for positive integers $n$
7. **Root Rule:** $\lim_{x \to c} \sqrt[n]{f(x)} = \sqrt[n]{A}$ (with $A > 0$ if $n$ is even)

These laws mean that for any continuous elementary expression (polynomials, rational expressions where denominator is non-zero, exponentials, standard trig functions in their domains), you find the limit by **direct substitution**:

$$\lim_{x \to 3} (2x^2 - 5x + 1) = 2(3)^2 - 5(3) + 1 = 18 - 15 + 1 = 4$$

The entire challenge of calculus arises when direct substitution produces the indeterminate form $\mathbf{0/0}$. That indicates that both numerator and denominator share a vanishing factor that must be systematically unmasked and eliminated.

---

## 3.5 Algebraic Strategies to Resolve $\frac{0}{0}$ Forms

When substitution yields $0/0$, three primary algebraic strategies dissolve the impasse:

### Strategy 1: Factorization and Cancellation
When both numerator and denominator are polynomials with roots at $x = c$, the factor theorem guarantees that $(x - c)$ divides both polynomials evenly. Factor out $(x - c)$ and cancel it:

$$\lim_{x \to c} \frac{P(x)}{Q(x)} = \lim_{x \to c} \frac{(x - c) \cdot \tilde{P}(x)}{(x - c) \cdot \tilde{Q}(x)} = \lim_{x \to c} \frac{\tilde{P}(x)}{\tilde{Q}(x)} = \frac{\tilde{P}(c)}{\tilde{Q}(c)}$$

### Strategy 2: Conjugate Multiplication (Rationalization)
When expressions involve square roots like $\sqrt{A} - \sqrt{B}$, direct substitution often yields $\sqrt{A} - \sqrt{A} = 0$. Multiply numerator and denominator by the conjugate pair $(\sqrt{A} + \sqrt{B})$ using the identity $(u - v)(u + v) = u^2 - v^2$:

$$\frac{\sqrt{u} - \sqrt{v}}{h} \cdot \frac{\sqrt{u} + \sqrt{v}}{\sqrt{u} + \sqrt{v}} = \frac{u - v}{h(\sqrt{u} + \sqrt{v})}$$

The root vanishes from the difference, exposing the hidden factor of $h$ which cancels immediately.

### Strategy 3: Algebraic Fraction Consolidation
When fractions are nested within differences:

$$\frac{\frac{1}{x+h} - \frac{1}{x}}{h}$$

Find the common denominator for the numerator fractions:

$$\frac{1}{x+h} - \frac{1}{x} = \frac{x - (x+h)}{x(x+h)} = \frac{-h}{x(x+h)}$$

Dividing by $h$:

$$\frac{-h}{h \cdot x(x+h)} = \frac{-1}{x(x+h)}$$

Now setting $h \to 0$ causes no division by zero: the limit is simply $-1/x^2$.

---

## 3.6 The Squeeze (Sandwich) Theorem

Suppose a function $g(x)$ is complicated or oscillates erratically, but is strictly trapped between two well-behaved bounding functions $f(x)$ and $h(x)$ for all $x$ in a region near $c$:

$$f(x) \le g(x) \le h(x)$$

If the outer boundaries converge to the exact same value $L$ as $x \to c$:

$$\lim_{x \to c} f(x) = L \quad \text{and} \quad \lim_{x \to c} h(x) = L$$

Then the trapped middle function $g(x)$ has no room to escape. It is squeezed to that exact same limit:

$$\lim_{x \to c} g(x) = L$$

```
         y ^                 h(x)
           |                \   /
           |                 \ /
         L +------------------* <--- g(x) pinched here
           |                 / \
           |                /   \
           |                     f(x)
           +------------------+---------> x
                              c
```

This theorem is essential for evaluating limits involving trigonometric and oscillatory functions, such as proving $\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$ in Chapter 8.

---

## 3.7 Ten Progressive Worked Numerical Examples

### Example 3.1: Polynomial Factoring Over an Indeterminate Point
**Problem:** A robotic arm velocity sensor produces a raw calibration ratio $R(x) = \frac{2x^2 - 7x + 3}{x - 3}$. Evaluate the calibration limit as $x \to 3$.

**Step 1:** Test direct substitution:
$$R(3) = \frac{2(3)^2 - 7(3) + 3}{3 - 3} = \frac{2(9) - 21 + 3}{0} = \frac{18 - 21 + 3}{0} = \frac{0}{0} \quad (\text{Indeterminate})$$

**Step 2:** Factor the quadratic numerator $2x^2 - 7x + 3$.
We search for two numbers that multiply to $a \cdot c = 2 \cdot 3 = 6$ and add to $b = -7$. Those numbers are $-6$ and $-1$:
$$2x^2 - 6x - x + 3 = 2x(x - 3) - 1(x - 3) = (2x - 1)(x - 3)$$

**Step 3:** Rewrite the limit and cancel the common factor $(x - 3)$ for all $x \neq 3$:
$$\lim_{x \to 3} \frac{(2x - 1)(x - 3)}{x - 3} = \lim_{x \to 3} (2x - 1)$$

**Step 4:** Evaluate by direct substitution into the simplified polynomial:
$$\lim_{x \to 3} (2x - 1) = 2(3) - 1 = 6 - 1 = 5$$

**Conclusion:** The calibration limit is exactly $5$.

---

### Example 3.2: First-Principles Difference Quotient Limit for a Quadratic
**Problem:** An electric vehicle battery discharges power according to $P(t) = 3t^2 + 5t$ watts, where $t$ is in seconds. Calculate the instantaneous rate of power increase at $t_0 = 4$ seconds using the vanishing step limit $\lim_{h \to 0} \frac{P(4+h) - P(4)}{h}$.

**Step 1:** Compute $P(4)$:
$$P(4) = 3(4)^2 + 5(4) = 3(16) + 20 = 48 + 20 = 68 \text{ W}$$

**Step 2:** Expand $P(4+h)$:
$$P(4+h) = 3(4+h)^2 + 5(4+h) = 3(16 + 8h + h^2) + 20 + 5h$$
$$P(4+h) = 48 + 24h + 3h^2 + 20 + 5h = 68 + 29h + 3h^2$$

**Step 3:** Form the difference $\Delta P = P(4+h) - P(4)$:
$$\Delta P = (68 + 29h + 3h^2) - 68 = 29h + 3h^2$$

**Step 4:** Construct the difference quotient:
$$\frac{\Delta P}{h} = \frac{29h + 3h^2}{h} = \frac{h(29 + 3h)}{h}$$

**Step 5:** For any $h \neq 0$, cancel $h$:
$$\frac{\Delta P}{h} = 29 + 3h$$

**Step 6:** Take the limit as $h \to 0$:
$$\lim_{h \to 0} (29 + 3h) = 29 + 3(0) = 29 \text{ W/s}$$

**Conclusion:** At $t = 4$ seconds, power output is increasing at an instantaneous rate of $29\text{ W/s}$.

---

### Example 3.3: Radical Limit via Conjugate Rationalization
**Problem:** The fluid velocity through a hydraulic nozzle involves the expression $V(x) = \frac{\sqrt{x + 9} - 3}{x}$. Determine the limiting fluid speed as $x \to 0$.

**Step 1:** Check direct substitution:
$$V(0) = \frac{\sqrt{0 + 9} - 3}{0} = \frac{3 - 3}{0} = \frac{0}{0}$$

**Step 2:** Multiply numerator and denominator by the conjugate pair $(\sqrt{x + 9} + 3)$:
$$\lim_{x \to 0} \frac{\sqrt{x + 9} - 3}{x} \cdot \frac{\sqrt{x + 9} + 3}{\sqrt{x + 9} + 3}$$

**Step 3:** Expand the numerator using the difference of squares identity $(a - b)(a + b) = a^2 - b^2$:
$$(\sqrt{x + 9})^2 - 3^2 = (x + 9) - 9 = x$$

**Step 4:** Substitute back into the limit:
$$\lim_{x \to 0} \frac{x}{x(\sqrt{x + 9} + 3)}$$

**Step 5:** Cancel the non-zero factor $x$:
$$\lim_{x \to 0} \frac{1}{\sqrt{x + 9} + 3}$$

**Step 6:** Evaluate by direct substitution:
$$\frac{1}{\sqrt{0 + 9} + 3} = \frac{1}{3 + 3} = \frac{1}{6}$$

**Conclusion:** The limiting fluid speed is $\frac{1}{6} \approx 0.1667\text{ m/s}$.

---

### Example 3.4: Nested Fraction Simplification
**Problem:** Compute the limit $\lim_{t \to 0} \frac{\frac{1}{5 + t} - \frac{1}{5}}{t}$ representing the rate of change of an electrical admittance.

**Step 1:** Direct substitution yields $\frac{\frac{1}{5} - \frac{1}{5}}{0} = \frac{0}{0}$.

**Step 2:** Combine the fractions in the numerator using a common denominator of $5(5 + t)$:
$$\frac{1}{5 + t} - \frac{1}{5} = \frac{1 \cdot 5 - 1 \cdot (5 + t)}{5(5 + t)} = \frac{5 - 5 - t}{5(5 + t)} = \frac{-t}{5(5 + t)}$$

**Step 3:** Place this back into the overall difference quotient:
$$\frac{\frac{-t}{5(5 + t)}}{t} = \frac{-t}{t \cdot 5(5 + t)}$$

**Step 4:** Cancel the factor $t \neq 0$:
$$\frac{-1}{5(5 + t)}$$

**Step 5:** Evaluate the limit as $t \to 0$:
$$\lim_{t \to 0} \frac{-1}{5(5 + t)} = \frac{-1}{5(5 + 0)} = \frac{-1}{25} = -0.04$$

**Conclusion:** The rate of change is $-0.04$.

---

### Example 3.5: One-Sided Limits and Continuity of a Piecewise Thrust Profile
**Problem:** A sounding rocket booster follows a staged thrust curve $T(t)$ in kilonewtons:
$$T(t) = \begin{cases} 40 - 2t^2, & \text{for } 0 \le t < 3 \\ 5t + 7, & \text{for } t \ge 3 \end{cases}$$
Determine whether the thrust transition at stage separation $t = 3$ seconds is smooth (i.e., whether the two-sided limit $\lim_{t \to 3} T(t)$ exists).

**Step 1:** Evaluate the left-hand limit as $t \to 3^-$ (using the rule for $t < 3$):
$$\lim_{t \to 3^-} T(t) = \lim_{t \to 3^-} (40 - 2t^2) = 40 - 2(3)^2 = 40 - 2(9) = 40 - 18 = 22\text{ kN}$$

**Step 2:** Evaluate the right-hand limit as $t \to 3^+$ (using the rule for $t \ge 3$):
$$\lim_{t \to 3^+} T(t) = \lim_{t \to 3^+} (5t + 7) = 5(3) + 7 = 15 + 7 = 22\text{ kN}$$

**Step 3:** Compare the one-sided limits:
$$\lim_{t \to 3^-} T(t) = 22 = \lim_{t \to 3^+} T(t)$$

**Conclusion:** Because both one-sided limits converge to the exact same value ($22\text{ kN}$), the two-sided limit exists and equals $22\text{ kN}$. The thrust profile is continuous across the stage transition.

---

### Example 3.6: Non-Existent Limit from an Absolute Value Sharp Corner
**Problem:** Evaluate $\lim_{x \to 5} \frac{|x - 5|}{x - 5}$.

**Step 1:** Recall the piecewise definition of absolute value $|u|$:
$$|u| = \begin{cases} u, & \text{if } u \ge 0 \\ -u, & \text{if } u < 0 \end{cases}$$
Here $u = x - 5$.

**Step 2:** Evaluate the left-hand limit ($x \to 5^-$), where $x < 5 \implies x - 5 < 0$:
$$|x - 5| = -(x - 5)$$
$$\lim_{x \to 5^-} \frac{|x - 5|}{x - 5} = \lim_{x \to 5^-} \frac{-(x - 5)}{x - 5} = \lim_{x \to 5^-} (-1) = -1$$

**Step 3:** Evaluate the right-hand limit ($x \to 5^+$), where $x > 5 \implies x - 5 > 0$:
$$|x - 5| = +(x - 5)$$
$$\lim_{x \to 5^+} \frac{|x - 5|}{x - 5} = \lim_{x \to 5^+} \frac{+(x - 5)}{x - 5} = \lim_{x \to 5^+} (+1) = +1$$

**Step 4:** Compare the one-sided limits:
$$\lim_{x \to 5^-} f(x) = -1 \neq +1 = \lim_{x \to 5^+} f(x)$$

**Conclusion:** The two-sided limit does not exist (DNE).

---

### Example 3.7: Application of the Squeeze Theorem to Damped Vibration
**Problem:** An accelerometer measures a transient damping displacement modeled by $y(t) = t^4 \cos\left(\frac{200}{\pi t}\right)$ for $t > 0$. Find the limiting displacement as $t \to 0$.

**Step 1:** Analyze the oscillating component $\cos\left(\frac{200}{\pi t}\right)$.
For all real arguments $\theta \in \mathbb{R}$, the cosine function is strictly bounded:
$$-1 \le \cos(\theta) \le 1$$
Therefore, for all $t \neq 0$:
$$-1 \le \cos\left(\frac{200}{\pi t}\right) \le 1$$

**Step 2:** Multiply the entire inequality chain by $t^4$. Because $t^4 > 0$ for all $t \neq 0$, the inequality directions are strictly preserved:
$$-t^4 \le t^4 \cos\left(\frac{200}{\pi t}\right) \le t^4$$

**Step 3:** Evaluate the limits of the bounding functions as $t \to 0$:
$$\lim_{t \to 0} (-t^4) = -(0)^4 = 0$$
$$\lim_{t \to 0} (t^4) = (0)^4 = 0$$

**Step 4:** Apply the Squeeze Theorem:
Since $-t^4 \le y(t) \le t^4$ and both outer limits equal $0$, the middle function is trapped.

**Conclusion:** $\lim_{t \to 0} t^4 \cos\left(\frac{200}{\pi t}\right) = 0$.

---

### Example 3.8: Higher-Degree Polynomial Difference Quotient
**Problem:** For the cubic function $f(x) = 2x^3 - 4x$, calculate the slope of the tangent line at $x_0 = 1$ by evaluating $m = \lim_{h \to 0} \frac{f(1+h) - f(1)}{h}$.

**Step 1:** Compute $f(1)$:
$$f(1) = 2(1)^3 - 4(1) = 2 - 4 = -2$$

**Step 2:** Expand $f(1+h)$ using the binomial expansion $(1+h)^3 = 1 + 3h + 3h^2 + h^3$:
$$f(1+h) = 2(1 + 3h + 3h^2 + h^3) - 4(1+h)$$
$$f(1+h) = 2 + 6h + 6h^2 + 2h^3 - 4 - 4h = -2 + 2h + 6h^2 + 2h^3$$

**Step 3:** Subtract $f(1) = -2$:
$$f(1+h) - f(1) = (-2 + 2h + 6h^2 + 2h^3) - (-2) = 2h + 6h^2 + 2h^3$$

**Step 4:** Divide by $h$:
$$\frac{f(1+h) - f(1)}{h} = \frac{h(2 + 6h + 2h^2)}{h} = 2 + 6h + 2h^2 \quad (\text{for } h \neq 0)$$

**Step 5:** Evaluate the limit as $h \to 0$:
$$\lim_{h \to 0} (2 + 6h + 2h^2) = 2 + 6(0) + 2(0)^2 = 2$$

**Conclusion:** The exact slope of the tangent line to $f(x) = 2x^3 - 4x$ at $x = 1$ is $m = 2$.

---

### Example 3.9: Deriving the Full Tangent Line Equation
**Problem:** Find the point-slope and slope-intercept equations of the tangent line to the curve $y = f(x) = x^2 - 6x + 5$ at the coordinate $x_0 = 4$.

**Step 1:** Find the $y$-coordinate of the contact point $P(x_0, y_0)$:
$$y_0 = f(4) = 4^2 - 6(4) + 5 = 16 - 24 + 5 = -3$$
So the tangent point is $P(4, -3)$.

**Step 2:** Compute the tangent slope $m = \lim_{h \to 0} \frac{f(4+h) - f(4)}{h}$:
$$f(4+h) = (4+h)^2 - 6(4+h) + 5 = (16 + 8h + h^2) - (24 + 6h) + 5$$
$$f(4+h) = 16 - 24 + 5 + 8h - 6h + h^2 = -3 + 2h + h^2$$
$$f(4+h) - f(4) = (-3 + 2h + h^2) - (-3) = 2h + h^2$$
$$\frac{f(4+h) - f(4)}{h} = \frac{h(2+h)}{h} = 2 + h$$
$$m = \lim_{h \to 0} (2+h) = 2$$

**Step 3:** Write the point-slope form with $(x_0, y_0) = (4, -3)$ and $m = 2$:
$$y - y_0 = m(x - x_0) \implies y - (-3) = 2(x - 4)$$
$$y + 3 = 2x - 8$$

**Step 4:** Solve for slope-intercept form $y = mx + b$:
$$y = 2x - 11$$

**Step 5:** Sanity check:
At $x = 4$, $y = 2(4) - 11 = 8 - 11 = -3$. It matches the curve point perfectly.

---

### Example 3.10: Limit of a Difference with Multiple Square Roots
**Problem:** Evaluate $\lim_{x \to 4} \frac{\sqrt{2x + 1} - 3}{\sqrt{x} - 2}$.

**Step 1:** Test direct substitution:
$$\frac{\sqrt{2(4) + 1} - 3}{\sqrt{4} - 2} = \frac{\sqrt{9} - 3}{2 - 2} = \frac{3 - 3}{0} = \frac{0}{0}$$

**Step 2:** Both numerator and denominator contain square root differences. Multiply by both conjugate pairs simultaneously:
Numerator conjugate: $(\sqrt{2x+1} + 3)$
Denominator conjugate: $(\sqrt{x} + 2)$

$$\frac{\sqrt{2x + 1} - 3}{\sqrt{x} - 2} \cdot \frac{\sqrt{2x + 1} + 3}{\sqrt{2x + 1} + 3} \cdot \frac{\sqrt{x} + 2}{\sqrt{x} + 2}$$

**Step 3:** Group the difference-of-squares pairs:
In the numerator: $(\sqrt{2x+1} - 3)(\sqrt{2x+1} + 3) = (2x + 1) - 9 = 2x - 8 = 2(x - 4)$
In the denominator: $(\sqrt{x} - 2)(\sqrt{x} + 2) = x - 4$

**Step 4:** Reassemble the fraction:
$$\frac{2(x - 4) \cdot (\sqrt{x} + 2)}{(x - 4) \cdot (\sqrt{2x + 1} + 3)}$$

**Step 5:** Cancel the common vanishing factor $(x - 4) \neq 0$:
$$\frac{2(\sqrt{x} + 2)}{\sqrt{2x + 1} + 3}$$

**Step 6:** Substitute $x = 4$:
$$\frac{2(\sqrt{4} + 2)}{\sqrt{2(4) + 1} + 3} = \frac{2(2 + 2)}{\sqrt{9} + 3} = \frac{2(4)}{3 + 3} = \frac{8}{6} = \frac{4}{3}$$

**Conclusion:** The limit is $\frac{4}{3} \approx 1.3333$.

---

## 3.8 Chapter Mastery Problem Set

Test your understanding across five distinct difficulty tiers. Complete full written solutions are provided immediately following the exercises.

### Tier 1: Direct Substitution & Basic Factoring (Foundational)
- **Exercise 3.1:** Evaluate $\lim_{x \to 5} (3x^2 - 4x + 7)$ by direct substitution.
- **Exercise 3.2:** Evaluate $\lim_{x \to -2} \frac{x^2 - 4}{x + 2}$.

### Tier 2: Difference Quotients of Linear and Quadratic Systems
- **Exercise 3.3:** For $f(x) = 5x - 8$, evaluate $\lim_{h \to 0} \frac{f(3+h) - f(3)}{h}$.
- **Exercise 3.4:** For $f(x) = -2x^2 + 6x$, compute the instantaneous rate of change at $x = 1$ via the limit definition.

### Tier 3: Radical Expressions and Rationalization
- **Exercise 3.5:** Evaluate $\lim_{u \to 0} \frac{\sqrt{4 + u} - 2}{u}$.
- **Exercise 3.6:** Evaluate $\lim_{x \to 7} \frac{\sqrt{x + 2} - 3}{x - 7}$.

### Tier 4: Nested Fractions and One-Sided Discontinuities
- **Exercise 3.7:** Evaluate $\lim_{h \to 0} \frac{\frac{1}{(2+h)^2} - \frac{1}{4}}{h}$.
- **Exercise 3.8:** Given $g(x) = \begin{cases} x^2 + 1, & x < 2 \\ 3x - 1, & x \ge 2 \end{cases}$, evaluate $\lim_{x \to 2^-} g(x)$, $\lim_{x \to 2^+} g(x)$, and determine whether $\lim_{x \to 2} g(x)$ exists.

### Tier 5: Engineering Squeeze & Tangent Geometry (Advanced)
- **Exercise 3.9:** Use the Squeeze Theorem to determine $\lim_{x \to 0} x^2 \sin^2\left(\frac{1}{x}\right)$.
- **Exercise 3.10:** Find the equation of the tangent line to the reciprocal curve $y = \frac{1}{x}$ at the point $(2, 0.5)$ by taking the vanishing step limit.

---

## 3.9 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 3.1
Evaluate $\lim_{x \to 5} (3x^2 - 4x + 7)$.
Since the expression is a polynomial, it is continuous everywhere. Substitute $x = 5$ directly:
$$\lim_{x \to 5} (3x^2 - 4x + 7) = 3(5)^2 - 4(5) + 7 = 3(25) - 20 + 7 = 75 - 20 + 7 = 62$$
**Final Answer:** $62$.

---

### Solution to Exercise 3.2
Evaluate $\lim_{x \to -2} \frac{x^2 - 4}{x + 2}$.
1. Direct substitution gives $\frac{(-2)^2 - 4}{-2 + 2} = \frac{0}{0}$.
2. Factor the numerator: $x^2 - 4 = (x - 2)(x + 2)$.
3. Cancel the common factor $(x + 2)$ for $x \neq -2$:
$$\lim_{x \to -2} \frac{(x - 2)(x + 2)}{x + 2} = \lim_{x \to -2} (x - 2)$$
4. Substitute $x = -2$:
$$-2 - 2 = -4$$
**Final Answer:** $-4$.

---

### Solution to Exercise 3.3
For $f(x) = 5x - 8$, evaluate $\lim_{h \to 0} \frac{f(3+h) - f(3)}{h}$.
1. Compute $f(3) = 5(3) - 8 = 15 - 8 = 7$.
2. Compute $f(3+h) = 5(3+h) - 8 = 15 + 5h - 8 = 7 + 5h$.
3. Form the numerator: $f(3+h) - f(3) = (7 + 5h) - 7 = 5h$.
4. Divide by $h$: $\frac{5h}{h} = 5$ for $h \neq 0$.
5. Take the limit: $\lim_{h \to 0} 5 = 5$.
**Final Answer:** $5$.

---

### Solution to Exercise 3.4
For $f(x) = -2x^2 + 6x$, compute the rate of change at $x = 1$.
1. Compute $f(1) = -2(1)^2 + 6(1) = -2 + 6 = 4$.
2. Compute $f(1+h)$:
$$f(1+h) = -2(1+h)^2 + 6(1+h) = -2(1 + 2h + h^2) + 6 + 6h$$
$$f(1+h) = -2 - 4h - 2h^2 + 6 + 6h = 4 + 2h - 2h^2$$
3. Compute the difference: $f(1+h) - f(1) = (4 + 2h - 2h^2) - 4 = 2h - 2h^2$.
4. Divide by $h$: $\frac{2h - 2h^2}{h} = 2 - 2h$.
5. Evaluate the limit as $h \to 0$:
$$\lim_{h \to 0} (2 - 2h) = 2 - 2(0) = 2$$
**Final Answer:** $2$.

---

### Solution to Exercise 3.5
Evaluate $\lim_{u \to 0} \frac{\sqrt{4 + u} - 2}{u}$.
1. At $u = 0$, the expression gives $\frac{\sqrt{4} - 2}{0} = \frac{0}{0}$.
2. Rationalize by multiplying numerator and denominator by $(\sqrt{4 + u} + 2)$:
$$\frac{(\sqrt{4 + u} - 2)(\sqrt{4 + u} + 2)}{u(\sqrt{4 + u} + 2)} = \frac{(4 + u) - 4}{u(\sqrt{4 + u} + 2)} = \frac{u}{u(\sqrt{4 + u} + 2)}$$
3. Cancel $u$:
$$\frac{1}{\sqrt{4 + u} + 2}$$
4. Take the limit as $u \to 0$:
$$\lim_{u \to 0} \frac{1}{\sqrt{4 + u} + 2} = \frac{1}{\sqrt{4} + 2} = \frac{1}{2 + 2} = \frac{1}{4} = 0.25$$
**Final Answer:** $\frac{1}{4}$ (or $0.25$).

---

### Solution to Exercise 3.6
Evaluate $\lim_{x \to 7} \frac{\sqrt{x + 2} - 3}{x - 7}$.
1. At $x = 7$, $\frac{\sqrt{9} - 3}{7 - 7} = \frac{0}{0}$.
2. Multiply by conjugate $(\sqrt{x + 2} + 3)$:
$$\frac{(\sqrt{x + 2} - 3)(\sqrt{x + 2} + 3)}{(x - 7)(\sqrt{x + 2} + 3)} = \frac{(x + 2) - 9}{(x - 7)(\sqrt{x + 2} + 3)} = \frac{x - 7}{(x - 7)(\sqrt{x + 2} + 3)}$$
3. Cancel $(x - 7)$:
$$\frac{1}{\sqrt{x + 2} + 3}$$
4. Take limit as $x \to 7$:
$$\frac{1}{\sqrt{7 + 2} + 3} = \frac{1}{\sqrt{9} + 3} = \frac{1}{3 + 3} = \frac{1}{6}$$
**Final Answer:** $\frac{1}{6}$.

---

### Solution to Exercise 3.7
Evaluate $\lim_{h \to 0} \frac{\frac{1}{(2+h)^2} - \frac{1}{4}}{h}$.
1. Direct substitution yields $\frac{\frac{1}{4} - \frac{1}{4}}{0} = \frac{0}{0}$.
2. Find the common denominator for the numerator: $4(2+h)^2$:
$$\frac{1}{(2+h)^2} - \frac{1}{4} = \frac{4 - (2+h)^2}{4(2+h)^2} = \frac{4 - (4 + 4h + h^2)}{4(2+h)^2} = \frac{-4h - h^2}{4(2+h)^2} = \frac{-h(4 + h)}{4(2+h)^2}$$
3. Divide by $h$:
$$\frac{-h(4 + h)}{h \cdot 4(2+h)^2} = \frac{-(4 + h)}{4(2+h)^2}$$
4. Take the limit as $h \to 0$:
$$\lim_{h \to 0} \frac{-(4 + h)}{4(2+h)^2} = \frac{-(4 + 0)}{4(2+0)^2} = \frac{-4}{4(4)} = \frac{-4}{16} = -\frac{1}{4} = -0.25$$
**Final Answer:** $-\frac{1}{4}$ (or $-0.25$).

---

### Solution to Exercise 3.8
Evaluate one-sided limits and continuity for $g(x) = \begin{cases} x^2 + 1, & x < 2 \\ 3x - 1, & x \ge 2 \end{cases}$ at $x = 2$.
1. Left-hand limit ($x \to 2^-$):
$$\lim_{x \to 2^-} g(x) = \lim_{x \to 2^-} (x^2 + 1) = 2^2 + 1 = 4 + 1 = 5$$
2. Right-hand limit ($x \to 2^+$):
$$\lim_{x \to 2^+} g(x) = \lim_{x \to 2^+} (3x - 1) = 3(2) - 1 = 6 - 1 = 5$$
3. Since $\lim_{x \to 2^-} g(x) = 5 = \lim_{x \to 2^+} g(x)$, the two-sided limit exists and equals $5$.
**Final Answer:** Both one-sided limits equal $5$, and the two-sided limit $\lim_{x \to 2} g(x) = 5$.

---

### Solution to Exercise 3.9
Evaluate $\lim_{x \to 0} x^2 \sin^2\left(\frac{1}{x}\right)$ via the Squeeze Theorem.
1. The sine function is bounded: $-1 \le \sin\theta \le 1$. Squaring gives:
$$0 \le \sin^2\left(\frac{1}{x}\right) \le 1 \quad \text{for all } x \neq 0$$
2. Multiply by $x^2$ (which is strictly positive for $x \neq 0$):
$$0 \le x^2 \sin^2\left(\frac{1}{x}\right) \le x^2$$
3. Evaluate bounding limits as $x \to 0$:
$$\lim_{x \to 0} 0 = 0 \quad \text{and} \quad \lim_{x \to 0} x^2 = 0$$
4. By the Squeeze Theorem, the trapped term must converge to $0$.
**Final Answer:** $0$.

---

### Solution to Exercise 3.10
Find the equation of the tangent line to $y = \frac{1}{x}$ at $(2, 0.5)$.
1. Contact point: $(x_0, y_0) = (2, \frac{1}{2})$.
2. Tangent slope $m = \lim_{h \to 0} \frac{f(2+h) - f(2)}{h}$:
$$f(2+h) - f(2) = \frac{1}{2+h} - \frac{1}{2} = \frac{2 - (2+h)}{2(2+h)} = \frac{-h}{2(2+h)}$$
$$\frac{f(2+h) - f(2)}{h} = \frac{-h}{h \cdot 2(2+h)} = \frac{-1}{2(2+h)}$$
$$m = \lim_{h \to 0} \frac{-1}{2(2+h)} = \frac{-1}{2(2)} = -\frac{1}{4} = -0.25$$
3. Point-slope equation:
$$y - \frac{1}{2} = -\frac{1}{4}(x - 2)$$
$$y - \frac{1}{2} = -\frac{1}{4}x + \frac{1}{2}$$
$$y = -\frac{1}{4}x + 1 \quad \text{or} \quad x + 4y - 4 = 0$$
**Final Answer:** $y = -\frac{1}{4}x + 1$ (slope $m = -0.25$, $y$-intercept $b = 1$).
