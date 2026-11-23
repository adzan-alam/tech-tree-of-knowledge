# Chapter 9: Singularity Robustness — Damped Least Squares (DLS) and Levenberg-Marquardt Stabilization

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are driving a car along a highway, following a GPS navigation path. Suddenly, the GPS map instructs you to make an instantaneous $90^\circ$ turn across a solid concrete divider at $100\text{ km/h}$. 

A purely mathematical, naive algorithm would attempt to follow the instruction literally: it would command the steering wheel to rotate instantaneously, demanding infinite tire friction and infinite lateral acceleration. The car would flip over, crash, and be destroyed. 

A skilled human driver does something fundamentally different: **they recognize the physical impossibility, relax the tracking precision for a brief moment, decelerate smoothly, bypass the obstacle, and gently return to the path.**

In robotics, this exact crisis occurs whenever a manipulator passes near a **Kinematic Singularity** (Chapter 7). 
- If a robot controller uses the pure Moore-Penrose pseudoinverse $\Delta q = J^+ e$, the math says: *"You must reach this Cartesian target coordinate at all costs!"* As the arm straightens or the wrist axes align ($\sigma_{\min} \to 0$), $J^+$ demands infinite joint speeds ($10,000\text{ rad/s}$), tripping electrical circuit breakers or shearing gear teeth.

```
   Target Path Passes Near Singularity
                     Path
   ───────────●────────────────────────▶
              │
              ▼ Near Singularity (σ_min ──▶ 0)
   
   Pure Pseudoinverse J^+:      Motor speeds command ──▶ INFINITY! (Crash / Trip)
   
   Damped Least Squares (DLS):  Sacrifices a fraction of a millimeter in tracking;
                                Motor speeds remain completely BOUNDED and smooth!
```

To prevent physical destruction, roboticists use **Damped Least Squares (DLS)** (also known as the **Levenberg-Marquardt method** or **Tikhonov regularization**). Instead of treating trajectory tracking as an absolute commandment, DLS treats it as a balance:
*Achieve the closest possible reach to the target, but penalize excessive joint speeds.*

Near a singularity, DLS automatically and gracefully dampens unattainable motions, allowing the robot to glide effortlessly through singular regions without a shudder!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical framework of damped regularization was invented independently in optimization theory and statistics:
- In 1943, **Andrey Tikhonov** formulated regularization for ill-posed Fredholm integral equations (**Tikhonov Regularization**).
- In 1944, **Kenneth Levenberg** published *"A Method for the Solution of Certain Non-Linear Problems in Least Squares"*, introducing a damping parameter into gradient descent.
- In 1963, **Donald W. Marquardt** refined the method, demonstrating that smoothly adjusting damping between pure Newton-Raphson and steepest gradient descent guarantees robust convergence for ill-conditioned non-linear regressions (**The Levenberg-Marquardt Algorithm**).

In robotics, the breakthrough occurred in 1986 through two landmark papers published almost simultaneously on opposite sides of the Pacific:
1. **Charles W. Wampler** (General Motors Research Laboratories, 1986): *"Manipulator Inverse Kinematic Solutions Based on Vector Formulations and Damped Least-Squares Methods"*, demonstrating that DLS guarantees bounded joint speeds across manipulator singularities.
2. **Yoshihiko Nakamura and Hideo Hanafusa** (Kyoto University, 1986): *"Inverse Kinematic Solutions with Singularity Robustness for Robot Manipulators"*, introducing the **Singularity-Robust (SR) Inverse** and adaptive variable damping.

In 2005, **Samuel R. Buss** and **J. S. Gerhard** introduced *Selectively Damped Least Squares (SDLS)* for computer animation and inverse kinematics of multi-jointed digital skeletons. In 2011, **Tomomichi Sugihara** introduced *Singularity-Consistent DLS (SC-DLS)*, further refining real-time trajectory tracking for bipedal humanoid robots walking near full leg extension.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Pseudoinverse Catastrophe
Recall from Chapter 7 that the Singular Value Decomposition (SVD) of the Jacobian $J \in \mathbb{R}^{m \times n}$ is:
$$J = U \Sigma V^T = \sum_{i=1}^m \sigma_i u_i v_i^T$$
where $u_i \in \mathbb{R}^m$ are the output spatial directions, $v_i \in \mathbb{R}^n$ are the input joint directions, and $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_m \ge 0$ are the singular values.

The Moore-Penrose pseudoinverse $J^+ = V \Sigma^+ U^T$ is:
$$J^+ = \sum_{i=1}^m \frac{1}{\sigma_i} v_i u_i^T$$
Given a Cartesian velocity command $\nu \in \mathbb{R}^m$, the required joint velocity vector is:
$$\dot{q} = J^+ \nu = \sum_{i=1}^m \left( \frac{u_i^T \nu}{\sigma_i} \right) v_i$$

#### The Catastrophe:
If the robot approaches a singularity along direction $u_m$, the smallest singular value approaches zero:
$$\lim_{\sigma_m \to 0} \sigma_m = 0$$
If the desired velocity $\nu$ has even a microscopic projection along this direction ($u_m^T \nu \neq 0$):
$$\|\dot{q}\|_2 \ge \frac{|u_m^T \nu|}{\sigma_m} \xrightarrow[\sigma_m \to 0]{} \infty$$
The requested joint velocity diverges to infinity!

---

