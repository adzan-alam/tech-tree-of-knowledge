# Chapter 6: The Vector Cross Product: Handedness and Orthogonal Generation

> *"The scalar product is a peace treaty between two vectors, collapsing them into a single mutual number; the vector cross product is an explosive third dimension, born perpendicular to both, demanding a right hand to claim its domain."*  
> — **Oliver Heaviside**, *Electromagnetic Theory* (1893)

---

### Section 6.1 The Dimensional Anomaly: Why the Cross Product Exists in 3D (and 7D)

In elementary vector arithmetic, students often assume that the "cross product" is a universal operation that exists in all dimensional spaces $\mathbb{R}^n$. This is a profound misconception.

In two-dimensional space $\mathbb{R}^2$, given two non-parallel vectors $\mathbf{a}$ and $\mathbf{b}$, any vector perpendicular to both would have to point *out of the 2D plane* into a third dimension—meaning the operation cannot produce an output vector that remains within $\mathbb{R}^2$. In four-dimensional space $\mathbb{R}^4$, the set of all vectors perpendicular to two linearly independent vectors is not a 1D line, but an entire *two-dimensional plane* of orthogonal directions; hence, two vectors alone cannot uniquely specify a third vector up to a single sign choice!

In modern differential geometry and normed division algebra (Hurwitz's 1898 theorem on composition algebras), a bilinear binary operation $\times: \mathbb{R}^n \times \mathbb{R}^n \to \mathbb{R}^n$ satisfying:
1. Orthogonality: $(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{u} = 0$ and $(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{v} = 0$
2. Norm preservation: $\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2$

exists **only** in dimensions **$n = 0, 1, 3,$ and $7$**!
- In dimension 0 and 1, the product is trivial or zero.
- In dimension 3, it arises from the imaginary part of Hamilton's **quaternions** ($\mathbb{H}$).
- In dimension 7, it arises from the imaginary part of Graves-Cayley **octonions** ($\mathbb{O}$).

Three-dimensional space $\mathbb{R}^3$ is uniquely privileged: it is the only non-trivial associative division-algebra space where two vectors uniquely define a mutually perpendicular third vector.

---

### Section 6.2 Formal Definition via $3 \times 3$ Determinant Expansion

Let two vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$ be specified in standard Cartesian components:
$$\mathbf{u} = \begin{bmatrix} u_x \\ u_y \\ u_z \end{bmatrix}, \quad \mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$$

The **vector cross product** $\mathbf{u} \times \mathbf{v}$ is formally defined as the symbolic expansion of a $3 \times 3$ determinant whose first row contains the standard basis vectors $\{\mathbf{i}, \mathbf{j}, \mathbf{k}\}$:

$$\mathbf{u} \times \mathbf{v} \equiv \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ u_x & u_y & u_z \\ v_x & v_y & v_z \end{vmatrix}$$

Expanding along the top row by minors (cofactor expansion):
$$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} u_y & u_z \\ v_y & v_z \end{vmatrix} \mathbf{i} - \begin{vmatrix} u_x & u_z \\ v_x & v_z \end{vmatrix} \mathbf{j} + \begin{vmatrix} u_x & u_y \\ v_x & v_y \end{vmatrix} \mathbf{k}$$

Evaluating each $2 \times 2$ determinant:
$$\begin{vmatrix} u_y & u_z \\ v_y & v_z \end{vmatrix} = u_y v_z - u_z v_y$$
$$-\begin{vmatrix} u_x & u_z \\ v_x & v_z \end{vmatrix} = -(u_x v_z - u_z v_x) = u_z v_x - u_x v_z$$
$$\begin{vmatrix} u_x & u_y \\ v_x & v_y \end{vmatrix} = u_x v_y - u_y v_x$$

Collecting into coordinate components:
$$\mathbf{u} \times \mathbf{v} = \begin{bmatrix} u_y v_z - u_z v_y \\ u_z v_x - u_x v_z \\ u_x v_y - u_y v_x \end{bmatrix}$$

#### Cyclic Index Memory Pattern:
Notice the elegant cyclic permutation of the coordinate indices $(x, y, z) \to (y, z, x) \to (z, x, y)$:
- $x$-component: uses indices $(y, z)$
- $y$-component: uses indices $(z, x)$
- $z$-component: uses indices $(x, y)$

In tensor index notation with Levi-Civita permutation tensor $\epsilon_{ijk}$:
$$(\mathbf{u} \times \mathbf{v})_i = \sum_{j=1}^3 \sum_{k=1}^3 \epsilon_{ijk} u_j v_k$$
where $\epsilon_{ijk} = +1$ for even permutations $(1,2,3), (2,3,1), (3,1,2)$, $\epsilon_{ijk} = -1$ for odd permutations $(1,3,2), (2,1,3), (3,2,1)$, and $0$ if any two indices match.

---

### Section 6.3 Geometric Magnitude and Direction: The Right-Hand Rule

The cross product produces a vector with two distinct geometric characteristics:

```
                  u x v
                    ^
                    |
                    |
                    + - - - - - - +
                   /             /
                  /             /
                 /             /
                +-------------> v
               /  theta
              /
             v u
```

#### 1. Magnitude: Area of the Spanned Parallelogram
The Euclidean norm of the cross product is given by:
$$\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\| \|\mathbf{v}\| \sin\theta$$
where $\theta \in [0, \pi]$ is the interior angle between $\mathbf{u}$ and $\mathbf{v}$.

*Rigorous Proof (Lagrange's Identity):*
Let us compute $\|\mathbf{u} \times \mathbf{v}\|^2$:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = (u_y v_z - u_z v_y)^2 + (u_z v_x - u_x v_z)^2 + (u_x v_y - u_y v_x)^2$$
Expanding each binomial:
$$= (u_y^2 v_z^2 - 2 u_y v_z u_z v_y + u_z^2 v_y^2) + (u_z^2 v_x^2 - 2 u_z v_x u_x v_z + u_x^2 v_z^2) + (u_x^2 v_y^2 - 2 u_x v_y u_y v_x + u_y^2 v_x^2)$$

Now consider the product of squared norms minus the squared dot product:
$$\|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2 = (u_x^2 + u_y^2 + u_z^2)(v_x^2 + v_y^2 + v_z^2) - (u_x v_x + u_y v_y + u_z v_z)^2$$
Expanding both terms and simplifying shows that all identical square products $u_x^2 v_x^2 + u_y^2 v_y^2 + u_z^2 v_z^2$ cancel, leaving exactly the same nine terms:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2$$

Since $\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 \cos^2\theta = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 (1 - \cos^2\theta) = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 \sin^2\theta$$
Taking the principal square root (noting that for $\theta \in [0, \pi]$, $\sin\theta \ge 0$):
$$\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\| \|\mathbf{v}\| \sin\theta \quad \blacksquare$$

Because the base of the parallelogram spanned by $\mathbf{u}$ and $\mathbf{v}$ has length $\|\mathbf{u}\|$, and the perpendicular altitude has length $h = \|\mathbf{v}\|\sin\theta$, the magnitude $\|\mathbf{u} \times \mathbf{v}\|$ represents **the exact geometric area of the parallelogram** formed by $\mathbf{u}$ and $\mathbf{v}$!

#### 2. Direction: Orthogonality and the Right-Hand Rule
The resulting vector $\mathbf{u} \times \mathbf{v}$ is perpendicular to both $\mathbf{u}$ and $\mathbf{v}$:
$$(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{u} = (u_y v_z - u_z v_y) u_x + (u_z v_x - u_x v_z) u_y + (u_x v_y - u_y v_x) u_z$$
$$= u_x u_y v_z - u_x u_z v_y + u_y u_z v_x - u_x u_y v_z + u_z u_x v_y - u_y u_z v_x = 0$$
Similarly, $(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{v} = 0$.

Since $\mathbf{u} \times \mathbf{v}$ is perpendicular to the plane containing $\mathbf{u}$ and $\mathbf{v}$, there are two possible opposite directions along that normal line. In a right-handed coordinate system, the choice is governed by the **Right-Hand Rule**:
- Point the fingers of your right hand along vector $\mathbf{u}$.
- Curl your fingers toward vector $\mathbf{v}$ through the interior angle $\theta$.
- Your extended right thumb points in the exact direction of $\mathbf{u} \times \mathbf{v}$.

---

### Section 6.4 Key Algebraic Properties

The cross product has algebraic properties that differ sharply from ordinary scalar arithmetic:

1. **Anti-Commutativity:**
   $$\mathbf{u} \times \mathbf{v} = -(\mathbf{v} \times \mathbf{u})$$
   *Consequence:* Swapping operands negates the resulting vector (it points in the opposite direction).
   *Special Case:* Any vector crossed with itself yields the zero vector:
   $$\mathbf{u} \times \mathbf{u} = \mathbf{0}$$

2. **Non-Associativity:**
   In general:
   $$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) \ne (\mathbf{u} \times \mathbf{v}) \times \mathbf{w}$$
   *Counterexample:* Let $\mathbf{u} = \mathbf{i}$, $\mathbf{v} = \mathbf{i}$, $\mathbf{w} = \mathbf{j}$.
   $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{i} \times (\mathbf{i} \times \mathbf{j}) = \mathbf{i} \times \mathbf{k} = -\mathbf{j}$.
   $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w} = (\mathbf{i} \times \mathbf{i}) \times \mathbf{j} = \mathbf{0} \times \mathbf{j} = \mathbf{0}$.
   $-\mathbf{j} \ne \mathbf{0}$.

3. **Distributivity over Vector Addition:**
   $$\mathbf{u} \times (\mathbf{v} + \mathbf{w}) = (\mathbf{u} \times \mathbf{v}) + (\mathbf{u} \times \mathbf{w})$$
   $$(\mathbf{u} + \mathbf{v}) \times \mathbf{w} = (\mathbf{u} \times \mathbf{w}) + (\mathbf{v} \times \mathbf{w})$$

4. **Compatibility with Scalar Multiplication:**
   $$(\alpha \mathbf{u}) \times \mathbf{v} = \mathbf{u} \times (\alpha \mathbf{v}) = \alpha (\mathbf{u} \times \mathbf{v})$$

5. **Cross Products of Standard Basis Vectors:**
   $$\mathbf{i} \times \mathbf{j} = \mathbf{k}, \quad \mathbf{j} \times \mathbf{k} = \mathbf{i}, \quad \mathbf{k} \times \mathbf{i} = \mathbf{j}$$
   $$\mathbf{j} \times \mathbf{i} = -\mathbf{k}, \quad \mathbf{k} \times \mathbf{j} = -\mathbf{i}, \quad \mathbf{i} \times \mathbf{k} = -\mathbf{j}$$
   $$\mathbf{i} \times \mathbf{i} = \mathbf{j} \times \mathbf{j} = \mathbf{k} \times \mathbf{k} = \mathbf{0}$$

---

### Section 6.5 Collinearity Detection and Numerical Epsilon Safeguards

Since $\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\|\|\mathbf{v}\|\sin\theta$, the cross product vanishes ($\mathbf{u} \times \mathbf{v} = \mathbf{0}$) if and only if:
1. $\mathbf{u} = \mathbf{0}$ or $\mathbf{v} = \mathbf{0}$, or
2. $\sin\theta = 0 \implies \theta = 0$ or $\theta = \pi$.

That is, **the cross product of two non-zero vectors is zero if and only if they are collinear (parallel or antiparallel)**.

#### Numerical Collinearity in Game Engines:
In computer software, checking for collinearity using exact equality `(cross.length() === 0)` is dangerous due to floating-point imprecision. Two vectors that are mathematically collinear may produce a tiny residual norm like $1.4 \times 10^{-16}$.
Furthermore, normalizing such a near-zero vector produces division by zero or massive numerical instability:
$$\hat{\mathbf{n}} = \frac{\mathbf{u} \times \mathbf{v}}{\|\mathbf{u} \times \mathbf{v}\|}$$

Every robust physics and geometry engine must use a squared-norm threshold:
```typescript
function safeCrossNormalize(u: Vector3, v: Vector3, fallback: Vector3): Vector3 {
  const cx = u.y * v.z - u.z * v.y;
  const cy = u.z * v.x - u.x * v.z;
  const cz = u.x * v.y - u.y * v.x;
  
  const lenSq = cx * cx + cy * cy + cz * cz;
  const EPSILON_SQ = 1e-12; // 1e-6 threshold for float32, 1e-12 for float64
  
  if (lenSq < EPSILON_SQ) {
    // Vectors are collinear! Return user-supplied fallback orthogonal axis
    return fallback.clone();
  }
  
  const invLen = 1.0 / Math.sqrt(lenSq);
  return new Vector3(cx * invLen, cy * invLen, cz * invLen);
}
```

---

### Section 6.6 Computing 3D Triangle Areas and Surface Normals

In 3D mesh processing and rendering pipelines, virtually all geometry consists of triangular faces.
Let a triangle in 3D space have vertices $A, B, C \in \mathbb{R}^3$.

```
               C
              / \
             /   \
            /     \
           A ------> B
```

The edge vectors sharing vertex $A$ are:
$$\mathbf{e}_1 = \vec{AB} = B - A$$
$$\mathbf{e}_2 = \vec{AC} = C - A$$

1. **Parallelogram Area:**
   The parallelogram formed by $\vec{AB}$ and $\vec{AC}$ has area:
   $$\text{Area}_{\text{parallelogram}} = \|\vec{AB} \times \vec{AC}\|$$
2. **Triangle Area:**
   Since any triangle is exactly half of the spanned parallelogram:
   $$\text{Area}_{\triangle ABC} = \frac{1}{2} \|\vec{AB} \times \vec{AC}\|$$
3. **Face Normal Vector:**
   The unnormalized normal vector is:
   $$\mathbf{N}_{\text{unnormalized}} = \vec{AB} \times \vec{AC}$$
   And the unit face normal is:
   $$\hat{\mathbf{N}} = \frac{\vec{AB} \times \vec{AC}}{\|\vec{AB} \times \vec{AC}\|}$$

*Winding Order Note:*
If the vertices are ordered counter-clockwise (CCW) $A \to B \to C$ as viewed from the outside, $\hat{\mathbf{N}}$ points directly outward. If ordered clockwise (CW) $A \to C \to B$, the normal points inward:
$$\vec{AC} \times \vec{AB} = -(\vec{AB} \times \vec{AC})$$

---

### Section 6.7 Physics Applications: Torque, Angular Momentum, and Lorentz Force

The cross product is the mathematical language of spatial rotation and rotational dynamics in physics:

#### 1. Torque ($\boldsymbol{\tau}$)
When a force $\mathbf{F}$ is applied at position $\mathbf{r}$ relative to a pivot point, the resulting rotational torque vector is:
$$\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$$
- Magnitude: $\|\boldsymbol{\tau}\| = \|\mathbf{r}\| \|\mathbf{F}\| \sin\theta = r F_{\perp}$. Only the component of force perpendicular to the lever arm creates rotational acceleration.
- Direction: The vector points along the axis of rotation dictated by the right-hand rule.

#### 2. Angular Momentum ($\mathbf{L}$)
For a particle of mass $m$ with linear momentum $\mathbf{p} = m\mathbf{v}$ located at position $\mathbf{r}$:
$$\mathbf{L} = \mathbf{r} \times \mathbf{p} = m(\mathbf{r} \times \mathbf{v})$$
By Newton's second rotational law, the time rate of change of angular momentum equals the net external torque:
$$\frac{d\mathbf{L}}{dt} = \boldsymbol{\tau}_{\text{net}}$$

#### 3. Tangential Velocity of a Rotating Rigid Body
If a rigid body rotates about an axis with angular velocity vector $\boldsymbol{\omega}$ (whose direction specifies the axis of rotation and whose magnitude $\|\boldsymbol{\omega}\|$ is the angular speed in rad/s), the linear tangential velocity $\mathbf{v}$ of a point at position vector $\mathbf{r}$ is:
$$\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$$

#### 4. The Lorentz Magnetic Force
A charged particle carrying electric charge $q$ moving with velocity $\mathbf{v}$ through a magnetic field $\mathbf{B}$ experiences a deflecting Lorentz force:
$$\mathbf{F}_{\text{mag}} = q(\mathbf{v} \times \mathbf{B})$$
Because $\mathbf{F}_{\text{mag}}$ is always perpendicular to velocity $\mathbf{v}$ ($(\mathbf{v} \times \mathbf{B}) \cdot \mathbf{v} = 0$), a purely magnetic field does zero mechanical work on the particle ($W = \int \mathbf{F} \cdot d\mathbf{r} = \int \mathbf{F} \cdot \mathbf{v} dt = 0$). It changes the particle's direction of motion into a spiral helix, but never changes its kinetic energy!

---

### Section 6.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 6.1: Basic Cross Product Calculation
**Problem:** Compute $\mathbf{u} \times \mathbf{v}$ for $\mathbf{u} = \begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 5 \\ 6 \\ 7 \end{bmatrix}$.

**Solution:**
Expand the determinant:
$$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 3 & 4 \\ 5 & 6 & 7 \end{vmatrix}$$
$$= \mathbf{i} \begin{vmatrix} 3 & 4 \\ 6 & 7 \end{vmatrix} - \mathbf{j} \begin{vmatrix} 2 & 4 \\ 5 & 7 \end{vmatrix} + \mathbf{k} \begin{vmatrix} 2 & 3 \\ 5 & 6 \end{vmatrix}$$
$$= \mathbf{i} ((3)(7) - (4)(6)) - \mathbf{j} ((2)(7) - (4)(5)) + \mathbf{k} ((2)(6) - (3)(5))$$
$$= \mathbf{i} (21 - 24) - \mathbf{j} (14 - 20) + \mathbf{k} (12 - 15)$$
$$= -3\mathbf{i} - (-6)\mathbf{j} - 3\mathbf{k} = \begin{bmatrix} -3 \\ 6 \\ -3 \end{bmatrix}$$
*Verification of Orthogonality:*
$$\mathbf{u} \cdot (\mathbf{u} \times \mathbf{v}) = (2)(-3) + (3)(6) + (4)(-3) = -6 + 18 - 12 = 0 \quad \checkmark$$
$$\mathbf{v} \cdot (\mathbf{u} \times \mathbf{v}) = (5)(-3) + (6)(6) + (7)(-3) = -15 + 36 - 21 = 0 \quad \checkmark$$

---

#### Example 6.2: Anti-Commutativity Demonstration
**Problem:** For the same vectors in Example 6.1, compute $\mathbf{v} \times \mathbf{u}$ and verify anti-commutativity.

**Solution:**
$$\mathbf{v} \times \mathbf{u} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 5 & 6 & 7 \\ 2 & 3 & 4 \end{vmatrix}$$
$$= \mathbf{i}((6)(4) - (7)(3)) - \mathbf{j}((5)(4) - (7)(2)) + \mathbf{k}((5)(3) - (6)(2))$$
$$= \mathbf{i}(24 - 21) - \mathbf{j}(20 - 14) + \mathbf{k}(15 - 12)$$
$$= 3\mathbf{i} - 6\mathbf{j} + 3\mathbf{k} = \begin{bmatrix} 3 \\ -6 \\ 3 \end{bmatrix}$$
Comparing with Example 6.1:
$$\mathbf{v} \times \mathbf{u} = \begin{bmatrix} 3 \\ -6 \\ 3 \end{bmatrix} = -\begin{bmatrix} -3 \\ 6 \\ -3 \end{bmatrix} = -(\mathbf{u} \times \mathbf{v}) \quad \checkmark$$

---

#### Example 6.3: Surface Normal and Area of a 3D Triangle
**Problem:** A triangle in 3D space has vertices $A(1, -1, 0)$, $B(2, 1, -1)$, and $C(-1, 1, 2)$.
1. Find the outward unit normal vector $\hat{\mathbf{N}}$ assuming counter-clockwise order $A \to B \to C$.
2. Compute the exact surface area of the triangle.

**Solution:**
1. Compute edge vectors:
   $$\vec{AB} = B - A = \begin{bmatrix} 2 - 1 \\ 1 - (-1) \\ -1 - 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix}$$
   $$\vec{AC} = C - A = \begin{bmatrix} -1 - 1 \\ 1 - (-1) \\ 2 - 0 \end{bmatrix} = \begin{bmatrix} -2 \\ 2 \\ 2 \end{bmatrix}$$
2. Compute unnormalized cross product:
   $$\vec{AB} \times \vec{AC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & -1 \\ -2 & 2 & 2 \end{vmatrix}$$
   $$= \mathbf{i}((2)(2) - (-1)(2)) - \mathbf{j}((1)(2) - (-1)(-2)) + \mathbf{k}((1)(2) - (2)(-2))$$
   $$= \mathbf{i}(4 + 2) - \mathbf{j}(2 - 2) + \mathbf{k}(2 + 4)$$
   $$= 6\mathbf{i} - 0\mathbf{j} + 6\mathbf{k} = \begin{bmatrix} 6 \\ 0 \\ 6 \end{bmatrix}$$
3. Compute magnitude:
   $$\|\vec{AB} \times \vec{AC}\| = \sqrt{6^2 + 0^2 + 6^2} = \sqrt{36 + 36} = \sqrt{72} = 6\sqrt{2}$$
4. Unit normal:
   $$\hat{\mathbf{N}} = \frac{1}{6\sqrt{2}} \begin{bmatrix} 6 \\ 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{2} \\ 0 \\ 1/\sqrt{2} \end{bmatrix}$$
5. Triangle area:
   $$\text{Area} = \frac{1}{2} \|\vec{AB} \times \vec{AC}\| = \frac{1}{2}(6\sqrt{2}) = 3\sqrt{2} \approx 4.24264 \text{ units}^2$$

---

#### Example 6.4: Tangential Velocity of a Rotating Rigid Body
**Problem:** An industrial centrifuge rotates with angular velocity vector $\boldsymbol{\omega} = \begin{bmatrix} 0 \\ 0 \\ 150 \end{bmatrix} \text{ rad/s}$ about the $z$-axis. A sample vial is mounted at position $\mathbf{r} = \begin{bmatrix} 0.4 \\ 0.3 \\ 0.1 \end{bmatrix} \text{ m}$ from the origin. Find the instantaneous linear velocity vector $\mathbf{v}$ and its speed.

**Solution:**
1. Compute $\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$:
   $$\mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 0 & 150 \\ 0.4 & 0.3 & 0.1 \end{vmatrix}$$
   $$= \mathbf{i}((0)(0.1) - (150)(0.3)) - \mathbf{j}((0)(0.1) - (150)(0.4)) + \mathbf{k}((0)(0.3) - (0)(0.4))$$
   $$= \mathbf{i}(0 - 45) - \mathbf{j}(0 - 60) + \mathbf{k}(0)$$
   $$= \begin{bmatrix} -45 \\ 60 \\ 0 \end{bmatrix} \text{ m/s}$$
2. Speed:
   $$\|\mathbf{v}\| = \sqrt{(-45)^2 + 60^2 + 0^2} = \sqrt{2025 + 3600} = \sqrt{5625} = 75.0 \text{ m/s}$$
*Physical Intuition:* The sample rotates purely in the horizontal $xy$-plane at height $z = 0.1 \text{ m}$ with radius $R = \sqrt{0.4^2 + 0.3^2} = 0.5 \text{ m}$. Speed is $v = \omega R = 150 \times 0.5 = 75 \text{ m/s} \quad \checkmark$.

---

#### Example 6.5: Mechanical Torque Calculation
**Problem:** A robotic arm pivot is located at origin $(0, 0, 0)$. A force $\mathbf{F} = \begin{bmatrix} 10 \\ -20 \\ 30 \end{bmatrix} \text{ N}$ is exerted at the end-effector positioned at $\mathbf{r} = \begin{bmatrix} 1.2 \\ 0.5 \\ -0.8 \end{bmatrix} \text{ m}$. Calculate the resulting torque vector $\boldsymbol{\tau}$ and the total torque magnitude.

**Solution:**
1. Torque vector $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$:
   $$\boldsymbol{\tau} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1.2 & 0.5 & -0.8 \\ 10 & -20 & 30 \end{vmatrix}$$
   $$\tau_x = (0.5)(30) - (-0.8)(-20) = 15 - 16 = -1.0 \text{ N}\cdot\text{m}$$
   $$\tau_y = -((1.2)(30) - (-0.8)(10)) = -(36 - (-8)) = -(36 + 8) = -44.0 \text{ N}\cdot\text{m}$$
   $$\tau_z = (1.2)(-20) - (0.5)(10) = -24 - 5 = -29.0 \text{ N}\cdot\text{m}$$
   $$\boldsymbol{\tau} = \begin{bmatrix} -1.0 \\ -44.0 \\ -29.0 \end{bmatrix} \text{ N}\cdot\text{m}$$
2. Magnitude:
   $$\|\boldsymbol{\tau}\| = \sqrt{(-1)^2 + (-44)^2 + (-29)^2} = \sqrt{1 + 1936 + 841} = \sqrt{2778} \approx 52.7067 \text{ N}\cdot\text{m}$$

---

#### Example 6.6: Detecting Collinearity with Threshold
**Problem:** Determine if $\mathbf{u} = \begin{bmatrix} 1.5 \\ -3.0 \\ 4.5 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} -1.0 \\ 2.0 \\ -3.0 \end{bmatrix}$ are parallel using the cross product.

**Solution:**
Compute $\mathbf{u} \times \mathbf{v}$:
$$\mathbf{u} \times \mathbf{v} = \begin{bmatrix} (-3.0)(-3.0) - (4.5)(2.0) \\ (4.5)(-1.0) - (1.5)(-3.0) \\ (1.5)(2.0) - (-3.0)(-1.0) \end{bmatrix} = \begin{bmatrix} 9.0 - 9.0 \\ -4.5 - (-4.5) \\ 3.0 - 3.0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
Since $\mathbf{u} \times \mathbf{v} = \mathbf{0}$, the vectors are collinear.
Furthermore, $\mathbf{u} = -1.5 \mathbf{v}$, so they point in exactly opposite directions ($\theta = 180^\circ$).

---

#### Example 6.7: Lorentz Magnetic Force on an Electron
**Problem:** An ion with charge $q = 3.2 \times 10^{-19} \text{ C}$ travels with velocity $\mathbf{v} = \begin{bmatrix} 10^5 \\ 2 \times 10^5 \\ 0 \end{bmatrix} \text{ m/s}$ through a magnetic field $\mathbf{B} = \begin{bmatrix} 0 \\ 0.5 \\ 1.0 \end{bmatrix} \text{ T}$. Calculate the magnetic force vector acting on the ion.

**Solution:**
1. Cross product $\mathbf{v} \times \mathbf{B}$:
   $$\mathbf{v} \times \mathbf{B} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 10^5 & 2 \times 10^5 & 0 \\ 0 & 0.5 & 1.0 \end{vmatrix}$$
   $$(\mathbf{v} \times \mathbf{B})_x = (2 \times 10^5)(1.0) - (0)(0.5) = 2 \times 10^5$$
   $$(\mathbf{v} \times \mathbf{B})_y = -((10^5)(1.0) - (0)(0)) = -10^5$$
   $$(\mathbf{v} \times \mathbf{B})_z = (10^5)(0.5) - (2 \times 10^5)(0) = 5 \times 10^4$$
   $$\mathbf{v} \times \mathbf{B} = \begin{bmatrix} 200000 \\ -100000 \\ 50000 \end{bmatrix} \text{ m}\cdot\text{T/s}$$
2. Multiply by charge $q$:
   $$\mathbf{F} = (3.2 \times 10^{-19}) \begin{bmatrix} 2 \times 10^5 \\ -10^5 \\ 0.5 \times 10^5 \end{bmatrix} = \begin{bmatrix} 6.4 \times 10^{-14} \\ -3.2 \times 10^{-14} \\ 1.6 \times 10^{-14} \end{bmatrix} \text{ N}$$

---

#### Example 6.8: Skew-Symmetric Cross Product Matrix Operator
**Problem:** In 3D physics engines, the cross product $\boldsymbol{\omega} \times \mathbf{r}$ is often represented as a matrix-vector multiplication $[\boldsymbol{\omega}]_{\times} \mathbf{r}$.
For $\boldsymbol{\omega} = \begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix}$, derive the $3 \times 3$ skew-symmetric matrix $[\boldsymbol{\omega}]_{\times}$.

**Solution:**
From the component definition of $\boldsymbol{\omega} \times \mathbf{r}$:
$$\boldsymbol{\omega} \times \mathbf{r} = \begin{bmatrix} 0\cdot r_x - \omega_z r_y + \omega_y r_z \\ \omega_z r_x + 0\cdot r_y - \omega_x r_z \\ -\omega_y r_x + \omega_x r_y + 0\cdot r_z \end{bmatrix}$$
Expressing this as a linear transformation on $\mathbf{r} = \begin{bmatrix} r_x \\ r_y \\ r_z \end{bmatrix}$:
$$\boldsymbol{\omega} \times \mathbf{r} = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix} \begin{bmatrix} r_x \\ r_y \\ r_z \end{bmatrix}$$
The matrix:
$$[\boldsymbol{\omega}]_{\times} = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$
Notice that $[\boldsymbol{\omega}]_{\times}^T = -[\boldsymbol{\omega}]_{\times}$ (it is skew-symmetric). This Lie algebra representation ($\mathfrak{so}(3)$) is the cornerstone of modern rigid body kinematics.

