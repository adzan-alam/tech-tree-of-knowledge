# Chapter 7: Camera Calibration, Planar Homographies, and Perspective Warping

---

## 7.1 Planar Homographies and 2D Projective Transformations

In computer vision and robotics, many critical perceptual tasks operate on planar surfaces: inspecting printed circuit boards, tracking checkerboard calibration patterns, reading planar barcodes/QR tags, and synthesizing bird's-eye view (BEV) ground planes for self-driving vehicles.

When a planar surface in the 3D world is imaged by a perspective camera, the mapping between the world plane and the 2D image plane—or between two distinct camera views of the same planar surface—is a **planar homography** (also known as a **projective collineation**).

```
                         THE PLANAR HOMOGRAPHY MAPPING
                         
             World Plane Π                                   Image Plane
           ┌───────────────┐                             ┌─────────────────┐
           │   o (X, Y)    │                             │        .        │
           │   │           │      Homography H           │       /         │
           │   │           │ ───────────────────────►    │      o (u, v)   │
           │   └───────────┘                             │                 │
           └───────────────┘                             └─────────────────┘
           3D Coordinates on                            2D Pixel Coordinates
           World Plane (Z = 0)                           on Image Sensor
```

### The Homography Matrix H
Let $\mathbf{x} = [x, y, 1]^\top$ and $\mathbf{x}' = [u, v, 1]^\top$ denote corresponding homogeneous 2D coordinates on two projective planes. A planar homography is a linear transformation $\mathbf{H} \in \mathbb{R}^{3 \times 3}$:

$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{H} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix} = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

Expanding the matrix multiplication and dividing by the third homogeneous coordinate:
$$u = \frac{h_{11} x + h_{12} y + h_{13}}{h_{31} x + h_{32} y + h_{33}}, \quad v = \frac{h_{21} x + h_{22} y + h_{23}}{h_{31} x + h_{32} y + h_{33}}$$

### The 2D Transformation Hierarchy
Planar homographies form the highest tier of the 2D geometric transformation hierarchy:

```
                      THE 2D TRANSFORMATION HIERARCHY
                      
    Transformation    Matrix Structure                  DoF   Invariants
    ──────────────────────────────────────────────────────────────────────────────────
    Euclidean         [ R_{2x2} | t_{2x1} ]              3    Lengths, Angles, Areas
    (Isometry)        [  0   0  |   1     ]
    
    Similarity        [ s*R_{2x2} | t_{2x1} ]            4    Angles, Length Ratios
                      [   0   0   |   1     ]
    
    Affine            [ a11 a12 | tx ]                   6    Parallelism, Ratio of
                      [ a21 a22 | ty ]                        parallel lengths/areas
                      [  0   0  |  1 ]
    
    Projective        [ h11 h12 | h13 ]                  8    Collinearity, Cross-ratio,
    (Homography)      [ h21 h22 | h23 ]                       Tangency
                      [ h31 h32 | h33 ]
```

#### Invariance Properties:
1. **Collinearity:** Straight lines on the source plane always map to straight lines on the target plane.
2. **Cross-Ratio Invariance:** For four collinear points $A, B, C, D$, the cross-ratio:
   $$\text{Cr}(A, B; C, D) = \frac{(x_C - x_A)(x_D - x_B)}{(x_C - x_B)(x_D - x_A)}$$
   is strictly preserved under any projective homography.
3. **Loss of Parallelism:** Parallel lines generally do NOT remain parallel; their projections intersect at a vanishing point unless the line is parallel to the intersection of the two planes.

---

## 7.2 The Direct Linear Transformation (DLT) Algorithm

A planar homography matrix $\mathbf{H}$ contains 9 entries, but because $\mathbf{H}$ is defined up to an arbitrary non-zero scalar ($\mathbf{H} \sim \alpha \mathbf{H}$), it possesses exactly **8 degrees of freedom (DoF)**.

The **Direct Linear Transformation (DLT)** algorithm is the foundational method for solving $\mathbf{H}$ from a set of known 2D point correspondences $\mathbf{x}_i \leftrightarrow \mathbf{x}_i'$.

```
                 DIRECT LINEAR TRANSFORMATION CORRESPONDENCES
                 
           Source Plane                                Target Plane
         ┌───────────────┐                           ┌───────────────┐
         │ 1           2 │                           │    1          │
         │   o───────o   │                           │     o──────o 2│
         │   │       │   │   ────► H via DLT ───►    │    /      /   │
         │   o───────o   │                           │   o──────o    │
         │ 4           3 │                           │  4        3   │
         └───────────────┘                           └───────────────┘
          Min 4 Points (No 3 Collinear) Solves the 8 DoF Homography!
```

### Derivation of the Linear System
For any correspondence $\mathbf{x}_i = [x_i, y_i, 1]^\top \leftrightarrow \mathbf{x}_i' = [u_i, v_i, 1]^\top$, the transformed homogeneous vector $\mathbf{H} \mathbf{x}_i$ is parallel to $\mathbf{x}_i'$.
Two 3D vectors are parallel if and only if their vector cross-product is zero:
$$\mathbf{x}_i' \times (\mathbf{H} \mathbf{x}_i) = \mathbf{0}_{3 \times 1}$$

Let the rows of $\mathbf{H}$ be denoted by $\mathbf{h}_1^\top, \mathbf{h}_2^\top, \mathbf{h}_3^\top$, so $\mathbf{H} \mathbf{x}_i = \begin{bmatrix} \mathbf{h}_1^\top \mathbf{x}_i \\ \mathbf{h}_2^\top \mathbf{x}_i \\ \mathbf{h}_3^\top \mathbf{x}_i \end{bmatrix}$.
Evaluating the cross product:
$$\begin{bmatrix} u_i \\ v_i \\ 1 \end{bmatrix} \times \begin{bmatrix} \mathbf{h}_1^\top \mathbf{x}_i \\ \mathbf{h}_2^\top \mathbf{x}_i \\ \mathbf{h}_3^\top \mathbf{x}_i \end{bmatrix} = \begin{bmatrix} v_i (\mathbf{h}_3^\top \mathbf{x}_i) - (\mathbf{h}_2^\top \mathbf{x}_i) \\ (\mathbf{h}_1^\top \mathbf{x}_i) - u_i (\mathbf{h}_3^\top \mathbf{x}_i) \\ u_i (\mathbf{h}_2^\top \mathbf{x}_i) - v_i (\mathbf{h}_1^\top \mathbf{x}_i) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$

Notice that the third equation is a linear combination of the first two (multiplying the first by $-u_i$ and the second by $-v_i$ yields the third). Thus, each point correspondence contributes **two linearly independent equations**:

$$\begin{aligned}
-\mathbf{h}_2^\top \mathbf{x}_i + v_i (\mathbf{h}_3^\top \mathbf{x}_i) &= 0 \\
\mathbf{h}_1^\top \mathbf{x}_i - u_i (\mathbf{h}_3^\top \mathbf{x}_i) &= 0
\end{aligned}$$

