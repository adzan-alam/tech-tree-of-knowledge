# Chapter 1: The Layman's Foundation — Space, Time, and the Frame of Reference

> *"Before we can measure how fast a cannonball flies, or why a moon orbits its world, we must confront the most deceptive illusion of human experience: the belief that space is a fixed, absolute stage upon which events occur. All motion is an agreement between an observer, a clock, and a chosen origin."*

---

## 1.1 The Genesis of Motion: What Does It Mean to Move?

Look down at your desk. A mug of coffee rests beside your notebook. If someone asks you, *"Is the mug moving?"*, you would answer without hesitation: *"No. It is stationary."*

Now consider an astronaut orbiting Earth aboard the International Space Station at $28,000\text{ kilometers per hour}$. Looking down through the cupola window with a high-powered telescope, the astronaut sees your town, your house, and your desk whizzing across their field of view at nearly eight kilometers every second!

Who is telling the truth? Are you stationary, or are you hurtling through space at supersonic speed?

The answer is the foundational pillar of classical physics: **Both observers are telling the exact truth.** Motion does not exist as an isolated, standalone property of an object. You cannot say an object is moving without specifying **relative to what**.

```
   Observer A (Inside the Train)                 Observer B (On the Platform)
   +-----------------------------+               
   |   Ball dropped straight down|               Ball follows a parabolic arc
   |              *              |                             *
   |              |              |                            . '
   |              v              |                           .   '
   |              *              |                          v     *
   +-----------------------------+               -----------------------------
          Train Moving at 100 km/h                      Stationary Platform
```

Imagine riding inside a high-speed bullet train traveling along a perfectly smooth, straight track at a constant speed of $300\text{ km/h}$ with all window blinds pulled shut. 
- If you pour water into a cup, the liquid pours straight down into the glass without sloshing.
- If you toss an apple straight up into the air, it returns directly into your open palm.
- If you were placed inside that train while asleep, you would have no physical way to determine whether the train was roaring at $300\text{ km/h}$ or sitting completely still in the depot.

To you, the apple traveled strictly upward and downward along a vertical line. But to an observer standing on the railway platform watching through a transparent window, the apple was moving horizontally at $300\text{ km/h}$ while simultaneously rising and falling, carving out a graceful curved parabola through space!

This realization leads to our first formal definition:
A **Frame of Reference** is a coordinate system combined with a synchronized clock used by an observer to measure the position, orientation, and motion of objects.

---

## 1.2 Coordinate Systems: Placing Numbers on Reality

To quantify motion, we must establish a mathematical coordinate line. In one-dimensional kinematics (motion along a straight line, such as a train on a track or an elevator in a shaft), we establish:

1. An **Origin ($O$)**: A reference landmark agreed upon as the zero position ($x = 0$).
2. A **Positive Direction ($+$)**: An agreed-upon orientation along the line (e.g., rightward, upward, forward, or eastward).
3. A **Negative Direction ($-$)**: The opposite orientation (e.g., leftward, downward, reverse, or westward).
4. A **Scale of Measurement (Unit)**: The standard SI unit of length, the **meter ($\text{m}$)**.

```
                         Negative Direction (-)        Positive Direction (+)
               <==================================|==================================>
                 -5    -4    -3    -2    -1       0     +1    +2    +3    +4    +5   (meters)
                                                  ^
                                                Origin
```

### Position ($x(t)$)
The **position** of an object is its signed coordinate on the reference axis at a specific instant of time $t$.
- $x = +4\text{ m}$ means the object is located $4$ meters to the right of the origin.
- $x = -3\text{ m}$ means the object is located $3$ meters to the left of the origin.

Position is a **vector quantity** in one dimension: its sign ($+$ or $-$) communicates its direction relative to the origin.

---

## 1.3 Distance vs. Displacement: The Crucial Physical Distinction

In everyday English, people treat "distance" and "displacement" as synonyms. In physics, mixing them up will corrupt every calculation you make.

