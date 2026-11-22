# CHAPTER 07: Projectile Motion & Parabolic Trajectories

> "A projectile which moves with a motion compounded of two motions, one uniform and horizontal, the other naturally accelerated and vertical, describes a semi-parabola."
> — **Galileo Galilei**, *Dialogues Concerning Two New Sciences* (1638)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Decompose arbitrary initial launch velocity vectors into completely uncoupled horizontal and vertical scalar components using trigonometric projection.
2. Formulate the parametric time-dependent equations of motion for both Cartesian coordinates under constant uniform downward gravitational acceleration.
3. Eliminate the scalar time parameter $t$ algebraically to derive the fundamental trajectory equation $y(x)$ and demonstrate mathematically that the unconstrained path is a quadratic parabola concave down.
4. Derive from first principles the exact analytical expressions for time to apex ($t_{\text{apex}}$), total level-ground time of flight ($T_{\text{flight}}$), maximum apogee height ($H_{\text{max}}$), and horizontal range ($R$).
5. Prove why a launch angle of $\theta = 45^\circ$ maximizes horizontal range over level terrain, and elucidate the physical and mathematical symmetry of complementary launch angles ($\theta$ and $90^\circ - \theta$).
6. Calculate instantaneous velocity magnitude and direction at any arbitrary point along the ballistic trajectory, proving why minimum speed occurs uniquely at the apex.
7. Solve complex ballistic problems involving moving targets, cross-range intercepts, and intermediate waypoint clearances with uncompromising mathematical rigor.

---

## 7.1 The Anatomy of Ballistic Independence

In Chapter 06, we established Galileo’s foundational principle of orthogonal kinematic independence: motion along perpendicular spatial dimensions occurs with zero cross-talk, cross-coupling, or mutual interference. Projectile motion is the quintessential physical realization of this theorem.

Imagine a cannon shell fired across an open testing range in a vacuum. At the precise instant the projectile leaves the muzzle, it is completely abandoned to two distinct physical realities:
1. **Along the horizontal axis ($x$):** There is no net force acting on the projectile (assuming vacuum conditions where aerodynamic drag is zero). By Newton's First Law and our kinematic framework, the horizontal acceleration is identically zero:
   $$a_x = 0$$
   Consequently, the horizontal velocity remains stubbornly, eternally constant throughout the entire journey:
   $$v_x(t) = v_{0x} = \text{constant}$$
   The projectile covers identical horizontal distances in identical increments of time. It undergoes pure **Uniform Linear Motion**.

2. **Along the vertical axis ($y$):** The projectile is bathed in the planet's uniform gravitational field $\vec{g} = -g\,\hat{j}$. Newton's universal gravitational attraction exerts a constant downward force, producing a relentless, uninterrupted downward acceleration:
   $$a_y = -g \approx -9.80\,\text{m/s}^2$$
   The projectile undergoes pure **One-Dimensional Constant Acceleration Free Fall**. It decelerates on its ascent, comes to an instantaneous vertical halt at its peak, and accelerates downward toward the terrain.

The projectile does not "know" it is moving horizontally while it falls, nor does its horizontal transit know that gravity is dragging it downward. The two channels are completely blind to each other. The only master that binds them together is the relentless, single-valued progress of **scalar time ($t$)**.

```
                +y (Vertical Free Fall: a_y = -g)
                 ^
                 |           * * Apex (v_y = 0, v = v_x)
                 |       *       *
                 |     *           *
                 |    *             *
                 |   *               *
                 |  *                 *
                 | *                   *
 (0,0) Launch ---+----------------------*----> +x (Horizontal Uniform Motion: a_x = 0)
                  <------- Range R ------>
```

---

## 7.2 Vector Decomposition of Initial Velocity

Every projectile trajectory begins at an initial position $(x_0, y_0)$ with an initial velocity vector $\vec{v}_0$ directed at a launch angle $\theta$ measured counterclockwise relative to the positive horizontal axis ($+x$).

Using standard planar trigonometry:
$$\vec{v}_0 = v_{0x}\,\hat{i} + v_{0y}\,\hat{j}$$

where the scalar components are:
$$\begin{aligned}
v_{0x} &= |\vec{v}_0| \cos\theta \\
v_{0y} &= |\vec{v}_0| \sin\theta
\end{aligned}$$

The magnitude of the launch speed is restored via the Pythagorean theorem:
$$|\vec{v}_0| = \sqrt{v_{0x}^2 + v_{0y}^2}$$

and the launch angle is:
$$\theta = \arctan\left(\frac{v_{0y}}{v_{0x}}\right)$$

### The Quadrant Rules and Directional Sanity
- For standard forward launches above the horizontal: $0 < \theta < 90^\circ \implies v_{0x} > 0, v_{0y} > 0$.
- For pure horizontal launches (e.g., a projectile fired horizontally from a cliff edge): $\theta = 0^\circ \implies v_{0x} = v_0, v_{0y} = 0$.
- For downward angled launches (e.g., an aircraft diving toward a target): $-90^\circ < \theta < 0^\circ \implies v_{0x} > 0, v_{0y} < 0$.

---

## 7.3 The Parametric Equations of Motion

We now apply the Sacred Kinematic Equations derived in Chapter 04 independently to each axis. Let the initial launch occur at time $t = 0$ from the origin $(x_0, y_0) = (0, 0)$.

### Horizontal Motion ($a_x = 0$)
$$\begin{aligned}
v_x(t) &= v_{0x} = v_0 \cos\theta \\
x(t) &= v_{0x} t = (v_0 \cos\theta)\,t
\end{aligned}$$

### Vertical Motion ($a_y = -g$)
$$\begin{aligned}
v_y(t) &= v_{0y} - g t = v_0 \sin\theta - g t \\
y(t) &= v_{0y} t - \frac{1}{2} g t^2 = (v_0 \sin\theta)\,t - \frac{1}{2} g t^2 \\
v_y^2(y) &= v_{0y}^2 - 2 g y = (v_0 \sin\theta)^2 - 2 g y
\end{aligned}$$

### The Total State Vector
At any instant of time $t \ge 0$, the state of the projectile is completely described by its 2D position vector $\vec{r}(t)$ and its 2D velocity vector $\vec{v}(t)$:
$$\vec{r}(t) = \begin{bmatrix} (v_0 \cos\theta)\,t \\ (v_0 \sin\theta)\,t - \frac{1}{2} g t^2 \end{bmatrix}$$

$$\vec{v}(t) = \begin{bmatrix} v_0 \cos\theta \\ v_0 \sin\theta - g t \end{bmatrix}$$

The instantaneous scalar speed $v(t) = |\vec{v}(t)|$ is:
$$v(t) = \sqrt{v_x^2(t) + v_y^2(t)} = \sqrt{(v_0 \cos\theta)^2 + (v_0 \sin\theta - g t)^2}$$

Expanding the squared binomial inside the radical:
$$v(t) = \sqrt{v_0^2 \cos^2\theta + v_0^2 \sin^2\theta - 2 v_0 g t \sin\theta + g^2 t^2}$$
$$v(t) = \sqrt{v_0^2 - 2 g (v_0 t \sin\theta - \frac{1}{2} g t^2)}$$

Recognizing that the expression in parentheses is precisely the vertical displacement $y(t)$:
$$v(t) = \sqrt{v_0^2 - 2 g y(t)}$$

This is an astonishing and profound result: **the instantaneous speed of an unconstrained projectile in a vacuum depends purely on its vertical elevation $y$, completely independent of the shape of its path or the elapsed time!** This is our first direct kinematic glimpse of the Law of Conservation of Mechanical Energy:
$$\frac{1}{2} m v^2 + m g y = \frac{1}{2} m v_0^2 = \text{constant}$$

