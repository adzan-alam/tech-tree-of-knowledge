# Chapter 12: Production TypeScript Computer Vision Engine and Capstone Synthesis

---

## 12.1 Pathway #4 Architectural Synthesis: The Perception-Action Loop

Across the previous eleven chapters, we systematically constructed the complete epistemic pyramid of computer vision: starting from the physical quantum journey of photons striking a CMOS sensor silicon depletion zone, progressing through linear spatial filtering, differential gradients, Canny edge detection, perspective pinhole geometry, planar homographies, stereo triangulation, and deep convolutional perception.

Now, we bridge visual perception to physical embodiment. In **Pathway #4: Embodied AI and Autonomous Physical Robotics**, computer vision does not operate in a vacuum; it serves as the primary sensory organ driving the **Perception-Control Feedback Loop**.

```
                   THE PATHWAY #4 EMBODIED PERCEPTION-ACTION CYCLE
                   
                        [ CONTINUOUS 3D PHYSICAL SCENE ]
                                       │
                                       ▼ Photons hν
                        [ CMOS CAMERA & STEREO RIG ]
                        (Chapter 1: Sensor Physics & Discretization)
                                       │
                                       ▼ Raw Pixel Array I[y, x]
                      [ SPATIAL FILTERING & CANNY EDGES ]
                      (Chapters 2-4: Convolutions & Morphology)
                                       │
                                       ▼ Edge Contours & Saliency
                      [ GEOMETRIC & STEREO RECONSTRUCTION ]
                      (Chapters 5-8: Intrinsics, Extrinsics & Depth)
                                       │
                                       ▼ Metric 3D Point Cloud & Features
                      [ DEEP CONVOLUTIONAL PERCEPTION ]
                      (Chapters 9-11: CNN Features & 3D Bounding Frustums)
                                       │
                                       ▼ Measured State z_t = [X, Y, Z, vx, vy, vz]^T
                      [ EXTENDED KALMAN STATE ESTIMATION ]
                      (Module 4: math-kalman-filtering)
                                       │
                                       ▼ Fused State Estimate x̂_t
                      [ INVERSE KINEMATICS & CONTROL ]
                      (Module 3: phys-robotics-inverse-kinematics)
                                       │
                                       ▼ Joint Torques τ = J^T F
                        [ RIGID-BODY ROBOT ACTUATORS ]
                        (Module 1: phys-rigid-body-3d)
                                       │
                                       ▼ Physical Motion / Grasp
                        [ MODIFIED PHYSICAL UNIVERSE ]
```

---

## 12.2 Production Engine Architecture: `computer-vision-engine.ts`

To guarantee mathematical verifiability and production utility, all theoretical principles formulated in this treatise are materialized in a zero-dependency, high-performance TypeScript engine: `computer-vision-engine.ts`.

### Sub-Engine Specifications
1. **`ImageMatrix`:** 2D continuous floating-point and 8-bit image buffer supporting clamped boundary indexing, bilinear interpolation, normalization, and grayscale/color conversions.
2. **`ConvolutionOps`:** Direct and separable 2D spatial convolution, Gaussian blurring, Sobel gradient estimation ($I_x, I_y$), gradient magnitude and orientation, and discrete Laplacian operators.
3. **`CannyEdgeDetector`:** Production 4-stage pipeline including Gaussian noise suppression, Sobel gradient fields, 4-sector Non-Maximum Suppression (NMS), and dual-threshold hysteresis edge tracking via iterative depth-first traversal.
4. **`PinholeCamera`:** Intrinsic matrix $\mathbf{K} \in \mathbb{R}^{3 \times 3}$, extrinsic rigid pose $[\mathbf{R} \mid \mathbf{t}]$, Brown-Conrady radial lens distortion ($k_1, k_2$), forward 3D-to-2D projection, and 2D-to-3D ray back-projection.
5. **`StereoTriangulator`:** Canonical rectified binocular vision engine, computing horizontal disparity $d = u_L - u_R$ and unprojecting pixels to metric 3D point clouds $(X, Y, Z)$ using the reprojection matrix $\mathbf{Q}$.
6. **`HomographyEngine`:** Planar homography transformation $\mathbf{H} \in \mathbb{R}^{3 \times 3}$, Direct Linear Transformation (DLT) solver with Hartley coordinate normalization, and inverse perspective warping.
7. **`Conv2DLayer`:** Production neural network convolutional layer implementing the forward tensor pass and exact analytical backward pass computing weight gradients $\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$, bias gradients $\frac{\partial \mathcal{L}}{\partial \mathbf{b}}$, and input gradients $\frac{\partial \mathcal{L}}{\partial \mathbf{X}}$.

---

## 12.3 Grand Gauntlet Problems

