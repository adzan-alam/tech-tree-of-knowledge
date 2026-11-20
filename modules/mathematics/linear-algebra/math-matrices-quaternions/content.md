# Matrices, Spatial Transformations, and Quaternions

---

## 1. The Epistemological Challenge: Representing 3D Orientation

### 1.1 The Pitfalls of Euler Angles & The Disaster of Gimbal Lock
In 1770, Leonhard Euler proved that any arbitrary 3D rotation can be represented as a sequence of three successive rotations around coordinate axes—commonly known in aerospace and robotics as **Yaw ($\psi$, around Z), Pitch ($\theta$, around Y), and Roll ($\phi$, around X)**.

While intuitive for human pilots, Euler angles suffer from a fatal geometric catastrophe known as **Gimbal Lock**:

```
        Outer Ring (Yaw)
       ┌────────────────────────┐
       │   Middle Ring (Pitch)  │
       │  ┌──────────────────┐  │
       │  │ Inner Ring (Roll)│  │
       │  │  ┌────────────┐  │  │
       │  │  │   OBJECT   │  │  │
       │  │  └────────────┘  │  │
       │  └──────────────────┘  │
       └────────────────────────┘
```

When the pitch angle reaches $\pm 90^\circ$ (pointing directly straight up or straight down), the outer ring (yaw) and inner ring (roll) become **coplanar**. Their axes of rotation align! The system instantly loses one whole degree of freedom ($3 \to 2$). A physical gyroscope freezes, and spacecraft flight computers running Euler angles crash because the inverse trigonometric mapping becomes mathematically singular ($0/0$).

During the Apollo 11 moon landing in 1969, astronaut Mike Collins famously joked about the inertial measurement unit: *"How about sending me a fourth gimbal for Christmas?"*

### 1.2 The Hamilton Breakthrough (1843)
On October 16, 1843, while walking along the Royal Canal in Dublin with his wife, Irish mathematician **Sir William Rowan Hamilton** realized that 3D rotations could be smoothly and singulary-free represented by stepping into a **four-dimensional hypercomplex number system**: the **Quaternions** ($\mathbb{H}$).

Hamilton was so elated that he carved the fundamental formula into the stone of Brougham Bridge:
$$ \mathbf{i^2 = j^2 = k^2 = ijk = -1} $$

---

## 2. 4x4 Homogeneous Transformation Matrices

In 3D simulation and computer graphics, an object undergoes both linear transformations (rotation, scaling) and non-linear affine shifts (**translation**).

### 2.1 The Homogeneous Coordinate Trick
A 3D point $\vec{p} = (x, y, z)$ cannot be translated via standard $3 \times 3$ matrix multiplication, because matrix multiplication is linear ($M \cdot \vec{0} = \vec{0}$), whereas translation moves the origin ($\vec{0} \mapsto \vec{t}$).

We lift 3D space into a 4D projective space by appending a fourth homogeneous coordinate $w$:
$$ \mathbf{\tilde{p} = \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}} $$
- For spatial **points**: $w = 1$ (affected by translations).
- For directional **vectors**: $w = 0$ (invariant to translations; only rotated and scaled).

### 2.2 The General 4x4 Affine Matrix
$$ T = \begin{bmatrix}
R_{00} & R_{01} & R_{02} & t_x \\
R_{10} & R_{11} & R_{12} & t_y \\
R_{20} & R_{21} & R_{22} & t_z \\
0 & 0 & 0 & 1
\end{bmatrix} $$
where $R$ is the $3 \times 3$ rotation-scale block, and $\vec{t} = (t_x, t_y, t_z)$ is the translation vector.

Transforming a point is a single matrix-vector multiplication:
$$ \tilde{p}' = T \tilde{p} $$

Combining transformations is simply matrix multiplication (executed right-to-left):
$$ T_{\text{composite}} = T_{\text{translate}} \cdot T_{\text{rotate}} \cdot T_{\text{scale}} $$

---

## 3. Quaternions: The Algebra of 4D Rotational Symmetry

A quaternion $q \in \mathbb{H}$ consists of a scalar (real) component $w$ and a 3D vector (imaginary) component $\vec{v} = (x, y, z)$:
$$ q = w + x\mathbf{i} + y\mathbf{j} + z\mathbf{k} = [w, \vec{v}] $$

### 3.1 The Hamilton Product (Quaternion Multiplication)
Given two quaternions $q_1 = [w_1, \vec{v}_1]$ and $q_2 = [w_2, \vec{v}_2]$:
Using the rules $\mathbf{i}^2 = \mathbf{j}^2 = \mathbf{k}^2 = -1$ and $\mathbf{i}\mathbf{j} = \mathbf{k} = -\mathbf{j}\mathbf{i}$:

$$ \mathbf{q_1 q_2 = [w_1 w_2 - \vec{v}_1 \cdot \vec{v}_2, \quad w_1 \vec{v}_2 + w_2 \vec{v}_1 + \vec{v}_1 \times \vec{v}_2]} $$
*Notice:* The cross product term $\vec{v}_1 \times \vec{v}_2$ makes quaternion multiplication non-commutative ($q_1 q_2 \neq q_2 q_1$), mirroring physical 3D rotations!

### 3.2 Conjugate, Norm, and Inverse
- **Conjugate:** $q^* = [w, -\vec{v}] = w - xi - yj - zk$
- **Norm:** $\|q\| = \sqrt{w^2 + x^2 + y^2 + z^2}$
- **Unit Quaternion:** A quaternion with $\|q\| = 1$. The set of unit quaternions forms the 3-sphere $S^3$.
- **Inverse:** $q^{-1} = \frac{q^*}{\|q\|^2}$. For a unit quaternion, $q^{-1} = q^*$.

---

## 4. Representing 3D Rotations with Unit Quaternions

By Euler's Rotation Theorem, every 3D rotation can be expressed as a single angle of rotation $\theta$ around a unit axis $\hat{u} = (u_x, u_y, u_z)$.

### 4.1 The Axis-Angle to Quaternion Mapping
A unit quaternion encoding a rotation of angle $\theta$ around axis $\hat{u}$ is:
$$ \mathbf{q = \left[ \cos\left(\frac{\theta}{2}\right), \quad \hat{u} \sin\left(\frac{\theta}{2}\right) \right]} $$
Why the half-angle $\theta / 2$? Because quaternion rotation operates through a double-covering (spinor) space! Both $+q$ and $-q$ represent the exact same 3D spatial orientation.

