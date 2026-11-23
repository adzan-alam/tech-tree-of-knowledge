# Chapter 7: Kinematic Singularities, Workspace Boundaries, and Manipulability Ellipsoids

---

## 1. The Layman's Genesis & Intuitive Overview

Extend your arm straight out in front of you as far as you can. Lock your elbow into a completely straight line. Now, without moving your shoulder, try to move your hand forward by another centimeter.

It is physically impossible. Your arm is at the absolute boundary of its reach. But something much more subtle and dangerous is occurring mathematically:
- If you were asked to move your hand sideways or up and down, your shoulder and elbow could easily accomplish it.
- But along the radial line pointing straight outward from your shoulder, your arm has lost the ability to move. 

Now imagine you are an industrial robot controller attempting to maintain a constant Cartesian velocity of $0.5\text{ m/s}$ forward. As your elbow straightens and aligns with your upper arm, the transmission ratio between motor rotation and forward hand motion collapses to zero. To produce even a millimeter of forward motion, the control loop demands that your elbow motor spin faster and faster: $10\text{ rad/s} \to 100\text{ rad/s} \to 10,000\text{ rad/s} \to \infty$! The motors screech, draw massive current spikes, trigger emergency stops, or physically tear their gearboxes apart.

```
       Normal Configuration                   Singular Configuration (Straight Arm)
            ●                                       ● Joint 1
           / \                                      │
          /   \                                     │ Link 1
         /     \                                    ▼
        ●       ●                                   ● Joint 2 (Elbow Aligned)
    Flexible, full 2D motion                        │
    Manipulability Ellipse: Open                    │ Link 2
                                                    ▼
                                                    ● Hand
                                            Cannot move outward!
                                            Ellipsoid collapses to a flat line!
```

These dangerous postures are called **Kinematic Singularities**. A singularity is a mechanical "dead zone" where:
1. The robot loses one or more degrees of freedom in Task Space (it physically cannot move in certain directions).
2. The inverse velocity mapping requires **infinite joint speeds** to follow arbitrary Cartesian paths.
3. The Jacobian matrix loses rank, its determinant drops to zero, and its condition number blows up to infinity.

To design safe, autonomous robots, we must mathematically map where these singular minefields lie and measure our distance from danger using **Yoshikawa's Manipulability Ellipsoids**.

---

## 2. Historical Foundations & Epistemological Evolution

The study of kinematic singularities traces its roots to 19th-century algebraic geometry and the analysis of singular points on algebraic curves by Cayley and Sylvester. In modern robotics, the systematic classification of manipulator singularities began in 1976 with the foundational work of **Bernard Roth** and his students at Stanford University, who analyzed the geometric loci where robot Jacobians drop rank.

In 1984, the Japanese roboticist **Tsuneo Yoshikawa** published his seminal paper, *"Manipulability of Robotic Mechanisms"*, in the *International Journal of Robotics Research*. Yoshikawa introduced two transformative concepts that revolutionized robot control and mechanical design:
1. **The Manipulability Measure $w(q) = \sqrt{\det(J J^T)}$:** A single scalar index quantifying how far an articulated mechanism is from a singularity and how effortlessly it can generate velocities in all directions.
2. **The Manipulability Ellipsoid:** A geometric visualization of the unit sphere of motor joint speeds mapped into Cartesian space, revealing the principal directions of maximum velocity and maximum force.

Yoshikawa's formulation provided the foundation for singularity avoidance algorithms, redundant robot motion planning, and optimal mechanical arm design (such as determining optimal link length ratios for maximum dexterous volume).

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Mathematical Definition of a Singularity
Let $J(q) \in \mathbb{R}^{m \times n}$ be the manipulator Jacobian matrix relating $n$ joint velocities to $m$ task-space velocities ($m \le n$).
Under normal, well-conditioned configurations, the Jacobian has **full row rank**:
$$\operatorname{rank}(J(q)) = m$$

A configuration $q^* \in \mathcal{Q}$ is defined as a **Kinematic Singularity** if and only if the Jacobian loses rank:
$$\operatorname{rank}(J(q^*)) < m$$

For a non-redundant manipulator where joint count equals task space dimension ($m = n$, such as a 6-DoF arm in $SE(3)$ or a 2-DoF arm in $\mathbb{R}^2$), the Jacobian is a square $n \times n$ matrix. In this case, a singularity occurs precisely when the determinant vanishes:
$$\det(J(q^*)) = 0$$

#### The Two Subspaces at a Singularity:
By the Fundamental Theorem of Linear Algebra, when $\operatorname{rank}(J) = r < m$:
1. **Range Space $\mathcal{R}(J) \subset \mathbb{R}^m$:** The subspace of instantaneous Cartesian velocities the robot *can* generate has dimension $r < m$.
2. **Left Nullspace $\mathcal{N}(J^T) \subset \mathbb{R}^m$:** The orthogonal complement of the range space, with dimension $m - r > 0$. Any desired Cartesian velocity $\nu$ having a non-zero projection in $\mathcal{N}(J^T)$ is physically **impossible** to achieve.

### 3.2 Boundary vs. Interior Singularities
Singularities in industrial manipulators fall into two distinct physical categories:

#### 1. Boundary Singularities (Workspace Limits)
Occur when the arm is fully outstretched ($r = r_{\max}$) or fully folded back onto itself ($r = r_{\min}$). The end-effector lies on the mathematical boundary of the reachable workspace $\partial\mathcal{W}$. Motion perpendicular to the workspace boundary (radially outward or inward) is completely locked.

#### 2. Interior Singularities
Occur inside the interior of the reachable workspace when two or more joint axes line up or become coplanar:
- **Wrist Singularity:** For a 6-DoF arm with a spherical wrist, occurring when joint axis 4 and joint axis 6 become collinear ($\theta_5 = 0$). The wrist loses one rotational degree of freedom; the robot cannot produce instantaneous rotation about the axis perpendicular to axes 4 and 6.
- **Shoulder Singularity:** Occurs when the wrist center point $p_w$ passes directly through the vertical rotation axis $z_0$ of the base joint ($x_w^2 + y_w^2 = 0$). At this point, rotating the base motor produces zero linear velocity at the wrist!
- **Elbow Singularity:** Occurs when the elbow joint straightens ($\theta_3 = 0$ or $180^\circ$), locking the forearm and upper arm into a single plane.

