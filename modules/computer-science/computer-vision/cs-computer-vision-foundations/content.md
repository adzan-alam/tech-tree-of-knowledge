# Computer Vision: Convolutions, Camera Geometry, and Visual Perception

---

## 1. The Epistemological Challenge: How Does an AI "See"?

### 1.1 The Semantic Gap
To a biological brain, glancing at a room reveals tables, humans, chairs, and doors with instantaneous clarity.

To a digital computer, an image is nothing more than a **two-dimensional grid of numbers** (pixel intensity integers from $0$ to $255$ for red, green, and blue):
$$ I \in \mathbb{R}^{H \times W \times 3} $$
A $1920 \times 1080$ color frame contains **6,220,800 raw numbers**. If a chair shifts by two inches, or the sun passes behind a cloud, millions of these numbers change drastically, yet the physical identity of the chair remains completely identical.

Bridging this divide—translating arrays of photons and numbers into structured spatial concepts—is the mission of **Computer Vision**.

### 1.2 Biological Inspiration: The Discovery of Hubel & Wiesel (1959)
In 1959, David Hubel and Torsten Wiesel recorded the electrical activity of individual neurons in a cat's visual cortex. They discovered that visual neurons do not respond to raw diffuse light. Instead, they act as **spatial filters**:
- **Simple cells** fire only when a high-contrast edge or bar of light at a specific angle ($\theta$) passes across a tiny region of the visual field (**receptive field**).
- **Complex cells** combine outputs from simple cells to detect motion and spatial orientation invariantly.

This hierarchical architecture—building complex spatial understanding from low-level local contrast filters—inspired both classical image filtering and modern **Convolutional Neural Networks (CNNs)**.

---

## 2. Spatial Convolutions & Image Filtering

### 2.1 The 2D Discrete Convolution Operator
A convolution slides a small matrix of weights called a **kernel** (or filter) $K$ of size $(2k+1) \times (2k+1)$ over an image $I$:

$$ \mathbf{(I * K)(x, y) = \sum_{u=-k}^k \sum_{v=-k}^k I(x - u, y - v) K(u, v)} $$
At every pixel $(x, y)$, the output is the sum of local neighboring pixels weighted by the kernel entries.

### 2.2 Gaussian Blurring (Noise Suppression)
High-frequency sensor noise corrupts differentiation. We smooth the image using a 2D Gaussian kernel:
$$ G(x, y) = \frac{1}{2\pi \sigma^2} \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right) $$

```
   1   ┌  1   4   7   4   1 ┐
  ───  │  4  16  26  16   4 │  (5x5 Discrete Gaussian Smoothing Kernel)
  273  │  7  26  41  26   7 │
       │  4  16  26  16   4 │
       └  1   4   7   4   1 ┘
```

---

## 3. Edge Detection: Image Gradients & The Sobel Filter

Edges represent physical boundaries: surface creases, object silhouettes, and material transitions where light intensity changes abruptly.

### 3.1 The Spatial Image Gradient ($\nabla I$)
Treating the discrete image $I(x, y)$ as a 2D continuous scalar field, its gradient vector is:
$$ \nabla I = \begin{bmatrix} \frac{\partial I}{\partial x} \\ \frac{\partial I}{\partial y} \end{bmatrix} = \begin{bmatrix} G_x \\ G_y \end{bmatrix} $$

1. **Gradient Magnitude (Edge Strength):**
   $$ \|\nabla I\| = \sqrt{G_x^2 + G_y^2} $$
2. **Gradient Direction (Perpendicular to Edge):**
   $$ \theta = \text{atan2}(G_y, G_x) $$

### 3.2 The Sobel Discrete Operators
The **Sobel kernels** estimate horizontal and vertical partial derivatives using central differences while performing Gaussian smoothing along the transverse axis:

$$ K_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix}, \quad K_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ +1 & +2 & +1 \end{bmatrix} $$

```
  Input Pixel Patch:             Sobel X Kernel:           Horizontal Gradient G_x:
  ┌  50   50  200 ┐             ┌ -1   0  +1 ┐             (-50 + 200) + 
  │  50   50  200 │     *       │ -2   0  +2 │      =      2*(-50 + 200) + 
  └  50   50  200 ┘             └ -1   0  +1 ┘             (-50 + 200) = +600!
  (Sharp vertical edge)                                   (Strong edge detected!)
```

---

## 4. Convolutional Neural Networks (CNNs)

