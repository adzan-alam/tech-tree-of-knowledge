# CHAPTER 09: Relative Motion & Galilean Transformations

> "Shut yourself up with some friend in the main cabin below decks on some large ship, and have with you there some flies, butterflies, and other small flying animals. Have a large bowl of water with some fish in it; hang up a bottle that empties drop by drop into a wide vessel beneath it. With the ship standing still, observe carefully how the little animals fly with equal speed to all sides of the cabin. The fish swim indifferently in all directions; the drops fall into the vessel beneath... When you have observed all these things, have the ship proceed with any speed you like, so long as the motion is uniform and not fluctuating this way and that. You will discover not the least change in all the effects named, nor could you tell from any of them whether the ship was moving or standing still."
> — **Galileo Galilei**, *Dialogue Concerning the Two Chief World Systems* (1632)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Explain the deep physical significance of Galileo's Principle of Relativity and define an **Inertial Reference Frame**.
2. Master the double-subscript vector convention ($\vec{r}_{P/A}$, $\vec{v}_{P/A}$, $\vec{a}_{P/A}$) to eliminate algebraic ambiguity when chaining multiple observers.
3. Apply Galilean coordinate transformations and derive the Galilean velocity addition theorem: $\vec{v}_{P/A} = \vec{v}_{P/B} + \vec{v}_{B/A}$.
4. Prove that acceleration is an **invariant scalar/vector quantity** under Galilean boosts between inertial frames ($\vec{a}_{P/A} = \vec{a}_{P/B}$), establishing the foundation for Newtonian mechanics.
5. Solve the canonical River-Crossing problems: minimum transit time versus zero-drift crossing, including the sub-critical and super-critical current regimes ($v_{\text{boat}} < v_{\text{current}}$).
6. Calculate aircraft wind correction angles (crab angles) and ground speeds in the presence of arbitrary 2D crosswinds.
7. Formulate and solve the kinematics of closest approach and two-body interception using the **Constant Bearing, Decreasing Range (CBDR)** theorem.

---

## 9.1 The Relativity of Motion and Galileo's Great Insight

Every statement in kinematics concerning position, displacement, or velocity is fundamentally meaningless unless an observer—a **reference frame**—is explicitly specified.
If you sit quietly in the passenger cabin of a bullet train cruising at $300\,\text{km/h}$ ($83.3\,\text{m/s}$) across the countryside:
- To your seatmate, your velocity is zero: $\vec{v} = \vec{0}$.
- To an observer standing on a station platform, your velocity is $\vec{v} = +83.3\,\hat{i}\,\text{m/s}$.
- To an astronomer observing the Earth from space, your velocity includes the Earth's rotational speed ($\approx 460\,\text{m/s}$ at the equator) and its orbital speed around the Sun ($\approx 30,000\,\text{m/s}$).

Which of these velocities is the "real" or "absolute" velocity? **None of them.** Physics knows no preferred origin or stationary center in space. All uniform motion is strictly relative.

An **Inertial Reference Frame** is defined as any reference frame in which Newton's First Law holds true: an object free from net external forces moves with constant velocity (or remains at rest). Crucially, any reference frame moving at a constant velocity with respect to an inertial frame is itself also an inertial frame!

---

## 9.2 The Sovereign Subscript Notation

Errors in relative motion almost always stem from confused sign conventions and ambiguous frames of reference. To permanently eradicate this error, we adopt the formal **Double-Subscript Notation**:

$$\vec{r}_{P/A}$$
reads: **"The position of object $P$ relative to observer $A$."**

$$\vec{v}_{P/A}$$
reads: **"The velocity of object $P$ relative to observer $A$."**

$$\vec{a}_{P/A}$$
reads: **"The acceleration of object $P$ relative to observer $A$."**

### The Three Sacred Axioms of Subscript Algebra:
1. **The Inversion Rule:** Reversing the order of subscripts negates the vector:
   $$\vec{r}_{A/B} = -\vec{r}_{B/A}$$
   $$\vec{v}_{A/B} = -\vec{v}_{B/A}$$
   *Intuition:* If train $B$ moves at $+30\,\text{m/s}$ relative to car $A$, then car $A$ moves at $-30\,\text{m/s}$ relative to train $B$.

2. **The Vector Chaining Rule:** When compounding relative positions or velocities, inner adjacent subscripts must match and cancel:
   $$\vec{r}_{P/A} = \vec{r}_{P/B} + \vec{r}_{B/A}$$
   Notice that the intermediate observer $B$ appears as an adjacent pair ($P/B$ and $B/A$). The outer subscripts ($P$ and $A$) define the resultant vector.

3. **Multi-Frame Extension:** This rule chains seamlessly across any number of intermediate frames:
   $$\vec{v}_{P/A} = \vec{v}_{P/C} + \vec{v}_{C/B} + \vec{v}_{B/A}$$

```
 Observer A (Ground)
       |
       |  r_{B/A} (Position of Train B relative to Ground)
       v
 Observer B (Train)
       |
       |  r_{P/B} (Position of Passenger P relative to Train)
       v
   Object P
   
   Resultant: r_{P/A} = r_{P/B} + r_{B/A}
```

---

## 9.3 Galilean Coordinate and Velocity Transformations

Let frame $A$ be a stationary ground frame with coordinates $(x, y, z)$.
Let frame $B$ be a frame moving with constant velocity $\vec{u} = u\,\hat{i}$ relative to frame $A$ along their shared $x$-axis.
Assume that at time $t = 0$, the origins of both frames coincide ($O_A = O_B$).

In classical mechanics, time is universal, absolute, and identical for all observers:
$$t' = t$$

### Galilean Coordinate Transformation
At time $t$, the position of an arbitrary point $P$ measured in frame $A$ is $\vec{r}_{P/A} = (x, y, z)$.
The position of the moving origin $O_B$ relative to $O_A$ is $\vec{r}_{B/A} = \vec{u} t = (u t, 0, 0)$.

Using our chaining rule:
$$\vec{r}_{P/A} = \vec{r}_{P/B} + \vec{r}_{B/A} \implies \vec{r}_{P/B} = \vec{r}_{P/A} - \vec{r}_{B/A}$$

