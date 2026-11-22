# Chapter 10: Linear Stability Analysis, Eigenvalue Spectra, and the Courant-Friedrichs-Lewy (CFL) Condition

> *"Numerical stability is not merely an aesthetic desire for well-behaved curves; it is the strict mathematical boundary separating computational order from exponential thermodynamic chaos. Cross that boundary by even an infinitesimal fraction of a millisecond, and discrete silicon transforms any physical law into an explosive cascade of infinities."*

---

### Conceptual Architecture: The Linear Stability Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   CONTINUOUS DYNAMICAL SYSTEM:  dy/dt = f(y, t)                          │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Linearize about equilibrium y*
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                STATE-SPACE JACOBIAN FORMULATION:  d(δy)/dt = J · δy                      │
│                                  J_ik = ∂f_i / ∂y_k                                      │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Apply Discrete Integrator Formula
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                 DISCRETE AMPLIFICATION OPERATOR:  y_{n+1} = G(Δt) · y_n                  │
│                        G(Δt) is the Amplification Matrix                                 │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Spectral Decomposition: G v_i = λ_i v_i
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   SPECTRAL RADIUS CRITERION:  ρ(G) = max_i |λ_i|                         │
│                                                                                          │
│     ρ(G) < 1.0                     ρ(G) == 1.0                    ρ(G) > 1.0             │
│  Asymptotic Stability          Marginal / Symplectic         Exponential Blow-Up         │
│ (Energy Dissipation)            (Invariant Tori)              (Catastrophic Explosion)   │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Discrete Wave / Lattice Physics
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   COURANT-FRIEDRICHS-LEWY (CFL) STABILITY THRESHOLD                      │
│                                                                                          │
│           Coupled Oscillator Chain:                    Spatial Continuum Waves:          │
│             Δt_crit = 2 / ω_max                         CFL = (c · Δt) / Δx ≤ 1.0        │
│             Δt_crit = 2 · sqrt(m / k_max)               Δt ≤ Δx / c                      │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10.1 Linear State-Space Dynamics and the Jacobian Matrix

Every physical system in classical mechanics, regardless of how complex its non-linear interactions may be, can be expressed as an autonomous first-order system of ordinary differential equations:
$$\dot{\mathbf{y}}(t) = \mathbf{f}(\mathbf{y}(t))$$
where $\mathbf{y} \in \mathbb{R}^N$ represents the generalized state vector (such as concatenations of positions and velocities $[\mathbf{x}^T, \mathbf{v}^T]^T$).

### 10.1.1 Equilibrium Points and First-Order Perturbations
An equilibrium point $\mathbf{y}^* \in \mathbb{R}^N$ is a state at which all temporal derivatives vanish identically:
$$\mathbf{f}(\mathbf{y}^*) = \mathbf{0}$$

To analyze whether small disturbances near $\mathbf{y}^*$ decay, oscillate stably, or explode exponentially into numerical ruin, we introduce an infinitesimal perturbation vector $\boldsymbol{\delta}(t)$:
$$\mathbf{y}(t) = \mathbf{y}^* + \boldsymbol{\delta}(t)$$

Substituting this perturbed state into our continuous governing ODE and expanding $\mathbf{f}$ via a multidimensional Taylor series about $\mathbf{y}^*$:
$$\frac{d}{dt}(\mathbf{y}^* + \boldsymbol{\delta}(t)) = \mathbf{f}(\mathbf{y}^* + \boldsymbol{\delta}(t)) = \mathbf{f}(\mathbf{y}^*) + \mathbf{J}(\mathbf{y}^*) \boldsymbol{\delta}(t) + \mathcal{O}(\|\boldsymbol{\delta}\|^2)$$

Because $\mathbf{y}^*$ is stationary ($\dot{\mathbf{y}}^* = \mathbf{0}$) and $\mathbf{f}(\mathbf{y}^*) = \mathbf{0}$, the zeroth-order terms cancel. Neglecting higher-order non-linear terms $\mathcal{O}(\|\boldsymbol{\delta}\|^2)$, we obtain the linearized continuous perturbation equation:
$$\dot{\boldsymbol{\delta}}(t) = \mathbf{J} \boldsymbol{\delta}(t)$$
where $\mathbf{J} \in \mathbb{R}^{N \times N}$ is the system Jacobian matrix evaluated at equilibrium:
$$J_{ik} = \left. \frac{\partial f_i}{\partial y_k} \right|_{\mathbf{y} = \mathbf{y}^*}$$

### 10.1.2 Continuous Spectral Stability
The analytical solution to $\dot{\boldsymbol{\delta}} = \mathbf{J} \boldsymbol{\delta}$ with initial disturbance $\boldsymbol{\delta}(0)$ is given by the matrix exponential:
$$\boldsymbol{\delta}(t) = \exp(\mathbf{J} t) \boldsymbol{\delta}(0)$$

Let $\{\mu_i\}_{i=1}^N$ be the complex eigenvalues of the continuous Jacobian $\mathbf{J}$, satisfying $\det(\mathbf{J} - \mu \mathbf{I}) = 0$. The asymptotic behavior of the physical system is governed entirely by the real parts $\text{Re}(\mu_i)$:
1. **Asymptotically Stable:** $\text{Re}(\mu_i) < 0$ for all $i$. All physical perturbations decay exponentially to zero as $t \to \infty$.
2. **Marginally (Lyapunov) Stable:** $\text{Re}(\mu_i) \le 0$ for all $i$, with $\text{Re}(\mu_j) = 0$ having non-defective geometric multiplicity. Perturbations oscillate sinusoidally without growth (standard conservative Hamiltonian systems).
3. **Linearly Unstable:** $\text{Re}(\mu_i) > 0$ for at least one eigenvalue $\mu_i$. Any disturbance, no matter how minute, triggers exponential divergence.

---

## 10.2 The Discrete Amplification Matrix $\mathbf{G}(\Delta t)$

When a continuous differential equation is discretized on silicon with a finite timestep $\Delta t$, the continuous flow map $\exp(\mathbf{J} t)$ is replaced by a discrete recurrence relation:
$$\mathbf{y}_{n+1} = \mathbf{G}(\Delta t) \mathbf{y}_n$$
where $\mathbf{G}(\Delta t) \in \mathbb{R}^{N \times N}$ is the **Amplification Matrix** (also termed the discrete state-transition operator).

Applying this operator iteratively across $n$ consecutive simulation steps:
$$\mathbf{y}_n = [\mathbf{G}(\Delta t)]^n \mathbf{y}_0$$

### 10.2.1 Spectral Decomposition of the Amplification Operator
Assuming $\mathbf{G}$ is diagonalizable, it possesses $N$ linearly independent eigenvectors $\{\mathbf{v}_i\}$ corresponding to eigenvalues $\{\lambda_i\}$:
$$\mathbf{G} \mathbf{v}_i = \lambda_i \mathbf{v}_i, \quad \lambda_i \in \mathbb{C}$$

Any arbitrary initial state $\mathbf{y}_0$ can be uniquely expressed as a linear superposition of these eigenvectors:
$$\mathbf{y}_0 = \sum_{i=1}^N c_i \mathbf{v}_i$$

Propagating this state forward across $n$ discrete timesteps yields:
$$\mathbf{y}_n = [\mathbf{G}]^n \sum_{i=1}^N c_i \mathbf{v}_i = \sum_{i=1}^N c_i [\mathbf{G}]^n \mathbf{v}_i = \sum_{i=1}^N c_i \lambda_i^n \mathbf{v}_i$$

The discrete time evolution of each modal component is dictated entirely by powers of the discrete eigenvalue:
$$\lambda_i^n = |\lambda_i|^n e^{i n \theta_i}, \quad \text{where } \theta_i = \text{Arg}(\lambda_i)$$

### 10.2.2 The Spectral Radius Stability Criterion
The **spectral radius** $\rho(\mathbf{G})$ of an amplification operator is the maximum modulus among all its complex eigenvalues:
$$\rho(\mathbf{G}) \equiv \max_{1 \le i \le N} |\lambda_i|$$

The **Von Neumann Absolute Stability Criterion** establishes the ironclad boundary for numerical solvability:
$$\rho(\mathbf{G}(\Delta t)) \le 1.0$$

| Spectral Radius Magnitude | Numerical Regime | Physical Consequence |
|---|---|---|
| $\rho(\mathbf{G}) > 1.0$ | **Explosive Instability** | $|\lambda_i|^n \to \infty$ exponentially. In finite ticks, positions overflow to `NaN` or `Infinity`. |
| $\rho(\mathbf{G}) = 1.0$ | **Marginal / Symplectic Stability** | $|\lambda_i|^n = 1.0$. Perturbations circulate indefinitely on closed orbits (phase-space tori). |
| $\rho(\mathbf{G}) < 1.0$ | **Artificial Dissipation** | $|\lambda_i|^n \to 0$. Numerical viscosity damps physical motion even in zero-friction environments. |

---

## 10.3 Stability Regions in the Complex $z$-Plane

To characterize any numerical integrator generically, numerical analysts employ the scalar complex Dahlquist test equation:
$$\dot{y}(t) = \mu y(t), \quad \mu \in \mathbb{C}$$
where $\mu = \alpha + i\omega$. In physical mechanics, $\alpha \le 0$ corresponds to physical damping, while $\omega = \sqrt{k/m}$ corresponds to natural harmonic oscillation frequency.

Defining the dimensionless complex step parameter:
$$z \equiv \mu \Delta t = (\alpha \Delta t) + i(\omega \Delta t) \in \mathbb{C}$$

Applying an integration method to the test equation produces a discrete update:
$$y_{n+1} = R(z) y_n$$
where $R(z)$ is the **Stability Function** (the scalar counterpart of the amplification matrix). The **Region of Absolute Stability** $\mathcal{S}$ is defined as the subset of the complex plane where the amplification factor does not exceed unity:
$$\mathcal{S} = \{z \in \mathbb{C} : |R(z)| \le 1.0\}$$