```
       Wrist Singularity (θ₅ = 0)                   Shoulder Singularity
       Joint 4 ─── Joint 5 ─── Joint 6                      Base Axis z₀
          ▲           ▲           ▲                              │
          │           │           │                              ▼  Wrist Center
       ═════════════════════════════                     ────────●────────
       Axes 4 & 6 Collinear! Lost 1 Rotational DoF       Wrist intersects base rotation axis!
```

---

### 3.3 Yoshikawa's Manipulability Measure
To evaluate how close an articulated arm is to a singularity, Yoshikawa (1984) defined the scalar **Manipulability Measure** $w(q)$:
$$w(q) = \sqrt{\det(J(q) J^T(q))}$$

#### Properties of $w(q)$:
1. For square Jacobians ($m = n$):
   $$\det(J J^T) = \det(J)\det(J^T) = (\det(J))^2 \implies w(q) = |\det(J(q))|$$
2. Using Singular Value Decomposition (SVD) $J = U \Sigma V^T$, where singular values are $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_m \ge 0$:
   $$J J^T = U \Sigma V^T V \Sigma^T U^T = U \Sigma \Sigma^T U^T$$
   $$\det(J J^T) = \prod_{i=1}^m \sigma_i^2 \implies w(q) = \sigma_1 \sigma_2 \cdots \sigma_m$$
3. **Singularity Criterion:** $w(q) = 0$ if and only if $q$ is a kinematic singularity (since at least one $\sigma_m = 0$).
4. The volume of the velocity manipulability ellipsoid is directly proportional to $w(q)$:
   $$V_{\text{ellipsoid}} = \frac{2 \pi^{m/2}}{m \Gamma(m/2)} \prod_{i=1}^m \sigma_i \propto w(q)$$

---

### 3.4 Manipulability Ellipsoids: Velocity vs. Force Duality

#### The Velocity Manipulability Ellipsoid
Consider the set of all joint velocity vectors bounded by unit Euclidean norm:
$$\mathcal{S}_{\dot{q}} = \{ \dot{q} \in \mathbb{R}^n \mid \|\dot{q}\|_2 \le 1 \} = \{ \dot{q} \in \mathbb{R}^n \mid \dot{q}^T \dot{q} \le 1 \}$$

What is the geometric shape of the resulting task-space velocities $\nu = J \dot{q}$?
Assuming non-singular $J$, the inverse velocity is $\dot{q} = J^{-1} \nu$. Substituting into the unit sphere equation:
$$(J^{-1} \nu)^T (J^{-1} \nu) \le 1 \implies \nu^T (J^{-1})^T (J^{-1}) \nu \le 1 \implies \nu^T (J J^T)^{-1} \nu \le 1$$

This is the algebraic equation of a hyper-ellipsoid in $\mathbb{R}^m$, known as the **Velocity Manipulability Ellipsoid**:
- The directions of the principal axes are given by the eigenvectors $u_1, u_2, \dots, u_m$ of matrix $J J^T$ (the left singular vectors of $J$).
- The lengths of the principal semi-axes are equal to the singular values $\sigma_1, \sigma_2, \dots, \sigma_m$.

```
                              u₂ (Minor Axis: Length σ₂)
                                  ▲
                                  │   Velocity Ellipsoid
                           . - - -│- - - .
                       '          │          '
                     (            ┼───────────)──▶ u₁ (Major Axis: Length σ₁)
                       .          │          .
                           ' - - -│- - - '
                                  │
```

#### The Force Manipulability Ellipsoid
Now consider the static force transmission relation from Chapter 6: $\tau = J^T F$.
Let the actuator joint motor torques be bounded by unit Euclidean norm:
$$\mathcal{S}_\tau = \{ \tau \in \mathbb{R}^n \mid \tau^T \tau \le 1 \}$$

Substitute $\tau = J^T F$:
$$(J^T F)^T (J^T F) \le 1 \implies F^T (J J^T) F \le 1$$

This defines the **Force Manipulability Ellipsoid**:
- The principal axes of the force ellipsoid lie along the **exact same directions** $u_i$ as the velocity ellipsoid!
- However, the lengths of the principal semi-axes are **inversely proportional** to the singular values:
  $$\text{Semi-axis length for force} = \frac{1}{\sigma_i}$$

#### The Fundamental Duality Law:
Along any spatial direction $u_i$:
$$\text{Velocity capability} \times \text{Force capability} = \sigma_i \times \frac{1}{\sigma_i} = 1.0$$
- If an arm has a huge velocity reach along direction $u_1$ ($\sigma_1 \gg 1$), its force capability along $u_1$ is tiny ($1/\sigma_1 \ll 1$).
- Near a singularity where $\sigma_m \to 0$, velocity along $u_m$ collapses to zero, but force capability along $u_m$ approaches infinity! This is why a locked, fully straightened human knee can support immense body weight without requiring quadriceps muscle torque (structural bracing).

---

### 3.5 The Jacobian Condition Number & Isotropy
While Yoshikawa's index $w(q)$ measures the overall volume of the ellipsoid, it does not measure its **eccentricity** (how spherical or stretched the ellipsoid is).

The **Condition Number** $\kappa(J)$ of the Jacobian is defined as:
$$\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}} = \frac{\sigma_1}{\sigma_m} \ge 1.0$$
- **$\kappa(J) = 1.0$ (Kinematic Isotropy):** All singular values are equal ($\sigma_1 = \sigma_2 = \cdots = \sigma_m$). The manipulability ellipsoid is a perfect sphere! The robot can move or exert force equally well in every direction with zero directional bias.
- **$\kappa(J) \to \infty$ (Singularity):** The smallest singular value $\sigma_m \to 0$. The ellipsoid collapses into a pancake or line of zero volume.

The **Kinematic Conditioning Index (KCI)** is the reciprocal:
$$\eta(J) = \frac{1}{\kappa(J)} = \frac{\sigma_{\min}}{\sigma_{\max}} \in [0, 1]$$
Optimal robotic designs maximize $\eta(J)$ across their working volume.

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation for computing the SVD of a Jacobian, Yoshikawa manipulability, and condition numbers:

