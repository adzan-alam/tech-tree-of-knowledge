# Chapter 8: Two-View Epipolar Geometry, Disparity, and Stereo Depth Triangulation

---

## 8.1 The Geometry of Binocular Vision and Epipolar Planes

A single monocular camera is fundamentally an angle sensor, not a distance sensor. Because perspective projection maps an entire 3D ray onto a single 2D pixel, the depth coordinate $Z$ is lost.

To perceive metric three-dimensional depth, biological organisms (such as humans and predatory animals) and autonomous robotic platforms employ **binocular stereo vision**—viewing the scene from two distinct spatial vantage points separated by a known baseline distance.

```
                           THE EPIPOLAR GEOMETRY OF STEREO
                           
                                    3D World Point X
                                           o
                                          / \
                                         /   \
                                        /     \  Epipolar Plane Π_epi
                                       /       \
                        Left Ray      /         \     Right Ray
                                     /           \
                                    /             \
        Left Image Plane           /               \          Right Image Plane
      ┌──────────────────┐        /                 \       ┌──────────────────┐
      │         o x_L    │       /                   \      │         o x_R    │
      │        /         │      /                     \     │        /         │
      │       / l_L      │     /                       \    │       / l_R      │
      │      o e_L       │    /                         \   │      o e_R       │
      └─────/────────────┘   /                           \  └─────/────────────┘
           /                /                             \      /
          /                ▼                               ▼    /
         o─────────────────────────────────────────────────────o
    Left Optical Center C_L            Baseline b          Right Optical Center C_R
```

### The Anatomy of Two-View Epipolar Geometry
Let $\mathbf{C}_L$ and $\mathbf{C}_R$ denote the optical centers of the left and right cameras.
1. **The Baseline ($\mathbf{b}$):** The 3D translation vector connecting the two optical centers:
   $$\mathbf{b} = \mathbf{C}_R - \mathbf{C}_L$$
2. **The Epipolar Plane ($\Pi_{\text{epi}}$):** For any 3D scene point $\mathbf{X}$ outside the baseline, the three points $\mathbf{C}_L, \mathbf{C}_R, \mathbf{X}$ define a unique 2D planar slice in 3D Euclidean space. As $\mathbf{X}$ moves through the universe, the family of all epipolar planes forms a pencil of planes pivoting about the baseline axis.
3. **The Epipoles ($\mathbf{e}_L, \mathbf{e}_R$):** The point where the baseline intersects each camera's image plane. Equivalently, $\mathbf{e}_L$ is the optical projection of $\mathbf{C}_R$ onto the left camera sensor, and $\mathbf{e}_R$ is the projection of $\mathbf{C}_L$ onto the right camera sensor.
4. **The Epipolar Lines ($\mathbf{l}_L, \mathbf{l}_R$):** The intersection of the epipolar plane $\Pi_{\text{epi}}$ with the left and right image planes. The projection of the 3D ray $\mathbf{C}_L \to \mathbf{X}$ onto the right camera frame is precisely the right epipolar line $\mathbf{l}_R$.

### The Epipolar Search Reduction Theorem
In general 2D image matching, finding the correspondence of a pixel $\mathbf{x}_L$ requires a 2D search across all $W \times H$ pixels of the second image—a search space of $\mathcal{O}(W \cdot H)$ operations per pixel.

> [!IMPORTANT]
> **The Epipolar Constraint:** The corresponding match $\mathbf{x}_R$ of a left pixel $\mathbf{x}_L$ is **strictly constrained to lie on the 1D epipolar line $\mathbf{l}_R$**.
> Epipolar geometry reduces the 2D correspondence search problem down to a **1D line search**, accelerating stereo matching throughput by hundreds of times and eliminating millions of potential false-positive matching candidates!

---

## 8.2 The Essential Matrix (Normalized Coordinates)

To express the epipolar constraint in coordinate-free algebra, we first consider **normalized camera coordinates**, which isolate the external rigid pose from internal camera intrinsics.

```
                      COPLANARITY IN CAMERA COORDINATES
                      
                                      X_L
                                       o
                                      /
                                     /
                                    /
                                   /  X_R = R X_L + t
                                  /
                                 o ──────────────► t
                              C_L (0, 0, 0)
                              
               The three vectors X_R, t, and (R X_L) are COPLANAR!
               Their scalar triple product is identically ZERO:
                             X_R · [ t × (R X_L) ] = 0
```

### Derivation of the Essential Matrix
Let $\mathbf{X}_L \in \mathbb{R}^3$ be the 3D coordinates of a point in the left camera frame.
Let the right camera coordinate frame be related by rotation $\mathbf{R} \in \text{SO}(3)$ and translation $\mathbf{t} \in \mathbb{R}^3$:
$$\mathbf{X}_R = \mathbf{R} \mathbf{X}_L + \mathbf{t}$$

Subtract $\mathbf{t}$ and take the cross product with $\mathbf{t}$:
$$\mathbf{t} \times \mathbf{X}_R = \mathbf{t} \times (\mathbf{R} \mathbf{X}_L + \mathbf{t}) = \mathbf{t} \times (\mathbf{R} \mathbf{X}_L) + \mathbf{t} \times \mathbf{t}$$
Since the cross product of any vector with itself is zero ($\mathbf{t} \times \mathbf{t} = \mathbf{0}$):
$$\mathbf{t} \times \mathbf{X}_R = \mathbf{t} \times (\mathbf{R} \mathbf{X}_L)$$

Now take the vector dot product of both sides with $\mathbf{X}_R$:
$$\mathbf{X}_R \cdot (\mathbf{t} \times \mathbf{X}_R) = \mathbf{X}_R \cdot (\mathbf{t} \times \mathbf{R} \mathbf{X}_L)$$
Because $\mathbf{t} \times \mathbf{X}_R$ is perpendicular to $\mathbf{X}_R$, the left side is identically zero:
$$\mathbf{X}_R^\top \Big( \mathbf{t} \times (\mathbf{R} \mathbf{X}_L) \Big) = 0$$

Represent the cross product $\mathbf{t} \times \mathbf{v}$ via the skew-symmetric matrix $[\mathbf{t}]_\times$:
$$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix}$$
Then:
$$\mathbf{X}_R^\top [\mathbf{t}]_\times \mathbf{R} \mathbf{X}_L = 0$$

Dividing $\mathbf{X}_L$ by $Z_L$ and $\mathbf{X}_R$ by $Z_R$ yields normalized 2D homogeneous coordinates $\mathbf{x}_{n, L} = [x_L/Z_L, y_L/Z_L, 1]^\top$ and $\mathbf{x}_{n, R} = [x_R/Z_R, y_R/Z_R, 1]^\top$:
$$\mathbf{x}_{n, R}^\top \Big( [\mathbf{t}]_\times \mathbf{R} \Big) \mathbf{x}_{n, L} = 0$$

### The Essential Matrix Formulation
Introduced by Christopher Longuet-Higgins in 1981, the **Essential Matrix** $\mathbf{E} \in \mathbb{R}^{3 \times 3}$ is defined as:

$$\mathbf{E} \triangleq [\mathbf{t}]_\times \mathbf{R}$$

