# Chapter 2: Linear Spatial Filtering, Discrete 2D Convolution, and Correlation

---

## 2.1 Mathematical Foundations of 2D Spatial Filtering

In digital image processing and robotic visual perception, spatial filtering is the fundamental mechanism through which an image is enhanced, smoothed, sharpened, or analyzed. A spatial filter operates directly on the pixel grid by transforming each pixel value as a function of its local spatial neighborhood.

```
                           THE SPATIAL FILTERING PARADIGM
                           
       Input Image I[y, x]                   Spatial Kernel K[u, v]
    ┌───────────────────────┐                    ┌───────────────┐
    │ .   .   .   .   .   . │                    │ -1 │  0 │  1  │
    │ .   ┌───────────┐   . │                    ├────┼────┼─────┤
    │ .   │ p0  p1 p2 │   . │   Neighbourhood    │ -2 │  0 │  2  │
    │ .   │ p3  p4 p5 │   . │ ───────────────►   ├────┼────┼─────┤
    │ .   │ p6  p7 p8 │   . │   Multiplication   │ -1 │  0 │  1  │
    │ .   └───────────┘   . │   & Summation      └───────────────┘
    │ .   .   .   .   .   . │                            │
    └───────────────────────┘                            ▼
                                                Filtered Output O[y, x]
```

### Continuous vs. Discrete Systems
In the continuous 2D domain, a linear shift-invariant (LSI) system transforms an input irradiance distribution $f(x, y)$ by convolving it with the system's impulse response (also termed the Point Spread Function, or PSF) $h(x, y)$:
$$g(x, y) = (f * h)(x, y) = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} f(\tau, \eta) \, h(x - \tau, y - \eta) \, d\tau \, d\eta$$

When mapped onto a discrete sensor matrix of discrete coordinates $(y, x) \in \mathbb{Z}^2$, the integral transitions into a double summation over a compact kernel window $\Omega \subset \mathbb{Z}^2$.

### 2D Cross-Correlation vs. 2D Convolution
In computer science and deep learning frameworks, the operations of **cross-correlation** and **convolution** are often used interchangeably in terminology, yet they possess a precise mathematical distinction: a $180^\circ$ spatial flip of the kernel.

Let $I[y, x]$ denote a 2D image matrix of dimensions $H \times W$, and let $K[u, v]$ denote a spatial filter kernel of odd dimensions $(2k + 1) \times (2k + 1)$ with spatial radius $k \in \mathbb{N}$ centered at origin $(0, 0)$.

#### 1. Discrete 2D Cross-Correlation
The 2D discrete cross-correlation, denoted by the operator $\otimes$, slides the kernel over the image without reorienting its axes:
$$(I \otimes K)[y, x] = \sum_{u=-k}^k \sum_{v=-k}^k I[y + u, x + v] \, K[u, v]$$
Cross-correlation measures the local template similarity between the kernel pattern $K$ and local image patches.

#### 2. Discrete 2D Convolution
The 2D discrete convolution, denoted by the operator $*$, reverses (flips) both spatial coordinates of the kernel prior to shifting and summing:
$$(I * K)[y, x] = \sum_{u=-k}^k \sum_{v=-k}^k I[y - u, x - v] \, K[u, v]$$
By performing the substitution of dummy indices $u' = -u$ and $v' = -v$, convolution is equivalently expressed as:
$$(I * K)[y, x] = \sum_{u'=-k}^k \sum_{v'=-k}^k I[y + u', x + v'] \, K[-u', -v']$$

Defining the rotated kernel $K_{\text{rot}}[u, v] \triangleq K[-u, -v]$ (which corresponds to reflecting $K$ both horizontally and vertically, equivalent to a $180^\circ$ planar rotation):
$$(I * K)[y, x] = (I \otimes K_{\text{rot}})[y, x]$$

> [!NOTE]
> If a kernel $K$ is radially symmetric (or centrally symmetric such that $K[-u, -v] = K[u, v]$ for all $(u, v)$), such as a Gaussian blur filter or a Laplacian filter, then $K_{\text{rot}} = K$. For all centrally symmetric kernels, discrete 2D convolution and 2D cross-correlation are mathematically identical.

### Algebraic Properties of 2D Convolution
Discrete 2D convolution is a Linear Shift-Invariant (LSI) operator that satisfies the following algebraic axioms:
1. **Commutativity:**
   $$I * K = K * I$$
   *(Cross-correlation is generally non-commutative: $I \otimes K \neq K \otimes I$.)*
2. **Associativity:**
   $$(I * K_1) * K_2 = I * (K_1 * K_2)$$
   This property is of paramount engineering importance: cascading multiple linear filters (e.g., blurring an image with $K_1$ and then computing derivatives with $K_2$) can be pre-computed by convolving the two kernels into a single combined kernel $K_{\text{comb}} = K_1 * K_2$.
3. **Distributivity over Addition:**
   $$I * (K_1 + K_2) = (I * K_1) + (I * K_2)$$
4. **Shift Invariance:**
   If $\mathcal{S}_{\Delta y, \Delta x}(I)[y, x] = I[y - \Delta y, x - \Delta x]$ is a spatial translation operator, then:
   $$\mathcal{S}_{\Delta y, \Delta x}(I * K) = (\mathcal{S}_{\Delta y, \Delta x} I) * K$$

---

## 2.2 Boundary Conditions and Padding Strategies

When a kernel of dimensions $(2k_y + 1) \times (2k_x + 1)$ is evaluated at a pixel $[y, x]$ near the image periphery (where $y < k_y$, $y \ge H - k_y$, $x < k_x$, or $x \ge W - k_x$), the kernel window extends beyond the physical boundary of the image buffer. To evaluate the summation, a deterministic boundary extension policy must be specified.

```
                    IMAGE BOUNDARY PADDING STRATEGIES
                    
      Zero-Padding              Clamp / Replicate          Reflect / Mirror
   ┌───┬───┬───┬───┐          ┌───┬───┬───┬───┐          ┌───┬───┬───┬───┐
   │ 0 │ 0 │ 0 │ 0 │          │ a │ a │ b │ c │          │ b │ a │ b │ c │
   ├───┼───┼───┼───┤          ├───┼───┼───┼───┤          ├───┼───┼───┼───┤
   │ 0 │ a │ b │ c │          │ a │ a │ b │ c │          │ a │ a │ b │ c │
   ├───┼───┼───┼───┤          ├───┼───┼───┼───┤          ├───┼───┼───┼───┤
   │ 0 │ d │ e │ f │          │ d │ d │ e │ f │          │ d │ d │ e │ f │
   └───┴───┴───┴───┘          └───┴───┴───┴───┘          └───┴───┴───┴───┘
   (Attenuates border)        (Preserves border levels)   (Eliminates step jumps)
```

### 1. Zero Padding (Constant Border)
All virtual coordinates outside the valid domain $[0, H-1] \times [0, W-1]$ are assigned a constant scalar of zero:
$$I_{\text{padded}}[y, x] = \begin{cases} I[y, x] & \text{if } 0 \le y < H \text{ and } 0 \le x < W \\ 0 & \text{otherwise} \end{cases}$$
*Trade-off:* Causes severe dark vignetting artifacts along image borders when applying low-pass smoothing filters, as the zeros artificially depress the local neighborhood mean.

### 2. Clamp Padding (Replicate / Nearest)
Out-of-bounds coordinates are projected onto the nearest valid boundary pixel:
$$I_{\text{padded}}[y, x] = I[\text{clamp}(y, 0, H - 1), \, \text{clamp}(x, 0, W - 1)]$$
where $\text{clamp}(v, a, b) = \max(a, \min(v, b))$.
*Trade-off:* Preserves local DC energy level; avoids the artificial darkening of zero padding. However, it creates artificial constant streaks in derivative filters.

### 3. Reflect / Mirror Padding
Out-of-bounds coordinates are folded symmetrically back into the image array across the boundary:
- **Even / Symmetrical Reflection (Border Doubled):**
  $$I[-1] = I[0], \quad I[-2] = I[1], \quad \dots$$
- **Odd / Half-Sample Symmetric Reflection (Border Not Doubled):**
  $$I[-1] = I[1], \quad I[-2] = I[2], \quad \dots$$