Expressed in scalar components for frame $B$ coordinates $(x', y', z')$:
$$\begin{aligned}
x' &= x - u t \\
y' &= y \\
z' &= z \\
t' &= t
\end{aligned}$$

### Galilean Velocity Transformation
Differentiating the position relationship with respect to the universal time $t$:
$$\frac{d\vec{r}_{P/A}}{dt} = \frac{d\vec{r}_{P/B}}{dt} + \frac{d\vec{r}_{B/A}}{dt}$$

Since $\frac{d\vec{r}_{B/A}}{dt} = \vec{v}_{B/A} = \vec{u}$, we have:
$$\vec{v}_{P/A} = \vec{v}_{P/B} + \vec{v}_{B/A}$$
$$\vec{v}_{P/B} = \vec{v}_{P/A} - \vec{v}_{B/A}$$

In component form:
$$v'_{x} = v_x - u, \quad v'_{y} = v_y, \quad v'_{z} = v_z$$

---

## 9.4 Galilean Invariance of Acceleration

Now differentiate the velocity transformation equation with respect to time:
$$\frac{d\vec{v}_{P/A}}{dt} = \frac{d\vec{v}_{P/B}}{dt} + \frac{d\vec{v}_{B/A}}{dt}$$
$$\vec{a}_{P/A} = \vec{a}_{P/B} + \vec{a}_{B/A}$$

If frame $B$ is an inertial frame, its velocity relative to frame $A$ is constant:
$$\vec{v}_{B/A} = \text{constant} \implies \vec{a}_{B/A} = \vec{0}$$

Therefore:
$$\vec{a}_{P/A} = \vec{a}_{P/B}$$

**Galilean Invariance Theorem:** The acceleration of a particle is identically the same when measured in any inertial reference frame!
Every inertial observer measures the exact same acceleration vector $\vec{a}$, the exact same gravitational acceleration $\vec{g}$, and the exact same mechanical forces $\vec{F} = m\vec{a}$.

---

## 9.5 Canonical Problem 1: Navigating Flowing Rivers

A river flows horizontally with current velocity $\vec{v}_{w/g} = v_w\,\hat{i}$ relative to the ground.
A boat has a motor that propels it at a speed $v_b$ relative to the water: $|\vec{v}_{b/w}| = v_b$.
The width of the river is $w$.

By the velocity chaining rule, the velocity of the boat relative to the ground is:
$$\vec{v}_{b/g} = \vec{v}_{b/w} + \vec{v}_{w/g}$$

Let the boat steer at an angle $\theta$ measured relative to the straight across-river direction ($+y$ axis).

```
                      Far Bank (y = w)
       -----------------------------------------------
             ^                  ^
             |                 /  v_{b/g} (Resultant)
             | v_{b/w}        /
             |               /
             +------------->/  v_{w/g} (Current)
        Near Bank (y = 0)
```

### Regime 1: Minimum Transit Time (Steering Perpendicular)
To cross the river as quickly as possible, the across-river velocity component $v_{y}$ must be maximized.
Since $\vec{v}_{w/g}$ has zero vertical component ($v_{w,y} = 0$), the entire across-river motion is determined solely by $v_{b/w,y}$:
$$v_{b/g, y} = v_b \cos\theta$$

This is maximized when $\cos\theta = 1 \implies \theta = 0^\circ$ (pointing directly across the river, perpendicular to the current):
$$t_{\text{min}} = \frac{w}{v_b}$$

During this crossing time, the current relentlessly drags the boat downstream. The downstream drift distance $x_{\text{drift}}$ is:
$$x_{\text{drift}} = v_w t_{\text{min}} = \frac{w v_w}{v_b}$$

### Regime 2: Zero-Drift Direct Crossing (Shortest Path)
To land directly opposite the starting point ($x = 0$), the net ground velocity must be purely perpendicular to the banks:
$$v_{b/g, x} = 0$$

If the boat steers upstream at an angle $\theta$ into the current:
$$v_{b/g, x} = -v_b \sin\theta + v_w = 0$$
$$\sin\theta = \frac{v_w}{v_b}$$

Notice the critical physical constraint:
- Since $\sin\theta \le 1$, a zero-drift crossing is **physically possible if and only if $v_b \ge v_w$** (the boat's motor speed exceeds or equals the river current).
- If $v_b \ge v_w$, the required upstream heading angle is $\theta = \arcsin\left(\frac{v_w}{v_b}\right)$.
- The resulting ground crossing speed is:
  $$v_{b/g} = \sqrt{v_b^2 - v_w^2}$$
- The time required for this direct crossing is:
  $$t_{\text{direct}} = \frac{w}{\sqrt{v_b^2 - v_w^2}} > t_{\text{min}}$$

### Regime 3: Subcritical Current ($v_b < v_w$) and Minimum Drift
If the river current is faster than the boat ($v_w > v_b$), zero drift is impossible. Even if the boat steers directly upstream into the current, it will be swept backward downstream.
What angle $\theta$ minimizes the unavoidable downstream drift?

The ground velocity components are:
$$v_x = v_w - v_b \sin\theta$$
$$v_y = v_b \cos\theta$$
The crossing time is $t = \frac{w}{v_y} = \frac{w}{v_b \cos\theta}$.
The drift distance is:
$$x_{\text{drift}}(\theta) = v_x t = \left(v_w - v_b \sin\theta\right) \frac{w}{v_b \cos\theta} = w \left( \frac{v_w}{v_b} \sec\theta - \tan\theta \right)$$

Differentiating with respect to $\theta$ and setting $\frac{dx_{\text{drift}}}{d\theta} = 0$:
$$\frac{d}{d\theta} \left[ \frac{v_w}{v_b} \sec\theta - \tan\theta \right] = \frac{v_w}{v_b} \sec\theta \tan\theta - \sec^2\theta = 0$$
$$\sec\theta \left( \frac{v_w}{v_b} \tan\theta - \sec\theta \right) = 0 \implies \frac{v_w}{v_b} \frac{\sin\theta}{\cos\theta} = \frac{1}{\cos\theta}$$
$$\sin\theta^* = \frac{v_b}{v_w}$$

**The Inverted Sine Law for Minimum Drift:** When $v_b < v_w$, the minimum drift angle is given by $\sin\theta^* = \frac{v_b}{v_w}$!

---

## 9.6 Canonical Problem 2: Aircraft Crosswind Navigation

An aircraft navigates in a moving ocean of air.
- $\vec{v}_{a/air}$: **True Airspeed (TAS)** vector. Directed along the aircraft's physical fuselage centerline (heading). Speed $|\vec{v}_{a/air}| = v_a$.
- $\vec{v}_{air/g}$: **Wind Velocity** vector.
- $\vec{v}_{a/g}$: **Ground Speed** vector (the actual ground track over the terrain).

$$\vec{v}_{a/g} = \vec{v}_{a/air} + \vec{v}_{air/g}$$

### The Wind Correction Angle (Crab Angle)
Suppose a navigator desires a ground track along a bearing $\phi$ (e.g., due North). A crosswind blows from the west with speed $v_{\text{wind}}$ toward the east ($+x$).
To prevent being blown off course, the pilot must steer the aircraft's nose into the wind at a crab angle $\delta$.

```
                 N (+y, Desired Ground Track)
                 ^
                 |   / v_{a/air} (Heading, crabbed into wind)
                 |  /|
         v_{a/g} | / |
                 |/--+ v_{wind}
                 +--------------------> E (+x)
```

By balancing cross-track components:
$$v_{a/air} \sin\delta = v_{\text{wind}} \implies \sin\delta = \frac{v_{\text{wind}}}{v_a}$$
The effective ground speed along the desired track is:
$$v_{\text{ground}} = v_a \cos\delta = \sqrt{v_a^2 - v_{\text{wind}}^2}$$

---

## 9.7 Canonical Problem 3: Two-Body Closest Approach & CBDR

Consider two craft, Vessel 1 and Vessel 2, moving with constant velocities $\vec{v}_1$ and $\vec{v}_2$ from initial positions $\vec{r}_{10}$ and $\vec{r}_{20}$.

The relative position of Vessel 2 relative to Vessel 1 as a function of time is:
$$\vec{r}_{\text{rel}}(t) = \vec{r}_2(t) - \vec{r}_1(t) = (\vec{r}_{20} - \vec{r}_{10}) + (\vec{v}_2 - \vec{v}_1) t = \vec{r}_{0,\text{rel}} + \vec{v}_{\text{rel}} t$$

### Finding the Distance of Closest Approach
The squared separation distance is:
$$D^2(t) = |\vec{r}_{\text{rel}}(t)|^2 = (\vec{r}_{0,\text{rel}} + \vec{v}_{\text{rel}} t) \cdot (\vec{r}_{0,\text{rel}} + \vec{v}_{\text{rel}} t)$$
$$D^2(t) = |\vec{r}_{0,\text{rel}}|^2 + 2 (\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}}) t + |\vec{v}_{\text{rel}}|^2 t^2$$