---

## 7.4 Derivation of the Trajectory Equation $y(x)$

Parametric equations $\big(x(t), y(t)\big)$ describe *when* the projectile arrives at a given point. To understand the geometric shape of the path traced out in space—the *trajectory*—we must eliminate the scalar time parameter $t$.

From the horizontal equation of motion:
$$x = (v_0 \cos\theta)\,t \implies t = \frac{x}{v_0 \cos\theta}$$

Substitute this expression for $t$ directly into the vertical equation of motion:
$$y(x) = (v_0 \sin\theta)\left(\frac{x}{v_0 \cos\theta}\right) - \frac{1}{2} g \left(\frac{x}{v_0 \cos\theta}\right)^2$$

Simplifying each term:
1. In the first term, $v_0$ cancels cleanly, leaving $\frac{\sin\theta}{\cos\theta} x = x \tan\theta$.
2. In the second term, squaring the denominator gives $v_0^2 \cos^2\theta$.

Thus, we obtain the canonical **Cartesian Trajectory Equation of a Projectile**:
$$y(x) = (\tan\theta)\,x - \left(\frac{g}{2 v_0^2 \cos^2\theta}\right) x^2$$

### The Geometric Character of the Trajectory
Notice the algebraic structure of this equation. Let:
$$A = \tan\theta$$
$$B = \frac{g}{2 v_0^2 \cos^2\theta} > 0$$

The trajectory equation takes the form:
$$y(x) = A x - B x^2$$

This is a quadratic polynomial in $x$ with no constant term ($y(0) = 0$). Because the coefficient of $x^2$ is strictly negative ($-B < 0$), the graph of $y(x)$ is a **downward-opening parabola** whose vertex represents the maximum elevation of the flight.

### The Secant/Tangent Form for Targeting
Using the trigonometric identity $\frac{1}{\cos^2\theta} = \sec^2\theta = 1 + \tan^2\theta$, we can rewrite the trajectory equation purely in terms of $T = \tan\theta$:
$$y(x) = x T - \frac{g x^2}{2 v_0^2} (1 + T^2)$$

Rearranging into a standard quadratic equation for the unknown tangent $T$:
$$\left(\frac{g x^2}{2 v_0^2}\right) T^2 - x T + \left(y + \frac{g x^2}{2 v_0^2}\right) = 0$$

This formulation will prove indispensable in Chapter 08 when solving the inverse targeting problem: given a target coordinate $(x, y)$, what launch angle $\theta$ hits it?

---

## 7.5 Fundamental Properties of Level-Ground Projectiles

Consider the standard baseline scenario: a projectile launched from ground level ($y_0 = 0$) across flat, horizontal terrain, landing when $y = 0$.

```
 y
 ^
 |                  Apex: (R/2, H)
 H |----------------------*----------------------
   |                    * | *
   |                  *   |   *
   |                *     |     *
   |              *       |       *
   |            *         |         *
   |          *           |           *
   |        *             |             *
---+------*---------------+---------------*------> x
 (0,0)  x = 0           x = R/2           x = R
```

### 1. Time to Apex ($t_{\text{apex}}$)
At the highest point of the trajectory—the apex or apogee—the projectile is momentarily moving purely horizontally. Its vertical velocity must vanish identically:
$$v_y(t_{\text{apex}}) = 0$$

Using the velocity equation:
$$v_{0y} - g t_{\text{apex}} = 0 \implies t_{\text{apex}} = \frac{v_{0y}}{g} = \frac{v_0 \sin\theta}{g}$$

### 2. Total Time of Flight ($T_{\text{flight}}$)
Because gravitational acceleration is constant and symmetric, the time taken to descend from the apex back to ground level is identical to the time taken to ascend. Alternatively, we set $y(t) = 0$:
$$y(t) = t \left(v_0 \sin\theta - \frac{1}{2} g t\right) = 0$$

This yields two roots:
- $t = 0$ (the moment of launch)
- $v_0 \sin\theta - \frac{1}{2} g t = 0 \implies T_{\text{flight}} = \frac{2 v_0 \sin\theta}{g} = 2 t_{\text{apex}}$

The total hang-time is strictly twice the time to apex.

### 3. Maximum Height ($H_{\text{max}}$)
To find the maximum vertical clearance, evaluate $y(t)$ at $t = t_{\text{apex}}$:
$$H_{\text{max}} = y(t_{\text{apex}}) = (v_0 \sin\theta)\left(\frac{v_0 \sin\theta}{g}\right) - \frac{1}{2} g \left(\frac{v_0 \sin\theta}{g}\right)^2$$
$$H_{\text{max}} = \frac{v_0^2 \sin^2\theta}{g} - \frac{v_0^2 \sin^2\theta}{2g} = \frac{v_0^2 \sin^2\theta}{2g} = \frac{v_{0y}^2}{2g}$$

Alternatively, this follows immediately from Torricelli's formula: $v_y^2 = v_{0y}^2 - 2 g H = 0 \implies H = \frac{v_{0y}^2}{2g}$.

### 4. Horizontal Range ($R$)
The range $R$ is the total horizontal distance traveled during the time of flight $T_{\text{flight}}$:
$$R = x(T_{\text{flight}}) = v_{0x} T_{\text{flight}} = (v_0 \cos\theta)\left(\frac{2 v_0 \sin\theta}{g}\right)$$
$$R = \frac{v_0^2 (2 \sin\theta \cos\theta)}{g}$$

Using the double-angle trigonometric identity $2 \sin\theta \cos\theta = \sin(2\theta)$:
$$R = \frac{v_0^2 \sin(2\theta)}{g}$$

---

## 7.6 The Geometry of Maximum Range and Complementary Angles

### Why $\theta = 45^\circ$ Maximizes Level Range
In the range formula $R(\theta) = \frac{v_0^2 \sin(2\theta)}{g}$, the parameters $v_0$ and $g$ are fixed physical constants. The range depends solely on the factor $\sin(2\theta)$.
The sine function achieves its theoretical maximum value of $+1$ when its argument is $90^\circ$:
$$\sin(2\theta) = 1 \implies 2\theta = 90^\circ \implies \theta = 45^\circ$$

At $\theta = 45^\circ$:
$$R_{\text{max}} = \frac{v_0^2}{g}$$

At this optimal angle, the maximum height attained is:
$$H_{45^\circ} = \frac{v_0^2 \sin^2(45^\circ)}{2g} = \frac{v_0^2 (1/\sqrt{2})^2}{2g} = \frac{v_0^2}{4g} = \frac{1}{4} R_{\text{max}}$$

**Universal Geometric Rule:** Over level ground, the maximum height of a $45^\circ$ maximum-range projectile is always exactly one-fourth of its total range ($H = R/4$).

### Complementary Launch Angles
Consider two different launch angles $\theta_1$ and $\theta_2$ that sum to $90^\circ$ (complementary angles):
$$\theta_2 = 90^\circ - \theta_1$$

Evaluate the range for $\theta_2$:
$$R(\theta_2) = \frac{v_0^2 \sin\big(2(90^\circ - \theta_1)\big)}{g} = \frac{v_0^2 \sin(180^\circ - 2\theta_1)}{g}$$

Using the fundamental identity $\sin(180^\circ - \phi) = \sin\phi$:
$$\sin(180^\circ - 2\theta_1) = \sin(2\theta_1)$$
Therefore:
$$R(\theta_1) = R(90^\circ - \theta_1)$$

**Every target on level ground within range can be reached by exactly two distinct trajectories:**
1. **The Low Trajectory ("Direct Fire"):** $\theta < 45^\circ$. Shorter flight time, lower apogee, higher horizontal speed throughout, less vulnerable to atmospheric crosswinds.
2. **The High Trajectory ("Mortar / Lob Fire"):** $\theta > 45^\circ$. Longer flight time, higher apogee, steep plunging impact angle, designed to clear intervening fortifications or terrain barriers.

