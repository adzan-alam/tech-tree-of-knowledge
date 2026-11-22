# Chapter 3: The Affine Dilemma and 4x4 Homogeneous Coordinates

> *"By escaping into a fourth dimension of projective space, translation—the most stubborn non-linear outlaw of Euclidean geometry—is tamed and revealed to be nothing more than a shear of a higher dimension."*  
> — **August Ferdinand Möbius**, *Der barycentrische Calcul* (1827)

---

### Section 3.1 The Fundamental Flaw of $3 \times 3$ Matrices: The Affine Dilemma

In the previous two chapters, we explored how $3 \times 3$ matrices act as versatile geometric operators. They can rotate space, scale objects along arbitrary axes, reflect meshes across mirrors, and shear coordinate grids.

Yet, in practical game development, robotics, and architectural CAD, a system that can only rotate and scale is hopelessly crippled. Consider the motion of an automobile driving down a street, an elevator rising in a shaft, or a player walking across a room: **they are translating through space**.

Now, let us ask the decisive mathematical question:  
*Can a $3 \times 3$ matrix translate a point from $(x, y, z)$ to $(x + t_x, y + t_y, z + t_z)$?*

Suppose there existed a matrix $\mathbf{T} \in \mathbb{R}^{3 \times 3}$ such that for every point $\mathbf{p} \in \mathbb{R}^3$:
$$\mathbf{T} \mathbf{p} = \mathbf{p} + \mathbf{t}$$

Now consider what happens when we feed the coordinate origin $\mathbf{p} = \mathbf{0} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$ into this matrix:
$$\mathbf{T} \mathbf{0} = \begin{bmatrix} T_{11} & T_{12} & T_{13} \\ T_{21} & T_{22} & T_{23} \\ T_{31} & T_{32} & T_{33} \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \mathbf{0}$$

By the fundamental axioms of linear algebra, any matrix multiplication evaluated at the zero vector **must produce the zero vector**!
Therefore:
$$\mathbf{T} \mathbf{0} = \mathbf{0} \ne \mathbf{0} + \mathbf{t} = \mathbf{t}$$
(unless $\mathbf{t} = \mathbf{0}$, which is no translation at all).

```
   Linear Map: T(0) MUST = 0              Affine Map (Translation): Shifts Origin!
             y                                      y
             ^                                      ^         Origin moved!
             |                                      |        +
             +-----> x                              +-----> x
            (0,0)                                  (0,0)
```

This mathematical barrier is known as the **Affine Dilemma**.  
A general rigid body transformation is not a purely *linear* map; it is an **affine map**:
$$\mathbf{p}' = \mathbf{R} \mathbf{p} + \mathbf{t}$$
where $\mathbf{R} \in \mathbb{R}^{3 \times 3}$ is a linear rotation/scale matrix and $\mathbf{t} \in \mathbb{R}^3$ is a translation vector.

#### The Computational Disaster of the Affine Form:
Why is $\mathbf{p}' = \mathbf{R} \mathbf{p} + \mathbf{t}$ problematic in large-scale software engineering?
Consider composing two successive transformations (for example, a hand mounted on a forearm mounted on an upper arm):
$$\mathbf{p}_1 = \mathbf{R}_1 \mathbf{p}_0 + \mathbf{t}_1$$
$$\mathbf{p}_2 = \mathbf{R}_2 \mathbf{p}_1 + \mathbf{t}_2 = \mathbf{R}_2 (\mathbf{R}_1 \mathbf{p}_0 + \mathbf{t}_1) + \mathbf{t}_2 = (\mathbf{R}_2 \mathbf{R}_1) \mathbf{p}_0 + (\mathbf{R}_2 \mathbf{t}_1 + \mathbf{t}_2)$$

For a kinematic chain with 20 robotic joints or a character skeleton with 100 bones, every level of the hierarchy requires separate matrix multiplications, vector-matrix multiplications, and vector additions. We cannot represent the entire compound transform as a single unified entity that can be inverted, multiplied, and passed to a GPU vertex shader!

To unify translation and rotation into a single matrix multiplication, we must take a bold dimensional leap.

---

### Section 3.2 Projective Space $\mathbb{P}^3$ and Homogeneous Coordinates

In 1827, German mathematician and astronomer August Ferdinand Möbius devised a brilliant mathematical construct: **Homogeneous Coordinates**.

