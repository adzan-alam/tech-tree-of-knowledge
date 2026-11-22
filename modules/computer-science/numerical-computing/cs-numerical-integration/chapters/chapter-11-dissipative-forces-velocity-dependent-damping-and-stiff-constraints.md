# Chapter 11: Dissipative Forces, Velocity-Dependent Damping, and Stiff Penalty Constraints

> *"Conservative physics is a pristine mathematical paradise where energy is immortal and every orbit repeats forever. But real physical simulation lives in the thermal muck: friction grinds wheels to a halt, air turbulence robs missiles of kinetic energy, and rigid linkages snap under infinite stiffness. To simulate reality, an integrator must master dissipation without introducing numerical poison."*

---

### Conceptual Architecture: The Dissipative & Constraint Spectrum

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   DISSIPATIVE PHYSICAL FORCES IN SIMULATION                              │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Force Classification
                                              ▼
┌──────────────────────────────────────┬───────────────────────────────────────────────────┐
│     Laminar Viscous Drag (Stokes)    │      Turbulent Aerodynamic Drag (Newton)          │
│       F_visc = -γ · v                │        F_aero = -0.5 · ρ · C_d · A · ||v|| · v    │
│    Coupled Linear Velocity ODE       │         Non-Linear Quadratic Velocity Coupling    │
└──────────────────────────────────────┴───────────────────────────────────────────────────┘
                                              │ Discretization Hazards
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                  THE EXPLICIT VELOCITY REVERSAL HAZARD                                   │
│  If Δt > 2m / γ: Forward Euler reverses velocity sign instead of braking!                │
│  Solution: Analytical Decay Operator:   v_{n+1} = v_n · exp(-γ Δt / m)                   │
│            Implicit Padé Approximation: v_{n+1} = v_n / (1 + γ Δt / m)                   │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Structural Linkages & Rigidity
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│              STIFF PENALTY SPRINGS VS GEOMETRIC CONSTRAINT PROJECTIONS                   │
│                                                                                          │
│    Penalty Method (Naive Spring):               Position-Based Dynamics (PBD/XPBD):      │
│      k → ∞  (e.g., k = 10^7 N/m)                  C(x_1, x_2) = ||x_1 - x_2|| - L_0 = 0   │
│      Δt_crit = 2 · sqrt(m / k) → 0                Direct position projection:            │
│      Results in Stiff Integrator Freeze!          Δx_i = -w_i / (w_1 + w_2) · C · n      │
│                                                   Unconditionally Stable for ANY Δt!     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 11.1 Dissipation Mechanics: From Stokes to Turbulence

In Chapters 5 through 9, our theoretical focus was on Hamiltonian and symplectic mechanics, where total mechanical energy $E = T + V$ is strictly conserved. In classical thermodynamics, however, physical systems are open and coupled to microscopic environments, irreversibly dissipating coherent macroscopic kinetic energy into thermal entropy.

### 11.1.1 Laminar Viscous Damping (Linear Stokes Drag)
For microscopic particles, slow-moving bodies in high-viscosity fluids (glycerol, motor oil), or low-Reynolds-number regimes ($Re < 1$), the fluid resistance force is linear in relative velocity:
$$\mathbf{F}_{\text{visc}}(\mathbf{v}) = -\gamma \mathbf{v}$$
where $\gamma > 0$ is the viscous damping coefficient (SI units: $\text{N}\cdot\text{s/m} = \text{kg/s}$). For a sphere of radius $R$ in a fluid of dynamic viscosity $\eta$, Stokes' law gives $\gamma = 6\pi \eta R$.

The unforced equation of motion is:
$$m \dot{\mathbf{v}} = -\gamma \mathbf{v} \implies \dot{\mathbf{v}} = -\frac{\gamma}{m}\mathbf{v}$$

Integrating analytically from $t = 0$ with initial velocity $\mathbf{v}_0$:
$$\mathbf{v}(t) = \mathbf{v}_0 \exp\left(-\frac{\gamma}{m} t\right)$$
The characteristic velocity relaxation timescale is $\tau = m / \gamma$. As $t \to \infty$, velocity decays monotonically toward zero without ever changing sign.

### 11.1.2 Turbulent Aerodynamic Drag (Quadratic Newtonian Drag)
For macroscopic objects moving through air or water at moderate-to-high speeds ($Re > 1000$), inertial displacement of fluid momentum dominates viscous shear stress. The resisting force is quadratic in speed:
$$\mathbf{F}_{\text{aero}}(\mathbf{v}) = -\frac{1}{2} \rho C_d A \|\mathbf{v}\| \mathbf{v}$$
where:
- $\rho$ is fluid mass density ($\approx 1.225\text{ kg/m}^3$ for sea-level air),
- $C_d$ is the dimensionless drag coefficient (e.g., $0.47$ for a sphere, $0.28$ for an aerodynamic automobile),
- $A$ is the projected frontal cross-sectional area ($\text{m}^2$),
- $\|\mathbf{v}\| \mathbf{v}$ ensures the drag opposes the instantaneous velocity vector while scaling with $v^2$.

Defining the scalar quadratic drag factor $\beta \equiv \frac{1}{2} \rho C_d A$ (SI units: $\text{kg/m}$):
$$m \dot{\mathbf{v}} = -\beta \|\mathbf{v}\| \mathbf{v}$$

For 1D motion along a line ($v \ge 0$):
$$\dot{v} = -\frac{\beta}{m} v^2 \implies \int_{v_0}^v \frac{dv'}{(v')^2} = -\frac{\beta}{m} \int_0^t dt' \implies -\frac{1}{v} + \frac{1}{v_0} = -\frac{\beta}{m} t$$
$$v(t) = \frac{v_0}{1 + \frac{\beta v_0}{m} t}$$
Unlike exponential viscous decay, quadratic drag exhibits a power-law algebraic decay ($v(t) \propto 1/t$ for large $t$).

### 11.1.3 Coulomb Dry Friction and Regularization
Coulomb friction between dry contacting surfaces obeys the non-smooth law:
$$\mathbf{F}_{\text{fric}} = \begin{cases} -\mu_k \|\mathbf{N}\| \frac{\mathbf{v}_{\text{rel}}}{\|\mathbf{v}_{\text{rel}}\|}, & \text{if } \|\mathbf{v}_{\text{rel}}\| > 0 \quad (\text{Kinetic Friction}) \\ \mathbf{F}_{\text{static}} \le \mu_s \|\mathbf{N}\|, & \text{if } \|\mathbf{v}_{\text{rel}}\| = 0 \quad (\text{Static Stiction}) \end{cases}$$

The discontinuity at $\mathbf{v}_{\text{rel}} = \mathbf{0}$ is a notorious source of numerical chatter in explicit ODE integrators. As velocity approaches zero, an explicit step overshoots to a negative velocity, triggering an opposite friction force on the next tick, which overshoots back to positive velocity. The particle vibrates hysteretically at high frequency rather than resting.

To resolve this, simulations apply **smooth regularization**:
$$\mathbf{F}_{\text{fric}}(\mathbf{v}) \approx -\mu_k \|\mathbf{N}\| \left( \frac{\mathbf{v}}{\|\mathbf{v}\| + \epsilon_{\text{reg}}} \right) \quad \text{or} \quad -\mu_k \|\mathbf{N}\| \tanh\left(\frac{\|\mathbf{v}\|}{\epsilon_{\text{reg}}}\right) \frac{\mathbf{v}}{\|\mathbf{v}\|}$$
where $\epsilon_{\text{reg}} \ll 1$ is a small regularization velocity threshold (e.g., $10^{-3}\text{ m/s}$).

---

## 11.2 The Implicit Velocity Dilemma

When an integrator evaluates forces that depend on velocity $\mathbf{F}(\mathbf{x}, \mathbf{v})$, explicit stepping creates an acute numerical instability.

### 11.2.1 The Explicit Velocity Reversal Hazard
Consider 1D linear viscous drag $m \dot{v} = -\gamma v$. Discretizing with Explicit Forward Euler:
$$v_{n+1} = v_n + \Delta t \left(-\frac{\gamma}{m} v_n\right) = \left(1 - \frac{\gamma \Delta t}{m}\right) v_n$$

Analyzing the amplification factor $G = 1 - \frac{\gamma \Delta t}{m}$:
1. If $\frac{\gamma \Delta t}{m} < 1$: $0 < G < 1$. Velocity decays monotonically toward zero.
2. If $1 < \frac{\gamma \Delta t}{m} < 2$: $-1 < G < 0$. Velocity **reverses direction every single step** while decaying in magnitude (unphysical numerical oscillation).
3. If $\frac{\gamma \Delta t}{m} > 2$: $G < -1$. The discrete velocity **explodes exponentially with alternating signs**!