Thus, for any corresponding pair of normalized points:
$$\mathbf{x}_{n, R}^\top \mathbf{E} \mathbf{x}_{n, L} = 0$$

#### Fundamental Mathematical Properties of E:
1. **Rank 2:** Because $[\mathbf{t}]_\times$ is skew-symmetric, $\det([\mathbf{t}]_\times) = 0$. Since $\mathbf{R}$ has full rank 3, $\text{rank}(\mathbf{E}) = 2$.
2. **Singular Value Spectrum:** A $3 \times 3$ real matrix is an Essential Matrix if and only if two of its singular values are equal and non-zero, and the third is zero:
   $$\boldsymbol{\Sigma}_E = \text{diag}(\sigma, \sigma, 0) \quad \text{for some } \sigma > 0$$
3. **Degrees of Freedom (5 DoF):** $\mathbf{E}$ is parameterized by 3 rotation parameters ($\mathbf{R} \in \text{SO}(3)$) and a 3D translation direction ($\mathbf{t} \in S^2$). Because the epipolar constraint is homogeneous ($\alpha \mathbf{E}$ satisfies the equation for all $\alpha \neq 0$), translation magnitude $\|\mathbf{t}\|$ cannot be recovered from two views alone without external metric scale.

---

## 8.3 The Fundamental Matrix (Pixel Coordinates)

In raw digital images, we measure discrete pixel coordinates $\mathbf{x}_L = [u_L, v_L, 1]^\top$ and $\mathbf{x}_R = [u_R, v_R, 1]^\top$, which are linked to normalized coordinates by the camera intrinsic matrices $\mathbf{K}_L$ and $\mathbf{K}_R$:
$$\mathbf{x}_{n, L} = \mathbf{K}_L^{-1} \mathbf{x}_L, \quad \mathbf{x}_{n, R} = \mathbf{K}_R^{-1} \mathbf{x}_R$$

### Derivation of the Fundamental Matrix
Substitute the intrinsic transformations into the Essential Matrix equation:
$$(\mathbf{K}_R^{-1} \mathbf{x}_R)^\top \mathbf{E} (\mathbf{K}_L^{-1} \mathbf{x}_L) = 0$$
Transposing the left term:
$$\mathbf{x}_R^\top \left( \mathbf{K}_R^{-\top} \mathbf{E} \mathbf{K}_L^{-1} \right) \mathbf{x}_L = 0$$

Define the **Fundamental Matrix** $\mathbf{F} \in \mathbb{R}^{3 \times 3}$:

$$\mathbf{F} \triangleq \mathbf{K}_R^{-\top} \mathbf{E} \mathbf{K}_L^{-1} = \mathbf{K}_R^{-\top} [\mathbf{t}]_\times \mathbf{R} \mathbf{K}_L^{-1}$$

This yields the **Bilinear Epipolar Constraint on Raw Pixels**:

$$\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L = 0$$

```
                           THE FUNDAMENTAL MATRIX BRIDGE
                           
       Pixel Coordinates           Intrinsic Matrix            Normalized Coordinates
             x_L                   K_L^(-1)                    x_{n, L}
              │                                                   │
              │                                                   ▼
              │                                            Essential Matrix E
              ▼                                            x_{n,R}^T E x_{n,L} = 0
     Fundamental Matrix F                                         ▲
     x_R^T F x_L = 0                                              │
              ▲                                                   │
              │                                                   │
             x_R                   K_R^(-1)                    x_{n, R}
       Pixel Coordinates           Intrinsic Matrix            Normalized Coordinates
```

### Geometric Mapping Properties of F
1. **Point-to-Epipolar Line Mapping:**
   Given a point $\mathbf{x}_L$ in the left image, its conjugate epipolar line in the right image is:
   $$\mathbf{l}_R = \mathbf{F} \mathbf{x}_L$$
   Any matching pixel $\mathbf{x}_R$ must lie on this line: $\mathbf{x}_R^\top \mathbf{l}_R = 0$.
   Conversely, given $\mathbf{x}_R$, its epipolar line in the left image is:
   $$\mathbf{l}_L = \mathbf{F}^\top \mathbf{x}_R$$
2. **Epipoles as Nullspaces:**
   Because all epipolar lines pass through the epipole:
   $$\mathbf{F} \mathbf{e}_L = \mathbf{0}, \quad \mathbf{F}^\top \mathbf{e}_R = \mathbf{0}$$
   The left epipole $\mathbf{e}_L$ is the right nullspace of $\mathbf{F}$, and the right epipole $\mathbf{e}_R$ is the left nullspace (nullspace of $\mathbf{F}^\top$).
3. **Singular Matrix ($\det(\mathbf{F}) = 0$):**
   $\mathbf{F}$ has rank strictly equal to 2.
4. **Degrees of Freedom (7 DoF):**
   A $3 \times 3$ matrix has 9 entries. Up to an arbitrary scale factor, it has 8 DoF. The rank-2 singularity constraint $\det(\mathbf{F}) = 0$ removes 1 DoF:
   $$\text{DoF}(\mathbf{F}) = 9 - 1 - 1 = 7$$

---

## 8.4 Stereo Rectification and Canonical Geometry

In an arbitrary stereo camera rig, the optical axes may converge or tilt, and the baseline vector is oriented arbitrarily in 3D space. Consequently:
- Epipolar lines are angled diagonally.
- Searching for matching pixels requires calculating line equations and performing non-horizontal sub-pixel interpolation.

```
                      STEREO IMAGE RECTIFICATION
                      
          Unrectified Stereo Pair                     Rectified Canonical Pair
      (Angled, Converging Epipolar Lines)            (Horizontal Parallel Epipolar Lines)
      ┌─────────────────┐ ┌─────────────────┐        ┌─────────────────┐ ┌─────────────────┐
      │      \          │ │          /      │        │ ─────────────── │ │ ─────────────── │
      │       \  l_L    │ │    l_R  /       │ ──► H  │ ───────o─────── │ │ ───────o─────── │
      │        o x_L    │ │        o x_R    │        │ ─────────────── │ │ ─────────────── │
      │         \       │ │       /         │        │ ─────────────── │ │ ─────────────── │
      └─────────────────┘ └─────────────────┘        └─────────────────┘ └─────────────────┘
      (Requires 2D Bresenham Line Search)            (Search is STRICTLY on SAME ROW: v_L = v_R!)
```

### The Rectification Objective
**Stereo Rectification** applies a pair of planar homographies $\mathbf{H}_L$ and $\mathbf{H}_R$ to the left and right images such that:
1. Both virtual image planes become strictly **coplanar**.
2. Both optical axes become strictly **parallel** and perpendicular to the baseline.
3. The epipoles are projected to infinity along the horizontal axis: $\mathbf{e}_L' = \mathbf{e}_R' = [1, 0, 0]^\top$.
4. **Conjugate epipolar lines become identical horizontal raster scanlines ($v_L = v_R$)!**

