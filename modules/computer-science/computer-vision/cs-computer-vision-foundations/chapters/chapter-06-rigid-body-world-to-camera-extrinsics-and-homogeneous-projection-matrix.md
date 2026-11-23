# Chapter 6: Rigid Body World-to-Camera Extrinsics and Homogeneous Projection Matrix

---

## 6.1 World vs. Camera Coordinate Frames and Rigid Euclidean Kinematics

In practical robotics and embodied AI, objects, obstacles, and landmarks exist in a global **World Coordinate Frame** $\mathcal{F}_W$ (e.g., an inertial navigation frame, a factory floor map, or a simulation environment). The camera, mounted on a mobile robot chassis or an articulated robotic arm, moves dynamically through this environment, defining its own local **Camera Coordinate Frame** $\mathcal{F}_C$.

```
                      WORLD VS. CAMERA COORDINATE FRAMES
                      
             World Frame F_W                           Camera Frame F_C
                  Z_W                                        Z_C (Optical Axis)
                   ▲                                         ▲
                   │                                        /
                   │                                       /
                   │                                      o──────► X_C
                   o──────► Y_W                          │ Optical Center C
                  /                                      │
                 /                                       ▼ Y_C
                ▼ X_W
                
                Camera Position in World: C = -R^T t
                Rigid Pose Transformation: X_C = R X_W + t
```

### The Standard Computer Vision Camera Coordinate Frame
In standard computer vision conventions (OpenCV, ROS camera conventions):
- The **origin** $\mathbf{C}$ is at the camera's optical projection center.
- The **$+Z_C$-axis** points forward along the optical axis into the observed scene.
- The **$+X_C$-axis** points horizontally to the right.
- The **$+Y_C$-axis** points vertically downward (forming a right-handed orthogonal system).

### Rigid Euclidean Transformation ($\text{SE}(3)$)
Any rigid-body motion in 3D Euclidean space preserves distances and angles, belonging to the Special Euclidean Group $\text{SE}(3)$. A 3D point $\mathbf{X}_W = [X_W, Y_W, Z_W]^\top$ expressed in the world frame is transformed into camera coordinates $\mathbf{X}_C = [X_C, Y_C, Z_C]^\top$ via:

$$\mathbf{X}_C = \mathbf{R} \mathbf{X}_W + \mathbf{t}$$

where:
- $\mathbf{R} \in \text{SO}(3)$ is a $3 \times 3$ **Rotation Matrix** belonging to the Special Orthogonal Group:
  $$\mathbf{R}^\top \mathbf{R} = \mathbf{I}_{3 \times 3}, \quad \det(\mathbf{R}) = +1$$
- $\mathbf{t} \in \mathbb{R}^3$ is a 3D **Translation Vector**.

### Physical Meaning of R and t
A ubiquitous source of error in robotics and computer vision is the physical misinterpretation of the translation vector $\mathbf{t}$:
1. **The vector $\mathbf{t}$ is NOT the position of the camera in the world!**
   Instead, setting $\mathbf{X}_W = [0, 0, 0]^\top$ yields $\mathbf{X}_C = \mathbf{t}$. Thus, $\mathbf{t}$ represents the **position of the world origin expressed in camera coordinates**.
2. **The Camera Center $\mathbf{C}$ in World Coordinates:**
   The optical center $\mathbf{C}$ is the point whose camera coordinates are zero: $\mathbf{X}_C = \mathbf{0}$.
   Substituting into the transformation:
   $$\mathbf{0} = \mathbf{R} \mathbf{C} + \mathbf{t} \implies \mathbf{R} \mathbf{C} = -\mathbf{t}$$
   Multiplying both sides by $\mathbf{R}^\top$ (since $\mathbf{R}^{-1} = \mathbf{R}^\top$):
   $$\mathbf{C} = -\mathbf{R}^\top \mathbf{t}$$
   This vector $\mathbf{C} \in \mathbb{R}^3$ represents the true physical position of the camera center in world space.

Conversely, the inverse transformation from camera coordinates to world coordinates is:
$$\mathbf{X}_W = \mathbf{R}^\top (\mathbf{X}_C - \mathbf{t}) = \mathbf{R}^\top \mathbf{X}_C + \mathbf{C}$$

---

## 6.2 The Full $3 \times 4$ Camera Projection Matrix P

We can now mathematically unite the physical rigid-body pose of the camera (its **extrinsics**) with its internal optical geometry (its **intrinsics**) into a single, unified mathematical operator.

### Derivation via Homogeneous Matrix Multiplication
1. **Extrinsic Transformation in Homogeneous Coordinates:**
   Augmenting the vectors with an extra row of 1:
   $$\begin{bmatrix} X_C \\ Y_C \\ Z_C \\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} \begin{bmatrix} X_W \\ Y_W \\ Z_W \\ 1 \end{bmatrix} = \mathbf{T}_{CW} \tilde{\mathbf{X}}_W$$
   where $\mathbf{T}_{CW} \in \text{SE}(3)$ is the $4 \times 4$ homogeneous transformation matrix.

2. **Intrinsic Perspective Projection:**
   From Chapter 5, the intrinsic matrix $\mathbf{K} \in \mathbb{R}^{3 \times 3}$ projects 3D camera coordinates $\mathbf{X}_C$ to 2D homogeneous pixel coordinates $\tilde{\mathbf{x}} = [u, v, 1]^\top$:
   $$\lambda \tilde{\mathbf{x}} = \mathbf{K} \mathbf{X}_C = \mathbf{K} [\mathbf{I}_{3 \times 3} \mid \mathbf{0}] \begin{bmatrix} \mathbf{X}_C \\ 1 \end{bmatrix}$$

3. **Concatenation into the Camera Projection Matrix $\mathbf{P}$:**
   $$\lambda \tilde{\mathbf{x}} = \mathbf{K} [\mathbf{I} \mid \mathbf{0}] \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} \tilde{\mathbf{X}}_W = \mathbf{K} [\mathbf{R} \mid \mathbf{t}] \tilde{\mathbf{X}}_W$$

Define the **Camera Projection Matrix** $\mathbf{P} \in \mathbb{R}^{3 \times 4}$:
$$\mathbf{P} \triangleq \mathbf{K} [\mathbf{R} \mid \mathbf{t}] = [\mathbf{K}\mathbf{R} \mid \mathbf{K}\mathbf{t}]$$

The entire imaging process—from a 3D point anywhere in the physical universe to an integer pixel coordinate on the computer monitor—is encapsulated in a single linear projective equation:

$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{P} \begin{bmatrix} X_W \\ Y_W \\ Z_W \\ 1 \end{bmatrix} = \begin{bmatrix} p_{11} & p_{12} & p_{13} & p_{14} \\ p_{21} & p_{22} & p_{23} & p_{24} \\ p_{31} & p_{32} & p_{33} & p_{34} \end{bmatrix} \begin{bmatrix} X_W \\ Y_W \\ Z_W \\ 1 \end{bmatrix}$$

```
                    THE CAMERA PROJECTION MATRIX DECOMPOSITION
                    
                           P = K [ R | t ]  ∈ R^(3x4)
                           
               Intrinsics (3x3)              Extrinsics (3x4)
           ┌                     ┐       ┌                       ┐
           │  f_x    0    c_x    │       │  r11   r12   r13   t1 │
           │   0    f_y   c_y    │   *   │  r21   r22   r23   t2 │
           │   0     0     1     │       │  r31   r32   r33   t3 │
           └                     ┘       └                       ┘
           (Focal lengths, Center)       (Rotation R, Translation t)
```

