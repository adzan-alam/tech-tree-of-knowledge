# Chapter 2: The Inertia Tensor: Why Rotational Mass is a 3x3 Matrix

> *"In the kingdom of linear translation, mass is a humble scalar: a single number that resists acceleration equally in all directions. But when space begins to spin, mass reveals its true, multi-dimensional nature as a symmetric tensor of rank two, coupling torques and rotations across orthogonal planes."*

---

## 2.1 The Breakdown of Scalar Inertia

In translational mechanics, Newton's Second Law possesses a clean, intuitive simplicity:

$$\mathbf{F} = M \mathbf{a}$$

Because mass $M$ is a positive scalar, the linear acceleration vector $\mathbf{a}$ is **always strictly parallel** to the net applied force vector $\mathbf{F}$. If you push an asteroid to the right, it accelerates to the right. Pushing along the $x$-axis never causes instantaneous linear acceleration along the $y$-axis.

However, when an object rotates in three dimensions, this intuitive parallelism shatters completely. 

Imagine mounting an irregularly shaped satellite or an unbalanced motor shaft on a gimbal. If you apply a pure torque vector pointing straight up along the $z$-axis ($\boldsymbol{\tau} = \tau_z \hat{\mathbf{z}}$), you might expect the object to spin purely about the $z$-axis. Instead, you witness an alarming physical reaction: **the body begins tumbling and wobbling violently, developing instantaneous angular acceleration components along the $x$ and $y$ axes!**

```
     Linear Translation: Always Collinear       3D Rotation: Non-Collinear Cross-Coupling
           F ─────────►                                    τ (Torque)
           a ─────────► (Parallel: F = Ma)                 ▲
                                                           │   α (Angular Acceleration)
                                                           │  /
                                                           │ /  (Angle ≠ 0!)
                                                           │/
                                                           └──────────────
```

Why does this occur? Because resistance to rotation—**rotational inertia**—depends not only on *how much* mass an object possesses, but on *where* that mass is distributed relative to the axis of rotation. 

Furthermore, because a 3D body can rotate simultaneously around three orthogonal axes, its rotational mass cannot be described by a single scalar. It requires a **second-rank tensor**: a $3 \times 3$ symmetric matrix known as the **Inertia Tensor** $\mathbf{I}$:

$$\mathbf{L} = \mathbf{I} \boldsymbol{\omega}$$

---

## 2.2 Deriving Angular Momentum from Particle Mechanics

To discover the exact mathematical form of the Inertia Tensor, let us construct a rigid body out of a collection of $N$ discrete point masses $m_1, m_2, \dots, m_N$, located at position vectors $\mathbf{r}_1, \mathbf{r}_2, \dots, \mathbf{r}_N$ relative to a chosen coordinate origin $\mathbf{O}$.

Suppose the body rotates about the origin with instantaneous angular velocity vector $\boldsymbol{\omega} \in \mathbb{R}^3$. As established in Chapter 1, the velocity of the $i$-th particle is:

$$\mathbf{v}_i = \boldsymbol{\omega} \times \mathbf{r}_i$$

The total angular momentum $\mathbf{L}$ of the system about the origin $\mathbf{O}$ is the vector sum of the angular momenta of all individual particles:

$$\mathbf{L} = \sum_{i=1}^N \mathbf{r}_i \times \mathbf{p}_i = \sum_{i=1}^N \mathbf{r}_i \times (m_i \mathbf{v}_i) = \sum_{i=1}^N m_i \Big( \mathbf{r}_i \times (\boldsymbol{\omega} \times \mathbf{r}_i) \Big)$$

---

## 2.3 The Vector Triple Product Expansion

To evaluate the cross-product term $\mathbf{r}_i \times (\boldsymbol{\omega} \times \mathbf{r}_i)$, we employ the standard vector triple product identity (often called the **BAC-CAB identity**):

$$\mathbf{A} \times (\mathbf{B} \times \mathbf{C}) = (\mathbf{A} \cdot \mathbf{C})\mathbf{B} - (\mathbf{A} \cdot \mathbf{B})\mathbf{C}$$

Assigning $\mathbf{A} = \mathbf{r}_i$, $\mathbf{B} = \boldsymbol{\omega}$, and $\mathbf{C} = \mathbf{r}_i$:

$$\mathbf{r}_i \times (\boldsymbol{\omega} \times \mathbf{r}_i) = (\mathbf{r}_i \cdot \mathbf{r}_i)\boldsymbol{\omega} - (\mathbf{r}_i \cdot \boldsymbol{\omega})\mathbf{r}_i = \|\mathbf{r}_i\|^2 \boldsymbol{\omega} - (\mathbf{r}_i \cdot \boldsymbol{\omega})\mathbf{r}_i$$

Let us expand this expression in Cartesian components:
$$\mathbf{r}_i = \begin{bmatrix} x_i \\ y_i \\ z_i \end{bmatrix}, \quad \boldsymbol{\omega} = \begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix}$$
$$\|\mathbf{r}_i\|^2 = r_i^2 = x_i^2 + y_i^2 + z_i^2$$
$$\mathbf{r}_i \cdot \boldsymbol{\omega} = x_i \omega_x + y_i \omega_y + z_i \omega_z$$

Now, evaluate the $x$-component of the term $\|\mathbf{r}_i\|^2 \boldsymbol{\omega} - (\mathbf{r}_i \cdot \boldsymbol{\omega})\mathbf{r}_i$:

