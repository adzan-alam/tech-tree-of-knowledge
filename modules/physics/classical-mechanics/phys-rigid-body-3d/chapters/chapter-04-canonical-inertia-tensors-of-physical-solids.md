# Chapter 4: Canonical Inertia Tensors of Physical Solids

> *"Geometry gives form to matter; mass gives gravity to space; but calculus weaves them together into the canonical inertia tensors that govern every spinning body from the smallest turbine blade to the grandest planet."*

---

## 4.1 The Analytical Calculus of Rigid Mass Distributions

In Chapter 2, we established the fundamental continuum definition of the Inertia Tensor:

$$\mathbf{I} = \iiint_V \begin{bmatrix}
y^2 + z^2 & -xy & -xz \\
-yx & x^2 + z^2 & -yz \\
-zx & -zy & x^2 + y^2
\end{bmatrix} \rho(x, y, z) \, dV$$

In real-world computer graphics, robotics, and aerospace simulation, almost all complex mechanical systems—from an autonomous quadrotor drone or an articulated humanoid robot to an interplanetary spacecraft—are constructed as assemblies of fundamental geometric primitives: **cuboids, spheres, cylinders, cones, capsules, and ellipsoids**.

Rather than performing costly numerical voxel integration at runtime, production physics engines rely on **exact closed-form analytical formulas** for the inertia tensors of these canonical solids. In this chapter, we derive each canonical tensor from first principles using multivariable calculus, and formulate the algebra of composite multi-body aggregation.

```
       Canonical Primitives of 3D Rigid Body Physics
       
          Box / Cuboid                  Solid Sphere                 Cylinder
            ┌───────┐                      .---.                      ┌───┐
           /       /│                    /       \                   /     \
          ┌───────┐ │                   |    ●    |                 |   ●   |
          │       │ │                    \       /                  |       |
          │       │/                      '---'                      \     /
          └───────┘                                                   └───┘
```

---

## 4.2 Analytical Derivations of Canonical Inertia Tensors

### 1. The Homogeneous Solid Cuboid (Rectangular Box)
Consider a solid rectangular box of uniform density $\rho_0$, total mass $M$, and side lengths $a, b, c$ along the $x, y, z$ axes respectively. The coordinate origin is placed at the Center of Mass, so the volume occupies the domain:

$$x \in [-a/2, a/2], \quad y \in [-b/2, b/2], \quad z \in [-c/2, c/2]$$

Total volume is $V = a b c$, and density is $\rho_0 = \frac{M}{a b c}$.

#### Derivation of Diagonal Moments:
Let us compute $I_{zz}$:

$$I_{zz} = \iiint_V (x^2 + y^2)\rho_0 \, dx \, dy \, dz = \rho_0 \int_{-c/2}^{c/2} dz \int_{-b/2}^{b/2} dy \int_{-a/2}^{a/2} (x^2 + y^2) dx$$

Split into two separable triple integrals:

$$I_{zz} = \rho_0 c \left[ b \int_{-a/2}^{a/2} x^2 dx + a \int_{-b/2}^{b/2} y^2 dy \right]$$

Evaluate the symmetric polynomial integrals:

$$\int_{-a/2}^{a/2} x^2 dx = \left[ \frac{x^3}{3} \right]_{-a/2}^{a/2} = \frac{a^3}{24} - \left(-\frac{a^3}{24}\right) = \frac{a^3}{12}$$
$$\int_{-b/2}^{b/2} y^2 dy = \frac{b^3}{12}$$

Substitute back:

$$I_{zz} = \rho_0 c \left[ b\left(\frac{a^3}{12}\right) + a\left(\frac{b^3}{12}\right) \right] = \frac{\rho_0 a b c}{12} (a^2 + b^2)$$

Since $M = \rho_0 a b c$:

$$I_{zz} = \frac{1}{12} M (a^2 + b^2)$$

By cyclic permutation of variables:

$$I_{xx} = \frac{1}{12} M (b^2 + c^2), \quad I_{yy} = \frac{1}{12} M (a^2 + c^2)$$

#### Off-Diagonal Products of Inertia:
$$I_{xy} = -\rho_0 \int_{-c/2}^{c/2} dz \int_{-b/2}^{b/2} y \, dy \int_{-a/2}^{a/2} x \, dx$$
Because the integrand $x$ is an odd function integrated over the symmetric interval $[-a/2, a/2]$, $\int_{-a/2}^{a/2} x \, dx = 0$.
Thus, all products of inertia vanish: $I_{xy} = I_{xz} = I_{yz} = 0$.

$$\mathbf{I}_{\text{box}} = \frac{1}{12}M \begin{bmatrix} b^2 + c^2 & 0 & 0 \\ 0 & a^2 + c^2 & 0 \\ 0 & 0 & a^2 + b^2 \end{bmatrix}$$

---

### 2. The Solid Homogeneous Sphere
Consider a solid sphere of uniform density $\rho_0$, total mass $M$, and radius $R$, centered at the origin:

$$x^2 + y^2 + z^2 \le R^2$$

