# Optimal State Estimation and Kalman Filtering

---

## 1. The Epistemological Challenge: Finding Truth Through Noisy Senses

### 1.1 The Apollo Navigation Crisis (1960)
In 1960, NASA faced an unprecedented navigational crisis: sending three astronauts 384,400 kilometers to the Moon and landing them safely on the lunar surface.

The spacecraft could not rely on ground telemetry alone due to communication latency and occultation behind the Moon. Onboard instruments consisted of:
- **Inertial Measurement Units (IMUs):** High-frequency accelerometers and gyroscopes that drift over time due to integrated sensor bias.
- **Sextant Star Sightings & Radar:** Absolute position fixes that are accurate on average, but corrupted by high-frequency measurement noise.

If NASA relied solely on the IMU, the integrated error would drift by kilometers, causing the lunar lander to crash. If they relied solely on noisy radar fixes, the controls would twitch erratically.

The solution came from the Hungarian-American mathematician **Rudolf E. Kálmán**. In 1960, Kalman published his revolutionary recursive algorithm: **The Kalman Filter**. Stanley Schmidt at NASA Ames recognized its genius and implemented it into the Apollo Guidance Computer, successfully guiding Apollo 11 to the Sea of Tranquility in 1969.

Today, the Kalman filter runs inside every smartphone GPS, aircraft autopilot, autonomous vehicle, and robotic surgical system on Earth.

---

## 2. First-Principles Formalism: The Linear Gaussian State-Space Model

Consider a physical system whose true continuous state at tick $k$ is vector $x_k \in \mathbb{R}^n$ (e.g. position and velocity $[p, v]^T$).

### 2.1 The Process Model (Physical Evolution)
$$ \mathbf{x_k = F_k x_{k-1} + B_k u_k + w_k} $$
where:
- $F_k$: State transition matrix (models kinematics/physics).
- $B_k$: Control input matrix.
- $u_k$: Commanded control signal (e.g. motor throttle).
- $w_k \sim \mathcal{N}(0, Q_k)$: **Process noise** (unmodeled wind gusts, bumps, friction variations) with covariance matrix $Q_k$.

### 2.2 The Measurement Model (Sensory Observations)
The sensors do not observe the hidden state $x_k$ directly; they observe an indirect linear projection $z_k \in \mathbb{R}^m$:
$$ \mathbf{z_k = H_k x_k + v_k} $$
where:
- $H_k$: Measurement observation matrix.
- $v_k \sim \mathcal{N}(0, R_k)$: **Measurement noise** (sensor electronic noise) with covariance matrix $R_k$.

---

## 3. The Recursive Predict-Update Cycle

The Kalman filter maintains two quantities at all times:
1. **$\hat{x}$:** The best estimate of the state vector (the mean of the Gaussian belief).
2. **$P$:** The $n \times n$ **Error Covariance Matrix** (the uncertainty of the estimate).

```
   ┌────────────────────────────────────────────────────────┐
   │ 1. PREDICT STEP (Project forward via physics laws):    │
   │    x̂_{k|k-1} = F_k x̂_{k-1|k-1} + B_k u_k               │
   │    P_{k|k-1} = F_k P_{k-1|k-1} F_k^T + Q_k             │ (Uncertainty grows due to Q)
   └────────────────────────────────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 2. SENSOR READING ARRIVES: z_k                         │
   │    Innovation y_k = z_k - H_k x̂_{k|k-1}                │ (Surprise difference)
   │    Innovation Covariance S_k = H_k P_{k|k-1} H_k^T + R_k│
   └────────────────────────────────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 3. UPDATE STEP (Fuse sensor reading with prediction):  │
   │    Kalman Gain K_k = P_{k|k-1} H_k^T S_k^-1             │
   │    x̂_{k|k} = x̂_{k|k-1} + K_k y_k                       │
   │    P_{k|k} = (I - K_k H_k) P_{k|k-1}                   │ (Uncertainty shrinks!)
   └────────────────────────────────────────────────────────┘
```

