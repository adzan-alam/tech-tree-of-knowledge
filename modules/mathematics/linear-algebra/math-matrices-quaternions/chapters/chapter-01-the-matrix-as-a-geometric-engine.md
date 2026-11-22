# Chapter 1: The Matrix as a Geometric Engine — Linear Maps in $\mathbb{R}^3$

> *"A matrix is not merely a tabular spreadsheet of detached numbers; it is a dynamic geometric engine. It stretches space, rotates coordinate axes, shears planes, and compresses volumes, all while maintaining the fundamental integrity of Euclidean linearity."*  
> — **Felix Klein**, *Erlangen Program* (1872)

---

### Section 1.1 From Systems of Linear Equations to Active Spatial Transformations

In secondary school algebra, matrices are usually introduced as sterile computational bookkeeping devices for solving systems of linear equations:
$$\begin{cases} a_{11} x + a_{12} y + a_{13} z = b_1 \\ a_{21} x + a_{22} y + a_{23} z = b_2 \\ a_{31} x + a_{32} y + a_{33} z = b_3 \end{cases} \iff \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} b_1 \\ b_2 \\ b_3 \end{bmatrix}$$

While this algebraic perspective is historically how matrices were developed by Arthur Cayley and James Joseph Sylvester in the mid-19th century, it obscures their true physical and geometric essence.

In 3D computer graphics, physics engines, and robotics kinematics, we invert this perspective:  
A $3 \times 3$ real matrix $\mathbf{A} \in \mathbb{R}^{3 \times 3}$ is an **active geometric operator**—a function or mapping $T: \mathbb{R}^3 \to \mathbb{R}^3$ that takes any input vector $\mathbf{v} \in \mathbb{R}^3$ and transforms it into an output vector $\mathbf{v}' \in \mathbb{R}^3$:
$$\mathbf{v}' = T(\mathbf{v}) = \mathbf{A} \mathbf{v}$$

```
        Input Space R^3                    Output Space R^3
               z                                  z'
               ^                                  ^
               |   v                              |       v' = A * v
               |  /                               |      /
               | /       ==== Matrix A ====>      |     /
               +------> y                         +---------> y'
              /                                  /
             v x                                v x'
       (Standard Grid)                     (Transformed Space)
```

The matrix does not passively describe numbers; it actively acts upon space, transporting points, rotating meshes, stretching geometries, and aligning physical bodies.

---

### Section 1.2 Linearity Axioms and Geometric Invariants

Not every arbitrary function $f: \mathbb{R}^3 \to \mathbb{R}^3$ can be represented by a matrix multiplication $\mathbf{A}\mathbf{v}$. A matrix multiplication is strictly a **Linear Transformation**.

A spatial mapping $T: \mathbb{R}^3 \to \mathbb{R}^3$ is defined as linear if and only if it satisfies two inviolable axioms for all vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$ and all scalars $c \in \mathbb{R}$:

1. **Additivity (Superposition):**
   $$T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$$
   Transforming the sum of two vectors yields the exact same result as transforming each vector individually and then adding them.

2. **Homogeneity of Degree 1 (Scaling):**
   $$T(c \mathbf{v}) = c \, T(\mathbf{v})$$
   Scaling a vector by factor $c$ before transforming it is identical to transforming it first and then scaling the result by $c$.

Combining both axioms into a single statement:
$$T(\alpha \mathbf{u} + \beta \mathbf{v}) = \alpha T(\mathbf{u}) + \beta T(\mathbf{v}) \quad \forall \alpha, \beta \in \mathbb{R}, \; \mathbf{u}, \mathbf{v} \in \mathbb{R}^3$$

#### Geometric Invariants of Linear Maps:
What does linearity look like to our human eyes when we observe 3D space?
1. **The Origin Remains Stationary:**
   $$T(\mathbf{0}) = T(0 \cdot \mathbf{v}) = 0 \cdot T(\mathbf{v}) = \mathbf{0}$$
   Every linear transformation *must leave the origin $(0, 0, 0)$ completely fixed*! It can never translate, shift, or displace the coordinate center. (We will confront the profound engineering consequences of this limitation in Chapter 3).
2. **Straight Lines Remain Straight Lines:**
   A parametric line $\mathbf{r}(t) = \mathbf{p} + t \mathbf{d}$ transforms into:
   $$T(\mathbf{r}(t)) = T(\mathbf{p} + t \mathbf{d}) = T(\mathbf{p}) + t T(\mathbf{d})$$
   which is another straight line passing through $T(\mathbf{p})$ with direction $T(\mathbf{d})$ (or a single point if $T(\mathbf{d}) = \mathbf{0}$). Lines can never bend, warp, or curve under a matrix transformation.
