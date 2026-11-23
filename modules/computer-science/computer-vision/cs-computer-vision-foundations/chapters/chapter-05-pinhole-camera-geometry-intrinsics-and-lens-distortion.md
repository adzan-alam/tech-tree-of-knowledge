# Chapter 5: Pinhole Camera Geometry, Intrinsics, and Lens Distortion

---

## 5.1 The Geometry of Image Formation and the Pinhole Camera

Visual perception in biological organisms and autonomous robots begins with a mapping from the 3D continuous physical universe onto a 2D sensory surface. The foundational mathematical model describing this transformation is the **pinhole camera** (or *camera obscura*).

```
                           THE PINHOLE CAMERA GEOMETRY
                           
         3D Object Point
          X = [X, Y, Z]^T
                 o
                  \
                   \
                    \           Optical Axis (Z-axis)
                     \                    │
                      \                   │
     ──────────────────\──────────────────+────────────────── Image Plane (Z = -f)
                        \                 │                ┌─────────────────┐
                         \                │                │        .        │
                          \               │                │       /         │
                           \              │                │      o          │
                            \             │                │   (x, y)        │
                             \            │                └─────────────────┘
                              ▼           │
                           Pinhole (Center of Projection C)
```

### The Camera Obscura Model
Consider a 3D Cartesian coordinate frame whose origin $(0, 0, 0)$ is fixed at the camera's optical aperture (the pinhole, or **Center of Projection** $\mathbf{C}$). The positive $Z$-axis points forward into the observed scene along the **principal ray** (optical axis).

Let an arbitrary 3D point in the scene have camera coordinates $\mathbf{X}_C = [X, Y, Z]^\top$ with depth $Z > 0$. Light rays originating from $\mathbf{X}_C$ pass through the optical center $\mathbf{C}$ and strike an image plane situated at a distance $f$ behind the pinhole ($Z = -f$).

By the geometric law of similar triangles:
$$\frac{-x}{f} = \frac{X}{Z} \implies x = -f \frac{X}{Z}$$
$$\frac{-y}{f} = \frac{Y}{Z} \implies y = -f \frac{Y}{Z}$$
The negative signs reflect the physical reality that rays crossing through the aperture invert the image upside down and left-to-right.

### The Virtual Frontal Image Plane
To eliminate the inconvenient negative sign inversion in mathematical derivations, computer vision places a **virtual image plane** at distance $+f$ in *front* of the center of projection ($Z = +f$). Under this convention, the forward perspective projection equations become:

$$x = f \frac{X}{Z}, \quad y = f \frac{Y}{Z}$$

```
                       VIRTUAL FRONTAL IMAGE PLANE
                       
                                Virtual Image Plane
                                      (Z = f)
                                  ┌─────────────┐
                                  │             │
                                  │      o (x, y)
                                  │     /       │
    Optical Center C              └───/─────────┘           3D Point X = [X, Y, Z]^T
         (0, 0, 0)                   /                                 o
            o───────────────────────+─────────────────────────────────/──► Z
            │                      f                                 /
            │◄──────────────────────────────────────────────────────►│
                                       Depth Z
```

#### Fundamental Geometric Properties:
1. **Perspective Shrinkage:** The projected image size of an object is inversely proportional to its depth: $\text{scale} \propto \frac{1}{Z}$. Objects twice as far appear half as large.
2. **Loss of Depth:** Perspective projection is a many-to-one mapping: every 3D point along the infinite ray $\lambda [X, Y, Z]^\top$ (for $\lambda > 0$) projects onto the exact same 2D pixel $(x, y)$. Recovering depth requires multiple views or active sensors.
3. **Vanishing Points and Lines:** Parallel 3D lines in world space that are not parallel to the image plane converge to a single **vanishing point** on the image plane. The horizon line is the locus of vanishing points for all parallel line families on the ground plane.

---

## 5.2 From Metric Coordinates to Discrete Pixels

The coordinates $(x, y)$ computed above are continuous physical distances measured in millimeters or micrometers on the silicon focal plane. A digital computer vision algorithm does not operate in physical millimeters; it indexes discrete integer pixels $[u, v]$ in an array buffer.

### Pixel Pitch and Principal Point Offset
Bridging this gap requires modeling two sensor hardware parameters:
1. **Pixel Pitch ($s_x, s_y$):** The physical width and height of an individual photodiode on the silicon die, expressed in millimeters per pixel ($\text{mm}/\text{pixel}$).
2. **Principal Point $(c_x, c_y)$:** The pixel coordinates where the camera's optical axis pierces the digital sensor plane. In an ideal sensor, $(c_x, c_y)$ sits exactly at the geometric center $\left(\frac{W}{2}, \frac{H}{2}\right)$, but mechanical assembly tolerances routinely displace it by several pixels.

```
                    METRIC SENSOR PLANE VS. PIXEL GRID
                    
          Continuous Metric Plane (mm)               Discrete Pixel Grid [u, v]
          
                     y                                  (0, 0) ──────────────────► u
                     ▲                                    │
                     │                                    │      Pixel [u, v]
                     │                                    │         ┌───┐
                     │                                    │         │   │
        ─────────────+─────────────► x                    │         └───┘
                     │ Origin (0, 0)                      │      + Principal Point (c_x, c_y)
                     │ (Optical Axis Piercing)            │
                     │                                    ▼
                                                          v
```

Converting continuous metric displacement $(x, y)$ to discrete pixel indices $(u, v)$:
$$u = \frac{x}{s_x} + c_x = \frac{f}{s_x} \left(\frac{X}{Z}\right) + c_x$$
$$v = \frac{y}{s_y} + c_y = \frac{f}{s_y} \left(\frac{Y}{Z}\right) + c_y$$

### Focal Lengths in Pixel Units
Define the dimensionless quantities $f_x$ and $f_y$ representing the camera focal length expressed in horizontal and vertical pixel units:
$$f_x \triangleq \frac{f}{s_x} \quad (\text{pixels}), \quad f_y \triangleq \frac{f}{s_y} \quad (\text{pixels})$$

If the sensor photosites are perfectly square ($s_x = s_y$), then $f_x = f_y$. On non-square sensors (common in anamorphic lenses or broadcast video), $f_x \neq f_y$, producing an aspect ratio distortion $\frac{f_x}{f_y} \neq 1$.

The projection equations become:
$$u = f_x \frac{X}{Z} + c_x$$
$$v = f_y \frac{Y}{Z} + c_y$$

---

## 5.3 The Camera Intrinsic Calibration Matrix K

The non-linear division by depth $Z$ prevents formulating perspective projection as a standard linear matrix multiplication in Cartesian coordinates. However, by adopting **projective homogeneous coordinates**, the projection mapping becomes strictly linear!

