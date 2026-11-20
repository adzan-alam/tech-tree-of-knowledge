# 2D Cartesian Vectors and Vector Algebra: From First Principles to Computational Physics

---

## 🧭 Prologue: The World Before Vectors

Imagine you are standing in an open, featureless desert. An ancient explorer has left behind a stone tablet with a single instruction:

> *"The freshwater oasis is buried exactly 100 meters away from this stone."*

You take out a tape measure. You walk 100 meters North: nothing but dry sand. You walk 100 meters East: nothing. You walk 100 meters Southwest: nothing. 

The single number $100\text{ meters}$ describes a massive circle surrounding the stone with an infinite number of possible steps. Without knowing **which direction** to walk, the single number leaves you completely stranded.

In school arithmetic, almost everything you learned dealt with quantities that can be described by a single number: $5\text{ apples}$, $10\text{ kilograms}$, $25^\circ\text{C}$, $14\text{ seconds}$. These are called **scalars**. 

However, the natural universe refuses to be governed by single numbers alone. When an archer releases an arrow, the outcome depends not just on *how fast* the arrow flies, but *where* it is pointed. When two tugboats pull a stranded cargo ship, their success depends entirely on whether they pull in the same direction or pull against one another. When a video game calculates whether an enemy bullet hits your character, it must track position and velocity across multiple spatial dimensions simultaneously.

This module is designed as an unbroken **cognitive ladder**. It begins with zero specialized knowledge—assuming only basic arithmetic and graph paper (Class 6 level)—and builds progressively, step-by-step, until you have derived the mathematical foundations of vector spaces and written a complete 2D vector engine for physics simulations and robotics.

---

## 🗺️ Master Curriculum Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  LEVEL 8: THE COMPUTATIONAL ENGINE                                           │
│  Runnable TypeScript Vector2D class, physics loops, performance & precision  │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 7: TURNING & THE 2D CROSS PRODUCT                                     │
│  90° perpendicular vectors, signed areas, and robot steering rules          │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 6: THE DOT PRODUCT ("THE TEAMWORK METER")                             │
│  Algebraic sum, Law of Cosines proof, angles, stealth FOV, and wall bounce   │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 5: ANGLES & NAVIGATION (TRIGONOMETRY VISUALIZED)                      │
│  Polar coordinates (r, θ), SOH CAH TOA projections, and the atan2 trap       │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 4: STRETCHING, REVERSING & UNIT VECTORS                               │
│  Scalar scaling, 180° inversion, normalization, and basis steps (i, j)       │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 3: COMBINING JOURNEYS (VECTOR ADDITION & FORCES)                      │
│  Tip-to-Tail rule, component sums, Parallelogram of Forces, and crosswinds   │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 2: THE SECRET OF LENGTH (PYTHAGORAS UNLOCKED)                         │
│  Euclidean norm ||v|| = sqrt(x² + y²), sign invariance, triangle inequality  │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 1: STEPPING INTO 2D (THE GRID & THE DIRECTED ARROW)                   │
│  Descartes' coordinate plane, Point vs. Vector, and Cartesian components     │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 0: THE SCALAR WORLD & THE TREASURE PARADOX                            │
│  1D number line, scalar limitations, and the necessity of directed space     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# Level 0: The Scalar World and the Treasure Paradox

### 0.1 What is a Scalar?
In basic mathematics, every quantity you measure has a size or amount. In science and mathematics, we give these quantities a precise name: **Scalars**.

> **Formal Definition:** A **scalar** is a physical or mathematical quantity that is completely and exhaustively specified by a single real number representing its magnitude, accompanied by appropriate units of measurement.

Everyday examples of scalars:
- **Mass ($m$):** A stone has a mass of $5\text{ kg}$. The mass does not point North, South, Up, or Down; it simply *is*.
- **Time ($t$):** A stopwatch measures $14.2\text{ seconds}$. Time advances forward along a single track.
- **Temperature ($T$):** The water in a kettle is $85^\circ\text{C}$. The water is hot, but the temperature has no spatial orientation.
- **Electric Charge ($q$):** An electron has a charge of $-1.602 \times 10^{-19}\text{ Coulombs}$.
- **Energy ($E$):** A battery stores $50,000\text{ Joules}$ of chemical potential energy.

On a standard mathematical number line, a scalar is simply a point:

```
<----+-----+-----+-----+-----+-----+-----+-----+-----+---->
    -4    -3    -2    -1     0     1     2     3     4
```

In a one-dimensional universe, you can only move along a single line: left (negative) or right (positive).

---

### 0.2 The Failure of Scalars in the Real World
The moment an entity moves across a flat surface—a floor, a football field, or a smartphone screen—one dimension is no longer enough. The physical world gives us **two independent spatial degrees of freedom**: horizontal (East-West) and vertical (North-South).

Consider an air traffic controller tracking two passenger jets:
- *"Aircraft A is flying at $500\text{ km/h}$."*
- *"Aircraft B is flying at $500\text{ km/h}$."*

Both quantities are scalars (speeds). Are the aircraft safe?

```
                      North ^
                            |
                 Aircraft B | (Heading South at 500 km/h)
                            v
                            |
                 Collision? !
                            ^
                            |
                 Aircraft A | (Heading North at 500 km/h)
```

If Aircraft A is flying North and Aircraft B is flying South directly toward each other, their closing speed is $1,000\text{ km/h}$ and they will collide within seconds. Speed alone (the scalar) is blind to survival. The pilot and the controller need to know **both how fast AND in what direction**.

When you combine magnitude with direction, you leave the scalar world behind and enter the world of **Vectors**.

---

### 0.3 Checkpoint: Scalar vs. Vector Classification
Can you distinguish between scalars and directed quantities?

1. **The speed of a cheetah ($110\text{ km/h}$):**  
   *Answer:* **Scalar**. It tells you how rapidly the cheetah moves, but not where it is running.
2. **The velocity of a cheetah ($110\text{ km/h}$ due East):**  
   *Answer:* **Vector**. It includes both the speed (magnitude) and the heading (direction).
3. **The volume of milk in a carton ($1\text{ liter}$):**  
   *Answer:* **Scalar**. Volume is purely spatial capacity.
4. **The gravitational force pulling on your body ($600\text{ N}$ toward the center of the Earth):**  
   *Answer:* **Vector**. Force always acts in a specific direction.

---

### 0.4 Socratic Reflection: How Ants Navigate Without Maps
> *When a Saharan desert ant (*Cataglyphis fortis*) leaves its nest, it wanders in an erratic, zig-zag path across hundreds of meters of sand searching for insects. Once it finds food, it does not retrace its wandering path. Instead, it turns directly toward the entrance of its nest and runs home in a straight line.*  
> *How does this tiny creature calculate this straight-line shortcut? Biologists discovered that the ant's nervous system continually adds up each tiny step it takes (both direction and distance) into an internal running vector sum—a biological implementation of vector addition!*

---

# Level 1: Stepping into 2D — The Cartesian Grid and the Directed Arrow

