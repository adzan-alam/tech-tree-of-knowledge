# CHAPTER 6: Reversing and Scaling — Subtraction & Scalar Multiplication

---

## 6.1 Multiplying an Arrow by a Number: Scalar Multiplication

What happens when you multiply a physical arrow by an ordinary number?

In mathematics, an ordinary number is called a **Scalar**. Therefore, multiplying a vector by a number is called **Scalar Multiplication**.

Suppose you are walking along displacement vector $\vec{v} = (3, 2)\text{ km}$.
- What if you walk that exact same direction, but **twice as far**?
- What if you walk that exact same heading, but only **half as far**?
- What if you turn around $180^\circ$ and walk **in the exact opposite direction**?

```
             v = (3, 2)
             ●─────────►
             
             2v = (6, 4)  [Doubled Length, Same Direction]
             ●──────────────────►
             
             0.5v = (1.5, 1.0)  [Halved Length, Same Direction]
             ●────►
             
             -v = (-3, -2)  [Same Length, REVERSED 180° Direction]
   ◄─────────●
```

### The Component Rule of Scalar Multiplication
To multiply vector $\vec{v}$ by scalar $c$, simply multiply every individual component by $c$:

$$c\vec{v} = c\begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} c v_x \\ c v_y \end{bmatrix}$$

### How Scalar Multiplication Affects Magnitude
What happens to the physical length of the arrow? Let us derive this from first principles using our magnitude formula:

$$\|c\vec{v}\| = \sqrt{(c v_x)^2 + (c v_y)^2}$$

Factor out $c^2$ under the radical:

$$\|c\vec{v}\| = \sqrt{c^2 (v_x^2 + v_y^2)}$$

Now pull $c^2$ out from the square root. Remember that $\sqrt{c^2} = |c|$ (the absolute value of $c$, because length is always positive!):

$$\|c\vec{v}\| = |c| \sqrt{v_x^2 + v_y^2} = |c| \|\vec{v}\|$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE LAW OF SCALAR SCALING                            │
├────────────────────────────────────────────────────────────────────────┤
│  1. If c > 1:     The arrow stretches longer.                          │
│  2. If 0 < c < 1: The arrow shrinks shorter.                           │
│  3. If c = 0:     The arrow collapses to the Zero Vector (0, 0).       │
│  4. If c < 0:     The arrow flips by 180° and points backward!         │
│                                                                        │
│  The new length is ALWAYS: ||c v|| = |c| * ||v||                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6.2 Vector Subtraction: The Relative Journey

In elementary school arithmetic, subtraction is introduced as the opposite of addition. If $5 + 3 = 8$, then $8 - 3 = 5$.

In linear algebra, we define subtraction using scalar multiplication by $-1$:

$$\vec{u} - \vec{v} = \vec{u} + (-1)\vec{v}$$

To subtract vector $\vec{v}$ from vector $\vec{u}$, you simply **flip vector $\vec{v}$ backward by $180^\circ$**, and then add it to $\vec{u}$ using the standard Tip-to-Tail rule!

### The Geometric Shortcut: Tail-to-Tail Subtraction
There is a profound geometric shortcut that every game developer and robotics engineer uses daily:

```
                            B (Tip of u)
                            ●
                           /│
                          / │
                         /  │
                        /   │
                     u /    │ Difference Vector:
                      /     │ d = u - v
                     /      │ (Points from Tip of v TO Tip of u!)
                    /       │
                   /        │
                  ●─────────┘
                 O (Shared Tail)    v     C (Tip of v)
```

1. Anchor the tails of both vector $\vec{u}$ and vector $\vec{v}$ at the exact same point $O$.
2. The difference vector $\vec{d} = \vec{u} - \vec{v}$ is the arrow that stretches **from the tip of $\vec{v}$ to the tip of $\vec{u}$**.

### How to Remember the Arrowhead Direction
Students often get confused: *Does $\vec{u} - \vec{v}$ point toward $\vec{u}$ or toward $\vec{v}$?*

