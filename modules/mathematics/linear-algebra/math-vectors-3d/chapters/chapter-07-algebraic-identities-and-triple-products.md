# Chapter 7: Algebraic Identities and Triple Products in $\mathbb{R}^3$

> *"In the geometry of three dimensions, the interplay of the scalar and vector products creates algebraic harmonies of astonishing beauty—where volumes are measured by determinants, and rotations obey the Lie algebra of spatial symmetries."*  
> — **Josiah Willard Gibbs**, *Vector Analysis* (1901)

---

### Section 7.1 The Scalar Triple Product (Box Product)

When we combine the dot product and the cross product across three vectors $\mathbf{u}, \mathbf{v}, \mathbf{w} \in \mathbb{R}^3$, the most natural scalar combination is:
$$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})$$

This quantity is known as the **scalar triple product**, or the **box product**, frequently written with the concise bracket notation:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] \equiv \mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})$$

Let us express the vectors in standard Cartesian components:
$$\mathbf{u} = \begin{bmatrix} u_x \\ u_y \\ u_z \end{bmatrix}, \quad \mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}, \quad \mathbf{w} = \begin{bmatrix} w_x \\ w_y \\ w_z \end{bmatrix}$$

Recalling the definition of the cross product $\mathbf{v} \times \mathbf{w}$:
$$\mathbf{v} \times \mathbf{w} = \begin{bmatrix} v_y w_z - v_z w_y \\ v_z w_x - v_x w_z \\ v_x w_y - v_y w_x \end{bmatrix}$$

Taking the dot product with $\mathbf{u}$:
$$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = u_x (v_y w_z - v_z w_y) + u_y (v_z w_x - v_x w_z) + u_z (v_x w_y - v_y w_x)$$

Notice that this expression is precisely the Laplace cofactor expansion of the $3 \times 3$ matrix formed by stacking the vectors as rows:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \begin{vmatrix} u_x & u_y & u_z \\ v_x & v_y & v_z \\ w_x & w_y & w_z \end{vmatrix}$$

Because the determinant of the transpose of a matrix equals the determinant of the matrix itself ($\det(\mathbf{M}) = \det(\mathbf{M}^T)$), the box product is also the determinant of the matrix having $\mathbf{u}, \mathbf{v}, \mathbf{w}$ as its columns:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \det\begin{bmatrix} \mathbf{u} & \mathbf{v} & \mathbf{w} \end{bmatrix}$$

```
                   w
                  /|
                 / |
                /  |
               +---+-----------+
              /|  /           /|
             / | /           / |
            +--+------------+  |
            |  |/           |  |
            |  +------------+--+
            | /   u         | /
            |/              |/
            +---------------+
                   v
        Volume = |u · (v x w)|
```

#### Cyclic and Interchange Symmetries:
By the alternating properties of determinants:
1. **Cyclic Permutations are Invariant:**
   Swapping two rows twice (an even permutation of rows) leaves the determinant unchanged:
   $$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = [\mathbf{v}, \mathbf{w}, \mathbf{u}] = [\mathbf{w}, \mathbf{u}, \mathbf{v}]$$
   In dot-cross notation:
   $$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = \mathbf{v} \cdot (\mathbf{w} \times \mathbf{u}) = \mathbf{w} \cdot (\mathbf{u} \times \mathbf{v})$$

2. **Swapping Dot and Cross:**
   Because the dot product is commutative, $\mathbf{w} \cdot (\mathbf{u} \times \mathbf{v}) = (\mathbf{u} \times \mathbf{v}) \cdot \mathbf{w}$.
   Therefore:
   $$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = (\mathbf{u} \times \mathbf{v}) \cdot \mathbf{w}$$
   *The dot and cross operators can be freely interchanged without altering the result!*

3. **Odd Permutations Invert the Sign:**
   Swapping any two adjacent vectors (an odd permutation) negates the determinant:
   $$[\mathbf{u}, \mathbf{w}, \mathbf{v}] = -[\mathbf{u}, \mathbf{v}, \mathbf{w}]$$
   $$[\mathbf{v}, \mathbf{u}, \mathbf{w}] = -[\mathbf{u}, \mathbf{v}, \mathbf{w}]$$

---

### Section 7.2 Geometric Meaning: Signed Volume and Handedness

What is the physical and geometric interpretation of the scalar triple product?

Consider the parallelepiped (the 3D skewed box) spanned by the three vectors $\mathbf{u}, \mathbf{v}, \mathbf{w}$ meeting at a common vertex:
- The base of the parallelepiped is the parallelogram spanned by $\mathbf{v}$ and $\mathbf{w}$.
- Its base area is:
  $$A_{\text{base}} = \|\mathbf{v} \times \mathbf{w}\|$$
- The vector $\mathbf{n} = \mathbf{v} \times \mathbf{w}$ is perpendicular to the base parallelogram.
- The height $h$ of the parallelepiped is the perpendicular altitude of vector $\mathbf{u}$ above the plane of the base, which is the scalar projection of $\mathbf{u}$ onto the unit normal $\hat{\mathbf{n}}$:
  $$h = \|\mathbf{u}\| |\cos\phi| = \left| \mathbf{u} \cdot \frac{\mathbf{v} \times \mathbf{w}}{\|\mathbf{v} \times \mathbf{w}\|} \right|$$
  where $\phi$ is the angle between $\mathbf{u}$ and $\mathbf{v} \times \mathbf{w}$.

