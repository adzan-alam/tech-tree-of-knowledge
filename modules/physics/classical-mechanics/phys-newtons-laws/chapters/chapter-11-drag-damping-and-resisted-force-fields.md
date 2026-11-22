# Chapter 11: Drag, Damping, and Resisted Force Fields — Viscous Dissipation, Aerodynamic Power, and Force Accumulators

> *"In the vacuum of Euclidean thought, motion is eternal and unresisted. But in the physical atmosphere of our world, matter swims through a viscous sea of fluid atoms. Every acceleration is met by a dissipative drag field that transforms kinetic order into thermal chaos."*

---

## 11.1 The Realm of Resisted Motion: From Ideal Mechanics to Fluid Realism

Throughout our exploration of Newton’s Laws, we have frequently deployed the pedagogical convenience of "frictionless surfaces" and "neglected air resistance." In celestial mechanics and vacuum chambers, this idealization holds with high precision. However, in terrestrial ballistics, automotive engineering, biomechanics, and meteorology, resistive forces are not minor perturbations—they dictate the dominant physical reality.

When a solid body translates through a fluid (liquid or gas), it must physically displace fluid molecules and shear through fluid layers. This interaction generates a resistive **drag force** $\vec{F}_d$ that is fundamentally **velocity-dependent**:

$$\vec{F}_d = \vec{F}_d(\vec{v})$$

Unlike Coulomb dry friction—which remains constant regardless of velocity ($f_k = \mu_k N$)—fluid resistance vanishes at zero velocity ($\vec{F}_d(\vec{0}) = \vec{0}$) and escalates relentlessly as speed increases.

To model resisted motion, classical physics identifies two principal mathematical regimes dictated by the dimensionless **Reynolds Number** ($\text{Re}$):

$$\text{Re} = \frac{\rho_{\text{fluid}} v D}{\eta}$$

where $\rho_{\text{fluid}}$ is fluid density ($\text{kg/m}^3$), $v$ is relative speed ($\text{m/s}$), $D$ is characteristic cross-sectional dimension ($\text{m}$), and $\eta$ is fluid dynamic viscosity ($\text{Pa}\cdot\text{s}$ or $\text{kg}/(\text{m}\cdot\text{s})$).

```
   Low Reynolds Number (Re << 1)               High Reynolds Number (Re >> 1000)
       Laminar Stokes Flow                         Turbulent Wake Flow
   ================================           ================================
          . - - - - - - .                            . - - - - - - .  ~~  (Eddies)
        /                 \                        /                 \ ~~~ (Turbulence)
   --->(     Sphere D      )--->              --->(     Sphere D      )~~~~ (Vortices)
        \                 /                        \                 / ~~~
          ' - - - - - - '                            ' - - - - - - '  ~~  (Low P)
       F_drag = -b * v                            F_drag = -1/2 * ρ * Cd * A * v^2
```

1. **Stokes Regime ($\text{Re} \ll 1$):** Viscous skin friction dominates. Occurs for microscopic particles, sedimentation of bacteria, oil droplets in Millikan's experiment, or motion in high-viscosity syrups. Drag is strictly **linear in velocity**:
   $$\vec{F}_d = -b \vec{v}$$
2. **Newtonian/Turbulent Regime ($\text{Re} \gg 10^3$):** Inertial ram pressure and turbulent wake formation dominate. Occurs for vehicles, skydivers, baseballs, and raindrops. Drag is strictly **quadratic in velocity**:
   $$\vec{F}_d = -\frac{1}{2}\rho C_d A \|\vec{v}\| \vec{v}$$

---

## 11.2 Linear Drag Dynamics (Stokes' Law)

In 1851, George Gabriel Stokes derived the exact analytical drag force acting on a sphere of radius $R$ moving slowly through an unbounded fluid of dynamic viscosity $\eta$:

$$\vec{F}_{\text{Stokes}} = -6\pi \eta R \, \vec{v} = -b \vec{v}$$

where $b = 6\pi \eta R$ is the **linear damping coefficient** ($\text{kg/s}$ or $\text{N}\cdot\text{s/m}$).

### 1. Horizontal Motion with Linear Damping
Consider a particle of mass $m$ projected horizontally with initial speed $v_0$ across a viscous fluid medium with zero gravity or floating neutrally:

$$\sum F_x = -b v = m \frac{dv}{dt}$$

Separate variables:

$$\frac{dv}{v} = -\frac{b}{m} dt = -\frac{1}{\tau} dt$$

where $\tau = \frac{m}{b}$ is the **characteristic relaxation time** (or decay time constant) of the system:

$$\int_{v_0}^v \frac{dv'}{v'} = -\frac{1}{\tau} \int_0^t dt' \implies \ln\left(\frac{v}{v_0}\right) = -\frac{t}{\tau}$$

$$v(t) = v_0 e^{-t/\tau} = v_0 e^{-\frac{b}{m} t}$$

The velocity decays **exponentially**. In each time interval $\tau$, speed drops by a factor of $1/e \approx 36.8\%$.

#### Distance Traversed (Finite Horizon)
Integrate $v(t) = dx/dt$:

$$x(t) = \int_0^t v(t') \, dt' = v_0 \int_0^t e^{-t'/\tau} \, dt' = v_0 \left[ -\tau e^{-t'/\tau} \right]_0^t = v_0 \tau \left( 1 - e^{-t/\tau} \right)$$

As $t \to \infty$, the particle does **not** travel infinitely far! It asymptotically approaches a finite **stopping distance**:

$$x_{\max} = \lim_{t \to \infty} x(t) = v_0 \tau = \frac{m v_0}{b}$$

```
      Velocity v(t)                              Position x(t)
       ^                                          ^
   v0 -+                                   x_max -+--------------------- Asymptote
       | \                                        |          .---'
       |  \                                       |       .-'
       |   '.                                     |     .'
       |     '-.                                  |   .'
     0 +--------'-------------------> t         0 +--'--------------------> t
       0       τ      2τ                         0       τ      2τ
```

### 2. Vertical Free Fall under Linear Drag
Now let a particle of mass $m$ be dropped from rest under terrestrial gravity $\vec{g} = -g\,\hat{j}$:

$$\sum F_y = mg - bv = m \frac{dv}{dt}$$

Rearrange and separate variables:

$$\frac{dv}{mg - bv} = \frac{dt}{m} \implies \frac{dv}{v - \frac{mg}{b}} = -\frac{b}{m} dt$$

Integrate from $v(0) = 0$:

$$\ln\left( \frac{\frac{mg}{b} - v}{\frac{mg}{b}} \right) = -\frac{b}{m} t = -\frac{t}{\tau}$$

$$1 - \frac{v}{v_{\text{term}}} = e^{-t/\tau} \implies v(t) = v_{\text{term}} \left( 1 - e^{-t/\tau} \right)$$

where the **terminal velocity** $v_{\text{term}}$ is achieved when downward gravitational weight is exactly balanced by upward drag ($mg = b v_{\text{term}}$):

$$v_{\text{term}} = \frac{mg}{b} = g\tau$$

Position as a function of time:

$$y(t) = \int_0^t v(t') \, dt' = v_{\text{term}} \int_0^t (1 - e^{-t'/\tau}) \, dt' = v_{\text{term}} \left[ t + \tau e^{-t/\tau} - \tau \right]$$

$$y(t) = v_{\text{term}} t - v_{\text{term}} \tau \left( 1 - e^{-t/\tau} \right)$$

- **At short times ($t \ll \tau$):** Expand $e^{-t/\tau} \approx 1 - \frac{t}{\tau} + \frac{t^2}{2\tau^2}$.
  $$y(t) \approx v_{\text{term}} t - v_{\text{term}}\tau \left(\frac{t}{\tau} - \frac{t^2}{2\tau^2}\right) = \frac{1}{2}\left(\frac{v_{\text{term}}}{\tau}\right) t^2 = \frac{1}{2} g t^2$$
  The particle behaves like an unresisted free-falling body!
- **At long times ($t \gg \tau$):** The exponential vanishes.
  $$y(t) \approx v_{\text{term}} t - v_{\text{term}} \tau$$
  The motion becomes pure uniform linear translation at terminal speed $v_{\text{term}}$, offset by a constant distance delay $v_{\text{term}}\tau$.

---

## 11.3 Quadratic Aerodynamic Drag

For macroscopic objects in air ($\text{Re} > 1000$), the drag force is governed by Lord Rayleigh’s aerodynamic formula:

$$\vec{F}_d = -\frac{1}{2} \rho C_d A \|\vec{v}\| \vec{v}$$

where:
- $\rho$: Mass density of the ambient fluid ($\approx 1.225\,\text{kg/m}^3$ for dry air at sea level).
- $C_d$: Dimensionless **drag coefficient**, capturing the geometric streamline profile:
  - Smooth sphere: $C_d \approx 0.47$
  - Flat disk perpendicular to flow: $C_d \approx 1.17$
  - Modern streamlined automobile: $C_d \approx 0.25 - 0.30$
  - Skydiver (belly-to-earth): $C_d \approx 1.0 - 1.2$
- $A$: Projected cross-sectional frontal area ($\text{m}^2$).

Let us define the lumped aerodynamic drag parameter:

$$c = \frac{1}{2} \rho C_d A \quad [\text{units: } \text{kg/m}]$$

so that the scalar drag magnitude is $F_d = c v^2$.

### 1. Vertical Descent and Hyperbolic Functions
Let an object be dropped from rest under gravity and quadratic drag:

$$m \frac{dv}{dt} = mg - c v^2$$

#### Terminal Velocity
At terminal velocity, acceleration ceases ($dv/dt = 0$):

$$mg = c v_{\text{term}}^2 \implies v_{\text{term}} = \sqrt{\frac{mg}{c}} = \sqrt{\frac{2mg}{\rho C_d A}}$$

Rewrite the differential equation in terms of $v_{\text{term}}$:

$$m \frac{dv}{dt} = mg\left(1 - \frac{v^2}{v_{\text{term}}^2}\right) \implies \frac{dv}{1 - \left(\frac{v}{v_{\text{term}}}\right)^2} = g \, dt$$

Recall the standard integral:

$$\int \frac{du}{1 - u^2} = \operatorname{artanh}(u)$$

Integrating both sides from $v(0) = 0$:

$$v_{\text{term}} \operatorname{artanh}\left(\frac{v}{v_{\text{term}}}\right) = g t \implies \frac{v}{v_{\text{term}}} = \tanh\left(\frac{gt}{v_{\text{term}}}\right)$$

$$v(t) = v_{\text{term}} \tanh\left(\frac{gt}{v_{\text{term}}}\right)$$

To determine the vertical descent distance $y(t)$:

$$y(t) = \int_0^t v(t') \, dt' = v_{\text{term}} \int_0^t \tanh\left(\frac{gt'}{v_{\text{term}}}\right) dt'$$

Since $\int \tanh(k t) \, dt = \frac{1}{k} \ln[\cosh(k t)]$:

$$y(t) = \frac{v_{\text{term}}^2}{g} \ln\left[ \cosh\left( \frac{gt}{v_{\text{term}}} \right) \right]$$

This elegant closed-form solution completely describes aerodynamic fall from initial release to steady terminal descent.

```
      Velocity v(t) / v_term
        1.0 - - - - - - - - - - - - - - - - - - - - - - - - - Terminal Velocity
            |                     . - - - ' ' ' ' ' ' ' ' ' '
            |                 . - '
            |              . '
            |            .'
            |          .'  v(t) = v_term * tanh(gt / v_term)
            |        .'
          0 +-------'---------------------------------------> t
            0       1       2       3       4       5 (units of v_term / g)
```

### 2. Horizontal Retardation (The Logarithmic Horizon Paradox)
Now examine purely horizontal motion with quadratic drag ($m \dot{v} = -c v^2$):

$$\frac{dv}{v^2} = -\frac{c}{m} dt$$

Integrate from initial velocity $v_0$:

$$\left[ -\frac{1}{v} \right]_{v_0}^v = -\frac{c}{m} t \implies \frac{1}{v} - \frac{1}{v_0} = \frac{c}{m} t$$

$$\frac{1}{v} = \frac{1}{v_0} + \frac{c}{m} t = \frac{m + c v_0 t}{m v_0}$$

$$v(t) = \frac{v_0}{1 + \left(\frac{c v_0}{m}\right) t}$$

Notice the stark contrast with linear drag:
- Linear drag decays **exponentially** ($e^{-t/\tau}$).
- Quadratic drag decays **algebraically** ($1/t$). At long times, speed drops very slowly because smaller velocities produce vastly diminished drag!

Now integrate to find position $x(t)$:

$$x(t) = \int_0^t \frac{v_0}{1 + \left(\frac{c v_0}{m}\right) t'} dt' = \frac{m}{c} \ln\left[ 1 + \left(\frac{c v_0}{m}\right) t \right]$$

**The Logarithmic Horizon Paradox:**
> *As $t \to \infty$, $x(t) \to \infty$! In a pure quadratic drag medium without dry friction or linear viscosity, an object never stops within any finite distance; its horizon is unbounded, growing logarithmically forever.*

In the real world, as speed drops to near zero, the flow drops into the Stokes regime ($\text{Re} \ll 1$), where linear drag takes over and terminates the motion in finite distance.

---

## 11.4 Propulsion, Aerodynamic Limits, and the Cubic Power Law

Consider a vehicle (automobile, bullet train, or aircraft) cruising horizontally at high speed. The engine generates a tractive driving force $F_{\text{drive}}$. The motion is resisted by two primary forces:
1. **Rolling resistance:** $f_{rr} = \mu_{rr} mg$ (approximately velocity-independent).
2. **Aerodynamic drag:** $F_d = \frac{1}{2} \rho C_d A v^2$.

The net equation of motion is:

$$m \frac{dv}{dt} = F_{\text{drive}} - \mu_{rr} mg - \frac{1}{2}\rho C_d A v^2$$

### The Maximum Speed Limit
At top speed $v_{\max}$, acceleration ceases ($dv/dt = 0$):

$$F_{\text{drive}} = \mu_{rr} mg + \frac{1}{2}\rho C_d A v_{\max}^2$$

At high speeds ($v > 100\,\text{km/h}$), aerodynamic drag overwhelmingly dominates rolling resistance ($\frac{1}{2}\rho C_d A v^2 \gg \mu_{rr} mg$):

$$F_{\text{drive}} \approx \frac{1}{2}\rho C_d A v_{\max}^2$$

### The Cubic Power Law
The mechanical power $P$ required to overcome aerodynamic drag is the dot product of force and velocity:

$$P_{\text{aero}} = F_{\text{drive}} \cdot v = \left( \frac{1}{2}\rho C_d A v^2 \right) v = \frac{1}{2}\rho C_d A v^3$$

**The Fundamental Law of Aerodynamic Power:**
> *The mechanical power required to propel a body through a fluid medium scales with the **cube of the velocity** ($P \propto v^3$).*

```
   Speed Multiplier        Drag Force (~ v^2)        Power Required (~ v^3)
   ----------------        ------------------        ----------------------
   1.0x (100 km/h)               1.0x                       1.0x (Baseline: ~15 kW)
   1.5x (150 km/h)              2.25x                      3.375x (~51 kW)
   2.0x (200 km/h)               4.0x                       8.0x (~120 kW)
   3.0x (300 km/h)               9.0x                      27.0x (~405 kW)
```

To double the top speed of a sports car or high-speed train, engineers must increase the engine power output by a factor of $2^3 = \mathbf{8}$. To triple the speed, engine power must expand by $3^3 = \mathbf{27}$. This brutal cubic wall explains why commercial airliners cruise at subsonic speeds and why hyperloop concepts require evacuated vacuum tubes.

---

## 11.5 The Force Accumulator Pattern in Physics Engines

In computational physics and game engines (such as Box2D, PhysX, or our custom TypeScript dynamics engine), systems cannot be solved using analytical calculus formulas. A single rigid body might be simultaneously subjected to:
- Constant gravity
- Non-linear aerodynamic drag
- Linear viscous damping
- Multiple stretched Hookean springs
- Coulomb contact friction
- User-applied thruster impulses

To handle this cleanly without algorithmic coupling, computational dynamics universally employs the **Force Accumulator Pattern**.

```
                +-----------------------------------------+
                |        NEW PHYSICS STEP (dt)            |
                +-----------------------------------------+
                                     |
                                     v
                        1. Clear Force Accumulator
                           body.force.set(0, 0)
                                     |
                                     v
                        2. Accumulate Global Forces
                           body.force.add(gravity * body.mass)
                                     |
                                     v
                        3. Accumulate Position Forces
                           for each spring:
                             body.force.add(spring.calculateForce(body))
                                     |
                                     v
                        4. Accumulate Velocity Forces
                           drag = -0.5 * rho * Cd * A * v * |v|
                           body.force.add(drag)
                                     |
                                     v
                        5. Accumulate Constraints & Contact
                           body.force.add(contactNormal + friction)
                                     |
                                     v
                        6. Integrate via Inverse Mass (w = 1/m)
                           acceleration = body.force * body.invMass
                           body.velocity.add(acceleration * dt)
                           body.position.add(body.velocity * dt)
```

### The Architectural Beauty of Inverse Mass ($w = 1/m$)
Notice Step 6: by storing inverse mass $w = 1/m$ directly on each body:
- Dynamic calculation requires **zero divisions**: $\vec{a} = w \vec{F}_{\text{net}}$.
- Static geometry (immovable ground, walls, barriers) is represented simply by $w = 0$ ($m \to \infty$). No conditional `if (body.isStatic)` branching is required in inner simulation loops; infinite inertia automatically produces zero acceleration!

---

## 11.6 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 11.1: Stokes Linear Deceleration in Glycerin
**Problem:** A tiny steel ball bearing of mass $m = 2.00 \times 10^{-4}\,\text{kg}$ ($0.200\,\text{g}$) and radius $R = 1.80 \times 10^{-3}\,\text{m}$ is projected horizontally into a vat of glycerin ($\eta = 1.412\,\text{Pa}\cdot\text{s}$) with initial speed $v_0 = 0.500\,\text{m/s}$.
1. Compute the linear damping coefficient $b$ using Stokes' Law.
2. Determine the relaxation time $\tau$.
3. Compute the velocity of the sphere after $t = 0.010\,\text{s}$.
4. Calculate the total stopping distance $x_{\max}$.

**Solution:**
- **Step 1: Stokes damping coefficient $b$**
  $$b = 6\pi \eta R = 6\pi (1.412\,\text{Pa}\cdot\text{s})(1.80 \times 10^{-3}\,\text{m}) = 6\pi (0.0025416) = 0.04791\,\text{kg/s}$$

- **Step 2: Relaxation time $\tau$**
  $$\tau = \frac{m}{b} = \frac{2.00 \times 10^{-4}\,\text{kg}}{0.04791\,\text{kg/s}} = 0.004175\,\text{s} = 4.175\,\text{ms}$$

- **Step 3: Velocity at $t = 0.010\,\text{s}$**
  $$\frac{t}{\tau} = \frac{0.010\,\text{s}}{0.004175\,\text{s}} = 2.3952$$
  $$v(t) = v_0 e^{-t/\tau} = (0.500\,\text{m/s}) e^{-2.3952} = (0.500)(0.09115) = 0.04558\,\text{m/s} = 4.56\,\text{cm/s}$$

- **Step 4: Total stopping distance $x_{\max}$**
  $$x_{\max} = v_0 \tau = (0.500\,\text{m/s})(0.004175\,\text{s}) = 0.002087\,\text{m} = 2.087\,\text{mm}$$
  The sphere halts after penetrating barely two millimeters!

---

### Example 11.2: Terminal Velocity of a Falling Raindrop
**Problem:** A spherical water raindrop has diameter $D = 2.00\,\text{mm}$ ($R = 1.00 \times 10^{-3}\,\text{m}$). The density of water is $\rho_w = 1000\,\text{kg/m}^3$, air density is $\rho_{\text{air}} = 1.205\,\text{kg/m}^3$, drag coefficient is $C_d = 0.450$, and $g = 9.81\,\text{m/s}^2$.
1. Compute the mass $m$ and projected frontal area $A$ of the drop.
2. Determine the lumped drag constant $c = \frac{1}{2}\rho_{\text{air}} C_d A$.
3. Calculate the terminal velocity $v_{\text{term}}$ in $\text{m/s}$ and $\text{km/h}$.

**Solution:**
- **Step 1: Mass and area**
  $$V = \frac{4}{3}\pi R^3 = \frac{4}{3}\pi (0.0010\,\text{m})^3 = 4.1888 \times 10^{-9}\,\text{m}^3$$
  $$m = \rho_w V = (1000\,\text{kg/m}^3)(4.1888 \times 10^{-9}\,\text{m}^3) = 4.1888 \times 10^{-6}\,\text{kg} = 4.189\,\text{mg}$$
  $$A = \pi R^2 = \pi (0.0010\,\text{m})^2 = 3.1416 \times 10^{-6}\,\text{m}^2$$

- **Step 2: Drag parameter $c$**
  $$c = \frac{1}{2} \rho_{\text{air}} C_d A = 0.5 \times (1.205\,\text{kg/m}^3) \times (0.450) \times (3.1416 \times 10^{-6}\,\text{m}^2) = 8.5177 \times 10^{-7}\,\text{kg/m}$$

- **Step 3: Terminal velocity**
  $$v_{\text{term}} = \sqrt{\frac{mg}{c}} = \sqrt{\frac{(4.1888 \times 10^{-6}\,\text{kg})(9.81\,\text{m/s}^2)}{8.5177 \times 10^{-7}\,\text{kg/m}}} = \sqrt{\frac{4.1092 \times 10^{-5}}{8.5177 \times 10^{-7}}} = \sqrt{48.243} = 6.946\,\text{m/s}$$
  Converting to $\text{km/h}$:
  $$v_{\text{term}} = 6.946 \times 3.6 = 25.0\,\text{km/h}$$

---

### Example 11.3: Skydiver Terminal Descent and Parachute Deployment
**Problem:** A skydiver of mass $m = 80.0\,\text{kg}$ falls through air ($\rho = 1.20\,\text{kg/m}^3$). Take $g = 9.81\,\text{m/s}^2$.
1. In belly-to-earth free fall, $A_1 = 0.650\,\text{m}^2$ and $C_{d1} = 1.10$. Compute terminal speed $v_{\text{term}, 1}$.
2. The skydiver deploys a parachute with canopy area $A_2 = 38.0\,\text{m}^2$ and $C_{d2} = 1.40$. Compute the new terminal landing speed $v_{\text{term}, 2}$.

**Solution:**
- **Step 1: Free fall terminal speed**
  $$c_1 = \frac{1}{2} \rho C_{d1} A_1 = 0.5 \times (1.20) \times (1.10) \times (0.650) = 0.4290\,\text{kg/m}$$
  $$v_{\text{term}, 1} = \sqrt{\frac{mg}{c_1}} = \sqrt{\frac{(80.0\,\text{kg})(9.81\,\text{m/s}^2)}{0.4290\,\text{kg/m}}} = \sqrt{\frac{784.8}{0.4290}} = \sqrt{1829.37} = 42.77\,\text{m/s} = 154.0\,\text{km/h}$$

- **Step 2: Parachute terminal landing speed**
  $$c_2 = \frac{1}{2} \rho C_{d2} A_2 = 0.5 \times (1.20) \times (1.40) \times (38.0) = 31.92\,\text{kg/m}$$
  $$v_{\text{term}, 2} = \sqrt{\frac{mg}{c_2}} = \sqrt{\frac{784.8}{31.92}} = \sqrt{24.586} = 4.958\,\text{m/s} = 17.85\,\text{km/h}$$
  A landing speed of under $5.0\,\text{m/s}$ ensures safe touchdown (equivalent to jumping off a $1.25\,\text{m}$ step).

---

### Example 11.4: Time and Distance to 90% Terminal Velocity
**Problem:** A baseball of mass $m = 0.145\,\text{kg}$ has terminal velocity $v_{\text{term}} = 40.0\,\text{m/s}$ in vertical fall. It is dropped from rest ($g = 9.81\,\text{m/s}^2$).
1. Calculate the time $t_{90}$ required for the ball to reach $90\%$ of terminal velocity ($v = 0.900 v_{\text{term}} = 36.0\,\text{m/s}$).
2. Determine the vertical distance $y_{90}$ fallen during this time.

**Solution:**
- **Step 1: Time $t_{90}$**
  From Section 11.3:
  $$v(t) = v_{\text{term}} \tanh\left(\frac{gt}{v_{\text{term}}}\right) \implies \tanh\left(\frac{gt}{v_{\text{term}}}\right) = 0.900$$
  $$\frac{gt_{90}}{v_{\text{term}}} = \operatorname{artanh}(0.900) = \frac{1}{2} \ln\left(\frac{1 + 0.900}{1 - 0.900}\right) = \frac{1}{2} \ln\left(\frac{1.900}{0.100}\right) = \frac{1}{2}\ln(19.0) = \frac{1}{2}(2.9444) = 1.4722$$
  $$t_{90} = 1.4722 \times \frac{v_{\text{term}}}{g} = 1.4722 \times \frac{40.0\,\text{m/s}}{9.81\,\text{m/s}^2} = 1.4722 \times 4.0775 = 6.003\,\text{s}$$

- **Step 2: Distance fallen $y_{90}$**
  $$y(t) = \frac{v_{\text{term}}^2}{g} \ln\left[ \cosh\left( \frac{gt}{v_{\text{term}}} \right) \right]$$
  Since $\tanh(u) = 0.900$, use the identity $\cosh(u) = \frac{1}{\sqrt{1 - \tanh^2(u)}}$:
  $$\cosh(u) = \frac{1}{\sqrt{1 - 0.900^2}} = \frac{1}{\sqrt{1 - 0.810}} = \frac{1}{\sqrt{0.190}} = \frac{1}{0.43589} = 2.29416$$
  $$\ln[\cosh(u)] = \ln(2.29416) = 0.83038$$
  $$y_{90} = \frac{(40.0\,\text{m/s})^2}{9.81\,\text{m/s}^2} \times 0.83038 = \frac{1600}{9.81} \times 0.83038 = 163.099 \times 0.83038 = 135.43\,\text{m}$$

---

### Example 11.5: High-Speed Electric Vehicle Aerodynamic Power
**Problem:** A streamlined electric vehicle of mass $m = 1800\,\text{kg}$ has drag coefficient $C_d = 0.230$, frontal area $A = 2.20\,\text{m}^2$, and rolling resistance coefficient $\mu_{rr} = 0.0120$. Ambient air density is $\rho = 1.20\,\text{kg/m}^3$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the rolling resistance force $f_{rr}$.
2. Compute the aerodynamic drag force at $v_1 = 100.0\,\text{km/h}$ ($27.78\,\text{m/s}$) and at $v_2 = 180.0\,\text{km/h}$ ($50.00\,\text{m/s}$).
3. Calculate the mechanical power output (in kilowatts) required from the battery to sustain both speeds on a flat highway.

**Solution:**
- **Step 1: Rolling resistance**
  $$f_{rr} = \mu_{rr} mg = (0.0120)(1800\,\text{kg})(9.81\,\text{m/s}^2) = 211.90\,\text{N}$$

- **Step 2: Aerodynamic drag force**
  $$c = \frac{1}{2} \rho C_d A = 0.5 \times (1.20) \times (0.230) \times (2.20) = 0.3036\,\text{kg/m}$$
  - At $v_1 = 27.78\,\text{m/s}$ ($100\,\text{km/h}$):
    $$F_{d1} = c v_1^2 = (0.3036\,\text{kg/m})(27.78\,\text{m/s})^2 = (0.3036)(771.73) = 234.30\,\text{N}$$
  - At $v_2 = 50.00\,\text{m/s}$ ($180\,\text{km/h}$):
    $$F_{d2} = c v_2^2 = (0.3036\,\text{kg/m})(50.00\,\text{m/s})^2 = (0.3036)(2500.0) = 759.00\,\text{N}$$

- **Step 3: Power requirements**
  - Total force at $v_1$:
    $$F_{\text{total}, 1} = f_{rr} + F_{d1} = 211.90 + 234.30 = 446.20\,\text{N}$$
    $$P_1 = F_{\text{total}, 1} \cdot v_1 = (446.20\,\text{N})(27.78\,\text{m/s}) = 12,395\,\text{W} = 12.40\,\text{kW} \approx 16.6\,\text{hp}$$
  - Total force at $v_2$:
    $$F_{\text{total}, 2} = f_{rr} + F_{d2} = 211.90 + 759.00 = 970.90\,\text{N}$$
    $$P_2 = F_{\text{total}, 2} \cdot v_2 = (970.90\,\text{N})(50.00\,\text{m/s}) = 48,545\,\text{W} = 48.55\,\text{kW} \approx 65.1\,\text{hp}$$
  *Notice:* An $80\%$ increase in cruising speed requires a **$292\%$ increase** in battery power!

---

### Example 11.6: Horizontal High-Speed Projectile Deceleration
**Problem:** An artillery shell of mass $m = 10.0\,\text{kg}$ is fired horizontally at $v_0 = 800.0\,\text{m/s}$. The quadratic drag constant is $c = 0.00150\,\text{kg/m}$.
1. Compute the time $t_{1/2}$ for the speed to drop to half its muzzle velocity ($v = 400.0\,\text{m/s}$).
2. Calculate the distance $x_{1/2}$ traversed during this time.

**Solution:**
- **Step 1: Time to halve velocity**
  From Section 11.3:
  $$v(t) = \frac{v_0}{1 + \left(\frac{c v_0}{m}\right) t}$$
  Setting $v = v_0 / 2$:
  $$1 + \left(\frac{c v_0}{m}\right) t_{1/2} = 2 \implies \left(\frac{c v_0}{m}\right) t_{1/2} = 1 \implies t_{1/2} = \frac{m}{c v_0}$$
  $$t_{1/2} = \frac{10.0\,\text{kg}}{(0.00150\,\text{kg/m})(800.0\,\text{m/s})} = \frac{10.0}{1.20} = 8.333\,\text{s}$$

- **Step 2: Distance traversed $x_{1/2}$**
  $$x(t_{1/2}) = \frac{m}{c} \ln\left[ 1 + \left(\frac{c v_0}{m}\right) t_{1/2} \right] = \frac{m}{c} \ln(2)$$
  $$\frac{m}{c} = \frac{10.0\,\text{kg}}{0.00150\,\text{kg/m}} = 6666.67\,\text{m}$$
  $$x_{1/2} = (6666.67\,\text{m}) \times \ln(2) = (6666.67)(0.69315) = 4621.0\,\text{m} \approx 4.62\,\text{km}$$

---

### Example 11.7: Upward Ballistic Projectile with Quadratic Drag
**Problem:** A vertical flare of mass $m = 0.500\,\text{kg}$ is launched vertically upward with initial speed $v_0 = 60.0\,\text{m/s}$. The drag constant is $c = 0.00200\,\text{kg/m}$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the terminal velocity $v_{\text{term}} = \sqrt{mg/c}$.
2. Derive and compute the maximum apex height $H_{\max}$ reached by the flare.
3. Compare this to the frictionless vacuum apex height $H_{\text{vac}} = v_0^2 / (2g)$.

**Solution:**
- **Step 1: Terminal velocity**
  $$v_{\text{term}} = \sqrt{\frac{mg}{c}} = \sqrt{\frac{(0.500\,\text{kg})(9.81\,\text{m/s}^2)}{0.00200\,\text{kg/m}}} = \sqrt{\frac{4.905}{0.00200}} = \sqrt{2452.5} = 49.523\,\text{m/s}$$

- **Step 2: Maximum apex height derivation**
  On the upward journey, both gravity and drag point downward:
  $$m v \frac{dv}{dy} = -mg - c v^2 = -c(v_{\text{term}}^2 + v^2)$$
  $$\frac{v \, dv}{v_{\text{term}}^2 + v^2} = -\frac{c}{m} dy$$
  Integrate from $y = 0, v = v_0$ to $y = H_{\max}, v = 0$:
  $$\int_{v_0}^0 \frac{v \, dv}{v_{\text{term}}^2 + v^2} = -\frac{c}{m} \int_0^{H_{\max}} dy$$
  $$\left[ \frac{1}{2} \ln(v_{\text{term}}^2 + v^2) \right]_{v_0}^0 = -\frac{c}{m} H_{\max}$$
  $$\frac{1}{2} \ln\left(\frac{v_{\text{term}}^2}{v_{\text{term}}^2 + v_0^2}\right) = -\frac{c}{m} H_{\max} \implies H_{\max} = \frac{m}{2c} \ln\left(1 + \frac{v_0^2}{v_{\text{term}}^2}\right) = \frac{v_{\text{term}}^2}{2g} \ln\left(1 + \frac{v_0^2}{v_{\text{term}}^2}\right)$$

- **Step 3: Numerical calculation and vacuum comparison**
  $$\frac{v_0^2}{v_{\text{term}}^2} = \frac{60.0^2}{49.523^2} = \frac{3600}{2452.5} = 1.46789$$
  $$\ln(1 + 1.46789) = \ln(2.46789) = 0.90336$$
  $$H_{\max} = \frac{2452.5}{2(9.81)} \times 0.90336 = 125.0 \times 0.90336 = 112.92\,\text{m}$$
  In vacuum:
  $$H_{\text{vac}} = \frac{v_0^2}{2g} = \frac{3600}{2(9.81)} = 183.49\,\text{m}$$
  Aerodynamic drag reduces the maximum apex height by $38.5\%$!

---

### Example 11.8: Force Accumulator Step Calculation in a Simulation Engine
**Problem:** In a 2D physics engine, a dynamic particle has:
- Mass $m = 2.00\,\text{kg}$ (Inverse mass $w = 0.500\,\text{kg}^{-1}$).
- Position $\vec{r} = (1.00, 2.00)\,\text{m}$.
- Velocity $\vec{v} = (12.0, -5.00)\,\text{m/s}$.
The particle experiences:
1. Uniform gravity: $\vec{g} = (0, -9.81)\,\text{m/s}^2$.
2. Quadratic drag: $c = 0.050\,\text{kg/m}$ ($\vec{F}_d = -c \|\vec{v}\| \vec{v}$).
3. A spring anchored at the origin $(0, 0)$ with $k = 40.0\,\text{N/m}$ and resting length $L_0 = 1.50\,\text{m}$.
Compute the accumulated force $\vec{F}_{\text{net}}$ and the resulting acceleration $\vec{a}$ for this time step.

**Solution:**
- **Step 1: Gravity force**
  $$\vec{F}_g = m \vec{g} = (2.00\,\text{kg})(0\,\hat{i} - 9.81\,\hat{j}\,\text{m/s}^2) = 0\,\hat{i} - 19.62\,\hat{j}\,\text{N}$$

- **Step 2: Aerodynamic drag force**
  $$\|\vec{v}\| = \sqrt{12.0^2 + (-5.00)^2} = \sqrt{144.0 + 25.0} = \sqrt{169.0} = 13.0\,\text{m/s}$$
  $$\vec{F}_d = -c \|\vec{v}\| \vec{v} = -(0.050)(13.0)(12.0\,\hat{i} - 5.00\,\hat{j}) = -0.650(12.0\,\hat{i} - 5.00\,\hat{j})$$
  $$\vec{F}_d = -7.80\,\hat{i} + 3.25\,\hat{j}\,\text{N}$$

- **Step 3: Spring force**
  Vector to particle: $\vec{r} = 1.00\,\hat{i} + 2.00\,\hat{j}\,\text{m}$.
  Length: $L = \sqrt{1.00^2 + 2.00^2} = \sqrt{5.00} = 2.2361\,\text{m}$.
  Elongation: $\Delta L = L - L_0 = 2.2361 - 1.50 = 0.7361\,\text{m}$ (stretched).
  Unit vector: $\hat{u} = \frac{1.00}{2.2361}\,\hat{i} + \frac{2.00}{2.2361}\,\hat{j} = 0.4472\,\hat{i} + 0.8944\,\hat{j}$.
  Restoring force:
  $$\vec{F}_s = -k \Delta L \, \hat{u} = -(40.0\,\text{N/m})(0.7361\,\text{m})\,\hat{u} = -(29.444)(0.4472\,\hat{i} + 0.8944\,\hat{j})$$
  $$\vec{F}_s = -13.167\,\hat{i} - 26.335\,\hat{j}\,\text{N}$$

- **Step 4: Accumulate all forces**
  $$\vec{F}_{\text{net}} = \vec{F}_g + \vec{F}_d + \vec{F}_s$$
  $$F_x = 0 - 7.80 - 13.167 = -20.967\,\text{N}$$
  $$F_y = -19.62 + 3.25 - 26.335 = -42.705\,\text{N}$$
  $$\vec{F}_{\text{net}} = -20.97\,\hat{i} - 42.71\,\hat{j}\,\text{N}$$

- **Step 5: Compute acceleration via inverse mass**
  $$\vec{a} = w \vec{F}_{\text{net}} = (0.500\,\text{kg}^{-1})(-20.967\,\hat{i} - 42.705\,\hat{j}\,\text{N}) = -10.48\,\hat{i} - 21.35\,\hat{j}\,\text{m/s}^2$$

---

### Example 11.9: Cyclist Coasting Deceleration
**Problem:** A cyclist and bicycle have combined mass $m = 85.0\,\text{kg}$. While coasting on a level flat road, they experience rolling resistance $f_{rr} = 4.20\,\text{N}$ and aerodynamic drag $F_d = c v^2$ with $c = 0.210\,\text{kg/m}$. They cease pedaling at initial speed $v_0 = 10.0\,\text{m/s}$ ($36.0\,\text{km/h}$).
1. Calculate the instantaneous deceleration at $v_0$.
2. Calculate the speed $v_1$ after coasting for distance $d = 50.0\,\text{m}$.

**Solution:**
- **Step 1: Instantaneous initial deceleration**
  $$F_{\text{net}} = -(f_{rr} + c v_0^2) = -[4.20 + (0.210)(10.0)^2] = -(4.20 + 21.0) = -25.20\,\text{N}$$
  $$a_0 = \frac{F_{\text{net}}}{m} = \frac{-25.20\,\text{N}}{85.0\,\text{kg}} = -0.2965\,\text{m/s}^2$$

- **Step 2: Velocity as a function of distance**
  $$m v \frac{dv}{dx} = -(f_{rr} + c v^2)$$
  $$\frac{v \, dv}{f_{rr} + c v^2} = -\frac{1}{m} dx$$
  Integrate from $x = 0, v = v_0$ to $x = d, v = v_1$:
  $$\frac{1}{2c} \ln\left(\frac{f_{rr} + c v_1^2}{f_{rr} + c v_0^2}\right) = -\frac{d}{m}$$
  $$\ln\left(\frac{f_{rr} + c v_1^2}{f_{rr} + c v_0^2}\right) = -\frac{2 c d}{m}$$
  Compute the exponent:
  $$\frac{2 c d}{m} = \frac{2(0.210\,\text{kg/m})(50.0\,\text{m})}{85.0\,\text{kg}} = \frac{21.0}{85.0} = 0.24706$$
  $$e^{-0.24706} = 0.78109$$
  $$f_{rr} + c v_0^2 = 4.20 + 21.0 = 25.20\,\text{N}$$
  $$f_{rr} + c v_1^2 = (25.20\,\text{N}) \times 0.78109 = 19.6835\,\text{N}$$
  $$c v_1^2 = 19.6835 - 4.20 = 15.4835\,\text{N}$$
  $$v_1^2 = \frac{15.4835}{0.210} = 73.731\,\text{m}^2/\text{s}^2 \implies v_1 = \sqrt{73.731} = 8.587\,\text{m/s} = 30.91\,\text{km/h}$$

---

### Example 11.10: Bullet Penetration in Ballistic Gelatin
**Problem:** A high-speed bullet of mass $m = 0.00800\,\text{kg}$ ($8.00\,\text{g}$) enters a block of ballistic gelatin at $v_0 = 420.0\,\text{m/s}$. The resistance inside the dense gelatin is modeled as quadratic drag $F = -k_g v^2$ with $k_g = 1.25\,\text{kg/m}$.
1. Determine the penetration depth $x_{\text{stop}}$ at which the speed drops to $v_{\text{crit}} = 5.00\,\text{m/s}$.
2. Compute the total energy dissipated in the gelatin.

**Solution:**
- **Step 1: Penetration depth**
  $$m v \frac{dv}{dx} = -k_g v^2 \implies \frac{dv}{v} = -\frac{k_g}{m} dx$$
  Integrate:
  $$\ln\left(\frac{v_{\text{crit}}}{v_0}\right) = -\frac{k_g}{m} x \implies x = \frac{m}{k_g} \ln\left(\frac{v_0}{v_{\text{crit}}}\right)$$
  Numerical values:
  $$\frac{m}{k_g} = \frac{0.00800\,\text{kg}}{1.25\,\text{kg/m}} = 0.00640\,\text{m} = 6.40\,\text{mm}$$
  $$\frac{v_0}{v_{\text{crit}}} = \frac{420.0}{5.00} = 84.0$$
  $$\ln(84.0) = 4.4308$$
  $$x = (0.00640\,\text{m}) \times 4.4308 = 0.02836\,\text{m} = 2.836\,\text{cm}$$
  The bullet halts within $2.84\,\text{cm}$ of dense gelatin!

- **Step 2: Total energy dissipated**
  $$\Delta K = \frac{1}{2} m (v_0^2 - v_{\text{crit}}^2) \approx \frac{1}{2}(0.00800\,\text{kg})(420.0\,\text{m/s})^2 = 0.00400 \times 176,400 = 705.6\,\text{J}$$
  Over $705$ Joules of kinetic energy is converted into hydro-shock cavitations and heat within the gelatin block.

---

## 11.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 11.8.

### Tier 1: Stokes Viscous Flow
- **Exercise 11.1:** A dust particle of mass $m = 1.00 \times 10^{-8}\,\text{kg}$ falls in air under linear drag with damping coefficient $b = 2.00 \times 10^{-7}\,\text{kg/s}$. Find its relaxation time $\tau$ and terminal settling velocity $v_{\text{term}}$ ($g = 9.81\,\text{m/s}^2$).
- **Exercise 11.2:** A sediment grain in water has $v_{\text{term}} = 0.050\,\text{m/s}$. Starting from rest, what is its velocity after one time constant ($t = \tau$)?

### Tier 2: Quadratic Fall & Skydiving
- **Exercise 11.3:** A hailstone of mass $m = 0.020\,\text{kg}$ has terminal velocity $v_{\text{term}} = 22.0\,\text{m/s}$. Compute its lumped aerodynamic drag parameter $c$.
- **Exercise 11.4:** A package is dropped from an airplane at high altitude. If $v_{\text{term}} = 35.0\,\text{m/s}$, calculate its speed after falling for $t = 3.00\,\text{s}$ from rest ($g = 9.81\,\text{m/s}^2$).

### Tier 3: Aerodynamic Power & Vehicle Dynamics
- **Exercise 11.5:** A sports car requires $25.0\,\text{kW}$ of engine power to cruise at $110.0\,\text{km/h}$ against aerodynamic drag. What engine power is required to cruise at $220.0\,\text{km/h}$ (neglecting rolling resistance)?
- **Exercise 11.6:** A high-speed bullet train has cross-sectional area $A = 11.0\,\text{m}^2$ and $C_d = 0.180$. In air of density $\rho = 1.20\,\text{kg/m}^3$, compute the aerodynamic thrust force and power required to sustain $v = 300.0\,\text{km/h}$ ($83.33\,\text{m/s}$).

### Tier 4: Analytical Trajectories & Integrals
- **Exercise 11.7:** A boat of mass $m = 600\,\text{kg}$ cuts its engine at speed $v_0 = 14.0\,\text{m/s}$. The water resistance is quadratic with $c = 15.0\,\text{kg/m}$. How long does it take for the boat's speed to drop to $2.00\,\text{m/s}$? How far does it drift?
- **Exercise 11.8:** A ball is projected vertically upward in an atmosphere with quadratic drag where $v_{\text{term}} = 30.0\,\text{m/s}$. If launched at $v_0 = 30.0\,\text{m/s}$, calculate its maximum height $H_{\max}$ ($g = 9.81\,\text{m/s}^2$).

### Tier 5: Computational Physics & Multi-Field Dynamics
- **Exercise 11.9:** A computational particle ($m = 0.500\,\text{kg}$, $w = 2.00\,\text{kg}^{-1}$) at $(0, 0)$ with velocity $(10.0, 0)\,\text{m/s}$ is subjected to linear damping $F_d = -b\vec{v}$ with $b = 1.50\,\text{kg/s}$ and a constant repulsive electric force $\vec{F}_E = +6.00\,\hat{i}\,\text{N}$. Compute the net force, initial acceleration, and terminal velocity.
- **Exercise 11.10:** A sky-diver of mass $m = 75.0\,\text{kg}$ falling at terminal speed $v_{\text{term}} = 50.0\,\text{m/s}$ deploys a parachute at $t = 0$. The parachute inflates instantaneously, increasing the drag constant from $c_1 = 0.2943\,\text{kg/m}$ to $c_2 = 18.0\,\text{kg/m}$. Compute the instantaneous deceleration (in g's) experienced by the skydiver immediately upon deployment.

---

## 11.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 11.1
- **Given:** $m = 1.00 \times 10^{-8}\,\text{kg}$, $b = 2.00 \times 10^{-7}\,\text{kg/s}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Relaxation time $\tau$**
  $$\tau = \frac{m}{b} = \frac{1.00 \times 10^{-8}\,\text{kg}}{2.00 \times 10^{-7}\,\text{kg/s}} = 0.050\,\text{s}$$
- **Step 2: Terminal settling velocity**
  $$v_{\text{term}} = \frac{mg}{b} = g\tau = (9.81\,\text{m/s}^2)(0.050\,\text{s}) = 0.4905\,\text{m/s}$$

---

### Solution 11.2
- **Given:** $v_{\text{term}} = 0.050\,\text{m/s}$, $t = \tau$.
- **Step 1: Velocity formula**
  $$v(t) = v_{\text{term}}(1 - e^{-t/\tau})$$
  At $t = \tau$:
  $$v(\tau) = v_{\text{term}}(1 - e^{-1}) = (0.050\,\text{m/s})(1 - 0.36788) = (0.050)(0.63212) = 0.03161\,\text{m/s}$$

---

### Solution 11.3
- **Given:** $m = 0.020\,\text{kg}$, $v_{\text{term}} = 22.0\,\text{m/s}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Drag parameter $c$**
  $$mg = c v_{\text{term}}^2 \implies c = \frac{mg}{v_{\text{term}}^2} = \frac{(0.020\,\text{kg})(9.81\,\text{m/s}^2)}{(22.0\,\text{m/s})^2} = \frac{0.1962}{484.0} = 4.0537 \times 10^{-4}\,\text{kg/m}$$

---

### Solution 11.4
- **Given:** $v_{\text{term}} = 35.0\,\text{m/s}$, $t = 3.00\,\text{s}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Hyperbolic tangent argument**
  $$u = \frac{gt}{v_{\text{term}}} = \frac{(9.81\,\text{m/s}^2)(3.00\,\text{s})}{35.0\,\text{m/s}} = \frac{29.43}{35.0} = 0.84086$$
- **Step 2: Speed calculation**
  $$\tanh(0.84086) = \frac{e^{0.84086} - e^{-0.84086}}{e^{0.84086} + e^{-0.84086}} = \frac{2.31835 - 0.43134}{2.31835 + 0.43134} = \frac{1.88701}{2.74969} = 0.68626$$
  $$v(3.00\,\text{s}) = v_{\text{term}} \tanh(u) = (35.0\,\text{m/s})(0.68626) = 24.02\,\text{m/s}$$

---

### Solution 11.5
- **Given:** $P_1 = 25.0\,\text{kW}$ at $v_1 = 110.0\,\text{km/h}$. Speed doubled to $v_2 = 220.0\,\text{km/h} = 2 v_1$.
- **Step 1: Cubic power law**
  $$P \propto v^3 \implies \frac{P_2}{P_1} = \left(\frac{v_2}{v_1}\right)^3 = 2^3 = 8$$
- **Step 2: Required power**
  $$P_2 = 8 \times P_1 = 8 \times 25.0\,\text{kW} = 200.0\,\text{kW} \approx 268\,\text{hp}$$

---

### Solution 11.6
- **Given:** $A = 11.0\,\text{m}^2$, $C_d = 0.180$, $\rho = 1.20\,\text{kg/m}^3$, $v = 83.333\,\text{m/s}$.
- **Step 1: Aerodynamic drag constant**
  $$c = \frac{1}{2} \rho C_d A = 0.5 \times (1.20) \times (0.180) \times (11.0) = 1.188\,\text{kg/m}$$
- **Step 2: Drag force**
  $$F_d = c v^2 = (1.188\,\text{kg/m})(83.333\,\text{m/s})^2 = (1.188)(6944.44) = 8250.0\,\text{N} = 8.25\,\text{kN}$$
- **Step 3: Power required**
  $$P = F_d \cdot v = (8250.0\,\text{N})(83.333\,\text{m/s}) = 687,500\,\text{W} = 687.5\,\text{kW} \approx 922\,\text{hp}$$

---

### Solution 11.7
- **Given:** $m = 600\,\text{kg}$, $v_0 = 14.0\,\text{m/s}$, $c = 15.0\,\text{kg/m}$, $v_1 = 2.00\,\text{m/s}$.
- **Step 1: Time calculation**
  $$\frac{1}{v_1} - \frac{1}{v_0} = \frac{c}{m} t \implies t = \frac{m}{c}\left(\frac{1}{v_1} - \frac{1}{v_0}\right)$$
  $$\frac{m}{c} = \frac{600}{15.0} = 40.0\,\text{m}$$
  $$\frac{1}{2.00} - \frac{1}{14.0} = 0.500 - 0.07143 = 0.42857\,\text{s/m}$$
  $$t = (40.0)(0.42857) = 17.14\,\text{s}$$
- **Step 2: Drift distance**
  $$x = \frac{m}{c} \ln\left(\frac{v_0}{v_1}\right) = (40.0\,\text{m}) \ln\left(\frac{14.0}{2.00}\right) = 40.0 \times \ln(7.0) = 40.0 \times 1.9459 = 77.84\,\text{m}$$

---

### Solution 11.8
- **Given:** $v_{\text{term}} = 30.0\,\text{m/s}$, $v_0 = 30.0\,\text{m/s}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Apex height formula**
  From Example 11.7:
  $$H_{\max} = \frac{v_{\text{term}}^2}{2g} \ln\left(1 + \frac{v_0^2}{v_{\text{term}}^2}\right)$$
  Since $v_0 = v_{\text{term}}$, $v_0^2 / v_{\text{term}}^2 = 1.0$:
  $$H_{\max} = \frac{(30.0\,\text{m/s})^2}{2(9.81\,\text{m/s}^2)} \ln(1 + 1) = \frac{900}{19.62} \ln(2) = (45.8716)(0.69315) = 31.79\,\text{m}$$
  *Vacuum comparison:* $H_{\text{vac}} = 900 / 19.62 = 45.87\,\text{m}$.

---

### Solution 11.9
- **Given:** $m = 0.500\,\text{kg}$ ($w = 2.00\,\text{kg}^{-1}$), $\vec{v} = 10.0\,\hat{i}\,\text{m/s}$, $b = 1.50\,\text{kg/s}$, $\vec{F}_E = +6.00\,\hat{i}\,\text{N}$.
- **Step 1: Net force at initial instant**
  $$\vec{F}_d = -b \vec{v} = -(1.50)(10.0\,\hat{i}) = -15.0\,\hat{i}\,\text{N}$$
  $$\vec{F}_{\text{net}} = \vec{F}_E + \vec{F}_d = +6.00\,\hat{i} - 15.0\,\hat{i} = -9.00\,\hat{i}\,\text{N}$$
- **Step 2: Initial acceleration**
  $$\vec{a} = w \vec{F}_{\text{net}} = (2.00\,\text{kg}^{-1})(-9.00\,\hat{i}\,\text{N}) = -18.0\,\hat{i}\,\text{m/s}^2$$
- **Step 3: Terminal velocity**
  At terminal velocity, $\vec{F}_{\text{net}} = \vec{0} \implies F_E - b v_{\text{term}} = 0$:
  $$v_{\text{term}} = \frac{F_E}{b} = \frac{6.00\,\text{N}}{1.50\,\text{kg/s}} = 4.00\,\text{m/s}$$

---

### Solution 11.10
- **Given:** $m = 75.0\,\text{kg}$, speed $v = 50.0\,\text{m/s}$, new drag parameter $c_2 = 18.0\,\text{kg/m}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Drag force immediately upon canopy inflation**
  $$F_{d2} = c_2 v^2 = (18.0\,\text{kg/m})(50.0\,\text{m/s})^2 = (18.0)(2500.0) = 45,000\,\text{N} \quad (\text{upward})$$
- **Step 2: Net force on skydiver**
  $$\sum F_y = F_{d2} - mg = 45,000\,\text{N} - (75.0\,\text{kg})(9.81\,\text{m/s}^2) = 45,000 - 735.75 = 44,264.25\,\text{N} \quad (\text{upward})$$
- **Step 3: Instantaneous deceleration in g's**
  $$a = \frac{\sum F_y}{m} = \frac{44,264.25\,\text{N}}{75.0\,\text{kg}} = 590.19\,\text{m/s}^2 \quad (\text{upward})$$
  $$\text{g's} = \frac{a}{g} = \frac{590.19\,\text{m/s}^2}{9.81\,\text{m/s}^2} = 60.16\,g$$
  *Engineering note:* $60\,g$ is lethal to human physiology! This illustrates why modern parachute rigs deploy pilot chutes and reefing slider rings to stage inflation over several seconds, keeping peak decelerations below $4-5\,g$.
