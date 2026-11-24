# Chapter 5: Visual Domain Randomization (VDR) & Synthetic-to-Real Vision Transfer

## 5.1 Introduction: The Visual Reality Gap

In vision-based robotic manipulation and navigation, an autonomous agent must translate raw two-dimensional pixel arrays into spatial understanding and motor commands:
$$a_t = \pi_\theta(I_t, s_{\text{proprio}})$$

When deep convolutional neural networks (CNNs) or Vision Transformers (ViTs) are trained on photorealistic or synthetic simulator images, **they almost invariably fail when exposed to real-world camera feeds**.

The reasons are deeply rooted in the inductive biases of deep neural networks:
1. **Texture Overfitting:** Deep vision backbones are notoriously biased toward high-frequency surface textures and local color contrast rather than global 3D geometry (Geirhos et al., 2018). If a simulated tabletop has a uniform beige color and the target block has a solid red texture, the neural network learns to detect the red RGB pixel cluster rather than the geometric edges and contact boundaries. In the real world, shadows, specular glints, wood grain, or ambient LED reflections completely destroy the feature activations.
2. **Lighting and Shadow Discrepancies:** Ray tracing in real-time simulators (e.g., OpenGL, Vulkan) relies on simplified Phong or Cook-Torrance shading approximations. Real environments feature complex non-Lambertian surfaces, inter-reflections, subsurface scattering in human skin and plastics, and high dynamic range (HDR) sunlight.
3. **Camera Hardware Artifacts:** Real physical cameras are not pinhole mathematical abstractions. They exhibit radial and tangential lens distortion, chromatic aberration, sensor read noise, thermal dark current, lens dirt, motion blur, and structured depth sensor dropouts (multipath interference, speckle noise, and black absorption holes).

Visual Domain Randomization (VDR) operates on a powerful principle: **if the visual appearance of the simulator is randomized with sufficient variability, the neural network is forced to learn features that are invariant to texture, lighting, and color, focusing exclusively on essential spatial geometry.**

```
+---------------------------------------------------------------------------------------------------+
|                        VISUAL DOMAIN RANDOMIZATION (VDR) PIPELINE                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    Synthetic 3D Scene Geometry                                                                    |
|         │                                                                                         |
|         ▼                                                                                         |
|    [ PROCEDURAL TEXTURE GENERATOR ]                                                               |
|    - Random Perlin noise frequencies                                                              |
|    - Random RGB albedos, metallicity, and roughness                                               |
|    - Random internet image projections onto tables, floors, and robot links                       |
|         │                                                                                         |
|         ▼                                                                                         |
|    [ LIGHTING RANDOMIZER ]                                                                        |
|    - Point, spot, and directional lights (random positions, intensities, colors)                 |
|    - Ambient occlusion and shadow jitter                                                         |
|         │                                                                                         |
|         ▼                                                                                         |
|    [ CAMERA INTRINSICS & EXTRINSICS RANDOMIZER ]                                                  |
|    - Focal length perturbation: f' = f_0 * (1 + delta_f)                                          |
|    - Optical center jitter: (c_x, c_y)                                                            |
|    - Mounting angle jitter: R_cam = R_0 * Exp(omega_jitter)                                       |
|         │                                                                                         |
|         ▼                                                                                         |
|    [ HARDWARE SENSOR ARTIFACT SIMULATOR ]                                                         |
|    - Additive Gaussian & Poisson shot noise                                                       |
|    - Directional motion blur convolution                                                          |
|    - Depth camera speckle noise & shadow hole mask                                                |
|         │                                                                                         |
|         ▼                                                                                         |
|    Rendered Image I_random ────► CNN / ViT Backbone ────► Invariant Spatial Representation        |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 5.2 Procedural Texture Randomization and Texture-Free Representations

In standard graphics pipelines, the Bidirectional Reflectance Distribution Function (BRDF) describes how light reflects off an opaque surface:
$$f_r(\omega_i, \omega_o) = \frac{dL_r(\omega_o)}{L_i(\omega_i) \cos\theta_i d\omega_i}$$

Under VDR, every parameter of the BRDF is randomized at each episode reset:
- **Diffuse Albedo:** $c_{\text{diffuse}} \sim \mathcal{U}([0, 1]^3)$.
- **Specular Roughness:** $\alpha \sim \mathcal{U}(0.05, 0.95)$.
- **Metallic Fraction:** $m \sim \mathcal{U}(0.0, 1.0)$.

### 5.2.1 Perlin and Simplex Procedural Noise
Rather than uniform solid colors, surfaces are textured using multi-octave Perlin or fractal Brownian motion (fBm) noise:
$$\text{fBm}(x, y) = \sum_{k=0}^{M-1} \gamma^k \mathcal{N}_{\text{perlin}}(2^k f_0 x, 2^k f_0 y)$$
where $f_0$ is the base spatial frequency and $\gamma \in (0, 1)$ is the persistence factor. This produces chaotic wood-grain, marble, or mottled patterns that prevent the network from relying on spatial color homogeneity.

### 5.2.2 Random Web Image Projection
In pioneering works (Tobin et al., 2017; Sadeghi & Levine, 2017), textures on the table, walls, and robotic arm are randomly sampled from large image datasets (e.g., ImageNet, COCO). By projecting photographs of cats, cars, and landscapes onto the robotic gripper and workspace, the policy learns that pixel colors have zero correlation with grasping affordances.

---

## 5.3 Camera Intrinsics and Extrinsics Perturbation

The projection of a 3D point in the camera frame $\mathbf{P}_c = [X_c, Y_c, Z_c]^T$ to 2D pixel coordinates $\mathbf{p} = [u, v]^T$ is governed by the pinhole camera matrix $K$:
$$\begin{bmatrix} u \\ v \\ 1 \end{bmatrix} \sim K \mathbf{P}_c = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} X_c \\ Y_c \\ Z_c \end{bmatrix}$$

On physical robots, cameras are subject to manufacturing tolerances, thermal expansion, and mechanical vibration:

```
+---------------------------------------------------------------------------------------------------+
|                        CAMERA PERTURBATION MODELS IN VDR                                          |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  1. INTRINSICS RANDOMIZATION:                                                                     |
|     - Focal length: f_x ~ N(f_x0, sigma_f^2), f_y ~ N(f_y0, sigma_f^2)                            |
|     - Principal point: c_x ~ N(c_x0, sigma_c^2), c_y ~ N(c_y0, sigma_c^2)                         |
|     - Radial distortion: k_1 ~ U(-delta_k, +delta_k), k_2 ~ U(-delta_k2, +delta_k2)               |
|                                                                                                   |
|  2. EXTRINSICS RANDOMIZATION (Mounting Play):                                                     |
|     - Translation: t_cam = t_0 + delta_t, delta_t ~ U([-d, +d]^3)                                 |
|     - Orientation: R_cam = R_0 * Exp(hat(omega)_cam), ||omega_cam|| <= theta_max                 |
|                                                                                                   |
|  3. SENSOR NOISE & SHUTTER:                                                                       |
|     - Pixel noise: I'(u, v) = clip(I(u, v) + N(0, sigma_pix^2), 0, 1)                             |
|     - Motion blur: I_blur = I * K_motion(L, theta)                                                |
|     - Exposure jitter: I_exp = I * (1 + delta_gain)                                               |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 5.3.1 Lens Distortion Modeling
Real camera lenses introduce radial and tangential distortion. For an undistorted normalized point $(x_n, y_n) = (X_c / Z_c, Y_c / Z_c)$ with radius $r^2 = x_n^2 + y_n^2$:
$$x_d = x_n (1 + k_1 r^2 + k_2 r^4 + k_3 r^6) + 2 p_1 x_n y_n + p_2 (r^2 + 2 x_n^2)$$
$$y_d = y_n (1 + k_1 r^2 + k_2 r^4 + k_3 r^6) + p_1 (r^2 + 2 y_n^2) + 2 p_2 x_n y_n$$
Pixel coordinates are obtained via:
$$u = f_x x_d + c_x, \quad v = f_y y_d + c_y$$
If a policy is trained exclusively on undistorted pinhole renderings, barrel or pincushion distortion will shift perceived 3D positions by several centimeters near image boundaries.