### 1.1 The Genesis of the Coordinate Plane
In 1637, the French philosopher and mathematician René Descartes made one of the most profound breakthroughs in human history: he unified algebra and geometry. 

Legend holds that while resting in bed and watching a fly crawl across his ceiling, Descartes realized that he could describe the fly's exact location at any moment by measuring two numbers: its distance from the left wall, and its distance from the bottom wall.

Descartes drew two perpendicular number lines:
1. The horizontal line: the **$X$-axis** (East-West).
2. The vertical line: the **$Y$-axis** (North-South).
3. Their meeting point: the **Origin $O(0, 0)$**.

```
                           Y ^
                             |
                           4 |
                           3 |
                           2 |
                           1 |
         <---+-----+-----+---+---+-----+-----+-----+---> X
            -3    -2    -1   | 0   1     2     3     4
                          -1 |
                          -2 |
                             v
```

---

### 1.2 Point vs. Vector: The Fundamental Distinction
Students frequently confuse points and vectors because both are written using two numbers $(x, y)$. Understanding the difference is crucial:

- **A Point $P(x, y)$ is a Location:** It is static. It tells you *where something is*. A house on a map, a pixel on a screen, or a star in the sky is a point.
- **A Vector $\vec{v}$ is an Action, Journey, or Instruction:** It is dynamic. It tells you *how to change location*. It represents a displacement, a velocity, or a force.

```
       Y ^
         |
       4 |           Point B (4, 4)
       3 |            ●
       2 |           ^
       1 |          /  Vector v: "Take 3 steps East, then 4 steps North"
         |         /
       0 +--------+----+----> X
         0  1  2  3  4
        Point A (1, 0)
```

If you stand at Point $A(1, 0)$ and follow the instruction of Vector $\vec{v}$ ("step 3 units East, 4 units North"), your new coordinates will be:
$$\text{New } X = 1 + 3 = 4, \quad \text{New } Y = 0 + 4 = 4 \implies \text{Point } B(4, 4)$$

---

### 1.3 Anatomy of a Vector Arrow
We represent vectors visually as directed line segments—**arrows**:
1. **The Tail (Initial Point):** Where the action begins.
2. **The Tip / Head (Terminal Point):** Where the arrow points.
3. **The Line of Action:** The infinite straight line passing through the arrow.

### 1.4 Free Vectors vs. Bound Position Vectors
- **Position Vector ($\vec{r}$):** A vector anchored with its tail at the Origin $O(0, 0)$. It specifies the absolute position of an object in space.
- **Free Vector ($\vec{v}$):** A vector representing pure displacement, force, or velocity. **A free vector has no permanent address.** You can pick up a free vector and slide it anywhere on the paper; as long as you do not rotate it or stretch it, it remains the exact same vector!

```
       Y ^
         |       Vector v                       Identical Vector v
       4 |       (Starts at (1,2))              (Starts at (5,1))
       3 |        ●----->                       ●----->
       2 |       /                             /
       1 |      ●                             ●
         +------+------+------+------+------+------+----> X
         0      1      2      3      4      5      6
```

---

### 1.5 Cartesian Component Representation
Instead of drawing arrows by hand every time, we write vectors algebraically using their **components**:

$$\vec{v} = (v_x, v_y) \quad \text{or in column format} \quad \vec{v} = \begin{bmatrix} v_x \\ v_y \end{bmatrix}$$

- $v_x$ (the $X$-component): How many units the arrow travels horizontally.
  - Positive ($v_x > 0$): Stepping Right / East.
  - Negative ($v_x < 0$): Stepping Left / West.
- $v_y$ (the $Y$-component): How many units the arrow travels vertically.
  - Positive ($v_y > 0$): Stepping Up / North.
  - Negative ($v_y < 0$): Stepping Down / South.

#### Calculating Components from Two Points:
If a vector starts at point $A(x_1, y_1)$ and ends at point $B(x_2, y_2)$, its components are simply the coordinate differences ($\Delta$):
$$v_x = x_2 - x_1, \quad v_y = y_2 - y_1$$

---

### 1.6 Worked Example 1.1: Drone Delivery Flight
**Problem:** A robotic delivery drone lifts off from a warehouse roof located at coordinates $A(3, 7)$ and lands on an apartment terrace at coordinates $B(11, 13)$.
1. Find the horizontal displacement $d_x$ and vertical displacement $d_y$.
2. Write the displacement vector $\vec{d}$ in both row and column component formats.
3. If the drone immediately flies another identical displacement $\vec{d}$ from the apartment terrace, what are the coordinates of its next destination $C$?

**Detailed Step-by-Step Solution:**
1. Compute the components using $\Delta x$ and $\Delta y$:
   $$d_x = x_2 - x_1 = 11 - 3 = 8\text{ units}$$
   $$d_y = y_2 - y_1 = 13 - 7 = 6\text{ units}$$
2. Write the vector:
   $$\vec{d} = (8, 6) = \begin{bmatrix} 8 \\ 6 \end{bmatrix}$$
   *Meaning:* The drone traveled $8\text{ units}$ East and $6\text{ units}$ North.
3. To find the next destination $C(x_3, y_3)$, apply the vector instruction to the apartment terrace $B(11, 13)$:
   $$x_3 = 11 + 8 = 19$$
   $$y_3 = 13 + 6 = 19$$
   The next destination is $C(19, 19)$.

---

# Level 2: The Secret of Length — Pythagoras Unlocked (Magnitude)

### 2.1 The Straight-Line Shortcut
If you walk $3\text{ meters}$ East along a street, and then turn left and walk $4\text{ meters}$ North, your pedometer records that you took $3 + 4 = 7\text{ meters}$ worth of steps. 

But what if you were a bird flying directly from the starting point to the ending point? How far did you actually travel in a straight line?

By walking East and then North, your steps formed a perfect right angle ($90^\circ$). You have drawn a **right-angled triangle** where:
- The base is the horizontal step: $v_x = 3$.
- The height is the vertical step: $v_y = 4$.
- The straight-line vector arrow is the **hypotenuse**!

```
                    Tip (3, 4)
                    ●
                   /|
                  / |
     Hypotenuse  /  |  Vertical component (v_y = 4)
     Length ||v||/   |
                /   |
               ●----+
             Tail   Horizontal component (v_x = 3)
```

---

### 2.2 Mathematical Derivation of Magnitude
Around 500 BCE, geometers proved that for any right-angled triangle with perpendicular sides $a$ and $b$ and hypotenuse $c$:
$$a^2 + b^2 = c^2$$

Taking the positive square root of both sides gives the length of the hypotenuse:
$$c = \sqrt{a^2 + b^2}$$

Applying this directly to our vector components $v_x$ and $v_y$:
$$\text{Length}^2 = v_x^2 + v_y^2 \implies \text{Length} = \sqrt{v_x^2 + v_y^2}$$

In linear algebra and physics, this length is called the **Magnitude** or **Euclidean Norm** of the vector. We write it with double vertical bars $\|\vec{v}\|$ (or single bars $|\vec{v}|$):

