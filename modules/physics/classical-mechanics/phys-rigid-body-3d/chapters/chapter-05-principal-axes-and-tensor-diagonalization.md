# Chapter 5: Principal Axes of Inertia and Tensor Diagonalization

> *"Every rigid body, no matter how contorted or asymmetric its physical form, possesses three mutually perpendicular sacred directions. Along these directions, the shadow of cross-coupling disappears, torque aligns purely with acceleration, and the inertia tensor simplifies into pure diagonal harmony."*

---

## 5.1 The Spectral Theorem and the Gift of Diagonalization

In Chapter 2, we discovered that in an arbitrary coordinate frame, the Inertia Tensor is a fully populated $3 \times 3$ symmetric matrix:

$$\mathbf{I} = \begin{bmatrix} I_{xx} & I_{xy} & I_{xz} \\ I_{yx} & I_{yy} & I_{yz} \\ I_{zx} & I_{zy} & I_{zz} \end{bmatrix}$$

Because the off-diagonal products of inertia ($I_{xy}, I_{xz}, I_{yz}$) are non-zero, spinning the object about the $x$-axis produces unwanted angular momentum components along the $y$ and $z$ axes:

$$\mathbf{L} = \mathbf{I} \begin{bmatrix} \omega_x \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} I_{xx}\omega_x \\ I_{yx}\omega_x \\ I_{zx}\omega_x \end{bmatrix}$$

This cross-coupling severely complicates equations of motion, forcing engineers to solve three simultaneous, coupled non-linear differential equations.

Can we find a special coordinate frame—rotated relative to the original body—in which all off-diagonal products of inertia **vanish identically**?

The answer is delivered by one of the crowning achievements of linear algebra: **The Spectral Theorem for Real Symmetric Matrices**:

> **The Spectral Theorem:**  
> *For any real symmetric matrix $\mathbf{I} = \mathbf{I}^T \in \mathbb{R}^{3 \times 3}$, there exists an orthogonal matrix $\mathbf{R} \in SO(3)$ (a pure 3D rotation) such that:*
> $$\mathbf{R}^T \mathbf{I} \, \mathbf{R} = \boldsymbol{\Lambda} = \begin{bmatrix} I_1 & 0 & 0 \\ 0 & I_2 & 0 \\ 0 & 0 & I_3 \end{bmatrix}$$
> *where $I_1, I_2, I_3 \in \mathbb{R}$ are the eigenvalues of $\mathbf{I}$, and the columns of $\mathbf{R} = [\hat{\mathbf{e}}_1 \; \hat{\mathbf{e}}_2 \; \hat{\mathbf{e}}_3]$ are its orthonormal eigenvectors.*

The eigenvalues $I_1, I_2, I_3$ are called the **Principal Moments of Inertia**, and the orthonormal basis vectors $\hat{\mathbf{e}}_1, \hat{\mathbf{e}}_2, \hat{\mathbf{e}}_3$ are called the **Principal Axes of Inertia**.

```
         Arbitrary Frame (Coupled)              Principal Frame (Diagonalized)
                    Z                                        e₃ (Axis of Max Inertia I₃)
                    │                                        │
                    │   I_xy ≠ 0                             │   I₁₂ = I₁₃ = I₂₃ = 0
                    │   I_xz ≠ 0                             │   (No Cross Coupling!)
                    └─────────── X                           └─────────── e₁ (Min I₁)
                   /        Rotate by R                     /
                  Y         ───────────►                   e₂ (Intermediate I₂)
```

---

## 5.2 The Eigenvalue Problem of Inertia

To find the principal axes and principal moments, we ask: for what unit directions $\hat{\mathbf{n}}$ is the angular momentum $\mathbf{L}$ **strictly collinear** with the angular velocity $\boldsymbol{\omega} = \omega \hat{\mathbf{n}}$?

$$\mathbf{L} = \lambda \boldsymbol{\omega}$$

Substituting $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$:

$$\mathbf{I} \boldsymbol{\omega} = \lambda \boldsymbol{\omega} \iff (\mathbf{I} - \lambda \mathbf{I}_3)\boldsymbol{\omega} = \mathbf{0}$$

For non-trivial rotational solutions ($\boldsymbol{\omega} \ne \mathbf{0}$), the matrix $(\mathbf{I} - \lambda \mathbf{I}_3)$ must be singular, meaning its determinant must be zero:

$$\det(\mathbf{I} - \lambda \mathbf{I}_3) = 0$$

Expanding this determinant yields the cubic **Characteristic Polynomial**:

$$\lambda^3 - c_2 \lambda^2 + c_1 \lambda - c_0 = 0$$

where the polynomial coefficients are the three fundamental rotational invariants:
1. **First Invariant (The Trace):**
   $$c_2 = \text{tr}(\mathbf{I}) = I_{xx} + I_{yy} + I_{zz} = I_1 + I_2 + I_3$$
