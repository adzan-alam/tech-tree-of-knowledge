# Chapter 8: Lines and Skew Rays in 3D Space

> *"In the flat plane of Euclid, two straight lines that never meet must needs be parallel; but in the vast theatre of three dimensions, lines may pass one another like ships in the night—infinitely separated, never parallel, and never touching."*  
> — **Gaspard Monge**, *Application de l'Analyse à la Géométrie* (1807)

---

### Section 8.1 Vector and Parametric Equations of a Line in $\mathbb{R}^3$

In two-dimensional analytic geometry, a straight line is customarily described by a single scalar equation: $y = mx + b$ or $Ax + By + C = 0$. In three-dimensional space, however, a single linear equation in coordinates $(x, y, z)$ does **not** describe a line—it describes an infinite **two-dimensional plane**!

To define a 1D line in $\mathbb{R}^3$, we must specify a trajectory through space parameterized by a real scalar $t \in \mathbb{R}$.

Let $\mathbf{P}_0 = (x_0, y_0, z_0)$ be a known reference point on the line, and let $\mathbf{d} = \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix}$ be a non-zero **direction vector** pointing along the line.

```
                   r(t) = P0 + t * d
                 +-----------------------> Line L
                /
               /
              / P0
             /
            /
           O
```

Any point $\mathbf{r}(t) = (x(t), y(t), z(t))$ on the line is reached by starting at $\mathbf{P}_0$ and traveling a scaled distance along direction $\mathbf{d}$:
$$\mathbf{r}(t) = \mathbf{P}_0 + t \mathbf{d}, \quad t \in \mathbb{R}$$

In scalar Cartesian components, this yields the **parametric equations** of the line:
$$\begin{cases} x(t) = x_0 + t \, d_x \\ y(t) = y_0 + t \, d_y \\ z(t) = z_0 + t \, d_z \end{cases}$$

#### Rays versus Line Segments:
- **Infinite Line:** $-\infty < t < \infty$.
- **Ray (Half-Line):** $0 \le t < \infty$ (emanating from origin $\mathbf{P}_0$ toward $\mathbf{d}$, ubiquitous in raytracing and optics).
- **Line Segment:** $0 \le t \le 1$ connecting endpoints $\mathbf{P}_0$ and $\mathbf{P}_1$ (where $\mathbf{d} = \mathbf{P}_1 - \mathbf{P}_0$).

---

### Section 8.2 Symmetric Form of a Line Equation

If all three direction components are non-zero ($d_x \ne 0, d_y \ne 0, d_z \ne 0$), we can solve each parametric equation for the common parameter $t$:
$$t = \frac{x - x_0}{d_x} = \frac{y - y_0}{d_y} = \frac{z - z_0}{d_z}$$

This continuous double equality is the **symmetric form** of the line.

Notice that this double equality actually represents the simultaneous intersection of two independent planes:
$$\frac{x - x_0}{d_x} = \frac{y - y_0}{d_y} \iff d_y(x - x_0) - d_x(y - y_0) = 0 \quad (\text{Plane 1})$$
$$\frac{y - y_0}{d_y} = \frac{z - z_0}{d_z} \iff d_z(y - y_0) - d_y(z - z_0) = 0 \quad (\text{Plane 2})$$

A 1D line in 3D space is geometrically the intersection of two non-parallel 2D planes!

*Handling Zero Components:*  
If one component is zero, say $d_z = 0$, the line remains parallel to the $xy$-plane, and its symmetric form is written as:
$$\frac{x - x_0}{d_x} = \frac{y - y_0}{d_y}, \quad z = z_0$$

---

### Section 8.3 The Four Relative Configurations of Two Lines in 3D

In 2D, two lines can only be parallel, coincident, or intersecting. In 3D space, there are **four** mutually exclusive geometric relationships between two lines $L_1: \mathbf{r}_1(s) = \mathbf{P}_1 + s\mathbf{d}_1$ and $L_2: \mathbf{r}_2(t) = \mathbf{P}_2 + t\mathbf{d}_2$:

```
        Parallel                Intersecting                   Skew
    L1 ------------>         L1 \     / L2               L1 ------------>
    L2 ------------>             \   /                      
                                  \ /                     L2 ...../.....
                                   X                             /
                                  / \                           /
```

