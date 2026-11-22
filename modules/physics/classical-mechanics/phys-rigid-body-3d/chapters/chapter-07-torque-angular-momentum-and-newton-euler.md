# Chapter 7: Torque, Angular Momentum, and Newton-Euler Dynamics

> *"Force is an arrow that impels the center of mass along a straight path; torque is a twist born of leverage that spins the body in orientation. When combined, Newton and Euler complete the architecture of three-dimensional mechanics."*

---

## 7.1 The Fundamental Law of Rotational Dynamics

In linear translational mechanics, Newton's Second Law describes how an external resultant force $\mathbf{F}_{\text{net}}$ alters the linear momentum $\mathbf{P} = M \mathbf{v}_{\text{cm}}$ of a body:

$$\mathbf{F}_{\text{net}} = \frac{d\mathbf{P}}{dt} = M \mathbf{a}_{\text{cm}}$$

In three-dimensional rotational mechanics, the rotational counterpart to force is **Torque** (also known as the **Moment of Force**), denoted $\boldsymbol{\tau}$ or $\mathbf{N}$. 

The fundamental postulate of rotational dynamics—first formulated by Leonhard Euler in 1750—states that the net external torque acting on a rigid body about an inertial origin equals the time rate of change of its total angular momentum $\mathbf{L}$:

$$\boldsymbol{\tau}_{\text{net}} = \frac{d\mathbf{L}}{dt}$$

```
    Linear Translation: Force & Momentum        Rotational Dynamics: Torque & Angular Momentum
             F_net ────────►                                  τ_net (Torque)
                   dP/dt                                      ▲
                                                              │  dL/dt
                                                              │
                                                              └─────────────
```

### The Invariance of the Center of Mass:
As proved in Exercise 1.6, this rotational equation holds strictly when torques and angular momenta are evaluated about:
1. A **fixed point** in an inertial reference frame.
2. The body's **Center of Mass**, even if the Center of Mass is accelerating!

For this reason, physics engines universally evaluate rotational dynamics about the **Center of Mass**, allowing the translational and rotational differential equations to decouple cleanly:

$$\begin{aligned}
\mathbf{F}_{\text{net}} &= M \dot{\mathbf{v}}_{\text{cm}} \\
\boldsymbol{\tau}_{\text{cm}} &= \dot{\mathbf{L}}_{\text{cm}}
\end{aligned}$$

---

## 7.2 Torque from Off-Center Forces: The Cross Product Definition

Consider an external force $\mathbf{F}$ applied to a rigid body at a specific contact point $\mathbf{p} \in \mathbb{R}^3$.
Let $\mathbf{r}$ be the displacement vector from the Center of Mass $\mathbf{R}_{\text{cm}}$ to the point of application $\mathbf{p}$:

$$\mathbf{r} = \mathbf{p} - \mathbf{R}_{\text{cm}}$$

The **Torque** $\boldsymbol{\tau}$ exerted by the force about the Center of Mass is defined as the vector cross product:

$$\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$$

```
                             F (Applied Force)
                            ▲
                           /
                          / θ
              r          /
      COM ●─────────────● p (Contact Point)
          │             │
          │             │  Line of Action of F
          ▼             ▼
          d = r·sin(θ)  (Perpendicular Moment Arm)
```

### Algebraic Cartesian Expansion:
In Cartesian coordinates, where $\mathbf{r} = (r_x, r_y, r_z)$ and $\mathbf{F} = (F_x, F_y, F_z)$:

$$\boldsymbol{\tau} = \begin{bmatrix} \tau_x \\ \tau_y \\ \tau_z \end{bmatrix} = \begin{bmatrix} r_x \\ r_y \\ r_z \end{bmatrix} \times \begin{bmatrix} F_x \\ F_y \\ F_z \end{bmatrix} = \begin{bmatrix} r_y F_z - r_z F_y \\ r_z F_x - r_x F_z \\ r_x F_y - r_y F_x \end{bmatrix}$$

### Magnitude and the Moment Arm:
The magnitude of the torque vector is:

$$\|\boldsymbol{\tau}\| = \|\mathbf{r}\| \|\mathbf{F}\| \sin\theta = F (r\sin\theta) = F \cdot d$$

where $\theta \in [0, \pi]$ is the angle between the displacement vector $\mathbf{r}$ and the force vector $\mathbf{F}$, and:

$$d = r\sin\theta$$

is the **perpendicular lever arm** (the shortest Euclidean distance from the Center of Mass to the infinite **Line of Action** of the force).

