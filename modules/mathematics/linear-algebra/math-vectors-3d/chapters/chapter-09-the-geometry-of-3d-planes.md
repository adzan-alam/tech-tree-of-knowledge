# Chapter 9: The Geometry of 3D Planes

> *"A plane is a surface in which, any two points being taken, the straight line between them lies wholly in that surface. It is the infinite canvas upon which all spatial orientation is cast."*  
> — **Euclid of Alexandria**, *Elements*, Book I, Definition 7 (c. 300 BC)

---

### Section 9.1 Point-Normal Form of a Plane in $\mathbb{R}^3$

In three-dimensional space, the most elegant and computationally fundamental way to specify a flat 2D plane $\Pi$ is via a reference point and an orientation vector.

Let $\mathbf{P}_0 = (x_0, y_0, z_0)$ be a known point resting on the plane.  
Let $\mathbf{n} = \begin{bmatrix} A \\ B \\ C \end{bmatrix}$ be a non-zero **normal vector** that is strictly perpendicular to the plane.

```
                     n
                     ^
                     |
                     |       r
                     |      /
                     |     /
                     |    /
       ==============+===+================= Plane Pi
                     P0
```

Now consider an arbitrary query point $\mathbf{r} = (x, y, z)$ in $\mathbb{R}^3$.
The displacement vector from $\mathbf{P}_0$ to $\mathbf{r}$ is:
$$\mathbf{r} - \mathbf{P}_0 = \begin{bmatrix} x - x_0 \\ y - y_0 \\ z - z_0 \end{bmatrix}$$

The point $\mathbf{r}$ lies in the plane $\Pi$ if and only if the displacement vector $\mathbf{r} - \mathbf{P}_0$ lies entirely in the plane, which means it must be strictly perpendicular to the surface normal $\mathbf{n}$!

Recalling the orthogonality condition from Chapter 4, two vectors are perpendicular if and only if their dot product vanishes. Therefore, the **point-normal equation of a plane** is:
$$\mathbf{n} \cdot (\mathbf{r} - \mathbf{P}_0) = 0$$

Expanding this dot product into Cartesian coordinates:
$$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$$

Notice the remarkable simplicity: every point $(x, y, z)$ on this infinite 2D surface satisfies this single linear constraint.

---

### Section 9.2 General Cartesian Form of a Plane

Distributing the normal components in the point-normal equation:
$$A x + B y + C z - (A x_0 + B y_0 + C z_0) = 0$$

Let us define the constant scalar:
$$D \equiv -(A x_0 + B y_0 + C z_0) = -\mathbf{n} \cdot \mathbf{P}_0$$

This yields the canonical **General Cartesian Equation of a Plane**:
$$A x + B y + C z + D = 0$$

#### The Geometric Meaning of $D$:
What does the constant $D$ represent physically?
If we divide the entire equation by the magnitude of the normal $\|\mathbf{n}\| = \sqrt{A^2 + B^2 + C^2}$, the coefficients become the components of the normalized unit normal $\hat{\mathbf{n}}$:
$$\hat{\mathbf{n}} \cdot \mathbf{r} + d = 0 \iff \hat{\mathbf{n}} \cdot \mathbf{r} = -d$$
where $d = \frac{D}{\|\mathbf{n}\|}$.
- The quantity $|d| = \frac{|D|}{\|\mathbf{n}\|}$ is **the exact perpendicular distance from the origin $(0, 0, 0)$ to the plane**!
- If $D = 0$, the plane passes directly through the coordinate origin.
- The sign of $D$ reveals which side of the plane the origin lies on relative to the direction of $\mathbf{n}$.

---

### Section 9.3 Plane Defined by Three Non-Collinear Points

In computer graphics, 3D meshes are composed of polygonal triangles. Each triangle is defined by three vertices in space: $\mathbf{P}_1, \mathbf{P}_2, \mathbf{P}_3$.

```
                 P3
                /  \
               /    \
              /      \
             P1 ------> P2
```

