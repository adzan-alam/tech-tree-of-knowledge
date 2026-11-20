# Numerical Integration: Euler, Symplectic Phase-Space, and Velocity Verlet

---

## 🎯 Pedagogical Roadmap & Learning Contract

How do we simulate the trajectory of a bullet, the orbit of a planet around the sun, the swing of a grandfather clock, or the suspension of an autonomous rover on a digital computer?

Isaac Newton gave humanity the differential laws of motion:
$$\vec{F} = m \frac{d^2\vec{x}}{dt^2}$$

Yet as early as 1687, Newton discovered a shocking dilemma: while a single planet orbiting the sun can be solved cleanly with pencil and paper, adding just *one more planet*—the three-body problem—destroys all closed-form mathematical solutions. To predict the future of complex systems, humanity must compute numerically: stepping differential equations forward in small, discrete temporal slices $\Delta t$.

This module assumes no prior numerical methods experience. We begin at Class 6 level with the intuitive mystery of the "Exploding Trampoline," dissect phase space and Liouville's geometric conservation theorem, prove mathematically why naive Forward Euler generates infinite artificial energy, derive the symplectic Semi-Implicit Euler and Velocity Verlet algorithms with zero skipped steps, and construct an industrial-grade TypeScript numerical suite.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     THE 9-LEVEL COGNITIVE LADDER                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Level 0: The Exploding Trampoline Paradox (Class 6 Anchor)              │
│ Level 1: What is an Initial Value Problem? (Continuous to Discrete)     │
│ Level 2: The Phase-Space Universe & Liouville's Volume Theorem          │
│ Level 3: The Explicit Euler Catastrophe & Matrix Determinant Proof     │
│ Level 4: The Symplectic Revolution: Semi-Implicit (Euler-Cromer)        │
│ Level 5: The Gold Standard: Velocity Verlet & The Leapfrog Scheme       │
│ Level 6: Non-Conservative Dynamics, RK4 & The CFL Stability Criterion   │
│ Level 7: Production-Grade TypeScript Numerical Integrator Suite         │
│ Level 8: Multi-Tiered Practice Problems with Complete Worked Solutions │
│ Level 9: Philosophical Horizons: Time Reversibility & Symplectic Nature │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Level 0: The Anchor Paradox — The Exploding Trampoline

### The Class 6 Thought Experiment: The Trampoline That Defied Gravity
Imagine you are jumping on a backyard trampoline. 
When you drop from a height of $1\text{ meter}$, your gravitational energy turns into kinetic energy. You hit the elastic nylon mesh; it stretches down, absorbs your momentum, halts your descent, and launches you upward. In a frictionless world, you would rise back up to exactly $1\text{ meter}$, turn around, and bounce forever.

Now, imagine you hire a junior video game programmer to build a computer simulation of your trampoline. The programmer writes the simplest, most intuitive logic imaginable:
1. Look at where you are right now: $x_0$.
2. Look at how fast you are moving right now: $v_0$.
3. Compute your next position after $0.1\text{ seconds}$: $x_1 = x_0 + v_0 \cdot (0.1)$.
4. Compute your new speed from the trampoline spring: $v_1 = v_0 + a_0 \cdot (0.1)$.

You press "Run." 
- On bounce 1, you bounce to $1.1\text{ meters}$.
- On bounce 2, you shoot up to $1.4\text{ meters}$.
- On bounce 5, you launch to $4.0\text{ meters}$ high!
- On bounce 10, the character flies at Mach 3 into the stratosphere and vanishes from the screen!

```
Real Trampoline (Conserves Energy):
Height |
1.0m   |   /\      /\      /\      /\
0.0m   +──/──\────/──\────/──\────/──\───> Time
          (Bounded, Perpetual Oscillation)

Naive Computer Trampoline (Explicit Euler):
Height |                           / (BOOM!)
       |                   /\     /
       |           /\     /  \   /
1.0m   |   /\     /  \   /    \ /
0.0m   +──/──\───/────\_/──────V─────────> Time
          (Artificial Energy Explosion!)
```

### The Central Paradox
Where did this colossal energy come from?
- There was no engine attached to the trampoline.
- No rocket boosters were ignited.
- The spring stiffness $k$ was constant.
- Gravity $g$ did not change.

**The energy was created out of thin air by a mathematical illusion.** 
By assuming that your velocity at the *start* of a time slice remains constant across the entire duration of the slice, the computer systematically underestimated the braking force of the spring! Over dozens of ticks, those tiny micro-errors multiplied geometrically, injecting massive artificial kinetic energy into the simulation.

To create stable video games, accurate aerospace guidance systems, and molecular biology simulations, we must uncover the mathematical antidote to this energy explosion: **Symplectic Geometric Integration**.

---

## Level 1: What is an Initial Value Problem?

### 1.1 From Physical Law to Differential Equation
Newton's Second Law of Motion states that an object's acceleration is governed by the vector sum of all forces acting upon it:

$$\vec{a}(t) = \frac{d^2\vec{x}(t)}{dt^2} = \frac{\vec{F}\left(\vec{x}(t), \vec{v}(t), t\right)}{m}$$

This is a **second-order Ordinary Differential Equation (ODE)**. It does not tell us where the object is located at 12:00 PM; it tells us how its position will *bend* and *accelerate* given its current environment.

### 1.2 The Cauchy Initial Value Problem (IVP)
To determine the unique physical path an object takes through spacetime, differential equations require **Initial Conditions** specified at time $t_0$:
1. Initial Position: $\vec{x}(t_0) = \vec{x}_0$
2. Initial Velocity: $\vec{v}(t_0) = \vec{v}_0$

By the **Picard-Lindelöf Existence and Uniqueness Theorem**, if the force function $\vec{F}$ is continuous and Lipschitz-bounded, there exists a unique, unbroken trajectory $\vec{x}(t)$ satisfying the equation.

