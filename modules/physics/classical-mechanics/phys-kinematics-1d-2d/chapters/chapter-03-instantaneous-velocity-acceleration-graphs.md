# Chapter 3: Instantaneous Velocity, Acceleration, and Graphical Calculus

> *"An average velocity tells you where a traveler arrived at the end of the day; instantaneous velocity reveals the needle of the speedometer at the exact millisecond a deer leaped across the highway. To understand real physical motion, we must read the subtle contours of motion graphs — where geometric slopes unveil velocity and acceleration, and shaded areas compute the ground traversed."*

---

## 3.1 From Average to Instantaneous: The Need for Precision

In Chapter 2, we saw that average velocity over an interval $\Delta t = t_2 - t_1$ is:

$$v_{\text{avg}} = \frac{\Delta x}{\Delta t} = \frac{x_2 - x_1}{t_2 - t_1}$$

While average velocity is useful for estimating total transit times, it conceals everything that happened during the journey. A vehicle could have been cruising at steady speed, accelerating wildly, or sitting motionless at red lights; as long as it covered distance $\Delta x$ in time $\Delta t$, the average velocity remains the same.

In physics and engineering, we need to know the state of motion at a single, exact moment $t_0$. 
This is the **Instantaneous Velocity**:

$$v(t) = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t} = \frac{dx}{dt}$$

Instantaneous velocity is the derivative of position with respect to time.
- Geometrically, while average velocity is the slope of a **secant line** between two separated points on an $x-t$ curve, instantaneous velocity is the slope of the **tangent line** grazing the curve at that single instant.
- The scalar magnitude of instantaneous velocity is the **instantaneous speed**: $\text{Speed} = |v(t)| = \left|\frac{dx}{dt}\right|$.

---

## 3.2 Defining Acceleration: The Velocity Pulse

When you press the accelerator pedal in an electric car, you do not instantly leap from $0$ to $100\text{ km/h}$. Your velocity must smoothly transition across all intermediate values. The rate at which that transition occurs is **acceleration**.

### 1. Average Acceleration ($a_{\text{avg}}$)
The average rate of change of velocity over a time interval $\Delta t = t_2 - t_1$:

$$a_{\text{avg}} = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{t_2 - t_1}$$

### 2. Instantaneous Acceleration ($a(t)$)
The instantaneous rate of change of velocity at moment $t$:

$$a(t) = \lim_{\Delta t \to 0} \frac{\Delta v}{\Delta t} = \frac{dv}{dt} = \frac{d^2x}{dt^2}$$

Acceleration is the first derivative of velocity, and the second derivative of position.

### Why is the Second Squared in $\text{m/s}^2$?
Beginners are often confused by the units of acceleration: $\text{meters per second squared}$ ($\text{m/s}^2$).
Think of it not as "seconds squared," but as:

$$\frac{\text{meters per second}}{\text{second}} = \frac{\text{m/s}}{\text{s}}$$

An acceleration of $+5.0\text{ m/s}^2$ means that **for every single second that ticks by, the object's velocity increases by $5.0\text{ meters per second}$**:
- At $t = 0\text{ s}$: $v = 0\text{ m/s}$
- At $t = 1\text{ s}$: $v = 5\text{ m/s}$
- At $t = 2\text{ s}$: $v = 10\text{ m/s}$
- At $t = 3\text{ s}$: $v = 15\text{ m/s}$

---

## 3.3 The Definitive Criterion: Speeding Up vs. Slowing Down

One of the most pervasive traps in introductory physics is the assumption that positive acceleration always means speeding up, and negative acceleration always means slowing down.

Consider a vehicle reversing down a ramp:
- Its velocity is negative: $v = -15\text{ m/s}$ (moving backward).
- Its driver hits the accelerator in reverse, applying a negative acceleration: $a = -4\text{ m/s}^2$.
- One second later, the velocity is:
  $$v_{\text{new}} = -15 + (-4)(1) = -19\text{ m/s}$$
- What happened to its speed? Its speed was $|-15| = 15\text{ m/s}$; now its speed is $|-19| = 19\text{ m/s}$.
- The vehicle **sped up**, despite acceleration being strictly negative!

```
                  +---------------------------------------------------------+
                  |                      THE SIGN TEST                      |
                  +---------------------------------------------------------+
                  |  v > 0  and  a > 0   ===>   SPEEDING UP (Forward)       |
                  |  v < 0  and  a < 0   ===>   SPEEDING UP (Reverse)       |
                  |  v > 0  and  a < 0   ===>   SLOWING DOWN (Braking)      |
                  |  v < 0  and  a > 0   ===>   SLOWING DOWN (Braking Rev)  |
                  +---------------------------------------------------------+
```

### The Inviolable Mathematical Law
Examine the derivative of speed squared ($v^2$):

$$\frac{d}{dt}\left[ (v(t))^2 \right] = 2 v(t) \cdot \frac{dv}{dt} = 2 v(t) a(t)$$

Since speed is $|v| = \sqrt{v^2}$, speed is strictly increasing whenever $v^2$ is increasing:

$$\mathbf{v(t) \cdot a(t) > 0 \iff \text{The body is SPEEDING UP}}$$
$$\mathbf{v(t) \cdot a(t) < 0 \iff \text{The body is SLOWING DOWN}}$$

- **Same Signs** ($++$ or $--$) $\implies$ Speed is **increasing**.
- **Opposite Signs** ($+-$ or $-+$) $\implies$ Speed is **decreasing**.

