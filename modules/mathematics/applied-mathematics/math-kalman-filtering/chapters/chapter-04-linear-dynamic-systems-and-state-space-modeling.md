# Chapter 4: Linear Dynamic Systems and State-Space Modeling

## 4.1 Introduction: Continuous Physical Reality and Discrete Computation

Physical robots exist in a continuous temporal continuum governed by differential equations of Newtonian mechanics, electrodynamics, and fluid dynamics. However, the microprocessors and digital signal processors that compute state estimates operate in discrete time, triggered by periodic timer interrupts at rates such as $50\text{ Hz}$, $200\text{ Hz}$, or $1\text{ kHz}$.

Bridging the continuous-time physics of the robot:
$$\dot{x}(t) = A x(t) + B u(t) + G w_c(t)$$
and the discrete-time estimation recursion:
$$x_k = F x_{k-1} + B_d u_{k-1} + w_k$$
requires mathematically rigorous discretization. A naive forward Euler approximation ($\dot{x} \approx \frac{x_{k} - x_{k-1}}{\Delta t}$) introduces severe truncation errors, distorts system poles, and critically fails to capture the true covariance structure of process noise.

In this chapter, we develop the exact state-space formulation of continuous linear time-invariant (LTI) systems, derive the analytical matrix exponential for state transition, establish the continuous-to-discrete noise covariance integral, master Charles Van Loan’s unified block matrix exponential method, and formalize standard robotic motion models: Constant Velocity (CV), Constant Acceleration (CA), and the Singer Gauss-Markov acceleration model.

---

## 4.2 Continuous-Time State-Space Representation

A continuous-time linear time-invariant (LTI) dynamic system driven by deterministic control inputs and stochastic process noise is defined on $t \in [0, \infty)$ by:

$$\dot{x}(t) = A x(t) + B u(t) + G w_c(t)$$
$$z(t) = C x(t) + D u(t) + v_c(t)$$

where:
- $x(t) \in \mathbb{R}^n$ is the state vector.
- $u(t) \in \mathbb{R}^p$ is the known deterministic control input vector.
- $w_c(t) \in \mathbb{R}^q$ is zero-mean continuous white process noise with power spectral density matrix $Q_c \in \mathbb{S}_+^q$:
  $$\mathbb{E}[w_c(t)] = 0, \quad \mathbb{E}[w_c(t) w_c^T(\tau)] = Q_c \delta(t - \tau)$$
  where $\delta(t - \tau)$ is the Dirac delta function.
- $A \in \mathbb{R}^{n \times n}$ is the system dynamics matrix.
- $B \in \mathbb{R}^{n \times p}$ is the control input gain matrix.
- $G \in \mathbb{R}^{n \times q}$ is the noise input coupling matrix.
- $z(t) \in \mathbb{R}^m$ is the observation vector with continuous measurement noise $v_c(t)$.

### 4.2.1 The General Solution via Integrating Factors
To solve the linear vector differential equation over the sampling interval $[t_{k-1}, t_k]$ where $\Delta t = t_k - t_{k-1}$, we pre-multiply both sides by the matrix integrating factor $e^{-At}$:

$$e^{-At} \dot{x}(t) - e^{-At} A x(t) = e^{-At} B u(t) + e^{-At} G w_c(t)$$

Recognizing the left-hand side as the total time derivative $\frac{d}{dt}\left(e^{-At} x(t)\right)$:

$$\frac{d}{dt}\left(e^{-At} x(t)\right) = e^{-At} B u(t) + e^{-At} G w_c(t)$$

Integrating both sides from $t_{k-1}$ to $t_k$:

$$e^{-A t_k} x(t_k) - e^{-A t_{k-1}} x(t_{k-1}) = \int_{t_{k-1}}^{t_k} e^{-A \tau} B u(\tau) d\tau + \int_{t_{k-1}}^{t_k} e^{-A \tau} G w_c(\tau) d\tau$$

Multiplying through by $e^{A t_k}$ and setting $\tau' = t_k - \tau$:

$$x(t_k) = e^{A(t_k - t_{k-1})} x(t_{k-1}) + \int_{t_{k-1}}^{t_k} e^{A(t_k - \tau)} B u(\tau) d\tau + \int_{t_{k-1}}^{t_k} e^{A(t_k - \tau)} G w_c(\tau) d\tau$$

Under the standard Zero-Order Hold (ZOH) assumption, the control input $u(t)$ is held constant across the interval: $u(t) = u_{k-1}$ for $t \in [t_{k-1}, t_k)$. Substituting $\Delta t = t_k - t_{k-1}$ and $\lambda = t_k - \tau$:

$$x_k = F x_{k-1} + B_d u_{k-1} + w_k$$

where the discrete system matrices are defined by:
$$F = e^{A \Delta t}$$
$$B_d = \int_0^{\Delta t} e^{A \lambda} d\lambda \, B$$
$$w_k = \int_0^{\Delta t} e^{A(\Delta t - \tau)} G w_c(t_{k-1} + \tau) d\tau$$

---

## 4.3 The Discrete Process Noise Covariance $Q_k$

The discrete process disturbance vector $w_k$ is a linear functional of Gaussian white noise; hence, $w_k$ is a zero-mean discrete Gaussian random vector: $w_k \sim \mathcal{N}(0, Q_k)$.

### 4.3.1 Derivation of the Covariance Integral
The covariance matrix $Q_k = \mathbb{E}[w_k w_k^T]$ is computed by taking the expectation of the outer product of the integral:

$$Q_k = \mathbb{E}\left[ \left(\int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G w_c(t_{k-1} + \tau_1) d\tau_1\right) \left(\int_0^{\Delta t} e^{A(\Delta t - \tau_2)} G w_c(t_{k-1} + \tau_2) d\tau_2\right)^T \right]$$

Applying the transpose to the second integrand and pulling the deterministic matrices outside the expectation:

$$Q_k = \int_0^{\Delta t} \int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G \, \mathbb{E}[w_c(t_{k-1} + \tau_1) w_c^T(t_{k-1} + \tau_2)] \, G^T e^{A^T(\Delta t - \tau_2)} d\tau_1 d\tau_2$$

Using the white noise autocorrelation property $\mathbb{E}[w_c(t_1) w_c^T(t_2)] = Q_c \delta(\tau_1 - \tau_2)$:

$$Q_k = \int_0^{\Delta t} \int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G Q_c \delta(\tau_1 - \tau_2) G^T e^{A^T(\Delta t - \tau_2)} d\tau_1 d\tau_2$$

Evaluating the inner integral with respect to $\tau_2$ collapses the Dirac delta at $\tau_2 = \tau_1$:

$$Q_k = \int_0^{\Delta t} e^{A(\Delta t - \tau_1)} G Q_c G^T e^{A^T(\Delta t - \tau_1)} d\tau_1$$

Substituting the dummy variable of integration $\tau = \Delta t - \tau_1$ (with $d\tau = -d\tau_1$, changing limits from $[0, \Delta t]$ to $[\Delta t, 0]$):

$$Q_k = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$$

This fundamental integral dictates the exact discrete covariance. Notice that even if the continuous noise enters only a subset of state derivatives (e.g. acceleration disturbance in a position-velocity model where $G = [0, 1]^T$), the matrix exponential $e^{A \tau}$ cross-couples the noise into velocity and position, generating non-zero off-diagonal covariance entries.

---

## 4.4 Analytical Discretization of Standard Kinematic Models

### 4.4.1 Constant Velocity (CV) Kinematic Model (1D)
In tracking and navigation, the 1D Constant Velocity model assumes position $p(t)$ and velocity $v(t) = \dot{p}(t)$, with unknown acceleration treated as zero-mean continuous white noise $w_c(t) \sim \mathcal{N}(0, \tilde{q})$:

$$\begin{bmatrix} \dot{p}(t) \\ \dot{v}(t) \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} p(t) \\ v(t) \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} w_c(t)$$

Here, $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, $G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$, and $Q_c = \tilde{q}$ (acceleration spectral density, in $\text{m}^2/\text{s}^3$).

#### State Transition Matrix $F$:
Since $A^2 = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$, the matrix exponential series terminates after two terms:
$$F = e^{A \Delta t} = I + A \Delta t = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix}$$