### 1. Distance ($d$)
**Distance** is the total length of the actual path traveled by an object, regardless of direction.
- Distance is a **scalar quantity**: it has magnitude (how much) but no direction.
- Distance is **always non-negative**: $d \ge 0$.
- Distance can never decrease over time; every step you take adds to total distance.

### 2. Displacement ($\Delta x$)
**Displacement** is the net change in the position of an object between an initial time $t_1$ and a final time $t_2$:

$$\Delta x = x_{\text{final}} - x_{\text{initial}} = x_2 - x_1$$

- Displacement is a **vector quantity**: its sign indicates the net direction of travel.
- $\Delta x > 0$ means net motion in the positive direction.
- $\Delta x < 0$ means net motion in the negative direction.
- $\Delta x = 0$ means the object ended its journey at the exact same location where it began!

### The Track Runner Example
Imagine an athlete running around a standard $400\text{-meter}$ circular track, starting at the finish line coordinate $x_0 = 0$.
The athlete runs one complete lap, returning to the finish line in $60\text{ seconds}$.
- **Total Distance Traveled:** $d = 400\text{ meters}$.
- **Net Displacement:** $\Delta x = x_{\text{final}} - x_{\text{initial}} = 0 - 0 = \mathbf{0\text{ meters}}$!

Even though the runner burned physical calories and ran a quarter of a mile, physically their net displacement is zero because their ending location matches their starting location.

```
       Start / Finish
             *
           .' '.          Total Path Length (Distance) = 400 m
          /     \
         |   O   |        Initial Position x_1 = 0 m
          \     /         Final Position   x_2 = 0 m
           '. .'          Displacement Δx  = x_2 - x_1 = 0 m
```

---

## 1.4 Vector Addition of Displacements in One Dimension

If an object undergoes a sequence of successive displacements along a straight line:
1. First displacement: $\Delta x_1$
2. Second displacement: $\Delta x_2$
3. Third displacement: $\Delta x_3$

The **total net displacement** is the algebraic sum of the individual signed displacements:

$$\Delta x_{\text{net}} = \Delta x_1 + \Delta x_2 + \Delta x_3 + \dots + \Delta x_n = \sum_{k=1}^n \Delta x_k$$

In contrast, the **total distance** is the sum of the absolute values of each travel segment:

$$d_{\text{total}} = |\Delta x_1| + |\Delta x_2| + |\Delta x_3| + \dots + |\Delta x_n| = \sum_{k=1}^n |\Delta x_k|$$

Notice the fundamental mathematical inequality:

$$\mathbf{|\Delta x_{\text{net}}| \le d_{\text{total}}}$$

The magnitude of net displacement is **always less than or equal to** total distance. The two are equal if and only if the object travels strictly in a single unbroken direction without ever reversing!

---

## 1.5 Time and the Time Interval

Just as spatial position requires an origin $x = 0$, temporal duration requires a reference zero: $t = 0$.
- In physics and simulation, $t = 0$ represents the moment the stopwatch is started or the simulation engine initializes.
- A **time interval** $\Delta t$ is the elapsed duration between two clock readings:

$$\Delta t = t_{\text{final}} - t_{\text{initial}} = t_2 - t_1$$

Because time flows unidirectionally forward in classical mechanics, elapsed time is always strictly positive: $\Delta t > 0$.

---

## 1.6 Ten Progressive Worked Numerical Examples

### Example 1.1: Calculating 1D Displacement from Coordinates
**Problem:** A robotic warehouse rover moves along an automated sorting aisle. It starts at coordinate $x_1 = +14.2\text{ meters}$ and travels to pick up a bin at coordinate $x_2 = -6.8\text{ meters}$. Calculate its net displacement vector $\Delta x$ and state its direction.

**Step 1:** Write the definition of displacement:
$$\Delta x = x_2 - x_1$$