---

## 3.4 The Holy Trinity of Kinematic Graphs

Every 1D physical motion can be represented across three interconnected graphs sharing a common time axis $t$:

```
   1. Position-Time (x-t)
      x ^            .-' (Slope = Velocity v)
        |          .'
        |      _.-'    Concave Up   ===> a > 0
        |  _.-'        Concave Down ===> a < 0
        +-----------------------------------> t

   2. Velocity-Time (v-t)
      v ^              .-.
        |  +Area      /   \    (Slope = Acceleration a)
        |  ======>   /     \   (Area Under Curve = Displacement Δx)
        +-----------+-------+-------------> t
        |            -Area   \     /
        |            ======>  '---'

   3. Acceleration-Time (a-t)
      a ^         +---------+
        |         |  +Area  |  (Area Under Curve = Velocity Change Δv)
        +---------+---------+-------------> t
```

### Operation 1: Moving Down the Ladder (Differentiation / Slopes)
- From **$x-t$** to **$v-t$**: The slope of the tangent to the position curve gives velocity:
  $$v(t) = \frac{dx}{dt}$$
- From **$v-t$** to **$a-t$**: The slope of the tangent to the velocity curve gives acceleration:
  $$a(t) = \frac{dv}{dt}$$

### Operation 2: Moving Up the Ladder (Integration / Areas)
- From **$a-t$** to **$v-t$**: The area between the acceleration curve and the time axis equals the **change in velocity**:
  $$\Delta v = v(t_2) - v(t_1) = \int_{t_1}^{t_2} a(t) \, dt$$
- From **$v-t$** to **$x-t$**: The area between the velocity curve and the time axis equals the **net displacement**:
  $$\Delta x = x(t_2) - x(t_1) = \int_{t_1}^{t_2} v(t) \, dt$$

---

## 3.5 Reading Geometric Area from $v-t$ Graphs

When working with piecewise-linear velocity graphs (composed of flat lines, ramps, and triangles), you do not need calculus integrals. You can compute exact displacements using elementary geometry:

$$\text{Rectangle Area} = \text{base} \times \text{height} = \Delta t \times v$$
$$\text{Triangle Area} = \frac{1}{2} \times \text{base} \times \text{height} = \frac{1}{2} \Delta t \times v$$
$$\text{Trapezoid Area} = \frac{v_1 + v_2}{2} \times \text{base} = \frac{v_1 + v_2}{2} \Delta t$$

### Positive vs Negative Areas
- Regions where the velocity graph lies **above the time axis** ($v > 0$) contribute **positive displacement** ($+\Delta x$, moving forward).
- Regions where the velocity graph lies **below the time axis** ($v < 0$) contribute **negative displacement** ($-\Delta x$, moving backward).

$$\mathbf{\Delta x_{\text{net}} = \text{Area}_{\text{above}} - \text{Area}_{\text{below}}}$$
$$\mathbf{d_{\text{total}} = |\text{Area}_{\text{above}}| + |\text{Area}_{\text{below}}|}$$

---

## 3.6 Ten Progressive Worked Numerical Examples

### Example 3.1: Differentiating an Analytic Position Function
**Problem:** A robotic linear actuator moves along a rail with position given by:
$$x(t) = 2.0 t^3 - 9.0 t^2 + 12.0 t + 5.0\text{ meters} \quad (t \ge 0)$$
1. Derive expressions for instantaneous velocity $v(t)$ and instantaneous acceleration $a(t)$.
2. Find the position, velocity, and acceleration at $t = 3.0\text{ seconds}$.
3. State whether the actuator is speeding up or slowing down at $t = 3.0\text{ seconds}$.

**Step 1:** Differentiate with respect to time:
$$v(t) = \frac{dx}{dt} = \frac{d}{dt}[2.0 t^3 - 9.0 t^2 + 12.0 t + 5.0] = 6.0 t^2 - 18.0 t + 12.0\text{ m/s}$$
$$a(t) = \frac{dv}{dt} = \frac{d}{dt}[6.0 t^2 - 18.0 t + 12.0] = 12.0 t - 18.0\text{ m/s}^2$$

**Step 2:** Evaluate state at $t = 3.0\text{ s}$:
$$x(3.0) = 2.0(3^3) - 9.0(3^2) + 12.0(3) + 5.0 = 2(27) - 9(9) + 36 + 5 = 54 - 81 + 36 + 5 = +14.0\text{ meters}$$
$$v(3.0) = 6.0(3^2) - 18.0(3) + 12.0 = 6(9) - 54 + 12 = 54 - 54 + 12 = +12.0\text{ m/s}$$
$$a(3.0) = 12.0(3) - 18.0 = 36 - 18 = +18.0\text{ m/s}^2$$

**Step 3:** Test speeding up vs slowing down:
$$v(3.0) = +12.0\text{ m/s} > 0$$
$$a(3.0) = +18.0\text{ m/s}^2 > 0$$
$$v(3.0) \cdot a(3.0) = (+12.0)(+18.0) = +216.0 > 0$$
Since velocity and acceleration share the same positive sign, the actuator is **speeding up**.

---

### Example 3.2: Finding Rest Points and Turning Points
**Problem:** For the actuator in Example 3.1 ($v(t) = 6.0 t^2 - 18.0 t + 12.0$):
1. Determine all moments when the actuator is momentarily at rest.
2. Determine the actuator's position and acceleration at each rest point.
3. Classify whether each rest point is a local maximum or minimum position.