---

#### Example 6.9: Parallelogram Area and Height
**Problem:** Given adjacent sides $\mathbf{u} = \begin{bmatrix} 3 \\ 0 \\ 0 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 4 \\ 0 \end{bmatrix}$ in the $xy$-plane:
1. Find the area using the cross product.
2. Find the altitude $h$ of the parallelogram perpendicular to side $\mathbf{u}$.

**Solution:**
1. Cross product:
   $$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 3 & 0 & 0 \\ 1 & 4 & 0 \end{vmatrix} = \mathbf{k}((3)(4) - (0)(1)) = 12 \mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 12 \end{bmatrix}$$
   $$\text{Area} = \|\mathbf{u} \times \mathbf{v}\| = 12$$
2. Altitude $h$:
   $$\text{Area} = \|\mathbf{u}\| \times h \implies h = \frac{\text{Area}}{\|\mathbf{u}\|}$$
   $$\|\mathbf{u}\| = \sqrt{3^2 + 0^2 + 0^2} = 3$$
   $$h = \frac{12}{3} = 4$$
Notice that $\mathbf{v}$ has $y$-coordinate $4$, which is indeed the perpendicular height!

---

#### Example 6.10: Construction of an Orthogonal Vector to Any Non-Zero Vector
**Problem:** Write a robust mathematical procedure to construct a non-zero vector $\mathbf{p}$ perpendicular to an arbitrary non-zero vector $\mathbf{v} \in \mathbb{R}^3$ using the cross product.

