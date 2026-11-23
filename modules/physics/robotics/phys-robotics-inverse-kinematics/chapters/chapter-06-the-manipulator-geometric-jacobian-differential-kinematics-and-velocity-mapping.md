# Chapter 6: The Manipulator Geometric Jacobian — Differential Kinematics and Velocity Mapping

---

## 1. The Layman's Genesis & Intuitive Overview

In Chapters 3, 4, and 5, we studied the static geometry of robot arms: where the arm is located when the joints are locked at fixed angles. But robots are not static museum sculptures—they are dynamic machines that move, weld, grasp, and assemble at high speeds.

This brings us to the fundamental question of **differential kinematics**:
*If each joint motor rotates with a certain angular speed (measured in radians per second), how fast will the tool tip move through space (measured in meters per second and radians per second)?*

```
     Motor Joint Speeds (rad/s)                 End-Effector Velocity (m/s, rad/s)
     ┌────────────────────────┐                 ┌───────────────────────────────┐
     │  q_dot_1 =  1.5 rad/s  │                 │  v_x =  0.35 m/s              │
     │  q_dot_2 = -0.8 rad/s  │   ═══ J(q) ═══▶ │  v_y = -0.12 m/s              │
     │  q_dot_3 =  2.0 rad/s  │                 │  omega_z = 0.50 rad/s         │
     └────────────────────────┘                 └───────────────────────────────┘
                                   Jacobian Matrix
                              (Linear Sensitivity Map)
```

At any frozen instant in time, the relationship between joint motor velocities $\dot{q}$ and end-effector spatial velocity $\nu$ is strictly **linear**! The mathematical operator that performs this linear conversion is the **Manipulator Jacobian Matrix $J(q)$**. 

The Jacobian acts as the robot's transmission ratio. Just as a bicycle gear ratio determines how fast the rear wheel spins for every pedal stroke, the Jacobian determines how much Cartesian velocity is produced for every radian turned by a joint motor. Furthermore, through the profound principle of **Virtual Work**, the exact same Jacobian matrix relates the mechanical forces and torques at the tool tip to the motor torques required at the joints!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical concept of the Jacobian matrix originated in the 1841 paper *De determinantibus functionalibus* by the German mathematician **Carl Gustav Jacob Jacobi**, who formulated the matrix of first-order partial derivatives of a vector-valued function.

In robotics, differential kinematics was pioneered in 1969 by **Daniel E. Whitney** at the MIT Draper Laboratory in his seminal paper *"Resolved Motion Rate Control of Manipulators and Human Prostheses"*. Whitney asked how an amputee or an astronaut could control a multi-jointed mechanical arm using a 3-axis joystick. Rather than computing complex non-linear inverse kinematics at every millisecond, Whitney linearized the kinematics around the current pose using the Jacobian matrix:
$$\nu = J(q) \dot{q} \implies \dot{q} = J^{-1}(q) \nu$$
By inverting the linear system at each control tick, a computer could continuously convert desired Cartesian hand velocities $\nu$ into instantaneous joint motor commands $\dot{q}$. This paradigm—**Resolved Motion Rate Control (RMRC)**—became the cornerstone of all real-time robot velocity control, visual servoing, and force control.

In the 1980s, roboticists distinguished between the **Analytical Jacobian** (derived by differentiating minimal orientation coordinates such as Euler angles) and the **Geometric Jacobian** (derived directly from cross products of physical rotation axes). Whitney, Paul (1981), and Siciliano (1990) established the superiority of the Geometric Jacobian, which avoids representation singularities (such as Euler gimbal lock) and reflects the true physical twist of the end-effector.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Geometric Jacobian
Let an $n$-joint serial manipulator have joint configuration vector:
$$q = [q_1, q_2, \dots, q_n]^T \in \mathbb{R}^n$$
and joint velocity vector:
$$\dot{q} = [\dot{q}_1, \dot{q}_2, \dots, \dot{q}_n]^T \in \mathbb{R}^n$$

The spatial velocity of the end-effector is described by the 6-dimensional twist $\nu$, comprising linear velocity $v \in \mathbb{R}^3$ and angular velocity $\omega \in \mathbb{R}^3$:
$$\nu = \begin{bmatrix} v \\ \omega \end{bmatrix} \in \mathbb{R}^6$$

The **Geometric Manipulator Jacobian** $J(q) \in \mathbb{R}^{6 \times n}$ is the configuration-dependent linear mapping:
$$\nu = J(q) \dot{q} = \begin{bmatrix} J_v(q) \\ J_\omega(q) \end{bmatrix} \dot{q}$$
where $J_v(q) \in \mathbb{R}^{3 \times n}$ maps to linear velocity, and $J_\omega(q) \in \mathbb{R}^{3 \times n}$ maps to angular velocity.

### 3.2 Column-by-Column Construction
By the principle of superposition in linear kinematics, the total velocity of the end-effector is the vector sum of the velocities contributed by each individual joint moving independently:
$$\nu = \sum_{i=1}^n J_i(q) \dot{q}_i = J_1 \dot{q}_1 + J_2 \dot{q}_2 + \cdots + J_n \dot{q}_n$$
where the $i$-th column $J_i = \begin{bmatrix} J_{v, i} \\ J_{\omega, i} \end{bmatrix} \in \mathbb{R}^6$ represents the end-effector velocity when joint $i$ moves at unit velocity ($\dot{q}_i = 1$) while all other joints are frozen ($\dot{q}_k = 0, k \neq i$).

Let $p_e \in \mathbb{R}^3$ be the Cartesian position of the end-effector.
Let $p_{i-1} \in \mathbb{R}^3$ be the position of the origin of coordinate frame $\{i-1\}$ (located at joint $i$).
Let $z_{i-1} \in \mathbb{R}^3$ be the unit vector pointing along the actuation axis of joint $i$.

```
                              z_{i-1}
                                 ▲
                                 │
                                 ● Joint i (Origin p_{i-1})
                                  \
                                   \  Vector (p_e - p_{i-1})
                                    \
                                     ▼
                                      ● End-Effector (Position p_e)
                                      │
                                      ▼ Tangential Velocity: z_{i-1} x (p_e - p_{i-1})
```