1. **Coincident:** The lines are identical ($L_1 = L_2$). Direction vectors are collinear ($\mathbf{d}_1 \times \mathbf{d}_2 = \mathbf{0}$) and $\mathbf{P}_2 - \mathbf{P}_1$ is also collinear with $\mathbf{d}_1$.
2. **Parallel (Distinct):** Direction vectors are collinear ($\mathbf{d}_1 \times \mathbf{d}_2 = \mathbf{0}$), but $\mathbf{P}_2$ does not lie on $L_1$ ($(\mathbf{P}_2 - \mathbf{P}_1) \times \mathbf{d}_1 \ne \mathbf{0}$).
3. **Intersecting:** The direction vectors are not collinear ($\mathbf{d}_1 \times \mathbf{d}_2 \ne \mathbf{0}$), they share a common plane ($[(\mathbf{P}_2 - \mathbf{P}_1), \mathbf{d}_1, \mathbf{d}_2] = 0$), and meet at exactly one intersection point.
4. **Skew:** The lines are not parallel ($\mathbf{d}_1 \times \mathbf{d}_2 \ne \mathbf{0}$) and **never intersect**! They lie in different parallel planes ($[(\mathbf{P}_2 - \mathbf{P}_1), \mathbf{d}_1, \mathbf{d}_2] \ne 0$).

Skew lines are a unique phenomenon of 3D (and higher) space. In our physical world, high-voltage power lines crossing at different altitudes over a highway are skew lines.

---

### Section 8.4 Distance from an Arbitrary Point to a 3D Line

Let a line $L$ be given by $\mathbf{r}(t) = \mathbf{P}_0 + t\mathbf{d}$, and let $Q \in \mathbb{R}^3$ be an arbitrary query point not necessarily on $L$.

```
                 Q
                /|
               / |
              /  |  d_perp = ||(Q - P0) x d|| / ||d||
             /   |
            /    |
          P0-----+----------> d
               proj
```

Consider the displacement vector from $\mathbf{P}_0$ to $Q$:
$$\mathbf{v} = Q - \mathbf{P}_0$$
Together with direction vector $\mathbf{d}$, $\mathbf{v}$ spans a parallelogram in space whose base has length $\|\mathbf{d}\|$.
The area of this parallelogram is given by the cross product magnitude:
$$\text{Area} = \|\mathbf{v} \times \mathbf{d}\| = \|(Q - \mathbf{P}_0) \times \mathbf{d}\|$$

On the other hand, the area of any parallelogram is base $\times$ perpendicular height:
$$\text{Area} = \|\mathbf{d}\| \times d_{\perp}$$

Equating the two expressions and solving for the perpendicular distance $d_{\perp}$:
$$d(Q, L) = \frac{\|(Q - \mathbf{P}_0) \times \mathbf{d}\|}{\|\mathbf{d}\|}$$

If $\hat{\mathbf{d}}$ is already normalized ($\|\hat{\mathbf{d}}\| = 1$), the denominator is 1, simplifying directly to:
$$d(Q, L) = \|(Q - \mathbf{P}_0) \times \hat{\mathbf{d}}\|$$

---

### Section 8.5 Shortest Distance Between Two Skew Lines

Let two skew lines be defined by:
$$L_1: \mathbf{r}_1(s) = \mathbf{P}_1 + s \mathbf{d}_1$$
$$L_2: \mathbf{r}_2(t) = \mathbf{P}_2 + t \mathbf{d}_2$$

Since the lines are non-parallel, their direction cross product $\mathbf{n} = \mathbf{d}_1 \times \mathbf{d}_2$ is a non-zero vector. By construction, $\mathbf{n}$ is perpendicular to *both* lines!

```
         L1 --------- P1 ------------------> d1
                       \
                        \  (P2 - P1)
                         \
         L2 ..............P2 ............... d2
                           \
                            v  n = d1 x d2
```

We can envision two parallel planes $\Pi_1$ and $\Pi_2$:
- $\Pi_1$ contains line $L_1$ and has normal $\mathbf{n}$.
- $\Pi_2$ contains line $L_2$ and has normal $\mathbf{n}$.

The shortest distance between the two lines is precisely the perpendicular distance between these two parallel planes!
Any vector connecting a point on $L_1$ to a point on $L_2$ is $\mathbf{w} = \mathbf{P}_2 - \mathbf{P}_1$.
The shortest distance is the absolute scalar projection of $\mathbf{w}$ onto the mutual unit normal $\hat{\mathbf{n}}$:
$$d_{\text{skew}} = |\mathbf{w} \cdot \hat{\mathbf{n}}| = \left| (\mathbf{P}_2 - \mathbf{P}_1) \cdot \frac{\mathbf{d}_1 \times \mathbf{d}_2}{\|\mathbf{d}_1 \times \mathbf{d}_2\|} \right|$$

$$d_{\text{skew}} = \frac{|(\mathbf{P}_2 - \mathbf{P}_1) \cdot (\mathbf{d}_1 \times \mathbf{d}_2)|}{\|\mathbf{d}_1 \times \mathbf{d}_2\|} = \frac{|[\mathbf{P}_2 - \mathbf{P}_1, \mathbf{d}_1, \mathbf{d}_2]|}{\|\mathbf{d}_1 \times \mathbf{d}_2\|}$$

Notice the extraordinary geometric elegance: the numerator is the volume of the parallelepiped spanned by the displacement and both directions, and the denominator is the area of the base!

---

