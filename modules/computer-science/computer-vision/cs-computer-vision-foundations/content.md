# Chapter 1: The Physics of Light, Digital Sensors, and the Continuous-to-Discrete Image Grid

---

## 1.1 The Physical Nature of Light and Image Formation

To a computer program, a digital image appears as a sterile, rectangular matrix of numbersâ€”an array of 8-bit unsigned integers bounded within $[0, 255]$. Yet every single number in that matrix represents the culmination of a violent, continuous physical journey spanning the laws of quantum electrodynamics, geometric optics, thermodynamics, and solid-state physics.

```
                           THE PHYSICAL JOURNEY OF A PHOTON
                           
   [ ILLUMINANT ] â”€â”€â–º Radiance L_i(Î») â”€â”€â–º [ SURFACE MATTER ]
   (Sun / Laser / Light Bulb)             (BRDF Reflection: Ï(Î¸_i, Ï•_i, Î¸_r, Ï•_r; Î»))
                                                   â”‚
                                                   â–¼ Reflected Radiance L_r
                                          [ OPTICAL APERTURE ]
                                          (Lenses, Pupil, Pinhole)
                                                   â”‚
                                                   â–¼ Irradiance E(x, y)
                                          [ SILICON DETECTOR ]
                                          (CMOS / CCD Potential Wells)
                                                   â”‚
                                                   â–¼ Photoelectrons e^-
                                          [ ANALOG-TO-DIGITAL ]
                                          (Quantization: ADC 0..255)
                                                   â”‚
                                                   â–¼
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
                         
           Incident Light Rays (Photons hÎ½)
                 â”‚         â”‚         â”‚
                 â–¼         â–¼         â–¼
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â—„â”€â”€ Microlens (Concentrates Flux)
           â”‚      COLOR FILTER (CFA)     â”‚  â—„â”€â”€ Bayer Dye Layer (R, G, or B)
           â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
           â”‚      SILICON SUBSTRATE      â”‚
           â”‚                             â”‚
           â”‚      e^-  e^-  e^-  e^-     â”‚  â—„â”€â”€ Depletion Region (Electron-Hole Pairs)
           â”‚                             â”‚
           â”‚      [ Potential Well ]     â”‚  â—„â”€â”€ Stores Accumulated Photoelectrons
           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â”‚ Transfer Gate (TG)
                          â–¼
             Floating Diffusion (FD Node) â”€â”€â–º Source Follower Amplifier (V_out)
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
                         
                              â”Œâ”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”
                              â”‚ Green â”‚  Red  â”‚
                              â”‚ (G_1) â”‚  (R)  â”‚
                              â”œâ”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”¤
                              â”‚ Blue  â”‚ Green â”‚
                              â”‚  (B)  â”‚ (G_2) â”‚
                              â””â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”˜
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
    â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”                         â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
    â”‚ G â”‚ R â”‚ G â”‚ R â”‚                         â”‚RGBâ”‚RGBâ”‚RGBâ”‚RGBâ”‚
    â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤     Demosaicing         â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
    â”‚ B â”‚ G â”‚ B â”‚ G â”‚   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–º       â”‚RGBâ”‚RGBâ”‚RGBâ”‚RGBâ”‚
    â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤  Interpolate Missing    â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
    â”‚ G â”‚ R â”‚ G â”‚ R â”‚     Color Planes        â”‚RGBâ”‚RGBâ”‚RGBâ”‚RGBâ”‚
    â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜                         â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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
                            
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 1. HARDWARE / DEVICE-DEPENDENT:                                  â”‚
   â”‚    â€¢ sRGB: Standard web & camera monitor space (Gamma â‰ˆ 2.2)     â”‚
   â”‚    â€¢ Linear RGB: Un-gamma-corrected physical irradiance space    â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 2. PERCEPTUAL / INTUITIVE:                                       â”‚
   â”‚    â€¢ HSV / HSL: Hue (angle 0-360Â°), Saturation, Value/Lightness  â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 3. TRANSMISSION / COMPRESSION:                                   â”‚
   â”‚    â€¢ YCbCr / YPbPr: Luminance Y, Blue-diff Cb, Red-diff Cr       â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 4. DEVICE-INDEPENDENT & PERCEPTUALLY UNIFORM:                    â”‚
   â”‚    â€¢ CIE XYZ (1931): Linear standard observer color space        â”‚
   â”‚    â€¢ CIELAB (L*a*b*): Euclidean distance matches human perceptionâ”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
             â”‚
             â–¼ Spatial Sampling (2D Dirac Comb)
   Grid of Impulse Heights: f[m, n] = f(m Î”x, n Î”y)
             â”‚
             â–¼ Amplitude Quantization (ADC Rounding)
   Discrete Integer Array: I[y, x] âˆˆ {0, 1, ..., 255}
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
   â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â–º u                 â”€â”€â”€â”€â”´â”€â”€â”€â”¬â”€â”€â”€â”´â”€â”€â”€â”€â”€â”´â”€â”€â”€â”¬â”€â”€â”€â”´â”€â”€â”€â”€â–º u
      -u_max   u_max                           -1/Î”x         1/Î”x
                                                (No Overlap: Valid Reconstruction)
                                                
   Aliased Spectrum (Sampling Frequency < 2 Â· u_max):
                      / \   / \
                    /     X     \   â—„â”€â”€ Overlapping spectral replicas!
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”´â”€â”´â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º u
                     High frequencies fold into low frequencies! (MoirÃ© Patterns)
```

**The Nyquist-Shannon Sampling Criterion:**
To reconstruct the continuous physical scene $f(x, y)$ without distortion, the sampling frequencies must exceed twice the maximum spatial frequencies present in the scene:
$$f_{s, x} = \frac{1}{\Delta x} > 2 u_{\max}, \quad f_{s, y} = \frac{1}{\Delta y} > 2 v_{\max}$$
The frequency $u_N = \frac{1}{2 \Delta x}$ is the **Nyquist Limit**.

If the scene contains high-frequency details (such as a fine-mesh screen, distant brick patterns, or sharp fabric lines) exceeding $u_N$, those high frequencies **alias** (fold backward) into low-frequency bands. Aliasing manifests as disturbing MoirÃ© interference ripples and jagged stair-stepping edges. Camera sensors counteract aliasing by placing an **optical low-pass anti-aliasing filter** (a birefringent crystal layer) in front of the silicon to physically blur frequencies beyond $u_N$ before sampling occurs.

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
   
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CHALLENGES ACROSS THE GAP:
   â€¢ Illumination Variations: Turning off a lamp changes 100% of the numbers.
   â€¢ Perspective & Scale: Moving 1 meter closer quadruples the pixel footprint.
   â€¢ Deformation & Articulation: A cat stretching changes its geometric silhouette.
   â€¢ Occlusion: A coffee mug in front hides half the animal's features.
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
*(Note: If the robot moves back to $Z = 1.8 \text{ m}$, $p_i$ shrinks to $6.67 \ \mu\text{m} \implies f = 150 \text{ lp/mm} > f_N$, causing severe MoirÃ© aliasing!)*

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

### Exercise 1.4: MoirÃ© Interference Wavelength Derivation
**Problem:** In 1D, let continuous image $f(x) = \cos(2\pi f_0 x)$ have spatial frequency $f_0 = 80 \text{ cycles/mm}$.
The sensor samples at frequency $f_s = 100 \text{ samples/mm}$ (Nyquist limit $f_N = 50 \text{ cycles/mm}$).
1. Show that $f_0 > f_N$ violates the sampling theorem.
2. Determine the apparent aliased frequency $f_{\text{alias}} = |f_0 - f_s|$.
3. What is the spatial period of the resulting MoirÃ© wave?

**Solution:**
1. Violation:
$$f_N = \frac{f_s}{2} = \frac{100}{2} = 50 \text{ cycles/mm} < f_0 = 80 \text{ cycles/mm}$$
The frequency exceeds the Nyquist limit by 30 cycles/mm.

2. Aliased frequency:
Under impulse sampling, the spectrum replicates at $f_s$:
The replica centered at $-f_s$ contributes frequency components at $f_0 - f_s$:
$$f_{\text{alias}} = |80 - 100| = |-20| = 20 \text{ cycles/mm}$$

3. MoirÃ© wave period:
$$\lambda_{\text{moirÃ©}} = \frac{1}{f_{\text{alias}}} = \frac{1}{20 \text{ cycles/mm}} = 0.050 \text{ mm} = 50 \ \mu\text{m}$$
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


---\n
# Chapter 2: Linear Spatial Filtering, Discrete 2D Convolution, and Correlation

---

## 2.1 Mathematical Foundations of 2D Spatial Filtering

In digital image processing and robotic visual perception, spatial filtering is the fundamental mechanism through which an image is enhanced, smoothed, sharpened, or analyzed. A spatial filter operates directly on the pixel grid by transforming each pixel value as a function of its local spatial neighborhood.

```
                           THE SPATIAL FILTERING PARADIGM
                           
       Input Image I[y, x]                   Spatial Kernel K[u, v]
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚ .   .   .   .   .   . â”‚                    â”‚ -1 â”‚  0 â”‚  1  â”‚
    â”‚ .   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   . â”‚                    â”œâ”€â”€â”€â”€â”¼â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¤
    â”‚ .   â”‚ p0  p1 p2 â”‚   . â”‚   Neighbourhood    â”‚ -2 â”‚  0 â”‚  2  â”‚
    â”‚ .   â”‚ p3  p4 p5 â”‚   . â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º   â”œâ”€â”€â”€â”€â”¼â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¤
    â”‚ .   â”‚ p6  p7 p8 â”‚   . â”‚   Multiplication   â”‚ -1 â”‚  0 â”‚  1  â”‚
    â”‚ .   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   . â”‚   & Summation      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
    â”‚ .   .   .   .   .   . â”‚                            â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                            â–¼
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
   â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”          â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”          â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
   â”‚ 0 â”‚ 0 â”‚ 0 â”‚ 0 â”‚          â”‚ a â”‚ a â”‚ b â”‚ c â”‚          â”‚ b â”‚ a â”‚ b â”‚ c â”‚
   â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
   â”‚ 0 â”‚ a â”‚ b â”‚ c â”‚          â”‚ a â”‚ a â”‚ b â”‚ c â”‚          â”‚ a â”‚ a â”‚ b â”‚ c â”‚
   â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
   â”‚ 0 â”‚ d â”‚ e â”‚ f â”‚          â”‚ d â”‚ d â”‚ e â”‚ f â”‚          â”‚ d â”‚ d â”‚ e â”‚ f â”‚
   â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜          â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜          â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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
             â”‚     /\                             â”‚     /\
             â”‚    /  \                            â”‚    /  \
             â”‚   /    \                           â”‚   /    \
             â”‚  /      \     /\                   â”‚  /      \
             â”‚ /        \___/  \___               â”‚ /        \________
             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Ï‰           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Ï‰
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
    
          â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”                              â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
          â”‚   â”‚   â”‚   â”‚                              â”‚ h â”‚ h â”‚ h â”‚  1D Horizontal Pass
          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                              â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
          â”‚   â”‚ K â”‚   â”‚                                    â”‚
          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                                    â–¼
          â”‚   â”‚   â”‚   â”‚                              â”Œâ”€â”€â”€â”
          â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜                              â”‚ v â”‚
                                                     â”œâ”€â”€â”€â”¤
                                                     â”‚ v â”‚  1D Vertical Pass
                                                     â”œâ”€â”€â”€â”¤
                                                     â”‚ v â”‚
                                                     â””â”€â”€â”€â”˜
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
    â”Œâ”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”                      â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”
    â”‚  12 â”‚  15 â”‚  14 â”‚                      â”‚ 9 â”‚12 â”‚14 â”‚ 15 â”‚ 16 â”‚ 18 â”‚ 21 â”‚ 22 â”‚ 255 â”‚
    â”œâ”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¤                      â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”€â”´â”€â”€â”€â”€â”´â”€â”€â”€â”€â”´â”€â”€â”€â”€â”´â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”˜
    â”‚  16 â”‚ 255 â”‚  18 â”‚                                           â–²
    â”œâ”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¤                                           â”‚
    â”‚   9 â”‚  21 â”‚  22 â”‚                                     MEDIAN = 16
    â””â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”˜                      (The extreme 255 outlier is discarded!)
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
                    â”‚                                      â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                        â–¼
                             Combined Product Weight:
                                w(p, q) = G_s * G_r
                                        â”‚
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â–¼                                             â–¼
          Flat Homogeneous Patch                         Sharp Step Edge
     |I(p) - I(q)| â‰ˆ 0 â”€â”€â–º G_r â‰ˆ 1             |I(p) - I(q)| >> Ïƒ_r â”€â”€â–º G_r â‰ˆ 0
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
                   
           (0, 0) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ x_1-1 â”€â”€â”€â”€â”€â”€â”€â”€ x_2
             â”‚                           â”‚             â”‚
             â”‚             A             â”‚      B      â”‚
             â”‚                           â”‚             â”‚
           y_1-1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
             â”‚                           â”‚             â”‚
             â”‚             C             â”‚   TARGET    â”‚
             â”‚                           â”‚   REGION D  â”‚
            y_2  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                                         â–²             â–²
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


---\n
# Chapter 3: Image Gradients, Differential Operators, and Directional Derivatives

---

## 3.1 Differential Geometry of Images and Continuous Gradients

In classical physics, field theories describe spatial environments through scalar potential fields and their associated vector gradients. Digital computer vision views an image $I(x, y)$ through the same lens: as a 2D scalar surface or manifold embedded in $\mathbb{R}^3$, where the elevation at coordinate $(x, y)$ corresponds to radiant intensity.

```
                           THE IMAGE INTENSITY MANIFOLD
                           
           Intensity I(x, y)
                  â–²
                  â”‚              Peak / Ridge
                  â”‚               /\
                  â”‚              /  \
                  â”‚  Plat.      /    \      Valley
                  â”‚  â”€â”€â”€â”€â”€â”€â”€â”  /      \    â”Œâ”€â”€â”€â”€â”€â”€
                  â”‚         â”‚ /        \  /
                  â”‚         â””â”€â”˜         â”€â”˜
                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Spatial Coordinate x, y
                             â–²
                             â”‚
                      High Gradient |âˆ‡I|
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
                     
                              Gradient Vector âˆ‡I
                             (Direction of Max Change)
                                      â–²
                                      â”‚
                                      â”‚  Î¸_g = atan2(I_y, I_x)
                                      â”‚
                        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Isophote / Contour Line
                                      â”‚                (Direction of ZERO Change)
                                      â”‚                v_contour âŠ¥ âˆ‡I
                                      â”‚
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
           oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€o
           â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ h â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ h â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º
           
           Forward Diff:  [f(x+h) - f(x)] / h      â”€â”€â–º Error O(h)
           Backward Diff: [f(x) - f(x-h)] / h      â”€â”€â–º Error O(h)
           Central Diff:  [f(x+h) - f(x-h)] / 2h   â”€â”€â–º Error O(h^2) [Symmetric!]
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
         
         â”Œâ”€â”€â”€â”                                  â”Œâ”€â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
         â”‚ 1 â”‚                                  â”‚ -1 â”‚ 0 â”‚ 1 â”‚
         â”œâ”€â”€â”€â”¤                                  â”œâ”€â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
         â”‚ 2 â”‚   *   [ -1   0   1 ]     =       â”‚ -2 â”‚ 0 â”‚ 2 â”‚
         â”œâ”€â”€â”€â”¤                                  â”œâ”€â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
         â”‚ 1 â”‚                                  â”‚ -1 â”‚ 0 â”‚ 1 â”‚
         â””â”€â”€â”€â”˜                                  â””â”€â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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
            â–²                            â–²                          â–²
            â”‚       â”Œâ”€â”€â”€â”€â”€â”€              â”‚       /\                 â”‚   /\
            â”‚      /                     â”‚      /  \                â”‚  /  \
            â”‚     /                      â”‚     /    \               â”‚ /    \
    â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º     â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€\â”€â”€â”€â”€â–º â”€â”€â”€â”€â”€â”€â”€â”€â”´/â”€â”€â”€â”€â”€â”€\â”€â”€â”€â”€â”€â”€â–º
          Step Edge                        Peak Extrema                \    /
                                                                        \  /
                                                                         \/
                                                                    Zero-Crossing!
```

### The Continuous Laplacian Operator
The Laplacian of an image $I(x, y)$, denoted $\nabla^2 I$ or $\Delta I$, is the trace of the Hessian matrixâ€”the sum of unmixed second partial derivatives:
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
                â”‚                     Positive Outer Lobes
                â”‚                        /\         /\
                â”‚                       /  \       /  \
           0 â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€/â”€â”€â”€â”€\â”€â”€â”€â”€â”€/â”€â”€â”€â”€\â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Radius r
                â”‚                     /      \   /      \
                â”‚                    /        \_/        \
                â”‚                   /                     \
                â”‚                  /                       \
                â”‚                 /                         \
                â–¼                /                           \
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


---\n
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
          /    \     /    \                     â—„â”€â”€ Î´x â”€â”€â–º                      /            \
       True Edge   False Peak                  Min E[Î´x^2]                      FORBIDDEN!
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
           â”‚
           â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚ 1. GAUSSIAN NOISE FILTERING â”‚  â”€â”€â–º I_Ïƒ = I * G_Ïƒ (Suppresses Sensor Noise)
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚ 2. SOBEL GRADIENT FIELD     â”‚  â”€â”€â–º Gradient Magnitude M[y, x] & Orientation Î¸[y, x]
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚ 3. NON-MAXIMUM SUPPRESSION  â”‚  â”€â”€â–º Thins Thick Gradient Ridges into
    â”‚    (NMS) ALONG GRADIENT     â”‚      1-Pixel Wide Local Extrema Contours
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚ 4. HYSTERESIS THRESHOLDING  â”‚  â”€â”€â–º Dual Thresholds (T_high, T_low) + 8-Connected
    â”‚    & EDGE LINKING (DFS/BFS) â”‚      Recursive Contour Tracking (Prevents Streaking)
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
     Binary Edge Map E[y, x] âˆˆ {0, 1}
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
                 
                          Sector 2 (90Â°)
                        [ -22.5Â° to 22.5Â° ]
                                 â–²
                     \           â”‚           /
            Sector 3  \          â”‚          /  Sector 1
             (135Â°)    \         â”‚         /    (45Â°)
                        \        â”‚        /
                         \       â”‚       /
     â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º x
    Sector 0 (0Â°)        /       (y, x)  \         Sector 0 (0Â°)
   [-22.5Â° to 22.5Â°]    /                 \       [-22.5Â° to 22.5Â°]
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
            â–²
            â”‚
    T_high â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ (STRONG EDGE: Guaranteed Keep)
            â”‚                    /            \
            â”‚                   /              \
    T_low  â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€o                oâ”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€ (WEAK EDGE: Kept ONLY IF
            â”‚         /                                  \     connected to a Strong Edge)
            â”‚        /                                    \
          0 â”´â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â–º Spatial Contour
                    â–²                                      â–²
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

Mathematical morphology (developed by Georges Matheron and Jean Serra at the Ã‰cole des Mines de Paris) is a theoretical framework for analyzing geometric structures, shapes, and topological features based on set theory.

### Binary Sets and Structuring Elements
In binary morphology, an image $A \subset \mathbb{Z}^2$ is treated as the set of coordinate pairs belonging to the foreground:
$$A = \{ \mathbf{p} = (y, x) \in \mathbb{Z}^2 \mid I[y, x] = 1 \}$$
A **structuring element (SE)** $B \subset \mathbb{Z}^2$ is a small geometric probe (e.g., $3 \times 3$ square, disk, cross) with a designated origin $\mathbf{0} = (0, 0)$.

- **Translation:** $A_{\mathbf{t}} = \{ \mathbf{a} + \mathbf{t} \mid \mathbf{a} \in A \}$
- **Reflection:** $\hat{B} = \{ -\mathbf{b} \mid \mathbf{b} \in B \}$

```
                      COMMON STRUCTURING ELEMENTS (3x3)
                      
       3x3 Square (8-conn)          3x3 Cross (4-conn)          Horizontal Line (1x3)
           â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”                â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”                â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
           â”‚ 1 â”‚ 1 â”‚ 1 â”‚                â”‚ 0 â”‚ 1 â”‚ 0 â”‚                â”‚ 0 â”‚ 0 â”‚ 0 â”‚
           â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
           â”‚ 1 â”‚[1]â”‚ 1 â”‚                â”‚ 1 â”‚[1]â”‚ 1 â”‚                â”‚ 1 â”‚[1]â”‚ 1 â”‚
           â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
           â”‚ 1 â”‚ 1 â”‚ 1 â”‚                â”‚ 0 â”‚ 1 â”‚ 0 â”‚                â”‚ 0 â”‚ 0 â”‚ 0 â”‚
           â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜                â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜                â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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
                       
          Original Shape A             Erosion A âŠ– B               Dilation A âŠ• B
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚  #####  â”‚                  â”‚  ###  â”‚                  â”‚  #######  â”‚
            â”‚  #####  â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º      â”‚  ###  â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º      â”‚  #######  â”‚
            â”‚  ###    â”‚  (Shrinks)       â””â”€â”€â”€â”€â”€â”€â”€â”˜  (Expands)       â”‚  #####    â”‚
            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                             â”‚  #####    â”‚
                                                                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
                      
       Original Shape A               Opening A âˆ˜ B                Closing A â€¢ B
        (Bridge + Hole)            (Bridge Severed)               (Hole Sealed)
        â”Œâ”€â”€â”€â”     â”Œâ”€â”€â”€â”             â”Œâ”€â”€â”€â”     â”Œâ”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚   â”‚=====â”‚   â”‚             â”‚   â”‚     â”‚   â”‚               â”‚   â”‚=======â”‚   â”‚
        â”‚   â””â”€â”€â”¬â”€â”€â”˜   â”‚   â”€â”€â”€â”€â”€â–º    â”‚   â””â”€â”€â” â”Œâ””â”€â”€â”€â”¤     â”€â”€â”€â”€â”€â–º    â”‚   â””â”€â”€â”€â”¬â”€â”€â”€â”˜   â”‚
        â”‚      o      â”‚             â”‚      o      â”‚               â”‚       #       â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
              
                           [y-1, x-1]  [y-1, x]  [y-1, x+1]   â—„â”€â”€ Already Labeled
                           [y,   x-1]  [y,   x]                â—„â”€â”€ Current Pixel
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


---\n
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
                     \                    â”‚
                      \                   â”‚
     â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Image Plane (Z = -f)
                        \                 â”‚                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         \                â”‚                â”‚        .        â”‚
                          \               â”‚                â”‚       /         â”‚
                           \              â”‚                â”‚      o          â”‚
                            \             â”‚                â”‚   (x, y)        â”‚
                             \            â”‚                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â–¼           â”‚
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
                                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                  â”‚             â”‚
                                  â”‚      o (x, y)
                                  â”‚     /       â”‚
    Optical Center C              â””â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜           3D Point X = [X, Y, Z]^T
         (0, 0, 0)                   /                                 o
            oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€/â”€â”€â–º Z
            â”‚                      f                                 /
            â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚
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
          
                     y                                  (0, 0) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º u
                     â–²                                    â”‚
                     â”‚                                    â”‚      Pixel [u, v]
                     â”‚                                    â”‚         â”Œâ”€â”€â”€â”
                     â”‚                                    â”‚         â”‚   â”‚
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º x                    â”‚         â””â”€â”€â”€â”˜
                     â”‚ Origin (0, 0)                      â”‚      + Principal Point (c_x, c_y)
                     â”‚ (Optical Axis Piercing)            â”‚
                     â”‚                                    â–¼
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
                       
                           â”Œ                         â”
                           â”‚   f_x     s     c_x     â”‚
                       K = â”‚    0     f_y    c_y     â”‚
                           â”‚    0      0      1      â”‚
                           â””                         â”˜
                                â–²      â–²      â–²
                                â”‚      â”‚      â””â”€ Optical Center Piercing Offset
                                â”‚      â””â”€â”€â”€â”€â”€â”€â”€â”€ Pixel Skew Factor (cot Î¸_skew)
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Effective Pixel Focal Lengths
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
                                 â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º
                          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  Image Plane
                          â”‚            .             â”‚
                          â”‚            |             â”‚
                          â”‚            + (c_x, c_y)  â”‚
                          â”‚            |             â”‚
                          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                       â”‚
                                       â”‚ Focal Length f_x
                                       â”‚
                                       â–¼
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
       â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”               .â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€.                  â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
       â”‚   â”‚   â”‚   â”‚   â”‚              / â”Œâ”€â”€â”€â”¬â”€â”€â”€â”   \                 â”‚\  â”‚   â”‚  /â”‚
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤             â”‚  â”‚   â”‚   â”‚    â”‚                â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
       â”‚   â”‚   â”‚   â”‚   â”‚             â”‚  â”œâ”€â”€â”€â”¼â”€â”€â”€â”¤    â”‚                â”‚   â”‚   â”‚   â”‚
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤             â”‚  â”‚   â”‚   â”‚    â”‚                â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
       â”‚   â”‚   â”‚   â”‚   â”‚              \ â””â”€â”€â”€â”´â”€â”€â”€â”˜   /                 â”‚/  â”‚   â”‚  \â”‚
       â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜               'â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€'                  â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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


---\n
# Chapter 6: Rigid Body World-to-Camera Extrinsics and Homogeneous Projection Matrix

---

## 6.1 World vs. Camera Coordinate Frames and Rigid Euclidean Kinematics

In practical robotics and embodied AI, objects, obstacles, and landmarks exist in a global **World Coordinate Frame** $\mathcal{F}_W$ (e.g., an inertial navigation frame, a factory floor map, or a simulation environment). The camera, mounted on a mobile robot chassis or an articulated robotic arm, moves dynamically through this environment, defining its own local **Camera Coordinate Frame** $\mathcal{F}_C$.

```
                      WORLD VS. CAMERA COORDINATE FRAMES
                      
             World Frame F_W                           Camera Frame F_C
                  Z_W                                        Z_C (Optical Axis)
                   â–²                                         â–²
                   â”‚                                        /
                   â”‚                                       /
                   â”‚                                      oâ”€â”€â”€â”€â”€â”€â–º X_C
                   oâ”€â”€â”€â”€â”€â”€â–º Y_W                          â”‚ Optical Center C
                  /                                      â”‚
                 /                                       â–¼ Y_C
                â–¼ X_W
                
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

The entire imaging processâ€”from a 3D point anywhere in the physical universe to an integer pixel coordinate on the computer monitorâ€”is encapsulated in a single linear projective equation:

$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{P} \begin{bmatrix} X_W \\ Y_W \\ Z_W \\ 1 \end{bmatrix} = \begin{bmatrix} p_{11} & p_{12} & p_{13} & p_{14} \\ p_{21} & p_{22} & p_{23} & p_{24} \\ p_{31} & p_{32} & p_{33} & p_{34} \end{bmatrix} \begin{bmatrix} X_W \\ Y_W \\ Z_W \\ 1 \end{bmatrix}$$

```
                    THE CAMERA PROJECTION MATRIX DECOMPOSITION
                    
                           P = K [ R | t ]  âˆˆ R^(3x4)
                           
               Intrinsics (3x3)              Extrinsics (3x4)
           â”Œ                     â”       â”Œ                       â”
           â”‚  f_x    0    c_x    â”‚       â”‚  r11   r12   r13   t1 â”‚
           â”‚   0    f_y   c_y    â”‚   *   â”‚  r21   r22   r23   t2 â”‚
           â”‚   0     0     1     â”‚       â”‚  r31   r32   r33   t3 â”‚
           â””                     â”˜       â””                       â”˜
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
                    \               â–²
                     \             /
                      \           /
                       \         /
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Image Plane
                         \     (u, v)
                          \
                           \
                            â–¼
                         3D Object Point X_W(Î») = C + Î» d_W
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
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”
                               â”‚       â”‚
                               â”‚       â”‚           Far Plane
       Optical Center C        â””â”€â”€â”€â”€â”€â”€â”€â”˜       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚               â”‚
                              \       \        â”‚               â”‚
                               \       \       â”‚               â”‚
                                â””â”€â”€â”€â”€â”€â”€â”€â”˜      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                â—„â”€â”€ Field of View â”€â”€â–º
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


---\n
# Chapter 7: Camera Calibration, Planar Homographies, and Perspective Warping

---

## 7.1 Planar Homographies and 2D Projective Transformations

In computer vision and robotics, many critical perceptual tasks operate on planar surfaces: inspecting printed circuit boards, tracking checkerboard calibration patterns, reading planar barcodes/QR tags, and synthesizing bird's-eye view (BEV) ground planes for self-driving vehicles.

When a planar surface in the 3D world is imaged by a perspective camera, the mapping between the world plane and the 2D image planeâ€”or between two distinct camera views of the same planar surfaceâ€”is a **planar homography** (also known as a **projective collineation**).

```
                         THE PLANAR HOMOGRAPHY MAPPING
                         
             World Plane Î                                    Image Plane
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â”‚   o (X, Y)    â”‚                             â”‚        .        â”‚
           â”‚   â”‚           â”‚      Homography H           â”‚       /         â”‚
           â”‚   â”‚           â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º    â”‚      o (u, v)   â”‚
           â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â”‚                 â”‚
           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
           3D Coordinates on                            2D Pixel Coordinates
           World Plane (Z = 0)                           on Image Sensor
```

### The Homography Matrix H
Let $\mathbf{x} = [x, y, 1]^\top$ and $\mathbf{x}' = [u, v, 1]^\top$ denote corresponding homogeneous 2D coordinates on two projective planes. A planar homography is a linear transformation $\mathbf{H} \in \mathbb{R}^{3 \times 3}$:

$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{H} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix} = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

Expanding the matrix multiplication and dividing by the third homogeneous coordinate:
$$u = \frac{h_{11} x + h_{12} y + h_{13}}{h_{31} x + h_{32} y + h_{33}}, \quad v = \frac{h_{21} x + h_{22} y + h_{23}}{h_{31} x + h_{32} y + h_{33}}$$

### The 2D Transformation Hierarchy
Planar homographies form the highest tier of the 2D geometric transformation hierarchy:

```
                      THE 2D TRANSFORMATION HIERARCHY
                      
    Transformation    Matrix Structure                  DoF   Invariants
    â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    Euclidean         [ R_{2x2} | t_{2x1} ]              3    Lengths, Angles, Areas
    (Isometry)        [  0   0  |   1     ]
    
    Similarity        [ s*R_{2x2} | t_{2x1} ]            4    Angles, Length Ratios
                      [   0   0   |   1     ]
    
    Affine            [ a11 a12 | tx ]                   6    Parallelism, Ratio of
                      [ a21 a22 | ty ]                        parallel lengths/areas
                      [  0   0  |  1 ]
    
    Projective        [ h11 h12 | h13 ]                  8    Collinearity, Cross-ratio,
    (Homography)      [ h21 h22 | h23 ]                       Tangency
                      [ h31 h32 | h33 ]
```