#### Physical Properties of the Cross Product:
1. **Parallel Forces Produce Zero Torque:** If the force points directly toward or away from the Center of Mass ($\mathbf{F} \parallel \mathbf{r}$, so $\theta = 0$ or $\pi$), then $\sin\theta = 0$, and $\boldsymbol{\tau} = \mathbf{0}$. The force accelerates the body translationally without inducing any rotation.
2. **Maximum Leverage at $90^\circ$:** Torque is maximized when the force is applied perpendicularly to the lever arm ($\theta = 90^\circ \implies \sin\theta = 1$).
3. **The Principle of Transmissibility:** Sliding the force vector along its line of action does not change the torque, because the perpendicular distance $d$ remains constant.

---

## 7.3 Pure Couples: Torque Without Linear Acceleration

In mechanical machinery and spacecraft attitude control, we frequently desire to rotate an object without altering its linear path. For example, when turning a steering wheel with two hands, or firing opposing cold-gas thrusters on a satellite, we apply a **Couple of Forces**.

A **Couple** consists of two forces of equal magnitude, opposite direction, and parallel, non-collinear lines of action: $\mathbf{F}_1 = +\mathbf{F}$ applied at $\mathbf{r}_1$, and $\mathbf{F}_2 = -\mathbf{F}$ applied at $\mathbf{r}_2$.

```
               +F ▲                  d = r₁ - r₂
                  │                 ┌───────────┐
                  ● r₁              ▼           │
                                                │
                                    ● r₂        │
                                    │           ▼
                                 -F ▼
```

### Properties of a Couple:
1. **Zero Net Linear Force:**
   $$\mathbf{F}_{\text{net}} = \mathbf{F}_1 + \mathbf{F}_2 = \mathbf{F} + (-\mathbf{F}) = \mathbf{0}$$
   By Newton's Second Law, the Center of Mass experiences **zero linear acceleration**: $\mathbf{a}_{\text{cm}} = \mathbf{0}$.
2. **Origin-Independent Net Torque:**
   Let us compute the net torque about an arbitrary reference point $\mathbf{O}$:
   $$\boldsymbol{\tau}_{\text{net}} = \mathbf{r}_1 \times \mathbf{F}_1 + \mathbf{r}_2 \times \mathbf{F}_2 = \mathbf{r}_1 \times \mathbf{F} + \mathbf{r}_2 \times (-\mathbf{F}) = (\mathbf{r}_1 - \mathbf{r}_2) \times \mathbf{F}$$
   Let $\mathbf{d} = \mathbf{r}_1 - \mathbf{r}_2$ be the displacement vector from point 2 to point 1. Then:
   $$\boldsymbol{\tau}_{\text{couple}} = \mathbf{d} \times \mathbf{F}$$
   Notice that the reference origin $\mathbf{O}$ has disappeared completely! The torque produced by a couple is a **free vector**: it has the exact same value regardless of where you measure it in the universe!

---

## 7.4 Rotational Work, Energy, and Power

Just as a linear force does mechanical work when moving through a spatial displacement $d\mathbf{x}$, a torque does work when rotating a rigid body through an infinitesimal angular displacement $d\boldsymbol{\theta}$.

### 1. Infinitesimal Rotational Work
Consider a force $\mathbf{F}$ acting at position $\mathbf{r}$. Under an infinitesimal rotation $d\boldsymbol{\theta}$, the point of application moves by:

$$d\mathbf{r} = d\boldsymbol{\theta} \times \mathbf{r}$$

The work done by the force is:

$$dW = \mathbf{F} \cdot d\mathbf{r} = \mathbf{F} \cdot (d\boldsymbol{\theta} \times \mathbf{r})$$

Using the scalar triple product cyclic identity $\mathbf{A} \cdot (\mathbf{B} \times \mathbf{C}) = \mathbf{B} \cdot (\mathbf{C} \times \mathbf{A})$:

$$dW = d\boldsymbol{\theta} \cdot (\mathbf{r} \times \mathbf{F}) = \boldsymbol{\tau} \cdot d\boldsymbol{\theta}$$

$$dW = \boldsymbol{\tau} \cdot d\boldsymbol{\theta} = \tau_x d\theta_x + \tau_y d\theta_y + \tau_z d\theta_z$$

### 2. Rotational Power
Dividing by the infinitesimal time interval $dt$:

$$P = \frac{dW}{dt} = \boldsymbol{\tau} \cdot \frac{d\boldsymbol{\theta}}{dt} = \boldsymbol{\tau} \cdot \boldsymbol{\omega}$$

