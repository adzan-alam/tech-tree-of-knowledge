# Chapter 2: The Philosophy of Estimation — Hidden True States, Noisy Sensors, and Naive Dead-Reckoning Drift

Every robotic system that moves through physical space operates under a fundamental epistemic veil: the controller can never directly perceive the true physical state of the universe. Instead, it must infer that state through an imperfect array of physical transducers—MEMS accelerometers, vibrating structure gyroscopes, optical wheel encoders, time-of-flight rangefinders, and GNSS receivers.

When an autonomous system attempts to maintain its belief about position purely by integrating internal proprioceptive signals—a process known as **dead-reckoning**—it encounters a ruthless law of stochastic calculus: **entropy accumulates monotonically**. Without external reference corrections, sensor noise, calibration offsets, and unmodeled friction combine to produce unbounded tracking drift. This chapter establishes the mathematical mechanisms of state propagation, stochastic drift, and the fundamental imperative for recursive Bayesian filtering.

---

## 2.1 State-Space Representations: Truth, Control, and Observations

A dynamical physical system is characterized by a latent (hidden) state vector $x(t) \in \mathbb{R}^n$, an active control input vector $u(t) \in \mathbb{R}^p$, and an observable measurement vector $z(t) \in \mathbb{R}^m$.

```
                       Stochastic Disturbance w(t)
                                 |
                                 v
 Control u(t) ---> [ Physical Dynamics x_dot = f(x, u, w) ] ---> True State x(t)
                                                                       |
                                                                       v
                            Sensor Noise v(t) -----------> [ Sensor h(x, v) ]
                                                                       |
                                                                       v
                                                           Observation z(t)
```

### 2.1.1 Continuous-Time Formulation
In continuous time, physical motion is governed by stochastic differential equations (SDEs) driven by continuous white noise:
$$\dot{x}(t) = f(x(t), u(t), t) + G(t) w_c(t)$$
$$z(t) = h(x(t), t) + v_c(t)$$
where:
- $w_c(t) \in \mathbb{R}^q$ is continuous zero-mean Gaussian white process noise with spectral density $Q_c(t)$:
  $$\mathbb{E}[w_c(t)] = 0, \quad \mathbb{E}[w_c(t) w_c^T(\tau)] = Q_c(t) \delta(t - \tau)$$
- $v_c(t) \in \mathbb{R}^m$ is continuous zero-mean Gaussian white measurement noise with spectral density $R_c(t)$:
  $$\mathbb{E}[v_c(t)] = 0, \quad \mathbb{E}[v_c(t) v_c^T(\tau)] = R_c(t) \delta(t - \tau)$$
- $\delta(t - \tau)$ is the Dirac delta generalized function.

### 2.1.2 Discrete-Time Formulation
Microcontrollers and flight computers execute at discrete sampling intervals $t_k = k \Delta t$. Integrating the continuous dynamics across the time step $[t_{k-1}, t_k]$ yields the discrete-time stochastic difference equations:

$$x_k = f_k(x_{k-1}, u_{k-1}) + w_k$$
$$z_k = h_k(x_k) + v_k$$

where the discrete noise sequences are white, zero-mean, and uncorrelated across time:
$$\mathbb{E}[w_k] = 0, \quad \mathbb{E}[w_j w_k^T] = Q_k \delta_{jk}$$
$$\mathbb{E}[v_k] = 0, \quad \mathbb{E}[v_j v_k^T] = R_k \delta_{jk}$$
$$\mathbb{E}[w_j v_k^T] = 0 \quad \forall j, k$$
Here $\delta_{jk}$ is the Kronecker delta ($\delta_{jk} = 1$ if $j=k$, and $0$ otherwise).

---

## 2.2 The Mechanics of Dead-Reckoning Drift

Dead-reckoning is the process of estimating one's current position by projecting forward from a previously known position using measured speed, acceleration, or wheel rotations.

### 2.2.1 1D Random Walk: The Velocity Integration Problem
Consider a 1D autonomous ground vehicle whose forward velocity $v_k$ is measured by a wheel encoder or tachometer:
$$z_{v,k} = v_k + \eta_k$$
where $\eta_k \sim \mathcal{N}(0, \sigma_v^2)$ is discrete zero-mean white noise with variance $\sigma_v^2$.
The vehicle estimates its position by discrete integration with time step $\Delta t$:
$$\hat{p}_k = \hat{p}_{k-1} + z_{v,k} \Delta t = \hat{p}_0 + \Delta t \sum_{i=1}^k (v_i + \eta_i) = \left( p_0 + \Delta t \sum_{i=1}^k v_i \right) + \Delta t \sum_{i=1}^k \eta_i$$
The true position is $p_k = p_0 + \Delta t \sum_{i=1}^k v_i$. The estimation error is:
$$e_k = \hat{p}_k - p_k = \Delta t \sum_{i=1}^k \eta_i$$

Taking the mathematical expectation:
$$\mathbb{E}[e_k] = \Delta t \sum_{i=1}^k \mathbb{E}[\eta_i] = 0 \quad \text{(The estimator is nominally unbiased)}$$
However, evaluating the variance of the error accumulated after $k$ steps ($t = k \Delta t$):
$$\sigma_{p,k}^2 = \mathbb{E}[e_k^2] = \Delta t^2 \mathbb{E}\left[ \left( \sum_{i=1}^k \eta_i \right)^2 \right] = \Delta t^2 \sum_{i=1}^k \mathbb{E}[\eta_i^2] = \Delta t^2 (k \sigma_v^2) = (k \Delta t) (\sigma_v^2 \Delta t) = t \cdot (\sigma_v^2 \Delta t)$$

Taking the standard deviation:
$$\sigma_{p}(t) = \sigma_v \sqrt{\Delta t} \cdot \sqrt{t} \propto \sqrt{t}$$

This is the classic **Brownian Motion / Random Walk** result:
- After 1 minute ($60\text{ s}$), position uncertainty grows by $\sqrt{60} \approx 7.75\times$.
- After 1 hour ($3600\text{ s}$), position uncertainty grows by $\sqrt{3600} = 60\times$.
- As $t \to \infty$, $\sigma_p(t) \to \infty$. **Uncertainty is unbounded.**

```
 Position Uncertainty \sigma_p(t)
        ^
        |                                       . - ~ ~ (Random Walk ~ sqrt(t))
        |                             . - ~ ~
        |                    . - ~ ~
        |             . - ~
        |       . - ~
        | . - ~
        +----------------------------------------------------> Time t
```

---

## 2.3 IMU Accelerometer Double Integration and Cubic Drift

In aerospace vehicles, submarines, and drones, GPS/GNSS signals are frequently unavailable or jammed. The navigation system must rely on an **Inertial Measurement Unit (IMU)** consisting of tri-axial accelerometers and gyroscopes.

Accelerometers measure specific force $f(t) = a(t) - g$. Position is obtained by double integrating the measured acceleration:
$$\hat{a}(t) = a(t) + b_a(t) + \eta_a(t)$$
where:
1. $a(t)$ is the true kinematic acceleration.
2. $b_a(t)$ is the **sensor bias** (an unknown, slowly drifting offset caused by temperature and mechanical stress).
3. $\eta_a(t)$ is Gaussian white noise with spectral density $S_a = \sigma_a^2$.

### 2.3.1 Impact of Accelerometer White Noise
Assume momentarily that the bias is perfectly calibrated ($b_a = 0$), leaving only white noise $\eta_a(t)$.
Velocity is obtained by single integration:
$$v(t) = v(0) + \int_0^t (a(\tau) + \eta_a(\tau)) d\tau \implies e_v(t) = \int_0^t \eta_a(\tau) d\tau$$
Position is obtained by double integration:
$$p(t) = p(0) + \int_0^t v(\tau) d\tau = p(0) + \int_0^t \left( v(0) + \int_0^\tau (a(s) + \eta_a(s)) ds \right) d\tau$$
The position error due to noise is:
$$e_p(t) = \int_0^t \int_0^\tau \eta_a(s) \, ds \, d\tau$$
Applying integration by parts or Cauchy's formula for repeated integration:
$$e_p(t) = \int_0^t (t - \tau) \eta_a(\tau) d\tau$$

The variance of position error is:
$$\mathbb{E}[e_p^2(t)] = \mathbb{E}\left[ \left( \int_0^t (t - \tau) \eta_a(\tau) d\tau \right) \left( \int_0^t (t - s) \eta_a(s) ds \right) \right]$$
Using the continuous white noise property $\mathbb{E}[\eta_a(\tau) \eta_a(s)] = S_a \delta(\tau - s)$:
$$\mathbb{E}[e_p^2(t)] = \int_0^t \int_0^t (t - \tau)(t - s) S_a \delta(\tau - s) \, d\tau \, ds = S_a \int_0^t (t - \tau)^2 d\tau$$
Evaluating the integral:
$$\int_0^t (t - \tau)^2 d\tau = \left[ -\frac{(t - \tau)^3}{3} \right]_0^t = 0 - \left( -\frac{t^3}{3} \right) = \frac{t^3}{3}$$