In computational physics, our goal is to approximate this continuous trajectory $\vec{x}(t)$ at discrete timestamps:
$$t_k = t_0 + k \cdot \Delta t, \quad k \in \{0, 1, 2, \dots, N\}$$

---

## Level 2: The Phase-Space Universe & Liouville's Volume Theorem

To understand why simple numerical methods fail, we must adopt the geometric perspective invented by **William Rowan Hamilton** and **Josiah Willard Gibbs**: **Phase Space**.

### 2.1 The State in Phase Space
Instead of viewing motion as a 3D coordinate moving across time, Hamiltonian mechanics treats the entire state of a particle as a single point in a higher-dimensional space composed of **Position** ($\vec{x}$) and **Momentum** ($\vec{p} = m\vec{v}$):

$$\mathbf{z} = \begin{bmatrix} \vec{x} \\ \vec{p} \end{bmatrix} \in \mathbb{R}^{2d}$$

For a 1D harmonic oscillator (a mass on a spring), phase space is a 2D plane with $x$ on the horizontal axis and $p$ on the vertical axis:

```
        Momentum p ^
                   |       /-------\
        +p_max     |      /         \
                   |     |     ●     |   Closed Elliptical Orbit
         0         +-----+─────┼─────+----> Position x
                   |     |  -x_max  +x_max
        -p_max     |      \         /    (Total Energy E is constant)
                   |       \-------/
```

As the mass oscillates:
- At maximum stretch ($x = +x_{\text{max}}$), speed is zero ($p = 0$).
- As it snaps through the center ($x = 0$), momentum reaches maximum magnitude ($p = -p_{\text{max}}$).
- The state point traces a **closed, perfect ellipse** in phase space for all eternity. The total mechanical energy $E = \frac{p^2}{2m} + \frac{1}{2}kx^2$ is exactly constant.

### 2.2 Liouville's Theorem: The Incompressibility of Nature
In 1838, French mathematician **Joseph Liouville** proved a profound theorem that forms the backbone of classical statistical mechanics:

> **Liouville's Theorem:** For any conservative physical system governed by Newton's or Hamilton's laws, the volume of any arbitrary cluster of states moving through phase space is **strictly conserved over time**.

Mathematically, the phase-space velocity field $\vec{w} = \begin{bmatrix} \dot{\vec{x}} \\ \dot{\vec{p}} \end{bmatrix} = \begin{bmatrix} \vec{p}/m \\ -\nabla U(\vec{x}) \end{bmatrix}$ is divergence-free:

$$\nabla \cdot \vec{w} = \sum_{i=1}^d \left( \frac{\partial \dot{x}_i}{\partial x_i} + \frac{\partial \dot{p}_i}{\partial p_i} \right) = \sum_{i=1}^d \left( \frac{\partial}{\partial x_i}\left(\frac{p_i}{m}\right) + \frac{\partial}{\partial p_i}\left(-\frac{\partial U}{\partial x_i}\right) \right) = 0 + 0 = 0$$

Phase space behaves like an **ideal, incompressible fluid**! A cloud of initial states can distort, shear, and stretch into a long filament, but its geometric area/volume can **never expand and never shrink**.

### 2.3 What Makes an Integrator "Symplectic"?
A discrete numerical algorithm is called **symplectic** if the discrete mapping:
$$\begin{bmatrix} \vec{x}_{k+1} \\ \vec{p}_{k+1} \end{bmatrix} = \mathbf{\Psi}_{\Delta t} \begin{bmatrix} \vec{x}_k \\ \vec{p}_k \end{bmatrix}$$
preserves the differential phase-space volume element identically:

$$\det \left( \frac{\partial (\vec{x}_{k+1}, \vec{p}_{k+1})}{\partial (\vec{x}_k, \vec{p}_k)} \right) = 1.0000000\dots$$

- If $\det > 1$: Phase-space area expands. The algorithm pumps artificial energy into the universe (The Exploding Trampoline).
- If $\det < 1$: Phase-space area contracts. The algorithm acts as artificial glue, draining kinetic energy and freezing the system.
- If $\det = 1$: Phase-space area is conserved. The system remains stable for billions of steps!

---

## Level 3: The Explicit Euler Catastrophe & Matrix Determinant Proof

### 3.1 The Forward (Explicit) Euler Method
The most obvious numerical approximation replaces derivatives with forward finite differences:
$$\frac{\vec{x}_{k+1} - \vec{x}_k}{\Delta t} \approx \vec{v}_k \implies \vec{x}_{k+1} = \vec{x}_k + \vec{v}_k \Delta t$$
$$\frac{\vec{v}_{k+1} - \vec{v}_k}{\Delta t} \approx \vec{a}_k \implies \vec{v}_{k+1} = \vec{v}_k + \vec{a}(\vec{x}_k) \Delta t$$

### 3.2 Rigorous Proof of Explicit Euler's Instability
Let us apply Explicit Euler to the prototypical conservative system: the Simple Harmonic Oscillator with unit mass ($m = 1$) and spring constant $k = \omega^2$:
$$a(x) = -\omega^2 x$$

Substitute this acceleration into the Explicit Euler equations:
$$x_{k+1} = x_k + \Delta t \cdot v_k$$
$$v_{k+1} = v_k - \omega^2 \Delta t \cdot x_k$$

We express this discrete update as a $2 \times 2$ state transition matrix $\mathbf{M}_{\text{EE}}$:
$$\begin{bmatrix} x_{k+1} \\ v_{k+1} \end{bmatrix} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} \begin{bmatrix} x_k \\ v_k \end{bmatrix}$$

Now, compute the Jacobian determinant of this transformation:
$$\det(\mathbf{M}_{\text{EE}}) = (1)(1) - (\Delta t)(-\omega^2 \Delta t) = 1 + \omega^2 \Delta t^2$$