3. **Parallel Lines Remain Parallel (or Coincident):**
   If two lines have identical direction $\mathbf{d}$, their transformed directions $T(\mathbf{d})$ are identical; hence they remain strictly parallel in the transformed space.
4. **Grid Lines Remain Evenly Spaced:**
   Equally spaced intervals along any line remain equally spaced after transformation.

---

### Section 1.3 The Column Vector Perspective: Transformed Basis Triads

Here lies the most powerful intuitive insight in all of linear algebra:  
*What do the numbers inside a matrix actually mean?*

Let the standard orthonormal basis triad of $\mathbb{R}^3$ be denoted by:
$$\mathbf{i} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{j} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$

Now, let us multiply an arbitrary $3 \times 3$ matrix $\mathbf{A} = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix}$ by each of these standard basis vectors:

$$\mathbf{A} \mathbf{i} = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} a_{11} \\ a_{21} \\ a_{31} \end{bmatrix} = \mathbf{c}_1 \quad (\text{Column 1})$$

$$\mathbf{A} \mathbf{j} = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} a_{12} \\ a_{22} \\ a_{32} \end{bmatrix} = \mathbf{c}_2 \quad (\text{Column 2})$$

$$\mathbf{A} \mathbf{k} = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} a_{13} \\ a_{23} \\ a_{33} \end{bmatrix} = \mathbf{c}_3 \quad (\text{Column 3})$$

Look at this result with absolute clarity:
$$\mathbf{A} = \begin{bmatrix} \vert & \vert & \vert \\ T(\mathbf{i}) & T(\mathbf{j}) & T(\mathbf{k}) \\ \vert & \vert & \vert \end{bmatrix} = \begin{bmatrix} \vert & \vert & \vert \\ \mathbf{c}_1 & \mathbf{c}_2 & \mathbf{c}_3 \\ \vert & \vert & \vert \end{bmatrix}$$

**The three columns of any $3 \times 3$ matrix are simply the new 3D spatial positions where the original unit basis vectors $\mathbf{i}, \mathbf{j}, \mathbf{k}$ land after the transformation!**

```
            Original Basis                      Transformed Columns
                  k                                     c3 = A*k
                  ^                                     ^
                  |                                    / \
                  |                                   /   \
                  +-------> j                        +-----\-----> c2 = A*j
                 /                                  /       \
                v i                                v c1 = A*i
```

Now, consider an arbitrary vector $\mathbf{v} = \begin{bmatrix} x \\ y \\ z \end{bmatrix} = x \mathbf{i} + y \mathbf{j} + z \mathbf{k}$.
By linearity:
$$T(\mathbf{v}) = T(x \mathbf{i} + y \mathbf{j} + z \mathbf{k}) = x T(\mathbf{i}) + y T(\mathbf{j}) + z T(\mathbf{k}) = x \mathbf{c}_1 + y \mathbf{c}_2 + z \mathbf{c}_3$$

Matrix multiplication $\mathbf{A}\mathbf{v}$ is fundamentally **a linear combination of the column vectors of $\mathbf{A}$, weighted by the scalar coordinates of $\mathbf{v}$**!
If you know where $\mathbf{i}, \mathbf{j},$ and $\mathbf{k}$ land, you know where *every point in the entire universe* lands.

---

### Section 1.4 Determinants in 3D: Volume Distortion and Parity

Consider a standard unit cube in $\mathbb{R}^3$, with one corner at the origin and edges defined by the three basis vectors $\mathbf{i}, \mathbf{j}, \mathbf{k}$.
Its volume is:
$$V_{\text{initial}} = 1 \times 1 \times 1 = 1.0$$

When the matrix $\mathbf{A}$ transforms space, the unit cube is warped into a 3D parallelepiped whose three coterminous edges are the transformed basis vectors $\mathbf{c}_1 = \mathbf{A}\mathbf{i}$, $\mathbf{c}_2 = \mathbf{A}\mathbf{j}$, and $\mathbf{c}_3 = \mathbf{A}\mathbf{k}$.

Recall from Chapter 7 that the volume of any parallelepiped spanned by three vectors is given by their scalar triple product:
$$V_{\text{transformed}} = |[\mathbf{c}_1, \mathbf{c}_2, \mathbf{c}_3]| = |\det[\mathbf{c}_1 \; \mathbf{c}_2 \; \mathbf{c}_3]| = |\det(\mathbf{A})|$$

This provides the exact geometric definition of the **determinant** of a $3 \times 3$ matrix:
$$\det(\mathbf{A}) \equiv \text{The signed factor by which transformation } \mathbf{A} \text{ scales 3D volume}$$