The geometric volume of the parallelepiped is:
$$V = A_{\text{base}} \times h = \|\mathbf{v} \times \mathbf{w}\| \times \left| \frac{\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})}{\|\mathbf{v} \times \mathbf{w}\|} \right| = |\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})|$$

Thus:
$$\text{Volume}_{\text{parallelepiped}} = |[\mathbf{u}, \mathbf{v}, \mathbf{w}]|$$

#### The Significance of the Sign: Handedness of the Triad
The sign of $[\mathbf{u}, \mathbf{v}, \mathbf{w}]$ reveals the spatial orientation (chirality) of the three vectors:
- **$[\mathbf{u}, \mathbf{v}, \mathbf{w}] > 0$:** The vectors form a **right-handed system** (positive orientation). Pointing the fingers of your right hand along $\mathbf{v}$ and curling toward $\mathbf{w}$ places your thumb on the same side of the plane as $\mathbf{u}$.
- **$[\mathbf{u}, \mathbf{v}, \mathbf{w}] < 0$:** The vectors form a **left-handed system** (negative orientation).
- **$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = 0$:** The volume collapses to zero; the three vectors are **coplanar**.

---

### Section 7.3 Coplanarity Test for Vectors and Points

Three vectors $\mathbf{u}, \mathbf{v}, \mathbf{w} \in \mathbb{R}^3$ lie in the exact same 2D plane (or are linearly dependent) if and only if their scalar triple product vanishes:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = 0$$

#### The 4-Point Coplanarity Test:
In 3D CAD modeling and mesh processing, four arbitrary points $A, B, C, D \in \mathbb{R}^3$ are coplanar (all four lie on a single flat plane) if and only if the three vectors originating from $A$ are coplanar:
$$[(\vec{B} - \vec{A}), (\vec{C} - \vec{A}), (\vec{D} - \vec{A})] = 0$$
$$\begin{vmatrix} B_x - A_x & B_y - A_y & B_z - A_z \\ C_x - A_x & C_y - A_y & C_z - A_z \\ D_x - A_x & D_y - A_y & D_z - A_z \end{vmatrix} = 0$$

If this determinant is non-zero, the four points form a non-degenerate 3D tetrahedron.

---

### Section 7.4 Tetrahedron Volume in 3D Space

A tetrahedron is the 3D simplex—the simplest solid figure bounded by four planar triangular faces and four vertices: $A, B, C, D$.

```
                 D
                /|\
               / | \
              /  |  \
             /   |   \
            A----+----C
             \   |   /
              \  |  /
               \ | /
                 B
```

From solid geometry, any pyramid has volume $V = \frac{1}{3} \times \text{Base Area} \times \text{Height}$.
For a tetrahedron with base triangle $\triangle ABC$ and apex $D$:
- Base Area: $A_{\triangle} = \frac{1}{2} \|\vec{AB} \times \vec{AC}\|$.
- Height: $h = \text{scalar projection of } \vec{AD} \text{ onto } \frac{\vec{AB} \times \vec{AC}}{\|\vec{AB} \times \vec{AC}\|}$.

Therefore:
$$V_{\text{tetrahedron}} = \frac{1}{3} \left( \frac{1}{2} \|\vec{AB} \times \vec{AC}\| \right) h = \frac{1}{6} | \vec{AD} \cdot (\vec{AB} \times \vec{AC}) |$$

$$V_{\text{tetrahedron}} = \frac{1}{6} |[\vec{AB}, \vec{AC}, \vec{AD}]| = \frac{1}{6} \left| \det\begin{bmatrix} B_x - A_x & B_y - A_y & B_z - A_z \\ C_x - A_x & C_y - A_y & C_z - A_z \\ D_x - A_x & D_y - A_y & D_z - A_z \end{bmatrix} \right|$$

*Every parallelepiped can be decomposed into exactly 6 tetrahedra of equal volume.*
This formula is the fundamental building block for computing the exact volume, center of mass, and moment of inertia tensor of arbitrary 3D polygonal meshes (via tetrahedral decomposition).

---

### Section 7.5 The Vector Triple Product: Lagrange's "BAC-CAB" Identity

Now consider crossing a vector with the cross product of two other vectors:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$$

This is the **vector triple product**. Unlike the scalar triple product, the output is an actual 3D vector.

#### Geometric Direction Analysis:
1. The inner cross product $\mathbf{n} = \mathbf{v} \times \mathbf{w}$ is perpendicular to the plane spanned by $\mathbf{v}$ and $\mathbf{w}$.
2. The outer cross product $\mathbf{u} \times \mathbf{n}$ is perpendicular to $\mathbf{n}$.
3. But any vector perpendicular to the normal of a plane must **lie in that plane**!
Therefore, $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$ must be a linear combination of $\mathbf{v}$ and $\mathbf{w}$:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \alpha \mathbf{v} + \beta \mathbf{w}$$