### Section 8.6 Closest Points of Approach (CPA) on Two Rays

Knowing the minimum distance $d_{\text{skew}}$ is often not enough: in physics engines and robotics, we need the exact coordinates of the two points $C_1 \in L_1$ and $C_2 \in L_2$ where this closest approach occurs.

Let the points be parameterized by unknown scalars $s^*$ and $t^*$:
$$C_1 = \mathbf{P}_1 + s^* \mathbf{d}_1$$
$$C_2 = \mathbf{P}_2 + t^* \mathbf{d}_2$$

The vector connecting them is $\mathbf{v}(s^*, t^*) = C_1 - C_2 = (\mathbf{P}_1 - \mathbf{P}_2) + s^* \mathbf{d}_1 - t^* \mathbf{d}_2$.

At the points of closest approach, the segment $C_1 C_2$ must be simultaneously perpendicular to both direction vectors $\mathbf{d}_1$ and $\mathbf{d}_2$:
$$\begin{cases} \mathbf{v}(s^*, t^*) \cdot \mathbf{d}_1 = 0 \\ \mathbf{v}(s^*, t^*) \cdot \mathbf{d}_2 = 0 \end{cases}$$

Let us define the scalar constants:
- $\mathbf{w}_0 = \mathbf{P}_1 - \mathbf{P}_2$
- $a = \mathbf{d}_1 \cdot \mathbf{d}_1 = \|\mathbf{d}_1\|^2$
- $b = \mathbf{d}_1 \cdot \mathbf{d}_2$
- $c = \mathbf{d}_2 \cdot \mathbf{d}_2 = \|\mathbf{d}_2\|^2$
- $d = \mathbf{d}_1 \cdot \mathbf{w}_0$
- $e = \mathbf{d}_2 \cdot \mathbf{w}_0$

Expanding the two orthogonality conditions:
1. $(\mathbf{w}_0 + s^* \mathbf{d}_1 - t^* \mathbf{d}_2) \cdot \mathbf{d}_1 = 0 \implies d + s^* a - t^* b = 0 \implies a s^* - b t^* = -d$
2. $(\mathbf{w}_0 + s^* \mathbf{d}_1 - t^* \mathbf{d}_2) \cdot \mathbf{d}_2 = 0 \implies e + s^* b - t^* c = 0 \implies b s^* - c t^* = -e$

In matrix form:
$$\begin{bmatrix} a & -b \\ b & -c \end{bmatrix} \begin{bmatrix} s^* \\ t^* \end{bmatrix} = \begin{bmatrix} -d \\ -e \end{bmatrix}$$

The determinant of this $2 \times 2$ system is:
$$\Delta = -ac - (-b^2) = b^2 - ac = (\mathbf{d}_1 \cdot \mathbf{d}_2)^2 - \|\mathbf{d}_1\|^2 \|\mathbf{d}_2\|^2 = -\|\mathbf{d}_1 \times \mathbf{d}_2\|^2$$

Since the lines are non-parallel, $\|\mathbf{d}_1 \times \mathbf{d}_2\| \ne 0$, so $\Delta < 0$, guaranteeing a unique solution!
Applying Cramer's rule:
$$s^* = \frac{b e - c d}{a c - b^2}$$
$$t^* = \frac{a e - b d}{a c - b^2}$$

#### Clamping for Finite Line Segments (Capsule-Capsule Collisions):
If testing finite line segments $s \in [0, 1]$ and $t \in [0, 1]$, if $s^*$ or $t^*$ falls outside $[0, 1]$, the unconstrained closest points lie outside the segment endpoints. One must clamp the out-of-bounds parameter to the boundary $[0, 1]$ and re-project onto the other segment. This algorithm is the basis of **capsule-capsule collision detection** in Unreal Engine, Unity, and PhysX.

---

### Section 8.7 Continuous Collision Detection (CCD)

In high-speed bullet or projectile simulations, discrete frame-by-frame collision detection suffers from **tunneling**: a fast bullet can completely pass through a thin wall between frame $k$ and frame $k+1$ without ever overlapping it.

```
       Frame k                  Frame k+1
       Bullet ●                 (Inside Wall)            Bullet ●
          |                                                 |
          v                                                 v
       ====================== WALL ==========================
```

Continuous Collision Detection (CCD) solves tunneling by modeling the moving projectile as a swept ray or swept sphere:
$$\mathbf{r}(t) = \mathbf{P}(t_0) + t \mathbf{v} \Delta t, \quad t \in [0, 1]$$
The problem of collision reduces to intersecting this dynamic 3D ray segment with static scene geometry (planes, triangles, or other swept rays).

---

### Section 8.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 8.1: Finding Vector and Parametric Equations
**Problem:** Find the vector and parametric equations of the 3D line passing through points $A(2, -1, 4)$ and $B(5, 3, -2)$.

