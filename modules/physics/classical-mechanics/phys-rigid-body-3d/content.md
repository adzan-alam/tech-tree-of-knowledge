# 3D Rigid Body Dynamics, Inertia Tensors, and Angular Momentum

---

## 1. The Epistemological Leap: From Point Particles to Extended 3D Bodies

### 1.1 The Six Degrees of Freedom (6-DoF)
In foundational physics, objects are idealized as zero-dimensional point particles possessing only 3 translational degrees of freedom: position $\vec{x} = (x, y, z)$.

Real physical bodies—such as aircraft, planets, humanoid robot links, and tumbling spacecraft—are **extended rigid bodies**. A rigid body is an infinite collection of mass particles whose mutual distances remain strictly invariant under all forces. An extended 3D body possesses **6 Degrees of Freedom**:
- **3 Translational:** Moving along X, Y, Z.
- **3 Rotational:** Rotating around X (Roll), Y (Pitch), Z (Yaw).

Applying a force off-center causes not only linear acceleration, but also rotational twisting: **torque** ($\vec{\tau}$).

### 1.2 The Bizarre Phenomenon of the Tennis Racket Theorem (The Dzhanibekov Effect)
In 1985, Soviet cosmonaut Vladimir Dzhanibekov was aboard the Salyut 7 space station when he unscrewed a winged nut in zero gravity. As the nut floated spinning through the air, it suddenly flipped $180^\circ$ end-over-end, continued spinning, and then flipped back again in a rhythmic, perpetual cycle!

This phenomenon, known as the **Intermediate Axis Theorem**, baffled scientists who did not understand 3D rotational mechanics. It proved that in three dimensions, rotational inertia is not a simple scalar like mass—it is a **second-order symmetric tensor** ($3 \times 3$ matrix) with profound non-linear stability behaviors.

---

## 2. First-Principles Formalism: The 3x3 Inertia Tensor ($I$)

### 2.1 From Mass to Moment of Inertia
In linear motion, scalar mass $m$ resists change in linear velocity: $\vec{p} = m\vec{v}$.  
In rotational motion, the resistance to angular acceleration depends not just on *how much* mass exists, but on **how far that mass is distributed from the axis of rotation**.

For a continuous body of density $\rho(\vec{r})$, the angular momentum $\vec{L}$ relates to angular velocity $\vec{\omega}$ via a $3 \times 3$ matrix called the **Inertia Tensor** $I$:

$$ \mathbf{\vec{L} = I \vec{\omega}} $$

$$ I = \begin{bmatrix}
I_{xx} & I_{xy} & I_{xz} \\
I_{yx} & I_{yy} & I_{yz} \\
I_{zx} & I_{zy} & I_{zz}
\end{bmatrix} $$

### 2.2 Mathematical Formulas for Tensor Components
- **Principal Moments of Inertia (Diagonal Entries):**
  $$ I_{xx} = \int (y^2 + z^2) \, dm $$
  $$ I_{yy} = \int (x^2 + z^2) \, dm $$
  $$ I_{zz} = \int (x^2 + y^2) \, dm $$
- **Products of Inertia (Off-Diagonal Entries, Symmetric: $I_{ij} = I_{ji}$):**
  $$ I_{xy} = I_{yx} = -\int x y \, dm $$
  $$ I_{xz} = I_{zx} = -\int x z \, dm $$
  $$ I_{yz} = I_{zy} = -\int y z \, dm $$

### 2.3 Principal Axes of Inertia
Because $I$ is a real, symmetric matrix, the Spectral Theorem of linear algebra guarantees that there exists an orthogonal coordinate frame (the **Principal Axes of Inertia**) in which all off-diagonal products of inertia vanish:

$$ I_{\text{body}} = \begin{bmatrix}
I_1 & 0 & 0 \\
0 & I_2 & 0 \\
0 & 0 & I_3
\end{bmatrix} $$
where $I_1 \le I_2 \le I_3$ are the principal moments of inertia.

### 2.4 Canonical Moments of Inertia for Common Shapes
1. **Solid Box (Width $w$, Height $h$, Depth $d$, Mass $M$):**
   $$ I_{xx} = \frac{1}{12} M (h^2 + d^2), \quad I_{yy} = \frac{1}{12} M (w^2 + d^2), \quad I_{zz} = \frac{1}{12} M (w^2 + h^2) $$
2. **Solid Sphere (Radius $R$, Mass $M$):**
   $$ I_{xx} = I_{yy} = I_{zz} = \frac{2}{5} M R^2 $$