#### Case 1: Joint $i$ is Revolute
- **Angular Velocity:** Rotating joint $i$ with angular speed $\dot{q}_i$ produces angular velocity directed along its rotation axis $z_{i-1}$:
  $$\omega_i = z_{i-1} \dot{q}_i \implies J_{\omega, i} = z_{i-1}$$
- **Linear Velocity:** A rotation about axis $z_{i-1}$ passing through point $p_{i-1}$ produces a tangential linear velocity at the end-effector given by the cross product with the moment arm $(p_e - p_{i-1})$:
  $$v_i = \omega_i \times (p_e - p_{i-1}) = (z_{i-1} \times (p_e - p_{i-1})) \dot{q}_i \implies J_{v, i} = z_{i-1} \times (p_e - p_{i-1})$$

Therefore, for a **revolute joint**:
$$J_i = \begin{bmatrix} z_{i-1} \times (p_e - p_{i-1}) \\ z_{i-1} \end{bmatrix}$$

#### Case 2: Joint $i$ is Prismatic
- **Angular Velocity:** A linear slider cannot produce rotation:
  $$\omega_i = 0 \implies J_{\omega, i} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
- **Linear Velocity:** Translating joint $i$ with speed $\dot{q}_i$ produces pure linear velocity along its translation axis $z_{i-1}$:
  $$v_i = z_{i-1} \dot{q}_i \implies J_{v, i} = z_{i-1}$$

Therefore, for a **prismatic joint**:
$$J_i = \begin{bmatrix} z_{i-1} \\ 0_{3 \times 1} \end{bmatrix}$$

---

### 3.3 Analytical vs. Geometric Jacobian
In some tasks, the end-effector pose is specified using minimal coordinates:
$$x = \begin{bmatrix} p \\ \phi \end{bmatrix} \in \mathbb{R}^m$$
where $p = [x, y, z]^T \in \mathbb{R}^3$ and $\phi = [\psi, \theta, \phi]^T$ are Euler angles (e.g., Roll, Pitch, Yaw).

The **Analytical Jacobian** $J_A(q)$ is obtained by directly differentiating the forward kinematics equations with respect to joint angles:
$$\dot{x} = \begin{bmatrix} \dot{p} \\ \dot{\phi} \end{bmatrix} = \frac{\partial f(q)}{\partial q} \dot{q} = J_A(q) \dot{q}$$

#### The Relationship between $J$ and $J_A$:
While the linear velocity is identical ($\dot{p} = v$), the time derivative of Euler angles $\dot{\phi}$ is **not** equal to the physical angular velocity $\omega$!
Physical angular velocity is related to Euler angle rates by a transformation matrix $E(\phi) \in \mathbb{R}^{3 \times 3}$:
$$\omega = E(\phi) \dot{\phi}$$
Therefore:
$$\nu = \begin{bmatrix} v \\ \omega \end{bmatrix} = \begin{bmatrix} I_3 & 0 \\ 0 & E(\phi) \end{bmatrix} \begin{bmatrix} \dot{p} \\ \dot{\phi} \end{bmatrix} = \begin{bmatrix} I_3 & 0 \\ 0 & E(\phi) \end{bmatrix} J_A(q) \dot{q}$$
Equating this to $\nu = J(q) \dot{q}$:
$$J(q) = \begin{bmatrix} I_3 & 0 \\ 0 & E(\phi) \end{bmatrix} J_A(q) \iff J_A(q) = \begin{bmatrix} I_3 & 0 \\ 0 & E^{-1}(\phi) \end{bmatrix} J(q)$$

#### The Representation Singularity Pitfall:
For standard $Z-Y-X$ Euler angles:
$$E(\phi) = \begin{bmatrix} 0 & -\sin\phi_z & \cos\phi_z\cos\phi_y \\ 0 & \cos\phi_z & \sin\phi_z\cos\phi_y \\ 1 & 0 & -\sin\phi_y \end{bmatrix}$$
The determinant is $\det(E) = -\cos\phi_y$.
When pitch angle $\phi_y = \pm 90^\circ$, $\cos\phi_y = 0$, so $\det(E) = 0$! $E(\phi)$ becomes singular and cannot be inverted, even though the physical robot is completely fine.
**Conclusion:** The Geometric Jacobian $J(q)$ is always preferred over the Analytical Jacobian $J_A(q)$ because it is free from artificial representation singularities.

---

### 3.4 Principle of Virtual Work and Static Force/Torque Duality
Consider a robot arm in static equilibrium holding a tool against a workpiece.
Let $\mathcal{F} = [f, m]^T \in \mathbb{R}^6$ be the external wrench (force $f$, torque $m$) exerted by the end-effector on the environment.
Let $\tau = [\tau_1, \tau_2, \dots, \tau_n]^T \in \mathbb{R}^n$ be the actuator joint motor torques/forces.

By the **Principle of Virtual Work**, in the absence of friction and gravity, the virtual work done by the joint motors during an infinitesimal virtual displacement $\delta q$ must equal the virtual work done by the end-effector against the environment during virtual displacement $\delta x$:
$$\delta W = \tau^T \delta q - \mathcal{F}^T \delta x = 0$$

Using the differential kinematics relation $\delta x = J(q) \delta q$:
$$\tau^T \delta q - \mathcal{F}^T (J(q) \delta q) = 0 \implies (\tau^T - \mathcal{F}^T J(q)) \delta q = 0$$
Because this identity must hold for all arbitrary virtual displacements $\delta q$:
$$\tau^T = \mathcal{F}^T J(q) \iff \tau = J^T(q) \mathcal{F}$$

```
                           Kinematic Mapping:
                 Joint Velocities ───[ J(q) ]───▶ End-Effector Twist
                       q_dot                             ν
                         ▲                               │
                         │       Duality Transpose       │
                         │                               ▼
                 Actuator Torques ◀──[ J^T(q) ]─── External Wrench
                        τ                                F
                            Static Force Mapping
```

This fundamental duality reveals:
1. The **transpose** of the Jacobian maps external Cartesian forces and moments back to internal motor torques!
2. Directions in which the robot has high velocity capability ($J$ is large) have low mechanical force capability ($J^T$ requires large motor torque).

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation for calculating the Geometric Jacobian and verifying it against numerical finite differences:

```typescript
export interface ForwardKinematicsResult {
  endEffectorPos: { x: number; y: number; z: number };
  jointPositions: { x: number; y: number; z: number }[];
  jointAxesZ: { x: number; y: number; z: number }[];
}

export class JacobianEngine {
  /**
   * Computes the 6 x n Geometric Jacobian matrix from forward kinematics geometry.
   */
  public static computeGeometricJacobian(
    fk: ForwardKinematicsResult,
    isRevolute: boolean[]
  ): number[][] {
    const n = fk.jointAxesZ.length;
    const pe = fk.endEffectorPos;

    // 6 rows x n cols
    const J: number[][] = Array.from({ length: 6 }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      const z = fk.jointAxesZ[i];
      const p = fk.jointPositions[i];

      if (isRevolute[i]) {
        // J_v = z x (pe - p)
        const rx = pe.x - p.x;
        const ry = pe.y - p.y;
        const rz = pe.z - p.z;

        const jvx = z.y * rz - z.z * ry;
        const jvy = z.z * rx - z.x * rz;
        const jvz = z.x * ry - z.y * rx;

        J[0][i] = jvx;
        J[1][i] = jvy;
        J[2][i] = jvz;

        // J_omega = z
        J[3][i] = z.x;
        J[4][i] = z.y;
        J[5][i] = z.z;
      } else {
        // Prismatic: J_v = z, J_omega = 0
        J[0][i] = z.x;
        J[1][i] = z.y;
        J[2][i] = z.z;

        J[3][i] = 0;
        J[4][i] = 0;
        J[5][i] = 0;
      }
    }

    return J;
  }

  /**
   * Computes required joint torques tau = J^T * F for a given external wrench F.
   */
  public static computeStaticTorques(J: number[][], wrench: number[]): number[] {
    const n = J[0].length;
    const tau: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let r = 0; r < 6; r++) {
        sum += J[r][i] * wrench[r];
      }
      tau[i] = sum;
    }
    return tau;
  }

  /**
   * Verifies the Jacobian via numerical central finite differences:
   * d(pos) / d(q_i) approx (pos(q + eps) - pos(q - eps)) / (2 * eps)
   */
  public static verifyNumericalJacobian(
    fkFunction: (q: number[]) => { x: number; y: number; z: number },
    q: number[],
    analyticalJv: number[][],
    eps: number = 1e-6
  ): boolean {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const qPlus = [...q];
      const qMinus = [...q];
      qPlus[i] += eps;
      qMinus[i] -= eps;

      const posPlus = fkFunction(qPlus);
      const posMinus = fkFunction(qMinus);

      const numVx = (posPlus.x - posMinus.x) / (2 * eps);
      const numVy = (posPlus.y - posMinus.y) / (2 * eps);
      const numVz = (posPlus.z - posMinus.z) / (2 * eps);

      const tol = 1e-4;
      if (
        Math.abs(numVx - analyticalJv[0][i]) > tol ||
        Math.abs(numVy - analyticalJv[1][i]) > tol ||
        Math.abs(numVz - analyticalJv[2][i]) > tol
      ) {
        return false;
      }
    }
    return true;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 6.1: Geometric Jacobian Derivation for a 2R Planar Manipulator
**Problem Statement:** Consider a 2R planar manipulator operating in the $xy$-plane with link lengths $L_1$ and $L_2$.
1. Derive the $2 \times 2$ Jacobian matrix relating joint velocities $(\dot{\theta}_1, \dot{\theta}_2)$ to linear velocities $(\dot{x}, \dot{y})$ of the end-effector.
2. Verify the result by differentiating the forward kinematics equations directly.

**Given Data:**
- $x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2)$
- $y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2)$
- $z_0 = [0, 0, 1]^T, p_0 = [0, 0, 0]^T$
- $z_1 = [0, 0, 1]^T, p_1 = [L_1\cos\theta_1, L_1\sin\theta_1, 0]^T$
- $p_e = [x, y, 0]^T$

**Step-by-Step Derivation:**
1. Column 1 (Joint 1):
   $$p_e - p_0 = \begin{bmatrix} L_1\cos\theta_1 + L_2\cos\theta_{12} \\ L_1\sin\theta_1 + L_2\sin\theta_{12} \\ 0 \end{bmatrix}$$
   $$J_{v, 1} = z_0 \times (p_e - p_0) = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1\cos\theta_1 + L_2\cos\theta_{12} \\ L_1\sin\theta_1 + L_2\sin\theta_{12} \\ 0 \end{bmatrix} = \begin{bmatrix} -L_1\sin\theta_1 - L_2\sin\theta_{12} \\ L_1\cos\theta_1 + L_2\cos\theta_{12} \\ 0 \end{bmatrix}$$
2. Column 2 (Joint 2):
   $$p_e - p_1 = \begin{bmatrix} (L_1\cos\theta_1 + L_2\cos\theta_{12}) - L_1\cos\theta_1 \\ (L_1\sin\theta_1 + L_2\sin\theta_{12}) - L_1\sin\theta_1 \\ 0 \end{bmatrix} = \begin{bmatrix} L_2\cos\theta_{12} \\ L_2\sin\theta_{12} \\ 0 \end{bmatrix}$$
   $$J_{v, 2} = z_1 \times (p_e - p_1) = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_2\cos\theta_{12} \\ L_2\sin\theta_{12} \\ 0 \end{bmatrix} = \begin{bmatrix} -L_2\sin\theta_{12} \\ L_2\cos\theta_{12} \\ 0 \end{bmatrix}$$
3. Direct Differentiation of Forward Kinematics:
   $$\dot{x} = \frac{\partial x}{\partial \theta_1}\dot{\theta}_1 + \frac{\partial x}{\partial \theta_2}\dot{\theta}_2 = (-L_1\sin\theta_1 - L_2\sin\theta_{12})\dot{\theta}_1 + (-L_2\sin\theta_{12})\dot{\theta}_2$$
   $$\dot{y} = \frac{\partial y}{\partial \theta_1}\dot{\theta}_1 + \frac{\partial y}{\partial \theta_2}\dot{\theta}_2 = (L_1\cos\theta_1 + L_2\cos\theta_{12})\dot{\theta}_1 + (L_2\cos\theta_{12})\dot{\theta}_2$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -L_1\sin\theta_1 - L_2\sin(\theta_1 + \theta_2) & -L_2\sin(\theta_1 + \theta_2) \\ L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) & L_2\cos(\theta_1 + \theta_2) \end{bmatrix}$$

**Verification & Sanity Check:**
Both methods yield identical matrix entries. Column 2 depends only on link 2 because joint 2 does not translate link 1.

---

### Problem 6.2: End-Effector Cartesian Velocity Calculation
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is at configuration $(\theta_1, \theta_2) = (0^\circ, 90^\circ) = (0, \pi/2)$. The joint motors are running at $\dot{\theta}_1 = 1.0\text{ rad/s}$ and $\dot{\theta}_2 = -2.0\text{ rad/s}$. Calculate the Cartesian linear velocity vector $(\dot{x}, \dot{y})$ of the end-effector.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $\theta_1 = 0, \theta_2 = \pi/2 \implies \theta_{12} = \pi/2$
- $\sin(0) = 0, \cos(0) = 1$
- $\sin(\pi/2) = 1, \cos(\pi/2) = 0$
- $\dot{\theta} = [1.0, -2.0]^T$

**Step-by-Step Derivation:**
1. Evaluate the Jacobian matrix entries from Problem 6.1:
   $$J_{11} = -1.0\sin(0) - 1.0\sin(\pi/2) = 0 - 1.0 = -1.0$$
   $$J_{12} = -1.0\sin(\pi/2) = -1.0$$
   $$J_{21} = 1.0\cos(0) + 1.0\cos(\pi/2) = 1.0(1) + 1.0(0) = +1.0$$
   $$J_{22} = 1.0\cos(\pi/2) = 0.0$$
   $$J = \begin{bmatrix} -1.0 & -1.0 \\ 1.0 & 0.0 \end{bmatrix}$$
2. Compute Cartesian velocity $\begin{bmatrix} \dot{x} \\ \dot{y} \end{bmatrix} = J \begin{bmatrix} \dot{\theta}_1 \\ \dot{\theta}_2 \end{bmatrix}$:
   $$\dot{x} = J_{11}\dot{\theta}_1 + J_{12}\dot{\theta}_2 = -1.0(1.0) + (-1.0)(-2.0) = -1.0 + 2.0 = +1.0\text{ m/s}$$
   $$\dot{y} = J_{21}\dot{\theta}_1 + J_{22}\dot{\theta}_2 = 1.0(1.0) + 0.0(-2.0) = +1.0\text{ m/s}$$

**Final Answer:**
The end-effector Cartesian velocity is **$\begin{bmatrix} \dot{x} \\ \dot{y} \end{bmatrix} = \begin{bmatrix} +1.0 \\ +1.0 \end{bmatrix}\text{ m/s}$**, with speed $\|\nu\| = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1.4142\text{ m/s}$.

**Verification & Sanity Check:**
- At this configuration, link 1 is horizontal ($[1, 0]$), link 2 points vertically up ($[0, 1]$).
- Joint 1 rotates counter-clockwise ($+1\text{ rad/s}$): pushes link 2 tip upward ($+y$) and leftward ($-x$).
- Joint 2 rotates clockwise ($-2\text{ rad/s}$): pushes link 2 tip strongly rightward ($+x$) without affecting $y$.
- Net horizontal motion: $-1.0 + 2.0 = +1.0\text{ m/s}$. Net vertical motion: $+1.0\text{ m/s}$. Perfectly consistent with physical intuition.

---

### Problem 6.3: Geometric Jacobian of a 3R Planar Manipulator
**Problem Statement:** A 3R planar manipulator has link lengths $L_1, L_2, L_3$ and joint angles $\theta_1, \theta_2, \theta_3$. Derive the complete $3 \times 3$ Jacobian matrix relating $[\dot{\theta}_1, \dot{\theta}_2, \dot{\theta}_3]^T$ to $[\dot{x}, \dot{y}, \omega_z]^T$.

**Given Data:**
- Link lengths $L_1, L_2, L_3$
- $s_1 = \sin\theta_1, c_1 = \cos\theta_1$
- $s_{12} = \sin(\theta_1 + \theta_2), c_{12} = \cos(\theta_1 + \theta_2)$
- $s_{123} = \sin(\theta_1 + \theta_2 + \theta_3), c_{123} = \cos(\theta_1 + \theta_2 + \theta_3)$

**Step-by-Step Derivation:**
1. Position coordinates of end-effector:
   $$x = L_1 c_1 + L_2 c_{12} + L_3 c_{123}$$
   $$y = L_1 s_1 + L_2 s_{12} + L_3 s_{123}$$
2. Angular velocity:
   Since all three revolute joints rotate about parallel axes $z_0 \parallel z_1 \parallel z_2 \parallel \hat{z}$:
   $$\omega_z = \dot{\theta}_1 + \dot{\theta}_2 + \dot{\theta}_3$$
   Therefore, the third row of the Jacobian is $[1, 1, 1]$.
3. Differentiate $x$ and $y$ with respect to each joint:
   - Column 1:
     $$J_{11} = -L_1 s_1 - L_2 s_{12} - L_3 s_{123}, \quad J_{21} = L_1 c_1 + L_2 c_{12} + L_3 c_{123}$$
   - Column 2:
     $$J_{12} = -L_2 s_{12} - L_3 s_{123}, \quad J_{22} = L_2 c_{12} + L_3 c_{123}$$
   - Column 3:
     $$J_{13} = -L_3 s_{123}, \quad J_{23} = L_3 c_{123}$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} - L_3 s_{123} & -L_2 s_{12} - L_3 s_{123} & -L_3 s_{123} \\ L_1 c_1 + L_2 c_{12} + L_3 c_{123} & L_2 c_{12} + L_3 c_{123} & L_3 c_{123} \\ 1 & 1 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
If only joint 3 rotates, link 3 pivots about $(x_2, y_2)$ with radius $L_3$. Column 3 is $[-L_3 s_{123}, L_3 c_{123}, 1]^T$, the exact circular velocity around joint 3.

---

### Problem 6.4: Geometric Jacobian of a SCARA Manipulator (RRPR)
**Problem Statement:** A SCARA robot has two horizontal revolute links ($L_1, L_2$), a vertical prismatic joint ($d_3$), and a wrist roll ($\theta_4$). Derive its $6 \times 4$ Geometric Jacobian matrix.

**Given Data:**
- Joints 1, 2, 4: Revolute about vertical $\hat{z}$.
- Joint 3: Prismatic along $-\hat{z}$.

**Step-by-Step Derivation:**
1. Column 1 (Joint 1, R about $\hat{z}$ at origin):
   $$J_1 = \begin{bmatrix} z_0 \times p_e \\ z_0 \end{bmatrix} = \begin{bmatrix} -y \\ x \\ 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
2. Column 2 (Joint 2, R about $\hat{z}$ at $p_1$):
   $$p_e - p_1 = [L_2 c_{12}, L_2 s_{12}, -d_3]^T$$
   $$J_2 = \begin{bmatrix} z_1 \times (p_e - p_1) \\ z_1 \end{bmatrix} = \begin{bmatrix} -L_2 s_{12} \\ L_2 c_{12} \\ 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Column 3 (Joint 3, P along $-\hat{z}$):
   $$J_3 = \begin{bmatrix} z_2 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ -1 \\ 0 \\ 0 \\ 0 \end{bmatrix}$$
4. Column 4 (Joint 4, R about $\hat{z}$ at end-effector tip, $p_e - p_3 = 0$):
   $$J_4 = \begin{bmatrix} z_3 \times 0 \\ z_3 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} & 0 & 0 \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 1 & 1 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
Rows 4 and 5 (rotations about $\hat{x}$ and $\hat{y}$) are identically zero because all motion is strictly confined to horizontal planes and vertical translation.

---

### Problem 6.5: Cylindrical Robot (RPP) Geometric Jacobian
**Problem Statement:** A cylindrical robot has:
- Joint 1: Revolute about $z_0 = [0, 0, 1]^T$ at origin.
- Joint 2: Prismatic along $z_1 = [0, 0, 1]^T$.
- Joint 3: Prismatic along radial horizontal axis $z_2 = [\cos\theta_1, \sin\theta_1, 0]^T$.
Derive the $6 \times 3$ Geometric Jacobian.

**Given Data:**
- $p_e = [r\cos\theta_1, r\sin\theta_1, z]^T$ where $r = d_3, z = d_2$.

**Step-by-Step Derivation:**
1. Column 1 (Revolute waist $\theta_1$):
   $$J_{v, 1} = z_0 \times p_e = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} r\cos\theta_1 \\ r\sin\theta_1 \\ z \end{bmatrix} = \begin{bmatrix} -r\sin\theta_1 \\ r\cos\theta_1 \\ 0 \end{bmatrix}, \quad J_{\omega, 1} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
2. Column 2 (Prismatic height $d_2$):
   $$J_{v, 2} = z_1 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}, \quad J_{\omega, 2} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
3. Column 3 (Prismatic radius $d_3$):
   $$J_{v, 3} = z_2 = \begin{bmatrix} \cos\theta_1 \\ \sin\theta_1 \\ 0 \end{bmatrix}, \quad J_{\omega, 3} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -r\sin\theta_1 & 0 & \cos\theta_1 \\ r\cos\theta_1 & 0 & \sin\theta_1 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \\ 1 & 0 & 0 \end{bmatrix}$$

**Verification & Sanity Check:**
Extract the $3 \times 3$ linear velocity Jacobian $J_v$:
$\det(J_v) = -r\sin\theta_1(0 - \sin\theta_1) + \cos\theta_1(r\cos\theta_1 - 0) = r\sin^2\theta_1 + r\cos^2\theta_1 = r$.
Matches the Jacobian determinant of cylindrical coordinates: $dx\, dy\, dz = r\, dr\, d\theta\, dz$.

---

### Problem 6.6: Euler Angle Velocity Transformation Matrix $E(\phi)$
**Problem Statement:** Derive the transformation matrix $E(\phi) \in \mathbb{R}^{3 \times 3}$ relating physical angular velocity $\omega$ to $Z-Y-X$ Euler angle rates $[\dot{\phi}_z, \dot{\phi}_y, \dot{\phi}_x]^T$.

**Given Data:**
- Rotation sequence: $R = R_z(\phi_z) R_y(\phi_y) R_x(\phi_x)$

**Step-by-Step Derivation:**
1. The total angular velocity is the sum of rotations about the successive intermediate axes:
   $$\omega = \dot{\phi}_z \hat{z}_0 + \dot{\phi}_y \hat{y}_1 + \dot{\phi}_x \hat{x}_2$$
2. Express each unit vector in base frame coordinates:
   - $\hat{z}_0 = [0, 0, 1]^T$
   - $\hat{y}_1 = R_z(\phi_z) [0, 1, 0]^T = [-\sin\phi_z, \cos\phi_z, 0]^T$
   - $\hat{x}_2 = R_z(\phi_z) R_y(\phi_y) [1, 0, 0]^T = \begin{bmatrix} \cos\phi_z & -\sin\phi_z & 0 \\ \sin\phi_z & \cos\phi_z & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \cos\phi_y \\ 0 \\ -\sin\phi_y \end{bmatrix} = \begin{bmatrix} \cos\phi_z\cos\phi_y \\ \sin\phi_z\cos\phi_y \\ -\sin\phi_y \end{bmatrix}$
3. Combine into matrix form $\omega = E(\phi) \dot{\phi}$:
   $$E(\phi) = \begin{bmatrix} 0 & -\sin\phi_z & \cos\phi_z\cos\phi_y \\ 0 & \cos\phi_z & \sin\phi_z\cos\phi_y \\ 1 & 0 & -\sin\phi_y \end{bmatrix}$$

**Final Answer:**
$$E(\phi) = \begin{bmatrix} 0 & -\sin\phi_z & \cos\phi_z\cos\phi_y \\ 0 & \cos\phi_z & \sin\phi_z\cos\phi_y \\ 1 & 0 & -\sin\phi_y \end{bmatrix}$$

**Verification & Sanity Check:**
If $\phi_z = 0, \phi_y = 0, \phi_x = 0$, $E = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{bmatrix}$, which maps yaw to $z$, pitch to $y$, and roll to $x$.

---

### Problem 6.7: Static Force Transmission on a 2R Planar Arm
**Problem Statement:** A 2R planar manipulator with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is at configuration $(\theta_1, \theta_2) = (0^\circ, 90^\circ)$. Its end-effector exerts a horizontal force of $F_x = 100\text{ N}$ against a wall ($F = [100, 0]^T\text{ N}$). Calculate the motor torques $\tau_1, \tau_2$ required to maintain static equilibrium.

**Given Data:**
- $J = \begin{bmatrix} -1.0 & -1.0 \\ 1.0 & 0.0 \end{bmatrix}$ (from Problem 6.2)
- $F = [100.0, 0.0]^T\text{ N}$

**Step-by-Step Derivation:**
1. Apply the static duality formula $\tau = J^T F$:
   $$\tau = \begin{bmatrix} J_{11} & J_{21} \\ J_{12} & J_{22} \end{bmatrix} \begin{bmatrix} F_x \\ F_y \end{bmatrix} = \begin{bmatrix} -1.0 & 1.0 \\ -1.0 & 0.0 \end{bmatrix} \begin{bmatrix} 100.0 \\ 0.0 \end{bmatrix}$$
2. Compute the matrix product:
   $$\tau_1 = (-1.0)(100.0) + (1.0)(0.0) = -100.0\text{ N}\cdot\text{m}$$
   $$\tau_2 = (-1.0)(100.0) + (0.0)(0.0) = -100.0\text{ N}\cdot\text{m}$$

**Final Answer:**
The required motor torques are **$\tau_1 = -100.0\text{ N}\cdot\text{m}$** and **$\tau_2 = -100.0\text{ N}\cdot\text{m}$**.

**Verification & Sanity Check:**
- The end-effector is at $(1.0, 1.0)$.
- A force of $100\text{ N}$ pushing rightward along $+x$ exerts a counter-clockwise torque about Joint 2 (at $(1, 0)$) of $\tau = 100\text{ N} \times 1.0\text{ m} = 100\text{ N}\cdot\text{m}$. To resist this, motor 2 must apply $-100\text{ N}\cdot\text{m}$.
- About Joint 1 (at $(0, 0)$), the moment arm for horizontal force is also the vertical distance $y = 1.0\text{ m}$, requiring motor 1 to apply $-100\text{ N}\cdot\text{m}$. Static torque mechanics matches $J^T F$ perfectly.

---

### Problem 6.8: Geometric Jacobian of an Anthropomorphic 3-DoF Arm
**Problem Statement:** An anthropomorphic arm has:
- Joint 1: Waist rotation about $z_0 = [0, 0, 1]^T$ at origin.
- Joint 2: Shoulder pitch about horizontal axis $z_1 = [-\sin\theta_1, \cos\theta_1, 0]^T$ at $[0, 0, H_1]^T$.
- Joint 3: Elbow pitch about parallel axis $z_2 = z_1$ at distance $L_1$ from shoulder.
Derive the linear velocity Jacobian columns $J_{v, 1}, J_{v, 2}, J_{v, 3}$.

**Step-by-Step Derivation:**
1. Column 1:
   $$J_{v, 1} = z_0 \times p_e = [0, 0, 1]^T \times [x_e, y_e, z_e]^T = [-y_e, x_e, 0]^T$$
2. Column 2:
   Let $r_1 = p_e - p_1$:
   $$J_{v, 2} = z_1 \times (p_e - p_1)$$
3. Column 3:
   Let $r_2 = p_e - p_2$:
   $$J_{v, 3} = z_2 \times (p_e - p_2)$$
   Because $z_2 = z_1$ (parallel pitch axes):
   $$J_{v, 3} = z_1 \times (p_e - p_2)$$

**Final Answer:**
- $J_{v, 1} = [-y_e, x_e, 0]^T$
- $J_{v, 2} = z_1 \times (p_e - p_1)$
- $J_{v, 3} = z_1 \times (p_e - p_2)$

**Verification & Sanity Check:**
Joint 1 produces purely horizontal azimuthal velocity perpendicular to $p_e$. Joints 2 and 3 produce motion strictly in the vertical elevation plane containing the arm.

---

### Problem 6.9: Space vs. Body Manipulator Jacobian
**Problem Statement:** Prove that the Spatial Jacobian $J_s(q)$ and Body Jacobian $J_b(q)$ are related by $J_s(q) = \operatorname{Ad}_{T_{sb}(q)} J_b(q)$.

**Step-by-Step Derivation:**
1. Spatial velocity is $\mathcal{V}_s = J_s(q) \dot{q}$.
2. Body velocity is $\mathcal{V}_b = J_b(q) \dot{q}$.
3. Recall from Chapter 2 that spatial and body twists are related by the adjoint map of the current transformation:
   $$\mathcal{V}_s = \operatorname{Ad}_{T_{sb}(q)} \mathcal{V}_b$$
4. Substitute the Jacobian mappings:
   $$J_s(q) \dot{q} = \operatorname{Ad}_{T_{sb}(q)} (J_b(q) \dot{q}) = (\operatorname{Ad}_{T_{sb}(q)} J_b(q)) \dot{q}$$
5. Because this must hold for any arbitrary velocity vector $\dot{q} \in \mathbb{R}^n$:
   $$J_s(q) = \operatorname{Ad}_{T_{sb}(q)} J_b(q)$$

**Final Answer:**
$$J_s(q) = \operatorname{Ad}_{T_{sb}(q)} J_b(q)$$

**Verification & Sanity Check:**
Inverting yields $J_b(q) = \operatorname{Ad}_{T_{sb}^{-1}(q)} J_s(q) = \operatorname{Ad}_{T_{bs}(q)} J_s(q)$.

---

### Problem 6.10: Finite Difference Numerical Verification of Jacobian
**Problem Statement:** A 2R planar arm has $L_1 = 1.0, L_2 = 0.5$ at $q = [30^\circ, 45^\circ]$.
1. Evaluate the analytical linear Jacobian $J_v$.
2. Compute the central finite difference estimate of $\frac{\partial p}{\partial \theta_1}$ using step size $\epsilon = 10^{-5}\text{ rad}$.

**Given Data:**
- $\theta_1 = 30^\circ = 0.523599\text{ rad}$
- $\theta_2 = 45^\circ = 0.785398\text{ rad}$
- $\theta_{12} = 75^\circ = 1.308997\text{ rad}$

**Step-by-Step Derivation:**
1. Analytical Column 1:
   $$J_{11} = -1.0\sin(30^\circ) - 0.5\sin(75^\circ) = -0.500000 - 0.5(0.965926) = -0.500000 - 0.482963 = -0.982963$$
   $$J_{21} = 1.0\cos(30^\circ) + 0.5\cos(75^\circ) = 0.866025 + 0.5(0.258819) = 0.866025 + 0.129410 = 0.995435$$
2. Numerical Central Difference for Joint 1:
   Let $\epsilon = 10^{-5}$.
   - Forward state $q^+ = [0.523599 + 10^{-5}, 0.785398]$:
     $$x^+ = 1.0\cos(0.523609) + 0.5\cos(1.309007) \approx 0.995425$$
     $$y^+ = 1.0\sin(0.523609) + 0.5\sin(1.309007) \approx 0.982973$$
   - Backward state $q^- = [0.523599 - 10^{-5}, 0.785398]$:
     $$x^- = 1.0\cos(0.523589) + 0.5\cos(1.308987) \approx 0.995445$$
     $$y^- = 1.0\sin(0.523589) + 0.5\sin(1.308987) \approx 0.982953$$
   - Finite difference:
     $$\frac{\Delta x}{2\epsilon} = \frac{0.995425 - 0.995445}{2 \times 10^{-5}} = -0.982963$$
     $$\frac{\Delta y}{2\epsilon} = \frac{0.982973 - 0.982953}{2 \times 10^{-5}} = +0.995435$$

**Final Answer:**
- Analytical: $[-0.982963, 0.995435]^T$
- Numerical: $[-0.982963, 0.995435]^T$
- Error: **$< 10^{-8}$** (machine precision match).

**Verification & Sanity Check:**
Confirms that the geometric cross-product formulation matches the infinitesimal analytical calculus of the forward kinematics.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 6.11: Instantaneous Center of Rotation (ICR)
**Problem Statement:** For a 2R planar arm, show that the Instantaneous Center of Rotation (ICR) of link 2 is located at Joint 2 when Joint 1 is fixed ($\dot{\theta}_1 = 0$), and locate the ICR when both joints rotate at equal and opposite rates ($\dot{\theta}_2 = -\dot{\theta}_1$).

**Solution:**
1. When $\dot{\theta}_1 = 0$, link 1 is stationary. Joint 2 is a fixed pivot, so link 2 rotates purely around Joint 2: ICR is at $p_1$.
2. When $\dot{\theta}_2 = -\dot{\theta}_1$, the total orientation rate is $\omega = \dot{\theta}_1 + \dot{\theta}_2 = 0$.
3. Since $\omega = 0$, the motion of link 2 is pure translation without rotation!
4. The Instantaneous Center of Rotation lies at infinity along the perpendicular to velocity $v$.

---

### Problem 6.12: PUMA 560 Jacobian Structure
**Problem Statement:** Show that the $6 \times 6$ Jacobian of the PUMA 560 can be partitioned into block triangular form when evaluated at the wrist center $p_w$.

**Solution:**
1. Place the point of interest at the wrist center $p_w = p_3 = p_4 = p_5$.
2. For joints 4, 5, 6, $p_w - p_{i-1} = 0$.
3. Therefore, $J_{v, 4} = J_{v, 5} = J_{v, 6} = 0$.
4. The Jacobian matrix partitions as:
   $$J(q) = \begin{bmatrix} J_{11} & 0_{3 \times 3} \\ J_{21} & J_{22} \end{bmatrix}$$
5. The determinant is simply $\det(J) = \det(J_{11}) \det(J_{22})$, which drastically simplifies singularity detection and numerical inversion.

---

### Problem 6.13: Stanford Arm Jacobian Column for Prismatic Boom
**Problem Statement:** For the Stanford Arm, joint 3 is a prismatic joint extending along unit vector $z_2 = [\cos\theta_1\sin\theta_2, \sin\theta_1\sin\theta_2, \cos\theta_2]^T$. Write column 3 of the Geometric Jacobian.

**Solution:**
1. A prismatic joint has zero angular velocity contribution: $J_{\omega, 3} = [0, 0, 0]^T$.
2. The linear velocity contribution is its unit direction of motion $z_2$:
   $$J_{v, 3} = z_2 = \begin{bmatrix} \cos\theta_1\sin\theta_2 \\ \sin\theta_1\sin\theta_2 \\ \cos\theta_2 \end{bmatrix}$$
3. Full column:
   $$J_3 = [\cos\theta_1\sin\theta_2, \sin\theta_1\sin\theta_2, \cos\theta_2, 0, 0, 0]^T$$

---

### Problem 6.14: Joint Torques under Gravitational Load
**Problem Statement:** An articulated arm has $n$ links with masses $m_i$ and center-of-mass positions $p_{c, i}$. Express the gravity torque vector $\tau_g(q)$ using the Jacobian matrices of the link centers of mass.

**Solution:**
1. Each link $i$ is subjected to gravitational downward force $f_{g, i} = [0, 0, -m_i g]^T$.
2. Let $J_{v, ci}(q) \in \mathbb{R}^{3 \times n}$ be the linear Jacobian mapping joint velocities $\dot{q}$ to the velocity of center of mass $p_{c, i}$.
3. By the Principle of Virtual Work, the gravity torque vector is:
   $$\tau_g(q) = \sum_{i=1}^n J_{v, ci}^T(q) (m_i g \hat{z})$$
4. This avoids computing multi-link Newtonian force balances by evaluating Jacobian projections.

---

### Problem 6.15: Radial vs. Tangential Velocity Decomposition
**Problem Statement:** For a 2R planar arm, project the end-effector velocity $\nu = J\dot{q}$ into radial velocity $\dot{r}$ and tangential velocity $r\dot{\beta}$.

**Solution:**
1. Let radial distance be $r = \sqrt{x^2 + y^2}$. Differentiating gives $\dot{r} = \frac{x\dot{x} + y\dot{y}}{r}$.
2. In vector notation: $\dot{r} = \hat{u}_r \cdot v$, where $\hat{u}_r = [\cos\beta, \sin\beta]^T$.
3. Tangential velocity: $v_t = \hat{u}_\theta \cdot v$, where $\hat{u}_\theta = [-\sin\beta, \cos\beta]^T$.
4. Substituting $v = J\dot{q}$ yields the polar Jacobian $J_{\text{polar}} = \begin{bmatrix} \hat{u}_r^T J \\ \hat{u}_\theta^T J \end{bmatrix}$.

---

### Problem 6.16: Representation Singularity of $Z-Y-Z$ Euler Angles
**Problem Statement:** Derive the matrix $E(\phi)$ for $Z-Y-Z$ Euler angles and find where $\det(E) = 0$.

**Solution:**
1. Sequence: $R = R_z(\alpha) R_y(\beta) R_z(\gamma)$.
2. Angular velocity: $\omega = \dot{\alpha}\hat{z}_0 + \dot{\beta}\hat{y}_1 + \dot{\gamma}\hat{z}_2$.
3. In matrix form:
   $$E(\phi) = \begin{bmatrix} 0 & -\sin\alpha & \cos\alpha\sin\beta \\ 0 & \cos\alpha & \sin\alpha\sin\beta \\ 1 & 0 & \cos\beta \end{bmatrix}$$
4. Compute the determinant by expanding along row 3:
   $$\det(E) = 1(-\sin\alpha\sin\alpha\sin\beta - \cos\alpha\cos\alpha\sin\beta) = -\sin\beta$$
5. Singularities occur when $\sin\beta = 0 \implies \beta = 0$ or $\beta = \pi$ (wrist pitch aligned with base/tool roll).

---

### Problem 6.17: Virtual Work with Prismatic Actuators
**Problem Statement:** Prove that for a prismatic joint $i$ along axis $z_{i-1}$, $\tau_i = J_i^T \mathcal{F}$ gives the scalar force acting along the slider.

**Solution:**
1. For prismatic joint $i$, $J_i = [z_{i-1}^T, 0_{1 \times 3}]^T$.
2. The wrench is $\mathcal{F} = [f^T, m^T]^T$.
3. Compute the product:
   $$\tau_i = J_i^T \mathcal{F} = [z_{i-1}^T, 0] \begin{bmatrix} f \\ m \end{bmatrix} = z_{i-1} \cdot f$$
4. This is the dot product of the contact force with the sliding axis, which is the exact scalar axial force $f_{\text{axis}}$.

---

### Problem 6.18: Jacobian Column Derivation via Product of Exponentials
**Problem Statement:** Prove that the $i$-th column of the spatial Jacobian is given by $J_{si} = \operatorname{Ad}_{T_{0, i-1}} \mathcal{S}_i$, where $T_{0, i-1} = e^{[\mathcal{S}_1]q_1} \cdots e^{[\mathcal{S}_{i-1}]q_{i-1}}$.

**Solution:**
1. The spatial twist is defined as $[\mathcal{V}_s] = \dot{T} T^{-1}$.
2. From Chapter 4, Problem 4.14:
   $$\dot{T} T^{-1} = \sum_{i=1}^n \left( T_{0, i-1} [\mathcal{S}_i] T_{0, i-1}^{-1} \right) \dot{q}_i$$
3. By the adjoint matrix property:
   $$T_{0, i-1} [\mathcal{S}_i] T_{0, i-1}^{-1} = [\operatorname{Ad}_{T_{0, i-1}} \mathcal{S}_i]$$
4. Therefore, the coefficient of $\dot{q}_i$ is the $i$-th column:
   $$J_{si} = \operatorname{Ad}_{T_{0, i-1}} \mathcal{S}_i$$

---

### Problem 6.19: UR5 Collaborative Robot Jacobian at Home Pose
**Problem Statement:** Evaluate the $6 \times 6$ Spatial Jacobian $J_s$ for the UR5 at home configuration $q = [0, 0, 0, 0, 0, 0]^T$.

**Solution:**
1. At home configuration ($q = 0$), $T_{0, i-1} = I$ for all joints.
2. Therefore, each column of the Spatial Jacobian is simply the spatial screw axis itself:
   $$J_{si}(0) = \operatorname{Ad}_I \mathcal{S}_i = \mathcal{S}_i$$
3. Hence:
   $$J_s(0) = \begin{bmatrix} \mathcal{S}_1 & \mathcal{S}_2 & \mathcal{S}_3 & \mathcal{S}_4 & \mathcal{S}_5 & \mathcal{S}_6 \end{bmatrix}$$
4. The columns are the exact spatial screws derived in Chapter 4, Problem 4.6.

---

### Problem 6.20: Mechanical Energy Conservation Invariant
**Problem Statement:** Prove that power computed in joint space $P_{\text{joint}} = \tau^T \dot{q}$ is identically equal to power computed in task space $P_{\text{task}} = \mathcal{F}^T \nu$.

**Solution:**
1. By the static force duality theorem: $\tau = J^T \mathcal{F}$.
2. Transpose both sides: $\tau^T = \mathcal{F}^T J$.
3. Multiply by joint velocity $\dot{q}$:
   $$P_{\text{joint}} = \tau^T \dot{q} = (\mathcal{F}^T J) \dot{q} = \mathcal{F}^T (J \dot{q})$$
4. By definition of the Jacobian, $J\dot{q} = \nu$:
   $$P_{\text{joint}} = \mathcal{F}^T \nu = P_{\text{task}}$$
5. Instantaneous mechanical power is conserved across the kinematic chain.