How do we construct the plane equation containing these three points?
1. Form two edge vectors sharing base vertex $\mathbf{P}_1$:
   $$\mathbf{v}_1 = \mathbf{P}_2 - \mathbf{P}_1$$
   $$\mathbf{v}_2 = \mathbf{P}_3 - \mathbf{P}_1$$
2. Compute the surface normal using the cross product:
   $$\mathbf{n} = \mathbf{v}_1 \times \mathbf{v}_2 = (\mathbf{P}_2 - \mathbf{P}_1) \times (\mathbf{P}_3 - \mathbf{P}_1)$$
   If $\|\mathbf{n}\| = 0$, the three points are collinear and do not define a unique plane.
3. Compute the offset scalar $D$:
   $$D = -\mathbf{n} \cdot \mathbf{P}_1$$
4. The plane equation is:
   $$n_x x + n_y y + n_z z + D = 0$$

#### Determinant Formulation:
Equivalently, a point $\mathbf{r} = (x, y, z)$ lies in the plane of $\mathbf{P}_1, \mathbf{P}_2, \mathbf{P}_3$ if and only if the three vectors originating from $\mathbf{P}_1$ are coplanar:
$$\begin{vmatrix} x - x_1 & y - y_1 & z - z_1 \\ x_2 - x_1 & y_2 - y_1 & z_2 - z_1 \\ x_3 - x_1 & y_3 - y_1 & z_3 - z_1 \end{vmatrix} = 0$$

---

### Section 9.4 Signed Distance and Half-Space Partitioning

Let a plane $\Pi$ be given by $A x + B y + C z + D = 0$, with normal $\mathbf{n} = \begin{bmatrix} A & B & C \end{bmatrix}^T$.
Let $Q = (x_q, y_q, z_q)$ be an arbitrary query point in $\mathbb{R}^3$.

```
                    Q (Positive Half-Space: d > 0)
                   /|
                  / |  d_signed
                 /  |
       =========+===+========= Plane Pi (d = 0)
                P0
                 \
                  \  (Negative Half-Space: d < 0)
```

The **signed perpendicular distance** from point $Q$ to the plane is given by:
$$d_{\text{signed}}(Q, \Pi) = \frac{A x_q + B y_q + C z_q + D}{\sqrt{A^2 + B^2 + C^2}} = \frac{\mathbf{n} \cdot Q + D}{\|\mathbf{n}\|}$$

If the plane equation is normalized such that $\|\mathbf{n}\| = 1$, the formula reduces to a single dot product and an addition:
$$d_{\text{signed}}(Q, \Pi) = \hat{\mathbf{n}} \cdot Q + D$$

#### Half-Space Partitioning (Binary Space Partitioning - BSP):
The sign of $d_{\text{signed}}$ partitions all of 3D space into three disjoint subsets:
1. **Positive Half-Space ($d_{\text{signed}} > 0$):** $Q$ lies on the side of the plane toward which normal $\mathbf{n}$ points.
2. **On the Plane ($d_{\text{signed}} = 0$):** $Q$ lies exactly on the planar surface.
3. **Negative Half-Space ($d_{\text{signed}} < 0$):** $Q$ lies on the opposite side of the plane.

This operation is the fundamental primitive of **Binary Space Partitioning (BSP) trees**, camera frustum culling, and physics collision detection.

---

### Section 9.5 Dihedral Angle Between Two Planes

The angle between two intersecting planes $\Pi_1$ and $\Pi_2$ is called their **dihedral angle** $\phi$.

```
            Plane 1                Plane 2
                 \                  /
            n1    \                /    n2
              ^    \              /    ^
               \    \            /    /
                \    \   phi    /    /
                 +----\--------/----+
```

Because the orientation of each plane is uniquely defined by its normal vector, the dihedral angle between the planes is simply the spatial angle between their respective normal vectors $\mathbf{n}_1$ and $\mathbf{n}_2$:
$$\cos\phi = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{\|\mathbf{n}_1\| \|\mathbf{n}_2\|}$$