3. **Solid Cylinder (Radius $R$, Length $L$, Mass $M$, axis along Z):**
   $$ I_{zz} = \frac{1}{2} M R^2, \quad I_{xx} = I_{yy} = \frac{1}{12} M (3R^2 + L^2) $$

---

## 3. Kinematics of 3D Rotation: Angular Velocity & Quaternions

### 3.1 Angular Velocity ($\vec{\omega}$)
The vector $\vec{\omega} = (\omega_x, \omega_y, \omega_z)$ specifies both the instantaneous axis of rotation (unit direction $\hat{\omega}$) and the angular speed in radians per second ($\|\vec{\omega}\|$).

### 3.2 Time Derivative of Orientation Quaternion
As a rigid body rotates with angular velocity $\vec{\omega}$, its orientation quaternion $q = [w, \vec{v}]$ evolves according to the differential equation:

$$ \mathbf{\dot{q} = \frac{d q}{dt} = \frac{1}{2} \omega q} $$
where $\omega = [0, \vec{\omega}]$ is the pure quaternion formed from angular velocity.

---

## 4. Euler's Equations of Rotational Motion

In linear dynamics, $\vec{F} = \frac{d\vec{p}}{dt}$. In rotational dynamics, external torque $\vec{\tau} = \vec{r} \times \vec{F}$ equals the rate of change of angular momentum:
$$ \vec{\tau} = \frac{d\vec{L}}{dt} = \frac{d}{dt}(I \vec{\omega}) $$

Because the inertia tensor in world space rotates with the body ($I_{\text{world}} = R I_{\text{body}} R^T$), analyzing motion in an inertial frame is complex.  
In 1758, **Leonhard Euler** transformed the equations into the body's rotating principal axis frame:

$$ \mathbf{I_1 \dot{\omega}_1 + (I_3 - I_2) \omega_2 \omega_3 = \tau_1} $$
$$ \mathbf{I_2 \dot{\omega}_2 + (I_1 - I_3) \omega_3 \omega_1 = \tau_2} $$
$$ \mathbf{I_3 \dot{\omega}_3 + (I_2 - I_1) \omega_1 \omega_2 = \tau_3} $$

### 4.1 Proof of the Tennis Racket Theorem (Dzhanibekov Instability)
Consider a body in torque-free rotation ($\vec{\tau} = \vec{0}$) with distinct principal moments $I_1 < I_2 < I_3$.
1. **Rotation around Major Axis ($I_3$):** Stable perturbation. Small wobbles oscillate harmlessly.
2. **Rotation around Minor Axis ($I_1$):** Stable perturbation. Small wobbles oscillate harmlessly.
3. **Rotation around Intermediate Axis ($I_2$):** Perturbing $\omega_2$ yields a differential equation with **positive real eigenvalues**:
   $$ \ddot{\epsilon}_1 \propto \left[\frac{(I_2 - I_3)(I_1 - I_2)}{I_1 I_3}\right] \epsilon_1 > 0 $$
   Because $(I_2 - I_3) < 0$ and $(I_1 - I_2) < 0$, their product is strictly **positive**! Small deviations grow exponentially, causing the body to periodically flip $180^\circ$!

---

## 5. The Complete 3D Rigid Body Simulation Pipeline

In a modern 3D physics engine (like PhysX, Bullet, or Havok), each rigid body state is integrated each tick $\Delta t$:

```
 State Vector:
   Position r(t)      ∈ R^3
   Linear Momentum P  ∈ R^3
   Orientation q(t)   ∈ H (Unit Quaternion)
   Angular Momentum L ∈ R^3
        │
        ▼ (Accumulate External Forces & Torques)
   F_total = Σ F_i
   τ_total = Σ (r_i - R_cm) x F_i
        │
        ▼ (Linear Integration)
   P(t + dt) = P(t) + F_total * dt
   r(t + dt) = r(t) + (P / M) * dt
        │
        ▼ (Rotational Integration)
   L(t + dt) = L(t) + τ_total * dt
   Compute World Inertia: I_world^-1 = R · I_body^-1 · R^T
   ω(t + dt) = I_world^-1 · L(t + dt)
   q(t + dt) = normalize(q(t) + 0.5 * [0, ω] * q(t) * dt)
```

---

## 6. Multi-Tiered Worked Examples

### Level 1: Calculating the Inertia Tensor of a Brick
A solid uniform rectangular brick has mass $M = 6.0 \text{ kg}$, width $w = 0.2 \text{ m}$ (along X), height $h = 0.1 \text{ m}$ (along Y), and depth $d = 0.3 \text{ m}$ (along Z).
Calculate the principal moments of inertia $I_{xx}, I_{yy}, I_{zz}$ about its center of mass.