---

## 4. Derivation of the Optimal Kalman Gain ($K$)

The Kalman Gain $K$ is the optimal weighting factor between the physics prediction and the noisy sensor measurement:
$$ \hat{x}_{k|k} = \hat{x}_{k|k-1} + K (z_k - H \hat{x}_{k|k-1}) $$

### Derivation from Minimum Mean Squared Error (MMSE)
We wish to choose $K$ that minimizes the total estimation variance—which equals the **trace of the posterior covariance matrix** $\text{Tr}(P_{k|k})$.

The posterior error is:
$$ e_{k|k} = x_k - \hat{x}_{k|k} = (x_k - \hat{x}_{k|k-1}) - K (H x_k + v_k - H \hat{x}_{k|k-1}) = (I - KH)e_{k|k-1} - K v_k $$

Computing the covariance $P_{k|k} = \mathbb{E}[e_{k|k} e_{k|k}^T]$:
$$ P_{k|k} = (I - KH) P_{k|k-1} (I - KH)^T + K R K^T $$
$$ = P_{k|k-1} - KH P_{k|k-1} - P_{k|k-1} H^T K^T + K (H P_{k|k-1} H^T + R) K^T $$

Differentiating the scalar trace $\text{Tr}(P_{k|k})$ with respect to matrix $K$ and setting to zero:
$$ \frac{\partial \text{Tr}(P_{k|k})}{\partial K} = -2 (P_{k|k-1} H^T) + 2 K (H P_{k|k-1} H^T + R) = 0 $$

Solving directly for $K$:
$$ K (H P_{k|k-1} H^T + R) = P_{k|k-1} H^T $$
$$ \mathbf{K = P_{k|k-1} H^T (H P_{k|k-1} H^T + R)^{-1}} \quad \blacksquare $$

### Intuitive Limiting Cases:
1. **Perfect Sensor ($R \to 0$):**  
   $$ K \to P H^T (H P H^T)^{-1} = H^{-1} \implies \hat{x} \to H^{-1} z $$
   The filter completely ignores the physics prediction and trusts the sensor 100%!
2. **Terrible Sensor ($R \to \infty$):**  
   $$ K \to 0 \implies \hat{x} \to \hat{x}_{k|k-1} $$
   The filter completely ignores the noisy sensor and relies 100% on pure physics integration!

---

## 5. Non-Linear Systems: The Extended Kalman Filter (EKF)

Real physical systems are rarely perfectly linear:
$$ x_k = f(x_{k-1}, u_k) + w_k $$
$$ z_k = h(x_k) + v_k $$
(e.g. radar measuring range $\rho = \sqrt{x^2 + y^2}$ and bearing $\theta = \text{atan2}(y, x)$).

The **Extended Kalman Filter (EKF)** linearizes non-linear functions $f$ and $h$ around the current estimate using **Jacobian matrices of first partial derivatives**:
$$ F_k = \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}}, \quad H_k = \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}} $$
The standard Kalman filter equations are then evaluated using these local Jacobian matrices!

---

## 6. Multi-Tiered Worked Examples

### Level 1: 1D Scalar Kalman Filter Update
A robot vehicle estimates its position $x$.  
- Prior prediction: $\hat{x} = 20.0 \text{ m}$ with uncertainty variance $P = 4.0 \text{ m}^2$.
- GPS measurement: $z = 23.0 \text{ m}$ with measurement noise variance $R = 2.0 \text{ m}^2$.
- Observation matrix $H = 1.0$.
Calculate the Kalman Gain $K$, the updated position $\hat{x}^+$, and the new uncertainty $P^+$.

**Step-by-step Solution:**
1. Kalman Gain:
   $$ K = \frac{P H}{H P H + R} = \frac{4.0 \times 1.0}{(1.0)(4.0)(1.0) + 2.0} = \frac{4.0}{4.0 + 2.0} = \frac{4.0}{6.0} = \mathbf{\frac{2}{3} \approx 0.6667} $$