### 10.3.1 Stability Functions of Canonical Integrators

```
Complex Plane Stability Loci: Re(z) vs Im(z)

            Im(z) [Oscillation Axis: ω Δt]
              ▲
              │          Backward Euler: Unconditionally Stable
       ───────┼───────   Outside circle of radius 1 centered at (1, 0)
              │  * * *
              │ *     *  RK4: Contains segment of imaginary axis [-2.83i, +2.83i]
              │*       *
      ────────┼─────────► Re(z) [Damping Axis: α Δt]
              │*       *
              │ *     *  Forward Euler: Circle of radius 1 centered at (-1, 0)
              │  * * *   EXCLUDES IMAGINARY AXIS! Pure oscillators always blow up!
              │
```

1. **Explicit Forward Euler:**
   $$y_{n+1} = y_n + \Delta t (\mu y_n) = (1 + z) y_n \implies R_{\text{FE}}(z) = 1 + z$$
   Stability condition: $|1 + z| \le 1$. In the complex plane, this represents a disk of radius 1 centered at $(-1, 0)$.
   *Crucial Trap:* The imaginary axis $z = i\omega \Delta t$ intersects this region **only at the single origin point $z = 0$**. For any non-zero frequency $\omega > 0$ and any timestep $\Delta t > 0$:
   $$|R_{\text{FE}}(i\omega \Delta t)| = |1 + i\omega \Delta t| = \sqrt{1 + \omega^2 \Delta t^2} > 1.0$$
   Explicit Forward Euler is **unconditionally unstable** for undamped physical oscillators!

2. **Implicit Backward Euler:**
   $$y_{n+1} = y_n + \Delta t (\mu y_{n+1}) \implies y_{n+1} = \frac{1}{1 - z} y_n \implies R_{\text{BE}}(z) = \frac{1}{1 - z}$$
   Stability condition: $|1 - z| \ge 1$. This region encompasses the **entire left half-plane** $\text{Re}(z) \le 0$ as well as portions of the right half-plane. Implicit Euler is **A-stable** (and L-stable), guaranteeing that it can never explode, but at the cost of heavy artificial dissipation along the imaginary axis ($|R_{\text{BE}}(i\omega\Delta t)| = 1/\sqrt{1+\omega^2\Delta t^2} < 1$).

3. **Trapezoidal Rule (Crank-Nicolson):**
   $$R_{\text{Trap}}(z) = \frac{1 + \frac{1}{2}z}{1 - \frac{1}{2}z}$$
   On the imaginary axis $z = i\omega \Delta t$:
   $$\left| R_{\text{Trap}}(i\omega \Delta t) \right| = \left| \frac{1 + i\frac{\omega \Delta t}{2}}{1 - i\frac{\omega \Delta t}{2}} \right| = \frac{\sqrt{1 + \frac{\omega^2 \Delta t^2}{4}}}{\sqrt{1 + \frac{\omega^2 \Delta t^2}{4}}} \equiv 1.0$$
   The Trapezoidal method preserves marginal stability precisely along the entire imaginary axis without artificial damping or explosion.

4. **Classical Fourth-Order Runge-Kutta (RK4):**
   Expanding the truncated Taylor polynomial of the exponential $e^z$:
   $$R_{\text{RK4}}(z) = 1 + z + \frac{z^2}{2} + \frac{z^3}{6} + \frac{z^4}{24}$$
   Unlike lower-order explicit methods, the stability region of RK4 bulges into the left half-plane and **encloses a finite segment of the imaginary axis**:
   $$\text{For } z = i\beta, \quad |R_{\text{RK4}}(i\beta)| \le 1.0 \iff |\beta| \le 2\sqrt{2} \approx 2.8284$$
   RK4 can integrate undamped physical oscillations stably, provided the timestep satisfies $\omega \Delta t \le 2.8284$.

---

## 10.4 The Courant-Friedrichs-Lewy (CFL) Condition in Physical Simulations

The Courant-Friedrichs-Lewy condition, originally formulated in 1928 for hyperbolic partial differential equations (wave equations), establishes a fundamental relationship between spatial discretization spacing $\Delta x$ and temporal discretization increment $\Delta t$.

### 10.4.1 Continuous Wave Propagation vs Discrete Domain of Dependence
Consider a 1D scalar acoustic or elastic wave equation:
$$\frac{\partial^2 u}{\partial t^2} = c^2 \frac{\partial^2 u}{\partial x^2}$$
where $c$ is the characteristic physical propagation speed of disturbances through the medium (e.g., speed of sound or shear wave velocity).

In the continuous physical continuum, the state at point $(x_0, t_0)$ depends strictly on the initial data within the **physical domain of dependence**:
$$\mathcal{D}_{\text{physical}}(x_0, t_0) = [x_0 - c t_0, \, x_0 + c t_0]$$

When discretizing space with cell width $\Delta x$ and time with step $\Delta t$ using explicit finite differences or particle stencils, numerical information can propagate across at most one grid cell per timestep:
$$\mathcal{D}_{\text{numerical}}(x_i, t_n) = [x_i - \frac{\Delta x}{\Delta t} t_n, \, x_i + \frac{\Delta x}{\Delta t} t_n]$$

The Courant-Friedrichs-Lewy theorem states:
> *A necessary condition for the convergence and stability of any explicit finite-difference or discrete particle scheme is that the numerical domain of dependence must completely contain the physical domain of dependence.*

$$\mathcal{D}_{\text{physical}} \subseteq \mathcal{D}_{\text{numerical}} \implies c \le \frac{\Delta x}{\Delta t}$$

Defining the dimensionless **Courant Number** $C$:
$$C \equiv \frac{c \Delta t}{\Delta x} \le 1.0$$
$$\Delta t \le \Delta t_{\text{CFL}} = \frac{\Delta x}{c}$$

If $\Delta t > \Delta x / c$, physical information travels faster across the grid than the numerical algorithm can communicate it between adjacent nodes. The missing physical data produces unbounded numerical phase errors that trigger instantaneous exponential explosion.

### 10.4.2 The Discrete Lattice Limit: Mass-Spring Networks
In interactive physics engines and soft-body simulators, elastic solids and cloth are modeled as discrete lattices of lumped masses $m$ connected by springs of stiffness $k$ and rest length $\ell_0 = \Delta x$.

The discrete wave speed across such a lattice is derived from the continuum limit of an infinite chain:
$$m \ddot{x}_j = k(x_{j+1} - 2x_j + x_{j-1})$$

Assuming a plane-wave ansatz $x_j(t) = A e^{i(\kappa j \Delta x - \omega t)}$:
$$-m \omega^2 = k (e^{i\kappa \Delta x} - 2 + e^{-i\kappa \Delta x}) = 2k (\cos(\kappa \Delta x) - 1) = -4k \sin^2\left(\frac{\kappa \Delta x}{2}\right)$$
$$\omega(\kappa) = 2 \sqrt{\frac{k}{m}} \left| \sin\left(\frac{\kappa \Delta x}{2}\right) \right|$$

The maximum vibrational frequency across the entire discrete lattice occurs at the Nyquist wavelength $\lambda_{\min} = 2\Delta x$ (where $\kappa_{\max} = \pi / \Delta x$):
$$\omega_{\max} = 2 \sqrt{\frac{k}{m}}$$

For Semi-Implicit Euler or Velocity Verlet, the stability boundary derived in Chapter 6 is $\omega_{\max} \Delta t < 2.0$. Substituting $\omega_{\max}$:
$$\left(2 \sqrt{\frac{k}{m}}\right) \Delta t < 2.0 \implies \Delta t < \sqrt{\frac{m}{k}}$$

This is the canonical discrete CFL limit for physical mass-spring simulation: the timestep must be smaller than the natural period of the highest-frequency mode divided by $\pi$.

---

## 10.5 Multi-Degree-of-Freedom Systems & Gershgorin Circle Theorem

In realistic engineering simulations involving $M$ coupled particles in 2D or 3D, the equations of motion form a coupled second-order system:
$$\mathbf{M} \ddot{\mathbf{x}} + \mathbf{C} \dot{\mathbf{x}} + \mathbf{K} \mathbf{x} = \mathbf{F}_{\text{ext}}$$
where $\mathbf{M}$ is the diagonal mass matrix, $\mathbf{C}$ is the damping matrix, and $\mathbf{K}$ is the symmetric stiffness matrix.

To determine the critical timestep $\Delta t_{\text{crit}} = 2/\omega_{\max}$ without performing an expensive $\mathcal{O}(M^3)$ full matrix eigendecomposition at every tick, we apply **Semyon Gershgorin's Circle Theorem (1931)**.

### 10.5.1 The Gershgorin Bound on Maximum Eigenvalue
Let $\mathbf{A} = \mathbf{M}^{-1} \mathbf{K}$ be the dynamic system matrix. Every eigenvalue $\omega^2$ of $\mathbf{A}$ lies within at least one Gershgorin disc in the complex plane:
$$D_i = \left\{ z \in \mathbb{C} : |z - A_{ii}| \le R_i \right\}, \quad \text{where } R_i = \sum_{j \ne i} |A_{ij}|$$

Because $\mathbf{M}^{-1}\mathbf{K}$ for physical conservative networks is symmetric and positive semi-definite under appropriate mass-weighting, all eigenvalues $\omega_i^2$ are non-negative real numbers. Therefore, the absolute maximum eigenvalue is strictly bounded from above by:
$$\omega_{\max}^2 \le \max_{1 \le i \le N} \left( A_{ii} + \sum_{j \ne i} |A_{ij}| \right)$$

