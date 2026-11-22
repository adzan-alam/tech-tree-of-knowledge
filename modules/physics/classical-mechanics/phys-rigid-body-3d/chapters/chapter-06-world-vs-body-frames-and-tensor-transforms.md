# Chapter 6: Spatial Transformations: World vs. Body Frames of Inertia

> *"In the co-moving frame of the rigid body, the inertia tensor is eternal and motionless—a constant diagonal triad frozen into the material itself. But to an observer standing in the laboratory, space is in continuous flux: as the body tumbles, its inertia tensor dances, twisting through a similarity transformation at every infinitesimal tick of time."*

---

## 6.1 Two Worlds: The Co-Moving Frame vs. The Inertial Frame

In three-dimensional rigid body simulation, a fundamental duality exists between two distinct coordinate systems:

1. **The Inertial World Frame ($\mathcal{W}$):**
   - Fixed in physical space (the laboratory, the ground plane, or the celestial reference frame).
   - Coordinates are denoted $\mathbf{r}_{\text{world}} = (X, Y, Z)$.
   - Newton's Laws and conservation laws hold strictly in this frame without fictitious centrifugal or Coriolis forces.
   - Positions, linear velocities, forces, and collision contact normals are naturally measured here.
2. **The Body-Fixed Principal Frame ($\mathcal{B}$):**
   - Attached directly to the rigid body, with its origin at the Center of Mass, rotating and translating with the body.
   - Its coordinate axes are chosen to align with the body's **Principal Axes of Inertia** ($\hat{\mathbf{e}}_1, \hat{\mathbf{e}}_2, \hat{\mathbf{e}}_3$).
   - Coordinates are denoted $\mathbf{r}_{\text{body}} = (x_1, x_2, x_3)$.
   - In this frame, the mass distribution is completely static. The Inertia Tensor is a **constant diagonal matrix**:
     $$\mathbf{I}_{\text{body}} = \begin{bmatrix} I_1 & 0 & 0 \\ 0 & I_2 & 0 \\ 0 & 0 & I_3 \end{bmatrix}$$

```
        World Frame W (Inertial)                     Body Frame B (Co-moving)
                 Z                                                e₃ (Principal Axis 3)
                 │                                                │
                 │                                                │
                 │                                                │
                 └──────────── X               COM ●────────────── e₁ (Principal Axis 1)
                /                                 /
               Y                                 e₂ (Principal Axis 2)
```

The bridge connecting these two worlds is the **Orientation Matrix** $\mathbf{R}(t) \in SO(3)$ (or its equivalent attitude quaternion $q(t) \in \mathbb{S}^3$), which rotates a local vector in the body frame into the inertial world frame:

$$\mathbf{v}_{\text{world}}(t) = \mathbf{R}(t) \mathbf{v}_{\text{body}}$$

Because $\mathbf{R}(t) \in SO(3)$ is an orthogonal matrix ($\mathbf{R}^{-1} = \mathbf{R}^T$ and $\det(\mathbf{R}) = +1$), the reverse transformation from world to body coordinates is simply the transpose:

$$\mathbf{v}_{\text{body}} = \mathbf{R}^T(t) \mathbf{v}_{\text{world}}$$

---

## 6.2 Deriving the Tensor Similarity Transformation

How does the Inertia Tensor transform between the Body Frame and the World Frame?

Let us write down the fundamental angular momentum relation in the Body Frame:

$$\mathbf{L}_{\text{body}} = \mathbf{I}_{\text{body}} \boldsymbol{\omega}_{\text{body}}$$

Now, transform both vectors into the Inertial World Frame using our coordinate rotation rules:
1. World angular momentum is: $\mathbf{L}_{\text{world}} = \mathbf{R} \mathbf{L}_{\text{body}} \iff \mathbf{L}_{\text{body}} = \mathbf{R}^T \mathbf{L}_{\text{world}}$.
2. Body angular velocity is: $\boldsymbol{\omega}_{\text{body}} = \mathbf{R}^T \boldsymbol{\omega}_{\text{world}}$.

Substitute both expressions directly into the body-frame equation:

$$\mathbf{R}^T \mathbf{L}_{\text{world}} = \mathbf{I}_{\text{body}} \Big( \mathbf{R}^T \boldsymbol{\omega}_{\text{world}} \Big)$$

To solve for $\mathbf{L}_{\text{world}}$, multiply both sides on the left by $\mathbf{R}$:

$$\mathbf{R} \Big( \mathbf{R}^T \mathbf{L}_{\text{world}} \Big) = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T \boldsymbol{\omega}_{\text{world}}$$

Since $\mathbf{R} \mathbf{R}^T = \mathbf{I}_3$:

$$\mathbf{L}_{\text{world}} = \Big( \mathbf{R} \, \mathbf{I}_{\text{body}} \, \mathbf{R}^T \Big) \boldsymbol{\omega}_{\text{world}}$$

In the World Frame, the relationship between angular momentum and angular velocity must take the form $\mathbf{L}_{\text{world}} = \mathbf{I}_{\text{world}} \boldsymbol{\omega}_{\text{world}}$. Comparing terms, we discover the **Fundamental Tensor Similarity Transformation**:

$$\mathbf{I}_{\text{world}}(t) = \mathbf{R}(t) \, \mathbf{I}_{\text{body}} \, \mathbf{R}(t)^T$$

### Geometric Interpretation:
As a rigid body tumbles through space, its Inertia Tensor in world coordinates $\mathbf{I}_{\text{world}}(t)$ changes continuously at every instant! 
- Even though the body has zero off-diagonal products of inertia in its local frame ($I_{xy}^{(\text{body})} = 0$), in the world frame the rotated matrix $\mathbf{R}\mathbf{I}_{\text{body}}\mathbf{R}^T$ develops **dynamic, time-varying off-diagonal products of inertia**.
- However, because similarity transformations preserve eigenvalues, the principal moments of inertia ($I_1, I_2, I_3$) and the trace $\text{tr}(\mathbf{I}_{\text{world}}) = I_1 + I_2 + I_3$ remain **strictly invariant** throughout the motion.

---

## 6.3 The Inverse World Inertia Tensor

In real-time 3D physics engines (such as PhysX, Havok, Bullet, and our sovereign engine), the simulation state updates linear momentum $\mathbf{P}$ and angular momentum $\mathbf{L}$ via applied forces and torques:

$$\Delta \mathbf{P} = \mathbf{F}_{\text{net}} \Delta t, \quad \Delta \mathbf{L} = \boldsymbol{\tau}_{\text{net}} \Delta t$$

To advance the body's spatial orientation, the engine must extract the instantaneous angular velocity $\boldsymbol{\omega}$:

$$\boldsymbol{\omega}_{\text{world}}(t) = \mathbf{I}_{\text{world}}^{-1}(t) \mathbf{L}_{\text{world}}(t)$$

Therefore, the physics engine does not need $\mathbf{I}_{\text{world}}(t)$; it needs the **Inverse World Inertia Tensor** $\mathbf{I}_{\text{world}}^{-1}(t)$!

### Deriving the Inverse Tensor Transformation:
Let us compute the matrix inverse of $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$:

$$\mathbf{I}_{\text{world}}^{-1} = \Big( \mathbf{R} \, \mathbf{I}_{\text{body}} \, \mathbf{R}^T \Big)^{-1}$$

Using the matrix reversal rule for inverses $(A B C)^{-1} = C^{-1} B^{-1} A^{-1}$:

$$\mathbf{I}_{\text{world}}^{-1} = (\mathbf{R}^T)^{-1} \, \mathbf{I}_{\text{body}}^{-1} \, \mathbf{R}^{-1}$$

Since $\mathbf{R} \in SO(3)$, $\mathbf{R}^{-1} = \mathbf{R}^T$, and $(\mathbf{R}^T)^{-1} = (\mathbf{R}^T)^T = \mathbf{R}$. Substituting:

$$\mathbf{I}_{\text{world}}^{-1}(t) = \mathbf{R}(t) \, \mathbf{I}_{\text{body}}^{-1} \, \mathbf{R}(t)^T$$

Notice the stunning architectural symmetry: **The inverse world inertia tensor is simply the rotated inverse body inertia tensor!**

---

## 6.4 The Production Physics Engine Architecture Invariant

In high-performance physics engines running at $60\text{ Hz}$ to $240\text{ Hz}$ with $100,000+$ active rigid bodies, computing the general inverse of a fully populated $3 \times 3$ matrix ($1/\det(\mathbf{I})$ plus 9 cofactors) for every body on every frame is a computational disaster.

### The Zero-Inversion Optimization Pipeline:
1. **At Initialization / Asset Loading (Offline):**
   - Align the rigid body geometry with its principal axes so that $\mathbf{I}_{\text{body}}$ is purely diagonal:
     $$\mathbf{I}_{\text{body}} = \text{diag}(I_1, I_2, I_3)$$
   - Invert the diagonal matrix once by computing three simple scalar reciprocals:
     $$\mathbf{I}_{\text{body}}^{-1} = \begin{bmatrix} 1/I_1 & 0 & 0 \\ 0 & 1/I_2 & 0 \\ 0 & 0 & 1/I_3 \end{bmatrix}$$
   - Cache this constant diagonal matrix in the body's read-only configuration struct.
2. **During the Physics Simulation Step (Real-Time):**
   - Retrieve the current orientation matrix $\mathbf{R}(q)$ from the attitude quaternion $q$.
   - Evaluate $\mathbf{I}_{\text{world}}^{-1} = \mathbf{R} \, \mathbf{I}_{\text{body}}^{-1} \, \mathbf{R}^T$.
   - Because $\mathbf{I}_{\text{body}}^{-1}$ is diagonal, multiplying $\mathbf{M} = \mathbf{R} \mathbf{I}_{\text{body}}^{-1}$ simply scales the columns of $\mathbf{R}$ by $(1/I_1, 1/I_2, 1/I_3)$.
   - Then compute $\mathbf{I}_{\text{world}}^{-1} = \mathbf{M} \mathbf{R}^T$.
   - **Total runtime cost:** Exactly 18 multiplications and 9 additions! **Zero matrix inversions, zero divisions, zero square roots!**