For high damping (e.g., honey or oil, where $\gamma/m = 200\text{ s}^{-1}$), an explicit timestep of $\Delta t = 0.016\text{ s}$ yields:
$$G = 1 - 200 \times 0.016 = 1 - 3.2 = -2.2$$
Instead of coming to rest, the object flips direction and accelerates exponentially by $2.2\times$ per frame!

```
Discrete Velocity Profiles Under High Damping (γ = 200, m = 1, Δt = 0.016 s)

 v(t) ▲
      │
 +1.0 ┼───* (v_0 = 1.0 m/s)
      │    \
      │     \
  0.0 ┼──────\────────────────────────────────────────────► Time (s)
      │       \                                * (v_2 = +4.84 m/s)
      │        \                              /
 -2.2 ┼─────────* (v_1 = -2.2 m/s)           /
      │                                     /
 -4.8 ┼────────────────────────────────────*
      │
      ▼ EXPLICIT FORWARD EULER EXPLODES! (G = -2.2 < -1.0)
```

### 11.2.2 Unconditionally Stable Damping Operators
To guarantee that velocity decays stably for **any arbitrary timestep $\Delta t > 0$**, we have two mathematical formulations:

#### 1. The Analytical Exponential Decay Operator
Separating the damping term from other conservative forces $\mathbf{F}_{\text{other}}$:
$$m \dot{\mathbf{v}} = \mathbf{F}_{\text{other}}(\mathbf{x}) - \gamma \mathbf{v}$$
Over sub-step $\Delta t$, the analytical integration factor is:
$$\alpha_{\text{decay}} = \exp\left(-\frac{\gamma \Delta t}{m}\right) \in (0, 1]$$
$$\mathbf{v}_{n+1} = \alpha_{\text{decay}} \mathbf{v}_n + \frac{\mathbf{F}_{\text{other}}}{m} \Delta t \cdot \left(\frac{1 - \alpha_{\text{decay}}}{\gamma \Delta t / m}\right)$$
Because $\exp(-\cdot) > 0$ strictly, the velocity can never reverse sign due to damping, no matter how large $\Delta t$ becomes.

#### 2. The Semi-Implicit / Backward Velocity Solve
Evaluating the damping force implicitly at the end-of-step velocity $\mathbf{v}_{n+1}$:
$$\mathbf{v}_{n+1} = \mathbf{v}_n + \frac{\Delta t}{m} \left( \mathbf{F}_{\text{other}} - \gamma \mathbf{v}_{n+1} \right)$$
Grouping all terms containing $\mathbf{v}_{n+1}$ on the left-hand side:
$$\left(1 + \frac{\gamma \Delta t}{m}\right) \mathbf{v}_{n+1} = \mathbf{v}_n + \frac{\mathbf{F}_{\text{other}}}{m} \Delta t$$
$$\mathbf{v}_{n+1} = \frac{\mathbf{v}_n + \frac{\mathbf{F}_{\text{other}}}{m}\Delta t}{1 + \frac{\gamma \Delta t}{m}}$$
The amplification factor is $G_{\text{implicit}} = \frac{1}{1 + \gamma \Delta t / m}$.
As $\Delta t \to \infty$, $G_{\text{implicit}} \to 0$. The velocity is guaranteed to stay within $(0, 1) \cdot v_n$, preventing sign reversal and explosion unconditionally.

---

## 11.3 Velocity Verlet with Velocity-Dependent Damping

In Chapter 8, we established Velocity Verlet as the standard integrator for conservative mechanics:
$$\mathbf{v}_{n+1/2} = \mathbf{v}_n + \frac{1}{2}\mathbf{a}_n \Delta t$$
$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_{n+1/2} \Delta t$$
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2}\mathbf{a}_{n+1} \Delta t$$

When acceleration depends on velocity $\mathbf{a}_{n+1} = \mathbf{a}(\mathbf{x}_{n+1}, \mathbf{v}_{n+1})$, the second half-kick becomes an implicit circular definition: $\mathbf{v}_{n+1}$ is required to evaluate $\mathbf{a}_{n+1}$, which is required to compute $\mathbf{v}_{n+1}$.

### 11.3.1 Resolving Linear Damping in Velocity Verlet
Let total acceleration be partitioned into position-dependent and velocity-dependent components:
$$\mathbf{a}(\mathbf{x}, \mathbf{v}) = \mathbf{a}_{\text{pos}}(\mathbf{x}) - \frac{\gamma}{m}\mathbf{v}$$

Substituting into the final half-kick equation:
$$\mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \Delta t \left( \mathbf{a}_{\text{pos}}(\mathbf{x}_{n+1}) - \frac{\gamma}{m}\mathbf{v}_{n+1} \right)$$
Gathering $\mathbf{v}_{n+1}$ terms:
$$\left(1 + \frac{\gamma \Delta t}{2m}\right) \mathbf{v}_{n+1} = \mathbf{v}_{n+1/2} + \frac{1}{2} \Delta t \, \mathbf{a}_{\text{pos}}(\mathbf{x}_{n+1})$$
$$\mathbf{v}_{n+1} = \frac{\mathbf{v}_{n+1/2} + \frac{1}{2} \Delta t \, \mathbf{a}_{\text{pos}}(\mathbf{x}_{n+1})}{1 + \frac{\gamma \Delta t}{2m}}$$

This symmetric implicit modification preserves second-order accuracy $\mathcal{O}(\Delta t^2)$ while maintaining unconditional stability against damping explosions.

---

## 11.4 Stiff Differential Equations & The Penalty Method Trap

A system of differential equations $\dot{\mathbf{y}} = \mathbf{f}(\mathbf{y})$ is termed **stiff** if the Jacobian matrix $\mathbf{J}$ possesses eigenvalues that span vastly different scales:
$$\text{Stiffness Ratio } \kappa \equiv \frac{\max_i |\text{Re}(\lambda_i)|}{\min_i |\text{Re}(\lambda_i)|} \gg 10^3$$

In physics simulation, stiffness arises whenever engineers attempt to model rigid mechanical linkages, unstretchable cables, or rigid collision boundaries using elastic penalty springs.

### 11.4.1 The Penalty Spring Formulation
Suppose two particles $\mathbf{x}_1, \mathbf{x}_2$ must maintain a fixed rigid distance $L_0$. The naive engineer models this constraint by placing an ultra-stiff spring between them:
$$V_{\text{penalty}} = \frac{1}{2} k_{\text{penalty}} (\|\mathbf{x}_1 - \mathbf{x}_2\| - L_0)^2$$

To enforce the constraint rigidly (e.g., maximum deflection $< 0.1\text{ mm}$ under a $100\text{ N}$ load), the spring constant must be astronomical:
$$k_{\text{penalty}} \ge \frac{F_{\text{load}}}{\delta x_{\max}} = \frac{100\text{ N}}{10^{-4}\text{ m}} = 10^6\text{ N/m}$$

### 11.4.2 The Stiff Timestep Trap
From Chapter 10, the critical stability timestep for any explicit or semi-implicit spring integrator is bounded by the highest vibrational mode:
$$\omega_{\max} = \sqrt{\frac{2 k_{\text{penalty}}}{m}} = \sqrt{\frac{2 \times 10^6}{1.0}} \approx 1414.2\text{ rad/s}$$
$$\Delta t_{\text{crit}} = \frac{2}{\omega_{\max}} = \frac{2}{1414.2} \approx 0.00141\text{ s} = 1.41\text{ ms}$$

If the simulation is running at $60\text{ Hz}$ ($\Delta t = 16.67\text{ ms}$), the timestep is **12 times larger than the stability limit**. The penalty spring will instantly detonate!

To keep the penalty spring stable, the simulator must execute 12 sub-steps per frame. If the stiffness is increased to $10^8\text{ N/m}$ for industrial precision, the simulator requires 120 sub-steps per frame. The CPU spends $99.9\%$ of its time integrating unobservable high-frequency acoustic vibrations rather than the macroscopic physics.

---

## 11.5 Position-Based Dynamics (PBD) and Extended PBD (XPBD)

Rather than converting geometric constraints into infinite forces and struggling with stiff integrators, **Position-Based Dynamics (PBD)** (Müller et al., 2007) and **Extended Position-Based Dynamics (XPBD)** (Macklin et al., 2016) project positions directly to satisfy kinematic invariants.

```
       Comparison: Penalty Forces vs Position-Based Dynamics (PBD)
       
       A. Stiff Penalty Force Approach (Explosive ODE):
          x_n ──► Force F = -k (||x|| - L_0) n ──► a = F/m ──► v_{n+1} ──► x_{n+1}
          Requires Δt < 2 sqrt(m/k) -> Microscopic timesteps!
          
       B. Position-Based Dynamics (Geometric Projection):
          x_n ──► Unconstrained Inertial Step: x* = x_n + v_n Δt + a_ext Δt^2
               ──► Solve C(x*) = 0 via direct position correction: Δx = -w C ∇C / Σ w
               ──► Constrained Position: x_{n+1} = x* + Δx
               ──► Synthesize Velocity: v_{n+1} = (x_{n+1} - x_n) / Δt
          UNCONDITIONALLY STABLE FOR ANY TIMESTEP!
```