**Solution:**
1. Direction vector:
   $$\mathbf{d} = B - A = \begin{bmatrix} 5 - 2 \\ 3 - (-1) \\ -2 - 4 \end{bmatrix} = \begin{bmatrix} 3 \\ 4 \\ -6 \end{bmatrix}$$
2. Vector equation taking $A$ as base point:
   $$\mathbf{r}(t) = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix} + t \begin{bmatrix} 3 \\ 4 \\ -6 \end{bmatrix}, \quad t \in \mathbb{R}$$
3. Parametric equations:
   $$x(t) = 2 + 3t$$
   $$y(t) = -1 + 4t$$
   $$z(t) = 4 - 6t$$

---

#### Example 8.2: Symmetric Form and Point Membership
**Problem:** A line has symmetric form $\frac{x - 1}{2} = \frac{y + 3}{-1} = \frac{z - 5}{4}$.
1. Find a reference point $\mathbf{P}_0$ and direction vector $\mathbf{d}$.
2. Determine whether the point $Q(7, -6, 17)$ lies on this line.

**Solution:**
1. Reference point $\mathbf{P}_0 = (1, -3, 5)$ and direction vector $\mathbf{d} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}$.
2. Substitute coordinates of $Q$ into the symmetric ratios:
   $$t_x = \frac{7 - 1}{2} = \frac{6}{2} = 3$$
   $$t_y = \frac{-6 - (-3)}{-1} = \frac{-3}{-1} = 3$$
   $$t_z = \frac{17 - 5}{4} = \frac{12}{4} = 3$$
Since $t_x = t_y = t_z = 3$, all three ratios are identical.
**Conclusion:** The point $Q$ lies on the line (at parameter $t = 3$).

---

#### Example 8.3: Distance from a Point to a 3D Line
**Problem:** Find the perpendicular distance from point $Q(1, 1, 5)$ to the line $\mathbf{r}(t) = \begin{bmatrix} 0 \\ 1 \\ 2 \end{bmatrix} + t \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$.

**Solution:**
1. Extract $\mathbf{P}_0 = (0, 1, 2)$ and $\mathbf{d} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$.
2. Vector from $\mathbf{P}_0$ to $Q$:
   $$\mathbf{v} = Q - \mathbf{P}_0 = \begin{bmatrix} 1 - 0 \\ 1 - 1 \\ 5 - 2 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 3 \end{bmatrix}$$
3. Compute cross product $\mathbf{v} \times \mathbf{d}$:
   $$\mathbf{v} \times \mathbf{d} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 0 & 3 \\ 1 & 2 & 2 \end{vmatrix} = \mathbf{i}(0 - 6) - \mathbf{j}(2 - 3) + \mathbf{k}(2 - 0) = \begin{bmatrix} -6 \\ 1 \\ 2 \end{bmatrix}$$
4. Compute magnitudes:
   $$\|\mathbf{v} \times \mathbf{d}\| = \sqrt{(-6)^2 + 1^2 + 2^2} = \sqrt{36 + 1 + 4} = \sqrt{41} \approx 6.403124$$
   $$\|\mathbf{d}\| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
5. Distance:
   $$d = \frac{\sqrt{41}}{3} \approx 2.13437 \text{ units}$$

---

#### Example 8.4: Classifying Line Relationships in 3D
**Problem:** Classify the relationship between the two lines:
$$L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} + s \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}$$
$$L_2: \mathbf{r}_2(t) = \begin{bmatrix} 2 \\ 0 \\ 2 \end{bmatrix} + t \begin{bmatrix} -2 \\ 2 \\ -4 \end{bmatrix}$$

**Solution:**
1. Check direction vectors:
   $$\mathbf{d}_1 = \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}, \quad \mathbf{d}_2 = \begin{bmatrix} -2 \\ 2 \\ -4 \end{bmatrix}$$
   Notice that $\mathbf{d}_2 = -2 \mathbf{d}_1$. Their cross product is zero; the lines are parallel or coincident.
2. Check if $\mathbf{P}_1(1, 1, 0)$ lies on $L_2$:
   $$\begin{cases} 1 = 2 - 2t \implies 2t = 1 \implies t = 1/2 \\ 1 = 0 + 2t \implies t = 1/2 \\ 0 = 2 - 4t \implies 4t = 2 \implies t = 1/2 \end{cases}$$
Since $t = 1/2$ satisfies all three equations, the reference point $\mathbf{P}_1$ lies on $L_2$.
**Conclusion:** The lines are **COINCIDENT** (they are the exact same line).

---

#### Example 8.5: Intersection of Two Non-Parallel Coplanar Lines
**Problem:** Find the point of intersection between:
$$L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 2 \\ 0 \end{bmatrix} + s \begin{bmatrix} 2 \\ -1 \\ 1 \end{bmatrix}$$
$$L_2: \mathbf{r}_2(t) = \begin{bmatrix} 3 \\ 0 \\ 5 \end{bmatrix} + t \begin{bmatrix} 1 \\ 1 \\ -2 \end{bmatrix}$$