*Trade-off:* Minimizes first-derivative discontinuities at the boundary, making it the preferred standard for spatial filtering in scientific vision pipelines.

### 4. Periodic / Circular (Wrap) Padding
Coordinates are wrapped toroidally using the modulo operator:
$$I_{\text{padded}}[y, x] = I[y \bmod H, \, x \bmod W]$$
*Trade-off:* Implied naturally by the 2D Discrete Fourier Transform (DFT). Unless the left and right (or top and bottom) edges match seamlessly, wrap padding introduces massive high-frequency step discontinuities.

### Output Dimension Classification
Given an input image of size $H \times W$ and a kernel of size $K_h \times K_w$:
1. **`Valid` Convolution:** Only evaluate positions where the kernel fully overlaps the input without padding:
   $$H_{\text{out}} = H - K_h + 1, \quad W_{\text{out}} = W - K_w + 1$$
2. **`Same` Convolution:** Pad the input by $p_h = \lfloor K_h / 2 \rfloor$ and $p_w = \lfloor K_w / 2 \rfloor$ such that the output matches the input dimensions:
   $$H_{\text{out}} = H, \quad W_{\text{out}} = W$$
3. **`Full` Convolution:** Pad the input by $K_h - 1$ and $K_w - 1$ to capture all possible partial overlaps:
   $$H_{\text{out}} = H + K_h - 1, \quad W_{\text{out}} = W + K_w - 1$$

---

## 2.3 Linear Smoothing Filters: Box Filter vs. Gaussian Blur

Smoothing filters are low-pass spatial operators designed to attenuate high-frequency fluctuations (stochastic photon shot noise, thermal Johnson noise) while preserving low-frequency structural content.

### The Box (Mean) Filter
The continuous 2D Box filter is a rectangular window function of physical width $D$. In the discrete domain, a $(2k+1) \times (2k+1)$ box filter assigns uniform weight to all pixels within its footprint:
$$K_{\text{box}}[u, v] = \frac{1}{(2k + 1)^2} \quad \text{for } -k \le u, v \le k$$

For a $3 \times 3$ box filter ($k = 1$):
$$K_{\text{box}} = \frac{1}{9} \begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}$$

#### Spectral Flaws of the Box Filter
In the continuous frequency domain, the Fourier transform of a 2D rectangular box function $\text{rect}(x/D, y/D)$ is a 2D Sinc function:
$$\mathcal{F}\{\text{rect}(x/D, y/D)\}(\omega_x, \omega_y) = D^2 \, \text{sinc}\left(\frac{\omega_x D}{2}\right) \text{sinc}\left(\frac{\omega_y D}{2}\right)$$
where $\text{sinc}(\theta) \triangleq \frac{\sin\theta}{\theta}$.

The Sinc function exhibits significant high-frequency side lobes (the first secondary lobe peaks at roughly $-13.3\text{ dB}$, or $21.7\%$ amplitude). Consequently:
- High-frequency noise is not monotonically suppressed.
- Sinc side lobes cause prominent **ringing artifacts** (ripples near sharp edges).
- The square kernel boundary introduces artificial horizontal and vertical directional bias.

```
          FOURIER SPECTRUM: BOX FILTER VS. GAUSSIAN FILTER
          
        Box Filter Spectrum (Sinc)          Gaussian Spectrum (Gaussian)
             Amplitude                            Amplitude
             │     /\                             │     /\
             │    /  \                            │    /  \
             │   /    \                           │   /    \
             │  /      \     /\                   │  /      \
             │ /        \___/  \___               │ /        \________
             └──────────────────────► ω           └──────────────────────► ω
               (Secondary Sinc Lobes)              (Monotonic Exponential Falloff)
```

### The 2D Gaussian Filter
The continuous isotropic 2D Gaussian function with standard deviation $\sigma > 0$ is defined as:
$$G(x, y; \sigma) = \frac{1}{2\pi\sigma^2} \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right)$$

The continuous Fourier transform of a Gaussian is another Gaussian:
$$\mathcal{F}\{G(x, y; \sigma)\}(\omega_x, \omega_y) = \exp\left( -\frac{\sigma^2 (\omega_x^2 + \omega_y^2)}{2} \right)$$
The Gaussian filter is uniquely optimal among all linear spatial filters because:
1. **No Ringing:** Its frequency response has zero side lobes, decaying monotonically to zero. It never inverts phase or creates spurious oscillating fringes.
2. **Isotropy (Rotational Invariance):** $G(x, y; \sigma)$ depends strictly on Euclidean radius $r^2 = x^2 + y^2$. It smooths equally in all directions without angular bias.
3. **Scale-Space Axiom:** It is the only linear scale-space kernel that guarantees no new local extrema (zero-crossings) are created as scale $\sigma$ increases.

### Discrete Gaussian Kernel Construction
To construct a discrete $(2k + 1) \times (2k + 1)$ Gaussian kernel:
1. Choose kernel half-width $k$. To capture the vast majority of the Gaussian distribution, set $k = \lceil 3\sigma \rceil$ (since the interval $[-3\sigma, +3\sigma]$ encloses $99.73\%$ of total volume).
2. Sample the continuous Gaussian at integer grid coordinates $(u, v) \in [-k, k] \times [-k, k]$:
   $$\tilde{K}[u, v] = \exp\left( -\frac{u^2 + v^2}{2\sigma^2} \right)$$
3. Normalize by the discrete sum to enforce strict energy conservation (unit DC gain):
   $$K_G[u, v] = \frac{\tilde{K}[u, v]}{\sum_{i=-k}^k \sum_{j=-k}^k \tilde{K}[i, j]}$$
   Unit sum guarantees that convolving a region of uniform intensity $C$ yields $C * \sum K_G = C$ with zero photometric drift.

---

## 2.4 Computational Efficiency via Kernel Separability

A 2D filter kernel $K \in \mathbb{R}^{K_h \times K_w}$ is termed **separable** if it can be factored into the outer product of two 1D vectors $\mathbf{v} \in \mathbb{R}^{K_h}$ and $\mathbf{h} \in \mathbb{R}^{K_w}$:
$$K = \mathbf{v} \, \mathbf{h}^\top \iff K[u, v] = v[u] \cdot h[v]$$

### Separability of the Gaussian Kernel
Expanding the 2D Gaussian formula demonstrates immediate separability:
$$G(x, y; \sigma) = \frac{1}{2\pi\sigma^2} \exp\left( -\frac{x^2 + y^2}{2\sigma^2} \right) = \left( \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{x^2}{2\sigma^2} \right) \right) \cdot \left( \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{y^2}{2\sigma^2} \right) \right)$$
Thus:
$$G(x, y; \sigma) = G_{\text{1D}}(x; \sigma) \cdot G_{\text{1D}}(y; \sigma)$$

By the associativity of 2D convolution:
$$I * G = I * (G_y * G_x) = (I * G_y) * G_x$$

```
                         2D SEPARABLE FILTER DECOMPOSITION
                         
    Direct 2D Convolution (K x K):           Separable 1D Cascaded (2 x K):
    
          ┌───┬───┬───┐                              ┌───┬───┬───┐
          │   │   │   │                              │ h │ h │ h │  1D Horizontal Pass
          ├───┼───┼───┤                              └───┴───┴───┘
          │   │ K │   │                                    │
          ├───┼───┼───┤                                    ▼
          │   │   │   │                              ┌───┐
          └───┴───┴───┘                              │ v │
                                                     ├───┤
                                                     │ v │  1D Vertical Pass
                                                     ├───┤
                                                     │ v │
                                                     └───┘
       K^2 Operations per Pixel                   2*K Operations per Pixel
```

### Algorithmic Complexity Comparison
Consider filtering an image of dimensions $H \times W$ with a square kernel of size $K \times K$:
1. **Direct 2D Convolution:**
   For every pixel, $K^2$ multiplications and $K^2 - 1$ additions are performed:
   $$\text{FLOPs}_{\text{direct}} = H \cdot W \cdot (2 K^2 - 1) = \mathcal{O}(H \cdot W \cdot K^2)$$
