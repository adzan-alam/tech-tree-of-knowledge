# CHAPTER 3: The Anatomy of an Arrow — Components, Basis Vectors, and Notation

---

## 3.1 The Anatomy of an Arrow: Tail, Tip, and Free Displacement

Now that we understand the Cartesian coordinate plane, let us look closely at the physical arrow itself.

Every 2D vector drawn on paper has four anatomical features:

```
                           Tip (Terminal Point)
                                  ● (x_tip, y_tip)
                                 /│
                                / │
                               /  │
                              /   │
               Arrow Body    /    │ Vertical Component
               (Magnitude)  /     │ Δy = y_tip - y_tail
                           /      │
                          /       │
                         /        │
                        ●─────────┘
              Tail (Initial Point)   Horizontal Component
              (x_tail, y_tail)       Δx = x_tip - x_tail
```

1. **The Tail (Initial Point):** Where the journey or force originates.
2. **The Tip (Terminal Point / Arrowhead):** Where the arrow points, indicating the sense of direction.
3. **The Magnitude (Length):** The straight-line Euclidean distance from the tail to the tip.
4. **The Orientation (Angle $\theta$):** The angle the arrow makes relative to the positive horizontal axis.

### The Great Law of Free Vectors
In Euclidean geometry and classical physics, standard vectors are **Free Vectors**. 

A free vector does not care where its tail is anchored. If you slide an arrow across your desk without changing its length and without rotating it, **it remains the exact same vector**.

Why? Because a vector represents an **interval of displacement**, an **impulse of force**, or a **state of velocity**. 
- If a wind blows at $30\text{ km/h East}$, it is blowing East over your house, over the park, and over the school. The wind velocity vector is identical everywhere in that weather zone.

---

## 3.2 Mathematical Notations: Speaking the Language of Science

In the mathematical and engineering literature, you will see vectors written in several different styles. It is vital to understand them all so you never feel intimidated by a textbook or paper.

### 1. Symbolic Notation
- **Arrow Notation:** $\vec{v}$ (Common in high school, physics, and handwritten notes).
- **Boldface Notation:** $\mathbf{v}$ (Standard in university textbooks and peer-reviewed journals).
- **Underbar Notation:** $\underline{v}$ (Common in engineering chalkboard lectures where bolding is impossible).

### 2. Component Notations
A 2D vector is defined by its horizontal projection $v_x$ and its vertical projection $v_y$:

- **Ordered Pair Notation:**
  $$\vec{v} = (v_x, v_y)$$
  *Example:* $\vec{v} = (3, 4)$. Simple and compact, but easily confused with a static point.

- **Angle Bracket Notation:**
  $$\vec{v} = \langle v_x, v_y \rangle$$
  *Example:* $\vec{v} = \langle 3, 4 \rangle$. Preferred by American calculus textbooks to distinguish vectors from points.

- **Column Matrix Notation (The Linear Algebra Standard):**
  $$\vec{v} = \begin{bmatrix} v_x \\ v_y \end{bmatrix}$$
  *Example:* $\vec{v} = \begin{bmatrix} 3 \\ 4 \end{bmatrix}$. This is the sovereign standard used in computer graphics, robotics, game engines, and machine learning. 

Why do we prefer column matrices over row pairs? Because when you rotate, scale, or transform a vector in software, you multiply it by a $2 \times 2$ transformation matrix $M$ from the left:

$$\vec{v}' = M \vec{v} = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} a v_x + b v_y \\ c v_x + d v_y \end{bmatrix}$$

---

## 3.3 The Basis Vectors $\hat{i}$ and $\hat{j}$: The Atomic Building Blocks

In chemistry, every complex molecule—from water ($H_2 O$) to DNA—is built from fundamental atomic elements like Hydrogen, Carbon, and Oxygen.

In 2D linear algebra, **every vector in existence** is built from just two atomic building blocks called the **Standard Cartesian Basis Vectors**:

