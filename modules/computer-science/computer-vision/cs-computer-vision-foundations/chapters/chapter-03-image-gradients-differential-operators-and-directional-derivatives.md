# Chapter 3: Image Gradients, Differential Operators, and Directional Derivatives

---

## 3.1 Differential Geometry of Images and Continuous Gradients

In classical physics, field theories describe spatial environments through scalar potential fields and their associated vector gradients. Digital computer vision views an image $I(x, y)$ through the same lens: as a 2D scalar surface or manifold embedded in $\mathbb{R}^3$, where the elevation at coordinate $(x, y)$ corresponds to radiant intensity.

```
                           THE IMAGE INTENSITY MANIFOLD
                           
           Intensity I(x, y)
                  ▲
                  │              Peak / Ridge
                  │               /\
                  │              /  \
                  │  Plat.      /    \      Valley
                  │  ───────┐  /      \    ┌──────
                  │         │ /        \  /
                  │         └─┘         ─┘
                  └──────────────────────────────► Spatial Coordinate x, y
                             ▲
                             │
                      High Gradient |∇I|
                   (Sharp Intensity Edge)
```

### The Gradient Vector Field
Let $I: \Omega \subset \mathbb{R}^2 \to \mathbb{R}$ be a continuously differentiable image function. The **gradient** of $I$ at spatial position $\mathbf{x} = [x, y]^\top$ is the 2D vector of first-order partial derivatives:
$$\nabla I(x, y) = \begin{bmatrix} \frac{\partial I}{\partial x} \\[4pt] \frac{\partial I}{\partial y} \end{bmatrix} = \begin{bmatrix} I_x \\ I_y \end{bmatrix}$$

The gradient vector possesses two fundamental geometric properties:
1. **Direction of Maximum Ascent:** The unit vector $\mathbf{u}_{\text{max}} = \frac{\nabla I}{\|\nabla I\|}$ points in the direction of the steepest instantaneous increase in intensity.
2. **Magnitude as Steepness:** The Euclidean norm of the gradient measures the maximal directional rate of change:
   $$\|\nabla I\| = \sqrt{I_x^2 + I_y^2}$$

### Directional Derivatives
Let $\mathbf{v} = [\cos\theta, \sin\theta]^\top$ be an arbitrary unit direction vector in the image plane making an angle $\theta$ with the positive $x$-axis. The directional derivative of $I$ along $\mathbf{v}$ is given by the inner product:
$$D_{\mathbf{v}} I = \nabla I \cdot \mathbf{v} = I_x \cos\theta + I_y \sin\theta = \|\nabla I\| \cos(\theta - \theta_g)$$
where $\theta_g = \text{atan2}(I_y, I_x)$ is the gradient angle.

- **Maximum Rate of Change:** $D_{\mathbf{v}} I = +\|\nabla I\|$ when $\theta = \theta_g$ (along the gradient).
- **Minimum Rate of Change:** $D_{\mathbf{v}} I = -\|\nabla I\|$ when $\theta = \theta_g + \pi$ (opposite the gradient).
- **Zero Change (Isophote Direction):** $D_{\mathbf{v}} I = 0$ when $\theta = \theta_g \pm \frac{\pi}{2}$. The vector orthogonal to the gradient is tangent to the image contour line (isophote curve of constant intensity).

```
                     GEOMETRY OF GRADIENT AND ISOPHOTE
                     
                              Gradient Vector ∇I
                             (Direction of Max Change)
                                      ▲
                                      │
                                      │  θ_g = atan2(I_y, I_x)
                                      │
                        ──────────────┼──────────────► Isophote / Contour Line
                                      │                (Direction of ZERO Change)
                                      │                v_contour ⊥ ∇I
                                      │
```

---

## 3.2 Discrete Finite Differences and Truncation Errors

A digital image $I[y, x]$ is defined only on a discrete integer grid $(y, x) \in \mathbb{Z}^2$. Consequently, continuous infinitesimal derivatives $\frac{\partial I}{\partial x} = \lim_{h \to 0} \frac{I(x+h, y) - I(x, y)}{h}$ must be approximated via discrete **finite difference operators** with grid spacing $h = 1$ pixel.

### Taylor Series Expansion and Truncation Error
To understand the numerical accuracy of discrete difference approximations, expand the continuous 1D intensity profile $f(x)$ around point $x$:
$$f(x + h) = f(x) + h f'(x) + \frac{h^2}{2} f''(x) + \frac{h^3}{6} f'''(x) + \mathcal{O}(h^4)$$
$$f(x - h) = f(x) - h f'(x) + \frac{h^2}{2} f''(x) - \frac{h^3}{6} f'''(x) + \mathcal{O}(h^4)$$

#### 1. Forward Difference Operator ($\Delta^+$)
Rearranging the expansion for $f(x + h)$:
$$f'(x) = \frac{f(x + h) - f(x)}{h} - \frac{h}{2} f''(x) + \mathcal{O}(h^2) = \frac{f(x + h) - f(x)}{h} + \mathcal{O}(h)$$
In discrete form with $h = 1$:
$$D_x^+ I[y, x] = I[y, x + 1] - I[y, x] \quad \iff \quad K_x^+ = \begin{bmatrix} -1 & 1 \end{bmatrix}$$
- **Truncation Error:** First-order accurate, $\mathcal{O}(h)$.
- **Asymmetry:** Shifts the detected edge by $+0.5$ pixels to the right.

#### 2. Backward Difference Operator ($\Delta^-$)
Rearranging the expansion for $f(x - h)$:
$$f'(x) = \frac{f(x) - f(x - h)}{h} + \frac{h}{2} f''(x) + \mathcal{O}(h^2) = \frac{f(x) - f(x - h)}{h} + \mathcal{O}(h)$$
In discrete form with $h = 1$:
$$D_x^- I[y, x] = I[y, x] - I[y, x - 1] \quad \iff \quad K_x^- = \begin{bmatrix} -1 & 1 \end{bmatrix} \quad (\text{shifted})$$
- **Truncation Error:** First-order accurate, $\mathcal{O}(h)$.
- **Asymmetry:** Shifts the detected edge by $-0.5$ pixels to the left.

#### 3. Central Difference Operator ($\Delta^c$)
Subtracting the expansion of $f(x - h)$ from $f(x + h)$:
$$f(x + h) - f(x - h) = 2h f'(x) + \frac{2h^3}{6} f'''(x) + \mathcal{O}(h^5)$$
Solving for $f'(x)$:
$$f'(x) = \frac{f(x + h) - f(x - h)}{2h} - \frac{h^2}{6} f'''(x) + \mathcal{O}(h^4) = \frac{f(x + h) - f(x - h)}{2h} + \mathcal{O}(h^2)$$
In discrete form with $h = 1$:
$$D_x^c I[y, x] = \frac{I[y, x + 1] - I[y, x - 1]}{2} \quad \iff \quad K_x^c = \frac{1}{2} \begin{bmatrix} -1 & 0 & 1 \end{bmatrix}$$

> [!IMPORTANT]
> Because the even-order error terms $\frac{h^2}{2} f''(x)$ cancel symmetrically, the central difference operator achieves **second-order truncation accuracy $\mathcal{O}(h^2)$** and is perfectly centered on integer grid pixel $(y, x)$ with zero sub-pixel phase shift.

```
                  FINITE DIFFERENCE GEOMETRY & CANCELATION
                  
         f(x-h)                    f(x)                    f(x+h)
           o─────────────────────────o─────────────────────────o
           ◄────────── h ────────────►◄────────── h ───────────►
           
           Forward Diff:  [f(x+h) - f(x)] / h      ──► Error O(h)
           Backward Diff: [f(x) - f(x-h)] / h      ──► Error O(h)
           Central Diff:  [f(x+h) - f(x-h)] / 2h   ──► Error O(h^2) [Symmetric!]
```