```
      Standard Unit Cube (Vol = 1)         Transformed Parallelepiped (Vol = |det A|)
               +------+                             +--------+
              /|     /|                            /        /|
             +-+----+ |                           +--------+ |
             | |    | |       ==== A ====>        |        | |
             | +----+ |                           |        | +
             |/     |/                            |        |/
             +------+                             +--------+
```

#### Physical Meaning of the Determinant's Sign:
1. **$\det(\mathbf{A}) > 0$ (Orientation-Preserving):**  
   The transformation scales volume by factor $\det(\mathbf{A})$. The coordinate system remains **right-handed**. If you held your right hand along $\mathbf{i}$ and curled toward $\mathbf{j}$, your thumb still points on the same side as $\mathbf{k}$.
2. **$\det(\mathbf{A}) < 0$ (Orientation-Reversing / Chiral Flip):**  
   The transformation includes a spatial reflection across an odd number of axes. A right-handed coordinate frame is flipped into a **left-handed coordinate frame**. A right shoe transforms into a left shoe.
3. **$\det(\mathbf{A}) = 0$ (Singular / Degenerate):**  
   The transformation collapses the entire 3D space into zero volume!
   - If $\text{rank}(\mathbf{A}) = 2$, space is flattened into a 2D plane.
   - If $\text{rank}(\mathbf{A}) = 1$, space is squashed onto a 1D line.
   - If $\text{rank}(\mathbf{A}) = 0$, space is compressed into the single origin point $(0, 0, 0)$.  
   When $\det(\mathbf{A}) = 0$, the transformation is irreversible: the matrix has **no inverse** ($\mathbf{A}^{-1}$ does not exist), because information has been permanently flattened and destroyed.

---

### Section 1.5 Taxonomy of Special Linear Maps in $\mathbb{R}^3$

By choosing the transformed positions of $\mathbf{i}, \mathbf{j}, \mathbf{k}$, we construct the fundamental spatial building blocks of 3D graphics and physics engines:

#### 1. Uniform and Non-Uniform Scaling
Scaling stretches or squashes space along the coordinate axes:
$$\mathbf{S}(s_x, s_y, s_z) = \begin{bmatrix} s_x & 0 & 0 \\ 0 & s_y & 0 \\ 0 & 0 & s_z \end{bmatrix}$$
- Basis mapping: $\mathbf{i} \to s_x \mathbf{i}$, $\mathbf{j} \to s_y \mathbf{j}$, $\mathbf{k} \to s_z \mathbf{k}$.
- Determinant: $\det(\mathbf{S}) = s_x s_y s_z$.
- If $s_x = s_y = s_z = s$, it is **uniform scaling**, scaling volume by $s^3$.

#### 2. Reflection Across Principal Coordinate Planes
- Reflection across the $xy$-plane (inverting the $z$-axis):
  $$\mathbf{R}_{xy} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}, \quad \det(\mathbf{R}_{xy}) = -1$$
- Reflection across the $yz$-plane (inverting the $x$-axis):
  $$\mathbf{R}_{yz} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad \det(\mathbf{R}_{yz}) = -1$$

#### 3. General Reflection Across an Arbitrary Plane Through the Origin
For an arbitrary plane passing through $(0, 0, 0)$ with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} n_x & n_y & n_z \end{bmatrix}^T$:
Recall from Chapter 5 that the reflected vector is $\mathbf{v}' = \mathbf{v} - 2(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$.
In matrix form:
$$\mathbf{H} = \mathbf{I} - 2 \hat{\mathbf{n}} \hat{\mathbf{n}}^T = \begin{bmatrix} 1 - 2n_x^2 & -2n_x n_y & -2n_x n_z \\ -2n_y n_x & 1 - 2n_y^2 & -2n_y n_z \\ -2n_z n_x & -2n_z n_y & 1 - 2n_z^2 \end{bmatrix}$$
This is the celebrated **Householder Reflection Matrix**. It is symmetric ($\mathbf{H}^T = \mathbf{H}$) and orthogonal ($\mathbf{H}^T \mathbf{H} = \mathbf{I}$), with $\det(\mathbf{H}) = -1$.

#### 4. 3D Shearing (Skewing)
Shearing displaces coordinates parallel to one axis proportionally to another axis. For example, shearing $x$ with respect to $z$ by factor $k$:
$$\mathbf{H}_{xz}(k) = \begin{bmatrix} 1 & 0 & k \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
- Vector $(x, y, z)$ transforms to $(x + kz, y, z)$.
- Determinant: $\det(\mathbf{H}_{xz}) = 1.0$.
*Remarkable fact:* Shearing distorts angles and shapes, but preserves volume perfectly ($\det = 1$).

---