```
                       Y ^
                         │
                         │
                     1.0 ┼     ● j-hat = (0, 1)
                         │     │
                         │     │ (1 unit North)
                         │     │
     ────────────────────┼─────┴──────┼─────> X
                        0│           1.0
                         │      i-hat = (1, 0)
                         │      (1 unit East)
                         │
```

### The Hat Symbol ($\hat{}$)
Whenever you see a small "caret" or "roof" over a letter ($\hat{u}$), say **"u-hat"**. 
The hat is the universal scientific symbol for a **Unit Vector**—a vector whose length is strictly equal to $1.0$.

### Defining the Two Atoms of 2D Space
1. **$\hat{i}$ ("i-hat"):** The unit step along the horizontal $X$-axis:
   $$\hat{i} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
2. **$\hat{j}$ ("j-hat"):** The unit step along the vertical $Y$-axis:
   $$\hat{j} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

---

## 3.4 The Linear Combination: Decomposing Any Vector

Now observe the sheer mathematical beauty of basis vectors. 

Take any arbitrary vector, say $\vec{v} = \begin{bmatrix} 5 \\ -3 \end{bmatrix}$. 

Using standard matrix arithmetic, we can break this vector apart:

$$\vec{v} = \begin{bmatrix} 5 \\ -3 \end{bmatrix} = \begin{bmatrix} 5 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ -3 \end{bmatrix}$$

Now factor out the scalar magnitudes:

$$\vec{v} = 5 \begin{bmatrix} 1 \\ 0 \end{bmatrix} + (-3) \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

Substitute our basis definitions $\hat{i}$ and $\hat{j}$:

$$\vec{v} = 5\hat{i} - 3\hat{j}$$

This is called a **Linear Combination**. 

It tells us: *"To build the vector $\vec{v}$, take 5 steps in the $\hat{i}$ direction (East), and take 3 steps in the negative $\hat{j}$ direction (South)."*

Every 2D vector in the universe can be expressed uniquely as:
$$\vec{v} = v_x \hat{i} + v_y \hat{j}$$

---

## 3.5 Socratic Dialogue: Alice and The Vectorist on Components

> **Alice:** "Why do we bother breaking an arrow into $v_x \hat{i} + v_y \hat{j}$? Why not just say: *'The arrow is 10 meters long pointing at $30^\circ$'*?"
>
> **The Vectorist:** "Because, Alice, computer chips cannot easily add angles, but they can add numbers at blinding speeds! Suppose you have two forces acting on a spacecraft:
> - Force 1: $10\text{ N}$ at $30^\circ$.
> - Force 2: $15\text{ N}$ at $110^\circ$.
> How do you add those angles together? You can't just say $10 + 15 = 25$ and $30^\circ + 110^\circ = 140^\circ$. That is completely wrong!"
>
> **Alice:** "Oh! Because the forces are pulling in different directions!"
>
> **The Vectorist:** "Exactly. But if you decompose Force 1 into horizontal and vertical components $(F_{1x}, F_{1y})$, and Force 2 into $(F_{2x}, F_{2y})$, then the total force is simply:
> $$F_{\text{total}, x} = F_{1x} + F_{2x}$$
> $$F_{\text{total}, y} = F_{1y} + F_{2y}$$
> Addition becomes child's play! Components turn complex spatial physics into simple primary-school addition."

---

## 3.6 Ten Concrete Worked Numerical Examples: Components & Notation

---

### Example 1: Writing Vectors in $\hat{i}, \hat{j}$ Form
* **Problem:** Express the following column vectors in standard basis unit vector form ($v_x \hat{i} + v_y \hat{j}$):
  (a) $\vec{a} = \begin{bmatrix} 7 \\ 4 \end{bmatrix}$, 
  (b) $\vec{b} = \begin{bmatrix} -12 \\ 5 \end{bmatrix}$, 
  (c) $\vec{c} = \begin{bmatrix} 0 \\ -9 \end{bmatrix}$, 
  (d) $\vec{d} = \begin{bmatrix} 3.5 \\ 0 \end{bmatrix}$.
