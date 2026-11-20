# Robot Kinematics: Forward Kinematics, DH Parameters, and Inverse Kinematics

---

## 1. The Epistemological Mystery: The Control of Mechanical Limbs

### 1.1 The Forward vs. Inverse Duality
Consider your own human arm. If your brain decides to flex your shoulder joint by $30^\circ$ and your elbow by $45^\circ$, your hand moves to a specific point in space. This is **Forward Kinematics (FK)**:
$$ \vec{\theta} = (\theta_1, \theta_2, \dots, \theta_n) \xrightarrow{\text{FK}} \vec{x}_{\text{hand}} = (x, y, z) $$
Forward kinematics is straightforward, continuous, and has a unique, deterministic solution.

Now consider the inverse task: reaching out your coffee cup sitting at coordinates $(0.4, 0.2, 0.1)$. Your brain must calculate: *which exact motor angles must your shoulder, elbow, and wrist joints adopt to position your hand at that cup?*  
This is **Inverse Kinematics (IK)**:
$$ \vec{x}_{\text{target}} \xrightarrow{\text{IK}} \vec{\theta} $$
Inverse kinematics is a notoriously difficult mathematical inverse problem:
- **Non-Linearity:** Trigonometric functions ($\sin, \cos$) entangle the joint angles.
- **Multiple Solutions:** You can touch the cup with your elbow pointing up ("elbow-up") or your elbow pointing down ("elbow-down").
- **Kinematic Singularities:** If the cup is slightly beyond your reach, or if your arm is fully straightened, certain directions of motion become physically impossible, and required joint speeds blow up to infinity!

---

## 2. Forward Kinematics & The Denavit-Hartenberg (DH) Convention

A serial robotic manipulator consists of rigid bodies (**links**) connected by motorized revolute or prismatic **joints**.

### 2.1 The Denavit-Hartenberg (DH) Parameters (1955)
In 1955, Jacques Denavit and Richard Hartenberg introduced a standard convention to represent the relative spatial transformation between any two consecutive links using exactly **four geometric parameters**:

```
 Joint i-1                Link i-1                Joint i
   ════                   ─────────────────        ════
    ││                                              ││
   ───────+----------------------------------------+───────> Z_i (Axis of rotation)
          │◄─────────── Link offset d_i ──────────►│
          │                                        │
          │                                        │ Link length a_i
          │                                        ▼
         X_{i-1}                                  X_i
```

1. **$a_i$ (Link Length):** Distance along $x_i$ from $z_{i-1}$ to $z_i$.
2. **$\alpha_i$ (Link Twist):** Angle about $x_i$ from $z_{i-1}$ to $z_i$.
3. **$d_i$ (Link Offset):** Distance along $z_{i-1}$ from $x_{i-1}$ to $x_i$.
4. **$\theta_i$ (Joint Angle):** Angle about $z_{i-1}$ from $x_{i-1}$ to $x_i$ (variable for revolute joints).

### 2.2 The Homogeneous Link Transform Matrix ($A_i$)
The $4 \times 4$ transformation from frame $i-1$ to frame $i$ is:

$$ A_i = \text{Rot}_z(\theta_i) \cdot \text{Trans}_z(d_i) \cdot \text{Trans}_x(a_i) \cdot \text{Rot}_x(\alpha_i) $$

$$ \mathbf{A_i = \begin{bmatrix}
\cos\theta_i & -\sin\theta_i \cos\alpha_i & \sin\theta_i \sin\alpha_i & a_i \cos\theta_i \\
\sin\theta_i & \cos\theta_i \cos\alpha_i & -\cos\theta_i \sin\alpha_i & a_i \sin\theta_i \\
0 & \sin\alpha_i & \cos\alpha_i & d_i \\
0 & 0 & 0 & 1
\end{bmatrix}} $$

The end-effector pose relative to the world base is the chain product of all link matrices:
$$ T_n^0 = A_1 \cdot A_2 \cdots A_n $$

---

## 3. The Robot Jacobian Matrix ($J$) & Differential Kinematics

