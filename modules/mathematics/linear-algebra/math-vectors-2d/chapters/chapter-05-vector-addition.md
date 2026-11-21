# CHAPTER 5: Journeys in Succession — Vector Addition & Physical Forces

---

## 5.1 The Physical Reality of Combining Motions

In the real world, an object rarely experiences a single isolated motion or force. Nature is a symphony of simultaneous influences.

Consider these everyday physical realities:
- **The Swimmer in the River:** You jump into a river and swim with all your might directly toward the opposite bank (North) at $2\text{ m/s}$. But the river's current is sweeping furiously downstream (East) at $3\text{ m/s}$. Which way do you actually move? Where do you wash ashore?
- **The Passenger on the Train:** You walk down the aisle of an Amtrak express train at $1.5\text{ m/s}$ toward the dining car while the train rockets across the countryside at $45\text{ m/s}$. To an observer standing near the railroad tracks, how fast are you traveling?
- **The Tugboats and the Supertanker:** Two tugboats attach steel cables to the bow of a massive 200,000-ton oil tanker. One tug pulls North-East; the other pulls South-East. The giant ship glides smoothly straight East down the center of the shipping channel!

```
                    Tugboat Alpha Force Vector
                           ▲
                          /
                         /
     Supertanker        /══════════════════════════════► Resultant Force
     ══════════════════●                                 (Straight East!)
                        \
                         \
                          \
                           ▼
                    Tugboat Beta Force Vector
```

How does nature combine these individual arrows into a single, unified physical reality? The answer is **Vector Addition**.

---

## 5.2 The Tip-to-Tail Rule: Sequential Journeys

The most intuitive, geometric way to add two vectors is the **Tip-to-Tail Rule** (sometimes called the *Polygon Method*).

Suppose you take two consecutive hikes:
1. First, you hike along displacement vector $\vec{u}$.
2. Second, starting from where that first hike ended, you hike along displacement vector $\vec{v}$.

```
                                      Final Destination
                                              ●
                                             /│
                                            / │
                                      v    /  │
                                          /   │
                          Waypoint       /    │ Resultant Vector
                             ●          /     │ R = u + v
                            /          /      │
                           /          /       │
                      u   /          /        │
                         /          /         │
                        /          /          │
                       ●──────────┴───────────┘
                    Start
```

### The Three Steps of Tip-to-Tail Addition
1. Draw the first vector $\vec{u}$ starting at your Origin.
2. Pick up the second vector $\vec{v}$ (remember: vectors are free to move without rotating!) and place its **Tail** directly onto the **Tip** of vector $\vec{u}$.
3. Draw a brand new arrow starting at the **very beginning** (the tail of $\vec{u}$) and pointing directly to the **very end** (the tip of $\vec{v}$).

This new arrow is called the **Resultant Vector** (written $\vec{R} = \vec{u} + \vec{v}$). It represents the net single journey that achieves the exact same physical result as taking both trips one after the other.

---

## 5.3 The Parallelogram Law: Simultaneous Concurrent Forces

The Tip-to-Tail rule is wonderful for journeys taken one after the other in time. But what about forces that act on the exact same point at the exact same instant?

When two tugboats pull on a ship's anchor ring, both cables are tied to the exact same ring at the origin. 

In this scenario, we use the **Parallelogram Law**:

```
                       C                      B (Tip of Resultant)
                       ┌──────────────────────●
                      /                      /
                     /                      /
                  v /                      / v
                   /                      /
                  /                      /
                 ●──────────────────────┘
                A (Origin)          u          D
```

1. Anchor the tails of both vector $\vec{u}$ and vector $\vec{v}$ at the exact same starting point $A$.
2. Complete the four-sided **Parallelogram** by drawing a dashed line parallel to $\vec{u}$ starting at the tip of $\vec{v}$, and a dashed line parallel to $\vec{v}$ starting at the tip of $\vec{u}$.
3. The resultant vector $\vec{R} = \vec{u} + \vec{v}$ is the **main diagonal arrow** stretching from the shared tail $A$ to the opposite corner $B$!

### The Equivalence
Notice that side $CB$ of the parallelogram is identical in length and direction to vector $\vec{u}$, and side $DB$ is identical to vector $\vec{v}$. Therefore, the Parallelogram Law and the Tip-to-Tail Rule produce the **exact same resultant vector** in every single case!

