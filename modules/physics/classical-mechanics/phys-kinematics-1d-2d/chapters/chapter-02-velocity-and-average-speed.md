# Chapter 2: Velocity and Average Speed — The Journey Across Time

> *"To record where an object is located is merely a static catalog of coordinates. Physics truly begins when we ask how rapidly those coordinates are shifting across the unrelenting flow of time. Yet the simplest question — 'How fast did it go?' — conceals one of the most famous mathematical traps in all of science."*

---

## 2.1 The Two Perspectives on Rate of Motion

In Chapter 1, we established the fundamental distinction between **scalar distance** ($d \ge 0$, the total path length) and **vector displacement** ($\Delta x = x_2 - x_1$, the net change in position).

When we couple these two spatial measures with the elapsed duration of time $\Delta t = t_2 - t_1$, two fundamentally different rates of motion emerge:

1. **Average Speed ($s_{\text{avg}}$):** The scalar rate at which distance is accumulated over time:
   $$s_{\text{avg}} = \frac{\text{Total Distance}}{\text{Total Elapsed Time}} = \frac{d_{\text{total}}}{\Delta t}$$
   - Average speed is always non-negative: $s_{\text{avg}} \ge 0$.
   - Average speed measures physical activity and fuel expenditure regardless of direction.

2. **Average Velocity ($v_{\text{avg}}$ or $\bar{v}$):** The vector rate at which displacement changes over time:
   $$v_{\text{avg}} = \frac{\text{Net Displacement}}{\text{Total Elapsed Time}} = \frac{\Delta x}{\Delta t} = \frac{x_2 - x_1}{t_2 - t_1}$$
   - In one dimension, average velocity is a signed scalar quantity:
     - $v_{\text{avg}} > 0$ means the net motion was directed in the **positive direction** (rightward, upward, forward).
     - $v_{\text{avg}} < 0$ means the net motion was directed in the **negative direction** (leftward, downward, reverse).
     - $v_{\text{avg}} = 0$ means the object ended the time interval at the exact coordinate where it began, regardless of how much distance it covered!

---

## 2.2 The Commuter's Trap: The Harmonic Mean Paradox

There is a classic brainteaser that trips up beginners, software engineers, and experienced physicists alike:

> *"A commuter drives a car from Town A to Town B at an average speed of $40\text{ km/h}$. Without stopping, the commuter immediately turns around and drives back from Town B to Town A along the exact same road at an average speed of $60\text{ km/h}$. What was the commuter's average speed for the entire round trip?"*

Almost every untrained person immediately calculates the arithmetic mean:

$$\frac{40 + 60}{2} = 50\text{ km/h} \quad \mathbf{(CATASTROPHICALLY\ FALSE!)}$$

The true average speed is **not** $50\text{ km/h}$. It is strictly **$48\text{ km/h}$**.

### Why the Arithmetic Mean Fails
Average speed is defined strictly by the governing law:

$$s_{\text{avg}} = \frac{d_{\text{total}}}{\Delta t_{\text{total}}}$$

Let the one-way distance between Town A and Town B be $D$.
- The total distance of the round trip is $d_{\text{total}} = D + D = 2D$.
- The time spent driving outbound at speed $v_1 = 40\text{ km/h}$ is:
  $$\Delta t_1 = \frac{D}{v_1} = \frac{D}{40}$$
- The time spent driving inbound at speed $v_2 = 60\text{ km/h}$ is:
  $$\Delta t_2 = \frac{D}{v_2} = \frac{D}{60}$$

Notice the crucial physical asymmetry: **Because the car traveled slower on the outbound leg ($40\text{ km/h}$), it spent significantly more time traveling at the slower speed than at the faster speed!** 

Rates of motion cannot be averaged arithmetically when the travel durations are unequal.

Let us compute the total elapsed time:

$$\Delta t_{\text{total}} = \Delta t_1 + \Delta t_2 = \frac{D}{40} + \frac{D}{60}$$

Find a common denominator of $120$:

$$\Delta t_{\text{total}} = \frac{3D}{120} + \frac{2D}{120} = \frac{5D}{120} = \frac{D}{24}\text{ hours}$$

Now compute the true average speed:

$$s_{\text{avg}} = \frac{d_{\text{total}}}{\Delta t_{\text{total}}} = \frac{2D}{\frac{D}{24}} = 2D \times \frac{24}{D} = 48\text{ km/h}$$

The distance $D$ cancels out completely. The result is invariant to whether the towns are $10\text{ km}$ or $1,000\text{ km}$ apart!

```
    Outbound: Distance D @ 40 km/h  ====> Takes 3/5 of total time (Longer duration)
    Inbound:  Distance D @ 60 km/h  <==== Takes 2/5 of total time (Shorter duration)

    Weighted heavily toward the slower speed: True Average Speed = 48 km/h
```

### The Harmonic Mean Formula for Equal Distances
Whenever an object covers **equal distances** at speeds $v_1$ and $v_2$, the average speed is the **harmonic mean** of the two speeds:

$$s_{\text{avg}} = \frac{2}{\frac{1}{v_1} + \frac{1}{v_2}} = \frac{2 v_1 v_2}{v_1 + v_2}$$

Testing our numbers:

$$s_{\text{avg}} = \frac{2(40)(60)}{40 + 60} = \frac{4800}{100} = 48\text{ km/h}$$

### When IS the Arithmetic Mean Valid?
The arithmetic mean $\frac{v_1 + v_2}{2}$ is valid **if and only if** the object travels at speed $v_1$ for **equal time intervals** ($\Delta t_1 = \Delta t_2 = T$), not equal distances:

$$s_{\text{avg}} = \frac{d_1 + d_2}{T + T} = \frac{v_1 T + v_2 T}{2T} = \frac{(v_1 + v_2)T}{2T} = \frac{v_1 + v_2}{2}$$

> [!IMPORTANT]
> - Equal **Times** $\implies$ **Arithmetic Mean**: $s_{\text{avg}} = \frac{v_1 + v_2}{2}$
> - Equal **Distances** $\implies$ **Harmonic Mean**: $s_{\text{avg}} = \frac{2 v_1 v_2}{v_1 + v_2}$

---

## 2.3 Unit Conversions: Bridging Metric Standards

In international physics, simulation code, and aerospace engineering, the standard SI unit of velocity is **meters per second ($\text{m/s}$)**. In daily life and transportation, velocity is commonly quoted in **kilometers per hour ($\text{km/h}$)** or **miles per hour ($\text{mph}$)**.

Let us derive the exact conversion factors from first principles:

$$1\text{ kilometer} = 1000\text{ meters}$$
$$1\text{ hour} = 60\text{ minutes} = 60 \times 60\text{ seconds} = 3600\text{ seconds}$$

Therefore:

$$1\text{ km/h} = \frac{1000\text{ meters}}{3600\text{ seconds}} = \frac{10}{36}\text{ m/s} = \frac{5}{18}\text{ m/s} \approx 0.2778\text{ m/s}$$

Conversely:

$$1\text{ m/s} = \frac{18}{5}\text{ km/h} = 3.6\text{ km/h}$$

### Quick Mental Benchmarks
- Walking speed: $1.4\text{ m/s} \approx 5.0\text{ km/h}$
- Highway speed limit: $100\text{ km/h} = \frac{100}{3.6} \approx 27.8\text{ m/s}$
- High-speed train: $360\text{ km/h} = \frac{360}{3.6} = 100\text{ m/s}$
- Speed of sound in air ($20^\circ\text{C}$): $343\text{ m/s} \approx 1235\text{ km/h}$

---

## 2.4 Graphical Analysis: The Position-Time ($x-t$) Graph

A **position-time graph** (or $x-t$ plot) places time $t$ on the horizontal axis and position coordinate $x$ on the vertical axis.

```
       Position x (m)
            ^
            |                             . P_2 (t_2, x_2)
            |                         _.-'
       x_2 -+---------------------.-'
            |                 _.-'  |  <--- Secant Line Slope = (x_2 - x_1)/(t_2 - t_1)
            |             _.-'      |                         = Average Velocity!
       x_1 -+---------* P_1 (t_1, x_1)
            |         |             |
            |         |             |
            +---------+-------------+---------> Time t (s)
                     t_1           t_2
```

### The Secant Line and Average Velocity
Select any two points on the curve: $P_1(t_1, x_1)$ and $P_2(t_2, x_2)$.
Draw a straight secant line passing through both points.
The geometric slope of this secant line is:

$$\text{Slope} = \frac{\text{Rise}}{\text{Run}} = \frac{x_2 - x_1}{t_2 - t_1} = \frac{\Delta x}{\Delta t}$$

This matches our definition of **Average Velocity** identically:

$$\mathbf{v_{\text{avg}} = \text{Slope of the Secant Line on an } x-t \text{ Graph}}$$

### Interpreting $x-t$ Graph Features
1. **Horizontal Line ($\text{Slope} = 0$):** Position does not change over time. The object is **stationary** (at rest).
2. **Straight Upward Sloping Line ($\text{Slope} > 0$ constant):** Object moves at a **constant velocity** in the positive direction.
3. **Straight Downward Sloping Line ($\text{Slope} < 0$ constant):** Object moves at a **constant velocity** in the negative direction.
4. **Steeper Slope:** Higher speed.
5. **Curved Line:** The slope is continuously changing, meaning the velocity is changing (the object is **accelerating**).

---

## 2.5 Uniform Motion: The Simplest Kinetic Law

When an object travels with **constant velocity** $v$, its average velocity over any interval equals its instantaneous velocity at every single moment:

$$v_{\text{avg}} = v = \text{constant}$$

From the definition of average velocity:

$$v = \frac{x - x_0}{t - 0} \implies x - x_0 = v t$$

$$\mathbf{x(t) = x_0 + v t}$$

This is the linear equation of **Uniform Motion**:
- $x(t)$ is the position at time $t$.
- $x_0$ is the initial position at $t = 0$ ($y$-intercept of the graph).
- $v$ is the constant velocity (slope of the line).