Therefore, the position variance under accelerometer white noise is:
$$\sigma_p^2(t) = \frac{1}{3} S_a t^3 \implies \sigma_p(t) = \sqrt{\frac{S_a}{3}} \, t^{3/2} \propto t^{1.5}$$

### 2.3.2 Impact of Constant Accelerometer Bias
Now consider a constant, uncalibrated accelerometer bias $b_a \neq 0$:
$$\hat{a}(t) = a(t) + b_a$$
Integrating twice with respect to time:
$$e_v(t) = \int_0^t b_a \, d\tau = b_a t$$
$$e_p(t) = \int_0^t e_v(\tau) d\tau = \int_0^t b_a \tau \, d\tau = \frac{1}{2} b_a t^2$$

The position error caused by constant accelerometer bias explodes **quadratically** with time:
$$e_p(t) \propto t^2$$

> [!CAUTION]
> **The Catastrophic Reality of Consumer MEMS IMUs:**
> Consider a standard commercial drone MEMS accelerometer with a tiny residual bias of $b_a = 0.05\text{ m/s}^2$ (roughly $5\text{ mg}$, common in smartphones and consumer drones).
> - After $t = 10\text{ s}$: $e_p = \frac{1}{2}(0.05)(10)^2 = 2.5\text{ m}$.
> - After $t = 60\text{ s}$ (1 minute): $e_p = \frac{1}{2}(0.05)(60)^2 = 90\text{ m}$!
> - After $t = 300\text{ s}$ (5 minutes): $e_p = \frac{1}{2}(0.05)(300)^2 = 2,250\text{ m} = 2.25\text{ km}$!
> Within five minutes, dead-reckoning reports that the drone is miles away from its true location. Without sensor fusion, open-loop inertial navigation is suicidal.

---

## 2.4 Gyroscope Bias and Angular Orientation Drift

Position integration depends fundamentally on having an accurate orientation estimate to rotate accelerometer measurements from the sensor body frame into the navigation world frame:
$$a_{\text{world}}(t) = R_{\text{body}}^{\text{world}}(t) a_{\text{body}}(t) - g_{\text{world}}$$
A tri-axial gyroscope measures angular velocity $\omega(t)$.
Like accelerometers, gyroscopes suffer from rate bias $b_g$:
$$\hat{\omega}(t) = \omega(t) + b_g + \eta_g(t)$$
Integrating angular rate to obtain heading angle $\theta(t)$:
$$e_\theta(t) = b_g t + \int_0^t \eta_g(\tau) d\tau$$
A constant gyro bias $b_g$ induces a linear heading error $e_\theta(t) = b_g t$.

### 2.4.1 The Gravity Leakage Disaster
When the estimated roll or pitch angle drifts by small angle $\delta\theta$, the gravity compensation vector $g_{\text{world}} = [0, 0, -9.81]^T\text{ m/s}^2$ is incorrectly rotated.
The tilt error leaks a component of gravity into the horizontal plane:
$$a_{\text{horizontal, error}} = g \sin(\delta\theta) \approx g \cdot \delta\theta = g \cdot (b_g t)$$
Integrating this false horizontal acceleration once yields velocity error:
$$e_v(t) = \int_0^t g b_g \tau \, d\tau = \frac{1}{2} g b_g t^2$$
Integrating again yields horizontal position error:
$$e_p(t) = \int_0^t \frac{1}{2} g b_g \tau^2 d\tau = \frac{1}{6} g b_g t^3$$

> [!WARNING]
> Because of **gravity leakage**, an uncorrected gyroscope bias causes horizontal position drift that scales as $t^3$ (cubic in time)!
> If a drone gyro has a tiny bias of $0.1^\circ/\text{s} = 0.001745\text{ rad/s}$:
> After $60\text{ s}$: $e_p = \frac{1}{6}(9.81)(0.001745)(60)^3 \approx 616\text{ meters}$!
> Gyroscope errors are far more lethal to navigation than accelerometer errors because they weaponize the Earth's gravitational acceleration against the state estimator.

---

## 2.5 The Philosophical Imperative for Sensor Fusion

The mathematical realities established above dictate a fundamental operational duality:

```
+------------------------------------+------------------------------------+
|  PROPRIOCEPTIVE / INERTIAL SENSORS | EXTEROCEPTIVE / ABSOLUTE SENSORS   |
|  (IMU, Encoders, Gyros)            | (GPS, Camera, LiDAR, Landmarks)    |
+------------------------------------+------------------------------------+
| High bandwidth (100 Hz - 2000 Hz)  | Low bandwidth (1 Hz - 30 Hz)       |
| Low latency (< 1 ms)               | High latency (20 ms - 200 ms)      |
| Complete internal autonomy         | Subject to occlusions, jamming     |
| Continuous, smooth trajectories    | Discrete, jumpy fixes              |
| Monotonically diverging drift      | Zero long-term drift (bounded var) |
+------------------------------------+------------------------------------+
```

Neither sensor class is sufficient on its own:
- An autonomous car relying only on an IMU will crash into a guardrail within 30 seconds due to cubic integration drift.
- An autonomous car relying only on GPS will lose control during rapid evasive steering maneuvers due to the $1\text{ Hz}$ update rate and $100\text{ ms}$ latency.

The Kalman filter is the optimal mathematical synthesis that unites these two worlds: it uses high-rate inertial integration to propagate the state forward between sensor frames, and uses low-rate exteroceptive measurements to bound the drift, estimate the hidden biases, and collapse the uncertainty.

---

## 2.6 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 2.1 – 2.10)

#### Problem 2.1: 1D Odometry Random Walk Variance Accumulation
**Statement:**
A warehouse AGV (Automated Guided Vehicle) measures its forward speed with a wheel encoder sampled at frequency $f = 50\text{ Hz}$ ($\Delta t = 0.02\text{ s}$). The speed measurement noise has standard deviation $\sigma_v = 0.05\text{ m/s}$.
1. Derive the variance and standard deviation of position error after $t = 10\text{ s}$, $t = 60\text{ s}$, and $t = 600\text{ s}$ of open-loop dead-reckoning.
2. Determine how long the AGV can travel before its $3\sigma$ position uncertainty exceeds $0.5\text{ m}$ (the width of an aisle tolerance).

**Given Data:**
- $\Delta t = 0.02\text{ s}$, $\sigma_v = 0.05\text{ m/s}$.
- Tolerance: $3 \sigma_p(t) \le 0.5\text{ m} \implies \sigma_p(t) \le 0.1667\text{ m}$.

**Step-by-Step Derivation:**
1. **Variance Formula:**
   From Section 2.2.1, the position variance after $k$ steps ($t = k \Delta t$) is:
   $$\sigma_p^2(t) = \sigma_v^2 \Delta t \cdot t = (0.05)^2 (0.02) t = (0.0025)(0.02) t = 5 \times 10^{-5} t\text{ m}^2$$
   The standard deviation is:
   $$\sigma_p(t) = \sqrt{5 \times 10^{-5} t} = 0.007071 \sqrt{t}\text{ m}$$
2. **Evaluations at Specific Times:**
   - At $t = 10\text{ s}$:
     $$\sigma_p^2(10) = 5 \times 10^{-5} \times 10 = 5 \times 10^{-4}\text{ m}^2 \implies \sigma_p(10) = \sqrt{0.0005} \approx 0.02236\text{ m} = 2.24\text{ cm}$$
   - At $t = 60\text{ s}$ (1 min):
     $$\sigma_p^2(60) = 5 \times 10^{-5} \times 60 = 0.0030\text{ m}^2 \implies \sigma_p(60) = \sqrt{0.0030} \approx 0.05477\text{ m} = 5.48\text{ cm}$$
   - At $t = 600\text{ s}$ (10 min):
     $$\sigma_p^2(600) = 5 \times 10^{-5} \times 600 = 0.030\text{ m}^2 \implies \sigma_p(600) = \sqrt{0.030} \approx 0.17321\text{ m} = 17.32\text{ cm}$$
3. **Time to Exceed Tolerance:**
   $$3 \sigma_p(t) = 3 (0.007071 \sqrt{t}) = 0.021213 \sqrt{t} = 0.5\text{ m}$$
   $$\sqrt{t} = \frac{0.5}{0.021213} \approx 23.5702$$
   $$t_{\text{limit}} = (23.5702)^2 \approx 555.56\text{ s} \approx 9.26\text{ minutes}$$

**Final Answer:**
- At $t = 10\text{ s}$: $\sigma_p \approx 0.0224\text{ m}$ ($2.24\text{ cm}$).
- At $t = 60\text{ s}$: $\sigma_p \approx 0.0548\text{ m}$ ($5.48\text{ cm}$).
- At $t = 600\text{ s}$: $\sigma_p \approx 0.1732\text{ m}$ ($17.32\text{ cm}$).
- Safe operating duration: $t_{\text{limit}} \approx 555.6\text{ s}$ ($9.26\text{ min}$).

