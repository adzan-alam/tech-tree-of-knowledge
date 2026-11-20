# Numerical Integration: Euler, Symplectic Integrators, and Velocity Verlet

---

## 1. The Epistemological Challenge: The Three-Body Problem & Chaos

### 1.1 The Limits of Closed-Form Analytical Calculus
When Sir Isaac Newton formulated his Universal Law of Gravitation, he solved the **two-body problem** (e.g. one planet orbiting the Sun) analytically, deriving Kepler's elliptical orbits in closed mathematical form.

However, when Newton attempted to calculate the motion of the Moon influenced simultaneously by both the Earth and the Sun—the **three-body problem**—his analytical methods failed. Newton famously complained to his friend Edmond Halley that the Moon's motion *"made his head ache and kept him awake so often that he would think of it no more."*

In 1889, the French mathematician **Henri Poincaré** proved a staggering truth: for three or more interacting gravitational bodies, **no general closed-form algebraic solution exists**. The equations are non-linear and exhibit sensitive dependence on initial conditions (**deterministic chaos**).

If nature cannot be solved with pencil and paper, how do modern astrophysicists navigate space probes to Pluto, and how do game engines simulate complex physical worlds?  
The answer is **numerical integration**: stepping differential equations forward in small discrete increments of time $\Delta t$.

---

## 2. Mathematical Formalism: ODEs, Phase Space, and Symplecticity

### 2.1 The Dynamical State in Phase Space
Newton's Second Law defines a system of second-order Ordinary Differential Equations (ODEs):
$$ \frac{d^2\vec{x}}{dt^2} = \vec{a}(\vec{x}, \vec{v}, t) = \frac{\vec{F}(\vec{x}, \vec{v}, t)}{m} $$

In classical Hamiltonian mechanics, this is decomposed into a coupled system of two first-order ODEs in **Phase Space** $(\vec{x}, \vec{p})$:
$$ \frac{d\vec{x}}{dt} = \vec{v} = \frac{\vec{p}}{m} $$
$$ \frac{d\vec{p}}{dt} = \vec{F}(\vec{x}, \vec{v}) $$

```
        Momentum p ^
                   |      /-------\
                   |     /         \   Phase Space Trajectory
                   |    |     ●     |  (Area is strictly conserved
                   |     \         /    by Liouville's Theorem)
                   |      \-------/
                   +------------------------> Position x
```

### 2.2 Liouville's Theorem & Symplectic Geometry
For any conservative physical system governed by a Hamiltonian $H(\vec{x}, \vec{p}) = K(\vec{p}) + U(\vec{x})$, **Liouville's Theorem** states that the volume of any region in phase space is strictly conserved over time:
$$ \frac{\partial \dot{x}}{\partial x} + \frac{\partial \dot{p}}{\partial p} = 0 $$

A numerical integrator is termed **symplectic** if the discrete mapping $(x_k, p_k) \mapsto (x_{k+1}, p_{k+1})$ preserves this geometric phase-space volume exactly.  
- **Non-symplectic integrators** artificially expand or contract phase-space volume, causing artificial energy explosion or collapse.
- **Symplectic integrators** do not necessarily conserve the exact original Hamiltonian $H$, but they **strictly conserve a shadow Hamiltonian $\tilde{H}$** close to $H$, bounding energy fluctuations within a narrow band indefinitely!

---

## 3. Deep Derivations & Error Analysis of Numerical Integrators

### 3.1 Explicit (Forward) Euler Method
The simplest numerical method expands position and velocity via first-order Taylor series:
$$ \vec{x}_{k+1} = \vec{x}_k + \vec{v}_k \Delta t $$
$$ \vec{v}_{k+1} = \vec{v}_k + \vec{a}(\vec{x}_k) \Delta t $$

#### Truncation Error:
- **Local Truncation Error (per step):** $\mathcal{O}(\Delta t^2)$
- **Global Accumulation Error:** $\mathcal{O}(\Delta t)$ (First-order accuracy)