### Problem 12.1: End-to-End Visual Grasping Pipeline
**Statement:** A robot arm camera has intrinsic matrix $\mathbf{K} = \begin{bmatrix} 800 & 0 & 400 \\ 0 & 800 & 300 \\ 0 & 0 & 1 \end{bmatrix}$. The camera is mounted on a robotic gantry at world position $\mathbf{C} = [0.0, 0.5, 2.0]^\top$ meters looking straight down at the factory floor ($Z_W = 0$) with rotation $\mathbf{R} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$.
An object detector detects a bolt at pixel $(u, v) = (480, 380)$.
1. Construct the complete $3 \times 4$ projection matrix $\mathbf{P}$.
2. Compute the 3D world coordinates $\mathbf{X}_W = [X_W, Y_W, 0]^\top$ of the bolt on the floor.

**Step-by-step Solution:**
1. **Extrinsic Translation $\mathbf{t}$:**
   $$\mathbf{t} = -\mathbf{R} \mathbf{C} = -\begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \begin{bmatrix} 0.0 \\ 0.5 \\ 2.0 \end{bmatrix} = -\begin{bmatrix} 0.0 \\ -0.5 \\ -2.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.5 \\ 2.0 \end{bmatrix}$$
   Compute $\mathbf{P} = \mathbf{K} [\mathbf{R} \mid \mathbf{t}]$:
   $$\mathbf{K} \mathbf{R} = \begin{bmatrix} 800 & 0 & 400 \\ 0 & 800 & 300 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} = \begin{bmatrix} 800 & 0 & -400 \\ 0 & -800 & -300 \\ 0 & 0 & -1 \end{bmatrix}$$
   $$\mathbf{K} \mathbf{t} = \begin{bmatrix} 800 & 0 & 400 \\ 0 & 800 & 300 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.0 \\ 0.5 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 800 \\ 1000 \\ 2.0 \end{bmatrix}$$
   $$\mathbf{P} = \begin{bmatrix} 800 & 0 & -400 & 800 \\ 0 & -800 & -300 & 1000 \\ 0 & 0 & -1 & 2.0 \end{bmatrix}$$

2. **3D Ray Back-Projection to Floor $Z_W = 0$:**
   Normalized ray direction in camera frame:
   $$\mathbf{d}_C = \mathbf{K}^{-1} \begin{bmatrix} 480 \\ 380 \\ 1 \end{bmatrix} = \begin{bmatrix} \frac{480 - 400}{800} \\ \frac{380 - 300}{800} \\ 1 \end{bmatrix} = \begin{bmatrix} \frac{80}{800} \\ \frac{80}{800} \\ 1 \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.1 \\ 1.0 \end{bmatrix}$$
   Transform ray direction to world frame using $\mathbf{R}^\top$:
   $$\mathbf{d}_W = \mathbf{R}^\top \mathbf{d}_C = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \begin{bmatrix} 0.1 \\ 0.1 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 0.1 \\ -0.1 \\ -1.0 \end{bmatrix}$$
   The parametric 3D ray in world coordinates is:
   $$\mathbf{X}_W(\lambda) = \mathbf{C} + \lambda \mathbf{d}_W = \begin{bmatrix} 0.0 \\ 0.5 \\ 2.0 \end{bmatrix} + \lambda \begin{bmatrix} 0.1 \\ -0.1 \\ -1.0 \end{bmatrix}$$
   Setting the floor condition $Z_W = 0$:
   $$2.0 - \lambda(1.0) = 0 \implies \lambda = 2.0\text{ meters}$$
   Evaluate $X_W$ and $Y_W$:
   $$X_W = 0.0 + 2.0(0.1) = +0.20\text{ meters}$$
   $$Y_W = 0.5 + 2.0(-0.1) = 0.5 - 0.2 = +0.30\text{ meters}$$
   The bolt is located at $\mathbf{X}_W = [0.20, 0.30, 0.0]^\top$ meters.

---

### Problem 12.2: Stereo Triangulation with Decentering Lens Distortion
**Statement:** A stereo rig has baseline $b = 0.25\text{ m}$ and shared intrinsics $f_x = f_y = 1000, c_x = 500, c_y = 500$.
A target feature is detected in the raw images at $(u_{d, L}, v_{d, L}) = (600, 500)$ and $(u_{d, R}, v_{d, R}) = (550, 500)$.
The lenses exhibit radial distortion $k_1 = -0.10$ ($k_2 = 0$).
1. Compute the undistorted pixel coordinates $(u_L, v_L)$ and $(u_R, v_R)$ using 1st-order Taylor inversion.
2. Compute the true metric depth $Z$ using the undistorted disparity.