**Verification:**
At $t = 555.56\text{ s}$, $\sigma_p = \sqrt{5 \times 10^{-5} \times 555.56} = \sqrt{0.027778} = 0.16667\text{ m}$. $3\sigma_p = 3 \times 0.16667 = 0.5000\text{ m}$. Exact match.

---

#### Problem 2.2: Accelerometer Double Integration Drift Under Constant Bias
**Statement:**
A spacecraft navigation system undergoes an orbital burn where the primary accelerometer has an unmodeled residual bias $b_a = 0.002\text{ m/s}^2$ ($2\text{ mm/s}^2 \approx 0.2\text{ mg}$).
Compute:
1. The velocity error $e_v(t)$ and position error $e_p(t)$ after $t = 30\text{ s}$, $t = 120\text{ s}$, and $t = 600\text{ s}$.
2. The time required for the position error to reach $100.0\text{ m}$.

**Given Data:**
- Bias: $b_a = 0.002\text{ m/s}^2$. Initial errors: $e_v(0) = 0, e_p(0) = 0$.

**Step-by-Step Derivation:**
1. **Error Kinematics:**
   $$e_a(t) = b_a = 0.002\text{ m/s}^2$$
   $$e_v(t) = \int_0^t b_a d\tau = b_a t = 0.002 t\text{ m/s}$$
   $$e_p(t) = \int_0^t e_v(\tau) d\tau = \frac{1}{2} b_a t^2 = 0.001 t^2\text{ m}$$
2. **Evaluations at Specific Times:**
   - At $t = 30\text{ s}$:
     $$e_v(30) = 0.002 \times 30 = 0.06\text{ m/s}$$
     $$e_p(30) = 0.001 \times (30)^2 = 0.001 \times 900 = 0.90\text{ m}$$
   - At $t = 120\text{ s}$ (2 min):
     $$e_v(120) = 0.002 \times 120 = 0.24\text{ m/s}$$
     $$e_p(120) = 0.001 \times (120)^2 = 0.001 \times 14400 = 14.40\text{ m}$$
   - At $t = 600\text{ s}$ (10 min):
     $$e_v(600) = 0.002 \times 600 = 1.20\text{ m/s}$$
     $$e_p(600) = 0.001 \times (600)^2 = 0.001 \times 360000 = 360.00\text{ m}$$
3. **Time to Reach $100\text{ m}$:**
   $$e_p(t) = 0.001 t^2 = 100.0\text{ m} \implies t^2 = \frac{100.0}{0.001} = 100,000\text{ s}^2$$
   $$t = \sqrt{100,000} \approx 316.23\text{ s} \approx 5.27\text{ minutes}$$

**Final Answer:**
- At $t = 30\text{ s}$: $e_v = 0.06\text{ m/s}, e_p = 0.90\text{ m}$.
- At $t = 120\text{ s}$: $e_v = 0.24\text{ m/s}, e_p = 14.40\text{ m}$.
- At $t = 600\text{ s}$: $e_v = 1.20\text{ m/s}, e_p = 360.00\text{ m}$.
- Time to $100\text{ m}$ error: $t \approx 316.2\text{ s}$ ($5.27\text{ min}$).

**Verification:**
At $t = 316.23\text{ s}$: $e_p = 0.001(316.23)^2 = 0.001(100,000) = 100.0\text{ m}$. Quadratic growth verified.

---

#### Problem 2.3: Accelerometer White Noise Double Integration ($t^3$ Growth)
**Statement:**
A tactical-grade IMU has an accelerometer white noise spectral density of $S_a = 1.0 \times 10^{-4}\text{ (m/s}^2)^2/\text{Hz}$ (velocity random walk $\text{VRW} \approx 0.01\text{ m/s}/\sqrt{\text{s}}$).
Assuming zero bias:
1. Compute the analytical position variance $\sigma_p^2(t)$ and standard deviation $\sigma_p(t)$ after $t = 10\text{ s}$, $t = 60\text{ s}$, and $t = 300\text{ s}$.
2. Compare the position uncertainty at $t = 60\text{ s}$ with the error caused by a constant bias of $b_a = 0.01\text{ m/s}^2$.

**Given Data:**
- $S_a = 1.0 \times 10^{-4}\text{ m}^2/\text{s}^3$.
- Bias for comparison: $b_a = 0.01\text{ m/s}^2$.

**Step-by-Step Derivation:**
1. **Variance Formula:**
   From Section 2.3.1:
   $$\sigma_p^2(t) = \frac{1}{3} S_a t^3 = \frac{1}{3} (1.0 \times 10^{-4}) t^3 = 3.3333 \times 10^{-5} t^3\text{ m}^2$$
   $$\sigma_p(t) = \sqrt{\frac{S_a}{3}} t^{3/2} = \sqrt{3.3333 \times 10^{-5}} t^{1.5} = 0.0057735 t^{1.5}\text{ m}$$
2. **Evaluations at Specific Times:**
   - At $t = 10\text{ s}$:
     $$\sigma_p(10) = 0.0057735 \times 10^{1.5} = 0.0057735 \times 31.6228 \approx 0.1826\text{ m}$$
   - At $t = 60\text{ s}$:
     $$\sigma_p(60) = 0.0057735 \times 60^{1.5} = 0.0057735 \times 464.758 \approx 2.6833\text{ m}$$
   - At $t = 300\text{ s}$ (5 min):
     $$\sigma_p(300) = 0.0057735 \times 300^{1.5} = 0.0057735 \times 5196.15 \approx 30.00\text{ m}$$
3. **Comparison with Constant Bias at $t = 60\text{ s}$:**
   Position error from constant bias $b_a = 0.01\text{ m/s}^2$:
   $$e_{p,\text{bias}}(60) = \frac{1}{2} b_a t^2 = \frac{1}{2}(0.01)(60)^2 = 0.005 \times 3600 = 18.00\text{ m}$$
   Ratio:
   $$\frac{e_{p,\text{bias}}}{\sigma_p} = \frac{18.00}{2.6833} \approx 6.71$$
   The constant bias error is nearly $7\times$ larger than the $1\sigma$ noise dispersion.

**Final Answer:**
- At $t = 10\text{ s}$: $\sigma_p \approx 0.183\text{ m}$.
- At $t = 60\text{ s}$: $\sigma_p \approx 2.683\text{ m}$.
- At $t = 300\text{ s}$: $\sigma_p \approx 30.00\text{ m}$.
- Bias error ($18.0\text{ m}$) dominates white noise ($2.68\text{ m}$) at 1 minute.

**Verification:**
Ratio of $\sigma_p(300)/\sigma_p(60) = (300/60)^{1.5} = 5^{1.5} = 5\sqrt{5} \approx 11.18$. Indeed: $2.6833 \times 11.1803 = 30.00\text{ m}$. Exact scaling verified.

---

#### Problem 2.4: Gravity Leakage Induced by Gyroscope Bias
**Statement:**
A micro-aerial vehicle (drone) in level flight experiences an uncalibrated pitch gyroscope bias $b_g = 0.05^\circ/\text{s} \approx 8.7266 \times 10^{-4}\text{ rad/s}$.
The true horizontal acceleration is zero. Gravitational acceleration is $g = 9.81\text{ m/s}^2$.
1. Compute the tilt error $\delta\theta(t)$ after $t = 20\text{ s}$ and $t = 60\text{ s}$.
2. Derive the false horizontal acceleration $a_{\text{false}}(t)$ induced by gravity leakage.
3. Compute the resulting horizontal position drift $e_p(t)$ after $t = 20\text{ s}$ and $t = 60\text{ s}$.

**Given Data:**
- $b_g = 8.7266 \times 10^{-4}\text{ rad/s}$, $g = 9.81\text{ m/s}^2$.

**Step-by-Step Derivation:**
1. **Tilt Error:**
   $$\delta\theta(t) = b_g t$$
   - At $t = 20\text{ s}$: $\delta\theta(20) = (8.7266 \times 10^{-4})(20) = 0.017453\text{ rad} = 1.00^\circ$.
   - At $t = 60\text{ s}$: $\delta\theta(60) = (8.7266 \times 10^{-4})(60) = 0.052360\text{ rad} = 3.00^\circ$.
2. **False Horizontal Acceleration:**
   Under small angles $\sin(\delta\theta) \approx \delta\theta$:
   $$a_{\text{false}}(t) = g \sin(\delta\theta(t)) \approx g b_g t = (9.81)(8.7266 \times 10^{-4}) t = 0.0085608 t\text{ m/s}^2$$
3. **Horizontal Position Drift:**
   Integrating false acceleration twice:
   $$v_{\text{drift}}(t) = \int_0^t a_{\text{false}}(\tau) d\tau = \frac{1}{2} g b_g t^2 = \frac{1}{2}(0.0085608) t^2 = 0.0042804 t^2\text{ m/s}$$
   $$e_p(t) = \int_0^t v_{\text{drift}}(\tau) d\tau = \frac{1}{6} g b_g t^3 = \frac{1}{6}(0.0085608) t^3 = 0.0014268 t^3\text{ m}$$