### Homogeneous Coordinates Formulation
Represent the 3D point $\mathbf{X}_C = [X, Y, Z]^\top$ and 2D pixel $\mathbf{x} = [u, v]^\top$ by augmented homogeneous vectors:
$$\tilde{\mathbf{X}}_C = \begin{bmatrix} X \\ Y \\ Z \end{bmatrix}, \quad \tilde{\mathbf{x}} = \begin{bmatrix} u \\ v \\ 1 \end{bmatrix}$$

Multiplying the pixel equations by $Z$:
$$Z \cdot u = f_x X + s Y + c_x Z$$
$$Z \cdot v = f_y Y + c_y Z$$
$$Z \cdot 1 = Z$$
where $s \in \mathbb{R}$ is an optional **skew parameter** modeling non-orthogonal sensor axes ($s = f_x \cot\theta_{\text{skew}}$, which equals $0$ for modern fabrication where the grid angle $\theta_{\text{skew}} = 90^\circ$).

In compact matrix-vector notation:
$$Z \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \begin{bmatrix} f_x & s & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} X \\ Y \\ Z \end{bmatrix}$$

### The Camera Intrinsic Matrix K
The $3 \times 3$ upper-triangular matrix $\mathbf{K}$ is the celebrated **Camera Intrinsic Matrix**:

$$\mathbf{K} \triangleq \begin{bmatrix} f_x & s & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \in \mathbb{R}^{3 \times 3}$$

Thus:
$$\lambda \tilde{\mathbf{x}} = \mathbf{K} \mathbf{X}_C \quad \text{where } \lambda = Z$$

```
                       THE INTRINSIC MATRIX ARCHITECTURE
                       
                           ┌                         ┐
                           │   f_x     s     c_x     │
                       K = │    0     f_y    c_y     │
                           │    0      0      1      │
                           └                         ┘
                                ▲      ▲      ▲
                                │      │      └─ Optical Center Piercing Offset
                                │      └──────── Pixel Skew Factor (cot θ_skew)
                                └─────────────── Effective Pixel Focal Lengths
```

### Normalized Image Coordinates and Ray Back-Projection
Given a detected 2D pixel $\tilde{\mathbf{x}} = [u, v, 1]^\top$ and known intrinsic matrix $\mathbf{K}$, we can invert the intrinsic transformation to recover the **normalized image coordinate** $\mathbf{x}_{\text{norm}}$:

$$\mathbf{x}_{\text{norm}} \triangleq \mathbf{K}^{-1} \tilde{\mathbf{x}} = \begin{bmatrix} \frac{u - c_x}{f_x} \\[4pt] \frac{v - c_y}{f_y} \\[4pt] 1 \end{bmatrix} = \begin{bmatrix} x_n \\ y_n \\ 1 \end{bmatrix}$$

Notice that $x_n = \frac{X}{Z}$ and $y_n = \frac{Y}{Z}$!
Normalized image coordinates represent the projection of the 3D point onto a fictitious canonical focal plane with unit focal length $f = 1$ and principal point at $(0, 0)$.

#### 3D Ray Back-Projection:
Because depth $Z$ was lost during projection, an isolated 2D pixel does not define a unique 3D point. Instead, it defines an infinite 3D **back-projection ray** emanating from the optical center $\mathbf{C} = [0, 0, 0]^\top$:
$$\mathbf{X}(Z) = Z \cdot \mathbf{x}_{\text{norm}} = Z \begin{bmatrix} \frac{u - c_x}{f_x} \\ \frac{v - c_y}{f_y} \\ 1 \end{bmatrix} \quad \text{for } Z > 0$$

---

## 5.4 Field of View (FOV) and Aspect Ratio

The **Field of View (FOV)** quantifies the angular extent of the observable physical scene visible through the camera sensor.

```
                         CAMERA FIELD OF VIEW GEOMETRY
                         
                                 Sensor Width W
                                 ◄────────────►
                          ┌──────────────────────────┐  Image Plane
                          │            .             │
                          │            |             │
                          │            + (c_x, c_y)  │
                          │            |             │
                          └────────────┼─────────────┘
                                       │
                                       │ Focal Length f_x
                                       │
                                       ▼
                                 Optical Center C
                                       /\
                                      /  \
                                     /    \
                                    / HFOV \
                                   /        \
```

Given an image of width $W$ pixels and height $H$ pixels, and focal parameters $(f_x, f_y, c_x, c_y)$:

1. **Horizontal Field of View (HFOV):**
   Assuming symmetric centering ($c_x = W / 2$):
   $$\tan\left(\frac{\text{HFOV}}{2}\right) = \frac{W / 2}{f_x} = \frac{W}{2 f_x} \implies \text{HFOV} = 2 \arctan\left(\frac{W}{2 f_x}\right)$$

2. **Vertical Field of View (VFOV):**
   Assuming symmetric centering ($c_y = H / 2$):
   $$\tan\left(\frac{\text{VFOV}}{2}\right) = \frac{H / 2}{f_y} = \frac{H}{2 f_y} \implies \text{VFOV} = 2 \arctan\left(\frac{H}{2 f_y}\right)$$

3. **Diagonal Field of View (DFOV):**
   With diagonal pixel sensor dimension $D = \sqrt{W^2 + H^2}$ and average focal length $f = \frac{f_x + f_y}{2}$:
   $$\text{DFOV} = 2 \arctan\left(\frac{\sqrt{W^2 + H^2}}{2 f}\right)$$

---

## 5.5 Non-Linear Optical Aberrations: The Brown-Conrady Distortion Model

A theoretical pinhole camera admits infinitely little light; practical robotic cameras require finite glass lenses to refract sufficient photon flux onto the sensor. However, real-world spherical glass lenses violate ideal rectilinear perspective projection, introducing non-linear geometric **lens distortion**.

```
                         TYPES OF RADIAL LENS DISTORTION
                         
          Ideal Grid              Barrel Distortion (k1 < 0)    Pincushion Distortion (k1 > 0)
       ┌───┬───┬───┬───┐               .───────────.                  ┌───┬───┬───┬───┐
       │   │   │   │   │              / ┌───┬───┐   \                 │\  │   │  /│
       ├───┼───┼───┼───┤             │  │   │   │    │                ├───┼───┼───┤
       │   │   │   │   │             │  ├───┼───┤    │                │   │   │   │
       ├───┼───┼───┼───┤             │  │   │   │    │                ├───┼───┼───┤
       │   │   │   │   │              \ └───┴───┘   /                 │/  │   │  \│
       └───┴───┴───┴───┘               '───────────'                  └───┴───┴───┴───┘
     (Straight lines remain         (Curved outwards:              (Curved inwards:
          straight)                  Wide-angle lenses)             Telephoto lenses)
```

