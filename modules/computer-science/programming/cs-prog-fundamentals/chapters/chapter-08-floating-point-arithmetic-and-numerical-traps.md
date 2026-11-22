# Chapter 08: Floating-Point Arithmetic Traps, IEEE 754 Representation, and Non-Associativity

> "Floating-point numbers are like piles of sand; every time you move one, you lose a little sand and pick up a little dirt."  
> — Brian Kernighan

---

## 1. Introduction: The Mirage of the Real Number

In elementary mathematics, the real number line $\mathbb{R}$ is an unbroken, continuous, and infinitely dense continuum. Between any two distinct numbers $a < b$, there exist an uncountably infinite number of other real numbers. Furthermore, real numbers obey the foundational axioms of field arithmetic:
- **Associativity:** $(a + b) + c = a + (b + c)$ and $(a \times b) \times c = a \times (b \times c)$
- **Distributivity:** $a \times (b + c) = (a \times b) + (a \times c)$
- **Additive Inverses:** For every $a$, there exists $-a$ such that $a + (-a) = 0$.

When writing software, programmers intuitively assume that computer numbers behave like the real numbers of mathematics. **This assumption is flatly false.**

In digital silicon, an IEEE 754 32-bit `float` can represent at most $2^{32} = 4,294,967,296$ distinct values across the entire span from $-\infty$ to $+\infty$. A 64-bit `double` can represent $2^{64} \approx 1.84 \times 10^{19}$ values.

By the Pigeonhole Principle, squeezing the infinite continuum of real numbers into 4 billion discrete bit patterns means that **almost all real numbers cannot be represented exactly in a computer**.

When you write `let x = 0.1;` in C++, Rust, Python, or JavaScript, the machine does not store one-tenth. In binary, $0.1_{10}$ is an infinitely repeating fraction:
$$0.1_{10} = 0.00011001100110011..._2$$
The computer truncates this repeating binary expansion to 53 bits, storing:
$$0.1000000000000000055511151231257827021181583404541015625$$

This minuscule discrepancy is the source of floating-point drift, catastrophic cancellation, simulation desynchronization, and the legendary coordinate jitter that plagues open-world physics engines.

---

## 2. Unit in the Last Place (ULP) and Density Distribution

A crucial realization of floating-point arithmetic is that **floating-point numbers are not spaced evenly across the number line**.

Because floating-point numbers use scientific notation ($1.m \times 2^E$), the spacing between adjacent representable numbers scales with the magnitude of the exponent!

```
Density of Floats across the Number Line:
Dense near 0 -----------------------------------------------------> Sparse at large values
| | | | | | | | | |  |   |    |     |      |       |        |        |
0                  1         2             4                8        16
```

### 2.1 Formal Definition of ULP (Unit in the Last Place)

The **Unit in the Last Place (ULP)** is the distance between a floating-point number $x$ and the immediately next representable floating-point number:
$$\mathbf{\text{ULP}(x) = 2^{E - P + 1}}$$
where $E = \lfloor \log_2 |x| \rfloor$ is the true exponent, and $P$ is the precision ($P = 24$ bits for 32-bit single precision, $P = 53$ bits for 64-bit double precision).

#### ULP Scaling in Single-Precision (`float32`):
- For $x \in [1.0, 2.0)$: $\text{ULP} = 2^{0 - 24 + 1} = 2^{-23} \approx \mathbf{1.192 \times 10^{-7}\text{ m}}$
- For $x \in [1,024, 2,048)$: $\text{ULP} = 2^{10 - 23} = 2^{-13} \approx \mathbf{0.000122\text{ m} = 0.12\text{ mm}}$
- For $x \approx 100,000\text{ m}$ ($100\text{ km}$ from map origin):
  $$\text{ULP} = 2^{16 - 23} = 2^{-7} = \frac{1}{128} \approx \mathbf{0.00781\text{ m} \approx 7.8\text{ mm}}$$
- For $x \approx 1,000,000\text{ m}$ ($1,000\text{ km}$ from origin):
  $$\text{ULP} = 2^{19 - 23} = 2^{-4} = \frac{1}{16} = \mathbf{0.0625\text{ m} = 6.25\text{ cm}}$$

### 2.2 The Open-World Physics Jitter Problem

