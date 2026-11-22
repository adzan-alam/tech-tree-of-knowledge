# CHAPTER 10: Circular Motion & Centripetal Acceleration

> "Whenever a body moves along a curved path, there must be some cause that continuously bends its motion away from the straight rectilinear path that inertia would otherwise preserve."
> — **Christiaan Huygens**, *Horologium Oscillatorium* (1673)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Distinguish between scalar speed and vector velocity in curvilinear motion, proving why an object moving at constant speed along a curved path undergoes continuous non-zero acceleration.
2. Define and manipulate the angular kinematic variables: angular position ($\theta$), angular velocity ($\omega$), angular acceleration ($\alpha$), period ($T$), and rotational frequency ($f$).
3. Formulate 2D polar unit vectors $(\hat{u}_r, \hat{u}_\theta)$, compute their time derivatives from first principles, and establish the complete vector kinematic representations for position, velocity, and acceleration.
4. Derive the exact mathematical formulas for centripetal (radial) acceleration ($a_c = \frac{v^2}{r} = \omega^2 r$) and tangential acceleration ($a_t = \alpha r = \frac{dv}{dt}$).
5. Calculate the total acceleration magnitude and directional orientation for both Uniform Circular Motion (UCM) and Non-Uniform Circular Motion (NUCM).
6. Calculate the instantaneous **radius of curvature ($\rho$)** for arbitrary 2D trajectories using the osculating circle formula $\rho = \frac{v^3}{|\vec{v} \times \vec{a}|}$.
7. Apply the rotational kinematic equations of motion under constant angular acceleration to solve complex rotating mechanical systems and centrifuge engineering problems.

---

## 10.1 The Curvilinear Acceleration Paradox

In Chapter 03, we defined acceleration as the derivative of the velocity vector:
$$\vec{a}(t) = \frac{d\vec{v}}{dt} = \lim_{\Delta t \to 0} \frac{\vec{v}(t + \Delta t) - \vec{v}(t)}{\Delta t}$$

To a beginner, acceleration is synonymous with "stepping on the gas pedal"—increasing speed. However, velocity is a **vector**, possessing both a magnitude (scalar speed $v = |\vec{v}|$) and a spatial direction (unit heading vector $\hat{u}_v$):
$$\vec{v} = v\,\hat{u}_v$$

Applying the product rule of calculus to this vector:
$$\vec{a} = \frac{d\vec{v}}{dt} = \frac{d}{dt}\left( v\,\hat{u}_v \right) = \left(\frac{dv}{dt}\right)\hat{u}_v + v\left(\frac{d\hat{u}_v}{dt}\right)$$

This fundamental identity reveals that acceleration consists of two completely independent, orthogonal physical mechanisms:
1. **Tangential Acceleration ($\vec{a}_t$):** The rate of change of scalar speed:
   $$\vec{a}_t = \left(\frac{dv}{dt}\right)\hat{u}_v$$
   It points parallel to the velocity vector (speeding up) or antiparallel (slowing down).
2. **Normal / Centripetal Acceleration ($\vec{a}_n$):** The rate of change of directional heading:
   $$\vec{a}_n = v\left(\frac{d\hat{u}_v}{dt}\right)$$
   It points strictly perpendicular to the velocity vector, continuously bending the trajectory without altering the speed by a single meter per second!

Even if a particle travels at a rock-solid, unchanging speed of $v = 100\,\text{m/s}$ around a circular track, its direction is changing at every infinitesimal moment. Therefore, **its acceleration is emphatically non-zero.**

```
                       v(t + dt)
                          ^
                         /
                        /   dv (directed inward toward center)
                       *<---
                      /|
                     / |
             v(t)   /  |
                   *   | r
                    \  |
                     \ |
                      v
                    Center
```

---

## 10.2 Angular Kinematic Coordinates

When motion is constrained to a circular path of fixed radius $r$, Cartesian coordinates $(x, y)$ become cumbersome. The natural coordinate is the **angular position ($\theta$)**, measured in radians relative to a reference axis.

### Radians and Arc Length
An angle $\theta$ subtends an arc length $s$ along a circle of radius $r$:
$$s = r\theta \implies \theta = \frac{s}{r}$$
A complete revolution of $360^\circ$ corresponds to an arc length equal to the circumference $C = 2\pi r$, yielding $\theta = 2\pi\,\text{radians}$.

### Angular Velocity ($\omega$)
The rate at which the angle changes with time is the instantaneous **angular velocity**:
$$\omega = \frac{d\theta}{dt} = \dot{\theta} \quad (\text{radians per second, rad/s})$$

The linear speed $v$ (tangential speed) of a point tracing the circular arc is:
$$v = \frac{ds}{dt} = \frac{d(r\theta)}{dt} = r \frac{d\theta}{dt} = \omega r$$

### Period and Frequency
For Uniform Circular Motion (where $\omega$ is constant):
- The **Period ($T$)** is the time required for one full revolution ($2\pi\,\text{radians}$):
  $$T = \frac{2\pi}{\omega} = \frac{2\pi r}{v} \quad (\text{seconds, s})$$
- The **Frequency ($f$)** is the number of complete revolutions per second:
  $$f = \frac{1}{T} = \frac{\omega}{2\pi} \quad (\text{Hertz, Hz = s}^{-1})$$
  $$\omega = 2\pi f = \frac{2\pi}{T}$$

### Angular Acceleration ($\alpha$)
If the rotation speeds up or slows down, the rate of change of angular velocity is the **angular acceleration**:
$$\alpha = \frac{d\omega}{dt} = \frac{d^2\theta}{dt^2} = \ddot{\theta} \quad (\text{rad/s}^2)$$

The tangential linear acceleration of the rotating point is:
$$a_t = \frac{dv}{dt} = \frac{d(\omega r)}{dt} = r \frac{d\omega}{dt} = \alpha r$$

---

## 10.3 Vector Derivation in Polar Coordinates

To derive centripetal acceleration with mathematical perfection, we employ 2D polar unit vectors:
- $\hat{u}_r$: A unit vector pointing radially outward from the origin toward the particle.
- $\hat{u}_\theta$: A unit vector pointing in the direction of increasing $\theta$ (tangential counterclockwise).

```
 y
 ^          u_theta
 |            ^
 |            |   u_r
 |            *----->
 |           /
 |          / r
 |         /
 |  theta /
-+-------+----------------> x
 O
```