**Step 1:** Set velocity to zero:
$$6.0 t^2 - 18.0 t + 12.0 = 0$$
Divide through by $6.0$:
$$t^2 - 3.0 t + 2.0 = 0 \implies (t - 1.0)(t - 2.0) = 0$$
The actuator is at rest at $t_1 = 1.0\text{ second}$ and $t_2 = 2.0\text{ seconds}$.

**Step 2:** Evaluate state at $t_1 = 1.0\text{ s}$:
$$x(1.0) = 2.0(1) - 9.0(1) + 12.0(1) + 5.0 = 2 - 9 + 12 + 5 = +10.0\text{ meters}$$
$$a(1.0) = 12.0(1) - 18.0 = -6.0\text{ m/s}^2$$
Because $a(1.0) < 0$ (concave down), $x = 10.0\text{ m}$ is a **local maximum position** (the actuator reaches a peak forward position and reverses).

**Step 3:** Evaluate state at $t_2 = 2.0\text{ s}$:
$$x(2.0) = 2.0(8) - 9.0(4) + 12.0(2) + 5.0 = 16 - 36 + 24 + 5 = +9.0\text{ meters}$$
$$a(2.0) = 12.0(2) - 18.0 = 24 - 18 = +6.0\text{ m/s}^2$$
Because $a(2.0) > 0$ (concave up), $x = 9.0\text{ m}$ is a **local minimum position** (the actuator reaches its lowest reverse dip and accelerates forward again).

---

### Example 3.3: Complete Speeding Up vs Slowing Down Timeline
**Problem:** For the actuator in Examples 3.1 and 3.2, establish the complete timeline intervals for $t \ge 0$ showing where it moves forward vs backward, and where it is speeding up vs slowing down.

**Step 1:** Identify critical points of velocity and acceleration:
- Velocity zeros: $t = 1.0\text{ s}, \ 2.0\text{ s}$
- Acceleration zero ($a(t) = 12t - 18 = 0$): $t = 1.5\text{ s}$

These three points divide time into four distinct intervals:
1. $t \in [0, 1.0)$
2. $t \in (1.0, 1.5)$
3. $t \in (1.5, 2.0)$
4. $t \in (2.0, \infty)$

**Step 2:** Construct the sign diagnostic table:

| Time Interval | Test $t$ | $v(t)$ Sign | Direction | $a(t)$ Sign | $v \cdot a$ | Motion State |
| :---: | :---: | :---: | :--- | :---: | :---: | :--- |
| **$[0, 1.0)$** | $t = 0.5$ | $6(0.25) - 9 + 12 = +4.5$ ($+$) | Forward | $12(0.5) - 18 = -12$ ($-$) | **Negative** | **SLOWING DOWN** |
| **$(1.0, 1.5)$** | $t = 1.2$ | $6(1.44) - 21.6 + 12 = -0.96$ ($-$) | Reverse | $12(1.2) - 18 = -3.6$ ($-$) | **Positive** | **SPEEDING UP** |
| **$(1.5, 2.0)$** | $t = 1.8$ | $6(3.24) - 32.4 + 12 = -0.96$ ($-$) | Reverse | $12(1.8) - 18 = +3.6$ ($+$) | **Negative** | **SLOWING DOWN** |
| **$(2.0, \infty)$** | $t = 3.0$ | $6(9) - 54 + 12 = +12.0$ ($+$) | Forward | $12(3) - 18 = +18.0$ ($+$) | **Positive** | **SPEEDING UP** |

**Conclusion:**
- Notice interval $(1.0, 1.5)$: Velocity is negative and acceleration is negative. The rover is moving backward and **speeding up in reverse**!

---

### Example 3.4: Displacement from a Velocity-Time Trapezoid
**Problem:** A light rail train departs Station 1 and arrives at Station 2 along a straight track:
- Accelerates uniformly from rest to $v = +24.0\text{ m/s}$ in $20\text{ seconds}$.
- Cruises at a constant velocity of $+24.0\text{ m/s}$ for $60\text{ seconds}$.
- Brakes uniformly to a complete stop in $15\text{ seconds}$.
1. Sketch/characterize the geometric regions of the $v-t$ graph.
2. Calculate the acceleration during the speeding-up, cruising, and braking phases.
3. Compute the total distance between the two stations by calculating the area under the $v-t$ graph.

**Step 1:** Phase characteristics:
- Phase 1 (Speeding up): $t \in [0, 20\text{ s}]$, triangle from $(0, 0)$ to $(20, 24)$.
- Phase 2 (Cruising): $t \in [20, 80\text{ s}]$, rectangle of width $60\text{ s}$ and height $24\text{ m/s}$.
- Phase 3 (Braking): $t \in [80, 95\text{ s}]$, triangle from $(80, 24)$ to $(95, 0)$.

**Step 2:** Accelerations (slopes):
- Phase 1: $a_1 = \frac{24.0 - 0}{20.0 - 0} = +1.20\text{ m/s}^2$
- Phase 2: $a_2 = \frac{24.0 - 24.0}{60.0} = 0.00\text{ m/s}^2$
- Phase 3: $a_3 = \frac{0 - 24.0}{95.0 - 80.0} = \frac{-24.0}{15.0} = -1.60\text{ m/s}^2$