**Solution:**
If we pick a fixed arbitrary vector $\mathbf{a}$ and compute $\mathbf{p} = \mathbf{v} \times \mathbf{a}$, $\mathbf{p}$ is guaranteed perpendicular to $\mathbf{v}$. However, if $\mathbf{v}$ happens to be parallel to $\mathbf{a}$, $\mathbf{v} \times \mathbf{a} = \mathbf{0}$!
To guarantee a non-zero perpendicular vector:
1. Compare $|v_x|$ and $|v_y|$ with $|v_z|$:
   - If $|v_x| < |v_y|$ and $|v_x| < |v_z|$: $\mathbf{v}$ is furthest from the $x$-axis $\mathbf{i} = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T$. Choose $\mathbf{a} = \mathbf{i}$.
   - Otherwise, choose $\mathbf{a} = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$.
2. Compute $\mathbf{p} = \mathbf{v} \times \mathbf{a}$.
3. Because $\mathbf{v}$ and $\mathbf{a}$ cannot be parallel, $\|\mathbf{p}\| > 0$.
*Example test:* Let $\mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ 5 \end{bmatrix}$. Smallest component is $x$ ($0 < 5$).
Take $\mathbf{a} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$.
$$\mathbf{p} = \begin{bmatrix} 0 \\ 0 \\ 5 \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 5 \\ 0 \end{bmatrix}$$
Check: $\mathbf{v} \cdot \mathbf{p} = (0)(0) + (0)(5) + (5)(0) = 0 \quad \checkmark$.