**Step-by-step Solution:**
$$ I_{xx} = \frac{1}{12} M (h^2 + d^2) = \frac{1}{12}(6.0)(0.1^2 + 0.3^2) = 0.5(0.01 + 0.09) = 0.5(0.10) = \mathbf{0.05 \text{ kg}\cdot\text{m}^2} $$
$$ I_{yy} = \frac{1}{12} M (w^2 + d^2) = \frac{1}{12}(6.0)(0.2^2 + 0.3^2) = 0.5(0.04 + 0.09) = 0.5(0.13) = \mathbf{0.065 \text{ kg}\cdot\text{m}^2} $$
$$ I_{zz} = \frac{1}{12} M (w^2 + h^2) = \frac{1}{12}(6.0)(0.2^2 + 0.1^2) = 0.5(0.04 + 0.01) = 0.5(0.05) = \mathbf{0.025 \text{ kg}\cdot\text{m}^2} $$
Because the brick has three distinct moments of inertia ($I_{zz} = 0.025 < I_{xx} = 0.05 < I_{yy} = 0.065$), spinning it around its intermediate X-axis will trigger the Dzhanibekov flip!

---

### Level 2: Gyroscopic Precession of a Spinning Wheel
A bicycle wheel with moment of inertia $I = 0.2 \text{ kg}\cdot\text{m}^2$ spins at high speed $\omega = 60 \text{ rad/s}$ around a horizontal axle supported at one end. The center of mass of the wheel is at distance $r = 0.15 \text{ m}$ from the pivot, and the wheel has mass $M = 2.0 \text{ kg}$. Gravity is $g = 9.8 \text{ m/s}^2$.
1. Compute the spin angular momentum $L$.
2. Compute the torque $\tau$ exerted by gravity.
3. Calculate the gyroscopic precession frequency $\Omega_p$.

**Step-by-step Solution:**
1. Spin angular momentum:
   $$ L = I \omega = 0.2 \times 60 = \mathbf{12.0 \text{ kg}\cdot\text{m}^2/\text{s}} $$
2. Gravitational torque:
   $$ \tau = r \times (M g) = (0.15)(2.0)(9.8) = \mathbf{2.94 \text{ N}\cdot\text{m}} $$
3. Precession equation ($\vec{\tau} = \vec{\Omega}_p \times \vec{L} \implies \tau = \Omega_p L$):
   $$ \Omega_p = \frac{\tau}{L} = \frac{2.94}{12.0} = \mathbf{0.245 \text{ rad/s}} $$
Instead of falling down, the spinning wheel precesses horizontally in a slow circle at $0.245 \text{ rad/s}$ ($\approx 25.6$ seconds per full revolution)!

---

### Level 3: Off-Center Impulse Collision on a Free Floating Beam
A uniform rod of length $L = 2.0 \text{ m}$ and mass $M = 3.0 \text{ kg}$ is floating stationary in deep space along the Y-axis. An instantaneous bullet impulse $J = 12.0 \text{ N}\cdot\text{s}$ hits the rod at its tip $(0, +1.0, 0)$ perpendicular to the rod in the $+x$ direction.
1. Determine the linear velocity $V_{\text{cm}}$ of the center of mass after the collision.
2. Determine the angular velocity $\omega$ of the rod about its center of mass ($I_{\text{rod}} = \frac{1}{12}ML^2$).

**Step-by-step Solution:**
1. Linear impulse-momentum theorem:
   $$ J = M V_{\text{cm}} \implies V_{\text{cm}} = \frac{J}{M} = \frac{12.0}{3.0} = \mathbf{4.0 \text{ m/s}} \quad (\text{along }+x) $$
2. Angular impulse equals change in angular momentum:
   $$ \Delta L = r \times J = (1.0 \text{ m}) \times (12.0 \text{ N}\cdot\text{s}) = 12.0 \text{ N}\cdot\text{m}\cdot\text{s} $$
3. Moment of inertia of rod about center:
   $$ I = \frac{1}{12} M L^2 = \frac{1}{12}(3.0)(2.0^2) = \frac{1}{12}(12.0) = 1.0 \text{ kg}\cdot\text{m}^2 $$
4. Angular velocity:
   $$ \omega = \frac{\Delta L}{I} = \frac{12.0}{1.0} = \mathbf{12.0 \text{ rad/s}} $$
The rod translates forward at $4.0 \text{ m/s}$ while simultaneously spinning furiously at $12.0 \text{ rad/s}$ around its center of mass!

