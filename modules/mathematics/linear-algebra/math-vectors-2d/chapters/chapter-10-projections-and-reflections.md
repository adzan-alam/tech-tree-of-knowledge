# CHAPTER 10: Orthogonal Projections and Surface Reflections

---

## 10.1 The Flashlight Metaphor: What is a Vector Projection?

Imagine you are standing in a dark room holding a long wooden pencil slanted in mid-air.

Directly above the pencil, you mount an overhead flashlight pointing straight down toward a horizontal table.

```
                           Flashlight Beam
                             │  │  │  │  │
                             ▼  ▼  ▼  ▼  ▼
                             
                                   ● Tip of Pencil (u)
                                  /│
                                 / │
                        Pencil  /  │
                       Vector u/   │
                              /    │ Light Rays
                             /     │
                            /      │
                           ●───────┴──────────────► Vector v (The Table)
                          Tail     Shadow of u
                                   = proj_v(u)
```

Look at the table surface: **the pencil casts a shadow on the wood**.
- If the pencil lies flat on the table, its shadow is as long as the pencil itself.
- If the pencil stands perfectly upright ($90^\circ$ to the table), its shadow shrinks to a single, microscopic point!
- If the pencil tilts at an angle, the shadow represents **the exact portion of the pencil that lies parallel to the table surface**.

In mathematics and computational physics, this shadow is called the **Orthogonal Projection** of vector $\vec{u}$ onto vector $\vec{v}$ (written $\text{proj}_{\vec{v}}\vec{u}$).

---

## 10.2 Mathematical Derivation of the Vector Projection Formula

How do we calculate the exact length and direction of this shadow using linear algebra?

Let us derive the formula from first principles.

```
                                      B (Tip of u)
                                      ●
                                     /│
                                    / │
                                 u /  │ u_perp (Rejection)
                                  /   │ (Perpendicular to v)
                                 /    │
                                / ) θ │
                               ●──────┴───────► v
                              A   u_parallel
                                  (Projection)
```

### Step 1: The Scalar Projection (Length of the Shadow)
Look at the right-angled triangle formed by vector $\vec{u}$, its shadow, and the vertical drop line.

From basic trigonometry, the length of the adjacent leg (the shadow) is:
$$\text{Length of Shadow} = \|\vec{u}\| \cos\theta$$

We call this signed length the **Scalar Projection** (or *Component* of $\vec{u}$ along $\vec{v}$, written $\text{comp}_{\vec{v}}\vec{u}$).

Now recall our dot product angle formula:
$$\cos\theta = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$

Substitute this $\cos\theta$ into our shadow length formula:
$$\text{comp}_{\vec{v}}\vec{u} = \|\vec{u}\| \left( \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|} \right)$$

Cancel the $\|\vec{u}\|$ in the numerator and denominator:

$$\text{comp}_{\vec{v}}\vec{u} = \frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|}$$

### Step 2: The Vector Projection (Giving the Shadow Direction)
The scalar projection gives us only the *length* of the shadow. But the shadow is a directed arrow pointing along the direction of vector $\vec{v}$!

How do we give a scalar length a direction? We multiply it by the **Unit Vector** pointing along $\vec{v}$:

$$\text{proj}_{\vec{v}}\vec{u} = (\text{comp}_{\vec{v}}\vec{u}) \hat{v}$$

Substitute our formula for $\text{comp}_{\vec{v}}\vec{u}$ and the definition of the unit vector $\hat{v} = \frac{\vec{v}}{\|\vec{v}\|}$:

$$\text{proj}_{\vec{v}}\vec{u} = \left( \frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|} \right) \left( \frac{\vec{v}}{\|\vec{v}\|} \right)$$

Multiply the denominators together ($\|\vec{v}\| \times \|\vec{v}\| = \|\vec{v}\|^2$):

