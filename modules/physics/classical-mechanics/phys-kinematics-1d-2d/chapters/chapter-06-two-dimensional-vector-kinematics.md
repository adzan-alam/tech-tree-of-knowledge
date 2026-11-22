# Chapter 6: Kinematics in Two Dimensions — Vector Independence and the Planar Realm

> *"A bead sliding along a straight wire experiences only one degree of freedom; it can advance or retreat. But release that bead onto a vast, friction-free table, and space expands into infinite directions. To track motion in two dimensions is to realize that the horizontal and vertical worlds coexist without interference — two parallel stories running simultaneously on orthogonal axes."*

---

## 6.1 The Principle of Orthogonal Independence

In Chapters 1 through 5, our universe was strictly one-dimensional. Objects moved forward or backward along a single line.

In the real physical world, projectiles curve through the sky, planets orbit stars in planes, and drones navigate across horizontal and vertical air corridors. We must elevate our mathematical framework into **two-dimensional vector kinematics**.

The governing physical foundation was discovered by Galileo Galilei:

> **Galileo's Principle of Superposition (Independence of Motion):**
> Motion along perpendicular (orthogonal) axes unfolds with complete, total independence.
> A physical force, acceleration, or velocity acting strictly along the horizontal $x$-axis has **zero influence** on the velocity, acceleration, or position along the vertical $y$-axis.

### The Famous Bullet Experiment
Imagine two identical rifles mounted on a perfectly level firing bench $1.5\text{ meters}$ above a flat, horizontal desert floor:
- **Rifle 1** fires a high-powered bullet horizontally at $v_{0x} = 800\text{ m/s}$.
- At the exact microsecond the bullet exits Rifle 1's muzzle, **Rifle 2** simply drops an identical bullet from rest ($v_{0x} = 0, v_{0y} = 0$) from the same height.

Which bullet strikes the desert dirt first?
- The untrained mind assumes the dropped bullet hits long before the fired bullet, which travels nearly a kilometer through the air.
- In reality, **both bullets strike the ground at the exact same millisecond!**

Why? Because both bullets start with zero initial vertical velocity ($v_{0y} = 0$). Both experience the exact same downward gravitational acceleration ($a_y = -g = -9.8\text{ m/s}^2$). The horizontal speed of $800\text{ m/s}$ does not alter vertical free fall by a single nanometer.

$$\Delta y = -\frac{1}{2} g t^2 \implies t_{\text{hit}} = \sqrt{\frac{2(1.5\text{ m})}{9.80\text{ m/s}^2}} \approx 0.55\text{ seconds for BOTH bullets!}$$

The fired bullet covers a horizontal distance of $800\text{ m/s} \times 0.553\text{ s} \approx 442\text{ meters}$ while falling, but its vertical descent is 100% identical to the dropped bullet.

```
       Height 1.5 m
       +============================================================+
       |   Dropped Bullet: Falls straight down                      |
       |   *                                                        |
       |   |                                                        |
       |   v  (t = 0.55 s)                                          |
       |                                                            |
       |   Fired Bullet: Moves forward 442 m while falling down     |
       |   * - - - - - - . . . _ _ _                                |
       |                             ' ' . . _                      |
       |                                       ' ' . * (t = 0.55 s) |
       +============================================================+
       Ground Level: BOTH HIT AT EXACTLY t = 0.55 SECONDS!
```

---

## 6.2 The Planar Kinematic Vector Trio

In two dimensions, physical state is represented by three vector quantities in Cartesian coordinates:

### 1. The Position Vector: $\vec{r}(t)$
The location of an object in the $xy$-plane relative to the origin $(0, 0)$:

$$\vec{r}(t) = x(t)\hat{i} + y(t)\hat{j} = \langle x(t), y(t) \rangle$$

- The distance from the origin is the Euclidean norm (Pythagorean theorem):
  $$|\vec{r}(t)| = r = \sqrt{x^2(t) + y^2(t)}$$
- The position angle relative to the positive $x$-axis:
  $$\theta_r = \operatorname{atan2}(y(t), x(t))$$

### 2. The Velocity Vector: $\vec{v}(t)$
The time derivative of the position vector:

$$\vec{v}(t) = \frac{d\vec{r}}{dt} = \frac{dx}{dt}\hat{i} + \frac{dy}{dt}\hat{j} = v_x(t)\hat{i} + v_y(t)\hat{j} = \langle v_x(t), v_y(t) \rangle$$

- **Scalar Speed ($|\vec{v}|$):** The magnitude of the velocity vector:
  $$\text{Speed} = v = |\vec{v}(t)| = \sqrt{v_x^2(t) + v_y^2(t)}$$
- **Direction of Travel ($\theta_v$):**
  $$\theta_v = \operatorname{atan2}(v_y, v_x)$$
- **The Tangent Invariant:** The velocity vector $\vec{v}(t)$ is **always tangent** to the path (trajectory curve) of the particle at every single moment in time!

### 3. The Acceleration Vector: $\vec{a}(t)$
The time derivative of the velocity vector:

$$\vec{a}(t) = \frac{d\vec{v}}{dt} = \frac{dv_x}{dt}\hat{i} + \frac{dv_y}{dt}\hat{j} = a_x(t)\hat{i} + a_y(t)\hat{j} = \langle a_x(t), a_y(t) \rangle$$

- **Magnitude:**
  $$|\vec{a}(t)| = a = \sqrt{a_x^2(t) + a_y^2(t)}$$
- **Direction:**
  $$\phi_a = \operatorname{atan2}(a_y, a_x)$$

Unlike velocity, the acceleration vector does **not** point along the tangent of the path. It points toward the inside of the curve (concavity) where the path is turning!