**Step 3:** Total displacement using trapezoid area:
- Bottom base: $B = 95.0\text{ seconds}$
- Top base: $b = 60.0\text{ seconds}$
- Height: $h = 24.0\text{ m/s}$
$$\Delta x = \frac{B + b}{2} \times h = \frac{95.0 + 60.0}{2} \times 24.0 = \frac{155.0}{2} \times 24.0 = 155.0 \times 12.0 = 1860.0\text{ meters}$$

*(Verification via sub-areas:)*
- Area 1 (Triangle): $\frac{1}{2}(20)(24) = 240\text{ m}$
- Area 2 (Rectangle): $60 \times 24 = 1440\text{ m}$
- Area 3 (Triangle): $\frac{1}{2}(15)(24) = 180\text{ m}$
$$\text{Total} = 240 + 1440 + 180 = 1860.0\text{ meters}$$

**Conclusion:** The distance between the stations is $1.86\text{ km}$.

---

### Example 3.5: Signed Area with Positive and Negative Velocities
**Problem:** An autonomous mining shuttle drives along an underground haulage tunnel. Its velocity over a $30\text{-second}$ interval is recorded on a $v-t$ graph:
- $t \in [0, 10\text{ s}]$: $v$ increases linearly from $0$ to $+8.0\text{ m/s}$.
- $t \in [10, 18\text{ s}]$: $v$ decreases linearly from $+8.0\text{ m/s}$ to $-4.0\text{ m/s}$, crossing $v = 0$ at $t = 15.33\text{ s}$.
  Let us choose clean integer timing:
  $v$ decreases from $+8.0\text{ m/s}$ at $t = 10\text{ s}$ to $0$ at $t = 14\text{ s}$ (slope $-2.0\text{ m/s}^2$), and continues decreasing to $-6.0\text{ m/s}$ at $t = 17\text{ s}$.
- $t \in [17, 25\text{ s}]$: cruises at constant $v = -6.0\text{ m/s}$.
- $t \in [25, 30\text{ s}]$: brakes linearly from $-6.0\text{ m/s}$ to $0$.
Calculate:
1. The total forward displacement ($\text{Area}_{\text{above}}$).
2. The total reverse displacement ($\text{Area}_{\text{below}}$).
3. The net displacement $\Delta x_{\text{net}}$ and total distance $d_{\text{total}}$.

**Step 1:** Forward motion ($v > 0$, $t \in [0, 14\text{ s}]$):
- Sub-region 1 ($t = 0 \to 10$): Triangle, base $10\text{ s}$, height $+8\text{ m/s}$.
  $$A_1 = \frac{1}{2}(10)(8) = +40.0\text{ meters}$$
- Sub-region 2 ($t = 10 \to 14$): Triangle, base $4\text{ s}$, height $+8\text{ m/s}$.
  $$A_2 = \frac{1}{2}(4)(8) = +16.0\text{ meters}$$
$$\text{Total Forward Displacement} = A_1 + A_2 = 40.0 + 16.0 = +56.0\text{ meters}$$

**Step 2:** Reverse motion ($v < 0$, $t \in [14, 30\text{ s}]$):
- Sub-region 3 ($t = 14 \to 17$): Triangle, base $3\text{ s}$, height $-6\text{ m/s}$.
  $$A_3 = \frac{1}{2}(3)(-6) = -9.0\text{ meters}$$
- Sub-region 4 ($t = 17 \to 25$): Rectangle, base $8\text{ s}$, height $-6\text{ m/s}$.
  $$A_4 = 8 \times (-6) = -48.0\text{ meters}$$
- Sub-region 5 ($t = 25 \to 30$): Triangle, base $5\text{ s}$, height $-6\text{ m/s}$.
  $$A_5 = \frac{1}{2}(5)(-6) = -15.0\text{ meters}$$
$$\text{Total Reverse Displacement} = A_3 + A_4 + A_5 = -9.0 - 48.0 - 15.0 = -72.0\text{ meters}$$

**Step 3:** Net displacement and total distance:
$$\Delta x_{\text{net}} = (+56.0\text{ m}) + (-72.0\text{ m}) = -16.0\text{ meters}$$
$$d_{\text{total}} = |+56.0| + |-72.0| = 56.0 + 72.0 = 128.0\text{ meters}$$

**Conclusion:** The shuttle is $16.0\text{ meters}$ behind its starting point, having traversed $128.0\text{ meters}$ of total tire track distance.

---

### Example 3.6: Reconstructing Velocity from Acceleration-Time ($a-t$) Graph
**Problem:** A stationary drone starts at $t = 0$ with $v(0) = 0$. Its vertical acceleration over a $12\text{-second}$ flight test is:
- $t \in [0, 4\text{ s}]$: constant acceleration $a = +3.0\text{ m/s}^2$.
- $t \in [4, 8\text{ s}]$: zero acceleration $a = 0.0\text{ m/s}^2$.
- $t \in [8, 12\text{ s}]$: constant deceleration $a = -2.0\text{ m/s}^2$.
1. Compute the velocity at $t = 4\text{ s}, 8\text{ s}, 12\text{ s}$.
2. Sketch the resulting velocity function.
3. Compute the drone's altitude at $t = 12\text{ seconds}$.

**Step 1:** Velocity changes via areas on the $a-t$ graph:
- Interval 1 ($0 \to 4\text{ s}$):
  $$\Delta v_{0\to 4} = a_1 \times \Delta t_1 = (+3.0\text{ m/s}^2) \times (4\text{ s}) = +12.0\text{ m/s}$$
  $$v(4) = v(0) + \Delta v = 0 + 12.0 = +12.0\text{ m/s}$$