Total volume is $V = \frac{4}{3}\pi R^3$, and density is $\rho_0 = \frac{3M}{4\pi R^3}$.

#### Derivation via Spherical Coordinates:
By complete spherical symmetry, the inertia about any axis passing through the center is identical:

$$I_{xx} = I_{yy} = I_{zz} = I$$

Taking the trace of the tensor:

$$\text{tr}(\mathbf{I}) = I_{xx} + I_{yy} + I_{zz} = 3I$$

From Exercise 2.1, the trace is:

$$\text{tr}(\mathbf{I}) = 2\iiint_V r^2 \rho_0 \, dV \implies 3I = 2\rho_0 \iiint_V r^2 \, dV$$

In spherical coordinates $(r, \theta, \phi)$, the volume element is $dV = r^2 \sin\theta \, dr \, d\theta \, d\phi$:

$$\iiint_V r^2 \, dV = \int_0^{2\pi} d\phi \int_0^\pi \sin\theta \, d\theta \int_0^R r^4 \, dr = (2\pi)(2)\left[ \frac{r^5}{5} \right]_0^R = \frac{4\pi R^5}{5}$$

Substitute into the trace equation:

$$3I = 2\rho_0 \left(\frac{4\pi R^5}{5}\right) = \frac{2}{5}\left(\frac{4}{3}\pi R^3 \rho_0\right)(3 R^2) = \frac{6}{5} M R^2$$

Divide by 3:

$$I = \frac{2}{5} M R^2$$

All off-diagonal products of inertia vanish by spherical symmetry. The canonical tensor is isotropic:

$$\mathbf{I}_{\text{sphere}} = \frac{2}{5} M R^2 \mathbf{I}_3 = \begin{bmatrix} \frac{2}{5}MR^2 & 0 & 0 \\ 0 & \frac{2}{5}MR^2 & 0 \\ 0 & 0 & \frac{2}{5}MR^2 \end{bmatrix}$$

---

### 3. The Thin Spherical Shell (Hollow Sphere)
Consider an infinitely thin spherical shell of mass $M$, radius $R$, and surface mass density $\sigma_0 = \frac{M}{4\pi R^2}$.
All mass is located at the exact same radial distance $r = R$ from the origin!

Using the trace theorem on the 2D surface:

$$\text{tr}(\mathbf{I}) = 3I = 2\iint_S R^2 \sigma_0 \, dA = 2 R^2 \iint_S dm = 2 M R^2$$

Dividing by 3:

$$I = \frac{2}{3} M R^2$$

$$\mathbf{I}_{\text{shell}} = \frac{2}{3} M R^2 \mathbf{I}_3 = \begin{bmatrix} \frac{2}{3}MR^2 & 0 & 0 \\ 0 & \frac{2}{3}MR^2 & 0 \\ 0 & 0 & \frac{2}{3}MR^2 \end{bmatrix}$$

Notice that the hollow shell has a **larger moment of inertia** than the solid sphere ($\frac{2}{3} \approx 0.667 > \frac{2}{5} = 0.400$) because all of its mass is pushed out to the maximum distance $R$.

---

### 4. The Solid Homogeneous Cylinder
Consider a solid cylinder of mass $M$, radius $R$, and height $H$, with its central symmetry axis aligned along the $z$-axis ($z \in [-H/2, H/2]$, $x^2 + y^2 \le R^2$).
Volume $V = \pi R^2 H$, density $\rho_0 = \frac{M}{\pi R^2 H}$.

#### Moment of Inertia About the Longitudinal Axis ($I_{zz}$):
In cylindrical coordinates $(r, \theta, z)$, $x^2 + y^2 = r^2$, and $dV = r \, dr \, d\theta \, dz$:

$$I_{zz} = \iiint_V r^2 \rho_0 \, dV = \rho_0 \int_{-H/2}^{H/2} dz \int_0^{2\pi} d\theta \int_0^R r^3 \, dr$$
$$I_{zz} = \rho_0 (H)(2\pi)\left[ \frac{R^4}{4} \right] = \frac{1}{2}(\pi R^2 H \rho_0) R^2 = \frac{1}{2} M R^2$$

#### Transverse Moments of Inertia ($I_{xx}$ and $I_{yy}$):
By rotational symmetry about the $z$-axis, $I_{xx} = I_{yy}$.
$$I_{xx} = \iiint_V (y^2 + z^2)\rho_0 \, dV = \iiint_V y^2 \rho_0 \, dV + \iiint_V z^2 \rho_0 \, dV$$

Since $x^2 + y^2 = r^2$ and by symmetry $\iint x^2 dA = \iint y^2 dA = \frac{1}{2}\iint r^2 dA$:
$$\iiint_V y^2 \rho_0 \, dV = \frac{1}{2}I_{zz} = \frac{1}{4} M R^2$$

For the $z^2$ integral:
$$\iiint_V z^2 \rho_0 \, dV = \rho_0 (\pi R^2) \int_{-H/2}^{H/2} z^2 dz = \rho_0 (\pi R^2) \left[ \frac{z^3}{3} \right]_{-H/2}^{H/2} = \rho_0 (\pi R^2) \left(\frac{H^3}{12}\right) = \frac{1}{12} M H^2$$