```
               The Ultra-Fast Engine Pipeline
               
    q (Orientation) ────► R(q) Matrix (9 Mults)
                            │
                            ▼
    Scale Columns by [1/I₁, 1/I₂, 1/I₃]  (9 Mults)
                            │
                            ▼
    Multiply by R^T (9 Mults) ────► I_world⁻¹ Matrix
                                          │
                                          ▼
                                   ω = I_world⁻¹ · L
```

---

## 6.5 10 Step-by-Step Worked Examples

### Worked Example 6.1: Transforming a Diagonal Tensor by a $90^\circ$ Yaw Rotation
**Problem:** A rigid body has principal body moments of inertia $\mathbf{I}_{\text{body}} = \text{diag}(10, 20, 30)\text{ kg}\cdot\text{m}^2$. It is rotated by $\theta = 90^\circ$ about the world $Z$-axis.
1. Write down the rotation matrix $\mathbf{R}$.
2. Compute the world inertia tensor $\mathbf{I}_{\text{world}}$.
3. Compute the inverse world inertia tensor $\mathbf{I}_{\text{world}}^{-1}$.
**Solution:**
1. Rotation matrix for $90^\circ$ about $Z$:
   $$\mathbf{R} = \begin{bmatrix} \cos 90^\circ & -\sin 90^\circ & 0 \\ \sin 90^\circ & \cos 90^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Compute $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$:
   $$\mathbf{R} \mathbf{I}_{\text{body}} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 10 & 0 & 0 \\ 0 & 20 & 0 \\ 0 & 0 & 30 \end{bmatrix} = \begin{bmatrix} 0 & -20 & 0 \\ 10 & 0 & 0 \\ 0 & 0 & 30 \end{bmatrix}$$
   Now multiply by $\mathbf{R}^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$:
   $$\mathbf{I}_{\text{world}} = \begin{bmatrix} 0 & -20 & 0 \\ 10 & 0 & 0 \\ 0 & 0 & 30 \end{bmatrix} \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 20 & 0 & 0 \\ 0 & 10 & 0 \\ 0 & 0 & 30 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
   Notice that rotating $90^\circ$ about $Z$ swapped the $X$ and $Y$ moments: $I_{xx}$ became 20, and $I_{yy}$ became 10!
3. Inverse world inertia:
   $$\mathbf{I}_{\text{world}}^{-1} = \begin{bmatrix} 1/20 & 0 & 0 \\ 0 & 1/10 & 0 \\ 0 & 0 & 1/30 \end{bmatrix} = \begin{bmatrix} 0.05 & 0 & 0 \\ 0 & 0.10 & 0 \\ 0 & 0 & 0.0333 \end{bmatrix}\text{ kg}^{-1}\cdot\text{m}^{-2}$$

---

### Worked Example 6.2: Transforming a Diagonal Tensor by a $45^\circ$ Rotation
**Problem:** Using $\mathbf{I}_{\text{body}} = \text{diag}(10, 20, 30)$, rotate the body by $\theta = 45^\circ$ about the $Z$-axis. Compute $\mathbf{I}_{\text{world}}$ and show that off-diagonal products of inertia appear.
**Solution:**
1. Rotation matrix for $45^\circ$ ($\cos 45^\circ = \sin 45^\circ = \frac{1}{\sqrt{2}} \approx 0.7071$):
   $$\mathbf{R} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & -1 & 0 \\ 1 & 1 & 0 \\ 0 & 0 & \sqrt{2} \end{bmatrix}$$
2. Compute $\mathbf{R}\mathbf{I}_{\text{body}}$:
   $$\mathbf{R}\mathbf{I}_{\text{body}} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & -1 & 0 \\ 1 & 1 & 0 \\ 0 & 0 & \sqrt{2} \end{bmatrix} \begin{bmatrix} 10 & 0 & 0 \\ 0 & 20 & 0 \\ 0 & 0 & 30 \end{bmatrix} = \frac{1}{\sqrt{2}}\begin{bmatrix} 10 & -20 & 0 \\ 10 & 20 & 0 \\ 0 & 0 & 30\sqrt{2} \end{bmatrix}$$
3. Multiply by $\mathbf{R}^T$:
   $$\mathbf{I}_{\text{world}} = \frac{1}{2} \begin{bmatrix} 10 & -20 & 0 \\ 10 & 20 & 0 \\ 0 & 0 & 30\sqrt{2} \end{bmatrix} \begin{bmatrix} 1 & 1 & 0 \\ -1 & 1 & 0 \\ 0 & 0 & \sqrt{2} \end{bmatrix}$$
   - Element (1,1): $\frac{1}{2}(10(1) + (-20)(-1)) = \frac{1}{2}(10 + 20) = 15$.
   - Element (1,2): $\frac{1}{2}(10(1) + (-20)(1)) = \frac{1}{2}(10 - 20) = -5$.
   - Element (2,1): $\frac{1}{2}(10(1) + 20(-1)) = \frac{1}{2}(10 - 20) = -5$.
   - Element (2,2): $\frac{1}{2}(10(1) + 20(1)) = \frac{1}{2}(10 + 20) = 15$.
   - Element (3,3): $\frac{1}{2}(30\sqrt{2} \times \sqrt{2}) = \frac{1}{2}(60) = 30$.