2. **Separable 1D Cascade:**
   - First convolve each row with the 1D horizontal kernel $\mathbf{h} \in \mathbb{R}^{1 \times K}$: $K$ multiplications and $K - 1$ additions per pixel.
   - Then convolve each column of the intermediate result with the 1D vertical kernel $\mathbf{v} \in \mathbb{R}^{K \times 1}$: $K$ multiplications and $K - 1$ additions per pixel.
   $$\text{FLOPs}_{\text{separable}} = H \cdot W \cdot (2K - 1) + H \cdot W \cdot (2K - 1) = H \cdot W \cdot (4K - 2) = \mathcal{O}(H \cdot W \cdot 2K)$$

#### Speedup Factor
$$\text{Speedup} = \frac{\mathcal{O}(K^2)}{\mathcal{O}(2K)} = \frac{K}{2}$$

For standard vision filters:
- $K = 5$: $\text{Speedup} \approx 2.5\times$
- $K = 11$: $\text{Speedup} \approx 5.5\times$
- $K = 31$: $\text{Speedup} \approx 15.5\times$

For a high-definition $1920 \times 1080$ frame and $K = 15$:
- Direct: $1920 \times 1080 \times 225 \approx 4.66 \times 10^8$ operations.
- Separable: $1920 \times 1080 \times 30 \approx 6.22 \times 10^7$ operations (an elimination of over 400 million computations per frame).

---

## 2.5 Non-Linear Filtering: Median and Bilateral Filters

While linear filters can effectively attenuate additive Gaussian noise, they fail fundamentally in two ubiquitous scenarios:
1. **Impulse Noise:** Outlier pixels with extreme corrupted values.
2. **Boundary Preservation:** Linear smoothing blurs true object edges, destroying the high-frequency cues required for object localization.

### The Median Filter (Rank-Order Filter)
Impulse noise (salt-and-pepper noise) models bit errors or dead sensor photo-sites where a pixel takes an extreme maximum or minimum value:
$$I_{\text{noisy}}[y, x] = \begin{cases} 255 & \text{with probability } p/2 \quad \text{("salt")} \\ 0 & \text{with probability } p/2 \quad \text{("pepper")} \\ I[y, x] & \text{with probability } 1 - p \end{cases}$$

If a linear box or Gaussian filter is applied to a single salt pixel ($255$) in a dark neighborhood ($0$), the output averages the outlier:
$$O[y, x] = \frac{255 + 0 + \dots + 0}{9} \approx 28.3$$
The extreme value is not eliminated; it is diffused into an expanded halo.

The **Median Filter** replaces each pixel with the statistical median of all pixels in its $(2k+1) \times (2k+1)$ neighborhood $\mathcal{N}(y, x)$:
$$I_{\text{med}}[y, x] = \text{median}\Big(\{ I[y + u, x + v] \mid -k \le u, v \le k \}\Big)$$

```
                       MEDIAN FILTER VS. IMPULSE NOISE
                       
        Local 3x3 Window                     Sorted Neighborhood Values
    ┌─────┬─────┬─────┐                      ┌───┬───┬───┬────┬────┬────┬────┬────┬─────┐
    │  12 │  15 │  14 │                      │ 9 │12 │14 │ 15 │ 16 │ 18 │ 21 │ 22 │ 255 │
    ├─────┼─────┼─────┤                      └───┴───┴───┴────┴────┴────┴────┴────┴─────┘
    │  16 │ 255 │  18 │                                           ▲
    ├─────┼─────┼─────┤                                           │
    │   9 │  21 │  22 │                                     MEDIAN = 16
    └─────┴─────┴─────┘                      (The extreme 255 outlier is discarded!)
```

#### Properties of Median Filtering:
- **Zero Haloing:** Outliers occupying less than half the window area ($< \frac{K^2}{2}$) are completely purged.
- **Edge Preservation:** Monotonic step edges with width greater than $k$ are preserved with zero blurring.
- **Corner Rounding:** Sharp acute corners narrower than the window radius are clipped.

### The Bilateral Filter: Edge-Preserving Smoothing
Introduced by Tomasi and Manduchi (1998), the **Bilateral Filter** extends the Gaussian filter by conditioning spatial weights on radiometric intensity similarity.

A standard Gaussian filter weights nearby pixels $\mathbf{q}$ solely by geometric spatial distance $\|\mathbf{p} - \mathbf{q}\|$. The bilateral filter introduces a second Gaussian weight based on photometric distance $|I(\mathbf{p}) - I(\mathbf{q})|$:

$$I_{\text{bilateral}}(\mathbf{p}) = \frac{1}{W_{\mathbf{p}}} \sum_{\mathbf{q} \in \Omega} I(\mathbf{q}) \cdot G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|) \cdot G_{\sigma_r}(|I(\mathbf{p}) - I(\mathbf{q})|)$$

where the normalization factor $W_{\mathbf{p}}$ enforces unit total weight:
$$W_{\mathbf{p}} = \sum_{\mathbf{q} \in \Omega} G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|) \cdot G_{\sigma_r}(|I(\mathbf{p}) - I(\mathbf{q})|)$$

The spatial and range Gaussian kernels are:
$$G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|) = \exp\left( -\frac{\|\mathbf{p} - \mathbf{q}\|^2}{2\sigma_s^2} \right)$$
$$G_{\sigma_r}(|I(\mathbf{p}) - I(\mathbf{q})|) = \exp\left( -\frac{(I(\mathbf{p}) - I(\mathbf{q}))^2}{2\sigma_r^2} \right)$$

```
                       THE BILATERAL FILTER KERNEL WEIGHTING
                       
     Spatial Distance Weight G_s            Radiometric Range Weight G_r
           (Domain Filter)                        (Range Filter)
             Gaussian Falloff                       Gaussian Falloff
             based on distance                      based on |I(p) - I(q)|
                    │                                      │
                    └───────────────────┬──────────────────┘
                                        ▼
                             Combined Product Weight:
                                w(p, q) = G_s * G_r
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
          Flat Homogeneous Patch                         Sharp Step Edge
     |I(p) - I(q)| ≈ 0 ──► G_r ≈ 1             |I(p) - I(q)| >> σ_r ──► G_r ≈ 0
    Acts as standard Gaussian blur             Cross-edge pixels receive 0 weight!
       (Suppresses sensor noise)               (Edge remains razor-sharp!)
```

---

## 2.6 Worked Examples

### Problem 2.1: Manual Calculation of 2D Convolution vs. Correlation
**Statement:** Consider the $3 \times 3$ image patch $I$ and $3 \times 3$ kernel $K$:
$$I = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}, \quad K = \begin{bmatrix} 1 & 0 & -1 \\ 2 & 0 & -2 \\ 1 & 0 & -1 \end{bmatrix}$$
Compute:
1. The 2D cross-correlation response $(I \otimes K)$ at center pixel $(1, 1)$.
2. The 2D convolution response $(I * K)$ at center pixel $(1, 1)$.

**Step-by-step Solution:**
1. **Cross-Correlation $(I \otimes K)[1, 1]$:**
   By definition:
   $$(I \otimes K)[1, 1] = \sum_{u=-1}^1 \sum_{v=-1}^1 I[1+u, 1+v] K[u, v]$$
   Expanding entry-by-entry:
   $$\begin{aligned}
   (I \otimes K)[1, 1] &= I[0, 0]K[-1, -1] + I[0, 1]K[-1, 0] + I[0, 2]K[-1, 1] \\
   &\quad + I[1, 0]K[0, -1] + I[1, 1]K[0, 0] + I[1, 2]K[0, 1] \\
   &\quad + I[2, 0]K[1, -1] + I[2, 1]K[1, 0] + I[2, 2]K[1, 1]
   \end{aligned}$$
   Mapping kernel indices where $(u, v) \in \{-1, 0, 1\} \times \{-1, 0, 1\}$:
   $$K = \begin{bmatrix} K[-1, -1] & K[-1, 0] & K[-1, 1] \\ K[0, -1] & K[0, 0] & K[0, 1] \\ K[1, -1] & K[1, 0] & K[1, 1] \end{bmatrix} = \begin{bmatrix} 1 & 0 & -1 \\ 2 & 0 & -2 \\ 1 & 0 & -1 \end{bmatrix}$$
   Evaluating the product:
   $$\begin{aligned}
   (I \otimes K)[1, 1] &= (1)(1) + (2)(0) + (3)(-1) \\
   &\quad + (4)(2) + (5)(0) + (6)(-2) \\
   &\quad + (7)(1) + (8)(0) + (9)(-1) \\
   &= (1 - 3) + (8 - 12) + (7 - 9) \\
   &= -2 - 4 - 2 = -8
   \end{aligned}$$

