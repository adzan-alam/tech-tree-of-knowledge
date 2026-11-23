# Chapter 3: The Standard and Modified Denavit-Hartenberg (DH) Conventions

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are asked to write an instruction manual explaining how to assemble and control an articulated robotic arm with six motorized joints. Each joint can twist, tilt, or telescope. To track where the robot's gripper is in space, you must place a coordinate system—an $x, y, z$ reference frame—on every single metal segment (link) along the arm.

If three different engineers are asked to place these coordinate frames without rules, chaos ensues:
- Engineer A places the $z$-axis along the motor shaft of joint 2, but points the $x$-axis sideways toward the ceiling.
- Engineer B places the origin at the center of mass of link 2, and aligns the $z$-axis with the link's longest bone.
- Engineer C places the origin at the elbow hinge, but tilts the axes at an arbitrary $45^\circ$ angle.

Each frame requires 6 numbers (3 position coordinates and 3 Euler angles) to relate to the next frame. For a 6-joint arm, that would mean tracking **36 arbitrary geometric parameters**!

```
     Arbitrary Frames: 6 parameters per link x 6 links = 36 numbers (Chaotic, error-prone)
     DH Convention:    4 parameters per link x 6 links = 24 numbers (Standardized, minimal)
```

In 1955, Jacques Denavit and Richard Hartenberg introduced an ingenious mathematical convention that brought order to this complexity. They proved that if you follow **two strict geometric rules** when attaching coordinate frames to adjacent joints:
1. The $x_i$-axis must be perpendicular to the previous joint's axis $z_{i-1}$.
2. The $x_i$-axis must intersect the previous joint's axis $z_{i-1}$.

Then **only 4 numbers per link** are needed to completely, unambiguously describe the spatial relationship between adjacent frames! These four numbers—link length, link twist, link offset, and joint angle—are the celebrated **Denavit-Hartenberg (DH) parameters**.

---

## 2. Historical Foundations & Epistemological Evolution