$$\begin{aligned}
[\mathbf{r}_i \times (\boldsymbol{\omega} \times \mathbf{r}_i)]_x &= (x_i^2 + y_i^2 + z_i^2)\omega_x - (x_i \omega_x + y_i \omega_y + z_i \omega_z) x_i \\
&= (x_i^2 + y_i^2 + z_i^2)\omega_x - x_i^2 \omega_x - x_i y_i \omega_y - x_i z_i \omega_z \\
&= (y_i^2 + z_i^2)\omega_x - x_i y_i \omega_y - x_i z_i \omega_z
\end{aligned}$$

Notice that the $x_i^2 \omega_x$ term cancels out completely!

Similarly, evaluating the $y$-component:
$$[\mathbf{r}_i \times (\boldsymbol{\omega} \times \mathbf{r}_i)]_y = -y_i x_i \omega_x + (x_i^2 + z_i^2)\omega_y - y_i z_i \omega_z$$

And evaluating the $z$-component:
$$[\mathbf{r}_i \times (\boldsymbol{\omega} \times \mathbf{r}_i)]_z = -z_i x_i \omega_x - z_i y_i \omega_y + (x_i^2 + y_i^2)\omega_z$$

---

## 2.4 The 9 Components of the Inertia Tensor

Summing over all particles $i = 1, \dots, N$, we obtain the three Cartesian components of total angular momentum:

$$\begin{aligned}
L_x &= \left[ \sum_{i=1}^N m_i (y_i^2 + z_i^2) \right]\omega_x - \left[ \sum_{i=1}^N m_i x_i y_i \right]\omega_y - \left[ \sum_{i=1}^N m_i x_i z_i \right]\omega_z \\
L_y &= - \left[ \sum_{i=1}^N m_i y_i x_i \right]\omega_x + \left[ \sum_{i=1}^N m_i (x_i^2 + z_i^2) \right]\omega_y - \left[ \sum_{i=1}^N m_i y_i z_i \right]\omega_z \\
L_z &= - \left[ \sum_{i=1}^N m_i z_i x_i \right]\omega_x - \left[ \sum_{i=1}^N m_i z_i y_i \right]\omega_y + \left[ \sum_{i=1}^N m_i (x_i^2 + y_i^2) \right]\omega_z
\end{aligned}$$

This linear system can be written compactly as a single matrix-vector multiplication:

$$\begin{bmatrix} L_x \\ L_y \\ L_z \end{bmatrix} = \begin{bmatrix} I_{xx} & I_{xy} & I_{xz} \\ I_{yx} & I_{yy} & I_{yz} \\ I_{zx} & I_{zy} & I_{zz} \end{bmatrix} \begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix} \iff \mathbf{L} = \mathbf{I} \boldsymbol{\omega}$$

### 1. The Diagonal Elements: Moments of Inertia
The diagonal elements $I_{xx}, I_{yy}, I_{zz}$ are called the **Moments of Inertia** about the $x$, $y$, and $z$ axes:

$$I_{xx} = \sum_{i=1}^N m_i (y_i^2 + z_i^2) \xrightarrow{\text{continuous}} \iiint_V (y^2 + z^2)\rho(\mathbf{r}) \, dV$$
$$I_{yy} = \sum_{i=1}^N m_i (x_i^2 + z_i^2) \xrightarrow{\text{continuous}} \iiint_V (x^2 + z^2)\rho(\mathbf{r}) \, dV$$
$$I_{zz} = \sum_{i=1}^N m_i (x_i^2 + y_i^2) \xrightarrow{\text{continuous}} \iiint_V (x^2 + y^2)\rho(\mathbf{r}) \, dV$$

#### Physical Intuition:
Notice that $y_i^2 + z_i^2 = d_{x,i}^2$ is the **squared perpendicular distance** from particle $i$ to the $x$-axis. Thus, $I_{xx}$ measures the body's resistance to angular acceleration specifically around the $x$-axis!

### 2. The Off-Diagonal Elements: Products of Inertia
The off-diagonal elements $I_{xy}, I_{xz}, I_{yz}$ are called the **Products of Inertia**:

$$I_{xy} = I_{yx} = -\sum_{i=1}^N m_i x_i y_i \xrightarrow{\text{continuous}} -\iiint_V xy \, \rho(\mathbf{r}) \, dV$$
$$I_{xz} = I_{zx} = -\sum_{i=1}^N m_i x_i z_i \xrightarrow{\text{continuous}} -\iiint_V xz \, \rho(\mathbf{r}) \, dV$$
$$I_{yz} = I_{zy} = -\sum_{i=1}^N m_i y_i z_i \xrightarrow{\text{continuous}} -\iiint_V yz \, \rho(\mathbf{r}) \, dV$$

*(Note on Sign Convention: In physics and classical mechanics [Goldstein, Landau & Lifshitz], the negative sign is incorporated directly into the definition of $I_{xy} = -\int xy \, dm$ so that $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$ holds with positive matrix signs. In some engineering textbooks, products of inertia are defined as $P_{xy} = +\int xy \, dm$, requiring explicit minus signs in the off-diagonal entries: $\mathbf{I} = \begin{bmatrix} I_{xx} & -P_{xy} & -P_{xz} \\ -P_{yx} & I_{yy} & -P_{yz} \\ -P_{zx} & -P_{zy} & I_{zz} \end{bmatrix}$. In this treatise and in physics engine architecture, we strictly adhere to the unified tensor convention where $I_{xy} = -\int xy \, dm$).*