The instantaneous power delivered by an external torque is the **dot product of torque and angular velocity**!
- If $\boldsymbol{\tau} \cdot \boldsymbol{\omega} > 0$: The torque adds rotational kinetic energy to the system (driving/propulsion).
- If $\boldsymbol{\tau} \cdot \boldsymbol{\omega} < 0$: The torque extracts rotational kinetic energy (braking/dissipation).
- If $\boldsymbol{\tau} \perp \boldsymbol{\omega}$: The power is zero ($P = 0$). The torque changes the direction of angular momentum without changing rotational kinetic energy (pure precession!).

### 3. The Rotational Work-Energy Theorem
Let us integrate the power over a finite time interval $[t_1, t_2]$:

$$W = \int_{t_1}^{t_2} P \, dt = \int_{t_1}^{t_2} (\boldsymbol{\tau} \cdot \boldsymbol{\omega}) dt$$

Substitute $\boldsymbol{\tau} = \dot{\mathbf{L}}$:

$$W = \int_{t_1}^{t_2} (\dot{\mathbf{L}} \cdot \boldsymbol{\omega}) dt$$

Using $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$:

$$\dot{\mathbf{L}} \cdot \boldsymbol{\omega} = \frac{d}{dt}\left(\frac{1}{2}\boldsymbol{\omega} \cdot \mathbf{I}\boldsymbol{\omega}\right) = \frac{d}{dt} T_{\text{rot}}$$

Therefore:

$$W_{\text{net}} = \Delta T_{\text{rot}} = T_{\text{rot}}(t_2) - T_{\text{rot}}(t_1)$$

The net rotational work done on a rigid body strictly equals the change in its rotational kinetic energy.

---

## 7.5 10 Step-by-Step Worked Examples

### Worked Example 7.1: Hand Calculation of a 3D Torque Vector
**Problem:** A robotic end-effector exerts a force $\mathbf{F} = (10, -20, 50)\text{ N}$ at gripper contact point $\mathbf{p} = (0.5, 0.2, -0.1)\text{ m}$ relative to the robot's Center of Mass. Compute the torque vector $\boldsymbol{\tau}$ and its magnitude.
**Solution:**
1. Given $\mathbf{r} = (0.5, 0.2, -0.1)$ and $\mathbf{F} = (10, -20, 50)$.
2. Evaluate cross product $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$:
   $$\tau_x = r_y F_z - r_z F_y = (0.2)(50) - (-0.1)(-20) = 10.0 - 2.0 = 8.0\text{ N}\cdot\text{m}$$
   $$\tau_y = r_z F_x - r_x F_z = (-0.1)(10) - (0.5)(50) = -1.0 - 25.0 = -26.0\text{ N}\cdot\text{m}$$
   $$\tau_z = r_x F_y - r_y F_x = (0.5)(-20) - (0.2)(10) = -10.0 - 2.0 = -12.0\text{ N}\cdot\text{m}$$
3. Assembled torque vector:
   $$\boldsymbol{\tau} = (8.0, -26.0, -12.0)\text{ N}\cdot\text{m}$$
4. Magnitude:
   $$\|\boldsymbol{\tau}\| = \sqrt{8^2 + (-26)^2 + (-12)^2} = \sqrt{64 + 676 + 144} = \sqrt{884} \approx 29.732\text{ N}\cdot\text{m}$$

---

### Worked Example 7.2: Pure Couple on a Satellite
**Problem:** A satellite has two attitude thrusters mounted on opposite sides of its cube body:
- Thruster 1 is at $\mathbf{r}_1 = (1, 0, 0)\text{ m}$ firing force $\mathbf{F}_1 = (0, 10, 0)\text{ N}$.
- Thruster 2 is at $\mathbf{r}_2 = (-1, 0, 0)\text{ m}$ firing force $\mathbf{F}_2 = (0, -10, 0)\text{ N}$.
1. Compute the net linear force $\mathbf{F}_{\text{net}}$.
2. Compute the net torque $\boldsymbol{\tau}$ about the Center of Mass $(0, 0, 0)$.
3. Compute the net torque about an arbitrary sensor origin $\mathbf{O}' = (5, 10, -3)\text{ m}$ and verify origin-invariance.
**Solution:**
1. **Net Force:**
   $$\mathbf{F}_{\text{net}} = \mathbf{F}_1 + \mathbf{F}_2 = (0, 10, 0) + (0, -10, 0) = (0, 0, 0)\text{ N}$$
   The satellite does not accelerate linearly.