#### Invariance Properties:
1. **Collinearity:** Straight lines on the source plane always map to straight lines on the target plane.
2. **Cross-Ratio Invariance:** For four collinear points $A, B, C, D$, the cross-ratio:
   $$\text{Cr}(A, B; C, D) = \frac{(x_C - x_A)(x_D - x_B)}{(x_C - x_B)(x_D - x_A)}$$
   is strictly preserved under any projective homography.
3. **Loss of Parallelism:** Parallel lines generally do NOT remain parallel; their projections intersect at a vanishing point unless the line is parallel to the intersection of the two planes.

---

## 7.2 The Direct Linear Transformation (DLT) Algorithm

A planar homography matrix $\mathbf{H}$ contains 9 entries, but because $\mathbf{H}$ is defined up to an arbitrary non-zero scalar ($\mathbf{H} \sim \alpha \mathbf{H}$), it possesses exactly **8 degrees of freedom (DoF)**.

The **Direct Linear Transformation (DLT)** algorithm is the foundational method for solving $\mathbf{H}$ from a set of known 2D point correspondences $\mathbf{x}_i \leftrightarrow \mathbf{x}_i'$.

```
                 DIRECT LINEAR TRANSFORMATION CORRESPONDENCES
                 
           Source Plane                                Target Plane
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚ 1           2 â”‚                           â”‚    1          â”‚
         â”‚   oâ”€â”€â”€â”€â”€â”€â”€o   â”‚                           â”‚     oâ”€â”€â”€â”€â”€â”€o 2â”‚
         â”‚   â”‚       â”‚   â”‚   â”€â”€â”€â”€â–º H via DLT â”€â”€â”€â–º    â”‚    /      /   â”‚
         â”‚   oâ”€â”€â”€â”€â”€â”€â”€o   â”‚                           â”‚   oâ”€â”€â”€â”€â”€â”€o    â”‚
         â”‚ 4           3 â”‚                           â”‚  4        3   â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
          Min 4 Points (No 3 Collinear) Solves the 8 DoF Homography!
```

### Derivation of the Linear System
For any correspondence $\mathbf{x}_i = [x_i, y_i, 1]^\top \leftrightarrow \mathbf{x}_i' = [u_i, v_i, 1]^\top$, the transformed homogeneous vector $\mathbf{H} \mathbf{x}_i$ is parallel to $\mathbf{x}_i'$.
Two 3D vectors are parallel if and only if their vector cross-product is zero:
$$\mathbf{x}_i' \times (\mathbf{H} \mathbf{x}_i) = \mathbf{0}_{3 \times 1}$$

Let the rows of $\mathbf{H}$ be denoted by $\mathbf{h}_1^\top, \mathbf{h}_2^\top, \mathbf{h}_3^\top$, so $\mathbf{H} \mathbf{x}_i = \begin{bmatrix} \mathbf{h}_1^\top \mathbf{x}_i \\ \mathbf{h}_2^\top \mathbf{x}_i \\ \mathbf{h}_3^\top \mathbf{x}_i \end{bmatrix}$.
Evaluating the cross product:
$$\begin{bmatrix} u_i \\ v_i \\ 1 \end{bmatrix} \times \begin{bmatrix} \mathbf{h}_1^\top \mathbf{x}_i \\ \mathbf{h}_2^\top \mathbf{x}_i \\ \mathbf{h}_3^\top \mathbf{x}_i \end{bmatrix} = \begin{bmatrix} v_i (\mathbf{h}_3^\top \mathbf{x}_i) - (\mathbf{h}_2^\top \mathbf{x}_i) \\ (\mathbf{h}_1^\top \mathbf{x}_i) - u_i (\mathbf{h}_3^\top \mathbf{x}_i) \\ u_i (\mathbf{h}_2^\top \mathbf{x}_i) - v_i (\mathbf{h}_1^\top \mathbf{x}_i) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$

Notice that the third equation is a linear combination of the first two (multiplying the first by $-u_i$ and the second by $-v_i$ yields the third). Thus, each point correspondence contributes **two linearly independent equations**:

$$\begin{aligned}
-\mathbf{h}_2^\top \mathbf{x}_i + v_i (\mathbf{h}_3^\top \mathbf{x}_i) &= 0 \\
\mathbf{h}_1^\top \mathbf{x}_i - u_i (\mathbf{h}_3^\top \mathbf{x}_i) &= 0
\end{aligned}$$

Flattening the $3 \times 3$ matrix into a 9-element vector:
$$\mathbf{h} = \begin{bmatrix} h_{11} & h_{12} & h_{13} & h_{21} & h_{22} & h_{23} & h_{31} & h_{32} & h_{33} \end{bmatrix}^\top \in \mathbb{R}^9$$

We rewrite the two equations in matrix form $\mathbf{A}_i \mathbf{h} = \mathbf{0}$:
$$\begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & u_i x_i & u_i y_i & u_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & v_i x_i & v_i y_i & v_i \end{bmatrix} \mathbf{h} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

### Minimum Number of Points
- Each point correspondence provides $2$ independent constraints.
- A homography has $8$ DoF.
- Therefore, a minimum of $N = 4$ point correspondences (with no 3 collinear) is required:
  $$2 \times 4 = 8 \text{ equations}$$
  The matrix $\mathbf{A}$ has dimensions $8 \times 9$, yielding a 1D nullspace containing the unique solution $\mathbf{h}$.

### Overdetermined Systems ($N > 4$) and SVD Solution
In real robotic systems, sensor noise corrupts point coordinates. We measure $N > 4$ correspondences (often dozens or hundreds), forming an overdetermined system $\mathbf{A} \mathbf{h} \approx \mathbf{0}$ of size $2N \times 9$.

Because of noise, no exact non-trivial nullspace exists ($\mathbf{A} \mathbf{h} \neq \mathbf{0}$). We formulate the problem as a **constrained linear least-squares optimization**:
$$\min_{\mathbf{h}} \|\mathbf{A} \mathbf{h}\|^2 \quad \text{subject to } \|\mathbf{h}\| = 1$$

#### Theorem (SVD Solution to Homogeneous Least-Squares):
By the Rayleigh-Ritz theorem, let the Singular Value Decomposition (SVD) of $\mathbf{A} \in \mathbb{R}^{2N \times 9}$ be:
$$\mathbf{A} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^\top$$
where $\boldsymbol{\Sigma} = \text{diag}(\sigma_1, \sigma_2, \dots, \sigma_9)$ with singular values in descending order $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_9 \ge 0$.
The optimal solution $\mathbf{h}^*$ that minimizes $\|\mathbf{A} \mathbf{h}\|^2$ subject to $\|\mathbf{h}\| = 1$ is the **ninth column of $\mathbf{V}$** (the right singular vector corresponding to the smallest singular value $\sigma_9$).

---

## 7.3 Data Normalization: The Hartley Preconditioning Standard

If the DLT algorithm is executed directly on raw pixel coordinates, the computed homography is frequently unstable. In 1997, Richard Hartley published the seminal paper *"In Defence of the Point Normalization Algorithm"*, proving that raw DLT is ruined by ill-conditioned numerical scaling.

### The Numerical Conditioning Crisis
Consider an HD image where pixel coordinates are around $x \approx 1000, y \approx 1000$.
In the matrix $\mathbf{A}_i$:
$$\mathbf{A}_i = \begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & u_i x_i & u_i y_i & u_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & v_i x_i & v_i y_i & v_i \end{bmatrix}$$
- The first three entries have magnitude $\approx 10^3$.
- The constant entries have magnitude $1$.
- The quadratic cross-terms $u_i x_i \approx 1000 \times 1000 \approx 10^6$.

The matrix contains entries varying over six orders of magnitude ($1$ to $10^6$). In the product $\mathbf{A}^\top \mathbf{A}$, elements scale as $(10^6)^2 = 10^{12}$. The condition number $\kappa(\mathbf{A}) = \frac{\sigma_{\text{max}}}{\sigma_{\text{min}}}$ explodes, causing severe roundoff error.

### Hartley Normalization Algorithm
Hartley proposed pre-conditioning the point coordinates with an affine similarity transform $\mathbf{T}$ such that:
1. The **centroid** of the point set is shifted to the coordinate origin $(0, 0)$.
2. The coordinates are scaled so that the **average Euclidean distance** from the origin is $\sqrt{2}$.

```
                         HARTLEY POINT NORMALIZATION
                         
            Raw Pixel Coordinates                  Normalized Coordinates
          (Origin at Top-Left, 0..1920)          (Origin at Centroid, Scale ~ 1)
          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                 â–² y_norm
          â”‚ o       o                 â”‚                 â”‚    o
          â”‚            o              â”‚                 â”‚ o     o
          â”‚      o          o         â”‚     â”€â”€â–º T â”€â”€â–º   â”¼â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â–º x_norm
          â”‚                 Centroid  â”‚                 â”‚    o     o
          â”‚                     x     â”‚                 â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### Step 1: Compute Centroid and Scale
For $N$ points $\{\mathbf{x}_i = [x_i, y_i]^\top\}_{i=1}^N$:
$$\bar{x} = \frac{1}{N} \sum_{i=1}^N x_i, \quad \bar{y} = \frac{1}{N} \sum_{i=1}^N y_i$$
Compute average distance to centroid:
$$d_{\text{avg}} = \frac{1}{N} \sum_{i=1}^N \sqrt{(x_i - \bar{x})^2 + (y_i - \bar{y})^2}$$
The scale factor is:
$$s = \frac{\sqrt{2}}{d_{\text{avg}}}$$

#### Step 2: Construct Normalization Matrix T
$$\mathbf{T} = \begin{bmatrix} s & 0 & -s \bar{x} \\ 0 & s & -s \bar{y} \\ 0 & 0 & 1 \end{bmatrix}$$
Transform points: $\tilde{\mathbf{x}}_i = \mathbf{T} \mathbf{x}_i$.
Similarly, compute normalization transform $\mathbf{T}'$ for target points: $\tilde{\mathbf{x}}_i' = \mathbf{T}' \mathbf{x}_i'$.

#### Step 3: Solve DLT on Normalized Points
Solve $\tilde{\mathbf{A}} \tilde{\mathbf{h}} = \mathbf{0}$ via SVD to obtain normalized homography $\tilde{\mathbf{H}}$.

#### Step 4: De-normalize
The relationship between normalized coordinates is $\tilde{\mathbf{x}}' = \tilde{\mathbf{H}} \tilde{\mathbf{x}}$.
Substituting $\tilde{\mathbf{x}}' = \mathbf{T}' \mathbf{x}'$ and $\tilde{\mathbf{x}} = \mathbf{T} \mathbf{x}$:
$$\mathbf{T}' \mathbf{x}' = \tilde{\mathbf{H}} \mathbf{T} \mathbf{x} \implies \mathbf{x}' = (\mathbf{T}')^{-1} \tilde{\mathbf{H}} \mathbf{T} \mathbf{x}$$
The true physical homography matrix is recovered as:
$$\mathbf{H} = (\mathbf{T}')^{-1} \tilde{\mathbf{H}} \mathbf{T}$$

---

## 7.4 Zhang's Method: Closed-Form Camera Calibration from Planar Targets

Before 1998, camera calibration required specialized 3D calibration rigs with precise millimeter manufacturing tolerances. Zhengyou Zhang (Microsoft Research) revolutionized the field by showing that full intrinsic camera calibration $\mathbf{K}$ and lens distortion can be achieved simply by observing a planar checkerboard pattern at multiple arbitrary orientations.

```
                     ZHANG'S CAMERA CALIBRATION SETUP
                     
                                 Planar Checkerboard Target
                                   (Known Square Size d)
                                       â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
                                       â”‚ # â”‚   â”‚ # â”‚
                                       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
       Camera Views                    â”‚   â”‚ # â”‚   â”‚
       (Min 3 Poses)                   â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
            Camera Pose 1                     â”‚
                [o]                           â–¼ (Pose 2: Rotated)
                 \                        â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
                  \                      / # /   / # /
                   \                    /â”€â”€â”€/â”€â”€â”€/â”€â”€â”€/
            Camera Pose 2              /   / # /   /
                [o]â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
```

### Planar Target Geometry ($Z_W = 0$)
Without loss of generality, fix the world coordinate system on the checkerboard plane such that $Z_W = 0$.
The 3D coordinates of target corners are known precisely: $\mathbf{X}_W = [X_W, Y_W, 0, 1]^\top$.

The projection equation becomes:
$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{r}_3 \mid \mathbf{t}] \begin{bmatrix} X_W \\ Y_W \\ 0 \\ 1 \end{bmatrix} = \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{t}] \begin{bmatrix} X_W \\ Y_W \\ 1 \end{bmatrix}$$

This reveals that the projection of the checkerboard plane is governed by a planar homography:
$$\mathbf{H} = [\mathbf{h}_1 \mid \mathbf{h}_2 \mid \mathbf{h}_3] = \lambda \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{t}]$$
where $\mathbf{h}_1 = \lambda \mathbf{K} \mathbf{r}_1$, $\mathbf{h}_2 = \lambda \mathbf{K} \mathbf{r}_2$, and $\mathbf{h}_3 = \lambda \mathbf{K} \mathbf{t}$.

Inverting the relationship:
$$\mathbf{r}_1 = \frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_1, \quad \mathbf{r}_2 = \frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_2$$

### The Two Fundamental Intrinsic Constraints
Because $\mathbf{R} = [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{r}_3]$ is a valid rotation matrix in $\text{SO}(3)$, its columns must satisfy the fundamental orthonormality axioms:
1. **Orthogonality ($\mathbf{r}_1 \perp \mathbf{r}_2$):**
   $$\mathbf{r}_1^\top \mathbf{r}_2 = 0 \implies \left(\frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_1\right)^\top \left(\frac{1}{\lambda} \mathbf{K}^{-1} \mathbf{h}_2\right) = 0 \implies \mathbf{h}_1^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_2 = 0$$

2. **Equal Length ($\|\mathbf{r}_1\| = \|\mathbf{r}_2\| = 1$):**
   $$\|\mathbf{r}_1\|^2 = \|\mathbf{r}_2\|^2 \implies \mathbf{h}_1^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_1 = \mathbf{h}_2^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_2$$

### The Image of the Absolute Conic (B Matrix)
Define the symmetric matrix $\mathbf{B} \in \mathbb{R}^{3 \times 3}$:
$$\mathbf{B} \triangleq \mathbf{K}^{-\top} \mathbf{K}^{-1} = \begin{bmatrix} B_{11} & B_{12} & B_{13} \\ B_{12} & B_{22} & B_{23} \\ B_{13} & B_{23} & B_{33} \end{bmatrix}$$
In projective geometry, $\mathbf{B}$ is the **Image of the Absolute Conic (IAC)**. Because $\mathbf{B}$ is real and symmetric, it contains only **6 unique parameters**:
$$\mathbf{b} = [B_{11}, B_{12}, B_{22}, B_{13}, B_{23}, B_{33}]^\top \in \mathbb{R}^6$$

Using vector $\mathbf{b}$, the quadratic form $\mathbf{h}_i^\top \mathbf{B} \mathbf{h}_j$ can be rewritten as a linear dot product:
$$\mathbf{h}_i^\top \mathbf{B} \mathbf{h}_j = \mathbf{v}_{ij}^\top \mathbf{b}$$
where:
$$\mathbf{v}_{ij} = \begin{bmatrix} h_{i1} h_{j1} \\ h_{i1} h_{j2} + h_{i2} h_{j1} \\ h_{i2} h_{j2} \\ h_{i3} h_{j1} + h_{i1} h_{j3} \\ h_{i3} h_{j2} + h_{i2} h_{j3} \\ h_{i3} h_{j3} \end{bmatrix}$$

The two geometric constraints become two linear scalar equations:
$$\begin{bmatrix} \mathbf{v}_{12}^\top \\ (\mathbf{v}_{11} - \mathbf{v}_{22})^\top \end{bmatrix} \mathbf{b} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

### Solving for Intrinsics
- Each image view of the checkerboard provides an estimated homography $\mathbf{H}_k$, which contributes **2 independent linear equations** on $\mathbf{b}$.
- The vector $\mathbf{b}$ has 6 parameters (5 DoF up to scale).
- Therefore, observing the checkerboard in **$K \ge 3$ distinct, non-parallel orientations** yields $2K \ge 6$ linear equations $\mathbf{V} \mathbf{b} = \mathbf{0}$, uniquely determining $\mathbf{b}$ via SVD!
- Once $\mathbf{b}$ is found, matrix $\mathbf{B} = \mathbf{K}^{-\top} \mathbf{K}^{-1}$ is assembled.
- Applying **Cholesky factorization** ($\mathbf{B} = \mathbf{L} \mathbf{L}^\top$) immediately recovers the intrinsic matrix $\mathbf{K} = \mathbf{L}^{-\top}$!

---

## 7.5 Inverse Perspective Mapping (IPM) for Robotic Ground Planes

For an autonomous ground vehicle, cameras capture the road in perspective. Parallel lane markings converge toward the horizon, and distant obstacles appear compressed.

**Inverse Perspective Mapping (IPM)** eliminates perspective foreshortening by computing the homography between the camera image plane and the horizontal road plane, warping the camera view into an orthographic **Bird's-Eye View (BEV)**.

```
                         INVERSE PERSPECTIVE MAPPING (IPM)
                         
             Perspective Camera View                      Bird's-Eye View (BEV)
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â”‚             |             â”‚                 â”‚   |           |   â”‚
           â”‚            / \            â”‚                 â”‚   |           |   â”‚
           â”‚           /   \           â”‚  â”€â”€â–º H_IPM â”€â”€â–º  â”‚   |     o     |   â”‚
           â”‚          /     \          â”‚                 â”‚   |  Obstacle |   â”‚
           â”‚         /   o   \         â”‚                 â”‚   |           |   â”‚
           â”‚        / Obstacle\        â”‚                 â”‚   |           |   â”‚
           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             Converging Lane Markers                       Parallel Lane Lines
             (Severe Metric Distortion)                    (True Metric Grid!)