This provides an ultra-fast $\mathcal{O}(M)$ local guarantee: each particle can independently compute its local critical timestep based solely on its own mass and the sum of stiffnesses connected to its immediate incident springs!
$$\Delta t_{\text{crit}} = \min_{1 \le p \le M} \frac{2}{\sqrt{\sum_{e \in \text{edges}(p)} \frac{k_e}{m_p}}}$$

---

## 10.6 Adaptive Time-Stepping and Embedded Runge-Kutta Pairs

When simulating complex multi-scale phenomena (such as a satellite in high elliptical orbit plunging into a dense planetary atmosphere, or billiard balls undergoing near-instantaneous rigid impacts), fixed time-stepping forces an unacceptable compromise: either use an infinitesimally tiny $\Delta t$ everywhere (wasting millions of compute cycles during quiescent motion), or use a larger $\Delta t$ and suffer catastrophic explosive instability during peak acceleration.

Adaptive time-stepping dynamically modulates $\Delta t$ based on local truncation error estimates.

```
       Embedded Runge-Kutta Step Architecture
       
       Input State: y_n, Current Timestep: h
             │
             ├──► Compute Stage Slopes k_1, k_2, ..., k_6 (Shared evaluations)
             │
             ├──► High-Order Candidate: y_{n+1}^{(5)} = y_n + h \sum b_i k_i  [O(h^5)]
             │
             └──► Low-Order Candidate:  y_{n+1}^{(4)} = y_n + h \sum b_i^* k_i [O(h^4)]
                               │
                               ▼
                   Local Error Vector:
                   e_{n+1} = || y_{n+1}^{(5)} - y_{n+1}^{(4)} || = O(h^5)
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          ||e|| ≤ Tol                 ||e|| > Tol
                 │                           │
                 ▼                           ▼
          Accept Step!                Reject Step!
     Advance: y_{n+1} = y^{(5)}       Do NOT advance y_n
     Scale up: h_new > h              Shrink: h_new < h
```

### 10.6.1 The Runge-Kutta-Fehlberg (RKF45) Formulation
Erwin Fehlberg (1969) devised an embedded scheme that produces both a 4th-order and a 5th-order accurate estimate using only **6 function evaluations** per step (sharing the same stage slopes $\mathbf{k}_1, \dots, \mathbf{k}_6$):
$$\mathbf{y}_{n+1}^{(4)} = \mathbf{y}_n + h \sum_{i=1}^6 b_i^* \mathbf{k}_i \quad [\text{Accuracy: } \mathcal{O}(h^4)]$$
$$\mathbf{y}_{n+1}^{(5)} = \mathbf{y}_n + h \sum_{i=1}^6 b_i \mathbf{k}_i \quad [\text{Accuracy: } \mathcal{O}(h^5)]$$

The local truncation error vector $\mathbf{e}_{n+1}$ of the 4th-order solution is directly estimated by the difference between the two solutions:
$$\mathbf{e}_{n+1} = \mathbf{y}_{n+1}^{(5)} - \mathbf{y}_{n+1}^{(4)} = h \sum_{i=1}^6 (b_i - b_i^*) \mathbf{k}_i$$

### 10.6.2 Error Normalization and Step Sizing
Given user-specified absolute tolerance $\text{Tol}_{\text{abs}}$ and relative tolerance $\text{Tol}_{\text{rel}}$, we compute a scalar error norm across all state dimensions:
$$\text{err\_ratio} = \sqrt{\frac{1}{N} \sum_{k=1}^N \left( \frac{|e_{n+1, k}|}{\text{Tol}_{\text{abs}} + \text{Tol}_{\text{rel}} \max(|y_{n, k}|, |y_{n+1, k}|)} \right)^2}$$

The optimal theoretical step size $h_{\text{opt}}$ to achieve an error ratio of exactly $1.0$ scales as:
$$h_{\text{opt}} = h \cdot \left( \frac{1.0}{\text{err\_ratio}} \right)^{\frac{1}{p+1}} = h \cdot (\text{err\_ratio})^{-0.2}$$
where $p = 4$ is the order of the lower estimator.

To prevent erratic step oscillations ("chattering") and avoid infinite loops near singularities, production controllers apply safety clamping:
$$h_{\text{next}} = h \cdot \min\left(s_{\max}, \, \max\left(s_{\min}, \, S \cdot (\text{err\_ratio})^{-0.2}\right)\right)$$
where typical safety constants are:
- Safety factor $S = 0.90$ (targets $90\%$ of the allowed tolerance)
- Minimum shrinkage $s_{\min} = 0.2$ (never cut step size by more than $5\times$ in one tick)
- Maximum growth $s_{\max} = 5.0$ (never expand step size by more than $5\times$ in one tick)

---

## 10.7 Progressive Numerical Worked Examples

---

### Worked Example 10.1: Linearizing a Non-Linear Simple Pendulum
**Problem Statement:** A planar rigid pendulum of length $L = 2.0\text{ m}$ and point mass $m = 1.5\text{ kg}$ oscillates under gravity $g = 9.81\text{ m/s}^2$ without damping. Its non-linear equation of motion is $\ddot{\theta} + \frac{g}{L}\sin\theta = 0$.
1. Reduce the system to a first-order state space $\mathbf{y} = [\theta, \omega]^T$.
2. Find all equilibrium points where $\dot{\mathbf{y}} = \mathbf{0}$.
3. Derive the general continuous Jacobian matrix $\mathbf{J}(\mathbf{y})$.
4. Evaluate $\mathbf{J}$ at the stable hanging equilibrium $\mathbf{y}_1^* = [0, 0]^T$ and at the inverted balance point $\mathbf{y}_2^* = [\pi, 0]^T$.
5. Compute the eigenvalues of $\mathbf{J}$ at both equilibria and classify their linear stability.

**Step-by-Step Mathematical Solution:**

**Step 1: State space reduction.**
Let $y_1 = \theta$ (angular displacement) and $y_2 = \omega = \dot{\theta}$ (angular velocity).
$$\dot{\mathbf{y}} = \begin{bmatrix} \dot{y}_1 \\ \dot{y}_2 \end{bmatrix} = \mathbf{f}(\mathbf{y}) = \begin{bmatrix} y_2 \\ -\frac{g}{L}\sin(y_1) \end{bmatrix}$$

**Step 2: Equilibrium points.**
Setting $\mathbf{f}(\mathbf{y}^*) = \mathbf{0}$:
$$y_2^* = 0, \quad -\frac{g}{L}\sin(y_1^*) = 0 \implies y_1^* = k\pi, \quad k \in \mathbb{Z}$$
The two primary physical equilibria in $[-\pi, \pi]$ are $\mathbf{y}_1^* = [0, 0]^T$ (downward vertical) and $\mathbf{y}_2^* = [\pi, 0]^T$ (upward vertical).

**Step 3: Deriving the Jacobian matrix.**
$$\mathbf{J}(\mathbf{y}) = \begin{bmatrix} \frac{\partial f_1}{\partial y_1} & \frac{\partial f_1}{\partial y_2} \\ \frac{\partial f_2}{\partial y_1} & \frac{\partial f_2}{\partial y_2} \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -\frac{g}{L}\cos(y_1) & 0 \end{bmatrix}$$

With $g/L = 9.81 / 2.0 = 4.905\text{ s}^{-2}$:
$$\mathbf{J}(\mathbf{y}) = \begin{bmatrix} 0 & 1 \\ -4.905\cos(y_1) & 0 \end{bmatrix}$$

**Step 4: Evaluating $\mathbf{J}$ at both equilibria.**
- At $\mathbf{y}_1^* = [0, 0]^T$: $\cos(0) = 1$
  $$\mathbf{J}_1 = \begin{bmatrix} 0 & 1 \\ -4.905 & 0 \end{bmatrix}$$
- At $\mathbf{y}_2^* = [\pi, 0]^T$: $\cos(\pi) = -1$
  $$\mathbf{J}_2 = \begin{bmatrix} 0 & 1 \\ +4.905 & 0 \end{bmatrix}$$

**Step 5: Eigenvalues and stability classification.**
- For $\mathbf{y}_1^*$: $\det(\mathbf{J}_1 - \mu \mathbf{I}) = \mu^2 + 4.905 = 0 \implies \mu = \pm i\sqrt{4.905} \approx \pm 2.2147 i\text{ rad/s}$.
  Because $\text{Re}(\mu) = 0$, the downward hanging state is **marginally (Lyapunov) stable**, exhibiting pure sinusoidal oscillations with natural frequency $\omega_0 = 2.2147\text{ rad/s}$.
- For $\mathbf{y}_2^*$: $\det(\mathbf{J}_2 - \mu \mathbf{I}) = \mu^2 - 4.905 = 0 \implies \mu = \pm \sqrt{4.905} \approx \pm 2.2147\text{ s}^{-1}$.
  Because one eigenvalue has a strictly positive real part ($\mu_1 = +2.2147 > 0$), the inverted pendulum is a **hyperbolic saddle point (linearly unstable)**. Any infinitesimal displacement grows as $e^{+2.2147 t}$.

---

### Worked Example 10.2: Amplification Matrix of Semi-Implicit Euler
**Problem Statement:** A 1D harmonic oscillator with mass $m = 1.0\text{ kg}$ and spring stiffness $k = 100.0\text{ N/m}$ is integrated using Semi-Implicit Euler (Kick-Drift variant):
$$v_{n+1} = v_n - \omega^2 x_n \Delta t$$
$$x_{n+1} = x_n + v_{n+1} \Delta t$$
1. Express this update as a matrix transformation $\mathbf{y}_{n+1} = \mathbf{G}_{\text{SIE}} \mathbf{y}_n$ where $\mathbf{y}_n = [x_n, v_n]^T$.
2. Formulate the characteristic polynomial $\det(\mathbf{G}_{\text{SIE}} - \lambda \mathbf{I}) = 0$.
3. Compute the eigenvalues for $\Delta t = 0.05\text{ s}$ and verify that the spectral radius $\rho(\mathbf{G}_{\text{SIE}}) \equiv 1.0$.

