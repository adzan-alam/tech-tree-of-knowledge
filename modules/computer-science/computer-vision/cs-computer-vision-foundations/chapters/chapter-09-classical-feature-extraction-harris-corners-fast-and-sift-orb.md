# Chapter 9: Classical Feature Extraction: Harris Corners, FAST, and SIFT/ORB Descriptors

---

## 9.1 Local Feature Detection Principles and Mathematical Invariance

In robotic localization, visual SLAM, and autonomous object recognition, a vision system cannot rely on dense, pixel-by-pixel comparisons across varying camera angles, lighting conditions, and distances. Instead, visual perception relies on **local invariant features**—salient interest points with localized descriptions that remain repeatable and identifiable across geometric and photometric transformations.

```
                           THE LOCAL FEATURE PIPELINE
                           
       Raw Input Image I[y, x]
                 │
                 ▼
       ┌─────────────────────────────┐
       │ 1. KEYPOINT DETECTION       │  ──► Find Repeatable Salient Interest Points
       │    (Harris, FAST, DoG)      │      (Corners, Blobs, Scale-Space Extrema)
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │ 2. CANONICAL ORIENTATION    │  ──► Assign Intrinsic Direction θ (Rotational Invariance)
       │    & SCALE ESTIMATION       │      and Characteristic Radius σ (Scale Invariance)
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │ 3. DESCRIPTOR EXTRACTION    │  ──► Compute Compact Invariant Signature
       │    (SIFT 128D, ORB 256-bit) │      (Gradient Histograms or Binary Tests)
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │ 4. FEATURE MATCHING         │  ──► Nearest Neighbor Search (L2 / Hamming) +
       │    & ROBUST FITTING         │      Lowe's Ratio Test + RANSAC Model Verification
       └─────────────────────────────┘
```

### The Three Foundational Desiderata of Local Features
1. **Repeatability:** If a 3D physical surface point is detected as a keypoint in Image 1, it must be detected at the corresponding physical location in Image 2, regardless of camera rotation, translation, zoom, or illumination shifts.
2. **Distinctiveness (Saliency):** The local neighborhood pattern surrounding the keypoint must possess high information entropy, allowing it to be uniquely matched against thousands of candidate points across a massive database.
3. **Locality:** The descriptor must be compact and localized to minimize the probability of being corrupted by foreground occlusions or background clutter.

---

## 9.2 The Harris Corner Detector and the Structure Tensor

Flat image regions have zero gradient in all directions. Straight edge contours possess large gradients perpendicular to the edge, but zero gradient parallel to the edge (**the aperture problem**—motion along the edge is fundamentally ambiguous).

A **corner** is an intersection of two or more edges where the image intensity changes significantly in all spatial directions.

```
                     FLAT VS. EDGE VS. CORNER REGIONS
                     
       Flat Region                      Edge Region                      Corner Region
    ┌───────────────┐                ┌───────────────┐                ┌───────────────┐
    │               │                │       |       │                │       |       │
    │   [  ]        │                │   [ | ]       │                │   [ ┌─┘ ]     │
    │               │                │       |       │                │     └───      │
    │               │                │       |       │                │               │
    └───────────────┘                └───────────────┘                └───────────────┘
     Zero change in                   Change in ONLY one               Significant change
     all directions                   direction (orthogonal)           in ALL directions!
```

### The Autocorrelation Error Surface
In 1988, Chris Harris and Mike Stephens quantified this intuition mathematically. Consider shifting a local window $w(x, y)$ by a displacement $(\Delta x, \Delta y)$. The Sum of Squared Differences (SSD) change in intensity is:

$$E(\Delta x, \Delta y) = \sum_{x, y} w(x, y) \Big[ I(x + \Delta x, y + \Delta y) - I(x, y) \Big]^2$$

where $w(x, y)$ is a Gaussian weighting window $w(x, y) = \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$.

Using first-order 2D Taylor series expansion:
$$I(x + \Delta x, y + \Delta y) \approx I(x, y) + I_x \Delta x + I_y \Delta y$$

Substituting this into the error surface equation:
$$\begin{aligned}
E(\Delta x, \Delta y) &\approx \sum_{x, y} w(x, y) \Big[ I_x \Delta x + I_y \Delta y \Big]^2 \\
&= \sum_{x, y} w(x, y) \Big[ I_x^2 (\Delta x)^2 + 2 I_x I_y \Delta x \Delta y + I_y^2 (\Delta y)^2 \Big]
\end{aligned}$$

Writing this quadratic form in matrix notation:
$$E(\Delta x, \Delta y) \approx \begin{bmatrix} \Delta x & \Delta y \end{bmatrix} \mathbf{M} \begin{bmatrix} \Delta x \\ \Delta y \end{bmatrix}$$

### The Second Moment Matrix (Structure Tensor)
The symmetric $2 \times 2$ matrix $\mathbf{M}$ is the **Second Moment Matrix** (or **Structure Tensor**):

$$\mathbf{M} \triangleq \sum_{x, y} w(x, y) \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix} = \begin{bmatrix} \langle I_x^2 \rangle & \langle I_x I_y \rangle \\ \langle I_x I_y \rangle & \langle I_y^2 \rangle \end{bmatrix}$$

Because $\mathbf{M}$ is real and symmetric, it can be orthogonally diagonalized via its eigenvalues $\lambda_1, \lambda_2 \ge 0$:
$$\mathbf{M} = \mathbf{R} \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix} \mathbf{R}^\top$$

```
                         STRUCTURE TENSOR EIGENVALUES
                         
                    λ_2 ▲
                        │      "EDGE"
                        │   (λ_2 >> λ_1)
                        │        │
                        │        ▼
                        │       | |
                        │       | |             "CORNER"
                        │       | |          (λ_1 ≈ λ_2 >> 0)
                        │       | |                 o
                        │                          / \
                        │                         /   \
                        │
                        │      "FLAT"               "EDGE"
                        │ (λ_1 ≈ λ_2 ≈ 0)        (λ_1 >> λ_2)
                        │       . . .          ─────────────
                        └───────────────────────────────────────► λ_1
```

