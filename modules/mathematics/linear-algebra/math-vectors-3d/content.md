# 3D Vectors, Cross Products, and Spatial Geometry

---

## 1. The Epistemological Leap: Stepping from Flatland into 3D Space

### 1.1 The Coordinate Freedom of Three Dimensions
In Edwin A. Abbott's 1884 novella *Flatland*, a two-dimensional square cannot comprehend the concept of "up" until a three-dimensional sphere lifts him out of the plane. 

In two dimensions, every direction can be represented by a single scalar angle $\theta$ in the plane. In three dimensions, however, direction requires **two spherical angles** ($\theta, \phi$) or three Cartesian components $(x, y, z)$. Furthermore, while 2D rotations occur around a point, 3D rotations occur around an **axis of rotation**—a line in space.

### 1.2 Right-Handed Coordinate Systems
Physical conventions define the orientation of axes via the **Right-Hand Rule**:
1. Point your right index finger along the $+x$-axis (Right).
2. Point your right middle finger along the $+y$-axis (Up).
3. Your right thumb naturally points along the $+z$-axis (Towards you).

```
          +Y (Up)
            |
            |     +Z (Forward / Towards viewer)
            |    /
            |   /
            |  /
            +--+------------------------> +X (Right)
           O(0,0,0)
```

In standard scientific computing and OpenGL/Vulkan graphics conventions, right-handed systems ensure that all rotational dynamics and electromagnetic cross products maintain consistent physical orientations.

---

## 2. First-Principles Formalism: The Vector in $\mathbb{R}^3$

### 2.1 Components and Orthonormal Basis
In the 3D Euclidean space $\mathbb{R}^3$, an arbitrary vector $\vec{v}$ is an ordered triplet of real numbers:
$$ \vec{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix} = v_x \hat{i} + v_y \hat{j} + v_z \hat{k} $$
where the standard basis unit vectors are:
$$ \hat{i} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \hat{j} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \hat{k} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} $$

### 2.2 Magnitude (3D Euclidean Norm)
Applying the Pythagorean theorem in three dimensions:
$$ \|\vec{v}\| = \sqrt{v_x^2 + v_y^2 + v_z^2} $$
The unit direction vector is normalized by dividing by its magnitude:
$$ \hat{v} = \frac{\vec{v}}{\|\vec{v}\|} = \begin{bmatrix} v_x / \|\vec{v}\| \\ v_y / \|\vec{v}\| \\ v_z / \|\vec{v}\| \end{bmatrix}, \quad \text{for } \|\vec{v}\| \neq 0 $$

### 2.3 The 3D Dot Product (Inner Product)
$$ \vec{u} \cdot \vec{v} = u_x v_x + u_y v_y + u_z v_z = \|\vec{u}\| \|\vec{v}\| \cos\theta $$
As in 2D, $\vec{u} \perp \vec{v} \iff \vec{u} \cdot \vec{v} = 0$ for non-zero vectors.

---

## 3. The Vector Cross Product ($\vec{u} \times \vec{v}$)

Unlike the dot product (which maps two vectors to a scalar), the **cross product** maps two 3D vectors to a **third vector perpendicular to both**:

$$ \vec{w} = \vec{u} \times \vec{v} $$

### 3.1 Formal Determinant Definition
The cross product is computed as the formal determinant of a $3 \times 3$ symbolic matrix:
$$ \vec{u} \times \vec{v} = \det \begin{bmatrix} \hat{i} & \hat{j} & \hat{k} \\ u_x & u_y & u_z \\ v_x & v_y & v_z \end{bmatrix} $$

Expanding by minors along the top row:
$$ \vec{u} \times \vec{v} = \hat{i} \det \begin{bmatrix} u_y & u_z \\ v_y & v_z \end{bmatrix} - \hat{j} \det \begin{bmatrix} u_x & u_z \\ v_x & v_z \end{bmatrix} + \hat{k} \det \begin{bmatrix} u_x & u_y \\ v_x & v_y \end{bmatrix} $$
$$ \mathbf{\vec{u} \times \vec{v} = \begin{bmatrix} u_y v_z - u_z v_y \\ u_z v_x - u_x v_z \\ u_x v_y - u_y v_x \end{bmatrix}} $$

### 3.2 Geometric Properties of the Cross Product
1. **Magnitude Equals Spanned Parallelogram Area:**
   $$ \|\vec{u} \times \vec{v}\| = \|\vec{u}\| \|\vec{v}\| \sin\theta $$
   The area of the triangle formed by $\vec{u}$ and $\vec{v}$ is exactly half this magnitude:
   $$ \text{Area}_{\text{triangle}} = \frac{1}{2} \|\vec{u} \times \vec{v}\| $$
2. **Direction (The Right-Hand Rule):**
   Curl the fingers of your right hand from $\vec{u}$ towards $\vec{v}$ through the enclosed angle $\theta$; your extended thumb points in the exact direction of $\vec{u} \times \vec{v}$.
