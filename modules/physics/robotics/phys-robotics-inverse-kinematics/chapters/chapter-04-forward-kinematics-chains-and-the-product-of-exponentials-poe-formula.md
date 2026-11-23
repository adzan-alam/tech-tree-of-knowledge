# Chapter 4: Forward Kinematics Chains and the Product of Exponentials (PoE) Formula

---

## 1. The Layman's Genesis & Intuitive Overview

In Chapter 3, we explored how the Denavit-Hartenberg (DH) convention standardizes the geometric description of an articulated robotic arm by attaching an individual coordinate frame to every link. While DH was a historic breakthrough in 1955, anyone who has attempted to calibrate a real-world industrial robot using DH has encountered its frustrating quirks:
- Setting up the intermediate coordinate frames requires solving a series of delicate geometric puzzles: Where is the common normal? Which direction should $x_i$ point? What if two axes intersect or are parallel?
- Even worse, if two consecutive joint axes in an arm are nominally parallel, a microscopic manufacturing flaw of $0.001^\circ$ causes the mathematical common normal to jump wildly across space, causing link offsets and joint angles to diverge toward infinity.

In the 1980s and 1990s, roboticists asked a radical question: **Can we compute the exact 3D position and orientation of the end-effector without setting up any intermediate coordinate frames at all?**

```
     Denavit-Hartenberg: Frame 0 ──▶ Frame 1 ──▶ Frame 2 ──▶ Frame 3 ──▶ Frame 4 ──▶ End-Effector
     (Intermediate frames required on every bone; sensitive to axis parallelism)

     Product of Exponentials:  Fixed Space Frame {s} ═══════════════════════▶ End-Effector {b}
     (Zero intermediate frames; all joints modeled as physical screw axes flowing from Home M)
```

The answer is the **Product of Exponentials (PoE) formula**. Instead of creating artificial coordinate frames on every link, PoE requires only **two frames in the entire universe**:
1. The stationary **Space Frame $\{s\}$** fixed to the robot base.
2. The moving **Body Frame $\{b\}$** fixed to the end-effector tool tip.

To describe the entire robot, you simply place the robot in an arbitrary, convenient "zero" or "home" posture (typically with all joint angles $q_1 = q_2 = \cdots = q_n = 0$). You record the initial pose of the tool $M \in SE(3)$, and you write down the physical direction and location of each joint's motor shaft in space. Then, as each joint motor rotates by angle $q_i$, it simply twists the entire downstream arm along its spatial screw axis!

---

## 2. Historical Foundations & Epistemological Evolution

The theoretical breakthrough that replaced Denavit-Hartenberg notation with modern geometric mechanics occurred in 1984, when **Roger W. Brockett** published his landmark paper *"Robot Arm Kinematics and Dynamics: A Lie Theoretic Approach"*. Brockett recognized that because rigid body motions form the Lie group $SE(3)$, the forward kinematics of any open-chain serial manipulator can be written as a product of matrix exponentials flowing along the Lie algebra $\mathfrak{se}(3)$.

In 1994, **Richard M. Murray**, **Zexiang Li**, and **S. Shankar Sastry** published the monumental textbook *A Mathematical Introduction to Robotic Manipulation* (often called the "MLS bible"). Murray, Li, and Sastry systematized the Product of Exponentials formulation, demonstrating that it:
1. Provides a globally smooth, singularity-free parameterization of robot kinematics (resolving the Hayati-Mirmirani singularity of DH parameters).
2. Directly unifies forward kinematics, differential kinematics (Jacobians), and robotic dynamics into a coherent geometric framework.
3. Greatly simplifies kinematic calibration, because perturbing a joint axis screw produces a smooth, well-conditioned linear perturbation in end-effector pose.

Today, modern robotics engines, kinematics libraries, and multibody simulators—including Pinocchio, Modern Robotics, and advanced research controllers—treat the Product of Exponentials as the primary mathematical foundation of spatial manipulation.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Chaining Homogeneous Transformations
In classical kinematics, if coordinate frames $\{0\}, \{1\}, \dots, \{n\}$ are attached sequentially along an $n$-link serial manipulator, the end-effector pose relative to the base frame is given by the matrix cascade:
$$T_0^n(q) = A_1(q_1) A_2(q_2) \cdots A_n(q_n)$$
where each $A_i(q_i) \in SE(3)$ is the relative transformation between frame $\{i-1\}$ and frame $\{i\}$. While conceptually straightforward, evaluating this cascade requires maintaining $n$ separate local coordinate transformations.

### 3.2 The Space-Frame Product of Exponentials (PoE) Formula
Let $\{s\}$ denote the stationary space frame fixed to the robot base, and $\{b\}$ denote the body frame fixed to the end-effector.

#### Definition of Home Configuration $M$:
The **Home Configuration** $M \in SE(3)$ is the initial pose of the end-effector body frame $\{b\}$ relative to the space frame $\{s\}$ when all joint coordinates are set to zero ($q = 0$):
$$M = T_{sb}(0) = \begin{bmatrix} R_0 & p_0 \\ 0_{1 \times 3} & 1 \end{bmatrix} \in SE(3)$$

#### Spatial Screw Axes $\mathcal{S}_i$:
For each joint $i \in \{1, 2, \dots, n\}$, let $\mathcal{S}_i = (\omega_i, v_i) \in \mathbb{R}^6$ denote its **spatial screw axis**, expressed in the stationary base frame $\{s\}$, when the robot is at its home configuration ($q = 0$):
- **For a Revolute Joint:**
  Let $\hat{\omega}_i \in \mathbb{R}^3$ be a unit vector along the joint's axis of rotation, and let $q_i \in \mathbb{R}^3$ be any point lying on the axis of rotation (both measured in frame $\{s\}$ at $q = 0$). Then:
  $$\omega_i = \hat{\omega}_i, \quad v_i = -\hat{\omega}_i \times q_i$$
- **For a Prismatic Joint:**
  Let $\hat{v}_i \in \mathbb{R}^3$ be a unit vector pointing along the direction of linear translation at $q = 0$. Then:
  $$\omega_i = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}, \quad v_i = \hat{v}_i$$

#### The Space-Frame PoE Formula:
If joint 1 moves by $q_1$, it displaces the entire rest of the robot according to $\exp([\mathcal{S}_1]q_1)$.
If joint 2 moves by $q_2$, its axis was already displaced by joint 1; however, in spatial coordinates, the motion of joint 2 is applied relative to its initial axis, pre-multiplied by the motion of joint 1!
By recursive composition of spatial twists:
$$T_{sb}(q) = e^{[\mathcal{S}_1]q_1} e^{[\mathcal{S}_2]q_2} \cdots e^{[\mathcal{S}_n]q_n} M$$
where $[\mathcal{S}_i] \in \mathfrak{se}(3)$ is the $4 \times 4$ matrix:
$$[\mathcal{S}_i] = \begin{bmatrix} [\omega_i] & v_i \\ 0_{1 \times 3} & 0 \end{bmatrix}$$