---

### Section 6.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 6.1
**Problem:** Compute the cross product $\mathbf{a} \times \mathbf{b}$ for $\mathbf{a} = \begin{bmatrix} 1 \\ 0 \\ -2 \end{bmatrix}$ and $\mathbf{b} = \begin{bmatrix} 3 \\ -1 \\ 4 \end{bmatrix}$.
**Solution:**
$$\mathbf{a} \times \mathbf{b} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 0 & -2 \\ 3 & -1 & 4 \end{vmatrix}$$
$$= \mathbf{i}((0)(4) - (-2)(-1)) - \mathbf{j}((1)(4) - (-2)(3)) + \mathbf{k}((1)(-1) - (0)(3))$$
$$= \mathbf{i}(0 - 2) - \mathbf{j}(4 + 6) + \mathbf{k}(-1 - 0) = \begin{bmatrix} -2 \\ -10 \\ -1 \end{bmatrix}$$

---

#### Exercise 6.2
**Problem:** Verify that the cross product of any vector $\mathbf{v} \in \mathbb{R}^3$ with the zero vector is the zero vector.
**Solution:**
$$\mathbf{v} \times \mathbf{0} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ v_x & v_y & v_z \\ 0 & 0 & 0 \end{vmatrix}$$
Expanding across the row of zeros gives $0\mathbf{i} + 0\mathbf{j} + 0\mathbf{k} = \mathbf{0} \quad \blacksquare$