**Step-by-Step Mathematical Solution:**

**Step 1: Constructing the amplification matrix.**
Substitute the velocity update directly into the position update:
$$x_{n+1} = x_n + (v_n - \omega^2 x_n \Delta t)\Delta t = (1 - \omega^2 \Delta t^2)x_n + \Delta t v_n$$
$$v_{n+1} = -\omega^2 \Delta t x_n + v_n$$

In matrix form:
$$\begin{bmatrix} x_{n+1} \\ v_{n+1} \end{bmatrix} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} \begin{bmatrix} x_n \\ v_n \end{bmatrix} \implies \mathbf{G}_{\text{SIE}} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$

**Step 2: Characteristic polynomial.**
$$\det(\mathbf{G}_{\text{SIE}} - \lambda \mathbf{I}) = (1 - \omega^2 \Delta t^2 - \lambda)(1 - \lambda) - (\Delta t)(-\omega^2 \Delta t)$$
$$= \lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + (1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2) = \lambda^2 - (2 - \omega^2 \Delta t^2)\lambda + 1 = 0$$

Notice that the constant coefficient is $\det(\mathbf{G}_{\text{SIE}}) \equiv 1.0$ identically!

**Step 3: Numerical evaluation for $\Delta t = 0.05\text{ s}$.**
Here $\omega^2 = k/m = 100/1 = 100\text{ rad}^2/\text{s}^2$. Thus $\omega = 10\text{ rad/s}$.
$$\Omega \equiv \omega \Delta t = 10 \times 0.05 = 0.50$$
$$\Omega^2 = 0.25$$
The characteristic equation becomes:
$$\lambda^2 - (2 - 0.25)\lambda + 1 = \lambda^2 - 1.75\lambda + 1 = 0$$

Using the quadratic formula:
$$\lambda = \frac{1.75 \pm \sqrt{1.75^2 - 4(1)(1)}}{2} = \frac{1.75 \pm \sqrt{3.0625 - 4.0}}{2} = \frac{1.75 \pm \sqrt{-0.9375}}{2}$$
$$\lambda = 0.8750 \pm i \frac{0.968246}{2} = 0.8750 \pm 0.484123 i$$

Computing the modulus of the complex conjugate eigenvalues:
$$|\lambda| = \sqrt{0.8750^2 + 0.484123^2} = \sqrt{0.765625 + 0.234375} = \sqrt{1.000000} \equiv 1.000000$$
The spectral radius is $\rho(\mathbf{G}_{\text{SIE}}) = 1.000000$. The numerical trajectory circulates on a closed invariant ellipse with zero secular growth and zero artificial damping.

---

### Worked Example 10.3: Derivation of the CFL Critical Timestep
**Problem Statement:** For the mass-spring system in Example 10.2 ($m = 1.0\text{ kg}, k = 100.0\text{ N/m}, \omega = 10.0\text{ rad/s}$):
1. Determine the analytical upper bound $\Delta t_{\text{crit}}$ for stability under Semi-Implicit Euler.
2. Evaluate the eigenvalues and spectral radius at $\Delta t_1 = 0.18\text{ s}$ (below threshold) and $\Delta t_2 = 0.22\text{ s}$ (above threshold).
3. Compute the position after $n = 50$ steps starting from $[x_0, v_0] = [1.0, 0.0]$ for both timesteps.

**Step-by-Step Mathematical Solution:**

**Step 1: Analytical threshold.**
From the characteristic polynomial $\lambda^2 - (2 - \Omega^2)\lambda + 1 = 0$, the discriminant is:
$$\mathcal{D} = (2 - \Omega^2)^2 - 4 = 4 - 4\Omega^2 + \Omega^4 - 4 = \Omega^2(\Omega^2 - 4)$$
For stability, eigenvalues must remain complex conjugates with modulus 1, which strictly requires $\mathcal{D} < 0$:
$$\Omega^2 - 4 < 0 \implies \Omega < 2.0 \implies \omega \Delta t < 2.0$$
$$\Delta t_{\text{crit}} = \frac{2}{\omega} = \frac{2}{10.0} = 0.200\text{ s}$$

**Step 2: Eigenvalue analysis at sub- and super-critical timesteps.**
- Case A: $\Delta t_1 = 0.18\text{ s} < 0.20\text{ s}$.
  $$\Omega = 10.0 \times 0.18 = 1.80 \implies \Omega^2 = 3.24$$
  $$\lambda^2 - (2 - 3.24)\lambda + 1 = \lambda^2 + 1.24\lambda + 1 = 0$$
  $$\mathcal{D} = 1.24^2 - 4 = 1.5376 - 4 = -2.4624 < 0$$
  $$\lambda = -0.6200 \pm i \frac{\sqrt{2.4624}}{2} = -0.6200 \pm 0.7846 i$$
  $$|\lambda| = \sqrt{(-0.62)^2 + 0.7846^2} = \sqrt{0.3844 + 0.6156} = 1.000 \implies \text{Stable!}$$

- Case B: $\Delta t_2 = 0.22\text{ s} > 0.20\text{ s}$.
  $$\Omega = 10.0 \times 0.22 = 2.20 \implies \Omega^2 = 4.84$$
  $$\lambda^2 - (2 - 4.84)\lambda + 1 = \lambda^2 + 2.84\lambda + 1 = 0$$
  $$\mathcal{D} = 2.84^2 - 4 = 8.0656 - 4 = +4.0656 > 0 \implies \text{Real roots!}$$
  $$\lambda = \frac{-2.84 \pm \sqrt{4.0656}}{2} = \frac{-2.84 \pm 2.01633}{2}$$
  $$\lambda_1 = \frac{-2.84 - 2.01633}{2} = -2.4282$$
  $$\lambda_2 = \frac{-2.84 + 2.01633}{2} = -0.4118$$
  The dominant eigenvalue is $\lambda_1 = -2.4282$. Its modulus is:
  $$\rho(\mathbf{G}) = |\lambda_1| = 2.4282 > 1.0 \implies \text{Violent exponential instability!}$$

**Step 3: State evolution after 50 steps.**
- For $\Delta t_1 = 0.18\text{ s}$ ($t = 9.0\text{ s}$):
  $|\lambda|^n = 1.0^{50} = 1.0$. The position oscillates cleanly within bounded envelope $[-1.25, +1.25]\text{ m}$.
- For $\Delta t_2 = 0.22\text{ s}$ ($t = 11.0\text{ s}$):
  The dominant mode grows by factor:
  $$\lambda_1^{50} = (-2.4282)^{50} \approx +3.85 \times 10^{19}$$
  Starting from $x_0 = 1.0\text{ m}$, after just 50 ticks the calculated position is on the order of $\approx 10^{19}\text{ meters}$ (exceeding the distance to the edge of the observable universe).

---

### Worked Example 10.4: Spectral Radius Comparison Across Three Timesteps for Forward Euler
**Problem Statement:** Consider the same harmonic oscillator ($\omega = 10\text{ rad/s}$) integrated via Forward Euler:
$$\mathbf{G}_{\text{FE}} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$
1. Find the eigenvalues of $\mathbf{G}_{\text{FE}}$ in terms of $\Omega = \omega \Delta t$.
2. Compute the spectral radius $\rho(\mathbf{G}_{\text{FE}})$ for $\Delta t = 0.01\text{ s}, 0.05\text{ s}, 0.10\text{ s}$.
3. Calculate the energy amplification factor $E_n / E_0 = \rho^{2n}$ after $n = 100$ steps for each case.

**Step-by-Step Mathematical Solution:**

**Step 1: Eigenvalues of Forward Euler.**
$$\det(\mathbf{G}_{\text{FE}} - \lambda \mathbf{I}) = (1 - \lambda)^2 - (\Delta t)(-\omega^2 \Delta t) = (1 - \lambda)^2 + \omega^2 \Delta t^2 = 0$$
$$(1 - \lambda)^2 = -\Omega^2 \implies 1 - \lambda = \pm i\Omega \implies \lambda = 1 \pm i\Omega$$
The modulus of both complex eigenvalues is:
$$|\lambda| = \sqrt{1^2 + \Omega^2} = \sqrt{1 + \omega^2 \Delta t^2}$$
Thus $\rho(\mathbf{G}_{\text{FE}}) = \sqrt{1 + \omega^2 \Delta t^2}$. Because $\omega > 0$ and $\Delta t > 0$, $\rho > 1.0$ unconditionally!

**Step 2: Numerical evaluation across timesteps.**
- Step size 1: $\Delta t = 0.01\text{ s} \implies \Omega = 10 \times 0.01 = 0.10$.
  $$\rho_1 = \sqrt{1 + 0.10^2} = \sqrt{1.01} \approx 1.00498756$$
- Step size 2: $\Delta t = 0.05\text{ s} \implies \Omega = 10 \times 0.05 = 0.50$.
  $$\rho_2 = \sqrt{1 + 0.50^2} = \sqrt{1.25} \approx 1.11803399$$
- Step size 3: $\Delta t = 0.10\text{ s} \implies \Omega = 10 \times 0.10 = 1.00$.
  $$\rho_3 = \sqrt{1 + 1.00^2} = \sqrt{2.00} \approx 1.41421356$$

**Step 3: Energy growth after $n = 100$ steps.**
Physical mechanical energy $E \propto x^2 + v^2/\omega^2 \propto \|\mathbf{y}\|^2$. Because state amplitude grows by $\rho$ each step, energy grows by $\rho^2 = 1 + \Omega^2$ per tick. Over $n$ steps:
$$\frac{E_n}{E_0} = (\rho^2)^n = (1 + \Omega^2)^n$$
- For $\Delta t = 0.01\text{ s}$ ($t = 1.0\text{ s}$):
  $$E_{100}/E_0 = (1.01)^{100} \approx 2.7048 \quad (\text{Energy increases by } +170\%)$$