4. Result:
   $$\mathbf{I}_{\text{world}} = \begin{bmatrix} 15 & -5 & 0 \\ -5 & 15 & 0 \\ 0 & 0 & 30 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
5. Trace check: $15 + 15 + 30 = 60$. Original trace: $10 + 20 + 30 = 60$. Trace is strictly preserved.
   The product of inertia $I_{xy} = -5$ arose purely from spatial rotation.

---

### Worked Example 6.3: Extracting World Angular Velocity from Angular Momentum
**Problem:** In the $45^\circ$ rotated configuration of Example 6.2, external collision impulses produce world angular momentum $\mathbf{L}_{\text{world}} = (30, -10, 60)\text{ N}\cdot\text{m}\cdot\text{s}$. Compute the instantaneous world angular velocity $\boldsymbol{\omega}_{\text{world}}$.
**Solution:**
1. Compute $\mathbf{I}_{\text{world}}^{-1}$:
   From Section 6.3: $\mathbf{I}_{\text{world}}^{-1} = \mathbf{R} \mathbf{I}_{\text{body}}^{-1} \mathbf{R}^T$.
   $\mathbf{I}_{\text{body}}^{-1} = \text{diag}(1/10, 1/20, 1/30) = \text{diag}(0.10, 0.05, 0.0333)$.
   Applying the same $45^\circ$ rotation:
   - $(1,1) = \frac{1}{2}(0.10 + 0.05) = 0.075$.
   - $(1,2) = \frac{1}{2}(0.10 - 0.05) = +0.025$.
   - $(2,2) = 0.075$.
   - $(3,3) = 0.03333$.
   $$\mathbf{I}_{\text{world}}^{-1} = \begin{bmatrix} 0.075 & 0.025 & 0 \\ 0.025 & 0.075 & 0 \\ 0 & 0 & 0.03333 \end{bmatrix}$$
2. Compute $\boldsymbol{\omega}_{\text{world}} = \mathbf{I}_{\text{world}}^{-1} \mathbf{L}_{\text{world}}$:
   $$\omega_x = 0.075(30) + 0.025(-10) + 0 = 2.25 - 0.25 = 2.0\text{ rad/s}$$
   $$\omega_y = 0.025(30) + 0.075(-10) + 0 = 0.75 - 0.75 = 0.0\text{ rad/s}$$
   $$\omega_z = 0.03333(60) = 2.0\text{ rad/s}$$
3. Result: $\boldsymbol{\omega}_{\text{world}} = (2.0, 0.0, 2.0)\text{ rad/s}$.
4. Verification:
   $$\mathbf{L} = \mathbf{I}_{\text{world}}\boldsymbol{\omega} = \begin{bmatrix} 15 & -5 & 0 \\ -5 & 15 & 0 \\ 0 & 0 & 30 \end{bmatrix} \begin{bmatrix} 2 \\ 0 \\ 2 \end{bmatrix} = \begin{bmatrix} 15(2) - 5(0) \\ -5(2) + 15(0) \\ 30(2) \end{bmatrix} = \begin{bmatrix} 30 \\ -10 \\ 60 \end{bmatrix}\text{ N}\cdot\text{m}\cdot\text{s}$$
   Exact match.

---

### Worked Example 6.4: Transforming via Unit Quaternion
**Problem:** An orientation is given by unit quaternion $q = (0.7071068, 0.7071068, 0, 0)$ ($90^\circ$ rotation about $X$). If $\mathbf{I}_{\text{body}} = \text{diag}(5, 12, 13)$, compute $\mathbf{I}_{\text{world}}$.
**Solution:**
1. Convert $q$ to rotation matrix $\mathbf{R}(q)$:
   $w = \frac{\sqrt{2}}{2}, x = \frac{\sqrt{2}}{2}, y = 0, z = 0$.
   $$\mathbf{R} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 - 2x^2 & -2wx \\ 0 & 2wx & 1 - 2x^2 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$
2. Compute $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$:
   $$\mathbf{R} \mathbf{I}_{\text{body}} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} 5 & 0 & 0 \\ 0 & 12 & 0 \\ 0 & 0 & 13 \end{bmatrix} = \begin{bmatrix} 5 & 0 & 0 \\ 0 & 0 & -13 \\ 0 & 12 & 0 \end{bmatrix}$$
   Multiply by $\mathbf{R}^T = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & -1 & 0 \end{bmatrix}$:
   $$\mathbf{I}_{\text{world}} = \begin{bmatrix} 5 & 0 & 0 \\ 0 & 0 & -13 \\ 0 & 12 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & -1 & 0 \end{bmatrix} = \begin{bmatrix} 5 & 0 & 0 \\ 0 & 13 & 0 \\ 0 & 0 & 12 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
3. A $90^\circ$ pitch rotation swapped $I_{yy}$ and $I_{zz}$ ($12 \leftrightarrow 13$), leaving $I_{xx} = 5$ invariant.

---