---

#### Exercise 6.3
**Problem:** Show that $\mathbf{i} \times (\mathbf{j} \times \mathbf{k}) \ne (\mathbf{i} \times \mathbf{j}) \times \mathbf{k}$ or determine if they are equal in this specific case.
**Solution:**
1. Left side:
   $\mathbf{j} \times \mathbf{k} = \mathbf{i}$
   $\mathbf{i} \times (\mathbf{j} \times \mathbf{k}) = \mathbf{i} \times \mathbf{i} = \mathbf{0}$
2. Right side:
   $\mathbf{i} \times \mathbf{j} = \mathbf{k}$
   $(\mathbf{i} \times \mathbf{j}) \times \mathbf{k} = \mathbf{k} \times \mathbf{k} = \mathbf{0}$
In this particular symmetric case, both evaluate to $\mathbf{0}$. (However, associativity fails in general, as demonstrated in Section 6.4).

---

#### Exercise 6.4
**Problem:** Find the area of the triangle with vertices $P(0, 0, 0)$, $Q(3, 0, 0)$, and $R(0, 4, 0)$.
**Solution:**
$$\vec{PQ} = \begin{bmatrix} 3 \\ 0 \\ 0 \end{bmatrix}, \quad \vec{PR} = \begin{bmatrix} 0 \\ 4 \\ 0 \end{bmatrix}$$
$$\vec{PQ} \times \vec{PR} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 3 & 0 & 0 \\ 0 & 4 & 0 \end{vmatrix} = 12 \mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 12 \end{bmatrix}$$
$$\text{Area} = \frac{1}{2} \|\vec{PQ} \times \vec{PR}\| = \frac{1}{2}(12) = 6 \text{ units}^2$$
*Check via elementary geometry:* Right triangle with base 3 and height 4: $\frac{1}{2}(3)(4) = 6 \quad \checkmark$.