```
                    Trajectory Curve
                         .-'
                     _.-'   * P(x,y)
                 _.-'        \
             _.-'             \---> Velocity v (Tangent to curve)
          .-'                  \
                                \---> Acceleration a (Points toward inside of curve)
```

---

## 6.3 Tangential vs. Normal Acceleration

To understand how acceleration alters motion in two dimensions, we project the acceleration vector $\vec{a}$ onto two natural coordinates aligned with the motion:
1. **The Tangential Axis ($\hat{T}$):** Unit vector pointing in the instantaneous direction of velocity ($\hat{T} = \frac{\vec{v}}{|\vec{v}|}$).
2. **The Normal Axis ($\hat{N}$):** Unit vector perpendicular to $\hat{T}$, pointing toward the center of curvature.

$$\vec{a} = a_t \hat{T} + a_n \hat{N}$$

### 1. Tangential Acceleration ($a_t$)
Tangential acceleration acts parallel to the velocity vector. It changes the **speed** (magnitude of velocity) of the object:

$$a_t = \frac{d}{dt}|\vec{v}| = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}|} = \frac{v_x a_x + v_y a_y}{\sqrt{v_x^2 + v_y^2}}$$

- If $a_t > 0$ ($\vec{v} \cdot \vec{a} > 0$): Object is **speeding up**.
- If $a_t < 0$ ($\vec{v} \cdot \vec{a} < 0$): Object is **slowing down**.
- If $a_t = 0$ ($\vec{v} \cdot \vec{a} = 0$): Speed is constant!

### 2. Normal (Centripetal) Acceleration ($a_n$)
Normal acceleration acts perpendicular to the velocity vector. It changes the **direction** of motion (causes the path to bend and curve):

$$a_n = \frac{v^2}{\rho}$$

where $\rho$ is the instantaneous radius of curvature of the path.
By the Pythagorean theorem:

$$|\vec{a}|^2 = a_t^2 + a_n^2 \implies a_n = \sqrt{|\vec{a}|^2 - a_t^2}$$

- If $a_n = 0$: The object is moving along a **straight line** ($\rho \to \infty$).
- If $a_n > 0$: The path is **curving**.

---

## 6.4 The Two-Dimensional Constant Acceleration Equations

When the acceleration vector is constant in both magnitude and direction ($\vec{a} = \text{constant}$):

$$\vec{a} = a_x \hat{i} + a_y \hat{j} = \text{constant}$$

Because orthogonal motions are independent, we split the 2D problem into **two decoupled 1D problems** running side by side:

### Vector Form:
$$\vec{v}(t) = \vec{v}_0 + \vec{a} t$$
$$\vec{r}(t) = \vec{r}_0 + \vec{v}_0 t + \frac{1}{2} \vec{a} t^2$$

### Component Form:
$$\begin{cases} v_x(t) = v_{0x} + a_x t \\ x(t) = x_0 + v_{0x} t + \frac{1}{2} a_x t^2 \\ v_x^2 = v_{0x}^2 + 2 a_x \Delta x \end{cases} \quad \text{and} \quad \begin{cases} v_y(t) = v_{0y} + a_y t \\ y(t) = y_0 + v_{0y} t + \frac{1}{2} a_y t^2 \\ v_y^2 = v_{0y}^2 + 2 a_y \Delta y \end{cases}$$

Notice that the **time parameter $t$** is the sole scalar thread that binds the $x$ and $y$ worlds together!

---

## 6.5 Ten Progressive Worked Numerical Examples

### Example 6.1: Vector State Evaluation from Components
**Problem:** A quadcopter drone flies in a horizontal test arena. Its coordinates over time $t \ge 0$ are:
$$x(t) = 3.0 t^2 - 4.0 t + 2.0\text{ meters}$$
$$y(t) = 2.0 t^3 - 6.0 t\text{ meters}$$
1. Find formulas for the velocity components $v_x(t), v_y(t)$ and acceleration components $a_x(t), a_y(t)$.
2. Calculate the position vector $\vec{r}$, velocity vector $\vec{v}$, and acceleration vector $\vec{a}$ at $t = 2.0\text{ seconds}$.
3. Calculate the scalar speed and heading direction $\theta_v$ at $t = 2.0\text{ seconds}$.

**Step 1:** Differentiate each component:
$$v_x(t) = \frac{dx}{dt} = 6.0 t - 4.0\text{ m/s}$$
$$v_y(t) = \frac{dy}{dt} = 6.0 t^2 - 6.0\text{ m/s}$$
$$a_x(t) = \frac{dv_x}{dt} = 6.0\text{ m/s}^2\text{ (constant)}$$
$$a_y(t) = \frac{dv_y}{dt} = 12.0 t\text{ m/s}^2$$

**Step 2:** Evaluate state at $t = 2.0\text{ s}$:
- Position:
  $$x(2.0) = 3.0(2^2) - 4.0(2) + 2.0 = 12.0 - 8.0 + 2.0 = 6.0\text{ meters}$$
  $$y(2.0) = 2.0(2^3) - 6.0(2) = 16.0 - 12.0 = 4.0\text{ meters}$$
  $$\vec{r}(2.0) = \langle 6.0, 4.0 \rangle\text{ meters} = (6.0\hat{i} + 4.0\hat{j})\text{ m}$$
- Velocity:
  $$v_x(2.0) = 6.0(2.0) - 4.0 = 8.0\text{ m/s}$$
  $$v_y(2.0) = 6.0(2.0^2) - 6.0 = 6.0(4.0) - 6.0 = 18.0\text{ m/s}$$
  $$\vec{v}(2.0) = \langle 8.0, 18.0 \rangle\text{ m/s}$$