### Constructing the Rectified Coordinate Frame
Define an orthonormal coordinate frame $\mathbf{R}_{\text{rect}} = [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{r}_3]^\top$ based on the physical baseline $\mathbf{t}$:
1. **$X$-axis ($\mathbf{r}_1$):** Parallel to the baseline vector connecting the camera centers:
   $$\mathbf{r}_1 = \frac{\mathbf{t}}{\|\mathbf{t}\|}$$
2. **$Y$-axis ($\mathbf{r}_2$):** Orthogonal to both the baseline and the original optical axis $\mathbf{z}$:
   $$\mathbf{r}_2 = \frac{\mathbf{z} \times \mathbf{r}_1}{\|\mathbf{z} \times \mathbf{r}_1\|} \quad \text{where } \mathbf{z} = [0, 0, 1]^\top$$
3. **$Z$-axis ($\mathbf{r}_3$):** Orthogonal to $\mathbf{r}_1$ and $\mathbf{r}_2$ (the new optical axis):
   $$\mathbf{r}_3 = \mathbf{r}_1 \times \mathbf{r}_2$$

The rectifying rotation matrix is $\mathbf{R}_{\text{rect}} = \begin{bmatrix} \mathbf{r}_1^\top \\ \mathbf{r}_2^\top \\ \mathbf{r}_3^\top \end{bmatrix}$.
The rectifying homographies are:
$$\mathbf{H}_L = \mathbf{K}_{\text{new}} \mathbf{R}_{\text{rect}} \mathbf{K}_L^{-1}, \quad \mathbf{H}_R = \mathbf{K}_{\text{new}} \mathbf{R}_{\text{rect}} \mathbf{R}^\top \mathbf{K}_R^{-1}$$
where $\mathbf{K}_{\text{new}}$ is a synthesized common intrinsic matrix.

In the rectified image pair:
$$\mathbf{F}_{\text{rect}} = [\mathbf{e}']_\times = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$
Evaluating the epipolar constraint:
$$\begin{bmatrix} u_R & v_R & 1 \end{bmatrix} \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} u_L \\ v_L \\ 1 \end{bmatrix} = 0 \implies v_L - v_R = 0 \implies v_L = v_R$$
The vertical pixel coordinates must be identical! The correspondence search is strictly restricted to the horizontal scanline.

---

## 8.5 Disparity and Metric 3D Depth Triangulation

In a rectified stereo system, the optical axes of both cameras are parallel and separated by physical baseline distance $b = \|\mathbf{t}\|$. Both cameras share identical focal length $f = f_x$ and principal point $(c_x, c_y)$.

```
                           CANONICAL STEREO TRIANGULATION
                           
                                     3D Point X = [X, Y, Z]^T
                                                o
                                               / \
                                              /   \
                                             /     \
                                            /       \
                       Left Ray            /         \        Right Ray
                                          /           \
                                         /             \
                  u_L                   /               \                  u_R
      ┌────────────o────────────┐      /                 \     ┌────────────o────────────┐
      │                         │     /                   \    │                         │
      │            + c_x        │    /                     \   │            + c_x        │
      └────────────┼────────────┘   /                       \  └────────────┼────────────┘
                   │               /                         \              │
                   │              ▼                           ▼             │
                   o────────────────────────────────────────────────────────o
               Left Center C_L                    b                    Right Center C_R
                                        ◄─────────────────►
```

### Derivation of the Depth Equation
Let a 3D scene point have coordinates $\mathbf{X} = [X, Y, Z]^\top$ measured relative to the left camera frame.
- Its projection into the left camera is:
  $$u_L = f \frac{X}{Z} + c_x$$
- Because the right camera is translated horizontally by distance $b$ along the $X$-axis ($\mathbf{C}_R = [b, 0, 0]^\top$), the coordinates of $\mathbf{X}$ in the right camera frame are:
  $$\mathbf{X}_R = \begin{bmatrix} X - b \\ Y \\ Z \end{bmatrix}$$
- Its projection into the right camera is:
  $$u_R = f \frac{X - b}{Z} + c_x = f \frac{X}{Z} - \frac{f \cdot b}{Z} + c_x$$

### The Horizontal Disparity $d$
Subtracting the right pixel coordinate from the left pixel coordinate:
$$d \triangleq u_L - u_R = \left( f \frac{X}{Z} + c_x \right) - \left( f \frac{X - b}{Z} + c_x \right) = \frac{f \cdot b}{Z}$$

The difference $d = u_L - u_R$ is the **horizontal disparity** (measured in pixels).

Solving directly for metric depth $Z$:

$$Z = \frac{f \cdot b}{d}$$

### 3D Metric Coordinate Recovery (Unprojecting the Point Cloud)
Once depth $Z$ is calculated, the full 3D coordinates $(X, Y, Z)$ in metric units (meters) are recovered:

$$X = \frac{(u_L - c_x) Z}{f}$$
$$Y = \frac{(v - c_y) Z}{f}$$
$$Z = \frac{f \cdot b}{d}$$

In matrix form, the **Disparity-to-Depth Reprojection Matrix** $\mathbf{Q} \in \mathbb{R}^{4 \times 4}$ transforms $[u, v, d, 1]^\top$ into 3D homogeneous coordinates:
$$\mathbf{Q} \begin{bmatrix} u \\ v \\ d \\ 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & -c_x \\ 0 & 1 & 0 & -c_y \\ 0 & 0 & 0 & f \\ 0 & 0 & -1/b & 0 \end{bmatrix} \begin{bmatrix} u \\ v \\ d \\ 1 \end{bmatrix} = \begin{bmatrix} X \\ Y \\ Z \\ W \end{bmatrix}$$

### Depth Resolution and Error Sensitivity
What happens to depth precision when disparity measurement is corrupted by sub-pixel error $\Delta d$?
Compute the derivative of $Z$ with respect to disparity $d$:
$$\frac{\partial Z}{\partial d} = \frac{\partial}{\partial d} \left( \frac{f b}{d} \right) = -\frac{f b}{d^2}$$
Substitute $d = \frac{f b}{Z}$:
$$\frac{\partial Z}{\partial d} = -\frac{f b}{(f b / Z)^2} = -\frac{Z^2}{f b}$$

Therefore, the depth error $\Delta Z$ resulting from disparity error $\Delta d$ is:

$$|\Delta Z| \approx \frac{Z^2}{f \cdot b} |\Delta d|$$

> [!CAUTION]
> **Quadratic Error Growth:** Metric depth uncertainty grows **quadratically with distance ($Z^2$)**!
> Doubling the distance to an obstacle quadruples the depth measurement error. To maintain depth precision at long ranges, robotic platforms must increase the physical baseline $b$ or focal length $f$.

---

## 8.6 Dense Stereo Matching: Cost Functions and Semi-Global Matching (SGM)

Computing a dense depth map requires finding the optimal disparity $d \in [0, d_{\text{max}}]$ for every single pixel $[y, x]$ in the reference image.

### 1. Matching Cost Metrics

#### Absolute Differences (SAD) and Squared Differences (SSD):
$$\mathcal{C}_{\text{SAD}}(x, y, d) = |I_L[y, x] - I_R[y, x - d]|$$
$$\mathcal{C}_{\text{SSD}}(x, y, d) = (I_L[y, x] - I_R[y, x - d])^2$$
*Flaw:* Highly sensitive to photometric gain, auto-exposure differences, and vignetting between the two sensors.