The **Geometric Jacobian** $J(\vec{\theta})$ is the multidimensional derivative relating instantaneous joint angular velocities $\dot{\vec{\theta}}$ to the linear velocity $\vec{v}_{\text{ee}}$ and angular velocity $\vec{\omega}_{\text{ee}}$ of the end-effector:

$$ \mathbf{\begin{bmatrix} \vec{v}_{\text{ee}} \\ \vec{\omega}_{\text{ee}} \end{bmatrix} = \dot{\vec{x}} = J(\vec{\theta}) \dot{\vec{\theta}}} $$

For a 6-DoF robot, $J(\vec{\theta})$ is a $6 \times n$ matrix:
$$ J = \begin{bmatrix} J_{v, 1} & J_{v, 2} & \dots & J_{v, n} \\ J_{\omega, 1} & J_{\omega, 2} & \dots & J_{\omega, n} \end{bmatrix} $$

For a revolute joint $i$:
$$ J_{v, i} = \hat{z}_{i-1} \times (\vec{p}_{\text{ee}} - \vec{p}_{i-1}) $$
$$ J_{\omega, i} = \hat{z}_{i-1} $$
where $\hat{z}_{i-1}$ is the unit rotation axis of joint $i$, and $\vec{p}_{i-1}$ is its position in world space.

### 3.1 Kinematic Singularities
A **singularity** occurs at configurations $\vec{\theta}$ where the Jacobian matrix loses full rank:
$$ \det(J(\vec{\theta})) = 0 \quad (\text{or } \text{rank}(J) < m) $$
- **Physical Meaning:** The arm is locked or stretched out such that motion in one or more Cartesian directions is physically impossible.
- **Divergence Hazard:** Attempting to move across a singularity requires infinite joint velocities ($\dot{\vec{\theta}} = J^{-1} \dot{\vec{x}} \to \infty$), causing real robotic motors to trip safety breakers!

---

## 4. Numerical Inverse Kinematics Solvers

When analytical equations cannot be solved, we solve IK iteratively by minimizing the Cartesian position error:
$$ \vec{e} = \vec{x}_{\text{target}} - \vec{x}_{\text{current}}(\vec{\theta}) $$

### 4.1 Jacobian Transpose Method
Using gradient descent directly in joint space:
$$ \mathbf{\Delta \vec{\theta} = \alpha J^T \vec{e}} $$
- *Advantage:* Highly stable, never diverges near singularities ($J^T$ is always defined).
- *Disadvantage:* Slow convergence; requires many iterations.

### 4.2 Jacobian Pseudoinverse (Moore-Penrose)
Inverting the linear approximation $\vec{e} = J \Delta \vec{\theta}$:
$$ \mathbf{\Delta \vec{\theta} = J^+ \vec{e} = J^T (J J^T)^{-1} \vec{e}} $$
- *Advantage:* Extremely fast, quadratic convergence.
- *Fatal Flaw:* Near singularities, $\det(J J^T) \to 0$, causing $(J J^T)^{-1}$ to explode, commanding violent joint spasms.

### 4.3 Damped Least Squares (DLS / Levenberg-Marquardt)
The gold standard for real-world robotics: balance target tracking error against joint movement magnitude by adding a damping factor $\lambda^2$:
$$ \min_{\Delta \vec{\theta}} \left( \|J \Delta \vec{\theta} - \vec{e}\|^2 + \lambda^2 \|\Delta \vec{\theta}\|^2 \right) $$

Solving this regularized least-squares problem:
$$ \mathbf{\Delta \vec{\theta} = J^T (J J^T + \lambda^2 I)^{-1} \vec{e}} $$
- In open space: $\lambda^2$ has negligible effect, yielding high-speed pseudoinverse convergence.
- Near singularities: $\lambda^2 I$ prevents the matrix from becoming singular, gracefully slowing down motion and eliminating erratic jerking!

---

## 5. Multi-Tiered Worked Examples

### Level 1: Analytical Forward and Inverse Kinematics of a 2-Link Planar Arm
Consider a 2D robotic arm with link lengths $L_1 = 1.0 \text{ m}$ and $L_2 = 1.0 \text{ m}$ in the XY-plane:
Joint 1 angle $\theta_1$ at origin $(0, 0)$; Joint 2 angle $\theta_2$ relative to link 1.