### 3. Tensor Index Notation (Kronecker Delta)
In relativistic and continuum mechanics, the entire $3 \times 3$ tensor is expressed in a single elegant formula using index notation:

$$I_{jk} = \sum_{i=1}^N m_i \Big( r_i^2 \delta_{jk} - x_{i,j} x_{i,k} \Big) \xrightarrow{\text{continuous}} \iiint_V \Big( r^2 \delta_{jk} - x_j x_k \Big)\rho(\mathbf{r}) \, dV$$

where $\delta_{jk}$ is the **Kronecker Delta** ($\delta_{jk} = 1$ if $j = k$, and $0$ if $j \ne k$).
- When $j = k = 1$ ($x$-axis): $r^2 \delta_{11} - x_1^2 = (x^2 + y^2 + z^2) - x^2 = y^2 + z^2 = I_{xx}$.
- When $j = 1, k = 2$ ($xy$): $r^2 \delta_{12} - x_1 x_2 = 0 - xy = -xy = I_{xy}$.

---

## 2.5 Mathematical Properties of the Inertia Tensor

The Inertia Tensor $\mathbf{I} \in \mathbb{R}^{3 \times 3}$ is not an arbitrary matrix. It possesses strict geometric and algebraic invariants:

### 1. Strict Real Symmetry
Because multiplication of real spatial coordinates is commutative ($x_i y_i = y_i x_i$):

$$I_{xy} = I_{yx}, \quad I_{xz} = I_{zx}, \quad I_{yz} = I_{zy} \implies \mathbf{I} = \mathbf{I}^T$$

The Inertia Tensor is **always a real symmetric matrix**. By the Spectral Theorem of linear algebra, all of its eigenvalues are guaranteed to be real, and its eigenvectors are mutually orthogonal.

### 2. Positive-Definiteness
Let us calculate the rotational kinetic energy of a body spinning with angular velocity $\boldsymbol{\omega}$:

$$T_{\text{rot}} = \frac{1}{2}\sum_{i=1}^N m_i \|\mathbf{v}_i\|^2 = \frac{1}{2}\sum_{i=1}^N m_i (\boldsymbol{\omega} \times \mathbf{r}_i) \cdot (\boldsymbol{\omega} \times \mathbf{r}_i)$$

Using vector triple product identities, this reduces identically to:

$$T_{\text{rot}} = \frac{1}{2}\boldsymbol{\omega} \cdot \mathbf{L} = \frac{1}{2}\boldsymbol{\omega} \cdot (\mathbf{I}\boldsymbol{\omega}) = \frac{1}{2}\boldsymbol{\omega}^T \mathbf{I} \boldsymbol{\omega}$$

Because kinetic energy must be strictly positive for any non-zero motion ($\boldsymbol{\omega} \ne \mathbf{0}$):

$$\boldsymbol{\omega}^T \mathbf{I} \boldsymbol{\omega} > 0, \quad \forall \boldsymbol{\omega} \ne \mathbf{0}$$

Therefore, the Inertia Tensor is **strictly positive-definite**:
- Its determinant is strictly positive: $\det(\mathbf{I}) > 0$.
- All its eigenvalues are strictly positive real numbers: $\lambda_1, \lambda_2, \lambda_3 > 0$.
- It is always **invertible**: $\mathbf{I}^{-1}$ is guaranteed to exist for any non-degenerate 3D body!

### 3. The Triangle Inequalities of Inertia
Examine the sum of any two diagonal elements:

$$I_{xx} + I_{yy} = \int (y^2 + z^2)dm + \int (x^2 + z^2)dm = \int (x^2 + y^2)dm + 2\int z^2 dm$$

Notice that $\int (x^2 + y^2)dm = I_{zz}$, and $2\int z^2 dm \ge 0$. Therefore:

$$I_{xx} + I_{yy} \ge I_{zz}$$
$$I_{yy} + I_{zz} \ge I_{xx}$$
$$I_{xx} + I_{zz} \ge I_{yy}$$

The moments of inertia satisfy the exact same geometric inequalities as the sides of a triangle! 

#### The Perpendicular Axis Theorem for Flat Sheets:
If the rigid body is an infinitely thin planar sheet lying entirely in the $xy$-plane ($z \equiv 0$), then $2\int z^2 dm = 0$, and the inequality becomes an exact equality:

$$I_{zz} = I_{xx} + I_{yy}$$

This is the famous **Perpendicular Axis Theorem**.

---

## 2.6 10 Step-by-Step Worked Examples

### Worked Example 2.1: Hand Calculation of an Asymmetric Discrete Inertia Tensor
**Problem:** Four point masses are positioned at the corners of a rectangle in the $xy$-plane:
- $m_1 = 1\text{ kg}$ at $(1, 2, 0)\text{ m}$
- $m_2 = 2\text{ kg}$ at $(-1, 2, 0)\text{ m}$
- $m_3 = 3\text{ kg}$ at $(-1, -2, 0)\text{ m}$
- $m_4 = 4\text{ kg}$ at $(1, -2, 0)\text{ m}$
Compute all 9 components of the $3 \times 3$ Inertia Tensor $\mathbf{I}$.
**Solution:**
1. Since all $z_i = 0$:
   $I_{xz} = -\sum m_i x_i (0) = 0$, $I_{yz} = -\sum m_i y_i (0) = 0$.