The absolute value $|\mathbf{n}_1 \cdot \mathbf{n}_2|$ is taken when measuring the acute angle between the two planes ($\phi \in [0, \frac{\pi}{2}]$ or $[0^\circ, 90^\circ]$).
- If $\mathbf{n}_1 \cdot \mathbf{n}_2 = 0$: The planes are **perpendicular** ($\phi = 90^\circ$).
- If $\mathbf{n}_1 \times \mathbf{n}_2 = \mathbf{0}$: The normals are parallel; the planes are **parallel** ($\phi = 0^\circ$).

---

### Section 9.6 Line of Intersection Between Two Non-Parallel Planes

If two planes $\Pi_1: \mathbf{n}_1 \cdot \mathbf{r} + D_1 = 0$ and $\Pi_2: \mathbf{n}_2 \cdot \mathbf{r} + D_2 = 0$ are not parallel ($\mathbf{n}_1 \times \mathbf{n}_2 \ne \mathbf{0}$), they intersect along an infinite straight line $L$.

```
                 Plane 1
                    \
                     \     Line L: r(t) = P_line + t * d
                      \   /
                       \ /
       =================X================= Plane 2
                       / \
                      /   \
```

To determine the parametric equation $\mathbf{r}(t) = \mathbf{P}_{\text{line}} + t \mathbf{d}$ of this line:

1. **Direction Vector $\mathbf{d}$:**
   The line of intersection lies simultaneously in both planes. Therefore, it must be perpendicular to both plane normals $\mathbf{n}_1$ and $\mathbf{n}_2$:
   $$\mathbf{d} = \mathbf{n}_1 \times \mathbf{n}_2$$

2. **Finding a Reference Point $\mathbf{P}_{\text{line}}$:**
   Any point on the line satisfies the two plane equations:
   $$\begin{cases} A_1 x + B_1 y + C_1 z = -D_1 \\ A_2 x + B_2 y + C_2 z = -D_2 \end{cases}$$
   Since we have two equations and three unknowns, we can set one coordinate to zero (e.g., $z = 0$, provided $d_z = (\mathbf{n}_1 \times \mathbf{n}_2)_z \ne 0$) and solve the remaining $2 \times 2$ system via Cramer's rule:
   $$\begin{bmatrix} A_1 & B_1 \\ A_2 & B_2 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} -D_1 \\ -D_2 \end{bmatrix}$$
   $$x = \frac{-D_1 B_2 - (-D_2 B_1)}{A_1 B_2 - A_2 B_1}, \quad y = \frac{A_1(-D_2) - A_2(-D_1)}{A_1 B_2 - A_2 B_1}$$

#### Direct Vector Form for the Closest Point to Origin:
Alternatively, the point on the intersection line closest to the coordinate origin is given directly by:
$$\mathbf{P}_{\text{closest}} = \frac{(-D_1 \mathbf{n}_2 + D_2 \mathbf{n}_1) \times (\mathbf{n}_1 \times \mathbf{n}_2)}{\|\mathbf{n}_1 \times \mathbf{n}_2\|^2}$$

---

### Section 9.7 Intersection of Three Planes: Unique Point Solution

Three non-parallel planes $\Pi_1, \Pi_2, \Pi_3$:
$$\begin{cases} \mathbf{n}_1 \cdot \mathbf{r} = -D_1 \\ \mathbf{n}_2 \cdot \mathbf{r} = -D_2 \\ \mathbf{n}_3 \cdot \mathbf{r} = -D_3 \end{cases}$$
intersect at a **single, unique point $\mathbf{P}^*$** if and only if their normal vectors are linearly independent, which means their scalar triple product is non-zero:
$$\Delta = [\mathbf{n}_1, \mathbf{n}_2, \mathbf{n}_3] = \mathbf{n}_1 \cdot (\mathbf{n}_2 \times \mathbf{n}_3) \ne 0$$

Using the reciprocal basis properties established in Chapter 7, the exact analytical solution for the intersection point is:
$$\mathbf{P}^* = \frac{-D_1(\mathbf{n}_2 \times \mathbf{n}_3) - D_2(\mathbf{n}_3 \times \mathbf{n}_1) - D_3(\mathbf{n}_1 \times \mathbf{n}_2)}{[\mathbf{n}_1, \mathbf{n}_2, \mathbf{n}_3]}$$