#### Classification via Eigenvalues:
1. **Flat Region:** $\lambda_1 \approx 0$ and $\lambda_2 \approx 0$. $E(\Delta x, \Delta y)$ is nearly zero for any shift.
2. **Edge Region:** One eigenvalue is large, and the other is near zero ($\lambda_1 \gg \lambda_2 \approx 0$ or $\lambda_2 \gg \lambda_1 \approx 0$). Motion along the edge produces zero change.
3. **Corner Point:** Both eigenvalues are large ($\lambda_1 \ge \lambda_2 \gg 0$). Any spatial shift causes a massive surge in $E(\Delta x, \Delta y)$.

### The Harris Corner Response Metric $R$
Explicitly computing the eigenvalues $\lambda_1, \lambda_2$ for every pixel via the quadratic formula requires square roots, which is computationally prohibitive in real-time vision.

Harris and Stephens utilized the algebraic identities connecting eigenvalues to matrix trace and determinant:
$$\det(\mathbf{M}) = \lambda_1 \lambda_2, \quad \text{trace}(\mathbf{M}) = \lambda_1 + \lambda_2$$

They formulated the **Harris Corner Response Function** $R$:

$$R \triangleq \det(\mathbf{M}) - k \cdot (\text{trace}(\mathbf{M}))^2$$

where $k$ is an empirical sensitivity parameter (typically $k \in [0.04, 0.06]$).

- If $R > T_{\text{corner}}$: The pixel is a confirmed corner.
- If $R < -T_{\text{edge}}$: The pixel is an edge.
- If $|R| \approx 0$: The pixel is in a flat homogeneous patch.

### The Shi-Tomasi Criterion (1994)
Jianbo Shi and Carlo Tomasi observed that for optical flow tracking, corners are optimal when the worst-case directional eigenvalue is maximized. They introduced the **Shi-Tomasi metric**:
$$R_{\text{Shi-Tomasi}} = \min(\lambda_1, \lambda_2)$$
A pixel is classified as a "Good Feature to Track" if $\min(\lambda_1, \lambda_2) > T$.

---

## 9.3 FAST: Features from Accelerated Segment Test

While Harris corners provide high repeatability, calculating image gradients and structure tensors across an entire image is too slow for high-frame-rate robotics (e.g., visual-inertial odometry at 100 FPS).

In 2006, Edward Rosten and Tom Drummond introduced **FAST (Features from Accelerated Segment Test)**, which replaces differential calculus with high-speed circular pixel intensity tests.

```
                         THE FAST-16 BRESENHAM CIRCLE
                         
                                      16   1   2
                                   15           3
                                 14               4
                                13        p        5
                                 12               6
                                   11           7
                                      10   9   8
```

### The FAST-16 Test Algorithm
1. Consider a candidate pixel $p$ with radiant intensity $I_p$.
2. Form a discrete Bresenham circle of radius 3 pixels around $p$, comprising **16 perimeter pixels** numbered 1 to 16.
3. Choose an intensity threshold $\epsilon$ (typically $\epsilon \approx 10$ to $20$ gray levels).
4. **Corner Criterion:** Pixel $p$ is declared a corner if there exists a contiguous arc of at least $N = 9$ pixels (in FAST-9) or $N = 12$ pixels (in FAST-12) on the circle that are all either:
   - **Brighter** than $I_p + \epsilon$, OR
   - **Darker** than $I_p - \epsilon$.

### High-Speed Early Rejection (The 4-Pixel Test)
To achieve extreme real-time execution speeds, FAST performs an ultra-fast preliminary screening by testing only the four cardinal compass pixels: **1, 5, 9, and 13**:
- For a contiguous arc of 12 pixels to exist, **at least 3 of these 4 pixels must simultaneously satisfy the brightness or darkness threshold**.
- If fewer than 3 cardinal pixels are brighter than $I_p + \epsilon$ or darker than $I_p - \epsilon$, pixel $p$ is immediately discarded!
- This simple test rejects over $80\%$ of non-corner pixels using only 4 memory lookups and 4 comparisons, running in less than 5 nanoseconds per candidate.

---

## 9.4 SIFT: Scale-Invariant Feature Transform

Neither Harris nor FAST is invariant to image scale: zooming in on an image causes a sharp corner to expand into a smooth, gentle curve that fails local corner tests.

In 1999 and 2004, David G. Lowe published the **Scale-Invariant Feature Transform (SIFT)**, which achieves complete mathematical invariance to:
- 2D Translation
- Uniform Scaling (Zoom)
- 2D Planar Rotation
- Linear Photometric Brightness and Contrast Shifts

```
                      THE SIFT SCALE-SPACE PYRAMID
                      
      Octave 2               Octave 1               Octave 0 (Original)
     (Downsampled 4x)       (Downsampled 2x)        (Full Resolution)
     
        ┌───┐                  ┌───────┐               ┌───────────────┐
     k^4│   │               k^4│       │            k^4│               │
     k^3│   │               k^3│       │            k^3│               │
     k^2│   │               k^2│       │            k^2│               │
     k  │   │               k  │       │            k  │               │
      1 └───┘                1 └───────┘             1 └───────────────┘
      (5 Blurs / Octave)     (5 Blurs / Octave)      (5 Blurs / Octave)
```

### Stage 1: Scale-Space Extrema Detection via DoG
1. Convolve the image with Gaussian filters at logarithmic scale intervals $k = 2^{1/S}$, producing an octave pyramid $L(x, y, \sigma)$.
2. Compute the Difference of Gaussians (DoG):
   $$D(x, y, \sigma) = L(x, y, k\sigma) - L(x, y, \sigma)$$
3. **Local 3D Extrema Search:**
   Each pixel in $D(x, y, \sigma)$ is compared against its **26 neighbors** (8 in the current scale, 9 in the scale above, and 9 in the scale below). A pixel is selected as a candidate keypoint if and only if it is strictly greater than (or strictly less than) all 26 spatio-temporal neighbors!