2. **Second Invariant (Sum of Principal 2x2 Minors):**
   $$c_1 = (I_{xx}I_{yy} - I_{xy}^2) + (I_{yy}I_{zz} - I_{yz}^2) + (I_{xx}I_{zz} - I_{xz}^2) = I_1 I_2 + I_2 I_3 + I_1 I_3$$
3. **Third Invariant (The Determinant):**
   $$c_0 = \det(\mathbf{I}) = I_1 I_2 I_3$$

Because $\mathbf{I}$ is real, symmetric, and positive-definite:
- All three roots $\lambda_1, \lambda_2, \lambda_3$ are **guaranteed to be real and strictly positive**: $0 < I_1 \le I_2 \le I_3$.
- Once each eigenvalue $I_k$ is found, substituting it back into $(\mathbf{I} - I_k \mathbf{I}_3)\hat{\mathbf{e}}_k = \mathbf{0}$ yields the corresponding principal axis unit vector $\hat{\mathbf{e}}_k$.
- Distinct eigenvalues guarantee mutually perpendicular eigenvectors: $\hat{\mathbf{e}}_i \cdot \hat{\mathbf{e}}_j = \delta_{ij}$.

---

## 5.3 The Principal Body Frame

By convention in physics and aerospace mechanics, the principal moments of inertia are ordered in ascending magnitude:

$$0 < I_1 \le I_2 \le I_3$$

- **Axis 1 ($\hat{\mathbf{e}}_1$):** The **Minor Axis** (Axis of *Least* Inertia). Rotation about this axis requires the minimum kinetic energy for a given angular momentum.
- **Axis 2 ($\hat{\mathbf{e}}_2$):** The **Intermediate Axis**. Possesses an inertia strictly between $I_1$ and $I_3$. (As we will prove in Chapter 9, this axis harbors the famous Dzhanibekov instability!).
- **Axis 3 ($\hat{\mathbf{e}}_3$):** The **Major Axis** (Axis of *Greatest* Inertia). Rotation about this axis requires the maximum kinetic energy for a given angular momentum.

### The Right-Handed Body Frame
To ensure that the principal axes form a valid right-handed Cartesian coordinate system:
$$\hat{\mathbf{e}}_1 \times \hat{\mathbf{e}}_2 = \hat{\mathbf{e}}_3$$

If the computed cross product points in the opposite direction ($-\hat{\mathbf{e}}_3$), we simply invert the sign of $\hat{\mathbf{e}}_3 \to -\hat{\mathbf{e}}_3$.

When an object is modeled in this **Principal Body Frame**:
$$\mathbf{I}_{\text{body}} = \begin{bmatrix} I_1 & 0 & 0 \\ 0 & I_2 & 0 \\ 0 & 0 & I_3 \end{bmatrix}$$

The angular momentum simplifies to:
$$L_1 = I_1 \omega_1, \quad L_2 = I_2 \omega_2, \quad L_3 = I_3 \omega_3$$

The rotational kinetic energy simplifies to a pure sum of squares:
$$T_{\text{rot}} = \frac{1}{2}\Big( I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2 \Big)$$

---

## 5.4 Rotational Classification of Rigid Solids

Depending on the multiplicities and equalities of its three principal moments of inertia, any physical solid in the universe falls into one of three fundamental dynamical families:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROTATIONAL INERTIA TAXONOMY                          │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Spherical Top:   I₁ = I₂ = I₃                                        │
│    (Sphere, Cube, Regular Polyhedra)                                    │
│    - Isotropic: Any orthogonal triad is a principal axis set!           │
│    - Angular momentum is always parallel to angular velocity.           │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. Symmetric Top:   I₁ = I₂ ≠ I₃   (or  I₁ ≠ I₂ = I₃)                   │
│    (Cylinder, Cone, Frisbee, Football, Rotor)                           │
│    - Possesses an axis of continuous rotational symmetry (Axis 3).      │
│    - Subtypes:                                                          │
│      • Prolate Top: I₃ < I₁ = I₂  (Cigar, Pencil, American Football)   │
│      • Oblate Top:  I₃ > I₁ = I₂  (Frisbee, Pancake, Coin, Earth)      │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. Asymmetric Top:  I₁ < I₂ < I₃  (All three distinct)                  │
│    (Book, Smartphone, Tennis Racket, Asteroid, Space Station)           │
│    - Truly triaxial: No rotational symmetries.                          │
│    - Exhibits non-linear tumbling and intermediate axis flips!          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5.5 10 Step-by-Step Worked Examples

