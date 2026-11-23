# Chapter 2: Homogeneous Spatial Transformations — $SE(3)$, Twist Coordinates, and Lie Algebra $\mathfrak{se}(3)$

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are holding an airplane flight controller. As the drone climbs and banks through the sky, its physical state changes in two distinct ways simultaneously:
1. It **translates** its center of mass across three Euclidean coordinates $(x, y, z)$.
2. It **rotates** about its body axes, altering its attitude via roll, pitch, and yaw.

In high school physics, we are taught to treat position as a simple 3D vector $\vec{p} = [x, y, z]^T$. To shift an object, we simply add another displacement vector: $\vec{p}' = \vec{p} + \vec{d}$. This linear vector addition works effortlessly for pure translations.

However, the moment rotation enters the equation, this simple linear intuition shatters. Rotations in three dimensions do **not** commute: turning a book $90^\circ$ around its vertical axis and then tilting it $90^\circ$ toward you produces a drastically different orientation than tilting it first and then turning it second! 

```
   Start Book          Rotate Z then X                  Rotate X then Z
     ┌───┐                 ┌───┐                             ┌───┐
     │ A │        ───▶     │ A │        vs.         ───▶     │   │ ◄── Spine facing
     └───┘             ┌───┴───┴───┐                         └───┘     viewer
                       │  Front    │
```

Because 3D rotations do not commute, they cannot be represented by simple vector addition. Furthermore, when a robot arm moves, every subsequent link rotates about an axis that was itself rotated by the previous link. 

To model this cascading spatial geometry cleanly, mathematicians and roboticists use the **Special Euclidean Group $SE(3)$** and its matrix representation via **$4 \times 4$ homogeneous transformations**. By augmenting our 3D vectors with a single scaling digit $1$, we transform coupled rotations and translations into unified, associative matrix multiplications. Furthermore, through the modern lens of **Lie theory** and **screw coordinates**, any spatial motion—no matter how intricate—can be viewed as a smooth flow along a single helical screw axis!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical framework of spatial transformations evolved over two centuries:
- In 1776, the Swiss polymath **Leonhard Euler** proved his celebrated **Euler Rotation Theorem**: any displacement of a rigid body on a sphere such that a point remains fixed is geometrically equivalent to a single rotation about some fixed axis.
- In 1830, the French geometer **Michel Chasles** expanded Euler's insight to full spatial kinematics with **Chasles' Theorem**: *the most general rigid body displacement can be produced by a translation along a line followed (or accompanied) by a rotation about that same line.* This combination of rotation and translation along a shared directed line is known as a **screw motion**.
- In the 1870s, the Norwegian mathematician **Sophus Lie** founded the theory of continuous transformation groups (**Lie groups**) and their infinitesimal linearized generators (**Lie algebras**). Lie's work revealed that the group of spatial rigid body motions $SE(3)$ and rotations $SO(3)$ are smooth differentiable manifolds whose geometric properties are completely captured near the identity by their tangent spaces $\mathfrak{se}(3)$ and $\mathfrak{so}(3)$.
- In 1900, **Sir Robert Stawell Ball** published his monumental work *A Treatise on the Theory of Screws*, laying the foundation for modern screw theory, twists (infinitesimal screw motions), and wrenches (systems of forces and torques). In modern robotics, through the pioneering works of Brockett (1984), Murray, Li, and Sastry (1994), and Lynch and Park (2017), screw theory and Lie groups have become the dominant, singularity-free language of spatial kinematics.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Special Orthogonal Group $SO(3)$
A 3D rotation preserves the length of vectors and the angles between them (an isometry) while preserving handedness (orientation).
Formally, the **Special Orthogonal Group** of order 3 is defined as:
$$SO(3) = \{ R \in \mathbb{R}^{3 \times 3} \mid R^T R = I, \; \det(R) = +1 \}$$

The orthogonality condition $R^T R = I$ imposes 6 independent algebraic constraints on the 9 entries of $R$:
- 3 constraints enforcing that each column has unit Euclidean length: $\|r_1\| = \|r_2\| = \|r_3\| = 1$.
- 3 constraints enforcing that the columns are mutually orthogonal: $r_1 \cdot r_2 = r_1 \cdot r_3 = r_2 \cdot r_3 = 0$.
Hence, $SO(3)$ possesses $9 - 6 = 3$ degrees of freedom. The condition $\det(R) = +1$ excludes reflections (which have $\det(R) = -1$).

### 3.2 The Lie Algebra $\mathfrak{so}(3)$ and Rodrigues' Formula
Differentiating the orthogonality relation $R(t) R^T(t) = I$ with respect to time $t$ yields:
$$\dot{R}(t) R^T(t) + R(t) \dot{R}^T(t) = 0 \implies \dot{R} R^T = -(\dot{R} R^T)^T$$
Thus, the matrix $\Omega = \dot{R} R^T$ evaluated at the identity $R = I$ is **skew-symmetric**.

The tangent space to $SO(3)$ at the identity is the **Lie algebra $\mathfrak{so}(3)$**, the vector space of all $3 \times 3$ real skew-symmetric matrices:
$$\mathfrak{so}(3) = \{ [\omega] \in \mathbb{R}^{3 \times 3} \mid [\omega]^T = -[\omega] \}$$

Any vector $\omega = [\omega_x, \omega_y, \omega_z]^T \in \mathbb{R}^3$ corresponds isomorphically to a skew-symmetric matrix $[\omega] \in \mathfrak{so}(3)$ via the "bracket" operator:
$$[\omega] = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$
Note that for any vector $v \in \mathbb{R}^3$, matrix-vector multiplication by $[\omega]$ is identical to the standard vector cross product:
$$[\omega] v = \omega \times v$$

#### The Exponential Map $\exp: \mathfrak{so}(3) \to SO(3)$:
For a constant angular velocity vector $\omega = \hat{\omega}\theta$ where $\|\hat{\omega}\| = 1$, the linear differential equation $\dot{x}(t) = [\hat{\omega}] x(t)$ has the matrix exponential solution:
$$R(\theta) = \exp([\hat{\omega}]\theta) = \sum_{k=0}^\infty \frac{([\hat{\omega}]\theta)^k}{k!} = I + \theta [\hat{\omega}] + \frac{\theta^2}{2!} [\hat{\omega}]^2 + \frac{\theta^3}{3!} [\hat{\omega}]^3 + \cdots$$

By direct calculation of powers of skew-symmetric $[\hat{\omega}]$ with unit norm $\|\hat{\omega}\| = 1$:
$$[\hat{\omega}]^3 = -[\hat{\omega}], \quad [\hat{\omega}]^4 = -[\hat{\omega}]^2, \quad [\hat{\omega}]^5 = [\hat{\omega}]$$
Regrouping the Taylor series into odd and even powers:
$$\exp([\hat{\omega}]\theta) = I + \left( \theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots \right) [\hat{\omega}] + \left( \frac{\theta^2}{2!} - \frac{\theta^4}{4!} + \cdots \right) [\hat{\omega}]^2$$
Recognizing the Taylor series for $\sin\theta$ and $1 - \cos\theta$, we arrive at **Rodrigues' Rotation Formula**:
$$R = \exp([\hat{\omega}]\theta) = I + \sin\theta [\hat{\omega}] + (1 - \cos\theta)[\hat{\omega}]^2$$

