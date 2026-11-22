# Chapter 2: Change of Basis and Matrix Inversion in 3D

> *"The coordinate system does not exist in nature; it is a scaffolding erected by the physicist. The true laws of physics and geometry are coordinate-free, invariant under every valid change of basis."*  
> — **Albert Einstein**, *The Meaning of Relativity* (1922)

---

### Section 2.1 Coordinate Systems as Reference Frames: World Space vs Body Space

In computational physics and robotics, physical entities never exist in isolation. Consider a quadrotor drone flying through an obstacle course, or a robotic manipulator assembling an engine block:
- **World Space (Inertial Frame $\mathcal{W}$):** A fixed, stationary coordinate system attached to the laboratory floor or terrain. Gravity acts along the world $-\mathbf{k}_{\mathcal{W}}$ direction; GPS waypoints and stationary obstacles are recorded here.
- **Body Space (Local Frame $\mathcal{B}$):** A coordinate system permanently anchored to the rigid body itself, typically with its origin at the center of mass. The drone's forward direction is $+\mathbf{i}_{\mathcal{B}}$, its starboard wing is $+\mathbf{j}_{\mathcal{B}}$, and its vertical rotor thrust axis is $+\mathbf{k}_{\mathcal{B}}$.

```
          World Frame W                        Body Frame B (Drone)
                z_W                                    z_B (Thrust)
                 ^                                      ^
                 |                                      |   / y_B (Right)
                 |                                      |  /
                 +---------> y_W                        +-------->
                /                                      /  x_B (Forward)
               v x_W
```

When an onboard accelerometer reports an acceleration $\mathbf{a}_{\mathcal{B}} = \begin{bmatrix} 0 & 0 & 9.81 \end{bmatrix}^T \text{ m/s}^2$, it measures acceleration relative to the drone's *local* body axes. But to update the drone's trajectory in the global world map, the physics engine must convert these numbers into world coordinates $\mathbf{a}_{\mathcal{W}}$.

How does a vector change its numeric components when viewed from a different set of axes? This is the fundamental problem of **Change of Basis**.

---

### Section 2.2 The Change of Basis Formulation

Let an abstract vector $\mathbf{v}$ exist in 3D space. The vector $\mathbf{v}$ is a physical arrow—it exists independently of any numbers or coordinates.

Now, consider two different bases for $\mathbb{R}^3$:
1. The standard world basis: $\mathcal{W} = \{\mathbf{w}_1, \mathbf{w}_2, \mathbf{w}_3\} = \{\mathbf{i}, \mathbf{j}, \mathbf{k}\}$.
2. A rotated/sheared local body basis: $\mathcal{B} = \{\mathbf{b}_1, \mathbf{b}_2, \mathbf{b}_3\}$, where each $\mathbf{b}_i \in \mathbb{R}^3$ is known in world coordinates:
   $$\mathbf{b}_1 = \begin{bmatrix} b_{1x} \\ b_{1y} \\ b_{1z} \end{bmatrix}, \quad \mathbf{b}_2 = \begin{bmatrix} b_{2x} \\ b_{2y} \\ b_{2z} \end{bmatrix}, \quad \mathbf{b}_3 = \begin{bmatrix} b_{3x} \\ b_{3y} \\ b_{3z} \end{bmatrix}$$

If an engineer measures the vector $\mathbf{v}$ in body coordinates, they express it as:
$$[\mathbf{v}]_{\mathcal{B}} = \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix} \iff \mathbf{v} = v_1 \mathbf{b}_1 + v_2 \mathbf{b}_2 + v_3 \mathbf{b}_3$$

To find the coordinates of this exact same arrow in world space $[\mathbf{v}]_{\mathcal{W}}$, we substitute the world representations of $\mathbf{b}_1, \mathbf{b}_2, \mathbf{b}_3$:
$$[\mathbf{v}]_{\mathcal{W}} = v_1 \begin{bmatrix} b_{1x} \\ b_{1y} \\ b_{1z} \end{bmatrix} + v_2 \begin{bmatrix} b_{2x} \\ b_{2y} \\ b_{2z} \end{bmatrix} + v_3 \begin{bmatrix} b_{3x} \\ b_{3y} \\ b_{3z} \end{bmatrix} = \begin{bmatrix} b_{1x} & b_{2x} & b_{3x} \\ b_{1y} & b_{2y} & b_{3y} \\ b_{1z} & b_{2z} & b_{3z} \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix}$$

Let us define the **Change of Basis Matrix** (also termed the transition matrix from $\mathcal{B}$ to $\mathcal{W}$):
$$\mathbf{P}_{\mathcal{W} \leftarrow \mathcal{B}} = \begin{bmatrix} \vert & \vert & \vert \\ \mathbf{b}_1 & \mathbf{b}_2 & \mathbf{b}_3 \\ \vert & \vert & \vert \end{bmatrix}$$

