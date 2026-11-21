# CHAPTER 2: The Grid World — Descartes, The Fly, and The Birth of Coordinates

---

## 2.1 The Historical Genesis: A Sick Man and a Crawling Fly

In the winter of 1637, in a small, drafty room in Western Europe, a frail thirty-four-year-old French soldier, philosopher, and mathematician lay resting in bed. His name was **René Descartes** (1596–1650).

Because of poor health in childhood, Descartes had been granted special permission by his Jesuit schoolmasters to remain in bed until late morning each day. Far from being lazy, he spent these quiet morning hours thinking deeply about the universe.

On this particular morning, as he stared upward at the ceiling of his bedroom, he noticed a solitary black housefly crawling lazily across the whitewashed ceiling tiles.

```
       Ceiling Corner (Origin: 0, 0)
       ┌────────────────────────────────────────────────────────┐
       │                                                        │
       │                                                        │
       │                   y units away                         │
       │                   ▲                                    │
       │                   │                                    │
       │          ─────────┼──────────● The Fly (x, y)          │
       │                   │          │                         │
       │                              │                         │
       │                              │ x units away            │
       │                              ▼                         │
       └────────────────────────────────────────────────────────┘
       FIGURE 2.1: Descartes' bedroom ceiling.
       Two orthogonal distances completely pin down any point in space.
```

Descartes asked himself a deceptively simple question:

> *"If I wanted to tell a friend the exact, unambiguous location of that crawling fly at this very second, without pointing my finger, what is the minimum information I need?"*

He realized something that revolutionized human civilization forever:
1. If he measured the fly's perpendicular distance from the **West wall** (let us call this distance $x$).
2. And if he measured the fly's perpendicular distance from the **South wall** (let us call this distance $y$).
3. Then **just two numbers $(x, y)$** could pinpoint the fly anywhere on the ceiling with millimeter accuracy!

Before Descartes, mathematics was split into two completely separate islands:
- **Arithmetic and Algebra:** The study of numbers and equations ($x^2 + 5x = 6$).
- **Euclidean Geometry:** The study of physical shapes, triangles, and circles drawn with a compass and ruler.

For two thousand years, no one knew how to connect them. Descartes' ceiling fly built the bridge. He showed that **every geometric shape is an algebraic equation**, and **every algebraic equation is a geometric shape**. 

In his honour, we call this two-dimensional grid the **Cartesian Coordinate Plane**.

---

## 2.2 Constructing the Cartesian Plane: The Two Independent Axes

To understand how vectors live in 2D space, we must construct Descartes' plane from absolute scratch.

### Step 1: The 1D Number Line (One Degree of Freedom)
Start with a single straight line stretching horizontally to infinity in both directions. Mark a central home point and label it **Zero ($0$)**. We call this the **Origin**.
- Take steps to the right: $+1, +2, +3, +4 \dots$ (The positive horizontal direction).
- Take steps to the left: $-1, -2, -3, -4 \dots$ (The negative horizontal direction).

```
<────────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────────>
        -5   -4   -3   -2   -1    0   +1   +2   +3   +4   +5
                               Origin
```

On this 1D line, an ant has only **one degree of freedom**: it can move forward or backward. If the ant is at position $x = +3$, it cannot dodge a spider at $x = +4$ without bumping into it. It is trapped in a 1D corridor.

### Step 2: The Perpendicular Crossing ($90^\circ$ Orthogonality)
Now, take a second, identical number line and rotate it by exactly $90^\circ$ (a right angle). Lay it directly across the first line so their zeroes overlap.
- We call the horizontal number line the **$X$-Axis** (the *Abscissa*).
- We call the vertical number line the **$Y$-Axis** (the *Ordinate*).