- Acceleration:
  $$a_x(2.0) = 6.0\text{ m/s}^2$$
  $$a_y(2.0) = 12.0(2.0) = 24.0\text{ m/s}^2$$
  $$\vec{a}(2.0) = \langle 6.0, 24.0 \rangle\text{ m/s}^2$$

**Step 3:** Scalar speed and heading:
$$|\vec{v}(2.0)| = \sqrt{v_x^2 + v_y^2} = \sqrt{8.0^2 + 18.0^2} = \sqrt{64.0 + 324.0} = \sqrt{388.0} \approx 19.70\text{ m/s}$$
$$\theta_v = \operatorname{atan2}(18.0, 8.0) = \arctan\left(\frac{18.0}{8.0}\right) = \arctan(2.25) \approx 66.04^\circ \approx 1.153\text{ radians}$$

---

### Example 6.2: Resolving Tangential and Normal Acceleration
**Problem:** For the drone in Example 6.1 at $t = 2.0\text{ seconds}$ ($\vec{v} = \langle 8.0, 18.0 \rangle\text{ m/s}$, $\vec{a} = \langle 6.0, 24.0 \rangle\text{ m/s}^2$, $|\vec{v}| = \sqrt{388}\text{ m/s}$):
1. Compute the tangential acceleration $a_t$. Is the drone speeding up or slowing down?
2. Compute the normal acceleration $a_n$.
3. Find the instantaneous radius of curvature $\rho$ of the flight path.

**Step 1:** Compute tangential acceleration via dot product:
$$\vec{v} \cdot \vec{a} = v_x a_x + v_y a_y = (8.0)(6.0) + (18.0)(24.0) = 48.0 + 432.0 = 480.0\text{ m}^2/\text{s}^3$$
$$a_t = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}|} = \frac{480.0}{\sqrt{388.0}} = \frac{480.0}{19.6977} \approx 24.368\text{ m/s}^2$$
Because $a_t > 0$, the drone is **speeding up** at a rate of $24.37\text{ m/s}$ per second.

**Step 2:** Compute normal acceleration:
$$|\vec{a}|^2 = 6.0^2 + 24.0^2 = 36.0 + 576.0 = 612.0\text{ m}^2/\text{s}^4$$
$$a_n = \sqrt{|\vec{a}|^2 - a_t^2} = \sqrt{612.0 - (24.368)^2} = \sqrt{612.0 - 593.81} = \sqrt{18.19} \approx 4.265\text{ m/s}^2$$

**Step 3:** Calculate radius of curvature $\rho$:
$$a_n = \frac{v^2}{\rho} \implies \rho = \frac{v^2}{a_n} = \frac{388.0}{4.265} \approx 90.97\text{ meters}$$

**Conclusion:** The drone is speeding up tangentially at $24.37\text{ m/s}^2$ while curving along a circle of instantaneous radius $91.0\text{ meters}$ with centripetal acceleration $4.27\text{ m/s}^2$.

---

### Example 6.3: Decoupled 2D Constant Acceleration (Hovercraft on Ice)
**Problem:** A robotic hovercraft slides across a vast frictionless frozen lake. At $t = 0$, it is at origin $\vec{r}_0 = \langle 0, 0 \rangle$ with initial velocity $\vec{v}_0 = \langle 5.0, 0 \rangle\text{ m/s}$ (gliding purely East).
Twin thrusters fire simultaneously, imparting constant acceleration $\vec{a} = \langle +1.2, +2.0 \rangle\text{ m/s}^2$.
1. Write the vector equations for position $\vec{r}(t)$ and velocity $\vec{v}(t)$.
2. Calculate the hovercraft's position and speed at $t = 5.0\text{ seconds}$.
3. What is the angle between the velocity vector and the acceleration vector at $t = 5.0\text{ s}$?

**Step 1:** Equations of motion:
$$\vec{v}(t) = \langle 5.0 + 1.2 t, \ 0 + 2.0 t \rangle = \langle 5.0 + 1.2 t, \ 2.0 t \rangle\text{ m/s}$$
$$\vec{r}(t) = \langle 5.0 t + \frac{1}{2}(1.2) t^2, \ 0 + \frac{1}{2}(2.0) t^2 \rangle = \langle 5.0 t + 0.6 t^2, \ 1.0 t^2 \rangle\text{ meters}$$

**Step 2:** State at $t = 5.0\text{ s}$:
- Position:
  $$x(5.0) = 5.0(5.0) + 0.6(5.0^2) = 25.0 + 0.6(25.0) = 25.0 + 15.0 = 40.0\text{ meters}$$
  $$y(5.0) = 1.0(5.0^2) = 25.0\text{ meters}$$
  $$\vec{r}(5.0) = \langle 40.0, 25.0 \rangle\text{ meters} \implies |\vec{r}| = \sqrt{40.0^2 + 25.0^2} = \sqrt{1600 + 625} = \sqrt{2225} \approx 47.17\text{ m}$$
- Velocity:
  $$v_x(5.0) = 5.0 + 1.2(5.0) = 5.0 + 6.0 = 11.0\text{ m/s}$$
  $$v_y(5.0) = 2.0(5.0) = 10.0\text{ m/s}$$
  $$\vec{v}(5.0) = \langle 11.0, 10.0 \rangle\text{ m/s} \implies |\vec{v}| = \sqrt{11.0^2 + 10.0^2} = \sqrt{121 + 100} = \sqrt{221} \approx 14.87\text{ m/s}$$