```
 y
 ^
 |           * * * * (High Angle: 70 deg - Long hang time, high apex)
 |        *           *
 |       *      * * *   *   (Low Angle: 20 deg - Fast transit, shallow apex)
 |      *     *       *  *
 |     *    *           * *
 |    *   *               **
 +---*--*-------------------*----> x
    (0,0)                Same Range R!
```

---

## 7.7 Velocity Vector Evolution Along the Trajectory

At any point $(x, y)$ along the trajectory:
- The horizontal component remains permanently frozen: $v_x = v_0 \cos\theta$.
- The vertical component diminishes continuously: $v_y = v_0 \sin\theta - g t$.

The direction of the instantaneous velocity vector is given by the angle $\phi(t)$ with the horizontal:
$$\tan\phi(t) = \frac{v_y(t)}{v_x(t)} = \frac{v_0 \sin\theta - g t}{v_0 \cos\theta} = \tan\theta - \frac{g t}{v_0 \cos\theta}$$

Notice that as $t$ advances:
1. At launch ($t = 0$): $\tan\phi = \tan\theta \implies \phi = \theta$ (pointing up and forward).
2. At apex ($t = t_{\text{apex}}$): $v_y = 0 \implies \tan\phi = 0 \implies \phi = 0^\circ$ (vector is purely horizontal).
3. At impact ($t = T_{\text{flight}}$): $v_y = -v_0 \sin\theta \implies \tan\phi = -\tan\theta \implies \phi = -\theta$ (pointing downward with the exact same magnitude as launch).

---

## 7.8 Ten Progressive Worked Numerical Examples

Below are 10 progressive worked examples demonstrating every major aspect of projectile motion. Every calculation shows every arithmetic step, unit tracking, and physical sanity check.

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 7.1: Fundamental Decomposition and Apex Calculation
**Problem:** A football is kicked from ground level with an initial velocity of $v_0 = 24.0\,\text{m/s}$ at an angle of $\theta = 35.0^\circ$ above the horizontal. Calculate:
1. The horizontal and vertical components of the initial velocity.
2. The time elapsed before the ball reaches its maximum height.
3. The maximum height $H_{\text{max}}$ above the pitch.

#### Solution
**Step 1: Velocity components**
$$\begin{aligned}
v_{0x} &= v_0 \cos\theta = 24.0\,\text{m/s} \times \cos(35.0^\circ) = 24.0 \times 0.819152 = 19.6596\,\text{m/s} \approx 19.66\,\text{m/s} \\
v_{0y} &= v_0 \sin\theta = 24.0\,\text{m/s} \times \sin(35.0^\circ) = 24.0 \times 0.573576 = 13.7658\,\text{m/s} \approx 13.77\,\text{m/s}
\end{aligned}$$

**Step 2: Time to apex**
At the apex, $v_y = 0$:
$$t_{\text{apex}} = \frac{v_{0y}}{g} = \frac{13.7658\,\text{m/s}}{9.80\,\text{m/s}^2} = 1.40467\,\text{s} \approx 1.40\,\text{s}$$

**Step 3: Maximum height**
$$H_{\text{max}} = \frac{v_{0y}^2}{2g} = \frac{(13.7658\,\text{m/s})^2}{2 \times 9.80\,\text{m/s}^2} = \frac{189.497}{19.60} = 9.668\,\text{m} \approx 9.67\,\text{m}$$

*Sanity Check:* Using $y = v_{0y} t_{\text{apex}} - \frac{1}{2} g t_{\text{apex}}^2$:
$$y = 13.7658(1.4047) - 0.5(9.80)(1.4047)^2 = 19.336 - 9.668 = 9.668\,\text{m}$$. Confirmed.

---

### Example 7.2: Total Hang-Time and Level Horizontal Range
**Problem:** For the football in Example 7.1 ($v_0 = 24.0\,\text{m/s}, \theta = 35.0^\circ$), determine:
1. The total time of flight before striking the level pitch.
2. The total horizontal range $R$.
3. The impact velocity vector (magnitude and angle).

#### Solution
**Step 1: Total time of flight**
$$T_{\text{flight}} = 2 \times t_{\text{apex}} = 2 \times 1.40467\,\text{s} = 2.8093\,\text{s} \approx 2.81\,\text{s}$$

**Step 2: Total horizontal range**
Method A (Kinematic transit):
$$R = v_{0x} \times T_{\text{flight}} = 19.6596\,\text{m/s} \times 2.80934\,\text{s} = 55.2307\,\text{m} \approx 55.23\,\text{m}$$

Method B (Double-angle formula):
$$R = \frac{v_0^2 \sin(2\theta)}{g} = \frac{(24.0)^2 \sin(70.0^\circ)}{9.80} = \frac{576.0 \times 0.939693}{9.80} = \frac{541.263}{9.80} = 55.231\,\text{m}$$
Both methods produce identical results.

**Step 3: Impact velocity vector**
At touchdown ($t = T_{\text{flight}}$):
$$v_x(T) = v_{0x} = +19.66\,\text{m/s}$$
$$v_y(T) = v_{0y} - g T_{\text{flight}} = 13.77 - 9.80(2.8093) = 13.77 - 27.53 = -13.77\,\text{m/s}$$
Magnitude:
$$v_{\text{impact}} = \sqrt{(19.66)^2 + (-13.77)^2} = \sqrt{386.51 + 189.61} = \sqrt{576.12} = 24.0\,\text{m/s}$$
Direction:
$$\phi = \arctan\left(\frac{-13.7658}{19.6596}\right) = -35.0^\circ$$
The projectile lands with the exact initial launch speed at the negative reflection of the launch angle.

---

### Example 7.3: Instantaneous Kinematics at Intermediate Time
**Problem:** An artillery test projectile is launched across level terrain with $v_0 = 85.0\,\text{m/s}$ at $\theta = 55.0^\circ$. At $t = 4.00\,\text{s}$ after launch, determine:
1. The 2D coordinates $(x, y)$.
2. The components of the instantaneous velocity $(v_x, v_y)$.
3. The instantaneous speed and the angle of the velocity vector relative to the horizontal.

#### Solution
**Step 1: Initial components**
$$\begin{aligned}
v_{0x} &= 85.0 \cos(55.0^\circ) = 85.0 \times 0.573576 = 48.754\,\text{m/s} \\
v_{0y} &= 85.0 \sin(55.0^\circ) = 85.0 \times 0.819152 = 69.628\,\text{m/s}
\end{aligned}$$

**Step 2: Position at $t = 4.00\,\text{s}$**
$$x(4.00) = v_{0x} t = 48.754 \times 4.00 = 195.02\,\text{m}$$
$$y(4.00) = v_{0y} t - \frac{1}{2} g t^2 = 69.628(4.00) - 0.5(9.80)(4.00)^2 = 278.512 - 78.400 = 200.11\,\text{m}$$

**Step 3: Instantaneous velocity at $t = 4.00\,\text{s}$**
$$v_x(4.00) = v_{0x} = 48.754\,\text{m/s}$$
$$v_y(4.00) = v_{0y} - g t = 69.628 - (9.80 \times 4.00) = 69.628 - 39.200 = +30.428\,\text{m/s}$$
Since $v_y > 0$, the projectile is still ascending toward its apex ($t_{\text{apex}} = 69.628 / 9.80 = 7.10\,\text{s}$).