```
                         26-NEIGHBOR EXTEMA TESTING
                         
             Scale σ + 1           Current Scale σ           Scale σ - 1
             ┌───┬───┬───┐          ┌───┬───┬───┐          ┌───┬───┬───┐
             │ o │ o │ o │          │ o │ o │ o │          │ o │ o │ o │
             ├───┼───┼───┤          ├───┼───┼───┤          ├───┼───┼───┤
             │ o │ o │ o │          │ o │[X]│ o │          │ o │ o │ o │
             ├───┼───┼───┤          ├───┼───┼───┤          ├───┼───┼───┤
             │ o │ o │ o │          │ o │ o │ o │          │ o │ o │ o │
             └───┴───┴───┘          └───┴───┴───┘          └───┴───┴───┘
             9 Neighbors             8 Neighbors            9 Neighbors
```

### Stage 2: Sub-Pixel Keypoint Localization and Edge Elimination
Candidate extrema are refined using a 3D Taylor series expansion of $D(\mathbf{x})$ where $\mathbf{x} = [x, y, \sigma]^\top$:
$$D(\mathbf{x}) = D + \frac{\partial D^\top}{\partial \mathbf{x}} \mathbf{x} + \frac{1}{2} \mathbf{x}^\top \frac{\partial^2 D}{\partial \mathbf{x}^2} \mathbf{x}$$
Setting $\nabla_{\mathbf{x}} D = \mathbf{0}$ yields the sub-pixel peak offset:
$$\hat{\mathbf{x}} = - \left( \frac{\partial^2 D}{\partial \mathbf{x}^2} \right)^{-1} \frac{\partial D}{\partial \mathbf{x}}$$

- **Low-Contrast Rejection:** Discard points if $|D(\hat{\mathbf{x}})| < 0.03$.
- **Edge Response Elimination:** Along straight edges, the 2D Hessian $\mathbf{H} = \begin{bmatrix} D_{xx} & D_{xy} \\ D_{xy} & D_{yy} \end{bmatrix}$ has one huge eigenvalue and one tiny eigenvalue.
  Let $r = \frac{\lambda_1}{\lambda_2}$ be the eigenvalue ratio. Discard points if:
  $$\frac{\text{trace}(\mathbf{H})^2}{\det(\mathbf{H})} = \frac{(\lambda_1 + \lambda_2)^2}{\lambda_1 \lambda_2} = \frac{(r + 1)^2}{r} > \frac{(r_{\text{threshold}} + 1)^2}{r_{\text{threshold}}}$$
  (SIFT sets $r_{\text{threshold}} = 10$, rejecting edge-like unstable ridges).

### Stage 3: Canonical Orientation Assignment
To achieve rotational invariance, every keypoint is assigned an intrinsic dominant direction $\theta$:
1. Compute gradient magnitudes $m(x, y)$ and orientations $\theta(x, y)$ in a Gaussian-weighted neighborhood of scale $\sigma$.
2. Form an **orientation histogram** with 36 bins (spanning $360^\circ$ in $10^\circ$ increments).
3. The highest peak in the histogram defines the keypoint's canonical orientation $\theta_{\text{canonical}}$. (Any secondary peak within $80\%$ of the maximum spawns an additional keypoint with identical location and scale but distinct orientation).

### Stage 4: The 128-Dimensional SIFT Descriptor
1. Rotate the local neighborhood patch around the keypoint by $-\theta_{\text{canonical}}$ to align with the canonical orientation.
2. Partition a $16 \times 16$ pixel neighborhood into a **$4 \times 4$ grid of spatial sub-regions** (each of size $4 \times 4$ pixels).
3. In each sub-region, accumulate gradient orientations into an **8-bin orientation histogram**.
4. Concatenating the histograms:
   $$4 \times 4 \text{ grid} \times 8 \text{ bins/cell} = 128 \text{ dimensions!}$$
5. **Illumination Invariance Normalization:**
   - Normalize the 128D vector to unit length ($\|\mathbf{f}\|_2 = 1$). This eliminates linear contrast scaling ($I \to a I$).
   - Clip all individual values to a maximum threshold of $0.2$ to eliminate non-linear saturation artifacts from specular highlights.
   - Re-normalize to unit length.

```
                    THE 128-DIMENSIONAL SIFT DESCRIPTOR
                    
          16x16 Pixel Region                4x4 Sub-regions (8 Bins Each)
       ┌───┬───┬───┬───┐                    ┌───────┐
       │   │   │   │   │                    │ \ | / │
       ├───┼───┼───┼───┤                    │-- o --│  8-Direction
       │   │   │   │   │  ─────────────►    │ / | \ │  Gradient Histogram
       ├───┼───┼───┼───┤                    └───────┘  per 4x4 cell
       │   │   │   │   │
       ├───┼───┼───┼───┤                    4 x 4 cells x 8 orientations
       │   │   │   │   │                    = 128 Total Float Values
       └───┴───┴───┴───┘
```

---

## 9.5 ORB: Oriented FAST and Rotated BRIEF

While SIFT is a masterpiece of computer vision engineering, computing 128-dimensional floating-point vectors and calculating $L_2$ Euclidean distances across thousands of points requires significant computational overhead.

In 2011, Ethan Rublee, Vincent Rabaud, Kurt Konolige, and Gary Bradski developed **ORB (Oriented FAST and Rotated BRIEF)** as an open-source, ultra-fast alternative to SIFT, delivering comparable matching performance with orders-of-magnitude faster computation.

### 1. Orientation Assignment: The Intensity Centroid
ORB detects keypoints using multi-scale FAST. To assign orientation, ORB computes the **intensity centroid** of the circular patch:
$$m_{p, q} = \sum_{x, y} x^p y^q I(x, y)$$
The centroid vector $\mathbf{C}$ from patch center $(0, 0)$ is:
$$\mathbf{C} = \left( \frac{m_{1, 0}}{m_{0, 0}}, \, \frac{m_{0, 1}}{m_{0, 0}} \right)$$
The patch orientation is simply the angle of this centroid vector:
$$\theta = \text{atan2}(m_{0, 1}, m_{1, 0})$$