#### Normalized Cross-Correlation (NCC):
$$\mathcal{C}_{\text{NCC}}(x, y, d) = \frac{\sum (I_L - \bar{I}_L)(I_R - \bar{I}_R)}{\sqrt{\sum (I_L - \bar{I}_L)^2 \sum (I_R - \bar{I}_R)^2}}$$
*Flaw:* Computationally expensive, blurs sharp depth boundaries.

#### The Census Transform:
The Census Transform maps a local $(2k+1) \times (2k+1)$ neighborhood into a compact bitstring representing relative intensity comparisons:
$$\xi(I[y, x], I[y+u, x+v]) = \begin{cases} 1 & \text{if } I[y+u, x+v] < I[y, x] \\ 0 & \text{otherwise} \end{cases}$$
The Census bitstring is the concatenation of these binary comparisons.
The matching cost between two Census descriptors is simply their **Hamming Distance** (the number of differing bits, computed in a single CPU instruction via `popcount(bitstring_L ^ bitstring_R)`):
$$\mathcal{C}_{\text{Census}}(x, y, d) = \text{Hamming}\Big( \text{Census}_L(y, x), \, \text{Census}_R(y, x - d) \Big)$$
*Advantage:* **Strictly invariant to any monotonic radiometric transformation** (e.g., auto-gain, gamma changes, sun glare).

### 2. Semi-Global Matching (SGM)
Simple local block matching produces noisy, speckled disparity maps in low-texture regions. Global 2D Markov Random Fields (MRFs) optimized via graph cuts are too slow for real-time robotics.

In 2005, Heiko Hirschmüller introduced **Semi-Global Matching (SGM)**, which optimizes a 2D energy functional by aggregating 1D dynamic programming paths along 8 or 16 radial directions $\mathbf{r}$:

$$E(D) = \sum_{\mathbf{p}} \mathcal{C}(\mathbf{p}, D(\mathbf{p})) + \sum_{\mathbf{q} \in \mathcal{N}_{\mathbf{p}}} P_1 \cdot \mathbb{I}[|D(\mathbf{p}) - D(\mathbf{q})| = 1] + \sum_{\mathbf{q} \in \mathcal{N}_{\mathbf{p}}} P_2 \cdot \mathbb{I}[|D(\mathbf{p}) - D(\mathbf{q})| > 1]$$

where:
- $\mathcal{C}(\mathbf{p}, D(\mathbf{p}))$ is the pixel matching cost (e.g., Census).
- $P_1$ is a small penalty for small disparity steps ($\pm 1$ pixel, modeling smooth slanted surfaces).
- $P_2$ is a larger penalty for sharp disparity jumps ($> 1$ pixel, modeling true depth discontinuities).

#### SGM Dynamic Programming Recurrence:
Along each 1D path direction $\mathbf{r}$, the cost $L_{\mathbf{r}}(\mathbf{p}, d)$ to assign disparity $d$ to pixel $\mathbf{p}$ is:
$$L_{\mathbf{r}}(\mathbf{p}, d) = \mathcal{C}(\mathbf{p}, d) + \min \begin{cases} L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, d) \\ L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, d - 1) + P_1 \\ L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, d + 1) + P_1 \\ \min_k L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, k) + P_2 \end{cases} - \min_k L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, k)$$

Summing costs across all directions:
$$S(\mathbf{p}, d) = \sum_{\mathbf{r}} L_{\mathbf{r}}(\mathbf{p}, d)$$
The optimal disparity is selected by Winner-Take-All (WTA):
$$D^*(\mathbf{p}) = \arg\min_d S(\mathbf{p}, d)$$

---

## 8.7 Worked Examples

### Problem 8.1: Triangulation of Metric 3D Depth
**Statement:** A calibrated, rectified stereo camera rig on an autonomous delivery robot has:
- Baseline: $b = 0.20\text{ meters}$ ($20\text{ cm}$)
- Focal length: $f_x = 800\text{ pixels}$
- Principal point: $(c_x, c_y) = (640, 360)$
A pedestrian is detected in the left image at $(u_L, v_L) = (720, 400)$ and in the right image at $(u_R, v_R) = (680, 400)$.
1. Compute the horizontal disparity $d$.
2. Compute the metric depth $Z$ to the pedestrian.
3. Compute the full 3D coordinates $(X, Y, Z)$ in meters in the left camera frame.

**Step-by-step Solution:**
1. **Horizontal Disparity:**
   $$d = u_L - u_R = 720 - 680 = 40\text{ pixels}$$
   (Notice that vertical coordinates match: $v_L = v_R = 400$, confirming rectification).
2. **Metric Depth $Z$:**
   $$Z = \frac{f \cdot b}{d} = \frac{800\text{ pixels} \times 0.20\text{ meters}}{40\text{ pixels}} = \frac{160}{40} = 4.0\text{ meters}$$
3. **3D Metric Coordinates $(X, Y, Z)$:**
   $$X = \frac{(u_L - c_x) Z}{f} = \frac{(720 - 640) \times 4.0}{800} = \frac{80 \times 4.0}{800} = \frac{320}{800} = +0.40\text{ meters}$$
   $$Y = \frac{(v_L - c_y) Z}{f} = \frac{(400 - 360) \times 4.0}{800} = \frac{40 \times 4.0}{800} = \frac{160}{800} = +0.20\text{ meters}$$
   $$Z = 4.0\text{ meters}$$
   The pedestrian is located at 3D position $\mathbf{X} = [0.40, 0.20, 4.0]^\top$ meters.

---

### Problem 8.2: Quadratic Depth Error Analysis
**Statement:** For the stereo camera in Problem 8.1 ($f = 800\text{ pixels}, b = 0.20\text{ m}$), the stereo matcher has a sub-pixel disparity uncertainty of $\Delta d = \pm 0.5\text{ pixels}$.
1. Compute the depth uncertainty $\Delta Z$ for an obstacle at $Z = 2.0\text{ meters}$.
2. Compute the depth uncertainty $\Delta Z$ for an obstacle at $Z = 10.0\text{ meters}$.
3. Compare the error ratio to the distance ratio.

**Step-by-step Solution:**
1. Using the depth error sensitivity formula:
   $$\Delta Z \approx \frac{Z^2}{f \cdot b} \Delta d$$
   Here $f \cdot b = 800 \times 0.20 = 160\text{ pixel}\cdot\text{m}$.
   - **At $Z = 2.0\text{ m}$:**
     $$\Delta Z = \frac{2.0^2}{160} \times 0.5 = \frac{4.0}{160} \times 0.5 = 0.025 \times 0.5 = 0.0125\text{ meters} = \pm 1.25\text{ cm}$$
   - **At $Z = 10.0\text{ m}$:**
     $$\Delta Z = \frac{10.0^2}{160} \times 0.5 = \frac{100.0}{160} \times 0.5 = 0.625 \times 0.5 = 0.3125\text{ meters} = \pm 31.25\text{ cm}$$