**Step 4: Speed and angle**
$$v = \sqrt{v_x^2 + v_y^2} = \sqrt{(48.754)^2 + (30.428)^2} = \sqrt{2376.95 + 925.86} = \sqrt{3302.81} = 57.47\,\text{m/s}$$
$$\phi = \arctan\left(\frac{30.428}{48.754}\right) = \arctan(0.6241) = 31.97^\circ \approx 32.0^\circ$$

---

### Example 7.4: Trajectory Equation Evaluation and Obstacle Clearance
**Problem:** A fire hose nozzle on the ground sprays water with a muzzle speed $v_0 = 28.0\,\text{m/s}$ at an angle of $\theta = 50.0^\circ$. A residential wall of height $h = 16.0\,\text{m}$ is located at a horizontal distance of $d = 35.0\,\text{m}$.
1. Formulate the Cartesian trajectory equation $y(x)$ for the water stream.
2. Determine the height of the water stream at $x = 35.0\,\text{m}$. Does the water clear the wall?
3. Calculate the clearance margin.

#### Solution
**Step 1: Construct the trajectory equation**
$$\tan\theta = \tan(50.0^\circ) = 1.19175$$
$$\cos\theta = \cos(50.0^\circ) = 0.642788 \implies \cos^2\theta = 0.413176$$
The quadratic coefficient:
$$B = \frac{g}{2 v_0^2 \cos^2\theta} = \frac{9.80}{2 \times (28.0)^2 \times 0.413176} = \frac{9.80}{2 \times 784.0 \times 0.413176} = \frac{9.80}{647.86} = 0.0151267\,\text{m}^{-1}$$
Thus:
$$y(x) = 1.19175 x - 0.015127 x^2$$

**Step 2: Evaluate height at $x = 35.0\,\text{m}$**
$$y(35.0) = 1.19175(35.0) - 0.0151267(35.0)^2$$
$$y(35.0) = 41.7113 - 0.0151267(1225.0) = 41.7113 - 18.5302 = 23.181\,\text{m}$$

**Step 3: Clearance margin**
Since $y(35.0) = 23.18\,\text{m} > 16.0\,\text{m}$, the water stream comfortably clears the wall.
$$\text{Margin} = 23.181\,\text{m} - 16.000\,\text{m} = +7.18\,\text{m}$$

---

### Example 7.5: Complementary Launch Comparison
**Problem:** A coastal defense battery tests two shells fired with identical muzzle speeds $v_0 = 120.0\,\text{m/s}$. Shell A is fired at $\theta_A = 25.0^\circ$, while Shell B is fired at $\theta_B = 65.0^\circ$. Calculate and compare:
1. The horizontal range for both shells.
2. The total flight time for both shells.
3. The peak apogee height for both shells.

#### Solution
**Step 1: Horizontal range**
Shell A:
$$R_A = \frac{v_0^2 \sin(2 \times 25.0^\circ)}{g} = \frac{(120.0)^2 \sin(50.0^\circ)}{9.80} = \frac{14400 \times 0.766044}{9.80} = \frac{11031.0}{9.80} = 1125.6\,\text{m}$$
Shell B:
$$R_B = \frac{v_0^2 \sin(2 \times 65.0^\circ)}{g} = \frac{14400 \sin(130.0^\circ)}{9.80} = \frac{14400 \times 0.766044}{9.80} = 1125.6\,\text{m}$$
$R_A = R_B = 1126\,\text{m}$, proving the complementary angle theorem.

**Step 2: Time of flight**
Shell A ($\theta = 25.0^\circ$):
$$T_A = \frac{2 v_0 \sin(25.0^\circ)}{g} = \frac{2 \times 120.0 \times 0.422618}{9.80} = \frac{101.428}{9.80} = 10.35\,\text{s}$$
Shell B ($\theta = 65.0^\circ$):
$$T_B = \frac{2 v_0 \sin(65.0^\circ)}{g} = \frac{2 \times 120.0 \times 0.906308}{9.80} = \frac{217.514}{9.80} = 22.20\,\text{s}$$
Shell B stays aloft more than twice as long ($T_B / T_A = \sin(65^\circ)/\sin(25^\circ) = 2.14$).

**Step 3: Maximum height**
Shell A:
$$H_A = \frac{v_0^2 \sin^2(25.0^\circ)}{2g} = \frac{14400 \times (0.422618)^2}{19.60} = \frac{14400 \times 0.178606}{19.60} = 131.2\,\text{m}$$
Shell B:
$$H_B = \frac{v_0^2 \sin^2(65.0^\circ)}{2g} = \frac{14400 \times (0.906308)^2}{19.60} = \frac{14400 \times 0.821394}{19.60} = 603.5\,\text{m}$$
Shell B reaches an altitude 4.6 times higher than Shell A.

---

### Example 7.6: Pure Horizontal Launch from a Cliff
**Problem:** A remote-sensing probe is launched horizontally from the edge of a vertical sea cliff of height $h = 78.4\,\text{m}$ with a speed of $v_0 = 18.0\,\text{m/s}$.
1. How long does the probe take to strike the ocean surface?
2. What is the horizontal distance from the base of the cliff to the impact point?
3. What is the magnitude and direction of the velocity vector upon impact?

#### Solution
**Step 1: Fall time**
Since the launch is purely horizontal, $v_{0y} = 0$. The vertical motion is governed by:
$$y(t) = y_0 - \frac{1}{2} g t^2 = 78.4 - 4.90 t^2 = 0$$
$$4.90 t^2 = 78.4 \implies t^2 = \frac{78.4}{4.90} = 16.0 \implies t = 4.00\,\text{s}$$

**Step 2: Horizontal distance**
$$x = v_{0x} t = 18.0\,\text{m/s} \times 4.00\,\text{s} = 72.0\,\text{m}$$

**Step 3: Velocity at impact**
Horizontal component:
$$v_x = v_{0x} = 18.0\,\text{m/s}$$
Vertical component:
$$v_y = 0 - g t = -9.80 \times 4.00 = -39.2\,\text{m/s}$$
Impact speed:
$$v_{\text{impact}} = \sqrt{v_x^2 + v_y^2} = \sqrt{(18.0)^2 + (-39.2)^2} = \sqrt{324.0 + 1536.64} = \sqrt{1860.64} = 43.135\,\text{m/s} \approx 43.1\,\text{m/s}$$
Impact angle:
$$\phi = \arctan\left(\frac{-39.2}{18.0}\right) = \arctan(-2.1778) = -65.3^\circ$$
The probe impacts the water at an angle of $65.3^\circ$ below the horizontal.

---

### Example 7.7: Finding Position and Speed from Angle of Travel
**Problem:** An arrow is shot from ground level at an initial speed $v_0 = 45.0\,\text{m/s}$ and angle $\theta = 60.0^\circ$. At what point in its trajectory will its velocity vector make an angle of $+30.0^\circ$ above the horizontal? Calculate its elevation $y$ and elapsed time $t$ at that instant.

#### Solution
**Step 1: Velocity components**
$$v_{0x} = 45.0 \cos(60.0^\circ) = 45.0 \times 0.500 = 22.50\,\text{m/s}$$
$$v_{0y} = 45.0 \sin(60.0^\circ) = 45.0 \times \frac{\sqrt{3}}{2} = 38.971\,\text{m/s}$$

**Step 2: Condition for $\phi = 30.0^\circ$**
Since $v_x$ is strictly constant:
$$\tan(30.0^\circ) = \frac{v_y}{v_x} \implies v_y = v_x \tan(30.0^\circ) = 22.50 \times \frac{1}{\sqrt{3}} = \frac{22.50}{1.73205} = 12.990\,\text{m/s}$$

**Step 3: Solve for time $t$**
$$v_y(t) = v_{0y} - g t \implies 12.990 = 38.971 - 9.80 t$$
$$9.80 t = 38.971 - 12.990 = 25.981 \implies t = \frac{25.981}{9.80} = 2.651\,\text{s}$$