**Step 3:** Angle between $\vec{v}$ and $\vec{a}$:
$$\vec{a} = \langle 1.2, 2.0 \rangle \implies |\vec{a}| = \sqrt{1.2^2 + 2.0^2} = \sqrt{1.44 + 4.0} = \sqrt{5.44} \approx 2.332\text{ m/s}^2$$
$$\vec{v} \cdot \vec{a} = (11.0)(1.2) + (10.0)(2.0) = 13.2 + 20.0 = 33.2$$
$$\cos\theta = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}| |\vec{a}|} = \frac{33.2}{(14.866)(2.3324)} = \frac{33.2}{34.673} \approx 0.9575$$
$$\theta = \arccos(0.9575) \approx 16.76^\circ \approx 0.2925\text{ radians}$$

---

### Example 6.4: Deriving the Cartesian Trajectory Equation $y(x)$
**Problem:** For the hovercraft in Example 6.3 ($x(t) = 5.0 t + 0.6 t^2$, $y(t) = t^2$):
1. Eliminate the parameter $t$ to derive an explicit Cartesian equation $x = f(y)$.
2. Explain what geometric curve this path forms in the $xy$-plane.

**Step 1:** Notice that $y = t^2 \implies t = \sqrt{y}$ (for $t \ge 0$).
**Step 2:** Substitute into $x(t)$:
$$x = 5.0 \sqrt{y} + 0.6 y$$
Alternatively, isolating $y$ as a function of $x$:
From $x(t) = 5t + 0.6t^2$, as $t$ grows, $y = t^2$ grows proportionally to $x$.
For small $t$: $x \approx 5t \implies t \approx x/5 \implies y \approx (x/5)^2 = \frac{1}{25}x^2 = 0.04 x^2$ (a parabola!).

---

### Example 6.5: Interception Course on a 2D Grid
**Problem:** In a marine logistics simulation:
- Container Cargo Ship $A$ is at coordinate $\vec{r}_A(0) = \langle 0, 12.0 \rangle\text{ km}$ cruising at constant velocity $\vec{v}_A = \langle 15.0, 0 \rangle\text{ km/h}$ (due East).
- Patrol Cutter $B$ is at origin $\vec{r}_B(0) = \langle 0, 0 \rangle$ at $t = 0$.
The patrol cutter cruises at a speed of $v_B = 25.0\text{ km/h}$.
At what heading angle $\theta$ (measured north of east) must Cutter $B$ steer to intercept Ship $A$, and how long does the interception take?

**Step 1:** Write the position equations:
- Ship $A$: $\vec{r}_A(t) = \langle 15.0 t, \ 12.0 \rangle\text{ km}$.
- Cutter $B$: $\vec{r}_B(t) = \langle (25.0\cos\theta) t, \ (25.0\sin\theta) t \rangle\text{ km}$.

**Step 2:** For an intercept at time $T$, both coordinates must match:
1. $x$-coordinate match:
   $$25.0\cos\theta \cdot T = 15.0 T \implies 25.0\cos\theta = 15.0 \implies \cos\theta = \frac{15.0}{25.0} = 0.600$$
2. $y$-coordinate match:
   $$25.0\sin\theta \cdot T = 12.0$$

**Step 3:** Find heading angle $\theta$:
$$\cos\theta = 0.600 \implies \theta = \arccos(0.600) \approx 53.13^\circ$$
Notice: $\sin\theta = \sqrt{1 - \cos^2\theta} = \sqrt{1 - 0.36} = \sqrt{0.64} = 0.800$.

**Step 4:** Calculate interception time $T$:
$$25.0(0.800) T = 12.0 \implies 20.0 T = 12.0 \implies T = \frac{12.0}{20.0} = 0.60\text{ hours (36 minutes)}$$

**Step 5:** Intercept location:
$$x_{\text{int}} = 15.0(0.60) = 9.0\text{ km}$$
$$y_{\text{int}} = 12.0\text{ km}$$
$$\vec{r}_{\text{int}} = \langle 9.0, 12.0 \rangle\text{ km}$$

---

### Example 6.6: Drone Maneuver with Zero Tangential Acceleration
**Problem:** A drone moves in a circle of radius $R = 50.0\text{ meters}$ at a constant scalar speed of $v = 10.0\text{ m/s}$.
Its parametric position is $\vec{r}(t) = \langle 50.0\cos(0.2 t), \ 50.0\sin(0.2 t) \rangle$ meters.
1. Compute the velocity vector $\vec{v}(t)$ and prove scalar speed is constant.
2. Compute the acceleration vector $\vec{a}(t)$ and show that it is strictly perpendicular to velocity.
3. Compute the tangential and normal acceleration components.

**Step 1:** Differentiate for velocity:
$$\vec{v}(t) = \frac{d\vec{r}}{dt} = \langle -50.0(0.2)\sin(0.2t), \ 50.0(0.2)\cos(0.2t) \rangle = \langle -10.0\sin(0.2t), \ 10.0\cos(0.2t) \rangle\text{ m/s}$$
Scalar speed:
$$|\vec{v}(t)| = \sqrt{(-10.0\sin(0.2t))^2 + (10.0\cos(0.2t))^2} = \sqrt{100.0(\sin^2(0.2t) + \cos^2(0.2t))} = \sqrt{100.0(1)} = 10.0\text{ m/s}$$
Speed is strictly constant!