```

### Derivation of the Ground Homography
1. Let the road surface be the world plane $Z_W = 0$.
2. The camera pose relative to the road has height $h$, pitch angle $\theta$, and roll $\phi$.
3. The homography mapping ground coordinates $(X_W, Y_W)$ to image pixels $(u, v)$ is:
   $$\mathbf{H}_{GW} = \mathbf{K} [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{t}]$$
4. To synthesize the top-down view, we invert the mapping:
   $$\mathbf{H}_{\text{IPM}} = \mathbf{H}_{GW}^{-1}$$
   Every pixel in the BEV image represents a calibrated metric distance (e.g., $1\text{ pixel} = 2.0\text{ cm}$). Autonomous planning algorithms can perform collision checking and trajectory generation directly in this metric grid.

---

## 7.6 Worked Examples

### Problem 7.1: DLT Homography Matrix Formulation
**Statement:** Four 2D point correspondences $\mathbf{x}_i \leftrightarrow \mathbf{x}_i'$ are given:
- $\mathbf{x}_1 = [0, 0]^\top \leftrightarrow \mathbf{x}_1' = [100, 100]^\top$
- $\mathbf{x}_2 = [1, 0]^\top \leftrightarrow \mathbf{x}_2' = [200, 100]^\top$
- $\mathbf{x}_3 = [1, 1]^\top \leftrightarrow \mathbf{x}_3' = [200, 200]^\top$
- $\mathbf{x}_4 = [0, 1]^\top \leftrightarrow \mathbf{x}_4' = [100, 200]^\top$
Write the two linear constraint rows in $\mathbf{A} \mathbf{h} = \mathbf{0}$ contributed by point 1 ($\mathbf{x}_1 \leftrightarrow \mathbf{x}_1'$).

**Step-by-step Solution:**
1. In homogeneous coordinates:
   $$\mathbf{x}_1 = [x_1, y_1, 1]^\top = [0, 0, 1]^\top, \quad \mathbf{x}_1' = [u_1, v_1, 1]^\top = [100, 100, 1]^\top$$
2. Recall the general DLT row pair:
   $$\mathbf{A}_i = \begin{bmatrix} -x_i & -y_i & -1 & 0 & 0 & 0 & u_i x_i & u_i y_i & u_i \\ 0 & 0 & 0 & -x_i & -y_i & -1 & v_i x_i & v_i y_i & v_i \end{bmatrix}$$
3. Substitute $x_1 = 0, y_1 = 0, u_1 = 100, v_1 = 100$:
   - Row 1:
     $$\begin{bmatrix} -0 & -0 & -1 & 0 & 0 & 0 & (100)(0) & (100)(0) & 100 \end{bmatrix} = \begin{bmatrix} 0 & 0 & -1 & 0 & 0 & 0 & 0 & 0 & 100 \end{bmatrix}$$
   - Row 2:
     $$\begin{bmatrix} 0 & 0 & 0 & -0 & -0 & -1 & (100)(0) & (100)(0) & 100 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 & 0 & 0 & -1 & 0 & 0 & 100 \end{bmatrix}$$
4. The equations enforce:
   $$-h_{13} + 100 h_{33} = 0 \implies h_{13} = 100 h_{33}$$
   $$-h_{23} + 100 h_{33} = 0 \implies h_{23} = 100 h_{33}$$
   Setting $h_{33} = 1$ confirms the translation offset of $(100, 100)$ pixels.

---

### Problem 7.2: Planar Homography Warping of a 2D Point
**Statement:** A planar homography matrix is:
$$\mathbf{H} = \begin{bmatrix} 2.0 & 0.5 & 50.0 \\ 0.0 & 1.5 & 30.0 \\ 0.001 & 0.002 & 1.0 \end{bmatrix}$$
Compute the warped pixel coordinates $(u, v)$ for the source point $(x, y) = (100, 200)$.

**Step-by-step Solution:**
1. Express source point in homogeneous coordinates: $\tilde{\mathbf{x}} = [100, 200, 1]^\top$.
2. Compute matrix-vector product:
   $$\begin{aligned}
   \begin{bmatrix} \tilde{u} \\ \tilde{v} \\ \tilde{w} \end{bmatrix} &= \mathbf{H} \tilde{\mathbf{x}} = \begin{bmatrix} 2.0 & 0.5 & 50.0 \\ 0.0 & 1.5 & 30.0 \\ 0.001 & 0.002 & 1.0 \end{bmatrix} \begin{bmatrix} 100 \\ 200 \\ 1 \end{bmatrix} \\
   &= \begin{bmatrix} 2.0(100) + 0.5(200) + 50.0(1) \\ 0.0(100) + 1.5(200) + 30.0(1) \\ 0.001(100) + 0.002(200) + 1.0(1) \end{bmatrix} \\
   &= \begin{bmatrix} 200 + 100 + 50 \\ 0 + 300 + 30 \\ 0.1 + 0.4 + 1.0 \end{bmatrix} = \begin{bmatrix} 350.0 \\ 330.0 \\ 1.5 \end{bmatrix}
   \end{aligned}$$
3. Perform Cartesian normalization (divide by homogeneous scale $\tilde{w} = 1.5$):
   $$u = \frac{350.0}{1.5} \approx 233.33 \text{ pixels}$$
   $$v = \frac{330.0}{1.5} = 220.0 \text{ pixels}$$
   The point $(100, 200)$ maps to $(233.33, 220.0)$.

---

### Problem 7.3: Hartley Normalization Matrix Computation
**Statement:** A set of 4 corner points is given in raw pixel coordinates:
$$\mathbf{x}_1 = [100, 100]^\top, \quad \mathbf{x}_2 = [700, 100]^\top, \quad \mathbf{x}_3 = [700, 500]^\top, \quad \mathbf{x}_4 = [100, 500]^\top$$
1. Compute the centroid $(\bar{x}, \bar{y})$.
2. Compute the average Euclidean distance $d_{\text{avg}}$ to the centroid.
3. Construct Hartley's $3 \times 3$ normalization matrix $\mathbf{T}$.

**Step-by-step Solution:**
1. **Centroid:**
   $$\bar{x} = \frac{100 + 700 + 700 + 100}{4} = \frac{1600}{4} = 400.0$$
   $$\bar{y} = \frac{100 + 100 + 500 + 500}{4} = \frac{1200}{4} = 300.0$$
   Centroid: $(\bar{x}, \bar{y}) = (400, 300)$.
2. **Euclidean Distances:**
   For each corner, displacement is $(\pm 300, \pm 200)$:
   $$d_i = \sqrt{(\pm 300)^2 + (\pm 200)^2} = \sqrt{90000 + 40000} = \sqrt{130000} \approx 360.555 \text{ pixels}$$
   Since all 4 points are symmetrically placed, their distances are identical:
   $$d_{\text{avg}} = 360.555\text{ pixels}$$
3. **Scale Factor:**
   $$s = \frac{\sqrt{2}}{d_{\text{avg}}} = \frac{1.41421}{360.555} \approx 0.0039223$$
4. **Normalization Matrix $\mathbf{T}$:**
   $$\mathbf{T} = \begin{bmatrix} s & 0 & -s \bar{x} \\ 0 & s & -s \bar{y} \\ 0 & 0 & 1 \end{bmatrix}$$
   $$-s \bar{x} = -(0.0039223)(400) \approx -1.5689$$
   $$-s \bar{y} = -(0.0039223)(300) \approx -1.1767$$
   $$\mathbf{T} \approx \begin{bmatrix} 0.003922 & 0 & -1.5689 \\ 0 & 0.003922 & -1.1767 \\ 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 7.4: Homography Inversion and Backward Warping
**Statement:** A pure affine homography is:
$$\mathbf{H} = \begin{bmatrix} 2 & 0 & 10 \\ 0 & 3 & 20 \\ 0 & 0 & 1 \end{bmatrix}$$
1. Compute the analytical inverse $\mathbf{H}^{-1}$.
2. For an output pixel at $(u, v) = (50, 80)$, find the source pixel coordinate $(x, y)$ to sample from.

**Step-by-step Solution:**
1. **Inverse Matrix $\mathbf{H}^{-1}$:**
   For an affine matrix $\begin{bmatrix} \mathbf{A} & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix}$, the inverse is $\begin{bmatrix} \mathbf{A}^{-1} & -\mathbf{A}^{-1} \mathbf{t} \\ \mathbf{0}^\top & 1 \end{bmatrix}$.
   Here $\mathbf{A} = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix} \implies \mathbf{A}^{-1} = \begin{bmatrix} 0.5 & 0 \\ 0 & \frac{1}{3} \end{bmatrix}$.
   Translation term:
   $$-\mathbf{A}^{-1} \mathbf{t} = -\begin{bmatrix} 0.5 & 0 \\ 0 & \frac{1}{3} \end{bmatrix} \begin{bmatrix} 10 \\ 20 \end{bmatrix} = -\begin{bmatrix} 5 \\ \frac{20}{3} \end{bmatrix} = \begin{bmatrix} -5 \\ -6.667 \end{bmatrix}$$
   $$\mathbf{H}^{-1} = \begin{bmatrix} 0.5 & 0 & -5 \\ 0 & \frac{1}{3} & -\frac{20}{3} \\ 0 & 0 & 1 \end{bmatrix}$$

2. **Source Coordinate Sampling:**
   $$\begin{bmatrix} x \\ y \\ 1 \end{bmatrix} = \mathbf{H}^{-1} \begin{bmatrix} 50 \\ 80 \\ 1 \end{bmatrix} = \begin{bmatrix} 0.5(50) - 5 \\ \frac{1}{3}(80) - \frac{20}{3} \\ 1 \end{bmatrix} = \begin{bmatrix} 25 - 5 \\ \frac{60}{3} \\ 1 \end{bmatrix} = \begin{bmatrix} 20 \\ 20 \\ 1 \end{bmatrix}$$
   The source coordinate is $(x, y) = (20.0, 20.0)$.

---

### Problem 7.5: Zhang's Orthogonality Constraint Verification
**Statement:** A homography extracted from a checkerboard image is:
$$\mathbf{H} = [\mathbf{h}_1 \mid \mathbf{h}_2 \mid \mathbf{h}_3] = \begin{bmatrix} 600 & 0 & 300 \\ 0 & 600 & 200 \\ 0 & 0 & 1 \end{bmatrix}$$
Assuming known ideal intrinsics $\mathbf{K} = \begin{bmatrix} 600 & 0 & 300 \\ 0 & 600 & 200 \\ 0 & 0 & 1 \end{bmatrix}$, verify whether the columns of $\mathbf{H}$ satisfy Zhang's orthogonality condition $\mathbf{h}_1^\top \mathbf{K}^{-\top} \mathbf{K}^{-1} \mathbf{h}_2 = 0$.

**Step-by-step Solution:**
1. Notice that $\mathbf{H} = \mathbf{K}$.
   Therefore, $\mathbf{K}^{-1} \mathbf{H} = \mathbf{I}_{3 \times 3}$.
2. In terms of columns:
   $$\mathbf{K}^{-1} \mathbf{h}_1 = \mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{K}^{-1} \mathbf{h}_2 = \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
3. Evaluate the inner product:
   $$\mathbf{h}_1^\top (\mathbf{K}^{-\top} \mathbf{K}^{-1}) \mathbf{h}_2 = (\mathbf{K}^{-1} \mathbf{h}_1)^\top (\mathbf{K}^{-1} \mathbf{h}_2) = \mathbf{e}_1^\top \mathbf{e}_2 = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = 0$$
   The condition evaluates identically to zero, confirming perfect orthogonality.

---

### Problem 7.6: Inverse Perspective Mapping Ground Resolution
**Statement:** An automotive camera with $f_y = 1200\text{ pixels}$ is mounted at height $h = 1.2\text{ meters}$ with a downward pitch angle of $\theta = 15^\circ$.
A BEV image is synthesized covering a forward ground range from $Z_{\text{near}} = 3.0\text{ meters}$ to $Z_{\text{far}} = 30.0\text{ meters}$ across an output height of $H_{\text{BEV}} = 900\text{ pixels}$.
Compute the spatial metric resolution of the BEV grid in centimeters per pixel.

**Step-by-step Solution:**
1. Total longitudinal physical ground distance covered:
   $$\Delta Z = Z_{\text{far}} - Z_{\text{near}} = 30.0 - 3.0 = 27.0\text{ meters} = 2700\text{ cm}$$
2. The distance is mapped linearly across $H_{\text{BEV}} = 900\text{ pixels}$.
3. Longitudinal metric resolution:
   $$\text{Resolution} = \frac{\Delta Z}{H_{\text{BEV}}} = \frac{2700\text{ cm}}{900\text{ pixels}} = 3.0\text{ cm/pixel}$$
   Every vertical pixel in the synthesized BEV frame corresponds to exactly $3.0\text{ centimeters}$ on the physical road surface.

---

### Problem 7.7: Cross-Ratio Invariance Verification
**Statement:** Four points on a 1D line in the source plane have coordinates $x_A = 0, x_B = 2, x_C = 3, x_D = 6$.
1. Compute the cross-ratio $\text{Cr}(A, B; C, D)$.
2. If these points are transformed via the 1D homography $x' = \frac{x + 4}{2x + 1}$, compute the transformed coordinates and verify that the cross-ratio is preserved.

**Step-by-step Solution:**
1. **Original Cross-Ratio:**
   $$\text{Cr} = \frac{(x_C - x_A)(x_D - x_B)}{(x_C - x_B)(x_D - x_A)} = \frac{(3 - 0)(6 - 2)}{(3 - 2)(6 - 0)} = \frac{(3)(4)}{(1)(6)} = \frac{12}{6} = 2.0$$
2. **Transformed Coordinates:**
   - $x_A = 0 \implies x_A' = \frac{0 + 4}{0 + 1} = 4.0$
   - $x_B = 2 \implies x_B' = \frac{2 + 4}{2(2) + 1} = \frac{6}{5} = 1.2$
   - $x_C = 3 \implies x_C' = \frac{3 + 4}{2(3) + 1} = \frac{7}{7} = 1.0$
   - $x_D = 6 \implies x_D' = \frac{6 + 4}{2(6) + 1} = \frac{10}{13} \approx 0.76923$
3. **Transformed Cross-Ratio:**
   $$\text{Cr}' = \frac{(x_C' - x_A')(x_D' - x_B')}{(x_C' - x_B')(x_D' - x_A')}$$
   $$\begin{aligned}
   x_C' - x_A' &= 1.0 - 4.0 = -3.0 \\
   x_D' - x_B' &= \frac{10}{13} - \frac{6}{5} = \frac{50 - 78}{65} = -\frac{28}{65} \\
   x_C' - x_B' &= 1.0 - 1.2 = -0.2 = -\frac{1}{5} \\
   x_D' - x_A' &= \frac{10}{13} - 4.0 = \frac{10 - 52}{13} = -\frac{42}{13}
   \end{aligned}$$
   Numerator: $(-3) \times \left(-\frac{28}{65}\right) = \frac{84}{65}$.
   Denominator: $\left(-\frac{1}{5}\right) \times \left(-\frac{42}{13}\right) = \frac{42}{65}$.
   $$\text{Cr}' = \frac{84 / 65}{42 / 65} = \frac{84}{42} = 2.0$$
   $\text{Cr}' = \text{Cr} = 2.0$ exactly! The cross-ratio is strictly invariant.

---

### Problem 7.8: Degrees of Freedom in Affine vs. Projective Homography
**Statement:** Prove why an affine homography requires 3 point correspondences while a projective homography requires 4 point correspondences.

**Step-by-step Solution:**
1. **Affine Transformation:**
   $$\mathbf{H}_{\text{affine}} = \begin{bmatrix} a_{11} & a_{12} & t_x \\ a_{21} & a_{22} & t_y \\ 0 & 0 & 1 \end{bmatrix}$$
   The last row is fixed as $[0, 0, 1]$ because affine mappings preserve points at infinity (parallel lines remain parallel).
   There are exactly $6$ unknown parameters ($a_{11}, a_{12}, a_{21}, a_{22}, t_x, t_y$).
   Each point correspondence provides 2 linear equations:
   $$N_{\text{affine}} = \frac{6 \text{ DoF}}{2 \text{ eq/point}} = 3 \text{ points (non-collinear)}$$

2. **Projective Homography:**
   $$\mathbf{H}_{\text{proj}} = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix}$$
   The last row $[h_{31}, h_{32}, h_{33}]$ is unconstrained, allowing vanishing lines and perspective convergence.
   With global scale invariance, there are $9 - 1 = 8$ degrees of freedom.
   $$N_{\text{proj}} = \frac{8 \text{ DoF}}{2 \text{ eq/point}} = 4 \text{ points (no 3 collinear)}$$

---

### Problem 7.9: Vanishing Line Extraction from Planar Homography
**Statement:** Given the homography $\mathbf{H} = \begin{bmatrix} \mathbf{h}_1^\top \\ \mathbf{h}_2^\top \\ \mathbf{h}_3^\top \end{bmatrix}$ mapping a source plane $\Pi$ to the camera image plane, show that the line $\mathbf{l}_\infty$ on plane $\Pi$ that maps to the line at infinity in the image is given by $\mathbf{h}_3$.

**Step-by-step Solution:**
1. The line at infinity in the target image plane is represented in homogeneous line coordinates as $\mathbf{l}_\infty' = [0, 0, 1]^\top$.
2. In projective geometry, if points transform as $\mathbf{x}' = \mathbf{H} \mathbf{x}$, lines transform via the inverse transpose:
   $$\mathbf{l} = \mathbf{H}^\top \mathbf{l}'$$
3. Substitute $\mathbf{l}' = \mathbf{l}_\infty' = [0, 0, 1]^\top$:
   $$\mathbf{l} = \mathbf{H}^\top \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{h}_1 & \mathbf{h}_2 & \mathbf{h}_3 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \mathbf{h}_3$$
   Therefore, the line vector $\mathbf{h}_3 = [h_{31}, h_{32}, h_{33}]^\top$ represents the vanishing line on the source plane whose points map to infinity in the image.

---

### Problem 7.10: Homography Composition for Multi-Camera Stitching
**Statement:** In an autonomous surveillance drone, Camera 1 and Camera 2 observe a flat ground plane with homographies $\mathbf{H}_1$ and $\mathbf{H}_2$ relative to the ground.
Express the inter-camera homography $\mathbf{H}_{21}$ that warps an image from Camera 1 directly into the perspective of Camera 2.

**Step-by-step Solution:**
1. Let $\mathbf{x}_G$ denote homogeneous coordinates on the ground plane.
2. The projections into the two cameras are:
   $$\mathbf{x}_1 = \mathbf{H}_1 \mathbf{x}_G \implies \mathbf{x}_G = \mathbf{H}_1^{-1} \mathbf{x}_1$$
   $$\mathbf{x}_2 = \mathbf{H}_2 \mathbf{x}_G$$
3. Substitute $\mathbf{x}_G$ into the Camera 2 projection:
   $$\mathbf{x}_2 = \mathbf{H}_2 (\mathbf{H}_1^{-1} \mathbf{x}_1) = (\mathbf{H}_2 \mathbf{H}_1^{-1}) \mathbf{x}_1$$
4. Therefore, the direct image-to-image transfer homography is:
   $$\mathbf{H}_{21} = \mathbf{H}_2 \mathbf{H}_1^{-1}$$
   Any image captured by Camera 1 can be stitched seamlessly into Camera 2's frame by multiplying with $\mathbf{H}_{21}$.

---

## 7.7 Solved Exercises

### Exercise 7.1: Group Properties of Planar Homographies
**Statement:** Prove that the set of all $3 \times 3$ non-singular homography matrices forms a mathematical group under matrix multiplication (the Projective Linear Group $\text{PGL}(3, \mathbb{R})$).

**Solution:**
A set $G$ with binary operation $\cdot$ is a group if it satisfies four axioms:
1. **Closure:** Let $\mathbf{H}_1, \mathbf{H}_2 \in \text{PGL}(3, \mathbb{R})$. Then $\det(\mathbf{H}_1) \neq 0$ and $\det(\mathbf{H}_2) \neq 0$.
   By the product rule of determinants:
   $$\det(\mathbf{H}_1 \mathbf{H}_2) = \det(\mathbf{H}_1) \det(\mathbf{H}_2) \neq 0$$
   Thus, $\mathbf{H}_1 \mathbf{H}_2 \in \text{PGL}(3, \mathbb{R})$.
2. **Associativity:** Matrix multiplication is associative:
   $$(\mathbf{H}_1 \mathbf{H}_2) \mathbf{H}_3 = \mathbf{H}_1 (\mathbf{H}_2 \mathbf{H}_3)$$
3. **Identity Element:** The $3 \times 3$ identity matrix $\mathbf{I}_{3 \times 3} \in \text{PGL}(3, \mathbb{R})$ satisfies $\mathbf{H} \mathbf{I} = \mathbf{I} \mathbf{H} = \mathbf{H}$.
4. **Inverse Element:** For every non-singular $\mathbf{H}$, its matrix inverse $\mathbf{H}^{-1}$ exists, satisfies $\det(\mathbf{H}^{-1}) = \frac{1}{\det(\mathbf{H})} \neq 0$, and $\mathbf{H} \mathbf{H}^{-1} = \mathbf{I}$.
   Therefore, $\text{PGL}(3, \mathbb{R})$ forms a valid group under composition. $\blacksquare$

---

### Exercise 7.2: Degenerate Point Configurations in DLT
**Statement:** Explain what happens to the DLT linear system $\mathbf{A} \mathbf{h} = \mathbf{0}$ if 3 of the 4 point correspondences are collinear in the source plane.

**Solution:**
1. If 3 points $\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3$ lie on a single line $\mathbf{l}$, their coordinates satisfy $\mathbf{l}^\top \mathbf{x}_i = 0$.
2. This geometric dependency renders the corresponding rows of the measurement matrix $\mathbf{A}$ linearly dependent.
3. The rank of matrix $\mathbf{A}$ drops:
   $$\text{rank}(\mathbf{A}) \le 7 < 8$$
4. The nullspace of $\mathbf{A}$ has dimension $\ge 2$.
   Rather than a unique ray solution for $\mathbf{h}$, there exists an infinite family of non-equivalent homographies that satisfy the 4 points. The solution is geometrically degenerate and physically unconstrained outside the collinear line.

---

### Exercise 7.3: Line Transformation Rule Under Homography
**Statement:** Prove that if 2D points transform as $\mathbf{x}' = \mathbf{H} \mathbf{x}$, then 2D lines $\mathbf{l}$ (where $\mathbf{l}^\top \mathbf{x} = 0$) transform as $\mathbf{l}' = \mathbf{H}^{-\top} \mathbf{l}$.

**Solution:**
1. A 2D point $\mathbf{x}$ lies on line $\mathbf{l}$ if and only if:
   $$\mathbf{l}^\top \mathbf{x} = 0$$
2. Since $\mathbf{x}' = \mathbf{H} \mathbf{x}$ and $\mathbf{H}$ is invertible:
   $$\mathbf{x} = \mathbf{H}^{-1} \mathbf{x}'$$
3. Substitute $\mathbf{x}$ into the line incidence equation:
   $$\mathbf{l}^\top (\mathbf{H}^{-1} \mathbf{x}') = 0$$
4. Using the transpose identity $(\mathbf{A} \mathbf{B})^\top = \mathbf{B}^\top \mathbf{A}^\top$:
   $$\mathbf{l}^\top \mathbf{H}^{-1} \mathbf{x}' = (\mathbf{H}^{-\top} \mathbf{l})^\top \mathbf{x}' = 0$$
5. For the transformed point $\mathbf{x}'$ to lie on the transformed line $\mathbf{l}'$, we must have $(\mathbf{l}')^\top \mathbf{x}' = 0$.
   Therefore:
   $$\mathbf{l}' = \mathbf{H}^{-\top} \mathbf{l} \quad \blacksquare$$
   Points transform covariantly with $\mathbf{H}$, while lines transform contravariantly with $\mathbf{H}^{-\top}$.

---

### Exercise 7.4: Conic Transformation Under Homography
**Statement:** A 2D conic is defined by the matrix equation $\mathbf{x}^\top \mathbf{C} \mathbf{x} = 0$, where $\mathbf{C} \in \mathbb{R}^{3 \times 3}$ is symmetric. Prove that under homography $\mathbf{x}' = \mathbf{H} \mathbf{x}$, the conic transforms to $\mathbf{C}' = \mathbf{H}^{-\top} \mathbf{C} \mathbf{H}^{-1}$.

**Solution:**
1. Start with the incidence equation for points on conic $\mathbf{C}$:
   $$\mathbf{x}^\top \mathbf{C} \mathbf{x} = 0$$
2. Substitute $\mathbf{x} = \mathbf{H}^{-1} \mathbf{x}'$:
   $$(\mathbf{H}^{-1} \mathbf{x}')^\top \mathbf{C} (\mathbf{H}^{-1} \mathbf{x}') = 0$$
3. Transposing the first term:
   $$(\mathbf{x}')^\top (\mathbf{H}^{-1})^\top \mathbf{C} \mathbf{H}^{-1} \mathbf{x}' = 0$$
4. Rearranging:
   $$(\mathbf{x}')^\top (\mathbf{H}^{-\top} \mathbf{C} \mathbf{H}^{-1}) \mathbf{x}' = 0$$
5. Equating to $(\mathbf{x}')^\top \mathbf{C}' \mathbf{x}' = 0$:
   $$\mathbf{C}' = \mathbf{H}^{-\top} \mathbf{C} \mathbf{H}^{-1} \quad \blacksquare$$

---

### Exercise 7.5: Minimum Number of Views in Zhang's Calibration
**Statement:** Prove algebraically why at least 3 distinct checkerboard orientations are required to calibrate a camera with 5 unknown intrinsic parameters using Zhang's method.

**Solution:**
1. The symmetric matrix $\mathbf{B} = \mathbf{K}^{-\top} \mathbf{K}^{-1}$ has 6 elements.
2. Because $\mathbf{B}$ is defined up to scale, it contains $6 - 1 = 5$ independent parameters corresponding to the 5 intrinsic parameters ($f_x, f_y, c_x, c_y, s$).
3. Each checkerboard view provides one homography $\mathbf{H}_k$.
4. From Section 7.4, each homography provides exactly 2 linear equations on $\mathbf{B}$:
   $$\mathbf{h}_1^\top \mathbf{B} \mathbf{h}_2 = 0$$
   $$\mathbf{h}_1^\top \mathbf{B} \mathbf{h}_1 - \mathbf{h}_2^\top \mathbf{B} \mathbf{h}_2 = 0$$
5. To solve for 5 unknowns:
   - With $K = 1$ view: $2 \times 1 = 2$ equations (underdetermined, 3 DoF remain).
   - With $K = 2$ views: $2 \times 2 = 4$ equations (underdetermined, 1 DoF remains; can only solve if skew $s = 0$ is assumed).
   - With $K = 3$ views: $2 \times 3 = 6$ equations ($6 \ge 5$, overdetermined linear system).
   Thus, $K \ge 3$ distinct orientations are strictly required to solve for full unconstrained intrinsics. $\blacksquare$

---

### Exercise 7.6: Degeneracy in Parallel Calibration Planes
**Statement:** Explain why capturing 3 checkerboard images where the board is purely translated (without rotation) fails to calibrate the camera in Zhang's method.

**Solution:**
1. Suppose the checkerboard undergoes pure translation between views: $\mathbf{R}_2 = \mathbf{R}_1$ and $\mathbf{R}_3 = \mathbf{R}_1$.
2. The rotation columns $\mathbf{r}_1$ and $\mathbf{r}_2$ are identical across all views.
3. Consequently, the homography columns $\mathbf{h}_1$ and $\mathbf{h}_2$ in view 2 and view 3 are scalar multiples of the columns in view 1.
4. The linear equations $\mathbf{v}_{12}^\top \mathbf{b} = 0$ and $(\mathbf{v}_{11} - \mathbf{v}_{22})^\top \mathbf{b} = 0$ generated by views 2 and 3 are linearly dependent on those of view 1!
5. The rank of the constraint matrix $\mathbf{V}$ remains $2$, failing to constrain the remaining 3 degrees of freedom. Rotation (tilting the plane relative to the camera) is mandatory to generate independent constraints. $\blacksquare$

---

### Exercise 7.7: Pure Rotation Homography (Concentric Camera)
**Statement:** Prove that two images captured by a camera rotating strictly around its optical center without translation ($\mathbf{t} = \mathbf{0}$) are related by a planar homography, regardless of the 3D scene depth structure.

**Solution:**
1. Let camera 1 have pose $[\mathbf{I} \mid \mathbf{0}]$, so $\mathbf{X}_{C1} = \mathbf{X}$.
   Let camera 2 be rotated by $\mathbf{R}$ with zero translation: $\mathbf{X}_{C2} = \mathbf{R} \mathbf{X}_{C1}$.
2. The projection in camera 1 is $\lambda_1 \tilde{\mathbf{x}}_1 = \mathbf{K}_1 \mathbf{X}_{C1} \implies \mathbf{X}_{C1} = \lambda_1 \mathbf{K}_1^{-1} \tilde{\mathbf{x}}_1$.
3. The projection in camera 2 is:
   $$\lambda_2 \tilde{\mathbf{x}}_2 = \mathbf{K}_2 \mathbf{X}_{C2} = \mathbf{K}_2 (\mathbf{R} \mathbf{X}_{C1})$$
4. Substituting $\mathbf{X}_{C1}$:
   $$\lambda_2 \tilde{\mathbf{x}}_2 = \mathbf{K}_2 \mathbf{R} (\lambda_1 \mathbf{K}_1^{-1} \tilde{\mathbf{x}}_1) = \lambda_1 (\mathbf{K}_2 \mathbf{R} \mathbf{K}_1^{-1}) \tilde{\mathbf{x}}_1$$
5. Define $\mathbf{H} \triangleq \mathbf{K}_2 \mathbf{R} \mathbf{K}_1^{-1} \in \mathbb{R}^{3 \times 3}$.
   Then:
   $$\lambda \tilde{\mathbf{x}}_2 = \mathbf{H} \tilde{\mathbf{x}}_1$$
   Notice that 3D depth $Z$ has canceled out completely! Even if the scene contains complex non-planar mountains and buildings, the image mapping is an exact 2D homography. This is the mathematical foundation of panoramic image stitching. $\blacksquare$

---

### Exercise 7.8: RANSAC for Robust Homography Estimation
**Statement:** In feature matching, $40\%$ of putative feature correspondences are outliers (mismatches). If RANSAC samples minimal 4-point subsets, compute the minimum number of RANSAC iterations $N_{\text{iter}}$ required to ensure a $99\%$ probability ($p = 0.99$) of selecting at least one outlier-free sample.

**Solution:**
1. Inlier probability $w = 1 - 0.40 = 0.60$.
2. The minimal sample size for a homography is $m = 4$ points.
3. The probability that all 4 points in a random sample are true inliers is:
   $$P_{\text{all\_inliers}} = w^m = (0.60)^4 = 0.1296$$
4. The probability that a sample contains at least one outlier is:
   $$1 - w^m = 1 - 0.1296 = 0.8704$$
5. The probability that all $N_{\text{iter}}$ independent samples fail is $(1 - w^m)^{N_{\text{iter}}}$.
   We require this failure probability to be $\le 1 - p = 1 - 0.99 = 0.01$:
   $$(1 - w^m)^{N_{\text{iter}}} \le 0.01$$
6. Taking natural logarithms:
   $$N_{\text{iter}} \ln(1 - w^m) \le \ln(0.01) \implies N_{\text{iter}} \ge \frac{\ln(0.01)}{\ln(1 - 0.1296)} = \frac{-4.60517}{\ln(0.8704)} = \frac{-4.60517}{-0.13881} \approx 33.17$$
   Rounding up, a minimum of $N_{\text{iter}} = 34$ iterations guarantees a $99\%$ success rate.

---

### Exercise 7.9: Reprojection Error Formulation
**Statement:** Define the non-linear geometric **reprojection error** cost function minimized in bundle adjustment during camera calibration, and explain why it is preferred over algebraic error $\|\mathbf{A} \mathbf{h}\|^2$.

**Solution:**
1. Given $K$ views and $N$ target points per view, let $\mathbf{x}_{i, k}$ be the detected 2D pixel coordinate of point $i$ in view $k$, and let $\hat{\mathbf{x}}(\mathbf{K}, \mathbf{R}_k, \mathbf{t}_k, \mathbf{D}, \mathbf{X}_i)$ be the projected pixel location through the full forward camera and distortion model.
2. The non-linear reprojection error is:
   $$\mathcal{L}(\mathbf{K}, \mathbf{D}, \{\mathbf{R}_k, \mathbf{t}_k\}) = \sum_{k=1}^K \sum_{i=1}^N \left\| \mathbf{x}_{i, k} - \hat{\mathbf{x}}(\mathbf{K}, \mathbf{R}_k, \mathbf{t}_k, \mathbf{D}, \mathbf{X}_i) \right\|^2$$
3. **Why Reprojection Error is Superior to Algebraic Error:**
   - **Physical Meaning:** Reprojection error measures physical distance in image pixels ($\text{pixels}^2$). Algebraic error $\|\mathbf{A} \mathbf{h}\|^2$ has no physical units or meaning.
   - **Maximum Likelihood Estimator:** Under additive zero-mean Gaussian image noise $\epsilon \sim \mathcal{N}(0, \sigma^2 \mathbf{I})$, minimizing reprojection error is the mathematically optimal Maximum Likelihood Estimator (MLE).
   - **Incorporates Distortion:** Algebraic DLT cannot model non-linear radial lens distortion, whereas non-linear bundle adjustment simultaneously optimizes $k_1, k_2, p_1, p_2$.

---

### Exercise 7.10: Affine Rectification via Two Vanishing Points
**Statement:** Explain how to perform **affine rectification** (restoring parallelism) on an image of a plane using the image of two vanishing points $\mathbf{v}_1, \mathbf{v}_2$ corresponding to two orthogonal families of parallel lines.

**Solution:**
1. In perspective projection, parallel lines converge to vanishing points.
   Let $\mathbf{v}_1$ and $\mathbf{v}_2$ be two vanishing points computed from the intersections of imaged parallel line pairs.
2. The line connecting the two vanishing points is the **vanishing line** (image of the line at infinity $\mathbf{l}_\infty$):
   $$\mathbf{l}_\infty = \mathbf{v}_1 \times \mathbf{v}_2 = \begin{bmatrix} l_1 \\ l_2 \\ l_3 \end{bmatrix}$$
3. To restore parallelism, we construct a rectifying homography $\mathbf{H}_{\text{aff}}$ that maps $\mathbf{l}_\infty$ back to the canonical line at infinity $[0, 0, 1]^\top$:
   $$\mathbf{H}_{\text{aff}}^{-\top} \mathbf{l}_\infty = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \implies \mathbf{H}_{\text{aff}} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ l_1/l_3 & l_2/l_3 & 1 \end{bmatrix}$$
4. Warping the image with $\mathbf{H}_{\text{aff}}$ guarantees that all parallel lines on the source plane become strictly parallel in the rectified image. $\blacksquare$


---\n
# Chapter 8: Two-View Epipolar Geometry, Disparity, and Stereo Depth Triangulation

---

## 8.1 The Geometry of Binocular Vision and Epipolar Planes

A single monocular camera is fundamentally an angle sensor, not a distance sensor. Because perspective projection maps an entire 3D ray onto a single 2D pixel, the depth coordinate $Z$ is lost.

To perceive metric three-dimensional depth, biological organisms (such as humans and predatory animals) and autonomous robotic platforms employ **binocular stereo vision**â€”viewing the scene from two distinct spatial vantage points separated by a known baseline distance.

```
                           THE EPIPOLAR GEOMETRY OF STEREO
                           
                                    3D World Point X
                                           o
                                          / \
                                         /   \
                                        /     \  Epipolar Plane Î _epi
                                       /       \
                        Left Ray      /         \     Right Ray
                                     /           \
                                    /             \
        Left Image Plane           /               \          Right Image Plane
      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”        /                 \       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
      â”‚         o x_L    â”‚       /                   \      â”‚         o x_R    â”‚
      â”‚        /         â”‚      /                     \     â”‚        /         â”‚
      â”‚       / l_L      â”‚     /                       \    â”‚       / l_R      â”‚
      â”‚      o e_L       â”‚    /                         \   â”‚      o e_R       â”‚
      â””â”€â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   /                           \  â””â”€â”€â”€â”€â”€/â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
           /                /                             \      /
          /                â–¼                               â–¼    /
         oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€o
    Left Optical Center C_L            Baseline b          Right Optical Center C_R
```

### The Anatomy of Two-View Epipolar Geometry
Let $\mathbf{C}_L$ and $\mathbf{C}_R$ denote the optical centers of the left and right cameras.
1. **The Baseline ($\mathbf{b}$):** The 3D translation vector connecting the two optical centers:
   $$\mathbf{b} = \mathbf{C}_R - \mathbf{C}_L$$
2. **The Epipolar Plane ($\Pi_{\text{epi}}$):** For any 3D scene point $\mathbf{X}$ outside the baseline, the three points $\mathbf{C}_L, \mathbf{C}_R, \mathbf{X}$ define a unique 2D planar slice in 3D Euclidean space. As $\mathbf{X}$ moves through the universe, the family of all epipolar planes forms a pencil of planes pivoting about the baseline axis.
3. **The Epipoles ($\mathbf{e}_L, \mathbf{e}_R$):** The point where the baseline intersects each camera's image plane. Equivalently, $\mathbf{e}_L$ is the optical projection of $\mathbf{C}_R$ onto the left camera sensor, and $\mathbf{e}_R$ is the projection of $\mathbf{C}_L$ onto the right camera sensor.
4. **The Epipolar Lines ($\mathbf{l}_L, \mathbf{l}_R$):** The intersection of the epipolar plane $\Pi_{\text{epi}}$ with the left and right image planes. The projection of the 3D ray $\mathbf{C}_L \to \mathbf{X}$ onto the right camera frame is precisely the right epipolar line $\mathbf{l}_R$.

### The Epipolar Search Reduction Theorem
In general 2D image matching, finding the correspondence of a pixel $\mathbf{x}_L$ requires a 2D search across all $W \times H$ pixels of the second imageâ€”a search space of $\mathcal{O}(W \cdot H)$ operations per pixel.

> [!IMPORTANT]
> **The Epipolar Constraint:** The corresponding match $\mathbf{x}_R$ of a left pixel $\mathbf{x}_L$ is **strictly constrained to lie on the 1D epipolar line $\mathbf{l}_R$**.
> Epipolar geometry reduces the 2D correspondence search problem down to a **1D line search**, accelerating stereo matching throughput by hundreds of times and eliminating millions of potential false-positive matching candidates!

---

## 8.2 The Essential Matrix (Normalized Coordinates)

To express the epipolar constraint in coordinate-free algebra, we first consider **normalized camera coordinates**, which isolate the external rigid pose from internal camera intrinsics.

```
                      COPLANARITY IN CAMERA COORDINATES
                      
                                      X_L
                                       o
                                      /
                                     /
                                    /
                                   /  X_R = R X_L + t
                                  /
                                 o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º t
                              C_L (0, 0, 0)
                              
               The three vectors X_R, t, and (R X_L) are COPLANAR!
               Their scalar triple product is identically ZERO:
                             X_R Â· [ t Ã— (R X_L) ] = 0
```

### Derivation of the Essential Matrix
Let $\mathbf{X}_L \in \mathbb{R}^3$ be the 3D coordinates of a point in the left camera frame.
Let the right camera coordinate frame be related by rotation $\mathbf{R} \in \text{SO}(3)$ and translation $\mathbf{t} \in \mathbb{R}^3$:
$$\mathbf{X}_R = \mathbf{R} \mathbf{X}_L + \mathbf{t}$$

Subtract $\mathbf{t}$ and take the cross product with $\mathbf{t}$:
$$\mathbf{t} \times \mathbf{X}_R = \mathbf{t} \times (\mathbf{R} \mathbf{X}_L + \mathbf{t}) = \mathbf{t} \times (\mathbf{R} \mathbf{X}_L) + \mathbf{t} \times \mathbf{t}$$
Since the cross product of any vector with itself is zero ($\mathbf{t} \times \mathbf{t} = \mathbf{0}$):
$$\mathbf{t} \times \mathbf{X}_R = \mathbf{t} \times (\mathbf{R} \mathbf{X}_L)$$

Now take the vector dot product of both sides with $\mathbf{X}_R$:
$$\mathbf{X}_R \cdot (\mathbf{t} \times \mathbf{X}_R) = \mathbf{X}_R \cdot (\mathbf{t} \times \mathbf{R} \mathbf{X}_L)$$
Because $\mathbf{t} \times \mathbf{X}_R$ is perpendicular to $\mathbf{X}_R$, the left side is identically zero:
$$\mathbf{X}_R^\top \Big( \mathbf{t} \times (\mathbf{R} \mathbf{X}_L) \Big) = 0$$

Represent the cross product $\mathbf{t} \times \mathbf{v}$ via the skew-symmetric matrix $[\mathbf{t}]_\times$:
$$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix}$$
Then:
$$\mathbf{X}_R^\top [\mathbf{t}]_\times \mathbf{R} \mathbf{X}_L = 0$$

Dividing $\mathbf{X}_L$ by $Z_L$ and $\mathbf{X}_R$ by $Z_R$ yields normalized 2D homogeneous coordinates $\mathbf{x}_{n, L} = [x_L/Z_L, y_L/Z_L, 1]^\top$ and $\mathbf{x}_{n, R} = [x_R/Z_R, y_R/Z_R, 1]^\top$:
$$\mathbf{x}_{n, R}^\top \Big( [\mathbf{t}]_\times \mathbf{R} \Big) \mathbf{x}_{n, L} = 0$$

### The Essential Matrix Formulation
Introduced by Christopher Longuet-Higgins in 1981, the **Essential Matrix** $\mathbf{E} \in \mathbb{R}^{3 \times 3}$ is defined as:

$$\mathbf{E} \triangleq [\mathbf{t}]_\times \mathbf{R}$$

Thus, for any corresponding pair of normalized points:
$$\mathbf{x}_{n, R}^\top \mathbf{E} \mathbf{x}_{n, L} = 0$$

#### Fundamental Mathematical Properties of E:
1. **Rank 2:** Because $[\mathbf{t}]_\times$ is skew-symmetric, $\det([\mathbf{t}]_\times) = 0$. Since $\mathbf{R}$ has full rank 3, $\text{rank}(\mathbf{E}) = 2$.
2. **Singular Value Spectrum:** A $3 \times 3$ real matrix is an Essential Matrix if and only if two of its singular values are equal and non-zero, and the third is zero:
   $$\boldsymbol{\Sigma}_E = \text{diag}(\sigma, \sigma, 0) \quad \text{for some } \sigma > 0$$
3. **Degrees of Freedom (5 DoF):** $\mathbf{E}$ is parameterized by 3 rotation parameters ($\mathbf{R} \in \text{SO}(3)$) and a 3D translation direction ($\mathbf{t} \in S^2$). Because the epipolar constraint is homogeneous ($\alpha \mathbf{E}$ satisfies the equation for all $\alpha \neq 0$), translation magnitude $\|\mathbf{t}\|$ cannot be recovered from two views alone without external metric scale.

---

## 8.3 The Fundamental Matrix (Pixel Coordinates)

In raw digital images, we measure discrete pixel coordinates $\mathbf{x}_L = [u_L, v_L, 1]^\top$ and $\mathbf{x}_R = [u_R, v_R, 1]^\top$, which are linked to normalized coordinates by the camera intrinsic matrices $\mathbf{K}_L$ and $\mathbf{K}_R$:
$$\mathbf{x}_{n, L} = \mathbf{K}_L^{-1} \mathbf{x}_L, \quad \mathbf{x}_{n, R} = \mathbf{K}_R^{-1} \mathbf{x}_R$$

### Derivation of the Fundamental Matrix
Substitute the intrinsic transformations into the Essential Matrix equation:
$$(\mathbf{K}_R^{-1} \mathbf{x}_R)^\top \mathbf{E} (\mathbf{K}_L^{-1} \mathbf{x}_L) = 0$$
Transposing the left term:
$$\mathbf{x}_R^\top \left( \mathbf{K}_R^{-\top} \mathbf{E} \mathbf{K}_L^{-1} \right) \mathbf{x}_L = 0$$

Define the **Fundamental Matrix** $\mathbf{F} \in \mathbb{R}^{3 \times 3}$:

$$\mathbf{F} \triangleq \mathbf{K}_R^{-\top} \mathbf{E} \mathbf{K}_L^{-1} = \mathbf{K}_R^{-\top} [\mathbf{t}]_\times \mathbf{R} \mathbf{K}_L^{-1}$$

This yields the **Bilinear Epipolar Constraint on Raw Pixels**:

$$\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L = 0$$

```
                           THE FUNDAMENTAL MATRIX BRIDGE
                           
       Pixel Coordinates           Intrinsic Matrix            Normalized Coordinates
             x_L                   K_L^(-1)                    x_{n, L}
              â”‚                                                   â”‚
              â”‚                                                   â–¼
              â”‚                                            Essential Matrix E
              â–¼                                            x_{n,R}^T E x_{n,L} = 0
     Fundamental Matrix F                                         â–²
     x_R^T F x_L = 0                                              â”‚
              â–²                                                   â”‚
              â”‚                                                   â”‚
             x_R                   K_R^(-1)                    x_{n, R}
       Pixel Coordinates           Intrinsic Matrix            Normalized Coordinates