**Step 4: Solve for elevation $y$**
Method A (Torricelli):
$$v_y^2 = v_{0y}^2 - 2 g y \implies (12.990)^2 = (38.971)^2 - 2(9.80) y$$
$$168.74 = 1518.74 - 19.60 y \implies 19.60 y = 1350.00 \implies y = \frac{1350.00}{19.60} = 68.878\,\text{m} \approx 68.9\,\text{m}$$

Method B (Time equation):
$$y = v_{0y} t - \frac{1}{2} g t^2 = 38.971(2.651) - 4.90(2.651)^2 = 103.31 - 34.43 = 68.88\,\text{m}$$
Both methods agree to four significant figures.

---

### Example 7.8: Minimum Launch Velocity to Clear a Spatial Coordinate
**Problem:** A relief cargo package must be launched from ground level $(0,0)$ to land precisely on an elevated plateau shelf located at $(x_p, y_p) = (120.0\,\text{m}, 45.0\,\text{m})$. Determine the absolute minimum launch speed $v_{0,\text{min}}$ capable of reaching this target, and the required launch angle $\theta$.

#### Solution
**Step 1: The tangent quadratic equation**
Recall the trajectory equation in terms of $T = \tan\theta$:
$$\left(\frac{g x^2}{2 v_0^2}\right) T^2 - x T + \left(y + \frac{g x^2}{2 v_0^2}\right) = 0$$
Let $k = \frac{g x^2}{2 v_0^2}$. The equation is:
$$k T^2 - x T + (y + k) = 0$$

For a real physical launch angle $\theta$ to exist, the quadratic discriminant $\Delta$ with respect to $T$ must be greater than or equal to zero:
$$\Delta = (-x)^2 - 4 k (y + k) \ge 0$$
$$x^2 - 4 k y - 4 k^2 \ge 0$$

The boundary condition representing the absolute minimum speed occurs when the discriminant vanishes identically ($\Delta = 0$):
$$4 k^2 + 4 y k - x^2 = 0$$

**Step 2: Solve for $k$**
Using the quadratic formula for $k$ (taking the positive physical root since $k > 0$):
$$k = \frac{-4y + \sqrt{16 y^2 - 4(4)(-x^2)}}{2(4)} = \frac{-4y + \sqrt{16(y^2 + x^2)}}{8} = \frac{-y + \sqrt{x^2 + y^2}}{2}$$

Let $r = \sqrt{x^2 + y^2}$ be the direct line-of-sight distance to the target:
$$r = \sqrt{(120.0)^2 + (45.0)^2} = \sqrt{14400 + 2025} = \sqrt{16425} = 128.160\,\text{m}$$
Then:
$$k = \frac{-45.0 + 128.160}{2} = \frac{83.160}{2} = 41.580\,\text{m}$$

**Step 3: Solve for minimum launch speed $v_{0,\text{min}}$**
Since $k = \frac{g x^2}{2 v_0^2}$:
$$v_{0,\text{min}}^2 = \frac{g x^2}{2 k} = \frac{9.80 \times (120.0)^2}{2 \times 41.580} = \frac{9.80 \times 14400}{83.160} = \frac{141120}{83.160} = 1696.97\,\text{m}^2/\text{s}^2$$
$$v_{0,\text{min}} = \sqrt{1696.97} = 41.194\,\text{m/s} \approx 41.2\,\text{m/s}$$

**Step 4: Solve for the required launch angle**
When $\Delta = 0$, the quadratic has a single repeated root:
$$T = \tan\theta = \frac{-(-x)}{2k} = \frac{x}{2k} = \frac{120.0}{2(41.580)} = \frac{120.0}{83.160} = 1.4430$$
$$\theta = \arctan(1.4430) = 55.276^\circ \approx 55.3^\circ$$

---

### Example 7.9: The Classic "Hunter and Falling Monkey" Paradox
**Problem:** A tranquilizer dart gun is aimed directly at a target device suspended at coordinates $(d, h) = (60.0\,\text{m}, 25.0\,\text{m})$. At the exact instant the dart leaves the gun with speed $v_0 = 40.0\,\text{m/s}$, the suspension release is triggered and the target begins falling freely from rest under gravity.
1. Prove mathematically that the dart will strike the target regardless of the value of $v_0$ (provided $v_0$ is sufficient to cover distance $d$ before the target hits the ground).
2. Calculate the time $t_{\text{hit}}$ of the collision.
3. Calculate the height $y_{\text{hit}}$ above the ground where impact occurs.

#### Solution
**Step 1: Mathematical Proof**
The gun is aimed directly at the initial position $(d, h)$. Therefore, the launch angle $\theta$ satisfies:
$$\tan\theta = \frac{h}{d} \implies \sin\theta = \frac{h}{\sqrt{d^2 + h^2}}, \quad \cos\theta = \frac{d}{\sqrt{d^2 + h^2}}$$

The horizontal position of the dart is $x_{\text{dart}}(t) = (v_0 \cos\theta) t$.
The dart reaches the horizontal coordinate of the target $x = d$ at time:
$$t^* = \frac{d}{v_0 \cos\theta}$$

Now evaluate the vertical positions of both objects at $t = t^*$:
Dart:
$$y_{\text{dart}}(t^*) = (v_0 \sin\theta) t^* - \frac{1}{2} g (t^*)^2 = (v_0 \sin\theta)\left(\frac{d}{v_0 \cos\theta}\right) - \frac{1}{2} g (t^*)^2 = d \tan\theta - \frac{1}{2} g (t^*)^2$$
Since $d \tan\theta = h$:
$$y_{\text{dart}}(t^*) = h - \frac{1}{2} g (t^*)^2$$

Target (falling from rest at initial height $h$):
$$y_{\text{target}}(t^*) = h - \frac{1}{2} g (t^*)^2$$

Notice that $y_{\text{dart}}(t^*) \equiv y_{\text{target}}(t^*)$ identically! Both objects fall by the exact same distance $\frac{1}{2} g (t^*)^2$ below the line of sight during time $t^*$. Collision is mathematically inevitable.

**Step 2: Numerical evaluation of hit time**
$$\cos\theta = \frac{60.0}{\sqrt{60.0^2 + 25.0^2}} = \frac{60.0}{\sqrt{3600 + 625}} = \frac{60.0}{\sqrt{4225}} = \frac{60.0}{65.0} = \frac{12}{13} \approx 0.923077$$
$$t^* = \frac{d}{v_0 \cos\theta} = \frac{60.0}{40.0 \times (12/13)} = \frac{60.0}{36.923} = 1.625\,\text{s}$$

**Step 3: Impact height**
$$y_{\text{hit}} = h - \frac{1}{2} g (t^*)^2 = 25.0 - 0.5(9.80)(1.625)^2 = 25.0 - 4.90(2.6406) = 25.0 - 12.939 = 12.061\,\text{m} \approx 12.1\,\text{m}$$
Since $y_{\text{hit}} > 0$, the collision takes place safely above ground level.

---

### Example 7.10: Intercepting a Moving Surface Rover
**Problem:** An autonomous defense launcher at $(0, 0)$ detects an intruder rover at $t = 0$ located at $(x_r, 0) = (150.0\,\text{m}, 0)$. The rover is moving directly away from the launcher along the horizontal $x$-axis at a constant velocity $u = 15.0\,\text{m/s}$. The launcher fires an interceptor projectile at $t = 0$ with initial speed $v_0 = 55.0\,\text{m/s}$.
Find the required launch angle $\theta$ to strike the rover on level ground.