**Step 2:** Differentiate for acceleration:
$$\vec{a}(t) = \frac{d\vec{v}}{dt} = \langle -10.0(0.2)\cos(0.2t), \ -10.0(0.2)\sin(0.2t) \rangle = \langle -2.0\cos(0.2t), \ -2.0\sin(0.2t) \rangle\text{ m/s}^2$$
Notice that:
$$\vec{a}(t) = -(0.2)^2 \vec{r}(t) = -0.04 \vec{r}(t)$$
Compute the dot product $\vec{v} \cdot \vec{a}$:
$$\vec{v} \cdot \vec{a} = (-10\sin)( -2\cos) + (10\cos)(-2\sin) = 20\sin\theta\cos\theta - 20\sin\theta\cos\theta = 0$$
Since $\vec{v} \cdot \vec{a} \equiv 0$, the acceleration is **strictly perpendicular** to velocity at all times!

**Step 3:** Acceleration components:
$$a_t = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}|} = 0.00\text{ m/s}^2$$
$$a_n = |\vec{a}| = \sqrt{(-2\cos)^2 + (-2\sin)^2} = 2.00\text{ m/s}^2 = \frac{v^2}{R} = \frac{10^2}{50} = \frac{100}{50} = 2.00\text{ m/s}^2$$

---

### Example 6.7: Reversing One Axis While Accelerating the Other
**Problem:** A robotic camera dolly moves on a studio grid with initial state $\vec{r}_0 = \langle 0, 0 \rangle$, $\vec{v}_0 = \langle -6.0, +8.0 \rangle\text{ m/s}$.
Its drive motors impart constant acceleration $\vec{a} = \langle +2.0, -1.0 \rangle\text{ m/s}^2$.
1. At what time $t_x$ does the dolly momentarily stop moving horizontally ($v_x = 0$)?
2. At what time $t_y$ does the dolly momentarily stop moving vertically ($v_y = 0$)?
3. What is the dolly's position vector when its horizontal motion reverses?

**Step 1:** Velocity component equations:
$$v_x(t) = -6.0 + 2.0 t$$
$$v_y(t) = +8.0 - 1.0 t$$

**Step 2:** Find horizontal reversal ($v_x = 0$):
$$-6.0 + 2.0 t_x = 0 \implies 2.0 t_x = 6.0 \implies t_x = 3.0\text{ seconds}$$

**Step 3:** Find vertical reversal ($v_y = 0$):
$$8.0 - 1.0 t_y = 0 \implies t_y = 8.0\text{ seconds}$$

**Step 4:** Position at horizontal reversal ($t = 3.0\text{ s}$):
$$x(3.0) = -6.0(3.0) + \frac{1}{2}(2.0)(3.0^2) = -18.0 + 1.0(9.0) = -9.0\text{ meters}$$
$$y(3.0) = 8.0(3.0) + \frac{1}{2}(-1.0)(3.0^2) = 24.0 - 0.5(9.0) = 24.0 - 4.5 = +19.5\text{ meters}$$
$$\vec{r}(3.0) = \langle -9.0, +19.5 \rangle\text{ meters}$$

---

### Example 6.8: Constant Acceleration Passing Through a Target Gate
**Problem:** A satellite thruster must steer an uncrewed craft from initial position $\vec{r}_0 = \langle 100.0, -50.0 \rangle\text{ m}$ with initial velocity $\vec{v}_0 = \langle 10.0, 20.0 \rangle\text{ m/s}$ to pass through a docking ring located at $\vec{r}_{\text{dock}} = \langle 300.0, 100.0 \rangle\text{ m}$ in exactly $t = 10.0\text{ seconds}$.
Assuming thrusters provide constant acceleration:
1. What constant acceleration vector $\vec{a} = \langle a_x, a_y \rangle$ must the guidance computer command?
2. What will be the craft's final velocity vector $\vec{v}$ as it crosses the docking ring?

**Step 1:** Identify required displacement:
$$\Delta\vec{r} = \vec{r}_{\text{dock}} - \vec{r}_0 = \langle 300.0 - 100.0, \ 100.0 - (-50.0) \rangle = \langle 200.0, 150.0 \rangle\text{ meters}$$

**Step 2:** Solve for acceleration using Equation 3 ($\Delta\vec{r} = \vec{v}_0 t + \frac{1}{2}\vec{a} t^2$):
- $x$-channel:
  $$200.0 = (10.0)(10.0) + \frac{1}{2} a_x (10.0^2) = 100.0 + 50.0 a_x$$
  $$50.0 a_x = 100.0 \implies a_x = 2.00\text{ m/s}^2$$
- $y$-channel:
  $$150.0 = (20.0)(10.0) + \frac{1}{2} a_y (10.0^2) = 200.0 + 50.0 a_y$$
  $$50.0 a_y = 150.0 - 200.0 = -50.0 \implies a_y = -1.00\text{ m/s}^2$$
$$\vec{a} = \langle 2.00, -1.00 \rangle\text{ m/s}^2$$

**Step 3:** Final velocity at docking:
$$v_x(10) = 10.0 + (2.00)(10.0) = 30.0\text{ m/s}$$
$$v_y(10) = 20.0 + (-1.00)(10.0) = 10.0\text{ m/s}$$
$$\vec{v}_{\text{dock}} = \langle 30.0, 10.0 \rangle\text{ m/s} \implies |\vec{v}| = \sqrt{30^2 + 10^2} = \sqrt{1000} \approx 31.62\text{ m/s}$$

---

### Example 6.9: Determining the Instant of Closest Approach
**Problem:** In a radar tracking airspace:
- Aircraft 1 is at $\vec{r}_1(t) = \langle 20.0 t, \ 0 \rangle\text{ km}$.
- Aircraft 2 is at $\vec{r}_2(t) = \langle 0, \ 40.0 - 30.0 t \rangle\text{ km}$.
1. Write the vector separation $\vec{S}(t) = \vec{r}_2(t) - \vec{r}_1(t)$.
2. Calculate the square of the distance between them as a function of time $t$.
3. At what time $t^*$ is the distance between the aircraft minimized, and what is that minimum separation distance?

