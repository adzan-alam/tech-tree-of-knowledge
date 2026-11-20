# Optimal State Estimation and Kalman Filtering

---

## 0. The Anchor Paradox: The Submarine & The Two Imperfect Compasses

Imagine a research submarine navigating deep beneath the Arctic ice cap. Sealed under three meters of solid pack ice, no GPS satellite radio waves can penetrate the freezing seawater.

```
       ══════════════════════════════════════════════════ Pack Ice
                              ~ ~ ~ ~ ~ ~ ~
                              ~ ~ ~ ~ ~ ~ ~
                       ┌─────────────────────────┐
                       │  SUBMARINE RESEARCHER   │
                       └───────────┬─────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   [INSTRUMENT A: ODOMETER]                  [INSTRUMENT B: SONAR BEACON]
   - Records motor rpm & flow.               - Pings distant seabed beacon.
   - Smooth, zero high-frequency jitter.     - Terrible noise: pings jump ±50 meters!
   - BUT: accumulates 0.1% drift per hour!   - BUT: on average, centered exactly on truth!
```

To navigate, the captain has two physical instruments:
- **Instrument A (Inertial Dead-Reckoning):** Records motor rotations and water flow speed every millisecond. It produces an ultra-smooth trajectory with zero high-frequency jitter. However, it suffers from a tiny systematic calibration bias of just $0.1\%$. After cruising for 12 hours, this imperceptible bias integrates over time into a **25-kilometer positional drift**—enough to crash the submarine into an undersea trench!
- **Instrument B (Acoustic Sonar Pings):** Pings a transponder fixed to the seafloor once every minute. Because of thermal currents and marine echoes, the ping readings fluctuate wildly by $\pm 50\text{ meters}$ with every single measurement.

If the navigator relies solely on Instrument A, the submarine drifts blindly into destruction.  
If the navigator relies solely on Instrument B, the autopilot jerks erratically back and forth by 50 meters every minute, overheating the rudder actuators.

**The Paradox:** Can two deeply flawed instruments—one that drifts smoothly and one that jitters wildly—be combined to create a single state estimate that **neither drifts nor jitters**, but is provably more accurate than either instrument alone?

In 1960, mathematician **Rudolf E. Kálmán** published the mathematical answer: **The Kalman Filter**. When NASA engineer Stanley Schmidt realized its power, it was programmed directly into the Apollo Guidance Computer, successfully guiding Apollo 11 to the first human landing on the Moon in 1969.

---

## 1. Epistemological Foundations: Belief States in Phase Space

In real-world engineering and robotics, the **true state of the universe** $x_t \in \mathbb{R}^n$ (e.g. true position, true velocity, true temperature) is a **hidden variable** that can never be observed with absolute certainty.

Instead of tracking a single deterministic point, a Bayesian robot maintains a **Belief Distribution**: a probability density function $p(x_t)$ quantifying where the robot believes it is.

When the system dynamics and sensory noise are linear and Gaussian, the belief distribution is fully characterized by just two mathematical parameters:
1. **The Mean Vector ($\hat{x}$):** The expected value, representing the single most likely state:
   $$\hat{x} = \mathbb{E}[x]$$
2. **The Error Covariance Matrix ($P$):** The spread of uncertainty around the mean:
   $$P = \mathbb{E}[(x - \hat{x})(x - \hat{x})^T]$$

```
                   p(x) ^
                        │           Gaussian Belief Distribution
                        │                       *
                        │                     *   *
                        │                    *     *
                        │                   *       *
                        │                  *         *
                        │               *               *
                        └───────────────┼───────┼───────┼────────► State x
                                      x̂ - σ     x̂     x̂ + σ
                                             (Mean)
```

---

## 2. The Linear Gaussian State-Space Model

At discrete time step $k = 1, 2, 3, \dots$:

### 2.1 The Process Model (Kinematics & Physics)
The physical universe advances state according to Newtonian mechanics:
$$\mathbf{x_k = \mathbf{F}_k x_{k-1} + \mathbf{B}_k u_k + w_k}$$

where:
- $x_k \in \mathbb{R}^n$: State vector at time $k$ (e.g. $[p, v]^T$).
- $\mathbf{F}_k \in \mathbb{R}^{n \times n}$: **State Transition Matrix** encoding kinematics (e.g. $p_k = p_{k-1} + v_{k-1}\Delta t$).
- $\mathbf{B}_k \in \mathbb{R}^{n \times l}$: **Control Input Matrix**.
- $u_k \in \mathbb{R}^l$: Known commanded input (e.g. motor throttle or thruster force).
- $w_k \sim \mathcal{N}(0, \mathbf{Q}_k)$: Zero-mean Gaussian **Process Noise** with covariance matrix $\mathbf{Q}_k \in \mathbb{R}^{n \times n}$, representing unmodeled physics (wind gusts, road bumps, friction changes).