2. **Torque about COM:**
   $$\boldsymbol{\tau}_1 = \mathbf{r}_1 \times \mathbf{F}_1 = (1, 0, 0) \times (0, 10, 0) = (0, 0, 10)\text{ N}\cdot\text{m}$$
   $$\boldsymbol{\tau}_2 = \mathbf{r}_2 \times \mathbf{F}_2 = (-1, 0, 0) \times (0, -10, 0) = (0, 0, 10)\text{ N}\cdot\text{m}$$
   $$\boldsymbol{\tau}_{\text{net}} = \boldsymbol{\tau}_1 + \boldsymbol{\tau}_2 = (0, 0, 20)\text{ N}\cdot\text{m}$$
3. **Torque about arbitrary origin $\mathbf{O}' = (5, 10, -3)$:**
   Relative positions from $\mathbf{O}'$:
   $\mathbf{r}_1' = \mathbf{r}_1 - \mathbf{O}' = (1 - 5, \; 0 - 10, \; 0 - (-3)) = (-4, -10, 3)\text{ m}$.
   $\mathbf{r}_2' = \mathbf{r}_2 - \mathbf{O}' = (-1 - 5, \; 0 - 10, \; 0 - (-3)) = (-6, -10, 3)\text{ m}$.
   Compute torques:
   $$\boldsymbol{\tau}_1' = (-4, -10, 3) \times (0, 10, 0) = (-30, 0, -40)\text{ N}\cdot\text{m}$$
   $$\boldsymbol{\tau}_2' = (-6, -10, 3) \times (0, -10, 0) = (30, 0, 60)\text{ N}\cdot\text{m}$$
   Sum:
   $$\boldsymbol{\tau}_{\text{net}}' = (-30 + 30, \; 0 + 0, \; -40 + 60) = (0, 0, 20)\text{ N}\cdot\text{m}$$
4. Both origins yield identically $(0, 0, 20)\text{ N}\cdot\text{m}$, proving the couple is a free vector.

---

### Worked Example 7.3: Instantaneous Power of an Electric Motor
**Problem:** An electric motor applies a torque $\boldsymbol{\tau} = (0, 0, 45)\text{ N}\cdot\text{m}$ to a grinding wheel rotating at $\omega = 1800\text{ RPM}$ about the $z$-axis.
1. Calculate the mechanical power delivered by the motor.
2. If this power is delivered for $t = 10\text{ seconds}$, calculate the total rotational work done.
**Solution:**
1. Convert RPM to rad/s:
   $$\omega = \frac{1800 \times 2\pi}{60} = 60\pi \approx 188.496\text{ rad/s}$$
   $$\boldsymbol{\omega} = (0, 0, 188.496)\text{ rad/s}$$
2. Compute power:
   $$P = \boldsymbol{\tau} \cdot \boldsymbol{\omega} = (0)(0) + (0)(0) + (45)(188.496) \approx 8482.32\text{ W} \approx 8.482\text{ kW}$$
3. Compute work done over 10 seconds:
   $$W = P \times \Delta t = 8482.32\text{ W} \times 10\text{ s} = 84,823.2\text{ J} \approx 84.82\text{ kJ}$$

---

### Worked Example 7.4: Off-Center Impulsive Strike on a Free Body
**Problem:** A stationary box floating in space ($M = 10\text{ kg}$, $I_{\text{cm}} = 2.5\text{ kg}\cdot\text{m}^2$) is struck by an instantaneous linear impulse $\mathbf{J} = (0, 50, 0)\text{ N}\cdot\text{s}$ at contact point $\mathbf{r} = (0.5, 0, 0)\text{ m}$ from the Center of Mass.
1. Compute the linear velocity $\mathbf{V}_{\text{cm}}$ of the Center of Mass after the strike.
2. Compute the angular velocity $\boldsymbol{\omega}$ of the box after the strike.
**Solution:**
1. **Linear Velocity:**
   $$\mathbf{P} = \mathbf{J} \implies M \mathbf{V}_{\text{cm}} = \mathbf{J}$$
   $$\mathbf{V}_{\text{cm}} = \frac{\mathbf{J}}{M} = \frac{(0, 50, 0)}{10} = (0, 5, 0)\text{ m/s}$$