Instead of working in ordinary 3D Euclidean space $\mathbb{R}^3$, we embed our physical world into the four-dimensional **Projective Space** $\mathbb{P}^3$.
A point in 3D space $(x, y, z)$ is represented as a 4-dimensional vector:
$$\mathbf{P} = \begin{bmatrix} X \\ Y \\ Z \\ W \end{bmatrix} \in \mathbb{P}^3, \quad W \ne 0$$

To convert from 4D homogeneous coordinates back to our familiar 3D Cartesian coordinates, we perform a **perspective division** by the fourth component $W$:
$$x = \frac{X}{W}, \quad y = \frac{Y}{W}, \quad z = \frac{Z}{W}$$

In projective space, scaling all four components by any non-zero scalar $\lambda \in \mathbb{R}$ leaves the physical 3D point unchanged:
$$\begin{bmatrix} \lambda X \\ \lambda Y \\ \lambda Z \\ \lambda W \end{bmatrix} \iff \left( \frac{\lambda X}{\lambda W}, \frac{\lambda Y}{\lambda W}, \frac{\lambda Z}{\lambda W} \right) = \left( \frac{X}{W}, \frac{Y}{W}, \frac{Z}{W} \right) = (x, y, z)$$
Because the coordinates are defined up to an overall homogeneous scale factor, they are called *homogeneous coordinates*.

For standard affine transformations (before perspective projection), we set the fourth coordinate to the canonical value:
$$W = 1.0 \implies \mathbf{p} = \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$$

---

### Section 3.3 The Cartesian-Homogeneous Duality: Points vs Vectors

One of the most profound and elegant benefits of homogeneous coordinates is that they provide a strict mathematical distinction between **Points** (locations in space) and **Vectors** (pure directions and displacements):

```
                     HOMOGENEOUS DUALITY
    +---------------------------------------------------+
    |  POINTS (Positions):         VECTORS (Directions): |
    |        w = 1.0                      w = 0.0       |
    |  - Bound to a location       - Pure direction     |
    |  - Affected by translation   - IMMUNE to transl.  |
    +---------------------------------------------------+
```

Let us observe this duality in action:

#### 1. Points Have $W = 1$:
$$\mathbf{p} = \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$$
A point represents a specific spatial location. If the world is shifted or translated, the location of the point changes.

#### 2. Vectors Have $W = 0$:
$$\mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \\ 0 \end{bmatrix}$$
A vector represents a displacement, velocity, or direction (such as wind velocity, sunlight ray, or surface normal). If you take an arrow pointing North at $50 \text{ km/h}$ and move the entire city 100 kilometers East, the arrow still points North at $50 \text{ km/h}$! A vector is **completely immune to translation**.

#### 3. Mathematical Consistency of Operations:
Notice how the arithmetic of the $W$-component perfectly enforces the rules of Euclidean geometry:
- **Point $-$ Point = Vector:**
  $$\begin{bmatrix} x_2 \\ y_2 \\ z_2 \\ 1 \end{bmatrix} - \begin{bmatrix} x_1 \\ y_1 \\ z_1 \\ 1 \end{bmatrix} = \begin{bmatrix} x_2 - x_1 \\ y_2 - y_1 \\ z_2 - z_1 \\ 1 - 1 \end{bmatrix} = \begin{bmatrix} \Delta x \\ \Delta y \\ \Delta z \\ 0 \end{bmatrix} \quad (\text{Result is a Vector!})$$
- **Point $+$ Vector = Point:**
  $$\begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix} + \begin{bmatrix} v_x \\ v_y \\ v_z \\ 0 \end{bmatrix} = \begin{bmatrix} x + v_x \\ y + v_y \\ z + v_z \\ 1 + 0 \end{bmatrix} = \begin{bmatrix} x' \\ y' \\ z' \\ 1 \end{bmatrix} \quad (\text{Result is a Point!})$$
- **Vector $+$ Vector = Vector:**
  $$w = 0 + 0 = 0 \quad (\text{Result is a Vector!})$$
- **Point $+$ Point = Meaningless in Euclidean Geometry:**
  $$w = 1 + 1 = 2 \implies \text{Division by 2 gives } \frac{P_1 + P_2}{2} \text{ (The Midpoint / Center of Mass!)}$$

---

### Section 3.4 The $4 \times 4$ Affine Transformation Matrix Structure

Now, we construct the universal $4 \times 4$ matrix that unifies rotation, scaling, shearing, and translation into a single linear operator on $\mathbb{P}^3$:

$$\mathbf{M} = \begin{bmatrix} 
R_{11} & R_{12} & R_{13} & t_x \\ 
R_{21} & R_{22} & R_{23} & t_y \\ 
R_{31} & R_{32} & R_{33} & t_z \\ 
0 & 0 & 0 & 1 
\end{bmatrix} = \begin{bmatrix} \mathbf{R}_{3 \times 3} & \mathbf{t}_{3 \times 1} \\ \mathbf{0}_{1 \times 3} & 1 \end{bmatrix}$$

Let us observe what happens when this $4 \times 4$ matrix multiplies a **Point** $\mathbf{p} = \begin{bmatrix} x & y & z & 1 \end{bmatrix}^T$:
$$\mathbf{M} \mathbf{p} = \begin{bmatrix} 
R_{11} & R_{12} & R_{13} & t_x \\ 
R_{21} & R_{22} & R_{23} & t_y \\ 
R_{31} & R_{32} & R_{33} & t_z \\ 
0 & 0 & 0 & 1 
\end{bmatrix} \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix} = \begin{bmatrix} 
(R_{11}x + R_{12}y + R_{13}z) + t_x \cdot 1 \\ 
(R_{21}x + R_{22}y + R_{23}z) + t_y \cdot 1 \\ 
(R_{31}x + R_{32}y + R_{33}z) + t_z \cdot 1 \\ 
(0\cdot x + 0\cdot y + 0\cdot z) + 1 \cdot 1 
\end{bmatrix} = \begin{bmatrix} \mathbf{R}\mathbf{p}_{xyz} + \mathbf{t} \\ 1 \end{bmatrix}$$

**The translation vector $\mathbf{t}$ is added automatically via the fourth column multiplied by $w = 1$!**

Now, look at what happens when the exact same matrix multiplies a **Direction Vector** $\mathbf{v} = \begin{bmatrix} v_x & v_y & v_z & 0 \end{bmatrix}^T$:
$$\mathbf{M} \mathbf{v} = \begin{bmatrix} 
R_{11} & R_{12} & R_{13} & t_x \\ 
R_{21} & R_{22} & R_{23} & t_y \\ 
R_{31} & R_{32} & R_{33} & t_z \\ 
0 & 0 & 0 & 1 
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ v_z \\ 0 \end{bmatrix} = \begin{bmatrix} 
(R_{11}v_x + R_{12}v_y + R_{13}v_z) + t_x \cdot 0 \\ 
(R_{21}v_x + R_{22}v_y + R_{23}v_z) + t_y \cdot 0 \\ 
(R_{31}v_x + R_{32}v_y + R_{33}v_z) + t_z \cdot 0 \\ 
0 + 0 
\end{bmatrix} = \begin{bmatrix} \mathbf{R}\mathbf{v}_{xyz} \\ 0 \end{bmatrix}$$

Because $w = 0$, the translation column $\mathbf{t}$ is multiplied by zero and completely vanishes!  
The direction vector is rotated and scaled by $\mathbf{R}$, but its position is **unaffected by translation**.

A single matrix multiplication handles both points and vectors with flawless mathematical precision.

```
       Translation in 3D = A Shear in 4D!
             w
             ^
             |       Point P' = (x + tx, y + ty, z + tz, 1)
             +------+
             |     /|  (Sheared parallel to the w = 1 plane)
             |    / |
             |   /  |
             +--+---+--------> x, y, z
             0  P = (x, y, z, 1)
```

---

### Section 3.5 Fast Inversion of Rigid Body $4 \times 4$ Transformations

In computing graphics and physics engines, we frequently need to invert $4 \times 4$ transformation matrices (for example, to transform mouse clicks from screen space back into world space, or to convert world geometry into camera space).

Inverting a generic $4 \times 4$ matrix using Gauss-Jordan elimination or Cramer's rule requires **84 multiplications and 36 additions**, and is vulnerable to numerical instability.

However, for a **Rigid Body Transformation** (an affine transform consisting of a pure rotation $\mathbf{R} \in SO(3)$ and translation $\mathbf{t}$):
$$\mathbf{T} = \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$$

We can derive its exact analytical inverse in closed form using block matrix algebra!

Let the inverse matrix be partitioned as:
$$\mathbf{T}^{-1} = \begin{bmatrix} \mathbf{A} & \mathbf{b} \\ \mathbf{0}^T & 1 \end{bmatrix}$$

