# Chapter 9: Conversions Between Quaternions, Rotation Matrices, and Euler Angles

> *"In mathematics, the art of asking a question is more important than solving it; in software architecture, the art of seamless translation between disparate mathematical representations is what prevents catastrophic runtime collapse."*

---

## 9.1 The Representation Rosetta Stone

In modern 3D graphics, aerospace dynamics, and physics simulation engines, no single rotational representation is universally optimal across all computational pipelines:

1. **Rotation Matrices ($3 \times 3$ and $4 \times 4$ Affine):**
   - *Dominance:* The native language of GPU hardware rasterization, vertex shaders, and scene-graph composition. Matrix multiplication chains transformations seamlessly.
   - *Drawback:* Redundant (9 floats for 3 degrees of freedom), prone to numerical drift (orthonormality degeneration requiring costly Gram-Schmidt re-orthogonalization), and virtually impossible to interpolate smoothly.
2. **Euler Angles (Pitch, Yaw, Roll):**
   - *Dominance:* Human-machine interfaces, camera controllers, artistic animation curves, and aeronautical instrumentation.
   - *Drawback:* Order-dependent (12 distinct Euler/Tait-Bryan conventions), structurally discontinuous across the sphere, and cursed with **Gimbal Lock** singularities where degrees of freedom vanish.
3. **Unit Quaternions ($\mathbb{S}^3$ Versors):**
   - *Dominance:* Physics engine kinematic state integration, smooth spherical interpolation (SLERP), compact storage (4 floats), and fast algebraic concatenation.
   - *Drawback:* Cannot directly multiply 3D vertex buffers on GPU hardware without conversion to a matrix, and double-covers $SO(3)$ ($q$ and $-q$ represent the same orientation).
4. **Axis-Angle ($\theta, \hat{\mathbf{n}}$):**
   - *Dominance:* Physics constraints, angular impulse resolution, gyroscopic torque vectors, and twist-swing decompositions.
   - *Drawback:* Non-trivial algebraic concatenation and discontinuous at $\theta = 0$.

A world-class engine must act as a **Rotational Rosetta Stone**, dynamically translating between these four representations at sub-nanosecond latency without introducing floating-point singularities, division-by-zero crashes, or trigonometric stalls.

```
                  ┌───────────────────────────────┐
                  │          Euler Angles         │
                  │       (Pitch, Yaw, Roll)      │
                  └───────┬───────────────▲───────┘
                          │               │
                     Trig │               │ atan2 / asin
                   Evals  │               │ (Gimbal Lock Safeguard)
                          ▼               │
                  ┌───────────────────────┴───────┐
                  │        Unit Quaternion        │
                  │          q = (w, x, y, z)     │
                  └───────┬───────────────▲───────┘
                          │               │
                 Algebraic│               │ Shepperd /
               Polynomials│               │ Bar-Itzhack
               (Zero Trig)│               │ Eigen Branching
                          ▼               │
                  ┌───────────────────────┴───────┐
                  │       Rotation Matrix         │
                  │            R ∈ SO(3)          │
                  └───────────────────────────────┘
```

---

## 9.2 Converting a Unit Quaternion to a $3 \times 3$ Rotation Matrix

Given a unit quaternion $q = w + x\mathbf{i} + y\mathbf{j} + z\mathbf{k} = (w, \mathbf{v})$ with $\|q\|^2 = w^2 + x^2 + y^2 + z^2 = 1$, we seek the equivalent $3 \times 3$ matrix $\mathbf{R} \in SO(3)$ such that for any spatial vector $\mathbf{u} \in \mathbb{R}^3$:

$$\mathbf{R} \mathbf{u} = \mathcal{V}(q \, \mathbf{p}_{\mathbf{u}} \, q^*)$$

where $\mathbf{p}_{\mathbf{u}} = (0, \mathbf{u})$.

### Rigorous Algebraic Derivation

Recall the vector form of the quaternionic sandwich product derived in Chapter 8:
$$q \, \mathbf{p} \, q^* = (w^2 - \|\mathbf{v}\|^2)\mathbf{u} + 2(\mathbf{v} \cdot \mathbf{u})\mathbf{v} + 2w(\mathbf{v} \times \mathbf{u})$$

Since $q$ is a unit quaternion, $w^2 + \|\mathbf{v}\|^2 = 1 \implies \|\mathbf{v}\|^2 = 1 - w^2$. Thus:
$$w^2 - \|\mathbf{v}\|^2 = 2w^2 - 1 = 1 - 2\|\mathbf{v}\|^2 = 1 - 2(x^2 + y^2 + z^2)$$

Now evaluate the image of the canonical standard basis vectors $\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$, $\mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$, $\mathbf{e}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$. The columns of matrix $\mathbf{R}$ are precisely the transformed basis vectors:
$$\mathbf{R} = \begin{bmatrix} \mathbf{R}\mathbf{e}_1 & \mathbf{R}\mathbf{e}_2 & \mathbf{R}\mathbf{e}_3 \end{bmatrix}$$

Let us compute the first column $\mathbf{c}_1 = \mathbf{R}\mathbf{e}_1$:
1. Scalar term: $w^2 - x^2 - y^2 - z^2$
2. Dot product term: $2(\mathbf{v} \cdot \mathbf{e}_1)\mathbf{v} = 2x \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 2x^2 \\ 2xy \\ 2xz \end{bmatrix}$
3. Cross product term: $2w(\mathbf{v} \times \mathbf{e}_1) = 2w \left(\begin{bmatrix} x \\ y \\ z \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}\right) = 2w \begin{bmatrix} 0 \\ z \\ -y \end{bmatrix} = \begin{bmatrix} 0 \\ 2wz \\ -2wy \end{bmatrix}$

Adding these terms:
$$\mathbf{c}_1 = \begin{bmatrix} w^2 - x^2 - y^2 - z^2 + 2x^2 \\ 2xy + 2wz \\ 2xz - 2wy \end{bmatrix} = \begin{bmatrix} w^2 + x^2 - y^2 - z^2 \\ 2(xy + wz) \\ 2(xz - wy) \end{bmatrix}$$

Using the identity $w^2 + x^2 + y^2 + z^2 = 1 \implies w^2 + x^2 = 1 - (y^2 + z^2)$:
$$w^2 + x^2 - y^2 - z^2 = 1 - 2(y^2 + z^2)$$