$$\|\vec{v}\| = \sqrt{v_x^2 + v_y^2}$$

For our $3\text{ East}, 4\text{ North}$ journey:
$$\|\vec{v}\| = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5\text{ meters}$$

The straight-line flight is only $5\text{ meters}$, saving $2\text{ meters}$ compared to walking along the grid axes!

---

### 2.3 Sign Invariance: Why Negative Steps Never Produce Negative Lengths
What happens if a vector points downward and to the left: $\vec{w} = (-6, -8)$?
Does it have a negative length?

**No!** Length is geometric distance, which is strictly non-negative ($\ge 0$). Look at what happens when you substitute negative numbers into the formula:
$$\|\vec{w}\| = \sqrt{(-6)^2 + (-8)^2}$$

Because a negative number multiplied by a negative number is always positive ($(-6) \times (-6) = +36$ and $(-8) \times (-8) = +64$):
$$\|\vec{w}\| = \sqrt{36 + 64} = \sqrt{100} = 10$$

The squaring operation automatically dissolves negative signs, ensuring the Euclidean magnitude is always a valid physical distance.

---

### 2.4 The Triangle Inequality: The Shortest Path Principle
A fundamental theorem of Euclidean geometry states that the straight-line distance between two points is always less than or equal to any detour:

$$\|\vec{u} + \vec{v}\| \le \|\vec{u}\| + \|\vec{v}\|$$

Equality holds if and only if both vectors point in the exact same direction.

> **Common Misconception to Avoid:**  
> A widespread student error is trying to distribute square roots over addition:  
> *"Is $\sqrt{v_x^2 + v_y^2}$ equal to $v_x + v_y$?"*  
> **Never!** Let us test with numbers:  
> $\sqrt{3^2 + 4^2} = \sqrt{25} = 5$.  
> But $3 + 4 = 7$.  
> $5 \neq 7$. You must always square each component first, add the squares together, and only then take the square root.

---

### 2.5 Software Engineering Insight: Avoiding `Math.sqrt()` in Physics Engines
In computational physics and video game engines, distance checks occur millions of times per second (e.g., checking if 1,000 particles have collided).

Computing a square root (`Math.sqrt()`) requires dozens of CPU cycles using iterative numerical approximation algorithms (such as the Newton-Raphson method).

**The Performance Secret:** If you want to know whether a particle at $\vec{p}$ is within radius $R$ of an explosion:
$$\|\vec{p}\| \le R \iff \|\vec{p}\|^2 \le R^2 \iff (p_x^2 + p_y^2) \le R^2$$
By comparing the **squared magnitude** ($p_x^2 + p_y^2$) directly against the **squared radius** ($R^2$), you get the exact same answer while eliminating the costly square root entirely!

---

# Level 3: Combining Journeys — Vector Addition & Physical Forces

### 3.1 Explanation: What Happens When Two Actions Combine?
Suppose a hiker navigates through a wilderness in two stages:
- **Stage 1 ($\vec{u}$):** Walk $5\text{ km}$ East, $2\text{ km}$ North $\implies \vec{u} = (5, 2)$.
- **Stage 2 ($\vec{v}$):** From that new campsite, walk $3\text{ km}$ East, $4\text{ km}$ North $\implies \vec{v} = (3, 4)$.

What is the hiker's overall displacement from the starting trailhead?
- Total Eastward displacement: $5\text{ km} + 3\text{ km} = 8\text{ km}$.
- Total Northward displacement: $2\text{ km} + 4\text{ km} = 6\text{ km}$.

The combined journey is the **Vector Sum**:
$$\vec{u} + \vec{v} = (5 + 3, 2 + 4) = (8, 6)$$

---

### 3.2 The Algebraic Rule of Vector Addition
To add any two vectors in 2D space, you simply **add their matching horizontal components together, and add their matching vertical components together**:

$$\vec{u} + \vec{v} = \begin{bmatrix} u_x \\ u_y \end{bmatrix} + \begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} u_x + v_x \\ u_y + v_y \end{bmatrix}$$

This universal rule works identically when components are negative. For example, if $\vec{a} = (7, -4)$ and $\vec{b} = (-3, 9)$:
$$\vec{a} + \vec{b} = \begin{bmatrix} 7 + (-3) \\ -4 + 9 \end{bmatrix} = \begin{bmatrix} 4 \\ 5 \end{bmatrix}$$

---

### 3.3 Geometric Demonstration: The Tip-to-Tail Rule
Geometrically, vector addition is carried out by placing the **tail of the second vector at the tip of the first vector**. The **resultant vector** $\vec{R} = \vec{u} + \vec{v}$ is the arrow drawn from the very start (tail of $\vec{u}$) to the very end (tip of $\vec{v}$):

```
                            Tip of v (Resultant Tip)
                                  ●
                                 /|
                              v / |
                               /  |
                              ●   |  Resultant R = u + v
                             /    |
                          u /     |
                           /      |
                          /       |
                         ●--------+
                  Tail of u (Start)
```

Because addition is commutative ($\vec{u} + \vec{v} = \vec{v} + \vec{u}$), it does not matter which journey you take first! Starting with $\vec{v}$ and then following $\vec{u}$ leads to the exact same destination point.

---

### 3.4 The Parallelogram Law of Concurrent Forces
In physics, multiple forces rarely act one after the other; they usually act **simultaneously on the same object**.

If two people pull a heavy crate simultaneously:
- Person 1 pulls with force $\vec{F}_1$.
- Person 2 pulls with force $\vec{F}_2$.

To find the crate's motion, draw both force arrows starting from the crate (tails touching). Construct a parallelogram where $\vec{F}_1$ and $\vec{F}_2$ form two adjacent sides. The diagonal of the parallelogram starting from the crate is the **Net Resultant Force** $\vec{F}_{\text{net}}$:

```
                    ●---------------+
                   / \             /
                  /   \           /
            F_2  /     \ F_net   /
                /       \       /
               /         \     /
              ●-----------+---●
                 F_1
```

---

### 3.5 Real-World Physics Application: The Crosswind Aircraft
**Scenario:** A passenger jet points its nose directly North and flies with airspeed $\vec{v}_{\text{plane}} = (0, 240)\text{ m/s}$. A fierce crosswind blows toward the East with velocity $\vec{v}_{\text{wind}} = (70, 0)\text{ m/s}$.

**Calculations:**
1. **Resultant Ground Velocity Vector:**
   $$\vec{v}_{\text{ground}} = \vec{v}_{\text{plane}} + \vec{v}_{\text{wind}} = \begin{bmatrix} 0 \\ 240 \end{bmatrix} + \begin{bmatrix} 70 \\ 0 \end{bmatrix} = \begin{bmatrix} 70 \\ 240 \end{bmatrix}\text{ m/s}$$
2. **Actual Ground Speed:**
   $$\|\vec{v}_{\text{ground}}\| = \sqrt{70^2 + 240^2} = \sqrt{4,900 + 57,600} = \sqrt{62,500} = 250\text{ m/s}$$