---

## 5.4 Component-Wise Algebraic Addition

Geometric arrows are intuitive, but how does an autopilot computer or a game physics engine add vectors with absolute precision at 120 frames per second?

It uses **Component-Wise Addition**.

Let us prove algebraically why this works from first principles.

### The First-Principles Algebraic Proof
Let vector $\vec{u}$ and vector $\vec{v}$ be expressed in terms of the fundamental Cartesian basis vectors $\hat{i}$ and $\hat{j}$:

$$\vec{u} = u_x \hat{i} + u_y \hat{j}$$
$$\vec{v} = v_x \hat{i} + v_y \hat{j}$$

Now write their vector sum:

$$\vec{u} + \vec{v} = (u_x \hat{i} + u_y \hat{j}) + (v_x \hat{i} + v_y \hat{j})$$

Because ordinary addition is commutative and associative, we can rearrange the terms and group all the $\hat{i}$ steps together, and all the $\hat{j}$ steps together:

$$\vec{u} + \vec{v} = (u_x \hat{i} + v_x \hat{i}) + (u_y \hat{j} + v_y \hat{j})$$

Now factor out the basis vectors $\hat{i}$ and $\hat{j}$:

$$\vec{u} + \vec{v} = (u_x + v_x)\hat{i} + (u_y + v_y)\hat{j}$$

In column matrix format:

$$\begin{bmatrix} u_x \\ u_y \end{bmatrix} + \begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} u_x + v_x \\ u_y + v_y \end{bmatrix}$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                    THE LAW OF COMPONENT-WISE ADDITION                  │
├────────────────────────────────────────────────────────────────────────┤
│  To add any two vectors together:                                      │
│  1. Simply add their horizontal components: R_x = u_x + v_x            │
│  2. Simply add their vertical components:   R_y = u_y + v_y            │
│                                                                        │
│  Horizontal never bleeds into vertical. They add in parallel lanes!    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5.5 Socratic Dialogue: The Collinear Equality Condition

> **Alice:** "If I have vector $\vec{u}$ of length 3, and vector $\vec{v}$ of length 4, will their sum $\vec{u} + \vec{v}$ always have a length of 7?"
>
> **The Vectorist:** "Almost never, Alice! Think about it geometrically. 
> - If $\vec{u}$ points East (length 3), and $\vec{v}$ points North (length 4), their sum forms our 3–4–5 triangle. The length is **5**, not 7!
> - If $\vec{u}$ points East (length 3), and $\vec{v}$ points West (length 4), they fight each other! The resultant has a length of **$4 - 3 = 1$**!"
>
> **Alice:** "So when CAN the lengths add up to $3 + 4 = 7$?"
>
> **The Vectorist:** "There is **only ONE condition** in the universe where $\|\vec{u} + \vec{v}\| = \|\vec{u}\| + \|\vec{v}\|$:
> When both vectors point in the **EXACT SAME DIRECTION** (they are parallel and collinear)!
> In every other case:
> $$\|\vec{u} + \vec{v}\| < \|\vec{u}\| + \|\vec{v}\|$$
> This is the immortal **Triangle Inequality**."

---

## 5.6 The Four Axioms of Vector Addition

In mathematics, vector addition is governed by four foundational laws (axioms). Every physics engine and graphics shader relies on these invariants:

1. **Commutative Law (Order Does Not Matter):**
   $$\vec{u} + \vec{v} = \vec{v} + \vec{u}$$
   *Proof:* $u_x + v_x = v_x + u_x$ and $u_y + v_y = v_y + u_y$ because scalar numbers commute. Geometrically, taking path $\vec{u}$ then $\vec{v}$ lands at the exact same corner as taking path $\vec{v}$ then $\vec{u}$.

2. **Associative Law (Grouping Does Not Matter):**
   $$(\vec{u} + \vec{v}) + \vec{w} = \vec{u} + (\vec{v} + \vec{w})$$
   *Proof:* Follows directly from scalar associativity: $(u_x + v_x) + w_x = u_x + (v_x + w_x)$.

3. **Additive Identity (The Zero Vector):**
   $$\vec{v} + \vec{0} = \vec{v}$$
   *Proof:* $\begin{bmatrix} v_x \\ v_y \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} v_x + 0 \\ v_y + 0 \end{bmatrix} = \begin{bmatrix} v_x \\ v_y \end{bmatrix}$.