- Interval 2 ($4 \to 8\text{ s}$):
  $$\Delta v_{4\to 8} = 0 \times 4 = 0\text{ m/s} \implies v(8) = v(4) = +12.0\text{ m/s}$$
- Interval 3 ($8 \to 12\text{ s}$):
  $$\Delta v_{8\to 12} = (-2.0\text{ m/s}^2) \times (4\text{ s}) = -8.0\text{ m/s}$$
  $$v(12) = v(8) + \Delta v = 12.0 - 8.0 = +4.0\text{ m/s}$$

**Step 2:** Compute altitude using areas under the resulting $v-t$ curve:
- Triangle from $t = 0 \to 4$: Area $= \frac{1}{2}(4)(12) = 24.0\text{ meters}$.
- Rectangle from $t = 4 \to 8$: Area $= 4 \times 12 = 48.0\text{ meters}$.
- Trapezoid from $t = 8 \to 12$: Area $= \frac{12 + 4}{2} \times 4 = \frac{16}{2} \times 4 = 32.0\text{ meters}$.

**Step 3:** Total altitude at $t = 12\text{ s}$:
$$y(12) = 24.0 + 48.0 + 32.0 = 104.0\text{ meters}$$

---

### Example 3.7: Mathematical Concavity and Acceleration Sign
**Problem:** An object's position curve on an $x-t$ graph passes through point $(4.0, 20.0)$ with a horizontal tangent line. The curve near this point is concave downward like an upside-down bowl ($\cap$).
1. What is the object's velocity at $t = 4.0\text{ s}$?
2. What is the sign of its acceleration at $t = 4.0\text{ s}$?
3. Describe the object's motion immediately before and immediately after $t = 4.0\text{ s}$.

**Step 1:** Tangent slope is horizontal:
$$\text{Slope} = 0 \implies v(4.0) = 0.0\text{ m/s}$$
The object is momentarily at rest.

**Step 2:** Concave downward means the second derivative is negative:
$$a(4.0) = x''(4.0) < 0$$
Acceleration is strictly negative.

**Step 3:** Physical motion description:
- Immediately before $t = 4.0\text{ s}$: Position was increasing, so $v > 0$. Since $a < 0$, $v \cdot a < 0$, meaning the object was moving forward and **slowing down** as it approached the peak.
- At $t = 4.0\text{ s}$: Object momentarily stops at peak position $x = 20.0\text{ m}$.
- Immediately after $t = 4.0\text{ s}$: Position begins decreasing, so $v < 0$. Since $a < 0$, $v \cdot a > 0$, meaning the object is moving backward and **speeding up in reverse**.

---

### Example 3.8: Continuous Non-Polynomial Acceleration Integration
**Problem:** A high-speed electric boat thruster produces an acceleration governed by $a(t) = 6.0 \sqrt{t}\text{ m/s}^2$ for $t \ge 0$. The boat starts from rest ($v(0) = 0$) at position $x(0) = 0$.
1. Derive the analytic formula for velocity $v(t)$.
2. Derive the analytic formula for position $x(t)$.
3. Compute the velocity and position at $t = 4.0\text{ seconds}$.

**Step 1:** Integrate acceleration to find velocity:
$$v(t) = \int a(t) \, dt = \int 6.0 t^{1/2} \, dt = 6.0 \left(\frac{t^{3/2}}{3/2}\right) + C_1 = 6.0 \left(\frac{2}{3}\right) t^{3/2} + C_1 = 4.0 t^{3/2} + C_1$$
Since $v(0) = 0$, $C_1 = 0$:
$$v(t) = 4.0 t^{3/2}\text{ m/s}$$

**Step 2:** Integrate velocity to find position:
$$x(t) = \int v(t) \, dt = \int 4.0 t^{3/2} \, dt = 4.0 \left(\frac{t^{5/2}}{5/2}\right) + C_2 = 4.0 \left(\frac{2}{5}\right) t^{5/2} + C_2 = 1.6 t^{5/2} + C_2$$
Since $x(0) = 0$, $C_2 = 0$:
$$x(t) = 1.6 t^{5/2}\text{ meters}$$

**Step 3:** Evaluate at $t = 4.0\text{ s}$:
$$4.0^{3/2} = (\sqrt{4})^3 = 2^3 = 8 \implies v(4.0) = 4.0(8) = 32.0\text{ m/s}$$
$$4.0^{5/2} = (\sqrt{4})^5 = 2^5 = 32 \implies x(4.0) = 1.6(32) = 51.2\text{ meters}$$

---

### Example 3.9: Converting an $x-t$ Piecewise Function to $v-t$ and $a-t$
**Problem:** A robotic arm position over $10\text{ seconds}$ is described by:
$$x(t) = \begin{cases} 2.0 t^2, & 0 \le t \le 3 \\ 12.0 t - 18.0, & 3 < t \le 7 \\ -1.5 t^2 + 33.0 t - 91.5, & 7 < t \le 10 \end{cases}$$
1. Show that the position and velocity are continuous at the transition points $t = 3\text{ s}$ and $t = 7\text{ s}$.
2. Write the equations for $v(t)$ and $a(t)$ across all three segments.

**Step 1:** First derivatives (velocity):
- Segment 1 ($0 \le t \le 3$): $v_1(t) = \frac{d}{dt}[2.0 t^2] = 4.0 t$
- Segment 2 ($3 < t \le 7$): $v_2(t) = \frac{d}{dt}[12.0 t - 18.0] = 12.0$
- Segment 3 ($7 < t \le 10$): $v_3(t) = \frac{d}{dt}[-1.5 t^2 + 33.0 t - 91.5] = -3.0 t + 33.0$