### 2. The Steered BRIEF Descriptor
BRIEF (Binary Robust Independent Elementary Features) describes a patch using a sequence of $n = 256$ pairwise binary intensity tests between coordinate pairs $(\mathbf{x}_i, \mathbf{y}_i)$:
$$\tau(\mathbf{p}; \mathbf{x}_i, \mathbf{y}_i) = \begin{cases} 1 & \text{if } I(\mathbf{p} + \mathbf{x}_i) < I(\mathbf{p} + \mathbf{y}_i) \\ 0 & \text{otherwise} \end{cases}$$

ORB steers these test locations by the patch orientation $\theta$ using rotation matrix $\mathbf{R}_\theta$:
$$\mathbf{S}_\theta = \mathbf{R}_\theta \mathbf{S}$$
The resulting descriptor is a **256-bit binary string** (32 bytes).

### 3. Hamming Distance Matching
Matching two ORB descriptors requires no floating-point arithmetic. The distance is computed via the bitwise **Hamming Distance**:
$$d_{\text{Hamming}}(\mathbf{d}_1, \mathbf{d}_2) = \text{popcount}(\mathbf{d}_1 \oplus \mathbf{d}_2)$$
Modern CPUs compute this in single-cycle SIMD instructions (`_mm_popcnt_u64`), enabling millions of feature comparisons per second.

---

## 9.6 Worked Examples

### Problem 9.1: Structure Tensor and Harris Response Calculation
**Statement:** At a given pixel $(y, x)$, image gradients across a $3 \times 3$ window yield:
$$\langle I_x^2 \rangle = 120.0, \quad \langle I_y^2 \rangle = 100.0, \quad \langle I_x I_y \rangle = 40.0$$
The Harris parameter is $k = 0.05$.
1. Assemble the Structure Tensor matrix $\mathbf{M}$.
2. Compute the trace $\text{tr}(\mathbf{M})$ and determinant $\det(\mathbf{M})$.
3. Compute the Harris corner response $R$ and determine if this pixel is a corner for threshold $T = 5000$.

**Step-by-step Solution:**
1. **Structure Tensor $\mathbf{M}$:**
   $$\mathbf{M} = \begin{bmatrix} 120.0 & 40.0 \\ 40.0 & 100.0 \end{bmatrix}$$
2. **Trace and Determinant:**
   $$\text{trace}(\mathbf{M}) = 120.0 + 100.0 = 220.0$$
   $$\det(\mathbf{M}) = (120.0)(100.0) - (40.0)^2 = 12000.0 - 1600.0 = 10400.0$$
3. **Harris Response $R$:**
   $$R = \det(\mathbf{M}) - k (\text{trace}(\mathbf{M}))^2 = 10400.0 - 0.05 \times (220.0)^2$$
   $$(220.0)^2 = 48400.0$$
   $$k (\text{trace}(\mathbf{M}))^2 = 0.05 \times 48400.0 = 2420.0$$
   $$R = 10400.0 - 2420.0 = 7980.0$$
   Since $R = 7980.0 > 5000$, the pixel is classified as a **strong corner**.

---

### Problem 9.2: Shi-Tomasi Eigenvalue Extraction
**Statement:** Compute the exact eigenvalues $\lambda_1, \lambda_2$ of the Structure Tensor $\mathbf{M} = \begin{bmatrix} 120 & 40 \\ 40 & 100 \end{bmatrix}$ from Problem 9.1, and evaluate the Shi-Tomasi score.

**Step-by-step Solution:**
1. Characteristic polynomial $\det(\mathbf{M} - \lambda \mathbf{I}) = 0$:
   $$\lambda^2 - \text{trace}(\mathbf{M}) \lambda + \det(\mathbf{M}) = 0 \implies \lambda^2 - 220 \lambda + 10400 = 0$$
2. Discriminant:
   $$\Delta = b^2 - 4ac = (-220)^2 - 4(1)(10400) = 48400 - 41600 = 6800$$
   $$\sqrt{\Delta} = \sqrt{6800} \approx 82.462$$
3. Eigenvalues:
   $$\lambda_1 = \frac{220 + 82.462}{2} = \frac{302.462}{2} \approx 151.231$$
   $$\lambda_2 = \frac{220 - 82.462}{2} = \frac{137.538}{2} \approx 68.769$$
4. **Shi-Tomasi Score:**
   $$R_{\text{Shi-Tomasi}} = \min(\lambda_1, \lambda_2) = 68.769$$
   Both eigenvalues are substantially greater than zero ($\lambda_2 \approx 68.8 \gg 0$), confirming robust corner saliency.

---

### Problem 9.3: FAST-12 Early Rejection Test
**Statement:** Candidate pixel $p$ has intensity $I_p = 100$. The threshold is $\epsilon = 15$.
The intensities of the four cardinal Bresenham circle pixels are:
$$I_1 = 120, \quad I_5 = 118, \quad I_9 = 117, \quad I_{13} = 95$$
Determine whether pixel $p$ survives the early rejection test.

**Step-by-step Solution:**
1. Threshold limits:
   - High threshold: $I_p + \epsilon = 100 + 15 = 115$
   - Low threshold: $I_p - \epsilon = 100 - 15 = 85$
2. Evaluate cardinal pixels:
   - Pixel 1: $I_1 = 120 > 115$ (Brighter $\checkmark$)
   - Pixel 5: $I_5 = 118 > 115$ (Brighter $\checkmark$)
   - Pixel 9: $I_9 = 117 > 115$ (Brighter $\checkmark$)
   - Pixel 13: $I_{13} = 95$ (Neither brighter than 115 nor darker than 85 $\times$)
3. Count:
   Number of bright cardinal pixels = $3$.
   Since at least 3 cardinal pixels are brighter than $I_p + \epsilon$, pixel $p$ **survives** the early rejection test and proceeds to the full 16-pixel arc verification.

---