**Step 1:** Separation vector:
$$\vec{S}(t) = \langle 0 - 20.0 t, \ 40.0 - 30.0 t - 0 \rangle = \langle -20.0 t, \ 40.0 - 30.0 t \rangle\text{ km}$$

**Step 2:** Distance squared $D^2(t)$:
$$D^2(t) = (-20.0 t)^2 + (40.0 - 30.0 t)^2 = 400.0 t^2 + (1600.0 - 2400.0 t + 900.0 t^2)$$
$$D^2(t) = 1300.0 t^2 - 2400.0 t + 1600.0$$

**Step 3:** Minimize $D^2(t)$ using calculus (differentiate with respect to $t$ and set to zero):
$$\frac{d}{dt}[D^2] = 2600.0 t - 2400.0 = 0 \implies 2600.0 t = 2400.0$$
$$t^* = \frac{2400.0}{2600.0} = \frac{12}{13} \approx 0.9231\text{ hours (55.38 minutes)}$$

**Step 4:** Evaluate minimum distance:
$$D^2\left(\frac{12}{13}\right) = 1300\left(\frac{144}{169}\right) - 2400\left(\frac{12}{13}\right) + 1600 = \frac{187200}{169} - \frac{28800}{13} + 1600$$
Notice: $\frac{1300}{169} = \frac{100}{13}$.
$$D^2 = \frac{14400}{13} - \frac{28800}{13} + \frac{20800}{13} = \frac{14400 - 28800 + 20800}{13} = \frac{6400}{13} \approx 492.31\text{ km}^2$$
$$D_{\text{min}} = \sqrt{\frac{6400}{13}} = \frac{80.0}{\sqrt{13}} \approx \frac{80.0}{3.60555} \approx 22.19\text{ km}$$

---

### Example 6.10: 2D Parametric Cubic Spline Trajectory
**Problem:** In an autonomous race simulator, a vehicle's path is defined by the parametric spline:
$$\vec{r}(t) = \langle t^3 - 3t, \ 2t^2 - 4t \rangle\text{ meters}$$
1. Find the times when the vehicle passes through the origin $(0, 0)$.
2. Compute the velocity vector, speed, and heading angle at $t = 1.0\text{ second}$.
3. Show that at $t = 1.0\text{ s}$, the vehicle is turning sharply leftward ($a_n > 0$).

**Step 1:** Passing through the origin ($x = 0$ and $y = 0$ simultaneously):
- $x(t) = t(t^2 - 3) = 0 \implies t = 0$ or $t = \pm\sqrt{3}$.
- $y(t) = 2t(t - 2) = 0 \implies t = 0$ or $t = 2$.
The only common root is $t = 0$. The vehicle passes through the origin only at $t = 0$.

**Step 2:** Velocity at $t = 1.0\text{ s}$:
$$\vec{v}(t) = \langle 3t^2 - 3, \ 4t - 4 \rangle$$
$$\vec{v}(1.0) = \langle 3(1) - 3, \ 4(1) - 4 \rangle = \langle 0.0, 0.0 \rangle\text{ m/s}$$
At $t = 1.0\text{ s}$, the vehicle comes to a complete instantaneous stop ($v = 0$)!

**Step 3:** Acceleration at $t = 1.0\text{ s}$:
$$\vec{a}(t) = \langle 6t, \ 4 \rangle \implies \vec{a}(1.0) = \langle 6.0, 4.0 \rangle\text{ m/s}^2$$
Because $\vec{v}(1.0) = \vec{0}$, all acceleration is actively establishing a new direction of motion along vector $\langle 6.0, 4.0 \rangle$ ($\theta \approx 33.7^\circ$).

---

## 6.6 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Vector Decomposition and Speed Evaluation (Foundational)
- **Exercise 6.1:** A boat has velocity components $v_x = +12.0\text{ m/s}$ and $v_y = -5.0\text{ m/s}$. Calculate its scalar speed and its direction angle relative to the positive $x$-axis.
- **Exercise 6.2:** An aircraft flies at an airspeed of $250.0\text{ m/s}$ on a heading of $30.0^\circ$ North of East. Calculate the horizontal eastward ($v_x$) and northward ($v_y$) velocity components.

### Tier 2: 2D Constant Acceleration Equations
- **Exercise 6.3:** A particle starts from rest at the origin and experiences constant acceleration $\vec{a} = \langle 4.0, -2.5 \rangle\text{ m/s}^2$. Find its position and velocity vectors at $t = 4.0\text{ seconds}$.
- **Exercise 6.4:** A drone at $\vec{r}_0 = \langle 10.0, 20.0 \rangle\text{ m}$ has initial velocity $\vec{v}_0 = \langle -3.0, 5.0 \rangle\text{ m/s}$ and constant acceleration $\vec{a} = \langle 2.0, -1.0 \rangle\text{ m/s}^2$. Find its position at $t = 6.0\text{ seconds}$.

### Tier 3: Tangential and Normal Acceleration
- **Exercise 6.5:** At a certain instant, a race car has velocity $\vec{v} = \langle 20.0, 0 \rangle\text{ m/s}$ and total acceleration $\vec{a} = \langle 4.0, 3.0 \rangle\text{ m/s}^2$. Determine the tangential acceleration $a_t$ and normal acceleration $a_n$.
- **Exercise 6.6:** A particle moves along $\vec{r}(t) = \langle 2t^2, \ 4t \rangle\text{ m}$. Compute its tangential acceleration $a_t$ at $t = 1.0\text{ second}$.