### Worked Example 5.1: Diagonalizing a 2D-Coupled Inertia Tensor
**Problem:** An unbalanced robotics rotor has the Inertia Tensor:
$$\mathbf{I} = \begin{bmatrix} 7 & -3 & 0 \\ -3 & 7 & 0 \\ 0 & 0 & 10 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
Find its principal moments of inertia $I_1, I_2, I_3$ and its orthonormal principal axes triad.
**Solution:**
1. Notice that the $z$-axis is already uncoupled ($I_{xz} = I_{yz} = 0$). One eigenvalue is immediately:
   $$I_z = 10\text{ kg}\cdot\text{m}^2, \quad \hat{\mathbf{e}}_z = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
2. The remaining eigenvalues come from the upper-left $2 \times 2$ block:
   $$\mathbf{I}_{2\times 2} = \begin{bmatrix} 7 & -3 \\ -3 & 7 \end{bmatrix}$$
3. Characteristic equation:
   $$\det\begin{bmatrix} 7 - \lambda & -3 \\ -3 & 7 - \lambda \end{bmatrix} = (7 - \lambda)^2 - (-3)^2 = (7 - \lambda)^2 - 9 = 0$$
   $$(7 - \lambda)^2 = 9 \implies 7 - \lambda = \pm 3$$
   $$\lambda_a = 7 - 3 = 4\text{ kg}\cdot\text{m}^2$$
   $$\lambda_b = 7 + 3 = 10\text{ kg}\cdot\text{m}^2$$
4. Order the principal moments:
   $$I_1 = 4\text{ kg}\cdot\text{m}^2, \quad I_2 = 10\text{ kg}\cdot\text{m}^2, \quad I_3 = 10\text{ kg}\cdot\text{m}^2$$
   Notice that $I_2 = I_3 = 10$, making this a **symmetric top**!
5. Compute eigenvector for $I_1 = 4$:
   $$\begin{bmatrix} 7 - 4 & -3 \\ -3 & 7 - 4 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 3 & -3 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   $$3x - 3y = 0 \implies x = y$$
   Normalizing: $\hat{\mathbf{e}}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} \approx \begin{bmatrix} 0.7071 \\ 0.7071 \\ 0 \end{bmatrix}$.
6. Compute eigenvector for $I_2 = 10$:
   $$\begin{bmatrix} 7 - 10 & -3 \\ -3 & 7 - 10 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} -3 & -3 \\ -3 & -3 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   $$-3x - 3y = 0 \implies x = -y$$
   Normalizing: $\hat{\mathbf{e}}_2 = \frac{1}{\sqrt{2}}\begin{bmatrix} -1 \\ 1 \\ 0 \end{bmatrix}$.
7. Third axis: $\hat{\mathbf{e}}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$.
8. Check right-handedness:
   $$\hat{\mathbf{e}}_1 \times \hat{\mathbf{e}}_2 = \frac{1}{2} \left( \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} \times \begin{bmatrix} -1 \\ 1 \\ 0 \end{bmatrix} \right) = \frac{1}{2} \begin{bmatrix} 0 \\ 0 \\ 1 - (-1) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \hat{\mathbf{e}}_3$$
   Exact match.

---

### Worked Example 5.2: Verifying Invariants under Rotation
**Problem:** For the matrix in Example 5.1:
$$\mathbf{I} = \begin{bmatrix} 7 & -3 & 0 \\ -3 & 7 & 0 \\ 0 & 0 & 10 \end{bmatrix}$$
Verify that the Trace and Determinant equal the sum and product of the eigenvalues $I_1 = 4, I_2 = 10, I_3 = 10$.
**Solution:**
1. **Trace from original matrix:**
   $$\text{tr}(\mathbf{I}) = 7 + 7 + 10 = 24$$
2. **Trace from eigenvalues:**
   $$I_1 + I_2 + I_3 = 4 + 10 + 10 = 24$$
   Matches identically!
3. **Determinant from original matrix:**
   $$\det(\mathbf{I}) = 10 \times \det\begin{bmatrix} 7 & -3 \\ -3 & 7 \end{bmatrix} = 10 \times (49 - 9) = 10 \times 40 = 400$$
4. **Determinant from eigenvalues:**
   $$I_1 \times I_2 \times I_3 = 4 \times 10 \times 10 = 400$$
   Matches identically!

---