In large open-world games and planetary simulations, if an entity travels $1,000\text{ km}$ away from the coordinate origin $(0, 0)$ while using 32-bit floats, the smallest spatial increment the machine can represent is **$6.25\text{ centimeters}$**!
- A character trying to walk smoothly at $1.0\text{ m/s}$ cannot advance by millimeters; their position snaps discontinuously in $6\text{ cm}$ jumps!
- Collision detectors fail because contact normals jitter violently, causing characters to vibrate, sink into floors, or catapult into the sky.
- **The Modern Engineering Fix:** High-performance engines (such as Unreal Engine 5 with Large World Coordinates) use 64-bit doubles for world-space coordinates, or implement **Floating Origin Camera Relabeling** (rebasing the coordinate origin to the player's current position every frame).

---

## 3. The Four Fatal Floating-Point Traps

---

### Trap 1: Catastrophic Cancellation

**Catastrophic cancellation** occurs when two nearly equal large numbers are subtracted. Because both numbers share their leading significant bits, the subtraction cancels all accurate digits, shifting low-order rounding noise into the most significant positions!

#### The Quadratic Formula Hazard
Consider the classic quadratic equation root formula:
$$x = \frac{-b + \sqrt{b^2 - 4ac}}{2a}$$

If $b > 0$ and $b^2 \gg 4ac$, then $\sqrt{b^2 - 4ac} \approx b$.
- The numerator computes $-b + b$, subtracting two numbers that agree to 6 or 7 decimal places!
- In 32-bit floats, almost all precision is wiped out, resulting in a computed root with $100\%$ relative error!

#### The Stable Reformulation
By multiplying the numerator and denominator by the conjugate $-b - \sqrt{b^2 - 4ac}$:
$$\mathbf{x_1 = \frac{-2c}{b + \sqrt{b^2 - 4ac}}}$$
Because the denominator adds two positive numbers of the same sign, **zero cancellation occurs**, preserving full machine precision!

---

### Trap 2: Absorption (Swallowing / Underflow)

When adding a very small number $b$ to a very large number $a$, the exponent difference requires shifting $b$'s mantissa to the right to align binary points.
- If the exponent difference exceeds the mantissa bit width ($24$ bits for float, $53$ bits for double):
  $$b < a \times 2^{-24} \implies \mathbf{a + b = a}$$
- The small value $b$ is **completely absorbed (swallowed)**, as if the addition never occurred!

In physics integration, if a massive spaceship ($m = 10^7\text{ kg}$) is accelerated by a small force over a tiny time-step ($dt = 0.001\text{ s}$), adding the tiny impulse to the large momentum register can be completely absorbed, causing the ship to freeze in place!

---

### Trap 3: Non-Associativity of Addition

In computer floating-point arithmetic:
$$\mathbf{(a + b) + c \ne a + (b + c)}$$

Let:
- $a = 1.0 \times 10^8$
- $b = -1.0 \times 10^8$
- $c = 3.14159265$

Let us evaluate both grouping orders in 32-bit single precision:
1. **Order 1:** $(a + b) + c$
   $$(10^8 - 10^8) + 3.14159265 = 0.0 + 3.14159265 = \mathbf{3.14159265}$$
2. **Order 2:** $a + (b + c)$
   $$-10^8 + 3.14159265 = -100,000,000.0 \quad \text{(3.14 is swallowed by absorption!)}$$
   $$10^8 + (-10^8) = \mathbf{0.0}$$

**Profound Consequence for Multi-Threaded Physics:**  
When summing the total force or center of mass across thousands of particles using parallel multi-threaded worker pools, the order in which threads finish and accumulate their partial sums varies randomly between frames. Because floating-point addition is non-associative, **the exact same simulation run twice with identical inputs will produce different physical trajectories**!

---

### Trap 4: The Direct Equality Fallacy (`a == b`)

Because floating-point calculations accumulate rounding errors, testing for exact equality is almost always a bug:
```typescript
let sum = 0.0;
for (let i = 0; i < 10; i++) sum += 0.1;
console.log(sum === 1.0); // PRINTS FALSE! (sum = 0.9999999999999999)
```

#### The Robust Hybrid Comparison Formula
To compare two floating-point numbers $a$ and $b$, software must use a **combined absolute and relative tolerance**:

$$\mathbf{|a - b| \le \max\left(\epsilon_{\text{abs}}, \; \epsilon_{\text{rel}} \times \max(|a|, |b|)\right)}$$

```typescript
function approximatelyEqual(a: number, b: number, epsAbs: number = 1e-7, epsRel: number = 1e-5): boolean {
    const diff = Math.abs(a - b);
    if (diff <= epsAbs) return true; // Handles numbers very close to zero
    return diff <= epsRel * Math.max(Math.abs(a), Math.abs(b)); // Handles large numbers
}
```

---

## 4. Compensated Summation: The Kahan Algorithm

When accumulating thousands of small floating-point increments (such as integrating forces, evaluating particle fields, or summing numerical integrals), naive accumulation suffers severe drift from repeated absorption.

In 1965, the Canadian mathematician William Kahan (the primary architect of the IEEE 754 standard) invented **Compensated Summation**.

```
Kahan Summation Algorithm:
--------------------------
function kahanSum(numbers: Float32Array): number {
    let sum = 0.0;
    let c = 0.0; // Running compensation for lost low-order bits

    for (let i = 0; i < numbers.length; i++) {
        let y = numbers[i] - c;   // Subtract previous error compensation
        let t = sum + y;          // sum is big, y is small -> low bits of y lost!
        c = (t - sum) - y;        // (t - sum) recovers high bits of y; subtracting y recovers -lost bits!
        sum = t;
    }
    return sum;
}
```

By tracking the lost fractional bits in a separate variable `c` and feeding them back into the subsequent addition, the Kahan algorithm achieves the numerical precision of a 64-bit double while operating entirely within 32-bit single-precision floats!

---

## 5. 10 Progressive Numerical and Architectural Worked Examples

---

### Worked Example 8.1: Calculating ULP at Various Astronomical Distances
*In a space simulation using 32-bit single precision floats ($P = 24$ bits), calculate the exact Unit in the Last Place (ULP) at: (a) Earth orbital radius $r = 1.496 \times 10^{11}\text{ m}$ (1 Astronomical Unit). (b) Low Earth Orbit radius $r = 6.77 \times 10^6\text{ m}$. (c) A tabletop laboratory experiment $r = 1.50\text{ m}$.*

#### Solution
1. **ULP Formula for Float32:**
   $$\text{ULP}(x) = 2^{\lfloor \log_2 |x| \rfloor - 23}$$
2. **Part (a): 1 Astronomical Unit ($r = 1.496 \times 10^{11}\text{ m}$):**
   - Find exponent:
     $$\log_2(1.496 \times 10^{11}) = \frac{\ln(1.496 \times 10^{11})}{\ln 2} = \frac{25.731}{0.69315} \approx 37.12 \implies E = 37$$
   - Compute ULP:
     $$\text{ULP} = 2^{37 - 23} = 2^{14} = \mathbf{16,384\text{ meters} \approx 16.4\text{ km}}$$
   - At planetary distances in 32-bit floats, the smallest spatial step is **16.4 kilometers**!
3. **Part (b): Low Earth Orbit ($r = 6.77 \times 10^6\text{ m}$):**
   - Find exponent:
     $$\log_2(6.77 \times 10^6) = \frac{\ln(6.77 \times 10^6)}{\ln 2} = \frac{15.728}{0.69315} \approx 22.69 \implies E = 22$$
   - Compute ULP:
     $$\text{ULP} = 2^{22 - 23} = 2^{-1} = \mathbf{0.500\text{ meters} = 50.0\text{ cm}}$$
   - Spacecraft positions jitter by half a meter on every tick!
4. **Part (c): Tabletop Scale ($r = 1.50\text{ m}$):**
   - Find exponent:
     $$\log_2(1.50) \approx 0.585 \implies E = 0$$
   - Compute ULP:
     $$\text{ULP} = 2^{0 - 23} = 2^{-23} \approx \mathbf{1.192 \times 10^{-7}\text{ m} \approx 0.119\text{ }\mu\text{m}}$$
   - Precision is better than the wavelength of visible light!

---

### Worked Example 8.2: Catastrophic Cancellation in Vector Normalization
*Two particles have nearly identical positions: $\vec{r}_1 = (1000.005, 500.002)\text{ m}$ and $\vec{r}_2 = (1000.000, 500.000)\text{ m}$. (a) Calculate the displacement vector $\Delta\vec{r} = \vec{r}_1 - \vec{r}_2$ analytically. (b) If positions are stored with only 6 decimal digits of precision (as in single precision), show how catastrophic cancellation corrupts the displacement vector.*

#### Solution
1. **Part (a): Analytical Displacement:**
   $$\Delta\vec{r} = (1000.005 - 1000.000)\hat{i} + (500.002 - 500.000)\hat{j} = \mathbf{(0.005\,\hat{i} + 0.002\,\hat{j})\text{ m}}$$
   $$\|\Delta\vec{r}\| = \sqrt{0.005^2 + 0.002^2} = \sqrt{0.000025 + 0.000004} = \sqrt{0.000029} \approx \mathbf{0.005385\text{ m}}$$
2. **Part (b): Single-Precision Truncation:**
   - 32-bit floats have only 24 bits of mantissa ($\approx 7$ significant decimal digits).
   - $1000.005$ in 7 digits: `1000.005`.
   - But in binary, $1000.005_{10} = 1111101000.00000001010001111..._2$.
   - Truncated to 24 bits: `0x447A0029` $= 1000.0050048828125$.
   - $1000.000_{10}$: `0x447A0000` $= 1000.0000000000000$.
   - Subtraction:
     $$\Delta x = 1000.00500488 - 1000.00000000 = 0.00500488\text{ m}$$
   - For $y$: $500.002_{10} = 500.00201416$.
     $$\Delta y = 500.00201416 - 500.00000000 = 0.00201416\text{ m}$$
   - The computed distance is:
     $$\|\Delta\vec{r}_{\text{num}}\| = \sqrt{(0.00500488)^2 + (0.00201416)^2} \approx 0.005395\text{ m}$$
   - When normalized into a unit contact vector $\hat{n} = \Delta\vec{r} / \|\Delta\vec{r}\|$, the direction vector is rotated by several degrees, scattering the collision impulse in the wrong direction!

---

### Worked Example 8.3: Step-by-Step Kahan Compensated Summation Trace
*Perform a step-by-step trace of the Kahan Summation algorithm adding three numbers in an artificial decimal floating-point system with 4 decimal digits of precision:*
$$A = 100.0, \quad B = 0.0456, \quad C = 0.0423$$
*Show how the error compensation register $c$ recovers the small terms.*

#### Solution
1. **Initial State:** $\text{sum} = 0.000$, $c = 0.000$.
2. **Add $A = 100.0$:**
   - $y = A - c = 100.0 - 0.000 = 100.0$.
   - $t = \text{sum} + y = 0.000 + 100.0 = 100.0$.
   - $c = (t - \text{sum}) - y = (100.0 - 0.000) - 100.0 = 0.000$.
   - $\text{sum} = 100.0$.
3. **Add $B = 0.0456$ (Naive math would compute $100.0 + 0.0456 = 100.0$, losing all digits!):**
   - $y = B - c = 0.0456 - 0.000 = 0.0456$.
   - $t = \text{sum} + y = 100.0 + 0.0456 = 100.0$ (Truncated to 4 digits!).
   - $c = (t - \text{sum}) - y = (100.0 - 100.0) - 0.0456 = 0.000 - 0.0456 = \mathbf{-0.0456}$.
   - $\text{sum} = 100.0$.
   - **Crucial observation:** The lost $0.0456$ is safely stored in $c = -0.0456$!
4. **Add $C = 0.0423$:**
   - $y = C - c = 0.0423 - (-0.0456) = 0.0423 + 0.0456 = \mathbf{0.0879}$!
   - $t = \text{sum} + y = 100.0 + 0.0879 = \mathbf{100.1}$ (Rounded to 4 digits).
   - $c = (t - \text{sum}) - y = (100.1 - 100.0) - 0.0879 = 0.1000 - 0.0879 = \mathbf{+0.0121}$.
   - $\text{sum} = \mathbf{100.1}$.
5. **Exact Analytical Sum:**
   $$100.0 + 0.0456 + 0.0423 = 100.0879 \approx 100.1$$
   Kahan summation produced the exact rounded result $100.1$, whereas naive summation produced $100.0$!

---

### Worked Example 8.4: Quadratic Formula Stability Comparison
*Solve the quadratic equation $x^2 - 10,000x + 1 = 0$ using 4-digit decimal floating-point arithmetic. Compare the smaller root $x_2$ computed via the naive formula versus the stable rationalized formula.*

#### Solution
1. **Coefficients:** $a = 1.000$, $b = -10,000$, $c = 1.000$.
2. **Compute Discriminant:**
   $$b^2 = (-10,000)^2 = 1.000 \times 10^8$$
   $$b^2 - 4ac = 1.000 \times 10^8 - 4.000 = 1.000 \times 10^8 \quad \text{(4 is swallowed by absorption!)}$$
   $$\sqrt{b^2 - 4ac} = \sqrt{1.000 \times 10^8} = 10,000$$
3. **Naive Formula for Smaller Root:**
   $$x_2 = \frac{-b - \sqrt{b^2 - 4ac}}{2a} = \frac{-(-10,000) - 10,000}{2} = \frac{10,000 - 10,000}{2} = \frac{0}{2} = \mathbf{0.000}$$
   - The naive formula yields a completely useless root of $0$ ($100\%$ relative error)!
4. **Stable Rationalized Formula:**
   $$x_2 = \frac{2c}{-b + \sqrt{b^2 - 4ac}} = \frac{2 \times 1.000}{10,000 + 10,000} = \frac{2.000}{20,000} = \mathbf{0.0001000 = 1.000 \times 10^{-4}}$$
5. **Exact Analytical Root:**
   $$x_2 = \frac{10,000 - \sqrt{99,999,996}}{2} \approx 0.00010000000001$$
   The stable formula matches the true root to full machine precision!

---

### Worked Example 8.5: IEEE 754 Division by Zero and Special Values
*Trace the outputs and IEEE 754 types for the following floating-point operations:*
1. `let a = 1.0 / 0.0;`
2. `let b = -1.0 / 0.0;`
3. `let c = a + b;`
4. `let d = 0.0 / 0.0;`
5. `let e = Math.sqrt(-4.0);`
6. `let f = (d === d);`

#### Solution
1. `1.0 / 0.0` $\implies \mathbf{+\infty}$ (`+Infinity`, exponent all 1s, mantissa 0).
2. `-1.0 / 0.0` $\implies \mathbf{-\infty}$ (`-Infinity`, sign bit 1).
3. `a + b = (+Infinity) + (-Infinity)` $\implies \mathbf{\text{NaN}}$ (Indeterminate form).
4. `0.0 / 0.0` $\implies \mathbf{\text{NaN}}$ (Undefined operation).
5. `Math.sqrt(-4.0)` $\implies \mathbf{\text{NaN}}$ (Square root of negative real).
6. `(d === d)` $\implies \mathbf{\text{false}}$!
   - By IEEE 754 mandate, `NaN` is **never equal to anything, including itself** (`NaN === NaN` evaluates to `false`). This is the universal standard trick used to detect NaN: `if (x !== x) { /* x is NaN */ }`.

---

### Worked Example 8.6: Time Step Integration Loss over Long Durations
*A physics simulator integrates world time by executing `time += dt` inside a loop at $60\text{ FPS}$ ($\Delta t = 1/60\text{ s} \approx 0.0166667\text{ s}$) using a 32-bit single-precision float. (a) After what elapsed time does $\text{ULP}(t) \ge \Delta t$? (b) What happens to the simulation clock after that point?*

#### Solution
1. **Absorption Threshold Condition:**
   - A float addition $t + \Delta t$ completely ceases to advance when $\Delta t \le \frac{1}{2} \text{ULP}(t)$.
   - For single precision, $\text{ULP}(t) = t \times 2^{-23}$.
   - Setting $\text{ULP}(t) = \Delta t = \frac{1}{60}$:
     $$t \times 2^{-23} = \frac{1}{60} \implies t = \frac{2^{23}}{60} = \frac{8,388,608}{60} \approx \mathbf{139,810\text{ seconds}}$$
2. **Convert to Hours:**
   $$\text{Hours} = \frac{139,810\text{ s}}{3,600\text{ s/hour}} \approx \mathbf{38.8\text{ hours}}$$
3. **Part (b): The Simulation Clock Freeze:**
   - After running for approximately 38.8 hours, $t + \Delta t$ evaluates to $t$ identically.
   - **The simulation clock stops moving forward completely!** Time freezes forever, while the CPU continues executing at 100% load.
   - **The Fix:** Always use a 64-bit integer tick counter: `tickCount: bigint = 0n; tickCount++; time = Number(tickCount) * dt;`.

---

### Worked Example 8.7: Fast-Math Compiler Flag Hazards
*A compiler flag `-ffast-math` allows the compiler to transform $x / y$ into $x \times (1.0 / y)$, computing the reciprocal once. In a contact impulse solver, two colliding bodies have masses $m_1 = 1.0\text{ kg}$ and $m_2 = 3.0\text{ kg}$. (a) Calculate the normal impulse using exact division $v_{\text{rel}} / (1/m_1 + 1/m_2)$ for $v_{\text{rel}} = 10.0\text{ m/s}$. (b) Calculate the result when the compiler uses reciprocal multiplication with single precision. (c) What is the resulting momentum conservation error?*

#### Solution
1. **Part (a): Exact Formulation:**
   - $w_{\text{total}} = 1/1.0 + 1/3.0 = 1.0 + 0.33333333 = 1.33333333\text{ kg}^{-1}$.
   - Exact division:
     $$J = \frac{10.0}{1.33333333} = \mathbf{7.5000000\text{ N}\cdot\text{s}}$$
2. **Part (b): Fast-Math Reciprocal Approximation:**
   - The compiler computes reciprocal: $R = 1.0 / 1.33333333 \approx 0.7500000$.
   - However, if the compiler optimizes $1/3.0$ as $0.33333334$:
     $$w_{\text{total}} = 1.33333334 \implies \text{reciprocal } R = 0.74999994$$
     $$J_{\text{fast}} = 10.0 \times 0.74999994 = \mathbf{7.4999994\text{ N}\cdot\text{s}}$$
3. **Part (c): Momentum Invariant Error:**
   - Over millions of contact iterations, this tiny $6.0 \times 10^{-7}\text{ N}\cdot\text{s}$ error accumulates, causing rigid bodies resting on floors to drift laterally or slowly gain artificial kinetic energy (spontaneous ghost sliding).

---

### Worked Example 8.8: Branchless Floating-Point Sign Extraction via Bit Manipulation
*On x86-64, an IEEE 754 32-bit float has its sign bit at bit 31. Write the bitwise mask operation in C++ to extract the sign bit as an integer $+1$ or $-1$ without branching, and verify for $v = -4.50$.*

#### Solution
1. **Bitwise Extraction:**
   - Reinterpret the 32-bit float bits as an unsigned integer `uint32_t u = *(uint32_t*)&v`.
   - The sign bit is at position 31:
     $$\text{signBit} = u \gg 31$$
   - If $v \ge 0$, $\text{signBit} = 0 \implies \text{sign} = 1 - 2(0) = +1$.
   - If $v < 0$, $\text{signBit} = 1 \implies \text{sign} = 1 - 2(1) = -1$.
2. **The Formula:**
   $$\mathbf{\text{sign}(v) = 1 - 2 \times ((*(uint32\_t*)\&v) \gg 31)}$$
3. **Verify for $v = -4.50$:**
   - $v = -4.50 \implies \text{MSB is } 1$.
   - $u \gg 31 = 1$.
   - $\text{Result} = 1 - 2(1) = \mathbf{-1}$.
   Executes in a single clock cycle with zero branch hazards!

---

### Worked Example 8.9: Bounding Box Epsilon Inflation
*In collision detection, an Axis-Aligned Bounding Box (AABB) has bounds $[x_{\min}, x_{\max}]$. Due to floating-point truncation, a particle traveling directly on the boundary ($x = x_{\max}$) may fail the test `if (x >= min && x <= max)` due to roundoff. If the object coordinate is $x = 500.0\text{ m}$, calculate the necessary epsilon inflation factor $\epsilon$ to guarantee robust enclosure.*

#### Solution
1. **Find ULP at $x = 500.0\text{ m}$:**
   - $\log_2(500) \approx 8.966 \implies E = 8$.
   - In single precision:
     $$\text{ULP} = 2^{8 - 23} = 2^{-15} = \frac{1}{32,768} \approx 3.05 \times 10^{-5}\text{ m} \approx 0.0305\text{ mm}$$
2. **Safety Inflation Factor:**
   - Standard practice inflates the bounding box by at least $4 \times \text{ULP}$ to account for compound arithmetic operations:
     $$\epsilon = 4 \times \text{ULP} \approx 4 \times (3.05 \times 10^{-5}) \approx \mathbf{1.22 \times 10^{-4}\text{ m} = 0.122\text{ mm}}$$
3. **Inflated Bounding Box:**
   $$x_{\min}' = x_{\min} - \epsilon, \quad x_{\max}' = x_{\max} + \epsilon$$
   This guarantees that numerical roundoff never causes a false-negative collision miss!

---

### Worked Example 8.10: Demonstrating Non-Distributivity in Silicon
*Evaluate the mathematical identity $a \times (b + c) = (a \times b) + (a \times c)$ using IEEE 754 single-precision floats for:*
$$a = 1.0 \times 10^{20}, \quad b = 1.0 \times 10^{20}, \quad c = -1.0 \times 10^{20}$$
*Demonstrate how non-distributivity causes an overflow to infinity on one side while the other side evaluates cleanly.*

#### Solution
1. **Evaluate Left-Hand Side: $\text{LHS} = a \times (b + c)$:**
   $$b + c = 1.0 \times 10^{20} + (-1.0 \times 10^{20}) = 0.0$$
   $$\text{LHS} = a \times 0.0 = (1.0 \times 10^{20}) \times 0.0 = \mathbf{0.0}$$
2. **Evaluate Right-Hand Side: $\text{RHS} = (a \times b) + (a \times c)$:**
   - Single-precision float maximum representable value is:
     $$\text{Float}_{\max} = (2 - 2^{-23}) \times 2^{127} \approx 3.4028 \times 10^{38}$$
   - First term:
     $$a \times b = (1.0 \times 10^{20}) \times (1.0 \times 10^{20}) = 1.0 \times 10^{40}$$
   - Because $1.0 \times 10^{40} > 3.4028 \times 10^{38}$, **overflow occurs**!
     $$a \times b = +\infty$$
   - Second term:
     $$a \times c = (1.0 \times 10^{20}) \times (-1.0 \times 10^{20}) = -1.0 \times 10^{40} = -\infty$$
   - Sum:
     $$\text{RHS} = (+\infty) + (-\infty) = \mathbf{\text{NaN}}$$
3. **Conclusion:**
   $$\text{LHS} = 0.0 \quad \ne \quad \text{RHS} = \text{NaN}$$
   The distributive property of mathematics **completely fails** in computer floating-point hardware!

---

## 6. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 8.1:** Why does testing floating-point numbers with direct equality (`a == b`) almost always lead to software defects?  
**Exercise 8.2:** What is Catastrophic Cancellation, and what type of arithmetic operation triggers it?

### Tier 2: Quantitative Mechanics & ULP
**Exercise 8.3:** Calculate the Unit in the Last Place (ULP) for a 32-bit float holding the value $x = 64.0\text{ m}$.  
**Exercise 8.4:** A 64-bit double has 53 bits of significand. Calculate its machine epsilon $\epsilon_{\text{mach}} = 2^{-52}$ in decimal scientific notation.

### Tier 3: Numerical Stability & Algorithms
**Exercise 8.5:** The Euclidean norm of a 2D vector is computed as $\|\vec{v}\| = \sqrt{x^2 + y^2}$. If $x = 1.0 \times 10^{25}$ and $y = 1.0 \times 10^{25}$, explain why naive squaring triggers overflow in 32-bit floats, and write the stable implementation using `hypot(x, y)`.  
**Exercise 8.6:** In a physics engine, an accumulator sums the mass of $1,000,000$ particles of mass $m = 0.001\text{ kg}$. If standard naive 32-bit float addition is used, explain why the final sum is significantly less than the true answer of $1,000.0\text{ kg}$, and state the algorithmic remedy.

### Tier 4: Compiler Optimizations & Architecture
**Exercise 8.7:** Explain why enabling the GCC compiler flag `-ffast-math` can cause a deterministic multiplayer game to desynchronize between an Intel CPU client and an ARM CPU client.  
**Exercise 8.8:** Write a robust floating-point comparison function in TypeScript that correctly returns `true` when comparing $0.1 + 0.2$ with $0.3$.

### Tier 5: Olympiad / Research Challenge
**Exercise 8.9:** Exact Geometric Predicates (Shewchuk's Algorithm): In computational geometry, determining whether a 2D point $C$ lies to the left or right of a directed line $AB$ requires evaluating the $2 \times 2$ determinant:
$$\det = (A_x - C_x)(B_y - C_y) - (A_y - C_y)(B_x - C_x)$$
Prove that when point $C$ lies almost exactly on line $AB$, floating-point roundoff can flip the computed sign of the determinant, causing Delaunay triangulation algorithms to enter infinite topological loops. Explain how Jonathan Shewchuk's Adaptive Precision Floating-Point Arithmetic solves this problem.  
**Exercise 8.10:** Posit Arithmetic (The Unum Format): In 2017, John Gustafson proposed the **Posit arithmetic format** as a direct mathematical replacement for IEEE 754 floats. Explain how the dynamic "regime" bits in a posit provide tapered precision (yielding more precision bits near 1.0 and fewer bits at extreme scales), and prove why posits achieve higher accuracy than IEEE 754 floats of the identical bit width.

---

## 7. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 8.1
Because computers represent numbers in base 2, common base-10 fractions (such as $0.1$ or $0.2$) have infinitely repeating binary expansions that cannot be represented exactly. Intermediate calculations accumulate tiny rounding errors in their lowest bits. Therefore, two mathematically equivalent paths (e.g., $0.1 + 0.2$ vs $0.3$) evaluate to slightly different bit patterns (`0.30000000000000004` vs `0.3`). A direct equality test checks for exact bit-for-bit equivalence and evaluates to `false`, causing logic failure.

---

### Solution to Exercise 8.2
Catastrophic cancellation occurs when two nearly equal numbers of large magnitude are subtracted from one another ($a - b$ where $a \approx b$). Because the leading significant digits match, the subtraction cancels all accurate digits, shifting the un-calculated low-order rounding noise into the most significant positions of the result, causing a catastrophic loss of significant precision.

---

### Solution to Exercise 8.3
1. For $x = 64.0$: $\log_2(64) = 6 \implies$ True exponent $E = 6$.
2. In single precision (24 bits of mantissa):
   $$\text{ULP}(64.0) = 2^{E - 23} = 2^{6 - 23} = 2^{-17} = \frac{1}{131,072} \approx \mathbf{7.629 \times 10^{-6}\text{ m}}$$

---

### Solution to Exercise 8.4
$$\epsilon_{\text{mach}} = 2^{-52} = \frac{1}{4,503,599,627,370,496} \approx \mathbf{2.220446 \times 10^{-16}}$$
(Double-precision floating-point numbers provide approximately 15 to 17 decimal digits of precision).

---

### Solution to Exercise 8.5
1. **The Overflow Hazard:**
   - Single precision max value is $\approx 3.4 \times 10^{38}$.
   - For $x = 10^{25}$, $x^2 = 10^{50} \gg 3.4 \times 10^{38}$.
   - Squaring $x$ overflows directly to $+\infty$!
   - $\sqrt{\infty + \infty} = \sqrt{\infty} = +\infty$ (Calculation completely fails).
2. **Stable Implementation (`hypot`):**
   - Factor out the larger component:
     $$\text{hypot}(x, y) = |x| \sqrt{1 + (y/x)^2} \quad (\text{assuming } |x| \ge |y|)$$
   - $(y/x) \le 1$, so $(y/x)^2 \le 1$.
   - Squaring a fraction $\le 1$ can never overflow!
   - The result evaluates to $10^{25} \sqrt{2} \approx \mathbf{1.414 \times 10^{25}}$ with zero overflow!

---

### Solution to Exercise 8.6
1. **The Absorption Problem:**
   As the running sum reaches $100.0\text{ kg}$, adding $0.001\text{ kg}$ requires an exponent shift. In single precision, the lower bits of $0.001$ are continuously truncated by absorption on every step. By the time the sum reaches $500\text{ kg}$, adding $0.001$ is completely swallowed ($500.0 + 0.001 = 500.0$), and the accumulator ceases to grow!
2. **Algorithmic Remedy:**
   Use the **Kahan Compensated Summation Algorithm** (which tracks lost low-order bits in an error register) or accumulate in a 64-bit `double`!

---

### Solution to Exercise 8.7
The flag `-ffast-math` instructs the compiler to disregard IEEE 754 standards. It reorders floating-point additions assuming associativity, fuses multiplications into FMA instructions differently depending on the CPU instruction set, and replaces divisions with reciprocal approximations. Because Intel x86 and ARM have different hardware reciprocal accuracy and different instruction pipelines, the two clients will compute slightly different float coordinates. Over a few seconds, the butterfly effect of chaos causes the two game simulations to diverge completely!

---

### Solution to Exercise 8.8
```typescript
function areFloatsEqual(a: number, b: number, epsilon: number = 1e-9): boolean {
    return Math.abs(a - b) < epsilon;
}
console.log(areFloatsEqual(0.1 + 0.2, 0.3)); // Returns TRUE!
```

---

### Solution to Exercise 8.9
1. **The Hazard:**
   When $C$ is nearly collinear with $AB$, the determinant $\det = (A_x - C_x)(B_y - C_y) - (A_y - C_y)(B_x - C_x) \approx 0$.
   Because of floating-point rounding errors, the computed value may evaluate to $+10^{-16}$ when the true geometric orientation is $-10^{-18}$.
2. **Consequences:**
   The algorithm concludes that $C$ is to the left of $AB$ when it is actually to the right, creating inverted, self-intersecting triangles and causing Delaunay triangulation algorithms to loop infinitely or crash.
3. **Shewchuk's Solution:**
   Shewchuk's algorithm computes an initial fast floating-point estimate along with a strict error bound. If the error bound overlaps zero, it automatically escalates to multi-precision exact arithmetic using expansion floats, guaranteeing exact geometric consistency with zero roundoff failure!
   $$\blacksquare$$

---

### Solution to Exercise 8.10
1. **Posit Representation:** Unlike IEEE 754 (which fixes exponent bits to 8 or 11), Posits use a variable-length **Regime field**.
2. **Tapered Precision:**
   - For numbers near 1.0 (where the vast majority of real-world calculations occur), the regime field requires only 2 bits, leaving almost the entire word for **mantissa precision** (up to 28 bits of precision in a 32-bit posit, vs 23 bits in IEEE 754)!
   - For extreme numbers, the regime expands and mantissa shrinks.
3. **Mathematical Advantage:**
   Posits provide **more significant digits of accuracy** where it matters most, eliminate subnormal performance traps, and guarantee zero overflow/underflow exceptions!
   $$\blacksquare$$