- For $\Delta t = 0.05\text{ s}$ ($t = 5.0\text{ s}$):
  $$E_{100}/E_0 = (1.25)^{100} \approx 4.903 \times 10^9 \quad (\text{Energy multiplied by } 4.9\text{ billion})$$
- For $\Delta t = 0.10\text{ s}$ ($t = 10.0\text{ s}$):
  $$E_{100}/E_0 = (2.00)^{100} \approx 1.2676 \times 10^{30} \quad (\text{Catastrophic floating-point explosion})$$

---

### Worked Example 10.5: Continuum Acoustic CFL Limit for a 1D Elastic Bar
**Problem Statement:** An aluminum structural beam is discretized into a 1D grid with spatial node spacing $\Delta x = 0.02\text{ m}$. Aluminum has Young's modulus $E = 70.0\times 10^9\text{ Pa}$ and density $\rho_m = 2700\text{ kg/m}^3$.
1. Compute the longitudinal acoustic wave speed $c = \sqrt{E/\rho_m}$.
2. Determine the maximum allowable simulation timestep $\Delta t_{\text{max}}$ satisfying the 1D CFL condition $C \le 1.0$.
3. If an engineer runs the simulation at $\Delta t = 5.0\times 10^{-6}\text{ s}$, compute the Courant number $C$ and state whether the run is stable.

**Step-by-Step Mathematical Solution:**

**Step 1: Acoustic wave speed.**
$$c = \sqrt{\frac{E}{\rho_m}} = \sqrt{\frac{70.0 \times 10^9\text{ N/m}^2}{2700\text{ kg/m}^3}} = \sqrt{25,925,925.93\text{ m}^2/\text{s}^2} \approx 5091.75\text{ m/s}$$

**Step 2: Maximum allowable timestep.**
Applying the Courant-Friedrichs-Lewy criterion:
$$C = \frac{c \Delta t}{\Delta x} \le 1.0 \implies \Delta t \le \frac{\Delta x}{c}$$
$$\Delta t_{\text{max}} = \frac{0.02\text{ m}}{5091.75\text{ m/s}} \approx 3.9279 \times 10^{-6}\text{ s} = 3.928\ \mu\text{s}$$

**Step 3: Verification of engineer's timestep.**
The proposed timestep is $\Delta t = 5.0\times 10^{-6}\text{ s} = 5.0\ \mu\text{s}$.
$$C = \frac{(5091.75\text{ m/s})(5.0 \times 10^{-6}\text{ s})}{0.02\text{ m}} = \frac{0.025459\text{ m}}{0.02\text{ m}} = 1.273$$
Because $C = 1.273 > 1.0$, numerical domain of dependence fails to cover the physical wave cone. The simulation will experience high-frequency spatial aliasing and blow up exponentially within tens of steps.

---

### Worked Example 10.6: Complex Stability Boundary Mapping for RK4
**Problem Statement:** A damped oscillator has continuous Jacobian eigenvalue $\mu = -2.0 + 30.0 i\text{ s}^{-1}$. An engineer integrates the system using Classical RK4 with timestep $\Delta t = 0.08\text{ s}$.
1. Compute the dimensionless complex step parameter $z = \mu \Delta t$.
2. Evaluate the scalar RK4 stability polynomial $R(z) = 1 + z + \frac{z^2}{2} + \frac{z^3}{6} + \frac{z^4}{24}$.
3. Calculate the magnitude $|R(z)|$ and determine if this specific step size is numerically stable.

**Step-by-Step Mathematical Solution:**

**Step 1: Complex parameter $z$.**
$$z = \mu \Delta t = (-2.0 + 30.0 i)(0.08) = -0.16 + 2.40 i$$

**Step 2: Powers of $z$ and polynomial evaluation.**
Let $x = -0.16$ and $y = 2.40$:
$$z = -0.16 + 2.40 i$$
$$z^2 = (-0.16 + 2.40 i)^2 = 0.16^2 - 2.40^2 + 2(-0.16)(2.40)i = 0.0256 - 5.7600 - 0.7680 i = -5.7344 - 0.7680 i$$
$$z^3 = z^2 \cdot z = (-5.7344 - 0.7680 i)(-0.16 + 2.40 i)$$
$$= [(-5.7344)(-0.16) - (-0.7680)(2.40)] + [(-5.7344)(2.40) + (-0.7680)(-0.16)] i$$
$$= [0.917504 + 1.843200] + [-13.762560 + 0.122880] i = 2.760704 - 13.639680 i$$
$$z^4 = (z^2)^2 = (-5.7344 - 0.7680 i)^2 = (-5.7344)^2 - (-0.7680)^2 + 2(-5.7344)(-0.7680)i$$
$$= 32.883343 - 0.589824 + 8.808038 i = 32.293519 + 8.808038 i$$

Now dividing by factorials:
$$\frac{z^2}{2} = -2.867200 - 0.384000 i$$
$$\frac{z^3}{6} = 0.460117 - 2.273280 i$$
$$\frac{z^4}{24} = 1.345563 + 0.367002 i$$

Summing the terms:
$$R(z) = 1 + (-0.16 + 2.40 i) + (-2.867200 - 0.384000 i) + (0.460117 - 2.273280 i) + (1.345563 + 0.367002 i)$$
$$\text{Re}(R) = 1.0 - 0.16 - 2.867200 + 0.460117 + 1.345563 = -0.221520$$
$$\text{Im}(R) = 2.40 - 0.384000 - 2.273280 + 0.367002 = +0.109722$$

**Step 3: Calculating magnitude $|R(z)|$.**
$$|R(z)| = \sqrt{(-0.221520)^2 + (0.109722)^2} = \sqrt{0.049071 + 0.012039} = \sqrt{0.061110} \approx 0.2472$$
Because $|R(z)| = 0.2472 \ll 1.0$, the point $z = -0.16 + 2.40 i$ lies securely inside the RK4 stability domain. The numerical solution is **highly stable** and properly damps the physical perturbation.

---

### Worked Example 10.7: Maximum Eigenvalue Estimation via Gershgorin Circle Theorem
**Problem Statement:** A 3-particle 1D coupled spring system consists of identical masses $m_1 = m_2 = m_3 = 0.25\text{ kg}$. The masses are connected in series between rigid walls by four springs with spring constants $k_1 = 400\text{ N/m}, k_2 = 800\text{ N/m}, k_3 = 800\text{ N/m}, k_4 = 400\text{ N/m}$.
1. Formulate the $3 \times 3$ system matrix $\mathbf{A} = \mathbf{M}^{-1}\mathbf{K}$.
2. Construct the Gershgorin discs for each row of $\mathbf{A}$.
3. Determine the upper bound on $\omega_{\max}^2$ and compute the conservative stability timestep $\Delta t_{\text{crit}}$ for Velocity Verlet.

**Step-by-Step Mathematical Solution:**

**Step 1: Constructing matrix $\mathbf{A} = \mathbf{M}^{-1}\mathbf{K}$.**
The stiffness matrix $\mathbf{K}$ from Newton's second law:
- For particle 1: $m_1 \ddot{x}_1 = -k_1 x_1 - k_2(x_1 - x_2) = -(k_1 + k_2)x_1 + k_2 x_2 = -1200 x_1 + 800 x_2$
- For particle 2: $m_2 \ddot{x}_2 = -k_2(x_2 - x_1) - k_3(x_2 - x_3) = 800 x_1 - 1600 x_2 + 800 x_3$
- For particle 3: $m_3 \ddot{x}_3 = -k_3(x_3 - x_2) - k_4 x_3 = 800 x_2 - 1200 x_3$

Dividing each row by mass $m = 0.25\text{ kg}$ (which scales by $1/0.25 = 4.0$):
$$\mathbf{A} = \begin{bmatrix} 4800 & -3200 & 0 \\ -3200 & 6400 & -3200 \\ 0 & -3200 & 4800 \end{bmatrix}$$

**Step 2: Constructing Gershgorin discs.**
For row $i$, the center is $c_i = A_{ii}$ and radius is $R_i = \sum_{j \ne i} |A_{ij}|$:
- Disc 1: Center $c_1 = 4800$, Radius $R_1 = |-3200| + 0 = 3200$.
  Interval: $[4800 - 3200, 4800 + 3200] = [1600, 8000]\text{ s}^{-2}$.
- Disc 2: Center $c_2 = 6400$, Radius $R_2 = |-3200| + |-3200| = 6400$.
  Interval: $[6400 - 6400, 6400 + 6400] = [0, 12800]\text{ s}^{-2}$.
- Disc 3: Center $c_3 = 4800$, Radius $R_3 = 0 + |-3200| = 3200$.
  Interval: $[4800 - 3200, 4800 + 3200] = [1600, 8000]\text{ s}^{-2}$.

**Step 3: Upper bound and critical timestep.**
The union of all three discs spans $[0, 12800]\text{ s}^{-2}$. Therefore:
$$\omega_{\max}^2 \le 12800\text{ rad}^2/\text{s}^2 \implies \omega_{\max} \le \sqrt{12800} \approx 113.137\text{ rad/s}$$

For Velocity Verlet, the stability boundary is $\omega_{\max} \Delta t < 2.0$:
$$\Delta t_{\text{crit}} = \frac{2}{\omega_{\max}} \ge \frac{2}{113.137\text{ s}^{-1}} \approx 0.01768\text{ s} \approx 17.68\text{ ms}$$
Selecting $\Delta t \le 17.6\text{ ms}$ guarantees absolute numerical stability without computing exact cubic roots.

---