---

## 5.4 Depth Sensor Simulation: Shadows, Speckle, and Multipath Dropouts

Active depth sensors (such as Intel RealSense, Microsoft Azure Kinect, or Orbbec cameras) project an infrared (IR) pattern and compute depth via structured-light triangulation or Time-of-Flight (ToF).

Real depth images are rife with characteristic physical failure modes:
1. **Occlusion Shadows (Blind Spots):** Because the IR projector and IR camera have a baseline separation $b \approx 50\text{ mm}$, objects cast a "shadow" region where the pattern is projected but cannot be seen by the receiver, creating voids where depth is reported as zero (NaN).
2. **Specular Dropouts:** Mirror-like or shiny metal objects reflect the projected IR beam away from the sensor, producing large missing holes.
3. **Absorptive Dark Surfaces:** Black materials (e.g., carbon fiber, black rubber feet) absorb IR light, causing low SNR and missing depth.
4. **Multipath Interference:** In concavities and corners, IR light bounces multiple times before returning, causing ToF sensors to overestimate distance.

To bridge the depth sim-to-real gap, synthetic depth maps $D_{\text{sim}}(u, v)$ must be passed through a **realistic depth degradation pipeline**:
$$D_{\text{real}}(u, v) = \mathcal{M}_{\text{shadow}} \odot \mathcal{M}_{\text{specular}} \odot \left( D_{\text{sim}}(u, v) + \mathcal{N}\left(0, \sigma_d^2(D_{\text{sim}})\right) \right)$$
where depth noise variance grows quadratically with distance: $\sigma_d(z) \propto z^2$.

---

## 5.5 Worked Examples (Problems 5.1 – 5.10)

---

### Problem 5.1 (Worked Example): Pinhole Camera Jacobian under Focal Length Perturbation
**Problem Statement:** A 3D target point is located at $\mathbf{P}_c = [0.20, -0.15, 0.80]^T\text{ meters}$ relative to the camera frame. The nominal camera matrix has focal length $f_0 = 600\text{ pixels}$ and principal point $(c_x, c_y) = (320, 240)\text{ pixels}$.
Compute:
1. The nominal pixel coordinates $(u_0, v_0)$.
2. The sensitivity Jacobian $\frac{\partial \mathbf{p}}{\partial f}$.
3. The pixel shift $(\Delta u, \Delta v)$ caused by a $5\%$ focal length calibration error ($\Delta f = +30\text{ pixels}$).

**Given Data:**
- $X_c = 0.20\text{ m}, Y_c = -0.15\text{ m}, Z_c = 0.80\text{ m}$
- $f_0 = 600\text{ px}$
- $c_x = 320\text{ px}, c_y = 240\text{ px}$
- $\Delta f = 30\text{ px}$