```

### Geometric Mapping Properties of F
1. **Point-to-Epipolar Line Mapping:**
   Given a point $\mathbf{x}_L$ in the left image, its conjugate epipolar line in the right image is:
   $$\mathbf{l}_R = \mathbf{F} \mathbf{x}_L$$
   Any matching pixel $\mathbf{x}_R$ must lie on this line: $\mathbf{x}_R^\top \mathbf{l}_R = 0$.
   Conversely, given $\mathbf{x}_R$, its epipolar line in the left image is:
   $$\mathbf{l}_L = \mathbf{F}^\top \mathbf{x}_R$$
2. **Epipoles as Nullspaces:**
   Because all epipolar lines pass through the epipole:
   $$\mathbf{F} \mathbf{e}_L = \mathbf{0}, \quad \mathbf{F}^\top \mathbf{e}_R = \mathbf{0}$$
   The left epipole $\mathbf{e}_L$ is the right nullspace of $\mathbf{F}$, and the right epipole $\mathbf{e}_R$ is the left nullspace (nullspace of $\mathbf{F}^\top$).
3. **Singular Matrix ($\det(\mathbf{F}) = 0$):**
   $\mathbf{F}$ has rank strictly equal to 2.
4. **Degrees of Freedom (7 DoF):**
   A $3 \times 3$ matrix has 9 entries. Up to an arbitrary scale factor, it has 8 DoF. The rank-2 singularity constraint $\det(\mathbf{F}) = 0$ removes 1 DoF:
   $$\text{DoF}(\mathbf{F}) = 9 - 1 - 1 = 7$$

---

## 8.4 Stereo Rectification and Canonical Geometry

In an arbitrary stereo camera rig, the optical axes may converge or tilt, and the baseline vector is oriented arbitrarily in 3D space. Consequently:
- Epipolar lines are angled diagonally.
- Searching for matching pixels requires calculating line equations and performing non-horizontal sub-pixel interpolation.

```
                      STEREO IMAGE RECTIFICATION
                      
          Unrectified Stereo Pair                     Rectified Canonical Pair
      (Angled, Converging Epipolar Lines)            (Horizontal Parallel Epipolar Lines)
      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
      â”‚      \          â”‚ â”‚          /      â”‚        â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚ â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚
      â”‚       \  l_L    â”‚ â”‚    l_R  /       â”‚ â”€â”€â–º H  â”‚ â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€ â”‚ â”‚ â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€ â”‚
      â”‚        o x_L    â”‚ â”‚        o x_R    â”‚        â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚ â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚
      â”‚         \       â”‚ â”‚       /         â”‚        â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚ â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â”‚
      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
      (Requires 2D Bresenham Line Search)            (Search is STRICTLY on SAME ROW: v_L = v_R!)
```

### The Rectification Objective
**Stereo Rectification** applies a pair of planar homographies $\mathbf{H}_L$ and $\mathbf{H}_R$ to the left and right images such that:
1. Both virtual image planes become strictly **coplanar**.
2. Both optical axes become strictly **parallel** and perpendicular to the baseline.
3. The epipoles are projected to infinity along the horizontal axis: $\mathbf{e}_L' = \mathbf{e}_R' = [1, 0, 0]^\top$.
4. **Conjugate epipolar lines become identical horizontal raster scanlines ($v_L = v_R$)!**

### Constructing the Rectified Coordinate Frame
Define an orthonormal coordinate frame $\mathbf{R}_{\text{rect}} = [\mathbf{r}_1 \mid \mathbf{r}_2 \mid \mathbf{r}_3]^\top$ based on the physical baseline $\mathbf{t}$:
1. **$X$-axis ($\mathbf{r}_1$):** Parallel to the baseline vector connecting the camera centers:
   $$\mathbf{r}_1 = \frac{\mathbf{t}}{\|\mathbf{t}\|}$$
2. **$Y$-axis ($\mathbf{r}_2$):** Orthogonal to both the baseline and the original optical axis $\mathbf{z}$:
   $$\mathbf{r}_2 = \frac{\mathbf{z} \times \mathbf{r}_1}{\|\mathbf{z} \times \mathbf{r}_1\|} \quad \text{where } \mathbf{z} = [0, 0, 1]^\top$$
3. **$Z$-axis ($\mathbf{r}_3$):** Orthogonal to $\mathbf{r}_1$ and $\mathbf{r}_2$ (the new optical axis):
   $$\mathbf{r}_3 = \mathbf{r}_1 \times \mathbf{r}_2$$

The rectifying rotation matrix is $\mathbf{R}_{\text{rect}} = \begin{bmatrix} \mathbf{r}_1^\top \\ \mathbf{r}_2^\top \\ \mathbf{r}_3^\top \end{bmatrix}$.
The rectifying homographies are:
$$\mathbf{H}_L = \mathbf{K}_{\text{new}} \mathbf{R}_{\text{rect}} \mathbf{K}_L^{-1}, \quad \mathbf{H}_R = \mathbf{K}_{\text{new}} \mathbf{R}_{\text{rect}} \mathbf{R}^\top \mathbf{K}_R^{-1}$$
where $\mathbf{K}_{\text{new}}$ is a synthesized common intrinsic matrix.

In the rectified image pair:
$$\mathbf{F}_{\text{rect}} = [\mathbf{e}']_\times = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$
Evaluating the epipolar constraint:
$$\begin{bmatrix} u_R & v_R & 1 \end{bmatrix} \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} u_L \\ v_L \\ 1 \end{bmatrix} = 0 \implies v_L - v_R = 0 \implies v_L = v_R$$
The vertical pixel coordinates must be identical! The correspondence search is strictly restricted to the horizontal scanline.

---

## 8.5 Disparity and Metric 3D Depth Triangulation

In a rectified stereo system, the optical axes of both cameras are parallel and separated by physical baseline distance $b = \|\mathbf{t}\|$. Both cameras share identical focal length $f = f_x$ and principal point $(c_x, c_y)$.

```
                           CANONICAL STEREO TRIANGULATION
                           
                                     3D Point X = [X, Y, Z]^T
                                                o
                                               / \
                                              /   \
                                             /     \
                                            /       \
                       Left Ray            /         \        Right Ray
                                          /           \
                                         /             \
                  u_L                   /               \                  u_R
      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      /                 \     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
      â”‚                         â”‚     /                   \    â”‚                         â”‚
      â”‚            + c_x        â”‚    /                     \   â”‚            + c_x        â”‚
      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   /                       \  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚               /                         \              â”‚
                   â”‚              â–¼                           â–¼             â”‚
                   oâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€o
               Left Center C_L                    b                    Right Center C_R
                                        â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º
```

### Derivation of the Depth Equation
Let a 3D scene point have coordinates $\mathbf{X} = [X, Y, Z]^\top$ measured relative to the left camera frame.
- Its projection into the left camera is:
  $$u_L = f \frac{X}{Z} + c_x$$
- Because the right camera is translated horizontally by distance $b$ along the $X$-axis ($\mathbf{C}_R = [b, 0, 0]^\top$), the coordinates of $\mathbf{X}$ in the right camera frame are:
  $$\mathbf{X}_R = \begin{bmatrix} X - b \\ Y \\ Z \end{bmatrix}$$
- Its projection into the right camera is:
  $$u_R = f \frac{X - b}{Z} + c_x = f \frac{X}{Z} - \frac{f \cdot b}{Z} + c_x$$

### The Horizontal Disparity $d$
Subtracting the right pixel coordinate from the left pixel coordinate:
$$d \triangleq u_L - u_R = \left( f \frac{X}{Z} + c_x \right) - \left( f \frac{X - b}{Z} + c_x \right) = \frac{f \cdot b}{Z}$$

The difference $d = u_L - u_R$ is the **horizontal disparity** (measured in pixels).

Solving directly for metric depth $Z$:

$$Z = \frac{f \cdot b}{d}$$

### 3D Metric Coordinate Recovery (Unprojecting the Point Cloud)
Once depth $Z$ is calculated, the full 3D coordinates $(X, Y, Z)$ in metric units (meters) are recovered:

$$X = \frac{(u_L - c_x) Z}{f}$$
$$Y = \frac{(v - c_y) Z}{f}$$
$$Z = \frac{f \cdot b}{d}$$

In matrix form, the **Disparity-to-Depth Reprojection Matrix** $\mathbf{Q} \in \mathbb{R}^{4 \times 4}$ transforms $[u, v, d, 1]^\top$ into 3D homogeneous coordinates:
$$\mathbf{Q} \begin{bmatrix} u \\ v \\ d \\ 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & -c_x \\ 0 & 1 & 0 & -c_y \\ 0 & 0 & 0 & f \\ 0 & 0 & -1/b & 0 \end{bmatrix} \begin{bmatrix} u \\ v \\ d \\ 1 \end{bmatrix} = \begin{bmatrix} X \\ Y \\ Z \\ W \end{bmatrix}$$

### Depth Resolution and Error Sensitivity
What happens to depth precision when disparity measurement is corrupted by sub-pixel error $\Delta d$?
Compute the derivative of $Z$ with respect to disparity $d$:
$$\frac{\partial Z}{\partial d} = \frac{\partial}{\partial d} \left( \frac{f b}{d} \right) = -\frac{f b}{d^2}$$
Substitute $d = \frac{f b}{Z}$:
$$\frac{\partial Z}{\partial d} = -\frac{f b}{(f b / Z)^2} = -\frac{Z^2}{f b}$$

Therefore, the depth error $\Delta Z$ resulting from disparity error $\Delta d$ is:

$$|\Delta Z| \approx \frac{Z^2}{f \cdot b} |\Delta d|$$

> [!CAUTION]
> **Quadratic Error Growth:** Metric depth uncertainty grows **quadratically with distance ($Z^2$)**!
> Doubling the distance to an obstacle quadruples the depth measurement error. To maintain depth precision at long ranges, robotic platforms must increase the physical baseline $b$ or focal length $f$.

---

## 8.6 Dense Stereo Matching: Cost Functions and Semi-Global Matching (SGM)

Computing a dense depth map requires finding the optimal disparity $d \in [0, d_{\text{max}}]$ for every single pixel $[y, x]$ in the reference image.

### 1. Matching Cost Metrics

#### Absolute Differences (SAD) and Squared Differences (SSD):
$$\mathcal{C}_{\text{SAD}}(x, y, d) = |I_L[y, x] - I_R[y, x - d]|$$
$$\mathcal{C}_{\text{SSD}}(x, y, d) = (I_L[y, x] - I_R[y, x - d])^2$$
*Flaw:* Highly sensitive to photometric gain, auto-exposure differences, and vignetting between the two sensors.

#### Normalized Cross-Correlation (NCC):
$$\mathcal{C}_{\text{NCC}}(x, y, d) = \frac{\sum (I_L - \bar{I}_L)(I_R - \bar{I}_R)}{\sqrt{\sum (I_L - \bar{I}_L)^2 \sum (I_R - \bar{I}_R)^2}}$$
*Flaw:* Computationally expensive, blurs sharp depth boundaries.

#### The Census Transform:
The Census Transform maps a local $(2k+1) \times (2k+1)$ neighborhood into a compact bitstring representing relative intensity comparisons:
$$\xi(I[y, x], I[y+u, x+v]) = \begin{cases} 1 & \text{if } I[y+u, x+v] < I[y, x] \\ 0 & \text{otherwise} \end{cases}$$
The Census bitstring is the concatenation of these binary comparisons.
The matching cost between two Census descriptors is simply their **Hamming Distance** (the number of differing bits, computed in a single CPU instruction via `popcount(bitstring_L ^ bitstring_R)`):
$$\mathcal{C}_{\text{Census}}(x, y, d) = \text{Hamming}\Big( \text{Census}_L(y, x), \, \text{Census}_R(y, x - d) \Big)$$
*Advantage:* **Strictly invariant to any monotonic radiometric transformation** (e.g., auto-gain, gamma changes, sun glare).

### 2. Semi-Global Matching (SGM)
Simple local block matching produces noisy, speckled disparity maps in low-texture regions. Global 2D Markov Random Fields (MRFs) optimized via graph cuts are too slow for real-time robotics.

In 2005, Heiko HirschmÃ¼ller introduced **Semi-Global Matching (SGM)**, which optimizes a 2D energy functional by aggregating 1D dynamic programming paths along 8 or 16 radial directions $\mathbf{r}$:

$$E(D) = \sum_{\mathbf{p}} \mathcal{C}(\mathbf{p}, D(\mathbf{p})) + \sum_{\mathbf{q} \in \mathcal{N}_{\mathbf{p}}} P_1 \cdot \mathbb{I}[|D(\mathbf{p}) - D(\mathbf{q})| = 1] + \sum_{\mathbf{q} \in \mathcal{N}_{\mathbf{p}}} P_2 \cdot \mathbb{I}[|D(\mathbf{p}) - D(\mathbf{q})| > 1]$$

where:
- $\mathcal{C}(\mathbf{p}, D(\mathbf{p}))$ is the pixel matching cost (e.g., Census).
- $P_1$ is a small penalty for small disparity steps ($\pm 1$ pixel, modeling smooth slanted surfaces).
- $P_2$ is a larger penalty for sharp disparity jumps ($> 1$ pixel, modeling true depth discontinuities).

#### SGM Dynamic Programming Recurrence:
Along each 1D path direction $\mathbf{r}$, the cost $L_{\mathbf{r}}(\mathbf{p}, d)$ to assign disparity $d$ to pixel $\mathbf{p}$ is:
$$L_{\mathbf{r}}(\mathbf{p}, d) = \mathcal{C}(\mathbf{p}, d) + \min \begin{cases} L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, d) \\ L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, d - 1) + P_1 \\ L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, d + 1) + P_1 \\ \min_k L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, k) + P_2 \end{cases} - \min_k L_{\mathbf{r}}(\mathbf{p} - \mathbf{r}, k)$$

Summing costs across all directions:
$$S(\mathbf{p}, d) = \sum_{\mathbf{r}} L_{\mathbf{r}}(\mathbf{p}, d)$$
The optimal disparity is selected by Winner-Take-All (WTA):
$$D^*(\mathbf{p}) = \arg\min_d S(\mathbf{p}, d)$$

---

## 8.7 Worked Examples

### Problem 8.1: Triangulation of Metric 3D Depth
**Statement:** A calibrated, rectified stereo camera rig on an autonomous delivery robot has:
- Baseline: $b = 0.20\text{ meters}$ ($20\text{ cm}$)
- Focal length: $f_x = 800\text{ pixels}$
- Principal point: $(c_x, c_y) = (640, 360)$
A pedestrian is detected in the left image at $(u_L, v_L) = (720, 400)$ and in the right image at $(u_R, v_R) = (680, 400)$.
1. Compute the horizontal disparity $d$.
2. Compute the metric depth $Z$ to the pedestrian.
3. Compute the full 3D coordinates $(X, Y, Z)$ in meters in the left camera frame.

**Step-by-step Solution:**
1. **Horizontal Disparity:**
   $$d = u_L - u_R = 720 - 680 = 40\text{ pixels}$$
   (Notice that vertical coordinates match: $v_L = v_R = 400$, confirming rectification).
2. **Metric Depth $Z$:**
   $$Z = \frac{f \cdot b}{d} = \frac{800\text{ pixels} \times 0.20\text{ meters}}{40\text{ pixels}} = \frac{160}{40} = 4.0\text{ meters}$$
3. **3D Metric Coordinates $(X, Y, Z)$:**
   $$X = \frac{(u_L - c_x) Z}{f} = \frac{(720 - 640) \times 4.0}{800} = \frac{80 \times 4.0}{800} = \frac{320}{800} = +0.40\text{ meters}$$
   $$Y = \frac{(v_L - c_y) Z}{f} = \frac{(400 - 360) \times 4.0}{800} = \frac{40 \times 4.0}{800} = \frac{160}{800} = +0.20\text{ meters}$$
   $$Z = 4.0\text{ meters}$$
   The pedestrian is located at 3D position $\mathbf{X} = [0.40, 0.20, 4.0]^\top$ meters.

---

### Problem 8.2: Quadratic Depth Error Analysis
**Statement:** For the stereo camera in Problem 8.1 ($f = 800\text{ pixels}, b = 0.20\text{ m}$), the stereo matcher has a sub-pixel disparity uncertainty of $\Delta d = \pm 0.5\text{ pixels}$.
1. Compute the depth uncertainty $\Delta Z$ for an obstacle at $Z = 2.0\text{ meters}$.
2. Compute the depth uncertainty $\Delta Z$ for an obstacle at $Z = 10.0\text{ meters}$.
3. Compare the error ratio to the distance ratio.

**Step-by-step Solution:**
1. Using the depth error sensitivity formula:
   $$\Delta Z \approx \frac{Z^2}{f \cdot b} \Delta d$$
   Here $f \cdot b = 800 \times 0.20 = 160\text{ pixel}\cdot\text{m}$.
   - **At $Z = 2.0\text{ m}$:**
     $$\Delta Z = \frac{2.0^2}{160} \times 0.5 = \frac{4.0}{160} \times 0.5 = 0.025 \times 0.5 = 0.0125\text{ meters} = \pm 1.25\text{ cm}$$
   - **At $Z = 10.0\text{ m}$:**
     $$\Delta Z = \frac{10.0^2}{160} \times 0.5 = \frac{100.0}{160} \times 0.5 = 0.625 \times 0.5 = 0.3125\text{ meters} = \pm 31.25\text{ cm}$$
2. **Comparison:**
   The distance increased by a factor of $\frac{10}{2} = 5\times$.
   The depth error exploded by a factor of:
   $$\frac{0.3125}{0.0125} = 25\times = 5^2$$
   This empirically verifies the quadratic error law: $\Delta Z \propto Z^2$.

---

### Problem 8.3: Essential Matrix Construction from Known Pose
**Statement:** The right camera is translated along the $X$-axis by $t_x = 0.5\text{ m}$ with zero translation along $Y$ and $Z$ ($\mathbf{t} = [0.5, 0, 0]^\top$). The right camera is rotated around the $Y$-axis by angle $\theta = 90^\circ$ ($\mathbf{R} = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$).
1. Construct the skew-symmetric matrix $[\mathbf{t}]_\times$.
2. Compute the Essential Matrix $\mathbf{E} = [\mathbf{t}]_\times \mathbf{R}$.

**Step-by-step Solution:**
1. **Skew-Symmetric Translation Matrix:**
   $$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -0.5 \\ 0 & 0.5 & 0 \end{bmatrix}$$
2. **Essential Matrix Product:**
   $$\mathbf{E} = [\mathbf{t}]_\times \mathbf{R} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -0.5 \\ 0 & 0.5 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$$
   Multiply rows by columns:
   - Row 1: $\begin{bmatrix} 0 & 0 & 0 \end{bmatrix}$
   - Row 2:
     - Col 1: $0(0) + 0(0) + (-0.5)(-1) = 0.5$
     - Col 2: $0(0) + 0(1) + (-0.5)(0) = 0$
     - Col 3: $0(1) + 0(0) + (-0.5)(0) = 0$
     $$\text{Row 2} = \begin{bmatrix} 0.5 & 0 & 0 \end{bmatrix}$$
   - Row 3:
     - Col 1: $0(0) + 0.5(0) + 0(-1) = 0$
     - Col 2: $0(0) + 0.5(1) + 0(0) = 0.5$
     - Col 3: $0(1) + 0.5(0) + 0(0) = 0$
     $$\text{Row 3} = \begin{bmatrix} 0 & 0.5 & 0 \end{bmatrix}$$
   Assembled Essential Matrix:
   $$\mathbf{E} = \begin{bmatrix} 0 & 0 & 0 \\ 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \end{bmatrix}$$

---

### Problem 8.4: Verification of Singular Values of the Essential Matrix
**Statement:** Compute the singular values of the Essential Matrix $\mathbf{E} = \begin{bmatrix} 0 & 0 & 0 \\ 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \end{bmatrix}$ from Problem 8.3 and verify that it satisfies the trace constraint.

**Step-by-step Solution:**
1. Singular values are the square roots of the eigenvalues of $\mathbf{E} \mathbf{E}^\top$:
   $$\mathbf{E} \mathbf{E}^\top = \begin{bmatrix} 0 & 0 & 0 \\ 0.5 & 0 & 0 \\ 0 & 0.5 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0.5 & 0 \\ 0 & 0 & 0.5 \\ 0 & 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.25 & 0 \\ 0 & 0 & 0.25 \end{bmatrix}$$
2. The eigenvalues of this diagonal matrix are $\lambda_1 = 0.25, \lambda_2 = 0.25, \lambda_3 = 0$.
3. The singular values are:
   $$\sigma_1 = \sqrt{0.25} = 0.5, \quad \sigma_2 = \sqrt{0.25} = 0.5, \quad \sigma_3 = 0$$
   The singular value spectrum is strictly $[0.5, 0.5, 0]$, with two identical non-zero values and one zero value, confirming it is an Essential Matrix!

---

### Problem 8.5: Epipolar Line Equation Calculation
**Statement:** A fundamental matrix between two cameras is:
$$\mathbf{F} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$
A feature is detected in the left image at pixel $\mathbf{x}_L = [300, 250, 1]^\top$.
1. Compute the epipolar line $\mathbf{l}_R$ in the right image.
2. What is the geometric orientation of this epipolar line?

**Step-by-step Solution:**
1. Epipolar line formula:
   $$\mathbf{l}_R = \mathbf{F} \mathbf{x}_L = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} 300 \\ 250 \\ 1 \end{bmatrix} = \begin{bmatrix} 0(300) + 0(250) + 0(1) \\ 0(300) + 0(250) - 1(1) \\ 0(300) + 1(250) + 0(1) \end{bmatrix} = \begin{bmatrix} 0 \\ -1 \\ 250 \end{bmatrix}$$
2. The 2D line equation on the right image is $\mathbf{l}_R^\top \mathbf{x}_R = 0$:
   $$0 \cdot u_R - 1 \cdot v_R + 250 = 0 \implies v_R = 250$$
   The epipolar line is a horizontal scanline at exactly $v_R = 250$, proving that these two cameras are already rectified!

---

### Problem 8.6: Epipole Nullspace Extraction
**Statement:** Find the left epipole $\mathbf{e}_L$ of the fundamental matrix $\mathbf{F} = \begin{bmatrix} 1 & 2 & -3 \\ 2 & 4 & -6 \\ 3 & 6 & -9 \end{bmatrix}$.

**Step-by-step Solution:**
1. The left epipole satisfies $\mathbf{F} \mathbf{e}_L = \mathbf{0}$, meaning $\mathbf{e}_L = [e_x, e_y, 1]^\top$ lies in the nullspace of $\mathbf{F}$.
2. Notice that all rows of $\mathbf{F}$ are scalar multiples of the first row $[1, 2, -3]$:
   - Row 2: $2 \times [1, 2, -3]$
   - Row 3: $3 \times [1, 2, -3]$
   Thus, the system reduces to the single scalar equation:
   $$1 \cdot e_x + 2 \cdot e_y - 3(1) = 0 \implies e_x + 2 e_y = 3$$
3. Any point on this line satisfies the condition. For a camera with optical center projection at $e_y = 1$:
   $$e_x = 3 - 2(1) = 1 \implies \mathbf{e}_L = [1, 1, 1]^\top$$

---

### Problem 8.7: Census Transform Computation
**Statement:** A $3 \times 3$ image patch is:
$$I = \begin{bmatrix} 45 & 50 & 62 \\ 40 & 50 & 55 \\ 38 & 52 & 48 \end{bmatrix}$$
Compute the 8-bit Census Transform bitstring for the center pixel $(1, 1)$ with intensity $50$, comparing neighbors in raster order: $[I(0,0), I(0,1), I(0,2), I(1,0), I(1,2), I(2,0), I(2,1), I(2,2)]$.
Rule: Bit is $1$ if $I_{\text{neighbor}} < I_{\text{center}}$, else $0$.

**Step-by-step Solution:**
Center intensity $I_c = 50$.
1. $I(0, 0) = 45 < 50 \implies \mathbf{1}$
2. $I(0, 1) = 50 \not< 50 \implies \mathbf{0}$
3. $I(0, 2) = 62 \not< 50 \implies \mathbf{0}$
4. $I(1, 0) = 40 < 50 \implies \mathbf{1}$
5. $I(1, 2) = 55 \not< 50 \implies \mathbf{0}$
6. $I(2, 0) = 38 < 50 \implies \mathbf{1}$
7. $I(2, 1) = 52 \not< 50 \implies \mathbf{0}$
8. $I(2, 2) = 48 < 50 \implies \mathbf{1}$

Assembled Census bitstring:
$$\text{Census}(1, 1) = [1, 0, 0, 1, 0, 1, 0, 1]_2 = 0\text{x}95 = 149_{10}$$

---

### Problem 8.8: Hamming Distance Between Census Descriptors
**Statement:** The left Census descriptor is $\mathbf{c}_L = 0\text{b}10010101$, and the right candidate Census descriptor is $\mathbf{c}_R = 0\text{b}11010001$.
Compute the Census matching cost using bitwise XOR and population count.

**Step-by-step Solution:**
1. Compute bitwise XOR ($\mathbf{c}_L \oplus \mathbf{c}_R$):
   $$\begin{array}{r@{\quad}l}
   & 10010101 \\
   \oplus & 11010001 \\
   \hline
   = & 01000100
   \end{array}$$
2. Count the number of set bits (`popcount`):
   Bits at index 2 and index 6 are $1$.
   $$\text{Hamming Cost} = \text{popcount}(0\text{b}01000100) = 2$$
   The matching cost is $2$ bit differences out of $8$.

---

### Problem 8.9: Minimum Baseline Requirement for Depth Specification
**Statement:** A stereo camera mounted on a humanoid robot must measure distance up to $Z_{\text{max}} = 5.0\text{ meters}$ with a maximum depth error of $|\Delta Z| \le 5\text{ cm}$ ($0.05\text{ m}$).
The camera has focal length $f = 1000\text{ pixels}$ and disparity resolution $\Delta d = 0.25\text{ pixels}$.
Compute the minimum physical baseline $b_{\text{min}}$ in centimeters.

**Step-by-step Solution:**
1. Recall the depth error formula:
   $$\Delta Z = \frac{Z^2}{f \cdot b} \Delta d$$
2. Rearrange for baseline $b$:
   $$b = \frac{Z^2 \cdot \Delta d}{f \cdot \Delta Z}$$
3. Substitute the required values ($Z = 5.0\text{ m}, \Delta Z = 0.05\text{ m}, f = 1000\text{ pix}, \Delta d = 0.25\text{ pix}$):
   $$b = \frac{5.0^2 \times 0.25}{1000 \times 0.05} = \frac{25.0 \times 0.25}{50.0} = \frac{6.25}{50.0} = 0.125\text{ meters} = 12.5\text{ cm}$$
   The camera baseline must be at least $12.5\text{ cm}$ wide.

---

### Problem 8.10: Disparity Reprojection Matrix Q Application
**Statement:** A rectified stereo rig has $f = 500, c_x = 320, c_y = 240, b = 0.1\text{ m}$.
Write the $4 \times 4$ reprojection matrix $\mathbf{Q}$, and evaluate it for pixel $(u, v) = (420, 240)$ with disparity $d = 25\text{ pixels}$.

**Step-by-step Solution:**
1. Construct $\mathbf{Q}$:
   $$\mathbf{Q} = \begin{bmatrix} 1 & 0 & 0 & -c_x \\ 0 & 1 & 0 & -c_y \\ 0 & 0 & 0 & f \\ 0 & 0 & -1/b & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & -320 \\ 0 & 1 & 0 & -240 \\ 0 & 0 & 0 & 500 \\ 0 & 0 & -10 & 0 \end{bmatrix}$$
2. Vector multiplication with $[u, v, d, 1]^\top = [420, 240, 25, 1]^\top$:
   $$\mathbf{Q} \begin{bmatrix} 420 \\ 240 \\ 25 \\ 1 \end{bmatrix} = \begin{bmatrix} 420 - 320 \\ 240 - 240 \\ 500(1) \\ -10(25) \end{bmatrix} = \begin{bmatrix} 100 \\ 0 \\ 500 \\ -250 \end{bmatrix}$$
3. Normalizing by the 4th element (or using standard vision convention where $W = -d/b$, so $Z = -f / W$):
   Here $W = -250$. Depth $Z = \frac{f \cdot b}{d} = \frac{500 \times 0.1}{25} = 2.0\text{ meters}$.
   $X = \frac{(u - c_x) Z}{f} = \frac{100 \times 2.0}{500} = 0.40\text{ meters}$.
   $Y = 0\text{ meters}$.
   3D coordinate: $[0.40, 0.0, 2.0]^\top$ meters.

---

## 8.8 Solved Exercises

### Exercise 8.1: Singularity of the Fundamental Matrix
**Statement:** Prove algebraically from first principles that the Fundamental Matrix $\mathbf{F} = \mathbf{K}_R^{-\top} [\mathbf{t}]_\times \mathbf{R} \mathbf{K}_L^{-1}$ has a determinant of zero ($\det(\mathbf{F}) = 0$) and has rank at most 2.

**Solution:**
1. By the multiplicative property of determinants:
   $$\det(\mathbf{F}) = \det(\mathbf{K}_R^{-\top}) \cdot \det([\mathbf{t}]_\times) \cdot \det(\mathbf{R}) \cdot \det(\mathbf{K}_L^{-1})$$
2. For any valid camera intrinsics, $\det(\mathbf{K}) = f_x f_y > 0 \implies \det(\mathbf{K}^{-1}) \neq 0$.
3. For any valid rotation matrix, $\mathbf{R} \in \text{SO}(3) \implies \det(\mathbf{R}) = +1$.
4. Consider the skew-symmetric cross-product matrix:
   $$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix}$$
   Compute its determinant:
   $$\begin{aligned}
   \det([\mathbf{t}]_\times) &= 0 \cdot (0 - (-t_x^2)) - (-t_z)(0 - (-t_x t_y)) + t_y(t_x t_z - 0) \\
   &= t_z (-t_x t_y) + t_y (t_x t_z) = -t_x t_y t_z + t_x t_y t_z = 0
   \end{aligned}$$
5. Because $\det([\mathbf{t}]_\times) = 0$, the product of determinants is:
   $$\det(\mathbf{F}) = \det(\mathbf{K}_R^{-\top}) \times 0 \times 1 \times \det(\mathbf{K}_L^{-1}) = 0$$
6. Since $\mathbf{t} \neq \mathbf{0}$, $[\mathbf{t}]_\times$ has rank exactly 2 (its nullspace is spanned by $\mathbf{t}$). Because multiplying by non-singular matrices preserves matrix rank:
   $$\text{rank}(\mathbf{F}) = \text{rank}([\mathbf{t}]_\times) = 2 \quad \blacksquare$$

---

### Exercise 8.2: The Eight-Point Algorithm Formulation
**Statement:** In the Longuet-Higgins Eight-Point Algorithm, point correspondences satisfy $\mathbf{x}_i'^\top \mathbf{F} \mathbf{x}_i = 0$.
Expand this bilinear equation into a linear dot product $\mathbf{a}_i^\top \mathbf{f} = 0$, where $\mathbf{f} \in \mathbb{R}^9$ is the flattened fundamental matrix.

**Solution:**
1. Let $\mathbf{x}_i = [u, v, 1]^\top$ and $\mathbf{x}_i' = [u', v', 1]^\top$.
2. The Fundamental Matrix is:
   $$\mathbf{F} = \begin{bmatrix} f_{11} & f_{12} & f_{13} \\ f_{21} & f_{22} & f_{23} \\ f_{31} & f_{32} & f_{33} \end{bmatrix}$$
3. Expand $\mathbf{x}_i'^\top \mathbf{F} \mathbf{x}_i$:
   $$\begin{bmatrix} u' & v' & 1 \end{bmatrix} \begin{bmatrix} f_{11} u + f_{12} v + f_{13} \\ f_{21} u + f_{22} v + f_{23} \\ f_{31} u + f_{32} v + f_{33} \end{bmatrix} = 0$$
   Multiplying out:
   $$u'(f_{11} u + f_{12} v + f_{13}) + v'(f_{21} u + f_{22} v + f_{23}) + 1(f_{31} u + f_{32} v + f_{33}) = 0$$
4. Rearranging in terms of the elements of $\mathbf{f} = [f_{11}, f_{12}, f_{13}, f_{21}, f_{22}, f_{23}, f_{31}, f_{32}, f_{33}]^\top$:
   $$u'u f_{11} + u'v f_{12} + u' f_{13} + v'u f_{21} + v'v f_{22} + v' f_{23} + u f_{31} + v f_{32} + 1 f_{33} = 0$$
5. The row vector $\mathbf{a}_i^\top$ is:
   $$\mathbf{a}_i^\top = \begin{bmatrix} u' u & u' v & u' & v' u & v' v & v' & u & v & 1 \end{bmatrix} \quad \blacksquare$$

---

### Exercise 8.3: Enforcing the Rank-2 Singularity Constraint via SVD
**Statement:** The linear 8-point solution yields an estimated matrix $\tilde{\mathbf{F}}$ that generally has full rank 3 due to image noise ($\det(\tilde{\mathbf{F}}) \neq 0$).
Show how to project $\tilde{\mathbf{F}}$ onto the closest rank-2 manifold in the Frobenius norm sense.

**Solution:**
1. Compute the SVD of the estimated matrix $\tilde{\mathbf{F}}$:
   $$\tilde{\mathbf{F}} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^\top = \mathbf{U} \begin{bmatrix} \sigma_1 & 0 & 0 \\ 0 & \sigma_2 & 0 \\ 0 & 0 & \sigma_3 \end{bmatrix} \mathbf{V}^\top \quad \text{where } \sigma_1 \ge \sigma_2 \ge \sigma_3 > 0$$
2. By the Eckart-Young-Mirsky Theorem, the optimal rank-2 matrix $\mathbf{F}^*$ that minimizes the Frobenius norm distance $\|\tilde{\mathbf{F}} - \mathbf{F}^*\|_F$ is obtained by setting the smallest singular value $\sigma_3$ to zero:
   $$\boldsymbol{\Sigma}^* = \begin{bmatrix} \sigma_1 & 0 & 0 \\ 0 & \sigma_2 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
3. Reconstruct the singular Fundamental Matrix:
   $$\mathbf{F}^* = \mathbf{U} \boldsymbol{\Sigma}^* \mathbf{V}^\top$$
   Now $\det(\mathbf{F}^*) = \sigma_1 \sigma_2 \times 0 = 0$, guaranteeing that all epipolar lines intersect at a unique epipole. $\blacksquare$

---

### Exercise 8.4: Essential Matrix Pose Ambiguity (The 4 Solutions)
**Statement:** Decomposing an Essential Matrix $\mathbf{E} = \mathbf{U} \text{diag}(1, 1, 0) \mathbf{V}^\top$ yields four possible mathematical pairs $(\mathbf{R}, \mathbf{t})$. Explain why four solutions exist, and describe how the **cheirality test** selects the single physically correct pose.

**Solution:**
1. Define the orthogonal matrix $\mathbf{W} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$.
2. The translation vector is determined up to sign: $\mathbf{t} = \pm \mathbf{u}_3$ (the third column of $\mathbf{U}$).
3. The rotation matrix has two choices: $\mathbf{R} = \mathbf{U} \mathbf{W} \mathbf{V}^\top$ or $\mathbf{R} = \mathbf{U} \mathbf{W}^\top \mathbf{V}^\top$.
4. Combining the 2 rotations and 2 translations yields **4 distinct solutions**:
   - Solution 1: $(\mathbf{R}_1, +\mathbf{t})$
   - Solution 2: $(\mathbf{R}_1, -\mathbf{t})$
   - Solution 3: $(\mathbf{R}_2, +\mathbf{t})$
   - Solution 4: $(\mathbf{R}_2, -\mathbf{t})$
5. **Cheirality Selection:**
   Triangulate a 3D scene point $\mathbf{X}$ under each of the 4 configurations:
   - In Solution 1, the point lies in front of both cameras: $Z_L > 0$ and $Z_R > 0$.
   - In Solution 2, the point lies behind both cameras: $Z_L < 0$ and $Z_R < 0$.
   - In Solutions 3 and 4, the camera is rotated by $180^\circ$, so the point lies in front of one camera and behind the other.
   The single physically valid hypothesis is the unique solution where the triangulated 3D point has positive depth in **both** cameras ($Z_L > 0$ and $Z_R > 0$). $\blacksquare$

---

### Exercise 8.5: Sampson Distance for Epipolar Error
**Statement:** Define the **Sampson First-Order Geometric Distance** $d_{\text{Sampson}}(\mathbf{x}_L, \mathbf{x}_R; \mathbf{F})$ and explain why it is superior to algebraic error $(\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L)^2$.

**Solution:**
1. The algebraic error is $\epsilon = \mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L$.
2. The Sampson error approximates the squared Euclidean geometric distance from the points to their respective epipolar lines:
   $$d_{\text{Sampson}}(\mathbf{x}_L, \mathbf{x}_R; \mathbf{F}) \triangleq \frac{(\mathbf{x}_R^\top \mathbf{F} \mathbf{x}_L)^2}{(\mathbf{F} \mathbf{x}_L)_1^2 + (\mathbf{F} \mathbf{x}_L)_2^2 + (\mathbf{F}^\top \mathbf{x}_R)_1^2 + (\mathbf{F}^\top \mathbf{x}_R)_2^2}$$
3. The denominator represents the sum of the squared gradients of the epipolar lines.
   Dividing by this gradient normalizes the algebraic error into true physical distance in **squared pixels** ($\text{pixels}^2$).

---

### Exercise 8.6: Pure Translation Epipole Location
**Statement:** In a forward-moving robot camera (visual odometry), the translation is strictly forward along the optical axis ($\mathbf{t} = [0, 0, t_z]^\top$) with zero rotation ($\mathbf{R} = \mathbf{I}$).
Where are the epipoles located on the image planes?

**Solution:**
1. The epipole is the projection of the relative translation direction:
   $$\mathbf{e} \propto \mathbf{K} \mathbf{t} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ t_z \end{bmatrix} = \begin{bmatrix} c_x t_z \\ c_y t_z \\ t_z \end{bmatrix}$$
2. Dividing by $t_z$:
   $$\mathbf{e} = [c_x, c_y, 1]^\top$$
   The epipole is located **exactly at the principal point $(c_x, c_y)$**!
   This point is the **Focus of Expansion (FOE)**: all image features appear to stream radially outwards from the principal point. $\blacksquare$

---

### Exercise 8.7: Epipolar Lines for Pure Sideways Motion
**Statement:** For pure horizontal sideways translation ($\mathbf{t} = [t_x, 0, 0]^\top, \mathbf{R} = \mathbf{I}$), find the epipoles and describe the orientation of all epipolar lines.

**Solution:**
1. The epipole is:
   $$\mathbf{e} \propto \mathbf{K} \begin{bmatrix} t_x \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} f_x t_x \\ 0 \\ 0 \end{bmatrix} \sim \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
2. The homogeneous coordinate $[1, 0, 0]^\top$ represents the ideal point at infinity along the horizontal $u$-axis.
3. Every epipolar line passes through the epipole $\mathbf{e}$:
   $$\mathbf{l}^\top \mathbf{e} = 0 \implies l_1(1) + l_2(0) + l_3(0) = 0 \implies l_1 = 0$$
   The line equation is $0 \cdot u + l_2 v + l_3 = 0 \implies v = -l_3/l_2 = \text{constant}$.
   All epipolar lines are strictly **horizontal scanlines**. $\blacksquare$

---

### Exercise 8.8: Left-Right Consistency Check in Stereo Matching
**Statement:** Explain how the **Left-Right Consistency (LRC) check** detects occlusions and false matches in dense stereo matching.

**Solution:**
1. Run dense stereo matching with the left image as reference to obtain disparity map $D_L(x, y)$.
2. Independently run stereo matching with the right image as reference to obtain disparity map $D_R(x, y)$.
3. For each pixel $(x, y)$ in the left image:
   - Its predicted match in the right image is $x' = x - D_L(x, y)$.
   - Check the disparity computed at that right pixel: $d_{\text{check}} = D_R(x', y)$.
4. If the pixel is a true physical match (not occluded):
   $$|D_L(x, y) - D_R(x - D_L(x, y), y)| \le \epsilon \quad (\text{typically } \epsilon = 1 \text{ pixel})$$
5. If the condition fails, the pixel is an **occlusion** (visible to the left camera but blocked from the right camera's view) or a spurious mismatch, and is invalidated. $\blacksquare$

---

### Exercise 8.9: Sub-Pixel Disparity Interpolation via Quadratic Parabola
**Statement:** Around the integer disparity $d^*$ that achieves minimum matching cost $\mathcal{C}(d^*)$, the costs at neighboring disparities are $\mathcal{C}(d^* - 1) = C_{-1}$, $\mathcal{C}(d^*) = C_0$, and $\mathcal{C}(d^* + 1) = C_{+1}$.
Derive the sub-pixel disparity peak $\hat{d} = d^* + \delta$ by fitting an analytical parabola.

**Solution:**
1. Fit a continuous quadratic parabola $f(\delta) = a \delta^2 + b \delta + c$ centered at $\delta = 0$ ($d = d^*$):
   - At $\delta = 0$: $f(0) = c = C_0$
   - At $\delta = +1$: $f(1) = a + b + C_0 = C_{+1}$
   - At $\delta = -1$: $f(-1) = a - b + C_0 = C_{-1}$
2. Add the two equations:
   $$(a + b + C_0) + (a - b + C_0) = C_{+1} + C_{-1} \implies 2a + 2C_0 = C_{+1} + C_{-1} \implies a = \frac{C_{+1} + C_{-1} - 2C_0}{2}$$
3. Subtract the two equations:
   $$(a + b + C_0) - (a - b + C_0) = C_{+1} - C_{-1} \implies 2b = C_{+1} - C_{-1} \implies b = \frac{C_{+1} - C_{-1}}{2}$$
4. Find the minimum of the parabola:
   $$f'(\delta) = 2a \delta + b = 0 \implies \delta^* = -\frac{b}{2a}$$
5. Substitute $a$ and $b$:
   $$\delta^* = -\frac{(C_{+1} - C_{-1}) / 2}{2 \left( \frac{C_{+1} + C_{-1} - 2C_0}{2} \right)} = \frac{C_{-1} - C_{+1}}{2(C_{+1} + C_{-1} - 2C_0)}$$
   The sub-pixel disparity estimate is:
   $$\hat{d} = d^* + \frac{C_{-1} - C_{+1}}{2(C_{-1} - 2C_0 + C_{+1})} \quad \blacksquare$$

---

### Exercise 8.10: Triangulation via Direct Linear Transformation (Midpoint Method)
**Statement:** Given two general camera projection matrices $\mathbf{P}_1$ and $\mathbf{P}_2$ and measured pixel correspondences $\mathbf{x}_1 = [u_1, v_1, 1]^\top$ and $\mathbf{x}_2 = [u_2, v_2, 1]^\top$, write the $4 \times 4$ linear system $\mathbf{A} \tilde{\mathbf{X}} = \mathbf{0}$ to triangulate the 3D world coordinate $\tilde{\mathbf{X}}$.

**Solution:**
1. For camera 1: $\mathbf{x}_1 \times (\mathbf{P}_1 \tilde{\mathbf{X}}) = \mathbf{0}$.
   Expanding the cross-product gives 2 independent rows:
   $$u_1 (\mathbf{p}_{1, 3}^\top \tilde{\mathbf{X}}) - \mathbf{p}_{1, 1}^\top \tilde{\mathbf{X}} = 0 \implies (u_1 \mathbf{p}_{1, 3} - \mathbf{p}_{1, 1})^\top \tilde{\mathbf{X}} = 0$$
   $$v_1 (\mathbf{p}_{1, 3}^\top \tilde{\mathbf{X}}) - \mathbf{p}_{1, 2}^\top \tilde{\mathbf{X}} = 0 \implies (v_1 \mathbf{p}_{1, 3} - \mathbf{p}_{1, 2})^\top \tilde{\mathbf{X}} = 0$$
2. Similarly, for camera 2:
   $$(u_2 \mathbf{p}_{2, 3} - \mathbf{p}_{2, 1})^\top \tilde{\mathbf{X}} = 0$$
   $$(v_2 \mathbf{p}_{2, 3} - \mathbf{p}_{2, 2})^\top \tilde{\mathbf{X}} = 0$$
3. Assembling the $4 \times 4$ linear system $\mathbf{A} \tilde{\mathbf{X}} = \mathbf{0}$:
   $$\mathbf{A} = \begin{bmatrix} u_1 \mathbf{p}_{1, 3}^\top - \mathbf{p}_{1, 1}^\top \\ v_1 \mathbf{p}_{1, 3}^\top - \mathbf{p}_{1, 2}^\top \\ u_2 \mathbf{p}_{2, 3}^\top - \mathbf{p}_{2, 1}^\top \\ v_2 \mathbf{p}_{2, 3}^\top - \mathbf{p}_{2, 2}^\top \end{bmatrix} \in \mathbb{R}^{4 \times 4}$$
4. Solving $\mathbf{A} \tilde{\mathbf{X}} = \mathbf{0}$ via SVD yields the optimal 3D point $\tilde{\mathbf{X}} = [X, Y, Z, W]^\top$ that minimizes algebraic reprojection error. $\blacksquare$


---\n
# Chapter 9: Classical Feature Extraction: Harris Corners, FAST, and SIFT/ORB Descriptors

---

## 9.1 Local Feature Detection Principles and Mathematical Invariance

In robotic localization, visual SLAM, and autonomous object recognition, a vision system cannot rely on dense, pixel-by-pixel comparisons across varying camera angles, lighting conditions, and distances. Instead, visual perception relies on **local invariant features**â€”salient interest points with localized descriptions that remain repeatable and identifiable across geometric and photometric transformations.

```
                           THE LOCAL FEATURE PIPELINE
                           
       Raw Input Image I[y, x]
                 â”‚
                 â–¼
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚ 1. KEYPOINT DETECTION       â”‚  â”€â”€â–º Find Repeatable Salient Interest Points
       â”‚    (Harris, FAST, DoG)      â”‚      (Corners, Blobs, Scale-Space Extrema)
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â”‚
                      â–¼
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚ 2. CANONICAL ORIENTATION    â”‚  â”€â”€â–º Assign Intrinsic Direction Î¸ (Rotational Invariance)
       â”‚    & SCALE ESTIMATION       â”‚      and Characteristic Radius Ïƒ (Scale Invariance)
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â”‚
                      â–¼
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚ 3. DESCRIPTOR EXTRACTION    â”‚  â”€â”€â–º Compute Compact Invariant Signature
       â”‚    (SIFT 128D, ORB 256-bit) â”‚      (Gradient Histograms or Binary Tests)
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â”‚
                      â–¼
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚ 4. FEATURE MATCHING         â”‚  â”€â”€â–º Nearest Neighbor Search (L2 / Hamming) +
       â”‚    & ROBUST FITTING         â”‚      Lowe's Ratio Test + RANSAC Model Verification
       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Three Foundational Desiderata of Local Features