Flattening the $3 \times 3$ matrix into a 9-element vector:
$$\mathbf{h} = \begin{bmatrix} h_{11} & h_{12} & h_{13} & h_{21} & h_{22} & h_{23} & h_{31} & h_{32} & h_{33} \end{bmatrix}^\top \in \mathbb{R}^9$$

We rewrite the two equations in matrix form $\mathbf{A}_i \mathbf{h} = \mathbf{0}$:
$$\begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & u_i x_i & u_i y_i & u_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & v_i x_i & v_i y_i & v_i \end{bmatrix} \mathbf{h} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

### Minimum Number of Points
- Each point correspondence provides $2$ independent constraints.
- A homography has $8$ DoF.
- Therefore, a minimum of $N = 4$ point correspondences (with no 3 collinear) is required:
  $$2 \times 4 = 8 \text{ equations}$$
  The matrix $\mathbf{A}$ has dimensions $8 \times 9$, yielding a 1D nullspace containing the unique solution $\mathbf{h}$.

### Overdetermined Systems ($N > 4$) and SVD Solution
In real robotic systems, sensor noise corrupts point coordinates. We measure $N > 4$ correspondences (often dozens or hundreds), forming an overdetermined system $\mathbf{A} \mathbf{h} \approx \mathbf{0}$ of size $2N \times 9$.

Because of noise, no exact non-trivial nullspace exists ($\mathbf{A} \mathbf{h} \neq \mathbf{0}$). We formulate the problem as a **constrained linear least-squares optimization**:
$$\min_{\mathbf{h}} \|\mathbf{A} \mathbf{h}\|^2 \quad \text{subject to } \|\mathbf{h}\| = 1$$

#### Theorem (SVD Solution to Homogeneous Least-Squares):
By the Rayleigh-Ritz theorem, let the Singular Value Decomposition (SVD) of $\mathbf{A} \in \mathbb{R}^{2N \times 9}$ be:
$$\mathbf{A} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^\top$$
where $\boldsymbol{\Sigma} = \text{diag}(\sigma_1, \sigma_2, \dots, \sigma_9)$ with singular values in descending order $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_9 \ge 0$.
The optimal solution $\mathbf{h}^*$ that minimizes $\|\mathbf{A} \mathbf{h}\|^2$ subject to $\|\mathbf{h}\| = 1$ is the **ninth column of $\mathbf{V}$** (the right singular vector corresponding to the smallest singular value $\sigma_9$).

---

## 7.3 Data Normalization: The Hartley Preconditioning Standard

If the DLT algorithm is executed directly on raw pixel coordinates, the computed homography is frequently unstable. In 1997, Richard Hartley published the seminal paper *"In Defence of the Point Normalization Algorithm"*, proving that raw DLT is ruined by ill-conditioned numerical scaling.

### The Numerical Conditioning Crisis
Consider an HD image where pixel coordinates are around $x \approx 1000, y \approx 1000$.
In the matrix $\mathbf{A}_i$:
$$\mathbf{A}_i = \begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & u_i x_i & u_i y_i & u_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & v_i x_i & v_i y_i & v_i \end{bmatrix}$$
- The first three entries have magnitude $\approx 10^3$.
- The constant entries have magnitude $1$.
- The quadratic cross-terms $u_i x_i \approx 1000 \times 1000 \approx 10^6$.

The matrix contains entries varying over six orders of magnitude ($1$ to $10^6$). In the product $\mathbf{A}^\top \mathbf{A}$, elements scale as $(10^6)^2 = 10^{12}$. The condition number $\kappa(\mathbf{A}) = \frac{\sigma_{\text{max}}}{\sigma_{\text{min}}}$ explodes, causing severe roundoff error.

### Hartley Normalization Algorithm
Hartley proposed pre-conditioning the point coordinates with an affine similarity transform $\mathbf{T}$ such that:
1. The **centroid** of the point set is shifted to the coordinate origin $(0, 0)$.
2. The coordinates are scaled so that the **average Euclidean distance** from the origin is $\sqrt{2}$.

```
                         HARTLEY POINT NORMALIZATION
                         
            Raw Pixel Coordinates                  Normalized Coordinates
          (Origin at Top-Left, 0..1920)          (Origin at Centroid, Scale ~ 1)
          ┌───────────────────────────┐                 ▲ y_norm
          │ o       o                 │                 │    o
          │            o              │                 │ o     o
          │      o          o         │     ──► T ──►   ┼───────┼──────► x_norm
          │                 Centroid  │                 │    o     o
          │                     x     │                 │
          └───────────────────────────┘
```

#### Step 1: Compute Centroid and Scale
For $N$ points $\{\mathbf{x}_i = [x_i, y_i]^\top\}_{i=1}^N$:
$$\bar{x} = \frac{1}{N} \sum_{i=1}^N x_i, \quad \bar{y} = \frac{1}{N} \sum_{i=1}^N y_i$$
Compute average distance to centroid:
$$d_{\text{avg}} = \frac{1}{N} \sum_{i=1}^N \sqrt{(x_i - \bar{x})^2 + (y_i - \bar{y})^2}$$
The scale factor is:
$$s = \frac{\sqrt{2}}{d_{\text{avg}}}$$

#### Step 2: Construct Normalization Matrix T
$$\mathbf{T} = \begin{bmatrix} s & 0 & -s \bar{x} \\ 0 & s & -s \bar{y} \\ 0 & 0 & 1 \end{bmatrix}$$
Transform points: $\tilde{\mathbf{x}}_i = \mathbf{T} \mathbf{x}_i$.
Similarly, compute normalization transform $\mathbf{T}'$ for target points: $\tilde{\mathbf{x}}_i' = \mathbf{T}' \mathbf{x}_i'$.

#### Step 3: Solve DLT on Normalized Points
Solve $\tilde{\mathbf{A}} \tilde{\mathbf{h}} = \mathbf{0}$ via SVD to obtain normalized homography $\tilde{\mathbf{H}}$.