#### Process Noise Covariance $Q_k$:
Evaluating $e^{A \tau} G$:
$$e^{A \tau} G = \begin{bmatrix} 1 & \tau \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \tau \\ 1 \end{bmatrix}$$

The integrand is:
$$e^{A \tau} G Q_c G^T e^{A^T \tau} = \tilde{q} \begin{bmatrix} \tau \\ 1 \end{bmatrix} \begin{bmatrix} \tau & 1 \end{bmatrix} = \tilde{q} \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix}$$

Integrating element by element from $0$ to $\Delta t$:
$$Q_k = \tilde{q} \int_0^{\Delta t} \begin{bmatrix} \tau^2 & \tau \\ \tau & 1 \end{bmatrix} d\tau = \tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$

This is the famous Continuous White Noise Acceleration (CWNA) covariance matrix. Notice the correlation coefficient:
$$\rho_{pv} = \frac{Q_{12}}{\sqrt{Q_{11} Q_{22}}} = \frac{\frac{1}{2} \Delta t^2}{\sqrt{\frac{1}{3} \Delta t^3 \cdot \Delta t}} = \frac{1/2}{\sqrt{1/3}} = \frac{\sqrt{3}}{2} \approx 0.8660$$
Position and velocity perturbations are positively correlated with a fixed correlation coefficient of $86.6\%$, regardless of the sampling interval $\Delta t$ or noise intensity $\tilde{q}$.

### 4.4.2 Piecewise Constant White Acceleration (Discrete Approximation)
An alternative heuristic often found in early literature assumes acceleration is constant over the sample interval $[t_{k-1}, t_k)$ with variance $\sigma_a^2$: $a_k \sim \mathcal{N}(0, \sigma_a^2)$. Under constant acceleration:
$$\Delta p = \frac{1}{2} a_k \Delta t^2, \quad \Delta v = a_k \Delta t$$
The noise vector is $w_k = \begin{bmatrix} \frac{1}{2} \Delta t^2 \\ \Delta t \end{bmatrix} a_k$.
Its covariance is:
$$Q_{\text{discrete}} = \mathbb{E}[w_k w_k^T] = \sigma_a^2 \begin{bmatrix} \frac{\Delta t^4}{4} & \frac{\Delta t^3}{2} \\ \frac{\Delta t^3}{2} & \Delta t^2 \end{bmatrix}$$
Here, the rank of $Q_{\text{discrete}}$ is strictly $1$ ($\det(Q) = \sigma_a^4 (\frac{\Delta t^6}{4} - \frac{\Delta t^6}{4}) = 0$). In contrast, the continuous-time integrated $Q_k$ derived in Section 4.4.1 has rank $2$ ($\det(Q_k) = \tilde{q}^2 (\frac{\Delta t^4}{3} - \frac{\Delta t^4}{4}) = \frac{\tilde{q}^2 \Delta t^4}{12} > 0$). Rank deficiency in $Q$ can cause numerical divergence and singularity in RTS smoothers. The continuous integration approach is mathematically superior and strictly preferred.

---

## 4.5 Constant Acceleration (CA) Kinematic Model (1D)

When tracking agile targets or maneuvering vehicles, acceleration cannot be modeled as white noise. The Constant Acceleration (CA) model augments the state with acceleration $a(t)$:
$$x(t) = \begin{bmatrix} p(t) \\ v(t) \\ a(t) \end{bmatrix}, \quad \dot{x}(t) = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix} x(t) + \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} w_j(t)$$
where $w_j(t) \sim \mathcal{N}(0, \tilde{q}_j)$ is continuous jerk white noise ($\text{m}^2/\text{s}^5$).

### 4.5.1 State Transition Matrix $F$:
Since $A^2 = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$ and $A^3 = 0$:
$$F = I + A \Delta t + \frac{1}{2} A^2 \Delta t^2 = \begin{bmatrix} 1 & \Delta t & \frac{1}{2} \Delta t^2 \\ 0 & 1 & \Delta t \\ 0 & 0 & 1 \end{bmatrix}$$

### 4.5.2 Process Covariance Matrix $Q_k$:
Evaluating $e^{A \tau} G$:
$$e^{A \tau} G = \begin{bmatrix} 1 & \tau & \frac{1}{2} \tau^2 \\ 0 & 1 & \tau \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \frac{1}{2} \tau^2 \\ \tau \\ 1 \end{bmatrix}$$

The outer product is:
$$e^{A \tau} G Q_c G^T e^{A^T \tau} = \tilde{q}_j \begin{bmatrix} \frac{1}{4} \tau^4 & \frac{1}{2} \tau^3 & \frac{1}{2} \tau^2 \\ \frac{1}{2} \tau^3 & \tau^2 & \tau \\ \frac{1}{2} \tau^2 & \tau & 1 \end{bmatrix}$$

Integrating each element from $0$ to $\Delta t$:
$$Q_k = \tilde{q}_j \begin{bmatrix} \frac{\Delta t^5}{20} & \frac{\Delta t^4}{8} & \frac{\Delta t^3}{6} \\ \frac{\Delta t^4}{8} & \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^3}{6} & \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$

$\det(Q_k) = \frac{\tilde{q}_j^3 \Delta t^9}{720} > 0$. The covariance is strictly positive-definite ($\mathbb{S}_{++}^3$).

---

## 4.6 The Singer Acceleration Model (Gauss-Markov Process)

In real physical targets (such as aircraft, ground robots, or evasive missiles), acceleration is neither white noise nor purely constant. An accelerating vehicle maintains a maneuver for an characteristic correlation time $\tau_m = 1/\alpha$ before returning to zero or changing direction.

Robert A. Singer (1970) modeled acceleration as a zero-mean stationary first-order Gauss-Markov process:
$$\dot{a}(t) = -\alpha a(t) + w_s(t)$$
where $\alpha = 1/\tau_m$ is the maneuver decay rate, and $w_s(t)$ has spectral density $Q_c = 2 \alpha \sigma_m^2$, ensuring that the steady-state variance of acceleration equals $\sigma_m^2$.

The full continuous state equation is:
$$\begin{bmatrix} \dot{p} \\ \dot{v} \\ \dot{a} \end{bmatrix} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & -\alpha \end{bmatrix} \begin{bmatrix} p \\ v \\ a \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} w_s(t)$$

The state transition matrix is:
$$F = e^{A \Delta t} = \begin{bmatrix} 1 & \Delta t & \frac{e^{-\alpha \Delta t} - 1 + \alpha \Delta t}{\alpha^2} \\ 0 & 1 & \frac{1 - e^{-\alpha \Delta t}}{\alpha} \\ 0 & 0 & e^{-\alpha \Delta t} \end{bmatrix}$$

Notice the asymptotic behavior:
- As $\alpha \to 0$ ($\tau_m \to \infty$, non-decaying acceleration), $F \to \begin{bmatrix} 1 & \Delta t & \frac{1}{2}\Delta t^2 \\ 0 & 1 & \Delta t \\ 0 & 0 & 1 \end{bmatrix}$, exactly recovering the Constant Acceleration model.
- As $\alpha \to \infty$ ($\tau_m \to 0$, instantaneous white acceleration), $a(t)$ decorrelates instantaneously, recovering the Constant Velocity model.

---

## 4.7 Van Loan's Method: Universal Numerical Discretization

When the system matrix $A$ is large, non-nilpotent, or contains complex cross-coupling (e.g. Coriolis terms or flexible modes), closed-form analytical integration of $Q_k = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau$ is algebraically prohibitive.

In 1978, Charles F. Van Loan published a groundbreaking theorem showing that both $F$ and $Q_k$ can be computed simultaneously by taking a single matrix exponential of a $2n \times 2n$ block matrix.

### 4.7.1 Van Loan Theorem
Construct the block matrix $\mathcal{M} \in \mathbb{R}^{2n \times 2n}$:
$$\mathcal{M} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix}$$

Compute the matrix exponential of $\mathcal{M} \Delta t$:
$$\mathcal{E} = \exp(\mathcal{M} \Delta t) = \begin{bmatrix} \Phi_{11} & \Phi_{12} \\ 0 & \Phi_{22} \end{bmatrix}$$