2. **Comparison:**
   The distance increased by a factor of $\frac{10}{2} = 5\times$.
   The depth error exploded by a factor of:
   $$\frac{0.3125}{0.0125} = 25\times = 5^2$$
   This empirically verifies the quadratic error law: $\Delta Z \propto Z^2$.

---

### Problem 8.3: Essential Matrix Construction from Known Pose
**Statement:** The right camera is translated along the $X$-axis by $t_x = 0.5\text{ m}$ with zero translation along $Y$ and $Z$ ($\mathbf{t} = [0.5, 0, 0]^\top$). The right camera is rotated around the $Y$-axis by angle $\theta = 90^\circ$ ($\mathbf{R} = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$).
1. Construct the skew-symmetric matrix $[\mathbf{t}]_\times$.
2. Compute the Essential Matrix $\mathbf{E} = [\mathbf{t}]_\times \mathbf{R}$.

**Step-by-step Solution:**
1. **Skew-Symmetric Translation Matrix:**
   $$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -0.5 \\ 0 & 0.5 & 0 \end{bmatrix}$$
2. **Essential Matrix Product:**
   $$\mathbf{E} = [\mathbf{t}]_\times \mathbf{R} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -0.5 \\ 0 & 0.5 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$$
   Multiply rows by columns:
   - Row 1: $\begin{bmatrix} 0 & 0 & 0 \end{bmatrix}$
   - Row 2:
     - Col 1: $0(0) + 0(0) + (-0.5)(-1) = 0.5$
     - Col 2: $0(0) + 0(1) + (-0.5)(0) = 0$
     - Col 3: $0(1) + 0(0) + (-0.5)(0) = 0$
     $$\text{Row 2} = \begin{bmatrix} 0.5 & 0 & 0 \end{bmatrix}$$
   - Row 3:
     - Col 1: $0(0) + 0.5(0) + 0(-1) = 0$
     - Col 2: $0(0) + 0.5(1) + 0(0) = 0.5$
     - Col 3: $0(1) + 0.5(0) + 0(0) = 0$
     $$\text{Row 3} = \begin{bmatrix} 0 & 0.5 & 0 \end{bmatrix}$$
   Assembled Essential Matrix:
   $$\mathbf{E} = \begin{bmatrix} 0 & 0 & 0 \\ 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \end{bmatrix}$$

---

### Problem 8.4: Verification of Singular Values of the Essential Matrix
**Statement:** Compute the singular values of the Essential Matrix $\mathbf{E} = \begin{bmatrix} 0 & 0 & 0 \\ 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \end{bmatrix}$ from Problem 8.3 and verify that it satisfies the trace constraint.

**Step-by-step Solution:**
1. Singular values are the square roots of the eigenvalues of $\mathbf{E} \mathbf{E}^\top$:
   $$\mathbf{E} \mathbf{E}^\top = \begin{bmatrix} 0 & 0 & 0 \\ 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0.5 & 0 \\ 0 & 0 & 0.5 \\ 0 & 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.25 & 0 \\ 0 & 0 & 0.25 \end{bmatrix}$$
2. The eigenvalues of this diagonal matrix are $\lambda_1 = 0.25, \lambda_2 = 0.25, \lambda_3 = 0$.
3. The singular values are:
   $$\sigma_1 = \sqrt{0.25} = 0.5, \quad \sigma_2 = \sqrt{0.25} = 0.5, \quad \sigma_3 = 0$$
   The singular value spectrum is strictly $[0.5, 0.5, 0]$, with two identical non-zero values and one zero value, confirming it is an Essential Matrix!

---

### Problem 8.5: Epipolar Line Equation Calculation
**Statement:** A fundamental matrix between two cameras is:
$$\mathbf{F} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$
A feature is detected in the left image at pixel $\mathbf{x}_L = [300, 250, 1]^\top$.
1. Compute the epipolar line $\mathbf{l}_R$ in the right image.
2. What is the geometric orientation of this epipolar line?

**Step-by-step Solution:**
1. Epipolar line formula:
   $$\mathbf{l}_R = \mathbf{F} \mathbf{x}_L = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} 300 \\ 250 \\ 1 \end{bmatrix} = \begin{bmatrix} 0(300) + 0(250) + 0(1) \\ 0(300) + 0(250) - 1(1) \\ 0(300) + 1(250) + 0(1) \end{bmatrix} = \begin{bmatrix} 0 \\ -1 \\ 250 \end{bmatrix}$$
2. The 2D line equation on the right image is $\mathbf{l}_R^\top \mathbf{x}_R = 0$:
   $$0 \cdot u_R - 1 \cdot v_R + 250 = 0 \implies v_R = 250$$
   The epipolar line is a horizontal scanline at exactly $v_R = 250$, proving that these two cameras are already rectified!

---

### Problem 8.6: Epipole Nullspace Extraction
**Statement:** Find the left epipole $\mathbf{e}_L$ of the fundamental matrix $\mathbf{F} = \begin{bmatrix} 1 & 2 & -3 \\ 2 & 4 & -6 \\ 3 & 6 & -9 \end{bmatrix}$.

**Step-by-step Solution:**
1. The left epipole satisfies $\mathbf{F} \mathbf{e}_L = \mathbf{0}$, meaning $\mathbf{e}_L = [e_x, e_y, 1]^\top$ lies in the nullspace of $\mathbf{F}$.
2. Notice that all rows of $\mathbf{F}$ are scalar multiples of the first row $[1, 2, -3]$:
   - Row 2: $2 \times [1, 2, -3]$
   - Row 3: $3 \times [1, 2, -3]$
   Thus, the system reduces to the single scalar equation:
   $$1 \cdot e_x + 2 \cdot e_y - 3(1) = 0 \implies e_x + 2 e_y = 3$$
3. Any point on this line satisfies the condition. For a camera with optical center projection at $e_y = 1$:
   $$e_x = 3 - 2(1) = 1 \implies \mathbf{e}_L = [1, 1, 1]^\top$$

---

### Problem 8.7: Census Transform Computation
**Statement:** A $3 \times 3$ image patch is:
$$I = \begin{bmatrix} 45 & 50 & 62 \\ 40 & 50 & 55 \\ 38 & 52 & 48 \end{bmatrix}$$
Compute the 8-bit Census Transform bitstring for the center pixel $(1, 1)$ with intensity $50$, comparing neighbors in raster order: $[I(0,0), I(0,1), I(0,2), I(1,0), I(1,2), I(2,0), I(2,1), I(2,2)]$.
Rule: Bit is $1$ if $I_{\text{neighbor}} < I_{\text{center}}$, else $0$.

**Step-by-step Solution:**
Center intensity $I_c = 50$.
1. $I(0, 0) = 45 < 50 \implies \mathbf{1}$
2. $I(0, 1) = 50 \not< 50 \implies \mathbf{0}$
3. $I(0, 2) = 62 \not< 50 \implies \mathbf{0}$
4. $I(1, 0) = 40 < 50 \implies \mathbf{1}$
5. $I(1, 2) = 55 \not< 50 \implies \mathbf{0}$
6. $I(2, 0) = 38 < 50 \implies \mathbf{1}$
7. $I(2, 1) = 52 \not< 50 \implies \mathbf{0}$
8. $I(2, 2) = 48 < 50 \implies \mathbf{1}$