---

#### Exercise 6.5
**Problem:** Find a unit vector orthogonal to both $\mathbf{u} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$.
**Solution:**
1. Cross product:
   $$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 1 & 1 \\ 1 & 2 & 3 \end{vmatrix} = \mathbf{i}(3 - 2) - \mathbf{j}(3 - 1) + \mathbf{k}(2 - 1) = \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix}$$
2. Magnitude:
   $$\|\mathbf{u} \times \mathbf{v}\| = \sqrt{1^2 + (-2)^2 + 1^2} = \sqrt{1 + 4 + 1} = \sqrt{6}$$
3. Unit vector:
   $$\hat{\mathbf{n}} = \begin{bmatrix} 1/\sqrt{6} \\ -2/\sqrt{6} \\ 1/\sqrt{6} \end{bmatrix}$$

---

#### Exercise 6.6
**Problem:** If $\|\mathbf{u}\| = 5$, $\|\mathbf{v}\| = 8$, and $\mathbf{u} \cdot \mathbf{v} = 24$, find $\|\mathbf{u} \times \mathbf{v}\|$ without finding the coordinates of $\mathbf{u}$ or $\mathbf{v}$.
**Solution:**
Use Lagrange's Identity:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2$$
$$\|\mathbf{u} \times \mathbf{v}\|^2 = (5^2)(8^2) - 24^2 = (25)(64) - 576 = 1600 - 576 = 1024$$
$$\|\mathbf{u} \times \mathbf{v}\| = \sqrt{1024} = 32$$