Then:
$$\Phi_{22} = F^T = (e^{A \Delta t})^T \implies F = \Phi_{22}^T$$
$$\Phi_{12} = F^{-1} Q_k \implies Q_k = F \, \Phi_{12} = \Phi_{22}^T \Phi_{12}$$

### 4.7.2 Proof of Van Loan's Theorem
Consider the linear matrix differential equation:
$$\frac{d}{dt} \begin{bmatrix} \Phi_{11}(t) & \Phi_{12}(t) \\ 0 & \Phi_{22}(t) \end{bmatrix} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix} \begin{bmatrix} \Phi_{11}(t) & \Phi_{12}(t) \\ 0 & \Phi_{22}(t) \end{bmatrix}$$
with initial condition $\mathcal{E}(0) = I_{2n}$.

From the bottom-right block:
$$\dot{\Phi}_{22}(t) = A^T \Phi_{22}(t), \quad \Phi_{22}(0) = I \implies \Phi_{22}(t) = e^{A^T t} = (e^{At})^T$$
At $t = \Delta t$, $\Phi_{22}(\Delta t) = F^T$.

From the top-right block:
$$\dot{\Phi}_{12}(t) = -A \Phi_{12}(t) + G Q_c G^T \Phi_{22}(t) = -A \Phi_{12}(t) + G Q_c G^T e^{A^T t}$$
Applying the integrating factor $e^{At}$:
$$\frac{d}{dt}\left(e^{At} \Phi_{12}(t)\right) = e^{At} G Q_c G^T e^{A^T t}$$
Integrating from $0$ to $\Delta t$ with $\Phi_{12}(0) = 0$:
$$e^{A \Delta t} \Phi_{12}(\Delta t) = \int_0^{\Delta t} e^{A \tau} G Q_c G^T e^{A^T \tau} d\tau = Q_k$$
Pre-multiplying by $\Phi_{22}^T = e^{A \Delta t} = F$:
$$Q_k = F \, \Phi_{12}(\Delta t)$$
Since $\Phi_{12} = F^{-1} Q_k$, and $Q_k$ is symmetric, we can enforce symmetry numerically via $Q_k \leftarrow \frac{1}{2}(F \Phi_{12} + (F \Phi_{12})^T)$. $\blacksquare$

---

## 4.8 Mathematical Problem Set

### Problem 4.1 (Worked Example): Derivation of 1D Constant Velocity CWNA Matrices
**Problem Statement:** A 1D robotic rover follows continuous dynamics $\dot{p} = v, \dot{v} = w_c(t)$, where $w_c(t)$ has spectral density $\tilde{q} = 0.36\text{ m}^2/\text{s}^3$. For a sampling interval $\Delta t = 0.1\text{ s}$, compute the numerical values of the state transition matrix $F$ and the discrete process covariance matrix $Q_k$. Compute the standard deviations of position and velocity uncertainty introduced over one step.

**Given Data:**
- State: $x = [p, v]^T$
- Continuous matrices: $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, $G = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$
- $\tilde{q} = 0.36\text{ m}^2/\text{s}^3$, $\Delta t = 0.1\text{ s}$.

**Step-by-Step Derivation:**
1. State transition matrix:
   $$F = \begin{bmatrix} 1 & \Delta t \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1.0 & 0.1 \\ 0.0 & 1.0 \end{bmatrix}$$
2. Covariance matrix formula:
   $$Q_k = \tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
3. Computing components:
   $$\frac{\Delta t^3}{3} = \frac{0.001}{3} \approx 3.3333 \times 10^{-4}\text{ s}^3$$
   $$\frac{\Delta t^2}{2} = \frac{0.01}{2} = 5.0 \times 10^{-3}\text{ s}^2$$
   $$\Delta t = 0.1\text{ s}$$
4. Multiplying by $\tilde{q} = 0.36$:
   $$Q_{11} = 0.36 \times \frac{0.001}{3} = 1.2 \times 10^{-4}\text{ m}^2$$
   $$Q_{12} = Q_{21} = 0.36 \times 0.005 = 1.8 \times 10^{-3}\text{ m}^2/\text{s}$$
   $$Q_{22} = 0.36 \times 0.1 = 3.6 \times 10^{-2}\text{ m}^2/\text{s}^2$$
5. Standard deviations:
   $$\sigma_p = \sqrt{Q_{11}} = \sqrt{1.2 \times 10^{-4}} \approx 0.01095\text{ m} \approx 1.10\text{ cm}$$
   $$\sigma_v = \sqrt{Q_{22}} = \sqrt{0.036} \approx 0.1897\text{ m/s}$$

**Final Result:**
$$F = \begin{bmatrix} 1.0 & 0.1 \\ 0.0 & 1.0 \end{bmatrix}, \quad Q_k = \begin{bmatrix} 1.2 \times 10^{-4} & 1.8 \times 10^{-3} \\ 1.8 \times 10^{-3} & 3.6 \times 10^{-2} \end{bmatrix}$$
$$\sigma_p = 1.095\text{ cm}, \quad \sigma_v = 0.1897\text{ m/s}$$

---

### Problem 4.2 (Worked Example): Determinant and Condition Number of CWNA Covariance
**Problem Statement:** Prove that the determinant of the 2D CWNA covariance matrix $Q_k$ is strictly positive for any $\Delta t > 0, \tilde{q} > 0$. Compute the condition number $\kappa(Q_k)$ as a function of $\Delta t$ and evaluate it for $\Delta t = 0.01\text{ s}$.

**Step-by-Step Derivation:**
1. Determinant formula:
   $$\det(Q_k) = \det\left(\tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}\right) = \tilde{q}^2 \left( \frac{\Delta t^4}{3} - \frac{\Delta t^4}{4} \right) = \frac{\tilde{q}^2 \Delta t^4}{12}$$
   Since $\tilde{q} > 0$ and $\Delta t > 0$, $\det(Q_k) = \frac{\tilde{q}^2 \Delta t^4}{12} > 0$ strictly.
2. Eigenvalues of $Q_k$:
   $$\operatorname{tr}(Q_k) = \tilde{q} \Delta t \left(1 + \frac{\Delta t^2}{3}\right)$$
   For small $\Delta t \ll 1$, $\Delta t^2/3 \ll 1$, so $\operatorname{tr}(Q_k) \approx \tilde{q} \Delta t$.
   Since $\lambda_1 \lambda_2 = \det(Q_k)$ and $\lambda_1 + \lambda_2 = \operatorname{tr}(Q_k)$:
   $$\lambda_{\max} \approx \operatorname{tr}(Q_k) \approx \tilde{q} \Delta t$$
   $$\lambda_{\min} = \frac{\det(Q_k)}{\lambda_{\max}} \approx \frac{\tilde{q}^2 \Delta t^4 / 12}{\tilde{q} \Delta t} = \frac{\tilde{q} \Delta t^3}{12}$$
3. Condition number:
   $$\kappa(Q_k) = \frac{\lambda_{\max}}{\lambda_{\min}} \approx \frac{\tilde{q} \Delta t}{\frac{1}{12} \tilde{q} \Delta t^3} = \frac{12}{\Delta t^2}$$
4. For $\Delta t = 0.01\text{ s}$:
   $$\kappa(Q_k) \approx \frac{12}{(0.01)^2} = \frac{12}{10^{-4}} = 1.2 \times 10^5$$

**Final Result:**
$$\det(Q_k) = \frac{\tilde{q}^2 \Delta t^4}{12} > 0, \quad \kappa(Q_k) \approx \frac{12}{\Delta t^2} = 1.2 \times 10^5\text{ at }\Delta t = 0.01\text{ s}$$
*Physical Insight:* As sampling rate increases ($\Delta t \to 0$), the covariance matrix becomes extremely ill-conditioned ($\kappa \propto \Delta t^{-2}$), necessitating double precision arithmetic and Cholesky decomposition.

---

### Problem 4.3 (Worked Example): Deterministic Control Input Discretization $B_d$
**Problem Statement:** An electric robotic rail cart has state $x = [p, v]^T$ and motor input $u(t)$ generating force per unit mass (acceleration):
$$\dot{p} = v, \quad \dot{v} = -\gamma v + b_0 u(t)$$
where $\gamma = 0.5\text{ s}^{-1}$ is viscous friction and $b_0 = 2.0\text{ m}/(\text{s}^2 \cdot \text{V})$. Compute the continuous dynamics matrix $A$ and control matrix $B$. Derive the exact discrete matrices $F = e^{A \Delta t}$ and $B_d = \int_0^{\Delta t} e^{A \tau} d\tau B$ for $\Delta t = 0.2\text{ s}$.