In fully connected networks, a $1000 \times 1000$ image connected to a 1000-neuron layer requires $10^9$ weights—overwhelming memory.  
**Convolutional Neural Networks (CNNs)** enforce two powerful geometric inductive biases:

1. **Local Connectivity:** Each hidden neuron connects only to a small local receptive field ($3 \times 3$ or $5 \times 5$ pixels).
2. **Weight Sharing (Translation Equivariance):** The *exact same* kernel weights are swept across every patch of the image:
   $$ f(T_x(I)) = T_x(f(I)) $$
   If a feature detector learns to identify an edge or cat ear in the top-left corner, it can instantly recognize that same feature anywhere in the frame without retraining!

---

## 5. Pinhole Camera Geometry & Perspective Projection

How does a 3D physical world point $\vec{P}_{\text{world}} = (X, Y, Z)$ project onto a 2D digital camera sensor pixel $(u, v)$?

```
            Y_c ^         Scene Point P(X, Y, Z)
                |              ●
                |             /|
                |            / |
  Image Plane   |           /  |
    ┌───────┐   |          /   |
    │   ● p │   |         /    |
    └───┼───┘   |        /     |
        |       |       /      |
        +-------+------+-------+-------------------> Z_c (Optical Axis)
     Pinhole    O_c
     (Focal length f)
```

### 5.1 The Pinhole Model: Similar Triangles
By Euclidean similar triangles:
$$ \frac{x_{\text{sensor}}}{f} = \frac{X_c}{Z_c} \implies x_{\text{sensor}} = f \frac{X_c}{Z_c} $$
$$ \frac{y_{\text{sensor}}}{f} = \frac{Y_c}{Z_c} \implies y_{\text{sensor}} = f \frac{Y_c}{Z_c} $$
*Key Insight:* Depth $Z_c$ appears in the denominator! Objects further away appear strictly smaller in direct proportion to $\frac{1}{Z_c}$.

### 5.2 The Intrinsic Camera Calibration Matrix ($K$)
To convert metric sensor coordinates $(x_{\text{sensor}}, y_{\text{sensor}})$ into integer pixel indices $(u, v)$:
$$ u = f_x \frac{X_c}{Z_c} + c_x, \quad v = f_y \frac{Y_c}{Z_c} + c_y $$
where:
- $f_x, f_y$: Focal lengths in pixel units ($f \times \text{pixels/meter}$).
- $c_x, c_y$: **Principal Point** (pixel coordinates where optical axis pierces the sensor, typically image center $\approx W/2, H/2$).

In homogeneous matrix notation:
$$ \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} \sim \mathbf{K \begin{bmatrix} X_c \\ Y_c \\ Z_c \end{bmatrix}}, \quad \text{where } \mathbf{K = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}} $$

### 5.3 Extrinsic Matrix: World to Camera Coordinates
A robot camera is attached to a moving chassis or drone at world pose $[R \mid \vec{t}]$.  
Transforming world point $\vec{P}_w$ to camera frame $\vec{P}_c$:
$$ \vec{P}_c = R \vec{P}_w + \vec{t} $$

The complete camera projection mapping is:
$$ \mathbf{\tilde{p}_{\text{pixel}} \sim K [R \mid \vec{t}] \tilde{P}_{\text{world}}} $$

---

## 6. Multi-Tiered Worked Examples

### Level 1: Calculating Sobel Horizontal and Vertical Gradients
A $3 \times 3$ grayscale image patch is:
$$ I = \begin{bmatrix} 10 & 10 & 90 \\ 10 & 20 & 90 \\ 10 & 10 & 90 \end{bmatrix} $$
Calculate the horizontal gradient $G_x$, vertical gradient $G_y$, and total gradient magnitude $\|\nabla I\|$ at the center pixel.

**Step-by-step Solution:**
1. Horizontal Sobel kernel:
   $$ K_x = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix} $$
   $$ G_x = (-1)(10) + (0)(10) + (1)(90) + (-2)(10) + (0)(20) + (2)(90) + (-1)(10) + (0)(10) + (1)(90) $$
   $$ G_x = -10 + 90 - 20 + 180 - 10 + 90 = \mathbf{+320} $$
2. Vertical Sobel kernel:
   $$ K_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{bmatrix} $$
   $$ G_y = (-1)(10) + (-2)(10) + (-1)(90) + (0) + (1)(10) + (2)(10) + (1)(90) $$
   $$ G_y = -10 - 20 - 90 + 0 + 10 + 20 + 90 = \mathbf{0} $$