```
┌────────────────────────────────────────────────────────────────────────┐
│                    THE VECTOR PROJECTION FORMULA                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                   proj_v(u) = ( u · v ) * v                            │
│                               ---------                                │
│                                 ||v||²                                 │
│                                                                        │
│  If v is already a normalized unit vector (||v|| = 1.0):               │
│                   proj_v(u) = (u · v) * v                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

Notice the beauty of this formula: $\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2}$ is just a single scalar number that scales the vector $\vec{v}$ to the exact length of the shadow!

---

## 10.3 Decomposing a Vector: Parallel and Perpendicular

Every vector $\vec{u}$ can be broken down into two perpendicular components relative to any reference direction $\vec{v}$:
1. **The Parallel Component ($\vec{u}_{\parallel}$):** The part of $\vec{u}$ that points along $\vec{v}$.
2. **The Perpendicular Component ($\vec{u}_{\perp}$):** The part of $\vec{u}$ that points at a $90^\circ$ right angle to $\vec{v}$ (often called the *Rejection Vector*).

$$\vec{u} = \vec{u}_{\parallel} + \vec{u}_{\perp}$$

We already know how to calculate the parallel component: it is simply the projection!
$$\vec{u}_{\parallel} = \text{proj}_{\vec{v}}\vec{u} = \left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2}\right)\vec{v}$$

To find the perpendicular rejection component, simply subtract the parallel component from the original vector:

$$\vec{u}_{\perp} = \vec{u} - \vec{u}_{\parallel} = \vec{u} - \text{proj}_{\vec{v}}\vec{u}$$

### Proof of Orthogonality
Let us prove algebraically that $\vec{u}_{\perp}$ is strictly perpendicular to $\vec{v}$ by taking their dot product:

$$\vec{u}_{\perp} \cdot \vec{v} = (\vec{u} - \vec{u}_{\parallel}) \cdot \vec{v} = \vec{u} \cdot \vec{v} - \vec{u}_{\parallel} \cdot \vec{v}$$

Substitute $\vec{u}_{\parallel} = \left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2}\right)\vec{v}$:

$$\vec{u}_{\perp} \cdot \vec{v} = \vec{u} \cdot \vec{v} - \left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2}\right) (\vec{v} \cdot \vec{v})$$

Recall that $\vec{v} \cdot \vec{v} = \|\vec{v}\|^2$:

$$\vec{u}_{\perp} \cdot \vec{v} = \vec{u} \cdot \vec{v} - \left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2}\right) \|\vec{v}\|^2 = \vec{u} \cdot \vec{v} - \vec{u} \cdot \vec{v} = 0$$

**Q.E.D.** 
The dot product is identically zero. $\vec{u}_{\perp}$ is guaranteed to be perfectly orthogonal to $\vec{v}$!

---

## 10.4 Surface Normal Vectors ($\hat{n}$) and Tangent Vectors ($\hat{t}$)

In video game collision systems and physics engines, solid obstacles (walls, ramps, pool table cushions) are defined by two vectors:

```
                            Outward Surface Normal
                                      ▲ n-hat
                                      │ (Perpendicular to wall)
                                      │
            Solid Wall                │
       ───────────────────────────────●───────────────────────────────
                                      Wall Surface
       ◄──────────────────────────────┬──────────────────────────────►
                                      Tangent Vector t-hat (Along wall)
```

1. **The Tangent Vector ($\hat{t}$):** A unit vector running parallel along the surface of the wall.
2. **The Surface Normal Vector ($\hat{n}$):** A unit vector pointing at a strict $90^\circ$ right angle straight OUT of the wall into open space.

---

## 10.5 The Classical Physics Reflection Law: Billiard Balls & Lasers

Now we arrive at the crowning achievement of vector geometry: **How does an object bounce off a wall?**

Imagine a billiard ball rolling across a table with velocity $\vec{v}$. It strikes a hard rubber cushion with surface unit normal $\hat{n}$.

```
                 Incident Velocity v         Rebound Velocity v_rebound
                        \                              ▲
                         \                            /
                          \                          /
                           \                        /
                            ▼                      /
                       ──────●────────────────────●────── Surface
                             │
                             │ Normal Component
                             │ v_n = (v · n) n
                             ▼ (Reversed upon impact!)