### Worked Example 5.3: Finding Principal Axes of an Asymmetric 3D Matrix
**Problem:** Find the eigenvalues of the fully coupled Inertia Tensor:
$$\mathbf{I} = \begin{bmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 2 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
**Solution:**
1. Characteristic polynomial:
   $$\det(\mathbf{I} - \lambda \mathbf{I}) = \det\begin{bmatrix} 2 - \lambda & -1 & 0 \\ -1 & 2 - \lambda & -1 \\ 0 & -1 & 2 - \lambda \end{bmatrix} = 0$$
2. Expand across row 1:
   $$(2 - \lambda) \left[ (2 - \lambda)^2 - (-1)^2 \right] - (-1) \left[ (-1)(2 - \lambda) - 0 \right] + 0 = 0$$
   $$(2 - \lambda) [ (2 - \lambda)^2 - 1 ] - (2 - \lambda) = 0$$
3. Factor out $(2 - \lambda)$:
   $$(2 - \lambda) \left[ (2 - \lambda)^2 - 1 - 1 \right] = (2 - \lambda) \left[ (2 - \lambda)^2 - 2 \right] = 0$$
4. The three roots are:
   $$2 - \lambda = 0 \implies \lambda_2 = 2$$
   $$(2 - \lambda)^2 = 2 \implies 2 - \lambda = \pm\sqrt{2} \implies \lambda = 2 \mp \sqrt{2}$$
   $$\lambda_1 = 2 - \sqrt{2} \approx 0.5858\text{ kg}\cdot\text{m}^2$$
   $$\lambda_3 = 2 + \sqrt{2} \approx 3.4142\text{ kg}\cdot\text{m}^2$$
5. Principal moments in ascending order:
   $$I_1 = 2 - \sqrt{2} \approx 0.586, \quad I_2 = 2.000, \quad I_3 = 2 + \sqrt{2} \approx 3.414$$
6. Because all three moments are distinct ($I_1 < I_2 < I_3$), this is an **asymmetric top**.

---

### Worked Example 5.4: Classifying Real-World Objects
**Problem:** Classify the following four objects into Spherical, Prolate Symmetric, Oblate Symmetric, or Asymmetric Tops:
1. An official regulation basketball.
2. A frisbee disc of radius $R = 15\text{ cm}$ and thickness $h = 2\text{ cm}$.
3. An American football of length $28\text{ cm}$ and diameter $17\text{ cm}$.
4. A smartphone of dimensions $15\text{ cm} \times 7.5\text{ cm} \times 0.8\text{ cm}$.
**Solution:**
1. **Basketball:** Solid/hollow sphere $\implies I_{xx} = I_{yy} = I_{zz} \implies$ **Spherical Top**.
2. **Frisbee:** Flat circular disc with rotation symmetry about polar axis ($z$).
   $I_{zz} \approx \frac{1}{2}MR^2$, $I_{xx} = I_{yy} \approx \frac{1}{4}MR^2$.
   $I_3 = I_{zz} > I_1 = I_2 \implies$ **Oblate Symmetric Top**.
3. **American Football:** Elongated oval with symmetry about long axis ($z$).
   Mass is closer to $z$-axis than transverse axes $\implies I_{zz} < I_{xx} = I_{yy}$.
   $I_1 = I_{zz} < I_2 = I_3 \implies$ **Prolate Symmetric Top**.
4. **Smartphone:** Rectangular cuboid with $a = 15, b = 7.5, c = 0.8\text{ cm}$.
   $I_{xx} \propto b^2 + c^2 = 56.25 + 0.64 = 56.89$
   $I_{yy} \propto a^2 + c^2 = 225 + 0.64 = 225.64$
   $I_{zz} \propto a^2 + b^2 = 225 + 56.25 = 281.25$
   All three are strictly unequal: $I_1 < I_2 < I_3 \implies$ **Asymmetric Top**.

---

### Worked Example 5.5: Transformation Matrix $\mathbf{R}$ Construction
**Problem:** For the eigenvectors found in Worked Example 5.1:
$$\hat{\mathbf{e}}_1 = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}, \quad \hat{\mathbf{e}}_2 = \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}, \quad \hat{\mathbf{e}}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
Construct the rotation matrix $\mathbf{R}$ and verify that $\mathbf{R}^T \mathbf{I} \mathbf{R} = \text{diag}(4, 10, 10)$.
**Solution:**
1. Assemble $\mathbf{R} = [\hat{\mathbf{e}}_1 \; \hat{\mathbf{e}}_2 \; \hat{\mathbf{e}}_3]$:
   $$\mathbf{R} = \begin{bmatrix} 1/\sqrt{2} & -1/\sqrt{2} & 0 \\ 1/\sqrt{2} & 1/\sqrt{2} & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Compute $\mathbf{I}\mathbf{R}$:
   $$\begin{bmatrix} 7 & -3 & 0 \\ -3 & 7 & 0 \\ 0 & 0 & 10 \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} & -1/\sqrt{2} & 0 \\ 1/\sqrt{2} & 1/\sqrt{2} & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 4/\sqrt{2} & -10/\sqrt{2} & 0 \\ 4/\sqrt{2} & 10/\sqrt{2} & 0 \\ 0 & 0 & 10 \end{bmatrix}$$