3. Gradient Magnitude and Angle:
   $$ \|\nabla I\| = \sqrt{320^2 + 0^2} = \mathbf{320.0} $$
   $$ \theta = \text{atan2}(0, 320) = \mathbf{0^\circ} \quad (\text{Pointing due horizontal; confirms vertical edge}) $$

---

### Level 2: Projecting a 3D Point onto Camera Sensor
A camera has focal length $f_x = f_y = 800 \text{ pixels}$, and principal point $c_x = 320, c_y = 240$.  
A ball in camera coordinates is located at $\vec{P}_c = (1.5, -0.5, 4.0)$ meters.
1. Determine the pixel coordinates $(u, v)$ where the ball appears in the video frame.
2. If the ball moves twice as far away ($Z_c = 8.0 \text{ m}$), what happens to its pixel distance from image center?

**Step-by-step Solution:**
1. Apply pinhole projection:
   $$ u = f_x \frac{X_c}{Z_c} + c_x = 800 \left(\frac{1.5}{4.0}\right) + 320 = 800(0.375) + 320 = 300 + 320 = \mathbf{620 \text{ pixels}} $$
   $$ v = f_y \frac{Y_c}{Z_c} + c_y = 800 \left(\frac{-0.5}{4.0}\right) + 240 = 800(-0.125) + 240 = -100 + 240 = \mathbf{140 \text{ pixels}} $$
   The ball projects to pixel coordinates $(620, 140)$.
2. At double distance $Z_c = 8.0 \text{ m}$:
   $$ u = 800(1.5 / 8.0) + 320 = 800(0.1875) + 320 = 150 + 320 = 470 \text{ pixels} $$
   $$ v = 800(-0.5 / 8.0) + 240 = 800(-0.0625) + 240 = -50 + 240 = 190 \text{ pixels} $$
   Offset from center $(c_x, c_y) = (320, 240)$:
   - At $4 \text{ m}$: $(\Delta u, \Delta v) = (300, -100)$
   - At $8 \text{ m}$: $(\Delta u, \Delta v) = (150, -50)$  
   The pixel displacement from center is **halved**, exactly matching the inverse-distance perspective law!

---

## 7. Production-Ready Computational Engine: Camera Vision Projector

```typescript
export class CameraProjector {
  public fx: number;
  public fy: number;
  public cx: number;
  public cy: number;

  constructor(fx: number, fy: number, cx: number, cy: number) {
    this.fx = fx;
    this.fy = fy;
    this.cx = cx;
    this.cy = cy;
  }

  /**
   * Projects a 3D point in camera coordinates (Xc, Yc, Zc) onto 2D image plane (u, v).
   * Returns null if point lies behind camera lens (Zc <= 0).
   */
  public projectPoint(xc: number, yc: number, zc: number): { u: number; v: number } | null {
    if (zc <= 0.01) return null; // Behind or clipping through lens
    const invZ = 1 / zc;
    return {
      u: this.fx * xc * invZ + this.cx,
      v: this.fy * yc * invZ + this.cy
    };
  }

  /**
   * Applies 3x3 convolution kernel over single-channel grayscale buffer.
   */
  public static convolve3x3(
    src: Float32Array,
    width: number,
    height: number,
    kernel: number[] // 9 elements
  ): Float32Array {
    const dst = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        let k = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixel = src[(y + ky) * width + (x + kx)];
            sum += pixel * kernel[k++];
          }
        }
        dst[y * width + x] = sum;
      }
    }
    return dst;
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** Why do camera projection equations use homogeneous coordinates $\tilde{p} \sim K [R \mid t] \tilde{P}$?
   - **Answer:** Perspective division by depth $Z$ is a non-linear operation. Lifting coordinates to 4D projective space allows rotation, translation, and perspective scaling to be combined into a single unified matrix multiplication, where division by the homogeneous component $w = Z$ is performed at the final step.
2. **Question:** What is the difference between image correlation and true mathematical convolution?
   - **Answer:** Mathematical convolution flips the kernel by $180^\circ$ horizontally and vertically before sliding ($K(-u, -v)$), which guarantees mathematical associativity: $I * (K_1 * K_2) = (I * K_1) * K_2$. Most machine learning libraries omit this flip and perform spatial cross-correlation, but call it "convolution" since neural weights are learned anyway.
3. **Question:** Why does pooling (such as Max Pooling) in CNNs improve image classification?
   - **Answer:** Max pooling downsamples spatial resolution by taking the maximum value in a window (e.g. $2 \times 2$), reducing computational parameters, expanding the effective receptive field of deeper layers, and providing local translation invariance.