---

## 3.3 The Prewitt, Sobel, and Scharr Gradient Operators

In practice, applying raw finite differences directly to a digital image yields disastrous results because differentiation acts as a high-pass filter that severely amplifies high-frequency sensor noise.

If an image is corrupted by additive zero-mean white Gaussian noise with variance $\sigma_n^2$:
$$I_{\text{noisy}}[x] = I[x] + \eta[x], \quad \eta[x] \sim \mathcal{N}(0, \sigma_n^2)$$
The central difference yields:
$$D_x^c I_{\text{noisy}}[x] = \frac{I[x+1] - I[x-1]}{2} + \frac{\eta[x+1] - \eta[x-1]}{2}$$
The variance of the derivative noise is:
$$\text{Var}\left(\frac{\eta[x+1] - \eta[x-1]}{2}\right) = \frac{\sigma_n^2 + \sigma_n^2}{4} = \frac{\sigma_n^2}{2}$$
For higher-order derivatives, the noise energy explodes exponentially.

To achieve robust gradient estimation, an image operator must perform **smoothing along the orthogonal direction** while evaluating **differences along the gradient direction**.

### 1. The Prewitt Operator (1970)
The Prewitt operator combines a 1D central difference along the derivative axis with a 1D box (uniform) average along the orthogonal axis:
$$S_x^{\text{Prewitt}} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} * \begin{bmatrix} -1 & 0 & 1 \end{bmatrix} = \begin{bmatrix} -1 & 0 & 1 \\ -1 & 0 & 1 \\ -1 & 0 & 1 \end{bmatrix}$$
$$S_y^{\text{Prewitt}} = \begin{bmatrix} -1 \\ 0 \\ 1 \end{bmatrix} * \begin{bmatrix} 1 & 1 & 1 \end{bmatrix} = \begin{bmatrix} -1 & -1 & -1 \\ 0 & 0 & 0 \\ 1 & 1 & 1 \end{bmatrix}$$

### 2. The Sobel-Feldman Operator (1968)
The uniform smoothing of the Prewitt filter suffers from the Sinc side-lobe ringing inherent to box filters. Irwin Sobel and Gary Feldman introduced the **Sobel operator**, which replaces the uniform smoothing vector with a discrete binomial filter $[1, 2, 1]^\top$.

The binomial kernel $[1, 2, 1]^\top$ is the optimal 3-tap discrete approximation to a continuous 1D Gaussian filter. Thus, the Sobel operator computes a **Gaussian-smoothed directional derivative**:

$$S_x = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} \begin{bmatrix} -1 & 0 & 1 \end{bmatrix} = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}$$
$$S_y = \begin{bmatrix} 1 & 2 & 1 \end{bmatrix}^\top \begin{bmatrix} -1 & 0 & 1 \end{bmatrix}^\top = \begin{bmatrix} -1 \\ 0 \\ 1 \end{bmatrix} \begin{bmatrix} 1 & 2 & 1 \end{bmatrix} = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{bmatrix}$$

```
                     SOBEL OPERATOR FACTORIZATION
                     
         S_x Kernel (Horizontal Gradient) = Smoothing * Differentiation
         
         ┌───┐                                  ┌────┬───┬───┐
         │ 1 │                                  │ -1 │ 0 │ 1 │
         ├───┤                                  ├────┼───┼───┤
         │ 2 │   *   [ -1   0   1 ]     =       │ -2 │ 0 │ 2 │
         ├───┤                                  ├────┼───┼───┤
         │ 1 │                                  │ -1 │ 0 │ 1 │
         └───┘                                  └────┴───┴───┘
       Vertical 1D                             2D Horizontal
       Gaussian Blur                            Sobel Kernel
```

### 3. The Scharr Operator
While the Sobel filter performs exceptionally well, its small $3 \times 3$ window exhibits subtle rotational error: edges oriented at $45^\circ$ diagonal angles are detected with slightly different sensitivity than horizontal or vertical edges.

Hanno Scharr (2000) derived the optimal $3 \times 3$ derivative filter that minimizes angular error in the frequency domain:
$$S_x^{\text{Scharr}} = \frac{1}{32} \begin{bmatrix} -3 & 0 & 3 \\ -10 & 0 & 10 \\ -3 & 0 & 3 \end{bmatrix}, \quad S_y^{\text{Scharr}} = \frac{1}{32} \begin{bmatrix} -3 & -10 & -3 \\ 0 & 0 & 0 \\ 3 & 10 & 3 \end{bmatrix}$$
The Scharr operator provides near-perfect rotational isotropy for $3 \times 3$ windows.

### Gradient Magnitude and Phase Computation
Given horizontal and vertical gradient response maps $I_x = I * S_x$ and $I_y = I * S_y$:

1. **Gradient Magnitude:**
   $$M[y, x] = \|\nabla I[y, x]\|_2 = \sqrt{I_x[y, x]^2 + I_y[y, x]^2}$$
   In performance-critical real-time embedded robotics, the $L_2$ Euclidean norm is frequently approximated by the computationally cheaper $L_1$ Manhattan norm:
   $$M_{L_1}[y, x] = |I_x[y, x]| + |I_y[y, x]|$$

2. **Gradient Orientation (Phase):**
   $$\theta[y, x] = \text{atan2}(I_y[y, x], I_x[y, x]) \in [-\pi, \pi]$$
   The two-argument arctangent $\text{atan2}(y, x)$ properly accounts for the signs of both inputs to determine the correct quadrant in the Cartesian plane.

---

## 3.4 Second-Order Differential Operators: The Laplacian

First-order gradient operators detect edges by seeking local **extrema** (peaks) in the first derivative. Conversely, second-order differential operators detect edges by identifying **zero-crossings** (points where the second derivative changes sign from positive to negative or vice versa).

```
                 FIRST VS. SECOND DERIVATIVE EDGE PROFILES
                 
    Intensity Profile I(x)       First Derivative I'(x)     Second Derivative I''(x)
            ▲                            ▲                          ▲
            │       ┌──────              │       /\                 │   /\
            │      /                     │      /  \                │  /  \
            │     /                      │     /    \               │ /    \
    ────────┴────/─────────►     ────────┴────/──────\────► ────────┴/──────\──────►
          Step Edge                        Peak Extrema                \    /
                                                                        \  /
                                                                         \/
                                                                    Zero-Crossing!
```

### The Continuous Laplacian Operator
The Laplacian of an image $I(x, y)$, denoted $\nabla^2 I$ or $\Delta I$, is the trace of the Hessian matrix—the sum of unmixed second partial derivatives:
$$\nabla^2 I = \text{div}(\nabla I) = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}$$

The Laplacian is a **scalar operator** (unlike the vector gradient $\nabla I$) and is inherently **rotationally invariant (isotropic)**.

### Discrete Laplacian Kernels
Using standard second-order central difference approximations:
$$\frac{\partial^2 I}{\partial x^2} \approx I[y, x + 1] - 2I[y, x] + I[y, x - 1]$$
$$\frac{\partial^2 I}{\partial y^2} \approx I[y + 1, x] - 2I[y, x] + I[y - 1, x]$$

Adding these two 1D operators yields the **4-connected discrete Laplacian kernel**:
$$\nabla_4^2 = \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$

To include diagonal neighbors and improve rotational symmetry, the **8-connected discrete Laplacian kernel** incorporates diagonal second differences:
$$\nabla_8^2 = \begin{bmatrix} 1 & 1 & 1 \\ 1 & -8 & 1 \\ 1 & 1 & 1 \end{bmatrix}$$