4. **Additive Inverse (The Negation Arrow):**
   $$\vec{v} + (-\vec{v}) = \vec{0}$$
   *Proof:* $\begin{bmatrix} v_x \\ v_y \end{bmatrix} + \begin{bmatrix} -v_x \\ -v_y \end{bmatrix} = \begin{bmatrix} v_x - v_x \\ v_y - v_y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$. Walking a path and then walking it backward in reverse leaves you with zero net displacement.

---

## 5.7 Ten Concrete Worked Numerical Examples: Vector Addition

---

### Example 1: Parallel Collinear Addition
* **Problem:** Two horses pull a heavy plough due East along a straight furrow. Horse 1 exerts force $\vec{F}_1 = (450, 0)\text{ N}$. Horse 2 exerts force $\vec{F}_2 = (380, 0)\text{ N}$. Find the total pulling force $\vec{F}_{\text{net}}$.
* **Calculation:**
  $$\vec{F}_{\text{net}} = \begin{bmatrix} 450 + 380 \\ 0 + 0 \end{bmatrix} = \begin{bmatrix} 830 \\ 0 \end{bmatrix}\text{ N}$$
* **Magnitude:** $\|\vec{F}_{\text{net}}\| = 830\text{ N}$ due East. (Because they are parallel, magnitudes add directly: $450 + 380 = 830\text{ N}$).

---

### Example 2: Opposing Collinear Addition
* **Problem:** A jet airliner flies due North with an engine airspeed velocity $\vec{v}_{\text{engine}} = (0, 240)\text{ m/s}$. It encounters a fierce headwind blowing due South with velocity $\vec{v}_{\text{wind}} = (0, -45)\text{ m/s}$. Find the airliner's ground velocity vector.
* **Calculation:**
  $$\vec{v}_{\text{ground}} = \vec{v}_{\text{engine}} + \vec{v}_{\text{wind}} = \begin{bmatrix} 0 + 0 \\ 240 + (-45) \end{bmatrix} = \begin{bmatrix} 0 \\ 195 \end{bmatrix}\text{ m/s}$$
* **Ground Speed:** The airliner covers ground at $195\text{ m/s}$ due North.

---

### Example 3: Strictly Orthogonal Addition (Perpendicular)
* **Problem:** A motorboat speeds due East across a calm lake at $8\text{ m/s}$. It enters a river channel where the current sweeps due North at $6\text{ m/s}$. Find the resultant velocity vector $\vec{v}_{\text{net}}$ and the boat's true speed.
* **Calculation:**
  $$\vec{v}_{\text{boat}} = \begin{bmatrix} 8 \\ 0 \end{bmatrix}\text{ m/s}, \quad \vec{v}_{\text{current}} = \begin{bmatrix} 0 \\ 6 \end{bmatrix}\text{ m/s}$$
  $$\vec{v}_{\text{net}} = \begin{bmatrix} 8 + 0 \\ 0 + 6 \end{bmatrix} = \begin{bmatrix} 8 \\ 6 \end{bmatrix}\text{ m/s}$$
* **True Speed:**
  $$\|\vec{v}_{\text{net}}\| = \sqrt{8^2 + 6^2} = \sqrt{64 + 36} = \sqrt{100} = 10\text{ m/s}$$

---

### Example 4: General Multi-Component Addition
* **Problem:** In a robotics simulator, an arm joint experiences two simultaneous torque-induced forces: $\vec{F}_1 = (14.2, -8.6)\text{ N}$ and $\vec{F}_2 = (-6.7, 15.4)\text{ N}$. Calculate the resultant force $\vec{F}_{\text{res}}$.
* **Calculation:**
  $$F_{\text{res}, x} = 14.2 + (-6.7) = 14.2 - 6.7 = +7.5\text{ N}$$
  $$F_{\text{res}, y} = -8.6 + 15.4 = +6.8\text{ N}$$
  $$\vec{F}_{\text{res}} = \begin{bmatrix} 7.5 \\ 6.8 \end{bmatrix}\text{ N}$$
