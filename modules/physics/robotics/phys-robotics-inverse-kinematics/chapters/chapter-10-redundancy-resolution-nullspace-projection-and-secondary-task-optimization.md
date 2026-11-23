# Chapter 10: Redundancy Resolution, Nullspace Projection, and Secondary Task Optimization

---

## 1. The Layman's Genesis & Intuitive Overview

Take a glass of water, hold it steady at chest height in front of you, and keep it completely stationary. 

Now, without moving the glass by even a fraction of a millimeter, raise your elbow up toward the ceiling, and then lower it down toward your waist.

Notice what you just accomplished:
- Your hand and the glass remained locked at a fixed 3D Cartesian position and orientation ($SE(3)$).
- Yet your shoulder, elbow, and forearm joints were actively moving in a continuous physical motion!

```
                    Fixed Coffee Mug in Space
                              ● Hand
                             /
                            /
                           ● Elbow (Swiveling up and down!)
                          /
                         /
                        ● Shoulder (Pivot)
           (Hand is frozen, but joints move along a "Nullspace"!)
```

This phenomenon is possible because the human arm has **7 degrees of freedom**, while positioning and orienting an object in 3D space requires only **6 degrees of freedom**. The extra degree of freedom ($7 - 6 = 1$) creates an internal dimension of flexibility known as **Kinematic Redundancy**.

In robotics, redundant manipulators (such as the 7-DoF Franka Emika Panda, KUKA LBR iiwa, or dual-arm humanoid robots) possess this exact superpower. But redundancy creates a profound mathematical challenge: *if there are infinitely many ways to reach the goal, which one should the robot choose?*

The answer is **Nullspace Projection**. By mathematically partitioning the robot's motion into two orthogonal subspaces:
1. **The Primary Task Space:** Moving the tool to paint, weld, or grasp.
2. **The Nullspace:** Internal "self-motion" that does not disturb the tool at all.

We can command the robot to execute **secondary tasks** simultaneously in its nullspace—such as swiveling the elbow away from a collision with a wall, maximizing its distance from joint limits, or optimizing manipulability!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical framework of redundancy resolution in robotics was founded in 1977 by the French roboticist **Alain Liégeois** in his seminal paper, *"Automatic Supervisory Control of the Configuration and Behavior of Multibody Mechanisms"* (*IEEE Transactions on Systems, Man, and Cybernetics*). Liégeois was the first to use the Moore-Penrose pseudoinverse nullspace projector:
$$\dot{q} = J^+ \nu + (I - J^+ J) \dot{q}_0$$
to project the gradient of an artificial potential function $\nabla H(q)$ into the nullspace of a redundant manipulator, allowing an arm to avoid joint limits while simultaneously following a trajectory.

Throughout the 1980s, **Hideo Hanafusa**, **Tsuneo Yoshikawa**, and **Yoshihiko Nakamura** at Kyoto University expanded Liégeois' foundation into **Task Priority Control**. In their 1987 paper *"Task-Priority Based Redundancy Control of Robot Manipulators"*, Nakamura and Hanafusa generalized nullspace projection to an arbitrary hierarchy of $k$ tasks, proving that lower-priority tasks can be executed strictly within the nullspace of higher-priority tasks without creating interference.

Today, nullspace projection is the universal engine behind humanoid whole-body control, mobile manipulation, and industrial collision avoidance systems.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Kinematic Redundancy and the Nullspace
Let a manipulator possess $n$ joint degrees of freedom operating in an $m$-dimensional task space ($m < n$).
The degree of redundancy is the positive integer:
$$r = n - m > 0$$
For example, for a 7-DoF humanoid arm performing 6D manipulation in $SE(3)$, $r = 7 - 6 = 1$. For a 3-link planar arm positioning an end-effector in 2D space ($x, y$), $r = 3 - 2 = 1$.

The linear velocity relationship is:
$$J(q) \dot{q} = \nu$$
where $J(q) \in \mathbb{R}^{m \times n}$.

#### The Nullspace $\mathcal{N}(J)$:
The **nullspace** (or kernel) of the Jacobian matrix is the subspace of all joint velocity vectors that map to zero task-space velocity:
$$\mathcal{N}(J(q)) = \{ \dot{q}_0 \in \mathbb{R}^n \mid J(q) \dot{q}_0 = 0 \}$$
By the Rank-Nullity Theorem, if $J$ has full row rank $m$, the nullspace has dimension:
$$\dim(\mathcal{N}(J)) = n - \operatorname{rank}(J) = n - m = r$$
Any joint motion $\dot{q}_0 \in \mathcal{N}(J)$ is called **internal self-motion**: it changes the physical posture of the robot without altering the velocity of the end-effector!

---

### 3.2 The Nullspace Projection Operator $P$
Let $J^+ = J^T (J J^T)^{-1} \in \mathbb{R}^{n \times m}$ be the Moore-Penrose pseudoinverse.
The **Nullspace Projection Matrix** $P \in \mathbb{R}^{n \times n}$ is defined as:
$$P = I_n - J^+ J$$

#### Three Fundamental Algebraic Properties of $P$:

##### 1. Nullspace Annihilation Property ($J P = 0$)
Any vector projected by $P$ is completely annihilated by the Jacobian:
$$J P = J (I_n - J^+ J) = J - (J J^+) J$$
Since $J J^+ = I_m$ for full row rank $J$:
$$J P = J - I_m J = J - J = 0_{m \times n}$$
*Consequence:* Multiplying $J$ by $P \dot{q}_0$ yields zero Cartesian velocity: $J (P \dot{q}_0) = (J P) \dot{q}_0 = 0$.