2. **Convolution $(I * K)[1, 1]$:**
   By definition, convolution flips the kernel by $180^\circ$:
   $$K_{\text{rot}}[u, v] = K[-u, -v] \implies K_{\text{rot}} = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}$$
   Evaluating $(I \otimes K_{\text{rot}})[1, 1]$:
   $$\begin{aligned}
   (I * K)[1, 1] &= (1)(-1) + (2)(0) + (3)(1) \\
   &\quad + (4)(-2) + (5)(0) + (6)(2) \\
   &\quad + (7)(-1) + (8)(0) + (9)(1) \\
   &= (-1 + 3) + (-8 + 12) + (-7 + 9) \\
   &= 2 + 4 + 2 = +8
   \end{aligned}$$
   Notice that $(I * K)[1, 1] = -(I \otimes K)[1, 1]$ because the kernel is anti-symmetric horizontally ($K[u, -v] = -K[u, v]$).

---

### Problem 2.2: Boundary Padding Comparison
**Statement:** A 1D signal is given by $\mathbf{x} = [10, 20, 30, 40]$. We filter it with the 3-tap kernel $\mathbf{k} = [0.25, 0.5, 0.25]$. Compute the filtered value at index $0$ under:
1. Zero padding.
2. Clamp (replicate) padding.
3. Mirror (reflect, border not doubled) padding.

**Step-by-step Solution:**
The convolution at index $0$ requires neighbor indices $-1, 0, 1$:
$$y[0] = x[-1] \cdot 0.25 + x[0] \cdot 0.5 + x[1] \cdot 0.25$$
We know $x[0] = 10$ and $x[1] = 20$. We must evaluate $x[-1]$ under each policy:
1. **Zero padding:**
   $$x[-1] = 0 \implies y[0] = (0)(0.25) + (10)(0.5) + (20)(0.25) = 0 + 5.0 + 5.0 = 10.0$$
2. **Clamp padding:**
   $$x[-1] = x[0] = 10 \implies y[0] = (10)(0.25) + (10)(0.5) + (20)(0.25) = 2.5 + 5.0 + 5.0 = 12.5$$
3. **Mirror padding (half-sample symmetric):**
   $$x[-1] = x[1] = 20 \implies y[0] = (20)(0.25) + (10)(0.5) + (20)(0.25) = 5.0 + 5.0 + 5.0 = 15.0$$

---

### Problem 2.3: Derivation of Discrete Normalized Gaussian Kernel
**Statement:** Construct a $3 \times 3$ discrete Gaussian kernel with $\sigma = 1.0$ sampled on the coordinate grid $u, v \in \{-1, 0, 1\}$. Normalize the kernel such that the sum of all elements equals exactly $1$.

**Step-by-step Solution:**
1. Continuous formula: $\tilde{K}[u, v] = \exp\left( -\frac{u^2 + v^2}{2\sigma^2} \right)$. With $\sigma = 1.0$, $2\sigma^2 = 2.0$:
   $$\tilde{K}[u, v] = \exp\left( -\frac{u^2 + v^2}{2} \right)$$
2. Evaluate unnormalized values for each unique distance $r^2 = u^2 + v^2$:
   - Center $(0, 0)$: $r^2 = 0 \implies \exp(0) = 1.0$
   - Orthogonal neighbors $(\pm 1, 0), (0, \pm 1)$: $r^2 = 1 \implies \exp(-0.5) \approx 0.60653066$
   - Diagonal neighbors $(\pm 1, \pm 1)$: $r^2 = 2 \implies \exp(-1.0) \approx 0.36787944$
3. Assemble the unnormalized matrix $\tilde{K}$:
   $$\tilde{K} = \begin{bmatrix} 0.367879 & 0.606531 & 0.367879 \\ 0.606531 & 1.000000 & 0.606531 \\ 0.367879 & 0.606531 & 0.367879 \end{bmatrix}$$
4. Compute total sum $S$:
   $$S = 1.0 + 4(0.60653066) + 4(0.36787944) = 1.0 + 2.42612264 + 1.47151776 = 4.89764040$$
5. Divide every element by $S$:
   - Center: $K[0, 0] = \frac{1.0}{4.8976404} \approx 0.204179$
   - Orthogonal: $K[\pm 1, 0] = \frac{0.60653066}{4.8976404} \approx 0.123841$
   - Diagonal: $K[\pm 1, \pm 1] = \frac{0.36787944}{4.8976404} \approx 0.075114$
6. Normalized matrix:
   $$K_G = \begin{bmatrix} 0.0751 & 0.1238 & 0.0751 \\ 0.1238 & 0.2042 & 0.1238 \\ 0.0751 & 0.1238 & 0.0751 \end{bmatrix}$$
   Verification of sum: $4(0.075114) + 4(0.123841) + 0.204179 = 0.300456 + 0.495364 + 0.204179 = 0.999999 \approx 1.0$.

---

### Problem 2.4: Separability Proof for Gaussian Convolution
**Statement:** Prove analytically that convolving an image $I[y, x]$ with the 2D Gaussian kernel $K_G[u, v] = \mathbf{g}[u] \mathbf{g}[v]$ is mathematically identical to first convolving all rows of $I$ with 1D kernel $\mathbf{g}$, followed by convolving all columns of the result with $\mathbf{g}$.

**Step-by-step Solution:**
1. The 2D convolution is:
   $$(I * K_G)[y, x] = \sum_{u=-k}^k \sum_{v=-k}^k I[y - u, x - v] K_G[u, v]$$
2. Substitute the separable factorization $K_G[u, v] = \mathbf{g}[u] \mathbf{g}[v]$:
   $$(I * K_G)[y, x] = \sum_{u=-k}^k \sum_{v=-k}^k I[y - u, x - v] \, \mathbf{g}[u] \, \mathbf{g}[v]$$
3. Because $\mathbf{g}[u]$ does not depend on the inner summation index $v$, factor it outside:
   $$(I * K_G)[y, x] = \sum_{u=-k}^k \mathbf{g}[u] \left( \sum_{v=-k}^k I[y - u, x - v] \, \mathbf{g}[v] \right)$$