Think of simple arithmetic:
$$8 - 3 = +5$$
You started at 3 and took $+5$ steps forward to reach 8.

Similarly, in vectors:
$$\vec{v} + (\vec{u} - \vec{v}) = \vec{u}$$
The vector $(\vec{u} - \vec{v})$ is the journey required to **start at the tip of $\vec{v}$ and arrive at the tip of $\vec{u}$**!

$$\vec{u} - \vec{v} \implies \text{Arrowhead points TO } \vec{u}$$

---

## 6.3 The Concept of Relative Displacement & Relative Velocity

Why is vector subtraction so critically important in modern technology? 

Because of **Relativity**: How one moving object perceives another moving object.

### Scenario: The Laser Turret and the Target Drone
Imagine a defense turret at position $\vec{p}_{\text{turret}}$ tracking an incoming aerial drone at position $\vec{p}_{\text{drone}}$.

How does the turret's targeting computer calculate the line-of-fire vector $\vec{r}_{\text{aim}}$?

$$\vec{r}_{\text{aim}} = \vec{p}_{\text{drone}} - \vec{p}_{\text{turret}}$$

```
                       Drone Position
                       p_drone (300, 200)
                             ●
                            ▲
                           /
                          / Line of Fire:
                         /  r = p_drone - p_turret
                        /   = (300 - 100, 200 - 50)
                       /    = (200, 150)
                      /
                     ●
                Turret Position
                p_turret (100, 50)
```

### Scenario: Highway Overtaking (Relative Velocity)
Imagine you are driving your car North on a straight highway at $100\text{ km/h}$. 
A red sports car in the next lane is also driving North at $110\text{ km/h}$.

When you look out your passenger window, does the red car look like it is traveling at $110\text{ km/h}$? 

**No!** To your eyes, the red car is slowly creeping past you at a leisurely walking pace of:

$$\vec{v}_{\text{relative}} = \vec{v}_{\text{sports}} - \vec{v}_{\text{you}} = 110\text{ km/h} - 100\text{ km/h} = +10\text{ km/h}$$

Now imagine a semi-truck driving in the opposite direction (South) at $90\text{ km/h}$ (Velocity: $-90\text{ km/h}$).

What is the relative closing velocity between you and the oncoming truck?

$$\vec{v}_{\text{closing}} = \vec{v}_{\text{truck}} - \vec{v}_{\text{you}} = (-90\text{ km/h}) - (+100\text{ km/h}) = -190\text{ km/h}!$$

The two vehicles are closing the gap at a terrifying speed of $190\text{ km/h}$. This is why head-on collisions are so catastrophic: vector subtraction sums the opposing speeds!

---

## 6.4 Socratic Dialogue: Alice and The Vectorist on Relative Motion

> **Alice:** "Wait, so is there no such thing as 'true' velocity in the universe?"
>
> **The Vectorist:** "You have just stumbled onto the foundational principle of modern physics, Alice! **All motion is relative.**
> Right now, you feel like you are sitting completely still in your chair. Your velocity relative to your floor is $0\text{ m/s}$.
> But the Earth is rotating on its axis, carrying you Eastward at $1,600\text{ km/h}$!
> And the Earth is orbiting the Sun at $107,000\text{ km/h}$!
> And our solar system is orbiting the Milky Way galaxy at $828,000\text{ km/h}$!"
>
> **Alice:** "My head is spinning!"
>
> **The Vectorist:** "Don't worry! That is why we define a **Frame of Reference**. When we subtract vectors ($\vec{v}_B - \vec{v}_A$), we are asking: *'How does the world look from the viewpoint of observer A?'*
> By subtracting observer A's velocity vector, we effectively freeze observer A in place at the Origin $(0, 0)$!"

---

## 6.5 Ten Concrete Worked Numerical Examples: Scaling & Subtraction

---

### Example 1: Basic Scalar Multiplication
* **Problem:** Given vector $\vec{v} = (4, -7)$, calculate:
  (a) $3\vec{v}$,
  (b) $-5\vec{v}$,
  (c) $0.5\vec{v}$.