To find the time of closest approach $t_{\text{min}}$, differentiate with respect to $t$ and set to zero:
$$\frac{d(D^2)}{dt} = 2 (\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}}) + 2 |\vec{v}_{\text{rel}}|^2 t = 0$$
$$t_{\text{min}} = -\frac{\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}}}{|\vec{v}_{\text{rel}}|^2}$$

- If $t_{\text{min}} < 0$, the vessels are already diverging; the minimum distance occurred in the past.
- If $t_{\text{min}} \ge 0$, substitute $t_{\text{min}}$ back into $\vec{r}_{\text{rel}}(t_{\text{min}})$ to find the minimum miss distance:
  $$D_{\text{min}} = |\vec{r}_{\text{rel}}(t_{\text{min}})|$$

### The Constant Bearing, Decreasing Range (CBDR) Law
In maritime navigation and aviation collision avoidance:
- If an approaching vessel maintains a **constant compass bearing** (the line-of-sight vector direction $\hat{r}_{\text{rel}}$ does not change over time) while the range decreases, **a collision is guaranteed ($D_{\text{min}} = 0$)**.
- Geometrically, this occurs when the relative velocity vector $\vec{v}_{\text{rel}}$ points directly along the line connecting the two craft:
  $$\vec{v}_{\text{rel}} = -k\,\vec{r}_{0,\text{rel}} \quad (k > 0)$$

---

## 9.8 Ten Progressive Worked Numerical Examples

---

### Example 9.1: Moving Walkway Kinematics
**Problem:** An airport moving walkway has a length $L = 120.0\,\text{m}$ and moves with a speed $v_w = 1.50\,\text{m/s}$ relative to the terminal floor. A traveler walks at $v_p = 2.00\,\text{m/s}$ relative to the walkway surface.
1. How long does the traveler take to traverse the walkway walking with the flow?
2. How long does the traveler take to traverse the walkway walking against the flow?
3. If the traveler drops a pen onto the walkway, what is the speed of the pen relative to the terminal floor?

#### Solution
**Step 1: Walking with the flow**
$$\vec{v}_{p/\text{ground}} = \vec{v}_{p/\text{walkway}} + \vec{v}_{\text{walkway}/\text{ground}} = +2.00\,\text{m/s} + 1.50\,\text{m/s} = +3.50\,\text{m/s}$$
$$t_{\text{with}} = \frac{L}{v_{\text{with}}} = \frac{120.0\,\text{m}}{3.50\,\text{m/s}} = 34.286\,\text{s} \approx 34.3\,\text{s}$$

**Step 2: Walking against the flow**
$$\vec{v}_{p/\text{ground}} = -2.00\,\text{m/s} + 1.50\,\text{m/s} = -0.50\,\text{m/s}$$
The net velocity is $0.50\,\text{m/s}$ in the traveler's intended direction:
$$t_{\text{against}} = \frac{120.0\,\text{m}}{0.50\,\text{m/s}} = 240.0\,\text{s} = 4.00\,\text{min}$$

**Step 3: Dropped pen**
The pen comes to rest relative to the walkway surface: $\vec{v}_{\text{pen}/\text{walkway}} = \vec{0}$.
Therefore:
$$\vec{v}_{\text{pen}/\text{ground}} = \vec{v}_{\text{pen}/\text{walkway}} + \vec{v}_{\text{walkway}/\text{ground}} = \vec{0} + 1.50\,\text{m/s} = 1.50\,\text{m/s}$$

---

### Example 9.2: River Crossing - Minimum Time vs Zero Drift
**Problem:** A river is $w = 400.0\,\text{m}$ wide and flows with a uniform current $v_w = 2.40\,\text{m/s}$. A motorboat moves with speed $v_b = 4.00\,\text{m/s}$ relative to the water.
1. Determine the heading angle, crossing time, and downstream drift for minimum-time crossing.
2. Determine the heading angle and crossing time for a zero-drift direct crossing.

#### Solution
**Step 1: Minimum-time crossing**
To minimize time, steer directly across ($\theta = 0^\circ$ relative to normal):
$$t_{\text{min}} = \frac{w}{v_b} = \frac{400.0\,\text{m}}{4.00\,\text{m/s}} = 100.0\,\text{s}$$
Downstream drift:
$$x_{\text{drift}} = v_w t_{\text{min}} = 2.40\,\text{m/s} \times 100.0\,\text{s} = 240.0\,\text{m}$$

**Step 2: Zero-drift crossing**
To achieve zero drift, the boat must steer upstream at angle $\theta$:
$$\sin\theta = \frac{v_w}{v_b} = \frac{2.40}{4.00} = 0.6000 \implies \theta = \arcsin(0.6000) = 36.87^\circ \approx 36.9^\circ\,\text{upstream}$$
Net crossing velocity across the river:
$$v_{\text{ground}} = \sqrt{v_b^2 - v_w^2} = \sqrt{(4.00)^2 - (2.40)^2} = \sqrt{16.00 - 5.76} = \sqrt{10.24} = 3.20\,\text{m/s}$$
Time of crossing:
$$t_{\text{direct}} = \frac{w}{v_{\text{ground}}} = \frac{400.0\,\text{m}}{3.20\,\text{m/s}} = 125.0\,\text{s}$$

---

### Example 9.3: Fast River - Minimum Drift with Subcritical Speed
**Problem:** A river of width $w = 250.0\,\text{m}$ flows at $v_w = 5.00\,\text{m/s}$. A swimmer can swim at a maximum speed of $v_s = 3.00\,\text{m/s}$ relative to the water ($v_s < v_w$).
1. Explain why the swimmer cannot achieve zero drift.
2. Calculate the optimal heading angle $\theta$ (upstream from normal) that minimizes downstream drift.
3. Calculate this minimum downstream drift distance.

#### Solution
**Step 1: Impossibility of zero drift**
Zero drift requires $\sin\theta = \frac{v_w}{v_s} = \frac{5.00}{3.00} = 1.667 > 1$, which has no real solution. Even if swimming directly upstream, the swimmer is swept backward at $5.00 - 3.00 = 2.00\,\text{m/s}$.