* **Solution:**
  - (a) $\vec{a} = 7\hat{i} + 4\hat{j}$
  - (b) $\vec{b} = -12\hat{i} + 5\hat{j}$
  - (c) $\vec{c} = 0\hat{i} - 9\hat{j} = -9\hat{j}$
  - (d) $\vec{d} = 3.5\hat{i} + 0\hat{j} = 3.5\hat{i}$

---

### Example 2: Extracting Components from Basis Notation
* **Problem:** Identify the scalar components $v_x$ and $v_y$ for the following vectors:
  (a) $\vec{u} = -4\hat{i} + 11\hat{j}$,
  (b) $\vec{v} = \hat{i} - \hat{j}$,
  (c) $\vec{w} = 8\hat{j}$,
  (d) $\vec{z} = -15\hat{i}$.
* **Solution:**
  - (a) $u_x = -4$, $u_y = 11$.
  - (b) $v_x = 1$, $v_y = -1$ (remember that an unwritten coefficient is 1!).
  - (c) $w_x = 0$, $w_y = 8$.
  - (d) $z_x = -15$, $z_y = 0$.

---

### Example 3: Finding Displacement Vector from Endpoints
* **Problem:** A laser guided missile launches from silo $S(120, 45)$ and impacts bunker $B(480, 315)$. Calculate the displacement vector $\vec{SB}$ in both column matrix and $\hat{i}, \hat{j}$ format.
* **Calculation:**
  $$\Delta x = x_B - x_S = 480 - 120 = 360\text{ meters}$$
  $$\Delta y = y_B - y_S = 315 - 45 = 270\text{ meters}$$
* **Result:**
  $$\vec{SB} = \begin{bmatrix} 360 \\ 270 \end{bmatrix}\text{ m} = (360\hat{i} + 270\hat{j})\text{ meters}$$

---

### Example 4: Scaling a Basis Vector
* **Problem:** Let $\vec{v} = 4\hat{i} - 3\hat{j}$. Calculate $3\vec{v}$ and $-2\vec{v}$.
* **Calculation:**
  - Multiply every component by the scalar factor:
    $$3\vec{v} = 3(4\hat{i} - 3\hat{j}) = (3 \times 4)\hat{i} - (3 \times 3)\hat{j} = 12\hat{i} - 9\hat{j}$$
    $$-2\vec{v} = -2(4\hat{i} - 3\hat{j}) = (-2 \times 4)\hat{i} - (-2 \times -3)\hat{j} = -8\hat{i} + 6\hat{j}$$
* **Notice:** Multiplying by a negative scalar flips both signs, reversing the vector's direction by $180^\circ$.

---

### Example 5: Adding Vectors Using Basis Components
* **Problem:** Two forces act on a metal bracket: $\vec{F}_1 = (25\hat{i} + 40\hat{j})\text{ N}$ and $\vec{F}_2 = (-15\hat{i} + 10\hat{j})\text{ N}$. Find the resultant force vector $\vec{F}_{\text{net}}$.
* **Calculation:**
  - Group the $\hat{i}$ terms and the $\hat{j}$ terms:
    $$\vec{F}_{\text{net}} = (25 - 15)\hat{i} + (40 + 10)\hat{j}$$
    $$\vec{F}_{\text{net}} = 10\hat{i} + 50\hat{j}\text{ Newtons} = \begin{bmatrix} 10 \\ 50 \end{bmatrix}\text{ N}$$

---

### Example 6: Reconstructing a Final Point from Initial Point & Components
* **Problem:** A naval submarine begins at sonar buoy $A(-50, 120)\text{ km}$. It travels under orders with displacement $\vec{d} = 85\hat{i} - 60\hat{j}\text{ km}$. Where is the submarine now?
* **Calculation:**
  $$x_{\text{final}} = x_{\text{initial}} + d_x = -50 + 85 = +35\text{ km}$$
  $$y_{\text{final}} = y_{\text{initial}} + d_y = 120 + (-60) = +60\text{ km}$$
  Final location: $P_{\text{sub}}(35, 60)\text{ km}$.