The dominant physical model used in computer vision (formalized by Duane Brown in 1966 and Alexander Conrady in 1919) decomposes lens distortion into two physical phenomena: **radial distortion** and **tangential distortion**.

Let $(x_n, y_n)$ be the ideal, undistorted normalized coordinates:
$$x_n = \frac{X}{Z}, \quad y_n = \frac{Y}{Z}, \quad r^2 \triangleq x_n^2 + y_n^2$$

### 1. Radial Distortion
Radial distortion arises from the non-uniform curvature of spherical lenses: optical rays entering near the edge of the lens are bent more (or less) than rays entering near the optical center.
The radial displacement is modeled as an even Taylor series expansion in radial distance $r$:
$$x_{\text{rad}} = x_n \left( 1 + k_1 r^2 + k_2 r^4 + k_3 r^6 \right)$$
$$y_{\text{rad}} = y_n \left( 1 + k_1 r^2 + k_2 r^4 + k_3 r^6 \right)$$
where $k_1, k_2, k_3$ are the **radial distortion coefficients**.
- **Barrel Distortion ($k_1 < 0$):** Image magnification decreases with distance from the optical axis. Straight lines bow outwards (prevalent in wide-angle, drone, and fisheye lenses).
- **Pincushion Distortion ($k_1 > 0$):** Image magnification increases with distance from the optical axis. Straight lines bow inwards (prevalent in long-focal-length telephoto lenses).

### 2. Tangential Distortion
Tangential distortion occurs when the physical glass lens elements are not mounted strictly parallel to the silicon sensor die during manufacturing (**decentering aberration**):
$$x_{\text{tan}} = 2 p_1 x_n y_n + p_2 (r^2 + 2 x_n^2)$$
$$y_{\text{tan}} = p_1 (r^2 + 2 y_n^2) + 2 p_2 x_n y_n$$
where $p_1, p_2$ are the **tangential distortion coefficients**.

### The Complete Forward Distortion Model
Combining radial and tangential components yields the distorted normalized coordinates $(x_d, y_d)$:
$$\begin{bmatrix} x_d \\ y_d \end{bmatrix} = \begin{bmatrix} x_n (1 + k_1 r^2 + k_2 r^4 + k_3 r^6) + 2 p_1 x_n y_n + p_2 (r^2 + 2 x_n^2) \\ y_n (1 + k_1 r^2 + k_2 r^4 + k_3 r^6) + p_1 (r^2 + 2 y_n^2) + 2 p_2 x_n y_n \end{bmatrix}$$

Finally, projecting into distorted pixel coordinates:
$$u_d = f_x x_d + c_x$$
$$v_d = f_y y_d + c_y$$

The five-parameter vector $\mathbf{D} = [k_1, k_2, p_1, p_2, k_3]^\top$ completely parameterizes lens distortion.

### Image Undistortion and Backward Remapping
In autonomous robotics (visual odometry, SLAM, obstacle avoidance), downstream geometric algorithms assume perfect rectilinear pinhole geometry. Images must therefore be **undistorted** before processing.

Because the forward mapping $(x_n, y_n) \to (x_d, y_d)$ is non-linear and non-invertible in closed form, direct forward projection would leave holes (empty pixels) in the output. Instead, production systems perform **backward mapping**:
1. Iterate over every integer destination pixel $[u_{\text{rect}}, v_{\text{rect}}]$ in the undistorted output image.
2. Invert $\mathbf{K}$ to obtain ideal normalized coordinates: $x_n = \frac{u_{\text{rect}} - c_x}{f_x}$, $y_n = \frac{v_{\text{rect}} - c_y}{f_y}$.
3. Apply the forward distortion equations to find the exact continuous source coordinate in the raw camera frame: $(u_{\text{src}}, v_{\text{src}})$.
4. Sample pixel value from the raw distorted image using **bilinear interpolation**:
   $$I_{\text{undistorted}}[u_{\text{rect}}, v_{\text{rect}}] = \text{BilinearSample}(I_{\text{raw}}, u_{\text{src}}, v_{\text{src}})$$

---

## 5.6 Worked Examples

### Problem 5.1: Forward Perspective Projection Calculation
**Statement:** A robotic arm camera has focal lengths $f_x = 800.0\text{ pixels}$, $f_y = 800.0\text{ pixels}$, and principal point $(c_x, c_y) = (640.0, 360.0)$. The skew is $s = 0$.
A target object in camera coordinates is located at $\mathbf{X}_C = [1.2, -0.6, 3.0]^\top$ meters.
1. Write the $3 \times 3$ intrinsic matrix $\mathbf{K}$.
2. Compute the 2D pixel coordinates $(u, v)$ where the object projects.

**Step-by-step Solution:**
1. **Intrinsic Matrix $\mathbf{K}$:**
   $$\mathbf{K} = \begin{bmatrix} 800 & 0 & 640 \\ 0 & 800 & 360 \\ 0 & 0 & 1 \end{bmatrix}$$
2. **Projective Equation:**
   $$Z \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{K} \mathbf{X}_C = \begin{bmatrix} 800 & 0 & 640 \\ 0 & 800 & 360 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1.2 \\ -0.6 \\ 3.0 \end{bmatrix}$$
   Multiply matrix by vector:
   $$\begin{aligned}
   \begin{bmatrix} \tilde{u} \\ \tilde{v} \\ \tilde{w} \end{bmatrix} &= \begin{bmatrix} 800(1.2) + 0(-0.6) + 640(3.0) \\ 0(1.2) + 800(-0.6) + 360(3.0) \\ 0(1.2) + 0(-0.6) + 1(3.0) \end{bmatrix} \\
   &= \begin{bmatrix} 960 + 1920 \\ -480 + 1080 \\ 3.0 \end{bmatrix} = \begin{bmatrix} 2880.0 \\ 600.0 \\ 3.0 \end{bmatrix}
   \end{aligned}$$
3. **Cartesian Normalization (Division by Depth $Z = 3.0$):**
   $$u = \frac{2880.0}{3.0} = 960.0 \text{ pixels}$$
   $$v = \frac{600.0}{3.0} = 200.0 \text{ pixels}$$
   The target projects at pixel coordinate $(u, v) = (960.0, 200.0)$.

---

### Problem 5.2: Ray Back-Projection from Known Depth
**Statement:** Using the camera from Problem 5.1, an obstacle is detected at pixel $(u, v) = (480, 200)$. An onboard LiDAR rangefinder determines that the obstacle's depth is $Z = 2.5\text{ meters}$.
Compute the exact 3D position $\mathbf{X}_C = [X, Y, Z]^\top$ of the obstacle in the camera coordinate frame.

