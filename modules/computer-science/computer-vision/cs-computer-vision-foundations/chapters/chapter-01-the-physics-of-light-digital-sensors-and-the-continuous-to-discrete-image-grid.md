# Chapter 1: The Physics of Light, Digital Sensors, and the Continuous-to-Discrete Image Grid

---

## 1.1 The Physical Nature of Light and Image Formation

To a computer program, a digital image appears as a sterile, rectangular matrix of numbers—an array of 8-bit unsigned integers bounded within $[0, 255]$. Yet every single number in that matrix represents the culmination of a violent, continuous physical journey spanning the laws of quantum electrodynamics, geometric optics, thermodynamics, and solid-state physics.

```
                           THE PHYSICAL JOURNEY OF A PHOTON
                           
   [ ILLUMINANT ] ──► Radiance L_i(λ) ──► [ SURFACE MATTER ]
   (Sun / Laser / Light Bulb)             (BRDF Reflection: ρ(θ_i, ϕ_i, θ_r, ϕ_r; λ))
                                                   │
                                                   ▼ Reflected Radiance L_r
                                          [ OPTICAL APERTURE ]
                                          (Lenses, Pupil, Pinhole)
                                                   │
                                                   ▼ Irradiance E(x, y)
                                          [ SILICON DETECTOR ]
                                          (CMOS / CCD Potential Wells)
                                                   │
                                                   ▼ Photoelectrons e^-
                                          [ ANALOG-TO-DIGITAL ]
                                          (Quantization: ADC 0..255)
                                                   │
                                                   ▼
                                         Digital Matrix I[y, x]
```

### Radiometry: Quantifying the Flow of Light
Before light encounters a camera sensor, it obeys the foundational laws of **radiometry**:
1. **Radiant Energy ($Q$, Joules):** The fundamental physical quantity of electromagnetic radiation, transported in discrete quantum packets known as photons:
   $$E_{\text{photon}} = h \nu = \frac{h c}{\lambda}$$
   where $h \approx 6.626 \times 10^{-34} \text{ J}\cdot\text{s}$ is Planck's constant, $c \approx 3 \times 10^8 \text{ m/s}$ is the speed of light, and $\lambda$ is wavelength.
2. **Radiant Flux ($\Phi$, Watts):** Radiant energy flowing through a surface per unit time: $\Phi = \frac{dQ}{dt}$.
3. **Irradiance ($E$, $\text{W}/\text{m}^2$):** Radiant flux incident upon a unit surface area:
   $$E = \frac{d\Phi}{dA}$$
   The camera sensor measures irradiance integrated across the spatial extent of each individual pixel.
4. **Radiance ($L$, $\text{W}/(\text{m}^2 \cdot \text{sr})$):** Radiant flux emitted, reflected, or received per unit projected area per unit solid angle $\Omega$:
   $$L = \frac{d^2\Phi}{dA \cos\theta \, d\Omega}$$
   Radiance is the fundamental invariant of radiative transport: along any ray traveling through a non-participating medium (such as clear air), radiance remains constant regardless of distance from the emitter.

### Surface Reflection and the BRDF
When incident light striking an object at point $\mathbf{x}$ from direction $\boldsymbol{\omega}_i = (\theta_i, \phi_i)$ reflects toward the camera lens in direction $\boldsymbol{\omega}_r = (\theta_r, \phi_r)$, the interaction is governed by the **Bidirectional Reflectance Distribution Function (BRDF)**, denoted $f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_r; \lambda)$:
$$f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_r; \lambda) = \frac{dL_r(\mathbf{x}, \boldsymbol{\omega}_r; \lambda)}{dE_i(\mathbf{x}, \boldsymbol{\omega}_i; \lambda)} = \frac{dL_r(\mathbf{x}, \boldsymbol{\omega}_r; \lambda)}{L_i(\mathbf{x}, \boldsymbol{\omega}_i; \lambda) \cos\theta_i \, d\Omega_i}$$

The reflected radiance entering the camera lens is obtained by integrating incident light over the entire hemisphere $\Omega_+$ above the surface:
$$L_r(\mathbf{x}, \boldsymbol{\omega}_r) = \int_{\Omega_+} f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_r) L_i(\mathbf{x}, \boldsymbol{\omega}_i) \cos\theta_i \, d\Omega_i$$

- **Lambertian (Diffuse) Surfaces:** Reflected light is scattered uniformly in all directions: $f_r = \frac{\rho_d}{\pi}$, where $\rho_d \in [0, 1]$ is the diffuse albedo. The observed brightness is independent of the viewing angle.
- **Specular Surfaces:** Reflected light forms sharp, mirror-like reflections governed by Snell's Law ($\theta_r = \theta_i$).

---

## 1.2 Digital Sensor Physics: From Photons to Electrons

Once light passes through the camera optics, continuous spatial irradiance $E(x, y)$ falls upon a silicon sensor array. Modern computer vision relies almost exclusively on two sensor architectures:
1. **Charge-Coupled Devices (CCD):** Incident photons generate charge packets stored in potential wells. At the end of exposure, these charges are shifted row-by-row across the chip like a bucket brigade toward a single readout amplifier.
2. **Complementary Metal-Oxide Semiconductor (CMOS):** Each pixel contains its own photodiode and integrated readout transistors. Charges are converted to voltage directly at the pixel level, enabling massive parallel readouts, low power consumption, and high frame rates (hundreds of frames per second).

```
                         ANATOMY OF A CMOS ACTIVE PIXEL
                         
           Incident Light Rays (Photons hν)
                 │         │         │
                 ▼         ▼         ▼
           ┌─────────────────────────────┐  ◄── Microlens (Concentrates Flux)
           │      COLOR FILTER (CFA)     │  ◄── Bayer Dye Layer (R, G, or B)
           ├─────────────────────────────┤
           │      SILICON SUBSTRATE      │
           │                             │
           │      e^-  e^-  e^-  e^-     │  ◄── Depletion Region (Electron-Hole Pairs)
           │                             │
           │      [ Potential Well ]     │  ◄── Stores Accumulated Photoelectrons
           └──────────────┬──────────────┘
                          │ Transfer Gate (TG)
                          ▼
             Floating Diffusion (FD Node) ──► Source Follower Amplifier (V_out)
```

### The Photoelectric Conversion
Silicon has an electronic bandgap of $E_g \approx 1.12 \text{ eV}$ at room temperature. When a photon with energy $E = h\nu > E_g$ strikes the silicon substrate:
$$\lambda < \frac{hc}{E_g} \approx \frac{(6.626 \times 10^{-34})(3 \times 10^8)}{1.12 \times 1.602 \times 10^{-19}} \approx 1,100 \text{ nm}$$
it excites a valence electron across the bandgap into the conduction band, creating an **electron-hole pair**.
Photons in the visible spectrum ($400 \text{ nm}$ to $700 \text{ nm}$) have energies ranging from $1.77 \text{ eV}$ to $3.10 \text{ eV}$, efficiently generating photoelectrons. Photons with $\lambda > 1,100 \text{ nm}$ (deep infrared) pass through silicon undetected.

The conversion efficiency is quantified by **Quantum Efficiency (QE)** $\eta(\lambda) \in [0, 1]$:
$$\eta(\lambda) = \frac{\text{Number of Collected Photoelectrons}}{\text{Number of Incident Photons}}$$