In terms of the fixed Cartesian basis $(\hat{i}, \hat{j})$:
$$\begin{aligned}
\hat{u}_r &= \cos\theta\,\hat{i} + \sin\theta\,\hat{j} \\
\hat{u}_\theta &= -\sin\theta\,\hat{i} + \cos\theta\,\hat{j}
\end{aligned}$$

Notice that unlike $\hat{i}$ and $\hat{j}$, the polar basis vectors **rotate with the particle**; their spatial directions change as $\theta(t)$ advances!

### Time Derivatives of Polar Basis Vectors
Differentiating with respect to time using the chain rule ($\frac{d}{dt} = \frac{d\theta}{dt}\frac{d}{d\theta} = \omega \frac{d}{d\theta}$):
$$\frac{d\hat{u}_r}{dt} = \frac{d}{dt}(\cos\theta\,\hat{i} + \sin\theta\,\hat{j}) = (-\sin\theta\,\dot{\theta})\,\hat{i} + (\cos\theta\,\dot{\theta})\,\hat{j} = \dot{\theta} (-\sin\theta\,\hat{i} + \cos\theta\,\hat{j}) = \omega\,\hat{u}_\theta$$

$$\frac{d\hat{u}_\theta}{dt} = \frac{d}{dt}(-\sin\theta\,\hat{i} + \cos\theta\,\hat{j}) = (-\cos\theta\,\dot{\theta})\,\hat{i} - (\sin\theta\,\dot{\theta})\,\hat{j} = -\dot{\theta} (\cos\theta\,\hat{i} + \sin\theta\,\hat{j}) = -\omega\,\hat{u}_r$$

**The Fundamental Rotation Rules:**
$$\frac{d\hat{u}_r}{dt} = \omega\,\hat{u}_\theta, \quad \frac{d\hat{u}_\theta}{dt} = -\omega\,\hat{u}_r$$

### Position, Velocity, and Acceleration
The position vector of a particle in circular motion of constant radius $r$ is:
$$\vec{r}(t) = r\,\hat{u}_r$$

Differentiating to find velocity:
$$\vec{v}(t) = \frac{d\vec{r}}{dt} = \frac{d}{dt}(r\,\hat{u}_r) = r \frac{d\hat{u}_r}{dt} = r (\omega\,\hat{u}_\theta) = (\omega r)\,\hat{u}_\theta = v\,\hat{u}_\theta$$
The velocity vector is strictly tangential, with zero radial component.

Now differentiate velocity to find acceleration:
$$\vec{a}(t) = \frac{d\vec{v}}{dt} = \frac{d}{dt}\left( \omega r\,\hat{u}_\theta \right) = \left( \frac{d\omega}{dt} r \right)\hat{u}_\theta + (\omega r)\left( \frac{d\hat{u}_\theta}{dt} \right)$$

Substitute $\frac{d\omega}{dt} = \alpha$ and $\frac{d\hat{u}_\theta}{dt} = -\omega\,\hat{u}_r$:
$$\vec{a}(t) = (\alpha r)\,\hat{u}_\theta + (\omega r)(-\omega\,\hat{u}_r) = -(\omega^2 r)\,\hat{u}_r + (\alpha r)\,\hat{u}_\theta$$

Grouping into radial and tangential components:
$$\vec{a} = a_r\,\hat{u}_r + a_t\,\hat{u}_\theta$$

where:
$$\begin{aligned}
a_r &= -\omega^2 r = -\frac{v^2}{r} \quad (\text{Radial / Centripetal Component}) \\
a_t &= \alpha r = \frac{dv}{dt} \quad (\text{Tangential Component})
\end{aligned}$$

The negative sign in $a_r$ confirms that the centripetal acceleration points **radially inward** toward the center of the circle (antiparallel to $\hat{u}_r$).

---

## 10.4 Total Acceleration in Non-Uniform Circular Motion

In general circular motion, the particle can simultaneously change its direction (via $a_c$) and its speed (via $a_t$).

```
                a_t (Tangential: changes speed)
                 ^
                 |      a_total (Resultant acceleration)
                 |     /|
                 |    / |
                 |   /  |
                 |  /   |
                 *------+---> a_c (Centripetal: changes direction, toward center)
```

Because $\hat{u}_r$ and $\hat{u}_\theta$ are mutually orthogonal ($\hat{u}_r \cdot \hat{u}_\theta = 0$), the magnitude of the total acceleration vector is obtained via the Pythagorean theorem:
$$a_{\text{total}} = \sqrt{a_c^2 + a_t^2} = \sqrt{\left(\frac{v^2}{r}\right)^2 + (\alpha r)^2} = \sqrt{\omega^4 r^2 + \alpha^2 r^2} = r \sqrt{\omega^4 + \alpha^2}$$

The directional angle $\phi$ of the total acceleration vector relative to the inward radial direction is:
$$\tan\phi = \frac{a_t}{a_c} = \frac{\alpha r}{\omega^2 r} = \frac{\alpha}{\omega^2}$$

### Special Cases:
1. **Uniform Circular Motion (UCM):**
   Speed is constant $\implies \alpha = 0 \implies a_t = 0$.
   Total acceleration is purely centripetal: $a_{\text{total}} = a_c = \frac{v^2}{r}$, pointing directly toward the center.
2. **Instantaneous Rest ($\omega = 0, \alpha \ne 0$):**
   A pendulum released from rest has $v = 0 \implies a_c = 0$.
   Total acceleration is purely tangential: $a_{\text{total}} = a_t = \alpha r$.

---

## 10.5 Constant Angular Acceleration (Rotational Sacred Equations)

When the angular acceleration $\alpha$ is constant, the mathematical structure of rotational kinematics is identical to 1D linear kinematics under constant acceleration $a$.
Every linear variable maps directly to an angular analogue:

| Linear Kinematics ($a = \text{const}$) | Rotational Kinematics ($\alpha = \text{const}$) |
|:---|:---|
| Position $x$ | Angle $\theta$ |
| Initial velocity $v_0$ | Initial angular velocity $\omega_0$ |
| Final velocity $v$ | Final angular velocity $\omega$ |
| Acceleration $a$ | Angular acceleration $\alpha$ |
| Elapsed time $t$ | Elapsed time $t$ |