#### Step 4: De-normalize
The relationship between normalized coordinates is $\tilde{\mathbf{x}}' = \tilde{\mathbf{H}} \tilde{\mathbf{x}}$.
Substituting $\tilde{\mathbf{x}}' = \mathbf{T}' \mathbf{x}'$ and $\tilde{\mathbf{x}} = \mathbf{T} \mathbf{x}$:
$$\mathbf{T}' \mathbf{x}' = \tilde{\mathbf{H}} \mathbf{T} \mathbf{x} \implies \mathbf{x}' = (\mathbf{T}')^{-1} \tilde{\mathbf{H}} \mathbf{T} \mathbf{x}$$
The true physical homography matrix is recovered as:
$$\mathbf{H} = (\mathbf{T}')^{-1} \tilde{\mathbf{H}} \mathbf{T}$$

---

## 7.4 Zhang's Method: Closed-Form Camera Calibration from Planar Targets

Before 1998, camera calibration required specialized 3D calibration rigs with precise millimeter manufacturing tolerances. Zhengyou Zhang (Microsoft Research) revolutionized the field by showing that full intrinsic camera calibration $\mathbf{K}$ and lens distortion can be achieved simply by observing a planar checkerboard pattern at multiple arbitrary orientations.

```
                     ZHANG'S CAMERA CALIBRATION SETUP
                     
                                 Planar Checkerboard Target
                                   (Known Square Size d)
                                       ┌───┬───┬───┐
                                       │ # │   │ # │
                                       ├───┼───┼───┤
       Camera Views                    │   │ # │   │
       (Min 3 Poses)                   └───┴───┴───┘
            Camera Pose 1                     │
                [o]                           ▼ (Pose 2: Rotated)
                 \                        ┌───┬───┬───┐
                  \                      / # /   / # /
                   \                    /───/───/───/
            Camera Pose 2              /   / # /   /
                [o]──────────────────► └───┴───┴───┘
```

### Planar Target Geometry ($Z_W = 0$)
Without loss of generality, fix the world coordinate system on the checkerboard plane such that $Z_W = 0$.
The 3D coordinates of target corners are known precisely: $\mathbf{X}_W = [X_W, Y_W, 0, 1]^\top$.

The projection equation becomes:
$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{r}_3 \mid \mathbf{t}] \begin{bmatrix} X_W \\ Y_W \\ 0 \\ 1 \end{bmatrix} = \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{t}] \begin{bmatrix} X_W \\ Y_W \\ 1 \end{bmatrix}$$

This reveals that the projection of the checkerboard plane is governed by a planar homography:
$$\mathbf{H} = [\mathbf{h}_1 \mid \mathbf{h}_2 \mid \mathbf{h}_3] = \lambda \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{t}]$$
where $\mathbf{h}_1 = \lambda \mathbf{K} \mathbf{r}_1$, $\mathbf{h}_2 = \lambda \mathbf{K} \mathbf{r}_2$, and $\mathbf{h}_3 = \lambda \mathbf{K} \mathbf{t}$.

Inverting the relationship:
$$\mathbf{r}_1 = \frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_1, \quad \mathbf{r}_2 = \frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_2$$

### The Two Fundamental Intrinsic Constraints
Because $\mathbf{R} = [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{r}_3]$ is a valid rotation matrix in $\text{SO}(3)$, its columns must satisfy the fundamental orthonormality axioms:
1. **Orthogonality ($\mathbf{r}_1 \perp \mathbf{r}_2$):**
   $$\mathbf{r}_1^\top \mathbf{r}_2 = 0 \implies \left(\frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_1\right)^\top \left(\frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_2\right) = 0 \implies \mathbf{h}_1^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_2 = 0$$

2. **Equal Length ($\|\mathbf{r}_1\| = \|\mathbf{r}_2\| = 1$):**
   $$\|\mathbf{r}_1\|^2 = \|\mathbf{r}_2\|^2 \implies \mathbf{h}_1^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_1 = \mathbf{h}_2^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_2$$

### The Image of the Absolute Conic (B Matrix)
Define the symmetric matrix $\mathbf{B} \in \mathbb{R}^{3 \times 3}$:
$$\mathbf{B} \triangleq \mathbf{K}^{-\top} \mathbf{K}^{-1} = \begin{bmatrix} B_{11} & B_{12} & B_{13} \\ B_{12} & B_{22} & B_{23} \\ B_{13} & B_{23} & B_{33} \end{bmatrix}$$
In projective geometry, $\mathbf{B}$ is the **Image of the Absolute Conic (IAC)**. Because $\mathbf{B}$ is real and symmetric, it contains only **6 unique parameters**:
$$\mathbf{b} = [B_{11}, B_{12}, B_{22}, B_{13}, B_{23}, B_{33}]^\top \in \mathbb{R}^6$$

Using vector $\mathbf{b}$, the quadratic form $\mathbf{h}_i^\top \mathbf{B} \mathbf{h}_j$ can be rewritten as a linear dot product:
$$\mathbf{h}_i^\top \mathbf{B} \mathbf{h}_j = \mathbf{v}_{ij}^\top \mathbf{b}$$
where:
$$\mathbf{v}_{ij} = \begin{bmatrix} h_{i1} h_{j1} \\ h_{i1} h_{j2} + h_{i2} h_{j1} \\ h_{i2} h_{j2} \\ h_{i3} h_{j1} + h_{i1} h_{j3} \\ h_{i3} h_{j2} + h_{i2} h_{j3} \\ h_{i3} h_{j3} \end{bmatrix}$$

The two geometric constraints become two linear scalar equations:
$$\begin{bmatrix} \mathbf{v}_{12}^\top \\ (\mathbf{v}_{11} - \mathbf{v}_{22})^\top \end{bmatrix} \mathbf{b} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

### Solving for Intrinsics
- Each image view of the checkerboard provides an estimated homography $\mathbf{H}_k$, which contributes **2 independent linear equations** on $\mathbf{b}$.
- The vector $\mathbf{b}$ has 6 parameters (5 DoF up to scale).
- Therefore, observing the checkerboard in **$K \ge 3$ distinct, non-parallel orientations** yields $2K \ge 6$ linear equations $\mathbf{V} \mathbf{b} = \mathbf{0}$, uniquely determining $\mathbf{b}$ via SVD!
- Once $\mathbf{b}$ is found, matrix $\mathbf{B} = \mathbf{K}^{-\top} \mathbf{K}^{-1}$ is assembled.
- Applying **Cholesky factorization** ($\mathbf{B} = \mathbf{L} \mathbf{L}^\top$) immediately recovers the intrinsic matrix $\mathbf{K} = \mathbf{L}^{-\top}$!

---

## 7.5 Inverse Perspective Mapping (IPM) for Robotic Ground Planes

For an autonomous ground vehicle, cameras capture the road in perspective. Parallel lane markings converge toward the horizon, and distant obstacles appear compressed.

**Inverse Perspective Mapping (IPM)** eliminates perspective foreshortening by computing the homography between the camera image plane and the horizontal road plane, warping the camera view into an orthographic **Bird's-Eye View (BEV)**.

```
                         INVERSE PERSPECTIVE MAPPING (IPM)
                         
             Perspective Camera View                      Bird's-Eye View (BEV)
           ┌───────────────────────────┐                 ┌───────────────────┐
           │             |             │                 │   |           |   │
           │            / \            │                 │   |           |   │
           │           /   \           │  ──► H_IPM ──►  │   |     o     |   │
           │          /     \          │                 │   |  Obstacle |   │
           │         /   o   \         │                 │   |           |   │
           │        / Obstacle\        │                 │   |           |   │
           └───────────────────────────┘                 └───────────────────┘
             Converging Lane Markers                       Parallel Lane Lines
             (Severe Metric Distortion)                    (True Metric Grid!)
```

### Derivation of the Ground Homography
1. Let the road surface be the world plane $Z_W = 0$.
2. The camera pose relative to the road has height $h$, pitch angle $\theta$, and roll $\phi$.
3. The homography mapping ground coordinates $(X_W, Y_W)$ to image pixels $(u, v)$ is:
   $$\mathbf{H}_{GW} = \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{t}]$$