Repeating this exact derivation for $\mathbf{c}_2 = \mathbf{R}\mathbf{e}_2$ and $\mathbf{c}_3 = \mathbf{R}\mathbf{e}_3$ yields the canonical matrix:

$$\mathbf{R}(q) = \begin{bmatrix} 
1 - 2(y^2 + z^2) & 2(xy - wz) & 2(xz + wy) \\ 
2(xy + wz) & 1 - 2(x^2 + z^2) & 2(yz - wx) \\ 
2(xz - wy) & 2(yz + wx) & 1 - 2(x^2 + y^2) 
\end{bmatrix}$$

### Computational Efficiency
Notice the astonishing computational elegance of this formula:
- **Zero trigonometric functions** ($\sin, \cos$ calls cost 50–100 CPU cycles; this formula uses 0).
- **Zero square roots or divisions** (all coefficients are integers or products).
- **Computational Cost:** Exactly 9 multiplications, 12 additions/subtractions, and 3 shifts (multiplication by 2). In vectorized SIMD/AVX2 instructions, this entire conversion evaluates in **under 3 nanoseconds**.

---

## 9.3 Extracting a Unit Quaternion from a $3 \times 3$ Rotation Matrix

The inverse problem—extracting $q = (w, x, y, z)$ given an arbitrary orthogonal matrix $\mathbf{R} = [R_{ij}] \in SO(3)$—is significantly more subtle. A naive algorithm found in outdated textbooks leads to catastrophic floating-point division-by-zero errors.

### The Naive Trace Method (and Why It Fails)

Examine the trace of the rotation matrix $\mathbf{R}(q)$:
$$\text{tr}(\mathbf{R}) = R_{11} + R_{22} + R_{33} = [1 - 2(y^2 + z^2)] + [1 - 2(x^2 + z^2)] + [1 - 2(x^2 + y^2)]$$
$$\text{tr}(\mathbf{R}) = 3 - 4(x^2 + y^2 + z^2)$$

Since $x^2 + y^2 + z^2 = 1 - w^2$:
$$\text{tr}(\mathbf{R}) = 3 - 4(1 - w^2) = 4w^2 - 1$$
$$4w^2 = 1 + \text{tr}(\mathbf{R}) \implies w = \frac{1}{2}\sqrt{1 + R_{11} + R_{22} + R_{33}}$$

Once $w$ is determined, the off-diagonal skew-symmetric differences yield $x, y, z$:
$$R_{32} - R_{23} = [2(yz + wx)] - [2(yz - wx)] = 4wx \implies x = \frac{R_{32} - R_{23}}{4w}$$
$$R_{13} - R_{31} = [2(xz + wy)] - [2(xz - wy)] = 4wy \implies y = \frac{R_{13} - R_{31}}{4w}$$
$$R_{21} - R_{12} = [2(xy + wz)] - [2(xy - wz)] = 4wz \implies z = \frac{R_{21} - R_{12}}{4w}$$

#### The Catastrophe:
If the rotation angle $\theta \to 180^\circ$ ($\pi$ radians), then $w = \cos(\pi/2) = 0$.
Then $\text{tr}(\mathbf{R}) = 4(0)^2 - 1 = -1$.
The denominator $4w$ evaluates to **zero**. In single-precision IEEE 754 floating-point arithmetic, when $\theta \in [179.9^\circ, 180.1^\circ]$, $w < 10^{-7}$, causing catastrophic division by near-zero, producing `+Infinity`, `-Infinity`, or `NaN` explosion!

### The Shepperd / Bar-Itzhack Diagonal Branching Algorithm

To eliminate this singularity, Stanley W. Shepperd (1978) formulated a mathematically bulletproof algorithm. Instead of assuming $w$ is large, we examine the four diagonal quantities:

$$\begin{aligned}
4w^2 &= 1 + R_{11} + R_{22} + R_{33} \\
4x^2 &= 1 + R_{11} - R_{22} - R_{33} \\
4y^2 &= 1 - R_{11} + R_{22} - R_{33} \\
4z^2 &= 1 - R_{11} - R_{22} + R_{33}
\end{aligned}$$

Notice that the sum of these four squares is:
$$4(w^2 + x^2 + y^2 + z^2) = 4(1) = 4$$

By the Pigeonhole Principle, at least one of $\{w^2, x^2, y^2, z^2\}$ must be greater than or equal to $\frac{1}{4}$. Therefore, the maximum of these four quantities is **guaranteed** to be $\ge 1$, which means its square root is $\ge 1.0$.

#### The 4-Branch Execution Protocol:
1. **Branch 0 (Trace is Dominant): $\text{tr}(\mathbf{R}) > 0$**
   $$S = 2\sqrt{1 + R_{11} + R_{22} + R_{33}} = 4w$$
   $$w = \frac{S}{4}, \quad x = \frac{R_{32} - R_{23}}{S}, \quad y = \frac{R_{13} - R_{31}}{S}, \quad z = \frac{R_{21} - R_{12}}{S}$$

2. **Branch 1 ($R_{11}$ is Maximum Diagonal): $R_{11} \ge R_{22}$ and $R_{11} \ge R_{33}$**
   $$S = 2\sqrt{1 + R_{11} - R_{22} - R_{33}} = 4x$$
   $$x = \frac{S}{4}, \quad w = \frac{R_{32} - R_{23}}{S}, \quad y = \frac{R_{12} + R_{21}}{S}, \quad z = \frac{R_{13} + R_{31}}{S}$$

3. **Branch 2 ($R_{22}$ is Maximum Diagonal): $R_{22} > R_{33}$**
   $$S = 2\sqrt{1 - R_{11} + R_{22} - R_{33}} = 4y$$
   $$y = \frac{S}{4}, \quad w = \frac{R_{13} - R_{31}}{S}, \quad x = \frac{R_{12} + R_{21}}{S}, \quad z = \frac{R_{23} + R_{32}}{S}$$

4. **Branch 3 ($R_{33}$ is Maximum Diagonal):**
   $$S = 2\sqrt{1 - R_{11} - R_{22} + R_{33}} = 4z$$
   $$z = \frac{S}{4}, \quad w = \frac{R_{21} - R_{12}}{S}, \quad x = \frac{R_{13} + R_{31}}{S}, \quad y = \frac{R_{23} + R_{32}}{S}$$

This guarantees that the divisor $S \ge 1.0$ at all times. It is completely immune to division by zero, floating-point cancellation, and $180^\circ$ rotation singularities.