### Noise Sources in Silicon Sensors
A digital pixel value is never a pure reflection of incoming light; it is corrupted by stochastic physical noise:
1. **Photon Shot Noise:** Because photons arrive according to a Poisson process, if the expected number of arriving photons is $\mu_p$, the variance in arrival count is strictly equal to $\mu_p$:
   $$\sigma_{\text{shot}} = \sqrt{\mu_e} = \sqrt{\eta \mu_p}$$
   Shot noise is an inescapable quantum physical limit; it cannot be engineered away by better silicon design.
2. **Dark Current Noise:** Thermal vibrations in the silicon crystal lattice spontaneously generate electron-hole pairs even in total darkness. Dark current scales exponentially with temperature: doubling roughly every $6^\circ\text{C}$ to $8^\circ\text{C}$.
3. **Read Noise:** Electronic noise introduced by the on-chip amplifiers and Analog-to-Digital Converter (ADC).
4. **Fixed Pattern Noise (FPN):** Spatial variations in pixel geometry and transistor threshold voltages across the sensor wafer.

The **Signal-to-Noise Ratio (SNR)** of a pixel collecting $N_e$ photoelectrons during exposure time $\Delta t$ is:
$$\text{SNR} = \frac{N_e}{\sqrt{N_e + N_{\text{dark}} \Delta t + \sigma_{\text{read}}^2}}$$
In bright daylight ($N_e \gg 10,000$), shot noise dominates: $\text{SNR} \approx \sqrt{N_e}$. In dark low-light robotics environments ($N_e < 10$), read noise dominates, severely degrading perception.

---

## 1.3 Color Perception and Filter Arrays

Human retinas do not perceive the continuous spectral power distribution $S(\lambda)$ of light. Instead, biological vision compresses the infinite-dimensional spectrum into three sensory channels using three types of cone photoreceptors:
- **S-Cones (Short):** Peak absorption around $\lambda \approx 420 \text{ nm}$ (Blue).
- **M-Cones (Medium):** Peak absorption around $\lambda \approx 530 \text{ nm}$ (Green).
- **L-Cones (Long):** Peak absorption around $\lambda \approx 560 \text{ nm}$ (Red).

### The Bayer Color Filter Array (CFA)
Silicon photodiodes are naturally colorblind: they respond to all wavelengths across $[400 \text{ nm}, 1000 \text{ nm}]$ without discrimination.
To capture color images without using three separate physical sensor chips, Bryce Bayer (Eastman Kodak, 1976) invented the **Bayer Color Filter Array**: a microscopic mosaic of red, green, and blue dye filters deposited directly onto the pixel grid in a repeating $2 \times 2$ periodic pattern:

```
                         THE 2x2 BAYER MOSAIC PATTERN
                         
                              ┌───────┬───────┐
                              │ Green │  Red  │
                              │ (G_1) │  (R)  │
                              ├───────┼───────┤
                              │ Blue  │ Green │
                              │  (B)  │ (G_2) │
                              └───────┴───────┘
```

Notice a profound structural asymmetry: **50% of the pixels are Green, 25% are Red, and 25% are Blue**.
Why? Because human visual acuity is overwhelmingly concentrated in the green spectrum, where human luminous efficiency peaks. Green pixels capture high-frequency spatial luminance, while Red and Blue capture lower-frequency chrominance.

### Demosaicing Algorithms
At each physical pixel location, the camera captures **only one color channel**:
$$\text{A 12-Megapixel raw sensor records 6M green values, 3M red values, and 3M blue values.}$$
The remaining two-thirds of the missing color data must be mathematically reconstructed through **demosaicing (de-bayering)**.

```
                      RAW MOSAIC VS FULL RGB RECONSTRUCTION
                      
    Raw Bayer Sensor Array                   Reconstructed RGB Channels
    ┌───┬───┬───┬───┐                         ┌───┬───┬───┬───┐
    │ G │ R │ G │ R │                         │RGB│RGB│RGB│RGB│
    ├───┼───┼───┼───┤     Demosaicing         ├───┼───┼───┼───┤
    │ B │ G │ B │ G │   ══════════════►       │RGB│RGB│RGB│RGB│
    ├───┼───┼───┼───┤  Interpolate Missing    ├───┼───┼───┼───┤
    │ G │ R │ G │ R │     Color Planes        │RGB│RGB│RGB│RGB│
    └───┴───┴───┴───┘                         └───┴───┴───┴───┘
```

1. **Bilinear Demosaicing:** The simplest spatial approach. Missing green values are interpolated by averaging their 4 orthogonal cross-neighbors:
   $$G(x, y) = \frac{G(x-1, y) + G(x+1, y) + G(x, y-1) + G(x, y+1)}{4}$$
   While computationally fast, naive bilinear interpolation blurs sharp edges and produces colorful "zippering" artifacts along high-contrast boundaries.
2. **Edge-Directed Gradient Interpolation (Malvar-He-Cutler):** Uses directional horizontal and vertical gradient estimators to interpolate along edges rather than across them:
   $$\Delta H = |G(x-1, y) - G(x+1, y)|, \quad \Delta V = |G(x, y-1) - G(x, y+1)|$$
   If $\Delta H < \Delta V$, the edge runs horizontally; interpolation averages horizontal neighbors, preserving crisp visual boundaries.

---

## 1.4 Color Spaces and Spectral Representations

Once RGB channels are reconstructed, digital vision systems represent color across various mathematical coordinate spaces:

```
                            COLOR SPACE TAXONOMY
                            
   ┌──────────────────────────────────────────────────────────────────┐
   │ 1. HARDWARE / DEVICE-DEPENDENT:                                  │
   │    • sRGB: Standard web & camera monitor space (Gamma ≈ 2.2)     │
   │    • Linear RGB: Un-gamma-corrected physical irradiance space    │
   ├──────────────────────────────────────────────────────────────────┤
   │ 2. PERCEPTUAL / INTUITIVE:                                       │
   │    • HSV / HSL: Hue (angle 0-360°), Saturation, Value/Lightness  │
   ├──────────────────────────────────────────────────────────────────┤
   │ 3. TRANSMISSION / COMPRESSION:                                   │
   │    • YCbCr / YPbPr: Luminance Y, Blue-diff Cb, Red-diff Cr       │
   ├──────────────────────────────────────────────────────────────────┤
   │ 4. DEVICE-INDEPENDENT & PERCEPTUALLY UNIFORM:                    │
   │    • CIE XYZ (1931): Linear standard observer color space        │
   │    • CIELAB (L*a*b*): Euclidean distance matches human perception│
   └──────────────────────────────────────────────────────────────────┘
```