#### The Geometric Consequence:
Because $\omega > 0$ and $\Delta t > 0$:
$$\det(\mathbf{M}_{\text{EE}}) = 1 + \omega^2 \Delta t^2 > 1.0 \quad \text{ALWAYS!}$$

On **every single discrete time step**, the phase-space area occupied by the system grows by a factor of $(1 + \omega^2 \Delta t^2)$!
After $N$ simulation steps, the total mechanical energy has multiplied by:
$$E_N \approx E_0 \cdot \left(1 + \omega^2 \Delta t^2\right)^N \approx E_0 \cdot e^{N \omega^2 \Delta t^2}$$

Even if you choose a microscopic timestep like $\Delta t = 0.001\text{ s}$, the energy still grows exponentially over time. **Explicit Euler is fundamentally incapable of simulating stable orbits, springs, pendulums, or cloth.** It is topologically broken for conservative physics.

```
Explicit Euler in Phase Space:
Momentum p ^
           |             /─────\
           |           /         \
           |          |     ●───┐ |
           |          |         │ |  (Trajectory spirals OUTWARD
           |           \       / /    to infinity!)
           |             \───-─/
           +──────────────────────────> Position x
```

---

## Level 4: The Symplectic Revolution: Semi-Implicit (Euler-Cromer) Integration

In the 1960s, atmospheric physicist **Alan Cromer** and astronomer **E. Störmer** observed an astonishing phenomenon:
By changing just **ONE LINE OF CODE**—updating velocity first, and then using the *new* velocity to update position—the entire energy explosion vanished!

### 4.1 The Semi-Implicit Euler Algorithm
```typescript
// Semi-Implicit Euler (Euler-Cromer):
v_new = v_old + a(x_old) * dt; // 1. Update velocity first!
x_new = x_old + v_new * dt;    // 2. Use NEW velocity to update position!
```

Mathematically:
$$v_{k+1} = v_k + a(x_k) \Delta t$$
$$x_{k+1} = x_k + v_{k+1} \Delta t = x_k + \left(v_k + a(x_k)\Delta t\right)\Delta t$$

### 4.2 Rigorous Proof of Symplecticity ($\det = 1$)
Let us re-run the harmonic oscillator analysis with $a(x_k) = -\omega^2 x_k$:
$$v_{k+1} = -\omega^2 \Delta t \cdot x_k + 1 \cdot v_k$$
$$x_{k+1} = x_k + \Delta t \left(-\omega^2 \Delta t \cdot x_k + v_k\right) = \left(1 - \omega^2 \Delta t^2\right) x_k + \Delta t \cdot v_k$$

Construct the transition matrix $\mathbf{M}_{\text{SIE}}$:
$$\begin{bmatrix} x_{k+1} \\ v_{k+1} \end{bmatrix} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} \begin{bmatrix} x_k \\ v_k \end{bmatrix}$$

Now, compute the determinant with rigorous algebra:
$$\det(\mathbf{M}_{\text{SIE}}) = \left(1 - \omega^2 \Delta t^2\right)(1) - (\Delta t)\left(-\omega^2 \Delta t\right)$$
$$\det(\mathbf{M}_{\text{SIE}}) = 1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2$$
$$\mathbf{\det(\mathbf{M}_{\text{SIE}}) \equiv 1.0000000\dots \quad \blacksquare}$$

#### The Miracle of Symplecticity:
The determinant is **identically equal to 1**, completely independent of the choice of $\omega$ or $\Delta t$!
Phase space area is preserved to machine precision. 

Does Semi-Implicit Euler conserve the exact energy $E = \frac{1}{2}v^2 + \frac{1}{2}\omega^2 x^2$?
No! It conserves an exact **Shadow Hamiltonian** $\tilde{H}$:
$$\tilde{H}(x, v) = \frac{1}{2} v^2 + \frac{1}{2} \omega^2 x^2 - \frac{1}{2} \omega^2 \Delta t \cdot x v$$
Because the system is exactly conserving this nearby shadow energy, the true energy oscillates within a strictly bounded envelope for millions of years without ever exploding or spiraling outward!

---

## Level 5: The Gold Standard: Velocity Verlet & The Leapfrog Scheme

While Semi-Implicit Euler prevents energy explosions, its local accuracy is still first-order ($\mathcal{O}(\Delta t)$). 

In 1967, French physicist **Loup Verlet** developed a second-order, time-reversible, symplectic integration scheme for simulating atomic collisions in liquid argon. It is today the undisputed gold standard for molecular dynamics, astrophysics, and game physics engines (e.g., PhysX, Box2D, Havok).

### 5.1 First-Principles Derivation via Symmetric Taylor Series
Let us expand the exact continuous trajectory $\vec{x}(t)$ forward and backward in time using Taylor's Theorem:

**Forward Taylor Expansion ($t + \Delta t$):**
$$\vec{x}(t + \Delta t) = \vec{x}(t) + \vec{v}(t)\Delta t + \frac{1}{2}\vec{a}(t)\Delta t^2 + \frac{1}{6}\vec{b}(t)\Delta t^3 + \mathcal{O}(\Delta t^4) \quad \text{(Eq. 1)}$$

**Backward Taylor Expansion ($t - \Delta t$):**
$$\vec{x}(t - \Delta t) = \vec{x}(t) - \vec{v}(t)\Delta t + \frac{1}{2}\vec{a}(t)\Delta t^2 - \frac{1}{6}\vec{b}(t)\Delta t^3 + \mathcal{O}(\Delta t^4) \quad \text{(Eq. 2)}$$
*(where $\vec{b}(t) = \frac{d^3\vec{x}}{dt^3}$ is the jerk vector).*

Now, add Equation 1 and Equation 2 together:
$$\vec{x}(t + \Delta t) + \vec{x}(t - \Delta t) = 2\vec{x}(t) + 0 + \vec{a}(t)\Delta t^2 + 0 + \mathcal{O}(\Delta t^4)$$