**Step-by-step Solution:**
1. Invert the projection equations:
   $$u = f_x \frac{X}{Z} + c_x \implies X = \frac{(u - c_x) Z}{f_x}$$
   $$v = f_y \frac{Y}{Z} + c_y \implies Y = \frac{(v - c_y) Z}{f_y}$$
2. Substitute parameters ($u = 480, v = 200, Z = 2.5, f_x = f_y = 800, c_x = 640, c_y = 360$):
   $$X = \frac{(480 - 640) \times 2.5}{800} = \frac{-160 \times 2.5}{800} = \frac{-400}{800} = -0.5\text{ meters}$$
   $$Y = \frac{(200 - 360) \times 2.5}{800} = \frac{-160 \times 2.5}{800} = -0.5\text{ meters}$$
   $$Z = 2.5\text{ meters}$$
   The 3D coordinate is $\mathbf{X}_C = [-0.5, -0.5, 2.5]^\top$ meters.

---

### Problem 5.3: Physical Sensor Specifications to Pixel Parameters
**Statement:** A computer vision camera utilizes a 1/2-inch CMOS sensor with active sensor width $W_{\text{mm}} = 6.4\text{ mm}$ and height $H_{\text{mm}} = 4.8\text{ mm}$. The resolution is $1920 \times 1440$ pixels. The attached C-mount lens has a physical focal length of $f = 12.0\text{ mm}$.
1. Calculate the horizontal and vertical pixel pitch $s_x$ and $s_y$ in micrometers ($\mu\text{m}$).
2. Compute the focal lengths in pixel units: $f_x$ and $f_y$.
3. Compute the horizontal and vertical fields of view (HFOV and VFOV) in degrees.

**Step-by-step Solution:**
1. **Pixel Pitch:**
   $$s_x = \frac{W_{\text{mm}}}{W_{\text{pixels}}} = \frac{6.4\text{ mm}}{1920} = \frac{0.0064\text{ m}}{1920} \approx 3.333 \times 10^{-6}\text{ m} = 3.333\,\mu\text{m}$$
   $$s_y = \frac{H_{\text{mm}}}{H_{\text{pixels}}} = \frac{4.8\text{ mm}}{1440} \approx 3.333 \times 10^{-6}\text{ m} = 3.333\,\mu\text{m}$$
   The sensor photosites are perfectly square: $s_x = s_y = 3.333\,\mu\text{m}$.

2. **Pixel Focal Lengths:**
   $$f_x = \frac{f}{s_x} = \frac{12.0\text{ mm}}{6.4 / 1920\text{ mm}} = 12.0 \times \frac{1920}{6.4} = 12.0 \times 300 = 3600.0\text{ pixels}$$
   $$f_y = \frac{f}{s_y} = \frac{12.0\text{ mm}}{4.8 / 1440\text{ mm}} = 12.0 \times \frac{1440}{4.8} = 12.0 \times 300 = 3600.0\text{ pixels}$$

3. **Field of View:**
   $$\text{HFOV} = 2 \arctan\left(\frac{W}{2 f_x}\right) = 2 \arctan\left(\frac{1920}{2 \times 3600}\right) = 2 \arctan\left(\frac{1920}{7200}\right) = 2 \arctan(0.26667)$$
   $$\arctan(0.26667) \approx 0.2606 \text{ rad} \approx 14.93^\circ \implies \text{HFOV} = 2 \times 14.93^\circ = 29.86^\circ$$
   $$\text{VFOV} = 2 \arctan\left(\frac{H}{2 f_y}\right) = 2 \arctan\left(\frac{1440}{7200}\right) = 2 \arctan(0.200) \approx 2 \times 11.31^\circ = 22.62^\circ$$

---

### Problem 5.4: Forward Radial Lens Distortion Application
**Statement:** A wide-angle camera has intrinsic parameters $f_x = f_y = 500.0$, $c_x = 320.0$, $c_y = 240.0$.
The radial distortion coefficients are $k_1 = -0.15$ and $k_2 = 0.05$. Tangential distortion is zero ($p_1 = p_2 = 0$).
An ideal 3D point has normalized coordinates $x_n = 0.6$ and $y_n = 0.8$.
1. Compute the radial distance squared $r^2$.
2. Compute the distorted normalized coordinates $(x_d, y_d)$.
3. Compute the final distorted pixel coordinates $(u_d, v_d)$ and compare them to the ideal undistorted pixel coordinates $(u, v)$.

**Step-by-step Solution:**
1. **Squared Radius:**
   $$r^2 = x_n^2 + y_n^2 = 0.6^2 + 0.8^2 = 0.36 + 0.64 = 1.00$$
   $$r^4 = (r^2)^2 = 1.00^2 = 1.00$$
2. **Radial Distortion Factor:**
   $$L(r) = 1 + k_1 r^2 + k_2 r^4 = 1 + (-0.15)(1.0) + (0.05)(1.0) = 1 - 0.15 + 0.05 = 0.90$$
   Compute distorted normalized coordinates:
   $$x_d = x_n \cdot L(r) = 0.6 \times 0.90 = 0.54$$
   $$y_d = y_n \cdot L(r) = 0.8 \times 0.90 = 0.72$$
3. **Pixel Coordinates:**
   - **Distorted Pixel $(u_d, v_d)$:**
     $$u_d = f_x x_d + c_x = 500(0.54) + 320 = 270 + 320 = 590.0$$
     $$v_d = f_y y_d + c_y = 500(0.72) + 240 = 360 + 240 = 600.0$$
   - **Ideal Undistorted Pixel $(u, v)$:**
     $$u = f_x x_n + c_x = 500(0.6) + 320 = 300 + 320 = 620.0$$
     $$v = f_y y_n + c_y = 500(0.8) + 240 = 400 + 240 = 640.0$$
   Notice that the distorted pixel $(590, 600)$ is pulled inwards toward the principal point $(320, 240)$ relative to $(620, 640)$ by $(30, 40)$ pixels, which is the hallmark of barrel distortion ($k_1 < 0$).

---

### Problem 5.5: Inverting Radial Distortion via Newton-Raphson Iteration
**Statement:** Given the radial distortion model $r_d = r_n (1 + k_1 r_n^2)$ with $k_1 = -0.1$, a detected feature has distorted radius $r_d = 0.45$.
Using the Newton-Raphson numerical root-finding algorithm with initial estimate $r_0 = r_d = 0.45$, compute the undistorted radius $r_n$ to 4 decimal places.

**Step-by-step Solution:**
1. Formulate the root-finding function:
   $$f(r) = r(1 + k_1 r^2) - r_d = r - 0.1 r^3 - 0.45 = 0$$