This closed-form vector formula is extensively utilized in graphics engines for computing the eight corner vertices of a perspective camera view frustum from its six bounding clipping planes!

---

### Section 9.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 9.1: Plane Equation from Point and Normal
**Problem:** Find the Cartesian equation of the plane passing through point $P_0(3, -2, 5)$ with normal vector $\mathbf{n} = \begin{bmatrix} 2 \\ 4 \\ -1 \end{bmatrix}$.

**Solution:**
Apply the point-normal formula:
$$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$$
Substitute $A = 2, B = 4, C = -1$ and $(x_0, y_0, z_0) = (3, -2, 5)$:
$$2(x - 3) + 4(y - (-2)) - 1(z - 5) = 0$$
$$2x - 6 + 4y + 8 - z + 5 = 0$$
$$2x + 4y - z + 7 = 0$$
*Verification:*
Substitute $P_0(3, -2, 5)$:
$$2(3) + 4(-2) - 5 + 7 = 6 - 8 - 5 + 7 = 0 \quad \checkmark$$

---

#### Example 9.2: Plane Defined by Three Points
**Problem:** Find the equation of the plane passing through $A(1, 1, 0)$, $B(2, 0, -1)$, and $C(0, 2, 3)$.

**Solution:**
1. Compute displacement vectors from $A$:
   $$\mathbf{u} = B - A = \begin{bmatrix} 2 - 1 \\ 0 - 1 \\ -1 - 0 \end{bmatrix} = \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix}$$
   $$\mathbf{v} = C - A = \begin{bmatrix} 0 - 1 \\ 2 - 1 \\ 3 - 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 1 \\ 3 \end{bmatrix}$$
2. Compute surface normal:
   $$\mathbf{n} = \mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & -1 & -1 \\ -1 & 1 & 3 \end{vmatrix}$$
   $$= \mathbf{i}((-1)(3) - (-1)(1)) - \mathbf{j}((1)(3) - (-1)(-1)) + \mathbf{k}((1)(1) - (-1)(-1))$$
   $$= \mathbf{i}(-3 + 1) - \mathbf{j}(3 - 1) + \mathbf{k}(1 - 1)$$
   $$= -2\mathbf{i} - 2\mathbf{j} + 0\mathbf{k} = \begin{bmatrix} -2 \\ -2 \\ 0 \end{bmatrix}$$
   We can scale by $-1/2$ to simplify: $\mathbf{n}' = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$.
3. Find constant $D$:
   $$D = -\mathbf{n}' \cdot A = -(1(1) + 1(1) + 0(0)) = -2$$
4. Plane equation:
   $$x + y - 2 = 0 \iff x + y = 2$$
*Check with points:*
- $A(1, 1, 0): 1 + 1 = 2 \quad \checkmark$
- $B(2, 0, -1): 2 + 0 = 2 \quad \checkmark$
- $C(0, 2, 3): 0 + 2 = 2 \quad \checkmark$

---

#### Example 9.3: Signed Distance and Point Classification
**Problem:** Given the plane $\Pi: 2x - y + 2z - 6 = 0$:
1. Calculate the signed distance from $Q_1(4, 3, 2)$ to the plane.
2. Calculate the signed distance from $Q_2(1, 2, -1)$ to the plane.
3. Classify their half-space locations.

**Solution:**
Normal vector $\mathbf{n} = \begin{bmatrix} 2 \\ -1 \\ 2 \end{bmatrix}$.
Magnitude:
$$\|\mathbf{n}\| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{4 + 1 + 4} = \sqrt{9} = 3$$
1. For $Q_1(4, 3, 2)$:
   $$d_{\text{signed}}(Q_1) = \frac{2(4) - 1(3) + 2(2) - 6}{3} = \frac{8 - 3 + 4 - 6}{3} = \frac{3}{3} = +1.0 \text{ units}$$
   $Q_1$ is in the **positive half-space** (1 unit in the direction of $\mathbf{n}$).