**Step 2:** Test continuity at $t = 3\text{ s}$:
- Position left: $x_1(3) = 2(3^2) = 18.0\text{ m}$.
- Position right: $x_2(3) = 12(3) - 18 = 36 - 18 = 18.0\text{ m}$. (Continuous!)
- Velocity left: $v_1(3) = 4(3) = 12.0\text{ m/s}$.
- Velocity right: $v_2(3) = 12.0\text{ m/s}$. (Continuous!)

**Step 3:** Test continuity at $t = 7\text{ s}$:
- Position left: $x_2(7) = 12(7) - 18 = 84 - 18 = 66.0\text{ m}$.
- Position right: $x_3(7) = -1.5(49) + 33(7) - 91.5 = -73.5 + 231 - 91.5 = 66.0\text{ m}$. (Continuous!)
- Velocity left: $v_2(7) = 12.0\text{ m/s}$.
- Velocity right: $v_3(7) = -3.0(7) + 33.0 = -21.0 + 33.0 = 12.0\text{ m/s}$. (Continuous!)

**Step 4:** Second derivatives (acceleration):
$$a(t) = \begin{cases} +4.0\text{ m/s}^2, & 0 \le t < 3 \\ 0.0\text{ m/s}^2, & 3 < t < 7 \\ -3.0\text{ m/s}^2, & 7 < t \le 10 \end{cases}$$

---

### Example 3.10: Emergency Braking and Stopping Distance from Velocity Area
**Problem:** An autonomous heavy transport truck traveling at $v_0 = 32.0\text{ m/s}$ ($115.2\text{ km/h}$) detects a fallen tree on the road. The safety computer takes $\Delta t_{\text{react}} = 0.50\text{ seconds}$ of sensor processing and actuator latency before brakes engage. Once engaged, the brakes apply a constant deceleration of $a = -4.0\text{ m/s}^2$.
1. Construct the velocity-time function $v(t)$ from detection ($t = 0$) until the truck halts.
2. Find the total time to come to a complete stop.
3. Calculate the total stopping distance by computing the area under the $v-t$ graph.

**Step 1:** Motion phases:
- Phase 1 (Reaction delay, $t \in [0, 0.5\text{ s}]$): Velocity remains constant at $v = 32.0\text{ m/s}$.
- Phase 2 (Active braking, $t > 0.5\text{ s}$): Velocity decreases from $32.0\text{ m/s}$ at rate $a = -4.0\text{ m/s}^2$:
  $$v(t) = 32.0 - 4.0(t - 0.5)$$

**Step 2:** Braking time duration:
The truck stops when $v = 0$:
$$32.0 - 4.0 \Delta t_{\text{brake}} = 0 \implies 4.0 \Delta t_{\text{brake}} = 32.0 \implies \Delta t_{\text{brake}} = 8.0\text{ seconds}$$
Total time from hazard detection:
$$t_{\text{stop}} = \Delta t_{\text{react}} + \Delta t_{\text{brake}} = 0.50 + 8.00 = 8.50\text{ seconds}$$

**Step 3:** Calculate stopping distance via geometric areas under $v-t$:
- Area 1 (Reaction distance, rectangle):
  $$d_{\text{react}} = v_0 \times \Delta t_{\text{react}} = 32.0\text{ m/s} \times 0.50\text{ s} = 16.0\text{ meters}$$
- Area 2 (Braking distance, triangle):
  $$d_{\text{brake}} = \frac{1}{2} \times \text{base} \times \text{height} = \frac{1}{2} \times (8.0\text{ s}) \times (32.0\text{ m/s}) = 128.0\text{ meters}$$
- Total stopping distance:
  $$d_{\text{total}} = d_{\text{react}} + d_{\text{brake}} = 16.0\text{ m} + 128.0\text{ m} = 144.0\text{ meters}$$

**Conclusion:** The truck requires $8.50\text{ seconds}$ and $144.0\text{ meters}$ to halt completely.

---

## 3.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Derivatives and State Evaluation (Foundational)
- **Exercise 3.1:** A particle moves with position $x(t) = 5.0 t^2 - 20.0 t + 8.0$ meters. Find formulas for velocity $v(t)$ and acceleration $a(t)$, and evaluate both at $t = 3.0\text{ seconds}$.
- **Exercise 3.2:** For the particle in Exercise 3.1, determine the time when the particle momentarily comes to rest, and state its coordinate at that instant.

### Tier 2: Speeding Up vs. Slowing Down Analysis
- **Exercise 3.3:** A drone's altitude is governed by $y(t) = -t^3 + 6t^2 + 15t + 2$ meters ($t \ge 0$). Determine whether the drone is speeding up or slowing down at $t = 1.0\text{ second}$ and at $t = 3.0\text{ seconds}$.
- **Exercise 3.4:** A test train moves along a track with velocity $v(t) = 4t - 16\text{ m/s}$. Find the time interval during which the train is moving in the negative direction while speeding up in reverse.