Notice the stunning cancellation: **all odd-order derivative terms ($\vec{v}(t)\Delta t$ and $\frac{1}{6}\vec{b}(t)\Delta t^3$) cancel to exactly zero!**

Rearranging to solve for future position $\vec{x}(t + \Delta t)$:
$$\mathbf{\vec{x}(t + \Delta t) = 2\vec{x}(t) - \vec{x}(t - \Delta t) + \vec{a}(t)\Delta t^2 + \mathcal{O}(\Delta t^4)}$$

This is the historic **Position Verlet** formula. Its local truncation error is $\mathcal{O}(\Delta t^4)$, producing a global trajectory accuracy of **second order $\mathcal{O}(\Delta t^2)$**!

---

### 5.2 The Velocity Verlet Algorithm
The original Position Verlet formula had one major limitation: it omitted velocity $\vec{v}(t)$ entirely, making it difficult to calculate kinetic energy, drag forces, or handle elastic collisions.

To restore synchronized velocities without sacrificing second-order accuracy or symplecticity, William Swope developed the **Velocity Verlet** formulation (1982):

```
Time:          t                 t + 0.5*dt              t + dt
Position:    x(t) ────────────────────────────────────> x(t + dt)
Velocity:    v(t) ───────> v(t + 0.5*dt) ─────────────> v(t + dt)
Acceleration:a(t)                                       a(t + dt)
```

The algorithm executes in 4 explicit phases:

1. **Step 1: Half-Step Velocity Advance**
   Advance velocity by half a timestep using current acceleration:
   $$\vec{v}_{k + 1/2} = \vec{v}_k + \frac{1}{2}\vec{a}_k \Delta t$$

2. **Step 2: Full-Step Position Advance**
   Advance position by a full timestep using the midpoint velocity:
   $$\vec{x}_{k+1} = \vec{x}_k + \vec{v}_{k + 1/2} \Delta t = \vec{x}_k + \vec{v}_k \Delta t + \frac{1}{2}\vec{a}_k \Delta t^2$$

3. **Step 3: Acceleration Re-evaluation**
   Evaluate forces at the *new* spatial coordinates:
   $$\vec{a}_{k+1} = \frac{\vec{F}(\vec{x}_{k+1})}{m}$$

4. **Step 4: Second Half-Step Velocity Advance**
   Complete the velocity update using the newly evaluated acceleration:
   $$\vec{v}_{k+1} = \vec{v}_{k + 1/2} + \frac{1}{2}\vec{a}_{k+1} \Delta t$$

#### Why Velocity Verlet Dominates:
1. **Second-Order Convergence ($\mathcal{O}(\Delta t^2)$):** Halving $\Delta t$ reduces trajectory error by a factor of $4$!
2. **Symplectic & Time-Reversible:** If you negate velocity ($\vec{v} \to -\vec{v}$) and step backward, the system retraces its path bit-for-bit to the initial state.
3. **Computational Efficiency:** It requires only **one force evaluation per timestep** (since $\vec{a}_{k+1}$ becomes $\vec{a}_k$ on the next tick).

---

## Level 6: Non-Conservative Dynamics, RK4 & The CFL Stability Criterion

### 6.1 The 4th-Order Runge-Kutta Method (RK4)
What if the physical system is **not** conservative? 
For example: an artillery shell experiencing air resistance $F_d = -\frac{1}{2}\rho C_d A v^2$, missile guidance with jet thrust, or complex non-linear aerodynamic damping.

In non-conservative systems, symplectic area preservation is irrelevant because real physical drag *does* contract phase space. Here, the legendary **Runge-Kutta 4th-Order (RK4)** method reigns supreme:

$$\vec{x}_{k+1} = \vec{x}_k + \frac{\Delta t}{6}\left(\vec{k}_1 + 2\vec{k}_2 + 2\vec{k}_3 + \vec{k}_4\right)$$

Where:
- $\vec{k}_1 = \vec{f}(t_k, \vec{x}_k)$ (Slope at beginning of interval)
- $\vec{k}_2 = \vec{f}\left(t_k + \frac{\Delta t}{2}, \vec{x}_k + \frac{\Delta t}{2}\vec{k}_1\right)$ (Trial slope at midpoint using $\vec{k}_1$)
- $\vec{k}_3 = \vec{f}\left(t_k + \frac{\Delta t}{2}, \vec{x}_k + \frac{\Delta t}{2}\vec{k}_2\right)$ (Refined slope at midpoint using $\vec{k}_2$)
- $\vec{k}_4 = \vec{f}\left(t_k + \Delta t, \vec{x}_k + \Delta t \vec{k}_3\right)$ (Trial slope at end of interval using $\vec{k}_3$)

RK4 provides staggering **fourth-order global accuracy ($\mathcal{O}(\Delta t^4)$)**: halving the timestep cuts error by a factor of $16$!
*Tradeoff:* It requires 4 force evaluations per step, making it $4\times$ more computationally expensive than Verlet.

---

### 6.2 The CFL Stability Limit & Critical Damping
Even symplectic integrators cannot accept infinitely large time steps. 

For any mass-spring system with natural frequency $\omega = \sqrt{k/m}$, the eigenvalues of the Semi-Implicit Euler transition matrix $\mathbf{M}_{\text{SIE}}$ are given by:
$$\lambda^2 - \left(2 - \omega^2 \Delta t^2\right)\lambda + 1 = 0$$

For the solution to remain oscillatory and bounded, the eigenvalues must remain complex conjugates on the unit circle ($|\lambda| = 1$). This requires the discriminant to be negative:
$$\left(2 - \omega^2 \Delta t^2\right)^2 - 4 < 0 \implies \left|2 - \omega^2 \Delta t^2\right| < 2$$
$$-2 < 2 - \omega^2 \Delta t^2 < 2$$
$$0 < \omega^2 \Delta t^2 < 4 \implies \mathbf{\omega \Delta t < 2}$$