3. Compute $\mathbf{R}^T (\mathbf{I}\mathbf{R})$:
   $$\begin{bmatrix} 1/\sqrt{2} & 1/\sqrt{2} & 0 \\ -1/\sqrt{2} & 1/\sqrt{2} & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 4/\sqrt{2} & -10/\sqrt{2} & 0 \\ 4/\sqrt{2} & 10/\sqrt{2} & 0 \\ 0 & 0 & 10 \end{bmatrix}$$
   - Element (1,1): $\frac{1}{\sqrt{2}}\frac{4}{\sqrt{2}} + \frac{1}{\sqrt{2}}\frac{4}{\sqrt{2}} = 2 + 2 = 4$.
   - Element (1,2): $\frac{1}{\sqrt{2}}\left(-\frac{10}{\sqrt{2}}\right) + \frac{1}{\sqrt{2}}\frac{10}{\sqrt{2}} = -5 + 5 = 0$.
   - Element (2,2): $\left(-\frac{1}{\sqrt{2}}\right)\left(-\frac{10}{\sqrt{2}}\right) + \frac{1}{\sqrt{2}}\frac{10}{\sqrt{2}} = 5 + 5 = 10$.
   - Element (3,3): $1 \times 10 = 10$.
4. Result:
   $$\mathbf{R}^T \mathbf{I} \mathbf{R} = \begin{bmatrix} 4 & 0 & 0 \\ 0 & 10 & 0 \\ 0 & 0 & 10 \end{bmatrix}$$
   Exact diagonal tensor verified.

---

### Worked Example 5.6: The Eigenvector for $I_2 = 2$ in Example 5.3
**Problem:** Find the normalized principal axis eigenvector $\hat{\mathbf{e}}_2$ corresponding to eigenvalue $\lambda = 2$ in Worked Example 5.3.
**Solution:**
1. Solve $(\mathbf{I} - 2\mathbf{I}_3)\mathbf{v} = \mathbf{0}$:
   $$\begin{bmatrix} 2 - 2 & -1 & 0 \\ -1 & 2 - 2 & -1 \\ 0 & -1 & 2 - 2 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 \\ -1 & 0 & -1 \\ 0 & -1 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
2. Row 1: $-y = 0 \implies y = 0$.
3. Row 2: $-x - z = 0 \implies z = -x$.
4. Unnormalized eigenvector: $\mathbf{v} = \begin{bmatrix} 1 \\ 0 \\ -1 \end{bmatrix}$.
5. Normalize:
   $$\hat{\mathbf{e}}_2 = \frac{1}{\sqrt{1^2 + 0^2 + (-1)^2}}\begin{bmatrix} 1 \\ 0 \\ -1 \end{bmatrix} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 0.7071 \\ 0 \\ -0.7071 \end{bmatrix}$$.

---

### Worked Example 5.7: Degenerate Subspaces in a Symmetric Top
**Problem:** In a symmetric top with $I_1 = I_2 \ne I_3$, explain why any linear combination of $\hat{\mathbf{e}}_1$ and $\hat{\mathbf{e}}_2$ is also a valid principal axis.
**Solution:**
1. Let $\hat{\mathbf{e}}_1, \hat{\mathbf{e}}_2$ be orthonormal eigenvectors with identical eigenvalue $\lambda$:
   $$\mathbf{I}\hat{\mathbf{e}}_1 = \lambda \hat{\mathbf{e}}_1, \quad \mathbf{I}\hat{\mathbf{e}}_2 = \lambda \hat{\mathbf{e}}_2$$
2. Consider any vector $\mathbf{u} = c_1 \hat{\mathbf{e}}_1 + c_2 \hat{\mathbf{e}}_2$ in the plane spanned by $\hat{\mathbf{e}}_1, \hat{\mathbf{e}}_2$:
   $$\mathbf{I}\mathbf{u} = \mathbf{I}(c_1 \hat{\mathbf{e}}_1 + c_2 \hat{\mathbf{e}}_2) = c_1 \mathbf{I}\hat{\mathbf{e}}_1 + c_2 \mathbf{I}\hat{\mathbf{e}}_2 = c_1 \lambda \hat{\mathbf{e}}_1 + c_2 \lambda \hat{\mathbf{e}}_2 = \lambda (c_1 \hat{\mathbf{e}}_1 + c_2 \hat{\mathbf{e}}_2) = \lambda \mathbf{u}$$
3. Because $\mathbf{I}\mathbf{u} = \lambda \mathbf{u}$ holds for **every** vector in this 2D plane, the entire plane is an eigenspace!
4. Therefore, any two mutually perpendicular unit vectors in this plane serve as valid principal axes. The principal axes are unique only up to an arbitrary rotation around the symmetry axis $\hat{\mathbf{e}}_3$.

---