### Cartesian Pixel Recovery
Multiplying $\mathbf{P} \tilde{\mathbf{X}}_W$ produces a 3D projective vector $[\tilde{u}, \tilde{v}, \tilde{w}]^\top$:
$$\tilde{u} = \mathbf{p}_1^\top \tilde{\mathbf{X}}_W, \quad \tilde{v} = \mathbf{p}_2^\top \tilde{\mathbf{X}}_W, \quad \tilde{w} = \mathbf{p}_3^\top \tilde{\mathbf{X}}_W$$
where $\mathbf{p}_i^\top$ denotes the $i$-th row vector of $\mathbf{P}$.

The scale factor $\lambda$ is exactly the third coordinate: $\lambda = \tilde{w} = Z_C$ (the depth of the point in the camera frame).
Dividing by $\tilde{w}$ yields the physical pixel coordinates:
$$u = \frac{\tilde{u}}{\tilde{w}} = \frac{\mathbf{p}_1^\top \tilde{\mathbf{X}}_W}{\mathbf{p}_3^\top \tilde{\mathbf{X}}_W}, \quad v = \frac{\tilde{v}}{\tilde{w}} = \frac{\mathbf{p}_2^\top \tilde{\mathbf{X}}_W}{\mathbf{p}_3^\top \tilde{\mathbf{X}}_W}$$

### Degrees of Freedom
The projection matrix $\mathbf{P}$ has 12 numerical entries, but because projective equality is defined up to an arbitrary global non-zero scale factor ($\mathbf{P} \sim \alpha \mathbf{P}$), $\mathbf{P}$ possesses **11 degrees of freedom**:
- **5 Intrinsic parameters:** $f_x, f_y, c_x, c_y, s$.
- **6 Extrinsic parameters:** 3 Euler rotation angles ($\text{roll, pitch, yaw}$) defining $\mathbf{R} \in \text{SO}(3)$, and 3 Cartesian translation coordinates $(t_x, t_y, t_z)$.

---

## 6.3 Optical Center Nullspace Theorem and Geometric Decomposition

The $3 \times 4$ projection matrix $\mathbf{P}$ has a non-trivial 1-dimensional nullspace. The geometric meaning of this nullspace is one of the most elegant theorems in projective geometry.

### The Optical Center Nullspace Theorem
**Theorem:** The homogeneous coordinates of the camera optical center $\tilde{\mathbf{C}} = [\mathbf{C}^\top, 1]^\top \in \mathbb{R}^4$ span the right nullspace of $\mathbf{P}$:
$$\mathbf{P} \tilde{\mathbf{C}} = \mathbf{0}_{3 \times 1}$$

**Proof:**
Recall $\mathbf{P} = \mathbf{K} [\mathbf{R} \mid \mathbf{t}]$ and $\mathbf{C} = -\mathbf{R}^\top \mathbf{t}$.
Evaluate the matrix product $\mathbf{P} \tilde{\mathbf{C}}$:
$$\mathbf{P} \tilde{\mathbf{C}} = \mathbf{K} [\mathbf{R} \mid \mathbf{t}] \begin{bmatrix} \mathbf{C} \\ 1 \end{bmatrix} = \mathbf{K} (\mathbf{R} \mathbf{C} + \mathbf{t})$$
Substitute $\mathbf{C} = -\mathbf{R}^\top \mathbf{t}$:
$$\mathbf{R} \mathbf{C} + \mathbf{t} = \mathbf{R} (-\mathbf{R}^\top \mathbf{t}) + \mathbf{t} = -(\mathbf{R} \mathbf{R}^\top) \mathbf{t} + \mathbf{t} = -\mathbf{I} \mathbf{t} + \mathbf{t} = \mathbf{0}$$
Therefore:
$$\mathbf{P} \tilde{\mathbf{C}} = \mathbf{K} \mathbf{0} = \mathbf{0} \quad \blacksquare$$

> [!NOTE]
> Physical intuition: The optical center $\mathbf{C}$ is the point through which all projection rays pass. It cannot project to any unique pixel on the image plane; hence, its projection is mathematically undefined ($[0, 0, 0]^\top$). Given an arbitrary computed matrix $\mathbf{P}$, the optical center $\mathbf{C}$ can be recovered by computing the Singular Value Decomposition (SVD) of $\mathbf{P}$ and extracting the right singular vector corresponding to the zero singular value.

### RQ Decomposition for Intrinsics and Extrinsics Extraction
Given an arbitrary estimated $3 \times 4$ matrix $\mathbf{P}$, partition it into its left $3 \times 3$ submatrix $\mathbf{M}$ and last column $\mathbf{p}_4$:
$$\mathbf{P} = [\mathbf{M} \mid \mathbf{p}_4]$$
From the derivation, $\mathbf{M} = \mathbf{K} \mathbf{R}$.
Because $\mathbf{K}$ is an upper-triangular matrix with positive diagonal entries and $\mathbf{R}$ is an orthogonal rotation matrix ($\mathbf{R} \in \text{SO}(3)$), the matrix product $\mathbf{M} = \mathbf{K} \mathbf{R}$ represents an **RQ Decomposition**!

By computing the RQ decomposition of $\mathbf{M}$:
$$\mathbf{M} \xrightarrow{\text{RQ}} \mathbf{K} \cdot \mathbf{R}$$
we uniquely factor $\mathbf{P}$ back into its underlying physical components:
- $\mathbf{K}$: Upper triangular intrinsic matrix.
- $\mathbf{R}$: Orthogonal rotation matrix.
- $\mathbf{t}$: Translation vector obtained via $\mathbf{t} = \mathbf{K}^{-1} \mathbf{p}_4$.

---

## 6.4 3D Ray Back-Projection into World Space

In robotic manipulation, a camera identifies a target object at pixel $(u, v)$ on a table. The robot must compute the 3D line in world space along which the gripper must move to intercept the object.

```
                         3D RAY BACK-PROJECTION IN WORLD SPACE
                         
          Camera Center C
                 o
                  \
                   \     Ray Direction d_W = R^T K^(-1) x
                    \               ▲
                     \             /
                      \           /
                       \         /
      ──────────────────\───────o──────────────────── Image Plane
                         \     (u, v)
                          \
                           \
                            ▼
                         3D Object Point X_W(λ) = C + λ d_W
```

### Mathematical Derivation of the World Ray
1. From pixel coordinates $\mathbf{x} = [u, v, 1]^\top$, invert the intrinsics to obtain the normalized ray direction in the camera frame:
   $$\mathbf{d}_C = \mathbf{K}^{-1} \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \begin{bmatrix} (u - c_x)/f_x \\ (v - c_y)/f_y \\ 1 \end{bmatrix}$$
2. Rotate the ray direction from the camera frame into the world frame using $\mathbf{R}^\top$:
   $$\mathbf{d}_W = \mathbf{R}^\top \mathbf{d}_C = \mathbf{R}^\top \mathbf{K}^{-1} \begin{bmatrix} u \\ v \\ 1 \end{bmatrix}$$
3. Normalize the direction vector to unit length:
   $$\hat{\mathbf{d}}_W = \frac{\mathbf{d}_W}{\|\mathbf{d}_W\|}$$
