# CHAPTER 11: Calculus-Based Kinematics & Aerodynamic Drag

> "The resistance of fluids, which in slow motions is proportional to the velocity, and in swift motions to the square of the velocity, transforms the pure conic sections of geometry into the distorted curves of physical reality."
> — **Sir Isaac Newton**, *Philosophiae Naturalis Principia Mathematica* (1687)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Identify and categorize the three fundamental functional forms of variable acceleration: time-dependent $a(t)$, position-dependent $a(x)$, and velocity-dependent $a(v)$.
2. Solve arbitrary time-dependent kinematic systems using definite integrals: $v(t) = v_0 + \int_0^t a(\tau) d\tau$ and $x(t) = x_0 + \int_0^t v(\tau) d\tau$.
3. Apply the kinematic differential identity $a = v \frac{dv}{dx}$ to integrate position-dependent acceleration fields: $\frac{1}{2} v^2 - \frac{1}{2} v_0^2 = \int_{x_0}^x a(x') dx'$.
4. Derive the exact exponential velocity decay and finite asymptotic stopping distance $x_{\text{stop}} = \frac{v_0}{k}$ for motion subject to linear viscous (Stokes) drag.
5. Derive the algebraic velocity decay $v(t) = \frac{v_0}{1 + c v_0 t}$ and logarithmic distance function $x(t) = \frac{1}{c} \ln(1 + c v_0 t)$ for quadratic aerodynamic drag.
6. Derive the hyperbolic tangent velocity solution $v(t) = v_{\text{term}} \tanh\left(\frac{g t}{v_{\text{term}}}\right)$ for vertical free fall with quadratic air resistance, proving the existence of a finite terminal velocity $v_{\text{term}} = \sqrt{g/c}$.
7. Explain why aerodynamic drag permanently couples the horizontal and vertical channels of 2D projectile motion, shattering Galileo's orthogonal independence and producing an asymmetric "teardrop" trajectory.
8. Implement the 4th-order Runge-Kutta (RK4) numerical integration algorithm to simulate non-linear ballistic trajectories with drag to sub-millimeter precision.

---

## 11.1 The Limits of Constant Acceleration

Throughout the preceding ten chapters, our analytical derivations rested heavily on the idealization of **constant acceleration** ($a = \text{constant}$). In elementary physics, this assumption is necessary to derive the Four Sacred Kinematic Equations.

In the real physical world, however, **constant acceleration is an artificial laboratory construct**. Real physical systems are governed by variable accelerations:
1. **Multistage Space Launch Vehicles:** As a rocket climbs, it expels thousands of kilograms of propellant per second. Its mass $m(t)$ plummets continuously, causing the acceleration $a(t) = F_{\text{thrust}} / m(t)$ to climb dramatically even with constant engine thrust.
2. **Springs and Gravitational Fields:** The force exerted by an elastic suspension or planetary gravity depends on spatial position: $a(x) = -\frac{k}{m} x$ or $a(r) = -\frac{G M}{r^2}$.
3. **High-Speed Projectiles and Vehicles:** Moving through air or water creates aerodynamic drag. Fluid resistance opposes motion with a magnitude that scales with speed: $a(v) = -k v$ at microscopic scales and $a(v) = -c v^2$ at macroscopic speeds.

To master sovereign kinematics, we must elevate our analytical toolkit beyond algebraic formulas to the calculus of **Ordinary Differential Equations (ODEs)**.

---

## 11.2 The Three Canonical Acceleration Regimes

The fundamental definition of 1D kinematics connects three variables: position $x$, velocity $v$, and acceleration $a$ through time $t$:
$$v = \frac{dx}{dt}, \quad a = \frac{dv}{dt} = \frac{d^2x}{dt^2}$$

Depending on how acceleration is physically specified, we classify problems into three distinct mathematical regimes:

```
                      +-----------------------------+
                      | Variable Acceleration a     |
                      +-----------------------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
   Case 1: a = a(t)            Case 2: a = a(x)            Case 3: a = a(v)
   (Time-Dependent)          (Position-Dependent)        (Velocity-Dependent)
         |                           |                           |
         v                           v                           v
    Direct Double                Chain Rule:                Separation of
     Integration               a = v (dv/dx)                  Variables:
  v = v0 + int a dt        int v dv = int a(x) dx         dt = dv / a(v)
  x = x0 + int v dt        v^2 - v0^2 = 2 int a dx        dx = v dv / a(v)
```

---

### Case 1: Time-Dependent Acceleration $a = a(t)$
When acceleration is explicitly given as a function of time, solution proceeds by direct sequential quadrature:
$$v(t) = v_0 + \int_0^t a(\tau)\,d\tau$$
$$x(t) = x_0 + \int_0^t v(\tau)\,d\tau = x_0 + v_0 t + \int_0^t \left( \int_0^{\tau} a(s)\,ds \right) d\tau$$

---

### Case 2: Position-Dependent Acceleration $a = a(x)$
When acceleration depends on spatial coordinates, direct integration with respect to $t$ is impossible because $t$ is not explicitly present.
Instead, we invoke the **Chain Rule of Calculus**:
$$a = \frac{dv}{dt} = \frac{dv}{dx} \frac{dx}{dt} = v \frac{dv}{dx}$$

This yields the fundamental kinematic identity:
$$a(x) = v \frac{dv}{dx} \implies v\,dv = a(x)\,dx$$

Integrating both sides from $(x_0, v_0)$ to $(x, v)$:
$$\int_{v_0}^v v'\,dv' = \int_{x_0}^x a(x')\,dx'$$
$$\frac{1}{2} v^2 - \frac{1}{2} v_0^2 = \int_{x_0}^x a(x')\,dx'$$
$$v(x) = \sqrt{v_0^2 + 2 \int_{x_0}^x a(x')\,dx'}$$

To find position as a function of time $x(t)$, we invert the relation:
$$\frac{dx}{dt} = v(x) \implies dt = \frac{dx}{v(x)} \implies t(x) = \int_{x_0}^x \frac{dx'}{v(x')}$$

---

### Case 3: Velocity-Dependent Acceleration $a = a(v)$
When acceleration is a function of current speed, we apply separation of variables:
$$\frac{dv}{dt} = a(v) \implies dt = \frac{dv}{a(v)}$$

Integrating to find time as a function of velocity:
$$t(v) = \int_{v_0}^v \frac{dv'}{a(v')}$$

Inverting $t(v)$ yields $v(t)$.
To find position as a function of velocity directly without going through time, reuse the identity $a = v \frac{dv}{dx}$:
$$v \frac{dv}{dx} = a(v) \implies dx = \frac{v\,dv}{a(v)}$$

Integrating:
$$x(v) - x_0 = \int_{v_0}^v \frac{v'\,dv'}{a(v')}$$

---

## 11.3 Linear Viscous Drag (Stokes Regime)

For microscopic particles, dust grains, droplets settling in air, or macroscopic objects creeping through highly viscous fluids (low Reynolds number $Re \ll 1$), fluid drag is linearly proportional to velocity:
$$F_{\text{drag}} = -b v \implies a_{\text{drag}} = -\frac{b}{m} v = -k v$$
where $k = \frac{b}{m} > 0$ is the drag coefficient per unit mass with SI units of $\text{s}^{-1}$.

### 1D Horizontal Deceleration Under Linear Drag
Consider a particle launched horizontally across a viscous fluid with initial speed $v_0$ at $t = 0$:
$$\frac{dv}{dt} = -k v$$

Separating variables:
$$\int_{v_0}^v \frac{dv'}{v'} = -k \int_0^t dt' \implies \ln\left(\frac{v}{v_0}\right) = -k t$$

Exponentiating both sides:
$$v(t) = v_0 e^{-k t}$$

The velocity decays **exponentially**. The characteristic decay time is $\tau = \frac{1}{k}$. In every time interval $\tau$, the speed drops by a factor of $e \approx 2.718$ (to $\approx 36.8\%$ of its value).

### Position and the Finite Stopping Distance
Integrating velocity to find displacement:
$$x(t) = \int_0^t v(t')\,dt' = \int_0^t v_0 e^{-k t'}\,dt' = \left[ -\frac{v_0}{k} e^{-k t'} \right]_0^t = \frac{v_0}{k} \left(1 - e^{-k t}\right)$$

Now evaluate the asymptotic limit as $t \to \infty$:
$$\lim_{t \to \infty} x(t) = \frac{v_0}{k} (1 - 0) = \frac{v_0}{k}$$

**The Finite Horizon Theorem:** Even though the particle theoretically takes an infinite amount of time to come to a complete mathematical halt ($v \to 0$ only as $t \to \infty$), **its total spatial displacement is strictly finite**:
$$x_{\text{stop}} = \frac{v_0}{k}$$

### Vertical Free Fall with Linear Drag
Now drop a mass $m$ from rest ($v_0 = 0$) under gravity with downward defined as positive ($+y$):
$$a = \frac{dv}{dt} = g - k v$$

Separating variables:
$$\frac{dv}{g - k v} = dt \implies -\frac{1}{k} \ln\left(\frac{g - k v}{g}\right) = t$$
$$\ln\left(1 - \frac{k}{g} v\right) = -k t \implies 1 - \frac{k}{g} v = e^{-k t}$$
$$v(t) = \frac{g}{k} \left(1 - e^{-k t}\right)$$

As $t \to \infty$, $e^{-k t} \to 0$. The velocity approaches a constant upper bound known as the **Terminal Velocity ($v_{\text{term}}$)**:
$$v_{\text{term}} = \lim_{t \to \infty} v(t) = \frac{g}{k}$$
At this terminal speed, downward gravity is exactly balanced by upward fluid drag: $g - k v_{\text{term}} = 0$.

Writing the solution in terms of $v_{\text{term}}$:
$$v(t) = v_{\text{term}} \left(1 - e^{-t / \tau}\right)$$

```
 Velocity v(t)
 ^
 |--------------------------------- Terminal Velocity: v_term = g/k
 |                         * * * *
 |                     *
 |                 *
 |              *
 |           *
 |        *
 |     *
 +----+----+----+----+----+----+---> Time t
     1*tau 2*tau 3*tau
```

---

## 11.4 Quadratic Aerodynamic Drag (Newtonian Regime)

For ordinary macroscopic objects (baseballs, bullets, skydivers, artillery shells, automobiles) moving at typical atmospheric speeds (high Reynolds number $Re \gg 1000$), the wake becomes fully turbulent. Drag is proportional to the **square of the speed**:
$$F_{\text{drag}} = \frac{1}{2} \rho_{\text{air}} C_d A v^2$$
where:
- $\rho_{\text{air}}$ is fluid density ($\approx 1.225\,\text{kg/m}^3$ at sea level).
- $C_d$ is the dimensionless drag coefficient (e.g., $0.47$ for a sphere, $0.04$ for a streamlined airfoil).
- $A$ is the frontal cross-sectional area ($\text{m}^2$).

The deceleration per unit mass is:
$$a_{\text{drag}} = -c v^2$$
where $c = \frac{\rho_{\text{air}} C_d A}{2 m}$ has SI units of $\text{m}^{-1}$.

### 1D Horizontal Deceleration Under Quadratic Drag
Let a projectile enter a resisting medium with initial speed $v_0$:
$$\frac{dv}{dt} = -c v^2$$

Separating variables:
$$\int_{v_0}^v \frac{dv'}{v'^2} = -c \int_0^t dt' \implies \left[ -\frac{1}{v'} \right]_{v_0}^v = -c t$$
$$-\frac{1}{v} + \frac{1}{v_0} = -c t \implies \frac{1}{v} = \frac{1}{v_0} + c t = \frac{1 + c v_0 t}{v_0}$$

Inverting to solve for velocity:
$$v(t) = \frac{v_0}{1 + c v_0 t}$$

Notice the fundamental contrast with linear drag: **decay under quadratic drag is algebraic, not exponential!**
At large times, $v(t) \propto \frac{1}{t}$. As the object slows down, its drag drops precipitously (proportional to $v^2$), so it takes much longer to lose its remaining speed.

### Position and the Logarithmic Divergence
Integrating velocity to find position:
$$x(t) = \int_0^t \frac{v_0}{1 + c v_0 t'}\,dt'$$
Let $u = 1 + c v_0 t' \implies du = c v_0 dt'$. Then:
$$x(t) = \frac{1}{c} \int_1^{1 + c v_0 t} \frac{du}{u} = \frac{1}{c} \ln(1 + c v_0 t)$$

**The Logarithmic Divergence Theorem:** Under pure horizontal quadratic drag, as $t \to \infty$:
$$\lim_{t \to \infty} x(t) = \lim_{t \to \infty} \frac{1}{c} \ln(1 + c v_0 t) \to \infty$$
Unlike linear drag, **quadratic drag does NOT produce a finite stopping distance!** The particle decelerates so gently at low speeds that it covers an infinite distance given infinite time. (In physical reality, once speed drops to very low values, the flow transitions from quadratic drag back into the linear Stokes regime, which terminates the path).

### Vertical Falling with Quadratic Drag & Terminal Velocity
For an object dropped from rest ($v_0 = 0$) under gravity:
$$\frac{dv}{dt} = g - c v^2$$

When terminal velocity $v_{\text{term}}$ is reached, acceleration vanishes:
$$g - c v_{\text{term}}^2 = 0 \implies v_{\text{term}} = \sqrt{\frac{g}{c}} = \sqrt{\frac{2 m g}{\rho_{\text{air}} C_d A}}$$

We can rewrite the equation of motion as:
$$\frac{dv}{dt} = g \left(1 - \frac{v^2}{v_{\text{term}}^2}\right)$$

Separating variables:
$$\int_0^v \frac{dv'}{1 - (v'/v_{\text{term}})^2} = g \int_0^t dt'$$
Using the standard integral $\int \frac{du}{1 - u^2} = \operatorname{arctanh}(u)$:
$$v_{\text{term}} \operatorname{arctanh}\left(\frac{v}{v_{\text{term}}}\right) = g t \implies \operatorname{arctanh}\left(\frac{v}{v_{\text{term}}}\right) = \frac{g t}{v_{\text{term}}}$$

Taking the hyperbolic tangent ($\tanh$) of both sides:
$$v(t) = v_{\text{term}} \tanh\left(\frac{g t}{v_{\text{term}}}\right)$$

Integrating once more to obtain the vertical position $y(t)$:
$$y(t) = \int_0^t v_{\text{term}} \tanh\left(\frac{g t'}{v_{\text{term}}}\right) dt' = \frac{v_{\text{term}}^2}{g} \ln\left[\cosh\left(\frac{g t}{v_{\text{term}}}\right)\right]$$

---

## 11.5 2D Projectile Motion with Quadratic Drag

In Chapter 06 and Chapter 07, we celebrated Galileo’s theorem of orthogonal independence: horizontal motion ($a_x = 0$) and vertical motion ($a_y = -g$) evolved as completely uncoupled systems.

**Aerodynamic drag shatters Galileo's independence forever.**

Why? Because drag is a vector force pointing strictly opposite to the instantaneous velocity vector:
$$\vec{F}_{\text{drag}} = -m c v \vec{v} = -m c |\vec{v}|\,\vec{v}$$

Decomposing into Cartesian components:
$$\begin{aligned}
F_{\text{drag}, x} &= -m c \sqrt{v_x^2 + v_y^2}\,v_x \\
F_{\text{drag}, y} &= -m c \sqrt{v_x^2 + v_y^2}\,v_y
\end{aligned}$$

The coupled 2D equations of motion become:
$$\begin{aligned}
\frac{dv_x}{dt} &= -c \sqrt{v_x^2 + v_y^2}\,v_x \\
\frac{dv_y}{dt} &= -g - c \sqrt{v_x^2 + v_y^2}\,v_y
\end{aligned}$$

Notice the mathematical consequence: **the horizontal acceleration $\frac{dv_x}{dt}$ depends directly on the vertical velocity $v_y$, and the vertical acceleration $\frac{dv_y}{dt}$ depends directly on the horizontal velocity $v_x$!**
The two orthogonal channels are inextricably coupled through the total scalar speed $v = \sqrt{v_x^2 + v_y^2}$.

### Physical Consequences on the Trajectory
This non-linear cross-coupling has dramatic physical consequences:
1. **Asymmetric Distortion:** Unlike the pristine symmetric parabola of vacuum ballistics, the trajectory with drag becomes asymmetric ("teardrop" shaped). The descending branch is much steeper than the ascending branch.
2. **Terminal Plunge:** As horizontal velocity decays toward zero, the projectile approaches a vertical asymptote, plunging straight downward at terminal velocity $v_{\text{term}}$.
3. **Shift in Optimal Launch Angle:** The angle for maximum horizontal range drops from $45^\circ$ down to between $30^\circ$ and $38^\circ$ (depending on drag intensity). Lower angles keep the projectile in the air for less time, minimizing exposure to cumulative velocity loss.

```
 y
 ^
 |              * * Apex
 |          *       *
 |        *          *
 |      *             *
 |     *               *   Steep descent!
 |    *                 *
 |   *                   *
 |  *                     *  Approaches vertical asymptote
-+ *----------------------*----> x
 (0,0)               Range R (compressed compared to vacuum)
```

---

## 11.6 Numerical Integration: Runge-Kutta 4th Order (RK4)

Because the coupled 2D drag ODE system possesses no closed-form analytical solution in terms of elementary functions, real-world aerospace simulations integrate the equations numerically using time-stepping algorithms.

The gold standard for high-accuracy orbital and ballistic propagation is the **4th-Order Runge-Kutta (RK4)** method.

For a first-order system $\frac{d\vec{y}}{dt} = \vec{f}(t, \vec{y})$, RK4 advances the state from $t_n$ to $t_{n+1} = t_n + \Delta t$ by evaluating four intermediate slopes:
$$\begin{aligned}
\vec{k}_1 &= \vec{f}(t_n, \vec{y}_n) \\
\vec{k}_2 &= \vec{f}\left(t_n + \frac{\Delta t}{2}, \vec{y}_n + \frac{\Delta t}{2} \vec{k}_1\right) \\
\vec{k}_3 &= \vec{f}\left(t_n + \frac{\Delta t}{2}, \vec{y}_n + \frac{\Delta t}{2} \vec{k}_2\right) \\
\vec{k}_4 &= \vec{f}(t_n + \Delta t, \vec{y}_n + \Delta t\,\vec{k}_3)
\end{aligned}$$

The next state is computed via Simpson’s weighted average:
$$\vec{y}_{n+1} = \vec{y}_n + \frac{\Delta t}{6} \left(\vec{k}_1 + 2\vec{k}_2 + 2\vec{k}_3 + \vec{k}_4\right)$$

The local truncation error of RK4 is $O(\Delta t^5)$, and its global error is $O(\Delta t^4)$, delivering extraordinary numerical fidelity even with modest step sizes.

---

## 11.7 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 11.1: Cubic Time-Dependent Acceleration
**Problem:** An experimental maglev sled starts from rest at the origin ($x_0 = 0, v_0 = 0$) at $t = 0$. Its propulsion control system provides an acceleration that varies with time according to:
$$a(t) = 3.00 t^2 - 0.200 t^3 \quad (\text{m/s}^2 \text{ for } 0 \le t \le 15.0\,\text{s})$$
1. Derive analytical expressions for velocity $v(t)$ and position $x(t)$.
2. Calculate the sled's maximum speed and the time when it occurs.
3. Compute the sled's position at $t = 10.0\,\text{s}$.

#### Solution
**Step 1: Integrate for velocity and position**
$$v(t) = \int_0^t a(\tau)\,d\tau = \int_0^t (3.00 \tau^2 - 0.200 \tau^3)\,d\tau = \left[ 1.00 \tau^3 - 0.050 \tau^4 \right]_0^t = t^3 - 0.050 t^4\,\text{m/s}$$

$$x(t) = \int_0^t v(\tau)\,d\tau = \int_0^t (\tau^3 - 0.050 \tau^4)\,d\tau = \left[ 0.250 \tau^4 - 0.010 \tau^5 \right]_0^t = 0.250 t^4 - 0.010 t^5\,\text{m}$$

**Step 2: Maximum speed**
Maximum speed occurs when acceleration is zero:
$$a(t) = 3.00 t^2 - 0.200 t^3 = 0 \implies t^2 (3.00 - 0.200 t) = 0$$
Excluding $t = 0$:
$$0.200 t = 3.00 \implies t_{\text{max}} = \frac{3.00}{0.200} = 15.0\,\text{s}$$
Maximum velocity:
$$v_{\text{max}} = v(15.0) = (15.0)^3 - 0.050(15.0)^4 = 3375.0 - 0.050(50625.0) = 3375.0 - 2531.25 = 843.75\,\text{m/s}$$

**Step 3: Position at $t = 10.0\,\text{s}$**
$$x(10.0) = 0.250(10.0)^4 - 0.010(10.0)^5 = 0.250(10000.0) - 0.010(100000.0) = 2500.0 - 1000.0 = 1500.0\,\text{m}$$

---

### Example 11.2: Position-Dependent Acceleration (Spring Launch)
**Problem:** An electromagnetic catapult launches a $0.500\,\text{kg}$ projectile from rest at $x = 0$. The magnetic coil exerts a position-dependent acceleration given by:
$$a(x) = 800.0 - 200.0 x \quad (\text{m/s}^2 \text{ for } 0 \le x \le 4.00\,\text{m})$$
1. Formulate the integral for velocity as a function of position $v(x)$.
2. Calculate the velocity of the projectile as it exits the launcher at $x = 4.00\,\text{m}$.
3. Find the maximum velocity achieved inside the catapult and its location.

#### Solution
**Step 1: Kinematic integration $v\,dv = a(x)\,dx$**
$$\int_0^v v'\,dv' = \int_0^x (800.0 - 200.0 x')\,dx'$$
$$\frac{1}{2} v^2 = \left[ 800.0 x' - 100.0 (x')^2 \right]_0^x = 800.0 x - 100.0 x^2$$
$$v(x) = \sqrt{1600.0 x - 200.0 x^2}$$

**Step 2: Exit velocity at $x = 4.00\,\text{m}$**
$$v(4.00) = \sqrt{1600.0(4.00) - 200.0(4.00)^2} = \sqrt{6400.0 - 200.0(16.0)} = \sqrt{6400.0 - 3200.0} = \sqrt{3200.0} = 56.568\,\text{m/s} \approx 56.6\,\text{m/s}$$

**Step 3: Maximum velocity**
Maximum velocity occurs where $a(x) = 0$:
$$800.0 - 200.0 x = 0 \implies x^* = 4.00\,\text{m}$$
Notice that $a(x) > 0$ for all $x \in [0, 4.00)$, so the projectile accelerates throughout the entire barrel!
Thus, $v_{\text{max}} = v(4.00) = 56.57\,\text{m/s}$.

---

### Example 11.3: Square-Root Velocity Drag
**Problem:** A high-speed hydrodynamic hull experiences a fluid drag deceleration that scales with the square root of speed:
$$a(v) = -\beta \sqrt{v} \quad (\beta = 0.800\,\text{m}^{1/2}/\text{s}^{3/2})$$
The hull enters the water with initial speed $v_0 = 36.0\,\text{m/s}$ at $t = 0$.
1. Derive an analytical expression for $v(t)$.
2. Calculate the exact time $t_{\text{stop}}$ when the hull comes to rest.
3. Calculate the total stopping distance $x_{\text{stop}}$.

#### Solution
**Step 1: Integrate for $v(t)$**
$$\frac{dv}{dt} = -\beta v^{1/2} \implies \int_{v_0}^v v'^{-1/2}\,dv' = -\beta \int_0^t dt'$$
$$\left[ 2 v'^{1/2} \right]_{v_0}^v = 2 \left(\sqrt{v} - \sqrt{v_0}\right) = -\beta t$$
$$\sqrt{v} = \sqrt{v_0} - \frac{1}{2} \beta t$$
Squaring both sides:
$$v(t) = \left( \sqrt{v_0} - \frac{1}{2} \beta t \right)^2$$

**Step 2: Time to stop ($v = 0$)**
$$\sqrt{v_0} - \frac{1}{2} \beta t_{\text{stop}} = 0 \implies t_{\text{stop}} = \frac{2 \sqrt{v_0}}{\beta}$$
Substitute $v_0 = 36.0\,\text{m/s}$ and $\beta = 0.800$:
$$t_{\text{stop}} = \frac{2 \sqrt{36.0}}{0.800} = \frac{2 \times 6.00}{0.800} = \frac{12.0}{0.800} = 15.00\,\text{s}$$

**Step 3: Total stopping distance**
Method A (Integrating $v(t)$):
$$x_{\text{stop}} = \int_0^{t_{\text{stop}}} \left( \sqrt{v_0} - \frac{1}{2} \beta t \right)^2 dt$$
Let $u = \sqrt{v_0} - \frac{1}{2} \beta t \implies du = -\frac{1}{2} \beta dt \implies dt = -\frac{2}{\beta} du$.
When $t = 0, u = \sqrt{v_0}$; when $t = t_{\text{stop}}, u = 0$:
$$x_{\text{stop}} = -\frac{2}{\beta} \int_{\sqrt{v_0}}^0 u^2\,du = \frac{2}{\beta} \int_0^{\sqrt{v_0}} u^2\,du = \frac{2}{\beta} \left[ \frac{u^3}{3} \right]_0^{\sqrt{v_0}} = \frac{2 v_0^{3/2}}{3 \beta}$$
$$x_{\text{stop}} = \frac{2 \times (36.0)^{1.5}}{3 \times 0.800} = \frac{2 \times 216.0}{2.40} = \frac{432.0}{2.40} = 180.0\,\text{m}$$

Method B (Chain rule $v\,dv = a\,dx$):
$$v \frac{dv}{dx} = -\beta v^{1/2} \implies v^{1/2}\,dv = -\beta\,dx$$
$$\int_{v_0}^0 v'^{1/2}\,dv' = -\beta \int_0^{x_{\text{stop}}} dx \implies \left[ \frac{2}{3} v'^{3/2} \right]_{v_0}^0 = -\beta x_{\text{stop}}$$
$$-\frac{2}{3} v_0^{3/2} = -\beta x_{\text{stop}} \implies x_{\text{stop}} = \frac{2 v_0^{3/2}}{3 \beta} = 180.0\,\text{m}$$. Exact match.

---

### Example 11.4: Linear Stokes Drag Stopping Distance
**Problem:** A micro-bead of mass $m = 2.00 \times 10^{-6}\,\text{kg}$ is injected into a viscous silicon oil bath with initial speed $v_0 = 12.0\,\text{m/s}$. The viscous drag coefficient is $b = 5.00 \times 10^{-5}\,\text{N}\cdot\text{s/m}$.
1. Compute the drag parameter $k = b/m$ and the time constant $\tau$.
2. Write the equations for $v(t)$ and $x(t)$.
3. Calculate the time required for the speed to drop to $1.00\%$ of its initial value.
4. Calculate the total stopping distance $x_{\text{stop}}$.

#### Solution
**Step 1: Compute $k$ and $\tau$**
$$k = \frac{b}{m} = \frac{5.00 \times 10^{-5}\,\text{N}\cdot\text{s/m}}{2.00 \times 10^{-6}\,\text{kg}} = 25.0\,\text{s}^{-1}$$
$$\tau = \frac{1}{k} = \frac{1}{25.0} = 0.0400\,\text{s} = 40.0\,\text{ms}$$

**Step 2: Analytical equations**
$$v(t) = v_0 e^{-k t} = 12.0 e^{-25.0 t}\,\text{m/s}$$
$$x(t) = \frac{v_0}{k} (1 - e^{-k t}) = \frac{12.0}{25.0} (1 - e^{-25.0 t}) = 0.480 (1 - e^{-25.0 t})\,\text{m}$$

**Step 3: Time to reach $1.00\%$ speed**
$$v(t) = 0.0100 v_0 \implies e^{-25.0 t} = 0.0100$$
$$-25.0 t = \ln(0.0100) = -4.60517 \implies t = \frac{4.60517}{25.0} = 0.1842\,\text{s} \approx 184\,\text{ms}$$

**Step 4: Total stopping distance**
$$x_{\text{stop}} = \lim_{t \to \infty} x(t) = 0.480\,\text{m} = 48.0\,\text{cm}$$

---

### Example 11.5: Quadratic Drag Horizontal Deceleration
**Problem:** A $0.145\,\text{kg}$ baseball is hit horizontally across a wind tunnel with initial speed $v_0 = 45.0\,\text{m/s}$. The air drag parameter is $c = 1.20 \times 10^{-3}\,\text{m}^{-1}$.
1. Determine the baseball's speed after $t = 1.50\,\text{s}$.
2. How many seconds elapse before the baseball's speed drops to $v_0 / 2 = 22.5\,\text{m/s}$?
3. Calculate the horizontal distance traversed during this interval.

#### Solution
**Step 1: Speed at $t = 1.50\,\text{s}$**
$$v(t) = \frac{v_0}{1 + c v_0 t}$$
$$c v_0 = (1.20 \times 10^{-3}\,\text{m}^{-1}) \times (45.0\,\text{m/s}) = 0.0540\,\text{s}^{-1}$$
$$v(1.50) = \frac{45.0}{1 + 0.0540(1.50)} = \frac{45.0}{1 + 0.0810} = \frac{45.0}{1.0810} = 41.628\,\text{m/s} \approx 41.6\,\text{m/s}$$

**Step 2: Time to reach half speed ($v = v_0 / 2$)**
$$\frac{v_0}{1 + c v_0 t_{1/2}} = \frac{v_0}{2} \implies 1 + c v_0 t_{1/2} = 2 \implies c v_0 t_{1/2} = 1$$
$$t_{1/2} = \frac{1}{c v_0} = \frac{1}{0.0540\,\text{s}^{-1}} = 18.519\,\text{s} \approx 18.5\,\text{s}$$

**Step 3: Distance traversed to reach half speed**
$$x(t) = \frac{1}{c} \ln(1 + c v_0 t)$$
At $t = t_{1/2}$, $1 + c v_0 t_{1/2} = 2$:
$$x(t_{1/2}) = \frac{1}{c} \ln(2) = \frac{\ln(2)}{1.20 \times 10^{-3}} = \frac{0.693147}{0.00120} = 577.62\,\text{m} \approx 578\,\text{m}$$

---

### Example 11.6: Vertical Free Fall with Terminal Velocity
**Problem:** A skydiver of total mass $m = 80.0\,\text{kg}$ jumps from a high-altitude balloon. The air resistance parameter is $c = 3.20 \times 10^{-3}\,\text{m}^{-1}$.
1. Compute the terminal velocity $v_{\text{term}}$ in $\text{m/s}$ and in $\text{km/h}$.
2. Calculate the skydiver's downward speed at $t = 3.00\,\text{s}$ and $t = 10.0\,\text{s}$.
3. What percentage of terminal velocity is reached after $t = 10.0\,\text{s}$?
4. Calculate the distance fallen in the first $10.0\,\text{s}$.

#### Solution
**Step 1: Terminal velocity**
$$v_{\text{term}} = \sqrt{\frac{g}{c}} = \sqrt{\frac{9.80\,\text{m/s}^2}{3.20 \times 10^{-3}\,\text{m}^{-1}}} = \sqrt{\frac{9.80}{0.00320}} = \sqrt{3062.5} = 55.3398\,\text{m/s} \approx 55.3\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v_{\text{term}} = 55.3398 \times 3.6 = 199.22\,\text{km/h} \approx 199\,\text{km/h}$$

**Step 2: Speed at intermediate times**
$$\frac{g}{v_{\text{term}}} = \frac{9.80}{55.3398} = 0.177088\,\text{s}^{-1}$$
At $t = 3.00\,\text{s}$:
$$\frac{g t}{v_{\text{term}}} = 0.177088 \times 3.00 = 0.53126$$
$$v(3.00) = v_{\text{term}} \tanh(0.53126) = 55.3398 \times 0.48640 = 26.917\,\text{m/s} \approx 26.9\,\text{m/s}$$

At $t = 10.0\,\text{s}$:
$$\frac{g t}{v_{\text{term}}} = 0.177088 \times 10.0 = 1.77088$$
$$v(10.0) = v_{\text{term}} \tanh(1.77088) = 55.3398 \times 0.94364 = 52.221\,\text{m/s} \approx 52.2\,\text{m/s}$$

**Step 3: Percentage of terminal velocity**
$$\text{Percentage} = \tanh(1.77088) \times 100\% = 94.36\% \approx 94.4\%$$

**Step 4: Distance fallen in $10.0\,\text{s}$**
$$y(t) = \frac{v_{\text{term}}^2}{g} \ln\left[\cosh\left(\frac{g t}{v_{\text{term}}}\right)\right]$$
$$\frac{v_{\text{term}}^2}{g} = \frac{3062.5}{9.80} = 312.50\,\text{m}$$
$$\cosh(1.77088) = 3.02047$$
$$\ln(3.02047) = 1.10539$$
$$y(10.0) = 312.50\,\text{m} \times 1.10539 = 345.43\,\text{m} \approx 345.4\,\text{m}$$
*(In a vacuum, the skydiver would have fallen $\frac{1}{2} g t^2 = 4.90(100) = 490.0\,\text{m}$. Air resistance reduced the fall distance by $145\,\text{m}$).*

---

### Example 11.7: Upward Projectile Under Quadratic Drag (Apogee Height)
**Problem:** A cannon fires a shell vertically upward with initial speed $v_0 = 120.0\,\text{m/s}$ through atmosphere with quadratic drag parameter $c = 2.00 \times 10^{-4}\,\text{m}^{-1}$.
1. Formulate the equation of motion for upward flight and integrate to find maximum height $H$.
2. Compute $H$ numerically.
3. Compare with the vacuum apogee height $H_{\text{vac}}$.

#### Solution
**Step 1: Integration for upward flight**
During ascent ($v > 0$), both gravity and air drag act downward:
$$a = \frac{dv}{dt} = -g - c v^2$$
Using the chain rule $a = v \frac{dv}{dy}$:
$$v \frac{dv}{dy} = -(g + c v^2) \implies \frac{v\,dv}{g + c v^2} = -dy$$

Integrating from launch $(y = 0, v = v_0)$ to the apex $(y = H, v = 0)$:
$$\int_{v_0}^0 \frac{v\,dv}{g + c v^2} = -\int_0^H dy = -H$$
$$\int_0^{v_0} \frac{v\,dv}{g + c v^2} = H$$

Let $u = g + c v^2 \implies du = 2 c v\,dv \implies v\,dv = \frac{du}{2c}$:
$$H = \frac{1}{2c} \int_g^{g + c v_0^2} \frac{du}{u} = \frac{1}{2c} \ln\left(\frac{g + c v_0^2}{g}\right) = \frac{1}{2c} \ln\left(1 + \frac{c v_0^2}{g}\right)$$

**Step 2: Numerical evaluation**
$$\frac{c v_0^2}{g} = \frac{(2.00 \times 10^{-4}\,\text{m}^{-1}) \times (120.0\,\text{m/s})^2}{9.80\,\text{m/s}^2} = \frac{0.00020 \times 14400.0}{9.80} = \frac{2.880}{9.80} = 0.293878$$
$$1 + \frac{c v_0^2}{g} = 1.293878$$
$$\ln(1.293878) = 0.257643$$
$$H = \frac{0.257643}{2 \times 2.00 \times 10^{-4}} = \frac{0.257643}{0.000400} = 644.11\,\text{m} \approx 644.1\,\text{m}$$

**Step 3: Vacuum comparison**
$$H_{\text{vac}} = \frac{v_0^2}{2g} = \frac{14400.0}{19.60} = 734.69\,\text{m}$$
Air resistance reduces the peak apogee by $90.6\,\text{m}$ ($12.3\%$).

---

### Example 11.8: Return Speed After Upward Launch with Drag
**Problem:** For the shell in Example 11.7 ($v_0 = 120.0\,\text{m/s}, c = 2.00 \times 10^{-4}\,\text{m}^{-1}$), the shell falls back from peak height $H = 644.11\,\text{m}$ to the ground.
1. Formulate the equation of motion for downward flight and calculate the impact speed $v_{\text{impact}}$.
2. Prove that the return impact speed is strictly less than the launch speed ($v_{\text{impact}} < v_0$).

#### Solution
**Step 1: Downward flight equation**
During descent ($v > 0$ downward), gravity acts downward while drag acts upward:
$$v \frac{dv}{dy} = g - c v^2 \implies \frac{v\,dv}{g - c v^2} = dy$$

Integrating from the apex ($y = 0, v = 0$) down through height $H$ where speed is $v_{\text{impact}}$:
$$\int_0^{v_{\text{impact}}} \frac{v\,dv}{g - c v^2} = \int_0^H dy = H$$
Let $u = g - c v^2 \implies du = -2 c v\,dv$:
$$-\frac{1}{2c} \ln\left(\frac{g - c v_{\text{impact}}^2}{g}\right) = H \implies \ln\left(1 - \frac{c v_{\text{impact}}^2}{g}\right) = -2 c H$$
$$1 - \frac{c v_{\text{impact}}^2}{g} = e^{-2 c H} \implies v_{\text{impact}}^2 = \frac{g}{c} \left(1 - e^{-2 c H}\right)$$

Substitute the known value of $H = \frac{1}{2c} \ln\left(1 + \frac{c v_0^2}{g}\right)$:
$$2 c H = \ln\left(1 + \frac{c v_0^2}{g}\right) \implies e^{-2 c H} = \frac{1}{1 + \frac{c v_0^2}{g}}$$
$$v_{\text{impact}}^2 = \frac{g}{c} \left[ 1 - \frac{1}{1 + \frac{c v_0^2}{g}} \right] = \frac{g}{c} \left[ \frac{\frac{c v_0^2}{g}}{1 + \frac{c v_0^2}{g}} \right] = \frac{v_0^2}{1 + \frac{c v_0^2}{g}}$$

Taking the square root:
$$v_{\text{impact}} = \frac{v_0}{\sqrt{1 + \frac{c v_0^2}{g}}}$$

**Step 2: Numerical evaluation**
Recall from Example 11.7 that $\frac{c v_0^2}{g} = 0.293878$:
$$v_{\text{impact}} = \frac{120.0}{\sqrt{1 + 0.293878}} = \frac{120.0}{\sqrt{1.293878}} = \frac{120.0}{1.137488} = 105.496\,\text{m/s} \approx 105.5\,\text{m/s}$$

**Proof that $v_{\text{impact}} < v_0$:**
Because $c > 0, v_0 > 0, g > 0$, the denominator $\sqrt{1 + \frac{c v_0^2}{g}} > 1$ strictly.
Therefore:
$$v_{\text{impact}} = \frac{v_0}{\sqrt{1 + \dots}} < v_0$$
Mechanical energy was continuously dissipated as heat into the air during both ascent and descent. The shell lands at $105.5\,\text{m/s}$ rather than its launch speed of $120.0\,\text{m/s}$.

---

### Example 11.9: Step-by-Step RK4 Numerical Ballistic Step
**Problem:** A 2D projectile simulation uses the coupled drag equations with $g = 9.80\,\text{m/s}^2$ and $c = 0.0020\,\text{m}^{-1}$. At time $t = 0$, the projectile is at the origin with velocity $\vec{v}_0 = 30.0\,\hat{i} + 40.0\,\hat{j}\,\text{m/s}$.
Perform one manual 4th-order Runge-Kutta (RK4) integration step with time-step $\Delta t = 0.100\,\text{s}$ to find the new velocity components $v_x(0.100)$ and $v_y(0.100)$.

#### Solution
The velocity derivatives are:
$$f_x(v_x, v_y) = -c \sqrt{v_x^2 + v_y^2}\,v_x$$
$$f_y(v_x, v_y) = -g - c \sqrt{v_x^2 + v_y^2}\,v_y$$

**Step 1: Compute Stage 1 ($\vec{k}_1$)**
State: $v_x = 30.0\,\text{m/s}, v_y = 40.0\,\text{m/s}$.
$$v = \sqrt{30.0^2 + 40.0^2} = 50.0\,\text{m/s}$$
$$k_{1,x} = -0.0020 \times 50.0 \times 30.0 = -3.0000\,\text{m/s}^2$$
$$k_{1,y} = -9.80 - (0.0020 \times 50.0 \times 40.0) = -9.80 - 4.0000 = -13.8000\,\text{m/s}^2$$

**Step 2: Compute Stage 2 ($\vec{k}_2$)**
Advance by $\frac{\Delta t}{2} = 0.050\,\text{s}$ using $\vec{k}_1$:
$$v_{x,2} = 30.0 + 0.050(-3.0000) = 30.0 - 0.1500 = 29.8500\,\text{m/s}$$
$$v_{y,2} = 40.0 + 0.050(-13.8000) = 40.0 - 0.6900 = 39.3100\,\text{m/s}$$
$$v_2 = \sqrt{(29.8500)^2 + (39.3100)^2} = \sqrt{891.0225 + 1545.2761} = \sqrt{2436.2986} = 49.3589\,\text{m/s}$$
$$k_{2,x} = -0.0020 \times 49.3589 \times 29.8500 = -2.9467\,\text{m/s}^2$$
$$k_{2,y} = -9.80 - (0.0020 \times 49.3589 \times 39.3100) = -9.80 - 3.8806 = -13.6806\,\text{m/s}^2$$

**Step 3: Compute Stage 3 ($\vec{k}_3$)**
Advance by $\frac{\Delta t}{2} = 0.050\,\text{s}$ using $\vec{k}_2$:
$$v_{x,3} = 30.0 + 0.050(-2.9467) = 30.0 - 0.1473 = 29.8527\,\text{m/s}$$
$$v_{y,3} = 40.0 + 0.050(-13.6806) = 40.0 - 0.6840 = 39.3160\,\text{m/s}$$
$$v_3 = \sqrt{(29.8527)^2 + (39.3160)^2} = \sqrt{891.1837 + 1545.7479} = \sqrt{2436.9316} = 49.3653\,\text{m/s}$$
$$k_{3,x} = -0.0020 \times 49.3653 \times 29.8527 = -2.9474\,\text{m/s}^2$$
$$k_{3,y} = -9.80 - (0.0020 \times 49.3653 \times 39.3160) = -9.80 - 3.8817 = -13.6817\,\text{m/s}^2$$

**Step 4: Compute Stage 4 ($\vec{k}_4$)**
Advance by $\Delta t = 0.100\,\text{s}$ using $\vec{k}_3$:
$$v_{x,4} = 30.0 + 0.100(-2.9474) = 30.0 - 0.2947 = 29.7053\,\text{m/s}$$
$$v_{y,4} = 40.0 + 0.100(-13.6817) = 40.0 - 1.3682 = 38.6318\,\text{m/s}$$
$$v_4 = \sqrt{(29.7053)^2 + (38.6318)^2} = \sqrt{882.405 + 1492.416} = \sqrt{2374.821} = 48.7321\,\text{m/s}$$
$$k_{4,x} = -0.0020 \times 48.7321 \times 29.7053 = -2.8953\,\text{m/s}^2$$
$$k_{4,y} = -9.80 - (0.0020 \times 48.7321 \times 38.6318) = -9.80 - 3.7651 = -13.5651\,\text{m/s}^2$$

**Step 5: Weighted average update**
$$k_{x,\text{eff}} = \frac{1}{6} \left[ -3.0000 + 2(-2.9467) + 2(-2.9474) - 2.8953 \right] = \frac{1}{6} \left[ -17.6835 \right] = -2.94725\,\text{m/s}^2$$
$$k_{y,\text{eff}} = \frac{1}{6} \left[ -13.8000 + 2(-13.6806) + 2(-13.6817) - 13.5651 \right] = \frac{1}{6} \left[ -82.0897 \right] = -13.6816\,\text{m/s}^2$$

$$v_x(0.100) = 30.0 + (-2.94725) \times 0.100 = 30.0 - 0.2947 = 29.7053\,\text{m/s}$$
$$v_y(0.100) = 40.0 + (-13.6816) \times 0.100 = 40.0 - 1.3682 = 38.6318\,\text{m/s}$$

---

### Example 11.10: Variable Mass Rocket Kinematics (Tsiolkovsky)
**Problem:** A sounding rocket with initial wet mass $m_0 = 1200.0\,\text{kg}$ burns propellant at a constant rate $R = \frac{dm}{dt} = 15.0\,\text{kg/s}$ with an effective exhaust velocity $v_e = 2400.0\,\text{m/s}$. The rocket launches vertically from rest against gravity $g = 9.80\,\text{m/s}^2$. Neglect atmospheric drag.
1. Write the rocket's mass as a function of time $m(t)$.
2. Formulate the equation of motion for acceleration $a(t)$.
3. Integrate to find the velocity $v(t)$ (Tsiolkovsky rocket equation with gravity).
4. Calculate the rocket's burnout velocity if total propellant mass is $m_p = 900.0\,\text{kg}$.

#### Solution
**Step 1: Mass function**
$$m(t) = m_0 - R t = 1200.0 - 15.0 t \quad (\text{kg})$$

**Step 2: Acceleration equation**
The thrust force is $F_{\text{thrust}} = R v_e = 15.0 \times 2400.0 = 36000.0\,\text{N}$.
By Newton's second law:
$$m(t) a(t) = F_{\text{thrust}} - m(t) g \implies a(t) = \frac{R v_e}{m_0 - R t} - g$$

**Step 3: Integrate for velocity $v(t)$**
$$v(t) = \int_0^t a(\tau)\,d\tau = \int_0^t \left( \frac{R v_e}{m_0 - R \tau} - g \right) d\tau$$
Let $u = m_0 - R \tau \implies du = -R\,d\tau \implies d\tau = -\frac{du}{R}$:
$$v(t) = -v_e \int_{m_0}^{m(t)} \frac{du}{u} - g t = v_e \ln\left(\frac{m_0}{m(t)}\right) - g t$$
This is the celebrated **Tsiolkovsky Rocket Equation under Gravity**.

**Step 4: Burnout velocity**
Burnout occurs when all propellant ($900.0\,\text{kg}$) is exhausted:
$$t_{\text{burn}} = \frac{m_p}{R} = \frac{900.0\,\text{kg}}{15.0\,\text{kg/s}} = 60.0\,\text{s}$$
Final dry mass:
$$m_{\text{dry}} = m_0 - m_p = 1200.0 - 900.0 = 300.0\,\text{kg}$$
Mass ratio:
$$\frac{m_0}{m_{\text{dry}}} = \frac{1200.0}{300.0} = 4.00$$

Burnout velocity:
$$v_{\text{burn}} = 2400.0 \ln(4.00) - (9.80 \times 60.0)$$
$$\ln(4.00) = 1.386294$$
$$v_{\text{burn}} = 2400.0(1.386294) - 588.0 = 3327.11 - 588.0 = 2739.11\,\text{m/s} \approx 2.74\,\text{km/s}$$

---

## 11.8 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 11.1 (Tier 1: Polynomial Time-Dependent Kinematics)
A particle moves along the $x$-axis with acceleration $a(t) = 6.00 t - 4.00\,\text{m/s}^2$. At $t = 0$, $x(0) = 2.00\,\text{m}$ and $v(0) = -5.00\,\text{m/s}$.
(a) Find $v(t)$ and $x(t)$.
(b) Find the times when the particle is momentarily at rest.
(c) Find the position at $t = 3.00\,\text{s}$.

### Exercise 11.2 (Tier 1: Linear Drag Characteristic Decay)
A particle moving through a viscous fluid has a velocity that decays according to $v(t) = 18.0 e^{-4.00 t}\,\text{m/s}$.
(a) What is the initial acceleration $a(0)$?
(b) What is the total stopping distance as $t \to \infty$?
(c) How long does it take for the particle to traverse $90\%$ of this stopping distance?

### Exercise 11.3 (Tier 2: Inverse-Square Acceleration)
A probe is attracted toward a gravitational center with acceleration $a(x) = -\frac{k}{x^2}$, where $k = 500.0\,\text{m}^3/\text{s}^2$. The probe is released from rest at $x_0 = 50.0\,\text{m}$. What is its speed when it reaches $x = 10.0\,\text{m}$?

### Exercise 11.4 (Tier 2: Quadratic Drag Speed Halving)
An arrow of mass $m = 0.0350\,\text{kg}$ is shot horizontally with initial speed $v_0 = 80.0\,\text{m/s}$. The aerodynamic drag force is $F = -c_d v^2$ with $c_d = 7.00 \times 10^{-4}\,\text{N}\cdot\text{s}^2/\text{m}^2$.
(a) Compute the drag parameter $c = c_d / m$.
(b) How many seconds elapse before the arrow's speed drops to $40.0\,\text{m/s}$?
(c) What distance does the arrow travel during this interval?

### Exercise 11.5 (Tier 3: Raindrop Falling with Linear Resistance)
A small water droplet of mass $m = 4.00 \times 10^{-7}\,\text{kg}$ falls from rest under gravity against linear viscous drag with coefficient $b = 1.60 \times 10^{-6}\,\text{N}\cdot\text{s/m}$.
(a) What is the droplet's terminal velocity $v_{\text{term}}$?
(b) How many seconds elapse before the droplet reaches $99.0\%$ of its terminal speed?
(c) What distance has the droplet fallen at that time?

### Exercise 11.6 (Tier 3: Terminal Velocity of a Hailstone)
A spherical hailstone of radius $r = 1.00\,\text{cm} = 0.0100\,\text{m}$ and density $\rho_{\text{ice}} = 900.0\,\text{kg/m}^3$ falls through air of density $\rho_{\text{air}} = 1.20\,\text{kg/m}^3$. The drag coefficient of the sphere is $C_d = 0.450$.
(a) Compute the mass and cross-sectional area of the hailstone.
(b) Compute the quadratic drag parameter $c$.
(c) Compute the terminal velocity $v_{\text{term}}$ in $\text{m/s}$ and $\text{km/h}$.

### Exercise 11.7 (Tier 4: Exponential Position-Dependent Acceleration)
A magnetic rail driver accelerates an electron packet according to $a(x) = A e^{-x / L}$, where $A = 1.20 \times 10^6\,\text{m/s}^2$ and $L = 0.500\,\text{m}$. The packet enters at $x = 0$ with $v_0 = 400.0\,\text{m/s}$. What is the packet's asymptotic speed as $x \to \infty$?

### Exercise 11.8 (Tier 4: Ascent Time with Quadratic Drag)
A projectile is fired vertically upward with initial speed $v_0 = 80.0\,\text{m/s}$ in an atmosphere where $v_{\text{term}} = 100.0\,\text{m/s}$.
(a) Derive an analytical formula for the time to reach apogee $t_{\text{apex}}$ in terms of $v_0, v_{\text{term}},$ and $g$.
(b) Compute $t_{\text{apex}}$ numerically and compare with the vacuum time $t_{\text{vac}} = v_0 / g$.

### Exercise 11.9 (Tier 5: Power-Law Velocity Drag Integration)
A racing hydrofoil is decelerated by hydrodynamic forces that scale with $v^3$:
$$a(v) = -\gamma v^3 \quad (\gamma = 0.0200\,\text{m}^{-2})$$
The hydrofoil enters the braking channel at $v_0 = 30.0\,\text{m/s}$ at $t = 0$.
(a) Derive analytical expressions for $v(t)$ and $x(t)$.
(b) Does this cubic drag law yield a finite or infinite stopping distance as $t \to \infty$? Compute the numerical limit.

### Exercise 11.10 (Tier 5: Two-Stage Rocket Velocity Profile)
A suborbital research rocket has initial mass $m_0 = 2000.0\,\text{kg}$.
- Stage 1: Burns $1200.0\,\text{kg}$ of propellant in $30.0\,\text{s}$ at constant exhaust velocity $v_{e1} = 2200.0\,\text{m/s}$.
- Coasting: An interstage delay of $10.0\,\text{s}$ where no thrust is applied.
- Stage 2: Burns $500.0\,\text{kg}$ of propellant in $20.0\,\text{s}$ at $v_{e2} = 2600.0\,\text{m/s}$.
Calculate the vertical velocity of the rocket at burnout of Stage 2 (neglect aerodynamic drag; use $g = 9.80\,\text{m/s}^2$).

---

## 11.9 Comprehensive Solutions to Chapter Exercises

---

### Solution 11.1
Given $a(t) = 6.00 t - 4.00$, $v(0) = -5.00$, $x(0) = 2.00$.
**(a) Velocity and position:**
$$v(t) = v(0) + \int_0^t (6.00 \tau - 4.00)\,d\tau = -5.00 + 3.00 t^2 - 4.00 t = 3.00 t^2 - 4.00 t - 5.00\,\text{m/s}$$
$$x(t) = x(0) + \int_0^t (3.00 \tau^2 - 4.00 \tau - 5.00)\,d\tau = 2.00 + t^3 - 2.00 t^2 - 5.00 t\,\text{m}$$

**(b) Momentarily at rest ($v = 0$):**
$$3.00 t^2 - 4.00 t - 5.00 = 0$$
Using the quadratic formula:
$$t = \frac{4.00 \pm \sqrt{(-4.00)^2 - 4(3.00)(-5.00)}}{2(3.00)} = \frac{4.00 \pm \sqrt{16.0 + 60.0}}{6.00} = \frac{4.00 \pm \sqrt{76.0}}{6.00} = \frac{4.00 \pm 8.7178}{6.00}$$
Taking the physical root $t > 0$:
$$t = \frac{12.7178}{6.00} = 2.1196\,\text{s} \approx 2.12\,\text{s}$$

**(c) Position at $t = 3.00\,\text{s}$:**
$$x(3.00) = 2.00 + (3.00)^3 - 2.00(3.00)^2 - 5.00(3.00) = 2.00 + 27.00 - 18.00 - 15.00 = -4.00\,\text{m}$$

---

### Solution 11.2
Given $v(t) = 18.0 e^{-4.00 t}\,\text{m/s}$. Here $v_0 = 18.0\,\text{m/s}$ and $k = 4.00\,\text{s}^{-1}$.
**(a) Initial acceleration:**
$$a(t) = \frac{dv}{dt} = -4.00(18.0 e^{-4.00 t}) = -72.0 e^{-4.00 t}\,\text{m/s}^2$$
$$a(0) = -72.0\,\text{m/s}^2$$

**(b) Total stopping distance:**
$$x_{\text{stop}} = \frac{v_0}{k} = \frac{18.0\,\text{m/s}}{4.00\,\text{s}^{-1}} = 4.50\,\text{m}$$

**(c) Time to traverse $90\%$ of distance ($x = 0.90 x_{\text{stop}}$):**
$$x(t) = x_{\text{stop}} (1 - e^{-k t}) = 0.90 x_{\text{stop}} \implies 1 - e^{-4.00 t} = 0.90$$
$$e^{-4.00 t} = 0.10 \implies -4.00 t = \ln(0.10) = -2.30259 \implies t = \frac{2.30259}{4.00} = 0.5756\,\text{s} \approx 0.576\,\text{s}$$

---

### Solution 11.3
Given $a(x) = -\frac{k}{x^2}$ with $k = 500.0\,\text{m}^3/\text{s}^2$. Released from rest ($v_0 = 0$) at $x_0 = 50.0\,\text{m}$.
Using $v\,dv = a(x)\,dx$:
$$\int_0^v v'\,dv' = \int_{x_0}^x -\frac{k}{x'^2}\,dx' = \left[ \frac{k}{x'} \right]_{x_0}^x = \frac{k}{x} - \frac{k}{x_0}$$
$$\frac{1}{2} v^2 = k \left(\frac{1}{x} - \frac{1}{x_0}\right) \implies v(x) = \sqrt{2 k \left(\frac{1}{x} - \frac{1}{x_0}\right)}$$

At $x = 10.0\,\text{m}$:
$$\frac{1}{x} - \frac{1}{x_0} = \frac{1}{10.0} - \frac{1}{50.0} = 0.100 - 0.020 = 0.0800\,\text{m}^{-1}$$
$$v = \sqrt{2 \times 500.0 \times 0.0800} = \sqrt{1000.0 \times 0.0800} = \sqrt{80.0} = 8.944\,\text{m/s} \approx 8.94\,\text{m/s}$$

---

### Solution 11.4
**(a) Drag parameter $c$:**
$$c = \frac{c_d}{m} = \frac{7.00 \times 10^{-4}\,\text{N}\cdot\text{s}^2/\text{m}^2}{0.0350\,\text{kg}} = 0.0200\,\text{m}^{-1}$$

**(b) Time to reach half speed ($v = 40.0\,\text{m/s}$):**
$$t_{1/2} = \frac{1}{c v_0} = \frac{1}{0.0200\,\text{m}^{-1} \times 80.0\,\text{m/s}} = \frac{1}{1.60\,\text{s}^{-1}} = 0.625\,\text{s}$$

**(c) Distance traveled:**
$$x = \frac{1}{c} \ln(1 + c v_0 t_{1/2}) = \frac{1}{0.0200} \ln(2) = 50.0 \times 0.693147 = 34.657\,\text{m} \approx 34.7\,\text{m}$$

---

### Solution 11.5
**(a) Terminal velocity:**
$$k = \frac{b}{m} = \frac{1.60 \times 10^{-6}\,\text{N}\cdot\text{s/m}}{4.00 \times 10^{-7}\,\text{kg}} = 4.00\,\text{s}^{-1}$$
$$v_{\text{term}} = \frac{g}{k} = \frac{9.80\,\text{m/s}^2}{4.00\,\text{s}^{-1}} = 2.45\,\text{m/s}$$

**(b) Time to reach $99.0\%$ speed:**
$$v(t) = v_{\text{term}} (1 - e^{-k t}) = 0.990 v_{\text{term}} \implies e^{-4.00 t} = 0.010$$
$$-4.00 t = \ln(0.010) = -4.60517 \implies t = \frac{4.60517}{4.00} = 1.1513\,\text{s} \approx 1.15\,\text{s}$$

**(c) Distance fallen:**
$$y(t) = v_{\text{term}} \left[ t - \frac{1}{k} (1 - e^{-k t}) \right] = 2.45 \left[ 1.1513 - \frac{1}{4.00}(0.990) \right] = 2.45 [1.1513 - 0.2475] = 2.45 \times 0.9038 = 2.214\,\text{m} \approx 2.21\,\text{m}$$

---

### Solution 11.6
**(a) Mass and area:**
Radius $r = 0.0100\,\text{m}$.
$$V = \frac{4}{3} \pi r^3 = \frac{4}{3} \pi (0.0100)^3 = 4.18879 \times 10^{-6}\,\text{m}^3$$
$$m = \rho_{\text{ice}} V = 900.0 \times 4.18879 \times 10^{-6} = 3.7699 \times 10^{-3}\,\text{kg} \approx 3.77\,\text{g}$$
$$A = \pi r^2 = \pi (0.0100)^2 = 3.14159 \times 10^{-4}\,\text{m}^2$$

**(b) Quadratic drag parameter $c$:**
$$c = \frac{\rho_{\text{air}} C_d A}{2 m} = \frac{1.20 \times 0.450 \times (3.14159 \times 10^{-4})}{2 \times (3.7699 \times 10^{-3})} = \frac{1.69646 \times 10^{-4}}{7.5398 \times 10^{-3}} = 0.02250\,\text{m}^{-1}$$

**(c) Terminal velocity:**
$$v_{\text{term}} = \sqrt{\frac{g}{c}} = \sqrt{\frac{9.80\,\text{m/s}^2}{0.02250\,\text{m}^{-1}}} = \sqrt{435.556} = 20.870\,\text{m/s} \approx 20.9\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v_{\text{term}} = 20.870 \times 3.6 = 75.13\,\text{km/h} \approx 75.1\,\text{km/h}$$

---

### Solution 11.7
Given $a(x) = A e^{-x / L}$ with $A = 1.20 \times 10^6\,\text{m/s}^2$, $L = 0.500\,\text{m}$, $v_0 = 400.0\,\text{m/s}$.
$$\int_{v_0}^v v'\,dv' = \int_0^x A e^{-x' / L}\,dx' = \left[ -A L e^{-x' / L} \right]_0^x = A L \left(1 - e^{-x / L}\right)$$
$$\frac{1}{2} v^2 - \frac{1}{2} v_0^2 = A L (1 - e^{-x / L})$$
$$v^2 = v_0^2 + 2 A L (1 - e^{-x / L})$$

As $x \to \infty$, $e^{-x / L} \to 0$:
$$v_{\infty}^2 = v_0^2 + 2 A L = (400.0)^2 + 2(1.20 \times 10^6)(0.500) = 160000 + 1200000 = 1360000\,\text{m}^2/\text{s}^2$$
$$v_{\infty} = \sqrt{1360000} = 1166.19\,\text{m/s} \approx 1.17\,\text{km/s}$$

---

### Solution 11.8
**(a) Formula for $t_{\text{apex}}$:**
During upward flight:
$$\frac{dv}{dt} = -g - c v^2 = -g \left(1 + \frac{c}{g} v^2\right) = -g \left(1 + \frac{v^2}{v_{\text{term}}^2}\right)$$
$$\int_{v_0}^0 \frac{dv}{1 + (v / v_{\text{term}})^2} = -g \int_0^{t_{\text{apex}}} dt = -g t_{\text{apex}}$$
$$\int_0^{v_0} \frac{dv}{1 + (v / v_{\text{term}})^2} = g t_{\text{apex}}$$
Using $\int \frac{du}{1 + u^2} = \arctan(u)$:
$$v_{\text{term}} \arctan\left(\frac{v_0}{v_{\text{term}}}\right) = g t_{\text{apex}} \implies t_{\text{apex}} = \frac{v_{\text{term}}}{g} \arctan\left(\frac{v_0}{v_{\text{term}}}\right)$$

**(b) Numerical comparison:**
$$v_0 = 80.0\,\text{m/s}, \quad v_{\text{term}} = 100.0\,\text{m/s}$$
$$\frac{v_0}{v_{\text{term}}} = \frac{80.0}{100.0} = 0.800$$
$$\arctan(0.800) = 0.674741\,\text{rad}$$
$$t_{\text{apex}} = \frac{100.0}{9.80} \times 0.674741 = 10.204 \times 0.674741 = 6.885\,\text{s} \approx 6.89\,\text{s}$$
Vacuum time:
$$t_{\text{vac}} = \frac{v_0}{g} = \frac{80.0}{9.80} = 8.163\,\text{s}$$
Drag brings the projectile to its apex $1.28\,\text{s}$ earlier ($15.7\%$ faster).

---

### Solution 11.9
Given $a(v) = -\gamma v^3$ with $\gamma = 0.0200\,\text{m}^{-2}, v_0 = 30.0\,\text{m/s}$.
**(a) Analytical expressions:**
$$\frac{dv}{dt} = -\gamma v^3 \implies \int_{v_0}^v \frac{dv'}{v'^3} = -\gamma \int_0^t dt'$$
$$\left[ -\frac{1}{2 v'^2} \right]_{v_0}^v = -\frac{1}{2 v^2} + \frac{1}{2 v_0^2} = -\gamma t \implies \frac{1}{v^2} = \frac{1}{v_0^2} + 2 \gamma t = \frac{1 + 2 \gamma v_0^2 t}{v_0^2}$$
$$v(t) = \frac{v_0}{\sqrt{1 + 2 \gamma v_0^2 t}}$$

For distance, use $v \frac{dv}{dx} = a(v) = -\gamma v^3 \implies \frac{dv}{v^2} = -\gamma\,dx$:
$$\int_{v_0}^v \frac{dv'}{v'^2} = -\gamma \int_0^x dx' \implies -\frac{1}{v} + \frac{1}{v_0} = -\gamma x$$
$$\gamma x = \frac{1}{v} - \frac{1}{v_0} \implies x(v) = \frac{1}{\gamma} \left(\frac{1}{v} - \frac{1}{v_0}\right)$$

**(b) Stopping distance:**
As $t \to \infty$, $v \to 0 \implies \frac{1}{v} \to \infty$.
Therefore, $x \to \infty$!
The cubic drag law yields an **infinite stopping distance**.

---

### Solution 11.10
**Stage 1:**
Initial mass: $m_0 = 2000.0\,\text{kg}$.
Propellant burned: $m_{p1} = 1200.0\,\text{kg}$ in $t_1 = 30.0\,\text{s}$.
Mass at end of Stage 1: $m_1 = 2000.0 - 1200.0 = 800.0\,\text{kg}$.
$$v_1 = v_{e1} \ln\left(\frac{m_0}{m_1}\right) - g t_1 = 2200.0 \ln\left(\frac{2000.0}{800.0}\right) - (9.80 \times 30.0)$$
$$\ln(2.50) = 0.916291$$
$$v_1 = 2200.0(0.916291) - 294.0 = 2015.84 - 294.0 = 1721.84\,\text{m/s}$$

**Coasting Phase ($\Delta t = 10.0\,\text{s}$):**
No thrust; rocket decelerates under gravity:
$$v_{\text{coast}} = v_1 - g \Delta t = 1721.84 - (9.80 \times 10.0) = 1721.84 - 98.0 = 1623.84\,\text{m/s}$$

**Stage 2:**
Initial mass for Stage 2: $m_{02} = 800.0\,\text{kg}$.
Propellant burned: $m_{p2} = 500.0\,\text{kg}$ in $t_2 = 20.0\,\text{s}$.
Final mass: $m_2 = 800.0 - 500.0 = 300.0\,\text{kg}$.
$$v_{\text{burnout}} = v_{\text{coast}} + v_{e2} \ln\left(\frac{m_{02}}{m_2}\right) - g t_2$$
$$\ln\left(\frac{800.0}{300.0}\right) = \ln(2.66667) = 0.980829$$
$$v_{e2} \ln(2.66667) = 2600.0 \times 0.980829 = 2550.16\,\text{m/s}$$
$$g t_2 = 9.80 \times 20.0 = 196.0\,\text{m/s}$$
$$v_{\text{burnout}} = 1623.84 + 2550.16 - 196.0 = 3978.00\,\text{m/s} \approx 3.98\,\text{km/s}$$