Notice the elegance: **the columns of the change-of-basis matrix $\mathbf{P}$ are simply the basis vectors of the local frame, expressed in the world frame!**

#### Forward and Inverse Transitions:
- **Local to World:**
  $$[\mathbf{v}]_{\mathcal{W}} = \mathbf{P}_{\mathcal{W} \leftarrow \mathcal{B}} \, [\mathbf{v}]_{\mathcal{B}}$$
- **World to Local:**
  Assuming $\mathbf{b}_1, \mathbf{b}_2, \mathbf{b}_3$ are linearly independent ($\det(\mathbf{P}) \ne 0$), we invert the matrix:
  $$[\mathbf{v}]_{\mathcal{B}} = \mathbf{P}_{\mathcal{W} \leftarrow \mathcal{B}}^{-1} \, [\mathbf{v}]_{\mathcal{W}}$$

---

### Section 2.3 Orthogonal Matrices: The Groups $O(3)$ and $SO(3)$

In rigid body kinematics, the local basis vectors $\{\mathbf{b}_1, \mathbf{b}_2, \mathbf{b}_3\}$ do not stretch or shear relative to one another; they remain **mutually perpendicular and of unit length** (an orthonormal basis):
$$\mathbf{b}_i \cdot \mathbf{b}_j = \delta_{ij} = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \ne j \end{cases}$$

When the columns of a real square matrix $\mathbf{R}$ form an orthonormal set, $\mathbf{R}$ is called an **Orthogonal Matrix**.

#### The Miracle Property of Orthogonal Matrices:
Let us compute the matrix product $\mathbf{R}^T \mathbf{R}$:
$$\mathbf{R}^T \mathbf{R} = \begin{bmatrix} \mathbf{b}_1^T \\ \mathbf{b}_2^T \\ \mathbf{b}_3^T \end{bmatrix} \begin{bmatrix} \mathbf{b}_1 & \mathbf{b}_2 & \mathbf{b}_3 \end{bmatrix} = \begin{bmatrix} \mathbf{b}_1 \cdot \mathbf{b}_1 & \mathbf{b}_1 \cdot \mathbf{b}_2 & \mathbf{b}_1 \cdot \mathbf{b}_3 \\ \mathbf{b}_2 \cdot \mathbf{b}_1 & \mathbf{b}_2 \cdot \mathbf{b}_2 & \mathbf{b}_2 \cdot \mathbf{b}_3 \\ \mathbf{b}_3 \cdot \mathbf{b}_1 & \mathbf{b}_3 \cdot \mathbf{b}_2 & \mathbf{b}_3 \cdot \mathbf{b}_3 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \mathbf{I}$$

Therefore:
$$\mathbf{R}^T = \mathbf{R}^{-1}$$

**The matrix inverse of an orthonormal matrix is simply its transpose!**
Inverting an arbitrary $3 \times 3$ matrix requires dozens of floating-point multiplications, additions, and a division by the determinant. But for an orthogonal rotation matrix, inverting it requires **zero arithmetic operations**—only swapping row indices with column indices! This is one of the most celebrated computational efficiencies in computer graphics and game physics.

#### The Special Orthogonal Group $SO(3)$:
From Chapter 1, Exercise 1.9, taking the determinant of $\mathbf{R}^T \mathbf{R} = \mathbf{I}$ reveals:
$$(\det\mathbf{R})^2 = 1 \implies \det\mathbf{R} = \pm 1$$
- **$O(3)$ (The Orthogonal Group):** Contains all orthogonal transformations, including reflections ($\det\mathbf{R} = -1$).
- **$SO(3)$ (The Special Orthogonal Group):** Restricted strictly to matrices with $\det\mathbf{R} = +1$. These are the **pure 3D spatial rotations** that preserve both metric distance and handedness.

---

### Section 2.4 Analytical Inversion of $3 \times 3$ Matrices via Adjugates and Cramer's Rule

When a matrix $\mathbf{A} \in \mathbb{R}^{3 \times 3}$ is not orthogonal (for instance, when it contains non-uniform scaling, skewing, or perspective distortion), we cannot simply transpose it; we must calculate its true analytical inverse $\mathbf{A}^{-1}$ such that:
$$\mathbf{A} \mathbf{A}^{-1} = \mathbf{A}^{-1} \mathbf{A} = \mathbf{I}$$

The exact algebraic formula for the inverse is given by the **Adjugate Matrix** formula:
$$\mathbf{A}^{-1} = \frac{1}{\det(\mathbf{A})} \text{adj}(\mathbf{A}) = \frac{1}{\det(\mathbf{A})} \mathbf{C}^T$$
where $\mathbf{C}$ is the **Cofactor Matrix** of $\mathbf{A}$, and $\mathbf{C}^T$ is its transpose.