$$\mathbf{\Delta t_{\text{max}} < \frac{2}{\omega} = \frac{2}{\sqrt{k/m}} = \frac{T}{\pi}}$$

This is the **Courant-Friedrichs-Lewy (CFL) Stability Criterion**:
If your timestep $\Delta t$ exceeds $\frac{2}{\omega}$, the eigenvalues become real numbers with magnitude $|\lambda| > 1$. The numerical integrator breaks through the stability barrier and the simulation **explodes to infinity** regardless of symplecticity!

---

## Level 7: Production-Grade TypeScript Numerical Integrator Suite

```typescript
/**
 * Sovereign Tech Tree of Knowledge: Level 7 Production Implementation
 * Module: cs-numerical-integration
 * Architecture: High-Performance Numerical ODE Integrator Suite
 */

export interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  mass: number;
}

export type ForceLaw = (
  x: number, 
  y: number, 
  vx: number, 
  vy: number, 
  t: number
) => { fx: number; fy: number };

export interface EnergyTelemetry {
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  relativeEnergyDrift: number; // (E - E0) / E0
}

export class NumericalIntegratorSuite {
  /**
   * Explicit (Forward) Euler
   * 1st Order, Non-Symplectic (CAUTION: Diverges / Explodes on conservative systems)
   */
  public static stepExplicitEuler(
    p: ParticleState, 
    force: ForceLaw, 
    dt: number, 
    t: number
  ): void {
    const f = force(p.x, p.y, p.vx, p.vy, t);
    p.ax = f.fx / p.mass;
    p.ay = f.fy / p.mass;

    // Position updated using OLD velocity
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Velocity updated after
    p.vx += p.ax * dt;
    p.vy += p.ay * dt;
  }

  /**
   * Semi-Implicit (Euler-Cromer) Integrator
   * 1st Order, Symplectic (Phase-Space Area Conserving det = 1)
   */
  public static stepSemiImplicitEuler(
    p: ParticleState, 
    force: ForceLaw, 
    dt: number, 
    t: number
  ): void {
    const f = force(p.x, p.y, p.vx, p.vy, t);
    p.ax = f.fx / p.mass;
    p.ay = f.fy / p.mass;

    // 1. Update velocity FIRST
    p.vx += p.ax * dt;
    p.vy += p.ay * dt;

    // 2. Update position using NEW velocity
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }

  /**
   * Velocity Verlet Integrator
   * 2nd Order Global Accuracy, Symplectic, Time-Reversible
   * Industry Gold Standard for Molecular Dynamics, Orbits, and Rigid-Body Engines.
   */
  public static stepVelocityVerlet(
    p: ParticleState, 
    force: ForceLaw, 
    dt: number, 
    t: number
  ): void {
    const halfDt = 0.5 * dt;

    // Phase 1: Half-step velocity advance
    const vHalfX = p.vx + p.ax * halfDt;
    const vHalfY = p.vy + p.ay * halfDt;

    // Phase 2: Full-step position advance
    p.x += vHalfX * dt;
    p.y += vHalfY * dt;

    // Phase 3: Evaluate forces at new position
    const nextF = force(p.x, p.y, vHalfX, vHalfY, t + dt);
    p.ax = nextF.fx / p.mass;
    p.ay = nextF.fy / p.mass;

    // Phase 4: Second half-step velocity advance
    p.vx = vHalfX + p.ax * halfDt;
    p.vy = vHalfY + p.ay * halfDt;
  }

  /**
   * Classical 4th-Order Runge-Kutta (RK4)
   * 4th Order Accuracy, Non-Symplectic
   * Ideal for non-conservative aerodynamics, terminal velocity, and missile guidance.
   */
  public static stepRK4(
    p: ParticleState, 
    force: ForceLaw, 
    dt: number, 
    t: number
  ): void {
    const m = p.mass;

    // k1 = f(t, y)
    const f1 = force(p.x, p.y, p.vx, p.vy, t);
    const ax1 = f1.fx / m;
    const ay1 = f1.fy / m;
    const vx1 = p.vx;
    const vy1 = p.vy;

    // k2 = f(t + 0.5dt, y + 0.5dt * k1)
    const x2 = p.x + 0.5 * dt * vx1;
    const y2 = p.y + 0.5 * dt * vy1;
    const v2x = p.vx + 0.5 * dt * ax1;
    const v2y = p.vy + 0.5 * dt * ay1;
    const f2 = force(x2, y2, v2x, v2y, t + 0.5 * dt);
    const ax2 = f2.fx / m;
    const ay2 = f2.fy / m;

    // k3 = f(t + 0.5dt, y + 0.5dt * k2)
    const x3 = p.x + 0.5 * dt * v2x;
    const y3 = p.y + 0.5 * dt * v2y;
    const v3x = p.vx + 0.5 * dt * ax2;
    const v3y = p.vy + 0.5 * dt * ay2;
    const f3 = force(x3, y3, v3x, v3y, t + 0.5 * dt);
    const ax3 = f3.fx / m;
    const ay3 = f3.fy / m;

    // k4 = f(t + dt, y + dt * k3)
    const x4 = p.x + dt * v3x;
    const y4 = p.y + dt * v3y;
    const v4x = p.vx + dt * ax3;
    const v4y = p.vy + dt * ay3;
    const f4 = force(x4, y4, v4x, v4y, t + dt);
    const ax4 = f4.fx / m;
    const ay4 = f4.fy / m;

    // Simpson's rule weighted combination
    p.x += (dt / 6.0) * (vx1 + 2.0 * v2x + 2.0 * v3x + v4x);
    p.y += (dt / 6.0) * (vy1 + 2.0 * v2y + 2.0 * v3y + v4y);
    p.vx += (dt / 6.0) * (ax1 + 2.0 * ax2 + 2.0 * ax3 + ax4);
    p.vy += (dt / 6.0) * (ay1 + 2.0 * ay2 + 2.0 * ay3 + ay4);

    p.ax = ax4;
    p.ay = ay4;
  }

  /**
   * Evaluates mechanical energy and tracks drift relative to initial baseline E0
   */
  public static computeEnergy(
    p: ParticleState, 
    potentialEnergyFn: (x: number, y: number) => number,
    initialEnergy: number
  ): EnergyTelemetry {
    const speedSq = p.vx * p.vx + p.vy * p.vy;
    const ke = 0.5 * p.mass * speedSq;
    const pe = potentialEnergyFn(p.x, p.y);
    const total = ke + pe;
    const drift = (total - initialEnergy) / initialEnergy;

    return {
      kineticEnergy: ke,
      potentialEnergy: pe,
      totalEnergy: total,
      relativeEnergyDrift: drift
    };
  }
}
```