2. Compute $I_{xx} = \sum m_i (y_i^2 + z_i^2) = \sum m_i y_i^2$:
   $y_i^2 = 2^2 = 4$ for all particles.
   $$I_{xx} = (1)(4) + (2)(4) + (3)(4) + (4)(4) = 4(1 + 2 + 3 + 4) = 4(10) = 40\text{ kg}\cdot\text{m}^2$$
3. Compute $I_{yy} = \sum m_i (x_i^2 + z_i^2) = \sum m_i x_i^2$:
   $x_i^2 = 1^2 = 1$ for all particles.
   $$I_{yy} = (1)(1) + (2)(1) + (3)(1) + (4)(1) = 1(10) = 10\text{ kg}\cdot\text{m}^2$$
4. Compute $I_{zz} = \sum m_i (x_i^2 + y_i^2) = I_{xx} + I_{yy}$:
   $$I_{zz} = 40 + 10 = 50\text{ kg}\cdot\text{m}^2$$
5. Compute the product of inertia $I_{xy} = -\sum m_i x_i y_i$:
   - Particle 1: $-(1)(1)(2) = -2$
   - Particle 2: $-(2)(-1)(2) = +4$
   - Particle 3: $-(3)(-1)(-2) = -6$
   - Particle 4: $-(4)(1)(-2) = +8$
   $$I_{xy} = -2 + 4 - 6 + 8 = +4\text{ kg}\cdot\text{m}^2$$
6. Assemble the matrix:
   $$\mathbf{I} = \begin{bmatrix} 40 & 4 & 0 \\ 4 & 10 & 0 \\ 0 & 0 & 50 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
7. Notice that $I_{xy} \ne 0$ because mass is distributed unequally between the quadrants ($m_4 > m_2$).

---

### Worked Example 2.2: Non-Collinear Angular Momentum Calculation
**Problem:** Using the Inertia Tensor from Example 2.1, suppose the body spins with angular velocity $\boldsymbol{\omega} = (0, 5, 0)\text{ rad/s}$ (pure rotation about the $y$-axis).
1. Calculate the resulting angular momentum vector $\mathbf{L}$.
2. Determine the angle $\theta$ between $\boldsymbol{\omega}$ and $\mathbf{L}$.
**Solution:**
1. Compute $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$:
   $$\mathbf{L} = \begin{bmatrix} 40 & 4 & 0 \\ 4 & 10 & 0 \\ 0 & 0 & 50 \end{bmatrix} \begin{bmatrix} 0 \\ 5 \\ 0 \end{bmatrix} = \begin{bmatrix} 40(0) + 4(5) + 0 \\ 4(0) + 10(5) + 0 \\ 0 + 0 + 50(0) \end{bmatrix} = \begin{bmatrix} 20 \\ 50 \\ 0 \end{bmatrix}\text{ kg}\cdot\text{m}^2/\text{s}$$
2. Notice that although $\boldsymbol{\omega}$ points strictly along the $y$-axis, $\mathbf{L}$ has a non-zero $x$-component ($L_x = 20$)!
3. Compute the angle between $\boldsymbol{\omega}$ and $\mathbf{L}$:
   $$\|\boldsymbol{\omega}\| = 5\text{ rad/s}$$
   $$\|\mathbf{L}\| = \sqrt{20^2 + 50^2} = \sqrt{400 + 2500} = \sqrt{2900} \approx 53.852\text{ kg}\cdot\text{m}^2/\text{s}$$
   $$\boldsymbol{\omega} \cdot \mathbf{L} = (0)(20) + (5)(50) + (0)(0) = 250$$
   $$\cos\theta = \frac{\boldsymbol{\omega} \cdot \mathbf{L}}{\|\boldsymbol{\omega}\| \|\mathbf{L}\|} = \frac{250}{5 \times 53.852} = \frac{250}{269.258} \approx 0.92848$$
   $$\theta = \arccos(0.92848) \approx 0.3807\text{ rad} \approx 21.8^\circ$$
4. Angular momentum deviates by **$21.8^\circ$** from the rotation axis! If this object were mounted on bearings, this angular momentum deviation would generate continuous, destructive bearing vibration.

---

### Worked Example 2.3: Rotational Kinetic Energy Computation
**Problem:** For the state in Worked Example 2.2 ($\boldsymbol{\omega} = (0, 5, 0)$, $\mathbf{L} = (20, 50, 0)$), compute the rotational kinetic energy $T_{\text{rot}}$:
1. Using $T_{\text{rot}} = \frac{1}{2}\boldsymbol{\omega} \cdot \mathbf{L}$.
2. Using $T_{\text{rot}} = \frac{1}{2}\boldsymbol{\omega}^T \mathbf{I} \boldsymbol{\omega}$.
**Solution:**
1. Using $\frac{1}{2}\boldsymbol{\omega} \cdot \mathbf{L}$:
   $$T_{\text{rot}} = \frac{1}{2} \Big( (0)(20) + (5)(50) + (0)(0) \Big) = \frac{1}{2}(250) = 125\text{ J}$$