Summing both terms:

$$I_{xx} = I_{yy} = \frac{1}{4} M R^2 + \frac{1}{12} M H^2 = \frac{1}{12} M (3R^2 + H^2)$$

$$\mathbf{I}_{\text{cyl}} = \begin{bmatrix} \frac{1}{12}M(3R^2 + H^2) & 0 & 0 \\ 0 & \frac{1}{12}M(3R^2 + H^2) & 0 \\ 0 & 0 & \frac{1}{2}MR^2 \end{bmatrix}$$

---

### 5. The Solid Homogeneous Cone
Consider a right circular cone of base radius $R$, height $H$, and total mass $M$, aligned along the $z$-axis.
As derived in Chapter 1, its Center of Mass lies at distance $\frac{3}{4}H$ from the vertex (or $\frac{1}{4}H$ above the flat base).

About the Center of Mass:
- Longitudinal axis:
  $$I_{zz} = \frac{3}{10} M R^2$$
- Transverse axes:
  $$I_{xx} = I_{yy} = \frac{3}{20} M \left( R^2 + \frac{1}{4} H^2 \right) = \frac{3}{80} M (4R^2 + H^2)$$

$$\mathbf{I}_{\text{cone}} = \begin{bmatrix} \frac{3}{80}M(4R^2 + H^2) & 0 & 0 \\ 0 & \frac{3}{80}M(4R^2 + H^2) & 0 \\ 0 & 0 & \frac{3}{10}MR^2 \end{bmatrix}$$

---

### 6. The Solid Homogeneous Ellipsoid
Consider an ellipsoid with semi-axes $a, b, c$ along the $x, y, z$ axes:

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} \le 1$$

Volume $V = \frac{4}{3}\pi a b c$, mass $M = \rho_0 V$.
By scaling the sphere coordinates $(u = x/a, v = y/b, w = z/c)$:

$$I_{xx} = \frac{1}{5} M (b^2 + c^2), \quad I_{yy} = \frac{1}{5} M (a^2 + c^2), \quad I_{zz} = \frac{1}{5} M (a^2 + b^2)$$

Notice that when $a = b = c = R$, this simplifies identically to $\frac{1}{5}M(R^2 + R^2) = \frac{2}{5}MR^2$ (the sphere).

---

## 4.3 Polyhedral Mesh Inertia Integration: The Mirtich-Eberly Algorithm

In modern video games and visual simulations, 3D assets are rarely pure geometric primitives; they are arbitrary **polygonal triangle meshes** composed of thousands of vertices and triangular faces.

How can a physics engine compute the exact mass, Center of Mass, and $3 \times 3$ Inertia Tensor of an arbitrary closed triangle mesh with constant density $\rho_0$?

In 1996, Brian Mirtich published a foundational algorithm using the **Divergence Theorem** to reduce the 3D volume integrals over the polyhedron into 2D surface integrals over triangular faces, and ultimately into 1D line integrals along triangle edges!

```
                    Mirtich Divergence Theorem Reduction
                    
               3D Volume Integral:  ∭_V (x² + y²) dV
                                       │
                                       ▼  Divergence Theorem: ∭ (∇·F) dV = ∬ (F·n) dA
               2D Surface Integral: ∬_∂V F_face · n_face dA
                                       │
                                       ▼  Green's Theorem in Plane
               1D Edge Evaluation:  ∑_edges (Polynomial Edge Line Integrals)
```

### The Exact Analytical Integrals
By choosing vector fields $\mathbf{F}$ whose divergence equals the integrand:
- For Volume: $\nabla \cdot \mathbf{r} = 3 \implies V = \frac{1}{3}\sum_{\text{faces}} (\mathbf{p} \cdot \hat{\mathbf{n}}) \text{Area}(\text{face})$.
- For Center of Mass: $\nabla \cdot (x^2 \hat{\mathbf{i}}) = 2x$.
- For Moments of Inertia: $\nabla \cdot (x^3 \hat{\mathbf{i}}) = 3x^2$, $\nabla \cdot (x^2 y \hat{\mathbf{j}}) = x^2$.

This allows a physics engine to load a 100,000-triangle mesh and compute its mathematically exact mass, Center of Mass, and $3 \times 3$ Inertia Tensor in **less than 2 milliseconds** at scene load time!

---

## 4.4 Additive Superposition of Composite Bodies

When constructing an articulated robot, a spacecraft with deployable solar panels, or a compound hammer, the total rigid body is formed by rigidly attaching $K$ distinct primitive bodies together.

### The 4-Step Composite Aggregation Algorithm:
1. **Define Primitives:** For each sub-component $k \in \{1, \dots, K\}$, obtain its mass $m_k$, its local Center of Mass $\mathbf{r}_k$, and its local inertia tensor $\mathbf{I}_k^{(\text{local})}$.
2. **Compute Global Center of Mass:**
   $$M_{\text{total}} = \sum_{k=1}^K m_k$$
   $$\mathbf{R}_{\text{cm}} = \frac{1}{M_{\text{total}}}\sum_{k=1}^K m_k \mathbf{r}_k$$