### Worked Example 6.5: Invariant Kinetic Energy Across Frames
**Problem:** For the state in Worked Example 6.3, compute rotational kinetic energy in both the World Frame and the Body Frame, and verify that they are identical.
**Solution:**
1. **World Frame Calculation:**
   $$\boldsymbol{\omega}_{\text{world}} = (2, 0, 2), \quad \mathbf{L}_{\text{world}} = (30, -10, 60)$$
   $$T_{\text{rot}} = \frac{1}{2}\boldsymbol{\omega}_{\text{world}} \cdot \mathbf{L}_{\text{world}} = \frac{1}{2} [ 2(30) + 0(-10) + 2(60) ] = \frac{1}{2}(60 + 120) = \frac{1}{2}(180) = 90\text{ J}$$
2. **Body Frame Calculation:**
   Transform $\boldsymbol{\omega}$ to body frame: $\boldsymbol{\omega}_{\text{body}} = \mathbf{R}^T \boldsymbol{\omega}_{\text{world}}$.
   $\mathbf{R}$ is $45^\circ$ about $Z$:
   $$\boldsymbol{\omega}_{\text{body}} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 & 0 \\ -1 & 1 & 0 \\ 0 & 0 & \sqrt{2} \end{bmatrix} \begin{bmatrix} 2 \\ 0 \\ 2 \end{bmatrix} = \begin{bmatrix} 2/\sqrt{2} \\ -2/\sqrt{2} \\ 2 \end{bmatrix} = \begin{bmatrix} \sqrt{2} \\ -\sqrt{2} \\ 2 \end{bmatrix}\text{ rad/s}$$
   Evaluate $T_{\text{rot}} = \frac{1}{2}[I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2]$ with $I_1 = 10, I_2 = 20, I_3 = 30$:
   $$I_1 \omega_1^2 = 10(\sqrt{2})^2 = 10(2) = 20$$
   $$I_2 \omega_2^2 = 20(-\sqrt{2})^2 = 20(2) = 40$$
   $$I_3 \omega_3^2 = 30(2^2) = 30(4) = 120$$
   $$T_{\text{rot}} = \frac{1}{2}(20 + 40 + 120) = \frac{1}{2}(180) = 90\text{ J}$$
3. Exact physical invariance confirmed.

---

### Worked Example 6.6: Rate of Change of the World Inertia Tensor $\dot{\mathbf{I}}_{\text{world}}$
**Problem:** Derive the analytical time derivative $\dot{\mathbf{I}}_{\text{world}}(t)$ in terms of the world angular velocity vector $\boldsymbol{\omega}_{\text{world}}$.
**Solution:**
1. Start with $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$.
2. Differentiate with respect to time using the product rule:
   $$\dot{\mathbf{I}}_{\text{world}} = \dot{\mathbf{R}} \mathbf{I}_{\text{body}} \mathbf{R}^T + \mathbf{R} \mathbf{I}_{\text{body}} \dot{\mathbf{R}}^T$$
   (since $\mathbf{I}_{\text{body}}$ is constant in time).
3. Recall Poisson's kinematic formula: $\dot{\mathbf{R}} = [\boldsymbol{\omega}]_\times \mathbf{R}$, where $[\boldsymbol{\omega}]_\times$ is the $3 \times 3$ skew-symmetric cross-product matrix:
   $$[\boldsymbol{\omega}]_\times = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$
4. Transpose: $\dot{\mathbf{R}}^T = ([\boldsymbol{\omega}]_\times \mathbf{R})^T = \mathbf{R}^T [\boldsymbol{\omega}]_\times^T = -\mathbf{R}^T [\boldsymbol{\omega}]_\times$.
5. Substitute:
   $$\dot{\mathbf{I}}_{\text{world}} = [\boldsymbol{\omega}]_\times \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T - \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T [\boldsymbol{\omega}]_\times$$
   $$\dot{\mathbf{I}}_{\text{world}} = [\boldsymbol{\omega}]_\times \mathbf{I}_{\text{world}} - \mathbf{I}_{\text{world}} [\boldsymbol{\omega}]_\times = [[\boldsymbol{\omega}]_\times, \mathbf{I}_{\text{world}}]$$
6. Result: The time rate of change of the world inertia tensor is given by the matrix **commutator** of the angular velocity matrix and the inertia tensor!

---

### Worked Example 6.7: Time Derivative of Trace
**Problem:** Use the result of Example 6.6 to prove that $\frac{d}{dt}\text{tr}(\mathbf{I}_{\text{world}}) = 0$.
**Solution:**
1. $\frac{d}{dt}\text{tr}(\mathbf{I}_{\text{world}}) = \text{tr}(\dot{\mathbf{I}}_{\text{world}})$.
2. From Example 6.6: $\dot{\mathbf{I}}_{\text{world}} = [\boldsymbol{\omega}]_\times \mathbf{I}_{\text{world}} - \mathbf{I}_{\text{world}} [\boldsymbol{\omega}]_\times$.
3. By the cyclic property of the trace:
   $$\text{tr}(A B) = \text{tr}(B A)$$
   $$\text{tr}([\boldsymbol{\omega}]_\times \mathbf{I}_{\text{world}}) = \text{tr}(\mathbf{I}_{\text{world}} [\boldsymbol{\omega}]_\times)$$