**Step-by-Step Derivation:**
1. Continuous matrices:
   $$A = \begin{bmatrix} 0 & 1 \\ 0 & -\gamma \end{bmatrix}, \quad B = \begin{bmatrix} 0 \\ b_0 \end{bmatrix}$$
2. State transition matrix $F$:
   Eigenvalues of $A$ are $\lambda_1 = 0, \lambda_2 = -\gamma$.
   Using inverse Laplace transform $\mathcal{L}^{-1}\{(sI - A)^{-1}\}$:
   $$(sI - A)^{-1} = \begin{bmatrix} s & -1 \\ 0 & s + \gamma \end{bmatrix}^{-1} = \frac{1}{s(s+\gamma)} \begin{bmatrix} s+\gamma & 1 \\ 0 & s \end{bmatrix} = \begin{bmatrix} \frac{1}{s} & \frac{1}{s(s+\gamma)} \\ 0 & \frac{1}{s+\gamma} \end{bmatrix}$$
   Partial fraction expansion: $\frac{1}{s(s+\gamma)} = \frac{1}{\gamma}\left(\frac{1}{s} - \frac{1}{s+\gamma}\right)$.
   Taking inverse Laplace transform:
   $$e^{At} = \begin{bmatrix} 1 & \frac{1 - e^{-\gamma t}}{\gamma} \\ 0 & e^{-\gamma t} \end{bmatrix}$$
   At $\Delta t = 0.2, \gamma = 0.5$: $\gamma \Delta t = 0.1$.
   $$e^{-0.1} \approx 0.904837$$
   $$\frac{1 - e^{-0.1}}{0.5} = \frac{0.095163}{0.5} = 0.190325\text{ s}$$
   $$F = \begin{bmatrix} 1.0 & 0.190325 \\ 0.0 & 0.904837 \end{bmatrix}$$
3. Discrete input matrix $B_d$:
   $$B_d = \int_0^{\Delta t} \begin{bmatrix} 1 & \frac{1 - e^{-\gamma \tau}}{\gamma} \\ 0 & e^{-\gamma \tau} \end{bmatrix} \begin{bmatrix} 0 \\ b_0 \end{bmatrix} d\tau = b_0 \int_0^{\Delta t} \begin{bmatrix} \frac{1 - e^{-\gamma \tau}}{\gamma} \\ e^{-\gamma \tau} \end{bmatrix} d\tau$$
   Top entry:
   $$\int_0^{\Delta t} \frac{1 - e^{-\gamma \tau}}{\gamma} d\tau = \frac{1}{\gamma}\left[\tau + \frac{e^{-\gamma \tau}}{\gamma}\right]_0^{\Delta t} = \frac{1}{\gamma}\left(\Delta t + \frac{e^{-\gamma \Delta t} - 1}{\gamma}\right) = \frac{\Delta t}{\gamma} - \frac{1 - e^{-\gamma \Delta t}}{\gamma^2}$$
   Evaluating numerically:
   $$\frac{0.2}{0.5} - \frac{0.095163}{0.25} = 0.4 - 0.380652 = 0.019348$$
   Bottom entry:
   $$\int_0^{\Delta t} e^{-\gamma \tau} d\tau = \frac{1 - e^{-\gamma \Delta t}}{\gamma} = \frac{0.095163}{0.5} = 0.190325$$
   Multiplying by $b_0 = 2.0$:
   $$B_d = \begin{bmatrix} 2.0 \times 0.019348 \\ 2.0 \times 0.190325 \end{bmatrix} = \begin{bmatrix} 0.038696 \\ 0.380650 \end{bmatrix}$$

**Final Result:**
$$F = \begin{bmatrix} 1.0 & 0.190325 \\ 0.0 & 0.904837 \end{bmatrix}, \quad B_d = \begin{bmatrix} 0.03870 \\ 0.38065 \end{bmatrix}$$

---

### Problem 4.4 (Worked Example): Van Loan Matrix Exponential Verification
**Problem Statement:** Consider a scalar damped velocity state $\dot{v} = -a v + w_c(t)$ with $a = 2.0\text{ s}^{-1}$, $w_c(t)$ spectral density $Q_c = 4.0\text{ (m/s)}^2/\text{s}$, and $\Delta t = 0.5\text{ s}$.
1. Analytically calculate $F = e^{-a \Delta t}$ and $Q_k = \int_0^{\Delta t} e^{-2 a \tau} Q_c d\tau$.
2. Form the Van Loan matrix $\mathcal{M} = \begin{bmatrix} a & Q_c \\ 0 & -a \end{bmatrix}$ and show that its matrix exponential yields the exact same $F$ and $Q_k$.

**Step-by-Step Derivation:**
1. Analytical calculation:
   $$F = e^{-2 \times 0.5} = e^{-1.0} \approx 0.367879$$
   $$Q_k = \int_0^{0.5} e^{-4 \tau} (4.0) d\tau = 4.0 \left[ \frac{1 - e^{-4 \times 0.5}}{4} \right] = 1 - e^{-2.0} = 1 - 0.135335 = 0.864665\text{ (m/s)}^2$$
2. Van Loan matrix formulation:
   In our 1D case, $A = [-a] = [-2]$.
   $$\mathcal{M} = \begin{bmatrix} -A & G Q_c G^T \\ 0 & A^T \end{bmatrix} = \begin{bmatrix} 2 & 4 \\ 0 & -2 \end{bmatrix}$$
   Multiply by $\Delta t = 0.5$:
   $$\mathcal{M} \Delta t = \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix}$$
3. Matrix exponential $\exp(\mathcal{M} \Delta t)$:
   Note that $(\mathcal{M} \Delta t)^2 = \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I_2$.
   Any matrix whose square is $I$ satisfies:
   $$\exp(M) = \cosh(1) I + \sinh(1) M$$
   $$\cosh(1) = \frac{e + e^{-1}}{2} \approx 1.543081, \quad \sinh(1) = \frac{e - e^{-1}}{2} \approx 1.175201$$
   $$\mathcal{E} = 1.543081 \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + 1.175201 \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 2.718282 & 2.350402 \\ 0 & 0.367879 \end{bmatrix}$$
4. Extracting Van Loan blocks:
   $$\Phi_{22} = 0.367879 \implies F = \Phi_{22}^T = 0.367879 = e^{-1}$$
   $$\Phi_{12} = 2.350402$$
   $$Q_k = F \Phi_{12} = 0.367879 \times 2.350402 = 0.864665$$

**Final Result:**
$$F = 0.367879, \quad Q_k = 0.864665\text{ (m/s)}^2$$
The Van Loan method produces the identical result to 6 decimal places.

---

### Problem 4.5 (Worked Example): 2D Coordinated Turn (CT) Model Discretization
**Problem Statement:** A planar drone executes a coordinated turn with constant turn rate $\omega = 0.2\text{ rad/s}$. The state is $x = [p_x, v_x, p_y, v_y]^T$, with continuous dynamics:
$$\dot{p}_x = v_x, \quad \dot{v}_x = -\omega v_y, \quad \dot{p}_y = v_y, \quad \dot{v}_y = \omega v_x$$
Derive the closed-form discrete state transition matrix $F = e^{A \Delta t}$ for sampling interval $\Delta t = 0.5\text{ s}$.

**Step-by-Step Derivation:**
1. Grouping coordinates: write $A$ in block form or reorder state to $[p_x, p_y, v_x, v_y]^T$:
   Let $p = [p_x, p_y]^T, v = [v_x, v_y]^T$.
   $$\dot{p} = v, \quad \dot{v} = \Omega v, \quad \Omega = \begin{bmatrix} 0 & -\omega \\ \omega & 0 \end{bmatrix}$$
2. State transition for velocity:
   Since $\Omega^2 = -\omega^2 I_2$:
   $$e^{\Omega t} = \cos(\omega t) I_2 + \frac{\sin(\omega t)}{\omega} \Omega = \begin{bmatrix} \cos(\omega t) & -\sin(\omega t) \\ \sin(\omega t) & \cos(\omega t) \end{bmatrix} = R(\omega t)$$
   This is the standard 2D rotation matrix.