### Tier 3: Graphical Area Calculations from $v-t$ Plots
- **Exercise 3.5:** An elevator ascends according to a $v-t$ profile: accelerates uniformly from rest to $6.0\text{ m/s}$ in $3.0\text{ s}$, cruises at $6.0\text{ m/s}$ for $12.0\text{ s}$, and decelerates uniformly to rest in $4.0\text{ s}$. Compute the total height gained.
- **Exercise 3.6:** A particle's velocity graph forms a triangle above the axis of base $6.0\text{ s}$ and height $+10.0\text{ m/s}$, followed immediately by a triangle below the axis of base $4.0\text{ s}$ and height $-8.0\text{ m/s}$. Compute net displacement and total distance.

### Tier 4: Reconstructing Motion from $a-t$ Graphs
- **Exercise 3.7:** A rocket car starting from rest experiences acceleration $a(t) = 2.0 + 1.5t\text{ m/s}^2$ for $0 \le t \le 6.0\text{ s}$. Find its velocity at $t = 6.0\text{ seconds}$.
- **Exercise 3.8:** An automated crane hoist has position $y(t) = A t^3 - B t^2$. Find the ratio $A / B$ such that the acceleration is zero at the exact instant when the velocity is zero ($t > 0$), or prove whether such a point exists.

### Tier 5: Multi-Stage Kinematic Optimization (Advanced)
- **Exercise 3.9:** A subway train must travel between two stations $1200\text{ meters}$ apart. Its traction system limits acceleration to $a = +1.5\text{ m/s}^2$ and braking deceleration to $a = -2.0\text{ m/s}^2$. If it reaches a maximum cruising speed of $v_{\text{cruise}} = 30.0\text{ m/s}$, calculate the minimum possible travel time between stations.
- **Exercise 3.10:** For the subway in Exercise 3.9, what is the minimum inter-station distance required for the train to reach its maximum cruising speed of $30.0\text{ m/s}$ before it must begin braking?

---

## 3.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 3.1
For $x(t) = 5.0 t^2 - 20.0 t + 8.0$:
1. $v(t) = \frac{dx}{dt} = 10.0 t - 20.0\text{ m/s}$.
2. $a(t) = \frac{dv}{dt} = 10.0\text{ m/s}^2$ (constant).
3. Evaluate at $t = 3.0\text{ s}$:
$$v(3.0) = 10.0(3.0) - 20.0 = 30.0 - 20.0 = +10.0\text{ m/s}$$
$$a(3.0) = +10.0\text{ m/s}^2$$
**Final Answer:** $v(3.0) = +10.0\text{ m/s}$; $a(3.0) = +10.0\text{ m/s}^2$.

---

### Solution to Exercise 3.2
Find rest point for $x(t) = 5.0 t^2 - 20.0 t + 8.0$:
1. Set $v(t) = 0$:
$$10.0 t - 20.0 = 0 \implies 10.0 t = 20.0 \implies t = 2.0\text{ seconds}$$
2. Coordinate at $t = 2.0\text{ s}$:
$$x(2.0) = 5.0(2.0^2) - 20.0(2.0) + 8.0 = 5.0(4.0) - 40.0 + 8.0 = 20.0 - 40.0 + 8.0 = -12.0\text{ meters}$$
**Final Answer:** Stops at $t = 2.0$ seconds at coordinate $x = -12.0$ meters.

---

### Solution to Exercise 3.3
Speeding up vs slowing down for $y(t) = -t^3 + 6t^2 + 15t + 2$:
1. Differentiate:
$$v(t) = -3t^2 + 12t + 15$$
$$a(t) = -6t + 12$$
2. Evaluate at $t = 1.0\text{ s}$:
$$v(1.0) = -3(1) + 12(1) + 15 = 24.0\text{ m/s} > 0$$
$$a(1.0) = -6(1) + 12 = +6.0\text{ m/s}^2 > 0$$
$$v(1.0) \cdot a(1.0) = (+24.0)(+6.0) > 0 \implies \mathbf{SPEEDING\ UP}$$
3. Evaluate at $t = 3.0\text{ s}$:
$$v(3.0) = -3(9) + 12(3) + 15 = -27 + 36 + 15 = +24.0\text{ m/s} > 0$$
$$a(3.0) = -6(3) + 12 = -18 + 12 = -6.0\text{ m/s}^2 < 0$$
$$v(3.0) \cdot a(3.0) = (+24.0)(-6.0) < 0 \implies \mathbf{SLOWING\ DOWN}$$
**Final Answer:** At $t = 1.0\text{ s}$, speeding up; at $t = 3.0\text{ s}$, slowing down.

---

### Solution to Exercise 3.4
For $v(t) = 4t - 16$:
1. Moving in negative direction requires $v(t) < 0$:
$$4t - 16 < 0 \implies 4t < 16 \implies t < 4.0\text{ seconds}$$
2. Acceleration is $a(t) = \frac{dv}{dt} = +4.0\text{ m/s}^2$.
Notice that acceleration is strictly **positive** ($+4.0$) for all $t$!
3. Therefore, for all $t < 4.0$, $v(t) < 0$ and $a(t) > 0$.
The product $v \cdot a = (-)(+) < 0$, which means the train is **slowing down** as it moves backward!
At no point is it speeding up in reverse, because acceleration is positive!
**Final Answer:** No such interval exists; for all $t < 4.0\text{ s}$, the train is slowing down toward rest.

---

