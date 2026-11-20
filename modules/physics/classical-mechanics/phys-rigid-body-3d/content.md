# 3D Rigid Body Dynamics, Inertia Tensors, and Angular Momentum

---

## 🎯 Pedagogical Roadmap & Learning Contract

In elementary physics, everything is simplified into a zero-dimensional point particle: an idealized mass with no size, no shape, and no orientation. A point mass can move forward, backward, left, right, up, and down—possessing 3 translational degrees of freedom.

In the physical reality we inhabit, however, objects have **geometry, volume, and mass distribution**. A smartphone, a tennis racket, a space station, and an autonomous quadrotor drone do not just translate; they tumble, tilt, spin, roll, and twist. They possess **Six Degrees of Freedom (6-DoF)**.

When you spin a textbook or smartphone in mid-air, you encounter one of the most stunning physical surprises in classical mechanics: **two axes of the book spin in a calm, rock-solid circle, while the third axis chaotically wobbles, twists, and flips end-over-end mid-air!**

This module takes you on an unbroken cognitive journey: starting from the everyday spinning book paradox, through the calculus of mass distributions and $3 \times 3$ inertia tensors, Euler's equations of rotational motion, gyroscopic precession, and the mathematical proof of the Dzhanibekov effect, culminating in a production-grade TypeScript 3D rigid-body simulation engine.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     THE 9-LEVEL COGNITIVE LADDER                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Level 0: The Spinning Book & Space Station Wingnut (Class 6 Anchor)     │
│ Level 1: What is a 3D Rigid Body? (6 Degrees of Freedom & COM)          │
│ Level 2: The Inertia Tensor: Why Rotational Mass is a 3x3 Matrix        │
│ Level 3: Canonical Inertia Tensors & The 3D Parallel Axis Theorem       │
│ Level 4: Angular Momentum & World vs Body Coordinates (R · I · R^T)     │
│ Level 5: Euler's Rotational Equations & The Dzhanibekov Stability Proof │
│ Level 6: Gyroscopic Precession & Quaternion Attitude Integration        │
│ Level 7: Production-Grade TypeScript 3D Rigid Body Physics Engine       │
│ Level 8: Multi-Tiered Practice Problems with Complete Worked Solutions │
│ Level 9: Philosophical Horizons: Poinsot's Ellipsoid & SO(3) Geodesics  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Level 0: The Anchor Paradox — The Spinning Book & The Space Station Wingnut