---

### Example 7: The Zero Vector $\vec{0}$
* **Problem:** What is the Zero Vector $\vec{0}$ in 2D space? What are its components and what is its direction?
* **Analysis:**
  $$\vec{0} = 0\hat{i} + 0\hat{j} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
  - **Magnitude:** $\|\vec{0}\| = \sqrt{0^2 + 0^2} = 0$.
  - **Direction:** The Zero Vector has **UNDEFINED direction**. It has no tip, no length, and points nowhere. It is the identity element under vector addition: $\vec{v} + \vec{0} = \vec{v}$.

---

### Example 8: Physics Units in Components
* **Problem:** A particle moves with acceleration $\vec{a} = (-9.8\hat{j})\text{ m/s}^2$ and initial velocity $\vec{v}_0 = (14\hat{i} + 20\hat{j})\text{ m/s}$. Find the velocity vector at $t = 2.0\text{ seconds}$ using $\vec{v}(t) = \vec{v}_0 + \vec{a}t$.
* **Calculation:**
  $$\vec{v}(2) = (14\hat{i} + 20\hat{j}) + (-9.8\hat{j})(2)$$
  $$\vec{v}(2) = 14\hat{i} + [20 - (9.8 \times 2)]\hat{j}$$
  $$\vec{v}(2) = 14\hat{i} + (20 - 19.6)\hat{j} = 14\hat{i} + 0.4\hat{j}\text{ m/s}$$
* **Sanity Check:** The horizontal velocity remained unchanged ($14\text{ m/s}$), while gravity slowed the vertical climb from $20\text{ m/s}$ down to $0.4\text{ m/s}$.

---

### Example 9: Linear Combination with Unknown Weights
* **Problem:** Find scalars $c_1$ and $c_2$ such that $c_1 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + c_2 \begin{bmatrix} 1 \\ 3 \end{bmatrix} = \begin{bmatrix} 8 \\ 9 \end{bmatrix}$.
* **Step-by-Step System of Equations:**
  1. Horizontal: $2 c_1 + 1 c_2 = 8 \implies c_2 = 8 - 2 c_1$.
  2. Vertical: $1 c_1 + 3 c_2 = 9$.
  3. Substitute $c_2$ into equation 2:
     $$c_1 + 3(8 - 2 c_1) = 9$$
     $$c_1 + 24 - 6 c_1 = 9$$
     $$-5 c_1 = 9 - 24 = -15 \implies c_1 = 3$$
  4. Solve for $c_2$:
     $$c_2 = 8 - 2(3) = 8 - 6 = 2$$
* **Check:** $3(2, 1) + 2(1, 3) = (6, 3) + (2, 6) = (8, 9)$. Verified!

---

### Example 10: Structuring Vectors in Modern C++/TypeScript Memory
* **Problem:** How does a computer CPU represent a 2D vector in memory?
* **Analysis:**
  In memory, hardware does not store arrows. It stores contiguous IEEE-754 32-bit floats:
  ```typescript
  // Memory Layout: 8 bytes total
  // [Byte 0..3: float32 x] [Byte 4..7: float32 y]
  class Vector2D {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }
  ```
  On a modern GPU, two 32-bit floats occupy a 64-bit vector register (`float2`), enabling hardware instructions to add, subtract, and scale both $x$ and $y$ simultaneously in a single clock cycle!

---

## 3.7 Debunked Misconceptions & Software Traps

### Misconception 1: "The basis vectors $\hat{i}$ and $\hat{j}$ are just numbers."
* **The Reality:** $\hat{i}$ and $\hat{j}$ are full vectors with direction and length! $\hat{i}$ is shorthand for $(1, 0)$ and $\hat{j}$ is shorthand for $(0, 1)$. Writing $5\hat{i}$ means multiplying the vector $(1, 0)$ by the scalar 5.