### Tier 4: Trajectory Interception & Turning Points
- **Exercise 6.7:** A projectile launched from the origin has position $\vec{r}(t) = \langle 30.0 t, \ 40.0 t - 4.90 t^2 \rangle$ meters. Find the time and position when the vertical velocity $v_y = 0$, and compute the scalar speed at that moment.
- **Exercise 6.8:** Two autonomous robots move on a factory floor: $\vec{r}_A(t) = \langle 2.0 t, \ 5.0 + 1.0 t \rangle$ and $\vec{r}_B(t) = \langle 14.0 - 1.0 t, \ 2.0 + 2.0 t \rangle$. Determine whether the robots collide, and if so, at what time and coordinate.

### Tier 5: Theoretical Invariants & Curvature
- **Exercise 6.9:** Prove that if a particle moves such that its position vector $\vec{r}(t)$ and velocity vector $\vec{v}(t)$ are always perpendicular ($\vec{r} \cdot \vec{v} = 0$), then the distance of the particle from the origin is constant (the motion is restricted to a circle).
- **Exercise 6.10:** For a curve with parameter $t$, prove that the tangential acceleration is zero ($a_t = 0$) if and only if the speed $|\vec{v}|$ is constant over time.

---

## 6.7 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 6.1
Given $v_x = +12.0\text{ m/s}$, $v_y = -5.0\text{ m/s}$:
1. Scalar speed:
$$v = \sqrt{v_x^2 + v_y^2} = \sqrt{12.0^2 + (-5.0)^2} = \sqrt{144.0 + 25.0} = \sqrt{169.0} = 13.0\text{ m/s}$$
2. Direction angle:
$$\theta = \operatorname{atan2}(-5.0, 12.0) = \arctan\left(\frac{-5.0}{12.0}\right) \approx -22.62^\circ \quad (\text{or } 337.38^\circ)$$
**Final Answer:** Speed $= 13.0\text{ m/s}$; Direction $= -22.62^\circ$ (South of East).

---

### Solution to Exercise 6.2
Given $v = 250.0\text{ m/s}$, $\theta = 30.0^\circ$:
1. $v_x = v \cos\theta = 250.0 \cos(30.0^\circ) = 250.0 \times \frac{\sqrt{3}}{2} \approx 216.51\text{ m/s}$ (East).
2. $v_y = v \sin\theta = 250.0 \sin(30.0^\circ) = 250.0 \times 0.50 = 125.00\text{ m/s}$ (North).
**Final Answer:** $v_x \approx 216.51\text{ m/s}$; $v_y = 125.00\text{ m/s}$.

---

### Solution to Exercise 6.3
For $\vec{v}_0 = \langle 0, 0 \rangle$, $\vec{a} = \langle 4.0, -2.5 \rangle\text{ m/s}^2$, $t = 4.0\text{ s}$:
1. Velocity:
$$\vec{v}(4.0) = \vec{a} t = \langle 4.0(4.0), \ -2.5(4.0) \rangle = \langle 16.0, -10.0 \rangle\text{ m/s}$$
2. Position:
$$\vec{r}(4.0) = \frac{1}{2} \vec{a} t^2 = \frac{1}{2} \langle 4.0, -2.5 \rangle (16.0) = 8.0 \langle 4.0, -2.5 \rangle = \langle 32.0, -20.0 \rangle\text{ meters}$$
**Final Answer:** $\vec{v} = \langle 16.0, -10.0 \rangle\text{ m/s}$; $\vec{r} = \langle 32.0, -20.0 \rangle\text{ meters}$.

---

### Solution to Exercise 6.4
Given $\vec{r}_0 = \langle 10.0, 20.0 \rangle$, $\vec{v}_0 = \langle -3.0, 5.0 \rangle$, $\vec{a} = \langle 2.0, -1.0 \rangle$, $t = 6.0\text{ s}$:
- $x(6.0) = 10.0 + (-3.0)(6.0) + \frac{1}{2}(2.0)(6.0^2) = 10.0 - 18.0 + 1.0(36.0) = 28.0\text{ meters}$.
- $y(6.0) = 20.0 + (5.0)(6.0) + \frac{1}{2}(-1.0)(6.0^2) = 20.0 + 30.0 - 0.5(36.0) = 50.0 - 18.0 = 32.0\text{ meters}$.
$$\vec{r}(6.0) = \langle 28.0, 32.0 \rangle\text{ meters}$$
**Final Answer:** $\vec{r}(6.0) = \langle 28.0, 32.0 \rangle\text{ meters}$.

---

### Solution to Exercise 6.5
Given $\vec{v} = \langle 20.0, 0 \rangle\text{ m/s}$ and $\vec{a} = \langle 4.0, 3.0 \rangle\text{ m/s}^2$:
1. Since $\vec{v}$ points entirely along the $x$-axis ($\hat{T} = \hat{i}$):
   - The $x$-component of acceleration is parallel to velocity $\implies a_t = a_x = 4.0\text{ m/s}^2$.
   - The $y$-component of acceleration is perpendicular to velocity $\implies a_n = a_y = 3.0\text{ m/s}^2$.
2. Dot product verification:
   $$a_t = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}|} = \frac{(20.0)(4.0) + (0)(3.0)}{20.0} = \frac{80.0}{20.0} = 4.0\text{ m/s}^2$$
   $$a_n = \sqrt{|\vec{a}|^2 - a_t^2} = \sqrt{(4^2 + 3^2) - 4^2} = \sqrt{25 - 16} = \sqrt{9} = 3.0\text{ m/s}^2$$