4. **Numerical Evaluations:**
   - At $t = 20\text{ s}$:
     $$e_p(20) = 0.0014268 \times (20)^3 = 0.0014268 \times 8000 = 11.414\text{ m}$$
   - At $t = 60\text{ s}$:
     $$e_p(60) = 0.0014268 \times (60)^3 = 0.0014268 \times 216000 = 308.19\text{ m}$$

**Final Answer:**
- At $t = 20\text{ s}$: Tilt error $\delta\theta = 1.0^\circ$, position drift $e_p \approx 11.41\text{ m}$.
- At $t = 60\text{ s}$: Tilt error $\delta\theta = 3.0^\circ$, position drift $e_p \approx 308.19\text{ m}$.
- Cubic scaling: In just 1 minute, a $0.05^\circ/\text{s}$ gyro bias produces over $300\text{ m}$ of position error!

**Verification:**
Ratio: $(60/20)^3 = 3^3 = 27$. $11.414 \times 27 = 308.18\text{ m}$. Exact cubic match.

---

#### Problem 2.5: Differential Drive Robot Slip and Angular Odometry Divergence
**Statement:**
A two-wheeled differential drive robot has wheel baseline $W = 0.5\text{ m}$ and nominal wheel radius $r = 0.1\text{ m}$. Wheel encoders sample at $\Delta t = 0.05\text{ s}$. 
Due to a $1\%$ wheel radius calibration error on the right wheel ($r_R = 1.01 r_L$), the robot travels nominally straight at commanded speed $v = 1.0\text{ m/s}$ ($v_L = v_R = 1.0\text{ m/s}$).
1. Calculate the false yaw rate $\omega_{\text{false}}$ induced by the wheel mismatch.
2. Determine the heading error $\theta(t)$ after $t = 30\text{ s}$ of motion.
3. Compute the true trajectory coordinates $(x(t), y(t))$ compared to the dead-reckoned trajectory $(\hat{x}(t), \hat{y}(t))$ and find the net position error after $t = 30\text{ s}$.

**Given Data:**
- $W = 0.5\text{ m}, v_L = 1.0\text{ m/s}, v_R = 1.01\text{ m/s}, t = 30\text{ s}$.

**Step-by-Step Derivation:**
1. **False Yaw Rate:**
   Kinematics of a differential drive robot:
   $$\omega = \frac{v_R - v_L}{W} = \frac{1.01 - 1.00}{0.5} = \frac{0.01}{0.5} = 0.02\text{ rad/s}$$
   The actual forward speed is $v_{\text{mid}} = \frac{v_R + v_L}{2} = \frac{2.01}{2} = 1.005\text{ m/s}$.
2. **Heading Error:**
   $$\theta(t) = \omega t = 0.02 \times 30 = 0.60\text{ rad} \approx 34.38^\circ$$
3. **Dead-Reckoned Trajectory:**
   The robot firmware assumes $v_R = v_L = 1.0\text{ m/s} \implies \hat{\omega} = 0$:
   $$\hat{x}(30) = \int_0^{30} 1.0 \, dt = 30.0\text{ m}, \quad \hat{y}(30) = 0.0\text{ m}$$
4. **True Trajectory:**
   The robot follows a circular arc of radius $R_{\text{curve}} = \frac{v_{\text{mid}}}{\omega} = \frac{1.005}{0.02} = 50.25\text{ m}$:
   $$x(t) = R_{\text{curve}} \sin(\omega t) = 50.25 \sin(0.60) = 50.25 \times 0.564642 \approx 28.373\text{ m}$$
   $$y(t) = R_{\text{curve}} (1 - \cos(\omega t)) = 50.25 (1 - \cos(0.60)) = 50.25 (1 - 0.825336) = 50.25(0.174664) \approx 8.777\text{ m}$$
5. **Net Position Error:**
   $$e = \sqrt{(\hat{x} - x)^2 + (\hat{y} - y)^2} = \sqrt{(30.0 - 28.373)^2 + (0 - 8.777)^2} = \sqrt{(1.627)^2 + (-8.777)^2} = \sqrt{2.647 + 77.036} = \sqrt{79.683} \approx 8.926\text{ m}$$

**Final Answer:**
- False yaw rate: $\omega = 0.02\text{ rad/s}$.
- Heading error: $\theta(30) = 0.60\text{ rad} \approx 34.38^\circ$.
- Dead-reckoned pose: $[30.0, 0.0]^T\text{ m}$. True pose: $[28.37, 8.78]^T\text{ m}$.
- Total position error: $e \approx 8.93\text{ m}$.

**Verification:**
A mere $1\%$ physical tire compression causes the robot to deviate laterally by nearly $9\text{ meters}$ after only $30\text{ meters}$ of forward travel.

---

#### Problem 2.6: Continuous-to-Discrete Process Noise Covariance Integration
**Statement:**
A 1D continuous double integrator (acceleration input) is described by:
$$\dot{x}(t) = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} x(t) + \begin{bmatrix} 0 \\ 1 \end{bmatrix} w_c(t)$$
where $x = [p, v]^T$ and $w_c(t)$ is zero-mean continuous white acceleration noise with power spectral density $q_c = 0.2\text{ (m/s}^2)^2/\text{Hz}$.
Compute the exact discrete-time process noise covariance matrix $Q_k$ over time step $\Delta t = 0.1\text{ s}$ using the continuous-to-discrete integral:
$$Q_k = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$$

**Given Data:**
- $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}, Q_c = q_c = 0.2, \Delta t = 0.1\text{ s}$.

**Step-by-Step Derivation:**
1. **Matrix Exponential $e^{A \tau}$:**
   Since $A^2 = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$, the Taylor series terminates:
   $$e^{A \tau} = I + A \tau = \begin{bmatrix} 1 & \tau \\ 0 & 1 \end{bmatrix}$$
2. **Matrix Product $e^{A \tau} G$:**
   $$e^{A \tau} G = \begin{bmatrix} 1 & \tau \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \tau \\ 1 \end{bmatrix}$$
3. **Integrand Matrix:**
   $$(e^{A \tau} G) q_c (e^{A \tau} G)^T = q_c \begin{bmatrix} \tau \\ 1 \end{bmatrix} \begin{bmatrix} \tau & 1 \end{bmatrix} = q_c \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix}$$
4. **Integration Across $[0, \Delta t]$:**
   $$Q_k = q_c \int_0^{\Delta t} \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix} d\tau = q_c \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
5. **Numerical Evaluation with $\Delta t = 0.1\text{ s}, q_c = 0.2$:**
   $$\frac{\Delta t^3}{3} = \frac{0.001}{3} \approx 0.00033333$$
   $$\frac{\Delta t^2}{2} = \frac{0.01}{2} = 0.005$$
   $$\Delta t = 0.1$$
   $$Q_k = 0.2 \begin{bmatrix} \frac{0.001}{3} & 0.005 \\ 0.005 & 0.1 \end{bmatrix} = \begin{bmatrix} \frac{0.0002}{3} & 0.001 \\ 0.001 & 0.02 \end{bmatrix} = \begin{bmatrix} 6.6667 \times 10^{-5} & 1.0000 \times 10^{-3} \\ 1.0000 \times 10^{-3} & 2.0000 \times 10^{-2} \end{bmatrix}$$

**Final Answer:**
- Analytical: $Q_k = q_c \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$.
- Numerical: $Q_k = \begin{bmatrix} 6.667 \times 10^{-5} & 1.000 \times 10^{-3} \\ 1.000 \times 10^{-3} & 0.0200 \end{bmatrix}\text{ (units: m}^2, \text{m}^2/\text{s}, \text{m}^2/\text{s}^2)$.

**Verification:**
Determinant: $\det(Q_k) = q_c^2 \left( \frac{\Delta t^4}{3} - \frac{\Delta t^4}{4} \right) = q_c^2 \frac{\Delta t^4}{12} = (0.04) \frac{10^{-4}}{12} = 3.333 \times 10^{-7} > 0$. Strictly positive definite.

---

#### Problem 2.7: Allan Variance Analysis of IMU Noise Processes
**Statement:**
An inertial sensor engineer characterizes a MEMS gyroscope by computing its **Allan Variance** $\sigma_A^2(\tau)$ as a function of cluster averaging time $\tau$.
The empirical log-log plot exhibits three characteristic slope regimes:
- Regime 1: Slope $-1$ for $\tau \in [0.01\text{ s}, 1\text{ s}]$ with coefficient $N = 0.002\text{ rad}/\sqrt{\text{s}}$ (Angle Random Walk).
- Regime 2: Slope $0$ (flat bottom) for $\tau \in [10\text{ s}, 100\text{ s}]$ with minimum $\sigma_{\text{min}} = 1.5 \times 10^{-5}\text{ rad/s}$ (In-Run Bias Instability $B$).
- Regime 3: Slope $+1$ for $\tau > 300\text{ s}$ with coefficient $K = 1.0 \times 10^{-6}\text{ rad}/\text{s}^{3/2}$ (Rate Random Walk).
1. Explain the physical mechanism generating each of the three regimes.
2. Determine the optimal averaging time $\tau^*$ to minimize bias estimation error.
3. Express the continuous white noise spectral density $Q_c$ in terms of $N$.