2. Compute the derivative:
   $$f'(r) = 1 - 3(0.1) r^2 = 1 - 0.3 r^2$$
3. **Iteration 1:**
   $$r_0 = 0.45$$
   $$f(r_0) = 0.45 - 0.1(0.45)^3 - 0.45 = -0.1(0.091125) = -0.0091125$$
   $$f'(r_0) = 1 - 0.3(0.45)^2 = 1 - 0.3(0.2025) = 1 - 0.06075 = 0.93925$$
   $$r_1 = r_0 - \frac{f(r_0)}{f'(r_0)} = 0.45 - \frac{-0.0091125}{0.93925} = 0.45 + 0.0097019 = 0.459702$$
4. **Iteration 2:**
   $$r_1 = 0.459702$$
   $$f(r_1) = 0.459702 - 0.1(0.459702)^3 - 0.45 = 0.459702 - 0.009715 - 0.45 = -0.000013$$
   $$f'(r_1) = 1 - 0.3(0.459702)^2 = 1 - 0.3(0.211326) = 1 - 0.063398 = 0.936602$$
   $$r_2 = 0.459702 - \frac{-0.000013}{0.936602} = 0.459702 + 0.000014 = 0.459716 \approx 0.4597$$
   After just 2 iterations, the undistorted radius converges to $r_n \approx 0.4597$.

---

### Problem 5.6: Perspective Shrinkage and Metric Distance Estimation
**Statement:** A mobile robot follows a lead robot with a known physical bumper width of $W_{\text{real}} = 0.8\text{ meters}$. The camera has focal length $f_x = 1000\text{ pixels}$.
In the captured frame, the bumper spans from pixel $u_1 = 350$ to $u_2 = 750$.
1. Compute the pixel width $w_{\text{pix}}$ of the bumper.
2. Assuming the bumper is oriented perpendicular to the optical axis, compute the forward metric distance $Z$ to the lead robot.

**Step-by-step Solution:**
1. Pixel width:
   $$w_{\text{pix}} = u_2 - u_1 = 750 - 350 = 400\text{ pixels}$$
2. By the perspective projection formula for a horizontal span $\Delta X$ at depth $Z$:
   $$w_{\text{pix}} = f_x \frac{\Delta X}{Z}$$
3. Rearranging for metric depth $Z$:
   $$Z = \frac{f_x \cdot \Delta X}{w_{\text{pix}}} = \frac{f_x \cdot W_{\text{real}}}{w_{\text{pix}}}$$
4. Substituting values:
   $$Z = \frac{1000\text{ pixels} \times 0.8\text{ meters}}{400\text{ pixels}} = \frac{800}{400} = 2.0\text{ meters}$$
   The lead robot is located at a distance of $2.0\text{ meters}$.

---

### Problem 5.7: Thin Lens Equation vs. Pinhole Model
**Statement:** A camera lens with focal length $F = 50\text{ mm}$ is focused on an object located at distance $d_o = 2.0\text{ meters}$ ($2000\text{ mm}$).
1. Using the thin lens equation $\frac{1}{F} = \frac{1}{d_o} + \frac{1}{d_i}$, compute the exact distance $d_i$ from the lens center to the sensor plane.
2. If the sensor is fixed at $d_i = 51.282\text{ mm}$ and a second object appears at $d_o' = 5.0\text{ meters}$ ($5000\text{ mm}$), compute the displacement of its focal plane $\Delta d_i$.

**Step-by-step Solution:**
1. **Thin Lens Formula for First Object:**
   $$\frac{1}{d_i} = \frac{1}{F} - \frac{1}{d_o} = \frac{1}{50} - \frac{1}{2000} = \frac{40 - 1}{2000} = \frac{39}{2000}$$
   $$d_i = \frac{2000}{39} \approx 51.282\text{ mm}$$
   The sensor must be placed $51.282\text{ mm}$ behind the lens ($1.282\text{ mm}$ further back than $F$).
2. **Second Object at $5000\text{ mm}$:**
   $$\frac{1}{d_i'} = \frac{1}{50} - \frac{1}{5000} = \frac{100 - 1}{5000} = \frac{99}{5000}$$
   $$d_i' = \frac{5000}{99} \approx 50.505\text{ mm}$$
3. **Displacement:**
   $$\Delta d_i = d_i' - d_i = 50.505 - 51.282 = -0.777\text{ mm}$$
   Because the rays converge $0.777\text{ mm}$ in front of the sensor plane, this second object will form a blurred circle of confusion (defocus blur). The pinhole camera model avoids this by assuming an infinitesimally small aperture with infinite depth of field.

---

### Problem 5.8: Tangential Distortion Calculation
**Statement:** A camera exhibits severe sensor tilt yielding tangential distortion parameters $p_1 = 0.01$ and $p_2 = -0.02$. Radial distortion is zero.
Compute the tangential coordinate shifts $(\delta x_{\text{tan}}, \delta y_{\text{tan}})$ at normalized coordinates $(x_n, y_n) = (0.5, 0.5)$.

**Step-by-step Solution:**
1. Compute squared radius and terms:
   $$r^2 = x_n^2 + y_n^2 = 0.5^2 + 0.5^2 = 0.25 + 0.25 = 0.5$$
   $$x_n y_n = (0.5)(0.5) = 0.25$$
   $$r^2 + 2 x_n^2 = 0.5 + 2(0.25) = 0.5 + 0.5 = 1.0$$
   $$r^2 + 2 y_n^2 = 0.5 + 2(0.25) = 1.0$$
2. Evaluate tangential equations:
   $$\begin{aligned}
   \delta x_{\text{tan}} &= 2 p_1 x_n y_n + p_2 (r^2 + 2 x_n^2) \\
   &= 2(0.01)(0.25) + (-0.02)(1.0) \\
   &= 0.005 - 0.02 = -0.015
   \end{aligned}$$
   $$\begin{aligned}
   \delta y_{\text{tan}} &= p_1 (r^2 + 2 y_n^2) + 2 p_2 x_n y_n \\
   &= (0.01)(1.0) + 2(-0.02)(0.25) \\
   &= 0.01 - 0.01 = 0.000
   \end{aligned}$$
   The tangential aberration shifts normalized $x$ by $-0.015$ and leaves normalized $y$ unaffected.

---

### Problem 5.9: Horizon Line and Ground Plane Geometry
**Statement:** A mobile robot camera is mounted at height $h = 1.5\text{ meters}$ above the ground, oriented with zero tilt (optical axis parallel to the flat ground). Intrinsic parameters are $f_y = 1000\text{ pixels}$ and $c_y = 500\text{ pixels}$.
1. Find the pixel row $v_{\text{horizon}}$ where the ground plane horizon line appears in the image.
2. For an obstacle resting on the ground at pixel row $v = 800$, compute its ground forward distance $Z$.

**Step-by-step Solution:**
1. **Horizon Line Location:**
   Points on the ground have camera $Y$-coordinate $Y = +h = 1.5\text{ meters}$ (since positive $Y$ points down in the camera frame).
   The ground plane projects as:
   $$v(Z) = f_y \frac{Y}{Z} + c_y = f_y \frac{h}{Z} + c_y$$
   As distance $Z \to \infty$:
   $$v_{\text{horizon}} = \lim_{Z \to \infty} \left( f_y \frac{h}{Z} + c_y \right) = 0 + c_y = c_y = 500\text{ pixels}$$
   The horizon coincides exactly with the principal point row $v = 500$.

2. **Distance Estimation from Contact Row $v = 800$:**
   $$v - c_y = f_y \frac{h}{Z} \implies Z = \frac{f_y \cdot h}{v - c_y}$$
   Substitute values ($h = 1.5, f_y = 1000, v = 800, c_y = 500$):
   $$Z = \frac{1000 \times 1.5}{800 - 500} = \frac{1500}{300} = 5.0\text{ meters}$$
   Any obstacle touching the ground at pixel row $v = 800$ is exactly $5.0\text{ meters}$ ahead!

---

### Problem 5.10: Vanishing Point of a 3D Direction Vector
**Statement:** A robot camera with intrinsic matrix $\mathbf{K} = \begin{bmatrix} 600 & 0 & 320 \\ 0 & 600 & 240 \\ 0 & 0 & 1 \end{bmatrix}$ observes a set of parallel railroad tracks whose 3D direction vector in the camera frame is $\mathbf{d} = [0.4, 0.3, 0.866]^\top$.
Compute the 2D pixel coordinates $\mathbf{v}_{\infty} = (u_\infty, v_\infty)$ of the tracks' vanishing point.

**Step-by-step Solution:**
1. A 3D line passing through anchor $\mathbf{X}_0$ with direction $\mathbf{d} = [d_X, d_Y, d_Z]^\top$ is parameterized as $\mathbf{X}(\lambda) = \mathbf{X}_0 + \lambda \mathbf{d}$.
2. As $\lambda \to \infty$, $\mathbf{X}(\lambda) \to \lambda \mathbf{d}$.
   The perspective projection of points at infinity is:
   $$\tilde{\mathbf{v}}_\infty \propto \mathbf{K} \mathbf{d}$$
3. Matrix-vector multiplication:
   $$\mathbf{K} \mathbf{d} = \begin{bmatrix} 600 & 0 & 320 \\ 0 & 600 & 240 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.4 \\ 0.3 \\ 0.866 \end{bmatrix} = \begin{bmatrix} 600(0.4) + 320(0.866) \\ 600(0.3) + 240(0.866) \\ 0.866 \end{bmatrix} = \begin{bmatrix} 240 + 277.12 \\ 180 + 207.84 \\ 0.866 \end{bmatrix} = \begin{bmatrix} 517.12 \\ 387.84 \\ 0.866 \end{bmatrix}$$
4. Convert from homogeneous to Cartesian coordinates by dividing by the third element:
   $$u_\infty = \frac{517.12}{0.866} \approx 597.14\text{ pixels}$$
   $$v_\infty = \frac{387.84}{0.866} \approx 447.85\text{ pixels}$$
   The parallel tracks converge to the vanishing point $(597.14, 447.85)$.

---

## 5.7 Solved Exercises

### Exercise 5.1: Invariance of Vanishing Point to World Line Position
**Statement:** Prove algebraically that the 2D vanishing point of a 3D line depends *only* on its 3D direction vector $\mathbf{d}$ and is completely independent of the line's spatial origin or offset $\mathbf{X}_0$.

**Solution:**
1. Let $\mathcal{L}$ be a 3D line parameterized by $\mathbf{X}(\lambda) = \mathbf{X}_0 + \lambda \mathbf{d}$, where $\mathbf{X}_0 \in \mathbb{R}^3$, $\mathbf{d} = [d_X, d_Y, d_Z]^\top \in \mathbb{R}^3$ with $d_Z > 0$, and $\lambda \in [0, \infty)$.
2. The perspective projection onto normalized image coordinates $(x_n, y_n)$ is:
   $$x_n(\lambda) = \frac{X(\lambda)}{Z(\lambda)} = \frac{X_0 + \lambda d_X}{Z_0 + \lambda d_Z}$$
   $$y_n(\lambda) = \frac{Y(\lambda)}{Z(\lambda)} = \frac{Y_0 + \lambda d_Y}{Z_0 + \lambda d_Z}$$
3. Take the limit as distance $\lambda \to \infty$:
   $$\lim_{\lambda \to \infty} x_n(\lambda) = \lim_{\lambda \to \infty} \frac{\frac{X_0}{\lambda} + d_X}{\frac{Z_0}{\lambda} + d_Z} = \frac{0 + d_X}{0 + d_Z} = \frac{d_X}{d_Z}$$
   $$\lim_{\lambda \to \infty} y_n(\lambda) = \lim_{\lambda \to \infty} \frac{\frac{Y_0}{\lambda} + d_Y}{\frac{Z_0}{\lambda} + d_Z} = \frac{0 + d_Y}{0 + d_Z} = \frac{d_Y}{d_Z}$$
4. Mapping to pixel coordinates via $\mathbf{K}$:
   $$u_\infty = f_x \frac{d_X}{d_Z} + c_x, \quad v_\infty = f_y \frac{d_Y}{d_Z} + c_y$$
   Notice that $\mathbf{X}_0 = [X_0, Y_0, Z_0]^\top$ has vanished entirely from the expressions.
   All parallel lines sharing direction vector $\mathbf{d}$ project to the exact same vanishing point $\mathbf{v}_\infty$. $\blacksquare$

---

### Exercise 5.2: Invertibility of the Camera Intrinsic Matrix
**Statement:** Prove that the camera intrinsic calibration matrix $\mathbf{K} = \begin{bmatrix} f_x & s & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$ is always invertible for physical cameras, and write the closed-form algebraic inverse $\mathbf{K}^{-1}$.

**Solution:**
1. The determinant of an upper-triangular matrix is the product of its diagonal elements:
   $$\det(\mathbf{K}) = f_x \cdot f_y \cdot 1 = f_x f_y$$
2. For any physical optical sensor, the focal lengths in pixels are strictly non-zero and positive ($f_x > 0, f_y > 0$).
   Therefore, $\det(\mathbf{K}) = f_x f_y > 0 \neq 0$.
   Because the determinant is strictly non-zero, $\mathbf{K}$ is non-singular and guaranteed to be invertible for all physical cameras.
3. Compute the algebraic inverse using row reduction or adjugate matrix:
   $$\mathbf{K}^{-1} = \begin{bmatrix} \frac{1}{f_x} & -\frac{s}{f_x f_y} & \frac{s c_y - f_y c_x}{f_x f_y} \\[4pt] 0 & \frac{1}{f_y} & -\frac{c_y}{f_y} \\[4pt] 0 & 0 & 1 \end{bmatrix}$$
   When the skew $s = 0$ (standard across modern computer vision):
   $$\mathbf{K}^{-1} = \begin{bmatrix} \frac{1}{f_x} & 0 & -\frac{c_x}{f_x} \\[4pt] 0 & \frac{1}{f_y} & -\frac{c_y}{f_y} \\[4pt] 0 & 0 & 1 \end{bmatrix} \quad \blacksquare$$

---

### Exercise 5.3: Sensor Cropping vs. Digital Zoom Effects on Intrinsics
**Statement:** An original $3840 \times 2160$ image captured with intrinsic matrix $\mathbf{K}$ undergoes a central $2\times$ digital crop, extracting the central $1920 \times 1080$ sub-region.
Derive the modified intrinsic matrix $\mathbf{K}_{\text{crop}}$ for the cropped image buffer.

**Solution:**
1. In the original image, let a pixel have coordinates $(u, v)$.
   The crop window has size $W_{\text{crop}} = 1920$ and $H_{\text{crop}} = 1080$.
   The top-left corner of the crop window is at:
   $$u_{\text{offset}} = \frac{3840 - 1920}{2} = 960\text{ pixels}$$
   $$v_{\text{offset}} = \frac{2160 - 1080}{2} = 540\text{ pixels}$$
2. The coordinate mapping from original pixels $(u, v)$ to cropped image buffer pixels $(u', v')$ is:
   $$u' = u - u_{\text{offset}} = u - 960$$
   $$v' = v - v_{\text{offset}} = v - 540$$
3. Original projection:
   $$u = f_x \frac{X}{Z} + c_x, \quad v = f_y \frac{Y}{Z} + c_y$$
   Substituting into cropped coordinates:
   $$u' = f_x \frac{X}{Z} + (c_x - 960)$$
   $$v' = f_y \frac{Y}{Z} + (c_y - 540)$$
4. The focal lengths $f_x, f_y$ and skew $s$ are **completely unchanged** because the physical optics and pixel pitch have not changed!
   Only the principal point shifts:
   $$c_x' = c_x - 960, \quad c_y' = c_y - 540$$
   Therefore:
   $$\mathbf{K}_{\text{crop}} = \begin{bmatrix} f_x & s & c_x - 960 \\ 0 & f_y & c_y - 540 \\ 0 & 0 & 1 \end{bmatrix} \quad \blacksquare$$

---

### Exercise 5.4: Downsampling / Binning Effects on Intrinsics
**Statement:** An image is downsampled by a factor of 2 in both dimensions using $2 \times 2$ pixel binning ($W' = W/2, H' = H/2$). Derive the updated intrinsic matrix $\mathbf{K}_{\text{bin}}$.

**Solution:**
1. Pixel binning groups $2 \times 2$ neighboring photodiodes into a single effective pixel.
   The effective pixel pitch doubles:
   $$s_x' = 2 s_x, \quad s_y' = 2 s_y$$
2. Because $f_x = \frac{f}{s_x}$ and $f_y = \frac{f}{s_y}$, doubling the pitch halves the pixel focal lengths:
   $$f_x' = \frac{f}{2 s_x} = \frac{f_x}{2}, \quad f_y' = \frac{f}{2 s_y} = \frac{f_y}{2}$$
3. The principal point coordinates in the downscaled image scale by $0.5$:
   $$c_x' = \frac{c_x}{2}, \quad c_y' = \frac{c_y}{2}$$
4. Thus, the new intrinsic matrix is obtained by scaling the first two rows of $\mathbf{K}$ by $0.5$:
   $$\mathbf{K}_{\text{bin}} = \begin{bmatrix} 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \\ 0 & 0 & 1 \end{bmatrix} \mathbf{K} = \begin{bmatrix} \frac{f_x}{2} & \frac{s}{2} & \frac{c_x}{2} \\[4pt] 0 & \frac{f_y}{2} & \frac{c_y}{2} \\[4pt] 0 & 0 & 1 \end{bmatrix} \quad \blacksquare$$

---

### Exercise 5.5: Proof of Pinhole Projection Preserving Collinearity
**Statement:** Prove that the ideal pinhole perspective projection maps any straight 3D line in space onto a straight 2D line on the image plane.

**Solution:**
1. A straight line $\mathcal{L}$ in 3D camera space is defined by the set of points:
   $$\mathcal{L} = \{ \mathbf{X} \in \mathbb{R}^3 \mid \mathbf{X} = \mathbf{A} + \lambda \mathbf{B}, \, \lambda \in \mathbb{R} \}$$
2. All rays connecting the camera optical center $\mathbf{C} = (0, 0, 0)$ to points on line $\mathcal{L}$ form a planar sheet in 3D space:
   $$\Pi = \{ \mathbf{P} \in \mathbb{R}^3 \mid \mathbf{P} = \alpha \mathbf{A} + \beta \mathbf{B}, \, \alpha, \beta \in \mathbb{R} \}$$
   This plane passes through the origin $(0, 0, 0)$.
3. The image plane is a 2D affine hyperplane in 3D space defined by the equation $Z = f$.
4. The perspective projection of line $\mathcal{L}$ is the geometric intersection of the projection plane $\Pi$ with the image plane $Z = f$:
   $$\mathcal{L}_{\text{proj}} = \Pi \cap \{ \mathbf{X} \in \mathbb{R}^3 \mid Z = f \}$$
5. The intersection of two distinct non-parallel planes in 3D Euclidean space is always a 1D Euclidean line.
   Therefore, $\mathcal{L}_{\text{proj}}$ is strictly a straight line on the image plane. $\blacksquare$

---

### Exercise 5.6: Conic Sections Under Perspective Projection
**Statement:** If perspective projection maps 3D lines to 2D lines, what 2D geometric curves does a 3D circle project onto? State the conditions under which a 3D circle projects as an ellipse, parabola, or hyperbola.

**Solution:**
1. Let $\mathcal{C}$ be a 3D circle in space. All projection rays passing from the optical center $\mathbf{C}$ through the perimeter of $\mathcal{C}$ form an oblique right-circular cone with apex at $\mathbf{C}$.
2. The projected image is the intersection of this 3D cone with the planar image surface $Z = f$.
3. By the classical definition of conic sections (Apollonius of Perga), the intersection of a circular cone with a plane generates a **conic section**:
   - **Ellipse:** If the image plane cuts entirely through one nappe of the cone (the circle lies strictly in front of the camera plane, with no point on $\mathcal{C}$ having $Z \le 0$). In typical photographic settings, all 3D circles project as ellipses.
   - **Parabola:** If the image plane is parallel to a generator ray of the cone (the plane of the circle passes through the camera center).
   - **Hyperbola:** If the image plane intersects both nappes of the cone (parts of the circle extend behind the camera aperture $Z < 0$).

---

### Exercise 5.7: Degrees of Freedom in the Camera Intrinsic Matrix
**Statement:** State the total number of degrees of freedom (DoF) in an unconstrained camera intrinsic matrix $\mathbf{K}$, and identify the physical meaning of each parameter.

**Solution:**
An unconstrained camera intrinsic matrix $\mathbf{K} \in \mathbb{R}^{3 \times 3}$ has **5 degrees of freedom**:
$$\mathbf{K} = \begin{bmatrix} f_x & s & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}$$
1. $f_x$: Horizontal focal length in pixels (accounts for physical focal length $f$ and horizontal pixel width $s_x$).
2. $f_y$: Vertical focal length in pixels (accounts for physical focal length $f$ and vertical pixel height $s_y$).
3. $c_x$: Horizontal coordinate of the principal point (piercing point of optical axis on sensor).
4. $c_y$: Vertical coordinate of the principal point.
5. $s$: Skew parameter ($s = f_x \cot\theta_{\text{pixel}}$), which models the non-orthogonality between the sensor's row and column axes. In virtually all modern sensors, $s = 0$, reducing the active parameters to 4 DoF.

---

### Exercise 5.8: Fisheye Equidistant Projection Model
**Statement:** For ultra-wide-angle fisheye lenses with $\text{FOV} \ge 180^\circ$, the standard perspective pinhole model ($r = f \tan\theta$) fails because $\tan(90^\circ) = \infty$.
State the **equidistant** fisheye projection model and calculate the image radius $r$ for an incoming ray at angle $\theta = 60^\circ$ with $f = 3.0\text{ mm}$.

**Solution:**
1. In fisheye lenses, optics are deliberately engineered to satisfy non-perspective mappings:
   - **Equidistant projection:**
     $$r = f \cdot \theta$$
     where $\theta$ is the incident angle in radians between the incoming ray and the optical axis.
2. Given parameters: $f = 3.0\text{ mm}$ and $\theta = 60^\circ$.
   Convert $\theta$ to radians:
   $$\theta = 60^\circ \times \frac{\pi}{180^\circ} = \frac{\pi}{3} \approx 1.0472 \text{ rad}$$
3. Compute image radius:
   $$r = 3.0\text{ mm} \times 1.0472 = 3.1416\text{ mm}$$
   Under standard perspective projection, $r_{\text{persp}} = 3.0 \tan(60^\circ) = 3.0 \times \sqrt{3} \approx 5.196\text{ mm}$. The equidistant fisheye compresses peripheral rays, keeping the entire hemisphere within a finite image radius.

---

### Exercise 5.9: Bilinear Interpolation Formula for Remapping
**Statement:** In backward lens undistortion, a target pixel maps to a non-integer source location $(u_s, v_s) = (14.3, 22.7)$. Write the explicit 4-point bilinear interpolation formula to evaluate $I(14.3, 22.7)$ from the discrete grid values.

**Solution:**
1. Let $(x, y) = (14.3, 22.7)$.
   Compute the bounding integer grid coordinates:
   $$x_1 = \lfloor 14.3 \rfloor = 14, \quad x_2 = x_1 + 1 = 15$$
   $$y_1 = \lfloor 22.7 \rfloor = 22, \quad y_2 = y_1 + 1 = 23$$
2. Compute the fractional offsets:
   $$\alpha = x - x_1 = 14.3 - 14 = 0.3$$
   $$\beta = y - y_1 = 22.7 - 22 = 0.7$$
3. The bilinear interpolation formula expresses the intensity as the weighted sum of the four surrounding corner pixels:
   $$\begin{aligned}
   I(x, y) &= (1 - \alpha)(1 - \beta) \, I[y_1, x_1] + \alpha(1 - \beta) \, I[y_1, x_2] \\
   &\quad + (1 - \alpha)\beta \, I[y_2, x_1] + \alpha \beta \, I[y_2, x_2]
   \end{aligned}$$
4. Substituting the fractional weights:
   - Top-left $(14, 22)$: $(1 - 0.3)(1 - 0.7) = (0.7)(0.3) = 0.21$
   - Top-right $(15, 22)$: $(0.3)(1 - 0.7) = (0.3)(0.3) = 0.09$
   - Bottom-left $(14, 23)$: $(1 - 0.3)(0.7) = (0.7)(0.7) = 0.49$
   - Bottom-right $(15, 23)$: $(0.3)(0.7) = 0.21$
   $$I(14.3, 22.7) = 0.21 \, I[22, 14] + 0.09 \, I[22, 15] + 0.49 \, I[23, 14] + 0.21 \, I[23, 15] \quad \blacksquare$$

---

### Exercise 5.10: Depth Ambiguity of Pure 2D Dilations
**Statement:** Prove that multiplying a 3D scene point's coordinates by a scalar $c > 0$ ($\mathbf{X}' = c \mathbf{X}$) produces no change in its projected 2D image coordinate under ideal perspective projection.

**Solution:**
1. Let $\mathbf{X} = [X, Y, Z]^\top$ be a 3D point with $Z > 0$.
   Its projected pixel coordinates are:
   $$u = f_x \frac{X}{Z} + c_x, \quad v = f_y \frac{Y}{Z} + c_y$$
2. Scale the 3D point by scalar $c > 0$:
   $$\mathbf{X}' = \begin{bmatrix} X' \\ Y' \\ Z' \end{bmatrix} = \begin{bmatrix} c X \\ c Y \\ c Z \end{bmatrix}$$
3. Compute the projection of $\mathbf{X}'$:
   $$u' = f_x \frac{X'}{Z'} + c_x = f_x \frac{c X}{c Z} + c_x = f_x \frac{X}{Z} + c_x = u$$
   $$v' = f_y \frac{Y'}{Z'} + c_y = f_y \frac{c Y}{c Z} + c_y = f_y \frac{Y}{Z} + c_y = v$$
4. Therefore, $(u', v') = (u, v)$ for all $c > 0$.
   This proves that a small object close to the camera projects to the exact same pixel footprint as a gigantic object proportionally far away (**the fundamental scale-depth ambiguity of monocular computer vision**). $\blacksquare$