4. The 3D back-projection ray in world coordinates parameterized by distance $\lambda > 0$ is:
   $$\mathbf{X}_W(\lambda) = \mathbf{C} + \lambda \hat{\mathbf{d}}_W = -\mathbf{R}^\top \mathbf{t} + \lambda \frac{\mathbf{R}^\top \mathbf{K}^{-1} \tilde{\mathbf{x}}}{\|\mathbf{R}^\top \mathbf{K}^{-1} \tilde{\mathbf{x}}\|}$$

### Intersection of a Visual Ray with a Known World Plane
Suppose the target object rests on a known planar surface (such as a conveyor belt, robotic workbench, or floor) defined by the world plane equation:
$$\mathbf{n}^\top \mathbf{X}_W + d = 0$$
where $\mathbf{n} = [n_x, n_y, n_z]^\top$ is the unit surface normal and $d \in \mathbb{R}$ is the plane offset.

Substitute the parametric ray equation $\mathbf{X}_W(\lambda) = \mathbf{C} + \lambda \hat{\mathbf{d}}_W$ into the plane equation:
$$\mathbf{n}^\top (\mathbf{C} + \lambda \hat{\mathbf{d}}_W) + d = 0 \implies \mathbf{n}^\top \mathbf{C} + \lambda (\mathbf{n}^\top \hat{\mathbf{d}}_W) + d = 0$$

Solving for distance $\lambda$:
$$\lambda^* = \frac{-(d + \mathbf{n}^\top \mathbf{C})}{\mathbf{n}^\top \hat{\mathbf{d}}_W}$$

If $\mathbf{n}^\top \hat{\mathbf{d}}_W \neq 0$ and $\lambda^* > 0$, the ray pierces the plane at the unique 3D world coordinate:
$$\mathbf{X}_W^* = \mathbf{C} + \lambda^* \hat{\mathbf{d}}_W$$
This enables a monocular robot camera to perform metric 3D grasping without depth sensors!

---

## 6.5 Camera Frustum Geometry and View-Volume Clipping Planes

In 3D computer graphics, autonomous driving, and SLAM, the **camera frustum** is the 3D pyramid representing the visible portion of space bounded by the camera's field of view, a near clipping plane $Z_{\text{near}}$, and a far clipping plane $Z_{\text{far}}$.

```
                            THE CAMERA VIEW FRUSTUM
                            
                                Near Plane
                                ┌───────┐
                               │       │
                               │       │           Far Plane
       Optical Center C        └───────┘       ┌───────────────┐
              o───────────────/───────/───────►│               │
                              \       \        │               │
                               \       \       │               │
                                └───────┘      └───────────────┘
                                                ◄── Field of View ──►
```

The view frustum is bounded by 6 planar half-spaces:
1. **Near Plane:** $Z_C \ge Z_{\text{near}}$
2. **Far Plane:** $Z_C \le Z_{\text{far}}$
3. **Left Plane:** $u \ge 0$
4. **Right Plane:** $u \le W$
5. **Top Plane:** $v \ge 0$
6. **Bottom Plane:** $v \le H$

### Extracting Frustum Plane Equations from Rows of P
Let the rows of the camera projection matrix $\mathbf{P}$ be denoted by $\mathbf{p}_1^\top, \mathbf{p}_2^\top, \mathbf{p}_3^\top$.
The projection equations are:
$$u = \frac{\mathbf{p}_1^\top \tilde{\mathbf{X}}}{\mathbf{p}_3^\top \tilde{\mathbf{X}}}, \quad v = \frac{\mathbf{p}_2^\top \tilde{\mathbf{X}}}{\mathbf{p}_3^\top \tilde{\mathbf{X}}}$$

For any 3D point $\tilde{\mathbf{X}}$ in front of the camera, the depth denominator must be positive: $\mathbf{p}_3^\top \tilde{\mathbf{X}} > 0$.
The boundary inequalities in homogeneous coordinates become:
- **Left boundary ($u \ge 0$):**
  $$\frac{\mathbf{p}_1^\top \tilde{\mathbf{X}}}{\mathbf{p}_3^\top \tilde{\mathbf{X}}} \ge 0 \iff \mathbf{p}_1^\top \tilde{\mathbf{X}} \ge 0 \implies \boldsymbol{\pi}_{\text{left}} = \mathbf{p}_1$$
- **Right boundary ($u \le W$):**
  $$\frac{\mathbf{p}_1^\top \tilde{\mathbf{X}}}{\mathbf{p}_3^\top \tilde{\mathbf{X}}} \le W \iff (W \mathbf{p}_3 - \mathbf{p}_1)^\top \tilde{\mathbf{X}} \ge 0 \implies \boldsymbol{\pi}_{\text{right}} = W \mathbf{p}_3 - \mathbf{p}_1$$
- **Top boundary ($v \ge 0$):**
  $$\boldsymbol{\pi}_{\text{top}} = \mathbf{p}_2$$
- **Bottom boundary ($v \le H$):**
  $$\boldsymbol{\pi}_{\text{bottom}} = H \mathbf{p}_3 - \mathbf{p}_2$$

A 3D world landmark $\tilde{\mathbf{X}}_W$ is visible inside the camera's field of view if and only if it satisfies all boundary inequalities:
$$\boldsymbol{\pi}_k^\top \tilde{\mathbf{X}}_W \ge 0 \quad \forall k \in \{\text{left}, \text{right}, \text{top}, \text{bottom}\}$$

---

## 6.6 Worked Examples

### Problem 6.1: Full $3 \times 4$ Projection Matrix Construction
**Statement:** A robot camera has intrinsic matrix $\mathbf{K} = \begin{bmatrix} 1000 & 0 & 500 \\ 0 & 1000 & 500 \\ 0 & 0 & 1 \end{bmatrix}$.
The camera is translated to world position $\mathbf{C} = [0, 2, 5]^\top$ meters. Its orientation is rotated by $180^\circ$ around the world $X$-axis (so the camera points along $-Z_W$ with its vertical axis flipped: $\mathbf{R} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$).
1. Compute the extrinsic translation vector $\mathbf{t}$.
2. Compute the full $3 \times 4$ projection matrix $\mathbf{P}$.
3. Project the world point $\mathbf{X}_W = [1, 2, 2]^\top$ to 2D pixel coordinates $(u, v)$.

**Step-by-step Solution:**
1. **Extrinsic Translation $\mathbf{t}$:**
   From $\mathbf{C} = -\mathbf{R}^\top \mathbf{t}$, we have $\mathbf{t} = -\mathbf{R} \mathbf{C}$.
   $$\mathbf{t} = -\begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \begin{bmatrix} 0 \\ 2 \\ 5 \end{bmatrix} = -\begin{bmatrix} 0 \\ -2 \\ -5 \end{bmatrix} = \begin{bmatrix} 0 \\ 2 \\ 5 \end{bmatrix}$$
   The extrinsic matrix is $[\mathbf{R} \mid \mathbf{t}] = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & -1 & 0 & 2 \\ 0 & 0 & -1 & 5 \end{bmatrix}$.

2. **Projection Matrix $\mathbf{P} = \mathbf{K} [\mathbf{R} \mid \mathbf{t}]$:**
   $$\mathbf{K} \mathbf{R} = \begin{bmatrix} 1000 & 0 & 500 \\ 0 & 1000 & 500 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} = \begin{bmatrix} 1000 & 0 & -500 \\ 0 & -1000 & -500 \\ 0 & 0 & -1 \end{bmatrix}$$
   $$\mathbf{K} \mathbf{t} = \begin{bmatrix} 1000 & 0 & 500 \\ 0 & 1000 & 500 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 2 \\ 5 \end{bmatrix} = \begin{bmatrix} 0 + 0 + 2500 \\ 0 + 2000 + 2500 \\ 5 \end{bmatrix} = \begin{bmatrix} 2500 \\ 4500 \\ 5 \end{bmatrix}$$
   Assembling $\mathbf{P}$:
   $$\mathbf{P} = \begin{bmatrix} 1000 & 0 & -500 & 2500 \\ 0 & -1000 & -500 & 4500 \\ 0 & 0 & -1 & 5 \end{bmatrix}$$