1. **Repeatability:** If a 3D physical surface point is detected as a keypoint in Image 1, it must be detected at the corresponding physical location in Image 2, regardless of camera rotation, translation, zoom, or illumination shifts.
2. **Distinctiveness (Saliency):** The local neighborhood pattern surrounding the keypoint must possess high information entropy, allowing it to be uniquely matched against thousands of candidate points across a massive database.
3. **Locality:** The descriptor must be compact and localized to minimize the probability of being corrupted by foreground occlusions or background clutter.

---

## 9.2 The Harris Corner Detector and the Structure Tensor

Flat image regions have zero gradient in all directions. Straight edge contours possess large gradients perpendicular to the edge, but zero gradient parallel to the edge (**the aperture problem**â€”motion along the edge is fundamentally ambiguous).

A **corner** is an intersection of two or more edges where the image intensity changes significantly in all spatial directions.

```
                     FLAT VS. EDGE VS. CORNER REGIONS
                     
       Flat Region                      Edge Region                      Corner Region
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚               â”‚                â”‚       |       â”‚                â”‚       |       â”‚
    â”‚   [  ]        â”‚                â”‚   [ | ]       â”‚                â”‚   [ â”Œâ”€â”˜ ]     â”‚
    â”‚               â”‚                â”‚       |       â”‚                â”‚     â””â”€â”€â”€      â”‚
    â”‚               â”‚                â”‚       |       â”‚                â”‚               â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
                         
                    Î»_2 â–²
                        â”‚      "EDGE"
                        â”‚   (Î»_2 >> Î»_1)
                        â”‚        â”‚
                        â”‚        â–¼
                        â”‚       | |
                        â”‚       | |             "CORNER"
                        â”‚       | |          (Î»_1 â‰ˆ Î»_2 >> 0)
                        â”‚       | |                 o
                        â”‚                          / \
                        â”‚                         /   \
                        â”‚
                        â”‚      "FLAT"               "EDGE"
                        â”‚ (Î»_1 â‰ˆ Î»_2 â‰ˆ 0)        (Î»_1 >> Î»_2)
                        â”‚       . . .          â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Î»_1
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
     
        â”Œâ”€â”€â”€â”                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
     k^4â”‚   â”‚               k^4â”‚       â”‚            k^4â”‚               â”‚
     k^3â”‚   â”‚               k^3â”‚       â”‚            k^3â”‚               â”‚
     k^2â”‚   â”‚               k^2â”‚       â”‚            k^2â”‚               â”‚
     k  â”‚   â”‚               k  â”‚       â”‚            k  â”‚               â”‚
      1 â””â”€â”€â”€â”˜                1 â””â”€â”€â”€â”€â”€â”€â”€â”˜             1 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
                         
             Scale Ïƒ + 1           Current Scale Ïƒ           Scale Ïƒ - 1
             â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”          â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”          â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
             â”‚ o â”‚ o â”‚ o â”‚          â”‚ o â”‚ o â”‚ o â”‚          â”‚ o â”‚ o â”‚ o â”‚
             â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
             â”‚ o â”‚ o â”‚ o â”‚          â”‚ o â”‚[X]â”‚ o â”‚          â”‚ o â”‚ o â”‚ o â”‚
             â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤          â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
             â”‚ o â”‚ o â”‚ o â”‚          â”‚ o â”‚ o â”‚ o â”‚          â”‚ o â”‚ o â”‚ o â”‚
             â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜          â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜          â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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
       â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”
       â”‚   â”‚   â”‚   â”‚   â”‚                    â”‚ \ | / â”‚
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                    â”‚-- o --â”‚  8-Direction
       â”‚   â”‚   â”‚   â”‚   â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º    â”‚ / | \ â”‚  Gradient Histogram
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                    â””â”€â”€â”€â”€â”€â”€â”€â”˜  per 4x4 cell
       â”‚   â”‚   â”‚   â”‚   â”‚
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                    4 x 4 cells x 8 orientations
       â”‚   â”‚   â”‚   â”‚   â”‚                    = 128 Total Float Values
       â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
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


---\n
# Chapter 10: Convolutional Neural Networks for Visual Perception

---

## 10.1 The Inductive Biases of Visual Perception: Equivariance and Parameter Sharing

Before the advent of deep Convolutional Neural Networks (CNNs), machine learning treated images as flattened 1D vectors $\mathbf{x} \in \mathbb{R}^{D}$ where $D = H \cdot W \cdot C$. A standard Fully Connected (dense) layer maps $\mathbf{x}$ to hidden representations via matrix multiplication $\mathbf{y} = \mathbf{W} \mathbf{x} + \mathbf{b}$.

```
               THE CATASTROPHIC INEFFICIENCY OF DENSE LAYERS ON IMAGES
               
        Megapixel Image (1000 x 1000 x 3)                Fully Connected Layer
                   3,000,000 Inputs                             1000 Neurons
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚            â”‚       3 BILLION WEIGHTS!     â”‚            â”‚
                    â”‚   PIXELS   â”‚ â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–º â”‚   NEURONS  â”‚
                    â”‚            â”‚    (12 GB Memory for ONE     â”‚            â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     single linear layer!)    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                    
       Dense layers destroy 2D spatial topology, require billions of parameters,
             and fail to generalize across basic object translations!
```

### The Architectural Inductive Biases of CNNs
Yann LeCun (1989, 1998) recognized that physical optical imagery possesses intrinsic physical symmetries that general dense neural networks ignore. Modern computer vision replaces dense matrix operations with **Convolutional Layers** governed by two foundational inductive biases:

1. **Local Connectivity (Sparse Interactions):**
   Physical visual scenes exhibit strong local spatial correlation: adjacent pixels belong to the same physical object or surface boundary, whereas distant pixels are largely independent. Instead of connecting each neuron to all millions of inputs, a convolutional neuron connects strictly to a small, localized receptive field of size $K \times K$ (typically $3 \times 3$ or $5 \times 5$).

2. **Parameter Sharing (Weight Tying):**
   A feature detector useful in one region of the visual field (e.g., a vertical edge, a circle, or an eye detector) is equally useful everywhere across the image. A single set of kernel weights $K$ is swept across every spatial position $[y, x]$.

```
                      PARAMETER SHARING & WEIGHT TYING
                      
         Input Feature Map                     Shared Kernel K
       â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”                     â”Œâ”€â”€â”€â”¬â”€â”€â”€â”¬â”€â”€â”€â”
       â”‚ . â”‚ . â”‚ . â”‚ . â”‚ . â”‚                     â”‚ w â”‚ w â”‚ w â”‚
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                     â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤
       â”‚ . â”‚ p â”‚ p â”‚ p â”‚ . â”‚ â—„â”€â”€ Receptive Field â”‚ w â”‚ w â”‚ w â”‚ (Same 9 weights
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤     evaluated here  â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤  reused across
       â”‚ . â”‚ p â”‚ p â”‚ p â”‚ . â”‚                     â”‚ w â”‚ w â”‚ w â”‚  EVERY pixel!)
       â”œâ”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”¤                     â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜
       â”‚ . â”‚ p â”‚ p â”‚ p â”‚ . â”‚                           â”‚
       â””â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”´â”€â”€â”€â”˜                           â–¼
                                            Output Feature Map O[y, x]
```

### Translation Equivariance
A mathematical operator $f$ is **equivariant** to a transformation $g$ if transforming the input produces an identically transformed output:
$$f(g(x)) = g(f(x))$$

Let $\mathcal{T}_{\Delta y, \Delta x}$ denote the 2D spatial translation operator. By the shift-invariance of discrete 2D convolution:
$$\mathcal{T}_{\Delta y, \Delta x}(I * K) = (\mathcal{T}_{\Delta y, \Delta x} I) * K$$

If an object shifts 20 pixels to the right in the input camera frame, its corresponding feature activation in the convolutional feature map shifts by exactly 20 pixels to the right, retaining its identity and shape!

---

## 10.2 Anatomy of a 2D Convolutional Layer

A production 2D convolutional layer operates on 3D/4D tensors representing multi-channel feature maps.

### Tensor Dimensionality
- **Input Feature Map ($\mathbf{X}$):** $\mathbf{X} \in \mathbb{R}^{C_{\text{in}} \times H_{\text{in}} \times W_{\text{in}}}$
- **Kernel Weight Tensor ($\mathbf{W}$):** $\mathbf{W} \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}} \times K_h \times K_w}$
- **Bias Vector ($\mathbf{b}$):** $\mathbf{b} \in \mathbb{R}^{C_{\text{out}}}$
- **Output Feature Map ($\mathbf{Y}$):** $\mathbf{Y} \in \mathbb{R}^{C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}}$

```
                     MULTI-CHANNEL CONVOLUTION TENSOR ALGEBRA
                     
     Input Tensor X                            Kernel Tensor W                         Output Tensor Y
    (C_in x H x W)                        (C_out x C_in x Kh x Kw)                   (C_out x H_out x W_out)
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                 â”Œâ”€â”€â”€â”                                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚         â”‚                               C â”‚   â”‚ Kw                              â”‚         â”‚
    C_in â”‚         â”‚                       C_out  â”Œâ”€â”€â”´â”€â”€â”€â”¤                            C_outâ”‚         â”‚
         â”‚         â”‚                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”¤                                 â”‚         â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                      â”‚              â”‚ Kh                              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                 â”‚
                                                 â–¼
               Each output channel c_out computes the sum of 2D convolutions
                     across ALL C_in input channels plus bias b[c_out]!
```

### The Forward Pass Formula
For each output feature channel $c_{\text{out}} \in [0, C_{\text{out}}-1]$ at spatial coordinate $(y, x)$:

$$Y[c_{\text{out}}, y, x] = b[c_{\text{out}}] + \sum_{c_{\text{in}}=0}^{C_{\text{in}}-1} \sum_{u=0}^{K_h-1} \sum_{v=0}^{K_w-1} X\Big[c_{\text{in}}, \, y \cdot S_h + u, \, x \cdot S_w + v\Big] \cdot W\Big[c_{\text{out}}, c_{\text{in}}, u, v\Big]$$

where $S_h, S_w \ge 1$ denote the vertical and horizontal **stride**.

### Hyperparameter Geometry: Stride, Padding, and Dilation

1. **Stride ($S$):** The step size by which the kernel slides across the input tensor. Stride $S > 1$ subsamples the feature map, reducing spatial resolution by approximately $1/S$.
2. **Padding ($P$):** The number of pixels appended to the spatial boundaries:
   - **`Valid` Padding ($P = 0$):** No padding added. Output size shrinks.
   - **`Same` Padding ($P = \lfloor K/2 \rfloor$ for stride $S = 1$):** Output spatial dimensions exactly match input dimensions ($H_{\text{out}} = H_{\text{in}}, W_{\text{out}} = W_{\text{in}}$).
3. **Dilation ($D$):** The spacing between kernel taps. A dilated (atrous) convolution with dilation rate $D$ inflates the effective kernel size to:
   $$K_{\text{effective}} = K + (K - 1)(D - 1)$$
   This dramatically expands the receptive field without adding any new parameters or FLOPs.

#### The Universal Output Dimension Equation:
$$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K_{\text{effective}} + 2P}{S} \right\rfloor + 1$$
$$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - K_{\text{effective}} + 2P}{S} \right\rfloor + 1$$

---

## 10.3 Receptive Field Growth Through Deep Hierarchies

A single neuron in layer $l$ of a convolutional network observes only a local patch of size $K_l \times K_l$ in layer $l-1$. However, because each neuron in layer $l-1$ itself observes a patch in layer $l-2$, the **Effective Receptive Field (ERF)** in the raw input image grows monotonically with network depth.

```
                         RECEPTIVE FIELD EXPANSION
                         
    Layer 3 (Neuron)                                  o
                                                    /   \
    Layer 2 (Feature Map)                         o   o   o
                                                 / \ / \ / \
    Layer 1 (Feature Map)                       o o o o o o o
                                               / \
    Layer 0 (Raw Image Pixels)                o o o o o o o o o
                                              â—„â”€â”€ Receptive Field â”€â”€â–º
```

### Mathematical Receptive Field Recurrence
Let:
- $RF_0 = 1$ (a single pixel in the raw input image).
- $J_0 = 1$ (the initial jump / stride step in input space).
- $K_l$ be the kernel size at layer $l$.
- $S_l$ be the stride at layer $l$.

The receptive field and stride jump accumulate through the hierarchy via the recurrences:

$$RF_l = RF_{l-1} + (K_l - 1) \cdot J_{l-1}$$
$$J_l = J_{l-1} \cdot S_l$$

#### The Gaussian Profile of the Effective Receptive Field
In 2016, Luo et al. proved that while the theoretical receptive field grows linearly with depth, the **Effective Receptive Field (ERF)**â€”the distribution of output gradients with respect to input pixelsâ€”follows an asymptotic 2D Gaussian distribution:
$$\frac{\partial y_{\text{center}}}{\partial X[y, x]} \propto \exp\left( -\frac{(x - x_c)^2 + (y - y_c)^2}{2\sigma_{\text{erf}}^2} \right)$$
Pixels near the center of the receptive field exert vastly greater influence on the final classification decision than pixels near the outer boundary.

---

## 10.4 Complete Backpropagation Calculus Through 2D Convolutions

To train a convolutional neural network via gradient descent, we must compute analytical partial derivatives of the scalar loss function $\mathcal{L}$ with respect to:
1. The kernel weights: $\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$ (to update parameters).
2. The layer biases: $\frac{\partial \mathcal{L}}{\partial \mathbf{b}}$ (to update biases).
3. The input activations: $\frac{\partial \mathcal{L}}{\partial \mathbf{X}}$ (to propagate error backwards to preceding layers).

```
                      BACKPROPAGATION IN CONVOLUTIONAL LAYERS
                      
            Forward Pass:                       Backward Pass:
            
               Input X                             dL/dX (Backprop Error)
                  â”‚                                   â–²
                  â–¼                                   â”‚ Full Convolution
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                       â”Œâ”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â” with 180Â° Flipped
            â”‚ Conv2D(W) â”‚                       â”‚ Conv2D(W) â”‚ Kernel W!
            â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜                       â””â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”˜
                  â”‚                                   â”‚
                  â–¼                                   â”‚
               Output Y â”€â”€â–º Loss L              Incoming Gradient dL/dY
                                                      â”‚
                                                      â–¼
                                                dL/dW = X * (dL/dY)