### Problem 9.4: SIFT Edge Response Rejection (Hessian Ratio)
**Statement:** At a candidate DoG extremum, the 2D Hessian of spatial derivatives is:
$$\mathbf{H} = \begin{bmatrix} D_{xx} & D_{xy} \\ D_{xy} & D_{yy} \end{bmatrix} = \begin{bmatrix} 20.0 & 2.0 \\ 2.0 & 1.0 \end{bmatrix}$$
Using the SIFT eigenvalue ratio threshold $r_{\text{threshold}} = 10$:
1. Compute $\text{trace}(\mathbf{H})$ and $\det(\mathbf{H})$.
2. Compute the curvature score $\frac{\text{trace}(\mathbf{H})^2}{\det(\mathbf{H})}$.
3. Determine whether this keypoint is accepted or rejected as an edge ridge.

**Step-by-step Solution:**
1. **Trace and Determinant:**
   $$\text{trace}(\mathbf{H}) = 20.0 + 1.0 = 21.0$$
   $$\det(\mathbf{H}) = (20.0)(1.0) - (2.0)^2 = 20.0 - 4.0 = 16.0$$
2. **Curvature Metric:**
   $$\frac{\text{trace}(\mathbf{H})^2}{\det(\mathbf{H})} = \frac{21.0^2}{16.0} = \frac{441.0}{16.0} = 27.5625$$
3. **Threshold Comparison:**
   $$\frac{(r + 1)^2}{r} = \frac{(10 + 1)^2}{10} = \frac{11^2}{10} = \frac{121}{10} = 12.1$$
   Since $27.5625 > 12.1$, the eigenvalue ratio exceeds $10$ (in fact, $\lambda_1 \approx 20.2, \lambda_2 \approx 0.79 \implies r \approx 25.6$).
   **Decision:** The candidate is **rejected as an unstable edge ridge**.

---

### Problem 9.5: Lowe's Nearest Neighbor Distance Ratio (NNDR)
**Statement:** A query SIFT descriptor $\mathbf{d}_q \in \mathbb{R}^{128}$ is matched against a database of descriptors. The Euclidean distance to the closest match is $D_1 = 0.35$, and the distance to the second-closest match is $D_2 = 0.50$.
1. Compute Lowe's ratio $\text{NNDR} = \frac{D_1}{D_2}$.
2. If the ambiguity threshold is set to $\tau = 0.80$, determine if this match is accepted.

**Step-by-step Solution:**
1. **Ratio Calculation:**
   $$\text{NNDR} = \frac{D_1}{D_2} = \frac{0.35}{0.50} = 0.70$$
2. **Threshold Test:**
   $$\text{NNDR} = 0.70 < 0.80$$
   Since the ratio is strictly less than $0.80$, the match is **accepted as a distinct, unambiguous correspondence**.

---

### Problem 9.6: ORB Intensity Centroid Orientation
**Statement:** A small $3 \times 3$ patch has pixel coordinates $(x, y) \in \{-1, 0, 1\} \times \{-1, 0, 1\}$ with intensities:
$$I = \begin{bmatrix} 10 & 20 & 30 \\ 10 & 20 & 50 \\ 20 & 40 & 80 \end{bmatrix}$$
1. Compute the zeroth moment $m_{0, 0}$.
2. Compute the first moments $m_{1, 0}$ and $m_{0, 1}$.
3. Compute the ORB patch orientation $\theta$ in degrees.

**Step-by-step Solution:**
1. **Zeroth Moment $m_{0, 0}$ (Total Intensity):**
   $$m_{0, 0} = (10 + 20 + 30) + (10 + 20 + 50) + (20 + 40 + 80) = 60 + 80 + 140 = 280$$
2. **First Moments:**
   Columns correspond to $x \in \{-1, 0, 1\}$, rows correspond to $y \in \{-1, 0, 1\}$:
   $$\begin{aligned}
   m_{1, 0} &= \sum x I(x, y) \\
   &= (-1)(10 + 10 + 20) + (0)(20 + 20 + 40) + (+1)(30 + 50 + 80) \\
   &= (-1)(40) + 0 + (+1)(160) = -40 + 160 = +120
   \end{aligned}$$
   $$\begin{aligned}
   m_{0, 1} &= \sum y I(x, y) \\
   &= (-1)(10 + 20 + 30) + (0)(10 + 20 + 50) + (+1)(20 + 40 + 80) \\
   &= (-1)(60) + 0 + (+1)(140) = -60 + 140 = +80
   \end{aligned}$$
3. **Orientation $\theta$:**
   $$\theta = \text{atan2}(m_{0, 1}, m_{1, 0}) = \text{atan2}(80, 120) = \text{atan2}(2, 3) \approx 0.5880 \text{ rad} \approx 33.69^\circ$$
   The patch orientation is $\theta \approx 33.69^\circ$.

---

### Problem 9.7: Normalization of SIFT Descriptor to Unit Norm
**Statement:** A 4D prototype descriptor vector is $\mathbf{v} = [3.0, 4.0, 0.0, 12.0]^\top$.
Normalize this vector to have unit $L_2$ Euclidean norm.

**Step-by-step Solution:**
1. Compute the $L_2$ Euclidean norm:
   $$\|\mathbf{v}\|_2 = \sqrt{3.0^2 + 4.0^2 + 0.0^2 + 12.0^2} = \sqrt{9 + 16 + 0 + 144} = \sqrt{169} = 13.0$$
2. Divide each entry by the norm:
   $$\hat{\mathbf{v}} = \frac{\mathbf{v}}{13.0} = \begin{bmatrix} 3/13 \\ 4/13 \\ 0 \\ 12/13 \end{bmatrix} \approx \begin{bmatrix} 0.2308 \\ 0.3077 \\ 0.0000 \\ 0.9231 \end{bmatrix}$$
3. Verification:
   $$\|\hat{\mathbf{v}}\|_2^2 = \left(\frac{3}{13}\right)^2 + \left(\frac{4}{13}\right)^2 + 0 + \left(\frac{12}{13}\right)^2 = \frac{9 + 16 + 144}{169} = \frac{169}{169} = 1.0$$

---

### Problem 9.8: SIFT Orientation Histogram Bin Assignment
**Statement:** A pixel in a SIFT neighborhood has gradient components $I_x = -30.0$ and $I_y = -40.0$.
1. Compute the gradient magnitude $m$ and orientation $\theta \in [0^\circ, 360^\circ)$.
2. For an orientation histogram with 36 bins ($10^\circ$ per bin: Bin 0 is $[0^\circ, 10^\circ)$, etc.), determine which bin index $k \in [0, 35]$ receives this gradient magnitude.