2. **Angular Impulse and Velocity:**
   $$\Delta \mathbf{L} = \mathbf{r} \times \mathbf{J} = (0.5, 0, 0) \times (0, 50, 0) = (0, 0, 25)\text{ N}\cdot\text{m}\cdot\text{s}$$
   Since initially at rest: $\mathbf{L} = \Delta \mathbf{L} = (0, 0, 25)\text{ N}\cdot\text{m}\cdot\text{s}$.
   $$\boldsymbol{\omega} = \frac{\mathbf{L}}{I_{\text{cm}}} = \frac{(0, 0, 25)}{2.5} = (0, 0, 10)\text{ rad/s}$$
3. Result: The box translates forward at $5\text{ m/s}$ while spinning about its $z$-axis at $10\text{ rad/s}$.

---

### Worked Example 7.5: Minimum Force Required for Specified Torque
**Problem:** A technician needs to loosen a stubborn valve requiring a torque of $\tau = 120\text{ N}\cdot\text{m}$. If the wrench has length $L = 0.40\text{ m}$:
1. What is the absolute minimum force required to loosen the valve?
2. What force would be required if the wrench is pulled at an angle of $\theta = 30^\circ$ relative to the wrench handle?
**Solution:**
1. **Minimum Force:**
   Torque formula: $\tau = r F \sin\theta$.
   To minimize $F$, maximize $\sin\theta = 1$ ($\theta = 90^\circ$):
   $$F_{\min} = \frac{\tau}{L} = \frac{120}{0.40} = 300\text{ N}$$
2. **At $\theta = 30^\circ$:**
   $$\sin 30^\circ = 0.5$$
   $$F = \frac{\tau}{L \sin 30^\circ} = \frac{120}{(0.40)(0.5)} = \frac{120}{0.20} = 600\text{ N}$$
3. Pulling at an angle of $30^\circ$ requires **twice as much force** ($600\text{ N}$ vs $300\text{ N}$).

---

### Worked Example 7.6: Dynamic Reaction from an Angular Acceleration
**Problem:** A satellite antenna dish has moment of inertia $I = 15\text{ kg}\cdot\text{m}^2$. A stepper motor accelerates the dish from rest to $\omega = 2\text{ rad/s}$ in $\Delta t = 0.5\text{ seconds}$.
1. Calculate the torque exerted by the motor on the dish.
2. What torque does the satellite body experience during this maneuver?
**Solution:**
1. **Angular acceleration of dish:**
   $$\alpha = \frac{\Delta\omega}{\Delta t} = \frac{2 - 0}{0.5} = 4.0\text{ rad/s}^2$$
2. **Torque on dish:**
   $$\tau_{\text{dish}} = I \alpha = 15 \times 4.0 = 60\text{ N}\cdot\text{m}$$
3. **Reaction on satellite:**
   By Newton's Third Law for rotation, the reaction torque on the satellite body is equal and opposite:
   $$\tau_{\text{sat}} = -\tau_{\text{dish}} = -60\text{ N}\cdot\text{m}$$
4. If the satellite does not fire reaction wheels or thrusters to counter this, the entire satellite will rotate in the opposite direction.

---

### Worked Example 7.7: Net Torque on a Quadrotor in Roll Maneuver
**Problem:** A quadrotor drone has arm length $L = 0.25\text{ m}$. To execute a roll to the right, the flight controller increases left motor thrust to $T_1 = 8\text{ N}$ and decreases right motor thrust to $T_2 = 4\text{ N}$.
1. Calculate the net roll torque $\tau_x$ about the drone Center of Mass.
2. If the roll moment of inertia is $I_{xx} = 0.020\text{ kg}\cdot\text{m}^2$, calculate the instantaneous angular acceleration $\alpha_x$.
**Solution:**
1. The left motor is at $y_1 = -L = -0.25\text{ m}$ producing thrust along $+z$:
   $$\boldsymbol{\tau}_1 = (0, -0.25, 0) \times (0, 0, 8) = (-0.25 \times 8, 0, 0) = (-2.0, 0, 0)\text{ N}\cdot\text{m}$$
   Wait: $(-0.25)\hat{\mathbf{j}} \times 8\hat{\mathbf{k}} = -2.0 \hat{\mathbf{i}}$.
   The right motor is at $y_2 = +L = +0.25\text{ m}$ producing thrust along $+z$:
   $$\boldsymbol{\tau}_2 = (0, +0.25, 0) \times (0, 0, 4) = (+0.25 \times 4, 0, 0) = (+1.0, 0, 0)\text{ N}\cdot\text{m}$$
2. Net torque:
   $$\tau_x = -2.0 + 1.0 = -1.0\text{ N}\cdot\text{m}$$