4. To synthesize the top-down view, we invert the mapping:
   $$\mathbf{H}_{\text{IPM}} = \mathbf{H}_{GW}^{-1}$$
   Every pixel in the BEV image represents a calibrated metric distance (e.g., $1\text{ pixel} = 2.0\text{ cm}$). Autonomous planning algorithms can perform collision checking and trajectory generation directly in this metric grid.

---

## 7.6 Worked Examples

### Problem 7.1: DLT Homography Matrix Formulation
**Statement:** Four 2D point correspondences $\mathbf{x}_i \leftrightarrow \mathbf{x}_i'$ are given:
- $\mathbf{x}_1 = [0, 0]^\top \leftrightarrow \mathbf{x}_1' = [100, 100]^\top$
- $\mathbf{x}_2 = [1, 0]^\top \leftrightarrow \mathbf{x}_2' = [200, 100]^\top$
- $\mathbf{x}_3 = [1, 1]^\top \leftrightarrow \mathbf{x}_3' = [200, 200]^\top$
- $\mathbf{x}_4 = [0, 1]^\top \leftrightarrow \mathbf{x}_4' = [100, 200]^\top$
Write the two linear constraint rows in $\mathbf{A} \mathbf{h} = \mathbf{0}$ contributed by point 1 ($\mathbf{x}_1 \leftrightarrow \mathbf{x}_1'$).

**Step-by-step Solution:**
1. In homogeneous coordinates:
   $$\mathbf{x}_1 = [x_1, y_1, 1]^\top = [0, 0, 1]^\top, \quad \mathbf{x}_1' = [u_1, v_1, 1]^\top = [100, 100, 1]^\top$$
2. Recall the general DLT row pair:
   $$\mathbf{A}_i = \begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & u_i x_i & u_i y_i & u_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & v_i x_i & v_i y_i & v_i \end{bmatrix}$$
3. Substitute $x_1 = 0, y_1 = 0, u_1 = 100, v_1 = 100$:
   - Row 1:
     $$\begin{bmatrix} -0 & -0 & -1 & 0 & 0 & 0 & (100)(0) & (100)(0) & 100 \end{bmatrix} = \begin{bmatrix} 0 & 0 & -1 & 0 & 0 & 0 & 0 & 0 & 100 \end{bmatrix}$$
   - Row 2:
     $$\begin{bmatrix} 0 & 0 & 0 & -0 & -0 & -1 & (100)(0) & (100)(0) & 100 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 & 0 & 0 & -1 & 0 & 0 & 100 \end{bmatrix}$$
4. The equations enforce:
   $$-h_{13} + 100 h_{33} = 0 \implies h_{13} = 100 h_{33}$$
   $$-h_{23} + 100 h_{33} = 0 \implies h_{23} = 100 h_{33}$$
   Setting $h_{33} = 1$ confirms the translation offset of $(100, 100)$ pixels.

---

### Problem 7.2: Planar Homography Warping of a 2D Point
**Statement:** A planar homography matrix is:
$$\mathbf{H} = \begin{bmatrix} 2.0 & 0.5 & 50.0 \\ 0.0 & 1.5 & 30.0 \\ 0.001 & 0.002 & 1.0 \end{bmatrix}$$
Compute the warped pixel coordinates $(u, v)$ for the source point $(x, y) = (100, 200)$.

**Step-by-step Solution:**
1. Express source point in homogeneous coordinates: $\tilde{\mathbf{x}} = [100, 200, 1]^\top$.
2. Compute matrix-vector product:
   $$\begin{aligned}
   \begin{bmatrix} \tilde{u} \\ \tilde{v} \\ \tilde{w} \end{bmatrix} &= \mathbf{H} \tilde{\mathbf{x}} = \begin{bmatrix} 2.0 & 0.5 & 50.0 \\ 0.0 & 1.5 & 30.0 \\ 0.001 & 0.002 & 1.0 \end{bmatrix} \begin{bmatrix} 100 \\ 200 \\ 1 \end{bmatrix} \\
   &= \begin{bmatrix} 2.0(100) + 0.5(200) + 50.0(1) \\ 0.0(100) + 1.5(200) + 30.0(1) \\ 0.001(100) + 0.002(200) + 1.0(1) \end{bmatrix} \\
   &= \begin{bmatrix} 200 + 100 + 50 \\ 0 + 300 + 30 \\ 0.1 + 0.4 + 1.0 \end{bmatrix} = \begin{bmatrix} 350.0 \\ 330.0 \\ 1.5 \end{bmatrix}
   \end{aligned}$$
3. Perform Cartesian normalization (divide by homogeneous scale $\tilde{w} = 1.5$):
   $$u = \frac{350.0}{1.5} \approx 233.33 \text{ pixels}$$
   $$v = \frac{330.0}{1.5} = 220.0 \text{ pixels}$$
   The point $(100, 200)$ maps to $(233.33, 220.0)$.

---

### Problem 7.3: Hartley Normalization Matrix Computation
**Statement:** A set of 4 corner points is given in raw pixel coordinates:
$$\mathbf{x}_1 = [100, 100]^\top, \quad \mathbf{x}_2 = [700, 100]^\top, \quad \mathbf{x}_3 = [700, 500]^\top, \quad \mathbf{x}_4 = [100, 500]^\top$$
1. Compute the centroid $(\bar{x}, \bar{y})$.
2. Compute the average Euclidean distance $d_{\text{avg}}$ to the centroid.
3. Construct Hartley's $3 \times 3$ normalization matrix $\mathbf{T}$.

**Step-by-step Solution:**
1. **Centroid:**
   $$\bar{x} = \frac{100 + 700 + 700 + 100}{4} = \frac{1600}{4} = 400.0$$
   $$\bar{y} = \frac{100 + 100 + 500 + 500}{4} = \frac{1200}{4} = 300.0$$
   Centroid: $(\bar{x}, \bar{y}) = (400, 300)$.
2. **Euclidean Distances:**
   For each corner, displacement is $(\pm 300, \pm 200)$:
   $$d_i = \sqrt{(\pm 300)^2 + (\pm 200)^2} = \sqrt{90000 + 40000} = \sqrt{130000} \approx 360.555 \text{ pixels}$$
   Since all 4 points are symmetrically placed, their distances are identical:
   $$d_{\text{avg}} = 360.555\text{ pixels}$$
3. **Scale Factor:**
   $$s = \frac{\sqrt{2}}{d_{\text{avg}}} = \frac{1.41421}{360.555} \approx 0.0039223$$
4. **Normalization Matrix $\mathbf{T}$:**
   $$\mathbf{T} = \begin{bmatrix} s & 0 & -s \bar{x} \\ 0 & s & -s \bar{y} \\ 0 & 0 & 1 \end{bmatrix}$$
   $$-s \bar{x} = -(0.0039223)(400) \approx -1.5689$$
   $$-s \bar{y} = -(0.0039223)(300) \approx -1.1767$$
   $$\mathbf{T} \approx \begin{bmatrix} 0.003922 & 0 & -1.5689 \\ 0 & 0.003922 & -1.1767 \\ 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 7.4: Homography Inversion and Backward Warping
**Statement:** A pure affine homography is:
$$\mathbf{H} = \begin{bmatrix} 2 & 0 & 10 \\ 0 & 3 & 20 \\ 0 & 0 & 1 \end{bmatrix}$$
1. Compute the analytical inverse $\mathbf{H}^{-1}$.
2. For an output pixel at $(u, v) = (50, 80)$, find the source pixel coordinate $(x, y)$ to sample from.

**Step-by-step Solution:**
1. **Inverse Matrix $\mathbf{H}^{-1}$:**
   For an affine matrix $\begin{bmatrix} \mathbf{A} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix}$, the inverse is $\begin{bmatrix} \mathbf{A}^{-1} & -\mathbf{A}^{-1} \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix}$.
   Here $\mathbf{A} = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix} \implies \mathbf{A}^{-1} = \begin{bmatrix} 0.5 & 0 \\ 0 & \frac{1}{3} \end{bmatrix}$.
   Translation term:
   $$-\mathbf{A}^{-1} \mathbf{t} = -\begin{bmatrix} 0.5 & 0 \\ 0 & \frac{1}{3} \end{bmatrix} \begin{bmatrix} 10 \\ 20 \end{bmatrix} = -\begin{bmatrix} 5 \\ \frac{20}{3} \end{bmatrix} = \begin{bmatrix} -5 \\ -6.667 \end{bmatrix}$$
   $$\mathbf{H}^{-1} = \begin{bmatrix} 0.5 & 0 & -5 \\ 0 & \frac{1}{3} & -\frac{20}{3} \\ 0 & 0 & 1 \end{bmatrix}$$

