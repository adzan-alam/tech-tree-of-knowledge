# CHAPTER 7: Direction Pure and Simple — Unit Vectors & Normalization

---

## 7.1 The Need for Pure Direction: Decoupling Speed from Heading

Imagine you are programming a video game or an autonomous defense turret.

A player presses the trigger on their controller. The gun must fire a bullet that travels at a muzzle speed of exactly $s = 400\text{ meters/second}$ toward an enemy located at coordinates $(60, 80)$.

How do you calculate the bullet's velocity vector $\vec{v}_{\text{bullet}}$?

If you simply use the displacement vector to the enemy:
$$\vec{v}_{\text{bullet}} = \begin{bmatrix} 60 \\ 80 \end{bmatrix}$$
The bullet will travel with a speed of:
$$\|\vec{v}\| = \sqrt{60^2 + 80^2} = \sqrt{3600 + 6400} = \sqrt{10,000} = 100\text{ m/s}$$
That is four times too slow! 

Worse, what if the enemy was far away at $(600, 800)$? Then your bullet would travel at $1,000\text{ m/s}$! The farther away the enemy stood, the faster the bullet would fly—a completely ridiculous, broken game world.

In physics and simulation, you constantly need to **decouple direction from magnitude**:
1. You need a way to strip away the length of an arrow, leaving **pure, unadulterated direction**.
2. Then, you can multiply that pure direction by whatever speed, force, or distance you desire.

This process is called **Vector Normalization**, and the resulting arrow of pure direction is called a **Unit Vector**.

---

## 7.2 The Definition of a Unit Vector ($\|\hat{u}\| \equiv 1.0$)

A **Unit Vector** is defined as any vector whose Euclidean magnitude is identically equal to one:

$$\|\hat{u}\| = 1.0$$

```
                           Y ^
                             │
                             │
                             │       ● (0.6, 0.8)
                             │      /│
                             │  1.0/ │ 0.8
                             │    /  │
                             │   /   │
                             │  /    │
         ────────────────────┼─●─────┴──────► X
                            0│  0.6
                             │
       FIGURE 7.1: A Unit Vector on the Unit Circle.
       Length is exactly 1.0. Its tip always touches the circle.
```

### The "Hat" Notation Revisited
Whenever a vector is a unit vector, we replace the arrow symbol ($\vec{u}$) with a circumflex "hat" symbol: **$\hat{u}$** (pronounced *"u-hat"*).
- $\vec{v}$ represents a vector of *arbitrary* length.
- $\hat{v}$ represents a vector of *strictly unit length* ($1.0$).

All unit vectors in 2D space have their tips resting precisely on the circumference of a circle centered at the Origin with radius $R = 1.0$—the celebrated **Unit Circle**.

---

## 7.3 The Normalization Formula: Derivation

How do you take an arbitrary arrow $\vec{v}$ of length $\|\vec{v}\|$ and shrink or stretch it so its new length is exactly $1.0$?

Think of ordinary numbers:
- If you have the number $15$, what do you divide it by to turn it into $1$? $\to$ You divide it by $15$!
- If you have a measuring tape that is $5\text{ meters}$ long, what factor do you scale it by to get $1\text{ meter}$? $\to$ You multiply by $\frac{1}{5}$!

Similarly, to normalize any non-zero vector $\vec{v}$, you simply **divide the vector by its own scalar magnitude**:

$$\hat{v} = \frac{\vec{v}}{\|\vec{v}\|} = \frac{1}{\|\vec{v}\|} \vec{v}$$

In component form:

$$\hat{v} = \begin{bmatrix} \frac{v_x}{\|\vec{v}\|} \\ \frac{v_y}{\|\vec{v}\|} \end{bmatrix} = \begin{bmatrix} \frac{v_x}{\sqrt{v_x^2 + v_y^2}} \\ \frac{v_y}{\sqrt{v_x^2 + v_y^2}} \end{bmatrix}$$

---

## 7.4 Complete, Unbroken Algebraic Proof that $\|\hat{v}\| \equiv 1.0$

Let us prove mathematically, with zero skipped algebraic steps, that dividing any non-zero vector by its magnitude *guarantees* that the result has a length of $1.0$.

### The Proof
Let $\vec{v} = (v_x, v_y)$ with magnitude $\|\vec{v}\| = \sqrt{v_x^2 + v_y^2} \ne 0$.

