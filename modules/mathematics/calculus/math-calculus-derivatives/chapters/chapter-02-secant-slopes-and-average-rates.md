# CHAPTER 2: The Secant Bridge — Slopes, Stepping Stones, and Average Rates of Change

---

## 2.1 The Geometry of Functions: Translating Motion into Curves

In Chapter 1, we examined motion across physical space and time. We saw that an accelerating object produces an ever-changing speed that arithmetic struggles to capture.

Now, we make a profound conceptual leap. We leave behind the physical highway and step onto the **Cartesian coordinate plane** invented by René Descartes in 1637. 

In mathematics, a **function** $y = f(x)$ is a deterministic mathematical machine. You drop an input value $x$ into the top of the machine, the gears turn according to a fixed algebraic rule, and an output value $y$ emerges from the bottom:

```
            THE FUNCTION MACHINE
            
            Input: x (e.g., Time, Distance, Cost)
                    │
                    ▼
           ┌─────────────────┐
           │   Machine f(x)  │  Rule: y = f(x)
           └─────────────────┘
                    │
                    ▼
            Output: y (e.g., Position, Temperature, Revenue)
```

When we plot every possible pair of inputs and outputs $(x, y)$ on graph paper, the function draws a continuous line or curve. 
- If the rule is linear, such as $f(x) = 2x + 1$, the graph is an unbroken straight ramp.
- If the rule involves powers, roots, or curves, such as $f(x) = x^2$ or $f(x) = x^3 - 4x$, the graph bends, swoops, climbs steep peaks, and plunges into valleys.

Our goal in this chapter is to understand the **steepness** of these curves. How rapidly does $y$ respond when we nudge $x$?

---

## 2.2 The Elementary Definition of Slope: Rise Over Run

In middle school algebra, you learned to measure the steepness of a straight line using the concept of **Slope** (traditionally denoted by the letter $m$):

$$m = \frac{\text{Change in } y}{\text{Change in } x} = \frac{\Delta y}{\Delta x} = \frac{\text{Rise}}{\text{Run}} = \frac{y_2 - y_1}{x_2 - x_1}$$

```
                    THE GEOMETRY OF A SLOPE
                    
        Y ^
          |                     Point Q (x₂, y₂)
       y₂ |                         ●
          |                        /|
          |                       / |  Rise = Δy = y₂ - y₁
          |                      /  |
       y₁ |          Point P    /   |
          |             ●──────/────┘
          |             |     Run = Δx = x₂ - x₁
          +─────────────+──────+─────────> X
          0            x₁     x₂
```

The slope $m$ is a constant conversion factor: it tells you how many units the graph climbs (or falls) vertically for every single unit you step horizontally to the right:

1. **Positive Slope ($m > 0$):** The line climbs uphill from left to right. As $x$ increases, $y$ increases. A slope of $+3$ means: *"Step 1 unit right, climb 3 units up."*
2. **Negative Slope ($m < 0$):** The line plunges downhill from left to right. As $x$ increases, $y$ decreases. A slope of $-2$ means: *"Step 1 unit right, drop 2 units down."*
3. **Zero Slope ($m = 0$):** The line is a flat, horizontal surface. As $x$ increases, $y$ does not change at all ($\Delta y = 0$).
4. **Undefined / Infinite Slope ($m = \pm\infty$):** A vertical cliff wall. Here, $\Delta x = 0$, which causes a division by zero: $\frac{\Delta y}{0}$.

For any straight line, the slope is **invariant** (it never changes). Whether you measure the slope between $x = 0$ and $x = 1$, or between $x = 100$ and $x = 500$, the ratio $\frac{\Delta y}{\Delta x}$ is strictly identical. Straight lines are mathematically boring because their rate of change never changes.

---

## 2.3 The Curved World: When Slope Ceases to Be Constant

Now look at a curved graph, such as the parabolic trajectory $f(x) = x^2$:

```
               THE VARIABLE STEEPNESS OF A PARABOLA
               
        Y ^
          |                                  ● (3, 9) [Very Steep!]
        9 |                                 /
        8 |                                /
        7 |                               /
        6 |                              /
        5 |                             /
        4 |                 ● (2, 4)   /
        3 |                /          /
        2 |               /          /
        1 |     ● (1, 1) /          /
        0 +─────●───────+──────────+─────> X
          0     1       2          3
                Flat!   Medium     Steep!
```