2. Using matrix multiplication:
   $$\mathbf{I}\boldsymbol{\omega} = \begin{bmatrix} 20 \\ 50 \\ 0 \end{bmatrix}$$
   $$T_{\text{rot}} = \frac{1}{2} \begin{bmatrix} 0 & 5 & 0 \end{bmatrix} \begin{bmatrix} 20 \\ 50 \\ 0 \end{bmatrix} = \frac{1}{2}(5 \times 50) = 125\text{ J}$$
3. Both formulations match identically.

---

### Worked Example 2.4: Inertia Tensor of a Thin Uniform Rod
**Problem:** A thin uniform rod of mass $M$ and length $L$ lies along the $x$-axis from $x = -L/2$ to $x = +L/2$. Calculate its $3 \times 3$ Inertia Tensor about its Center of Mass.
**Solution:**
1. **Model:** Thin rod means cross-sectional dimensions $y \approx 0, z \approx 0$.
   Linear mass density $\lambda = M/L$.
   Mass element $dm = \lambda dx = \frac{M}{L} dx$.
2. **Moments of Inertia:**
   $$I_{xx} = \int (y^2 + z^2) dm = \int (0 + 0) dm = 0$$
   $$I_{yy} = \int (x^2 + z^2) dm = \int_{-L/2}^{L/2} x^2 \left(\frac{M}{L} dx\right) = \frac{M}{L} \left[ \frac{x^3}{3} \right]_{-L/2}^{L/2} = \frac{M}{3L}\left( \frac{L^3}{8} - \left(-\frac{L^3}{8}\right) \right) = \frac{1}{12}M L^2$$
   $$I_{zz} = \int (x^2 + y^2) dm = \int_{-L/2}^{L/2} x^2 \left(\frac{M}{L} dx\right) = \frac{1}{12}M L^2$$
3. **Products of Inertia:**
   Since $y = 0$ and $z = 0$, all off-diagonal products $I_{xy} = I_{xz} = I_{yz} = 0$.
4. **Result:**
   $$\mathbf{I}_{\text{cm}} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & \frac{1}{12}ML^2 & 0 \\ 0 & 0 & \frac{1}{12}ML^2 \end{bmatrix}$$

---

### Worked Example 2.5: Inertia Tensor of a Symmetric Planar Disc
**Problem:** A thin uniform circular disc of mass $M$ and radius $R$ lies in the $xy$-plane centered at the origin. Compute its Inertia Tensor.
**Solution:**
1. In polar coordinates: $x = r\cos\theta, y = r\sin\theta, z = 0$.
   Area density $\sigma = \frac{M}{\pi R^2}$.
   Area element $dA = r \, dr \, d\theta$, $dm = \sigma r \, dr \, d\theta$.
2. Compute $I_{zz}$:
   $$I_{zz} = \iint (x^2 + y^2) dm = \int_0^{2\pi} d\theta \int_0^R r^2 (\sigma r \, dr) = 2\pi \sigma \left[ \frac{r^4}{4} \right]_0^R = \frac{2\pi \sigma R^4}{4} = \frac{1}{2}(\pi R^2 \sigma) R^2 = \frac{1}{2}M R^2$$
3. Compute $I_{xx}$ and $I_{yy}$:
   By rotational symmetry about the $z$-axis: $I_{xx} = I_{yy}$.
   By the Perpendicular Axis Theorem: $I_{xx} + I_{yy} = I_{zz}$.
   $$2 I_{xx} = I_{zz} \implies I_{xx} = I_{yy} = \frac{1}{4}M R^2$$
4. Products of inertia vanish by symmetry ($\int_0^{2\pi} \sin\theta\cos\theta \, d\theta = 0$).
5. Matrix:
   $$\mathbf{I} = \begin{bmatrix} \frac{1}{4}MR^2 & 0 & 0 \\ 0 & \frac{1}{4}MR^2 & 0 \\ 0 & 0 & \frac{1}{2}MR^2 \end{bmatrix}$$

---

### Worked Example 2.6: Inverting an Inertia Tensor for Physics Simulation
**Problem:** A spacecraft has diagonal inertia tensor $\mathbf{I} = \text{diag}(1000, 2500, 3000)\text{ kg}\cdot\text{m}^2$. If its angular momentum in the body frame is $\mathbf{L} = (200, -500, 1500)\text{ N}\cdot\text{m}\cdot\text{s}$, compute its instantaneous angular velocity $\boldsymbol{\omega}$.
**Solution:**
1. The relationship is $\mathbf{L} = \mathbf{I}\boldsymbol{\omega} \implies \boldsymbol{\omega} = \mathbf{I}^{-1}\mathbf{L}$.
2. For a diagonal matrix, the inverse is trivially the reciprocal of each diagonal entry:
   $$\mathbf{I}^{-1} = \begin{bmatrix} 1/1000 & 0 & 0 \\ 0 & 1/2500 & 0 \\ 0 & 0 & 1/3000 \end{bmatrix} = \begin{bmatrix} 0.001 & 0 & 0 \\ 0 & 0.0004 & 0 \\ 0 & 0 & 0.000333 \end{bmatrix}$$