### 11.5.1 The PBD Mathematical Algorithm
Given $M$ particles with positions $\mathbf{x}_i$, velocities $\mathbf{v}_i$, and inverse masses $w_i = 1/m_i$ ($w_i = 0$ for fixed/infinite mass anchors):

1. **Unconstrained Inertial Prediction:**
   $$\tilde{\mathbf{x}}_i = \mathbf{x}_{i, n} + \mathbf{v}_{i, n} \Delta t + \frac{1}{2} \mathbf{g} \Delta t^2$$

2. **Constraint Formulation:**
   A geometric constraint is defined as a scalar function $C(\mathbf{x}_1, \dots, \mathbf{x}_K) = 0$.
   For a rigid distance rod between particle 1 and particle 2:
   $$C(\tilde{\mathbf{x}}_1, \tilde{\mathbf{x}}_2) = \|\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2\| - L_0$$

3. **Mass-Weighted Projection:**
   To satisfy $C = 0$ while conserving linear and angular momentum, position corrections must be along the constraint gradient $\nabla_{\mathbf{x}} C$, weighted by inverse mass:
   $$\Delta \mathbf{x}_i = - \frac{w_i}{\sum_{j} w_j \|\nabla_{\mathbf{x}_j} C\|^2} C(\tilde{\mathbf{x}}) \nabla_{\mathbf{x}_i} C$$

   For a distance constraint, $\nabla_{\mathbf{x}_1} C = \mathbf{n}_{12} = \frac{\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2}{\|\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2\|}$ and $\nabla_{\mathbf{x}_2} C = -\mathbf{n}_{12}$.
   Since $\|\mathbf{n}_{12}\|^2 = 1$:
   $$\Delta \mathbf{x}_1 = - \frac{w_1}{w_1 + w_2} (\|\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2\| - L_0) \mathbf{n}_{12}$$
   $$\Delta \mathbf{x}_2 = + \frac{w_2}{w_1 + w_2} (\|\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2\| - L_0) \mathbf{n}_{12}$$

4. **Update Positions and Synthesize Velocities:**
   $$\mathbf{x}_{i, n+1} = \tilde{\mathbf{x}}_i + \Delta \mathbf{x}_i$$
   $$\mathbf{v}_{i, n+1} = \frac{\mathbf{x}_{i, n+1} - \mathbf{x}_{i, n}}{\Delta t}$$

Because the constraint is enforced by direct geometric projection rather than stiff spring forces, **PBD is unconditionally stable for any timestep $\Delta t$, regardless of stiffness!**

---

## 11.6 Progressive Numerical Worked Examples

---

### Worked Example 11.1: Linear Stokes Drag - Explicit vs Analytical
**Problem Statement:** A ball bearing of mass $m = 0.05\text{ kg}$ is dropped into heavy glycerin with linear drag coefficient $\gamma = 0.80\text{ N}\cdot\text{s/m}$. Its initial horizontal velocity is $v_0 = 10.0\text{ m/s}$.
1. Compute the analytical velocity relaxation time constant $\tau = m/\gamma$.
2. Compute the exact velocity at $t = 0.20\text{ s}$.
3. Calculate the velocity at $t = 0.20\text{ s}$ using Explicit Forward Euler with $\Delta t = 0.05\text{ s}$ (4 steps).
4. Calculate the velocity at $t = 0.20\text{ s}$ using the Analytical Exponential Operator with $\Delta t = 0.05\text{ s}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Time constant $\tau$.**
$$\tau = \frac{m}{\gamma} = \frac{0.05\text{ kg}}{0.80\text{ kg/s}} = 0.0625\text{ s} = 62.5\text{ ms}$$

**Step 2: Exact analytical velocity at $t = 0.20\text{ s}$.**
$$v(t) = v_0 \exp\left(-\frac{t}{\tau}\right) = 10.0 \exp\left(-\frac{0.20}{0.0625}\right) = 10.0 \exp(-3.20)$$
$$\exp(-3.20) \approx 0.0407622$$
$$v(0.20) = 10.0 \times 0.0407622 = 0.40762\text{ m/s}$$

**Step 3: Explicit Forward Euler with $\Delta t = 0.05\text{ s}$.**
The per-step amplification factor is:
$$G_{\text{FE}} = 1 - \frac{\gamma \Delta t}{m} = 1 - \frac{0.80 \times 0.05}{0.05} = 1 - 0.80 = 0.20$$
Evaluating across 4 steps:
- $v_1 = 0.20 \times 10.0 = 2.000\text{ m/s}$ ($t = 0.05\text{ s}$)
- $v_2 = 0.20 \times 2.00 = 0.400\text{ m/s}$ ($t = 0.10\text{ s}$)
- $v_3 = 0.20 \times 0.40 = 0.080\text{ m/s}$ ($t = 0.15\text{ s}$)
- $v_4 = 0.20 \times 0.08 = 0.016\text{ m/s}$ ($t = 0.20\text{ s}$)
Relative error:
$$\text{Rel Error} = \frac{|0.0160 - 0.4076|}{0.4076} \approx 96.1\% \quad (\text{Massive numerical dissipation!})$$

**Step 4: Analytical Exponential Operator.**
Per-step decay factor:
$$\alpha = \exp\left(-\frac{\gamma \Delta t}{m}\right) = \exp\left(-\frac{0.80 \times 0.05}{0.05}\right) = \exp(-0.80) \approx 0.449329$$
Evaluating across 4 steps:
$$v_4 = (\alpha)^4 v_0 = (\exp(-0.80))^4 \times 10.0 = \exp(-3.20) \times 10.0 = 0.40762\text{ m/s}$$
Relative error is identically $0.0\%$.

---

### Worked Example 11.2: Explicit Velocity Reversal Instability Threshold
**Problem Statement:** For the same particle ($m = 0.05\text{ kg}, \gamma = 0.80\text{ N}\cdot\text{s/m}$):
1. Compute the critical timestep $\Delta t_{\text{rev}}$ where Forward Euler begins to oscillate (sign flip).
2. Compute the critical timestep $\Delta t_{\text{blowup}}$ where Forward Euler becomes unconditionally explosive.
3. Simulate 3 steps with Forward Euler at $\Delta t = 0.15\text{ s}$ starting from $v_0 = 5.0\text{ m/s}$ and describe the behavior.

**Step-by-Step Mathematical Solution:**

**Step 1: Sign reversal threshold.**
Oscillation occurs when the amplification factor becomes negative:
$$G = 1 - \frac{\gamma \Delta t}{m} < 0 \implies \Delta t > \Delta t_{\text{rev}} = \frac{m}{\gamma} = \frac{0.05}{0.80} = 0.0625\text{ s}$$

**Step 2: Explosive instability threshold.**
Explosion occurs when $|G| > 1 \implies G < -1$:
$$1 - \frac{\gamma \Delta t}{m} < -1 \implies \frac{\gamma \Delta t}{m} > 2 \implies \Delta t > \Delta t_{\text{blowup}} = \frac{2m}{\gamma} = \frac{2 \times 0.05}{0.80} = 0.125\text{ s}$$

**Step 3: Simulation at $\Delta t = 0.15\text{ s}$.**
Here $\Delta t = 0.15\text{ s} > 0.125\text{ s}$.
$$G = 1 - \frac{0.80 \times 0.15}{0.05} = 1 - \frac{0.12}{0.05} = 1 - 2.40 = -1.40$$
Simulating 3 steps from $v_0 = +5.0\text{ m/s}$:
- Step 1 ($t = 0.15\text{ s}$): $v_1 = (-1.40) \times 5.0 = -7.00\text{ m/s}$ (Reverses direction and accelerates!)
- Step 2 ($t = 0.30\text{ s}$): $v_2 = (-1.40) \times (-7.00) = +9.80\text{ m/s}$ (Reverses again, nearly doubling initial speed!)
- Step 3 ($t = 0.45\text{ s}$): $v_3 = (-1.40) \times 9.80 = -13.72\text{ m/s}$ (Exponential blow-up in progress).

---