* **Magnitude:**
  $$\|\vec{F}_{\text{res}}\| = \sqrt{7.5^2 + 6.8^2} = \sqrt{56.25 + 46.24} = \sqrt{102.49} \approx 10.124\text{ N}$$

---

### Example 5: Cumulative Three-Leg Hike
* **Problem:** A surveyor traces the perimeter of a national park using three consecutive displacement vectors:
  - Leg 1: $\vec{d}_1 = (4, 1)\text{ km}$
  - Leg 2: $\vec{d}_2 = (2, 5)\text{ km}$
  - Leg 3: $\vec{d}_3 = (-3, 2)\text{ km}$
  Find the net displacement vector from start to finish.
* **Calculation:**
  $$\vec{d}_{\text{total}} = \vec{d}_1 + \vec{d}_2 + \vec{d}_3$$
  $$d_{\text{total}, x} = 4 + 2 + (-3) = 6 - 3 = 3\text{ km}$$
  $$d_{\text{total}, y} = 1 + 5 + 2 = 8\text{ km}$$
  $$\vec{d}_{\text{total}} = \begin{bmatrix} 3 \\ 8 \end{bmatrix}\text{ km}$$
* **Direct Distance:** $\|\vec{d}_{\text{total}}\| = \sqrt{3^2 + 8^2} = \sqrt{9 + 64} = \sqrt{73} \approx 8.544\text{ km}$.

---

### Example 6: Three Force Equilibrium (The Hanging Traffic Light)
* **Problem:** A traffic light weighing $400\text{ N}$ is suspended in equilibrium over a street. The gravitational force pulling straight down is $\vec{W} = (0, -400)\text{ N}$. Cable 1 pulls with force $\vec{T}_1 = (-250, 200)\text{ N}$. What force vector $\vec{T}_2$ must Cable 2 exert to keep the light completely stationary?
* **Condition of Equilibrium:**
  $$\sum \vec{F} = \vec{T}_1 + \vec{T}_2 + \vec{W} = \vec{0}$$
* **Component-Wise System:**
  $$T_{1x} + T_{2x} + W_x = 0 \implies -250 + T_{2x} + 0 = 0 \implies T_{2x} = +250\text{ N}$$
  $$T_{1y} + T_{2y} + W_y = 0 \implies 200 + T_{2y} - 400 = 0 \implies T_{2y} - 200 = 0 \implies T_{2y} = +200\text{ N}$$
* **Result:** Cable 2 must exert $\vec{T}_2 = \begin{bmatrix} 250 \\ 200 \end{bmatrix}\text{ N}$.
* **Check:** $(-250, 200) + (250, 200) + (0, -400) = (0, 0)$. Equilibrium verified!

---

### Example 7: Symmetric Tugboat Hull Pull
* **Problem:** Two identical tugboats pull a barge. Tugboat 1 pulls with $\vec{F}_1 = (8000, 3000)\text{ N}$. Tugboat 2 pulls with $\vec{F}_2 = (8000, -3000)\text{ N}$. Find the resultant force.
* **Calculation:**
  $$\vec{F}_{\text{net}} = \begin{bmatrix} 8000 + 8000 \\ 3000 + (-3000) \end{bmatrix} = \begin{bmatrix} 16000 \\ 0 \end{bmatrix}\text{ N}$$
* **Notice:** The vertical forces $+3000\text{ N}$ and $-3000\text{ N}$ completely cancel each other out! The barge does not drift sideways at all; all $16,000\text{ N}$ of thrust propels the barge straight forward.

---

### Example 8: Commutativity Demonstration
* **Problem:** Prove numerically that $\vec{u} + \vec{v} = \vec{v} + \vec{u}$ for $\vec{u} = (-14, 28)$ and $\vec{v} = (35, -12)$.
* **Order 1 ($\vec{u} + \vec{v}$):**
  $$(-14 + 35, 28 + (-12)) = (21, 16)$$
* **Order 2 ($\vec{v} + \vec{u}$):**
  $$(35 + (-14), -12 + 28) = (21, 16)$$
* **Conclusion:** Identical vectors. Addition order is strictly irrelevant.

---

### Example 9: Identity Property with Zero Vector
* **Problem:** Demonstrate that adding the Zero Vector $\vec{0} = (0, 0)$ to $\vec{v} = (-7.4, 19.8)$ leaves the vector completely unchanged.
* **Calculation:**
  $$\vec{v} + \vec{0} = \begin{bmatrix} -7.4 + 0 \\ 19.8 + 0 \end{bmatrix} = \begin{bmatrix} -7.4 \\ 19.8 \end{bmatrix} = \vec{v}$$