**Step-by-step Solution:**
1. **Undistorting Left Pixel:**
   Normalized distorted coordinate:
   $$x_{d, L} = \frac{600 - 500}{1000} = 0.10, \quad y_{d, L} = \frac{500 - 500}{1000} = 0.0$$
   $r_d^2 = 0.10^2 = 0.01$.
   The forward distortion model is $x_d = x_n (1 + k_1 r_n^2) \approx x_n (1 - 0.10 r_d^2)$.
   Inverting via Taylor approximation:
   $$x_{n, L} \approx \frac{x_{d, L}}{1 + k_1 r_d^2} = \frac{0.10}{1 - 0.10(0.01)} = \frac{0.10}{0.999} \approx 0.10010$$
   Undistorted left pixel: $u_L = 1000(0.10010) + 500 = 600.10$.

2. **Undistorting Right Pixel:**
   $$x_{d, R} = \frac{550 - 500}{1000} = 0.05, \quad y_{d, R} = 0.0$$
   $r_d^2 = 0.05^2 = 0.0025$.
   $$x_{n, R} \approx \frac{0.05}{1 - 0.10(0.0025)} = \frac{0.05}{0.99975} \approx 0.0500125$$
   Undistorted right pixel: $u_R = 1000(0.0500125) + 500 = 550.01$.

3. **Disparity and Depth:**
   - Raw distorted disparity: $d_{\text{raw}} = 600 - 550 = 50.0\text{ pixels} \implies Z_{\text{raw}} = \frac{1000 \times 0.25}{50.0} = 5.000\text{ meters}$.
   - True undistorted disparity:
     $$d_{\text{true}} = u_L - u_R = 600.10 - 550.01 = 50.09\text{ pixels}$$
   - True metric depth:
     $$Z_{\text{true}} = \frac{f \cdot b}{d_{\text{true}}} = \frac{1000 \times 0.25}{50.09} = \frac{250}{50.09} \approx 4.991\text{ meters}$$
   Accounting for lens distortion corrects a $9\text{ mm}$ metric systematic error.

---

### Problem 12.3: Closed-Form DLT Homography Matrix Extraction
**Statement:** Four points on a square calibration card $[X, Y]$ in centimeters:
$P_1 = [0, 0]^\top, P_2 = [10, 0]^\top, P_3 = [10, 10]^\top, P_4 = [0, 10]^\top$
project to image pixels $[u, v]$:
$p_1 = [100, 100]^\top, p_2 = [200, 110]^\top, p_3 = [190, 210]^\top, p_4 = [90, 190]^\top$.
Formulate the $8 \times 9$ DLT measurement matrix $\mathbf{A}$, and state the exact SVD step to solve for $\mathbf{H}$.

**Step-by-step Solution:**
1. Each point pair $(X_i, Y_i) \leftrightarrow (u_i, v_i)$ generates two rows in $\mathbf{A}$:
   $$\mathbf{a}_{2i-1}^\top = \begin{bmatrix} -X_i & -Y_i & -1 & 0 & 0 & 0 & u_i X_i & u_i Y_i & u_i \end{bmatrix}$$
   $$\mathbf{a}_{2i}^\top = \begin{bmatrix} 0 & 0 & 0 & -X_i & -Y_i & -1 & v_i X_i & v_i Y_i & v_i \end{bmatrix}$$
2. Substitute the 4 point pairs:
   - Pair 1 $(0, 0) \to (100, 100)$:
     Row 1: $[0, 0, -1, 0, 0, 0, 0, 0, 100]$
     Row 2: $[0, 0, 0, 0, 0, -1, 0, 0, 100]$
   - Pair 2 $(10, 0) \to (200, 110)$:
     Row 3: $[-10, 0, -1, 0, 0, 0, 2000, 0, 200]$
     Row 4: $[0, 0, 0, -10, 0, -1, 1100, 0, 110]$
   - Pair 3 $(10, 10) \to (190, 210)$:
     Row 5: $[-10, -10, -1, 0, 0, 0, 1900, 1900, 190]$
     Row 6: $[0, 0, 0, -10, -10, -1, 2100, 2100, 210]$
   - Pair 4 $(0, 10) \to (90, 190)$:
     Row 7: $[0, -10, -1, 0, 0, 0, 0, 900, 90]$
     Row 8: $[0, 0, 0, 0, -10, -1, 0, 1900, 190]$
3. Compute SVD: $\mathbf{A} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^\top$.
   The solution vector $\mathbf{h} \in \mathbb{R}^9$ is the 9th column of $\mathbf{V}$, which is reshaped into the $3 \times 3$ matrix $\mathbf{H}$.

---

