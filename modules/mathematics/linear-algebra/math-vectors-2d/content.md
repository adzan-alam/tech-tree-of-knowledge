# 2D Cartesian Vectors and Vector Algebra

## 1. Conceptual Foundations & Intuitive Overview
In physical and computational worlds, scalar quantities (like temperature, mass, and energy) are completely described by a single magnitude. However, quantities that describe directional action—such as displacement, velocity, acceleration, and force—require both **magnitude** and **direction**.

A two-dimensional vector $\vec{v}$ in a Cartesian coordinate system is an ordered pair of real numbers that represents a displacement from an origin $(0, 0)$ to a point $(v_x, v_y)$:

$$ \vec{v} = \begin{bmatrix} v_x \\ v_y \end{bmatrix} = v_x \hat{i} + v_y \hat{j} $$

where $\hat{i} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ and $\hat{j} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$ are standard orthonormal basis vectors.

---

## 2. Mathematical Formalism

### 2.1 Magnitude (Euclidean Norm)
By the Pythagorean theorem, the Euclidean norm (magnitude) $\|\vec{v}\|$ of a vector $\vec{v} = (v_x, v_y)$ is given by:

$$ \|\vec{v}\| = \sqrt{v_x^2 + v_y^2} $$

A **unit vector** (normalized direction vector) $\hat{v}$ has magnitude $1$ and points in the same direction:

$$ \hat{v} = \frac{\vec{v}}{\|\vec{v}\|} = \left( \frac{v_x}{\sqrt{v_x^2 + v_y^2}}, \frac{v_y}{\sqrt{v_x^2 + v_y^2}} \right), \quad \text{for } \|\vec{v}\| \neq 0 $$

### 2.2 Vector Addition and Scalar Multiplication
Given vectors $\vec{u} = (u_x, u_y)$ and $\vec{v} = (v_x, v_y)$ and scalar $c \in \mathbb{R}$:

$$ \vec{u} + \vec{v} = (u_x + v_x, u_y + v_y) $$
$$ c\vec{v} = (c v_x, c v_y) $$

### 2.3 Dot Product (Inner Product)
The dot product $\vec{u} \cdot \vec{v}$ maps two vectors to a single scalar:

$$ \vec{u} \cdot \vec{v} = u_x v_x + u_y v_y $$

Geometrically, the dot product connects the lengths to the enclosed angle $\theta$:

$$ \vec{u} \cdot \vec{v} = \|\vec{u}\| \|\vec{v}\| \cos\theta $$

From this identity:
1. **Orthogonality:** $\vec{u} \perp \vec{v} \iff \vec{u} \cdot \vec{v} = 0$ (for non-zero vectors).
2. **Scalar Projection of $\vec{u}$ onto $\vec{v}$:**
   $$ \text{proj}_{\vec{v}}(\vec{u}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{v}\|} $$

---

## 3. Worked Examples

### Example 1: Velocity Resolution and Normalization
A projectile is fired with speed $v = 50 \text{ m/s}$ at an elevation angle $\theta = 30^\circ$ relative to the horizontal ground.
1. Determine the horizontal ($v_x$) and vertical ($v_y$) velocity components.
2. Verify that $\|\vec{v}\| = 50 \text{ m/s}$.

**Solution:**
$$ v_x = v \cos(30^\circ) = 50 \times \frac{\sqrt{3}}{2} \approx 43.301 \text{ m/s} $$
$$ v_y = v \sin(30^\circ) = 50 \times \frac{1}{2} = 25.0 \text{ m/s} $$

Verifying magnitude:
$$ \|\vec{v}\| = \sqrt{(43.301)^2 + (25.0)^2} = \sqrt{1875 + 625} = \sqrt{2500} = 50.0 \text{ m/s} $$

---

## 4. Interactive Simulation & Practical Computation

In a 2D physics engine, vector math is executed millions of times per second. Below is a minimal, production-grade 2D Vector class:

```javascript
class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  scale(s) {
    return new Vector2D(this.x * s, this.y * s);
  }

  magnitude() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    const mag = this.magnitude();
    return mag > 0 ? new Vector2D(this.x / mag, this.y / mag) : new Vector2D(0, 0);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
}
```