#### The Matrix Logarithm on $SO(3)$:
Given an arbitrary rotation matrix $R \in SO(3)$, the matrix logarithm extracts the equivalent rotation angle $\theta \in [0, \pi]$ and unit rotation axis $\hat{\omega}$:
$$\operatorname{tr}(R) = r_{11} + r_{22} + r_{33} = 1 + 2\cos\theta \implies \theta = \arccos\left( \frac{\operatorname{tr}(R) - 1}{2} \right)$$
- If $\theta \neq 0$ and $\theta \neq \pi$:
  $$[\hat{\omega}] = \frac{1}{2\sin\theta} (R - R^T)$$
- If $\theta = 0$: $R = I$, and the axis $\hat{\omega}$ is arbitrary.
- If $\theta = \pi$: $\operatorname{tr}(R) = -1$, and $\hat{\omega}$ is obtained from the unit eigenvectors of $R$ corresponding to eigenvalue $+1$.

### 3.3 The Special Euclidean Group $SE(3)$
A rigid spatial displacement combines a rotation $R \in SO(3)$ and a translation $p \in \mathbb{R}^3$.
In $4 \times 4$ homogeneous matrix representation, the **Special Euclidean Group** is:
$$SE(3) = \left\{ T = \begin{bmatrix} R & p \\ 0_{1 \times 3} & 1 \end{bmatrix} \in \mathbb{R}^{4 \times 4} \;\middle|\; R \in SO(3), \; p \in \mathbb{R}^3 \right\}$$

#### Group Properties of $SE(3)$:
1. **Composition (Associative Group Multiplication):**
   $$T_1 T_2 = \begin{bmatrix} R_1 & p_1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} R_2 & p_2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} R_1 R_2 & R_1 p_2 + p_1 \\ 0 & 1 \end{bmatrix}$$
2. **Identity Element:** $I_{4 \times 4} = \begin{bmatrix} I_3 & 0 \\ 0 & 1 \end{bmatrix}$.
3. **Inverse Element:**
   $$T^{-1} = \begin{bmatrix} R^T & -R^T p \\ 0_{1 \times 3} & 1 \end{bmatrix}$$
   *Proof:*
   $$T T^{-1} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} R^T & -R^T p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} R R^T & -R R^T p + p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} I & -p + p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} I & 0 \\ 0 & 1 \end{bmatrix} = I_{4 \times 4}$$

### 3.4 Spatial Twists and the Lie Algebra $\mathfrak{se}(3)$
A spatial velocity combines angular velocity $\omega \in \mathbb{R}^3$ and linear velocity $v \in \mathbb{R}^3$ into a single 6-dimensional vector called a **Twist**:
$$\mathcal{V} = \begin{bmatrix} \omega \\ v \end{bmatrix} \in \mathbb{R}^6$$

The corresponding $4 \times 4$ matrix element in the Lie algebra $\mathfrak{se}(3)$ is:
$$[\mathcal{V}] = \begin{bmatrix} [\omega] & v \\ 0_{1 \times 3} & 0 \end{bmatrix} \in \mathbb{R}^{4 \times 4}$$

#### The Matrix Exponential on $SE(3)$:
For a unit twist $\mathcal{S} = (\omega, v)$, the rigid transformation achieved by traveling along the screw for parameter $\theta$ is:
$$\exp([\mathcal{S}]\theta) = \begin{bmatrix} \exp([\omega]\theta) & G(\theta) v \\ 0 & 1 \end{bmatrix}$$
where the translational integration matrix $G(\theta) \in \mathbb{R}^{3 \times 3}$ is:
$$G(\theta) = I\theta + (1 - \cos\theta)[\omega] + (\theta - \sin\theta)[\omega]^2$$
If $\omega = 0$ (pure linear translation without rotation), $\|\omega\| = 0$ and:
$$\exp([\mathcal{S}]\theta) = \begin{bmatrix} I & v\theta \\ 0 & 1 \end{bmatrix}$$

### 3.5 Chasles' Theorem & Screw Parameters
Every spatial displacement $T \in SE(3)$ can be parameterized by screw coordinates:
- A screw axis directed line $L$ in space with unit direction $\hat{s} \in \mathbb{R}^3$ ($\|\hat{s}\| = 1$) passing through a point $q \in \mathbb{R}^3$.
- A rotation angle $\theta \in [0, \pi]$.
- A screw pitch $h \in \mathbb{R}$, which is the linear translation per unit radian of rotation ($h = \text{pitch}$).
$$\omega = \hat{s}, \quad v = -\hat{s} \times q + h \hat{s}$$
The pitch is extracted from the twist $\mathcal{V} = (\omega, v)$ via the dot product:
$$h = \frac{\omega \cdot v}{\|\omega\|^2}$$

```
                           Rotation θ
                           ╭──────╮
                           │  ↷   │
                      ▲    │      │
     Screw Axis L:    │  ════════════  (Pitch h = Translation / Radian)
     Direction s      │       │
                      │       ▼
                          Translation h θ
```

### 3.6 The Adjoint Representation $\operatorname{Ad}_T$
To transform a velocity twist or wrench between different coordinate frames, we use the **Adjoint Map**.
Let $T_{ab} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$ be the transformation from frame $\{b\}$ to frame $\{a\}$.
The $6 \times 6$ **Adjoint Representation Matrix** $\operatorname{Ad}_{T_{ab}}$ is:
$$\operatorname{Ad}_{T_{ab}} = \begin{bmatrix} R & 0_{3 \times 3} \\ [p]R & R \end{bmatrix} \in \mathbb{R}^{6 \times 6}$$

#### Properties and Transformations:
1. **Twist Frame Transformation:** A twist $\mathcal{V}_b$ expressed in frame $\{b\}$ is transformed into frame $\{a\}$ by:
   $$\mathcal{V}_a = \operatorname{Ad}_{T_{ab}} \mathcal{V}_b = \begin{bmatrix} R & 0 \\ [p]R & R \end{bmatrix} \begin{bmatrix} \omega_b \\ v_b \end{bmatrix} = \begin{bmatrix} R\omega_b \\ [p]R\omega_b + R v_b \end{bmatrix}$$
2. **Spatial Wrench Transformation:** A wrench $\mathcal{F} = [m, f]^T \in \mathbb{R}^6$ (moment $m$, force $f$) transforms via the transpose of the inverse adjoint:
   $$\mathcal{F}_b = \operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a$$

---

## 4. Computational Realization & Algorithmic Implementation

Below is a production-grade TypeScript implementation of the $SE(3)$ transformation engine:

```typescript
export class TransformSE3 {
  // Stored as 4x4 row-major Float64Array
  public data: Float64Array;

  constructor(matrix?: number[][]) {
    this.data = new Float64Array(16);
    if (matrix) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          this.data[r * 4 + c] = matrix[r][c];
        }
      }
    } else {
      // Identity
      this.data[0] = 1; this.data[5] = 1; this.data[10] = 1; this.data[15] = 1;
    }
  }

  public get(r: number, c: number): number {
    return this.data[r * 4 + c];
  }

  public set(r: number, c: number, val: number): void {
    this.data[r * 4 + c] = val;
  }

  /**
   * Computes exact matrix inverse of T in SE(3):
   * T^(-1) = [ R^T,  -R^T * p ]
   *          [  0 ,      1    ]
   */
  public inverse(): TransformSE3 {
    const inv = new TransformSE3();
    // Transpose 3x3 rotation
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        inv.set(i, j, this.get(j, i));
      }
    }
    // Translation: -R^T * p
    const px = this.get(0, 3);
    const py = this.get(1, 3);
    const pz = this.get(2, 3);

    inv.set(0, 3, -(inv.get(0, 0) * px + inv.get(0, 1) * py + inv.get(0, 2) * pz));
    inv.set(1, 3, -(inv.get(1, 0) * px + inv.get(1, 1) * py + inv.get(1, 2) * pz));
    inv.set(2, 3, -(inv.get(2, 0) * px + inv.get(2, 1) * py + inv.get(2, 2) * pz));
    inv.set(3, 3, 1.0);

    return inv;
  }

  /**
   * Matrix multiplication of two SE(3) transforms: C = A * B
   */
  public multiply(other: TransformSE3): TransformSE3 {
    const result = new TransformSE3();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.get(r, k) * other.get(k, c);
        }
        result.set(r, c, sum);
      }
    }
    return result;
  }

  /**
   * Constructs Rodrigues rotation matrix R in SO(3) from axis and angle.
   */
  public static fromAxisAngle(axis: { x: number; y: number; z: number }, theta: number): TransformSE3 {
    const norm = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    if (norm < 1e-12) return new TransformSE3();

    const kx = axis.x / norm;
    const ky = axis.y / norm;
    const kz = axis.z / norm;

    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const v = 1 - c;

    const T = new TransformSE3();
    T.set(0, 0, kx * kx * v + c);
    T.set(0, 1, kx * ky * v - kz * s);
    T.set(0, 2, kx * kz * v + ky * s);

    T.set(1, 0, kx * ky * v + kz * s);
    T.set(1, 1, ky * ky * v + c);
    T.set(1, 2, ky * kz * v - kx * s);

    T.set(2, 0, kx * kz * v - ky * s);
    T.set(2, 1, ky * kz * v + kx * s);
    T.set(2, 2, kz * kz * v + c);

    return T;
  }

  /**
   * Constructs the 6x6 Adjoint representation matrix.
   */
  public computeAdjoint(): number[][] {
    const Ad: number[][] = Array.from({ length: 6 }, () => new Array(6).fill(0));
    // R in top-left and bottom-right
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = this.get(r, c);
        Ad[r][c] = val;
        Ad[r + 3][c + 3] = val;
      }
    }
    // [p] * R in bottom-left
    const px = this.get(0, 3);
    const py = this.get(1, 3);
    const pz = this.get(2, 3);

    const skewP = [
      [0, -pz, py],
      [pz, 0, -px],
      [-py, px, 0]
    ];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += skewP[r][k] * this.get(k, c);
        }
        Ad[r + 3][c] = sum;
      }
    }

    return Ad;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 2.1: Matrix Exponential of Pure Rotation about $\hat{z}$ by $\pi/3$
**Problem Statement:** Let the rotation axis be the unit vector $\hat{\omega} = [0, 0, 1]^T$ and rotation angle $\theta = \frac{\pi}{3}\text{ rad}$ ($60^\circ$). Derive the $3 \times 3$ rotation matrix $R \in SO(3)$ using Rodrigues' formula.

**Given Data:**
- $\hat{\omega} = [0, 0, 1]^T$
- $\theta = \pi/3$
- $\cos(\pi/3) = 0.5$
- $\sin(\pi/3) = \frac{\sqrt{3}}{2} \approx 0.866025$

**Step-by-Step Derivation:**
1. Formulate the skew-symmetric matrix $[\hat{\omega}]$:
   $$[\hat{\omega}] = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
2. Compute $[\hat{\omega}]^2$:
   $$[\hat{\omega}]^2 = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
3. Apply Rodrigues' formula $R = I + \sin\theta [\hat{\omega}] + (1 - \cos\theta)[\hat{\omega}]^2$:
   $$R = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} + \frac{\sqrt{3}}{2} \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} + (1 - 0.5) \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
4. Sum the entries:
   $$R_{11} = 1 + 0 + 0.5(-1) = 0.5$$
   $$R_{12} = 0 - \frac{\sqrt{3}}{2} + 0 = -\frac{\sqrt{3}}{2} \approx -0.866025$$
   $$R_{21} = 0 + \frac{\sqrt{3}}{2} + 0 = \frac{\sqrt{3}}{2} \approx 0.866025$$
   $$R_{22} = 1 + 0 + 0.5(-1) = 0.5$$
   $$R_{33} = 1 + 0 + 0 = 1.0$$
   All other entries are 0.

**Final Answer:**
$$R = \begin{bmatrix} 0.5 & -0.866025 & 0 \\ 0.866025 & 0.5 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
- $\det(R) = (0.5)(0.5)(1) - (-0.866025)(0.866025)(1) = 0.25 + 0.75 = 1.000$.
- $R^T R = I$.
- Trace $\operatorname{tr}(R) = 0.5 + 0.5 + 1.0 = 2.0 = 1 + 2\cos(60^\circ) = 1 + 2(0.5) = 2.0$.

---

### Problem 2.2: Matrix Logarithm Extraction of Rotation Axis and Angle
**Problem Statement:** A robot arm's sensor returns the following numerical rotation matrix:
$$R = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$
Extract the rotation angle $\theta \in [0, \pi]$ and the unit rotation axis $\hat{\omega} = [\omega_x, \omega_y, \omega_z]^T$ using the matrix logarithm.

**Given Data:**
- Matrix $R$ with entries $r_{13} = 1, r_{21} = 1, r_{32} = 1$, all diagonal entries $0$.

**Step-by-Step Derivation:**
1. Compute the trace of $R$:
   $$\operatorname{tr}(R) = r_{11} + r_{22} + r_{33} = 0 + 0 + 0 = 0$$
2. Solve for rotation angle $\theta$:
   $$\operatorname{tr}(R) = 1 + 2\cos\theta \implies 0 = 1 + 2\cos\theta \implies \cos\theta = -\frac{1}{2}$$
   $$\theta = \arccos\left(-\frac{1}{2}\right) = \frac{2\pi}{3}\text{ rad} = 120^\circ \approx 2.094395\text{ rad}$$
3. Compute $\sin\theta$:
   $$\sin\left(\frac{2\pi}{3}\right) = \frac{\sqrt{3}}{2} \approx 0.866025$$
4. Compute the skew-symmetric matrix $[\hat{\omega}] = \frac{1}{2\sin\theta}(R - R^T)$:
   $$R - R^T = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix} - \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{bmatrix}$$
   $$[\hat{\omega}] = \frac{1}{2\left(\frac{\sqrt{3}}{2}\right)} \begin{bmatrix} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{bmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{bmatrix}$$
5. Extract the components of $\hat{\omega} = [\omega_x, \omega_y, \omega_z]^T$:
   $$\omega_z = [\hat{\omega}]_{21} = \frac{1}{\sqrt{3}}$$
   $$\omega_y = [\hat{\omega}]_{13} = \frac{1}{\sqrt{3}}$$
   $$\omega_x = [\hat{\omega}]_{32} = \frac{1}{\sqrt{3}}$$

**Final Answer:**
- Rotation Angle: **$\theta = \frac{2\pi}{3}\text{ rad} = 120^\circ$**
- Rotation Axis: **$\hat{\omega} = \left[ \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}} \right]^T \approx [0.57735, 0.57735, 0.57735]^T$**

**Verification & Sanity Check:**
$\|\hat{\omega}\| = \sqrt{(1/\sqrt{3})^2 + (1/\sqrt{3})^2 + (1/\sqrt{3})^2} = \sqrt{1/3 + 1/3 + 1/3} = 1$.
A $120^\circ$ rotation about the body diagonal $[1, 1, 1]^T$ cyclically permutes the coordinate axes: $x \to y \to z \to x$, which matches matrix $R$ exactly!

---

### Problem 2.3: Homogeneous Transformation Inversion and Point Mapping
**Problem Statement:** A camera frame $\{c\}$ is mounted on a robot wrist frame $\{w\}$ with homogeneous transformation:
$$T_{wc} = \begin{bmatrix} 0 & -1 & 0 & 0.10 \\ 1 & 0 & 0 & 0.20 \\ 0 & 0 & 1 & 0.05 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
(coordinates in meters).
1. Calculate the exact inverse transformation $T_{cw} = T_{wc}^{-1}$.
2. A detected object has coordinates in the camera frame $p_c = [0.5, 0.0, 1.2]^T\text{ m}$. Find its coordinates in the wrist frame $p_w$.

**Given Data:**
- $R_{wc} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ (a $90^\circ$ rotation about $\hat{z}$)
- $p_{wc} = [0.10, 0.20, 0.05]^T$
- $p_c = [0.5, 0.0, 1.2]^T$

**Step-by-Step Derivation:**
1. Invert the rotation:
   $$R_{cw} = R_{wc}^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Compute the inverse translation:
   $$-R_{wc}^T p_{wc} = -\begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.20 \\ 0.05 \end{bmatrix} = -\begin{bmatrix} 0.20 \\ -0.10 \\ 0.05 \end{bmatrix} = \begin{bmatrix} -0.20 \\ 0.10 \\ -0.05 \end{bmatrix}$$
3. Construct $T_{cw}$:
   $$T_{cw} = \begin{bmatrix} 0 & 1 & 0 & -0.20 \\ -1 & 0 & 0 & 0.10 \\ 0 & 0 & 1 & -0.05 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Compute $p_w = R_{wc} p_c + p_{wc}$:
   $$R_{wc} p_c = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.5 \\ 0.0 \\ 1.2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0.5 \\ 1.2 \end{bmatrix}$$
   $$p_w = \begin{bmatrix} 0 \\ 0.5 \\ 1.2 \end{bmatrix} + \begin{bmatrix} 0.10 \\ 0.20 \\ 0.05 \end{bmatrix} = \begin{bmatrix} 0.10 \\ 0.70 \\ 1.25 \end{bmatrix}\text{ m}$$

**Final Answer:**
1. Inverse Transformation:
   $$T_{cw} = \begin{bmatrix} 0 & 1 & 0 & -0.20 \\ -1 & 0 & 0 & 0.10 \\ 0 & 0 & 1 & -0.05 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Target position in wrist frame: **$p_w = [0.10, 0.70, 1.25]^T\text{ m}$**.

**Verification & Sanity Check:**
Test round-trip mapping:
$p_c' = R_{cw} p_w + (-R_{wc}^T p_{wc}) = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.70 \\ 1.25 \end{bmatrix} + \begin{bmatrix} -0.20 \\ 0.10 \\ -0.05 \end{bmatrix} = \begin{bmatrix} 0.70 \\ -0.10 \\ 1.25 \end{bmatrix} + \begin{bmatrix} -0.20 \\ 0.10 \\ -0.05 \end{bmatrix} = \begin{bmatrix} 0.50 \\ 0.00 \\ 1.20 \end{bmatrix}$. Exactly recovers $p_c$!

---

### Problem 2.4: Composition of Fixed-Frame vs. Current-Frame Transformations
**Problem Statement:** A robot end-effector starts coincident with the base frame $\{0\}$. It undergoes two sequential spatial motions:
1. Motion 1: Rotation about the base $\hat{x}_0$ axis by $90^\circ$, followed by translation along base $\hat{z}_0$ by $2.0\text{ m}$.
2. Motion 2: Rotation about the tool's *current* $\hat{z}$ axis by $90^\circ$, followed by translation along the tool's *current* $\hat{x}$ axis by $1.0\text{ m}$.
Determine the final homogeneous transformation matrix $T_0^{\text{final}}$.

**Given Data:**
- Fixed-frame motion $T_A$: Pre-multiplied.
- Current-frame motion $T_B$: Post-multiplied.

**Step-by-Step Derivation:**
1. Formulate Motion 1 in base frame $\{0\}$:
   $$R_A = \operatorname{Rot}_x(90^\circ) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}, \quad p_A = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix}$$
   $$T_A = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Formulate Motion 2 relative to the current tool frame:
   $$R_B = \operatorname{Rot}_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad p_B = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   Notice that the translation is along the *current* $\hat{x}$ axis:
   $$T_B = \begin{bmatrix} R_B & p_B \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Because Motion 2 is specified with respect to the *current* frame, it **post-multiplies** $T_A$:
   $$T_0^{\text{final}} = T_A T_B$$
4. Compute the matrix product:
   $$T_0^{\text{final}} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 & -1 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   - Row 1: $[0, -1, 0, 1]$
   - Row 2: $[0, 0, -1, 0]$
   - Row 3: $[1, 0, 0, 2]$
   - Row 4: $[0, 0, 0, 1]$

**Final Answer:**
$$T_0^{\text{final}} = \begin{bmatrix} 0 & -1 & 0 & 1 \\ 0 & 0 & -1 & 0 \\ 1 & 0 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
- Origin of tool: In Motion 1, it moved to $(0, 0, 2)$. In Motion 2, it moved by $1\text{ m}$ along its current $\hat{x}$ axis. Since the current $\hat{x}$ axis remained aligned with base $\hat{x}_0$, the translation along current $\hat{x}$ adds $[1, 0, 0]^T$ in base frame: $(0+1, 0, 2) = (1, 0, 2)$, exactly matching column 4!

---

### Problem 2.5: Screw Axis Parameter Extraction from a Spatial Twist
**Problem Statement:** A spatial twist is given in base coordinates by:
$$\mathcal{V} = \begin{bmatrix} \omega \\ v \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 2 \\ 4 \\ -2 \\ 6 \end{bmatrix}$$
(angular velocity in rad/s, linear velocity in m/s).
Extract the screw motion parameters:
1. The rotation speed $\dot{\theta} = \|\omega\|$.
2. The unit screw axis direction $\hat{s}$.
3. The screw pitch $h$.
4. The point $q$ on the screw axis closest to the origin ($q \cdot \hat{s} = 0$).

**Given Data:**
- $\omega = [0, 0, 2]^T$
- $v = [4, -2, 6]^T$

**Step-by-Step Derivation:**
1. Rotation speed $\dot{\theta}$:
   $$\dot{\theta} = \|\omega\| = \sqrt{0^2 + 0^2 + 2^2} = 2\text{ rad/s}$$
2. Unit axis direction $\hat{s}$:
   $$\hat{s} = \frac{\omega}{\|\omega\|} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Screw pitch $h$:
   $$h = \frac{\omega \cdot v}{\|\omega\|^2} = \frac{0(4) + 0(-2) + 2(6)}{2^2} = \frac{12}{4} = 3.0\text{ m/rad}$$
4. Point $q$ on the screw axis closest to the origin:
   The linear velocity is related to $q$ and $h$ by:
   $$v = -\omega \times q + h \omega$$
   The parallel component is $h \omega = 3 [0, 0, 2]^T = [0, 0, 6]^T$.
   The perpendicular component $v_\perp$ is:
   $$v_\perp = v - h \omega = \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 4 \\ -2 \\ 0 \end{bmatrix}$$
   Since $v_\perp = -\omega \times q = q \times \omega$, cross-multiply by $\omega$:
   $$\omega \times v_\perp = \omega \times (q \times \omega) = \|\omega\|^2 q - (\omega \cdot q)\omega$$
   Since $q$ is chosen such that $q \cdot \omega = 0$:
   $$q = \frac{\omega \times v_\perp}{\|\omega\|^2} = \frac{\omega \times v}{\|\omega\|^2}$$
5. Compute the cross product $\omega \times v$:
   $$\omega \times v = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix} \times \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix} = \begin{bmatrix} 0(-2) - 2(-2) \\ 2(4) - 0(6) \\ 0(-2) - 0(4) \end{bmatrix} = \begin{bmatrix} 4 \\ 8 \\ 0 \end{bmatrix}$$
6. Evaluate $q$:
   $$q = \frac{1}{4} \begin{bmatrix} 4 \\ 8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 0 \end{bmatrix}\text{ m}$$

**Final Answer:**
- Rotation speed: **$\dot{\theta} = 2.0\text{ rad/s}$**
- Screw axis: **$\hat{s} = [0, 0, 1]^T$**
- Screw pitch: **$h = 3.0\text{ m/rad}$**
- Axis point: **$q = [1.0, 2.0, 0.0]^T\text{ m}$**

**Verification & Sanity Check:**
Check $v$: $-\omega \times q + h \omega = -[0, 0, 2]^T \times [1, 2, 0]^T + [0, 0, 6]^T = -[-4, 2, 0]^T + [0, 0, 6]^T = [4, -2, 6]^T$. Matches $v$ exactly!

---

### Problem 2.6: Matrix Exponential on $SE(3)$ via Twist Coordinates
**Problem Statement:** A normalized screw axis has unit twist $\mathcal{S} = (\omega, v)$ with $\omega = [0, 0, 1]^T$ and $v = [2, 0, 1]^T$. Compute the exact $4 \times 4$ homogeneous transformation matrix $T = \exp([\mathcal{S}]\theta)$ for $\theta = \frac{\pi}{2}\text{ rad}$ ($90^\circ$).

**Given Data:**
- $\omega = [0, 0, 1]^T, \|\omega\| = 1$
- $v = [2, 0, 1]^T$
- $\theta = \pi/2$
- $\cos(\pi/2) = 0, \sin(\pi/2) = 1$

**Step-by-Step Derivation:**
1. Rotation submatrix $R = \exp([\omega]\theta)$:
   $$R = \operatorname{Rot}_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Translation vector $p = G(\theta) v$, where:
   $$G(\theta) = I\theta + (1 - \cos\theta)[\omega] + (\theta - \sin\theta)[\omega]^2$$
3. Evaluate $[\omega]$ and $[\omega]^2$:
   $$[\omega] = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}, \quad [\omega]^2 = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
4. Compute $G(\theta) v$:
   Notice that $G(\theta)$ can be evaluated directly on $v = [2, 0, 1]^T$:
   - $I\theta v = \frac{\pi}{2} [2, 0, 1]^T = [\pi, 0, \pi/2]^T$
   - $(1 - \cos\theta)[\omega] v = (1 - 0) \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$
   - $(\theta - \sin\theta)[\omega]^2 v = \left(\frac{\pi}{2} - 1\right) \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix} = \left(\frac{\pi}{2} - 1\right) \begin{bmatrix} -2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} -\pi + 2 \\ 0 \\ 0 \end{bmatrix}$
5. Sum the components for $p$:
   $$p_x = \pi + 0 + (-\pi + 2) = 2.0$$
   $$p_y = 0 + 2 + 0 = 2.0$$
   $$p_z = \frac{\pi}{2} + 0 + 0 = \frac{\pi}{2} \approx 1.570796$$
6. Construct $T = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$:

**Final Answer:**
$$T = \exp([\mathcal{S}]\theta) = \begin{bmatrix} 0 & -1 & 0 & 2.0 \\ 1 & 0 & 0 & 2.0 \\ 0 & 0 & 1 & 1.570796 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
- Pitch $h = \omega \cdot v = 1 \implies \Delta z = h\theta = 1(\pi/2) = \pi/2$.
- Point on axis $q = \omega \times v = [0, 0, 1]^T \times [2, 0, 1]^T = [0, 2, 0]^T$.
Rotating point $(0, 0)$ around center $(0, 2)$ by $90^\circ$ moves it to $(2, 2)$! Matches $(p_x, p_y) = (2, 2)$ with mathematical perfection.

---

### Problem 2.7: Adjoint Transformation of Body Twist to Spatial Frame
**Problem Statement:** A robot end-effector has the following transformation relative to the base frame $\{s\}$:
$$T_{sb} = \begin{bmatrix} 0 & 0 & 1 & 0.4 \\ 0 & 1 & 0 & 0.0 \\ -1 & 0 & 0 & 0.6 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
The end-effector is rotating and translating in its own body frame $\{b\}$ with body twist:
$$\mathcal{V}_b = [\omega_x^b, \omega_y^b, \omega_z^b, v_x^b, v_y^b, v_z^b]^T = [0, 1.0, 0, 0, 0, 0.5]^T$$
Compute the spatial twist $\mathcal{V}_s = \operatorname{Ad}_{T_{sb}} \mathcal{V}_b$ expressed in the base frame.

**Given Data:**
- $R_{sb} = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$
- $p_{sb} = [0.4, 0.0, 0.6]^T$
- $\omega_b = [0, 1, 0]^T, v_b = [0, 0, 0.5]^T$

**Step-by-Step Derivation:**
1. Adjoint equation:
   $$\omega_s = R_{sb} \omega_b$$
   $$v_s = [p_{sb}] R_{sb} \omega_b + R_{sb} v_b = p_{sb} \times \omega_s + R_{sb} v_b$$
2. Compute spatial angular velocity $\omega_s$:
   $$\omega_s = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}\text{ rad/s}$$
3. Compute $p_{sb} \times \omega_s$:
   $$p_{sb} \times \omega_s = \begin{bmatrix} 0.4 \\ 0.0 \\ 0.6 \end{bmatrix} \times \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0(0) - 0.6(1) \\ 0.6(0) - 0.4(0) \\ 0.4(1) - 0(0) \end{bmatrix} = \begin{bmatrix} -0.6 \\ 0.0 \\ 0.4 \end{bmatrix}$$
4. Compute $R_{sb} v_b$:
   $$R_{sb} v_b = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 0.0 \\ 0.0 \end{bmatrix}$$
5. Sum to get spatial linear velocity $v_s$:
   $$v_s = \begin{bmatrix} -0.6 \\ 0.0 \\ 0.4 \end{bmatrix} + \begin{bmatrix} 0.5 \\ 0.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -0.1 \\ 0.0 \\ 0.4 \end{bmatrix}\text{ m/s}$$

**Final Answer:**
$$\mathcal{V}_s = \begin{bmatrix} 0 \\ 1.0 \\ 0 \\ -0.1 \\ 0.0 \\ 0.4 \end{bmatrix}$$

**Verification & Sanity Check:**
- Rotation about body $\hat{y}_b$ rotates the body about base $\hat{y}_s$ because column 2 of $R_{sb}$ is $[0, 1, 0]^T$.
- Translation along body $\hat{z}_b$ points along base $\hat{x}_s$ because column 3 of $R_{sb}$ is $[1, 0, 0]^T$ (scaled by $0.5 \implies 0.5 \hat{x}_s$).
- The lever arm effect from rotating around base origin at offset $p_{sb}$ produces cross product tangential velocity $[-0.6, 0, 0.4]^T$. Adding $0.5 \hat{x}_s$ gives $v_x = -0.6 + 0.5 = -0.1\text{ m/s}$. Completely verified.

---

### Problem 2.8: Adjoint Wrench Transformation
**Problem Statement:** A force-torque sensor at the robot wrist frame $\{w\}$ measures an external contact wrench from a tool tip:
$$\mathcal{F}_w = [m_w, f_w]^T = [0, 5.0, 0, 0, 0, -20.0]^T$$
(torque in $\text{N}\cdot\text{m}$, force in $\text{N}$).
The wrist frame is located at $T_{bw}$ relative to the robot base frame $\{b\}$:
$$T_{bw} = \begin{bmatrix} 1 & 0 & 0 & 0.8 \\ 0 & 1 & 0 & 0.0 \\ 0 & 0 & 1 & 0.5 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
Calculate the equivalent wrench $\mathcal{F}_b = [m_b, f_b]^T$ exerted on the robot base.

**Given Data:**
- $R_{bw} = I_3$
- $p_{bw} = [0.8, 0.0, 0.5]^T$
- $m_w = [0, 5, 0]^T$, $f_w = [0, 0, -20]^T$

**Step-by-Step Derivation:**
1. Wrench transformation formula:
   $$\mathcal{F}_w = \operatorname{Ad}_{T_{bw}}^T \mathcal{F}_b \implies \mathcal{F}_b = \operatorname{Ad}_{T_{wb}}^T \mathcal{F}_w$$
   Using the adjoint matrix structure for $T_{bw}$:
   $$\operatorname{Ad}_{T_{bw}} = \begin{bmatrix} R & 0 \\ [p]R & R \end{bmatrix} \implies \operatorname{Ad}_{T_{bw}}^T = \begin{bmatrix} R^T & -R^T [p] \\ 0 & R^T \end{bmatrix}$$
   Because $f_b$ is pure force:
   $$f_b = R_{bw} f_w = I [0, 0, -20]^T = [0, 0, -20]^T\text{ N}$$
2. The total moment on the base includes the sensor moment plus the moment created by the contact force acting at lever arm $p_{bw}$:
   $$m_b = R_{bw} m_w + p_{bw} \times f_b$$
3. Compute the cross product $p_{bw} \times f_b$:
   $$p_{bw} \times f_b = \begin{bmatrix} 0.8 \\ 0.0 \\ 0.5 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ -20 \end{bmatrix} = \begin{bmatrix} 0.0(-20) - 0.5(0) \\ 0.5(0) - 0.8(-20) \\ 0.8(0) - 0.0(0) \end{bmatrix} = \begin{bmatrix} 0 \\ +16 \\ 0 \end{bmatrix}\text{ N}\cdot\text{m}$$
4. Add the transmitted torque:
   $$m_b = \begin{bmatrix} 0 \\ 5 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ 16 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 21 \\ 0 \end{bmatrix}\text{ N}\cdot\text{m}$$

**Final Answer:**
$$\mathcal{F}_b = [0, 21.0, 0, 0, 0, -20.0]^T$$

**Verification & Sanity Check:**
A downward force of $20\text{ N}$ at $x = +0.8\text{ m}$ creates a positive pitch moment about the base $\hat{y}$ axis of $\tau = 0.8\text{ m} \times 20\text{ N} = +16\text{ N}\cdot\text{m}$. Adding the sensor torque $+5\text{ N}\cdot\text{m}$ gives exactly $+21\text{ N}\cdot\text{m}$.

---

### Problem 2.9: Quaternion to Rotation Matrix Conversion
**Problem Statement:** A unit quaternion representing a robot end-effector attitude is given by:
$$\mathbf{q} = (w, x, y, z) = (0.707107, 0, 0.707107, 0)$$
1. Derive the corresponding $3 \times 3$ rotation matrix $R \in SO(3)$.
2. Identify the equivalent rotation angle $\theta$ and axis $\hat{\omega}$.

**Given Data:**
- $w = \cos(\theta/2) = 1/\sqrt{2} \approx 0.707107$
- $x = 0, y = 1/\sqrt{2} \approx 0.707107, z = 0$

**Step-by-Step Derivation:**
1. Check unit norm:
   $$\|\mathbf{q}\|^2 = (1/\sqrt{2})^2 + 0 + (1/\sqrt{2})^2 + 0 = 0.5 + 0.5 = 1.0$$
2. General formula for $R(\mathbf{q})$:
   $$R = \begin{bmatrix} 1 - 2(y^2 + z^2) & 2(xy - wz) & 2(xz + wy) \\ 2(xy + wz) & 1 - 2(x^2 + z^2) & 2(yz - wx) \\ 2(xz - wy) & 2(yz + wx) & 1 - 2(x^2 + y^2) \end{bmatrix}$$
3. Substitute $x = 0, z = 0, y = 1/\sqrt{2}, w = 1/\sqrt{2}$:
   - $R_{11} = 1 - 2(0.5 + 0) = 0$
   - $R_{12} = 2(0 - 0) = 0$
   - $R_{13} = 2(0 + 0.5) = +1$
   - $R_{21} = 2(0 + 0) = 0$
   - $R_{22} = 1 - 2(0 + 0) = 1$
   - $R_{23} = 2(0 - 0) = 0$
   - $R_{31} = 2(0 - 0.5) = -1$
   - $R_{32} = 2(0 + 0) = 0$
   - $R_{33} = 1 - 2(0 + 0.5) = 0$
4. Identify angle and axis:
   $$\cos(\theta/2) = w = \frac{1}{\sqrt{2}} \implies \frac{\theta}{2} = 45^\circ \implies \theta = 90^\circ$$
   $$\hat{\omega} = \frac{[x, y, z]^T}{\sin(\theta/2)} = \frac{[0, 1/\sqrt{2}, 0]^T}{1/\sqrt{2}} = [0, 1, 0]^T$$

**Final Answer:**
$$R = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$$
Rotation of **$\theta = 90^\circ$** about the **$\hat{y}$ axis**.

**Verification & Sanity Check:**
Standard rotation about $\hat{y}$ by $90^\circ$: $\cos(90^\circ) = 0, \sin(90^\circ) = 1$. The matrix matches $\operatorname{Rot}_y(90^\circ)$ exactly.

---

### Problem 2.10: Lie Bracket $[\mathcal{V}_1, \mathcal{V}_2]$ and Velocity Non-Commutativity
**Problem Statement:** Let two spatial twists be:
$$\mathcal{V}_1 = [\omega_1, v_1]^T = [1, 0, 0, 0, 0, 0]^T \quad (\text{Pure rotation about } \hat{x})$$
$$\mathcal{V}_2 = [\omega_2, v_2]^T = [0, 1, 0, 0, 0, 0]^T \quad (\text{Pure rotation about } \hat{y})$$
Compute the Lie bracket $[\mathcal{V}_1, \mathcal{V}_2]$ in $\mathfrak{se}(3)$ and explain its physical geometric meaning.

**Given Data:**
- $\mathcal{V}_1 = [1, 0, 0, 0, 0, 0]^T$
- $\mathcal{V}_2 = [0, 1, 0, 0, 0, 0]^T$

**Step-by-Step Derivation:**
1. The Lie bracket of two twists $[\mathcal{V}_1, \mathcal{V}_2]$ is defined in vector form as the small-adjoint operator:
   $$[\mathcal{V}_1, \mathcal{V}_2] = \operatorname{ad}_{\mathcal{V}_1} \mathcal{V}_2 = \begin{bmatrix} [\omega_1] & 0 \\ [v_1] & [\omega_1] \end{bmatrix} \begin{bmatrix} \omega_2 \\ v_2 \end{bmatrix} = \begin{bmatrix} \omega_1 \times \omega_2 \\ \omega_1 \times v_2 - \omega_2 \times v_1 \end{bmatrix}$$
2. Compute the angular cross product:
   $$\omega_1 \times \omega_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Compute the linear velocity part:
   Since $v_1 = 0$ and $v_2 = 0$, the linear cross products are zero:
   $$\omega_1 \times v_2 - \omega_2 \times v_1 = 0 - 0 = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
4. Assemble the resulting twist:
   $$[\mathcal{V}_1, \mathcal{V}_2] = [0, 0, 1, 0, 0, 0]^T$$

**Final Answer:**
$$[\mathcal{V}_1, \mathcal{V}_2] = [0, 0, 1, 0, 0, 0]^T$$
(Pure instantaneous rotation about the **$\hat{z}$ axis**).

**Verification & Sanity Check:**
This is the infinitesimal generator of non-commutativity: rotating back-and-forth about $\hat{x}$ and $\hat{y}$ generates a net second-order rotation about $\hat{z}$ ($[\hat{x}, \hat{y}] = \hat{z}$ in the $\mathfrak{so}(3)$ algebra).

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 2.11: Pure Translation Twist in $SE(3)$
**Problem Statement:** A linear actuator on a gantry robot produces pure translational velocity $v = [0, 3, -4]^T\text{ m/s}$ with $\omega = [0, 0, 0]^T$. Compute the matrix exponential $\exp([\mathcal{V}]t)$ for $t = 2.0\text{ s}$.

**Solution:**
1. For pure translation ($\omega = 0$), $[\omega]^k = 0$ for all $k \ge 1$.
2. The exponential series simplifies to:
   $$\exp([\mathcal{V}]t) = \begin{bmatrix} I & v t \\ 0 & 1 \end{bmatrix}$$
3. Compute the displacement:
   $$v t = 2.0 \begin{bmatrix} 0 \\ 3 \\ -4 \end{bmatrix} = \begin{bmatrix} 0 \\ 6 \\ -8 \end{bmatrix}\text{ m}$$
4. Construct the transformation:
   $$\exp([\mathcal{V}]t) = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 6 \\ 0 & 0 & 1 & -8 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 2.12: Rotation about an Off-Origin Arbitrary Axis
**Problem Statement:** A robot revolute joint rotates by $\theta = 90^\circ$ about an axis parallel to $\hat{z}$ passing through point $q = [2.0, 1.0, 0.0]^T\text{ m}$. Derive the $4 \times 4$ homogeneous transformation matrix $T$.

**Solution:**
1. Unit direction: $\hat{\omega} = [0, 0, 1]^T$.
2. Linear velocity component of the screw:
   $$v = -\hat{\omega} \times q = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} = -\begin{bmatrix} -1 \\ 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ -2 \\ 0 \end{bmatrix}$$
3. The rotational submatrix for $\theta = 90^\circ$ is:
   $$R = \operatorname{Rot}_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
4. The translational displacement for pure rotation around off-origin point $q$ is:
   $$p = (I - R) q = \left( \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} - \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \right) \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 & 1 & 0 \\ -1 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 3 \\ -1 \\ 0 \end{bmatrix}\text{ m}$$
5. Assemble $T$:
   $$T = \begin{bmatrix} 0 & -1 & 0 & 3 \\ 1 & 0 & 0 & -1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 2.13: Group Inverse of a Cascade of Three Homogeneous Transformations
**Problem Statement:** Prove that $(T_1 T_2 T_3)^{-1} = T_3^{-1} T_2^{-1} T_1^{-1}$ using the group axioms of $SE(3)$.

**Solution:**
1. Let $A = T_1 T_2 T_3$ and $B = T_3^{-1} T_2^{-1} T_1^{-1}$.
2. Multiply $A$ by $B$ using the associative law:
   $$A B = (T_1 T_2 T_3)(T_3^{-1} T_2^{-1} T_1^{-1}) = T_1 T_2 (T_3 T_3^{-1}) T_2^{-1} T_1^{-1}$$
3. Since $T_3 T_3^{-1} = I$:
   $$A B = T_1 T_2 I T_2^{-1} T_1^{-1} = T_1 (T_2 T_2^{-1}) T_1^{-1} = T_1 I T_1^{-1} = T_1 T_1^{-1} = I$$
4. Similarly, $B A = I$. By uniqueness of the inverse in group theory, $A^{-1} = B$.

---

### Problem 2.14: Quaternion Multiplication vs. Matrix Multiplication Equivalence
**Problem Statement:** Let $q_1 = (0, 1, 0, 0)$ (a $180^\circ$ rotation about $\hat{x}$) and $q_2 = (0, 0, 1, 0)$ (a $180^\circ$ rotation about $\hat{y}$). Compute the Hamilton product $q_3 = q_1 q_2$ and show that the corresponding rotation matrix matches $R(q_1) R(q_2)$.

**Solution:**
1. Quaternion multiplication formula:
   $$(w_1, v_1)(w_2, v_2) = (w_1 w_2 - v_1 \cdot v_2, \; w_1 v_2 + w_2 v_1 + v_1 \times v_2)$$
2. Here $w_1 = 0, v_1 = [1, 0, 0]^T$ and $w_2 = 0, v_2 = [0, 1, 0]^T$:
   $$w_3 = 0(0) - [1, 0, 0] \cdot [0, 1, 0] = 0$$
   $$v_3 = 0 + 0 + [1, 0, 0]^T \times [0, 1, 0]^T = [0, 0, 1]^T$$
   $$q_3 = (0, 0, 0, 1)$$
   (a $180^\circ$ rotation about $\hat{z}$).
3. In matrix form:
   $$R(q_1) = \operatorname{Rot}_x(180^\circ) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   $$R(q_2) = \operatorname{Rot}_y(180^\circ) = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   $$R_1 R_2 = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \operatorname{Rot}_z(180^\circ) = R(q_3)$$
   The Hamilton product perfectly mirrors $SO(3)$ matrix multiplication.

---

### Problem 2.15: Singularity in Matrix Logarithm at $\theta = \pi$
**Problem Statement:** A rotation matrix is given by $R = \operatorname{diag}(-1, -1, 1)$. Explain why the standard logarithmic formula $[\hat{\omega}] = \frac{1}{2\sin\theta}(R - R^T)$ fails, and derive the correct unit axis $\hat{\omega}$.

**Solution:**
1. Compute the trace:
   $$\operatorname{tr}(R) = -1 - 1 + 1 = -1 \implies \cos\theta = \frac{-1 - 1}{2} = -1 \implies \theta = \pi\text{ rad}$$
2. Evaluating $\sin\pi = 0$:
   The denominator $2\sin\theta$ becomes zero, causing division by zero. Furthermore, $R - R^T = 0$, so $\frac{0}{0}$ is undefined.
3. At $\theta = \pi$, Rodrigues' formula yields:
   $$R = I + 2 [\hat{\omega}]^2 = I + 2 (\hat{\omega} \hat{\omega}^T - I) = 2 \hat{\omega} \hat{\omega}^T - I$$
4. Rearranging:
   $$\hat{\omega} \hat{\omega}^T = \frac{1}{2} (R + I) = \frac{1}{2} \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 2 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
5. Taking the square root of the diagonal entries gives $\hat{\omega} = [0, 0, \pm 1]^T$.

---

### Problem 2.16: Dual Quaternion Representation of Rigid Transformations
**Problem Statement:** Formulate the dual quaternion $\hat{q} = q_r + \epsilon q_d$ ($\epsilon^2 = 0$) for a translation $p = [0, 0, 2]^T$ and identity rotation $q_r = (1, 0, 0, 0)$.

**Solution:**
1. Real part: $q_r = (1, 0, 0, 0)$.
2. Dual part formula:
   $$q_d = \frac{1}{2} \mathbf{p} q_r$$
   where $\mathbf{p} = (0, p_x, p_y, p_z) = (0, 0, 0, 2)$.
3. Compute quaternion product:
   $$q_d = \frac{1}{2} (0, 0, 0, 2)(1, 0, 0, 0) = (0, 0, 0, 1)$$
4. The unit dual quaternion is:
   $$\hat{q} = (1, 0, 0, 0) + \epsilon (0, 0, 0, 1)$$

---

### Problem 2.17: Proof of Adjoint Product Property $\operatorname{Ad}_{T_1 T_2} = \operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2}$
**Problem Statement:** Prove analytically that for any $T_1, T_2 \in SE(3)$, $\operatorname{Ad}_{T_1 T_2} = \operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2}$.

**Solution:**
1. Let $T_1 = \begin{bmatrix} R_1 & p_1 \\ 0 & 1 \end{bmatrix}$ and $T_2 = \begin{bmatrix} R_2 & p_2 \\ 0 & 1 \end{bmatrix}$.
2. Their composition is $T_{12} = \begin{bmatrix} R_1 R_2 & R_1 p_2 + p_1 \\ 0 & 1 \end{bmatrix}$.
3. By definition of the adjoint:
   $$\operatorname{Ad}_{T_{12}} = \begin{bmatrix} R_1 R_2 & 0 \\ [R_1 p_2 + p_1] R_1 R_2 & R_1 R_2 \end{bmatrix}$$
4. Multiply individual adjoints:
   $$\operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2} = \begin{bmatrix} R_1 & 0 \\ [p_1] R_1 & R_1 \end{bmatrix} \begin{bmatrix} R_2 & 0 \\ [p_2] R_2 & R_2 \end{bmatrix} = \begin{bmatrix} R_1 R_2 & 0 \\ [p_1] R_1 R_2 + R_1 [p_2] R_2 & R_1 R_2 \end{bmatrix}$$
5. Using the skew-symmetric identity $[R v] = R [v] R^T$:
   $$R_1 [p_2] R_2 = R_1 [p_2] R_1^T R_1 R_2 = [R_1 p_2] R_1 R_2$$
   Hence:
   $$[p_1] R_1 R_2 + [R_1 p_2] R_1 R_2 = [R_1 p_2 + p_1] R_1 R_2$$
6. Therefore, $\operatorname{Ad}_{T_1 T_2} = \operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2}$.

---

### Problem 2.18: Pitch Calculation for Robotic Bolt Threading
**Problem Statement:** An autonomous assembly robot threads an M10 bolt with standard pitch $1.5\text{ mm/rev}$. Express this helical motion as a normalized spatial twist $\mathcal{S} = (\omega, v)$ along the $\hat{z}$ axis.

**Solution:**
1. Angular velocity: $\omega = [0, 0, 1]^T\text{ rad/s}$.
2. A full revolution is $2\pi\text{ rad}$. In $2\pi\text{ rad}$, the bolt translates by $1.5\text{ mm} = 0.0015\text{ m}$.
3. Linear translation per radian (screw pitch $h$):
   $$h = \frac{0.0015\text{ m}}{2\pi\text{ rad}} = \frac{0.0015}{6.283185} \approx 0.00023873\text{ m/rad} = 0.23873\text{ mm/rad}$$
4. Since the motion is along the axis passing through the origin ($q = 0$), $v = h \omega$:
   $$v = [0, 0, 0.00023873]^T\text{ m/s}$$
5. The unit twist is:
   $$\mathcal{S} = [0, 0, 1, 0, 0, 0.00023873]^T$$

---

### Problem 2.19: Body vs. Spatial Twist Relationships
**Problem Statement:** Prove that the spatial twist $\mathcal{V}_s = \dot{T} T^{-1}$ and the body twist $\mathcal{V}_b = T^{-1} \dot{T}$ are related by $\mathcal{V}_s = \operatorname{Ad}_T \mathcal{V}_b$.

**Solution:**
1. Start with $\mathcal{V}_s = \dot{T} T^{-1}$.
2. Insert the identity $I = T T^{-1}$ into $\mathcal{V}_s$:
   $$\mathcal{V}_s = T (T^{-1} \dot{T}) T^{-1} = T [\mathcal{V}_b] T^{-1}$$
3. Expanding the matrix equation for $T = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$ and $[\mathcal{V}_b] = \begin{bmatrix} [\omega_b] & v_b \\ 0 & 0 \end{bmatrix}$:
   $$T [\mathcal{V}_b] T^{-1} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} [\omega_b] & v_b \\ 0 & 0 \end{bmatrix} \begin{bmatrix} R^T & -R^T p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} R [\omega_b] R^T & -R [\omega_b] R^T p + R v_b \\ 0 & 0 \end{bmatrix}$$
4. Recognizing that $R [\omega_b] R^T = [R \omega_b]$ and $-[R \omega_b] p = [p] R \omega_b$:
   $$T [\mathcal{V}_b] T^{-1} = \begin{bmatrix} [R \omega_b] & [p] R \omega_b + R v_b \\ 0 & 0 \end{bmatrix} = [\operatorname{Ad}_T \mathcal{V}_b]$$
5. Hence, $\mathcal{V}_s = \operatorname{Ad}_T \mathcal{V}_b$.

---

### Problem 2.20: Principle of Virtual Work and Power Invariance
**Problem Statement:** Prove that the mechanical power $P = \mathcal{V}^T \mathcal{F}$ delivered by an actuator is invariant under any coordinate frame transformation $T_{ab} \in SE(3)$.

**Solution:**
1. In frame $\{b\}$, power is $P_b = \mathcal{V}_b^T \mathcal{F}_b$.
2. The twist transforms as $\mathcal{V}_a = \operatorname{Ad}_{T_{ab}} \mathcal{V}_b \implies \mathcal{V}_b = \operatorname{Ad}_{T_{ab}}^{-1} \mathcal{V}_a$.
3. The wrench transforms as $\mathcal{F}_b = \operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a$.
4. Substitute both into $P_b$:
   $$P_b = (\operatorname{Ad}_{T_{ab}}^{-1} \mathcal{V}_a)^T (\operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a) = \mathcal{V}_a^T (\operatorname{Ad}_{T_{ab}}^{-1})^T \operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a$$
5. Using $(A^{-1})^T A^T = (A A^{-1})^T = I^T = I$:
   $$P_b = \mathcal{V}_a^T I \mathcal{F}_a = \mathcal{V}_a^T \mathcal{F}_a = P_a$$
6. Power is strictly invariant under frame transformations.