```
                             Y-Axis
                               ^
                               | +5
                               |
                               | +4
             Quadrant II       |       Quadrant I
             (-x, +y)          | +3    (+x, +y)
                               |
                               | +2
                               |
                               | +1
                               |
     <───┼───┼───┼───┼───┼─────O─────┼───┼───┼───┼───┼───> X-Axis
        -5  -4  -3  -2  -1     |    +1  +2  +3  +4  +5
                               | Origin (0, 0)
                               | -1
                               |
                               | -2
             Quadrant III      |       Quadrant IV
             (-x, -y)          | -3    (+x, -y)
                               |
                               | -4
                               |
                               | -5
                               v
```

### The Four Quadrants
Crossing the axes divides the infinite 2D plane into four distinct regions, numbered counter-clockwise:
1. **Quadrant I (Top-Right):** Both coordinates are positive ($x > 0, y > 0$). Example: $(+3, +4)$.
2. **Quadrant II (Top-Left):** Horizontal is negative, vertical is positive ($x < 0, y > 0$). Example: $(-5, +2)$.
3. **Quadrant III (Bottom-Left):** Both coordinates are negative ($x < 0, y < 0$). Example: $(-4, -6)$.
4. **Quadrant IV (Bottom-Right):** Horizontal is positive, vertical is negative ($x > 0, y < 0$). Example: $(+7, -3)$.

### Why $90^\circ$? The Power of Independence (Orthogonality)
Why did Descartes cross the axes at $90^\circ$ instead of $45^\circ$ or $60^\circ$?

Because at $90^\circ$, the two axes are **Orthogonal** (completely independent).
- If you walk strictly along the $X$-axis from $(0, 0)$ to $(5, 0)$, your $Y$-coordinate does not change by a single millimeter. It remains identically zero.
- Horizontal motion has **zero effect** on vertical position.
- Vertical motion has **zero effect** on horizontal position.

This independence is the secret that allows physicists to solve complex multi-dimensional problems by splitting them into simple 1D components!

---

## 2.3 The Profound Philosophical Distinction: Points vs. Vectors

Now we arrive at the most common, insidious stumbling block in all of computer graphics, physics simulation, and robotics: **The confusion between a Point and a Vector.**

Both a point and a vector are written as an ordered pair of numbers, like $(3, 4)$. Because they look identical on paper, many students assume they are the same thing. 

**THEY ARE NOT THE SAME THING.**

