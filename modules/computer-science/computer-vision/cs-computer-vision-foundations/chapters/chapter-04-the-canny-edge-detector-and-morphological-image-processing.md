# Chapter 4: The Canny Edge Detector and Morphological Image Processing

---

## 4.1 John Canny's Mathematical Formulation of Optimal Edge Detection

In 1986, John F. Canny formulated the extraction of edges not merely as an ad-hoc heuristic of thresholding gradients, but as a rigorous mathematical optimization problem. Canny established three foundational optimality criteria that any ideal edge detection filter must simultaneously satisfy:

```
                      CANNY'S THREE OPTIMALITY CRITERIA
                      
       1. Low Error Rate                2. Exact Localization              3. Single Response
     (Maximize SNR: High TP,          (Minimize Distance Between         (Only ONE Peak Per
      Low FP and Low FN)               Detected and True Edge)            Physical Step Edge)
      
          Signal      Noise                 Detected   True Edge              Spurious Double Peaks
            /\         /\                       |        |                        /\     /\
           /  \  vs   /  \                      o--------o                       /  \___/  \
          /    \     /    \                     ◄── δx ──►                      /            \
       True Edge   False Peak                  Min E[δx^2]                      FORBIDDEN!
```

### 1. The Three Optimality Criteria
Let an idealized continuous 1D step edge be represented by $A \cdot u(x)$ corrupted by additive white Gaussian noise $n(x)$ with power spectral density $N_0$. Let $f(x)$ be the impulse response of an antisymmetric linear filter supported on $[-W, W]$.

1. **Criterion 1: Low Error Rate (Good Detection / High SNR):**
   The filter must maximize the ratio of the edge response amplitude at the true edge location ($x = 0$) to the root-mean-square noise response:
   $$\text{SNR} = \frac{\left| \int_{-W}^W A \cdot u(-x) f(x) \, dx \right|}{\sqrt{N_0 \int_{-W}^W f^2(x) \, dx}} = \frac{A \left| \int_{-W}^0 f(x) \, dx \right|}{\sqrt{N_0 \int_{-W}^W f^2(x) \, dx}}$$

2. **Criterion 2: Exact Localization:**
   The detected edge location (the local maximum of the filtered output $y(x) = (I * f)(x)$, where $y'(x) = 0$) must lie as close as possible to the true physical edge position ($x = 0$). Minimizing the expected squared distance $\mathbb{E}[\delta x^2]$ yields the localization metric $\Lambda$:
   $$\Lambda = \frac{\left| \int_{-W}^0 f'(x) \, dx \right|}{\sqrt{N_0 \int_{-W}^W [f'(x)]^2 \, dx}} = \frac{|f'(0)|}{\sqrt{N_0 \int_{-W}^W [f'(x)]^2 \, dx}}$$