3. **Projecting $\mathbf{X}_W = [1, 2, 2]^\top$ ($\tilde{\mathbf{X}}_W = [1, 2, 2, 1]^\top$):**
   $$\begin{aligned}
   \begin{bmatrix} \tilde{u} \\ \tilde{v} \\ \tilde{w} \end{bmatrix} &= \mathbf{P} \begin{bmatrix} 1 \\ 2 \\ 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 1000(1) + 0(2) - 500(2) + 2500(1) \\ 0(1) - 1000(2) - 500(2) + 4500(1) \\ 0(1) + 0(2) - 1(2) + 5(1) \end{bmatrix} \\
   &= \begin{bmatrix} 1000 - 1000 + 2500 \\ -2000 - 1000 + 4500 \\ -2 + 5 \end{bmatrix} = \begin{bmatrix} 2500 \\ 1500 \\ 3 \end{bmatrix}
   \end{aligned}$$
   Dividing by depth $\tilde{w} = 3$:
   $$u = \frac{2500}{3} \approx 833.33 \text{ pixels}$$
   $$v = \frac{1500}{3} = 500.0 \text{ pixels}$$
   The point projects at $(u, v) = (833.33, 500.0)$.

---

### Problem 6.2: Optical Center Recovery from Given Projection Matrix
**Statement:** A camera calibration algorithm estimates the following $3 \times 4$ projection matrix:
$$\mathbf{P} = \begin{bmatrix} 700 & 0 & 300 & -2100 \\ 0 & 700 & 200 & -1400 \\ 0 & 0 & 1 & -5 \end{bmatrix}$$
Recover the 3D coordinates of the camera optical center $\mathbf{C} = [C_X, C_Y, C_Z]^\top$ in world space.

**Step-by-step Solution:**
1. From the nullspace theorem, $\mathbf{P} \tilde{\mathbf{C}} = \mathbf{0}$, where $\tilde{\mathbf{C}} = [C_X, C_Y, C_Z, 1]^\top$.
2. Write the 3 linear scalar equations:
   - Row 3:
     $$0 C_X + 0 C_Y + 1 C_Z - 5(1) = 0 \implies C_Z = 5.0\text{ meters}$$
   - Row 1:
     $$700 C_X + 0 C_Y + 300 C_Z - 2100 = 0$$
     Substitute $C_Z = 5.0$:
     $$700 C_X + 300(5.0) - 2100 = 0 \implies 700 C_X + 1500 - 2100 = 0 \implies 700 C_X = 600 \implies C_X = \frac{600}{700} = \frac{6}{7} \approx 0.8571\text{ meters}$$
   - Row 2:
     $$0 C_X + 700 C_Y + 200 C_Z - 1400 = 0$$
     Substitute $C_Z = 5.0$:
     $$700 C_Y + 200(5.0) - 1400 = 0 \implies 700 C_Y + 1000 - 1400 = 0 \implies 700 C_Y = 400 \implies C_Y = \frac{400}{700} = \frac{4}{7} \approx 0.5714\text{ meters}$$
3. The optical center is $\mathbf{C} = \left[\frac{6}{7}, \frac{4}{7}, 5\right]^\top \approx [0.8571, 0.5714, 5.0]^\top$ meters.

---

### Problem 6.3: 3D Ray Intersection with a Flat Table
**Statement:** A robot arm camera is positioned at $\mathbf{C} = [0.0, 0.0, 1.2]^\top$ meters looking straight down at a horizontal tabletop located at plane $Z_W = 0$ (so plane normal is $\mathbf{n} = [0, 0, 1]^\top, d = 0$).
The camera orientation is aligned with world axes ($\mathbf{R} = \mathbf{I}_{3 \times 3}$). Intrinsics are $f_x = f_y = 600\text{ pixels}, c_x = 320, c_y = 240$.
The robot detects a tool at pixel $(u, v) = (440, 360)$.
Compute the exact 3D world coordinates $\mathbf{X}_W^*$ of the tool on the table.

**Step-by-step Solution:**
1. Compute the normalized ray in the camera frame:
   $$\mathbf{d}_C = \mathbf{K}^{-1} \begin{bmatrix} 440 \\ 360 \\ 1 \end{bmatrix} = \begin{bmatrix} \frac{440 - 320}{600} \\ \frac{360 - 240}{600} \\ 1 \end{bmatrix} = \begin{bmatrix} \frac{120}{600} \\ \frac{120}{600} \\ 1 \end{bmatrix} = \begin{bmatrix} 0.2 \\ 0.2 \\ 1.0 \end{bmatrix}$$
2. Because $\mathbf{R} = \mathbf{I}$, the world ray direction is identical: $\mathbf{d}_W = \mathbf{d}_C = [0.2, 0.2, 1.0]^\top$.
3. The parametric 3D world ray is:
   $$\mathbf{X}_W(\lambda) = \mathbf{C} + \lambda \mathbf{d}_W = \begin{bmatrix} 0.0 \\ 0.0 \\ 1.2 \end{bmatrix} + \lambda \begin{bmatrix} 0.2 \\ 0.2 \\ -1.0 \end{bmatrix}$$
   *(Note: Since camera $+Z_C$ points down toward the table, world $Z_W = 1.2 - \lambda$)*.
   Let's check coordinate axes carefully: Camera looks toward $Z_W = 0$ from $Z_W = 1.2$, so camera $+Z_C$ is along $-Z_W$.
   Then $\mathbf{R}$ must rotate world $+Z$ to $-Z$:
   $$\mathbf{R} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   Then $\mathbf{d}_W = \mathbf{R}^\top \mathbf{d}_C = [0.2, 0.2, -1.0]^\top$.
4. Setting the table equation $Z_W = 0$:
   $$1.2 + \lambda(-1.0) = 0 \implies \lambda = 1.2\text{ meters}$$
5. Substitute $\lambda = 1.2$ into $X_W$ and $Y_W$:
   $$X_W^* = 0.0 + 1.2(0.2) = 0.24\text{ meters}$$
   $$Y_W^* = 0.0 + 1.2(0.2) = 0.24\text{ meters}$$
   $$Z_W^* = 0.0\text{ meters}$$
   The tool is located at $\mathbf{X}_W^* = [0.24, 0.24, 0.0]^\top$ meters.

---

### Problem 6.4: Extrinsics from Camera Euler Angles
**Statement:** A surveillance camera is mounted at location $\mathbf{C} = [10, -5, 8]^\top$ meters. It is rotated with yaw $\psi = 30^\circ$, pitch $\theta = -20^\circ$, and roll $\phi = 0^\circ$ relative to the world coordinate frame using the $Z$-$Y$-$X$ Tait-Bryan rotation sequence:
$$\mathbf{R} = \mathbf{R}_X(\phi) \mathbf{R}_Y(\theta) \mathbf{R}_Z(\psi)$$
1. Compute the rotation matrix $\mathbf{R}$.
2. Compute the translation vector $\mathbf{t}$.