---

### Example 10: In-Place Mutation vs. Garbage Collection in Game Loops
* **Problem:** A game physics loop simulates 10,000 particle positions every frame at 60 FPS: $\vec{p}_{\text{new}} = \vec{p} + \vec{v}\cdot\Delta t$.
  Compare creating new vector instances vs mutating in place.
* **Software Analysis:**
  - **Naive Implementation (Allocating New Objects):**
    ```typescript
    // BAD: Allocates 10,000 new objects EVERY FRAME!
    // 60 frames/sec * 10,000 = 600,000 objects per second!
    // Triggers Garbage Collection (GC) pauses -> Severe game stutter!
    function add(u: Vector2D, v: Vector2D): Vector2D {
      return new Vector2D(u.x + v.x, u.y + v.y);
    }
    ```
  - **High-Performance Implementation (In-Place Mutation):**
    ```typescript
    // EXCELLENT: Zero memory allocations in game loop!
    function addInPlace(target: Vector2D, delta: Vector2D): void {
      target.x += delta.x;
      target.y += delta.y;
    }
    ```

---

## 5.8 Debunked Misconceptions & Traps

### Misconception 1: "Adding vectors means adding their angles."
* **The Fatal Trap:** If Vector 1 points at $30^\circ$ and Vector 2 points at $45^\circ$, the sum DOES NOT point at $30^\circ + 45^\circ = 75^\circ$! 
Angles cannot be added directly. You must convert both to Cartesian components $(x, y)$, sum the components, and then calculate the new angle via $\text{atan2}(R_y, R_x)$.

### Misconception 2: "The resultant vector is always longer than the individual vectors."
* **The Reality:** Not true! If you walk 100 meters East and 99 meters West, your resultant displacement is only **1 meter**. Adding vectors can cause cancellation, resulting in a magnitude much smaller than either original vector.

---

## 5.9 Historical Context: Simon Stevin and the Bruges Monument

Who was the first human being to discover the parallelogram of forces?

It was not Isaac Newton, and it was not Galileo. It was the Flemish mathematician, military engineer, and polymath **Simon Stevin** (1548–1620) of Bruges.

In 1586, Stevin published a landmark treatise on statics titled *De Beghinselen der Weeghconst* (*The Elements of the Art of Weighing*). 

On the title page of his book, Stevin printed an enigmatic woodcut engraving of a necklace of lead spheres hanging over an asymmetric double-inclined wooden prism. This thought experiment—known as **Stevin's Wreath** (*Clootcrans*)—showed that the balls cannot move on their own in a perpetual motion machine, proving that forces along inclined planes must balance according to what we now call the **Parallelogram Law of Vectors**.

Stevin was so proud of this mathematical breakthrough that he chose the motto:
> *"Wonder en is gheen wonder"* ("Magic is no magic" — what seems like magic is merely the elegant, knowable laws of nature).

Today, in the historic town square of Bruges, Belgium, a grand bronze statue of Simon Stevin stands tall, holding a scroll inscribed with the geometric diagrams of vector force addition.

---

## 5.10 Chapter 5 Mastery Problem Set

Consolidate your mastery of vector addition with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Add the following pairs of vectors algebraically:
   - (a) $\vec{u} = (4, 9)$ and $\vec{v} = (6, 3)$
   - (b) $\vec{a} = (-8, 12)$ and $\vec{b} = (5, -7)$
   - (c) $\vec{p} = (-15, -20)$ and $\vec{q} = (-5, -10)$
   - (d) $\vec{r} = (14, -6)$ and $\vec{s} = (-14, 6)$

2. **[Tier 1 - Class 6]** A delivery drone starts at base $O(0, 0)$ and executes two flights: $\vec{d}_1 = (12, 5)\text{ km}$, followed by $\vec{d}_2 = (3, 15)\text{ km}$.
   - Find the total displacement vector $\vec{d}_{\text{net}}$.
   - What are the final coordinates of the drone?