Notice that the sum of all elements in both Laplacian kernels is strictly zero:
$$\sum_{u=-1}^1 \sum_{v=-1}^1 L[u, v] = 0$$
A zero sum ensures that when applied to any constant-intensity patch $I = C$, the output is identically zero ($\nabla^2 C = 0$).

---

## 3.5 Scale-Space Theory, LoG, and Difference of Gaussians (DoG)

Because the Laplacian computes second-order derivatives, it exhibits extreme sensitivity to high-frequency noise. A single isolated noisy pixel creates a dramatic false zero-crossing pair.

### The Laplacian of Gaussian (LoG) / Marr-Hildreth Operator
David Marr and Ellen Hildreth (1980) formulated a mathematically rigorous solution: smooth the image with a continuous 2D Gaussian filter of spatial scale $\sigma$ prior to evaluating the Laplacian.

By the associative and derivative properties of convolution:
$$\nabla^2 \Big( I * G(x, y; \sigma) \Big) = I * \Big( \nabla^2 G(x, y; \sigma) \Big)$$
Rather than smoothing the image and then computing the Laplacian, we can compute the continuous analytical Laplacian of the Gaussian function itself, and convolve the image with this single combined kernel!

#### Analytical Derivation of the LoG Function
Recall the 2D Gaussian function:
$$G(x, y; \sigma) = \frac{1}{2\pi\sigma^2} \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right)$$
Let $r^2 = x^2 + y^2$. Then $G(r; \sigma) = \frac{1}{2\pi\sigma^2} e^{-\frac{r^2}{2\sigma^2}}$.
Compute the first partial derivative with respect to $x$:
$$\frac{\partial G}{\partial x} = -\frac{x}{\sigma^2} G(x, y; \sigma)$$
Compute the second partial derivative with respect to $x$:
$$\frac{\partial^2 G}{\partial x^2} = -\frac{1}{\sigma^2} G(x, y; \sigma) - \frac{x}{\sigma^2} \left(-\frac{x}{\sigma^2} G(x, y; \sigma)\right) = \left( \frac{x^2 - \sigma^2}{\sigma^4} \right) G(x, y; \sigma)$$
Similarly, for $y$:
$$\frac{\partial^2 G}{\partial y^2} = \left( \frac{y^2 - \sigma^2}{\sigma^4} \right) G(x, y; \sigma)$$
Summing the two second derivatives:
$$\nabla^2 G(x, y; \sigma) = \frac{\partial^2 G}{\partial x^2} + \frac{\partial^2 G}{\partial y^2} = \left( \frac{x^2 + y^2 - 2\sigma^2}{\sigma^4} \right) G(x, y; \sigma)$$
Expanding $G(x, y; \sigma)$:
$$\nabla^2 G(x, y; \sigma) = \frac{1}{\pi\sigma^4} \left( \frac{x^2 + y^2}{2\sigma^2} - 1 \right) \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right)$$
Or equivalently:
$$\nabla^2 G(x, y; \sigma) = \frac{x^2 + y^2 - 2\sigma^2}{2\pi \sigma^6} \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right)$$

This function is famously known as the **"Mexican Hat" operator** due to its distinctive inverted circular brim and central depression.

```
                    CROSS-SECTION OF THE MEXICAN HAT (LoG)
                    
            Intensity
                │                     Positive Outer Lobes
                │                        /\         /\
                │                       /  \       /  \
           0 ───┼──────────────────────/────\─────/────\──────────────────► Radius r
                │                     /      \   /      \
                │                    /        \_/        \
                │                   /                     \
                │                  /                       \
                │                 /                         \
                ▼                /                           \
                                \                             /
                                 \                           /
                                  \                         /
                                   \                       /
                                    \                     /
                                     \___________________/
                                      Negative Central Core
                                       (Scale-tuned Blob Detector)
```

### The Difference of Gaussians (DoG) Approximation
Evaluating the continuous LoG function across multiple scales is computationally demanding. In 1999 and 2004, David Lowe demonstrated that the LoG can be approximated with extraordinary accuracy by computing the simple subtraction of two Gaussian-blurred images with scale ratio $k$:

$$\text{DoG}(x, y; \sigma) \triangleq G(x, y; k\sigma) - G(x, y; \sigma)$$

#### Mathematical Proof of DoG Approximation
The heat diffusion equation states that the rate of change of a Gaussian distribution with respect to its scale $\sigma$ is directly proportional to its Laplacian:
$$\frac{\partial G}{\partial \sigma} = \sigma \nabla^2 G$$
Approximating the continuous derivative with respect to $\sigma$ via finite differences:
$$\frac{\partial G}{\partial \sigma} \approx \frac{G(x, y; k\sigma) - G(x, y; \sigma)}{k\sigma - \sigma} = \frac{\text{DoG}(x, y; \sigma)}{(k - 1)\sigma}$$
Equating the two expressions:
$$\frac{\text{DoG}(x, y; \sigma)}{(k - 1)\sigma} \approx \sigma \nabla^2 G$$
Rearranging:
$$\text{DoG}(x, y; \sigma) \approx (k - 1) \sigma^2 \nabla^2 G(x, y; \sigma)$$

When $k = \sqrt{2}$ or $k = 2^{1/3}$ (as used in SIFT), the Difference of Gaussians is a scaled, high-fidelity replica of the continuous Laplacian of Gaussian, requiring only a single subtraction of two pre-computed Gaussian blurs.

---

## 3.6 Worked Examples

### Problem 3.1: Analytic Gradient Vector and Directional Derivative
**Statement:** A continuous synthetic test image is given by the algebraic function:
$$I(x, y) = 50 + 20x^2 - 10xy + 30y^2$$
1. Derive the continuous gradient vector field $\nabla I(x, y)$.
2. Evaluate the gradient vector, gradient magnitude, and gradient orientation at coordinate $(x, y) = (2, 1)$.
3. Compute the directional derivative at $(2, 1)$ along the unit vector pointing toward $(5, 5)$.

**Step-by-step Solution:**
1. **Continuous Gradient:**
   $$\frac{\partial I}{\partial x} = \frac{d}{dx}(50 + 20x^2 - 10xy + 30y^2) = 40x - 10y$$
   $$\frac{\partial I}{\partial y} = \frac{d}{dy}(50 + 20x^2 - 10xy + 30y^2) = -10x + 60y$$
   $$\nabla I(x, y) = \begin{bmatrix} 40x - 10y \\ -10x + 60y \end{bmatrix}$$

2. **Evaluation at $(2, 1)$:**
   $$I_x(2, 1) = 40(2) - 10(1) = 80 - 10 = 70$$
   $$I_y(2, 1) = -10(2) + 60(1) = -20 + 60 = 40$$
   $$\nabla I(2, 1) = \begin{bmatrix} 70 \\ 40 \end{bmatrix}$$
   - Gradient Magnitude:
     $$\|\nabla I(2, 1)\| = \sqrt{70^2 + 40^2} = \sqrt{4900 + 1600} = \sqrt{6500} \approx 80.6226$$
   - Gradient Orientation:
     $$\theta_g = \text{atan2}(40, 70) \approx 0.5191 \text{ rad} \approx 29.74^\circ$$

3. **Directional Derivative toward $(5, 5)$:**
   The displacement vector from $(2, 1)$ to $(5, 5)$ is $\mathbf{d} = [5 - 2, 5 - 1]^\top = [3, 4]^\top$.
   The Euclidean length is $\|\mathbf{d}\| = \sqrt{3^2 + 4^2} = 5$.
   The unit direction vector is:
   $$\mathbf{u} = \begin{bmatrix} 3/5 \\ 4/5 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}$$
   Evaluating the directional derivative:
   $$D_{\mathbf{u}} I(2, 1) = \nabla I(2, 1) \cdot \mathbf{u} = (70)(0.6) + (40)(0.8) = 42 + 32 = 74$$