4. Subtracting:
   $$\text{tr}(\dot{\mathbf{I}}_{\text{world}}) = \text{tr}([\boldsymbol{\omega}]_\times \mathbf{I}_{\text{world}}) - \text{tr}(\mathbf{I}_{\text{world}} [\boldsymbol{\omega}]_\times) = 0$$
5. The trace remains rigorously constant throughout arbitrary 3D tumbling.

---

### Worked Example 6.8: Memory and Computation Benchmark in Physics Engines
**Problem:** Compare the memory overhead and floating-point operations of:
- Strategy A: Storing a fully populated $3 \times 3$ matrix for $\mathbf{I}_{\text{world}}$ and inverting it each frame.
- Strategy B: Caching a 3-element vector $(1/I_1, 1/I_2, 1/I_3)$ and using $\mathbf{R} \mathbf{I}_{\text{body}}^{-1} \mathbf{R}^T$.
**Solution:**
1. **Memory Overhead per Rigid Body:**
   - Strategy A: 9 floats for $\mathbf{I}_{\text{world}}$ + 9 floats for $\mathbf{I}_{\text{world}}^{-1}$ = 18 floats ($72\text{ bytes}$).
   - Strategy B: 3 floats for inverse principal diagonal = 3 floats ($12\text{ bytes}$).
   - Strategy B achieves a **$6\times$ memory reduction**, dramatically improving L1 cache capacity.
2. **Computational Operations per Body per Frame:**
   - Strategy A: $3 \times 3$ general matrix inversion requires ~30 multiplications, 14 additions, and 1 floating-point division.
   - Strategy B: Scaling columns of $\mathbf{R}$ takes 9 multiplications; multiplying $\mathbf{M} \mathbf{R}^T$ takes 18 multiplications and 9 additions.
   - Strategy B uses 27 fast fused-multiply-adds with **zero divisions**, running over $4\times$ faster on modern CPU/GPU architectures.

---

### Worked Example 6.9: Directional Invariance of a Spherical Top
**Problem:** A spherical top has $\mathbf{I}_{\text{body}} = I_0 \mathbf{I}_3$. Show that its world inertia tensor is strictly invariant under any arbitrary spatial rotation $\mathbf{R}(t)$.
**Solution:**
1. In the world frame:
   $$\mathbf{I}_{\text{world}} = \mathbf{R}(t) \mathbf{I}_{\text{body}} \mathbf{R}^T(t)$$
2. Substitute $\mathbf{I}_{\text{body}} = I_0 \mathbf{I}_3$:
   $$\mathbf{I}_{\text{world}} = \mathbf{R}(t) (I_0 \mathbf{I}_3) \mathbf{R}^T(t) = I_0 \Big( \mathbf{R}(t) \mathbf{R}^T(t) \Big)$$
3. Since $\mathbf{R}(t) \in SO(3)$, $\mathbf{R}(t) \mathbf{R}^T(t) = \mathbf{I}_3$:
   $$\mathbf{I}_{\text{world}} = I_0 \mathbf{I}_3 \equiv \mathbf{I}_{\text{body}}$$
4. A spherical top's inertia tensor is completely invariant to rotation; the physics engine never needs to update $\mathbf{I}_{\text{world}}$!

---

### Worked Example 6.10: Transforming Angular Velocity of a Gyroscopic Gimbal
**Problem:** A gimbal sensor measures the angular velocity of an aircraft in body coordinates as $\boldsymbol{\omega}_{\text{body}} = (0.05, -0.02, 0.10)\text{ rad/s}$. The aircraft attitude matrix is:
$$\mathbf{R} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$
Calculate the angular velocity vector in world coordinates $\boldsymbol{\omega}_{\text{world}}$.
**Solution:**
1. Transformation formula:
   $$\boldsymbol{\omega}_{\text{world}} = \mathbf{R} \boldsymbol{\omega}_{\text{body}}$$
2. Multiply:
   $$\boldsymbol{\omega}_{\text{world}} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} 0.05 \\ -0.02 \\ 0.10 \end{bmatrix} = \begin{bmatrix} 0.10 \\ 0.05 \\ -0.02 \end{bmatrix}\text{ rad/s}$$
3. The roll rate along body $x$ became a pitch rate along world $y$, and body yaw along $z$ became world roll along $x$.

---

## 6.6 10 Granular Solved Exercises

### Exercise 6.1
**Problem:** Prove that $\mathbf{I}_{\text{world}}$ is symmetric, given that $\mathbf{I}_{\text{body}}$ is symmetric.
**Solution:**
1. Transpose the world tensor:
   $$\mathbf{I}_{\text{world}}^T = (\mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T)^T = (\mathbf{R}^T)^T \mathbf{I}_{\text{body}}^T \mathbf{R}^T$$
2. Since $(\mathbf{R}^T)^T = \mathbf{R}$ and $\mathbf{I}_{\text{body}}^T = \mathbf{I}_{\text{body}}$:
   $$\mathbf{I}_{\text{world}}^T = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T = \mathbf{I}_{\text{world}}$$