3. **Compute Displacement Vectors to Global COM:**
   $$\mathbf{d}_k = \mathbf{r}_k - \mathbf{R}_{\text{cm}}$$
4. **Sum Shifted Inertia Tensors via Steiner's Theorem:**
   $$\mathbf{I}_{\text{composite}} = \sum_{k=1}^K \Big( \mathbf{I}_k^{(\text{local})} + m_k [\|\mathbf{d}_k\|^2 \mathbf{I}_3 - \mathbf{d}_k \otimes \mathbf{d}_k] \Big)$$

---

## 4.5 10 Step-by-Step Worked Examples

### Worked Example 4.1: Inertia Tensor of a Solid Cube
**Problem:** A solid homogeneous cube of mass $M = 6\text{ kg}$ has side length $s = 2\text{ m}$. Calculate its Center-of-Mass Inertia Tensor.
**Solution:**
1. Using the cuboid formula with $a = b = c = s = 2\text{ m}$:
   $$I_{xx} = \frac{1}{12}M(s^2 + s^2) = \frac{1}{12}M(2s^2) = \frac{1}{6}M s^2$$
   $$I_{yy} = I_{zz} = \frac{1}{6}M s^2$$
2. Numerical value:
   $$I = \frac{1}{6}(6)(2^2) = 4.0\text{ kg}\cdot\text{m}^2$$
3. Matrix:
   $$\mathbf{I}_{\text{cube}} = \begin{bmatrix} 4 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 4 \end{bmatrix} = 4 \mathbf{I}_3\text{ kg}\cdot\text{m}^2$$
4. A cube has identical moments of inertia about all three axes: it is dynamically a **spherical top**!

---

### Worked Example 4.2: Inertia Tensor of a Flat Square Sheet
**Problem:** A flat square sheet of mass $M = 12\text{ kg}$ and side length $L = 2\text{ m}$ lies in the $xy$-plane ($c \to 0$). Calculate its Inertia Tensor.
**Solution:**
1. Using $a = L, b = L, c = 0$:
   $$I_{xx} = \frac{1}{12}M(L^2 + 0) = \frac{1}{12}ML^2$$
   $$I_{yy} = \frac{1}{12}M(L^2 + 0) = \frac{1}{12}ML^2$$
   $$I_{zz} = \frac{1}{12}M(L^2 + L^2) = \frac{1}{6}ML^2$$
2. Check Perpendicular Axis Theorem:
   $$I_{xx} + I_{yy} = \frac{1}{12}ML^2 + \frac{1}{12}ML^2 = \frac{1}{6}ML^2 = I_{zz}$$
3. Numerical values with $M = 12, L = 2$:
   $$I_{xx} = \frac{1}{12}(12)(4) = 4\text{ kg}\cdot\text{m}^2$$
   $$I_{yy} = 4\text{ kg}\cdot\text{m}^2$$
   $$I_{zz} = 8\text{ kg}\cdot\text{m}^2$$
4. Matrix:
   $$\mathbf{I} = \text{diag}(4, 4, 8)\text{ kg}\cdot\text{m}^2$$.

---

### Worked Example 4.3: Solid Sphere vs Hollow Shell Comparison
**Problem:** A solid bowling ball and a hollow metal shell have identical mass $M = 5\text{ kg}$ and identical radius $R = 0.15\text{ m}$.
1. Compute the moments of inertia for both bodies.
2. If both roll down a $30^\circ$ incline from rest, which one reaches the bottom first?
**Solution:**
1. **Moments of Inertia:**
   - Solid Sphere:
     $$I_{\text{solid}} = \frac{2}{5}MR^2 = 0.4(5)(0.15^2) = 2(0.0225) = 0.045\text{ kg}\cdot\text{m}^2$$
   - Hollow Shell:
     $$I_{\text{hollow}} = \frac{2}{3}MR^2 = \frac{2}{3}(5)(0.0225) = 0.075\text{ kg}\cdot\text{m}^2$$
2. **Rolling Acceleration Down Incline:**
   For any round object rolling without slipping:
   $$a = \frac{g\sin\theta}{1 + \frac{I_{\text{cm}}}{MR^2}}$$
   - Solid Sphere ($\frac{I}{MR^2} = \frac{2}{5} = 0.4$):
     $$a_{\text{solid}} = \frac{g\sin 30^\circ}{1 + 0.4} = \frac{0.5 g}{1.4} \approx 0.357 g$$
   - Hollow Shell ($\frac{I}{MR^2} = \frac{2}{3} \approx 0.667$):
     $$a_{\text{hollow}} = \frac{g\sin 30^\circ}{1 + 0.667} = \frac{0.5 g}{1.667} \approx 0.300 g$$
3. Result: The solid sphere accelerates significantly faster ($0.357 g$ vs $0.300 g$) and **wins the race** because it stores less kinetic energy in rotation and more in linear translation!

---