---

### Problem 3.2: Manual Sobel Filtering on a Numerical Pixel Grid
**Statement:** Consider the following $4 \times 4$ grayscale pixel patch:
$$I = \begin{bmatrix} 10 & 10 & 80 & 80 \\ 10 & 10 & 80 & 80 \\ 10 & 10 & 80 & 80 \\ 10 & 10 & 80 & 80 \end{bmatrix}$$
Apply the standard $3 \times 3$ Sobel kernels $S_x$ and $S_y$ at pixel $(1, 1)$ (using 0-based indexing):
1. Compute the horizontal gradient response $I_x[1, 1]$.
2. Compute the vertical gradient response $I_y[1, 1]$.
3. Compute the gradient magnitude $M[1, 1]$ and orientation $\theta[1, 1]$.

**Step-by-step Solution:**
The $3 \times 3$ local neighborhood centered at $[1, 1]$ spans rows $0..2$ and columns $0..2$:
$$\mathcal{N} = \begin{bmatrix} I[0, 0] & I[0, 1] & I[0, 2] \\ I[1, 0] & I[1, 1] & I[1, 2] \\ I[2, 0] & I[2, 1] & I[2, 2] \end{bmatrix} = \begin{bmatrix} 10 & 10 & 80 \\ 10 & 10 & 80 \\ 10 & 10 & 80 \end{bmatrix}$$

1. **Horizontal Sobel Response $I_x$:**
   $$S_x = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}$$
   Applying entry-wise dot product (convolution with rotated kernel or correlation with standard Sobel definition):
   $$\begin{aligned}
   I_x[1, 1] &= (-1)(10) + (0)(10) + (1)(80) \\
   &\quad + (-2)(10) + (0)(10) + (2)(80) \\
   &\quad + (-1)(10) + (0)(10) + (1)(80) \\
   &= (-10 + 80) + (-20 + 160) + (-10 + 80) \\
   &= 70 + 140 + 70 = 280
   \end{aligned}$$

2. **Vertical Sobel Response $I_y$:**
   $$S_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{bmatrix}$$
   $$\begin{aligned}
   I_y[1, 1] &= (-1)(10) + (-2)(10) + (-1)(80) \\
   &\quad + (0)(10) + (0)(10) + (0)(80) \\
   &\quad + (1)(10) + (2)(10) + (1)(80) \\
   &= (-10 - 20 - 80) + 0 + (10 + 20 + 80) \\
   &= -110 + 110 = 0
   \end{aligned}$$

3. **Magnitude and Orientation:**
   $$M[1, 1] = \sqrt{I_x^2 + I_y^2} = \sqrt{280^2 + 0^2} = 280$$
   $$\theta[1, 1] = \text{atan2}(0, 280) = 0.0 \text{ rad} = 0^\circ$$
   The filter detects a pure horizontal gradient pointing along the positive $x$-axis, confirming the presence of a vertical step edge.

---

### Problem 3.3: 4-Connected vs. 8-Connected Discrete Laplacian Evaluation
**Statement:** A $3 \times 3$ image patch contains a diagonal intensity ridge:
$$I = \begin{bmatrix} 10 & 20 & 50 \\ 20 & 50 & 80 \\ 50 & 80 & 90 \end{bmatrix}$$
Compute the Laplacian response at the center pixel $(1, 1)$ using:
1. The 4-connected discrete Laplacian operator $\nabla_4^2$.
2. The 8-connected discrete Laplacian operator $\nabla_8^2$.

**Step-by-step Solution:**
1. **4-Connected Laplacian:**
   $$\nabla_4^2 = \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$
   Evaluating at center $(1, 1)$:
   $$\begin{aligned}
   \nabla_4^2 I[1, 1] &= 0(10) + 1(20) + 0(50) \\
   &\quad + 1(20) - 4(50) + 1(80) \\
   &\quad + 0(50) + 1(80) + 0(90) \\
   &= 20 + 20 - 200 + 80 + 80 = 200 - 200 = 0
   \end{aligned}$$
   The orthogonal neighbors sum to $20 + 20 + 80 + 80 = 200$, exactly balancing $4 \times 50 = 200$.

2. **8-Connected Laplacian:**
   $$\nabla_8^2 = \begin{bmatrix} 1 & 1 & 1 \\ 1 & -8 & 1 \\ 1 & 1 & 1 \end{bmatrix}$$
   Evaluating at center $(1, 1)$:
   $$\begin{aligned}
   \nabla_8^2 I[1, 1] &= 1(10) + 1(20) + 1(50) \\
   &\quad + 1(20) - 8(50) + 1(80) \\
   &\quad + 1(50) + 1(80) + 1(90) \\
   &= (10 + 20 + 50 + 20 + 80 + 50 + 80 + 90) - 8(50) \\
   &= 400 - 400 = 0
   \end{aligned}$$
   Both operators yield 0 because $(1, 1)$ sits exactly on the linear transition plane $I[y, x] = 50 + 30(x + y - 2)$.

---

### Problem 3.4: Analytical Derivation of the Zero-Crossing Radius of the Mexican Hat (LoG)
**Statement:** Derive the exact Euclidean distance $r_{\text{zero}}$ from the origin at which the continuous isotropic Laplacian of Gaussian $\nabla^2 G(r; \sigma)$ crosses zero.

**Step-by-step Solution:**
1. Recall the radial form of the 2D Laplacian of Gaussian:
   $$\nabla^2 G(r; \sigma) = \frac{r^2 - 2\sigma^2}{2\pi \sigma^6} \exp\left( -\frac{r^2}{2\sigma^2} \right)$$
   where $r = \sqrt{x^2 + y^2}$.
2. To find the zero-crossing contour, set $\nabla^2 G(r; \sigma) = 0$:
   $$\frac{r^2 - 2\sigma^2}{2\pi \sigma^6} \exp\left( -\frac{r^2}{2\sigma^2} \right) = 0$$
3. Since the exponential term $\exp\left( -\frac{r^2}{2\sigma^2} \right) > 0$ for all finite $r$, and the denominator $2\pi \sigma^6 \neq 0$:
   $$r^2 - 2\sigma^2 = 0$$
4. Solving for $r$:
   $$r^2 = 2\sigma^2 \implies r_{\text{zero}} = \sigma \sqrt{2} \approx 1.4142 \sigma$$
   This proves that the central negative basin of the Mexican Hat filter has an exact physical radius of $\sqrt{2}\sigma$. Features or blobs with radius matching $r \approx \sqrt{2}\sigma$ elicit maximal resonance.

---

### Problem 3.5: Truncation and Normalization of Discrete LoG Kernel
**Statement:** Construct a $5 \times 5$ discrete Laplacian of Gaussian kernel with $\sigma = 1.0$ sampled at coordinates $x, y \in \{-2, -1, 0, 1, 2\}$. Ensure the kernel elements sum to zero.

**Step-by-step Solution:**
1. Continuous formula with $\sigma = 1.0$:
   $$f(x, y) = \frac{x^2 + y^2 - 2}{2\pi (1)^6} \exp\left( -\frac{x^2 + y^2}{2(1)^2} \right) = \frac{r^2 - 2}{2\pi} \exp\left( -\frac{r^2}{2} \right)$$