2. For $Q_2(1, 2, -1)$:
   $$d_{\text{signed}}(Q_2) = \frac{2(1) - 1(2) + 2(-1) - 6}{3} = \frac{2 - 2 - 2 - 6}{3} = \frac{-8}{3} \approx -2.667 \text{ units}$$
   $Q_2$ is in the **negative half-space** ($2.667$ units opposite to $\mathbf{n}$).

---

#### Example 9.4: Distance Between Two Parallel Planes
**Problem:** Find the perpendicular distance between the parallel planes:
$$\Pi_1: 2x - 2y + z + 4 = 0$$
$$\Pi_2: 4x - 4y + 2z - 10 = 0$$

**Solution:**
1. Normalize $\Pi_2$ so its coefficients match $\Pi_1$:
   Divide $\Pi_2$ by 2:
   $$2x - 2y + z - 5 = 0$$
2. Both planes now share the normal $\mathbf{n} = \begin{bmatrix} 2 \\ -2 \\ 1 \end{bmatrix}$, with $D_1 = 4$ and $D_2 = -5$.
3. Compute normal length:
   $$\|\mathbf{n}\| = \sqrt{2^2 + (-2)^2 + 1^2} = \sqrt{4 + 4 + 1} = \sqrt{9} = 3$$
4. Perpendicular distance formula for parallel planes:
   $$d = \frac{|D_1 - D_2|}{\|\mathbf{n}\|} = \frac{|4 - (-5)|}{3} = \frac{9}{3} = 3.0 \text{ units}$$

---

#### Example 9.5: Dihedral Angle Between Two Planes
**Problem:** Find the acute angle between the planes $\Pi_1: x + y + z - 1 = 0$ and $\Pi_2: x - 2y + 2z + 3 = 0$.

**Solution:**
1. Extract normal vectors:
   $$\mathbf{n}_1 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}, \quad \mathbf{n}_2 = \begin{bmatrix} 1 \\ -2 \\ 2 \end{bmatrix}$$
2. Compute dot product:
   $$\mathbf{n}_1 \cdot \mathbf{n}_2 = (1)(1) + (1)(-2) + (1)(2) = 1 - 2 + 2 = 1$$
3. Compute magnitudes:
   $$\|\mathbf{n}_1\| = \sqrt{1^2 + 1^2 + 1^2} = \sqrt{3}$$
   $$\|\mathbf{n}_2\| = \sqrt{1^2 + (-2)^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
4. Compute cosine:
   $$\cos\phi = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{\|\mathbf{n}_1\|\|\mathbf{n}_2\|} = \frac{1}{3\sqrt{3}} = \frac{\sqrt{3}}{9} \approx 0.19245$$
5. Angle:
   $$\phi = \arccos\left(\frac{1}{3\sqrt{3}}\right) \approx 1.37714 \text{ rad} \approx 78.904^\circ \approx 78.90^\circ$$

---

#### Example 9.6: Line of Intersection of Two Planes
**Problem:** Find the parametric equation of the line formed by the intersection of:
$$\Pi_1: x + 2y - z = 2$$
$$\Pi_2: 2x - y + z = 1$$

**Solution:**
1. Direction vector $\mathbf{d} = \mathbf{n}_1 \times \mathbf{n}_2$:
   $$\mathbf{n}_1 = \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix}, \quad \mathbf{n}_2 = \begin{bmatrix} 2 \\ -1 \\ 1 \end{bmatrix}$$
   $$\mathbf{d} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & -1 \\ 2 & -1 & 1 \end{vmatrix} = \mathbf{i}(2 - 1) - \mathbf{j}(1 - (-2)) + \mathbf{k}(-1 - 4) = \begin{bmatrix} 1 \\ -3 \\ -5 \end{bmatrix}$$
2. Find a particular point on the line by setting $z = 0$:
   $$\begin{cases} x + 2y = 2 \\ 2x - y = 1 \end{cases}$$
   Multiply the second equation by 2:
   $$4x - 2y = 2$$
   Add to the first equation:
   $$5x = 4 \implies x = 4/5$$
   From $2x - y = 1 \implies y = 2(4/5) - 1 = 8/5 - 5/5 = 3/5$.
   So reference point is $\mathbf{P}_0 = (4/5, 3/5, 0)$.