* **Solution:**
  - (a) $3\vec{v} = (3 \times 4, 3 \times -7) = (12, -21)$
  - (b) $-5\vec{v} = (-5 \times 4, -5 \times -7) = (-20, +35)$
  - (c) $0.5\vec{v} = (0.5 \times 4, 0.5 \times -7) = (2.0, -3.5)$

---

### Example 2: Proof of Length Scaling
* **Problem:** Let $\vec{u} = (3, 4)$ (which has length $\|\vec{u}\| = 5$). Calculate the vector $\vec{w} = -4\vec{u}$, and verify algebraically that $\|\vec{w}\| = 4 \|\vec{u}\| = 20$.
* **Step-by-Step Calculation:**
  1. Multiply components:
     $$\vec{w} = -4(3, 4) = (-12, -16)$$
  2. Compute magnitude of $\vec{w}$:
     $$\|\vec{w}\| = \sqrt{(-12)^2 + (-16)^2} = \sqrt{144 + 256} = \sqrt{400} = 20$$
  3. Verify against rule:
     $$|-4| \times \|\vec{u}\| = 4 \times 5 = 20$$
* **Verified:** The negative scalar reversed the direction by $180^\circ$, but scaled the length by exactly $+4$.

---

### Example 3: Basic Component-Wise Subtraction
* **Problem:** Subtract vector $\vec{v} = (5, 9)$ from vector $\vec{u} = (12, 4)$.
* **Calculation:**
  $$\vec{u} - \vec{v} = \begin{bmatrix} 12 - 5 \\ 4 - 9 \end{bmatrix} = \begin{bmatrix} 7 \\ -5 \end{bmatrix}$$
* **Sanity Check:** Add $\vec{v}$ back to verify: $(7, -5) + (5, 9) = (12, 4) = \vec{u}$. Perfect!

---

### Example 4: Order Matters (Anti-Commutativity)
* **Problem:** Show that $\vec{u} - \vec{v} \ne \vec{v} - \vec{u}$ for $\vec{u} = (8, 2)$ and $\vec{v} = (3, 6)$.
* **Order 1 ($\vec{u} - \vec{v}$):**
  $$\vec{u} - \vec{v} = (8 - 3, 2 - 6) = (+5, -4)$$
* **Order 2 ($\vec{v} - \vec{u}$):**
  $$\vec{v} - \vec{u} = (3 - 8, 6 - 2) = (-5, +4)$$
* **The Anti-Commutative Law:**
  $$\vec{u} - \vec{v} = -(\vec{v} - \vec{u})$$
  Swapping the order gives the exact same length, but reverses the arrow by $180^\circ$!

---

### Example 5: Distance Between Two Moving Vehicles
* **Problem:** Car Alpha is at $P_A(40, 20)\text{ meters}$. Car Beta is at $P_B(100, 100)\text{ meters}$.
  Find the relative displacement vector $\vec{r}_{B/A}$ (where Beta is relative to Alpha) and the straight-line distance between them.
* **Calculation:**
  $$\vec{r}_{B/A} = P_B - P_A = (100 - 40, 100 - 20) = (60, 80)\text{ meters}$$
  $$\text{Distance} = \|\vec{r}_{B/A}\| = \sqrt{60^2 + 80^2} = \sqrt{3600 + 6400} = \sqrt{10,000} = 100\text{ meters}$$

---

### Example 6: Relative Velocity of Airplanes
* **Problem:** Flight 101 flies North-East with velocity $\vec{v}_1 = (150, 150)\text{ knots}$. Flight 202 flies due East with velocity $\vec{v}_2 = (210, 0)\text{ knots}$. What is the velocity of Flight 101 as seen by the pilot of Flight 202?
* **Relative Velocity Formula:**
  $$\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2 = \begin{bmatrix} 150 - 210 \\ 150 - 0 \end{bmatrix} = \begin{bmatrix} -60 \\ 150 \end{bmatrix}\text{ knots}$$