**Step 2:** Substitute the coordinates with their signs:
$$\Delta x = (-6.8\text{ m}) - (+14.2\text{ m}) = -6.8 - 14.2 = -21.0\text{ meters}$$

**Step 3:** Interpret the sign:
The negative sign indicates that the net motion was directed in the negative direction (leftward or westward).

**Conclusion:** The displacement is $-21.0\text{ meters}$ (a magnitude of $21.0\text{ m}$ in the negative direction).

---

### Example 1.2: Multi-Leg Journey — Distance vs Displacement
**Problem:** A technician in an aircraft hangar walks $80\text{ meters}$ eastward, realizes they dropped a wrench, turns around and walks $35\text{ meters}$ westward, and then turns eastward again to walk $15\text{ meters}$ to a workstation. 
1. Establish a coordinate system with East as positive.
2. Find the total distance walked.
3. Find the technician's final position and net displacement relative to the start.

**Step 1:** Define coordinate system:
East is $+$, West is $-$. Start at origin $x_0 = 0$.
- Leg 1: $\Delta x_1 = +80\text{ m}$
- Leg 2: $\Delta x_2 = -35\text{ m}$
- Leg 3: $\Delta x_3 = +15\text{ m}$

**Step 2:** Calculate total distance $d$:
$$d = |\Delta x_1| + |\Delta x_2| + |\Delta x_3| = |80| + |-35| + |15| = 80 + 35 + 15 = 130\text{ meters}$$

**Step 3:** Calculate net displacement $\Delta x_{\text{net}}$:
$$\Delta x_{\text{net}} = \Delta x_1 + \Delta x_2 + \Delta x_3 = (+80) + (-35) + (+15) = 80 - 35 + 15 = +60\text{ meters}$$

**Step 4:** Final position:
$$x_{\text{final}} = x_0 + \Delta x_{\text{net}} = 0 + 60 = +60\text{ meters}$$

**Conclusion:** The technician walked a total distance of $130\text{ m}$, but their net displacement is only $+60\text{ m}$ East.

---

### Example 1.3: Frame of Reference Transformation (The Moving Walkway)
**Problem:** An airport moving walkway glides forward at $v_{\text{walk}} = +1.5\text{ m/s}$ relative to the terminal floor. A passenger steps onto the walkway at $x = 0$ and walks forward along the moving surface at $v_{\text{pass}} = +1.2\text{ m/s}$ relative to the walkway for $\Delta t = 20\text{ seconds}$.
1. What distance did the passenger walk relative to the walkway?
2. What is the passenger's total displacement relative to the airport terminal floor?

**Step 1:** Displacement relative to the walkway surface:
$$\Delta x_{\text{relative}} = v_{\text{pass}} \cdot \Delta t = (1.2\text{ m/s}) \times (20\text{ s}) = +24.0\text{ meters}$$

**Step 2:** Displacement of the walkway relative to the terminal floor:
$$\Delta x_{\text{walkway}} = v_{\text{walk}} \cdot \Delta t = (1.5\text{ m/s}) \times (20\text{ s}) = +30.0\text{ meters}$$

**Step 3:** Total displacement relative to the terminal floor (Galilean addition):
$$\Delta x_{\text{ground}} = \Delta x_{\text{relative}} + \Delta x_{\text{walkway}} = 24.0\text{ m} + 30.0\text{ m} = +54.0\text{ meters}$$

**Conclusion:** The passenger walked $24\text{ m}$ on the rubber belt, but moved $54\text{ m}$ relative to a stationary observer standing on the terminal floor.

---

### Example 1.4: Passenger Walking Against the Motion
**Problem:** In the airport of Example 1.3, another passenger on the same walkway ($v_{\text{walk}} = +1.5\text{ m/s}$) turns around and walks backward against the belt motion at $v_{\text{pass}} = -1.8\text{ m/s}$ relative to the walkway for $\Delta t = 10\text{ seconds}$. Find their net displacement relative to the stationary terminal floor.