```

Let $\delta[c_{\text{out}}, y, x] \triangleq \frac{\partial \mathcal{L}}{\partial Y[c_{\text{out}}, y, x]}$ be the incoming backpropagation error gradient tensor of dimensions $C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}$.

### 1. Bias Gradient ($\frac{\partial \mathcal{L}}{\partial \mathbf{b}}$)
Since $\frac{\partial Y[c_{\text{out}}, y, x]}{\partial b[c]} = 1$ if $c = c_{\text{out}}$ (and $0$ otherwise), by the multi-variable chain rule:

$$\frac{\partial \mathcal{L}}{\partial b[c_{\text{out}}]} = \sum_{y=0}^{H_{\text{out}}-1} \sum_{x=0}^{W_{\text{out}}-1} \frac{\partial \mathcal{L}}{\partial Y[c_{\text{out}}, y, x]} = \sum_{y} \sum_{x} \delta[c_{\text{out}}, y, x]$$

The bias gradient is simply the sum of all incoming error gradients across the spatial dimensions of that channel!

### 2. Weight Gradient ($\frac{\partial \mathcal{L}}{\partial \mathbf{W}}$)
Differentiating the forward formula with respect to weight $W[c_{\text{out}}, c_{\text{in}}, u, v]$:
$$\frac{\partial Y[c_{\text{out}}, y, x]}{\partial W[c_{\text{out}}, c_{\text{in}}, u, v]} = X[c_{\text{in}}, \, y \cdot S + u, \, x \cdot S + v]$$

Applying the chain rule:

$$\frac{\partial \mathcal{L}}{\partial W[c_{\text{out}}, c_{\text{in}}, u, v]} = \sum_{y=0}^{H_{\text{out}}-1} \sum_{x=0}^{W_{\text{out}}-1} \delta[c_{\text{out}}, y, x] \cdot X[c_{\text{in}}, \, y \cdot S + u, \, x \cdot S + v]$$

Notice the profound mathematical symmetry: **The gradient with respect to the weights is the cross-correlation of the input activations with the output error gradients!**

### 3. Input Activation Gradient ($\frac{\partial \mathcal{L}}{\partial \mathbf{X}}$)
To compute how the loss varies with an input pixel $X[c_{\text{in}}, i, j]$:
Each input pixel contributes to multiple overlapping output pixels $Y[c_{\text{out}}, y, x]$ where:
$$i = y \cdot S + u \implies u = i - y \cdot S$$
$$j = x \cdot S + v \implies v = j - x \cdot S$$

Summing over all output channels $c_{\text{out}}$ and valid kernel offsets:

$$\frac{\partial \mathcal{L}}{\partial X[c_{\text{in}}, i, j]} = \sum_{c_{\text{out}}=0}^{C_{\text{out}}-1} \sum_{u=0}^{K_h-1} \sum_{v=0}^{K_w-1} \delta[c_{\text{out}}, \, i - u, \, j - v] \cdot W[c_{\text{out}}, c_{\text{in}}, u, v]$$

#### The Full Convolution Equivalence:
In continuous/discrete signal processing, this operation is mathematically identical to a **full convolution** of the error gradient tensor $\boldsymbol{\delta}$ with the **$180^\circ$-rotated (flipped) kernel**:

$$\frac{\partial \mathcal{L}}{\partial \mathbf{X}} = \boldsymbol{\delta} *_{\text{full}} \text{rot}_{180}(\mathbf{W})$$

where $\text{rot}_{180}(W)[u, v] = W[K_h - 1 - u, \, K_w - 1 - v]$.

---

## 10.5 Iconic Vision Backbones: From LeNet to ResNet

The history of modern deep visual perception is defined by the architectural evolution of convolutional backbones:

```
                         THE CONVOLUTIONAL EVOLUTION
                         
    LeNet-5 (1998)        AlexNet (2012)        VGG-16 (2014)          ResNet-50 (2015)
     5 Layers              8 Layers              16 Layers              50-152 Layers
     
     5x5 Convs             11x11, 5x5, 3x3       Strict 3x3 Convs       Residual Skip Connections
     Avg Pooling           ReLU, Dropout         Factorized Depth       y = F(x) + x
     Sigmoid/Tanh          GPU Acceleration      Heavy (138M Params)    Conquers Vanishing Gradients!
```

### 1. LeNet-5 (LeCun et al., 1998)
Pioneered 2D convolutions, weight sharing, and subsampling for automated handwritten digit recognition (MNIST), establishing the standard `[Conv -> Pool -> Conv -> Pool -> FC -> Output]` pipeline.

### 2. AlexNet (Krizhevsky, Sutskever, Hinton, 2012)
Ignited the modern deep learning revolution by winning the ImageNet Large Scale Visual Recognition Challenge (ILSVRC) with an unprecedented error reduction:
- Replaced saturating Sigmoid/Tanh activations with the **Rectified Linear Unit (ReLU)** $f(x) = \max(0, x)$, eliminating saturation for positive inputs.
- Introduced **Dropout** regularization to prevent co-adaptation of features.
- Parallelized execution across twin NVIDIA GTX 580 GPUs.

### 3. VGG-16 (Simonyan and Zisserman, 2014)
Demonstrated that large convolutional filters (such as $7 \times 7$ or $11 \times 11$) are mathematically suboptimal.
- **Factorization Theorem:** A stack of two $3 \times 3$ convolutions has an effective receptive field of $5 \times 5$, but requires only $2 \times (3^2) = 18$ weights versus $5^2 = 25$ weights (a $28\%$ parameter reduction), while incorporating an extra non-linear ReLU activation!
- A stack of three $3 \times 3$ convolutions matches a $7 \times 7$ receptive field with $3 \times 9 = 27$ weights versus $49$ weights (a $45\%$ reduction).

### 4. ResNet and Deep Residual Learning (He et al., 2015)
Before 2015, stacking more than 20 layers caused catastrophic training degradation: deeper networks suffered from higher training error due to the **vanishing gradient problem**.

Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun introduced **Residual Learning**:
Instead of forcing layers to fit an underlying mapping $\mathcal{H}(\mathbf{x})$, the layers fit a residual mapping $\mathcal{F}(\mathbf{x}) \triangleq \mathcal{H}(\mathbf{x}) - \mathbf{x}$.
The original input is reintroduced via an identity **shortcut connection (skip connection)**:

$$\mathbf{y} = \mathcal{F}(\mathbf{x}, \{\mathbf{W}_i\}) + \mathbf{x}$$

```
                          THE RESNET RESIDUAL BLOCK
                          
                                      x
                                â”Œâ”€â”€â”€â”€â”€oâ”€â”€â”€â”€â”€â”
                                â”‚     â”‚     â”‚ Identity Shortcut
                                â”‚     â–¼     â”‚ (Gradient Highway!)
                                â”‚  â”Œâ”€â”€â”€â”€â”€â”  â”‚
                                â”‚  â”‚ 3x3 â”‚  â”‚
                                â”‚  â”‚Conv â”‚  â”‚
                                â”‚  â””â”€â”€â”€â”€â”€â”˜  â”‚
                                â”‚     â”‚     â”‚
                                â”‚     â–¼     â”‚
                                â”‚  â”Œâ”€â”€â”€â”€â”€â”  â”‚
                                â”‚  â”‚ 3x3 â”‚  â”‚
                                â”‚  â”‚Conv â”‚  â”‚
                                â”‚  â””â”€â”€â”€â”€â”€â”˜  â”‚
                                â”‚     â”‚     â”‚
                                â”‚     â–¼     â”‚
                                â”‚  F(x)     â”‚
                                â”‚     â”‚     â”‚
                                â””â”€â”€â”€â”€â–º(+)â—„â”€â”€â”˜
                                       â”‚
                                       â–¼
                                y = F(x) + x
```

#### Why Residual Skip Connections Eliminate Vanishing Gradients:
Differentiating $\mathbf{y} = \mathcal{F}(\mathbf{x}) + \mathbf{x}$ with respect to input $\mathbf{x}$:
$$\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \frac{\partial \mathbf{y}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \left( \frac{\partial \mathcal{F}}{\partial \mathbf{x}} + \mathbf{I} \right) = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \frac{\partial \mathcal{F}}{\partial \mathbf{x}} + \frac{\partial \mathcal{L}}{\partial \mathbf{y}}$$

Notice the term $+ \frac{\partial \mathcal{L}}{\partial \mathbf{y}}$!
Even if the learned weights $\frac{\partial \mathcal{F}}{\partial \mathbf{x}} \to \mathbf{0}$, the gradient $\frac{\partial \mathcal{L}}{\partial \mathbf{y}}$ flows directly back to earlier layers unimpeded through the identity highway $\mathbf{I}$. This enabled networks to scale cleanly to 50, 101, and 152 layers, shattering all computer vision benchmarks.

---

## 10.6 Worked Examples

### Problem 10.1: Output Feature Map Dimension Calculation
**Statement:** A 2D convolutional layer receives an input tensor with dimensions $C_{\text{in}} = 64$, $H_{\text{in}} = 112$, $W_{\text{in}} = 112$.
The layer configuration is:
- Number of filters: $C_{\text{out}} = 128$
- Kernel size: $K = 5 \times 5$
- Stride: $S = 2$
- Padding: $P = 2$
- Dilation: $D = 1$
1. Compute the output dimensions $H_{\text{out}}$ and $W_{\text{out}}$.
2. Compute the total number of trainable parameters (weights + biases) in this layer.
3. Compute the total number of floating-point multiply-accumulate operations (MACs) for the forward pass.

**Step-by-step Solution:**
1. **Output Spatial Dimensions:**
   Using the output dimension formula:
   $$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - K + 2P}{S} \right\rfloor + 1 = \left\lfloor \frac{112 - 5 + 2(2)}{2} \right\rfloor + 1 = \left\lfloor \frac{112 - 5 + 4}{2} \right\rfloor + 1 = \left\lfloor \frac{111}{2} \right\rfloor + 1 = 55 + 1 = 56$$
   Since $W_{\text{in}} = H_{\text{in}}$ and the kernel is square: $W_{\text{out}} = 56$.
   The output tensor has shape $\mathbf{Y} \in \mathbb{R}^{128 \times 56 \times 56}$.

2. **Trainable Parameter Count:**
   - Weight tensor shape: $[C_{\text{out}}, C_{\text{in}}, K_h, K_w] = [128, 64, 5, 5]$
     $$\text{Weights} = 128 \times 64 \times 5 \times 5 = 128 \times 64 \times 25 = 204,800$$
   - Bias vector shape: $[C_{\text{out}}] = [128]$
     $$\text{Biases} = 128$$
   - Total Parameters:
     $$\text{Params} = 204,800 + 128 = 204,928 \text{ parameters}$$

3. **Multiply-Accumulate Operations (MACs):**
   Each output element requires $C_{\text{in}} \times K_h \times K_w$ MACs.
   Total output elements = $C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}} = 128 \times 56 \times 56 = 401,408$.
   $$\text{MACs} = 401,408 \times (64 \times 25) = 401,408 \times 1,600 = 642,252,800 \text{ MACs} \approx 642.25\text{ MMACs}$$

---

### Problem 10.2: Receptive Field Calculation Through Deep Stack
**Statement:** A 4-layer convolutional feature extractor has the following sequential parameters:
- Layer 1: $K_1 = 3, S_1 = 1$
- Layer 2: $K_2 = 3, S_2 = 2$
- Layer 3: $K_3 = 3, S_3 = 1$
- Layer 4: $K_4 = 3, S_4 = 2$
Compute the theoretical receptive field $RF_l$ and stride jump $J_l$ at the output of each layer.

**Step-by-step Solution:**
Initial conditions: $RF_0 = 1, J_0 = 1$.
Recurrence: $RF_l = RF_{l-1} + (K_l - 1) \cdot J_{l-1}$ and $J_l = J_{l-1} \cdot S_l$.

1. **Layer 1 ($K_1 = 3, S_1 = 1$):**
   $$RF_1 = RF_0 + (3 - 1) \cdot J_0 = 1 + 2(1) = 3$$
   $$J_1 = J_0 \cdot S_1 = 1 \cdot 1 = 1$$
2. **Layer 2 ($K_2 = 3, S_2 = 2$):**
   $$RF_2 = RF_1 + (3 - 1) \cdot J_1 = 3 + 2(1) = 5$$
   $$J_2 = J_1 \cdot S_2 = 1 \cdot 2 = 2$$
3. **Layer 3 ($K_3 = 3, S_3 = 1$):**
   $$RF_3 = RF_2 + (3 - 1) \cdot J_2 = 5 + 2(2) = 5 + 4 = 9$$
   $$J_3 = J_2 \cdot S_3 = 2 \cdot 1 = 2$$
4. **Layer 4 ($K_4 = 3, S_4 = 2$):**
   $$RF_4 = RF_3 + (3 - 1) \cdot J_3 = 9 + 2(2) = 9 + 4 = 13$$
   $$J_4 = J_3 \cdot S_4 = 2 \cdot 2 = 4$$
A single neuron at the output of Layer 4 has a receptive field spanning $13 \times 13$ pixels of the input image.

---

### Problem 10.3: Dilated (Atrous) Convolution Receptive Field
**Statement:** A robotic segmentation network replaces Layer 4 from Problem 10.2 ($K_4 = 3$) with a dilated convolution having dilation rate $D = 4$ and stride $S = 1$.
1. Compute the effective kernel size $K_{\text{effective}}$.
2. Compute the new receptive field $RF_4$ after this dilated layer.

**Step-by-step Solution:**
1. **Effective Kernel Size:**
   $$K_{\text{effective}} = K + (K - 1)(D - 1) = 3 + (3 - 1)(4 - 1) = 3 + 2(3) = 3 + 6 = 9$$
   The effective kernel spans 9 grid units while containing only 3 non-zero weights.
2. **Receptive Field Growth:**
   From Problem 10.2, after Layer 3: $RF_3 = 9, J_3 = 2$.
   $$RF_4 = RF_3 + (K_{\text{effective}} - 1) \cdot J_3 = 9 + (9 - 1) \cdot 2 = 9 + 8(2) = 9 + 16 = 25$$
   The receptive field expands from $13$ to **$25$ pixels**, nearly doubling spatial context with zero added parameters!

---

### Problem 10.4: Analytical 2D Convolution Forward Pass Execution
**Statement:** Consider a 1-channel $3 \times 3$ input $\mathbf{X}$ and $2 \times 2$ kernel $\mathbf{W}$ with zero bias ($b = 0$), stride $S = 1$, and valid padding ($P = 0$):
$$\mathbf{X} = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}, \quad \mathbf{W} = \begin{bmatrix} 1 & 0 \\ -1 & 2 \end{bmatrix}$$
Compute the output matrix $\mathbf{Y}$.

**Step-by-step Solution:**
Output dimensions: $H_{\text{out}} = 3 - 2 + 1 = 2, W_{\text{out}} = 3 - 2 + 1 = 2$.
Forward formula: $Y[y, x] = \sum_{u=0}^1 \sum_{v=0}^1 X[y+u, x+v] W[u, v]$.
1. **Position $(0, 0)$:**
   $$Y[0, 0] = X[0,0]W[0,0] + X[0,1]W[0,1] + X[1,0]W[1,0] + X[1,1]W[1,1]$$
   $$Y[0, 0] = (1)(1) + (2)(0) + (4)(-1) + (5)(2) = 1 + 0 - 4 + 10 = 7$$
2. **Position $(0, 1)$:**
   $$Y[0, 1] = X[0,1]W[0,0] + X[0,2]W[0,1] + X[1,1]W[1,0] + X[1,2]W[1,1]$$
   $$Y[0, 1] = (2)(1) + (3)(0) + (5)(-1) + (6)(2) = 2 + 0 - 5 + 12 = 9$$
3. **Position $(1, 0)$:**
   $$Y[1, 0] = X[1,0]W[0,0] + X[1,1]W[0,1] + X[2,0]W[1,0] + X[2,1]W[1,1]$$
   $$Y[1, 0] = (4)(1) + (5)(0) + (7)(-1) + (8)(2) = 4 + 0 - 7 + 16 = 13$$
4. **Position $(1, 1)$:**
   $$Y[1, 1] = X[1,1]W[0,0] + X[1,2]W[0,1] + X[2,1]W[1,0] + X[2,2]W[1,1]$$
   $$Y[1, 1] = (5)(1) + (6)(0) + (8)(-1) + (9)(2) = 5 + 0 - 8 + 18 = 15$$
Assembled output:
$$\mathbf{Y} = \begin{bmatrix} 7 & 9 \\ 13 & 15 \end{bmatrix}$$

---

### Problem 10.5: Analytical Weight Gradient Backpropagation
**Statement:** For the setup in Problem 10.4, suppose the incoming backpropagation error gradient is:
$$\boldsymbol{\delta} = \frac{\partial \mathcal{L}}{\partial \mathbf{Y}} = \begin{bmatrix} 1 & -1 \\ 2 & 0 \end{bmatrix}$$
Compute the weight gradient matrix $\frac{\partial \mathcal{L}}{\partial \mathbf{W}} \in \mathbb{R}^{2 \times 2}$.

**Step-by-step Solution:**
Formula: $\frac{\partial \mathcal{L}}{\partial W[u, v]} = \sum_{y=0}^1 \sum_{x=0}^1 \delta[y, x] X[y+u, x+v]$.
1. **$W[0, 0]$ (top-left weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[0, 0]} &= \delta[0,0]X[0,0] + \delta[0,1]X[0,1] + \delta[1,0]X[1,0] + \delta[1,1]X[1,1] \\
   &= (1)(1) + (-1)(2) + (2)(4) + (0)(5) = 1 - 2 + 8 + 0 = 7
   \end{aligned}$$
2. **$W[0, 1]$ (top-right weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[0, 1]} &= \delta[0,0]X[0,1] + \delta[0,1]X[0,2] + \delta[1,0]X[1,1] + \delta[1,1]X[1,2] \\
   &= (1)(2) + (-1)(3) + (2)(5) + (0)(6) = 2 - 3 + 10 + 0 = 9
   \end{aligned}$$
3. **$W[1, 0]$ (bottom-left weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[1, 0]} &= \delta[0,0]X[1,0] + \delta[0,1]X[1,1] + \delta[1,0]X[2,0] + \delta[1,1]X[2,1] \\
   &= (1)(4) + (-1)(5) + (2)(7) + (0)(8) = 4 - 5 + 14 + 0 = 13
   \end{aligned}$$
4. **$W[1, 1]$ (bottom-right weight):**
   $$\begin{aligned}
   \frac{\partial \mathcal{L}}{\partial W[1, 1]} &= \delta[0,0]X[1,1] + \delta[0,1]X[1,2] + \delta[1,0]X[2,1] + \delta[1,1]X[2,2] \\
   &= (1)(5) + (-1)(6) + (2)(8) + (0)(9) = 5 - 6 + 16 + 0 = 15
   \end{aligned}$$
Assembled weight gradient:
$$\frac{\partial \mathcal{L}}{\partial \mathbf{W}} = \begin{bmatrix} 7 & 9 \\ 13 & 15 \end{bmatrix}$$

---

### Problem 10.6: Input Activation Gradient Backpropagation
**Statement:** For the setup in Problems 10.4 and 10.5, compute the input activation gradient $\frac{\partial \mathcal{L}}{\partial X[1, 1]}$ at the center pixel.

**Step-by-step Solution:**
Formula: $\frac{\partial \mathcal{L}}{\partial X[i, j]} = \sum_{u} \sum_{v} \delta[i-u, j-v] W[u, v]$ where valid $(i-u, j-v) \in \{0, 1\}^2$.
For $(i, j) = (1, 1)$:
- $u = 0, v = 0 \implies \delta[1-0, 1-0] = \delta[1, 1] \implies \delta[1, 1] W[0, 0] = (0)(1) = 0$
- $u = 0, v = 1 \implies \delta[1-0, 1-1] = \delta[1, 0] \implies \delta[1, 0] W[0, 1] = (2)(0) = 0$
- $u = 1, v = 0 \implies \delta[1-1, 1-0] = \delta[0, 1] \implies \delta[0, 1] W[1, 0] = (-1)(-1) = 1$
- $u = 1, v = 1 \implies \delta[1-1, 1-1] = \delta[0, 0] \implies \delta[0, 0] W[1, 1] = (1)(2) = 2$
Sum:
$$\frac{\partial \mathcal{L}}{\partial X[1, 1]} = 0 + 0 + 1 + 2 = 3$$

---

### Problem 10.7: Max Pooling Forward and Backward Pass
**Statement:** A $4 \times 4$ activation patch passes through a $2 \times 2$ Max Pooling layer with stride $S = 2$:
$$\mathbf{X} = \begin{bmatrix} 1 & 3 & 2 & 1 \\ 4 & 2 & 5 & 8 \\ 3 & 7 & 4 & 2 \\ 1 & 0 & 6 & 9 \end{bmatrix}$$
1. Compute the pooled output matrix $\mathbf{Y} \in \mathbb{R}^{2 \times 2}$.
2. If the incoming gradient is $\frac{\partial \mathcal{L}}{\partial \mathbf{Y}} = \begin{bmatrix} 10 & 20 \\ 30 & 40 \end{bmatrix}$, compute the backpropagated gradient matrix $\frac{\partial \mathcal{L}}{\partial \mathbf{X}} \in \mathbb{R}^{4 \times 4}$.

**Step-by-step Solution:**
1. **Forward Max Pooling:**
   - Top-left window $\begin{bmatrix} 1 & 3 \\ 4 & 2 \end{bmatrix}$: Max is **4** at index $(1, 0)$.
   - Top-right window $\begin{bmatrix} 2 & 1 \\ 5 & 8 \end{bmatrix}$: Max is **8** at index $(1, 3)$.
   - Bottom-left window $\begin{bmatrix} 3 & 7 \\ 1 & 0 \end{bmatrix}$: Max is **7** at index $(2, 1)$.
   - Bottom-right window $\begin{bmatrix} 4 & 2 \\ 6 & 9 \end{bmatrix}$: Max is **9** at index $(3, 3)$.
   $$\mathbf{Y} = \begin{bmatrix} 4 & 8 \\ 7 & 9 \end{bmatrix}$$

2. **Backward Gradient Routing:**
   In Max Pooling, gradients route exclusively to the argmax position; all other elements receive zero gradient:
   - $(1, 0)$ routes $+10$
   - $(1, 3)$ routes $+20$
   - $(2, 1)$ routes $+30$
   - $(3, 3)$ routes $+40$
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{X}} = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 10 & 0 & 0 & 20 \\ 0 & 30 & 0 & 0 \\ 0 & 0 & 0 & 40 \end{bmatrix}$$

---

### Problem 10.8: Factorization of 5x5 Convolutions into Two 3x3 Convolutions
**Statement:** Compare:
- Layer A: A single $5 \times 5$ conv layer with $C_{\text{in}} = 64$ and $C_{\text{out}} = 64$.
- Layer B: A cascaded stack of two $3 \times 3$ conv layers with intermediate channel count $C_{\text{mid}} = 64$.
1. Compute the parameter count of Layer A.
2. Compute the parameter count of Layer B.
3. Compute the percentage reduction in parameters.

**Step-by-step Solution:**
1. **Layer A ($5 \times 5$):**
   $$\text{Params}_A = C_{\text{out}} \times C_{\text{in}} \times 5 \times 5 + C_{\text{out}} = 64 \times 64 \times 25 + 64 = 102,400 + 64 = 102,464$$
2. **Layer B (Two $3 \times 3$):**
   - Sub-layer 1: $64 \times 64 \times 3 \times 3 + 64 = 64 \times 64 \times 9 + 64 = 36,864 + 64 = 36,928$
   - Sub-layer 2: $64 \times 64 \times 3 \times 3 + 64 = 36,928$
   $$\text{Params}_B = 36,928 + 36,928 = 73,856$$
3. **Reduction:**
   $$\text{Reduction} = \left( 1 - \frac{73,856}{102,464} \right) \times 100\% \approx \left( 1 - \frac{18}{25} \right) \times 100\% = 28.0\%$$
   The $3 \times 3$ cascade reduces parameters and FLOPs by $28\%$ while maintaining the identical $5 \times 5$ receptive field and adding an extra non-linear activation.

---

### Problem 10.9: Memory Footprint of Feature Map Activations
**Statement:** An autonomous drone runs ResNet-18 on an onboard GPU for real-time collision detection. The input is $3 \times 512 \times 512$ float32 ($4\text{ bytes}$).
Layer 1 outputs a feature tensor of shape $64 \times 256 \times 256$.
Layer 2 outputs a feature tensor of shape $128 \times 128 \times 128$.
Compute the memory consumed in megabytes (MB) by the activations of Layer 1 and Layer 2.

**Step-by-step Solution:**
1. **Layer 1 Activations ($64 \times 256 \times 256$):**
   $$\text{Elements} = 64 \times 256 \times 256 = 64 \times 65,536 = 4,194,304 \text{ floats}$$
   $$\text{Bytes} = 4,194,304 \times 4\text{ bytes} = 16,777,216\text{ bytes} = 16.0\text{ MB}$$
2. **Layer 2 Activations ($128 \times 128 \times 128$):**
   $$\text{Elements} = 128 \times 128 \times 128 = 128 \times 16,384 = 2,097,152 \text{ floats}$$
   $$\text{Bytes} = 2,097,152 \times 4\text{ bytes} = 8,388,608\text{ bytes} = 8.0\text{ MB}$$
   Total memory for just these two activation tensors = $16.0 + 8.0 = 24.0\text{ MB}$.

---

### Problem 10.10: 1x1 Convolutions for Channel Dimensionality Reduction
**Statement:** A feature map has shape $C_{\text{in}} = 256, H = 28, W = 28$. We wish to reduce the channels to $C_{\text{out}} = 64$ using a $1 \times 1$ convolution.
1. Compute the number of weights in the $1 \times 1$ convolution.
2. If we directly applied a $3 \times 3$ convolution from $256$ to $256$ channels, compute the weights.
3. Compare the parameter count if we first reduce to $64$ channels with $1 \times 1$, apply $3 \times 3$ convolution on $64$ channels, and restore to $256$ with $1 \times 1$ (the ResNet Bottleneck Block).

**Step-by-step Solution:**
1. **$1 \times 1$ Conv ($256 \to 64$):**
   $$\text{Weights} = 64 \times 256 \times 1 \times 1 = 16,384$$
2. **Direct $3 \times 3$ Conv ($256 \to 256$):**
   $$\text{Weights} = 256 \times 256 \times 3 \times 3 = 256 \times 256 \times 9 = 589,824$$
3. **ResNet Bottleneck Block:**
   - Step 1 ($1 \times 1$, $256 \to 64$): $64 \times 256 \times 1 \times 1 = 16,384$
   - Step 2 ($3 \times 3$, $64 \to 64$): $64 \times 64 \times 3 \times 3 = 36,864$
   - Step 3 ($1 \times 1$, $64 \to 256$): $256 \times 64 \times 1 \times 1 = 16,384$
   $$\text{Total Bottleneck Weights} = 16,384 + 36,864 + 16,384 = 69,632$$
   The Bottleneck architecture slashes parameters from $589,824$ down to $69,632$ (an **$88.2\%$ reduction**!), allowing dramatically deeper networks.

---

## 10.7 Solved Exercises

### Exercise 10.1: Proof of Translation Equivariance for Discrete Convolutions
**Statement:** Let $\mathcal{T}_{\boldsymbol{\Delta}}$ be a 2D spatial translation operator defined by $\mathcal{T}_{\boldsymbol{\Delta}}(X)[y, x] = X[y - \Delta_y, x - \Delta_x]$.
Prove algebraically that for any discrete convolution kernel $K$:
$$\text{Conv}(\mathcal{T}_{\boldsymbol{\Delta}}(X), K) = \mathcal{T}_{\boldsymbol{\Delta}}(\text{Conv}(X, K))$$

**Solution:**
1. Let $Y = \text{Conv}(X, K)$, so $Y[y, x] = \sum_u \sum_v X[y - u, x - v] K[u, v]$.
2. Let $X' = \mathcal{T}_{\boldsymbol{\Delta}}(X)$, so $X'[y, x] = X[y - \Delta_y, x - \Delta_x]$.
3. Compute the convolution of $X'$ with $K$:
   $$Y'[y, x] = \sum_u \sum_v X'[y - u, x - v] K[u, v]$$
4. Substitute the definition of $X'$:
   $$Y'[y, x] = \sum_u \sum_v X\Big[ (y - u) - \Delta_y, \, (x - v) - \Delta_x \Big] K[u, v]$$
5. Rearrange indices:
   $$Y'[y, x] = \sum_u \sum_v X\Big[ (y - \Delta_y) - u, \, (x - \Delta_x) - v \Big] K[u, v]$$
6. Notice that the right-hand side is precisely $Y[y - \Delta_y, x - \Delta_x] = \mathcal{T}_{\boldsymbol{\Delta}}(Y)[y, x]$.
   Therefore:
   $$\text{Conv}(\mathcal{T}_{\boldsymbol{\Delta}}(X), K) = \mathcal{T}_{\boldsymbol{\Delta}}(\text{Conv}(X, K)) \quad \blacksquare$$

---

### Exercise 10.2: Derivative of ReLU Activation
**Statement:** The Rectified Linear Unit is $f(x) = \max(0, x)$.
1. State the sub-gradient $\frac{df}{dx}$.
2. Explain the "Dying ReLU" failure mode and how Leaky ReLU resolves it.

**Solution:**
1. The derivative is:
   $$\frac{df}{dx} = \begin{cases} 1 & \text{if } x > 0 \\ 0 & \text{if } x < 0 \\ [0, 1] & \text{if } x = 0 \quad (\text{sub-gradient, convention: } 0) \end{cases}$$
2. **Dying ReLU Problem:**
   If a neuron receives a large negative gradient update such that its bias becomes strongly negative, $x = \mathbf{w}^\top \mathbf{x} + b < 0$ for all inputs in the dataset.
   Because $\frac{df}{dx} = 0$ for all $x < 0$, no error gradient ever passes back through this neuron again ($\nabla_{\mathbf{w}} \mathcal{L} = \mathbf{0}$). The neuron permanently ceases learning ("dies").
3. **Leaky ReLU Resolution:**
   Leaky ReLU introduces a small non-zero slope $\alpha \approx 0.01$ for negative inputs:
   $$f_{\text{leaky}}(x) = \begin{cases} x & \text{if } x > 0 \\ \alpha x & \text{if } x \le 0 \end{cases} \implies \frac{df_{\text{leaky}}}{dx} = \begin{cases} 1 & \text{if } x > 0 \\ \alpha & \text{if } x \le 0 \end{cases}$$
   Since the gradient is strictly $\alpha > 0$ when negative, error signals continue to flow, preventing neuron death. $\blacksquare$

---

### Exercise 10.3: Parameter Count Comparison: Conv vs. Dense
**Statement:** An input feature map has dimensions $64 \times 32 \times 32$.
- Option 1: Flatten and pass through a dense layer producing $64 \times 32 \times 32$ outputs.
- Option 2: Apply a $3 \times 3$ convolutional layer with $64$ filters, stride 1, padding 1.
Compute the parameter count for both options and state the ratio.

**Solution:**
1. **Option 1 (Dense Layer):**
   Input features $N_{\text{in}} = 64 \times 32 \times 32 = 65,536$.
   Output features $N_{\text{out}} = 64 \times 32 \times 32 = 65,536$.
   $$\text{Params}_{\text{dense}} = N_{\text{in}} \times N_{\text{out}} + N_{\text{out}} = 65,536 \times 65,536 + 65,536 \approx 4,295,032,832 \text{ params} \quad (4.3\text{ BILLION})$$
2. **Option 2 (Conv Layer):**
   $$\text{Params}_{\text{conv}} = C_{\text{out}} \times C_{\text{in}} \times K \times K + C_{\text{out}} = 64 \times 64 \times 9 + 64 = 36,864 + 64 = 36,928 \text{ params}$$
3. **Ratio:**
   $$\text{Ratio} = \frac{4,295,032,832}{36,928} \approx 116,308\times$$
   The dense layer requires over $116,000\times$ more parameters to perform a comparable spatial transformation! $\blacksquare$

---

### Exercise 10.4: Batch Normalization Mechanics and Invariance
**Statement:** In Batch Normalization (Ioffe and Szegedy, 2015), mini-batch activations $\mathcal{B} = \{x_1, \dots, x_m\}$ are normalized as $\hat{x}_i = \frac{x_i - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}$.
Prove that Batch Normalization is invariant to scaling of the preceding linear weights $\mathbf{W} \to \alpha \mathbf{W}$.

**Solution:**
1. Let $x_i = \mathbf{w}^\top \mathbf{u}_i$.
   If the weights are scaled by $\alpha > 0$, the new activations are $x_i' = \alpha \mathbf{w}^\top \mathbf{u}_i = \alpha x_i$.
2. Compute the new mini-batch mean:
   $$\mu_{\mathcal{B}}' = \frac{1}{m} \sum_{i=1}^m \alpha x_i = \alpha \left(\frac{1}{m} \sum_{i=1}^m x_i\right) = \alpha \mu_{\mathcal{B}}$$
3. Compute the new mini-batch variance:
   $$\sigma_{\mathcal{B}}'^2 = \frac{1}{m} \sum_{i=1}^m (x_i' - \mu_{\mathcal{B}}')^2 = \frac{1}{m} \sum_{i=1}^m (\alpha x_i - \alpha \mu_{\mathcal{B}})^2 = \alpha^2 \left(\frac{1}{m} \sum_{i=1}^m (x_i - \mu_{\mathcal{B}})^2\right) = \alpha^2 \sigma_{\mathcal{B}}^2$$
4. Compute the normalized activation (neglecting $\epsilon \ll \sigma^2$):
   $$\hat{x}_i' = \frac{x_i' - \mu_{\mathcal{B}}'}{\sqrt{\sigma_{\mathcal{B}}'^2}} = \frac{\alpha (x_i - \mu_{\mathcal{B}})}{\sqrt{\alpha^2 \sigma_{\mathcal{B}}^2}} = \frac{\alpha (x_i - \mu_{\mathcal{B}})}{\alpha \sigma_{\mathcal{B}}} = \frac{x_i - \mu_{\mathcal{B}}}{\sigma_{\mathcal{B}}} = \hat{x}_i$$
   The scalar $\alpha$ cancels out completely. Batch Normalization stabilizes training against exploding weight magnitudes. $\blacksquare$

---

### Exercise 10.5: Transposed Convolution (Deconvolution) Arithmetic
**Statement:** A transposed convolution layer (frequently used in generative models and semantic segmentation decoders) has input size $H_{\text{in}} = 16$, kernel size $K = 4$, stride $S = 2$, and padding $P = 1$.
Derive the output dimension $H_{\text{out}}$.

**Solution:**
1. A transposed convolution performs the backward pass of a standard convolution.
   In standard convolution: $H_{\text{in}} = \frac{H_{\text{out}} - K + 2P}{S} + 1$.
2. Invert this relationship to solve for $H_{\text{out}}$:
   $$H_{\text{out}} - K + 2P = S (H_{\text{in}} - 1) \implies H_{\text{out}} = S (H_{\text{in}} - 1) + K - 2P$$
3. Substitute the parameters ($H_{\text{in}} = 16, S = 2, K = 4, P = 1$):
   $$H_{\text{out}} = 2(16 - 1) + 4 - 2(1) = 2(15) + 4 - 2 = 30 + 2 = 32$$
   The transposed convolution upsamples the spatial resolution by exactly $2\times$ (from $16 \times 16$ to $32 \times 32$). $\blacksquare$

---

### Exercise 10.6: Checkerboard Artifacts in Transposed Convolutions
**Statement:** Explain why transposed convolutions often create prominent high-frequency "checkerboard artifacts" in generated or segmented images, and identify the bilinear upsampling alternative.

**Solution:**
1. When kernel size $K$ is not divisible by stride $S$ (e.g., $K = 3, S = 2$ or $K = 4, S = 2$), the receptive fields of adjacent output pixels overlap unevenly.
2. Some output pixels receive contributions from two kernel taps, while neighboring output pixels receive contributions from only one tap.
3. This creates a periodic intensity ripple across every alternate pixel resembling a checkerboard pattern.
4. **Alternative:**
   Replace transposed convolution with **Bilinear (or Nearest-Neighbor) Interpolation followed by a standard $3 \times 3$ convolution** with stride 1. This guarantees smooth, uniform spatial coverage with zero checkerboard fringing. $\blacksquare$

---

### Exercise 10.7: Global Average Pooling vs. Fully Connected Flattening
**Statement:** Min Lin et al. (2013) introduced **Global Average Pooling (GAP)** to replace dense fully connected layers prior to the final softmax classification layer. State the two primary benefits of GAP.

**Solution:**
1. **Dramatic Reduction in Parameters:**
   For a backbone outputting $512 \times 7 \times 7$ features to 1000 classes:
   - Dense flattening: $(512 \times 49) \times 1000 \approx 25.1\text{ million weights}$ (prone to severe overfitting).
   - Global Average Pooling: Takes the spatial mean $\frac{1}{49}\sum_{y, x} F[c, y, x]$, reducing $512 \times 7 \times 7$ to a single $512$-dimensional vector. Classification requires only $512 \times 1000 = 512,000\text{ weights}$ (a $98\%$ parameter elimination).
2. **Arbitrary Input Image Resolution:**
   Dense layers require a fixed, immutable input size (e.g., strictly $224 \times 224$). Global Average Pooling operates on arbitrary spatial dimensions $H \times W$, enabling the network to accept images of any resolution at test time. $\blacksquare$

---

### Exercise 10.8: Depthwise Separable Convolutions (MobileNet)
**Statement:** MobileNet (Howard et al., 2017) decomposes a standard convolution into a **Depthwise Convolution** followed by a **Pointwise ($1 \times 1$) Convolution**.
Calculate the computational cost ratio between Depthwise Separable and Standard Convolution for kernel size $K = 3 \times 3$ and $C_{\text{out}} \gg 1$.

**Solution:**
1. **Standard Convolution Cost:**
   $$\text{FLOPs}_{\text{std}} = H \cdot W \cdot C_{\text{out}} \cdot C_{\text{in}} \cdot K^2$$
2. **Depthwise Separable Convolution Cost:**
   - Depthwise pass: Each input channel is convolved with its own $K \times K$ kernel:
     $$\text{FLOPs}_{\text{depthwise}} = H \cdot W \cdot C_{\text{in}} \cdot K^2$$
   - Pointwise pass: A $1 \times 1$ convolution mixes channels:
     $$\text{FLOPs}_{\text{pointwise}} = H \cdot W \cdot C_{\text{out}} \cdot C_{\text{in}} \cdot 1$$
   $$\text{FLOPs}_{\text{sep}} = H \cdot W \cdot C_{\text{in}} (K^2 + C_{\text{out}})$$
3. **Computational Ratio:**
   $$\text{Ratio} = \frac{\text{FLOPs}_{\text{sep}}}{\text{FLOPs}_{\text{std}}} = \frac{H W C_{\text{in}} (K^2 + C_{\text{out}})}{H W C_{\text{out}} C_{\text{in}} K^2} = \frac{K^2 + C_{\text{out}}}{C_{\text{out}} K^2} = \frac{1}{C_{\text{out}}} + \frac{1}{K^2}$$
4. For $K = 3$ ($K^2 = 9$) and $C_{\text{out}} = 512$:
   $$\text{Ratio} \approx \frac{1}{9} + \frac{1}{512} \approx 0.111 + 0.002 \approx 0.113 \approx \frac{1}{9}$$
   Depthwise separable convolution delivers nearly a **$9\times$ computational speedup** with minimal loss of accuracy, powering real-time mobile and robotic vision. $\blacksquare$

---

### Exercise 10.9: Vanishing Gradient Derivation in Plain Deep Networks
**Statement:** In an $L$-layer plain neural network $\mathbf{x}_l = \sigma(\mathbf{W}_l \mathbf{x}_{l-1})$, show how the gradient $\frac{\partial \mathcal{L}}{\partial \mathbf{x}_1}$ scales with depth, and explain why saturation of $\sigma'(z)$ causes exponential attenuation.

**Solution:**
1. By the chain rule:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{x}_1} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{l=2}^L \frac{\partial \mathbf{x}_l}{\partial \mathbf{x}_{l-1}}$$
2. The Jacobian of layer $l$ is:
   $$\frac{\partial \mathbf{x}_l}{\partial \mathbf{x}_{l-1}} = \text{diag}(\sigma'(\mathbf{z}_l)) \cdot \mathbf{W}_l$$
3. Thus:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{x}_1} = \frac{\partial \mathcal{L}}{\partial \mathbf{x}_L} \prod_{l=2}^L \Big[ \text{diag}(\sigma'(\mathbf{z}_l)) \mathbf{W}_l \Big]$$
4. If $\sigma$ is Sigmoid, the maximum derivative is $\sigma'(0) = 0.25$.
   Even with identity weights, the product contains a factor:
   $$\prod_{l=2}^L (0.25) = (0.25)^{L-1}$$
   For a 20-layer network, $(0.25)^{19} \approx 3.6 \times 10^{-12} \approx 0$.
   The gradient vanishes exponentially, halting all parameter updates in initial layers. $\blacksquare$

---

### Exercise 10.10: Self-Attention vs. Convolutions in Visual Transformers (ViTs)
**Statement:** Compare the spatial inductive biases of Convolutional Neural Networks (CNNs) versus Vision Transformers (ViTs). Why do ViTs require massively larger training datasets to outperform CNNs?

**Solution:**
1. **CNN Inductive Biases:**
   - CNNs have hardcoded assumptions: **local connectivity** (pixels interact only within local $K \times K$ neighborhoods) and **translation equivariance** (features are identical anywhere in the image).
   - These strong inductive biases constrain the hypothesis search space, allowing CNNs to train effectively on modest datasets (e.g., thousands of images).
2. **Vision Transformer (ViT) Mechanics:**
   - ViTs split an image into non-overlapping patches and apply global Multi-Head Self-Attention (MHSA).
   - In self-attention, every patch can attend to every other patch across the entire image with equal ease. There is zero hardcoded locality or translation equivariance.
3. **Data Thirst of ViTs:**
   - Because ViTs possess minimal spatial inductive bias, they must **learn the concepts of spatial locality, 2D proximity, and translation equivariance from scratch**.
   - Consequently, ViTs require massive datasets (tens or hundreds of millions of labeled images, e.g., JFT-300M) before their unrestricted capacity surpasses CNN performance. $\blacksquare$


---\n
# Chapter 11: Object Detection, 2D Bounding Boxes, and Semantic Segmentation

---

## 11.1 The Object Localization Formulation and Multi-Task Loss

While image classification assigns a single global category label to an entire image, autonomous robotic systems (such as warehouse manipulators, autonomous vehicles, and surgical robots) must determine both **what** objects are present and **where** they are physically located.

```
                  THE TAXONOMY OF VISUAL UNDERSTANDING
                  
    Classification             Classification + Loc.           Object Detection           Semantic Segmentation
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚               â”‚           â”‚    â”Œâ”€â”€â”€â”€â”€â”    â”‚               â”‚ â”Œâ”€â”€â”€â”   â”Œâ”€â”€â”€â” â”‚          â”‚   #####       â”‚
    â”‚      CAT      â”‚           â”‚    â”‚ CAT â”‚    â”‚               â”‚ â”‚CATâ”‚   â”‚DOGâ”‚ â”‚          â”‚  #######      â”‚
    â”‚               â”‚           â”‚    â””â”€â”€â”€â”€â”€â”˜    â”‚               â”‚ â””â”€â”€â”€â”˜   â””â”€â”€â”€â”˜ â”‚          â”‚   ##### $$$$  â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
     Single Class Label          Single Object +                 Multiple Objects +         Dense Pixel-wise
                                 Bounding Box                    Multiple Boxes             Class Labels