**Step-by-Step Derivation:**
1. Nominal projection:
   $$u_0 = f_0 \frac{X_c}{Z_c} + c_x = 600 \left(\frac{0.20}{0.80}\right) + 320 = 600(0.25) + 320 = 150 + 320 = 470\text{ pixels}$$
   $$v_0 = f_0 \frac{Y_c}{Z_c} + c_y = 600 \left(\frac{-0.15}{0.80}\right) + 240 = 600(-0.1875) + 240 = -112.5 + 240 = 127.5\text{ pixels}$$
2. Sensitivity Jacobian with respect to focal length:
   $$\frac{\partial u}{\partial f} = \frac{X_c}{Z_c} = \frac{0.20}{0.80} = 0.25\text{ pixels/pixel}$$
   $$\frac{\partial v}{\partial f} = \frac{Y_c}{Z_c} = \frac{-0.15}{0.80} = -0.1875\text{ pixels/pixel}$$
3. Pixel shift for $\Delta f = +30\text{ pixels}$:
   $$\Delta u = \frac{\partial u}{\partial f} \Delta f = (0.25)(30) = +7.5\text{ pixels}$$
   $$\Delta v = \frac{\partial v}{\partial f} \Delta f = (-0.1875)(30) = -5.625\text{ pixels}$$
   New pixel coordinates: $(u', v') = (477.5, 121.875)\text{ pixels}$.

**Final Answer:**
Nominal coordinates are $(470, 127.5)\text{ px}$; sensitivity is $\begin{bmatrix} 0.25 \\ -0.1875 \end{bmatrix}$; and a $5\%$ focal length error produces a pixel displacement of $(\Delta u, \Delta v) = (+7.5, -5.63)\text{ px}$, which translates to a centimeter-scale grasping error if unmodeled. $\blacksquare$

---

### Problem 5.2 (Worked Example): Camera Mounting Angle Misalignment and Re-projection Error
**Problem Statement:** An eye-in-hand camera is mounted on a robotic wrist. Nominal orientation is aligned with the flange frame. Due to mechanical play in the mounting bracket, the camera experiences a small yaw rotation error $\delta\theta_z = 0.035\text{ rad}$ ($2.0^\circ$).
For a target point at depth $Z = 0.50\text{ m}$ on the optical axis ($X_c = Y_c = 0$), compute the horizontal pixel displacement on an image sensor with $f = 800\text{ pixels}$.

**Given Data:**
- Nominal point in camera frame: $\mathbf{P}_0 = [0, 0, 0.50]^T\text{ m}$
- Yaw error $\delta\theta_z = 0.035\text{ rad}$ around the camera $Y$-axis (panning horizontally)
- Focal length $f = 800\text{ px}$

**Step-by-Step Derivation:**
1. Rotation matrix for small yaw angle $\delta\theta$ around $Y$-axis:
   $$R_y(\delta\theta) \approx \begin{bmatrix} 1 & 0 & \delta\theta \\ 0 & 1 & 0 \\ -\delta\theta & 0 & 1 \end{bmatrix}$$
2. The coordinates of the target point in the perturbed camera frame are:
   $$\mathbf{P}' = R_y^T \mathbf{P}_0 \approx \begin{bmatrix} 1 & 0 & -\delta\theta \\ 0 & 1 & 0 \\ \delta\theta & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ Z \end{bmatrix} = \begin{bmatrix} -Z \delta\theta \\ 0 \\ Z \end{bmatrix}$$
   $$X_c' = -Z \delta\theta = -(0.50)(0.035) = -0.0175\text{ m} = -17.5\text{ mm}$$
   $$Z_c' = Z = 0.50\text{ m}$$
3. Horizontal pixel shift:
   $$\Delta u = f \frac{X_c'}{Z_c'} = 800 \left(\frac{-0.0175}{0.50}\right) = 800 (-0.035) = -28.0\text{ pixels}$$

**Final Answer:**
A mere $2.0^\circ$ mounting misalignment shifts the target point by $-28.0\text{ pixels}$ in the camera image, completely throwing off closed-loop visual servoing controllers that lack extrinsics randomization. $\blacksquare$

---

### Problem 5.3 (Worked Example): Structured Light Depth Shadow Hole Geometry
**Problem Statement:** An active stereo depth sensor has baseline $B = 75\text{ mm}$ between the IR projector (at $x = 0$) and the IR camera (at $x = B$). A foreground obstacle of height $H = 40\text{ mm}$ and width $W = 60\text{ mm}$ is positioned at distance $Z_1 = 0.40\text{ m}$. The background table is at distance $Z_2 = 0.60\text{ m}$.
Calculate the lateral width $W_{\text{shadow}}$ of the occlusion shadow on the table where depth cannot be computed.

**Given Data:**
- Baseline $B = 0.075\text{ m}$
- Obstacle distance $Z_1 = 0.40\text{ m}$
- Background distance $Z_2 = 0.60\text{ m}$

**Step-by-Step Derivation:**
1. In triangulation-based structured light:
   The projector illuminates the scene from $x = 0$, while the camera observes from $x = B$.
   The right edge of the obstacle at $(X_{\text{edge}}, Z_1)$ casts a shadow boundary on the background table at $Z_2$.