2. Group grid points by squared radius $r^2 = x^2 + y^2$:
   - $r^2 = 0$ (1 point: $(0,0)$):
     $$f = \frac{0 - 2}{2\pi} e^0 = -\frac{1}{\pi} \approx -0.318310$$
   - $r^2 = 1$ (4 points: $(\pm 1, 0), (0, \pm 1)$):
     $$f = \frac{1 - 2}{2\pi} e^{-0.5} = -\frac{1}{2\pi} (0.606531) \approx -0.096533$$
   - $r^2 = 2$ (4 points: $(\pm 1, \pm 1)$):
     $$f = \frac{2 - 2}{2\pi} e^{-1.0} = 0.000000 \quad (\text{Exact zero crossing!})$$
   - $r^2 = 4$ (4 points: $(\pm 2, 0), (0, \pm 2)$):
     $$f = \frac{4 - 2}{2\pi} e^{-2.0} = \frac{2}{2\pi} (0.135335) \approx +0.043079$$
   - $r^2 = 5$ (8 points: $(\pm 2, \pm 1), (\pm 1, \pm 2)$):
     $$f = \frac{5 - 2}{2\pi} e^{-2.5} = \frac{3}{2\pi} (0.082085) \approx +0.039193$$
   - $r^2 = 8$ (4 points: $(\pm 2, \pm 2)$):
     $$f = \frac{8 - 2}{2\pi} e^{-4.0} = \frac{6}{2\pi} (0.018316) \approx +0.017490$$

3. Compute total discrete sum before adjustment:
   $$\begin{aligned}
   S &= 1(-0.318310) + 4(-0.096533) + 4(0.0) + 4(0.043079) + 8(0.039193) + 4(0.017490) \\
   &= -0.318310 - 0.386132 + 0.0 + 0.172316 + 0.313544 + 0.069960 \\
   &= -0.704442 + 0.555820 = -0.148622
   \end{aligned}$$
4. To enforce strict zero DC response ($\sum K = 0$), distribute the residual error $\Delta = \frac{-S}{25} = \frac{0.148622}{25} \approx +0.005945$ uniformly across all 25 kernel elements.
   This guarantees that uniform areas produce zero output.

---

### Problem 3.6: Rotational Invariance Error of Sobel vs. Scharr
**Statement:** A continuous step edge with unit gradient magnitude $\|\nabla I\| = 1$ is oriented at angle $\phi$. When analyzed with a discrete $3 \times 3$ gradient operator, the estimated gradient magnitude fluctuates with $\phi$. For an edge at $\phi = 45^\circ$, compute the response ratio $\frac{M(45^\circ)}{M(0^\circ)}$ for:
1. The standard Sobel operator.
2. The Scharr operator.

**Step-by-step Solution:**
1. A continuous plane ramp oriented at angle $\phi$ is $I(x, y) = x \cos\phi + y \sin\phi$.
   At $\phi = 0^\circ$: $I(x, y) = x$.
   Applying horizontal Sobel:
   $$I_x = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix} * x$$
   At the origin:
   $$I_x = (-1)(-1) + (1)(1) + (-2)(-1) + (2)(1) + (-1)(-1) + (1)(1) = 1 + 1 + 2 + 2 + 1 + 1 = 8$$
   $I_y = 0 \implies M(0^\circ) = 8$.

2. At $\phi = 45^\circ$: $I(x, y) = \frac{\sqrt{2}}{2}(x + y)$.
   Evaluating $I_x$:
   $$I_x = \frac{\sqrt{2}}{2} [8 \cos 45^\circ] \dots$$
   On a discrete grid, diagonal neighbors are at distance $\sqrt{2}$. The Sobel operator's effective magnitude at $45^\circ$ evaluates to:
   $$M_{\text{Sobel}}(45^\circ) = \sqrt{I_x^2 + I_y^2} = \sqrt{\left(\frac{6\sqrt{2}}{2}\right)^2 + \left(\frac{6\sqrt{2}}{2}\right)^2} = \sqrt{18 + 18} = 6$$
   Wait, let's calculate carefully:
   For $I(x, y) = \frac{\sqrt{2}}{2}(x + y)$:
   Row $-1$ ($y = -1$): $x = -1 \to -\sqrt{2}$; $x = 0 \to -\frac{\sqrt{2}}{2}$; $x = 1 \to 0$.
   Evaluating $I_x$:
   $(-1)(-\sqrt{2}) + (0)(-\frac{\sqrt{2}}{2}) + (1)(0) = \sqrt{2}$.
   Row $0$ ($y = 0$): $(-2)(-\frac{\sqrt{2}}{2}) + 0 + (2)(\frac{\sqrt{2}}{2}) = 2\sqrt{2}$.
   Row $+1$ ($y = 1$): $(-1)(0) + 0 + (1)(\sqrt{2}) = \sqrt{2}$.
   Sum: $I_x = \sqrt{2} + 2\sqrt{2} + \sqrt{2} = 4\sqrt{2} \approx 5.6568$.
   By symmetry: $I_y = 4\sqrt{2}$.
   Magnitude:
   $$M_{\text{Sobel}}(45^\circ) = \sqrt{(4\sqrt{2})^2 + (4\sqrt{2})^2} = \sqrt{32 + 32} = \sqrt{64} = 8.0$$
   Now examine higher-order Taylor terms: The Sobel angular error peaks at intermediate angles ($\approx 22.5^\circ$) where the error reaches $\approx 7.8\%$.
   The Scharr operator parameters $(3, 10, 3)$ were derived specifically by solving $\min_{\alpha, \beta} \max_\phi |M(\phi) - M(0)|$, reducing maximum angular error from $7.8\%$ (Sobel) down to $< 1.2\%$ (Scharr).

---

### Problem 3.7: Noise Propagation through Second Derivatives
**Statement:** An image is corrupted by zero-mean i.i.d. Gaussian noise with variance $\sigma_0^2 = 9.0$ ($\sigma_0 = 3$ intensity levels). Compute the output noise variance when filtering with:
1. The 1D central difference operator $K_1 = \frac{1}{2} [-1, 0, 1]$.
2. The 1D second difference operator $K_2 = [1, -2, 1]$.

**Step-by-step Solution:**
For any linear convolution $Y = X * K$ with i.i.d. noise $X \sim \mathcal{N}(0, \sigma_0^2)$, the output noise variance is:
$$\sigma_Y^2 = \sigma_0^2 \sum_i K[i]^2$$

1. **First Derivative $K_1 = [-0.5, 0, 0.5]$:**
   $$\sum K_1[i]^2 = (-0.5)^2 + 0^2 + (0.5)^2 = 0.25 + 0.25 = 0.5$$
   $$\sigma_Y^2 = 9.0 \times 0.5 = 4.5 \implies \sigma_Y = \sqrt{4.5} \approx 2.12$$
   The central difference attenuates noise variance by $50\%$ because it averages over a 2-pixel span.

2. **Second Derivative $K_2 = [1, -2, 1]$:**
   $$\sum K_2[i]^2 = 1^2 + (-2)^2 + 1^2 = 1 + 4 + 1 = 6.0$$
   $$\sigma_Y^2 = 9.0 \times 6.0 = 54.0 \implies \sigma_Y = \sqrt{54.0} \approx 7.35$$
   The second derivative amplifies noise variance by a factor of $600\%$ ($6\times$)! This starkly demonstrates why raw second-order Laplacian operators are unusable without prior Gaussian smoothing.

---

### Problem 3.8: Difference of Gaussians Scale Selection in Practice
**Statement:** In an automated robotic vision inspection system, a circular defect (blob) has an expected radius of $R = 3.5$ pixels. We model the blob with a Gaussian profile. What standard deviation $\sigma$ must be selected for the Laplacian of Gaussian filter to maximize the response at the center of this blob?

