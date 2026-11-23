# Chapter 5: Analytical Inverse Kinematics — Decoupling, Pieper's Criterion, and Closed-Form Solutions

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are seated at a workbench. A cup of coffee rests before you. When you decide to pick it up, your conscious mind does not plan individual joint angles: you do not think, *"Rotate shoulder by $23.4^\circ$, flex elbow by $68.1^\circ$, pronate forearm by $14.2^\circ$."* You simply think: *"Move hand to $(x, y, z)$."*

Your biological neuromuscular system solves an **Inverse Kinematics (IK)** problem in real time: given a desired target pose in the external physical world (Task Space $\mathcal{X}$), compute the required internal joint angles (Configuration Space $\mathcal{Q}$).

```
   Target Pose in World (X)                          Motor Angles (Q)
    ┌─────────────────────┐                          ┌─────────────────────┐
    │  x = 0.50 m         │                          │  theta_1 =  42.1°   │
    │  y = 0.20 m         │   ═════ Inverse ═════▶   │  theta_2 = -85.3°   │
    │  z = 0.35 m         │        Kinematics        │  theta_3 =  12.0°   │
    │  Orientation: Down  │                          │  ... (up to 8 ways!)│
    └─────────────────────┘                          └─────────────────────┘
```

While Forward Kinematics (Chapters 3 & 4) is mathematically straightforward—always yielding a single, unique, deterministic answer through matrix multiplication—Inverse Kinematics is dramatically more complex and treacherous:
1. **Non-Linear Transcendental Equations:** Forward kinematics wraps joint angles inside non-linear sine and cosine cascades. Inverting them requires solving highly coupled systems of trigonometric polynomials.
2. **Multiple Discrete Solutions:** To touch your nose, you can hold your elbow pointing downward toward your chest (elbow-down) or flared outward toward the ceiling (elbow-up). A standard 6-axis industrial robot typically has **8 distinct configurations** that place the tool at the exact same physical spot!
3. **Unreachable Targets (No Solution):** If an object is placed beyond the robot's physical reach, no real-valued joint angles exist. A computer attempting to compute $\arccos(1.05)$ will produce `NaN` (Not a Number), crashing real-time control software unless boundary clamping is rigorously enforced.
4. **Kinematic Singularities:** In certain aligned postures, degrees of freedom collapse, causing an infinite number of possible solutions.

In this chapter, we explore **analytical (closed-form) inverse kinematics**, where exact algebraic and geometric formulas determine all valid joint angles in microseconds without iterative approximation.

---

## 2. Historical Foundations & Epistemological Evolution

The quest for closed-form inverse kinematics was the central mathematical challenge of late-20th-century robotics. 

In 1968, **Donald L. Pieper** completed his landmark Stanford University PhD dissertation, *The Kinematics of Manipulators under Computer Control*, under the supervision of Bernard Roth. Pieper investigated whether an arbitrary 6-DoF serial arm could be solved algebraically. He discovered a profound structural theorem—now universally known as **Pieper's Criterion**:
> *A 6-degree-of-freedom serial manipulator possesses an exact closed-form algebraic inverse kinematics solution if and only if three consecutive joint axes intersect at a single point, or three consecutive joint axes are parallel.*

Pieper's discovery immediately changed the history of industrial automation. Almost every commercial robot arm designed over the subsequent five decades—including the Unimation PUMA 560, the KUKA KR series, the FANUC M-series, the ABB IRB series, and the Universal Robots UR5/UR10—was deliberately engineered with a **spherical wrist** (where joint axes 4, 5, and 6 intersect at a single physical point). This design choice enables **kinematic decoupling**, splitting the complex 6D non-linear problem into a 3D position problem followed by an independent 3D orientation problem.

For general 6R manipulators that do *not* satisfy Pieper's criterion, closed-form solutions remained an unsolved mathematical mystery until 1993, when **Manocha and Canny**, alongside **Raghavan and Roth**, used dialytic elimination theory to prove that a general 6R robot has up to **16 distinct inverse kinematics solutions**, corresponding to the roots of a 16th-degree polynomial.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Problem Formulation & Solvability
Given a desired target transformation matrix $T_d \in SE(3)$:
$$T_d = \begin{bmatrix} R_d & p_d \\ 0_{1 \times 3} & 1 \end{bmatrix} = \begin{bmatrix} n_x & s_x & a_x & p_x \\ n_y & s_y & a_y & p_y \\ n_z & s_z & a_z & p_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
where $n, s, a \in \mathbb{R}^3$ are the normal, sliding, and approach unit vectors of the end-effector tool frame, find all joint angle vectors $q = [q_1, q_2, \dots, q_n]^T \in \mathcal{Q}$ satisfying:
$$f(q) = T_d$$

#### Existence Conditions:
A solution exists if and only if:
1. $p_d$ lies within the reachable workspace: $p_d \in \mathcal{W}_R$.
2. For 6-DoF arms where orientation is specified, $(p_d, R_d)$ must lie within the dextrous workspace: $(p_d, R_d) \in \mathcal{W}_D$.

### 3.2 Kinematic Decoupling Architecture (Pieper's Criterion)
When a 6-DoF manipulator possesses a spherical wrist (axes 4, 5, and 6 intersecting at point $p_w$), the forward kinematics can be decoupled into two independent subproblems:

```
                            Desired Pose T_d = (R_d, p_d)
                                          │
                                          ▼
                      Step 1: Compute Wrist Center Position
                              p_w = p_d - d_6 * R_d * [0, 0, 1]^T
                                          │
                                          ▼
                      Step 2: Solve Position Joints (q1, q2, q3)
                              Algebraic / Geometric solution using p_w
                                          │
                                          ▼
                      Step 3: Compute Base Rotation R_0^3(q1, q2, q3)
                                          │
                                          ▼
                      Step 4: Solve Wrist Orientation (q4, q5, q6)
                              R_3^6 = (R_0^3)^T * R_d
                              Extract Euler angles from R_3^6
```

#### Step 1: Wrist Center Isolation
Because the final joint axis $z_5$ lies along the tool approach vector $a = R_d [0, 0, 1]^T$, and the tool tip is offset from the wrist center by distance $d_6$ along $z_5$:
$$p_d = p_w + d_6 R_d \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \implies p_w = p_d - d_6 \begin{bmatrix} a_x \\ a_y \\ a_z \end{bmatrix}$$
Crucially, $p_w$ is completely unaffected by wrist joint rotations $q_4, q_5, q_6$. It depends **only** on the first three joint variables $(q_1, q_2, q_3)$.