Uniform motion represents an idealized state where all external forces cancel out (Newton's First Law of Motion, which we explore in Module #4).

---

## 2.6 Ten Progressive Worked Numerical Examples

### Example 2.1: Basic Average Velocity and Average Speed Comparison
**Problem:** An autonomous delivery rover travels along a straight $300\text{-meter}$ outdoor test track. It drives from the origin $x_0 = 0$ to $x_1 = +300\text{ m}$ in $50\text{ seconds}$, stops for $10\text{ seconds}$ to unload a parcel, and then drives backward to $x_2 = +100\text{ m}$ in $40\text{ seconds}$.
1. Find the total distance traveled and total elapsed time.
2. Calculate the average speed for the entire trip.
3. Calculate the average velocity for the entire trip.

**Step 1:** Decompose into legs:
- Leg 1: From $0$ to $+300\text{ m}$ in $50\text{ s}$. $\Delta x_1 = +300\text{ m}$, $d_1 = 300\text{ m}$.
- Leg 2 (Unload): Stationary at $+300\text{ m}$ for $10\text{ s}$. $\Delta x_2 = 0\text{ m}$, $d_2 = 0\text{ m}$.
- Leg 3: From $+300\text{ m}$ to $+100\text{ m}$ in $40\text{ s}$. $\Delta x_3 = 100 - 300 = -200\text{ m}$, $d_3 = |-200| = 200\text{ m}$.

**Step 2:** Totals:
$$d_{\text{total}} = d_1 + d_2 + d_3 = 300 + 0 + 200 = 500\text{ meters}$$
$$\Delta t_{\text{total}} = 50 + 10 + 40 = 100\text{ seconds}$$
$$\Delta x_{\text{net}} = x_{\text{final}} - x_{\text{initial}} = 100 - 0 = +100\text{ meters}$$

**Step 3:** Average speed:
$$s_{\text{avg}} = \frac{d_{\text{total}}}{\Delta t_{\text{total}}} = \frac{500\text{ m}}{100\text{ s}} = 5.0\text{ m/s}$$

**Step 4:** Average velocity:
$$v_{\text{avg}} = \frac{\Delta x_{\text{net}}}{\Delta t_{\text{total}}} = \frac{+100\text{ m}}{100\text{ s}} = +1.0\text{ m/s}$$

**Conclusion:** The average speed is $5.0\text{ m/s}$, while the average velocity is $+1.0\text{ m/s}$ forward.

---

### Example 2.2: The Commuter Paradox with Real Distance
**Problem:** A logistics van drives $120\text{ km}$ from Warehouse A to Distribution Hub B at an average speed of $60\text{ km/h}$. On the return journey along the same route, heavy rain restricts the van's average speed to $40\text{ km/h}$.
1. Find the time taken for the outbound journey.
2. Find the time taken for the return journey.
3. Compute the overall average speed for the round trip.
4. Compute the overall average velocity for the round trip.

**Step 1:** Outbound travel time $\Delta t_1$:
$$\Delta t_1 = \frac{D}{v_1} = \frac{120\text{ km}}{60\text{ km/h}} = 2.0\text{ hours}$$

**Step 2:** Return travel time $\Delta t_2$:
$$\Delta t_2 = \frac{D}{v_2} = \frac{120\text{ km}}{40\text{ km/h}} = 3.0\text{ hours}$$

**Step 3:** Total distance and total time:
$$d_{\text{total}} = 120\text{ km} + 120\text{ km} = 240\text{ km}$$
$$\Delta t_{\text{total}} = 2.0\text{ h} + 3.0\text{ h} = 5.0\text{ hours}$$

**Step 4:** Average speed:
$$s_{\text{avg}} = \frac{d_{\text{total}}}{\Delta t_{\text{total}}} = \frac{240\text{ km}}{5.0\text{ h}} = 48.0\text{ km/h}$$

**Step 5:** Average velocity:
Because the van returned to Warehouse A, net displacement $\Delta x = 0$:
$$v_{\text{avg}} = \frac{0\text{ km}}{5.0\text{ h}} = 0.0\text{ km/h}$$

---

### Example 2.3: Equal Times vs Equal Distances
**Problem:** An electric prototype vehicle undergoes two separate speed trials on a closed straight track:
- **Trial Alpha (Equal Times):** Drives for $30\text{ minutes}$ at $80\text{ km/h}$, then immediately for $30\text{ minutes}$ at $120\text{ km/h}$.
- **Trial Beta (Equal Distances):** Drives for $50\text{ km}$ at $80\text{ km/h}$, then immediately for $50\text{ km}$ at $120\text{ km/h}$.
Compute the average speed for each trial and explain why they differ.

**Step 1:** Trial Alpha (Equal Times, $\Delta t_1 = \Delta t_2 = 0.5\text{ h}$):
$$d_1 = (80\text{ km/h}) \times (0.5\text{ h}) = 40\text{ km}$$
$$d_2 = (120\text{ km/h}) \times (0.5\text{ h}) = 60\text{ km}$$
$$s_{\text{avg, Alpha}} = \frac{d_1 + d_2}{\Delta t_1 + \Delta t_2} = \frac{40 + 60}{0.5 + 0.5} = \frac{100\text{ km}}{1.0\text{ h}} = 100.0\text{ km/h}$$
*(Matches the arithmetic mean: $\frac{80 + 120}{2} = 100\text{ km/h}$)*.

**Step 2:** Trial Beta (Equal Distances, $D_1 = D_2 = 50\text{ km}$):
$$\Delta t_1 = \frac{50\text{ km}}{80\text{ km/h}} = 0.625\text{ hours}$$
$$\Delta t_2 = \frac{50\text{ km}}{120\text{ km/h}} \approx 0.4167\text{ hours}$$
$$\Delta t_{\text{total}} = 0.625 + 0.4167 = 1.0417\text{ hours}$$
$$s_{\text{avg, Beta}} = \frac{50 + 50}{1.0417} = \frac{100\text{ km}}{1.0417\text{ h}} = 96.0\text{ km/h}$$
*(Matches the harmonic mean: $\frac{2(80)(120)}{80 + 120} = \frac{19200}{200} = 96\text{ km/h}$)*.

**Conclusion:** Trial Alpha's average speed is $100\text{ km/h}$; Trial Beta's average speed is $96\text{ km/h}$. Traveling equal distances biases the average toward the slower speed because more time is spent at $80\text{ km/h}$ ($37.5\text{ min}$) than at $120\text{ km/h}$ ($25\text{ min}$).

---

### Example 2.4: Multi-Segment Journey with Mixed Speeds and Delays
**Problem:** A high-speed bullet train connects City X and City Y ($360\text{ km}$ apart):
- Segment 1: Accelerates out of the city, covering the first $60\text{ km}$ at an average speed of $120\text{ km/h}$.
- Segment 2: Cruises along the flatlands for $240\text{ km}$ at $300\text{ km/h}$.
- Segment 3: Navigates mountain tunnels for the remaining $60\text{ km}$ at $150\text{ km/h}$.
Calculate the total scheduled travel time and the train's average speed over the entire route.

**Step 1:** Calculate elapsed time for each segment:
$$\Delta t_1 = \frac{60\text{ km}}{120\text{ km/h}} = 0.50\text{ hours (30 min)}$$
$$\Delta t_2 = \frac{240\text{ km}}{300\text{ km/h}} = 0.80\text{ hours (48 min)}$$
$$\Delta t_3 = \frac{60\text{ km}}{150\text{ km/h}} = 0.40\text{ hours (24 min)}$$

**Step 2:** Calculate total elapsed time:
$$\Delta t_{\text{total}} = 0.50 + 0.80 + 0.40 = 1.70\text{ hours (102 minutes)}$$

**Step 3:** Calculate overall average speed:
$$s_{\text{avg}} = \frac{d_{\text{total}}}{\Delta t_{\text{total}}} = \frac{360\text{ km}}{1.70\text{ h}} \approx 211.76\text{ km/h}$$

**Step 4:** Convert to SI units ($\text{m/s}$):
$$s_{\text{avg}} = \frac{211.76}{3.6} \approx 58.82\text{ m/s}$$

---

### Example 2.5: Evaluating Secant Slopes on a Curved $x-t$ Graph
**Problem:** A research rocket sled on a test track has position given by $x(t) = 2.0 t^2 + 5.0 t$ meters, where $t$ is in seconds.
1. Find the sled's position at $t_1 = 2.0\text{ s}$ and $t_2 = 5.0\text{ s}$.
2. Calculate the average velocity of the sled between $t = 2.0\text{ s}$ and $t = 5.0\text{ s}$.
3. Graphically, what does this average velocity represent?

**Step 1:** Evaluate positions:
$$x(2.0) = 2.0(2.0)^2 + 5.0(2.0) = 2.0(4.0) + 10.0 = 8.0 + 10.0 = 18.0\text{ meters}$$
$$x(5.0) = 2.0(5.0)^2 + 5.0(5.0) = 2.0(25.0) + 25.0 = 50.0 + 25.0 = 75.0\text{ meters}$$

**Step 2:** Calculate average velocity:
$$\Delta x = x(5.0) - x(2.0) = 75.0\text{ m} - 18.0\text{ m} = 57.0\text{ meters}$$
$$\Delta t = 5.0\text{ s} - 2.0\text{ s} = 3.0\text{ seconds}$$
$$v_{\text{avg}} = \frac{\Delta x}{\Delta t} = \frac{57.0\text{ m}}{3.0\text{ s}} = 19.0\text{ m/s}$$

**Step 3:** Graphical interpretation:
$v_{\text{avg}} = 19.0\text{ m/s}$ represents the exact geometric slope of the straight secant line connecting points $(2.0, 18.0)$ and $(5.0, 75.0)$ on the parabolic $x-t$ curve.

---

### Example 2.6: The Target Average Speed Challenge
**Problem:** An autonomous race car must achieve an overall average speed of $180\text{ km/h}$ over a $10\text{-km}$ test circuit to qualify for a championship.
Due to cold tires, the car averages only $120\text{ km/h}$ during the first $5\text{ km}$ half of the circuit.
At what average speed must the car complete the second $5\text{ km}$ half to achieve its qualifying target?

**Step 1:** Calculate allowable total time for the full $10\text{ km}$ lap at target speed $180\text{ km/h}$:
$$\Delta t_{\text{total}} = \frac{d_{\text{total}}}{s_{\text{target}}} = \frac{10\text{ km}}{180\text{ km/h}} = \frac{1}{18}\text{ hours} = \frac{3600}{18} = 200\text{ seconds}$$

**Step 2:** Calculate time consumed during the first $5\text{ km}$ at $120\text{ km/h}$:
$$\Delta t_1 = \frac{5\text{ km}}{120\text{ km/h}} = \frac{1}{24}\text{ hours} = \frac{3600}{24} = 150\text{ seconds}$$

**Step 3:** Calculate remaining time available for the second half:
$$\Delta t_2 = \Delta t_{\text{total}} - \Delta t_1 = 200\text{ s} - 150\text{ s} = 50\text{ seconds} = \frac{50}{3600}\text{ hours} = \frac{1}{72}\text{ hours}$$

**Step 4:** Calculate required speed $v_2$ for the second $5\text{ km}$:
$$v_2 = \frac{d_2}{\Delta t_2} = \frac{5\text{ km}}{\frac{1}{72}\text{ h}} = 5 \times 72 = 360\text{ km/h}$$

**Conclusion:** The car must average an astonishing $360\text{ km/h}$ over the second half of the lap to make up for the slow start!

---

### Example 2.7: Impossibility of Achieving Average Speed Target
**Problem:** Suppose in Example 2.6, the race car averaged only $90\text{ km/h}$ over the first $5\text{ km}$. Can the car qualify at $180\text{ km/h}$ by driving infinitely fast during the second $5\text{ km}$?

**Step 1:** Allowable total time for $10\text{ km}$ at $180\text{ km/h}$:
$$\Delta t_{\text{target}} = 200\text{ seconds}$$

**Step 2:** Time consumed during the first $5\text{ km}$ at $90\text{ km/h}$:
$$\Delta t_1 = \frac{5\text{ km}}{90\text{ km/h}} = \frac{1}{18}\text{ hours} = 200\text{ seconds}$$

**Step 3:** Remaining time available:
$$\Delta t_2 = 200\text{ s} - 200\text{ s} = \mathbf{0\text{ seconds}}!$$

**Conclusion:** The car consumed its entire $200\text{-second}$ time budget during the first half alone! Even if the car possessed teleportation or infinite speed ($v_2 \to \infty$) for the second half, its average speed would never exceed $180\text{ km/h}$. Qualifying is mathematically impossible.

---

### Example 2.8: Two-Object Collision Detection via Uniform Motion
**Problem:** In a 2D automated guided vehicle (AGV) system, two carts move along a single straight track:
- Cart 1 starts at $x_1(0) = 0\text{ m}$ and travels forward at a constant velocity of $v_1 = +4.5\text{ m/s}$.
- Cart 2 starts at $x_2(0) = +180\text{ m}$ and travels backward toward Cart 1 at a constant velocity of $v_2 = -3.0\text{ m/s}$.
1. Write the uniform motion equations for both carts.
2. Find the collision time $t_{\text{col}}$ when their coordinates match.
3. Find the coordinate location where collision occurs.

**Step 1:** Equations of motion:
$$x_1(t) = 0 + 4.5 t = 4.5 t$$
$$x_2(t) = 180 + (-3.0) t = 180 - 3.0 t$$

**Step 2:** Equate positions for collision ($x_1 = x_2$):
$$4.5 t = 180 - 3.0 t$$
$$4.5 t + 3.0 t = 180 \implies 7.5 t = 180$$
$$t_{\text{col}} = \frac{180}{7.5} = 24.0\text{ seconds}$$

**Step 3:** Find collision position:
$$x_{\text{col}} = x_1(24) = 4.5(24) = 108.0\text{ meters}$$
*(Verification using Cart 2: $x_2(24) = 180 - 3.0(24) = 180 - 72 = 108.0\text{ m}$)*.

**Conclusion:** The carts collide at $t = 24.0\text{ seconds}$ at position $x = +108.0\text{ meters}$.

---

### Example 2.9: Subsea Exploration Crawler Telemetry
**Problem:** An oceanographic seafloor crawler records the following positions:
- At $t = 0$: $x = -50\text{ m}$
- At $t = 10\text{ min}$: $x = +150\text{ m}$
- At $t = 25\text{ min}$: $x = +150\text{ m}$ (stationary during sensor sampling)
- At $t = 40\text{ min}$: $x = -100\text{ m}$
1. Calculate the average velocity for each of the three time intervals in $\text{m/min}$ and $\text{m/s}$.
2. Calculate the overall average velocity from $t = 0$ to $t = 40\text{ min}$.
3. Calculate the overall average speed from $t = 0$ to $t = 40\text{ min}$.

**Step 1:** Interval average velocities:
- **Interval 1 ($0 \to 10\text{ min}$):**
  $$v_{\text{avg, 1}} = \frac{150 - (-50)}{10 - 0} = \frac{200\text{ m}}{10\text{ min}} = +20.0\text{ m/min} = \frac{20.0}{60} \approx +0.333\text{ m/s}$$
- **Interval 2 ($10 \to 25\text{ min}$):**
  $$v_{\text{avg, 2}} = \frac{150 - 150}{15} = \frac{0\text{ m}}{15\text{ min}} = 0.0\text{ m/min} = 0.0\text{ m/s}$$
- **Interval 3 ($25 \to 40\text{ min}$):**
  $$v_{\text{avg, 3}} = \frac{-100 - 150}{40 - 25} = \frac{-250\text{ m}}{15\text{ min}} \approx -16.67\text{ m/min} = \frac{-16.67}{60} \approx -0.278\text{ m/s}$$

**Step 2:** Overall average velocity:
$$\Delta x_{\text{net}} = x(40) - x(0) = -100 - (-50) = -50\text{ meters}$$
$$\Delta t_{\text{total}} = 40\text{ min} = 2400\text{ seconds}$$
$$v_{\text{avg, total}} = \frac{-50\text{ m}}{2400\text{ s}} \approx -0.0208\text{ m/s} = -1.25\text{ m/min}$$

**Step 3:** Overall average speed:
$$d_1 = |200| = 200\text{ m}, \quad d_2 = 0\text{ m}, \quad d_3 = |-250| = 250\text{ m}$$
$$d_{\text{total}} = 200 + 0 + 250 = 450\text{ meters}$$
$$s_{\text{avg, total}} = \frac{450\text{ m}}{2400\text{ s}} = 0.1875\text{ m/s} = 11.25\text{ m/min}$$

---

### Example 2.10: Shrinking the Secant Toward the Instantaneous
**Problem:** For an electric train whose position is governed by $x(t) = 3.0 t^2$ meters, calculate the average velocity over progressively shrinking time intervals starting at $t_0 = 2.0\text{ seconds}$:
1. Interval $[2.0, 3.0]$ ($\Delta t = 1.0\text{ s}$)
2. Interval $[2.0, 2.1]$ ($\Delta t = 0.1\text{ s}$)
3. Interval $[2.0, 2.01]$ ($\Delta t = 0.01\text{ s}$)
4. Interval $[2.0, 2.001]$ ($\Delta t = 0.001\text{ s}$)
What numerical value do these secant slopes approach as $\Delta t \to 0$?

**Step 1:** Compute $x(2.0)$:
$$x(2.0) = 3.0(2.0^2) = 3.0(4.0) = 12.000\text{ meters}$$

**Step 2:** Evaluate each shrinking interval:
- **$\Delta t = 1.0\text{ s}$ ($t = 3.0$):**
  $$x(3.0) = 3.0(3^2) = 27.0\text{ m} \implies v_{\text{avg}} = \frac{27.0 - 12.0}{1.0} = 15.000\text{ m/s}$$
- **$\Delta t = 0.1\text{ s}$ ($t = 2.1$):**
  $$x(2.1) = 3.0(2.1^2) = 3.0(4.41) = 13.23\text{ m} \implies v_{\text{avg}} = \frac{13.23 - 12.0}{0.1} = \frac{1.23}{0.1} = 12.300\text{ m/s}$$
- **$\Delta t = 0.01\text{ s}$ ($t = 2.01$):**
  $$x(2.01) = 3.0(2.01^2) = 3.0(4.0401) = 12.1203\text{ m} \implies v_{\text{avg}} = \frac{12.1203 - 12.0}{0.01} = \frac{0.1203}{0.01} = 12.030\text{ m/s}$$
- **$\Delta t = 0.001\text{ s}$ ($t = 2.001$):**
  $$x(2.001) = 3.0(2.001^2) = 3.0(4.004001) = 12.012003\text{ m} \implies v_{\text{avg}} = \frac{0.012003}{0.001} = 12.003\text{ m/s}$$

**Step 3:** Observe the convergence pattern:
$$15.000 \longrightarrow 12.300 \longrightarrow 12.030 \longrightarrow 12.003 \dots \longrightarrow \mathbf{12.000\text{ m/s}}$$

Algebraic confirmation via the derivative (from Chapter 4 of Calculus):
$$v(t) = \frac{dx}{dt} = 6.0 t \implies v(2.0) = 6.0(2.0) = 12.0\text{ m/s}$$

**Conclusion:** As the secant interval shrinks to zero, the average velocity converges precisely to the instantaneous velocity of $12.0\text{ m/s}$!

---

## 2.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Unit Conversions and Basic Rates (Foundational)
- **Exercise 2.1:** Convert an aircraft landing airspeed of $75.0\text{ m/s}$ to $\text{km/h}$.
- **Exercise 2.2:** A cheetah sprints $100\text{ meters}$ in $3.50\text{ seconds}$. Calculate its average speed in $\text{m/s}$ and $\text{km/h}$.

### Tier 2: Displacement and Average Velocity Calculations
- **Exercise 2.3:** A swimmer completes a $50\text{-meter}$ race by swimming to the opposite end in $24.0\text{ seconds}$, touching the wall, and swimming back in $26.0\text{ seconds}$. Calculate the average speed and average velocity for the entire $100\text{-meter}$ event.
- **Exercise 2.4:** An automated warehouse robot is at coordinate $x = +12.5\text{ m}$ at $t = 4.0\text{ s}$ and reaches $x = -23.5\text{ m}$ at $t = 16.0\text{ s}$. Find its average velocity.

### Tier 3: Harmonic Mean & Multi-Stage Speeds
- **Exercise 2.5:** A cyclist rides up a mountain pass for $15\text{ km}$ at an average speed of $10\text{ km/h}$, and immediately descends the same $15\text{-km}$ road at $40\text{ km/h}$. Calculate the average speed for the full $30\text{-km}$ climb and descent.
- **Exercise 2.6:** A commuter train travels between two stations. For the first $40\%$ of the total travel time, it travels at $60\text{ km/h}$. For the remaining $60\%$ of the time, it travels at $110\text{ km/h}$. What is the average speed of the train?

### Tier 4: Graphical Secant Slopes & Quadratic Kinematics
- **Exercise 2.7:** A particle's position on a line is $x(t) = t^3 - 4t + 10$ meters. Find the average velocity between $t = 1.0\text{ s}$ and $t = 4.0\text{ s}$.
- **Exercise 2.8:** A subway train departs Station A at $t = 0$. Its position until it reaches top speed is modeled by $x(t) = 0.8 t^2$ meters for $0 \le t \le 20\text{ s}$. Compute the average velocity over the first $10\text{ seconds}$, and over the full $20\text{ seconds}$.

### Tier 5: Pursuit, Interception, and Limit Analysis (Advanced)
- **Exercise 2.9:** Car A departs City 1 at $t = 0$ traveling toward City 2 ($240\text{ km}$ away) at a steady $80\text{ km/h}$. Car B departs City 1 two hours later along the same highway, traveling at $120\text{ km/h}$. At what distance from City 1 does Car B overtake Car A?
- **Exercise 2.10:** For a body with position $x(t) = \frac{1}{t+1}$ meters ($t \ge 0$), compute the average velocity over the interval $[1, 1+h]$, and evaluate the limit as $h \to 0$ to find the instantaneous velocity at $t = 1\text{ s}$.

---

## 2.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 2.1
Convert $75.0\text{ m/s}$ to $\text{km/h}$:
$$v = 75.0 \times 3.6 = 270.0\text{ km/h}$$
**Final Answer:** $270.0\text{ km/h}$.

---

### Solution to Exercise 2.2
Cheetah running $100\text{ m}$ in $3.50\text{ s}$:
1. Speed in $\text{m/s}$:
$$s_{\text{avg}} = \frac{100\text{ m}}{3.50\text{ s}} \approx 28.57\text{ m/s}$$
2. Speed in $\text{km/h}$:
$$s_{\text{avg}} = 28.5714 \times 3.6 \approx 102.86\text{ km/h}$$
**Final Answer:** $28.57\text{ m/s}$ ($102.86\text{ km/h}$).

---

### Solution to Exercise 2.3
Swimmer in $100\text{-meter}$ race:
1. Total distance: $d = 50 + 50 = 100\text{ meters}$.
2. Total time: $\Delta t = 24.0 + 26.0 = 50.0\text{ seconds}$.
3. Average speed:
$$s_{\text{avg}} = \frac{100\text{ m}}{50.0\text{ s}} = 2.00\text{ m/s}$$
4. Net displacement: Swimmer returns to starting block, so $\Delta x = 0\text{ m}$.
$$v_{\text{avg}} = \frac{0\text{ m}}{50.0\text{ s}} = 0.00\text{ m/s}$$
**Final Answer:** Average speed $= 2.00\text{ m/s}$; Average velocity $= 0.00\text{ m/s}$.

---

### Solution to Exercise 2.4
Robot average velocity:
$$\Delta x = x_2 - x_1 = -23.5\text{ m} - (+12.5\text{ m}) = -36.0\text{ meters}$$
$$\Delta t = 16.0\text{ s} - 4.0\text{ s} = 12.0\text{ seconds}$$
$$v_{\text{avg}} = \frac{\Delta x}{\Delta t} = \frac{-36.0\text{ m}}{12.0\text{ s}} = -3.00\text{ m/s}$$
**Final Answer:** $-3.00\text{ m/s}$ (directed in the negative direction).

---

### Solution to Exercise 2.5
Cyclist on mountain pass ($15\text{ km}$ at $10\text{ km/h}$, $15\text{ km}$ at $40\text{ km/h}$):
Because the distances are equal, apply the harmonic mean:
$$s_{\text{avg}} = \frac{2 v_1 v_2}{v_1 + v_2} = \frac{2(10)(40)}{10 + 40} = \frac{800}{50} = 16.0\text{ km/h}$$
Verification via times:
- Ascent time: $\Delta t_1 = \frac{15}{10} = 1.5\text{ hours}$.
- Descent time: $\Delta t_2 = \frac{15}{40} = 0.375\text{ hours}$.
- Total time: $1.5 + 0.375 = 1.875\text{ hours}$.
- $s_{\text{avg}} = \frac{30\text{ km}}{1.875\text{ h}} = 16.0\text{ km/h}$.
**Final Answer:** $16.0\text{ km/h}$.

---

### Solution to Exercise 2.6
Train with time-weighted speeds ($40\%$ time at $60\text{ km/h}$, $60\%$ time at $110\text{ km/h}$):
Because durations are specified as fractions of time, compute the time-weighted arithmetic mean:
$$s_{\text{avg}} = (0.40)(60\text{ km/h}) + (0.60)(110\text{ km/h}) = 24.0 + 66.0 = 90.0\text{ km/h}$$
**Final Answer:** $90.0\text{ km/h}$.

---

### Solution to Exercise 2.7
For $x(t) = t^3 - 4t + 10$:
1. $x(1.0) = 1^3 - 4(1) + 10 = 1 - 4 + 10 = 7.0\text{ meters}$.
2. $x(4.0) = 4^3 - 4(4) + 10 = 64 - 16 + 10 = 58.0\text{ meters}$.
3. Displacement: $\Delta x = 58.0 - 7.0 = 51.0\text{ meters}$.
4. Time interval: $\Delta t = 4.0 - 1.0 = 3.0\text{ seconds}$.
$$v_{\text{avg}} = \frac{51.0\text{ m}}{3.0\text{ s}} = 17.0\text{ m/s}$$
**Final Answer:** $17.0\text{ m/s}$.

---

### Solution to Exercise 2.8
For $x(t) = 0.8 t^2$:
1. First $10\text{ seconds}$ ($t = 0 \to 10$):
- $x(0) = 0\text{ m}$
- $x(10) = 0.8(10^2) = 0.8(100) = 80.0\text{ m}$
$$v_{\text{avg, 0-10}} = \frac{80.0 - 0}{10.0} = 8.00\text{ m/s}$$
2. Full $20\text{ seconds}$ ($t = 0 \to 20$):
- $x(20) = 0.8(20^2) = 0.8(400) = 320.0\text{ m}$
$$v_{\text{avg, 0-20}} = \frac{320.0 - 0}{20.0} = 16.00\text{ m/s}$$
**Final Answer:** $0 \to 10\text{ s}$: $8.00\text{ m/s}$; $0 \to 20\text{ s}$: $16.00\text{ m/s}$.

---

### Solution to Exercise 2.9
Pursuit of Car A by Car B:
1. Let $t$ be the time in hours since Car A departed.
- Car A equation: $x_A(t) = 80 t$ (for $t \ge 0$).
- Car B departs $2\text{ hours}$ later at $120\text{ km/h}$:
  $$x_B(t) = 120(t - 2) \quad (\text{for } t \ge 2)$$
2. Overtake occurs when $x_B = x_A$:
$$120(t - 2) = 80 t$$
$$120t - 240 = 80t \implies 40t = 240 \implies t = 6.0\text{ hours}$$
3. Coordinate location:
$$x = x_A(6.0) = 80(6.0) = 480\text{ km}$$
(Since City 2 is $240\text{ km}$ away, Car B does not overtake Car A before City 2; overtake would only happen if the highway extended to $480\text{ km}$).
**Final Answer:** Overtake point is $480\text{ km}$ from City 1 (after $6$ hours from Car A's departure).

---

### Solution to Exercise 2.10
Average velocity and limit for $x(t) = \frac{1}{t+1}$ at $t = 1$:
1. $x(1) = \frac{1}{1+1} = \frac{1}{2} = 0.5\text{ m}$.
2. $x(1+h) = \frac{1}{(1+h)+1} = \frac{1}{2+h}$.
3. Average velocity over $[1, 1+h]$:
$$v_{\text{avg}} = \frac{x(1+h) - x(1)}{h} = \frac{\frac{1}{2+h} - \frac{1}{2}}{h} = \frac{\frac{2 - (2+h)}{2(2+h)}}{h} = \frac{-h}{2h(2+h)} = \frac{-1}{2(2+h)}$$
4. Take the limit as $h \to 0$:
$$v(1) = \lim_{h \to 0} \frac{-1}{2(2+h)} = \frac{-1}{2(2)} = -\frac{1}{4} = -0.25\text{ m/s}$$
**Final Answer:** Average velocity $= \frac{-1}{2(2+h)}$; Instantaneous velocity $= -0.25\text{ m/s}$.
