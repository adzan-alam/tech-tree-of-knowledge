# 2D Cartesian Vectors and Vector Algebra

---

## 1. The Epistemological Leap: From Scalar Numbers to Directed Space

### 1.1 The Limitations of Pure Magnitudes
For centuries, classical arithmetic and early algebra operated almost exclusively on **scalars**: quantities completely defined by a single real number representing magnitude (such as temperature $T$, mass $m$, time $t$, or electric charge $q$).

However, the natural world stubbornly refused to be reduced to mere scalars. When an archer releases an arrow, the outcome is governed not just by *how fast* the arrow flies (its scalar speed), but *in what direction* it points. When two workers pull a heavy stone with equal strength, the stone moves forward if they pull together, but remains motionless if they pull in opposite directions.

Before vectors, physicists and mathematicians were forced to write separate, cumbersome scalar equations for each spatial coordinate axis. A single three-dimensional problem required juggling three independent equations, obscuring the underlying geometric invariance of physical laws.

### 1.2 The Evolution of Vector Formalism
The modern concept of a vector emerged through a fascinating historical synthesis:
1. **René Descartes (1637):** Introduced analytic geometry, marrying Euclidean geometry with algebra by representing spatial points as ordered pairs $(x, y)$ in a coordinate plane.
2. **Caspar Wessel (1797) and Jean-Robert Argand (1806):** Represented complex numbers $z = x + iy$ geometrically as directed segments in the 2D plane, discovering that multiplication by $i$ corresponded to a $90^\circ$ counter-clockwise spatial rotation.
3. **William Rowan Hamilton (1843):** Sought an algebra of triplets for 3D space, famously carving the fundamental quaternion equations ($i^2 = j^2 = k^2 = ijk = -1$) into Brougham Bridge in Dublin. Quaternions contained a scalar part and a 3-element "vector" part.
4. **Josiah Willard Gibbs & Oliver Heaviside (1880s):** Extracted and streamlined the vector portion of quaternions into independent vector algebra—introducing the modern **dot product** ($\cdot$) and **cross product** ($\times$) notation used today across physics, engineering, and computer simulation.

---

## 2. First-Principles Formalism: The Vector in $\mathbb{R}^2$

### 2.1 Free Vectors vs. Bound Vectors
In classical mathematics and physics simulation, a distinction is drawn between:
- **Bound (or Position) Vectors:** Vectors anchored to a specific reference origin $O(0, 0)$. They represent the absolute coordinates of an entity: $\vec{r} = (x, y)$.
- **Free Vectors:** Vectors representing pure displacement, velocity, or force. A free vector has a definite magnitude and direction, but **no fixed location in space**. Translating a free vector parallel to itself leaves it completely unchanged.

```
       Y ^
         |                Free Vector v (Displacement)
         |               ●-------------------->●
         |              (x1, y1)              (x2, y2)
         |
         |        Bound Vector r
         |       ●------------->● (x, y)
         |      /
         |     /
         +----+------------------------------------> X
             O(0,0)
```

### 2.2 Algebraic and Geometric Definitions
In the 2D Euclidean vector space $\mathbb{R}^2$, a vector $\vec{v}$ is an ordered pair of real components:

$$ \vec{v} = \begin{bmatrix} v_x \\ v_y \end{bmatrix} = v_x \hat{i} + v_y \hat{j} $$

where the standard orthonormal basis vectors are:
$$ \hat{i} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad \hat{j} = \begin{bmatrix} 0 \\ 1 \end{bmatrix} $$

### 2.3 Magnitude (Euclidean Norm)
By the Pythagorean theorem, the geometric length (magnitude or Euclidean $L^2$-norm) of $\vec{v}$ is:

$$ \|\vec{v}\| = \sqrt{v_x^2 + v_y^2} $$

A vector with magnitude $\|\vec{v}\| = 1$ is termed a **unit vector** (or direction vector), denoted with a hat ($\hat{v}$). Any non-zero vector can be **normalized** into a unit vector:

$$ \hat{v} = \frac{\vec{v}}{\|\vec{v}\|} = \begin{bmatrix} \frac{v_x}{\sqrt{v_x^2 + v_y^2}} \\ \frac{v_y}{\sqrt{v_x^2 + v_y^2}} \end{bmatrix} $$

### 2.4 Vector Addition and Scalar Multiplication
Given vectors $\vec{u} = (u_x, u_y)$, $\vec{v} = (v_x, v_y)$ and scalar $c \in \mathbb{R}$:

1. **Vector Addition (Component-wise & Parallelogram Law):**
   $$ \vec{u} + \vec{v} = \begin{bmatrix} u_x + v_x \\ u_y + v_y \end{bmatrix} $$
   Geometrically, vector addition corresponds to placing the tail of $\vec{v}$ at the tip of $\vec{u}$ (the triangle rule), or constructing the diagonal of the parallelogram formed by $\vec{u}$ and $\vec{v}$.

2. **Scalar Multiplication:**
   $$ c\vec{v} = \begin{bmatrix} c v_x \\ c v_y \end{bmatrix} $$
   Scaling alters the magnitude by $|c|$. If $c > 0$, the direction is preserved; if $c < 0$, the direction is precisely inverted ($180^\circ$ reversal); if $c = 0$, it collapses to the zero vector $\vec{0} = (0, 0)$.

---

## 3. The Inner Product (Dot Product) & Metric Geometry

The dot product is the mathematical bridge linking algebra to geometry, trigonometry, and projection.

### 3.1 Algebraic Definition
For $\vec{u}, \vec{v} \in \mathbb{R}^2$, the dot product is defined as the sum of component products:

$$ \vec{u} \cdot \vec{v} = u_x v_x + u_y v_y $$

### 3.2 Geometric Derivation via the Law of Cosines
Why does this simple algebraic sum equal $\|\vec{u}\| \|\vec{v}\| \cos\theta$? Let us prove it from first principles.

Consider triangle $OAB$ formed by vectors $\vec{u} = \vec{OA}$, $\vec{v} = \vec{OB}$, and the difference vector $\vec{w} = \vec{u} - \vec{v} = \vec{BA}$:

```
                 A (u)
                / \
               /   \  w = u - v
              /     \
             / θ     \
            O---------B (v)
```

By the geometric Law of Cosines for any triangle with sides $a, b, c$ and angle $\theta$ opposite to $c$:
$$ \|\vec{w}\|^2 = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2 \|\vec{u}\| \|\vec{v}\| \cos\theta $$

Now evaluate $\|\vec{w}\|^2$ algebraically using components:
$$ \|\vec{w}\|^2 = \|\vec{u} - \vec{v}\|^2 = (u_x - v_x)^2 + (u_y - v_y)^2 $$
$$ = (u_x^2 - 2u_x v_x + v_x^2) + (u_y^2 - 2u_y v_y + v_y^2) $$
$$ = (u_x^2 + u_y^2) + (v_x^2 + v_y^2) - 2(u_x v_x + u_y v_y) $$
$$ = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2(\vec{u} \cdot \vec{v}) $$

Equating the geometric and algebraic formulations:
$$ \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2 \|\vec{u}\| \|\vec{v}\| \cos\theta = \|\vec{u}\|^2 + \|\vec{v}\|^2 - 2(\vec{u} \cdot \vec{v}) $$

Cancelling identical terms and dividing by $-2$:
$$ \mathbf{\vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos\theta} \quad \blacksquare $$

### 3.3 Core Properties & Geometric Interpretations
1. **Orthogonality Test:** Two non-zero vectors are perpendicular ($\theta = 90^\circ$ or $270^\circ$) if and only if:
   $$ \vec{u} \cdot \vec{v} = 0 $$