3. Angular acceleration:
   $$\alpha_x = \frac{\tau_x}{I_{xx}} = \frac{-1.0}{0.020} = -50.0\text{ rad/s}^2$$
4. The drone undergoes rapid roll acceleration of $50\text{ rad/s}^2$ ($\approx 2865^\circ/\text{s}^2$).

---

### Worked Example 7.8: Line of Action Perpendicular Distance Check
**Problem:** A force $\mathbf{F} = (0, 10, 0)\text{ N}$ acts along the line $x = 3, z = 4$. Compute the torque about the origin $(0, 0, 0)$ using two different points on the line: $\mathbf{p}_1 = (3, 0, 4)$ and $\mathbf{p}_2 = (3, 7, 4)$.
**Solution:**
1. Using $\mathbf{p}_1 = (3, 0, 4)$:
   $$\boldsymbol{\tau}_1 = \mathbf{p}_1 \times \mathbf{F} = \begin{bmatrix} 3 \\ 0 \\ 4 \end{bmatrix} \times \begin{bmatrix} 0 \\ 10 \\ 0 \end{bmatrix} = \begin{bmatrix} 0(0) - 4(10) \\ 4(0) - 3(0) \\ 3(10) - 0(0) \end{bmatrix} = \begin{bmatrix} -40 \\ 0 \\ 30 \end{bmatrix}\text{ N}\cdot\text{m}$$
2. Using $\mathbf{p}_2 = (3, 7, 4)$:
   $$\boldsymbol{\tau}_2 = \mathbf{p}_2 \times \mathbf{F} = \begin{bmatrix} 3 \\ 7 \\ 4 \end{bmatrix} \times \begin{bmatrix} 0 \\ 10 \\ 0 \end{bmatrix} = \begin{bmatrix} 7(0) - 4(10) \\ 4(0) - 3(0) \\ 3(10) - 7(0) \end{bmatrix} = \begin{bmatrix} -40 \\ 0 \\ 30 \end{bmatrix}\text{ N}\cdot\text{m}$$
3. Both points yield $(-40, 0, 30)\text{ N}\cdot\text{m}$, demonstrating the Principle of Transmissibility.

---

### Worked Example 7.9: Angular Deceleration via Frictional Brake
**Problem:** A flywheel of mass $M = 40\text{ kg}$ and radius $R = 0.5\text{ m}$ ($I = \frac{1}{2}MR^2 = 5\text{ kg}\cdot\text{m}^2$) spinning at $\omega_0 = 100\text{ rad/s}$ is brought to rest by a brake shoe pressing against its rim with normal force $N = 200\text{ N}$. The friction coefficient is $\mu = 0.4$.
1. Calculate the braking torque $\tau_{\text{brake}}$.
2. Calculate the time $\Delta t$ required to bring the wheel to a complete stop.
3. Calculate the thermal energy dissipated in the brake.
**Solution:**
1. **Frictional force:**
   $$f_k = \mu N = 0.4 \times 200 = 80\text{ N}$$
   Braking torque:
   $$\tau_{\text{brake}} = -f_k R = -(80\text{ N})(0.5\text{ m}) = -40\text{ N}\cdot\text{m}$$
2. **Stopping time:**
   $$\alpha = \frac{\tau_{\text{brake}}}{I} = \frac{-40}{5} = -8.0\text{ rad/s}^2$$
   $$\Delta t = \frac{0 - \omega_0}{\alpha} = \frac{-100}{-8.0} = 12.5\text{ seconds}$$
3. **Energy dissipated:**
   Initial kinetic energy:
   $$T = \frac{1}{2}I \omega_0^2 = \frac{1}{2}(5)(100^2) = \frac{1}{2}(5)(10000) = 25,000\text{ J} = 25\text{ kJ}$$
   Final kinetic energy is 0. Total heat generated = **$25\text{ kJ}$**.

---

### Worked Example 7.10: Zero-Power Torque Vector
**Problem:** A spinning wheel has angular velocity $\boldsymbol{\omega} = (0, 0, 20)\text{ rad/s}$. An external torque $\boldsymbol{\tau} = (15, 0, 0)\text{ N}\cdot\text{m}$ is applied.
1. Compute the instantaneous power delivered by this torque.
2. Explain what physical effect this torque has on the motion.
**Solution:**
1. Compute power:
   $$P = \boldsymbol{\tau} \cdot \boldsymbol{\omega} = (15)(0) + (0)(0) + (0)(20) = 0\text{ W}$$