**Step-by-step Solution:**
1. **Magnitude and Orientation:**
   $$m = \sqrt{(-30.0)^2 + (-40.0)^2} = \sqrt{900 + 1600} = \sqrt{2500} = 50.0$$
   $$\theta_{\text{rad}} = \text{atan2}(-40.0, -30.0) \approx -2.2143 \text{ rad} \approx -126.87^\circ$$
   Convert to $[0^\circ, 360^\circ)$:
   $$\theta = -126.87^\circ + 360^\circ = 233.13^\circ$$
2. **Bin Assignment:**
   $$k = \left\lfloor \frac{\theta}{10^\circ} \right\rfloor = \left\lfloor \frac{233.13^\circ}{10^\circ} \right\rfloor = \lfloor 23.313 \rfloor = 23$$
   Bin index **23** (spanning $[230^\circ, 240^\circ)$) receives vote weight $m = 50.0$ (or interpolated between Bin 23 and Bin 24).

---

### Problem 9.9: Steered BRIEF Sampling Coordinates Rotation
**Statement:** An unrotated BRIEF test compares point $\mathbf{x}_1 = [2, 3]^\top$ with point $\mathbf{y}_1 = [-1, 4]^\top$.
If the patch orientation is $\theta = 90^\circ$ ($\mathbf{R}_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$), compute the steered test locations $\mathbf{x}_1'$ and $\mathbf{y}_1'$.

**Step-by-step Solution:**
1. Apply the rotation matrix $\mathbf{R}_\theta$:
   $$\mathbf{x}_1' = \mathbf{R}_{90^\circ} \mathbf{x}_1 = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 3 \end{bmatrix} = \begin{bmatrix} -3 \\ 2 \end{bmatrix}$$
   $$\mathbf{y}_1' = \mathbf{R}_{90^\circ} \mathbf{y}_1 = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} -1 \\ 4 \end{bmatrix} = \begin{bmatrix} -4 \\ -1 \end{bmatrix}$$
   The steered test compares $(p_x - 3, p_y + 2)$ with $(p_x - 4, p_y - 1)$.

---

### Problem 9.10: Sub-Pixel Peak Fitting in 1D SIFT Scale-Space
**Statement:** In a Difference-of-Gaussians scale tower, three consecutive scale samples at a discrete spatial location are:
$$D(\sigma - 1) = 0.08, \quad D(\sigma) = 0.15, \quad D(\sigma + 1) = 0.10$$
Compute the sub-pixel scale offset $\hat{s}$ and the refined peak amplitude $D(\hat{s})$.

**Step-by-step Solution:**
1. Approximate first and second derivatives with central differences:
   $$\frac{\partial D}{\partial s} \approx \frac{D(\sigma + 1) - D(\sigma - 1)}{2} = \frac{0.10 - 0.08}{2} = \frac{0.02}{2} = 0.01$$
   $$\frac{\partial^2 D}{\partial s^2} \approx D(\sigma + 1) - 2D(\sigma) + D(\sigma - 1) = 0.10 - 2(0.15) + 0.08 = 0.18 - 0.30 = -0.12$$
2. Peak offset:
   $$\hat{s} = - \frac{\partial D / \partial s}{\partial^2 D / \partial s^2} = - \frac{0.01}{-0.12} \approx +0.0833 \text{ scale units}$$
3. Refined peak amplitude:
   $$D(\hat{s}) = D(\sigma) + \frac{1}{2} \left( \frac{\partial D}{\partial s} \right) \hat{s} = 0.15 + \frac{1}{2}(0.01)(0.0833) = 0.15 + 0.000417 \approx 0.1504$$

---

## 9.7 Solved Exercises

### Exercise 9.1: Rotational Invariance of the Harris Structure Tensor
**Statement:** Prove that the eigenvalues $\lambda_1, \lambda_2$ of the Second Moment Matrix $\mathbf{M}$ are invariant under any 2D image plane rotation $\mathbf{R} \in \text{SO}(2)$.

**Solution:**
1. Let image $I$ be rotated by orthogonal matrix $\mathbf{R} \in \text{SO}(2)$.
2. From Chapter 3 (Exercise 3.10), the rotated image gradients satisfy:
   $$\nabla I_{\text{rot}} = \mathbf{R} \nabla I$$
3. The outer product of rotated gradients is:
   $$(\nabla I_{\text{rot}}) (\nabla I_{\text{rot}})^\top = (\mathbf{R} \nabla I) (\mathbf{R} \nabla I)^\top = \mathbf{R} (\nabla I \nabla I^\top) \mathbf{R}^\top$$
4. Accumulating over the Gaussian window $w$:
   $$\mathbf{M}_{\text{rot}} = \mathbf{R} \mathbf{M} \mathbf{R}^\top$$
5. Matrix $\mathbf{M}_{\text{rot}}$ is a similarity transform of $\mathbf{M}$ by orthogonal matrix $\mathbf{R}$.
   Because similarity transforms preserve the characteristic polynomial:
   $$\det(\mathbf{M}_{\text{rot}} - \lambda \mathbf{I}) = \det(\mathbf{R} (\mathbf{M} - \lambda \mathbf{I}) \mathbf{R}^\top) = \det(\mathbf{R}) \det(\mathbf{M} - \lambda \mathbf{I}) \det(\mathbf{R}^\top) = \det(\mathbf{M} - \lambda \mathbf{I})$$
   The eigenvalues $\lambda_1, \lambda_2$ are strictly identical.
   Therefore, the Harris response $R = \lambda_1 \lambda_2 - k(\lambda_1 + \lambda_2)^2$ is **strictly invariant to 2D image rotation**. $\blacksquare$

---

### Exercise 9.2: Scale Sensitivity of Harris Corner Detection
**Statement:** Explain why the classical Harris corner detector is NOT invariant to image scale, and describe how Lindeberg's scale-space theory resolves this limitation.