3. Multiply by $\mathbf{L}$:
   $$\omega_x = \frac{L_x}{I_{xx}} = \frac{200}{1000} = 0.20\text{ rad/s}$$
   $$\omega_y = \frac{L_y}{I_{yy}} = \frac{-500}{2500} = -0.20\text{ rad/s}$$
   $$\omega_z = \frac{L_z}{I_{zz}} = \frac{1500}{3000} = 0.50\text{ rad/s}$$
4. Result: $\boldsymbol{\omega} = (0.20, -0.20, 0.50)\text{ rad/s}$.
   In physics engines, keeping $\mathbf{I}$ diagonal in the body frame allows computing $\boldsymbol{\omega}$ in **3 floating-point multiplications** with zero matrix inversion overhead!

---

### Worked Example 2.7: Verifying Positive-Definiteness via Sylvester's Criterion
**Problem:** Prove that the matrix $\mathbf{I} = \begin{bmatrix} 5 & -1 & 0 \\ -1 & 5 & -1 \\ 0 & -1 & 5 \end{bmatrix}$ is positive-definite.
**Solution:**
By Sylvester's Criterion, a symmetric matrix is positive-definite if and only if all of its leading principal minors are strictly positive:
1. **First leading minor:**
   $$\Delta_1 = \det([5]) = 5 > 0$$
2. **Second leading minor:**
   $$\Delta_2 = \det\left(\begin{bmatrix} 5 & -1 \\ -1 & 5 \end{bmatrix}\right) = 5(5) - (-1)(-1) = 25 - 1 = 24 > 0$$
3. **Third leading minor (full determinant):**
   $$\Delta_3 = \det(\mathbf{I}) = 5(25 - 1) - (-1)((-1)(5) - 0) + 0 = 5(24) + 1(-5) = 120 - 5 = 115 > 0$$
4. Since $\Delta_1 > 0$, $\Delta_2 > 0$, and $\Delta_3 > 0$, the matrix is strictly positive-definite. It represents a physically valid inertia tensor.

---

### Worked Example 2.8: Torque Required for Constant Angular Velocity
**Problem:** A motor spins a shaft with non-zero product of inertia $I_{xz} = 10\text{ kg}\cdot\text{m}^2$ at constant angular speed $\omega = 100\text{ rad/s}$ about the $z$-axis ($\boldsymbol{\omega} = (0, 0, \omega)$). What torque must the shaft bearings exert to maintain this steady spin?
**Solution:**
1. Compute angular momentum:
   $$L_x = I_{xz} \omega_z = 10 \times 100 = 1000\text{ N}\cdot\text{m}\cdot\text{s}$$
   $$L_y = I_{yz} \omega_z = 0$$
   $$L_z = I_{zz} \omega_z$$
   $$\mathbf{L} = (I_{xz}\omega, 0, I_{zz}\omega)$$
2. Because the body is rotating, the vector $\mathbf{L}$ rotates in space with rate $\boldsymbol{\omega}$:
   $$\dot{\mathbf{L}} = \boldsymbol{\omega} \times \mathbf{L}$$
3. Evaluate the cross product:
   $$\boldsymbol{\tau}_{\text{bearings}} = \boldsymbol{\omega} \times \mathbf{L} = \begin{bmatrix} 0 \\ 0 \\ \omega \end{bmatrix} \times \begin{bmatrix} I_{xz}\omega \\ 0 \\ I_{zz}\omega \end{bmatrix} = \begin{bmatrix} 0 \\ \omega(I_{xz}\omega) \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ I_{xz}\omega^2 \\ 0 \end{bmatrix}$$
4. Numerical value:
   $$\tau_y = (10)(100)^2 = 10 \times 10000 = 100,000\text{ N}\cdot\text{m}$$
5. Result: Even though rotation speed is **constant**, the bearings must continuously exert a gigantic **$100\text{ kN}\cdot\text{m}$ bending torque** that rotates with the shaft! This is why high-speed rotors must be dynamically balanced to eliminate off-diagonal products of inertia.

---

### Worked Example 2.9: Triangle Inequality Violation Detection
**Problem:** An author writes a game physics engine and inputs the following moments of inertia for an entity:
$$I_{xx} = 2.0, \quad I_{yy} = 3.0, \quad I_{zz} = 6.0$$
Is this physically possible?
**Solution:**
1. Check the triangle inequality:
   $$I_{xx} + I_{yy} \ge I_{zz}$$
2. Evaluate:
   $$2.0 + 3.0 = 5.0 < 6.0$$
3. The sum of $I_{xx} + I_{yy}$ is less than $I_{zz}$.
4. Recall the definitions:
   $I_{xx} + I_{yy} = \int (x^2 + y^2 + 2z^2)dm = I_{zz} + 2\int z^2 dm$.
   This requires $2\int z^2 dm = 5.0 - 6.0 = -1.0 < 0$, which is mathematically impossible for real masses and coordinates!
5. Conclusion: No physical 3D object can have these moments of inertia. The engine will exhibit unphysical numerical artifacts or negative effective kinetic energy.

---

### Worked Example 2.10: The Kronecker Delta Formulation
**Problem:** Use the index notation $I_{jk} = \int (r^2 \delta_{jk} - x_j x_k)dm$ to derive the explicit formula for $I_{yy}$ and $I_{yz}$.
**Solution:**
1. For $I_{yy}$, let $j = 2, k = 2$:
   $$I_{22} = \int (r^2 \delta_{22} - x_2 x_2) dm$$
   Since $j = k$, $\delta_{22} = 1$.
   $r^2 = x_1^2 + x_2^2 + x_3^2 = x^2 + y^2 + z^2$.
   $x_2 x_2 = y^2$.
   $$I_{22} = \int (x^2 + y^2 + z^2 - y^2) dm = \int (x^2 + z^2) dm = I_{yy}$$