#### Step 2: Inverse Position
Solve the 3-DoF subchain for $(q_1, q_2, q_3)$ such that its end-effector reaches $p_w = [x_w, y_w, z_w]^T$. This yields up to 4 solutions (Shoulder Left/Right $\times$ Elbow Up/Down).

#### Step 3: Inverse Orientation
With $(q_1, q_2, q_3)$ known, evaluate the forward rotation matrix $R_0^3(q_1, q_2, q_3)$.
Because $R_d = R_0^3 R_3^6$, pre-multiplying by $(R_0^3)^T$ isolates the wrist rotation matrix:
$$R_3^6 = (R_0^3)^T R_d$$
For a spherical wrist with $Z-Y-Z$ Euler geometry:
$$R_3^6 = R_z(q_4) R_y(q_5) R_z(q_6)$$
Extracting Euler angles from $R_3^6$ yields 2 wrist solutions (Wrist Non-Flipped vs. Wrist Flipped), bringing the total number of distinct solutions to:
$$N_{\text{solutions}} = 2 (\text{Shoulder}) \times 2 (\text{Elbow}) \times 2 (\text{Wrist}) = 8$$

---

### 3.3 Planar 2-Link Arm Closed-Form Derivation
Consider a 2-link planar arm with link lengths $L_1, L_2$ and target Cartesian coordinates $(x, y)$.

```
                           (x, y) End-Effector
                             ▲
                            /
                        L₂ /   θ₂ (Elbow Angle)
                          / )
                         ● ───────────────
                        /
                    L₁ /
                      /  θ₁ (Shoulder Angle)
                     / )
                    ● ──────────────────▶ x
                  (0,0) Base
```

#### Step 1: Law of Cosines for Elbow Joint $\theta_2$
In the triangle formed by the base $(0, 0)$, elbow joint, and end-effector $(x, y)$:
- The sides have lengths $L_1$, $L_2$, and $r = \sqrt{x^2 + y^2}$.
- The interior angle at the elbow is $\pi - \theta_2$.
By the Law of Cosines:
$$r^2 = x^2 + y^2 = L_1^2 + L_2^2 - 2 L_1 L_2 \cos(\pi - \theta_2) = L_1^2 + L_2^2 + 2 L_1 L_2 \cos\theta_2$$
Solving for $\cos\theta_2$:
$$\cos\theta_2 = D = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}$$

#### Reachability Clamping:
For physical reachability, $D$ must satisfy:
$$-1.0 \le D \le +1.0$$
If $|D| > 1.0$, the target lies outside the reachable workspace annulus ($r > L_1 + L_2$ or $r < |L_1 - L_2|$). In software, $D$ must be clamped to $[-1.0, 1.0]$ to prevent domain errors in trigonometric functions.

#### Step 2: The Two Elbow Branches
Using the Pythagorean identity $\sin^2\theta_2 + \cos^2\theta_2 = 1$:
$$\sin\theta_2 = \pm\sqrt{1 - D^2}$$
Applying the four-quadrant arctangent $\operatorname{atan2}$:
$$\theta_2 = \operatorname{atan2}\left(\pm\sqrt{1 - D^2}, D\right)$$
- Positive sign ($+\sqrt{1 - D^2}$): **Elbow-Down Configuration** ($\theta_2 > 0$).
- Negative sign ($-\sqrt{1 - D^2}$): **Elbow-Up Configuration** ($\theta_2 < 0$).

#### Step 3: Shoulder Joint $\theta_1$
Using angle difference identities:
Let $\beta = \operatorname{atan2}(y, x)$ be the polar angle of the target.
Let $\psi = \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$ be the angle formed by link 1 and line $r$.
Then:
$$\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$$

---

### 3.4 Planar 3-Link Arm with Specified Orientation
Consider a 3-link planar arm with link lengths $L_1, L_2, L_3$ tasked with reaching position $(x, y)$ with end-effector pitch angle $\phi = \theta_1 + \theta_2 + \theta_3$.

1. The wrist joint $(x_w, y_w)$ is located by moving backward along the orientation angle $\phi$:
   $$x_w = x - L_3\cos\phi, \quad y_w = y - L_3\sin\phi$$
2. Solve the 2-link problem for $(x_w, y_w)$ with link lengths $L_1, L_2$ to find $\theta_1$ and $\theta_2$.
3. Compute the final joint angle directly from orientation conservation:
   $$\theta_3 = \phi - \theta_1 - \theta_2$$

---

## 4. Computational Realization & Algorithmic Implementation

Below is a robust TypeScript implementation of the analytical inverse kinematics solver with domain clamping and branch selection:

```typescript
export interface Planar2RSolutions {
  elbowUp: { theta1: number; theta2: number };
  elbowDown: { theta1: number; theta2: number };
  isReachable: boolean;
}

export class AnalyticalIK {
  /**
   * Solves closed-form inverse kinematics for a 2-link planar arm.
   * Includes boundary clamping to prevent NaN on unreachable targets.
   */
  public static solve2R(L1: number, L2: number, x: number, y: number): Planar2RSolutions {
    const rSq = x * x + y * y;
    const r = Math.sqrt(rSq);

    // Workspace boundary check
    const maxReach = L1 + L2;
    const minReach = Math.abs(L1 - L2);
    let isReachable = true;

    // D = cos(theta2)
    let D = (rSq - L1 * L1 - L2 * L2) / (2 * L1 * L2);

    if (D > 1.0) {
      D = 1.0;
      isReachable = false;
    } else if (D < -1.0) {
      D = -1.0;
      isReachable = false;
    }

    // Branch 1: Elbow Down (sin(theta2) > 0)
    const sinTheta2_down = Math.sqrt(Math.max(0, 1.0 - D * D));
    const theta2_down = Math.atan2(sinTheta2_down, D);
    const theta1_down = Math.atan2(y, x) - Math.atan2(L2 * sinTheta2_down, L1 + L2 * D);

    // Branch 2: Elbow Up (sin(theta2) < 0)
    const sinTheta2_up = -sinTheta2_down;
    const theta2_up = Math.atan2(sinTheta2_up, D);
    const theta1_up = Math.atan2(y, x) - Math.atan2(L2 * sinTheta2_up, L1 + L2 * D);

    return {
      elbowDown: { theta1: theta1_down, theta2: theta2_down },
      elbowUp: { theta1: theta1_up, theta2: theta2_up },
      isReachable
    };
  }

  /**
   * Extracts Z-Y-Z Euler angles for a spherical wrist from rotation matrix R_3_6.
   * R_3_6 = Rz(q4) * Ry(q5) * Rz(q6)
   */
  public static solveSphericalWrist(R: number[][]): { sol1: number[]; sol2: number[] } {
    const r13 = R[0][2];
    const r23 = R[1][2];
    const r33 = R[2][2];
    const r31 = R[2][0];
    const r32 = R[2][1];

    // Singularity check: sin(q5) == 0 -> q5 = 0 or pi
    if (Math.abs(r33) > 0.999999) {
      // Singularity: axes 4 and 6 are collinear.
      // Arbitrarily set q4 = 0 and solve q6
      const q5 = r33 > 0 ? 0 : Math.PI;
      const q4 = 0;
      const q6 = Math.atan2(R[1][0], R[0][0]);
      return { sol1: [q4, q5, q6], sol2: [q4, q5, q6] };
    }

    // Solution 1: q5 in (0, pi)
    const q5_1 = Math.atan2(Math.sqrt(r13 * r13 + r23 * r23), r33);
    const q4_1 = Math.atan2(r23, r13);
    const q6_1 = Math.atan2(r32, -r31);

    // Solution 2: q5 in (-pi, 0) (Wrist flipped)
    const q5_2 = Math.atan2(-Math.sqrt(r13 * r13 + r23 * r23), r33);
    const q4_2 = Math.atan2(-r23, -r13);
    const q6_2 = Math.atan2(-r32, r31);

    return {
      sol1: [q4_1, q5_1, q6_1],
      sol2: [q4_2, q5_2, q6_2]
    };
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 5.1: Planar 2R Arm Inverse Kinematics for a General Target
**Problem Statement:** A 2R planar manipulator has link lengths $L_1 = 1.2\text{ m}$ and $L_2 = 1.0\text{ m}$. Compute both the elbow-down and elbow-up inverse kinematics solutions for the target position $(x, y) = (1.5, 0.8)\text{ m}$.

**Given Data:**
- $L_1 = 1.2, L_2 = 1.0$
- $x = 1.5, y = 0.8$

**Step-by-Step Derivation:**
1. Compute the squared radial distance $r^2$:
   $$r^2 = x^2 + y^2 = 1.5^2 + 0.8^2 = 2.25 + 0.64 = 2.89\text{ m}^2$$
   $$r = \sqrt{2.89} = 1.7\text{ m}$$
2. Compute $D = \cos\theta_2$:
   $$D = \frac{r^2 - L_1^2 - L_2^2}{2 L_1 L_2} = \frac{2.89 - 1.2^2 - 1.0^2}{2(1.2)(1.0)} = \frac{2.89 - 1.44 - 1.00}{2.4} = \frac{0.45}{2.4} = 0.1875$$
3. Check reachability:
   $$|D| = 0.1875 \le 1.0 \quad (\text{Target is fully reachable!})$$
4. Compute the two elbow angles $\theta_2$:
   $$\sin\theta_2 = \pm\sqrt{1 - D^2} = \pm\sqrt{1 - (0.1875)^2} = \pm\sqrt{1 - 0.035156} = \pm\sqrt{0.964844} \approx \pm 0.982265$$
   - Branch 1 (Elbow-Down, $\sin\theta_2 > 0$):
     $$\theta_2^{(1)} = \operatorname{atan2}(+0.982265, 0.1875) \approx +1.382025\text{ rad} = +79.185^\circ$$
   - Branch 2 (Elbow-Up, $\sin\theta_2 < 0$):
     $$\theta_2^{(2)} = \operatorname{atan2}(-0.982265, 0.1875) \approx -1.382025\text{ rad} = -79.185^\circ$$
5. Compute the shoulder angle $\theta_1$:
   First, find the polar angle of the target:
   $$\operatorname{atan2}(y, x) = \operatorname{atan2}(0.8, 1.5) \approx 0.490049\text{ rad} = 28.072^\circ$$
   - For Branch 1 ($\theta_2 = +1.382025$):
     $$\operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2) = \operatorname{atan2}(1.0(0.982265), 1.2 + 1.0(0.1875)) = \operatorname{atan2}(0.982265, 1.3875) \approx 0.615822\text{ rad} = 35.284^\circ$$
     $$\theta_1^{(1)} = 0.490049 - 0.615822 = -0.125773\text{ rad} = -7.206^\circ$$
   - For Branch 2 ($\theta_2 = -1.382025$):
     $$\operatorname{atan2}(L_2(-0.982265), L_1 + L_2\cos\theta_2) = \operatorname{atan2}(-0.982265, 1.3875) \approx -0.615822\text{ rad}$$
     $$\theta_1^{(2)} = 0.490049 - (-0.615822) = +1.105871\text{ rad} = +63.361^\circ$$

**Final Answer:**
1. **Branch 1 (Elbow-Down):** $\theta_1 = -0.1258\text{ rad} \; (-7.21^\circ), \; \theta_2 = +1.3820\text{ rad} \; (+79.19^\circ)$
2. **Branch 2 (Elbow-Up):** $\theta_1 = +1.1059\text{ rad} \; (+63.36^\circ), \; \theta_2 = -1.3820\text{ rad} \; (-79.19^\circ)$

**Verification & Sanity Check:**
- Forward Kinematics for Branch 1:
  $x = 1.2\cos(-0.1258) + 1.0\cos(-0.1258 + 1.3820) = 1.2(0.9921) + 1.0\cos(1.2562) = 1.1905 + 0.3095 = 1.5000\text{ m}$.
  $y = 1.2\sin(-0.1258) + 1.0\sin(1.2562) = 1.2(-0.1254) + 1.0(0.9509) = -0.1505 + 0.9509 = 0.8004\text{ m}$.
Matches $(1.5, 0.8)$ to 4 decimal places.

---

### Problem 5.2: Boundary Reach Inverse Kinematics
**Problem Statement:** A 2R planar manipulator with $L_1 = 1.5\text{ m}$ and $L_2 = 1.0\text{ m}$ is commanded to reach $(x, y) = (2.5, 0.0)\text{ m}$. Find all solutions.

**Given Data:**
- $r = \sqrt{2.5^2 + 0^2} = 2.5\text{ m}$.
- $L_1 + L_2 = 1.5 + 1.0 = 2.5\text{ m}$.

**Step-by-Step Derivation:**
1. Compute $D$:
   $$D = \frac{2.5^2 - 1.5^2 - 1.0^2}{2(1.5)(1.0)} = \frac{6.25 - 2.25 - 1.00}{3.0} = \frac{3.0}{3.0} = 1.0$$
2. Since $D = 1.0$:
   $$\sin\theta_2 = \pm\sqrt{1 - 1^2} = 0 \implies \theta_2 = 0^\circ$$
   The two branches (elbow-up and elbow-down) coalesce into a single unique boundary configuration!
3. Compute $\theta_1$:
   $$\theta_1 = \operatorname{atan2}(0, 2.5) - \operatorname{atan2}(0, 1.5 + 1.0) = 0 - 0 = 0^\circ$$

**Final Answer:**
Unique solution: **$\theta_1 = 0.0\text{ rad} \; (0^\circ), \; \theta_2 = 0.0\text{ rad} \; (0^\circ)$**.

**Verification & Sanity Check:**
When $\theta_2 = 0$, the arm is fully extended in a straight line along the $+x$-axis of length $L_1 + L_2 = 2.5\text{ m}$.

---

### Problem 5.3: Internal Boundary Reach (Arm Fully Folded)
**Problem Statement:** For the arm in Problem 5.2 ($L_1 = 1.5\text{ m}, L_2 = 1.0\text{ m}$), find the inverse kinematics solution for target $(x, y) = (0.0, 0.5)\text{ m}$.

**Given Data:**
- $r = \sqrt{0^2 + 0.5^2} = 0.5\text{ m}$.
- $|L_1 - L_2| = |1.5 - 1.0| = 0.5\text{ m}$.

**Step-by-Step Derivation:**
1. Compute $D$:
   $$D = \frac{0.5^2 - 1.5^2 - 1.0^2}{2(1.5)(1.0)} = \frac{0.25 - 2.25 - 1.00}{3.0} = \frac{-3.0}{3.0} = -1.0$$
2. Since $D = -1.0$:
   $$\sin\theta_2 = 0 \implies \theta_2 = \pi\text{ rad} = 180^\circ$$
3. Compute $\theta_1$:
   $$\operatorname{atan2}(y, x) = \operatorname{atan2}(0.5, 0) = \frac{\pi}{2} = 90^\circ$$
   $$\operatorname{atan2}(L_2\sin\pi, L_1 + L_2\cos\pi) = \operatorname{atan2}(0, 1.5 - 1.0) = \operatorname{atan2}(0, 0.5) = 0$$
   $$\theta_1 = \frac{\pi}{2} - 0 = \frac{\pi}{2}\text{ rad} = 90^\circ$$

**Final Answer:**
Unique solution: **$\theta_1 = 90^\circ \; (\pi/2\text{ rad}), \; \theta_2 = 180^\circ \; (\pi\text{ rad})$**.

**Verification & Sanity Check:**
Link 1 points vertically up to $(0, 1.5)$. Link 2 folds backward $180^\circ$ by $1.0\text{ m}$ toward the origin, ending at $(0, 1.5 - 1.0) = (0, 0.5)$, exactly the target.

---

### Problem 5.4: Target Out of Reach and Domain Clamping
**Problem Statement:** An autonomous robot arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is commanded by a faulty vision pipeline to reach $(x, y) = (2.1, 0.5)\text{ m}$.
1. Show that unconstrained calculation causes a mathematical failure (`NaN`).
2. Demonstrate how boundary clamping projects the target to the nearest reachable configuration.

**Given Data:**
- $r = \sqrt{2.1^2 + 0.5^2} = \sqrt{4.41 + 0.25} = \sqrt{4.66} \approx 2.1587\text{ m}$.
- $L_1 + L_2 = 2.0\text{ m} < 2.1587\text{ m}$.

**Step-by-Step Derivation:**
1. Evaluate $D$ without clamping:
   $$D = \frac{4.66 - 1.0 - 1.0}{2(1.0)(1.0)} = \frac{2.66}{2.0} = 1.33$$
2. In raw floating-point code:
   $$\sin\theta_2 = \sqrt{1 - D^2} = \sqrt{1 - 1.33^2} = \sqrt{1 - 1.7689} = \sqrt{-0.7689} \implies \text{NaN}$$
   Computing $\operatorname{atan2}(\text{NaN}, 1.33)$ produces `NaN`, causing the motor control loop to crash!
3. Robust Clamping Protocol:
   Clamp $D$ to the valid physical domain $[-1.0, 1.0]$:
   $$D_{\text{clamped}} = \min(1.0, \max(-1.0, 1.33)) = 1.0$$
4. With $D = 1.0$:
   $$\theta_2 = 0.0\text{ rad}$$
5. Compute shoulder angle $\theta_1$:
   $$\theta_1 = \operatorname{atan2}(0.5, 2.1) - \operatorname{atan2}(0, 2.0) = \operatorname{atan2}(0.5, 2.1) \approx 0.2339\text{ rad} = 13.40^\circ$$

**Final Answer:**
- Unclamped result: **`NaN` error (crash)**.
- Clamped projected solution: **$\theta_1 = 0.2339\text{ rad} \; (13.40^\circ), \; \theta_2 = 0.0\text{ rad} \; (0^\circ)$**.
- The arm points directly toward the target at maximum possible reach ($r = 2.0\text{ m}$).

**Verification & Sanity Check:**
The end-effector reaches $(2.0\cos(13.4^\circ), 2.0\sin(13.4^\circ)) = (1.945, 0.464)$, which minimizes the Euclidean distance $\|p - p_{\text{target}}\|$ to the unreachable goal.

---

### Problem 5.5: Planar 3-Link Arm with Specified Orientation
**Problem Statement:** A 3-link planar manipulator with $L_1 = 1.0\text{ m}, L_2 = 0.8\text{ m}, L_3 = 0.4\text{ m}$ must position its tool tip at $(x, y) = (1.6, 1.0)\text{ m}$ with end-effector orientation $\phi = 30^\circ = \frac{\pi}{6}\text{ rad}$. Compute the elbow-down inverse kinematics solution.

**Given Data:**
- Target: $x = 1.6, y = 1.0, \phi = \pi/6$
- $\cos(30^\circ) = 0.866025, \sin(30^\circ) = 0.500000$

**Step-by-Step Derivation:**
1. Compute the wrist joint position $(x_w, y_w)$:
   $$x_w = x - L_3\cos\phi = 1.6 - 0.4(0.866025) = 1.6 - 0.346410 = 1.253590\text{ m}$$
   $$y_w = y - L_3\sin\phi = 1.0 - 0.4(0.500000) = 1.0 - 0.200000 = 0.800000\text{ m}$$
2. Solve 2-link IK for $(x_w, y_w)$ with $L_1 = 1.0, L_2 = 0.8$:
   $$r_w^2 = 1.253590^2 + 0.8^2 = 1.571488 + 0.64 = 2.211488$$
   $$D = \frac{r_w^2 - L_1^2 - L_2^2}{2 L_1 L_2} = \frac{2.211488 - 1.0^2 - 0.8^2}{2(1.0)(0.8)} = \frac{2.211488 - 1.0 - 0.64}{1.6} = \frac{0.571488}{1.6} \approx 0.357180$$
3. Elbow angle $\theta_2$ (elbow-down):
   $$\sin\theta_2 = +\sqrt{1 - 0.357180^2} = +\sqrt{1 - 0.127578} = +\sqrt{0.872422} \approx 0.934035$$
   $$\theta_2 = \operatorname{atan2}(0.934035, 0.357180) \approx 1.205634\text{ rad} = 69.077^\circ$$
4. Shoulder angle $\theta_1$:
   $$\operatorname{atan2}(y_w, x_w) = \operatorname{atan2}(0.800000, 1.253590) \approx 0.568340\text{ rad} = 32.564^\circ$$
   $$\operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2) = \operatorname{atan2}(0.8(0.934035), 1.0 + 0.8(0.357180)) = \operatorname{atan2}(0.747228, 1.285744) \approx 0.526279\text{ rad} = 30.154^\circ$$
   $$\theta_1 = 0.568340 - 0.526279 = 0.042061\text{ rad} = 2.410^\circ$$
5. Wrist angle $\theta_3$:
   $$\theta_3 = \phi - \theta_1 - \theta_2 = \frac{\pi}{6} - 0.042061 - 1.205634 = 0.523599 - 1.247695 = -0.724096\text{ rad} = -41.488^\circ$$

**Final Answer:**
- $\theta_1 = +0.0421\text{ rad} \; (+2.41^\circ)$
- $\theta_2 = +1.2056\text{ rad} \; (+69.08^\circ)$
- $\theta_3 = -0.7241\text{ rad} \; (-41.49^\circ)$

**Verification & Sanity Check:**
- Orientation check: $\theta_1 + \theta_2 + \theta_3 = 0.0421 + 1.2056 - 0.7241 = 0.5236\text{ rad} = 30^\circ = \phi$.
- Position check: $x = 1.0\cos(0.0421) + 0.8\cos(1.2477) + 0.4\cos(0.5236) = 0.9991 + 0.2545 + 0.3464 = 1.6000\text{ m}$. Exact!

---

### Problem 5.6: Spherical Wrist Center Isolation
**Problem Statement:** A 6-DoF robot with a spherical wrist is commanded to place its tool tip at position $p_d = [0.60, 0.40, 0.30]^T\text{ m}$ with tool approach orientation pointing along base $-\hat{z}$: $a = [0, 0, -1]^T$. The tool length from wrist center to tip is $d_6 = 0.12\text{ m}$. Calculate the 3D coordinates of the wrist center $p_w$.

**Given Data:**
- $p_d = [0.60, 0.40, 0.30]^T$
- $a = [0, 0, -1]^T$
- $d_6 = 0.12\text{ m}$

**Step-by-Step Derivation:**
1. Wrist center isolation formula:
   $$p_w = p_d - d_6 a$$
2. Substitute the approach vector:
   $$p_w = \begin{bmatrix} 0.60 \\ 0.40 \\ 0.30 \end{bmatrix} - 0.12 \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 0.60 \\ 0.40 \\ 0.30 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 0.12 \end{bmatrix} = \begin{bmatrix} 0.60 \\ 0.40 \\ 0.42 \end{bmatrix}\text{ m}$$

**Final Answer:**
The wrist center coordinates are **$p_w = [0.60, 0.40, 0.42]^T\text{ m}$**.

**Verification & Sanity Check:**
Since the tool points vertically down ($a = -\hat{z}$), the wrist center holding the tool must be located directly above the tool tip by distance $d_6$: $0.30 + 0.12 = 0.42\text{ m}$.

---

### Problem 5.7: Solving Spherical Wrist Euler Angles
**Problem Statement:** The relative rotation matrix between link 3 and the end-effector tool is computed to be:
$$R_3^6 = \begin{bmatrix} 0 & 0 & 1 \\ 0.707107 & -0.707107 & 0 \\ 0.707107 & 0.707107 & 0 \end{bmatrix}$$
Extract the two sets of $Z-Y-Z$ Euler angles $(\theta_4, \theta_5, \theta_6)$ representing the non-flipped and flipped wrist configurations.

**Given Data:**
- Matrix entries: $r_{13} = 1, r_{23} = 0, r_{33} = 0, r_{31} = 1/\sqrt{2}, r_{32} = 1/\sqrt{2}$.

**Step-by-Step Derivation:**
1. Analytical $Z-Y-Z$ Euler rotation matrix:
   $$R_3^6 = \begin{bmatrix} \cos\theta_4\cos\theta_5\cos\theta_6 - \sin\theta_4\sin\theta_6 & -\cos\theta_4\cos\theta_5\sin\theta_6 - \sin\theta_4\cos\theta_6 & \cos\theta_4\sin\theta_5 \\ \sin\theta_4\cos\theta_5\cos\theta_6 + \cos\theta_4\sin\theta_6 & -\sin\theta_4\cos\theta_5\sin\theta_6 + \cos\theta_4\cos\theta_6 & \sin\theta_4\sin\theta_5 \\ -\sin\theta_5\cos\theta_6 & \sin\theta_5\sin\theta_6 & \cos\theta_5 \end{bmatrix}$$
2. Solve for wrist pitch $\theta_5$:
   From $r_{33} = \cos\theta_5 = 0$:
   - Branch 1 ($\sin\theta_5 > 0$):
     $$\theta_5^{(1)} = +90^\circ = +\frac{\pi}{2}\text{ rad}$$
   - Branch 2 ($\sin\theta_5 < 0$, Wrist-Flipped):
     $$\theta_5^{(2)} = -90^\circ = -\frac{\pi}{2}\text{ rad}$$
3. For Branch 1 ($\theta_5 = +90^\circ, \sin\theta_5 = 1$):
   - From $r_{13} = \cos\theta_4\sin\theta_5 = \cos\theta_4 = 1$:
     $$\theta_4 = \operatorname{atan2}(r_{23}, r_{13}) = \operatorname{atan2}(0, 1) = 0^\circ$$
   - From $r_{32} = \sin\theta_5\sin\theta_6 = \sin\theta_6 = 0.707107$:
     $$-r_{31} = \sin\theta_5\cos\theta_6 = \cos\theta_6 = -0.707107$:
     $$\theta_6 = \operatorname{atan2}(r_{32}, -r_{31}) = \operatorname{atan2}(0.707107, -0.707107) = 135^\circ = \frac{3\pi}{4}\text{ rad}$$
4. For Branch 2 ($\theta_5 = -90^\circ, \sin\theta_5 = -1$):
   - $\theta_4 = \operatorname{atan2}(-r_{23}, -r_{13}) = \operatorname{atan2}(0, -1) = 180^\circ = \pi\text{ rad}$
   - $\theta_6 = \operatorname{atan2}(-r_{32}, r_{31}) = \operatorname{atan2}(-0.707107, 0.707107) = -45^\circ = -\frac{\pi}{4}\text{ rad}$

**Final Answer:**
1. **Solution 1 (Non-Flipped):** $\theta_4 = 0^\circ \; (0\text{ rad}), \; \theta_5 = +90^\circ \; (\pi/2\text{ rad}), \; \theta_6 = +135^\circ \; (3\pi/4\text{ rad})$
2. **Solution 2 (Wrist-Flipped):** $\theta_4 = 180^\circ \; (\pi\text{ rad}), \; \theta_5 = -90^\circ \; (-\pi/2\text{ rad}), \; \theta_6 = -45^\circ \; (-\pi/4\text{ rad})$

**Verification & Sanity Check:**
Flipping joint 5 by negating its sign and adding $180^\circ$ to joints 4 and 6 produces the exact same physical tool orientation in 3D space.

---

### Problem 5.8: Wrist Singularity Resolution
**Problem Statement:** A spherical wrist achieves a configuration where $R_3^6 = I_3$ (identity rotation).
1. Show that joint angle extraction produces an indeterminate representation singularity.
2. Formulate the single constraint relating $\theta_4$ and $\theta_6$, and state how control software resolves it.

**Given Data:**
- $R_3^6 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

**Step-by-Step Derivation:**
1. From $r_{33} = \cos\theta_5 = 1 \implies \theta_5 = 0^\circ$.
2. When $\theta_5 = 0$, $\sin\theta_5 = 0$.
   Axes 4 and 6 become collinear! Both joints rotate about the exact same physical axis $z_3 \equiv z_5$.
3. Substitute $\theta_5 = 0$ into the $Z-Y-Z$ matrix:
   $$R_3^6 = R_z(\theta_4) R_y(0) R_z(\theta_6) = R_z(\theta_4) I R_z(\theta_6) = R_z(\theta_4 + \theta_6)$$
   $$\begin{bmatrix} \cos(\theta_4 + \theta_6) & -\sin(\theta_4 + \theta_6) & 0 \\ \sin(\theta_4 + \theta_6) & \cos(\theta_4 + \theta_6) & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
4. The equations only constrain the sum of the angles:
   $$\theta_4 + \theta_6 = 0 \implies \theta_6 = -\theta_4$$
   Individual angles $\theta_4$ and $\theta_6$ are completely indeterminate (infinitely many solutions).
5. Software Convention:
   To avoid commanding erratic motions at singularities, industrial controllers fix one joint to its previous value or set $\theta_4 = 0$ and command $\theta_6 = 0$.

**Final Answer:**
- Constraint: **$\theta_4 + \theta_6 = 0^\circ$**.
- Solution: **$\theta_5 = 0^\circ$**, with **$\theta_4 = 0^\circ, \theta_6 = 0^\circ$** by convention.

**Verification & Sanity Check:**
Any pair satisfying $\theta_6 = -\theta_4$ (e.g., $\theta_4 = 45^\circ, \theta_6 = -45^\circ$) produces $R_z(45^\circ) R_z(-45^\circ) = I$, mathematically confirmed.

---

### Problem 5.9: SCARA Robot Analytical Inverse Kinematics
**Problem Statement:** A 4-DoF SCARA robot has link lengths $a_1 = 0.4\text{ m}, a_2 = 0.3\text{ m}$, base height $d_1 = 0.5\text{ m}$. Given desired end-effector pose $(x, y, z, \phi) = (0.5, 0.2, 0.15, 45^\circ)$, compute all 4 joint coordinates $(q_1, q_2, q_3, q_4)$.

**Given Data:**
- $a_1 = 0.4, a_2 = 0.3, d_1 = 0.5$
- Target: $x = 0.5, y = 0.2, z = 0.15, \phi = 45^\circ = 0.7854\text{ rad}$

**Step-by-Step Derivation:**
1. Vertical Quill Prismatic Joint $d_3$:
   From forward kinematics: $z = d_1 - d_3$:
   $$d_3 = d_1 - z = 0.5 - 0.15 = 0.35\text{ m}$$
2. Horizontal 2-link subchain for $(x, y) = (0.5, 0.2)$:
   $$r^2 = 0.5^2 + 0.2^2 = 0.25 + 0.04 = 0.29$$
   $$D = \frac{0.29 - 0.4^2 - 0.3^2}{2(0.4)(0.3)} = \frac{0.29 - 0.16 - 0.09}{0.24} = \frac{0.04}{0.24} = 0.166667$$
3. Elbow angle $q_2$:
   $$\sin q_2 = +\sqrt{1 - (0.166667)^2} = +\sqrt{1 - 0.027778} = \sqrt{0.972222} \approx 0.986013$$
   $$q_2 = \operatorname{atan2}(0.986013, 0.166667) \approx 1.403348\text{ rad} = 80.406^\circ$$
4. Shoulder angle $q_1$:
   $$\operatorname{atan2}(0.2, 0.5) \approx 0.380506\text{ rad}$$
   $$\operatorname{atan2}(0.3(0.986013), 0.4 + 0.3(0.166667)) = \operatorname{atan2}(0.295804, 0.450000) \approx 0.581566\text{ rad}$$
   $$q_1 = 0.380506 - 0.581566 = -0.201060\text{ rad} = -11.520^\circ$$
5. Wrist Roll Joint $q_4$:
   From forward orientation: $\phi = q_1 + q_2 + q_4$:
   $$q_4 = \phi - q_1 - q_2 = 0.785398 - (-0.201060) - 1.403348 = 0.785398 + 0.201060 - 1.403348 = -0.416890\text{ rad} = -23.886^\circ$$

**Final Answer:**
- $q_1 = -0.2011\text{ rad} \; (-11.52^\circ)$
- $q_2 = +1.4033\text{ rad} \; (+80.41^\circ)$
- $d_3 = 0.3500\text{ m}$
- $q_4 = -0.4169\text{ rad} \; (-23.89^\circ)$

**Verification & Sanity Check:**
- $z = 0.5 - 0.35 = 0.15\text{ m}$.
- $x = 0.4\cos(-0.2011) + 0.3\cos(1.2023) = 0.3919 + 0.1081 = 0.5000\text{ m}$. Perfect match.

---

### Problem 5.10: The Eight Kinematic Branches of an Anthropomorphic 6-DoF Arm
**Problem Statement:** Formulate the tree of 8 discrete solutions for a PUMA 560 robot with spherical wrist.

**Given Data:**
- 6-DoF serial arm satisfying Pieper's criterion.

**Step-by-Step Derivation:**
1. **Shoulder Sub-Tree (Waist $q_1$):**
   - Solution A: Shoulder Left ($q_1 = \operatorname{atan2}(y_w, x_w) - \alpha$)
   - Solution B: Shoulder Right ($q_1' = q_1 + \pi$)
2. **Elbow Sub-Tree (Elbow $q_3$ and Shoulder Pitch $q_2$):**
   For each shoulder choice:
   - Branch 1: Elbow Down ($q_3 > 0$)
   - Branch 2: Elbow Up ($q_3 < 0$)
   This yields $2 \times 2 = 4$ position configurations for $(q_1, q_2, q_3)$.
3. **Wrist Sub-Tree (Wrist $q_4, q_5, q_6$):**
   For each of the 4 position configurations:
   - Option 1: Wrist Normal ($q_5 > 0$)
   - Option 2: Wrist Flipped ($q_5' = -q_5, q_4' = q_4 + \pi, q_6' = q_6 + \pi$)
4. Total configurations:
   $$2 \times 2 \times 2 = 8\text{ solutions}$$

**Final Answer:**
The eight distinct operational configurations are:
1. Shoulder Left, Elbow Down, Wrist Normal
2. Shoulder Left, Elbow Down, Wrist Flipped
3. Shoulder Left, Elbow Up, Wrist Normal
4. Shoulder Left, Elbow Up, Wrist Flipped
5. Shoulder Right, Elbow Down, Wrist Normal
6. Shoulder Right, Elbow Down, Wrist Flipped
7. Shoulder Right, Elbow Up, Wrist Normal
8. Shoulder Right, Elbow Up, Wrist Flipped

**Verification & Sanity Check:**
All 8 mathematical configurations place the physical tool frame at the exact same location $T_d$ in world space.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 5.11: Stanford Arm Closed-Form Inverse Kinematics
**Problem Statement:** Derive the analytical inverse kinematics for the Stanford Arm (joints 1, 2 revolute, joint 3 prismatic, joints 4, 5, 6 spherical wrist) for reaching wrist center $p_w = [x_w, y_w, z_w]^T$ with base offset $D_2$.

**Solution:**
1. Joint 1 (Waist roll):
   In the $xy$-plane, the shoulder offset $D_2$ is perpendicular to link 1:
   $$r^2 = x_w^2 + y_w^2$$
   $$q_1 = \operatorname{atan2}(y_w, x_w) - \operatorname{atan2}(D_2, \pm\sqrt{r^2 - D_2^2})$$
2. Joint 2 (Shoulder pitch):
   $$q_2 = \operatorname{atan2}\left( \pm\sqrt{x_w^2 + y_w^2 - D_2^2}, z_w \right)$$
3. Joint 3 (Prismatic boom reach):
   $$d_3 = \sqrt{x_w^2 + y_w^2 - D_2^2 + z_w^2}$$
4. Joints 4, 5, 6 are extracted from $R_3^6 = (R_0^3)^T R_d$ via spherical wrist Euler formulas.

---

### Problem 5.12: Cylindrical Robot (RPP) Inverse Kinematics
**Problem Statement:** Derive the closed-form inverse kinematics for a cylindrical robot tasked with target $p = [x, y, z]^T$.

**Solution:**
1. Base revolute angle:
   $$\theta_1 = \operatorname{atan2}(y, x)$$
2. Vertical lift prismatic extension:
   $$d_2 = z$$
3. Radial prismatic extension:
   $$d_3 = \sqrt{x^2 + y^2}$$

---

### Problem 5.13: Optimal Solution Branch Selection via Minimum Joint Travel
**Problem Statement:** A robot is currently at $q_{\text{current}} = [10^\circ, 45^\circ, -30^\circ]^T$. Analytical IK yields two candidate solutions:
- $q_A = [12^\circ, 48^\circ, -28^\circ]^T$
- $q_B = [190^\circ, -45^\circ, 150^\circ]^T$
Using the weighted distance metric $C(q) = \sum_{i=1}^3 (q_i - q_i^{\text{current}})^2$, select the optimal branch.

**Solution:**
1. Cost for Solution A:
   $$\Delta q_A = [12-10, 48-45, -28-(-30)] = [2, 3, 2]^\circ$$
   $$C(q_A) = 2^2 + 3^2 + 2^2 = 4 + 9 + 4 = 17\text{ deg}^2$$
2. Cost for Solution B:
   $$\Delta q_B = [190-10, -45-45, 150-(-30)] = [180, -90, 180]^\circ$$
   $$C(q_B) = 180^2 + (-90)^2 + 180^2 = 32400 + 8100 + 32400 = 72900\text{ deg}^2$$
3. Solution A is selected because it minimizes actuator travel and energy consumption.

---

### Problem 5.14: Joint Limit Filtering on Analytical IK Solutions
**Problem Statement:** An IK solver returns 4 mathematical solutions. Link 2 has mechanical limits $-60^\circ \le q_2 \le +60^\circ$. The 4 solutions have $q_2 \in \{ +75^\circ, +45^\circ, -80^\circ, -15^\circ \}$. Filter the candidates.

**Solution:**
1. Solution 1 ($q_2 = 75^\circ$): Violates upper limit ($75 > 60$). Discarded.
2. Solution 2 ($q_2 = 45^\circ$): Within limits ($-60 \le 45 \le 60$). **Valid**.
3. Solution 3 ($q_2 = -80^\circ$): Violates lower limit ($-80 < -60$). Discarded.
4. Solution 4 ($q_2 = -15^\circ$): Within limits ($-60 \le -15 \le 60$). **Valid**.
5. Only Solutions 2 and 4 are physically executable by the robot.

---

### Problem 5.15: Analytical IK with Restricted Elbow Motion
**Problem Statement:** A planar 2R arm has mechanical physical stops restricting the elbow joint to strictly negative angles: $-150^\circ \le \theta_2 \le 0^\circ$ (elbow-up only). Formulate the single-branched IK algorithm.

**Solution:**
1. Compute $D = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}$.
2. If $|D| > 1.0$, clamp or return unreachable.
3. Because $\theta_2$ must be negative, discard the $+\sqrt{1 - D^2}$ branch:
   $$\sin\theta_2 = -\sqrt{1 - D^2}$$
   $$\theta_2 = \operatorname{atan2}(-\sqrt{1 - D^2}, D)$$
4. Verify $\theta_2 \ge -150^\circ$; if true, compute $\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$.

---

### Problem 5.16: Pieper's Criterion with Three Parallel Axes
**Problem Statement:** Show why a 6-DoF robot with three consecutive parallel axes (e.g., joints 2, 3, 4 parallel) satisfies Pieper's criterion for closed-form solvability.

**Solution:**
1. When joints 2, 3, 4 have parallel axes, they act as a planar 3R mechanism operating in a plane perpendicular to the joint axes.
2. The distance from joint 1 to the end-effector depends only on joint 1 and the planar subchain.
3. Joint 1 can be solved independently from the lateral projection of the target.
4. Joints 2, 3, 4 reduce to the solvable 3-link planar inverse kinematics problem.
5. Joints 5 and 6 orient the final link. Hence, the system is algebraically decoupled and solvable in closed form.

---

### Problem 5.17: Raghavan & Roth 16th-Degree Polynomial Overview
**Problem Statement:** Explain why general 6R manipulators that do not satisfy Pieper's criterion require solving a 16th-degree polynomial.

**Solution:**
1. Without intersecting or parallel axes, position and orientation cannot be decoupled into separate $3 \times 3$ systems.
2. The 6 kinematic equations $T_0^6(q) = T_d$ form a system of multi-variable non-linear trigonometric polynomials.
3. Using tangent half-angle substitution $u_i = \tan(q_i / 2)$, each trigonometric term becomes a rational algebraic fraction.
4. Eliminating 5 of the variables through dialytic elimination yields a single univariate polynomial in the remaining variable of degree **16**.
5. By the Abel-Ruffini theorem, polynomials of degree $\ge 5$ cannot be solved by radicals; numerical root-finding (such as eigenvalue companion matrices) is required.

---

### Problem 5.18: Polar Coordinate Robot Analytical IK
**Problem Statement:** A polar coordinate robot has revolute waist $\theta_1$, revolute elevation $\theta_2$, and prismatic reach $r$. Given target $(x, y, z)$, compute the joint variables.

**Solution:**
1. $\theta_1 = \operatorname{atan2}(y, x)$.
2. $\theta_2 = \operatorname{atan2}(z, \sqrt{x^2 + y^2})$.
3. $r = \sqrt{x^2 + y^2 + z^2}$.

---

### Problem 5.19: Inverse Kinematics of a Four-Bar Closed Chain
**Problem Statement:** A planar four-bar closed linkage has links $L_0, L_1, L_2, L_3$. Given input crank angle $\theta_1$, solve for coupler angle $\theta_2$ and follower angle $\theta_3$ using Freudenstein's equation.

**Solution:**
1. Freudenstein's equation:
   $$K_1 \cos\theta_1 - K_2 \cos\theta_3 + K_3 = \cos(\theta_1 - \theta_3)$$
   where $K_1 = L_0 / L_1, K_2 = L_0 / L_3, K_3 = \frac{L_0^2 + L_1^2 - L_2^2 + L_3^2}{2 L_1 L_3}$.
2. Rewrite as $A\cos\theta_3 + B\sin\theta_3 = C$, where $A, B, C$ are functions of $\theta_1$.
3. Substitute $t = \tan(\theta_3 / 2)$ to form a quadratic equation in $t$:
   $$(C - A) t^2 - 2B t + (C + A) = 0$$
4. Solve quadratic equation for $t$, yielding up to 2 distinct assembly modes for $\theta_3$.

---

### Problem 5.20: Round-Trip IK-FK Numerical Verification Protocol
**Problem Statement:** Formulate the mathematical verification condition for validating an analytical inverse kinematics solver.

**Solution:**
For any target pose $T_d \in \mathcal{W}_R$:
1. Compute all candidate inverse solutions $Q = \{ q^{(1)}, q^{(2)}, \dots, q^{(k)} \} = f^{-1}(T_d)$.
2. For each solution $q^{(j)}$, evaluate the forward kinematics $T_j = f(q^{(j)})$.
3. Compute the position error: $\|p_j - p_d\| < 10^{-6}\text{ m}$.
4. Compute the orientation error: $\|R_j^T R_d - I\|_\infty < 10^{-6}$.
5. Every valid solution must reconstruct the target pose $T_d$ to machine precision.