1. By definition of scalar multiplication, the normalized vector is:
   $$\hat{v} = \left( \frac{v_x}{\|\vec{v}\|}, \frac{v_y}{\|\vec{v}\|} \right)$$

2. Calculate the magnitude of $\hat{v}$ using the Euclidean norm formula:
   $$\|\hat{v}\| = \sqrt{\left(\frac{v_x}{\|\vec{v}\|}\right)^2 + \left(\frac{v_y}{\|\vec{v}\|}\right)^2}$$

3. Square the fractions:
   $$\|\hat{v}\| = \sqrt{\frac{v_x^2}{\|\vec{v}\|^2} + \frac{v_y^2}{\|\vec{v}\|^2}}$$

4. Combine the terms over the common denominator $\|\vec{v}\|^2$:
   $$\|\hat{v}\| = \sqrt{\frac{v_x^2 + v_y^2}{\|\vec{v}\|^2}}$$

5. But recall the definition of vector magnitude: $\|\vec{v}\|^2 = v_x^2 + v_y^2$! Substitute this into the numerator:
   $$\|\hat{v}\| = \sqrt{\frac{\|\vec{v}\|^2}{\|\vec{v}\|^2}}$$

6. Any non-zero quantity divided by itself equals $1$:
   $$\|\hat{v}\| = \sqrt{1} = 1.0$$

**Q.E.D. (Quod Erat Demonstrandum).** 
The length of $\hat{v}$ is identically, unconditionally $1.0$.

---

## 7.5 Setting Arbitrary Speeds: The Director Formula

Once you have a unit vector $\hat{u}$ representing pure direction, you can create a vector of **any desired magnitude $s$** simply by scaling $\hat{u}$:

$$\vec{v}_{\text{desired}} = s \cdot \hat{u} = s \left( \frac{\vec{v}}{\|\vec{v}\|} \right)$$

Returning to our bullet example:
- Enemy displacement: $\vec{d} = (60, 80)\text{ m}$.
- Magnitude: $\|\vec{d}\| = \sqrt{60^2 + 80^2} = 100\text{ m}$.
- Unit direction vector:
  $$\hat{d} = \frac{(60, 80)}{100} = (0.6, 0.8)$$
- Desired bullet speed: $s = 400\text{ m/s}$.
- Bullet velocity vector:
  $$\vec{v}_{\text{bullet}} = 400 \times (0.6, 0.8) = (240, 320)\text{ m/s}$$
- Double check speed:
  $$\|\vec{v}_{\text{bullet}}\| = \sqrt{240^2 + 320^2} = \sqrt{57,600 + 102,400} = \sqrt{160,000} = 400\text{ m/s}!$$
The bullet travels at exactly $400\text{ m/s}$ straight toward the target.

---

## 7.6 Socratic Dialogue: The Zero-Vector Catastrophe

> **Alice:** "This formula is so clean! Does it work for every vector?"
>
> **The Vectorist:** "For every vector... except ONE."
>
> **Alice:** "Which one?"
>
> **The Vectorist:** "The Zero Vector: $\vec{0} = (0, 0)$."
>
> **Alice:** "What happens if we plug $(0, 0)$ into the formula?"
>
> **The Vectorist:** "Watch:
> 1. Magnitude of zero vector: $\|\vec{0}\| = \sqrt{0^2 + 0^2} = 0$.
> 2. Normalization formula:
>    $$\hat{0} = \frac{\vec{0}}{\|\vec{0}\|} = \frac{(0, 0)}{0} = \left(\frac{0}{0}, \frac{0}{0}\right)$$
> What is zero divided by zero, Alice?"
>
> **Alice:** "It's undefined! A mathematical catastrophe!"
>
> **The Vectorist:** "Exactly. In a computer program, $0/0$ produces `NaN` (*Not-a-Number*). 
> Think about it physically: What is the 'direction' of an object that has not moved? It doesn't have one! A stationary point has no heading. You cannot normalize the zero vector."

---

## 7.7 Ten Concrete Worked Numerical Examples: Normalization

---

### Example 1: Normalizing the 3–4–5 Vector
* **Problem:** Find the unit vector $\hat{v}$ pointing in the direction of $\vec{v} = (3, 4)$.
* **Calculation:**
  1. Magnitude: $\|\vec{v}\| = \sqrt{3^2 + 4^2} = \sqrt{25} = 5$.
  2. Divide components:
     $$\hat{v} = \begin{bmatrix} 3 / 5 \\ 4 / 5 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}$$