The exact values of the scalars $\alpha$ and $\beta$ are given by **Lagrange's Vector Triple Product Identity**, universally remembered by the mnemonic **"BAC-CAB"**:

$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})$$

```
  Memory Rule: "B · (A · C) - C · (A · B)"
  Here:
    A = u, B = v, C = w
    u x (v x w) = v (u · w) - w (u · v)
```

#### What about $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w}$?
Applying anti-commutativity and the BAC-CAB rule:
$$(\mathbf{u} \times \mathbf{v}) \times \mathbf{w} = -\mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = -[\mathbf{u}(\mathbf{w} \cdot \mathbf{v}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u})] = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{u}(\mathbf{v} \cdot \mathbf{w})$$
Notice that $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$ lies in the plane of $\mathbf{v}$ and $\mathbf{w}$, whereas $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w}$ lies in the plane of $\mathbf{u}$ and $\mathbf{v}$. They are completely different vectors!

#### Rigorous Algebraic Proof of the BAC-CAB Rule:
We evaluate the $x$-component of $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$:
Let $\mathbf{p} = \mathbf{v} \times \mathbf{w} = \begin{bmatrix} v_y w_z - v_z w_y \\ v_z w_x - v_x w_z \\ v_x w_y - v_y w_x \end{bmatrix}$.
Then:
$$[\mathbf{u} \times \mathbf{p}]_x = u_y p_z - u_z p_y = u_y(v_x w_y - v_y w_x) - u_z(v_z w_x - v_x w_z)$$
$$= u_y v_x w_y - u_y v_y w_x - u_z v_z w_x + u_z v_x w_z$$
Add and subtract $u_x v_x w_x$:
$$= (u_x v_x w_x + u_y v_x w_y + u_z v_x w_z) - (u_x v_x w_x + u_y v_y w_x + u_z v_z w_x)$$
Factor out $v_x$ from the first group, and $w_x$ from the second:
$$= v_x (u_x w_x + u_y w_y + u_z w_z) - w_x (u_x v_x + u_y v_y + u_z v_z)$$
$$= v_x (\mathbf{u} \cdot \mathbf{w}) - w_x (\mathbf{u} \cdot \mathbf{v}) = [\mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})]_x$$
By cyclic symmetry of indices, the exact same relation holds for the $y$ and $z$ components. Thus:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v}) \quad \blacksquare$$

---

### Section 7.6 The Jacobi Identity and the Lie Algebra $\mathfrak{so}(3)$

In theoretical physics and robotics, 3D rotations form the continuous Lie group $\mathrm{SO}(3)$ (Special Orthogonal group). The infinitesimal generators of 3D rotations form the Lie algebra $\mathfrak{so}(3)$, where the Lie bracket between two vectors is precisely the cross product:
$$[\mathbf{u}, \mathbf{v}]_{\text{Lie}} \equiv \mathbf{u} \times \mathbf{v}$$

Every Lie algebra must satisfy the **Jacobi Identity**:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) + \mathbf{v} \times (\mathbf{w} \times \mathbf{u}) + \mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{0}$$

#### Proof via BAC-CAB:
Expand all three terms using the BAC-CAB formula:
1. $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})$
2. $\mathbf{v} \times (\mathbf{w} \times \mathbf{u}) = \mathbf{w}(\mathbf{v} \cdot \mathbf{u}) - \mathbf{u}(\mathbf{v} \cdot \mathbf{w})$
3. $\mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{u}(\mathbf{w} \cdot \mathbf{v}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u})$

Summing the left-hand sides:
$$\text{Sum} = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v}) + \mathbf{w}(\mathbf{v} \cdot \mathbf{u}) - \mathbf{u}(\mathbf{v} \cdot \mathbf{w}) + \mathbf{u}(\mathbf{w} \cdot \mathbf{v}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u})$$

Since the dot product is commutative ($\mathbf{u} \cdot \mathbf{w} = \mathbf{w} \cdot \mathbf{u}$, $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$, $\mathbf{v} \cdot \mathbf{w} = \mathbf{w} \cdot \mathbf{v}$), the terms cancel in exact pairs:
- $\mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u}) = \mathbf{0}$
- $-\mathbf{w}(\mathbf{u} \cdot \mathbf{v}) + \mathbf{w}(\mathbf{v} \cdot \mathbf{u}) = \mathbf{0}$
- $-\mathbf{u}(\mathbf{v} \cdot \mathbf{w}) + \mathbf{u}(\mathbf{w} \cdot \mathbf{v}) = \mathbf{0}$

Therefore:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) + \mathbf{v} \times (\mathbf{w} \times \mathbf{u}) + \mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{0} \quad \blacksquare$$

This guarantees that rotational kinematics and angular velocity addition are mathematically consistent in 3D physics engines.

---