Examine this curve carefully:
- At the bottom origin $(0, 0)$, the curve is momentarily flat and horizontal. A marble resting there would not roll.
- Near $x = 1$, the curve climbs gently.
- Near $x = 2$, the curve climbs much more aggressively.
- Near $x = 3$, the curve resembles a steep mountain cliff.

On a curve, there is no single "slope." The steepness is changing at every single point along the path!

How can we measure the steepness of a bending curve between two points? We build a bridge called a **Secant Line**.

---

## 2.4 The Secant Line: A Straight Bridge Across a Curved Chasm

The word *secant* comes from the Latin word *secare*, which means *"to cut"*.

A **Secant Line** is a straight line that cuts through a curve at two distinct points:
- A base point: $P(x_1, f(x_1))$
- A secondary point: $Q(x_2, f(x_2))$

```
                   THE SECANT LINE CUTTING A CURVE
                   
        Y ^
          |                       Q (x₂, f(x₂))
          |                           ●
          |                          / ╷
          |            Curve f(x)   /  │  Δy = f(x₂) - f(x₁)
          |             ╭──────────/   │
          |            ╭          /    │
          |           ●──────────/─────┘
          |         P (x₁, f(x₁))  Δx = x₂ - x₁
          +─────────────────────────────────────────> X
```

The slope of this secant line, denoted $m_{\text{sec}}$, is the **Average Rate of Change** of the function over the interval $[x_1, x_2]$:

$$m_{\text{sec}} = \frac{f(x_2) - f(x_1)}{x_2 - x_1}$$

If we let $x_1 = x$ and let $x_2 = x + \Delta x$ (where $\Delta x$ is the horizontal step size), the formula takes its standard, universal form:

$$m_{\text{sec}} = \frac{f(x + \Delta x) - f(x)}{\Delta x}$$

This mathematical expression is called the **Difference Quotient**. It is the single most important algebraic structure in all of introductory calculus.

---

## 2.5 Why Secant Lines Lie: The Rollercoaster Drop

It is crucial to understand that a secant line is always an **approximation**. It replaces the true, bending reality of the curve with a flat, straight chord.

Imagine you are designing a high-thrill amusement park rollercoaster. The track drops from an elevation of $100\text{ meters}$ at $x = 0$ down to $0\text{ meters}$ at $x = 100\text{ meters}$.

Consider two completely different track designs:

```
            TRACK A: Straight Ramp              TRACK B: Parabolic Dive
            
     Y ^ 100m                            Y ^ 100m
       | ●                                 | ●
       |  \                                |  \
       |   \   Slope = -1.0                |   \  Near-vertical drop!
       |    \  Uniform gradient            |    \ 
       |     \                             |     ╰─╮
       |      \                            |        ╰───────────●
       0 +─────●───────────> X             0 +──────────────────●──> X
         0    100m                           0                 100m
```

Let us calculate the secant slope for both tracks from $x = 0$ to $x = 100$:

$$\text{Track A: } m_{\text{sec}} = \frac{0 - 100}{100 - 0} = \frac{-100}{100} = -1.0$$

$$\text{Track B: } m_{\text{sec}} = \frac{0 - 100}{100 - 0} = \frac{-100}{100} = -1.0$$

Both tracks have the **exact same average slope: $-1.0$**.

Yet riding Track A is a gentle, boring slide, while riding Track B is a terrifying, near-vertical freefall followed by intense G-force flattening! 

The average slope completely conceals the extreme curvature of Track B. To understand the safety, forces, and thrill of Track B, the structural engineer cannot rely on an average over $100\text{ meters}$. The engineer must shrink $\Delta x$ down to a single foot, a single inch, a single millimeter!

---

## 2.6 The Historical Genesis: Pierre de Fermat and the Method of Adequality

Long before Isaac Newton and Gottfried Wilhelm Leibniz published their treatises on calculus, a brilliant French lawyer and amateur mathematician named **Pierre de Fermat** (1607–1665) made a monumental breakthrough in 1636.