* **Verification:**
  $$\|\hat{v}\| = \sqrt{0.6^2 + 0.8^2} = \sqrt{0.36 + 0.64} = \sqrt{1.0} = 1.0$$

---

### Example 2: Normalizing the 5–12–13 Vector
* **Problem:** Normalize $\vec{u} = (-5, 12)$.
* **Calculation:**
  1. $\|\vec{u}\| = \sqrt{(-5)^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13$.
  2. Unit vector:
     $$\hat{u} = \left( -\frac{5}{13}, \frac{12}{13} \right) \approx (-0.3846, +0.9231)$$
* **Verification:**
  $$\left(-\frac{5}{13}\right)^2 + \left(\frac{12}{13}\right)^2 = \frac{25 + 144}{169} = \frac{169}{169} = 1.0$$

---

### Example 3: Normalizing a Purely Horizontal Vector
* **Problem:** Normalize $\vec{v} = (7, 0)$.
* **Calculation:**
  1. $\|\vec{v}\| = \sqrt{7^2 + 0^2} = 7$.
  2. $\hat{v} = (7/7, 0/7) = (1, 0) = \hat{i}$.
* **Law:** Normalizing any positive Eastward vector always yields the standard basis vector $\hat{i}$.

---

### Example 4: Normalizing a Purely Vertical Negative Vector
* **Problem:** Normalize $\vec{w} = (0, -15)$.
* **Calculation:**
  1. $\|\vec{w}\| = \sqrt{0^2 + (-15)^2} = 15$.
  2. $\hat{w} = (0/15, -15/15) = (0, -1) = -\hat{j}$.
* **Law:** Normalizing any Southward vector always yields $-\hat{j}$.

---

### Example 5: Normalizing a $45^\circ$ Symmetric Diagonal
* **Problem:** Normalize $\vec{d} = (8, 8)$.
* **Calculation:**
  1. $\|\vec{d}\| = \sqrt{8^2 + 8^2} = \sqrt{64 + 64} = \sqrt{128} = 8\sqrt{2}$.
  2. $\hat{d} = \left(\frac{8}{8\sqrt{2}}, \frac{8}{8\sqrt{2}}\right) = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right) = \left(\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}\right) \approx (0.7071, 0.7071)$.
* **Verification:**
  $$(0.70710678)^2 + (0.70710678)^2 = 0.5 + 0.5 = 1.0$$

---

### Example 6: Normalizing a Negative Quadrant III Vector
* **Problem:** Normalize $\vec{s} = (-24, -7)$.
* **Calculation:**
  1. $\|\vec{s}\| = \sqrt{(-24)^2 + (-7)^2} = \sqrt{576 + 49} = \sqrt{625} = 25$.
  2. $\hat{s} = \left(-\frac{24}{25}, -\frac{7}{25}\right) = (-0.96, -0.28)$.
* **Verification:**
  $$(-0.96)^2 + (-0.28)^2 = 0.9216 + 0.0784 = 1.0000$$

---

### Example 7: Launching an Autonomous Drone at Set Speed
* **Problem:** A search-and-rescue drone at base $A(10, 10)$ must fly directly toward an emergency beacon at $B(70, 90)$. The drone's cruising speed is $s = 15\text{ m/s}$. Write the velocity vector $\vec{v}_{\text{drone}}$.
* **Calculation:**
  1. Displacement vector: $\vec{AB} = (70 - 10, 90 - 10) = (60, 80)\text{ m}$.
  2. Distance: $\|\vec{AB}\| = \sqrt{60^2 + 80^2} = 100\text{ m}$.
  3. Direction unit vector: $\hat{u} = \frac{(60, 80)}{100} = (0.6, 0.8)$.
  4. Scaled velocity:
     $$\vec{v}_{\text{drone}} = 15 \times (0.6, 0.8) = (9.0, 12.0)\text{ m/s}$$

---

### Example 8: Checking if a Given Vector is Already a Unit Vector
* **Problem:** Is $\vec{u} = (0.5, 0.5)$ a unit vector?
* **Calculation:**
  $$\|\vec{u}\| = \sqrt{0.5^2 + 0.5^2} = \sqrt{0.25 + 0.25} = \sqrt{0.50} \approx 0.7071$$