2. **Direction Alignment:**
   - $\vec{u} \cdot \vec{v} > 0 \iff \theta \in [0^\circ, 90^\circ)$ (Acute: pointing generally in the same direction).
   - $\vec{u} \cdot \vec{v} = 0 \iff \theta = 90^\circ$ (Perpendicular: zero mutual influence).
   - $\vec{u} \cdot \vec{v} < 0 \iff \theta \in (90^\circ, 180^\circ]$ (Obtuse: pointing in opposing directions).
3. **Vector Projection & Orthogonal Decomposition:**
   Any vector $\vec{u}$ can be decomposed into a component parallel to $\vec{v}$ ($\vec{u}_{\parallel}$) and a component perpendicular to $\vec{v}$ ($\vec{u}_{\perp}$):

   $$ \text{Scalar projection: } s = \text{comp}_{\vec{v}}(\vec{u}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|} = \vec{u} \cdot \hat{v} $$
   $$ \text{Vector projection: } \vec{u}_{\parallel} = \text{proj}_{\vec{v}}(\vec{u}) = \left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|^2}\right) \vec{v} = (\vec{u} \cdot \hat{v})\hat{v} $$
   $$ \text{Orthogonal rejection: } \vec{u}_{\perp} = \vec{u} - \vec{u}_{\parallel} $$

---

## 4. The 2D Pseudo-Cross Product (Perp-Dot Product)

While the full vector cross product $\vec{a} \times \vec{b}$ is strictly defined only in 3D and 7D spaces, 2D geometry possesses an analogous operator known as the **perp-dot product** or **2D cross product scalar**:

$$ \vec{u} \times_{\text{2D}} \vec{v} = u_x v_y - u_y v_x $$

### 4.1 Geometric Meaning: Signed Area and Orientation
1. **Magnitude:** $|\vec{u} \times_{\text{2D}} \vec{v}| = \|\vec{u}\| \|\vec{v}\| \sin\theta$, which equals the exact area of the parallelogram spanned by $\vec{u}$ and $\vec{v}$.
2. **Sign (Winding Order / Turn Direction):**
   - If $\vec{u} \times_{\text{2D}} \vec{v} > 0$, turning from $\vec{u}$ to $\vec{v}$ is **counter-clockwise** (a "left turn").
   - If $\vec{u} \times_{\text{2D}} \vec{v} < 0$, turning from $\vec{u}$ to $\vec{v}$ is **clockwise** (a "right turn").
   - If $\vec{u} \times_{\text{2D}} \vec{v} = 0$, the vectors are **collinear** (parallel or anti-parallel).

```
          v           u x v > 0                 u           u x v < 0
          ^          (Counter-Clockwise)        ^          (Clockwise)
          |    /                                |    \
          |   /                                 |     \
          |  /                                  |      \
          | / θ                                 | θ     \
          +---------> u                         +---------> v
```

---

## 5. Numerical Traps & Computational Implementation Realities

When implementing vector mathematics in physics engines and game systems, naive mathematical formulas fail due to IEEE-754 floating-point arithmetic.

### 5.1 The Zero-Division Normalization Trap
Normalizing a vector requires dividing by its length. If $\|\vec{v}\| = 0$ (or is extremely close to zero, such as $10^{-16}$), division yields `NaN` or `Infinity`, causing simulation crashes.
*Rule:* Always guard normalization with a small machine epsilon ($\epsilon = 10^{-8}$):
```typescript
function normalize(v: Vector2D): Vector2D {
  const lenSq = v.x * v.x + v.y * v.y;
  if (lenSq < 1e-12) return new Vector2D(0, 0); // Graceful fallback
  const invLen = 1 / Math.sqrt(lenSq);
  return new Vector2D(v.x * invLen, v.y * invLen);
}
```

### 5.2 The Arccos Out-of-Domain Trap
When computing the angle between two unit vectors using $\theta = \arccos(\hat{u} \cdot \hat{v})$, slight floating-point imprecision can produce a dot product of `1.0000000000000002`. In JavaScript, `Math.acos(1.0000000000000002)` produces `NaN`!
*Rule:* Always clamp the argument of $\arccos$ strictly to $[-1.0, 1.0]$.