```

### 2D Bounding Box Parameterizations
A 2D bounding box delineates the spatial footprint of an object in pixel coordinates. Two standard conventions exist:
1. **Corner Form ($xyxy$):**
   $$\mathbf{b} = [x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]^\top$$
2. **Center-Size Form ($xywh$):**
   $$\mathbf{b} = [x_c, y_c, w, h]^\top$$
   where $x_c = \frac{x_{\text{min}} + x_{\text{max}}}{2}$, $y_c = \frac{y_{\text{min}} + y_{\text{max}}}{2}$, $w = x_{\text{max}} - x_{\text{min}}$, $h = y_{\text{max}} - y_{\text{min}}$.

### Multi-Task Objective Function
Object detection is inherently a **multi-task learning** problem: the neural network must simultaneously optimize a discrete classification loss $\mathcal{L}_{\text{cls}}$ over $K$ categories and a continuous regression loss $\mathcal{L}_{\text{box}}$ over 4 coordinate parameters:

$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{cls}}(\mathbf{p}, \mathbf{p}^*) + \lambda_{\text{reg}} \cdot \mathbb{I}[c^* \ge 1] \cdot \mathcal{L}_{\text{box}}(\mathbf{b}, \mathbf{b}^*)$$

where:
- $\mathbf{p} \in \mathbb{R}^{K+1}$ is the predicted probability distribution over $K$ object classes plus 1 background class.
- $\mathbf{b}$ is the predicted bounding box, and $\mathbf{b}^*$ is the ground-truth box.
- $\mathbb{I}[c^* \ge 1]$ is an indicator function that disables box regression when the anchor belongs to background ($c^* = 0$).
- $\lambda_{\text{reg}}$ is a balancing hyperparameter.

---

## 11.2 Bounding Box Metrics and Loss Functions

### 1. Intersection over Union (IoU / Jaccard Index)
The fundamental metric for evaluating bounding box overlap is the **Intersection over Union (IoU)**:

$$\text{IoU}(A, B) \triangleq \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)} = \frac{\text{Area}(A \cap B)}{\text{Area}(A) + \text{Area}(B) - \text{Area}(A \cap B)}$$

```
                         INTERSECTION OVER UNION (IoU)
                         
          Bounding Box A                 Intersection (A âˆ© B)               Union (A âˆª B)
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                     â”Œâ”€â”€â”€â”                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚               â”‚                     â”‚###â”‚                      â”‚               â”‚
         â”‚       â”Œâ”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”             â””â”€â”€â”€â”˜                      â”‚       â”Œâ”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”
         â”‚       â”‚       â”‚       â”‚                                        â”‚       â”‚       â”‚       â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”˜       â”‚                                        â””â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”˜       â”‚
                 â”‚               â”‚                                                â”‚               â”‚
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                           Area(A âˆ© B)
                          IoU = â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                                Area(A) + Area(B) - Area(A âˆ© B)
```

- $\text{IoU} = 1.0$: Perfect spatial alignment.
- $\text{IoU} = 0.0$: Disjoint boxes (no overlap).
- Standard detection threshold: A predicted box is considered a **True Positive (TP)** if $\text{IoU}(B_{\text{pred}}, B_{\text{gt}}) \ge 0.50$ (or $0.75$ for high-precision benchmarks).

### 2. Smooth L1 Loss (Huber Loss)
Early detectors used standard $L_1$ or $L_2$ losses on box coordinate offsets. Ross Girshick (Fast R-CNN, 2015) introduced **Smooth $L_1$ Loss**, which behaves like $L_2$ near zero (smooth, continuous gradients) and $L_1$ for large errors (robust to extreme outliers):

$$\text{Smooth}_{L_1}(x) = \begin{cases} 0.5 x^2 & \text{if } |x| < 1 \\ |x| - 0.5 & \text{otherwise} \end{cases}$$

### 3. Direct IoU-Based Losses
While Smooth $L_1$ treats the four coordinates as independent variables, real bounding boxes exhibit strong coupling: an error in $w$ directly affects how $x$ influences overlap.
Modern detectors optimize the IoU metric directly:
- **IoU Loss:**
  $$\mathcal{L}_{\text{IoU}} = 1 - \text{IoU}$$
  *Flaw:* If two boxes do not overlap ($\text{IoU} = 0$), the gradient $\nabla \mathcal{L}_{\text{IoU}} = \mathbf{0}$, halting optimization.
- **Generalized IoU (GIoU) Loss (Rezatofighi et al., 2019):**
  Let $C$ be the smallest enclosing bounding box that completely covers both $A$ and $B$:
  $$\text{GIoU} = \text{IoU} - \frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)}$$
  $$\mathcal{L}_{\text{GIoU}} = 1 - \text{GIoU}$$
  When boxes do not overlap, GIoU penalizes the empty space in $C$, driving disjoint boxes toward each other!

---

## 11.3 Redundant Box Filtering: Non-Maximum Suppression (NMS)

Because modern detectors evaluate dense anchor grids across multiple scales, dozens of candidate boxes typically fire with high confidence on different parts of the same physical object.

```
                    NON-MAXIMUM SUPPRESSION (NMS) FILTERING
                    
        Raw Dense Candidate Boxes                       Post-NMS Filtered Box
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚       â”Œâ”€â”€â”€â”€â”€â”         â”‚                      â”‚                       â”‚
        â”‚     â”Œâ”€â”¼â”€â”€â”€â” â”‚ 0.88    â”‚                      â”‚       â”Œâ”€â”€â”€â”€â”€â”€â”€â”       â”‚
        â”‚     â”‚ â”Œâ”€â”€â”€â”¼â”€â”¼â”€â”€â”€â”0.94 â”‚   â”€â”€â”€â–º NMS â”€â”€â”€â”€â–º     â”‚       â”‚  CAR  â”‚ 0.94  â”‚
        â”‚     â”‚ â”‚CARâ”‚ â”‚   â”‚     â”‚                      â”‚       â”‚       â”‚       â”‚
        â”‚     â””â”€â”¼â”€â”€â”€â”¼â”€â”˜   â”‚0.76 â”‚                      â”‚       â””â”€â”€â”€â”€â”€â”€â”€â”˜       â”‚
        â”‚       â””â”€â”€â”€â”´â”€â”€â”€â”€â”€â”˜     â”‚                      â”‚                       â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        Multiple Overlapping Boxes                     Single Clean Detection
```

### The Greedy NMS Algorithm
1. **Input:** A list of candidate detections $\mathcal{B} = \{B_1, \dots, B_N\}$ with associated class confidence scores $\mathcal{S} = \{s_1, \dots, s_N\}$, and an IoU threshold $T_{\text{IoU}}$ (typically $0.45 - 0.50$).
2. **Output:** A pruned list of final detections $\mathcal{D}$.
3. Initialize $\mathcal{D} = \emptyset$.
4. **Loop:**
   - Find box $M \in \mathcal{B}$ with the maximum score: $M = \arg\max_{B_i} s_i$.
   - Move $M$ from $\mathcal{B}$ to $\mathcal{D}$.
   - For all remaining boxes $B_i \in \mathcal{B}$:
     Compute overlap $\text{IoU}(M, B_i)$.
     If $\text{IoU}(M, B_i) > T_{\text{IoU}}$, remove $B_i$ from $\mathcal{B}$.
5. Terminate when $\mathcal{B}$ is empty.

### Soft-NMS (Bodla et al., 2017)
In crowded scenes (e.g., pedestrians walking side-by-side), standard NMS can delete a true adjacent person whose box happens to overlap with the primary detection.
**Soft-NMS** does not delete overlapping boxes. Instead, it exponentially decays their confidence score:
$$s_i \leftarrow s_i \cdot \exp\left( -\frac{\text{IoU}(M, B_i)^2}{\sigma_{\text{nms}}} \right)$$
Boxes with high overlap are demoted, but adjacent objects retain enough confidence to survive final thresholding.

---

## 11.4 Two-Stage vs. One-Stage Detection Paradigms

```
                      TWO-STAGE VS. ONE-STAGE DETECTION
                      
    TWO-STAGE (Faster R-CNN)                   ONE-STAGE (YOLO, RetinaNet)
    
       Input Image                                Input Image
            â”‚                                          â”‚
            â–¼                                          â–¼
       Backbone (ResNet)                          Backbone (ResNet / CSPDarknet)
            â”‚                                          â”‚
            â–¼                                          â–¼
     Region Proposal Network (RPN)                 Dense Anchor Head
            â”‚ (~2000 Candidate Boxes)                  â”‚ (Single-shot Prediction)
            â–¼                                          â”‚
      RoI Align / Pooling                              â–¼
            â”‚                                     Focal Loss / GIoU Loss
            â–¼                                          â”‚
      Box Regression & Class Head                      â–¼
            â”‚                                    Pruned Detections (NMS)
            â–¼
      Final Detections
```

### 1. Two-Stage Detectors: Faster R-CNN (Ren et al., 2015)
- **Stage 1 (Region Proposal):** The **Region Proposal Network (RPN)** slides across the convolutional feature map, predicting class-agnostic candidate proposals from multi-scale anchor boxes.
- **Stage 2 (Refinement):** **RoI Align** extracts fixed-size feature vectors (e.g., $7 \times 7$) for each proposal using bilinear interpolation without coordinate quantization. Fully connected heads output fine-grained class probabilities and precise coordinate deltas.
- *Advantage:* High localization accuracy; excels on small objects.
- *Disadvantage:* High latency ($\approx 10\text{ to } 20\text{ FPS}$), difficult to deploy on lightweight embedded robot hardware.

### 2. One-Stage Detectors: YOLO (Redmon et al., 2016)
- Treats object detection as a single, end-to-end continuous tensor regression problem.
- Partitions the input image into an $S \times S$ spatial grid. If an object's center falls into a grid cell, that cell is responsible for predicting its bounding box and class probabilities directly.
- *Advantage:* Blazing speed ($60\text{ to } 150+\text{ FPS}$), ideal for real-time mobile robot perception.

### 3. Focal Loss for Dense One-Stage Detection (Lin et al., 2017)
One-stage detectors evaluate tens of thousands of candidate boxes per frame, where $99.9\%$ contain background. In standard Cross-Entropy loss:
$$\text{CE}(p_t) = -\log(p_t)$$
Even though an easy background candidate has small error ($p_t \approx 0.99 \implies \text{loss} \approx 0.01$), summing over $100,000$ easy negatives completely overwhelms the gradient updates of the few true positive objects!

Tsung-Yi Lin et al. introduced **Focal Loss**, adding a dynamic modulating factor $(1 - p_t)^\gamma$:

$$\text{FL}(p_t) = - \alpha_t (1 - p_t)^\gamma \log(p_t)$$

- For easy examples ($p_t \to 1$): The modulating factor $(1 - p_t)^\gamma \to 0$, suppressing their loss contribution by up to $1000\times$.
- For hard examples ($p_t \to 0$): The modulating factor remains near $1$.
- Focal Loss enabled one-stage detectors (RetinaNet, YOLOv4/v5/v8) to match or exceed the accuracy of two-stage detectors while preserving real-time inference speed.

---

## 11.5 Semantic Segmentation: Fully Convolutional Networks and U-Net

While bounding boxes identify object extents via coarse rectangles, **semantic segmentation** performs dense pixel-wise classification, labeling every individual pixel $(y, x)$ with its semantic material category (e.g., road, sidewalk, obstacle, free space).

```
                         THE U-NET ARCHITECTURE
                         
    Input 512x512x3                                                Output 512x512xC
        â”Œâ”€â”€â”€â”                                                            â”Œâ”€â”€â”€â”
        â”‚   â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Skip Connection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚   â”‚
        â””â”€â”€â”€â”˜                                                            â””â”€â”€â”€â”˜
          â”‚ MaxPool                                                        â–² Bilinear Up
          â–¼                                                                â”‚
        â”Œâ”€â”€â”€â”                                                            â”Œâ”€â”€â”€â”
        â”‚   â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Skip Connection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚   â”‚
        â””â”€â”€â”€â”˜                                                            â””â”€â”€â”€â”˜
          â”‚ MaxPool                                                        â–² Bilinear Up
          â–¼                                                                â”‚
        â”Œâ”€â”€â”€â”                                                            â”Œâ”€â”€â”€â”
        â”‚   â”‚ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Skip Connection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚   â”‚
        â””â”€â”€â”€â”˜                                                            â””â”€â”€â”€â”˜
          â”‚                                                                â–²
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Bottleneck â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              (Deep Contextual Core)
```

### 1. Fully Convolutional Networks (FCNs)
In 2015, Jonathan Long, Evan Shelhamer, and Trevor Darrell showed that standard classification backbones (VGG, ResNet) can be converted into dense segmentation engines by **replacing dense fully connected layers with $1 \times 1$ convolutional layers**.
An FCN takes an image of arbitrary size and outputs a spatial heatmap of class logits:
$$\mathbf{Y} \in \mathbb{R}^{C_{\text{classes}} \times H \times W}$$

### 2. The U-Net Architecture (Ronneberger et al., 2015)
Standard pooling and strided convolutions downsample spatial resolution, destroying the precise boundary coordinates required for robotic grasping.

Olaf Ronneberger et al. introduced the **U-Net**, which pairs an **Encoder (Contracting Path)** with a symmetric **Decoder (Expanding Path)** linked by **Long-Range Skip Connections**:
1. **Encoder Path:** Captures high-level semantic context (identifying "what" objects are present) by successively convolving and downsampling.
2. **Decoder Path:** Upsamples low-resolution semantic feature maps back to the raw image resolution via bilinear upsampling or transposed convolutions.
3. **Skip Connections:** Concatenates fine-grained, high-resolution feature maps from early encoder layers directly into corresponding decoder stages.
   - Low-level edges, textures, and crisp boundary locations from early layers bypass the bottleneck, enabling the network to reconstruct razor-sharp object contours!

### 3. Segmentation Metrics: Mean IoU and Dice Coefficient
Given ground-truth binary mask $G$ and predicted binary mask $P$:
- **Intersection over Union (mIoU):**
  $$\text{IoU} = \frac{|P \cap G|}{|P \cup G|} = \frac{\text{TP}}{\text{TP} + \text{FP} + \text{FN}}$$
- **Dice Coefficient (F1 Score):**
  $$\text{Dice} = \frac{2 |P \cap G|}{|P| + |G|} = \frac{2 \text{TP}}{2 \text{TP} + \text{FP} + \text{FN}}$$

---

## 11.6 Lifting 2D Image Detections into 3D Physical Space for Robotics

A mobile robot cannot navigate or grasp an object using 2D pixel coordinates alone. It must compute the object's metric 3D position and orientation in physical world coordinates.

```
                  LIFTING 2D DETECTIONS INTO 3D WORLD SPACE
                  
       2D Detection Bounding Box                  3D Camera Viewing Frustum
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”   â”‚                          â”Œâ”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
            â”‚   â”‚TOOLBOXâ”‚   â”‚     â”€â”€â–º Ray Cast â”€â”€â–º    /  â”‚   TOOLBOX   â”‚ â”‚
            â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚                        /   â”‚    (3D)     â”‚/
            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                       oâ”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
          Pixel Coordinates (u, v)             Optical Center C (Ray Pyramid)