2. **Source Coordinate Sampling:**
   $$\begin{bmatrix} x \\ y \\ 1 \end{bmatrix} = \mathbf{H}^{-1} \begin{bmatrix} 50 \\ 80 \\ 1 \end{bmatrix} = \begin{bmatrix} 0.5(50) - 5 \\ \frac{1}{3}(80) - \frac{20}{3} \\ 1 \end{bmatrix} = \begin{bmatrix} 25 - 5 \\ \frac{60}{3} \\ 1 \end{bmatrix} = \begin{bmatrix} 20 \\ 20 \\ 1 \end{bmatrix}$$
   The source coordinate is $(x, y) = (20.0, 20.0)$.

---

### Problem 7.5: Zhang's Orthogonality Constraint Verification
**Statement:** A homography extracted from a checkerboard image is:
$$\mathbf{H} = [\mathbf{h}_1 \mid \mathbf{h}_2 \mid \mathbf{h}_3] = \begin{bmatrix} 600 & 0 & 300 \\ 0 & 600 & 200 \\ 0 & 0 & 1 \end{bmatrix}$$
Assuming known ideal intrinsics $\mathbf{K} = \begin{bmatrix} 600 & 0 & 300 \\ 0 & 600 & 200 \\ 0 & 0 & 1 \end{bmatrix}$, verify whether the columns of $\mathbf{H}$ satisfy Zhang's orthogonality condition $\mathbf{h}_1^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_2 = 0$.

**Step-by-step Solution:**
1. Notice that $\mathbf{H} = \mathbf{K}$.
   Therefore, $\mathbf{K}^{-1} \mathbf{H} = \mathbf{I}_{3 \times 3}$.
2. In terms of columns:
   $$\mathbf{K}^{-1} \mathbf{h}_1 = \mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{K}^{-1} \mathbf{h}_2 = \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
3. Evaluate the inner product:
   $$\mathbf{h}_1^\top (\mathbf{K}^{-\top} \mathbf{K}^{-1}) \mathbf{h}_2 = (\mathbf{K}^{-1} \mathbf{h}_1)^\top (\mathbf{K}^{-1} \mathbf{h}_2) = \mathbf{e}_1^\top \mathbf{e}_2 = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = 0$$
   The condition evaluates identically to zero, confirming perfect orthogonality.

---

### Problem 7.6: Inverse Perspective Mapping Ground Resolution
**Statement:** An automotive camera with $f_y = 1200\text{ pixels}$ is mounted at height $h = 1.2\text{ meters}$ with a downward pitch angle of $\theta = 15^\circ$.
A BEV image is synthesized covering a forward ground range from $Z_{\text{near}} = 3.0\text{ meters}$ to $Z_{\text{far}} = 30.0\text{ meters}$ across an output height of $H_{\text{BEV}} = 900\text{ pixels}$.
Compute the spatial metric resolution of the BEV grid in centimeters per pixel.

**Step-by-step Solution:**
1. Total longitudinal physical ground distance covered:
   $$\Delta Z = Z_{\text{far}} - Z_{\text{near}} = 30.0 - 3.0 = 27.0\text{ meters} = 2700\text{ cm}$$
2. The distance is mapped linearly across $H_{\text{BEV}} = 900\text{ pixels}$.
3. Longitudinal metric resolution:
   $$\text{Resolution} = \frac{\Delta Z}{H_{\text{BEV}}} = \frac{2700\text{ cm}}{900\text{ pixels}} = 3.0\text{ cm/pixel}$$
   Every vertical pixel in the synthesized BEV frame corresponds to exactly $3.0\text{ centimeters}$ on the physical road surface.

---

### Problem 7.7: Cross-Ratio Invariance Verification
**Statement:** Four points on a 1D line in the source plane have coordinates $x_A = 0, x_B = 2, x_C = 3, x_D = 6$.
1. Compute the cross-ratio $\text{Cr}(A, B; C, D)$.
2. If these points are transformed via the 1D homography $x' = \frac{x + 4}{2x + 1}$, compute the transformed coordinates and verify that the cross-ratio is preserved.

**Step-by-step Solution:**
1. **Original Cross-Ratio:**
   $$\text{Cr} = \frac{(x_C - x_A)(x_D - x_B)}{(x_C - x_B)(x_D - x_A)} = \frac{(3 - 0)(6 - 2)}{(3 - 2)(6 - 0)} = \frac{(3)(4)}{(1)(6)} = \frac{12}{6} = 2.0$$
2. **Transformed Coordinates:**
   - $x_A = 0 \implies x_A' = \frac{0 + 4}{0 + 1} = 4.0$
   - $x_B = 2 \implies x_B' = \frac{2 + 4}{2(2) + 1} = \frac{6}{5} = 1.2$
   - $x_C = 3 \implies x_C' = \frac{3 + 4}{2(3) + 1} = \frac{7}{7} = 1.0$
   - $x_D = 6 \implies x_D' = \frac{6 + 4}{2(6) + 1} = \frac{10}{13} \approx 0.76923$