### 2.2 The Measurement Model (Sensory Observations)
The robot's physical sensors observe a linear projection of the state:
$$\mathbf{z_k = \mathbf{H}_k x_k + v_k}$$

where:
- $z_k \in \mathbb{R}^m$: Measurement vector from physical sensors (e.g. GPS coordinates).
- $\mathbf{H}_k \in \mathbb{R}^{m \times n}$: **Observation Matrix** mapping the internal state space $\mathbb{R}^n$ into the sensor measurement space $\mathbb{R}^m$.
- $v_k \sim \mathcal{N}(0, \mathbf{R}_k)$: Zero-mean Gaussian **Measurement Noise** with covariance matrix $\mathbf{R}_k \in \mathbb{R}^{m \times m}$, representing sensor electronic noise.

We assume process noise $w_k$ and measurement noise $v_k$ are statistically independent: $\mathbb{E}[w_k v_j^T] = 0$.

---

## 3. The Predict Phase: Projecting Forward Through Physics

Before a sensor measurement arrives at time $k$, the filter projects its prior estimate forward in time using its mathematical model of physics.

### 3.1 Prior State Prediction ($\hat{x}_{k|k-1}$)
Taking the expectation of the process equation:
$$\mathbf{\hat{x}_{k|k-1} = \mathbf{F}_k \hat{x}_{k-1|k-1} + \mathbf{B}_k u_k}$$

### 3.2 Prior Covariance Prediction ($\mathbf{P}_{k|k-1}$)
The estimation error prior to measurement is:
$$e_{k|k-1} = x_k - \hat{x}_{k|k-1} = (\mathbf{F}_k x_{k-1} + \mathbf{B}_k u_k + w_k) - (\mathbf{F}_k \hat{x}_{k-1|k-1} + \mathbf{B}_k u_k) = \mathbf{F}_k e_{k-1|k-1} + w_k$$

The prior covariance is the expectation of the outer product:
$$\mathbf{P}_{k|k-1} = \mathbb{E}[e_{k|k-1} e_{k|k-1}^T] = \mathbb{E}\left[ (\mathbf{F}_k e_{k-1|k-1} + w_k)(\mathbf{F}_k e_{k-1|k-1} + w_k)^T \right]$$
Expanding terms:
$$= \mathbf{F}_k \mathbb{E}[e_{k-1|k-1} e_{k-1|k-1}^T] \mathbf{F}_k^T + \mathbf{F}_k \mathbb{E}[e_{k-1|k-1} w_k^T] + \mathbb{E}[w_k e_{k-1|k-1}^T] \mathbf{F}_k^T + \mathbb{E}[w_k w_k^T]$$

Because past estimation errors are independent of future process noise ($\mathbb{E}[e w^T] = 0$), the cross-terms vanish:
$$\mathbf{\mathbf{P}_{k|k-1} = \mathbf{F}_k \mathbf{P}_{k-1|k-1} \mathbf{F}_k^T + \mathbf{Q}_k}$$

#### Crucial Intuitive Insight:
Notice the addition $+\mathbf{Q}_k$. In the Predict step, **uncertainty always grows**! Projecting into the future without sensory feedback causes our knowledge to become fuzzier due to unmodeled environmental disturbances.

---

## 4. The Update Phase & Derivation of Optimal Kalman Gain ($\mathbf{K}$)

When the sensor measurement $z_k$ arrives, the filter must fuse the physics prediction with the new observation.

### 4.1 Innovation / Measurement Residual ($y_k$)
The difference between what the sensor actually observed ($z_k$) and what our physics model expected the sensor to observe ($\mathbf{H}_k \hat{x}_{k|k-1}$) is called the **Innovation** $y_k$:
$$\mathbf{y_k = z_k - \mathbf{H}_k \hat{x}_{k|k-1}}$$
The innovation covariance $\mathbf{S}_k$ is:
$$\mathbf{S_k = \mathbf{H}_k \mathbf{P}_{k|k-1} \mathbf{H}_k^T + \mathbf{R}_k}$$

### 4.2 Linear Correction Structure
We structure the updated posterior state $\hat{x}_{k|k}$ as a linear combination of the prediction and the innovation scaled by a gain matrix $\mathbf{K}_k$:
$$\mathbf{\hat{x}_{k|k} = \hat{x}_{k|k-1} + \mathbf{K}_k y_k = \hat{x}_{k|k-1} + \mathbf{K}_k (z_k - \mathbf{H}_k \hat{x}_{k|k-1})}$$

### 4.3 First-Principles Derivation of the Optimal Kalman Gain $\mathbf{K}$
What matrix $\mathbf{K}_k$ will make the updated estimate as accurate as mathematically possible?