3. Position transition:
   $$p(t) = p(0) + \int_0^t e^{\Omega \tau} d\tau \, v(0)$$
   $$\int_0^t R(\omega \tau) d\tau = \begin{bmatrix} \frac{\sin(\omega t)}{\omega} & -\frac{1 - \cos(\omega t)}{\omega} \\ \frac{1 - \cos(\omega t)}{\omega} & \frac{\sin(\omega t)}{\omega} \end{bmatrix}$$
4. Numerical evaluation at $\omega = 0.2\text{ rad/s}, \Delta t = 0.5\text{ s}$:
   $$\theta = \omega \Delta t = 0.2 \times 0.5 = 0.1\text{ rad}$$
   $$\cos(0.1) \approx 0.995004, \quad \sin(0.1) \approx 0.099833$$
   $$\frac{\sin(0.1)}{0.2} = 0.499167\text{ s}, \quad \frac{1 - \cos(0.1)}{0.2} = \frac{0.004996}{0.2} = 0.024979\text{ s}$$
5. Full $4 \times 4$ state transition matrix:
   $$F = \begin{bmatrix} 1 & 0.499167 & 0 & -0.024979 \\ 0 & 0.995004 & 0 & -0.099833 \\ 0 & 0.024979 & 1 & 0.499167 \\ 0 & 0.099833 & 0 & 0.995004 \end{bmatrix}$$

**Final Result:**
$$F(\Delta t) = \begin{bmatrix} 1 & \frac{\sin(\omega \Delta t)}{\omega} & 0 & -\frac{1 - \cos(\omega \Delta t)}{\omega} \\ 0 & \cos(\omega \Delta t) & 0 & -\sin(\omega \Delta t) \\ 0 & \frac{1 - \cos(\omega \Delta t)}{\omega} & 1 & \frac{\sin(\omega \Delta t)}{\omega} \\ 0 & \sin(\omega \Delta t) & 0 & \cos(\omega \Delta t) \end{bmatrix}$$

---

### Problem 4.6 (Worked Example): Singer Acceleration Model Discretization
**Problem Statement:** An agile quadrotor has maneuver time constant $\tau_m = 5.0\text{ s}$ ($\alpha = 0.2\text{ s}^{-1}$) and maneuver acceleration variance $\sigma_m^2 = 4.0\text{ m}^2/\text{s}^4$. Compute the discrete state transition matrix $F$ and the discrete acceleration variance $Q_{33}$ for $\Delta t = 0.1\text{ s}$.

**Step-by-Step Derivation:**
1. Given parameters: $\alpha = 0.2$, $\Delta t = 0.1 \implies \alpha \Delta t = 0.02$.
   $$e^{-\alpha \Delta t} = e^{-0.02} \approx 0.980199$$
2. Computing elements of $F$:
   $$F_{11} = 1.0, \quad F_{12} = \Delta t = 0.1$$
   $$F_{13} = \frac{e^{-\alpha \Delta t} - 1 + \alpha \Delta t}{\alpha^2} = \frac{0.980199 - 1 + 0.02}{0.04} = \frac{0.00019867}{0.04} = 0.004967\text{ s}^2$$
   *(Notice that $\frac{1}{2}\Delta t^2 = 0.005$, very close).*
   $$F_{22} = 1.0, \quad F_{23} = \frac{1 - e^{-\alpha \Delta t}}{\alpha} = \frac{1 - 0.980199}{0.2} = \frac{0.019801}{0.2} = 0.099007\text{ s}$$
   $$F_{33} = e^{-\alpha \Delta t} = 0.980199$$
3. Discrete acceleration variance $Q_{33}$:
   From the Singer model, continuous noise spectral density is $Q_c = 2 \alpha \sigma_m^2 = 2 (0.2) (4.0) = 1.6\text{ m}^2/\text{s}^5$.
   $$Q_{33} = \int_0^{\Delta t} e^{-2\alpha \tau} Q_c d\tau = Q_c \left[\frac{1 - e^{-2\alpha \Delta t}}{2\alpha}\right] = 2\alpha \sigma_m^2 \frac{1 - e^{-2\alpha \Delta t}}{2\alpha} = \sigma_m^2 (1 - e^{-2\alpha \Delta t})$$
4. Numerical evaluation:
   $$2\alpha \Delta t = 0.04 \implies e^{-0.04} \approx 0.960789$$
   $$Q_{33} = 4.0 \times (1 - 0.960789) = 4.0 \times 0.039211 = 0.15684\text{ m}^2/\text{s}^4$$

**Final Result:**
$$F = \begin{bmatrix} 1.0 & 0.1 & 0.004967 \\ 0.0 & 1.0 & 0.099007 \\ 0.0 & 0.0 & 0.980199 \end{bmatrix}, \quad Q_{33} = 0.15684\text{ m}^2/\text{s}^4$$

---

### Problem 4.7 (Worked Example): CA Model Jerk Discretization
**Problem Statement:** A robotic elevator follows a Constant Acceleration model driven by jerk white noise with $\tilde{q}_j = 0.05\text{ m}^2/\text{s}^5$ and $\Delta t = 0.2\text{ s}$. Compute the complete $3 \times 3$ matrix $Q_k$ and the correlation coefficient $\rho_{pa}$ between position and acceleration.

**Step-by-Step Derivation:**
1. Using the formula derived in Section 4.5.2:
   $$Q_k = \tilde{q}_j \begin{bmatrix} \frac{\Delta t^5}{20} & \frac{\Delta t^4}{8} & \frac{\Delta t^3}{6} \\ \frac{\Delta t^4}{8} & \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^3}{6} & \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
2. Evaluating powers of $\Delta t = 0.2$:
   $$\Delta t = 0.2, \quad \Delta t^2 = 0.04, \quad \Delta t^3 = 0.008, \quad \Delta t^4 = 0.0016, \quad \Delta t^5 = 0.00032$$
3. Dividing by coefficients:
   $$\frac{\Delta t^5}{20} = 1.6 \times 10^{-5}, \quad \frac{\Delta t^4}{8} = 2.0 \times 10^{-4}, \quad \frac{\Delta t^3}{6} \approx 1.3333 \times 10^{-3}$$
   $$\frac{\Delta t^3}{3} \approx 2.6667 \times 10^{-3}, \quad \frac{\Delta t^2}{2} = 2.0 \times 10^{-2}, \quad \Delta t = 0.2$$
4. Multiplying by $\tilde{q}_j = 0.05$:
   $$Q_{11} = 8.0 \times 10^{-7}\text{ m}^2$$
   $$Q_{12} = Q_{21} = 1.0 \times 10^{-5}\text{ m}^2/\text{s}$$
   $$Q_{13} = Q_{31} = 6.6667 \times 10^{-5}\text{ m}^2/\text{s}^2$$
   $$Q_{22} = 1.3333 \times 10^{-4}\text{ m}^2/\text{s}^2$$
   $$Q_{23} = Q_{32} = 1.0 \times 10^{-3}\text{ m}^2/\text{s}^3$$
   $$Q_{33} = 1.0 \times 10^{-2}\text{ m}^2/\text{s}^4$$
5. Position-acceleration correlation:
   $$\rho_{pa} = \frac{Q_{13}}{\sqrt{Q_{11} Q_{33}}} = \frac{\frac{\tilde{q}_j \Delta t^3}{6}}{\sqrt{\frac{\tilde{q}_j \Delta t^5}{20} \cdot \tilde{q}_j \Delta t}} = \frac{1/6}{\sqrt{1/20}} = \frac{\sqrt{20}}{6} = \frac{2\sqrt{5}}{6} = \frac{\sqrt{5}}{3} \approx 0.745356$$

**Final Result:**
$$Q_k = \begin{bmatrix} 8.00 \times 10^{-7} & 1.00 \times 10^{-5} & 6.67 \times 10^{-5} \\ 1.00 \times 10^{-5} & 1.33 \times 10^{-4} & 1.00 \times 10^{-3} \\ 6.67 \times 10^{-5} & 1.00 \times 10^{-3} & 1.00 \times 10^{-2} \end{bmatrix}, \quad \rho_{pa} = \frac{\sqrt{5}}{3} \approx 0.7454$$