### The Class 6 Thought Experiment: The Three Spins of a Textbook
Pick up a hardcover textbook or your smartphone (securely wrapped in a rubber band so it doesn't open). A rectangular book has three distinct axes of symmetry passing through its center:
1. **Axis 1 (The Spindle Axis):** Spin the book flat like a frisbee on a table (perpendicular to the face of the book).  
   *Result:* Toss it into the air—it spins with butter-smooth, rock-solid stability!
2. **Axis 2 (The Rolling Axis):** Spin the book around its long spine like a rolling pin.  
   *Result:* Toss it into the air—it spins cleanly and stably!
3. **Axis 3 (The Flipping Axis):** Now try to spin the book end-over-end around its intermediate horizontal axis (across its width).  
   *Result:* **It is physically impossible to keep it spinning smoothly!** Even if you try your hardest, after half a turn the book unpredictably wobbles, tumbles, twists $180^\circ$ mid-air, and flips its cover over before you catch it!

```
         Axis 1 (Longest / Max Inertia)
                   │
                   ▼  STABLE (Smooth spin)
             ┌───────────┐
             │           │
   Axis 3 ───│  BOOK     │─── Axis 3 (Intermediate Inertia)
             │           │    UNSTABLE! (Tumbles & Flips 180° mid-air!)
             └───────────┘
                   ▲
                   │
         Axis 2 (Shortest / Min Inertia)
         STABLE (Smooth spin)
```

Why does nature permit smooth rotation around two axes, but ruthlessly punishes rotation around the third?

---

### The Dzhanibekov Space Mystery
In 1985, Soviet cosmonaut **Vladimir Dzhanibekov** was aboard the Salyut 7 space station in microgravity. While unpacking cargo, he unscrewed a metal wingnut with two protruding wings. 
As the wingnut flew spinning weightlessly through the cabin air:
- It spun forward smoothly for about 40 centimeters.
- Suddenly, without touching anything, **it flipped $180^\circ$ end-over-end!**
- It continued spinning in the opposite direction for another 40 centimeters, and then **flipped $180^\circ$ back again!**
- It repeated this rhythmically over and over in mid-air!

The Soviet space agency was so stunned that they initially classified the discovery as a state secret, fearing that the Earth itself might suddenly flip upside down in space!

The explanation is not an anomaly of gravity or quantum mechanics—it is the direct mathematical consequence of **Euler's Equations of 3D Rigid Body Dynamics**. In three dimensions, rotational inertia is not a simple scalar number like mass; it is a **second-order symmetric tensor** ($3 \times 3$ matrix).

---

## Level 1: What is a 3D Rigid Body? (6 Degrees of Freedom & Center of Mass)

### 1.1 The Definition of a Rigid Body
A **rigid body** is an idealized extended physical object composed of an uncountably infinite continuum of point masses $dm$, where the Euclidean distance between any two internal points remains strictly constant under all applied forces:

$$\|\vec{r}_i(t) - \vec{r}_j(t)\| = C_{ij} = \text{constant}, \quad \forall i, j, \forall t$$

Unlike deformable elastic jelly or fluid water, a rigid body does not bend, stretch, or compress.

### 1.2 The Six Degrees of Freedom (6-DoF)
The spatial configuration of any rigid body in 3D Euclidean space is completely defined by two independent state variables:
1. **Position of Center of Mass:** $\vec{R}_{\text{cm}}(t) = \begin{bmatrix} x(t) \\ y(t) \\ z(t) \end{bmatrix} \in \mathbb{R}^3$ (3 Translational DoF).
2. **Orientation in Space:** A unit quaternion $\mathbf{q}(t) \in S^3$ or $3 \times 3$ rotation matrix $\mathbf{R}(t) \in \text{SO}(3)$ (3 Rotational DoF: Roll, Pitch, Yaw).

Total degrees of freedom: $3 + 3 = \mathbf{6\text{ Degrees of Freedom}}$.

```
                     +Y (Heave / Pitch)
                       │
                       │     +Z (Surge / Roll)
                       │    /
                       │   /
                       │  /
                       └──┼──────────────────────> +X (Sway / Yaw)
                     Center of Mass
```

### 1.3 Center of Mass (COM)
The **Center of Mass** is the unique spatial point about which the first moment of mass vanishes:

$$\mathbf{\vec{R}_{\text{cm}} = \frac{1}{M} \int_{\mathcal{V}} \vec{r} \, dm = \frac{1}{M} \int_{\mathcal{V}} \vec{r} \, \rho(\vec{r}) \, dV}$$

Where $M = \int dm$ is the total scalar mass of the body.
By Newton's Second Law, the Center of Mass accelerates as if the entire mass of the body were concentrated at that single point, propelled by the vector sum of all external forces:

$$\vec{F}_{\text{net}} = \sum \vec{F}_i = M \frac{d^2\vec{R}_{\text{cm}}}{dt^2}$$

---

## Level 2: The Inertia Tensor: Why Rotational Mass is a $3 \times 3$ Matrix

In linear motion, scalar mass $m$ quantifies resistance to acceleration: $F = ma$.
Why can't rotational inertia be a single scalar number in 3D?

In 2D Flatland, rotation is restricted to a single flat plane around a fixed perpendicular Z-axis. But in 3D, a body can spin around **infinitely many spatial axes**. An elongated pencil spinning around its tip requires vastly more torque than spinning it along its graphite axis.

### 2.1 First-Principles Derivation from Rotational Kinetic Energy
Let a rigid body rotate about its center of mass with angular velocity vector $\vec{\omega} = (\omega_x, \omega_y, \omega_z)$.
Every microscopic mass element $dm$ at relative coordinate $\vec{r} = (x, y, z)$ moves with instantaneous tangential velocity:

$$\vec{v} = \vec{\omega} \times \vec{r}$$

The total rotational kinetic energy $T_{\text{rot}}$ is the integral of the kinetic energy of all mass elements:

$$T_{\text{rot}} = \frac{1}{2} \int \|\vec{v}\|^2 \, dm = \frac{1}{2} \int \|\vec{\omega} \times \vec{r}\|^2 \, dm$$

Recall the vector identity for cross product magnitude:
$$\|\vec{\omega} \times \vec{r}\|^2 = \|\vec{\omega}\|^2 \|\vec{r}\|^2 - (\vec{\omega} \cdot \vec{r})^2$$

Expanding this into Cartesian components:
$$\|\vec{\omega}\|^2 \|\vec{r}\|^2 = (\omega_x^2 + \omega_y^2 + \omega_z^2)(x^2 + y^2 + z^2)$$
$$(\vec{\omega} \cdot \vec{r})^2 = (x\omega_x + y\omega_y + z\omega_z)^2 = x^2\omega_x^2 + y^2\omega_y^2 + z^2\omega_z^2 + 2xy\omega_x\omega_y + 2xz\omega_x\omega_z + 2yz\omega_y\omega_z$$

Subtracting the two expressions and grouping by angular velocity components $\omega_i \omega_j$:
$$T_{\text{rot}} = \frac{1}{2} \left[ \omega_x^2 \int (y^2 + z^2)dm + \omega_y^2 \int (x^2 + z^2)dm + \omega_z^2 \int (x^2 + y^2)dm \right.$$
$$\left. - 2\omega_x\omega_y \int xy \, dm - 2\omega_x\omega_z \int xz \, dm - 2\omega_y\omega_z \int yz \, dm \right]$$

This quadratic form can be written compactly as a matrix-vector product:

$$\mathbf{T_{\text{rot}} = \frac{1}{2} \vec{\omega}^T \mathbf{I} \vec{\omega}}$$

Where $\mathbf{I}$ is the **$3 \times 3$ Inertia Tensor Matrix**:

$$\mathbf{I = \begin{bmatrix}
I_{xx} & I_{xy} & I_{xz} \\
I_{yx} & I_{yy} & I_{yz} \\
I_{zx} & I_{zy} & I_{zz}
\end{bmatrix}}$$

---

### 2.2 The Components of the Inertia Tensor
1. **Principal Moments of Inertia (Diagonal Entries):**
   Measure resistance to rotation around coordinate axes:
   $$I_{xx} = \int (y^2 + z^2) \, dm$$
   $$I_{yy} = \int (x^2 + z^2) \, dm$$
   $$I_{zz} = \int (x^2 + y^2) \, dm$$
2. **Products of Inertia (Off-Diagonal Entries, Symmetric: $I_{ij} = I_{ji}$):**
   Measure the dynamic mass asymmetry that causes an object spinning about one axis to wobble into other axes:
   $$I_{xy} = I_{yx} = -\int x y \, dm$$
   $$I_{xz} = I_{zx} = -\int x z \, dm$$
   $$I_{yz} = I_{zy} = -\int y z \, dm$$

---

## Level 3: Canonical Inertia Tensors & The 3D Parallel Axis Theorem

### 3.1 Principal Axes of Inertia
Because the inertia tensor matrix $\mathbf{I}$ is real and symmetric ($\mathbf{I} = \mathbf{I}^T$), the **Spectral Theorem** of linear algebra guarantees that its eigenvalues are real, and its eigenvectors form an orthonormal basis!

In this special coordinate frame—the **Principal Axes of Inertia**—all off-diagonal products of inertia vanish to zero:

$$\mathbf{I_{\text{body}} = \begin{bmatrix}
I_1 & 0 & 0 \\
0 & I_2 & 0 \\
0 & 0 & I_3
\end{bmatrix}}$$

Where $I_1 \le I_2 \le I_3$ are the **Principal Moments of Inertia**.

---

### 3.2 Canonical Formulas for Common 3D Geometric Solids
All formulas assume uniform density $\rho$ and total mass $M$:

1. **Solid Rectangular Box (Width $w$ along X, Height $h$ along Y, Depth $d$ along Z):**
   $$I_{xx} = \frac{1}{12} M (h^2 + d^2)$$
   $$I_{yy} = \frac{1}{12} M (w^2 + d^2)$$
   $$I_{zz} = \frac{1}{12} M (w^2 + h^2)$$

2. **Solid Uniform Sphere (Radius $R$):**
   By spherical symmetry, all axes are identical:
   $$I_{xx} = I_{yy} = I_{zz} = \frac{2}{5} M R^2$$

3. **Solid Cylinder (Radius $R$, Length $L$ along Z-axis):**
   $$I_{zz} = \frac{1}{2} M R^2, \quad I_{xx} = I_{yy} = \frac{1}{12} M (3R^2 + L^2)$$

---

### 3.3 The 3D Parallel Axis Theorem (Steiner's Theorem)
What if the body rotates about an axis displaced from its Center of Mass by a vector $\vec{d} = (d_x, d_y, d_z)$?

$$\mathbf{I_{\text{pivot}} = \mathbf{I}_{\text{cm}} + M \left( \|\vec{d}\|^2 \mathbf{E} - \vec{d} \otimes \vec{d} \right)}$$

Where $\mathbf{E}$ is the $3 \times 3$ identity matrix, and $\vec{d} \otimes \vec{d}$ is the outer product matrix:
$$\vec{d} \otimes \vec{d} = \begin{bmatrix} d_x^2 & d_x d_y & d_x d_z \\ d_y d_x & d_y^2 & d_y d_z \\ d_z d_x & d_z d_y & d_z^2 \end{bmatrix}$$

In component form:
$$I_{xx,\text{pivot}} = I_{xx,\text{cm}} + M(d_y^2 + d_z^2)$$
$$I_{xy,\text{pivot}} = I_{xy,\text{cm}} - M d_x d_y$$

---

## Level 4: Angular Momentum & World vs. Body Coordinates

### 4.1 Angular Momentum Vector $\vec{L}$
In 3D, angular momentum is a vector:

$$\mathbf{\vec{L} = \mathbf{I} \vec{\omega}}$$

Notice a critical revelation:
**$\vec{L}$ and $\vec{\omega}$ do NOT generally point in the same direction!**
Because $\mathbf{I}$ is a matrix with different diagonal entries, multiplying $\mathbf{I}\vec{\omega}$ tilts the angular momentum vector away from the angular velocity vector. They align *only* when the rotation occurs purely along one of the three principal axes!

---

### 4.2 Transforming the Inertia Tensor into World Coordinates
In a physics simulation, the rigid body's inertia tensor $\mathbf{I}_{\text{body}}$ is constant in its local coordinate frame attached to the object.
However, as the object tumbles in world space, its orientation is given by rotation matrix $\mathbf{R}(t)$.
The inertia tensor in **World Space** is given by the similarity transformation:

$$\mathbf{I_{\text{world}} = \mathbf{R} \, \mathbf{I}_{\text{body}} \, \mathbf{R}^T}$$
$$\mathbf{I_{\text{world}}^{-1} = \mathbf{R} \, \mathbf{I}_{\text{body}}^{-1} \, \mathbf{R}^T}$$

---

### 4.3 Newton-Euler Rotational Law
External torque $\vec{\tau}$ applied at point $\vec{r}$ relative to the center of mass is:
$$\vec{\tau} = \vec{r} \times \vec{F}$$

The fundamental dynamical law of rotation in an inertial world frame is:

$$\mathbf{\vec{\tau}_{\text{net}} = \frac{d\vec{L}}{dt} = \frac{d}{dt}\left(\mathbf{I}_{\text{world}} \vec{\omega}\right)}$$

If external torque is zero ($\vec{\tau} = \vec{0}$):
$$\mathbf{\vec{L}_{\text{world}} = \text{CONSTANT VECTOR!}}$$
Total angular momentum is strictly conserved in world coordinates!

---

## Level 5: Euler's Rotational Equations & The Dzhanibekov Stability Proof

Because $\mathbf{I}_{\text{world}}$ changes continuously as the body rotates, integrating motion in the world frame is computationally messy.
In 1758, **Leonhard Euler** transformed the equations into the body's rotating principal coordinate frame.

By the rotating frame differentiation theorem:
$$\left(\frac{d\vec{L}}{dt}\right)_{\text{space}} = \left(\frac{d\vec{L}}{dt}\right)_{\text{body}} + \vec{\omega} \times \vec{L} = \vec{\tau}$$

Since $\vec{L}_{\text{body}} = (I_1 \omega_1, I_2 \omega_2, I_3 \omega_3)$, expanding the cross product $\vec{\omega} \times \vec{L}$ yields **Euler's Equations of Rotational Motion**:

$$\mathbf{I_1 \dot{\omega}_1 + (I_3 - I_2) \omega_2 \omega_3 = \tau_1}$$
$$\mathbf{I_2 \dot{\omega}_2 + (I_1 - I_3) \omega_3 \omega_1 = \tau_2}$$
$$\mathbf{I_3 \dot{\omega}_3 + (I_2 - I_1) \omega_1 \omega_2 = \tau_3}$$

---

### 5.1 Rigorous Mathematical Proof of the Tennis Racket / Dzhanibekov Instability
Let an isolated rigid body tumble with zero external torque ($\vec{\tau} = \vec{0}$).
Let its principal moments be strictly ordered:
$$I_1 < I_2 < I_3$$
(where $I_1$ is minor, $I_2$ is intermediate, and $I_3$ is major).

#### Case A: Perturbing the Major Axis ($I_3$)
Suppose the body spins primarily about Axis 3 with angular speed $\Omega_0$, plus tiny perturbations $\epsilon_1, \epsilon_2 \ll \Omega_0$:
$$\omega_1 = \epsilon_1, \quad \omega_2 = \epsilon_2, \quad \omega_3 = \Omega_0$$

Substitute into Euler's first two equations:
$$I_1 \dot{\epsilon}_1 + (I_3 - I_2) \epsilon_2 \Omega_0 = 0 \implies \dot{\epsilon}_1 = -\left[\frac{I_3 - I_2}{I_1} \Omega_0\right] \epsilon_2$$
$$I_2 \dot{\epsilon}_2 + (I_1 - I_3) \epsilon_1 \Omega_0 = 0 \implies \dot{\epsilon}_2 = \left[\frac{I_3 - I_1}{I_2} \Omega_0\right] \epsilon_1$$

Differentiating the first equation with respect to time and substituting $\dot{\epsilon}_2$:
$$\ddot{\epsilon}_1 = -\left[\frac{(I_3 - I_2)(I_3 - I_1)}{I_1 I_2} \Omega_0^2\right] \epsilon_1$$

Look at the bracketed sign:
- $I_3 > I_2 \implies (I_3 - I_2) > 0$.
- $I_3 > I_1 \implies (I_3 - I_1) > 0$.
- The product is strictly **POSITIVE**!
Let $k^2 = \frac{(I_3 - I_2)(I_3 - I_1)}{I_1 I_2} \Omega_0^2 > 0$. The equation becomes:
$$\ddot{\epsilon}_1 = -k^2 \epsilon_1 \implies \epsilon_1(t) = A \cos(kt + \phi)$$
**Result: Simple Harmonic Motion!** The perturbation oscillates sinusoidally with bounded amplitude. The rotation around the major axis is **STABLE**.

---

#### Case B: Perturbing the Intermediate Axis ($I_2$) — The Dzhanibekov Catastrophe
Now suppose the body spins primarily about the intermediate Axis 2 with speed $\Omega_0$, plus tiny perturbations $\epsilon_1, \epsilon_3 \ll \Omega_0$:
$$\omega_1 = \epsilon_1, \quad \omega_2 = \Omega_0, \quad \omega_3 = \epsilon_3$$

Substitute into Euler's 1st and 3rd equations:
$$I_1 \dot{\epsilon}_1 + (I_3 - I_2) \Omega_0 \epsilon_3 = 0 \implies \dot{\epsilon}_1 = -\left[\frac{I_3 - I_2}{I_1} \Omega_0\right] \epsilon_3$$
$$I_3 \dot{\epsilon}_3 + (I_2 - I_1) \epsilon_1 \Omega_0 = 0 \implies \dot{\epsilon}_3 = -\left[\frac{I_2 - I_1}{I_3} \Omega_0\right] \epsilon_1$$

Differentiate the first equation with respect to time and substitute $\dot{\epsilon}_3$:
$$\ddot{\epsilon}_1 = -\left[\frac{I_3 - I_2}{I_1} \Omega_0\right] \left(-\left[\frac{I_2 - I_1}{I_3} \Omega_0\right] \epsilon_1\right)$$
$$\mathbf{\ddot{\epsilon}_1 = +\left[\frac{(I_3 - I_2)(I_2 - I_1)}{I_1 I_3} \Omega_0^2\right] \epsilon_1}$$

Now examine the signs:
- $I_3 > I_2 \implies (I_3 - I_2) > 0$ (Positive).
- $I_2 > I_1 \implies (I_2 - I_1) > 0$ (Positive).
- The coefficient is strictly **POSITIVE (+)**!

Let $\lambda^2 = \frac{(I_3 - I_2)(I_2 - I_1)}{I_1 I_3} \Omega_0^2 > 0$. The differential equation is:
$$\mathbf{\ddot{\epsilon}_1 - \lambda^2 \epsilon_1 = 0}$$

The roots of the characteristic polynomial are real: $r = \pm \lambda$.
The general solution contains an **exponentially growing term**:

$$\mathbf{\epsilon_1(t) = C_1 e^{+\lambda t} + C_2 e^{-\lambda t} \quad \blacksquare}$$

#### The Verdict of Mathematics:
Even an infinitesimal quantum perturbation $\epsilon_1(0) = 10^{-15}$ doubles exponentially every fraction of a second! The perturbation rapidly overwhelms the primary rotation, violently flipping the object $180^\circ$ end-over-end. 

This proves conclusively why spinning a textbook or wingnut about its intermediate axis triggers perpetual, rhythmic tumbling. It is an inescapable topological property of 3D rigid bodies.

---

## Level 6: Gyroscopic Precession & Quaternion Attitude Integration

### 6.1 Gyroscopic Precession
What happens when an external torque $\vec{\tau}$ is applied to a spinning gyroscope with angular momentum $\vec{L}$?
$$\vec{\tau} = \frac{d\vec{L}}{dt}$$

Instead of tilting in the direction of the torque (falling over), the tip of the angular momentum vector rotates perpendicularly in a horizontal circle:

$$\mathbf{\vec{\tau} = \vec{\Omega}_p \times \vec{L}}$$

Where $\vec{\Omega}_p$ is the **Gyroscopic Precession Angular Velocity**:
$$\mathbf{\Omega_p = \frac{\|\vec{\tau}\|}{\|\vec{L}\|} = \frac{\tau}{I \omega}}$$

This is why a spinning toy top or bicycle wheel does not fall down under gravity—the gravitational torque is continuously redirected into horizontal precession!

---

### 6.2 Quaternion Orientation Integration
In our discrete 3D simulation engine, we update the orientation quaternion $\mathbf{q}$ from angular velocity $\vec{\omega}$.
The continuous rate of change of orientation is:

$$\mathbf{\dot{\mathbf{q}} = \frac{1}{2} \mathbf{\omega} \mathbf{q}}$$

Where $\mathbf{\omega} = [0, \vec{\omega}]$ is the pure quaternion formed from angular velocity.

Using Semi-Implicit Euler with discrete time step $\Delta t$:
$$\mathbf{q}_{k+1} = \mathbf{q}_k + \frac{1}{2} \left(\mathbf{\omega} \mathbf{q}_k\right) \Delta t$$

#### The Critical Normalization Invariant:
Because discrete integration introduces truncation error ($\|q_{k+1}\| = 1 + \mathcal{O}(\Delta t^2) \neq 1.0$), **you must normalize the quaternion on EVERY tick**:
$$\mathbf{q}_{k+1} \gets \frac{\mathbf{q}_{k+1}}{\|\mathbf{q}_{k+1}\|}$$
If you forget this single normalization step, the object will artificially swell or shrink in size until the graphics engine crashes!

---

## Level 7: Production-Grade TypeScript 3D Rigid Body Engine

```typescript
/**
 * Sovereign Tech Tree of Knowledge: Level 7 Production Implementation
 * Module: phys-rigid-body-3d
 * Architecture: Complete 6-DoF 3D Rigid Body Dynamics Simulator
 */

import { Vector3D, Matrix4x4, Quaternion } from "./MathSuite3D";

export class RigidBody3D {
  // Linear state
  public position: Vector3D = new Vector3D(0, 0, 0);
  public linearMomentum: Vector3D = new Vector3D(0, 0, 0);
  public mass: number;
  public invMass: number;

  // Rotational state
  public orientation: Quaternion = new Quaternion(1, 0, 0, 0);
  public angularMomentum: Vector3D = new Vector3D(0, 0, 0);

  // Local Inertia Tensor (Diagonal Principal Axes)
  public inertiaBody: Vector3D;    // (I_xx, I_yy, I_zz)
  public invInertiaBody: Vector3D; // (1/I_xx, 1/I_yy, 1/I_zz)

  // Accumulators (cleared each tick)
  public forceAccumulator: Vector3D = new Vector3D(0, 0, 0);
  public torqueAccumulator: Vector3D = new Vector3D(0, 0, 0);

  constructor(mass: number, sizeX: number, sizeY: number, sizeZ: number) {
    this.mass = mass;
    this.invMass = mass > 0 ? 1.0 / mass : 0.0;

    // Solid rectangular box principal moments of inertia
    const ixx = (1.0 / 12.0) * mass * (sizeY * sizeY + sizeZ * sizeZ);
    const iyy = (1.0 / 12.0) * mass * (sizeX * sizeX + sizeZ * sizeZ);
    const izz = (1.0 / 12.0) * mass * (sizeX * sizeX + sizeY * sizeY);

    this.inertiaBody = new Vector3D(ixx, iyy, izz);
    this.invInertiaBody = new Vector3D(1.0 / ixx, 1.0 / iyy, 1.0 / izz);
  }

  /**
   * Applies an external force at a specific world-space contact coordinate
   */
  public applyForceAtWorldPoint(force: Vector3D, worldPoint: Vector3D): void {
    this.forceAccumulator = this.forceAccumulator.add(force);
    const leverArm = worldPoint.sub(this.position);
    this.torqueAccumulator = this.torqueAccumulator.add(leverArm.cross(force));
  }

  /**
   * Computes the current 3D angular velocity vector in world space:
   * omega = R * (I_body^-1 * (R^T * L))
   */
  public getAngularVelocity(): Vector3D {
    // 1. Transform world angular momentum into body frame via inverse orientation q*
    const qConj = this.orientation.conjugate();
    const lBody = qConj.rotateVector(this.angularMomentum);

    // 2. Multiply by diagonal inverse inertia in body frame
    const omegaBody = new Vector3D(
      lBody.x * this.invInertiaBody.x,
      lBody.y * this.invInertiaBody.y,
      lBody.z * this.invInertiaBody.z
    );

    // 3. Transform body angular velocity back into world frame via orientation q
    return this.orientation.rotateVector(omegaBody);
  }

  /**
   * Advances the 6-DoF rigid body state forward by fixed time delta dt
   */
  public integrate(dt: number): void {
    if (this.invMass === 0) return; // Immovable static body

    // ─── 1. LINEAR DYNAMICS ───
    // Update linear momentum: P(t + dt) = P(t) + F * dt
    this.linearMomentum = this.linearMomentum.add(this.forceAccumulator.scale(dt));
    // Linear velocity: v = P / M
    const velocity = this.linearMomentum.scale(this.invMass);
    // Update position: r(t + dt) = r(t) + v * dt
    this.position = this.position.add(velocity.scale(dt));

    // ─── 2. ROTATIONAL DYNAMICS ───
    // Update angular momentum: L(t + dt) = L(t) + tau * dt
    this.angularMomentum = this.angularMomentum.add(this.torqueAccumulator.scale(dt));

    // Compute updated angular velocity vector
    const omega = this.getAngularVelocity();

    // Quaternion attitude rate of change: q_dot = 0.5 * omega * q
    const omegaQuat = new Quaternion(0, omega.x, omega.y, omega.z);
    const qDot = omegaQuat.multiply(this.orientation);

    // Update orientation quaternion
    this.orientation = new Quaternion(
      this.orientation.w + 0.5 * qDot.w * dt,
      this.orientation.x + 0.5 * qDot.x * dt,
      this.orientation.y + 0.5 * qDot.y * dt,
      this.orientation.z + 0.5 * qDot.z * dt
    ).normalize(); // CRITICAL: Preserves unit hypersphere invariant!

    // Clear force and torque accumulators for next frame
    this.forceAccumulator = new Vector3D(0, 0, 0);
    this.torqueAccumulator = new Vector3D(0, 0, 0);
  }
}
```

---

## Level 8: Multi-Tiered Practice Problems with Complete Step-by-Step Solutions

### Tier 1: Class 6 Anchor Problem (Center of Mass & Net Torque)
**Problem Statement:**  
A lightweight rod of length $2.0\text{ meters}$ has negligible mass. Two steel balls are welded to its ends:
- Ball A: Mass $m_1 = 1.0\text{ kg}$ at coordinate $x_1 = 0.0\text{ m}$.
- Ball B: Mass $m_2 = 3.0\text{ kg}$ at coordinate $x_2 = 2.0\text{ m}$.
1. Find the coordinate $X_{\text{cm}}$ of the Center of Mass.
2. A downward vertical force of $10\text{ Newtons}$ is applied at the center of the rod ($x = 1.0\text{ m}$). What is the torque about the Center of Mass?

**Exhaustive Step-by-Step Solution:**  
1. **Center of Mass Calculation:**
   $$X_{\text{cm}} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \frac{(1.0)(0.0) + (3.0)(2.0)}{1.0 + 3.0} = \frac{6.0}{4.0} = \mathbf{1.50\text{ meters}}$$
2. **Torque Calculation:**
   - Lever arm from Center of Mass ($X_{\text{cm}} = 1.5\text{ m}$) to applied force point ($x = 1.0\text{ m}$):
     $$r = 1.0 - 1.5 = -0.5\text{ meters}$$
   - Applied force is downward: $F = -10\text{ N}$.
   - Torque:
     $$\tau = r \times F = (-0.5\text{ m}) \times (-10\text{ N}) = \mathbf{+5.0\text{ N}\cdot\text{m}}$$
   The downward force generates a counter-clockwise torque of $+5.0\text{ N}\cdot\text{m}$ about the center of mass.

---

### Tier 2: High School Physics (Principal Moments of a Cube)
**Problem Statement:**  
A solid uniform aluminum cube has edge length $s = 0.4\text{ meters}$ and total mass $M = 8.0\text{ kg}$.  
1. Compute its principal moments of inertia $I_{xx}, I_{yy}, I_{zz}$ about its center of mass.  
2. If the cube spins with angular velocity $\vec{\omega} = (0, 0, 15.0)\text{ rad/s}$, compute its rotational kinetic energy.

**Exhaustive Step-by-Step Solution:**  
1. **Principal Moments of a Cube ($w = h = d = s$):**
   $$I_{xx} = \frac{1}{12} M (s^2 + s^2) = \frac{1}{12} M (2s^2) = \frac{1}{6} M s^2$$
   $$I_{xx} = \frac{1}{6} (8.0\text{ kg}) (0.4\text{ m})^2 = \frac{8.0}{6} (0.16) = \frac{1.28}{6} \approx \mathbf{0.21333\text{ kg}\cdot\text{m}^2}$$
   By cube symmetry:
   $$I_{xx} = I_{yy} = I_{zz} = \mathbf{0.21333\text{ kg}\cdot\text{m}^2}$$
2. **Rotational Kinetic Energy:**
   $$T_{\text{rot}} = \frac{1}{2} I_{zz} \omega_z^2 = \frac{1}{2} (0.21333) (15.0)^2 = \frac{1}{2} (0.21333) (225) = \mathbf{24.0\text{ Joules}}$$

---

### Tier 3: AP / College Physics (Gyroscopic Precession Rate)
**Problem Statement:**  
A heavy flywheel in a ship stabilizer has mass $M = 200\text{ kg}$ and radius of gyration $k = 0.5\text{ m}$ (moment of inertia $I = M k^2 = 50.0\text{ kg}\cdot\text{m}^2$). The wheel spins at $3000\text{ RPM}$ around a horizontal axle.  
The ship encounters ocean waves exerting a pitching torque $\tau = 5000\text{ N}\cdot\text{m}$ on the axle.  
1. Convert the spin speed from RPM to radians per second $\omega$.  
2. Compute the spin angular momentum $L$.  
3. Calculate the rate of gyroscopic precession $\Omega_p$ in degrees per second.

**Exhaustive Step-by-Step Solution:**  
1. **Angular Speed in rad/s:**
   $$\omega = 3000 \times \frac{2\pi\text{ rad}}{60\text{ s}} = 100\pi \approx \mathbf{314.159\text{ rad/s}}$$
2. **Angular Momentum:**
   $$L = I \omega = (50.0\text{ kg}\cdot\text{m}^2)(314.159\text{ rad/s}) = \mathbf{15,707.96\text{ kg}\cdot\text{m}^2/\text{s}}$$
3. **Precession Rate:**
   $$\Omega_p = \frac{\tau}{L} = \frac{5000\text{ N}\cdot\text{m}}{15,707.96\text{ N}\cdot\text{m}\cdot\text{s}} \approx \mathbf{0.3183\text{ rad/s}}$$
   Convert to degrees per second:
   $$\Omega_{p,\text{deg}} = 0.3183 \times \left(\frac{180^\circ}{\pi}\right) \approx \mathbf{18.24^\circ/\text{second}}$$

---

### Tier 4: University Classical Mechanics (Dzhanibekov Eigenvalue Growth Rate)
**Problem Statement:**  
A rectangular communication satellite floating in deep space has principal moments of inertia:
$$I_1 = 100\text{ kg}\cdot\text{m}^2, \quad I_2 = 200\text{ kg}\cdot\text{m}^2, \quad I_3 = 500\text{ kg}\cdot\text{m}^2$$
The satellite is commanded to spin around its intermediate axis $I_2$ at $\Omega_0 = 2.0\text{ rad/s}$.  
A micrometeorite impact causes an initial off-axis perturbation $\epsilon_1(0) = 0.001\text{ rad/s}$.  
1. Derive the numerical eigenvalue $\lambda$ governing the exponential instability.
2. How long (in seconds) does it take for the perturbation $\epsilon_1(t)$ to grow by a factor of 100?

**Exhaustive Step-by-Step Solution:**  
1. **Instability Eigenvalue $\lambda$:**
   From Level 5, the characteristic equation for the intermediate axis perturbation is $\ddot{\epsilon}_1 - \lambda^2 \epsilon_1 = 0$, where:
   $$\lambda^2 = \frac{(I_3 - I_2)(I_2 - I_1)}{I_1 I_3} \Omega_0^2$$
   Substitute the satellite parameters:
   $$I_3 - I_2 = 500 - 200 = 300$$
   $$I_2 - I_1 = 200 - 100 = 100$$
   $$I_1 I_3 = 100 \times 500 = 50,000$$
   $$\lambda^2 = \frac{300 \times 100}{50,000} \times (2.0)^2 = \frac{30,000}{50,000} \times 4.0 = 0.60 \times 4.0 = 2.40\text{ s}^{-2}$$
   $$\lambda = \sqrt{2.40} \approx \mathbf{1.5492\text{ s}^{-1}}$$
2. **Time to 100x Growth:**
   For an unstable mode $\epsilon_1(t) \approx \epsilon_1(0) e^{\lambda t}$:
   $$\frac{\epsilon_1(t)}{\epsilon_1(0)} = 100 \implies e^{\lambda t} = 100$$
   $$\lambda t = \ln(100) \approx 4.60517$$
   $$t = \frac{4.60517}{1.5492} \approx \mathbf{2.97\text{ seconds}}$$
   In under 3 seconds, the microscopic perturbation multiplies 100-fold, throwing the satellite into a violent $180^\circ$ tumble!

---

### Tier 5: Industry / Synthesis (Off-Center Contact Impulse Resolution)
**Problem Statement:**  
A stationary 3D rectangular shipping container ($M = 1200\text{ kg}$, $w = 2.0\text{ m}, h = 2.0\text{ m}, d = 6.0\text{ m}$, aligned with principal axes) floats in zero gravity.  
An impulse $\vec{J} = (0, 0, 3600)\text{ N}\cdot\text{s}$ hits the container at corner coordinate $\vec{r} = (1.0, 1.0, -3.0)\text{ m}$ relative to its center of mass.  
1. Compute the linear velocity $\vec{V}_{\text{cm}}$ of the container immediately after impact.  
2. Compute the resulting angular velocity vector $\vec{\omega}$.

**Exhaustive Step-by-Step Solution:**  
1. **Linear Velocity:**
   $$\vec{V}_{\text{cm}} = \frac{\vec{J}}{M} = \frac{(0, 0, 3600)}{1200} = \mathbf{(0.0, 0.0, 3.0)\text{ m/s}}$$
2. **Principal Moments of Inertia:**
   $$I_{xx} = \frac{1}{12}(1200)(2.0^2 + 6.0^2) = 100(4 + 36) = 4000\text{ kg}\cdot\text{m}^2$$
   $$I_{yy} = \frac{1}{12}(1200)(2.0^2 + 6.0^2) = 100(4 + 36) = 4000\text{ kg}\cdot\text{m}^2$$
   $$I_{zz} = \frac{1}{12}(1200)(2.0^2 + 2.0^2) = 100(4 + 4) = 800\text{ kg}\cdot\text{m}^2$$
3. **Angular Impulse $\Delta\vec{L}$:**
   $$\Delta\vec{L} = \vec{r} \times \vec{J} = \det \begin{bmatrix} \hat{i} & \hat{j} & \hat{k} \\ 1.0 & 1.0 & -3.0 \\ 0 & 0 & 3600 \end{bmatrix}$$
   $$\Delta L_x = (1.0)(3600) - (-3.0)(0) = +3600\text{ N}\cdot\text{m}\cdot\text{s}$$
   $$\Delta L_y = (-3.0)(0) - (1.0)(3600) = -3600\text{ N}\cdot\text{m}\cdot\text{s}$$
   $$\Delta L_z = (1.0)(0) - (1.0)(0) = 0$$
   $$\Delta\vec{L} = \begin{bmatrix} 3600 \\ -3600 \\ 0 \end{bmatrix}$$
4. **Angular Velocity $\vec{\omega} = \mathbf{I}^{-1} \Delta\vec{L}$:**
   $$\omega_x = \frac{\Delta L_x}{I_{xx}} = \frac{3600}{4000} = \mathbf{+0.90\text{ rad/s}}$$
   $$\omega_y = \frac{\Delta L_y}{I_{yy}} = \frac{-3600}{4000} = \mathbf{-0.90\text{ rad/s}}$$
   $$\omega_z = \frac{\Delta L_z}{I_{zz}} = \frac{0}{800} = \mathbf{0.0\text{ rad/s}}$$
   $$\vec{\omega} = \mathbf{(0.90, -0.90, 0.0)\text{ rad/s}}$$
   The container translates forward along Z at $3.0\text{ m/s}$ while pitching and yawing diagonally across X and Y at $0.90\text{ rad/s}$.

---

## Level 9: Philosophical & Scientific Horizons

### 9.1 Emmy Noether and the Holism of Angular Momentum
In 1918, **Emmy Noether** proved that every physical conservation law originates in a symmetry of the universe.
Linear momentum is conserved because the laws of physics are identical regardless of *where* you are (spatial translation symmetry).
Angular momentum is conserved because the laws of physics are identical regardless of *which direction you face* (**rotational isotropy of space**).

Even when a spacecraft tumbles chaotically under the Dzhanibekov effect, the angular momentum vector $\vec{L}$ remains as unyielding and motionless in world space as the North Star.

### 9.2 Poinsot's Construction: Geometry Above Algebra
In 1834, French mathematician **Louis Poinsot** discovered an astonishing geometric visualization of Euler's equations:
Imagine an ellipsoid representing the body's kinetic energy:
$$I_1 x^2 + I_2 y^2 + I_3 z^2 = 2 T = \text{constant}$$
Poinsot proved that the torque-free rotation of any 3D rigid body can be visualized as this **Inertia Ellipsoid rolling without slipping on an invariable plane** perpendicular to the fixed angular momentum vector $\vec{L}$!

What appeared algebraically as a terrifying system of non-linear differential equations resolves geometrically into an egg rolling peacefully on a flat table. Mathematics once again reveals the hidden, serene geometric order operating behind apparent physical chaos.