**Solution:**
Equate coordinates component-wise:
1. $1 + 2s = 3 + t \implies 2s - t = 2$ (Eq. 1)
2. $2 - s = 0 + t \implies s + t = 2$ (Eq. 2)
3. $0 + s = 5 - 2t \implies s + 2t = 5$ (Eq. 3)

Add Eq. 1 and Eq. 2:
$$(2s - t) + (s + t) = 2 + 2 \implies 3s = 4 \implies s = 4/3$$
From Eq. 2:
$$t = 2 - s = 2 - 4/3 = 2/3$$

Now check if $(s = 4/3, t = 2/3)$ satisfies Eq. 3:
$$s + 2t = \frac{4}{3} + 2\left(\frac{2}{3}\right) = \frac{4}{3} + \frac{4}{3} = \frac{8}{3} \ne 5$$
Because $8/3 \ne 5$, the system is inconsistent! The lines do not intersect.
Since their directions $\mathbf{d}_1 \ne c \mathbf{d}_2$, the lines are **SKEW**.

---

#### Example 8.6: Shortest Distance Between Two Skew Lines
**Problem:** Find the shortest distance between the skew lines:
$$L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + s \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
$$L_2: \mathbf{r}_2(t) = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix} + t \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$

**Solution:**
1. Base points and directions:
   $$\mathbf{P}_1 = (1, 0, 0), \quad \mathbf{d}_1 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \mathbf{j}$$
   $$\mathbf{P}_2 = (0, 0, 2), \quad \mathbf{d}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \mathbf{i}$$
2. Vector connecting reference points:
   $$\mathbf{P}_2 - \mathbf{P}_1 = \begin{bmatrix} 0 - 1 \\ 0 - 0 \\ 2 - 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 0 \\ 2 \end{bmatrix}$$
3. Mutual perpendicular normal:
   $$\mathbf{n} = \mathbf{d}_1 \times \mathbf{d}_2 = \mathbf{j} \times \mathbf{i} = -\mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$$
   $$\|\mathbf{n}\| = 1$$
4. Scalar triple product:
   $$(\mathbf{P}_2 - \mathbf{P}_1) \cdot \mathbf{n} = (-1)(0) + (0)(0) + (2)(-1) = -2$$
5. Shortest distance:
   $$d_{\text{skew}} = \frac{|-2|}{1} = 2 \text{ units}$$
*Geometric intuition:* $L_1$ is a line parallel to the $y$-axis in the ground plane $z = 0$. $L_2$ is a line parallel to the $x$-axis in the plane $z = 2$. The perpendicular distance between the two planes is obviously $2 - 0 = 2 \quad \checkmark$.

---

#### Example 8.7: Analytical CPA Calculation on Two Skew Rays
**Problem:** Two drones fly along linear trajectories in space:
- Drone 1: $\mathbf{r}_1(s) = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} + s \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}$
- Drone 2: $\mathbf{r}_2(t) = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix} + t \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix}$
Find the closest points of approach $C_1$ and $C_2$ on each trajectory and the minimum separation distance.

**Solution:**
1. Extract values:
   $$\mathbf{P}_1 = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{d}_1 = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}$$
   $$\mathbf{P}_2 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}, \quad \mathbf{d}_2 = \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix}$$
   $$\mathbf{w}_0 = \mathbf{P}_1 - \mathbf{P}_2 = \begin{bmatrix} 0 \\ -3 \\ -4 \end{bmatrix}$$
2. Compute dot products:
   $$a = \mathbf{d}_1 \cdot \mathbf{d}_1 = 1^2 + 2^2 + 1^2 = 6$$
   $$b = \mathbf{d}_1 \cdot \mathbf{d}_2 = (1)(2) + (2)(0) + (1)(-1) = 2 - 1 = 1$$
   $$c = \mathbf{d}_2 \cdot \mathbf{d}_2 = 2^2 + 0^2 + (-1)^2 = 5$$
   $$d = \mathbf{d}_1 \cdot \mathbf{w}_0 = (1)(0) + (2)(-3) + (1)(-4) = -6 - 4 = -10$$
   $$e = \mathbf{d}_2 \cdot \mathbf{w}_0 = (2)(0) + (0)(-3) + (-1)(-4) = 4$$
3. Denominator:
   $$D = ac - b^2 = (6)(5) - 1^2 = 30 - 1 = 29$$
4. Compute $s^*$ and $t^*$:
   $$s^* = \frac{be - cd}{D} = \frac{(1)(4) - (5)(-10)}{29} = \frac{4 + 50}{29} = \frac{54}{29} \approx 1.86207$$
   $$t^* = \frac{ae - bd}{D} = \frac{(6)(4) - (1)(-10)}{29} = \frac{24 + 10}{29} = \frac{34}{29} \approx 1.17241$$