---

## Level 8: Multi-Tiered Practice Problems with Complete Step-by-Step Solutions

### Tier 1: Class 6 Anchor Problem (Harmonic Oscillator Step 1 Trace)
**Problem Statement:**  
A mass of $1\text{ kg}$ hangs from a spring with $k = 1\text{ N/m}$ ($\omega = 1\text{ rad/s}$). At $t = 0$, you pull the mass down to $x_0 = 1.0\text{ meter}$ and release it from rest ($v_0 = 0.0\text{ m/s}$).  
Using a coarse time step $\Delta t = 0.5\text{ seconds}$, calculate:
1. The state $(x_1, v_1)$ and total mechanical energy $E_1$ after 1 step of **Explicit Euler**.
2. The state $(x_1, v_1)$ and total mechanical energy $E_1$ after 1 step of **Semi-Implicit Euler**.  
*(Recall initial energy $E_0 = \frac{1}{2}kx_0^2 + \frac{1}{2}mv_0^2 = 0.500\text{ Joules}$)*.

**Exhaustive Step-by-Step Solution:**  
1. **Explicit Euler Calculation:**
   - Spring acceleration: $a_0 = -k x_0 / m = -(1)(1.0)/1 = -1.0\text{ m/s}^2$.
   - Update position first with old velocity:
     $$x_1 = x_0 + v_0 \cdot \Delta t = 1.0 + (0.0)(0.5) = 1.0\text{ meter}$$
   - Update velocity with old acceleration:
     $$v_1 = v_0 + a_0 \cdot \Delta t = 0.0 + (-1.0)(0.5) = -0.5\text{ m/s}$$
   - Compute new energy $E_1$:
     $$E_1 = \frac{1}{2}(1)(1.0)^2 + \frac{1}{2}(1)(-0.5)^2 = 0.500 + \frac{1}{2}(0.25) = 0.500 + 0.125 = \mathbf{0.625\text{ Joules}}$$
   - **Energy Gain:** $\frac{0.625 - 0.500}{0.500} = +25.0\%$ artificial energy explosion in a single step!

2. **Semi-Implicit Euler Calculation:**
   - Spring acceleration: $a_0 = -1.0\text{ m/s}^2$.
   - Update velocity FIRST:
     $$v_1 = v_0 + a_0 \cdot \Delta t = 0.0 + (-1.0)(0.5) = -0.5\text{ m/s}$$
   - Update position with NEW velocity:
     $$x_1 = x_0 + v_1 \cdot \Delta t = 1.0 + (-0.5)(0.5) = 1.0 - 0.25 = 0.75\text{ meters}$$
   - Compute new energy $E_1$:
     $$E_1 = \frac{1}{2}(1)(0.75)^2 + \frac{1}{2}(1)(-0.5)^2 = \frac{1}{2}(0.5625) + \frac{1}{2}(0.2500) = 0.28125 + 0.12500 = \mathbf{0.40625\text{ Joules}}$$
   - **Energy Behavior:** The energy drops slightly to $0.406\text{ J}$ as it traces the shadow ellipse, but will cycle stably between $0.406\text{ J}$ and $0.594\text{ J}$ without ever escaping to infinity.

---

### Tier 2: High School Physics (Velocity Verlet Precision Benchmark)
**Problem Statement:**  
For the exact same oscillator ($m = 1\text{ kg}, k = 1\text{ N/m}, x_0 = 1.0\text{ m}, v_0 = 0.0\text{ m/s}, \Delta t = 0.5\text{ s}$), perform 1 step of **Velocity Verlet**. Calculate the mechanical energy $E_1$ and find the percentage error relative to exact initial energy $E_0 = 0.5000\text{ J}$.

**Exhaustive Step-by-Step Solution:**  
- **Initial Acceleration:**
  $$a_0 = -\frac{k}{m} x_0 = -1.0\text{ m/s}^2$$
- **Step 1 (Half-Step Velocity):**
  $$v_{1/2} = v_0 + \frac{1}{2} a_0 \Delta t = 0.0 + \frac{1}{2}(-1.0)(0.5) = -0.25\text{ m/s}$$
- **Step 2 (Full-Step Position):**
  $$x_1 = x_0 + v_{1/2} \Delta t = 1.0 + (-0.25)(0.5) = 1.0 - 0.125 = 0.875\text{ meters}$$
- **Step 3 (Re-evaluate Acceleration at $x_1$):**
  $$a_1 = -\frac{k}{m} x_1 = -0.875\text{ m/s}^2$$
- **Step 4 (Second Half-Step Velocity):**
  $$v_1 = v_{1/2} + \frac{1}{2} a_1 \Delta t = -0.25 + \frac{1}{2}(-0.875)(0.5) = -0.25 - 0.21875 = -0.46875\text{ m/s}$$