**Step 2: Optimal heading for minimum drift**
Using the Inverted Sine Law derived in Section 9.5:
$$\sin\theta^* = \frac{v_s}{v_w} = \frac{3.00}{5.00} = 0.6000$$
$$\theta^* = \arcsin(0.6000) = 36.87^\circ \approx 36.9^\circ\,\text{upstream}$$

**Step 3: Minimum downstream drift**
$$\cos\theta^* = \sqrt{1 - \sin^2\theta^*} = \sqrt{1 - 0.36} = \sqrt{0.64} = 0.8000$$
Vertical velocity across river:
$$v_y = v_s \cos\theta^* = 3.00 \times 0.8000 = 2.40\,\text{m/s}$$
Crossing time:
$$t = \frac{w}{v_y} = \frac{250.0\,\text{m}}{2.40\,\text{m/s}} = 104.167\,\text{s}$$
Horizontal velocity along river:
$$v_x = v_w - v_s \sin\theta^* = 5.00 - 3.00(0.6000) = 5.00 - 1.80 = 3.20\,\text{m/s}$$
Minimum drift:
$$x_{\text{drift}} = v_x t = 3.20\,\text{m/s} \times 104.167\,\text{s} = 333.33\,\text{m} \approx 333.3\,\text{m}$$

---

### Example 9.4: Aircraft Crosswind Navigation and Crab Angle
**Problem:** A commercial airliner with a cruising airspeed $v_a = 220.0\,\text{m/s}$ intends to fly due North ($+y$). A steady crosswind blows from the southwest at $45.0^\circ$ (towards northeast) with speed $v_{\text{wind}} = 35.0\,\text{m/s}$.
1. Decompose the wind velocity vector.
2. Determine the required compass heading (crab angle) the pilot must maintain.
3. Determine the resulting ground speed of the aircraft.

#### Solution
**Step 1: Wind vector decomposition**
The wind blows toward the northeast ($+x$ and $+y$):
$$\vec{v}_{\text{wind}} = 35.0 \cos(45^\circ)\,\hat{i} + 35.0 \sin(45^\circ)\,\hat{j} = 24.749\,\hat{i} + 24.749\,\hat{j}\,\text{m/s}$$

**Step 2: Desired ground velocity**
Desired track is purely North: $\vec{v}_{\text{ground}} = 0\,\hat{i} + v_g\,\hat{j}$.
Since $\vec{v}_{\text{ground}} = \vec{v}_{a/\text{air}} + \vec{v}_{\text{wind}}$:
$$0 = v_{a/\text{air}, x} + v_{\text{wind}, x} \implies v_{a/\text{air}, x} = -v_{\text{wind}, x} = -24.749\,\text{m/s}$$

Let $\delta$ be the heading angle west of north:
$$\sin\delta = \frac{|v_{a/\text{air}, x}|}{v_a} = \frac{24.749}{220.0} = 0.112495$$
$$\delta = \arcsin(0.112495) = 6.459^\circ \approx 6.46^\circ\,\text{West of North}$$
(Compass heading = $360^\circ - 6.46^\circ = 353.5^\circ$).

**Step 3: Ground speed**
$$v_{a/\text{air}, y} = v_a \cos\delta = 220.0 \times \cos(6.459^\circ) = 220.0 \times 0.99365 = 218.60\,\text{m/s}$$
$$v_g = v_{a/\text{air}, y} + v_{\text{wind}, y} = 218.60 + 24.749 = 243.35\,\text{m/s} \approx 243.4\,\text{m/s}$$
The tailwind component boosts the ground speed from $220\,\text{m/s}$ to $243.4\,\text{m/s}$.

---

### Example 9.5: Apparent Velocity of Falling Rain
**Problem:** Rain falls vertically downward relative to the earth at a constant speed $v_{\text{rain}} = 8.00\,\text{m/s}$. A driver in a car travels horizontally at $v_{\text{car}} = 20.0\,\text{m/s}$.
1. Find the velocity of the rain relative to the driver.
2. At what angle relative to the vertical do the raindrops strike the car's side windows?

#### Solution
**Step 1: Relative velocity vector**
Let $+x$ be horizontal forward and $+y$ be vertically upward.
$$\vec{v}_{r/g} = 0\,\hat{i} - 8.00\,\hat{j}\,\text{m/s}$$
$$\vec{v}_{c/g} = +20.0\,\hat{i} + 0\,\hat{j}\,\text{m/s}$$
Using the inversion and chaining rules:
$$\vec{v}_{r/c} = \vec{v}_{r/g} - \vec{v}_{c/g} = -20.0\,\hat{i} - 8.00\,\hat{j}\,\text{m/s}$$

Magnitude (apparent rain speed):
$$v_{\text{apparent}} = \sqrt{(-20.0)^2 + (-8.00)^2} = \sqrt{400.0 + 64.0} = \sqrt{464.0} = 21.54\,\text{m/s} \approx 21.5\,\text{m/s}$$

**Step 2: Angle relative to vertical**
$$\tan\theta = \frac{|v_{r/c, x}|}{|v_{r/c, y}|} = \frac{20.0}{8.00} = 2.500$$
$$\theta = \arctan(2.500) = 68.2^\circ\,\text{from the vertical}$$
The rain appears to slant backward toward the driver at $68.2^\circ$ from the vertical.

---

### Example 9.6: Two-Body Closest Approach Distance
**Problem:** At $t = 0$:
- Patrol Boat 1 is at $(x_1, y_1) = (0, 0)$ moving with $\vec{v}_1 = 12.0\,\hat{i} + 5.0\,\hat{j}\,\text{m/s}$.
- Vessel 2 is at $(x_2, y_2) = (400.0\,\text{m}, 300.0\,\text{m})$ moving with $\vec{v}_2 = -6.0\,\hat{i} + 8.0\,\hat{j}\,\text{m/s}$.
1. Compute the relative initial position $\vec{r}_{0,\text{rel}} = \vec{r}_2 - \vec{r}_1$.
2. Compute the relative velocity $\vec{v}_{\text{rel}} = \vec{v}_2 - \vec{v}_1$.
3. Determine the time $t_{\text{min}}$ of closest approach.
4. Calculate the distance of closest approach $D_{\text{min}}$.

#### Solution
**Step 1: Relative initial position**
$$\vec{r}_{0,\text{rel}} = (400.0 - 0)\,\hat{i} + (300.0 - 0)\,\hat{j} = 400.0\,\hat{i} + 300.0\,\hat{j}\,\text{m}$$

**Step 2: Relative velocity**
$$\vec{v}_{\text{rel}} = \vec{v}_2 - \vec{v}_1 = (-6.0 - 12.0)\,\hat{i} + (8.0 - 5.0)\,\hat{j} = -18.0\,\hat{i} + 3.0\,\hat{j}\,\text{m/s}$$