3. Thus $\mathbf{I}_{\text{world}}$ is strictly symmetric for all $t$.

---

### Exercise 6.2
**Problem:** Prove that $\det(\mathbf{I}_{\text{world}}) = \det(\mathbf{I}_{\text{body}})$.
**Solution:**
1. $\det(\mathbf{I}_{\text{world}}) = \det(\mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T) = \det(\mathbf{R})\det(\mathbf{I}_{\text{body}})\det(\mathbf{R}^T)$.
2. Since $\mathbf{R} \in SO(3)$, $\det(\mathbf{R}) = \det(\mathbf{R}^T) = 1$.
3. Therefore, $\det(\mathbf{I}_{\text{world}}) = (1)\det(\mathbf{I}_{\text{body}})(1) = \det(\mathbf{I}_{\text{body}})$.

---

### Exercise 6.3
**Problem:** If $\mathbf{I}_{\text{body}} = \text{diag}(1, 2, 3)$, what is the maximum possible value that any diagonal element of $\mathbf{I}_{\text{world}}$ can attain under arbitrary 3D rotation?
**Solution:**
1. The diagonal element $I_{xx}^{(\text{world})}$ is given by:
   $$I_{xx}^{(\text{world})} = \hat{\mathbf{e}}_x^T \mathbf{I}_{\text{world}} \hat{\mathbf{e}}_x = (\mathbf{R}^T \hat{\mathbf{e}}_x)^T \mathbf{I}_{\text{body}} (\mathbf{R}^T \hat{\mathbf{e}}_x)$$
2. Let $\mathbf{u} = \mathbf{R}^T \hat{\mathbf{e}}_x$. Since $\mathbf{R} \in SO(3)$, $\|\mathbf{u}\| = \|\hat{\mathbf{e}}_x\| = 1$.
3. In principal coordinates:
   $$\mathbf{u}^T \mathbf{I}_{\text{body}} \mathbf{u} = I_1 u_1^2 + I_2 u_2^2 + I_3 u_3^2$$
   subject to $u_1^2 + u_2^2 + u_3^2 = 1$.
4. By the Rayleigh-Ritz theorem, the maximum value of this quadratic form on the unit sphere is the maximum eigenvalue:
   $$\max I_{xx}^{(\text{world})} = I_3 = 3\text{ kg}\cdot\text{m}^2$$
5. Similarly, the minimum possible value is $I_1 = 1\text{ kg}\cdot\text{m}^2$.

---

### Exercise 6.4
**Problem:** In a physics engine, if a body has $\mathbf{I}_{\text{body}} = \text{diag}(I_1, I_2, I_3)$ and is oriented with quaternion $q$, write down the expression for the third column of the matrix $\mathbf{R} \mathbf{I}_{\text{body}}^{-1}$.
**Solution:**
1. The columns of the rotation matrix $\mathbf{R}$ are $\mathbf{c}_1, \mathbf{c}_2, \mathbf{c}_3$.
2. Multiplying on the right by diagonal matrix $\mathbf{I}_{\text{body}}^{-1} = \text{diag}(1/I_1, 1/I_2, 1/I_3)$ scales each column:
   $$\mathbf{M} = \mathbf{R} \mathbf{I}_{\text{body}}^{-1} = \begin{bmatrix} \frac{\mathbf{c}_1}{I_1} & \frac{\mathbf{c}_2}{I_2} & \frac{\mathbf{c}_3}{I_3} \end{bmatrix}$$
3. The third column is simply:
   $$\frac{\mathbf{c}_3}{I_3} = \frac{1}{I_3} \begin{bmatrix} 2(xz + wy) \\ 2(yz - wx) \\ 1 - 2(x^2 + y^2) \end{bmatrix}$$.

---

### Exercise 6.5
**Problem:** Explain why the orientation of a rigid body cannot be integrated simply by adding $\Delta t \, \boldsymbol{\omega}$ to the rotation matrix ($\mathbf{R}_{n+1} = \mathbf{R}_n + \Delta t [\boldsymbol{\omega}]_\times \mathbf{R}_n$).
**Solution:**
1. Direct matrix addition violates the orthogonality constraint:
   $$\mathbf{R}_{n+1}^T \mathbf{R}_{n+1} = (\mathbf{R}_n + \Delta t [\boldsymbol{\omega}]_\times \mathbf{R}_n)^T (\mathbf{R}_n + \Delta t [\boldsymbol{\omega}]_\times \mathbf{R}_n) = \mathbf{I} + \Delta t^2 [\boldsymbol{\omega}]_\times^T [\boldsymbol{\omega}]_\times \ne \mathbf{I}$$
2. The columns of $\mathbf{R}$ cease to be orthonormal, causing non-uniform scaling, shear, and mesh deformation.
3. Representing orientation as a unit quaternion on $\mathbb{S}^3$ and integrating with the exponential map preserves exact orthonormality.

---