```
          A = [ a11 a12 a13 ]              C = [  M11 -M12  M13 ]
              [ a21 a22 a23 ]                  [ -M21  M22 -M23 ]
              [ a31 a32 a33 ]                  [  M31 -M32  M33 ]
                                     adj(A) = C^T
```

#### Step-by-Step Analytical Inversion Algorithm:

1. **Step 1: Compute the Determinant $\det(\mathbf{A})$:**
   $$\det(\mathbf{A}) = a_{11}(a_{22} a_{33} - a_{23} a_{32}) - a_{12}(a_{21} a_{33} - a_{23} a_{31}) + a_{13}(a_{21} a_{32} - a_{22} a_{31})$$
   If $|\det(\mathbf{A})| < \epsilon$ (e.g., $10^{-12}$), the matrix is singular (or numerically ill-conditioned); abort with an error.

2. **Step 2: Compute the Nine $2 \times 2$ Minors $M_{ij}$ and Cofactors $C_{ij} = (-1)^{i+j} M_{ij}$:**
   - $C_{11} = +(a_{22} a_{33} - a_{23} a_{32})$
   - $C_{12} = -(a_{21} a_{33} - a_{23} a_{31})$
   - $C_{13} = +(a_{21} a_{32} - a_{22} a_{31})$
   - $C_{21} = -(a_{12} a_{33} - a_{13} a_{32})$
   - $C_{22} = +(a_{11} a_{33} - a_{13} a_{31})$
   - $C_{23} = -(a_{11} a_{32} - a_{12} a_{31})$
   - $C_{31} = +(a_{12} a_{23} - a_{13} a_{22})$
   - $C_{32} = -(a_{11} a_{23} - a_{13} a_{21})$
   - $C_{33} = +(a_{11} a_{22} - a_{12} a_{21})$

3. **Step 3: Transpose the Cofactor Matrix to Form the Adjugate:**
   $$\text{adj}(\mathbf{A}) = \mathbf{C}^T = \begin{bmatrix} C_{11} & C_{21} & C_{31} \\ C_{12} & C_{22} & C_{32} \\ C_{13} & C_{23} & C_{33} \end{bmatrix}$$

4. **Step 4: Multiply by the Scalar Reciprocal $\frac{1}{\det(\mathbf{A})}$:**
   $$\mathbf{A}^{-1} = \frac{1}{\det(\mathbf{A})} \begin{bmatrix} C_{11} & C_{21} & C_{31} \\ C_{12} & C_{22} & C_{32} \\ C_{13} & C_{23} & C_{33} \end{bmatrix}$$

#### Vector Cross Product Formulation:
Notice a profound geometric connection: if $\mathbf{A} = \begin{bmatrix} \mathbf{c}_1 & \mathbf{c}_2 & \mathbf{c}_3 \end{bmatrix}$, the rows of the adjugate matrix are precisely the vector cross products of the columns:
$$\mathbf{A}^{-1} = \frac{1}{[\mathbf{c}_1, \mathbf{c}_2, \mathbf{c}_3]} \begin{bmatrix} (\mathbf{c}_2 \times \mathbf{c}_3)^T \\ (\mathbf{c}_3 \times \mathbf{c}_1)^T \\ (\mathbf{c}_1 \times \mathbf{c}_2)^T \end{bmatrix}$$
This aligns directly with the reciprocal lattice basis of crystallography derived in Chapter 7!

---

### Section 2.5 Condition Numbers, SVD Intuition, and Inversion Hazards

In numerical physics, computing $\mathbf{A}^{-1}\mathbf{b}$ by literally inverting $\mathbf{A}$ can be hazardous if the matrix is nearly singular.

The sensitivity of a matrix transformation to round-off error is quantified by its **Condition Number** $\kappa(\mathbf{A})$:
$$\kappa(\mathbf{A}) = \|\mathbf{A}\| \cdot \|\mathbf{A}^{-1}\| = \frac{\sigma_{\max}}{\sigma_{\min}}$$
where $\sigma_{\max}$ and $\sigma_{\min}$ are the largest and smallest singular values obtained via Singular Value Decomposition (SVD).

```
   Well-Conditioned (Circle -> Circle/Ellipse)       Ill-Conditioned (Circle -> Flat Needle)
               y                                                y
               ^                                                ^
               |   O                                            |    /
               +------> x                                       +---/---> x
             kappa = 1.0 (Orthogonal Matrix)                 kappa = 10^7 (Near-Singular)
```

1. **Well-Conditioned Matrix ($\kappa \approx 1$):**  
   Every orthogonal rotation matrix $\mathbf{R} \in SO(3)$ has $\sigma_{\max} = \sigma_{\min} = 1.0$, so $\kappa(\mathbf{R}) = 1.0$. It preserves geometric precision flawlessly.