### Worked Example 11.3: Semi-Implicit Damping with External Gravity
**Problem Statement:** A mass $m = 2.0\text{ kg}$ falls vertically under gravity $g = 9.81\text{ m/s}^2$ with linear air drag $\gamma = 4.0\text{ N}\cdot\text{s/m}$.
1. Find the analytical terminal velocity $v_{\text{term}} = mg/\gamma$.
2. Formulate the semi-implicit velocity update equation.
3. Compute $v_1, v_2, v_3$ with $\Delta t = 0.50\text{ s}$ starting from rest ($v_0 = 0.0$).
4. Compute the discrete steady-state velocity $v_{\infty}$ and compare with analytical $v_{\text{term}}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Analytical terminal velocity.**
$$v_{\text{term}} = \frac{mg}{\gamma} = \frac{2.0 \times 9.81}{4.0} = \frac{19.62}{4.0} = 4.905\text{ m/s}$$

**Step 2: Semi-implicit update formula.**
Taking downward as positive:
$$v_{n+1} = v_n + \Delta t \left( g - \frac{\gamma}{m} v_{n+1} \right)$$
$$\left(1 + \frac{\gamma \Delta t}{m}\right) v_{n+1} = v_n + g \Delta t \implies v_{n+1} = \frac{v_n + g \Delta t}{1 + \frac{\gamma \Delta t}{m}}$$

Here $g \Delta t = 9.81 \times 0.50 = 4.905\text{ m/s}$.
$$1 + \frac{\gamma \Delta t}{m} = 1 + \frac{4.0 \times 0.50}{2.0} = 1 + 1.00 = 2.00$$
Thus:
$$v_{n+1} = \frac{v_n + 4.905}{2.0} = 0.50 v_n + 2.4525$$

**Step 3: Stepping forward from $v_0 = 0$.**
- Step 1: $v_1 = 0.50(0) + 2.4525 = 2.4525\text{ m/s}$
- Step 2: $v_2 = 0.50(2.4525) + 2.4525 = 1.22625 + 2.4525 = 3.67875\text{ m/s}$
- Step 3: $v_3 = 0.50(3.67875) + 2.4525 = 1.839375 + 2.4525 = 4.29188\text{ m/s}$

**Step 4: Discrete steady state.**
At steady state, $v_{n+1} = v_n = v_{\infty}$:
$$v_{\infty} = 0.50 v_{\infty} + 2.4525 \implies 0.50 v_{\infty} = 2.4525 \implies v_{\infty} = 4.905\text{ m/s}$$
*Insight:* The semi-implicit integrator converges **exactly** to the true physical terminal velocity ($4.905\text{ m/s}$) with zero steady-state error, even with a massive timestep $\Delta t = 0.50\text{ s}$!

---

### Worked Example 11.4: Quadratic Drag and Newton-Raphson Velocity Solve
**Problem Statement:** A skydiver with total mass $m = 80.0\text{ kg}$ experiences quadratic aerodynamic drag $\mathbf{F}_{\text{drag}} = -\beta |v|v$ where $\beta = \frac{1}{2} \rho C_d A = 0.25\text{ kg/m}$. Gravity is $g = 9.81\text{ m/s}^2$. At $t_n$, downward speed is $v_n = 30.0\text{ m/s}$.
1. Compute the analytical terminal velocity $v_{\text{term}} = \sqrt{mg/\beta}$.
2. Write the non-linear implicit backward Euler equation for $v_{n+1}$ with $\Delta t = 0.10\text{ s}$.
3. Perform 2 iterations of Newton-Raphson to solve for $v_{n+1}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Analytical terminal velocity.**
$$v_{\text{term}} = \sqrt{\frac{mg}{\beta}} = \sqrt{\frac{80.0 \times 9.81}{0.25}} = \sqrt{\frac{784.8}{0.25}} = \sqrt{3139.2} \approx 56.0286\text{ m/s}$$

**Step 2: Non-linear implicit equation.**
Downward motion ($v > 0$):
$$v_{n+1} = v_n + \Delta t \left( g - \frac{\beta}{m} v_{n+1}^2 \right)$$
Define root-finding residual function $\Phi(v)$:
$$\Phi(v) = v - v_n - g \Delta t + \frac{\beta \Delta t}{m} v^2 = 0$$

Numerical constants:
- $v_n = 30.0\text{ m/s}$
- $g \Delta t = 9.81 \times 0.10 = 0.981\text{ m/s}$
- $\frac{\beta \Delta t}{m} = \frac{0.25 \times 0.10}{80.0} = \frac{0.025}{80.0} = 0.0003125\text{ m}^{-1}$

$$\Phi(v) = 0.0003125 v^2 + v - 30.981 = 0$$
Derivative:
$$\Phi'(v) = 2(0.0003125) v + 1 = 0.000625 v + 1$$

**Step 3: Newton-Raphson iterations.**
- Initial guess: $v^{(0)} = v_n = 30.0\text{ m/s}$.
  $$\Phi(30.0) = 0.0003125(900.0) + 30.0 - 30.981 = 0.28125 + 30.0 - 30.981 = -0.69975$$
  $$\Phi'(30.0) = 0.000625(30.0) + 1 = 0.01875 + 1 = 1.01875$$
  $$v^{(1)} = 30.0 - \frac{-0.69975}{1.01875} = 30.0 + 0.68687 = 30.6869\text{ m/s}$$

- Iteration 2:
  $$\Phi(30.6869) = 0.0003125(941.6858) + 30.6869 - 30.981 = 0.294277 + 30.6869 - 30.981 = +0.000177$$
  $$\Phi'(30.6869) = 0.000625(30.6869) + 1 = 1.019179$$
  $$v^{(2)} = 30.6869 - \frac{0.000177}{1.019179} = 30.6869 - 0.000174 = 30.6867\text{ m/s}$$
Newton-Raphson converges to 4 decimal places in just two iterations ($v_{n+1} = 30.687\text{ m/s}$).

---

### Worked Example 11.5: Regularized Coulomb Friction
**Problem Statement:** A block of mass $m = 10.0\text{ kg}$ slides horizontally on a rough surface with kinetic friction coefficient $\mu_k = 0.30$. Normal force is $N = mg = 98.1\text{ N}$. The maximum friction force is $F_{\text{fric, max}} = \mu_k N = 29.43\text{ N}$.
To eliminate chatter, the simulator employs hyperbolic tangent regularization:
$$F_{\text{fric}}(v) = -F_{\text{fric, max}} \tanh\left(\frac{v}{\epsilon_{\text{reg}}}\right)$$
with velocity threshold $\epsilon_{\text{reg}} = 0.05\text{ m/s}$.
1. Evaluate $F_{\text{fric}}$ at $v = 1.0\text{ m/s}$ (normal sliding).
2. Evaluate $F_{\text{fric}}$ at $v = 0.01\text{ m/s}$ (near-stiction creep).
3. Compute the effective numerical damping coefficient $\gamma_{\text{eff}} = \left. \frac{d F_{\text{fric}}}{dv} \right|_{v=0}$ at zero velocity.

**Step-by-Step Mathematical Solution:**

**Step 1: Normal sliding ($v = 1.0\text{ m/s}$).**
$$\frac{v}{\epsilon_{\text{reg}}} = \frac{1.0}{0.05} = 20.0$$
$$\tanh(20.0) = \frac{e^{20} - e^{-20}}{e^{20} + e^{-20}} \approx 1.00000000$$
$$F_{\text{fric}}(1.0) = -29.43 \times 1.00000000 = -29.43\text{ N}$$
Friction matches the classical Coulomb value perfectly.

**Step 2: Near-stiction creep ($v = 0.01\text{ m/s}$).**
$$\frac{v}{\epsilon_{\text{reg}}} = \frac{0.01}{0.05} = 0.20$$
$$\tanh(0.20) = \frac{e^{0.2} - e^{-0.2}}{e^{0.2} + e^{-0.2}} = \frac{1.221403 - 0.818731}{1.221403 + 0.818731} = \frac{0.402672}{2.040134} \approx 0.197375$$
$$F_{\text{fric}}(0.01) = -29.43 \times 0.197375 = -5.8087\text{ N}$$
The friction force smoothly scales down proportional to velocity rather than slamming at full $-29.43\text{ N}$.

**Step 3: Effective zero-velocity damping.**
Differentiating $F_{\text{fric}}(v)$:
$$\frac{d}{dv}\left[ -F_{\text{fric, max}} \tanh\left(\frac{v}{\epsilon_{\text{reg}}}\right) \right] = -\frac{F_{\text{fric, max}}}{\epsilon_{\text{reg}}} \text{sech}^2\left(\frac{v}{\epsilon_{\text{reg}}}\right)$$
At $v = 0$: $\text{sech}^2(0) = 1.0$.
$$\gamma_{\text{eff}} = \frac{F_{\text{fric, max}}}{\epsilon_{\text{reg}}} = \frac{29.43\text{ N}}{0.05\text{ m/s}} = 588.6\text{ N}\cdot\text{s/m}$$
Near zero, regularized Coulomb friction acts as an ultra-stiff linear viscous damper with $\gamma = 588.6\text{ N}\cdot\text{s/m}$, bringing the block smoothly to rest without sign-alternating chatter.