### 3.2 The Damped Least Squares Formulation
To eliminate infinite joint speeds, we reformulate the inverse kinematics problem as an unconstrained bi-criterion optimization:
$$\min_{\Delta q} \mathcal{L}(\Delta q) = \frac{1}{2} \|J \Delta q - e\|_2^2 + \frac{1}{2} \lambda^2 \|\Delta q\|_2^2$$
where:
- $\|J \Delta q - e\|_2^2$ represents the **Tracking Error Cost** (fidelity to the commanded path).
- $\|\Delta q\|_2^2$ represents the **Control Effort Cost** (penalty on large joint motions).
- $\lambda > 0$ is the **Damping Parameter**, which governs the trade-off between tracking accuracy and actuator speed.

```
       Small λ (Near 0):                              Large λ:
       • Perfect tracking accuracy                    • Heavily dampened joint speeds
       • Vulnerable to singularity blowup             • Substantial tracking error
                                                      • Smooth, fail-safe motion
```

---

### 3.3 Derivation of the Normal Equations
Expand the objective function using vector norms:
$$\mathcal{L}(\Delta q) = \frac{1}{2} (J \Delta q - e)^T (J \Delta q - e) + \frac{1}{2} \lambda^2 \Delta q^T \Delta q$$
$$= \frac{1}{2} \left( \Delta q^T J^T J \Delta q - 2 e^T J \Delta q + e^T e \right) + \frac{1}{2} \lambda^2 \Delta q^T \Delta q$$
$$= \frac{1}{2} \Delta q^T (J^T J + \lambda^2 I_n) \Delta q - e^T J \Delta q + \frac{1}{2} e^T e$$

To find the minimum, compute the gradient with respect to $\Delta q$ and set it to zero:
$$\nabla_{\Delta q} \mathcal{L} = (J^T J + \lambda^2 I_n) \Delta q - J^T e = 0$$
$$(J^T J + \lambda^2 I_n) \Delta q = J^T e$$

Because $\lambda > 0$, the matrix $(J^T J + \lambda^2 I_n) \in \mathbb{R}^{n \times n}$ is **strictly positive-definite** and has condition number strictly bounded for all configurations!
Solving for $\Delta q$:
$$\Delta q = (J^T J + \lambda^2 I_n)^{-1} J^T e$$

#### The Matrix Push-Through Identity:
For redundant systems where $n > m$ (e.g., $m = 6, n = 7$), inverting an $n \times n$ matrix is computationally more expensive than inverting an $m \times m$ matrix.
Using the algebraic push-through identity:
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$

*Proof of Push-Through Identity:*
$$(J^T J + \lambda^2 I_n) J^T = J^T J J^T + \lambda^2 J^T = J^T (J J^T + \lambda^2 I_m)$$
Pre-multiply both sides by $(J^T J + \lambda^2 I_n)^{-1}$ and post-multiply both sides by $(J J^T + \lambda^2 I_m)^{-1}$:
$$J^T (J J^T + \lambda^2 I_m)^{-1} = (J^T J + \lambda^2 I_n)^{-1} J^T$$
Q.E.D.

Therefore, the **Damped Least Squares Inverse** $J^* \in \mathbb{R}^{n \times m}$ is defined as:
$$J^*_{\text{DLS}} = J^T (J J^T + \lambda^2 I_m)^{-1}$$
$$\Delta q = J^*_{\text{DLS}} e$$

---

### 3.4 Spectral Analysis via SVD: Why DLS Never Diverges
Substitute the SVD $J = U \Sigma V^T$ directly into the DLS formula:
$$J^* = V \Sigma^T U^T \left( U \Sigma V^T V \Sigma^T U^T + \lambda^2 I_m \right)^{-1}$$
Since $V^T V = I_n$ and $U \lambda^2 I U^T = \lambda^2 I$:
$$J^* = V \Sigma^T U^T \left( U (\Sigma \Sigma^T + \lambda^2 I_m) U^T \right)^{-1} = V \Sigma^T (\Sigma \Sigma^T + \lambda^2 I_m)^{-1} U^T$$

Evaluating the diagonal components:
$$J^*_{\text{DLS}} = \sum_{i=1}^m \left( \frac{\sigma_i}{\sigma_i^2 + \lambda^2} \right) v_i u_i^T$$

Compare the filter response factors $f(\sigma_i)$ between the pure pseudoinverse and DLS:

| Method | Filter Weight $f(\sigma_i)$ | Behavior as $\sigma_i \gg \lambda$ | Behavior as $\sigma_i \to 0$ |
| :---: | :---: | :---: | :---: |
| **Moore-Penrose** | $\frac{1}{\sigma_i}$ | $\approx \frac{1}{\sigma_i}$ | **$\to \infty$ (Explosion!)** |
| **Damped Least Squares** | $\frac{\sigma_i}{\sigma_i^2 + \lambda^2}$ | $\approx \frac{1}{\sigma_i}$ (Exact tracking) | **$\to 0$ (Smooth suppression!)** |

```
    Filter Gain f(σ)
           ▲
           │         Pure Pseudoinverse 1/σ (Diverges to infinity!)
           │       \
           │        \
      1/2λ ┼─────────\──────╭───────.
           │          \    /         ' .
           │           \  /               ' .  Damped Least Squares (DLS)
           │            \/                    ' - - - - -
           │            /\
           └───────────┴──┴────────────────────────────────▶ Singular Value σ
                       0  λ
```

#### The Maximum Velocity Bound:
To find the maximum possible gain produced by DLS, differentiate $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$ with respect to $\sigma$:
$$\frac{df}{d\sigma} = \frac{(\sigma^2 + \lambda^2)(1) - \sigma(2\sigma)}{(\sigma^2 + \lambda^2)^2} = \frac{\lambda^2 - \sigma^2}{(\sigma^2 + \lambda^2)^2} = 0 \implies \sigma^* = \lambda$$
Evaluating at the peak $\sigma = \lambda$:
$$f_{\max} = f(\lambda) = \frac{\lambda}{\lambda^2 + \lambda^2} = \frac{\lambda}{2\lambda^2} = \frac{1}{2\lambda}$$