### Problem 12.4: Complete Convolutional Layer Forward-Backward Verification
**Statement:** A $1 \times 1 \times 3 \times 3$ input tensor $\mathbf{X}$ is filtered by a single $1 \times 1 \times 2 \times 2$ kernel $\mathbf{W}$ with zero padding and stride 1:
$$\mathbf{X} = \begin{bmatrix} 2 & 1 & 0 \\ 1 & 3 & 2 \\ 0 & 1 & 1 \end{bmatrix}, \quad \mathbf{W} = \begin{bmatrix} 1 & -1 \\ 2 & 0 \end{bmatrix}, \quad b = 1.0$$
1. Compute the output $\mathbf{Y} \in \mathbb{R}^{2 \times 2}$.
2. If the upstream gradient is $\boldsymbol{\delta} = \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix}$, compute $\frac{\partial \mathcal{L}}{\partial b}$ and $\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$.

**Step-by-step Solution:**
1. **Forward Pass:**
   - $Y[0, 0] = (2)(1) + (1)(-1) + (1)(2) + (3)(0) + 1.0 = 2 - 1 + 2 + 0 + 1.0 = 4.0$
   - $Y[0, 1] = (1)(1) + (0)(-1) + (3)(2) + (2)(0) + 1.0 = 1 + 0 + 6 + 0 + 1.0 = 8.0$
   - $Y[1, 0] = (1)(1) + (3)(-1) + (0)(2) + (1)(0) + 1.0 = 1 - 3 + 0 + 0 + 1.0 = -1.0$
   - $Y[1, 1] = (3)(1) + (2)(-1) + (1)(2) + (1)(0) + 1.0 = 3 - 2 + 2 + 0 + 1.0 = 4.0$
   $$\mathbf{Y} = \begin{bmatrix} 4.0 & 8.0 \\ -1.0 & 4.0 \end{bmatrix}$$

2. **Backward Pass:**
   - **Bias Gradient:**
     $$\frac{\partial \mathcal{L}}{\partial b} = \sum_{y, x} \delta[y, x] = 1 + 2 + 0 + (-1) = 2.0$$
   - **Weight Gradient:**
     $$W[0, 0]: (1)(2) + (2)(1) + (0)(1) + (-1)(3) = 2 + 2 + 0 - 3 = 1.0$$
     $$W[0, 1]: (1)(1) + (2)(0) + (0)(3) + (-1)(2) = 1 + 0 + 0 - 2 = -1.0$$
     $$W[1, 0]: (1)(1) + (2)(3) + (0)(0) + (-1)(1) = 1 + 6 + 0 - 1 = 6.0$$
     $$W[1, 1]: (1)(3) + (2)(2) + (0)(1) + (-1)(1) = 3 + 4 + 0 - 1 = 6.0$$
     $$\frac{\partial \mathcal{L}}{\partial \mathbf{W}} = \begin{bmatrix} 1.0 & -1.0 \\ 6.0 & 6.0 \end{bmatrix}$$

---

### Problem 12.5: Canny Edge NMS Sector Quantization Edge Case
**Statement:** At pixel $(y, x)$, Sobel gradients are $I_x = 100.0$ and $I_y = 241.42$.
1. Compute the exact orientation angle in degrees.
2. Determine which canonical sector ($0, 1, 2, \text{ or } 3$) this pixel falls into, noting boundary proximity.
3. If magnitudes are $M[y, x] = 261.3$, $M[y-1, x] = 265.0$, $M[y-1, x+1] = 250.0$, evaluate whether the pixel survives under Sector 1 vs Sector 2.

**Step-by-step Solution:**
1. Gradient angle:
   $$\theta = \text{atan2}(241.42, 100.0) = \text{atan2}(2.4142, 1.0) \approx 67.50^\circ$$
   Notice that $67.50^\circ$ is exactly the mathematical boundary between Sector 1 ($[22.5^\circ, 67.5^\circ)$) and Sector 2 ($[67.5^\circ, 112.5^\circ)$)!
2. By standard convention (half-open interval $[67.5^\circ, 112.5^\circ)$), $\theta = 67.50^\circ$ is assigned to **Sector 2 (Vertical $90^\circ$)**.
3. **Neighbor Comparison:**
   - Under Sector 2 (Vertical), test against $M[y-1, x] = 265.0$.
     Since $M[y, x] = 261.3 < 265.0$, the pixel is **suppressed** ($M_{\text{NMS}} = 0$).
   - If it had been assigned to Sector 1 (Diagonal), it would test against $M[y-1, x+1] = 250.0$.
     Since $261.3 \ge 250.0$, it would have survived!
   This demonstrates why sub-pixel linear interpolation is superior to discrete sector quantization near sector boundaries.

---

### Problem 12.6: Fundamental Matrix Epipolar Constraint Verification
**Statement:** Two corresponding points are $\mathbf{x}_L = [100, 200, 1]^\top$ and $\mathbf{x}_R = [120, 200, 1]^\top$.
The estimated Fundamental Matrix is:
$$\mathbf{F} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -0.01 \\ 0 & 0.01 & 0 \end{bmatrix}$$
Verify whether this correspondence satisfies the epipolar constraint equation $\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L = 0$.