We define the optimal gain as the matrix that minimizes the **Mean Squared Error (MSE)** of the posterior estimate, which equals the **trace of the posterior error covariance matrix**:
$$J(\mathbf{K}_k) = \mathbb{E}\left[ \|x_k - \hat{x}_{k|k}\|^2 \right] = \text{Tr}(\mathbf{P}_{k|k})$$

First, formulate the posterior error $e_{k|k} = x_k - \hat{x}_{k|k}$:
$$e_{k|k} = x_k - \left( \hat{x}_{k|k-1} + \mathbf{K}_k ( \mathbf{H}_k x_k + v_k - \mathbf{H}_k \hat{x}_{k|k-1} ) \right)$$
$$= (x_k - \hat{x}_{k|k-1}) - \mathbf{K}_k \mathbf{H}_k (x_k - \hat{x}_{k|k-1}) - \mathbf{K}_k v_k = (\mathbf{I} - \mathbf{K}_k \mathbf{H}_k) e_{k|k-1} - \mathbf{K}_k v_k$$

Now compute the posterior covariance matrix $\mathbf{P}_{k|k} = \mathbb{E}[e_{k|k} e_{k|k}^T]$:
$$\mathbf{P}_{k|k} = \mathbb{E}\left[ ((\mathbf{I} - \mathbf{K}_k \mathbf{H}_k) e_{k|k-1} - \mathbf{K}_k v_k)((\mathbf{I} - \mathbf{K}_k \mathbf{H}_k) e_{k|k-1} - \mathbf{K}_k v_k)^T \right]$$
Since sensor noise $v_k$ is independent of prior error $e_{k|k-1}$ ($\mathbb{E}[e v^T] = 0$):
$$\mathbf{P}_{k|k} = (\mathbf{I} - \mathbf{K}_k \mathbf{H}_k) \mathbf{P}_{k|k-1} (\mathbf{I} - \mathbf{K}_k \mathbf{H}_k)^T + \mathbf{K}_k \mathbf{R}_k \mathbf{K}_k^T$$
*(This symmetric expression is known as the **Joseph Form** of the covariance update).*

Expand the expression:
$$\mathbf{P}_{k|k} = \mathbf{P}_{k|k-1} - \mathbf{K}_k \mathbf{H}_k \mathbf{P}_{k|k-1} - \mathbf{P}_{k|k-1} \mathbf{H}_k^T \mathbf{K}_k^T + \mathbf{K}_k (\mathbf{H}_k \mathbf{P}_{k|k-1} \mathbf{H}_k^T + \mathbf{R}_k) \mathbf{K}_k^T$$
Substitute the innovation covariance $\mathbf{S}_k = \mathbf{H}_k \mathbf{P}_{k|k-1} \mathbf{H}_k^T + \mathbf{R}_k$:
$$\mathbf{P}_{k|k} = \mathbf{P}_{k|k-1} - \mathbf{K}_k \mathbf{H}_k \mathbf{P}_{k|k-1} - \mathbf{P}_{k|k-1} \mathbf{H}_k^T \mathbf{K}_k^T + \mathbf{K}_k \mathbf{S}_k \mathbf{K}_k^T$$

Now take the matrix derivative of the scalar trace $\text{Tr}(\mathbf{P}_{k|k})$ with respect to $\mathbf{K}_k$ using standard matrix calculus identities:
$$\frac{\partial \text{Tr}(\mathbf{A} \mathbf{K}^T)}{\partial \mathbf{K}} = \mathbf{A}, \quad \frac{\partial \text{Tr}(\mathbf{K} \mathbf{B} \mathbf{K}^T)}{\partial \mathbf{K}} = 2 \mathbf{K} \mathbf{B} \quad (\text{for symmetric } \mathbf{B})$$

Applying these rules:
$$\frac{\partial \text{Tr}(\mathbf{P}_{k|k})}{\partial \mathbf{K}_k} = -2 (\mathbf{P}_{k|k-1} \mathbf{H}_k^T) + 2 \mathbf{K}_k \mathbf{S}_k$$

Set this derivative equal to the zero matrix to find the global minimum:
$$-2 (\mathbf{P}_{k|k-1} \mathbf{H}_k^T) + 2 \mathbf{K}_k \mathbf{S}_k = \mathbf{0}$$
$$\mathbf{K}_k \mathbf{S}_k = \mathbf{P}_{k|k-1} \mathbf{H}_k^T$$
Multiply both sides by $\mathbf{S}_k^{-1}$:

$$\mathbf{\mathbf{K}_k = \mathbf{P}_{k|k-1} \mathbf{H}_k^T \mathbf{S}_k^{-1} = \mathbf{P}_{k|k-1} \mathbf{H}_k^T (\mathbf{H}_k \mathbf{P}_{k|k-1} \mathbf{H}_k^T + \mathbf{R}_k)^{-1}} \quad \blacksquare$$