* **Conclusion:** **NO!** Even though the numbers are small decimals, its length is $0.7071 \ne 1.0$.

---

### Example 9: The Safe Normalization Algorithm in TypeScript
* **Problem:** Write an industrial-grade normalization function that handles zero vectors without crashing.
* **Code Implementation:**
  ```typescript
  class Vector2D {
    constructor(public x: number, public y: number) {}

    public normalizeSafe(epsilon: number = 1e-7): Vector2D {
      const lenSq = this.x * this.x + this.y * this.y;
      // Guard against division by zero!
      if (lenSq <= epsilon * epsilon) {
        return new Vector2D(0, 0); // Graceful zero fallback
      }
      const invLen = 1.0 / Math.sqrt(lenSq);
      return new Vector2D(this.x * invLen, this.y * invLen);
    }
  }
  ```

---

### Example 10: Quake III Arena's Fast Inverse Square Root (`Q_rsqrt`)
* **Problem:** Why did 3D game engines in 1999 care so deeply about normalization?
* **Historical Deep Dive:**
  Normalizing a vector requires multiplying by $\frac{1}{\sqrt{x}}$ (the *Inverse Square Root*).
  $$\hat{v} = \vec{v} \times \frac{1}{\sqrt{v_x^2 + v_y^2}}$$
  In 1999, the Intel Pentium CPU took over 40 clock cycles to compute a floating-point division and square root. Doing this for thousands of 3D polygon light vectors caused games to crawl at 10 FPS.
  
  In the source code of **Quake III Arena**, legendary programmer **John Carmack** and Silicon Graphics hardware designers utilized a legendary bit-hack:
  ```c
  float Q_rsqrt(float number) {
      long i;
      float x2, y;
      const float threehalfs = 1.5F;

      x2 = number * 0.5F;
      y  = number;
      i  = * ( long * ) &y;                       // evil floating point bit-level hacking
      i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
      y  = * ( float * ) &i;
      y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration Newton-Raphson approximation
      return y;
  }
  ```
  By treating the floating-point IEEE-754 bit-pattern as an integer, subtracting it from the magic hexadecimal constant `0x5f3759df`, and running a single step of Newton's method, the engine computed $\frac{1}{\sqrt{x}}$ **400% faster** with an accuracy error of less than $0.1\%$!

---

## 7.8 Debunked Misconceptions & Traps

### Misconception 1: "Normalizing a unit vector changes it."
* **The Reality (Idempotence):** Normalizing an arrow that already has length $1.0$ leaves it completely untouched:
  $$\hat{v} = \frac{\hat{v}}{\|\hat{v}\|} = \frac{\hat{v}}{1.0} = \hat{v}$$
  Normalization is an **Idempotent** operation: `normalize(normalize(v)) == normalize(v)`.

### Software Trap: Floating-Point Roundoff (`len !== 1.0`)
Due to binary floating-point representation:
`0.6 * 0.6 + 0.8 * 0.8 = 0.36 + 0.64 = 1.0` (exact in base 10).
However, for $(1/\sqrt{2}, 1/\sqrt{2})$:
`Math.sqrt(x*x + y*y) === 0.9999999999999999`!
Never test if a vector is a unit vector using:
`if (v.magnitude() === 1.0)` $\to$ **This will fail!**
Always test using an epsilon tolerance:
`Math.abs(v.magnitude() - 1.0) < 1e-6`.

---

## 7.9 Historical Context: Josiah Willard Gibbs & The Unit Circle

The notation of placing a "hat" over a vector ($\hat{i}, \hat{j}, \hat{u}$) was popularized by **Josiah Willard Gibbs** in his 1881 privately printed pamphlet *Elements of Vector Analysis* for his Yale graduate physics students.

Gibbs recognized that unit vectors act as the coordinate compass of space. In his lectures, he emphasized:
> *"The magnitude of a vector is a pure number carrying physical units; the unit vector is the pure spatial director."*

By splitting every physical vector $\vec{v}$ into a scalar magnitude times a spatial unit vector:
$$\vec{v} = \|\vec{v}\| \hat{v}$$
Gibbs provided physics with the mathematical framework used today in Einstein's General Relativity, Maxwell's Electrodynamics, and modern quantum mechanics.