#### The Fatal Energy Explosion of Explicit Euler:
Consider a Simple Harmonic Oscillator ($a = -\omega^2 x$). The state transition under Explicit Euler is:
$$ \begin{bmatrix} x_{k+1} \\ v_{k+1} \end{bmatrix} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} \begin{bmatrix} x_k \\ v_k \end{bmatrix} $$
The determinant of this transition matrix is:
$$ \det(M) = (1)(1) - (\Delta t)(-\omega^2 \Delta t) = 1 + \omega^2 (\Delta t)^2 > 1 $$
Because $\det(M) > 1$, the phase-space area **expands on every single tick**. Total mechanical energy grows exponentially:
$$ E_{k+1} \approx E_k (1 + \omega^2 \Delta t^2) $$
An orbiting planet integrated with Explicit Euler will spiral outwards into deep space and fly apart!

---

### 3.2 Semi-Implicit (Euler-Cromer / Symplectic) Euler
The semi-implicit method introduces a subtle but transformative modification: **update velocity first, then update position using the newly calculated velocity**:

$$ \vec{v}_{k+1} = \vec{v}_k + \vec{a}(\vec{x}_k) \Delta t $$
$$ \vec{x}_{k+1} = \vec{x}_k + \vec{v}_{k+1} \Delta t $$

#### Why It Works: Symplectic Area Preservation
The transition matrix for the harmonic oscillator becomes:
$$ \begin{bmatrix} x_{k+1} \\ v_{k+1} \end{bmatrix} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} \begin{bmatrix} x_k \\ v_k \end{bmatrix} $$
Computing the determinant:
$$ \det(M) = (1 - \omega^2 \Delta t^2)(1) - (\Delta t)(-\omega^2 \Delta t) = 1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2 = \mathbf{1.0} \quad \blacksquare $$
The phase-space area is **conserved exactly**! The system never spirals out of control. Energy oscillates stably within a bounded envelope over billions of iterations.

---

### 3.3 Velocity Verlet Integration (The Gold Standard)
Developed by Loup Verlet in 1967 for molecular dynamics, Velocity Verlet achieves second-order global accuracy ($\mathcal{O}(\Delta t^2)$), time-reversibility, and symplecticity.

#### Derivation from Taylor Series:
Expand position forward and backward in time:
$$ \vec{x}(t + \Delta t) = \vec{x}(t) + \vec{v}(t)\Delta t + \frac{1}{2}\vec{a}(t)\Delta t^2 + \frac{1}{6}\vec{b}(t)\Delta t^3 + \mathcal{O}(\Delta t^4) \quad \text{(Eq. 1)} $$
$$ \vec{x}(t - \Delta t) = \vec{x}(t) - \vec{v}(t)\Delta t + \frac{1}{2}\vec{a}(t)\Delta t^2 - \frac{1}{6}\vec{b}(t)\Delta t^3 + \mathcal{O}(\Delta t^4) \quad \text{(Eq. 2)} $$

Adding Eq. 1 and Eq. 2 causes all odd-power terms (velocity $\vec{v}$ and jerk $\vec{b}$) to cancel:
$$ \vec{x}(t + \Delta t) + \vec{x}(t - \Delta t) = 2\vec{x}(t) + \vec{a}(t)\Delta t^2 + \mathcal{O}(\Delta t^4) $$
$$ \mathbf{\vec{x}(t + \Delta t) = 2\vec{x}(t) - \vec{x}(t - \Delta t) + \vec{a}(t)\Delta t^2} $$
This is the original **Position Verlet** formula!

#### The Velocity Verlet Formulation:
To keep velocities synchronized with positions at the exact same timestep:
1. **Half-Step Velocity Update:**
   $$ \vec{v}_{k + 1/2} = \vec{v}_k + \frac{1}{2} \vec{a}_k \Delta t $$
2. **Full-Step Position Update:**
   $$ \vec{x}_{k+1} = \vec{x}_k + \vec{v}_{k + 1/2} \Delta t = \vec{x}_k + \vec{v}_k \Delta t + \frac{1}{2} \vec{a}_k \Delta t^2 $$