### Section 7.7 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 7.1: Scalar Triple Product and Parallelepiped Volume
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 2 \\ -3 \\ 1 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 1 \\ 0 \\ 4 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} -1 \\ 2 \\ 5 \end{bmatrix}$:
1. Compute the scalar triple product $[\mathbf{u}, \mathbf{v}, \mathbf{w}]$.
2. Find the volume of the parallelepiped spanned by these three vectors.
3. Determine whether $\{\mathbf{u}, \mathbf{v}, \mathbf{w}\}$ forms a right-handed or left-handed system.

**Solution:**
1. Compute via determinant:
   $$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \begin{vmatrix} 2 & -3 & 1 \\ 1 & 0 & 4 \\ -1 & 2 & 5 \end{vmatrix}$$
   Expand along row 1:
   $$= 2 \begin{vmatrix} 0 & 4 \\ 2 & 5 \end{vmatrix} - (-3) \begin{vmatrix} 1 & 4 \\ -1 & 5 \end{vmatrix} + 1 \begin{vmatrix} 1 & 0 \\ -1 & 2 \end{vmatrix}$$
   $$= 2(0 - 8) + 3(5 - (-4)) + 1(2 - 0)$$
   $$= 2(-8) + 3(9) + 1(2) = -16 + 27 + 2 = 13$$
2. Parallelepiped volume:
   $$\text{Volume} = |[\mathbf{u}, \mathbf{v}, \mathbf{w}]| = |13| = 13 \text{ units}^3$$
3. Handedness:
   Since $[\mathbf{u}, \mathbf{v}, \mathbf{w}] = +13 > 0$, the triad forms a **right-handed system**.

---

#### Example 7.2: Vector Triple Product via BAC-CAB
**Problem:** Compute $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$ for $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$ using:
1. The BAC-CAB identity.
2. Direct sequential cross products.

**Solution:**
1. **Via BAC-CAB:**
   $$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})$$
   Compute dot products:
   $$\mathbf{u} \cdot \mathbf{w} = (1)(0) + (2)(0) + (3)(1) = 3$$
   $$\mathbf{u} \cdot \mathbf{v} = (1)(0) + (2)(1) + (3)(0) = 2$$
   Substitute:
   $$= \mathbf{v}(3) - \mathbf{w}(2) = 3 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} - 2 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 3 \\ -2 \end{bmatrix}$$

2. **Via Sequential Cross Products:**
   $$\mathbf{v} \times \mathbf{w} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \mathbf{j} \times \mathbf{k} = \mathbf{i} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   $$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   $$= \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & 3 \\ 1 & 0 & 0 \end{vmatrix} = \mathbf{i}(0 - 0) - \mathbf{j}(0 - 3) + \mathbf{k}(0 - 2) = 3\mathbf{j} - 2\mathbf{k} = \begin{bmatrix} 0 \\ 3 \\ -2 \end{bmatrix}$$
Both methods produce the identical vector $\begin{bmatrix} 0 \\ 3 \\ -2 \end{bmatrix} \quad \checkmark$.

---

#### Example 7.3: Testing Coplanarity of 4 Points
**Problem:** Determine if the four points $A(1, 2, 3)$, $B(2, 4, 5)$, $C(4, 5, 6)$, and $D(3, 1, 0)$ lie on the same 3D plane.

**Solution:**
1. Form displacement vectors with base $A$:
   $$\vec{AB} = B - A = \begin{bmatrix} 2 - 1 \\ 4 - 2 \\ 5 - 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$$
   $$\vec{AC} = C - A = \begin{bmatrix} 4 - 1 \\ 5 - 2 \\ 6 - 3 \end{bmatrix} = \begin{bmatrix} 3 \\ 3 \\ 3 \end{bmatrix}$$
   $$\vec{AD} = D - A = \begin{bmatrix} 3 - 1 \\ 1 - 2 \\ 0 - 3 \end{bmatrix} = \begin{bmatrix} 2 \\ -1 \\ -3 \end{bmatrix}$$
2. Compute the scalar triple product:
   $$[\vec{AB}, \vec{AC}, \vec{AD}] = \begin{vmatrix} 1 & 2 & 2 \\ 3 & 3 & 3 \\ 2 & -1 & -3 \end{vmatrix}$$
   Factor out 3 from row 2:
   $$= 3 \begin{vmatrix} 1 & 2 & 2 \\ 1 & 1 & 1 \\ 2 & -1 & -3 \end{vmatrix}$$
   Expand determinant:
   $$= 3 [ 1(1(-3) - 1(-1)) - 2(1(-3) - 1(2)) + 2(1(-1) - 1(2)) ]$$
   $$= 3 [ 1(-3 + 1) - 2(-3 - 2) + 2(-1 - 2) ]$$
   $$= 3 [ -2 - 2(-5) + 2(-3) ] = 3 [ -2 + 10 - 6 ] = 3 [ 2 ] = 6$$
3. Conclusion:
   Since $[\vec{AB}, \vec{AC}, \vec{AD}] = 6 \ne 0$, the four points are **not coplanar**. They form a 3D tetrahedron with non-zero volume ($V = \frac{6}{6} = 1.0$).

---