### Worked Example 4.4: Inertia Tensor of a Commercial Quadcopter Arm
**Problem:** An autonomous quadcopter consists of a central body box ($M_1 = 1.0\text{ kg}$, $a = 0.2\text{ m}, b = 0.2\text{ m}, c = 0.1\text{ m}$) centered at $(0, 0, 0)$, and four motor pods ($m = 0.25\text{ kg}$ each, treated as point masses) located at $(+0.3, +0.3, 0)$, $(-0.3, +0.3, 0)$, $(-0.3, -0.3, 0)$, and $(+0.3, -0.3, 0)\text{ m}$. Compute the total $I_{zz}$ of the quadcopter.
**Solution:**
1. **Central Box Inertia about $z$:**
   $$I_{zz,1} = \frac{1}{12}M_1(a^2 + b^2) = \frac{1}{12}(1.0)(0.04 + 0.04) = \frac{1}{12}(0.08) \approx 0.00667\text{ kg}\cdot\text{m}^2$$
2. **Motor Pods:**
   Distance from $z$-axis for each motor:
   $$d^2 = x^2 + y^2 = 0.3^2 + 0.3^2 = 0.09 + 0.09 = 0.18\text{ m}^2$$
   Inertia of one motor pod:
   $$I_{zz,\text{motor}} = m d^2 = (0.25\text{ kg})(0.18\text{ m}^2) = 0.045\text{ kg}\cdot\text{m}^2$$
3. **Four Motors:**
   $$I_{zz,4\text{motors}} = 4 \times 0.045 = 0.180\text{ kg}\cdot\text{m}^2$$
4. **Total Inertia:**
   $$I_{zz,\text{total}} = I_{zz,1} + I_{zz,4\text{motors}} = 0.00667 + 0.180 = 0.18667\text{ kg}\cdot\text{m}^2$$
5. Notice that the four small motor pods contribute **over $96\%$** of the yaw inertia, proving that peripheral masses dominate rotational dynamics.

---

### Worked Example 4.5: Solid Cylinder Aspect Ratio for Spherical Top Behavior
**Problem:** At what height-to-radius ratio $H/R$ does a solid homogeneous cylinder become a **spherical top** ($I_{xx} = I_{yy} = I_{zz}$)?
**Solution:**
1. For a solid cylinder:
   $$I_{zz} = \frac{1}{2} M R^2$$
   $$I_{xx} = I_{yy} = \frac{1}{12} M (3R^2 + H^2)$$
2. Set $I_{xx} = I_{zz}$:
   $$\frac{1}{12} M (3R^2 + H^2) = \frac{1}{2} M R^2$$
3. Divide by $M$:
   $$\frac{3R^2 + H^2}{12} = \frac{R^2}{2} \implies 3R^2 + H^2 = 6R^2 \implies H^2 = 3R^2$$
4. Take the square root:
   $$H = \sqrt{3} R \approx 1.732 R$$
5. Result: When a cylinder's height is exactly $\sqrt{3}$ times its radius, its moments of inertia in all directions are identical ($\mathbf{I} = \frac{1}{2}MR^2 \mathbf{I}_3$). It resists rotation equally in all spatial directions.

---

### Worked Example 4.6: Inertia of an Oblate Planetary Spheroid
**Problem:** Earth is an oblate ellipsoid with equatorial radius $a = b = 6378\text{ km}$, polar radius $c = 6357\text{ km}$, and mass $M = 5.972 \times 10^{24}\text{ kg}$. Assuming uniform density for comparison, calculate the difference between its polar and equatorial moments of inertia.
**Solution:**
1. For an ellipsoid:
   $$I_{\text{polar}} = I_{zz} = \frac{1}{5}M(a^2 + b^2) = \frac{2}{5}M a^2$$
   $$I_{\text{equatorial}} = I_{xx} = \frac{1}{5}M(b^2 + c^2) = \frac{1}{5}M(a^2 + c^2)$$
2. Difference $\Delta I = I_{\text{polar}} - I_{\text{equatorial}}$:
   $$\Delta I = \frac{1}{5}M(2a^2 - a^2 - c^2) = \frac{1}{5}M(a^2 - c^2)$$
3. Compute $a^2 - c^2$:
   $$a = 6.378 \times 10^6\text{ m} \implies a^2 \approx 4.06789 \times 10^{13}$$
   $$c = 6.357 \times 10^6\text{ m} \implies c^2 \approx 4.04114 \times 10^{13}$$
   $$a^2 - c^2 \approx 2.675 \times 10^{11}\text{ m}^2$$
4. Compute $\Delta I$:
   $$\Delta I = \frac{1}{5}(5.972 \times 10^{24})(2.675 \times 10^{11}) \approx 3.195 \times 10^{35}\text{ kg}\cdot\text{m}^2$$
5. This positive difference ($I_{zz} > I_{xx}$) causes Earth to act as an oblate rotator, giving rise to astronomical equinoctial precession under lunar/solar gravitational torques.

---