3. Parametric equations:
   $$\mathbf{r}(t) = \begin{bmatrix} 4/5 \\ 3/5 \\ 0 \end{bmatrix} + t \begin{bmatrix} 1 \\ -3 \\ -5 \end{bmatrix}$$

---

#### Example 9.7: Intersection Point of Three Planes
**Problem:** Find the point of intersection of the three planes:
$$\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 2 \end{cases}$$

**Solution:**
1. Write as matrix system $\mathbf{M} \mathbf{r} = \mathbf{b}$:
   $$\begin{bmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 2 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 6 \\ 3 \\ 2 \end{bmatrix}$$
2. Compute $\det(\mathbf{M})$:
   $$\det(\mathbf{M}) = 1((-1)(-1) - (1)(2)) - 1((2)(-1) - (1)(1)) + 1((2)(2) - (-1)(1))$$
   $$= 1(1 - 2) - 1(-2 - 1) + 1(4 + 1) = -1 + 3 + 5 = 7 \ne 0$$
   A unique intersection point exists.
3. Solve using Cramer's rule:
   $$\det(\mathbf{M}_x) = \begin{vmatrix} 6 & 1 & 1 \\ 3 & -1 & 1 \\ 2 & 2 & -1 \end{vmatrix} = 6(1 - 2) - 1(-3 - 2) + 1(6 - (-2)) = -6 + 5 + 8 = 7$$
   $$x = \frac{\det(\mathbf{M}_x)}{\det(\mathbf{M})} = \frac{7}{7} = 1$$
   $$\det(\mathbf{M}_y) = \begin{vmatrix} 1 & 6 & 1 \\ 2 & 3 & 1 \\ 1 & 2 & -1 \end{vmatrix} = 1(-3 - 2) - 6(-2 - 1) + 1(4 - 3) = -5 + 18 + 1 = 14$$
   $$y = \frac{\det(\mathbf{M}_y)}{\det(\mathbf{M})} = \frac{14}{7} = 2$$
   $$\det(\mathbf{M}_z) = \begin{vmatrix} 1 & 1 & 6 \\ 2 & -1 & 3 \\ 1 & 2 & 2 \end{vmatrix} = 1(-2 - 6) - 1(4 - 3) + 6(4 - (-1)) = -8 - 1 + 30 = 21$$
   $$z = \frac{\det(\mathbf{M}_z)}{\det(\mathbf{M})} = \frac{21}{7} = 3$$
The three planes meet at the unique point $(1, 2, 3)$.

---

#### Example 9.8: Camera View Frustum Plane Extraction
**Problem:** In 3D graphics, a camera clipping plane has unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0.6 \\ 0.8 \end{bmatrix}$ and offset $D = -4.0$. A bounding sphere has center $\mathbf{C} = (0, 10, 5)$ and radius $r = 2.0$. Determine whether the sphere is completely inside, intersecting, or completely outside this half-space.

**Solution:**
1. Compute the signed distance from sphere center to the clipping plane:
   $$d_{\text{signed}} = \hat{\mathbf{n}} \cdot \mathbf{C} + D = (0)(0) + (0.6)(10) + (0.8)(5) - 4.0 = 0 + 6.0 + 4.0 - 4.0 = 6.0$$
2. Compare with radius $r = 2.0$:
   - If $d_{\text{signed}} > +r$: Completely inside ($6.0 > 2.0 \implies$ completely inside).
   - If $|d_{\text{signed}}| \le r$: Intersecting the boundary.
   - If $d_{\text{signed}} < -r$: Completely outside (culled).
**Conclusion:** Since $d_{\text{signed}} = +6.0 > 2.0$, the bounding sphere is **COMPLETELY INSIDE** the view frustum half-space.

---

#### Example 9.9: Orthogonal Projection of a Point onto a Plane
**Problem:** Find the point $P_{\text{proj}}$ on the plane $x - 2y + 2z = 9$ closest to the point $Q(4, 1, 1)$.

**Solution:**
1. Express plane in standard form:
   $$x - 2y + 2z - 9 = 0$$
   Normal $\mathbf{n} = \begin{bmatrix} 1 \\ -2 \\ 2 \end{bmatrix}$, with $\|\mathbf{n}\| = \sqrt{1 + 4 + 4} = 3$.
2. Compute signed distance from $Q$ to the plane:
   $$d = \frac{1(4) - 2(1) + 2(1) - 9}{3} = \frac{4 - 2 + 2 - 9}{3} = \frac{-5}{3}$$
3. Project $Q$ onto the plane by subtracting $d \hat{\mathbf{n}}$:
   $$\hat{\mathbf{n}} = \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix}$$
   $$P_{\text{proj}} = Q - d \hat{\mathbf{n}} = \begin{bmatrix} 4 \\ 1 \\ 1 \end{bmatrix} - \left(-\frac{5}{3}\right) \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} 4 + 5/9 \\ 1 - 10/9 \\ 1 + 10/9 \end{bmatrix} = \begin{bmatrix} 41/9 \\ -1/9 \\ 19/9 \end{bmatrix}$$