Since $\mathbf{T}^{-1} \mathbf{T} = \mathbf{I}_{4 \times 4}$:
$$\begin{bmatrix} \mathbf{A} & \mathbf{b} \\ \mathbf{0}^T & 1 \end{bmatrix} \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix} = \begin{bmatrix} \mathbf{A}\mathbf{R} + \mathbf{b}\mathbf{0}^T & \mathbf{A}\mathbf{t} + \mathbf{b}\cdot 1 \\ \mathbf{0}^T \mathbf{R} + 1\cdot \mathbf{0}^T & \mathbf{0}^T \mathbf{t} + 1\cdot 1 \end{bmatrix} = \begin{bmatrix} \mathbf{A}\mathbf{R} & \mathbf{A}\mathbf{t} + \mathbf{b} \\ \mathbf{0}^T & 1 \end{bmatrix} = \begin{bmatrix} \mathbf{I}_{3 \times 3} & \mathbf{0} \\ \mathbf{0}^T & 1 \end{bmatrix}$$

Equating corresponding sub-blocks:
1. $\mathbf{A}\mathbf{R} = \mathbf{I} \implies \mathbf{A} = \mathbf{R}^{-1}$.  
   Since $\mathbf{R}$ is an orthogonal rotation matrix, $\mathbf{R}^{-1} = \mathbf{R}^T$! Therefore:
   $$\mathbf{A} = \mathbf{R}^T$$
2. $\mathbf{A}\mathbf{t} + \mathbf{b} = \mathbf{0} \implies \mathbf{b} = -\mathbf{A}\mathbf{t} = -\mathbf{R}^T \mathbf{t}$.

Combining these results yields the **Fast Rigid Body Inversion Formula**:

$$\begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}^{-1} = \begin{bmatrix} \mathbf{R}^T & -\mathbf{R}^T \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$$

#### Computational Cost:
- Inverting the rotation: Transpose $\mathbf{R}$ (0 operations).
- Inverting the translation: One matrix-vector multiplication $\mathbf{R}^T \mathbf{t}$ (9 multiplications, 6 additions) and one negation.
- Total cost: **9 multiplications, 6 additions, ZERO divisions!**
This is nearly **$10\times$ faster** than generic $4 \times 4$ inversion and guarantees 100% numerical stability without roundoff drift.

---

### Section 3.6 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 3.1: Converting Between Cartesian and Homogeneous Coordinates
**Problem:**
1. Convert the 3D Cartesian point $P(4, -2, 7)$ into canonical homogeneous coordinates.
2. Convert the 3D Cartesian displacement vector $\mathbf{v} = \begin{bmatrix} -3 \\ 0 \\ 5 \end{bmatrix}$ into homogeneous coordinates.
3. Convert the projective coordinate $\mathbf{Q} = \begin{bmatrix} 12 \\ 6 \\ -18 \\ 3 \end{bmatrix}$ into its equivalent 3D Cartesian coordinates.

**Solution:**
1. For a point, append $w = 1$:
   $$\mathbf{P}_{\text{homo}} = \begin{bmatrix} 4 \\ -2 \\ 7 \\ 1 \end{bmatrix}$$
2. For a displacement vector, append $w = 0$:
   $$\mathbf{v}_{\text{homo}} = \begin{bmatrix} -3 \\ 0 \\ 5 \\ 0 \end{bmatrix}$$
3. For $\mathbf{Q}$, divide by $w = 3$:
   $$x = \frac{12}{3} = 4, \quad y = \frac{6}{3} = 2, \quad z = \frac{-18}{3} = -6$$
   The Cartesian point is $(4, 2, -6)$.

---

#### Example 3.2: Pure Translation $4 \times 4$ Matrix
**Problem:** Construct the $4 \times 4$ translation matrix $\mathbf{T}$ that shifts points by $\Delta x = 5$, $\Delta y = -3$, $\Delta z = 2$. Transform point $A(1, 4, -1)$ and vector $\mathbf{v} = \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix}$.

**Solution:**
1. Construct $\mathbf{T}$:
   $$\mathbf{T} = \begin{bmatrix} 1 & 0 & 0 & 5 \\ 0 & 1 & 0 & -3 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Transform point $A(1, 4, -1, 1)$:
   $$\mathbf{T} A = \begin{bmatrix} 1 & 0 & 0 & 5 \\ 0 & 1 & 0 & -3 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 4 \\ -1 \\ 1 \end{bmatrix} = \begin{bmatrix} 1(1) + 5(1) \\ 1(4) - 3(1) \\ 1(-1) + 2(1) \\ 1(1) \end{bmatrix} = \begin{bmatrix} 6 \\ 1 \\ 1 \\ 1 \end{bmatrix} \implies (6, 1, 1)$$
   The point has been translated by $(+5, -3, +2) \checkmark$.