### Worked Example 10.8: Embedded RKF45 Local Error Estimation
**Problem Statement:** An autonomous rover accelerates under a non-linear velocity-dependent thrust model $\dot{v} = 10.0 - 0.1 v^2$ with current velocity $v_n = 5.0\text{ m/s}$ at $t = 0$. An embedded RKF45 step is executed with trial timestep $h = 0.20\text{ s}$.
The computed stage derivatives are:
- $k_1 = 7.5000\text{ m/s}^2$
- $k_2 = 7.3750\text{ m/s}^2$
- $k_3 = 7.3400\text{ m/s}^2$
- $k_4 = 7.2100\text{ m/s}^2$
- $k_5 = 7.1500\text{ m/s}^2$
- $k_6 = 7.2800\text{ m/s}^2$

The Fehlberg error difference weights $e_i = b_i^{(5)} - b_i^{(4)}$ are:
$e_1 = \frac{1}{360}, e_2 = 0, e_3 = -\frac{128}{4275}, e_4 = -\frac{2197}{75240}, e_5 = \frac{1}{50}, e_6 = \frac{2}{55}$.
1. Compute the local truncation error estimate $\hat{e}_{n+1} = h \sum_{i=1}^6 e_i k_i$.
2. Given tolerance $\text{Tol} = 1.0\times 10^{-4}\text{ m/s}$, evaluate the error ratio $\text{err\_ratio} = |\hat{e}_{n+1}| / \text{Tol}$.
3. State whether the step is accepted, and compute the proposed next timestep $h_{\text{new}}$ using safety factor $S = 0.90$.

**Step-by-Step Mathematical Solution:**

**Step 1: Computing error estimate.**
Decimal values of the error weights:
- $e_1 = 1/360 \approx +0.00277778$
- $e_2 = 0$
- $e_3 = -128/4275 \approx -0.02994152$
- $e_4 = -2197/75240 \approx -0.02919989$
- $e_5 = 1/50 = +0.02000000$
- $e_6 = 2/55 \approx +0.03636364$

Multiplying by stage slopes $k_i$:
- $e_1 k_1 = (+0.00277778)(7.5000) = +0.0208333$
- $e_2 k_2 = 0$
- $e_3 k_3 = (-0.02994152)(7.3400) = -0.2197708$
- $e_4 k_4 = (-0.02919989)(7.2100) = -0.2105312$
- $e_5 k_5 = (+0.02000000)(7.1500) = +0.1430000$
- $e_6 k_6 = (+0.03636364)(7.2800) = +0.2647273$

Summing all contributions:
$$\sum_{i=1}^6 e_i k_i = 0.0208333 - 0.2197708 - 0.2105312 + 0.1430000 + 0.2647273 = -0.0017414\text{ m/s}^2$$
Now multiplying by step size $h = 0.20\text{ s}$:
$$\hat{e}_{n+1} = (0.20\text{ s})(-0.0017414\text{ m/s}^2) = -3.4828 \times 10^{-4}\text{ m/s}$$
$$|\hat{e}_{n+1}| \approx 3.483 \times 10^{-4}\text{ m/s}$$

**Step 2: Error ratio.**
$$\text{err\_ratio} = \frac{|\hat{e}_{n+1}|}{\text{Tol}} = \frac{3.4828 \times 10^{-4}}{1.0 \times 10^{-4}} = 3.4828$$

**Step 3: Step acceptance and step resizing.**
Because $\text{err\_ratio} = 3.4828 > 1.0$, the step **exceeds allowable tolerance and is REJECTED**. The state must not advance.
We compute the reduced timestep $h_{\text{new}}$:
$$h_{\text{new}} = h \cdot S \cdot (\text{err\_ratio})^{-0.2} = 0.20 \times 0.90 \times (3.4828)^{-0.2}$$
$$(3.4828)^{0.2} \approx 1.2834 \implies (3.4828)^{-0.2} \approx 0.7792$$
$$h_{\text{new}} = 0.18 \times 0.7792 \approx 0.14025\text{ s}$$
The simulator discards the candidate step and re-attempts the integration from $t = 0$ with $h = 0.140\text{ s}$.

---

### Worked Example 10.9: Proportional-Integral (PI) Step Size Controller
**Problem Statement:** Standard I-controllers ($h_{\text{new}} = h(\text{Tol}/e)^{1/(p+1)}$) can exhibit high step variance and chattering. A Proportional-Integral (PI) step controller uses both current error and prior step error:
$$h_{n+1} = h_n \left(\frac{\text{Tol}}{e_n}\right)^{k_P} \left(\frac{e_{n-1}}{\text{Tol}}\right)^{k_I}$$
where $k_P = 0.6 / (p+1) = 0.12$ and $k_I = 0.4 / (p+1) = 0.08$ for a 4th-order method ($p=4$).
Given $\text{Tol} = 1.0\times 10^{-5}$:
- Step $n-1$: accepted with error $e_{n-1} = 0.8\times 10^{-5}$ and $h_{n-1} = 0.05\text{ s}$.
- Step $n$: evaluated with $h_n = 0.05\text{ s}$ producing error $e_n = 0.4\times 10^{-5}$.
1. Compute the PI scaling factor.
2. Determine $h_{n+1}$.
3. Compare with the standard I-controller proposal.

**Step-by-Step Mathematical Solution:**

**Step 1: PI scaling factor.**
Compute the ratios:
$$\frac{\text{Tol}}{e_n} = \frac{1.0 \times 10^{-5}}{0.4 \times 10^{-5}} = 2.50$$
$$\frac{e_{n-1}}{\text{Tol}} = \frac{0.8 \times 10^{-5}}{1.0 \times 10^{-5}} = 0.80$$

Applying the powers:
$$\left(\frac{\text{Tol}}{e_n}\right)^{k_P} = (2.50)^{0.12} \approx 1.11612$$
$$\left(\frac{e_{n-1}}{\text{Tol}}\right)^{k_I} = (0.80)^{0.08} \approx 0.98231$$

Multiplying both terms:
$$\text{Scale}_{\text{PI}} = 1.11612 \times 0.98231 \approx 1.09638$$

**Step 2: Proposing $h_{n+1}$.**
$$h_{n+1} = h_n \times \text{Scale}_{\text{PI}} = 0.05\text{ s} \times 1.09638 \approx 0.05482\text{ s}$$

**Step 3: Comparison with pure I-controller.**
A standard pure I-controller would compute:
$$\text{Scale}_{\text{I}} = \left(\frac{\text{Tol}}{e_n}\right)^{0.20} = (2.50)^{0.20} \approx 1.20112$$
$$h_{\text{I}} = 0.05 \times 1.20112 \approx 0.06006\text{ s}$$
*Analysis:* The pure I-controller aggressively expands the step by $+20.1\%$ because the current step was very clean ($e_n = 0.4 \text{Tol}$). However, the PI-controller recognizes that the previous step was relatively close to the limit ($e_{n-1} = 0.8 \text{Tol}$), so it acts conservatively, expanding by only $+9.6\%$. This effectively dampens step oscillations and prevents step rejection on subsequent ticks.

---

### Worked Example 10.10: Reconstructing High-Frequency Lattice Explosion
**Problem Statement:** A 2-node mass-spring model ($m = 0.1\text{ kg}, k = 1000\text{ N/m}$) has natural frequency $\omega = \sqrt{1000/0.1} = 100\text{ rad/s}$. The critical timestep for Semi-Implicit Euler is $\Delta t_{\text{crit}} = 2/\omega = 0.020\text{ s}$.
A programmer mistakenly sets $\Delta t = 0.025\text{ s}$ ($25\%$ beyond stability boundary).
1. Compute the state transition matrix $\mathbf{G}$.
2. Perform exactly 4 explicit numerical update steps starting from $x_0 = 0.01\text{ m}, v_0 = 0.0\text{ m/s}$.
3. Observe the sign-alternating explosive divergence.

**Step-by-Step Mathematical Solution:**

**Step 1: State transition matrix.**
$$\omega^2 = 10000\text{ s}^{-2}, \quad \Delta t = 0.025\text{ s}$$
$$\omega^2 \Delta t = 10000 \times 0.025 = 250\text{ s}^{-1}$$
$$\omega^2 \Delta t^2 = 250 \times 0.025 = 6.25$$

Under Semi-Implicit Euler:
$$v_{n+1} = v_n - (\omega^2 \Delta t) x_n = v_n - 250 x_n$$
$$x_{n+1} = x_n + \Delta t v_{n+1} = x_n + 0.025 v_{n+1}$$

**Step 2: Performing 4 discrete updates.**

- **Step 1 ($t = 0.025\text{ s}$):**
  $$v_1 = v_0 - 250 x_0 = 0.0 - 250(0.01) = -2.50\text{ m/s}$$
  $$x_1 = x_0 + 0.025 v_1 = 0.01 + 0.025(-2.50) = 0.01 - 0.0625 = -0.0525\text{ m}$$

- **Step 2 ($t = 0.050\text{ s}$):**
  $$v_2 = v_1 - 250 x_1 = -2.50 - 250(-0.0525) = -2.50 + 13.125 = +10.625\text{ m/s}$$
  $$x_2 = x_1 + 0.025 v_2 = -0.0525 + 0.025(10.625) = -0.0525 + 0.265625 = +0.213125\text{ m}$$

- **Step 3 ($t = 0.075\text{ s}$):**
  $$v_3 = v_2 - 250 x_2 = 10.625 - 250(0.213125) = 10.625 - 53.28125 = -42.65625\text{ m/s}$$
  $$x_3 = x_2 + 0.025 v_3 = 0.213125 + 0.025(-42.65625) = 0.213125 - 1.066406 = -0.853281\text{ m}$$

- **Step 4 ($t = 0.100\text{ s}$):**
  $$v_4 = v_3 - 250 x_3 = -42.65625 - 250(-0.853281) = -42.65625 + 213.32025 = +170.664\text{ m/s}$$
  $$x_4 = x_3 + 0.025 v_4 = -0.853281 + 0.025(170.664) = -0.853281 + 4.2666 = +3.4133\text{ m}$$

