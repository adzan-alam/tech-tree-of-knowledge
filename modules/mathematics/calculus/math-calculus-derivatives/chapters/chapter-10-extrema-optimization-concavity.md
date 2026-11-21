# Chapter 10: Extrema, Concavity, and the Geometry of Optimization

> *"To find the peak of a mountain without climbing every inch of the range is the crowning achievement of differential calculus. Where the slope flattens to absolute zero, the world pauses between ascent and descent — offering the engineer the exact design point where efficiency is maximized, material is conserved, and performance peaks."*

---

## 10.1 Fermat's Theorem and the Hunt for Extremes

In engineering design and physics simulation, the central question is often: *What is the best possible configuration?*
- How can we shape an aerodynamic wing to maximize lift while minimizing drag?
- What dimensions for a pressure vessel minimize manufacturing cost while holding a given volume?
- At what throttle setting does an engine achieve maximum thermal efficiency?

Mathematically, these questions ask for **extrema**: local or absolute maxima and minima of a function.

In 1638, the French mathematician Pierre de Fermat discovered the foundational principle:

> **Fermat's Theorem on Stationary Points:**
> If a function $f(x)$ attains a local maximum or local minimum at an interior point $x = c$, and if the derivative $f'(c)$ exists, then:
> $$f'(c) = 0$$

### Why Must the Derivative Be Zero at a Peak?
Consider a smooth curve $y = f(x)$. If $f(c)$ is a local maximum, then for all points immediately to the left ($x < c$), $f(x) \le f(c)$, meaning the secant slope $\frac{f(x) - f(c)}{x - c} \ge 0$. As $x \to c^-$, this forces the left-hand derivative to be non-negative:

$$f'_-(c) \ge 0$$

Similarly, for all points immediately to the right ($x > c$), $f(x) \le f(c)$, meaning the secant slope $\frac{f(x) - f(c)}{x - c} \le 0$. As $x \to c^+$, this forces the right-hand derivative to be non-positive:

$$f'_+(c) \le 0$$

If $f$ is differentiable at $c$, both one-sided derivatives must agree:

$$0 \le f'(c) \le 0 \implies f'(c) = 0$$

At the very crest of a hill or the lowest trough of a valley, the tangent line must be perfectly horizontal.

```
       y ^            Local Max (f'(c) = 0)
         |                 _.-* -._
         |               .'        '.
         |              /            \             Local Min (f'(c) = 0)
         |             /              \                 _.-* -._
         |            /                '._           _.'        '.
         |                                '-._-*-..-'             \
         +-------------------------------------------------------------> x
                                              Critical Points
```

---

## 10.2 Critical Points: The Set of All Candidates

Fermat's theorem tells us where extrema *can* occur, but it does not guarantee that every horizontal tangent is an extremum.

A **critical point** of a function $f$ is a number $c$ in the domain of $f$ such that either:
1. $f'(c) = 0$ (a **stationary point**), or
2. $f'(c)$ does not exist (a **singular point**, such as a sharp corner or vertical cusp).

### The Saddle Warning: Not All Critical Points Are Extrema
Consider $f(x) = x^3$. Its derivative is $f'(x) = 3x^2$.
Setting $f'(x) = 0$ yields $x = 0$.
However, $f(0) = 0$, and for $x > 0$, $x^3 > 0$, while for $x < 0$, $x^3 < 0$. The point $(0, 0)$ is neither a local maximum nor a local minimum! It is a **horizontal inflection point** (a saddle terrace). The curve pauses momentarily flat, then continues climbing.

Therefore, finding critical points is only step one; we must subject each candidate to a definitive classification test.

---

## 10.3 The Extreme Value Theorem and the Closed Interval Method

Before classifying local hills and valleys, we address the global question: *Is an absolute maximum or minimum guaranteed to exist?*

> **The Extreme Value Theorem (EVT):**
> If a real-valued function $f$ is continuous on a closed, bounded interval $[a, b]$, then $f$ attains both an **absolute maximum** and an **absolute minimum** at least once on $[a, b]$.

### The Closed Interval Method
To find the absolute maximum and minimum of a continuous function $f$ on $[a, b]$:
1. Find all critical points of $f$ that lie inside the open interval $(a, b)$.
2. Evaluate $f(c)$ at each interior critical point.
3. Evaluate $f(a)$ and $f(b)$ at the two endpoints.
4. The largest of these calculated values is the **absolute maximum**; the smallest is the **absolute minimum**.

This method requires zero second-derivative calculations; it is a direct numerical comparison.

---

## 10.4 The First Derivative Test for Local Extrema

To classify an isolated critical point $c$ on an open interval:

> **The First Derivative Test:**
> Suppose $f$ is continuous at a critical point $c$ and differentiable on an open interval containing $c$ (except possibly at $c$ itself):
> 1. If $f'(x)$ changes from **positive to negative** as $x$ increases through $c$, then $f(c)$ is a **Local Maximum**.
> 2. If $f'(x)$ changes from **negative to positive** as $x$ increases through $c$, then $f(c)$ is a **Local Minimum**.
> 3. If $f'(x)$ **does not change sign** (remains positive on both sides or negative on both sides), then $f(c)$ is **neither an extremum**.

*Physical intuition:* If you are walking up a slope ($f' > 0$) and then start walking down ($f' < 0$), you must have crossed a mountain peak. If you walk down into a gully ($f' < 0$) and then begin climbing ($f' > 0$), you were at the bottom of the valley.

---

## 10.5 Concavity and the Second Derivative Test

While the first derivative tracks the slope of the curve, the **second derivative** tracks how that slope is bending.

### Concavity Defined
- A curve is **concave upward** (opening upward like a cup, $\cup$) on an interval if its tangent lines lie *below* the curve. This occurs wherever the slope $f'(x)$ is strictly increasing:
  $$f''(x) > 0 \iff \text{Concave Upward}$$
- A curve is **concave downward** (opening downward like an umbrella, $\cap$) on an interval if its tangent lines lie *above* the curve. This occurs wherever the slope $f'(x)$ is strictly decreasing:
  $$f''(x) < 0 \iff \text{Concave Downward}$$

### Inflection Points
An **inflection point** is a point on a curve where the concavity changes from upward to downward, or from downward to upward. At an inflection point:
- The second derivative typically equals zero: $f''(c) = 0$ (or $f''(c)$ fails to exist).
- The tangent line actually cuts straight through the curve!

```
       Concave Down (f'' < 0)               Concave Up (f'' > 0)
            _.-""-._                                   \       /
          .'        '.             Inflection Point     \     /
         /            \                * (f'' = 0)       '._.'
        /              \             .'
       +----------------------------+--------------------------> x
```

### The Second Derivative Test for Local Extrema
If $f'(c) = 0$ and $f''(c)$ is continuous near $c$:
1. If $f''(c) < 0$, the curve is concave downward at the horizontal tangent $\implies$ $f(c)$ is a **Local Maximum**.
2. If $f''(c) > 0$, the curve is concave upward at the horizontal tangent $\implies$ $f(c)$ is a **Local Minimum**.
3. If $f''(c) = 0$, the test is **inconclusive** (the point could be a maximum like $-x^4$, a minimum like $+x^4$, or an inflection point like $x^3$). You must revert to the First Derivative Test.

---

## 10.6 The Seven Steps of Applied Optimization

Real-world engineering problems do not arrive with equations ready to differentiate. You must construct the model yourself:

1. **Understand the Objective:** Identify what quantity must be maximized (e.g., volume, efficiency, range) or minimized (e.g., cost, surface area, power loss).
2. **Assign Variables & Draw a Diagram:** Label all dimensions, rates, and geometric constraints.
3. **Write the Primary Objective Function:** Express the target quantity in terms of the variables: $Q = f(x, y)$.
4. **Identify Constraint Equations:** Use geometry or physical laws to relate the variables: $g(x, y) = C$.
5. **Eliminate Extra Variables:** Substitute the constraint into the objective equation to express the target in terms of **a single independent variable**: $Q = f(x)$.
6. **Establish the Feasible Physical Domain:** Determine the allowable values for $x$ (e.g., lengths cannot be negative, angles are bounded: $x \in [0, L]$).
7. **Differentiate, Find Critical Points, and Test:** Compute $f'(x) = 0$, evaluate boundaries, and verify that the critical point is indeed the global optimum.

---

## 10.7 Ten Progressive Worked Numerical Examples

### Example 10.1: Absolute Extrema on a Closed Interval
**Problem:** Find the absolute maximum and absolute minimum of $f(x) = 2x^3 - 3x^2 - 12x + 5$ on the closed interval $[-2, 4]$.

**Step 1:** Compute the derivative $f'(x)$:
$$f'(x) = 6x^2 - 6x - 12 = 6(x^2 - x - 2) = 6(x - 2)(x + 1)$$

**Step 2:** Find critical points by setting $f'(x) = 0$:
$$6(x - 2)(x + 1) = 0 \implies x_1 = 2, \quad x_2 = -1$$
Both critical points lie inside the open interval $(-2, 4)$.

**Step 3:** Evaluate $f(x)$ at all critical points and interval endpoints:
1. **Left Endpoint ($x = -2$):**
   $$f(-2) = 2(-2)^3 - 3(-2)^2 - 12(-2) + 5 = 2(-8) - 3(4) + 24 + 5 = -16 - 12 + 24 + 5 = 1$$
2. **Critical Point ($x = -1$):**
   $$f(-1) = 2(-1)^3 - 3(-1)^2 - 12(-1) + 5 = -2 - 3 + 12 + 5 = 12$$