3. **Drift Angle:** How many degrees East of North is the plane pushed?
   $$\tan\theta = \frac{70}{240} \approx 0.2917 \implies \theta = \arctan(0.2917) \approx 16.26^\circ$$
   *Physical Meaning:* Even though the pilot points the jet pure North, the passengers are traveling at $250\text{ m/s}$ along a diagonal heading $16.26^\circ$ East of North! To fly true North, the pilot must steer into the wind.

---

### 3.6 Vector Subtraction: The Displacement Between Two Points
How do we subtract vectors? Algebraically, we subtract matching components:
$$\vec{u} - \vec{v} = \begin{bmatrix} u_x - v_x \\ u_y - v_y \end{bmatrix}$$

**Crucial Geometric Interpretation:** The vector $\vec{d} = \vec{u} - \vec{v}$ represents the arrow that points **from the tip of $\vec{v}$ to the tip of $\vec{u}$**.

```
                Player p
                   ●
                  ^
                 /  d = p - z (Vector pointing TO the player)
                /
               ●
            Zombie z
```

In video game AI, if a zombie is at position $\vec{z} = (10, 4)$ and the player is at position $\vec{p} = (22, 9)$, the vector telling the zombie which way to run is:
$$\vec{d} = \vec{p} - \vec{z} = \begin{bmatrix} 22 - 10 \\ 9 - 4 \end{bmatrix} = \begin{bmatrix} 12 \\ 5 \end{bmatrix}$$
The distance between them is $\|\vec{d}\| = \sqrt{12^2 + 5^2} = \sqrt{144 + 25} = 13\text{ meters}$.

---

# Level 4: Stretching, Reversing, and Pure Direction — Scalar Multiplication & Unit Vectors

### 4.1 Explanation: Multiplying an Arrow by a Number
What happens when you multiply a vector $\vec{v}$ by a regular scalar number $k$?
- If you run twice as fast: $2\vec{v}$ (double the length, same direction).
- If you walk one-third as far: $\frac{1}{3}\vec{v}$ (one-third the length, same direction).
- If you walk in reverse: $-1\vec{v}$ (same length, flipped $180^\circ$).

---

### 4.2 Algebraic Definition & Rigorous Magnitude Proof
To multiply a vector by a scalar $k$, you multiply **every component** by $k$:

$$k\vec{v} = k\begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} k v_x \\ k v_y \end{bmatrix}$$

**Rigorous Proof of Length Scaling:**
What is the length of the scaled vector $k\vec{v}$?
$$\|k\vec{v}\| = \sqrt{(k v_x)^2 + (k v_y)^2}$$
$$= \sqrt{k^2 v_x^2 + k^2 v_y^2}$$
Factoring out $k^2$:
$$= \sqrt{k^2 (v_x^2 + v_y^2)}$$
Using the radical product rule $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$:
$$= \sqrt{k^2} \cdot \sqrt{v_x^2 + v_y^2}$$
Recalling that the principal square root of $k^2$ is the absolute value $|k|$:
$$\|k\vec{v}\| = |k| \|\vec{v}\| \quad \text{(Q.E.D.)}$$

**Conclusion:** Scaling a vector by $k$ scales its geometric length by exactly $|k|$.

```
       v:        ●--------> (Length 3)
      2v:        ●----------------> (Length 6, Same Direction)
     -1v: <--------● (Length 3, Flipped 180° in Reverse)
```

---

### 4.3 The Unit Vector: Isolating Pure Direction
In game development and physics simulations, you frequently face this requirement:
> *"A heat-seeking missile at $(x_m, y_m)$ must fly toward an enemy jet at $(x_j, y_j)$ at a constant speed of $300\text{ m/s}$, regardless of whether the jet is 1 kilometer away or 50 kilometers away."*

If you use the raw displacement vector $\vec{d} = \vec{p}_{\text{jet}} - \vec{p}_{\text{missile}}$, its magnitude changes with distance. If the jet is far away, the missile would move at supersonic speeds in a single tick!

You need a way to **strip away all magnitude** and keep only the **pure direction**.

> **Definition:** A **Unit Vector** is any vector whose geometric length is exactly equal to $1$ unit:
> $$\|\hat{u}\| = 1$$
> We write unit vectors with a "hat" accent ($\hat{u}$, pronounced "u-hat").

---

### 4.4 How to Normalize a Vector
To convert any non-zero vector $\vec{v}$ into a unit vector pointing in the exact same direction, divide the vector by its own magnitude:

$$\hat{v} = \frac{\vec{v}}{\|\vec{v}\|} = \begin{bmatrix} \frac{v_x}{\sqrt{v_x^2 + v_y^2}} \\ \frac{v_y}{\sqrt{v_x^2 + v_y^2}} \end{bmatrix}$$

**Rigorous Proof that $\|\hat{v}\| = 1$:**
$$\|\hat{v}\| = \left\| \frac{\vec{v}}{\|\vec{v}\|} \right\|$$
Since $1 / \|\vec{v}\|$ is a positive scalar, we pull it outside the norm using our scaling proof:
$$\|\hat{v}\| = \frac{1}{\|\vec{v}\|} \cdot \|\vec{v}\| = 1 \quad \text{(Q.E.D.)}$$

#### Example:
Normalize $\vec{v} = (3, 4)$:
1. $\|\vec{v}\| = \sqrt{3^2 + 4^2} = 5$.
2. $\hat{v} = \left(\frac{3}{5}, \frac{4}{5}\right) = (0.6, 0.8)$.
3. Check length: $\sqrt{0.6^2 + 0.8^2} = \sqrt{0.36 + 0.64} = \sqrt{1.0} = 1.0$.

---

### 4.5 The Standard Basis Vectors $\hat{i}$ and $\hat{j}$
Two special unit vectors act as the fundamental building blocks of the entire 2D Cartesian plane:
- $\hat{i} = (1, 0)$: A single step of length 1 along the positive $X$-axis.
- $\hat{j} = (0, 1)$: A single step of length 1 along the positive $Y$-axis.

Every 2D vector in existence can be expressed as a **linear combination** of $\hat{i}$ and $\hat{j}$:
$$\vec{v} = (v_x, v_y) = v_x \begin{bmatrix} 1 \\ 0 \end{bmatrix} + v_y \begin{bmatrix} 0 \\ 1 \end{bmatrix} = v_x \hat{i} + v_y \hat{j}$$

For example, $\vec{v} = (5, -7) = 5\hat{i} - 7\hat{j}$.

---

### 4.6 Famous Video Game Exploit: The Quake "Strafe-Running" Bug
In early 3D first-person shooter games (such as *Quake*, *Doom*, and *GoldenEye 007*), player movement was controlled by keyboard keys:
- Pressing **W** sets forward velocity: $\vec{v}_{\text{forward}} = (0, 1)$.
- Pressing **D** sets strafe-right velocity: $\vec{v}_{\text{right}} = (1, 0)$.

When a player pressed both **W and D** simultaneously, the game engine simply added the two vectors together:
$$\vec{v}_{\text{move}} = \vec{v}_{\text{forward}} + \vec{v}_{\text{right}} = (1, 1)$$