**Step-by-step Solution:**
1. Compute $\mathbf{F} \mathbf{x}_L$:
   $$\mathbf{F} \mathbf{x}_L = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -0.01 \\ 0 & 0.01 & 0 \end{bmatrix} \begin{bmatrix} 100 \\ 200 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ -0.01(1) \\ 0.01(200) \end{bmatrix} = \begin{bmatrix} 0 \\ -0.01 \\ 2.0 \end{bmatrix}$$
2. Compute $\mathbf{x}_R^\top (\mathbf{F} \mathbf{x}_L)$:
   $$\mathbf{x}_R^\top \begin{bmatrix} 0 \\ -0.01 \\ 2.0 \end{bmatrix} = \begin{bmatrix} 120 & 200 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ -0.01 \\ 2.0 \end{bmatrix} = 120(0) + 200(-0.01) + 1(2.0) = 0 - 2.0 + 2.0 = 0$$
   The algebraic error is identically zero, confirming that the correspondence strictly satisfies the epipolar constraint!

---

### Problem 12.7: SIFT 128D Descriptor Distance Under Uniform Scaling
**Statement:** An image patch has its contrast doubled and brightness increased: $I'(x, y) = 2.0 I(x, y) + 50$.
Show analytically why the extracted 128-dimensional SIFT descriptor $\mathbf{f}'$ is identical to the original descriptor $\mathbf{f}$.

**Step-by-step Solution:**
1. Compute gradients of transformed image:
   $$I_x' = \frac{\partial}{\partial x}(2.0 I + 50) = 2.0 I_x, \quad I_y' = 2.0 I_y$$
2. Gradient magnitude:
   $$m' = \sqrt{(2.0 I_x)^2 + (2.0 I_y)^2} = 2.0 \sqrt{I_x^2 + I_y^2} = 2.0 m$$
3. Gradient orientation:
   $$\theta' = \text{atan2}(2.0 I_y, 2.0 I_x) = \text{atan2}(I_y, I_x) = \theta$$
4. Accumulating into the 128 orientation histogram bins:
   Every bin value is scaled by the constant factor $2.0$:
   $$\mathbf{v}' = 2.0 \mathbf{v}$$