---

### Worked Example 11.6: Stiff Penalty Spring Linkage Explosion
**Problem Statement:** An inextensible suspension rod of length $L_0 = 1.0\text{ m}$ connects a fixed pivot to a mass $m = 2.0\text{ kg}$. A novice programmer models the rod with a penalty spring of stiffness $k = 800,000\text{ N/m}$. The simulation loop runs at a fixed timestep of $\Delta t = 1/60\text{ s} \approx 0.016667\text{ s}$.
1. Compute the natural frequency $\omega$ and period $T$ of the penalty spring.
2. Calculate the critical stability timestep $\Delta t_{\text{crit}}$ for Semi-Implicit Euler.
3. Determine how many sub-steps per frame are strictly required to avoid explosion.

**Step-by-Step Mathematical Solution:**

**Step 1: Natural frequency and period.**
$$\omega = \sqrt{\frac{k}{m}} = \sqrt{\frac{800,000}{2.0}} = \sqrt{400,000} \approx 632.456\text{ rad/s}$$
$$T = \frac{2\pi}{\omega} = \frac{6.283185}{632.456} \approx 0.009935\text{ s} \approx 9.935\text{ ms}$$

**Step 2: Critical stability timestep.**
For Semi-Implicit Euler:
$$\omega \Delta t_{\text{crit}} < 2.0 \implies \Delta t_{\text{crit}} = \frac{2.0}{632.456} \approx 0.003162\text{ s} \approx 3.162\text{ ms}$$

**Step 3: Sub-stepping requirement.**
The frame time is $\Delta t_{\text{frame}} = 16.667\text{ ms}$.
$$\text{Ratio} = \frac{\Delta t_{\text{frame}}}{\Delta t_{\text{crit}}} = \frac{16.667\text{ ms}}{3.162\text{ ms}} = 5.27$$
To ensure numerical stability:
$$\text{Required sub-steps} N_{\text{sub}} \ge \lceil 5.27 \rceil = 6\text{ sub-steps per frame}$$
With a safety margin factor of $1.5\times$, at least **8 to 10 sub-steps per frame** must be executed ($h \le 1.67\text{ ms}$). Without sub-stepping, the spring will detonate on the first frame!

---

### Worked Example 11.7: Modified Velocity Verlet for Damped Systems
**Problem Statement:** A damped oscillator ($m = 1.0\text{ kg}, k = 25.0\text{ N/m}, \gamma = 0.60\text{ N}\cdot\text{s/m}$) starts from $x_0 = 1.0\text{ m}, v_0 = 0.0\text{ m/s}$.
Using the symmetric damped Velocity Verlet algorithm:
1. $v_{n+1/2} = v_n + \frac{1}{2} a_{\text{pos}}(x_n) \Delta t$
2. $x_{n+1} = x_n + v_{n+1/2} \Delta t$
3. $v_{n+1} = \frac{v_{n+1/2} + \frac{1}{2} a_{\text{pos}}(x_{n+1}) \Delta t}{1 + \frac{\gamma \Delta t}{2m}}$

Execute one full step with $\Delta t = 0.10\text{ s}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Compute initial acceleration and half-kick velocity.**
$$a_{\text{pos}}(x_0) = -\frac{k}{m} x_0 = -\frac{25.0}{1.0}(1.0) = -25.0\text{ m/s}^2$$
$$v_{1/2} = v_0 + \frac{1}{2} a_{\text{pos}}(x_0) \Delta t = 0.0 + \frac{1}{2}(-25.0)(0.10) = -1.250\text{ m/s}$$

**Step 2: Full-drift position.**
$$x_1 = x_0 + v_{1/2} \Delta t = 1.0 + (-1.250)(0.10) = 1.0 - 0.125 = 0.875\text{ m}$$

**Step 3: New position acceleration and final damped kick.**
$$a_{\text{pos}}(x_1) = -\frac{k}{m} x_1 = -25.0(0.875) = -21.875\text{ m/s}^2$$
Denominator damping factor:
$$1 + \frac{\gamma \Delta t}{2m} = 1 + \frac{0.60 \times 0.10}{2(1.0)} = 1 + 0.030 = 1.030$$

Numerator:
$$v_{1/2} + \frac{1}{2} a_{\text{pos}}(x_1) \Delta t = -1.250 + \frac{1}{2}(-21.875)(0.10) = -1.250 - 1.09375 = -2.34375\text{ m/s}$$

Final velocity:
$$v_1 = \frac{-2.34375}{1.030} \approx -2.27549\text{ m/s}$$
At $t = 0.10\text{ s}$: $x_1 = 0.8750\text{ m}$, $v_1 = -2.2755\text{ m/s}$.

---

### Worked Example 11.8: Position-Based Dynamics (PBD) Distance Projection
**Problem Statement:** Two particles connected by a rigid rod of target rest length $L_0 = 2.0\text{ m}$ have masses $m_1 = 1.0\text{ kg}$ ($w_1 = 1.0$) and $m_2 = 3.0\text{ kg}$ ($w_2 = 1/3 \approx 0.3333$).
After an unconstrained inertial prediction step, their candidate positions are:
$$\tilde{\mathbf{x}}_1 = [0.0, 0.0]^T, \quad \tilde{\mathbf{x}}_2 = [2.4, 0.0]^T$$
1. Evaluate the distance constraint $C(\tilde{\mathbf{x}}_1, \tilde{\mathbf{x}}_2)$.
2. Calculate the constraint gradients $\nabla_1 C$ and $\nabla_2 C$.
3. Compute the position corrections $\Delta \mathbf{x}_1$ and $\Delta \mathbf{x}_2$.
4. Verify that the corrected positions satisfy the constraint exactly: $\|\mathbf{x}_1^* - \mathbf{x}_2^*\| = L_0$.

**Step-by-Step Mathematical Solution:**

**Step 1: Constraint evaluation.**
Current separation vector:
$$\mathbf{d}_{12} = \tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2 = [0.0 - 2.4, 0.0 - 0.0]^T = [-2.4, 0.0]^T$$
$$\|\mathbf{d}_{12}\| = 2.4\text{ m}$$
Constraint value:
$$C = \|\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2\| - L_0 = 2.4 - 2.0 = +0.40\text{ m} \quad (\text{Rod is stretched by } 0.40\text{ m})$$

**Step 2: Constraint gradients.**
$$\mathbf{n}_{12} = \frac{\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2}{\|\tilde{\mathbf{x}}_1 - \tilde{\mathbf{x}}_2\|} = \frac{[-2.4, 0.0]^T}{2.4} = [-1.0, 0.0]^T$$
$$\nabla_1 C = \mathbf{n}_{12} = [-1.0, 0.0]^T$$
$$\nabla_2 C = -\mathbf{n}_{12} = [+1.0, 0.0]^T$$

**Step 3: Position corrections.**
Sum of inverse masses:
$$w_{\text{tot}} = w_1 + w_2 = 1.0 + \frac{1}{3} = \frac{4}{3} \approx 1.33333$$
Correction for particle 1:
$$\Delta \mathbf{x}_1 = - \frac{w_1}{w_{\text{tot}}} C \mathbf{n}_{12} = - \frac{1.0}{4/3} (0.40) [-1.0, 0.0]^T = - \frac{3}{4} (0.40) [-1.0, 0.0]^T = -0.30 [-1.0, 0.0]^T = [+0.30, 0.0]^T\text{ m}$$

Correction for particle 2:
$$\Delta \mathbf{x}_2 = + \frac{w_2}{w_{\text{tot}}} C \mathbf{n}_{12} = + \frac{1/3}{4/3} (0.40) [-1.0, 0.0]^T = + \frac{1}{4} (0.40) [-1.0, 0.0]^T = +0.10 [-1.0, 0.0]^T = [-0.10, 0.0]^T\text{ m}$$

**Step 4: Final positions and verification.**
$$\mathbf{x}_1^* = \tilde{\mathbf{x}}_1 + \Delta \mathbf{x}_1 = [0.0, 0.0]^T + [0.30, 0.0]^T = [0.30, 0.0]^T\text{ m}$$
$$\mathbf{x}_2^* = \tilde{\mathbf{x}}_2 + \Delta \mathbf{x}_2 = [2.4, 0.0]^T + [-0.10, 0.0]^T = [2.30, 0.0]^T\text{ m}$$

Checking distance:
$$\|\mathbf{x}_1^* - \mathbf{x}_2^*\| = |0.30 - 2.30| = |-2.00| = 2.000\text{ m} \equiv L_0$$
*Physical verification:* The lighter particle ($1.0\text{ kg}$) moved $0.30\text{ m}$, while the heavier particle ($3.0\text{ kg}$) moved $0.10\text{ m}$. The center of mass remained completely stationary:
$$\Delta x_{\text{com}} = \frac{m_1 \Delta x_1 + m_2 \Delta x_2}{m_1 + m_2} = \frac{1.0(+0.30) + 3.0(-0.10)}{4.0} = \frac{0.30 - 0.30}{4.0} \equiv 0.00\text{ m}$$