3. **[Tier 2 - Class 7]** Three tugboats pull simultaneously on a barge:
   $\vec{F}_1 = (1200, 400)\text{ N}$, $\vec{F}_2 = (800, -600)\text{ N}$, $\vec{F}_3 = (-500, 200)\text{ N}$.
   - Find the net force vector $\vec{F}_{\text{net}}$.
   - Is the net force pulling the barge forward in the $+X$ direction?

4. **[Tier 2 - Class 7]** An airliner is flying due East with airspeed velocity $\vec{v}_{\text{plane}} = (220, 0)\text{ m/s}$. A tailwind blows from the West at $30\text{ m/s}$ while a crosswind blows from the South at $40\text{ m/s}$.
   - Write the total wind velocity vector $\vec{v}_{\text{wind}}$.
   - Calculate the plane's net ground velocity vector $\vec{v}_{\text{ground}}$.
   - Calculate the plane's true ground speed.

5. **[Tier 3 - Class 8]** A student walks around three sides of a rectangular football field:
   - Leg 1: $100\text{ meters}$ East: $\vec{d}_1 = (100, 0)$
   - Leg 2: $60\text{ meters}$ North: $\vec{d}_2 = (0, 60)$
   - Leg 3: $100\text{ meters}$ West: $\vec{d}_3 = (-100, 0)$
   - Calculate the resultant displacement vector $\vec{R} = \vec{d}_1 + \vec{d}_2 + \vec{d}_3$.
   - Calculate the magnitude $\|\vec{R}\|$.
   - What single step would return the student back to the start?

6. **[Tier 3 - Class 8]** Find a vector $\vec{c}$ such that $\vec{a} + \vec{b} + \vec{c} = \vec{0}$, where $\vec{a} = (8, -14)$ and $\vec{b} = (-3, 6)$.

7. **[Tier 4 - High School]** Two forces $\vec{F}_1$ and $\vec{F}_2$ act on a hockey puck.
   $\vec{F}_1 = 20\hat{i}\text{ N}$ and $\vec{F}_2 = 15\hat{j}\text{ N}$.
   - Calculate the resultant force $\vec{F}_{\text{net}}$.
   - If the puck has a mass of $m = 0.5\text{ kg}$, use Newton's second law $\vec{a} = \vec{F}_{\text{net}} / m$ to calculate the acceleration vector $\vec{a}$.
   - Calculate the scalar acceleration magnitude $\|\vec{a}\|$.

8. **[Tier 4 - High School]** A yacht's position is updated every hour. At 1:00 PM, its position is $\vec{p}_0 = (14, 28)\text{ nautical miles}$. It sails for three hours with hourly velocity vectors:
   - Hour 1: $\vec{v}_1 = (8, 4)\text{ nm/h}$
   - Hour 2: $\vec{v}_2 = (6, -2)\text{ nm/h}$
   - Hour 3: $\vec{v}_3 = (-4, -6)\text{ nm/h}$
   - Calculate the yacht's position at 4:00 PM.

9. **[Tier 5 - University / Physics]** Three coplanar tension cables support a massive crane load:
   $\vec{T}_1 = (-40\hat{i} + 60\hat{j})\text{ kN}$
   $\vec{T}_2 = (30\hat{i} + 50\hat{j})\text{ kN}$
   $\vec{T}_3 = (10\hat{i} + 70\hat{j})\text{ kN}$
   - Calculate the total upward vertical supporting force exerted by all three cables combined.
   - What is the total sideways horizontal imbalance force?
   - What maximum weight $W$ (pulling directly downward: $-W\hat{j}$) can this cable configuration support in vertical equilibrium?

10. **[Tier 5 - Computer Graphics]** In a procedural game particle emitter, 4 directional forces act on a floating smoke sprite:
    - Buoyancy: $\vec{F}_{\text{buoyant}} = (0, +12.5)$
    - Gravity: $\vec{F}_{\text{grav}} = (0, -9.8)$
    - Wind gust: $\vec{F}_{\text{wind}} = (+4.2, +1.1)$
    - Air drag: $\vec{F}_{\text{drag}} = (-2.1, -1.8)$
    - Find the net force vector $\vec{F}_{\text{net}}$.
    - Will the smoke plume rise or sink? Explain using the sign of the vertical component.

---

### Step-by-Step Solutions