**Solution:**
1. In the Harris detector, gradients are computed with a fixed derivative kernel (e.g., $3 \times 3$ Sobel), and the window $w(x, y)$ has a fixed spatial standard deviation $\sigma_w$.
2. If an image is scaled down by factor $s < 1$, a sharp corner shrinks. A small fixed window will capture surrounding boundary regions, altering the gradient distribution.
3. If an image is magnified ($s \gg 1$), a sharp corner expands into a broad, rounded arc. Within a fixed window, the local patch appears as a straight edge ($\lambda_1 \gg \lambda_2 \approx 0$), failing the corner test!
4. **Lindeberg's Solution (Scale-Adapted Structure Tensor):**
   Tony Lindeberg introduced scale-space normalized derivatives:
   $$\mathbf{M}(\mathbf{x}; \sigma_D, \sigma_I) = \sigma_D^2 \cdot g(\sigma_I) * \begin{bmatrix} I_x^2(\sigma_D) & I_x I_y(\sigma_D) \\ I_x I_y(\sigma_D) & I_y^2(\sigma_D) \end{bmatrix}$$
   By scaling the integration scale $\sigma_I$ and differentiation scale $\sigma_D$ proportionally with a scale parameter $\sigma$, the structure tensor becomes fully scale-adapted. $\blacksquare$

---

### Exercise 9.3: Why Difference of Gaussians (DoG) Approximates Scale-Normalized LoG
**Statement:** Prove that the Difference of Gaussians $D(x, y; \sigma) = G(x, y; k\sigma) - G(x, y; \sigma)$ incorporates Lindeberg's scale normalization factor $\sigma^2$ automatically.

**Solution:**
1. From Chapter 3 (Section 3.5), by the heat diffusion equation:
   $$\frac{\partial G}{\partial \sigma} = \sigma \nabla^2 G$$
2. Approximating the continuous derivative with respect to $\sigma$ via finite differences:
   $$\frac{\partial G}{\partial \sigma} \approx \frac{G(x, y; k\sigma) - G(x, y; \sigma)}{k\sigma - \sigma} = \frac{D(x, y; \sigma)}{(k - 1)\sigma}$$
3. Equating the two expressions:
   $$\frac{D(x, y; \sigma)}{(k - 1)\sigma} \approx \sigma \nabla^2 G(x, y; \sigma)$$
4. Multiply both sides by $(k - 1)\sigma$:
   $$D(x, y; \sigma) \approx (k - 1) \cdot \Big[ \sigma^2 \nabla^2 G(x, y; \sigma) \Big]$$
5. Lindeberg proved that true scale invariance requires multiplying the Laplacian by the scale factor $\sigma^2$ (the **scale-normalized Laplacian** $\sigma^2 \nabla^2 G$).
   Notice that the term $\sigma^2 \nabla^2 G$ appears directly in the DoG expansion!
   Because $(k - 1)$ is a constant ratio across all octaves, simply subtracting two Gaussian-blurred images automatically computes the scale-normalized Laplacian without any explicit scaling calculations! $\blacksquare$

---

### Exercise 9.4: Rationale for SIFT 0.2 Descriptor Threshold Clamping
**Statement:** Explain why SIFT clamps individual descriptor vector values to a maximum of $0.2$ after initial normalization.

**Solution:**
1. Non-linear photometric changes in physical scenes (e.g., specular highlights, camera sensor saturation, flash glares, and local shading variations) cause disproportionately huge gradient magnitudes at a few localized pixels.
2. When the 128D descriptor is normalized to unit length ($\|\mathbf{f}\|_2 = 1$), a single massive outlier gradient will dominate the norm, compressing all other 127 meaningful feature dimensions toward zero.
3. Clamping every dimension to $0.2$ enforces a ceiling, guaranteeing that no single orientation bin can contribute more than $(0.2)^2 = 0.04$ ($4\%$) of total descriptor energy.
4. Subsequent re-normalization distributes energy evenly across all spatial sub-regions, providing robustness against non-linear lighting fluctuations. $\blacksquare$

---

### Exercise 9.5: Fast Hamming Distance Computation via SIMD Instructions
**Statement:** Explain how the Hamming distance between two 256-bit binary descriptors (e.g., ORB) is evaluated in modern CPU architectures using 64-bit integer bitwise operations.

**Solution:**
1. A 256-bit descriptor is stored in memory as an array of four 64-bit unsigned integers:
   `uint64_t desc1[4]`, `uint64_t desc2[4]`.
2. The Hamming distance is the number of differing bits across the two bitstrings.
3. Compute bitwise XOR between corresponding 64-bit words:
   `uint64_t diff0 = desc1[0] ^ desc2[0];`
   `uint64_t diff1 = desc1[1] ^ desc2[1];`
   `uint64_t diff2 = desc1[2] ^ desc2[2];`
   `uint64_t diff3 = desc1[3] ^ desc2[3];`
4. Count the number of set bits in each word using the hardware population count instruction (`POPCNT` in x86/x64, `VCNT` in ARM NEON):
   `int dist = _mm_popcnt_u64(diff0) + _mm_popcnt_u64(diff1) + _mm_popcnt_u64(diff2) + _mm_popcnt_u64(diff3);`
5. This entire 256-bit comparison executes in just 8 CPU clock cycles, allowing a robot to match thousands of features in a fraction of a millisecond. $\blacksquare$

---

### Exercise 9.6: Lowe's Ratio Test Justification
**Statement:** Why is comparing the best match distance $D_1$ directly to an absolute threshold $D_{\text{threshold}}$ inferior to Lowe's Ratio Test $\frac{D_1}{D_2} \le 0.8$?

**Solution:**
1. In feature space, different descriptors have different local neighborhood densities.
2. A feature lying on a repetitive texture pattern (such as wallpaper, bricks, or foliage) will have many close neighbors in the database ($D_1 \approx D_2 \approx D_3$). Even if $D_1$ is small enough to pass an absolute threshold, the match is fundamentally ambiguous and likely incorrect.
3. Conversely, a highly distinctive feature in a sparsely populated region might have $D_1 = 0.40$ and $D_2 = 0.90$. While $D_1$ is moderately large, the ratio $\frac{0.40}{0.90} \approx 0.44 \ll 0.80$ proves that it is overwhelmingly closer to the best match than to the second-best candidate.
4. Lowe's Ratio Test measures the **relative ambiguity** of the match, eliminating over $90\%$ of false matches while retaining over $85\%$ of true matches. $\blacksquare$