### Section 1.6 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 1.1: Matrix-Vector Multiplication via Column Combinations
**Problem:** Given $\mathbf{A} = \begin{bmatrix} 2 & -1 & 3 \\ 0 & 4 & -2 \\ 1 & 0 & 5 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 3 \\ -2 \\ 4 \end{bmatrix}$:
1. Compute $\mathbf{A}\mathbf{v}$ using standard row-dot-column multiplication.
2. Compute $\mathbf{A}\mathbf{v}$ using the column-vector combination perspective.
3. Verify both methods yield the identical vector.

**Solution:**
1. **Row-Dot-Column Method:**
   $$\mathbf{A}\mathbf{v} = \begin{bmatrix} (2)(3) + (-1)(-2) + (3)(4) \\ (0)(3) + (4)(-2) + (-2)(4) \\ (1)(3) + (0)(-2) + (5)(4) \end{bmatrix} = \begin{bmatrix} 6 + 2 + 12 \\ 0 - 8 - 8 \\ 3 + 0 + 20 \end{bmatrix} = \begin{bmatrix} 20 \\ -16 \\ 23 \end{bmatrix}$$
2. **Column Combination Method:**
   Columns of $\mathbf{A}$: $\mathbf{c}_1 = \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix}$, $\mathbf{c}_2 = \begin{bmatrix} -1 \\ 4 \\ 0 \end{bmatrix}$, $\mathbf{c}_3 = \begin{bmatrix} 3 \\ -2 \\ 5 \end{bmatrix}$.
   Coordinates of $\mathbf{v}$: $x = 3, y = -2, z = 4$.
   $$\mathbf{A}\mathbf{v} = 3 \mathbf{c}_1 - 2 \mathbf{c}_2 + 4 \mathbf{c}_3 = 3 \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix} - 2 \begin{bmatrix} -1 \\ 4 \\ 0 \end{bmatrix} + 4 \begin{bmatrix} 3 \\ -2 \\ 5 \end{bmatrix}$$
   $$= \begin{bmatrix} 6 \\ 0 \\ 3 \end{bmatrix} + \begin{bmatrix} 2 \\ -8 \\ 0 \end{bmatrix} + \begin{bmatrix} 12 \\ -8 \\ 20 \end{bmatrix} = \begin{bmatrix} 6 + 2 + 12 \\ 0 - 8 - 8 \\ 3 + 0 + 20 \end{bmatrix} = \begin{bmatrix} 20 \\ -16 \\ 23 \end{bmatrix}$$
Both methods produce the identical vector $\begin{bmatrix} 20 & -16 & 23 \end{bmatrix}^T \quad \checkmark$.

---

#### Example 1.2: Reconstructing a Transformation Matrix from Basis Images
**Problem:** A geometric transformation $T: \mathbb{R}^3 \to \mathbb{R}^3$ maps the standard basis vectors to:
$$T(\mathbf{i}) = \begin{bmatrix} 0 \\ 2 \\ 1 \end{bmatrix}, \quad T(\mathbf{j}) = \begin{bmatrix} -1 \\ 0 \\ 3 \end{bmatrix}, \quad T(\mathbf{k}) = \begin{bmatrix} 4 \\ -2 \\ 0 \end{bmatrix}$$
1. Find the matrix $\mathbf{M}$ representing $T$.
2. Compute where the point $P(2, 3, -1)$ lands under this transformation.

**Solution:**
1. From Section 1.3, the columns of $\mathbf{M}$ are simply the transformed basis vectors:
   $$\mathbf{M} = \begin{bmatrix} T(\mathbf{i}) & T(\mathbf{j}) & T(\mathbf{k}) \end{bmatrix} = \begin{bmatrix} 0 & -1 & 4 \\ 2 & 0 & -2 \\ 1 & 3 & 0 \end{bmatrix}$$
2. To find the transformed image of $P$:
   $$T(P) = \mathbf{M} P = \begin{bmatrix} 0 & -1 & 4 \\ 2 & 0 & -2 \\ 1 & 3 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 3 \\ -1 \end{bmatrix}$$
   $$= \begin{bmatrix} (0)(2) + (-1)(3) + (4)(-1) \\ (2)(2) + (0)(3) + (-2)(-1) \\ (1)(2) + (3)(3) + (0)(-1) \end{bmatrix} = \begin{bmatrix} 0 - 3 - 4 \\ 4 + 0 + 2 \\ 2 + 9 + 0 \end{bmatrix} = \begin{bmatrix} -7 \\ 6 \\ 11 \end{bmatrix}$$

---

