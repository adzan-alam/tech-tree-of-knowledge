# CHAPTER 9: The Work Engine — The Dot Product (Scalar Product)

---

## 9.1 The Fundamental Question: How Much Do Two Vectors Collaborate?

Suppose you are pulling a heavy wooden sled across a snow-covered field.

You attach a rope to the front of the sled. You pull the rope with a force vector $\vec{F}$, and the sled moves along a displacement vector $\vec{d}$.

```
                 Pulling Force F
                         ▲
                        /
                       / 
                      / ) Angle θ
                     ●══════════════════════════════► Displacement Vector d
                  The Sled
```

Now, ask yourself three physical questions:
1. **What happens if you pull straight forward (parallel to the ground, $\theta = 0^\circ$)?**
   Every single ounce of your muscular effort goes into accelerating the sled forward!
2. **What happens if you pull straight upward into the sky ($\theta = 90^\circ$)?**
   You are lifting the sled, but you are providing **zero forward pull**. None of your upward force helps the sled move across the snow.
3. **What happens if you pull backward ($\theta = 180^\circ$)?**
   You are actively braking the sled, fighting against its forward motion!

In physics, computer graphics, artificial intelligence, and engineering, we constantly need an objective mathematical tool that answers:

> *"To what degree do two vectors point in the same direction? How much do they collaborate, how much do they ignore each other, and how much do they fight each other?"*

That tool is the most important operation in modern science: **The Dot Product** (also known as the **Scalar Product**).

---

## 9.2 The Two Definitions of the Dot Product

The Dot Product is unique: it takes **two vectors as input**, but produces a **single scalar number as output**!

There are two completely different ways to calculate it:

### Definition 1: The Geometric Definition (Magnitudes & Angles)
$$\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos\theta$$
- $\|\vec{u}\|$ is the length of the first arrow.
- $\|\vec{v}\|$ is the length of the second arrow.
- $\theta$ is the angle between them ($0^\circ \le \theta \le 180^\circ$).

### Definition 2: The Algebraic Definition (Cartesian Components)
$$\vec{u} \cdot \vec{v} = u_x v_x + u_y v_y$$
- Multiply the horizontal components together: $u_x v_x$.
- Multiply the vertical components together: $u_y v_y$.
- Add the two products together!

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE IMMORTAL IDENTITY                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│        u · v = u_x v_x + u_y v_y = ||u|| ||v|| cos(θ)                  │
│                                                                        │
│  The component arithmetic on the left EXACTLY equals the geometric     │
│  angle formula on the right!                                           │
└────────────────────────────────────────────────────────────────────────┘
```

Why is this identity so miraculous? Because it allows a computer chip to calculate angles, detect perpendicular lines, and compute lighting **without ever calling expensive trigonometric functions**!

---

## 9.3 The Unbroken Algebraic Proof of Equivalence

Many textbooks simply declare that $u_x v_x + u_y v_y = \|\vec{u}\| \|\vec{v}\| \cos\theta$ without proof. 

Let us prove this foundational equivalence from absolute first principles using the **Law of Cosines**.

```
                                  B (Tip of u)
                                  ●
                                 /│
                                / │
                             u /  │
                              /   │ Difference Vector:
                             /    │ w = u - v
                            / ) θ │
                           ●──────┘
                          O      v      C (Tip of v)