### Exercise 6.6
**Problem:** If external torque in the world frame is zero ($\boldsymbol{\tau}_{\text{world}} = \mathbf{0}$), what quantity is strictly conserved in the world frame? Is it conserved in the body frame?
**Solution:**
1. In the world frame: $\dot{\mathbf{L}}_{\text{world}} = \boldsymbol{\tau}_{\text{world}} = \mathbf{0}$.
   Therefore, world angular momentum $\mathbf{L}_{\text{world}}$ is **strictly constant** in magnitude and spatial direction.
2. In the body frame: $\mathbf{L}_{\text{body}} = \mathbf{R}^T \mathbf{L}_{\text{world}}$.
   Because $\mathbf{R}(t)$ rotates over time, $\mathbf{L}_{\text{body}}$ changes direction continuously in the body frame ($\dot{\mathbf{L}}_{\text{body}} = -\boldsymbol{\omega}_{\text{body}} \times \mathbf{L}_{\text{body}} \ne \mathbf{0}$).
3. However, its magnitude $\|\mathbf{L}_{\text{body}}\| = \|\mathbf{L}_{\text{world}}\|$ remains strictly conserved.

---

### Exercise 6.7
**Problem:** Show that the Frobenius norm $\|\mathbf{I}_{\text{world}}\|_F = \sqrt{\sum_{i,j} I_{ij}^2}$ is invariant under 3D rotation.
**Solution:**
1. The Frobenius norm squared is $\|\mathbf{A}\|_F^2 = \text{tr}(\mathbf{A}^T \mathbf{A})$.
2. For $\mathbf{I}_{\text{world}} = \mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T$:
   $$\mathbf{I}_{\text{world}}^T \mathbf{I}_{\text{world}} = (\mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T) (\mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T) = \mathbf{R} \mathbf{I}_{\text{body}}^2 \mathbf{R}^T$$
3. Taking the trace:
   $$\text{tr}(\mathbf{R} \mathbf{I}_{\text{body}}^2 \mathbf{R}^T) = \text{tr}(\mathbf{I}_{\text{body}}^2 \mathbf{R}^T \mathbf{R}) = \text{tr}(\mathbf{I}_{\text{body}}^2) = I_1^2 + I_2^2 + I_3^2$$
4. Thus, the Frobenius norm is strictly invariant under all rotations.

---

### Exercise 6.8
**Problem:** A symmetric top with $I_1 = I_2 = 10$ and $I_3 = 2$ rotates around its symmetry axis $\hat{\mathbf{e}}_3$. Why does its world inertia tensor remain unchanged even if it spins at $10,000\text{ rad/s}$?
**Solution:**
1. Spin about the symmetry axis corresponds to rotation $\mathbf{R}$ around $\hat{\mathbf{e}}_3$.
2. In the body frame, $\mathbf{I}_{\text{body}} = \text{diag}(10, 10, 2) = 10 \mathbf{I}_3 - 8 \hat{\mathbf{e}}_3 \hat{\mathbf{e}}_3^T$.
3. Any rotation around $\hat{\mathbf{e}}_3$ leaves $\hat{\mathbf{e}}_3$ invariant ($\mathbf{R}\hat{\mathbf{e}}_3 = \hat{\mathbf{e}}_3$).
4. Therefore, $\mathbf{R} \mathbf{I}_{\text{body}} \mathbf{R}^T \equiv \mathbf{I}_{\text{body}}$.
5. The mass distribution in space is rotationally symmetric, so spinning around the symmetry axis creates no change in the spatial mass distribution.

---

### Exercise 6.9
**Problem:** In a flight simulator, why must the aircraft's aerodynamic stability derivatives be evaluated in the body frame rather than the world frame?
**Solution:**
1. Aerodynamic lift, drag, side-force, and control surface moments (ailerons, rudder, elevator) depend on the aircraft's velocity relative to the air expressed in the **body frame** (angle of attack $\alpha$ and sideslip angle $\beta$).
2. The aircraft's geometry and inertia tensor $\mathbf{I}_{\text{body}}$ are fixed relative to the fuselage.
3. Evaluating aerodynamics in the body frame allows using constant pre-computed wind-tunnel lookup tables, which are then rotated into the world frame via $\mathbf{R}(q)$ for gravitational integration.

---

### Exercise 6.10
**Problem:** If a rigid body is scaled by a non-uniform scale matrix $\mathbf{S} = \text{diag}(s_x, s_y, s_z)$, can its new inertia tensor be obtained by $\mathbf{S} \mathbf{I} \mathbf{S}$?
**Solution:**
1. No. An inertia tensor is not transformed by non-uniform scale via $\mathbf{S} \mathbf{I} \mathbf{S}$.
2. Under non-uniform scaling, the coordinates scale as $x \to s_x x, y \to s_y y, z \to s_z z$, and volume element scales as $dV \to (s_x s_y s_z) dV$.
3. The new moment of inertia is:
   $$I_{xx}' = \rho_0 (s_x s_y s_z) \int (s_y^2 y^2 + s_z^2 z^2) dV$$
4. This does not correspond to the matrix product $\mathbf{S} \mathbf{I} \mathbf{S}$. Non-uniform scaling requires recalculating the integrals or updating individual geometric dimensions $(a s_x, b s_y, c s_z)$.