2. **Ill-Conditioned Matrix ($\kappa \gg 10^4$):**  
   If one dimension of a mesh is flattened nearly to zero (for instance, an object squashed by a scale factor of $10^{-6}$), $\sigma_{\min} \to 0$, causing $\kappa \to \infty$. Attempting to invert this matrix will amplify tiny 64-bit floating-point rounding errors into massive, multi-kilometer coordinate errors, destroying physics stability.

---

### Section 2.6 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 2.1: Change of Basis from Local to World Frame
**Problem:** A robotic camera is mounted on a drone. Relative to the world frame $\mathcal{W}$, the camera's local right, up, and backward axes are:
$$\mathbf{r} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{u} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
A visual object is detected at camera local coordinates $[\mathbf{p}]_{\mathcal{C}} = \begin{bmatrix} 2 \\ 5 \\ -10 \end{bmatrix} \text{ m}$. Find the position vector of the object in world coordinates $[\mathbf{p}]_{\mathcal{W}}$ assuming their origins coincide.

**Solution:**
1. Construct the change-of-basis matrix $\mathbf{P}_{\mathcal{W} \leftarrow \mathcal{C}}$ using the local basis vectors as columns:
   $$\mathbf{P} = \begin{bmatrix} \mathbf{r} & \mathbf{u} & \mathbf{b} \end{bmatrix} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$
2. Multiply by the local coordinates:
   $$[\mathbf{p}]_{\mathcal{W}} = \mathbf{P} [\mathbf{p}]_{\mathcal{C}} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 5 \\ -10 \end{bmatrix} = \begin{bmatrix} (0)(2) + (0)(5) + (1)(-10) \\ (1)(2) + (0)(5) + (0)(-10) \\ (0)(2) + (1)(5) + (0)(-10) \end{bmatrix} = \begin{bmatrix} -10 \\ 2 \\ 5 \end{bmatrix} \text{ m}$$
*Physical Check:*
The camera's backward axis points along world $+x$; since the object is at local $z = -10$ (10 meters forward), its world $x$ must be $-10$. The camera's right axis points along world $+y$; since local $x = 2$, world $y = 2$. Camera up points along world $+z$; local $y = 5 \implies$ world $z = 5 \quad \checkmark$.

---

#### Example 2.2: Change of Basis from World to Local Frame
**Problem:** For the same camera system in Example 2.1, a bird is spotted at world coordinates $[\mathbf{w}]_{\mathcal{W}} = \begin{bmatrix} 3 \\ -4 \\ 7 \end{bmatrix} \text{ m}$. Find the bird's coordinates in the camera's local body frame $[\mathbf{w}]_{\mathcal{C}}$.

**Solution:**
1. Check if $\mathbf{P}$ is orthogonal:
   - $\|\mathbf{r}\| = 1, \|\mathbf{u}\| = 1, \|\mathbf{b}\| = 1$.
   - $\mathbf{r} \cdot \mathbf{u} = 0, \mathbf{u} \cdot \mathbf{b} = 0, \mathbf{r} \cdot \mathbf{b} = 0$.
   Yes, $\mathbf{P}$ is an orthogonal matrix!
2. Therefore, its inverse is simply its transpose:
   $$\mathbf{P}^{-1} = \mathbf{P}^T = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}^T = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$$
3. Compute local coordinates:
   $$[\mathbf{w}]_{\mathcal{C}} = \mathbf{P}^T [\mathbf{w}]_{\mathcal{W}} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 3 \\ -4 \\ 7 \end{bmatrix} = \begin{bmatrix} -4 \\ 7 \\ 3 \end{bmatrix} \text{ m}$$

---

#### Example 2.3: Verification of Orthogonality
**Problem:** Determine whether the matrix $\mathbf{Q} = \frac{1}{3} \begin{bmatrix} 1 & 2 & 2 \\ 2 & 1 & -2 \\ -2 & 2 & -1 \end{bmatrix}$ is an orthogonal matrix. If so, determine whether it represents a pure rotation or a reflection.

**Solution:**
1. Compute $\mathbf{Q}^T \mathbf{Q}$:
   $$\mathbf{Q}^T = \frac{1}{3} \begin{bmatrix} 1 & 2 & -2 \\ 2 & 1 & 2 \\ 2 & -2 & -1 \end{bmatrix}$$
   $$\mathbf{Q}^T \mathbf{Q} = \frac{1}{9} \begin{bmatrix} 1 & 2 & -2 \\ 2 & 1 & 2 \\ 2 & -2 & -1 \end{bmatrix} \begin{bmatrix} 1 & 2 & 2 \\ 2 & 1 & -2 \\ -2 & 2 & -1 \end{bmatrix}$$
   Evaluate row-column products:
   - $(1, 1): 1(1) + 2(2) + (-2)(-2) = 1 + 4 + 4 = 9$
   - $(1, 2): 1(2) + 2(1) + (-2)(2) = 2 + 2 - 4 = 0$
   - $(1, 3): 1(2) + 2(-2) + (-2)(-1) = 2 - 4 + 2 = 0$
   - $(2, 2): 2(2) + 1(1) + 2(2) = 4 + 1 + 4 = 9$
   - $(2, 3): 2(2) + 1(-2) + 2(-1) = 4 - 2 - 2 = 0$
   - $(3, 3): 2(2) + (-2)(-2) + (-1)(-1) = 4 + 4 + 1 = 9$
   $$\mathbf{Q}^T \mathbf{Q} = \frac{1}{9} \begin{bmatrix} 9 & 0 & 0 \\ 0 & 9 & 0 \\ 0 & 0 & 9 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \mathbf{I}$$
   Since $\mathbf{Q}^T \mathbf{Q} = \mathbf{I}$, $\mathbf{Q}$ is strictly **orthogonal**.