2. The instantaneous power is **identically zero**.
3. Physical effect: Because $P = \frac{dT}{dt} = 0$, the torque does not speed up or slow down the spin rate of the wheel. Instead, because $\boldsymbol{\tau} = \dot{\mathbf{L}}$, it changes the spatial direction of $\mathbf{L}$, tipping the spin axis toward the $x$-axis. This is the foundational mechanism of **gyroscopic precession**!

---

## 7.6 10 Granular Solved Exercises

### Exercise 7.1
**Problem:** Prove that if a force passes directly through the Center of Mass, its torque about the Center of Mass is zero.
**Solution:**
1. Let the line of action pass through the Center of Mass $\mathbf{R}_{\text{cm}}$.
2. Then the contact point $\mathbf{p}$ can be chosen at the Center of Mass itself ($\mathbf{r} = \mathbf{p} - \mathbf{R}_{\text{cm}} = \mathbf{0}$).
3. Torque is $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F} = \mathbf{0} \times \mathbf{F} = \mathbf{0}$.

---

### Exercise 7.2
**Problem:** In 2D planar physics, why can torque be treated as a single scalar $\tau$ rather than a 3-element vector?
**Solution:**
1. In 2D, all positions $\mathbf{r} = (x, y, 0)$ and all forces $\mathbf{F} = (F_x, F_y, 0)$ lie strictly within the $xy$-plane.
2. The cross product $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$ is:
   $$\boldsymbol{\tau} = \begin{bmatrix} x \\ y \\ 0 \end{bmatrix} \times \begin{bmatrix} F_x \\ F_y \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ x F_y - y F_x \end{bmatrix}$$
3. The torque vector points exclusively along the perpendicular $z$-axis.
4. Therefore, only its signed scalar magnitude $\tau_z = x F_y - y F_x$ is non-zero, allowing 2D engines to treat torque as a scalar.

---

### Exercise 7.3
**Problem:** A force $\mathbf{F} = (5, 0, 0)\text{ N}$ is applied at $\mathbf{r}_1 = (0, 2, 0)\text{ m}$. What force $\mathbf{F}_2$ applied at $\mathbf{r}_2 = (0, 0, 4)\text{ m}$ will completely cancel this torque ($\boldsymbol{\tau}_{\text{net}} = \mathbf{0}$)?
**Solution:**
1. Compute $\boldsymbol{\tau}_1 = \mathbf{r}_1 \times \mathbf{F}_1$:
   $$\boldsymbol{\tau}_1 = (0, 2, 0) \times (5, 0, 0) = (0, 0, -10)\text{ N}\cdot\text{m}$$
2. We require $\boldsymbol{\tau}_2 = -\boldsymbol{\tau}_1 = (0, 0, +10)\text{ N}\cdot\text{m}$.
3. $\boldsymbol{\tau}_2 = \mathbf{r}_2 \times \mathbf{F}_2 = (0, 0, 4) \times (F_{2x}, F_{2y}, F_{2z}) = (-4 F_{2y}, 4 F_{2x}, 0)$.
4. Equating components:
   $-4 F_{2y} = 0 \implies F_{2y} = 0$.
   $4 F_{2x} = 0$ ... Wait! Notice that $(0, 0, 4) \times \mathbf{F}_2$ has **zero $z$-component**!
   A force applied along the $z$-axis cannot generate a torque pointing along the $z$-axis!
5. Conclusion: No force applied at $(0, 0, 4)$ can cancel a torque pointing along the $z$-axis, because $\mathbf{r} \times \mathbf{F}$ is always perpendicular to $\mathbf{r}$.

---

### Exercise 7.4
**Problem:** Show that the total work done by internal forces in an ideal rigid body during any displacement is zero.
**Solution:**
1. For every pair of particles $i$ and $j$, the internal work is $dW_{ij} = \mathbf{F}_{ij} \cdot d\mathbf{r}_i + \mathbf{F}_{ji} \cdot d\mathbf{r}_j$.
2. By Newton's Third Law, $\mathbf{F}_{ji} = -\mathbf{F}_{ij}$:
   $$dW_{ij} = \mathbf{F}_{ij} \cdot (d\mathbf{r}_i - d\mathbf{r}_j)$$
3. As derived in Section 1.1, the rigidity constraint enforces that $(d\mathbf{r}_i - d\mathbf{r}_j)$ is strictly perpendicular to the displacement vector $(\mathbf{r}_i - \mathbf{r}_j)$.
4. If internal forces act along the line connecting particles ($\mathbf{F}_{ij} \parallel (\mathbf{r}_i - \mathbf{r}_j)$), then $\mathbf{F}_{ij} \cdot (d\mathbf{r}_i - d\mathbf{r}_j) = 0$.
5. Thus, internal forces do zero work in a rigid body.