### Worked Example 4.7: Inertia of a Composite Capsule (Cylinder + Two Hemispheres)
**Problem:** A pill-shaped capsule consists of a central solid cylinder of mass $M_{\text{cyl}} = 4\text{ kg}$, radius $R = 0.5\text{ m}$, and height $H = 2.0\text{ m}$, capped at both ends by two solid hemispheres of mass $M_{\text{hemi}} = 1\text{ kg}$ each. Calculate the total moment of inertia about the longitudinal $z$-axis.
**Solution:**
1. **Central Cylinder about $z$:**
   $$I_{zz,\text{cyl}} = \frac{1}{2} M_{\text{cyl}} R^2 = \frac{1}{2}(4)(0.5^2) = 2(0.25) = 0.50\text{ kg}\cdot\text{m}^2$$
2. **Two Hemispheres about $z$:**
   Together, the two hemispheres form a single solid sphere of mass $M_{\text{sph}} = 1 + 1 = 2\text{ kg}$ and radius $R = 0.5\text{ m}$.
   Their rotational axis is the exact same polar symmetry axis as the cylinder!
   $$I_{zz,\text{hemis}} = \frac{2}{5} M_{\text{sph}} R^2 = \frac{2}{5}(2)(0.5^2) = \frac{4}{5}(0.25) = 0.20\text{ kg}\cdot\text{m}^2$$
3. **Total Longitudinal Inertia:**
   $$I_{zz,\text{total}} = I_{zz,\text{cyl}} + I_{zz,\text{hemis}} = 0.50 + 0.20 = 0.70\text{ kg}\cdot\text{m}^2$$

---

### Worked Example 4.8: Inertia of a Torus (Donut)
**Problem:** A solid torus is formed by revolving a circle of radius $r = 0.2\text{ m}$ around an axis at distance $R = 1.0\text{ m}$. The mass is $M = 10\text{ kg}$. Find its moment of inertia about the revolution symmetry axis ($z$).
**Solution:**
1. Analytical formula for a solid torus about its central axis:
   $$I_{zz} = M \left( R^2 + \frac{3}{4}r^2 \right)$$
2. Numerical values:
   $$R^2 = 1.0^2 = 1.0\text{ m}^2$$
   $$r^2 = 0.2^2 = 0.04\text{ m}^2 \implies \frac{3}{4}(0.04) = 0.03\text{ m}^2$$
   $$R^2 + \frac{3}{4}r^2 = 1.03\text{ m}^2$$
3. Multiply by mass:
   $$I_{zz} = (10\text{ kg})(1.03\text{ m}^2) = 10.3\text{ kg}\cdot\text{m}^2$$

---

### Worked Example 4.9: Composite Sledgehammer Assembly
**Problem:** A sledgehammer consists of:
- A steel head (modeled as a cuboid of mass $m_1 = 8\text{ kg}$, $a = 0.1\text{ m}, b = 0.1\text{ m}, c = 0.2\text{ m}$) centered at $(0, 0, 1.0)\text{ m}$.
- A wooden handle (modeled as a thin rod of mass $m_2 = 2\text{ kg}$, length $L = 1.0\text{ m}$) extending along the $z$-axis from $z = 0$ to $z = 1.0\text{ m}$.
1. Find the Center of Mass of the sledgehammer.
2. Find the moment of inertia about an axis through the base of the handle ($z = 0$) perpendicular to the handle ($x$-axis).
**Solution:**
1. **Center of Mass:**
   Head COM at $z_1 = 1.0\text{ m}$.
   Handle COM at $z_2 = 0.5\text{ m}$.
   Total mass $M = 8 + 2 = 10\text{ kg}$.
   $$Z_{\text{cm}} = \frac{m_1 z_1 + m_2 z_2}{M} = \frac{8(1.0) + 2(0.5)}{10} = \frac{8 + 1}{10} = 0.90\text{ m}$$
2. **Inertia of Handle about Base ($z = 0$):**
   $$I_{\text{handle},x} = \frac{1}{3}m_2 L^2 = \frac{1}{3}(2)(1.0^2) = \frac{2}{3} \approx 0.667\text{ kg}\cdot\text{m}^2$$
3. **Inertia of Head about Base ($z = 0$):**
   Head Center-of-Mass inertia:
   $$I_{\text{head,cm}} = \frac{1}{12}m_1(b^2 + c^2) = \frac{1}{12}(8)(0.1^2 + 0.2^2) = \frac{8}{12}(0.01 + 0.04) = \frac{2}{3}(0.05) \approx 0.0333\text{ kg}\cdot\text{m}^2$$
   Shift to base ($d = 1.0\text{ m}$):
   $$I_{\text{head,base}} = I_{\text{head,cm}} + m_1 d^2 = 0.0333 + 8(1.0)^2 = 8.0333\text{ kg}\cdot\text{m}^2$$
4. **Total Inertia about Base:**
   $$I_{\text{total}} = 0.667 + 8.0333 = 8.700\text{ kg}\cdot\text{m}^2$$

---