**Step 1:** Displacement relative to walkway belt:
$$\Delta x_{\text{belt}} = (-1.8\text{ m/s}) \times (10\text{ s}) = -18.0\text{ meters}$$

**Step 2:** Belt displacement relative to floor:
$$\Delta x_{\text{floor}} = (+1.5\text{ m/s}) \times (10\text{ s}) = +15.0\text{ meters}$$

**Step 3:** Net ground displacement:
$$\Delta x_{\text{net}} = \Delta x_{\text{belt}} + \Delta x_{\text{floor}} = -18.0\text{ m} + 15.0\text{ m} = -3.0\text{ meters}$$

**Conclusion:** Even though the belt was moving forward, the passenger's backward walking was faster, producing a net displacement of $-3.0\text{ meters}$ backward relative to the terminal.

---

### Example 1.5: Position Function Evaluation
**Problem:** A drone's altitude position along a vertical test guide wire is modeled by $y(t) = 5.0 + 3.0t - 0.5t^2$ meters, where $t$ is in seconds.
1. Determine the drone's position at $t = 0\text{ s}$, $t = 2\text{ s}$, and $t = 6\text{ s}$.
2. Compute the net displacement between $t = 2\text{ s}$ and $t = 6\text{ s}$.

**Step 1:** Evaluate positions:
- At $t = 0$: $y(0) = 5.0 + 3.0(0) - 0.5(0)^2 = +5.0\text{ meters}$.
- At $t = 2$: $y(2) = 5.0 + 3.0(2) - 0.5(2^2) = 5.0 + 6.0 - 0.5(4) = 5.0 + 6.0 - 2.0 = +9.0\text{ meters}$.
- At $t = 6$: $y(6) = 5.0 + 3.0(6) - 0.5(6^2) = 5.0 + 18.0 - 0.5(36) = 5.0 + 18.0 - 18.0 = +5.0\text{ meters}$.

**Step 2:** Compute net displacement from $t = 2$ to $t = 6$:
$$\Delta y = y(6) - y(2) = (+5.0\text{ m}) - (+9.0\text{ m}) = -4.0\text{ meters}$$

**Conclusion:** Between $t = 2\text{ s}$ and $t = 6\text{ s}$, the drone experienced a downward displacement of $-4.0\text{ meters}$.

---

### Example 1.6: Turning Point and Total Distance from a Position Equation
**Problem:** For the drone in Example 1.5 with $y(t) = 5.0 + 3.0t - 0.5t^2$:
1. Find the time when the drone reaches its maximum height.
2. Calculate the total distance traveled by the drone from $t = 0$ to $t = 6\text{ seconds}$.