**Forward Kinematics:**
$$ x = L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2) $$
$$ y = L_1 \sin\theta_1 + L_2 \sin(\theta_1 + \theta_2) $$

**Inverse Kinematics Derivation:**
Given target $(x, y)$, calculate distance squared from origin:
$$ r^2 = x^2 + y^2 = (L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2))^2 + (L_1 \sin\theta_1 + L_2 \sin(\theta_1 + \theta_2))^2 $$
Expanding and using trigonometric identity $\cos A \cos B + \sin A \sin B = \cos(A - B)$:
$$ r^2 = L_1^2 + L_2^2 + 2 L_1 L_2 \cos\theta_2 $$

Solving for $\theta_2$ via the Law of Cosines:
$$ \mathbf{\cos\theta_2 = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}} $$
$$ \theta_2 = \pm \arccos\left(\frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}\right) $$
*(Notice: The $\pm$ corresponds exactly to "Elbow-Down" ($+\theta_2$) and "Elbow-Up" ($-\theta_2$)!)*

Solving for $\theta_1$:
$$ \mathbf{\theta_1 = \text{atan2}(y, x) - \text{atan2}(L_2 \sin\theta_2, L_1 + L_2 \cos\theta_2)} $$

**Numerical Evaluation:**
Reach target $(x = 1.0, y = 1.0)$ with $L_1 = 1.0, L_2 = 1.0$:
$$ \cos\theta_2 = \frac{1^2 + 1^2 - 1^2 - 1^2}{2(1)(1)} = \frac{0}{2} = 0 \implies \theta_2 = +90^\circ \text{ (Elbow-Down)} $$
$$ \theta_1 = \text{atan2}(1, 1) - \text{atan2}(1 \sin 90^\circ, 1 + 1 \cos 90^\circ) = 45^\circ - \text{atan2}(1, 1) = 45^\circ - 45^\circ = \mathbf{0^\circ} $$
Verification: $\vec{\theta} = (0^\circ, 90^\circ)$:
$x = 1.0 \cos 0^\circ + 1.0 \cos 90^\circ = 1.0 + 0 = 1.0$  
$y = 1.0 \sin 0^\circ + 1.0 \sin 90^\circ = 0 + 1.0 = 1.0$ (Exact match!).

---

### Level 2: Deriving the 2-Link Arm Jacobian & Singularity
Differentiate the FK equations with respect to $\theta_1$ and $\theta_2$:
$$ J = \begin{bmatrix} \frac{\partial x}{\partial \theta_1} & \frac{\partial x}{\partial \theta_2} \\ \frac{\partial y}{\partial \theta_1} & \frac{\partial y}{\partial \theta_2} \end{bmatrix} = \begin{bmatrix} -L_1 \sin\theta_1 - L_2 \sin(\theta_1 + \theta_2) & -L_2 \sin(\theta_1 + \theta_2) \\ L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2) & L_2 \cos(\theta_1 + \theta_2) \end{bmatrix} $$

Computing the determinant:
$$ \det(J) = (-L_1 \sin\theta_1 - L_2 \sin(\theta_1 + \theta_2))(L_2 \cos(\theta_1 + \theta_2)) - (-L_2 \sin(\theta_1 + \theta_2))(L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2)) $$
$$ = -L_1 L_2 \sin\theta_1 \cos(\theta_1 + \theta_2) + L_1 L_2 \cos\theta_1 \sin(\theta_1 + \theta_2) $$
$$ = L_1 L_2 \sin((\theta_1 + \theta_2) - \theta_1) = \mathbf{L_1 L_2 \sin\theta_2} $$

**Singularity Condition:**
$$ \det(J) = 0 \iff \sin\theta_2 = 0 \implies \mathbf{\theta_2 = 0^\circ \text{ or } \theta_2 = 180^\circ} $$
- $\theta_2 = 0^\circ$: The arm is fully extended to maximum reach ($r = L_1 + L_2$). It cannot move radially outward!
- $\theta_2 = 180^\circ$: The arm is folded completely back onto itself ($r = |L_1 - L_2|$).