- **Compute Mechanical Energy $E_1$:**
  $$E_1 = \frac{1}{2}(1)(0.875)^2 + \frac{1}{2}(1)(-0.46875)^2$$
  $$E_1 = \frac{1}{2}(0.765625) + \frac{1}{2}(0.2197266) = 0.3828125 + 0.1098633 = \mathbf{0.4926758\text{ Joules}}$$
- **Percentage Deviation:**
  $$\text{Relative Drift} = \left|\frac{0.4926758 - 0.5000000}{0.5000000}\right| \times 100\% = \frac{0.0073242}{0.5000000} \times 100\% = \mathbf{1.46\%}$$
  Even with a massive $\Delta t = 0.5\text{ s}$ (nearly $1/12$th of an entire period!), Velocity Verlet holds energy within $1.46\%$ of perfection.

---

### Tier 3: AP / College Physics (The CFL Critical Timestep Calculation)
**Problem Statement:**  
A suspension bridge model connects a vehicle wheel of mass $m = 25\text{ kg}$ to a chassis via an ultra-stiff spring with constant $k = 40,000\text{ N/m}$.  
1. Compute the natural angular frequency $\omega$ and oscillation period $T$ of the suspension.  
2. What is the absolute maximum stable timestep $\Delta t_{\text{max}}$ for Semi-Implicit Euler integration before numerical instability triggers explosive failure?  
3. If the game engine runs at $60\text{ Hz}$ ($\Delta t = 0.01667\text{ s}$), will this suspension be stable or will it explode?

**Exhaustive Step-by-Step Solution:**  
1. **Natural Angular Frequency & Period:**
   $$\omega = \sqrt{\frac{k}{m}} = \sqrt{\frac{40,000\text{ N/m}}{25\text{ kg}}} = \sqrt{1600} = 40.0\text{ rad/s}$$
   $$T = \frac{2\pi}{\omega} = \frac{2\pi}{40} \approx 0.15708\text{ seconds}$$
2. **CFL Stability Threshold:**
   From Level 6, the stability condition for Semi-Implicit Euler is:
   $$\omega \Delta t < 2 \implies \Delta t < \frac{2}{\omega}$$
   $$\Delta t_{\text{max}} = \frac{2}{40.0\text{ rad/s}} = \mathbf{0.050\text{ seconds}} \quad (50\text{ milliseconds})$$
3. **Engine Evaluation at 60 Hz:**
   At $60\text{ Hz}$, the engine timestep is:
   $$\Delta t_{\text{engine}} = \frac{1}{60} \approx 0.01667\text{ seconds}$$
   Comparing timesteps:
   $$\Delta t_{\text{engine}} = 0.01667\text{ s} < 0.050\text{ s} = \Delta t_{\text{max}}$$
   $$\omega \Delta t = 40.0 \times 0.01667 = 0.6667 < 2.0$$
   **Conclusion:** The suspension is well within the stability boundary ($0.667 < 2$) and will oscillate stably without exploding.

---

### Tier 4: University Classical Mechanics (Shadow Hamiltonian Derivation)
**Problem Statement:**  
Prove analytically that for a 1D harmonic oscillator $\ddot{x} + \omega^2 x = 0$, Semi-Implicit Euler exactly conserves the modified shadow Hamiltonian:
$$\tilde{H}(x, v) = \frac{1}{2} v^2 + \frac{1}{2} \omega^2 x^2 - \frac{1}{2} \omega^2 \Delta t \cdot x v$$
by evaluating $\tilde{H}(x_{k+1}, v_{k+1}) - \tilde{H}(x_k, v_k)$.

**Exhaustive Step-by-Step Solution:**  
From the Semi-Implicit Euler update equations:
$$v_{k+1} = v_k - \omega^2 \Delta t \cdot x_k$$
$$x_{k+1} = x_k + v_{k+1} \Delta t = x_k + \Delta t(v_k - \omega^2 \Delta t x_k) = (1 - \omega^2 \Delta t^2)x_k + \Delta t v_k$$

Now substitute $x_{k+1}$ and $v_{k+1}$ directly into $\tilde{H}$:
$$\tilde{H}_{k+1} = \frac{1}{2} v_{k+1}^2 + \frac{1}{2} \omega^2 x_{k+1}^2 - \frac{1}{2} \omega^2 \Delta t \cdot x_{k+1} v_{k+1}$$

Let us expand each term individually:
1. **Velocity Term:**
   $$\frac{1}{2} v_{k+1}^2 = \frac{1}{2} \left( v_k^2 - 2\omega^2 \Delta t x_k v_k + \omega^4 \Delta t^2 x_k^2 \right)$$

2. **Position Term:**
   $$\frac{1}{2} \omega^2 x_{k+1}^2 = \frac{1}{2} \omega^2 \left( x_k^2 (1 - \omega^2 \Delta t^2)^2 + 2\Delta t (1 - \omega^2 \Delta t^2) x_k v_k + \Delta t^2 v_k^2 \right)$$
   $$= \frac{1}{2} \omega^2 x_k^2 (1 - 2\omega^2 \Delta t^2 + \omega^4 \Delta t^4) + \omega^2 \Delta t (1 - \omega^2 \Delta t^2) x_k v_k + \frac{1}{2} \omega^2 \Delta t^2 v_k^2$$

3. **Cross Coupling Term:**
   $$-\frac{1}{2} \omega^2 \Delta t \cdot x_{k+1} v_{k+1} = -\frac{1}{2} \omega^2 \Delta t \left[ (1 - \omega^2 \Delta t^2)x_k + \Delta t v_k \right] \left[ v_k - \omega^2 \Delta t x_k \right]$$
   $$= -\frac{1}{2} \omega^2 \Delta t \left[ (1 - \omega^2 \Delta t^2) x_k v_k - \omega^2 \Delta t (1 - \omega^2 \Delta t^2) x_k^2 + \Delta t v_k^2 - \omega^2 \Delta t^2 x_k v_k \right]$$