* **Interpretation:** To the pilot of Flight 202, Flight 101 appears to be drifting Westward at $60\text{ knots}$ while moving Northward at $150\text{ knots}$.

---

### Example 7: Newton's Second Law ($\vec{a} = \vec{F} / m$)
* **Problem:** An ice hockey puck with mass $m = 0.20\text{ kg}$ is struck by a hockey stick, experiencing force $\vec{F} = (18, -24)\text{ N}$. Calculate the acceleration vector $\vec{a}$.
* **Calculation:**
  - Dividing by mass $m$ is scalar multiplication by $\frac{1}{m} = \frac{1}{0.20} = 5.0$:
    $$\vec{a} = \frac{1}{0.20} \begin{bmatrix} 18 \\ -24 \end{bmatrix} = 5.0 \begin{bmatrix} 18 \\ -24 \end{bmatrix} = \begin{bmatrix} 90 \\ -120 \end{bmatrix}\text{ m/s}^2$$
* **Acceleration Magnitude:**
  $$\|\vec{a}\| = \sqrt{90^2 + (-120)^2} = \sqrt{8100 + 14400} = \sqrt{22500} = 150\text{ m/s}^2$$

---

### Example 8: Extrapolating a Linear Trajectory
* **Problem:** A drone is at position $\vec{p}_0 = (50, 80)\text{ m}$ at time $t = 0$. It moves with constant velocity $\vec{v} = (12, -4)\text{ m/s}$. Predict its position at $t = 5.0\text{ seconds}$ using $\vec{p}(t) = \vec{p}_0 + t\vec{v}$.
* **Calculation:**
  $$\vec{p}(5) = \begin{bmatrix} 50 \\ 80 \end{bmatrix} + 5.0 \begin{bmatrix} 12 \\ -4 \end{bmatrix}$$
  $$\vec{p}(5) = \begin{bmatrix} 50 \\ 80 \end{bmatrix} + \begin{bmatrix} 60 \\ -20 \end{bmatrix} = \begin{bmatrix} 50 + 60 \\ 80 - 20 \end{bmatrix} = \begin{bmatrix} 110 \\ 60 \end{bmatrix}\text{ meters}$$

---

### Example 9: Midpoint as Vector Average
* **Problem:** Prove that the midpoint $M$ between two points $A$ and $B$ can be written as the scalar product $M = 0.5 A + 0.5 B$.
* **Algebraic Proof:**
  $$M = A + 0.5\vec{AB} = A + 0.5(B - A) = A + 0.5B - 0.5A = (1 - 0.5)A + 0.5B = 0.5A + 0.5B$$
* **Numerical Check:** For $A(2, 4)$ and $B(8, 10)$:
  $$M = 0.5(2, 4) + 0.5(8, 10) = (1, 2) + (4, 5) = (5, 7)$$
  Verified!

---

### Example 10: Software Division by Zero Hazard
* **Problem:** In physics simulation code, a programmer writes:
  ```typescript
  function accelerate(force: Vector2D, mass: number): Vector2D {
    return new Vector2D(force.x / mass, force.y / mass);
  }
  ```
  What happens if an immovable wall with mass `mass = 0` is passed to this function?
* **Hardware Analysis:**
  - `force.x / 0.0` yields `Infinity` (or `-Infinity`).
  - If `force.x = 0`, `0.0 / 0.0` yields `NaN` (Not-a-Number).
  - In a physics engine, once a single particle's coordinate becomes `NaN`, every position update that touches it becomes `NaN`. Within 3 frames, the entire simulation world disappears into an invisible void!
* **The Fix:**
  ```typescript
  function accelerateSafe(force: Vector2D, mass: number): Vector2D {
    if (mass <= 1e-7) return new Vector2D(0, 0); // Infinite mass -> immovable
    const invMass = 1.0 / mass;
    return new Vector2D(force.x * invMass, force.y * invMass);
  }
  ```

---

## 6.6 Debunked Misconceptions & Traps