*Check membership in plane:*
$$\frac{41}{9} - 2\left(-\frac{1}{9}\right) + 2\left(\frac{19}{9}\right) = \frac{41 + 2 + 38}{9} = \frac{81}{9} = 9 \quad \checkmark$$

---

#### Example 9.10: Reflection of a Point Across a Plane
**Problem:** Find the mirror reflection point $Q'$ of $Q(4, 1, 1)$ across the plane $x - 2y + 2z = 9$.

**Solution:**
From Example 9.9, the signed distance is $d = -5/3$.
To reflect across the plane, we travel twice the distance along the normal:
$$Q' = Q - 2 d \hat{\mathbf{n}} = \begin{bmatrix} 4 \\ 1 \\ 1 \end{bmatrix} - 2\left(-\frac{5}{3}\right) \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} 4 \\ 1 \\ 1 \end{bmatrix} + \frac{10}{3} \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} 4 + 10/9 \\ 1 - 20/9 \\ 1 + 20/9 \end{bmatrix} = \begin{bmatrix} 46/9 \\ -11/9 \\ 29/9 \end{bmatrix}$$
*Verification:*
The midpoint of $Q$ and $Q'$ must be $P_{\text{proj}}$:
$$\frac{Q + Q'}{2} = \frac{1}{2}\left( \begin{bmatrix} 36/9 \\ 9/9 \\ 9/9 \end{bmatrix} + \begin{bmatrix} 46/9 \\ -11/9 \\ 29/9 \end{bmatrix} \right) = \frac{1}{2} \begin{bmatrix} 82/9 \\ -2/9 \\ 38/9 \end{bmatrix} = \begin{bmatrix} 41/9 \\ -1/9 \\ 19/9 \end{bmatrix} = P_{\text{proj}} \quad \checkmark$$

---

### Section 9.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 9.1
**Problem:** Find the equation of the plane through $(0, 0, 0)$ with normal $\mathbf{n} = \begin{bmatrix} 5 \\ -2 \\ 1 \end{bmatrix}$.
**Solution:**
$$5(x - 0) - 2(y - 0) + 1(z - 0) = 0 \implies 5x - 2y + z = 0$$

---

#### Exercise 9.2
**Problem:** Find the unit normal of the plane $3x - 4z + 12 = 0$.
**Solution:**
$\mathbf{n} = \begin{bmatrix} 3 \\ 0 \\ -4 \end{bmatrix}$.
$$\|\mathbf{n}\| = \sqrt{3^2 + 0^2 + (-4)^2} = \sqrt{9 + 16} = 5$$
$$\hat{\mathbf{n}} = \begin{bmatrix} 3/5 \\ 0 \\ -4/5 \end{bmatrix}$$

---

#### Exercise 9.3
**Problem:** Determine whether the planes $2x - 3y + 6z = 4$ and $4x - 6y + 12z = 1$ are parallel, perpendicular, or neither.
**Solution:**
$\mathbf{n}_1 = \begin{bmatrix} 2 \\ -3 \\ 6 \end{bmatrix}$, $\mathbf{n}_2 = \begin{bmatrix} 4 \\ -6 \\ 12 \end{bmatrix}$.
Notice $\mathbf{n}_2 = 2 \mathbf{n}_1$.
Since their normal vectors are proportional, the planes are **parallel**.

---

#### Exercise 9.4
**Problem:** Calculate the distance from point $(2, 3, 4)$ to the plane $x + 2y - 2z + 5 = 0$.
**Solution:**
$$d = \frac{|1(2) + 2(3) - 2(4) + 5|}{\sqrt{1^2 + 2^2 + (-2)^2}} = \frac{|2 + 6 - 8 + 5|}{\sqrt{1 + 4 + 4}} = \frac{|5|}{3} = \frac{5}{3} \approx 1.667 \text{ units}$$

---

#### Exercise 9.5
**Problem:** Find the angle between the planes $x = 0$ and $x + y = 0$.
**Solution:**
$\mathbf{n}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$, $\mathbf{n}_2 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$.
$$\cos\phi = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{\|\mathbf{n}_1\|\|\mathbf{n}_2\|} = \frac{|(1)(1) + 0 + 0|}{1 \times \sqrt{2}} = \frac{1}{\sqrt{2}} \implies \phi = 45^\circ$$

---

#### Exercise 9.6
**Problem:** Find the $x$, $y$, and $z$ intercepts of the plane $2x + 3y + 4z = 12$.
**Solution:**
- $x$-intercept (set $y=0, z=0$): $2x = 12 \implies x = 6 \implies (6, 0, 0)$
- $y$-intercept (set $x=0, z=0$): $3y = 12 \implies y = 4 \implies (0, 4, 0)$
- $z$-intercept (set $x=0, y=0$): $4z = 12 \implies z = 3 \implies (0, 0, 3)$

---

#### Exercise 9.7
**Problem:** Write down the equation of the plane containing points $(a, 0, 0)$, $(0, b, 0)$, and $(0, 0, c)$ (the intercept form).
**Solution:**
$$\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1$$

---

#### Exercise 9.8
**Problem:** Under what condition is a line with direction $\mathbf{d}$ parallel to a plane with normal $\mathbf{n}$?
**Solution:**
A line is parallel to a plane if and only if its direction vector is perpendicular to the plane's normal vector:
$$\mathbf{d} \cdot \mathbf{n} = 0$$

---

#### Exercise 9.9
**Problem:** Find the distance from the origin $(0, 0, 0)$ to the plane $3x - 2y + 6z - 21 = 0$.
**Solution:**
$$d = \frac{|-21|}{\sqrt{3^2 + (-2)^2 + 6^2}} = \frac{21}{\sqrt{9 + 4 + 36}} = \frac{21}{\sqrt{49}} = \frac{21}{7} = 3 \text{ units}$$

---

#### Exercise 9.10
**Problem:** Find the intersection point of the line $\mathbf{r}(t) = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix} + t \begin{bmatrix} 2 \\ 1 \\ -1 \end{bmatrix}$ with the plane $x + 2y + 3z = 17$.
**Solution:**
Substitute parametric line equations $x = 1+2t, y = t, z = 2-t$ into the plane equation:
$$(1 + 2t) + 2(t) + 3(2 - t) = 17$$
$$1 + 2t + 2t + 6 - 3t = 17$$
$$t + 7 = 17 \implies t = 10$$
Substitute $t = 10$ into the line equation:
$$\mathbf{r}(10) = \begin{bmatrix} 1 + 2(10) \\ 10 \\ 2 - 10 \end{bmatrix} = \begin{bmatrix} 21 \\ 10 \\ -8 \end{bmatrix}$$
*Check membership in plane:*
$$21 + 2(10) + 3(-8) = 21 + 20 - 24 = 17 \quad \checkmark$$