**Step 3: Time of closest approach**
$$\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}} = (400.0 \times -18.0) + (300.0 \times 3.0) = -7200.0 + 900.0 = -6300.0\,\text{m}^2/\text{s}$$
$$|\vec{v}_{\text{rel}}|^2 = (-18.0)^2 + (3.0)^2 = 324.0 + 9.0 = 333.0\,\text{m}^2/\text{s}^2$$
$$t_{\text{min}} = -\frac{\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}}}{|\vec{v}_{\text{rel}}|^2} = -\frac{-6300.0}{333.0} = 18.919\,\text{s} \approx 18.9\,\text{s}$$

**Step 4: Closest distance $D_{\text{min}}$**
Relative position at $t = 18.919\,\text{s}$:
$$\vec{r}_{\text{rel}}(18.919) = [400.0 - 18.0(18.919)]\,\hat{i} + [300.0 + 3.0(18.919)]\,\hat{j}$$
$$\vec{r}_{\text{rel}} = (400.0 - 340.542)\,\hat{i} + (300.0 + 56.757)\,\hat{j} = 59.458\,\hat{i} + 356.757\,\hat{j}\,\text{m}$$
$$D_{\text{min}} = \sqrt{(59.458)^2 + (356.757)^2} = \sqrt{3535.25 + 127275.56} = \sqrt{130810.81} = 361.68\,\text{m} \approx 361.7\,\text{m}$$

---

### Example 9.7: Maritime Collision Intercept Geometry
**Problem:** A freighter is located at $(x_f, y_f) = (5000.0\,\text{m}, 0)$ at $t = 0$, steaming due North at a constant speed $v_f = 10.0\,\text{m/s}$. A coast guard cutter at $(0, 0)$ detects the freighter and steams to intercept it at a speed $v_c = 18.0\,\text{m/s}$.
1. Find the required heading angle $\theta$ for the cutter.
2. Determine the time elapsed before interception.
3. Determine the coordinates of the intercept point.

#### Solution
**Step 1: Intercept condition**
Let $T$ be the intercept time.
Freighter position at time $T$:
$$\vec{r}_f(T) = 5000.0\,\hat{i} + (10.0 T)\,\hat{j}$$
Cutter position at time $T$:
$$\vec{r}_c(T) = (v_c \cos\theta\,T)\,\hat{i} + (v_c \sin\theta\,T)\,\hat{j}$$

Equating coordinates:
$$v_c \cos\theta\,T = 5000.0 \implies T = \frac{5000.0}{v_c \cos\theta}$$
$$v_c \sin\theta\,T = 10.0 T \implies v_c \sin\theta = 10.0$$

From the second equation:
$$\sin\theta = \frac{10.0}{v_c} = \frac{10.0}{18.0} = 0.555556$$
$$\theta = \arcsin(0.555556) = 33.749^\circ \approx 33.7^\circ\,\text{North of East}$$

**Step 2: Intercept time $T$**
$$\cos\theta = \cos(33.749^\circ) = 0.831470$$
$$T = \frac{5000.0}{18.0 \times 0.831470} = \frac{5000.0}{14.9665} = 334.08\,\text{s} \approx 5.57\,\text{min}$$

**Step 3: Intercept point**
$$x_{\text{hit}} = 5000.0\,\text{m}$$
$$y_{\text{hit}} = 10.0 \times 334.08 = 3340.8\,\text{m}$$
Coordinates: $(5000.0\,\text{m}, 3340.8\,\text{m})$.

---

### Example 9.8: Projectile Fired from a Moving Flatbed Truck
**Problem:** A flatbed truck moves along a flat horizontal highway at a constant velocity $u = 25.0\,\text{m/s}\,\hat{i}$. A cannon mounted on the truck fires a shell at an angle $\theta = 60.0^\circ$ relative to the truck bed with a muzzle velocity $v_0 = 50.0\,\text{m/s}$ in the forward direction.
1. Determine the velocity of the shell relative to a stationary observer on the ground at the instant of launch.
2. Calculate the maximum height reached above the truck bed.
3. Calculate the total horizontal range $R_{\text{ground}}$ relative to the ground.
4. Calculate where the shell lands relative to the moving truck.

#### Solution
**Step 1: Velocity relative to ground**
Relative to the truck:
$$v_{0x}' = v_0 \cos(60.0^\circ) = 50.0 \times 0.500 = 25.0\,\text{m/s}$$
$$v_{0y}' = v_0 \sin(60.0^\circ) = 50.0 \times \frac{\sqrt{3}}{2} = 43.301\,\text{m/s}$$

Relative to ground:
$$v_{0x} = v_{0x}' + u = 25.0 + 25.0 = 50.0\,\text{m/s}$$
$$v_{0y} = v_{0y}' = 43.301\,\text{m/s}$$
Ground launch speed:
$$v_{\text{ground}} = \sqrt{(50.0)^2 + (43.301)^2} = \sqrt{2500.0 + 1875.0} = \sqrt{4375.0} = 66.14\,\text{m/s}$$
Ground launch angle:
$$\theta_{\text{ground}} = \arctan\left(\frac{43.301}{50.0}\right) = \arctan(0.8660) = 40.89^\circ$$