3. **Compute New Accelerations from New Positions:**
   $$ \vec{a}_{k+1} = \frac{\vec{F}(\vec{x}_{k+1})}{m} $$
4. **Second Half-Step Velocity Update:**
   $$ \vec{v}_{k+1} = \vec{v}_{k + 1/2} + \frac{1}{2} \vec{a}_{k+1} \Delta t $$

---

## 4. Comparison Summary: Selecting the Right Integrator

| Integrator | Global Error | Symplectic? | Energy Stability | Computational Cost | Best Used For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Explicit Euler** | $\mathcal{O}(\Delta t)$ | **NO** | Diverges (Explodes) | 1 Force Eval / tick | Never in physics engines |
| **Semi-Implicit Euler** | $\mathcal{O}(\Delta t)$ | **YES** | Bounded Oscillation | 1 Force Eval / tick | Fast 2D/3D games, ragdolls |
| **Velocity Verlet** | $\mathcal{O}(\Delta t^2)$ | **YES** | Strictly Bounded | 1 Force Eval / tick | Physics simulators, orbits, MD |
| **Runge-Kutta 4 (RK4)** | $\mathcal{O}(\Delta t^4)$ | **NO** | High short-term accuracy | 4 Force Evals / tick | Aerodynamics, ballistic flight |

---

## 5. Multi-Tiered Worked Examples

### Level 1: Harmonic Oscillator Step-by-Step Benchmark
A mass $m = 1 \text{ kg}$ on a spring with stiffness $k = 1 \text{ N/m}$ has natural frequency $\omega = 1 \text{ rad/s}$.  
Initial state: $x_0 = 1.0 \text{ m}, \quad v_0 = 0.0 \text{ m/s}$. Initial mechanical energy:
$$ E_0 = \frac{1}{2} k x_0^2 + \frac{1}{2} m v_0^2 = 0.5000 \text{ J} $$
Take a coarse timestep $\Delta t = 0.4 \text{ s}$. Compute step 1 for Explicit Euler, Semi-Implicit Euler, and Velocity Verlet.

**1. Explicit Euler:**
- $a_0 = -x_0 = -1.0$
- $x_1 = x_0 + v_0 \Delta t = 1.0 + 0(0.4) = 1.0 \text{ m}$
- $v_1 = v_0 + a_0 \Delta t = 0.0 + (-1.0)(0.4) = -0.4 \text{ m/s}$
- Energy: $E_1 = 0.5(1.0^2) + 0.5(-0.4^2) = 0.5000 + 0.0800 = \mathbf{0.5800 \text{ J}} \quad \mathbf{(+16\% \text{ Artificial Gain!})}$

**2. Semi-Implicit Euler:**
- $a_0 = -x_0 = -1.0$
- $v_1 = v_0 + a_0 \Delta t = 0.0 + (-1.0)(0.4) = -0.4 \text{ m/s}$
- $x_1 = x_0 + v_1 \Delta t = 1.0 + (-0.4)(0.4) = 1.0 - 0.16 = 0.84 \text{ m}$
- Energy: $E_1 = 0.5(0.84^2) + 0.5(-0.4^2) = 0.3528 + 0.0800 = \mathbf{0.4328 \text{ J}} \quad (\text{Bounded})$

**3. Velocity Verlet:**
- $a_0 = -x_0 = -1.0$
- $v_{1/2} = v_0 + 0.5 a_0 \Delta t = 0 + 0.5(-1.0)(0.4) = -0.2 \text{ m/s}$
- $x_1 = x_0 + v_{1/2} \Delta t = 1.0 + (-0.2)(0.4) = 0.92 \text{ m}$
- $a_1 = -x_1 = -0.92$
- $v_1 = v_{1/2} + 0.5 a_1 \Delta t = -0.2 + 0.5(-0.92)(0.4) = -0.2 - 0.184 = -0.384 \text{ m/s}$
- Energy: $E_1 = 0.5(0.92^2) + 0.5(-0.384^2) = 0.4232 + 0.0737 = \mathbf{0.4969 \text{ J}} \quad \mathbf{(0.6\% \text{ deviation from exact } 0.5000!)}$