What was the player's diagonal running speed?
$$\|\vec{v}_{\text{move}}\| = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1.414\text{ m/s}$$

The player ran **$41.4\%$ faster diagonally than straight forward!** Competitive speedrunners quickly exploited this bug to bunny-hop and blitz through levels at unintended speeds.

**The Fix:** Modern game engines always normalize non-zero input vectors before scaling by the character's movement speed:
```typescript
let moveInput = new Vector2D(inputX, inputY);
if (moveInput.mag() > 1.0) {
  moveInput = moveInput.normalize(); // Clamps diagonal speed to exactly 1.0!
}
const playerVelocity = moveInput.scale(WALK_SPEED);
```

---

# Level 5: Angles and Navigation — Trigonometry Visualized

### 5.1 From Grid Steps to Angles (Polar Coordinates)
So far, we have expressed vectors using grid components: $\vec{v} = (v_x, v_y)$. This is the **Cartesian form**.
However, navigators, sailors, and radar operators describe motion differently:
- *"Sail $10\text{ nautical miles}$ at a heading of $30^\circ$ North of East."*

This is the **Polar form**:
- Magnitude: $r = \|\vec{v}\|$
- Direction Angle: $\theta$ (measured in radians or degrees counter-clockwise from the positive $X$-axis).

```
                      Y ^
                        |          Tip (x, y)
                        |          ●
                        |         /|
                        |     r  / |
                        |       /  | y = r * sin(θ)
                        |      /   |
                        |     / θ  |
                        +----+-----+----> X
                        O    x = r * cos(θ)
```

---

### 5.2 Converting Polar $(r, \theta)$ to Cartesian $(v_x, v_y)$
Using basic right-triangle trigonometry (SOH CAH TOA):
$$\cos\theta = \frac{\text{Adjacent}}{\text{Hypotenuse}} = \frac{v_x}{r} \implies v_x = r \cos\theta$$
$$\sin\theta = \frac{\text{Opposite}}{\text{Hypotenuse}} = \frac{v_y}{r} \implies v_y = r \sin\theta$$

Therefore, any vector can be written as:
$$\vec{v} = r \begin{bmatrix} \cos\theta \\ \sin\theta \end{bmatrix} = \|\vec{v}\| \cos\theta\, \hat{i} + \|\vec{v}\| \sin\theta\, \hat{j}$$

#### Worked Example:
An artillery shell is fired with muzzle speed $100\text{ m/s}$ at an elevation angle of $60^\circ$.
- $v_x = 100 \cos(60^\circ) = 100 \times 0.5 = 50\text{ m/s}$.
- $v_y = 100 \sin(60^\circ) = 100 \times \frac{\sqrt{3}}{2} \approx 86.6\text{ m/s}$.
The initial velocity vector is $\vec{v} = (50, 86.6)\text{ m/s}$.

---

### 5.3 Converting Cartesian $(v_x, v_y)$ to Angle $\theta$
To find the angle from known components:
$$\tan\theta = \frac{\text{Opposite}}{\text{Adjacent}} = \frac{v_y}{v_x} \implies \theta = \arctan\left(\frac{v_y}{v_x}\right)$$

---

### 5.4 The Deadly Quadrant Trap: Why Computers Need `atan2`
Consider two completely different vectors:
1. $\vec{u} = (3, 4)$ (First Quadrant: points Northeast).
   $$\frac{v_y}{v_x} = \frac{4}{3} \approx 1.333 \implies \arctan(1.333) = +53.13^\circ$$
2. $\vec{w} = (-3, -4)$ (Third Quadrant: points Southwest).
   $$\frac{v_y}{v_x} = \frac{-4}{-3} = \frac{4}{3} \approx 1.333 \implies \arctan(1.333) = +53.13^\circ$$

The regular single-argument $\arctan$ function outputs $+53.13^\circ$ for both! It cannot distinguish Northeast from Southwest because the two negative signs cancel out. Furthermore, if $v_x = 0$, dividing by zero causes an immediate computer crash.

**The Solution:** Computer scientists created the two-argument arctangent function `Math.atan2(y, x)`. It inspects the independent signs of $y$ and $x$ to return the true geometric angle in radians across all four quadrants ($-\pi$ to $+\pi$, or $-180^\circ$ to $+180^\circ$):

```
                  Quadrant II (-x, +y) | Quadrant I (+x, +y)
                  θ = +90° to +180°    | θ = 0° to +90°
                 ----------------------+----------------------
                  Quadrant III (-x, -y)| Quadrant IV (+x, -y)
                  θ = -90° to -180°    | θ = -90° to 0°
```

---

# Level 6: The Dot Product — The "Teamwork Meter" and Shadow Projections

### 6.1 Explanation: The Intuition of Alignment
Suppose you are trying to push a broken-down car along a straight road pointing East.
- **Scenario A (Direct Alignment):** You push directly East behind the bumper. All your strength accelerates the car forward. (Maximum teamwork).
- **Scenario B (Angled Push):** You push diagonally Northeast. Some of your strength pushes the car forward, but some is wasted pushing sideways against the road curbs. (Partial teamwork).
- **Scenario C (Perpendicular Push):** You push directly North against the passenger door. The car's wheels cannot roll sideways. Your push contributes **zero** forward motion to the car! (Zero teamwork).
- **Scenario D (Opposing Push):** You push from the front bumper toward the West. You are actively fighting against the car's forward motion. (Negative teamwork).

This concept of measuring **how much two vectors point in the same direction and work together** is the **Dot Product** (also known as the scalar product or inner product).

---

### 6.2 The Algebraic Definition
For vectors $\vec{u} = (u_x, u_y)$ and $\vec{v} = (v_x, v_y)$, the dot product is calculated by multiplying matching components and summing the results:

$$\vec{u} \cdot \vec{v} = u_x v_x + u_y v_y$$

> **Crucial Rule:** The dot product of two vectors is **a single scalar number**, not a vector!

#### Quick Numerical Check:
Let $\vec{u} = (3, 2)$ and $\vec{v} = (4, -1)$:
$$\vec{u} \cdot \vec{v} = (3 \times 4) + (2 \times (-1)) = 12 - 2 = 10$$

---

### 6.3 First-Principles Derivation via the Law of Cosines
Why does this simple algebraic sum of products equal the geometric formula:
$$\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos\theta$$

Let us prove this step-by-step with zero skipped algebra.

```
                     A (u)
                    / \
                   /   \
                u /     \ w = u - v
                 /       \
                /  θ      \
               O-----------B (v)
```

Consider triangle $OAB$ formed by vectors $\vec{u} = \vec{OA}$, $\vec{v} = \vec{OB}$, and the difference vector $\vec{w} = \vec{u} - \vec{v} = \vec{BA}$, with angle $\theta$ between $\vec{u}$ and $\vec{v}$.

**Step 1:** By the geometric Law of Cosines for triangle $OAB$:
$$\|\vec{w}\|^2 = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2 \|\vec{u}\| \|\vec{v}\| \cos\theta \quad \text{--- (Equation 1)}$$