#### Solution
**Step 1: Formulate the rendezvous equations**
Let $T$ be the time of flight of the projectile until it returns to ground level ($y = 0$):
$$T = \frac{2 v_0 \sin\theta}{g}$$

At time $T$, the horizontal position of the projectile is:
$$x_p(T) = (v_0 \cos\theta) T = (v_0 \cos\theta)\left(\frac{2 v_0 \sin\theta}{g}\right) = \frac{v_0^2 \sin(2\theta)}{g}$$

At that same time $T$, the position of the retreating rover is:
$$x_r(T) = x_{r0} + u T = 150.0 + u\left(\frac{2 v_0 \sin\theta}{g}\right)$$

**Step 2: Equate horizontal positions**
For an intercept, $x_p(T) = x_r(T)$:
$$\frac{v_0^2 (2 \sin\theta \cos\theta)}{g} = x_{r0} + \frac{2 u v_0 \sin\theta}{g}$$
Multiply the entire equation by $g$:
$$2 v_0^2 \sin\theta \cos\theta = g x_{r0} + 2 u v_0 \sin\theta$$

Substitute the known numerical values:
- $v_0 = 55.0\,\text{m/s} \implies 2 v_0^2 = 2(3025) = 6050$
- $g x_{r0} = 9.80 \times 150.0 = 1470$
- $2 u v_0 = 2 \times 15.0 \times 55.0 = 1650$

The equation becomes:
$$6050 \sin\theta \cos\theta - 1650 \sin\theta - 1470 = 0$$
Dividing by 10:
$$605 \sin\theta \cos\theta - 165 \sin\theta - 147 = 0$$

**Step 3: Numerical solution for $\theta$**
Let $f(\theta) = 302.5 \sin(2\theta) - 165 \sin\theta - 147$.
Let us evaluate test angles:
- For $\theta = 30.0^\circ$:
  $$f(30^\circ) = 302.5 \sin(60^\circ) - 165 \sin(30^\circ) - 147 = 302.5(0.8660) - 165(0.500) - 147 = 261.97 - 82.50 - 147 = +32.47$$
- For $\theta = 25.0^\circ$:
  $$f(25^\circ) = 302.5 \sin(50^\circ) - 165 \sin(25^\circ) - 147 = 302.5(0.7660) - 165(0.4226) - 147 = 231.73 - 69.73 - 147 = +15.00$$
- For $\theta = 20.0^\circ$:
  $$f(20^\circ) = 302.5 \sin(40^\circ) - 165 \sin(20^\circ) - 147 = 302.5(0.6428) - 165(0.3420) - 147 = 194.44 - 56.43 - 147 = -9.00$$

A root exists between $20.0^\circ$ and $25.0^\circ$. Interpolating linearly:
$$\theta \approx 20.0 + 5.0 \times \frac{0 - (-9.00)}{15.00 - (-9.00)} = 20.0 + 5.0 \times \frac{9.00}{24.00} = 20.0 + 1.875 = 21.88^\circ$$

Refining at $\theta = 21.90^\circ$:
$$\sin(43.80^\circ) = 0.69214 \implies 302.5 \times 0.69214 = 209.37$$
$$\sin(21.90^\circ) = 0.37300 \implies 165 \times 0.37300 = 61.54$$
$$f(21.90^\circ) = 209.37 - 61.54 - 147 = +0.83$$
At $\theta = 21.73^\circ$:
$$\sin(43.46^\circ) = 0.68783 \implies 302.5 \times 0.68783 = 208.07$$
$$\sin(21.73^\circ) = 0.37024 \implies 165 \times 0.37024 = 61.09$$
$$f(21.73^\circ) = 208.07 - 61.09 - 147 = -0.02 \approx 0$$

Thus, the low-angle solution is $\theta \approx 21.7^\circ$.
(A high-angle mortar solution also exists around $\theta \approx 50.8^\circ$, but the low angle ensures rapid intercept).

---

## 7.9 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 7.1 (Tier 1: Foundational Decomposition)
An athletic javelin is released with an initial velocity of $v_0 = 31.5\,\text{m/s}$ at an angle of $\theta = 38.0^\circ$ above the horizontal. Calculate:
(a) The initial horizontal and vertical velocity components.
(b) The maximum height reached above the release level.
(c) The time taken to reach the apex.

### Exercise 7.2 (Tier 1: Flight Time and Range)
For the javelin in Exercise 7.1, assuming it lands at the same elevation from which it was released:
(a) Calculate the total time of flight $T$.
(b) Calculate the horizontal range $R$.
(c) State the impact speed and impact angle.

### Exercise 7.3 (Tier 2: Speed at Given Elevation)
A mortar shell is fired with $v_0 = 150.0\,\text{m/s}$ at an elevation angle of $\theta = 62.0^\circ$. Calculate the speed of the shell when it reaches an altitude of $y = 500.0\,\text{m}$ above the launch site:
(a) During its ascent.
(b) During its descent.

### Exercise 7.4 (Tier 2: Horizontal Launch Trajectory)
An emergency rescue beacon is ejected horizontally from an aircraft flying at an altitude of $h = 490.0\,\text{m}$ with a ground speed of $v_0 = 115.0\,\text{m/s}$.
(a) How many seconds elapse before the beacon impacts the ground?
(b) What horizontal distance does the beacon traverse during its fall?
(c) What is the beacon's speed upon impact?

### Exercise 7.5 (Tier 3: The Tangent Velocity Angle)
A golf ball is hit with an initial speed of $v_0 = 42.0\,\text{m/s}$ at $\theta = 40.0^\circ$. At what elapsed time $t$ will the golf ball's trajectory be oriented at an angle of $\phi = -20.0^\circ$ (i.e., $20.0^\circ$ below the horizontal)?

### Exercise 7.6 (Tier 3: Clearing an Elevated Barrier)
A sports stadium fence of height $H = 8.50\,\text{m}$ is located at a horizontal distance of $D = 95.0\,\text{m}$ from home plate. A batter hits a baseball at an initial angle of $\theta = 32.0^\circ$ from an initial height of $y_0 = 1.00\,\text{m}$. What minimum launch speed $v_0$ is required for the baseball to clear the fence?

### Exercise 7.7 (Tier 4: Optimal Angle for Fixed Range)
A catapult is designed to launch a stone a horizontal distance of exactly $R = 250.0\,\text{m}$ across flat terrain with a launch speed of $v_0 = 54.0\,\text{m/s}$.
(a) Find the two possible launch angles $\theta_1$ and $\theta_2$ that achieve this range.
(b) Compute the difference in flight time $\Delta T = T_2 - T_1$ between the two trajectories.

### Exercise 7.8 (Tier 4: Two-Body Simultaneous Strike)
Two guns are located at the same battery. Gun A fires a shell at $\theta_A = 60.0^\circ$, and Gun B fires a shell at $\theta_B = 30.0^\circ$. Both shells are intended to strike the same target at a range of $R = 800.0\,\text{m}$ at the exact same instant.
(a) What must be the initial speeds $v_{0A}$ and $v_{0B}$?
(b) Which gun must be fired first, and what is the required time delay between the two firings?

### Exercise 7.9 (Tier 5: Minimum Launch Speed to Hit an Elevated Window)
A rescue projectile must be launched from ground level $(0, 0)$ into a window located at coordinates $(x, y) = (40.0\,\text{m}, 30.0\,\text{m})$.
(a) Determine the absolute minimum launch speed $v_{0,\text{min}}$ capable of reaching the window.
(b) Determine the required launch angle $\theta$ corresponding to this minimum speed.

### Exercise 7.10 (Tier 5: Intercepting an Accelerating Target)
A target drone starts from rest at $(x, y) = (200.0\,\text{m}, 0)$ at $t = 0$ and accelerates horizontally away from the origin with a constant acceleration $a_d = 2.50\,\text{m/s}^2$. An interceptor shell is launched from the origin at $t = 0$ with initial speed $v_0 = 65.0\,\text{m/s}$. Determine the required launch angle $\theta$ to hit the drone upon ground impact.