---

#### Exercise 6.7
**Problem:** Prove that $(\mathbf{u} - \mathbf{v}) \times (\mathbf{u} + \mathbf{v}) = 2(\mathbf{u} \times \mathbf{v})$.
**Solution:**
Expand using distributivity:
$$(\mathbf{u} - \mathbf{v}) \times (\mathbf{u} + \mathbf{v}) = \mathbf{u} \times \mathbf{u} + \mathbf{u} \times \mathbf{v} - \mathbf{v} \times \mathbf{u} - \mathbf{v} \times \mathbf{v}$$
Since $\mathbf{u} \times \mathbf{u} = \mathbf{0}$ and $\mathbf{v} \times \mathbf{v} = \mathbf{0}$:
$$= \mathbf{0} + \mathbf{u} \times \mathbf{v} - (-(\mathbf{u} \times \mathbf{v})) - \mathbf{0} = \mathbf{u} \times \mathbf{v} + \mathbf{u} \times \mathbf{v} = 2(\mathbf{u} \times \mathbf{v}) \quad \blacksquare$$

---

#### Exercise 6.8
**Problem:** In a physics engine, a rigid body spins with angular velocity $\boldsymbol{\omega} = \begin{bmatrix} 2 \\ -1 \\ 3 \end{bmatrix} \text{ rad/s}$. Find the velocity of the point located at $\mathbf{r} = \begin{bmatrix} 1 \\ 4 \\ -2 \end{bmatrix} \text{ m}$.
**Solution:**
$$\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & -1 & 3 \\ 1 & 4 & -2 \end{vmatrix}$$
$$v_x = (-1)(-2) - (3)(4) = 2 - 12 = -10$$
$$v_y = -((2)(-2) - (3)(1)) = -(-4 - 3) = 7$$
$$v_z = (2)(4) - (-1)(1) = 8 - (-1) = 9$$
$$\mathbf{v} = \begin{bmatrix} -10 \\ 7 \\ 9 \end{bmatrix} \text{ m/s}$$