### Misconception 2: "Components can only be integers."
* **The Reality:** Components are real numbers ($\mathbb{R}$). They can be fractions ($1/3$), negative decimals ($-0.0045$), or irrational constants ($\pi, \sqrt{2}$).

### Software Trap: Array of Structures (AoS) vs. Structure of Arrays (SoA)
When simulating 100,000 particles in a physics engine:
- **AoS (Array of Structs):** `[{x, y}, {x, y}, {x, y}...]` $\to$ Causes cache misses on CPUs because SIMD instructions want all $X$'s grouped together.
- **SoA (Struct of Arrays):** `{ x: Float32Array(100000), y: Float32Array(100000) }` $\to$ Runs **300% to 500% faster** because the CPU can stream continuous blocks of memory directly into AVX registers!

---

## 3.8 Historical Context: The Great 19th-Century Vector Feud

Did you know that in the 1880s, the concept of a "vector" sparked one of the bitterest, nastiest shouting matches in the history of science?

In 1843, the brilliant Irish mathematician **William Rowan Hamilton** invented **Quaternions**—a 4-dimensional number system involving three imaginary units $i, j, k$ ($i^2 = j^2 = k^2 = ijk = -1$). Hamilton was so obsessed with quaternions that he believed all physics should be written in 4D quaternion algebra.

However, engineers and physicists hated quaternions. They found the 4D math unnecessarily complicated for calculating simple forces in 3D and 2D space.

In the 1880s, American physicist **Josiah Willard Gibbs** (at Yale) and British engineer **Oliver Heaviside** independently stripped away the complex imaginary numbers from quaternions and created modern **Vector Analysis**:
- They split Hamilton's system into two simple operations: The **Dot Product** (scalar output) and the **Cross Product** (vector output).
- They introduced the notation $\hat{i}, \hat{j}, \hat{k}$.

Hamilton's disciples were furious! Scottish physicist Peter Guthrie Tait publicly denounced Gibbs' vector system as a *"monstrous mutation"* and a *"parasite on the tree of mathematics."* Heaviside fired back in scientific journals, calling quaternions *"unnatural, complicated, and practically unworkable."*

Practical engineering won the day. Today, every video game engine, CAD program, aerospace flight controller, and physics textbook uses the clean, intuitive component vectors invented by Gibbs and Heaviside.

---

## 3.9 Chapter 3 Mastery Problem Set

Consolidate your mastery of vector components, notations, and basis vectors with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Express each of the following vectors in column matrix form $\begin{bmatrix} v_x \\ v_y \end{bmatrix}$:
   (a) $\vec{u} = 8\hat{i} + 3\hat{j}$,
   (b) $\vec{v} = -5\hat{i} + 12\hat{j}$,
   (c) $\vec{w} = -7\hat{j}$,
   (d) $\vec{z} = 14\hat{i}$.

2. **[Tier 1 - Class 6]** Write the basis vector decomposition ($v_x \hat{i} + v_y \hat{j}$) for the displacement from point $A(1, 4)$ to point $B(5, 10)$.

3. **[Tier 2 - Class 7]** Given $\vec{a} = 3\hat{i} - 2\hat{j}$ and $\vec{b} = -5\hat{i} + 7\hat{j}$:
   - Calculate the vector sum $\vec{s} = \vec{a} + \vec{b}$.
   - Calculate the vector difference $\vec{d} = \vec{a} - \vec{b}$.

4. **[Tier 2 - Class 7]** An autonomous lawnmower starts at $(0, 0)$. It is programmed with the following three consecutive motor steps:
   - Step 1: $\vec{s}_1 = 10\hat{i}$ meters
   - Step 2: $\vec{s}_2 = 4\hat{j}$ meters
   - Step 3: $\vec{s}_3 = -10\hat{i}$ meters
   - What are the final coordinates of the lawnmower?
   - What is the net displacement vector from start to finish?