---

### Worked Example 11.9: Extended PBD (XPBD) Compliance Formulation
**Problem Statement:** In XPBD, physical elasticity is modeled by compliance $\alpha = 1/k$. The Lagrange multiplier update is:
$$\Delta \lambda = \frac{-C(\tilde{\mathbf{x}}) - \tilde{\alpha} \lambda_0}{\sum_i w_i \|\nabla_i C\|^2 + \tilde{\alpha}}$$
where $\tilde{\alpha} = \frac{\alpha}{\Delta t^2} = \frac{1}{k \Delta t^2}$.
For the 2-particle system in Example 11.8 ($w_1 = 1.0, w_2 = 1/3, C = 0.40\text{ m}$), let spring stiffness be $k = 4800\text{ N/m}$ and timestep $\Delta t = 0.025\text{ s}$. Initial multiplier is $\lambda_0 = 0$.
1. Compute the discrete compliance factor $\tilde{\alpha}$.
2. Compute the multiplier $\Delta \lambda$.
3. Compute the resulting position corrections $\Delta \mathbf{x}_1$ and $\Delta \mathbf{x}_2$.
4. Compare the resulting rod length with the infinitely rigid PBD result.

**Step-by-Step Mathematical Solution:**

**Step 1: Computing discrete compliance $\tilde{\alpha}$.**
$$\tilde{\alpha} = \frac{1}{k \Delta t^2} = \frac{1}{4800 \times (0.025)^2} = \frac{1}{4800 \times 0.000625} = \frac{1}{3.0} \approx 0.33333\text{ kg}^{-1}$$

**Step 2: Multiplier update $\Delta \lambda$.**
$$\sum w_i \|\nabla_i C\|^2 = w_1 + w_2 = 1.0 + \frac{1}{3} = \frac{4}{3} \approx 1.33333\text{ kg}^{-1}$$
$$\text{Denominator} = \sum w_i + \tilde{\alpha} = \frac{4}{3} + \frac{1}{3} = \frac{5}{3} \approx 1.66667\text{ kg}^{-1}$$
$$\Delta \lambda = \frac{-C - \tilde{\alpha} (0)}{\frac{5}{3}} = \frac{-0.40}{5/3} = -0.40 \times \frac{3}{5} = -0.240\text{ kg}\cdot\text{m}$$

**Step 3: Position corrections.**
$$\Delta \mathbf{x}_i = w_i \Delta \lambda \nabla_i C$$
- For particle 1 ($\nabla_1 C = [-1.0, 0.0]^T$):
  $$\Delta \mathbf{x}_1 = (1.0)(-0.240)[-1.0, 0.0]^T = [+0.240, 0.0]^T\text{ m}$$
- For particle 2 ($\nabla_2 C = [+1.0, 0.0]^T$):
  $$\Delta \mathbf{x}_2 = \left(\frac{1}{3}\right)(-0.240)[+1.0, 0.0]^T = [-0.080, 0.0]^T\text{ m}$$

**Step 4: New rod length and physical comparison.**
$$\mathbf{x}_1^* = [0.0, 0.0] + [0.240, 0.0] = [0.240, 0.0]^T\text{ m}$$
$$\mathbf{x}_2^* = [2.4, 0.0] + [-0.080, 0.0] = [2.320, 0.0]^T\text{ m}$$
$$L_{\text{new}} = 2.320 - 0.240 = 2.080\text{ m}$$
*Comparison:* In rigid PBD ($k \to \infty, \tilde{\alpha} = 0$), the rod was restored to exactly $2.000\text{ m}$ ($\Delta L = 0.40\text{ m}$ closed). In XPBD with physical compliance $k = 4800\text{ N/m}$, the rod retains a physically realistic elastic stretch of $0.080\text{ m}$ ($20\%$ stretch remains), perfectly independent of timestep size!

---

### Worked Example 11.10: Multi-Force Integrator Tick Execution
**Problem Statement:** A physics engine integrates a particle ($m = 2.0\text{ kg}$) subject simultaneously to:
- Constant gravity $\mathbf{F}_g = [0, -19.62]^T\text{ N}$
- Quadratic air drag $\mathbf{F}_{\text{drag}} = -0.10 \|\mathbf{v}\|\mathbf{v}\text{ N}$
- Floor penalty contact spring when $y < 0$: $F_{\text{contact}} = -k_{\text{floor}} y - \gamma_{\text{floor}} v_y$ with $k_{\text{floor}} = 2000\text{ N/m}$ and $\gamma_{\text{floor}} = 50\text{ N}\cdot\text{s/m}$.

Current state at $t = 0$: $\mathbf{x}_0 = [5.0, -0.02]^T\text{ m}$ (penetrating the floor by $2\text{ cm}$), velocity $\mathbf{v}_0 = [3.0, -4.0]^T\text{ m/s}$.
Execute one timestep using the Semi-Implicit operator with $\Delta t = 0.005\text{ s}$ ($5\text{ ms}$).

**Step-by-Step Mathematical Solution:**

**Step 1: Compute non-damping forces at $t = 0$.**
Current speed: $\|\mathbf{v}_0\| = \sqrt{3.0^2 + (-4.0)^2} = \sqrt{9 + 16} = 5.0\text{ m/s}$.
- Drag force:
  $$\mathbf{F}_{\text{drag}} = -0.10(5.0)[3.0, -4.0]^T = -0.50[3.0, -4.0]^T = [-1.50, +2.00]^T\text{ N}$$
- Contact elastic spring (active because $y = -0.02 < 0$):
  $$F_{\text{spring}, y} = -k_{\text{floor}} y = -2000(-0.02) = +40.00\text{ N}$$
- Gravity: $\mathbf{F}_g = [0.0, -19.62]^T\text{ N}$.

Summing non-velocity-damping explicit forces:
$$F_{\text{explicit}, x} = 0.0 - 1.50 = -1.50\text{ N}$$
$$F_{\text{explicit}, y} = -19.62 + 2.00 + 40.00 = +22.38\text{ N}$$

Explicit accelerations:
$$a_{\text{explicit}, x} = \frac{-1.50}{2.0} = -0.75\text{ m/s}^2$$
$$a_{\text{explicit}, y} = \frac{+22.38}{2.0} = +11.19\text{ m/s}^2$$

**Step 2: Implicit damping update on velocity.**
In the $y$-direction, floor contact damping is active: $\gamma_{\text{floor}} = 50\text{ N}\cdot\text{s/m}$.
$$v_{y, 1} = \frac{v_{y, 0} + a_{\text{explicit}, y} \Delta t}{1 + \frac{\gamma_{\text{floor}} \Delta t}{m}}$$
Denominator:
$$1 + \frac{50 \times 0.005}{2.0} = 1 + \frac{0.25}{2.0} = 1 + 0.125 = 1.125$$
Numerator:
$$v_{y, 0} + a_{\text{explicit}, y} \Delta t = -4.0 + (11.19)(0.005) = -4.0 + 0.05595 = -3.94405\text{ m/s}$$
Resulting $y$-velocity:
$$v_{y, 1} = \frac{-3.94405}{1.125} \approx -3.50582\text{ m/s}$$

In the $x$-direction (no contact damping):
$$v_{x, 1} = v_{x, 0} + a_{\text{explicit}, x} \Delta t = 3.0 + (-0.75)(0.005) = 3.0 - 0.00375 = 2.99625\text{ m/s}$$

**Step 3: Update position.**
$$\mathbf{x}_1 = \mathbf{x}_0 + \mathbf{v}_1 \Delta t$$
$$x_1 = 5.0 + (2.99625)(0.005) = 5.0 + 0.014981 = 5.01498\text{ m}$$
$$y_1 = -0.02 + (-3.50582)(0.005) = -0.02 - 0.017529 = -0.03753\text{ m}$$

State after 1 tick ($t = 5\text{ ms}$):
$$\mathbf{x}_1 = [5.0150, -0.0375]^T\text{ m}, \quad \mathbf{v}_1 = [2.9963, -3.5058]^T\text{ m/s}$$
The combination of upward spring thrust and contact damping has already begun arresting downward momentum smoothly.

---

## 11.7 Chapter Mastery Exercises

### Exercise 11.1 (Tier 1): Viscous Stopping Distance
A projectile of mass $m = 0.20\text{ kg}$ is fired into gel with linear drag $\gamma = 2.5\text{ N}\cdot\text{s/m}$ at initial velocity $v_0 = 40.0\text{ m/s}$. Prove that the total theoretical stopping distance $x_{\infty} = \int_0^\infty v(t) dt$ is finite and compute its exact value.