---

### Problem 4.8 (Worked Example): Truncation Error in Euler vs Matrix Exponential
**Problem Statement:** A continuous system has $A = \begin{bmatrix} 0 & 10 \\ -10 & 0 \end{bmatrix}$. Compare the true matrix exponential $F = e^{A \Delta t}$ with the forward Euler approximation $F_{\text{Euler}} = I + A \Delta t$ for $\Delta t = 0.05\text{ s}$. Compute the spectral radius $\rho(F)$ versus $\rho(F_{\text{Euler}})$.

**Step-by-Step Derivation:**
1. True matrix exponential:
   $A$ represents an undamped harmonic oscillator with $\omega = 10\text{ rad/s}$.
   $$F = \begin{bmatrix} \cos(\omega \Delta t) & \sin(\omega \Delta t) \\ -\sin(\omega \Delta t) & \cos(\omega \Delta t) \end{bmatrix}$$
   At $\Delta t = 0.05\text{ s}$, $\omega \Delta t = 0.5\text{ rad}$.
   $$\cos(0.5) \approx 0.877583, \quad \sin(0.5) \approx 0.479426$$
   $$F = \begin{bmatrix} 0.877583 & 0.479426 \\ -0.479426 & 0.877583 \end{bmatrix}$$
   The eigenvalues of $F$ lie strictly on the unit circle: $|\lambda| = \cos^2(0.5) + \sin^2(0.5) = 1.0$.
   $$\rho(F) = 1.000000$$
2. Forward Euler approximation:
   $$F_{\text{Euler}} = I + A \Delta t = \begin{bmatrix} 1 & 10(0.05) \\ -10(0.05) & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0.5 \\ -0.5 & 1 \end{bmatrix}$$
   Eigenvalues of $F_{\text{Euler}}$:
   $$\det(\lambda I - F_{\text{Euler}}) = (\lambda - 1)^2 + 0.25 = 0 \implies \lambda = 1 \pm 0.5 i$$
   Magnitude:
   $$|\lambda| = \sqrt{1^2 + 0.5^2} = \sqrt{1.25} \approx 1.118034$$
   $$\rho(F_{\text{Euler}}) = 1.118034 > 1.0$$

**Final Result:**
$$\rho(F) = 1.000000\text{ (conserves energy)}, \quad \rho(F_{\text{Euler}}) = 1.118034\text{ (unstable growth)}$$
*Physical Consequence:* Forward Euler artificially adds energy to the system, causing the unforced oscillator state estimate to diverge exponentially by $11.8\%$ every 50 ms.

---

### Problem 4.9 (Worked Example): Observability under Periodic Sampling
**Problem Statement:** A continuous oscillator $\dot{x} = \begin{bmatrix} 0 & \omega \\ -\omega & 0 \end{bmatrix} x$ is observed via $z = [1, 0] x$. Determine the sampling intervals $\Delta t$ for which the discrete system loses observability (pathological sampling).

**Step-by-Step Derivation:**
1. Discrete state transition:
   $$F = \begin{bmatrix} \cos(\omega \Delta t) & \sin(\omega \Delta t) \\ -\sin(\omega \Delta t) & \cos(\omega \Delta t) \end{bmatrix}, \quad H = \begin{bmatrix} 1 & 0 \end{bmatrix}$$
2. Discrete observability matrix:
   $$\mathcal{O} = \begin{bmatrix} H \\ H F \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ \cos(\omega \Delta t) & \sin(\omega \Delta t) \end{bmatrix}$$
3. Determinant of observability matrix:
   $$\det(\mathcal{O}) = 1 \cdot \sin(\omega \Delta t) - 0 = \sin(\omega \Delta t)$$
4. Rank condition:
   $\operatorname{rank}(\mathcal{O}) < 2 \iff \sin(\omega \Delta t) = 0 \iff \omega \Delta t = k \pi$ for $k \in \mathbb{Z}^+$.
   $$\Delta t = \frac{k \pi}{\omega} = \frac{k}{2 f_0}$$

**Final Result:**
$$\Delta t = \frac{k \pi}{\omega}\text{ for }k = 1, 2, 3, \dots$$
*Engineering Significance:* If sampling occurs at twice the natural frequency (or integer multiples of the half-period), velocity oscillations are completely masked at sampling instants, rendering the system unobservable.

---

### Problem 4.10 (Worked Example): Van Loan Algorithm Implementation in Pseudocode
**Problem Statement:** Specify the exact numerical algorithm for Van Loan discretization using matrix exponentiation via scaling-and-squaring with Padé approximation. State the computational complexity for state dimension $n$.

**Step-by-Step Derivation:**
1. Algorithm steps:
   - Input: $A \in \mathbb{R}^{n \times n}, G \in \mathbb{R}^{n \times q}, Q_c \in \mathbb{S}_+^q, \Delta t > 0$.
   - Compute $W = G Q_c G^T \in \mathbb{R}^{n \times n}$.
   - Form $2n \times 2n$ block matrix:
     $$\mathcal{M} = \begin{bmatrix} -A & W \\ 0 & A^T \end{bmatrix}$$
   - Scale matrix: $\tilde{\mathcal{M}} = \mathcal{M} \Delta t$.
   - Compute matrix exponential $\mathcal{E} = \operatorname{expm}(\tilde{\mathcal{M}})$ using degree-13 Padé approximant with scaling and squaring.
   - Partition $\mathcal{E}$ into $n \times n$ blocks:
     $$\mathcal{E} = \begin{bmatrix} \Phi_{11} & \Phi_{12} \\ \Phi_{21} & \Phi_{22} \end{bmatrix}$$
   - Extract:
     $$F = \Phi_{22}^T$$
     $$Q_k = F \, \Phi_{12}$$
   - Enforce numerical symmetry:
     $$Q_k \leftarrow \frac{1}{2}(Q_k + Q_k^T)$$
2. Computational Complexity:
   Matrix multiplication of $2n \times 2n$ matrices requires $(2n)^3 = 8 n^3$ flops.
   Degree-13 Padé approximation requires ~6 matrix multiplications:
   $$\text{Flops} \approx 6 \times 8 n^3 = 48 n^3$$
   For $n = 6$ (typical robotic pose-velocity), $48 \times 216 \approx 10,368$ flops, taking less than $2\mu\text{s}$ on modern hardware.

**Final Result:**
$$\text{Computational Complexity} = \mathcal{O}(n^3)\text{ flops}$$

---

### Problem 4.11 (Solved Exercise): 3D Constant Velocity Decoupled Noise Formulation
**Problem Statement:** A 3D aerial drone follows uncoupled 3D Constant Velocity dynamics with isotropic acceleration spectral density $\tilde{q} = 0.5\text{ m}^2/\text{s}^3$ along $x, y, z$. For $\Delta t = 0.05\text{ s}$, write the full $6 \times 6$ matrix $Q_k$ using the Kronecker product $\otimes$.

**Step-by-Step Solution:**
1. The 1D CWNA matrix for $\Delta t = 0.05$ is:
   $$Q_{\text{1D}} = \tilde{q} \begin{bmatrix} \frac{\Delta t^3}{3} & \frac{\Delta t^2}{2} \\ \frac{\Delta t^2}{2} & \Delta t \end{bmatrix}$$
   $$\frac{\Delta t^3}{3} = \frac{0.000125}{3} \approx 4.1667 \times 10^{-5}$$
   $$\frac{\Delta t^2}{2} = \frac{0.0025}{2} = 1.25 \times 10^{-3}$$
   $$\Delta t = 0.05$$
   $$Q_{\text{1D}} = 0.5 \begin{bmatrix} 4.1667 \times 10^{-5} & 1.25 \times 10^{-3} \\ 1.25 \times 10^{-3} & 0.05 \end{bmatrix} = \begin{bmatrix} 2.0833 \times 10^{-5} & 6.25 \times 10^{-4} \\ 6.25 \times 10^{-4} & 2.5 \times 10^{-2} \end{bmatrix}$$
2. Reordering state vector to $x = [p_x, v_x, p_y, v_y, p_z, v_z]^T$:
   $$Q_k = I_3 \otimes Q_{\text{1D}} = \begin{bmatrix} Q_{\text{1D}} & 0 & 0 \\ 0 & Q_{\text{1D}} & 0 \\ 0 & 0 & Q_{\text{1D}} \end{bmatrix}$$