### 1. Linear RGB vs sRGB and Gamma Correction
Human perception of brightness is non-linear: our eyes are far more sensitive to subtle differences between dark tones than between bright tones (governed by Weber-Fechner's Law).
To prevent dark quantization bands in 8-bit displays, consumer image formats apply a non-linear power curve known as **Gamma Encoding** ($\gamma \approx 2.2$):
$$V_{\text{sRGB}} = \begin{cases}
12.92 \, V_{\text{linear}} & \text{if } V_{\text{linear}} \le 0.0031308 \\
1.055 \, V_{\text{linear}}^{1/2.4} - 0.055 & \text{if } V_{\text{linear}} > 0.0031308
\end{cases}$$

**Critical Warning for Computer Vision Engineers:**
Physical linear filtering (Gaussian blur, convolutions, perspective transformations) must **never** be performed directly on gamma-encoded sRGB values! Performing spatial convolution on gamma-compressed values distorts optical photon conservation. Algorithms should linearize pixels before filtering and re-apply gamma only for final display.

### 2. The Luminance (Grayscale) Transformation
In many robotic perception tasks, color is discarded to maximize frame rate and eliminate sensitivity to ambient light shifts. Converting an RGB pixel to scalar grayscale luminance $Y$ is governed by the ITU-R Recommendation BT.601 standard:
$$Y = 0.299 \, R + 0.587 \, G + 0.114 \, B$$
Notice the coefficients: Green accounts for $58.7\%$ of luminance, Red for $29.9\%$, and Blue for only $11.4\%$, reflecting the human eye's spectral sensitivity.

### 3. CIELAB: Perceptual Uniformity
In standard RGB space, Euclidean distance $\|\mathbf{c}_1 - \mathbf{c}_2\|_2$ does not correlate with human perceived color difference: a shift of 20 units in Green looks massive, while 20 units in Blue is barely perceptible.
The International Commission on Illumination (CIE) established **CIELAB ($L^*a^*b^*$)**, where:
- $L^* \in [0, 100]$: Perceptual Lightness.
- $a^* \in [-128, 127]$: Red-Green chromatic opponent channel.
- $b^* \in [-128, 127]$: Yellow-Blue chromatic opponent channel.
In CIELAB, the Euclidean metric $\Delta E^* = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$ directly models perceived difference: $\Delta E^* \approx 2.3$ represents the "Just Noticeable Difference" (JND) threshold of human vision.

---

## 1.5 The Continuous-to-Discrete Transition: Sampling, Quantization, and Aliasing

An image in the real physical universe is a continuous 2D function of continuous spatial coordinates:
$$f(x, y) \in \mathbb{R}^+, \quad (x, y) \in \mathbb{R}^2$$

A digital computer cannot manipulate continuous functions. It must convert $f(x, y)$ into a discrete matrix through two operations: **Spatial Sampling** and **Amplitude Quantization**.

```
                   SAMPLING AND QUANTIZATION DISCRETIZATION
                   
   Continuous Physical Function f(x, y)
             │
             ▼ Spatial Sampling (2D Dirac Comb)
   Grid of Impulse Heights: f[m, n] = f(m Δx, n Δy)
             │
             ▼ Amplitude Quantization (ADC Rounding)
   Discrete Integer Array: I[y, x] ∈ {0, 1, ..., 255}
```

### The 2D Sampling Theorem and Aliasing
Mathematically, sampling corresponds to multiplying continuous function $f(x, y)$ by a 2D Dirac comb (ideal sampling lattice) with grid spacing $\Delta x, \Delta y$:
$$s(x, y) = \sum_{m=-\infty}^\infty \sum_{n=-\infty}^\infty \delta(x - m \Delta x, y - n \Delta y)$$
$$f_{\text{sampled}}(x, y) = f(x, y) \cdot s(x, y)$$

In the spatial frequency domain (2D Fourier Transform), multiplication becomes convolution:
$$\mathcal{F}\{f_{\text{sampled}}\}(u, v) = F(u, v) * S(u, v) = \frac{1}{\Delta x \Delta y} \sum_{k=-\infty}^\infty \sum_{l=-\infty}^\infty F\left(u - \frac{k}{\Delta x}, v - \frac{l}{\Delta y}\right)$$
Sampling replicates the original continuous spectrum $F(u, v)$ across an infinite periodic grid of frequency intervals $\left(\frac{1}{\Delta x}, \frac{1}{\Delta y}\right)$.

```
                          SPATIAL ALIASING MECHANISM
                          
   Continuous Spectrum F(u)               Replicated Spectrum After Sampling
   
          / \                                  / \           / \
        /     \                              /     \       /     \
   ────┴───────┴────► u                 ────┴───┬───┴─────┴───┬───┴────► u
      -u_max   u_max                           -1/Δx         1/Δx
                                                (No Overlap: Valid Reconstruction)
                                                
   Aliased Spectrum (Sampling Frequency < 2 · u_max):
                      / \   / \
                    /     X     \   ◄── Overlapping spectral replicas!
   ────────────────┴─────┴─┴─────┴────────────────► u
                     High frequencies fold into low frequencies! (Moiré Patterns)
```

**The Nyquist-Shannon Sampling Criterion:**
To reconstruct the continuous physical scene $f(x, y)$ without distortion, the sampling frequencies must exceed twice the maximum spatial frequencies present in the scene:
$$f_{s, x} = \frac{1}{\Delta x} > 2 u_{\max}, \quad f_{s, y} = \frac{1}{\Delta y} > 2 v_{\max}$$
The frequency $u_N = \frac{1}{2 \Delta x}$ is the **Nyquist Limit**.

If the scene contains high-frequency details (such as a fine-mesh screen, distant brick patterns, or sharp fabric lines) exceeding $u_N$, those high frequencies **alias** (fold backward) into low-frequency bands. Aliasing manifests as disturbing Moiré interference ripples and jagged stair-stepping edges. Camera sensors counteract aliasing by placing an **optical low-pass anti-aliasing filter** (a birefringent crystal layer) in front of the silicon to physically blur frequencies beyond $u_N$ before sampling occurs.

### Amplitude Quantization and Bit Depth
After sampling in space, the analog continuous voltage $V \in [V_{\min}, V_{\max}]$ is quantized into discrete levels by an Analog-to-Digital Converter (ADC):
$$Q = \text{round}\left( (2^B - 1) \cdot \frac{V - V_{\min}}{V_{\max} - V_{\min}} \right)$$
where $B$ is the bit depth:
- **8-bit Quantization:** $2^8 = 256$ discrete levels ($[0, 255]$). Consumes 1 byte per channel.
- **10-bit Quantization:** $2^{10} = 1,024$ discrete levels. Standard in modern HDR video.
- **12-bit / 14-bit Quantization:** $4,096$ to $16,384$ discrete levels. Standard in raw computational photography and autonomous vehicle lidar/cameras.
- **16-bit Float:** Half-precision floating point used in deep neural network perception.

---

## 1.6 The Semantic Gap

We arrive at the central philosophical and computational dilemma of computer vision: **The Semantic Gap**.

```
                             THE SEMANTIC GAP
                             
   HUMAN VISUAL COGNITION:                 COMPUTER PERCEPTION:
   
   "A domestic tabby cat sleeping          A 3D array of unsigned 8-bit integers:
    peacefully on a red velvet couch."     [[[142,  34,  12], [145,  35,  14], ...],
                                            [[140,  32,  11], [144,  36,  15], ...],
                                            ...]
                                           
   High-Level Causal Concepts              Low-Level Photon Quantization Counts
   (Depth, Objects, Material, Intent)      (Pixel Intensities [0..255])
   
   ══════════════════════════════════════════════════════════════════════════════
   CHALLENGES ACROSS THE GAP:
   • Illumination Variations: Turning off a lamp changes 100% of the numbers.
   • Perspective & Scale: Moving 1 meter closer quadruples the pixel footprint.
   • Deformation & Articulation: A cat stretching changes its geometric silhouette.
   • Occlusion: A coffee mug in front hides half the animal's features.
```

The goal of computer vision is to construct algorithmic bridges across this chasm: converting high-dimensional, noisy, uncalibrated matrices of integer photon counts into structured, robust physical semantics capable of guiding robotic action.

---

## 1.7 10 Comprehensive Step-by-Step Worked Examples

### Worked Example 1.1: Calculating Photon Arrival Count and Shot Noise SNR
**Problem:** A CMOS sensor pixel has a physical photosensitive area of $A = 2.0 \times 2.0 \ \mu\text{m}^2 = 4.0 \times 10^{-12} \text{ m}^2$.
It is illuminated by monochromatic green light with wavelength $\lambda = 550 \text{ nm}$ at an irradiance of $E = 0.50 \ \text{W/m}^2$.
The sensor quantum efficiency at this wavelength is $\eta = 0.60$ (60%), and the exposure time is $\Delta t = 10 \text{ ms} = 0.010 \text{ s}$.
The pixel readout noise is $\sigma_{\text{read}} = 2.5 \ e^-$ RMS, and dark current is negligible.
1. Calculate the energy of a single photon of green light.
2. Calculate the total number of photons $N_{\text{photons}}$ striking the pixel during the exposure.
3. Calculate the number of collected photoelectrons $N_e$.
4. Compute the theoretical Signal-to-Noise Ratio (SNR) in decibels (dB): $\text{SNR}_{\text{dB}} = 20 \log_{10}(\text{SNR})$.

**Solution:**
1. Photon energy:
$$E_{\text{photon}} = \frac{hc}{\lambda} = \frac{(6.626 \times 10^{-34} \text{ J}\cdot\text{s})(3.0 \times 10^8 \text{ m/s})}{550 \times 10^{-9} \text{ m}} = \frac{1.9878 \times 10^{-25}}{5.5 \times 10^{-7}} \approx 3.614 \times 10^{-19} \text{ Joules}$$

2. Total incident optical energy on the pixel:
$$Q = E \cdot A \cdot \Delta t = (0.50 \text{ W/m}^2) \times (4.0 \times 10^{-12} \text{ m}^2) \times (0.010 \text{ s}) = 2.0 \times 10^{-14} \text{ Joules}$$
Total incident photons:
$$N_{\text{photons}} = \frac{Q}{E_{\text{photon}}} = \frac{2.0 \times 10^{-14}}{3.614 \times 10^{-19}} \approx 55,340 \text{ photons}$$

3. Collected photoelectrons:
$$N_e = \eta \cdot N_{\text{photons}} = 0.60 \times 55,340 \approx 33,204 \text{ electrons}$$

4. Noise and SNR calculation:
Photon shot noise variance is $\sigma_{\text{shot}}^2 = N_e = 33,204$.
Total noise variance:
$$\sigma_{\text{total}}^2 = \sigma_{\text{shot}}^2 + \sigma_{\text{read}}^2 = 33,204 + 2.5^2 = 33,204 + 6.25 = 33,210.25$$
$$\sigma_{\text{total}} = \sqrt{33,210.25} \approx 182.24 \ e^-$$
Signal-to-Noise Ratio:
$$\text{SNR} = \frac{N_e}{\sigma_{\text{total}}} = \frac{33,204}{182.24} \approx 182.20$$
SNR in decibels:
$$\text{SNR}_{\text{dB}} = 20 \log_{10}(182.20) \approx 20 \times 2.2605 = 45.21 \text{ dB}$$
An SNR of $45.2 \text{ dB}$ represents excellent image fidelity. Notice that readout noise ($6.25$) was completely swamped by quantum photon shot noise ($33,204$).

---

### Worked Example 1.2: Bilinear Bayer Demosaicing Interpolation
**Problem:** A raw $3 \times 3$ Bayer grid segment has the following pixel pattern and raw digital counts:
$$\begin{bmatrix}
G_{00} = 120 & R_{01} = 200 & G_{02} = 130 \\
B_{10} = 80  & G_{11} = 125 & B_{12} = 84 \\
G_{20} = 118 & R_{21} = 210 & G_{22} = 128
\end{bmatrix}$$
Reconstruct the full $[R, G, B]$ vector at the central pixel $(1, 1)$ using bilinear demosaicing.

**Solution:**
At pixel $(1, 1)$, the raw filter is **Green ($G_{11}$)**:
1. Green channel: The measured value is used directly:
   $$G(1, 1) = G_{11} = 125$$
2. Red channel: Red is missing at $(1, 1)$. Its vertical neighbors are Red ($R_{01}$ and $R_{21}$):
   $$R(1, 1) = \frac{R_{01} + R_{21}}{2} = \frac{200 + 210}{2} = \frac{410}{2} = 205$$
3. Blue channel: Blue is missing at $(1, 1)$. Its horizontal neighbors are Blue ($B_{10}$ and $B_{12}$):
   $$B(1, 1) = \frac{B_{10} + B_{12}}{2} = \frac{80 + 84}{2} = \frac{164}{2} = 82$$
Reconstructed central pixel:
$$\mathbf{C}(1, 1) = [R, G, B]^\top = [205, 125, 82]^\top$$

---

### Worked Example 1.3: RGB to Grayscale Conversion and Precision Loss
**Problem:** An RGB pixel has values $R = 180, G = 90, B = 220$.
1. Compute the BT.601 standard grayscale luminance $Y$.
2. Compute the naive average luminance $Y_{\text{naive}} = \frac{R + G + B}{3}$.
3. Calculate the percentage discrepancy between the perceptually correct luminance and the naive average.

**Solution:**
1. BT.601 perceptual luminance:
$$Y = 0.299 \, R + 0.587 \, G + 0.114 \, B$$
$$Y = 0.299(180) + 0.587(90) + 0.114(220) = 53.82 + 52.83 + 25.08 = 131.73 \implies 132$$

2. Naive unweighted average:
$$Y_{\text{naive}} = \frac{180 + 90 + 220}{3} = \frac{490}{3} \approx 163.33 \implies 163$$

3. Discrepancy analysis:
$$\Delta Y = Y_{\text{naive}} - Y = 163.33 - 131.73 = +31.60$$
$$\text{Relative Discrepancy} = \frac{31.60}{131.73} \approx 0.2399 \quad (24.0\% \text{ error})$$
The naive average overestimates brightness by $24\%$ because it assigns equal weight to Blue ($220$), whereas the human visual system is largely insensitive to blue photons.

---

### Worked Example 1.4: Gamma Linearization for Physically Accurate Filtering
**Problem:** Two adjacent pixels on a digital screen have sRGB values $I_1 = 50$ and $I_2 = 200$ (normalized in $[0, 1]$ as $s_1 = \frac{50}{255} \approx 0.1961$ and $s_2 = \frac{200}{255} \approx 0.7843$).
Assume a simplified gamma power law: $s = L^{1/\gamma}$ with $\gamma = 2.2 \implies L = s^{2.2}$.
1. Compute the true physical linear irradiance $L_1$ and $L_2$.
2. Compute the correct physical average irradiance $\bar{L} = \frac{L_1 + L_2}{2}$ and convert it back to sRGB: $s_{\text{correct}} = \bar{L}^{1/2.2}$.
3. Compute the naive un-linearized sRGB average $\bar{s}_{\text{naive}} = \frac{s_1 + s_2}{2}$.
4. Compare the two results in 8-bit integer units $[0, 255]$.

**Solution:**
1. Linear irradiance values:
$$L_1 = (0.1961)^{2.2} \approx 0.0279$$
$$L_2 = (0.7843)^{2.2} \approx 0.5866$$

2. Physical optical average:
$$\bar{L} = \frac{0.0279 + 0.5866}{2} = \frac{0.6145}{2} \approx 0.30725$$
Re-encoding to sRGB:
$$s_{\text{correct}} = (0.30725)^{1/2.2} = (0.30725)^{0.4545} \approx 0.5862$$
In 8-bit units:
$$I_{\text{correct}} = \text{round}(0.5862 \times 255) = \text{round}(149.48) = 149$$

3. Naive un-linearized average:
$$\bar{s}_{\text{naive}} = \frac{0.1961 + 0.7843}{2} = \frac{0.9804}{2} = 0.4902$$
In 8-bit units:
$$I_{\text{naive}} = \text{round}(0.4902 \times 255) = \text{round}(125.00) = 125$$

4. Comparison:
$$I_{\text{correct}} - I_{\text{naive}} = 149 - 125 = +24 \text{ intensity levels}$$
Naive filtering produces an image that is **significantly darker than the real physical world**, creating artificial dark halos around blurred light sources.

---

### Worked Example 1.5: 2D Spatial Nyquist Frequency and Aliasing Limit
**Problem:** A mobile robot is equipped with a digital camera with square pixels of pitch $\Delta x = \Delta y = 3.5 \ \mu\text{m} = 3.5 \times 10^{-3} \text{ mm}$.
The camera lens has a focal length of $f = 6.0 \text{ mm}$.
1. Compute the sensor's spatial sampling frequency $f_s$ and Nyquist frequency $f_N$ in cycles per millimeter ($\text{lp/mm}$, line pairs per mm) on the sensor plane.
2. A patterned obstacle in the world has vertical stripes spaced at period $P_w = 2.0 \text{ mm}$ (frequency $1/2 \text{ mm}^{-1}$). The obstacle is located at distance $Z = 1.5 \text{ meters} = 1500 \text{ mm}$.
   Calculate the projected frequency $f_{\text{image}}$ of the pattern on the sensor plane.
3. Will this obstacle pattern cause spatial aliasing?

**Solution:**
1. Sensor spatial frequencies:
Sampling frequency:
$$f_s = \frac{1}{\Delta x} = \frac{1}{3.5 \times 10^{-3} \text{ mm}} \approx 285.71 \text{ cycles/mm}$$
Nyquist frequency limit:
$$f_N = \frac{f_s}{2} = \frac{285.71}{2} \approx 142.86 \text{ line pairs/mm (lp/mm)}$$

2. Pattern projection onto the sensor plane:
By geometric perspective scaling, an object of physical period $P_w$ at distance $Z$ projects to period $p_i$ on the sensor:
$$p_i = P_w \cdot \frac{f}{Z} = 2.0 \text{ mm} \times \frac{6.0 \text{ mm}}{1500 \text{ mm}} = 2.0 \times 0.004 = 0.008 \text{ mm} = 8.0 \ \mu\text{m}$$
Projected spatial frequency on sensor:
$$f_{\text{image}} = \frac{1}{p_i} = \frac{1}{0.008 \text{ mm}} = 125.0 \text{ lp/mm}$$

3. Aliasing check:
Comparing against the Nyquist limit:
$$f_{\text{image}} = 125.0 \text{ lp/mm} < f_N = 142.86 \text{ lp/mm}$$
Since $125 < 142.86$, the frequency is below the Nyquist limit. The pattern **will not alias** and can be resolved cleanly by the robot's perception system.
*(Note: If the robot moves back to $Z = 1.8 \text{ m}$, $p_i$ shrinks to $6.67 \ \mu\text{m} \implies f = 150 \text{ lp/mm} > f_N$, causing severe Moiré aliasing!)*

---

### Worked Example 1.6: RGB to HSV Conversion Geometry
**Problem:** An RGB pixel has normalized coordinates $R = 0.20, G = 0.80, B = 0.80$.
1. Compute the maximum value $C_{\max}$, minimum value $C_{\min}$, and chroma $\Delta = C_{\max} - C_{\min}$.
2. Compute the Value $V$.
3. Compute the Saturation $S$.
4. Compute the Hue angle $H$ in degrees.

**Solution:**
1. Extremes and chroma:
$$C_{\max} = \max(0.20, 0.80, 0.80) = 0.80$$
$$C_{\min} = \min(0.20, 0.80, 0.80) = 0.20$$
$$\text{Chroma } \Delta = C_{\max} - C_{\min} = 0.80 - 0.20 = 0.60$$

2. Value calculation:
$$V = C_{\max} = 0.80$$

3. Saturation calculation:
$$S = \frac{\Delta}{C_{\max}} = \frac{0.60}{0.80} = 0.75 \quad (75\%)$$

4. Hue angle calculation:
Since $C_{\max} = G = B = 0.80$, we use the green maximum formula (or blue):
When $C_{\max} = G$:
$$H = 60^\circ \times \left( \frac{B - R}{\Delta} + 2 \right) = 60^\circ \times \left( \frac{0.80 - 0.20}{0.60} + 2 \right) = 60^\circ \times (1 + 2) = 60^\circ \times 3 = 180^\circ$$
(Verifying with blue formula: $H = 60^\circ \times (\frac{R - G}{\Delta} + 4) = 60^\circ \times (\frac{0.20 - 0.80}{0.60} + 4) = 60^\circ \times (-1 + 4) = 180^\circ$).
Final HSV coordinates:
$$H = 180^\circ \text{ (pure Cyan)}, \quad S = 0.75, \quad V = 0.80$$

---

### Worked Example 1.7: CIELAB Color Difference ($\Delta E$) Calculation
**Problem:** A robotic quality-inspection system compares a manufactured car door paint against a reference standard.
The spectrophotometer returns CIELAB coordinates:
- Standard: $L_1^* = 50.0, a_1^* = 22.0, b_1^* = -15.0$.
- Sample: $L_2^* = 52.5, a_2^* = 19.5, b_2^* = -13.0$.
1. Compute the coordinate differences $\Delta L^*, \Delta a^*, \Delta b^*$.
2. Compute the total color difference $\Delta E_{ab}^* = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$.
3. If the manufacturing tolerance requires $\Delta E_{ab}^* \le 3.0$, does the part pass quality inspection?

**Solution:**
1. Coordinate differences:
$$\Delta L^* = 52.5 - 50.0 = +2.5$$
$$\Delta a^* = 19.5 - 22.0 = -2.5$$
$$\Delta b^* = -13.0 - (-15.0) = +2.0$$

2. Total color difference $\Delta E$:
$$\Delta E_{ab}^* = \sqrt{(2.5)^2 + (-2.5)^2 + (2.0)^2} = \sqrt{6.25 + 6.25 + 4.00} = \sqrt{16.50} \approx 4.062$$

3. Tolerance verification:
$$\Delta E_{ab}^* = 4.062 > 3.000$$
The part **fails** quality inspection. The color difference exceeds the tolerance threshold and will be noticeably mismatched to the human eye.

---

### Worked Example 1.8: Dynamic Range Calculation of a Sensor
**Problem:** A CMOS pixel has a full-well capacity (saturation limit) of $FWC = 25,000 \ e^-$.
The total dark noise floor in darkness is $\sigma_{\text{floor}} = 4.0 \ e^-$.
1. Compute the linear Dynamic Range (DR) ratio: $\text{DR}_{\text{linear}} = \frac{FWC}{\sigma_{\text{floor}}}$.
2. Compute the Dynamic Range in decibels: $\text{DR}_{\text{dB}} = 20 \log_{10}(\text{DR}_{\text{linear}})$.
3. Compute the minimum ADC bit depth $B$ required to quantize this dynamic range without quantizing the noise floor below 1 LSB.

**Solution:**
1. Linear Dynamic Range:
$$\text{DR}_{\text{linear}} = \frac{25,000}{4.0} = 6,250 : 1$$

2. Dynamic Range in decibels:
$$\text{DR}_{\text{dB}} = 20 \log_{10}(6,250) \approx 20 \times 3.79588 \approx 75.92 \text{ dB}$$

3. ADC Bit Depth:
To resolve 6,250 distinct levels:
$$2^B \ge 6,250 \implies B \ge \log_2(6,250) = \frac{\ln(6,250)}{\ln(2)} \approx \frac{8.7403}{0.69315} \approx 12.61 \text{ bits}$$
The camera requires at least a **14-bit ADC** ($2^{14} = 16,384$ levels) to capture the sensor's full physical dynamic range without quantization bottlenecks.

---

### Worked Example 1.9: Memory Footprint of Multi-Channel Visual Sensor Streams
**Problem:** An autonomous vehicle has 6 surround-view cameras capturing video at $1920 \times 1080$ resolution at 60 FPS in 24-bit RGB (3 bytes per pixel).
1. Compute the uncompressed data rate of a single camera in megabytes per second ($\text{MB/s}$).
2. Compute the total uncompressed throughput across all 6 cameras in gigabits per second ($\text{Gbps}$).
3. How many gigabytes of storage are consumed during a 2-hour driving test?

**Solution:**
1. Single camera throughput:
Bytes per frame:
$$\text{Frame Size} = 1920 \times 1080 \times 3 \text{ bytes} = 6,220,800 \text{ bytes} \approx 6.22 \text{ MB}$$
Data rate at 60 FPS:
$$\text{Rate} = 6,220,800 \times 60 = 373,248,000 \text{ bytes/s} \approx 373.25 \text{ MB/s}$$

2. Total vehicle throughput across 6 cameras:
$$\text{Total Data Rate} = 6 \times 373,248,000 = 2,239,488,000 \text{ bytes/s} \approx 2.239 \text{ GB/s}$$
In gigabits per second ($1 \text{ byte} = 8 \text{ bits}$):
$$\text{Bandwidth} = \frac{2,239,488,000 \times 8}{10^9} \approx 17.92 \text{ Gbps}$$

3. Storage for 2 hours ($7,200 \text{ seconds}$):
$$\text{Storage} = 2.239488 \text{ GB/s} \times 7,200 \text{ s} \approx 16,124 \text{ GB} \approx 16.12 \text{ Terabytes}$$
Uncompressed visual telemetry generates astronomical data volumes, necessitating on-chip H.264/H.265 compression or immediate deep feature extraction.

---

### Worked Example 1.10: Complete TypeScript Implementation of Image Matrix and Conversions
**Problem:** Author a robust, zero-dependency TypeScript class `ImageMatrix` supporting:
1. Contiguous flat array storage for arbitrary channels $C$, width $W$, and height $H$.
2. Safe pixel access with boundary clamping.
3. RGB to Grayscale conversion (BT.601).
4. Gamma linearization and sRGB re-encoding.

**Solution:**
```typescript
export class ImageMatrix {
  public readonly width: number;
  public readonly height: number;
  public readonly channels: number;
  public readonly data: Float32Array;

  constructor(width: number, height: number, channels: number = 1, initialData?: Float32Array | number[]) {
    this.width = width;
    this.height = height;
    this.channels = channels;
    this.data = new Float32Array(width * height * channels);
    if (initialData) {
      for (let i = 0; i < this.data.length && i < initialData.length; i++) {
        this.data[i] = initialData[i];
      }
    }
  }

  // Get index in flat array: (y * W + x) * C + c
  getIndex(x: number, y: number, c: number = 0): number {
    const clampedX = Math.max(0, Math.min(this.width - 1, x));
    const clampedY = Math.max(0, Math.min(this.height - 1, y));
    return (clampedY * this.width + clampedX) * this.channels + c;
  }

  getPixel(x: number, y: number, c: number = 0): number {
    return this.data[this.getIndex(x, y, c)];
  }

  setPixel(x: number, y: number, c: number, value: number): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height && c < this.channels) {
      this.data[(y * this.width + x) * this.channels + c] = value;
    }
  }

  // BT.601 RGB to Grayscale: Y = 0.299 R + 0.587 G + 0.114 B
  toGrayscale(): ImageMatrix {
    if (this.channels === 1) return this.clone();
    const gray = new ImageMatrix(this.width, this.height, 1);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const r = this.getPixel(x, y, 0);
        const g = this.getPixel(x, y, 1);
        const b = this.getPixel(x, y, 2);
        const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
        gray.setPixel(x, y, 0, yVal);
      }
    }
    return gray;
  }

  // Gamma linearization (gamma = 2.2)
  linearize(gamma: number = 2.2): ImageMatrix {
    const out = new ImageMatrix(this.width, this.height, this.channels);
    for (let i = 0; i < this.data.length; i++) {
      const norm = this.data[i] / 255.0;
      out.data[i] = Math.pow(norm, gamma) * 255.0;
    }
    return out;
  }

  clone(): ImageMatrix {
    return new ImageMatrix(this.width, this.height, this.channels, this.data);
  }
}
```

Verification Test:
```typescript
const img = new ImageMatrix(2, 2, 3);
img.setPixel(0, 0, 0, 180); img.setPixel(0, 0, 1, 90); img.setPixel(0, 0, 2, 220);
const gray = img.toGrayscale();
console.log("Grayscale pixel (0,0):", gray.getPixel(0, 0, 0).toFixed(2)); // 131.73 (Matches Worked Example 1.3!)
```

---

## 1.8 10 Deep Hands-On Exercises with Complete Solutions

### Exercise 1.1: Photon Flux and Exposure Time Scaling
**Problem:** A robotic camera captures an outdoor scene at noon with exposure $\Delta t_1 = 1.0 \text{ ms}$.
The robot then enters a dimly lit warehouse where ambient illuminance drops by factor $1000 \times$.
1. If the robot increases exposure time to $\Delta t_2 = 30.0 \text{ ms}$, by what factor does the collected photon count still lag behind the outdoor baseline?
2. What physical artifact appears if exposure time $\Delta t$ is increased beyond $50 \text{ ms}$ while the robot is moving at $2.0 \text{ m/s}$?

**Solution:**
1. Photon collection ratio:
Outdoor photon rate: $\Phi_{\text{out}}$.
Warehouse photon rate: $\Phi_{\text{in}} = \frac{\Phi_{\text{out}}}{1000}$.
Outdoor collected count: $N_1 = \Phi_{\text{out}} \times 1.0 \text{ ms} = 1.0 \Phi_{\text{out}}$.
Warehouse collected count: $N_2 = \left(\frac{\Phi_{\text{out}}}{1000}\right) \times 30.0 \text{ ms} = 0.030 \Phi_{\text{out}}$.
$$\text{Lag Factor} = \frac{N_1}{N_2} = \frac{1.0}{0.030} \approx 33.33 \times$$
Even with a $30\times$ longer exposure, the sensor collects $33.3$ times fewer photons.

2. Physical artifact:
At velocity $v = 2.0 \text{ m/s}$, during exposure $\Delta t = 0.050 \text{ s}$, the robot travels:
$$\Delta x = v \cdot \Delta t = 2.0 \text{ m/s} \times 0.050 \text{ s} = 0.10 \text{ m} = 10 \text{ cm}$$
A displacement of $10 \text{ cm}$ during a single frame causes severe **Motion Blur**, smearing high-frequency obstacle edges and blinding classical feature detectors.

---

### Exercise 1.2: Demosaicing Zippering Artifacts on High-Frequency Edges
**Problem:** Consider a 1D cross-section across a sharp black-to-white edge on a Bayer array where true illumination is 0 for $x \le 1$ and 200 for $x \ge 2$.
Filters are: $x=0 (G), x=1 (R), x=2 (G), x=3 (R)$.
Measured raw values: $G_0 = 0, R_1 = 0, G_2 = 200, R_3 = 200$.
1. Using linear interpolation, compute the reconstructed Red value at $x = 2$ and Green value at $x = 1$.
2. Compute the reconstructed $[R, G]$ color at $x = 1$ and $x = 2$.
3. What false color artifact is observed?

**Solution:**
1. Interpolations:
- At $x = 2$ (Green pixel): Red is interpolated from neighbors $R_1 = 0$ and $R_3 = 200$:
  $$R_2 = \frac{R_1 + R_3}{2} = \frac{0 + 200}{2} = 100$$
- At $x = 1$ (Red pixel): Green is interpolated from neighbors $G_0 = 0$ and $G_2 = 200$:
  $$G_1 = \frac{G_0 + G_2}{2} = \frac{0 + 200}{2} = 100$$

2. Reconstructed vectors:
- At $x = 1$: $R_1 = 0, G_1 = 100 \implies$ **Greenish artifact** (pure green tint on black side).
- At $x = 2$: $R_2 = 100, G_2 = 200 \implies$ **Yellow-green artifact** on white side.

3. Explanation:
The naive interpolation created false color fringes (color aliasing / zippering) along an edge that was physically purely achromatic (grayscale). This proves why edge-aware demosaicing is critical.

---

### Exercise 1.3: Proof of Grayscale Invariance Under Uniform Color Cast
**Problem:** Suppose an image is corrupted by uniform monochromatic yellow ambient light adding vector $\Delta \mathbf{C} = [k, k, 0]^\top$ to every RGB pixel.
1. Compute the change in perceived luminance $\Delta Y$ using BT.601 coefficients ($0.299, 0.587, 0.114$).
2. Compare this with a blue color cast $\Delta \mathbf{C} = [0, 0, k]^\top$.

**Solution:**
1. Yellow color cast ($R += k, G += k, B += 0$):
$$\Delta Y_{\text{yellow}} = 0.299(k) + 0.587(k) + 0.114(0) = (0.299 + 0.587)k = 0.886 k$$
Yellow ambient light increases perceived luminance by $88.6\%$ of $k$.

2. Blue color cast ($R += 0, G += 0, B += k$):
$$\Delta Y_{\text{blue}} = 0.299(0) + 0.587(0) + 0.114(k) = 0.114 k$$
Blue ambient light increases perceived luminance by only $11.4\%$ of $k$.
Yellow light affects grayscale edge detection nearly **8 times more strongly** than blue light.

---

### Exercise 1.4: Moiré Interference Wavelength Derivation
**Problem:** In 1D, let continuous image $f(x) = \cos(2\pi f_0 x)$ have spatial frequency $f_0 = 80 \text{ cycles/mm}$.
The sensor samples at frequency $f_s = 100 \text{ samples/mm}$ (Nyquist limit $f_N = 50 \text{ cycles/mm}$).
1. Show that $f_0 > f_N$ violates the sampling theorem.
2. Determine the apparent aliased frequency $f_{\text{alias}} = |f_0 - f_s|$.
3. What is the spatial period of the resulting Moiré wave?

**Solution:**
1. Violation:
$$f_N = \frac{f_s}{2} = \frac{100}{2} = 50 \text{ cycles/mm} < f_0 = 80 \text{ cycles/mm}$$
The frequency exceeds the Nyquist limit by 30 cycles/mm.

2. Aliased frequency:
Under impulse sampling, the spectrum replicates at $f_s$:
The replica centered at $-f_s$ contributes frequency components at $f_0 - f_s$:
$$f_{\text{alias}} = |80 - 100| = |-20| = 20 \text{ cycles/mm}$$

3. Moiré wave period:
$$\lambda_{\text{moiré}} = \frac{1}{f_{\text{alias}}} = \frac{1}{20 \text{ cycles/mm}} = 0.050 \text{ mm} = 50 \ \mu\text{m}$$
The camera visualizes a non-existent, wide wavy stripe of period $50 \ \mu\text{m}$ across the image.

---

### Exercise 1.5: Quantization Noise Power Derivation
**Problem:** An ADC quantizes analog voltages into step size $q = \frac{V_{\max} - V_{\min}}{2^B}$.
Assuming quantization error $e$ is uniformly distributed over $[-\frac{q}{2}, \frac{q}{2}]$:
1. Prove that the mean error is $\mathbb{E}[e] = 0$.
2. Prove that the quantization noise variance is $\sigma_q^2 = \frac{q^2}{12}$.
3. Show that adding 1 bit to the ADC improves the Signal-to-Quantization-Noise Ratio (SQNR) by approximately $6.02 \text{ dB}$.

**Solution:**
1. Mean:
$$\mathbb{E}[e] = \int_{-q/2}^{q/2} e \cdot \frac{1}{q} de = \frac{1}{q} \left[ \frac{e^2}{2} \right]_{-q/2}^{q/2} = \frac{1}{2q} \left( \frac{q^2}{4} - \frac{q^2}{4} \right) = 0 \quad \blacksquare$$

2. Variance:
$$\sigma_q^2 = \mathbb{E}[e^2] - (\mathbb{E}[e])^2 = \int_{-q/2}^{q/2} e^2 \cdot \frac{1}{q} de = \frac{1}{q} \left[ \frac{e^3}{3} \right]_{-q/2}^{q/2} = \frac{1}{3q} \left( \frac{q^3}{8} - \left(-\frac{q^3}{8}\right) \right) = \frac{1}{3q} \left( \frac{2q^3}{8} \right) = \frac{q^2}{12} \quad \blacksquare$$

3. SQNR scaling per bit:
$$\text{SQNR} \propto \frac{V_{\text{signal}}^2}{\sigma_q^2} = \frac{V_{\text{signal}}^2}{q^2 / 12} \propto \frac{1}{q^2}$$
Since $q \propto 2^{-B}$, $q^2 \propto 2^{-2B} \implies \text{SQNR} \propto 2^{2B}$.
Taking decibels:
$$\text{SQNR}_{\text{dB}} = 10 \log_{10}(2^{2B}) = 20 B \log_{10}(2) \approx 20 B (0.30103) \approx 6.02 \cdot B \text{ dB}$$
Each additional bit reduces quantization noise power by a factor of 4, providing an exact **$6.02 \text{ dB}$ improvement**.

---

### Exercise 1.6: HSV Thresholding Mask for Object Color Segmentation
**Problem:** An autonomous robot seeks to detect bright orange traffic cones.
In HSV space, the cone color corresponds to:
$H \in [10^\circ, 25^\circ], S \in [0.60, 1.00], V \in [0.50, 1.00]$.
A candidate pixel has normalized RGB: $R = 0.90, G = 0.45, B = 0.10$.
1. Compute the HSV coordinates of this pixel.
2. Determine if the pixel lies inside the orange cone detection mask.

**Solution:**
1. HSV conversion:
$C_{\max} = 0.90$ (Red), $C_{\min} = 0.10$, $\Delta = 0.90 - 0.10 = 0.80$.
- Value: $V = C_{\max} = 0.90$.
- Saturation: $S = \frac{\Delta}{C_{\max}} = \frac{0.80}{0.90} \approx 0.8889$.
- Hue: Since $C_{\max} = R$:
  $$H = 60^\circ \times \left( \frac{G - B}{\Delta} \pmod 6 \right) = 60^\circ \times \left( \frac{0.45 - 0.10}{0.80} \right) = 60^\circ \times \left( \frac{0.35}{0.80} \right) = 60^\circ \times 0.4375 = 26.25^\circ$$

2. Threshold check:
- $H = 26.25^\circ$: Just outside the window $[10^\circ, 25^\circ]$!
- $S = 0.89 \in [0.60, 1.00]$ (Pass).
- $V = 0.90 \in [0.50, 1.00]$ (Pass).
Because $H = 26.25^\circ > 25^\circ$ (slightly too yellow-orange), the pixel is **rejected** by the cone mask.

---

### Exercise 1.7: Fill Factor and Sensitivity in Back-Illuminated Sensors
**Problem:** In traditional Front-Illuminated (FSI) CMOS sensors, metal wiring sits on top of the silicon, reducing the active photodiode area to **Fill Factor** $\text{FF} = 40\%$.
In Back-Illuminated (BSI) CMOS sensors, the silicon wafer is flipped upside down, achieving $\text{FF} = 95\%$.
If a front-illuminated sensor collects $4,000$ electrons under a given light source:
1. How many electrons does an identical-sized BSI sensor collect under the same light?
2. By what factor does the BSI sensor improve SNR in the shot-noise limit?

**Solution:**
1. Photoelectron count:
$$N_{\text{BSI}} = N_{\text{FSI}} \times \frac{\text{FF}_{\text{BSI}}}{\text{FF}_{\text{FSI}}} = 4,000 \times \frac{0.95}{0.40} = 4,000 \times 2.375 = 9,500 \text{ electrons}$$

2. SNR improvement:
In the shot-noise limit ($\text{SNR} = \sqrt{N}$):
$$\frac{\text{SNR}_{\text{BSI}}}{\text{SNR}_{\text{FSI}}} = \frac{\sqrt{9,500}}{\sqrt{4,000}} = \sqrt{2.375} \approx 1.541$$
BSI technology yields a **$54.1\%$ increase in SNR** ($+3.75 \text{ dB}$), allowing night-vision autonomous drones to perceive obstacles in deep twilight.

---

### Exercise 1.8: Chromatic Aberration in Uncalibrated Lenses
**Problem:** Due to optical dispersion, glass has refractive index $n_{\text{blue}} = 1.528$ for blue light ($\lambda = 450 \text{ nm}$) and $n_{\text{red}} = 1.514$ for red light ($\lambda = 650 \text{ nm}$).
A simple convex lens has focal length $f = \frac{1}{(n - 1)(\frac{1}{R_1} - \frac{1}{R_2})}$.
Let the lens geometry yield $f_{\text{red}} = 50.0 \text{ mm}$.
1. Compute the blue focal length $f_{\text{blue}}$.
2. If the sensor is placed exactly at the red focal plane ($Z = 50.0 \text{ mm}$), explain why blue light forms a blurry circle of confusion around sharp red edges (Longitudinal Chromatic Aberration).

**Solution:**
1. Blue focal length:
$$\frac{f_{\text{blue}}}{f_{\text{red}}} = \frac{n_{\text{red}} - 1}{n_{\text{blue}} - 1} = \frac{1.514 - 1}{1.528 - 1} = \frac{0.514}{0.528} \approx 0.97348$$
$$f_{\text{blue}} = 50.0 \text{ mm} \times 0.97348 \approx 48.67 \text{ mm}$$

2. Circle of confusion:
Blue light comes to a sharp focus at $48.67 \text{ mm}$, and then diverges over the remaining $1.33 \text{ mm}$ before striking the sensor at $50.0 \text{ mm}$.
The blue rays hit the sensor as a spread-out disk rather than a point, producing colored purple/blue fringes along high-contrast object boundaries.

---

### Exercise 1.9: HDR Multi-Exposure Fusion Weighting
**Problem:** High Dynamic Range (HDR) fusion combines a short exposure image $I_{\text{short}}$ and long exposure image $I_{\text{long}}$ to prevent clipping.
Mertens et al. define exposure weight using a Gaussian centered at mid-gray ($0.5$):
$$w(I) = \exp\left( -\frac{(I - 0.5)^2}{2 \sigma^2} \right) \quad \text{with } \sigma = 0.20$$
For pixel values $I_A = 0.05$ (near black) and $I_B = 0.52$ (well-exposed):
1. Compute weights $w(I_A)$ and $w(I_B)$.
2. Why does this weighting function automatically discard noisy shadows and saturated highlights?

**Solution:**
1. Weights:
- For $I_A = 0.05$:
  $$w(I_A) = \exp\left( -\frac{(0.05 - 0.50)^2}{2(0.20)^2} \right) = \exp\left( -\frac{(-0.45)^2}{0.08} \right) = \exp\left(-\frac{0.2025}{0.08}\right) = \exp(-2.531) \approx 0.0796$$
- For $I_B = 0.52$:
  $$w(I_B) = \exp\left( -\frac{(0.52 - 0.50)^2}{2(0.20)^2} \right) = \exp\left( -\frac{0.0004}{0.08} \right) = \exp(-0.005) \approx 0.9950$$

2. Principle:
Pixels near $0$ (underexposed shadows) or near $1$ (saturated highlights) have weights near zero, while well-exposed mid-tones receive weights near $1.0$. When blending multi-exposure stacks, the algorithm automatically extracts the cleanest signal from each exposure.

---

### Exercise 1.10: Complete TypeScript Implementation of Bilinear Demosaicing
**Problem:** Author a TypeScript function `demosaicBayerRGGB` that accepts a raw 2D grayscale image holding an RGGB Bayer mosaic, reconstructs the full 3-channel RGB image using bilinear interpolation, and handles boundary padding safely.

**Solution:**
```typescript
import { ImageMatrix } from './image-matrix'; // Assuming ImageMatrix from Worked Example 1.10

export function demosaicBayerRGGB(rawBayer: ImageMatrix): ImageMatrix {
  const W = rawBayer.width;
  const H = rawBayer.height;
  const rgb = new ImageMatrix(W, H, 3);

  // Helper to read raw pixel with clamp padding
  const getRaw = (x: number, y: number) => rawBayer.getPixel(x, y, 0);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const isEvenRow = y % 2 === 0;
      const isEvenCol = x % 2 === 0;

      let r = 0, g = 0, b = 0;

      if (isEvenRow && isEvenCol) {
        // Red pixel (R)
        r = getRaw(x, y);
        g = (getRaw(x - 1, y) + getRaw(x + 1, y) + getRaw(x, y - 1) + getRaw(x, y + 1)) / 4.0;
        b = (getRaw(x - 1, y - 1) + getRaw(x + 1, y - 1) + getRaw(x - 1, y + 1) + getRaw(x + 1, y + 1)) / 4.0;
      } else if (isEvenRow && !isEvenCol) {
        // Green pixel on Red row (Gr)
        r = (getRaw(x - 1, y) + getRaw(x + 1, y)) / 2.0;
        g = getRaw(x, y);
        b = (getRaw(x, y - 1) + getRaw(x, y + 1)) / 2.0;
      } else if (!isEvenRow && isEvenCol) {
        // Green pixel on Blue row (Gb)
        r = (getRaw(x, y - 1) + getRaw(x, y + 1)) / 2.0;
        g = getRaw(x, y);
        b = (getRaw(x - 1, y) + getRaw(x + 1, y)) / 2.0;
      } else {
        // Blue pixel (B)
        r = (getRaw(x - 1, y - 1) + getRaw(x + 1, y - 1) + getRaw(x - 1, y + 1) + getRaw(x + 1, y + 1)) / 4.0;
        g = (getRaw(x - 1, y) + getRaw(x + 1, y) + getRaw(x, y - 1) + getRaw(x, y + 1)) / 4.0;
        b = getRaw(x, y);
      }

      rgb.setPixel(x, y, 0, r);
      rgb.setPixel(x, y, 1, g);
      rgb.setPixel(x, y, 2, b);
    }
  }

  return rgb;
}
```