3. **Anti-Commutativity:**
   Swapping the operands reverses the direction:
   $$ \mathbf{\vec{u} \times \vec{v} = -(\vec{v} \times \vec{u})} $$
4. **Self Cross Product:**
   Any vector crossed with itself (or any parallel vector) yields the zero vector:
   $$ \vec{u} \times \vec{u} = \vec{0} $$

```
              u x v
                ^
                |
                |  / v
                | / θ
                |/_____> u
```

---

## 4. The Triple Scalar Product & Volume

The combination of dot and cross products yields the **Triple Scalar Product**:
$$ \vec{u} \cdot (\vec{v} \times \vec{w}) = \det \begin{bmatrix} u_x & u_y & u_z \\ v_x & v_y & v_z \\ w_x & w_y & w_z \end{bmatrix} $$

### Geometric Significance:
1. **Volume of Parallelepiped:** The absolute value $|\vec{u} \cdot (\vec{v} \times \vec{w})|$ equals the exact volume of the 3D parallelepiped spanned by the three vectors!
2. **Coplanarity Test:** Three vectors $\vec{u}, \vec{v}, \vec{w}$ lie in the same flat plane if and only if:
   $$ \vec{u} \cdot (\vec{v} \times \vec{w}) = 0 $$

---

## 5. Planes and Surface Normals in 3D Space

A flat plane in 3D space is defined by a reference point $P_0(x_0, y_0, z_0)$ and a **unit surface normal vector** $\hat{n} = (n_x, n_y, n_z)$ perpendicular to the plane.

### 5.1 The Point-Normal Implicit Plane Equation
Any point $P(x, y, z)$ lies on the plane if and only if the displacement vector $(P - P_0)$ is orthogonal to normal $\hat{n}$:
$$ \hat{n} \cdot (P - P_0) = 0 $$
$$ n_x(x - x_0) + n_y(y - y_0) + n_z(z - z_0) = 0 $$
Expanding into standard algebraic form:
$$ n_x x + n_y y + n_z z + D = 0, \quad \text{where } D = -\hat{n} \cdot P_0 $$

### 5.2 Deriving the Normal of a 3D Triangle
Given three non-collinear vertices $A, B, C$ forming a triangle in counter-clockwise order:
1. Construct two edge vectors sharing vertex $A$:
   $$ \vec{e}_1 = B - A, \quad \vec{e}_2 = C - A $$
2. The face normal is the normalized cross product:
   $$ \hat{n} = \frac{\vec{e}_1 \times \vec{e}_2}{\|\vec{e}_1 \times \vec{e}_2\|} $$

---

## 6. Multi-Tiered Worked Examples

### Level 1: Cross Product and Triangle Area
Given vertices $A(1, 0, 0)$, $B(0, 2, 0)$, and $C(0, 0, 3)$ in $\mathbb{R}^3$:
1. Calculate the cross product $\vec{e}_1 \times \vec{e}_2$.
2. Compute the area of triangle $ABC$.
3. Find the unit surface normal $\hat{n}$.

**Step-by-step Solution:**
1. Edge vectors:
   $$ \vec{e}_1 = B - A = (-1, 2, 0) $$
   $$ \vec{e}_2 = C - A = (-1, 0, 3) $$
2. Cross product:
   $$ \vec{e}_1 \times \vec{e}_2 = \det \begin{bmatrix} \hat{i} & \hat{j} & \hat{k} \\ -1 & 2 & 0 \\ -1 & 0 & 3 \end{bmatrix} $$
   $$ = \hat{i}(2 \times 3 - 0 \times 0) - \hat{j}((-1)(3) - 0(-1)) + \hat{k}((-1)(0) - 2(-1)) $$
   $$ = \hat{i}(6) - \hat{j}(-3) + \hat{k}(2) = \begin{bmatrix} 6 \\ 3 \\ 2 \end{bmatrix} $$
3. Magnitude and Area:
   $$ \|\vec{e}_1 \times \vec{e}_2\| = \sqrt{6^2 + 3^2 + 2^2} = \sqrt{36 + 9 + 4} = \sqrt{49} = 7.0 $$
   $$ \text{Area}_{\text{triangle}} = \frac{1}{2}(7.0) = \mathbf{3.5 \text{ units}^2} $$
4. Unit normal:
   $$ \hat{n} = \frac{(6, 3, 2)}{7} = \begin{bmatrix} \mathbf{6/7} \\ \mathbf{3/7} \\ \mathbf{2/7} \end{bmatrix} $$

---

### Level 2: Point-to-Plane Signed Distance
Find the shortest perpendicular distance from query point $Q(4, 5, 6)$ to the plane with equation $2x - y + 2z - 5 = 0$.