**Step 2: Maximum height**
Since vertical velocity is identical in both frames ($v_y = v'_y$):
$$H_{\text{max}} = \frac{v_{0y}^2}{2g} = \frac{(43.301)^2}{2 \times 9.80} = \frac{1875.0}{19.60} = 95.66\,\text{m}$$

**Step 3: Total horizontal range on ground**
Time of flight:
$$T = \frac{2 v_{0y}}{g} = \frac{2 \times 43.301}{9.80} = 8.837\,\text{s}$$
$$R_{\text{ground}} = v_{0x} T = 50.0\,\text{m/s} \times 8.837\,\text{s} = 441.85\,\text{m} \approx 441.9\,\text{m}$$

**Step 4: Landing position relative to truck**
Distance traveled by truck during flight:
$$x_{\text{truck}} = u T = 25.0 \times 8.837 = 220.925\,\text{m}$$
Position of landing relative to truck:
$$\Delta x = R_{\text{ground}} - x_{\text{truck}} = 441.85 - 220.93 = 220.92\,\text{m}\,\text{ahead of truck}$$
*Sanity Check:* $v'_{0x} T = 25.0 \times 8.837 = 220.925\,\text{m}$. Exact match.

---

### Example 9.9: Rotating Weather Vane on a Moving Ship
**Problem:** A research ship steams due North at a constant speed $v_s = 10.0\,\text{m/s}$. An anemometer on the mast measures an apparent wind coming from $30.0^\circ$ East of North with an apparent speed $v_{\text{app}} = 15.0\,\text{m/s}$. Determine the true velocity (speed and direction) of the wind relative to the ocean surface.

#### Solution
**Step 1: Formulate the vectors**
Let $+x$ be East and $+y$ be North.
Ship velocity relative to ocean:
$$\vec{v}_{s/g} = 0\,\hat{i} + 10.0\,\hat{j}\,\text{m/s}$$

Apparent wind is the velocity of the air relative to the ship: $\vec{v}_{\text{air}/s}$.
The wind *comes from* $30.0^\circ$ East of North, meaning it blows *toward* $30.0^\circ$ West of South:
$$\vec{v}_{\text{air}/s} = -15.0 \sin(30.0^\circ)\,\hat{i} - 15.0 \cos(30.0^\circ)\,\hat{j} = -7.50\,\hat{i} - 12.990\,\hat{j}\,\text{m/s}$$

**Step 2: True wind relative to ocean**
$$\vec{v}_{\text{air}/g} = \vec{v}_{\text{air}/s} + \vec{v}_{s/g} = (-7.50\,\hat{i} - 12.990\,\hat{j}) + (0\,\hat{i} + 10.0\,\hat{j}) = -7.50\,\hat{i} - 2.990\,\hat{j}\,\text{m/s}$$

**Step 3: Speed and direction of true wind**
$$v_{\text{true}} = \sqrt{(-7.50)^2 + (-2.990)^2} = \sqrt{56.25 + 8.940} = \sqrt{65.190} = 8.074\,\text{m/s} \approx 8.07\,\text{m/s}$$
Direction:
$$\tan\phi = \frac{-7.50}{-2.990} = 2.508 \implies \phi = 68.3^\circ\,\text{West of South}$$
The true wind blows toward the West-Southwest (coming from $68.3^\circ$ East of North) at $8.07\,\text{m/s}$.

---

### Example 9.10: Three-Frame Acceleration Invariance
**Problem:** A passenger car on a train accelerating along a straight horizontal track at $\vec{a}_{\text{train}} = +1.20\,\hat{i}\,\text{m/s}^2$ carries a passenger who drops an apple from rest relative to the cabin.
1. Determine the apple's acceleration measured by the passenger inside the accelerating train.
2. Determine the apple's acceleration measured by an observer standing on the ground platform.
3. Does the ground observer or the train observer see the apple fall straight down?

#### Solution
**Step 1: Apple's acceleration relative to ground**
Once released, the apple is in free fall. The only real physical force acting on the apple is Earth's gravity:
$$\vec{a}_{\text{apple}/\text{ground}} = -g\,\hat{j} = -9.80\,\hat{j}\,\text{m/s}^2$$

**Step 2: Apple's acceleration relative to the train**
Using the relative acceleration relation:
$$\vec{a}_{\text{apple}/\text{train}} = \vec{a}_{\text{apple}/\text{ground}} - \vec{a}_{\text{train}/\text{ground}}$$
$$\vec{a}_{\text{apple}/\text{train}} = (-9.80\,\hat{j}) - (+1.20\,\hat{i}) = -1.20\,\hat{i} - 9.80\,\hat{j}\,\text{m/s}^2$$

Magnitude:
$$a_{\text{rel}} = \sqrt{(-1.20)^2 + (-9.80)^2} = \sqrt{1.44 + 96.04} = \sqrt{97.48} = 9.873\,\text{m/s}^2$$

**Step 3: Trajectory observation**
- To the **ground observer**, the apple has an initial forward velocity equal to the train's speed at release, and falls in a parabolic trajectory curve.
- To the **train passenger**, the apple experiences an apparent backward horizontal acceleration of $-1.20\,\hat{i}\,\text{m/s}^2$ (an inertial fictitious force) and accelerates backward and downward at an angle:
  $$\tan\theta = \frac{1.20}{9.80} \implies \theta = 6.98^\circ\,\text{behind the vertical}$$
Neither observer sees the apple fall straight down!

---

## 9.9 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 9.1 (Tier 1: Relative 1D Velocities)
Two high-speed trains A and B travel along parallel tracks. Train A moves East at $v_A = 40.0\,\text{m/s}$ and Train B moves West at $v_B = 30.0\,\text{m/s}$.
(a) What is the velocity of Train A relative to Train B?
(b) What is the velocity of Train B relative to Train A?

### Exercise 9.2 (Tier 1: Simple Perpendicular Crossing)
A river $w = 180.0\,\text{m}$ wide flows at $v_w = 1.20\,\text{m/s}$. A swimmer moves at $v_s = 1.80\,\text{m/s}$ relative to the water and points directly across the river perpendicular to the banks.
(a) What is the swimmer's crossing time?
(b) How far downstream from the starting point does the swimmer arrive?

### Exercise 9.3 (Tier 2: Upstream Zero Drift)
For the swimmer in Exercise 9.2 ($w = 180.0\,\text{m}, v_w = 1.20\,\text{m/s}, v_s = 1.80\,\text{m/s}$):
(a) At what angle upstream must the swimmer head to land directly across the river?
(b) What is the crossing time for this direct path?

### Exercise 9.4 (Tier 2: Rain on a Moving Bus)
A bus travels horizontally at $v_{\text{bus}} = 15.0\,\text{m/s}$ through rain falling vertically. The streaks left by the raindrops on the side windows make an angle of $55.0^\circ$ with the vertical. What is the terminal speed of the raindrops relative to the ground?

### Exercise 9.5 (Tier 3: Aircraft Pure East Transit with North Wind)
An airplane flies from City X to City Y located directly East at a distance $D = 850.0\,\text{km}$. A persistent wind blows due South at $v_{\text{wind}} = 25.0\,\text{m/s}$. The plane's airspeed is $v_{\text{air}} = 160.0\,\text{m/s}$.
(a) What heading angle must the pilot maintain?
(b) What is the airplane's ground speed?
(c) How many minutes does the flight take?

### Exercise 9.6 (Tier 3: Intercepting a Speeding Convoy)
A police drone at $(0,0)$ spots a smuggler boat at $(x_0, y_0) = (1200.0\,\text{m}, 500.0\,\text{m})$ traveling due East at $v_b = 20.0\,\text{m/s}$. The drone flies at a constant speed of $v_d = 35.0\,\text{m/s}$.
(a) Find the required flight angle $\theta$ for the drone to intercept the boat.
(b) Find the time required for interception.

### Exercise 9.7 (Tier 4: Subcritical Minimum Drift River Problem)
A wide river ($w = 500.0\,\text{m}$) has a strong current of $v_w = 4.00\,\text{m/s}$. A kayaker can paddle at $v_k = 2.50\,\text{m/s}$ relative to the water.
(a) Determine the heading angle $\theta$ upstream that minimizes downstream drift.
(b) Determine the minimum downstream drift distance.
(c) Determine the crossing time under this optimal heading.

### Exercise 9.8 (Tier 4: Closest Approach of Two Aircraft)
At $t = 0$:
- Aircraft 1 is at $(0, 10000.0\,\text{m})$ flying due East at $v_1 = 200.0\,\text{m/s}$.
- Aircraft 2 is at $(15000.0\,\text{m}, 0)$ flying due North at $v_2 = 150.0\,\text{m/s}$.
(a) Find the time $t_{\text{closest}}$ when the separation between the aircraft is minimized.
(b) What is this minimum separation distance $D_{\text{min}}$?

### Exercise 9.9 (Tier 5: Projectile from an Accelerating Cart)
A cart accelerates horizontally along a flat floor with constant acceleration $a_c = 3.00\,\text{m/s}^2$. At the instant its speed reaches $u = 6.00\,\text{m/s}$, a spring launcher on the cart ejects a ball vertically upward relative to the cart with speed $v_0 = 14.7\,\text{m/s}$.
(a) How long does the ball take to return to the launch height?
(b) Where does the ball land relative to the cart?
(c) What is the ball's trajectory shape as viewed by an observer on the cart?

### Exercise 9.10 (Tier 5: Constant Bearing Intercept Course Formulation)
Vessel A moves with constant velocity $\vec{v}_A = (15.0\,\hat{i} + 0\,\hat{j})\,\text{knots}$. At $t = 0$, Vessel B is at bearing $045^\circ$ ($45.0^\circ$ North of East) at a distance of $10.0\,\text{nautical miles}$. Vessel B travels at a speed of $v_B = 22.0\,\text{knots}$. Determine the course heading of Vessel B that achieves a Constant Bearing, Decreasing Range (CBDR) intercept.

---

## 9.10 Comprehensive Solutions to Chapter Exercises

---

### Solution 9.1
Let $+x$ be East.
$\vec{v}_A = +40.0\,\hat{i}\,\text{m/s}$, $\vec{v}_B = -30.0\,\hat{i}\,\text{m/s}$.
**(a) Velocity of A relative to B:**
$$\vec{v}_{A/B} = \vec{v}_A - \vec{v}_B = (+40.0) - (-30.0) = +70.0\,\hat{i}\,\text{m/s}\,(70.0\,\text{m/s East})$$

**(b) Velocity of B relative to A:**
$$\vec{v}_{B/A} = \vec{v}_B - \vec{v}_A = (-30.0) - (+40.0) = -70.0\,\hat{i}\,\text{m/s}\,(70.0\,\text{m/s West})$$

---

### Solution 9.2
**(a) Crossing time:**
Since the swimmer heads directly across ($\theta = 0^\circ$):
$$v_y = v_s = 1.80\,\text{m/s}$$
$$t = \frac{w}{v_y} = \frac{180.0\,\text{m}}{1.80\,\text{m/s}} = 100.0\,\text{s}$$

**(b) Downstream drift:**
$$x_{\text{drift}} = v_w t = 1.20\,\text{m/s} \times 100.0\,\text{s} = 120.0\,\text{m}$$

---

### Solution 9.3
**(a) Upstream heading angle:**
$$\sin\theta = \frac{v_w}{v_s} = \frac{1.20}{1.80} = \frac{2}{3} \approx 0.6667$$
$$\theta = \arcsin(0.6667) = 41.81^\circ \approx 41.8^\circ\,\text{upstream from normal}$$

**(b) Crossing time:**
$$v_{\text{ground}} = \sqrt{v_s^2 - v_w^2} = \sqrt{(1.80)^2 - (1.20)^2} = \sqrt{3.24 - 1.44} = \sqrt{1.80} = 1.3416\,\text{m/s}$$
$$t_{\text{direct}} = \frac{w}{v_{\text{ground}}} = \frac{180.0\,\text{m}}{1.3416\,\text{m/s}} = 134.16\,\text{s} \approx 134.2\,\text{s}$$

---

### Solution 9.4
In the reference frame of the bus:
- Horizontal velocity of rain: $v'_{x} = -v_{\text{bus}} = -15.0\,\text{m/s}$.
- Vertical velocity of rain: $v'_{y} = -v_{\text{rain}}$.
The streak angle relative to the vertical is $\theta = 55.0^\circ$:
$$\tan(55.0^\circ) = \frac{|v'_x|}{|v'_y|} = \frac{15.0}{v_{\text{rain}}}$$
$$v_{\text{rain}} = \frac{15.0}{\tan(55.0^\circ)} = \frac{15.0}{1.428148} = 10.503\,\text{m/s} \approx 10.5\,\text{m/s}$$

---

### Solution 9.5
**(a) Heading angle:**
Desired ground track is due East ($+x$). Wind is due South ($-y$) at $v_{\text{wind}} = 25.0\,\text{m/s}$.
To cancel the southward wind drift, the plane must head North of East by angle $\delta$:
$$v_{\text{air}} \sin\delta = v_{\text{wind}} \implies \sin\delta = \frac{25.0}{160.0} = 0.15625$$
$$\delta = \arcsin(0.15625) = 8.989^\circ \approx 8.99^\circ\,\text{North of East}$$

**(b) Ground speed:**
$$v_g = v_{\text{air}} \cos\delta = 160.0 \times \cos(8.989^\circ) = 160.0 \times 0.987717 = 158.035\,\text{m/s} \approx 158.0\,\text{m/s}$$

**(c) Flight duration:**
$$t = \frac{D}{v_g} = \frac{850000.0\,\text{m}}{158.035\,\text{m/s}} = 5378.55\,\text{s} = 89.64\,\text{min} \approx 1\,\text{hr}\,29.6\,\text{min}$$

---

### Solution 9.6
**(a) Flight angle for drone intercept:**
At intercept time $T$:
Boat: $x_b = 1200.0 + 20.0 T, \quad y_b = 500.0$.
Drone: $x_d = (v_d \cos\theta) T, \quad y_d = (v_d \sin\theta) T$.
From the $y$-equation:
$$(35.0 \sin\theta) T = 500.0 \implies T = \frac{500.0}{35.0 \sin\theta}$$
From the $x$-equation:
$$(35.0 \cos\theta) T = 1200.0 + 20.0 T \implies (35.0 \cos\theta - 20.0) T = 1200.0$$
Divide the $x$-equation by the $y$-equation:
$$\frac{35.0 \cos\theta - 20.0}{35.0 \sin\theta} = \frac{1200.0}{500.0} = 2.40$$
$$35.0 \cos\theta - 20.0 = 84.0 \sin\theta \implies 35.0 \cos\theta - 84.0 \sin\theta = 20.0$$
Dividing by 7:
$$5.0 \cos\theta - 12.0 \sin\theta = \frac{20}{7} \approx 2.8571$$
Rewrite as $R \cos(\theta + \phi)$:
$$R = \sqrt{5.0^2 + 12.0^2} = \sqrt{25 + 144} = \sqrt{169} = 13.0$$
$$\tan\phi = \frac{12.0}{5.0} = 2.40 \implies \phi = 67.380^\circ$$
$$13.0 \cos(\theta + 67.380^\circ) = 2.8571 \implies \cos(\theta + 67.380^\circ) = \frac{2.8571}{13.0} = 0.21978$$
$$\theta + 67.380^\circ = \arccos(0.21978) = 77.304^\circ$$
$$\theta = 77.304^\circ - 67.380^\circ = 9.924^\circ \approx 9.92^\circ\,\text{North of East}$$

**(b) Intercept time:**
$$T = \frac{500.0}{35.0 \sin(9.924^\circ)} = \frac{500.0}{35.0 \times 0.17234} = \frac{500.0}{6.0319} = 82.89\,\text{s} \approx 82.9\,\text{s}$$

---

### Solution 9.7
**(a) Upstream heading for minimum drift:**
$$\sin\theta^* = \frac{v_k}{v_w} = \frac{2.50}{4.00} = 0.6250$$
$$\theta^* = \arcsin(0.6250) = 38.682^\circ \approx 38.7^\circ\,\text{upstream}$$

**(b) Minimum downstream drift:**
$$\cos\theta^* = \sqrt{1 - (0.625)^2} = \sqrt{1 - 0.390625} = \sqrt{0.609375} = 0.780625$$
Across-river speed: $v_y = 2.50 \times 0.780625 = 1.95156\,\text{m/s}$.
Crossing time: $t = \frac{500.0}{1.95156} = 256.205\,\text{s}$.
Downstream speed: $v_x = 4.00 - 2.50(0.625) = 4.00 - 1.5625 = 2.4375\,\text{m/s}$.
$$x_{\text{drift}} = 2.4375\,\text{m/s} \times 256.205\,\text{s} = 624.50\,\text{m} \approx 624.5\,\text{m}$$

**(c) Crossing time:**
$$T = 256.2\,\text{s} \approx 4.27\,\text{min}$$

---

### Solution 9.8
**(a) Time of closest approach:**
$$\vec{r}_1(t) = 200.0 t\,\hat{i} + 10000.0\,\hat{j}$$
$$\vec{r}_2(t) = 15000.0\,\hat{i} + 150.0 t\,\hat{j}$$
$$\vec{r}_{\text{rel}}(t) = \vec{r}_2(t) - \vec{r}_1(t) = (15000.0 - 200.0 t)\,\hat{i} + (-10000.0 + 150.0 t)\,\hat{j}$$
$$\vec{r}_{0,\text{rel}} = 15000.0\,\hat{i} - 10000.0\,\hat{j}\,\text{m}$$
$$\vec{v}_{\text{rel}} = -200.0\,\hat{i} + 150.0\,\hat{j}\,\text{m/s}$$
$$\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}} = (15000.0 \times -200.0) + (-10000.0 \times 150.0) = -3000000 - 1500000 = -4500000\,\text{m}^2/\text{s}$$
$$|\vec{v}_{\text{rel}}|^2 = (-200.0)^2 + (150.0)^2 = 40000 + 22500 = 62500\,\text{m}^2/\text{s}^2$$
$$t_{\text{closest}} = -\frac{-4500000}{62500} = 72.00\,\text{s}$$