**Step 3: Physical diagnostic.**
Look at the sequence of position coordinates:
$$x_0 = +0.010\text{ m} \to x_1 = -0.0525\text{ m} \to x_2 = +0.2131\text{ m} \to x_3 = -0.8533\text{ m} \to x_4 = +3.4133\text{ m}$$
Notice two hallmarks of supercritical linear instability:
1. **Sign Alternation:** Each step flips sign perfectly ($\text{positive} \to \text{negative} \to \text{positive} \to \text{negative}$) because the dominant eigenvalue is a negative real number ($\lambda_1 = \frac{-(6.25 - 2) - \sqrt{4.25^2 - 4}}{2} \approx -4.0$).
2. **Geometric Growth Rate:** The amplitude grows by a factor of $\approx 4.0\times$ on every single step. In fewer than 20 simulation steps, the particle exceeds $10^9\text{ meters}$, triggering an immediate NaN crash.

---

## 10.8 Chapter Mastery Exercises

### Exercise 10.1 (Tier 1): Harmonic Oscillator Eigenvalues
A simple harmonic oscillator has mass $m = 2.0\text{ kg}$ and spring stiffness $k = 32.0\text{ N/m}$. Calculate:
1. The natural angular frequency $\omega_0$.
2. The continuous Jacobian eigenvalues $\mu_{1,2}$.
3. The critical timestep $\Delta t_{\text{crit}}$ for Semi-Implicit Euler.

### Exercise 10.2 (Tier 1): Forward Euler Energy Growth
For the oscillator in Exercise 10.1, compute the per-step energy growth factor $(1 + \omega_0^2 \Delta t^2)$ when integrated with Forward Euler at $\Delta t = 0.02\text{ s}$. How many steps are required for the mechanical energy to double?

### Exercise 10.3 (Tier 2): Trapezoidal Method Symplectic Invariant
Prove algebraically that for any linear undamped oscillator $\dot{x} = v, \dot{v} = -\omega^2 x$, the amplification matrix $\mathbf{G}_{\text{Trap}}$ of the implicit trapezoidal rule satisfies $\det(\mathbf{G}_{\text{Trap}}) \equiv 1.0$ for all timesteps $\Delta t > 0$.

### Exercise 10.4 (Tier 2): Grid Acoustic CFL Calculation
A 2D finite-difference seismic simulation models granite bedrock with density $\rho = 2600\text{ kg/m}^3$ and bulk modulus $K = 41.6\text{ GPa}$. The spatial cell size is $\Delta x = \Delta y = 5.0\text{ m}$. In 2D, the CFL condition is $c \Delta t \sqrt{\frac{1}{\Delta x^2} + \frac{1}{\Delta y^2}} \le 1.0$. Calculate the maximum allowable timestep $\Delta t_{\max}$.

### Exercise 10.5 (Tier 3): Damped Oscillator Stability Locus
A damped oscillator satisfies $\ddot{x} + 2\gamma \dot{x} + \omega_0^2 x = 0$ with damping coefficient $\gamma = 1.0\text{ s}^{-1}$ and natural frequency $\omega_0 = 5.0\text{ rad/s}$.
1. Find the continuous complex eigenvalues $\mu_{1,2}$.
2. For timestep $\Delta t = 0.1\text{ s}$, compute $z = \mu \Delta t$.
3. Check whether $z$ falls inside the Forward Euler stability disc $|1 + z| \le 1$.

### Exercise 10.6 (Tier 3): Stability Boundary of 2nd-Order Explicit Runge-Kutta (Heun's Method)
The stability function of Heun's second-order method is $R(z) = 1 + z + \frac{z^2}{2}$. For an undamped oscillator where $z = i \beta = i \omega \Delta t$:
1. Formulate $|R(i\beta)|^2$ as a function of $\beta$.
2. Prove that $|R(i\beta)| > 1.0$ for all non-zero $\beta > 0$.
3. Explain why Heun's method cannot stably integrate undamped orbital mechanics.

### Exercise 10.7 (Tier 4): Gershgorin Bound on a 4-Particle Ring
Four identical particles of mass $m = 0.5\text{ kg}$ are arranged in a closed periodic ring connected by four identical springs of stiffness $k = 500\text{ N/m}$.
1. Write down the $4 \times 4$ system matrix $\mathbf{A} = \mathbf{M}^{-1}\mathbf{K}$.
2. Use Gershgorin's Circle Theorem to establish an analytical upper bound on $\omega_{\max}^2$.
3. Compute the maximum allowable timestep $\Delta t_{\text{crit}}$ for Velocity Verlet.

### Exercise 10.8 (Tier 4): Backward Euler High-Frequency Damping
For a stiff physical mode with $\omega = 1000\text{ rad/s}$, compute the spectral radius $\rho(\mathbf{G}_{\text{BE}})$ under Backward Euler with $\Delta t = 0.01\text{ s}$. What fraction of the mode's initial amplitude remains after 5 steps?

### Exercise 10.9 (Tier 5): Step Rejection and Recovery in Adaptive Integration
An adaptive integrator using RKF45 with tolerance $\text{Tol} = 10^{-4}$ is executing at $h = 0.08\text{ s}$. A sudden contact collision causes the local truncation error to spike to $\|\mathbf{e}\| = 2.5\times 10^{-2}$.
1. Compute the raw error ratio.
2. Determine the optimal reduced timestep $h_{\text{new}}$ using safety factor $S = 0.90$.
3. If the controller enforces a hard minimum step shrinkage factor $s_{\min} = 0.20$, what is the actual timestep applied for the retry?

### Exercise 10.10 (Tier 5): Analytical Proof of Symplectic Euler CFL Threshold
Given the characteristic equation of Semi-Implicit Euler $\lambda^2 - (2 - \Omega^2)\lambda + 1 = 0$ with $\Omega = \omega \Delta t$:
1. Analytically solve for the roots $\lambda_{1,2}$ when $\Omega = 2.0$ (the exact boundary).
2. Analytically solve for $\lambda_{1,2}$ when $\Omega = 2.05$.
3. Show that the product $\lambda_1 \lambda_2 \equiv 1$ holds for all $\Omega$, and explain why this guarantees that whenever one root is real and has $|\lambda_1| < 1$, the other root *must* have $|\lambda_2| > 1$.

---

## 10.9 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 10.1
1. **Natural frequency:**
   $$\omega_0 = \sqrt{\frac{k}{m}} = \sqrt{\frac{32.0}{2.0}} = \sqrt{16.0} = 4.0\text{ rad/s}$$
2. **Continuous Jacobian eigenvalues:**
   $$\mu = \pm i\omega_0 = \pm 4.0 i\text{ s}^{-1}$$
3. **Critical timestep for Semi-Implicit Euler:**
   $$\omega_0 \Delta t_{\text{crit}} < 2.0 \implies \Delta t_{\text{crit}} = \frac{2.0}{4.0\text{ rad/s}} = 0.50\text{ s}$$

---

### Solution to Exercise 10.2
With $\omega_0 = 4.0\text{ rad/s}$ and $\Delta t = 0.02\text{ s}$:
$$\Omega = \omega_0 \Delta t = 4.0 \times 0.02 = 0.08$$
$$\text{Per-step energy amplification} = 1 + \Omega^2 = 1 + 0.08^2 = 1 + 0.0064 = 1.0064$$

To find steps $n$ to double energy:
$$(1.0064)^n = 2.0 \implies n \ln(1.0064) = \ln(2.0)$$
$$n = \frac{0.693147}{0.0063796} \approx 108.65 \implies 109\text{ steps}$$
At $0.02\text{ s}$ per step, mechanical energy doubles artificially every $2.18\text{ seconds}$.

---

### Solution to Exercise 10.3
The implicit trapezoidal update for $\dot{x} = v, \dot{v} = -\omega^2 x$ is:
$$x_{n+1} = x_n + \frac{\Delta t}{2}(v_n + v_{n+1})$$
$$v_{n+1} = v_n - \frac{\omega^2 \Delta t}{2}(x_n + x_{n+1})$$

In matrix form:
$$\begin{bmatrix} 1 & -\frac{\Delta t}{2} \\ \frac{\omega^2 \Delta t}{2} & 1 \end{bmatrix} \begin{bmatrix} x_{n+1} \\ v_{n+1} \end{bmatrix} = \begin{bmatrix} 1 & \frac{\Delta t}{2} \\ -\frac{\omega^2 \Delta t}{2} & 1 \end{bmatrix} \begin{bmatrix} x_n \\ v_n \end{bmatrix}$$
Let $\mathbf{A}_L = \begin{bmatrix} 1 & -\frac{\Delta t}{2} \\ \frac{\omega^2 \Delta t}{2} & 1 \end{bmatrix}$ and $\mathbf{A}_R = \begin{bmatrix} 1 & \frac{\Delta t}{2} \\ -\frac{\omega^2 \Delta t}{2} & 1 \end{bmatrix}$.
Then $\mathbf{G}_{\text{Trap}} = \mathbf{A}_L^{-1} \mathbf{A}_R$.
Using determinant multiplication laws:
$$\det(\mathbf{G}_{\text{Trap}}) = \frac{\det(\mathbf{A}_R)}{\det(\mathbf{A}_L)}$$
$$\det(\mathbf{A}_L) = (1)(1) - \left(-\frac{\Delta t}{2}\right)\left(\frac{\omega^2 \Delta t}{2}\right) = 1 + \frac{\omega^2 \Delta t^2}{4}$$
$$\det(\mathbf{A}_R) = (1)(1) - \left(\frac{\Delta t}{2}\right)\left(-\frac{\omega^2 \Delta t}{2}\right) = 1 + \frac{\omega^2 \Delta t^2}{4}$$
Therefore:
$$\det(\mathbf{G}_{\text{Trap}}) = \frac{1 + \frac{\omega^2 \Delta t^2}{4}}{1 + \frac{\omega^2 \Delta t^2}{4}} \equiv 1.0 \quad \forall \Delta t > 0$$
Phase-space volume is identically preserved for all timesteps.