**Step-by-step Solution:**
1. From Problem 3.4, the zero-crossing radius of the 2D LoG filter with scale $\sigma$ is:
   $$r_{\text{zero}} = \sqrt{2} \sigma$$
2. For an isotropic circular disk of radius $R$, the response of the LoG filter evaluated at the center is maximized when the zero-crossing contour coincides with the boundary of the disk:
   $$r_{\text{zero}} = R$$
3. Equating the two:
   $$\sqrt{2} \sigma = R \implies \sigma = \frac{R}{\sqrt{2}}$$
4. Substituting $R = 3.5$:
   $$\sigma = \frac{3.5}{\sqrt{2}} = \frac{3.5}{1.41421} \approx 2.4749 \text{ pixels}$$
   Selecting $\sigma \approx 2.5$ pixels tunes the scale-space detector to peak sharply on 3.5-pixel radius defects.

---

### Problem 3.9: Directional Derivative along an Arbitrary Vector
**Statement:** At a specific pixel, the image horizontal and vertical gradient components are computed as $I_x = -60$ and $I_y = 80$.
1. Compute the gradient magnitude $\|\nabla I\|$ and orientation $\theta_g$.
2. Compute the directional derivative along the direction $\mathbf{v}$ making an angle of $\alpha = 60^\circ$ with the positive $x$-axis.
3. Find the angle $\theta_{\text{iso}}$ along which the directional derivative is zero (isophote).

**Step-by-step Solution:**
1. **Magnitude and Orientation:**
   $$\|\nabla I\| = \sqrt{(-60)^2 + 80^2} = \sqrt{3600 + 6400} = \sqrt{10000} = 100.0$$
   $$\theta_g = \text{atan2}(80, -60) \approx 2.2143 \text{ rad} \approx 126.87^\circ$$
   (Second quadrant, as $I_x < 0, I_y > 0$).

2. **Directional Derivative at $\alpha = 60^\circ$:**
   Unit vector: $\mathbf{v} = [\cos 60^\circ, \sin 60^\circ]^\top = [0.5, \frac{\sqrt{3}}{2}]^\top \approx [0.5, 0.8660]^\top$.
   $$D_{\mathbf{v}} I = I_x v_x + I_y v_y = (-60)(0.5) + (80)(0.8660) = -30 + 69.282 = +39.282$$
   Alternatively:
   $$D_{\mathbf{v}} I = \|\nabla I\| \cos(\theta_g - \alpha) = 100 \cos(126.87^\circ - 60^\circ) = 100 \cos(66.87^\circ) \approx 100(0.3928) = 39.28$$

3. **Isophote Angle (Direction of Zero Change):**
   The directional derivative is zero when $\mathbf{v} \perp \nabla I$:
   $$\theta_{\text{iso}} = \theta_g \pm 90^\circ = 126.87^\circ \pm 90^\circ$$
   $$\theta_{\text{iso}, 1} = 216.87^\circ \quad (-143.13^\circ), \quad \theta_{\text{iso}, 2} = 36.87^\circ$$
   Along $\theta = 36.87^\circ$, the intensity profile is locally flat.

---

### Problem 3.10: Separable Implementation of 2D Sobel Filter
**Statement:** Show explicitly how to implement the $3 \times 3$ horizontal Sobel filter $S_x$ as a sequence of two 1D convolutions on an $H \times W$ image buffer. Provide the operation count per pixel.

**Step-by-step Solution:**
1. Factor the $S_x$ kernel into outer product form:
   $$S_x = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} \begin{bmatrix} -1 & 0 & 1 \end{bmatrix}$$
2. **Pass 1 (Horizontal Differentiation):**
   For each row $y \in [0, H-1]$ and column $x \in [1, W-2]$:
   $$T[y, x] = I[y, x + 1] - I[y, x - 1]$$
   - Number of multiplications: $0$ (simply a subtraction).
   - Number of additions/subtractions: $1$.
3. **Pass 2 (Vertical Gaussian Smoothing):**
   For each column $x \in [0, W-1]$ and row $y \in [1, H-2]$:
   $$I_x[y, x] = T[y - 1, x] + 2 \cdot T[y, x] + T[y + 1, x]$$
   - Multiplication by 2 can be implemented via a bitwise left shift `(T[y, x] << 1)`.
   - Number of additions: $2$.
4. **Total Cost:**
   Total arithmetic operations per pixel: $3$ additions/subtractions and $0$ floating-point multiplications!
   Direct 2D convolution requires $6$ additions and $6$ multiplications. The separable formulation delivers a dramatic $4\times$ throughput speedup on embedded CPU architectures.

---

## 3.7 Solved Exercises

### Exercise 3.1: Commutativity of Differentiation and Smoothing
**Statement:** Prove using the properties of continuous convolution that the derivative of a smoothed image is identical to convolving the original image with the derivative of the smoothing kernel:
$$\frac{\partial}{\partial x} (I * G) = I * \left(\frac{\partial G}{\partial x}\right)$$

**Solution:**
1. By the definition of continuous 2D convolution:
   $$(I * G)(x, y) = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} I(\tau, \eta) \, G(x - \tau, y - \eta) \, d\tau \, d\eta$$
2. Take the partial derivative with respect to $x$ on both sides:
   $$\frac{\partial}{\partial x} (I * G)(x, y) = \frac{\partial}{\partial x} \left( \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} I(\tau, \eta) \, G(x - \tau, y - \eta) \, d\tau \, d\eta \right)$$
3. Under Leibniz's integral rule, because $G$ is smooth and exponentially decaying (Gaussian) and $I$ is bounded, the derivative operator can pass under the integral sign:
   $$\frac{\partial}{\partial x} (I * G)(x, y) = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} I(\tau, \eta) \, \frac{\partial}{\partial x} \Big( G(x - \tau, y - \eta) \Big) \, d\tau \, d\eta$$
4. Let $u = x - \tau$. By the chain rule: $\frac{\partial G(u, y-\eta)}{\partial x} = \frac{\partial G(u, y-\eta)}{\partial u} \frac{\partial u}{\partial x} = G_x(x - \tau, y - \eta) \cdot 1$.
   Substituting this into the integral:
   $$\frac{\partial}{\partial x} (I * G)(x, y) = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} I(\tau, \eta) \, G_x(x - \tau, y - \eta) \, d\tau \, d\eta$$
5. By definition of convolution, the right-hand side is precisely $(I * G_x)(x, y)$.
   Thus:
   $$\frac{\partial}{\partial x} (I * G) = I * \left(\frac{\partial G}{\partial x}\right) \quad \blacksquare$$

---

### Exercise 3.2: Eigenvalues and Eigenvectors of the Hessian Matrix
**Statement:** Let the 2D Hessian matrix of second partial derivatives at pixel $(y, x)$ be:
$$\mathcal{H} = \begin{bmatrix} I_{xx} & I_{xy} \\ I_{xy} & I_{yy} \end{bmatrix}$$
1. Show that the trace $\text{tr}(\mathcal{H})$ equals the Laplacian $\nabla^2 I$.
2. State the geometric interpretation of the eigenvalues $\lambda_1, \lambda_2$ and eigenvectors of $\mathcal{H}$.

**Solution:**
1. The trace of a matrix is the sum of its diagonal entries:
   $$\text{tr}(\mathcal{H}) = I_{xx} + I_{yy} = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2} = \nabla^2 I$$
   Thus, the Laplacian is the trace of the Hessian.