**Step 2:** Now expand $\|\vec{w}\|^2 = \|\vec{u} - \vec{v}\|^2$ algebraically using components:
$$\|\vec{w}\|^2 = (u_x - v_x)^2 + (u_y - v_y)^2$$

Expand each binomial:
$$(u_x - v_x)^2 = u_x^2 - 2 u_x v_x + v_x^2$$
$$(u_y - v_y)^2 = u_y^2 - 2 u_y v_y + v_y^2$$

Add them together:
$$\|\vec{w}\|^2 = (u_x^2 - 2 u_x v_x + v_x^2) + (u_y^2 - 2 u_y v_y + v_y^2)$$

Regroup terms:
$$\|\vec{w}\|^2 = (u_x^2 + u_y^2) + (v_x^2 + v_y^2) - 2(u_x v_x + u_y v_y)$$

Recognize by Pythagoras that $u_x^2 + u_y^2 = \|\vec{u}\|^2$ and $v_x^2 + v_y^2 = \|\vec{v}\|^2$:
$$\|\vec{w}\|^2 = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2(u_x v_x + u_y v_y) \quad \text{--- (Equation 2)}$$

**Step 3:** Set Equation 1 equal to Equation 2:
$$\|\vec{u}\|^2 + \|\vec{v}\|^2 - 2 \|\vec{u}\| \|\vec{v}\| \cos\theta = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2(u_x v_x + u_y v_y)$$

**Step 4:** Subtract $\|\vec{u}\|^2 + \|\vec{v}\|^2$ from both sides:
$$-2 \|\vec{u}\| \|\vec{v}\| \cos\theta = -2(u_x v_x + u_y v_y)$$

**Step 5:** Divide both sides by $-2$:
$$u_x v_x + u_y v_y = \|\vec{u}\| \|\vec{v}\| \cos\theta \quad \text{(Q.E.D.)}$$

The algebraic calculation and the geometric alignment formula are proven to be identical!

---

### 6.4 The Five Geometric Regimes of the Dot Product
Because the cosine function $\cos\theta$ fluctuates smoothly between $+1$ and $-1$, the value of $\vec{u} \cdot \vec{v}$ acts as an immediate diagnostic of the angle between them:

| Angle $\theta$ | $\cos\theta$ | Dot Product Sign | Geometric Meaning |
| :--- | :--- | :--- | :--- |
| $\theta = 0^\circ$ | $+1$ | $+\|\vec{u}\|\|\vec{v}\|$ (Max Positive) | **Collinear:** Pointing in the exact same direction |
| $0^\circ < \theta < 90^\circ$ | $> 0$ | **Positive ($> 0$)** | **Acute:** Working together in the same general direction |
| $\theta = 90^\circ$ | $0$ | **Exactly Zero ($0$)** | **Orthogonal (Perpendicular):** Zero teamwork, right angle |
| $90^\circ < \theta < 180^\circ$ | $< 0$ | **Negative ($< 0$)** | **Obtuse:** Opposing each other |
| $\theta = 180^\circ$ | $-1$ | $-\|\vec{u}\|\|\vec{v}\|$ (Max Negative) | **Anti-parallel:** Pointing in exactly opposite directions |

---

### 6.5 Scalar Projection: Casting a Shadow
Imagine shining a light perpendicular to vector $\vec{b}$. Vector $\vec{a}$ casts a "shadow" along the line of $\vec{b}$. How long is that shadow?

```
                     A (a)
                    /|
                   / |
                a /  |
                 /   |
                / θ  |
               O-----+---------> B (b)
                Shadow
```

Using basic trigonometry:
$$\text{Shadow Length} = \|\vec{a}\| \cos\theta$$

Since $\vec{a} \cdot \vec{b} = \|\vec{a}\| \|\vec{b}\| \cos\theta$, we divide by $\|\vec{b}\|$:
$$\text{Scalar Projection } \text{scal}_{\vec{b}}\vec{a} = \frac{\vec{a} \cdot \vec{b}}{\|\vec{b}\|} = \vec{a} \cdot \hat{b}$$

To turn this scalar shadow length into an actual vector pointing along $\vec{b}$, multiply by the unit vector $\hat{b}$:
$$\text{Vector Projection } \text{proj}_{\vec{b}}\vec{a} = (\vec{a} \cdot \hat{b})\hat{b} = \left(\frac{\vec{a} \cdot \vec{b}}{\|\vec{b}\|^2}\right)\vec{b}$$

---

### 6.6 Crucial Applications in Physics & Games

#### Application 1: Mechanical Work in Physics
When a force $\vec{F}$ moves an object through displacement $\vec{d}$, the mechanical work done ($W$) is defined as:
$$W = \vec{F} \cdot \vec{d} = \|\vec{F}\| \|\vec{d}\| \cos\theta$$
If you carry a heavy backpack ($100\text{ N}$ force upward) while walking horizontally along a flat floor ($10\text{ meters}$ forward), $\theta = 90^\circ \implies \cos(90^\circ) = 0$. The mechanical work done by you on the backpack against gravity is **zero Joules**!

#### Application 2: Surface Reflection (The Bouncing Billiard Ball)
When a ball with velocity $\vec{v}$ hits a flat wall with unit normal vector $\hat{n}$ (a perpendicular vector pointing out from the wall), how does its velocity vector bounce?

The velocity can be split into two pieces:
1. Parallel to the wall: $\vec{v}_{\parallel}$ (unaffected by the bounce).
2. Perpendicular to the wall: $\vec{v}_{\perp} = (\vec{v} \cdot \hat{n})\hat{n}$.

During an elastic bounce, the perpendicular velocity is reversed: $\vec{v}_{\perp}' = -\vec{v}_{\perp}$.
$$\vec{v}_{\text{reflected}} = \vec{v}_{\parallel} + \vec{v}_{\perp}' = (\vec{v} - \vec{v}_{\perp}) - \vec{v}_{\perp} = \vec{v} - 2\vec{v}_{\perp}$$

$$\vec{v}_{\text{reflected}} = \vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}$$

```
             v_in \       / v_out
                   \  n  /
                    \ ^ /
                     \|/
         =============+============= Wall Surface
```

---

# Level 7: The Perpendicular Vector and 2D Cross Product (Steering & Orientation)

### 7.1 How to Turn $90^\circ$ Without Trigonometry
Suppose an autonomous rover is traveling along vector $\vec{v} = (v_x, v_y)$. An obstacle appears, and the rover must turn immediately $90^\circ$ to its left (counter-clockwise).

Let the new perpendicular vector be $\vec{w} = (w_x, w_y)$.
Because they are perpendicular, their dot product must equal zero:
$$\vec{v} \cdot \vec{w} = v_x w_x + v_y w_y = 0$$

Notice the simple mathematical identity:
$$v_x(-v_y) + v_y(v_x) = -v_x v_y + v_x v_y = 0$$