**Step 1:** Find maximum height (turning point where slope $v = y'(t) = 0$):
$$v(t) = \frac{dy}{dt} = 3.0 - 1.0t = 0 \implies t = 3.0\text{ seconds}$$

**Step 2:** Evaluate peak position at $t = 3\text{ s}$:
$$y(3) = 5.0 + 3.0(3) - 0.5(3^2) = 5.0 + 9.0 - 4.5 = +9.5\text{ meters}$$

**Step 3:** Break the motion into monotonic directional segments:
- Segment 1 (Ascending, $t = 0 \to 3$): Starts at $y(0) = 5.0\text{ m}$, peaks at $y(3) = 9.5\text{ m}$.
  $$d_1 = |9.5 - 5.0| = 4.5\text{ meters}$$
- Segment 2 (Descending, $t = 3 \to 6$): Drops from $y(3) = 9.5\text{ m}$ to $y(6) = 5.0\text{ m}$.
  $$d_2 = |5.0 - 9.5| = |-4.5| = 4.5\text{ meters}$$

**Step 4:** Sum the segment distances:
$$d_{\text{total}} = d_1 + d_2 = 4.5\text{ m} + 4.5\text{ m} = 9.0\text{ meters}$$

**Step 5:** Compare with net displacement:
$$\Delta y_{\text{net}} = y(6) - y(0) = 5.0 - 5.0 = 0\text{ meters}$$

**Conclusion:** Total distance traveled is $9.0\text{ meters}$, while net displacement is $0\text{ meters}$.

---

### Example 1.7: Shift of Coordinate Origin
**Problem:** A linear particle accelerator has sensors at laboratory coordinates $x_A = +12.0\text{ m}$ and $x_B = +47.0\text{ m}$. An experimental team recalibrates the origin, defining sensor $A$ as the new origin ($x' = 0$).
1. State the coordinate transformation equation relating new coordinates $x'$ to original coordinates $x$.
2. What is sensor $B$'s new coordinate $x'_B$?
3. Compute the displacement $\Delta x = x_B - x_A$ in the old system, and $\Delta x' = x'_B - x'_A$ in the new system.

**Step 1:** Coordinate transformation equation:
To make $x_A = 12.0$ become $x'_A = 0$, subtract $12.0$:
$$x' = x - 12.0\text{ meters}$$

**Step 2:** Sensor $B$'s new coordinate:
$$x'_B = 47.0 - 12.0 = +35.0\text{ meters}$$

**Step 3:** Compute displacements in both systems:
- Old system: $\Delta x = x_B - x_A = 47.0 - 12.0 = +35.0\text{ meters}$.
- New system: $\Delta x' = x'_B - x'_A = 35.0 - 0.0 = +35.0\text{ meters}$.

**Conclusion:** Displacements are **invariant** under origin shifts! Moving the zero point changes coordinate numbers, but physical displacements remain identical.

---

### Example 1.8: Reversing Direction in an Elevator Shaft
**Problem:** A mining elevator starts at ground level ($y = 0$). It descends $120\text{ meters}$ into a mine shaft, ascends $45\text{ meters}$ to drop off equipment, descends another $80\text{ meters}$, and finally ascends $155\text{ meters}$.
1. Taking upward as positive, write the signed displacement vector for each of the four legs.
2. What is the elevator's final depth relative to ground level?
3. What total cable distance passed through the hoist pulley?

**Step 1:** Signed displacements:
- Leg 1: $\Delta y_1 = -120\text{ m}$
- Leg 2: $\Delta y_2 = +45\text{ m}$
- Leg 3: $\Delta y_3 = -80\text{ m}$
- Leg 4: $\Delta y_4 = +155\text{ m}$

**Step 2:** Final position (net displacement from origin $y=0$):
$$y_{\text{final}} = \Delta y_1 + \Delta y_2 + \Delta y_3 + \Delta y_4 = -120 + 45 - 80 + 155 = 0\text{ meters}$$

**Step 3:** Total cable travel distance:
$$d_{\text{total}} = |-120| + |45| + |-80| + |155| = 120 + 45 + 80 + 155 = 400\text{ meters}$$

**Conclusion:** The elevator is back at ground level ($y = 0$), but $400\text{ meters}$ of cable was cycled through the hoist.

---

### Example 1.9: Discrete Sensor Telemetry Analysis
**Problem:** An automated rail vehicle records position timestamps along a straight track:

| Timestamp $t$ (s) | $0.0$ | $2.0$ | $4.0$ | $6.0$ | $8.0$ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Position $x$ (m) | $+5.0$ | $+18.0$ | $+26.0$ | $+22.0$ | $+10.0$ |

1. Calculate the displacement during each $2\text{-second}$ interval.
2. Identify the interval during which the vehicle reversed its direction.
3. Calculate the total distance traveled over the full $8\text{ seconds}$.

**Step 1:** Displacements between consecutive timestamps:
- $t = 0 \to 2$: $\Delta x_{0\to 2} = 18.0 - 5.0 = +13.0\text{ m}$ (Forward)
- $t = 2 \to 4$: $\Delta x_{2\to 4} = 26.0 - 18.0 = +8.0\text{ m}$ (Forward)
- $t = 4 \to 6$: $\Delta x_{4\to 6} = 22.0 - 26.0 = -4.0\text{ m}$ (Backward)
- $t = 6 \to 8$: $\Delta x_{6\to 8} = 10.0 - 22.0 = -12.0\text{ m}$ (Backward)

**Step 2:** Direction reversal:
Displacement changed sign from positive ($+8.0\text{ m}$) to negative ($-4.0\text{ m}$) at $t = 4.0\text{ seconds}$, when position was at its maximum of $+26.0\text{ m}$.

**Step 3:** Total distance:
$$d = |+13.0| + |+8.0| + |-4.0| + |-12.0| = 13.0 + 8.0 + 4.0 + 12.0 = 37.0\text{ meters}$$
(Net displacement: $x(8) - x(0) = 10.0 - 5.0 = +5.0\text{ meters}$).

---

### Example 1.10: Two Interacting Observers in Relative Motion
**Problem:** Train A moves eastward at $+20\text{ m/s}$ along a straight track. Train B moves westward along an adjacent parallel track at $-25\text{ m/s}$ (both velocities measured by a trackside observer $O$). At $t = 0$, both trains pass each other at origin $x = 0$.
1. Write the position equations $x_A(t)$ and $x_B(t)$ in the trackside observer's frame.
2. Find the separation distance between the two trains at $t = 10\text{ seconds}$.
3. What is the velocity of Train B as measured by a passenger looking out the window of Train A?

**Step 1:** Position equations in trackside frame:
$$x_A(t) = +20 t$$
$$x_B(t) = -25 t$$

**Step 2:** Positions at $t = 10\text{ s}$:
$$x_A(10) = 20(10) = +200\text{ meters}$$
$$x_B(10) = -25(10) = -250\text{ meters}$$
Separation distance:
$$\text{Separation} = |x_A(10) - x_B(10)| = |200 - (-250)| = |200 + 250| = 450\text{ meters}$$

**Step 3:** Velocity of B relative to A:
By Galilean transformation:
$$v_{B/A} = v_B - v_A = (-25\text{ m/s}) - (+20\text{ m/s}) = -45\text{ m/s}$$

**Conclusion:** To a passenger on Train A, Train B appears to rush backward past them at $45\text{ m/s}$ ($162\text{ km/h}$).

---

## 1.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Basic Displacement and Position Coordinates (Foundational)
- **Exercise 1.1:** A robotic cart starts at $x_1 = -18\text{ m}$ and rolls to $x_2 = +7\text{ m}$. Find its net displacement $\Delta x$.
- **Exercise 1.2:** An athlete jogs $150\text{ m}$ North, turns around and jogs $220\text{ m}$ South. Taking North as positive, calculate total distance traveled and net displacement.

### Tier 2: Multi-Segment Journeys & Reversals
- **Exercise 1.3:** A delivery drone flies along a straight pipeline. It travels $+450\text{ m}$, then $-210\text{ m}$, then $+80\text{ m}$, and finally $-350\text{ m}$. Find its final position relative to its takeoff point and the total distance flown.
- **Exercise 1.4:** A subterranean drill begins at depth $y = -50\text{ m}$ (where upward is positive). It drills downward $\Delta y_1 = -180\text{ m}$, is pulled upward $\Delta y_2 = +60\text{ m}$ for maintenance, and drills downward again $\Delta y_3 = -95\text{ m}$. What is its final depth coordinate?

### Tier 3: Frame of Reference Addition
- **Exercise 1.5:** A passenger walks forward at $+1.4\text{ m/s}$ inside a passenger train moving forward at $+22.0\text{ m/s}$ relative to the ground. How far does the passenger travel relative to the ground in $15\text{ seconds}$?
- **Exercise 1.6:** If the passenger in Exercise 1.5 instead walks toward the rear of the train at $-1.4\text{ m/s}$ relative to the train, what is their displacement relative to the ground in $15\text{ seconds}$?

### Tier 4: Position Functions and Extremum Turning Points
- **Exercise 1.7:** An object's 1D position is given by $x(t) = 4t^2 - 16t + 5$ meters for $t \ge 0$. Find the time $t$ when the object reverses direction and calculate its coordinate at that turning point.
- **Exercise 1.8:** For the object in Exercise 1.7, calculate the total distance traveled from $t = 0$ to $t = 4\text{ seconds}$.

### Tier 5: Relative Motion and Coordinate Invariance
- **Exercise 1.9:** Two autonomous rovers $R_1$ and $R_2$ move along the Martian equator. Their positions relative to the lander are $x_1(t) = 100 + 4t$ and $x_2(t) = 500 - 6t$ meters. At what time $t$ do the rovers meet, and what is their coordinate at the rendezvous?
- **Exercise 1.10:** Prove algebraically that for any three spatial points $A$, $B$, and $C$ on a coordinate line, the displacement vector $\Delta x_{A \to C}$ is identically equal to $\Delta x_{A \to B} + \Delta x_{B \to C}$ regardless of the choice of coordinate origin.

---

## 1.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 1.1
Find displacement from $x_1 = -18\text{ m}$ to $x_2 = +7\text{ m}$.
$$\Delta x = x_2 - x_1 = (+7) - (-18) = 7 + 18 = +25\text{ meters}$$
**Final Answer:** $+25\text{ meters}$ (in the positive direction).

---

### Solution to Exercise 1.2
Jogging $150\text{ m}$ North ($+150$) and $220\text{ m}$ South ($-220$).
1. Total distance:
$$d = |+150| + |-220| = 150 + 220 = 370\text{ meters}$$
2. Net displacement:
$$\Delta y = (+150) + (-220) = -70\text{ meters}$$
**Final Answer:** Distance $= 370\text{ m}$; Displacement $= -70\text{ m}$ (or $70\text{ m}$ South).

---

### Solution to Exercise 1.3
Drone path: $+450\text{ m}, -210\text{ m}, +80\text{ m}, -350\text{ m}$.
1. Net displacement:
$$\Delta x = 450 - 210 + 80 - 350 = (450 + 80) - (210 + 350) = 530 - 560 = -30\text{ meters}$$
Final position: $x = -30\text{ meters}$.
2. Total distance:
$$d = |450| + |-210| + |80| + |-350| = 450 + 210 + 80 + 350 = 1090\text{ meters}$$
**Final Answer:** Final position $= -30\text{ m}$; Total distance $= 1090\text{ m}$.

---

### Solution to Exercise 1.4
Subterranean drill starting at $y_0 = -50\text{ m}$:
Displacements: $\Delta y_1 = -180\text{ m}$, $\Delta y_2 = +60\text{ m}$, $\Delta y_3 = -95\text{ m}$.
$$y_{\text{final}} = y_0 + \Delta y_1 + \Delta y_2 + \Delta y_3 = -50 - 180 + 60 - 95 = -265\text{ meters}$$
**Final Answer:** Final depth coordinate $y = -265\text{ meters}$ (depth of $265\text{ m}$ below surface).

---

### Solution to Exercise 1.5
Passenger walking forward inside moving train:
1. Ground velocity:
$$v_{\text{ground}} = v_{\text{train}} + v_{\text{passenger}} = 22.0\text{ m/s} + 1.4\text{ m/s} = 23.4\text{ m/s}$$
2. Displacement in $15\text{ s}$:
$$\Delta x_{\text{ground}} = (23.4\text{ m/s}) \times (15\text{ s}) = 351.0\text{ meters}$$
**Final Answer:** $351.0\text{ meters}$.

---

### Solution to Exercise 1.6
Passenger walking toward rear inside moving train:
1. Ground velocity:
$$v_{\text{ground}} = v_{\text{train}} + v_{\text{passenger}} = 22.0\text{ m/s} + (-1.4\text{ m/s}) = 20.6\text{ m/s}$$
2. Displacement in $15\text{ s}$:
$$\Delta x_{\text{ground}} = (20.6\text{ m/s}) \times (15\text{ s}) = 309.0\text{ meters}$$
**Final Answer:** $309.0\text{ meters}$.

---

### Solution to Exercise 1.7
Find turning point for $x(t) = 4t^2 - 16t + 5$:
1. Velocity is the derivative:
$$v(t) = x'(t) = 8t - 16$$
2. Turning point occurs when $v(t) = 0$:
$$8t - 16 = 0 \implies 8t = 16 \implies t = 2\text{ seconds}$$
3. Coordinate at $t = 2$:
$$x(2) = 4(2^2) - 16(2) + 5 = 4(4) - 32 + 5 = 16 - 32 + 5 = -11\text{ meters}$$
**Final Answer:** Reverses direction at $t = 2$ seconds at coordinate $x = -11$ meters.

---

### Solution to Exercise 1.8
Total distance from $t = 0$ to $t = 4$ for $x(t) = 4t^2 - 16t + 5$:
1. Position at endpoints and turning point ($t = 2$):
- $x(0) = 4(0) - 16(0) + 5 = +5\text{ m}$.
- $x(2) = -11\text{ m}$ (turning point).
- $x(4) = 4(16) - 16(4) + 5 = 64 - 64 + 5 = +5\text{ m}$.
2. Segment 1 ($t = 0 \to 2$):
$$d_1 = |x(2) - x(0)| = |-11 - 5| = |-16| = 16\text{ meters}$$
3. Segment 2 ($t = 2 \to 4$):
$$d_2 = |x(4) - x(2)| = |5 - (-11)| = |16| = 16\text{ meters}$$
4. Total distance:
$$d_{\text{total}} = d_1 + d_2 = 16 + 16 = 32\text{ meters}$$
(Net displacement is $x(4) - x(0) = 5 - 5 = 0\text{ m}$).
**Final Answer:** Total distance $= 32\text{ meters}$.

---

### Solution to Exercise 1.9
Rendezvous of two rovers: $x_1(t) = 100 + 4t$ and $x_2(t) = 500 - 6t$.
1. Set positions equal:
$$100 + 4t = 500 - 6t$$
$$4t + 6t = 500 - 100 \implies 10t = 400 \implies t = 40\text{ seconds}$$
2. Rendezvous coordinate:
$$x_1(40) = 100 + 4(40) = 100 + 160 = 260\text{ meters}$$
$$x_2(40) = 500 - 6(40) = 500 - 240 = 260\text{ meters}$$
**Final Answer:** Rendezvous occurs at $t = 40$ seconds at coordinate $x = 260$ meters.

---

### Solution to Exercise 1.10
Prove $\Delta x_{A \to C} = \Delta x_{A \to B} + \Delta x_{B \to C}$ algebraically:
1. Let the spatial coordinates of points $A, B, C$ relative to any arbitrary origin be $x_A, x_B, x_C$.
2. By definition of displacement:
$$\Delta x_{A \to B} = x_B - x_A$$
$$\Delta x_{B \to C} = x_C - x_B$$
$$\Delta x_{A \to C} = x_C - x_A$$
3. Add the two sub-displacements:
$$\Delta x_{A \to B} + \Delta x_{B \to C} = (x_B - x_A) + (x_C - x_B)$$
Regrouping:
$$= x_C - x_A + (x_B - x_B) = x_C - x_A + 0 = x_C - x_A$$
4. Since $x_C - x_A = \Delta x_{A \to C}$, the identity holds unconditionally. $\blacksquare$
**Final Answer:** Proved algebraically; the intermediate coordinate $x_B$ cancels out completely.