### Worked Example 4.10: Scaling Law of Inertia Tensors
**Problem:** If a 3D geometric solid of mass $M$ and characteristic length $L$ is scaled uniformly in geometry by factor $s$ (so length becomes $s L$) while maintaining the same material density $\rho_0$:
1. How does its mass scale?
2. How does its moment of inertia scale?
**Solution:**
1. **Mass Scaling:**
   Volume scales as the cube of linear dimension: $V(s) = s^3 V_0$.
   Since density $\rho_0$ is constant:
   $$M(s) = \rho_0 V(s) = s^3 M_0$$
   Mass scales as **$s^3$**.
2. **Inertia Scaling:**
   Inertia is proportional to mass times length squared:
   $$I \propto M L^2$$
   Substitute scaled mass and length:
   $$I(s) \propto (s^3 M_0)(s L_0)^2 = s^5 (M_0 L_0^2)$$
   Moment of inertia scales as the **fifth power of length ($s^5$)**!
3. Physical Consequence: Doubling the size of an animal or robot ($s = 2$) multiplies its mass by $2^3 = 8$, but multiplies its rotational inertia by $2^5 = 32$! This is why giant creatures and heavy construction cranes turn sluggishly.

---

## 4.6 10 Granular Solved Exercises

### Exercise 4.1
**Problem:** Derive the moment of inertia of a solid homogeneous sphere about its diameter using the slicing method (integrating circular discs).
**Solution:**
1. Slice the sphere of radius $R$ into circular discs of thickness $dz$ perpendicular to the $z$-axis at height $z \in [-R, R]$.
2. The radius of a disc at height $z$ is $r(z) = \sqrt{R^2 - z^2}$.
3. Mass of thin disc: $dm = \rho_0 \pi r(z)^2 dz = \rho_0 \pi (R^2 - z^2) dz$.
4. The moment of inertia of a thin circular disc of mass $dm$ and radius $r(z)$ about its central axis is $dI_{zz} = \frac{1}{2} dm \, r(z)^2$.
5. Integrate:
   $$I_{zz} = \frac{1}{2}\rho_0 \pi \int_{-R}^R (R^2 - z^2)^2 dz = \rho_0 \pi \int_0^R (R^4 - 2R^2 z^2 + z^4) dz$$
   $$= \rho_0 \pi \left[ R^4 z - \frac{2}{3}R^2 z^3 + \frac{z^5}{5} \right]_0^R = \rho_0 \pi R^5 \left( 1 - \frac{2}{3} + \frac{1}{5} \right) = \rho_0 \pi R^5 \left(\frac{8}{15}\right)$$
6. Substitute $\rho_0 = \frac{M}{\frac{4}{3}\pi R^3}$:
   $$I_{zz} = \left(\frac{3M}{4\pi R^3}\right) \pi R^5 \left(\frac{8}{15}\right) = M R^2 \left( \frac{3 \times 8}{4 \times 15} \right) = M R^2 \left(\frac{24}{60}\right) = \frac{2}{5}MR^2$$.

---

### Exercise 4.2
**Problem:** A hollow cylindrical pipe of mass $M$ has inner radius $R_1$, outer radius $R_2$, and height $H$. Find its moment of inertia about the central longitudinal axis.
**Solution:**
1. The mass element of a thin cylindrical shell at radius $r$ is $dm = \rho_0 (2\pi r H dr)$.
2. $I_{zz} = \int_{R_1}^{R_2} r^2 dm = 2\pi \rho_0 H \int_{R_1}^{R_2} r^3 dr = 2\pi \rho_0 H \left[ \frac{r^4}{4} \right]_{R_1}^{R_2} = \frac{1}{2}\pi \rho_0 H (R_2^4 - R_1^4)$.
3. Total volume is $V = \pi(R_2^2 - R_1^2)H$, so $M = \rho_0 \pi(R_2^2 - R_1^2)H$.
4. Factor $(R_2^4 - R_1^4) = (R_2^2 - R_1^2)(R_2^2 + R_1^2)$:
   $$I_{zz} = \frac{1}{2} \Big( \pi \rho_0 H (R_2^2 - R_1^2) \Big) (R_2^2 + R_1^2) = \frac{1}{2}M(R_1^2 + R_2^2)$$.

---

### Exercise 4.3
**Problem:** In a physics engine, if an object is an equilateral triangular prism of mass $M$, side length $s$, and height $h$, what is its $I_{zz}$ about the prism's longitudinal centroidal axis?
**Solution:**
1. For an equilateral triangle of side $s$ in the plane, its moment of inertia about its centroid is $I_{zz} = \frac{1}{24}M s^2$.
2. Because the prism has uniform cross-section along the $z$-axis, integrating along $h$ does not change the radial distance $x^2 + y^2$.
3. Thus, $I_{zz} = \frac{1}{24}M s^2$.

---

### Exercise 4.4
**Problem:** Show that for a thin spherical shell, $I_{xx} = I_{yy} = I_{zz} = \frac{2}{3}MR^2$ directly from the Perpendicular Axis Theorem applied to infinitesimal rings.
**Solution:**
1. The shell can be partitioned into thin rings of radius $R\sin\theta$ and mass $dm$.
2. For each ring, $dI_{zz} = dm (R\sin\theta)^2$.
3. Summing over the sphere: $I_{zz} = \int R^2 \sin^2\theta \, dm$.
4. Since by spherical symmetry $\int x^2 dm = \int y^2 dm = \int z^2 dm$, and $x^2 + y^2 + z^2 = R^2$:
   $$3\int x^2 dm = R^2 \int dm = M R^2 \implies \int x^2 dm = \frac{1}{3}MR^2$$