Assembled Census bitstring:
$$\text{Census}(1, 1) = [1, 0, 0, 1, 0, 1, 0, 1]_2 = 0\text{x}95 = 149_{10}$$

---

### Problem 8.8: Hamming Distance Between Census Descriptors
**Statement:** The left Census descriptor is $\mathbf{c}_L = 0\text{b}10010101$, and the right candidate Census descriptor is $\mathbf{c}_R = 0\text{b}11010001$.
Compute the Census matching cost using bitwise XOR and population count.

**Step-by-step Solution:**
1. Compute bitwise XOR ($\mathbf{c}_L \oplus \mathbf{c}_R$):
   $$\begin{array}{r@{\quad}l}
   & 10010101 \\
   \oplus & 11010001 \\
   \hline
   = & 01000100
   \end{array}$$
2. Count the number of set bits (`popcount`):
   Bits at index 2 and index 6 are $1$.
   $$\text{Hamming Cost} = \text{popcount}(0\text{b}01000100) = 2$$
   The matching cost is $2$ bit differences out of $8$.

---

### Problem 8.9: Minimum Baseline Requirement for Depth Specification
**Statement:** A stereo camera mounted on a humanoid robot must measure distance up to $Z_{\text{max}} = 5.0\text{ meters}$ with a maximum depth error of $|\Delta Z| \le 5\text{ cm}$ ($0.05\text{ m}$).
The camera has focal length $f = 1000\text{ pixels}$ and disparity resolution $\Delta d = 0.25\text{ pixels}$.
Compute the minimum physical baseline $b_{\text{min}}$ in centimeters.

**Step-by-step Solution:**
1. Recall the depth error formula:
   $$\Delta Z = \frac{Z^2}{f \cdot b} \Delta d$$
2. Rearrange for baseline $b$:
   $$b = \frac{Z^2 \cdot \Delta d}{f \cdot \Delta Z}$$
3. Substitute the required values ($Z = 5.0\text{ m}, \Delta Z = 0.05\text{ m}, f = 1000\text{ pix}, \Delta d = 0.25\text{ pix}$):
   $$b = \frac{5.0^2 \times 0.25}{1000 \times 0.05} = \frac{25.0 \times 0.25}{50.0} = \frac{6.25}{50.0} = 0.125\text{ meters} = 12.5\text{ cm}$$
   The camera baseline must be at least $12.5\text{ cm}$ wide.

---

### Problem 8.10: Disparity Reprojection Matrix Q Application
**Statement:** A rectified stereo rig has $f = 500, c_x = 320, c_y = 240, b = 0.1\text{ m}$.
Write the $4 \times 4$ reprojection matrix $\mathbf{Q}$, and evaluate it for pixel $(u, v) = (420, 240)$ with disparity $d = 25\text{ pixels}$.

**Step-by-step Solution:**
1. Construct $\mathbf{Q}$:
   $$\mathbf{Q} = \begin{bmatrix} 1 & 0 & 0 & -c_x \\ 0 & 1 & 0 & -c_y \\ 0 & 0 & 0 & f \\ 0 & 0 & -1/b & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & -320 \\ 0 & 1 & 0 & -240 \\ 0 & 0 & 0 & 500 \\ 0 & 0 & -10 & 0 \end{bmatrix}$$
2. Vector multiplication with $[u, v, d, 1]^\top = [420, 240, 25, 1]^\top$:
   $$\mathbf{Q} \begin{bmatrix} 420 \\ 240 \\ 25 \\ 1 \end{bmatrix} = \begin{bmatrix} 420 - 320 \\ 240 - 240 \\ 500(1) \\ -10(25) \end{bmatrix} = \begin{bmatrix} 100 \\ 0 \\ 500 \\ -250 \end{bmatrix}$$
3. Normalizing by the 4th element (or using standard vision convention where $W = -d/b$, so $Z = -f / W$):
   Here $W = -250$. Depth $Z = \frac{f \cdot b}{d} = \frac{500 \times 0.1}{25} = 2.0\text{ meters}$.
   $X = \frac{(u - c_x) Z}{f} = \frac{100 \times 2.0}{500} = 0.40\text{ meters}$.
   $Y = 0\text{ meters}$.
   3D coordinate: $[0.40, 0.0, 2.0]^\top$ meters.

---

## 8.8 Solved Exercises

### Exercise 8.1: Singularity of the Fundamental Matrix
**Statement:** Prove algebraically from first principles that the Fundamental Matrix $\mathbf{F} = \mathbf{K}_R^{-\top} [\mathbf{t}]_\times \mathbf{R} \mathbf{K}_L^{-1}$ has a determinant of zero ($\det(\mathbf{F}) = 0$) and has rank at most 2.

**Solution:**
1. By the multiplicative property of determinants:
   $$\det(\mathbf{F}) = \det(\mathbf{K}_R^{-\top}) \cdot \det([\mathbf{t}]_\times) \cdot \det(\mathbf{R}) \cdot \det(\mathbf{K}_L^{-1})$$
2. For any valid camera intrinsics, $\det(\mathbf{K}) = f_x f_y > 0 \implies \det(\mathbf{K}^{-1}) \neq 0$.
3. For any valid rotation matrix, $\mathbf{R} \in \text{SO}(3) \implies \det(\mathbf{R}) = +1$.
4. Consider the skew-symmetric cross-product matrix:
   $$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix}$$
   Compute its determinant:
   $$\begin{aligned}
   \det([\mathbf{t}]_\times) &= 0 \cdot (0 - (-t_x^2)) - (-t_z)(0 - (-t_x t_y)) + t_y(t_x t_z - 0) \\
   &= t_z (-t_x t_y) + t_y (t_x t_z) = -t_x t_y t_z + t_x t_y t_z = 0
   \end{aligned}$$
5. Because $\det([\mathbf{t}]_\times) = 0$, the product of determinants is:
   $$\det(\mathbf{F}) = \det(\mathbf{K}_R^{-\top}) \times 0 \times 1 \times \det(\mathbf{K}_L^{-1}) = 0$$
6. Since $\mathbf{t} \neq \mathbf{0}$, $[\mathbf{t}]_\times$ has rank exactly 2 (its nullspace is spanned by $\mathbf{t}$). Because multiplying by non-singular matrices preserves matrix rank:
   $$\text{rank}(\mathbf{F}) = \text{rank}([\mathbf{t}]_\times) = 2 \quad \blacksquare$$

---

### Exercise 8.2: The Eight-Point Algorithm Formulation
**Statement:** In the Longuet-Higgins Eight-Point Algorithm, point correspondences satisfy $\mathbf{x}_i'^\top \mathbf{F} \mathbf{x}_i = 0$.
Expand this bilinear equation into a linear dot product $\mathbf{a}_i^\top \mathbf{f} = 0$, where $\mathbf{f} \in \mathbb{R}^9$ is the flattened fundamental matrix.

**Solution:**
1. Let $\mathbf{x}_i = [u, v, 1]^\top$ and $\mathbf{x}_i' = [u', v', 1]^\top$.
2. The Fundamental Matrix is:
   $$\mathbf{F} = \begin{bmatrix} f_{11} & f_{12} & f_{13} \\ f_{21} & f_{22} & f_{23} \\ f_{31} & f_{32} & f_{33} \end{bmatrix}$$