5. Compute closest points:
   $$C_1 = \mathbf{P}_1 + s^* \mathbf{d}_1 = \frac{54}{29} \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 54/29 \\ 108/29 \\ 54/29 \end{bmatrix}$$
   $$C_2 = \mathbf{P}_2 + t^* \mathbf{d}_2 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix} + \frac{34}{29} \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 68/29 \\ 87/29 \\ 82/29 \end{bmatrix}$$
6. Connecting vector $C_1 - C_2$:
   $$C_1 - C_2 = \begin{bmatrix} (54 - 68)/29 \\ (108 - 87)/29 \\ (54 - 82)/29 \end{bmatrix} = \frac{1}{29} \begin{bmatrix} -14 \\ 21 \\ -28 \end{bmatrix} = \frac{7}{29} \begin{bmatrix} -2 \\ 3 \\ -4 \end{bmatrix}$$
7. Check orthogonality to $\mathbf{d}_1$ and $\mathbf{d}_2$:
   $$\begin{bmatrix} -2 \\ 3 \\ -4 \end{bmatrix} \cdot \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} = -2 + 6 - 4 = 0 \quad \checkmark$$
   $$\begin{bmatrix} -2 \\ 3 \\ -4 \end{bmatrix} \cdot \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix} = -4 + 0 + 4 = 0 \quad \checkmark$$
8. Minimum distance:
   $$d_{\min} = \frac{7}{29} \sqrt{(-2)^2 + 3^2 + (-4)^2} = \frac{7}{29} \sqrt{4 + 9 + 16} = \frac{7\sqrt{29}}{29} = \frac{7}{\sqrt{29}} \approx 1.29986 \text{ m}$$

---

#### Example 8.8: Ray-Sphere Intersection Formulation
**Problem:** A ray has origin $\mathbf{P}_0 = (0, 0, -10)$ and normalized direction $\hat{\mathbf{d}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$. A solid sphere has center $\mathbf{C} = (0, 0, 0)$ and radius $R = 3$. Find the entry and exit hit points on the sphere.

**Solution:**
A point on the ray is $\mathbf{P}(t) = \mathbf{P}_0 + t\hat{\mathbf{d}}$ for $t \ge 0$.
The equation of the sphere is $\|\mathbf{P} - \mathbf{C}\|^2 = R^2$.
Let $\mathbf{m} = \mathbf{P}_0 - \mathbf{C} = \begin{bmatrix} 0 \\ 0 \\ -10 \end{bmatrix}$.
Substitute the ray equation:
$$\|\mathbf{m} + t\hat{\mathbf{d}}\|^2 = R^2 \implies (\mathbf{m} + t\hat{\mathbf{d}}) \cdot (\mathbf{m} + t\hat{\mathbf{d}}) = R^2$$
$$(\hat{\mathbf{d}} \cdot \hat{\mathbf{d}}) t^2 + 2(\mathbf{m} \cdot \hat{\mathbf{d}}) t + (\mathbf{m} \cdot \mathbf{m} - R^2) = 0$$
Since $\|\hat{\mathbf{d}}\| = 1$:
$$t^2 + 2 b t + c = 0$$
where:
$$b = \mathbf{m} \cdot \hat{\mathbf{d}} = (0)(0) + (0)(0) + (-10)(1) = -10$$
$$c = \mathbf{m} \cdot \mathbf{m} - R^2 = (-10)^2 - 3^2 = 100 - 9 = 91$$
Discriminant:
$$\Delta = b^2 - c = (-10)^2 - 91 = 100 - 91 = 9$$
Since $\Delta = 9 > 0$, the ray pierces the sphere in two distinct points:
$$t = -b \pm \sqrt{\Delta} = -(-10) \pm \sqrt{9} = 10 \pm 3$$
- Entry hit: $t_1 = 10 - 3 = 7 \implies \mathbf{P}(7) = (0, 0, -3)$
- Exit hit: $t_2 = 10 + 3 = 13 \implies \mathbf{P}(13) = (0, 0, 3)$

---

#### Example 8.9: Capsule Geometry Representation
**Problem:** In physics engines, a capsule collider is defined by a central line segment between points $A(0, 0, 1)$ and $B(0, 0, 5)$, with radius $r = 0.5$. Determine whether a test point $P(0.4, 0.3, 3.0)$ is inside the capsule.

**Solution:**
1. Capsule segment direction:
   $$\mathbf{d} = B - A = \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix}$$
2. Vector from $A$ to $P$:
   $$\mathbf{v} = P - A = \begin{bmatrix} 0.4 - 0 \\ 0.3 - 0 \\ 3.0 - 1 \end{bmatrix} = \begin{bmatrix} 0.4 \\ 0.3 \\ 2.0 \end{bmatrix}$$