### Misconception 1: "Scalar division is a separate third vector operation."
* **The Reality:** There is no special "vector division" operation in linear algebra. Dividing a vector by a scalar $c$ is simply multiplying by the reciprocal scalar:
  $$\frac{\vec{v}}{c} = \left(\frac{1}{c}\right)\vec{v}$$
  *(Note: You can NEVER divide a vector by another vector! Expressions like $\frac{\vec{u}}{\vec{v}}$ are mathematically illegal and meaningless).*

### Misconception 2: "Subtracting vectors always makes them shorter."
* **The Reality:** If you subtract a negative vector, you are adding!
  $$(10, 0) - (-10, 0) = (10 - (-10), 0) = (20, 0)$$
  The difference vector has a length of 20, twice as long as the original!

---

## 6.7 Historical Context: Galileo Galilei & Classical Relativity

The concept of relative vectors was born in 1632 in Florence, Italy, when **Galileo Galilei** published his masterpiece *Dialogue Concerning the Two Chief World Systems*.

Critics of the Copernican theory argued: *"If the Earth is spinning through space at immense speed, why don't birds get blown out of the sky? If you drop a stone from a tall tower, why doesn't the Earth rotate away beneath it, causing the stone to land miles behind the tower?"*

Galileo answered with the famous thought experiment of **The Great Ship**:

> *"Shut yourself up with some friend in the main cabin below decks on some large ship, and have with you there some flies, butterflies, and other small flying animals. Have a large bowl of water with some fish in it; hang up a bucket that drips water drop by drop into a wide vessel below.
>
> While the ship stands still, observe how the drops fall into the vessel below; how the fish swim indifferently in all directions; how the butterflies fly to all parts of the cabin.
>
> Now have the ship proceed with any speed you like, so long as the motion is uniform and not fluctuating this way and that. You will not be able to detect the least change in any of the motions, nor could you tell from any of them whether the ship was moving or standing still. The drops will fall into the vessel just as before; the fish will swim no more toward the stern than toward the bow..."*

Galileo proved that the physics occurring inside a moving frame is identical to a stationary frame. The velocity of the falling drop relative to the ship is simply the drop's velocity relative to the Earth **minus the ship's velocity vector**:

$$\vec{v}_{\text{drop/ship}} = \vec{v}_{\text{drop/earth}} - \vec{v}_{\text{ship/earth}}$$

This principle of vector subtraction formed the foundation upon which Albert Einstein built his Theory of Special Relativity nearly 300 years later.

---

## 6.8 Chapter 6 Mastery Problem Set

Consolidate your mastery of vector subtraction and scalar multiplication with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Given $\vec{u} = (6, -4)$ and $\vec{v} = (2, 5)$, calculate:
   - (a) $2\vec{u}$
   - (b) $-3\vec{v}$
   - (c) $\vec{u} - \vec{v}$
   - (d) $\vec{v} - \vec{u}$

2. **[Tier 1 - Class 6]** A balloon rises vertically with displacement $\vec{d} = (0, 40)\text{ meters}$. A gust of wind causes it to drift such that its new total displacement is $(30, 40)\text{ meters}$.
   - What displacement vector did the wind gust introduce?

3. **[Tier 2 - Class 7]** Two cars are driving down a straight two-lane highway.
   - Car 1: Position $P_1 = (120, 0)\text{ m}$, Velocity $\vec{v}_1 = (25, 0)\text{ m/s}$.
   - Car 2: Position $P_2 = (300, 0)\text{ m}$, Velocity $\vec{v}_2 = (15, 0)\text{ m/s}$.
   - Write the initial relative position vector $\vec{r}_{2/1} = P_2 - P_1$.
   - Write the relative velocity vector $\vec{v}_{\text{rel}} = \vec{v}_2 - \vec{v}_1$.
   - How many seconds until Car 1 catches up and passes Car 2?