---

## 6. Multi-Tiered Worked Examples

### Level 1: Velocity Resolution and Normalization
A projectile is fired with speed $v = 100 \text{ m/s}$ at an elevation angle $\theta = 60^\circ$ relative to the ground.
1. Determine Cartesian velocity components $(v_x, v_y)$.
2. Compute the unit direction vector $\hat{v}$.

**Step-by-step Solution:**
$$ v_x = v \cos(60^\circ) = 100 \times 0.5 = 50.0 \text{ m/s} $$
$$ v_y = v \sin(60^\circ) = 100 \times \frac{\sqrt{3}}{2} \approx 86.6025 \text{ m/s} $$
$$ \vec{v} = \begin{bmatrix} 50.0 \\ 86.6025 \end{bmatrix} \text{ m/s} $$

Normalizing to unit direction:
$$ \|\vec{v}\| = \sqrt{50.0^2 + 86.6025^2} = \sqrt{2500 + 7500} = \sqrt{10000} = 100.0 \text{ m/s} $$
$$ \hat{v} = \frac{\vec{v}}{\|\vec{v}\|} = \begin{bmatrix} 0.5 \\ 0.8660 \end{bmatrix} $$

---

### Level 2: Surface Reflection in Physics Engines
A billiard ball moving with velocity $\vec{v} = (10, -5)$ strikes a wall with unit outward surface normal $\hat{n} = (0, 1)$ (a horizontal floor). Assuming a perfectly elastic collision with no friction, calculate the reflected velocity $\vec{v}'$.

**First-Principles Derivation:**
Decompose incoming velocity $\vec{v}$ into parallel and normal components relative to the surface normal $\hat{n}$:
$$ \vec{v}_{\text{normal}} = (\vec{v} \cdot \hat{n})\hat{n} $$
$$ \vec{v}_{\text{tangent}} = \vec{v} - \vec{v}_{\text{normal}} $$

In an elastic frictionless collision, the tangential motion continues unimpeded, while the normal motion reverses direction:
$$ \vec{v}' = \vec{v}_{\text{tangent}} - \vec{v}_{\text{normal}} = (\vec{v} - \vec{v}_{\text{normal}}) - \vec{v}_{\text{normal}} = \mathbf{\vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}} $$

**Execution:**
1. Compute $\vec{v} \cdot \hat{n}$:
   $$ \vec{v} \cdot \hat{n} = (10 \times 0) + (-5 \times 1) = -5 $$
2. Compute $2(\vec{v} \cdot \hat{n})\hat{n}$:
   $$ 2 \times (-5) \times \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ -10 \end{bmatrix} $$
3. Compute reflected velocity $\vec{v}'$:
   $$ \vec{v}' = \begin{bmatrix} 10 \\ -5 \end{bmatrix} - \begin{bmatrix} 0 \\ -10 \end{bmatrix} = \begin{bmatrix} 10 \\ 5 \end{bmatrix} $$
The ball continues rightward at $10 \text{ m/s}$ and bounces upward at $+5 \text{ m/s}$, preserving total kinetic energy: $\|\vec{v}'\|^2 = 10^2 + 5^2 = 125 = \|\vec{v}\|^2$.

---

### Level 3: Steering Behavior & Turn Orientation
An autonomous drone at position $P(2, 3)$ is travelling along facing direction $\vec{d} = (1, 0)$ (due East). A sensor detects an obstacle at target position $T(5, 7)$. Determine:
1. The displacement vector $\vec{s}$ to the target.
2. Whether the drone must steer **left** (counter-clockwise) or **right** (clockwise) to face the obstacle.
3. The exact angle $\theta$ in degrees by which the drone must turn.

**Execution:**
1. Target displacement vector:
   $$ \vec{s} = T - P = (5 - 2, 7 - 3) = (3, 4) $$