3. **Critical Point ($x = 2$):**
   $$f(2) = 2(2^3) - 3(2^2) - 12(2) + 5 = 16 - 12 - 24 + 5 = -15$$
4. **Right Endpoint ($x = 4$):**
   $$f(4) = 2(4^3) - 3(4^2) - 12(4) + 5 = 2(64) - 3(16) - 48 + 5 = 128 - 48 - 48 + 5 = 37$$

**Step 4:** Compare the values:
- Maximum value among $\{1, 12, -15, 37\}$ is **$37$** (at $x = 4$).
- Minimum value among $\{1, 12, -15, 37\}$ is **$-15$** (at $x = 2$).

**Conclusion:** Absolute maximum is $37$ at $x = 4$; absolute minimum is $-15$ at $x = 2$.

---

### Example 10.2: First Derivative Test on a Quartic Curve
**Problem:** Classify all local extrema of $f(x) = x^4 - 4x^3 + 10$.

**Step 1:** Compute $f'(x)$:
$$f'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$$

**Step 2:** Find critical points ($f'(x) = 0$):
$$4x^2(x - 3) = 0 \implies x = 0 \quad \text{and} \quad x = 3$$

**Step 3:** Set up sign intervals for $f'(x) = 4x^2(x - 3)$:
Notice that $4x^2 \ge 0$ for all $x$. The sign of $f'(x)$ is dictated entirely by $(x - 3)$:
- For $x < 0$: $4x^2 > 0$ and $(x - 3) < 0 \implies f'(x) < 0$ (Decreasing).
- For $0 < x < 3$: $4x^2 > 0$ and $(x - 3) < 0 \implies f'(x) < 0$ (Decreasing).
- For $x > 3$: $4x^2 > 0$ and $(x - 3) > 0 \implies f'(x) > 0$ (Increasing).

**Step 4:** Classify each critical point:
- At $x = 0$: $f'(x)$ is negative on the left and negative on the right. The slope does not change sign. Therefore, $x = 0$ is **neither a local maximum nor a local minimum** (it is a horizontal inflection point).
- At $x = 3$: $f'(x)$ changes from negative to positive. By the First Derivative Test, $x = 3$ is a **Local Minimum**.

**Step 5:** Compute value at the local minimum:
$$f(3) = 3^4 - 4(3^3) + 10 = 81 - 108 + 10 = -17$$

**Conclusion:** Local minimum of $-17$ at $(3, -17)$; horizontal inflection at $(0, 10)$.

---

### Example 10.3: Second Derivative Test for Multiple Extrema
**Problem:** Use the Second Derivative Test to classify the local extrema of $f(x) = 3x^5 - 5x^3 + 2$.

**Step 1:** First derivative:
$$f'(x) = 15x^4 - 15x^2 = 15x^2(x^2 - 1) = 15x^2(x - 1)(x + 1)$$
Critical points are $x = -1, 0, 1$.

**Step 2:** Second derivative:
$$f''(x) = 60x^3 - 30x = 30x(2x^2 - 1)$$

**Step 3:** Evaluate $f''(x)$ at each critical point:
- **At $x = -1$:**
  $$f''(-1) = 30(-1)(2(-1)^2 - 1) = -30(2 - 1) = -30 < 0$$
  Since $f''(-1) < 0$, the curve is concave downward. Thus, $x = -1$ is a **Local Maximum**.
  $$f(-1) = 3(-1)^5 - 5(-1)^3 + 2 = -3 + 5 + 2 = 4$$

- **At $x = 1$:**
  $$f''(1) = 30(1)(2(1)^2 - 1) = 30(1) = +30 > 0$$
  Since $f''(1) > 0$, the curve is concave upward. Thus, $x = 1$ is a **Local Minimum**.
  $$f(1) = 3(1)^5 - 5(1)^3 + 2 = 3 - 5 + 2 = 0$$

- **At $x = 0$:**
  $$f''(0) = 30(0)(0 - 1) = 0$$
  The Second Derivative Test is **inconclusive**. Revert to First Derivative Test:
  For $x \in (-1, 0)$, $f'(x) = 15x^2(x^2 - 1) = (+)(-) = -$.
  For $x \in (0, 1)$, $f'(x) = 15x^2(x^2 - 1) = (+)(-) = -$.
  Since $f'$ remains negative on both sides of $x = 0$, it is **neither** an extremum.

**Conclusion:** Local maximum at $(-1, 4)$; local minimum at $(1, 0)$.

---

### Example 10.4: Locating Inflection Points and Concavity Intervals
**Problem:** Find all intervals of concavity and inflection points for $f(x) = x^4 - 6x^2 + 8x - 3$.

**Step 1:** Compute derivatives:
$$f'(x) = 4x^3 - 12x + 8$$
$$f''(x) = 12x^2 - 12 = 12(x^2 - 1) = 12(x - 1)(x + 1)$$

**Step 2:** Set $f''(x) = 0$:
$$12(x - 1)(x + 1) = 0 \implies x = -1 \quad \text{and} \quad x = 1$$

**Step 3:** Determine concavity intervals:
- On $(-\infty, -1)$: Test $x = -2 \implies f''(-2) = 12((-2)^2 - 1) = 12(3) = 36 > 0 \implies$ **Concave Upward**.
- On $(-1, 1)$: Test $x = 0 \implies f''(0) = 12(0 - 1) = -12 < 0 \implies$ **Concave Downward**.
- On $(1, \infty)$: Test $x = 2 \implies f''(2) = 12(4 - 1) = 36 > 0 \implies$ **Concave Upward**.

**Step 4:** Compute inflection point coordinates:
Because $f''(x)$ changes sign across both $x = -1$ and $x = 1$, both are genuine inflection points:
- $f(-1) = (-1)^4 - 6(-1)^2 + 8(-1) - 3 = 1 - 6 - 8 - 3 = -16 \implies (-1, -16)$
- $f(1) = 1^4 - 6(1)^2 + 8(1) - 3 = 1 - 6 + 8 - 3 = 0 \implies (1, 0)$

---

### Example 10.5: Engineering Box Optimization (Titanium Sheet Folding)
**Problem:** A lightweight drone payload enclosure is manufactured from a rectangular titanium sheet measuring $24\text{ cm} \times 36\text{ cm}$. Equal squares of side length $x$ are cut from all four corners, and the remaining flaps are folded up to form an open-top rectangular container. Find the cut size $x$ that maximizes the container volume, and calculate that maximum volume.

**Step 1:** Geometric setup:
- Length of base: $L(x) = 36 - 2x$
- Width of base: $W(x) = 24 - 2x$
- Height of box: $H(x) = x$

**Step 2:** Volume function:
$$V(x) = x(36 - 2x)(24 - 2x) = x(864 - 72x - 48x + 4x^2) = x(864 - 120x + 4x^2)$$
$$V(x) = 4x^3 - 120x^2 + 864x$$

**Step 3:** Feasible physical domain:
All dimensions must be positive: $x > 0$, $24 - 2x > 0 \implies x < 12$.
Domain: $x \in [0, 12]$. At endpoints $x = 0$ and $x = 12$, volume is $V = 0$.

**Step 4:** Differentiate to find critical points:
$$V'(x) = 12x^2 - 240x + 864$$
Set $V'(x) = 0$ and divide through by $12$:
$$x^2 - 20x + 72 = 0$$

**Step 5:** Solve using the quadratic formula:
$$x = \frac{20 \pm \sqrt{(-20)^2 - 4(1)(72)}}{2} = \frac{20 \pm \sqrt{400 - 288}}{2} = \frac{20 \pm \sqrt{112}}{2}$$
Notice that $\sqrt{112} = \sqrt{16 \times 7} = 4\sqrt{7} \approx 10.583$:
$$x = 10 \pm 2\sqrt{7}$$
- $x_1 = 10 + 2\sqrt{7} \approx 15.29\text{ cm}$ (Outside the physical domain $[0, 12]$)
- $x_2 = 10 - 2\sqrt{7} \approx 10 - 5.2915 = 4.7085\text{ cm}$ (Feasible!)

**Step 6:** Verify maximum via second derivative:
$$V''(x) = 24x - 240$$
$$V''(4.7085) = 24(4.7085) - 240 = 113.0 - 240 = -127.0 < 0 \implies \text{Confirmed Maximum}$$

**Step 7:** Calculate optimal dimensions and maximum volume:
- Height: $x \approx 4.71\text{ cm}$
- Length: $36 - 2(4.7085) = 36 - 9.417 = 26.583\text{ cm}$
- Width: $24 - 2(4.7085) = 24 - 9.417 = 14.583\text{ cm}$
- Maximum Volume:
  $$V_{\text{max}} = (4.7085) \times (26.583) \times (14.583) \approx 1825.29\text{ cm}^3$$

---

### Example 10.6: Material Optimization of a Cylindrical Propellant Tank
**Problem:** A closed cylindrical rocket propellant tank must hold a fixed volume of $V = 16\pi\text{ m}^3$. Find the radius $r$ and height $h$ that minimize the total surface area $A$ (and thus minimize hull mass).

**Step 1:** Objective function (Surface Area of closed cylinder):
$$A = 2\pi r^2 + 2\pi r h$$

**Step 2:** Constraint equation (Volume):
$$V = \pi r^2 h = 16\pi \implies r^2 h = 16 \implies h = \frac{16}{r^2}$$

**Step 3:** Substitute constraint into area function:
$$A(r) = 2\pi r^2 + 2\pi r \left(\frac{16}{r^2}\right) = 2\pi r^2 + \frac{32\pi}{r} = 2\pi r^2 + 32\pi r^{-1}$$
Domain: $r \in (0, \infty)$.

**Step 4:** Differentiate with respect to $r$:
$$A'(r) = 4\pi r - 32\pi r^{-2} = 4\pi r - \frac{32\pi}{r^2}$$

**Step 5:** Set $A'(r) = 0$:
$$4\pi r = \frac{32\pi}{r^2} \implies 4\pi r^3 = 32\pi \implies r^3 = 8 \implies r = 2\text{ meters}$$

**Step 6:** Compute optimal height:
$$h = \frac{16}{r^2} = \frac{16}{2^2} = \frac{16}{4} = 4\text{ meters}$$

Notice that $h = 2r$ (height equals diameter). This is a universal geometric invariant for closed cylinders minimizing surface area!

**Step 7:** Second derivative verification:
$$A''(r) = 4\pi + \frac{64\pi}{r^3} \implies A''(2) = 4\pi + \frac{64\pi}{8} = 4\pi + 8\pi = 12\pi > 0 \implies \text{Global Minimum}$$

---

### Example 10.7: Maximum Power Transfer in Electrical Transmission
**Problem:** An electrical generator with electromotive force $E$ and internal resistance $r$ delivers electrical power to an external load resistor $R$ according to:
$$P(R) = \frac{E^2 R}{(R + r)^2}$$
Find the load resistance $R$ that maximizes power delivered to the load.

**Step 1:** Regard $E$ and $r$ as positive constants. Differentiate $P(R)$ with respect to $R$ using the quotient rule:
$$u = E^2 R \implies u' = E^2$$
$$v = (R + r)^2 \implies v' = 2(R + r)$$
$$\frac{dP}{dR} = \frac{(R + r)^2(E^2) - (E^2 R)[2(R + r)]}{(R + r)^4}$$

**Step 2:** Factor out $(R + r)$ from the numerator:
$$\frac{dP}{dR} = \frac{(R + r) \cdot [E^2(R + r) - 2E^2 R]}{(R + r)^4} = \frac{E^2(R + r - 2R)}{(R + r)^3} = \frac{E^2(r - R)}{(R + r)^3}$$

**Step 3:** Set $\frac{dP}{dR} = 0$:
$$E^2(r - R) = 0 \implies R = r$$

**Step 4:** First derivative sign test:
- For $R < r$: $r - R > 0 \implies \frac{dP}{dR} > 0$ (Power increasing).
- For $R > r$: $r - R < 0 \implies \frac{dP}{dR} < 0$ (Power decreasing).
By the First Derivative Test, $R = r$ is the absolute global maximum.

**Conclusion:** Maximum power transfer occurs when the load resistance equals the internal resistance ($R = r$). This is the famous **Jacobi Maximum Power Transfer Theorem** in electrical engineering.

---

### Example 10.8: Minimizing Autonomous Cargo Ship Transit Cost
**Problem:** The operating cost per kilometer of an autonomous electric cargo vessel is modeled by:
$$C(v) = \frac{1800}{v} + 0.5 v^2$$
where $v$ is cruising speed in knots ($v > 0$). The first term represents fixed crewless telemetry and hotel load amortized over speed; the second term represents hydrodynamic hull drag. Determine the most economical cruising speed.

**Step 1:** Rewrite $C(v) = 1800 v^{-1} + 0.5 v^2$.
**Step 2:** Differentiate with respect to $v$:
$$C'(v) = -1800 v^{-2} + 1.0 v = -\frac{1800}{v^2} + v$$

**Step 3:** Set $C'(v) = 0$:
$$v = \frac{1800}{v^2} \implies v^3 = 1800 \implies v = \sqrt[3]{1800} \approx 12.164\text{ knots}$$

**Step 4:** Confirm minimum via second derivative:
$$C''(v) = \frac{3600}{v^3} + 1.0$$
Since $v > 0$, $C''(v) > 0$ everywhere, guaranteeing a unique global minimum.

**Step 5:** Calculate minimum operating cost:
$$C(12.164) = \frac{1800}{12.164} + 0.5(12.164)^2 \approx 147.98 + 73.99 \approx \$221.97\text{ per km}$$

---

### Example 10.9: Extrema Involving Non-Differentiable Critical Points
**Problem:** Find all absolute extrema of $f(x) = x^{2/3}(5 - x)$ on the interval $[-1, 5]$.

**Step 1:** Expand $f(x)$:
$$f(x) = 5x^{2/3} - x^{5/3}$$

**Step 2:** Differentiate:
$$f'(x) = 5\left(\frac{2}{3}\right)x^{-1/3} - \frac{5}{3}x^{2/3} = \frac{10}{3x^{1/3}} - \frac{5x^{2/3}}{3}$$

**Step 3:** Place over a common denominator $3x^{1/3}$:
$$f'(x) = \frac{10 - 5x}{3x^{1/3}} = \frac{5(2 - x)}{3\sqrt[3]{x}}$$

**Step 4:** Find all critical points in $[-1, 5]$:
1. **Numerator $= 0$:** $2 - x = 0 \implies x = 2$.
2. **Denominator $= 0$ (Derivative DNE):** $3\sqrt[3]{x} = 0 \implies x = 0$.
Both $x = 0$ and $x = 2$ are valid critical points!

**Step 5:** Evaluate $f(x)$ at critical points and endpoints:
- Left endpoint ($x = -1$): $f(-1) = (-1)^{2/3}(5 - (-1)) = (1)(6) = 6$.
- Singular critical point ($x = 0$): $f(0) = 0^{2/3}(5 - 0) = 0$.
- Stationary critical point ($x = 2$): $f(2) = 2^{2/3}(5 - 2) = 3\sqrt[3]{4} \approx 3(1.5874) \approx 4.762$.
- Right endpoint ($x = 5$): $f(5) = 5^{2/3}(5 - 5) = 0$.

**Step 6:** Identify extrema:
- Absolute Maximum: **$6$** at $x = -1$.
- Absolute Minimum: **$0$** at both $x = 0$ and $x = 5$.

---

### Example 10.10: Fiber-Optic Cable Routing Optimization
**Problem:** Two scientific research stations $A$ and $B$ are located on opposite banks of a straight river of width $W = 3\text{ km}$. Station $B$ is located $L = 8\text{ km}$ downstream from station $A$. Laying underwater cable costs $\$50,000$ per km, while laying land cable costs $\$30,000$ per km. The cable runs underwater from $A$ to a point $P$ on the opposite bank distance $x$ downstream from $A$, and then along the bank from $P$ to $B$. Find the distance $x$ that minimizes the total cost.

```
       Station A
          *
          | \
      3 km|  \  Underwater ($50k/km)
          |   \
          +----+------------------------* Station B
          0    P                        8 km
               <-- x --> <--- 8 - x --->
```

**Step 1:** Formulate the cost function:
- Underwater distance: $D_{\text{water}} = \sqrt{3^2 + x^2} = \sqrt{x^2 + 9}$
- Overland distance: $D_{\text{land}} = 8 - x$
- Total cost in thousands of dollars:
  $$C(x) = 50\sqrt{x^2 + 9} + 30(8 - x) \quad \text{for } x \in [0, 8]$$

**Step 2:** Differentiate with respect to $x$:
$$C'(x) = 50 \cdot \frac{1}{2\sqrt{x^2 + 9}} \cdot (2x) - 30 = \frac{50x}{\sqrt{x^2 + 9}} - 30$$

**Step 3:** Set $C'(x) = 0$:
$$\frac{50x}{\sqrt{x^2 + 9}} = 30 \implies \frac{5x}{\sqrt{x^2 + 9}} = 3$$
Cross-multiply and square both sides:
$$5x = 3\sqrt{x^2 + 9} \implies 25x^2 = 9(x^2 + 9) = 9x^2 + 81$$
$$16x^2 = 81 \implies x^2 = \frac{81}{16} \implies x = \frac{9}{4} = 2.25\text{ km}$$

**Step 4:** Compare with endpoints:
- At $x = 2.25\text{ km}$:
  $$C(2.25) = 50\sqrt{2.25^2 + 9} + 30(8 - 2.25) = 50(3.75) + 30(5.75) = 187.5 + 172.5 = \$360,000$$
- At $x = 0$ (all overland after direct crossing):
  $$C(0) = 50(3) + 30(8) = 150 + 240 = \$390,000$$
- At $x = 8$ (all underwater straight to $B$):
  $$C(8) = 50\sqrt{8^2 + 3^2} + 0 = 50\sqrt{73} \approx 50(8.544) = \$427,200$$

**Conclusion:** The minimum cost is $\$360,000$, achieved by aiming the underwater cable to land $2.25\text{ km}$ downstream.

---

## 10.8 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Stationary Points and Critical Numbers
- **Exercise 10.1:** Find all critical points of $f(x) = 2x^3 - 9x^2 + 12x - 7$.
- **Exercise 10.2:** Find all critical points of $g(x) = x^4 - 8x^2 + 5$.

### Tier 2: Classification via First and Second Derivative Tests
- **Exercise 10.3:** Classify all local extrema of $f(x) = x^3 - 3x^2 - 9x + 2$ using the Second Derivative Test.
- **Exercise 10.4:** Determine intervals of concavity and inflection points for $y = x^3 - 6x^2 + 9x$.

### Tier 3: Closed Interval Absolute Extrema
- **Exercise 10.5:** Find the absolute maximum and minimum of $f(x) = x^3 - 12x$ on $[-3, 5]$.
- **Exercise 10.6:** Find the absolute maximum and minimum of $f(x) = \frac{x}{x^2 + 1}$ on $[0, 3]$.

### Tier 4: Geometric and Manufacturing Optimization
- **Exercise 10.7:** An agricultural pasture is to be fenced alongside a straight river. No fencing is needed along the riverbank. If $1200\text{ meters}$ of fencing are available, find the pasture dimensions that maximize enclosed area.
- **Exercise 10.8:** A printed poster must have a total area of $1800\text{ cm}^2$ with top and bottom margins of $5\text{ cm}$ and side margins of $4\text{ cm}$. Find the poster dimensions that maximize the printable text area.

### Tier 5: Engineering Physics Optimization
- **Exercise 10.9:** The illumination $I$ of a point source on a horizontal desk at distance $x$ from the base of a lamp pole of height $h$ is $I(h) = \frac{k h}{(h^2 + x^2)^{3/2}}$. For a fixed horizontal distance $x = 4\text{ m}$, find the pole height $h$ that maximizes illumination.
- **Exercise 10.10:** Find all points on the parabola $y = x^2$ that are closest to the coordinate point $(0, 2)$.

---

## 10.9 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 10.1
Find critical points of $f(x) = 2x^3 - 9x^2 + 12x - 7$.
1. Compute $f'(x) = 6x^2 - 18x + 12$.
2. Set $f'(x) = 0 \implies 6(x^2 - 3x + 2) = 0 \implies 6(x - 1)(x - 2) = 0$.
**Final Answer:** Critical points are $x = 1$ and $x = 2$.

---

### Solution to Exercise 10.2
Find critical points of $g(x) = x^4 - 8x^2 + 5$.
1. Compute $g'(x) = 4x^3 - 16x$.
2. Set $g'(x) = 0 \implies 4x(x^2 - 4) = 0 \implies 4x(x - 2)(x + 2) = 0$.
**Final Answer:** Critical points are $x = -2, 0, 2$.

---

### Solution to Exercise 10.3
Classify extrema of $f(x) = x^3 - 3x^2 - 9x + 2$.
1. $f'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x - 3)(x + 1) = 0 \implies x = 3, -1$.
2. $f''(x) = 6x - 6$.
- At $x = -1$: $f''(-1) = 6(-1) - 6 = -12 < 0 \implies$ **Local Maximum**.
  $$f(-1) = (-1)^3 - 3(-1)^2 - 9(-1) + 2 = -1 - 3 + 9 + 2 = 7$$
- At $x = 3$: $f''(3) = 6(3) - 6 = 12 > 0 \implies$ **Local Minimum**.
  $$f(3) = 3^3 - 3(3^2) - 9(3) + 2 = 27 - 27 - 27 + 2 = -25$$
**Final Answer:** Local Maximum at $(-1, 7)$; Local Minimum at $(3, -25)$.

---

### Solution to Exercise 10.4
Find concavity and inflection points for $y = x^3 - 6x^2 + 9x$.
1. $y' = 3x^2 - 12x + 9$.
2. $y'' = 6x - 12 = 6(x - 2)$.
3. Setting $y'' = 0 \implies x = 2$.
- For $x < 2$: $y'' < 0 \implies$ **Concave Downward** on $(-\infty, 2)$.
- For $x > 2$: $y'' > 0 \implies$ **Concave Upward** on $(2, \infty)$.
4. Inflection point: $y(2) = 2^3 - 6(2^2) + 9(2) = 8 - 24 + 18 = 2 \implies (2, 2)$.
**Final Answer:** Concave down on $(-\infty, 2)$, concave up on $(2, \infty)$, inflection point at $(2, 2)$.

---

### Solution to Exercise 10.5
Find absolute extrema of $f(x) = x^3 - 12x$ on $[-3, 5]$.
1. $f'(x) = 3x^2 - 12 = 3(x^2 - 4) = 0 \implies x = \pm 2$. Both are inside $(-3, 5)$.
2. Evaluate:
- $f(-3) = (-3)^3 - 12(-3) = -27 + 36 = 9$.
- $f(-2) = (-2)^3 - 12(-2) = -8 + 24 = 16$.
- $f(2) = 2^3 - 12(2) = 8 - 24 = -16$.
- $f(5) = 5^3 - 12(5) = 125 - 60 = 65$.
3. Absolute max is $65$ (at $x = 5$). Absolute min is $-16$ (at $x = 2$).
**Final Answer:** Absolute maximum $= 65$; absolute minimum $= -16$.

---

### Solution to Exercise 10.6
Find absolute extrema of $f(x) = \frac{x}{x^2 + 1}$ on $[0, 3]$.
1. $f'(x) = \frac{(x^2+1)(1) - x(2x)}{(x^2+1)^2} = \frac{1 - x^2}{(x^2+1)^2} = 0 \implies x = 1$ (since $x \ge 0$).
2. Evaluate:
- $f(0) = \frac{0}{1} = 0$.
- $f(1) = \frac{1}{1^2 + 1} = \frac{1}{2} = 0.5$.
- $f(3) = \frac{3}{3^2 + 1} = \frac{3}{10} = 0.3$.
**Final Answer:** Absolute maximum $= 0.5$ (at $x = 1$); absolute minimum $= 0$ (at $x = 0$).

---

### Solution to Exercise 10.7
Maximize pasture area along river with $1200\text{ m}$ fencing.
1. River along length $L$; two widths $W$: $2W + L = 1200 \implies L = 1200 - 2W$.
2. Area: $A(W) = W(1200 - 2W) = 1200W - 2W^2$.
3. $A'(W) = 1200 - 4W = 0 \implies 4W = 1200 \implies W = 300\text{ m}$.
4. $L = 1200 - 2(300) = 600\text{ m}$.
5. Area: $300 \times 600 = 180,000\text{ m}^2$.
**Final Answer:** Width $W = 300\text{ m}$, Length $L = 600\text{ m}$, Maximum Area $= 180,000\text{ m}^2$.

---

### Solution to Exercise 10.8
Maximize printable area of poster with total area $1800\text{ cm}^2$ and margins (top/bottom $5$, sides $4$).
1. Let total width be $w$, total height be $h$: $w \cdot h = 1800 \implies h = \frac{1800}{w}$.
2. Printable dimensions: width $(w - 8)$, height $(h - 10)$.
3. Printable Area: $A(w) = (w - 8)\left(\frac{1800}{w} - 10\right) = 1800 - 10w - \frac{14400}{w} + 80 = 1880 - 10w - 14400w^{-1}$.
4. $A'(w) = -10 + 14400w^{-2} = 0 \implies 10 = \frac{14400}{w^2} \implies w^2 = 1440 \implies w = \sqrt{1440} = 12\sqrt{10} \approx 37.95\text{ cm}$.
5. Height: $h = \frac{1800}{12\sqrt{10}} = \frac{150}{\sqrt{10}} = 15\sqrt{10} \approx 47.43\text{ cm}$.
**Final Answer:** Total width $w = 12\sqrt{10} \approx 37.95\text{ cm}$, Total height $h = 15\sqrt{10} \approx 47.43\text{ cm}$.

---

### Solution to Exercise 10.9
Maximize illumination $I(h) = \frac{k h}{(h^2 + 16)^{3/2}}$.
1. Let $u = h \implies u' = 1$, and $v = (h^2 + 16)^{3/2} \implies v' = \frac{3}{2}(h^2+16)^{1/2}(2h) = 3h\sqrt{h^2+16}$.
2. Quotient rule:
$$I'(h) = k \cdot \frac{(h^2+16)^{3/2}(1) - h[3h(h^2+16)^{1/2}]}{(h^2+16)^3}$$
Factor $(h^2+16)^{1/2}$:
$$I'(h) = k \cdot \frac{(h^2+16)^{1/2}[(h^2+16) - 3h^2]}{(h^2+16)^3} = k \cdot \frac{16 - 2h^2}{(h^2+16)^{5/2}}$$
3. Set $I'(h) = 0 \implies 16 - 2h^2 = 0 \implies 2h^2 = 16 \implies h^2 = 8 \implies h = \sqrt{8} = 2\sqrt{2} \approx 2.828\text{ m}$.
**Final Answer:** Pole height $h = 2\sqrt{2} \approx 2.83\text{ meters}$.

---

### Solution to Exercise 10.10
Find points on $y = x^2$ closest to $(0, 2)$.
1. Distance squared to $(0, 2)$:
$$D^2 = (x - 0)^2 + (y - 2)^2 = x^2 + (x^2 - 2)^2 = x^2 + x^4 - 4x^2 + 4 = x^4 - 3x^2 + 4$$
2. Minimize $f(x) = x^4 - 3x^2 + 4$:
$$f'(x) = 4x^3 - 6x = 2x(2x^2 - 3) = 0$$
Roots: $x = 0$ or $2x^2 = 3 \implies x^2 = \frac{3}{2} \implies x = \pm\sqrt{\frac{3}{2}} = \pm\frac{\sqrt{6}}{2}$.
3. Evaluate second derivative: $f''(x) = 12x^2 - 6$.
- At $x = 0$: $f''(0) = -6 < 0$ (Local maximum of distance squared!).
- At $x = \pm\sqrt{3/2}$: $f'' = 12(3/2) - 6 = 18 - 6 = 12 > 0$ (Local and global minimum!).
4. Corresponding $y$: $y = x^2 = \frac{3}{2} = 1.5$.
**Final Answer:** Points are $\left(\sqrt{\frac{3}{2}}, \frac{3}{2}\right)$ and $\left(-\sqrt{\frac{3}{2}}, \frac{3}{2}\right)$.