#### Example 1.3: Evaluating Determinant and Volume Distortion
**Problem:** Compute the determinant of $\mathbf{A} = \begin{bmatrix} 3 & 1 & -2 \\ 0 & 2 & 4 \\ -1 & 0 & 1 \end{bmatrix}$. If a sphere of radius $R = 2 \text{ m}$ is transformed by $\mathbf{A}$, what is the volume of the resulting ellipsoid?

**Solution:**
1. Compute $\det(\mathbf{A})$ via cofactor expansion along row 2:
   $$\det(\mathbf{A}) = -0 \cdot \begin{vmatrix} 1 & -2 \\ 0 & 1 \end{vmatrix} + 2 \cdot \begin{vmatrix} 3 & -2 \\ -1 & 1 \end{vmatrix} - 4 \cdot \begin{vmatrix} 3 & 1 \\ -1 & 0 \end{vmatrix}$$
   $$= 2((3)(1) - (-2)(-1)) - 4((3)(0) - (1)(-1))$$
   $$= 2(3 - 2) - 4(0 - (-1)) = 2(1) - 4(1) = 2 - 4 = -2$$
2. Physical interpretation:
   - Volume scale factor: $|\det(\mathbf{A})| = |-2| = 2$.
   - The sign is negative ($\det < 0$), meaning the coordinate orientation is reversed (chiral flip).
3. Initial volume of sphere:
   $$V_{\text{initial}} = \frac{4}{3}\pi R^3 = \frac{4}{3}\pi (2^3) = \frac{32}{3}\pi \approx 33.51032 \text{ m}^3$$
4. Transformed volume of ellipsoid:
   $$V_{\text{ellipsoid}} = |\det(\mathbf{A})| \times V_{\text{initial}} = 2 \times \frac{32}{3}\pi = \frac{64}{3}\pi \approx 67.02064 \text{ m}^3$$

---

#### Example 1.4: Detecting Singularity and Rank Collapse
**Problem:** Determine whether the matrix $\mathbf{B} = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 0 & 1 & -1 \end{bmatrix}$ is singular. If so, describe the geometric space onto which all of $\mathbb{R}^3$ is collapsed.

**Solution:**
1. Notice row 2: $\mathbf{r}_2 = 2 \mathbf{r}_1$.
   Because row 2 is an exact scalar multiple of row 1, the rows are linearly dependent.
2. Verify determinant:
   $$\det(\mathbf{B}) = 1(4(-1) - 6(1)) - 2(2(-1) - 6(0)) + 3(2(1) - 4(0))$$
   $$= 1(-4 - 6) - 2(-2) + 3(2) = -10 + 4 + 6 = 0$$
   Since $\det(\mathbf{B}) = 0$, $\mathbf{B}$ is **singular**.
3. Determine rank:
   Rows 1 and 3 are clearly independent: $\begin{bmatrix} 1 & 2 & 3 \end{bmatrix}$ is not a multiple of $\begin{bmatrix} 0 & 1 & -1 \end{bmatrix}$.
   Thus, $\text{rank}(\mathbf{B}) = 2$.
4. Geometric interpretation:
   The transformation $\mathbf{B}$ compresses the entire three-dimensional universe onto a **two-dimensional plane passing through the origin**, spanned by columns $\mathbf{c}_1 = \begin{bmatrix} 1 & 2 & 0 \end{bmatrix}^T$ and $\mathbf{c}_2 = \begin{bmatrix} 2 & 4 & 1 \end{bmatrix}^T$.

---

#### Example 1.5: Householder Reflection Matrix Construction
**Problem:** Construct the Householder reflection matrix $\mathbf{H}$ that reflects points across the plane $2x - y + 2z = 0$.

**Solution:**
1. Extract plane normal:
   $$\mathbf{n} = \begin{bmatrix} 2 \\ -1 \\ 2 \end{bmatrix}$$
2. Compute magnitude and unit normal $\hat{\mathbf{n}}$:
   $$\|\mathbf{n}\| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{4 + 1 + 4} = \sqrt{9} = 3$$
   $$\hat{\mathbf{n}} = \begin{bmatrix} 2/3 \\ -1/3 \\ 2/3 \end{bmatrix}$$
3. Compute outer product matrix $\hat{\mathbf{n}} \hat{\mathbf{n}}^T$:
   $$\hat{\mathbf{n}} \hat{\mathbf{n}}^T = \frac{1}{9} \begin{bmatrix} 2 \\ -1 \\ 2 \end{bmatrix} \begin{bmatrix} 2 & -1 & 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 4 & -2 & 4 \\ -2 & 1 & -2 \\ 4 & -2 & 4 \end{bmatrix}$$