```typescript
export interface SVDResult {
  U: number[][];      // m x m orthogonal matrix
  S: number[];        // singular values sorted in descending order
  V: number[][];      // n x n orthogonal matrix
}

export class SingularityAnalysis {
  /**
   * Computes the SVD of an m x n matrix using the Jacobi eigenvalue method on J * J^T.
   */
  public static computeSVD(J: number[][]): SVDResult {
    const m = J.length;
    const n = J[0].length;

    // Compute JJT = J * J^T (m x m symmetric positive semi-definite)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += J[i][k] * J[j][k];
        }
        JJT[i][j] = sum;
      }
    }

    // Jacobi eigenvalue decomposition on JJT: JJT * U = U * Lambda
    const U: number[][] = Array.from({ length: m }, (_, i) => {
      const row = new Array(m).fill(0);
      row[i] = 1.0;
      return row;
    });

    const A = JJT.map(r => [...r]);
    for (let sweep = 0; sweep < 40; sweep++) {
      let maxOff = 0;
      for (let p = 0; p < m; p++) {
        for (let q = p + 1; q < m; q++) {
          const val = Math.abs(A[p][q]);
          if (val > maxOff) maxOff = val;
        }
      }
      if (maxOff < 1e-12) break;

      for (let p = 0; p < m; p++) {
        for (let q = p + 1; q < m; q++) {
          const apq = A[p][q];
          if (Math.abs(apq) < 1e-15) continue;

          const tau = (A[q][q] - A[p][p]) / (2.0 * apq);
          const t = tau >= 0 ? 1.0 / (tau + Math.sqrt(1.0 + tau * tau)) : -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
          const c = 1.0 / Math.sqrt(1.0 + t * t);
          const s = t * c;

          A[p][p] -= t * apq;
          A[q][q] += t * apq;
          A[p][q] = 0;
          A[q][p] = 0;

          for (let k = 0; k < m; k++) {
            if (k !== p && k !== q) {
              const akp = A[k][p];
              const akq = A[k][q];
              A[k][p] = c * akp - s * akq;
              A[p][k] = A[k][p];
              A[k][q] = s * akp + c * akq;
              A[q][k] = A[k][q];
            }
          }

          for (let k = 0; k < m; k++) {
            const ukp = U[k][p];
            const ukq = U[k][q];
            U[k][p] = c * ukp - s * ukq;
            U[k][q] = s * ukp + c * ukq;
          }
        }
      }
    }

    // Singular values are sqrt of eigenvalues of JJT
    const S: number[] = new Array(m);
    for (let i = 0; i < m; i++) {
      S[i] = Math.sqrt(Math.max(0, A[i][i]));
    }

    // Sort singular values descending
    const indices = Array.from({ length: m }, (_, i) => i);
    indices.sort((a, b) => S[b] - S[a]);

    const sortedS = indices.map(i => S[i]);
    const sortedU: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < m; c++) {
        sortedU[r][c] = U[r][indices[c]];
      }
    }

    return { U: sortedU, S: sortedS, V: [] };
  }

  /**
   * Computes Yoshikawa's Manipulability Measure w(q) = prod(sigma_i).
   */
  public static yoshikawaManipulability(J: number[][]): number {
    const svd = this.computeSVD(J);
    let prod = 1.0;
    for (const s of svd.S) {
      prod *= s;
    }
    return prod;
  }

  /**
   * Computes the condition number kappa = sigma_max / sigma_min.
   */
  public static conditionNumber(J: number[][]): number {
    const svd = this.computeSVD(J);
    const sMax = svd.S[0];
    const sMin = svd.S[svd.S.length - 1];
    if (sMin < 1e-12) return Infinity;
    return sMax / sMin;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 7.1: Singularity Locus of a 2R Planar Manipulator
**Problem Statement:** For a 2R planar manipulator with link lengths $L_1$ and $L_2$, derive the analytical expression for the determinant of the Jacobian matrix and determine all joint configurations corresponding to kinematic singularities.

**Given Data:**
- From Chapter 6:
  $$J = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \end{bmatrix}$$

**Step-by-Step Derivation:**
1. Compute the determinant $\det(J) = J_{11} J_{22} - J_{12} J_{21}$:
   $$\det(J) = (-L_1 s_1 - L_2 s_{12})(L_2 c_{12}) - (-L_2 s_{12})(L_1 c_1 + L_2 c_{12})$$
2. Expand the products:
   $$\det(J) = -L_1 L_2 s_1 c_{12} - L_2^2 s_{12} c_{12} + L_1 L_2 s_{12} c_1 + L_2^2 s_{12} c_{12}$$
3. The $L_2^2 s_{12} c_{12}$ terms cancel:
   $$\det(J) = L_1 L_2 (s_{12} c_1 - c_{12} s_1)$$
4. Apply the trigonometric angle subtraction identity $\sin(A - B) = \sin A \cos B - \cos A \sin B$:
   $$s_{12} c_1 - c_{12} s_1 = \sin((\theta_1 + \theta_2) - \theta_1) = \sin\theta_2$$
5. Thus:
   $$\det(J) = L_1 L_2 \sin\theta_2$$
6. Set $\det(J) = 0$ for a singularity:
   $$L_1 L_2 \sin\theta_2 = 0 \iff \sin\theta_2 = 0$$
   Assuming non-zero link lengths ($L_1, L_2 > 0$):
   $$\theta_2 = 0\quad \text{or} \quad \theta_2 = \pi \; (180^\circ)$$

**Final Answer:**
- Determinant: **$\det(J) = L_1 L_2 \sin\theta_2$**
- Singular Configurations:
  1. **$\theta_2 = 0^\circ$:** Arm fully extended at outer workspace boundary ($r = L_1 + L_2$).
  2. **$\theta_2 = 180^\circ$:** Arm fully folded at inner workspace boundary ($r = |L_1 - L_2|$).
  Notice that $\det(J)$ is **independent of $\theta_1$**: rotating the base waist simply spins the singular circle around the origin!

**Verification & Sanity Check:**
When $\theta_2 = 0$, both links are aligned in a straight line. The arm cannot move radially outward, losing 1 degree of freedom, exactly matching $\sin(0) = 0$.

---

### Problem 7.2: SVD Analysis at Boundary Singularity ($\theta_2 = 0$)
**Problem Statement:** Let a 2R planar arm have equal link lengths $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ at configuration $(\theta_1, \theta_2) = (0^\circ, 0^\circ)$.
1. Evaluate the numerical Jacobian matrix.
2. Compute the singular values $\sigma_1, \sigma_2$ and the singular vectors $u_1, u_2$.
3. Identify the direction of lost motion.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $\theta_1 = 0, \theta_2 = 0 \implies \theta_{12} = 0$
- $s_1 = 0, c_1 = 1, s_{12} = 0, c_{12} = 1$

**Step-by-Step Derivation:**
1. Evaluate $J$:
   $$J = \begin{bmatrix} -1(0) - 1(0) & -1(0) \\ 1(1) + 1(1) & 1(1) \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 2.0 & 1.0 \end{bmatrix}$$
2. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} 0 & 0 \\ 2.0 & 1.0 \end{bmatrix} \begin{bmatrix} 0 & 2.0 \\ 0 & 1.0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 2.0^2 + 1.0^2 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 5.0 \end{bmatrix}$$
3. Eigenvalues of $J J^T$:
   $$\lambda_1 = 5.0, \quad \lambda_2 = 0.0$$
4. Singular values $\sigma_i = \sqrt{\lambda_i}$:
   $$\sigma_1 = \sqrt{5.0} \approx 2.236068\text{ m/s per rad/s}$$
   $$\sigma_2 = \sqrt{0.0} = 0.000000\text{ m/s per rad/s}$$
5. Eigenvectors $u_i$:
   - For $\lambda_1 = 5.0$: $u_1 = [0, 1]^T$ (along the vertical $y$-axis).
   - For $\lambda_2 = 0.0$: $u_2 = [1, 0]^T$ (along the horizontal $x$-axis).

**Final Answer:**
- Singular values: **$\sigma_1 = \sqrt{5} \approx 2.2361$**, **$\sigma_2 = 0$**
- Major axis: **$u_1 = [0, 1]^T$** (transverse tangential velocity is maximum)
- Minor axis: **$u_2 = [1, 0]^T$** (radial velocity is **completely lost**)
- The velocity manipulability ellipse has collapsed into a 1D vertical line segment of length $2\sqrt{5}$!

**Verification & Sanity Check:**
Because the arm lies along the $x$-axis, rotating either joint can only move the tip along the $y$-axis ($J_{11} = J_{12} = 0$). No combination of motor speeds can generate velocity along the $x$-axis.

---

### Problem 7.3: Kinematic Isotropy Configuration for a 2R Arm
**Problem Statement:** For a 2R planar arm with equal link lengths $L_1 = L_2 = L$, find the joint angle $\theta_2$ that maximizes Yoshikawa's manipulability measure $w(q)$. Show that at this configuration, the condition number $\kappa(J_v)$ is optimal.

**Given Data:**
- $w(q) = |\det(J)| = L^2 |\sin\theta_2|$

**Step-by-Step Derivation:**
1. Maximize $w(\theta_2)$:
   $$\frac{d}{d\theta_2} (L^2 \sin\theta_2) = L^2 \cos\theta_2 = 0 \implies \cos\theta_2 = 0 \implies \theta_2 = \pm 90^\circ = \pm\frac{\pi}{2}\text{ rad}$$
2. Maximum manipulability value:
   $$w_{\max} = L^2 |\sin(\pi/2)| = L^2$$
3. SVD analysis at $\theta_2 = 90^\circ$ (let $\theta_1 = 0$ for simplicity):
   $$s_1 = 0, c_1 = 1, s_{12} = 1, c_{12} = 0$$
   $$J = \begin{bmatrix} -L(0) - L(1) & -L(1) \\ L(1) + L(0) & L(0) \end{bmatrix} = \begin{bmatrix} -L & -L \\ L & 0 \end{bmatrix}$$
4. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} -L & -L \\ L & 0 \end{bmatrix} \begin{bmatrix} -L & L \\ -L & 0 \end{bmatrix} = \begin{bmatrix} 2L^2 & -L^2 \\ -L^2 & L^2 \end{bmatrix}$$
5. Eigenvalues of $J J^T$:
   Characteristic equation: $\det(\lambda I - J J^T) = (\lambda - 2L^2)(\lambda - L^2) - (-L^2)^2 = \lambda^2 - 3L^2 \lambda + L^4 = 0$.
   $$\lambda = \frac{3L^2 \pm \sqrt{9L^4 - 4L^4}}{2} = \frac{3 \pm \sqrt{5}}{2} L^2$$
   $$\lambda_1 = \frac{3 + \sqrt{5}}{2} L^2 \approx 2.618 L^2 \implies \sigma_1 = \sqrt{2.618} L \approx 1.618 L$$
   $$\lambda_2 = \frac{3 - \sqrt{5}}{2} L^2 \approx 0.382 L^2 \implies \sigma_2 = \sqrt{0.382} L \approx 0.618 L$$
6. Notice that $\sigma_1 \sigma_2 = (1.618)(0.618) L^2 = 1.000 L^2 = w_{\max}$.
7. Condition number:
   $$\kappa = \frac{\sigma_1}{\sigma_2} = \frac{1.618}{0.618} \approx 2.618$$

**Final Answer:**
- Optimal configuration: **$\theta_2 = \pm 90^\circ$**
- Maximum Manipulability: **$w_{\max} = L_1 L_2$**
- Condition Number: **$\kappa = \frac{3 + \sqrt{5}}{2} \approx 2.618$**

**Verification & Sanity Check:**
When $\theta_2 = 90^\circ$, link 1 and link 2 are perpendicular. The elbow has maximum rotational clearance from the shoulder, producing the largest possible ellipse area in the plane.

---

### Problem 7.4: Manipulability Profile Across Reachable Radii
**Problem Statement:** Express Yoshikawa's manipulability measure $w$ of a 2R arm ($L_1 = L_2 = 1.0\text{ m}$) as a function of the radial distance $r = \sqrt{x^2 + y^2}$ from the origin.

**Given Data:**
- $r^2 = L_1^2 + L_2^2 + 2L_1 L_2 \cos\theta_2 = 1 + 1 + 2\cos\theta_2 = 2 + 2\cos\theta_2$
- $w = |\det(J)| = L_1 L_2 |\sin\theta_2| = |\sin\theta_2|$

**Step-by-Step Derivation:**
1. Express $\cos\theta_2$ in terms of $r$:
   $$\cos\theta_2 = \frac{r^2 - 2}{2} = \frac{r^2}{2} - 1$$
2. Use $\sin^2\theta_2 = 1 - \cos^2\theta_2$:
   $$\sin^2\theta_2 = 1 - \left( \frac{r^2}{2} - 1 \right)^2 = 1 - \left( \frac{r^4}{4} - r^2 + 1 \right) = r^2 - \frac{r^4}{4} = \frac{r^2(4 - r^2)}{4}$$
3. Take the square root:
   $$w(r) = \frac{r \sqrt{4 - r^2}}{2}$$
4. Analyze the profile:
   - At $r = 0$ (fully folded): $w(0) = 0$.
   - At $r = 2$ (fully extended boundary): $w(2) = \frac{2\sqrt{4 - 4}}{2} = 0$.
   - Maximum occurs where $\frac{d}{dr}(4r^2 - r^4) = 8r - 4r^3 = 0 \implies r^2 = 2 \implies r = \sqrt{2} \approx 1.414\text{ m}$.
   - At $r = \sqrt{2}$: $w(\sqrt{2}) = \frac{\sqrt{2}\sqrt{4 - 2}}{2} = \frac{\sqrt{2}\sqrt{2}}{2} = 1.0$.

**Final Answer:**
$$w(r) = \frac{r \sqrt{4 - r^2}}{2}$$
Manipulability is zero at $r = 0$ and $r = 2\text{ m}$, reaching its global peak of **$w = 1.0$** at **$r = \sqrt{2}\text{ m}$**.

**Verification & Sanity Check:**
$r = \sqrt{2}\text{ m}$ corresponds to the right-angled elbow configuration $\theta_2 = 90^\circ$ ($r^2 = 1^2 + 1^2 = 2$), completely verifying Problem 7.3.

---

### Problem 7.5: Wrist Singularity of a 6-DoF Spherical Wrist
**Problem Statement:** A 6-DoF robot has a spherical wrist whose last three joint axes intersect at the wrist center $p_w$. The rotational Jacobian for the wrist subassembly is given by $J_{\omega, \text{wrist}} = \begin{bmatrix} z_3 & z_4 & z_5 \end{bmatrix}$. Prove that a singularity occurs when $\theta_5 = 0$ and identify the lost rotational degree of freedom.

**Given Data:**
- In standard DH notation:
  $$z_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}, \quad z_4 = \begin{bmatrix} -\sin\theta_4 \\ \cos\theta_4 \\ 0 \end{bmatrix}, \quad z_5 = \begin{bmatrix} \cos\theta_4\sin\theta_5 \\ \sin\theta_4\sin\theta_5 \\ \cos\theta_5 \end{bmatrix}$$

**Step-by-Step Derivation:**
1. Compute the determinant of $J_{\omega, \text{wrist}}$:
   $$\det(J_{\omega, \text{wrist}}) = z_3 \cdot (z_4 \times z_5)$$
2. Compute the cross product $z_4 \times z_5$:
   $$z_4 \times z_5 = \begin{bmatrix} -\sin\theta_4 \\ \cos\theta_4 \\ 0 \end{bmatrix} \times \begin{bmatrix} \cos\theta_4\sin\theta_5 \\ \sin\theta_4\sin\theta_5 \\ \cos\theta_5 \end{bmatrix} = \begin{bmatrix} \cos\theta_4\cos\theta_5 \\ \sin\theta_4\cos\theta_5 \\ -\sin^2\theta_4\sin\theta_5 - \cos^2\theta_4\sin\theta_5 \end{bmatrix} = \begin{bmatrix} \cos\theta_4\cos\theta_5 \\ \sin\theta_4\cos\theta_5 \\ -\sin\theta_5 \end{bmatrix}$$
3. Take the dot product with $z_3 = [0, 0, 1]^T$:
   $$\det(J_{\omega, \text{wrist}}) = -\sin\theta_5$$
4. Set determinant to zero:
   $$-\sin\theta_5 = 0 \implies \theta_5 = 0\quad \text{or}\quad \theta_5 = \pi \; (180^\circ)$$
5. At $\theta_5 = 0$:
   $$z_5 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = z_3$$
   Axes $z_3$ and $z_5$ become collinear!

**Final Answer:**
- Singularity condition: **$\theta_5 = 0^\circ$** or **$\theta_5 = 180^\circ$**.
- Lost Degree of Freedom: The wrist loses the ability to rotate instantaneously about the axis perpendicular to $z_3$ and $z_4$ ($y_4$-axis). Both joint 4 and joint 6 produce redundant rotation about the exact same physical axis $z_3$.

**Verification & Sanity Check:**
Because axes 4 and 6 coincide, commanding a rotation around the tool normal requires $\theta_4$ and $\theta_6$ to spin at infinite velocity with opposite signs, causing joint runaway.

---

### Problem 7.6: Shoulder Singularity of an Anthropomorphic Robot Arm
**Problem Statement:** An anthropomorphic 6-DoF robot (such as the PUMA 560) has a waist joint rotating about the vertical axis $z_0 = [0, 0, 1]^T$. Show that a singularity occurs whenever the wrist center $p_w$ intersects the vertical line passing through $z_0$ ($x_w = 0, y_w = 0$).

**Step-by-Step Derivation:**
1. The linear velocity produced by the base joint 1 at the wrist center is:
   $$v_{w, 1} = z_0 \times p_w = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} x_w \\ y_w \\ z_w \end{bmatrix} = \begin{bmatrix} -y_w \\ x_w \\ 0 \end{bmatrix}$$
2. When the wrist center lies on the base axis, $x_w = 0$ and $y_w = 0$:
   $$v_{w, 1} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
3. In this posture, rotating the base motor with angular velocity $\dot{q}_1 = 100\text{ rad/s}$ produces **zero** linear velocity at the wrist center ($v_{w, 1} = 0$).
4. The first column of the positional Jacobian vanishes identically ($J_{v, 1} = 0$), reducing the rank of $J_v \in \mathbb{R}^{3 \times 3}$ from 3 to 2.

**Final Answer:**
A **Shoulder Singularity** occurs whenever the wrist center lies on the base rotation axis ($x_w = 0, y_w = 0$). The robot loses the ability to translate instantaneously in the direction perpendicular to the arm's plane.

**Verification & Sanity Check:**
If an overhead camera commands the robot to move sideways while overhead ($x_w = y_w = 0$), base joint 1 must theoretically spin infinitely fast to rotate the shoulder plane instantaneously.

---

### Problem 7.7: Elbow Singularity of a 6-DoF Robot
**Problem Statement:** Prove that for an anthropomorphic robot where the shoulder (joint 2) and elbow (joint 3) axes are parallel, an elbow singularity occurs whenever the forearm aligns with the upper arm ($a_2 \parallel a_3$).

**Step-by-Step Derivation:**
1. In the elevation plane of joints 2 and 3, the kinematics is identical to the planar 2R arm.
2. The distance from shoulder to wrist is $r_{sw} = \sqrt{a_2^2 + a_3^2 + 2a_2 a_3 \cos\theta_3}$.
3. The rate of change of radial distance is:
   $$\dot{r}_{sw} = \frac{-a_2 a_3 \sin\theta_3}{r_{sw}} \dot{\theta}_3$$
4. When $\theta_3 = 0^\circ$ or $180^\circ$, $\sin\theta_3 = 0 \implies \dot{r}_{sw} = 0$.
5. The Jacobian determinant factor associated with the arm plane is $a_2 a_3 \sin\theta_3 = 0$.

**Final Answer:**
An **Elbow Singularity** occurs when **$\theta_3 = 0^\circ$** (fully extended arm) or **$\theta_3 = 180^\circ$** (fully folded arm). Radial motion along the line connecting the shoulder to the wrist is lost.

**Verification & Sanity Check:**
Identical to Problem 7.1, the 2-link planar subchain determinant $L_1 L_2 \sin\theta_2$ governs the elbow singularity of 6-axis spatial arms.

---

### Problem 7.8: Velocity Manipulability Ellipsoid Geometry for a 2R Arm
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}, L_2 = 0.5\text{ m}$ is at $(\theta_1, \theta_2) = (0^\circ, 90^\circ)$. Calculate:
1. The lengths of the semi-major and semi-minor axes ($\sigma_1, \sigma_2$) of the velocity manipulability ellipse.
2. The tilt angle $\psi$ of the ellipse in the $xy$-plane.

**Given Data:**
- $L_1 = 1.0, L_2 = 0.5$
- $\theta_1 = 0, \theta_2 = 90^\circ \implies \theta_{12} = 90^\circ$
- $s_1 = 0, c_1 = 1, s_{12} = 1, c_{12} = 0$

**Step-by-Step Derivation:**
1. Evaluate $J$:
   $$J = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \end{bmatrix} = \begin{bmatrix} -0.5 & -0.5 \\ 1.0 & 0.0 \end{bmatrix}$$
2. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} -0.5 & -0.5 \\ 1.0 & 0.0 \end{bmatrix} \begin{bmatrix} -0.5 & 1.0 \\ -0.5 & 0.0 \end{bmatrix} = \begin{bmatrix} 0.50 & -0.50 \\ -0.50 & 1.00 \end{bmatrix}$$
3. Compute eigenvalues of $J J^T$:
   $$\det(\lambda I - J J^T) = (\lambda - 0.5)(\lambda - 1.0) - (-0.5)^2 = \lambda^2 - 1.5\lambda + 0.5 - 0.25 = \lambda^2 - 1.5\lambda + 0.25 = 0$$
   $$\lambda = \frac{1.5 \pm \sqrt{1.5^2 - 4(0.25)}}{2} = \frac{1.5 \pm \sqrt{2.25 - 1.0}}{2} = \frac{1.5 \pm \sqrt{1.25}}{2} \approx \frac{1.5 \pm 1.118034}{2}$$
   $$\lambda_1 \approx \frac{2.618034}{2} = 1.309017 \implies \sigma_1 = \sqrt{1.309017} \approx 1.144123$$
   $$\lambda_2 \approx \frac{0.381966}{2} = 0.190983 \implies \sigma_2 = \sqrt{0.190983} \approx 0.437016$$
4. Compute orientation angle $\psi$ of major axis:
   For a $2 \times 2$ symmetric matrix $\begin{bmatrix} a & b \\ b & d \end{bmatrix}$:
   $$\tan(2\psi) = \frac{2b}{a - d} = \frac{2(-0.50)}{0.50 - 1.00} = \frac{-1.00}{-0.50} = +2.0$$
   $$2\psi = \operatorname{atan}(2.0) \approx 63.435^\circ \implies \psi \approx 31.717^\circ$$
   Since $d > a$, the eigenvector for the larger eigenvalue $\lambda_1 = 1.309$ has larger $y$-component: $\psi = 31.717^\circ + 90^\circ = 121.72^\circ$.

**Final Answer:**
- Major semi-axis: **$\sigma_1 = 1.1441\text{ m/s}$**
- Minor semi-axis: **$\sigma_2 = 0.4370\text{ m/s}$**
- Tilt angle of major axis: **$\psi \approx 121.7^\circ$**
- Manipulability volume: $w = \sigma_1 \sigma_2 = (1.1441)(0.4370) = 0.5000 = L_1 L_2 \sin(90^\circ)$.

**Verification & Sanity Check:**
$\det(J J^T) = (0.50)(1.00) - (-0.50)^2 = 0.50 - 0.25 = 0.25$.
$\sigma_1^2 \sigma_2^2 = (1.309017)(0.190983) = 0.250000$. Exact match.

---

### Problem 7.9: Force Manipulability Ellipsoid Geometry
**Problem Statement:** For the arm in Problem 7.8, derive the semi-axis lengths of the force manipulability ellipse and verify the force-velocity duality relationship.

**Given Data:**
- From Problem 7.8: $\sigma_1 = 1.144123, \sigma_2 = 0.437016$.

**Step-by-Step Derivation:**
1. The force manipulability ellipsoid is defined by $F^T (J J^T) F \le 1$.
2. The semi-axis lengths are the reciprocals of the singular values:
   $$f_1 = \frac{1}{\sigma_1} = \frac{1}{1.144123} \approx 0.874032\text{ N per N}\cdot\text{m}$$
   $$f_2 = \frac{1}{\sigma_2} = \frac{1}{0.437016} \approx 2.288246\text{ N per N}\cdot\text{m}$$
3. Duality verification:
   - Along direction $u_1$ ($121.7^\circ$): Velocity capability is high ($\sigma_1 = 1.144$), but force capability is low ($f_1 = 0.874$).
   - Along direction $u_2$ ($31.7^\circ$): Velocity capability is low ($\sigma_2 = 0.437$), but force capability is high ($f_2 = 2.288$).

**Final Answer:**
- Force ellipse semi-axes: **$f_1 = 0.8740\text{ N}$** and **$f_2 = 2.2882\text{ N}$**.
- The force ellipse is rotated by $90^\circ$ relative to the velocity ellipse! The direction of easiest velocity is the direction of hardest force.

**Verification & Sanity Check:**
$f_1 \cdot \sigma_1 = 0.874032 \times 1.144123 = 1.0000$.
$f_2 \cdot \sigma_2 = 2.288246 \times 0.437016 = 1.0000$. Duality holds identically.

---

### Problem 7.10: Jacobian Condition Number and Conditioning Index
**Problem Statement:** Compute the condition number $\kappa(J)$ and the Kinematic Conditioning Index $\eta(J)$ for the configuration in Problem 7.8.

**Given Data:**
- $\sigma_1 = 1.144123$
- $\sigma_2 = 0.437016$

**Step-by-Step Derivation:**
1. Compute the condition number $\kappa$:
   $$\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}} = \frac{1.144123}{0.437016} \approx 2.618034$$
2. Compute the Kinematic Conditioning Index $\eta$:
   $$\eta(J) = \frac{1}{\kappa(J)} = \frac{0.437016}{1.144123} \approx 0.381966$$

**Final Answer:**
- Condition number: **$\kappa(J) \approx 2.618$**
- Conditioning Index: **$\eta(J) \approx 0.382$** ($38.2\%$ of perfect isotropy)

**Verification & Sanity Check:**
Notice that $\kappa = \frac{3 + \sqrt{5}}{2}$, exactly the golden ratio square $(\frac{1+\sqrt{5}}{2})^2 \approx 1.618^2 \approx 2.618$.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 7.11: Singularity Locus of a Planar 3R Arm
**Problem Statement:** For a 3R planar manipulator with link lengths $L_1, L_2, L_3$ performing 2D positioning tasks ($m = 2, n = 3$), determine the singularity condition where $\operatorname{rank}(J_v) < 2$.

**Solution:**
1. The positional Jacobian $J_v \in \mathbb{R}^{2 \times 3}$ has columns:
   $$J_v = \begin{bmatrix} z_0 \times p_e & z_1 \times (p_e - p_1) & z_2 \times (p_e - p_2) \end{bmatrix}$$
2. The matrix loses rank if all three columns are linearly dependent.
3. Since each column $z \times r_i$ is perpendicular to the vector from joint $i$ to the end-effector $p_e - p_i$, all three columns become parallel if and only if the vectors $(p_e - p_0)$, $(p_e - p_1)$, and $(p_e - p_2)$ all lie along the **same straight line**.
4. This occurs when all three links are fully aligned:
   $$\theta_2 = 0 \text{ or } \pi, \quad \theta_3 = 0 \text{ or } \pi$$
5. Singularities occur strictly at the boundaries of the reachable workspace ($r_{\max} = L_1 + L_2 + L_3$ and $r_{\min}$). In the interior, rank is always 2!

---

### Problem 7.12: SCARA Manipulator Singularities
**Problem Statement:** Identify all singular configurations for the 4-DoF SCARA robot analyzed in Problem 6.4.

**Solution:**
1. The SCARA Jacobian has non-zero rows only for $\dot{x}, \dot{y}, \dot{z}, \omega_z$.
2. The vertical translation $\dot{z} = -d_3$ is decoupled and non-singular for all $d_3$.
3. The horizontal submatrix for $(\dot{x}, \dot{y})$ is identical to the 2R planar arm:
   $$\det(J_{xy}) = L_1 L_2 \sin\theta_2$$
4. Singularities occur strictly when $\sin\theta_2 = 0 \implies \theta_2 = 0^\circ$ (arm fully extended) or $\theta_2 = 180^\circ$ (arm folded).

---

### Problem 7.13: Singularity Avoidance via Gradient of Manipulability
**Problem Statement:** In redundant robotic control, secondary tasks maximize manipulability $w(q)$. Formulate the joint velocity gradient $\nabla_q w(q)$ for a 2R arm.

**Solution:**
1. $w(q) = L_1 L_2 \sin\theta_2$ (for $\theta_2 \in (0, \pi)$).
2. Compute partial derivatives:
   $$\frac{\partial w}{\partial \theta_1} = 0$$
   $$\frac{\partial w}{\partial \theta_2} = L_1 L_2 \cos\theta_2$$
3. Gradient vector:
   $$\nabla_q w(q) = \begin{bmatrix} 0 \\ L_1 L_2 \cos\theta_2 \end{bmatrix}$$
4. If $\theta_2 < 90^\circ$, $\cos\theta_2 > 0$, driving the elbow to open toward $90^\circ$. If $\theta_2 > 90^\circ$, $\cos\theta_2 < 0$, driving the elbow to close toward $90^\circ$.

---

### Problem 7.14: Left Nullspace at a Singularity
**Problem Statement:** For the 2R arm at $\theta_2 = 0, \theta_1 = 0$ ($J = \begin{bmatrix} 0 & 0 \\ 2 & 1 \end{bmatrix}$), find a basis for the left nullspace $\mathcal{N}(J^T)$.

**Solution:**
1. Transpose: $J^T = \begin{bmatrix} 0 & 2 \\ 0 & 1 \end{bmatrix}$.
2. Solve $J^T v = 0$:
   $$\begin{bmatrix} 0 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} 2v_y \\ v_y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies v_y = 0$$
3. $v_x$ is completely unconstrained.
4. Basis vector: $v = [1, 0]^T$.
5. The left nullspace is spanned by the unit vector $[1, 0]^T$ along the $x$-axis, mathematically confirming that velocity along $x$ cannot be generated.

---

### Problem 7.15: Directional Force Transmission Ratio
**Problem Statement:** Define the force transmission ratio $\alpha_F(u)$ along a specified Cartesian unit direction $u \in \mathbb{R}^m$ ($\|u\| = 1$).

**Solution:**
1. Let a contact force be directed along unit vector $u$: $F = f \cdot u$, where $f = \|F\|$.
2. The required joint torques are $\tau = J^T F = f J^T u$.
3. The torque magnitude squared is:
   $$\|\tau\|^2 = \tau^T \tau = f^2 u^T J J^T u$$
4. The force transmission ratio (force per unit actuator torque) is:
   $$\alpha_F(u) = \frac{f}{\|\tau\|} = \frac{1}{\sqrt{u^T J J^T u}}$$

---

### Problem 7.16: Askey-Gasparetto Manipulability Measure
**Problem Statement:** Compare Yoshikawa's volume metric $w = \prod \sigma_i$ with the harmonic mean manipulability metric $w_H = \frac{m}{\sum_{i=1}^m \frac{1}{\sigma_i}}$.

**Solution:**
1. Yoshikawa's product metric can remain high even if one singular value becomes dangerously small, as long as the other singular values are large.
2. The harmonic mean $w_H$ is dominated by the smallest singular value $\sigma_{\min}$:
   $$\lim_{\sigma_{\min} \to 0} w_H = 0$$
3. Therefore, the harmonic mean provides a more sensitive early warning metric for proximity to singularities in real-time trajectory planners.

---

### Problem 7.17: Parallel Robot Singularities (Type I vs. Type II)
**Problem Statement:** Explain the distinction between Type I (serial-like) and Type II (parallel) singularities in closed-chain parallel robots using the implicit kinematic relation $J_x \dot{x} = J_q \dot{q}$.

**Solution:**
1. **Type I Singularity ($\det(J_q) = 0$):** Occurs at the boundary of the reachable workspace. The actuator motors cannot produce end-effector velocity in certain directions (actuator locking).
2. **Type II Singularity ($\det(J_x) = 0$):** Occurs in the interior of the workspace. The moving platform gains uncontrollable internal degrees of freedom even when all actuator motors are locked! The platform can shake, vibrate, or collapse with infinite mechanical stiffness loss.

---

### Problem 7.18: Isotropic Manipulator Design Condition
**Problem Statement:** Prove that for a 2R planar manipulator, perfect kinematic isotropy ($\kappa(J_v) = 1.0$) is mathematically impossible if link lengths are unequal ($L_1 \neq L_2$).

**Solution:**
1. From Problem 7.3, eigenvalues of $J J^T$ satisfy $\lambda_1 = \lambda_2$ if and only if the discriminant of the characteristic polynomial vanishes:
   $$\Delta = (\operatorname{tr}(J J^T))^2 - 4\det(J J^T) = 0$$
2. Direct calculation yields:
   $$\Delta = (L_1^2 - L_2^2)^2 + 4 L_1^2 L_2^2 \cos^2\theta_2$$
3. For $\Delta = 0$, both terms must vanish independently since both are non-negative squares:
   - $4 L_1^2 L_2^2 \cos^2\theta_2 = 0 \implies \cos\theta_2 = 0 \implies \theta_2 = 90^\circ$.
   - $(L_1^2 - L_2^2)^2 = 0 \implies L_1 = L_2$.
4. If $L_1 \neq L_2$, $\Delta > 0$ strictly for all $\theta_2$, making $\lambda_1 \neq \lambda_2$ always. Perfect isotropy requires strictly equal link lengths!

---

### Problem 7.19: Infinite Joint Velocity Divergence Proof
**Problem Statement:** Prove analytically that commanding an end-effector velocity with a non-zero component along an unattainable singular direction causes joint velocity $\dot{q}$ to diverge to infinity.

**Solution:**
1. Using SVD: $J = \sum_{i=1}^m \sigma_i u_i v_i^T$.
2. For non-singular $J$, the inverse velocity is:
   $$\dot{q} = J^{-1} \nu = \sum_{i=1}^m \frac{u_i^T \nu}{\sigma_i} v_i$$
3. Suppose $\nu$ has a non-zero projection $c_m = u_m^T \nu \neq 0$ along the singular direction $u_m$.
4. The joint velocity norm is:
   $$\|\dot{q}\|^2 = \sum_{i=1}^m \left( \frac{u_i^T \nu}{\sigma_i} \right)^2 \ge \frac{c_m^2}{\sigma_m^2}$$
5. As the robot approaches the singularity, $\sigma_m \to 0$:
   $$\lim_{\sigma_m \to 0} \|\dot{q}\| \ge \lim_{\sigma_m \to 0} \frac{|c_m|}{\sigma_m} = \infty$$
6. Motor velocities diverge to infinity.

---

### Problem 7.20: SVD Matrix Inversion & Reconstruction Verification
**Problem Statement:** State the mathematical invariant checks that verify the numerical SVD computation of a Jacobian matrix.

**Solution:**
For $J \in \mathbb{R}^{m \times n}$ with computed decomposition $U, \Sigma, V$:
1. **Reconstruction Check:** $\|J - U \Sigma V^T\|_\infty < 10^{-12}$.
2. **Orthogonality of Left Vectors:** $\|U^T U - I_m\|_\infty < 10^{-12}$.
3. **Non-Negativity & Monotonicity:** $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_m \ge 0$.
4. **Determinant Consistency:** $|\det(U)| = 1.000000 \pm 10^{-12}$.