### 4.4 Posterior Covariance Simplification
Substituting optimal $\mathbf{K}_k$ back into the Joseph equation:
$$\mathbf{P}_{k|k} = \mathbf{P}_{k|k-1} - \mathbf{K}_k \mathbf{H}_k \mathbf{P}_{k|k-1} - \mathbf{P}_{k|k-1} \mathbf{H}_k^T \mathbf{K}_k^T + \mathbf{K}_k \mathbf{S}_k \mathbf{K}_k^T$$
Since $\mathbf{K}_k \mathbf{S}_k = \mathbf{P}_{k|k-1} \mathbf{H}_k^T$, the last two terms cancel:
$$\mathbf{\mathbf{P}_{k|k} = (\mathbf{I} - \mathbf{K}_k \mathbf{H}_k) \mathbf{P}_{k|k-1}}$$

#### Notice:
In the Update step, **uncertainty always shrinks**! Subtracting $\mathbf{K}_k \mathbf{H}_k \mathbf{P}_{k|k-1}$ reflects the new information gained from reality.

```
       PREDICT STEP:                                 UPDATE STEP:
       (Pure Physics Projection)                     (Fuse Sensory Observation)
       x̂_{k|k-1} = F x̂ + B u                         K = P H^T (H P H^T + R)^-1
       P_{k|k-1} = F P F^T + Q                       x̂_{k|k} = x̂ + K (z - H x̂)
                                                     P_{k|k} = (I - K H) P
            ▲                                             │
            │ Uncertainty Grows (+Q)                      │ Uncertainty Shrinks (-KHP)
            └─────────────────────────────────────────────┘
```

---

## 5. The Physical Limiting Cases of Kalman Gain

Consider a 1D scalar system where $H = 1$:
$$K = \frac{P}{P + R}$$

1. **The Sensor is Infinitely Precise ($R \to 0$):**
   $$\lim_{R \to 0} K = \frac{P}{P} = 1.0 \implies \hat{x}_{k|k} = \hat{x}_{k|k-1} + 1.0(z_k - \hat{x}_{k|k-1}) = z_k$$
   The filter completely ignores its physics prediction and snaps directly to the measurement!
2. **The Sensor is Completely Broken Garbage ($R \to \infty$):**
   $$\lim_{R \to \infty} K = 0.0 \implies \hat{x}_{k|k} = \hat{x}_{k|k-1} + 0.0(z_k - \hat{x}_{k|k-1}) = \hat{x}_{k|k-1}$$
   The filter completely ignores the sensor reading and relies 100% on dead-reckoning physics integration!

The Kalman Gain is the mathematically optimal knob dynamically tuning trust between physics and reality.

---

## 6. Non-Linear Systems: The Extended Kalman Filter (EKF)

Real-world robots do not operate in linear matrix worlds:
$$x_k = f(x_{k-1}, u_k) + w_k$$
$$z_k = h(x_k) + v_k$$
For example, a radar tracker observes range $\rho$ and bearing $\theta$:
$$h(x, y) = \begin{bmatrix} \sqrt{x^2 + y^2} \\ \text{atan2}(y, x) \end{bmatrix}$$
This is heavily non-linear. Passing a Gaussian through a non-linear function destroys its Gaussian shape, producing skewed, non-Gaussian multimodal distributions.

The **Extended Kalman Filter (EKF)** solves this by performing a first-order multivariate Taylor series expansion (linearization) at the current operating point:
$$\mathbf{\mathbf{F}_k = \left. \frac{\partial f}{\partial x} \right|_{\hat{x}_{k-1|k-1}}, \quad \mathbf{H}_k = \left. \frac{\partial h}{\partial x} \right|_{\hat{x}_{k|k-1}}}$$
where $\mathbf{F}_k$ and $\mathbf{H}_k$ are **Jacobian Matrices** of first-order partial derivatives.

The standard Kalman filter equations are then applied using the evaluated Jacobian matrices!

---

## 7. Software Traps and Numerical Realities

### Trap 1: Loss of Positive Definiteness (Negative Variance Crash)
In theory, the covariance matrix $P$ is symmetric positive semi-definite ($x^T P x \ge 0$).
However, evaluating the simplified update $\mathbf{P} \gets (\mathbf{I} - \mathbf{K}\mathbf{H})\mathbf{P}$ using IEEE-754 64-bit floating point arithmetic can cause subtle asymmetric roundoff errors. Over thousands of cycles, a diagonal element $P_{ii}$ can become slightly negative (e.g. $-10^{-15}$).
When calculating $\sigma = \sqrt{P_{ii}}$, `Math.sqrt()` returns `NaN`, instantly corrupting the entire navigation stack!
*Fix: Symmetrization and Joseph Form.*
1. Explicitly re-symmetrize $P$ after every update:
   `P = 0.5 * (P + P.transpose());`