#### Solution 1:
- (a) $\vec{u} + \vec{v} = (4 + 6, 9 + 3) = (10, 12)$
- (b) $\vec{a} + \vec{b} = (-8 + 5, 12 - 7) = (-3, 5)$
- (c) $\vec{p} + \vec{q} = (-15 - 5, -20 - 10) = (-20, -30)$
- (d) $\vec{r} + \vec{s} = (14 - 14, -6 + 6) = (0, 0) = \vec{0}$

#### Solution 2:
- (a) $\vec{d}_{\text{net}} = (12 + 3, 5 + 15) = (15, 20)\text{ km}$.
- (b) Final coordinates: $(15, 20)$. (Direct distance: $\sqrt{15^2 + 20^2} = 25\text{ km}$).

#### Solution 3:
- Net force:
  $$F_x = 1200 + 800 - 500 = 1500\text{ N}$$
  $$F_y = 400 - 600 + 200 = 0\text{ N}$$
  $$\vec{F}_{\text{net}} = \begin{bmatrix} 1500 \\ 0 \end{bmatrix}\text{ N}$$
- Yes! The barge experiences a pure forward thrust of $1,500\text{ N}$ along $+X$ with zero lateral drift ($F_y = 0$).

#### Solution 4:
- Wind vector: $\vec{v}_{\text{wind}} = (30, 40)\text{ m/s}$ (blowing East and North).
- Ground velocity:
  $$\vec{v}_{\text{ground}} = (220 + 30, 0 + 40) = (250, 40)\text{ m/s}$$
- True ground speed:
  $$\|\vec{v}_{\text{ground}}\| = \sqrt{250^2 + 40^2} = \sqrt{62,500 + 1,600} = \sqrt{64,100} \approx 253.18\text{ m/s}$$

#### Solution 5:
- Resultant displacement:
  $$\vec{R} = (100 + 0 - 100, 0 + 60 + 0) = (0, 60)\text{ meters}$$
- Magnitude: $\|\vec{R}\| = 60\text{ meters}$.
- Return step: $\vec{d}_{\text{return}} = -\vec{R} = (0, -60)$ ($60\text{ meters}$ due South).

#### Solution 6:
- Sum $\vec{a} + \vec{b}$:
  $$\vec{a} + \vec{b} = (8 - 3, -14 + 6) = (5, -8)$$
- Set up equilibrium:
  $$\vec{c} = -(\vec{a} + \vec{b}) = -(5, -8) = (-5, +8)$$

#### Solution 7:
- Resultant force: $\vec{F}_{\text{net}} = 20\hat{i} + 15\hat{j}\text{ N}$.
- Acceleration vector:
  $$\vec{a} = \frac{\vec{F}_{\text{net}}}{m} = \frac{20\hat{i} + 15\hat{j}}{0.5} = 40\hat{i} + 30\hat{j}\text{ m/s}^2$$
- Scalar magnitude:
  $$\|\vec{a}\| = \sqrt{40^2 + 30^2} = \sqrt{1600 + 900} = \sqrt{2500} = 50\text{ m/s}^2$$

#### Solution 8:
- Sum the three hourly displacements:
  $$\vec{d}_{\text{total}} = (8 + 6 - 4, 4 - 2 - 6) = (10, -4)\text{ nm}$$
- Final position:
  $$\vec{p}_{\text{final}} = \vec{p}_0 + \vec{d}_{\text{total}} = (14 + 10, 28 - 4) = (24, 24)\text{ nautical miles}$$

#### Solution 9:
- Horizontal sum:
  $$\sum F_x = -40 + 30 + 10 = 0\text{ kN}$$
  The sideways imbalance is **exactly $0\text{ kN}$** (perfect lateral balance).
- Vertical sum:
  $$\sum F_y = 60 + 50 + 70 = 180\text{ kN}$$
- Maximum weight in equilibrium:
  $$W = 180\text{ kN} = 180,000\text{ Newtons}$$

#### Solution 10:
- Sum components:
  $$F_x = 0 + 0 + 4.2 - 2.1 = +2.1$$
  $$F_y = 12.5 - 9.8 + 1.1 - 1.8 = +2.0$$
  $$\vec{F}_{\text{net}} = (+2.1, +2.0)$$
- Because $F_y = +2.0 > 0$, the net vertical force is upward. The smoke plume will **rise** and drift to the right.