4. Construct $\mathbf{H} = \mathbf{I} - 2 \hat{\mathbf{n}} \hat{\mathbf{n}}^T$:
   $$\mathbf{H} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} - \frac{2}{9} \begin{bmatrix} 4 & -2 & 4 \\ -2 & 1 & -2 \\ 4 & -2 & 4 \end{bmatrix} = \frac{1}{9} \left( \begin{bmatrix} 9 & 0 & 0 \\ 0 & 9 & 0 \\ 0 & 0 & 9 \end{bmatrix} - \begin{bmatrix} 8 & -4 & 8 \\ -4 & 2 & -4 \\ 8 & -4 & 8 \end{bmatrix} \right)$$
   $$\mathbf{H} = \frac{1}{9} \begin{bmatrix} 1 & 4 & -8 \\ 4 & 7 & 4 \\ -8 & 4 & 1 \end{bmatrix}$$
5. Verification:
   Test reflecting the normal vector $\mathbf{n} = \begin{bmatrix} 2 & -1 & 2 \end{bmatrix}^T$ (which should flip to $-\mathbf{n}$):
   $$\mathbf{H} \mathbf{n} = \frac{1}{9} \begin{bmatrix} 1 & 4 & -8 \\ 4 & 7 & 4 \\ -8 & 4 & 1 \end{bmatrix} \begin{bmatrix} 2 \\ -1 \\ 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 2 - 4 - 16 \\ 8 - 7 + 8 \\ -16 - 4 + 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} -18 \\ 9 \\ -18 \end{bmatrix} = \begin{bmatrix} -2 \\ 1 \\ -2 \end{bmatrix} = -\mathbf{n} \quad \checkmark$$

---

#### Example 1.6: 3D Shearing Matrix Application
**Problem:** A 3D shear matrix is given by $\mathbf{S} = \begin{bmatrix} 1 & 0.5 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$.
1. Transform a cube with vertices $V_0(0,0,0)$ to $V_7(1,1,1)$.
2. Calculate the volume of the resulting sheared parallelepiped.

**Solution:**
1. Vertex transformations:
   - $V_0(0, 0, 0) \to (0 + 0.5(0), 0, 0) = (0, 0, 0)$
   - $V_x(1, 0, 0) \to (1 + 0.5(0), 0, 0) = (1, 0, 0)$
   - $V_y(0, 1, 0) \to (0 + 0.5(1), 1, 0) = (0.5, 1, 0)$
   - $V_z(0, 0, 1) \to (0 + 0.5(0), 0, 1) = (0, 0, 1)$
   - $V_{xyz}(1, 1, 1) \to (1 + 0.5(1), 1, 1) = (1.5, 1, 1)$
   The top face of the cube ($y = 1$) is sheared horizontally along the $x$-axis by $0.5$ units.
2. Volume:
   $$\det(\mathbf{S}) = 1(1(1) - 0) - 0.5(0) + 0 = 1.0$$
   $$V = \det(\mathbf{S}) \times V_{\text{initial}} = 1.0 \times 1.0 = 1.0 \text{ units}^3$$
The volume is completely preserved.

---

#### Example 1.7: Proving Non-Linearity of Translation
**Problem:** Let $T: \mathbb{R}^3 \to \mathbb{R}^3$ be a translation mapping defined by $T(\mathbf{v}) = \mathbf{v} + \mathbf{t}_0$, where $\mathbf{t}_0 = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$. Prove rigorously that $T$ is not a linear transformation, and explain why no $3 \times 3$ matrix can perform this operation.

**Solution:**
1. Test Axiom 1 (Zero Preservation):
   For any linear map $L$, $L(\mathbf{0}) = \mathbf{0}$.
   For this translation mapping:
   $$T(\mathbf{0}) = \mathbf{0} + \mathbf{t}_0 = \mathbf{t}_0 = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \ne \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
   Because $T(\mathbf{0}) \ne \mathbf{0}$, $T$ violates the fundamental zero preservation property.
2. Test Additivity:
   Let $\mathbf{u} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$.
   - $T(\mathbf{u} + \mathbf{v}) = (\mathbf{u} + \mathbf{v}) + \mathbf{t}_0 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} + \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} = \begin{bmatrix} 2 \\ 3 \\ 3 \end{bmatrix}$.
   - $T(\mathbf{u}) + T(\mathbf{v}) = (\mathbf{u} + \mathbf{t}_0) + (\mathbf{v} + \mathbf{t}_0) = \mathbf{u} + \mathbf{v} + 2\mathbf{t}_0 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} + 2\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} = \begin{bmatrix} 3 \\ 5 \\ 6 \end{bmatrix}$.
   Clearly, $T(\mathbf{u} + \mathbf{v}) \ne T(\mathbf{u}) + T(\mathbf{v})$.
**Conclusion:** Translation is not a linear map; it is an **affine map**. It is mathematically impossible for any $3 \times 3$ matrix to translate vectors in $\mathbb{R}^3$.