### Exercise 11.2 (Tier 1): Quadratic Drag Velocity Halving Time
An arrow of mass $m = 0.03\text{ kg}$ experiences quadratic drag with factor $\beta = 0.0015\text{ kg/m}$. If launched at $v_0 = 80.0\text{ m/s}$, calculate the exact time $t_{1/2}$ at which its velocity drops to $40.0\text{ m/s}$.

### Exercise 11.3 (Tier 2): Forward Euler Damping Instability Limit
For a damped oscillator with mass $m = 0.5\text{ kg}$, spring constant $k = 50.0\text{ N/m}$, and damping $\gamma = 12.0\text{ N}\cdot\text{s/m}$, find the critical timestep $\Delta t_{\text{damp}}$ above which explicit Forward Euler exhibits velocity sign-reversal chatter.

### Exercise 11.4 (Tier 2): Exponential Decay Operator Conservation
Show that when gravity is zero, the discrete velocity update $v_{n+1} = v_n \exp(-\gamma \Delta t / m)$ guarantees that the sign of $v_{n+1}$ is identical to $v_n$ for every possible choice of $\Delta t \in (0, \infty)$ and $\gamma > 0$.

### Exercise 11.5 (Tier 3): Regularized Friction Parameter Selection
A game developer wants to simulate dry tire friction on asphalt ($F_N = 4000\text{ N}, \mu = 0.8$). To prevent jitter when parked, they choose $\epsilon_{\text{reg}} = 0.10\text{ m/s}$. What is the equivalent linear damping coefficient $\gamma_{\text{creep}}$ for velocities $|v| < 0.02\text{ m/s}$?

### Exercise 11.6 (Tier 3): Implicit Quadratic Drag Operator
Derive the exact closed-form algebraic solution for $v_{n+1}$ from the Backward Euler equation $v_{n+1} = v_n - \frac{\beta \Delta t}{m} v_{n+1}^2$ for positive 1D velocity $v > 0$.

### Exercise 11.7 (Tier 4): PBD Inextensible Rope Chain
Three particles $P_1, P_2, P_3$ of identical mass $m = 1.0\text{ kg}$ lie along a line. Distance constraints require $\|P_1 - P_2\| = 1.0\text{ m}$ and $\|P_2 - P_3\| = 1.0\text{ m}$. After prediction, positions are $\tilde{x}_1 = 0.0, \tilde{x}_2 = 1.4, \tilde{x}_3 = 2.6$.
Execute one Gauss-Seidel PBD constraint projection pass (solving constraint 1, then constraint 2).

### Exercise 11.8 (Tier 4): XPBD Stiffness Invariance
Prove that for an unconstrained initial separation $C_0$, the position correction $\Delta x$ in XPBD approaches the rigid PBD correction as compliance $\alpha \to 0$, and approaches zero as $\alpha \to \infty$.

### Exercise 11.9 (Tier 5): Stiff Penalty Spring vs XPBD Stability Limit
A cloth mesh requires a spring stiffness of $k = 500,000\text{ N/m}$ between nodes of mass $m = 0.02\text{ kg}$.
1. Compute the maximum allowable timestep for a penalty spring integrator under Velocity Verlet.
2. If the game engine renders at $60\text{ Hz}$ ($\Delta t = 16.67\text{ ms}$), how many sub-steps are needed for the penalty spring?
3. Explain why XPBD can run this exact cloth mesh with 1 step per frame without exploding.

### Exercise 11.10 (Tier 5): Deriving the Damped Symplectic Determinant
For the damped Velocity Verlet algorithm in Section 11.3:
$$\mathbf{y}_{n+1} = \mathbf{M}_{\text{damped}} \mathbf{y}_n$$
Compute the determinant $\det(\mathbf{M}_{\text{damped}})$ and prove that it contracts phase space by $\approx 1 - \frac{\gamma \Delta t}{m}$, in exact accordance with physical dissipation.

---

## 11.8 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 11.1
From $m \dot{v} = -\gamma v$, we have $v(t) = v_0 e^{-\frac{\gamma}{m} t}$.
The total distance traveled as $t \to \infty$ is:
$$x_{\infty} = \int_0^\infty v(t) dt = \int_0^\infty v_0 e^{-\frac{\gamma}{m} t} dt = \left[ -v_0 \frac{m}{\gamma} e^{-\frac{\gamma}{m} t} \right]_0^\infty = 0 - \left( -v_0 \frac{m}{\gamma} \right) = \frac{m v_0}{\gamma}$$
Substituting given numerical values:
$$x_{\infty} = \frac{(0.20\text{ kg})(40.0\text{ m/s})}{2.5\text{ kg/s}} = \frac{8.0}{2.5} = 3.20\text{ meters}$$
The projectile comes to a complete halt after traveling exactly $3.20\text{ meters}$.

---

### Solution to Exercise 11.2
From Section 11.1.2, velocity under 1D quadratic drag is:
$$v(t) = \frac{v_0}{1 + \frac{\beta v_0}{m} t}$$
Setting $v(t_{1/2}) = \frac{1}{2} v_0$:
$$\frac{v_0}{1 + \frac{\beta v_0}{m} t_{1/2}} = \frac{1}{2} v_0 \implies 1 + \frac{\beta v_0}{m} t_{1/2} = 2 \implies \frac{\beta v_0}{m} t_{1/2} = 1$$
$$t_{1/2} = \frac{m}{\beta v_0}$$
Substituting values:
$$t_{1/2} = \frac{0.03\text{ kg}}{(0.0015\text{ kg/m})(80.0\text{ m/s})} = \frac{0.03}{0.12} = 0.25\text{ seconds}$$
The arrow loses half its velocity in exactly $250\text{ milliseconds}$.

---

### Solution to Exercise 11.3
In Explicit Forward Euler, the velocity update is $v_{n+1} = (1 - \frac{\gamma \Delta t}{m})v_n$.
Sign-reversal chatter begins when the coefficient becomes negative:
$$1 - \frac{\gamma \Delta t}{m} < 0 \implies \Delta t > \Delta t_{\text{damp}} = \frac{m}{\gamma}$$
Substituting $m = 0.5\text{ kg}$ and $\gamma = 12.0\text{ N}\cdot\text{s/m}$:
$$\Delta t_{\text{damp}} = \frac{0.50}{12.0} = \frac{1}{24}\text{ s} \approx 0.04167\text{ s} = 41.67\text{ ms}$$

---

### Solution to Exercise 11.4
The exponential decay operator is:
$$v_{n+1} = v_n \exp\left(-\frac{\gamma \Delta t}{m}\right)$$
For any physical mass $m > 0$, damping coefficient $\gamma > 0$, and timestep $\Delta t > 0$:
$$\frac{\gamma \Delta t}{m} \in (0, \infty) \implies -\frac{\gamma \Delta t}{m} \in (-\infty, 0)$$
Because the real exponential function satisfies $\exp(u) > 0$ strictly for all $u \in \mathbb{R}$:
$$\exp\left(-\frac{\gamma \Delta t}{m}\right) \in (0, 1) \quad \text{strictly}$$
Therefore:
$$\text{sgn}(v_{n+1}) = \text{sgn}\left( v_n \cdot \exp\left(-\frac{\gamma \Delta t}{m}\right) \right) = \text{sgn}(v_n) \cdot \text{sgn}\left(\exp\left(-\frac{\gamma \Delta t}{m}\right)\right) = \text{sgn}(v_n) \cdot (+1) \equiv \text{sgn}(v_n)$$
Velocity never reverses sign, and magnitude decays monotonically: $|v_{n+1}| < |v_n|$. $\blacksquare$

---

### Solution to Exercise 11.5
The maximum friction force is:
$$F_{\text{fric, max}} = \mu F_N = 0.8 \times 4000\text{ N} = 3200\text{ N}$$
For small velocities $|v| \ll \epsilon_{\text{reg}}$, we use the Taylor expansion $\tanh(u) = u - \frac{u^3}{3} + \dots \approx u$:
$$F_{\text{fric}}(v) \approx -F_{\text{fric, max}} \left(\frac{v}{\epsilon_{\text{reg}}}\right) = -\left(\frac{F_{\text{fric, max}}}{\epsilon_{\text{reg}}}\right) v = -\gamma_{\text{creep}} v$$
Thus:
$$\gamma_{\text{creep}} = \frac{F_{\text{fric, max}}}{\epsilon_{\text{reg}}} = \frac{3200\text{ N}}{0.10\text{ m/s}} = 32,000\text{ N}\cdot\text{s/m}$$
For $|v| < 0.02\text{ m/s}$, the tire behaves as a linear viscous damper with $\gamma = 32,000\text{ kg/s}$.