4. **[Tier 2 - Class 7]** An artist scales a 2D digital character sprite. The original sword vertex is at offset $\vec{v} = (1.2, 3.6)\text{ cm}$.
   - The artist applies a scaling factor of $c = 2.5$. What is the new vertex vector?
   - The artist then mirrors the sword horizontally by multiplying the X-component by $-1$. What is the mirrored vector?

5. **[Tier 3 - Class 8]** If $\vec{a} = 3\hat{i} - 4\hat{j}$ and $\vec{b} = -2\hat{i} + 6\hat{j}$, calculate the magnitude of the difference vector:
   $$\|\vec{a} - \vec{b}\|$$

6. **[Tier 3 - Class 8]** A radar tracking station at $O(0, 0)$ tracks an unauthorized drone. At $t = 0$, the drone is at $P_0(200, 500)\text{ m}$. At $t = 4.0\text{ seconds}$, the drone is at $P_1(360, 380)\text{ m}$.
   - Compute the drone's displacement vector $\Delta\vec{r} = P_1 - P_0$.
   - Compute the drone's average velocity vector $\vec{v}_{\text{avg}} = \Delta\vec{r} / \Delta t$.
   - Compute the drone's average speed.

7. **[Tier 4 - High School]** A robotic arm tip is at position $A(15, 25)\text{ cm}$. A conveyor belt brings an electronic circuit board to position $B(45, 65)\text{ cm}$.
   - Calculate the transit vector $\vec{AB}$.
   - The robot controller moves the arm along this vector in 5 equal discrete intermediate time steps. Calculate the incremental step vector $\Delta\vec{s} = \frac{1}{5}\vec{AB}$.

8. **[Tier 4 - High School]** Solve for the unknown vector $\vec{x}$ in the following vector equation:
   $$3\vec{x} - 2\begin{bmatrix} 4 \\ -5 \end{bmatrix} = \begin{bmatrix} 7 \\ 8 \end{bmatrix}$$

9. **[Tier 5 - Aerospace]** An air traffic control radar tracks two descending aircraft:
   - Aircraft A: $\vec{p}_A = (12, 16)\text{ km}$, Velocity $\vec{v}_A = (-120, -160)\text{ km/h}$.
   - Aircraft B: $\vec{p}_B = (15, 20)\text{ km}$, Velocity $\vec{v}_B = (-150, -200)\text{ km/h}$.
   - Calculate the distance between the two planes at $t = 0$.
   - Are the two planes on a collision course? Explain using relative velocity.

10. **[Tier 5 - University / Physics]** In an elastic 2D collision simulation, a particle with velocity $\vec{v} = (10, -5)\text{ m/s}$ rebounds off a frictionless vertical wall. The wall exerts an impulse vector that flips the horizontal component while leaving the vertical component unchanged.
    - Write the rebound velocity vector $\vec{v}_{\text{rebound}}$.
    - Calculate the change in velocity vector: $\Delta\vec{v} = \vec{v}_{\text{rebound}} - \vec{v}$.
    - If the collision lasted $\Delta t = 0.02\text{ seconds}$ and the particle mass is $m = 0.5\text{ kg}$, calculate the average force vector $\vec{F} = m \frac{\Delta\vec{v}}{\Delta t}$ exerted by the wall.

---

### Step-by-Step Solutions

#### Solution 1:
- (a) $2\vec{u} = (2 \times 6, 2 \times -4) = (12, -8)$
- (b) $-3\vec{v} = (-3 \times 2, -3 \times 5) = (-6, -15)$
- (c) $\vec{u} - \vec{v} = (6 - 2, -4 - 5) = (4, -9)$
- (d) $\vec{v} - \vec{u} = (2 - 6, 5 - (-4)) = (-4, 9)$

#### Solution 2:
- Wind vector:
  $$\vec{d}_{\text{wind}} = \vec{d}_{\text{new}} - \vec{d}_{\text{original}} = (30 - 0, 40 - 40) = (30, 0)\text{ meters (East)}$$