2. Ray from projector through obstacle right edge:
   Slope of projector ray: $m_p = \frac{X_{\text{edge}}}{Z_1}$.
   At background distance $Z_2$, this ray reaches:
   $$X_{\text{proj}}(Z_2) = X_{\text{edge}} \frac{Z_2}{Z_1}$$
3. Line of sight from camera to the same obstacle edge:
   The camera at $(B, 0)$ views the edge along ray with slope $m_c = \frac{X_{\text{edge}} - B}{Z_1}$.
   At distance $Z_2$, this ray reaches:
   $$X_{\text{cam}}(Z_2) = B + (X_{\text{edge}} - B) \frac{Z_2}{Z_1}$$
4. The occlusion shadow width is the horizontal distance between the illuminated boundary and the camera line of sight:
   $$W_{\text{shadow}} = |X_{\text{proj}}(Z_2) - X_{\text{cam}}(Z_2)| = \left| X_{\text{edge}} \frac{Z_2}{Z_1} - \left( B + X_{\text{edge}} \frac{Z_2}{Z_1} - B \frac{Z_2}{Z_1} \right) \right|$$
   $$W_{\text{shadow}} = B \left(\frac{Z_2}{Z_1} - 1\right) = B \left(\frac{Z_2 - Z_1}{Z_1}\right)$$
5. Substitute numerical values:
   $$W_{\text{shadow}} = (0.075\text{ m}) \left(\frac{0.60 - 0.40}{0.40}\right) = (0.075) \left(\frac{0.20}{0.40}\right) = (0.075)(0.50) = 0.0375\text{ m} = 37.5\text{ mm}$$

**Final Answer:**
The physical triangulation geometry creates a shadow blind-spot of width $W_{\text{shadow}} = 37.5\text{ mm}$ on the table surface behind the object. In sim-to-real transfer, synthetic depth images that render crisp, hole-free surfaces cause policies to fail because real sensor depth masks contain large zero-depth holes. $\blacksquare$

---

### Problem 5.4 (Worked Example): Distance-Dependent Depth Noise Variance
**Problem Statement:** In Time-of-Flight (ToF) and active stereo cameras, depth measurement standard deviation $\sigma_z$ increases quadratically with distance $z$:
$$\sigma_z(z) = \frac{z^2}{B f} \sigma_d$$
where $B = 0.05\text{ m}$ is baseline, $f = 600\text{ pixels}$ is focal length, and disparity error standard deviation is $\sigma_d = 0.25\text{ pixels}$.
Compute the depth noise standard deviation $\sigma_z$ at:
1. Manipulation workspace range: $z_1 = 0.50\text{ m}$.
2. Navigation obstacle range: $z_2 = 3.0\text{ m}$.

**Given Data:**
- $B = 0.05\text{ m}$
- $f = 600\text{ px}$
- $B f = (0.05)(600) = 30.0\text{ m}\cdot\text{px}$
- $\sigma_d = 0.25\text{ px}$

**Step-by-Step Derivation:**
1. Constant factor:
   $$C = \frac{\sigma_d}{B f} = \frac{0.25}{30.0} = \frac{1}{120} \approx 0.008333\text{ m}^{-1}$$
2. At manipulation distance $z_1 = 0.50\text{ m}$:
   $$\sigma_z(0.50) = C z_1^2 = (0.008333)(0.50)^2 = (0.008333)(0.25) \approx 0.002083\text{ m} \approx 2.08\text{ mm}$$
3. At navigation distance $z_2 = 3.0\text{ m}$:
   $$\sigma_z(3.0) = C z_2^2 = (0.008333)(3.0)^2 = (0.008333)(9.0) \approx 0.075\text{ m} = 75.0\text{ mm} = 7.5\text{ cm}$$

**Final Answer:**
Depth noise is $2.08\text{ mm}$ at $0.5\text{ m}$, but explodes to $75.0\text{ mm}$ ($7.5\text{ cm}$) at $3.0\text{ m}$ ($36\times$ higher!). Simulators with constant Gaussian depth noise drastically underestimate far-field sensory uncertainty. $\blacksquare$

---

### Problem 5.5 (Worked Example): Radial Lens Distortion Coordinate Correction
**Problem Statement:** A wide-angle robot camera exhibits barrel distortion modeled by polynomial coefficient $k_1 = -0.15\text{ rad}^{-2}$ (with $k_2 = 0$). Focal length is $f = 400\text{ pixels}$ and principal point is $(c_x, c_y) = (320, 240)$.
For an undistorted pixel coordinate $(u, v) = (520, 390)$, compute:
1. The normalized undistorted radius $r_u$.
2. The distorted pixel coordinate $(u_d, v_d)$.
3. The inward radial pixel displacement.

**Given Data:**
- $k_1 = -0.15$
- $f = 400\text{ px}$
- $(c_x, c_y) = (320, 240)$
- $(u, v) = (520, 390)$

**Step-by-Step Derivation:**
1. Undistorted pixel offsets:
   $$\Delta x = u - c_x = 520 - 320 = 200\text{ pixels}$$
   $$\Delta y = v - c_y = 390 - 240 = 150\text{ pixels}$$
2. Normalized coordinates:
   $$x_n = \frac{\Delta x}{f} = \frac{200}{400} = 0.50$$
   $$y_n = \frac{\Delta y}{f} = \frac{150}{400} = 0.375$$
3. Radius squared:
   $$r_u^2 = x_n^2 + y_n^2 = (0.50)^2 + (0.375)^2 = 0.25 + 0.140625 = 0.390625$$
   $$r_u = \sqrt{0.390625} = 0.625$$