**Given Data:**
- $N = 0.002\text{ rad}/\sqrt{\text{s}}$, $B = 1.5 \times 10^{-5}\text{ rad/s}$, $K = 1.0 \times 10^{-6}\text{ rad}/\text{s}^{3/2}$.

**Step-by-Step Derivation:**
1. **Physical Mechanisms:**
   - **Regime 1 (Angle Random Walk / White Noise):** Caused by thermal white noise in the capacitive readout electronics. Averaging over longer time windows $\tau$ suppresses white noise as $1/\sqrt{\tau}$ (slope $-0.5$ on Allan deviation, slope $-1$ on Allan variance).
   - **Regime 2 (In-Run Bias Instability / Flicker Noise):** Caused by low-frequency $1/f$ flicker noise in the electronics and micro-resonator mechanical anchors. The flat minimum represents the fundamental noise floor below which averaging provides zero benefit.
   - **Regime 3 (Rate Random Walk / Brown Noise):** Caused by slow thermal gradients, mechanical aging, and environmental temperature fluctuations that cause the gyro bias itself to wander as a Wiener process ($\dot{b} = w_b$). Over long time horizons, drift dominates and error grows as $\sqrt{\tau}$.
2. **Optimal Averaging Window:**
   The optimal averaging duration $\tau^*$ is the cluster time at the flat valley (Regime 2), typically between $10\text{ s}$ and $100\text{ s}$. Choosing $\tau^* \approx 30\text{ s}$ achieves the minimum estimation variance $\sigma_{\text{bias}} \approx B = 1.5 \times 10^{-5}\text{ rad/s}$.
3. **Continuous Spectral Density $Q_c$:**
   By IEEE Standard 952 for gyro testing, the angle random walk parameter $N$ is directly related to the continuous white noise spectral density $Q_c$ by:
   $$Q_c = N^2 = (0.002)^2 = 4.0 \times 10^{-6}\text{ (rad/s)}^2/\text{Hz}$$

**Final Answer:**
- Regime 1: High-frequency white noise ($1/\sqrt{\tau}$).
- Regime 2: $1/f$ flicker noise / in-run bias stability floor ($B \approx 1.5 \times 10^{-5}\text{ rad/s}$).
- Regime 3: Long-term temperature drift / rate random walk ($\sqrt{\tau}$).
- Optimal averaging window: $\tau^* \approx 30\text{ s}$.
- Spectral density: $Q_c = 4.0 \times 10^{-6}\text{ rad}^2/\text{s}$.

**Verification:**
Allan variance decomposition conforms exactly to IEEE Std 952-1997 for inertial sensor modeling.

---

#### Problem 2.8: Latency-Induced Estimation Error in High-Speed Visual Tracking
**Statement:**
An autonomous drone flies at constant speed $v = 15.0\text{ m/s}$ along a straight trajectory. An onboard neural camera detects visual landmarks and computes position fixes, but the perception pipeline introduces an image processing and neural inference latency of $\tau_{\text{delay}} = 80\text{ ms}$ ($0.080\text{ s}$).
1. Calculate the spatial lag $d_{\text{lag}}$ between the reported camera position and the drone's actual physical position at the moment the measurement is received.
2. If the drone controller feeds this delayed visual measurement directly into its flight feedback loop without latency compensation, calculate the resulting position tracking error.
3. Show how a Kalman filter uses high-rate IMU forward propagation to project the delayed visual measurement forward to the current timestamp.

**Given Data:**
- $v = 15.0\text{ m/s}, \tau_{\text{delay}} = 0.080\text{ s}$.

**Step-by-Step Derivation:**
1. **Spatial Lag:**
   During the $80\text{ ms}$ required for feature detection and neural inference, the drone continues moving at $15\text{ m/s}$:
   $$d_{\text{lag}} = v \cdot \tau_{\text{delay}} = (15.0\text{ m/s})(0.080\text{ s}) = 1.20\text{ m}$$
2. **Uncompensated Tracking Error:**
   The camera measurement arriving at timestamp $t$ reflects physical state at $t - \tau_{\text{delay}}$. Treating it as instantaneous introduces an unmodeled position bias of $1.20\text{ meters}$. At $15\text{ m/s}$, an unmodeled $1.2\text{ m}$ position error can cause catastrophic collision with trees or building facades.
3. **Kalman Filter Forward Compensation:**
   Let the measurement arrive at current time $t_k$, tagged with acquisition timestamp $t_{\text{meas}} = t_k - \tau_{\text{delay}}$.
   The Kalman filter resolves this latency via two standard approaches:
   - **Method A (Measurement Prediction):** Project the state estimate back to the measurement time:
     $$\hat{z}_k = h(\hat{x}_{t_{\text{meas}}})$$
     Compute residual $y = z_{\text{meas}} - \hat{z}_k$, and project the correction forward across the IMU trajectory.
   - **Method B (State Forward Projection):** Correct the historical state $\hat{x}(t_{\text{meas}})$ and re-integrate the high-rate cached IMU buffer forward from $t_{\text{meas}}$ to $t_k$:
     $$\hat{x}(t_k) = \hat{x}_{\text{corrected}}(t_{\text{meas}}) + \int_{t_{\text{meas}}}^{t_k} v_{\text{IMU}}(\tau) d\tau$$
   This eliminates the entire $1.20\text{ m}$ spatial lag.

**Final Answer:**
- Spatial lag: $d_{\text{lag}} = 1.20\text{ m}$.
- Direct feedback tracking error: $1.20\text{ m}$ systematic lag.
- Resolved by re-integrating buffered IMU propagation across the $80\text{ ms}$ latency window.

**Verification:**
At $\tau_{\text{delay}} \to 0$, $d_{\text{lag}} \to 0$. At high speeds ($v = 30\text{ m/s}$), lag doubles to $2.40\text{ m}$, illustrating why high-speed autonomy requires explicit delay compensation.

---

#### Problem 2.9: The Gauss-Markov Random Walk Model for Sensor Bias
**Statement:**
In reality, sensor bias does not remain strictly constant; it drifts over time as a first-order Gauss-Markov process:
$$\dot{b}(t) = -\frac{1}{\tau_c} b(t) + w_b(t)$$
where $\tau_c = 300\text{ s}$ is the correlation time constant, and $w_b(t)$ is continuous white noise with spectral density $q_b = 2.0 \times 10^{-6}\text{ (m/s}^2)^2/\text{s}$.
1. Derive the continuous steady-state variance $\sigma_{b,\infty}^2$ of the bias.
2. Discretize the Gauss-Markov process for time step $\Delta t = 1.0\text{ s}$:
   $$b_k = \phi b_{k-1} + w_{b,k}$$
   Compute the discrete transition factor $\phi$ and discrete noise variance $Q_b$.

**Given Data:**
- $\tau_c = 300\text{ s}, q_b = 2.0 \times 10^{-6}, \Delta t = 1.0\text{ s}$.

**Step-by-Step Derivation:**
1. **Steady-State Continuous Variance:**
   The Lyapunov equation for the variance $\sigma_b^2(t)$ of $\dot{b} = -\frac{1}{\tau_c} b + w_b$ is:
   $$\frac{d \sigma_b^2}{dt} = -2 \frac{1}{\tau_c} \sigma_b^2 + q_b$$
   In steady state ($\frac{d \sigma_b^2}{dt} = 0$):
   $$-\frac{2}{\tau_c} \sigma_{b,\infty}^2 + q_b = 0 \implies \sigma_{b,\infty}^2 = \frac{q_b \tau_c}{2}$$
   Evaluating numerically:
   $$\sigma_{b,\infty}^2 = \frac{(2.0 \times 10^{-6})(300)}{2} = \frac{6.0 \times 10^{-4}}{2} = 3.0 \times 10^{-4}\text{ (m/s}^2)^2$$
   $$\sigma_{b,\infty} = \sqrt{3.0 \times 10^{-4}} \approx 0.01732\text{ m/s}^2 \approx 1.76\text{ mg}$$
2. **Discretization:**
   - Transition factor:
     $$\phi = e^{-\Delta t / \tau_c} = e^{-1.0 / 300} = e^{-0.0033333} \approx 1 - 0.0033333 = 0.996672$$
   - Discrete noise variance:
     $$Q_b = \sigma_{b,\infty}^2 (1 - \phi^2) = \sigma_{b,\infty}^2 (1 - e^{-2 \Delta t / \tau_c})$$
     Using linear approximation for $2 \Delta t / \tau_c \ll 1$:
     $$1 - e^{-2/300} \approx \frac{2}{300}$$
     $$Q_b \approx \left(\frac{q_b \tau_c}{2}\right) \left(\frac{2 \Delta t}{\tau_c}\right) = q_b \Delta t = (2.0 \times 10^{-6})(1.0) = 2.0 \times 10^{-6}\text{ (m/s}^2)^2$$
     Using exact exponential:
     $$1 - (0.996672)^2 = 1 - 0.993355 = 0.006645$$
     $$Q_b = (3.0 \times 10^{-4})(0.006645) \approx 1.9935 \times 10^{-6}\text{ (m/s}^2)^2$$