3. Expand $\mathbf{x}_i'^\top \mathbf{F} \mathbf{x}_i$:
   $$\begin{bmatrix} u' & v' & 1 \end{bmatrix} \begin{bmatrix} f_{11} u + f_{12} v + f_{13} \\ f_{21} u + f_{22} v + f_{23} \\ f_{31} u + f_{32} v + f_{33} \end{bmatrix} = 0$$
   Multiplying out:
   $$u'(f_{11} u + f_{12} v + f_{13}) + v'(f_{21} u + f_{22} v + f_{23}) + 1(f_{31} u + f_{32} v + f_{33}) = 0$$
4. Rearranging in terms of the elements of $\mathbf{f} = [f_{11}, f_{12}, f_{13}, f_{21}, f_{22}, f_{23}, f_{31}, f_{32}, f_{33}]^\top$:
   $$u'u f_{11} + u'v f_{12} + u' f_{13} + v'u f_{21} + v'v f_{22} + v' f_{23} + u f_{31} + v f_{32} + 1 f_{33} = 0$$
5. The row vector $\mathbf{a}_i^\top$ is:
   $$\mathbf{a}_i^\top = \begin{bmatrix} u' u & u' v & u' & v' u & v' v & v' & u & v & 1 \end{bmatrix} \quad \blacksquare$$

---

### Exercise 8.3: Enforcing the Rank-2 Singularity Constraint via SVD
**Statement:** The linear 8-point solution yields an estimated matrix $\tilde{\mathbf{F}}$ that generally has full rank 3 due to image noise ($\det(\tilde{\mathbf{F}}) \neq 0$).
Show how to project $\tilde{\mathbf{F}}$ onto the closest rank-2 manifold in the Frobenius norm sense.

**Solution:**
1. Compute the SVD of the estimated matrix $\tilde{\mathbf{F}}$:
   $$\tilde{\mathbf{F}} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^\top = \mathbf{U} \begin{bmatrix} \sigma_1 & 0 & 0 \\ 0 & \sigma_2 & 0 \\ 0 & 0 & \sigma_3 \end{bmatrix} \mathbf{V}^\top \quad \text{where } \sigma_1 \ge \sigma_2 \ge \sigma_3 > 0$$
2. By the Eckart-Young-Mirsky Theorem, the optimal rank-2 matrix $\mathbf{F}^*$ that minimizes the Frobenius norm distance $\|\tilde{\mathbf{F}} - \mathbf{F}^*\|_F$ is obtained by setting the smallest singular value $\sigma_3$ to zero:
   $$\boldsymbol{\Sigma}^* = \begin{bmatrix} \sigma_1 & 0 & 0 \\ 0 & \sigma_2 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
3. Reconstruct the singular Fundamental Matrix:
   $$\mathbf{F}^* = \mathbf{U} \boldsymbol{\Sigma}^* \mathbf{V}^\top$$
   Now $\det(\mathbf{F}^*) = \sigma_1 \sigma_2 \times 0 = 0$, guaranteeing that all epipolar lines intersect at a unique epipole. $\blacksquare$

---

### Exercise 8.4: Essential Matrix Pose Ambiguity (The 4 Solutions)
**Statement:** Decomposing an Essential Matrix $\mathbf{E} = \mathbf{U} \text{diag}(1, 1, 0) \mathbf{V}^\top$ yields four possible mathematical pairs $(\mathbf{R}, \mathbf{t})$. Explain why four solutions exist, and describe how the **cheirality test** selects the single physically correct pose.

**Solution:**
1. Define the orthogonal matrix $\mathbf{W} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$.
2. The translation vector is determined up to sign: $\mathbf{t} = \pm \mathbf{u}_3$ (the third column of $\mathbf{U}$).
3. The rotation matrix has two choices: $\mathbf{R} = \mathbf{U} \mathbf{W} \mathbf{V}^\top$ or $\mathbf{R} = \mathbf{U} \mathbf{W}^\top \mathbf{V}^\top$.
4. Combining the 2 rotations and 2 translations yields **4 distinct solutions**:
   - Solution 1: $(\mathbf{R}_1, +\mathbf{t})$
   - Solution 2: $(\mathbf{R}_1, -\mathbf{t})$
   - Solution 3: $(\mathbf{R}_2, +\mathbf{t})$
   - Solution 4: $(\mathbf{R}_2, -\mathbf{t})$
5. **Cheirality Selection:**
   Triangulate a 3D scene point $\mathbf{X}$ under each of the 4 configurations:
   - In Solution 1, the point lies in front of both cameras: $Z_L > 0$ and $Z_R > 0$.
   - In Solution 2, the point lies behind both cameras: $Z_L < 0$ and $Z_R < 0$.
   - In Solutions 3 and 4, the camera is rotated by $180^\circ$, so the point lies in front of one camera and behind the other.
   The single physically valid hypothesis is the unique solution where the triangulated 3D point has positive depth in **both** cameras ($Z_L > 0$ and $Z_R > 0$). $\blacksquare$

---

### Exercise 8.5: Sampson Distance for Epipolar Error
**Statement:** Define the **Sampson First-Order Geometric Distance** $d_{\text{Sampson}}(\mathbf{x}_L, \mathbf{x}_R; \mathbf{F})$ and explain why it is superior to algebraic error $(\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L)^2$.

**Solution:**
1. The algebraic error is $\epsilon = \mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L$.
2. The Sampson error approximates the squared Euclidean geometric distance from the points to their respective epipolar lines:
   $$d_{\text{Sampson}}(\mathbf{x}_L, \mathbf{x}_R; \mathbf{F}) \triangleq \frac{(\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L)^2}{(\mathbf{F} \mathbf{x}_L)_1^2 + (\mathbf{F} \mathbf{x}_L)_2^2 + (\mathbf{F}^\top \mathbf{x}_R)_1^2 + (\mathbf{F}^\top \mathbf{x}_R)_2^2}$$
3. The denominator represents the sum of the squared gradients of the epipolar lines.
   Dividing by this gradient normalizes the algebraic error into true physical distance in **squared pixels** ($\text{pixels}^2$).

---

### Exercise 8.6: Pure Translation Epipole Location
**Statement:** In a forward-moving robot camera (visual odometry), the translation is strictly forward along the optical axis ($\mathbf{t} = [0, 0, t_z]^\top$) with zero rotation ($\mathbf{R} = \mathbf{I}$).
Where are the epipoles located on the image planes?

**Solution:**
1. The epipole is the projection of the relative translation direction:
   $$\mathbf{e} \propto \mathbf{K} \mathbf{t} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ t_z \end{bmatrix} = \begin{bmatrix} c_x t_z \\ c_y t_z \\ t_z \end{bmatrix}$$
2. Dividing by $t_z$:
   $$\mathbf{e} = [c_x, c_y, 1]^\top$$
   The epipole is located **exactly at the principal point $(c_x, c_y)$**!
   This point is the **Focus of Expansion (FOE)**: all image features appear to stream radially outwards from the principal point. $\blacksquare$