3. Project $P$ onto the infinite line containing $AB$:
   $$t = \frac{\mathbf{v} \cdot \mathbf{d}}{\mathbf{d} \cdot \mathbf{d}} = \frac{(0.4)(0) + (0.3)(0) + (2.0)(4)}{0^2 + 0^2 + 4^2} = \frac{8}{16} = 0.5$$
4. Clamp $t$ to segment range $[0, 1]$:
   $$t_{\text{clamped}} = \max(0, \min(1, 0.5)) = 0.5$$
5. Closest point on central core segment:
   $$C = A + 0.5 \mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$$
6. Distance from $P$ to core segment:
   $$\text{dist} = \|P - C\| = \sqrt{(0.4 - 0)^2 + (0.3 - 0)^2 + (3.0 - 3.0)^2} = \sqrt{0.16 + 0.09 + 0} = \sqrt{0.25} = 0.5$$
Since $\text{dist} = 0.5 \le r = 0.5$, the point lies exactly on the boundary of the capsule.

---

#### Example 8.10: Angle Between Two 3D Lines
**Problem:** Find the acute angle between the two lines:
$$L_1: \frac{x-1}{2} = \frac{y+2}{1} = \frac{z-3}{-2}$$
$$L_2: \frac{x+5}{1} = \frac{y-1}{2} = \frac{z}{2}$$

**Solution:**
1. Extract direction vectors:
   $$\mathbf{d}_1 = \begin{bmatrix} 2 \\ 1 \\ -2 \end{bmatrix}, \quad \mathbf{d}_2 = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$$
2. Compute dot product:
   $$\mathbf{d}_1 \cdot \mathbf{d}_2 = (2)(1) + (1)(2) + (-2)(2) = 2 + 2 - 4 = 0$$
3. Angle:
   $$\cos\theta = \frac{0}{\|\mathbf{d}_1\|\|\mathbf{d}_2\|} = 0 \implies \theta = 90^\circ$$
The two lines are mutually perpendicular.

---

### Section 8.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 8.1
**Problem:** Write down the parametric equations for the line through point $(1, -2, 3)$ with direction $\begin{bmatrix} 4 \\ 0 \\ -5 \end{bmatrix}$.
**Solution:**
$$\begin{cases} x(t) = 1 + 4t \\ y(t) = -2 \\ z(t) = 3 - 5t \end{cases}$$

---

#### Exercise 8.2
**Problem:** Convert the parametric line $x = 3 - 2t, y = 4 + 5t, z = 1 + t$ into symmetric form.
**Solution:**
Solve for $t$:
$$\frac{x - 3}{-2} = \frac{y - 4}{5} = \frac{z - 1}{1}$$

---

#### Exercise 8.3
**Problem:** Find the distance from origin $O(0, 0, 0)$ to the line $\mathbf{r}(t) = \begin{bmatrix} 3 \\ 4 \\ 0 \end{bmatrix} + t \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$.
**Solution:**
$\mathbf{P}_0 = (3, 4, 0)$, $\mathbf{d} = (0, 0, 1)$ (unit vector).
$\mathbf{v} = O - \mathbf{P}_0 = \begin{bmatrix} -3 \\ -4 \\ 0 \end{bmatrix}$.
$$\mathbf{v} \times \mathbf{d} = \begin{bmatrix} -3 \\ -4 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} -4 \\ 3 \\ 0 \end{bmatrix}$$
$$\text{dist} = \|\mathbf{v} \times \mathbf{d}\| = \sqrt{(-4)^2 + 3^2 + 0^2} = \sqrt{16 + 9} = 5 \text{ units}$$

---

#### Exercise 8.4
**Problem:** Are the lines $L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} + s \begin{bmatrix} 2 \\ 1 \\ 3 \end{bmatrix}$ and $L_2: \mathbf{r}_2(t) = \begin{bmatrix} 0 \\ 2 \\ 2 \end{bmatrix} + t \begin{bmatrix} 4 \\ 2 \\ 6 \end{bmatrix}$ parallel or coincident?
**Solution:**
$\mathbf{d}_2 = 2\mathbf{d}_1$, so they are parallel.
Check if $\mathbf{P}_1(1, 0, 1)$ lies on $L_2$:
$$\begin{cases} 1 = 0 + 4t \implies t = 1/4 \\ 0 = 2 + 2t \implies t = -1 \end{cases}$$
Since $1/4 \ne -1$, $\mathbf{P}_1$ does not lie on $L_2$.
Therefore, the lines are **distinct parallel lines**.

---