Therefore, to rotate any 2D vector $90^\circ$ counter-clockwise, **swap the components and negate the new $X$**:
$$\vec{v}^\perp = \begin{bmatrix} -v_y \\ v_x \end{bmatrix}$$

#### Example:
If $\vec{v} = (4, 1)$ (stepping 4 East, 1 North):
$$\vec{v}^\perp = (-1, 4) \quad (\text{stepping 1 West, 4 North})$$
Check dot product: $(4 \times -1) + (1 \times 4) = -4 + 4 = 0$!

---

### 7.2 The 2D Cross Product (Perp-Dot Product)
In 3D space, the cross product of two vectors produces a 3D vector. In 2D space, the **2D Cross Product** (or perpendicular dot product) between $\vec{u}$ and $\vec{v}$ evaluates the dot product of $\vec{u}^\perp$ with $\vec{v}$:

$$\vec{u} \times \vec{v} = u_x v_y - u_y v_x$$

### 7.3 Geometric Meaning: Signed Parallelogram Area
The magnitude $|\vec{u} \times \vec{v}|$ equals the exact **area of the parallelogram** formed by vectors $\vec{u}$ and $\vec{v}$:
$$\text{Area} = \|\vec{u}\| \|\vec{v}\| |\sin\theta|$$

```
                   ●---------------+
                  /               /
                 /               /  Parallelogram Area = |u × v|
              v /               /
               ●---------------+
                       u
```

---

### 7.4 Robotics Application: Autonomous Waypoint Steering
The **sign** of $\vec{u} \times \vec{v}$ answers a fundamental steering question for self-driving vehicles and mobile robots:

> *"If my vehicle is facing along direction $\vec{u}$, is the target waypoint $\vec{v}$ to my Left or to my Right?"*

```
          Target to Left                       Target to Right
             v  ●                                     ● v
                ^                                     ^
                 \                                   /
                  \                                 /
                   ●--------> u                    ●--------> u
                 (u × v > 0)                     (u × v < 0)
```

- **If $\vec{u} \times \vec{v} > 0$:** Target lies counter-clockwise $\implies$ **Steer Left!**
- **If $\vec{u} \times \vec{v} < 0$:** Target lies clockwise $\implies$ **Steer Right!**
- **If $\vec{u} \times \vec{v} = 0$:** Target is directly collinear (straight ahead or straight behind) $\implies$ **Maintain heading!**

---

# Level 8: The Computational Engine — Software Implementation & Physics Simulation

Here is the production-grade, fully typed TypeScript `Vector2D` class, ready to drop into any physics engine, robotics simulation, or game loop:

```typescript
export class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // Clone vector instance
  public clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  // Vector Addition: u + v
  public add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  // Vector Subtraction: u - v
  public sub(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  // Scalar Multiplication: k * v
  public scale(s: number): Vector2D {
    return new Vector2D(this.x * s, this.y * s);
  }

  // Squared Euclidean Norm (High performance, avoids Math.sqrt)
  public magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  // Euclidean Magnitude ||v||
  public mag(): number {
    return Math.hypot(this.x, this.y);
  }

  // Safe Normalization: Unit vector v / ||v||
  public normalize(): Vector2D {
    const len = this.mag();
    if (len < 1e-9) {
      return new Vector2D(0, 0); // Gracefully handles zero vectors!
    }
    return new Vector2D(this.x / len, this.y / len);
  }

  // Dot Product: u · v = ||u|| ||v|| cos(theta)
  public dot(v: Vector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  // 2D Cross Product (Perp-Dot): u × v = ||u|| ||v|| sin(theta)
  public cross(v: Vector2D): number {
    return this.x * v.y - this.y * v.x;
  }

  // Angle in radians (-PI to +PI)
  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  // 90° Counter-Clockwise Perpendicular Rotation (-y, x)
  public perp(): Vector2D {
    return new Vector2D(-this.y, this.x);
  }

  // Angle between two vectors in radians
  public angleBetween(v: Vector2D): number {
    const dotMag = this.dot(v) / (this.mag() * v.mag());
    // Clamp to [-1, 1] to prevent NaN from floating point inaccuracies
    const clamped = Math.max(-1, Math.min(1, dotMag));
    return Math.acos(clamped);
  }

  // Vector Projection of this onto target vector
  public projectOnto(target: Vector2D): Vector2D {
    const targetMagSq = target.magSq();
    if (targetMagSq < 1e-9) return new Vector2D(0, 0);
    const scalar = this.dot(target) / targetMagSq;
    return target.scale(scalar);
  }

  // Surface Reflection: v_reflect = v - 2(v · n)n
  public reflect(normal: Vector2D): Vector2D {
    const n = normal.normalize();
    const normalProjection = 2 * this.dot(n);
    return this.sub(n.scale(normalProjection));
  }
}
```

---

# Comprehensive Mastery Problem Set (Class 6 to University)

### Problem 1: Foundations (Class 6–7)
A drone starts at charging pad $P_0(5, 10)$. It executes three consecutive flights:
1. $\vec{d}_1 = (12, -4)$
2. $\vec{d}_2 = (-7, 8)$
3. $\vec{d}_3 = (3, -2)$

**Questions:**
1. What are the drone's final coordinates?
2. What single vector $\vec{d}_{\text{return}}$ will fly the drone directly back to the charging pad in one hop?

**Step-by-Step Solution:**
1. Add initial coordinates and all displacements:
   $$X_{\text{final}} = 5 + 12 - 7 + 3 = 13$$
   $$Y_{\text{final}} = 10 - 4 + 8 - 2 = 12$$
   Final coordinates: $P_{\text{final}}(13, 12)$.
2. The return vector points from $(13, 12)$ back to $(5, 10)$:
   $$\vec{d}_{\text{return}} = \begin{bmatrix} 5 - 13 \\ 10 - 12 \end{bmatrix} = \begin{bmatrix} -8 \\ -2 \end{bmatrix}$$

---

### Problem 2: Geometry & Normalization (Class 8–9)
A submarine sonar detects an underwater drone at displacement $\vec{s} = (-15, 20)\text{ km}$.
1. What is the straight-line distance to the drone?
2. Calculate the unit vector $\hat{s}$ pointing from the submarine toward the drone.
3. If a torpedo travels at $50\text{ km/h}$ along this exact heading, write its velocity vector $\vec{v}_{\text{torpedo}}$.

**Step-by-Step Solution:**
1. Compute the magnitude:
   $$\|\vec{s}\| = \sqrt{(-15)^2 + 20^2} = \sqrt{225 + 400} = \sqrt{625} = 25\text{ km}$$
2. Divide components by magnitude:
   $$\hat{s} = \frac{(-15, 20)}{25} = (-0.6, 0.8)$$
   *Check norm:* $\sqrt{(-0.6)^2 + 0.8^2} = \sqrt{0.36 + 0.64} = 1.0$.
3. Multiply unit direction by speed:
   $$\vec{v}_{\text{torpedo}} = 50 \times (-0.6, 0.8) = (-30, 40)\text{ km/h}$$

---