---

### Solution to Exercise 11.6
The equation is:
$$\frac{\beta \Delta t}{m} v_{n+1}^2 + v_{n+1} - v_n = 0$$
Let $A = \frac{\beta \Delta t}{m} > 0$, $B = 1$, and $C = -v_n < 0$ (for $v_n > 0$).
Using the standard quadratic formula:
$$v_{n+1} = \frac{-B \pm \sqrt{B^2 - 4AC}}{2A} = \frac{-1 \pm \sqrt{1 + 4\frac{\beta \Delta t}{m} v_n}}{2\frac{\beta \Delta t}{m}}$$
Since physical speed must remain non-negative, we select the positive root ($+$):
$$v_{n+1} = \frac{-1 + \sqrt{1 + 4\frac{\beta \Delta t}{m} v_n}}{2\frac{\beta \Delta t}{m}}$$
To prevent floating-point catastrophic cancellation when $\Delta t \to 0$, multiply by conjugate:
$$v_{n+1} = \frac{4\frac{\beta \Delta t}{m} v_n}{2\frac{\beta \Delta t}{m} \left(1 + \sqrt{1 + 4\frac{\beta \Delta t}{m} v_n}\right)} = \frac{2 v_n}{1 + \sqrt{1 + 4\frac{\beta \Delta t}{m} v_n}}$$
This gives an exact, division-by-zero-safe, closed-form update.

---

### Solution to Exercise 11.7
All masses are $m = 1.0\text{ kg} \implies w_1 = w_2 = w_3 = 1.0$.
Initial positions: $\tilde{x}_1 = 0.0, \tilde{x}_2 = 1.4, \tilde{x}_3 = 2.6$.

- **Pass on Constraint 1:** $C_1 = |x_1 - x_2| - 1.0 = (1.4 - 0.0) - 1.0 = +0.40\text{ m}$.
  $$\Delta x_1 = +\frac{w_1}{w_1 + w_2} C_1 = +\frac{1}{2}(0.40) = +0.20\text{ m} \implies x_1 = 0.0 + 0.20 = 0.20\text{ m}$$
  $$\Delta x_2 = -\frac{w_2}{w_1 + w_2} C_1 = -\frac{1}{2}(0.40) = -0.20\text{ m} \implies x_2 = 1.4 - 0.20 = 1.20\text{ m}$$

- **Pass on Constraint 2:** Using updated $x_2 = 1.20$ and $x_3 = 2.60$:
  $$C_2 = |x_2 - x_3| - 1.0 = (2.60 - 1.20) - 1.0 = 1.40 - 1.0 = +0.40\text{ m}$$
  $$\Delta x_2 = +\frac{w_2}{w_2 + w_3} C_2 = +\frac{1}{2}(0.40) = +0.20\text{ m} \implies x_2 = 1.20 + 0.20 = 1.40\text{ m}$$
  $$\Delta x_3 = -\frac{w_3}{w_2 + w_3} C_2 = -\frac{1}{2}(0.40) = -0.20\text{ m} \implies x_3 = 2.60 - 0.20 = 2.40\text{ m}$$

Final positions after 1 Gauss-Seidel pass:
$$x_1 = 0.20\text{ m}, \quad x_2 = 1.40\text{ m}, \quad x_3 = 2.40\text{ m}$$
(Separations: $|x_2 - x_1| = 1.20\text{ m}$, $|x_3 - x_2| = 1.00\text{ m}$; additional iterations converge all constraints simultaneously).

---

### Solution to Exercise 11.8
The XPBD position correction formula is:
$$\Delta \mathbf{x}_i = - \frac{w_i}{\sum_j w_j \|\nabla_j C\|^2 + \tilde{\alpha}} C(\tilde{\mathbf{x}}) \nabla_i C$$
where $\tilde{\alpha} = \frac{\alpha}{\Delta t^2}$.
1. **As compliance $\alpha \to 0$ (infinitely stiff limit):**
   $$\lim_{\alpha \to 0} \tilde{\alpha} = 0 \implies \Delta \mathbf{x}_i = - \frac{w_i}{\sum_j w_j \|\nabla_j C\|^2} C(\tilde{\mathbf{x}}) \nabla_i C$$
   This matches the standard rigid PBD formulation exactly.
2. **As compliance $\alpha \to \infty$ (infinitely soft limit, zero spring force):**
   $$\lim_{\alpha \to \infty} \tilde{\alpha} = \infty \implies \lim_{\tilde{\alpha} \to \infty} \frac{w_i}{\sum_j w_j \|\nabla_j C\|^2 + \tilde{\alpha}} = 0 \implies \Delta \mathbf{x}_i = \mathbf{0}$$
   The particles experience zero correction and continue along unconstrained inertial paths. $\blacksquare$

---

### Solution to Exercise 11.9
1. **Critical timestep for penalty spring:**
   $$\omega = \sqrt{\frac{k}{m}} = \sqrt{\frac{500,000}{0.02}} = \sqrt{25,000,000} = 5000\text{ rad/s}$$
   $$\Delta t_{\text{crit}} = \frac{2}{\omega} = \frac{2}{5000} = 0.00040\text{ s} = 0.40\text{ ms}$$
2. **Sub-steps at $60\text{ Hz}$:**
   $$\Delta t_{\text{frame}} = \frac{1}{60}\text{ s} \approx 16.67\text{ ms}$$
   $$N_{\text{sub}} = \frac{16.67\text{ ms}}{0.40\text{ ms}} = 41.675 \implies \mathbf{42\text{ sub-steps per frame minimum}}$$
3. **Why XPBD runs in 1 step:**
   XPBD does not integrate acceleration from spring forces through an explicit differential equation. Instead, it solves an optimization problem that projects particle positions directly onto the constrained manifold. Because position projection has no high-frequency differential eigenvalue to destabilize, the scheme is **unconditionally contractive** for any timestep $\Delta t$, allowing a single $16.67\text{ ms}$ step without explosion.

---

### Solution to Exercise 11.10
Let $\zeta = \frac{\gamma \Delta t}{2m}$. The damped Velocity Verlet matrix update from $[x_n, v_n]^T$ to $[x_{n+1}, v_{n+1}]^T$ for a linear system $a = -\omega^2 x$ is:
$$x_{n+1} = x_n + \Delta t \left( v_n - \frac{1}{2}\omega^2 \Delta t x_n \right) = \left(1 - \frac{1}{2}\omega^2 \Delta t^2\right) x_n + \Delta t v_n$$
$$v_{n+1} = \frac{1}{1 + \zeta} \left[ v_n - \frac{1}{2}\omega^2 \Delta t x_n - \frac{1}{2}\omega^2 \Delta t x_{n+1} \right]$$

Substituting $x_{n+1}$:
$$v_{n+1} = \frac{1}{1 + \zeta} \left[ -\omega^2 \Delta t \left(1 - \frac{1}{4}\omega^2 \Delta t^2\right) x_n + \left(1 - \frac{1}{2}\omega^2 \Delta t^2\right) v_n \right]$$
The transformation matrix is:
$$\mathbf{M} = \begin{bmatrix} 1 - \frac{1}{2}\omega^2 \Delta t^2 & \Delta t \\ -\frac{\omega^2 \Delta t (1 - \frac{1}{4}\omega^2 \Delta t^2)}{1 + \zeta} & \frac{1 - \frac{1}{2}\omega^2 \Delta t^2}{1 + \zeta} \end{bmatrix}$$
Factoring out $\frac{1}{1 + \zeta}$ from the second row:
$$\det(\mathbf{M}) = \frac{1}{1 + \zeta} \det \begin{bmatrix} 1 - \frac{1}{2}\omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t (1 - \frac{1}{4}\omega^2 \Delta t^2) & 1 - \frac{1}{2}\omega^2 \Delta t^2 \end{bmatrix}$$
The inner determinant is the standard undamped Velocity Verlet determinant, which equals identically $1.0$:
$$\left(1 - \frac{1}{2}\omega^2 \Delta t^2\right)^2 + \omega^2 \Delta t^2 \left(1 - \frac{1}{4}\omega^2 \Delta t^2\right) = 1 - \omega^2 \Delta t^2 + \frac{1}{4}\omega^4 \Delta t^4 + \omega^2 \Delta t^2 - \frac{1}{4}\omega^4 \Delta t^4 = 1.0$$
Therefore:
$$\det(\mathbf{M}) = \frac{1}{1 + \zeta} = \frac{1}{1 + \frac{\gamma \Delta t}{2m}} \approx 1 - \frac{\gamma \Delta t}{2m} + \mathcal{O}(\Delta t^2)$$
Phase space volume contracts monotonically by exactly the physical damping factor per half-step, proving the numerical scheme accurately mirrors macroscopic thermodynamic dissipation. $\blacksquare$