---

## 7. Production-Ready Computational Engine: RigidBody3D

```typescript
import { Vector3D } from "./Vector3D";
import { Quaternion } from "./Quaternion";

export class RigidBody3D {
  public position: Vector3D;
  public linearMomentum: Vector3D;
  public orientation: Quaternion;
  public angularMomentum: Vector3D;

  public mass: number;
  public invMass: number;
  public invInertiaBody: Vector3D; // Principal diagonal: (1/Ixx, 1/Iyy, 1/Izz)

  public forceAccumulator: Vector3D;
  public torqueAccumulator: Vector3D;

  constructor(mass: number, sizeX: number, sizeY: number, sizeZ: number) {
    this.mass = mass;
    this.invMass = mass > 0 ? 1 / mass : 0;
    this.position = new Vector3D(0, 0, 0);
    this.linearMomentum = new Vector3D(0, 0, 0);
    this.orientation = new Quaternion(1, 0, 0, 0);
    this.angularMomentum = new Vector3D(0, 0, 0);

    // Box principal moments
    const ixx = (1 / 12) * mass * (sizeY * sizeY + sizeZ * sizeZ);
    const iyy = (1 / 12) * mass * (sizeX * sizeX + sizeZ * sizeZ);
    const izz = (1 / 12) * mass * (sizeX * sizeX + sizeY * sizeY);
    this.invInertiaBody = new Vector3D(1 / ixx, 1 / iyy, 1 / izz);

    this.forceAccumulator = new Vector3D(0, 0, 0);
    this.torqueAccumulator = new Vector3D(0, 0, 0);
  }

  public applyForceAtPoint(force: Vector3D, worldPoint: Vector3D): void {
    this.forceAccumulator = this.forceAccumulator.add(force);
    const r = worldPoint.subtract(this.position);
    this.torqueAccumulator = this.torqueAccumulator.add(r.cross(force));
  }

  public integrate(dt: number): void {
    if (this.invMass === 0) return;

    // 1. Linear state update
    this.linearMomentum = this.linearMomentum.add(this.forceAccumulator.scale(dt));
    const velocity = this.linearMomentum.scale(this.invMass);
    this.position = this.position.add(velocity.scale(dt));

    // 2. Rotational state update
    this.angularMomentum = this.angularMomentum.add(this.torqueAccumulator.scale(dt));

    // Transform angular momentum to body coordinates, apply inverse inertia, transform back
    // (Approximation for isotropic / aligned bodies)
    const omega = new Vector3D(
      this.angularMomentum.x * this.invInertiaBody.x,
      this.angularMomentum.y * this.invInertiaBody.y,
      this.angularMomentum.z * this.invInertiaBody.z
    );

    // q_dot = 0.5 * omega * q
    const omegaQuat = new Quaternion(0, omega.x, omega.y, omega.z);
    const qDot = omegaQuat.multiply(this.orientation);

    this.orientation.w += 0.5 * qDot.w * dt;
    this.orientation.x += 0.5 * qDot.x * dt;
    this.orientation.y += 0.5 * qDot.y * dt;
    this.orientation.z += 0.5 * qDot.z * dt;
    this.orientation = this.orientation.normalize();

    // Clear frame accumulators
    this.forceAccumulator = new Vector3D(0, 0, 0);
    this.torqueAccumulator = new Vector3D(0, 0, 0);
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** Why can't we simply represent rotational inertia with a single scalar number in 3D like we do in 2D?
   - **Answer:** In 2D, all rotations occur strictly about a single fixed perpendicular Z-axis, so only one scalar moment $I = \int r^2 dm$ exists. In 3D, an object can rotate about infinitely many spatial axes; the mass distribution is different across every direction, requiring a $3 \times 3$ tensor.
2. **Question:** What happens to the angular momentum of an isolated spinning rigid body when external torque is zero?
   - **Answer:** By conservation of angular momentum ($\frac{d\vec{L}}{dt} = \vec{\tau} = \vec{0}$), the total angular momentum vector $\vec{L}$ remains strictly constant in magnitude and direction in world space, even if the body tumbles wildly (as in the Dzhanibekov effect).
3. **Question:** Why do we normalize the orientation quaternion after every numerical integration step?
   - **Answer:** First-order discrete integration ($q_{k+1} = q_k + \dot{q}\Delta t$) introduces truncation drift that increases $\|q\| > 1$. If uncorrected, a non-unit quaternion scales 3D space during transformations, causing simulated objects to artificially swell or shrink!