```

### Step 1: The Law of Cosines
Consider the triangle formed by vector $\vec{u}$, vector $\vec{v}$, and the difference vector $\vec{w} = \vec{u} - \vec{v}$.

From high school trigonometry, the Law of Cosines states that for any triangle with sides $a, b, c$ and angle $\theta$ opposite to side $c$:
$$c^2 = a^2 + b^2 - 2ab \cos\theta$$

Substituting the side lengths of our vector triangle:
$$\|\vec{u} - \vec{v}\|^2 = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2 \|\vec{u}\| \|\vec{v}\| \cos\theta \quad \text{--- (Equation 1)}$$

### Step 2: Expand the Left-Hand Side using Components
Recall that $\vec{u} - \vec{v} = (u_x - v_x, u_y - v_y)$.

By definition of Euclidean magnitude squared:
$$\|\vec{u} - \vec{v}\|^2 = (u_x - v_x)^2 + (u_y - v_y)^2$$

Expand the binomial squares algebraically:
$$\|\vec{u} - \vec{v}\|^2 = (u_x^2 - 2u_x v_x + v_x^2) + (u_y^2 - 2u_y v_y + v_y^2)$$

Rearrange and group the terms:
$$\|\vec{u} - \vec{v}\|^2 = (u_x^2 + u_y^2) + (v_x^2 + v_y^2) - 2(u_x v_x + u_y v_y) \quad \text{--- (Equation 2)}$$

### Step 3: Recognize Magnitudes
Notice that:
- $u_x^2 + u_y^2 = \|\vec{u}\|^2$
- $v_x^2 + v_y^2 = \|\vec{v}\|^2$

Substitute these into Equation 2:
$$\|\vec{u} - \vec{v}\|^2 = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2(u_x v_x + u_y v_y) \quad \text{--- (Equation 3)}$$

### Step 4: Equate and Cancel
Now equate Equation 1 and Equation 3:
$$\|\vec{u}\|^2 + \|\vec{v}\|^2 - 2 \|\vec{u}\| \|\vec{v}\| \cos\theta = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2(u_x v_x + u_y v_y)$$

Subtract $\|\vec{u}\|^2 + \|\vec{v}\|^2$ from both sides:
$$-2 \|\vec{u}\| \|\vec{v}\| \cos\theta = -2(u_x v_x + u_y v_y)$$

Divide both sides by $-2$:
$$\|\vec{u}\| \|\vec{v}\| \cos\theta = u_x v_x + u_y v_y$$

**Q.E.D.** 
The algebraic sum of component products is identical to the geometric cosine formula.

---

## 9.4 The Three Physical Regimes of the Dot Product

Because $\|\vec{u}\|$ and $\|\vec{v}\|$ are strictly positive lengths, the sign of the dot product depends **entirely on $\cos\theta$**:

```
     REGIME 1: ACUTE (θ < 90°)      REGIME 2: ORTHOGONAL (θ = 90°)     REGIME 3: OBTUSE (θ > 90°)
     
             u                              u                                  u
            ▲                              ▲                                  ▲
           /                              │                                    \
          /                              │                                      \
         / ) θ < 90°                    │ θ = 90°                                \ ) θ > 90°
        ●───────────► v                ●───────────► v                  v ◄───────●
        
        u · v > 0                      u · v = 0                        u · v < 0
        (Vectors Collaborate)          (Vectors Ignore Each Other)      (Vectors Fight / Oppose)