**Final Answer:**
- Steady-state variance: $\sigma_{b,\infty}^2 = 3.0 \times 10^{-4}\text{ m}^2/\text{s}^4$ ($\sigma_{b,\infty} \approx 0.0173\text{ m/s}^2$).
- Discrete transition factor: $\phi \approx 0.99667$.
- Discrete noise variance: $Q_b \approx 1.994 \times 10^{-6}\text{ m}^2/\text{s}^4$.

**Verification:**
As $\tau_c \to \infty$ (pure random walk), $\phi \to 1.0$ and $Q_b \to q_b \Delta t$. The Gauss-Markov model prevents the bias from drifting to infinity, bounded by physical thermal limits.

---

#### Problem 2.10: Optimal Measurement Sampling Rate vs Process Noise Growth
**Statement:**
A mobile robot tracks 1D position with process noise variance growing as $\sigma_p^2(t) = q_p t$ with $q_p = 0.1\text{ m}^2/\text{s}$.
An optical positioning beacon provides measurements with fixed accuracy variance $R = 0.05\text{ m}^2$.
To maintain position uncertainty strictly below $\sigma_{\max} = 0.2\text{ m}$ at all times ($\sigma_p^2 \le 0.04\text{ m}^2$), compute:
1. The maximum allowable time interval $\Delta t_{\max}$ between successive beacon measurements.
2. The minimum required beacon update frequency $f_{\min}$.

**Given Data:**
- $q_p = 0.1\text{ m}^2/\text{s}, R = 0.05\text{ m}^2$. Maximum allowable variance $P_{\max} = 0.04\text{ m}^2$.

**Step-by-Step Derivation:**
1. Assume the filter has converged to a cyclic steady-state where:
   - Immediately after an update: variance is $P_{\text{post}}$.
   - Immediately before the next update (after time $\Delta t$): variance is $P_{\text{prior}} = P_{\text{post}} + q_p \Delta t$.
2. The measurement update formula gives:
   $$\frac{1}{P_{\text{post}}} = \frac{1}{P_{\text{prior}}} + \frac{1}{R} \implies P_{\text{post}} = \frac{P_{\text{prior}} R}{P_{\text{prior}} + R}$$
3. The peak uncertainty occurs immediately before the measurement update:
   $$P_{\text{prior}} \le P_{\max} = 0.04\text{ m}^2$$
4. Evaluating $P_{\text{post}}$ when $P_{\text{prior}} = 0.04$:
   $$P_{\text{post}} = \frac{0.04 \times 0.05}{0.04 + 0.05} = \frac{0.0020}{0.09} = \frac{2}{90} = \frac{1}{45} \approx 0.02222\text{ m}^2$$
5. The allowable variance growth during the interval is:
   $$\Delta P = P_{\text{prior}} - P_{\text{post}} = 0.04000 - 0.02222 = 0.01778\text{ m}^2$$
6. Using the process noise growth $\Delta P = q_p \Delta t$:
   $$\Delta t_{\max} = \frac{\Delta P}{q_p} = \frac{0.017778}{0.1} \approx 0.17778\text{ s}$$
7. Minimum update frequency:
   $$f_{\min} = \frac{1}{\Delta t_{\max}} = \frac{1}{0.17778} \approx 5.625\text{ Hz}$$

**Final Answer:**
- Maximum sampling interval: $\Delta t_{\max} \approx 0.178\text{ s}$ ($178\text{ ms}$).
- Minimum beacon frequency: $f_{\min} \approx 5.63\text{ Hz}$ (or at least $6\text{ Hz}$).

**Verification:**
At $\Delta t = 0.17778\text{ s}$: $P_{\text{prior}} = 0.02222 + (0.1)(0.17778) = 0.02222 + 0.01778 = 0.04000\text{ m}^2$. $\sqrt{0.04} = 0.20\text{ m} = \sigma_{\max}$. Exact match.

---

### Section 2: Solved Exercises (Problems 2.11 – 2.20)

#### Problem 2.11: Temperature-Induced Bias Drift in Piezoresistive Accelerometers
**Statement:**
A missile's accelerometer has a temperature sensitivity coefficient $k_T = 0.005\text{ (m/s}^2)/^\circ\text{C}$.
During boost phase, aerodynamic heating causes the sensor temperature to rise linearly:
$$T(t) = T_0 + \alpha_T t$$
where $\alpha_T = 2.0^\circ\text{C/s}$.
1. Find the resulting time-varying acceleration bias $b_a(t)$.
2. Calculate the position error $e_p(t)$ accumulated after $t = 20\text{ s}$ of boost.

**Given Data:**
- $k_T = 0.005, \alpha_T = 2.0, t = 20\text{ s}$.

**Step-by-Step Derivation:**
1. **Time-Varying Bias:**
   $$b_a(t) = k_T (T(t) - T_0) = k_T \alpha_T t = (0.005)(2.0) t = 0.01 t\text{ m/s}^2$$
   The bias increases linearly at $0.01\text{ m/s}^2\text{ per second}$.
2. **Position Error Integration:**
   $$e_v(t) = \int_0^t b_a(\tau) d\tau = \int_0^t 0.01 \tau \, d\tau = \frac{0.01}{2} t^2 = 0.005 t^2\text{ m/s}$$
   $$e_p(t) = \int_0^t e_v(\tau) d\tau = \int_0^t 0.005 \tau^2 d\tau = \frac{0.005}{3} t^3\text{ m}$$
3. **Evaluation at $t = 20\text{ s}$:**
   $$e_p(20) = \frac{0.005}{3} (20)^3 = \frac{0.005 \times 8000}{3} = \frac{40.0}{3} \approx 13.333\text{ m}$$

**Final Answer:**
- $b_a(t) = 0.01 t\text{ m/s}^2$.
- Position error after $20\text{ s}$: $e_p \approx 13.33\text{ m}$.

**Verification:**
At $t=20\text{ s}$, average acceleration bias is $\bar{b} = 0.1\text{ m/s}^2$. Centroid of linear ramp is at $2/3$ duration, yielding exact $t^3/6$ coefficient.

---

#### Problem 2.12: Quantization Noise Modeling in Digital Encoders
**Statement:**
An optical shaft encoder has $N = 4096$ counts per revolution. The measurement quantization step is $\Delta \theta = \frac{2\pi}{N}\text{ rad}$.
1. Compute the numerical value of $\Delta \theta$ in milliradians.
2. Assuming uniform distribution over $[-\frac{\Delta\theta}{2}, \frac{\Delta\theta}{2}]$, compute the equivalent quantization noise variance $\sigma_q^2$ and standard deviation $\sigma_q$.
3. When using this encoder in a Kalman filter, explain why setting measurement covariance $R = \sigma_q^2$ is mathematically justified.

**Given Data:**
- $N = 4096$.

**Step-by-Step Derivation:**
1. **Quantization Step:**
   $$\Delta\theta = \frac{2\pi}{4096} = \frac{\pi}{2048} \approx 0.00153398\text{ rad} \approx 1.534\text{ mrad}$$
2. **Uniform Noise Variance:**
   For a continuous uniform random variable $e \sim \mathcal{U}(-a, a)$ with width $w = 2a = \Delta\theta$:
   $$\sigma_q^2 = \frac{w^2}{12} = \frac{(\Delta\theta)^2}{12}$$
   Evaluating numerically:
   $$\sigma_q^2 = \frac{(0.00153398)^2}{12} = \frac{2.3531 \times 10^{-6}}{12} \approx 1.9609 \times 10^{-7}\text{ rad}^2$$
   $$\sigma_q = \frac{\Delta\theta}{\sqrt{12}} = \frac{0.00153398}{3.4641} \approx 0.0004428\text{ rad} \approx 0.443\text{ mrad}$$
3. **Kalman Justification:**
   By the Central Limit Theorem, when high-rate encoder measurements are integrated across multiple time steps, the cumulative effect of independent uniform quantization errors converges rapidly to an equivalent Gaussian distribution with identical variance $R = \sigma_q^2$.

**Final Answer:**
- $\Delta\theta \approx 1.534\text{ mrad}$.
- $\sigma_q^2 \approx 1.961 \times 10^{-7}\text{ rad}^2$ ($\sigma_q \approx 0.443\text{ mrad}$).
- Justified by Central Limit Theorem and second-moment matching.

**Verification:**
Standard quantization noise theorem $\sigma^2 = \Delta^2 / 12$ holds for fine quantization where signal spans many quantization bins.