**Step-by-step Solution:**
1. **Rotation Matrices:**
   - $\phi = 0^\circ \implies \mathbf{R}_X(0) = \mathbf{I}$.
   - Pitch $\theta = -20^\circ$:
     $$\cos(-20^\circ) \approx 0.9397, \quad \sin(-20^\circ) \approx -0.3420$$
     $$\mathbf{R}_Y(-20^\circ) = \begin{bmatrix} 0.9397 & 0 & -0.3420 \\ 0 & 1 & 0 \\ 0.3420 & 0 & 0.9397 \end{bmatrix}$$
   - Yaw $\psi = 30^\circ$:
     $$\cos(30^\circ) \approx 0.8660, \quad \sin(30^\circ) = 0.5000$$
     $$\mathbf{R}_Z(30^\circ) = \begin{bmatrix} 0.8660 & -0.5000 & 0 \\ 0.5000 & 0.8660 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   Multiply $\mathbf{R} = \mathbf{R}_Y \mathbf{R}_Z$:
   $$\mathbf{R} = \begin{bmatrix} (0.9397)(0.8660) & (0.9397)(-0.5000) & -0.3420 \\ 0.5000 & 0.8660 & 0 \\ (0.3420)(0.8660) & (0.3420)(-0.5000) & 0.9397 \end{bmatrix} = \begin{bmatrix} 0.8138 & -0.4699 & -0.3420 \\ 0.5000 & 0.8660 & 0.0000 \\ 0.2962 & -0.1710 & 0.9397 \end{bmatrix}$$

2. **Translation Vector $\mathbf{t} = -\mathbf{R} \mathbf{C}$:**
   $$\begin{aligned}
   \mathbf{t} &= -\begin{bmatrix} 0.8138 & -0.4699 & -0.3420 \\ 0.5000 & 0.8660 & 0.0000 \\ 0.2962 & -0.1710 & 0.9397 \end{bmatrix} \begin{bmatrix} 10 \\ -5 \\ 8 \end{bmatrix} \\
   &= -\begin{bmatrix} 0.8138(10) - 0.4699(-5) - 0.3420(8) \\ 0.5000(10) + 0.8660(-5) + 0 \\ 0.2962(10) - 0.1710(-5) + 0.9397(8) \end{bmatrix} \\
   &= -\begin{bmatrix} 8.138 + 2.3495 - 2.736 \\ 5.000 - 4.330 \\ 2.962 + 0.855 + 7.5176 \end{bmatrix} = -\begin{bmatrix} 7.7515 \\ 0.6700 \\ 11.3346 \end{bmatrix} = \begin{bmatrix} -7.7515 \\ -0.6700 \\ -11.3346 \end{bmatrix}
   \end{aligned}$$

---

### Problem 6.5: Principal Ray Direction in World Space
**Statement:** Show that the third row $\mathbf{m}_3^\top$ of the $3 \times 3$ submatrix $\mathbf{M}$ in $\mathbf{P} = [\mathbf{M} \mid \mathbf{p}_4]$ points along the camera's optical axis in world space.

**Step-by-step Solution:**
1. Decompose $\mathbf{P} = \mathbf{K} [\mathbf{R} \mid \mathbf{t}]$, so $\mathbf{M} = \mathbf{K} \mathbf{R}$.
2. Write $\mathbf{K}$ in standard upper-triangular form with $s = 0$:
   $$\mathbf{K} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$$
3. Let the rows of the rotation matrix $\mathbf{R}$ be $\mathbf{r}_1^\top, \mathbf{r}_2^\top, \mathbf{r}_3^\top$.
   Compute the rows of $\mathbf{M}$:
   $$\mathbf{M} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \mathbf{r}_1^\top \\ \mathbf{r}_2^\top \\ \mathbf{r}_3^\top \end{bmatrix} = \begin{bmatrix} f_x \mathbf{r}_1^\top + c_x \mathbf{r}_3^\top \\ f_y \mathbf{r}_2^\top + c_y \mathbf{r}_3^\top \\ \mathbf{r}_3^\top \end{bmatrix}$$
4. Notice that the third row is strictly:
   $$\mathbf{m}_3^\top = \mathbf{r}_3^\top$$
5. In camera coordinates, the optical axis is the unit vector $\mathbf{z}_C = [0, 0, 1]^\top$.
   Transforming this vector into world coordinates:
   $$\mathbf{z}_W = \mathbf{R}^\top \mathbf{z}_C = \begin{bmatrix} \mathbf{r}_1 & \mathbf{r}_2 & \mathbf{r}_3 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \mathbf{r}_3$$
   Therefore, $\mathbf{m}_3 = \mathbf{r}_3 = \mathbf{z}_W$. The third row of $\mathbf{M}$ is the unit normal vector of the principal plane pointing directly along the camera's optical axis in world space!

---

### Problem 6.6: Field of View Boundary Planes Extraction
**Statement:** A camera has image dimensions $W = 1280$ and $H = 720$. The projection matrix rows are $\mathbf{p}_1^\top, \mathbf{p}_2^\top, \mathbf{p}_3^\top$.
Write the algebraic inequality that a 3D world point $\tilde{\mathbf{X}}_W$ must satisfy to lie to the left of the right image boundary ($u \le 1280$).

**Step-by-step Solution:**
1. The horizontal pixel projection coordinate is:
   $$u = \frac{\mathbf{p}_1^\top \tilde{\mathbf{X}}_W}{\mathbf{p}_3^\top \tilde{\mathbf{X}}_W}$$
2. For points in front of the camera, depth $Z_C = \mathbf{p}_3^\top \tilde{\mathbf{X}}_W > 0$.
3. Setting $u \le 1280$:
   $$\frac{\mathbf{p}_1^\top \tilde{\mathbf{X}}_W}{\mathbf{p}_3^\top \tilde{\mathbf{X}}_W} \le 1280 \iff \mathbf{p}_1^\top \tilde{\mathbf{X}}_W \le 1280 (\mathbf{p}_3^\top \tilde{\mathbf{X}}_W)$$
4. Rearranging into standard half-space form $\boldsymbol{\pi}^\top \tilde{\mathbf{X}}_W \ge 0$:
   $$1280 (\mathbf{p}_3^\top \tilde{\mathbf{X}}_W) - \mathbf{p}_1^\top \tilde{\mathbf{X}}_W \ge 0 \iff (1280 \mathbf{p}_3 - \mathbf{p}_1)^\top \tilde{\mathbf{X}}_W \ge 0$$
   The plane normal in homogeneous 4D space is $\boldsymbol{\pi}_{\text{right}} = 1280 \mathbf{p}_3 - \mathbf{p}_1$.

---

### Problem 6.7: Coordinate Transformation Composition
**Statement:** A mobile robot has base coordinate frame $\mathcal{F}_B$. A gripper camera is mounted on the arm at transformation $\mathbf{T}_{CB} = [\mathbf{R}_{CB} \mid \mathbf{t}_{CB}]$. The robot base is localized in world coordinates at $\mathbf{T}_{BW} = [\mathbf{R}_{BW} \mid \mathbf{t}_{BW}]$.
Derive the composite world-to-camera extrinsic matrix $[\mathbf{R}_{CW} \mid \mathbf{t}_{CW}]$.

**Step-by-step Solution:**
1. Point transformation chain:
   $$\mathbf{X}_B = \mathbf{R}_{BW} \mathbf{X}_W + \mathbf{t}_{BW}$$
   $$\mathbf{X}_C = \mathbf{R}_{CB} \mathbf{X}_B + \mathbf{t}_{CB}$$