---

## 7.10 Chapter 7 Mastery Problem Set

Consolidate your mastery of unit vectors and normalization with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Determine the magnitude of each vector and state whether it is already a **Unit Vector**:
   - (a) $\vec{a} = (1, 0)$
   - (b) $\vec{b} = (0.6, 0.8)$
   - (c) $\vec{c} = (0.7, 0.7)$
   - (d) $\vec{d} = (0, -1)$

2. **[Tier 1 - Class 6]** Normalize the vector $\vec{v} = (6, 8)$. Show all algebraic steps.

3. **[Tier 2 - Class 7]** Normalize the vector $\vec{u} = (-8, 15)$. Verify that the length of the result is $1.0$.

4. **[Tier 2 - Class 7]** An autonomous vacuum robot is at position $(5, 2)$. It detects dirt at position $(17, 7)$.
   - Calculate the displacement vector to the dirt.
   - Calculate the unit direction vector $\hat{u}$ pointing toward the dirt.

5. **[Tier 3 - Class 8]** A laser turret needs to shoot a beam of light with velocity magnitude $c = 300,000\text{ km/s}$ along the direction of vector $\vec{d} = (1, 1)$.
   - Calculate the unit direction vector $\hat{d}$.
   - Write the exact velocity vector $\vec{v}_{\text{laser}}$ in $\text{km/s}$.

6. **[Tier 3 - Class 8]** Find the unit vector that points in the exact opposite direction of $\vec{w} = (-20, 21)$.

7. **[Tier 4 - High School]** A soccer player passes a ball to a teammate. The ball moves with velocity $\vec{v} = (12, -16)\text{ m/s}$.
   - Find the ball's speed.
   - Decompose the velocity vector into the form $\vec{v} = s \hat{u}$, where $s$ is the scalar speed and $\hat{u}$ is a unit vector.

8. **[Tier 4 - High School]** A particle moves in 2D space such that its unit direction vector is $\hat{u} = (x, 0.8)$. If $\hat{u}$ is located in Quadrant II, find the exact value of $x$.

9. **[Tier 5 - University / Game Dev]** A 2D game AI steering system calculates two forces acting on a non-player character (NPC):
   - Path-following force: $\vec{F}_{\text{path}} = (40, 30)$
   - Obstacle avoidance force: $\vec{F}_{\text{avoid}} = (-10, 20)$
   - Calculate the combined force $\vec{F}_{\text{total}}$.
   - The NPC's motor thrusters have a maximum rated acceleration of $a_{\text{max}} = 5.0\text{ m/s}^2$. If the NPC mass is $m = 1.0\text{ kg}$, calculate the clamped acceleration vector:
     $$\vec{a} = a_{\text{max}} \cdot \frac{\vec{F}_{\text{total}}}{\|\vec{F}_{\text{total}}\|}$$

10. **[Tier 5 - Robotics]** An industrial robotic arm must travel from $A(0.2, 0.4)\text{ m}$ toward $B(0.8, 1.2)\text{ m}$ at a constant operational speed of $v = 0.50\text{ m/s}$.
    - Compute the unit trajectory vector $\hat{t}$.
    - If a micro-controller updates the arm's position every $\Delta t = 0.01\text{ seconds}$, calculate the incremental position step vector:
      $$\Delta\vec{p} = (v \cdot \Delta t) \hat{t}$$

---

### Step-by-Step Solutions

#### Solution 1:
- (a) $\|\vec{a}\| = \sqrt{1^2 + 0^2} = 1.0 \implies$ **YES, Unit Vector**.
- (b) $\|\vec{b}\| = \sqrt{0.6^2 + 0.8^2} = \sqrt{0.36 + 0.64} = \sqrt{1.0} = 1.0 \implies$ **YES, Unit Vector**.
- (c) $\|\vec{c}\| = \sqrt{0.7^2 + 0.7^2} = \sqrt{0.49 + 0.49} = \sqrt{0.98} \approx 0.9899 \ne 1.0 \implies$ **NO**.
- (d) $\|\vec{d}\| = \sqrt{0^2 + (-1)^2} = \sqrt{1} = 1.0 \implies$ **YES, Unit Vector**.

#### Solution 2:
- Magnitude:
  $$\|\vec{v}\| = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10$$