4. Distortion scaling factor:
   $$L(r) = 1 + k_1 r_u^2 = 1 + (-0.15)(0.390625) = 1 - 0.058594 = 0.941406$$
5. Distorted normalized coordinates:
   $$x_d = x_n L(r) = (0.50)(0.941406) = 0.470703$$
   $$y_d = y_n L(r) = (0.375)(0.941406) = 0.353027$$
6. Distorted pixel coordinates:
   $$u_d = f x_d + c_x = 400(0.470703) + 320 = 188.28 + 320 = 508.28\text{ pixels}$$
   $$v_d = f y_d + c_y = 400(0.353027) + 240 = 141.21 + 240 = 381.21\text{ pixels}$$
7. Inward displacement:
   $$\Delta r_{\text{pix}} = \sqrt{(520 - 508.28)^2 + (390 - 381.21)^2} = \sqrt{(11.72)^2 + (8.79)^2} = \sqrt{137.36 + 77.26} = \sqrt{214.62} \approx 14.65\text{ pixels}$$

**Final Answer:**
Barrel distortion pulls the corner pixel inward by $14.65\text{ pixels}$ to $(508.28, 381.21)$. Without distortion modeling, visual features near image boundaries are projected with significant spatial errors. $\blacksquare$

---

### Problem 5.6 (Worked Example): Directional Motion Blur Convolution Kernel
**Problem Statement:** During rapid robot arm rotation, the camera moves with angular velocity $\omega_y = 1.5\text{ rad/s}$. The camera exposure time is $T_{\text{exp}} = 20\text{ ms}$ and focal length is $f = 800\text{ pixels}$.
Compute:
1. The total angular displacement during exposure $\Delta\theta$.
2. The motion blur blur-kernel length $L_{\text{blur}}$ in pixels.
3. Formulate the 1D discrete convolution kernel $K_{\text{blur}}[k]$ representing this motion.

**Given Data:**
- $\omega_y = 1.5\text{ rad/s}$
- $T_{\text{exp}} = 0.020\text{ s}$
- $f = 800\text{ px}$

**Step-by-Step Derivation:**
1. Angular displacement during exposure:
   $$\Delta\theta = \omega_y T_{\text{exp}} = (1.5)(0.020) = 0.030\text{ radians} \approx 1.719^\circ$$
2. Blur length in pixels on the image plane:
   $$L_{\text{blur}} = f \tan(\Delta\theta) \approx f \Delta\theta = (800)(0.030) = 24.0\text{ pixels}$$
3. 1D discrete boxcar convolution kernel along horizontal axis $x$:
   $$K_{\text{blur}}[k] = \begin{cases} \frac{1}{25}, & -12 \le k \le +12 \\ 0, & \text{otherwise} \end{cases}$$
   The blurred image is obtained via 2D spatial convolution:
   $$I_{\text{blur}}(x, y) = \sum_{k=-12}^{12} K_{\text{blur}}[k] I(x - k, y)$$

**Final Answer:**
The camera movement spreads each scene point over a 24-pixel horizontal streak ($L_{\text{blur}} = 24\text{ px}$). High-frequency edge gradients are attenuated by $\operatorname{sinc}(\pi f L_{\text{blur}})$, completely wiping out standard feature descriptors unless trained with motion blur randomization. $\blacksquare$

---

### Problem 5.7 (Worked Example): Automatic Exposure Gain and Poisson Shot Noise
**Problem Statement:** A CMOS camera sensor pixel has full-well capacity $C_{\text{fw}} = 30,000\text{ electrons}$. Under low indoor lighting, a scene patch deposits an average of $\bar{N}_e = 900\text{ photoelectrons}$ during exposure.
1. Compute the intrinsic Signal-to-Noise Ratio (SNR) governed by Poisson photon shot noise.
2. If digital gain $G = 4.0\times$ is applied to brighten the image, compute the new electron count and the resulting SNR.

**Given Data:**
- $\bar{N}_e = 900\text{ electrons}$
- Digital gain $G = 4.0$

**Step-by-Step Derivation:**
1. Photon emission and conversion is a Poisson process:
   Variance equals mean: $\sigma_e^2 = \bar{N}_e = 900$.
   Shot noise standard deviation: $\sigma_e = \sqrt{900} = 30\text{ electrons}$.
   Signal-to-Noise Ratio:
   $$\text{SNR}_0 = \frac{\bar{N}_e}{\sigma_e} = \frac{900}{30} = 30.0 \quad (20 \log_{10}(30) \approx 29.54\text{ dB})$$