---

## 7.10 Comprehensive Solutions to Chapter Exercises

---

### Solution 7.1
**(a) Velocity components:**
$$v_{0x} = v_0 \cos(38.0^\circ) = 31.5\,\text{m/s} \times 0.788011 = 24.822\,\text{m/s} \approx 24.82\,\text{m/s}$$
$$v_{0y} = v_0 \sin(38.0^\circ) = 31.5\,\text{m/s} \times 0.615661 = 19.393\,\text{m/s} \approx 19.39\,\text{m/s}$$

**(b) Maximum height:**
$$H_{\text{max}} = \frac{v_{0y}^2}{2g} = \frac{(19.393\,\text{m/s})^2}{2 \times 9.80\,\text{m/s}^2} = \frac{376.10}{19.60} = 19.189\,\text{m} \approx 19.19\,\text{m}$$

**(c) Time to apex:**
$$t_{\text{apex}} = \frac{v_{0y}}{g} = \frac{19.393\,\text{m/s}}{9.80\,\text{m/s}^2} = 1.9789\,\text{s} \approx 1.98\,\text{s}$$

---

### Solution 7.2
**(a) Total time of flight:**
$$T = 2 t_{\text{apex}} = 2 \times 1.9789\,\text{s} = 3.9578\,\text{s} \approx 3.96\,\text{s}$$

**(b) Horizontal range:**
$$R = v_{0x} T = 24.822\,\text{m/s} \times 3.9578\,\text{s} = 98.24\,\text{m}$$
Alternatively:
$$R = \frac{v_0^2 \sin(2\theta)}{g} = \frac{(31.5)^2 \sin(76.0^\circ)}{9.80} = \frac{992.25 \times 0.970296}{9.80} = \frac{962.776}{9.80} = 98.24\,\text{m}$$

**(c) Impact speed and angle:**
Since the landing is at launch height:
$$v_{\text{impact}} = v_0 = 31.5\,\text{m/s}$$
$$\phi_{\text{impact}} = -\theta = -38.0^\circ$$

---

### Solution 7.3
Using the principle derived in Section 7.3:
$$v(y) = \sqrt{v_0^2 - 2 g y}$$

Notice that the speed depends strictly on elevation $y$, completely independent of the direction of motion!
$$v_0^2 = (150.0\,\text{m/s})^2 = 22500\,\text{m}^2/\text{s}^2$$
$$2 g y = 2 \times 9.80\,\text{m/s}^2 \times 500.0\,\text{m} = 9800\,\text{m}^2/\text{s}^2$$
$$v = \sqrt{22500 - 9800} = \sqrt{12700} = 112.694\,\text{m/s} \approx 112.7\,\text{m/s}$$

**(a) During ascent:** Speed is $112.7\,\text{m/s}$ (with $v_y > 0$).
**(b) During descent:** Speed is identically $112.7\,\text{m/s}$ (with $v_y < 0$).

---

### Solution 7.4
**(a) Time to impact:**
Since $v_{0y} = 0$:
$$h = \frac{1}{2} g t^2 \implies t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2 \times 490.0\,\text{m}}{9.80\,\text{m/s}^2}} = \sqrt{\frac{980.0}{9.80}} = \sqrt{100.0} = 10.00\,\text{s}$$

**(b) Horizontal distance:**
$$x = v_{0x} t = 115.0\,\text{m/s} \times 10.00\,\text{s} = 1150.0\,\text{m} = 1.15\,\text{km}$$

**(c) Impact speed:**
$$v_x = 115.0\,\text{m/s}$$
$$v_y = -g t = -9.80\,\text{m/s}^2 \times 10.00\,\text{s} = -98.0\,\text{m/s}$$
$$v_{\text{impact}} = \sqrt{v_x^2 + v_y^2} = \sqrt{(115.0)^2 + (-98.0)^2} = \sqrt{13225 + 9604} = \sqrt{22829} = 151.09\,\text{m/s} \approx 151.1\,\text{m/s}$$

---

### Solution 7.5
**Step 1: Velocity components**
$$v_{0x} = 42.0 \cos(40.0^\circ) = 42.0 \times 0.766044 = 32.174\,\text{m/s}$$
$$v_{0y} = 42.0 \sin(40.0^\circ) = 42.0 \times 0.642788 = 26.997\,\text{m/s}$$

**Step 2: Condition for $\phi = -20.0^\circ$**
$$\tan(-20.0^\circ) = \frac{v_y}{v_x} \implies v_y = v_{0x} \tan(-20.0^\circ)$$
$$\tan(-20.0^\circ) = -0.363970$$
$$v_y = 32.174 \times (-0.363970) = -11.710\,\text{m/s}$$

**Step 3: Solve for elapsed time $t$**
$$v_y(t) = v_{0y} - g t \implies -11.710 = 26.997 - 9.80 t$$
$$9.80 t = 26.997 + 11.710 = 38.707 \implies t = \frac{38.707}{9.80} = 3.9497\,\text{s} \approx 3.95\,\text{s}$$

---

### Solution 7.6
The trajectory equation including initial launch height $y_0$ is:
$$y(x) = y_0 + x \tan\theta - \frac{g x^2}{2 v_0^2 \cos^2\theta}$$

For the baseball to clear the fence, we require $y(D) \ge H$:
$$y_0 + D \tan\theta - \frac{g D^2}{2 v_0^2 \cos^2\theta} \ge H$$

Rearranging for $v_0^2$:
$$\frac{g D^2}{2 v_0^2 \cos^2\theta} \le y_0 + D \tan\theta - H$$
$$v_0^2 \ge \frac{g D^2}{2 \cos^2\theta \big(y_0 + D \tan\theta - H\big)}$$

Substitute the given numbers:
- $D = 95.0\,\text{m}$
- $H = 8.50\,\text{m}, y_0 = 1.00\,\text{m}$
- $\theta = 32.0^\circ \implies \tan(32.0^\circ) = 0.624869, \cos(32.0^\circ) = 0.848048 \implies \cos^2(32.0^\circ) = 0.719186$

Evaluate the denominator bracket:
$$y_0 + D \tan\theta - H = 1.00 + 95.0(0.624869) - 8.50 = 1.00 + 59.3626 - 8.50 = 51.8626\,\text{m}$$

Now compute $v_0^2$:
$$v_0^2 \ge \frac{9.80 \times (95.0)^2}{2 \times 0.719186 \times 51.8626} = \frac{9.80 \times 9025.0}{1.43837 \times 51.8626} = \frac{88445.0}{74.598} = 1185.62\,\text{m}^2/\text{s}^2$$
$$v_0 \ge \sqrt{1185.62} = 34.433\,\text{m/s} \approx 34.4\,\text{m/s}$$

---

### Solution 7.7
**(a) Find the two launch angles:**
$$R = \frac{v_0^2 \sin(2\theta)}{g} \implies \sin(2\theta) = \frac{g R}{v_0^2}$$
$$\sin(2\theta) = \frac{9.80 \times 250.0}{(54.0)^2} = \frac{2450.0}{2916.0} = 0.840192$$
Taking the principal arcsine:
$$2\theta_1 = \arcsin(0.840192) = 57.161^\circ \implies \theta_1 = 28.58^\circ \approx 28.6^\circ$$
The complementary angle is:
$$2\theta_2 = 180^\circ - 57.161^\circ = 122.839^\circ \implies \theta_2 = 61.42^\circ \approx 61.4^\circ$$