3. Transform vector $\mathbf{v}(2, 1, 0, 0)$:
   $$\mathbf{T} \mathbf{v} = \begin{bmatrix} 1 & 0 & 0 & 5 \\ 0 & 1 & 0 & -3 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 2 \\ 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 1(2) + 5(0) \\ 1(1) - 3(0) \\ 1(0) + 2(0) \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 1 \\ 0 \\ 0 \end{bmatrix} = \mathbf{v}$$
   The direction vector is completely unchanged by translation $\checkmark$.

---

#### Example 3.3: Fast Rigid Body Inverse Calculation
**Problem:** A robotic end-effector has the following $4 \times 4$ transformation matrix relative to the base frame:
$$\mathbf{T} = \begin{bmatrix} 0 & -1 & 0 & 10 \\ 1 & 0 & 0 & 5 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
Calculate its exact inverse $\mathbf{T}^{-1}$ using the fast rigid body formula.

**Solution:**
1. Extract $\mathbf{R}$ and $\mathbf{t}$:
   $$\mathbf{R} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad \mathbf{t} = \begin{bmatrix} 10 \\ 5 \\ 2 \end{bmatrix}$$
2. Compute $\mathbf{R}^T$:
   $$\mathbf{R}^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
3. Compute $-\mathbf{R}^T \mathbf{t}$:
   $$\mathbf{R}^T \mathbf{t} = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 10 \\ 5 \\ 2 \end{bmatrix} = \begin{bmatrix} 0(10) + 1(5) + 0(2) \\ -1(10) + 0(5) + 0(2) \\ 0(10) + 0(5) + 1(2) \end{bmatrix} = \begin{bmatrix} 5 \\ -10 \\ 2 \end{bmatrix}$$
   $$-\mathbf{R}^T \mathbf{t} = \begin{bmatrix} -5 \\ 10 \\ -2 \end{bmatrix}$$
4. Assemble $\mathbf{T}^{-1}$:
   $$\mathbf{T}^{-1} = \begin{bmatrix} 0 & 1 & 0 & -5 \\ -1 & 0 & 0 & 10 \\ 0 & 0 & 1 & -2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
5. Verification:
   $$\mathbf{T} \mathbf{T}^{-1} = \begin{bmatrix} 0 & -1 & 0 & 10 \\ 1 & 0 & 0 & 5 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 & 1 & 0 & -5 \\ -1 & 0 & 0 & 10 \\ 0 & 0 & 1 & -2 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \mathbf{I}_{4 \times 4} \quad \checkmark$$

---

#### Example 3.4: Rotating an Object Around an Arbitrary Pivot Point
**Problem:** In 3D graphics, an object is located at pivot point $\mathbf{C}(3, 2, 0)$. We wish to rotate the object by $90^\circ$ counter-clockwise around the $z$-axis passing through $\mathbf{C}$. Construct the complete $4 \times 4$ transformation matrix $\mathbf{M}_{\text{pivot}}$.

**Solution:**
A rotation about an arbitrary point $\mathbf{C}$ consists of three sequential steps:
1. Translate pivot $\mathbf{C}$ to the coordinate origin: $\mathbf{T}(-\mathbf{C})$.
2. Apply the pure rotation at origin: $\mathbf{R}_z(90^\circ)$.
3. Translate the origin back to pivot $\mathbf{C}$: $\mathbf{T}(\mathbf{C})$.

In matrix multiplication order (read right-to-left):
$$\mathbf{M}_{\text{pivot}} = \mathbf{T}(\mathbf{C}) \mathbf{R}_z(90^\circ) \mathbf{T}(-\mathbf{C})$$
1. Matrices:
   $$\mathbf{T}(\mathbf{C}) = \begin{bmatrix} 1 & 0 & 0 & 3 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad \mathbf{R}_z = \begin{bmatrix} 0 & -1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad \mathbf{T}(-\mathbf{C}) = \begin{bmatrix} 1 & 0 & 0 & -3 \\ 0 & 1 & 0 & -2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Compute $\mathbf{R}_z \mathbf{T}(-\mathbf{C})$:
   $$\mathbf{R}_z \mathbf{T}(-\mathbf{C}) = \begin{bmatrix} 0 & -1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & -3 \\ 0 & 1 & 0 & -2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 & 2 \\ 1 & 0 & 0 & -3 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Multiply by $\mathbf{T}(\mathbf{C})$ on the left:
   $$\mathbf{M}_{\text{pivot}} = \begin{bmatrix} 1 & 0 & 0 & 3 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 & -1 & 0 & 2 \\ 1 & 0 & 0 & -3 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 & 5 \\ 1 & 0 & 0 & -1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Verification:
   Test the pivot point $\mathbf{C}(3, 2, 0, 1)$ (which must remain fixed):
   $$\mathbf{M}_{\text{pivot}} \mathbf{C} = \begin{bmatrix} 0 & -1 & 0 & 5 \\ 1 & 0 & 0 & -1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 3 \\ 2 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0(3) - 1(2) + 5(1) \\ 1(3) + 0(2) - 1(1) \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ 2 \\ 0 \\ 1 \end{bmatrix} = \mathbf{C} \quad \checkmark$$