2. Compute $\det(\mathbf{Q})$:
   $$\det(\mathbf{Q}) = \left(\frac{1}{3}\right)^3 [ 1(1(-1) - (-2)(2)) - 2(2(-1) - (-2)(-2)) + 2(2(2) - 1(-2)) ]$$
   $$= \frac{1}{27} [ 1(-1 + 4) - 2(-2 - 4) + 2(4 + 2) ] = \frac{1}{27} [ 3 - 2(-6) + 2(6) ] = \frac{1}{27} [ 3 + 12 + 12 ] = \frac{27}{27} = +1.0$$
Since $\det(\mathbf{Q}) = +1$, $\mathbf{Q} \in SO(3)$. It is a **pure 3D rotation**.

---

#### Example 2.4: Full Analytical $3 \times 3$ Matrix Inversion via Adjugate
**Problem:** Invert the matrix $\mathbf{A} = \begin{bmatrix} 1 & 0 & 2 \\ 2 & -1 & 3 \\ 4 & 1 & 8 \end{bmatrix}$ using the classical adjugate method.

**Solution:**
**Step 1: Compute $\det(\mathbf{A})$:**
Expand along row 1:
$$\det(\mathbf{A}) = 1((-1)(8) - (3)(1)) - 0 + 2((2)(1) - (-1)(4))$$
$$= 1(-8 - 3) + 2(2 + 4) = 1(-11) + 2(6) = -11 + 12 = +1.0$$
Since $\det(\mathbf{A}) = 1.0 \ne 0$, $\mathbf{A}$ is invertible.

**Step 2: Compute the Cofactors $C_{ij}$:**
- $C_{11} = +((-1)(8) - (3)(1)) = -11$
- $C_{12} = -((2)(8) - (3)(4)) = -(16 - 12) = -4$
- $C_{13} = +((2)(1) - (-1)(4)) = 2 + 4 = 6$
- $C_{21} = -((0)(8) - (2)(1)) = -(-2) = 2$
- $C_{22} = +((1)(8) - (2)(4)) = 8 - 8 = 0$
- $C_{23} = -((1)(1) - (0)(4)) = -1$
- $C_{31} = +((0)(3) - (2)(-1)) = 2$
- $C_{32} = -((1)(3) - (2)(2)) = -(3 - 4) = 1$
- $C_{33} = +((1)(-1) - (0)(2)) = -1$

Cofactor matrix:
$$\mathbf{C} = \begin{bmatrix} -11 & -4 & 6 \\ 2 & 0 & -1 \\ 2 & 1 & -1 \end{bmatrix}$$

**Step 3: Transpose to Form Adjugate:**
$$\text{adj}(\mathbf{A}) = \mathbf{C}^T = \begin{bmatrix} -11 & 2 & 2 \\ -4 & 0 & 1 \\ 6 & -1 & -1 \end{bmatrix}$$

**Step 4: Divide by Determinant:**
Since $\det(\mathbf{A}) = 1$:
$$\mathbf{A}^{-1} = \begin{bmatrix} -11 & 2 & 2 \\ -4 & 0 & 1 \\ 6 & -1 & -1 \end{bmatrix}$$

**Step 5: Verification of $\mathbf{A} \mathbf{A}^{-1} = \mathbf{I}$:**
$$\mathbf{A} \mathbf{A}^{-1} = \begin{bmatrix} 1 & 0 & 2 \\ 2 & -1 & 3 \\ 4 & 1 & 8 \end{bmatrix} \begin{bmatrix} -11 & 2 & 2 \\ -4 & 0 & 1 \\ 6 & -1 & -1 \end{bmatrix}$$
- $(1, 1): (1)(-11) + 0 + (2)(6) = -11 + 12 = 1 \quad \checkmark$
- $(1, 2): (1)(2) + 0 + (2)(-1) = 2 - 2 = 0 \quad \checkmark$
- $(2, 1): (2)(-11) + (-1)(-4) + (3)(6) = -22 + 4 + 18 = 0 \quad \checkmark$
- $(2, 2): (2)(2) + (-1)(0) + (3)(-1) = 4 - 3 = 1 \quad \checkmark$
- $(3, 3): (4)(2) + (1)(1) + (8)(-1) = 8 + 1 - 8 = 1 \quad \checkmark$
The inverse is exact.