---

#### Problem 2.13: Wheel Encoder Scale Factor Calibration
**Statement:**
A mobile robot travels an independently surveyed calibration distance of $D_{\text{true}} = 100.000\text{ m}$. 
The left wheel encoder records $N_L = 318,310$ pulses, and the right wheel records $N_R = 321,493$ pulses. 
Both encoders have $C = 1000\text{ pulses/revolution}$.
1. Compute the effective wheel radii $r_L$ and $r_R$.
2. Compute the percentage difference $\Delta r / \bar{r}$.
3. Predict the lateral heading error accumulated per kilometer if this calibration error is neglected.

**Given Data:**
- $D = 100\text{ m}, C = 1000$. Wheel baseline $W = 0.6\text{ m}$.

**Step-by-Step Derivation:**
1. **Effective Radii:**
   Distance traveled: $D = 2\pi r \frac{N}{C} \implies r = \frac{D C}{2\pi N}$.
   $$r_L = \frac{100.0 \times 1000}{2\pi (318310)} = \frac{100000}{2000000.2} \approx 0.050000\text{ m} = 5.000\text{ cm}$$
   $$r_R = \frac{100.0 \times 1000}{2\pi (321493)} = \frac{100000}{2020000.8} \approx 0.049505\text{ m} = 4.9505\text{ cm}$$
2. **Percentage Difference:**
   $$\bar{r} = \frac{0.050000 + 0.049505}{2} = 0.0497525\text{ m}$$
   $$\Delta r = 0.050000 - 0.049505 = 0.000495\text{ m}$$
   $$\frac{\Delta r}{\bar{r}} = \frac{0.000495}{0.0497525} \times 100\% \approx 0.995\% \approx 1.0\%$$
3. **Heading Error per Kilometer:**
   Over $1000\text{ m}$, the left wheel indicates $1000\text{ m}$ while the right indicates $990.05\text{ m}$ ($\Delta s = 9.95\text{ m}$).
   $$\Delta\theta = \frac{\Delta s}{W} = \frac{9.95\text{ m}}{0.6\text{ m}} \approx 16.58\text{ rad} \approx 950^\circ \approx 2.64\text{ full rotations!}$$

**Final Answer:**
- $r_L \approx 5.000\text{ cm}, r_R \approx 4.951\text{ cm}$.
- Mismatch: $\approx 0.995\%$.
- Angular error: $\Delta\theta \approx 16.58\text{ rad}$ ($950^\circ$) per kilometer.

**Verification:**
Without calibration, the robot turns in circles rather than driving in a straight line, underscoring the severity of uncalibrated dead-reckoning.

---

#### Problem 2.14: Discrete Integration Error of High-G Shock
**Statement:**
A planetary lander experiences a sharp touchdown impact acceleration modeled as a triangular pulse of peak $a_{\max} = 100\text{ m/s}^2$ and duration $T_{\text{shock}} = 0.04\text{ s}$ ($40\text{ ms}$).
The onboard flight computer samples the accelerometer at discrete time step $\Delta t = 0.02\text{ s}$ ($50\text{ Hz}$) and integrates velocity via forward Euler:
$$v_{k+1} = v_k + a_k \Delta t$$
Depending on sampling phase, the computer samples at $t = 0, 0.02, 0.04\text{ s}$.
1. Compute the true change in velocity $\Delta v_{\text{true}} = \int_0^{T} a(t) dt$.
2. Compute the estimated velocity change $\Delta v_{\text{Euler}}$ if the sample catches the peak ($a(0.02) = 100$) versus if it misses the peak.
3. Compute the maximum integration error.

**Given Data:**
- Peak $a_{\max} = 100\text{ m/s}^2$, base duration $T = 0.04\text{ s}$.

**Step-by-Step Derivation:**
1. **True Velocity Change:**
   Area of triangular pulse:
   $$\Delta v_{\text{true}} = \frac{1}{2} \times \text{base} \times \text{height} = \frac{1}{2} (0.04) (100) = 2.00\text{ m/s}$$
2. **Forward Euler Integration:**
   - Case A (Sampling hits peak at $t = 0.02\text{ s}$):
     Samples are $a(0) = 0$, $a(0.02) = 100$, $a(0.04) = 0$.
     $$\Delta v = (a(0) + a(0.02)) \Delta t = (0 + 100)(0.02) = 2.00\text{ m/s}$$
     (Exact match by coincidence of symmetry).
   - Case B (Sampling phase offset by $0.01\text{ s}$):
     Samples at $t = 0.01\text{ s}$ ($a = 50$) and $t = 0.03\text{ s}$ ($a = 50$).
     $$\Delta v = (50 + 50)(0.02) = 2.00\text{ m/s}$$.
   - Case C (Coarse sampling $\Delta t = 0.03\text{ s}$ where pulse is undersampled):
     Samples at $0$ and $0.03$ ($a = 25$): $\Delta v = (25)(0.03) = 0.75\text{ m/s}$.
     Error = $2.00 - 0.75 = 1.25\text{ m/s}$ ($62.5\%$ error).

**Final Answer:**
- True velocity change: $\Delta v_{\text{true}} = 2.00\text{ m/s}$.
- Undersampling can produce errors exceeding $60\%$, emphasizing that IMU sampling rates must exceed shock bandwidth by at least $5\times$ to $10\times$ (typically $\ge 500\text{ Hz}$).

**Verification:**
Nyquist theorem requires sampling at $> 2\times$ the highest frequency content of the shock pulse to prevent aliasing.

---

#### Problem 2.15: Analytical Derivation of the Continuous-Time Velocity Random Walk (VRW)
**Statement:**
In inertial specifications, accelerometer noise is specified as Velocity Random Walk ($\text{VRW}$) in units of $\text{m/s}/\sqrt{\text{hour}}$.
Given a sensor with $\text{VRW} = 0.06\text{ m/s}/\sqrt{\text{hour}}$:
1. Convert $\text{VRW}$ to SI units ($\text{m/s}/\sqrt{\text{s}}$).
2. Compute the continuous white noise spectral density $S_a$.
3. Compute the standard deviation of velocity error accumulated after 1 hour of integration.

**Given Data:**
- $\text{VRW} = 0.06\text{ m/s}/\sqrt{\text{hour}}$. $1\text{ hour} = 3600\text{ s}$.

**Step-by-Step Derivation:**
1. **Unit Conversion:**
   $$\text{VRW}_{\text{SI}} = \frac{0.06\text{ m/s}}{\sqrt{3600\text{ s}}} = \frac{0.06}{60} = 0.0010\text{ m/s}/\sqrt{\text{s}} = 1.0 \times 10^{-3}\text{ m/s}^{1.5}$$
2. **Spectral Density $S_a$:**
   $$\sigma_v(t) = \text{VRW} \cdot \sqrt{t} = \sqrt{S_a t} \implies S_a = (\text{VRW}_{\text{SI}})^2 = (1.0 \times 10^{-3})^2 = 1.0 \times 10^{-6}\text{ m}^2/\text{s}^3$$
3. **Velocity Error After 1 Hour:**
   $$\sigma_v(3600) = \text{VRW} \cdot \sqrt{1\text{ hour}} = 0.06\text{ m/s}$$
   Alternatively:
   $$\sigma_v(3600) = (1.0 \times 10^{-3}) \sqrt{3600} = 1.0 \times 10^{-3} \times 60 = 0.06\text{ m/s}$$

**Final Answer:**
- $\text{VRW}_{\text{SI}} = 1.0 \times 10^{-3}\text{ m/s}/\sqrt{\text{s}}$.
- Spectral density: $S_a = 1.0 \times 10^{-6}\text{ m}^2/\text{s}^3$.
- 1-hour velocity uncertainty: $\sigma_v = 0.06\text{ m/s}$.

**Verification:**
Direct conversion: $0.06 / \sqrt{3600} = 10^{-3}$. Formulation is algebraically consistent.

---

#### Problem 2.16: Cross-Axis Sensitivity Matrix Modeling
**Statement:**
Due to mechanical non-orthogonality and packaging misalignment, a real 3-axis accelerometer measures specific force distorted by a non-orthogonality matrix $M$ and scale factor errors:
$$\hat{a} = (I + S + M) a_{\text{true}} + b_a + v$$
where:
$$S + M = \begin{bmatrix} 0.01 & 0.002 & -0.001 \\ 0.003 & -0.015 & 0.002 \\ -0.002 & 0.001 & 0.005 \end{bmatrix}$$
For a true acceleration $a_{\text{true}} = [0, 0, 9.81]^T\text{ m/s}^2$ (stationary on test bench under 1g gravity), compute the cross-axis false acceleration leaked into the horizontal $x$ and $y$ channels.

**Given Data:**
- $a_{\text{true}} = [0, 0, 9.81]^T$.