2. Or use the algebraically guaranteed positive-definite Joseph Form:
   `P = (I - K*H)*P*(I - K*H)^T + K*R*K^T;`

### Trap 2: Filter Divergence from Overconfidence ($Q \to 0$)
If an engineer sets the process noise covariance matrix $\mathbf{Q} = 0$ assuming their physics model is perfect, the error covariance $P$ strictly decreases with every single sensor measurement until $P \to 0$.
When $P \to 0$, the Kalman Gain $K \to 0$. The filter becomes **blindly overconfident**: it stops listening to all incoming sensor data! If a real-world gust of wind hits the robot, the filter ignores the sensors and continues hallucinating its dead-reckoned trajectory. Always provide a non-zero lower bound on $Q$.

### Trap 3: Angle Wrap-Around in the Innovation ($-\pi \le \theta < \pi$)
When tracking robot orientation $\theta$, if the predicted heading is $+179^\circ$ ($+3.12\text{ rad}$) and the compass measures $-179^\circ$ ($-3.12\text{ rad}$), naive subtraction yields:
$$y = z - \hat{x} = -179^\circ - 179^\circ = -358^\circ$$
The filter thinks the robot made a massive full rotation, causing a violent, catastrophic jerk!
*Fix:* Always normalize innovation angles into the interval $[-\pi, +\pi)$:
`y = Math.atan2(Math.sin(y), Math.cos(y));`

---

## 8. Production-Grade TypeScript Engine: 2D Kinematic Kalman Filter

Below is a complete, typed implementation of a 2D Kinematic Kalman Filter tracking position and velocity $[p_x, p_y, v_x, v_y]^T$ with full matrix algebra, innovation checking, and covariance symmetrization.

```typescript
/**
 * 4x4 Matrix operations for 2D Kinematic State Estimation
 */
export class Matrix4x4 {
  public data: Float64Array = new Float64Array(16); // 4x4 row-major

  public static identity(): Matrix4x4 {
    const m = new Matrix4x4();
    m.data[0] = 1; m.data[5] = 1; m.data[10] = 1; m.data[15] = 1;
    return m;
  }

  public multiply(other: Matrix4x4): Matrix4x4 {
    const res = new Matrix4x4();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.data[r * 4 + k] * other.data[k * 4 + c];
        }
        res.data[r * 4 + c] = sum;
      }
    }
    return res;
  }

  public transpose(): Matrix4x4 {
    const res = new Matrix4x4();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res.data[c * 4 + r] = this.data[r * 4 + c];
      }
    }
    return res;
  }

  public symmetrize(): void {
    for (let r = 0; r < 4; r++) {
      for (let c = r + 1; c < 4; c++) {
        const avg = 0.5 * (this.data[r * 4 + c] + this.data[c * 4 + r]);
        this.data[r * 4 + c] = avg;
        this.data[c * 4 + r] = avg;
      }
    }
  }
}

/**
 * Full 2D Kinematic Kalman Filter
 * State vector x: [px, py, vx, vy]^T
 * Observation vector z: [zx, zy]^T (e.g. GPS / Sonar)
 */
export class KalmanFilter2D {
  public x: Float64Array = new Float64Array(4); // State estimate
  public P: Matrix4x4;                          // Error covariance
  public Q: Matrix4x4;                          // Process noise covariance
  public R_pos: number;                         // Measurement noise variance (GPS)

  constructor(initialPx = 0, initialPy = 0, processVariance = 0.01, sensorVariance = 1.0) {
    this.x[0] = initialPx;
    this.x[1] = initialPy;
    this.x[2] = 0; // vx
    this.x[3] = 0; // vy

    this.P = Matrix4x4.identity();
    this.P.data[0] = 10.0; // High initial position uncertainty
    this.P.data[5] = 10.0;
    this.P.data[10] = 5.0; // Velocity uncertainty
    this.P.data[15] = 5.0;

    this.Q = Matrix4x4.identity();
    for (let i = 0; i < 16; i += 5) this.Q.data[i] = processVariance;

    this.R_pos = sensorVariance;
  }

  /**
   * Predict Step: x = F*x, P = F*P*F^T + Q
   */
  public predict(dt: number): void {
    // Kinematic F matrix:
    // [1 0 dt 0 ]
    // [0 1 0  dt]
    // [0 0 1  0 ]
    // [0 0 0  1 ]
    const F = Matrix4x4.identity();
    F.data[2] = dt; // row 0, col 2
    F.data[7] = dt; // row 1, col 3

    // 1. Project state: x = F * x
    const nextPx = this.x[0] + this.x[2] * dt;
    const nextPy = this.x[1] + this.x[3] * dt;
    this.x[0] = nextPx;
    this.x[1] = nextPy;

    // 2. Project covariance: P = F * P * F^T + Q
    const FP = F.multiply(this.P);
    const FPFt = FP.multiply(F.transpose());

    for (let i = 0; i < 16; i++) {
      this.P.data[i] = FPFt.data[i] + this.Q.data[i];
    }
    this.P.symmetrize();
  }

  /**
   * Update Step: Fuses noisy position measurement [zx, zy]
   */
  public updatePosition(zx: number, zy: number): { innovationX: number; innovationY: number } {
    // Observation matrix H selects [px, py] from [px, py, vx, vy]
    // H = [[1, 0, 0, 0], [0, 1, 0, 0]]
    const innovX = zx - this.x[0];
    const innovY = zy - this.x[1];

    // Innovation covariance: S = H * P * H^T + R
    const sX = this.P.data[0] + this.R_pos;
    const sY = this.P.data[5] + this.R_pos;

    // Kalman Gain K = P * H^T * S^-1 (computed component-wise for diagonal H)
    const k_px_x = this.P.data[0] / sX;
    const k_py_y = this.P.data[5] / sY;
    const k_vx_x = this.P.data[8] / sX; // P[2, 0] / sX
    const k_vy_y = this.P.data[13] / sY;// P[3, 1] / sY

    // 1. Update state: x = x + K * y
    this.x[0] += k_px_x * innovX;
    this.x[1] += k_py_y * innovY;
    this.x[2] += k_vx_x * innovX;
    this.x[3] += k_vy_y * innovY;

    // 2. Update covariance: P = (I - K*H) * P
    this.P.data[0] *= (1.0 - k_px_x);
    this.P.data[5] *= (1.0 - k_py_y);
    this.P.data[10] -= k_vx_x * this.P.data[2];
    this.P.data[15] -= k_vy_y * this.P.data[7];

    this.P.symmetrize();

    return { innovationX: innovX, innovationY: innovY };
  }
}
```