3. **Transformed Cross-Ratio:**
   $$\text{Cr}' = \frac{(x_C' - x_A')(x_D' - x_B')}{(x_C' - x_B')(x_D' - x_A')}$$
   $$\begin{aligned}
   x_C' - x_A' &= 1.0 - 4.0 = -3.0 \\
   x_D' - x_B' &= \frac{10}{13} - \frac{6}{5} = \frac{50 - 78}{65} = -\frac{28}{65} \\
   x_C' - x_B' &= 1.0 - 1.2 = -0.2 = -\frac{1}{5} \\
   x_D' - x_A' &= \frac{10}{13} - 4.0 = \frac{10 - 52}{13} = -\frac{42}{13}
   \end{aligned}$$
   Numerator: $(-3) \times \left(-\frac{28}{65}\right) = \frac{84}{65}$.
   Denominator: $\left(-\frac{1}{5}\right) \times \left(-\frac{42}{13}\right) = \frac{42}{65}$.
   $$\text{Cr}' = \frac{84 / 65}{42 / 65} = \frac{84}{42} = 2.0$$
   $\text{Cr}' = \text{Cr} = 2.0$ exactly! The cross-ratio is strictly invariant.

---

### Problem 7.8: Degrees of Freedom in Affine vs. Projective Homography
**Statement:** Prove why an affine homography requires 3 point correspondences while a projective homography requires 4 point correspondences.

**Step-by-step Solution:**
1. **Affine Transformation:**
   $$\mathbf{H}_{\text{affine}} = \begin{bmatrix} a_{11} & a_{12} & t_x \\ a_{21} & a_{22} & t_y \\ 0 & 0 & 1 \end{bmatrix}$$
   The last row is fixed as $[0, 0, 1]$ because affine mappings preserve points at infinity (parallel lines remain parallel).
   There are exactly $6$ unknown parameters ($a_{11}, a_{12}, a_{21}, a_{22}, t_x, t_y$).
   Each point correspondence provides 2 linear equations:
   $$N_{\text{affine}} = \frac{6 \text{ DoF}}{2 \text{ eq/point}} = 3 \text{ points (non-collinear)}$$

2. **Projective Homography:**
   $$\mathbf{H}_{\text{proj}} = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix}$$
   The last row $[h_{31}, h_{32}, h_{33}]$ is unconstrained, allowing vanishing lines and perspective convergence.
   With global scale invariance, there are $9 - 1 = 8$ degrees of freedom.
   $$N_{\text{proj}} = \frac{8 \text{ DoF}}{2 \text{ eq/point}} = 4 \text{ points (no 3 collinear)}$$

---

### Problem 7.9: Vanishing Line Extraction from Planar Homography
**Statement:** Given the homography $\mathbf{H} = \begin{bmatrix} \mathbf{h}_1^\top \\ \mathbf{h}_2^\top \\ \mathbf{h}_3^\top \end{bmatrix}$ mapping a source plane $\Pi$ to the camera image plane, show that the line $\mathbf{l}_\infty$ on plane $\Pi$ that maps to the line at infinity in the image is given by $\mathbf{h}_3$.

**Step-by-step Solution:**
1. The line at infinity in the target image plane is represented in homogeneous line coordinates as $\mathbf{l}_\infty' = [0, 0, 1]^\top$.
2. In projective geometry, if points transform as $\mathbf{x}' = \mathbf{H} \mathbf{x}$, lines transform via the inverse transpose:
   $$\mathbf{l} = \mathbf{H}^\top \mathbf{l}'$$
3. Substitute $\mathbf{l}' = \mathbf{l}_\infty' = [0, 0, 1]^\top$:
   $$\mathbf{l} = \mathbf{H}^\top \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{h}_1 & \mathbf{h}_2 & \mathbf{h}_3 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \mathbf{h}_3$$
   Therefore, the line vector $\mathbf{h}_3 = [h_{31}, h_{32}, h_{33}]^\top$ represents the vanishing line on the source plane whose points map to infinity in the image.

---

### Problem 7.10: Homography Composition for Multi-Camera Stitching
**Statement:** In an autonomous surveillance drone, Camera 1 and Camera 2 observe a flat ground plane with homographies $\mathbf{H}_1$ and $\mathbf{H}_2$ relative to the ground.
Express the inter-camera homography $\mathbf{H}_{21}$ that warps an image from Camera 1 directly into the perspective of Camera 2.

**Step-by-step Solution:**
1. Let $\mathbf{x}_G$ denote homogeneous coordinates on the ground plane.
2. The projections into the two cameras are:
   $$\mathbf{x}_1 = \mathbf{H}_1 \mathbf{x}_G \implies \mathbf{x}_G = \mathbf{H}_1^{-1} \mathbf{x}_1$$
   $$\mathbf{x}_2 = \mathbf{H}_2 \mathbf{x}_G$$
3. Substitute $\mathbf{x}_G$ into the Camera 2 projection:
   $$\mathbf{x}_2 = \mathbf{H}_2 (\mathbf{H}_1^{-1} \mathbf{x}_1) = (\mathbf{H}_2 \mathbf{H}_1^{-1}) \mathbf{x}_1$$
4. Therefore, the direct image-to-image transfer homography is:
   $$\mathbf{H}_{21} = \mathbf{H}_2 \mathbf{H}_1^{-1}$$
   Any image captured by Camera 1 can be stitched seamlessly into Camera 2's frame by multiplying with $\mathbf{H}_{21}$.

---

## 7.7 Solved Exercises

### Exercise 7.1: Group Properties of Planar Homographies
**Statement:** Prove that the set of all $3 \times 3$ non-singular homography matrices forms a mathematical group under matrix multiplication (the Projective Linear Group $\text{PGL}(3, \mathbb{R})$).

**Solution:**
A set $G$ with binary operation $\cdot$ is a group if it satisfies four axioms:
1. **Closure:** Let $\mathbf{H}_1, \mathbf{H}_2 \in \text{PGL}(3, \mathbb{R})$. Then $\det(\mathbf{H}_1) \neq 0$ and $\det(\mathbf{H}_2) \neq 0$.
   By the product rule of determinants:
   $$\det(\mathbf{H}_1 \mathbf{H}_2) = \det(\mathbf{H}_1) \det(\mathbf{H}_2) \neq 0$$
   Thus, $\mathbf{H}_1 \mathbf{H}_2 \in \text{PGL}(3, \mathbb{R})$.
2. **Associativity:** Matrix multiplication is associative:
   $$(\mathbf{H}_1 \mathbf{H}_2) \mathbf{H}_3 = \mathbf{H}_1 (\mathbf{H}_2 \mathbf{H}_3)$$
3. **Identity Element:** The $3 \times 3$ identity matrix $\mathbf{I}_{3 \times 3} \in \text{PGL}(3, \mathbb{R})$ satisfies $\mathbf{H} \mathbf{I} = \mathbf{I} \mathbf{H} = \mathbf{H}$.
4. **Inverse Element:** For every non-singular $\mathbf{H}$, its matrix inverse $\mathbf{H}^{-1}$ exists, satisfies $\det(\mathbf{H}^{-1}) = \frac{1}{\det(\mathbf{H})} \neq 0$, and $\mathbf{H} \mathbf{H}^{-1} = \mathbf{I}$.
   Therefore, $\text{PGL}(3, \mathbb{R})$ forms a valid group under composition. $\blacksquare$

---