#### Exercise 8.5
**Problem:** Find the distance between the parallel lines from Exercise 8.4.
**Solution:**
Distance from $\mathbf{P}_1(1, 0, 1)$ to $L_2$:
$\mathbf{P}_2 = (0, 2, 2)$, $\mathbf{d} = \begin{bmatrix} 2 \\ 1 \\ 3 \end{bmatrix}$.
$$\mathbf{w} = \mathbf{P}_1 - \mathbf{P}_2 = \begin{bmatrix} 1 \\ -2 \\ -1 \end{bmatrix}$$
$$\mathbf{w} \times \mathbf{d} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & -2 & -1 \\ 2 & 1 & 3 \end{vmatrix} = \mathbf{i}(-6 + 1) - \mathbf{j}(3 + 2) + \mathbf{k}(1 + 4) = \begin{bmatrix} -5 \\ -5 \\ 5 \end{bmatrix}$$
$$\|\mathbf{w} \times \mathbf{d}\| = \sqrt{25 + 25 + 25} = 5\sqrt{3}$$
$$\|\mathbf{d}\| = \sqrt{4 + 1 + 9} = \sqrt{14}$$
$$d = \frac{5\sqrt{3}}{\sqrt{14}} = \frac{5\sqrt{42}}{14} \approx 2.31455 \text{ units}$$

---

#### Exercise 8.6
**Problem:** State the condition for two lines $\mathbf{r}_1(s) = \mathbf{P}_1 + s\mathbf{d}_1$ and $\mathbf{r}_2(t) = \mathbf{P}_2 + t\mathbf{d}_2$ to be coplanar.
**Solution:**
Two lines are coplanar if and only if their scalar triple product with displacement vector $\mathbf{P}_2 - \mathbf{P}_1$ vanishes:
$$[(\mathbf{P}_2 - \mathbf{P}_1), \mathbf{d}_1, \mathbf{d}_2] = 0$$

---

#### Exercise 8.7
**Problem:** Find the point on the line segment between $A(0, 0, 0)$ and $B(10, 0, 0)$ that is closest to point $P(15, 5, 0)$.
**Solution:**
Segment parameterized by $t \in [0, 1]$: $\mathbf{r}(t) = \begin{bmatrix} 10t \\ 0 \\ 0 \end{bmatrix}$.
Unconstrained projection of $P(15, 5, 0)$ onto the $x$-axis gives $x = 15 \implies 10t = 15 \implies t = 1.5$.
Since $1.5 > 1.0$, clamp to boundary $t = 1.0$.
The closest point on the segment is $B(10, 0, 0)$.

---

#### Exercise 8.8
**Problem:** In ray tracing, what does a negative ray parameter $t < 0$ represent?
**Solution:**
A parameter $t < 0$ represents an intersection point that lies **behind the ray origin**, along the negative ray direction. In rendering pipelines, intersections with $t \le 0$ must be rejected (ignored) because the camera or light cannot see backwards.

---

#### Exercise 8.9
**Problem:** Prove that the shortest distance vector connecting two skew lines is orthogonal to both line direction vectors.
**Solution:**
Let $f(s, t) = \|\mathbf{r}_1(s) - \mathbf{r}_2(t)\|^2$. At the local minimum $(s^*, t^*)$, the partial derivatives must vanish:
$$\frac{\partial f}{\partial s} = 2(\mathbf{r}_1(s^*) - \mathbf{r}_2(t^*)) \cdot \frac{d\mathbf{r}_1}{ds} = 2(C_1 - C_2) \cdot \mathbf{d}_1 = 0 \implies (C_1 - C_2) \perp \mathbf{d}_1$$
$$\frac{\partial f}{\partial t} = -2(\mathbf{r}_1(s^*) - \mathbf{r}_2(t^*)) \cdot \frac{d\mathbf{r}_2}{dt} = -2(C_1 - C_2) \cdot \mathbf{d}_2 = 0 \implies (C_1 - C_2) \perp \mathbf{d}_2$$
Thus the connecting vector $C_1 - C_2$ is strictly orthogonal to both $\mathbf{d}_1$ and $\mathbf{d}_2 \quad \blacksquare$.

---

#### Exercise 8.10
**Problem:** Two rays have direction vectors $\mathbf{d}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ and $\mathbf{d}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$. If $\mathbf{P}_1 = (0, 0, 0)$ and $\mathbf{P}_2 = (3, 4, 5)$, find the closest points of approach $C_1$ and $C_2$.
**Solution:**
Here $\mathbf{d}_1 = \mathbf{i}$ and $\mathbf{d}_2 = \mathbf{j}$.
$L_1$ is the $x$-axis: $\mathbf{r}_1(s) = (s, 0, 0)$.
$L_2$ is the line through $(3, 4, 5)$ parallel to the $y$-axis: $\mathbf{r}_2(t) = (3, 4+t, 5)$.
The displacement is $(s - 3, -(4+t), -5)$.
For orthogonality:
$$(s - 3) = 0 \implies s^* = 3 \implies C_1 = (3, 0, 0)$$
$$-(4 + t) = 0 \implies t^* = -4 \implies C_2 = (3, 0, 5)$$
Separation vector: $C_2 - C_1 = (0, 0, 5)$.
Distance: $5 \text{ units}$.