The pivot point remains completely stationary.

---

#### Example 3.5: Scaling an Object from an Arbitrary Center
**Problem:** Construct the matrix to scale an object uniformly by factor $s = 2.0$, centered at position $\mathbf{C}(1, 1, 1)$.

**Solution:**
$$\mathbf{M}_{\text{scale}} = \mathbf{T}(\mathbf{C}) \mathbf{S}(2, 2, 2) \mathbf{T}(-\mathbf{C})$$
1. Component matrices:
   $$\mathbf{T}(\mathbf{C}) = \begin{bmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad \mathbf{S} = \begin{bmatrix} 2 & 0 & 0 & 0 \\ 0 & 2 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad \mathbf{T}(-\mathbf{C}) = \begin{bmatrix} 1 & 0 & 0 & -1 \\ 0 & 1 & 0 & -1 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Product $\mathbf{S} \mathbf{T}(-\mathbf{C})$:
   $$\mathbf{S} \mathbf{T}(-\mathbf{C}) = \begin{bmatrix} 2 & 0 & 0 & -2 \\ 0 & 2 & 0 & -2 \\ 0 & 0 & 2 & -2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Final product:
   $$\mathbf{M}_{\text{scale}} = \begin{bmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 0 & 0 & -2 \\ 0 & 2 & 0 & -2 \\ 0 & 0 & 2 & -2 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 0 & 0 & -1 \\ 0 & 2 & 0 & -1 \\ 0 & 0 & 2 & -1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
*Check:* Test point $\mathbf{C}(1, 1, 1)$: $2(1) - 1 = 1$. The center remains invariant $\checkmark$.
Test point $(2, 1, 1)$ (distance 1 from center): $2(2) - 1 = 3$. New distance is $3 - 1 = 2$, exactly doubled $\checkmark$.

---

#### Example 3.6: Non-Uniform Scale and Fast Inversion
**Problem:** A matrix combines a pure rotation $\mathbf{R}$, a non-uniform scale $\mathbf{S} = \text{diag}(s_x, s_y, s_z)$, and a translation $\mathbf{t}$:
$$\mathbf{M} = \begin{bmatrix} \mathbf{R} \mathbf{S} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$$
Derive the analytical formula for its inverse without inverting a generic $4 \times 4$ matrix.

**Solution:**
Let $\mathbf{A} = \mathbf{R} \mathbf{S}$.
Then $\mathbf{M} = \begin{bmatrix} \mathbf{A} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$.
From Section 3.5, the inverse of any block matrix of this form is:
$$\mathbf{M}^{-1} = \begin{bmatrix} \mathbf{A}^{-1} & -\mathbf{A}^{-1}\mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$$
Since $\mathbf{A} = \mathbf{R} \mathbf{S}$:
$$\mathbf{A}^{-1} = (\mathbf{R} \mathbf{S})^{-1} = \mathbf{S}^{-1} \mathbf{R}^{-1} = \mathbf{S}^{-1} \mathbf{R}^T$$
Since $\mathbf{S}$ is diagonal, $\mathbf{S}^{-1} = \text{diag}(1/s_x, 1/s_y, 1/s_z)$.
Thus:
$$\mathbf{M}^{-1} = \begin{bmatrix} \mathbf{S}^{-1} \mathbf{R}^T & -\mathbf{S}^{-1} \mathbf{R}^T \mathbf{t} \\ \mathbf{0}^T & 1 \end{bmatrix}$$
This allows inverting arbitrary Scale-Rotate-Translate (SRT) matrices in $O(1)$ time with zero generic matrix inversion overhead.

---

#### Example 3.7: Perspective Projection Division
**Problem:** A 3D graphics projection matrix maps world coordinate $(2, 4, 10)$ to homogeneous coordinate $(1.5, 3.0, 9.5, 5.0)$.
Find the Normalized Device Coordinates (NDC) of the point.

**Solution:**
Perform perspective division by the $W$-component ($W = 5.0$):
$$x_{\text{ndc}} = \frac{X}{W} = \frac{1.5}{5.0} = 0.3$$
$$y_{\text{ndc}} = \frac{Y}{W} = \frac{3.0}{5.0} = 0.6$$
$$z_{\text{ndc}} = \frac{Z}{W} = \frac{9.5}{5.0} = 1.9$$
The 3D NDC point is $(0.3, 0.6, 1.9)$.

---

#### Example 3.8: Camera World-to-View Transform Matrix
**Problem:** A camera is located at eye position $\mathbf{E}(0, 2, 5)$ with orientation matrix $\mathbf{R}_{\text{cam}}$ whose columns are the camera's local axes in world coordinates: $\mathbf{R}_{\text{cam}} = \begin{bmatrix} \hat{\mathbf{r}} & \hat{\mathbf{u}} & \hat{\mathbf{b}} \end{bmatrix}$.
Write down the complete $4 \times 4$ View Matrix $\mathbf{V}$ that transforms world coordinates into camera-centric view space.

**Solution:**
The camera's position and orientation in world space is:
$$\mathbf{M}_{\text{cam}} = \begin{bmatrix} \mathbf{R}_{\text{cam}} & \mathbf{E} \\ \mathbf{0}^T & 1 \end{bmatrix}$$
The View Matrix $\mathbf{V}$ transforms *from world space to camera space*, which is the inverse of the camera's world transform:
$$\mathbf{V} = \mathbf{M}_{\text{cam}}^{-1}$$
Applying the fast rigid body inverse formula:
$$\mathbf{V} = \begin{bmatrix} \mathbf{R}_{\text{cam}}^T & -\mathbf{R}_{\text{cam}}^T \mathbf{E} \\ \mathbf{0}^T & 1 \end{bmatrix}$$
In terms of camera basis vectors:
$$\mathbf{V} = \begin{bmatrix} 
r_x & r_y & r_z & -\hat{\mathbf{r}} \cdot \mathbf{E} \\ 
u_x & u_y & u_z & -\hat{\mathbf{u}} \cdot \mathbf{E} \\ 
b_x & b_y & b_z & -\hat{\mathbf{b}} \cdot \mathbf{E} \\ 
0 & 0 & 0 & 1 
\end{bmatrix}$$
This is the standard View Matrix used across OpenGL, DirectX, Vulkan, and Three.js!

---

#### Example 3.9: Point at Infinity in Projective Geometry
**Problem:** In projective geometry, what is represented by a homogeneous coordinate whose fourth component is zero: $\mathbf{P}_{\infty} = \begin{bmatrix} 3 & 4 & 0 & 0 \end{bmatrix}^T$?

**Solution:**
If we attempt perspective division:
$$(x, y, z) = \left( \frac{3}{W}, \frac{4}{W}, \frac{0}{W} \right) \quad \text{as } W \to 0$$
The coordinates approach infinity along the direction vector $\begin{bmatrix} 3 & 4 & 0 \end{bmatrix}^T$.
In projective geometry, a coordinate with $W = 0$ represents an ideal **Point at Infinity**!
Parallel lines in 3D Euclidean space never intersect; but in projective space $\mathbb{P}^3$, parallel lines intersect at a common point at infinity having $W = 0$. This property enables graphics engines to compute directional lights (like the Sun) as point lights located infinitely far away.

---

#### Example 3.10: Transforming a 3D Plane Equation via $4 \times 4$ Matrix
**Problem:** A plane is given in 4D dual coordinates by $\boldsymbol{\pi} = \begin{bmatrix} A & B & C & D \end{bmatrix}^T$, such that $\boldsymbol{\pi}^T \mathbf{p} = 0$ for all points $\mathbf{p} = \begin{bmatrix} x & y & z & 1 \end{bmatrix}^T$ on the plane.
If points are transformed by an invertible $4 \times 4$ affine matrix $\mathbf{M}$ ($\mathbf{p}' = \mathbf{M}\mathbf{p}$), derive the transformation matrix for the plane equation $\boldsymbol{\pi}'$.

**Solution:**
Since $\mathbf{p}' = \mathbf{M}\mathbf{p}$, we can solve for original point $\mathbf{p}$:
$$\mathbf{p} = \mathbf{M}^{-1} \mathbf{p}'$$
Substitute into the plane equation $\boldsymbol{\pi}^T \mathbf{p} = 0$:
$$\boldsymbol{\pi}^T (\mathbf{M}^{-1} \mathbf{p}') = 0$$
By associativity:
$$(\boldsymbol{\pi}^T \mathbf{M}^{-1}) \mathbf{p}' = 0 \iff ((\mathbf{M}^{-1})^T \boldsymbol{\pi})^T \mathbf{p}' = 0$$
Therefore, the transformed plane vector is:
$$\boldsymbol{\pi}' = (\mathbf{M}^{-1})^T \boldsymbol{\pi}$$
**A plane transforms by the inverse transpose of the point transformation matrix!** (Just like surface normal vectors).

---

### Section 3.7 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 3.1
**Problem:** What are the Cartesian coordinates of the homogeneous point $\begin{bmatrix} 8 \\ -4 \\ 2 \\ 2 \end{bmatrix}$?
**Solution:**
Divide by $W = 2$:
$$(x, y, z) = (4, -2, 1)$$

---

#### Exercise 3.2
**Problem:** If $A(1, 2, 3)$ and $B(4, 6, 8)$ are points, what is their difference in homogeneous coordinates?
**Solution:**
$$B_{\text{homo}} - A_{\text{homo}} = \begin{bmatrix} 4 \\ 6 \\ 8 \\ 1 \end{bmatrix} - \begin{bmatrix} 1 \\ 2 \\ 3 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ 4 \\ 5 \\ 0 \end{bmatrix}$$
The result is a displacement vector with $W = 0$.

---

#### Exercise 3.3
**Problem:** Write down the $4 \times 4$ matrix for a pure translation by $(0, 0, -5)$.
**Solution:**
$$\mathbf{T} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & -5 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

#### Exercise 3.4
**Problem:** Multiply the matrix from Exercise 3.3 by the vector $\begin{bmatrix} 1 \\ 2 \\ 3 \\ 0 \end{bmatrix}$.
**Solution:**
$$\begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & -5 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \\ 3 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 3 \\ 0 \end{bmatrix}$$
The direction vector is completely unaffected by translation.

---

#### Exercise 3.5
**Problem:** What is the determinant of any pure translation $4 \times 4$ matrix?
**Solution:**
A translation matrix is triangular with ones on the main diagonal.
Its determinant is the product of diagonal entries:
$$\det(\mathbf{T}) = 1 \times 1 \times 1 \times 1 = 1.0$$
Translations always preserve volume perfectly.

---

#### Exercise 3.6
**Problem:** Find the inverse of translation matrix $\mathbf{T}(t_x, t_y, t_z)$.
**Solution:**
$$\mathbf{T}(t_x, t_y, t_z)^{-1} = \mathbf{T}(-t_x, -t_y, -t_z) = \begin{bmatrix} 1 & 0 & 0 & -t_x \\ 0 & 1 & 0 & -t_y \\ 0 & 0 & 1 & -t_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

#### Exercise 3.7
**Problem:** If $\mathbf{T}_1 = \mathbf{T}(2, 0, 0)$ and $\mathbf{T}_2 = \mathbf{T}(0, 3, 0)$, what is $\mathbf{T}_1 \mathbf{T}_2$?
**Solution:**
Translations commute with other translations:
$$\mathbf{T}_1 \mathbf{T}_2 = \mathbf{T}(2, 3, 0) = \begin{bmatrix} 1 & 0 & 0 & 2 \\ 0 & 1 & 0 & 3 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

#### Exercise 3.8
**Problem:** Does a translation matrix commute with a rotation matrix?
**Solution:**
In general, **NO!** $\mathbf{T}\mathbf{R} \ne \mathbf{R}\mathbf{T}$.
- $\mathbf{T}\mathbf{R}\mathbf{p}$ translates after rotating.
- $\mathbf{R}\mathbf{T}\mathbf{p}$ rotates the translation offset itself, sending the object to a different orbit.

---

#### Exercise 3.9
**Problem:** What is the bottom row of any affine $4 \times 4$ transformation matrix?
**Solution:**
$$\begin{bmatrix} 0 & 0 & 0 & 1 \end{bmatrix}$$
It only changes when perspective projection is applied.

---

#### Exercise 3.10
**Problem:** Why can't we use a $3 \times 3$ matrix for 3D camera projection?
**Solution:**
Perspective projection requires non-linear perspective division by depth ($z$); a $3 \times 3$ linear matrix cannot perform variable division. By using a $4 \times 4$ matrix, the depth is copied into the $W$-component ($W = z$), allowing the GPU hardware rasterizer to perform perspective division $(x/W, y/W, z/W)$ automatically.