#### Example 7.4: Exact Tetrahedron Volume Calculation
**Problem:** Find the exact volume of the tetrahedron with vertices $O(0, 0, 0)$, $A(3, 0, 0)$, $B(0, 4, 0)$, and $C(0, 0, 5)$.

**Solution:**
The edge vectors from origin $O$ are:
$$\mathbf{a} = \begin{bmatrix} 3 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 0 \\ 4 \\ 0 \end{bmatrix}, \quad \mathbf{c} = \begin{bmatrix} 0 \\ 0 \\ 5 \end{bmatrix}$$
The scalar triple product is the determinant of this diagonal matrix:
$$[\mathbf{a}, \mathbf{b}, \mathbf{c}] = \begin{vmatrix} 3 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 5 \end{vmatrix} = 3 \times 4 \times 5 = 60$$
The volume of the tetrahedron is:
$$V_{\text{tet}} = \frac{1}{6} |[\mathbf{a}, \mathbf{b}, \mathbf{c}]| = \frac{1}{6}(60) = 10 \text{ units}^3$$
*Elementary geometry check:* A right corner tetrahedron with perpendicular heights 3, 4, 5 has base area $\frac{1}{2}(3)(4) = 6$ and volume $\frac{1}{3}(6)(5) = 10 \quad \checkmark$.

---

#### Example 7.5: Proving the Product of Two Cross Products (Binet-Cauchy Identity)
**Problem:** Prove the Binet-Cauchy identity:
$$(\mathbf{a} \times \mathbf{b}) \cdot (\mathbf{c} \times \mathbf{d}) = (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{a} \cdot \mathbf{d})(\mathbf{b} \cdot \mathbf{c})$$

**Solution:**
Let $\mathbf{u} = \mathbf{a} \times \mathbf{b}$.
We need to evaluate $\mathbf{u} \cdot (\mathbf{c} \times \mathbf{d})$.
Using the interchange property of dot and cross products (Section 7.1):
$$\mathbf{u} \cdot (\mathbf{c} \times \mathbf{d}) = (\mathbf{u} \times \mathbf{c}) \cdot \mathbf{d}$$
Substitute back $\mathbf{u} = \mathbf{a} \times \mathbf{b}$:
$$= ((\mathbf{a} \times \mathbf{b}) \times \mathbf{c}) \cdot \mathbf{d}$$
Apply the BAC-CAB identity to $(\mathbf{a} \times \mathbf{b}) \times \mathbf{c} = -\mathbf{c} \times (\mathbf{a} \times \mathbf{b}) = -[\mathbf{a}(\mathbf{c} \cdot \mathbf{b}) - \mathbf{b}(\mathbf{c} \cdot \mathbf{a})] = \mathbf{b}(\mathbf{a} \cdot \mathbf{c}) - \mathbf{a}(\mathbf{b} \cdot \mathbf{c})$:
$$= [\mathbf{b}(\mathbf{a} \cdot \mathbf{c}) - \mathbf{a}(\mathbf{b} \cdot \mathbf{c})] \cdot \mathbf{d}$$
Distributing the dot product with $\mathbf{d}$:
$$= (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{b} \cdot \mathbf{c})(\mathbf{a} \cdot \mathbf{d})$$
$$= (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{a} \cdot \mathbf{d})(\mathbf{b} \cdot \mathbf{c}) \quad \blacksquare$$

---

#### Example 7.6: Lagrange's Identity as a Special Case of Binet-Cauchy
**Problem:** Use the Binet-Cauchy identity to derive Lagrange's identity for $\|\mathbf{u} \times \mathbf{v}\|^2$.

**Solution:**
In the Binet-Cauchy identity:
$$(\mathbf{a} \times \mathbf{b}) \cdot (\mathbf{c} \times \mathbf{d}) = (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{a} \cdot \mathbf{d})(\mathbf{b} \cdot \mathbf{c})$$
Set $\mathbf{a} = \mathbf{c} = \mathbf{u}$ and $\mathbf{b} = \mathbf{d} = \mathbf{v}$:
$$(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{u} \times \mathbf{v}) = (\mathbf{u} \cdot \mathbf{u})(\mathbf{v} \cdot \mathbf{v}) - (\mathbf{u} \cdot \mathbf{v})(\mathbf{v} \cdot \mathbf{u})$$
Since $(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{u} \times \mathbf{v}) = \|\mathbf{u} \times \mathbf{v}\|^2$, $\mathbf{u} \cdot \mathbf{u} = \|\mathbf{u}\|^2$, and $\mathbf{v} \cdot \mathbf{v} = \|\mathbf{v}\|^2$:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2 \quad \blacksquare$$

---

#### Example 7.7: Verification of Jacobi's Identity
**Problem:** Explicitly verify the Jacobi Identity for $\mathbf{u} = \mathbf{i}$, $\mathbf{v} = \mathbf{j}$, and $\mathbf{w} = \mathbf{k}$.

**Solution:**
Compute each of the three cyclical terms:
1. First term:
   $\mathbf{v} \times \mathbf{w} = \mathbf{j} \times \mathbf{k} = \mathbf{i}$
   $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{i} \times \mathbf{i} = \mathbf{0}$