```
┌────────────────────────────────────────────────────────────────────────┐
│                          POINT VS. VECTOR                              │
├──────────────────────────────────┬─────────────────────────────────────┤
│             POINT                │               VECTOR                │
├──────────────────────────────────┼─────────────────────────────────────┤
│ A static LOCATION in space.      │ An active DISPLACEMENT or ACTION.   │
│ Answers: "Where are you?"        │ Answers: "How did you move?"        │
│ Fixed to the Origin.             │ Free to float anywhere.             │
│ Grammatical Role: NOUN.          │ Grammatical Role: VERB.             │
│ Absolute coordinates.            │ Relative difference.                │
│ Cannot be added together!        │ Can be freely added together!       │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### The "Adding Points" Fallacy
Consider this thought experiment:
- Point $A$ is the city of **Paris** (Coordinates: $48.85^\circ\text{ N}, 2.35^\circ\text{ E}$).
- Point $B$ is the city of **Tokyo** (Coordinates: $35.67^\circ\text{ N}, 139.65^\circ\text{ E}$).

What happens if you "add" Paris to Tokyo?
$$\text{Paris} + \text{Tokyo} = (48.85 + 35.67, 2.35 + 139.65) = (84.52^\circ\text{ N}, 142.00^\circ\text{ E})$$
You get a spot in the frozen Arctic Ocean near the North Pole. 

Does adding the city of Paris to the city of Tokyo make any physical sense? **None whatsoever!** Adding two locations is completely nonsensical.

### But You CAN Subtract Points to Get a Vector!
Now, what happens if you subtract Paris from Tokyo?
$$\text{Tokyo} - \text{Paris} = (35.67 - 48.85, 139.65 - 2.35) = (-13.18^\circ, +137.30^\circ)$$
This is **NOT a location**. It is a **Vector**! 
It tells an airplane pilot: *"To fly from Paris to Tokyo, travel $13.18^\circ$ South and $137.30^\circ$ East."*

$$\text{Point} - \text{Point} = \text{Vector}$$
$$\text{Point} + \text{Vector} = \text{New Point}$$
$$\text{Point} + \text{Point} = \text{Mathematical Nonsense!}$$

---

## 2.4 Socratic Dialogue: Alice and The Vectorist on Floating Arrows

> **Alice:** "Hold on. If a vector isn't a fixed point, where does it live on the grid?"
>
> **The Vectorist:** "A vector lives wherever it is useful! Imagine an arrow on the floor pointing East with a length of 2 meters. If you pick that arrow up and carry it to the other side of the room without rotating it, is it still pointing East? Does it still have a length of 2 meters?"
>
> **Alice:** "Yes, of course."
>
> **The Vectorist:** "Then it is the exact same vector! A vector has no fixed tail. It is a **Free Vector**. It describes the *relationship* between its start and its end, not where it sits on the grid."
>
> **Alice:** "So if I walk 3 steps East and 4 steps North in my bedroom, and an astronaut walks 3 steps East and 4 steps North on the Moon, we both executed the exact same displacement vector $\vec{v} = (3, 4)$?"
>
> **The Vectorist:** "Brilliant! You've got it. Your starting points were thousands of kilometers apart, but your vector displacements were identical."

---

## 2.5 Ten Concrete Worked Numerical Examples: Coordinates & Grids

---

### Example 1: Quadrant Identification
* **Problem:** Identify the quadrant (I, II, III, or IV) or axis for each of the following points:
  $A(4, 7)$, $B(-3, 8)$, $C(-6, -2)$, $D(5, -9)$, $E(0, -4)$, $F(8, 0)$.
* **Step-by-Step Solution:**
  1. $A(4, 7)$: $x > 0$ and $y > 0 \implies$ **Quadrant I**.
  2. $B(-3, 8)$: $x < 0$ and $y > 0 \implies$ **Quadrant II**.
  3. $C(-6, -2)$: $x < 0$ and $y < 0 \implies$ **Quadrant III**.
  4. $D(5, -9)$: $x > 0$ and $y < 0 \implies$ **Quadrant IV**.
  5. $E(0, -4)$: $x = 0 \implies$ Located directly on the **Negative $Y$-Axis** (between Quadrants III and IV).
  6. $F(8, 0)$: $y = 0 \implies$ Located directly on the **Positive $X$-Axis** (between Quadrants I and IV).

---

### Example 2: Displacement Vector Between Two Points
* **Problem:** A robotic vacuum cleaner starts at dock station $A(2, 5)$ and moves in a straight line to under-couch location $B(8, 13)$. Find the displacement vector $\vec{d} = \vec{AB}$.
* **Formula:**
  $$\vec{d} = \begin{bmatrix} x_B - x_A \\ y_B - y_A \end{bmatrix}$$
* **Calculation:**
  $$\Delta x = 8 - 2 = +6$$
  $$\Delta y = 13 - 5 = +8$$
  $$\vec{d} = (6, 8)\text{ or }\begin{bmatrix} 6 \\ 8 \end{bmatrix}$$
* **Interpretation:** The robot must step 6 units East and 8 units North.

---

### Example 3: Negative Displacements
* **Problem:** A submarine starts at patrol waypoint $P(15, -4)$ and moves to emergency rendezvous point $Q(-5, -20)$. Find the vector $\vec{PQ}$.
* **Calculation:**
  $$\Delta x = x_Q - x_P = -5 - 15 = -20$$
  $$\Delta y = y_Q - y_P = -20 - (-4) = -20 + 4 = -16$$
  $$\vec{PQ} = \begin{bmatrix} -20 \\ -16 \end{bmatrix}$$
* **Interpretation:** The submarine traveled 20 units West and 16 units South.

---

### Example 4: Applying a Vector to a Point (Translation)
* **Problem:** In a video game, a player character is standing at coordinate $P(45, 110)$. The player presses the controller joystick, triggering a displacement vector $\vec{v} = (-12, +25)$. What is the player's new position $P'$?
* **Formula:**
  $$P' = P + \vec{v} = (x_P + v_x, y_P + v_y)$$
* **Calculation:**
  $$x' = 45 + (-12) = 33$$
  $$y' = 110 + 25 = 135$$
  $$P' = (33, 135)$$
* **Sanity Check:** The player shifted left (from 45 to 33) and jumped up (from 110 to 135).

---

### Example 5: Manhattan Distance vs. Euclidean Displacement
* **Problem:** A taxi in Midtown Manhattan picks up a passenger at 5th Avenue and 34th Street $(5, 34)$ and drops them off at 8th Avenue and 42nd Street $(8, 42)$. 
  - Find the displacement vector.
  - Find the Manhattan driving distance (grid distance).
* **Calculation:**
  - Displacement Vector:
    $$\vec{d} = (8 - 5, 42 - 34) = (3, 8)\text{ blocks}$$
  - Manhattan Distance:
    $$D_{\text{Manhattan}} = |\Delta x| + |\Delta y| = |3| + |8| = 11\text{ blocks}$$
  - (The taxi had to drive 3 avenues West and 8 streets North: 11 blocks total).

---

### Example 6: The Return Vector (Vector Inversion)
* **Problem:** An autonomous surveyor drone starts at base $O(0, 0)$ and flies along vector $\vec{v}_1 = (35, -50)\text{ meters}$. What vector $\vec{v}_{\text{return}}$ must the flight computer execute to return directly to the base in one flight?
* **Calculation:**
  - Current location is $P(35, -50)$.
  - Destination is $O(0, 0)$.
  $$\vec{v}_{\text{return}} = \vec{PO} = \begin{bmatrix} 0 - 35 \\ 0 - (-50) \end{bmatrix} = \begin{bmatrix} -35 \\ +50 \end{bmatrix}$$
* **Law:** The return vector is always the exact negative of the outbound vector: $\vec{v}_{\text{return}} = -\vec{v}_{\text{outbound}}$.

---

### Example 7: Midpoint of Two Locations (Using Vectors)
* **Problem:** Two friends agree to meet halfway between their homes located at $A(-10, 4)$ and $B(6, 16)$. Use vectors to find their meeting point $M$.
* **Step-by-Step Derivation:**
  1. Find the vector from $A$ to $B$:
     $$\vec{AB} = (6 - (-10), 16 - 4) = (16, 12)$$
  2. Half of this journey is:
     $$\frac{1}{2} \vec{AB} = \left(\frac{16}{2}, \frac{12}{2}\right) = (8, 6)$$
  3. Start at $A$ and add the half-vector:
     $$M = A + \frac{1}{2} \vec{AB} = (-10 + 8, 4 + 6) = (-2, 10)$$
* **Verification:** Standard midpoint formula:
  $$M = \left(\frac{-10 + 6}{2}, \frac{4 + 16}{2}\right) = \left(\frac{-4}{2}, \frac{20}{2}\right) = (-2, 10)$$
  Both methods produce the exact same point!

---

### Example 8: Checking if Three Points are Collinear
* **Problem:** Determine whether the points $A(1, 2)$, $B(4, 8)$, and $C(7, 14)$ lie on the exact same straight line using displacement vectors.
* **Calculation:**
  - Vector $\vec{AB} = (4 - 1, 8 - 2) = (3, 6)$.
  - Vector $\vec{BC} = (7 - 4, 14 - 8) = (3, 6)$.
* **Conclusion:** Because the displacement vector from $A$ to $B$ is identical in slope and direction to the vector from $B$ to $C$ (both step $+3$ in $X$ for every $+6$ in $Y$), the points $A$, $B$, and $C$ are **strictly collinear**.

---

### Example 9: Reflecting a Point Across an Axis
* **Problem:** A laser beam strikes a mirror placed along the $X$-axis. A light source is located at $S(5, 8)$. Where is the reflected virtual image point $S'$?
* **Analysis:**
  - Reflecting across the horizontal $X$-axis leaves the horizontal coordinate unchanged ($x' = x$), while flipping the sign of the vertical coordinate ($y' = -y$).
  - Reflected Point: $S'(5, -8)$.

---

### Example 10: Screen Coordinates vs. Cartesian Coordinates (Game Dev Trap)
* **Problem:** In computer graphics (e.g. HTML5 Canvas, SVG, Pygame), the Origin $(0, 0)$ is at the **Top-Left** of the window, and the $Y$-axis points **DOWNWARD**.
  If a game character is at screen coordinate $(200, 150)$ and moves with physical Cartesian velocity $\vec{v} = (+50\text{ East}, +30\text{ North})$, what is the character's new screen coordinate?
* **Calculation:**
  - In screen coordinates, "North" (Up) means **decreasing $Y$**.
  - $x_{\text{screen}} = 200 + 50 = 250$.
  - $y_{\text{screen}} = 150 - 30 = 120$.
* **Crucial Rule:** In game engines, whenever you convert mathematical physics $(x, y)$ to screen rendering, you must negate the vertical axis:
  $$y_{\text{screen}} = y_{\text{origin}} - y_{\text{world}}$$

---

## 2.6 Debunked Misconceptions & Software Traps

### Misconception 1: "A vector $(3, 4)$ must start at the origin $(0, 0)$."
* **The Reality:** When a vector starts at the origin $(0, 0)$ and ends at point $P(3, 4)$, we call it the **Position Vector** of point $P$ (written $\vec{r}_P$). But that same vector $(3, 4)$ can start at $(10, 20)$ and end at $(13, 24)$. A vector is the journey, not the street address.

### Misconception 2: "The coordinates of a vector depend on your units."
* **The Reality:** A vector $(3, 4)$ with no units is pure mathematics. In physics, a vector MUST carry units: $(3\text{ m}, 4\text{ m})$ is a displacement; $(3\text{ m/s}, 4\text{ m/s})$ is a velocity; $(3\text{ N}, 4\text{ N})$ is a force. You can never add a displacement vector to a force vector.

### Software Trap: Floating-Point Epsilon Drift
In mathematical theory, $0.1 + 0.2 = 0.3$.
In a computer game engine using 64-bit IEEE-754 floats:
`0.1 + 0.2 === 0.30000000000000004`!
If you write collision code like:
`if (player.x === wall.x)` $\to$ **Your game will crash or player will fall through the floor!**
Always check proximity using an epsilon tolerance:
`Math.abs(player.x - wall.x) < 1e-6`.

---

## 2.7 Historical Context: Nicole Oresme & Descartes' Method

While René Descartes is rightfully celebrated for Cartesian coordinates, he was standing on the shoulders of an earlier medieval genius: the French bishop and philosopher **Nicole Oresme** (1320–1382).

Almost three hundred years before Descartes, Oresme wrote a treatise titled *De configurationibus qualitatum et motuum* (*On the Configuration of Qualities and Motions*). Oresme was the first human being to draw a graph with time along the horizontal base and speed along the vertical height. He showed that the geometric area under this speed-time line represented the total distance traveled—the foundational idea that Isaac Newton later turned into Integral Calculus!

Descartes took this graph paper concept and formalized it in his 1637 masterpiece *Discourse on the Method*. In the appendix titled *La Géométrie*, Descartes solved ancient geometric problems that had stumped Greek mathematicians for 2,000 years in just four lines of algebra.

---

## 2.8 Chapter 2 Mastery Problem Set

Consolidate your mastery of Cartesian grids and points vs. vectors with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Plot the following five points on mental graph paper and state which quadrant each lies in:
   $P_1(2, 6)$, $P_2(-4, 5)$, $P_3(-7, -3)$, $P_4(6, -8)$, $P_5(0, 0)$.

2. **[Tier 1 - Class 6]** A delivery truck starts at warehouse $W(3, 2)$ and drives to customer $C(9, 7)$.
   - Calculate the displacement vector $\vec{d}$.
   - How many blocks East and how many blocks North did the truck drive?

3. **[Tier 2 - Class 7]** A chess piece (a Knight) is sitting at board coordinate $(2, 1)$. It makes a standard "L-shaped" jump with vector $\vec{v} = (+1, +2)$.
   - What are the Knight's new board coordinates?
   - If the Knight then jumps with vector $\vec{w} = (+2, -1)$, where does it land?

4. **[Tier 2 - Class 7]** A player in an online multiplayer game is at coordinates $A(100, 250)$. An enemy spawns at coordinates $B(40, 310)$.
   - Find the targeting vector pointing from the player toward the enemy ($\vec{AB}$).
   - Find the escape vector pointing from the enemy away from the player ($\vec{BA}$).

5. **[Tier 3 - Class 8]** An airplane takes off from airfield $A(10, 10)$ and lands at airfield $B(70, 90)$.
   - Write the flight displacement vector $\vec{AB}$.
   - Find the coordinates of the midpoint $M$ where the flight crew serves refreshments.

6. **[Tier 3 - Class 8]** You are designing a 2D platformer game. The screen width is 800 pixels and screen height is 600 pixels.
   - What is the screen coordinate of the exact center of the screen?
   - If an explosion occurs at screen center $(400, 300)$ and throws shrapnel with vector $\Delta\vec{s} = (+150, -80)$, what is the shrapnel's final screen coordinate? (Remember: screen $Y$ points downward).

7. **[Tier 4 - High School]** A surveyor sets up a theodolite at origin $O(0, 0)$. She marks three property boundary corners: $A(2, 3)$, $B(8, 11)$, and $C(14, 19)$.
   - Compute vector $\vec{AB}$ and vector $\vec{BC}$.
   - Prove whether the boundary fence from $A$ through $B$ to $C$ is a single straight line.

8. **[Tier 4 - High School]** A soccer ball is kicked from $P_0(10, 5)$. It undergoes three successive kicks:
   - Kick 1: $\vec{d}_1 = (15, 20)$
   - Kick 2: $\vec{d}_2 = (-8, 12)$
   - Kick 3: $\vec{d}_3 = (-7, -37)$
   - What are the ball's final coordinates? Where did the ball end up relative to its starting point?

9. **[Tier 5 - University / Game Dev]** A 2D game engine uses a virtual camera. The camera's center is at world position $C(1200, 850)$. The screen viewport has dimensions $1920 \times 1080$ pixels.
   - If an in-game tree is planted at world position $T(1400, 900)$, derive the camera transformation equation to convert world position $T$ into screen pixel coordinates $(x_{\text{screen}}, y_{\text{screen}})$.
   - What are the tree's final screen coordinates?

10. **[Tier 5 - Robotics]** An industrial robotic pick-and-place arm is anchored at base $O(0, 0)$. The arm needs to pick up a semiconductor wafer at $W_1(-12.4, 18.6)\text{ cm}$ and transfer it to inspection station $W_2(35.2, -4.8)\text{ cm}$.
    - Write the transfer displacement vector $\vec{W_1 W_2}$.
    - If the transfer must be completed in $t = 0.5\text{ seconds}$ at a uniform velocity, calculate the required velocity vector $\vec{v}$.

---

### Step-by-Step Solutions

#### Solution 1:
- $P_1(2, 6) \implies (+, +) \implies$ **Quadrant I**.
- $P_2(-4, 5) \implies (-, +) \implies$ **Quadrant II**.
- $P_3(-7, -3) \implies (-, -) \implies$ **Quadrant III**.
- $P_4(6, -8) \implies (+, -) \implies$ **Quadrant IV**.
- $P_5(0, 0) \implies$ **The Origin** (lies on both axes).

#### Solution 2:
- Displacement vector $\vec{d} = (x_C - x_W, y_C - y_W)$:
  $$\vec{d} = (9 - 3, 7 - 2) = (6, 5)$$
- The truck drove 6 blocks East and 5 blocks North.

#### Solution 3:
- First jump:
  $$P_1 = (2 + 1, 1 + 2) = (3, 3)$$
- Second jump:
  $$P_2 = (3 + 2, 3 + (-1)) = (5, 2)$$
- The Knight lands at coordinate $(5, 2)$.

#### Solution 4:
- Targeting vector $\vec{AB} = B - A$:
  $$\vec{AB} = (40 - 100, 310 - 250) = (-60, +60)$$
- Escape vector $\vec{BA} = A - B$:
  $$\vec{BA} = (100 - 40, 250 - 310) = (+60, -60)$$
- Notice that $\vec{BA} = -\vec{AB}$.

#### Solution 5:
- Flight vector:
  $$\vec{AB} = (70 - 10, 90 - 10) = (60, 80)$$
- Midpoint $M$:
  $$M = A + \frac{1}{2}\vec{AB} = (10 + 30, 10 + 40) = (40, 50)$$

#### Solution 6:
- Screen center: $(800 / 2, 600 / 2) = (400, 300)$.
- Shrapnel position:
  $$x = 400 + 150 = 550$$
  $$y = 300 + (-80) = 220$$
- Shrapnel screen coordinates: $(550, 220)$.

#### Solution 7:
- $\vec{AB} = (8 - 2, 11 - 3) = (6, 8)$.
- $\vec{BC} = (14 - 8, 19 - 11) = (6, 8)$.
- Both vectors have identical components $(6, 8)$, meaning their direction and slope are identical ($8/6 = 4/3$). Thus, the boundary is a single straight line.

#### Solution 8:
- Final coordinates:
  $$X = 10 + 15 - 8 - 7 = 10$$
  $$Y = 5 + 20 + 12 - 37 = 0$$
- The ball ended up at $P_{\text{final}}(10, 0)$.
- Relative to the starting point $(10, 5)$, the net displacement is $(10 - 10, 0 - 5) = (0, -5)$, which is exactly 5 units due South.

#### Solution 9:
- World center to screen conversion:
  $$\Delta x = x_{\text{world}} - x_{\text{cam}} = 1400 - 1200 = +200$$
  $$\Delta y = y_{\text{world}} - y_{\text{cam}} = 900 - 850 = +50$$
- Screen center is at $(1920/2, 1080/2) = (960, 540)$.
- In screen coordinates (with screen $Y$ pointing down):
  $$x_{\text{screen}} = 960 + \Delta x = 960 + 200 = 1160$$
  $$y_{\text{screen}} = 540 - \Delta y = 540 - 50 = 490$$
- The tree renders at pixel $(1160, 490)$.

#### Solution 10:
- Transfer displacement:
  $$\Delta x = 35.2 - (-12.4) = 35.2 + 12.4 = 47.6\text{ cm}$$
  $$\Delta y = -4.8 - 18.6 = -23.4\text{ cm}$$
  $$\vec{W_1 W_2} = (47.6, -23.4)\text{ cm}$$
- Required velocity vector ($\vec{v} = \Delta\vec{r} / \Delta t$):
  $$\vec{v} = \left(\frac{47.6\text{ cm}}{0.5\text{ s}}, \frac{-23.4\text{ cm}}{0.5\text{ s}}\right) = (95.2, -46.8)\text{ cm/s}$$