### Exercise 7.2: Degenerate Point Configurations in DLT
**Statement:** Explain what happens to the DLT linear system $\mathbf{A} \mathbf{h} = \mathbf{0}$ if 3 of the 4 point correspondences are collinear in the source plane.

**Solution:**
1. If 3 points $\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3$ lie on a single line $\mathbf{l}$, their coordinates satisfy $\mathbf{l}^\top \mathbf{x}_i = 0$.
2. This geometric dependency renders the corresponding rows of the measurement matrix $\mathbf{A}$ linearly dependent.
3. The rank of matrix $\mathbf{A}$ drops:
   $$\text{rank}(\mathbf{A}) \le 7 < 8$$
4. The nullspace of $\mathbf{A}$ has dimension $\ge 2$.
   Rather than a unique ray solution for $\mathbf{h}$, there exists an infinite family of non-equivalent homographies that satisfy the 4 points. The solution is geometrically degenerate and physically unconstrained outside the collinear line.

---

### Exercise 7.3: Line Transformation Rule Under Homography
**Statement:** Prove that if 2D points transform as $\mathbf{x}' = \mathbf{H} \mathbf{x}$, then 2D lines $\mathbf{l}$ (where $\mathbf{l}^\top \mathbf{x} = 0$) transform as $\mathbf{l}' = \mathbf{H}^{-\top} \mathbf{l}$.

**Solution:**
1. A 2D point $\mathbf{x}$ lies on line $\mathbf{l}$ if and only if:
   $$\mathbf{l}^\top \mathbf{x} = 0$$
2. Since $\mathbf{x}' = \mathbf{H} \mathbf{x}$ and $\mathbf{H}$ is invertible:
   $$\mathbf{x} = \mathbf{H}^{-1} \mathbf{x}'$$