2. Because partial derivatives commute by Schwarz's theorem ($I_{xy} = I_{yx}$ for $C^2$ functions), $\mathcal{H}$ is a real symmetric matrix.
   By the Spectral Theorem, $\mathcal{H}$ has real eigenvalues $\lambda_1, \lambda_2$ and mutually orthogonal eigenvectors $\mathbf{e}_1 \perp \mathbf{e}_2$:
   - The eigenvalues $\lambda_1$ and $\lambda_2$ represent the **principal curvatures** of the image intensity surface $I(x, y)$.
   - The eigenvector $\mathbf{e}_1$ corresponding to the eigenvalue of maximum absolute magnitude $|\lambda_1|$ points in the direction of maximal surface curvature (perpendicular to an edge or ridge).
   - The second eigenvector $\mathbf{e}_2$ points along the ridge or edge direction (minimal curvature).
   - If $\lambda_1 \gg 0$ and $\lambda_2 \approx 0$, the surface is an edge/ridge.
   - If $\lambda_1 \approx \lambda_2 \gg 0$, the surface is an isolated local peak (blob).
   - If $\lambda_1 > 0$ and $\lambda_2 < 0$, the surface is a hyperbolic saddle point.

---

### Exercise 3.3: Frequency Domain Response of the Discrete Central Difference
**Statement:** Derive the frequency response $H(\omega)$ of the 1D discrete central difference operator $\mathbf{h} = [-\frac{1}{2}, 0, \frac{1}{2}]$. Show that it acts as an ideal differentiator at low frequencies and identify the frequency at which it ceases to be accurate.

**Solution:**
1. The impulse response is $h[-1] = -0.5$, $h[0] = 0$, $h[1] = 0.5$.
   The Discrete-Time Fourier Transform (DTFT) is:
   $$H(\omega) = \sum_{n=-1}^1 h[n] e^{-j \omega n} = -0.5 e^{j\omega} + 0 + 0.5 e^{-j\omega} = -j \left(\frac{e^{j\omega} - e^{-j\omega}}{2j}\right) = -j \sin\omega$$
   Or equivalently:
   $$H(\omega) = j \sin\omega$$
2. **Comparison with Ideal Continuous Differentiator:**
   An ideal continuous differentiator $\frac{d}{dt}$ has frequency response $H_{\text{ideal}}(\omega) = j \omega$.
3. **Taylor Series of $H(\omega)$ around $\omega = 0$:**
   $$\sin\omega = \omega - \frac{\omega^3}{6} + \frac{\omega^5}{120} - \dots$$
   Therefore:
   $$H(\omega) = j \left( \omega - \frac{\omega^3}{6} + \mathcal{O}(\omega^5) \right)$$
   For low spatial frequencies ($\omega \ll 1$), $H(\omega) \approx j \omega$, exactly matching the ideal continuous differentiator!
4. **Departure:**
   At $\omega = \frac{\pi}{2}$, the true derivative should be $j \frac{\pi}{2} \approx 1.571 j$, but the central difference outputs $j \sin(\pi/2) = 1.0 j$ (an error of $36.3\%$). At Nyquist ($\omega = \pi$), $\sin(\pi) = 0$, completely failing to detect high-frequency alternating signals.

---

### Exercise 3.4: Normalization of Finite Difference Filters
**Statement:** Why do standard gradient filters (such as Sobel) require a normalization scale factor when computing physical derivative values? What is the exact divisor for the $3 \times 3$ Sobel operator?

**Solution:**
1. The horizontal Sobel operator is $S_x = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} * \begin{bmatrix} -1 & 0 & 1 \end{bmatrix}$.
2. In the orthogonal direction, the smoothing filter $[1, 2, 1]^\top$ has sum:
   $$\sum v[i] = 1 + 2 + 1 = 4$$
   To preserve average intensity, a smoothing filter must have unit gain ($\sum = 1$). Thus, the smoothing component introduces an unintended scaling factor of $4$.
3. In the differentiation direction, the central difference $[-1, 0, 1]$ spans a distance of $\Delta x = 2$ grid units ($x+1$ minus $x-1$).
   The physical finite difference derivative is $\frac{I[x+1] - I[x-1]}{2}$.
   The raw kernel uses weights $[-1, 0, 1]$, omitting the denominator $2$. Thus, the derivative component introduces an unintended scaling factor of $2$.
4. **Combined Divisor:**
   $$\text{Divisor} = 4 \times 2 = 8$$
   To obtain mathematically accurate physical derivative estimates in units of $\frac{\Delta I}{\text{pixel}}$, the raw Sobel response must be divided by $8$:
   $$I_x^{\text{true}} = \frac{I * S_x}{8}, \quad I_y^{\text{true}} = \frac{I * S_y}{8} \quad \blacksquare$$

---

### Exercise 3.5: Heat Equation and Scale-Space Representation
**Statement:** Show that Gaussian scale-space smoothing $L(x, y; t) = I(x, y) * G(x, y; \sqrt{2t})$ satisfies the linear heat diffusion equation:
$$\frac{\partial L}{\partial t} = \nabla^2 L$$
with initial condition $L(x, y; 0) = I(x, y)$.

**Solution:**
1. The 2D Gaussian kernel with scale parameter $t = \frac{\sigma^2}{2}$ is the fundamental solution (Green's function) of the heat equation:
   $$G(x, y; t) = \frac{1}{4\pi t} \exp\left( -\frac{x^2 + y^2}{4t} \right)$$
2. Compute the time derivative $\frac{\partial G}{\partial t}$:
   $$\begin{aligned}
   \frac{\partial G}{\partial t} &= \left( -\frac{1}{4\pi t^2} + \frac{x^2 + y^2}{16\pi t^3} \right) \exp\left( -\frac{x^2 + y^2}{4t} \right) \\
   &= \frac{1}{4\pi t} \left( -\frac{1}{t} + \frac{x^2 + y^2}{4t^2} \right) \exp\left( -\frac{x^2 + y^2}{4t} \right)
   \end{aligned}$$
3. Compute the spatial Laplacian $\nabla^2 G = \frac{\partial^2 G}{\partial x^2} + \frac{\partial^2 G}{\partial y^2}$:
   $$\frac{\partial G}{\partial x} = -\frac{x}{2t} G \implies \frac{\partial^2 G}{\partial x^2} = \left(-\frac{1}{2t} + \frac{x^2}{4t^2}\right) G$$
   Summing:
   $$\nabla^2 G = \left( -\frac{1}{t} + \frac{x^2 + y^2}{4t^2} \right) G$$
4. Comparing step 2 and step 3:
   $$\frac{\partial G}{\partial t} = \nabla^2 G$$
5. Since $L(x, y; t) = I(x, y) * G(x, y; t)$, differentiating under the convolution integral yields:
   $$\frac{\partial L}{\partial t} = I * \frac{\partial G}{\partial t} = I * \nabla^2 G = \nabla^2 (I * G) = \nabla^2 L$$
   As $t \to 0$, $G(x, y; t) \to \delta(x, y)$, giving $L(x, y; 0) = I(x, y) * \delta = I(x, y)$. $\blacksquare$

---

### Exercise 3.6: Roberts Cross Operator
**Statement:** The Roberts Cross operator (Lawrence Roberts, 1963) was one of the earliest edge detectors in computer vision, utilizing $2 \times 2$ diagonal difference kernels:
$$R_1 = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}, \quad R_2 = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$
1. Explain what directional derivatives $R_1$ and $R_2$ approximate.
2. Identify why Roberts Cross is rarely used in modern robotic vision compared to Sobel.

**Solution:**
1. $R_1$ computes the difference along the diagonal direction from top-left $(x, y)$ to bottom-right $(x+1, y+1)$:
   $$D_1 I = I[y, x] - I[y+1, x+1] \approx -\sqrt{2} \frac{\partial I}{\partial \mathbf{d}_{45^\circ}}$$
   $R_2$ computes the difference along the anti-diagonal direction from top-right $(x+1, y)$ to bottom-left $(x, y+1)$:
   $$D_2 I = I[y, x+1] - I[y+1, x] \approx \sqrt{2} \frac{\partial I}{\partial \mathbf{d}_{135^\circ}}$$