Fermat was studying how to find the highest point (maximum) of a curve. He realized that near the peak of a smooth hill, two points separated by a tiny horizontal distance $e$ have almost the exact same height:

$$f(x) \approx f(x + e)$$

Fermat called this approximate equality **Adequality** (borrowed from Diophantus' Greek term *parisotēs*).

```
               FERMAT'S PEAK DISCOVERY (1636)
               
                 Flat Tangent Line at Summit
                     ─────────●─────────
                            ╭───╮
                           ╭     ╮
                          ╭       ╮
                         ●         ●  Points at height f(x) ≈ f(x+e)
                        x         x+e
```

Fermat's revolutionary algorithm worked as follows:
1. Set $f(x + e) - f(x) \approx 0$.
2. Divide all terms by $e$ (which was legal because $e \neq 0$).
3. After dividing out $e$, simply set $e = 0$ to delete all remaining terms containing $e$.
4. Solve for $x$!

When the famous philosopher René Descartes read Fermat's manuscript, he was infuriated and baffled. Descartes demanded to know: *"How can Fermat first divide by $e$ (assuming $e \neq 0$), and then immediately set $e = 0$? That is a blatant logical contradiction!"*

Fermat could not provide the rigorous modern definition of a limit—that definition would take another 200 years to develop—but Fermat's mathematical instinct was 100% correct. He had invented the prototype of the derivative!

---

## 2.7 Ten Fully Worked Progressive Numerical Examples

Let us master the calculation of secant slopes across linear, polynomial, rational, and radical functions.

---

### Example 1: Secant Slope of a Linear Function
Calculate the secant slope of $f(x) = 5x - 7$ across the interval $[2, 8]$.

**Step-by-step Solution:**
1. Identify $x_1 = 2$ and $x_2 = 8$.
2. Evaluate $f(x_1)$:
   $$f(2) = 5(2) - 7 = 10 - 7 = 3$$
3. Evaluate $f(x_2)$:
   $$f(8) = 5(8) - 7 = 40 - 7 = 33$$
4. Compute $\Delta y = f(8) - f(2) = 33 - 3 = 30$.
5. Compute $\Delta x = 8 - 2 = 6$.
6. Calculate secant slope:
   $$m_{\text{sec}} = \frac{\Delta y}{\Delta x} = \frac{30}{6} = \mathbf{5.0}$$
*Rule Confirmed:* For any linear function $f(x) = mx + b$, the secant slope over any interval $[a, b]$ is always equal to $m$.

---

### Example 2: The Parabola Across a Broad Interval
Calculate the secant slope of $f(x) = x^2$ across the broad interval $[1, 4]$.

**Step-by-step Solution:**
1. $x_1 = 1 \implies f(1) = 1^2 = 1$.
2. $x_2 = 4 \implies f(4) = 4^2 = 16$.
3. $\Delta y = 16 - 1 = 15$.
4. $\Delta x = 4 - 1 = 3$.
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{15}{3} = \mathbf{5.0}$$
*Geometric Meaning:* The straight chord connecting $(1, 1)$ to $(4, 16)$ climbs 5 units up for every 1 unit it moves right.

---

### Example 3: Shrinking the Parabola Secant: $\Delta x = 1.0$
For $f(x) = x^2$, calculate the secant slope starting at $x_1 = 1$ with step size $\Delta x = 1.0$ (interval $[1, 2]$).

**Step-by-step Solution:**
1. $x_1 = 1 \implies f(1) = 1$.
2. $x_2 = 1 + 1.0 = 2 \implies f(2) = 2^2 = 4$.
3. $\Delta y = 4 - 1 = 3$.
4. $\Delta x = 2 - 1 = 1$.
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{3}{1} = \mathbf{3.0}$$

---

### Example 4: Shrinking the Parabola Secant: $\Delta x = 0.1$
For $f(x) = x^2$, calculate the secant slope starting at $x_1 = 1$ with step size $\Delta x = 0.1$ (interval $[1, 1.1]$).

**Step-by-step Solution:**
1. $x_1 = 1.0 \implies f(1.0) = 1.00$.
2. $x_2 = 1.1 \implies f(1.1) = (1.1)^2 = 1.21$.
3. $\Delta y = 1.21 - 1.00 = 0.21$.
4. $\Delta x = 0.1$.
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{0.21}{0.1} = \mathbf{2.1}$$

---

### Example 5: Shrinking the Parabola Secant: $\Delta x = 0.01$
For $f(x) = x^2$, calculate the secant slope starting at $x_1 = 1$ with step size $\Delta x = 0.01$ (interval $[1, 1.01]$).

**Step-by-step Solution:**
1. $x_1 = 1.00 \implies f(1.00) = 1.0000$.
2. $x_2 = 1.01 \implies f(1.01) = (1.01)^2 = 1.0201$.
3. $\Delta y = 1.0201 - 1.0000 = 0.0201$.
4. $\Delta x = 0.01$.
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{0.0201}{0.01} = \mathbf{2.01}$$
*Target Discovery:* Look at the sequence of secant slopes starting from $x=1$:
$$\Delta x = 3 \implies m = 5.0$$
$$\Delta x = 1 \implies m = 3.0$$
$$\Delta x = 0.1 \implies m = 2.1$$
$$\Delta x = 0.01 \implies m = 2.01$$
The slope of the tangent line at $x = 1$ is unequivocally **$2.0$**.

---

### Example 6: Negative Secant Slope of Cooling Coffee
A cup of fresh hot coffee cools according to the quadratic approximation $T(t) = 90 - 4t + 0.04t^2$ degrees Celsius, where $t$ is in minutes. Calculate the average cooling rate over the first 10 minutes ($[0, 10]$).

**Step-by-step Solution:**
1. $t_1 = 0 \implies T(0) = 90 - 0 + 0 = 90^\circ\text{C}$.
2. $t_2 = 10 \implies T(10) = 90 - 4(10) + 0.04(10)^2 = 90 - 40 + 0.04(100) = 50 + 4 = 54^\circ\text{C}$.
3. $\Delta T = T(10) - T(0) = 54 - 90 = -36^\circ\text{C}$.
4. $\Delta t = 10 - 0 = 10\text{ minutes}$.
5. Average cooling rate:
   $$m_{\text{sec}} = \frac{-36^\circ\text{C}}{10\text{ min}} = \mathbf{-3.6^\circ\text{C/min}}$$
*Interpretation:* The negative sign confirms that thermal energy is dissipating into the surrounding air at an average rate of $3.6^\circ\text{C}$ every minute.

---

### Example 7: Secant Slope of the Square Root Curve
Calculate the secant slope of $f(x) = \sqrt{x}$ across the interval $[4, 9]$.

**Step-by-step Solution:**
1. $x_1 = 4 \implies f(4) = \sqrt{4} = 2$.
2. $x_2 = 9 \implies f(9) = \sqrt{9} = 3$.
3. $\Delta y = 3 - 2 = 1$.
4. $\Delta x = 9 - 4 = 5$.
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{1}{5} = \mathbf{0.20}$$
*Geometry Check:* Between $x=4$ and $x=9$, the square root curve climbs 1 unit vertically while moving 5 units horizontally, giving a gentle positive slope of $0.2$.

---

### Example 8: Secant Slope of the Hyperbola ($f(x) = 1/x$)
Calculate the secant slope of the rational function $f(x) = \frac{1}{x}$ across the interval $[1, 2]$.

**Step-by-step Solution:**
1. $x_1 = 1 \implies f(1) = \frac{1}{1} = 1.0$.
2. $x_2 = 2 \implies f(2) = \frac{1}{2} = 0.5$.
3. $\Delta y = 0.5 - 1.0 = -0.5$.
4. $\Delta x = 2 - 1 = 1.0$.
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{-0.5}{1.0} = \mathbf{-0.5}$$
*Algebraic Check:* $\frac{f(2) - f(1)}{2 - 1} = \frac{1/2 - 1}{1} = -\frac{1}{2}$. The downward plunge of the hyperbola is quantified.

---

### Example 9: The Mountain Pass: A Zero Secant Slope Across a Peak
Consider the trajectory $f(x) = -x^2 + 6x$. Calculate the secant slope across the symmetric interval $[1, 5]$.

**Step-by-step Solution:**
1. Evaluate $f(1)$:
   $$f(1) = -(1)^2 + 6(1) = -1 + 6 = 5$$
2. Evaluate $f(5)$:
   $$f(5) = -(5)^2 + 6(5) = -25 + 30 = 5$$
3. Compute $\Delta y$:
   $$\Delta y = f(5) - f(1) = 5 - 5 = 0$$
4. Compute $\Delta x$:
   $$\Delta x = 5 - 1 = 4$$
5. Compute secant slope:
   $$m_{\text{sec}} = \frac{0}{4} = \mathbf{0.0}$$
*Critical Philosophical Insight:* Does $m_{\text{sec}} = 0$ mean the function is flat? **No!**
- The function climbs from $(1, 5)$ up to a maximum summit at $(3, 9)$, and then plunges back down to $(5, 5)$.
- The secant line is perfectly horizontal, yet the actual curve experienced violent elevation changes. This is Rolle's Theorem in action!

---

### Example 10: General Difference Quotient for a Quadratic
Derive a general algebraic formula for the secant slope of $f(x) = ax^2 + bx + c$ across an arbitrary interval $[x, x + h]$.

**Step-by-step Solution:**
1. Write the difference quotient:
   $$m_{\text{sec}} = \frac{f(x+h) - f(x)}{h}$$
2. Evaluate $f(x+h)$:
   $$f(x+h) = a(x+h)^2 + b(x+h) + c = a(x^2 + 2xh + h^2) + bx + bh + c$$
   $$f(x+h) = ax^2 + 2axh + ah^2 + bx + bh + c$$
3. Subtract $f(x) = ax^2 + bx + c$:
   $$f(x+h) - f(x) = (ax^2 + 2axh + ah^2 + bx + bh + c) - (ax^2 + bx + c)$$
   Notice that the three static terms $ax^2, bx, c$ cancel out completely:
   $$\Delta y = 2axh + ah^2 + bh$$
4. Factor out $h$ in the numerator:
   $$\Delta y = h(2ax + ah + b)$$
5. Divide by $h$ (since $h \neq 0$):
   $$m_{\text{sec}} = \frac{h(2ax + b + ah)}{h} = \mathbf{2ax + b + ah}$$
*Validation:* 
- For $f(x) = x^2$ ($a=1, b=0$), $m_{\text{sec}} = 2x + h$. At $x=1$ with $h=1$, $m_{\text{sec}} = 2(1) + 1 = 3.0$ (matches Example 3).
- At $x=1$ with $h=0.1$, $m_{\text{sec}} = 2(1) + 0.1 = 2.1$ (matches Example 4).
- As $h \to 0$, $m_{\text{sec}} \to 2ax + b$. We have just derived our first universal derivative formula!

---

## 2.8 Chapter Mastery Problem Set

Master these ten progressive problems before moving to Chapter 3. Complete unabridged solutions follow below.

- **Exercise 2.1 (Tier 1):** Find the secant slope of the line passing through $(3, -2)$ and $(7, 14)$.
- **Exercise 2.2 (Tier 1):** A car drives such that its odometer reads $s(t) = 20t$ miles, where $t$ is in hours. Calculate the secant slope over $[2, 5]$ and interpret its physical meaning.
- **Exercise 2.3 (Tier 2):** Calculate the secant slope of $f(x) = 2x^2 - 3x$ across the interval $[1, 3]$.
- **Exercise 2.4 (Tier 2):** For $f(x) = 2x^2 - 3x$, calculate the secant slope starting at $x = 1$ with step size $h = 0.1$ (interval $[1, 1.1]$).
- **Exercise 2.5 (Tier 3):** For $f(x) = 2x^2 - 3x$, calculate the secant slope starting at $x = 1$ with step size $h = 0.001$. Make a conjecture for the exact tangent slope at $x = 1$.
- **Exercise 2.6 (Tier 3):** Using the algebraic difference quotient $\frac{f(1+h) - f(1)}{h}$, prove your conjecture from Exercise 2.5 by letting $h \to 0$.
- **Exercise 2.7 (Tier 4):** A biochemical reaction produces product mass $M(t) = \frac{t}{t+1}$ grams for $t \ge 0$ seconds. Calculate the average production rate across $[1, 3]$ seconds.
- **Exercise 2.8 (Tier 4):** Calculate the secant slope of the square root function $f(x) = \sqrt{x}$ between $x = 1$ and $x = 1 + h$. Multiply numerator and denominator by the conjugate $(\sqrt{1+h} + 1)$ to eliminate the square root, and evaluate the limit as $h \to 0$.
- **Exercise 2.9 (Tier 5):** An airplane descends along an altitude profile $A(x) = 10000 - 0.01 x^2$ meters, where $x$ is horizontal distance in meters from the runway beacon. 
  (a) Find the average descent gradient between $x = 200\text{ m}$ and $x = 500\text{ m}$.
  (b) Express the angle of the descent flightpath relative to the horizon for this secant line.
- **Exercise 2.10 (Tier 5):** Provide an algebraic example of a function $f(x)$ where the secant slope across $[-2, 2]$ is $+1$, yet the function takes on both negative values and slopes exceeding $+10$ inside the interval. Sketch and explain the geometric consequences.

---

## 2.9 Complete Solutions to Chapter Mastery Exercises

---

### Solution 2.1
1. Given points $(x_1, y_1) = (3, -2)$ and $(x_2, y_2) = (7, 14)$.
2. $\Delta y = 14 - (-2) = 14 + 2 = 16$.
3. $\Delta x = 7 - 3 = 4$.
4. Slope: $m = \frac{16}{4} = \mathbf{4.0}$.

---

### Solution 2.2
1. $s(2) = 20(2) = 40\text{ miles}$.
2. $s(5) = 20(5) = 100\text{ miles}$.
3. $\Delta s = 100 - 40 = 60\text{ miles}$.
4. $\Delta t = 5 - 2 = 3\text{ hours}$.
5. $m_{\text{sec}} = \frac{60\text{ miles}}{3\text{ hours}} = \mathbf{20.0\text{ mph}}$.
*Physical Meaning:* The vehicle is cruising at a constant speed of 20 miles per hour.

---

### Solution 2.3
1. $f(1) = 2(1)^2 - 3(1) = 2 - 3 = -1$.
2. $f(3) = 2(3)^2 - 3(3) = 2(9) - 9 = 18 - 9 = 9$.
3. $\Delta y = 9 - (-1) = 10$.
4. $\Delta x = 3 - 1 = 2$.
5. $m_{\text{sec}} = \frac{10}{2} = \mathbf{5.0}$.

---

### Solution 2.4
1. $x_1 = 1.0 \implies f(1.0) = -1.00$.
2. $x_2 = 1.1 \implies f(1.1) = 2(1.1)^2 - 3(1.1) = 2(1.21) - 3.3 = 2.42 - 3.3 = -0.88$.
3. $\Delta y = -0.88 - (-1.00) = +0.12$.
4. $\Delta x = 0.1$.
5. $m_{\text{sec}} = \frac{0.12}{0.1} = \mathbf{1.20}$.

---

### Solution 2.5
1. $x_2 = 1.001$:
   $$(1.001)^2 = 1.002001$$
   $$f(1.001) = 2(1.002001) - 3(1.001) = 2.004002 - 3.003 = -0.998998$$
2. $\Delta y = -0.998998 - (-1.000000) = +0.001002$.
3. $\Delta x = 0.001$.
4. $m_{\text{sec}} = \frac{0.001002}{0.001} = \mathbf{1.002}$.
*Conjecture:* As $h \to 0$, the secant slope approaches exactly $\mathbf{1.0}$.

---

### Solution 2.6
1. Difference quotient for $f(x) = 2x^2 - 3x$ at $x = 1$:
   $$f(1+h) = 2(1+h)^2 - 3(1+h) = 2(1 + 2h + h^2) - 3 - 3h = 2 + 4h + 2h^2 - 3 - 3h = -1 + h + 2h^2$$
2. Subtract $f(1) = -1$:
   $$f(1+h) - f(1) = (-1 + h + 2h^2) - (-1) = h + 2h^2$$
3. Divide by $h$ (since $h \neq 0$):
   $$\frac{h + 2h^2}{h} = 1 + 2h$$
4. Take the limit as $h \to 0$:
   $$\lim_{h \to 0} (1 + 2h) = 1 + 0 = \mathbf{1.0}$$
The conjecture from Exercise 2.5 is proven rigorously.

---

### Solution 2.7
1. $M(1) = \frac{1}{1+1} = \frac{1}{2} = 0.5\text{ grams}$.
2. $M(3) = \frac{3}{3+1} = \frac{3}{4} = 0.75\text{ grams}$.
3. $\Delta M = 0.75 - 0.5 = 0.25\text{ grams}$.
4. $\Delta t = 3 - 1 = 2\text{ seconds}$.
5. Average production rate:
   $$m_{\text{sec}} = \frac{0.25\text{ g}}{2\text{ s}} = \mathbf{0.125\text{ g/s}}$$

---

### Solution 2.8
1. Difference quotient:
   $$\frac{f(1+h) - f(1)}{h} = \frac{\sqrt{1+h} - 1}{h}$$
2. Rationalize the numerator by multiplying numerator and denominator by $(\sqrt{1+h} + 1)$:
   $$\frac{(\sqrt{1+h} - 1)(\sqrt{1+h} + 1)}{h(\sqrt{1+h} + 1)} = \frac{(1+h) - 1}{h(\sqrt{1+h} + 1)} = \frac{h}{h(\sqrt{1+h} + 1)}$$
3. Cancel $h$ (for $h \neq 0$):
   $$= \frac{1}{\sqrt{1+h} + 1}$$
4. Take the limit as $h \to 0$:
   $$\lim_{h \to 0} \frac{1}{\sqrt{1+h} + 1} = \frac{1}{\sqrt{1} + 1} = \frac{1}{1 + 1} = \mathbf{\frac{1}{2} = 0.5}$$
*Result:* The slope of the square root curve at $x = 1$ is exactly $0.5$.

---

### Solution 2.9
(a)
1. $A(200) = 10000 - 0.01(200)^2 = 10000 - 0.01(40000) = 10000 - 400 = 9600\text{ meters}$.
2. $A(500) = 10000 - 0.01(500)^2 = 10000 - 0.01(250000) = 10000 - 2500 = 7500\text{ meters}$.
3. $\Delta A = 7500 - 9600 = -2100\text{ meters}$.
4. $\Delta x = 500 - 200 = 300\text{ meters}$.
5. Gradient:
   $$m_{\text{sec}} = \frac{-2100\text{ m}}{300\text{ m}} = \mathbf{-7.0\text{ m/m}}$$
(b)
The flightpath angle $\theta$ below the horizontal:
$$\tan(\theta) = |-7.0| = 7.0 \implies \theta = \arctan(7.0) \approx 81.87^\circ$$
*(An extremely steep dive gradient for an aircraft!)*

---

### Solution 2.10
Consider the cubic polynomial:
$$f(x) = x^3 - 3x$$
1. Evaluate endpoints at $x = -2$ and $x = 2$:
   $$f(-2) = (-2)^3 - 3(-2) = -8 + 6 = -2$$
   $$f(2) = 2^3 - 3(2) = 8 - 6 = 2$$
2. Secant slope:
   $$m_{\text{sec}} = \frac{f(2) - f(-2)}{2 - (-2)} = \frac{2 - (-2)}{4} = \frac{4}{4} = \mathbf{+1.0}$$
3. Inside the interval:
   - At $x = 1$, $f(1) = 1 - 3 = -2$ (negative value!).
   - At $x = -1$, $f(-1) = -1 + 3 = +2$ (local peak!).
   - Near $x = 2.5$, the slope exceeds $3(2.5)^2 - 3 = 18.75 - 3 = 15.75 > 10$.
*Geometric Consequence:* A secant line only connects the two endpoints. It is completely blind to any wild oscillations, local minima, local maxima, or extreme internal slopes occurring between the points.