---

## 9.4 Euler Angles to Quaternions

Consider the standard aeronautical and aerospace **Yaw-Pitch-Roll** convention:
- **Yaw ($\psi$):** Rotation around the vertical $Z$-axis.
- **Pitch ($\theta$):** Rotation around the transverse $Y$-axis.
- **Roll ($\phi$):** Rotation around the longitudinal $X$-axis.

In an intrinsic rotation sequence (rotating around moving body axes in order $Z \to Y' \to X''$), the equivalent global rotation quaternion is formed by multiplying the elemental quaternions in reverse order:
$$q = q_z(\psi) \, q_y(\theta) \, q_x(\phi)$$

### Elemental Quaternions:
$$q_z(\psi) = \begin{bmatrix} \cos\frac{\psi}{2} \\ 0 \\ 0 \\ \sin\frac{\psi}{2} \end{bmatrix}, \quad q_y(\theta) = \begin{bmatrix} \cos\frac{\theta}{2} \\ 0 \\ \sin\frac{\theta}{2} \\ 0 \end{bmatrix}, \quad q_x(\phi) = \begin{bmatrix} \cos\frac{\phi}{2} \\ \sin\frac{\phi}{2} \\ 0 \\ 0 \end{bmatrix}$$

Let:
$$c_\psi = \cos\frac{\psi}{2}, \quad s_\psi = \sin\frac{\psi}{2}$$
$$c_\theta = \cos\frac{\theta}{2}, \quad s_\theta = \sin\frac{\theta}{2}$$
$$c_\phi = \cos\frac{\phi}{2}, \quad s_\phi = \sin\frac{\phi}{2}$$

Multiplying $q_z(\psi) q_y(\theta)$ first:
$$q_{zy} = (c_\psi + s_\psi \mathbf{k})(c_\theta + s_\theta \mathbf{j}) = c_\psi c_\theta + s_\psi s_\theta (\mathbf{k}\mathbf{j}) + c_\psi s_\theta \mathbf{j} + s_\psi c_\theta \mathbf{k} = c_\psi c_\theta - s_\psi s_\theta \mathbf{i} + c_\psi s_\theta \mathbf{j} + s_\psi c_\theta \mathbf{k}$$

Now multiplying by $q_x(\phi) = c_\phi + s_\phi \mathbf{i}$:
$$q = q_{zy}(c_\phi + s_\phi \mathbf{i})$$

Expanding algebraically yields the four components:

$$\begin{aligned}
w &= c_\psi c_\theta c_\phi + s_\psi s_\theta s_\phi \\
x &= c_\psi c_\theta s_\phi - s_\psi s_\theta c_\phi \\
y &= c_\psi s_\theta c_\phi + s_\psi c_\theta s_\phi \\
z &= s_\psi c_\theta c_\phi - c_\psi s_\theta s_\phi
\end{aligned}$$

---

## 9.5 Extracting Euler Angles from Quaternions (with Singularity Clamping)

To extract $(\phi, \theta, \psi)$ from a unit quaternion $q = (w, x, y, z)$, we equate the quaternion rotation matrix $\mathbf{R}(q)$ with the symbolic $Z-Y-X$ Euler rotation matrix $\mathbf{R}_{zyx}(\psi, \theta, \phi)$:

$$\mathbf{R}_{zyx} = \begin{bmatrix}
\cos\psi\cos\theta & \cos\psi\sin\theta\sin\phi - \sin\psi\cos\phi & \cos\psi\sin\theta\cos\phi + \sin\psi\sin\phi \\
\sin\psi\cos\theta & \sin\psi\sin\theta\sin\phi + \cos\psi\cos\phi & \sin\psi\sin\theta\cos\phi - \cos\psi\sin\phi \\
-\sin\theta & \cos\theta\sin\phi & \cos\theta\cos\phi
\end{bmatrix}$$

From $\mathbf{R}(q)$, the third row first column element is:
$$R_{31} = 2(xz - wy)$$
Equating to $\mathbf{R}_{zyx}$:
$$-\sin\theta = 2(xz - wy) \implies \sin\theta = 2(wy - xz)$$

### The Pitch Angle and the Gimbal Lock Singularity
$$\theta = \arcsin(2(wy - xz))$$

#### Critical Numerical Defense:
Due to floating-point truncation, the term $2(wy - xz)$ can evaluate to $1.0000001$ or $-1.0000001$. Calling `Math.asin(1.0000001)` returns `NaN`. Therefore, we **must clamp** the argument:
$$\tau = \text{clamp}(2(wy - xz), -1.0, 1.0)$$

#### Gimbal Lock Detection ($|\tau| \approx 1$):
When $\theta \to \pm \frac{\pi}{2}$ ($\pm 90^\circ$), $\cos\theta = 0$. The roll ($\phi$) and yaw ($\psi$) axes become collinear.
- **Case $\tau \ge 0.99999$ (North Pole Lock, Pitch = $+90^\circ$):**
  We set $\phi = 0$ (arbitrary gauge choice) and solve for yaw:
  $$\psi = 2 \text{atan2}(z, w)$$
  $$\theta = +\frac{\pi}{2}$$
  $$\phi = 0$$

- **Case $\tau \le -0.99999$ (South Pole Lock, Pitch = $-90^\circ$):**
  $$\psi = -2 \text{atan2}(z, w)$$
  $$\theta = -\frac{\pi}{2}$$
  $$\phi = 0$$

- **Standard Unlocked Case ($|\tau| < 0.99999$):**
  $$\theta = \arcsin(\tau)$$
  $$\phi = \text{atan2}(2(wy + yz), 1 - 2(x^2 + y^2))$$
  $$\psi = \text{atan2}(2(wz + xy), 1 - 2(y^2 + z^2))$$

---

## 9.6 Axis-Angle to and from Quaternions

### Axis-Angle to Quaternion
Given a rotation angle $\theta \in [0, 2\pi)$ and a unit rotation axis $\hat{\mathbf{n}} = (n_x, n_y, n_z)$ with $\|\hat{\mathbf{n}}\| = 1$:
$$q = \left(\cos\frac{\theta}{2}, \; \hat{\mathbf{n}}\sin\frac{\theta}{2}\right) = \begin{bmatrix} \cos(\theta/2) \\ n_x \sin(\theta/2) \\ n_y \sin(\theta/2) \\ n_z \sin(\theta/2) \end{bmatrix}$$

### Quaternion to Axis-Angle
Given a unit quaternion $q = (w, x, y, z)$ with $w \in [-1, 1]$:
1. Ensure $w \ge 0$ (if $w < 0$, negate $q \to -q$ to take the canonical shortest arc $\theta \le \pi$).
2. The angle is:
   $$\theta = 2 \arccos(w)$$
3. The axis is obtained from the vector part $\mathbf{v} = (x, y, z)$:
   $$\sin\frac{\theta}{2} = \sqrt{1 - w^2} = \|\mathbf{v}\|$$
   - If $\|\mathbf{v}\| < 10^{-7}$ ($\theta \approx 0$, identity rotation):
     $$\hat{\mathbf{n}} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \theta = 0$$
   - Otherwise:
     $$\hat{\mathbf{n}} = \frac{\mathbf{v}}{\|\mathbf{v}\|} = \begin{bmatrix} x / \sin(\theta/2) \\ y / \sin(\theta/2) \\ z / \sin(\theta/2) \end{bmatrix}$$

---

## 9.7 10 Step-by-Step Worked Examples

### Worked Example 9.1: Quaternion to Rotation Matrix for a Pure $90^\circ$ Z-Rotation
**Problem:** Let $q$ represent a rotation of $90^\circ$ around the $Z$-axis. Compute $q$, and convert it to a $3 \times 3$ rotation matrix using the polynomial formula.
**Solution:**
1. Angle $\theta = \frac{\pi}{2}$, axis $\hat{\mathbf{n}} = (0, 0, 1)$.
   $$w = \cos\frac{\pi}{4} = \frac{\sqrt{2}}{2} \approx 0.7071068$$
   $$\mathbf{v} = (0, 0, 1)\sin\frac{\pi}{4} = \left(0, 0, \frac{\sqrt{2}}{2}\right)$$
   So $q = \left(\frac{\sqrt{2}}{2}, 0, 0, \frac{\sqrt{2}}{2}\right)$.
2. Calculate squares and products:
   $$w^2 = 0.5, \quad x = 0, \quad y = 0, \quad z = \frac{\sqrt{2}}{2}, \quad z^2 = 0.5$$
   $$wz = \left(\frac{\sqrt{2}}{2}\right)\left(\frac{\sqrt{2}}{2}\right) = 0.5$$
   All terms involving $x$ or $y$ are zero.
3. Compute matrix elements:
   $$R_{11} = 1 - 2(y^2 + z^2) = 1 - 2(0 + 0.5) = 0$$
   $$R_{12} = 2(xy - wz) = 2(0 - 0.5) = -1$$
   $$R_{13} = 2(xz + wy) = 0$$
   $$R_{21} = 2(xy + wz) = 2(0 + 0.5) = +1$$
   $$R_{22} = 1 - 2(x^2 + z^2) = 1 - 2(0 + 0.5) = 0$$
   $$R_{23} = 2(yz - wx) = 0$$
   $$R_{33} = 1 - 2(x^2 + y^2) = 1 - 0 = 1$$
4. Matrix:
   $$\mathbf{R} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   This matches the standard 2D rotation matrix rotated into 3D.

---

### Worked Example 9.2: Converting a $180^\circ$ Rotation Matrix to a Quaternion via Shepperd's Algorithm
**Problem:** Given the $180^\circ$ rotation matrix around the $X$-axis:
$$\mathbf{R} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
Extract the unit quaternion $q$ using Shepperd's algorithm. Show why the naive trace method fails.
**Solution:**
1. Check the trace:
   $$\text{tr}(\mathbf{R}) = 1 + (-1) + (-1) = -1$$
   Under the naive trace formula: $w = \frac{1}{2}\sqrt{1 + \text{tr}(\mathbf{R})} = \frac{1}{2}\sqrt{1 - 1} = 0$.
   The divisor $4w = 0$, causing a division-by-zero crash when attempting to solve for $x, y, z$.
2. Shepperd's algorithm:
   Since $\text{tr}(\mathbf{R}) \le 0$, we find the maximum diagonal element.
   $R_{11} = 1, R_{22} = -1, R_{33} = -1$.
   The maximum diagonal element is $R_{11}$. We take Branch 1 ($x$ dominant).
3. Compute scale factor $S$:
   $$S = 2\sqrt{1 + R_{11} - R_{22} - R_{33}} = 2\sqrt{1 + 1 - (-1) - (-1)} = 2\sqrt{4} = 4.0$$
4. Compute components:
   $$x = \frac{S}{4} = \frac{4.0}{4} = 1.0$$
   $$w = \frac{R_{32} - R_{23}}{S} = \frac{0 - 0}{4} = 0.0$$
   $$y = \frac{R_{12} + R_{21}}{S} = \frac{0 + 0}{4} = 0.0$$
   $$z = \frac{R_{13} + R_{31}}{S} = \frac{0 + 0}{4} = 0.0$$
5. Result: $q = (0, 1, 0, 0)$.
   Verification: A $180^\circ$ rotation around $\hat{\mathbf{x}}$ has $\cos(90^\circ) = 0$ and $\hat{\mathbf{x}}\sin(90^\circ) = (1, 0, 0)$. Exact match.

---

### Worked Example 9.3: Converting Euler Angles to a Quaternion
**Problem:** A flight vehicle has Yaw $\psi = 90^\circ$ ($\frac{\pi}{2}$), Pitch $\theta = 0^\circ$, and Roll $\phi = 45^\circ$ ($\frac{\pi}{4}$). Calculate its attitude quaternion $q$.
**Solution:**
1. Half-angles:
   $$\frac{\psi}{2} = 45^\circ \implies c_\psi = \frac{\sqrt{2}}{2}, \quad s_\psi = \frac{\sqrt{2}}{2}$$
   $$\frac{\theta}{2} = 0^\circ \implies c_\theta = 1, \quad s_\theta = 0$$
   $$\frac{\phi}{2} = 22.5^\circ \implies c_\phi = \cos(22.5^\circ) \approx 0.92388, \quad s_\phi = \sin(22.5^\circ) \approx 0.38268$$
2. Evaluate components:
   $$w = c_\psi c_\theta c_\phi + s_\psi s_\theta s_\phi = (0.70711)(1)(0.92388) + 0 = 0.65328$$
   $$x = c_\psi c_\theta s_\phi - s_\psi s_\theta c_\phi = (0.70711)(1)(0.38268) - 0 = 0.27060$$
   $$y = c_\psi s_\theta c_\phi + s_\psi c_\theta s_\phi = 0 + (0.70711)(1)(0.38268) = 0.27060$$
   $$z = s_\psi c_\theta c_\phi - c_\psi s_\theta s_\phi = (0.70711)(1)(0.92388) - 0 = 0.65328$$
3. Result: $q \approx (0.65328, 0.27060, 0.27060, 0.65328)$.
4. Norm check:
   $$\|q\|^2 = (0.65328)^2 + (0.27060)^2 + (0.27060)^2 + (0.65328)^2 = 0.42677 + 0.07323 + 0.07323 + 0.42677 = 1.00000$$

---

### Worked Example 9.4: Extracting Euler Angles in a Gimbal Lock Configuration
**Problem:** Given the quaternion $q = (0.7071068, 0, 0.7071068, 0)$, extract the Euler angles $(\phi, \theta, \psi)$.
**Solution:**
1. Compute the test parameter $\tau = 2(wy - xz)$:
   $$\tau = 2((0.7071068)(0.7071068) - (0)(0)) = 2(0.5) = 1.0$$
2. Since $\tau \ge 0.99999$, we are in a state of **Positive Gimbal Lock** ($\theta = +90^\circ$).
3. Apply singularity handler:
   $$\theta = +\frac{\pi}{2} = +90^\circ$$
   Set roll $\phi = 0^\circ$.
   Compute yaw $\psi = 2\text{atan2}(z, w) = 2\text{atan2}(0, 0.7071068) = 0^\circ$.
4. Result: $(\phi, \theta, \psi) = (0^\circ, +90^\circ, 0^\circ)$.

---

### Worked Example 9.5: Axis-Angle Extraction from a General Quaternion
**Problem:** Given $q = (0.5, 0.5, 0.5, 0.5)$, determine the rotation angle $\theta$ and the unit rotation axis $\hat{\mathbf{n}}$.
**Solution:**
1. Check norm: $0.5^2 + 0.5^2 + 0.5^2 + 0.5^2 = 4(0.25) = 1.0$.
2. Rotation angle:
   $$\theta = 2\arccos(w) = 2\arccos(0.5) = 2\left(\frac{\pi}{3}\right) = \frac{2\pi}{3} = 120^\circ$$
3. Rotation axis:
   $$\sin\frac{\theta}{2} = \sin(60^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$$
   $$\hat{\mathbf{n}} = \frac{\mathbf{v}}{\sin(\theta/2)} = \frac{(0.5, 0.5, 0.5)}{\sqrt{3}/2} = \frac{1}{\sqrt{3}}(1, 1, 1) \approx (0.57735, 0.57735, 0.57735)$$
4. Result: Rotation of $120^\circ$ around the diagonal axis $\frac{1}{\sqrt{3}}\begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.

---

### Worked Example 9.6: Matrix Conversion for a General $45^\circ$ Rotation
**Problem:** Let $q$ represent a rotation of $60^\circ$ around $\hat{\mathbf{y}} = (0, 1, 0)$. Compute $q$ and construct its $3 \times 3$ rotation matrix.
**Solution:**
1. $\theta = \frac{\pi}{3} \implies \frac{\theta}{2} = \frac{\pi}{6}$.
   $$w = \cos(\pi/6) = \frac{\sqrt{3}}{2} \approx 0.86603, \quad y = \sin(\pi/6) = 0.5, \quad x = 0, \quad z = 0$$
   $$q = \left(\frac{\sqrt{3}}{2}, 0, 0.5, 0\right)$$
2. Squares and products:
   $$y^2 = 0.25, \quad wy = 0.86603 \times 0.5 = 0.433013$$
   All terms in $x, z$ are 0.
3. Matrix:
   $$R_{11} = 1 - 2(y^2 + z^2) = 1 - 2(0.25) = 0.5$$
   $$R_{12} = 0, \quad R_{13} = 2(xz + wy) = 2(0.433013) = 0.866025 = \frac{\sqrt{3}}{2}$$
   $$R_{21} = 0, \quad R_{22} = 1 - 0 = 1.0, \quad R_{23} = 0$$
   $$R_{31} = 2(xz - wy) = -2(0.433013) = -0.866025 = -\frac{\sqrt{3}}{2}$$
   $$R_{32} = 0, \quad R_{33} = 1 - 2(x^2 + y^2) = 0.5$$
4. Result:
   $$\mathbf{R} = \begin{bmatrix} 0.5 & 0 & 0.866025 \\ 0 & 1 & 0 \\ -0.866025 & 0 & 0.5 \end{bmatrix} = \begin{bmatrix} \cos 60^\circ & 0 & \sin 60^\circ \\ 0 & 1 & 0 \\ -\sin 60^\circ & 0 & \cos 60^\circ \end{bmatrix}$$

---

### Worked Example 9.7: Matrix Inversion via Quaternion Conjugation
**Problem:** A camera has orientation $q = (0.8, 0, 0.6, 0)$. Compute its rotation matrix $\mathbf{R}$, invert $\mathbf{R}$ directly, and verify that $\mathbf{R}^{-1} = \mathbf{R}(q^*)$.
**Solution:**
1. $q = (0.8, 0, 0.6, 0)$. $w = 0.8, y = 0.6, x = 0, z = 0$.
   $$w^2 + y^2 = 0.64 + 0.36 = 1.0$$
   Matrix:
   $$R_{11} = 1 - 2(0.36) = 0.28, \quad R_{13} = 2(wy) = 2(0.48) = 0.96$$
   $$R_{31} = -0.96, \quad R_{33} = 0.28, \quad R_{22} = 1.0$$
   $$\mathbf{R} = \begin{bmatrix} 0.28 & 0 & 0.96 \\ 0 & 1 & 0 \\ -0.96 & 0 & 0.28 \end{bmatrix}$$
2. The transpose $\mathbf{R}^T$ (since $\mathbf{R} \in SO(3)$, $\mathbf{R}^{-1} = \mathbf{R}^T$):
   $$\mathbf{R}^{-1} = \begin{bmatrix} 0.28 & 0 & -0.96 \\ 0 & 1 & 0 \\ 0.96 & 0 & 0.28 \end{bmatrix}$$
3. Conjugate $q^* = (0.8, 0, -0.6, 0)$.
   Evaluating $\mathbf{R}(q^*)$:
   $R_{13} = 2(w(-y)) = -0.96$, $R_{31} = -2(w(-y)) = +0.96$.
   All diagonal terms remain unchanged.
   Thus $\mathbf{R}(q^*) = \mathbf{R}^{-1}$.

---

### Worked Example 9.8: Shepperd's Algorithm on a Degenerate $Z$-Axis Dominant Matrix
**Problem:** Given the rotation matrix:
$$\mathbf{R} = \begin{bmatrix} -0.8 & -0.6 & 0 \\ 0.6 & -0.8 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
Extract the unit quaternion using Shepperd's algorithm.
**Solution:**
1. Trace: $\text{tr}(\mathbf{R}) = -0.8 - 0.8 + 1 = -0.6 \le 0$.
2. Diagonals: $R_{11} = -0.8, R_{22} = -0.8, R_{33} = 1.0$.
   The maximum diagonal is $R_{33}$. We select **Branch 3 ($z$ dominant)**.
3. Compute scale factor $S$:
   $$S = 2\sqrt{1 - R_{11} - R_{22} + R_{33}} = 2\sqrt{1 - (-0.8) - (-0.8) + 1.0} = 2\sqrt{3.6} = 2(1.8973666) \approx 3.794733$$
4. Compute components:
   $$z = \frac{S}{4} = \frac{3.794733}{4} \approx 0.948683$$
   $$w = \frac{R_{21} - R_{12}}{S} = \frac{0.6 - (-0.6)}{3.794733} = \frac{1.2}{3.794733} \approx 0.316228$$
   $$x = \frac{R_{13} + R_{31}}{S} = \frac{0 + 0}{S} = 0$$
   $$y = \frac{R_{23} + R_{32}}{S} = \frac{0 + 0}{S} = 0$$
5. Result: $q = (0.316228, 0, 0, 0.948683)$.
6. Verification:
   $$w^2 + z^2 = 0.316228^2 + 0.948683^2 = 0.1 + 0.9 = 1.0$$
   Angle: $w = \cos(\theta/2) = \frac{1}{\sqrt{10}} \implies \theta = 2\arccos(1/\sqrt{10}) \approx 143.13^\circ$.
   $\cos\theta = \cos^2(\theta/2) - \sin^2(\theta/2) = 0.1 - 0.9 = -0.8$.
   $\sin\theta = 2\sin(\theta/2)\cos(\theta/2) = 2(\sqrt{0.9}\sqrt{0.1}) = 2(0.3) = 0.6$. Exact match.

---

### Worked Example 9.9: Round-Trip Conversion Accuracy and Numerical Drift
**Problem:** Start with Euler angles $(\phi, \theta, \psi) = (30^\circ, 45^\circ, 60^\circ)$. Convert to a quaternion $q$, then to a rotation matrix $\mathbf{R}$, then extract the quaternion $q'$, and finally extract the Euler angles. Calculate the cumulative numerical deviation.
**Solution:**
1. Angles in radians:
   $$\phi = \pi/6 \approx 0.523599, \quad \theta = \pi/4 \approx 0.785398, \quad \psi = \pi/3 \approx 1.047198$$
2. Euler to Quaternion:
   $$c_\psi = 0.866025, s_\psi = 0.5; \quad c_\theta = 0.923880, s_\theta = 0.382683; \quad c_\phi = 0.965926, s_\phi = 0.258819$$
   $$w = (0.866025)(0.923880)(0.965926) + (0.5)(0.382683)(0.258819) = 0.772866 + 0.049526 = 0.822392$$
   $$x = (0.866025)(0.923880)(0.258819) - (0.5)(0.382683)(0.965926) = 0.207085 - 0.184824 = 0.022261$$
   $$y = (0.866025)(0.382683)(0.965926) + (0.5)(0.923880)(0.258819) = 0.320121 + 0.119558 = 0.439679$$
   $$z = (0.5)(0.923880)(0.965926) - (0.866025)(0.382683)(0.258819) = 0.446198 - 0.085777 = 0.360421$$
   $$q = (0.822392, 0.022261, 0.439679, 0.360421)$$
3. Quaternion to Matrix:
   $$\text{tr}(\mathbf{R}) = 4w^2 - 1 = 4(0.822392)^2 - 1 = 4(0.676329) - 1 = 1.705315 > 0$$
4. Matrix to Quaternion (Shepperd Branch 0):
   $$S = 2\sqrt{1 + 1.705315} = 2(1.644784) = 3.289568$$
   $$w' = \frac{3.289568}{4} = 0.822392$$
   All components match to 6 decimal places ($|q - q'| < 10^{-7}$).
5. Quaternion to Euler:
   $$\tau = 2(wy - xz) = 2((0.822392)(0.439679) - (0.022261)(0.360421)) = 2(0.361589 - 0.008023) = 0.707132 \approx \frac{\sqrt{2}}{2}$$
   $$\theta' = \arcsin(0.707132) = 45.002^\circ$$
   Accumulated angular deviation is $< 0.002^\circ$, proving numerical stability.

---

### Worked Example 9.10: Unwinding Negative Quaternions
**Problem:** In a physics engine, consecutive integration steps produce $q_1 = (0.7071, 0, 0.7071, 0)$ and $q_2 = (-0.7070, 0, -0.7072, 0)$. Explain why these represent identical orientations, how to detect the antipodal ambiguity, and how to normalize the sequence.
**Solution:**
1. Dual representation: $q$ and $-q$ define identical spatial transformations because $(-q)\mathbf{p}(-q)^* = (-1)^2 (q\mathbf{p}q^*) = q\mathbf{p}q^*$.
2. To detect whether $q_2$ has flipped hemispheres relative to $q_1$, evaluate their 4D dot product:
   $$q_1 \cdot q_2 = (0.7071)(-0.7070) + 0 + (0.7071)(-0.7072) + 0 = -0.4999 - 0.5001 = -1.0000$$
3. Since $q_1 \cdot q_2 < 0$, the orientation has flipped across the antipodal boundary on $\mathbb{S}^3$.
4. Unwinding: Negate all components of $q_2$:
   $$q_2' = -q_2 = (0.7070, 0, 0.7072, 0)$$
5. Now $q_1 \cdot q_2' = +1.0000$, ensuring smooth interpolation and continuous kinematic state evolution.

---

## 9.8 10 Granular Solved Exercises

### Exercise 9.1
**Problem:** Write down the explicit $3 \times 3$ rotation matrix corresponding to the quaternion $q = \left(\frac{1}{2}, \frac{1}{2}, \frac{1}{2}, \frac{1}{2}\right)$.
**Solution:**
1. Notice $w = x = y = z = 0.5$.
2. Diagonal elements:
   $$R_{11} = 1 - 2(y^2 + z^2) = 1 - 2(0.25 + 0.25) = 0$$
   $$R_{22} = 1 - 2(x^2 + z^2) = 0$$
   $$R_{33} = 1 - 2(x^2 + y^2) = 0$$
3. Off-diagonal elements:
   $$xy = yz = xz = wz = wx = wy = 0.25$$
   $$R_{12} = 2(xy - wz) = 2(0.25 - 0.25) = 0$$
   $$R_{13} = 2(xz + wy) = 2(0.25 + 0.25) = 1$$
   $$R_{21} = 2(xy + wz) = 2(0.25 + 0.25) = 1$$
   $$R_{23} = 2(yz - wx) = 2(0.25 - 0.25) = 0$$
   $$R_{31} = 2(xz - wy) = 2(0.25 - 0.25) = 0$$
   $$R_{32} = 2(yz + wx) = 2(0.25 + 0.25) = 1$$
4. Assembled matrix:
   $$\mathbf{R} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$
   This is a cyclic permutation matrix representing a $120^\circ$ rotation mapping $\mathbf{x} \to \mathbf{y} \to \mathbf{z} \to \mathbf{x}$.

---

### Exercise 9.2
**Problem:** Given the rotation matrix $\mathbf{R} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$, extract the unit quaternion using Shepperd's algorithm.
**Solution:**
1. Trace: $\text{tr}(\mathbf{R}) = 0 + 0 + 0 = 0 \le 0$.
2. Diagonals: $R_{11} = 0, R_{22} = 0, R_{33} = 0$.
   All diagonal elements are equal to 0. Any of branches 1, 2, or 3 may be chosen. Select Branch 1 ($x$ dominant).
3. Scale factor $S$:
   $$S = 2\sqrt{1 + R_{11} - R_{22} - R_{33}} = 2\sqrt{1 + 0 - 0 - 0} = 2.0$$
4. Components:
   $$x = \frac{S}{4} = \frac{2}{4} = 0.5$$
   $$w = \frac{R_{32} - R_{23}}{S} = \frac{1 - 0}{2} = 0.5$$
   $$y = \frac{R_{12} + R_{21}}{S} = \frac{0 + 1}{2} = 0.5$$
   $$z = \frac{R_{13} + R_{31}}{S} = \frac{1 + 0}{2} = 0.5$$
5. Result: $q = (0.5, 0.5, 0.5, 0.5)$. Exactly inverts Exercise 9.1.

---

### Exercise 9.3
**Problem:** Prove that for any unit quaternion $q$, $\det(\mathbf{R}(q)) = 1$.
**Solution:**
1. A rotation matrix $\mathbf{R}(q)$ represents the linear operator $L_q(\mathbf{u}) = \mathcal{V}(q \mathbf{p}_{\mathbf{u}} q^*)$.
2. For any two vectors $\mathbf{u}_1, \mathbf{u}_2 \in \mathbb{R}^3$, the quaternionic inner product satisfies:
   $$\langle L_q(\mathbf{u}_1), L_q(\mathbf{u}_2) \rangle = \mathbf{u}_1 \cdot \mathbf{u}_2$$
   Thus $L_q$ is an orthogonal transformation: $\mathbf{R}^T \mathbf{R} = \mathbf{I}$, which implies $\det(\mathbf{R}) = \pm 1$.
3. The space of unit quaternions $\mathbb{S}^3$ is connected.
4. The map $f: \mathbb{S}^3 \to \mathbb{R}$ defined by $f(q) = \det(\mathbf{R}(q))$ is continuous.
5. At the identity quaternion $q = (1, 0, 0, 0)$, $\mathbf{R}(q) = \mathbf{I}_3$, so $\det(\mathbf{I}_3) = +1$.
6. Since $\det(\mathbf{R}(q))$ can only take values in $\{-1, +1\}$ and $\mathbb{S}^3$ is connected, the image must be connected. Therefore, $\det(\mathbf{R}(q)) = +1$ for all $q \in \mathbb{S}^3$.

---

### Exercise 9.4
**Problem:** Derive the conversion from a unit quaternion to Euler angles for the alternative **$X-Y-Z$ (Pitch-Yaw-Roll)** intrinsic convention.
**Solution:**
1. Sequence: $q = q_x(\phi) q_y(\theta) q_z(\psi)$.
2. The symbolic rotation matrix $\mathbf{R}_{xyz} = \mathbf{R}_x(\phi)\mathbf{R}_y(\theta)\mathbf{R}_z(\psi)$ has element:
   $$R_{13} = \sin\theta$$
3. From $\mathbf{R}(q)$:
   $$R_{13} = 2(xz + wy)$$
4. Therefore:
   $$\sin\theta = 2(xz + wy) \implies \theta = \arcsin(\text{clamp}(2(xz + wy), -1, 1))$$
5. Off-diagonal elements give:
   $$\phi = \text{atan2}(-2(yz - wx), 1 - 2(x^2 + y^2))$$
   $$\psi = \text{atan2}(-2(xy - wz), 1 - 2(y^2 + z^2))$$

---

### Exercise 9.5
**Problem:** In a robotics simulator, a matrix $\mathbf{M}$ is computed from numerical integration:
$$\mathbf{M} = \begin{bmatrix} 0.9998 & 0.0201 & 0.0000 \\ -0.0199 & 0.9996 & 0.0000 \\ 0.0000 & 0.0000 & 1.0002 \end{bmatrix}$$
Show how to extract a strictly normalized quaternion $q$ from $\mathbf{M}$ despite floating-point non-orthogonality.
**Solution:**
1. Trace: $\text{tr}(\mathbf{M}) = 0.9998 + 0.9996 + 1.0002 = 2.9996 > 0$.
2. Use Branch 0 of Shepperd's algorithm:
   $$S = 2\sqrt{1 + 2.9996} = 2\sqrt{3.9996} = 2(1.9998999) \approx 3.99980$$
   $$w = \frac{3.99980}{4} = 0.99995$$
   $$x = \frac{M_{32} - M_{23}}{S} = 0$$
   $$y = \frac{M_{13} - M_{31}}{S} = 0$$
   $$z = \frac{M_{21} - M_{12}}{S} = \frac{-0.0199 - 0.0201}{3.99980} = \frac{-0.0400}{3.99980} \approx -0.0100005$$
3. The raw quaternion is $q_{\text{raw}} = (0.99995, 0, 0, -0.0100005)$.
4. Renormalize:
   $$\|q_{\text{raw}}\|^2 = (0.99995)^2 + (-0.0100005)^2 = 0.99990 + 0.00010 = 1.00000$$
   $$q = \frac{q_{\text{raw}}}{\|q_{\text{raw}}\|} = (0.99995, 0, 0, -0.0100005)$$
   The resulting quaternion is guaranteed to be unit length and lie on $\mathbb{S}^3$, projecting the non-orthogonal matrix back onto $SO(3)$.

---

### Exercise 9.6
**Problem:** Given axis $\hat{\mathbf{n}} = (0, 1, 0)$ and angle $\theta = \pi$, compute $q$. What happens to the matrix if $q$ is negated to $-q$?
**Solution:**
1. $q = \left(\cos\frac{\pi}{2}, (0, 1, 0)\sin\frac{\pi}{2}\right) = (0, 0, 1, 0)$.
2. Matrix $\mathbf{R}(q)$:
   $$R_{11} = 1 - 2(1^2 + 0) = -1, \quad R_{22} = 1 - 2(0 + 0) = 1, \quad R_{33} = 1 - 2(0 + 1^2) = -1$$
   $$\mathbf{R}(q) = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
3. For $-q = (0, 0, -1, 0)$:
   In the matrix formula, every term is quadratic in components: $(-w)(-z) = wz$, $(-y)^2 = y^2$.
   Therefore, $\mathbf{R}(-q) \equiv \mathbf{R}(q)$. The matrix is strictly invariant under quaternion negation.

---

### Exercise 9.7
**Problem:** A physics engine represents angular velocity $\boldsymbol{\omega} = (0, 0, 10)\text{ rad/s}$. If the time-step is $\Delta t = 0.01\text{ s}$, compute the incremental rotation quaternion $\Delta q$.
**Solution:**
1. Rotation angle during time-step:
   $$\Delta\theta = \|\boldsymbol{\omega}\|\Delta t = (10)(0.01) = 0.1\text{ radians} \approx 5.7296^\circ$$
2. Rotation axis:
   $$\hat{\mathbf{n}} = \frac{\boldsymbol{\omega}}{\|\boldsymbol{\omega}\|} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Half-angle: $\frac{\Delta\theta}{2} = 0.05\text{ rad}$.
   $$\cos(0.05) \approx 0.998750, \quad \sin(0.05) \approx 0.049979$$
4. Incremental quaternion:
   $$\Delta q = (0.998750, 0, 0, 0.049979)$$

---

### Exercise 9.8
**Problem:** Show that extracting an axis-angle representation from $q = (w, x, y, z)$ has no ambiguity when $w \in [0, 1]$, but has an ambiguity if $w < 0$.
**Solution:**
1. The rotation angle is $\theta = 2\arccos(w)$.
2. Since $\arccos(w) \in [0, \pi]$, if $w \ge 0$, then $\arccos(w) \in [0, \frac{\pi}{2}]$, so $\theta \in [0, \pi]$. This represents the canonical shortest angular path.
3. If $w < 0$, then $\arccos(w) \in (\frac{\pi}{2}, \pi]$, which yields $\theta \in (\pi, 2\pi]$. This represents the longer rotation arc ($> 180^\circ$).
4. Replacing $q$ with $-q$ yields $-w > 0$, giving the equivalent physical rotation as $\theta' = 2\pi - \theta \le \pi$ around the opposite axis $-\hat{\mathbf{n}}$.
5. Therefore, checking $w \ge 0$ enforces the canonical single-cover shortest path.

---

### Exercise 9.9
**Problem:** In terms of operations, why is transforming a point $\mathbf{p}$ via matrix multiplication ($\mathbf{R}\mathbf{p}$) faster than quaternionic conjugation ($q\mathbf{p}q^*$) when transforming $1,000,000$ vertices?
**Solution:**
1. Matrix-vector multiplication $\mathbf{R}\mathbf{p}$:
   - 3 dot products of 3-element vectors: $3 \times 3 = 9$ multiplications and 6 additions per vertex.
2. Quaternion sandwich product $q\mathbf{p}q^*$:
   - Evaluating $\mathbf{p}' = \mathbf{p} + 2\mathbf{v} \times (\mathbf{v} \times \mathbf{p} + w\mathbf{p})$:
   - First cross product $\mathbf{t} = 2(\mathbf{v} \times \mathbf{p})$: 6 mults, 3 subs.
   - Second cross product $\mathbf{v} \times \mathbf{t}$: 6 mults, 3 subs.
   - Scaled addition $w\mathbf{t}$: 3 mults, 3 adds.
   - Total: 15 multiplications, 12 additions per vertex.
3. Converting $q \to \mathbf{R}$ once costs 9 multiplications and 12 additions.
4. For $N = 10^6$ vertices:
   - Matrix approach: $1 \times \text{convert} + 10^6 \times 9\text{ mults} \approx 9,000,012$ ops.
   - Direct quaternion approach: $10^6 \times 15\text{ mults} = 15,000,000$ ops.
5. The matrix approach is $\approx 40\%$ faster and maps directly onto GPU hardware SIMD dot-product units.

---

### Exercise 9.10
**Problem:** Calculate the Euler angle output for South Pole Gimbal Lock: $q = (0, 0.7071068, 0, 0.7071068)$.
**Solution:**
1. Evaluate test parameter $\tau = 2(wy - xz)$:
   $$\tau = 2((0)(0) - (0.7071068)(0.7071068)) = 2(-0.5) = -1.0$$
2. Since $\tau \le -0.99999$, we are in **Negative Gimbal Lock** ($\theta = -90^\circ$).
3. Pitch is $\theta = -\frac{\pi}{2} = -90^\circ$.
4. Set roll $\phi = 0^\circ$.
5. Compute yaw $\psi = -2\text{atan2}(z, x) = -2\text{atan2}(0.7071068, 0.7071068) = -2(45^\circ) = -90^\circ$.
6. Output: $(\phi, \theta, \psi) = (0^\circ, -90^\circ, -90^\circ)$.
