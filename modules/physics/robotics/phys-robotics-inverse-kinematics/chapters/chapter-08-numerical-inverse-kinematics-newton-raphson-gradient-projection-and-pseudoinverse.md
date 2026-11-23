# Chapter 8: Numerical Inverse Kinematics — Newton-Raphson, Gradient Projection, and Pseudoinverse

---

## 1. The Layman's Genesis & Intuitive Overview

In Chapter 5, we solved Inverse Kinematics algebraically using closed-form geometric equations. This worked like magic for robots with spherical wrists (Pieper's criterion). 

However, in modern advanced robotics, many of the most capable machines on Earth do **not** fit this neat algebraic template:
- A human arm has 7 degrees of freedom (redundant).
- Collaborative robots like the Franka Emika Panda, KUKA LBR iiwa, and humanoid bipeds have 7 or more joints without intersecting spherical wrists.
- Mobile manipulators have 10 or more combined wheel and arm joints.
- Even on a standard robot, adding a custom offset tool or gripper tilts the end-effector axes, destroying Pieper's symmetry.

When algebraic formulas do not exist, how does a computer tell the robot's motors how to reach an object?

```
   Guess Configuration q_k ──▶ Compute Forward Kinematics f(q_k) ──▶ Error e = x_d - f(q_k)
             ▲                                                               │
             │                                                               │
             └──────── Update: q_{k+1} = q_k + Delta q ◀─────────────────────┘
                               (Iterative Convergence to Target)
```

The answer is **Numerical Inverse Kinematics**. Instead of finding the exact mathematical answer in one miraculous algebraic stroke, the robot acts like a skilled human archer adjusting their aim:
1. It takes an initial guess of joint angles $q_0$ (usually where the arm is currently standing).
2. It calculates where the hand currently is, and measures the remaining error vector to the target $e = x_d - f(q_0)$.
3. It uses the **Jacobian matrix** (Chapter 6) to linearize the problem and compute an instantaneous joint adjustment $\Delta q$.
4. It updates the joint angles $q_1 = q_0 + \Delta q$, measures the remaining microscopic error, and repeats.

Within 3 to 5 iterations—taking less than 50 microseconds on a standard microcontroller—the error shrinks below a hundredth of a millimeter, achieving sub-millimeter precision!

---

## 2. Historical Foundations & Epistemological Evolution

Iterative root-finding is one of the oldest and most celebrated branches of numerical analysis:
- The **Newton-Raphson method** originated in Sir Isaac Newton's 1669 manuscript *De analysi per aequationes numero terminorum infinitas* and Joseph Raphson's 1690 *Analysis aequationum universalis*. Newton and Raphson demonstrated that non-linear equations $g(x) = 0$ can be solved with quadratic convergence by repeatedly stepping along the tangent slope: $x_{k+1} = x_k - \frac{g(x_k)}{g'(x_k)}$.
- In 1920, **Eliakim Hastings Moore** introduced the generalized matrix inverse, which was independently rediscovered and formalized in 1955 by the British mathematician **Sir Roger Penrose** as the **Moore-Penrose Pseudoinverse $J^+$**. Penrose proved that for any linear system $J \Delta q = e$ with redundant degrees of freedom, $J^+$ provides the unique solution that strictly minimizes the Euclidean norm of the joint step $\|\Delta q\|_2$.
- In 1984, **William A. Wolovich** and **Henry Elliott** at Brown University introduced the **Jacobian Transpose method** for robot kinematics. They proved via Lyapunov stability theory that stepping along the gradient of the task error $\Delta q = \alpha J^T e$ guarantees asymptotic convergence without ever inverting a matrix, providing a fail-safe, ultra-lightweight numerical solver for embedded microprocessors.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Task Space Error Vector Formulation
Let $x_d = (p_d, R_d) \in SE(3)$ be the desired end-effector pose, and let $x(q) = (p(q), R(q))$ be the current pose computed via forward kinematics.

The task-space error vector $e(q) \in \mathbb{R}^6$ consists of a 3D linear position error $e_p$ and a 3D rotational orientation error $e_R$:
$$e(q) = \begin{bmatrix} e_p(q) \\ e_R(q) \end{bmatrix} \in \mathbb{R}^6$$

#### 1. Position Error:
$$e_p(q) = p_d - p(q) \in \mathbb{R}^3$$

#### 2. Orientation Error:
Representing 3D orientation error requires careful geometric formulation because rotation matrices do not subtract linearly ($R_d - R \notin SO(3)$). Two rigorous formulations exist:

##### Formulation A: Matrix Skew-Symmetric Cross Product
Let $R_d = [n_d, s_d, a_d]$ and $R(q) = [n, s, a]$ be the column vectors of the desired and current rotation matrices. The orientation error vector $e_R$ is defined by:
$$e_R = \frac{1}{2} \left( n(q) \times n_d + s(q) \times s_d + a(q) \times a_d \right) \in \mathbb{R}^3$$
*Property:* When $R(q) = R_d$, all three cross products vanish ($n \times n = 0$), so $e_R = 0$. For small angular displacements, $\|e_R\| \approx \sin\theta \approx \theta$.

##### Formulation B: Matrix Logarithm on $SO(3)$
The relative rotation from current to desired attitude is $R_{\text{err}} = R_d R^T(q) \in SO(3)$.
Applying the matrix logarithm (Chapter 2):
$$[e_R] = \log(R_d R^T(q)) \in \mathfrak{so}(3) \implies e_R = \operatorname{vee}\left( \log(R_d R^T(q)) \right) = \hat{\omega} \theta$$
This gives the exact axis-angle error vector in radians.

---

### 3.2 First-Order Taylor Series Linearization
The forward kinematics mapping $f: \mathcal{Q} \to \mathcal{X}$ is a smooth non-linear function.
Expanding $f(q)$ in a multivariable Taylor series around the current configuration $q_k$:
$$f(q_k + \Delta q) = f(q_k) + J(q_k) \Delta q + \mathcal{O}(\|\Delta q\|^2)$$
We want the updated configuration $q_{k+1} = q_k + \Delta q$ to satisfy $f(q_{k+1}) = x_d$:
$$f(q_k) + J(q_k) \Delta q \approx x_d \implies J(q_k) \Delta q = x_d - f(q_k) = e(q_k)$$

This yields the fundamental linear differential kinematics equation:
$$J(q_k) \Delta q = e(q_k)$$

Depending on the dimensions and conditioning of $J(q_k)$, three primary numerical solver paradigms exist:

---

### 3.3 Method 1: The Newton-Raphson Method ($m = n$)
When the robot is non-redundant and the Jacobian is a square, non-singular matrix ($m = n$, $\det(J) \neq 0$), the unique solution for the joint increment $\Delta q$ is obtained by direct matrix inversion:
$$\Delta q = J^{-1}(q_k) e(q_k)$$
The configuration update rule is:
$$q_{k+1} = q_k + J^{-1}(q_k) e(q_k)$$

#### Quadratic Convergence Property:
Near a regular root $q^*$, the error satisfies:
$$\|q_{k+1} - q^*\| \le C \|q_k - q^*\|^2$$
The number of significant digits of precision roughly doubles with every single iteration!

---

### 3.4 Method 2: The Jacobian Transpose Method (Wolovich & Elliott 1984)
Computing $J^{-1}$ requires $\mathcal{O}(n^3)$ operations and blows up dangerously near singularities.
Wolovich and Elliott proposed substituting the matrix inverse with the **Jacobian Transpose**:
$$\Delta q = \alpha J^T(q_k) e(q_k)$$
where $\alpha > 0$ is a scalar step size.

#### Lyapunov Monotonic Convergence Proof:
Define the candidate Lyapunov energy function as the squared task-space error norm:
$$V(e) = \frac{1}{2} e^T e = \frac{1}{2} \|e\|_2^2 \ge 0$$
Note that $V(e) = 0$ if and only if $e = 0$.

Differentiating $V$ with respect to continuous time:
$$\dot{V}(e) = e^T \dot{e} = e^T (-\dot{x}) = -e^T J(q) \dot{q}$$
Substitute the control law $\dot{q} = \alpha J^T(q) e$:
$$\dot{V}(e) = -e^T J (\alpha J^T e) = -\alpha (e^T J) (J^T e) = -\alpha \|J^T e\|_2^2 \le 0$$

Because $\alpha > 0$ and $\|J^T e\|_2^2 \ge 0$, $\dot{V}(e)$ is **strictly negative semi-definite**!
By Lyapunov's direct method, the energy $V(e)$ decreases monotonically at every instant, guaranteeing convergence to the target set $J^T e = 0$ without matrix inversion!

#### Optimal Step Size $\alpha^*$:
To find the step size $\alpha$ that minimizes the error in a single discrete step, substitute $\Delta x \approx J \Delta q = \alpha J J^T e$:
$$e_{k+1} = e_k - \alpha J J^T e_k$$
Minimize the new error norm $\|e_{k+1}\|^2$:
$$\frac{d}{d\alpha} \|e - \alpha J J^T e\|^2 = -2 e^T (J J^T e) + 2\alpha (J J^T e)^T (J J^T e) = 0$$
Solving for optimal $\alpha^*$:
$$\alpha^* = \frac{e^T (J J^T) e}{(J J^T e)^T (J J^T e)} = \frac{\|J^T e\|_2^2}{\|J J^T e\|_2^2}$$

---

### 3.5 Method 3: Moore-Penrose Pseudoinverse for Redundant Arms ($n > m$)
When an arm possesses redundant degrees of freedom ($n > m$, such as a 7-DoF arm in 6D space), the system $J \Delta q = e$ has infinitely many solutions.
We seek the particular solution that achieves the goal with the **smallest possible joint displacement**:
$$\min_{\Delta q} \frac{1}{2} \|\Delta q\|_2^2 \quad \text{subject to } J \Delta q = e$$

#### Derivation via Method of Lagrange Multipliers:
Formulate the Lagrangian with vector multiplier $\lambda \in \mathbb{R}^m$:
$$\mathcal{L}(\Delta q, \lambda) = \frac{1}{2} \Delta q^T \Delta q + \lambda^T (e - J \Delta q)$$

Take partial derivatives and set to zero:
$$\frac{\partial \mathcal{L}}{\partial \Delta q} = \Delta q^T - \lambda^T J = 0 \implies \Delta q = J^T \lambda$$
Substitute $\Delta q = J^T \lambda$ into the constraint $J \Delta q = e$:
$$J (J^T \lambda) = e \implies (J J^T) \lambda = e$$
Assuming $J$ has full row rank, $(J J^T) \in \mathbb{R}^{m \times m}$ is symmetric positive-definite and invertible:
$$\lambda = (J J^T)^{-1} e$$
Substitute $\lambda$ back into $\Delta q$:
$$\Delta q = J^T (J J^T)^{-1} e$$

The operator $J^+ = J^T (J J^T)^{-1} \in \mathbb{R}^{n \times m}$ is the **Moore-Penrose Pseudoinverse** (Right Inverse):
$$J^+ = J^T (J J^T)^{-1}$$

#### The Four Penrose Conditions:
The unique matrix $J^+$ satisfies:
1. $J J^+ J = J$
2. $J^+ J J^+ = J^+$
3. $(J J^+)^T = J J^+$ (Symmetric $m \times m$ identity projector)
4. $(J^+ J)^T = J^+ J$ (Symmetric $n \times n$ orthogonal projector onto row space)

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the three numerical IK algorithms with step clamping and tolerance verification:

```typescript
export interface NumericalIKOptions {
  maxIterations?: number;
  posTolerance?: number;       // meters (e.g. 1e-4)
  rotTolerance?: number;       // radians (e.g. 1e-3)
  stepClamping?: number;       // max radians per step (e.g. 0.2)
  method?: 'newton' | 'transpose' | 'pseudoinverse';
}

export interface NumericalIKResult {
  success: boolean;
  jointAngles: number[];
  iterations: number;
  finalPosError: number;
  finalRotError: number;
}

export class NumericalIKSolver {
  /**
   * Executes iterative numerical inverse kinematics.
   */
  public static solve(
    fkFunction: (q: number[]) => { pos: { x: number; y: number; z: number }; R: number[][] },
    jacobianFunction: (q: number[]) => number[][],
    targetPos: { x: number; y: number; z: number },
    targetR: number[][],
    initialGuess: number[],
    options: NumericalIKOptions = {}
  ): NumericalIKResult {
    const maxIter = options.maxIterations ?? 50;
    const posTol = options.posTolerance ?? 1e-4;
    const rotTol = options.rotTolerance ?? 1e-3;
    const maxStep = options.stepClamping ?? 0.2; // 0.2 rad max per step
    const method = options.method ?? 'pseudoinverse';

    let q = [...initialGuess];

    for (let iter = 0; iter < maxIter; iter++) {
      const currentFK = fkFunction(q);

      // 1. Position error
      const ep = [
        targetPos.x - currentFK.pos.x,
        targetPos.y - currentFK.pos.y,
        targetPos.z - currentFK.pos.z
      ];
      const posErrNorm = Math.sqrt(ep[0] * ep[0] + ep[1] * ep[1] + ep[2] * ep[2]);

      // 2. Orientation error via matrix cross-product
      const n = [currentFK.R[0][0], currentFK.R[1][0], currentFK.R[2][0]];
      const s = [currentFK.R[0][1], currentFK.R[1][1], currentFK.R[2][1]];
      const a = [currentFK.R[0][2], currentFK.R[1][2], currentFK.R[2][2]];

      const nd = [targetR[0][0], targetR[1][0], targetR[2][0]];
      const sd = [targetR[0][1], targetR[1][1], targetR[2][1]];
      const ad = [targetR[0][2], targetR[1][2], targetR[2][2]];

      const c1 = this.cross(n, nd);
      const c2 = this.cross(s, sd);
      const c3 = this.cross(a, ad);

      const eR = [
        0.5 * (c1[0] + c2[0] + c3[0]),
        0.5 * (c1[1] + c2[1] + c3[1]),
        0.5 * (c1[2] + c2[2] + c3[2])
      ];
      const rotErrNorm = Math.sqrt(eR[0] * eR[0] + eR[1] * eR[1] + eR[2] * eR[2]);

      // Check termination tolerance
      if (posErrNorm < posTol && rotErrNorm < rotTol) {
        return {
          success: true,
          jointAngles: q,
          iterations: iter,
          finalPosError: posErrNorm,
          finalRotError: rotErrNorm
        };
      }

      const e = [...ep, ...eR];
      const J = jacobianFunction(q);

      let deltaQ: number[];
      if (method === 'transpose') {
        deltaQ = this.stepTranspose(J, e);
      } else {
        deltaQ = this.stepPseudoinverse(J, e);
      }

      // Step clamping (trust-region limit)
      let stepNorm = 0;
      for (const dq of deltaQ) stepNorm += dq * dq;
      stepNorm = Math.sqrt(stepNorm);

      if (stepNorm > maxStep) {
        const scale = maxStep / stepNorm;
        for (let i = 0; i < deltaQ.length; i++) deltaQ[i] *= scale;
      }

      // Update configuration
      for (let i = 0; i < q.length; i++) {
        q[i] += deltaQ[i];
      }
    }

    const finalFK = fkFunction(q);
    const finalPosErr = Math.hypot(targetPos.x - finalFK.pos.x, targetPos.y - finalFK.pos.y, targetPos.z - finalFK.pos.z);
    return {
      success: false,
      jointAngles: q,
      iterations: maxIter,
      finalPosError: finalPosErr,
      finalRotError: 0
    };
  }

  private static stepTranspose(J: number[][], e: number[]): number[] {
    const m = J.length;
    const n = J[0].length;

    // J^T * e
    const JTe: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let r = 0; r < m; r++) JTe[i] += J[r][i] * e[r];
    }

    // J * J^T * e
    const JJTe: number[] = new Array(m).fill(0);
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) JJTe[r] += J[r][c] * JTe[c];
    }

    // Optimal alpha = ||J^T e||^2 / ||J J^T e||^2
    let num = 0;
    for (const val of JTe) num += val * val;
    let den = 0;
    for (const val of JJTe) den += val * val;

    const alpha = den > 1e-12 ? num / den : 0.01;
    return JTe.map(val => val * alpha);
  }

  private static stepPseudoinverse(J: number[][], e: number[]): number[] {
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

    // Solve (JJT) * lambda = e via Gaussian elimination
    const lambda = this.solveLinearSystem(JJT, e);

    // deltaQ = J^T * lambda
    const deltaQ: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let r = 0; r < m; r++) deltaQ[i] += J[r][i] * lambda[r];
    }
    return deltaQ;
  }

  private static solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];

      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) continue;

      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / pivot;
        for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
      }
    }

    const x: number[] = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
      x[i] = Math.abs(M[i][i]) > 1e-12 ? sum / M[i][i] : 0;
    }
    return x;
  }

  private static cross(a: number[], b: number[]): number[] {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 8.1: Step-by-Step Newton-Raphson Iteration on a 2R Arm
**Problem Statement:** A 2R planar manipulator with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is tasked with reaching $(x_d, y_d) = (1.0, 1.0)\text{ m}$. Starting from the initial guess $q_0 = (\theta_1, \theta_2) = (0.2\text{ rad}, 1.2\text{ rad})$, execute one complete Newton-Raphson step to compute $q_1$.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $x_d = 1.0, y_d = 1.0$
- $q_0 = [0.2, 1.2]^T$
- $\theta_1 = 0.2\text{ rad} \implies \cos(0.2) = 0.980067, \sin(0.2) = 0.198669$
- $\theta_{12} = 0.2 + 1.2 = 1.4\text{ rad} \implies \cos(1.4) = 0.169967, \sin(1.4) = 0.985450$

**Step-by-Step Derivation:**
1. Compute forward kinematics at $q_0$:
   $$x(q_0) = L_1\cos\theta_1 + L_2\cos\theta_{12} = 1.0(0.980067) + 1.0(0.169967) = 1.150034\text{ m}$$
   $$y(q_0) = L_1\sin\theta_1 + L_2\sin\theta_{12} = 1.0(0.198669) + 1.0(0.985450) = 1.184119\text{ m}$$
2. Compute error vector $e = [x_d - x, y_d - y]^T$:
   $$e = \begin{bmatrix} 1.0 - 1.150034 \\ 1.0 - 1.184119 \end{bmatrix} = \begin{bmatrix} -0.150034 \\ -0.184119 \end{bmatrix}\text{ m}$$
   $$\|e\|_2 = \sqrt{(-0.150034)^2 + (-0.184119)^2} \approx 0.237517\text{ m}$$
3. Evaluate Jacobian matrix at $q_0$:
   $$J_{11} = -1.0\sin(0.2) - 1.0\sin(1.4) = -0.198669 - 0.985450 = -1.184119$$
   $$J_{12} = -1.0\sin(1.4) = -0.985450$$
   $$J_{21} = 1.0\cos(0.2) + 1.0\cos(1.4) = 0.980067 + 0.169967 = 1.150034$$
   $$J_{22} = 1.0\cos(1.4) = 0.169967$$
   $$J = \begin{bmatrix} -1.184119 & -0.985450 \\ 1.150034 & 0.169967 \end{bmatrix}$$
4. Compute $\det(J) = L_1 L_2 \sin\theta_2 = 1.0(1.0)\sin(1.2) = 0.932039$.
5. Invert $2 \times 2$ Jacobian:
   $$J^{-1} = \frac{1}{0.932039} \begin{bmatrix} 0.169967 & 0.985450 \\ -1.150034 & -1.184119 \end{bmatrix} = \begin{bmatrix} 0.182360 & 1.057306 \\ -1.233890 & -1.270461 \end{bmatrix}$$
6. Compute joint step $\Delta q = J^{-1} e$:
   $$\Delta\theta_1 = 0.182360(-0.150034) + 1.057306(-0.184119) = -0.027360 - 0.194670 = -0.222030\text{ rad}$$
   $$\Delta\theta_2 = -1.233890(-0.150034) - 1.270461(-0.184119) = 0.185125 + 0.233916 = +0.419041\text{ rad}$$
7. Update joint angles:
   $$\theta_1^{(1)} = 0.200000 - 0.222030 = -0.022030\text{ rad}$$
   $$\theta_2^{(1)} = 1.200000 + 0.419041 = +1.619041\text{ rad}$$

**Final Answer:**
After 1 iteration: **$q_1 = [-0.02203\text{ rad}, +1.61904\text{ rad}]^T$** ($[-1.26^\circ, 92.76^\circ]$).

**Verification & Sanity Check:**
Compute forward kinematics at $q_1$:
$\theta_{12} = -0.02203 + 1.61904 = 1.59701\text{ rad}$.
$x(q_1) = \cos(-0.02203) + \cos(1.59701) = 0.999757 - 0.026211 = 0.973546\text{ m}$.
$y(q_1) = \sin(-0.02203) + \sin(1.59701) = -0.022028 + 0.999656 = 0.977628\text{ m}$.
New error $\|e_1\| = \sqrt{(1 - 0.9735)^2 + (1 - 0.9776)^2} \approx 0.0346\text{ m}$.
Error dropped from $0.2375\text{ m}$ to $0.0346\text{ m}$ (an **$85.4\%$ reduction** in a single step).

---

### Problem 8.2: Quadratic Convergence Demonstration
**Problem Statement:** Continue the Newton-Raphson iteration from Problem 8.1 for iterations 2, 3, and 4. Document the exact error norm $\|e_k\|$ to demonstrate quadratic convergence.

**Step-by-Step Derivation:**
- **Iteration 0:**
  $q_0 = [0.200000, 1.200000]^T \implies \|e_0\| = 2.375 \times 10^{-1}\text{ m}$
- **Iteration 1:**
  $q_1 = [-0.022030, 1.619041]^T \implies \|e_1\| = 3.461 \times 10^{-2}\text{ m}$
- **Iteration 2:**
  Evaluate $J(q_1)$ and $e_1$:
  $e_1 = [0.026454, 0.022372]^T$
  $\Delta q_1 = [+0.022137, -0.048384]^T$
  $q_2 = q_1 + \Delta q_1 = [0.000107, 1.570657]^T$
  Forward kinematics: $x = 0.999999, y = 1.000108$
  $\|e_2\| = 1.08 \times 10^{-4}\text{ m}$
- **Iteration 3:**
  $q_3 = [0.000000, 1.570796]^T$
  $\|e_3\| = 1.42 \times 10^{-9}\text{ m}$ (machine precision of zero)

**Final Answer:**
- $\|e_0\| \approx 2.38 \times 10^{-1}\text{ m}$
- $\|e_1\| \approx 3.46 \times 10^{-2}\text{ m}$
- $\|e_2\| \approx 1.08 \times 10^{-4}\text{ m}$
- $\|e_3\| \approx 1.42 \times 10^{-9}\text{ m}$

**Verification & Sanity Check:**
Notice the exponents: $10^{-1} \to 10^{-2} \to 10^{-4} \to 10^{-9}$. The exponent roughly doubles at every step, the classic textbook hallmark of **quadratic convergence**!

---

### Problem 8.3: Jacobian Transpose Step with Optimal $\alpha^*$
**Problem Statement:** For the arm in Problem 8.1 at $q_0 = [0.2, 1.2]^T$ with error $e = [-0.150034, -0.184119]^T$, compute:
1. The gradient vector $g = J^T e$.
2. The optimal step size $\alpha^*$.
3. The resulting joint increment $\Delta q$.

**Given Data:**
- $J = \begin{bmatrix} -1.184119 & -0.985450 \\ 1.150034 & 0.169967 \end{bmatrix}$
- $e = [-0.150034, -0.184119]^T$

**Step-by-Step Derivation:**
1. Compute gradient $g = J^T e$:
   $$g_1 = J_{11} e_x + J_{21} e_y = -1.184119(-0.150034) + 1.150034(-0.184119) = 0.177658 - 0.211743 = -0.034085$$
   $$g_2 = J_{12} e_x + J_{22} e_y = -0.985450(-0.150034) + 0.169967(-0.184119) = 0.147851 - 0.031294 = +0.116557$$
   $$g = J^T e = [-0.034085, +0.116557]^T$$
2. Compute $\|J^T e\|^2$:
   $$\|J^T e\|^2 = (-0.034085)^2 + (0.116557)^2 = 0.001162 + 0.013586 = 0.014748$$
3. Compute $J (J^T e)$:
   $$J g = \begin{bmatrix} -1.184119 & -0.985450 \\ 1.150034 & 0.169967 \end{bmatrix} \begin{bmatrix} -0.034085 \\ 0.116557 \end{bmatrix} = \begin{bmatrix} 0.040361 - 0.114861 \\ -0.039199 + 0.019811 \end{bmatrix} = \begin{bmatrix} -0.074500 \\ -0.019388 \end{bmatrix}$$
4. Compute $\|J J^T e\|^2$:
   $$\|J J^T e\|^2 = (-0.074500)^2 + (-0.019388)^2 = 0.005550 + 0.000376 = 0.005926$$
5. Compute optimal $\alpha^*$:
   $$\alpha^* = \frac{\|J^T e\|^2}{\|J J^T e\|^2} = \frac{0.014748}{0.005926} \approx 2.488694$$
6. Compute joint step $\Delta q = \alpha^* J^T e$:
   $$\Delta\theta_1 = 2.488694(-0.034085) = -0.084827\text{ rad}$$
   $$\Delta\theta_2 = 2.488694(+0.116557) = +0.290075\text{ rad}$$

**Final Answer:**
- Gradient: **$J^T e = [-0.0341, +0.1166]^T$**
- Optimal Step Size: **$\alpha^* \approx 2.489$**
- Joint Step: **$\Delta q = [-0.0848\text{ rad}, +0.2901\text{ rad}]^T$**

**Verification & Sanity Check:**
Notice that $\Delta q$ points in the exact same direction as the Newton-Raphson step (decreasing $\theta_1$, increasing $\theta_2$), but is computed without calculating any matrix inverse!

---

### Problem 8.4: Lyapunov Monotonic Energy Decay Verification
**Problem Statement:** For the step computed in Problem 8.3, evaluate the initial Lyapunov energy $V_0 = \frac{1}{2}\|e_0\|^2$ and the new Lyapunov energy $V_1 = \frac{1}{2}\|e_1\|^2$. Confirm that $V_1 < V_0$.

**Given Data:**
- $q_0 = [0.2, 1.2]^T \implies \|e_0\| = 0.237517\text{ m}$
- $\Delta q = [-0.084827, +0.290075]^T$
- $q_1 = q_0 + \Delta q = [0.115173, 1.490075]^T$

**Step-by-Step Derivation:**
1. Compute initial energy $V_0$:
   $$V_0 = \frac{1}{2} (0.237517)^2 = 0.028207\text{ m}^2$$
2. Compute forward kinematics at $q_1$:
   $$\theta_1 = 0.115173\text{ rad} \implies \cos\theta_1 = 0.993386, \sin\theta_1 = 0.114819$$
   $$\theta_{12} = 0.115173 + 1.490075 = 1.605248\text{ rad} \implies \cos\theta_{12} = -0.034443, \sin\theta_{12} = 0.999407$$
   $$x_1 = 0.993386 - 0.034443 = 0.958943\text{ m}$$
   $$y_1 = 0.114819 + 0.999407 = 1.114226\text{ m}$$
3. Compute new error $e_1$:
   $$e_{x, 1} = 1.0 - 0.958943 = 0.041057\text{ m}$$
   $$e_{y, 1} = 1.0 - 1.114226 = -0.114226\text{ m}$$
   $$\|e_1\|^2 = (0.041057)^2 + (-0.114226)^2 = 0.001686 + 0.013048 = 0.014734\text{ m}^2$$
4. Compute new energy $V_1$:
   $$V_1 = \frac{1}{2} (0.014734) = 0.007367\text{ m}^2$$
5. Compare:
   $$V_1 = 0.007367 < 0.028207 = V_0$$
   $$\Delta V = 0.007367 - 0.028207 = -0.020840\text{ m}^2 \quad (\text{Strictly negative!})$$

**Final Answer:**
$V_0 = 0.02821\text{ m}^2 \to V_1 = 0.00737\text{ m}^2$. The energy decreased by **$73.9\%$**, strictly validating Lyapunov monotonic decay.

---

### Problem 8.5: Moore-Penrose Pseudoinverse for a Redundant 3R Arm
**Problem Statement:** A 3R planar manipulator with $L_1 = 1.0, L_2 = 1.0, L_3 = 1.0$ is at configuration $q = [0^\circ, 90^\circ, 0^\circ] = [0, \pi/2, 0]$. The required Cartesian displacement is $\Delta x = [0.10, 0.05]^T\text{ m}$. Compute the minimum-norm joint step $\Delta q = J^+ \Delta x$.

**Given Data:**
- $L_1 = 1, L_2 = 1, L_3 = 1$
- $\theta_1 = 0, \theta_2 = \pi/2, \theta_3 = 0 \implies \theta_{12} = \pi/2, \theta_{123} = \pi/2$
- $s_1 = 0, c_1 = 1, s_{12} = 1, c_{12} = 0, s_{123} = 1, c_{123} = 0$
- Target displacement: $\Delta x = [0.10, 0.05]^T$

**Step-by-Step Derivation:**
1. Evaluate positional Jacobian $J_v \in \mathbb{R}^{2 \times 3}$:
   From Chapter 6:
   $$J_{11} = -L_1 s_1 - L_2 s_{12} - L_3 s_{123} = 0 - 1(1) - 1(1) = -2.0$$
   $$J_{12} = -L_2 s_{12} - L_3 s_{123} = -1(1) - 1(1) = -2.0$$
   $$J_{13} = -L_3 s_{123} = -1.0$$
   $$J_{21} = L_1 c_1 + L_2 c_{12} + L_3 c_{123} = 1(1) + 0 + 0 = 1.0$$
   $$J_{22} = L_2 c_{12} + L_3 c_{123} = 0 + 0 = 0.0$$
   $$J_{23} = L_3 c_{123} = 0.0$$
   $$J = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$$
2. Compute $J J^T \in \mathbb{R}^{2 \times 2}$:
   $$J J^T = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix} \begin{bmatrix} -2.0 & 1.0 \\ -2.0 & 0.0 \\ -1.0 & 0.0 \end{bmatrix} = \begin{bmatrix} (-2)^2 + (-2)^2 + (-1)^2 & -2(1) + 0 + 0 \\ 1(-2) + 0 + 0 & 1^2 + 0 + 0 \end{bmatrix} = \begin{bmatrix} 9.0 & -2.0 \\ -2.0 & 1.0 \end{bmatrix}$$
3. Invert $J J^T$:
   $$\det(J J^T) = (9.0)(1.0) - (-2.0)^2 = 9.0 - 4.0 = 5.0$$
   $$(J J^T)^{-1} = \frac{1}{5.0} \begin{bmatrix} 1.0 & 2.0 \\ 2.0 & 9.0 \end{bmatrix} = \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix}$$
4. Compute $\lambda = (J J^T)^{-1} \Delta x$:
   $$\lambda = \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.05 \end{bmatrix} = \begin{bmatrix} 0.2(0.10) + 0.4(0.05) \\ 0.4(0.10) + 1.8(0.05) \end{bmatrix} = \begin{bmatrix} 0.02 + 0.02 \\ 0.04 + 0.09 \end{bmatrix} = \begin{bmatrix} 0.04 \\ 0.13 \end{bmatrix}$$
5. Compute $\Delta q = J^T \lambda$:
   $$\Delta q = \begin{bmatrix} -2.0 & 1.0 \\ -2.0 & 0.0 \\ -1.0 & 0.0 \end{bmatrix} \begin{bmatrix} 0.04 \\ 0.13 \end{bmatrix} = \begin{bmatrix} -2.0(0.04) + 1.0(0.13) \\ -2.0(0.04) + 0.0(0.13) \\ -1.0(0.04) + 0.0(0.13) \end{bmatrix} = \begin{bmatrix} -0.08 + 0.13 \\ -0.08 \\ -0.04 \end{bmatrix} = \begin{bmatrix} +0.05 \\ -0.08 \\ -0.04 \end{bmatrix}\text{ rad}$$

**Final Answer:**
$$\Delta q = [+0.05\text{ rad}, -0.08\text{ rad}, -0.04\text{ rad}]^T$$
with Euclidean norm $\|\Delta q\| = \sqrt{0.05^2 + (-0.08)^2 + (-0.04)^2} = \sqrt{0.0025 + 0.0064 + 0.0016} = \sqrt{0.0105} \approx 0.10247\text{ rad}$.

**Verification & Sanity Check:**
Check $J \Delta q$:
$-2.0(0.05) - 2.0(-0.08) - 1.0(-0.04) = -0.10 + 0.16 + 0.04 = +0.10 = \Delta x$.
$1.0(0.05) + 0 + 0 = +0.05 = \Delta y$.
Exact match.

---

### Problem 8.6: Minimum Norm Proof Verification
**Problem Statement:** For Problem 8.5, construct an alternative solution $\Delta q'$ that also satisfies $J \Delta q' = \Delta x$ by perturbing $\Delta q$ along the nullspace. Prove that $\|\Delta q'\|_2 > \|\Delta q_{\text{pinv}}\|_2$.

**Given Data:**
- $\Delta q_{\text{pinv}} = [0.05, -0.08, -0.04]^T$ with $\|\Delta q_{\text{pinv}}\|^2 = 0.0105$.
- Nullspace vector $v_{\text{null}}$ satisfies $J v_{\text{null}} = 0$.

**Step-by-Step Derivation:**
1. Find a nullspace vector $v_{\text{null}} = [v_1, v_2, v_3]^T$:
   $$J v_{\text{null}} = \begin{bmatrix} -2 & -2 & -1 \\ 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   Row 2: $v_1 = 0$.
   Row 1: $-2(0) - 2v_2 - v_3 = 0 \implies v_3 = -2v_2$.
   Choose $v_2 = 1.0 \implies v_3 = -2.0$.
   $$v_{\text{null}} = [0, 1.0, -2.0]^T$$
2. Construct perturbed solution $\Delta q' = \Delta q_{\text{pinv}} + c v_{\text{null}}$ with $c = 0.05$:
   $$\Delta q' = \begin{bmatrix} 0.05 \\ -0.08 \\ -0.04 \end{bmatrix} + 0.05 \begin{bmatrix} 0 \\ 1.0 \\ -2.0 \end{bmatrix} = \begin{bmatrix} 0.05 \\ -0.03 \\ -0.14 \end{bmatrix}$$
3. Verify that $\Delta q'$ satisfies $J \Delta q' = \Delta x$:
   $$-2(0.05) - 2(-0.03) - 1(-0.14) = -0.10 + 0.06 + 0.14 = 0.10 = \Delta x$$
   $$1(0.05) + 0 + 0 = 0.05 = \Delta y$$
4. Compute the norm of $\Delta q'$:
   $$\|\Delta q'\|^2 = 0.05^2 + (-0.03)^2 + (-0.14)^2 = 0.0025 + 0.0009 + 0.0196 = 0.0230$$
   $$\|\Delta q'\| = \sqrt{0.0230} \approx 0.15166\text{ rad}$$
5. Compare:
   $$\|\Delta q'\| = 0.1517\text{ rad} > 0.1025\text{ rad} = \|\Delta q_{\text{pinv}}\|$$

**Final Answer:**
$\|\Delta q'\|_2 > \|\Delta q_{\text{pinv}}\|_2$. The Moore-Penrose pseudoinverse solution strictly minimizes the joint motion norm.

---

### Problem 8.7: Orientation Error Comparison (Logarithm vs. Skew Cross-Product)
**Problem Statement:** Let current attitude be $R = I_3$ and desired attitude be $R_d = \operatorname{Rot}_z(\theta)$ with $\theta = 30^\circ = \frac{\pi}{6}\text{ rad}$.
1. Compute the exact axis-angle error $e_R^{\log} = \operatorname{vee}(\log(R_d R^T))$.
2. Compute the skew cross-product approximation $e_R^{\text{cross}} = \frac{1}{2}(n \times n_d + s \times s_d + a \times a_d)$.
3. Compare the two error vectors.

**Given Data:**
- $R = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$
- $R_d = \begin{bmatrix} \cos 30^\circ & -\sin 30^\circ & 0 \\ \sin 30^\circ & \cos 30^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0.866025 & -0.500000 & 0 \\ 0.500000 & 0.866025 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Method 1 (Matrix Logarithm):
   Relative rotation $R_{\text{err}} = R_d I = R_d$.
   Rotation angle is exactly $\theta = 30^\circ \approx 0.523599\text{ rad}$ about axis $\hat{z} = [0, 0, 1]^T$.
   $$e_R^{\log} = [0, 0, 0.523599]^T\text{ rad}$$
2. Method 2 (Cross Product):
   - $n = [1, 0, 0]^T, n_d = [0.866025, 0.500000, 0]^T$:
     $$n \times n_d = [0, 0, 0.500000]^T$$
   - $s = [0, 1, 0]^T, s_d = [-0.500000, 0.866025, 0]^T$:
     $$s \times s_d = [0, 0, 0.500000]^T$$
   - $a = [0, 0, 1]^T, a_d = [0, 0, 1]^T$:
     $$a \times a_d = [0, 0, 0]^T$$
   Sum:
   $$e_R^{\text{cross}} = \frac{1}{2} ([0, 0, 0.5]^T + [0, 0, 0.5]^T + 0) = [0, 0, 0.500000]^T$$

**Final Answer:**
- Logarithm Error: **$e_R^{\log} = [0, 0, 0.5236]^T\text{ rad}$** (exact radian angle $\theta$)
- Cross-Product Error: **$e_R^{\text{cross}} = [0, 0, 0.5000]^T$** (equal to $\sin\theta = \sin(30^\circ) = 0.5$)

**Verification & Sanity Check:**
Because $\sin(0.5236) = 0.5000$, the cross-product approximation produces $\sin\theta$. For small angles ($\theta < 15^\circ$), $\sin\theta \approx \theta$, making the cross-product formula exceptionally fast and accurate.

---

### Problem 8.8: Step Size Backtracking to Prevent Overshooting
**Problem Statement:** In a numerical IK step, a raw Newton-Raphson calculation produces $\Delta q$ with norm $\|\Delta q\| = 1.5\text{ rad}$ ($86^\circ$), causing the arm to jump across multiple quadrants and diverge. Describe the backtracking line search algorithm used to guarantee convergence.

**Solution:**
1. Armijo Backtracking Line Search:
   Given step $\Delta q$, evaluate the candidate next configuration:
   $$q_{\text{trial}}(\beta) = q_k + \beta \Delta q, \quad \beta \in (0, 1]$$
2. Set initial step factor $\beta = 1.0$.
3. Compute the prospective error norm $\|e(q_{\text{trial}}(\beta))\|$.
4. Check the Armijo sufficient decrease condition:
   $$\|e(q_{\text{trial}})\|^2 \le (1 - c_1 \beta) \|e(q_k)\|^2$$
5. If the condition fails (error increased or didn't drop sufficiently), contract the step size:
   $$\beta \leftarrow \gamma \beta \quad (\text{e.g. } \gamma = 0.5)$$
6. Repeat until the condition is met or $\beta < 10^{-4}$.
7. This guarantees that every step strictly decreases the error, converting a local Newton method into a **globally convergent** algorithm.

---

### Problem 8.9: Left vs. Right Generalized Pseudoinverse
**Problem Statement:** Compare the mathematical definitions and application domains of the Left Pseudoinverse $J_L^+$ and Right Pseudoinverse $J_R^+$.

**Solution:**
1. **Right Pseudoinverse ($n > m$, Over-Actuated / Redundant):**
   - $J \in \mathbb{R}^{m \times n}$ has more columns than rows (full row rank $m$).
   - Matrix $J J^T \in \mathbb{R}^{m \times m}$ is invertible.
   - $$J_R^+ = J^T (J J^T)^{-1}$$
   - Property: $J J_R^+ = I_m$ (exact right identity).
   - Application: Redundant inverse kinematics (7-DoF arms in 3D/6D space).
2. **Left Pseudoinverse ($m > n$, Over-Constrained):**
   - $J \in \mathbb{R}^{m \times n}$ has more rows than columns (full column rank $n$).
   - Matrix $J^T J \in \mathbb{R}^{n \times n}$ is invertible.
   - $$J_L^+ = (J^T J)^{-1} J^T$$
   - Property: $J_L^+ J = I_n$ (exact left identity).
   - Application: Over-constrained parameter estimation and sensor fusion (finding joint rates that best fit over-determined sensor measurements).

---

### Problem 8.10: Local Minima Trap in Jacobian Transpose
**Problem Statement:** In the Jacobian Transpose method, the update is $\Delta q = \alpha J^T e$. Show that an algorithm can become trapped at a non-zero error ($e \neq 0$) if the error vector lies in the left nullspace of the Jacobian.

**Solution:**
1. The update is $\Delta q = \alpha J^T e$.
2. Suppose the error vector $e \in \mathbb{R}^m$ satisfies $e \in \mathcal{N}(J^T)$ (the left nullspace of $J$).
3. By definition of the nullspace:
   $$J^T e = 0$$
4. Therefore:
   $$\Delta q = \alpha (0) = 0$$
5. The algorithm stops updating ($\Delta q = 0$), concluding that a stationary point has been reached, even though the Cartesian error is non-zero ($e \neq 0$).
6. This occurs at kinematic singularities where the target requires motion along a lost degree of freedom.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 8.11: Newton-Raphson Step on a SCARA Manipulator
**Problem Statement:** A SCARA robot has $a_1 = 0.5\text{ m}, a_2 = 0.4\text{ m}$. At $q = [0^\circ, 90^\circ]^T$, the end-effector position error is $e = [0.02, -0.01]^T\text{ m}$. Compute the Newton-Raphson joint increment $\Delta q$.

**Solution:**
1. Forward kinematics Jacobian for $(x, y)$:
   $$J = \begin{bmatrix} -0.4 & -0.4 \\ 0.9 & 0.4 \end{bmatrix}$$
2. Determinant: $\det(J) = -0.4(0.4) - (-0.4)(0.9) = -0.16 + 0.36 = 0.20$.
3. Inverse:
   $$J^{-1} = \frac{1}{0.20} \begin{bmatrix} 0.4 & 0.4 \\ -0.9 & -0.4 \end{bmatrix} = \begin{bmatrix} 2.0 & 2.0 \\ -4.5 & -2.0 \end{bmatrix}$$
4. Compute $\Delta q = J^{-1} e$:
   $$\Delta q_1 = 2.0(0.02) + 2.0(-0.01) = 0.04 - 0.02 = +0.02\text{ rad}$$
   $$\Delta q_2 = -4.5(0.02) - 2.0(-0.01) = -0.09 + 0.02 = -0.07\text{ rad}$$

---

### Problem 8.12: Initial Guess Basin of Attraction
**Problem Statement:** Explain how the choice of initial guess $q_0$ in Newton-Raphson determines which branch (elbow-up vs. elbow-down) the iterative solver converges to.

**Solution:**
1. The configuration space $\mathcal{Q}$ is divided into **basins of attraction** separated by the singularity manifold ($\det(J) = 0$).
2. If $q_0$ has $\theta_2 > 0$ (elbow-down basin), the Newton-Raphson iteration moves along the local gradient without crossing the singular barrier $\theta_2 = 0$, converging to the elbow-down solution.
3. If $q_0$ has $\theta_2 < 0$, it converges to the elbow-up solution.
4. Supplying the robot's current physical joint position as $q_0$ guarantees that the solver selects the branch closest to the arm's current state, preventing sudden violent configuration flips.

---

### Problem 8.13: Weighted Pseudoinverse with Joint Inertia
**Problem Statement:** For a redundant arm, formulate the weighted pseudoinverse $J_W^+$ that minimizes kinetic energy metric $\frac{1}{2}\Delta q^T W \Delta q$, where $W$ is the positive-definite joint inertia matrix.

**Solution:**
1. Optimization problem: $\min \frac{1}{2} \Delta q^T W \Delta q$ subject to $J \Delta q = e$.
2. Formulate Lagrangian: $\mathcal{L} = \frac{1}{2}\Delta q^T W \Delta q + \lambda^T (e - J \Delta q)$.
3. Differentiate: $W \Delta q - J^T \lambda = 0 \implies \Delta q = W^{-1} J^T \lambda$.
4. Substitute into constraint: $J W^{-1} J^T \lambda = e \implies \lambda = (J W^{-1} J^T)^{-1} e$.
5. The **Weighted Moore-Penrose Pseudoinverse** is:
   $$J_W^+ = W^{-1} J^T (J W^{-1} J^T)^{-1}$$

---

### Problem 8.14: Quaternion Error Vector Formulation
**Problem Statement:** Let unit quaternion $\mathbf{q}$ represent current attitude and $\mathbf{q}_d$ represent desired attitude. Formulate the orientation error vector $e_R$ used in numerical IK.

**Solution:**
1. Compute the relative error quaternion:
   $$\mathbf{q}_{\text{err}} = \mathbf{q}_d \otimes \mathbf{q}^{-1} = (w_{\text{err}}, \vec{v}_{\text{err}})$$
2. For small rotations, $w_{\text{err}} \approx 1$ and $\vec{v}_{\text{err}} \approx \frac{\theta}{2} \hat{\omega}$.
3. Therefore, the 3D orientation error vector is:
   $$e_R = 2 \operatorname{sgn}(w_{\text{err}}) \vec{v}_{\text{err}}$$
   The sign factor $\operatorname{sgn}(w_{\text{err}})$ guarantees taking the shortest path on the 3-sphere $S^3$.

---

### Problem 8.15: Joint Velocity Saturation Clamping
**Problem Statement:** An IK step yields $\Delta q = [0.4, -0.6, 0.8]^T\text{ rad}$. The maximum allowable step per control cycle is $\Delta q_{\max} = 0.2\text{ rad}$. Clamp the step while preserving the direction of motion.

**Solution:**
1. Compute the maximum component magnitude:
   $$\|\Delta q\|_\infty = \max(|0.4|, |-0.6|, |0.8|) = 0.8\text{ rad}$$
2. Scale factor:
   $$s = \frac{\Delta q_{\max}}{\|\Delta q\|_\infty} = \frac{0.2}{0.8} = 0.25$$
3. Clamped step:
   $$\Delta q_{\text{clamped}} = 0.25 \begin{bmatrix} 0.4 \\ -0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0.10 \\ -0.15 \\ 0.20 \end{bmatrix}\text{ rad}$$
4. All components now satisfy $|\Delta q_i| \le 0.2\text{ rad}$ while maintaining the exact same trajectory vector in joint space.

---

### Problem 8.16: Stopping Criteria and Numerical Tolerances
**Problem Statement:** In a 6-DoF numerical IK solver, explain why position error and orientation error must have separate tolerance thresholds ($\epsilon_p$ vs. $\epsilon_R$).

**Solution:**
1. Position error $e_p$ is measured in linear units (meters), where typical manufacturing tolerances are $\epsilon_p = 10^{-4}\text{ m} = 0.1\text{ mm}$.
2. Orientation error $e_R$ is measured in angular units (radians), where typical tolerances are $\epsilon_R = 10^{-3}\text{ rad} \approx 0.057^\circ$.
3. Combining them into a single norm $\|e\| = \sqrt{\|e_p\|^2 + \|e_R\|^2}$ is dimensionally inhomogeneous ($m^2 + \text{rad}^2$), causing the solver to prematurely terminate if one quantity is numerically smaller than the other. Separate stopping checks are mandatory.

---

### Problem 8.17: Comparison of Newton-Raphson vs. Levenberg-Marquardt
**Problem Statement:** Contrast the convergence behavior of pure Newton-Raphson $\Delta q = J^{-1} e$ with Levenberg-Marquardt $\Delta q = (J^T J + \lambda^2 I)^{-1} J^T e$ near singular configurations.

**Solution:**
1. **Newton-Raphson:** As $\det(J) \to 0$, $J^{-1} \to \infty$. Joint steps explode, causing wild divergence and chaotic numerical oscillations.
2. **Levenberg-Marquardt:** The regularization term $\lambda^2 I$ guarantees that $(J^T J + \lambda^2 I)$ remains strictly positive-definite and well-conditioned for all configurations. Joint velocities remain bounded, smoothly transitioning from Newton-Raphson far from singularities to gradient descent near singularities.

---

### Problem 8.18: 7-DoF Redundant Arm Pseudoinverse Step
**Problem Statement:** A 7-DoF arm has Jacobian $J \in \mathbb{R}^{6 \times 7}$. The target requires end-effector twist $\nu \in \mathbb{R}^6$. State the dimensions of the matrices inverted in $J^+ = J^T (J J^T)^{-1}$.

**Solution:**
1. $J$ has size $6 \times 7$.
2. $J^T$ has size $7 \times 6$.
3. The product $J J^T$ has size $6 \times 6$.
4. Inverting $J J^T$ requires inverting a **$6 \times 6$ matrix** (the dimension of task space), regardless of whether the arm has 7, 10, or 100 degrees of freedom!

---

### Problem 8.19: Divergence of Newton-Raphson Near a Singularity
**Problem Statement:** For a 2R arm at $\theta_2 = 0.001\text{ rad}$ ($L_1 = L_2 = 1.0$), evaluate the magnitude of $J^{-1}$ and explain why iteration fails.

**Solution:**
1. $\det(J) = L_1 L_2 \sin\theta_2 = 1.0(1.0)\sin(0.001) \approx 0.000999999$.
2. The entries of $J^{-1}$ contain the factor $\frac{1}{\det(J)} \approx 1000.0$.
3. An error of just $e = 1\text{ mm} = 0.001\text{ m}$ produces a joint step:
   $$\|\Delta q\| \approx 1000 \times 0.001 = 1.0\text{ rad} \approx 57^\circ$$
4. A $1\text{ mm}$ error commands an enormous $57^\circ$ joint jump, completely violating the local linearity assumption and causing immediate divergence.

---

### Problem 8.20: Verification of the Four Penrose Invariant Conditions
**Problem Statement:** Write the mathematical verification test that proves a computed matrix $A$ is the true Moore-Penrose pseudoinverse $J^+$ of matrix $J$.

**Solution:**
For any valid pseudoinverse $A = J^+$:
1. Condition 1: $\|J A J - J\|_\infty < 10^{-12}$
2. Condition 2: $\|A J A - A\|_\infty < 10^{-12}$
3. Condition 3: $\|(J A)^T - J A\|_\infty < 10^{-12}$
4. Condition 4: $\|(A J)^T - A J\|_\infty < 10^{-12}$
If all four matrix residual norms are zero to machine precision, $A$ is verified to be the unique Moore-Penrose pseudoinverse.