**Step-by-Step Derivation:**
1. Compute distortion vector $\Delta a = (S + M) a_{\text{true}}$:
   $$\Delta a = \begin{bmatrix} 0.01 & 0.002 & -0.001 \\ 0.003 & -0.015 & 0.002 \\ -0.002 & 0.001 & 0.005 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 9.81 \end{bmatrix} = \begin{bmatrix} -0.001 \times 9.81 \\ 0.002 \times 9.81 \\ 0.005 \times 9.81 \end{bmatrix} = \begin{bmatrix} -0.00981 \\ 0.01962 \\ 0.04905 \end{bmatrix}\text{ m/s}^2$$
2. The leaked horizontal accelerations are:
   $$\Delta a_x = -0.00981\text{ m/s}^2 \approx -1.0\text{ mg}$$
   $$\Delta a_y = +0.01962\text{ m/s}^2 \approx +2.0\text{ mg}$$

**Final Answer:**
- False x-acceleration: $-9.81\text{ mm/s}^2$.
- False y-acceleration: $+19.62\text{ mm/s}^2$.

**Verification:**
Even with zero actual horizontal motion, imperfect sensor alignment fools dead-reckoning into integrating a phantom horizontal velocity of nearly $2\text{ cm/s}$ per second.

---

#### Problem 2.17: Multi-Rate Sensor Fusion Timing and Buffer Synchronization
**Statement:**
A robot controller processes high-rate IMU telemetry at $f_{\text{IMU}} = 200\text{ Hz}$ ($\Delta t = 5\text{ ms}$) and visual odometry at $f_{\text{VO}} = 10\text{ Hz}$ ($\Delta t_{\text{VO}} = 100\text{ ms}$).
1. How many IMU propagation cycles occur between each visual odometry measurement?
2. If the visual odometry measurement requires $35\text{ ms}$ of computation, how many IMU ticks back in history does the visual measurement correspond to?
3. State the ring buffer capacity required to maintain $200\text{ ms}$ of IMU history for delayed state fusion.

**Given Data:**
- $f_{\text{IMU}} = 200\text{ Hz} \implies \Delta t = 5\text{ ms}$. $f_{\text{VO}} = 10\text{ Hz} \implies \Delta t_{\text{VO}} = 100\text{ ms}$.
- Latency = $35\text{ ms}$. Buffer depth target = $200\text{ ms}$.

**Step-by-Step Derivation:**
1. **IMU Steps per Visual Frame:**
   $$N_{\text{steps}} = \frac{f_{\text{IMU}}}{f_{\text{VO}}} = \frac{200}{10} = 20\text{ IMU integration steps}$$
2. **Historical Delay Steps:**
   $$\text{Delay ticks} = \frac{35\text{ ms}}{5\text{ ms}} = 7\text{ IMU ticks in the past}$$
3. **Ring Buffer Capacity:**
   $$\text{Capacity} = \frac{200\text{ ms}}{5\text{ ms}} = 40\text{ frames}$$

**Final Answer:**
- 20 IMU steps per visual frame.
- Measurement corresponds to 7 ticks in the past.
- Ring buffer capacity: At least 40 states.

**Verification:**
$40 \times 5\text{ ms} = 200\text{ ms}$, ensuring ample history to roll back state and re-propagate.

---

#### Problem 2.18: Earth Rotation Effect on Gyroscope Dead-Reckoning
**Statement:**
The Earth rotates at an angular rate of $\omega_{\text{Earth}} \approx 7.2921 \times 10^{-5}\text{ rad/s}$ ($15.04^\circ/\text{hour}$).
A stationary high-precision optical gyro located at latitude $\phi = 45^\circ\text{ N}$ has zero sensor bias.
If the navigation computer fails to subtract the Earth rotation rate from the vertical gyro measurement:
1. Compute the vertical component of Earth rate measured by the gyro: $\omega_z = \omega_{\text{Earth}} \sin\phi$.
2. Compute the resulting heading error accumulated over 1 hour ($3600\text{ s}$).

**Given Data:**
- $\omega_{\text{Earth}} = 7.2921 \times 10^{-5}\text{ rad/s}$, $\phi = 45^\circ$.

**Step-by-Step Derivation:**
1. **Vertical Component:**
   $$\omega_z = \omega_{\text{Earth}} \sin(45^\circ) = (7.2921 \times 10^{-5})\left(\frac{\sqrt{2}}{2}\right) \approx 5.1563 \times 10^{-5}\text{ rad/s}$$
2. **Heading Error After 1 Hour:**
   $$\Delta\psi = \omega_z \times 3600\text{ s} = (5.1563 \times 10^{-5}) \times 3600 \approx 0.18563\text{ rad} \approx 10.635^\circ$$

**Final Answer:**
- Measured rate: $\omega_z \approx 5.156 \times 10^{-5}\text{ rad/s}$.
- Heading error after 1 hour: $\Delta\psi \approx 10.64^\circ$.

**Verification:**
$15.04^\circ/\text{hour} \times \sin(45^\circ) = 15.04 \times 0.7071 = 10.635^\circ/\text{hour}$. Exact match.

---

#### Problem 2.19: The Zero-Velocity Update (ZUPT) Mechanism
**Statement:**
A walking humanoid robot has foot contact sensors that detect when the stance foot is firmly planted on the ground ($v_{\text{true}} = 0$).
During stance phase, the IMU onboard the foot continues to integrate small noise and drift.
Explain mathematically how treating $z_{\text{ZUPT}} = 0\text{ m/s}$ with small covariance $R_{\text{ZUPT}} = 10^{-6}\text{ m}^2/\text{s}^2$ inside a Kalman filter resets velocity error and estimates accelerometer bias.

**Given Data:**
- Stance condition: $v = 0$. Measurement model: $z = v + \eta, R = 10^{-6}$.

**Step-by-Step Derivation:**
1. **Measurement Innovation:**
   The filter predicts foot velocity $\hat{v}_{k|k-1}$ from IMU integration.
   When stance is detected, observation $z = 0$:
   $$y = z - \hat{v}_{k|k-1} = -\hat{v}_{k|k-1}$$
2. **Velocity Reset:**
   Because $R \approx 0$, the Kalman gain for velocity is near unity ($K_v \approx 1$):
   $$\hat{v}_{k|k} = \hat{v}_{k|k-1} + K_v (-\hat{v}_{k|k-1}) \approx 0$$
   Velocity error is reset to zero on every footstep.
3. **Bias Observability:**
   In the error-state Kalman filter, velocity error $\delta v$ is coupled to accelerometer bias error $\delta b_a$ via $\delta \dot{v} = \delta b_a$.
   Because velocity error is driven to zero while the drift rate is known, the cross-covariance term $P_{v, b_a}$ enables the filter to observe and calibrate the accelerometer bias $b_a$ during every single stance phase!

**Final Answer:**
- ZUPT transforms an open-loop unbounded $t^3$ drift into a bounded error that resets to zero on every walking step ($\approx 1\text{ Hz}$).

**Verification:**
Standard pedestrian navigation systems (e.g. shoe-mounted IMUs) achieve $< 0.5\%$ distance error solely through ZUPT corrections.

---

#### Problem 2.20: Synthesis of the Sensor Fusion Paradigm
**Statement:**
Formulate the master trade-off equation demonstrating why combining a drifting high-rate process model with a noisy low-rate observation produces a strictly bounded steady-state estimation covariance.

**Given Data:**
- Discrete process noise variance $\Delta P_{\text{proc}} = q \Delta t$.
- Measurement noise variance $R$.

**Step-by-Step Derivation:**
1. Across interval $\Delta t$, state uncertainty expands:
   $$P_{\text{prior}} = P + q \Delta t$$
2. Measurement update contracts uncertainty:
   $$P_{\text{post}} = \left( P_{\text{prior}}^{-1} + R^{-1} \right)^{-1} = \frac{(P + q \Delta t) R}{P + q \Delta t + R}$$
3. In steady state ($P_{\text{post}} = P$):
   $$P (P + q \Delta t + R) = (P + q \Delta t) R$$
   $$P^2 + P q \Delta t + P R = P R + q R \Delta t$$
   $$P^2 + (q \Delta t) P - q R \Delta t = 0$$
4. Solving the positive root of the quadratic equation:
   $$P_\infty = -\frac{q \Delta t}{2} + \sqrt{\left(\frac{q \Delta t}{2}\right)^2 + q R \Delta t}$$
5. As $t \to \infty$, $P_\infty$ remains strictly finite and constant:
   $$\lim_{t \to \infty} P(t) = P_\infty < \infty$$

**Final Answer:**
- Steady-state variance is unconditionally bounded: $P_\infty = -\frac{q \Delta t}{2} + \sqrt{\frac{q^2 \Delta t^2}{4} + q R \Delta t}$.
- Concludes the philosophical imperative: sensory observation permanently halts the unbounded divergence of dead-reckoning entropy.

**Verification:**
If $R \to \infty$ (no measurements), $P_\infty \to \infty$ (unbounded drift). If $R \to 0$ (perfect sensor), $P_\infty \to 0$. The formula perfectly captures the physical extremes.