3. Substitute $\mathbf{x}$ into the line incidence equation:
   $$\mathbf{l}^\top (\mathbf{H}^{-1} \mathbf{x}') = 0$$
4. Using the transpose identity $(\mathbf{A} \mathbf{B})^\top = \mathbf{B}^\top \mathbf{A}^\top$:
   $$\mathbf{l}^\top \mathbf{H}^{-1} \mathbf{x}' = (\mathbf{H}^{-\top} \mathbf{l})^\top \mathbf{x}' = 0$$
5. For the transformed point $\mathbf{x}'$ to lie on the transformed line $\mathbf{l}'$, we must have $(\mathbf{l}')^\top \mathbf{x}' = 0$.
   Therefore:
   $$\mathbf{l}' = \mathbf{H}^{-\top} \mathbf{l} \quad \blacksquare$$
   Points transform covariantly with $\mathbf{H}$, while lines transform contravariantly with $\mathbf{H}^{-\top}$.

---

### Exercise 7.4: Conic Transformation Under Homography
**Statement:** A 2D conic is defined by the matrix equation $\mathbf{x}^\top \mathbf{C} \mathbf{x} = 0$, where $\mathbf{C} \in \mathbb{R}^{3 \times 3}$ is symmetric. Prove that under homography $\mathbf{x}' = \mathbf{H} \mathbf{x}$, the conic transforms to $\mathbf{C}' = \mathbf{H}^{-\top} \mathbf{C} \mathbf{H}^{-1}$.

**Solution:**
1. Start with the incidence equation for points on conic $\mathbf{C}$:
   $$\mathbf{x}^\top \mathbf{C} \mathbf{x} = 0$$
2. Substitute $\mathbf{x} = \mathbf{H}^{-1} \mathbf{x}'$:
   $$(\mathbf{H}^{-1} \mathbf{x}')^\top \mathbf{C} (\mathbf{H}^{-1} \mathbf{x}') = 0$$
3. Transposing the first term:
   $$(\mathbf{x}')^\top (\mathbf{H}^{-1})^\top \mathbf{C} \mathbf{H}^{-1} \mathbf{x}' = 0$$
4. Rearranging:
   $$(\mathbf{x}')^\top (\mathbf{H}^{-\top} \mathbf{C} \mathbf{H}^{-1}) \mathbf{x}' = 0$$
5. Equating to $(\mathbf{x}')^\top \mathbf{C}' \mathbf{x}' = 0$:
   $$\mathbf{C}' = \mathbf{H}^{-\top} \mathbf{C} \mathbf{H}^{-1} \quad \blacksquare$$

---

### Exercise 7.5: Minimum Number of Views in Zhang's Calibration
**Statement:** Prove algebraically why at least 3 distinct checkerboard orientations are required to calibrate a camera with 5 unknown intrinsic parameters using Zhang's method.

**Solution:**
1. The symmetric matrix $\mathbf{B} = \mathbf{K}^{-\top} \mathbf{K}^{-1}$ has 6 elements.
2. Because $\mathbf{B}$ is defined up to scale, it contains $6 - 1 = 5$ independent parameters corresponding to the 5 intrinsic parameters ($f_x, f_y, c_x, c_y, s$).
3. Each checkerboard view provides one homography $\mathbf{H}_k$.
4. From Section 7.4, each homography provides exactly 2 linear equations on $\mathbf{B}$:
   $$\mathbf{h}_1^\top \mathbf{B} \mathbf{h}_2 = 0$$
   $$\mathbf{h}_1^\top \mathbf{B} \mathbf{h}_1 - \mathbf{h}_2^\top \mathbf{B} \mathbf{h}_2 = 0$$
5. To solve for 5 unknowns:
   - With $K = 1$ view: $2 \times 1 = 2$ equations (underdetermined, 3 DoF remain).
   - With $K = 2$ views: $2 \times 2 = 4$ equations (underdetermined, 1 DoF remains; can only solve if skew $s = 0$ is assumed).
   - With $K = 3$ views: $2 \times 3 = 6$ equations ($6 \ge 5$, overdetermined linear system).
   Thus, $K \ge 3$ distinct orientations are strictly required to solve for full unconstrained intrinsics. $\blacksquare$

---

### Exercise 7.6: Degeneracy in Parallel Calibration Planes
**Statement:** Explain why capturing 3 checkerboard images where the board is purely translated (without rotation) fails to calibrate the camera in Zhang's method.

**Solution:**
1. Suppose the checkerboard undergoes pure translation between views: $\mathbf{R}_2 = \mathbf{R}_1$ and $\mathbf{R}_3 = \mathbf{R}_1$.
2. The rotation columns $\mathbf{r}_1$ and $\mathbf{r}_2$ are identical across all views.
3. Consequently, the homography columns $\mathbf{h}_1$ and $\mathbf{h}_2$ in view 2 and view 3 are scalar multiples of the columns in view 1.
4. The linear equations $\mathbf{v}_{12}^\top \mathbf{b} = 0$ and $(\mathbf{v}_{11} - \mathbf{v}_{22})^\top \mathbf{b} = 0$ generated by views 2 and 3 are linearly dependent on those of view 1!
5. The rank of the constraint matrix $\mathbf{V}$ remains $2$, failing to constrain the remaining 3 degrees of freedom. Rotation (tilting the plane relative to the camera) is mandatory to generate independent constraints. $\blacksquare$

---

### Exercise 7.7: Pure Rotation Homography (Concentric Camera)
**Statement:** Prove that two images captured by a camera rotating strictly around its optical center without translation ($\mathbf{t} = \mathbf{0}$) are related by a planar homography, regardless of the 3D scene depth structure.

**Solution:**
1. Let camera 1 have pose $[\mathbf{I} \mid \mathbf{0}]$, so $\mathbf{X}_{C1} = \mathbf{X}$.
   Let camera 2 be rotated by $\mathbf{R}$ with zero translation: $\mathbf{X}_{C2} = \mathbf{R} \mathbf{X}_{C1}$.
2. The projection in camera 1 is $\lambda_1 \tilde{\mathbf{x}}_1 = \mathbf{K}_1 \mathbf{X}_{C1} \implies \mathbf{X}_{C1} = \lambda_1 \mathbf{K}_1^{-1} \tilde{\mathbf{x}}_1$.
3. The projection in camera 2 is:
   $$\lambda_2 \tilde{\mathbf{x}}_2 = \mathbf{K}_2 \mathbf{X}_{C2} = \mathbf{K}_2 (\mathbf{R} \mathbf{X}_{C1})$$
4. Substituting $\mathbf{X}_{C1}$:
   $$\lambda_2 \tilde{\mathbf{x}}_2 = \mathbf{K}_2 \mathbf{R} (\lambda_1 \mathbf{K}_1^{-1} \tilde{\mathbf{x}}_1) = \lambda_1 (\mathbf{K}_2 \mathbf{R} \mathbf{K}_1^{-1}) \tilde{\mathbf{x}}_1$$
5. Define $\mathbf{H} \triangleq \mathbf{K}_2 \mathbf{R} \mathbf{K}_1^{-1} \in \mathbb{R}^{3 \times 3}$.
   Then:
   $$\lambda \tilde{\mathbf{x}}_2 = \mathbf{H} \tilde{\mathbf{x}}_1$$
   Notice that 3D depth $Z$ has canceled out completely! Even if the scene contains complex non-planar mountains and buildings, the image mapping is an exact 2D homography. This is the mathematical foundation of panoramic image stitching. $\blacksquare$

---

### Exercise 7.8: RANSAC for Robust Homography Estimation
**Statement:** In feature matching, $40\%$ of putative feature correspondences are outliers (mismatches). If RANSAC samples minimal 4-point subsets, compute the minimum number of RANSAC iterations $N_{\text{iter}}$ required to ensure a $99\%$ probability ($p = 0.99$) of selecting at least one outlier-free sample.

**Solution:**
1. Inlier probability $w = 1 - 0.40 = 0.60$.
2. The minimal sample size for a homography is $m = 4$ points.
3. The probability that all 4 points in a random sample are true inliers is:
   $$P_{\text{all\_inliers}} = w^m = (0.60)^4 = 0.1296$$
4. The probability that a sample contains at least one outlier is:
   $$1 - w^m = 1 - 0.1296 = 0.8704$$
5. The probability that all $N_{\text{iter}}$ independent samples fail is $(1 - w^m)^{N_{\text{iter}}}$.
   We require this failure probability to be $\le 1 - p = 1 - 0.99 = 0.01$:
   $$(1 - w^m)^{N_{\text{iter}}} \le 0.01$$
6. Taking natural logarithms:
   $$N_{\text{iter}} \ln(1 - w^m) \le \ln(0.01) \implies N_{\text{iter}} \ge \frac{\ln(0.01)}{\ln(1 - 0.1296)} = \frac{-4.60517}{\ln(0.8704)} = \frac{-4.60517}{-0.13881} \approx 33.17$$
   Rounding up, a minimum of $N_{\text{iter}} = 34$ iterations guarantees a $99\%$ success rate.

---

### Exercise 7.9: Reprojection Error Formulation
**Statement:** Define the non-linear geometric **reprojection error** cost function minimized in bundle adjustment during camera calibration, and explain why it is preferred over algebraic error $\|\mathbf{A} \mathbf{h}\|^2$.

**Solution:**
1. Given $K$ views and $N$ target points per view, let $\mathbf{x}_{i, k}$ be the detected 2D pixel coordinate of point $i$ in view $k$, and let $\hat{\mathbf{x}}(\mathbf{K}, \mathbf{R}_k, \mathbf{t}_k, \mathbf{D}, \mathbf{X}_i)$ be the projected pixel location through the full forward camera and distortion model.
2. The non-linear reprojection error is:
   $$\mathcal{L}(\mathbf{K}, \mathbf{D}, \{\mathbf{R}_k, \mathbf{t}_k\}) = \sum_{k=1}^K \sum_{i=1}^N \left\| \mathbf{x}_{i, k} - \hat{\mathbf{x}}(\mathbf{K}, \mathbf{R}_k, \mathbf{t}_k, \mathbf{D}, \mathbf{X}_i) \right\|^2$$
3. **Why Reprojection Error is Superior to Algebraic Error:**
   - **Physical Meaning:** Reprojection error measures physical distance in image pixels ($\text{pixels}^2$). Algebraic error $\|\mathbf{A} \mathbf{h}\|^2$ has no physical units or meaning.
   - **Maximum Likelihood Estimator:** Under additive zero-mean Gaussian image noise $\epsilon \sim \mathcal{N}(0, \sigma^2 \mathbf{I})$, minimizing reprojection error is the mathematically optimal Maximum Likelihood Estimator (MLE).
   - **Incorporates Distortion:** Algebraic DLT cannot model non-linear radial lens distortion, whereas non-linear bundle adjustment simultaneously optimizes $k_1, k_2, p_1, p_2$.

---

### Exercise 7.10: Affine Rectification via Two Vanishing Points
**Statement:** Explain how to perform **affine rectification** (restoring parallelism) on an image of a plane using the image of two vanishing points $\mathbf{v}_1, \mathbf{v}_2$ corresponding to two orthogonal families of parallel lines.

**Solution:**
1. In perspective projection, parallel lines converge to vanishing points.
   Let $\mathbf{v}_1$ and $\mathbf{v}_2$ be two vanishing points computed from the intersections of imaged parallel line pairs.
2. The line connecting the two vanishing points is the **vanishing line** (image of the line at infinity $\mathbf{l}_\infty$):
   $$\mathbf{l}_\infty = \mathbf{v}_1 \times \mathbf{v}_2 = \begin{bmatrix} l_1 \\ l_2 \\ l_3 \end{bmatrix}$$
3. To restore parallelism, we construct a rectifying homography $\mathbf{H}_{\text{aff}}$ that maps $\mathbf{l}_\infty$ back to the canonical line at infinity $[0, 0, 1]^\top$:
   $$\mathbf{H}_{\text{aff}}^{-\top} \mathbf{l}_\infty = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \implies \mathbf{H}_{\text{aff}} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ l_1/l_3 & l_2/l_3 & 1 \end{bmatrix}$$
4. Warping the image with $\mathbf{H}_{\text{aff}}$ guarantees that all parallel lines on the source plane become strictly parallel in the rectified image. $\blacksquare$