### Worked Example 5.8: Principal Axes of a Plane of Symmetry
**Problem:** If a rigid body has a plane of symmetry $z = 0$, prove directly from the eigenvalue equation that $\hat{\mathbf{z}} = (0, 0, 1)$ is automatically a principal axis of inertia.
**Solution:**
1. From Exercise 2.3, reflection symmetry across $z = 0$ implies $I_{xz} = 0$ and $I_{yz} = 0$.
2. The Inertia Tensor takes the block form:
   $$\mathbf{I} = \begin{bmatrix} I_{xx} & I_{xy} & 0 \\ I_{yx} & I_{yy} & 0 \\ 0 & 0 & I_{zz} \end{bmatrix}$$
3. Multiply by unit vector $\hat{\mathbf{z}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$:
   $$\mathbf{I}\hat{\mathbf{z}} = \begin{bmatrix} I_{xx} & I_{xy} & 0 \\ I_{yx} & I_{yy} & 0 \\ 0 & 0 & I_{zz} \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ I_{zz} \end{bmatrix} = I_{zz} \hat{\mathbf{z}}$$
4. Since $\mathbf{I}\hat{\mathbf{z}} = I_{zz}\hat{\mathbf{z}}$, the vector $\hat{\mathbf{z}}$ satisfies the eigenvector equation with eigenvalue $I_{zz}$.
5. Therefore, the normal to any plane of mass symmetry is **guaranteed** to be a principal axis of inertia!

---

### Worked Example 5.9: Ellipsoid of Inertia (Poinsot's Metric Surface)
**Problem:** Define the **Ellipsoid of Inertia** of a rigid body and show that the distance from the origin to the surface of the ellipsoid along unit direction $\hat{\mathbf{n}}$ is $1/\sqrt{I_{\hat{\mathbf{n}}}}$.
**Solution:**
1. Let $\mathbf{r} = (x, y, z)$ be a position vector from the Center of Mass.
2. The Ellipsoid of Inertia is defined by the quadratic equation:
   $$\mathbf{r}^T \mathbf{I} \mathbf{r} = 1 \iff I_{xx}x^2 + I_{yy}y^2 + I_{zz}z^2 + 2I_{xy}xy + 2I_{xz}xz + 2I_{yz}yz = 1$$
3. In the principal coordinate frame, this becomes:
   $$I_1 x_1^2 + I_2 x_2^2 + I_3 x_3^2 = 1$$
   This is the standard equation of an ellipsoid with semi-axes lengths $\frac{1}{\sqrt{I_1}}, \frac{1}{\sqrt{I_2}}, \frac{1}{\sqrt{I_3}}$.
4. Let $\mathbf{r} = \rho \hat{\mathbf{n}}$ where $\hat{\mathbf{n}}$ is a unit vector and $\rho$ is the distance to the surface:
   $$(\rho \hat{\mathbf{n}})^T \mathbf{I} (\rho \hat{\mathbf{n}}) = 1 \implies \rho^2 (\hat{\mathbf{n}}^T \mathbf{I} \hat{\mathbf{n}}) = 1$$
5. Since $I_{\hat{\mathbf{n}}} = \hat{\mathbf{n}}^T \mathbf{I} \hat{\mathbf{n}}$ is the moment of inertia about axis $\hat{\mathbf{n}}$:
   $$\rho^2 I_{\hat{\mathbf{n}}} = 1 \implies \rho = \frac{1}{\sqrt{I_{\hat{\mathbf{n}}}}}$$
6. The geometry of the ellipsoid visually encapsulates the moment of inertia in every spatial direction: the longer the semi-axis of the ellipsoid, the smaller the body's moment of inertia in that direction!

---

### Worked Example 5.10: Torsional Vibration Decoupling
**Problem:** In an electric vehicle drivetrain, why does aligning the motor rotor's shaft with one of its principal axes eliminate high-frequency gyroscopic bearing reactions?
**Solution:**
1. The angular momentum is $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$.
2. If the shaft is a principal axis, $\boldsymbol{\omega} = \omega \hat{\mathbf{e}}_1 \implies \mathbf{L} = I_1 \omega \hat{\mathbf{e}}_1$.
3. Then $\mathbf{L}$ is strictly parallel to $\boldsymbol{\omega}$.
4. The gyroscopic bearing torque is:
   $$\boldsymbol{\tau}_{\text{bearings}} = \boldsymbol{\omega} \times \mathbf{L} = \boldsymbol{\omega} \times (\lambda \boldsymbol{\omega}) = \lambda (\boldsymbol{\omega} \times \boldsymbol{\omega}) \equiv \mathbf{0}$$
5. The gyroscopic torque vanishes identically! The shaft spins freely without exerting any cyclic, rotating bending forces on the motor housing, preventing fatigue failure.

---

## 5.6 10 Granular Solved Exercises

### Exercise 5.1
**Problem:** Prove that if $\lambda_i \ne \lambda_j$ are two distinct eigenvalues of a real symmetric matrix $\mathbf{I}$, their eigenvectors $\mathbf{v}_i$ and $\mathbf{v}_j$ are orthogonal.
**Solution:**
1. $\mathbf{I}\mathbf{v}_i = \lambda_i \mathbf{v}_i$ and $\mathbf{I}\mathbf{v}_j = \lambda_j \mathbf{v}_j$.
2. Take the inner product: $\mathbf{v}_j^T (\mathbf{I}\mathbf{v}_i) = \mathbf{v}_j^T (\lambda_i \mathbf{v}_i) = \lambda_i (\mathbf{v}_j \cdot \mathbf{v}_i)$.
3. Because $\mathbf{I}$ is symmetric, $\mathbf{v}_j^T \mathbf{I} = (\mathbf{I}\mathbf{v}_j)^T = (\lambda_j \mathbf{v}_j)^T = \lambda_j \mathbf{v}_j^T$.
4. Then $\mathbf{v}_j^T \mathbf{I} \mathbf{v}_i = \lambda_j (\mathbf{v}_j \cdot \mathbf{v}_i)$.
5. Equating the two expressions:
   $$\lambda_i (\mathbf{v}_j \cdot \mathbf{v}_i) = \lambda_j (\mathbf{v}_j \cdot \mathbf{v}_i) \implies (\lambda_i - \lambda_j)(\mathbf{v}_j \cdot \mathbf{v}_i) = 0$$
6. Since $\lambda_i \ne \lambda_j$, $\lambda_i - \lambda_j \ne 0$.
7. Therefore, $\mathbf{v}_j \cdot \mathbf{v}_i = 0$, proving orthogonality.

---

### Exercise 5.2
**Problem:** Find the principal moments of inertia for $\mathbf{I} = \begin{bmatrix} 3 & 1 & 0 \\ 1 & 3 & 0 \\ 0 & 0 & 8 \end{bmatrix}$.
**Solution:**
1. Eigenvalue $\lambda_z = 8$ is obvious.
2. For the $2 \times 2$ block: $\det\begin{bmatrix} 3 - \lambda & 1 \\ 1 & 3 - \lambda \end{bmatrix} = (3 - \lambda)^2 - 1 = 0$.
3. $(3 - \lambda) = \pm 1 \implies \lambda = 3 \mp 1$.
   $\lambda_1 = 2$, $\lambda_2 = 4$.
4. Principal moments in ascending order:
   $$I_1 = 2, \quad I_2 = 4, \quad I_3 = 8$$.

---

### Exercise 5.3
**Problem:** Show that for a planar sheet, the principal axis perpendicular to the sheet has eigenvalue $I_3 = I_1 + I_2$.
**Solution:**
1. For a planar sheet in the $xy$-plane, $z = 0$.
2. As shown in Exercise 5.8, $\hat{\mathbf{z}}$ is a principal axis with eigenvalue $I_3 = I_{zz}$.
3. In the principal frame, $I_{xx} = I_1$ and $I_{yy} = I_2$.
4. By the Perpendicular Axis Theorem: $I_{zz} = I_{xx} + I_{yy}$.
5. Therefore, $I_3 = I_1 + I_2$.

---

### Exercise 5.4
**Problem:** In an asymmetric top with $I_1 < I_2 < I_3$, what is the geometric shape of the cross-section of the Ellipsoid of Inertia cut by the plane $x_2 = 0$?
**Solution:**
1. In the principal frame, the Ellipsoid of Inertia is $I_1 x_1^2 + I_2 x_2^2 + I_3 x_3^2 = 1$.
2. Setting $x_2 = 0$ yields the curve:
   $$I_1 x_1^2 + I_3 x_3^2 = 1 \iff \frac{x_1^2}{(1/\sqrt{I_1})^2} + \frac{x_3^2}{(1/\sqrt{I_3})^2} = 1$$
3. This is an **ellipse** in the $x_1 x_3$-plane with semi-major axis $1/\sqrt{I_1}$ and semi-minor axis $1/\sqrt{I_3}$.

---

### Exercise 5.5
**Problem:** Can a non-symmetric 3D object have a spherical top inertia tensor ($I_1 = I_2 = I_3$)?
**Solution:**
1. Yes. Dynamic symmetry does not require geometric symmetry.
2. For example, a rectangular cuboid with side lengths $a, b, c$ satisfies $I_{xx} = \frac{1}{12}M(b^2 + c^2)$, $I_{yy} = \frac{1}{12}M(a^2 + c^2)$, $I_{zz} = \frac{1}{12}M(a^2 + b^2)$.
3. Setting $b^2 + c^2 = a^2 + c^2 = a^2 + b^2$ forces $a = b = c$ (a cube).
4. However, four point masses of equal mass $m$ placed at the vertices of a regular tetrahedron, or a compound body combining a cylinder and two perpendicular rods, can have $I_1 = I_2 = I_3$ while having completely different geometric silhouettes.

---

### Exercise 5.6
**Problem:** If $\mathbf{I} = \text{diag}(10, 20, 30)$ in a body frame, write down the kinetic energy $T$ when $\boldsymbol{\omega} = (2, -1, 3)\text{ rad/s}$.
**Solution:**
1. $T = \frac{1}{2}(I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2)$.
2. Compute each term:
   $I_1 \omega_1^2 = 10(2^2) = 10(4) = 40$
   $I_2 \omega_2^2 = 20((-1)^2) = 20(1) = 20$
   $I_3 \omega_3^2 = 30(3^2) = 30(9) = 270$
3. Sum:
   $$T = \frac{1}{2}(40 + 20 + 270) = \frac{1}{2}(330) = 165\text{ J}$$.

---

### Exercise 5.7
**Problem:** Prove that the characteristic polynomial coefficients $c_2 = \text{tr}(\mathbf{I})$ and $c_0 = \det(\mathbf{I})$ remain strictly invariant under any 3D coordinate rotation $\mathbf{R}$.
**Solution:**
1. Under rotation $\mathbf{R} \in SO(3)$, the transformed tensor is $\mathbf{I}' = \mathbf{R}^T \mathbf{I} \mathbf{R}$.
2. Trace cyclic invariance:
   $$\text{tr}(\mathbf{I}') = \text{tr}(\mathbf{R}^T \mathbf{I} \mathbf{R}) = \text{tr}(\mathbf{I} \mathbf{R} \mathbf{R}^T) = \text{tr}(\mathbf{I} \mathbf{I}_3) = \text{tr}(\mathbf{I})$$
3. Determinant product property:
   $$\det(\mathbf{I}') = \det(\mathbf{R}^T \mathbf{I} \mathbf{R}) = \det(\mathbf{R}^T)\det(\mathbf{I})\det(\mathbf{R})$$
   Since $\mathbf{R} \in SO(3)$, $\det(\mathbf{R}) = \det(\mathbf{R}^T) = +1$.
   $$\det(\mathbf{I}') = (1)\det(\mathbf{I})(1) = \det(\mathbf{I})$$
4. Both quantities are scalar invariants of the mass distribution.

---

### Exercise 5.8
**Problem:** In numerical engines, what numerical method is preferred for diagonalizing small $3 \times 3$ symmetric matrices?
**Solution:**
1. The **Jacobi Eigenvalue Algorithm** or **Cardano's Analytical Cubic Solver** coupled with Gram-Schmidt re-orthogonalization.
2. For $3 \times 3$ symmetric matrices, the Jacobi rotation method iteratively eliminates the largest off-diagonal element using $2 \times 2$ Givens rotations.
3. It converges quadratically, requires only a few trigonometric evaluations, and is unconditionally stable with zero risk of complex numbers or division by zero.

---

### Exercise 5.9
**Problem:** If two eigenvalues of an inertia tensor are equal ($I_1 = I_2$), what is the geometric shape of the Ellipsoid of Inertia?
**Solution:**
1. The equation in principal coordinates is $I_1 x_1^2 + I_1 x_2^2 + I_3 x_3^2 = 1 \iff I_1 (x_1^2 + x_2^2) + I_3 x_3^2 = 1$.
2. This is an **ellipsoid of revolution** (a spheroid) possessing continuous circular symmetry about the $x_3$ axis.
3. If $I_3 < I_1$, it is a prolate spheroid (cigar-shaped); if $I_3 > I_1$, it is an oblate spheroid (pancake-shaped).

---

### Exercise 5.10
**Problem:** Why is the inertia tensor of a 3D rigid body strictly non-singular (invertible) for any physical object with non-zero volume?
**Solution:**
1. For any vector $\mathbf{v} \ne \mathbf{0}$, $\mathbf{v}^T \mathbf{I} \mathbf{v} = \int \|\mathbf{r} \times \mathbf{v}\|^2 dm$.
2. The integrand $\|\mathbf{r} \times \mathbf{v}\|^2 = 0$ if and only if $\mathbf{r} \parallel \mathbf{v}$.
3. If the body has non-zero volume in 3D, all of its mass cannot lie along a single 1D line. There exist points with $\mathbf{r} \nparallel \mathbf{v}$.
4. Therefore, $\int \|\mathbf{r} \times \mathbf{v}\|^2 dm > 0$ for all $\mathbf{v} \ne \mathbf{0}$, meaning $\mathbf{I}$ is strictly positive-definite.
5. Strict positive-definiteness implies that all eigenvalues are strictly positive ($\lambda_k > 0$), so $\det(\mathbf{I}) = \lambda_1 \lambda_2 \lambda_3 > 0$.
6. A matrix with non-zero determinant is invertible: $\mathbf{I}^{-1}$ is mathematically guaranteed to exist.