2. Second term:
   $\mathbf{w} \times \mathbf{u} = \mathbf{k} \times \mathbf{i} = \mathbf{j}$
   $\mathbf{v} \times (\mathbf{w} \times \mathbf{u}) = \mathbf{j} \times \mathbf{j} = \mathbf{0}$
3. Third term:
   $\mathbf{u} \times \mathbf{v} = \mathbf{i} \times \mathbf{j} = \mathbf{k}$
   $\mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{k} \times \mathbf{k} = \mathbf{0}$
Sum:
$$\mathbf{0} + \mathbf{0} + \mathbf{0} = \mathbf{0} \quad \checkmark$$

---

#### Example 7.8: Physics Application: Centripetal Acceleration Derivation
**Problem:** For a point rotating at fixed radius with constant angular velocity $\boldsymbol{\omega}$, its velocity is $\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$.
Using the product rule and BAC-CAB, prove that the acceleration is $\mathbf{a} = \boldsymbol{\alpha} \times \mathbf{r} - \omega^2 \mathbf{r}_{\perp}$, where $\boldsymbol{\alpha} = \frac{d\boldsymbol{\omega}}{dt}$.

**Solution:**
1. Differentiate velocity with respect to time:
   $$\mathbf{a} = \frac{d\mathbf{v}}{dt} = \frac{d}{dt}(\boldsymbol{\omega} \times \mathbf{r}) = \left(\frac{d\boldsymbol{\omega}}{dt} \times \mathbf{r}\right) + \left(\boldsymbol{\omega} \times \frac{d\mathbf{r}}{dt}\right)$$
2. Substitute $\boldsymbol{\alpha} = \frac{d\boldsymbol{\omega}}{dt}$ and $\frac{d\mathbf{r}}{dt} = \mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$:
   $$\mathbf{a} = (\boldsymbol{\alpha} \times \mathbf{r}) + \boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r})$$
3. Apply BAC-CAB to the second term:
   $$\boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}) = \boldsymbol{\omega}(\boldsymbol{\omega} \cdot \mathbf{r}) - \mathbf{r}(\boldsymbol{\omega} \cdot \boldsymbol{\omega})$$
   $$= \boldsymbol{\omega}(\boldsymbol{\omega} \cdot \mathbf{r}) - \omega^2 \mathbf{r} = -\omega^2 \left[ \mathbf{r} - \frac{\boldsymbol{\omega} \cdot \mathbf{r}}{\omega^2}\boldsymbol{\omega} \right] = -\omega^2 \mathbf{r}_{\perp}$$
   where $\mathbf{r}_{\perp}$ is the perpendicular component of position from the rotation axis.
4. Therefore:
   $$\mathbf{a} = \boldsymbol{\alpha} \times \mathbf{r} - \omega^2 \mathbf{r}_{\perp} \quad \blacksquare$$
The first term is the **tangential acceleration** and the second term is the **centripetal acceleration** pointing directly toward the axis of rotation!

---

#### Example 7.9: Coplanarity with a Free Parameter
**Problem:** Find the scalar $k$ such that the vectors $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 3 \\ k \\ 1 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}$ are coplanar.

**Solution:**
The vectors are coplanar if and only if $[\mathbf{u}, \mathbf{v}, \mathbf{w}] = 0$:
$$\begin{vmatrix} 1 & 2 & 3 \\ 3 & k & 1 \\ 2 & -1 & 4 \end{vmatrix} = 0$$
Expand along row 1:
$$1(4k - (-1)(1)) - 2(3(4) - 1(2)) + 3(3(-1) - k(2)) = 0$$
$$1(4k + 1) - 2(12 - 2) + 3(-3 - 2k) = 0$$
$$4k + 1 - 2(10) - 9 - 6k = 0$$
$$-2k + 1 - 20 - 9 = 0$$
$$-2k - 28 = 0 \implies 2k = -28 \implies k = -14$$
*Check:* With $k = -14$:
$$1(4(-14) + 1) - 20 - 9 - 6(-14) = 1(-55) - 29 + 84 = -84 + 84 = 0 \quad \checkmark$$

---

#### Example 7.10: Reciprocal Basis in Crystallography
**Problem:** Given a non-coplanar crystal lattice basis $\{\mathbf{a}, \mathbf{b}, \mathbf{c}\}$, the reciprocal lattice vectors are defined as:
$$\mathbf{a}^* = \frac{\mathbf{b} \times \mathbf{c}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}, \quad \mathbf{b}^* = \frac{\mathbf{c} \times \mathbf{a}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}, \quad \mathbf{c}^* = \frac{\mathbf{a} \times \mathbf{b}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}$$
Prove that $\mathbf{a} \cdot \mathbf{a}^* = 1$ and $\mathbf{a} \cdot \mathbf{b}^* = 0$.

**Solution:**
1. Compute $\mathbf{a} \cdot \mathbf{a}^*$:
   $$\mathbf{a} \cdot \mathbf{a}^* = \mathbf{a} \cdot \left(\frac{\mathbf{b} \times \mathbf{c}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}\right) = \frac{\mathbf{a} \cdot (\mathbf{b} \times \mathbf{c})}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]} = \frac{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]} = 1 \quad \checkmark$$