**Step-by-step Solution:**
1. Identify normal vector components: $\vec{n} = (2, -1, 2)$ and $D = -5$.
2. Normalize normal vector:
   $$ \|\vec{n}\| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{4 + 1 + 4} = \sqrt{9} = 3 $$
   $$ \hat{n} = \left(\frac{2}{3}, -\frac{1}{3}, \frac{2}{3}\right), \quad D_{\text{norm}} = -\frac{5}{3} $$
3. Signed distance formula:
   $$ d = \hat{n} \cdot Q + D_{\text{norm}} = \frac{2(4) - 1(5) + 2(6) - 5}{3} = \frac{8 - 5 + 12 - 5}{3} = \frac{10}{3} \approx \mathbf{3.333 \text{ m}} $$
Point $Q$ lies $\frac{10}{3} \text{ m}$ above the plane along the normal direction.

---

### Level 3: 3D Ray-Plane Intersection
A physics ray originates at $P_0(0, 10, 0)$ with unit direction $\vec{d} = (0, -0.7071, 0.7071)$.  
It fires towards an inclined plane defined by point $A(0, 0, 5)$ and surface normal $\hat{n} = (0, 0.6, 0.8)$.  
Find the exact hit point coordinate in 3D world space.

**Step-by-step Solution:**
1. Ray equation: $P(t) = P_0 + t\vec{d}$.
2. Plane equation: $\hat{n} \cdot (P(t) - A) = 0$.
3. Substitute ray equation into plane equation:
   $$ \hat{n} \cdot (P_0 + t\vec{d} - A) = 0 $$
   $$ \hat{n} \cdot (P_0 - A) + t(\hat{n} \cdot \vec{d}) = 0 $$
   $$ t = \frac{\hat{n} \cdot (A - P_0)}{\hat{n} \cdot \vec{d}} $$
4. Compute terms:
   $$ A - P_0 = (0, 0 - 10, 5 - 0) = (0, -10, 5) $$
   $$ \hat{n} \cdot (A - P_0) = (0)(0) + (0.6)(-10) + (0.8)(5) = -6 + 4 = -2 $$
   $$ \hat{n} \cdot \vec{d} = (0)(0) + (0.6)(-0.7071) + (0.8)(0.7071) = -0.42426 + 0.56568 = +0.14142 $$
5. Solve for $t$:
   $$ t = \frac{-2}{0.14142} \approx -14.14 $$
Since $t < 0$, the plane lies *behind* the ray origin; the ray does not strike the plane going forward.

---

## 7. Production-Ready Computational Engine: Vector3D Class

```typescript
export class Vector3D {
  public x: number;
  public y: number;
  public z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public clone(): Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  public add(v: Vector3D): Vector3D {
    return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public subtract(v: Vector3D): Vector3D {
    return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  public scale(s: number): Vector3D {
    return new Vector3D(this.x * s, this.y * s, this.z * s);
  }

  public dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Vector Cross Product (u x v)
   * Yields a vector orthogonal to both u and v via right-hand rule.
   */
  public cross(v: Vector3D): Vector3D {
    return new Vector3D(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  public normalize(epsilon = 1e-12): Vector3D {
    const lenSq = this.lengthSquared();
    if (lenSq < epsilon * epsilon) {
      return new Vector3D(0, 0, 0);
    }
    const invLen = 1 / Math.sqrt(lenSq);
    return new Vector3D(this.x * invLen, this.y * invLen, this.z * invLen);
  }

  /**
   * Triple scalar product: this · (v x w)
   * Equals signed volume of parallelepiped.
   */
  public tripleProduct(v: Vector3D, w: Vector3D): number {
    return this.dot(v.cross(w));
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** What is the geometric value of $\hat{i} \times \hat{j}$, $\hat{j} \times \hat{k}$, and $\hat{k} \times \hat{i}$ in a right-handed coordinate system?
   - **Answer:** $\hat{i} \times \hat{j} = \hat{k}$, $\hat{j} \times \hat{k} = \hat{i}$, and $\hat{k} \times \hat{i} = \hat{j}$. Reversing order negates the sign: $\hat{j} \times \hat{i} = -\hat{k}$.
2. **Question:** If $\vec{u} \times \vec{v} = \vec{0}$, what does this indicate about the relationship between $\vec{u}$ and $\vec{v}$?
   - **Answer:** It means the vectors are collinear (parallel or anti-parallel with $\theta = 0^\circ$ or $180^\circ$, where $\sin\theta = 0$), or at least one of them is the zero vector.
3. **Question:** Why does the cross product exist only in 3 and 7 dimensions?
   - **Answer:** A normed division algebra over real vector spaces exists only in dimensions 1 (reals), 2 (complex), 4 (quaternions), and 8 (octonions) by Hurwitz's Theorem. The vector cross product corresponds to the imaginary part of multiplication, existing strictly in dimensions $n - 1 \in \{3, 7\}$.