2. For $I_{yz}$, let $j = 2, k = 3$:
   $$I_{23} = \int (r^2 \delta_{23} - x_2 x_3) dm$$
   Since $j \ne k$, $\delta_{23} = 0$.
   $x_2 x_3 = yz$.
   $$I_{23} = \int (0 - yz) dm = -\int yz \, dm = I_{yz}$$
3. The index notation compactly and correctly yields both diagonal and off-diagonal formulas.

---

## 2.7 10 Granular Solved Exercises

### Exercise 2.1
**Problem:** Prove that for any solid rigid body, the trace of the Inertia Tensor satisfies $\text{tr}(\mathbf{I}) = 2\int r^2 dm$.
**Solution:**
1. The trace is the sum of diagonal entries:
   $$\text{tr}(\mathbf{I}) = I_{xx} + I_{yy} + I_{zz}$$
2. Substitute the integral definitions:
   $$\text{tr}(\mathbf{I}) = \int (y^2 + z^2) dm + \int (x^2 + z^2) dm + \int (x^2 + y^2) dm$$
3. Group terms:
   $$\text{tr}(\mathbf{I}) = \int (2x^2 + 2y^2 + 2z^2) dm = 2\int (x^2 + y^2 + z^2) dm = 2\int r^2 dm$$
4. Thus, the trace is directly proportional to the second moment of the mass distribution from the origin, and is strictly invariant under any 3D rotation of coordinate axes.

---

### Exercise 2.2
**Problem:** A rigid body has $I_{xx} = 10, I_{yy} = 15, I_{zz} = 20$, and all products of inertia zero. If $\boldsymbol{\omega} = (1, 1, 1)\text{ rad/s}$, compute the kinetic energy $T_{\text{rot}}$.
**Solution:**
1. $\mathbf{L} = \mathbf{I}\boldsymbol{\omega} = (10(1), 15(1), 20(1)) = (10, 15, 20)\text{ N}\cdot\text{m}\cdot\text{s}$.
2. Kinetic energy:
   $$T_{\text{rot}} = \frac{1}{2}\boldsymbol{\omega} \cdot \mathbf{L} = \frac{1}{2}(10 + 15 + 20) = \frac{1}{2}(45) = 22.5\text{ J}$$.

---

### Exercise 2.3
**Problem:** If a rigid body has reflection symmetry across the plane $y = 0$, prove that $I_{xy} = 0$ and $I_{yz} = 0$.
**Solution:**
1. Reflection symmetry across $y = 0$ implies that for every mass element at $(x, y, z)$, there is an equal mass element at $(x, -y, z)$ with identical density $\rho(x, y, z) = \rho(x, -y, z)$.
2. Product of inertia $I_{xy}$:
   $$I_{xy} = -\iiint x y \rho(x, y, z) dx \, dy \, dz$$
   The integrand is an **odd function** with respect to $y$, since $x(-y)\rho(x, -y, z) = -xy\rho(x, y, z)$.
   Integrating an odd function over symmetric bounds $[-Y, +Y]$ yields identically zero: $I_{xy} = 0$.
3. Product of inertia $I_{yz}$:
   $$I_{yz} = -\iiint y z \rho(x, y, z) dx \, dy \, dz$$
   The integrand is again odd with respect to $y$ ($(-y)z = -yz$).
   Therefore, $I_{yz} = 0$.
4. Thus, any symmetry plane causes two off-diagonal products of inertia to vanish.

---

### Exercise 2.4
**Problem:** Prove that if a body has two orthogonal planes of reflection symmetry, its Inertia Tensor is strictly diagonal in that coordinate frame.
**Solution:**
1. Let the two symmetry planes be $y = 0$ and $z = 0$.
2. Symmetry across $y = 0$ implies $I_{xy} = 0$ and $I_{yz} = 0$ (from Exercise 2.3).
3. Symmetry across $z = 0$ implies $I_{xz} = 0$ and $I_{yz} = 0$.
4. Combining both: $I_{xy} = 0$, $I_{xz} = 0$, and $I_{yz} = 0$.
5. All three off-diagonal terms are zero. The Inertia Tensor is strictly diagonal: $\mathbf{I} = \text{diag}(I_{xx}, I_{yy}, I_{zz})$.

---

### Exercise 2.5
**Problem:** A point mass $m = 5\text{ kg}$ is located at $\mathbf{r} = (1, 2, 3)\text{ m}$. Compute its $3 \times 3$ Inertia Tensor about the origin.
**Solution:**
1. $r^2 = 1^2 + 2^2 + 3^2 = 1 + 4 + 9 = 14$.
2. Diagonal elements:
   $$I_{xx} = m(y^2 + z^2) = 5(4 + 9) = 5(13) = 65\text{ kg}\cdot\text{m}^2$$
   $$I_{yy} = m(x^2 + z^2) = 5(1 + 9) = 5(10) = 50\text{ kg}\cdot\text{m}^2$$
   $$I_{zz} = m(x^2 + y^2) = 5(1 + 4) = 5(5) = 25\text{ kg}\cdot\text{m}^2$$