---

#### Example 1.8: Non-Commutativity of Matrix Transformations
**Problem:** Let $\mathbf{A} = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ (scaling $x$ by 2) and $\mathbf{B} = \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ (shear in $x$ by $y$).
Compute $\mathbf{A}\mathbf{B}$ and $\mathbf{B}\mathbf{A}$, and show that matrix transformation composition is non-commutative.

**Solution:**
1. Compute $\mathbf{A}\mathbf{B}$:
   $$\mathbf{A}\mathbf{B} = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} (2)(1) & (2)(1) & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 2 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Compute $\mathbf{B}\mathbf{A}$:
   $$\mathbf{B}\mathbf{A} = \begin{bmatrix} 1 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} (1)(2) & (1)(1) & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
3. Comparison:
   $$\mathbf{A}\mathbf{B} = \begin{bmatrix} 2 & 2 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \ne \begin{bmatrix} 2 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \mathbf{B}\mathbf{A}$$
In physical space: "Shear then Scale" produces a different spatial geometry than "Scale then Shear".

---

#### Example 1.9: Trace and Invariant Sum of Eigenvalues
**Problem:** The trace of a square matrix is the sum of its diagonal entries: $\text{Tr}(\mathbf{M}) = \sum_{i=1}^n M_{ii}$.
For the matrix $\mathbf{M} = \begin{bmatrix} 4 & -2 & 1 \\ 3 & 5 & 0 \\ -1 & 2 & 3 \end{bmatrix}$:
1. Compute $\text{Tr}(\mathbf{M})$.
2. Verify that $\text{Tr}(\mathbf{M}) = \text{Tr}(\mathbf{M}^T)$.

**Solution:**
1. Sum diagonal elements:
   $$\text{Tr}(\mathbf{M}) = 4 + 5 + 3 = 12$$
2. The transpose $\mathbf{M}^T$ is:
   $$\mathbf{M}^T = \begin{bmatrix} 4 & 3 & -1 \\ -2 & 5 & 2 \\ 1 & 0 & 3 \end{bmatrix}$$
   The diagonal elements of $\mathbf{M}^T$ are $4, 5, 3$.
   $$\text{Tr}(\mathbf{M}^T) = 4 + 5 + 3 = 12 \quad \checkmark$$

---

#### Example 1.10: Null Space and Geometric Kernel
**Problem:** Find the null space (kernel) of the projection matrix $\mathbf{P} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$, which projects any vector onto the $xy$-plane.

**Solution:**
The null space $\text{Null}(\mathbf{P})$ consists of all vectors $\mathbf{v} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}$ such that $\mathbf{P}\mathbf{v} = \mathbf{0}$:
$$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} \implies \begin{bmatrix} x \\ y \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
This requires:
$$x = 0, \quad y = 0, \quad z \text{ is completely free}$$
Therefore:
$$\mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ z \end{bmatrix} = z \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = z \mathbf{k}$$
The null space is the entire infinite **$z$-axis**. Any vector lying strictly along the $z$-axis is completely extinguished (mapped to $\mathbf{0}$) by this projection.

---

### Section 1.7 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 1.1
**Problem:** Calculate the image of vector $\mathbf{u} = \begin{bmatrix} 1 \\ -2 \\ 3 \end{bmatrix}$ under the identity matrix $\mathbf{I}_{3 \times 3}$.
**Solution:**
$$\mathbf{I}\mathbf{u} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ -2 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 \\ -2 \\ 3 \end{bmatrix} = \mathbf{u}$$
The identity transformation leaves all vectors unchanged.

---

#### Exercise 1.2
**Problem:** Construct the $3 \times 3$ matrix that scales the $x$-axis by $3$, $y$-axis by $0.5$, and inverts the $z$-axis.
**Solution:**
$$\mathbf{S} = \begin{bmatrix} 3 & 0 & 0 \\ 0 & 0.5 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
Determinant: $\det(\mathbf{S}) = 3 \times 0.5 \times (-1) = -1.5$ (reverses orientation).

---

#### Exercise 1.3
**Problem:** If a matrix $\mathbf{M}$ satisfies $\det(\mathbf{M}) = 5$, what is the determinant of $\mathbf{M}^3$?
**Solution:**
By the multiplicative property of determinants $\det(\mathbf{A}\mathbf{B}) = \det(\mathbf{A})\det(\mathbf{B})$:
$$\det(\mathbf{M}^3) = (\det(\mathbf{M}))^3 = 5^3 = 125$$

---