---

#### Example 2.5: Inversion via Vector Cross Product Form
**Problem:** Invert the matrix $\mathbf{M} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 4 \end{bmatrix}$ using the column cross product formula.

**Solution:**
1. Column vectors:
   $$\mathbf{c}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{c}_2 = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}, \quad \mathbf{c}_3 = \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix}$$
2. Box product (determinant):
   $$\det(\mathbf{M}) = \mathbf{c}_1 \cdot (\mathbf{c}_2 \times \mathbf{c}_3) = 1 \times 2 \times 4 = 8$$
3. Cross products:
   $$\mathbf{c}_2 \times \mathbf{c}_3 = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix} = \begin{bmatrix} 8 \\ 0 \\ 0 \end{bmatrix}$$
   $$\mathbf{c}_3 \times \mathbf{c}_1 = \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 4 \\ 0 \end{bmatrix}$$
   $$\mathbf{c}_1 \times \mathbf{c}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix}$$
4. Inverse matrix:
   $$\mathbf{M}^{-1} = \frac{1}{8} \begin{bmatrix} 8 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0.5 & 0 \\ 0 & 0 & 0.25 \end{bmatrix}$$
As expected, inverting diagonal scaling scales each axis by its reciprocal.

---

#### Example 2.6: Length Preservation under Orthogonal Transformations
**Problem:** Prove that for any orthogonal matrix $\mathbf{Q} \in O(3)$ and any vector $\mathbf{v} \in \mathbb{R}^3$, the Euclidean norm is perfectly preserved: $\|\mathbf{Q}\mathbf{v}\| = \|\mathbf{v}\|$.

**Solution:**
Express the squared norm of $\mathbf{Q}\mathbf{v}$ as an inner product:
$$\|\mathbf{Q}\mathbf{v}\|^2 = (\mathbf{Q}\mathbf{v}) \cdot (\mathbf{Q}\mathbf{v}) = (\mathbf{Q}\mathbf{v})^T (\mathbf{Q}\mathbf{v})$$
By the matrix transpose product property $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T \mathbf{A}^T$:
$$= \mathbf{v}^T \mathbf{Q}^T \mathbf{Q} \mathbf{v}$$
Since $\mathbf{Q}$ is orthogonal, $\mathbf{Q}^T \mathbf{Q} = \mathbf{I}$:
$$= \mathbf{v}^T \mathbf{I} \mathbf{v} = \mathbf{v}^T \mathbf{v} = \|\mathbf{v}\|^2$$
Taking the square root of both sides:
$$\|\mathbf{Q}\mathbf{v}\| = \|\mathbf{v}\| \quad \blacksquare$$
Orthogonal transformations are rigid isometries: they never stretch, shrink, or distort distances.

---

#### Example 2.7: Angle Preservation under Orthogonal Transformations
**Problem:** Prove that orthogonal transformations preserve the spatial angle between any two vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$.

**Solution:**
The cosine of the angle between transformed vectors $\mathbf{u}' = \mathbf{Q}\mathbf{u}$ and $\mathbf{v}' = \mathbf{Q}\mathbf{v}$ is:
$$\cos\theta' = \frac{\mathbf{u}' \cdot \mathbf{v}'}{\|\mathbf{u}'\| \|\mathbf{v}'\|}$$
1. Inner product:
   $$\mathbf{u}' \cdot \mathbf{v}' = (\mathbf{Q}\mathbf{u})^T (\mathbf{Q}\mathbf{v}) = \mathbf{u}^T (\mathbf{Q}^T \mathbf{Q}) \mathbf{v} = \mathbf{u}^T \mathbf{I} \mathbf{v} = \mathbf{u} \cdot \mathbf{v}$$
2. Norms:
   From Example 2.6, $\|\mathbf{u}'\| = \|\mathbf{u}\|$ and $\|\mathbf{v}'\| = \|\mathbf{v}\|$.
3. Therefore:
   $$\cos\theta' = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|} = \cos\theta \implies \theta' = \theta \quad \blacksquare$$
Every angle in the universe remains identical after an orthogonal transformation.

---

#### Example 2.8: Resolving Forces from Accelerometer in Body Frame
**Problem:** A quadrotor drone has orientation matrix $\mathbf{R}_{\mathcal{W} \leftarrow \mathcal{B}} = \begin{bmatrix} 0.8 & 0 & 0.6 \\ 0 & 1 & 0 \\ -0.6 & 0 & 0.8 \end{bmatrix}$ (pitch up by $\theta \approx 36.87^\circ$). Its onboard IMU reports a thrust acceleration along its local vertical axis: $\mathbf{a}_{\mathcal{B}} = \begin{bmatrix} 0 \\ 0 \\ 15 \end{bmatrix} \text{ m/s}^2$. If gravity is $\mathbf{g}_{\mathcal{W}} = \begin{bmatrix} 0 \\ 0 \\ -9.81 \end{bmatrix} \text{ m/s}^2$, find the net acceleration vector in world coordinates.