5. Then $I_{zz} = \int (x^2 + y^2) dm = \frac{1}{3}MR^2 + \frac{1}{3}MR^2 = \frac{2}{3}MR^2$.

---

### Exercise 4.5
**Problem:** A solid homogeneous cone has base radius $R = 1.0\text{ m}$, height $H = 2.0\text{ m}$, and mass $M = 30\text{ kg}$. Calculate its longitudinal moment of inertia $I_{zz}$.
**Solution:**
1. Formula: $I_{zz} = \frac{3}{10}MR^2$.
2. Numerical calculation:
   $$I_{zz} = \frac{3}{10}(30)(1.0)^2 = 3(3) = 9.0\text{ kg}\cdot\text{m}^2$$.

---

### Exercise 4.6
**Problem:** A hollow thin-walled box of mass $M$ has dimensions $a, b, c$ with open interior (made of 6 thin plates). How does its inertia tensor compare with a solid box of the same mass and dimensions?
**Solution:**
1. In a hollow box, mass is concentrated entirely on the 6 outer boundary plates at maximum distance from the center.
2. In a solid box, mass is distributed uniformly throughout the interior, with significant mass near the Center of Mass.
3. Therefore, for identical total mass $M$ and dimensions, every diagonal moment of inertia of the hollow box is strictly **greater** than that of the solid box ($I_{\text{hollow}} > I_{\text{solid}}$).

---

### Exercise 4.7
**Problem:** Find the moment of inertia of a solid cylinder of mass $M$, radius $R$, and height $H$ about a diameter passing through its Center of Mass.
**Solution:**
1. A diameter through the Center of Mass is the transverse $x$ or $y$ axis.
2. From Section 4.2:
   $$I_{\text{diameter}} = \frac{1}{12}M(3R^2 + H^2)$$.

---

### Exercise 4.8
**Problem:** What happens to the inertia tensor of an ellipsoid $\mathbf{I} = \frac{1}{5}M\text{diag}(b^2 + c^2, a^2 + c^2, a^2 + b^2)$ as one axis shrinks to zero ($c \to 0$)?
**Solution:**
1. When $c \to 0$, the solid ellipsoid flattens into a 2D solid elliptical plate in the $xy$-plane.
2. The moments become:
   $$I_{xx} = \frac{1}{5}M b^2, \quad I_{yy} = \frac{1}{5}M a^2, \quad I_{zz} = \frac{1}{5}M(a^2 + b^2)$$
3. Notice that $I_{xx} + I_{yy} = \frac{1}{5}M b^2 + \frac{1}{5}M a^2 = I_{zz}$, satisfying the Perpendicular Axis Theorem identically.

---

### Exercise 4.9
**Problem:** In the Mirtich algorithm, why does computing moments of inertia from a closed triangle mesh require that the mesh be watertight (manifold with no holes or self-intersections)?
**Solution:**
1. The Mirtich algorithm relies on Gauss's Divergence Theorem:
   $$\iiint_V (\nabla \cdot \mathbf{F}) dV = \iint_{\partial V} (\mathbf{F} \cdot \hat{\mathbf{n}}) dA$$
2. The Divergence Theorem requires that the boundary surface $\partial V$ form a strictly closed, orientable 2-manifold with a well-defined interior volume $V$.
3. If the mesh has missing faces (holes) or inverted normals, the surface integral fails to enclose a closed volume, causing the computed volume, mass, and inertia to evaluate to negative, non-physical, or degenerate values.

---

### Exercise 4.10
**Problem:** A hollow box of mass $M$ has sides $a, b, c$. Express its $I_{zz}$ in terms of the plate masses.
**Solution:**
1. The 6 plates consist of:
   - 2 plates parallel to $xy$ at $z = \pm c/2$, each of area $a b$.
   - 2 plates parallel to $xz$ at $y = \pm b/2$, each of area $a c$.
   - 2 plates parallel to $yz$ at $x = \pm a/2$, each of area $b c$.
2. For the two $xy$ plates at $z = \pm c/2$: $I_{zz} = 2 \times \frac{1}{12}m_{xy}(a^2 + b^2) = \frac{1}{6}m_{xy}(a^2 + b^2)$.
3. For the two $xz$ plates at $y = \pm b/2$: $I_{zz} = 2 \times [\frac{1}{12}m_{xz} a^2 + m_{xz}(b/2)^2] = m_{xz}(\frac{a^2}{6} + \frac{b^2}{2})$.
4. For the two $yz$ plates at $x = \pm a/2$: $I_{zz} = 2 \times [\frac{1}{12}m_{yz} b^2 + m_{yz}(a/2)^2] = m_{yz}(\frac{b^2}{6} + \frac{a^2}{2})$.
5. Summing these contributions gives the exact $I_{zz}$ for the hollow box.