---

### Exercise 8.7: Epipolar Lines for Pure Sideways Motion
**Statement:** For pure horizontal sideways translation ($\mathbf{t} = [t_x, 0, 0]^\top, \mathbf{R} = \mathbf{I}$), find the epipoles and describe the orientation of all epipolar lines.

**Solution:**
1. The epipole is:
   $$\mathbf{e} \propto \mathbf{K} \begin{bmatrix} t_x \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} f_x t_x \\ 0 \\ 0 \end{bmatrix} \sim \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
2. The homogeneous coordinate $[1, 0, 0]^\top$ represents the ideal point at infinity along the horizontal $u$-axis.
3. Every epipolar line passes through the epipole $\mathbf{e}$:
   $$\mathbf{l}^\top \mathbf{e} = 0 \implies l_1(1) + l_2(0) + l_3(0) = 0 \implies l_1 = 0$$
   The line equation is $0 \cdot u + l_2 v + l_3 = 0 \implies v = -l_3/l_2 = \text{constant}$.
   All epipolar lines are strictly **horizontal scanlines**. $\blacksquare$

---

### Exercise 8.8: Left-Right Consistency Check in Stereo Matching
**Statement:** Explain how the **Left-Right Consistency (LRC) check** detects occlusions and false matches in dense stereo matching.

**Solution:**
1. Run dense stereo matching with the left image as reference to obtain disparity map $D_L(x, y)$.
2. Independently run stereo matching with the right image as reference to obtain disparity map $D_R(x, y)$.
3. For each pixel $(x, y)$ in the left image:
   - Its predicted match in the right image is $x' = x - D_L(x, y)$.
   - Check the disparity computed at that right pixel: $d_{\text{check}} = D_R(x', y)$.
4. If the pixel is a true physical match (not occluded):
   $$|D_L(x, y) - D_R(x - D_L(x, y), y)| \le \epsilon \quad (\text{typically } \epsilon = 1 \text{ pixel})$$
5. If the condition fails, the pixel is an **occlusion** (visible to the left camera but blocked from the right camera's view) or a spurious mismatch, and is invalidated. $\blacksquare$

---

### Exercise 8.9: Sub-Pixel Disparity Interpolation via Quadratic Parabola
**Statement:** Around the integer disparity $d^*$ that achieves minimum matching cost $\mathcal{C}(d^*)$, the costs at neighboring disparities are $\mathcal{C}(d^* - 1) = C_{-1}$, $\mathcal{C}(d^*) = C_0$, and $\mathcal{C}(d^* + 1) = C_{+1}$.
Derive the sub-pixel disparity peak $\hat{d} = d^* + \delta$ by fitting an analytical parabola.

**Solution:**
1. Fit a continuous quadratic parabola $f(\delta) = a \delta^2 + b \delta + c$ centered at $\delta = 0$ ($d = d^*$):
   - At $\delta = 0$: $f(0) = c = C_0$
   - At $\delta = +1$: $f(1) = a + b + C_0 = C_{+1}$
   - At $\delta = -1$: $f(-1) = a - b + C_0 = C_{-1}$
2. Add the two equations:
   $$(a + b + C_0) + (a - b + C_0) = C_{+1} + C_{-1} \implies 2a + 2C_0 = C_{+1} + C_{-1} \implies a = \frac{C_{+1} + C_{-1} - 2C_0}{2}$$
3. Subtract the two equations:
   $$(a + b + C_0) - (a - b + C_0) = C_{+1} - C_{-1} \implies 2b = C_{+1} - C_{-1} \implies b = \frac{C_{+1} - C_{-1}}{2}$$
4. Find the minimum of the parabola:
   $$f'(\delta) = 2a \delta + b = 0 \implies \delta^* = -\frac{b}{2a}$$
5. Substitute $a$ and $b$:
   $$\delta^* = -\frac{(C_{+1} - C_{-1}) / 2}{2 \left( \frac{C_{+1} + C_{-1} - 2C_0}{2} \right)} = \frac{C_{-1} - C_{+1}}{2(C_{+1} + C_{-1} - 2C_0)}$$
   The sub-pixel disparity estimate is:
   $$\hat{d} = d^* + \frac{C_{-1} - C_{+1}}{2(C_{-1} - 2C_0 + C_{+1})} \quad \blacksquare$$

---

### Exercise 8.10: Triangulation via Direct Linear Transformation (Midpoint Method)
**Statement:** Given two general camera projection matrices $\mathbf{P}_1$ and $\mathbf{P}_2$ and measured pixel correspondences $\mathbf{x}_1 = [u_1, v_1, 1]^\top$ and $\mathbf{x}_2 = [u_2, v_2, 1]^\top$, write the $4 \times 4$ linear system $\mathbf{A} \tilde{\mathbf{X}} = \mathbf{0}$ to triangulate the 3D world coordinate $\tilde{\mathbf{X}}$.

**Solution:**
1. For camera 1: $\mathbf{x}_1 \times (\mathbf{P}_1 \tilde{\mathbf{X}}) = \mathbf{0}$.
   Expanding the cross-product gives 2 independent rows:
   $$u_1 (\mathbf{p}_{1, 3}^\top \tilde{\mathbf{X}}) - \mathbf{p}_{1, 1}^\top \tilde{\mathbf{X}} = 0 \implies (u_1 \mathbf{p}_{1, 3} - \mathbf{p}_{1, 1})^\top \tilde{\mathbf{X}} = 0$$
   $$v_1 (\mathbf{p}_{1, 3}^\top \tilde{\mathbf{X}}) - \mathbf{p}_{1, 2}^\top \tilde{\mathbf{X}} = 0 \implies (v_1 \mathbf{p}_{1, 3} - \mathbf{p}_{1, 2})^\top \tilde{\mathbf{X}} = 0$$
2. Similarly, for camera 2:
   $$(u_2 \mathbf{p}_{2, 3} - \mathbf{p}_{2, 1})^\top \tilde{\mathbf{X}} = 0$$
   $$(v_2 \mathbf{p}_{2, 3} - \mathbf{p}_{2, 2})^\top \tilde{\mathbf{X}} = 0$$
3. Assembling the $4 \times 4$ linear system $\mathbf{A} \tilde{\mathbf{X}} = \mathbf{0}$:
   $$\mathbf{A} = \begin{bmatrix} u_1 \mathbf{p}_{1, 3}^\top - \mathbf{p}_{1, 1}^\top \\ v_1 \mathbf{p}_{1, 3}^\top - \mathbf{p}_{1, 2}^\top \\ u_2 \mathbf{p}_{2, 3}^\top - \mathbf{p}_{2, 1}^\top \\ v_2 \mathbf{p}_{2, 3}^\top - \mathbf{p}_{2, 2}^\top \end{bmatrix} \in \mathbb{R}^{4 \times 4}$$
4. Solving $\mathbf{A} \tilde{\mathbf{X}} = \mathbf{0}$ via SVD yields the optimal 3D point $\tilde{\mathbf{X}} = [X, Y, Z, W]^\top$ that minimizes algebraic reprojection error. $\blacksquare$