##### 2. Idempotence Property ($P^2 = P$)
Applying the projection operator twice produces the exact same result as applying it once (it is a true geometric projection):
$$P^2 = (I_n - J^+ J)(I_n - J^+ J) = I_n - 2 J^+ J + J^+ (J J^+) J$$
Using $J J^+ = I_m$:
$$P^2 = I_n - 2 J^+ J + J^+ I_m J = I_n - 2 J^+ J + J^+ J = I_n - J^+ J = P$$

##### 3. Self-Adjoint Orthogonality ($P^T = P$)
The projector is symmetric:
$$P^T = (I_n - J^+ J)^T = I_n^T - (J^+ J)^T = I_n - J^+ J = P$$
(using the fourth Penrose condition $(J^+ J)^T = J^+ J$).
Hence, $P$ is an **orthogonal projection operator** onto the nullspace $\mathcal{N}(J)$.

---

### 3.3 The General Redundant Kinematic Control Law
Let $\nu \in \mathbb{R}^m$ be the desired Cartesian velocity of the end-effector.
The complete family of all joint velocity vectors satisfying $J \dot{q} = \nu$ is given by:
$$\dot{q} = J^+ \nu + (I_n - J^+ J) \dot{q}_0$$
where:
- $\dot{q}_{\text{primary}} = J^+ \nu$ is the **particular solution** that strictly achieves the end-effector velocity $\nu$ with minimum Euclidean norm $\|\dot{q}\|_2$.
- $\dot{q}_{\text{null}} = (I_n - J^+ J) \dot{q}_0$ is the **homogeneous solution**, projecting an arbitrary secondary joint velocity vector $\dot{q}_0 \in \mathbb{R}^n$ into the nullspace.

#### Orthogonal Decomposition of Joint Effort:
Because $P = I - J^+ J$ is an orthogonal projector, the two components $\dot{q}_{\text{primary}}$ and $\dot{q}_{\text{null}}$ are mutually perpendicular:
$$\dot{q}_{\text{primary}}^T \dot{q}_{\text{null}} = (J^+ \nu)^T (I - J^+ J) \dot{q}_0 = \nu^T (J^+)^T (I - J^+ J) \dot{q}_0$$
Using $(J^+)^T = (J J^T)^{-1} J$:
$$\nu^T (J J^T)^{-1} [ J (I - J^+ J) ] \dot{q}_0 = \nu^T (J J^T)^{-1} [0] \dot{q}_0 = 0$$

By the Pythagorean theorem in $\mathbb{R}^n$:
$$\|\dot{q}\|_2^2 = \|\dot{q}_{\text{primary}}\|_2^2 + \|\dot{q}_{\text{null}}\|_2^2$$
The total joint kinetic energy decomposes cleanly into the energy required to move the tool plus the energy spent on nullspace self-motion!

---

### 3.4 Secondary Task Optimization via Gradient Projection
The vector $\dot{q}_0$ can be chosen arbitrarily. To optimize a scalar performance objective $H(q) \in \mathbb{R}$ (e.g., safety, clearance, manipulability), we set $\dot{q}_0$ along the **gradient** of $H(q)$:
$$\dot{q}_0 = k_0 \nabla_q H(q) = k_0 \begin{bmatrix} \frac{\partial H}{\partial q_1} \\ \vdots \\ \frac{\partial H}{\partial q_n} \end{bmatrix}$$
where $k_0 > 0$ is a positive gain factor.

The complete gradient-projected control law is:
$$\dot{q} = J^+(q) \nu + k_0 (I - J^+(q) J(q)) \nabla_q H(q)$$

#### Standard Secondary Objective Functions:

##### 1. Joint Limit Avoidance (Liégeois 1977)
To prevent joints from hitting mechanical hard stops, define a quadratic penalty centered at the midpoint of the joint limits:
$$H_{\text{limits}}(q) = -\frac{1}{2n} \sum_{i=1}^n \left( \frac{q_i - \bar{q}_i}{q_{i,\max} - q_{i,\min}} \right)^2$$
where $\bar{q}_i = \frac{q_{i,\max} + q_{i,\min}}{2}$ is the middle of the range for joint $i$.
The gradient vector component is:
$$\frac{\partial H_{\text{limits}}}{\partial q_i} = -\frac{q_i - \bar{q}_i}{n (q_{i,\max} - q_{i,\min})^2}$$
When joint $i$ approaches its upper limit ($q_i > \bar{q}_i$), the gradient becomes negative, commanding the motor to rotate back toward the comfortable center in the nullspace!

##### 2. Manipulability Maximization (Yoshikawa 1984)
To steer the arm away from kinematic singularities during trajectory tracking:
$$H_{\text{manip}}(q) = w(q) = \sqrt{\det(J(q) J^T(q))}$$
$$\dot{q}_0 = k_{\text{manip}} \nabla_q w(q)$$

##### 3. Obstacle Collision Avoidance
Let $p_{\text{elbow}}(q)$ be the 3D position of an elbow joint, and let $p_{\text{obs}}$ be the position of an obstacle in the workspace.
Define the distance objective:
$$H_{\text{obs}}(q) = \frac{1}{2} \|p_{\text{elbow}}(q) - p_{\text{obs}}\|_2^2$$
$$\nabla_q H_{\text{obs}} = J_{\text{elbow}}^T(q) (p_{\text{elbow}}(q) - p_{\text{obs}})$$
This pushes the elbow away from the obstacle while the hand continues performing its primary task uninterrupted!