3. Off-diagonal elements:
   $$I_{xy} = -m x y = -5(1)(2) = -10\text{ kg}\cdot\text{m}^2$$
   $$I_{xz} = -m x z = -5(1)(3) = -15\text{ kg}\cdot\text{m}^2$$
   $$I_{yz} = -m y z = -5(2)(3) = -30\text{ kg}\cdot\text{m}^2$$
4. Assembled matrix:
   $$\mathbf{I} = \begin{bmatrix} 65 & -10 & -15 \\ -10 & 50 & -30 \\ -15 & -30 & 25 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$.

---

### Exercise 2.6
**Problem:** In Exercise 2.5, verify that the matrix can be written in outer product form as $\mathbf{I} = m(r^2 \mathbf{I}_3 - \mathbf{r} \mathbf{r}^T)$.
**Solution:**
1. $m r^2 \mathbf{I}_3 = 5(14)\mathbf{I}_3 = 70 \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 70 & 0 & 0 \\ 0 & 70 & 0 \\ 0 & 0 & 70 \end{bmatrix}$.
2. Outer product $\mathbf{r} \mathbf{r}^T$:
   $$\mathbf{r} \mathbf{r}^T = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \begin{bmatrix} 1 & 2 & 3 \end{bmatrix} = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 3 & 6 & 9 \end{bmatrix}$$
3. Multiply by $m = 5$:
   $$m \mathbf{r} \mathbf{r}^T = \begin{bmatrix} 5 & 10 & 15 \\ 10 & 20 & 30 \\ 15 & 30 & 45 \end{bmatrix}$$
4. Subtract:
   $$\mathbf{I} = \begin{bmatrix} 70 - 5 & 0 - 10 & 0 - 15 \\ 0 - 10 & 70 - 20 & 0 - 30 \\ 0 - 15 & 0 - 30 & 70 - 45 \end{bmatrix} = \begin{bmatrix} 65 & -10 & -15 \\ -10 & 50 & -30 \\ -15 & -30 & 25 \end{bmatrix}$$
5. Matches Exercise 2.5 identically.

---

### Exercise 2.7
**Problem:** Show that for a planar rigid body in the $xy$-plane, $I_{xx} + I_{yy} = I_{zz}$ holds even if the body is non-uniform and has arbitrary shape.
**Solution:**
1. For any planar mass distribution in the $xy$-plane, every mass element has $z = 0$.
2. $I_{xx} = \int (y^2 + 0^2) dm = \int y^2 dm$.
3. $I_{yy} = \int (x^2 + 0^2) dm = \int x^2 dm$.
4. $I_{zz} = \int (x^2 + y^2) dm$.
5. Adding $I_{xx} + I_{yy} = \int y^2 dm + \int x^2 dm = \int (x^2 + y^2) dm = I_{zz}$.
6. This holds strictly for any planar geometry, uniform or non-uniform.

---

### Exercise 2.8
**Problem:** Under what condition is the angular momentum vector $\mathbf{L}$ parallel to the angular velocity vector $\boldsymbol{\omega}$?
**Solution:**
1. The condition is $\mathbf{L} = \lambda \boldsymbol{\omega}$ for some scalar $\lambda > 0$.
2. Since $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$, this requires $\mathbf{I}\boldsymbol{\omega} = \lambda \boldsymbol{\omega}$.
3. This is precisely the definition of an **eigenvector equation** for the matrix $\mathbf{I}$.
4. Therefore, $\mathbf{L}$ is parallel to $\boldsymbol{\omega}$ if and only if $\boldsymbol{\omega}$ points along one of the **principal axes of inertia** of the body.

---

### Exercise 2.9
**Problem:** Calculate the determinant of the inertia tensor of a spherical solid of mass $M$ and radius $R$, where $\mathbf{I} = \frac{2}{5}MR^2 \mathbf{I}_3$.
**Solution:**
1. $\mathbf{I} = \text{diag}(c, c, c)$ where $c = \frac{2}{5}MR^2$.
2. The determinant of a scalar multiple of identity $\det(c \mathbf{I}_3) = c^3$.
3. $\det(\mathbf{I}) = \left(\frac{2}{5}MR^2\right)^3 = \frac{8}{125} M^3 R^6$.
4. Since $M > 0, R > 0$, $\det(\mathbf{I}) > 0$, confirming positive-definiteness.

---

### Exercise 2.10
**Problem:** In a physics engine, if $\boldsymbol{\omega} = (0, 0, 0)$, what is the rotational kinetic energy? Does positive-definiteness require $T_{\text{rot}} > 0$ when $\boldsymbol{\omega} = \mathbf{0}$?
**Solution:**
1. At $\boldsymbol{\omega} = \mathbf{0}$, $T_{\text{rot}} = \frac{1}{2}\mathbf{0}^T \mathbf{I} \mathbf{0} = 0$.
2. By the mathematical definition of positive-definiteness, $\mathbf{x}^T \mathbf{A} \mathbf{x} > 0$ for all non-zero vectors $\mathbf{x} \ne \mathbf{0}$, and $\mathbf{x}^T \mathbf{A} \mathbf{x} = 0$ if and only if $\mathbf{x} = \mathbf{0}$.
3. Thus, $T_{\text{rot}} = 0$ at rest is completely consistent with positive-definiteness.