**Solution:**
1. Transform thrust acceleration into world frame:
   $$\mathbf{a}_{\text{thrust}, \mathcal{W}} = \mathbf{R}_{\mathcal{W} \leftarrow \mathcal{B}} \mathbf{a}_{\mathcal{B}} = \begin{bmatrix} 0.8 & 0 & 0.6 \\ 0 & 1 & 0 \\ -0.6 & 0 & 0.8 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 15 \end{bmatrix} = \begin{bmatrix} (0.6)(15) \\ 0 \\ (0.8)(15) \end{bmatrix} = \begin{bmatrix} 9.0 \\ 0 \\ 12.0 \end{bmatrix} \text{ m/s}^2$$
2. Add world gravity:
   $$\mathbf{a}_{\text{net}, \mathcal{W}} = \mathbf{a}_{\text{thrust}, \mathcal{W}} + \mathbf{g}_{\mathcal{W}} = \begin{bmatrix} 9.0 \\ 0 \\ 12.0 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ -9.81 \end{bmatrix} = \begin{bmatrix} 9.0 \\ 0 \\ 2.19 \end{bmatrix} \text{ m/s}^2$$
The drone accelerates horizontally forward along world $+x$ at $9.0 \text{ m/s}^2$ while climbing vertically along $+z$ at $2.19 \text{ m/s}^2$.

---

#### Example 2.9: Fast Inversion of Pure Rotation Matrices
**Problem:** A game object has rotation matrix:
$$\mathbf{R} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
1. Find $\mathbf{R}^{-1}$.
2. If the object rotates an incoming laser beam $\mathbf{v} = \begin{bmatrix} 3 \\ 4 \\ 0 \end{bmatrix}$ into $\mathbf{v}' = \mathbf{R}\mathbf{v}$, show how $\mathbf{R}^{-1}$ recovers $\mathbf{v}$.

**Solution:**
1. Since $\mathbf{R}$ is orthogonal ($\det = 1$), its inverse is simply its transpose:
   $$\mathbf{R}^{-1} = \mathbf{R}^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Forward transformation:
   $$\mathbf{v}' = \mathbf{R}\mathbf{v} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 3 \\ 4 \\ 0 \end{bmatrix} = \begin{bmatrix} -4 \\ 3 \\ 0 \end{bmatrix}$$
3. Inverse transformation:
   $$\mathbf{R}^{-1} \mathbf{v}' = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} -4 \\ 3 \\ 0 \end{bmatrix} = \begin{bmatrix} 3 \\ 4 \\ 0 \end{bmatrix} = \mathbf{v} \quad \checkmark$$

---

#### Example 2.10: Inversion Failure of a Projection Matrix
**Problem:** Attempt to compute the inverse of the orthographic projection matrix $\mathbf{P} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$ using the adjugate method, and explain why it fails.

**Solution:**
1. Compute $\det(\mathbf{P})$:
   $$\det(\mathbf{P}) = 1(1(0) - 0) = 0$$
2. Attempting to apply $\mathbf{P}^{-1} = \frac{1}{\det(\mathbf{P})} \text{adj}(\mathbf{P})$ yields a division by zero: $\frac{1}{0}$.
3. Physical explanation:
   $\mathbf{P}$ squashes all $z$-coordinates to zero. Once a 3D object has its depth completely eliminated into a flat 2D image, no mathematical algorithm can reconstruct the lost $z$-coordinates without external depth information. Information is permanently lost.

---

### Section 2.7 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 2.1
**Problem:** If $\mathbf{A} \mathbf{B} = \mathbf{I}$, what is $\mathbf{B} \mathbf{A}$?
**Solution:**
For square matrices of equal finite dimension over a field, if $\mathbf{A}\mathbf{B} = \mathbf{I}$, then $\mathbf{B} = \mathbf{A}^{-1}$ is the two-sided inverse, which guarantees that $\mathbf{B}\mathbf{A} = \mathbf{I}$.

---

#### Exercise 2.2
**Problem:** Find the inverse of the diagonal matrix $\mathbf{D} = \begin{bmatrix} 5 & 0 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 0.1 \end{bmatrix}$.
**Solution:**
Invert each non-zero diagonal element:
$$\mathbf{D}^{-1} = \begin{bmatrix} 1/5 & 0 & 0 \\ 0 & -1/2 & 0 \\ 0 & 0 & 1/0.1 \end{bmatrix} = \begin{bmatrix} 0.2 & 0 & 0 \\ 0 & -0.5 & 0 \\ 0 & 0 & 10.0 \end{bmatrix}$$

---