5. **[Tier 3 - Class 8]** If $\vec{u} = 2\hat{i} + 5\hat{j}$ and $\vec{v} = -3\hat{i} + 4\hat{j}$, calculate the linear combination:
   $$\vec{w} = 4\vec{u} - 3\vec{v}$$

6. **[Tier 3 - Class 8]** A wind turbine blade tip has an instantaneous velocity vector $\vec{v} = (-45\hat{i} + 60\hat{j})\text{ m/s}$.
   - What is the horizontal speed component?
   - What is the vertical speed component?
   - If the turbine speeds up by $25\%$, write the new velocity vector.

7. **[Tier 4 - High School]** A cargo container is suspended by two steel cables. The tension in Cable 1 is $\vec{T}_1 = (-3000\hat{i} + 4000\hat{j})\text{ N}$. The gravity pulling the container down is $\vec{W} = -7000\hat{j}\text{ N}$.
   - If the container is completely stationary, Newton's law requires $\vec{T}_1 + \vec{T}_2 + \vec{W} = \vec{0}$.
   - Calculate the required tension vector $\vec{T}_2$ in Cable 2.

8. **[Tier 4 - High School]** Express the vector $\vec{p} = \begin{bmatrix} 11 \\ -1 \end{bmatrix}$ as a linear combination of $\vec{a} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$ and $\vec{b} = \begin{bmatrix} 3 \\ -2 \end{bmatrix}$. That is, find scalars $c_1$ and $c_2$ such that $c_1 \vec{a} + c_2 \vec{b} = \vec{p}$.

9. **[Tier 5 - University / Architecture]** In structural engineering, a pin-jointed truss node experiences four planar forces:
   $\vec{F}_1 = 50\hat{i}\text{ kN}$, $\vec{F}_2 = (30\hat{i} + 40\hat{j})\text{ kN}$, $\vec{F}_3 = -20\hat{j}\text{ kN}$, and an unknown bracing force $\vec{F}_4$.
   - For static structural equilibrium, the net force must be zero: $\sum \vec{F} = \vec{0}$.
   - Solve for $\vec{F}_4$ in $\hat{i}, \hat{j}$ form.

10. **[Tier 5 - Computer Graphics]** In a graphics shader, a 2D surface normal vector is $\vec{n} = (0.6\hat{i} + 0.8\hat{j})$. An incoming light ray vector is $\vec{L} = (0.6\hat{i} - 0.8\hat{j})$.
    - Calculate the component-wise difference vector $\vec{d} = \vec{L} - \vec{n}$.
    - Explain the physical meaning of this difference vector.

---

### Step-by-Step Solutions

#### Solution 1:
- (a) $\begin{bmatrix} 8 \\ 3 \end{bmatrix}$
- (b) $\begin{bmatrix} -5 \\ 12 \end{bmatrix}$
- (c) $\begin{bmatrix} 0 \\ -7 \end{bmatrix}$
- (d) $\begin{bmatrix} 14 \\ 0 \end{bmatrix}$

#### Solution 2:
- $\Delta x = 5 - 1 = 4$
- $\Delta y = 10 - 4 = 6$
- Basis form: $\vec{AB} = 4\hat{i} + 6\hat{j}$.

#### Solution 3:
- Sum:
  $$\vec{s} = (3 + (-5))\hat{i} + (-2 + 7)\hat{j} = -2\hat{i} + 5\hat{j}$$
- Difference:
  $$\vec{d} = (3 - (-5))\hat{i} + (-2 - 7)\hat{j} = (3 + 5)\hat{i} + (-9)\hat{j} = 8\hat{i} - 9\hat{j}$$

#### Solution 4:
- Net displacement:
  $$\vec{s}_{\text{net}} = 10\hat{i} + 4\hat{j} - 10\hat{i} = (10 - 10)\hat{i} + 4\hat{j} = 4\hat{j}\text{ meters}$$
- Final coordinates: $(0, 4)$. (The mower shifted 4 meters North).