---

### Solution to Exercise 10.4
1. **Acoustic wave speed:**
   $$c = \sqrt{\frac{K}{\rho}} = \sqrt{\frac{41.6 \times 10^9\text{ Pa}}{2600\text{ kg/m}^3}} = \sqrt{16,000,000\text{ m}^2/\text{s}^2} = 4000\text{ m/s}$$
2. **2D CFL condition:**
   $$c \Delta t \sqrt{\frac{1}{\Delta x^2} + \frac{1}{\Delta y^2}} \le 1.0$$
   With $\Delta x = \Delta y = 5.0\text{ m}$:
   $$\sqrt{\frac{1}{25} + \frac{1}{25}} = \sqrt{\frac{2}{25}} = \frac{\sqrt{2}}{5} \approx 0.28284\text{ m}^{-1}$$
   $$\Delta t \le \frac{1}{c \times 0.28284} = \frac{5.0}{4000 \times \sqrt{2}} = \frac{5.0}{5656.85} \approx 8.8388 \times 10^{-4}\text{ s} \approx 0.884\text{ ms}$$

---

### Solution to Exercise 10.5
1. **Continuous eigenvalues:**
   Characteristic equation: $\mu^2 + 2\gamma \mu + \omega_0^2 = \mu^2 + 2\mu + 25 = 0$.
   $$\mu = \frac{-2 \pm \sqrt{4 - 100}}{2} = -1.0 \pm \sqrt{-24} = -1.0 \pm i 2\sqrt{6} \approx -1.0 \pm 4.8990 i\text{ s}^{-1}$$
2. **Dimensionless step parameter $z$ for $\Delta t = 0.1\text{ s}$:**
   $$z = \mu \Delta t = (-1.0 \pm 4.8990 i)(0.1) = -0.10 \pm 0.4899 i$$
3. **Forward Euler stability test:**
   We evaluate $|1 + z|$:
   $$1 + z = 1 + (-0.10 \pm 0.4899 i) = 0.90 \pm 0.4899 i$$
   $$|1 + z|^2 = 0.90^2 + 0.4899^2 = 0.81 + 0.2400 = 1.0500$$
   $$|1 + z| = \sqrt{1.0500} \approx 1.0247 > 1.0$$
   *Conclusion:* Even though the physical system has real physical damping ($\gamma = 1.0\text{ s}^{-1}$), the timestep $\Delta t = 0.1\text{ s}$ is too large for Forward Euler, falling outside the stability disc. The simulation will blow up instead of decaying!

---

### Solution to Exercise 10.6
1. **Evaluating $|R(i\beta)|^2$:**
   $$R(i\beta) = 1 + i\beta + \frac{(i\beta)^2}{2} = 1 - \frac{\beta^2}{2} + i\beta$$
   The squared modulus is:
   $$|R(i\beta)|^2 = \left(1 - \frac{\beta^2}{2}\right)^2 + \beta^2 = 1 - \beta^2 + \frac{\beta^4}{4} + \beta^2 = 1 + \frac{\beta^4}{4}$$
2. **Instability proof:**
   Because $\beta = \omega \Delta t$, for any non-zero frequency and positive timestep, $\beta > 0 \implies \frac{\beta^4}{4} > 0$.
   Therefore:
   $$|R(i\beta)|^2 = 1 + \frac{\beta^4}{4} > 1.0 \implies |R(i\beta)| > 1.0 \quad \forall \beta \ne 0$$
3. **Physical consequence:**
   No explicit 2nd-order Runge-Kutta scheme contains any portion of the imaginary axis within its stability domain. When applied to undamped conservative mechanics (such as planetary orbits), Heun's method systematically injects energy of order $\mathcal{O}(\Delta t^4)$ per tick, causing planets to spiral outwards into the void.

---

### Solution to Exercise 10.7
1. **System matrix $\mathbf{A} = \mathbf{M}^{-1}\mathbf{K}$:**
   For a periodic 4-mass ring, each particle of mass $m = 0.5\text{ kg}$ is connected to two neighbors by springs of stiffness $k = 500\text{ N/m}$.
   Dividing stiffness by mass: $k/m = 500 / 0.5 = 1000\text{ s}^{-2}$.
   The dynamic matrix is:
   $$\mathbf{A} = \begin{bmatrix} 2000 & -1000 & 0 & -1000 \\ -1000 & 2000 & -1000 & 0 \\ 0 & -1000 & 2000 & -1000 \\ -1000 & 0 & -1000 & 2000 \end{bmatrix}$$
2. **Gershgorin disc evaluation:**
   For every row $i \in \{1, 2, 3, 4\}$:
   $$c_i = A_{ii} = 2000$$
   $$R_i = \sum_{j \ne i} |A_{ij}| = |-1000| + 0 + |-1000| = 2000$$
   Each disc spans $[c_i - R_i, c_i + R_i] = [0, 4000]\text{ s}^{-2}$.
   Therefore:
   $$\omega_{\max}^2 \le 4000\text{ rad}^2/\text{s}^2 \implies \omega_{\max} \le \sqrt{4000} \approx 63.2455\text{ rad/s}$$
3. **Critical timestep:**
   $$\Delta t_{\text{crit}} = \frac{2}{\omega_{\max}} = \frac{2}{63.2455\text{ s}^{-1}} \approx 0.03162\text{ s} \approx 31.62\text{ ms}$$

---

### Solution to Exercise 10.8
1. **Spectral radius under Backward Euler:**
   $$R_{\text{BE}}(i\omega \Delta t) = \frac{1}{1 - i\omega \Delta t}$$
   Here $\omega = 1000\text{ rad/s}$ and $\Delta t = 0.01\text{ s} \implies \Omega = 1000 \times 0.01 = 10.0$.
   $$\rho = \left| \frac{1}{1 - 10 i} \right| = \frac{1}{\sqrt{1^2 + 10^2}} = \frac{1}{\sqrt{101}} \approx 0.0995037$$
2. **Amplitude remaining after 5 steps:**
   $$\rho^5 = (0.0995037)^5 \approx 9.754 \times 10^{-6}$$
   Only $0.000975\%$ of the original amplitude survives after just 5 timesteps ($0.05\text{ seconds}$). This illustrates how aggressively Backward Euler annihilates high-frequency physical oscillations through artificial numerical dissipation.

---

### Solution to Exercise 10.9
1. **Raw error ratio:**
   $$\text{err\_ratio} = \frac{\|\mathbf{e}\|}{\text{Tol}} = \frac{2.5 \times 10^{-2}}{1.0 \times 10^{-4}} = 250.0$$
2. **Optimal reduced timestep (unconstrained):**
   For RKF45 ($p=4$):
   $$h_{\text{opt}} = h \cdot S \cdot (\text{err\_ratio})^{-0.2} = 0.08 \times 0.90 \times (250.0)^{-0.2}$$
   $$(250.0)^{0.2} \approx 3.01708 \implies (250.0)^{-0.2} \approx 0.33144$$
   $$h_{\text{opt}} = 0.072 \times 0.33144 \approx 0.02386\text{ s}$$
3. **Application of minimum shrinkage clamp:**
   The shrinkage ratio is $h_{\text{opt}} / h = 0.02386 / 0.08 = 0.2983$.
   Since $0.2983 \ge s_{\min} = 0.20$, the clamp is not triggered.
   The actual timestep applied for the retry is $h_{\text{retry}} = 0.02386\text{ s} \approx 23.86\text{ ms}$.

---

### Solution to Exercise 10.10
1. **Roots at boundary $\Omega = 2.0$:**
   $$\lambda^2 - (2 - 2^2)\lambda + 1 = \lambda^2 - (2 - 4)\lambda + 1 = \lambda^2 + 2\lambda + 1 = 0$$
   $$(\lambda + 1)^2 = 0 \implies \lambda_{1,2} = -1.0 \quad (\text{Degenerate real repeated root})$$
   Here $|\lambda| = |-1.0| = 1.0$. The system is on the exact verge of instability.
2. **Roots beyond boundary $\Omega = 2.05$:**
   $$\Omega^2 = 2.05^2 = 4.2025$$
   $$\lambda^2 - (2 - 4.2025)\lambda + 1 = \lambda^2 + 2.2025\lambda + 1 = 0$$
   $$\mathcal{D} = 2.2025^2 - 4(1)(1) = 4.851006 - 4.0 = +0.851006 > 0$$
   $$\lambda = \frac{-2.2025 \pm \sqrt{0.851006}}{2} = \frac{-2.2025 \pm 0.9224998}{2}$$
   $$\lambda_1 = \frac{-2.2025 - 0.9225}{2} = -1.5625$$
   $$\lambda_2 = \frac{-2.2025 + 0.9225}{2} = -0.6400$$
3. **Product invariant and blow-up guarantee:**
   For any quadratic equation $\lambda^2 - B\lambda + C = 0$, Vieta's formulas state that the product of roots equals the constant term:
   $$\lambda_1 \lambda_2 \equiv C = 1.0$$
   Verifying for our roots: $(-1.5625)(-0.6400) = 1.0000$.
   Because their product is strictly $1.0$, if one root is real and has magnitude strictly less than 1 ($|\lambda_2| = 0.64 < 1.0$), the conjugate root **must mathematically have magnitude strictly greater than 1**:
   $$|\lambda_1| = \frac{1}{|\lambda_2|} = \frac{1}{0.64} = 1.5625 > 1.0$$
   Therefore, the moment the discriminant becomes positive ($\Omega > 2.0$), one of the eigenvalues is guaranteed to exceed $1.0$, producing an unavoidable exponential explosion. $\blacksquare$