2. Substitute $\mathbf{X}_B$ into the camera equation:
   $$\mathbf{X}_C = \mathbf{R}_{CB} (\mathbf{R}_{BW} \mathbf{X}_W + \mathbf{t}_{BW}) + \mathbf{t}_{CB} = (\mathbf{R}_{CB} \mathbf{R}_{BW}) \mathbf{X}_W + (\mathbf{R}_{CB} \mathbf{t}_{BW} + \mathbf{t}_{CB})$$
3. In homogeneous matrix representation:
   $$\mathbf{T}_{CW} = \mathbf{T}_{CB} \mathbf{T}_{BW} = \begin{bmatrix} \mathbf{R}_{CB} & \mathbf{t}_{CB} \\ \mathbf{0}^\top & 1 \end{bmatrix} \begin{bmatrix} \mathbf{R}_{BW} & \mathbf{t}_{BW} \\ \mathbf{0}^\top & 1 \end{bmatrix} = \begin{bmatrix} \mathbf{R}_{CB} \mathbf{R}_{BW} & \mathbf{R}_{CB} \mathbf{t}_{BW} + \mathbf{t}_{CB} \\ \mathbf{0}^\top & 1 \end{bmatrix}$$
4. Extracting composite extrinsics:
   $$\mathbf{R}_{CW} = \mathbf{R}_{CB} \mathbf{R}_{BW}$$
   $$\mathbf{t}_{CW} = \mathbf{R}_{CB} \mathbf{t}_{BW} + \mathbf{t}_{CB}$$

---

### Problem 6.8: Numerical RQ Decomposition of a $3 \times 3$ Matrix
**Statement:** Given the upper $3 \times 3$ matrix:
$$\mathbf{M} = \begin{bmatrix} 0 & -800 & 500 \\ 0 & 0 & -800 \\ 0 & 0 & -1 \end{bmatrix}$$
Extract the intrinsic parameters $f_x, f_y, c_x, c_y$ and the rotation matrix $\mathbf{R}$.

**Step-by-step Solution:**
1. We know $\mathbf{M} = \mathbf{K} \mathbf{R}$:
   $$\begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \mathbf{r}_1^\top \\ \mathbf{r}_2^\top \\ \mathbf{r}_3^\top \end{bmatrix} = \begin{bmatrix} f_x \mathbf{r}_1^\top + c_x \mathbf{r}_3^\top \\ f_y \mathbf{r}_2^\top + c_y \mathbf{r}_3^\top \\ \mathbf{r}_3^\top \end{bmatrix}$$
2. Match Row 3:
   $$\mathbf{r}_3^\top = [0, 0, -1] \implies \mathbf{r}_3 = [0, 0, -1]^\top \quad (\|\mathbf{r}_3\| = 1)$$
3. Match Row 2:
   $$f_y \mathbf{r}_2^\top + c_y [0, 0, -1] = [0, 0, -800]$$
   Since $\mathbf{r}_2 \perp \mathbf{r}_3$, $\mathbf{r}_2$ has zero in its 3rd component: $\mathbf{r}_2^\top = [r_{21}, r_{22}, 0]$.
   Equating 3rd component: $-c_y = -800 \implies c_y = 800$ (or if $c_y$ is standard, let's normalize $\mathbf{r}_2$).
   Wait! Row 2 is $[0, -800, 0]$? The problem has $[0, 0, -800]$.
   If Row 2 is $f_y \mathbf{r}_2^\top + c_y \mathbf{r}_3^\top$:
   To keep $\mathbf{r}_1, \mathbf{r}_2, \mathbf{r}_3$ orthonormal, let $\mathbf{r}_2^\top = [0, -1, 0]$.
   Then $f_y \mathbf{r}_2^\top = [0, -f_y, 0]$.
   If $\mathbf{M}_{2, 2} = -800$, then $f_y = 800$.
   Let's check Row 1: $\mathbf{r}_1^\top = [1, 0, 0]$.
   Then $f_x = 800, c_x = 500, c_y = 800$.
   The rotation matrix is:
   $$\mathbf{R} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \dots$$

---

### Problem 6.9: Projective Horizon Line of the World Ground Plane
**Statement:** Derive the 2D equation of the horizon line on the image plane corresponding to the world ground plane $Z_W = 0$.

**Step-by-step Solution:**
1. The world ground plane consists of points $\tilde{\mathbf{X}}_W = [X_W, Y_W, 0, 1]^\top$.
2. The columns of $\mathbf{P} = [\mathbf{p}_1, \mathbf{p}_2, \mathbf{p}_3, \mathbf{p}_4]$ project this point as:
   $$\lambda \tilde{\mathbf{x}} = X_W \mathbf{p}_1 + Y_W \mathbf{p}_2 + 0 \mathbf{p}_3 + 1 \mathbf{p}_4 = X_W \mathbf{p}_1 + Y_W \mathbf{p}_2 + \mathbf{p}_4$$
3. Points at infinity on the ground plane have $X_W, Y_W \to \infty$.
   The locus of points at infinity is the linear combination of the first two column vectors:
   $$\lambda \tilde{\mathbf{x}}_\infty = \alpha \mathbf{p}_1 + \beta \mathbf{p}_2$$
4. In projective geometry, the line passing through two points $\mathbf{p}_1$ and $\mathbf{p}_2$ in the 2D image plane is given by the cross product:
   $$\mathbf{l}_{\text{horizon}} = \mathbf{p}_1 \times \mathbf{p}_2$$
5. Any pixel $\mathbf{x} = [u, v, 1]^\top$ on the horizon satisfies:
   $$\mathbf{l}_{\text{horizon}}^\top \tilde{\mathbf{x}} = (\mathbf{p}_1 \times \mathbf{p}_2)^\top \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = 0$$

---

### Problem 6.10: Back-Projecting a 2D Bounding Box to a 3D World Frustum
**Statement:** An object detector predicts a 2D bounding box with corners $(u_{\text{min}}, v_{\text{min}}) = (200, 150)$ and $(u_{\text{max}}, v_{\text{max}}) = (400, 350)$.
Explain how to construct the 3D world bounding frustum ray volume emanating from the camera center $\mathbf{C}$.

**Step-by-step Solution:**
1. Back-project the four 2D bounding box corners into world ray directions using $\mathbf{d}_{W, i} = \mathbf{R}^\top \mathbf{K}^{-1} [u_i, v_i, 1]^\top$:
   - Top-Left: $\mathbf{d}_1 = \mathbf{R}^\top \mathbf{K}^{-1} [200, 150, 1]^\top$
   - Top-Right: $\mathbf{d}_2 = \mathbf{R}^\top \mathbf{K}^{-1} [400, 150, 1]^\top$
   - Bottom-Right: $\mathbf{d}_3 = \mathbf{R}^\top \mathbf{K}^{-1} [400, 350, 1]^\top$
   - Bottom-Left: $\mathbf{d}_4 = \mathbf{R}^\top \mathbf{K}^{-1} [200, 350, 1]^\top$
2. All rays originate from the common camera center $\mathbf{C} = -\mathbf{R}^\top \mathbf{t}$.
3. The four rays $\mathbf{C} + \lambda \mathbf{d}_i$ form the four edges of an infinite 3D pyramid in world space.
4. If a minimum distance $Z_{\text{min}}$ and maximum distance $Z_{\text{max}}$ are known (e.g., from depth sensor or object size priors), evaluate $\mathbf{X}_i(Z_{\text{min}})$ and $\mathbf{X}_i(Z_{\text{max}})$ to produce an 8-vertex 3D oriented bounding frustum in world coordinates.

---

## 6.7 Solved Exercises

### Exercise 6.1: Orthogonality Constraints of SO(3)
**Statement:** Prove that the columns of any valid rotation matrix $\mathbf{R} \in \text{SO}(3)$ form an orthonormal basis of $\mathbb{R}^3$, and prove that $\|\mathbf{R} \mathbf{v}\| = \|\mathbf{v}\|$ for any 3D vector $\mathbf{v}$.

**Solution:**
1. Let $\mathbf{R} = [\mathbf{c}_1 \mid \mathbf{c}_2 \mid \mathbf{c}_3]$, where $\mathbf{c}_i \in \mathbb{R}^3$.
   By definition of the orthogonal group:
   $$\mathbf{R}^\top \mathbf{R} = \mathbf{I}_{3 \times 3}$$
   Writing the matrix product in terms of columns:
   $$\begin{bmatrix} \mathbf{c}_1^\top \\ \mathbf{c}_2^\top \\ \mathbf{c}_3^\top \end{bmatrix} \begin{bmatrix} \mathbf{c}_1 & \mathbf{c}_2 & \mathbf{c}_3 \end{bmatrix} = \begin{bmatrix} \mathbf{c}_1^\top \mathbf{c}_1 & \mathbf{c}_1^\top \mathbf{c}_2 & \mathbf{c}_1^\top \mathbf{c}_3 \\ \mathbf{c}_2^\top \mathbf{c}_1 & \mathbf{c}_2^\top \mathbf{c}_2 & \mathbf{c}_2^\top \mathbf{c}_3 \\ \mathbf{c}_3^\top \mathbf{c}_1 & \mathbf{c}_3^\top \mathbf{c}_2 & \mathbf{c}_3^\top \mathbf{c}_3 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   Therefore:
   $$\mathbf{c}_i^\top \mathbf{c}_j = \delta_{ij} = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \neq j \end{cases}$$
   Every column has unit norm ($\|\mathbf{c}_i\| = 1$) and is mutually orthogonal to the other columns ($\mathbf{c}_i \perp \mathbf{c}_j$), forming an orthonormal basis.
2. Norm preservation:
   $$\|\mathbf{R} \mathbf{v}\|^2 = (\mathbf{R} \mathbf{v})^\top (\mathbf{R} \mathbf{v}) = \mathbf{v}^\top (\mathbf{R}^\top \mathbf{R}) \mathbf{v} = \mathbf{v}^\top \mathbf{I} \mathbf{v} = \mathbf{v}^\top \mathbf{v} = \|\mathbf{v}\|^2$$
   Taking the square root: $\|\mathbf{R} \mathbf{v}\| = \|\mathbf{v}\|$. Rotations preserve Euclidean lengths perfectly. $\blacksquare$

---

### Exercise 6.2: Rodriguez Rotation Formula
**Statement:** Any 3D rotation $\mathbf{R} \in \text{SO}(3)$ can be parameterized by an axis of rotation $\mathbf{k} = [k_x, k_y, k_z]^\top$ ($\|\mathbf{k}\| = 1$) and an angle $\theta$. State Rodrigues' rotation formula in matrix form.

**Solution:**
Define the skew-symmetric cross-product matrix $[\mathbf{k}]_\times$:
$$[\mathbf{k}]_\times \triangleq \begin{bmatrix} 0 & -k_z & k_y \\ k_z & 0 & -k_x \\ -k_y & k_x & 0 \end{bmatrix}$$
such that $[\mathbf{k}]_\times \mathbf{v} = \mathbf{k} \times \mathbf{v}$ for all $\mathbf{v} \in \mathbb{R}^3$.
Rodrigues' rotation formula expresses $\mathbf{R}$ via the matrix exponential $\mathbf{R} = \exp(\theta [\mathbf{k}]_\times)$:
$$\mathbf{R}(\mathbf{k}, \theta) = \mathbf{I}_{3 \times 3} + (\sin\theta) [\mathbf{k}]_\times + (1 - \cos\theta) [\mathbf{k}]_\times^2 \quad \blacksquare$$

---

### Exercise 6.3: Recovering Rotation and Translation from Extrinsic SE(3) Matrix
**Statement:** Given the $4 \times 4$ rigid transform $\mathbf{T} = \begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix}$, show how to compute the inverse transform $\mathbf{T}^{-1}$ without running a general matrix inversion algorithm.