### Problem 3: Trigonometry & Components (Class 10)
A soccer player kicks a ball with an initial speed of $25\text{ m/s}$ at an angle of $37^\circ$ above the horizontal. (Use $\cos 37^\circ \approx 0.80$, $\sin 37^\circ \approx 0.60$).
1. Find horizontal velocity $v_x$ and vertical velocity $v_y$.
2. If gravity accelerates the ball downward at $a_y = -9.8\text{ m/s}^2$ while horizontal velocity remains constant, what is the ball's velocity vector $\vec{v}$ after $t = 2.0\text{ seconds}$?

**Step-by-Step Solution:**
1. Initial components:
   $$v_{x0} = 25 \cos(37^\circ) = 25 \times 0.80 = 20\text{ m/s}$$
   $$v_{y0} = 25 \sin(37^\circ) = 25 \times 0.60 = 15\text{ m/s}$$
   Initial velocity: $\vec{v}_0 = (20, 15)\text{ m/s}$.
2. At $t = 2\text{ s}$:
   $$v_x(2) = 20\text{ m/s}$$
   $$v_y(2) = v_{y0} + a_y t = 15 + (-9.8)(2) = 15 - 19.6 = -4.6\text{ m/s}$$
   Velocity at 2 seconds: $\vec{v}(2) = (20, -4.6)\text{ m/s}$ (the ball is now falling downward).

---

### Problem 4: Dot Product & Mechanical Work (Class 11–12)
A locomotive pulls a freight railcar along a straight track pointing East with displacement $\vec{d} = (100, 0)\text{ meters}$. The coupling cable exerts a pulling force $\vec{F} = (8000, 6000)\text{ Newtons}$.
1. Find the magnitude of the pulling force $\|\vec{F}\|$.
2. Calculate the mechanical work done: $W = \vec{F} \cdot \vec{d}$.
3. Calculate the angle $\theta$ between the cable and the track.

**Step-by-Step Solution:**
1. Force magnitude:
   $$\|\vec{F}\| = \sqrt{8000^2 + 6000^2} = \sqrt{64,000,000 + 36,000,000} = \sqrt{100,000,000} = 10,000\text{ N}$$
2. Work done:
   $$W = \vec{F} \cdot \vec{d} = (8000 \times 100) + (6000 \times 0) = 800,000\text{ Joules (800 kJ)}$$
   *Notice:* The vertical force of $6,000\text{ N}$ does zero work because the railcar does not move vertically!
3. Angle:
   $$\cos\theta = \frac{\vec{F} \cdot \vec{d}}{\|\vec{F}\| \|\vec{d}\|} = \frac{800,000}{10,000 \times 100} = \frac{800,000}{1,000,000} = 0.80$$
   $$\theta = \arccos(0.80) \approx 36.87^\circ$$

---

### Problem 5: Robotics Steering & Reflection (University / Engineering)
An autonomous vacuum cleaner robot moves forward with velocity $\vec{v} = (5, 5)\text{ m/s}$. It collides with a slanted wall whose surface normal vector is $\hat{n} = (-0.6, 0.8)$.
1. Confirm that $\hat{n}$ is a unit vector.
2. Calculate the dot product $\vec{v} \cdot \hat{n}$.
3. Using $\vec{v}_{\text{rebound}} = \vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}$, calculate the reflected velocity vector.
4. Verify that the speed before collision equals the speed after collision ($\|\vec{v}\| = \|\vec{v}_{\text{rebound}}\|$).

**Step-by-Step Solution:**
1. Check norm:
   $$\|\hat{n}\| = \sqrt{(-0.6)^2 + 0.8^2} = \sqrt{0.36 + 0.64} = 1.0 \quad \text{(Confirmed)}$$
2. Dot product:
   $$\vec{v} \cdot \hat{n} = (5 \times -0.6) + (5 \times 0.8) = -3.0 + 4.0 = +1.0$$
3. Rebound calculation:
   $$2(\vec{v} \cdot \hat{n})\hat{n} = 2(1.0)(-0.6, 0.8) = (-1.2, 1.6)$$
   $$\vec{v}_{\text{rebound}} = \begin{bmatrix} 5 \\ 5 \end{bmatrix} - \begin{bmatrix} -1.2 \\ 1.6 \end{bmatrix} = \begin{bmatrix} 5 - (-1.2) \\ 5 - 1.6 \end{bmatrix} = \begin{bmatrix} 6.2 \\ 3.4 \end{bmatrix}\text{ m/s}$$
4. Speed verification:
   - Initial speed: $\sqrt{5^2 + 5^2} = \sqrt{25 + 25} = \sqrt{50} \approx 7.071\text{ m/s}$.
   - Rebound speed: $\sqrt{6.2^2 + 3.4^2} = \sqrt{38.44 + 11.56} = \sqrt{50.00} \approx 7.071\text{ m/s}$.
   *Conservation of kinetic energy is perfectly preserved!*

---

## 🏛️ Socratic Horizons & Bridge to the Next Module

### Thought Challenge:
> *If you are told that $\vec{u} \cdot \vec{v} = \vec{u} \cdot \vec{w}$, does that imply that $\vec{v} = \vec{w}$?*  
> *In ordinary algebra with scalars, if $a \cdot b = a \cdot c$ and $a \neq 0$, you can divide by $a$ to conclude that $b = c$.*  
> *Can you divide by a vector?*  
> *Answer: **NO!** Rearranging the equation gives $\vec{u} \cdot (\vec{v} - \vec{w}) = 0$. This does not mean $\vec{v} = \vec{w}$; it only means that the difference vector $(\vec{v} - \vec{w})$ is perpendicular to $\vec{u}$! There are infinite vectors $\vec{w}$ that satisfy this condition. You can never divide by a vector.*

### The Bridge to Module 2: From Static Vectors to Rates of Change
Now that you can describe position and velocity as directed arrows in 2D space, a new question arises:  
*What happens when an arrow is constantly changing from millisecond to millisecond?*

When a planet orbits the sun or an apple falls toward the Earth, its velocity arrow changes continuously in both magnitude and direction. To track continuous change, we need the mathematical engine of instantaneous rates of change: **Differential Calculus**. That is the journey of our next module.

---

## 📚 Academic Provenance & Scholarly Citations
1. **Descartes, R. (1637).** *La Géométrie.* Leyde: Ian Maire. [Foundation of Cartesian coordinates].
2. **Gibbs, J. W., & Wilson, E. B. (1901).** *Vector Analysis: A Text-book for the Use of Students of Mathematics and Physics.* Yale University Press / Charles Scribner's Sons. [Archive.org](https://archive.org/details/vectoranalysiste00gibbrich)
3. **Strang, G. (2016).** *Introduction to Linear Algebra* (5th ed.). Wellesley-Cambridge Press. ISBN: 978-0980232776.
4. **Feynman, R. P., Leighton, R. B., & Sands, M. (1963).** *The Feynman Lectures on Physics, Vol. I, Chapter 11: Vectors.* California Institute of Technology. [URL](https://www.feynmanlectures.caltech.edu/I_11.html)