2. Turn orientation test via 2D cross product ($\vec{d} \times_{\text{2D}} \vec{s}$):
   $$ \vec{d} \times_{\text{2D}} \vec{s} = (d_x s_y - d_y s_x) = (1 \times 4 - 0 \times 3) = +4 $$
   Since the cross product is **positive ($+4 > 0$)**, the target lies to the **left**; the drone must execute a **counter-clockwise turn**.
3. Turning angle $\theta$:
   $$ \|\vec{d}\| = 1, \quad \|\vec{s}\| = \sqrt{3^2 + 4^2} = 5 $$
   $$ \vec{d} \cdot \vec{s} = (1 \times 3) + (0 \times 4) = 3 $$
   $$ \cos\theta = \frac{\vec{d} \cdot \vec{s}}{\|\vec{d}\| \|\vec{s}\|} = \frac{3}{1 \times 5} = 0.6 $$
   $$ \theta = \arccos(0.6) \approx 0.9273 \text{ rad} \approx 53.13^\circ $$
The drone must turn $53.13^\circ$ counter-clockwise.

---

## 7. Production-Ready Computational Engine: Vector2D Class

```typescript
/**
 * Sovereign 2D Vector Library
 * Robust, zero-dependency, allocation-optimized implementation for physics & graphics.
 */
export class Vector2D {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // Immutability helpers
  public clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  public add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  public subtract(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  public scale(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  public dot(v: Vector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 2D Pseudo-Cross Product (Perp-Dot product)
   * Returns positive for CCW turn (v is to the left of this), negative for CW.
   */
  public cross(v: Vector2D): number {
    return this.x * v.y - this.y * v.x;
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Safe normalization preventing NaN crashes upon zero vectors.
   */
  public normalize(epsilon = 1e-10): Vector2D {
    const lenSq = this.lengthSquared();
    if (lenSq < epsilon * epsilon) {
      return new Vector2D(0, 0);
    }
    const invLen = 1 / Math.sqrt(lenSq);
    return new Vector2D(this.x * invLen, this.y * invLen);
  }

  /**
   * Calculates angle between two vectors in radians, strictly clamped to avoid NaN.
   */
  public angleTo(v: Vector2D): number {
    const magProduct = this.length() * v.length();
    if (magProduct < 1e-12) return 0;
    const cosTheta = Math.max(-1, Math.min(1, this.dot(v) / magProduct));
    return Math.acos(cosTheta);
  }

  /**
   * Reflects this velocity vector across a surface with unit normal n.
   * v' = v - 2(v · n)n
   */
  public reflect(normal: Vector2D): Vector2D {
    const d = this.dot(normal);
    return this.subtract(normal.scale(2 * d));
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** What happens to the dot product $\vec{u} \cdot \vec{v}$ if vector $\vec{u}$ is rotated by $180^\circ$ while keeping $\vec{v}$ constant?
   - **Answer:** Since rotating $\vec{u}$ by $180^\circ$ inverts its direction ($\vec{u}' = -\vec{u}$), the new dot product becomes $\vec{u}' \cdot \vec{v} = (-\vec{u}) \cdot \vec{v} = -(\vec{u} \cdot \vec{v})$.
2. **Question:** If $\vec{u} \cdot \vec{v} = 0$, does this necessarily mean that $\vec{u}$ and $\vec{v}$ are perpendicular?
   - **Answer:** Not necessarily; one or both of the vectors could be the zero vector $\vec{0} = (0, 0)$, which has zero magnitude and no defined direction. Orthogonality implies non-zero vectors.
3. **Question:** Why is $\vec{v} - 2(\vec{v} \cdot \hat{n})\hat{n}$ valid only when $\hat{n}$ is a unit vector?
   - **Answer:** If $\hat{n}$ is not normalized ($\|\hat{n}\| \neq 1$), the scalar projection $(\vec{v} \cdot \hat{n})$ scales by $\|\hat{n}\|$, and multiplying again by $\hat{n}$ scales by $\|\hat{n}\|^2$, causing an unphysical amplification or damping of the reflected velocity.