---

## 6. Production-Ready Computational Engine: 2-Link DLS Inverse Kinematics

```typescript
export class Planar2LinkIK {
  public l1: number;
  public l2: number;

  constructor(l1 = 1.0, l2 = 1.0) {
    this.l1 = l1;
    this.l2 = l2;
  }

  public forwardKinematics(theta1: number, theta2: number): { x: number; y: number } {
    return {
      x: this.l1 * Math.cos(theta1) + this.l2 * Math.cos(theta1 + theta2),
      y: this.l1 * Math.sin(theta1) + this.l2 * Math.sin(theta1 + theta2)
    };
  }

  /**
   * Solves Inverse Kinematics numerically using Damped Least Squares (DLS).
   */
  public solveDLS(
    targetX: number,
    targetY: number,
    initialTheta1 = 0.1,
    initialTheta2 = 0.1,
    maxIterations = 50,
    tolerance = 1e-4,
    lambda = 0.1
  ): { theta1: number; theta2: number; converged: boolean } {
    let t1 = initialTheta1;
    let t2 = initialTheta2;
    const lambdaSq = lambda * lambda;

    for (let iter = 0; iter < maxIterations; iter++) {
      const current = this.forwardKinematics(t1, t2);
      const ex = targetX - current.x;
      const ey = targetY - current.y;
      const errorDist = Math.hypot(ex, ey);

      if (errorDist < tolerance) {
        return { theta1: t1, theta2: t2, converged: true };
      }

      // Compute Jacobian entries
      const s12 = Math.sin(t1 + t2);
      const c12 = Math.cos(t1 + t2);
      const j11 = -this.l1 * Math.sin(t1) - this.l2 * s12;
      const j12 = -this.l2 * s12;
      const j21 = this.l1 * Math.cos(t1) + this.l2 * c12;
      const j22 = this.l2 * c12;

      // JJ^T + lambda^2 * I (2x2 matrix)
      const a = j11 * j11 + j12 * j12 + lambdaSq;
      const b = j11 * j21 + j12 * j22;
      const c = b;
      const d = j21 * j21 + j22 * j22 + lambdaSq;

      // Invert 2x2 matrix
      const det = a * d - b * c;
      const invA = d / det;
      const invB = -b / det;
      const invC = -c / det;
      const invD = a / det;

      // dTheta = J^T * (JJ^T + lambda^2 I)^-1 * error
      const w1 = invA * ex + invB * ey;
      const w2 = invC * ex + invD * ey;

      const dt1 = j11 * w1 + j21 * w2;
      const dt2 = j12 * w1 + j22 * w2;

      t1 += dt1;
      t2 += dt2;
    }

    return { theta1: t1, theta2: t2, converged: false };
  }
}
```

---

## 7. Socratic Self-Check & Verification

1. **Question:** What is the physical difference between an end-effector pose and a robot joint configuration?
   - **Answer:** A joint configuration $\vec{\theta} \in \mathbb{R}^n$ describes the internal state of the robot's motors (the "joint space"). An end-effector pose $\vec{x} \in \text{SE}(3)$ describes the 3D position and orientation of the robot's hand in external Cartesian task space.
2. **Question:** Why can't we simply invert the Jacobian matrix directly ($J^{-1}$) for a 7-DoF redundant humanoid arm?
   - **Answer:** Because the Jacobian is non-square ($6 \times 7$). A non-square matrix has no ordinary inverse; it has infinitely many solutions (null-space self-motion), requiring the Moore-Penrose pseudoinverse $J^+$ to select the minimum-norm joint velocity solution.
3. **Question:** Why does a robotic arm experience infinite mechanical advantage near a kinematic singularity?
   - **Answer:** By the principle of virtual work, $\vec{\tau} = J^T \vec{F}$. Near a singularity where $\det(J) \to 0$, an infinitesimal joint motor torque can support a massive external Cartesian force along the locked axis (like your locked elbow holding a heavy grocery bag without muscle fatigue!).
