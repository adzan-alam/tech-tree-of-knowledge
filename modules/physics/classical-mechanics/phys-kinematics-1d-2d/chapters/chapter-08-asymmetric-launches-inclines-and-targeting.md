# CHAPTER 08: Asymmetric Launches, Inclines, & Inverse Ballistic Targeting

> "To hit a mark on an elevated terrace or across a falling ravine, the gunner cannot rely on the simple symmetries of the level plain. Nature demands that the curvature of the earth and the slope of the hill be woven directly into the geometry of the shot."
> — **Tartaglia**, *Nova Scientia* (1537)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Formulate and solve the kinematics of asymmetric ballistic launches where initial elevation $y_0$ differs from terminal impact elevation $y_f$.
2. Derive from first principles the exact analytical formula for the time of flight and horizontal range from an elevated cliff or depression.
3. Prove why the maximum-range launch angle drops below $45^\circ$ when launching from an elevated cliff ($\theta^* < 45^\circ$), and derive the closed-form equation for $\theta^*(h, v_0)$.
4. Transform equations of motion into tilted Cartesian coordinate frames $(x', y')$ aligned with an inclined plane of slope angle $\alpha$.
5. Derive the exact range along an incline, proving that the optimal launch angle bisects the angle between the incline and the local vertical: $\theta^* = 45^\circ + \frac{\alpha}{2}$.
6. Construct the **Inverse Ballistic Targeting Solver**, calculating the exact launch angles required to strike an arbitrary spatial coordinate $(X, Y)$ with a given muzzle speed $v_0$.
7. Derive the equation of the **Parabola of Safety** (the bounding envelope of all reachable targets for a given launch energy).

---

## 8.1 The Reality of Asymmetric Elevation ($y_0 \ne y_f$)

In elementary textbooks, projectile motion is almost universally introduced on a perfectly level plane where $y_0 = y_f = 0$. In real-world engineering, naval gunnery, aerospace planetary descent, and planetary rover operations, this symmetric ideal is the rare exception.

Consider a projectile launched from an elevated platform, cliff, or rooftop at height $y_0 = +h$ above the surrounding plain, landing at ground level $y_f = 0$.

```
           Launch (0, h)
             |\_  v_0 at angle theta
             |  \
             |   * * * Apex: (x_apex, h + H)
             |       *
             |         *
 +h ---------+          *
 |           |            *
 |   Cliff   |             *
 |           |              *
 |           |               *
(0,0) -------+----------------*----> Ground (y = 0)
                              Impact (R, 0)
```

### The Asymmetric Time of Flight
The vertical motion is governed by:
$$y(t) = h + (v_0 \sin\theta)\,t - \frac{1}{2} g t^2$$

Setting $y(T) = 0$ at impact yields a quadratic equation in flight time $T$:
$$\frac{1}{2} g T^2 - (v_0 \sin\theta)\,T - h = 0$$

Applying the quadratic formula:
$$T = \frac{v_0 \sin\theta \pm \sqrt{(v_0 \sin\theta)^2 - 4(g/2)(-h)}}{2(g/2)} = \frac{v_0 \sin\theta \pm \sqrt{v_0^2 \sin^2\theta + 2 g h}}{g}$$

Because physical time must be strictly positive ($T > 0$) and $\sqrt{v_0^2 \sin^2\theta + 2gh} > v_0 \sin\theta$, we discard the negative root. The unique physical **asymmetric time of flight** is:
$$T_{\text{flight}} = \frac{v_0 \sin\theta + \sqrt{v_0^2 \sin^2\theta + 2 g h}}{g}$$

Notice the physical structure of this equation:
- If $h = 0$ (level ground), the square root reduces to $\sqrt{v_0^2 \sin^2\theta} = v_0 \sin\theta$, yielding $T = \frac{2 v_0 \sin\theta}{g}$, recovering our Chapter 07 result.
- If $\theta = 0^\circ$ (horizontal launch), $\sin\theta = 0$, giving $T = \sqrt{\frac{2h}{g}}$.
- If $h > 0$, the flight time is strictly greater than the level-ground flight time because the projectile continues to fall through the additional vertical drop $h$.

### Asymmetric Range
The horizontal range $R$ from the base of the cliff to the impact point is:
$$R(\theta) = v_{0x} T = (v_0 \cos\theta) \left[\frac{v_0 \sin\theta + \sqrt{v_0^2 \sin^2\theta + 2 g h}}{g}\right]$$

---

## 8.2 The Optimal Launch Angle from an Elevation ($\theta^* < 45^\circ$)

A fundamental physical question arises: **What launch angle $\theta$ maximizes the horizontal range $R$ when launching from an elevated height $h$?**

On level ground, the optimal angle is $\theta = 45^\circ$, which equally balances horizontal speed ($v_0 \cos\theta$) and vertical hang-time ($v_0 \sin\theta$).
However, when launched from a cliff of height $h$, **gravity grants the projectile "free" hang-time** during its fall from $y = h$ down to $y = 0$. Because the projectile will remain in the air longer regardless of its vertical launch velocity, it is advantageous to reallocate a greater portion of the initial velocity vector to the horizontal axis.

Therefore, the optimal angle must be strictly less than $45^\circ$:
$$\theta^* < 45^\circ$$

### Analytical Derivation of $\theta^*$
We seek to maximize $R(\theta)$. Recall the Cartesian trajectory equation:
$$y(x) = h + x \tan\theta - \frac{g x^2}{2 v_0^2 \cos^2\theta}$$

At impact, $y = 0$ and $x = R$. Using the identity $\frac{1}{\cos^2\theta} = 1 + \tan^2\theta$:
$$0 = h + R \tan\theta - \frac{g R^2}{2 v_0^2} (1 + \tan^2\theta)$$

Let $T = \tan\theta$ and $k = \frac{g}{2 v_0^2}$. Then:
$$k R^2 T^2 - R T + (k R^2 - h) = 0$$

Solving for $R$ in terms of $T$, or differentiating implicitly with respect to $T$ and setting $\frac{dR}{dT} = 0$:
$$0 = \frac{d}{dT}\left[ h + R T - k R^2 (1 + T^2) \right] = R + T \frac{dR}{dT} - 2 k R \frac{dR}{dT} (1 + T^2) - 2 k R^2 T$$

Setting the optimality condition $\frac{dR}{dT} = 0$:
$$R - 2 k R^2 T = 0 \implies 1 - 2 k R T = 0 \implies R = \frac{1}{2 k T} = \frac{v_0^2}{g \tan\theta}$$

Substitute this optimal relationship $R = \frac{v_0^2}{g T}$ back into the trajectory equation:
$$h + \left(\frac{v_0^2}{g T}\right) T - \frac{g}{2 v_0^2} \left(\frac{v_0^2}{g T}\right)^2 (1 + T^2) = 0$$
$$h + \frac{v_0^2}{g} - \frac{v_0^2}{2 g T^2} (1 + T^2) = 0$$
$$h + \frac{v_0^2}{g} - \frac{v_0^2}{2 g T^2} - \frac{v_0^2}{2 g} = 0$$
$$h + \frac{v_0^2}{2 g} = \frac{v_0^2}{2 g T^2}$$

Multiply through by $\frac{2g}{v_0^2}$:
$$\frac{2 g h}{v_0^2} + 1 = \frac{1}{T^2} \implies T^2 = \tan^2\theta^* = \frac{1}{1 + \frac{2 g h}{v_0^2}}$$