```

1. **Regime 1: Positive ($u \cdot v > 0$):**
   - The angle is **Acute** ($0^\circ \le \theta < 90^\circ$).
   - $\cos\theta > 0$.
   - The vectors point generally in the same direction; they help and boost each other.

2. **Regime 2: Zero ($u \cdot v = 0$):**
   - The angle is **Perpendicular / Right Angle** ($\theta = 90^\circ$).
   - $\cos(90^\circ) = 0$.
   - The vectors are **Orthogonal**. They have zero influence on each other.

3. **Regime 3: Negative ($u \cdot v < 0$):**
   - The angle is **Obtuse** ($90^\circ < \theta \le 180^\circ$).
   - $\cos\theta < 0$.
   - The vectors oppose and resist each other.

---

## 9.5 The Angle Extraction Formula

How do you find the exact angle between two arbitrary vectors in a computer simulation?

Rearrange the geometric definition to isolate $\cos\theta$:

$$\cos\theta = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|} = \frac{u_x v_x + u_y v_y}{\sqrt{u_x^2 + u_y^2} \sqrt{v_x^2 + v_y^2}}$$

Take the arccosine:

$$\theta = \arccos\left( \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|} \right)$$

If both vectors are already normalized unit vectors ($\hat{u}$ and $\hat{v}$), the formula simplifies to pure perfection:

$$\cos\theta = \hat{u} \cdot \hat{v} \implies \theta = \arccos(\hat{u} \cdot \hat{v})$$

The dot product of two unit vectors is **literally the cosine of the angle between them**!

---

## 9.6 Physical Application: Mechanical Work ($W = \vec{F} \cdot \vec{d}$)

In high school physics, you learned that:
$$\text{Work} = \text{Force} \times \text{Distance}$$

This simple equation is only true if the force points in the exact same direction as the motion!

In reality, force and displacement are both vectors. Nature's true equation for **Mechanical Work** is:

$$W = \vec{F} \cdot \vec{d} = \|\vec{F}\| \|\vec{d}\| \cos\theta = F_x d_x + F_y d_y$$

Work is measured in **Joules** ($1\text{ Joule} = 1\text{ Newton}\cdot\text{meter}$).

### The Suitcase Paradox
Suppose you pick up a heavy $30\text{ kg}$ suitcase. You hold it with an upward muscular force of $\vec{F} = (0, +300)\text{ N}$ to keep it from falling.

Now, you walk horizontally across a flat airport terminal for $100\text{ meters}$: $\vec{d} = (100, 0)\text{ m}$.

**How much mechanical work did your muscles do on the suitcase during that walk?**

Let us calculate:
$$W = \vec{F} \cdot \vec{d} = (0 \times 100) + (300 \times 0) = 0 + 0 = \mathbf{0\text{ Joules}!}$$

Your muscles feel tired, but in the strict language of physics, **you did zero mechanical work on the suitcase**! 

Why? Because your force was strictly vertical ($\theta = 90^\circ$), while the displacement was strictly horizontal. Because $\cos(90^\circ) = 0$, an orthogonal force does **zero work**.

---

## 9.7 Socratic Dialogue: Alice and The Vectorist on Dot Products

> **Alice:** "If the dot product takes two arrows and turns them into a number, why is it called multiplication?"
>
> **The Vectorist:** "Because it shares the fundamental algebraic laws of ordinary multiplication!
> 1. It is **Commutative**: $\vec{u} \cdot \vec{v} = \vec{v} \cdot \vec{u}$.
> 2. It is **Distributive**: $\vec{u} \cdot (\vec{v} + \vec{w}) = \vec{u} \cdot \vec{v} + \vec{u} \cdot \vec{w}$.
> 3. Scalar factors pass right through: $(c\vec{u}) \cdot \vec{v} = c(\vec{u} \cdot \vec{v})$."
>
> **Alice:** "What about multiplying a vector by itself: $\vec{v} \cdot \vec{v}$?"
>
> **The Vectorist:** "Look at what happens! The angle between a vector and itself is $\theta = 0^\circ$. And $\cos(0^\circ) = 1.0$.
> Therefore:
> $$\vec{v} \cdot \vec{v} = \|\vec{v}\| \|\vec{v}\| \cos(0^\circ) = \|\vec{v}\|^2$$
> In components:
> $$\vec{v} \cdot \vec{v} = v_x^2 + v_y^2$$
> The dot product of a vector with itself is **the exact square of its magnitude**! 
> If you need the length of a vector: $\|\vec{v}\| = \sqrt{\vec{v} \cdot \vec{v}}$."

---

## 9.8 Ten Concrete Worked Numerical Examples: Dot Products

---

### Example 1: Basic Component Dot Product
* **Problem:** Calculate $\vec{u} \cdot \vec{v}$ for $\vec{u} = (3, 7)$ and $\vec{v} = (4, -2)$.
* **Calculation:**
  $$\vec{u} \cdot \vec{v} = (3 \times 4) + (7 \times -2) = 12 + (-14) = -2$$
* **Interpretation:** Because the dot product is negative ($-2 < 0$), the angle between these vectors is obtuse ($\theta > 90^\circ$).

---

### Example 2: The Orthogonality Test (Perpendicularity)
* **Problem:** Are the vectors $\vec{a} = (6, 4)$ and $\vec{b} = (-2, 3)$ perpendicular?
* **Calculation:**
  $$\vec{a} \cdot \vec{b} = (6 \times -2) + (4 \times 3) = -12 + 12 = 0$$
* **Conclusion:** Because $\vec{a} \cdot \vec{b} = 0$, the angle is **strictly $90^\circ$**. They are perfectly perpendicular!

---

### Example 3: Parallel Vectors
* **Problem:** Calculate $\vec{u} \cdot \vec{v}$ for $\vec{u} = (4, 3)$ and $\vec{v} = (8, 6)$.
* **Calculation:**
  $$\vec{u} \cdot \vec{v} = (4 \times 8) + (3 \times 6) = 32 + 18 = 50$$
* **Check via Magnitudes:**
  - $\|\vec{u}\| = \sqrt{4^2 + 3^2} = 5$.
  - $\|\vec{v}\| = \sqrt{8^2 + 6^2} = 10$.
  - Since $\vec{v} = 2\vec{u}$, they are parallel ($\theta = 0^\circ$).
  - $\|\vec{u}\| \|\vec{v}\| \cos(0^\circ) = 5 \times 10 \times 1.0 = 50$. Exact match!

---

### Example 4: Calculating the Angle Between Two Vectors
* **Problem:** Find the angle $\theta$ between $\vec{u} = (2, 3)$ and $\vec{v} = (4, 1)$.
* **Step-by-Step Calculation:**
  1. Dot Product: $\vec{u} \cdot \vec{v} = (2 \times 4) + (3 \times 1) = 8 + 3 = 11$.
  2. Magnitudes:
     $$\|\vec{u}\| = \sqrt{2^2 + 3^2} = \sqrt{4 + 9} = \sqrt{13} \approx 3.6056$$
     $$\|\vec{v}\| = \sqrt{4^2 + 1^2} = \sqrt{16 + 1} = \sqrt{17} \approx 4.1231$$
  3. Denominator product: $\sqrt{13} \times \sqrt{17} = \sqrt{221} \approx 14.866$
  4. Cosine value:
     $$\cos\theta = \frac{11}{14.866} \approx 0.73994$$
  5. Angle:
     $$\theta = \arccos(0.73994) \approx 42.27^\circ\text{ (or } 0.7378\text{ radians)}$$

---

### Example 5: Mechanical Work Calculation
* **Problem:** A tractor drags a heavy tree trunk $50\text{ meters}$ East: $\vec{d} = (50, 0)\text{ m}$. The towing cable pulls with force $\vec{F} = (4000, 3000)\text{ N}$. Calculate the mechanical work performed.
* **Calculation:**
  $$W = \vec{F} \cdot \vec{d} = (4000 \times 50) + (3000 \times 0) = 200,000 + 0 = 200,000\text{ Joules (200 kJ)}$$
* **Notice:** The vertical upward force of $3,000\text{ N}$ did zero work. Only the horizontal force of $4,000\text{ N}$ did work.

---

### Example 6: Dot Product of Basis Vectors
* **Problem:** Calculate all four combinations of Cartesian basis vectors:
  $\hat{i} \cdot \hat{i}$, $\hat{j} \cdot \hat{j}$, $\hat{i} \cdot \hat{j}$, $\hat{j} \cdot \hat{i}$.
* **Calculation:**
  - $\hat{i} \cdot \hat{i} = (1 \times 1) + (0 \times 0) = 1$
  - $\hat{j} \cdot \hat{j} = (0 \times 0) + (1 \times 1) = 1$
  - $\hat{i} \cdot \hat{j} = (1 \times 0) + (0 \times 1) = 0$
  - $\hat{j} \cdot \hat{i} = (0 \times 1) + (1 \times 0) = 0$
* **Fundamental Rule:** The dot product of an orthonormal basis vector with itself is 1; with any other basis vector, it is 0.

---

### Example 7: Solar Panel Illumination Efficiency
* **Problem:** A solar panel roof has a unit surface normal vector pointing straight up: $\hat{n} = (0, 1)$. Sunlight rays strike the roof along unit direction vector $\hat{L} = (0.6, 0.8)$.
  Calculate the solar absorption efficiency factor $\eta = \hat{n} \cdot \hat{L}$.
* **Calculation:**
  $$\eta = \hat{n} \cdot \hat{L} = (0 \times 0.6) + (1 \times 0.8) = 0.80$$
* **Interpretation:** The panel receives $80\%$ of maximum direct overhead sunlight intensity.

---

### Example 8: Game AI Vision Cone (Is the Player in Front of the Guard?)
* **Problem:** A stealth game security guard stands at $(10, 10)$ facing in unit direction $\hat{f} = (0, 1)$ (facing North).
  A player sneaks at position $P(15, 6)$. Is the player in front of the guard or behind the guard?
* **Calculation:**
  1. Vector from guard to player:
     $$\vec{d} = (15 - 10, 6 - 10) = (5, -4)$$
  2. Dot product with guard's facing vector:
     $$\text{Alignment} = \hat{f} \cdot \vec{d} = (0 \times 5) + (1 \times -4) = -4$$
* **Conclusion:** Because the dot product is negative ($-4 < 0$), the player is **BEHIND the guard**. The guard cannot see them!

---

### Example 9: Dot Product with the Zero Vector
* **Problem:** Prove that the dot product of any vector $\vec{v} = (v_x, v_y)$ with the Zero Vector $\vec{0} = (0, 0)$ is always zero.
* **Calculation:**
  $$\vec{v} \cdot \vec{0} = (v_x \times 0) + (v_y \times 0) = 0 + 0 = 0$$

---

### Example 10: The `Math.acos()` Floating-Point Clamp Guard
* **Problem:** Why does this code sometimes crash in a game engine?
  ```typescript
  const cosTheta = (u.dot(v)) / (u.length() * v.length());
  const angle = Math.acos(cosTheta);
  ```
* **Hardware Analysis:**
  If $\vec{u}$ and $\vec{v}$ are parallel vectors, $\cos\theta$ should mathematically equal $1.0$.
  However, due to floating-point rounding:
  `cosTheta = 1.0000000000000002`!
  The domain of `Math.acos(x)` is strictly $[-1.0, +1.0]$.
  If you pass $1.0000000000000002$ into `Math.acos`, the CPU returns **`NaN`**!
* **The Fix (Clamp Guard):**
  ```typescript
  function angleBetween(u: Vector2D, v: Vector2D): number {
    const denom = u.magnitude() * v.magnitude();
    if (denom <= 1e-7) return 0; // Guard zero vectors
    const cosTheta = Math.max(-1.0, Math.min(1.0, u.dot(v) / denom));
    return Math.acos(cosTheta);
  }
  ```

---

## 9.9 Debunked Misconceptions & Traps

### Misconception 1: "The dot product produces a vector."
* **The Fatal Trap:** Never write $\vec{u} \cdot \vec{v}$ with an arrow! The dot product is called the **Scalar Product** because its output is a single scalar number (like $15$ or $-4.2$).

### Misconception 2: "If $\vec{u} \cdot \vec{v} = \vec{u} \cdot \vec{w}$, then $\vec{v}$ must equal $\vec{w}$."
* **The Cancellation Fallacy:** In ordinary scalar arithmetic, if $3x = 3y$, you can divide by 3 to conclude $x = y$.
  In vectors, you **CANNOT cancel**!
  $$\vec{u} \cdot \vec{v} = \vec{u} \cdot \vec{w} \implies \vec{u} \cdot (\vec{v} - \vec{w}) = 0$$
  This only means that $(\vec{v} - \vec{w})$ is perpendicular to $\vec{u}$. Vector $\vec{v}$ and vector $\vec{w}$ can be completely different!

---

## 9.10 Historical Context: Maxwell, Gibbs, and the Dot Product

In the original 1873 formulation of James Clerk Maxwell's electromagnetic theory, Maxwell wrote out twenty simultaneous differential equations using Hamilton's 4D quaternions.

When American physicist **Josiah Willard Gibbs** read Maxwell's treatise, he realized that in almost every physical calculation—calculating the magnetic flux through a coil, the work done by an electric field, or the kinetic energy of an electron—the quaternion math was merely doing what Gibbs named the **Direct Product** (which he denoted with a simple dot $\cdot$).

In 1881, Gibbs published his pamphlet defining the **Dot Product** and the **Cross Product**. British physicist Oliver Heaviside adopted Gibbs' notation to compress Maxwell's twenty impenetrable equations into the **four elegant Maxwell Equations** that every physics undergraduate studies today!

---

## 9.11 Chapter 9 Mastery Problem Set

Consolidate your mastery of the dot product and mechanical work with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Calculate the dot product $\vec{u} \cdot \vec{v}$ for each pair:
   - (a) $\vec{u} = (4, 3)$ and $\vec{v} = (2, 5)$
   - (b) $\vec{u} = (-6, 2)$ and $\vec{v} = (3, 9)$
   - (c) $\vec{u} = (10, -4)$ and $\vec{v} = (-2, -5)$
   - (d) $\vec{u} = (0, 8)$ and $\vec{v} = (12, 0)$

2. **[Tier 1 - Class 6]** A horse pulls a wagon along a straight road with displacement $\vec{d} = (80, 0)\text{ meters}$. The harness pulls with force $\vec{F} = (500, 0)\text{ N}$. Calculate the mechanical work done in Joules.

3. **[Tier 2 - Class 7]** Determine whether each pair of vectors is **Orthogonal** (perpendicular), **Parallel**, or **Neither**:
   - (a) $\vec{a} = (3, -2)$ and $\vec{b} = (4, 6)$
   - (b) $\vec{c} = (5, 10)$ and $\vec{d} = (-2, -4)$
   - (c) $\vec{e} = (7, 1)$ and $\vec{f} = (2, 8)$

4. **[Tier 2 - Class 7]** Find the missing component $k$ such that the vectors $\vec{u} = (6, k)$ and $\vec{v} = (4, -8)$ are strictly orthogonal.

5. **[Tier 3 - Class 8]** Two forces act on a shipping container: $\vec{F}_1 = (30, 40)\text{ N}$ and $\vec{F}_2 = (50, -20)\text{ N}$. The container moves through displacement $\vec{d} = (4, 10)\text{ meters}$.
   - Calculate the work $W_1$ done by Force 1.
   - Calculate the work $W_2$ done by Force 2.
   - Calculate the net work $W_{\text{net}} = (\vec{F}_1 + \vec{F}_2) \cdot \vec{d}$ and verify that $W_{\text{net}} = W_1 + W_2$.

6. **[Tier 3 - Class 8]** Calculate the exact angle $\theta$ (in degrees) between $\vec{u} = (1, 1)$ and $\vec{v} = (0, 5)$.

7. **[Tier 4 - High School]** A locomotive pulls a railcar along a straight Eastbound track: $\vec{d} = (200, 0)\text{ meters}$. The pulling cable is angled at $\theta = 30^\circ$ above the horizontal and exerts a tension of $\|\vec{F}\| = 50,000\text{ N}$.
   - Decompose $\vec{F}$ into components.
   - Calculate the work done using both the geometric formula and the algebraic component formula.

8. **[Tier 4 - High School]** If $\|\vec{u}\| = 8$, $\|\vec{v}\| = 5$, and the angle between them is $\theta = 120^\circ$:
   - Calculate the dot product $\vec{u} \cdot \vec{v}$.
   - Calculate the magnitude of their sum: $\|\vec{u} + \vec{v}\|$ using the identity $\|\vec{u} + \vec{v}\|^2 = \|\vec{u}\|^2 + \|\vec{v}\|^2 + 2(\vec{u} \cdot \vec{v})$.

9. **[Tier 5 - Game Dev / Shaders]** In 3D/2D computer graphics lighting (Lambert's Cosine Law), the diffuse brightness $I$ of a surface point is given by:
   $$I = I_0 \max(0, \hat{n} \cdot \hat{L})$$
   where $\hat{n} = (0, 1)$ is the surface normal and $\hat{L}$ is the unit vector pointing toward the light source.
   - Calculate the brightness if the light is directly overhead: $\hat{L} = (0, 1)$.
   - Calculate the brightness if the light is at sunset: $\hat{L} = (1, 0)$.
   - Calculate the brightness if the light is below the horizon: $\hat{L} = (0.6, -0.8)$.

10. **[Tier 5 - Physics / Dot Product Invariant]** Let vector $\vec{v}$ have components $(v_x, v_y)$ in a standard coordinate frame. Suppose the entire coordinate frame is rotated by angle $\phi$. The components in the new frame become:
    $$v_x' = v_x \cos\phi + v_y \sin\phi$$
    $$v_y' = -v_x \sin\phi + v_y \cos\phi$$
    - Prove algebraically that $(v_x')^2 + (v_y')^2 = v_x^2 + v_y^2$.
    - What profound physical truth does this prove about the magnitude and dot product under rotation?

---

### Step-by-Step Solutions

#### Solution 1:
- (a) $\vec{u} \cdot \vec{v} = (4 \times 2) + (3 \times 5) = 8 + 15 = 23$.
- (b) $\vec{u} \cdot \vec{v} = (-6 \times 3) + (2 \times 9) = -18 + 18 = 0$ (Orthogonal!).
- (c) $\vec{u} \cdot \vec{v} = (10 \times -2) + (-4 \times -5) = -20 + 20 = 0$ (Orthogonal!).
- (d) $\vec{u} \cdot \vec{v} = (0 \times 12) + (8 \times 0) = 0 + 0 = 0$ (Orthogonal!).

#### Solution 2:
- Work: $W = \vec{F} \cdot \vec{d} = (500 \times 80) + (0 \times 0) = 40,000\text{ Joules (40 kJ)}$.

#### Solution 3:
- (a) $\vec{a} \cdot \vec{b} = (3 \times 4) + (-2 \times 6) = 12 - 12 = 0 \implies$ **Orthogonal**.
- (b) $\vec{d} = -0.4 \vec{c} \implies$ Collinear anti-parallel $\implies$ **Parallel**.
- (c) $\vec{e} \cdot \vec{f} = (7 \times 2) + (1 \times 8) = 14 + 8 = 22 \ne 0$, and slopes are $1/7 \ne 8/2 \implies$ **Neither**.

#### Solution 4:
- Orthogonality requires dot product to equal zero:
  $$\vec{u} \cdot \vec{v} = (6 \times 4) + (k \times -8) = 0$$
  $$24 - 8k = 0 \implies 8k = 24 \implies k = 3$$

#### Solution 5:
- $W_1 = \vec{F}_1 \cdot \vec{d} = (30 \times 4) + (40 \times 10) = 120 + 400 = 520\text{ Joules}$.
- $W_2 = \vec{F}_2 \cdot \vec{d} = (50 \times 4) + (-20 \times 10) = 200 - 200 = 0\text{ Joules}$.
- Net force: $\vec{F}_{\text{net}} = (30 + 50, 40 - 20) = (80, 20)\text{ N}$.
- Net work: $W_{\text{net}} = (80 \times 4) + (20 \times 10) = 320 + 200 = 520\text{ Joules}$.
- $520 = 520 + 0$. Verified!

#### Solution 6:
- $\vec{u} \cdot \vec{v} = (1 \times 0) + (1 \times 5) = 5$.
- $\|\vec{u}\| = \sqrt{1^2 + 1^2} = \sqrt{2}$.
- $\|\vec{v}\| = \sqrt{0^2 + 5^2} = 5$.
- Cosine:
  $$\cos\theta = \frac{5}{5\sqrt{2}} = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$$
- Angle: $\theta = \arccos(1/\sqrt{2}) = 45^\circ$.

#### Solution 7:
- (a) $\vec{F} = (50,000 \cos 30^\circ, 50,000 \sin 30^\circ) = (43,301.27, 25,000.0)\text{ N}$.
- (b) Geometric formula:
  $$W = \|\vec{F}\| \|\vec{d}\| \cos(30^\circ) = 50,000 \times 200 \times 0.866025 = 8,660,254\text{ Joules} \approx 8.66\text{ MJ}$$
- Algebraic formula:
  $$W = (43,301.27 \times 200) + (25,000 \times 0) = 8,660,254\text{ Joules}$$

#### Solution 8:
- (a) $\vec{u} \cdot \vec{v} = 8 \times 5 \times \cos(120^\circ) = 40 \times (-0.5) = -20$.
- (b) Sum magnitude squared:
  $$\|\vec{u} + \vec{v}\|^2 = 8^2 + 5^2 + 2(-20) = 64 + 25 - 40 = 49$$
  $$\|\vec{u} + \vec{v}\| = \sqrt{49} = 7$$

#### Solution 9:
- Directly overhead: $\hat{n} \cdot \hat{L} = (0)(0) + (1)(1) = 1.0 \implies I = I_0 (1.0) = 100\%$ maximum brightness.
- Sunset: $\hat{n} \cdot \hat{L} = (0)(1) + (1)(0) = 0 \implies I = 0$ (grazing angle).
- Below horizon: $\hat{n} \cdot \hat{L} = (0)(0.6) + (1)(-0.8) = -0.8 \implies \max(0, -0.8) = 0$ (completely dark).

#### Solution 10:
- Expand $(v_x')^2$:
  $$(v_x \cos\phi + v_y \sin\phi)^2 = v_x^2 \cos^2\phi + 2v_x v_y \cos\phi\sin\phi + v_y^2 \sin^2\phi$$
- Expand $(v_y')^2$:
  $$(-v_x \sin\phi + v_y \cos\phi)^2 = v_x^2 \sin^2\phi - 2v_x v_y \cos\phi\sin\phi + v_y^2 \cos^2\phi$$
- Sum them together: The middle cross-terms $+2v_x v_y \cos\phi\sin\phi$ and $-2v_x v_y \cos\phi\sin\phi$ cancel identically!
  $$(v_x')^2 + (v_y')^2 = v_x^2 (\cos^2\phi + \sin^2\phi) + v_y^2 (\sin^2\phi + \cos^2\phi)$$
- Since $\cos^2\phi + \sin^2\phi = 1$:
  $$(v_x')^2 + (v_y')^2 = v_x^2 (1) + v_y^2 (1) = v_x^2 + v_y^2$$
- Physical truth: **Vector magnitude and dot products are Invariants under coordinate rotation.** Reality does not care how you tilt your coordinate axes.