```

### The Physical Law of Elastic Bounce
When a ball bounces off a frictionless surface:
1. The **Tangential Velocity** ($\vec{v}_t$) parallel to the wall is completely undisturbed by the collision:
   $$\vec{v}_t' = \vec{v}_t$$
2. The **Normal Velocity** ($\vec{v}_n$) directed into the wall is **completely flipped in sign** by the elastic impact impulse:
   $$\vec{v}_n' = -\vec{v}_n$$

### Deriving the Reflection Equation
1. Decompose the incident velocity $\vec{v}$ into normal and tangential components:
   $$\vec{v} = \vec{v}_n + \vec{v}_t$$
2. The normal component is the projection of $\vec{v}$ onto the unit normal $\hat{n}$:
   $$\vec{v}_n = (\vec{v} \cdot \hat{n})\hat{n}$$
3. Therefore, the tangential component is:
   $$\vec{v}_t = \vec{v} - \vec{v}_n = \vec{v} - (\vec{v} \cdot \hat{n})\hat{n}$$
4. Now construct the rebound velocity $\vec{v}_{\text{rebound}}$ by negating $\vec{v}_n$:
   $$\vec{v}_{\text{rebound}} = \vec{v}_t - \vec{v}_n$$
5. Substitute our expressions for $\vec{v}_t$ and $\vec{v}_n$:
   $$\vec{v}_{\text{rebound}} = [\vec{v} - (\vec{v} \cdot \hat{n})\hat{n}] - (\vec{v} \cdot \hat{n})\hat{n}$$

Combine the two identical terms:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     THE VECTOR REFLECTION LAW                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│              v_rebound = v - 2 * ( v · n-hat ) * n-hat                 │
│                                                                        │
│  This single, elegant equation governs every light ray reflection,     │
│  every billiard ball collision, and every radar bounce in nature!      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10.6 Socratic Dialogue: Inelastic Bounces and Restitution

> **Alice:** "Does this reflection equation assume a perfect bounce?"
>
> **The Vectorist:** "Yes! It assumes a perfectly elastic collision with a **Coefficient of Restitution** $e = 1.0$, where no kinetic energy is lost."
>
> **Alice:** "What if the wall is made of soft clay or mud, so the ball loses speed when it hits?"
>
> **The Vectorist:** "Then we introduce the restitution factor $e$ (between $0.0$ and $1.0$).
> Instead of flipping the normal velocity by $-1.0$, we scale it by $-e$:
> $$\vec{v}_{\text{rebound}} = \vec{v} - (1 + e)(\vec{v} \cdot \hat{n})\hat{n}$$
> - If $e = 1.0$: $\vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}$ (A perfect superball bounce).
> - If $e = 0.5$: The ball bounces back with half its normal speed.
> - If $e = 0.0$: $\vec{v} - (\vec{v} \cdot \hat{n})\hat{n} = \vec{v}_t$! The ball completely stops into the wall and slides smoothly along its surface! This is exactly how video game characters slide along walls when they run into them."

---

## 10.7 Ten Concrete Worked Numerical Examples: Projections & Reflections

---

### Example 1: Projecting onto the X-Axis
* **Problem:** Project vector $\vec{u} = (4, 7)$ onto the horizontal vector $\vec{v} = (10, 0)$.
* **Calculation:**
  1. $\vec{u} \cdot \vec{v} = (4 \times 10) + (7 \times 0) = 40$.
  2. $\|\vec{v}\|^2 = 10^2 + 0^2 = 100$.
  3. Projection:
     $$\text{proj}_{\vec{v}}\vec{u} = \left(\frac{40}{100}\right) \begin{bmatrix} 10 \\ 0 \end{bmatrix} = 0.40 \begin{bmatrix} 10 \\ 0 \end{bmatrix} = \begin{bmatrix} 4 \\ 0 \end{bmatrix}$$
* **Sanity Check:** The shadow of $(4, 7)$ on the floor is simply $(4, 0)$.

---

### Example 2: Projecting onto a Diagonal Vector
* **Problem:** Find the vector projection of $\vec{u} = (2, 8)$ onto the diagonal vector $\vec{v} = (4, 4)$.
* **Calculation:**
  1. $\vec{u} \cdot \vec{v} = (2 \times 4) + (8 \times 4) = 8 + 32 = 40$.
  2. $\|\vec{v}\|^2 = 4^2 + 4^2 = 16 + 16 = 32$.
  3. Scalar fraction:
     $$\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2} = \frac{40}{32} = \frac{5}{4} = 1.25$$
  4. Vector projection:
     $$\vec{u}_{\parallel} = 1.25 \begin{bmatrix} 4 \\ 4 \end{bmatrix} = \begin{bmatrix} 5 \\ 5 \end{bmatrix}$$

---

### Example 3: Finding the Perpendicular Rejection Vector
* **Problem:** For the vectors in Example 2 ($\vec{u} = (2, 8)$ and $\vec{v} = (4, 4)$), calculate the perpendicular rejection vector $\vec{u}_{\perp}$.
* **Calculation:**
  $$\vec{u}_{\perp} = \vec{u} - \vec{u}_{\parallel} = \begin{bmatrix} 2 \\ 8 \end{bmatrix} - \begin{bmatrix} 5 \\ 5 \end{bmatrix} = \begin{bmatrix} -3 \\ 3 \end{bmatrix}$$
* **Orthogonality Verification:**
  $$\vec{u}_{\perp} \cdot \vec{v} = (-3 \times 4) + (3 \times 4) = -12 + 12 = 0$$
  The rejection vector is perfectly orthogonal to $\vec{v}$!

---

### Example 4: Billiard Ball Bouncing off a Horizontal Floor
* **Problem:** A billiard ball strikes a horizontal cushion with incident velocity $\vec{v} = (5, -4)\text{ m/s}$. The cushion has an outward unit normal pointing straight up: $\hat{n} = (0, 1)$. Find the rebound velocity $\vec{v}_{\text{rebound}}$.
* **Calculation:**
  1. Dot product $\vec{v} \cdot \hat{n}$:
     $$\vec{v} \cdot \hat{n} = (5 \times 0) + (-4 \times 1) = -4$$
  2. Reflection formula:
     $$\vec{v}_{\text{rebound}} = \vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}$$
     $$\vec{v}_{\text{rebound}} = \begin{bmatrix} 5 \\ -4 \end{bmatrix} - 2(-4) \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 5 \\ -4 \end{bmatrix} + 8 \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 5 \\ -4 + 8 \end{bmatrix} = \begin{bmatrix} 5 \\ +4 \end{bmatrix}\text{ m/s}$$
* **Notice:** The horizontal speed ($5\text{ m/s}$) is completely preserved, while the vertical velocity flipped from downward ($-4$) to upward ($+4$).

---

### Example 5: Billiard Ball Bouncing off a Vertical Wall
* **Problem:** A ball hits a vertical wall with velocity $\vec{v} = (8, 3)\text{ m/s}$. The wall has an outward unit normal pointing to the left: $\hat{n} = (-1, 0)$. Calculate $\vec{v}_{\text{rebound}}$.
* **Calculation:**
  1. $\vec{v} \cdot \hat{n} = (8 \times -1) + (3 \times 0) = -8$.
  2. Reflection:
     $$\vec{v}_{\text{rebound}} = \begin{bmatrix} 8 \\ 3 \end{bmatrix} - 2(-8) \begin{bmatrix} -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 8 \\ 3 \end{bmatrix} + 16 \begin{bmatrix} -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 8 - 16 \\ 3 \end{bmatrix} = \begin{bmatrix} -8 \\ 3 \end{bmatrix}\text{ m/s}$$
* **Notice:** The ball rebounded backward to the left ($-8\text{ m/s}$) while continuing its upward vertical flight ($+3\text{ m/s}$).

---

### Example 6: Laser Reflection off a $45^\circ$ Slanted Mirror
* **Problem:** A laser beam shoots horizontally to the right: $\vec{v} = (10, 0)$. It strikes a $45^\circ$ diagonal mirror whose outward unit normal is $\hat{n} = \left(-\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}\right) \approx (-0.7071, +0.7071)$.
  Calculate the reflected laser beam vector.
* **Step-by-Step Calculation:**
  1. Dot product:
     $$\vec{v} \cdot \hat{n} = (10 \times -0.7071) + (0 \times 0.7071) = -7.071$$
  2. Multiply by $2\hat{n}$:
     $$2(\vec{v} \cdot \hat{n})\hat{n} = 2(-7.071) \begin{bmatrix} -0.7071 \\ +0.7071 \end{bmatrix} = -14.142 \begin{bmatrix} -0.7071 \\ +0.7071 \end{bmatrix} = \begin{bmatrix} +10.0 \\ -10.0 \end{bmatrix}$$
  3. Subtract from original velocity:
     $$\vec{v}_{\text{rebound}} = \begin{bmatrix} 10.0 \\ 0.0 \end{bmatrix} - \begin{bmatrix} +10.0 \\ -10.0 \end{bmatrix} = \begin{bmatrix} 10.0 - 10.0 \\ 0.0 - (-10.0) \end{bmatrix} = \begin{bmatrix} 0.0 \\ +10.0 \end{bmatrix}$$
* **Geometric Miracle:** A horizontal laser hitting a $45^\circ$ mirror bounces **straight up at a $90^\circ$ right angle**! The formula predicted optical physics with zero error.

---

### Example 7: Distance from an Arbitrary Point to a Line
* **Problem:** A ship is located at position $P(4, 6)$. A straight navigational shipping channel passes through the origin $O(0, 0)$ along direction vector $\vec{v} = (4, 3)$. 
  What is the shortest perpendicular distance from the ship to the shipping channel?
* **Method:**
  1. The ship's position vector is $\vec{u} = (4, 6)$.
  2. Find the perpendicular rejection vector $\vec{u}_{\perp} = \vec{u} - \text{proj}_{\vec{v}}\vec{u}$.
  3. Dot product: $\vec{u} \cdot \vec{v} = (4 \times 4) + (6 \times 3) = 16 + 18 = 34$.
  4. $\|\vec{v}\|^2 = 4^2 + 3^2 = 25$.
  5. Projection:
     $$\vec{u}_{\parallel} = \frac{34}{25} \begin{bmatrix} 4 \\ 3 \end{bmatrix} = 1.36 \begin{bmatrix} 4 \\ 3 \end{bmatrix} = \begin{bmatrix} 5.44 \\ 4.08 \end{bmatrix}$$
  6. Rejection:
     $$\vec{u}_{\perp} = \begin{bmatrix} 4 \\ 6 \end{bmatrix} - \begin{bmatrix} 5.44 \\ 4.08 \end{bmatrix} = \begin{bmatrix} -1.44 \\ +1.92 \end{bmatrix}$$
  7. Perpendicular distance:
     $$\|\vec{u}_{\perp}\| = \sqrt{(-1.44)^2 + (1.92)^2} = \sqrt{2.0736 + 3.6864} = \sqrt{5.76} = 2.40\text{ km}$$
* **Conclusion:** The ship is exactly $2.40\text{ km}$ off the center of the shipping channel.

---

### Example 8: Inelastic Rebound with Restitution $e = 0.70$
* **Problem:** A tennis ball strikes the court surface ($\hat{n} = (0, 1)$) with velocity $\vec{v} = (15, -10)\text{ m/s}$. The coefficient of restitution is $e = 0.70$. Find the bounce velocity.
* **Calculation:**
  $$\vec{v} \cdot \hat{n} = (15 \times 0) + (-10 \times 1) = -10$$
  $$\vec{v}_{\text{rebound}} = \vec{v} - (1 + e)(\vec{v} \cdot \hat{n})\hat{n}$$
  $$\vec{v}_{\text{rebound}} = \begin{bmatrix} 15 \\ -10 \end{bmatrix} - (1 + 0.70)(-10) \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 15 \\ -10 \end{bmatrix} + 17 \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 15 \\ +7 \end{bmatrix}\text{ m/s}$$
* **Notice:** Horizontal speed remains $15\text{ m/s}$, but vertical bounce speed is reduced to $70\%$ ($7\text{ m/s}$).

---

### Example 9: Frictionless Player Wall Sliding (Game Engine Code)
* **Problem:** A player runs with velocity vector $\vec{v} = (6, 8)$ directly into a slanted wall with unit normal $\hat{n} = (-0.6, 0.8)$. Compute the sliding velocity vector along the wall surface.
* **Calculation:**
  - Wall sliding corresponds to $e = 0.0$ (cancel all normal velocity into the wall):
    $$\vec{v}_{\text{slide}} = \vec{v} - (\vec{v} \cdot \hat{n})\hat{n}$$
  - $\vec{v} \cdot \hat{n} = (6 \times -0.6) + (8 \times 0.8) = -3.6 + 6.4 = +2.8$.
  - Sliding velocity:
    $$\vec{v}_{\text{slide}} = \begin{bmatrix} 6 \\ 8 \end{bmatrix} - 2.8 \begin{bmatrix} -0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 6 - (-1.68) \\ 8 - 2.24 \end{bmatrix} = \begin{bmatrix} 7.68 \\ 5.76 \end{bmatrix}$$
* **Check Orthogonality:** $\vec{v}_{\text{slide}} \cdot \hat{n} = (7.68 \times -0.6) + (5.76 \times 0.8) = -4.608 + 4.608 = 0.0$.
  The player slides smoothly along the wall with zero penetration!

---

### Example 10: Speed Conservation Proof in Perfect Elastic Bounces
* **Problem:** Prove that the scalar speed before an elastic bounce equals the speed after the bounce: $\|\vec{v}_{\text{rebound}}\| = \|\vec{v}\|$.
* **Algebraic Proof:**
  $$\|\vec{v}_{\text{rebound}}\|^2 = \vec{v}_{\text{rebound}} \cdot \vec{v}_{\text{rebound}}$$
  $$= (\vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}) \cdot (\vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n})$$
  $$= \vec{v} \cdot \vec{v} - 4(\vec{v} \cdot \hat{n})(\vec{v} \cdot \hat{n}) + 4(\vec{v} \cdot \hat{n})^2 (\hat{n} \cdot \hat{n})$$
  Since $\hat{n}$ is a unit vector, $\hat{n} \cdot \hat{n} = 1$:
  $$= \|\vec{v}\|^2 - 4(\vec{v} \cdot \hat{n})^2 + 4(\vec{v} \cdot \hat{n})^2 = \|\vec{v}\|^2$$
  Therefore:
  $$\|\vec{v}_{\text{rebound}}\| = \|\vec{v}\|$$
  Speed and kinetic energy are **strictly conserved**!

---

## 10.8 Debunked Misconceptions & Software Traps

### Misconception 1: "Projection is commutative: $\text{proj}_{\vec{v}}\vec{u} = \text{proj}_{\vec{u}}\vec{v}$."
* **The Fatal Trap:** Absolutely false!
  - $\text{proj}_{\vec{v}}\vec{u}$ points along vector $\vec{v}$.
  - $\text{proj}_{\vec{u}}\vec{v}$ points along vector $\vec{u}$.
  Unless $\vec{u}$ and $\vec{v}$ are parallel, they point in completely different directions!

### Software Trap: Normal Orientation Inversion
If you accidentally compute the reflection using an **inward-pointing normal** instead of an **outward-pointing normal**:
$\vec{v} \cdot \hat{n}$ will have the wrong sign, and the ball will accelerate **INSIDE** the wall instead of bouncing off it, disappearing into the geometry!
Always ensure $\vec{v} \cdot \hat{n} < 0$ before reflecting (the object must be moving *toward* the wall face).

---

## 10.9 Historical Context: Hero of Alexandria & The Law of Reflection

The mathematical study of reflection began in the 1st century CE with the Greek mathematician and engineer **Hero of Alexandria** (c. 10–70 CE).

In his work *Catoptrics* (*On Mirrors*), Hero asked: *Why does light bounce off a mirror such that the angle of incidence equals the angle of reflection?*

Hero proved geometrically that **light always takes the shortest possible physical path** between two points via the mirror! If light bounced at any other angle, the total distance traveled would be longer.

Hero's geometric insight was formalized in vectors 1,800 years later by Pierre de Fermat and Isaac Newton, giving birth to the Vector Reflection Law that powers modern optical ray-tracing in Pixar movies and video game GPU shaders.

---

## 10.10 Chapter 10 Mastery Problem Set

Consolidate your mastery of vector projections and reflections with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** A vector $\vec{u} = (7, 5)$ is projected onto the $X$-axis baseline $\vec{v} = (1, 0)$.
   - What is the vector projection $\text{proj}_{\vec{v}}\vec{u}$?
   - What is the perpendicular rejection vector $\vec{u}_{\perp}$?

2. **[Tier 1 - Class 6]** A ball bounces off a smooth vertical wall with unit normal $\hat{n} = (1, 0)$. Its incoming velocity is $\vec{v} = (-6, 4)\text{ m/s}$.
   - Find the rebound velocity vector $\vec{v}_{\text{rebound}}$.

3. **[Tier 2 - Class 7]** Given $\vec{u} = (6, 2)$ and $\vec{v} = (3, 3)$:
   - Calculate $\vec{u} \cdot \vec{v}$.
   - Calculate $\|\vec{v}\|^2$.
   - Calculate the vector projection $\text{proj}_{\vec{v}}\vec{u}$.

4. **[Tier 2 - Class 7]** A skateboarder rolls down a flat ramp. The ramp surface is defined by vector $\vec{r} = (8, 6)$. Gravity pulls downward with force $\vec{F}_g = (0, -100)\text{ N}$.
   - Calculate the portion of gravity pulling parallel to the ramp: $\vec{F}_{\parallel} = \text{proj}_{\vec{r}}\vec{F}_g$.

5. **[Tier 3 - Class 8]** A laser beam with velocity $\vec{v} = (12, -5)\text{ m/s}$ reflects off a horizontal mirror with unit normal $\hat{n} = (0, 1)$.
   - Calculate $\vec{v}_{\text{rebound}}$.
   - Confirm that the speed before reflection equals the speed after reflection.

6. **[Tier 3 - Class 8]** Find the perpendicular rejection vector $\vec{u}_{\perp}$ for $\vec{u} = (10, 5)$ relative to $\vec{v} = (4, 0)$. Show that $\vec{u}_{\perp} \cdot \vec{v} = 0$.

7. **[Tier 4 - High School]** A billiard ball with velocity $\vec{v} = (4, -8)\text{ m/s}$ collides with a slanted cushion with unit normal $\hat{n} = (0.6, 0.8)$.
   - Calculate $\vec{v} \cdot \hat{n}$.
   - Calculate the rebound velocity vector $\vec{v}_{\text{rebound}}$.

8. **[Tier 4 - High School]** A hiking trail follows the line vector $\vec{L} = (12, 5)\text{ km}$ starting at $O(0, 0)$. A ranger station is located at $R(4, 9)\text{ km}$.
   - Find the closest point $P$ on the trail to the ranger station using vector projection.
   - What is the shortest distance from the ranger station to the trail?

9. **[Tier 5 - University / Game Physics]** In a 2D physics engine, a rubber ball with velocity $\vec{v} = (20, -15)\text{ m/s}$ bounces off a floor with unit normal $\hat{n} = (0, 1)$ and coefficient of restitution $e = 0.80$.
   - Calculate the rebound velocity $\vec{v}_{\text{rebound}}$.
   - Calculate the percentage of kinetic energy lost during the impact:
     $$\text{Loss} = \frac{K_{\text{initial}} - K_{\text{final}}}{K_{\text{initial}}} \times 100\%$$

10. **[Tier 5 - Robotics / Path Planning]** An autonomous robot moves with desired velocity $\vec{v}_{\text{desired}} = (5, 5)\text{ m/s}$. It collides with an immovable wall with unit normal $\hat{n} = (-1, 0)$.
    - Calculate the frictionless sliding velocity $\vec{v}_{\text{slide}} = \vec{v}_{\text{desired}} - (\vec{v}_{\text{desired}} \cdot \hat{n})\hat{n}$.
    - If the robot's wheels experience a kinetic friction coefficient $\mu = 0.20$ opposing this slide, write the net friction deceleration force vector acting on the robot.

---

### Step-by-Step Solutions

#### Solution 1:
- $\text{proj}_{\vec{v}}\vec{u} = (7, 0)$.
- $\vec{u}_{\perp} = (7, 5) - (7, 0) = (0, 5)$.

#### Solution 2:
- $\vec{v} \cdot \hat{n} = (-6 \times 1) + (4 \times 0) = -6$.
- $\vec{v}_{\text{rebound}} = (-6, 4) - 2(-6)(1, 0) = (-6, 4) + (12, 0) = (+6, 4)\text{ m/s}$.

#### Solution 3:
- $\vec{u} \cdot \vec{v} = (6 \times 3) + (2 \times 3) = 18 + 6 = 24$.
- $\|\vec{v}\|^2 = 3^2 + 3^2 = 9 + 9 = 18$.
- Projection:
  $$\text{proj}_{\vec{v}}\vec{u} = \frac{24}{18} \begin{bmatrix} 3 \\ 3 \end{bmatrix} = \frac{4}{3} \begin{bmatrix} 3 \\ 3 \end{bmatrix} = \begin{bmatrix} 4 \\ 4 \end{bmatrix}$$

#### Solution 4:
- $\vec{F}_g \cdot \vec{r} = (0 \times 8) + (-100 \times 6) = -600$.
- $\|\vec{r}\|^2 = 8^2 + 6^2 = 64 + 36 = 100$.
- Parallel force:
  $$\vec{F}_{\parallel} = \frac{-600}{100} \begin{bmatrix} 8 \\ 6 \end{bmatrix} = -6 \begin{bmatrix} 8 \\ 6 \end{bmatrix} = \begin{bmatrix} -48 \\ -36 \end{bmatrix}\text{ N}$$
- Magnitude: $\|\vec{F}_{\parallel}\| = \sqrt{(-48)^2 + (-36)^2} = \sqrt{2304 + 1296} = \sqrt{3600} = 60\text{ N}$ down the ramp.

#### Solution 5:
- $\vec{v} \cdot \hat{n} = (12 \times 0) + (-5 \times 1) = -5$.
- $\vec{v}_{\text{rebound}} = (12, -5) - 2(-5)(0, 1) = (12, -5) + (0, 10) = (12, +5)\text{ m/s}$.
- Speed check:
  $$\|\vec{v}\| = \sqrt{12^2 + (-5)^2} = \sqrt{169} = 13\text{ m/s}$$
  $$\|\vec{v}_{\text{rebound}}\| = \sqrt{12^2 + 5^2} = \sqrt{169} = 13\text{ m/s}$$
  Speed is conserved.

#### Solution 6:
- $\text{proj}_{\vec{v}}\vec{u} = (10, 0)$.
- $\vec{u}_{\perp} = (10, 5) - (10, 0) = (0, 5)$.
- Dot product check: $(0 \times 4) + (5 \times 0) = 0$. Orthogonal!

#### Solution 7:
- $\vec{v} \cdot \hat{n} = (4 \times 0.6) + (-8 \times 0.8) = 2.4 - 6.4 = -4.0$.
- $\vec{v}_{\text{rebound}} = (4, -8) - 2(-4.0)(0.6, 0.8) = (4, -8) + 8.0(0.6, 0.8) = (4, -8) + (4.8, 6.4) = (8.8, -1.6)\text{ m/s}$.

#### Solution 8:
- $\vec{R} \cdot \vec{L} = (4 \times 12) + (9 \times 5) = 48 + 45 = 93$.
- $\|\vec{L}\|^2 = 12^2 + 5^2 = 144 + 25 = 169$.
- Closest point on trail:
  $$P = \frac{93}{169} \begin{bmatrix} 12 \\ 5 \end{bmatrix} \approx 0.5503 \begin{bmatrix} 12 \\ 5 \end{bmatrix} = \begin{bmatrix} 6.6035 \\ 2.7515 \end{bmatrix}\text{ km}$$
- Rejection vector:
  $$\vec{R}_{\perp} = (4, 9) - (6.6035, 2.7515) = (-2.6035, 6.2485)$$
- Shortest distance:
  $$\|\vec{R}_{\perp}\| = \sqrt{(-2.6035)^2 + 6.2485^2} = \sqrt{6.778 + 39.044} = \sqrt{45.822} \approx 6.77\text{ km}$$

#### Solution 9:
- Initial kinetic energy:
  $$K_{\text{initial}} = \frac{1}{2}m (20^2 + (-15)^2) = \frac{1}{2}m (400 + 225) = 312.5 m$$
- Rebound calculation:
  $$\vec{v} \cdot \hat{n} = -15$$
  $$\vec{v}_{\text{rebound}} = (20, -15) - (1 + 0.80)(-15)(0, 1) = (20, -15) + (0, 27) = (20, +12)\text{ m/s}$$
- Final kinetic energy:
  $$K_{\text{final}} = \frac{1}{2}m (20^2 + 12^2) = \frac{1}{2}m (400 + 144) = 272.0 m$$
- Energy Loss percentage:
  $$\text{Loss} = \frac{312.5 - 272.0}{312.5} \times 100\% = \frac{40.5}{312.5} \times 100\% = 12.96\%$$

#### Solution 10:
- $\vec{v} \cdot \hat{n} = (5 \times -1) + (5 \times 0) = -5$.
- Sliding velocity:
  $$\vec{v}_{\text{slide}} = (5, 5) - (-5)(-1, 0) = (5, 5) - (5, 0) = (0, 5)\text{ m/s}$$
  The robot slides strictly upward along the wall at $5\text{ m/s}$.
- Friction opposes the sliding motion: It acts in the direction opposite to $\vec{v}_{\text{slide}}$ (pointing downward: $-\hat{j}$).
  $$\vec{F}_{\text{friction}} = -\mu F_N \hat{j} = -0.20 \times 5.0 \hat{j} = (0, -1.0)\text{ N}$$