**Final Answer:**
$$Q_k = \operatorname{diag}(Q_{\text{1D}}, Q_{\text{1D}}, Q_{\text{1D}}), \quad Q_{\text{1D}} = \begin{bmatrix} 2.083 \times 10^{-5} & 6.250 \times 10^{-4} \\ 6.250 \times 10^{-4} & 2.500 \times 10^{-2} \end{bmatrix}$$

---

### Problem 4.12 (Solved Exercise): Cayley-Hamilton Calculation of Matrix Exponential
**Problem Statement:** Use the Cayley-Hamilton theorem to compute $e^{A t}$ for $A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$.

**Step-by-Step Solution:**
1. Characteristic polynomial of $A$:
   $$p(\lambda) = \det(\lambda I - A) = (\lambda - 1)(\lambda - 3) = \lambda^2 - 4\lambda + 3$$
   Eigenvalues are $\lambda_1 = 1, \lambda_2 = 3$.
2. By Cayley-Hamilton, $e^{At} = \alpha_0(t) I + \alpha_1(t) A$, where the scalar coefficients satisfy:
   $$e^{\lambda_1 t} = \alpha_0 + \alpha_1 \lambda_1 \implies e^t = \alpha_0 + \alpha_1$$
   $$e^{\lambda_2 t} = \alpha_0 + \alpha_1 \lambda_2 \implies e^{3t} = \alpha_0 + 3 \alpha_1$$
3. Subtracting equations:
   $$2 \alpha_1 = e^{3t} - e^t \implies \alpha_1 = \frac{e^{3t} - e^t}{2}$$
   $$\alpha_0 = e^t - \alpha_1 = e^t - \frac{e^{3t} - e^t}{2} = \frac{3e^t - e^{3t}}{2}$$
4. Reconstructing matrix:
   $$e^{At} = \frac{3e^t - e^{3t}}{2} \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + \frac{e^{3t} - e^t}{2} \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}$$
   Top-left: $\frac{3e^t - e^{3t} + e^{3t} - e^t}{2} = e^t$.
   Top-right: $2 \times \frac{e^{3t} - e^t}{2} = e^{3t} - e^t$.
   Bottom-left: $0$.
   Bottom-right: $\frac{3e^t - e^{3t} + 3(e^{3t} - e^t)}{2} = e^{3t}$.

**Final Answer:**
$$e^{At} = \begin{bmatrix} e^t & e^{3t} - e^t \\ 0 & e^{3t} \end{bmatrix}$$

---

### Problem 4.13 (Solved Exercise): Continuous vs Discrete Riccati Propagation
**Problem Statement:** Show that the continuous propagation of state covariance $\dot{P} = A P + P A^T + G Q_c G^T$ over $[0, \Delta t]$ with initial condition $P(0)$ yields exactly $P(\Delta t) = F P(0) F^T + Q_k$.

**Step-by-Step Solution:**
1. Pre-multiply differential equation by $e^{-At}$ and post-multiply by $e^{-A^T t}$:
   $$e^{-At} \dot{P}(t) e^{-A^T t} - e^{-At} A P(t) e^{-A^T t} - e^{-At} P(t) A^T e^{-A^T t} = e^{-At} G Q_c G^T e^{-A^T t}$$
2. Recognize total derivative:
   $$\frac{d}{dt}\left( e^{-At} P(t) e^{-A^T t} \right) = e^{-At} G Q_c G^T e^{-A^T t}$$
3. Integrate from $0$ to $\Delta t$:
   $$e^{-A \Delta t} P(\Delta t) e^{-A^T \Delta t} - P(0) = \int_0^{\Delta t} e^{-A \tau} G Q_c G^T e^{-A^T \tau} d\tau$$
4. Pre-multiply by $e^{A \Delta t} = F$ and post-multiply by $e^{A^T \Delta t} = F^T$:
   $$P(\Delta t) = F P(0) F^T + \int_0^{\Delta t} e^{A(\Delta t - \tau)} G Q_c G^T e^{A^T(\Delta t - \tau)} d\tau$$
5. Setting $\lambda = \Delta t - \tau$, the integral becomes $\int_0^{\Delta t} e^{A \lambda} G Q_c G^T e^{A^T \lambda} d\lambda = Q_k$.
   $$P(\Delta t) = F P(0) F^T + Q_k \quad \blacksquare$$

---

### Problem 4.14 (Solved Exercise): Discrete Transfer Function Poles and Stability
**Problem Statement:** A continuous plant has poles at $s = -1 \pm 5 i$. Compute the sampling interval $\Delta t$ and discrete pole locations $z_1, z_2$ in the $z$-plane for $\Delta t = 0.1\text{ s}$. Is the discrete system stable?

**Step-by-Step Solution:**
1. Under exact discretization, continuous poles map via $z_i = e^{s_i \Delta t}$.
2. Continuous poles: $s = -1 \pm 5 i$.
   $$z = e^{(-1 \pm 5 i) 0.1} = e^{-0.1} e^{\pm 0.5 i} = e^{-0.1} (\cos(0.5) \pm i \sin(0.5))$$
3. Numerical calculation:
   $$e^{-0.1} \approx 0.904837$$
   $$\cos(0.5) \approx 0.877583, \quad \sin(0.5) \approx 0.479426$$
   $$z_1, z_2 = 0.904837 (0.877583 \pm 0.479426 i) \approx 0.794070 \pm 0.433803 i$$
4. Magnitude:
   $$|z| = e^{-0.1} \approx 0.904837 < 1.0$$

**Final Answer:**
$$z_1, z_2 = 0.7941 \pm 0.4338 i, \quad |z| = 0.9048 < 1.0\text{ (Asymptotically Stable)}$$

---

### Problem 4.15 (Solved Exercise): Zero-Order Hold Frequency Response Distortion
**Problem Statement:** The continuous-time frequency response $H_c(j\omega)$ differs from the discrete ZOH equivalent $H_d(e^{j\omega \Delta t})$. Write the exact mathematical transfer function of a ZOH hold circuit and evaluate its phase lag at the Nyquist frequency $\omega_N = \frac{\pi}{\Delta t}$.

**Step-by-Step Solution:**
1. The impulse response of a zero-order hold is a rectangular pulse of duration $\Delta t$: $h_{\text{ZOH}}(t) = 1$ for $t \in [0, \Delta t)$, $0$ elsewhere.
2. Laplace transform:
   $$H_{\text{ZOH}}(s) = \frac{1 - e^{-s \Delta t}}{s}$$
3. Evaluating on the frequency axis $s = j\omega$:
   $$H_{\text{ZOH}}(j\omega) = \frac{1 - e^{-j\omega \Delta t}}{j\omega} = e^{-j\omega \Delta t / 2} \frac{e^{j\omega \Delta t / 2} - e^{-j\omega \Delta t / 2}}{j\omega} = e^{-j\omega \Delta t / 2} \Delta t \operatorname{sinc}\left(\frac{\omega \Delta t}{2}\right)$$
4. Phase lag:
   $$\angle H_{\text{ZOH}}(j\omega) = -\frac{\omega \Delta t}{2}\text{ radians}$$
5. At the Nyquist frequency $\omega_N = \frac{\pi}{\Delta t}$:
   $$\angle H_{\text{ZOH}}(j\omega_N) = -\frac{\pi}{2}\text{ radians} = -90^\circ$$

**Final Answer:**
$$H_{\text{ZOH}}(j\omega) = \Delta t \operatorname{sinc}\left(\frac{\omega \Delta t}{2}\right) e^{-j\omega \Delta t / 2}, \quad \text{Phase lag at Nyquist} = -90^\circ$$

---

### Problem 4.16 (Solved Exercise): Decoupled Kinematic States under Orthogonal Geometry
**Problem Statement:** Prove that for a robot navigating in 3D Cartesian space under continuous white acceleration noise along orthogonal coordinate axes $x, y, z$, the $6 \times 6$ estimation covariance remains permanently block-diagonal if the initial covariance $P_0$ is block-diagonal and measurements are linear Cartesian positions.