---

## 9. Multi-Tiered Worked Problems

### Tier 1: Class 6 Level — Combining Two Scale Readings
**Problem:** A package is weighed on two scales.
- Scale A reports: Weight $= 10.0\text{ kg}$ with uncertainty variance $P_A = 2.0$.
- Scale B reports: Weight $= 16.0\text{ kg}$ with uncertainty variance $P_B = 2.0$.
Since both scales are equally accurate ($P_A = P_B$), where should the true weight lie, and what is its combined uncertainty?

**Solution:**
1. Because both scales have equal uncertainty, the optimal estimate is the exact midpoint:
   $$\hat{x} = \frac{10.0 + 16.0}{2} = \mathbf{13.0\text{ kg}}$$
2. By the variance fusion formula $\frac{1}{P_{\text{combined}}} = \frac{1}{P_A} + \frac{1}{P_B}$:
   $$\frac{1}{P_{\text{combined}}} = \frac{1}{2.0} + \frac{1}{2.0} = 0.5 + 0.5 = 1.0 \implies P_{\text{combined}} = \mathbf{1.0}$$
*Result:* Combining two measurements cut the uncertainty variance in half (from $2.0$ down to $1.0$).

---

### Tier 2: High School Level — Scalar Predict-Update Step
**Problem:** An autonomous lawnmower tracks its 1D position $x$.
- At time $k-1$, posterior position is $\hat{x}_{k-1} = 5.0\text{ m}$ with variance $P_{k-1} = 1.0\text{ m}^2$.
- The lawnmower drives forward at constant speed $v = 2.0\text{ m/s}$ for time $\Delta t = 1.0\text{ s}$.
- Process noise variance is $Q = 0.5\text{ m}^2$.
1. Compute the predicted state $\hat{x}_{k|k-1}$ and predicted variance $P_{k|k-1}$.
2. At time $k$, an ultrasonic sensor reports position $z_k = 8.5\text{ m}$ with sensor noise variance $R = 1.0\text{ m}^2$. Compute the Kalman Gain $K$, updated position $\hat{x}_{k|k}$, and updated variance $P_{k|k}$.

**Solution:**
1. Predict Step:
   $$\hat{x}_{k|k-1} = \hat{x}_{k-1} + v\Delta t = 5.0 + (2.0 \times 1.0) = \mathbf{7.0\text{ m}}$$
   $$P_{k|k-1} = P_{k-1} + Q = 1.0 + 0.5 = \mathbf{1.5\text{ m}^2}$$