---

### 3.5 Multi-Task Priority Hierarchies (Nakamura & Hanafusa 1987)
In advanced robotics, a system often has multiple competing tasks with strict priorities:
- **Priority 1 (Primary Task):** End-effector tool tracking: $J_1 \dot{q} = \nu_1$.
- **Priority 2 (Secondary Task):** Camera viewpoint or elbow obstacle avoidance: $J_2 \dot{q} = \nu_2$.

To ensure that Task 2 **never** disturbs Task 1, Task 2 is projected into the nullspace of Task 1:
$$\dot{q} = J_1^+ \nu_1 + \tilde{J}_2^+ (\nu_2 - J_2 J_1^+ \nu_1)$$
where:
- $\tilde{J}_2 = J_2 (I - J_1^+ J_1)$ is the Jacobian of Task 2 projected into the nullspace of Task 1.
- $\tilde{J}_2^+$ is its pseudoinverse.
- $(\nu_2 - J_2 J_1^+ \nu_1)$ is the remaining velocity required by Task 2 after accounting for the velocity already produced by Task 1!

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the Nullspace Redundancy Engine:

```typescript
export class RedundancyEngine {
  /**
   * Computes the n x n nullspace projector: P = I_n - J^+ * J
   */
  public static computeNullspaceProjector(J: number[][]): number[][] {
    const m = J.length;
    const n = J[0].length;

    // 1. Compute pseudoinverse J^+ = J^T * (J * J^T)^(-1)
    const J_pinv = this.computePseudoinverse(J);

    // 2. Compute J_pinv * J (n x n)
    const J_pinv_J: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += J_pinv[r][k] * J[k][c];
        }
        J_pinv_J[r][c] = sum;
      }
    }

    // 3. P = I_n - J_pinv * J
    const P: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        P[r][c] = (r === c ? 1.0 : 0.0) - J_pinv_J[r][c];
      }
    }

    return P;
  }

  /**
   * Evaluates the full redundancy resolution control law:
   * q_dot = J^+ * nu + (I - J^+ * J) * q_dot_0
   */
  public static resolveRedundancy(
    J: number[][],
    nu: number[],
    qDot0: number[]
  ): number[] {
    const m = J.length;
    const n = J[0].length;

    const J_pinv = this.computePseudoinverse(J);
    const P = this.computeNullspaceProjector(J);

    // Particular solution: J^+ * nu
    const qDotPrimary: number[] = new Array(n).fill(0);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < m; c++) sum += J_pinv[r][c] * nu[c];
      qDotPrimary[r] = sum;
    }

    // Nullspace solution: P * qDot0
    const qDotNull: number[] = new Array(n).fill(0);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < n; c++) sum += P[r][c] * qDot0[c];
      qDotNull[r] = sum;
    }

    // Total q_dot = qDotPrimary + qDotNull
    return qDotPrimary.map((val, i) => val + qDotNull[i]);
  }

  /**
   * Computes the gradient of the joint limit avoidance objective:
   * H(q) = -1/(2n) * sum( (q_i - q_bar_i)^2 / (q_max_i - q_min_i)^2 )
   */
  public static computeJointLimitGradient(
    q: number[],
    qMin: number[],
    qMax: number[]
  ): number[] {
    const n = q.length;
    const grad: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      const qBar = 0.5 * (qMax[i] + qMin[i]);
      const range = qMax[i] - qMin[i];
      grad[i] = -(q[i] - qBar) / (n * range * range);
    }
    return grad;
  }

  private static computePseudoinverse(J: number[][]): number[][] {
    const m = J.length;
    const n = J[0].length;

    // JJT = J * J^T (m x m)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += J[i][k] * J[j][k];
        JJT[i][j] = sum;
      }
    }

    // Invert JJT
    const JJT_inv = this.invertMatrix(JJT);

    // J^+ = J^T * JJT_inv (n x m)
    const J_pinv: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        let sum = 0;
        for (let k = 0; k < m; k++) sum += J[k][r] * JJT_inv[k][c];
        J_pinv[r][c] = sum;
      }
    }
    return J_pinv;
  }

  private static invertMatrix(A: number[][]): number[][] {
    const n = A.length;
    const M = A.map((row, i) => {
      const aug = new Array(2 * n).fill(0);
      for (let j = 0; j < n; j++) aug[j] = row[j];
      aug[n + i] = 1.0;
      return aug;
    });

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];

      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) throw new Error("Matrix singular in pseudoinverse");

      for (let j = 0; j < 2 * n; j++) M[i][j] /= pivot;

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = 0; j < 2 * n; j++) M[k][j] -= factor * M[i][j];
        }
      }
    }

    return M.map(row => row.slice(n));
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 10.1: Analytical Nullspace Projector for a 3R Planar Arm
**Problem Statement:** Consider a 3R planar manipulator with $L_1 = L_2 = L_3 = 1.0\text{ m}$ at configuration $q = [0^\circ, 90^\circ, 0^\circ]^T = [0, \pi/2, 0]^T$ (from Chapter 8, Problem 8.5), where the positional Jacobian is:
$$J = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$$
1. Compute the Moore-Penrose pseudoinverse $J^+ = J^T (J J^T)^{-1}$.
2. Compute the exact $3 \times 3$ nullspace projection matrix $P = I_3 - J^+ J$.

**Given Data:**
- $J = \begin{bmatrix} -2 & -2 & -1 \\ 1 & 0 & 0 \end{bmatrix}$
- From Chapter 8: $(J J^T)^{-1} = \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Compute $J^+ = J^T (J J^T)^{-1}$:
   $$J^+ = \begin{bmatrix} -2.0 & 1.0 \\ -2.0 & 0.0 \\ -1.0 & 0.0 \end{bmatrix} \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix} = \begin{bmatrix} -2(0.2) + 1(0.4) & -2(0.4) + 1(1.8) \\ -2(0.2) + 0 & -2(0.4) + 0 \\ -1(0.2) + 0 & -1(0.4) + 0 \end{bmatrix} = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix}$$
2. Compute $J^+ J$ ($3 \times 3$ matrix):
   $$J^+ J = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix} \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$$
   - Row 1: $[0(-2) + 1(1), \; 0(-2) + 1(0), \; 0(-1) + 1(0)] = [1.0, 0.0, 0.0]$
   - Row 2: $[-0.4(-2) - 0.8(1), \; -0.4(-2) + 0, \; -0.4(-1) + 0] = [0.8 - 0.8, \; 0.8, \; 0.4] = [0.0, 0.8, 0.4]$
   - Row 3: $[-0.2(-2) - 0.4(1), \; -0.2(-2) + 0, \; -0.2(-1) + 0] = [0.4 - 0.4, \; 0.4, \; 0.2] = [0.0, 0.4, 0.2]$
   $$J^+ J = \begin{bmatrix} 1.0 & 0.0 & 0.0 \\ 0.0 & 0.8 & 0.4 \\ 0.0 & 0.4 & 0.2 \end{bmatrix}$$
3. Compute $P = I_3 - J^+ J$:
   $$P = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} - \begin{bmatrix} 1.0 & 0.0 & 0.0 \\ 0.0 & 0.8 & 0.4 \\ 0.0 & 0.4 & 0.2 \end{bmatrix} = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$$

**Final Answer:**
$$P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$$

**Verification & Sanity Check:**
- Check symmetry: $P^T = P$. Verified.
- Check idempotence $P^2 = P$:
  $P^2 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.2^2 + (-0.4)^2 & 0.2(-0.4) - 0.4(0.8) \\ 0 & -0.4(0.2) + 0.8(-0.4) & (-0.4)^2 + 0.8^2 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.04 + 0.16 & -0.08 - 0.32 \\ 0 & -0.08 - 0.32 & 0.16 + 0.64 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.2 & -0.4 \\ 0 & -0.4 & 0.8 \end{bmatrix} = P$. Verified.

---

### Problem 10.2: Proof of Nullspace Annihilation $J P = 0$
**Problem Statement:** Using the numerical matrices from Problem 10.1, explicitly calculate $J \cdot P$ and verify that it equals the $2 \times 3$ zero matrix.

**Given Data:**
- $J = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$
- $P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Compute Row 1 of $J P$:
   - Column 1: $-2.0(0.0) - 2.0(0.0) - 1.0(0.0) = 0.0$
   - Column 2: $-2.0(0.0) - 2.0(0.2) - 1.0(-0.4) = 0 - 0.4 + 0.4 = 0.0$
   - Column 3: $-2.0(0.0) - 2.0(-0.4) - 1.0(0.8) = 0 + 0.8 - 0.8 = 0.0$
2. Compute Row 2 of $J P$:
   - Column 1: $1.0(0.0) + 0.0(0.0) + 0.0(0.0) = 0.0$
   - Column 2: $1.0(0.0) + 0.0(0.2) + 0.0(-0.4) = 0.0$
   - Column 3: $1.0(0.0) + 0.0(-0.4) + 0.0(0.8) = 0.0$

**Final Answer:**
$$J P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.0 & 0.0 \end{bmatrix} = 0_{2 \times 3}$$

**Verification & Sanity Check:**
The product vanishes identically to machine precision. Any joint velocity vector produced by multiplying $P$ with any arbitrary vector $\dot{q}_0$ produces exactly **zero** Cartesian velocity!

---

### Problem 10.3: Pure Self-Motion Velocity Calculation
**Problem Statement:** An engineer commands an arbitrary joint speed request $\dot{q}_0 = [1.0, 2.0, -1.0]^T\text{ rad/s}$ into the nullspace of the 3R arm from Problem 10.1 while demanding that the end-effector remain completely stationary ($\nu = [0, 0]^T$).
1. Compute the projected nullspace joint velocity $\dot{q}_{\text{null}} = P \dot{q}_0$.
2. Verify that the Cartesian velocity of the end-effector is $0.000\text{ m/s}$.

**Given Data:**
- $P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$
- $\dot{q}_0 = [1.0, 2.0, -1.0]^T$

**Step-by-Step Derivation:**
1. Compute $\dot{q}_{\text{null}} = P \dot{q}_0$:
   $$\dot{q}_{\text{null}, 1} = 0(1.0) + 0(2.0) + 0(-1.0) = 0.0\text{ rad/s}$$
   $$\dot{q}_{\text{null}, 2} = 0(1.0) + 0.2(2.0) - 0.4(-1.0) = 0.4 + 0.4 = +0.8\text{ rad/s}$$
   $$\dot{q}_{\text{null}, 3} = 0(1.0) - 0.4(2.0) + 0.8(-1.0) = -0.8 - 0.8 = -1.6\text{ rad/s}$$
   $$\dot{q}_{\text{null}} = [0.0, +0.8, -1.6]^T\text{ rad/s}$$
2. Compute actual end-effector velocity $\nu = J \dot{q}_{\text{null}}$:
   $$v_x = -2.0(0.0) - 2.0(0.8) - 1.0(-1.6) = -1.6 + 1.6 = 0.000\text{ m/s}$$
   $$v_y = 1.0(0.0) + 0.0(0.8) + 0.0(-1.6) = 0.000\text{ m/s}$$

**Final Answer:**
- Projected joint velocity: **$\dot{q}_{\text{null}} = [0.0, +0.8, -1.6]^T\text{ rad/s}$**
- Resulting end-effector velocity: **$\nu = [0.000, 0.000]^T\text{ m/s}$**

**Verification & Sanity Check:**
Joint 2 rotates at $+0.8\text{ rad/s}$ while Joint 3 rotates at exactly double the speed in reverse ($-1.6\text{ rad/s}$). This creates an instantaneous scissor-like counter-rotation that leaves the tool tip completely frozen in space.

---

### Problem 10.4: Joint Limit Avoidance via Gradient Projection
**Problem Statement:** The 3R planar arm is at configuration $q = [0.0, 1.8, 0.0]^T\text{ rad}$ ($[0^\circ, 103.1^\circ, 0^\circ]$).
- Joint limits for all joints are $[-2.0, +2.0]\text{ rad}$.
- The primary task demands zero end-effector motion ($\nu = 0$).
Calculate the nullspace joint velocity command that pushes Joint 2 away from its upper limit back toward its center $\bar{q} = 0$, with gain $k_0 = 10.0$.

**Given Data:**
- $q = [0.0, 1.8, 0.0]^T$
- $q_{\min} = -2.0, q_{\max} = +2.0 \implies \bar{q} = 0.0$
- Range: $q_{\max} - q_{\min} = 4.0\text{ rad}$
- $n = 3, k_0 = 10.0$

**Step-by-Step Derivation:**
1. Compute the Liégeois gradient vector:
   $$\nabla_q H = -\frac{q - \bar{q}}{n (q_{\max} - q_{\min})^2} = -\frac{q}{3(4.0)^2} = -\frac{q}{48.0}$$
   - Joint 1: $-\frac{0.0}{48.0} = 0.0$
   - Joint 2: $-\frac{1.8}{48.0} = -0.0375$
   - Joint 3: $-\frac{0.0}{48.0} = 0.0$
   $$\nabla_q H = [0.0, -0.0375, 0.0]^T$$
2. Scale by gain $k_0 = 10.0$:
   $$\dot{q}_0 = 10.0 [0.0, -0.0375, 0.0]^T = [0.0, -0.375, 0.0]^T\text{ rad/s}$$
3. Project into the nullspace using $P$:
   $$\dot{q}_{\text{null}} = P \dot{q}_0 = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix} \begin{bmatrix} 0.0 \\ -0.375 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.2(-0.375) \\ -0.4(-0.375) \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.075 \\ +0.150 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
$$\dot{q} = [0.000\text{ rad/s}, -0.075\text{ rad/s}, +0.150\text{ rad/s}]^T$$

**Verification & Sanity Check:**
- Joint 2 velocity is **negative** ($-0.075\text{ rad/s}$), successfully rotating Joint 2 away from its dangerous upper limit $+2.0\text{ rad}$ toward center $0.0$.
- Joint 3 automatically compensates with $+0.150\text{ rad/s}$ so that the end-effector experiences zero Cartesian perturbation!

---

### Problem 10.5: Manipulability Gradient Projection
**Problem Statement:** A 3R arm has manipulability measure $w(q)$. At its current pose, $\nabla_q w = [0.0, -0.5, 0.2]^T$. The primary task demands Cartesian velocity $\nu = [0.2, 0.0]^T\text{ m/s}$. Using the pseudoinverse $J^+$ and nullspace projector $P$ from Problem 10.1, compute the combined joint velocity command with manipulability gain $k_w = 2.0$.

**Given Data:**
- $J^+ = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix}$
- $P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$
- $\nu = [0.2, 0.0]^T$
- $\nabla_q w = [0.0, -0.5, 0.2]^T, k_w = 2.0$

**Step-by-Step Derivation:**
1. Compute primary task velocity $\dot{q}_{\text{primary}} = J^+ \nu$:
   $$\dot{q}_{\text{primary}} = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix} \begin{bmatrix} 0.2 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 0.0(0.2) + 0 \\ -0.4(0.2) + 0 \\ -0.2(0.2) + 0 \end{bmatrix} = \begin{bmatrix} 0.00 \\ -0.08 \\ -0.04 \end{bmatrix}\text{ rad/s}$$
2. Compute secondary gradient command $\dot{q}_0 = k_w \nabla_q w$:
   $$\dot{q}_0 = 2.0 \begin{bmatrix} 0.0 \\ -0.5 \\ 0.2 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -1.0 \\ 0.4 \end{bmatrix}\text{ rad/s}$$
3. Project $\dot{q}_0$ into nullspace:
   $$\dot{q}_{\text{null}} = P \dot{q}_0 = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix} \begin{bmatrix} 0.0 \\ -1.0 \\ 0.4 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.2(-1.0) - 0.4(0.4) \\ -0.4(-1.0) + 0.8(0.4) \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.20 - 0.16 \\ 0.40 + 0.32 \end{bmatrix} = \begin{bmatrix} 0.00 \\ -0.36 \\ +0.72 \end{bmatrix}\text{ rad/s}$$
4. Sum primary and secondary joint velocities:
   $$\dot{q} = \dot{q}_{\text{primary}} + \dot{q}_{\text{null}} = \begin{bmatrix} 0.00 \\ -0.08 \\ -0.04 \end{bmatrix} + \begin{bmatrix} 0.00 \\ -0.36 \\ +0.72 \end{bmatrix} = \begin{bmatrix} 0.00 \\ -0.44 \\ +0.68 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
$$\dot{q} = [0.00\text{ rad/s}, -0.44\text{ rad/s}, +0.68\text{ rad/s}]^T$$

**Verification & Sanity Check:**
Check primary task execution:
$J \dot{q} = \begin{bmatrix} -2 & -2 & -1 \\ 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0.00 \\ -0.44 \\ 0.68 \end{bmatrix} = \begin{bmatrix} 0 - 2(-0.44) - 1(0.68) \\ 1(0) + 0 + 0 \end{bmatrix} = \begin{bmatrix} 0.88 - 0.68 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.20 \\ 0.00 \end{bmatrix}\text{ m/s}$.
Matches $\nu$ exactly!

---

### Problem 10.6: 7-DoF Arm Elbow Swivel Angle Parameterization
**Problem Statement:** A 7-DoF humanoid arm has a fixed shoulder origin $p_s$ and fixed wrist center $p_w$. Explain geometrically why the nullspace self-motion manifold forms a circle, and define the elbow swivel angle $\psi$.

**Solution:**
1. The shoulder joint position $p_s$ and wrist center position $p_w$ are fixed in space.
2. The distance from shoulder to wrist is constant: $D_{sw} = \|p_w - p_s\|$.
3. The upper arm has fixed length $L_{\text{upper}}$ and the forearm has fixed length $L_{\text{forearm}}$.
4. The elbow joint $p_e$ must simultaneously lie on a sphere of radius $L_{\text{upper}}$ centered at $p_s$ and a sphere of radius $L_{\text{forearm}}$ centered at $p_w$.
5. The intersection of two spheres in 3D space is a **circle**!
6. The elbow can travel along this circle without altering the position of the shoulder or the wrist. The angle parameterizing this circle around the shoulder-to-wrist axis is the **swivel angle $\psi \in [0, 2\pi)$**.

---

### Problem 10.7: Two-Priority Task Hierarchy Formulation
**Problem Statement:** A 7-DoF robot has two tasks:
- Task 1 (Primary, $m_1 = 3$): Maintain 3D position $p_e = p_d$.
- Task 2 (Secondary, $m_2 = 1$): Align elbow height $z_{\text{elbow}} = z_d$.
Derive the decoupled control law.

**Step-by-Step Derivation:**
1. Primary task:
   $$J_1 \dot{q} = \nu_1 \implies \dot{q}_1 = J_1^+ \nu_1$$
2. Let the secondary task velocity be $\nu_2 = \dot{z}_d + K_2 (z_d - z_{\text{elbow}})$.
3. Project Task 2 into the nullspace of Task 1:
   $$\dot{q} = J_1^+ \nu_1 + (I - J_1^+ J_1) \dot{q}_2$$
4. Substitute into Task 2:
   $$J_2 \dot{q} = J_2 J_1^+ \nu_1 + J_2 (I - J_1^+ J_1) \dot{q}_2 = \nu_2$$
   $$J_2 (I - J_1^+ J_1) \dot{q}_2 = \nu_2 - J_2 J_1^+ \nu_1$$
5. Let $\tilde{J}_2 = J_2 (I - J_1^+ J_1)$. Solving for $\dot{q}_2$:
   $$\dot{q}_2 = \tilde{J}_2^+ (\nu_2 - J_2 J_1^+ \nu_1)$$
6. Full decoupled control law:
   $$\dot{q} = J_1^+ \nu_1 + (I - J_1^+ J_1) \left( J_2 (I - J_1^+ J_1) \right)^+ (\nu_2 - J_2 J_1^+ \nu_1)$$

**Final Answer:**
Task 2 is fulfilled to the maximum extent mathematically possible without producing any error in Task 1.

---

### Problem 10.8: Orthogonal Energy Decomposition Verification
**Problem Statement:** For the joint velocity vector in Problem 10.5 ($\dot{q} = [0, -0.44, 0.68]^T$), verify numerically that $\|\dot{q}\|^2 = \|\dot{q}_{\text{primary}}\|^2 + \|\dot{q}_{\text{null}}\|^2$.

**Given Data:**
- $\dot{q}_{\text{primary}} = [0.00, -0.08, -0.04]^T$
- $\dot{q}_{\text{null}} = [0.00, -0.36, 0.72]^T$
- $\dot{q} = [0.00, -0.44, 0.68]^T$

**Step-by-Step Derivation:**
1. Compute $\|\dot{q}_{\text{primary}}\|^2$:
   $$\|\dot{q}_{\text{primary}}\|^2 = 0^2 + (-0.08)^2 + (-0.04)^2 = 0.0064 + 0.0016 = 0.0080\text{ rad}^2/\text{s}^2$$
2. Compute $\|\dot{q}_{\text{null}}\|^2$:
   $$\|\dot{q}_{\text{null}}\|^2 = 0^2 + (-0.36)^2 + 0.72^2 = 0.1296 + 0.5184 = 0.6480\text{ rad}^2/\text{s}^2$$
3. Sum of components:
   $$\|\dot{q}_{\text{primary}}\|^2 + \|\dot{q}_{\text{null}}\|^2 = 0.0080 + 0.6480 = 0.6560\text{ rad}^2/\text{s}^2$$
4. Compute total $\|\dot{q}\|^2$:
   $$\|\dot{q}\|^2 = 0^2 + (-0.44)^2 + 0.68^2 = 0.1936 + 0.4624 = 0.6560\text{ rad}^2/\text{s}^2$$

**Final Answer:**
$$\|\dot{q}\|^2 = 0.6560 = \|\dot{q}_{\text{primary}}\|^2 + \|\dot{q}_{\text{null}}\|^2$$
Orthogonal energy decomposition holds to exact numerical precision.

---

### Problem 10.9: Obstacle Repulsion in the Nullspace
**Problem Statement:** A 3R arm has its elbow at $p_{\text{elbow}} = [1.0, 0.0]^T$. An obstacle is detected at $p_{\text{obs}} = [1.0, 0.5]^T$ (too close along $+y$). Formulate the repulsive gradient vector $\nabla_q H_{\text{obs}}$ given $J_{\text{elbow}} = \begin{bmatrix} 0 & 0 & 0 \\ 1 & 0 & 0 \end{bmatrix}$.

**Step-by-Step Derivation:**
1. Distance vector from obstacle to elbow:
   $$r = p_{\text{elbow}} - p_{\text{obs}} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} - \begin{bmatrix} 1.0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.5 \end{bmatrix}\text{ m}$$
2. The repulsive potential objective is $H(q) = \frac{1}{2} \|r\|^2$.
3. Compute the gradient:
   $$\nabla_q H = J_{\text{elbow}}^T r = \begin{bmatrix} 0 & 1 \\ 0 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0.0 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.5 \\ 0.0 \\ 0.0 \end{bmatrix}$$
4. Projecting this into the arm's nullspace commands the base joint to rotate away from the obstacle while nullspace projection counter-rotates joints 2 and 3 to keep the tool tip motionless.

---

### Problem 10.10: Closed-Loop Numerical Drift in Nullspace Self-Motion
**Problem Statement:** Explain why continuously integrating open-loop nullspace velocity $\dot{q} = (I - J^+ J) \dot{q}_0$ in real-time control causes the end-effector to drift over time, and state the Closed-Loop Inverse Kinematics (CLIK) correction.

**Solution:**
1. In discrete time with sampling interval $\Delta t$, the configuration update is $q_{k+1} = q_k + \dot{q} \Delta t$.
2. Because the forward kinematics $f(q)$ is non-linear, the first-order approximation $f(q + \Delta q) \approx f(q) + J \Delta q$ has a truncation error of $\mathcal{O}(\Delta t^2)$.
3. Over thousands of control cycles, these small truncation errors accumulate, causing the physical tool tip to slowly drift away from the target position.
4. **CLIK Correction:**
   Add a closed-loop proportional error correction term to the task velocity:
   $$\nu_{\text{corrected}} = \nu_d + K_p (x_d - f(q))$$
   $$\dot{q} = J^+ \left( \nu_d + K_p (x_d - f(q)) \right) + (I - J^+ J) \dot{q}_0$$
   This continuously pulls the tool tip back onto the true physical target, eliminating numerical drift completely.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 10.11: Nullspace Dimension of a 7-DoF Manipulator
**Problem Statement:** A 7-DoF manipulator performs a 6D spatial tracking task ($m = 6$). At a non-singular pose, what is the dimension of the nullspace? What does the dimension become at an internal singularity where $\operatorname{rank}(J) = 5$?

**Solution:**
1. Non-singular pose: $\operatorname{rank}(J) = 6$.
   $$\dim(\mathcal{N}(J)) = n - \operatorname{rank}(J) = 7 - 6 = 1\text{ DoF}$$
   The robot has a 1D self-motion manifold (swivel angle).
2. At a rank-5 singularity: $\operatorname{rank}(J) = 5$.
   $$\dim(\mathcal{N}(J)) = 7 - 5 = 2\text{ DoF}$$
   The nullspace expands to **2 dimensions**! The robot gains an additional internal self-motion freedom while losing one external task freedom.

---

### Problem 10.12: Nullspace Projector for a 4-Link Planar Arm
**Problem Statement:** A 4-link planar arm operates in 2D space ($m = 2, n = 4$). What is the rank and trace of its nullspace projection matrix $P$?

**Solution:**
1. The nullspace projector is $P = I_4 - J^+ J$.
2. For an orthogonal projection operator onto an $r$-dimensional subspace, its trace equals its rank:
   $$\operatorname{tr}(P) = \operatorname{rank}(P) = \dim(\mathcal{N}(J)) = n - m = 4 - 2 = 2$$
3. Matrix $P$ has rank 2, trace 2, with eigenvalues $\{1, 1, 0, 0\}$.

---

### Problem 10.13: Weighted Nullspace Projector
**Problem Statement:** Derive the weighted nullspace projector $P_W$ for the weighted pseudoinverse $J_W^+ = W^{-1} J^T (J W^{-1} J^T)^{-1}$.

**Solution:**
1. The particular solution is $\dot{q}_p = J_W^+ \nu$.
2. The weighted nullspace projector is:
   $$P_W = I_n - J_W^+ J = I_n - W^{-1} J^T (J W^{-1} J^T)^{-1} J$$
3. Check property: $J P_W = J - (J J_W^+) J = J - I J = 0$.

---

### Problem 10.14: Asymmetric Barrier Functions for Joint Limits
**Problem Statement:** Formulate a logarithmic barrier function $B(q_i)$ that approaches $+\infty$ as $q_i \to q_{i,\max}$ or $q_i \to q_{i,\min}$.

**Solution:**
1. Define the barrier potential:
   $$B(q_i) = -\ln(q_{i,\max} - q_i) - \ln(q_i - q_{i,\min})$$
2. Gradient:
   $$\frac{\partial B}{\partial q_i} = \frac{1}{q_{i,\max} - q_i} - \frac{1}{q_i - q_{i,\min}}$$
3. When $q_i$ is centered, the two terms balance to zero. As $q_i \to q_{i,\max}$, the first term diverges to $+\infty$, exerting a fierce repulsive force in the nullspace away from the limit.

---

### Problem 10.15: Singularity in Secondary Task Execution
**Problem Statement:** In a two-priority task hierarchy, can the secondary task experience a singularity even when the primary task is completely non-singular?

**Solution:**
1. Yes. The secondary task requires inverting $\tilde{J}_2 = J_2 (I - J_1^+ J_1)$.
2. Even if $J_1$ and $J_2$ both have full rank independently, their nullspace intersection may drop rank if the task directions of $J_2$ are entirely collinear with $J_1$.
3. When $\operatorname{rank}(\tilde{J}_2) < m_2$, the secondary task experiences an **algorithmic singularity**, requiring DLS regularization on $\tilde{J}_2$.

---

### Problem 10.16: Kinetic Energy Minimization
**Problem Statement:** Prove that the particular solution $\dot{q} = J_M^+ \nu$ weighted by the mass matrix $M(q)$ minimizes the instantaneous kinetic energy $T = \frac{1}{2}\dot{q}^T M \dot{q}$.

**Solution:**
1. Minimize $T = \frac{1}{2}\dot{q}^T M \dot{q}$ subject to $J \dot{q} = \nu$.
2. This is identical to the weighted pseudoinverse optimization in Problem 8.13 with $W = M(q)$.
3. The optimal solution is $\dot{q} = M^{-1} J^T (J M^{-1} J^T)^{-1} \nu$.
4. This produces the **dynamically consistent generalized inverse** (Khatib 1987), which decouples task-space accelerations from joint self-motion.

---

### Problem 10.17: Whole-Body Humanoid Task Allocation
**Problem Statement:** A humanoid biped has 32 degrees of freedom. Outline a 3-tier task hierarchy for safe walking.

**Solution:**
1. **Priority 1 (Survival / Balance):** Center of Pressure (CoP) and foot support contact constraints ($J_{\text{feet}} \dot{q} = 0$).
2. **Priority 2 (Locomotion):** Center of Mass (CoM) trajectory tracking and swing foot placement.
3. **Priority 3 (Manipulation / Posture):** Hand manipulation, torso upright posture, and joint limit avoidance in the remaining whole-body nullspace.

---

### Problem 10.18: Nullspace Viscous Damping
**Problem Statement:** To prevent high-speed internal oscillations in the nullspace, controllers add viscous damping $\dot{q}_0 = -D_n \dot{q}$. Formulate the resulting closed-loop dynamics.

**Solution:**
1. The nullspace command is $\dot{q}_{\text{null}} = P (-D_n \dot{q})$.
2. This introduces a synthetic Rayleigh dissipation force strictly along internal self-motion modes, smoothly dissipating kinetic energy without exerting any braking force on the end-effector tool path.

---

### Problem 10.19: SVD Basis for the Nullspace
**Problem Statement:** Given the SVD of the Jacobian $J = U \Sigma V^T \in \mathbb{R}^{m \times n}$ with $\operatorname{rank}(J) = m < n$, show how the nullspace basis is extracted from matrix $V$.

**Solution:**
1. Partition the $n \times n$ orthogonal matrix $V = \begin{bmatrix} V_{\text{row}} & V_{\text{null}} \end{bmatrix}$, where $V_{\text{row}} \in \mathbb{R}^{n \times m}$ and $V_{\text{null}} \in \mathbb{R}^{n \times (n-m)}$.
2. Then:
   $$J V_{\text{null}} = (U \Sigma V^T) V_{\text{null}} = U \Sigma \begin{bmatrix} I_m \\ 0 \end{bmatrix}^T \begin{bmatrix} 0 \\ I_{n-m} \end{bmatrix} = U \Sigma (0) = 0$$
3. The remaining $(n - m)$ columns of matrix $V$ form an **orthonormal basis** for the nullspace $\mathcal{N}(J)$!

---

### Problem 10.20: Verification of Nullspace Invariants
**Problem Statement:** Formulate the numerical unit tests to verify a computed nullspace projection matrix $P$.

**Solution:**
For any valid nullspace projector $P = I - J^+ J$:
1. **Annihilation Test:** $\|J P\|_\infty < 10^{-12}$.
2. **Idempotence Test:** $\|P^2 - P\|_\infty < 10^{-12}$.
3. **Symmetry Test:** $\|P^T - P\|_\infty < 10^{-12}$.
4. **Trace Consistency Test:** $|\operatorname{tr}(P) - (n - \operatorname{rank}(J))| < 10^{-12}$.
All four invariant tests must pass to machine precision.