**Step-by-Step Solution:**
1. State vector $X = [x, y, z]^T$ where each subvector is $x_i = [p_i, v_i]^T$.
2. Dynamics matrix $F = \operatorname{diag}(F_{\text{1D}}, F_{\text{1D}}, F_{\text{1D}})$ and process covariance $Q = \operatorname{diag}(Q_{\text{1D}}, Q_{\text{1D}}, Q_{\text{1D}})$.
3. Measurement matrix $H = \operatorname{diag}(H_{\text{1D}}, H_{\text{1D}}, H_{\text{1D}})$ where $H_{\text{1D}} = [1, 0]$, and measurement noise $R = \operatorname{diag}(r_x, r_y, r_z)$.
4. If $P_{0}$ is block-diagonal with $2 \times 2$ blocks along the diagonal, then $F P_0 F^T + Q$ is the direct sum of three $2 \times 2$ matrix products, hence strictly block-diagonal.
5. In the update step, $S = H P^- H^T + R$ is diagonal ($3 \times 3$). Its inverse $S^{-1}$ is diagonal.
6. Kalman gain $K = P^- H^T S^{-1}$ consists of three decoupled $2 \times 1$ blocks.
7. Updated covariance $P^+ = (I - K H) P^-$ preserves the block-diagonal structure.
8. By induction, cross-axis covariances (e.g. $\mathbb{E}[(p_x - \hat{p}_x)(p_y - \hat{p}_y)]$) remain identically zero for all $k \ge 0$. $\blacksquare$

---

### Problem 4.17 (Solved Exercise): Continuous State-Space Formulation of a Spring-Mass-Damper
**Problem Statement:** A robotic suspension has mass $m = 2\text{ kg}$, damping coefficient $c = 6\text{ N}\cdot\text{s/m}$, and spring constant $k = 20\text{ N/m}$. An external white noise force $w_c(t)$ with spectral density $S_F = 8\text{ N}^2/\text{Hz}$ acts on the mass. Write the continuous state-space matrices $(A, G, Q_c)$ for state $x = [p, v]^T$.

**Step-by-Step Solution:**
1. Equation of motion:
   $$m \ddot{p} + c \dot{p} + k p = w_c(t) \implies \ddot{p} = -\frac{k}{m} p - \frac{c}{m} \dot{p} + \frac{1}{m} w_c(t)$$
2. Numerical parameters:
   $$\frac{k}{m} = \frac{20}{2} = 10\text{ s}^{-2}, \quad \frac{c}{m} = \frac{6}{2} = 3\text{ s}^{-1}, \quad \frac{1}{m} = 0.5\text{ kg}^{-1}$$
3. State vector $x = [p, v]^T$:
   $$\begin{bmatrix} \dot{p} \\ \dot{v} \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -10 & -3 \end{bmatrix} \begin{bmatrix} p \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ 0.5 \end{bmatrix} w_c(t)$$
4. Process noise:
   $Q_c = S_F = 8.0\text{ N}^2/\text{Hz}$.

**Final Answer:**
$$A = \begin{bmatrix} 0 & 1 \\ -10 & -3 \end{bmatrix}, \quad G = \begin{bmatrix} 0 \\ 0.5 \end{bmatrix}, \quad Q_c = 8.0\text{ N}^2\cdot\text{s}$$

---

### Problem 4.18 (Solved Exercise): Sampling Invariance of State Steady-State Variance
**Problem Statement:** For the 1D velocity model $\dot{v} = -a v + w_c(t)$, prove that as $\Delta t \to 0$, the discrete steady-state velocity variance $p_\infty$ predicted by the continuous Lyapunov equation $\dot{P} = -2 a P + Q_c = 0$ matches the discrete steady-state variance.

**Step-by-Step Solution:**
1. Continuous Lyapunov equation:
   $$-2 a P_\infty + Q_c = 0 \implies P_\infty = \frac{Q_c}{2a}$$
2. Discrete model:
   $$F = e^{-a \Delta t}, \quad Q_k = Q_c \frac{1 - e^{-2a \Delta t}}{2a}$$
3. Discrete unobserved propagation:
   $$P_{k+1} = F^2 P_k + Q_k = e^{-2a \Delta t} P_k + Q_c \frac{1 - e^{-2a \Delta t}}{2a}$$
4. Setting steady-state $P_{k+1} = P_k = P_\infty$:
   $$P_\infty (1 - e^{-2a \Delta t}) = Q_c \frac{1 - e^{-2a \Delta t}}{2a}$$
5. Dividing both sides by $(1 - e^{-2a \Delta t})$:
   $$P_\infty = \frac{Q_c}{2a}$$
   This holds exactly for *any* $\Delta t > 0$, not merely in the limit $\Delta t \to 0$. $\blacksquare$

---

### Problem 4.19 (Solved Exercise): Continuous White Acceleration to Discrete Velocity Jump
**Problem Statement:** A continuous white acceleration $w_c(t)$ with spectral density $\tilde{q} = 1.0\text{ m}^2/\text{s}^3$ acts on a velocity state over $\Delta t = 0.01\text{ s}$. Compute the root-mean-square velocity change $\Delta v_{\text{rms}}$ and compare it with the heuristic discrete formula $\Delta v = \sigma_a \Delta t$.

**Step-by-Step Solution:**
1. Under continuous CWNA:
   $$Q_{vv} = \tilde{q} \Delta t = 1.0 \times 0.01 = 0.01\text{ m}^2/\text{s}^2$$
   $$\Delta v_{\text{rms}} = \sqrt{Q_{vv}} = \sqrt{0.01} = 0.1\text{ m/s}$$
2. Notice the scaling: $\Delta v_{\text{rms}} \propto \sqrt{\Delta t}$.
   If one naively assumes acceleration is a discrete random variable with fixed variance $\sigma_a^2$, $\Delta v = \sigma_a \Delta t \propto \Delta t$.
3. As $\Delta t \to 0$, the continuous white noise produces velocity increments scaling as $\mathcal{O}(\Delta t^{1/2})$, consistent with Brownian motion (Wiener process), whereas discrete heuristics incorrectly scale as $\mathcal{O}(\Delta t)$.

**Final Answer:**
$$\Delta v_{\text{rms}} = \sqrt{\tilde{q} \Delta t} = 0.1\text{ m/s}$$

---

### Problem 4.20 (Solved Exercise): Coordinate Transformation of Process Covariance
**Problem Statement:** A 2D robot's process noise covariance $Q_{\text{robot}}$ is known in body coordinates $(x_b, y_b)$ where $\sigma_x^2 = 0.04, \sigma_y^2 = 0.01, \sigma_{xy} = 0$. If the robot's heading relative to the world frame is $\theta = 45^\circ$, compute the world-frame process noise covariance $Q_{\text{world}} = R(\theta) Q_{\text{robot}} R^T(\theta)$.

**Step-by-Step Solution:**
1. Rotation matrix for $\theta = 45^\circ$ ($\cos 45^\circ = \sin 45^\circ = \frac{1}{\sqrt{2}}$):
   $$R = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}$$
2. Robot frame covariance:
   $$Q_{\text{robot}} = \begin{bmatrix} 0.04 & 0 \\ 0 & 0.01 \end{bmatrix}$$
3. Transformation:
   $$Q_{\text{world}} = \frac{1}{2} \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} 0.04 & 0 \\ 0 & 0.01 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}$$
   $$= \frac{1}{2} \begin{bmatrix} 0.04 & -0.01 \\ 0.04 & 0.01 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 0.05 & 0.03 \\ 0.03 & 0.05 \end{bmatrix} = \begin{bmatrix} 0.025 & 0.015 \\ 0.015 & 0.025 \end{bmatrix}$$
4. Invariant checks:
   $$\operatorname{tr}(Q_{\text{world}}) = 0.025 + 0.025 = 0.05 = \operatorname{tr}(Q_{\text{robot}})$$
   $$\det(Q_{\text{world}}) = (0.025)^2 - (0.015)^2 = 0.000625 - 0.000225 = 0.0004 = \det(Q_{\text{robot}})$$

**Final Answer:**
$$Q_{\text{world}} = \begin{bmatrix} 0.025 & 0.015 \\ 0.015 & 0.025 \end{bmatrix}$$
All tensor invariants (trace, determinant) are strictly preserved.