2. State Update:
   $$ \hat{x}^+ = \hat{x} + K (z - H\hat{x}) = 20.0 + \frac{2}{3} (23.0 - 20.0) = 20.0 + \frac{2}{3}(3.0) = 20.0 + 2.0 = \mathbf{22.0 \text{ m}} $$
3. Uncertainty Covariance Update:
   $$ P^+ = (1 - K H) P = \left(1 - \frac{2}{3}(1)\right) 4.0 = \frac{1}{3} \times 4.0 = \mathbf{1.333 \text{ m}^2} $$
Notice:
- The updated position ($22.0 \text{ m}$) shifted twice as far toward the GPS ($23.0$) as toward the prior ($20.0$) because the GPS had half the variance ($R = 2 < P = 4$).
- The new uncertainty $P^+ = 1.333$ is significantly lower than either the prior ($4.0$) or the sensor alone ($2.0$)!

---

### Level 2: 2D Position-Velocity Kinematic Tracking
A vehicle moves in 1D with state vector $x = [p, v]^T$ and timestep $\Delta t = 1.0 \text{ s}$.
The kinematic transition matrix is:
$$ F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} $$
If the current posterior is $\hat{x} = [10, 5]^T$ (Position $10 \text{ m}$, Velocity $5 \text{ m/s}$), project state forward to the next step:
$$ \hat{x}_{\text{predict}} = F \hat{x} = \begin{bmatrix} 1(10) + 1(5) \\ 0(10) + 1(5) \end{bmatrix} = \begin{bmatrix} \mathbf{15} \\ \mathbf{5} \end{bmatrix} $$
The vehicle predicts it will arrive at position $15 \text{ m}$ while maintaining speed $5 \text{ m/s}$.

---

## 7. Production-Ready Computational Engine: 1D Kalman Filter

```typescript
export class KalmanFilter1D {
  private x: number; // State estimate
  private p: number; // Error covariance
  private q: number; // Process noise covariance
  private r: number; // Measurement noise covariance

  constructor(initialState = 0, initialError = 1.0, processNoise = 1e-3, measurementNoise = 0.1) {
    this.x = initialState;
    this.p = initialError;
    this.q = processNoise;
    this.r = measurementNoise;
  }

  public predict(velocity = 0, dt = 1.0): void {
    // x = x + v * dt
    this.x += velocity * dt;
    // P = P + Q
    this.p += this.q;
  }

  public update(measurement: number): { state: number; error: number; gain: number } {
    // K = P / (P + R)
    const k = this.p / (this.p + this.r);
    // x = x + K * (z - x)
    this.x += k * (measurement - this.x);
    // P = (1 - K) * P
    this.p = (1 - k) * this.p;

    return { state: this.x, error: this.p, gain: k };
  }

  public getState(): number { return this.x; }
  public getVariance(): number { return this.p; }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** Why does uncertainty $P$ increase during the Predict step, but decrease during the Update step?
   - **Answer:** In the Predict step, integrating physics over time accumulates unmodeled process noise ($P \gets FPF^T + Q$), spreading the Gaussian wider. In the Update step, acquiring fresh external sensor data ($z_k$) injects new physical information, shrinking the Gaussian covariance ($P \gets (I - KH)P$).
2. **Question:** What is the difference between filtering, smoothing, and prediction?
   - **Answer:** **Filtering** estimates the current state given measurements up to now ($\hat{x}_{t|t}$); **Prediction** estimates a future state ($\hat{x}_{t+k|t}$); **Smoothing** retroactively recalculates a past state using all past and subsequent future measurements ($\hat{x}_{t-k|t}$), achieving the highest possible accuracy for offline post-processing.
3. **Question:** What causes an Extended Kalman Filter (EKF) to diverge?
   - **Answer:** If the underlying system is highly non-linear across the uncertainty envelope, or if initial state errors are large, the first-order Taylor expansion becomes invalid, propagating false covariance estimates that cause the filter to diverge or become overconfident in an erroneous state.