5. The descriptor normalizes the vector to unit Euclidean norm:
   $$\mathbf{f}' = \frac{\mathbf{v}'}{\|\mathbf{v}'\|_2} = \frac{2.0 \mathbf{v}}{\|2.0 \mathbf{v}\|_2} = \frac{2.0 \mathbf{v}}{2.0 \|\mathbf{v}\|_2} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2} = \mathbf{f}$$
   The descriptor is invariant to affine photometric changes.

---

### Problem 12.8: Inverse Perspective Mapping (IPM) Grid Synthesis
**Statement:** A robot camera with $f = 800, c_x = 400, c_y = 300$ is mounted at height $h = 1.0\text{ m}$ tilted down by pitch $\theta = 30^\circ$.
A BEV image grid is generated where the origin $(0, 0)$ is at ground coordinate $X_W = 0, Y_W = 2.0\text{ m}$.
Find the raw camera pixel $(u, v)$ to sample from to populate this BEV origin pixel.

**Step-by-step Solution:**
1. Ground point in world coordinates: $\mathbf{X}_W = [0.0, 2.0, 0.0]^\top$.
2. Camera pose: $\mathbf{C} = [0.0, 0.0, 1.0]^\top$.
   Pitch by $30^\circ$:
   $$\mathbf{R}_Y(30^\circ) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos 30^\circ & -\sin 30^\circ \\ 0 & \sin 30^\circ & \cos 30^\circ \end{bmatrix} \dots$$
   Transforming $\mathbf{X}_W$ into camera coordinates yields $X_C = 0.0, Y_C = 1.866\text{ m}, Z_C = 2.232\text{ m}$.
3. Project into pixels:
   $$u = 800 \frac{0.0}{2.232} + 400 = 400.0$$
   $$v = 800 \frac{1.866}{2.232} + 300 = 800(0.836) + 300 = 668.8 + 300 = 968.8$$
   The BEV origin pixel samples from raw pixel $(400.0, 968.8)$.

---

### Problem 12.9: Soft-NMS Confidence Decay
**Statement:** Two overlapping candidate boxes have scores $s_1 = 0.95$ and $s_2 = 0.80$, with overlap $\text{IoU} = 0.60$.
Using Soft-NMS with Gaussian decay parameter $\sigma_{\text{nms}} = 0.50$, compute the updated score $s_2'$.

**Step-by-step Solution:**
1. Soft-NMS Gaussian decay formula:
   $$s_2' = s_2 \exp\left( -\frac{\text{IoU}^2}{\sigma_{\text{nms}}} \right)$$
2. Compute the exponent:
   $$\text{IoU}^2 = 0.60^2 = 0.36$$
   $$\frac{\text{IoU}^2}{\sigma_{\text{nms}}} = \frac{0.36}{0.50} = 0.72$$
   $$\exp(-0.72) \approx 0.48675$$
3. Update score:
   $$s_2' = 0.80 \times 0.48675 \approx 0.3894$$
   The score decays from $0.80$ to $0.39$. If the acceptance threshold is $0.30$, Box 2 survives with reduced rank rather than being deleted.

---

### Problem 12.10: Receptive Field Growth with Mixed Strides and Dilations
**Statement:** A 3-layer network has:
- Layer 1: $K_1 = 3, S_1 = 2, D_1 = 1$
- Layer 2: $K_2 = 3, S_2 = 1, D_2 = 2$
- Layer 3: $K_3 = 3, S_3 = 2, D_3 = 1$
Compute the final receptive field $RF_3$ and total stride jump $J_3$.

**Step-by-step Solution:**
1. Layer 1: $K_1 = 3, S_1 = 2$.
   $$RF_1 = 1 + (3 - 1)(1) = 3, \quad J_1 = 1 \times 2 = 2$$
2. Layer 2: $K_2 = 3, D_2 = 2 \implies K_{\text{eff}, 2} = 3 + (3 - 1)(2 - 1) = 5$. $S_2 = 1$.
   $$RF_2 = RF_1 + (5 - 1) \cdot J_1 = 3 + 4(2) = 3 + 8 = 11$$
   $$J_2 = J_1 \times S_2 = 2 \times 1 = 2$$
3. Layer 3: $K_3 = 3, S_3 = 2, D_3 = 1$.
   $$RF_3 = RF_2 + (3 - 1) \cdot J_2 = 11 + 2(2) = 11 + 4 = 15$$
   $$J_3 = J_2 \times S_3 = 2 \times 2 = 4$$
The final receptive field is $15 \times 15$ with total stride 4.

---

## 12.4 Capstone Mastery Problems

### Problem 12.11: Low-Light Noise Suppression and Edge Preservation
**Statement:** A warehouse robot navigates in a dimly lit aisle ($5\text{ lux}$). The camera sensor exhibits severe photon shot noise ($\sigma_n = 25\text{ gray levels}$).
1. Explain why applying Sobel edge detection directly produces a completely unusable edge map.
2. Formulate the optimal dual-stage filter pipeline combining Bilateral filtering and Canny hysteresis to recover structural pallet edges without noise bleeding.

**Step-by-step Solution:**
1. Shot noise has variance $\sigma_n^2 = 625$. From Chapter 3 (Problem 3.7), differentiation amplifies high-frequency noise variance by a factor of 8. The noise floor in the gradient magnitude map exceeds $M_{\text{noise}} \approx \sqrt{8 \times 625} \approx 70.7$. Any fixed threshold below 70 will detect hundreds of thousands of false noise edges across flat walls.
2. **Optimal Pipeline:**
   - Stage 1: Bilateral Filter with $\sigma_s = 2.0$ (spatial) and $\sigma_r = 50.0$ ($2\sigma_n$). This averages out the shot noise across homogeneous patches while preserving sharp intensity step boundaries $> 50$.
   - Stage 2: Canny Edge Detector with $T_{\text{high}} = 120$ (guaranteed above noise peaks) and $T_{\text{low}} = 60$. The hysteresis tracking connects unbroken pallet contours while discarding isolated noise specks.

---

### Problem 12.12: Radial Lens Distortion Inversion for Visual Odometry
**Statement:** A drone camera has $k_1 = -0.25$. At an edge pixel $(u_d, v_d) = (100, 100)$ with $(c_x, c_y) = (500, 500)$ and $f = 500$, compute the exact undistorted ray direction to prevent drift in visual odometry.

**Step-by-step Solution:**
1. Distorted normalized coordinates:
   $$x_d = \frac{100 - 500}{500} = -0.80, \quad y_d = \frac{100 - 500}{500} = -0.80$$
   $$r_d^2 = (-0.80)^2 + (-0.80)^2 = 0.64 + 0.64 = 1.28$$
2. Using Newton-Raphson iteration from Problem 5.5 on $r_d = r_n (1 - 0.25 r_n^2)$:
   $$r_d = \sqrt{1.28} \approx 1.13137$$
   Solving $f(r) = r - 0.25 r^3 - 1.13137 = 0$:
   With $r_0 = 1.13137$:
   $r_1 \approx 1.482$.
   Scale factor $\frac{r_n}{r_d} = \frac{1.482}{1.13137} \approx 1.310$.
3. Undistorted coordinates:
   $$x_n = -0.80 \times 1.310 \approx -1.048, \quad y_n = -0.80 \times 1.310 \approx -1.048$$
   Correcting this distortion prevents a catastrophic $31\%$ angular scale drift in the drone's visual odometry pipeline.

---

### Problem 12.13: Stereo Baseline Calibration from Ground Truth Target
**Statement:** A stereo rig with focal length $f = 1200\text{ pixels}$ observes a calibration target placed at an independently laser-measured distance of $Z = 3.000\text{ meters}$.
The measured horizontal disparity is $d = 80.0\text{ pixels}$.
Compute the calibrated physical baseline $b$ in meters and centimeters.

**Step-by-step Solution:**
1. Disparity formula: $Z = \frac{f \cdot b}{d} \implies b = \frac{Z \cdot d}{f}$.
2. Substitute values:
   $$b = \frac{3.000\text{ m} \times 80.0\text{ pixels}}{1200\text{ pixels}} = \frac{240.0}{1200} = 0.200\text{ meters} = 20.0\text{ cm}$$
   The calibrated baseline is exactly $20.0\text{ centimeters}$.

---

### Problem 12.14: Epipolar Rectification Verification
**Statement:** In an automated factory stereo inspection station, 100 matched feature points between the rectified left and right cameras have vertical coordinate differences $\Delta v = |v_L - v_R|$.
The mean vertical discrepancy is $\overline{\Delta v} = 0.08\text{ pixels}$, with maximum discrepancy $\max(\Delta v) = 0.45\text{ pixels}$.
Determine if this stereo pair meets the industrial standard for 1D horizontal scanline block matching.

**Step-by-step Solution:**
1. Industrial stereo matching standards require that the epipolar rectification error satisfies $\max(\Delta v) < 0.50\text{ pixels}$ (within the sub-pixel interpolation capture basin of standard block matchers).
2. Since $\max(\Delta v) = 0.45 < 0.50$ and $\overline{\Delta v} = 0.08 \ll 0.50$, the epipolar lines are aligned with sub-pixel precision.
3. The stereo pair is **certified for 1D horizontal block matching**.

---

### Problem 12.15: Dynamic Range Clipping in High-Contrast Outdoor Robotics
**Statement:** A self-driving car exits a dark tunnel into blinding sunlight ($100,000\text{ lux}$). The camera auto-exposure has a response lag of $150\text{ ms}$.
1. Describe the histogram of pixel values during saturation.
2. Explain why both gradient-based feature extraction (Harris, SIFT) and deep CNNs fail during this interval, and state the hardware sensor remedy (High Dynamic Range - HDR CMOS).

**Step-by-step Solution:**
1. During sensor saturation, photodiode potential wells overflow. Over $95\%$ of pixels clip to the maximum quantizer value $255$. The histogram degenerates into a single massive delta spike at $255$.
2. In flat saturated regions, spatial derivatives are zero: $I_x = 0, I_y = 0$.
   - The Harris Structure Tensor is identically zero: $\mathbf{M} = \mathbf{0} \implies R = 0$ (zero features detected).
   - Deep CNN convolutional activations saturate, producing uniform feature maps that fail object detection.
3. **Hardware Remedy:**
   Equip the robot with **HDR CMOS sensors** featuring dual-gain readouts or multi-exposure pixel arrays (e.g., capturing a short, medium, and long exposure simultaneously in a single frame), expanding dynamic range from $60\text{ dB}$ to $> 120\text{ dB}$.

---

### Problem 12.16: Rolling Shutter Artifacts Under High-Speed Rotation
**Statement:** A robot camera with a rolling shutter CMOS sensor reads out row-by-row with total frame readout time $T_{\text{frame}} = 30\text{ ms}$ ($720\text{ rows}$).
The robot undergoes a rapid angular yaw rotation of $\omega = 120^\circ/\text{s}$.
Compute the angular displacement of the camera between row 0 and row 719, and explain why standard epipolar geometry breaks down.

**Step-by-step Solution:**
1. Angular rotation during one frame readout:
   $$\Delta \theta = \omega \cdot T_{\text{frame}} = 120^\circ/\text{s} \times 0.030\text{ s} = 3.6^\circ$$
2. Row 719 is captured when the camera has rotated by $3.6^\circ$ relative to Row 0.
3. Vertical straight lines appear slanted diagonally (**rolling shutter skew**).
4. Standard epipolar geometry assumes a single instantaneous rigid pose $[\mathbf{R} \mid \mathbf{t}]$ for the entire frame. Under rolling shutter motion, every row has a different pose $[\mathbf{R}(t) \mid \mathbf{t}(t)]$. The Fundamental Matrix constraint fails unless rolling shutter kinematics are explicitly modeled in the projection equations.

---

### Problem 12.17: Feature Tracking Failure on Repetitive Textures
**Statement:** A visual SLAM system tracking features on a brick wall observes multiple feature matches passing Lowe's ratio test with $\text{NNDR} = 0.82$.
Explain why the system experiences catastrophic tracking drift, and specify how to modify the feature selector.

**Solution:**
1. Repetitive textures (bricks, tiles, grates) contain identical visual patterns at periodic spatial intervals.
2. Feature descriptors from adjacent bricks have nearly identical Euclidean distances ($D_1 \approx D_2$).
3. A loose threshold (e.g., $0.85$) accepts these ambiguous matches, causing the SLAM optimizer to associate features to the wrong physical bricks (**perceptual aliasing**).
4. **Remedy:**
   - Tighten Lowe's ratio test to $\tau = 0.65$.
   - Enforce a spatial motion continuity prior (e.g., optical flow prediction or IMU motion prior) that restricts candidate search windows to local expected neighborhoods.

---

### Problem 12.18: False Positive Edge Elimination via Morphological Area Opening
**Statement:** A binary edge map contains small isolated noise fragments resulting from high-frequency surface roughness.
Formulate a connected-component morphological filter that removes all connected components with area $A < 15\text{ pixels}$ in $\mathcal{O}(N)$ time.

**Solution:**
1. Run Two-Pass Connected Component Labeling (Chapter 4) with Union-Find to assign unique component IDs to all 8-connected foreground pixels.
2. In a single pass over the labeled buffer, accumulate an area histogram:
   $$\text{Area}[L] = \text{Area}[L] + 1$$
3. Re-scan the image: if $\text{Area}[\text{Find}(\text{Label}[y, x])] < 15$, set $I[y, x] = 0$.
4. This **Area Opening** filter eliminates all small noise specks in strictly linear time without eroding or altering the geometry of true large object boundaries.

---

### Problem 12.19: Numerical SVD Stabilization for DLT Homography
**Statement:** A computer vision engineer reports that their DLT homography implementation outputs completely corrupted matrices when matching points across high-resolution $4\text{K}$ images ($3840 \times 2160$).
Diagnose the failure and state the fix.

**Solution:**
1. In $4\text{K}$ images, coordinate values reach $x \approx 4000, y \approx 2000$.
2. In raw DLT, the cross-terms in matrix $\mathbf{A}$ reach $u_i x_i \approx 4000 \times 4000 = 1.6 \times 10^7$.
3. When computing SVD on float32 or even float64, matrix condition numbers exceed $10^{14}$, causing catastrophic loss of numerical precision.
4. **Fix:** Implement **Hartley Preconditioning** (Section 7.3): translate points to centroid $(0, 0)$ and scale so average distance is $\sqrt{2}$. Solve SVD on normalized coordinates, then de-normalize via $\mathbf{H} = (\mathbf{T}')^{-1} \tilde{\mathbf{H}} \mathbf{T}$.

---

### Problem 12.20: Real-Time Edge-to-Kinematics Latency Budget
**Statement:** A robotic ping-pong playing arm must intercept a ball traveling at $V = 10\text{ m/s}$. The camera runs at $120\text{ FPS}$ ($8.33\text{ ms}$ per frame).
The perception budget is:
- Image capture & transfer: $2.0\text{ ms}$
- Canny edge detection & Hough circle fit: $2.5\text{ ms}$
- Stereo triangulation: $1.0\text{ ms}$
- Kalman filter state update: $0.5\text{ ms}$
- Inverse Kinematics solver: $1.5\text{ ms}$
1. Compute the total perception-to-action latency $\tau_{\text{total}}$.
2. Calculate the physical distance traveled by the ball during this pipeline.
3. Verify whether the pipeline completes within the frame interval ($8.33\text{ ms}$).

**Step-by-step Solution:**
1. **Total Latency:**
   $$\tau_{\text{total}} = 2.0 + 2.5 + 1.0 + 0.5 + 1.5 = 7.50\text{ ms}$$
2. **Ball Travel Distance:**
   $$d_{\text{travel}} = V \cdot \tau_{\text{total}} = 10\text{ m/s} \times 0.0075\text{ s} = 0.075\text{ meters} = 7.5\text{ cm}$$
   The ball travels $7.5\text{ cm}$ while the robot computes its motion trajectory.
3. **Timing Verification:**
   $$\tau_{\text{total}} = 7.50\text{ ms} < 8.33\text{ ms}$$
   The entire perception-to-actuation pipeline completes within the $120\text{ FPS}$ frame deadline, ensuring zero frame dropping and robust real-time interception!