Now sum all three components and collect terms by $v_k^2$, $x_k^2$, and $x_k v_k$:
- **Coefficient of $v_k^2$:**
  $$\frac{1}{2} + \frac{1}{2} \omega^2 \Delta t^2 - \frac{1}{2} \omega^2 \Delta t^2 = \mathbf{\frac{1}{2}}$$
- **Coefficient of $x_k^2$:**
  $$\frac{1}{2} \omega^4 \Delta t^2 + \frac{1}{2} \omega^2 (1 - 2\omega^2 \Delta t^2 + \omega^4 \Delta t^4) + \frac{1}{2} \omega^4 \Delta t^2 (1 - \omega^2 \Delta t^2)$$
  $$= \frac{1}{2}\omega^4 \Delta t^2 + \frac{1}{2}\omega^2 - \omega^4 \Delta t^2 + \frac{1}{2}\omega^6 \Delta t^4 + \frac{1}{2}\omega^4 \Delta t^2 - \frac{1}{2}\omega^6 \Delta t^4$$
  $$= \frac{1}{2} \omega^2 + \left(\frac{1}{2} - 1 + \frac{1}{2}\right)\omega^4 \Delta t^2 + \left(\frac{1}{2} - \frac{1}{2}\right)\omega^6 \Delta t^4 = \mathbf{\frac{1}{2} \omega^2}$$
- **Coefficient of $x_k v_k$:**
  $$-\omega^2 \Delta t + \omega^2 \Delta t (1 - \omega^2 \Delta t^2) - \frac{1}{2}\omega^2 \Delta t (1 - 2\omega^2 \Delta t^2)$$
  $$= -\omega^2 \Delta t + \omega^2 \Delta t - \omega^4 \Delta t^3 - \frac{1}{2}\omega^2 \Delta t + \omega^4 \Delta t^3 = \mathbf{-\frac{1}{2} \omega^2 \Delta t}$$

Collecting all verified terms:
$$\tilde{H}_{k+1} = \frac{1}{2} v_k^2 + \frac{1}{2} \omega^2 x_k^2 - \frac{1}{2} \omega^2 \Delta t \cdot x_k v_k \equiv \mathbf{\tilde{H}_k} \quad \blacksquare$$
The shadow Hamiltonian is conserved **exactly to zero error on every single step**. This proves conclusively why Semi-Implicit Euler never suffers long-term energy drift.

---

### Tier 5: Industry / Synthesis (Orbital Energy Precession & RK4 vs Verlet)
**Problem Statement:**  
A space exploration satellite orbits an asteroid of gravitational parameter $\mu = GM = 1000\text{ m}^3/\text{s}^2$ in an eccentric ellipse with apoapsis $r_a = 100\text{ m}$ and periapsis $r_p = 20\text{ m}$.  
1. Explain why RK4, despite its superior 4th-order accuracy, is mathematically inferior to 2nd-order Velocity Verlet for long-term orbital simulations spanning thousands of revolutions.  
2. If you must simulate satellite flight for 10 years, which integrator guarantees that the satellite will not artificially spiral into the asteroid or escape into deep space, and why?

**Exhaustive Step-by-Step Solution:**  
1. **The Symplectic vs Non-Symplectic Defect:**
   RK4 is a non-symplectic integrator. Its Jacobian determinant $\det(J) \neq 1$. Over any single orbital period, RK4 calculates the trajectory with extreme precision ($\mathcal{O}(\Delta t^4)$). However, because RK4 does not conserve a shadow Hamiltonian, its truncation error is **dissipative and secular**: on every orbit, a tiny fraction of orbital energy is permanently lost or gained.
   Over $10,000$ orbits, the error accumulates unidirectionally: the orbit either slowly spirals down to a crash or drifts into infinity.
2. **Velocity Verlet's Invariant Geometry:**
   Velocity Verlet is symplectic and time-reversible. Although its local trajectory has a larger phase error than RK4 (causing the ellipse to precess slightly around the focus), its energy is bounded by a shadow Hamiltonian $\tilde{H}$. The semi-major axis $a$ of the orbit remains locked within a narrow periodic band for millions of revolutions.
   **Conclusion:** For any multi-year planetary or orbital mission simulation, **Velocity Verlet** is the only scientifically valid choice.

---

## Level 9: Philosophical & Epistemological Horizons

### 9.1 The Arrow of Time & Microscopic Reversibility
Newton's laws of motion are symmetric under time reversal:
If you replace $t$ with $-t$, the second derivative $\frac{d^2\vec{x}}{d(-t)^2} = \frac{d^2\vec{x}}{dt^2}$ remains completely unchanged. A video of planets orbiting the Sun played in reverse looks like completely valid, physically plausible astrophysics.

Yet naive numerical methods like Explicit Euler introduce a **false arrow of time**:
They pump artificial entropy and energy into the system, breaking time symmetry. If you reverse the signs of velocity in Explicit Euler, the simulation does not retrace its steps; it diverges even faster.

**Velocity Verlet restores the symmetry of nature.**
Because it is algebraically time-reversible, running Verlet forward 1,000 ticks and then reversing velocities for 1,000 ticks returns the system bit-for-bit to its starting coordinates.

### 9.2 Symplectic Geometry as Nature's Deepest Truth
In the 20th century, physicists discovered that conservation of energy is not an isolated trick of nature. By **Emmy Noether's Theorem**, every conservation law corresponds to a continuous symmetry of the universe:
- Conservation of momentum arises from spatial translation symmetry.
- Conservation of angular momentum arises from rotational symmetry.
- Conservation of energy arises from **time translation symmetry**.

When we construct symplectic integrators, we are not simply approximating a curve—we are preserving the underlying Hamiltonian phase-space geometry of the cosmos.