2. Update Step:
   - Compute Kalman Gain ($H = 1$):
     $$K = \frac{P_{k|k-1}}{P_{k|k-1} + R} = \frac{1.5}{1.5 + 1.0} = \frac{1.5}{2.5} = \mathbf{0.60}$$
   - Update State Estimate:
     $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K(z_k - \hat{x}_{k|k-1}) = 7.0 + 0.60(8.5 - 7.0) = 7.0 + 0.60(1.5) = 7.0 + 0.90 = \mathbf{7.90\text{ m}}$$
   - Update Covariance:
     $$P_{k|k} = (1 - K)P_{k|k-1} = (1 - 0.60) \times 1.5 = 0.40 \times 1.5 = \mathbf{0.60\text{ m}^2}$$
*Notice:* The final uncertainty ($0.60\text{ m}^2$) is lower than both the physics prediction ($1.5\text{ m}^2$) and the raw sensor ($1.0\text{ m}^2$)!

---

### Tier 3: AP / First-Year Undergraduate — Kinematic State Projection
**Problem:** A spacecraft in deep space has state vector $x = [p, v]^T$.
At time $k-1$: $\hat{x}_{k-1} = [100\text{ m}, 20\text{ m/s}]^T$ with covariance matrix:
$$P_{k-1} = \begin{bmatrix} 4.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix}$$
The engine fires with constant acceleration $a = 2.0\text{ m/s}^2$ over timestep $\Delta t = 2.0\text{ s}$.
The kinematic transition matrices are:
$$F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}, \quad B = \begin{bmatrix} 0.5 \Delta t^2 \\ \Delta t \end{bmatrix} = \begin{bmatrix} 2.0 \\ 2.0 \end{bmatrix}, \quad Q = \begin{bmatrix} 0.1 & 0.0 \\ 0.0 & 0.05 \end{bmatrix}$$
Calculate the exact predicted state $\hat{x}_{k|k-1}$ and prior covariance matrix $P_{k|k-1}$.

**Solution:**
1. State Prediction:
   $$\hat{x}_{k|k-1} = F \hat{x}_{k-1} + B a = \begin{bmatrix} 1(100) + 2(20) \\ 0(100) + 1(20) \end{bmatrix} + \begin{bmatrix} 2.0(2.0) \\ 2.0(2.0) \end{bmatrix} = \begin{bmatrix} 140 \\ 20 \end{bmatrix} + \begin{bmatrix} 4 \\ 4 \end{bmatrix} = \mathbf{\begin{bmatrix} 144.0\text{ m} \\ 24.0\text{ m/s} \end{bmatrix}}$$
2. Covariance Prediction:
   $$F P_{k-1} = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 4 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 4 & 2 \\ 0 & 1 \end{bmatrix}$$
   $$F P_{k-1} F^T = \begin{bmatrix} 4 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix} = \begin{bmatrix} 4(1) + 2(2) & 4(0) + 2(1) \\ 0(1) + 1(2) & 0(0) + 1(1) \end{bmatrix} = \begin{bmatrix} 8.0 & 2.0 \\ 2.0 & 1.0 \end{bmatrix}$$
   Add process noise $Q$:
   $$P_{k|k-1} = \begin{bmatrix} 8.0 & 2.0 \\ 2.0 & 1.0 \end{bmatrix} + \begin{bmatrix} 0.1 & 0.0 \\ 0.0 & 0.05 \end{bmatrix} = \mathbf{\begin{bmatrix} 8.10 & 2.00 \\ 2.00 & 1.05 \end{bmatrix}}$$
*Observation:* Notice the off-diagonal covariance terms $2.00$. Even though initial errors in position and velocity were uncorrelated ($P_{12} = 0$), physics kinematics coupled velocity uncertainty directly into position uncertainty!

---

### Tier 4: University Undergraduate — Steady-State Riccati Equation
**Problem:** In a stationary 1D tracking problem with constant time step, the prior variance $P$ converges to a fixed steady-state value $P_\infty$ satisfying the discrete algebraic Riccati equation:
$$P_\infty = F^2 (1 - K_\infty) P_\infty + Q, \quad \text{where } K_\infty = \frac{P_\infty}{P_\infty + R}$$
For $F = 1.0$, process noise $Q = 3.0$, and measurement noise $R = 4.0$:
1. Solve for the steady-state variance $P_\infty$.
2. Compute the steady-state Kalman Gain $K_\infty$.

**Solution:**
1. Substitute $K_\infty$ into the Riccati equation with $F = 1$:
   $$P_\infty = \left( 1 - \frac{P_\infty}{P_\infty + R} \right) P_\infty + Q = \left( \frac{R}{P_\infty + R} \right) P_\infty + Q$$
2. Multiply through by $(P_\infty + R)$:
   $$P_\infty (P_\infty + R) = R P_\infty + Q (P_\infty + R)$$
   $$P_\infty^2 + R P_\infty = R P_\infty + Q P_\infty + Q R$$
   The term $R P_\infty$ cancels on both sides:
   $$P_\infty^2 - Q P_\infty - Q R = 0$$