The origin of modern robot kinematic notation traces back to the 1955 ASME paper by **Jacques Denavit** (a French engineer) and **Richard S. Hartenberg** (a professor of mechanical engineering at Northwestern University), titled *"A Kinematic Notation for Lower-Pair Mechanisms Based on Matrices"*. Originally developed to analyze closed spatial kinematic linkages, their notation became the global standard for serial robotics during the birth of industrial automation in the 1970s (popularized by Paul's 1981 textbook *Robot Manipulators: Mathematics, Programming, and Control*).

However, as robotics software matured, certain subtle inconveniences of the original "Standard DH" convention became apparent: in Standard DH, coordinate frame $i$ is attached to the *distal* end of link $i$ (at joint $i+1$). Consequently, frame 0 is attached to the base, but joint 1's variable $\theta_1$ appears inside transformation $A_1$.

In 1986, **John J. Craig** introduced the **Modified Denavit-Hartenberg (Modified DH or Craig's DH)** convention in his widely adopted textbook *Introduction to Robotics: Mechanics and Control*. In Craig's convention, coordinate frame $i$ is attached to the *proximal* end of link $i$ (at joint $i$). While both conventions describe identical physical geometry and produce identical end-effector poses, their parameter tables and transformation formulas differ in link indexing. Today, both conventions are widely used: Standard DH is prevalent in academic literature and ROS URDF models, while Modified DH is standard in many industrial controllers and modern multibody dynamics software.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Four Denavit-Hartenberg Parameters
For any two adjacent joint axes in 3D space, there exists a unique line perpendicular to both axes, known as the **common normal**. The DH convention aligns coordinate axes with these joint axes and common normals.

For link $i$ connecting joint $i$ to joint $i+1$, the four kinematic parameters are defined as follows:

| Parameter | Name | Definition | Variable for |
| :---: | :--- | :--- | :---: |
| $a_i$ | **Link Length** | Distance along $x_i$ from $z_{i-1}$ to $z_i$ (length of common normal) | Constant (Link geometry) |
| $\alpha_i$ | **Link Twist** | Angle from $z_{i-1}$ to $z_i$ measured around $x_i$ (right-hand rule) | Constant (Link geometry) |
| $d_i$ | **Link Offset** | Distance along $z_{i-1}$ from $x_{i-1}$ to $x_i$ | Variable if Joint $i$ is **Prismatic** |
| $\theta_i$ | **Joint Angle** | Angle from $x_{i-1}$ to $x_i$ measured around $z_{i-1}$ (right-hand rule) | Variable if Joint $i$ is **Revolute** |

```
                z_{i-1}                     z_i
                   ▲                         ▲
                   │                         │
                   │           a_i           │
                   │◄───────────────────────►│
       ────────────┼─────────────────────────┼────────────▶ x_i
                   │                         │ (Origin O_i)
                   │                         │
                   │                         │
                   │◄─────── d_i ───────────►│
       ────────────┼─────────────────────────┘
                   │
                  x_{i-1}
```

### 3.2 Standard Frame Assignment Algorithm (Standard DH)
To assign coordinate frames $\{0\}, \{1\}, \dots, \{n\}$ to a serial robot with $n$ joints:
1. **Assign $z$-axes:** For each joint $i \in \{1, 2, \dots, n\}$, align axis $z_{i-1}$ with the axis of motion (axis of rotation for revolute; axis of translation for prismatic).
2. **Assign Base Frame $\{0\}$:** Choose origin $O_0$ anywhere on axis $z_0$. Choose $x_0$ arbitrarily perpendicular to $z_0$ (usually pointing forward).
3. **Assign Intermediate Frames $\{1\}$ through $\{n-1\}$:**
   - **Case A (Skew Axes):** If $z_{i-1}$ and $z_i$ are not parallel and do not intersect, their common normal is unique. Set $x_i$ along this common normal pointing from $z_{i-1}$ to $z_i$. Origin $O_i$ is the intersection of $x_i$ with $z_i$.
   - **Case B (Intersecting Axes):** If $z_{i-1}$ and $z_i$ intersect, link length $a_i = 0$. Choose $x_i = \pm (z_{i-1} \times z_i)$ perpendicular to the plane containing both axes. Origin $O_i$ is the point of intersection.
   - **Case C (Parallel Axes):** If $z_{i-1}$ and $z_i$ are parallel ($\alpha_i = 0$), there are infinitely many common normals. Choose the common normal that passes through the origin of the previous frame $O_{i-1}$, setting link offset $d_i = 0$.
4. **Complete Right-Handed Frames:** Assign $y_i = z_i \times x_i$.
5. **Assign End-Effector Frame $\{n\}$:** Align $z_n$ with the tool approach direction. Place origin $O_n$ at the tool tip or wrist center. Set $x_n$ perpendicular to $z_{n-1}$.

### 3.3 Derivation of the Standard DH Transformation Matrix $A_i$
The transformation from frame $\{i-1\}$ to frame $\{i\}$ is achieved by four consecutive elementary spatial operations:
1. Rotate about $z_{i-1}$ by angle $\theta_i$ to align $x_{i-1}$ with $x_i$: $\operatorname{Rot}_z(\theta_i)$.
2. Translate along $z_{i-1}$ by distance $d_i$ to bring $x_{i-1}$ into the plane of $x_i$: $\operatorname{Trans}_z(d_i)$.
3. Translate along $x_i$ by distance $a_i$ to bring the origins together: $\operatorname{Trans}_x(a_i)$.
4. Rotate about $x_i$ by angle $\alpha_i$ to align $z_{i-1}$ with $z_i$: $\operatorname{Rot}_x(\alpha_i)$.

Multiplying these four elementary transformation matrices:
$$A_i = \operatorname{Rot}_z(\theta_i) \operatorname{Trans}_z(d_i) \operatorname{Trans}_x(a_i) \operatorname{Rot}_x(\alpha_i)$$

$$\begin{aligned}
A_i &= \begin{bmatrix} \cos\theta_i & -\sin\theta_i & 0 & 0 \\ \sin\theta_i & \cos\theta_i & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_i \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & a_i \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & \cos\alpha_i & -\sin\alpha_i & 0 \\ 0 & \sin\alpha_i & \cos\alpha_i & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \\
&= \begin{bmatrix} \cos\theta_i & -\sin\theta_i\cos\alpha_i & \sin\theta_i\sin\alpha_i & a_i\cos\theta_i \\ \sin\theta_i & \cos\theta_i\cos\alpha_i & -\cos\theta_i\sin\alpha_i & a_i\sin\theta_i \\ 0 & \sin\alpha_i & \cos\alpha_i & d_i \\ 0 & 0 & 0 & 1 \end{bmatrix}
\end{aligned}$$

Notice the structure of $A_i$:
- The upper-left $3 \times 3$ block is the rotation matrix $R_{i-1}^i \in SO(3)$.
- The rightmost column is the position vector $p_{i-1}^i = [a_i\cos\theta_i, a_i\sin\theta_i, d_i]^T$.

### 3.4 Modified Denavit-Hartenberg Convention (Craig's DH)
In Craig's Modified DH convention, frame $\{i\}$ is fixed to link $i$ at joint $i$ (rather than joint $i+1$). The four operations are applied in a different order:
$$T_i = \operatorname{Rot}_x(\alpha_{i-1}) \operatorname{Trans}_x(a_{i-1}) \operatorname{Rot}_z(\theta_i) \operatorname{Trans}_z(d_i)$$

Carrying out the matrix multiplication:
$$T_i = \begin{bmatrix} \cos\theta_i & -\sin\theta_i & 0 & a_{i-1} \\ \sin\theta_i\cos\alpha_{i-1} & \cos\theta_i\cos\alpha_{i-1} & -\sin\alpha_{i-1} & -d_i\sin\alpha_{i-1} \\ \sin\theta_i\sin\alpha_{i-1} & \cos\theta_i\sin\alpha_{i-1} & \cos\alpha_{i-1} & d_i\cos\alpha_{i-1} \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

#### Key Differences Between Standard and Modified DH:
- **Index of Parameters:** In Standard DH, the parameters for link $i$ are $(a_i, \alpha_i, d_i, \theta_i)$. In Modified DH, the parameters are $(a_{i-1}, \alpha_{i-1}, d_i, \theta_i)$.
- **Axis of $x$:** In Standard DH, $x_i$ is the common normal between $z_{i-1}$ and $z_i$. In Modified DH, $x_i$ is the common normal between $z_i$ and $z_{i+1}$.

---

## 4. Computational Realization & Algorithmic Implementation

Below is a robust, zero-dependency TypeScript implementation for evaluating Standard and Modified DH matrices:

```typescript
export interface DHRow {
  a: number;      // link length
  alpha: number;  // link twist (radians)
  d: number;      // link offset
  theta: number;  // joint angle (radians)
  isPrismatic?: boolean;
}

export class DHKinematics {
  /**
   * Computes the 4x4 homogeneous transformation matrix for a single Standard DH row.
   */
  public static standardDHMatrix(row: DHRow): number[][] {
    const { a, alpha, d, theta } = row;
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);

    return [
      [ct, -st * ca,  st * sa, a * ct],
      [st,  ct * ca, -ct * sa, a * st],
      [0,   sa,       ca,      d     ],
      [0,   0,        0,       1     ]
    ];
  }

  /**
   * Computes the 4x4 homogeneous transformation matrix for a single Modified (Craig) DH row.
   */
  public static modifiedDHMatrix(row: DHRow): number[][] {
    const { a, alpha, d, theta } = row;
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);

    return [
      [ct,        -st,        0,    a       ],
      [st * ca,    ct * ca,  -sa,  -d * sa  ],
      [st * sa,    ct * sa,   ca,   d * ca  ],
      [0,          0,         0,    1       ]
    ];
  }

  /**
   * Cascades a list of DH rows into a cumulative end-effector transform T_0^n.
   */
  public static evaluateChain(rows: DHRow[], isModified: boolean = false): number[][] {
    let T: number[][] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    for (const row of rows) {
      const A = isModified ? this.modifiedDHMatrix(row) : this.standardDHMatrix(row);
      T = this.multiply4x4(T, A);
    }
    return T;
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

### Problem 3.1: Standard DH Parameters for a 2R Planar Arm
**Problem Statement:** Consider a 2R planar manipulator operating in the $xy$-plane with link lengths $L_1$ and $L_2$. Both joint axes $z_0$ and $z_1$ point out of the plane parallel to $+\hat{z}$.
1. Formulate the Standard DH table $(a_i, \alpha_i, d_i, \theta_i)$ for links 1 and 2.
2. Evaluate the transformation matrices $A_1$ and $A_2$.
3. Compute the overall forward kinematics transformation $T_0^2 = A_1 A_2$.

**Given Data:**
- Link lengths $L_1, L_2$
- Joint axes $z_0 \parallel z_1 \parallel z_2$ (all pointing out of the plane)
- No joint offsets ($d_1 = d_2 = 0$)
- No link twists ($\alpha_1 = \alpha_2 = 0$)

**Step-by-Step Derivation:**
1. Formulate the DH parameter table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $L_1$ | $0$ | $0$ | $\theta_1^*$ |
| 2 | $L_2$ | $0$ | $0$ | $\theta_2^*$ |

*(Asterisk indicates the joint variable)*

2. Evaluate $A_1$ using Standard DH formula with $\alpha_1 = 0, d_1 = 0, a_1 = L_1$:
   $$\cos\alpha_1 = 1, \quad \sin\alpha_1 = 0$$
   $$A_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & L_1\cos\theta_1 \\ \sin\theta_1 & \cos\theta_1 & 0 & L_1\sin\theta_1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Evaluate $A_2$ using $\alpha_2 = 0, d_2 = 0, a_2 = L_2$:
   $$A_2 = \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_2\cos\theta_2 \\ \sin\theta_2 & \cos\theta_2 & 0 & L_2\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Compute $T_0^2 = A_1 A_2$:
   Multiply the upper-left $2 \times 2$ blocks using angle sum identities:
   $$\begin{bmatrix} \cos\theta_1 & -\sin\theta_1 \\ \sin\theta_1 & \cos\theta_1 \end{bmatrix} \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 \\ \sin\theta_2 & \cos\theta_2 \end{bmatrix} = \begin{bmatrix} \cos(\theta_1 + \theta_2) & -\sin(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) & \cos(\theta_1 + \theta_2) \end{bmatrix}$$
   Multiply for position:
   $$p_0^2 = R_1 p_2 + p_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 \\ \sin\theta_1 & \cos\theta_1 \end{bmatrix} \begin{bmatrix} L_2\cos\theta_2 \\ L_2\sin\theta_2 \end{bmatrix} + \begin{bmatrix} L_1\cos\theta_1 \\ L_1\sin\theta_1 \end{bmatrix}$$
   $$= \begin{bmatrix} L_1\cos\theta_1 + L_2(\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2) \\ L_1\sin\theta_1 + L_2(\sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2) \end{bmatrix} = \begin{bmatrix} L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) \\ L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) \end{bmatrix}$$

**Final Answer:**
$$T_0^2 = \begin{bmatrix} \cos(\theta_1 + \theta_2) & -\sin(\theta_1 + \theta_2) & 0 & L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) & \cos(\theta_1 + \theta_2) & 0 & L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
Setting $\theta_1 = 0, \theta_2 = 0$ yields $x = L_1 + L_2, y = 0$, the straight horizontal extension of the arm, perfectly matching trigonometry.

---

### Problem 3.2: Standard DH Parameters for a 3R Planar Manipulator
**Problem Statement:** Extend Problem 3.1 to a 3R planar arm by adding a third revolute link of length $L_3$ with joint angle $\theta_3$. Formulate the DH table and compute the end-effector position and orientation.

**Given Data:**
- Link lengths $L_1, L_2, L_3$
- All joint axes $z_0, z_1, z_2, z_3$ parallel and perpendicular to the motion plane.

**Step-by-Step Derivation:**
1. DH parameter table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $L_1$ | $0$ | $0$ | $\theta_1^*$ |
| 2 | $L_2$ | $0$ | $0$ | $\theta_2^*$ |
| 3 | $L_3$ | $0$ | $0$ | $\theta_3^*$ |

2. Transformation $A_3$ is identical in structure to $A_2$:
   $$A_3 = \begin{bmatrix} \cos\theta_3 & -\sin\theta_3 & 0 & L_3\cos\theta_3 \\ \sin\theta_3 & \cos\theta_3 & 0 & L_3\sin\theta_3 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Cascade $T_0^3 = T_0^2 A_3$:
   Using $\phi = \theta_1 + \theta_2 + \theta_3$:
   The total rotation angle is $\phi$:
   $$R_0^3 = \operatorname{Rot}_z(\theta_1 + \theta_2 + \theta_3)$$
   The end-effector position is:
   $$x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) + L_3\cos(\theta_1 + \theta_2 + \theta_3)$$
   $$y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) + L_3\sin(\theta_1 + \theta_2 + \theta_3)$$
   $$z = 0$$

**Final Answer:**
$$T_0^3 = \begin{bmatrix} \cos\phi & -\sin\phi & 0 & L_1\cos\theta_1 + L_2\cos\theta_{12} + L_3\cos\phi \\ \sin\phi & \cos\phi & 0 & L_1\sin\theta_1 + L_2\sin\theta_{12} + L_3\sin\phi \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
where $\theta_{12} = \theta_1 + \theta_2$ and $\phi = \theta_1 + \theta_2 + \theta_3$.

**Verification & Sanity Check:**
If $\theta_1 = 90^\circ, \theta_2 = 0^\circ, \theta_3 = 0^\circ$, all links point vertically: $x = 0, y = L_1 + L_2 + L_3$, and orientation $\phi = 90^\circ$. Substituting gives $\cos(90^\circ) = 0$ and $\sin(90^\circ) = 1$, completely consistent.

---

### Problem 3.3: DH Table for a Cylindrical Robot (RPP)
**Problem Statement:** A cylindrical robot has 3 degrees of freedom:
- Joint 1: Revolute base rotation $\theta_1$ about vertical axis $z_0$.
- Joint 2: Prismatic vertical lift $d_2$ along $z_1$.
- Joint 3: Prismatic radial extension $d_3$ along horizontal axis.
Construct the complete Standard DH parameter table and evaluate the forward kinematics.

**Given Data:**
- Joint 1: Revolute ($\theta_1$ variable), axis $z_0$ vertical.
- Joint 2: Prismatic ($d_2$ variable), axis $z_1$ vertical ($z_1 \parallel z_0$).
- Joint 3: Prismatic ($d_3$ variable), axis $z_2$ horizontal ($z_2 \perp z_1$).

**Step-by-Step Derivation:**
1. Align coordinate axes:
   - $z_0$ is along Joint 1 axis (vertical).
   - $z_1$ is along Joint 2 axis (vertical, coincident with $z_0$).
   - Since $z_0$ and $z_1$ are collinear: link length $a_1 = 0$, twist $\alpha_1 = 0$, offset $d_1 = 0$.
   - $z_2$ is along Joint 3 translation axis (horizontal).
   - Angle from $z_1$ to $z_2$ about $x_2$ is $-90^\circ$ ($\alpha_2 = -90^\circ$ or $+90^\circ$). Let $\alpha_2 = -90^\circ$.
   - Joint 3 has translation variable $d_3$ along $z_2$.
2. Formulate the Standard DH table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $0$ | $0$ | $\theta_1^*$ |
| 2 | $0$ | $-90^\circ$ | $d_2^*$ | $0$ |
| 3 | $0$ | $0$ | $d_3^*$ | $0$ |

3. Evaluate matrices:
   $$A_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$A_2 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & -1 & 0 & d_2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$A_3 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Multiply $T_0^3 = A_1 A_2 A_3$:
   $$A_2 A_3 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & -1 & 0 & d_2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$T_0^3 = A_1 (A_2 A_3) = \begin{bmatrix} \cos\theta_1 & 0 & -\sin\theta_1 & -d_3\sin\theta_1 \\ \sin\theta_1 & 0 & \cos\theta_1 & d_3\cos\theta_1 \\ 0 & -1 & 0 & d_2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
Position of the end-effector:
$$p = \begin{bmatrix} -d_3\sin\theta_1 \\ d_3\cos\theta_1 \\ d_2 \end{bmatrix}$$
(Standard cylindrical coordinates $(r, \theta, z)$ with $r = d_3$ and $z = d_2$).

**Verification & Sanity Check:**
The radius is $\sqrt{x^2 + y^2} = \sqrt{(-d_3\sin\theta_1)^2 + (d_3\cos\theta_1)^2} = d_3$, and vertical height is $z = d_2$. The mathematics matches physical cylindrical geometry.

---

### Problem 3.4: Complete DH Table for a 4-DoF SCARA Robot (RRPR)
**Problem Statement:** A SCARA (Selective Compliance Assembly Robot Arm) manipulator has:
- Base height $d_1$.
- Shoulder link length $a_1$, joint angle $\theta_1$.
- Elbow link length $a_2$, joint angle $\theta_2$.
- Prismatic vertical quill translation $d_3$ along negative $\hat{z}$.
- Wrist roll angle $\theta_4$ about vertical axis.
Derive the complete Standard DH table and forward kinematics transformation matrix.

**Given Data:**
- Link lengths: $a_1, a_2$.
- Fixed base offset: $d_1$.
- All revolute axes $z_0, z_1, z_3$ parallel to vertical axis.
- Prismatic axis $z_2$ parallel to vertical axis, but pointing downward ($\alpha_2 = 180^\circ$ or $-180^\circ$).

**Step-by-Step Derivation:**
1. Formulate the Standard DH table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $a_1$ | $0$ | $d_1$ | $\theta_1^*$ |
| 2 | $a_2$ | $180^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0$ | $0$ | $d_3^*$ | $0$ |
| 4 | $0$ | $0$ | $0$ | $\theta_4^*$ |

2. Evaluate individual matrices:
   $$A_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & a_1\cos\theta_1 \\ \sin\theta_1 & \cos\theta_1 & 0 & a_1\sin\theta_1 \\ 0 & 0 & 1 & d_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   With $\alpha_2 = 180^\circ$ ($\cos 180^\circ = -1, \sin 180^\circ = 0$):
   $$A_2 = \begin{bmatrix} \cos\theta_2 & \sin\theta_2 & 0 & a_2\cos\theta_2 \\ \sin\theta_2 & -\cos\theta_2 & 0 & a_2\sin\theta_2 \\ 0 & 0 & -1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$A_3 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad A_4 = \begin{bmatrix} \cos\theta_4 & -\sin\theta_4 & 0 & 0 \\ \sin\theta_4 & \cos\theta_4 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Multiply to find end-effector position $p = T_0^4 [0, 0, 0, 1]^T$:
   $$x = a_1\cos\theta_1 + a_2\cos(\theta_1 + \theta_2)$$
   $$y = a_1\sin\theta_1 + a_2\sin(\theta_1 + \theta_2)$$
   $$z = d_1 - d_3$$

**Final Answer:**
- Position: **$p = [a_1\cos\theta_1 + a_2\cos(\theta_1 + \theta_2), \; a_1\sin\theta_1 + a_2\sin(\theta_1 + \theta_2), \; d_1 - d_3]^T$**
- Orientation: Rotation about $\hat{z}$ by angle **$\phi = \theta_1 + \theta_2 - \theta_4$**.

**Verification & Sanity Check:**
As the quill extends ($d_3$ increases), the tool moves down toward the workspace table ($z = d_1 - d_3$), while planar arms $(a_1, a_2)$ provide fast horizontal pick-and-place motion with high vertical structural stiffness.

---

### Problem 3.5: Standard DH Table for the Stanford Arm (RRPRRR)
**Problem Statement:** The Stanford Arm is a classic 6-DoF manipulator with 2 revolute shoulder joints, a prismatic elbow joint ($d_3$), and a 3-DoF spherical wrist (joints 4, 5, 6). The joint axes satisfy:
- $z_0 \perp z_1$
- $z_1 \perp z_2$
- $z_3 \perp z_4$ and $z_4 \perp z_5$ (intersecting at wrist center $O_4 = O_5 = O_6$).
Derive the complete 6-row Standard DH parameter table.

**Given Data:**
- Base offset $d_2$ between shoulder and elbow.
- Prismatic reach $d_3$.
- Tool tip offset $d_6$.

**Step-by-Step Derivation:**
1. Link 1: Waist rotation $\theta_1$ about vertical $z_0$. Axis $z_1$ is horizontal shoulder axis ($z_0 \perp z_1 \implies \alpha_1 = -90^\circ$). Length $a_1 = 0$, offset $d_1 = 0$ (or base height).
2. Link 2: Shoulder elevation $\theta_2$ about horizontal $z_1$. Axis $z_2$ is the telescoping boom axis ($z_1 \perp z_2 \implies \alpha_2 = +90^\circ$). Offset $d_2$ is the horizontal distance between waist and boom. Length $a_2 = 0$.
3. Link 3: Prismatic extension along $z_2$ ($d_3$ variable). Axis $z_3$ is the wrist roll axis ($z_3$ collinear with $z_2 \implies \alpha_3 = 0^\circ$). Length $a_3 = 0, \theta_3 = 0$.
4. Link 4: Wrist roll $\theta_4$ about $z_3$. Axis $z_4$ is wrist pitch ($z_3 \perp z_4 \implies \alpha_4 = -90^\circ$). Length $a_4 = 0, d_4 = 0$.
5. Link 5: Wrist pitch $\theta_5$ about $z_4$. Axis $z_5$ is wrist yaw ($z_4 \perp z_5 \implies \alpha_5 = +90^\circ$). Length $a_5 = 0, d_5 = 0$.
6. Link 6: Wrist yaw $\theta_6$ about $z_5$. Axis $z_6$ points toward tool tip. $\alpha_6 = 0^\circ, a_6 = 0$, offset $d_6$.

**Final Answer:**
The Standard DH Table for the Stanford Arm:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $-90^\circ$ | $0$ | $\theta_1^*$ |
| 2 | $0$ | $+90^\circ$ | $d_2$ | $\theta_2^*$ |
| 3 | $0$ | $0^\circ$ | $d_3^*$ | $0^\circ$ |
| 4 | $0$ | $-90^\circ$ | $0$ | $\theta_4^*$ |
| 5 | $0$ | $+90^\circ$ | $0$ | $\theta_5^*$ |
| 6 | $0$ | $0^\circ$ | $d_6$ | $\theta_6^*$ |

**Verification & Sanity Check:**
Notice that $a_i = 0$ for all links! The Stanford arm is an entirely orthogonal mechanism where all consecutive joint axes are either perpendicular or collinear.

---

### Problem 3.6: Complete DH Table for the PUMA 560 Robot (6R)
**Problem Statement:** The Unimation PUMA 560 is the archetypal 6-DoF anthropomorphic industrial manipulator with a spherical wrist. Its dimensions are:
- Waist to shoulder height: $d_3$ offset.
- Upper arm length: $a_2 = 0.4318\text{ m}$.
- Elbow offset: $d_3 = 0.15005\text{ m}$.
- Forearm length: $a_3 = -0.0203\text{ m}$.
- Forearm offset: $d_4 = 0.4318\text{ m}$.
- Tool offset: $d_6 = 0.0562\text{ m}$.
Derive the complete 6-row Standard DH parameter table.

**Step-by-Step Derivation:**
1. Joint 1: Waist rotation about vertical $z_0$. Shoulder axis $z_1$ is horizontal: $\alpha_1 = -90^\circ, a_1 = 0, d_1 = 0$.
2. Joint 2: Shoulder pitch about $z_1$. Elbow axis $z_2$ is parallel to $z_1$: $\alpha_2 = 0^\circ, a_2 = 0.4318\text{ m}, d_2 = 0$.
3. Joint 3: Elbow pitch about $z_2$. Forearm axis $z_3$ is perpendicular to $z_2$: $\alpha_3 = 90^\circ, a_3 = -0.0203\text{ m}, d_3 = 0.15005\text{ m}$.
4. Joint 4: Forearm roll about $z_3$. Wrist pitch axis $z_4$ is perpendicular to $z_3$: $\alpha_4 = -90^\circ, a_4 = 0, d_4 = 0.4318\text{ m}$.
5. Joint 5: Wrist pitch about $z_4$. Wrist roll axis $z_5$ is perpendicular to $z_4$: $\alpha_5 = 90^\circ, a_5 = 0, d_5 = 0$.
6. Joint 6: Tool roll about $z_5$: $\alpha_6 = 0^\circ, a_6 = 0, d_6 = 0.0562\text{ m}$.

**Final Answer:**
Standard DH Parameter Table for PUMA 560:

| Link $i$ | $a_i$ (m) | $\alpha_i$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $-90^\circ$ | $0$ | $\theta_1^*$ |
| 2 | $0.4318$ | $0^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $-0.0203$ | $+90^\circ$ | $0.15005$ | $\theta_3^*$ |
| 4 | $0$ | $-90^\circ$ | $0.4318$ | $\theta_4^*$ |
| 5 | $0$ | $+90^\circ$ | $0$ | $\theta_5^*$ |
| 6 | $0$ | $0^\circ$ | $0.0562$ | $\theta_6^*$ |

**Verification & Sanity Check:**
Axes 4, 5, and 6 intersect at a single point (the wrist center), because $a_4 = a_5 = 0$ and $d_5 = 0$. This satisfies Pieper's criterion, guaranteeing an analytical closed-form inverse kinematics solution.

---

### Problem 3.7: Craig's Modified DH Table for the PUMA 560
**Problem Statement:** Convert the Standard DH parameters of the PUMA 560 from Problem 3.6 into Craig's Modified DH convention $(a_{i-1}, \alpha_{i-1}, d_i, \theta_i)$.

**Step-by-Step Derivation:**
1. In Craig's convention, frame $i$ is attached to the proximal end of link $i$ at joint $i$.
2. The parameters $a$ and $\alpha$ are shifted by one index:
   - For link 1: $a_0 = 0, \alpha_0 = 0, d_1 = 0, \theta_1$.
   - For link 2: $a_1 = 0, \alpha_1 = -90^\circ, d_2 = 0, \theta_2$.
   - For link 3: $a_2 = 0.4318\text{ m}, \alpha_2 = 0^\circ, d_3 = 0.15005\text{ m}, \theta_3$.
   - For link 4: $a_3 = -0.0203\text{ m}, \alpha_3 = 90^\circ, d_4 = 0.4318\text{ m}, \theta_4$.
   - For link 5: $a_4 = 0, \alpha_4 = -90^\circ, d_5 = 0, \theta_5$.
   - For link 6: $a_5 = 0, \alpha_5 = 90^\circ, d_6 = 0.0562\text{ m}, \theta_6$.

**Final Answer:**
Craig's Modified DH Table for PUMA 560:

| Link $i$ | $a_{i-1}$ (m) | $\alpha_{i-1}$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $0^\circ$ | $0$ | $\theta_1^*$ |
| 2 | $0$ | $-90^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0.4318$ | $0^\circ$ | $0.15005$ | $\theta_3^*$ |
| 4 | $-0.0203$ | $+90^\circ$ | $0.4318$ | $\theta_4^*$ |
| 5 | $0$ | $-90^\circ$ | $0$ | $\theta_5^*$ |
| 6 | $0$ | $+90^\circ$ | $0.0562$ | $\theta_6^*$ |

**Verification & Sanity Check:**
Evaluating $T_0^6 = T_1 T_2 T_3 T_4 T_5 T_6$ using Craig's formula produces the exact same end-effector pose as $A_1 A_2 A_3 A_4 A_5 A_6$ in Standard DH for all joint angles.

---

### Problem 3.8: Ambiguity Resolution for Parallel Joint Axes
**Problem Statement:** Two consecutive revolute joints have parallel axes: $z_0 \parallel z_1$. Link length is $L_1 = 0.5\text{ m}$. There are infinitely many lines perpendicular to both $z_0$ and $z_1$.
1. State the Standard DH convention rule for selecting the common normal.
2. Formulate the resulting $d_1$ and $\alpha_1$.

**Solution:**
1. Under the Standard DH convention: When axes $z_{i-1}$ and $z_i$ are parallel, the common normal is chosen to pass through the origin of frame $\{i-1\}$ ($O_{i-1}$).
2. By selecting the normal passing through $O_{i-1}$, the distance along $z_{i-1}$ from $x_{i-1}$ to $x_i$ is identically zero:
   $$d_i = 0$$
3. Since the axes are parallel and point in the same direction, the angle between them about the common normal is zero:
   $$\alpha_i = 0^\circ$$
4. Result: $a_1 = 0.5\text{ m}, \alpha_1 = 0^\circ, d_1 = 0, \theta_1$.

---

### Problem 3.9: Frame Assignment for an Orthogonal Spherical Wrist
**Problem Statement:** A 3-DoF spherical wrist has three mutually orthogonal revolute axes $z_3, z_4, z_5$ that intersect at a single physical point $O_w$. Determine link lengths $a_4, a_5$ and link offsets $d_4, d_5$ under the Standard DH convention.

**Solution:**
1. Since axes $z_3$ and $z_4$ intersect at $O_w$:
   - Distance between them along common normal is zero: $a_4 = 0$.
   - Common normal $x_4 = \pm(z_3 \times z_4)$ passes through intersection point $O_w$.
   - Origin $O_4$ is located at $O_w$.
   - Link offset $d_4$ (distance along $z_3$ to $x_4$) is $d_4 = 0$ (or the forearm length if $O_3$ was at the elbow).
2. Since axes $z_4$ and $z_5$ intersect at $O_w$:
   - Distance between them is zero: $a_5 = 0$.
   - Origin $O_5$ is placed at $O_w$.
   - Distance from $x_4$ to $x_5$ along $z_4$ is zero: $d_5 = 0$.
3. All three frame origins $O_4, O_5, O_6$ are coincident at the wrist center $O_w$.

---

### Problem 3.10: Forward Kinematics of a Prismatic Joint
**Problem Statement:** Link 3 of a robotic manipulator is a pure prismatic joint with constant joint angle $\theta_3 = 0^\circ$, zero link length $a_3 = 0$, twist $\alpha_3 = 0^\circ$, and variable extension $d_3 \in [0.2, 0.8]\text{ m}$. Derive the transformation matrix $A_3(d_3)$.

**Solution:**
1. Substitute parameters into the Standard DH matrix:
   $$\theta_3 = 0 \implies \cos\theta_3 = 1, \; \sin\theta_3 = 0$$
   $$\alpha_3 = 0 \implies \cos\alpha_3 = 1, \; \sin\alpha_3 = 0$$
   $$a_3 = 0$$
2. Evaluate entries:
   $$A_3 = \begin{bmatrix} 1 & -0(1) & 0(0) & 0(1) \\ 0 & 1(1) & -1(0) & 0(0) \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. $A_3(d_3)$ is a pure linear translation along the $z$-axis by variable distance $d_3$ with identity rotation.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 3.11: Universal Joint Model via Two Zero-Length DH Links
**Problem Statement:** A 2-DoF universal joint (Hooke's joint) connects two shafts with two orthogonal intersecting axes of rotation. Model this joint using Standard DH convention as two 1-DoF revolute joints.

**Solution:**
1. Model the universal joint as Joint $A$ and Joint $B$ with intersecting axes $z_A \perp z_B$.
2. Link $A$ connects Joint $A$ to Joint $B$:
   - Because axes intersect: $a_A = 0$.
   - Angle between orthogonal axes: $\alpha_A = 90^\circ$ (or $-90^\circ$).
   - Offset along shaft: $d_A = 0$.
   - Variable: $\theta_A$.
3. Link $B$ connects Joint $B$ to output:
   - Output shaft direction aligned with $z_B$: $\alpha_B = 0^\circ, a_B = 0, d_B = 0, \theta_B$.
4. Transformation is the product of two orthogonal rotations with zero translation:
   $$A_{\text{universal}} = A_A(\theta_A) A_B(\theta_B)$$

---

### Problem 3.12: Universal Robots UR5 DH Parameters
**Problem Statement:** The Universal Robots UR5 6-axis cobot has:
- Base height: $d_1 = 0.089159\text{ m}$.
- Upper arm length: $a_2 = -0.425\text{ m}$.
- Forearm length: $a_3 = -0.39225\text{ m}$.
- Wrist offsets: $d_4 = 0.10915\text{ m}, d_5 = 0.09465\text{ m}, d_6 = 0.0823\text{ m}$.
Construct the complete Standard DH parameter table.

**Solution:**
1. Standard DH Table for UR5:

| Link $i$ | $a_i$ (m) | $\alpha_i$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $90^\circ$ | $0.089159$ | $\theta_1^*$ |
| 2 | $-0.425$ | $0^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $-0.39225$ | $0^\circ$ | $0$ | $\theta_3^*$ |
| 4 | $0$ | $90^\circ$ | $0.10915$ | $\theta_4^*$ |
| 5 | $0$ | $-90^\circ$ | $0.09465$ | $\theta_5^*$ |
| 6 | $0$ | $0^\circ$ | $0.0823$ | $\theta_6^*$ |

---

### Problem 3.13: Franka Emika Panda 7-DoF DH Table
**Problem Statement:** The Franka Emika Panda is a 7-DoF collaborative manipulator. Formulate its Modified (Craig) DH table given link offsets: $d_1 = 0.333, d_3 = 0.316, d_5 = 0.384, d_7 = 0.107\text{ m}$ and link lengths $a_4 = 0.0825, a_6 = 0.088\text{ m}$.

**Solution:**
Craig Modified DH Table for Franka Emika Panda:

| Joint $i$ | $a_{i-1}$ (m) | $\alpha_{i-1}$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $0^\circ$ | $0.333$ | $\theta_1^*$ |
| 2 | $0$ | $-90^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0$ | $+90^\circ$ | $0.316$ | $\theta_3^*$ |
| 4 | $0.0825$ | $+90^\circ$ | $0$ | $\theta_4^*$ |
| 5 | $-0.0825$ | $-90^\circ$ | $0.384$ | $\theta_5^*$ |
| 6 | $0$ | $+90^\circ$ | $0$ | $\theta_6^*$ |
| 7 | $0.088$ | $+90^\circ$ | $0.107$ | $\theta_7^*$ |

---

### Problem 3.14: General Formula for Converting Standard to Modified DH
**Problem Statement:** Derive the formal rule mapping link parameters $(a_i^{\text{std}}, \alpha_i^{\text{std}}, d_i^{\text{std}}, \theta_i^{\text{std}})$ to Craig parameters $(a_{i-1}^{\text{mod}}, \alpha_{i-1}^{\text{mod}}, d_i^{\text{mod}}, \theta_i^{\text{mod}})$.

**Solution:**
1. In Standard DH, the link dimensions $(a, \alpha)$ describe the link between joint $i$ and joint $i+1$, recorded at row $i$.
2. In Craig's convention, the link dimensions $(a, \alpha)$ describe link $i-1$ between joint $i-1$ and joint $i$, recorded at row $i$.
3. Therefore:
   $$a_{i-1}^{\text{mod}} = a_{i-1}^{\text{std}}, \quad \alpha_{i-1}^{\text{mod}} = \alpha_{i-1}^{\text{std}}$$
4. The joint variables $d_i$ and $\theta_i$ belong to joint $i$ in both conventions, but the zero-reference angle for $\theta_i$ may differ by a constant offset depending on the choice of $x_0$ and $x_n$.

---

### Problem 3.15: The Hayati-Mirmirani Singularity for Near-Parallel Axes
**Problem Statement:** Explain why the Denavit-Hartenberg parameterization suffers from numerical discontinuity when two nominally parallel joint axes are slightly misaligned in physical manufacturing (e.g., $\alpha = 0.001^\circ$).

**Solution:**
1. When two axes are strictly parallel ($\alpha = 0$), any line perpendicular to both is a common normal.
2. If axis 2 is perturbed by a tiny angle $\epsilon = 0.001^\circ$, the axes become skew. Two skew lines have a **unique** common normal.
3. As $\epsilon \to 0$, the location along $z$ where this unique common normal intersects the axes can jump by meters:
   $$d_i \approx \frac{\Delta}{\sin\epsilon} \to \infty$$
4. This causes the DH parameters $d_i$ and $\theta_i$ to exhibit extreme numerical sensitivity, making standard DH unsuitable for kinematic calibration of near-parallel joints (motivating the Hayati-Mirmirani 5-parameter model).

---

### Problem 3.16: Base Frame Calibration Matrix
**Problem Statement:** A robot's DH base frame $\{0\}$ is mounted on an AGV mobile platform whose location in world frame $\{w\}$ is given by $T_w^0 = \operatorname{Trans}(1.0, 2.0, 0.5) \operatorname{Rot}_z(45^\circ)$. Find the world position of the robot's end-effector when $T_0^n = \begin{bmatrix} I & [0.4, 0, 0.3]^T \\ 0 & 1 \end{bmatrix}$.

**Solution:**
1. World transformation is the matrix cascade $T_w^n = T_w^0 T_0^n$.
2. Position $p_w^n = R_w^0 p_0^n + p_w^0$:
   $$R_w^0 = \operatorname{Rot}_z(45^\circ) = \begin{bmatrix} \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 0 \\ \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
3. Multiply:
   $$R_w^0 \begin{bmatrix} 0.4 \\ 0 \\ 0.3 \end{bmatrix} = \begin{bmatrix} 0.4 \frac{\sqrt{2}}{2} \\ 0.4 \frac{\sqrt{2}}{2} \\ 0.3 \end{bmatrix} \approx \begin{bmatrix} 0.2828 \\ 0.2828 \\ 0.3000 \end{bmatrix}$$
4. Add platform position:
   $$p_w^n = \begin{bmatrix} 0.2828 \\ 0.2828 \\ 0.3000 \end{bmatrix} + \begin{bmatrix} 1.0 \\ 2.0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 1.2828 \\ 2.2828 \\ 0.8000 \end{bmatrix}\text{ m}$$

---

### Problem 3.17: Tool Center Point (TCP) Offset Transformation
**Problem Statement:** A welding torch has a tool tip located at distance $L_{\text{tool}} = 0.15\text{ m}$ extending along the tool $\hat{z}_n$ axis and angled by $30^\circ$ toward $\hat{x}_n$. Formulate the tool transformation matrix $T_n^{\text{tcp}}$.

**Solution:**
1. Rotation about $\hat{y}_n$ by $30^\circ$:
   $$R = \operatorname{Rot}_y(30^\circ) = \begin{bmatrix} \cos 30^\circ & 0 & \sin 30^\circ \\ 0 & 1 & 0 \\ -\sin 30^\circ & 0 & \cos 30^\circ \end{bmatrix} = \begin{bmatrix} 0.866 & 0 & 0.500 \\ 0 & 1 & 0 \\ -0.500 & 0 & 0.866 \end{bmatrix}$$
2. Position offset along the angled torch tip:
   $$p = [L_{\text{tool}}\sin 30^\circ, 0, L_{\text{tool}}\cos 30^\circ]^T = [0.15(0.5), 0, 0.15(0.866)]^T = [0.075, 0, 0.1299]^T\text{ m}$$
3. Full tool matrix:
   $$T_n^{\text{tcp}} = \begin{bmatrix} 0.866 & 0 & 0.500 & 0.075 \\ 0 & 1 & 0 & 0.000 \\ -0.500 & 0 & 0.866 & 0.1299 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 3.18: Spherical Coordinate Manipulator (RRP) DH Parameters
**Problem Statement:** A spherical coordinate robot has a revolute waist ($\theta_1$), revolute shoulder pitch ($\theta_2$), and prismatic boom extension ($d_3$). Construct its Standard DH table.

**Solution:**
Standard DH Table for Spherical (RRP) Robot:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $-90^\circ$ | $d_1$ | $\theta_1^*$ |
| 2 | $0$ | $+90^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0$ | $0^\circ$ | $d_3^*$ | $0^\circ$ |

---

### Problem 3.19: Spherical Wrist Forward Kinematics Cascade
**Problem Statement:** A spherical wrist has DH matrices with $a_4 = a_5 = a_6 = 0, d_4 = 0, d_5 = 0, d_6 = d_t$. Show that the position of the wrist center $O_5$ is independent of wrist joint angles $\theta_4, \theta_5, \theta_6$.

**Solution:**
1. The wrist center is defined as the physical intersection of axes $z_3, z_4, z_5$.
2. Frame origins $O_3, O_4, O_5$ are all coincident at this point.
3. In the coordinate cascade:
   $$p_w = T_0^3 \begin{bmatrix} 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
4. Because $T_0^3 = A_1(\theta_1) A_2(\theta_2) A_3(\theta_3)$, $p_w$ is a function strictly of the first three joint variables $(\theta_1, \theta_2, \theta_3)$!
5. Rotating $\theta_4, \theta_5, \theta_6$ alters only the orientation of the gripper, leaving the 3D position of the wrist center completely stationary.

---

### Problem 3.20: Automated Matrix Invariant Verification
**Problem Statement:** State the mathematical invariant checks that any algorithm evaluating DH transformation matrices $A_i$ must verify to guarantee numerical validity.

**Solution:**
For any valid homogeneous transformation matrix $A = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$:
1. **Determinant of Rotation:** $\det(R) = +1.000000 \pm 10^{-6}$.
2. **Orthogonality of Rotation:** $\|R^T R - I\|_\infty < 10^{-6}$.
3. **Column Normalization:** Each column of $R$ must have Euclidean norm equal to $1.0$: $|\|r_k\| - 1.0| < 10^{-6}$.
4. **Bottom Row Invariant:** The bottom row must be strictly $[0, 0, 0, 1]$.