**(b) Minimum separation distance:**
$$\vec{r}_{\text{rel}}(72.0) = [15000.0 - 200.0(72.0)]\,\hat{i} + [-10000.0 + 150.0(72.0)]\,\hat{j}$$
$$\vec{r}_{\text{rel}} = (15000.0 - 14400.0)\,\hat{i} + (-10000.0 + 10800.0)\,\hat{j} = 600.0\,\hat{i} + 800.0\,\hat{j}\,\text{m}$$
$$D_{\text{min}} = \sqrt{(600.0)^2 + (800.0)^2} = \sqrt{360000 + 640000} = \sqrt{1000000} = 1000.0\,\text{m} = 1.00\,\text{km}$$

---

### Solution 9.9
**(a) Flight time:**
The vertical motion is completely unaffected by horizontal cart acceleration:
$$T = \frac{2 v_0}{g} = \frac{2 \times 14.7\,\text{m/s}}{9.80\,\text{m/s}^2} = 3.00\,\text{s}$$

**(b) Landing position relative to cart:**
Horizontal displacement of ball relative to ground:
The ball retains the cart's horizontal velocity at launch $u = 6.00\,\text{m/s}$:
$$x_{\text{ball}}(T) = u T = 6.00 \times 3.00 = 18.0\,\text{m}$$
Displacement of the accelerating cart:
$$x_{\text{cart}}(T) = u T + \frac{1}{2} a_c T^2 = 6.00(3.00) + 0.5(3.00)(3.00)^2 = 18.0 + 13.5 = 31.5\,\text{m}$$
Distance behind the cart:
$$\Delta x = x_{\text{cart}} - x_{\text{ball}} = 31.5\,\text{m} - 18.0\,\text{m} = 13.5\,\text{m}\,\text{behind the cart}$$