- Normalized vector:
  $$\hat{v} = \frac{(6, 8)}{10} = \left(\frac{6}{10}, \frac{8}{10}\right) = (0.6, 0.8)$$

#### Solution 3:
- Magnitude:
  $$\|\vec{u}\| = \sqrt{(-8)^2 + 15^2} = \sqrt{64 + 225} = \sqrt{289} = 17$$
- Unit vector:
  $$\hat{u} = \left(-\frac{8}{17}, \frac{15}{17}\right) \approx (-0.4706, +0.8824)$$
- Verification:
  $$\left(-\frac{8}{17}\right)^2 + \left(\frac{15}{17}\right)^2 = \frac{64 + 225}{289} = \frac{289}{289} = 1.0$$

#### Solution 4:
- Displacement vector $\vec{d}$:
  $$\vec{d} = (17 - 5, 7 - 2) = (12, 5)\text{ meters}$$
- Magnitude:
  $$\|\vec{d}\| = \sqrt{12^2 + 5^2} = \sqrt{144 + 25} = \sqrt{169} = 13\text{ meters}$$
- Unit direction vector:
  $$\hat{u} = \left(\frac{12}{13}, \frac{5}{13}\right) \approx (0.9231, 0.3846)$$

#### Solution 5:
- Direction magnitude: $\|\vec{d}\| = \sqrt{1^2 + 1^2} = \sqrt{2}$.
- Unit vector: $\hat{d} = \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right)$.
- Scaled laser velocity:
  $$\vec{v}_{\text{laser}} = 300,000 \times \left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right) = \left(\frac{300,000}{\sqrt{2}}, \frac{300,000}{\sqrt{2}}\right) \approx (212,132, 212,132)\text{ km/s}$$

#### Solution 6:
- Magnitude: $\|\vec{w}\| = \sqrt{(-20)^2 + 21^2} = \sqrt{400 + 441} = \sqrt{841} = 29$.
- Normal vector: $\hat{w} = (-20/29, 21/29)$.
- Opposite direction (flip signs):
  $$\hat{w}_{\text{opp}} = -\hat{w} = \left(+\frac{20}{29}, -\frac{21}{29}\right)$$

#### Solution 7:
- Speed:
  $$\|\vec{v}\| = \sqrt{12^2 + (-16)^2} = \sqrt{144 + 256} = \sqrt{400} = 20\text{ m/s}$$
- Unit vector:
  $$\hat{u} = \frac{(12, -16)}{20} = (0.6, -0.8)$$
- Decomposition:
  $$\vec{v} = 20 \begin{bmatrix} 0.6 \\ -0.8 \end{bmatrix}\text{ m/s}$$

#### Solution 8:
- Unit vector equation:
  $$x^2 + 0.8^2 = 1.0 \implies x^2 + 0.64 = 1.0 \implies x^2 = 0.36 \implies x = \pm 0.6$$
- Since the vector is in **Quadrant II**, the horizontal component must be negative ($x < 0$):
  $$x = -0.6$$

#### Solution 9:
- Combined force:
  $$\vec{F}_{\text{total}} = (40 + (-10), 30 + 20) = (30, 50)\text{ N}$$
- Force magnitude:
  $$\|\vec{F}_{\text{total}}\| = \sqrt{30^2 + 50^2} = \sqrt{900 + 2500} = \sqrt{3400} \approx 58.31\text{ N}$$
- Clamped acceleration:
  $$\vec{a} = 5.0 \times \frac{(30, 50)}{58.31} = 5.0 \times (0.5145, 0.8575) \approx (2.57, 4.29)\text{ m/s}^2$$

#### Solution 10:
- Displacement: $\Delta\vec{p}_{\text{total}} = (0.8 - 0.2, 1.2 - 0.4) = (0.6, 0.8)\text{ m}$.
- Magnitude: $\sqrt{0.6^2 + 0.8^2} = 1.0\text{ m}$.
- Unit trajectory vector: $\hat{t} = (0.6, 0.8)$.
- Step distance:
  $$\Delta s = v \cdot \Delta t = 0.50\text{ m/s} \times 0.01\text{ s} = 0.005\text{ meters (5 mm)}$$
- Incremental position step:
  $$\Delta\vec{p} = 0.005 \times (0.6, 0.8) = (0.003, 0.004)\text{ meters} = (3\text{ mm}, 4\text{ mm})$$