---

### Exercise 7.5
**Problem:** In a physics engine, if multiple contact forces $\mathbf{F}_1, \dots, \mathbf{F}_k$ act at points $\mathbf{p}_1, \dots, \mathbf{p}_k$, write down the code accumulator for $\boldsymbol{\tau}_{\text{net}}$.
**Solution:**
```typescript
let tauNet = new Vector3(0, 0, 0);
for (const contact of contactManifold) {
  const r = contact.point.subtract(body.position);
  const tau = r.cross(contact.force);
  tauNet.add(tau);
}
```

---

### Exercise 7.6
**Problem:** Prove that torque is independent of the reference origin if and only if the net external force is zero ($\mathbf{F}_{\text{net}} = \mathbf{0}$).
**Solution:**
1. Let $\boldsymbol{\tau}_A = \sum (\mathbf{r}_i - \mathbf{A}) \times \mathbf{F}_i$ and $\boldsymbol{\tau}_B = \sum (\mathbf{r}_i - \mathbf{B}) \times \mathbf{F}_i$.
2. Subtract:
   $$\boldsymbol{\tau}_B - \boldsymbol{\tau}_A = \sum [(\mathbf{A} - \mathbf{B}) \times \mathbf{F}_i] = (\mathbf{A} - \mathbf{B}) \times \left(\sum \mathbf{F}_i\right) = (\mathbf{A} - \mathbf{B}) \times \mathbf{F}_{\text{net}}$$
3. $\boldsymbol{\tau}_B = \boldsymbol{\tau}_A$ for all arbitrary points $\mathbf{A}, \mathbf{B}$ if and only if $(\mathbf{A} - \mathbf{B}) \times \mathbf{F}_{\text{net}} = \mathbf{0}$.
4. This requires $\mathbf{F}_{\text{net}} = \mathbf{0}$.

---

### Exercise 7.7
**Problem:** A constant torque $\boldsymbol{\tau} = (0, 10, 0)\text{ N}\cdot\text{m}$ acts on a body initially at rest for $\Delta t = 4\text{ seconds}$. What is the final angular momentum $\mathbf{L}$?
**Solution:**
1. Impulse equation: $\Delta \mathbf{L} = \int \boldsymbol{\tau} dt = \boldsymbol{\tau} \Delta t$.
2. $\mathbf{L}_{\text{final}} = \mathbf{L}_0 + \boldsymbol{\tau} \Delta t = \mathbf{0} + (0, 10, 0)(4) = (0, 40, 0)\text{ N}\cdot\text{m}\cdot\text{s}$.

---

### Exercise 7.8
**Problem:** Why is it impossible for a single isolated force to produce a pure torque?
**Solution:**
1. A single force $\mathbf{F}$ produces net force $\mathbf{F}_{\text{net}} = \mathbf{F} \ne \mathbf{0}$.
2. By Newton's Second Law, $\mathbf{a}_{\text{cm}} = \mathbf{F}/M \ne \mathbf{0}$.
3. Therefore, a single force always accelerates the Center of Mass translationally; it cannot produce a pure rotation without linear acceleration. A pure torque requires a minimum of two forces summing to zero (a couple).

---

### Exercise 7.9
**Problem:** If $\mathbf{r} = (1, 1, 1)\text{ m}$ and $\mathbf{F} = (2, 2, 2)\text{ N}$, compute $\boldsymbol{\tau}$.
**Solution:**
1. Notice that $\mathbf{F} = 2 \mathbf{r}$.
2. The cross product of any vector with a scalar multiple of itself is zero:
   $$\boldsymbol{\tau} = \mathbf{r} \times (2\mathbf{r}) = 2(\mathbf{r} \times \mathbf{r}) = \mathbf{0}$$.

---

### Exercise 7.10
**Problem:** A motor provides $100\text{ kW}$ of power at $3000\text{ RPM}$. Calculate the output torque in $\text{N}\cdot\text{m}$.
**Solution:**
1. Power formula: $P = \tau \omega \implies \tau = \frac{P}{\omega}$.
2. $\omega = \frac{3000 \times 2\pi}{60} = 100\pi \approx 314.159\text{ rad/s}$.
3. $\tau = \frac{100,000\text{ W}}{314.159\text{ rad/s}} \approx 318.31\text{ N}\cdot\text{m}$.