2. Compute $\mathbf{a} \cdot \mathbf{b}^*$:
   $$\mathbf{a} \cdot \mathbf{b}^* = \mathbf{a} \cdot \left(\frac{\mathbf{c} \times \mathbf{a}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}\right) = \frac{\mathbf{a} \cdot (\mathbf{c} \times \mathbf{a})}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}$$
   Since $(\mathbf{c} \times \mathbf{a})$ is perpendicular to $\mathbf{a}$, the numerator is $\mathbf{a} \cdot (\mathbf{c} \times \mathbf{a}) = 0$.
   Therefore:
   $$\mathbf{a} \cdot \mathbf{b}^* = 0 \quad \checkmark$$
In general, $\mathbf{a}_i \cdot \mathbf{a}_j^* = \delta_{ij}$.

---

### Section 7.8 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 7.1
**Problem:** Calculate $[\mathbf{u}, \mathbf{v}, \mathbf{w}]$ for $\mathbf{u} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$.
**Solution:**
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \begin{vmatrix} 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 3 \end{vmatrix} = 1 \times 2 \times 3 = 6$$

---

#### Exercise 7.2
**Problem:** If $[\mathbf{a}, \mathbf{b}, \mathbf{c}] = 7$, find the value of $[\mathbf{b}, \mathbf{a}, \mathbf{c}]$.
**Solution:**
Swapping the first two arguments $\mathbf{a}$ and $\mathbf{b}$ corresponds to swapping row 1 and row 2 of the determinant, which negates the value:
$$[\mathbf{b}, \mathbf{a}, \mathbf{c}] = -[\mathbf{a}, \mathbf{b}, \mathbf{c}] = -7$$

---

#### Exercise 7.3
**Problem:** If $[\mathbf{a}, \mathbf{b}, \mathbf{c}] = 7$, find the value of $[2\mathbf{a} + \mathbf{b}, 3\mathbf{b}, \mathbf{c}]$.
**Solution:**
By multilinearity of determinants:
$$[2\mathbf{a} + \mathbf{b}, 3\mathbf{b}, \mathbf{c}] = [2\mathbf{a}, 3\mathbf{b}, \mathbf{c}] + [\mathbf{b}, 3\mathbf{b}, \mathbf{c}]$$
The second term has two collinear rows ($\mathbf{b}$ and $3\mathbf{b}$), so its determinant is zero: $[\mathbf{b}, 3\mathbf{b}, \mathbf{c}] = 0$.
For the first term, factor out scalars:
$$[2\mathbf{a}, 3\mathbf{b}, \mathbf{c}] = (2)(3)[\mathbf{a}, \mathbf{b}, \mathbf{c}] = 6(7) = 42$$

---

#### Exercise 7.4
**Problem:** Prove that $(\mathbf{a} \times \mathbf{b}) \times (\mathbf{c} \times \mathbf{d}) = [\mathbf{a}, \mathbf{b}, \mathbf{d}]\mathbf{c} - [\mathbf{a}, \mathbf{b}, \mathbf{c}]\mathbf{d}$.
**Solution:**
Let $\mathbf{N} = \mathbf{a} \times \mathbf{b}$.
Then the expression is $\mathbf{N} \times (\mathbf{c} \times \mathbf{d})$.
Applying BAC-CAB:
$$\mathbf{N} \times (\mathbf{c} \times \mathbf{d}) = \mathbf{c}(\mathbf{N} \cdot \mathbf{d}) - \mathbf{d}(\mathbf{N} \cdot \mathbf{c})$$
Substitute back $\mathbf{N} = \mathbf{a} \times \mathbf{b}$:
$$\mathbf{N} \cdot \mathbf{d} = (\mathbf{a} \times \mathbf{b}) \cdot \mathbf{d} = [\mathbf{a}, \mathbf{b}, \mathbf{d}]$$
$$\mathbf{N} \cdot \mathbf{c} = (\mathbf{a} \times \mathbf{b}) \cdot \mathbf{c} = [\mathbf{a}, \mathbf{b}, \mathbf{c}]$$
Thus:
$$(\mathbf{a} \times \mathbf{b}) \times (\mathbf{c} \times \mathbf{d}) = [\mathbf{a}, \mathbf{b}, \mathbf{d}]\mathbf{c} - [\mathbf{a}, \mathbf{b}, \mathbf{c}]\mathbf{d} \quad \blacksquare$$

---

#### Exercise 7.5
**Problem:** Find the volume of the tetrahedron with vertices $A(1, 1, 1)$, $B(2, 1, 3)$, $C(3, 2, 2)$, and $D(1, 3, 4)$.
**Solution:**
Displacement vectors from $A$:
$$\vec{AB} = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix}, \quad \vec{AC} = \begin{bmatrix} 2 \\ 1 \\ 1 \end{bmatrix}, \quad \vec{AD} = \begin{bmatrix} 0 \\ 2 \\ 3 \end{bmatrix}$$
Determinant:
$$[\vec{AB}, \vec{AC}, \vec{AD}] = \begin{vmatrix} 1 & 0 & 2 \\ 2 & 1 & 1 \\ 0 & 2 & 3 \end{vmatrix}$$
$$= 1(3 - 2) - 0 + 2(4 - 0) = 1(1) + 2(4) = 1 + 8 = 9$$
Volume:
$$V = \frac{1}{6} |9| = \frac{9}{6} = \frac{3}{2} = 1.5 \text{ units}^3$$