```
   Joint 1       Joint 2                Joint n       Home Pose M
   ╭─────╮       ╭─────╮                ╭─────╮         ┌─────┐
   │ e^S1│  ──▶  │ e^S2│   ──▶ ... ──▶  │ e^Sn│   ──▶   │  M  │  =  T_{sb}(q)
   ╰─────╯       ╰─────╯                ╰─────╯         └─────┘
   (Pre-multiplied from base to tip in stationary space coordinates)
```

### 3.3 The Body-Frame Product of Exponentials Formula
Alternatively, forward kinematics can be formulated entirely with respect to the moving end-effector **body frame $\{b\}$**.

Let $\mathcal{B}_i = (\omega_{b, i}, v_{b, i}) \in \mathbb{R}^6$ be the screw axis of joint $i$ expressed in the end-effector frame $\{b\}$ when the robot is at the home configuration ($q = 0$).

#### Transformation between Spatial and Body Screws:
Recall from Chapter 2 that the adjoint map $\operatorname{Ad}_{T_{sb}}$ relates spatial and body twists. Since $M = T_{sb}(0)$ relates the space frame $\{s\}$ to the body frame $\{b\}$ at home:
$$\mathcal{S}_i = \operatorname{Ad}_M \mathcal{B}_i \iff \mathcal{B}_i = \operatorname{Ad}_{M^{-1}} \mathcal{S}_i$$

#### The Body-Frame PoE Formula:
In body coordinates, joint motions post-multiply:
$$T_{sb}(q) = M e^{[\mathcal{B}_1]q_1} e^{[\mathcal{B}_2]q_2} \cdots e^{[\mathcal{B}_n]q_n}$$

*Proof of Equivalence:*
Using the matrix identity $e^{M [\mathcal{B}] M^{-1}} = M e^{[\mathcal{B}]} M^{-1}$:
$$e^{[\mathcal{S}_i]q_i} = e^{M [\mathcal{B}_i] M^{-1} q_i} = M e^{[\mathcal{B}_i]q_i} M^{-1}$$
Substituting this into the space-frame PoE formula:
$$T(q) = (M e^{[\mathcal{B}_1]q_1} M^{-1})(M e^{[\mathcal{B}_2]q_2} M^{-1}) \cdots (M e^{[\mathcal{B}_n]q_n} M^{-1}) M$$
All adjacent interior $M^{-1} M$ terms cancel to identity:
$$T(q) = M e^{[\mathcal{B}_1]q_1} e^{[\mathcal{B}_2]q_2} \cdots e^{[\mathcal{B}_n]q_n}$$
Both formulations are mathematically identical.

### 3.4 Invariance of the Screw Axis under Point Selection
For a revolute joint, the linear velocity component of the spatial screw is $v = -\omega \times q$, where $q$ is a point on the axis.
Suppose an engineer chooses a different point $q' = q + c \omega$ located further along the same axis line ($c \in \mathbb{R}$).
The new linear component is:
$$v' = -\omega \times q' = -\omega \times (q + c \omega) = -\omega \times q - c(\omega \times \omega)$$
Because the cross product of any vector with itself is identically zero ($\omega \times \omega = 0$):
$$v' = -\omega \times q = v$$
The screw axis $\mathcal{S} = (\omega, v)$ is **strictly invariant** to whichever point on the physical rotation line is chosen!

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the Product of Exponentials forward kinematics engine:

```typescript
export interface ScrewAxis {
  omega: { x: number; y: number; z: number };
  v: { x: number; y: number; z: number };
}

export class ProductOfExponentials {
  /**
   * Computes the matrix exponential on SE(3): exp([S] * theta)
   */
  public static matrixExponential(screw: ScrewAxis, theta: number): number[][] {
    const { omega, v } = screw;
    const wNorm = Math.sqrt(omega.x * omega.x + omega.y * omega.y + omega.z * omega.z);

    if (wNorm < 1e-12) {
      // Pure translation (Prismatic Joint)
      return [
        [1, 0, 0, v.x * theta],
        [0, 1, 0, v.y * theta],
        [0, 0, 1, v.z * theta],
        [0, 0, 0, 1          ]
      ];
    }

    // Revolute Joint: normalize omega
    const wx = omega.x / wNorm;
    const wy = omega.y / wNorm;
    const wz = omega.z / wNorm;
    const th = theta * wNorm;

    const c = Math.cos(th);
    const s = Math.sin(th);
    const v_cos = 1 - c;

    // Rodrigues rotation matrix R
    const R = [
      [wx * wx * v_cos + c,      wx * wy * v_cos - wz * s, wx * wz * v_cos + wy * s],
      [wx * wy * v_cos + wz * s, wy * wy * v_cos + c,      wy * wz * v_cos - wx * s],
      [wx * wz * v_cos - wy * s, wy * wz * v_cos + wx * s, wz * wz * v_cos + c     ]
    ];

    // G(theta) * v translation: G = I*th + (1-c)*[w] + (th - s)*[w]^2
    // Evaluated directly:
    const vx = v.x / wNorm;
    const vy = v.y / wNorm;
    const vz = v.z / wNorm;

    const skewV = [
      -wz * vy + wy * vz,
       wz * vx - wx * vz,
      -wy * vx + wx * vy
    ];

    const skewSqV = [
      -(wy * wy + wz * wz) * vx + wx * wy * vy + wx * wz * vz,
       wx * wy * vx - (wx * wx + wz * wz) * vy + wy * wz * vz,
       wx * wz * vx + wy * wz * vy - (wx * wx + wy * wy) * vz
    ];

    const px = th * vx + (1 - c) * skewV[0] + (th - s) * skewSqV[0];
    const py = th * vy + (1 - c) * skewV[1] + (th - s) * skewSqV[1];
    const pz = th * vz + (1 - c) * skewV[2] + (th - s) * skewSqV[2];

    return [
      [R[0][0], R[0][1], R[0][2], px],
      [R[1][0], R[1][1], R[1][2], py],
      [R[2][0], R[2][1], R[2][2], pz],
      [0,       0,       0,       1 ]
    ];
  }

  /**
   * Forward kinematics in space frame: T(q) = e^[S1]q1 * ... * e^[Sn]qn * M
   */
  public static forwardKinematicsSpace(screws: ScrewAxis[], q: number[], M: number[][]): number[][] {
    let T: number[][] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    for (let i = 0; i < screws.length; i++) {
      const expS = this.matrixExponential(screws[i], q[i]);
      T = this.multiply4x4(T, expS);
    }
    return this.multiply4x4(T, M);
  }

  private static multiply4x4(A: number[][], B: number[][]): number[][] {
    const C: number[][] = Array.from({ length: 4 }, () => new Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += A[i][k] * B[k][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 4.1: Space-Frame PoE for a 2R Planar Manipulator
**Problem Statement:** A 2R planar manipulator operates in the $xy$-plane. Joint 1 is fixed at the origin $(0, 0, 0)$ rotating about $+\hat{z}$. Joint 2 is located at $(L_1, 0, 0)$ at home configuration, also rotating about $+\hat{z}$. The end-effector tool tip is at $(L_1 + L_2, 0, 0)$.
1. Determine the home configuration matrix $M$.
2. Formulate the spatial screw axes $\mathcal{S}_1$ and $\mathcal{S}_2$.
3. Evaluate the space-frame PoE formula to compute $T_{sb}(\theta_1, \theta_2)$.

**Given Data:**
- Link lengths $L_1, L_2$
- Space frame $\{s\}$ origin at base Joint 1
- Body frame $\{b\}$ origin at end-effector tip, aligned with $\{s\}$ at home configuration.

**Step-by-Step Derivation:**
1. Home Configuration Matrix $M$:
   At $q = (0, 0)$, both links lie along the $+x$-axis:
   $$R_0 = I_3, \quad p_0 = \begin{bmatrix} L_1 + L_2 \\ 0 \\ 0 \end{bmatrix}$$
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Spatial Screw Axis $\mathcal{S}_1$:
   Joint 1 rotates about $+\hat{z}$: $\omega_1 = [0, 0, 1]^T$.
   Point on axis 1: $q_1 = [0, 0, 0]^T$.
   $$v_1 = -\omega_1 \times q_1 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
   $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
3. Spatial Screw Axis $\mathcal{S}_2$:
   Joint 2 rotates about $+\hat{z}$: $\omega_2 = [0, 0, 1]^T$.
   Point on axis 2 at home: $q_2 = [L_1, 0, 0]^T$.
   $$v_2 = -\omega_2 \times q_2 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1 \\ 0 \\ 0 \end{bmatrix} = -\begin{bmatrix} 0 \\ L_1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -L_1 \\ 0 \end{bmatrix}$$
   $$\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$$
4. Compute Matrix Exponentials:
   - For Joint 1: Rotation about origin by $\theta_1$:
     $$e^{[\mathcal{S}_1]\theta_1} = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   - For Joint 2: Rotation about $(L_1, 0)$ by $\theta_2$:
     $$e^{[\mathcal{S}_2]\theta_2} = \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_1(1 - \cos\theta_2) \\ \sin\theta_2 & \cos\theta_2 & 0 & -L_1\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
5. Multiply $T(\theta_1, \theta_2) = e^{[\mathcal{S}_1]\theta_1} e^{[\mathcal{S}_2]\theta_2} M$:
   First multiply $e^{[\mathcal{S}_2]\theta_2} M$:
   $$e^{[\mathcal{S}_2]\theta_2} \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_1 + L_2\cos\theta_2 \\ \sin\theta_2 & \cos\theta_2 & 0 & L_2\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   Now pre-multiply by $e^{[\mathcal{S}_1]\theta_1}$:
   $$T = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_1 + L_2\cos\theta_2 \\ \sin\theta_2 & \cos\theta_2 & 0 & L_2\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   Evaluating the top-left $2 \times 2$ block gives $\operatorname{Rot}_z(\theta_1 + \theta_2)$.
   Evaluating the position column:
   $$x = \cos\theta_1(L_1 + L_2\cos\theta_2) - \sin\theta_1(L_2\sin\theta_2) = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2)$$
   $$y = \sin\theta_1(L_1 + L_2\cos\theta_2) + \cos\theta_1(L_2\sin\theta_2) = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2)$$

**Final Answer:**
$$T_{sb}(\theta) = \begin{bmatrix} \cos(\theta_1 + \theta_2) & -\sin(\theta_1 + \theta_2) & 0 & L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) & \cos(\theta_1 + \theta_2) & 0 & L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
The resulting $T_{sb}$ matches the Standard DH derivation in Problem 3.1 with absolute, 100% mathematical precision—without ever defining intermediate coordinate axes $x_1$ or $y_1$!

---

### Problem 4.2: Body-Frame PoE for the 2R Planar Manipulator
**Problem Statement:** For the 2R planar arm from Problem 4.1:
1. Derive the body-frame screw axes $\mathcal{B}_1$ and $\mathcal{B}_2$ using the adjoint transformation $\mathcal{B}_i = \operatorname{Ad}_{M^{-1}} \mathcal{S}_i$.
2. Verify that $T = M e^{[\mathcal{B}_1]\theta_1} e^{[\mathcal{B}_2]\theta_2}$ yields the exact same forward kinematics.

**Given Data:**
- $M = \begin{bmatrix} I & p_0 \\ 0 & 1 \end{bmatrix}$ with $p_0 = [L_1 + L_2, 0, 0]^T$.
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$

**Step-by-Step Derivation:**
1. Compute $M^{-1}$:
   $$M^{-1} = \begin{bmatrix} I & -p_0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & -(L_1 + L_2) \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Adjoint representation of $M^{-1}$:
   $$\operatorname{Ad}_{M^{-1}} = \begin{bmatrix} I & 0 \\ [-p_0] & I \end{bmatrix}$$
   where:
   $$[-p_0] = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & L_1 + L_2 \\ 0 & -(L_1 + L_2) & 0 \end{bmatrix}$$
3. Compute $\mathcal{B}_1 = \operatorname{Ad}_{M^{-1}} \mathcal{S}_1$:
   $$\omega_{b, 1} = I \omega_1 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$v_{b, 1} = [-p_0] \omega_1 + v_1 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & L_1 + L_2 \\ 0 & -(L_1 + L_2) & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ L_1 + L_2 \\ 0 \end{bmatrix}$$
   $$\mathcal{B}_1 = [0, 0, 1, 0, L_1 + L_2, 0]^T$$
4. Compute $\mathcal{B}_2 = \operatorname{Ad}_{M^{-1}} \mathcal{S}_2$:
   $$\omega_{b, 2} = I \omega_2 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$v_{b, 2} = [-p_0] \omega_2 + v_2 = \begin{bmatrix} 0 \\ L_1 + L_2 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ -L_1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ L_2 \\ 0 \end{bmatrix}$$
   $$\mathcal{B}_2 = [0, 0, 1, 0, L_2, 0]^T$$
5. Physical Interpretation of Body Screws:
   - In the body frame $\{b\}$ at home:
     - Joint 2 is located at distance $-L_2$ along the $-x_b$ axis ($q_{b, 2} = [-L_2, 0, 0]^T$).
     - Linear velocity in body frame: $v_{b, 2} = -\omega \times q_{b, 2} = -[0, 0, 1]^T \times [-L_2, 0, 0]^T = [0, L_2, 0]^T$.
     - Joint 1 is located at distance $-(L_1 + L_2)$ along $-x_b$ ($q_{b, 1} = [-(L_1 + L_2), 0, 0]^T$).
     - Linear velocity: $v_{b, 1} = -\omega \times q_{b, 1} = [0, L_1 + L_2, 0]^T$.
   The body screws directly reflect physical distances from the tool tip!

**Final Answer:**
- $\mathcal{B}_1 = [0, 0, 1, 0, L_1 + L_2, 0]^T$
- $\mathcal{B}_2 = [0, 0, 1, 0, L_2, 0]^T$

**Verification & Sanity Check:**
Evaluating $M e^{[\mathcal{B}_1]\theta_1} e^{[\mathcal{B}_2]\theta_2}$ produces the exact same forward kinematics matrix $T_{sb}(\theta)$.

---

### Problem 4.3: Space-Frame PoE for a 3R Planar Manipulator
**Problem Statement:** Extend the planar arm to 3 links with lengths $L_1, L_2, L_3$ and joint angles $\theta_1, \theta_2, \theta_3$. Formulate the space-frame screw axes $\mathcal{S}_1, \mathcal{S}_2, \mathcal{S}_3$ and the home configuration matrix $M$.

**Given Data:**
- Joint 1 at origin $(0, 0, 0)$
- Joint 2 at $(L_1, 0, 0)$
- Joint 3 at $(L_1 + L_2, 0, 0)$
- End-effector tool tip at $(L_1 + L_2 + L_3, 0, 0)$
- All rotation axes parallel to $+\hat{z}$.

**Step-by-Step Derivation:**
1. Home Configuration Matrix $M$:
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 + L_3 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Spatial Screws $\mathcal{S}_i = (\omega_i, -\omega_i \times q_i)$:
   - For Joint 1: $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies v_1 = [0, 0, 0]^T$.
     $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
   - For Joint 2: $\omega_2 = [0, 0, 1]^T, q_2 = [L_1, 0, 0]^T$:
     $$v_2 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -L_1 \\ 0 \end{bmatrix}$$
     $$\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$$
   - For Joint 3: $\omega_3 = [0, 0, 1]^T, q_3 = [L_1 + L_2, 0, 0]^T$:
     $$v_3 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1 + L_2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -(L_1 + L_2) \\ 0 \end{bmatrix}$$
     $$\mathcal{S}_3 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$$

**Final Answer:**
- $M = \begin{bmatrix} I & [L_1 + L_2 + L_3, 0, 0]^T \\ 0 & 1 \end{bmatrix}$
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$
- $\mathcal{S}_3 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$

**Verification & Sanity Check:**
Setting all $\theta_i = 0$ yields $T(0) = e^0 e^0 e^0 M = M$. Position is $(L_1 + L_2 + L_3, 0, 0)$, perfectly correct.

---

### Problem 4.4: Space-Frame PoE for a SCARA Manipulator (RRPR)
**Problem Statement:** A SCARA robot has:
- Base pedestal height $H_1$.
- Arm 1 length $L_1$ rotating about vertical $z$.
- Arm 2 length $L_2$ rotating about vertical $z$.
- Prismatic vertical quill translating along $-\hat{z}$ (variable $d_3$).
- Wrist roll rotating about vertical $z$ (variable $\theta_4$).
At home configuration ($q = 0$), the arm extends straight along the $+x$-axis at height $H_1$. Formulate the 4 spatial screw axes and home matrix $M$.

**Given Data:**
- Joint 1 (R): axis at $[0, 0, z]^T$, direction $+\hat{z}$.
- Joint 2 (R): axis at $[L_1, 0, z]^T$, direction $+\hat{z}$.
- Joint 3 (P): prismatic translation along $-\hat{z}$.
- Joint 4 (R): axis at $[L_1 + L_2, 0, z]^T$, direction $+\hat{z}$.
- Home end-effector tip at $[L_1 + L_2, 0, H_1]^T$.

**Step-by-Step Derivation:**
1. Home Matrix $M$:
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Revolute Joint 1:
   $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies v_1 = [0, 0, 0]^T$.
   $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
3. Revolute Joint 2:
   $\omega_2 = [0, 0, 1]^T, q_2 = [L_1, 0, 0]^T \implies v_2 = [0, -L_1, 0]^T$.
   $$\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$$
4. Prismatic Joint 3:
   Translates vertically downward along $-\hat{z}$: $\omega_3 = [0, 0, 0]^T, v_3 = [0, 0, -1]^T$.
   $$\mathcal{S}_3 = [0, 0, 0, 0, 0, -1]^T$$
5. Revolute Joint 4:
   $\omega_4 = [0, 0, 1]^T, q_4 = [L_1 + L_2, 0, 0]^T \implies v_4 = [0, -(L_1 + L_2), 0]^T$.
   $$\mathcal{S}_4 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$$

**Final Answer:**
- $M = \begin{bmatrix} I & [L_1 + L_2, 0, H_1]^T \\ 0 & 1 \end{bmatrix}$
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$
- $\mathcal{S}_3 = [0, 0, 0, 0, 0, -1]^T$
- $\mathcal{S}_4 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$

**Verification & Sanity Check:**
If $d_3$ extends by $0.2\text{ m}$, $\exp([\mathcal{S}_3]d_3) = \operatorname{Trans}(0, 0, -0.2)$. Multiplying by $M$ yields $z = H_1 - 0.2\text{ m}$, exactly matching the downward motion of the quill.

---

### Problem 4.5: Space-Frame PoE for a 3-DoF Anthropomorphic Arm
**Problem Statement:** An anthropomorphic 3-DoF arm has:
- Joint 1 (Waist): Rotates about vertical axis $z_0$.
- Joint 2 (Shoulder): Located at height $H_1$, rotates about horizontal axis parallel to $+\hat{y}$.
- Joint 3 (Elbow): Located at distance $L_1$ along $+x$ from shoulder at height $H_1$, rotating about horizontal axis parallel to $+\hat{y}$.
- Tool tip: Located at distance $L_2$ along $+x$ from elbow.
Derive the home matrix $M$ and spatial screws $\mathcal{S}_1, \mathcal{S}_2, \mathcal{S}_3$.

**Given Data:**
- $q_1 = [0, 0, 0]^T, \omega_1 = [0, 0, 1]^T$
- $q_2 = [0, 0, H_1]^T, \omega_2 = [0, 1, 0]^T$
- $q_3 = [L_1, 0, H_1]^T, \omega_3 = [0, 1, 0]^T$
- Tool tip at $[L_1 + L_2, 0, H_1]^T$.

**Step-by-Step Derivation:**
1. Home Matrix $M$:
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Screw Axis 1:
   $$\omega_1 = [0, 0, 1]^T, \quad v_1 = -[0, 0, 1]^T \times [0, 0, 0]^T = [0, 0, 0]^T$$
   $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
3. Screw Axis 2:
   $$\omega_2 = [0, 1, 0]^T, \quad v_2 = -[0, 1, 0]^T \times [0, 0, H_1]^T = -[H_1, 0, 0]^T = [-H_1, 0, 0]^T$$
   $$\mathcal{S}_2 = [0, 1, 0, -H_1, 0, 0]^T$$
4. Screw Axis 3:
   $$\omega_3 = [0, 1, 0]^T, \quad v_3 = -[0, 1, 0]^T \times [L_1, 0, H_1]^T = -[H_1, 0, -L_1]^T = [-H_1, 0, L_1]^T$$
   $$\mathcal{S}_3 = [0, 1, 0, -H_1, 0, L_1]^T$$

**Final Answer:**
- $M = \begin{bmatrix} I & [L_1 + L_2, 0, H_1]^T \\ 0 & 1 \end{bmatrix}$
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 1, 0, -H_1, 0, 0]^T$
- $\mathcal{S}_3 = [0, 1, 0, -H_1, 0, L_1]^T$

**Verification & Sanity Check:**
If Joint 2 rotates by $\theta_2$, the linear velocity at the origin is $v_2 = [-H_1, 0, 0]^T$. Since the joint is at height $H_1$, rotating about $+y$ pushes points at $z = 0$ along $-x$. The sign is physically accurate.

---

### Problem 4.6: Complete Spatial Screw Table for the Universal Robots UR5
**Problem Statement:** Using the UR5 dimensions:
- Base height $H_1 = 0.089159\text{ m}$
- Upper arm length $L_1 = 0.425\text{ m}$
- Forearm length $L_2 = 0.39225\text{ m}$
- Shoulder-to-elbow lateral offset $W_1 = 0.13585\text{ m}$
- Forearm-to-wrist lateral offset $W_2 = 0.1197\text{ m}$
- Tool length $H_2 = 0.0823\text{ m}$
At the standard home pose (arm extended along $+x$, tool pointing along $+x$):
Derive all 6 spatial screw axes $\mathcal{S}_1, \dots, \mathcal{S}_6$ and home matrix $M$.

**Step-by-Step Derivation:**
1. Identify the joint axes at home:
   - Joint 1 (Base roll): Vertical along $+\hat{z}$, through origin $[0, 0, 0]^T$.
   - Joint 2 (Shoulder pitch): Horizontal along $+\hat{y}$, through $[0, W_1, H_1]^T$.
   - Joint 3 (Elbow pitch): Horizontal along $+\hat{y}$, through $[L_1, W_1, H_1]^T$.
   - Joint 4 (Wrist 1 pitch): Horizontal along $+\hat{y}$, through $[L_1 + L_2, W_1, H_1]^T$.
   - Joint 5 (Wrist 2 yaw): Vertical along $-\hat{z}$, through $[L_1 + L_2, W_1 + W_2, H_1]^T$.
   - Joint 6 (Wrist 3 roll): Horizontal along $+\hat{x}$, through $[L_1 + L_2, W_1 + W_2, H_1]^T$.
2. Compute linear components $v_i = -\omega_i \times q_i$:
   - $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
   - $\mathcal{S}_2$: $\omega_2 = [0, 1, 0]^T, q_2 = [0, W_1, H_1]^T \implies v_2 = -[0, 1, 0]^T \times [0, W_1, H_1]^T = [-H_1, 0, 0]^T$.
     $$\mathcal{S}_2 = [0, 1, 0, -H_1, 0, 0]^T$$
   - $\mathcal{S}_3$: $\omega_3 = [0, 1, 0]^T, q_3 = [L_1, W_1, H_1]^T \implies v_3 = [-H_1, 0, L_1]^T$.
     $$\mathcal{S}_3 = [0, 1, 0, -H_1, 0, L_1]^T$$
   - $\mathcal{S}_4$: $\omega_4 = [0, 1, 0]^T, q_4 = [L_1 + L_2, W_1, H_1]^T \implies v_4 = [-H_1, 0, L_1 + L_2]^T$.
     $$\mathcal{S}_4 = [0, 1, 0, -H_1, 0, L_1 + L_2]^T$$
   - $\mathcal{S}_5$: $\omega_5 = [0, 0, -1]^T, q_5 = [L_1 + L_2, W_1 + W_2, H_1]^T \implies v_5 = -[0, 0, -1]^T \times q_5 = [-(W_1 + W_2), L_1 + L_2, 0]^T$.
     $$\mathcal{S}_5 = [0, 0, -1, -(W_1 + W_2), L_1 + L_2, 0]^T$$
   - $\mathcal{S}_6$: $\omega_6 = [1, 0, 0]^T, q_6 = [L_1 + L_2, W_1 + W_2, H_1]^T \implies v_6 = -[1, 0, 0]^T \times q_6 = [0, H_1, -(W_1 + W_2)]^T$.
     $$\mathcal{S}_6 = [1, 0, 0, 0, H_1, -(W_1 + W_2)]^T$$
3. Home Configuration $M$:
   $$M = \begin{bmatrix} 0 & 0 & 1 & L_1 + L_2 + H_2 \\ 0 & 1 & 0 & W_1 + W_2 \\ -1 & 0 & 0 & H_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
The complete spatial screw table for the UR5 is fully derived above.

**Verification & Sanity Check:**
Every single parameter is directly measured from the physical CAD dimensions without drawing any intermediate coordinate frames!

---

### Problem 4.7: Numerical Forward Kinematics Evaluation
**Problem Statement:** For the planar 2R arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$, use the PoE formula to calculate the exact numerical $4 \times 4$ transformation matrix $T_{sb}$ when $\theta_1 = 45^\circ = \frac{\pi}{4}\text{ rad}$ and $\theta_2 = 90^\circ = \frac{\pi}{2}\text{ rad}$.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $\theta_1 = \pi/4$, $\cos(\pi/4) = \sin(\pi/4) = \frac{\sqrt{2}}{2} \approx 0.707107$
- $\theta_2 = \pi/2$, $\cos(\pi/2) = 0, \sin(\pi/2) = 1$
- $\theta_1 + \theta_2 = 135^\circ = \frac{3\pi}{4}\text{ rad}$
- $\cos(135^\circ) = -\frac{\sqrt{2}}{2} \approx -0.707107, \sin(135^\circ) = \frac{\sqrt{2}}{2} \approx 0.707107$

**Step-by-Step Derivation:**
1. Rotation submatrix:
   $$R = \operatorname{Rot}_z(135^\circ) = \begin{bmatrix} -0.707107 & -0.707107 & 0 \\ 0.707107 & -0.707107 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Position coordinates:
   $$x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) = 1.0\left(\frac{\sqrt{2}}{2}\right) + 1.0\left(-\frac{\sqrt{2}}{2}\right) = 0.0\text{ m}$$
   $$y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) = 1.0\left(\frac{\sqrt{2}}{2}\right) + 1.0\left(\frac{\sqrt{2}}{2}\right) = \sqrt{2} \approx 1.414214\text{ m}$$
   $$z = 0.0\text{ m}$$
3. Assemble the $4 \times 4$ matrix:

**Final Answer:**
$$T_{sb} = \begin{bmatrix} -0.707107 & -0.707107 & 0 & 0.000000 \\ 0.707107 & -0.707107 & 0 & 1.414214 \\ 0 & 0 & 1 & 0.000000 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
Arm 1 points toward $(0.707, 0.707)$. Arm 2 turns $90^\circ$ left, pointing toward $(-0.707, 0.707)$. Adding vectors: $(0.707 - 0.707, 0.707 + 0.707) = (0, 1.414)$, exactly on the $y$-axis!

---

### Problem 4.8: Adjoint Conversion from Space to Body Screws
**Problem Statement:** Let a spatial screw be $\mathcal{S} = [0, 0, 1, 0, -2.0, 0]^T$. The home configuration matrix is:
$$M = \begin{bmatrix} 0 & -1 & 0 & 3.0 \\ 1 & 0 & 0 & 1.0 \\ 0 & 0 & 1 & 0.0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
Calculate the corresponding body screw axis $\mathcal{B} = \operatorname{Ad}_{M^{-1}} \mathcal{S}$.

**Given Data:**
- $R_M = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ (a $90^\circ$ rotation about $\hat{z}$)
- $p_M = [3.0, 1.0, 0.0]^T$

**Step-by-Step Derivation:**
1. Compute $M^{-1}$:
   $$R_M^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   $$-R_M^T p_M = -\begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 3.0 \\ 1.0 \\ 0.0 \end{bmatrix} = -\begin{bmatrix} 1.0 \\ -3.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -1.0 \\ 3.0 \\ 0.0 \end{bmatrix}$$
2. Adjoint transformation equation:
   $$\omega_b = R_M^T \omega_s = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$v_b = [-R_M^T p_M] \omega_b + R_M^T v_s$$
3. Compute $R_M^T v_s$:
   $$R_M^T \begin{bmatrix} 0 \\ -2.0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ -2.0 \\ 0 \end{bmatrix} = \begin{bmatrix} -2.0 \\ 0 \\ 0 \end{bmatrix}$$
4. Compute $[-R_M^T p_M] \omega_b = (-R_M^T p_M) \times \omega_b$:
   $$\begin{bmatrix} -1.0 \\ 3.0 \\ 0.0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 3.0(1) - 0(0) \\ 0(0) - (-1.0)(1) \\ -1.0(0) - 3.0(0) \end{bmatrix} = \begin{bmatrix} 3.0 \\ 1.0 \\ 0.0 \end{bmatrix}$$
5. Sum to get $v_b$:
   $$v_b = \begin{bmatrix} 3.0 \\ 1.0 \\ 0.0 \end{bmatrix} + \begin{bmatrix} -2.0 \\ 0.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 1.0 \\ 0.0 \end{bmatrix}$$

**Final Answer:**
$$\mathcal{B} = [0, 0, 1, 1.0, 1.0, 0.0]^T$$

**Verification & Sanity Check:**
Invert back: $\mathcal{S}' = \operatorname{Ad}_M \mathcal{B}$. $\omega_s = R_M \omega_b = [0, 0, 1]^T$.
$v_s = [p_M] R_M \omega_b + R_M v_b = [3, 1, 0]^T \times [0, 0, 1]^T + \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = [1, -3, 0]^T + [-1, 1, 0]^T = [0, -2, 0]^T$. Recovers $\mathcal{S}$ exactly!

---

### Problem 4.9: Forward Kinematics of a Prismatic Telescoping Arm
**Problem Statement:** A 2-DoF spatial mechanism has a revolute base joint $\theta_1$ rotating about vertical $\hat{z}$, followed by a prismatic joint $d_2$ translating horizontally at height $H$. At home ($q = 0$), the arm extends along $+\hat{x}$ by initial length $L_0$. Formulate the space-frame PoE.

**Given Data:**
- Joint 1 (R): $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies \mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
- Joint 2 (P): Translates along $+\hat{x}$: $\omega_2 = [0, 0, 0]^T, v_2 = [1, 0, 0]^T \implies \mathcal{S}_2 = [0, 0, 0, 1, 0, 0]^T$.
- Home pose: $M = \begin{bmatrix} I & [L_0, 0, H]^T \\ 0 & 1 \end{bmatrix}$.

**Step-by-Step Derivation:**
1. Matrix exponentials:
   $$e^{[\mathcal{S}_1]\theta_1} = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$e^{[\mathcal{S}_2]d_2} = \begin{bmatrix} 1 & 0 & 0 & d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Multiply $e^{[\mathcal{S}_2]d_2} M$:
   $$e^{[\mathcal{S}_2]d_2} M = \begin{bmatrix} 1 & 0 & 0 & d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & L_0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & L_0 + d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Pre-multiply by $e^{[\mathcal{S}_1]\theta_1}$:
   $$T = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & L_0 + d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & (L_0 + d_2)\cos\theta_1 \\ \sin\theta_1 & \cos\theta_1 & 0 & (L_0 + d_2)\sin\theta_1 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
- Position: **$p = [(L_0 + d_2)\cos\theta_1, \; (L_0 + d_2)\sin\theta_1, \; H]^T$**
- Orientation: Rotation of **$\theta_1$** about $\hat{z}$.

**Verification & Sanity Check:**
Matches standard polar coordinates in the plane at height $H$, with radial distance $r = L_0 + d_2$.

---

### Problem 4.10: ZYX Euler Angle Extraction from PoE Matrix
**Problem Statement:** The forward kinematics of a 6-DoF arm yields the rotation submatrix:
$$R = \begin{bmatrix} 0 & 0 & 1 \\ 0.707107 & 0.707107 & 0 \\ -0.707107 & 0.707107 & 0 \end{bmatrix}$$
Extract the roll ($\psi$), pitch ($\theta$), and yaw ($\phi$) Euler angles under the standard $Z-Y-X$ convention ($R = R_z(\phi) R_y(\theta) R_x(\psi)$).

**Given Data:**
- Matrix entries: $r_{13} = 1, r_{21} = 1/\sqrt{2}, r_{22} = 1/\sqrt{2}, r_{31} = -1/\sqrt{2}, r_{32} = 1/\sqrt{2}$.
- All other entries are zero.

**Step-by-Step Derivation:**
1. Recall the analytical $Z-Y-X$ Euler matrix structure:
   $$R = \begin{bmatrix} \cos\phi\cos\theta & \cos\phi\sin\theta\sin\psi - \sin\phi\cos\psi & \cos\phi\sin\theta\cos\psi + \sin\phi\sin\psi \\ \sin\phi\cos\theta & \sin\phi\sin\theta\sin\psi + \cos\phi\cos\psi & \sin\phi\sin\theta\cos\psi - \cos\phi\sin\psi \\ -\sin\theta & \cos\theta\sin\psi & \cos\theta\cos\psi \end{bmatrix}$$
2. Extract pitch $\theta$ from $r_{31} = -\sin\theta$:
   $$-\sin\theta = -0.707107 \implies \sin\theta = 0.707107 \implies \theta = 45^\circ = \frac{\pi}{4}\text{ rad}$$
3. Compute $\cos\theta$:
   $$\cos(45^\circ) = 0.707107 \neq 0$$
4. Extract roll $\psi$ from $r_{32}$ and $r_{33}$:
   $$\tan\psi = \frac{r_{32}}{r_{33}} \implies \psi = \operatorname{atan2}(r_{32}, r_{33}) = \operatorname{atan2}(0.707107, 0) = 90^\circ = \frac{\pi}{2}\text{ rad}$$
5. Extract yaw $\phi$ from $r_{21}$ and $r_{11}$:
   $$\tan\phi = \frac{r_{21}}{r_{11}} \implies \phi = \operatorname{atan2}(r_{21}, r_{11}) = \operatorname{atan2}(0.707107, 0) = 90^\circ = \frac{\pi}{2}\text{ rad}$$

**Final Answer:**
- Yaw: **$\phi = 90^\circ$** ($\pi/2\text{ rad}$)
- Pitch: **$\theta = 45^\circ$** ($\pi/4\text{ rad}$)
- Roll: **$\psi = 90^\circ$** ($\pi/2\text{ rad}$)

**Verification & Sanity Check:**
Compute $r_{13} = \cos(90^\circ)\sin(45^\circ)\cos(90^\circ) + \sin(90^\circ)\sin(90^\circ) = 0 + 1(1) = 1.0$. Matches $r_{13} = 1$ exactly.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 4.11: Stanford Arm Spatial Screw Axes
**Problem Statement:** Formulate the spatial screw axes $\mathcal{S}_1, \dots, \mathcal{S}_6$ for the Stanford Arm at home configuration where the boom extends horizontally along $+x$ with shoulder height $H$ and offset $D_2$.

**Solution:**
1. Axis 1 (Waist roll): $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies \mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
2. Axis 2 (Shoulder pitch): $\omega_2 = [0, 1, 0]^T, q_2 = [0, D_2, H]^T \implies v_2 = -[0, 1, 0]^T \times [0, D_2, H]^T = [-H, 0, 0]^T$.
   $$\mathcal{S}_2 = [0, 1, 0, -H, 0, 0]^T$$
3. Axis 3 (Prismatic boom): Translates along $+\hat{x}$: $\omega_3 = 0, v_3 = [1, 0, 0]^T$.
   $$\mathcal{S}_3 = [0, 0, 0, 1, 0, 0]^T$$
4. Axis 4 (Wrist roll): Coincident with boom axis along $+\hat{x}$ at height $H$: $\omega_4 = [1, 0, 0]^T, q_4 = [0, D_2, H]^T \implies v_4 = -[1, 0, 0]^T \times [0, D_2, H]^T = [0, H, -D_2]^T$.
   $$\mathcal{S}_4 = [1, 0, 0, 0, H, -D_2]^T$$
5. Axis 5 (Wrist pitch): Along $+\hat{y}$ at wrist center $[L_w, D_2, H]^T$: $\omega_5 = [0, 1, 0]^T, v_5 = [-H, 0, L_w]^T$.
   $$\mathcal{S}_5 = [0, 1, 0, -H, 0, L_w]^T$$
6. Axis 6 (Wrist yaw): Along $+\hat{z}$ at wrist center: $\omega_6 = [0, 0, 1]^T, v_6 = [D_2, -L_w, 0]^T$.
   $$\mathcal{S}_6 = [0, 0, 1, D_2, -L_w, 0]^T$$

---

### Problem 4.12: Screw Invariance under Axis Translation
**Problem Statement:** Prove that replacing point $q$ with $q + c \omega$ leaves the screw $\mathcal{S} = (\omega, -\omega \times q)$ invariant for any $c \in \mathbb{R}$.

**Solution:**
1. Compute the new linear component:
   $$v_{\text{new}} = -\omega \times (q + c\omega) = -\omega \times q - c(\omega \times \omega)$$
2. For any 3D vector, the cross product with itself vanishes identically: $\omega \times \omega = 0$.
3. Therefore:
   $$v_{\text{new}} = -\omega \times q = v_{\text{old}}$$
4. The screw axis is identical: $\mathcal{S}_{\text{new}} = \mathcal{S}_{\text{old}}$.

---

### Problem 4.13: Franka Emika Panda Home Matrix and Screw Parameters
**Problem Statement:** State the home configuration matrix $M$ and the first 3 spatial screws for the 7-DoF Franka Emika Panda arm given base height $d_1 = 0.333\text{ m}$ and upper arm offset $d_3 = 0.316\text{ m}$.

**Solution:**
1. At home configuration ($q = 0$), the arm extends vertically along $+\hat{z}$ with total height $H_{\text{total}} = 0.333 + 0.316 + 0.384 + 0.107 = 1.140\text{ m}$.
2. Home matrix:
   $$M = \begin{bmatrix} 1 & 0 & 0 & 0.088 \\ 0 & -1 & 0 & 0 \\ 0 & 0 & -1 & 1.140 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Screws:
   - Joint 1: Rotates about $+\hat{z}$ at origin $\implies \mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
   - Joint 2: Rotates about $+\hat{y}$ at height $0.333\text{ m} \implies \mathcal{S}_2 = [0, 1, 0, -0.333, 0, 0]^T$.
   - Joint 3: Rotates about $+\hat{z}$ at height $0.649\text{ m} \implies \mathcal{S}_3 = [0, 0, 1, 0, 0, 0]^T$.

---

### Problem 4.14: Time Derivative of the Product of Exponentials
**Problem Statement:** Derive the formula for $\dot{T} T^{-1}$ (the spatial velocity twist) by differentiating the space-frame PoE formula with respect to time.

**Solution:**
1. Differentiate $T(q) = e^{[\mathcal{S}_1]q_1} e^{[\mathcal{S}_2]q_2} \cdots e^{[\mathcal{S}_n]q_n} M$:
   $$\dot{T} = [\mathcal{S}_1]\dot{q}_1 T + e^{[\mathcal{S}_1]q_1} [\mathcal{S}_2]\dot{q}_2 e^{[\mathcal{S}_2]q_2} \cdots M + \cdots$$
2. Post-multiply by $T^{-1}$:
   $$\dot{T} T^{-1} = [\mathcal{S}_1]\dot{q}_1 + e^{[\mathcal{S}_1]q_1}[\mathcal{S}_2]e^{-[\mathcal{S}_1]q_1}\dot{q}_2 + \cdots + \left( \prod_{j=1}^{i-1} e^{[\mathcal{S}_j]q_j} \right) [\mathcal{S}_i] \left( \prod_{j=1}^{i-1} e^{[\mathcal{S}_j]q_j} \right)^{-1} \dot{q}_i + \cdots$$
3. Using the adjoint identity $T [\mathcal{S}] T^{-1} = [\operatorname{Ad}_T \mathcal{S}]$:
   $$\dot{T} T^{-1} = \left[ \sum_{i=1}^n J_{si}(q) \dot{q}_i \right]$$
   where $J_{si}(q) = \operatorname{Ad}_{\prod_{j=1}^{i-1} \exp([\mathcal{S}_j]q_j)} \mathcal{S}_i$.
4. This directly derives the $i$-th column of the **Spatial Manipulator Jacobian**!

---

### Problem 4.15: KUKA LBR iiwa 7-DoF Home Geometry
**Problem Statement:** The KUKA LBR iiwa has 7 revolute joints alternating between roll and pitch: $z_0, y_1, z_2, y_3, z_4, y_5, z_6$. Explain why the PoE representation avoids the frame alignment ambiguities inherent in DH modeling for this arm.

**Solution:**
1. In DH notation, alternating orthogonal axes with zero offsets create multiple ambiguous choices for the direction of common normals $x_i$, requiring artificial dummy frames.
2. In PoE, the engineer simply inspects the physical robot:
   - Odd joints ($1, 3, 5, 7$) have $\omega = [0, 0, 1]^T$.
   - Even joints ($2, 4, 6$) have $\omega = [0, 1, 0]^T$.
3. Each $v_i$ is computed automatically via $-\omega_i \times q_i$ from CAD joint center heights. Zero dummy frames are required.

---

### Problem 4.16: Cylindrical Robot PoE
**Problem Statement:** Derive the space-frame PoE for a cylindrical robot ($R-P-P$) where Joint 1 rotates about $z$, Joint 2 translates along $z$, and Joint 3 translates along $x$.

**Solution:**
1. Screws:
   - Joint 1: $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
   - Joint 2: $\mathcal{S}_2 = [0, 0, 0, 0, 0, 1]^T$.
   - Joint 3: $\mathcal{S}_3 = [0, 0, 0, 1, 0, 0]^T$.
2. Home pose: $M = \begin{bmatrix} I & [r_0, 0, z_0]^T \\ 0 & 1 \end{bmatrix}$.
3. Forward kinematics:
   $$T(q) = e^{[\mathcal{S}_1]\theta_1} e^{[\mathcal{S}_2]d_2} e^{[\mathcal{S}_3]d_3} M$$
   $$= \operatorname{Rot}_z(\theta_1) \operatorname{Trans}(d_3, 0, d_2) M$$

---

### Problem 4.17: Computational FLOPs Comparison: DH vs. PoE
**Problem Statement:** Compare the floating-point operations (FLOPs) required to evaluate forward kinematics for a 6-DoF arm using Standard DH vs. Space-Frame PoE.

**Solution:**
1. **Standard DH:**
   - 6 matrix multiplications of $4 \times 4$ matrices: $5 \times 64 = 320$ multiplications and additions.
   - 6 evaluations of $\cos\theta_i$ and $\sin\theta_i$: 12 trigonometric calls.
2. **Space-Frame PoE:**
   - Rodrigues exponential evaluation: for each of 6 joints, computing $R$ and $G v$ takes $\approx 50$ FLOPs ($6 \times 50 = 300$).
   - 6 matrix multiplications of $4 \times 4$: $6 \times 64 = 384$ FLOPs.
3. Both methods require $\mathcal{O}(n)$ computation time, taking less than $1\text{ microsecond}$ on modern CPUs, but PoE provides superior numerical stability and singularity-free geometric derivatives.

---

### Problem 4.18: Calibration of the Home Matrix $M$
**Problem Statement:** A measurement system determines that due to base mounting tilt, the true home matrix is $M_{\text{true}} = \Delta T \cdot M_{\text{nominal}}$, where $\Delta T = \operatorname{Rot}_x(0.01^\circ)$. Express the calibrated forward kinematics.

**Solution:**
1. Since $M$ appears as a terminal factor in the space-frame PoE:
   $$T_{\text{true}}(q) = e^{[\mathcal{S}_1]q_1} \cdots e^{[\mathcal{S}_n]q_n} M_{\text{true}} = e^{[\mathcal{S}_1]q_1} \cdots e^{[\mathcal{S}_n]q_n} \Delta T M_{\text{nominal}}$$
2. Kinematic calibration simply updates the 16 numbers in matrix $M_{\text{nominal}}$ by pre-multiplying with $\Delta T$, without altering any joint screw axes!

---

### Problem 4.19: Body Twist from Joint Velocities
**Problem Statement:** Prove that the end-effector body twist is $\mathcal{V}_b = \sum_{i=1}^n J_{bi}(q) \dot{q}_i$, where $J_{bi} = \operatorname{Ad}_{(\prod_{j=i+1}^n \exp([\mathcal{B}_j]q_j))^{-1}} \mathcal{B}_i$.

**Solution:**
1. Start with body twist definition: $[\mathcal{V}_b] = T^{-1} \dot{T}$.
2. Differentiate the body PoE formula:
   $$T(q) = M e^{[\mathcal{B}_1]q_1} \cdots e^{[\mathcal{B}_n]q_n}$$
3. Differentiating with respect to time and pre-multiplying by $T^{-1}$ yields:
   $$T^{-1} \dot{T} = \sum_{i=1}^n \left( e^{-[\mathcal{B}_n]q_n} \cdots e^{-[\mathcal{B}_{i+1}]q_{i+1}} \right) [\mathcal{B}_i] \left( e^{[\mathcal{B}_{i+1}]q_{i+1}} \cdots e^{[\mathcal{B}_n]q_n} \right) \dot{q}_i$$
4. Applying the adjoint map gives the body Jacobian column:
   $$J_{bi} = \operatorname{Ad}_{\left( \prod_{j=i+1}^n \exp([\mathcal{B}_j]q_j) \right)^{-1}} \mathcal{B}_i$$

---

### Problem 4.20: Analytical Proof of Space-to-Body Exponential Intertwining
**Problem Statement:** Prove that for any spatial screw $\mathcal{S}$ and home matrix $M$, $e^{[\mathcal{S}]\theta} M = M e^{[\mathcal{B}]\theta}$, where $\mathcal{B} = \operatorname{Ad}_{M^{-1}} \mathcal{S}$.

**Solution:**
1. By definition of the matrix adjoint:
   $$[\mathcal{B}] = [\operatorname{Ad}_{M^{-1}} \mathcal{S}] = M^{-1} [\mathcal{S}] M$$
2. Exponentiating both sides:
   $$e^{[\mathcal{B}]\theta} = e^{(M^{-1} [\mathcal{S}] M)\theta} = \sum_{k=0}^\infty \frac{(M^{-1} [\mathcal{S}] M \theta)^k}{k!}$$
3. Since $(M^{-1} [\mathcal{S}] M)^k = M^{-1} [\mathcal{S}]^k M$:
   $$e^{[\mathcal{B}]\theta} = M^{-1} \left( \sum_{k=0}^\infty \frac{([\mathcal{S}]\theta)^k}{k!} \right) M = M^{-1} e^{[\mathcal{S}]\theta} M$$
4. Pre-multiply both sides by $M$:
   $$M e^{[\mathcal{B}]\theta} = e^{[\mathcal{S}]\theta} M$$
5. This proves that the space and body PoE formulations are fundamentally identical.