**Solution:**
1. We seek a matrix $\mathbf{T}^{-1} = \begin{bmatrix} \mathbf{A} & \mathbf{b} \\ \mathbf{0}^\top & 1 \end{bmatrix}$ such that $\mathbf{T} \mathbf{T}^{-1} = \mathbf{I}_{4 \times 4}$.
2. Multiplying block-wise:
   $$\begin{bmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} \begin{bmatrix} \mathbf{A} & \mathbf{b} \\ \mathbf{0}^\top & 1 \end{bmatrix} = \begin{bmatrix} \mathbf{R}\mathbf{A} & \mathbf{R}\mathbf{b} + \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} = \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ \mathbf{0}^\top & 1 \end{bmatrix}$$
3. Equating blocks:
   $$\mathbf{R} \mathbf{A} = \mathbf{I} \implies \mathbf{A} = \mathbf{R}^{-1} = \mathbf{R}^\top$$
   $$\mathbf{R} \mathbf{b} + \mathbf{t} = \mathbf{0} \implies \mathbf{R} \mathbf{b} = -\mathbf{t} \implies \mathbf{b} = -\mathbf{R}^\top \mathbf{t}$$
4. Therefore:
   $$\mathbf{T}^{-1} = \begin{bmatrix} \mathbf{R}^\top & -\mathbf{R}^\top \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix} \quad \blacksquare$$

---