### The Four Sacred Rotational Equations:
$$\begin{aligned}
\omega(t) &= \omega_0 + \alpha t \\
\theta(t) &= \theta_0 + \omega_0 t + \frac{1}{2} \alpha t^2 \\
\omega^2 &= \omega_0^2 + 2 \alpha (\theta - \theta_0) \\
\theta - \theta_0 &= \left(\frac{\omega_0 + \omega}{2}\right) t
\end{aligned}$$

---

## 10.6 The Osculating Circle and Radius of Curvature ($\rho$)

Circular motion kinematics is not restricted to literal geometric circles. **Any smooth arbitrary curved path** in 2D space can be approximated locally at any point by an infinitesimal circular arc known as the **Osculating Circle** (from the Latin *osculari*, to kiss).

```
         \            * * * Osculating Circle of radius rho
          \       *           *
           \    *               *
  Path -----\--*                 *
             *                    *
            / *                  *
           /    *              *
          /       *          *
                    * * * *
```

The radius of this tangent kissing circle is the local **Radius of Curvature ($\rho$)**.
At that specific point, the normal acceleration perpendicular to the path is:
$$a_n = \frac{v^2}{\rho} \implies \rho = \frac{v^2}{a_n}$$

### Vector Cross-Product Formulation
For an arbitrary parametric 2D trajectory with velocity $\vec{v}$ and acceleration $\vec{a}$:
The magnitude of the cross product gives:
$$|\vec{v} \times \vec{a}| = v\,a\,\sin\psi = v\,a_n$$
where $\psi$ is the angle between $\vec{v}$ and $\vec{a}$, and $a_n = a \sin\psi$ is the component of acceleration normal to the path.
Therefore:
$$a_n = \frac{|\vec{v} \times \vec{a}|}{v}$$

Substituting into the curvature radius formula:
$$\rho = \frac{v^2}{a_n} = \frac{v^2}{|\vec{v} \times \vec{a}| / v} = \frac{v^3}{|\vec{v} \times \vec{a}|}$$

### Cartesian Explicit Formulation $y(x)$
From differential calculus, the radius of curvature of a curve given by $y = f(x)$ is:
$$\rho = \frac{\left[1 + \left(\frac{dy}{dx}\right)^2\right]^{3/2}}{\left|\frac{d^2y}{dx^2}\right|}$$

---

## 10.7 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 10.1: Earth's Surface Rotation and Centripetal Acceleration
**Problem:** The Earth has an equatorial radius $R_E = 6.378 \times 10^6\,\text{m}$ and completes one full rotation on its axis in one sidereal day ($T = 86164\,\text{s} \approx 23\,\text{h}\,56\,\text{min}\,4\,\text{s}$).
1. Calculate the Earth's angular rotation speed $\omega$ in $\text{rad/s}$.
2. Calculate the linear speed $v$ of a research station located on the equator.
3. Calculate the centripetal acceleration $a_c$ at the equator, and express it as a percentage of standard gravity $g = 9.80\,\text{m/s}^2$.

#### Solution
**Step 1: Angular velocity**
$$\omega = \frac{2\pi}{T} = \frac{2 \times 3.14159265}{86164\,\text{s}} = 7.2921 \times 10^{-5}\,\text{rad/s}$$

**Step 2: Linear speed at the equator**
$$v = \omega R_E = (7.2921 \times 10^{-5}\,\text{rad/s}) \times (6.378 \times 10^6\,\text{m}) = 465.09\,\text{m/s} \approx 465.1\,\text{m/s} \approx 1674\,\text{km/h}$$

**Step 3: Centripetal acceleration**
$$a_c = \omega^2 R_E = (7.2921 \times 10^{-5})^2 \times 6.378 \times 10^6 = (5.3175 \times 10^{-9}) \times (6.378 \times 10^6) = 0.03391\,\text{m/s}^2$$
Alternatively:
$$a_c = \frac{v^2}{R_E} = \frac{(465.09)^2}{6.378 \times 10^6} = \frac{216309}{6.378 \times 10^6} = 0.03391\,\text{m/s}^2$$

Percentage of $g$:
$$\text{Fraction} = \frac{0.03391\,\text{m/s}^2}{9.80\,\text{m/s}^2} \times 100\% = 0.346\% \approx 0.35\%$$
*Physical Sanity:* The Earth's rotation reduces apparent weight at the equator by approximately $0.35\%$.

---

### Example 10.2: Laboratory Centrifuge Acceleration
**Problem:** A medical ultra-centrifuge spins test tubes at $45,000\,\text{RPM}$ (revolutions per minute). The sample tube is held at a radial distance $r = 8.50\,\text{cm} = 0.0850\,\text{m}$ from the axis of rotation.
1. Convert the rotational frequency to $\text{rad/s}$.
2. Calculate the tangential speed $v$ of the sample.
3. Compute the centripetal acceleration in $\text{m/s}^2$ and in multiples of standard gravity ($g$-force).

#### Solution
**Step 1: Angular speed in rad/s**
$$\omega = 45000\,\frac{\text{rev}}{\text{min}} \times \frac{2\pi\,\text{rad}}{1\,\text{rev}} \times \frac{1\,\text{min}}{60\,\text{s}} = 45000 \times \frac{2\pi}{60} = 1500\pi\,\text{rad/s} \approx 4712.39\,\text{rad/s}$$

**Step 2: Tangential speed**
$$v = \omega r = 4712.39\,\text{rad/s} \times 0.0850\,\text{m} = 400.55\,\text{m/s}$$
The sample is traveling faster than the speed of sound in air ($343\,\text{m/s}$)!