3. Substitute numerical values $Q = 3.0, R = 4.0$:
   $$P_\infty^2 - 3.0 P_\infty - (3.0 \times 4.0) = 0 \implies P_\infty^2 - 3.0 P_\infty - 12.0 = 0$$
4. Apply the quadratic formula:
   $$P_\infty = \frac{-(-3) \pm \sqrt{(-3)^2 - 4(1)(-12)}}{2} = \frac{3 \pm \sqrt{9 + 48}}{2} = \frac{3 \pm \sqrt{57}}{2}$$
   Since variance must be positive:
   $$P_\infty = \frac{3 + 7.5498}{2} = \frac{10.5498}{2} \approx \mathbf{5.2749}$$
5. Compute steady-state Kalman Gain $K_\infty$:
   $$K_\infty = \frac{P_\infty}{P_\infty + R} = \frac{5.2749}{5.2749 + 4.0} = \frac{5.2749}{9.2749} \approx \mathbf{0.5687}$$

---

### Tier 5: Graduate / Research Level — EKF Radar Measurement Jacobian
**Problem:** A ground radar station located at the origin $(0, 0)$ tracks an aircraft with 2D state $\vec{x} = [x, y, \dot{x}, \dot{y}]^T$.
The radar measures range $\rho$ and bearing angle $\theta$:
$$h(\vec{x}) = \begin{bmatrix} \sqrt{x^2 + y^2} \\ \text{atan2}(y, x) \end{bmatrix}$$
Derive the complete $2 \times 4$ observation Jacobian matrix $\mathbf{H}_k = \left. \frac{\partial h}{\partial \vec{x}} \right|_{\hat{x}}$ in terms of Cartesian coordinates $(x, y)$.

**Solution:**
1. Let $\rho = (x^2 + y^2)^{1/2}$. Differentiate range $\rho$ with respect to each state component:
   $$\frac{\partial \rho}{\partial x} = \frac{1}{2}(x^2 + y^2)^{-1/2} (2x) = \frac{x}{\sqrt{x^2 + y^2}} = \frac{x}{\rho}$$
   $$\frac{\partial \rho}{\partial y} = \frac{1}{2}(x^2 + y^2)^{-1/2} (2y) = \frac{y}{\sqrt{x^2 + y^2}} = \frac{y}{\rho}$$
   $$\frac{\partial \rho}{\partial \dot{x}} = 0, \quad \frac{\partial \rho}{\partial \dot{y}} = 0$$
2. Differentiate bearing $\theta = \text{atan2}(y, x)$ where $\tan\theta = \frac{y}{x}$:
   Using the derivative of $\arctan(u)$: $\frac{d}{du}\arctan(u) = \frac{1}{1 + u^2}$:
   $$\frac{\partial \theta}{\partial x} = \frac{1}{1 + (y/x)^2} \left(-\frac{y}{x^2}\right) = \frac{x^2}{x^2 + y^2} \left(-\frac{y}{x^2}\right) = -\frac{y}{x^2 + y^2} = -\frac{y}{\rho^2}$$
   $$\frac{\partial \theta}{\partial y} = \frac{1}{1 + (y/x)^2} \left(\frac{1}{x}\right) = \frac{x^2}{x^2 + y^2} \left(\frac{1}{x}\right) = \frac{x}{x^2 + y^2} = \frac{x}{\rho^2}$$
   $$\frac{\partial \theta}{\partial \dot{x}} = 0, \quad \frac{\partial \theta}{\partial \dot{y}} = 0$$
3. Assembling the $2 \times 4$ Jacobian matrix:
   $$\mathbf{\mathbf{H}_k = \begin{bmatrix} \frac{x}{\rho} & \frac{y}{\rho} & 0 & 0 \\ -\frac{y}{\rho^2} & \frac{x}{\rho^2} & 0 & 0 \end{bmatrix}} \quad \blacksquare$$

---

## 10. Socratic Synthesis & Horizons

1. **Question:** Why is the Kalman filter considered an "optimal" estimator?
   - **Answer:** If the process and measurement noise are Gaussian, the Kalman filter is the mathematically provable **Minimum Mean Square Error (MMSE)** estimator among all possible estimators (linear or non-linear). If the noise is non-Gaussian, the Kalman filter is still the provably **Best Linear Unbiased Estimator (BLUE)**.

2. **Question:** What is the fundamental difference between the Kalman Filter and the Particle Filter?
   - **Answer:** The Kalman filter assumes unimodal Gaussian distributions, requiring only a mean vector and covariance matrix $(\hat{x}, P)$, running in $\mathcal{O}(n^3)$ time. When distributions are heavily non-linear and multimodal (e.g. a robot that might be in Room A or Room B with equal probability), the Particle Filter represents belief using thousands of discrete random particles, escaping the Gaussian limitation at the cost of high computational complexity.