4. Define the intermediate 1D horizontal convolution result $J[y', x]$:
   $$J[y', x] \triangleq \sum_{v=-k}^k I[y', x - v] \, \mathbf{g}[v] = (I *_{\text{row}} \mathbf{g})[y', x]$$
5. Substitute $J$ back into the outer summation:
   $$(I * K_G)[y, x] = \sum_{u=-k}^k J[y - u, x] \, \mathbf{g}[u] = (J *_{\text{col}} \mathbf{g})[y, x]$$
   Thus, $(I * K_G) = (I *_{\text{row}} \mathbf{g}) *_{\text{col}} \mathbf{g}$, proving separability. $\blacksquare$

---

### Problem 2.5: Quantitative Comparison of Median vs. Mean Filtering on Impulse Noise
**Statement:** A flat sensor region with true intensity $50$ is corrupted by salt noise at the center pixel:
$$I = \begin{bmatrix} 50 & 50 & 50 \\ 50 & 255 & 50 \\ 50 & 50 & 50 \end{bmatrix}$$
Calculate:
1. The output of a $3 \times 3$ Box (Mean) filter at the center.
2. The output of a $3 \times 3$ Median filter at the center.
3. The absolute error relative to true ground truth ($50$) for both filters.

**Step-by-step Solution:**
1. **Box Filter:**
   $$O_{\text{mean}}[1, 1] = \frac{1}{9} \sum_{i=0}^2 \sum_{j=0}^2 I[i, j] = \frac{8 \times 50 + 255}{9} = \frac{400 + 255}{9} = \frac{655}{9} \approx 72.78$$
2. **Median Filter:**
   Extract the 9 values in the neighborhood:
   $$\mathcal{S} = \{ 50, 50, 50, 50, 50, 50, 50, 50, 255 \}$$
   Sorted order:
   $$\mathcal{S}_{\text{sorted}} = [50, 50, 50, 50, \mathbf{50}, 50, 50, 50, 255]$$
   The median (5th element, index 4):
   $$O_{\text{med}}[1, 1] = 50$$
3. **Absolute Errors:**
   - Mean filter error: $|72.78 - 50| = 22.78$
   - Median filter error: $|50 - 50| = 0.0$
   The median filter achieves perfect reconstruction, whereas the mean filter leaves a noticeable artifact.

---

### Problem 2.6: Bilateral Filter Calculation on a Step Edge
**Statement:** Consider an image containing a sharp vertical step edge:
$$I = \begin{bmatrix} 20 & 20 & 180 \\ 20 & 20 & 180 \\ 20 & 20 & 180 \end{bmatrix}$$
We evaluate the bilateral filter at the center pixel $\mathbf{p} = (1, 1)$ with $I(\mathbf{p}) = 20$.
Parameters: spatial $\sigma_s = 1.0$, radiometric $\sigma_r = 30.0$.
Compute the filtered output $I_{\text{bilateral}}(1, 1)$.

**Step-by-step Solution:**
1. Pixels $\mathbf{q} = (y, x)$ are indexed by $u = y - 1 \in \{-1, 0, 1\}$ and $v = x - 1 \in \{-1, 0, 1\}$.
   Spatial weight: $w_s(u, v) = \exp\left( -\frac{u^2 + v^2}{2(1.0)^2} \right) = \exp\left( -\frac{u^2 + v^2}{2} \right)$.
   Radiometric weight: $w_r(u, v) = \exp\left( -\frac{(I[y, x] - 20)^2}{2(30.0)^2} \right) = \exp\left( -\frac{(I[y, x] - 20)^2}{1800} \right)$.
2. Group the 9 pixels into categories based on $(u, v)$ and intensity $I$:
   - **Pixels with $I = 20$:** $(I - 20) = 0 \implies w_r = \exp(0) = 1.0$.
     - Center $(0, 0)$: $r^2 = 0 \implies w_s = 1.0 \implies w = 1.0 \times 1.0 = 1.0000$
     - $(0, -1)$: $r^2 = 1 \implies w_s = e^{-0.5} \approx 0.6065 \implies w = 0.6065$
     - $(-1, 0), (1, 0)$: $r^2 = 1 \implies w_s \approx 0.6065 \implies w = 0.6065$ each
     - $(-1, -1), (1, -1)$: $r^2 = 2 \implies w_s = e^{-1.0} \approx 0.3679 \implies w = 0.3679$ each
   - **Pixels with $I = 180$ (Column $x = 2$, so $v = +1$):**
     Intensity difference: $\Delta I = 180 - 20 = 160$.
     Radiometric weight:
     $$w_r = \exp\left( -\frac{160^2}{1800} \right) = \exp\left( -\frac{25600}{1800} \right) = \exp(-14.222) \approx 6.659 \times 10^{-7}$$
     - $(-1, 1)$: $r^2 = 2 \implies w_s \approx 0.3679 \implies w = 0.3679 \times (6.659 \times 10^{-7}) \approx 2.45 \times 10^{-7}$
     - $(0, 1)$: $r^2 = 1 \implies w_s \approx 0.6065 \implies w = 0.6065 \times (6.659 \times 10^{-7}) \approx 4.04 \times 10^{-7}$
     - $(1, 1)$: $r^2 = 2 \implies w_s \approx 0.3679 \implies w \approx 2.45 \times 10^{-7}$
3. Compute total normalization factor $W_{\mathbf{p}}$:
   $$\begin{aligned}
   W_{\mathbf{p}} &= \sum w(u, v) = (1.0 + 3 \times 0.60653 + 2 \times 0.36788) + (8.94 \times 10^{-7}) \\
   &= (1.0 + 1.81959 + 0.73576) + \mathcal{O}(10^{-7}) \\
   &= 3.55535
   \end{aligned}$$
4. Compute weighted sum of intensities:
   $$\begin{aligned}
   \sum w(u, v) I[y, x] &= 20 \times (3.55535) + 180 \times (8.94 \times 10^{-7}) \\
   &= 71.1070 + 0.00016 = 71.10716
   \end{aligned}$$
5. Final normalized output:
   $$I_{\text{bilateral}}(1, 1) = \frac{71.10716}{3.55535} = 20.00004 \approx 20.0$$
   The pixels with value 180 across the edge receive effectively zero weight ($\sim 10^{-7}$). The edge is preserved perfectly without blurring across the boundary!

---

### Problem 2.7: Frequency Response and Attenuation of Box Filter
**Statement:** A 1D discrete box filter of length $N = 3$ is defined by $\mathbf{h} = [\frac{1}{3}, \frac{1}{3}, \frac{1}{3}]$.
1. Derive its Discrete-Time Fourier Transform (DTFT) $H(\omega)$.
2. Calculate the magnitude response $|H(\omega)|$ at normalized frequencies $\omega = 0$, $\omega = \frac{\pi}{3}$, and $\omega = \pi$ (Nyquist frequency).

**Step-by-step Solution:**
1. DTFT definition:
   $$H(\omega) = \sum_{n=-1}^1 h[n] e^{-j \omega n} = \frac{1}{3} e^{j\omega} + \frac{1}{3} + \frac{1}{3} e^{-j\omega}$$
   Using Euler's identity $e^{j\omega} + e^{-j\omega} = 2\cos\omega$:
   $$H(\omega) = \frac{1}{3} (1 + 2\cos\omega)$$
2. Evaluate at frequencies:
   - **At $\omega = 0$ (DC component):**
     $$H(0) = \frac{1}{3}(1 + 2\cos 0) = \frac{1}{3}(1 + 2) = 1.0 \implies |H(0)| = 1.0 \quad (0\text{ dB})$$
   - **At $\omega = \frac{\pi}{3}$:**
     $$\cos\left(\frac{\pi}{3}\right) = 0.5 \implies H\left(\frac{\pi}{3}\right) = \frac{1}{3}(1 + 2(0.5)) = \frac{1}{3}(2) = \frac{2}{3} \approx 0.667$$
   - **At $\omega = \pi$ (Nyquist frequency):**
     $$\cos(\pi) = -1.0 \implies H(\pi) = \frac{1}{3}(1 + 2(-1)) = \frac{1}{3}(-1) = -\frac{1}{3}$$
     Magnitude:
     $$|H(\pi)| = \left|-\frac{1}{3}\right| = \frac{1}{3} \approx 0.333$$
   Notice that $|H(\pi)| = 0.333 \neq 0$: high-frequency Nyquist signals are only attenuated by $66.7\%$, and the negative sign indicates phase reversal (inverted contrast).

---

### Problem 2.8: Convolution Associativity for Kernel Composition
**Statement:** An image is to be filtered sequentially by two $1 \times 3$ derivative approximation kernels:
$$K_1 = \begin{bmatrix} 1 & -1 & 0 \end{bmatrix}, \quad K_2 = \begin{bmatrix} 0 & 1 & -1 \end{bmatrix}$$
Using the associativity of convolution, compute the single composite kernel $K_{\text{comb}} = K_1 * K_2$ that accomplishes both operations in a single pass.

**Step-by-step Solution:**
1. Represent $K_1$ and $K_2$ with origin at the middle element (index 0):
   $$K_1[-1] = 1, \quad K_1[0] = -1, \quad K_1[1] = 0$$
   $$K_2[-1] = 0, \quad K_2[0] = 1, \quad K_2[1] = -1$$
2. The discrete convolution formula:
   $$K_{\text{comb}}[n] = (K_1 * K_2)[n] = \sum_{m} K_1[m] K_2[n - m]$$
   The length of $K_{\text{comb}}$ is $3 + 3 - 1 = 5$ elements, spanning indices $n \in \{-2, -1, 0, 1, 2\}$.
3. Compute each index:
   - $n = -2$:
     $$K_{\text{comb}}[-2] = K_1[-1] K_2[-1] = (1)(0) = 0$$
   - $n = -1$:
     $$K_{\text{comb}}[-1] = K_1[-1] K_2[0] + K_1[0] K_2[-1] = (1)(1) + (-1)(0) = 1$$
   - $n = 0$:
     $$K_{\text{comb}}[0] = K_1[-1] K_2[1] + K_1[0] K_2[0] + K_1[1] K_2[-1] = (1)(-1) + (-1)(1) + (0)(0) = -1 - 1 = -2$$
   - $n = 1$:
     $$K_{\text{comb}}[1] = K_1[0] K_2[1] + K_1[1] K_2[0] = (-1)(-1) + (0)(1) = 1$$
   - $n = 2$:
     $$K_{\text{comb}}[2] = K_1[1] K_2[1] = (0)(-1) = 0$$
4. Assembled composite kernel:
   $$K_{\text{comb}} = \begin{bmatrix} 1 & -2 & 1 \end{bmatrix}$$
   This is the standard 1D discrete second-derivative (Laplacian) finite difference operator.

---

### Problem 2.9: Memory Bandwidth and Throughput in Separable vs. Direct 2D Convolution
**Statement:** A robotics vision system processes $1280 \times 720$ grayscale frames (1 byte per pixel) at 60 FPS using an $11 \times 11$ Gaussian blur.
1. Calculate the number of multiplications per second required by direct 2D convolution.
2. Calculate the number of multiplications per second required by separable 1D convolution.
3. Compute the computational reduction percentage.

**Step-by-step Solution:**
1. **Total pixels per second:**
   $$N_{\text{pixels/sec}} = 1280 \times 720 \times 60 = 55,296,000 \text{ pixels/sec}$$
2. **Direct 2D Convolution:**
   Kernel size: $K = 11 \implies K^2 = 121$ multiplications per pixel.
   $$\text{Mults}_{\text{direct}} = 55,296,000 \times 121 = 6,690,816,000 \approx 6.69 \times 10^9 \text{ Mults/sec} \quad (6.69\text{ GFLOPS})$$
3. **Separable 1D Convolution:**
   Two passes of length $K = 11 \implies 2K = 22$ multiplications per pixel.
   $$\text{Mults}_{\text{sep}} = 55,296,000 \times 22 = 1,216,512,000 \approx 1.22 \times 10^9 \text{ Mults/sec} \quad (1.22\text{ GFLOPS})$$
4. **Reduction Percentage:**
   $$\text{Reduction} = \left( 1 - \frac{22}{121} \right) \times 100\% = \left( 1 - \frac{2}{11} \right) \times 100\% \approx 81.82\%$$
   The separable formulation eliminates over $5.47$ billion arithmetic operations every second.

---

### Problem 2.10: Edge Preservation Metrics: PSNR and SSIM
**Statement:** Two filtering algorithms, $A$ (linear Gaussian blur) and $B$ (bilateral filter), are tested on an image with sharp edges. The Mean Squared Error (MSE) on an 8-bit image ($MAX_I = 255$) is measured as $\text{MSE}_A = 45.0$ and $\text{MSE}_B = 12.5$.
1. Compute the Peak Signal-to-Noise Ratio ($\text{PSNR}$) in decibels ($\text{dB}$) for both filters.
2. If the ground-truth image has mean $\mu_x = 120$, variance $\sigma_x^2 = 400$, and filter $B$ yields reconstructed patch with $\mu_y = 120$, $\sigma_y^2 = 380$, and covariance $\sigma_{xy} = 375$, compute the Structural Similarity Index ($\text{SSIM}$) for Filter $B$ with stability constants $C_1 = (0.01 \times 255)^2 = 6.5025$ and $C_2 = (0.03 \times 255)^2 = 58.5225$.

**Step-by-step Solution:**
1. **PSNR Calculation:**
   $$\text{PSNR} = 10 \log_{10}\left( \frac{\text{MAX}_I^2}{\text{MSE}} \right) = 10 \log_{10}\left( \frac{65025}{\text{MSE}} \right)$$
   - Filter A:
     $$\text{PSNR}_A = 10 \log_{10}\left( \frac{65025}{45.0} \right) = 10 \log_{10}(1445.0) \approx 10 \times 3.15987 = 31.60\text{ dB}$$
   - Filter B:
     $$\text{PSNR}_B = 10 \log_{10}\left( \frac{65025}{12.5} \right) = 10 \log_{10}(5202.0) \approx 10 \times 3.71617 = 37.16\text{ dB}$$
   Filter B achieves a $+5.56\text{ dB}$ improvement in signal fidelity.

2. **SSIM Calculation for Filter B:**
   The SSIM index is defined as:
   $$\text{SSIM}(x, y) = \frac{(2\mu_x \mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}$$
   - Luminance term:
     $$\frac{2(120)(120) + 6.5025}{120^2 + 120^2 + 6.5025} = \frac{28800 + 6.5025}{28800 + 6.5025} = 1.0000$$
   - Contrast and Structure terms:
     $$\frac{2(375) + 58.5225}{400 + 380 + 58.5225} = \frac{750 + 58.5225}{780 + 58.5225} = \frac{808.5225}{838.5225} \approx 0.96422$$
   - Combined SSIM:
     $$\text{SSIM} = 1.0000 \times 0.96422 = 0.9642$$

---

## 2.7 Solved Exercises

### Exercise 2.1: Commutativity of Discrete 2D Convolution
**Statement:** Prove algebraically from first principles that discrete 2D convolution is commutative: $(I * K)[y, x] = (K * I)[y, x]$ for arbitrary finite discrete 2D signals.

**Solution:**
By definition of discrete 2D convolution:
$$(I * K)[y, x] = \sum_{u=-\infty}^{\infty} \sum_{v=-\infty}^{\infty} I[y - u, x - v] \, K[u, v]$$
Perform a change of summation variables. Let:
$$a = y - u \implies u = y - a$$
$$b = x - v \implies v = x - b$$
As $u$ and $v$ range from $-\infty$ to $\infty$, $a$ and $b$ likewise range from $\infty$ to $-\infty$. Since summation over $\mathbb{Z}$ is invariant under index reversal:
$$(I * K)[y, x] = \sum_{a=-\infty}^{\infty} \sum_{b=-\infty}^{\infty} I[a, b] \, K[y - a, x - b]$$
Since multiplication of real numbers is commutative ($I[a, b] K[...] = K[...] I[a, b]$):
$$(I * K)[y, x] = \sum_{a=-\infty}^{\infty} \sum_{b=-\infty}^{\infty} K[y - a, x - b] \, I[a, b]$$
The right-hand side is the exact mathematical definition of $(K * I)[y, x]$. Thus:
$$(I * K)[y, x] = (K * I)[y, x] \quad \blacksquare$$

---

### Exercise 2.2: Rank of a Separable Kernel Matrix
**Statement:** Prove that an $M \times N$ discrete filter kernel $K$ is separable if and only if the matrix rank of $K$ is exactly $1$.

**Solution:**
1. **Necessity ($\implies$):**
   Suppose $K$ is separable. Then there exist non-zero vectors $\mathbf{v} \in \mathbb{R}^M$ and $\mathbf{h} \in \mathbb{R}^N$ such that:
   $$K = \mathbf{v} \, \mathbf{h}^\top$$
   In component form, $K_{i, j} = v_i h_j$. Every column $j$ of $K$ is given by $K_{:, j} = h_j \mathbf{v}$, which is a scalar multiple of the single column vector $\mathbf{v}$. Because all columns are linearly dependent on $\mathbf{v}$ and $\mathbf{v} \neq \mathbf{0}$, the column space has dimension $\dim(\text{col}(K)) = 1$. Hence, $\text{rank}(K) = 1$.
2. **Sufficiency ($\impliedby$):**
   Suppose $\text{rank}(K) = 1$. By the Singular Value Decomposition (SVD):
   $$K = \sum_{i=1}^r \sigma_i \mathbf{u}_i \mathbf{w}_i^\top$$
   Because the rank $r = 1$, all singular values for $i \ge 2$ are zero:
   $$K = \sigma_1 \mathbf{u}_1 \mathbf{w}_1^\top = (\sqrt{\sigma_1} \mathbf{u}_1) (\sqrt{\sigma_1} \mathbf{w}_1)^\top$$
   Setting $\mathbf{v} = \sqrt{\sigma_1} \mathbf{u}_1$ and $\mathbf{h} = \sqrt{\sigma_1} \mathbf{w}_1$, we have $K = \mathbf{v} \mathbf{h}^\top$, proving $K$ is separable. $\blacksquare$

---

### Exercise 2.3: Verification of Separability for Given Kernels
**Statement:** Determine whether each of the following $3 \times 3$ kernels is separable. If separable, find the 1D vectors $\mathbf{v}$ and $\mathbf{h}$; if not, prove why:
$$K_A = \begin{bmatrix} 1 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 1 \end{bmatrix}, \quad K_B = \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$

**Solution:**
1. **Kernel $K_A$:**
   Row 1: $\mathbf{r}_1 = [1, 2, 1]$.
   Row 2: $\mathbf{r}_2 = [2, 4, 2] = 2 \cdot \mathbf{r}_1$.
   Row 3: $\mathbf{r}_3 = [1, 2, 1] = 1 \cdot \mathbf{r}_1$.
   All rows are linear multiples of $[1, 2, 1]$. Thus $\text{rank}(K_A) = 1$, and $K_A$ is separable.
   Factoring:
   $$K_A = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} \begin{bmatrix} 1 & 2 & 1 \end{bmatrix}$$
   So $\mathbf{v} = [1, 2, 1]^\top$ and $\mathbf{h} = [1, 2, 1]^\top$.

2. **Kernel $K_B$:**
   Consider rows 1 and 2:
   $$\mathbf{r}_1 = [0, 1, 0], \quad \mathbf{r}_2 = [1, -4, 1]$$
   Assume there exists a scalar $c$ such that $\mathbf{r}_2 = c \mathbf{r}_1$. Then:
   $$1 = c \cdot 0 \implies \text{contradiction!}$$
   Therefore, $\mathbf{r}_1$ and $\mathbf{r}_2$ are linearly independent. The rank of $K_B$ is at least 2 (in fact, its eigenvalues are $-4, \pm \sqrt{2}$, rank is 3).
   Because $\text{rank}(K_B) \neq 1$, $K_B$ is **not separable**.

---

### Exercise 2.4: Cascaded Gaussian Blurring Property
**Statement:** Prove that convolving an image with a Gaussian filter of variance $\sigma_1^2$ followed by a Gaussian filter of variance $\sigma_2^2$ is mathematically equivalent to convolving with a single Gaussian filter of variance $\sigma_{\text{net}}^2 = \sigma_1^2 + \sigma_2^2$.

**Solution:**
In the continuous spatial frequency domain, the Fourier transform of a Gaussian $G(x, y; \sigma)$ is:
$$\hat{G}(\omega_x, \omega_y; \sigma) = \exp\left( -\frac{\sigma^2 (\omega_x^2 + \omega_y^2)}{2} \right)$$
By the convolution theorem of Fourier transforms:
$$\mathcal{F}\{ G(\cdot; \sigma_1) * G(\cdot; \sigma_2) \} = \hat{G}(\boldsymbol{\omega}; \sigma_1) \cdot \hat{G}(\boldsymbol{\omega}; \sigma_2)$$
Multiplying the two exponential functions:
$$\begin{aligned}
\hat{G}(\boldsymbol{\omega}; \sigma_1) \cdot \hat{G}(\boldsymbol{\omega}; \sigma_2) &= \exp\left( -\frac{\sigma_1^2 \|\boldsymbol{\omega}\|^2}{2} \right) \cdot \exp\left( -\frac{\sigma_2^2 \|\boldsymbol{\omega}\|^2}{2} \right) \\
&= \exp\left( -\frac{(\sigma_1^2 + \sigma_2^2) \|\boldsymbol{\omega}\|^2}{2} \right)
\end{aligned}$$
Let $\sigma_{\text{net}}^2 \triangleq \sigma_1^2 + \sigma_2^2$. Then:
$$\mathcal{F}\{ G(\cdot; \sigma_1) * G(\cdot; \sigma_2) \} = \exp\left( -\frac{\sigma_{\text{net}}^2 \|\boldsymbol{\omega}\|^2}{2} \right) = \hat{G}(\boldsymbol{\omega}; \sigma_{\text{net}})$$
Taking the inverse Fourier transform:
$$G(x, y; \sigma_1) * G(x, y; \sigma_2) = G\left(x, y; \sqrt{\sigma_1^2 + \sigma_2^2}\right) \quad \blacksquare$$

---

### Exercise 2.5: Truncation Error in Discrete Gaussian Approximation
**Statement:** A 1D Gaussian function has $\sigma = 2.0$. If the discrete filter kernel is truncated to radius $k = 4$ (total length $2k + 1 = 9$), calculate the analytical probability mass excluded outside the truncation window, and find the percentage of energy preserved.

**Solution:**
1. The continuous 1D Gaussian distribution has cumulative distribution function $\Phi(x) = \frac{1}{2} \left[ 1 + \text{erf}\left( \frac{x}{\sigma \sqrt{2}} \right) \right]$.
2. The truncation boundary is $x = \pm k = \pm 4$.
   Normalized variable $z = \frac{k}{\sigma} = \frac{4}{2.0} = 2.0$ standard deviations.
3. The probability mass enclosed within $[-2\sigma, +2\sigma]$ is:
   $$P(-2 \le Z \le 2) = \text{erf}\left(\frac{2}{\sqrt{2}}\right) = \text{erf}(\sqrt{2}) \approx 0.9544997$$
4. The excluded tail mass is:
   $$P_{\text{excluded}} = 1 - 0.9544997 = 0.0455003 \approx 4.55\%$$
5. Therefore, a radius of $k = 2\sigma$ preserves $95.45\%$ of energy, losing $4.55\%$.
   *(Note: Choosing $k = 3\sigma = 6$ would preserve $99.73\%$ of energy, leaving only $0.27\%$ error).*

---

### Exercise 2.6: Median Filter Invariance to Monotonic Gray-Level Transformations
**Statement:** Let $I$ be an arbitrary discrete image, and let $T: \mathbb{R} \to \mathbb{R}$ be a strictly monotonically increasing function (i.e., $x_1 < x_2 \implies T(x_1) < T(x_2)$). Prove that:
$$\text{Median}(T(I)) = T(\text{Median}(I))$$
Does this equality hold for a linear Mean filter?

**Solution:**
1. Let $\mathcal{W} = \{x_1, x_2, \dots, x_N\}$ be the multiset of $N = 2k + 1$ values in a filter window.
2. Sort the values in ascending order:
   $$x_{(1)} \le x_{(2)} \le \dots \le x_{(k+1)} \le \dots \le x_{(N)}$$
   By definition, $\text{Median}(\mathcal{W}) = x_{(k+1)}$.
3. Apply the strictly increasing transformation $T$. Because $T$ preserves strict inequality:
   $$T(x_{(1)}) \le T(x_{(2)}) \le \dots \le T(x_{(k+1)}) \le \dots \le T(x_{(N)})$$
   The sorted order of the elements is completely invariant under $T$.
   Thus, the median of the transformed set $\{T(x_1), \dots, T(x_N)\}$ is precisely the $(k+1)$-th sorted element:
   $$\text{Median}(T(\mathcal{W})) = T(x_{(k+1)}) = T(\text{Median}(\mathcal{W})) \quad \blacksquare$$
4. **Mean filter comparison:**
   For a linear Mean filter, $\text{Mean}(T(\mathcal{W})) = \frac{1}{N}\sum T(x_i)$.
   If $T$ is non-linear (e.g., gamma compression $T(x) = x^{1/\gamma}$ or logarithmic tone mapping $T(x) = \log x$), then by Jensen's inequality:
   $$\frac{1}{N} \sum_{i=1}^N T(x_i) \neq T\left(\frac{1}{N} \sum_{i=1}^N x_i\right)$$
   Thus, the Mean filter fails to commute with monotonic non-linear tone curves.

---

### Exercise 2.7: Circular Convolution via DFT and Zero-Padding Requirements
**Statement:** You wish to compute the linear convolution of an $N_1 \times N_1$ image with an $N_2 \times N_2$ kernel using the Fast Fourier Transform (FFT).
1. Explain why direct multiplication in the discrete frequency domain yields circular convolution rather than linear convolution.
2. State the minimum padded dimensions $M \times M$ required to eliminate time-domain aliasing (wrap-around contamination).

**Solution:**
1. The Discrete Fourier Transform (DFT) samples the continuous frequency spectrum at discrete harmonic intervals $\omega_k = \frac{2\pi k}{M}$. Sampling in the frequency domain is mathematically equivalent to periodic replication in the spatial domain:
   $$\tilde{I}[y, x] = \sum_{m=-\infty}^{\infty} \sum_{n=-\infty}^{\infty} I[y - m M, x - n M]$$
   Multiplying two DFTs corresponds to convolving these periodically replicated signals, which wraps the tail of the convolution response back into the front of the window (circular/cyclic convolution).
2. The linear convolution of a signal of length $N_1$ with a kernel of length $N_2$ produces a non-zero output support of size:
   $$L = N_1 + N_2 - 1$$
   To prevent the periodic copies from overlapping, the DFT transform size $M$ must be at least as large as the linear support:
   $$M \ge N_1 + N_2 - 1$$
   In 2D, the image must be zero-padded to at least $(N_1 + N_2 - 1) \times (N_1 + N_2 - 1)$ (frequently rounded up to the next power of 2 for optimal FFT radix-2 performance).

---

### Exercise 2.8: Derivation of the Difference of Box Filters
**Statement:** A continuous 1D box filter of width $2a$ has impulse response $h_a(x) = \frac{1}{2a} \text{rect}\left(\frac{x}{2a}\right)$. Consider the difference filter $d(x) = h_a(x) - h_b(x)$ where $b > a$. Derive its Fourier transform and identify its bandpass filtering behavior.

**Solution:**
1. The Fourier transform of a centered rectangle function of width $2W$ is:
   $$\mathcal{F}\{\text{rect}(x / 2W)\} = \int_{-W}^W e^{-j \omega x} dx = \left[ \frac{e^{-j\omega x}}{-j\omega} \right]_{-W}^W = \frac{2\sin(\omega W)}{\omega} = 2W \text{sinc}(\omega W)$$
2. Therefore:
   $$H_a(\omega) = \mathcal{F}\left\{ \frac{1}{2a} \text{rect}\left(\frac{x}{2a}\right) \right\} = \frac{1}{2a} \cdot 2a \text{sinc}(\omega a) = \text{sinc}(\omega a)$$
   $$H_b(\omega) = \text{sinc}(\omega b)$$
3. By linearity of the Fourier transform:
   $$D(\omega) = H_a(\omega) - H_b(\omega) = \text{sinc}(\omega a) - \text{sinc}(\omega b) = \frac{\sin(\omega a)}{\omega a} - \frac{\sin(\omega b)}{\omega b}$$
4. **Behavior at limits:**
   - At $\omega \to 0$ (DC):
     $$\lim_{\omega \to 0} D(\omega) = \text{sinc}(0) - \text{sinc}(0) = 1 - 1 = 0$$
     The filter blocks DC components completely.
   - At high frequencies ($\omega \to \infty$):
     Both sinc functions decay as $\mathcal{O}(1/\omega) \to 0$.
   - At intermediate frequencies where $\omega a \ll 1$ but $\omega b \approx \frac{\pi}{2}$:
     $D(\omega) \approx 1 - \frac{2}{\pi} > 0$.
   Thus, $D(\omega)$ is a bandpass filter that emphasizes spatial frequencies between $1/b$ and $1/a$.

---

### Exercise 2.9: Complexity of O(1) Constant-Time Box Filtering (Summed-Area Tables)
**Statement:** Explain how the **Summed-Area Table** (Integral Image) algorithm enables box filtering with an arbitrary window size $K \times K$ in $\mathcal{O}(1)$ time per pixel, independent of $K$. Show the 4-lookup formula.

**Solution:**
1. The Integral Image $S[y, x]$ stores the cumulative sum of all pixels above and to the left of $(y, x)$:
   $$S[y, x] = \sum_{y' \le y} \sum_{x' \le x} I[y', x']$$
2. $S[y, x]$ can be computed for the entire $H \times W$ image in a single pass of complexity $\mathcal{O}(H \cdot W)$ using the dynamic programming recurrence:
   $$S[y, x] = I[y, x] + S[y - 1, x] + S[y, x - 1] - S[y - 1, x - 1]$$
3. Once $S$ is constructed, the sum of intensities inside any arbitrary rectangular bounding box with top-left corner $(y_1, x_1)$ and bottom-right corner $(y_2, x_2)$ is obtained using exactly 4 array accesses:
   $$\text{Sum} = S[y_2, x_2] - S[y_1 - 1, x_2] - S[y_2, x_1 - 1] + S[y_1 - 1, x_1 - 1]$$

```
                   INTEGRAL IMAGE 4-CORNER SUMMATION
                   
           (0, 0) ──────────────────── x_1-1 ──────── x_2
             │                           │             │
             │             A             │      B      │
             │                           │             │
           y_1-1 ────────────────────────+─────────────+
             │                           │             │
             │             C             │   TARGET    │
             │                           │   REGION D  │
            y_2  ────────────────────────+─────────────+
                                         ▲             ▲
                           Target Sum = (A+B+C+D) - (A+B) - (A+C) + A
                                      = S(y2, x2) - S(y1-1, x2) - S(y2, x1-1) + S(y1-1, x1-1)
```

4. The average is simply $\text{Mean} = \frac{\text{Sum}}{(y_2 - y_1 + 1)(x_2 - x_1 + 1)}$.
   Because this operation requires exactly 3 additions/subtractions and 1 division regardless of how large $K$ is, the per-pixel algorithmic complexity is strictly $\mathcal{O}(1)$.

---

### Exercise 2.10: Bilateral Filter Range Parameter Sensitivity
**Statement:** Let an image consist of a black background ($0$) and a white foreground ($255$) separated by a sharp edge. Describe mathematically the behavior of the bilateral filter under the limiting conditions:
1. $\sigma_r \to \infty$
2. $\sigma_r \to 0$

**Solution:**
1. **Case 1: $\sigma_r \to \infty$**
   As $\sigma_r \to \infty$, the radiometric range exponent evaluates to:
   $$\lim_{\sigma_r \to \infty} \exp\left( -\frac{(I(\mathbf{p}) - I(\mathbf{q}))^2}{2\sigma_r^2} \right) = \exp(0) = 1.0 \quad \forall \mathbf{p}, \mathbf{q}$$
   The range weighting becomes uniformly $1.0$ across all pixels, irrespective of intensity difference.
   The bilateral filter degenerates into:
   $$I_{\text{bilateral}}(\mathbf{p}) = \frac{\sum_{\mathbf{q}} I(\mathbf{q}) G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|)}{\sum_{\mathbf{q}} G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|)}$$
   This is exactly the standard linear **Gaussian blur filter**. The sharp edge will be blurred across the boundary.

2. **Case 2: $\sigma_r \to 0$**
   For any neighbor $\mathbf{q}$ where $I(\mathbf{q}) \neq I(\mathbf{p})$:
   $$\lim_{\sigma_r \to 0} \exp\left( -\frac{(I(\mathbf{p}) - I(\mathbf{q}))^2}{2\sigma_r^2} \right) = \lim_{\sigma_r \to 0} \exp(-\infty) = 0.0$$
   Only neighbors with exact identical intensity $I(\mathbf{q}) = I(\mathbf{p})$ receive non-zero weight.
   If every neighbor with identical intensity has $I(\mathbf{q}) = I(\mathbf{p})$, the weighted sum becomes:
   $$I_{\text{bilateral}}(\mathbf{p}) = \frac{\sum_{\mathbf{q} \in \mathcal{N}_=} I(\mathbf{p}) G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|)}{\sum_{\mathbf{q} \in \mathcal{N}_=} G_{\sigma_s}(\|\mathbf{p} - \mathbf{q}\|)} = I(\mathbf{p})$$
   The bilateral filter degenerates into the **Identity operator** ($I_{\text{bilateral}} = I$). No smoothing occurs whatsoever. $\blacksquare$