**(b) Time difference:**
$$T_1 = \frac{2 v_0 \sin\theta_1}{g} = \frac{2 \times 54.0 \times \sin(28.58^\circ)}{9.80} = \frac{108.0 \times 0.47841}{9.80} = 5.272\,\text{s}$$
$$T_2 = \frac{2 v_0 \sin\theta_2}{g} = \frac{2 \times 54.0 \times \sin(61.42^\circ)}{9.80} = \frac{108.0 \times 0.87814}{9.80} = 9.677\,\text{s}$$
$$\Delta T = T_2 - T_1 = 9.677\,\text{s} - 5.272\,\text{s} = 4.405\,\text{s} \approx 4.41\,\text{s}$$

---

### Solution 7.8
**(a) Initial speeds for range $R = 800.0\,\text{m}$:**
$$R = \frac{v_0^2 \sin(2\theta)}{g} \implies v_0 = \sqrt{\frac{g R}{\sin(2\theta)}}$$
For Gun A ($\theta_A = 60.0^\circ$):
$$\sin(2 \times 60^\circ) = \sin(120^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$$
$$v_{0A} = \sqrt{\frac{9.80 \times 800.0}{0.866025}} = \sqrt{\frac{7840.0}{0.866025}} = \sqrt{9052.85} = 95.146\,\text{m/s} \approx 95.1\,\text{m/s}$$

For Gun B ($\theta_B = 30.0^\circ$):
$$\sin(2 \times 30^\circ) = \sin(60^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$$
$$v_{0B} = \sqrt{\frac{7840.0}{0.866025}} = 95.146\,\text{m/s} \approx 95.1\,\text{m/s}$$
Both guns require identical initial speeds ($v_{0A} = v_{0B} = 95.1\,\text{m/s}$).

**(b) Firing delay:**
$$T_A = \frac{2 v_{0A} \sin(60.0^\circ)}{g} = \frac{2 \times 95.146 \times 0.866025}{9.80} = \frac{164.798}{9.80} = 16.816\,\text{s}$$
$$T_B = \frac{2 v_{0B} \sin(30.0^\circ)}{g} = \frac{2 \times 95.146 \times 0.500000}{9.80} = \frac{95.146}{9.80} = 9.709\,\text{s}$$

Gun A has a much longer flight time ($16.82\,\text{s}$ vs $9.71\,\text{s}$). Therefore, **Gun A must be fired first**.
The time delay is:
$$\Delta t = T_A - T_B = 16.816\,\text{s} - 9.709\,\text{s} = 7.107\,\text{s} \approx 7.11\,\text{s}$$

---

### Solution 7.9
**(a) Minimum launch speed to reach $(x, y) = (40.0\,\text{m}, 30.0\,\text{m})$:**
Using the theorem derived in Section 7.4 / Example 7.8:
$$r = \sqrt{x^2 + y^2} = \sqrt{40.0^2 + 30.0^2} = \sqrt{1600 + 900} = \sqrt{2500} = 50.0\,\text{m}$$
The minimum speed satisfies:
$$v_{0,\text{min}}^2 = g (y + r) = 9.80 \times (30.0 + 50.0) = 9.80 \times 80.0 = 784.0\,\text{m}^2/\text{s}^2$$
$$v_{0,\text{min}} = \sqrt{784.0} = 28.00\,\text{m/s}$$

**(b) Required launch angle:**
$$\tan\theta = \frac{y + r}{x} = \frac{30.0 + 50.0}{40.0} = \frac{80.0}{40.0} = 2.000$$
$$\theta = \arctan(2.000) = 63.435^\circ \approx 63.4^\circ$$

---

### Solution 7.10
**Step 1: Intercept condition**
Let $T = \frac{2 v_0 \sin\theta}{g}$ be the time of flight of the shell.
Upon returning to ground level at time $T$, the horizontal position of the projectile is:
$$x_p(T) = \frac{v_0^2 \sin(2\theta)}{g}$$

The drone starts from $x_0 = 200.0\,\text{m}$ with zero initial velocity and constant acceleration $a_d = 2.50\,\text{m/s}^2$. Its position at time $T$ is:
$$x_d(T) = x_0 + \frac{1}{2} a_d T^2 = 200.0 + \frac{1}{2} a_d \left(\frac{2 v_0 \sin\theta}{g}\right)^2 = 200.0 + \frac{2 a_d v_0^2 \sin^2\theta}{g^2}$$

**Step 2: Equating positions**
$$x_p(T) = x_d(T) \implies \frac{v_0^2 \sin(2\theta)}{g} = 200.0 + \frac{2 a_d v_0^2 \sin^2\theta}{g^2}$$
Multiply by $g$:
$$v_0^2 \sin(2\theta) = 200.0 g + \frac{2 a_d v_0^2}{g} \sin^2\theta$$

Substitute the numerical values:
- $v_0 = 65.0\,\text{m/s} \implies v_0^2 = 4225.0$
- $200.0 g = 200.0 \times 9.80 = 1960.0$
- $\frac{2 a_d v_0^2}{g} = \frac{2 \times 2.50 \times 4225.0}{9.80} = \frac{21125.0}{9.80} = 2155.61$

The transcendental equation for $\theta$ is:
$$4225.0 \sin(2\theta) - 2155.61 \sin^2\theta - 1960.0 = 0$$

**Step 3: Root finding**
Let $f(\theta) = 4225.0 \sin(2\theta) - 2155.61 \sin^2\theta - 1960.0$.
- Test $\theta = 30.0^\circ$:
  $$\sin(60^\circ) = 0.866025, \quad \sin^2(30^\circ) = 0.25$$
  $$f(30^\circ) = 4225.0(0.866025) - 2155.61(0.25) - 1960.0 = 3658.96 - 538.90 - 1960.0 = +1160.06$$
- Test $\theta = 20.0^\circ$:
  $$\sin(40^\circ) = 0.642788, \quad \sin^2(20^\circ) = (0.342020)^2 = 0.116978$$
  $$f(20^\circ) = 4225.0(0.642788) - 2155.61(0.116978) - 1960.0 = 2715.78 - 252.16 - 1960.0 = +503.62$$
- Test $\theta = 15.0^\circ$:
  $$\sin(30^\circ) = 0.500000, \quad \sin^2(15^\circ) = (0.258819)^2 = 0.066987$$
  $$f(15^\circ) = 4225.0(0.500) - 2155.61(0.066987) - 1960.0 = 2112.50 - 144.40 - 1960.0 = +8.10$$
- Test $\theta = 14.5^\circ$:
  $$\sin(29^\circ) = 0.484810, \quad \sin^2(14.5^\circ) = (0.250380)^2 = 0.062690$$
  $$f(14.5^\circ) = 4225.0(0.484810) - 2155.61(0.062690) - 1960.0 = 2048.32 - 135.13 - 1960.0 = -46.81$$

Interpolating between $14.5^\circ$ and $15.0^\circ$:
$$\theta \approx 14.5 + 0.5 \times \frac{46.81}{46.81 + 8.10} = 14.5 + 0.5 \times \frac{46.81}{54.91} = 14.5 + 0.426 = 14.93^\circ \approx 14.9^\circ$$

Verifying at $\theta = 14.93^\circ$:
$$\sin(29.86^\circ) = 0.49791 \implies 4225.0 \times 0.49791 = 2103.67$$
$$\sin(14.93^\circ) = 0.25764 \implies \sin^2 = 0.06638 \implies 2155.61 \times 0.06638 = 143.09$$
$$f(14.93^\circ) = 2103.67 - 143.09 - 1960.0 = +0.58 \approx 0$$

Thus, the low-angle solution is $\theta \approx 14.9^\circ$.
(A high-angle solution also exists at $\theta \approx 57.5^\circ$).