#### Exercise 1.4
**Problem:** If $\mathbf{A} \in \mathbb{R}^{3 \times 3}$ and $c$ is a scalar, prove that $\det(c\mathbf{A}) = c^3 \det(\mathbf{A})$.
**Solution:**
Multiplying a matrix by scalar $c$ multiplies every entry in all 3 rows by $c$.
By the multilinearity of determinants, factoring $c$ out of row 1, row 2, and row 3 yields:
$$\det(c\mathbf{A}) = c \cdot c \cdot c \cdot \det(\mathbf{A}) = c^3 \det(\mathbf{A}) \quad \blacksquare$$

---

#### Exercise 1.5
**Problem:** Find the determinant of the 3D reflection matrix $\mathbf{R}_z = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$.
**Solution:**
$$\det(\mathbf{R}_z) = 1(1(-1) - 0) = -1$$

---

#### Exercise 1.6
**Problem:** Let $\mathbf{A} = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{bmatrix}$ (an upper triangular matrix). Find $\det(\mathbf{A})$.
**Solution:**
For any triangular matrix (upper or lower), the determinant is the product of its diagonal entries:
$$\det(\mathbf{A}) = 1 \times 4 \times 6 = 24$$

---

#### Exercise 1.7
**Problem:** What happens to the volume of a 3D rabbit mesh if it is multiplied by $\mathbf{M} = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 2 \end{bmatrix}$?
**Solution:**
$$\det(\mathbf{M}) = 2 \times 2 \times 2 = 8$$
The volume of the rabbit increases by a factor of exactly **$8$** ($2^3$).

---

#### Exercise 1.8
**Problem:** Verify that the transpose of product $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T \mathbf{A}^T$ for $\mathbf{A} = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ and $\mathbf{B} = \begin{bmatrix} 0 & 1 \\ 2 & 3 \end{bmatrix}$.
**Solution:**
1. Product $\mathbf{A}\mathbf{B}$:
   $$\mathbf{A}\mathbf{B} = \begin{bmatrix} (1)(0) + (2)(2) & (1)(1) + (2)(3) \\ (3)(0) + (4)(2) & (3)(1) + (4)(3) \end{bmatrix} = \begin{bmatrix} 4 & 7 \\ 8 & 15 \end{bmatrix}$$
   $$(\mathbf{A}\mathbf{B})^T = \begin{bmatrix} 4 & 8 \\ 7 & 15 \end{bmatrix}$$
2. Right side $\mathbf{B}^T \mathbf{A}^T$:
   $$\mathbf{B}^T = \begin{bmatrix} 0 & 2 \\ 1 & 3 \end{bmatrix}, \quad \mathbf{A}^T = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$$
   $$\mathbf{B}^T \mathbf{A}^T = \begin{bmatrix} (0)(1) + (2)(2) & (0)(3) + (2)(4) \\ (1)(1) + (3)(2) & (1)(3) + (3)(4) \end{bmatrix} = \begin{bmatrix} 4 & 8 \\ 7 & 15 \end{bmatrix}$$
Both sides match identically $\checkmark$.

---

#### Exercise 1.9
**Problem:** Prove that if $\mathbf{A}$ is an orthogonal matrix ($\mathbf{A}^T \mathbf{A} = \mathbf{I}$), then $\det(\mathbf{A}) = \pm 1$.
**Solution:**
Take the determinant of both sides of $\mathbf{A}^T \mathbf{A} = \mathbf{I}$:
$$\det(\mathbf{A}^T \mathbf{A}) = \det(\mathbf{I}) = 1$$
Since $\det(\mathbf{A}^T \mathbf{A}) = \det(\mathbf{A}^T) \det(\mathbf{A})$ and $\det(\mathbf{A}^T) = \det(\mathbf{A})$:
$$(\det(\mathbf{A}))^2 = 1 \implies \det(\mathbf{A}) = \pm 1 \quad \blacksquare$$

---

#### Exercise 1.10
**Problem:** A physics collision mesh is transformed by $\mathbf{M} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$. Explain what this matrix does geometrically and compute its determinant.
**Solution:**
- The first column is $\mathbf{c}_1 = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T = \mathbf{j}$ (maps $x$ to $y$).
- The second column is $\mathbf{c}_2 = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T = \mathbf{i}$ (maps $y$ to $x$).
- The third column is $\mathbf{c}_3 = \begin{bmatrix} 0 & 0 & 1 \end{bmatrix}^T = \mathbf{k}$ (leaves $z$ unchanged).
Geometrically, this matrix swaps the $x$ and $y$ coordinates, which corresponds to a **reflection across the diagonal plane $y = x$**.
Determinant:
$$\det(\mathbf{M}) = 0(0) - 1(1(1) - 0) + 0 = -1$$
As expected for a single reflection, the determinant is $-1$ (chiral/handedness flip).