Taking the square root:
$$\tan\theta^* = \frac{1}{\sqrt{1 + \frac{2 g h}{v_0^2}}}$$

Using the trigonometric identity $\sin\theta = \frac{\tan\theta}{\sqrt{1 + \tan^2\theta}}$:
$$\sin^2\theta^* = \frac{\tan^2\theta^*}{1 + \tan^2\theta^*} = \frac{\frac{1}{1 + 2gh/v_0^2}}{1 + \frac{1}{1 + 2gh/v_0^2}} = \frac{1}{2 + \frac{2 g h}{v_0^2}}$$

Thus, we obtain the celebrated **Closed-Form Formula for Optimal Asymmetric Launch Angle**:
$$\theta^* = \arcsin\left(\frac{1}{\sqrt{2 + \frac{2 g h}{v_0^2}}}\right)$$

### Limiting Sanity Checks:
1. **Level ground ($h = 0$):**
   $$\theta^* = \arcsin\left(\frac{1}{\sqrt{2 + 0}}\right) = \arcsin\left(\frac{1}{\sqrt{2}}\right) = 45^\circ$$
   Exactly matches the classic result!
2. **Infinite cliff height ($h \to \infty$):**
   $$\theta^* \to \arcsin(0) = 0^\circ$$
   As the cliff becomes infinitely tall, the optimal launch is purely horizontal!

---

## 8.3 Ballistics on an Inclined Plane

Consider launching a projectile across ground that slopes upward or downward at a constant angle $\alpha$ relative to the horizontal.

```
       y' (Normal to incline)
       ^       /  x' (Parallel to incline)
       |      /
       |     / * * Trajectory
       |    / *     *
       |   / *        *
       |  / *           *
       | / *              *
       |/ *                 * Impact on incline: (d, 0) in tilted frame
       +----------------------- Incline at angle alpha
      /  \
     /    \ g (straight down)
```

### The Rotated Coordinate Method
Attempting to solve incline ballistics in standard $(x, y)$ coordinates requires finding the intersection of a parabola with an inclined line $y = x \tan\alpha$. While valid, it is mathematically clumsy.

The elegant, sovereign method rotates the coordinate axes by angle $\alpha$:
- $+x'$ points **up along the surface of the incline**.
- $+y'$ points **perpendicular to the incline** (normal direction).