---

### Exercise 9.7: FAST Keypoint Machine Learning Optimization
**Statement:** In FAST-ER (FAST with Enhanced Repeatability), describe how ID3 decision trees are trained to order circular pixel tests.

**Solution:**
1. Given a training set of images with labeled corners, the intensity test at position $x \in \{1, \dots, 16\}$ partitions candidate pixels $P$ into three discrete subsets:
   - $P_d$: Pixels where $I_x < I_p - \epsilon$ (Darker)
   - $P_s$: Pixels where $I_p - \epsilon \le I_x \le I_p + \epsilon$ (Similar)
   - $P_b$: Pixels where $I_x > I_p + \epsilon$ (Brighter)
2. Compute the Shannon entropy $H(P)$ of corner labels in set $P$.
3. Compute the Information Gain for each candidate circle pixel $x$:
   $$\text{IG}(x) = H(P) - \sum_{k \in \{d, s, b\}} \frac{|P_k|}{|P|} H(P_k)$$
4. The algorithm selects the pixel that maximizes information gain, recursively constructing an optimal decision tree.
5. In execution, the decision tree queries the minimum number of pixels necessary to classify the candidate, achieving optimal runtime performance. $\blacksquare$

---

### Exercise 9.8: RANSAC Inlier Threshold Selection via Chi-Square Distribution
**Statement:** In feature-based homography fitting, image measurement errors $\epsilon_x, \epsilon_y$ follow independent Gaussian distributions $\mathcal{N}(0, \sigma^2)$. Explain how to choose the RANSAC inlier distance threshold $t$ such that true inliers are accepted with $95\%$ probability.

**Solution:**
1. The squared reprojection error for a true inlier point is:
   $$e^2 = \frac{\epsilon_x^2 + \epsilon_y^2}{\sigma^2}$$
2. Since $\frac{\epsilon_x}{\sigma} \sim \mathcal{N}(0, 1)$ and $\frac{\epsilon_y}{\sigma} \sim \mathcal{N}(0, 1)$ are independent standard normal variables, the sum of their squares follows a **Chi-Square distribution with 2 degrees of freedom**:
   $$e^2 \sim \chi_2^2$$
3. The cumulative distribution function of $\chi_2^2$ is:
   $$F(z) = 1 - e^{-z/2}$$
4. Setting $F(z) = 0.95$:
   $$1 - e^{-z/2} = 0.95 \implies e^{-z/2} = 0.05 \implies -\frac{z}{2} = \ln(0.05) \implies z = -2 \ln(0.05) \approx 5.991$$
5. Therefore:
   $$\frac{\epsilon_x^2 + \epsilon_y^2}{\sigma^2} \le 5.991 \implies d^2 \le 5.991 \sigma^2 \implies t = \sigma \sqrt{5.991} \approx 2.45 \sigma$$
   Setting the RANSAC threshold to $2.45\sigma$ pixels guarantees that $95\%$ of all true inliers are accepted. $\blacksquare$

---

### Exercise 9.9: BRIEF Uncorrelated Feature Selection
**Statement:** Explain why ORB uses Greedy Search across training patches to select 256 tests that have high variance and low mutual correlation.

**Solution:**
1. An ideal binary descriptor must maximize information capacity.
2. A binary test $\tau$ achieves maximum entropy $H(\tau) = 1\text{ bit}$ when its probability of being 1 is exactly $0.5$:
   $$P(\tau = 1) = 0.5 \implies \text{Var}(\tau) = p(1 - p) = 0.25$$
3. Furthermore, if two tests $\tau_1$ and $\tau_2$ are highly correlated ($P(\tau_1 = \tau_2) \approx 1$), test $\tau_2$ provides zero new information.
4. ORB evaluates all possible pairwise tests (nearly 300,000 combinations) on a training dataset:
   - Rank all candidate tests by variance (keeping those with $p \approx 0.5$).
   - Run a greedy selection loop: add the next candidate test only if its absolute correlation with all previously selected tests is below a strict threshold.
5. This yields 256 nearly independent binary tests, maximizing descriptor distinctiveness. $\blacksquare$

---

### Exercise 9.10: Fundamental Trade-off Between SIFT and ORB in Robotics
**Statement:** Compare SIFT and ORB across: (1) computational throughput, (2) memory footprint, (3) scale invariance range, and (4) suitability for real-time mobile robot SLAM.

**Solution:**
1. **Computational Throughput:**
   - SIFT: Requires multi-octave floating-point Gaussian filtering, 3D sub-pixel extrema fitting, and 128D gradient histograms. Runs at $\approx 5\text{ to } 15\text{ FPS}$ on desktop CPUs.
   - ORB: Uses integer Bresenham circle tests and 256-bit comparisons. Runs at $\approx 100\text{ to } 300\text{ FPS}$ on embedded robotic processors. ORB is roughly **$20\times$ faster**.
2. **Memory Footprint:**
   - SIFT: 128 floats $\times 4\text{ bytes} = 512\text{ bytes}$ per keypoint.
   - ORB: 256 bits $= 32\text{ bytes}$ per keypoint. ORB is **$16\times$ more memory-efficient**.
3. **Scale Invariance Range:**
   - SIFT: Employs a dense continuous scale-space pyramid with sub-pixel interpolation. Highly robust across large scale variations ($> 4\times$ zoom).
   - ORB: Uses a discrete scale pyramid with a few octave levels ($1.2\times$ scale factor). Scale invariance is narrower ($\approx 1.5\text{ to } 2\times$).
4. **Suitability for Real-Time Robot SLAM:**
   - ORB is the standard choice for real-time visual-inertial odometry (e.g., ORB-SLAM3) on battery-constrained mobile robots and drones. SIFT is preferred for offline 3D reconstruction and high-accuracy aerial mapping. $\blacksquare$