**Step 3: Centripetal acceleration**
$$a_c = \omega^2 r = (4712.39)^2 \times 0.0850 = 22206600 \times 0.0850 = 1.88756 \times 10^6\,\text{m/s}^2$$
In $g$-units:
$$\text{Number of }g\text{'s} = \frac{1.88756 \times 10^6\,\text{m/s}^2}{9.80\,\text{m/s}^2} = 192,608\,g \approx 193,000\,g$$

---

### Example 10.3: Non-Uniform Circular Motion Total Acceleration
**Problem:** A high-speed turbine rotor of radius $r = 0.400\,\text{m}$ starts from rest at $t = 0$ and accelerates with constant angular acceleration $\alpha = 15.0\,\text{rad/s}^2$. At $t = 2.00\,\text{s}$, determine:
1. The angular velocity $\omega$.
2. The tangential acceleration $a_t$.
3. The centripetal acceleration $a_c$.
4. The total linear acceleration magnitude $a_{\text{total}}$ and its angle $\phi$ relative to the radial vector.

#### Solution
**Step 1: Angular velocity at $t = 2.00\,\text{s}$**
$$\omega(t) = \omega_0 + \alpha t = 0 + 15.0 \times 2.00 = 30.0\,\text{rad/s}$$

**Step 2: Tangential acceleration**
$$a_t = \alpha r = 15.0\,\text{rad/s}^2 \times 0.400\,\text{m} = 6.00\,\text{m/s}^2$$

**Step 3: Centripetal acceleration**
$$a_c = \omega^2 r = (30.0\,\text{rad/s})^2 \times 0.400\,\text{m} = 900.0 \times 0.400 = 360.0\,\text{m/s}^2$$

**Step 4: Total acceleration magnitude and angle**
$$a_{\text{total}} = \sqrt{a_c^2 + a_t^2} = \sqrt{(360.0)^2 + (6.00)^2} = \sqrt{129600 + 36.0} = \sqrt{129636} = 360.05\,\text{m/s}^2 \approx 360.1\,\text{m/s}^2$$
Angle relative to inward radial direction:
$$\tan\phi = \frac{a_t}{a_c} = \frac{6.00}{360.0} = 0.016667 \implies \phi = \arctan(0.016667) = 0.955^\circ$$
The centripetal acceleration completely dominates, with the total vector pointing less than $1^\circ$ away from the center.

---

### Example 10.4: Time When Centripetal Equals Tangential Acceleration
**Problem:** A flywheel of radius $R$ starts from rest and rotates with constant angular acceleration $\alpha > 0$.
1. Derive an analytical formula for the elapsed time $t^*$ at which the centripetal acceleration magnitude equals the tangential acceleration magnitude ($a_c = a_t$).
2. How many radians $\theta^*$ and how many revolutions has the flywheel rotated during this time?
3. If $\alpha = 4.00\,\text{rad/s}^2$, compute $t^*$ and the number of revolutions numerically.

#### Solution
**Step 1: Analytical formula for $t^*$**
$$\omega(t) = \alpha t$$
$$a_c(t) = \omega^2 R = (\alpha t)^2 R = \alpha^2 t^2 R$$
$$a_t = \alpha R$$
Setting $a_c = a_t$:
$$\alpha^2 t^2 R = \alpha R \implies \alpha t^2 = 1 \implies t^* = \frac{1}{\sqrt{\alpha}}$$

Notice the remarkable property: **$t^*$ depends purely on the angular acceleration $\alpha$, completely independent of the wheel radius $R$!**

**Step 2: Angular rotation $\theta^*$**
$$\theta(t^*) = \frac{1}{2} \alpha (t^*)^2 = \frac{1}{2} \alpha \left(\frac{1}{\alpha}\right) = \frac{1}{2}\,\text{radian} = 0.500\,\text{rad}$$
In revolutions:
$$N = \frac{\theta^*}{2\pi} = \frac{0.500}{2\pi} = \frac{1}{4\pi} \approx 0.07958\,\text{rev} \approx 28.65^\circ$$
**Universal Rule:** For any wheel starting from rest under constant angular acceleration, $a_c$ equals $a_t$ precisely when the wheel has rotated through exactly half a radian ($0.5\,\text{rad}$), regardless of radius or acceleration!

**Step 3: Numerical evaluation for $\alpha = 4.00\,\text{rad/s}^2$**
$$t^* = \frac{1}{\sqrt{4.00}} = \frac{1}{2.00} = 0.500\,\text{s}$$
$$N = 0.0796\,\text{revolutions}$$

---

### Example 10.5: Radius of Curvature of a Projectile at Apex
**Problem:** A projectile is launched with speed $v_0 = 50.0\,\text{m/s}$ at an angle $\theta = 60.0^\circ$ above the horizontal.
1. Determine the projectile's velocity at the apex of its trajectory.
2. Determine the normal acceleration at the apex.
3. Compute the radius of curvature $\rho_{\text{apex}}$ of the osculating circle at the apex.

#### Solution
**Step 1: Velocity at the apex**
At the apex, $v_y = 0$. The velocity is purely horizontal:
$$v_{\text{apex}} = v_{0x} = v_0 \cos\theta = 50.0 \cos(60.0^\circ) = 50.0 \times 0.500 = 25.0\,\text{m/s}$$

**Step 2: Normal acceleration at apex**
At the apex, the projectile moves horizontally ($\vec{v} = 25.0\,\hat{i}\,\text{m/s}$).
The gravitational acceleration is directed vertically downward ($\vec{a} = -g\,\hat{j} = -9.80\,\hat{j}\,\text{m/s}^2$).
Because $\vec{v}$ and $\vec{a}$ are perpendicular, the entire acceleration is normal to the path:
$$a_n = g = 9.80\,\text{m/s}^2$$

**Step 3: Radius of curvature**
$$\rho_{\text{apex}} = \frac{v_{\text{apex}}^2}{a_n} = \frac{(25.0\,\text{m/s})^2}{9.80\,\text{m/s}^2} = \frac{625.0}{9.80} = 63.776\,\text{m} \approx 63.8\,\text{m}$$

*Sanity Check via Trajectory Equation:*
$y(x) = x \tan\theta - \frac{g}{2 v_{0x}^2} x^2$.
At the apex, the slope is zero: $y' = 0$.
The second derivative is constant everywhere: $y'' = -\frac{g}{v_{0x}^2}$.
Using the calculus formula:
$$\rho = \frac{[1 + (y')^2]^{3/2}}{|y''|} = \frac{[1 + 0]^{3/2}}{g / v_{0x}^2} = \frac{v_{0x}^2}{g} = \frac{(25.0)^2}{9.80} = 63.78\,\text{m}$$. Exact match.

---

### Example 10.6: Radius of Curvature at Launch
**Problem:** For the projectile in Example 10.5 ($v_0 = 50.0\,\text{m/s}, \theta = 60.0^\circ$), calculate the radius of curvature $\rho_{\text{launch}}$ at the very instant of launch ($t = 0$).

#### Solution
**Step 1: Normal component of acceleration at launch**
At launch, the velocity vector is directed at angle $\theta = 60.0^\circ$ above the horizontal.
Gravity $\vec{g}$ acts straight down (at an angle of $90.0^\circ$ below the horizontal).
The angle between $\vec{v}_0$ and $\vec{g}$ is $\psi = 90.0^\circ + 60.0^\circ = 150.0^\circ$.
The normal component of acceleration perpendicular to $\vec{v}_0$ is:
$$a_n = g \cos\theta = 9.80 \cos(60.0^\circ) = 9.80 \times 0.500 = 4.90\,\text{m/s}^2$$

```
           v_0 (at 60 deg)
          ^
          | \
          |  \ a_t = g sin(60 deg) (opposite v_0)
          |   \
          +----*----> a_n = g cos(60 deg) (perpendicular to v_0)
          |   /
          |  /
          v /
          g (downward)
```

**Step 2: Compute radius of curvature**
$$\rho_{\text{launch}} = \frac{v_0^2}{a_n} = \frac{(50.0\,\text{m/s})^2}{4.90\,\text{m/s}^2} = \frac{2500.0}{4.90} = 510.20\,\text{m} \approx 510.2\,\text{m}$$

Notice how much flatter the trajectory is at launch ($\rho = 510.2\,\text{m}$) compared to the sharp bend at the apex ($\rho = 63.8\,\text{m}$).

---

### Example 10.7: Rotational Braking of an Industrial Grinding Wheel
**Problem:** A grinding wheel of radius $r = 0.150\,\text{m}$ operates at $3600\,\text{RPM}$. When power is cut, friction brings the wheel to rest uniformly in $40.0\,\text{s}$.
1. Find the angular deceleration $\alpha$.
2. Calculate the total number of revolutions turned during braking.
3. Calculate the tangential deceleration and centripetal acceleration of a point on the rim at $t = 20.0\,\text{s}$.

#### Solution
**Step 1: Angular deceleration**
$$\omega_0 = 3600\,\frac{\text{rev}}{\text{min}} \times \frac{2\pi\,\text{rad}}{60\,\text{s}} = 120\pi\,\text{rad/s} \approx 376.991\,\text{rad/s}$$
$$\omega(t) = \omega_0 + \alpha t \implies 0 = 376.991 + \alpha(40.0)$$
$$\alpha = -\frac{376.991}{40.0} = -9.4248\,\text{rad/s}^2 \approx -9.42\,\text{rad/s}^2$$

**Step 2: Total revolutions**
$$\Delta\theta = \left(\frac{\omega_0 + \omega}{2}\right) t = \left(\frac{376.991 + 0}{2}\right) \times 40.0 = 188.496 \times 40.0 = 7539.82\,\text{rad}$$
In revolutions:
$$N = \frac{\Delta\theta}{2\pi} = \frac{7539.82}{2\pi} = 1200.0\,\text{revolutions}$$

**Step 3: Accelerations at $t = 20.0\,\text{s}$**
Tangential deceleration (constant):
$$a_t = |\alpha| r = 9.4248 \times 0.150 = 1.4137\,\text{m/s}^2 \approx 1.41\,\text{m/s}^2$$
Angular velocity at $t = 20.0\,\text{s}$:
$$\omega(20.0) = \omega_0 + \alpha(20.0) = 376.991 - 9.4248(20.0) = 188.496\,\text{rad/s} \quad (\text{exactly half})$$
Centripetal acceleration:
$$a_c = \omega^2 r = (188.496)^2 \times 0.150 = 35530.7 \times 0.150 = 5329.6\,\text{m/s}^2$$

---

### Example 10.8: Aircraft Performing a Coordinated High-$g$ Turn
**Problem:** A jet fighter flies at Mach 1.8 at high altitude where the speed of sound is $300.0\,\text{m/s}$ (true airspeed $v = 1.8 \times 300.0 = 540.0\,\text{m/s}$). The pilot pulls into a horizontal coordinated turn maintaining constant speed, subject to a maximum physiological acceleration limit of $a_{\text{max}} = 9.00\,g = 9.00 \times 9.80 = 88.2\,\text{m/s}^2$.
1. What is the minimum radius of turn $R_{\text{min}}$?
2. What is the angular rate of turn $\omega$ in $\text{deg/s}$?
3. How many seconds are required to complete a $180^\circ$ reversal turn?

#### Solution
**Step 1: Minimum radius of turn**
$$a_c = \frac{v^2}{R} \le a_{\text{max}} \implies R_{\text{min}} = \frac{v^2}{a_{\text{max}}}$$
$$R_{\text{min}} = \frac{(540.0\,\text{m/s})^2}{88.2\,\text{m/s}^2} = \frac{291600}{88.2} = 3306.12\,\text{m} \approx 3.31\,\text{km}$$

**Step 2: Angular turn rate**
$$\omega = \frac{v}{R} = \frac{540.0\,\text{m/s}}{3306.12\,\text{m}} = 0.16333\,\text{rad/s}$$
Convert to degrees per second:
$$\omega_{\text{deg}} = 0.16333\,\text{rad/s} \times \frac{180^\circ}{\pi\,\text{rad}} = 9.358^\circ/\text{s} \approx 9.36^\circ/\text{s}$$

**Step 3: Time for $180^\circ$ reversal**
$$\Delta t = \frac{180.0^\circ}{9.358^\circ/\text{s}} = 19.235\,\text{s} \approx 19.2\,\text{s}$$

---

### Example 10.9: Kinematics of a Stepper Motor Disk
**Problem:** A robotic disk moves according to the angular position function:
$$\theta(t) = 4.00 t^3 - 9.00 t^2 + 12.0\,\text{rad} \quad (t \ge 0)$$
The disk has radius $R = 0.250\,\text{m}$.
1. Find expressions for $\omega(t)$ and $\alpha(t)$.
2. At what non-zero time $t_0$ does the disk come to instantaneous rotational rest?
3. What is the magnitude of the total linear acceleration of a point on the rim at $t = 1.00\,\text{s}$?

#### Solution
**Step 1: Derivatives**
$$\omega(t) = \frac{d\theta}{dt} = 12.0 t^2 - 18.0 t \quad (\text{rad/s})$$
$$\alpha(t) = \frac{d\omega}{dt} = 24.0 t - 18.0 \quad (\text{rad/s}^2)$$

**Step 2: Instantaneous rest**
Set $\omega(t) = 0$:
$$12.0 t^2 - 18.0 t = 0 \implies 6.0 t (2.0 t - 3.0) = 0$$
Excluding $t = 0$:
$$2.0 t - 3.0 = 0 \implies t_0 = 1.50\,\text{s}$$

**Step 3: Acceleration at $t = 1.00\,\text{s}$**
$$\omega(1.00) = 12.0(1.00)^2 - 18.0(1.00) = 12.0 - 18.0 = -6.00\,\text{rad/s}$$
$$\alpha(1.00) = 24.0(1.00) - 18.0 = +6.00\,\text{rad/s}^2$$

Compute components:
$$a_c = \omega^2 R = (-6.00)^2 \times 0.250 = 36.0 \times 0.250 = 9.00\,\text{m/s}^2$$
$$a_t = \alpha R = 6.00 \times 0.250 = 1.50\,\text{m/s}^2$$
Total linear acceleration:
$$a_{\text{total}} = \sqrt{a_c^2 + a_t^2} = \sqrt{(9.00)^2 + (1.50)^2} = \sqrt{81.0 + 2.25} = \sqrt{83.25} = 9.124\,\text{m/s}^2 \approx 9.12\,\text{m/s}^2$$

---

### Example 10.10: Frenet-Serret Curvature on a Cubic Polynomial Path
**Problem:** An autonomous mining haul truck traverses a road profile given by the cubic equation:
$$y(x) = \frac{1}{6000} x^3 \quad (\text{for } 0 \le x \le 100.0\,\text{m})$$
The truck maintains a constant ground speed of $v = 15.0\,\text{m/s}$.
1. Find the first and second derivatives $\frac{dy}{dx}$ and $\frac{d^2y}{dx^2}$ at $x = 60.0\,\text{m}$.
2. Compute the radius of curvature $\rho$ of the road at $x = 60.0\,\text{m}$.
3. Calculate the centripetal acceleration experienced by the truck at that point.

#### Solution
**Step 1: Derivatives at $x = 60.0\,\text{m}$**
$$y'(x) = \frac{d}{dx}\left(\frac{1}{6000} x^3\right) = \frac{3 x^2}{6000} = \frac{x^2}{2000}$$
At $x = 60.0\,\text{m}$:
$$y'(60.0) = \frac{(60.0)^2}{2000} = \frac{3600}{2000} = 1.800$$

$$y''(x) = \frac{d}{dx}\left(\frac{x^2}{2000}\right) = \frac{2x}{2000} = \frac{x}{1000}$$
At $x = 60.0\,\text{m}$:
$$y''(60.0) = \frac{60.0}{1000} = 0.0600\,\text{m}^{-1}$$

**Step 2: Radius of curvature**
$$\rho = \frac{\left[1 + (y')^2\right]^{3/2}}{|y''|} = \frac{\left[1 + (1.800)^2\right]^{3/2}}{0.0600} = \frac{[1 + 3.24]^{3/2}}{0.0600} = \frac{(4.24)^{1.5}}{0.0600}$$
$$(4.24)^{1.5} = 4.24 \times \sqrt{4.24} = 4.24 \times 2.059126 = 8.7307$$
$$\rho = \frac{8.7307}{0.0600} = 145.51\,\text{m} \approx 145.5\,\text{m}$$

**Step 3: Centripetal acceleration**
$$a_c = \frac{v^2}{\rho} = \frac{(15.0\,\text{m/s})^2}{145.51\,\text{m}} = \frac{225.0}{145.51} = 1.546\,\text{m/s}^2 \approx 1.55\,\text{m/s}^2$$
Because the speed is constant, the tangential acceleration is zero ($a_t = 0$), so $a_{\text{total}} = a_c = 1.55\,\text{m/s}^2$.

---

## 10.8 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 10.1 (Tier 1: Uniform Circular Motion Basics)
A child rides a carousel rotating at a constant rate of $4.00\,\text{RPM}$. The child sits at a distance $r = 5.00\,\text{m}$ from the central pivot.
(a) What is the angular speed $\omega$ in $\text{rad/s}$?
(b) What is the child's tangential linear speed $v$?
(c) What is the child's centripetal acceleration $a_c$?

### Exercise 10.2 (Tier 1: Constant Angular Acceleration Spin-Up)
A ceiling fan blade starts from rest and reaches an operating speed of $180\,\text{RPM}$ in $6.00\,\text{s}$ with constant angular acceleration.
(a) What is the angular acceleration $\alpha$?
(b) How many complete revolutions does the fan make during this startup interval?

### Exercise 10.3 (Tier 2: Ratio of Radial to Tangential Acceleration)
A centrifuge rotor of radius $R = 0.200\,\text{m}$ starts from rest with constant angular acceleration $\alpha = 8.00\,\text{rad/s}^2$. At what elapsed time $t$ will the centripetal acceleration be exactly 10 times larger than the tangential acceleration ($a_c = 10 a_t$)?

### Exercise 10.4 (Tier 2: Highway Curve Design)
Civil engineers design an unbanked circular highway exit curve with radius $R = 120.0\,\text{m}$. If the maximum allowable lateral acceleration for passenger comfort is $a_{\text{max}} = 2.20\,\text{m/s}^2$, what is the maximum recommended speed limit in $\text{km/h}$?

### Exercise 10.5 (Tier 3: The Tangential/Centripetal Acceleration Angle)
A particle moves along a circular path of radius $R = 2.00\,\text{m}$. Its speed as a function of time is given by $v(t) = 3.00 t^2\,\text{m/s}$.
(a) Find expressions for $a_t(t)$ and $a_c(t)$.
(b) Find the time $t > 0$ when the total acceleration vector makes an angle of $45.0^\circ$ with the velocity vector.

### Exercise 10.6 (Tier 3: Curvature of a Parabolic Trajectory at Landing)
A cannonball is launched across level terrain with $v_0 = 40.0\,\text{m/s}$ at $\theta = 45.0^\circ$.
(a) What is the normal component of acceleration at the impact point?
(b) Calculate the radius of curvature $\rho$ of the trajectory at the impact point.

### Exercise 10.7 (Tier 4: Two-Gear Kinematic Transmission)
Gear A of radius $r_A = 8.00\,\text{cm}$ is coupled without slipping to Gear B of radius $r_B = 24.0\,\text{cm}$. Gear A accelerates from rest at $\alpha_A = 6.00\,\text{rad/s}^2$.
(a) What is the angular acceleration $\alpha_B$ of Gear B?
(b) When Gear A reaches $\omega_A = 30.0\,\text{rad/s}$, what is the total acceleration of a tooth on the outer rim of Gear B?

### Exercise 10.8 (Tier 4: Roller Coaster Clothoid Loop)
In modern roller coaster engineering, loops are designed as teardrop clothoid loops rather than circles so that the radius of curvature $\rho$ varies continuously. At the apex of an inverted loop, the train has speed $v = 18.0\,\text{m/s}$. If the designers require an apparent downward acceleration of $1.50\,g$ toward the track (a total normal acceleration of $2.50\,g = 24.5\,\text{m/s}^2$), what must be the radius of curvature $\rho$ at the loop apex?

### Exercise 10.9 (Tier 5: Radius of Curvature of an Ellipse)
A planetary orbiter follows a 2D elliptical orbit defined implicitly by:
$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$
with semi-major axis $a = 8000\,\text{km}$ and semi-minor axis $b = 6000\,\text{km}$.
Using implicit differentiation and the osculating radius formula, derive and calculate the radius of curvature $\rho$ at:
(a) The periapsis $(x, y) = (a, 0)$.
(b) The apex of the minor axis $(x, y) = (0, b)$.

### Exercise 10.10 (Tier 5: Full Vector Polar Kinematics of Spiral Motion)
A micro-probe moves along an Archimedean spiral defined in polar coordinates by:
$$r(t) = c\,t, \quad \theta(t) = \omega_0\,t \quad (c > 0, \omega_0 > 0)$$
(a) Compute the full velocity vector $\vec{v}(t)$ in polar unit vectors $(\hat{u}_r, \hat{u}_\theta)$.
(b) Compute the full acceleration vector $\vec{a}(t)$ in polar unit vectors.
(c) Show that the radial component of acceleration is purely negative, and explain the physical origin of the tangential acceleration term $2 c \omega_0$.

---

## 10.9 Comprehensive Solutions to Chapter Exercises

---

### Solution 10.1
**(a) Angular speed $\omega$:**
$$\omega = 4.00\,\frac{\text{rev}}{\text{min}} \times \frac{2\pi\,\text{rad}}{60\,\text{s}} = \frac{8\pi}{60} = \frac{2\pi}{15} \approx 0.41888\,\text{rad/s} \approx 0.419\,\text{rad/s}$$

**(b) Linear speed $v$:**
$$v = \omega r = 0.41888\,\text{rad/s} \times 5.00\,\text{m} = 2.0944\,\text{m/s} \approx 2.09\,\text{m/s}$$

**(c) Centripetal acceleration $a_c$:**
$$a_c = \omega^2 r = (0.41888)^2 \times 5.00 = 0.17546 \times 5.00 = 0.8773\,\text{m/s}^2 \approx 0.877\,\text{m/s}^2$$
Alternatively: $a_c = \frac{v^2}{r} = \frac{(2.0944)^2}{5.00} = \frac{4.3865}{5.00} = 0.8773\,\text{m/s}^2$.

---

### Solution 10.2
**(a) Angular acceleration $\alpha$:**
$$\omega = 180\,\frac{\text{rev}}{\text{min}} \times \frac{2\pi}{60} = 6\pi\,\text{rad/s} \approx 18.8496\,\text{rad/s}$$
$$\omega = \omega_0 + \alpha t \implies 18.8496 = 0 + \alpha(6.00)$$
$$\alpha = \frac{18.8496}{6.00} = \pi\,\text{rad/s}^2 \approx 3.1416\,\text{rad/s}^2$$

**(b) Revolutions during startup:**
$$N = \left(\frac{\omega_0 + \omega}{2}\right) t \times \frac{1}{2\pi} = \left(\frac{0 + 6\pi}{2}\right)(6.00) \times \frac{1}{2\pi} = (3\pi \times 6.00) \times \frac{1}{2\pi} = \frac{18\pi}{2\pi} = 9.00\,\text{revolutions}$$

---

### Solution 10.3
$$a_c(t) = \omega^2 R = (\alpha t)^2 R = \alpha^2 t^2 R$$
$$a_t = \alpha R$$
We require $a_c = 10 a_t$:
$$\alpha^2 t^2 R = 10 (\alpha R) \implies \alpha t^2 = 10$$
$$t^2 = \frac{10}{\alpha} = \frac{10}{8.00} = 1.25 \implies t = \sqrt{1.25} = 1.1180\,\text{s} \approx 1.12\,\text{s}$$

---

### Solution 10.4
$$a_c = \frac{v^2}{R} \le a_{\text{max}} \implies v \le \sqrt{a_{\text{max}} R}$$
$$v = \sqrt{2.20\,\text{m/s}^2 \times 120.0\,\text{m}} = \sqrt{264.0} = 16.248\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v = 16.248 \times 3.6 = 58.49\,\text{km/h} \approx 58.5\,\text{km/h}$$

---

### Solution 10.5
**(a) Expressions for $a_t$ and $a_c$:**
$$a_t(t) = \frac{dv}{dt} = \frac{d}{dt}(3.00 t^2) = 6.00 t\,\text{m/s}^2$$
$$a_c(t) = \frac{v^2(t)}{R} = \frac{(3.00 t^2)^2}{2.00} = \frac{9.00 t^4}{2.00} = 4.50 t^4\,\text{m/s}^2$$

**(b) Time when angle is $45.0^\circ$:**
The velocity vector is strictly tangential. An angle of $45.0^\circ$ between $\vec{a}_{\text{total}}$ and $\vec{v}$ means:
$$\tan(45.0^\circ) = \frac{a_c}{a_t} = 1 \implies a_c = a_t$$
$$4.50 t^4 = 6.00 t$$
Dividing by $t \ne 0$:
$$4.50 t^3 = 6.00 \implies t^3 = \frac{6.00}{4.50} = \frac{4}{3} \approx 1.3333$$
$$t = (1.3333)^{1/3} = 1.1006\,\text{s} \approx 1.10\,\text{s}$$

---

### Solution 10.6
**(a) Normal acceleration at impact:**
At touchdown, the projectile's velocity makes an angle $\phi = -45.0^\circ$ with the horizontal.
Gravity $\vec{g}$ acts straight down.
The angle between $\vec{v}$ and $\vec{g}$ is $45.0^\circ$.
The component of gravity perpendicular to the velocity vector is:
$$a_n = g \cos(45.0^\circ) = 9.80 \times \frac{\sqrt{2}}{2} = 6.9296\,\text{m/s}^2 \approx 6.93\,\text{m/s}^2$$

**(b) Radius of curvature at impact:**
The impact speed on level ground equals the launch speed: $v = v_0 = 40.0\,\text{m/s}$.
$$\rho = \frac{v^2}{a_n} = \frac{(40.0\,\text{m/s})^2}{6.9296\,\text{m/s}^2} = \frac{1600.0}{6.9296} = 230.90\,\text{m} \approx 230.9\,\text{m}$$

---

### Solution 10.7
**(a) Angular acceleration of Gear B:**
Because the teeth mesh without slipping, the tangential acceleration at the contact interface must be identical:
$$a_t = \alpha_A r_A = \alpha_B r_B$$
$$\alpha_B = \alpha_A \left(\frac{r_A}{r_B}\right) = 6.00\,\text{rad/s}^2 \times \left(\frac{8.00\,\text{cm}}{24.0\,\text{cm}}\right) = 6.00 \times \frac{1}{3} = 2.00\,\text{rad/s}^2$$

**(b) Total acceleration of tooth on rim of Gear B when $\omega_A = 30.0\,\text{rad/s}$:**
No-slip speed condition:
$$v = \omega_A r_A = \omega_B r_B \implies \omega_B = \omega_A \left(\frac{r_A}{r_B}\right) = 30.0 \times \frac{1}{3} = 10.0\,\text{rad/s}$$
For a tooth on the rim of Gear B ($r_B = 0.240\,\text{m}$):
$$a_t = \alpha_B r_B = 2.00 \times 0.240 = 0.480\,\text{m/s}^2$$
$$a_c = \omega_B^2 r_B = (10.0)^2 \times 0.240 = 100.0 \times 0.240 = 24.00\,\text{m/s}^2$$
Total acceleration:
$$a_{\text{total}} = \sqrt{a_c^2 + a_t^2} = \sqrt{(24.00)^2 + (0.480)^2} = \sqrt{576.0 + 0.2304} = \sqrt{576.2304} = 24.005\,\text{m/s}^2 \approx 24.0\,\text{m/s}^2$$

---

### Solution 10.8
At the apex of the loop, the total normal acceleration is:
$$a_n = 24.5\,\text{m/s}^2$$
Since $a_n = \frac{v^2}{\rho}$:
$$\rho = \frac{v^2}{a_n} = \frac{(18.0\,\text{m/s})^2}{24.5\,\text{m/s}^2} = \frac{324.0}{24.5} = 13.224\,\text{m} \approx 13.2\,\text{m}$$

---

### Solution 10.9
The ellipse equation is $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$.
Differentiating implicitly with respect to $x$:
$$\frac{2x}{a^2} + \frac{2y y'}{b^2} = 0 \implies y' = -\frac{b^2 x}{a^2 y}$$
Differentiating again:
$$y'' = -\frac{b^2}{a^2} \left[ \frac{y(1) - x y'}{y^2} \right] = -\frac{b^2}{a^2} \left[ \frac{y - x(-b^2 x / a^2 y)}{y^2} \right] = -\frac{b^2}{a^2 y^3} \left[ y^2 + \frac{b^2 x^2}{a^2} \right]$$
Since $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \implies b^2 x^2 + a^2 y^2 = a^2 b^2$:
$$y'' = -\frac{b^4}{a^2 y^3}$$

**(a) At the periapsis $(x, y) = (a, 0)$:**
Here the curve is vertical ($y' \to \infty$). We orient axes so that $x = f(y)$:
$$x(y) = a \sqrt{1 - \frac{y^2}{b^2}} \implies \frac{dx}{dy} = 0, \quad \frac{d^2x}{dy^2} = -\frac{a}{b^2}$$
$$\rho_{\text{periapsis}} = \frac{1}{|d^2x/dy^2|} = \frac{b^2}{a} = \frac{(6000.0\,\text{km})^2}{8000.0\,\text{km}} = \frac{36000000}{8000} = 4500.0\,\text{km}$$

**(b) At the minor axis apex $(x, y) = (0, b)$:**
Here $x = 0, y = b$:
$$y' = 0$$
$$y'' = -\frac{b^4}{a^2 b^3} = -\frac{b}{a^2}$$
$$\rho_{\text{apex}} = \frac{1}{|y''|} = \frac{a^2}{b} = \frac{(8000.0\,\text{km})^2}{6000.0\,\text{km}} = \frac{64000000}{6000} = 10666.7\,\text{km}$$

---

### Solution 10.10
Given: $r(t) = c t \implies \dot{r} = c, \ddot{r} = 0$.
$\theta(t) = \omega_0 t \implies \dot{\theta} = \omega_0, \ddot{\theta} = 0$.

**(a) Full velocity vector:**
$$\vec{v} = \dot{r}\,\hat{u}_r + r\dot{\theta}\,\hat{u}_\theta = c\,\hat{u}_r + (c t \omega_0)\,\hat{u}_\theta$$

**(b) Full acceleration vector:**
In polar coordinates:
$$a_r = \ddot{r} - r\dot{\theta}^2 = 0 - (c t)(\omega_0^2) = -c \omega_0^2 t$$
$$a_\theta = r\ddot{\theta} + 2\dot{r}\dot{\theta} = (c t)(0) + 2(c)(\omega_0) = 2 c \omega_0$$
Thus:
$$\vec{a}(t) = -(c \omega_0^2 t)\,\hat{u}_r + (2 c \omega_0)\,\hat{u}_\theta$$

**(c) Physical explanation:**
- $a_r = -\omega_0^2 r(t)$: This is the standard inward centripetal acceleration required to keep the probe turning in a circle of instantaneous radius $r(t)$.
- $a_\theta = 2 c \omega_0$: This is the **Coriolis acceleration term ($2\dot{r}\dot{\theta}$)**. It arises because as the probe moves radially outward at constant speed $c$, it moves into regions of larger radius where a higher tangential linear speed ($v_t = \omega_0 r$) is required to maintain the same angular rate $\omega_0$. The rate of change of required tangential speed produces a persistent tangential acceleration of $2 c \omega_0$.