---

#### Exercise 7.6
**Problem:** Show that $\mathbf{u} \cdot (\mathbf{u} \times \mathbf{v}) = 0$ directly from the determinant definition of the scalar triple product.
**Solution:**
$$[\mathbf{u}, \mathbf{u}, \mathbf{v}] = \begin{vmatrix} u_x & u_y & u_z \\ u_x & u_y & u_z \\ v_x & v_y & v_z \end{vmatrix}$$
A determinant with two identical rows is identically zero. Thus $[\mathbf{u}, \mathbf{u}, \mathbf{v}] = 0 \quad \blacksquare$

---

#### Exercise 7.7
**Problem:** Expand and simplify $(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{v} \times \mathbf{w})$.
**Solution:**
Using the Binet-Cauchy identity with $\mathbf{a} = \mathbf{u}$, $\mathbf{b} = \mathbf{v}$, $\mathbf{c} = \mathbf{v}$, $\mathbf{d} = \mathbf{w}$:
$$(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{v} \times \mathbf{w}) = (\mathbf{u} \cdot \mathbf{v})(\mathbf{v} \cdot \mathbf{w}) - (\mathbf{u} \cdot \mathbf{w})(\mathbf{v} \cdot \mathbf{v}) = (\mathbf{u} \cdot \mathbf{v})(\mathbf{v} \cdot \mathbf{w}) - \|\mathbf{v}\|^2(\mathbf{u} \cdot \mathbf{w})$$

---

#### Exercise 7.8
**Problem:** Prove that if $\mathbf{u} + \mathbf{v} + \mathbf{w} = \mathbf{0}$, then $\mathbf{u} \times \mathbf{v} = \mathbf{v} \times \mathbf{w} = \mathbf{w} \times \mathbf{u}$.
**Solution:**
1. Cross $\mathbf{u} + \mathbf{v} + \mathbf{w} = \mathbf{0}$ with $\mathbf{u}$ on the left:
   $$\mathbf{u} \times (\mathbf{u} + \mathbf{v} + \mathbf{w}) = \mathbf{u} \times \mathbf{0} \implies \mathbf{0} + \mathbf{u} \times \mathbf{v} + \mathbf{u} \times \mathbf{w} = \mathbf{0}$$
   $$\mathbf{u} \times \mathbf{v} = -(\mathbf{u} \times \mathbf{w}) = \mathbf{w} \times \mathbf{u}$$
2. Cross $\mathbf{u} + \mathbf{v} + \mathbf{w} = \mathbf{0}$ with $\mathbf{v}$ on the left:
   $$\mathbf{v} \times (\mathbf{u} + \mathbf{v} + \mathbf{w}) = \mathbf{0} \implies \mathbf{v} \times \mathbf{u} + \mathbf{0} + \mathbf{v} \times \mathbf{w} = \mathbf{0}$$
   $$\mathbf{v} \times \mathbf{w} = -(\mathbf{v} \times \mathbf{u}) = \mathbf{u} \times \mathbf{v}$$
Therefore, $\mathbf{u} \times \mathbf{v} = \mathbf{v} \times \mathbf{w} = \mathbf{w} \times \mathbf{u} \quad \blacksquare$

---

#### Exercise 7.9
**Problem:** In physics, the Poynting vector is $\mathbf{S} = \frac{1}{\mu_0}(\mathbf{E} \times \mathbf{B})$. For an electromagnetic plane wave with $\mathbf{E} = E_0 \mathbf{i}$ and $\mathbf{B} = B_0 \mathbf{j}$, find the direction and magnitude of energy flow $\mathbf{S}$.
**Solution:**
$$\mathbf{S} = \frac{1}{\mu_0}(E_0 \mathbf{i} \times B_0 \mathbf{j}) = \frac{E_0 B_0}{\mu_0}(\mathbf{i} \times \mathbf{j}) = \frac{E_0 B_0}{\mu_0} \mathbf{k}$$
The energy flows along the positive $z$-axis ($\mathbf{k}$) with magnitude $\frac{E_0 B_0}{\mu_0} \text{ W/m}^2$.

---

#### Exercise 7.10
**Problem:** What is the volume of the parallelepiped spanned by $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 2 \\ 4 \\ 6 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 7 \\ 8 \\ 9 \end{bmatrix}$?
**Solution:**
Notice that $\mathbf{v} = 2\mathbf{u}$.
Since two of the vectors are linearly dependent (collinear), the three vectors do not span a 3D volume (they span at most a 2D plane).
Thus:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = 0 \implies \text{Volume} = 0 \text{ units}^3$$