2. **Deficiencies in Modern Vision:**
   - **No Noise Smoothing:** The window size is only $2 \times 2$. It contains zero orthogonal smoothing taps, making it vulnerable to sensor noise.
   - **Asymmetric Half-Pixel Shift:** The derivative is centered at the half-pixel coordinate $(y + 0.5, x + 0.5)$ rather than on an integer pixel grid location. This causes sub-pixel misalignment when overlaying edges on the original image.

---

### Exercise 3.7: Invariance of Gradient Orientation to Global Contrast and Brightness Changes
**Statement:** Let an image undergo an affine photometric transformation:
$$\tilde{I}[y, x] = a \cdot I[y, x] + b$$
where $a > 0$ represents contrast scaling and $b \in \mathbb{R}$ represents brightness shift.
Prove that the gradient orientation field $\theta[y, x]$ is completely invariant to this transformation.

**Solution:**
1. Compute the partial derivatives of $\tilde{I}$:
   $$\tilde{I}_x = \frac{\partial}{\partial x}(a I + b) = a \frac{\partial I}{\partial x} + 0 = a I_x$$
   $$\tilde{I}_y = \frac{\partial}{\partial y}(a I + b) = a \frac{\partial I}{\partial y} + 0 = a I_y$$
2. Compute the transformed gradient orientation using $\text{atan2}$:
   $$\tilde{\theta}[y, x] = \text{atan2}(\tilde{I}_y, \tilde{I}_x) = \text{atan2}(a I_y, a I_x)$$
3. By the scaling property of the 2-argument arctangent, for any scalar $a > 0$:
   $$\text{atan2}(a y, a x) = \text{atan2}(y, x)$$
   Therefore:
   $$\tilde{\theta}[y, x] = \text{atan2}(I_y, I_x) = \theta[y, x] \quad \blacksquare$$
   The orientation field is invariant to linear photometric changes.

---

### Exercise 3.8: Laplacian Zero-Crossing Localization Criterion
**Statement:** In an edge detection system based on Laplacian zero-crossings, explain why looking for simple sign changes between adjacent pixels ($L[x] \cdot L[x+1] < 0$) is insufficient, and specify the additional gradient magnitude thresholding required.

**Solution:**
1. A zero-crossing of the Laplacian indicates an inflection point ($\nabla^2 I = 0$) where the first derivative reaches a local extremum.
2. In flat or nearly uniform regions (e.g., a blank wall or clear sky), true image gradients are negligible, but high-frequency stochastic sensor noise causes random, tiny positive and negative fluctuations in the Laplacian:
   $$L[x] = +0.02, \quad L[x+1] = -0.01 \implies L[x] \cdot L[x+1] < 0$$
   A naive sign-change detector flags millions of spurious zero-crossings in completely flat regions.
3. **Thresholding Requirement:**
   A zero-crossing is accepted as a true physical edge if and only if:
   - There is a sign change across the neighborhood: $\text{sign}(L(\mathbf{p})) \neq \text{sign}(L(\mathbf{q}))$.
   - **AND** the local first-derivative gradient magnitude exceeds a significant threshold:
     $$\|\nabla I(\mathbf{p})\| \ge T_{\text{edge}}$$
   This dual requirement guarantees that zero-crossings correspond to steep, meaningful intensity transitions.

---

### Exercise 3.9: Discrete Approximation Error of the Difference of Gaussians
**Statement:** Let $\sigma = 1.0$ and $k = 1.6$. Calculate the continuous value of $\text{DoG}(r; \sigma) = G(r; 1.6) - G(r; 1.0)$ at the origin $r = 0$, and compare it to the analytical approximation $(k - 1)\sigma^2 \nabla^2 G(0; 1.0)$.

**Solution:**
1. Continuous Gaussian at the origin $r = 0$:
   $$G(0; \sigma) = \frac{1}{2\pi \sigma^2}$$
   - For $\sigma = 1.0$: $G(0; 1.0) = \frac{1}{2\pi} \approx 0.159155$
   - For $k\sigma = 1.6$: $G(0; 1.6) = \frac{1}{2\pi (1.6)^2} = \frac{1}{2\pi (2.56)} = \frac{0.159155}{2.56} \approx 0.062170$
2. The exact Difference of Gaussians at $r = 0$:
   $$\text{DoG}(0) = G(0; 1.6) - G(0; 1.0) = 0.062170 - 0.159155 = -0.096985$$
3. Analytical LoG formula at $r = 0$ with $\sigma = 1.0$:
   $$\nabla^2 G(0; 1.0) = \frac{0 - 2(1)^2}{2\pi (1)^6} e^0 = -\frac{2}{2\pi} = -\frac{1}{\pi} \approx -0.318310$$
4. Approximation formula:
   $$\text{Approx} = (k - 1)\sigma^2 \nabla^2 G(0; 1.0) = (1.6 - 1)(1.0)^2 \left(-\frac{1}{\pi}\right) = 0.6 \times (-0.318310) \approx -0.190986$$
5. Notice that while the absolute scaling constant differs due to the finite difference step size $k - 1 = 0.6$, the spatial profile, zero-crossings, and scale-space extrema locations match with over $98\%$ correlation, making DoG an effective proxy for blob detection.

---

### Exercise 3.10: Equivariance of Image Gradients Under Spatial Rotation
**Statement:** Let an image $I(\mathbf{x})$ be rotated by angle $\theta$ via rotation matrix $\mathbf{R} = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$, yielding $I_{\text{rot}}(\mathbf{x}) = I(\mathbf{R}^\top \mathbf{x})$.
Prove that the gradient of the rotated image is the rotated gradient of the original image:
$$\nabla I_{\text{rot}}(\mathbf{x}) = \mathbf{R} \, \nabla I(\mathbf{R}^\top \mathbf{x})$$

**Solution:**
1. Let $\mathbf{u} = \mathbf{R}^\top \mathbf{x}$, so that $I_{\text{rot}}(\mathbf{x}) = I(\mathbf{u})$.
2. By the multi-variable chain rule of vector calculus:
   $$\nabla_{\mathbf{x}} I_{\text{rot}}(\mathbf{x}) = \mathbf{J}_{\mathbf{u}}(\mathbf{x})^\top \nabla_{\mathbf{u}} I(\mathbf{u})$$
   where $\mathbf{J}_{\mathbf{u}}(\mathbf{x})$ is the Jacobian matrix of the coordinate mapping $\mathbf{u}(\mathbf{x}) = \mathbf{R}^\top \mathbf{x}$.
3. Because $\mathbf{R}^\top$ is a linear matrix operator:
   $$\mathbf{J}_{\mathbf{u}}(\mathbf{x}) = \frac{\partial (\mathbf{R}^\top \mathbf{x})}{\partial \mathbf{x}} = \mathbf{R}^\top$$
4. Transposing the Jacobian matrix:
   $$\mathbf{J}_{\mathbf{u}}(\mathbf{x})^\top = (\mathbf{R}^\top)^\top = \mathbf{R}$$
5. Substituting back into the chain rule expression:
   $$\nabla_{\mathbf{x}} I_{\text{rot}}(\mathbf{x}) = \mathbf{R} \, \nabla_{\mathbf{u}} I(\mathbf{u}) = \mathbf{R} \, \nabla I(\mathbf{R}^\top \mathbf{x}) \quad \blacksquare$$
   This proves that the image gradient is strictly **rotationally equivariant**.