---

#### Exercise 6.9
**Problem:** Prove that if $\mathbf{u} \times \mathbf{v} = \mathbf{u} \times \mathbf{w}$ and $\mathbf{u} \ne \mathbf{0}$, it does NOT necessarily imply $\mathbf{v} = \mathbf{w}$.
**Solution:**
$$\mathbf{u} \times \mathbf{v} - \mathbf{u} \times \mathbf{w} = \mathbf{0} \implies \mathbf{u} \times (\mathbf{v} - \mathbf{w}) = \mathbf{0}$$
The cross product vanishes if and only if $(\mathbf{v} - \mathbf{w})$ is parallel to $\mathbf{u}$, i.e., $\mathbf{v} - \mathbf{w} = c \mathbf{u}$ for some scalar $c \in \mathbb{R}$.
Therefore, $\mathbf{v} = \mathbf{w} + c \mathbf{u}$.
As long as $c \ne 0$, $\mathbf{v} \ne \mathbf{w}$, yet their cross products with $\mathbf{u}$ are identical. (The cross product cannot be inverted uniquely; it has a non-trivial null space along $\mathbf{u}$). $\blacksquare$

---

#### Exercise 6.10
**Problem:** Three points in space are given by $A(2, 1, 3)$, $B(4, 2, 5)$, and $C(6, 3, 7)$. Determine whether these three points are collinear.
**Solution:**
Compute displacement vectors:
$$\vec{AB} = \begin{bmatrix} 4 - 2 \\ 2 - 1 \\ 5 - 3 \end{bmatrix} = \begin{bmatrix} 2 \\ 1 \\ 2 \end{bmatrix}$$
$$\vec{AC} = \begin{bmatrix} 6 - 2 \\ 3 - 1 \\ 7 - 3 \end{bmatrix} = \begin{bmatrix} 4 \\ 2 \\ 4 \end{bmatrix}$$
Compute their cross product:
$$\vec{AB} \times \vec{AC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 1 & 2 \\ 4 & 2 & 4 \end{vmatrix}$$
$$= \mathbf{i}((1)(4) - (2)(2)) - \mathbf{j}((2)(4) - (2)(4)) + \mathbf{k}((2)(2) - (1)(4))$$
$$= \mathbf{i}(4 - 4) - \mathbf{j}(8 - 8) + \mathbf{k}(4 - 4) = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
Since $\vec{AB} \times \vec{AC} = \mathbf{0}$, the points $A, B, C$ lie on the exact same straight line (they are collinear).