**Final Answer:** $a_t = 4.0\text{ m/s}^2$; $a_n = 3.0\text{ m/s}^2$.

---

### Solution to Exercise 6.6
For $\vec{r}(t) = \langle 2t^2, 4t \rangle$:
1. $\vec{v}(t) = \langle 4t, 4 \rangle$.
   At $t = 1.0$: $\vec{v}(1.0) = \langle 4.0, 4.0 \rangle\text{ m/s} \implies |\vec{v}| = \sqrt{16 + 16} = \sqrt{32} \approx 5.657\text{ m/s}$.
2. $\vec{a}(t) = \langle 4, 0 \rangle\text{ m/s}^2$ for all $t$.
3. Tangential acceleration at $t = 1.0$:
   $$a_t = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}|} = \frac{(4.0)(4.0) + (4.0)(0)}{\sqrt{32}} = \frac{16.0}{\sqrt{32}} = \frac{16.0}{4\sqrt{2}} = \frac{4}{\sqrt{2}} = 2\sqrt{2} \approx 2.828\text{ m/s}^2$$
**Final Answer:** $a_t = 2\sqrt{2} \approx 2.83\text{ m/s}^2$.

---

### Solution to Exercise 6.7
For $\vec{r}(t) = \langle 30.0 t, \ 40.0 t - 4.90 t^2 \rangle$:
1. Velocity components:
   $$v_x(t) = 30.0\text{ m/s}$$
   $$v_y(t) = 40.0 - 9.80 t\text{ m/s}$$
2. Set $v_y = 0$:
   $$40.0 - 9.80 t = 0 \implies t = \frac{40.0}{9.80} \approx 4.082\text{ seconds}$$
3. Position at this time:
   $$x = 30.0\left(\frac{40}{9.8}\right) \approx 122.45\text{ meters}$$
   $$y = 40.0\left(\frac{40}{9.8}\right) - 4.90\left(\frac{40}{9.8}\right)^2 = \frac{1600}{9.8} - \frac{800}{9.8} = \frac{800}{9.8} \approx 81.63\text{ meters}$$
4. Scalar speed at peak:
   Since $v_y = 0$, $v = \sqrt{v_x^2 + 0^2} = v_x = 30.0\text{ m/s}$.
**Final Answer:** Peak time $t \approx 4.08\text{ s}$; Position $\vec{r} \approx \langle 122.45, 81.63 \rangle\text{ m}$; Speed $= 30.0\text{ m/s}$.

---

### Solution to Exercise 6.8
Interception of robots $A$ and $B$:
- $x$-coordinate match:
  $$2.0 t = 14.0 - 1.0 t \implies 3.0 t = 14.0 \implies t = \frac{14}{3} \approx 4.667\text{ seconds}$$
- Check if $y$-coordinates match at $t = \frac{14}{3}$:
  $$y_A\left(\frac{14}{3}\right) = 5.0 + 1.0\left(\frac{14}{3}\right) = 5.0 + 4.667 = 9.667\text{ meters}$$
  $$y_B\left(\frac{14}{3}\right) = 2.0 + 2.0\left(\frac{14}{3}\right) = 2.0 + \frac{28}{3} = 2.0 + 9.333 = 11.333\text{ meters}$$
Since $y_A(14/3) \neq y_B(14/3)$ ($9.67\text{ m} \neq 11.33\text{ m}$), the paths cross at different times.
**Final Answer:** No collision occurs.

---

### Solution to Exercise 6.9
Prove $\vec{r} \cdot \vec{v} = 0 \implies |\vec{r}| = \text{constant}$:
1. Consider the square of the distance from the origin:
$$r^2 = |\vec{r}|^2 = \vec{r} \cdot \vec{r}$$
2. Differentiate with respect to time using the vector product rule:
$$\frac{d}{dt}[r^2] = \frac{d}{dt}[\vec{r} \cdot \vec{r}] = \frac{d\vec{r}}{dt} \cdot \vec{r} + \vec{r} \cdot \frac{d\vec{r}}{dt} = \vec{v} \cdot \vec{r} + \vec{r} \cdot \vec{v} = 2(\vec{r} \cdot \vec{v})$$
3. Since $\vec{r} \cdot \vec{v} = 0$:
$$\frac{d}{dt}[r^2] = 2(0) = 0$$
4. Since the time derivative of $r^2$ is zero, $r^2$ (and thus $r = |\vec{r}|$) is strictly constant over time! $\blacksquare$
**Final Answer:** Proved: The position vector's magnitude is constant, meaning the trajectory is constrained to a circle.

---

### Solution to Exercise 6.10
Prove $a_t = 0 \iff |\vec{v}| = \text{constant}$:
1. By definition, speed $v = |\vec{v}| = \sqrt{\vec{v} \cdot \vec{v}}$.
2. Differentiating speed with respect to time:
$$\frac{d}{dt}[v^2] = \frac{d}{dt}[\vec{v} \cdot \vec{v}] \implies 2v \frac{dv}{dt} = 2 \vec{v} \cdot \frac{d\vec{v}}{dt} = 2 \vec{v} \cdot \vec{a}$$
Divide by $2v$:
$$\frac{dv}{dt} = \frac{\vec{v} \cdot \vec{a}}{v} = a_t$$
3. Therefore, $a_t = \frac{d}{dt}|\vec{v}|$.
Hence, $a_t = 0 \iff \frac{d}{dt}|\vec{v}| = 0 \iff |\vec{v}|$ is constant over time. $\blacksquare$
**Final Answer:** Proved: Tangential acceleration is the exact time rate of change of speed.