2. Applying digital gain $G$:
   The amplified signal is $S' = G \bar{N}_e = 4.0 \times 900 = 3600$.
   The amplified noise is $\sigma' = G \sigma_e = 4.0 \times 30 = 120$.
   The resulting SNR is:
   $$\text{SNR}' = \frac{S'}{\sigma'} = \frac{3600}{120} = 30.0$$

**Final Answer:**
The intrinsic SNR is $30.0$ ($29.54\text{ dB}$). Applying digital gain brightens the image but **cannot improve SNR**—it scales both signal and noise equally, amplifying visual grain. Training on noiseless, perfectly lit synthetic renderings leaves vision policies brittle under low-light gain amplification. $\blacksquare$

---

### Problem 5.8 (Worked Example): Grayscale Invariance via Color Jittering
**Problem Statement:** A standard RGB image is converted to luminance (grayscale) using standard Rec. 601 coefficients:
$$Y = 0.299 R + 0.587 G + 0.114 B$$
In simulation, an object has red color $(1, 0, 0)$ and the table has green color $(0, 0.51, 0)$.
1. Compute the luminance contrast $|Y_{\text{obj}} - Y_{\text{table}}|$.
2. Show that under uniform color jittering, the luminance contrast can invert, and explain why color invariance forces the network to learn geometric silhouettes.

**Given Data:**
- Object RGB: $(1.0, 0.0, 0.0)$
- Table RGB: $(0.0, 0.51, 0.0)$

**Step-by-Step Derivation:**
1. Nominal luminance:
   $$Y_{\text{obj}} = 0.299(1.0) + 0 + 0 = 0.299$$
   $$Y_{\text{table}} = 0 + 0.587(0.51) + 0 \approx 0.29937$$
   Contrast:
   $$\Delta Y = |0.299 - 0.29937| \approx 0.00037 \approx 0$$
   In grayscale, the red object and green table are completely indistinguishable!
2. If the policy relied on RGB color cues, it could easily distinguish them ($R_{\text{obj}} = 1.0$ vs $R_{\text{table}} = 0.0$).
   However, if RGB channels are randomized independently across episodes:
   $$R' \sim \mathcal{U}(0, 1), \quad G' \sim \mathcal{U}(0, 1), \quad B' \sim \mathcal{U}(0, 1)$$
   The expected color difference between any two surfaces vanishes on average.
   The only feature that remains invariant across all episodes is the **spatial depth discontinuity and geometric edge gradient** $\nabla I(x, y)$.

**Final Answer:**
Randomizing color palettes destroys chromatic information, compelling convolutional kernels to converge to gradient and edge detectors (resembling biological Gabor filters) that transfer reliably to physical reality. $\blacksquare$

---

### Problem 5.9 (Worked Example): Chromatic Aberration Dispersion
**Problem Statement:** A simple camera lens has focal length $f_{\text{green}} = 50.0\text{ mm}$ for green light ($\lambda = 550\text{ nm}$). Due to glass dispersion (Abbe number $V_d = 45$), the refractive index varies, causing focal lengths $f_{\text{blue}} = 49.5\text{ mm}$ and $f_{\text{red}} = 50.5\text{ mm}$.
For an object at distance $Z = 1.0\text{ m}$, compute the longitudinal chromatic aberration (difference in image plane distance $\Delta s_i$ between red and blue light).

**Given Data:**
- $Z = 1000\text{ mm}$
- $f_b = 49.5\text{ mm}$
- $f_r = 50.5\text{ mm}$

**Step-by-Step Derivation:**
1. Lens equation: $\frac{1}{f} = \frac{1}{Z} + \frac{1}{s_i} \implies s_i = \frac{f Z}{Z - f}$.
2. For blue light ($f_b = 49.5\text{ mm}$):
   $$s_{i, b} = \frac{(49.5)(1000)}{1000 - 49.5} = \frac{49500}{950.5} \approx 52.078\text{ mm}$$
3. For red light ($f_r = 50.5\text{ mm}$):
   $$s_{i, r} = \frac{(50.5)(1000)}{1000 - 50.5} = \frac{50500}{949.5} \approx 53.186\text{ mm}$$
4. Longitudinal chromatic aberration:
   $$\Delta s_i = s_{i, r} - s_{i, b} = 53.186 - 52.078 = 1.108\text{ mm}$$

**Final Answer:**
Red and blue focal planes are separated by $\Delta s_i \approx 1.11\text{ mm}$. When the green channel is in focus, the red and blue channels exhibit slight radial color fringing at high-contrast edges. Modeling chromatic channel shift in VDR prevents network sensitivity to optical fringing. $\blacksquare$

---

### Problem 5.10 (Worked Example): Contrastive Domain Invariance Loss
**Problem Statement:** To force a visual encoder $f_\phi(I)$ to learn sim-to-real invariant representations, an InfoNCE contrastive loss is applied to pairs of differently randomized renderings $(I_i, I_i^+)$ of the exact same 3D scene state $s_i$:
$$\mathcal{L}_{\text{contrast}} = -\sum_{i=1}^B \ln \frac{\exp(\text{sim}(z_i, z_i^+) / \tau)}{\sum_{j=1}^B \exp(\text{sim}(z_i, z_j) / \tau)}$$
where $z = f_\phi(I) / \|f_\phi(I)\|$.
Prove that minimizing this loss maximizes a lower bound on the mutual information $I(Z; S)$ between the representation and the underlying physical scene state.

**Step-by-Step Derivation:**
1. Let $I_i$ and $I_i^+$ be two conditionally independent random visual views of the same physical state $s_i$:
   $$p(I, I^+ \mid s) = p(I \mid s) p(I^+ \mid s)$$
2. By the InfoNCE theorem (van den Oord et al., 2018):
   The InfoNCE objective with $B$ negative samples satisfies:
   $$I(Z_1; Z_2) \ge \ln(B) - \mathcal{L}_{\text{InfoNCE}}$$
   where $I(Z_1; Z_2)$ is the mutual information between representations of the two randomized views.
3. By the Data Processing Inequality:
   Since $Z_1$ depends on $S$ only through $I$, and $I$ depends on $S$:
   $$I(Z_1; Z_2) \le I(Z_1; S)$$
4. Therefore, minimizing the contrastive loss $\mathcal{L}_{\text{InfoNCE}}$ pushes $I(Z_1; Z_2)$ toward its maximum $\ln(B)$, which directly maximizes the lower bound on the physical mutual information $I(Z; S)$.

**Final Answer:**
Minimizing the contrastive InfoNCE loss forces the encoder to discard all view-specific randomized artifacts (textures, lighting, noise) and preserve strictly the invariant physical geometry $S$, proving mathematically that contrastive VDR achieves sim-to-real transfer. $\blacksquare$

---

## 5.6 Solved Exercises (Problems 5.11 – 5.20)

---

### Problem 5.11 (Solved Exercise): Specular Reflection Cone and Phong Exponent
**Problem Statement:** The Blinn-Phong specular reflection model is $I_{\text{spec}} = k_s (\mathbf{N} \cdot \mathbf{H})^\alpha$, where $\mathbf{H} = \frac{\mathbf{L} + \mathbf{V}}{\|\mathbf{L} + \mathbf{V}\|}$ is the half-vector and $\alpha$ is the specular shininess exponent. If $\alpha$ is randomized over $[1, 200]$, compute the angular half-width $\theta_{1/2}$ of the specular highlight for $\alpha = 5$ (matte plastic) versus $\alpha = 150$ (polished chrome).

**Step-by-Step Solution:**
1. Half-power condition: $\cos^\alpha(\theta_{1/2}) = 0.5 \implies \theta_{1/2} = \arccos(0.5^{1/\alpha})$.
2. For $\alpha = 5$:
   $$\theta_{1/2} = \arccos(0.5^{0.2}) = \arccos(0.87055) \approx 0.5146\text{ rad} \approx 29.48^\circ$$
3. For $\alpha = 150$:
   $$\theta_{1/2} = \arccos(0.5^{1/150}) = \arccos(0.5^{0.006667}) = \arccos(0.99539) \approx 0.0960\text{ rad} \approx 5.50^\circ \quad \blacksquare$$

---

### Problem 5.12 (Solved Exercise): Field of View (FoV) Variation
**Problem Statement:** A camera sensor has width $W = 6.4\text{ mm}$. If focal length is randomized via $f \sim \mathcal{U}(4.0\text{ mm}, 8.0\text{ mm})$, compute the range of horizontal Field of View (FoV) in degrees.

**Step-by-Step Solution:**
1. Horizontal FoV formula: $\text{FoV}_h = 2 \arctan\left(\frac{W}{2f}\right)$.
2. For $f = 4.0\text{ mm}$:
   $$\text{FoV}_{\max} = 2 \arctan\left(\frac{6.4}{8.0}\right) = 2 \arctan(0.80) \approx 2(38.66^\circ) = 77.32^\circ$$
3. For $f = 8.0\text{ mm}$:
   $$\text{FoV}_{\min} = 2 \arctan\left(\frac{6.4}{16.0}\right) = 2 \arctan(0.40) \approx 2(21.80^\circ) = 43.60^\circ \quad \blacksquare$$

---

### Problem 5.13 (Solved Exercise): Gaussian Pixel Noise Variance Bounds
**Problem Statement:** An 8-bit image has pixel values in $\{0, 1, \dots, 255\}$. If additive Gaussian noise $\epsilon \sim \mathcal{N}(0, \sigma^2)$ is added with $\sigma = 15$, compute the probability that a pixel with true intensity $I = 250$ is clipped by the upper saturation bound ($I_{\text{clipped}} = 255$).

**Step-by-Step Solution:**
1. Clipping occurs if $250 + \epsilon \ge 255 \implies \epsilon \ge 5$.
2. Standardized $Z$-score:
   $$Z = \frac{5 - 0}{\sigma} = \frac{5}{15} \approx 0.3333$$
3. Probability of saturation:
   $$P(\epsilon \ge 5) = 1 - \Phi(0.3333) \approx 1 - 0.63056 = 0.36944 \approx 36.94\% \quad \blacksquare$$

---

### Problem 5.14 (Solved Exercise): Gamma Correction Non-Linearity
**Problem Statement:** Real cameras apply display gamma correction $I_{\text{out}} = I_{\text{linear}}^{1/\gamma}$ with $\gamma = 2.2$. If a simulator outputs linear luminance $I_{\text{linear}} = 0.20$, compute the resulting pixel intensity under gamma correction, and state why uncorrected linear simulation leads to dark real-world inference errors.

**Step-by-Step Solution:**
1. Corrected intensity:
   $$I_{\text{out}} = (0.20)^{1 / 2.2} = (0.20)^{0.45455} \approx 0.4812$$
2. An intensity of $0.20$ is boosted to $0.48$ ($2.4\times$ brighter!).
3. If an RL policy is trained on raw linear simulation renders, it interprets the brighter real-world indoor camera feed as an extreme overexposure artifact. $\blacksquare$

---

### Problem 5.15 (Solved Exercise): Depth Disparity Quantization Error
**Problem Statement:** Stereo vision computes depth as $Z = \frac{B f}{d}$. If disparity $d$ is quantized to integer pixels with step size $\Delta d = 1\text{ pixel}$, compute the depth quantization resolution $\Delta Z$ at $Z = 2.0\text{ m}$ for $B = 0.10\text{ m}$ and $f = 1000\text{ pixels}$.

**Step-by-Step Solution:**
1. Nominal disparity at $Z = 2.0\text{ m}$:
   $$d = \frac{B f}{Z} = \frac{(0.10)(1000)}{2.0} = \frac{100}{2.0} = 50\text{ pixels}$$
2. Disparity differential:
   $$\Delta Z \approx \left| \frac{\partial Z}{\partial d} \right| \Delta d = \frac{B f}{d^2} \Delta d = \frac{Z^2}{B f} \Delta d$$
3. Substitute values:
   $$\Delta Z = \frac{(2.0)^2}{100} (1) = \frac{4.0}{100} = 0.040\text{ m} = 4.0\text{ cm} \quad \blacksquare$$

---

### Problem 5.16 (Solved Exercise): Cutout and Random Erasing Data Augmentation
**Problem Statement:** Random Erasing (Zhong et al., 2020) overwrites a random rectangular patch of size $W_e \times H_e$ with uniform noise. If an image has size $224 \times 224$ and an erasing patch has area ratio $s_e = 0.20$ with aspect ratio $r_e = 1.0$, compute the pixel dimensions of the occluded box.

**Step-by-Step Solution:**
1. Total image area: $A = 224 \times 224 = 50,176\text{ pixels}^2$.
2. Erasing area: $A_e = s_e A = (0.20)(50,176) = 10,035.2\text{ pixels}^2$.
3. Dimensions for aspect ratio $r_e = W_e / H_e = 1.0$:
   $$W_e = H_e = \sqrt{A_e} = \sqrt{10035.2} \approx 100.18 \approx 100\text{ pixels} \quad \blacksquare$$

---

### Problem 5.17 (Solved Exercise): Point Cloud Outlier Injection (Salt-and-Pepper Depth Noise)
**Problem Statement:** A 3D LiDAR point cloud contains $N = 10,000$ valid returns. During sim-to-real transfer, dust particles and steam inject phantom returns at rate $\eta = 2\%$. Compute the expected number of false obstacle points injected into the robot's local occupancy grid.

**Step-by-Step Solution:**
1. Expected false points:
   $$\mathbb{E}[N_{\text{false}}] = \eta N = (0.02)(10,000) = 200\text{ phantom points}$$
2. If unmodeled, each phantom point triggers an emergency stop collision buffer. Randomizing salt-and-pepper noise in VDR teaches point-cloud encoders to filter isolated floating outliers. $\blacksquare$

---

### Problem 5.18 (Solved Exercise): White Balance Temperature Drift
**Problem Statement:** Sunlight has color temperature $T_1 = 6500\text{ K}$ (cool blue), while indoor tungsten lighting has $T_2 = 2800\text{ K}$ (warm orange). If red-to-blue gain ratio changes from $\frac{G_R}{G_B} = 0.8$ outdoors to $\frac{G_R}{G_B} = 2.4$ indoors, compute the percentage change in the red channel scaling.

**Step-by-Step Solution:**
1. Ratio shift:
   $$\frac{(G_R / G_B)_{\text{indoors}}}{(G_R / G_B)_{\text{outdoors}}} = \frac{2.4}{0.8} = 3.0\times$$
2. The red channel is amplified by $300\%$ relative to blue!
3. VDR color balance jittering must span at least a $3\times$ gain range to survive indoor-to-outdoor transitions. $\blacksquare$

---

### Problem 5.19 (Solved Exercise): Vignetting (Cos-Fourth Law of Illumination)
**Problem Statement:** Due to the geometric optics of camera apertures, pixel irradiance falls off toward image corners according to the $\cos^4(\theta)$ law: $E(\theta) = E_0 \cos^4(\theta)$. For a corner pixel at incidence angle $\theta = 35^\circ$, compute the percentage loss in illumination compared to the image center.

**Step-by-Step Solution:**
1. Cosine of angle: $\cos(35^\circ) \approx 0.81915$.
2. Fourth power:
   $$\cos^4(35^\circ) = (0.81915)^4 \approx 0.4502$$
3. Illumination drop:
   $$\Delta E = 1 - 0.4502 = 0.5498 \approx 54.98\% \quad \blacksquare$$

---

### Problem 5.20 (Solved Exercise): Domain Adversarial Training of Neural Features (DANN)
**Problem Statement:** In Domain-Adversarial Neural Networks (Ganin et al., 2016), a gradient reversal layer (GRL) with parameter $\lambda_{\text{grl}}$ connects feature extractor $G_f$ to domain classifier $G_d$. Formulate the minimax optimization problem that ensures features are simultaneously informative for task control and uninformative for domain discrimination.

**Step-by-Step Solution:**
1. Total loss:
   $$\mathcal{L}(\theta_f, \theta_y, \theta_d) = \mathcal{L}_{\text{task}}(G_y(G_f(x)), y) - \lambda_{\text{grl}} \mathcal{L}_{\text{domain}}(G_d(G_f(x)), d)$$
2. Optimization objective:
   $$\hat{\theta}_f, \hat{\theta}_y = \arg\min_{\theta_f, \theta_y} \mathcal{L}(\theta_f, \theta_y, \hat{\theta}_d)$$
   $$\hat{\theta}_d = \arg\max_{\theta_d} \mathcal{L}(\hat{\theta}_f, \hat{\theta}_y, \theta_d)$$
3. The domain classifier maximizes its ability to distinguish simulated vs real frames, while the feature extractor minimizes task error while maximizing domain confusion, guaranteeing that representation $z = G_f(x)$ contains zero domain-specific markers. $\blacksquare$