#### Solution 3:
- Relative position: $\vec{r}_{2/1} = 300 - 120 = +180\text{ meters}$.
- Relative velocity: $\vec{v}_{\text{rel}} = 15 - 25 = -10\text{ m/s}$ (Car 1 closes the gap at $10\text{ m/s}$).
- Time to catch up:
  $$t = \frac{\text{Gap}}{\text{Closing Speed}} = \frac{180\text{ m}}{10\text{ m/s}} = 18.0\text{ seconds}$$

#### Solution 4:
- Scaled vector: $2.5(1.2, 3.6) = (3.0, 9.0)\text{ cm}$.
- Mirrored vector: $(-1 \times 3.0, 9.0) = (-3.0, 9.0)\text{ cm}$.

#### Solution 5:
- Difference vector $\vec{d} = \vec{a} - \vec{b}$:
  $$\vec{d} = (3 - (-2))\hat{i} + (-4 - 6)\hat{j} = 5\hat{i} - 10\hat{j}$$
- Magnitude:
  $$\|\vec{d}\| = \sqrt{5^2 + (-10)^2} = \sqrt{25 + 100} = \sqrt{125} = \sqrt{25 \times 5} = 5\sqrt{5} \approx 11.18\text{ units}$$

#### Solution 6:
- Displacement:
  $$\Delta\vec{r} = (360 - 200, 380 - 500) = (160, -120)\text{ meters}$$
- Average velocity:
  $$\vec{v}_{\text{avg}} = \frac{(160, -120)}{4.0} = (40, -30)\text{ m/s}$$
- Average speed:
  $$\|\vec{v}_{\text{avg}}\| = \sqrt{40^2 + (-30)^2} = \sqrt{1600 + 900} = \sqrt{2500} = 50\text{ m/s}$$

#### Solution 7:
- Transit vector:
  $$\vec{AB} = (45 - 15, 65 - 25) = (30, 40)\text{ cm}$$
- Step vector:
  $$\Delta\vec{s} = \frac{1}{5}(30, 40) = (6, 8)\text{ cm}$$

#### Solution 8:
- Add $2(4, -5) = (8, -10)$ to both sides:
  $$3\vec{x} = \begin{bmatrix} 7 \\ 8 \end{bmatrix} + \begin{bmatrix} 8 \\ -10 \end{bmatrix} = \begin{bmatrix} 15 \\ -2 \end{bmatrix}$$
- Divide by 3:
  $$\vec{x} = \begin{bmatrix} 15/3 \\ -2/3 \end{bmatrix} = \begin{bmatrix} 5 \\ -2/3 \end{bmatrix}$$

#### Solution 9:
- Initial relative position:
  $$\vec{r}_{B/A} = (15 - 12, 20 - 16) = (3, 4)\text{ km}$$
  $$\text{Distance} = \sqrt{3^2 + 4^2} = 5\text{ km}$$
- Relative velocity:
  $$\vec{v}_{B/A} = \vec{v}_B - \vec{v}_A = (-150 - (-120), -200 - (-160)) = (-30, -40)\text{ km/h}$$
- Collision course check: Notice that the relative velocity vector points directly along the line connecting them:
  $$\vec{v}_{B/A} = -10 \times (3, 4) = -10 \vec{r}_{B/A}$$
  Because the closing velocity points directly along their line of separation, Plane B will hit Plane A in:
  $$t = \frac{5\text{ km}}{50\text{ km/h}} = 0.1\text{ hours (6 minutes)}$$
  **Yes, they are on a direct collision course!**

#### Solution 10:
- Rebound velocity: $\vec{v}_{\text{rebound}} = (-10, -5)\text{ m/s}$.
- Change in velocity:
  $$\Delta\vec{v} = (-10, -5) - (10, -5) = (-10 - 10, -5 - (-5)) = (-20, 0)\text{ m/s}$$
- Average force:
  $$\vec{F} = 0.5 \times \frac{(-20, 0)}{0.02} = 0.5 \times (-1000, 0) = (-500, 0)\text{ Newtons}$$
  The wall exerts a force of $500\text{ N}$ to the left.