---

### Level 2: Planetary Orbit Stability (Kepler's Law)
In a gravitational orbit around mass $M$ at origin $(0, 0)$:
$$ \vec{a} = -\frac{G M}{\|\vec{r}\|^3} \vec{r} $$
Over $10,000$ orbits:
- **Explicit Euler:** The planet gains angular momentum artificially and flies out of the solar system within 10 orbits.
- **Velocity Verlet:** The orbital ellipse precesses slightly due to discretization, but semi-major axis and eccentricity remain locked for millions of cycles without degradation!

---

## 6. Production-Ready Computational Engine: Symplectic Integrator Suite

```typescript
export interface State2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
}

export type ForceCalculator = (x: number, y: number, vx: number, vy: number) => { fx: number; fy: number };

export class NumericalIntegrator {
  /**
   * Semi-Implicit Euler (Euler-Cromer)
   * 1st order symplectic. Extremely fast and stable for general physics.
   */
  public static semiImplicitEuler(
    state: State2D,
    mass: number,
    computeForce: ForceCalculator,
    dt: number
  ): void {
    const force = computeForce(state.x, state.y, state.vx, state.vy);
    const ax = force.fx / mass;
    const ay = force.fy / mass;

    // Update velocity first
    state.vx += ax * dt;
    state.vy += ay * dt;

    // Update position with new velocity
    state.x += state.vx * dt;
    state.y += state.vy * dt;

    state.ax = ax;
    state.ay = ay;
  }

  /**
   * Velocity Verlet
   * 2nd order symplectic. Superior energy conservation for orbital mechanics and springs.
   */
  public static velocityVerlet(
    state: State2D,
    mass: number,
    computeForce: ForceCalculator,
    dt: number
  ): void {
    // 1. Half-step velocity
    const vHalfX = state.vx + 0.5 * state.ax * dt;
    const vHalfY = state.vy + 0.5 * state.ay * dt;

    // 2. Full-step position
    state.x += vHalfX * dt;
    state.y += vHalfY * dt;

    // 3. Evaluate new acceleration at new position
    const newForce = computeForce(state.x, state.y, vHalfX, vHalfY);
    const newAx = newForce.fx / mass;
    const newAy = newForce.fy / mass;

    // 4. Second half-step velocity
    state.vx = vHalfX + 0.5 * newAx * dt;
    state.vy = vHalfY + 0.5 * newAy * dt;

    state.ax = newAx;
    state.ay = newAy;
  }
}
```

---

## 7. Socratic Self-Check & Verification

1. **Question:** Why does Explicit Euler cause orbiting planets to spiral outwards, while Implicit Euler causes them to spiral inwards?
   - **Answer:** The determinant of the Explicit Euler transition matrix is $\det(M) = 1 + \omega^2 \Delta t^2 > 1$, which expands phase space and amplifies energy. Conversely, for Implicit Euler, $\det(M) = \frac{1}{1 + \omega^2 \Delta t^2} < 1$, which artificially drains energy from the system, causing orbits to collapse inward.
2. **Question:** If Velocity Verlet requires calculating force only once per timestep, why is it so much more accurate than Explicit Euler?
   - **Answer:** Velocity Verlet evaluates forces at the staggered midpoint (half-step), which corresponds to a central difference approximation where symmetric Taylor expansion error terms cancel out completely ($\mathcal{O}(\Delta t^2)$ global error vs. $\mathcal{O}(\Delta t)$).
3. **Question:** What is the maximum stable timestep $\Delta t$ for integrating a mass-spring system with frequency $\omega$?
   - **Answer:** By the Courant-Friedrichs-Lewy (CFL) stability criterion, Semi-Implicit Euler remains stable only when $\omega \Delta t < 2$. If $\Delta t \ge \frac{2}{\omega}$, the eigenvalues of the step matrix exceed unity and the simulation explodes exponentially.