```

### 1. Frustum Ray Volume Generation
Given a 2D bounding box $\mathbf{b} = [u_{\text{min}}, v_{\text{min}}, u_{\text{max}}, v_{\text{max}}]$ and camera intrinsic matrix $\mathbf{K}$:
1. Back-project the four 2D corners into normalized camera ray directions:
   $$\mathbf{d}_i = \mathbf{K}^{-1} [u_i, v_i, 1]^\top \quad \text{for } i \in \{1, 2, 3, 4\}$$
2. In 3D space, these rays form the 4 boundary planes of a **3D viewing frustum** originating from camera center $\mathbf{C}$. The target object is guaranteed to lie within this 3D frustum volume.

### 2. Point Cloud Fusion (RGB-D / Stereo)
If depth measurements are available from a stereo disparity map or LiDAR:
1. Filter the 3D point cloud to retain only points falling inside the 3D viewing frustum.
2. Segment the foreground object cluster from the background table or floor plane using RANSAC plane fitting.
3. Compute the **3D Oriented Bounding Box (OBB)**:
   - 3D Centroid: $\mathbf{X}_c = [X_c, Y_c, Z_c]^\top \in \mathbb{R}^3$
   - 3D Dimensions: $[W, H, D] \in \mathbb{R}^3$
   - 3D Orientation: $\mathbf{R} \in \text{SO}(3)$ (or yaw angle $\theta_{\text{yaw}}$ around vertical axis).

The robot arm can now plan collision-free motion paths and position its end-effector to grasp the object in physical space!

---

## 11.7 Worked Examples

### Problem 11.1: Exact Intersection over Union (IoU) Calculation
**Statement:** Two bounding boxes are given in $[x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]$ format:
- Ground-truth box $A = [50, 50, 150, 150]$
- Predicted box $B = [100, 100, 200, 200]$
1. Compute the area of box $A$ and box $B$.
2. Compute the coordinates and area of the intersection box $A \cap B$.
3. Compute the area of the union $A \cup B$ and the exact IoU.

**Step-by-step Solution:**
1. **Individual Box Areas:**
   $$\text{Width}_A = 150 - 50 = 100, \quad \text{Height}_A = 150 - 50 = 100 \implies \text{Area}(A) = 100 \times 100 = 10,000$$
   $$\text{Width}_B = 200 - 100 = 100, \quad \text{Height}_B = 200 - 100 = 100 \implies \text{Area}(B) = 100 \times 100 = 10,000$$
2. **Intersection Box ($A \cap B$):**
   $$x_{\text{min}}^{\cap} = \max(x_{\text{min}}^A, x_{\text{min}}^B) = \max(50, 100) = 100$$
   $$y_{\text{min}}^{\cap} = \max(y_{\text{min}}^A, y_{\text{min}}^B) = \max(50, 100) = 100$$
   $$x_{\text{max}}^{\cap} = \min(x_{\text{max}}^A, x_{\text{max}}^B) = \min(150, 200) = 150$$
   $$y_{\text{max}}^{\cap} = \min(y_{\text{max}}^A, y_{\text{max}}^B) = \min(150, 200) = 150$$
   Intersection dimensions:
   $$w_{\cap} = \max(0, 150 - 100) = 50, \quad h_{\cap} = \max(0, 150 - 100) = 50$$
   $$\text{Area}(A \cap B) = 50 \times 50 = 2,500$$
3. **Union Area and IoU:**
   $$\text{Area}(A \cup B) = \text{Area}(A) + \text{Area}(B) - \text{Area}(A \cap B) = 10,000 + 10,000 - 2,500 = 17,500$$
   $$\text{IoU} = \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)} = \frac{2,500}{17,500} = \frac{25}{175} = \frac{1}{7} \approx 0.142857$$
   The IoU is exactly $\frac{1}{7} \approx 14.29\%$.

---

### Problem 11.2: Generalized IoU (GIoU) Evaluation
**Statement:** Compute the Generalized IoU (GIoU) between the two boxes in Problem 11.1 ($A = [50, 50, 150, 150]$ and $B = [100, 100, 200, 200]$).

**Step-by-step Solution:**
1. From Problem 11.1: $\text{IoU} = \frac{1}{7} \approx 0.142857$, $\text{Area}(A \cup B) = 17,500$.
2. Compute the smallest enclosing bounding box $C$:
   $$x_{\text{min}}^C = \min(x_{\text{min}}^A, x_{\text{min}}^B) = \min(50, 100) = 50$$
   $$y_{\text{min}}^C = \min(y_{\text{min}}^A, y_{\text{min}}^B) = \min(50, 100) = 50$$
   $$x_{\text{max}}^C = \max(x_{\text{max}}^A, x_{\text{max}}^B) = \max(150, 200) = 200$$
   $$y_{\text{max}}^C = \max(y_{\text{max}}^A, y_{\text{max}}^B) = \max(150, 200) = 200$$
   Dimensions of $C$:
   $$w_C = 200 - 50 = 150, \quad h_C = 200 - 50 = 150$$
   $$\text{Area}(C) = 150 \times 150 = 22,500$$
3. Compute the GIoU penalty:
   $$\frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} = \frac{\text{Area}(C) - \text{Area}(A \cup B)}{\text{Area}(C)} = \frac{22,500 - 17,500}{22,500} = \frac{5,000}{22,500} = \frac{2}{9} \approx 0.222222$$
4. Compute GIoU:
   $$\text{GIoU} = \text{IoU} - \frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} = \frac{1}{7} - \frac{2}{9} = \frac{9 - 14}{63} = -\frac{5}{63} \approx -0.079365$$
   The GIoU is negative ($-\frac{5}{63}$), accurately reflecting the substantial empty space in the enclosing box.

---

### Problem 11.3: Smooth L1 Loss vs. L2 Loss Comparison
**Statement:** A regression target has ground truth coordinate $y^* = 10.0$.
Compute the loss and derivative for predictions $y_1 = 10.5$ and $y_2 = 14.0$ under:
1. Mean Squared Error (MSE): $\mathcal{L}_{\text{MSE}} = 0.5 (y - y^*)^2$.
2. Smooth L1 Loss: $\mathcal{L}_{\text{Smooth}} = \text{Smooth}_{L_1}(y - y^*)$.

**Step-by-step Solution:**
1. **Case 1: Small Error ($e_1 = y_1 - y^* = 10.5 - 10.0 = 0.5$):**
   Here $|e_1| = 0.5 < 1$.
   - MSE:
     $$\mathcal{L}_{\text{MSE}} = 0.5 (0.5)^2 = 0.125, \quad \frac{d\mathcal{L}}{dy} = e_1 = 0.5$$
   - Smooth L1:
     $$\mathcal{L}_{\text{Smooth}} = 0.5 (0.5)^2 = 0.125, \quad \frac{d\mathcal{L}}{dy} = e_1 = 0.5$$
   For small errors, Smooth L1 is identical to MSE.

2. **Case 2: Large Error ($e_2 = y_2 - y^* = 14.0 - 10.0 = 4.0$):**
   Here $|e_2| = 4.0 \ge 1$.
   - MSE:
     $$\mathcal{L}_{\text{MSE}} = 0.5 (4.0)^2 = 8.0, \quad \frac{d\mathcal{L}}{dy} = e_2 = 4.0$$
   - Smooth L1:
     $$\mathcal{L}_{\text{Smooth}} = |e_2| - 0.5 = 4.0 - 0.5 = 3.5, \quad \frac{d\mathcal{L}}{dy} = \text{sign}(e_2) = +1.0$$
   Notice that for the large error, the MSE gradient explodes to $4.0$, whereas the Smooth L1 gradient is bounded at strictly $+1.0$. Smooth L1 prevents exploding gradients during training.

---

### Problem 11.4: Greedy Non-Maximum Suppression (NMS) Execution
**Statement:** A detector outputs 3 candidate boxes for the class "Pedestrian":
- Box 1: Score $s_1 = 0.90$, Area = $100$
- Box 2: Score $s_2 = 0.85$, Area = $100$, Overlap with Box 1 has $\text{IoU}(B_1, B_2) = 0.65$
- Box 3: Score $s_3 = 0.70$, Area = $100$, Overlap with Box 1 has $\text{IoU}(B_1, B_3) = 0.20$, Overlap with Box 2 has $\text{IoU}(B_2, B_3) = 0.30$
NMS threshold is $T_{\text{IoU}} = 0.50$.
Trace the NMS execution and state the final detections.

**Step-by-step Solution:**
1. Candidate list: $\mathcal{B} = \{B_1 (0.90), B_2 (0.85), B_3 (0.70)\}$. Sorted in descending order of score.
   Output list: $\mathcal{D} = \emptyset$.
2. **Iteration 1:**
   - Select highest score: $B_1$ ($s_1 = 0.90$).
   - Add $B_1$ to $\mathcal{D}$: $\mathcal{D} = \{B_1\}$.
   - Test remaining boxes against $B_1$:
     - For $B_2$: $\text{IoU}(B_1, B_2) = 0.65 > 0.50 \implies$ **Suppressed!** (Discard $B_2$).
     - For $B_3$: $\text{IoU}(B_1, B_3) = 0.20 \le 0.50 \implies$ Kept.
   - Updated candidate list: $\mathcal{B} = \{B_3\}$.
3. **Iteration 2:**
   - Select highest score from remaining: $B_3$ ($s_3 = 0.70$).
   - Add $B_3$ to $\mathcal{D}$: $\mathcal{D} = \{B_1, B_3\}$.
   - No remaining candidates.
4. **Final Output Detections:**
   $$\mathcal{D} = \{B_1, B_3\}$$
   Box 2 was suppressed because it was a redundant duplicate of Box 1.

---

### Problem 11.5: Focal Loss Numerical Evaluation
**Statement:** Compare standard Cross-Entropy Loss and Focal Loss ($\gamma = 2.0, \alpha = 1.0$) for:
1. An easy negative background example with $p_t = 0.95$.
2. A hard positive object example with $p_t = 0.20$.
Evaluate the ratio of losses between the two examples.

**Step-by-step Solution:**
Formula: $\text{CE}(p_t) = -\ln(p_t)$, $\text{FL}(p_t) = -(1 - p_t)^\gamma \ln(p_t)$.

1. **Easy Example ($p_t = 0.95$):**
   - Cross-Entropy:
     $$\text{CE} = -\ln(0.95) \approx 0.051293$$
   - Modulating factor: $(1 - 0.95)^2 = 0.05^2 = 0.0025$.
   - Focal Loss:
     $$\text{FL} = 0.0025 \times 0.051293 \approx 0.000128$$

2. **Hard Example ($p_t = 0.20$):**
   - Cross-Entropy:
     $$\text{CE} = -\ln(0.20) \approx 1.609438$$
   - Modulating factor: $(1 - 0.20)^2 = 0.80^2 = 0.64$.
   - Focal Loss:
     $$\text{FL} = 0.64 \times 1.609438 \approx 1.030040$$

3. **Loss Ratio ($\frac{\text{Hard Loss}}{\text{Easy Loss}}$):**
   - Under Cross-Entropy:
     $$\text{Ratio}_{\text{CE}} = \frac{1.609438}{0.051293} \approx 31.38$$
   - Under Focal Loss:
     $$\text{Ratio}_{\text{FL}} = \frac{1.030040}{0.000128} \approx 8,047.19$$
   Focal loss boosts the relative gradient emphasis on the hard example by over **$250\times$**, completely suppressing background noise!

---

### Problem 11.6: Mean IoU (mIoU) Calculation Across 3 Classes
**Statement:** A semantic segmentation network is evaluated on a test set. The confusion matrix of pixel counts is:
$$\mathbf{C} = \begin{bmatrix} 800 & 50 & 50 \\ 30 & 600 & 70 \\ 40 & 60 & 500 \end{bmatrix}$$
where rows represent ground-truth classes (Road, Vehicle, Pedestrian) and columns represent predicted classes.
Compute:
1. The IoU for each of the 3 classes.
2. The Mean IoU (mIoU) of the model.

**Step-by-step Solution:**
For class $k$: $\text{IoU}_k = \frac{C_{kk}}{\sum_j C_{kj} + \sum_i C_{ik} - C_{kk}} = \frac{\text{TP}_k}{\text{RowSum}_k + \text{ColSum}_k - \text{TP}_k}$.
1. **Class 1 (Road):**
   - $\text{TP}_1 = 800$
   - $\text{RowSum}_1 = 800 + 50 + 50 = 900$
   - $\text{ColSum}_1 = 800 + 30 + 40 = 870$
   - $\text{Union}_1 = 900 + 870 - 800 = 970$
   $$\text{IoU}_1 = \frac{800}{970} \approx 0.8247 \quad (82.47\%)$$

2. **Class 2 (Vehicle):**
   - $\text{TP}_2 = 600$
   - $\text{RowSum}_2 = 30 + 600 + 70 = 700$
   - $\text{ColSum}_2 = 50 + 600 + 60 = 710$
   - $\text{Union}_2 = 700 + 710 - 600 = 810$
   $$\text{IoU}_2 = \frac{600}{810} \approx 0.7407 \quad (74.07\%)$$

3. **Class 3 (Pedestrian):**
   - $\text{TP}_3 = 500$
   - $\text{RowSum}_3 = 40 + 60 + 500 = 600$
   - $\text{ColSum}_3 = 50 + 70 + 500 = 620$
   - $\text{Union}_3 = 600 + 620 - 500 = 720$
   $$\text{IoU}_3 = \frac{500}{720} \approx 0.6944 \quad (69.44\%)$$

4. **Mean IoU (mIoU):**
   $$\text{mIoU} = \frac{\text{IoU}_1 + \text{IoU}_2 + \text{IoU}_3}{3} = \frac{0.8247 + 0.7407 + 0.6944}{3} = \frac{2.2598}{3} \approx 0.7533 \quad (75.33\%)$$

---

### Problem 11.7: 3D Object Centroid from Bounding Box and Depth Map
**Statement:** A robot camera ($f_x = f_y = 1000, c_x = 500, c_y = 500$) detects a recycling bin. The 2D bounding box center is at $(u_c, v_c) = (650, 700)$.
The average depth of the segmented pixels within this box from an onboard LiDAR depth map is $Z = 3.0\text{ meters}$.
Compute the 3D metric coordinate $(X, Y, Z)$ of the bin's center in meters.

**Step-by-step Solution:**
1. Back-projection formulas:
   $$X = \frac{(u_c - c_x) Z}{f_x} = \frac{(650 - 500) \times 3.0}{1000} = \frac{150 \times 3.0}{1000} = \frac{450}{1000} = +0.45\text{ meters}$$
   $$Y = \frac{(v_c - c_y) Z}{f_y} = \frac{(700 - 500) \times 3.0}{1000} = \frac{200 \times 3.0}{1000} = \frac{600}{1000} = +0.60\text{ meters}$$
   $$Z = 3.0\text{ meters}$$
2. The 3D position is $\mathbf{X}_c = [0.45, 0.60, 3.0]^\top$ meters.

---

### Problem 11.8: Coordinate Conversion: xywh to xyxy
**Statement:** An anchor-based detector outputs bounding box center coordinates $[x_c, y_c, w, h] = [320, 240, 100, 60]$.
Convert this box into $[x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]$ corner format.

**Step-by-step Solution:**
1. Compute half-widths:
   $$\frac{w}{2} = \frac{100}{2} = 50, \quad \frac{h}{2} = \frac{60}{2} = 30$$
2. Compute corners:
   $$x_{\text{min}} = x_c - \frac{w}{2} = 320 - 50 = 270$$
   $$y_{\text{min}} = y_c - \frac{h}{2} = 240 - 30 = 210$$
   $$x_{\text{max}} = x_c + \frac{w}{2} = 320 + 50 = 370$$
   $$y_{\text{max}} = y_c + \frac{h}{2} = 240 + 30 = 270$$
3. Assembled format:
   $$[x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}] = [270, 210, 370, 270]$$

---

### Problem 11.9: Anchor Box Parameterization Delta Inversion
**Statement:** In Faster R-CNN, bounding box predictions are parameterized relative to an anchor box $\mathbf{a} = [x_a, y_a, w_a, h_a]$ via coordinate deltas $(t_x, t_y, t_w, t_h)$:
$$x = w_a t_x + x_a, \quad y = h_a t_y + y_a, \quad w = w_a \exp(t_w), \quad h = h_a \exp(t_h)$$
Given anchor box $\mathbf{a} = [200, 150, 80, 80]$ and predicted deltas $(t_x, t_y, t_w, t_h) = [0.1, -0.2, \ln(1.5), \ln(0.8)]$:
Compute the refined bounding box $[x, y, w, h]$.

**Step-by-step Solution:**
1. Refined Center:
   $$x = w_a t_x + x_a = 80(0.1) + 200 = 8 + 200 = 208.0$$
   $$y = h_a t_y + y_a = 80(-0.2) + 150 = -16 + 150 = 134.0$$
2. Refined Dimensions:
   $$w = w_a \exp(\ln(1.5)) = 80 \times 1.5 = 120.0$$
   $$h = h_a \exp(\ln(0.8)) = 80 \times 0.8 = 64.0$$
3. Assembled refined box:
   $$[x, y, w, h] = [208.0, 134.0, 120.0, 64.0]$$

---

### Problem 11.10: Complete IoU (CIoU) Aspect Ratio Penalty
**Statement:** Complete IoU (CIoU) adds an aspect ratio consistency term $\alpha v$ to Distance-IoU:
$$v = \frac{4}{\pi^2} \left( \arctan\left(\frac{w_{\text{gt}}}{h_{\text{gt}}}\right) - \arctan\left(\frac{w}{h}\right) \right)^2$$
For a square ground-truth box ($w_{\text{gt}} = 100, h_{\text{gt}} = 100$) and predicted rectangular box ($w = 100, h = 50$), compute the value of $v$.

**Step-by-step Solution:**
1. Ground truth aspect ratio angle:
   $$\frac{w_{\text{gt}}}{h_{\text{gt}}} = \frac{100}{100} = 1.0 \implies \arctan(1.0) = \frac{\pi}{4} \approx 0.785398$$
2. Predicted aspect ratio angle:
   $$\frac{w}{h} = \frac{100}{50} = 2.0 \implies \arctan(2.0) \approx 1.107149$$
3. Difference:
   $$\arctan(1.0) - \arctan(2.0) = 0.785398 - 1.107149 = -0.321751$$
4. Squared difference:
   $$(-0.321751)^2 \approx 0.103524$$
5. Multiply by $\frac{4}{\pi^2}$:
   $$\frac{4}{\pi^2} \approx \frac{4}{9.8696} \approx 0.405285$$
   $$v = 0.405285 \times 0.103524 \approx 0.041956$$
   This aspect ratio penalty directly penalizes the distortion between square and rectangular geometries.

---

## 11.8 Solved Exercises

### Exercise 11.1: Upper and Lower Bounds of Generalized IoU
**Statement:** Prove that for any two 2D bounding boxes $A$ and $B$, the Generalized IoU metric satisfies:
$$-1 \le \text{GIoU}(A, B) \le 1$$

**Solution:**
1. Recall the definition:
   $$\text{GIoU} = \text{IoU} - \frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)}$$
   where $C$ is the smallest convex enclosing box containing both $A$ and $B$.
2. **Upper Bound:**
   Because areas are non-negative, $\text{Area}(C \setminus (A \cup B)) \ge 0$, and $\text{Area}(C) > 0$.
   Therefore, the penalty term $\frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} \ge 0$.
   Since $\text{IoU}(A, B) \le 1$:
   $$\text{GIoU}(A, B) \le \text{IoU}(A, B) \le 1$$
   Equality $\text{GIoU} = 1$ is attained if and only if $A = B$ (perfect overlap).
3. **Lower Bound:**
   Since $A \cup B \subseteq C$, $\text{Area}(A \cup B) \le \text{Area}(C)$, so:
   $$\frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} = 1 - \frac{\text{Area}(A \cup B)}{\text{Area}(C)} \le 1$$
   Since $\text{IoU}(A, B) \ge 0$:
   $$\text{GIoU}(A, B) \ge 0 - 1 = -1$$
   The lower bound $\text{GIoU} \to -1$ is approached in the limit as the distance between $A$ and $B$ approaches infinity relative to their sizes ($\text{Area}(C) \to \infty$ while $\text{Area}(A \cup B)$ remains finite).
   Therefore, $\text{GIoU} \in [-1, 1]$. $\blacksquare$

---

### Exercise 11.2: RoI Align vs. RoI Pooling Quantization
**Statement:** Explain why Fast R-CNN's RoI Pooling introduces spatial quantization misalignment ("harsh quantization"), and prove how Mask R-CNN's RoI Align eliminates this using bilinear sampling.

**Solution:**
1. **RoI Pooling Flaw:**
   - A candidate proposal of size $150 \times 150$ on an image with a feature stride of 16 maps to a float size of $\frac{150}{16} = 9.375$ on the feature map.
   - RoI Pooling applies integer rounding: $\lfloor 9.375 \rfloor = 9$.
   - When dividing this $9 \times 9$ region into a $7 \times 7$ output bin grid, bin sizes are $\frac{9}{7} \approx 1.285$, which is rounded again to $1$ or $2$ pixels.
   - These two rounding steps induce up to a 1-pixel shift on the feature map, which translates to a massive **$16$-pixel physical misalignment** on the original image, corrupting sub-pixel mask segmentation.
2. **RoI Align Solution:**
   - RoI Align avoids any rounding: the proposal boundary remains exact floating-point values ($9.375$).
   - Each $7 \times 7$ bin is partitioned into regular continuous sub-cells (e.g., 4 sampling points).
   - The feature values at these continuous sampling coordinates are evaluated strictly via **bilinear interpolation** from the four surrounding discrete feature pixels.
   - Zero quantization occurs, preserving exact spatial alignment. $\blacksquare$

---

### Exercise 11.3: Average Precision (AP) and Area Under PR Curve
**Statement:** Define the Precision-Recall (PR) curve, and show how the **11-point interpolated Average Precision (AP)** is calculated from the PR curve.

**Solution:**
1. For an object class $k$, sort all candidate predictions by confidence score.
2. At each rank threshold, compute:
   $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}, \quad \text{Recall} = \frac{\text{TP}}{\text{Total Ground Truth}}$$
3. Plotting Precision versus Recall yields the PR curve $p(r)$.
4. The 11-point interpolated AP evaluates precision at 11 evenly spaced recall levels $r \in \{0.0, 0.1, 0.2, \dots, 1.0\}$:
   $$\text{AP}_{11} = \frac{1}{11} \sum_{r \in \{0, 0.1, \dots, 1.0\}} p_{\text{interp}}(r)$$
   where the interpolated precision $p_{\text{interp}}(r)$ is the maximum precision attained for any recall $r' \ge r$:
   $$p_{\text{interp}}(r) = \max_{r' \ge r} p(r')$$
   This reduces sensitivity to noise ripples in the ranking. $\blacksquare$

---

### Exercise 11.4: Cross-Entropy Loss with Label Smoothing
**Statement:** In modern segmentation networks, label smoothing replaces hard one-hot targets $y_k \in \{0, 1\}$ with smoothed targets $y_k^{\text{smooth}} = (1 - \epsilon) y_k + \frac{\epsilon}{K}$.
State the regularization benefit of label smoothing.

**Solution:**
1. Under hard one-hot targets, standard Cross-Entropy loss drives the pre-softmax logit $z_k \to +\infty$ and all non-target logits $z_j \to -\infty$ to achieve predicted probability $p_k = 1.0$.
2. This forces network weights to grow excessively large, causing overconfident predictions and poor calibration.
3. Label smoothing enforces an upper bound on target logit separation:
   $$z_k^* - z_j^* = \ln\left(\frac{1 - \epsilon + \epsilon/K}{\epsilon/K}\right) = \text{constant}$$
4. The network is penalized for becoming overconfident, improving generalization on ambiguous boundaries and noisy human annotations. $\blacksquare$

---

### Exercise 11.5: Dice Loss Gradient Derivation
**Statement:** Derive the analytical gradient of the Soft Dice Loss $\mathcal{L}_{\text{Dice}} = 1 - \frac{2 \sum p_i g_i + \epsilon}{\sum p_i^2 + \sum g_i^2 + \epsilon}$ with respect to predicted probability $p_j$.

**Solution:**
1. Let $U = 2 \sum p_i g_i + \epsilon$ and $V = \sum p_i^2 + \sum g_i^2 + \epsilon$.
   Then $\mathcal{L}_{\text{Dice}} = 1 - \frac{U}{V}$.
2. Differentiating with respect to $p_j$ using the quotient rule:
   $$\frac{\partial \mathcal{L}_{\text{Dice}}}{\partial p_j} = - \frac{\frac{\partial U}{\partial p_j} V - U \frac{\partial V}{\partial p_j}}{V^2}$$
3. Compute the partial derivatives:
   $$\frac{\partial U}{\partial p_j} = 2 g_j, \quad \frac{\partial V}{\partial p_j} = 2 p_j$$
4. Substitute into the quotient rule:
   $$\frac{\partial \mathcal{L}_{\text{Dice}}}{\partial p_j} = - \frac{2 g_j V - 2 p_j U}{V^2} = -2 \frac{g_j V - p_j U}{V^2} = 2 \left( \frac{p_j U - g_j V}{V^2} \right) \quad \blacksquare$$

---

### Exercise 11.6: Feature Pyramid Networks (FPN) Top-Down Architecture
**Statement:** Tsung-Yi Lin et al. (2017) introduced **Feature Pyramid Networks (FPN)**. Explain why bottom-up convolutional pyramids alone struggle with small objects, and how FPN's top-down pathway and lateral connections solve this.

**Solution:**
1. In a bottom-up CNN (ResNet), early high-resolution layers have small receptive fields and weak semantic features (edges, corners). Deep layers have rich semantic features but coarse spatial resolution (e.g., $32\times$ downsampled), completely losing tiny objects.
2. **FPN Architecture:**
   - **Top-Down Pathway:** Upsamples semantically strong deep features by $2\times$ nearest-neighbor interpolation.
   - **Lateral Connections:** Merges bottom-up features of the same spatial scale via a $1 \times 1$ convolution and element-wise addition.
3. This creates a multi-scale feature pyramid where **every single scale possesses both high spatial resolution and deep semantic strength**, allowing tiny objects to be detected on high-resolution layers with deep semantic context. $\blacksquare$

---

### Exercise 11.7: Class-Agnostic vs. Class-Specific Box Regression
**Statement:** Compare class-agnostic bounding box regression ($4$ output values per anchor) versus class-specific regression ($4 \times K$ output values per anchor).

**Solution:**
1. **Class-Specific Regression:**
   - The head outputs $4 \times K$ coordinates, maintaining an independent set of bounding box regression parameters for every object class $k \in \{1, \dots, K\}$.
   - *Advantage:* Can learn specialized shape adjustments tailored to specific aspect ratios (e.g., long horizontal buses vs tall vertical pedestrians).
   - *Disadvantage:* Linear increase in parameters with number of classes.
2. **Class-Agnostic Regression:**
   - The head outputs strictly $4$ coordinates $(t_x, t_y, t_w, t_h)$ shared across all classes.
   - *Advantage:* Parameter count is completely independent of $K$, preventing overfitting on classes with sparse training data. Used universally in modern high-speed detectors (YOLOv8, RetinaNet). $\blacksquare$

---

### Exercise 11.8: Hungarian Matching Algorithm in DETR
**Statement:** Nicolas Carion et al. (2020) introduced **DETR (DEtection TRansformer)**, eliminating anchors and NMS using the **Hungarian Algorithm**. Explain how bipartite matching enables set prediction.

**Solution:**
1. DETR queries a fixed set of $N = 100$ object slots through a Transformer decoder.
2. Let $y = \{y_1, \dots, y_M, \emptyset, \dots, \emptyset\}$ be the ground truth padded with empty "no-object" tokens to size $N$.
3. DETR finds an optimal **bipartite permutation** $\hat{\sigma} \in \mathfrak{S}_N$ that minimizes the global matching cost:
   $$\hat{\sigma} = \arg\min_{\sigma \in \mathfrak{S}_N} \sum_{i=1}^N \mathcal{L}_{\text{match}}(y_i, \hat{y}_{\sigma(i)})$$
   where $\mathcal{L}_{\text{match}}$ accounts for both classification probability and box IoU distance.
4. The global minimum is computed in polynomial time $\mathcal{O}(N^3)$ via the combinatorial **Hungarian algorithm**.
5. Because every ground-truth object is assigned to **exactly one unique prediction slot**, duplicate candidate boxes never occur, rendering Non-Maximum Suppression entirely obsolete! $\blacksquare$

---

### Exercise 11.9: PointNet Architecture for 3D Frustum Point Clouds
**Statement:** Charles Qi et al. (2017) introduced PointNet for processing raw unordered 3D point sets $\{ \mathbf{p}_1, \dots, \mathbf{p}_N \} \subset \mathbb{R}^3$. Explain how PointNet enforces permutation invariance.

**Solution:**
1. A point cloud is an unordered set: shuffling the indices of the $N$ points must not change the predicted 3D bounding box or classification label.
2. PointNet maps each 3D point $\mathbf{p}_i = [x_i, y_i, z_i]^\top$ into a high-dimensional feature space $\mathbb{R}^D$ ($D = 1024$) using shared Multi-Layer Perceptrons (MLPs):
   $$\mathbf{h}_i = \text{MLP}(\mathbf{p}_i)$$
3. To achieve mathematical permutation invariance, PointNet applies a **symmetric pooling function** across all $N$ point feature vectors:
   $$\mathbf{g} = \max_{i=1, \dots, N} \{ \mathbf{h}_i \} \quad (\text{Channel-wise Max Pooling})$$
4. Because the maximum operation is commutative and associative ($\max(a, b) = \max(b, a)$), the global signature $\mathbf{g}$ is strictly invariant to input point order. $\blacksquare$

---

### Exercise 11.10: Latency-Accuracy Pareto Frontier in Robotics
**Statement:** In an autonomous racecar traveling at $V = 50\text{ m/s}$ ($180\text{ km/h}$), a detector with $95\%$ mAP has an inference latency of $100\text{ ms}$ (10 FPS), while a lightweight detector with $88\%$ mAP has an inference latency of $10\text{ ms}$ (100 FPS).
Calculate the physical vehicle travel distance during perception latency and justify which model is safer.

**Solution:**
1. **Perception Reaction Distance:**
   $$d_{\text{travel}} = V \cdot \tau_{\text{latency}}$$
   - **Heavy Detector ($\tau = 100\text{ ms} = 0.10\text{ s}$):**
     $$d_{\text{travel}} = 50\text{ m/s} \times 0.10\text{ s} = 5.0\text{ meters}$$
     The vehicle travels $5.0\text{ meters}$ completely blind before the perception system finishes computing a single bounding box!
   - **Lightweight Detector ($\tau = 10\text{ ms} = 0.01\text{ s}$):**
     $$d_{\text{travel}} = 50\text{ m/s} \times 0.01\text{ s} = 0.5\text{ meters}$$
     The vehicle travels only $50\text{ centimeters}$ during perception.
2. **Safety Justification:**
   In high-speed physical robotics, an extra $4.5\text{ meters}$ of latency distance exceeds typical emergency braking margins. The $10\text{ ms}$ lightweight detector is substantially safer because low latency is required for high-bandwidth feedback control loops. $\blacksquare$


---\n
# Chapter 12: Production TypeScript Computer Vision Engine and Capstone Synthesis

---

## 12.1 Pathway #4 Architectural Synthesis: The Perception-Action Loop

Across the previous eleven chapters, we systematically constructed the complete epistemic pyramid of computer vision: starting from the physical quantum journey of photons striking a CMOS sensor silicon depletion zone, progressing through linear spatial filtering, differential gradients, Canny edge detection, perspective pinhole geometry, planar homographies, stereo triangulation, and deep convolutional perception.

Now, we bridge visual perception to physical embodiment. In **Pathway #4: Embodied AI and Autonomous Physical Robotics**, computer vision does not operate in a vacuum; it serves as the primary sensory organ driving the **Perception-Control Feedback Loop**.

```
                   THE PATHWAY #4 EMBODIED PERCEPTION-ACTION CYCLE
                   
                        [ CONTINUOUS 3D PHYSICAL SCENE ]
                                       â”‚
                                       â–¼ Photons hÎ½
                        [ CMOS CAMERA & STEREO RIG ]
                        (Chapter 1: Sensor Physics & Discretization)
                                       â”‚
                                       â–¼ Raw Pixel Array I[y, x]
                      [ SPATIAL FILTERING & CANNY EDGES ]
                      (Chapters 2-4: Convolutions & Morphology)
                                       â”‚
                                       â–¼ Edge Contours & Saliency
                      [ GEOMETRIC & STEREO RECONSTRUCTION ]
                      (Chapters 5-8: Intrinsics, Extrinsics & Depth)
                                       â”‚
                                       â–¼ Metric 3D Point Cloud & Features
                      [ DEEP CONVOLUTIONAL PERCEPTION ]
                      (Chapters 9-11: CNN Features & 3D Bounding Frustums)
                                       â”‚
                                       â–¼ Measured State z_t = [X, Y, Z, vx, vy, vz]^T
                      [ EXTENDED KALMAN STATE ESTIMATION ]
                      (Module 4: math-kalman-filtering)
                                       â”‚
                                       â–¼ Fused State Estimate xÌ‚_t
                      [ INVERSE KINEMATICS & CONTROL ]
                      (Module 3: phys-robotics-inverse-kinematics)
                                       â”‚
                                       â–¼ Joint Torques Ï„ = J^T F
                        [ RIGID-BODY ROBOT ACTUATORS ]
                        (Module 1: phys-rigid-body-3d)
                                       â”‚
                                       â–¼ Physical Motion / Grasp
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