#### Exercise 2.3
**Problem:** Prove that $(\mathbf{A}^{-1})^T = (\mathbf{A}^T)^{-1}$.
**Solution:**
Start with $\mathbf{A} \mathbf{A}^{-1} = \mathbf{I}$.
Take the transpose of both sides:
$$(\mathbf{A} \mathbf{A}^{-1})^T = \mathbf{I}^T = \mathbf{I}$$
Apply the product transpose identity $(\mathbf{X}\mathbf{Y})^T = \mathbf{Y}^T \mathbf{X}^T$:
$$(\mathbf{A}^{-1})^T \mathbf{A}^T = \mathbf{I}$$
This implies that $(\mathbf{A}^{-1})^T$ is the inverse of $\mathbf{A}^T$:
$$(\mathbf{A}^T)^{-1} = (\mathbf{A}^{-1})^T \quad \blacksquare$$

---

#### Exercise 2.4
**Problem:** If $\mathbf{A}$ and $\mathbf{B}$ are invertible $3 \times 3$ matrices, find the inverse of their product $\mathbf{A}\mathbf{B}$.
**Solution:**
$$(\mathbf{A}\mathbf{B})^{-1} = \mathbf{B}^{-1} \mathbf{A}^{-1}$$
*Check:* $(\mathbf{A}\mathbf{B})(\mathbf{B}^{-1} \mathbf{A}^{-1}) = \mathbf{A}(\mathbf{B} \mathbf{B}^{-1})\mathbf{A}^{-1} = \mathbf{A} \mathbf{I} \mathbf{A}^{-1} = \mathbf{A} \mathbf{A}^{-1} = \mathbf{I} \quad \checkmark$.

---

#### Exercise 2.5
**Problem:** Is the sum of two orthogonal matrices always an orthogonal matrix?
**Solution:**
No! Counterexample: Let $\mathbf{A} = \mathbf{I}$ and $\mathbf{B} = \mathbf{I}$ (both are orthogonal).
Their sum is $\mathbf{A} + \mathbf{B} = 2\mathbf{I}$.
$$(\mathbf{A} + \mathbf{B})^T (\mathbf{A} + \mathbf{B}) = (2\mathbf{I})(2\mathbf{I}) = 4\mathbf{I} \ne \mathbf{I}$$
Orthogonal matrices form a multiplicative group $O(3)$, but are not closed under addition.

---

#### Exercise 2.6
**Problem:** A basis $\mathcal{B}$ has vectors $\mathbf{b}_1 = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$, $\mathbf{b}_2 = \begin{bmatrix} 0 \\ 3 \\ 0 \end{bmatrix}$, $\mathbf{b}_3 = \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix}$. Find the world coordinates of $[\mathbf{v}]_{\mathcal{B}} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.
**Solution:**
$$[\mathbf{v}]_{\mathcal{W}} = 1\mathbf{b}_1 + 1\mathbf{b}_2 + 1\mathbf{b}_3 = \begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix}$$

---

#### Exercise 2.7
**Problem:** Find the determinant of $\mathbf{M}^{-1}$ if $\det(\mathbf{M}) = -4$.
**Solution:**
$$\det(\mathbf{M}^{-1}) = \frac{1}{\det(\mathbf{M})} = \frac{1}{-4} = -0.25$$

---

#### Exercise 2.8
**Problem:** Why is inverting an orthogonal matrix faster on modern CPUs than inverting a generic matrix?
**Solution:**
Inverting a generic $3 \times 3$ matrix requires computing 9 cofactors (18 multiplications, 9 subtractions), one determinant (14 operations), and a division. Inverting an orthogonal matrix requires **zero arithmetic operations**: it is simply a memory transpose ($\mathbf{R}^{-1} = \mathbf{R}^T$), which can be executed in CPU registers in a single clock cycle.

---

#### Exercise 2.9
**Problem:** If $\mathbf{A} = \mathbf{A}^T$ (symmetric) and $\mathbf{A}$ is orthogonal, what can you say about $\mathbf{A}^2$?
**Solution:**
Since $\mathbf{A}$ is orthogonal, $\mathbf{A}^{-1} = \mathbf{A}^T$.
Since $\mathbf{A}$ is symmetric, $\mathbf{A}^T = \mathbf{A}$.
Therefore, $\mathbf{A}^{-1} = \mathbf{A} \implies \mathbf{A} \mathbf{A} = \mathbf{I} \implies \mathbf{A}^2 = \mathbf{I}$.
(Such a matrix represents a reflection: applying it twice returns to the identity).

---

#### Exercise 2.10
**Problem:** What is the condition number of the identity matrix $\mathbf{I}$?
**Solution:**
$$\kappa(\mathbf{I}) = \|\mathbf{I}\| \cdot \|\mathbf{I}^{-1}\| = 1 \times 1 = 1.0$$
It is the most numerically perfect, well-conditioned matrix possible.