### Solution to Exercise 3.5
Elevator height from $v-t$ trapezoid:
- Phase 1 (Acceleration): Triangle, $\Delta t = 3.0\text{ s}$, height $6.0\text{ m/s}$. Area $= \frac{1}{2}(3.0)(6.0) = 9.0\text{ m}$.
- Phase 2 (Cruising): Rectangle, $\Delta t = 12.0\text{ s}$, height $6.0\text{ m/s}$. Area $= 12.0 \times 6.0 = 72.0\text{ m}$.
- Phase 3 (Deceleration): Triangle, $\Delta t = 4.0\text{ s}$, height $6.0\text{ m/s}$. Area $= \frac{1}{2}(4.0)(6.0) = 12.0\text{ m}$.
$$\text{Total Height} = 9.0 + 72.0 + 12.0 = 93.0\text{ meters}$$
*(Trapezoid check: $\frac{19.0 + 12.0}{2} \times 6.0 = 31.0 \times 3.0 = 93.0\text{ m}$)*.
**Final Answer:** $93.0\text{ meters}$.

---

### Solution to Exercise 3.6
Signed area of two triangles:
- Forward triangle: $A_1 = \frac{1}{2}(6.0\text{ s})(+10.0\text{ m/s}) = +30.0\text{ meters}$.
- Backward triangle: $A_2 = \frac{1}{2}(4.0\text{ s})(-8.0\text{ m/s}) = -16.0\text{ meters}$.
1. Net displacement:
$$\Delta x_{\text{net}} = (+30.0\text{ m}) + (-16.0\text{ m}) = +14.0\text{ meters}$$
2. Total distance:
$$d_{\text{total}} = |+30.0| + |-16.0| = 30.0 + 16.0 = 46.0\text{ meters}$$
**Final Answer:** Displacement $= +14.0\text{ m}$; Total distance $= 46.0\text{ m}$.

---

### Solution to Exercise 3.7
For $a(t) = 2.0 + 1.5t$ with $v(0) = 0$:
$$v(t) = \int_0^t (2.0 + 1.5\tau) \, d\tau = \left[ 2.0\tau + 0.75\tau^2 \right]_0^t = 2.0t + 0.75t^2$$
Evaluate at $t = 6.0\text{ s}$:
$$v(6.0) = 2.0(6.0) + 0.75(6.0^2) = 12.0 + 0.75(36.0) = 12.0 + 27.0 = 39.0\text{ m/s}$$
**Final Answer:** $39.0\text{ m/s}$.

---

### Solution to Exercise 3.8
For $y(t) = A t^3 - B t^2$:
1. $v(t) = 3A t^2 - 2B t = t(3A t - 2B)$.
   For $t > 0$, $v(t) = 0 \implies t = \frac{2B}{3A}$.
2. $a(t) = 6A t - 2B$.
   Set $a(t) = 0 \implies 6A t = 2B \implies t = \frac{2B}{6A} = \frac{B}{3A}$.
3. For both to occur at the same instant $t > 0$:
$$\frac{2B}{3A} = \frac{B}{3A} \implies 2B = B \implies B = 0$$
If $B = 0$, $y(t) = At^3 \implies v(t) = 3At^2 = 0 \implies t = 0$, which contradicts $t > 0$.
**Final Answer:** No such non-zero ratio exists; velocity and acceleration cannot be simultaneously zero for any $t > 0$ for this cubic form.

---

### Solution to Exercise 3.9
Minimum subway travel time for $D = 1200\text{ m}$, $a_1 = +1.5\text{ m/s}^2$, $a_2 = -2.0\text{ m/s}^2$, $v_{\text{cruise}} = 30.0\text{ m/s}$:
1. Acceleration phase:
$$\Delta t_1 = \frac{v_{\text{cruise}}}{a_1} = \frac{30.0}{1.5} = 20.0\text{ seconds}$$
$$d_1 = \frac{1}{2} a_1 (\Delta t_1)^2 = \frac{1}{2}(1.5)(400) = 300.0\text{ meters}$$
2. Deceleration phase:
$$\Delta t_3 = \frac{v_{\text{cruise}}}{|a_2|} = \frac{30.0}{2.0} = 15.0\text{ seconds}$$
$$d_3 = \frac{1}{2} |a_2| (\Delta t_3)^2 = \frac{1}{2}(2.0)(225) = 225.0\text{ meters}$$
3. Cruising phase:
$$d_2 = D - (d_1 + d_3) = 1200.0 - (300.0 + 225.0) = 1200.0 - 525.0 = 675.0\text{ meters}$$
$$\Delta t_2 = \frac{d_2}{v_{\text{cruise}}} = \frac{675.0\text{ m}}{30.0\text{ m/s}} = 22.5\text{ seconds}$$
4. Total travel time:
$$\Delta t_{\text{total}} = \Delta t_1 + \Delta t_2 + \Delta t_3 = 20.0 + 22.5 + 15.0 = 57.5\text{ seconds}$$
**Final Answer:** Minimum travel time is $57.5\text{ seconds}$.

---

### Solution to Exercise 3.10
Minimum distance required to reach $v_{\text{cruise}} = 30.0\text{ m/s}$:
From Exercise 3.9, the train covers $d_1 = 300.0\text{ m}$ accelerating to $30\text{ m/s}$ and $d_3 = 225.0\text{ m}$ braking from $30\text{ m/s}$ to rest.
If there is zero cruise phase ($d_2 = 0$):
$$D_{\text{min}} = d_1 + d_3 = 300.0\text{ m} + 225.0\text{ m} = 525.0\text{ meters}$$
If the stations are closer than $525.0\text{ m}$, the train cannot reach $30.0\text{ m/s}$ without overshooting the next station.
**Final Answer:** $525.0\text{ meters}$.