#### Solution 5:
- Expand $4\vec{u}$:
  $$4(2\hat{i} + 5\hat{j}) = 8\hat{i} + 20\hat{j}$$
- Expand $-3\vec{v}$:
  $$-3(-3\hat{i} + 4\hat{j}) = 9\hat{i} - 12\hat{j}$$
- Combine:
  $$\vec{w} = (8 + 9)\hat{i} + (20 - 12)\hat{j} = 17\hat{i} + 8\hat{j}$$

#### Solution 6:
- Horizontal component: $|-45| = 45\text{ m/s}$ (moving West).
- Vertical component: $60\text{ m/s}$ (moving North).
- Speeding up by $25\%$ means multiplying by $1.25$:
  $$\vec{v}_{\text{new}} = 1.25(-45\hat{i} + 60\hat{j}) = -56.25\hat{i} + 75.0\hat{j}\text{ m/s}$$

#### Solution 7:
- Equilibrium condition:
  $$\vec{T}_2 = -(\vec{T}_1 + \vec{W})$$
  $$\vec{T}_1 + \vec{W} = (-3000\hat{i} + 4000\hat{j}) + (-7000\hat{j}) = -3000\hat{i} - 3000\hat{j}\text{ N}$$
- Invert to find $\vec{T}_2$:
  $$\vec{T}_2 = -(-3000\hat{i} - 3000\hat{j}) = +3000\hat{i} + 3000\hat{j}\text{ N}$$

#### Solution 8:
- Set up system:
  1. $2 c_1 + 3 c_2 = 11$
  2. $1 c_1 - 2 c_2 = -1 \implies c_1 = 2 c_2 - 1$
- Substitute into (1):
  $$2(2 c_2 - 1) + 3 c_2 = 11$$
  $$4 c_2 - 2 + 3 c_2 = 11 \implies 7 c_2 = 13 \dots \text{wait: } 11 + 2 = 13 \implies c_2 = 13/7?$$
  Let's re-verify: $2(2c_2 - 1) + 3c_2 = 4c_2 - 2 + 3c_2 = 7c_2 - 2 = 11 \implies 7c_2 = 13 \implies c_2 = 13/7$.
  Then $c_1 = 2(13/7) - 1 = 26/7 - 7/7 = 19/7$.
- Check:
  $$\frac{19}{7}\begin{bmatrix} 2 \\ 1 \end{bmatrix} + \frac{13}{7}\begin{bmatrix} 3 \\ -2 \end{bmatrix} = \begin{bmatrix} (38 + 39)/7 \\ (19 - 26)/7 \end{bmatrix} = \begin{bmatrix} 77/7 \\ -7/7 \end{bmatrix} = \begin{bmatrix} 11 \\ -1 \end{bmatrix}$$
  Exact analytical solution: $c_1 = \frac{19}{7}$, $c_2 = \frac{13}{7}$.

#### Solution 9:
- Sum existing forces:
  $$\vec{F}_{\text{known}} = (50\hat{i}) + (30\hat{i} + 40\hat{j}) + (-20\hat{j}) = (50 + 30)\hat{i} + (40 - 20)\hat{j} = 80\hat{i} + 20\hat{j}\text{ kN}$$
- Equilibrium requires $\vec{F}_4 = -\vec{F}_{\text{known}}$:
  $$\vec{F}_4 = -80\hat{i} - 20\hat{j}\text{ kN}$$

#### Solution 10:
- Difference vector:
  $$\vec{d} = (0.6\hat{i} - 0.8\hat{j}) - (0.6\hat{i} + 0.8\hat{j}) = (0.6 - 0.6)\hat{i} + (-0.8 - 0.8)\hat{j} = 0\hat{i} - 1.6\hat{j}$$
- Physical meaning: The horizontal components perfectly match ($d_x = 0$), while the vertical component has flipped from $+0.8$ to $-0.8$ (a relative span of $-1.6\hat{j}$). This represents the optical inversion across the surface boundary.