**(c) Trajectory as viewed by an observer on the cart:**
In the cart's non-inertial accelerating frame:
$$x'(t) = -\frac{1}{2} a_c t^2 = -1.50 t^2$$
$$y'(t) = v_0 t - \frac{1}{2} g t^2 = 14.7 t - 4.90 t^2$$
Eliminating $t = \sqrt{-x'/1.50}$:
The path is a curved parabolic branch bending backward behind the cart.

---

### Solution 9.10
Let Vessel A be at the origin at $t = 0$. $\vec{v}_A = 15.0\,\hat{i}\,\text{knots}$.
Vessel B initial position:
$$\vec{r}_{B0} = 10.0 \cos(45^\circ)\,\hat{i} + 10.0 \sin(45^\circ)\,\hat{j} = 7.071\,\hat{i} + 7.071\,\hat{j}\,\text{NM}$$
The line of sight from B to A is along the vector:
$$\vec{r}_{A/B} = -\vec{r}_{B0} = -7.071\,\hat{i} - 7.071\,\hat{j}$$
The unit line-of-sight vector is:
$$\hat{u}_{\text{LOS}} = -\frac{\sqrt{2}}{2}\,\hat{i} - \frac{\sqrt{2}}{2}\,\hat{j}$$

For CBDR collision, the relative velocity $\vec{v}_{B/A} = \vec{v}_B - \vec{v}_A$ must be directed directly along $\hat{u}_{\text{LOS}}$:
$$\vec{v}_{B/A} = -k \big( \hat{i} + \hat{j} \big) \quad (k > 0)$$
This requires that the components of relative velocity be equal:
$$v_{B/A, x} = v_{B/A, y}$$
Since $\vec{v}_{B/A} = (v_B \cos\theta - 15.0)\,\hat{i} + (v_B \sin\theta)\,\hat{j}$:
$$v_B \cos\theta - 15.0 = v_B \sin\theta$$
$$22.0 (\cos\theta - \sin\theta) = 15.0 \implies \cos\theta - \sin\theta = \frac{15.0}{22.0} \approx 0.681818$$

Using $\cos\theta - \sin\theta = \sqrt{2} \cos(\theta + 45^\circ)$:
$$\sqrt{2} \cos(\theta + 45^\circ) = 0.681818 \implies \cos(\theta + 45^\circ) = \frac{0.681818}{1.414214} = 0.482118$$
$$\theta + 45.0^\circ = \pm \arccos(0.482118) = \pm 61.176^\circ$$
To point generally southwest toward Vessel A ($\cos\theta < 0, \sin\theta < 0$):
$$\theta + 45.0^\circ = -61.176^\circ \implies \theta = -106.18^\circ = 253.82^\circ$$
Testing this angle:
$\cos(253.82^\circ) = -0.2786, \quad \sin(253.82^\circ) = -0.9604$.
Then $v_{B/A, x} = 22.0(-0.2786) - 15.0 = -6.13 - 15.0 = -21.13\,\text{knots}$.
$v_{B/A, y} = 22.0(-0.9604) = -21.13\,\text{knots}$.
The relative velocity components are exactly equal and negative!
Course heading: $\theta = 253.8^\circ$ (or $16.2^\circ$ South of West).