### 4.2 The Sandwich Product: Rotating a Vector
To rotate a 3D vector $\vec{p}$:
1. Promote $\vec{p}$ to a pure imaginary quaternion $p = [0, \vec{p}]$.
2. Compute the **sandwich product**:
   $$ \mathbf{p' = q \cdot p \cdot q^*} $$
3. The rotated vector is the vector part of $p'$: $\vec{p}' = \text{vec}(p')$.

---

## 5. Spherical Linear Interpolation (SLERP)

When animating camera orientations, drone attitudes, or skeletal joints between orientation $q_1$ and $q_2$, naive linear interpolation (LERP):
$$ q_{\text{LERP}}(t) = (1 - t) q_1 + t q_2 $$
fails because it cuts through the interior of the 4D hypersphere, varying the angular velocity.

### 5.1 The SLERP Formula
**Ken Shoemake (1985)** introduced Spherical Linear Interpolation (SLERP), which glides along the great-circle arc of the 4-sphere at strictly **constant angular speed**:

$$ \mathbf{\text{SLERP}(q_1, q_2; t) = \frac{\sin((1 - t)\Omega)}{\sin\Omega} q_1 + \frac{\sin(t\Omega)}{\sin\Omega} q_2} $$
where $\cos\Omega = q_1 \cdot q_2 = w_1 w_2 + x_1 x_2 + y_1 y_2 + z_1 z_2$.

#### The Shortest Path Antipodal Check:
Because $q$ and $-q$ represent identical rotations, if the 4D dot product $q_1 \cdot q_2 < 0$, the interpolation would take the long way around the sphere ($> 180^\circ$).  
*Rule:* If $q_1 \cdot q_2 < 0$, invert one quaternion ($q_2 \gets -q_2$) before interpolating to ensure the shortest possible rotational path!

---

## 6. Multi-Tiered Worked Examples

### Level 1: Constructing a 4x4 Translation-Rotation Matrix
Construct a $4 \times 4$ transformation matrix that rotates an object by $90^\circ$ counter-clockwise around the Z-axis, and then translates it by $\vec{t} = (5, -2, 3)$.

**Step-by-step Solution:**
1. Rotation around Z by $90^\circ$ ($\cos 90^\circ = 0, \sin 90^\circ = 1$):
   $$ R_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} $$
2. Combined $4 \times 4$ homogeneous matrix:
   $$ T = \begin{bmatrix}
   0 & -1 & 0 & 5 \\
   1 & 0 & 0 & -2 \\
   0 & 0 & 1 & 3 \\
   0 & 0 & 0 & 1
   \end{bmatrix} $$
3. Transform local point $\vec{p} = (1, 0, 0)$:
   $$ \tilde{p}' = T \begin{bmatrix} 1 \\ 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0(1) - 1(0) + 0(0) + 5(1) \\ 1(1) + 0(0) + 0(0) - 2(1) \\ 0(1) + 0(0) + 1(0) + 3(1) \\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{5} \\ \mathbf{-1} \\ \mathbf{3} \\ 1 \end{bmatrix} $$

---

### Level 2: Quaternion Rotation of a 3D Vector
Rotate the vector $\vec{v} = (1, 0, 0)$ by $90^\circ$ around the Y-axis $\hat{u} = (0, 1, 0)$ using quaternion algebra.

**Step-by-step Solution:**
1. Form unit quaternion with $\theta = 90^\circ \implies \theta / 2 = 45^\circ$:
   $$ w = \cos(45^\circ) = \frac{\sqrt{2}}{2} \approx 0.7071 $$
   $$ \vec{v}_q = \hat{u} \sin(45^\circ) = (0, 1, 0) \times \frac{\sqrt{2}}{2} = (0, 0.7071, 0) $$
   $$ q = [0.7071, (0, 0.7071, 0)] $$
2. Pure vector quaternion: $p = [0, (1, 0, 0)]$.
3. Compute $q \cdot p$:
   $$ w_{\text{temp}} = 0.7071(0) - (0, 0.7071, 0) \cdot (1, 0, 0) = 0 - 0 = 0 $$
   $$ \vec{v}_{\text{temp}} = 0.7071(1, 0, 0) + 0 + (0, 0.7071, 0) \times (1, 0, 0) $$
   Cross product: $\hat{j} \times \hat{i} = -\hat{k} = (0, 0, -1)$.
   $$ \vec{v}_{\text{temp}} = (0.7071, 0, 0) + (0, 0, -0.7071) = (0.7071, 0, -0.7071) $$
   $$ q \cdot p = [0, (0.7071, 0, -0.7071)] $$
4. Multiply by conjugate $q^* = [0.7071, (0, -0.7071, 0)]$:
   $$ \vec{v}' = \vec{v}_{\text{temp}} \cdot 0.7071 + 0 - (0.7071, 0, -0.7071) \times (0, 0.7071, 0) $$
   Evaluating cross product:
   $$ \vec{v}' = (0.5, 0, -0.5) + (-0.5, 0, -0.5) = \mathbf{(0, 0, -1)} $$
The vector $(1, 0, 0)$ successfully rotated $90^\circ$ around Y to become $(0, 0, -1)$, exactly matching right-hand spatial geometry!

---

## 7. Production-Ready Computational Engine: Quaternion Class

```typescript
export class Quaternion {
  public w: number;
  public x: number;
  public y: number;
  public z: number;

  constructor(w = 1, x = 0, y = 0, z = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static fromAxisAngle(axisX: number, axisY: number, axisZ: number, angleRad: number): Quaternion {
    const halfAngle = angleRad * 0.5;
    const s = Math.sin(halfAngle);
    return new Quaternion(Math.cos(halfAngle), axisX * s, axisY * s, axisZ * s);
  }

  public multiply(q: Quaternion): Quaternion {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    );
  }

  public conjugate(): Quaternion {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }

  public normalize(): Quaternion {
    const mag = Math.hypot(this.w, this.x, this.y, this.z);
    if (mag < 1e-12) return new Quaternion(1, 0, 0, 0);
    const inv = 1 / mag;
    return new Quaternion(this.w * inv, this.x * inv, this.y * inv, this.z * inv);
  }

  /**
   * Spherical Linear Interpolation (SLERP) between q1 and q2 with parameter t in [0, 1].
   */
  public static slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
    let dot = q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
    let target = q2;

    // Shortest path antipodal flip
    if (dot < 0) {
      dot = -dot;
      target = new Quaternion(-q2.w, -q2.x, -q2.y, -q2.z);
    }

    if (dot > 0.9995) {
      // Linear fallback when angle is near zero to avoid division by zero
      return new Quaternion(
        q1.w + t * (target.w - q1.w),
        q1.x + t * (target.x - q1.x),
        q1.y + t * (target.y - q1.y),
        q1.z + t * (target.z - q1.z)
      ).normalize();
    }

    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);
    const w1 = Math.sin((1 - t) * theta) / sinTheta;
    const w2 = Math.sin(t * theta) / sinTheta;

    return new Quaternion(
      w1 * q1.w + w2 * target.w,
      w1 * q1.x + w2 * target.x,
      w1 * q1.y + w2 * target.y,
      w1 * q1.z + w2 * target.z
    );
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** Why do quaternions use 4 numbers to represent 3 degrees of rotational freedom?
   - **Answer:** By topology, the 3D rotation group $\text{SO}(3)$ cannot be parameterized globally by 3 parameters without encountering coordinate singularities (like gimbal lock). Embedding rotations on the surface of a 4D unit sphere ($S^3$) completely eliminates all singularities.
2. **Question:** Why do both $+q$ and $-q$ represent the exact same physical rotation in 3D space?
   - **Answer:** In the sandwich product $\vec{v}' = q \vec{v} q^*$, replacing $q$ with $-q$ introduces two negative signs: $(-q) \vec{v} (-q)^* = (-1)(-1) q \vec{v} q^* = q \vec{v} q^*$. The negative signs cancel out identically, proving $S^3$ is a double cover of $\text{SO}(3)$.
3. **Question:** What happens if you forget the shortest path antipodal check ($\text{dot} < 0$) in SLERP?
   - **Answer:** Instead of smoothly rotating through a small angle (e.g. $10^\circ$), the object will violently spin $350^\circ$ around in the opposite direction!