3. **Criterion 3: Single Response Constraint:**
   There must be only one unique local maximum response to a single physical edge. Secondary local maxima (spurious ripple peaks caused by noise passing through filter side lobes) must be suppressed. Canny showed that the mean distance between adjacent zero-crossings of the derivative process $y'(x)$ must be maximized:
   $$x_{\text{mean}} = 2\pi \sqrt{\frac{\int_{-W}^W [f'(x)]^2 \, dx}{\int_{-W}^W [f''(x)]^2 \, dx}} \ge k W$$

### The Variational Optimization Solution
Canny formulated the joint maximization of $\text{SNR} \times \Lambda$ subject to the single response penalty using the calculus of variations. While the exact analytical solution is a linear combination of four exponential terms ($c_1 e^{\alpha x} \sin\omega x + \dots$), Canny demonstrated that this optimal function is numerically indistinguishable (with $>99\%$ cross-correlation) from the **first derivative of a Gaussian**:

$$f(x) \approx - \frac{x}{\sigma^2} \exp\left( -\frac{x^2}{2\sigma^2} \right) = \frac{d}{dx} G(x; \sigma)$$

Thus, the optimal edge detector consists of smoothing with a 2D Gaussian filter, followed by computing directional spatial derivatives!

---

## 4.2 The 4-Stage Canny Edge Detection Pipeline

The modern Canny edge detection algorithm transforms a raw grayscale image into a thin, connected, binary edge map through four sequential, deterministic processing stages.

```
                    THE 4-STAGE CANNY EDGE DETECTION PIPELINE
                    
    Input Image I[y, x]
           │
           ▼
    ┌─────────────────────────────┐
    │ 1. GAUSSIAN NOISE FILTERING │  ──► I_σ = I * G_σ (Suppresses Sensor Noise)
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │ 2. SOBEL GRADIENT FIELD     │  ──► Gradient Magnitude M[y, x] & Orientation θ[y, x]
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │ 3. NON-MAXIMUM SUPPRESSION  │  ──► Thins Thick Gradient Ridges into
    │    (NMS) ALONG GRADIENT     │      1-Pixel Wide Local Extrema Contours
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │ 4. HYSTERESIS THRESHOLDING  │  ──► Dual Thresholds (T_high, T_low) + 8-Connected
    │    & EDGE LINKING (DFS/BFS) │      Recursive Contour Tracking (Prevents Streaking)
    └──────────────┬──────────────┘
                   │
                   ▼
     Binary Edge Map E[y, x] ∈ {0, 1}
```

### Stage 1: Gaussian Smoothing
To eliminate high-frequency stochastic noise without introducing ringing, the input image $I[y, x]$ is convolved with an isotropic 2D Gaussian kernel of scale $\sigma$:
$$I_\sigma[y, x] = (I * G_\sigma)[y, x]$$
The scale parameter $\sigma$ controls the minimum spatial feature size: larger $\sigma$ smooths out fine surface textures (e.g., fabric weave, concrete roughness) to detect macro object boundaries, while smaller $\sigma$ preserves fine details.

### Stage 2: Directional Gradient Calculation
Using $3 \times 3$ Sobel filters $S_x$ and $S_y$, compute horizontal and vertical gradient components:
$$I_x = I_\sigma * S_x, \quad I_y = I_\sigma * S_y$$

Compute the gradient magnitude and continuous orientation:
$$M[y, x] = \sqrt{I_x[y, x]^2 + I_y[y, x]^2}$$
$$\theta[y, x] = \text{atan2}(I_y[y, x], I_x[y, x])$$

### Stage 3: Non-Maximum Suppression (NMS)
The gradient magnitude map $M[y, x]$ contains wide, blurry ridges around boundaries (often 3 to 7 pixels wide). Non-Maximum Suppression thins these ridges into razor-sharp, 1-pixel-wide edge skeletons by checking whether the current pixel is a local maximum along the continuous line of the gradient vector.

Because the gradient vector $\nabla I$ is strictly perpendicular to the physical edge boundary, the local maximum must be tested against its two immediate neighbors along the gradient normal direction $\mathbf{n} = [\cos\theta, \sin\theta]^\top$.

```
                 NON-MAXIMUM SUPPRESSION SECTOR QUANTIZATION
                 
                          Sector 2 (90°)
                        [ -22.5° to 22.5° ]
                                 ▲
                     \           │           /
            Sector 3  \          │          /  Sector 1
             (135°)    \         │         /    (45°)
                        \        │        /
                         \       │       /
     ─────────────────────o──────┴───────o─────────────────────► x
    Sector 0 (0°)        /       (y, x)  \         Sector 0 (0°)
   [-22.5° to 22.5°]    /                 \       [-22.5° to 22.5°]
                       /                   \
                      /                     \
```

#### The 4 Canonical Quantization Sectors
Continuous gradient angle $\theta \in [-\pi, \pi]$ is mapped to the unsigned range $[0, \pi)$ by adding $\pi$ if $\theta < 0$, and then partitioned into four discrete $45^\circ$ directional sectors:

| Sector | Angle Range (Degrees) | Gradient Normal Direction | Neighbor Pixels to Compare |
| :--- | :--- | :--- | :--- |
| **0** | $[0^\circ, 22.5^\circ) \cup [157.5^\circ, 180^\circ]$ | Horizontal ($0^\circ$) | $M[y, x-1]$ and $M[y, x+1]$ |
| **1** | $[22.5^\circ, 67.5^\circ)$ | Diagonal Positive ($45^\circ$) | $M[y-1, x+1]$ and $M[y+1, x-1]$ |
| **2** | $[67.5^\circ, 112.5^\circ)$ | Vertical ($90^\circ$) | $M[y-1, x]$ and $M[y+1, x]$ |
| **3** | $[112.5^\circ, 157.5^\circ)$ | Diagonal Negative ($135^\circ$) | $M[y-1, x-1]$ and $M[y+1, x+1]$ |

#### NMS Decision Rule:
Let $q$ and $r$ denote the two neighbor magnitudes along the quantized sector. The suppressed magnitude $M_{\text{NMS}}[y, x]$ is:
$$M_{\text{NMS}}[y, x] = \begin{cases} M[y, x] & \text{if } M[y, x] \ge M_q \text{ and } M[y, x] \ge M_r \\ 0 & \text{otherwise} \end{cases}$$

### Stage 4: Dual-Threshold Hysteresis and 8-Connected Edge Tracking
A single global threshold $T$ inevitably encounters the **thresholding dilemma**:
- If $T$ is set too high, faint or shadowed segments of a true boundary are lost, causing broken, fragmented contours (**streaking**).
- If $T$ is set too low, high-frequency noise spikes and irrelevant background clutter pass through as false edges.

Canny resolved this with **dual-threshold hysteresis** using two thresholds:
$$T_{\text{high}} \quad \text{and} \quad T_{\text{low}} \quad (\text{typically } T_{\text{high}} : T_{\text{low}} \approx 2:1 \text{ to } 3:1)$$

```
                        HYSTERESIS THRESHOLDING GEOMETRY
                        
      Gradient Magnitude M_NMS
            ▲
            │
    T_high ─┼─────────────────────o──────────o─────────────── (STRONG EDGE: Guaranteed Keep)
            │                    /            \
            │                   /              \
    T_low  ─┼──────────o───────o                o───────o──── (WEAK EDGE: Kept ONLY IF
            │         /                                  \     connected to a Strong Edge)
            │        /                                    \
          0 ┴───────o──────────────────────────────────────o──► Spatial Contour
                    ▲                                      ▲
              Isolated Noise                         Isolated Noise
                (DISCARDED!)                           (DISCARDED!)
```

#### Edge Classification:
1. **Strong Edge Pixels:** $M_{\text{NMS}}[y, x] \ge T_{\text{high}}$. These pixels represent undeniable physical edges and are immediately committed to the final edge map: $E[y, x] = 1$.
2. **Weak Edge Pixels:** $T_{\text{low}} \le M_{\text{NMS}}[y, x] < T_{\text{high}}$. These pixels are ambiguous candidates.
3. **Non-Edge Pixels:** $M_{\text{NMS}}[y, x] < T_{\text{low}}$. Permanently discarded: $E[y, x] = 0$.

#### Recursive Edge Tracking (DFS / BFS):
Every strong edge pixel serves as the root seed of a Depth-First Search (DFS) or Breadth-First Search (BFS). The algorithm explores the 8-connected neighborhood $\mathcal{N}_8(y, x)$. Any weak edge pixel directly or transitively connected to a strong edge pixel is promoted to a confirmed edge ($E = 1$). Weak pixels that have no topological path to any strong edge pixel are discarded as noise.

---

## 4.3 Mathematical Morphology on Binary and Grayscale Images

Mathematical morphology (developed by Georges Matheron and Jean Serra at the École des Mines de Paris) is a theoretical framework for analyzing geometric structures, shapes, and topological features based on set theory.

### Binary Sets and Structuring Elements
In binary morphology, an image $A \subset \mathbb{Z}^2$ is treated as the set of coordinate pairs belonging to the foreground:
$$A = \{ \mathbf{p} = (y, x) \in \mathbb{Z}^2 \mid I[y, x] = 1 \}$$
A **structuring element (SE)** $B \subset \mathbb{Z}^2$ is a small geometric probe (e.g., $3 \times 3$ square, disk, cross) with a designated origin $\mathbf{0} = (0, 0)$.

- **Translation:** $A_{\mathbf{t}} = \{ \mathbf{a} + \mathbf{t} \mid \mathbf{a} \in A \}$
- **Reflection:** $\hat{B} = \{ -\mathbf{b} \mid \mathbf{b} \in B \}$

```
                      COMMON STRUCTURING ELEMENTS (3x3)
                      
       3x3 Square (8-conn)          3x3 Cross (4-conn)          Horizontal Line (1x3)
           ┌───┬───┬───┐                ┌───┬───┬───┐                ┌───┬───┬───┐
           │ 1 │ 1 │ 1 │                │ 0 │ 1 │ 0 │                │ 0 │ 0 │ 0 │
           ├───┼───┼───┤                ├───┼───┼───┤                ├───┼───┼───┤
           │ 1 │[1]│ 1 │                │ 1 │[1]│ 1 │                │ 1 │[1]│ 1 │
           ├───┼───┼───┤                ├───┼───┼───┤                ├───┼───┼───┤
           │ 1 │ 1 │ 1 │                │ 0 │ 1 │ 0 │                │ 0 │ 0 │ 0 │
           └───┴───┴───┘                └───┴───┴───┘                └───┴───┴───┘
```

### Fundamental Morphological Operators

#### 1. Dilation ($\delta_B(A)$ or $A \oplus B$)
Dilation expands the boundary of foreground regions and fills small interior holes. Mathematically, it is defined via Minkowski set addition:
$$A \oplus B \triangleq \bigcup_{\mathbf{b} \in B} A_{\mathbf{b}} = \{ \mathbf{z} \in \mathbb{Z}^2 \mid (\hat{B})_{\mathbf{z}} \cap A \neq \emptyset \}$$
In discrete logic: pixel $\mathbf{z}$ is foreground in the dilated image if the structuring element placed at $\mathbf{z}$ overlaps at least one foreground pixel of $A$.

#### 2. Erosion ($\epsilon_B(A)$ or $A \ominus B$)
Erosion shrinks foreground regions and eliminates isolated protrusions or small noise specks. Mathematically, it is defined via Minkowski set subtraction:
$$A \ominus B \triangleq \bigcap_{\mathbf{b} \in B} A_{-\mathbf{b}} = \{ \mathbf{z} \in \mathbb{Z}^2 \mid B_{\mathbf{z}} \subseteq A \}$$
In discrete logic: pixel $\mathbf{z}$ is foreground in the eroded image if and only if the structuring element placed at $\mathbf{z}$ is completely contained within $A$.

```
                       DILATION VS. EROSION GEOMETRY
                       
          Original Shape A             Erosion A ⊖ B               Dilation A ⊕ B
            ┌─────────┐                  ┌───────┐                  ┌───────────┐
            │  #####  │                  │  ###  │                  │  #######  │
            │  #####  │  ─────────►      │  ###  │  ─────────►      │  #######  │
            │  ###    │  (Shrinks)       └───────┘  (Expands)       │  #####    │
            └─────────┘                                             │  #####    │
                                                                    └───────────┘
```

#### Duality under Set Complementation
Erosion and dilation are dual operators with respect to set complementation ($A^c = \mathbb{Z}^2 \setminus A$):
$$(A \ominus B)^c = A^c \oplus \hat{B}$$
$$(A \oplus B)^c = A^c \ominus \hat{B}$$
Eroding the foreground is mathematically identical to dilating the background!

---

## 4.4 Compound Morphological Operations and Structural Filtering

Cascading erosion and dilation yields non-linear shape filters capable of removing noise without altering the global dimensions of uncorrupted structures.

### 1. Opening ($A \circ B$)
Opening is an erosion followed by a dilation using the same structuring element:
$$A \circ B \triangleq (A \ominus B) \oplus B$$
- **Geometric Effect:** Removes small foreground islands, severs thin bridges between connected blobs, and smooths sharp exterior contours from the inside.
- **Idempotence:** $(A \circ B) \circ B = A \circ B$. Re-applying opening produces zero further change.
- **Anti-extensivity:** $A \circ B \subseteq A$. Opening never adds new foreground pixels.

### 2. Closing ($A \bullet B$)
Closing is a dilation followed by an erosion using the same structuring element:
$$A \bullet B \triangleq (A \oplus B) \ominus B$$
- **Geometric Effect:** Fills small interior holes, bridges narrow cracks or gaps between adjacent objects, and smooths contours from the outside.
- **Idempotence:** $(A \bullet B) \bullet B = A \bullet B$.
- **Extensivity:** $A \subseteq A \bullet B$. Closing never deletes original foreground pixels.

```
                      OPENING AND CLOSING TRANSFORMS
                      
       Original Shape A               Opening A ∘ B                Closing A • B
        (Bridge + Hole)            (Bridge Severed)               (Hole Sealed)
        ┌───┐     ┌───┐             ┌───┐     ┌───┐               ┌───────────────┐
        │   │=====│   │             │   │     │   │               │   │=======│   │
        │   └──┬──┘   │   ─────►    │   └──┐ ┌└───┤     ─────►    │   └───┬───┘   │
        │      o      │             │      o      │               │       #       │
        └─────────────┘             └─────────────┘               └───────────────┘
```

### 3. Morphological Boundary Extraction (Morphological Gradient)
The boundary $\beta(A)$ of a binary shape $A$ is extracted by subtracting its erosion from $A$:
$$\beta_{\text{internal}}(A) = A \setminus (A \ominus B)$$
$$\beta_{\text{external}}(A) = (A \oplus B) \setminus A$$
$$\text{MG}(A) = (A \oplus B) \setminus (A \ominus B) \quad (\text{Full Morphological Gradient})$$

### 4. Top-Hat and Black-Hat Transforms (Grayscale Morphology)
In grayscale morphology, erosion and dilation replace binary logic with local minimum and maximum filters:
$$(I \ominus B)[y, x] = \min_{(u, v) \in B} \{ I[y + u, x + v] \}$$
$$(I \oplus B)[y, x] = \max_{(u, v) \in B} \{ I[y - u, x - v] \}$$

- **White Top-Hat Transform:**
  $$T_{\text{white}}(I) = I - (I \circ B)$$
  Isolates bright features and specular highlights that are spatially smaller than the structuring element $B$. Essential for correcting non-uniform background illumination.
- **Black-Hat Transform:**
  $$T_{\text{black}}(I) = (I \bullet B) - I$$
  Isolates dark cavities, cracks, or shadows smaller than $B$.

---

## 4.5 Connected Component Analysis and Topological Features

Once an image has been segmented into a binary map via Canny edge detection or morphological thresholding, individual objects must be uniquely identified and labeled through **Connected Component Analysis (CCA)**.

### Neighborhood Connectivity: 4-Connectivity vs. 8-Connectivity
For a pixel $(y, x)$:
- **4-Neighborhood ($\mathcal{N}_4$):** Cardinal orthogonal neighbors $(y \pm 1, x)$ and $(y, x \pm 1)$.
- **8-Neighborhood ($\mathcal{N}_8$):** $\mathcal{N}_4$ plus diagonal neighbors $(y \pm 1, x \pm 1)$.

> [!CAUTION]
> **The Jordan Curve Paradox:** If 8-connectivity is chosen for the foreground, 4-connectivity must strictly be chosen for the background (and vice-versa). Otherwise, a continuous diagonal 8-connected loop fails to partition the background into disconnected interior and exterior regions!

### Two-Pass Connected Component Labeling via Disjoint-Set Union-Find
The standard industrial algorithm labels all connected components in an $H \times W$ binary image in two sequential raster passes with near-linear complexity $\mathcal{O}(H \cdot W \cdot \alpha(N))$ using a Disjoint-Set (Union-Find) data structure.

```
                      TWO-PASS CCA RASTER SCAN WINDOW
                      
              Current Pixel [y, x] Scanned Left-to-Right, Top-to-Bottom
              
                           [y-1, x-1]  [y-1, x]  [y-1, x+1]   ◄── Already Labeled
                           [y,   x-1]  [y,   x]                ◄── Current Pixel
```

1. **Pass 1 (Label Assignment & Equivalence Recording):**
   Iterate through pixels $(y, x)$ in raster order. If $I[y, x] = 1$:
   - Inspect already-visited neighbors in its causal mask: $[y, x-1], [y-1, x-1], [y-1, x], [y-1, x+1]$.
   - If no neighbors have foreground labels: generate a new unique integer label $L_{\text{new}}$ and set `parent[L_new] = L_new`.
   - If exactly one neighbor has a label: assign that label to $[y, x]$.
   - If two or more neighbors have *different* labels $L_1, L_2$: assign $\min(L_1, L_2)$ to $[y, x]$ and register equivalence by calling `Union(L_1, L_2)`.

2. **Equivalence Resolution (Union-Find):**
   Using path compression:
   ```
   function Find(label):
       if parent[label] != label:
           parent[label] = Find(parent[label])
       return parent[label]
       
   function Union(L1, L2):
       root1 = Find(L1)
       root2 = Find(L2)
       if root1 != root2:
           parent[root2] = root1
   ```

3. **Pass 2 (Canonical Relabeling):**
   Re-scan the image and replace every intermediate label with its canonical root: `Label[y, x] = Find(Label[y, x])`.

### Geometric Shape Moments and Orientations
For each labeled connected component $\mathcal{C}_k$, compute its spatial moments:
$$m_{p, q} = \sum_{(y, x) \in \mathcal{C}_k} x^p y^q$$
- **Zeroth Moment (Area):** $A = m_{0, 0} = |\mathcal{C}_k|$.
- **First Moments (Centroid / Center of Mass):**
  $$\bar{x} = \frac{m_{1, 0}}{m_{0, 0}}, \quad \bar{y} = \frac{m_{0, 1}}{m_{0, 0}}$$
- **Second-Order Central Moments (Inertial Spread):**
  $$\mu_{p, q} = \sum_{(y, x) \in \mathcal{C}_k} (x - \bar{x})^p (y - \bar{y})^q$$
  $$\mu_{2, 0} = m_{2, 0} - \bar{x} m_{1, 0}, \quad \mu_{0, 2} = m_{0, 2} - \bar{y} m_{0, 1}, \quad \mu_{1, 1} = m_{1, 1} - \bar{x} m_{0, 1}$$

- **Principal Axis of Inertia (Object Orientation):**
  The orientation angle $\theta_{\text{obj}}$ of the major axis of elongation is:
  $$\theta_{\text{obj}} = \frac{1}{2} \text{atan2}(2 \mu_{1, 1}, \, \mu_{2, 0} - \mu_{0, 2})$$

- **Eccentricity (Elongation):**
  $$\varepsilon = \frac{(\mu_{2, 0} - \mu_{0, 2})^2 + 4 \mu_{1, 1}^2}{(\mu_{2, 0} + \mu_{0, 2})^2}$$

---

## 4.6 Worked Examples

### Problem 4.1: Non-Maximum Suppression Calculation
**Statement:** At pixel $(y, x) = (10, 10)$, the computed Sobel gradients are $I_x = 40.0$ and $I_y = 70.0$. The gradient magnitude is $M[10, 10] = \sqrt{40^2 + 70^2} \approx 80.62$.
1. Determine the exact gradient orientation angle in degrees.
2. Identify the quantized NMS sector ($0, 1, 2, \text{ or } 3$).
3. If the neighbor magnitudes are $M[9, 10] = 85.0$ and $M[11, 10] = 75.0$, determine whether pixel $(10, 10)$ survives non-maximum suppression.

**Step-by-step Solution:**
1. **Continuous Orientation:**
   $$\theta = \text{atan2}(I_y, I_x) = \text{atan2}(70.0, 40.0) \approx 1.05165 \text{ rad} \approx 60.26^\circ$$
2. **Sector Quantization:**
   Examine sector angle bounds in $[0^\circ, 180^\circ]$:
   - Sector 0: $[0^\circ, 22.5^\circ) \cup [157.5^\circ, 180^\circ]$ (Horizontal)
   - Sector 1: $[22.5^\circ, 67.5^\circ)$ (Diagonal $45^\circ$)
   - Sector 2: $[67.5^\circ, 112.5^\circ)$ (Vertical $90^\circ$)
   - Sector 3: $[112.5^\circ, 157.5^\circ)$ (Diagonal $135^\circ$)
   Since $60.26^\circ \in [22.5^\circ, 67.5^\circ)$, this pixel belongs to **Sector 1 ($45^\circ$ diagonal)**.
3. **Neighbor Comparison along Sector 1 ($45^\circ$):**
   The normal line passes through:
   - Top-right neighbor: $(y - 1, x + 1) = (9, 11)$
   - Bottom-left neighbor: $(y + 1, x - 1) = (11, 9)$
   Wait! The problem states neighbor values along vertical coordinates: $M[9, 10] = 85.0$ and $M[11, 10] = 75.0$, but for Sector 1 the comparison must be made along $(9, 11)$ and $(11, 9)$.
   If the values given were along Sector 2, that would apply to vertical. But along Sector 1, let's suppose $M[9, 11] = 85.0$ and $M[11, 9] = 75.0$.
   Testing the NMS condition:
   $$M[10, 10] \ge M[9, 11] \iff 80.62 \ge 85.0 \implies \text{FALSE!}$$
   Because the neighbor $M[9, 11] = 85.0 > 80.62$, pixel $(10, 10)$ is **not** a local maximum along the gradient normal.
   **Result:** $M_{\text{NMS}}[10, 10] = 0$. The pixel is suppressed.

---

### Problem 4.2: Sub-Pixel NMS Interpolation
**Statement:** Instead of sector quantization, an advanced edge detector performs sub-pixel linear interpolation. At pixel $(y, x)$, gradient components are $I_x = 30$ and $I_y = 40$. The local gradient magnitudes are:
$$\begin{matrix} M[y-1, x-1]=45 & M[y-1, x]=60 & M[y-1, x+1]=80 \\ M[y, x-1]=40 & M[y, x]=50 & M[y, x+1]=55 \\ M[y+1, x-1]=25 & M[y+1, x]=30 & M[y+1, x+1]=35 \end{matrix}$$
Compute the linearly interpolated magnitudes $M_1$ and $M_2$ along the continuous gradient vector, and determine if $M[y, x]$ is a local maximum.

**Step-by-step Solution:**
1. Gradient direction vector:
   $$\mathbf{u} = \frac{\nabla I}{\|\nabla I\|} = \frac{[30, 40]^\top}{50} = [0.6, 0.8]^\top$$
   Here $\frac{|I_y|}{|I_x|} = \frac{40}{30} = \frac{4}{3} > 1$, meaning the gradient points predominantly in the vertical $y$-direction.
2. The intersection of the gradient ray with the horizontal line $y - 1$ occurs at offset:
   $$\alpha = \frac{I_x}{I_y} = \frac{30}{40} = 0.75$$
   The interpolated point $\mathbf{p}_1$ lies between $(y-1, x)$ and $(y-1, x+1)$:
   $$M_1 = (1 - \alpha) M[y-1, x] + \alpha M[y-1, x+1]$$
   Substituting values:
   $$M_1 = (1 - 0.75)(60) + 0.75(80) = 0.25(60) + 0.75(80) = 15 + 60 = 75.0$$
3. By symmetry, the opposing point $\mathbf{p}_2$ on line $y + 1$ lies between $(y+1, x)$ and $(y+1, x-1)$:
   $$M_2 = (1 - \alpha) M[y+1, x] + \alpha M[y+1, x-1]$$
   $$M_2 = (0.25)(30) + 0.75(25) = 7.5 + 18.75 = 26.25$$
4. Test NMS condition:
   Is $M[y, x] \ge M_1$ and $M[y, x] \ge M_2$?
   $$50 \ge 75.0 \implies \text{FALSE!}$$
   Because $M[y, x] < M_1$, pixel $(y, x)$ is suppressed to $0$.

---

### Problem 4.3: Hysteresis Thresholding on a 1D Linked Chain
**Statement:** A continuous sequence of 8-connected pixels has post-NMS magnitudes:
$$\mathbf{M} = [30, 45, 65, 85, 70, 55, 40, 25]$$
The Canny hysteresis thresholds are set to $T_{\text{high}} = 80$ and $T_{\text{low}} = 50$.
Trace the hysteresis tracking and determine the binary edge output $\mathbf{E} \in \{0, 1\}^8$.

**Step-by-step Solution:**
1. Classify each pixel based on $(T_{\text{low}}, T_{\text{high}}) = (50, 80)$:
   - Index 0: $M = 30 < 50 \implies \text{Non-edge}$
   - Index 1: $M = 45 < 50 \implies \text{Non-edge}$
   - Index 2: $M = 65 \in [50, 80) \implies \text{Weak edge}$
   - Index 3: $M = 85 \ge 80 \implies \mathbf{Strong\ edge}$
   - Index 4: $M = 70 \in [50, 80) \implies \text{Weak edge}$
   - Index 5: $M = 55 \in [50, 80) \implies \text{Weak edge}$
   - Index 6: $M = 40 < 50 \implies \text{Non-edge}$
   - Index 7: $M = 25 < 50 \implies \text{Non-edge}$

2. Seed from Strong Edges:
   - Index 3 is a Strong Edge $\implies E[3] = 1$.
3. Trace 8-connected neighbors from index 3:
   - **Left traversal:**
     - Index 2 has $M = 65 \ge T_{\text{low}} \implies$ Promoted! $E[2] = 1$.
     - Index 1 has $M = 45 < T_{\text{low}} \implies$ Stop left traversal. $E[1] = 0$.
     - Index 0 remains $0$.
   - **Right traversal:**
     - Index 4 has $M = 70 \ge T_{\text{low}} \implies$ Promoted! $E[4] = 1$.
     - Index 5 has $M = 55 \ge T_{\text{low}} \implies$ Promoted! $E[5] = 1$.
     - Index 6 has $M = 40 < T_{\text{low}} \implies$ Stop right traversal. $E[6] = 0$.
     - Index 7 remains $0$.

4. Final Output Vector:
   $$\mathbf{E} = [0, 0, 1, 1, 1, 1, 0, 0]$$
   Notice how weak pixels at indices 2, 4, and 5 were rescued from being dropped because they form an unbroken bridge to strong pixel 3.

---

### Problem 4.4: Binary Erosion with a $3 \times 3$ Cross Structuring Element
**Statement:** A binary image patch $A$ is given by:
$$A = \begin{bmatrix} 0 & 1 & 1 & 0 \\ 1 & 1 & 1 & 1 \\ 1 & 1 & 1 & 0 \\ 0 & 1 & 0 & 0 \end{bmatrix}$$
Compute the eroded image $A \ominus B$ at all valid interior positions using the 4-connected cross structuring element $B = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 0 \end{bmatrix}$ with origin at center.

**Step-by-step Solution:**
The erosion condition requires that $B$ centered at $(y, x)$ must be a subset of $A$.
That is: $A[y, x] = 1$, $A[y-1, x] = 1$, $A[y+1, x] = 1$, $A[y, x-1] = 1$, and $A[y, x+1] = 1$.
Evaluate interior pixels $(y, x) \in \{1, 2\} \times \{1, 2\}$:
1. **Pixel $(1, 1)$:**
   Center: $A[1, 1] = 1$.
   Top: $A[0, 1] = 1$.
   Bottom: $A[2, 1] = 1$.
   Left: $A[1, 0] = 1$.
   Right: $A[1, 2] = 1$.
   All 5 required pixels are $1$!
   $$\implies (A \ominus B)[1, 1] = 1$$
2. **Pixel $(1, 2)$:**
   Center: $A[1, 2] = 1$.
   Top: $A[0, 2] = 1$.
   Bottom: $A[2, 2] = 1$.
   Left: $A[1, 1] = 1$.
   Right: $A[1, 3] = 1$.
   All 5 required pixels are $1$!
   $$\implies (A \ominus B)[1, 2] = 1$$
3. **Pixel $(2, 1)$:**
   Center: $A[2, 1] = 1$.
   Top: $A[1, 1] = 1$.
   Bottom: $A[3, 1] = 1$.
   Left: $A[2, 0] = 1$.
   Right: $A[2, 2] = 1$.
   All 5 required pixels are $1$!
   $$\implies (A \ominus B)[2, 1] = 1$$
4. **Pixel $(2, 2)$:**
   Center: $A[2, 2] = 1$.
   Top: $A[1, 2] = 1$.
   Bottom: $A[3, 2] = 0$. $\leftarrow$ FAILS!
   Left: $A[2, 1] = 1$.
   Right: $A[2, 3] = 0$. $\leftarrow$ FAILS!
   $$\implies (A \ominus B)[2, 2] = 0$$

---

### Problem 4.5: Binary Opening vs. Closing
**Statement:** Consider the binary shape $A$ defined on a $5 \times 5$ grid containing an isolated noise speck at $(0, 4)$ and a single-pixel indentation at $(2, 2)$:
$$A = \begin{bmatrix} 0 & 0 & 0 & 0 & 1 \\ 0 & 1 & 1 & 1 & 0 \\ 0 & 1 & 0 & 1 & 0 \\ 0 & 1 & 1 & 1 & 0 \\ 0 & 0 & 0 & 0 & 0 \end{bmatrix}$$
Using a $3 \times 3$ full square structuring element $B$:
1. State the effect of Opening $A \circ B$.
2. State the effect of Closing $A \bullet B$.

**Step-by-step Solution:**
1. **Opening $A \circ B = (A \ominus B) \oplus B$:**
   - Step 1 (Erosion $A \ominus B$):
     A $3 \times 3$ square cannot fit at $(0, 4)$, so the isolated pixel is completely eliminated.
     Can a $3 \times 3$ square fit inside the ring around $(2, 2)$? No, because pixel $(2, 2)$ is $0$. Any $3 \times 3$ window centered at $(1, 2), (2, 1), (2, 3), (3, 2)$ requires $(2, 2)$ to be $1$.
     Therefore, the erosion of the entire structure is completely empty: $A \ominus B = \emptyset$!
     Consequently, dilation of the empty set is empty:
     $$A \circ B = \mathbf{0}_{5 \times 5}$$
     *(This shows that when an object's walls are thinner than the structuring element, opening completely erases the object).*

2. **Closing $A \bullet B = (A \oplus B) \ominus B$:**
   - Step 1 (Dilation $A \oplus B$):
     The $3 \times 3$ dilation expands all foreground pixels. The center cavity $(2, 2)$ is completely enclosed and covered by foreground from all 8 surrounding neighbors.
   - Step 2 (Erosion $(A \oplus B) \ominus B$):
     The eroded dilated shape recovers the original $3 \times 3$ outer boundary while retaining the filled center $(2, 2)$.
     Closing successfully seals the interior hole at $(2, 2)$, yielding a solid $3 \times 3$ block:
     $$(A \bullet B)[y, x] = 1 \quad \text{for } 1 \le y, x \le 3$$
     The isolated pixel at $(0, 4)$ dilates into a $3 \times 3$ block and erodes back to pixel $(0, 4)$.

---

### Problem 4.6: Morphological Boundary Extraction
**Statement:** A solid $6 \times 6$ binary square object occupies rows $1..4$ and columns $1..4$:
$$A[y, x] = 1 \quad \text{for } 1 \le y \le 4, \, 1 \le x \le 4$$
Compute the internal boundary $\beta(A) = A \setminus (A \ominus B)$ using a $3 \times 3$ cross structuring element $B$.

**Step-by-step Solution:**
1. Determine the eroded set $A \ominus B$:
   For a pixel $(y, x)$ to survive erosion with a cross SE, all its 4-neighbors $(y \pm 1, x)$ and $(y, x \pm 1)$ must belong to $A$.
   The coordinates of $A$ span $y \in [1, 4]$ and $x \in [1, 4]$.
   - A pixel on the perimeter of $A$ (where $y = 1, y = 4, x = 1,$ or $x = 4$) has at least one neighbor outside $A$. Hence, it is eroded.
   - Interior pixels where $2 \le y \le 3$ and $2 \le x \le 3$ have all 4 neighbors well within $[1, 4]$.
   Thus:
   $$(A \ominus B)[y, x] = 1 \quad \text{for } 2 \le y \le 3, \, 2 \le x \le 3 \quad (\text{a } 2 \times 2 \text{ core})$$
2. Set subtraction $\beta(A) = A \setminus (A \ominus B)$:
   Subtract the $2 \times 2$ core from the original $4 \times 4$ square:
   $$\text{Area}(A) = 4 \times 4 = 16 \text{ pixels}$$
   $$\text{Area}(A \ominus B) = 2 \times 2 = 4 \text{ pixels}$$
   $$\text{Area}(\beta(A)) = 16 - 4 = 12 \text{ pixels}$$
   The boundary consists of the 12 perimeter pixels forming a 1-pixel-thick hollow square contour.

---

### Problem 4.7: Two-Pass Connected Component Labeling Execution
**Statement:** Perform Pass 1 of the two-pass CCA algorithm on the following binary matrix under 4-connectivity:
$$I = \begin{bmatrix} 1 & 1 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 1 & 1 & 1 & 1 \end{bmatrix}$$
Record all label assignments and Union equivalence pairs.

**Step-by-step Solution:**
We scan row-by-row, column-by-column. Causal neighbors for 4-connectivity at $(y, x)$ are Top: $(y-1, x)$ and Left: $(y, x-1)$.
1. **Row 0:**
   - $(0, 0) = 1$: No causal neighbors. Assign new label **1**.
   - $(0, 1) = 1$: Left neighbor has label 1. Assign label **1**.
   - $(0, 2) = 0$: Background.
   - $(0, 3) = 1$: No causal neighbors. Assign new label **2**.
2. **Row 1:**
   - $(1, 0) = 0$: Background.
   - $(1, 1) = 1$: Top neighbor $(0, 1)$ has label 1. Left is 0. Assign label **1**.
   - $(1, 2) = 0$: Background.
   - $(1, 3) = 1$: Top neighbor $(0, 3)$ has label 2. Left is 0. Assign label **2**.
3. **Row 2:**
   - $(2, 0) = 1$: Top is 0, Left is 0. Assign new label **3**.
   - $(2, 1) = 1$: Top $(1, 1)$ has label 1; Left $(2, 0)$ has label 3.
     Different labels detected! Assign $\min(1, 3) = \mathbf{1}$.
     Record Equivalence: $\text{Union}(1, 3)$.
   - $(2, 2) = 1$: Top is 0; Left $(2, 1)$ has label 1. Assign label **1**.
   - $(2, 3) = 1$: Top $(1, 3)$ has label 2; Left $(2, 2)$ has label 1.
     Different labels detected! Assign $\min(1, 2) = \mathbf{1}$.
     Record Equivalence: $\text{Union}(1, 2)$.

4. **Equivalence Resolution:**
   $\text{Union}(1, 3) \implies \text{Root}(3) = 1$.
   $\text{Union}(1, 2) \implies \text{Root}(2) = 1$.
   All three labels collapse to canonical Root 1. In Pass 2, every foreground pixel is relabeled 1. The entire matrix forms a single connected component!

---

### Problem 4.8: Object Centroid and Orientation from Central Moments
**Statement:** A connected component consists of 3 pixels located at coordinates $(x, y)$:
$$\mathbf{p}_1 = (1, 1), \quad \mathbf{p}_2 = (2, 2), \quad \mathbf{p}_3 = (3, 3)$$
1. Compute the zeroth moment $m_{0, 0}$ (Area).
2. Compute the first moments $m_{1, 0}, m_{0, 1}$ and find the centroid $(\bar{x}, \bar{y})$.
3. Compute the central moments $\mu_{2, 0}, \mu_{0, 2}, \mu_{1, 1}$ and the principal orientation angle $\theta_{\text{obj}}$.

**Step-by-step Solution:**
1. **Zeroth Moment (Area):**
   $$m_{0, 0} = 1 + 1 + 1 = 3$$
2. **First Moments and Centroid:**
   $$m_{1, 0} = \sum x = 1 + 2 + 3 = 6 \implies \bar{x} = \frac{6}{3} = 2.0$$
   $$m_{0, 1} = \sum y = 1 + 2 + 3 = 6 \implies \bar{y} = \frac{6}{3} = 2.0$$
   Centroid: $(\bar{x}, \bar{y}) = (2.0, 2.0)$.
3. **Second-Order Central Moments:**
   Displacements from centroid $(x' = x - 2, y' = y - 2)$:
   - $\mathbf{p}_1$: $x' = -1, y' = -1$
   - $\mathbf{p}_2$: $x' = 0, y' = 0$
   - $\mathbf{p}_3$: $x' = +1, y' = +1$
   $$\mu_{2, 0} = \sum (x')^2 = (-1)^2 + 0^2 + 1^2 = 1 + 0 + 1 = 2$$
   $$\mu_{0, 2} = \sum (y')^2 = (-1)^2 + 0^2 + 1^2 = 1 + 0 + 1 = 2$$
   $$\mu_{1, 1} = \sum (x' y') = (-1)(-1) + (0)(0) + (1)(1) = 1 + 0 + 1 = 2$$
4. **Principal Orientation:**
   $$\theta_{\text{obj}} = \frac{1}{2} \text{atan2}(2\mu_{1, 1}, \, \mu_{2, 0} - \mu_{0, 2})$$
   $$\mu_{2, 0} - \mu_{0, 2} = 2 - 2 = 0$$
   $$2\mu_{1, 1} = 2(2) = 4$$
   $$\theta_{\text{obj}} = \frac{1}{2} \text{atan2}(4, 0) = \frac{1}{2} \left(\frac{\pi}{2}\right) = \frac{\pi}{4} \text{ rad} = 45^\circ$$
   The principal axis is oriented at exactly $45^\circ$, perfectly matching the diagonal line of pixels!

---

### Problem 4.9: Grayscale Top-Hat Background Equalization
**Statement:** A 1D grayscale line scan has an unwanted non-uniform linear illumination gradient with a small bright defect at index 3:
$$\mathbf{I} = [10, 20, 30, 95, 50, 60, 70]$$
Using a 1D flat structuring element of length 3 ($B = [1, 1, 1]$):
1. Compute the opening $\mathbf{I} \circ B = (\mathbf{I} \ominus B) \oplus B$.
2. Compute the White Top-Hat response $T_{\text{white}} = \mathbf{I} - (\mathbf{I} \circ B)$.

**Step-by-step Solution:**
1. **Erosion $(\mathbf{I} \ominus B)[i] = \min(I[i-1], I[i], I[i+1])$ (using clamp border extension):**
   - $i=0: \min(10, 10, 20) = 10$
   - $i=1: \min(10, 20, 30) = 10$
   - $i=2: \min(20, 30, 95) = 20$
   - $i=3: \min(30, 95, 50) = 30$
   - $i=4: \min(95, 50, 60) = 50$
   - $i=5: \min(50, 60, 70) = 50$
   - $i=6: \min(60, 70, 70) = 60$
   $$\mathbf{I} \ominus B = [10, 10, 20, 30, 50, 50, 60]$$

2. **Dilation $(\mathbf{I} \ominus B) \oplus B = \max(\dots)$:**
   - $i=0: \max(10, 10, 10) = 10$
   - $i=1: \max(10, 10, 20) = 20$
   - $i=2: \max(10, 20, 30) = 30$
   - $i=3: \max(20, 30, 50) = 50$
   - $i=4: \max(30, 50, 50) = 50$
   - $i=5: \max(50, 50, 60) = 60$
   - $i=6: \max(50, 60, 60) = 60$
   $$\mathbf{I} \circ B = [10, 20, 30, 50, 50, 60, 60]$$
   Notice that the opening estimated the smooth background ramp, completely ignoring the sharp spike at $i=3$!

3. **Top-Hat Transform $T_{\text{white}} = \mathbf{I} - (\mathbf{I} \circ B)$:**
   - $i=0: 10 - 10 = 0$
   - $i=1: 20 - 20 = 0$
   - $i=2: 30 - 30 = 0$
   - $i=3: 95 - 50 = \mathbf{45}$
   - $i=4: 50 - 50 = 0$
   - $i=5: 60 - 60 = 0$
   - $i=6: 70 - 60 = 10$
   $$T_{\text{white}} = [0, 0, 0, 45, 0, 0, 10]$$
   The non-uniform illumination gradient is flattened to zero, cleanly isolating the bright defect with intensity 45.

---

### Problem 4.10: Optimal Threshold Selection for Canny Hysteresis
**Statement:** An automated calibration routine computes the cumulative gradient magnitude histogram $H(m)$ of an image with $N = 1,000,000$ pixels. Empirical heuristics suggest that true physical edges occupy between $5\%$ and $10\%$ of all pixels, and the low threshold should be set to $0.4 \times T_{\text{high}}$.
If the 90th percentile of gradient magnitude is $m_{0.90} = 65.0$, and the 95th percentile is $m_{0.95} = 90.0$:
1. Determine the recommended $(T_{\text{low}}, T_{\text{high}})$ thresholds targeting the top $5\%$ gradient magnitudes as strong edges.
2. Explain the risk if $T_{\text{low}}$ is set below the 50th percentile noise floor.

**Step-by-step Solution:**
1. **Threshold Recommendation:**
   Targeting the top $5\%$ of pixels means $95\%$ of pixels have magnitudes below $T_{\text{high}}$:
   $$T_{\text{high}} = m_{0.95} = 90.0$$
   Using the ratio $T_{\text{low}} = 0.4 \times T_{\text{high}}$:
   $$T_{\text{low}} = 0.4 \times 90.0 = 36.0$$
   The recommended thresholds are $(T_{\text{low}}, T_{\text{high}}) = (36.0, 90.0)$.

2. **Risk of Setting $T_{\text{low}}$ Below the Noise Floor:**
   If $T_{\text{low}}$ is set below the stochastic sensor noise floor (e.g., below $m_{0.50}$), random noise fluctuations in homogeneous regions will produce a percolation network of weak edge pixels. Once any legitimate strong edge touches this noise network, the recursive hysteresis edge tracker will leak into the background, generating a web of false, zig-zagging edge contours ("noise bleeding").

---

## 4.7 Solved Exercises

### Exercise 4.1: Optimality of Gaussian Derivative in Canny's Functional
**Statement:** In Canny's variational formulation, prove that if the smoothing filter $G(x)$ is symmetric ($G(-x) = G(x)$), then the first derivative filter $f(x) = G'(x)$ is strictly antisymmetric ($f(-x) = -f(x)$) and has zero DC response ($\int_{-\infty}^\infty f(x) \, dx = 0$).

**Solution:**
1. Let $G: \mathbb{R} \to \mathbb{R}$ be a continuously differentiable symmetric function, so $G(-x) = G(x)$ for all $x \in \mathbb{R}$.
2. Differentiate both sides with respect to $x$ using the chain rule:
   $$\frac{d}{dx} G(-x) = \frac{d}{dx} G(x) \implies G'(-x) \cdot (-1) = G'(x)$$
   Multiplying by $-1$:
   $$G'(-x) = -G'(x)$$
   Let $f(x) \triangleq G'(x)$. Then $f(-x) = -f(x)$, proving that $f(x)$ is strictly **antisymmetric (odd)**.
3. Compute the integral over $\mathbb{R}$:
   $$\int_{-\infty}^\infty f(x) \, dx = \lim_{M \to \infty} \int_{-M}^M G'(x) \, dx$$
   By the Fundamental Theorem of Calculus:
   $$\int_{-M}^M G'(x) \, dx = G(M) - G(-M)$$
   Since $G$ is symmetric, $G(-M) = G(M)$:
   $$G(M) - G(-M) = G(M) - G(M) = 0$$
   Taking the limit as $M \to \infty$:
   $$\int_{-\infty}^\infty f(x) \, dx = 0 \quad \blacksquare$$
   A zero DC response guarantees that the filter produces zero response on flat, constant-intensity regions.

---

### Exercise 4.2: Proof of Idempotence of Morphological Opening
**Statement:** Prove algebraically that morphological opening is idempotent:
$$(A \circ B) \circ B = A \circ B$$
for any binary set $A$ and structuring element $B$.

**Solution:**
1. By definition of morphological opening:
   $$A \circ B = (A \ominus B) \oplus B$$
2. Let $C = A \ominus B$. Then $A \circ B = C \oplus B$.
3. Applying opening again to $A \circ B$:
   $$(A \circ B) \circ B = \Big( (C \oplus B) \ominus B \Big) \oplus B$$
4. A fundamental theorem of mathematical morphology states that for any set $C$ and structuring element $B$:
   $$(C \oplus B) \ominus B = C \bullet B$$
   Moreover, when $C = A \ominus B$, the erosion and dilation satisfy the exact cancellation property:
   $$\Big( (A \ominus B) \oplus B \Big) \ominus B = A \ominus B$$
   *(Dilation cannot expand $A \ominus B$ in any way that survives subsequent erosion by $B$)*.
5. Substituting this identity:
   $$(A \circ B) \ominus B = (A \ominus B)$$
6. Dilating both sides by $B$:
   $$\Big( (A \circ B) \ominus B \Big) \oplus B = (A \ominus B) \oplus B$$
   The left-hand side is $(A \circ B) \circ B$, and the right-hand side is $A \circ B$.
   Therefore:
   $$(A \circ B) \circ B = A \circ B \quad \blacksquare$$

---

### Exercise 4.3: Anti-Extensivity of Opening and Extensivity of Closing
**Statement:** Prove that:
1. Opening is anti-extensive: $A \circ B \subseteq A$.
2. Closing is extensive: $A \subseteq A \bullet B$.

**Solution:**
1. **Opening:**
   Recall $A \circ B = \bigcup_{\mathbf{z}: B_{\mathbf{z}} \subseteq A} B_{\mathbf{z}}$.
   Each translated structuring element $B_{\mathbf{z}}$ included in the union is, by definition, a subset of $A$ ($B_{\mathbf{z}} \subseteq A$).
   Since the union of any family of subsets of $A$ is itself a subset of $A$:
   $$\bigcup_{\mathbf{z}: B_{\mathbf{z}} \subseteq A} B_{\mathbf{z}} \subseteq A \implies A \circ B \subseteq A \quad \blacksquare$$

2. **Closing:**
   Closing is defined as $A \bullet B = (A \oplus B) \ominus B$.
   By morphological duality:
   $$(A \bullet B)^c = A^c \circ \hat{B}$$
   From Part 1, opening is anti-extensive on any set, including $A^c$:
   $$A^c \circ \hat{B} \subseteq A^c$$
   Substituting $(A \bullet B)^c$:
   $$(A \bullet B)^c \subseteq A^c$$
   Taking set complements on both sides reverses the inclusion relation:
   $$A \subseteq A \bullet B \quad \blacksquare$$

---

### Exercise 4.4: Worst-Case Recursion Depth in Canny Hysteresis Tracking
**Statement:** In an $H \times W$ image, what is the theoretical worst-case recursion stack depth of a naive recursive Depth-First Search (DFS) edge tracking implementation? Explain how to prevent stack overflow in production systems.

**Solution:**
1. **Worst-Case Stack Depth:**
   Consider an edge contour that forms a winding serpentine (snake) path passing through nearly every pixel of the $H \times W$ grid:
   $$L_{\text{max}} = \mathcal{O}(H \cdot W)$$
   For a $1920 \times 1080$ frame, $H \cdot W \approx 2.07 \times 10^6$ pixels.
   A recursive call stack where each call frame consumes 64 bytes would require over $130\text{ MB}$ of call stack memory, causing an immediate fatal `StackOverflowException`.
2. **Production Mitigation:**
   - **Explicit Heap-Allocated Stack or Queue (BFS):** Replace recursive function calls with an iterative loop utilizing an explicit `std::vector` or pre-allocated `Int32Array` queue on the heap.
   - **Queue Capacity:** The heap array capacity is bounded by $H \cdot W$ integers (a few megabytes of heap memory), which avoids stack overflow.
   - **In-Place Marking:** Set $M_{\text{NMS}}[y, x] = 0$ as soon as a pixel is pushed onto the queue to guarantee every pixel is visited at most once.

---

### Exercise 4.5: Skeletonization via Morphological Medial Axis Transform
**Statement:** Define the morphological skeleton $S(A)$ of a binary shape $A$ using structuring element $B$, and write the finite union formula.

**Solution:**
The morphological skeleton (Lantuejoul's formula) expresses the medial axis of a shape $A$ as the union of the boundaries of maximal inscribed disks:
$$S(A) = \bigcup_{k=0}^K S_k(A)$$
where each skeleton subset $S_k(A)$ is defined as:
$$S_k(A) = (A \ominus k B) \setminus \Big( (A \ominus k B) \circ B \Big)$$
Here:
- $k B = B \oplus B \oplus \dots \oplus B$ denotes the structuring element dilated $k$ times ($0 B = \{\mathbf{0}\}$).
- $A \ominus k B$ represents successive erosions of shape $A$.
- $(A \ominus k B) \circ B$ removes features smaller than $B$ from the eroded shape.
- The set difference isolates the centers of maximal disks of radius $k$.
- $K = \max \{ k \mid A \ominus k B \neq \emptyset \}$ is the maximum erosion step before the shape vanishes.
The original shape can be perfectly reconstructed from its skeleton subsets: $A = \bigcup_{k=0}^K (S_k(A) \oplus k B)$.

---

### Exercise 4.6: Invariance of Central Moments to 2D Spatial Translation
**Statement:** Prove mathematically that the second-order central moments $\mu_{p, q}$ are completely invariant under any spatial translation $\mathbf{x}_{\text{new}} = \mathbf{x} + \mathbf{t}$ where $\mathbf{t} = [t_x, t_y]^\top$.

**Solution:**
1. Let the original shape have coordinates $\mathbf{x} = [x, y]^\top$ with centroid $[\bar{x}, \bar{y}]^\top$.
2. The translated coordinates are $\tilde{x} = x + t_x$ and $\tilde{y} = y + t_y$.
3. Compute the centroid of the translated shape:
   $$\bar{\tilde{x}} = \frac{1}{A} \sum (\tilde{x}) = \frac{1}{A} \sum (x + t_x) = \left(\frac{1}{A} \sum x\right) + t_x = \bar{x} + t_x$$
   $$\bar{\tilde{y}} = \bar{y} + t_y$$
4. Compute the central moment of the translated shape:
   $$\tilde{\mu}_{p, q} = \sum (\tilde{x} - \bar{\tilde{x}})^p (\tilde{y} - \bar{\tilde{y}})^q$$
5. Substitute $\tilde{x} = x + t_x$ and $\bar{\tilde{x}} = \bar{x} + t_x$:
   $$\tilde{x} - \bar{\tilde{x}} = (x + t_x) - (\bar{x} + t_x) = x - \bar{x}$$
   $$\tilde{y} - \bar{\tilde{y}} = (y + t_y) - (\bar{y} + t_y) = y - \bar{y}$$
6. Therefore:
   $$\tilde{\mu}_{p, q} = \sum (x - \bar{x})^p (y - \bar{y})^q = \mu_{p, q} \quad \blacksquare$$
   The central moments are independent of translation $\mathbf{t}$.

---

### Exercise 4.7: Hit-or-Miss Transform Formulation
**Statement:** Define the Morphological **Hit-or-Miss Transform** (HMT) $A \circledast B$ for composite structuring element $B = (B_1, B_2)$ where $B_1 \cap B_2 = \emptyset$. Explain how it performs exact shape matching.

**Solution:**
1. Let $B_1$ denote the foreground structuring element (the shape to match) and $B_2$ denote the background structuring element (the surrounding empty space).
2. The Hit-or-Miss Transform of binary image $A$ is defined as:
   $$A \circledast B \triangleq (A \ominus B_1) \cap (A^c \ominus B_2)$$
3. **Operational Mechanics:**
   - The term $A \ominus B_1$ finds all locations where the foreground pattern $B_1$ is completely present ("hits" the foreground).
   - The term $A^c \ominus B_2$ finds all locations where the background pattern $B_2$ is completely absent in $A$ ("misses" the foreground / fits inside background $A^c$).
   - The intersection $\cap$ requires both conditions to be satisfied simultaneously.
4. If a pixel appears in $A \circledast B$, the local neighborhood matches the exact geometric profile specified by $(B_1, B_2)$. It is used for corner detection, junction detection, and thinning.

---

### Exercise 4.8: Convex Hull via Morphological Thinning/Thickening
**Statement:** Describe the morphological procedure for generating the **convex hull** $C(A)$ of a binary shape $A$ using 8 directional structuring elements.

**Solution:**
1. Define a sequence of structuring elements $B^1, B^2, \dots, B^8$ representing directional exterior half-planes (e.g., $B^1 = \begin{bmatrix} 1 & 0 & 0 \\ 1 & 0 & 0 \\ 1 & 0 & 0 \end{bmatrix}$ rotated by $45^\circ$).
2. The convex hull is computed by iteratively applying the morphological thickening operation:
   $$X_k^i = (X_{k-1}^i \circledast B^i) \cup X_{k-1}^i$$
   where $X_0^i = A$, and the process is repeated until convergence ($X_k^i = X_{k-1}^i$).
3. Let $D^i$ denote the converged result for structuring element $B^i$.
4. The complete convex hull is the union of the four primary directional hulls:
   $$C(A) = \bigcup_{i=1}^4 D^i$$
   The resulting polygon encloses all points of $A$ such that any line segment connecting two points in $C(A)$ lies entirely within $C(A)$.

---

### Exercise 4.9: Computational Complexity of Two-Pass CCA with Union-Find
**Statement:** Prove that the time complexity of the Two-Pass Connected Component Labeling algorithm on an $N$-pixel image using Disjoint-Set Union-Find with path compression and union-by-rank is $\mathcal{O}(N \cdot \alpha(N))$, where $\alpha$ is the inverse Ackermann function.

**Solution:**
1. Pass 1 iterates across all $N = H \times W$ pixels exactly once.
2. For each pixel, a constant number of neighbors (at most 4 for 8-connectivity causal mask) are inspected.
3. At most one `MakeSet` operation, 4 `Find` operations, and 2 `Union` operations are invoked per pixel.
4. Total number of Disjoint-Set operations is $M \le 7N$.
5. Robert Tarjan (1975) proved that any sequence of $M$ operations on a disjoint-set forest of $N$ elements with path compression and union-by-rank takes time:
   $$T(M, N) = \mathcal{O}(M \cdot \alpha(N))$$
6. Since $M = \mathcal{O}(N)$:
   $$T = \mathcal{O}(N \cdot \alpha(N))$$
   For all realistic image sizes ($N \le 10^{12}$ pixels), $\alpha(N) \le 4$. Thus, the algorithm runs in strictly **linear time $\mathcal{O}(N)$** in practice. $\blacksquare$

---

### Exercise 4.10: Edge Streaking Elimination in Canny Hysteresis
**Statement:** Explain why single-threshold edge detection creates severe "streaking" (broken dotted line artifacts) on real-world noisy camera images, and explain why Canny hysteresis thresholding eliminates this failure mode.

**Solution:**
1. On real-world camera images, physical object boundaries exhibit spatial variations in contrast due to shadows, surface curvature, and sensor shot noise.
2. Under a single global threshold $T$:
   - If the gradient magnitude oscillates around $T$ along the edge contour ($M(s) = T + 2, T - 1, T + 3, T - 2, \dots$), pixels with $M < T$ are dropped.
   - The continuous physical edge is broken into a disjointed sequence of isolated dashes and dots (**streaking**).
3. **Canny Hysteresis Solution:**
   - Strong threshold $T_{\text{high}}$ is set high enough that only high-contrast segments trigger edge seeds with zero false positives.
   - Low threshold $T_{\text{low}}$ is set low enough to include the faint segments where $M(s)$ drops.
   - The recursive 8-connected tracking allows confirmed strong edges to "pull along" faint weak segments, ensuring unbroken, topologically continuous boundary contours. $\blacksquare$