In this rotated frame:
- The initial launch angle relative to the incline surface is $\beta = \theta - \alpha$.
- The initial velocity components are:
  $$v_{0x'} = v_0 \cos(\theta - \alpha) = v_0 \cos\beta$$
  $$v_{0y'} = v_0 \sin(\theta - \alpha) = v_0 \sin\beta$$

Now decompose the acceleration of gravity $\vec{g}$ (which acts straight down):
- Component parallel to incline: $a_{x'} = -g \sin\alpha$
- Component normal to incline: $a_{y'} = -g \cos\alpha$

### Equations of Motion in the Rotated Frame
$$\begin{aligned}
x'(t) &= (v_0 \cos\beta)\,t - \frac{1}{2} (g \sin\alpha)\,t^2 \\
y'(t) &= (v_0 \sin\beta)\,t - \frac{1}{2} (g \cos\alpha)\,t^2
\end{aligned}$$

Notice the breathtaking elegance of this formulation! The condition for striking the incline is simply that the normal coordinate vanishes:
$$y'(T) = 0$$

$$(v_0 \sin\beta)\,T - \frac{1}{2} (g \cos\alpha)\,T^2 = 0$$

Factoring out $T \ne 0$:
$$T = \frac{2 v_0 \sin\beta}{g \cos\alpha} = \frac{2 v_0 \sin(\theta - \alpha)}{g \cos\alpha}$$

### Range Along the Incline ($d_{\text{incline}}$)
The distance traveled along the face of the incline is $d = x'(T)$:
$$d = (v_0 \cos\beta) T - \frac{1}{2} (g \sin\alpha) T^2$$

Substitute $T = \frac{2 v_0 \sin\beta}{g \cos\alpha}$:
$$d = (v_0 \cos\beta)\left(\frac{2 v_0 \sin\beta}{g \cos\alpha}\right) - \frac{1}{2} (g \sin\alpha)\left(\frac{2 v_0 \sin\beta}{g \cos\alpha}\right)^2$$
$$d = \frac{2 v_0^2 \sin\beta \cos\beta}{g \cos\alpha} - \frac{2 v_0^2 \sin\alpha \sin^2\beta}{g \cos^2\alpha}$$
$$d = \frac{2 v_0^2 \sin\beta}{g \cos^2\alpha} \big[ \cos\beta \cos\alpha - \sin\beta \sin\alpha \big]$$

Using the cosine addition identity $\cos(\beta + \alpha) = \cos\beta \cos\alpha - \sin\beta \sin\alpha$:
$$d = \frac{2 v_0^2 \sin\beta \cos(\beta + \alpha)}{g \cos^2\alpha}$$

Recall that $\beta = \theta - \alpha$, so $\beta + \alpha = \theta$:
$$d = \frac{2 v_0^2 \sin(\theta - \alpha) \cos\theta}{g \cos^2\alpha}$$

Using the product-to-sum identity $2 \sin A \cos B = \sin(A + B) + \sin(A - B)$ with $A = \theta - \alpha$ and $B = \theta$:
$$2 \sin(\theta - \alpha) \cos\theta = \sin(2\theta - \alpha) + \sin(-\alpha) = \sin(2\theta - \alpha) - \sin\alpha$$

Thus, we obtain the **Universal Incline Range Formula**:
$$d(\theta, \alpha) = \frac{v_0^2}{g \cos^2\alpha} \Big[ \sin(2\theta - \alpha) - \sin\alpha \Big]$$

### The Optimal Launch Angle on an Incline
In the range formula, the only term containing the launch angle $\theta$ is $\sin(2\theta - \alpha)$.
To maximize $d$, we must set this sine factor to its absolute maximum of $+1$:
$$\sin(2\theta^* - \alpha) = 1 \implies 2\theta^* - \alpha = 90^\circ$$
$$2\theta^* = 90^\circ + \alpha \implies \theta^* = 45^\circ + \frac{\alpha}{2}$$

**The Incline Bisector Theorem:** The optimal launch angle on an incline of slope $\alpha$ bisects the angle between the incline surface and the vertical!
- For an uphill slope $\alpha = +30^\circ$: $\theta^* = 45^\circ + 15^\circ = 60^\circ$.
- For a downhill slope $\alpha = -30^\circ$: $\theta^* = 45^\circ - 15^\circ = 30^\circ$.
- For level ground $\alpha = 0^\circ$: $\theta^* = 45^\circ + 0^\circ = 45^\circ$.

---

## 8.4 The Inverse Ballistic Targeting Solver

In military ballistics, orbital insertion, fire-control systems, and automated defense turrets, the forward problem ("where does a shell fired at angle $\theta$ land?") is rarely what an operator needs. The critical engineering question is the **inverse problem**:

> **Given a target located at arbitrary spatial coordinates $(X, Y)$ and a weapon with fixed muzzle velocity $v_0$, what launch angle(s) $\theta$ will hit the target?**

```
 y
 ^
 |                Target: (X, Y)
 |                  *
 |                / | \
 |    High Angle /  |  \ Low Angle
 |              /   |   \
 |             /    |    \
-+------------*-----+-----*----> x
 (0,0) Launcher
```

### Derivation of the Targeting Equation
Recall the trajectory equation formulated in terms of $T = \tan\theta$:
$$Y = X T - \frac{g X^2}{2 v_0^2} (1 + T^2)$$

Rearranging into standard quadratic form $a T^2 + b T + c = 0$:
$$\left(\frac{g X^2}{2 v_0^2}\right) T^2 - X T + \left(Y + \frac{g X^2}{2 v_0^2}\right) = 0$$

Let the characteristic ballistic length parameter be:
$$k = \frac{g X^2}{2 v_0^2}$$

Then the quadratic equation simplifies to:
$$k T^2 - X T + (Y + k) = 0$$

Applying the quadratic formula for $T = \tan\theta$:
$$T = \frac{X \pm \sqrt{X^2 - 4 k (Y + k)}}{2 k}$$

Multiply numerator and denominator by $\frac{v_0^2}{g X}$:
$$T = \frac{v_0^2 \pm \sqrt{v_0^4 - 2 g Y v_0^2 - g^2 X^2}}{g X}$$

### The Three Targeting Regimes:
1. **$\Delta > 0$ (Two Real Solutions):**
   The target is well within range. There exist two distinct launch angles:
   $$\theta_{\text{low}} = \arctan\left(\frac{v_0^2 - \sqrt{\Delta}}{g X}\right), \quad \theta_{\text{high}} = \arctan\left(\frac{v_0^2 + \sqrt{\Delta}}{g X}\right)$$
   $\theta_{\text{low}}$ provides direct, high-speed fire. $\theta_{\text{high}}$ provides high-arc plunging fire over obstacles.

2. **$\Delta = 0$ (Unique Solution):**
   The target lies precisely on the maximum boundary of the weapon's reach. There is exactly one launch angle:
   $$\tan\theta = \frac{v_0^2}{g X}$$

3. **$\Delta < 0$ (Zero Real Solutions):**
   The target is physically out of reach for muzzle speed $v_0$. The shells will fall short or low regardless of launch angle.

### The Parabola of Safety (The Bounding Envelope)
Setting $\Delta = 0$ defines the boundary between reachable and unreachable space:
$$v_0^4 - 2 g Y v_0^2 - g^2 X^2 = 0$$

Solving for $Y$ as a function of $X$:
$$2 g v_0^2 Y = v_0^4 - g^2 X^2 \implies Y(X) = \frac{v_0^2}{2g} - \frac{g}{2 v_0^2} X^2$$

This boundary is itself a downward-opening parabola known as the **Bounding Trajectory** or **Parabola of Safety**. Any target located strictly outside this envelope cannot be struck by the projectile under any circumstances.

---

## 8.5 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 8.1: Asymmetric Launch from a Coastal Cliff
**Problem:** A coastal artillery gun on a cliff $h = 65.0\,\text{m}$ above sea level fires a shell with muzzle speed $v_0 = 140.0\,\text{m/s}$ at an angle $\theta = 30.0^\circ$ above the horizontal.
1. Calculate the total time of flight before striking the ocean.
2. Calculate the horizontal range $R$ from the cliff base.
3. Calculate the impact speed and impact angle.

#### Solution
**Step 1: Velocity components**
$$v_{0x} = 140.0 \cos(30.0^\circ) = 140.0 \times \frac{\sqrt{3}}{2} = 121.244\,\text{m/s}$$
$$v_{0y} = 140.0 \sin(30.0^\circ) = 140.0 \times 0.500 = 70.000\,\text{m/s}$$

**Step 2: Time of flight**
Using the asymmetric flight time formula:
$$T = \frac{v_{0y} + \sqrt{v_{0y}^2 + 2 g h}}{g}$$
$$v_{0y}^2 = (70.0)^2 = 4900.0\,\text{m}^2/\text{s}^2$$
$$2 g h = 2 \times 9.80 \times 65.0 = 1274.0\,\text{m}^2/\text{s}^2$$
$$\sqrt{v_{0y}^2 + 2 g h} = \sqrt{4900.0 + 1274.0} = \sqrt{6174.0} = 78.575\,\text{m/s}$$
$$T = \frac{70.000 + 78.575}{9.80} = \frac{148.575}{9.80} = 15.161\,\text{s} \approx 15.16\,\text{s}$$

**Step 3: Horizontal range**
$$R = v_{0x} T = 121.244\,\text{m/s} \times 15.161\,\text{s} = 1838.2\,\text{m} \approx 1.84\,\text{km}$$

**Step 4: Impact velocity**
Horizontal component: $v_x = 121.244\,\text{m/s}$.
Vertical component:
$$v_y = v_{0y} - g T = 70.000 - (9.80 \times 15.161) = 70.000 - 148.578 = -78.578\,\text{m/s}$$
Impact speed (Energy check):
$$v = \sqrt{v_0^2 + 2 g h} = \sqrt{(140.0)^2 + 1274.0} = \sqrt{19600 + 1274} = \sqrt{20874} = 144.478\,\text{m/s} \approx 144.5\,\text{m/s}$$
Vector check: $\sqrt{(121.244)^2 + (-78.578)^2} = \sqrt{14700 + 6174.5} = \sqrt{20874.5} = 144.48\,\text{m/s}$. Exact match.
Impact angle:
$$\phi = \arctan\left(\frac{-78.578}{121.244}\right) = \arctan(-0.6481) = -32.95^\circ \approx -33.0^\circ$$

---

### Example 8.2: Calculating the Optimal Angle for a Cliff Launch
**Problem:** For the cliff gun in Example 8.1 ($h = 65.0\,\text{m}, v_0 = 140.0\,\text{m/s}$):
1. Compute the exact launch angle $\theta^*$ that maximizes horizontal range.
2. Calculate this maximum range $R_{\text{max}}$.
3. Compare with the range obtained at the conventional $45.0^\circ$ angle.

#### Solution
**Step 1: Compute $\theta^*$**
$$\frac{2 g h}{v_0^2} = \frac{2 \times 9.80 \times 65.0}{(140.0)^2} = \frac{1274.0}{19600.0} = 0.06500$$
Using our closed-form theorem:
$$\sin\theta^* = \frac{1}{\sqrt{2 + \frac{2 g h}{v_0^2}}} = \frac{1}{\sqrt{2 + 0.06500}} = \frac{1}{\sqrt{2.06500}} = \frac{1}{1.43701} = 0.69589$$
$$\theta^* = \arcsin(0.69589) = 44.098^\circ \approx 44.1^\circ$$
As predicted, the optimal angle is less than $45^\circ$.

**Step 2: Maximum range at $\theta^* = 44.1^\circ$**
$$\cos(44.098^\circ) = 0.71815, \quad \sin(44.098^\circ) = 0.69589$$
$$v_{0x} = 140.0 \times 0.71815 = 100.541\,\text{m/s}$$
$$v_{0y} = 140.0 \times 0.69589 = 97.425\,\text{m/s}$$
$$T = \frac{97.425 + \sqrt{(97.425)^2 + 1274.0}}{9.80} = \frac{97.425 + \sqrt{9491.6 + 1274.0}}{9.80} = \frac{97.425 + 103.757}{9.80} = \frac{201.182}{9.80} = 20.529\,\text{s}$$
$$R_{\text{max}} = 100.541 \times 20.529 = 2064.0\,\text{m}$$

**Step 3: Compare with $\theta = 45.0^\circ$**
At $45.0^\circ$: $v_{0x} = v_{0y} = 140.0 / \sqrt{2} = 98.995\,\text{m/s}$.
$$T_{45} = \frac{98.995 + \sqrt{(98.995)^2 + 1274.0}}{9.80} = \frac{98.995 + \sqrt{9800.0 + 1274.0}}{9.80} = \frac{98.995 + 105.233}{9.80} = \frac{204.228}{9.80} = 20.840\,\text{s}$$
$$R_{45} = 98.995 \times 20.840 = 2063.0\,\text{m}$$
The optimal angle gains an extra meter of distance while achieving a lower, faster trajectory.

---

### Example 8.3: Downward-Angled Depressed Launch
**Problem:** An aircraft diving at an angle of $20.0^\circ$ below the horizontal releases a telemetry pod at an altitude of $h = 320.0\,\text{m}$ with a speed of $v_0 = 80.0\,\text{m/s}$.
1. State the initial velocity components.
2. Determine the time of flight until ground impact.
3. Determine the horizontal distance traveled from release to impact.

#### Solution
**Step 1: Velocity components**
Because the aircraft is diving, $\theta = -20.0^\circ$:
$$v_{0x} = v_0 \cos(-20.0^\circ) = 80.0 \times 0.939693 = 75.175\,\text{m/s}$$
$$v_{0y} = v_0 \sin(-20.0^\circ) = 80.0 \times (-0.342020) = -27.362\,\text{m/s}$$

**Step 2: Time of flight**
The vertical position equation is:
$$y(t) = 320.0 - 27.362 t - 4.90 t^2 = 0$$
$$4.90 t^2 + 27.362 t - 320.0 = 0$$
Using the quadratic formula:
$$t = \frac{-27.362 + \sqrt{(27.362)^2 - 4(4.90)(-320.0)}}{2(4.90)} = \frac{-27.362 + \sqrt{748.68 + 6272.0}}{9.80}$$
$$t = \frac{-27.362 + \sqrt{7020.68}}{9.80} = \frac{-27.362 + 83.789}{9.80} = \frac{56.427}{9.80} = 5.758\,\text{s} \approx 5.76\,\text{s}$$

**Step 3: Horizontal distance**
$$x = v_{0x} t = 75.175\,\text{m/s} \times 5.758\,\text{s} = 432.86\,\text{m} \approx 433\,\text{m}$$

---

### Example 8.4: Uphill Incline Range Calculation
**Problem:** A mortar shell is fired up an inclined hillside sloping at $\alpha = 25.0^\circ$ relative to the horizontal. The launch speed is $v_0 = 60.0\,\text{m/s}$ at an angle of $\theta = 55.0^\circ$ above the horizontal.
1. Determine the flight time before the shell strikes the hill.
2. Calculate the distance $d$ traveled along the face of the hill.
3. Determine the vertical and horizontal coordinates of the impact point.

#### Solution
**Step 1: Time of flight via rotated frame**
The angle relative to the slope is:
$$\beta = \theta - \alpha = 55.0^\circ - 25.0^\circ = 30.0^\circ$$
The normal acceleration component is:
$$a_{y'} = g \cos\alpha = 9.80 \cos(25.0^\circ) = 9.80 \times 0.906308 = 8.8818\,\text{m/s}^2$$
The normal launch velocity is:
$$v_{0y'} = v_0 \sin\beta = 60.0 \sin(30.0^\circ) = 60.0 \times 0.500 = 30.000\,\text{m/s}$$
Flight time:
$$T = \frac{2 v_{0y'}}{a_{y'}} = \frac{2 \times 30.000}{8.8818} = \frac{60.000}{8.8818} = 6.7554\,\text{s} \approx 6.76\,\text{s}$$

**Step 2: Incline range $d$**
Method A (Rotated frame):
$$a_{x'} = g \sin\alpha = 9.80 \sin(25.0^\circ) = 9.80 \times 0.422618 = 4.1417\,\text{m/s}^2$$
$$v_{0x'} = v_0 \cos\beta = 60.0 \cos(30.0^\circ) = 60.0 \times 0.866025 = 51.9615\,\text{m/s}$$
$$d = v_{0x'} T - \frac{1}{2} a_{x'} T^2 = 51.9615(6.7554) - 0.5(4.1417)(6.7554)^2$$
$$d = 351.021 - 2.07085(45.6354) = 351.021 - 94.504 = 256.517\,\text{m} \approx 256.5\,\text{m}$$

Method B (Universal Incline Formula):
$$d = \frac{v_0^2}{g \cos^2\alpha} \big[ \sin(2\theta - \alpha) - \sin\alpha \big]$$
$$2\theta - \alpha = 2(55.0^\circ) - 25.0^\circ = 110.0^\circ - 25.0^\circ = 85.0^\circ$$
$$\sin(85.0^\circ) - \sin(25.0^\circ) = 0.996195 - 0.422618 = 0.573577$$
$$\cos^2(25.0^\circ) = (0.906308)^2 = 0.821394$$
$$d = \frac{(60.0)^2 \times 0.573577}{9.80 \times 0.821394} = \frac{3600 \times 0.573577}{8.04966} = \frac{2064.88}{8.04966} = 256.518\,\text{m}$$
Both methods produce perfect numerical concordance.

**Step 3: Cartesian coordinates of impact**
$$x = d \cos\alpha = 256.52 \cos(25.0^\circ) = 256.52 \times 0.906308 = 232.48\,\text{m}$$
$$y = d \sin\alpha = 256.52 \sin(25.0^\circ) = 256.52 \times 0.422618 = 108.41\,\text{m}$$

---

### Example 8.5: Maximum Range on an Incline
**Problem:** For the hillside in Example 8.4 ($\alpha = 25.0^\circ, v_0 = 60.0\,\text{m/s}$):
1. Determine the optimal launch angle $\theta^*$ to achieve maximum range up the hill.
2. Calculate the maximum distance $d_{\text{max}}$ achievable up the slope.

#### Solution
**Step 1: Optimal launch angle**
By the Incline Bisector Theorem:
$$\theta^* = 45.0^\circ + \frac{\alpha}{2} = 45.0^\circ + \frac{25.0^\circ}{2} = 45.0^\circ + 12.5^\circ = 57.5^\circ$$

**Step 2: Maximum distance**
In the universal formula, $\sin(2\theta^* - \alpha) = \sin(115.0^\circ - 25.0^\circ) = \sin(90.0^\circ) = 1.000$:
$$d_{\text{max}} = \frac{v_0^2}{g \cos^2\alpha} [1 - \sin\alpha] = \frac{v_0^2 (1 - \sin\alpha)}{g (1 - \sin^2\alpha)} = \frac{v_0^2}{g (1 + \sin\alpha)}$$

Notice the stunning algebraic simplification!
$$1 + \sin(25.0^\circ) = 1 + 0.422618 = 1.422618$$
$$d_{\text{max}} = \frac{(60.0)^2}{9.80 \times 1.422618} = \frac{3600.0}{13.94166} = 258.22\,\text{m}$$

Compare this with Example 8.4 where $\theta = 55.0^\circ$ yielded $256.52\,\text{m}$. Setting $\theta = 57.5^\circ$ yields the true theoretical maximum of $258.22\,\text{m}$.

---

### Example 8.6: Inverse Targeting Solver (Reachable Target with Dual Angles)
**Problem:** An automated point-defense railgun at $(0,0)$ fires with muzzle speed $v_0 = 100.0\,\text{m/s}$. A reconnaissance drone hovers stationary at $(X, Y) = (600.0\,\text{m}, 200.0\,\text{m})$.
1. Determine whether the drone is within firing range.
2. If reachable, calculate both the low-angle and high-angle firing solutions.
3. Compute the time of flight for each solution.

#### Solution
**Step 1: Feasibility check**
Calculate the characteristic parameter $k$:
$$k = \frac{g X^2}{2 v_0^2} = \frac{9.80 \times (600.0)^2}{2 \times (100.0)^2} = \frac{9.80 \times 360000}{20000} = \frac{3528000}{20000} = 176.40\,\text{m}$$

The quadratic targeting discriminant is:
$$\Delta = X^2 - 4 k (Y + k)$$
$$Y + k = 200.0 + 176.40 = 376.40\,\text{m}$$
$$4 k (Y + k) = 4 \times 176.40 \times 376.40 = 705.60 \times 376.40 = 265587.84\,\text{m}^2$$
$$X^2 = (600.0)^2 = 360000\,\text{m}^2$$
$$\Delta = 360000 - 265587.84 = 94412.16\,\text{m}^2 > 0$$
Since $\Delta > 0$, the drone is inside the envelope and two valid launch solutions exist.

**Step 2: Solve for launch angles**
$$\sqrt{\Delta} = \sqrt{94412.16} = 307.2656\,\text{m}$$
$$T = \tan\theta = \frac{X \pm \sqrt{\Delta}}{2 k} = \frac{600.0 \pm 307.2656}{2 \times 176.40} = \frac{600.0 \pm 307.2656}{352.80}$$

Low Angle Solution:
$$T_{\text{low}} = \frac{600.0 - 307.2656}{352.80} = \frac{292.7344}{352.80} = 0.829746$$
$$\theta_{\text{low}} = \arctan(0.829746) = 39.686^\circ \approx 39.7^\circ$$

High Angle Solution:
$$T_{\text{high}} = \frac{600.0 + 307.2656}{352.80} = \frac{907.2656}{352.80} = 2.571615$$
$$\theta_{\text{high}} = \arctan(2.571615) = 68.747^\circ \approx 68.7^\circ$$

**Step 3: Times of flight**
Since $x = v_{0x} t \implies t = \frac{X}{v_0 \cos\theta}$:
For $\theta_{\text{low}} = 39.686^\circ$:
$$\cos(39.686^\circ) = 0.76955 \implies t_{\text{low}} = \frac{600.0}{100.0 \times 0.76955} = 7.797\,\text{s} \approx 7.80\,\text{s}$$
For $\theta_{\text{high}} = 68.747^\circ$:
$$\cos(68.747^\circ) = 0.36248 \implies t_{\text{high}} = \frac{600.0}{100.0 \times 0.36248} = 16.553\,\text{s} \approx 16.55\,\text{s}$$
The low-angle shot intercepts the target in less than half the time of the high-angle shot.

---

### Example 8.7: Minimum Velocity to Reach a Spatial Point
**Problem:** For the hovering drone in Example 8.6 located at $(X, Y) = (600.0\,\text{m}, 200.0\,\text{m})$, find:
1. The absolute minimum muzzle velocity $v_{0,\text{min}}$ capable of reaching the drone.
2. The single launch angle required at this minimum speed.

#### Solution
**Step 1: Minimum velocity derivation**
At minimum launch velocity, the discriminant vanishes identically ($\Delta = 0$):
$$v_0^4 - 2 g Y v_0^2 - g^2 X^2 = 0$$
Using the quadratic formula for $v_0^2$:
$$v_0^2 = \frac{2 g Y + \sqrt{4 g^2 Y^2 - 4(1)(-g^2 X^2)}}{2} = g \big( Y + \sqrt{X^2 + Y^2} \big)$$

Let $r = \sqrt{X^2 + Y^2}$ be the straight-line distance to the target:
$$r = \sqrt{(600.0)^2 + (200.0)^2} = \sqrt{360000 + 40000} = \sqrt{400000} = 632.456\,\text{m}$$
Then:
$$v_{0,\text{min}}^2 = 9.80 \times (200.0 + 632.456) = 9.80 \times 832.456 = 8158.065\,\text{m}^2/\text{s}^2$$
$$v_{0,\text{min}} = \sqrt{8158.065} = 90.322\,\text{m/s} \approx 90.3\,\text{m/s}$$

**Step 2: Required launch angle**
When $\Delta = 0$:
$$\tan\theta^* = \frac{X}{2 k} = \frac{v_0^2}{g X} = \frac{8158.065}{9.80 \times 600.0} = \frac{8158.065}{5880.0} = 1.387426$$
$$\theta^* = \arctan(1.387426) = 54.218^\circ \approx 54.2^\circ$$

---

### Example 8.8: Constructing the Parabola of Safety
**Problem:** An anti-aircraft battery fires shells at $v_0 = 250.0\,\text{m/s}$.
1. Formulate the equation of the Parabola of Safety (bounding envelope) $Y(X)$.
2. What is the maximum vertical ceiling directly above the battery ($X = 0$)?
3. What is the maximum horizontal ground range on flat terrain ($Y = 0$)?
4. An enemy jet flies horizontally at an altitude of $Y = 2200.0\,\text{m}$. What is the maximum horizontal distance $X$ from the battery at which the jet can be engaged?

#### Solution
**Step 1: Trajectory envelope equation**
$$Y(X) = \frac{v_0^2}{2g} - \frac{g}{2 v_0^2} X^2$$
Evaluate the constants:
$$\frac{v_0^2}{2g} = \frac{(250.0)^2}{2 \times 9.80} = \frac{62500.0}{19.60} = 3188.776\,\text{m}$$
$$\frac{g}{2 v_0^2} = \frac{9.80}{2 \times 62500.0} = \frac{9.80}{125000.0} = 7.840 \times 10^{-5}\,\text{m}^{-1}$$
Thus:
$$Y(X) = 3188.8 - 7.840 \times 10^{-5} X^2$$

**Step 2: Maximum vertical ceiling ($X = 0$)**
$$Y_{\text{max}} = Y(0) = 3188.8\,\text{m} \approx 3.19\,\text{km}$$

**Step 3: Maximum horizontal ground range ($Y = 0$)**
$$0 = 3188.776 - 7.840 \times 10^{-5} X^2 \implies X^2 = \frac{3188.776}{7.840 \times 10^{-5}} = 40673163\,\text{m}^2$$
$$X_{\text{ground}} = \sqrt{40673163} = 6377.55\,\text{m} \approx 6.38\,\text{km}$$
*Sanity Check:* $R_{\text{max}} = \frac{v_0^2}{g} = \frac{62500}{9.80} = 6377.55\,\text{m}$. Exact match.

**Step 4: Jet engagement window at $Y = 2200.0\,\text{m}$**
$$2200.0 = 3188.776 - 7.840 \times 10^{-5} X^2$$
$$7.840 \times 10^{-5} X^2 = 3188.776 - 2200.0 = 988.776$$
$$X^2 = \frac{988.776}{7.840 \times 10^{-5}} = 12611939\,\text{m}^2$$
$$X = \sqrt{12611939} = 3551.3\,\text{m} \approx 3.55\,\text{km}$$
The jet enters the engagement envelope when it approaches within $3.55\,\text{km}$ horizontal range.

---

### Example 8.9: Downhill Incline Fire
**Problem:** A cannon on a high ridge fires down a valley slope of $\alpha = -18.0^\circ$ (sloping downward). The initial velocity is $v_0 = 75.0\,\text{m/s}$ at an angle $\theta = +20.0^\circ$ above the horizontal.
1. Find the flight time until impact on the downward slope.
2. Calculate the distance $d$ measured along the downward slope.

#### Solution
**Step 1: Time of flight**
Relative angle:
$$\beta = \theta - \alpha = 20.0^\circ - (-18.0^\circ) = 38.0^\circ$$
Normal gravity component:
$$a_{y'} = g \cos(-18.0^\circ) = 9.80 \cos(18.0^\circ) = 9.80 \times 0.951057 = 9.32036\,\text{m/s}^2$$
Normal launch speed:
$$v_{0y'} = v_0 \sin\beta = 75.0 \sin(38.0^\circ) = 75.0 \times 0.615661 = 46.1746\,\text{m/s}$$
Time of flight:
$$T = \frac{2 v_{0y'}}{a_{y'}} = \frac{2 \times 46.1746}{9.32036} = \frac{92.3492}{9.32036} = 9.9083\,\text{s} \approx 9.91\,\text{s}$$

**Step 2: Distance along slope**
Using the universal incline formula with $\alpha = -18.0^\circ$:
$$d = \frac{v_0^2}{g \cos^2\alpha} \big[ \sin(2\theta - \alpha) - \sin\alpha \big]$$
$$2\theta - \alpha = 2(20.0^\circ) - (-18.0^\circ) = 40.0^\circ + 18.0^\circ = 58.0^\circ$$
$$\sin(58.0^\circ) - \sin(-18.0^\circ) = 0.848048 - (-0.309017) = 0.848048 + 0.309017 = 1.157065$$
$$\cos^2(18.0^\circ) = (0.951057)^2 = 0.904509$$
$$d = \frac{(75.0)^2 \times 1.157065}{9.80 \times 0.904509} = \frac{5625.0 \times 1.157065}{8.86419} = \frac{6508.49}{8.86419} = 734.25\,\text{m} \approx 734.3\,\text{m}$$

---

### Example 8.10: Clearing a Plateau Rim
**Problem:** A rover at $(0,0)$ must launch a communication antenna capsule over the crest of a plateau. The plateau edge is at $(x_1, y_1) = (80.0\,\text{m}, 25.0\,\text{m})$, and the flat plateau extends indefinitely to the right at height $y = 25.0\,\text{m}$. The capsule is launched with $v_0 = 35.0\,\text{m/s}$ at $\theta = 50.0^\circ$.
1. Does the capsule clear the rim at $x_1 = 80.0\,\text{m}$?
2. If it clears the rim, where on the plateau surface ($y = 25.0\,\text{m}$) does it land?

#### Solution
**Step 1: Check rim clearance**
Formulate trajectory equation:
$$v_{0x} = 35.0 \cos(50.0^\circ) = 35.0 \times 0.642788 = 22.4976\,\text{m/s}$$
$$v_{0y} = 35.0 \sin(50.0^\circ) = 35.0 \times 0.766044 = 26.8115\,\text{m/s}$$
$$t_{\text{rim}} = \frac{x_1}{v_{0x}} = \frac{80.0}{22.4976} = 3.5559\,\text{s}$$
Vertical position at rim:
$$y(t_{\text{rim}}) = v_{0y} t_{\text{rim}} - \frac{1}{2} g t_{\text{rim}}^2 = 26.8115(3.5559) - 4.90(3.5559)^2 = 95.339 - 61.958 = 33.381\,\text{m}$$
Since $y(80.0) = 33.38\,\text{m} > 25.0\,\text{m}$, the capsule clears the rim with a clearance margin of $+8.38\,\text{m}$.

**Step 2: Impact location on plateau ($y = 25.0\,\text{m}$)**
Set $y(t) = 25.0$:
$$26.8115 t - 4.90 t^2 = 25.0 \implies 4.90 t^2 - 26.8115 t + 25.0 = 0$$
Using the quadratic formula:
$$t = \frac{26.8115 \pm \sqrt{(26.8115)^2 - 4(4.90)(25.0)}}{9.80} = \frac{26.8115 \pm \sqrt{718.857 - 490.000}}{9.80} = \frac{26.8115 \pm \sqrt{228.857}}{9.80}$$
$$\sqrt{228.857} = 15.1280$$
The two roots are:
- $t_1 = \frac{26.8115 - 15.1280}{9.80} = \frac{11.6835}{9.80} = 1.192\,\text{s}$ (ascending through $25.0\,\text{m}$ before reaching the rim)
- $t_2 = \frac{26.8115 + 15.1280}{9.80} = \frac{41.9395}{9.80} = 4.2795\,\text{s}$ (descending onto the plateau surface after clearing the rim)

Horizontal impact position:
$$x_{\text{impact}} = v_{0x} t_2 = 22.4976\,\text{m/s} \times 4.2795\,\text{s} = 96.278\,\text{m} \approx 96.3\,\text{m}$$
The capsule lands on the plateau surface $16.3\,\text{m}$ beyond the rim ($96.3\,\text{m} - 80.0\,\text{m}$).

---

## 8.6 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 8.1 (Tier 1: Cliff Launch Basics)
A stone is thrown horizontally from the roof of a building $h = 44.1\,\text{m}$ tall with an initial speed of $v_0 = 15.0\,\text{m/s}$.
(a) How long does the stone remain in flight?
(b) How far from the base of the building does it hit the level street?
(c) What is the impact speed?

### Exercise 8.2 (Tier 1: Upward Angled Launch from a Platform)
A firework rocket is launched from an elevated launch pad $h = 20.0\,\text{m}$ above the ground with $v_0 = 30.0\,\text{m/s}$ at an angle $\theta = 45.0^\circ$.
(a) Calculate the time to reach the apex.
(b) Calculate the maximum height reached above ground level.
(c) Calculate the total flight time before reaching the ground.

### Exercise 8.3 (Tier 2: Optimal Cliff Launch Angle)
A projectile is fired from a cliff of height $h = 100.0\,\text{m}$ with a muzzle velocity $v_0 = 50.0\,\text{m/s}$.
(a) Compute the optimal launch angle $\theta^*$ that maximizes the horizontal range on the plain below.
(b) Calculate this maximum horizontal range $R_{\text{max}}$.

### Exercise 8.4 (Tier 2: Diving Airdrop)
A search-and-rescue plane flying at an altitude of $h = 250.0\,\text{m}$ dives at an angle of $15.0^\circ$ below the horizontal at a speed of $v_0 = 90.0\,\text{m/s}$, releasing an emergency medical container.
(a) What are the horizontal and vertical components of the container's velocity at the instant of release?
(b) How many seconds elapse before the container reaches the ground?
(c) What horizontal distance does the container cover during its descent?

### Exercise 8.5 (Tier 3: Incline Flight Time and Normal Apex)
A ball is launched up an inclined ramp with slope $\alpha = 20.0^\circ$. The launch velocity is $v_0 = 25.0\,\text{m/s}$ at an angle $\theta = 50.0^\circ$ relative to the horizontal.
(a) What is the initial velocity component perpendicular to the ramp?
(b) At what time does the ball reach its maximum perpendicular distance from the ramp?
(c) What is the total time of flight before landing on the ramp?

### Exercise 8.6 (Tier 3: Downhill Ski-Jump Kinematics)
A ski jumper leaves the takeoff ramp horizontally ($\theta = 0^\circ$) with a speed of $v_0 = 28.0\,\text{m/s}$. The landing hill below slopes downward at a constant angle of $\alpha = -35.0^\circ$. How far down the slope of the hill does the ski jumper land?

### Exercise 8.7 (Tier 4: Dual Targeting Solutions)
A cannon with muzzle speed $v_0 = 120.0\,\text{m/s}$ must strike an observation outpost located at coordinates $(X, Y) = (900.0\,\text{m}, 150.0\,\text{m})$.
(a) Calculate both the low-angle and high-angle firing solutions.
(b) Calculate the apex height for each trajectory.

### Exercise 8.8 (Tier 4: Optimal Incline Angle with Obstacle)
A golf player is at the base of a $15.0^\circ$ uphill fairway slope.
(a) What launch angle $\theta$ relative to the horizontal maximizes the distance the ball travels along the fairway?
(b) If the ball is struck at this optimal angle with $v_0 = 48.0\,\text{m/s}$, what distance along the slope does it achieve?

### Exercise 8.9 (Tier 5: Minimum Speed to Clear a Ridge)
A defensive battery needs to land a payload on top of a mountain plateau at $(X, Y) = (1500.0\,\text{m}, 800.0\,\text{m})$.
(a) Find the theoretical minimum launch speed $v_{0,\text{min}}$ capable of reaching this point.
(b) Find the corresponding launch angle $\theta$.

### Exercise 8.10 (Tier 5: The Parabola of Safety Envelope)
A surface-to-air missile site has an effective interceptor speed of $v_0 = 350.0\,\text{m/s}$.
(a) Write the mathematical equation for the bounding envelope of safety $Y(X)$.
(b) An enemy surveillance aircraft is cruising at an altitude of $Y = 5000.0\,\text{m}$. Over what horizontal span ($-X_{\text{max}} \le X \le X_{\text{max}}$) is the aircraft vulnerable to intercept?

---

## 8.7 Comprehensive Solutions to Chapter Exercises

---

### Solution 8.1
**(a) Flight time:**
Since launch is horizontal, $v_{0y} = 0$:
$$h = \frac{1}{2} g t^2 \implies t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2 \times 44.1\,\text{m}}{9.80\,\text{m/s}^2}} = \sqrt{\frac{88.2}{9.80}} = \sqrt{9.00} = 3.00\,\text{s}$$

**(b) Horizontal distance:**
$$x = v_{0x} t = 15.0\,\text{m/s} \times 3.00\,\text{s} = 45.0\,\text{m}$$

**(c) Impact speed:**
$$v_x = 15.0\,\text{m/s}$$
$$v_y = -g t = -9.80 \times 3.00 = -29.4\,\text{m/s}$$
$$v = \sqrt{v_x^2 + v_y^2} = \sqrt{(15.0)^2 + (-29.4)^2} = \sqrt{225.0 + 864.36} = \sqrt{1089.36} = 33.005\,\text{m/s} \approx 33.0\,\text{m/s}$$
(Energy check: $\sqrt{v_0^2 + 2gh} = \sqrt{225 + 864.36} = 33.0\,\text{m/s}$).

---

### Solution 8.2
**(a) Time to apex:**
$$v_{0y} = v_0 \sin(45.0^\circ) = 30.0 \times \frac{\sqrt{2}}{2} = 21.213\,\text{m/s}$$
$$t_{\text{apex}} = \frac{v_{0y}}{g} = \frac{21.213\,\text{m/s}}{9.80\,\text{m/s}^2} = 2.1646\,\text{s} \approx 2.16\,\text{s}$$

**(b) Maximum height above ground:**
$$H_{\text{launch}} = \frac{v_{0y}^2}{2g} = \frac{(21.213)^2}{19.60} = \frac{450.0}{19.60} = 22.959\,\text{m}$$
$$Y_{\text{max}} = h + H_{\text{launch}} = 20.0\,\text{m} + 22.959\,\text{m} = 42.959\,\text{m} \approx 43.0\,\text{m}$$

**(c) Total flight time:**
$$T = \frac{v_{0y} + \sqrt{v_{0y}^2 + 2 g h}}{g} = \frac{21.213 + \sqrt{450.0 + 2(9.80)(20.0)}}{9.80} = \frac{21.213 + \sqrt{450.0 + 392.0}}{9.80}$$
$$T = \frac{21.213 + \sqrt{842.0}}{9.80} = \frac{21.213 + 29.017}{9.80} = \frac{50.230}{9.80} = 5.1255\,\text{s} \approx 5.13\,\text{s}$$

---

### Solution 8.3
**(a) Optimal launch angle $\theta^*$:**
$$\frac{2 g h}{v_0^2} = \frac{2 \times 9.80 \times 100.0}{(50.0)^2} = \frac{1960.0}{2500.0} = 0.7840$$
$$\sin\theta^* = \frac{1}{\sqrt{2 + 0.7840}} = \frac{1}{\sqrt{2.7840}} = \frac{1}{1.66853} = 0.59933$$
$$\theta^* = \arcsin(0.59933) = 36.822^\circ \approx 36.8^\circ$$

**(b) Maximum range $R_{\text{max}}$:**
$$\cos(36.822^\circ) = 0.80050, \quad \sin(36.822^\circ) = 0.59933$$
$$v_{0x} = 50.0 \times 0.80050 = 40.025\,\text{m/s}$$
$$v_{0y} = 50.0 \times 0.59933 = 29.967\,\text{m/s}$$
$$T = \frac{29.967 + \sqrt{(29.967)^2 + 1960.0}}{9.80} = \frac{29.967 + \sqrt{898.02 + 1960.0}}{9.80} = \frac{29.967 + \sqrt{2858.02}}{9.80} = \frac{29.967 + 53.460}{9.80} = \frac{83.427}{9.80} = 8.513\,\text{s}$$
$$R_{\text{max}} = v_{0x} T = 40.025\,\text{m/s} \times 8.513\,\text{s} = 340.73\,\text{m} \approx 341\,\text{m}$$

---

### Solution 8.4
**(a) Initial velocity components:**
$$\theta = -15.0^\circ$$
$$v_{0x} = 90.0 \cos(-15.0^\circ) = 90.0 \times 0.965926 = 86.933\,\text{m/s}$$
$$v_{0y} = 90.0 \sin(-15.0^\circ) = 90.0 \times (-0.258819) = -23.294\,\text{m/s}$$

**(b) Flight time:**
$$y(t) = 250.0 - 23.294 t - 4.90 t^2 = 0 \implies 4.90 t^2 + 23.294 t - 250.0 = 0$$
$$t = \frac{-23.294 + \sqrt{(23.294)^2 - 4(4.90)(-250.0)}}{9.80} = \frac{-23.294 + \sqrt{542.61 + 4900.0}}{9.80}$$
$$t = \frac{-23.294 + \sqrt{5442.61}}{9.80} = \frac{-23.294 + 73.774}{9.80} = \frac{50.480}{9.80} = 5.151\,\text{s} \approx 5.15\,\text{s}$$

**(c) Horizontal distance:**
$$x = v_{0x} t = 86.933\,\text{m/s} \times 5.151\,\text{s} = 447.79\,\text{m} \approx 448\,\text{m}$$

---

### Solution 8.5
**(a) Initial velocity perpendicular to ramp:**
$$\beta = \theta - \alpha = 50.0^\circ - 20.0^\circ = 30.0^\circ$$
$$v_{0y'} = v_0 \sin\beta = 25.0 \sin(30.0^\circ) = 25.0 \times 0.500 = 12.50\,\text{m/s}$$

**(b) Time to reach maximum perpendicular distance:**
The normal acceleration component is:
$$a_{y'} = g \cos\alpha = 9.80 \cos(20.0^\circ) = 9.80 \times 0.939693 = 9.2090\,\text{m/s}^2$$
At maximum perpendicular distance, $v_{y'} = 0$:
$$t_{\text{normal apex}} = \frac{v_{0y'}}{a_{y'}} = \frac{12.50\,\text{m/s}}{9.2090\,\text{m/s}^2} = 1.3574\,\text{s} \approx 1.36\,\text{s}$$

**(c) Total flight time:**
$$T = 2 \times t_{\text{normal apex}} = 2 \times 1.3574\,\text{s} = 2.7148\,\text{s} \approx 2.71\,\text{s}$$

---

### Solution 8.6
Let $+x$ be horizontal and $+y$ be vertical. The ski jumper's path is:
$$x(t) = v_0 t = 28.0 t \implies t = \frac{x}{28.0}$$
$$y(x) = -\frac{1}{2} g t^2 = -\frac{9.80}{2 (28.0)^2} x^2 = -\frac{4.90}{784.0} x^2 = -0.00625 x^2$$

The profile of the landing hill is a straight line:
$$y_{\text{hill}}(x) = x \tan(-35.0^\circ) = -0.700208 x$$

Equate the trajectory and hill profile:
$$-0.00625 x^2 = -0.700208 x$$
Dividing by $x \ne 0$:
$$0.00625 x = 0.700208 \implies x = \frac{0.700208}{0.00625} = 112.033\,\text{m}$$

The distance $d$ measured along the face of the slope is:
$$d = \frac{x}{\cos(35.0^\circ)} = \frac{112.033}{0.819152} = 136.767\,\text{m} \approx 136.8\,\text{m}$$

---

### Solution 8.7
**(a) Targeting solutions for $(X, Y) = (900.0\,\text{m}, 150.0\,\text{m}), v_0 = 120.0\,\text{m/s}$:**
$$k = \frac{g X^2}{2 v_0^2} = \frac{9.80 \times (900.0)^2}{2 \times (120.0)^2} = \frac{9.80 \times 810000}{28800} = \frac{7938000}{28800} = 275.625\,\text{m}$$
$$Y + k = 150.0 + 275.625 = 425.625\,\text{m}$$
$$\Delta = X^2 - 4 k (Y + k) = (900.0)^2 - 4(275.625)(425.625) = 810000 - 1102.50 \times 425.625 = 810000 - 469251.56 = 340748.44\,\text{m}^2$$
$$\sqrt{\Delta} = \sqrt{340748.44} = 583.7366\,\text{m}$$

Solving for $\tan\theta$:
$$2 k = 2 \times 275.625 = 551.25\,\text{m}$$
Low Angle:
$$\tan\theta_{\text{low}} = \frac{900.0 - 583.7366}{551.25} = \frac{316.2634}{551.25} = 0.573720 \implies \theta_{\text{low}} = 29.843^\circ \approx 29.8^\circ$$
High Angle:
$$\tan\theta_{\text{high}} = \frac{900.0 + 583.7366}{551.25} = \frac{1483.7366}{551.25} = 2.691586 \implies \theta_{\text{high}} = 69.605^\circ \approx 69.6^\circ$$

**(b) Apex height for each trajectory:**
Low angle:
$$v_{0y} = 120.0 \sin(29.843^\circ) = 120.0 \times 0.49763 = 59.716\,\text{m/s}$$
$$H_{\text{low}} = \frac{v_{0y}^2}{2g} = \frac{(59.716)^2}{19.60} = \frac{3566.0}{19.60} = 181.9\,\text{m}$$
High angle:
$$v_{0y} = 120.0 \sin(69.605^\circ) = 120.0 \times 0.93732 = 112.478\,\text{m/s}$$
$$H_{\text{high}} = \frac{v_{0y}^2}{2g} = \frac{(112.478)^2}{19.60} = \frac{12651.3}{19.60} = 645.5\,\text{m}$$

---

### Solution 8.8
**(a) Optimal angle:**
$$\theta^* = 45.0^\circ + \frac{\alpha}{2} = 45.0^\circ + \frac{15.0^\circ}{2} = 52.5^\circ$$

**(b) Incline range at optimal angle:**
$$d_{\text{max}} = \frac{v_0^2}{g (1 + \sin\alpha)} = \frac{(48.0)^2}{9.80 \times (1 + \sin(15.0^\circ))} = \frac{2304.0}{9.80 \times (1 + 0.258819)} = \frac{2304.0}{9.80 \times 1.258819} = \frac{2304.0}{12.3364} = 186.76\,\text{m} \approx 186.8\,\text{m}$$

---

### Solution 8.9
**(a) Minimum launch speed to hit $(1500.0\,\text{m}, 800.0\,\text{m})$:**
$$r = \sqrt{X^2 + Y^2} = \sqrt{(1500.0)^2 + (800.0)^2} = \sqrt{2250000 + 640000} = \sqrt{2890000} = 1700.0\,\text{m}$$
$$v_{0,\text{min}}^2 = g (Y + r) = 9.80 \times (800.0 + 1700.0) = 9.80 \times 2500.0 = 24500.0\,\text{m}^2/\text{s}^2$$
$$v_{0,\text{min}} = \sqrt{24500.0} = 156.525\,\text{m/s} \approx 156.5\,\text{m/s}$$

**(b) Launch angle:**
$$\tan\theta = \frac{Y + r}{X} = \frac{800.0 + 1700.0}{1500.0} = \frac{2500.0}{1500.0} = \frac{5}{3} \approx 1.6667$$
$$\theta = \arctan(1.6667) = 59.036^\circ \approx 59.0^\circ$$

---

### Solution 8.10
**(a) Equation for Parabola of Safety:**
$$\frac{v_0^2}{2g} = \frac{(350.0)^2}{2 \times 9.80} = \frac{122500.0}{19.60} = 6250.0\,\text{m}$$
$$\frac{g}{2 v_0^2} = \frac{9.80}{2 \times 122500.0} = \frac{9.80}{245000.0} = 4.000 \times 10^{-5}\,\text{m}^{-1}$$
$$Y(X) = 6250.0 - 4.000 \times 10^{-5} X^2$$

**(b) Engagement window at $Y = 5000.0\,\text{m}$:**
$$5000.0 = 6250.0 - 4.000 \times 10^{-5} X^2$$
$$4.000 \times 10^{-5} X^2 = 1250.0 \implies X^2 = \frac{1250.0}{4.000 \times 10^{-5}} = 31250000\,\text{m}^2$$
$$X_{\text{max}} = \sqrt{31250000} = 5590.17\,\text{m} \approx 5.59\,\text{km}$$
The aircraft is vulnerable within the span $-5.59\,\text{km} \le X \le +5.59\,\text{km}$ (a total lateral engagement window of $11.18\,\text{km}$).