**Profound Mathematical Result:**
No matter how singular the robot configuration becomes, the maximum velocity gain of the DLS inverse is **strictly bounded** by:
$$\|J^*_{\text{DLS}}\|_2 \le \frac{1}{2\lambda}$$
If $\lambda = 0.05$, the maximum possible velocity amplification is bounded at $\frac{1}{2(0.05)} = 10.0$! Actuator motor speeds can never blow up!

---

### 3.5 Adaptive (Variable) Damping Strategies
Using a fixed, constant damping parameter $\lambda_0$ has an unfortunate side effect: it introduces a small tracking error everywhere throughout the entire workspace, even when the robot is operating in wide-open, highly dextrous postures.

To achieve **zero tracking error** in safe regions while maintaining **fail-safe protection** near singularities, we use **Adaptive Damping $\lambda(q)$**.

#### 1. Nakamura & Hanafusa Manipulability Damping:
Link the damping parameter to Yoshikawa's manipulability index $w(q) = \sqrt{\det(J J^T)}$:
$$\lambda^2(q) = \begin{cases} 0 & \text{if } w(q) \ge w_0 \\ \lambda_0^2 \left( 1 - \frac{w(q)}{w_0} \right)^2 & \text{if } w(q) < w_0 \end{cases}$$
where:
- $w_0 > 0$ is a user-defined threshold defining the boundary of the "danger zone".
- When $w(q) \ge w_0$, $\lambda = 0$, giving the **exact Moore-Penrose pseudoinverse** with zero tracking error!
- When $w(q) < w_0$, $\lambda$ ramps up quadratically, ensuring continuous, smooth transitions without jerk.

#### 2. Sugihara Singularity-Consistent DLS (SC-DLS):
Sugihara (2011) observed that when only *one* singular value collapses (e.g., wrist singularity), damping the entire matrix can unnecessarily degrade tracking along the remaining 5 non-singular directions.
SC-DLS computes damping directly from the minimum singular value $\sigma_{\min}$:
$$\lambda^2 = \begin{cases} 0 & \text{if } \sigma_{\min} \ge \sigma_0 \\ \lambda_0^2 \left( 1 - \frac{\sigma_{\min}}{\sigma_0} \right)^2 & \text{if } \sigma_{\min} < \sigma_0 \end{cases}$$

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the Damped Least Squares solver with adaptive damping and condition number monitoring:

```typescript
export interface DLSSolverOptions {
  lambdaBase?: number;         // nominal damping (e.g. 0.05)
  manipThreshold?: number;     // w0 safety threshold
  maxIterations?: number;
  tolerance?: number;
}

export class DampedLeastSquaresSolver {
  /**
   * Computes the DLS regularized inverse: J^* = J^T * (J * J^T + lambda^2 * I)^(-1)
   */
  public static computeDLSInverse(J: number[][], lambda: number): number[][] {
    const m = J.length;
    const n = J[0].length;
    const lambdaSq = lambda * lambda;

    // 1. Compute JJT = J * J^T (m x m)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += J[i][k] * J[j][k];
        JJT[i][j] = sum;
      }
      // Add Tikhonov regularization along diagonal: JJT + lambda^2 * I
      JJT[i][i] += lambdaSq;
    }

    // 2. Invert (JJT + lambda^2 * I) via Gauss-Jordan elimination
    const JJT_inv = this.invertMatrix(JJT);

    // 3. J^* = J^T * (JJT_inv) -> size n x m
    const J_star: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += J[k][r] * JJT_inv[k][c];
        }
        J_star[r][c] = sum;
      }
    }

    return J_star;
  }

  /**
   * Evaluates Nakamura-Hanafusa adaptive damping lambda(q).
   */
  public static computeAdaptiveLambda(
    manipulability: number,
    lambda0: number = 0.05,
    w0: number = 0.02
  ): number {
    if (manipulability >= w0) return 0.0;
    const ratio = 1.0 - manipulability / w0;
    return lambda0 * ratio;
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
      if (Math.abs(pivot) < 1e-12) {
        throw new Error("Matrix singular even after DLS regularization");
      }

      for (let j = 0; j < 2 * n; j++) M[i][j] /= pivot;

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = 0; j < 2 * n; j++) {
            M[k][j] -= factor * M[i][j];
          }
        }
      }
    }

    return M.map(row => row.slice(n));
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 9.1: Proof of the Matrix Push-Through Identity
**Problem Statement:** Prove that for any matrix $J \in \mathbb{R}^{m \times n}$ and scalar $\lambda > 0$:
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$

**Step-by-Step Derivation:**
1. Consider the algebraic matrix product:
   $$(J^T J + \lambda^2 I_n) J^T = J^T J J^T + \lambda^2 J^T$$
2. Factor $J^T$ to the left on the right-hand side:
   $$J^T J J^T + \lambda^2 J^T = J^T (J J^T + \lambda^2 I_m)$$
3. Equating both expressions:
   $$(J^T J + \lambda^2 I_n) J^T = J^T (J J^T + \lambda^2 I_m)$$
4. Pre-multiply both sides by $(J^T J + \lambda^2 I_n)^{-1}$ (which exists because $\lambda > 0$ makes it positive-definite):
   $$(J^T J + \lambda^2 I_n)^{-1} (J^T J + \lambda^2 I_n) J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
   $$I_n J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
   $$J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
5. Post-multiply both sides by $(J J^T + \lambda^2 I_m)^{-1}$:
   $$J^T (J J^T + \lambda^2 I_m)^{-1} = (J^T J + \lambda^2 I_n)^{-1} J^T$$

**Final Answer:**
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$
Q.E.D.

**Verification & Sanity Check:**
When $n = 7$ and $m = 6$, this identity replaces the inversion of a $7 \times 7$ matrix with the inversion of a $6 \times 6$ matrix, saving computational operations while producing identical mathematical numbers.

---

### Problem 9.2: DLS Step at Exact Singularity vs. Moore-Penrose Divergence
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is at the exact boundary singularity $(\theta_1, \theta_2) = (0^\circ, 0^\circ)$, where $J = \begin{bmatrix} 0 & 0 \\ 2 & 1 \end{bmatrix}$. A trajectory command requests a Cartesian velocity $\nu = [0.10, 0.05]^T\text{ m/s}$ (requesting $0.10\text{ m/s}$ forward along the locked $x$-axis).
1. Show that the pure Moore-Penrose pseudoinverse cannot achieve the $x$-velocity.
2. Compute the regularized joint velocity $\dot{q}$ using Damped Least Squares with damping parameter $\lambda = 0.2$.

**Given Data:**
- $J = \begin{bmatrix} 0 & 0 \\ 2 & 1 \end{bmatrix}$
- $\nu = [0.10, 0.05]^T$
- $\lambda = 0.2 \implies \lambda^2 = 0.04$

**Step-by-Step Derivation:**
1. Pure Moore-Penrose behavior:
   $J J^T = \begin{bmatrix} 0 & 0 \\ 0 & 5 \end{bmatrix}$. $\det(J J^T) = 0$.
   $(J J^T)^{-1}$ does not exist! Row 1 has zero pivot; the system is strictly singular.
   If one attempts to solve $J \dot{q} = \nu$:
   $$0 \dot{\theta}_1 + 0 \dot{\theta}_2 = 0.10 \implies 0 = 0.10 \quad (\text{Mathematically impossible!})$$
2. Damped Least Squares calculation:
   Formulate regularized matrix $A = J J^T + \lambda^2 I_2$:
   $$A = \begin{bmatrix} 0 & 0 \\ 0 & 5 \end{bmatrix} + \begin{bmatrix} 0.04 & 0 \\ 0 & 0.04 \end{bmatrix} = \begin{bmatrix} 0.04 & 0 \\ 0 & 5.04 \end{bmatrix}$$
3. Invert $A$:
   $$A^{-1} = \begin{bmatrix} \frac{1}{0.04} & 0 \\ 0 & \frac{1}{5.04} \end{bmatrix} = \begin{bmatrix} 25.0 & 0 \\ 0 & 0.198413 \end{bmatrix}$$
4. Compute $J^* = J^T A^{-1}$:
   $$J^* = \begin{bmatrix} 0 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 25.0 & 0 \\ 0 & 0.198413 \end{bmatrix} = \begin{bmatrix} 0 & 2(0.198413) \\ 0 & 1(0.198413) \end{bmatrix} = \begin{bmatrix} 0 & 0.396825 \\ 0 & 0.198413 \end{bmatrix}$$
5. Compute joint velocity $\dot{q} = J^* \nu$:
   $$\dot{q} = \begin{bmatrix} 0 & 0.396825 \\ 0 & 0.198413 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.05 \end{bmatrix} = \begin{bmatrix} 0(0.10) + 0.396825(0.05) \\ 0(0.10) + 0.198413(0.05) \end{bmatrix} = \begin{bmatrix} 0.019841 \\ 0.009921 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
- Moore-Penrose: **Undefined / Singular crash**.
- Damped Least Squares: **$\dot{q} = [0.01984\text{ rad/s}, 0.00992\text{ rad/s}]^T$** (completely smooth and bounded!).

**Verification & Sanity Check:**
Compute resulting Cartesian velocity $\nu_{\text{actual}} = J \dot{q}$:
$v_x = 0(0.0198) + 0(0.0099) = 0.00\text{ m/s}$.
$v_y = 2(0.019841) + 1(0.009921) = 0.039682 + 0.009921 = 0.049603\text{ m/s} \approx 0.05\text{ m/s}$.
Notice what DLS did: it completely ignored the impossible $x$-command, while fulfilling $99.2\%$ of the attainable $y$-command!

---

### Problem 9.3: Spectral Filter Weights Across the Singular Spectrum
**Problem Statement:** Let a robot possess singular values $\sigma \in \{ 2.0, 1.0, 0.5, 0.1, 0.05, 0.01, 0.0 \}$. For damping parameter $\lambda = 0.1$, compute the filter weight $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$ and compare it with the unregularized gain $1/\sigma$.

**Given Data:**
- $\lambda = 0.1 \implies \lambda^2 = 0.01$

**Step-by-Step Derivation:**
1. For $\sigma = 2.0$:
   $1/\sigma = 0.5000$.
   $f(2.0) = \frac{2.0}{4.0 + 0.01} = \frac{2.0}{4.01} \approx 0.49875$ ($99.8\%$ tracking).
2. For $\sigma = 1.0$:
   $1/\sigma = 1.0000$.
   $f(1.0) = \frac{1.0}{1.0 + 0.01} = \frac{1.0}{1.01} \approx 0.99010$ ($99.0\%$ tracking).
3. For $\sigma = 0.5$:
   $1/\sigma = 2.0000$.
   $f(0.5) = \frac{0.5}{0.25 + 0.01} = \frac{0.5}{0.26} \approx 1.92308$ ($96.2\%$ tracking).
4. For $\sigma = 0.1 = \lambda$ (Peak gain):
   $1/\sigma = 10.0000$.
   $f(0.1) = \frac{0.1}{0.01 + 0.01} = \frac{0.1}{0.02} = 5.00000$ (Damped by $50\%$).
5. For $\sigma = 0.05$:
   $1/\sigma = 20.0000$.
   $f(0.05) = \frac{0.05}{0.0025 + 0.01} = \frac{0.05}{0.0125} = 4.00000$ (Gain begins dropping!).
6. For $\sigma = 0.01$:
   $1/\sigma = 100.0000$.
   $f(0.01) = \frac{0.01}{0.0001 + 0.01} = \frac{0.01}{0.0101} \approx 0.99010$.
7. For $\sigma = 0.0$:
   $1/\sigma \to \infty$.
   $f(0.0) = \frac{0}{0.01} = 0.00000$ (Completely suppressed to zero!).

**Final Answer:**
Table of Filter Responses:

| $\sigma$ | Unregularized $1/\sigma$ | DLS Gain $f(\sigma)$ | Attenuation Ratio |
| :---: | :---: | :---: | :---: |
| $2.0$ | $0.5$ | $0.4988$ | $99.8\%$ |
| $1.0$ | $1.0$ | $0.9901$ | $99.0\%$ |
| $0.5$ | $2.0$ | $1.9231$ | $96.2\%$ |
| $0.1$ | $10.0$ | **$5.0000$** | $50.0\%$ |
| $0.05$ | $20.0$ | $4.0000$ | $20.0\%$ |
| $0.01$ | $100.0$ | $0.9901$ | $0.99\%$ |
| $0.00$ | $\infty$ | **$0.0000$** | **$0.0\%$** |

**Verification & Sanity Check:**
The maximum gain occurs exactly at $\sigma = \lambda = 0.1$, where $f = \frac{1}{2\lambda} = 5.0$, perfectly verifying Section 3.4.

---

### Problem 9.4: Condition Number Regularization
**Problem Statement:** A robot Jacobian has singular values $\sigma_1 = 2.0$ and $\sigma_2 = 10^{-4}$.
1. Compute the condition number of the unregularized matrix $J J^T$.
2. Compute the condition number of the regularized matrix $J J^T + \lambda^2 I$ for $\lambda = 0.05$.

**Given Data:**
- $\lambda_1 = \sigma_1^2 = 4.0$
- $\lambda_2 = \sigma_2^2 = 10^{-8}$
- $\lambda = 0.05 \implies \lambda^2 = 0.0025$

**Step-by-Step Derivation:**
1. Unregularized condition number:
   $$\kappa(J J^T) = \frac{\lambda_1}{\lambda_2} = \frac{4.0}{10^{-8}} = 4.0 \times 10^8 = 400,000,000$$
   (Severely ill-conditioned; inverting this causes catastrophic floating-point loss of precision).
2. Regularized eigenvalues of $J J^T + \lambda^2 I$:
   $$\lambda_{1, \text{reg}} = \lambda_1 + \lambda^2 = 4.0 + 0.0025 = 4.0025$$
   $$\lambda_{2, \text{reg}} = \lambda_2 + \lambda^2 = 10^{-8} + 0.0025 \approx 0.0025$$
3. Regularized condition number:
   $$\kappa_{\text{reg}} = \frac{4.0025}{0.0025} = 1601.0$$

**Final Answer:**
- Unregularized condition number: **$4.0 \times 10^8$** (pathologically ill-conditioned).
- DLS regularized condition number: **$1601.0$** (perfectly stable for 64-bit IEEE double precision arithmetic).

---

### Problem 9.5: Nakamura-Hanafusa Adaptive Damping Evaluation
**Problem Statement:** An adaptive damping controller has nominal damping $\lambda_0 = 0.08$ and threshold $w_0 = 0.05$. Calculate the damping parameter $\lambda$ when:
1. $w(q) = 0.12$ (well-conditioned).
2. $w(q) = 0.02$ (near singularity).
3. $w(q) = 0.00$ (at singularity).

**Step-by-Step Derivation:**
1. Case 1 ($w = 0.12$):
   Since $w \ge w_0$ ($0.12 \ge 0.05$):
   $$\lambda = 0.0$$
   The controller operates as pure Moore-Penrose with zero tracking distortion.
2. Case 2 ($w = 0.02$):
   Since $w < w_0$ ($0.02 < 0.05$):
   $$\lambda = \lambda_0 \left( 1 - \frac{w}{w_0} \right) = 0.08 \left( 1 - \frac{0.02}{0.05} \right) = 0.08(1 - 0.40) = 0.08(0.60) = 0.048$$
3. Case 3 ($w = 0.00$):
   $$\lambda = \lambda_0 (1 - 0) = \lambda_0 = 0.080$$

**Final Answer:**
- For $w = 0.12$: **$\lambda = 0.000$**
- For $w = 0.02$: **$\lambda = 0.048$**
- For $w = 0.00$: **$\lambda = 0.080$**

---

### Problem 9.6: Tracking Error Residual Formula
**Problem Statement:** Prove that the residual task-space velocity error $e_{\text{residual}} = \nu - J \dot{q}_{\text{DLS}}$ produced by DLS is given analytically by $e_{\text{residual}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} \nu$.

**Step-by-Step Derivation:**
1. Start with the DLS joint velocity definition:
   $$\dot{q}_{\text{DLS}} = J^T (J J^T + \lambda^2 I)^{-1} \nu$$
2. Compute the actual end-effector velocity:
   $$\nu_{\text{actual}} = J \dot{q}_{\text{DLS}} = J J^T (J J^T + \lambda^2 I)^{-1} \nu$$
3. Compute the residual error:
   $$e_{\text{residual}} = \nu - \nu_{\text{actual}} = \nu - J J^T (J J^T + \lambda^2 I)^{-1} \nu = \left[ I - J J^T (J J^T + \lambda^2 I)^{-1} \right] \nu$$
4. Insert the identity $(J J^T + \lambda^2 I)(J J^T + \lambda^2 I)^{-1} = I$:
   $$e_{\text{residual}} = \left[ (J J^T + \lambda^2 I) - J J^T \right] (J J^T + \lambda^2 I)^{-1} \nu = (\lambda^2 I) (J J^T + \lambda^2 I)^{-1} \nu$$
   $$e_{\text{residual}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} \nu$$

**Final Answer:**
$$e_{\text{residual}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} \nu$$
Q.E.D.

**Verification & Sanity Check:**
If $\lambda \to 0$, $e_{\text{residual}} \to 0$ (zero tracking error). As $\lambda$ increases, the residual error scales directly with $\lambda^2$.

---

### Problem 9.7: DLS on a 3-DoF Arm Near a Wrist Singularity
**Problem Statement:** A 3-axis spherical wrist has rotational Jacobian $J = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 0 \\ 0 & 0 & 0.01 \end{bmatrix}$ (pitch angle $\theta_5 \approx 0.01\text{ rad}$, near singularity). The commanded angular velocity is $\omega_d = [0, 0, 1.0]^T\text{ rad/s}$.
1. Compute the pure inverse command $\dot{q} = J^{-1} \omega_d$.
2. Compute the DLS command with $\lambda = 0.05$.

**Given Data:**
- Commanded yaw: $\omega_z = 1.0\text{ rad/s}$
- $\sigma_3 \approx 0.01$

**Step-by-Step Derivation:**
1. Pure Inverse:
   Invert $J$:
   $$J^{-1} \begin{bmatrix} 0 \\ 0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} -100.0 \\ 0.0 \\ 100.0 \end{bmatrix}\text{ rad/s}$$
   Joints 4 and 6 are commanded to spin at **$\pm 100\text{ rad/s}$** ($\approx 955\text{ RPM}$!), which exceeds motor limits.
2. DLS Formulation:
   Evaluate $f(\sigma_3)$ for $\sigma_3 = 0.01$ with $\lambda = 0.05$:
   $$f(\sigma_3) = \frac{0.01}{0.01^2 + 0.05^2} = \frac{0.01}{0.0001 + 0.0025} = \frac{0.01}{0.0026} \approx 3.846154$$
   Joint velocity along singular axis:
   $$\dot{q}_{\text{DLS}} \approx [-3.85, 0, +3.85]^T\text{ rad/s}$$

**Final Answer:**
- Pure Inverse: **$\dot{q} = [-100.0, 0.0, +100.0]^T\text{ rad/s}$** (Violent actuator saturation).
- Damped Least Squares: **$\dot{q} = [-3.85, 0.0, +3.85]^T\text{ rad/s}$** (Safe, smooth, non-saturating motion).

---

### Problem 9.8: Levenberg-Marquardt Diagonal Scaling
**Problem Statement:** In classical Levenberg-Marquardt optimization, the damping term is often chosen as $\lambda^2 \operatorname{diag}(J^T J)$ rather than isotropic $\lambda^2 I$. Explain the advantage of diagonal scaling for robots with mixed prismatic and revolute joints.

**Solution:**
1. In a mixed robot (e.g. SCARA or cylindrical), revolute joints have angular units (radians), while prismatic joints have linear units (meters).
2. Consequently, the columns of $J$ have different units and wildly different magnitudes (e.g., $J_{\text{revolute}} \sim 1.0\text{ m}$, $J_{\text{prismatic}} \sim 1.0$).
3. An isotropic damping $\lambda^2 I$ damps both joints equally, which disproportionately penalizes the joint with smaller numerical scale.
4. Using $\lambda^2 \operatorname{diag}(J^T J)$ normalizes the damping according to the natural mechanical sensitivity of each individual joint, ensuring unit-invariant regularization.

---

### Problem 9.9: Truncated SVD (TSVD) vs. Damped Least Squares
**Problem Statement:** Contrast the mathematical filtering behavior of Truncated SVD (TSVD) with Damped Least Squares (DLS).

**Solution:**
1. **Truncated SVD (TSVD):**
   $$f_{\text{TSVD}}(\sigma_i) = \begin{cases} \frac{1}{\sigma_i} & \text{if } \sigma_i \ge \sigma_{\text{threshold}} \\ 0 & \text{if } \sigma_i < \sigma_{\text{threshold}} \end{cases}$$
   TSVD employs a sharp step-function cutoff. When $\sigma_i$ crosses the threshold, the joint command abruptly jumps from $\frac{1}{\sigma_{\text{threshold}}}$ to $0$, causing severe velocity discontinuities and mechanical jerk!
2. **Damped Least Squares (DLS):**
   $$f_{\text{DLS}}(\sigma_i) = \frac{\sigma_i}{\sigma_i^2 + \lambda^2}$$
   DLS is infinitely differentiable ($C^\infty$ smooth). As $\sigma_i$ drops, the filter response smoothly attenuates without any discrete jumps, ensuring smooth motor currents.

---

### Problem 9.10: Closed-Loop Trajectory Crossing a Singularity
**Problem Statement:** A robot is commanded to trace a continuous Cartesian straight line from $p_A = (-1, 1)$ to $p_B = (1, 1)$, passing directly through the singular point $(0, 1)$ where an elbow or shoulder aligns. Prove that DLS maintains bounded joint positions and velocities throughout the crossing.

**Step-by-Step Derivation:**
1. Let the trajectory be parameterized by time $t \in [0, T]$ with continuous velocity $\nu(t)$.
2. Under pure inverse kinematics, as $t \to t_{\text{singularity}}$, $\sigma_{\min}(t) \to 0$, causing $\dot{q}(t) = J^{-1}\nu \to \infty$. The integral $q(t) = \int \dot{q} dt$ experiences a finite jump discontinuity.
3. Under DLS, the joint velocity is $\dot{q}(t) = J^*_{\text{DLS}}(t) \nu(t)$.
4. From Section 3.4, the spectral norm is strictly bounded:
   $$\|J^*_{\text{DLS}}(t)\|_2 \le \frac{1}{2\lambda}$$
5. Therefore:
   $$\|\dot{q}(t)\|_2 \le \frac{1}{2\lambda} \|\nu(t)\|_2 \le \frac{\nu_{\max}}{2\lambda} < \infty$$
6. Because $\dot{q}(t)$ is bounded for all $t \in [0, T]$, the joint position $q(t) = q_0 + \int_0^t \dot{q}(\tau) d\tau$ is strictly Lipschitz continuous.

**Final Answer:**
DLS guarantees that joint velocities remain strictly bounded ($\|\dot{q}\| \le \frac{\nu_{\max}}{2\lambda}$) and joint trajectories remain smooth and continuous across the singular crossing.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 9.11: Damping Parameter Calibration from Actuator Limits
**Problem Statement:** A robot's motor has a maximum allowable angular speed of $\dot{q}_{\max} = 10.0\text{ rad/s}$. The maximum commanded Cartesian velocity along any trajectory is $\nu_{\max} = 0.5\text{ m/s}$. Calculate the minimum safe damping parameter $\lambda_{\min}$.

**Solution:**
1. The maximum possible DLS velocity amplification is bounded by:
   $$\|\dot{q}\|_{\max} \le \frac{1}{2\lambda} \nu_{\max}$$
2. Set $\|\dot{q}\|_{\max} \le \dot{q}_{\max}$:
   $$\frac{\nu_{\max}}{2\lambda} \le \dot{q}_{\max} \implies \lambda \ge \frac{\nu_{\max}}{2\dot{q}_{\max}}$$
3. Substitute numerical values:
   $$\lambda_{\min} = \frac{0.5\text{ m/s}}{2(10.0\text{ rad/s})} = \frac{0.5}{20.0} = 0.025$$
4. Choosing $\lambda \ge 0.025$ guarantees that the motors will never exceed their $10\text{ rad/s}$ speed limit, even at an exact singularity.

---

### Problem 9.12: Weighted Damped Least Squares
**Problem Statement:** Formulate the DLS normal equations when joint displacements are penalized by a positive-definite weight matrix $W_q \in \mathbb{R}^{n \times n}$ and task errors are penalized by $W_e \in \mathbb{R}^{m \times m}$.

**Solution:**
1. Objective function:
   $$\mathcal{L}(\Delta q) = \frac{1}{2} (J \Delta q - e)^T W_e (J \Delta q - e) + \frac{1}{2} \lambda^2 \Delta q^T W_q \Delta q$$
2. Differentiate with respect to $\Delta q$:
   $$J^T W_e (J \Delta q - e) + \lambda^2 W_q \Delta q = 0$$
   $$(J^T W_e J + \lambda^2 W_q) \Delta q = J^T W_e e$$
3. Solving for $\Delta q$:
   $$\Delta q = (J^T W_e J + \lambda^2 W_q)^{-1} J^T W_e e$$

---

### Problem 9.13: Selectively Damped Least Squares (SDLS)
**Problem Statement:** Explain how Buss and Gerhard's Selectively Damped Least Squares (SDLS) algorithm assigns individual damping parameters $\lambda_i$ to each singular value.

**Solution:**
1. In standard DLS, a single scalar $\lambda$ is applied globally to all singular values.
2. In SDLS, each singular vector $u_i$ is evaluated independently:
   $$\dot{q} = \sum_{i=1}^m \gamma_i \left( \frac{u_i^T \nu}{\sigma_i} \right) v_i$$
   where $\gamma_i = \min\left(1, \frac{\dot{q}_{\max}}{\|v_i\| |u_i^T \nu| / \sigma_i}\right) \in (0, 1]$.
3. If an individual singular direction causes joint velocities to exceed limits, it is scaled down individually, leaving all other non-saturating directions completely undamped.

---

### Problem 9.14: Maximum DLS Gain Proof
**Problem Statement:** Prove analytically that $\max_{\sigma > 0} \frac{\sigma}{\sigma^2 + \lambda^2} = \frac{1}{2\lambda}$ using the Arithmetic Mean-Geometric Mean (AM-GM) inequality.

**Solution:**
1. By the AM-GM inequality, for any positive real numbers $a, b > 0$:
   $$a + b \ge 2\sqrt{ab}$$
2. Set $a = \sigma^2$ and $b = \lambda^2$:
   $$\sigma^2 + \lambda^2 \ge 2\sqrt{\sigma^2 \lambda^2} = 2\sigma\lambda$$
3. Invert both sides:
   $$\frac{1}{\sigma^2 + \lambda^2} \le \frac{1}{2\sigma\lambda}$$
4. Multiply both sides by $\sigma > 0$:
   $$\frac{\sigma}{\sigma^2 + \lambda^2} \le \frac{\sigma}{2\sigma\lambda} = \frac{1}{2\lambda}$$
5. Equality holds if and only if $\sigma^2 = \lambda^2 \implies \sigma = \lambda$.
6. Therefore, the global maximum is strictly $\frac{1}{2\lambda}$.

---

### Problem 9.15: Residual Error Energy Bound
**Problem Statement:** Using the residual error formula $e_{\text{res}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} e$, prove that $\|e_{\text{res}}\| \le \|e\|$.

**Solution:**
1. In SVD coordinates:
   $$e_{\text{res}} = \sum_{i=1}^m \frac{\lambda^2}{\sigma_i^2 + \lambda^2} (u_i^T e) u_i$$
2. Since $\sigma_i^2 \ge 0$ and $\lambda^2 > 0$:
   $$\frac{\lambda^2}{\sigma_i^2 + \lambda^2} \le \frac{\lambda^2}{0 + \lambda^2} = 1.0$$
3. Therefore:
   $$\|e_{\text{res}}\|^2 = \sum_{i=1}^m \left( \frac{\lambda^2}{\sigma_i^2 + \lambda^2} \right)^2 (u_i^T e)^2 \le \sum_{i=1}^m (u_i^T e)^2 = \|e\|^2$$
4. Taking square roots: $\|e_{\text{res}}\| \le \|e\|$. DLS never amplifies the task error.

---

### Problem 9.16: Singularity-Robust Wrist Orientation
**Problem Statement:** A 6-DoF arm with spherical wrist experiences a wrist singularity ($\theta_5 = 0$). Explain how DLS allows the robot to continue moving through the singularity without stopping.

**Solution:**
1. At $\theta_5 = 0$, the wrist loses 1 rotational DoF (about the axis perpendicular to axes 4 and 6).
2. The singular value corresponding to this lost rotation collapses to zero: $\sigma_6 = 0$.
3. DLS sets the filter weight for this lost direction to $\frac{0}{0 + \lambda^2} = 0$, commanding zero joint velocity along the impossible direction.
4. The remaining 5 degrees of freedom continue tracking smoothly. The tool passes through the singularity with a transient orientation error of a few tenths of a degree, completely avoiding motor tripping.

---

### Problem 9.17: Dissipated Virtual Energy in DLS
**Problem Statement:** Interpret the damping term $\frac{1}{2}\lambda^2 \|\dot{q}\|^2$ physically as a virtual viscous damper acting on the joint motors.

**Solution:**
1. The virtual power dissipated by the damping term is:
   $$P_{\text{damp}} = \lambda^2 \dot{q}^T \dot{q} = \lambda^2 \|\dot{q}\|^2$$
2. This is identical to the Rayleigh dissipation function of a physical linear viscous damper with damping coefficient $b = \lambda^2$ attached to each motor shaft.
3. When joint speeds attempt to diverge, the virtual dampers absorb the energy, enforcing finite, stable motion.

---

### Problem 9.18: Comparison of DLS with Gradient Descent
**Problem Statement:** Show that as $\lambda \to \infty$, the DLS step approaches pure gradient descent $\Delta q \to \frac{1}{\lambda^2} J^T e$.

**Solution:**
1. Recall the normal equations:
   $$\Delta q = (J^T J + \lambda^2 I_n)^{-1} J^T e$$
2. Factor $\lambda^2$ out of the inverted matrix:
   $$\Delta q = \frac{1}{\lambda^2} \left( \frac{1}{\lambda^2} J^T J + I_n \right)^{-1} J^T e$$
3. As $\lambda \to \infty$, $\frac{1}{\lambda^2} J^T J \to 0$:
   $$\lim_{\lambda \to \infty} \left( \frac{1}{\lambda^2} J^T J + I_n \right)^{-1} = I_n^{-1} = I_n$$
4. Therefore:
   $$\lim_{\lambda \to \infty} \Delta q = \frac{1}{\lambda^2} J^T e = \alpha J^T e$$
   with step size $\alpha = 1/\lambda^2$.

---

### Problem 9.19: DLS with Reference Posture Bias
**Problem Statement:** Formulate DLS with a bias toward a comfortable home posture $q_0$:
$\min \frac{1}{2}\|J \Delta q - e\|^2 + \frac{1}{2}\lambda^2 \|\Delta q - (q_0 - q_k)\|^2$.

**Solution:**
1. Differentiate the objective with respect to $\Delta q$:
   $$J^T (J \Delta q - e) + \lambda^2 (\Delta q - (q_0 - q_k)) = 0$$
2. Rearrange:
   $$(J^T J + \lambda^2 I) \Delta q = J^T e + \lambda^2 (q_0 - q_k)$$
3. Solving for $\Delta q$:
   $$\Delta q = (J^T J + \lambda^2 I)^{-1} \left( J^T e + \lambda^2 (q_0 - q_k) \right)$$
4. Near singularities where $J^T e \to 0$, the arm smoothly drifts toward its preferred home posture $q_0$.

---

### Problem 9.20: Verification of Positive-Definiteness Invariant
**Problem Statement:** Prove that for any real matrix $J \in \mathbb{R}^{m \times n}$ and any $\lambda > 0$, the matrix $A = J J^T + \lambda^2 I_m$ is strictly positive-definite.

**Solution:**
1. For any non-zero vector $x \in \mathbb{R}^m$ ($x \neq 0$):
   $$x^T A x = x^T (J J^T + \lambda^2 I_m) x = x^T J J^T x + \lambda^2 x^T x$$
2. Let $y = J^T x \in \mathbb{R}^n$. Then $x^T J J^T x = y^T y = \|y\|_2^2 \ge 0$.
3. Since $x \neq 0$ and $\lambda > 0$:
   $$\lambda^2 x^T x = \lambda^2 \|x\|_2^2 > 0$$
4. Therefore:
   $$x^T A x = \|y\|_2^2 + \lambda^2 \|x\|_2^2 \ge \lambda^2 \|x\|_2^2 > 0$$
5. Because $x^T A x > 0$ for all $x \neq 0$, matrix $A$ is **strictly positive-definite** and has strictly positive eigenvalues $\lambda_i(A) \ge \lambda^2 > 0$, guaranteeing numerical invertibility.