### Exercise 6.4: The Center of Projection as a Null Vector
**Statement:** Prove that if $\mathbf{P} \tilde{\mathbf{C}} = \mathbf{0}$, then the optical center $\mathbf{C}$ is invariant to any non-singular $3 \times 3$ projective transformation $\mathbf{H}$ applied to the image plane ($\mathbf{P}' = \mathbf{H} \mathbf{P}$).

**Solution:**
1. Given $\mathbf{P} \tilde{\mathbf{C}} = \mathbf{0}$.
2. Let $\mathbf{P}' = \mathbf{H} \mathbf{P}$, where $\mathbf{H} \in \mathbb{R}^{3 \times 3}$ is an invertible homography matrix ($\det(\mathbf{H}) \neq 0$).
3. Multiply $\mathbf{P}'$ by $\tilde{\mathbf{C}}$:
   $$\mathbf{P}' \tilde{\mathbf{C}} = (\mathbf{H} \mathbf{P}) \tilde{\mathbf{C}} = \mathbf{H} (\mathbf{P} \tilde{\mathbf{C}}) = \mathbf{H} \mathbf{0} = \mathbf{0}$$
4. Because $\mathbf{H}$ is non-singular, $\mathbf{H} \mathbf{v} = \mathbf{0} \iff \mathbf{v} = \mathbf{0}$.
   Thus, the nullspace of $\mathbf{P}'$ is identical to the nullspace of $\mathbf{P}$.
   The optical center $\mathbf{C}$ is unchanged by 2D image transformations. $\blacksquare$

---

### Exercise 6.5: Projection of World Coordinate Axes
**Statement:** Show what the column vectors of $\mathbf{P} = [\mathbf{p}_1 \mid \mathbf{p}_2 \mid \mathbf{p}_3 \mid \mathbf{p}_4]$ represent physically in the 2D image plane.

**Solution:**
1. Consider the world origin $\mathbf{X}_{\text{origin}} = [0, 0, 0, 1]^\top$:
   $$\mathbf{P} \mathbf{X}_{\text{origin}} = \mathbf{p}_4$$
   Thus, the **fourth column $\mathbf{p}_4$** is the 2D projected image of the world origin!
2. Consider the point at infinity along the world $X$-axis: $\mathbf{X}_{\infty, X} = [1, 0, 0, 0]^\top$:
   $$\mathbf{P} \mathbf{X}_{\infty, X} = \mathbf{p}_1$$
   Thus, the **first column $\mathbf{p}_1$** is the vanishing point of all lines parallel to the world $X$-axis!
3. Similarly:
   - **$\mathbf{p}_2$:** Vanishing point of the world $Y$-axis.
   - **$\mathbf{p}_3$:** Vanishing point of the world $Z$-axis. $\blacksquare$

---

### Exercise 6.6: Scale Ambiguity of the Projection Matrix
**Statement:** Explain why $\mathbf{P}$ and $\alpha \mathbf{P}$ (for any scalar $\alpha \neq 0$) represent identical cameras.

**Solution:**
1. Let $\mathbf{P}' = \alpha \mathbf{P}$ with $\alpha \neq 0$.
2. For any 3D point $\tilde{\mathbf{X}}$, the projection under $\mathbf{P}'$ is:
   $$\begin{bmatrix} \tilde{u}' \\ \tilde{v}' \\ \tilde{w}' \end{bmatrix} = \mathbf{P}' \tilde{\mathbf{X}} = \alpha \mathbf{P} \tilde{\mathbf{X}} = \begin{bmatrix} \alpha \tilde{u} \\ \alpha \tilde{v} \\ \alpha \tilde{w} \end{bmatrix}$$
3. Computing Cartesian pixel coordinates:
   $$u' = \frac{\tilde{u}'}{\tilde{w}'} = \frac{\alpha \tilde{u}}{\alpha \tilde{w}} = \frac{\tilde{u}}{\tilde{w}} = u$$
   $$v' = \frac{\tilde{v}'}{\tilde{w}'} = \frac{\alpha \tilde{v}}{\alpha \tilde{w}} = \frac{\tilde{v}}{\tilde{w}} = v$$
   The scalar $\alpha$ cancels out completely. Thus, $\mathbf{P}$ is defined projectively up to scale. $\blacksquare$

---

### Exercise 6.7: Normalization of Projection Matrix to Canonical Form
**Statement:** Given an unnormalized projection matrix $\mathbf{P} = [\mathbf{M} \mid \mathbf{p}_4]$, state how to compute the scalar $\alpha$ such that $\mathbf{P}_{\text{norm}} = \alpha \mathbf{P}$ satisfies the metric constraint that the third row of the rotation matrix has unit norm ($\|\mathbf{r}_3\| = 1$).

**Solution:**
1. From Section 6.3, the third row of $\mathbf{M}$ is $\mathbf{m}_3^\top = \alpha \mathbf{r}_3^\top$.
2. Since $\mathbf{R} \in \text{SO}(3)$, the third row of a valid rotation matrix must have unit Euclidean norm:
   $$\|\mathbf{r}_3\| = 1 \implies \|\mathbf{m}_3\| = |\alpha| \|\mathbf{r}_3\| = |\alpha|$$
3. Therefore:
   $$|\alpha| = \frac{1}{\|\mathbf{m}_3\|}$$
4. To ensure that points in front of the camera have positive depth ($Z_C > 0$), choose the sign of $\alpha$ such that $\det(\mathbf{M}) > 0$:
   $$\alpha = \frac{\text{sign}(\det(\mathbf{M}))}{\|\mathbf{m}_3\|} \quad \blacksquare$$

---

### Exercise 6.8: Epipolar Plane Geometric Definition
**Statement:** In a moving camera setup, define the **epipolar plane** formed by two camera centers $\mathbf{C}_1, \mathbf{C}_2$ and an observed 3D world landmark $\mathbf{X}$.

**Solution:**
1. Let $\mathbf{C}_1$ and $\mathbf{C}_2$ be the 3D optical centers of the camera at two distinct temporal instances or two physical stereo viewpoints.
2. The 3D line connecting $\mathbf{C}_1$ and $\mathbf{C}_2$ is the **baseline**.
3. For any observed 3D point $\mathbf{X} \notin \text{baseline}$, the three points $\mathbf{C}_1, \mathbf{C}_2, \mathbf{X}$ uniquely define a 2D plane in 3D Euclidean space: the **epipolar plane** $\Pi_{\text{epi}}$.
4. The intersection of $\Pi_{\text{epi}}$ with camera 1's image plane forms the epipolar line $\mathbf{l}_1$.
5. The intersection of $\Pi_{\text{epi}}$ with camera 2's image plane forms the conjugate epipolar line $\mathbf{l}_2$. $\blacksquare$

---

### Exercise 6.9: Depth Sign Condition (Cheirality Constraint)
**Statement:** State the **cheirality constraint** in camera projection and write the mathematical condition to verify whether a 3D point lies in front of or behind the camera aperture.

**Solution:**
1. The cheirality constraint requires that for a physical object to be visible, it must lie strictly in front of the camera's optical center ($Z_C > 0$).
2. In terms of the projection matrix $\mathbf{P} = \begin{bmatrix} \mathbf{p}_1^\top \\ \mathbf{p}_2^\top \\ \mathbf{p}_3^\top \end{bmatrix}$, depth is given by:
   $$Z_C = \frac{\mathbf{p}_3^\top \tilde{\mathbf{X}}}{\|\mathbf{p}_{3, 1:3}\|}$$
3. The cheirality condition is:
   $$\mathbf{p}_3^\top \tilde{\mathbf{X}}_W > 0$$
   If $\mathbf{p}_3^\top \tilde{\mathbf{X}}_W < 0$, the point lies behind the camera (a virtual image formed by backward rays).

---

### Exercise 6.10: Affine (Weak Perspective) Camera Approximation
**Statement:** Under what physical conditions can the non-linear perspective camera matrix $\mathbf{P} \in \mathbb{R}^{3 \times 4}$ be approximated by a linear **affine camera matrix** $\mathbf{P}_{\text{affine}} = \begin{bmatrix} \mathbf{a}_1^\top \\ \mathbf{a}_2^\top \\ 0 & 0 & 0 & 1 \end{bmatrix}$?

**Solution:**
1. An affine camera (orthographic, weak perspective, or paraperspective projection) eliminates the division by variable depth $Z$.
2. The affine approximation is physically valid when:
   - **Shallow Object Depth Relative to Distance:** The depth relief $\Delta Z$ of the object is negligible compared to the average distance $Z_0$ from the camera:
     $$\frac{\Delta Z}{Z_0} \ll 1 \quad (\text{e.g., } < 0.05 \text{ or } 5\%)$$
   - **Narrow Field of View (Telephoto Lens):** The angular span of the object is small, meaning perspective foreshortening across the field of view is negligible.
3. Under these conditions, $\frac{1}{Z} = \frac{1}{Z_0 + \Delta Z} \approx \frac{1}{Z_0} \left(1 - \frac{\Delta Z}{Z_0}\right) \approx \frac{1}{Z_0} = \text{constant}$.
   Perspective division reduces to constant scaling by $1/Z_0$, rendering the mapping completely affine. $\blacksquare$
