# Chapter 1: The Layman's Foundation â€” Space, Time, and the Frame of Reference

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
           '. .'          Displacement Î”x  = x_2 - x_1 = 0 m
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

### Example 1.2: Multi-Leg Journey â€” Distance vs Displacement
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


---

# Chapter 2: Velocity and Average Speed â€” The Journey Across Time

> *"To record where an object is located is merely a static catalog of coordinates. Physics truly begins when we ask how rapidly those coordinates are shifting across the unrelenting flow of time. Yet the simplest question â€” 'How fast did it go?' â€” conceals one of the most famous mathematical traps in all of science."*

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


---

# Chapter 3: Instantaneous Velocity, Acceleration, and Graphical Calculus

> *"An average velocity tells you where a traveler arrived at the end of the day; instantaneous velocity reveals the needle of the speedometer at the exact millisecond a deer leaped across the highway. To understand real physical motion, we must read the subtle contours of motion graphs â€” where geometric slopes unveil velocity and acceleration, and shaded areas compute the ground traversed."*

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
        |  ======>   /     \   (Area Under Curve = Displacement Î”x)
        +-----------+-------+-------------> t
        |            -Area   \     /
        |            ======>  '---'

   3. Acceleration-Time (a-t)
      a ^         +---------+
        |         |  +Area  |  (Area Under Curve = Velocity Change Î”v)
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


---

# Chapter 4: The Four Sacred Kinematic Equations (Constant Acceleration)

> *"In the vast, turbulent complexity of the universe, there exists a special sanctuary of mathematical perfection: motion under constant acceleration. When acceleration remains rock-steady, the sprawling machinery of calculus crystallizes into four algebraic equations of immense predictive power â€” enabling us to target lunar landers, design aircraft carrier catapults, and engineer highway safety zones with absolute precision."*

---

## 4.1 The Realm of Constant Acceleration

In Chapters 2 and 3, we explored motion where acceleration could vary arbitrarily with time. In such general cases, predicting position requires calculus integration:

$$v(t) = \int a(t) \, dt, \quad x(t) = \int v(t) \, dt$$

However, a vast number of critical physical systems operate under conditions where acceleration is either strictly constant or very nearly constant over the duration of interest:
- **Free fall near a planetary surface** (neglecting air resistance, $a = -g = -9.8\text{ m/s}^2$).
- **Aircraft carrier steam or electromagnetic catapults** launching a fighter jet along a runway.
- **Emergency automotive braking** where anti-lock brake systems maintain maximum tire-pavement friction.
- **Charged particles drifting through uniform electric fields** inside particle accelerators or mass spectrometers.

When acceleration is constant ($a = \text{constant}$), velocity varies strictly as a linear ramp, and position unfolds as a smooth parabolic curve.

---

## 4.2 First-Principles Derivation of the Four Sacred Equations

Let an object move along a straight line with constant acceleration $a$.
Let:
- $t_0 = 0$ be the initial time.
- $t$ be the elapsed time duration ($\Delta t = t - 0 = t$).
- $x_0$ be the initial position at $t = 0$.
- $x$ be the final position at time $t$ ($\Delta x = x - x_0$).
- $v_0$ be the initial velocity at $t = 0$.
- $v$ be the final instantaneous velocity at time $t$.

Across these parameters, there are **five fundamental kinematic variables**:

$$\Delta x, \quad v_0, \quad v, \quad a, \quad t$$

Let us derive the four equations that link them together.

---

### Derivation of Equation 1: The Velocity Ramp
From the definition of constant acceleration:

$$a = \frac{\Delta v}{\Delta t} = \frac{v - v_0}{t - 0} = \frac{v - v_0}{t}$$

Multiply both sides by $t$:

$$a t = v - v_0$$

Solve for $v$:

$$\mathbf{v = v_0 + a t} \quad \text{[Equation 1: Omits } \Delta x \text{]}$$

*Physical meaning:* Final velocity equals initial velocity plus the velocity accumulated over time $t$ at constant rate $a$.

---

### Derivation of Equation 2: The Average Velocity Displacement
Because acceleration is constant, the velocity-time graph is a straight, non-curving line connecting $(0, v_0)$ to $(t, v)$.
On any strictly linear ramp, the average value is precisely the arithmetic midpoint of the starting and ending values:

$$v_{\text{avg}} = \frac{v_0 + v}{2}$$

From the fundamental definition of average velocity:

$$v_{\text{avg}} = \frac{\Delta x}{t} \implies \Delta x = v_{\text{avg}} \cdot t$$

Substitute the midpoint average:

$$\mathbf{\Delta x = \left( \frac{v_0 + v}{2} \right) t} \quad \text{[Equation 2: Omits } a \text{]}$$

*Geometric meaning:* On the $v-t$ graph, the area under the linear ramp is a trapezoid. The area of a trapezoid with parallel vertical heights $v_0$ and $v$ over base $t$ is $\frac{v_0 + v}{2} \times t$.

```
       Velocity v
           ^
         v -+                       . P(t, v)
            |                   _.-'|
            |               _.-'    |  Trapezoid Area = ((v_0 + v)/2) * t
       v_0 -+-----------*.-'        |                 = Displacement Î”x
            |           |           |
            |           |           |
            +-----------+-----------+----------> Time t
                        0           t
```

---

### Derivation of Equation 3: The Parabolic Position Equation
We now seek an equation giving displacement directly in terms of time $t$ without needing to know the final velocity $v$.
Take Equation 2:

$$\Delta x = \left( \frac{v_0 + v}{2} \right) t$$

From Equation 1, substitute $v = v_0 + a t$:

$$\Delta x = \left( \frac{v_0 + (v_0 + a t)}{2} \right) t$$
$$\Delta x = \left( \frac{2 v_0 + a t}{2} \right) t = \left( v_0 + \frac{1}{2} a t \right) t$$

Distribute $t$:

$$\mathbf{\Delta x = v_0 t + \frac{1}{2} a t^2} \quad \text{[Equation 3: Omits } v \text{]}$$

Or writing in terms of absolute position $x(t) = x_0 + \Delta x$:

$$\mathbf{x(t) = x_0 + v_0 t + \frac{1}{2} a t^2}$$

### The Geometric Proof: Splitting the Area
Look at the $v-t$ trapezoid between $0$ and $t$. Slice it horizontally at height $v_0$:

```
       Velocity v
           ^
         v -+                       . P(t, v)
            |                   _.-'|
            |   TRIANGLE    _.-'    |  Height = (v - v_0) = at
            |           _.-'        |  Base   = t
       v_0 -+----------+------------+  Area   = 1/2 * at * t = 1/2 at^2
            |                       |
            |       RECTANGLE       |  Height = v_0
            |                       |  Base   = t
            |                       |  Area   = v_0 * t
            +-----------------------+----------> Time t
            0                       t
```

The total area under the velocity curve splits cleanly into:
1. **The Base Rectangle:** Area $= v_0 \times t$ (the displacement the object would have covered had it continued cruising at constant initial velocity $v_0$).
2. **The Upper Triangle:** Base $= t$, Height $= v - v_0 = at$. Area $= \frac{1}{2} \times \text{base} \times \text{height} = \frac{1}{2}(t)(at) = \frac{1}{2} a t^2$ (the additional displacement gained purely from accelerating!).

Adding them together yields:

$$\Delta x = v_0 t + \frac{1}{2} a t^2$$

---

### Derivation of Equation 4: Timeless Kinematics (Torricelli's Equation)
What if an experiment records initial velocity, final velocity, and distance, but no stopwatch was available? We require a relationship that completely eliminates time $t$.

From Equation 1, solve for $t$:

$$v = v_0 + a t \implies a t = v - v_0 \implies t = \frac{v - v_0}{a}$$

Now substitute this expression for $t$ into Equation 2:

$$\Delta x = \left( \frac{v + v_0}{2} \right) t = \left( \frac{v + v_0}{2} \right) \left( \frac{v - v_0}{a} \right)$$

Look at the numerator: $(v + v_0)(v - v_0)$ is the classic difference of two squares:

$$(v + v_0)(v - v_0) = v^2 - v_0^2$$

Therefore:

$$\Delta x = \frac{v^2 - v_0^2}{2a}$$

Multiply both sides by $2a$:

$$2a \Delta x = v^2 - v_0^2$$

Rearrange to solve for $v^2$:

$$\mathbf{v^2 = v_0^2 + 2 a \Delta x} \quad \text{[Equation 4: Omits } t \text{]}$$

### The Bridge to Energy Conservation
Notice what happens if we multiply Equation 4 by $\frac{1}{2} m$ (half the object's mass):

$$\frac{1}{2} m v^2 = \frac{1}{2} m v_0^2 + m a \Delta x$$

By Newton's Second Law, $F_{\text{net}} = m a$. Thus $m a \Delta x = F_{\text{net}} \Delta x = \text{Work}$:

$$\frac{1}{2} m v^2 - \frac{1}{2} m v_0^2 = W_{\text{net}}$$

Equation 4 is nothing less than the kinematic foundation of the **Work-Energy Theorem**!

---

## 4.3 The Kinematic Selection Matrix

Every kinematic problem gives you some variables and asks for another. Since each of the four equations connects exactly four variables while omitting one, solving any problem in seconds requires identifying the **missing variable**:

| Equation | Mathematical Formula | What Variable is OMITTED? | When to Choose This Equation? |
| :---: | :---: | :---: | :--- |
| **1** | $v = v_0 + a t$ | **Displacement ($\Delta x$)** | When distance/position is neither given nor requested. |
| **2** | $\Delta x = \left(\frac{v_0 + v}{2}\right) t$ | **Acceleration ($a$)** | When acceleration is unknown and not needed. |
| **3** | $\Delta x = v_0 t + \frac{1}{2} a t^2$ | **Final Velocity ($v$)** | When final velocity is neither given nor requested. |
| **4** | $v^2 = v_0^2 + 2 a \Delta x$ | **Time ($t$)** | When elapsed time is neither given nor requested ("timeless"). |

---

## 4.4 Ten Progressive Worked Numerical Examples

### Example 4.1: Aircraft Carrier Steam Catapult Launch
**Problem:** A fighter jet with mass $20,000\text{ kg}$ is accelerated from rest ($v_0 = 0$) along a straight $90.0\text{-meter}$ flight deck catapult. The jet must reach a safe takeoff airspeed of $v = 75.0\text{ m/s}$ ($270\text{ km/h}$) at the end of the deck. Assuming constant acceleration:
1. Calculate the required acceleration of the catapult.
2. Express this acceleration in units of Earth's gravity ($g = 9.8\text{ m/s}^2$).
3. How long does the catapult stroke take?

**Step 1:** Identify knowns and unknowns:
- $v_0 = 0\text{ m/s}$ (starts from rest)
- $v = 75.0\text{ m/s}$ (takeoff speed)
- $\Delta x = 90.0\text{ m}$ (catapult length)
- Missing variable: Time $t$.
- Target variable: Acceleration $a$.

**Step 2:** Select Equation 4 (omits $t$):
$$v^2 = v_0^2 + 2 a \Delta x$$
$$75.0^2 = 0^2 + 2 a (90.0)$$
$$5625.0 = 180.0 a$$
$$a = \frac{5625.0}{180.0} = 31.25\text{ m/s}^2$$

**Step 3:** Convert to $g$-units:
$$\text{G-force} = \frac{a}{g} = \frac{31.25\text{ m/s}^2}{9.80\text{ m/s}^2} \approx 3.19\text{ g}$$
The pilot experiences roughly $3.2$ times their normal body weight.

**Step 4:** Calculate time duration:
Select Equation 1 ($v = v_0 + at$):
$$75.0 = 0 + (31.25) t \implies t = \frac{75.0}{31.25} = 2.40\text{ seconds}$$
*(Verification using Eq 2: $\Delta x = \frac{0 + 75}{2} \times 2.40 = 37.5 \times 2.40 = 90.0\text{ m}$)*.

---

### Example 4.2: High-Speed Automotive Braking Distance
**Problem:** An electric vehicle cruising at $v_0 = 30.0\text{ m/s}$ ($108\text{ km/h}$) applies maximum braking, generating a constant deceleration of $a = -6.0\text{ m/s}^2$.
1. How long does it take for the vehicle to stop completely?
2. What is the total braking distance?
3. How far did the car travel during the first half of the braking time?

**Step 1:** Time to stop ($v = 0$):
Use Equation 1 ($v = v_0 + at$):
$$0 = 30.0 + (-6.0) t \implies 6.0 t = 30.0 \implies t = 5.0\text{ seconds}$$

**Step 2:** Total braking distance:
Use Equation 4 ($v^2 = v_0^2 + 2a\Delta x$):
$$0^2 = 30.0^2 + 2(-6.0)\Delta x$$
$$0 = 900.0 - 12.0 \Delta x \implies 12.0 \Delta x = 900.0 \implies \Delta x = \frac{900.0}{12.0} = 75.0\text{ meters}$$

**Step 3:** Distance during the first half of braking time ($t = 2.5\text{ s}$):
Use Equation 3 ($\Delta x = v_0 t + \frac{1}{2} a t^2$):
$$\Delta x(2.5) = (30.0)(2.5) + \frac{1}{2}(-6.0)(2.5^2) = 75.0 - 3.0(6.25) = 75.0 - 18.75 = 56.25\text{ meters}$$
Notice: In the first half of time, the car covered $\frac{56.25}{75.0} = 75\%$ of the total stopping distance! In the final half of time, it covered only the remaining $25\%$ ($18.75\text{ m}$).

---

### Example 4.3: Bullet Penetrating Ballistics Gelatin
**Problem:** A $9\text{-mm}$ bullet strikes a block of ballistics gel at $v_0 = 380.0\text{ m/s}$ and penetrates to a depth of $\Delta x = 0.25\text{ meters}$ ($25\text{ cm}$) before coming to a complete rest. Assuming the retarding force provides uniform deceleration:
1. Calculate the magnitude of the deceleration inside the gel.
2. Determine how long the penetration event lasted.

**Step 1:** Find deceleration using Equation 4 ($v = 0$, $v_0 = 380$, $\Delta x = 0.25$):
$$v^2 = v_0^2 + 2 a \Delta x$$
$$0 = 380.0^2 + 2 a (0.25) = 144400.0 + 0.50 a$$
$$0.50 a = -144400.0 \implies a = -288,800\text{ m/s}^2 \approx -2.89 \times 10^5\text{ m/s}^2$$
In $g$-units: $\frac{288800}{9.8} \approx 29,469\text{ g}$!

**Step 2:** Calculate penetration time:
Use Equation 2 ($\Delta x = \frac{v_0 + v}{2} t$):
$$0.25 = \left(\frac{380.0 + 0}{2}\right) t = 190.0 t$$
$$t = \frac{0.25}{190.0} \approx 0.001316\text{ seconds} \approx 1.32\text{ milliseconds}$$

---

### Example 4.4: Drag Racer Quarter-Mile Sprint
**Problem:** A top-fuel dragster starts from rest ($v_0 = 0$) and covers a standard quarter-mile track ($\Delta x = 402.34\text{ meters}$) in $t = 3.80\text{ seconds}$. Assuming constant acceleration:
1. What was the dragster's acceleration?
2. What was its trap speed across the finish line in $\text{m/s}$ and $\text{km/h}$?

**Step 1:** Calculate acceleration using Equation 3 ($\Delta x = v_0 t + \frac{1}{2} a t^2$):
$$402.34 = 0(3.80) + \frac{1}{2} a (3.80^2) = \frac{1}{2} a (14.44) = 7.22 a$$
$$a = \frac{402.34}{7.22} \approx 55.726\text{ m/s}^2 \approx 5.69\text{ g}$$

**Step 2:** Calculate finish line velocity:
Use Equation 1 ($v = v_0 + at$):
$$v = 0 + (55.726)(3.80) \approx 211.76\text{ m/s}$$
Convert to $\text{km/h}$:
$$v = 211.76 \times 3.6 \approx 762.33\text{ km/h} \quad (473.7\text{ mph})$$

*(Double check using Eq 2: $\frac{0 + 211.76}{2} \times 3.80 = 105.88 \times 3.80 = 402.34\text{ m}$)*.

---

### Example 4.5: Catching a Speeding Speeder (Pursuit Kinematics)
**Problem:** A police cruiser is parked at the side of a highway. A speeding sports car passes the police cruiser at a constant speed of $v_{\text{car}} = 45.0\text{ m/s}$ ($162\text{ km/h}$).
The police officer immediately reacts: the cruiser accelerates from rest ($v_{0,\text{cop}} = 0$) at a constant rate of $a_{\text{cop}} = +3.0\text{ m/s}^2$.
1. How long does it take for the police cruiser to overtake the speeder?
2. How far down the highway does the intercept occur?
3. What is the cruiser's speed at the instant of intercept?

**Step 1:** Write the position equations for both vehicles taking the police post as origin ($x_0 = 0$) at $t = 0$:
- Speeder (Uniform Motion):
  $$x_{\text{car}}(t) = v_{\text{car}} t = 45.0 t$$
- Police Cruiser (Constant Acceleration):
  $$x_{\text{cop}}(t) = v_{0,\text{cop}} t + \frac{1}{2} a_{\text{cop}} t^2 = 0 + \frac{1}{2}(3.0) t^2 = 1.5 t^2$$

**Step 2:** Equate positions for intercept ($x_{\text{cop}} = x_{\text{car}}$):
$$1.5 t^2 = 45.0 t$$
Rearrange:
$$1.5 t^2 - 45.0 t = 0 \implies t(1.5 t - 45.0) = 0$$
Discard $t = 0$ (the initial passing moment). The non-trivial intercept time is:
$$1.5 t = 45.0 \implies t = \frac{45.0}{1.5} = 30.0\text{ seconds}$$

**Step 3:** Compute intercept distance:
$$x_{\text{intercept}} = x_{\text{car}}(30.0) = 45.0(30.0) = 1350.0\text{ meters} = 1.35\text{ km}$$
*(Verification using cruiser: $1.5(30.0^2) = 1.5(900) = 1350.0\text{ m}$)*.

**Step 4:** Police cruiser speed at intercept:
$$v_{\text{cop}} = v_{0} + a_{\text{cop}} t = 0 + (3.0)(30.0) = 90.0\text{ m/s} = 324.0\text{ km/h}$$
Notice: At the exact moment of intercept, the police cruiser is traveling at **exactly double** the speeder's speed!
*(General theorem: In any chase where one vehicle cruises at constant $v$ and the other accelerates uniformly from rest, $v_{\text{intercept}} = 2 v_{\text{cruiser}}$)*.

---

### Example 4.6: Reaction Time and Collision Avoidance
**Problem:** Two automated test cars $A$ and $B$ are traveling in the same direction on a single test lane:
- Car $A$ is leading, traveling at $v_A = 20.0\text{ m/s}$.
- Car $B$ is following directly behind at $v_B = 30.0\text{ m/s}$.
- When Car $B$ is distance $D = 40.0\text{ meters}$ behind Car $A$, Car $A$ suddenly slams on its brakes, decelerating at $a_A = -5.0\text{ m/s}^2$ until it stops.
- Car $B$'s driver/computer takes $\Delta t_{\text{react}} = 0.40\text{ seconds}$ to detect and apply brakes, then decelerates at $a_B = -6.0\text{ m/s}^2$.
Determine whether Car $B$ collides with Car $A$, or compute the minimum gap between them.

**Step 1:** Analyze Car $A$'s motion:
- Time to stop: $t_{\text{stop}, A} = \frac{20.0}{5.0} = 4.0\text{ seconds}$.
- Total distance covered by $A$:
  $$d_A = \frac{v_A^2}{2 |a_A|} = \frac{20.0^2}{2(5.0)} = \frac{400.0}{10.0} = 40.0\text{ meters}$$
- Position of Car $A$ at rest (taking Car $B$'s initial position as origin $x = 0$):
  $$x_{A,\text{final}} = D + d_A = 40.0\text{ m} + 40.0\text{ m} = +80.0\text{ meters}$$

**Step 2:** Analyze Car $B$'s motion:
- Reaction phase ($t \in [0, 0.40\text{ s}]$):
  $$d_{B,\text{react}} = v_B \times \Delta t_{\text{react}} = (30.0\text{ m/s}) \times (0.40\text{ s}) = 12.0\text{ meters}$$
- Braking phase ($t > 0.40\text{ s}$):
  $$d_{B,\text{brake}} = \frac{v_B^2}{2 |a_B|} = \frac{30.0^2}{2(6.0)} = \frac{900.0}{12.0} = 75.0\text{ meters}$$
- Total stopping distance of Car $B$:
  $$d_{B,\text{total}} = 12.0\text{ m} + 75.0\text{ m} = 87.0\text{ meters}$$

**Step 3:** Compare stopping positions:
- Final position of Car $A$: $x_A = +80.0\text{ meters}$.
- Total stopping distance of Car $B$: $d_B = 87.0\text{ meters}$.
Since $87.0\text{ m} > 80.0\text{ m}$, **a rear-end collision occurs** before Car $B$ can stop!

---

### Example 4.7: Successive Distance Intervals (Galileo's Odd-Number Rule)
**Problem:** A freight train locomotive starts from rest ($v_0 = 0$) and accelerates uniformly along a straight track. It covers distance $\Delta x_1 = 12.0\text{ meters}$ during the first time interval of duration $T = 4.0\text{ seconds}$.
1. Find the locomotive's acceleration $a$.
2. Calculate the distance $\Delta x_2$ covered during the *second* interval of $4.0\text{ seconds}$ (from $t = 4.0$ to $t = 8.0\text{ s}$).
3. Calculate the distance $\Delta x_3$ covered during the *third* interval of $4.0\text{ seconds}$ (from $t = 8.0$ to $t = 12.0\text{ s}$).
4. Confirm Galileo's Rule of Odd Numbers.

**Step 1:** Find acceleration using first interval ($t = 4.0\text{ s}$, $\Delta x_1 = 12.0\text{ m}$):
$$\Delta x_1 = \frac{1}{2} a T^2 \implies 12.0 = \frac{1}{2} a (4.0^2) = 8.0 a \implies a = \frac{12.0}{8.0} = 1.50\text{ m/s}^2$$

**Step 2:** Calculate cumulative positions:
- At $t = 4.0\text{ s}$: $x(4.0) = \frac{1}{2}(1.50)(4.0^2) = 12.0\text{ meters}$.
- At $t = 8.0\text{ s}$: $x(8.0) = \frac{1}{2}(1.50)(8.0^2) = \frac{1}{2}(1.50)(64.0) = 48.0\text{ meters}$.
- At $t = 12.0\text{ s}$: $x(12.0) = \frac{1}{2}(1.50)(12.0^2) = \frac{1}{2}(1.50)(144.0) = 108.0\text{ meters}$.

**Step 3:** Calculate interval distances:
- $\Delta x_1 = x(4) - x(0) = 12.0 - 0 = 12.0\text{ meters}$.
- $\Delta x_2 = x(8) - x(4) = 48.0 - 12.0 = 36.0\text{ meters}$.
- $\Delta x_3 = x(12) - x(8) = 108.0 - 48.0 = 60.0\text{ meters}$.

**Step 4:** Ratio analysis:
$$\Delta x_1 : \Delta x_2 : \Delta x_3 = 12.0 : 36.0 : 60.0 = 1 : 3 : 5$$

**Conclusion:** **Galileo's Odd-Number Rule** states that for any object starting from rest with constant acceleration, the distances covered in successive equal time intervals are in the ratio of consecutive odd integers:
$$1 : 3 : 5 : 7 : 9 \dots$$

---

### Example 4.8: Deceleration into an Arresting Gear Buffer
**Problem:** A runaway mine cart moving at $v_0 = 14.0\text{ m/s}$ strikes a hydraulic emergency buffer spring at $x = 0$. The buffer provides a uniform deceleration of $a = -28.0\text{ m/s}^2$.
1. What maximum compression distance $\Delta x$ does the buffer absorb before halting the cart?
2. What is the cart's speed when the buffer is compressed halfway ($\Delta x = \Delta x_{\text{max}} / 2$)?

**Step 1:** Maximum compression distance ($v = 0$):
Use Equation 4 ($v^2 = v_0^2 + 2a\Delta x$):
$$0^2 = 14.0^2 + 2(-28.0) \Delta x_{\text{max}}$$
$$0 = 196.0 - 56.0 \Delta x_{\text{max}} \implies 56.0 \Delta x_{\text{max}} = 196.0 \implies \Delta x_{\text{max}} = \frac{196.0}{56.0} = 3.50\text{ meters}$$

**Step 2:** Speed at halfway compression ($\Delta x = 1.75\text{ m}$):
$$v_{\text{half}}^2 = v_0^2 + 2 a \Delta x = 14.0^2 + 2(-28.0)(1.75) = 196.0 - 56.0(1.75) = 196.0 - 98.0 = 98.0$$
$$v_{\text{half}} = \sqrt{98.0} = \sqrt{49 \times 2} = 7\sqrt{2} \approx 9.90\text{ m/s}$$

Notice: At halfway distance, the speed is $\frac{9.90}{14.0} \approx 70.7\% = \frac{1}{\sqrt{2}}$ of initial speed! Half the kinetic energy was dissipated, not half the speed!

---

### Example 4.9: Finding Acceleration Without Direct Time Measurement
**Problem:** An automated high-speed transit capsule passes two photogates spaced $\Delta x = 150.0\text{ meters}$ apart on a test track:
- Clock at Gate 1 measures instantaneous speed: $v_1 = 25.0\text{ m/s}$.
- Clock at Gate 2 measures instantaneous speed: $v_2 = 35.0\text{ m/s}$.
Assuming constant acceleration between the gates:
1. Determine the capsule's acceleration.
2. How long did it take the capsule to travel between Gate 1 and Gate 2?
3. How far behind Gate 1 was the capsule when it started from rest?

**Step 1:** Compute acceleration using Equation 4:
$$v_2^2 = v_1^2 + 2 a \Delta x$$
$$35.0^2 = 25.0^2 + 2 a (150.0)$$
$$1225.0 = 625.0 + 300.0 a$$
$$300.0 a = 1225.0 - 625.0 = 600.0 \implies a = \frac{600.0}{300.0} = 2.00\text{ m/s}^2$$

**Step 2:** Transit time between gates:
Use Equation 2 ($\Delta x = \frac{v_1 + v_2}{2} t$):
$$150.0 = \left(\frac{25.0 + 35.0}{2}\right) t = 30.0 t \implies t = \frac{150.0}{30.0} = 5.00\text{ seconds}$$

**Step 3:** Distance from starting point (where $v_0 = 0$) to Gate 1 ($v_1 = 25.0\text{ m/s}$):
$$v_1^2 = v_0^2 + 2 a d_{\text{start}}$$
$$25.0^2 = 0 + 2(2.00) d_{\text{start}} \implies 625.0 = 4.00 d_{\text{start}} \implies d_{\text{start}} = \frac{625.0}{4.00} = 156.25\text{ meters}$$

**Conclusion:** The capsule accelerated at $2.00\text{ m/s}^2$, took $5.00\text{ s}$ between gates, and began from rest $156.25\text{ m}$ before Gate 1.

---

### Example 4.10: Two-Stage Motion (Accelerating then Coasting)
**Problem:** An experimental rocket sled accelerates from rest at $a_1 = +20.0\text{ m/s}^2$ for $t_1 = 4.0\text{ seconds}$. The engine cuts off, and the sled coasts under friction-brake deceleration $a_2 = -5.0\text{ m/s}^2$ until it comes to a stop.
1. Find the sled's maximum speed.
2. Calculate the distance covered during the acceleration phase.
3. Calculate the time and distance covered during the braking phase.
4. Calculate the total distance covered and total flight time.

**Step 1:** Maximum speed at engine cutoff:
$$v_{\text{max}} = v_0 + a_1 t_1 = 0 + (20.0\text{ m/s}^2)(4.0\text{ s}) = 80.0\text{ m/s} \quad (288\text{ km/h})$$

**Step 2:** Distance covered in acceleration phase:
$$d_1 = v_0 t_1 + \frac{1}{2} a_1 t_1^2 = 0 + \frac{1}{2}(20.0)(4.0^2) = 10.0(16.0) = 160.0\text{ meters}$$

**Step 3:** Braking phase analysis ($v_{\text{initial}} = 80.0\text{ m/s}$, $v_{\text{final}} = 0$, $a_2 = -5.0\text{ m/s}^2$):
- Time to stop:
  $$v = v_{\text{max}} + a_2 t_2 \implies 0 = 80.0 - 5.0 t_2 \implies t_2 = \frac{80.0}{5.0} = 16.0\text{ seconds}$$
- Braking distance:
  $$v^2 = v_{\text{max}}^2 + 2 a_2 d_2 \implies 0 = 80.0^2 + 2(-5.0) d_2 = 6400.0 - 10.0 d_2 \implies d_2 = 640.0\text{ meters}$$

**Step 4:** Overall totals:
$$d_{\text{total}} = d_1 + d_2 = 160.0\text{ m} + 640.0\text{ m} = 800.0\text{ meters}$$
$$t_{\text{total}} = t_1 + t_2 = 4.0\text{ s} + 16.0\text{ s} = 20.0\text{ seconds}$$
$$\text{Overall Average Speed} = \frac{800.0\text{ m}}{20.0\text{ s}} = 40.0\text{ m/s}$$

---

## 4.5 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Single-Equation Applications (Foundational)
- **Exercise 4.1:** A car accelerates from rest at a constant $a = +2.5\text{ m/s}^2$ for $8.0\text{ seconds}$. Find its final velocity and total displacement.
- **Exercise 4.2:** A subway train traveling at $24.0\text{ m/s}$ brakes with constant deceleration $a = -3.0\text{ m/s}^2$. How long does it take to halt, and what distance does it cover during braking?

### Tier 2: Timeless and Missing-Acceleration Scenarios
- **Exercise 4.3:** An electron in a cathode ray tube accelerates uniformly from $2.0 \times 10^5\text{ m/s}$ to $8.0 \times 10^5\text{ m/s}$ across a gap of $1.5\text{ cm}$ ($0.015\text{ m}$). Compute the acceleration of the electron.
- **Exercise 4.4:** A truck traveling at $18.0\text{ m/s}$ accelerates uniformly to $26.0\text{ m/s}$ over a distance of $220.0\text{ meters}$. How much time elapsed during this acceleration?

### Tier 3: Quadratic Kinematics & Unknown Initial Conditions
- **Exercise 4.5:** A sports car covers $140.0\text{ meters}$ in $5.0\text{ seconds}$ while smoothly accelerating at $+2.4\text{ m/s}^2$. What was the car's initial velocity at the start of the $5.0\text{ seconds}$?
- **Exercise 4.6:** A freight train traveling at $v_0 = 20.0\text{ m/s}$ applies brakes with $a = -0.50\text{ m/s}^2$. How much time elapses before the train has covered $300.0\text{ meters}$?

### Tier 4: Multi-Phase and Relative Kinematics
- **Exercise 4.7:** An autonomous drone accelerates from rest at $+4.0\text{ m/s}^2$ for $5.0\text{ s}$, cruises at constant speed for $10.0\text{ s}$, and decelerates to rest at $-2.5\text{ m/s}^2$. Find the total distance flown.
- **Exercise 4.8:** A commuter is running at a constant speed of $6.0\text{ m/s}$ toward a departing bus. When the commuter is $16.0\text{ meters}$ behind the bus doors, the bus begins accelerating from rest at $a = +1.0\text{ m/s}^2$. Does the commuter catch the bus? If so, at what time?

### Tier 5: Theoretical Derivations & Galileo's Laws
- **Exercise 4.9:** Prove that for an object starting from rest with constant acceleration, the velocity when it has covered half of its total stopping distance is $v = v_{\text{final}} / \sqrt{2}$.
- **Exercise 4.10:** Prove Galileo's Odd-Number Rule: show that the displacement during the $n$-th second of motion starting from rest with constant acceleration $a$ is $\Delta x_n = \frac{1}{2} a (2n - 1)$.

---

## 4.6 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 4.1
Car accelerating from rest ($v_0 = 0$) with $a = 2.5\text{ m/s}^2$ for $t = 8.0\text{ s}$:
1. Final velocity (Equation 1):
$$v = v_0 + a t = 0 + (2.5)(8.0) = 20.0\text{ m/s}$$
2. Displacement (Equation 3):
$$\Delta x = v_0 t + \frac{1}{2} a t^2 = 0 + \frac{1}{2}(2.5)(8.0^2) = 1.25(64.0) = 80.0\text{ meters}$$
**Final Answer:** $v = 20.0\text{ m/s}$; $\Delta x = 80.0\text{ meters}$.

---

### Solution to Exercise 4.2
Subway braking from $v_0 = 24.0\text{ m/s}$ with $a = -3.0\text{ m/s}^2$ to rest ($v = 0$):
1. Time to halt (Equation 1):
$$0 = 24.0 + (-3.0) t \implies 3.0 t = 24.0 \implies t = 8.0\text{ seconds}$$
2. Braking distance (Equation 4):
$$v^2 = v_0^2 + 2 a \Delta x \implies 0 = 24.0^2 + 2(-3.0) \Delta x = 576.0 - 6.0 \Delta x$$
$$6.0 \Delta x = 576.0 \implies \Delta x = 96.0\text{ meters}$$
**Final Answer:** $t = 8.0\text{ seconds}$; $\Delta x = 96.0\text{ meters}$.

---

### Solution to Exercise 4.3
Electron acceleration from $v_0 = 2.0 \times 10^5\text{ m/s}$ to $v = 8.0 \times 10^5\text{ m/s}$ over $\Delta x = 0.015\text{ m}$:
Use Equation 4 ($v^2 = v_0^2 + 2a\Delta x$):
$$(8.0 \times 10^5)^2 = (2.0 \times 10^5)^2 + 2 a (0.015)$$
$$64.0 \times 10^{10} = 4.0 \times 10^{10} + 0.030 a$$
$$0.030 a = 60.0 \times 10^{10} \implies a = \frac{60.0 \times 10^{10}}{0.030} = 2.0 \times 10^{13}\text{ m/s}^2$$
**Final Answer:** $a = 2.0 \times 10^{13}\text{ m/s}^2$.

---

### Solution to Exercise 4.4
Truck accelerating from $v_0 = 18.0\text{ m/s}$ to $v = 26.0\text{ m/s}$ over $\Delta x = 220.0\text{ m}$:
Use Equation 2 ($\Delta x = \frac{v_0 + v}{2} t$):
$$220.0 = \left(\frac{18.0 + 26.0}{2}\right) t = \left(\frac{44.0}{2}\right) t = 22.0 t$$
$$t = \frac{220.0}{22.0} = 10.0\text{ seconds}$$
**Final Answer:** $t = 10.0\text{ seconds}$.

---

### Solution to Exercise 4.5
Find initial velocity given $\Delta x = 140.0\text{ m}$, $t = 5.0\text{ s}$, $a = 2.4\text{ m/s}^2$:
Use Equation 3:
$$\Delta x = v_0 t + \frac{1}{2} a t^2$$
$$140.0 = v_0(5.0) + \frac{1}{2}(2.4)(5.0^2) = 5.0 v_0 + 1.2(25.0) = 5.0 v_0 + 30.0$$
$$5.0 v_0 = 140.0 - 30.0 = 110.0 \implies v_0 = \frac{110.0}{5.0} = 22.0\text{ m/s}$$
**Final Answer:** $v_0 = 22.0\text{ m/s}$.

---

### Solution to Exercise 4.6
Train with $v_0 = 20.0\text{ m/s}$, $a = -0.50\text{ m/s}^2$, $\Delta x = 300.0\text{ m}$:
Use Equation 3:
$$\Delta x = v_0 t + \frac{1}{2} a t^2 \implies 300.0 = 20.0 t + \frac{1}{2}(-0.50) t^2$$
$$300.0 = 20.0 t - 0.25 t^2$$
Multiply by $4$ to clear decimals:
$$1200.0 = 80.0 t - t^2 \implies t^2 - 80.0 t + 1200.0 = 0$$
Factor the quadratic:
$$(t - 20.0)(t - 60.0) = 0$$
Roots are $t = 20.0\text{ s}$ and $t = 60.0\text{ s}$.
Physical interpretation: The train reaches $300\text{ m}$ forward at $t = 20.0\text{ seconds}$. (At $t = 40\text{ s}$, it stops at $400\text{ m}$ and reverses, passing $300\text{ m}$ again at $t = 60\text{ s}$).
The first time it reaches $300\text{ m}$ is $t = 20.0\text{ seconds}$.
**Final Answer:** $t = 20.0\text{ seconds}$.

---

### Solution to Exercise 4.7
Three-phase drone flight:
1. Phase 1 (Acceleration): $v_0 = 0, a_1 = 4.0\text{ m/s}^2, t_1 = 5.0\text{ s}$.
   $$v_{\text{cruise}} = 0 + (4.0)(5.0) = 20.0\text{ m/s}$$
   $$d_1 = \frac{1}{2}(4.0)(5.0^2) = 2.0(25) = 50.0\text{ meters}$$
2. Phase 2 (Cruising): $v = 20.0\text{ m/s}, t_2 = 10.0\text{ s}$.
   $$d_2 = 20.0 \times 10.0 = 200.0\text{ meters}$$
3. Phase 3 (Deceleration): $v_0 = 20.0\text{ m/s}, v = 0, a_3 = -2.5\text{ m/s}^2$.
   $$t_3 = \frac{20.0}{2.5} = 8.0\text{ seconds}$$
   $$d_3 = \frac{20.0^2}{2(2.5)} = \frac{400.0}{5.0} = 80.0\text{ meters}$$
4. Total distance:
   $$d_{\text{total}} = 50.0 + 200.0 + 80.0 = 330.0\text{ meters}$$
**Final Answer:** Total distance $= 330.0\text{ meters}$.

---

### Solution to Exercise 4.8
Commuter chasing departing bus:
- Commuter position: $x_C(t) = v_C t = 6.0 t$.
- Bus position (starts $16.0\text{ m}$ ahead from rest):
  $$x_B(t) = 16.0 + \frac{1}{2} a_B t^2 = 16.0 + 0.5 t^2$$
Set $x_C = x_B$:
$$6.0 t = 16.0 + 0.5 t^2 \implies 0.5 t^2 - 6.0 t + 16.0 = 0$$
Multiply by $2$:
$$t^2 - 12.0 t + 32.0 = 0 \implies (t - 4.0)(t - 8.0) = 0$$
Roots: $t = 4.0\text{ s}$ and $t = 8.0\text{ s}$.
The commuter catches the bus at the first root: $t = 4.0\text{ seconds}$!
(At $t = 4.0\text{ s}$, $x = 6.0(4) = 24.0\text{ meters}$).
**Final Answer:** Yes, the commuter catches the bus at $t = 4.0\text{ seconds}$ ($24.0\text{ m}$ from start).

---

### Solution to Exercise 4.9
Prove velocity at half-distance is $v = v_{\text{final}} / \sqrt{2}$ (or $v_{\text{half}}^2 = \frac{1}{2} v_{\text{final}}^2$):
1. From rest ($v_0 = 0$) across total distance $D$:
$$v_{\text{final}}^2 = 0 + 2 a D = 2 a D \implies D = \frac{v_{\text{final}}^2}{2a}$$
2. At half-distance $d = D / 2$:
$$v_{\text{half}}^2 = 0 + 2 a \left(\frac{D}{2}\right) = a D$$
3. Substitute $a D = \frac{1}{2} v_{\text{final}}^2$:
$$v_{\text{half}}^2 = \frac{1}{2} v_{\text{final}}^2 \implies v_{\text{half}} = \frac{v_{\text{final}}}{\sqrt{2}} \quad \blacksquare$$
**Final Answer:** Proved: $v_{\text{half}} = v_{\text{final}} / \sqrt{2}$.

---

### Solution to Exercise 4.10
Prove Galileo's Odd-Number Rule: $\Delta x_n = \frac{1}{2} a (2n - 1)$:
1. Position at time $t = n$:
$$x(n) = \frac{1}{2} a n^2$$
2. Position at time $t = n - 1$:
$$x(n - 1) = \frac{1}{2} a (n - 1)^2 = \frac{1}{2} a (n^2 - 2n + 1)$$
3. Displacement during the $n$-th second:
$$\Delta x_n = x(n) - x(n - 1) = \frac{1}{2} a n^2 - \frac{1}{2} a (n^2 - 2n + 1)$$
$$= \frac{1}{2} a [n^2 - (n^2 - 2n + 1)] = \frac{1}{2} a (2n - 1) \quad \blacksquare$$
Notice that for $n = 1, 2, 3, 4$, $(2n - 1) = 1, 3, 5, 7 \dots$ generating consecutive odd numbers!
**Final Answer:** Proved algebraically: $\Delta x_n = \frac{1}{2} a (2n - 1)$.


---

# Chapter 5: Free Fall and Gravitational Acceleration â€” Galileo's Revolution

> *"For two thousand years, Western civilization bowed to Aristotle's dogma: that a ten-pound boulder must plunge to Earth ten times faster than a one-pound rock. It took a lone Italian mathematician dropping spheres from the bell tower of Pisa and rolling bronze balls down wooden ramps to shatter this illusion, revealing that in the vacuum of pure space, gravity pulls every ounce of creation with the exact same relentless acceleration."*

---

## 5.1 The Aristotle Dogma and Galileo's Paradox

In ancient Greece, Aristotle asserted that the speed at which a body falls is proportional to its weight:

$$v_{\text{fall}} \propto m \quad \mathbf{(ARISTOTLE'S\ FALSE\ DOGMA)}$$

To common sense, this seemed obvious. If you drop a bird's feather and a heavy iron cannonball from your outstretched hands, the cannonball thuds into the dirt in a split second, while the feather drifts and flutters lazily through the breeze.

In the late 16th century, Galileo Galilei constructed a devastating thought experiment that demolished Aristotle's logic without needing a single physical measurement:

### The Tied Cannonballs Paradox
Imagine two cannonballs: a heavy ball of mass $M = 10\text{ kg}$ and a light ball of mass $m = 1\text{ kg}$.
According to Aristotle:
- The $10\text{-kg}$ ball falls rapidly.
- The $1\text{-kg}$ ball falls slowly.

Now tie them together with a light, taut cord to create a combined system of mass $M + m = 11\text{ kg}$, and drop them simultaneously from a high cliff.
Now ask: *What must happen according to Aristotle?*

1. **Prediction A (The Retardation Argument):** Because the $1\text{-kg}$ ball naturally falls slower, it should act like a parachute or drogue anchor, pulling upward on the cord and slowing down the $10\text{-kg}$ ball. Therefore, the tied pair should fall **slower** than the $10\text{-kg}$ ball alone!
2. **Prediction B (The Combined Mass Argument):** The combined object has a total mass of $10 + 1 = 11\text{ kg}$. Because it is heavier than the $10\text{-kg}$ ball, it should fall **faster** than the $10\text{-kg}$ ball alone!

Look at the catastrophe: **Aristotle's premise produces two completely contradictory predictions from the same starting conditions!** The tied pair cannot fall both slower and faster than the heavy ball.

The only logical resolution that resolves the paradox is that **both masses fall at the exact same rate**. Mass has zero influence on the acceleration of free fall!

The apparent difference between the feather and the cannonball is not gravity; it is **air resistance** (fluid drag). Remove the air, and a feather and a block of lead fall in perfect lockstep.

```
       With Atmospheric Air                   Inside a Complete Vacuum
       +-----------------------+              +-----------------------+
       |   O (Lead Sphere)     |              |   O (Lead Sphere)     |
       |   |                   |              |   |                   |
       |   v                   |              |   |                   |
       |                       |              |   v                   |
       |   ~ (Feather flutters)|              |   ~ (Feather)         |
       |                       |              |   v                   |
       +-----------------------+              +-----------------------+
       Lead hits ground first.                Both strike ground at the
       (Air resistance dominates)             EXACT SAME MILLISECOND!
```

> [!NOTE]
> On August 2, 1971, Apollo 15 Commander David Scott stood on the airless lunar surface in Hadley Rille. Before a worldwide television audience, he dropped a $1.32\text{-kg}$ aluminum geological hammer and a $0.03\text{-kg}$ falcon feather simultaneously from shoulder height. In the pure vacuum of the Moon, both struck the lunar dust at the exact same instant, confirming Galileo's discovery four centuries later.

---

## 5.2 The Constant of Gravitational Acceleration: $g$

In the vicinity of Earth's surface (within a few kilometers of sea level), any freely falling body in a vacuum experiences a constant downward acceleration denoted by the symbol $g$:

$$g \approx 9.80665\text{ m/s}^2 \approx 9.80\text{ m/s}^2 \quad (\text{often rounded to } 9.81\text{ m/s}^2 \text{ or } 10\text{ m/s}^2)$$

### Coordinate Convention Warning
Because acceleration is a vector, its sign depends entirely on your choice of positive direction:

- **Upward Chosen as Positive ($+y$ upward):**
  Gravity acts downward toward the center of the Earth, so:
  $$a = -g = -9.80\text{ m/s}^2$$
  Equations of motion become:
  $$v = v_0 - g t$$
  $$y = y_0 + v_0 t - \frac{1}{2} g t^2$$
  $$v^2 = v_0^2 - 2 g \Delta y$$

- **Downward Chosen as Positive ($+y$ downward):**
  Useful when an object is dropped from a cliff and only moves downward:
  $$a = +g = +9.80\text{ m/s}^2$$
  $$v = v_0 + g t$$
  $$y = y_0 + v_0 t + \frac{1}{2} g t^2$$

In this treatise, we adopt the universal scientific convention: **Upward is Positive ($+y$)**, so acceleration due to gravity is always **$a = -g$**.

---

## 5.3 The Kinematic Symmetries of Free Fall

Consider a projectile launched straight upward from ground level ($y_0 = 0$) with initial velocity $v_0 > 0$:

```
               Peak: v = 0, y = H = v_0^2 / (2g)
                       *
                     .' '.
       Ascending:   /     \   Descending:
       v > 0       /       \  v < 0
       a = -g     /         \ a = -g
                 *           *
               Launch       Landing: v = -v_0, t = 2v_0 / g
```

### 1. The Instant of Peak Height
As the object rises, gravity slows it down at rate $g$. At the very apex of its trajectory, its vertical velocity momentarily vanishes:

$$v(t_{\text{peak}}) = 0$$

Using Equation 1 ($v = v_0 - g t$):

$$0 = v_0 - g t_{\text{peak}} \implies \mathbf{t_{\text{peak}} = \frac{v_0}{g}}$$

### 2. The Maximum Height ($H$)
Using Equation 4 ($v^2 = v_0^2 - 2 g H$):

$$0^2 = v_0^2 - 2 g H \implies 2 g H = v_0^2 \implies \mathbf{H = \frac{v_0^2}{2g}}$$

### 3. Total Time of Flight ($T$)
The object returns to its starting elevation when $y(t) = 0$:

$$y(t) = v_0 t - \frac{1}{2} g t^2 = t\left(v_0 - \frac{1}{2} g t\right) = 0$$

Discarding $t = 0$ (the launch moment), the landing time is:

$$v_0 - \frac{1}{2} g T = 0 \implies \frac{1}{2} g T = v_0 \implies \mathbf{T = \frac{2v_0}{g} = 2 t_{\text{peak}}}$$

The time to rise equals the time to fall! The trajectory is completely symmetric across time.

### 4. Impact Velocity
Evaluating velocity at landing time $T = \frac{2v_0}{g}$:

$$v(T) = v_0 - g\left(\frac{2v_0}{g}\right) = v_0 - 2v_0 = \mathbf{-v_0}$$

The object returns to the launch elevation with the **exact same speed** as it was launched, but directed purely downward!

---

## 5.4 Dropping from Rest: The Drop Formulas

When an object is released from rest ($v_0 = 0$) from height $h$:

$$v_0 = 0$$
$$\Delta y = -h$$
$$a = -g$$

1. **Velocity upon impact:**
   $$v^2 = 0^2 - 2g(-h) = 2gh \implies \mathbf{v = -\sqrt{2gh}} \quad (\text{Speed } = \sqrt{2gh})$$

2. **Time to fall:**
   $$-h = 0 - \frac{1}{2} g t^2 \implies h = \frac{1}{2} g t^2 \implies t^2 = \frac{2h}{g} \implies \mathbf{t = \sqrt{\frac{2h}{g}}}$$

---

## 5.5 Planetary Gravity Comparison

The acceleration of gravity on any spherical celestial body of mass $M$ and radius $R$ is governed by Newton's Law of Universal Gravitation:

$$g_{\text{world}} = \frac{G M}{R^2}$$

| Celestial Body | Surface Gravity ($g$) | Ratio to Earth ($g / g_\oplus$) | Fall Time from $10\text{ m}$ | Impact Speed from $10\text{ m}$ |
| :--- | :---: | :---: | :---: | :---: |
| **Earth** | $9.81\text{ m/s}^2$ | $1.000$ | $1.43\text{ s}$ | $14.0\text{ m/s}$ ($50.4\text{ km/h}$) |
| **Moon** | $1.62\text{ m/s}^2$ | $0.165$ | $3.51\text{ s}$ | $5.69\text{ m/s}$ ($20.5\text{ km/h}$) |
| **Mars** | $3.72\text{ m/s}^2$ | $0.379$ | $2.32\text{ s}$ | $8.63\text{ m/s}$ ($31.1\text{ km/h}$) |
| **Jupiter** (Cloud tops) | $24.79\text{ m/s}^2$ | $2.527$ | $0.90\text{ s}$ | $22.3\text{ m/s}$ ($80.2\text{ km/h}$) |
| **Europa** | $1.315\text{ m/s}^2$ | $0.134$ | $3.90\text{ s}$ | $5.13\text{ m/s}$ ($18.5\text{ km/h}$) |

On the Moon, a drop from $10\text{ meters}$ takes more than twice as long as on Earth, allowing astronauts to react in slow motion!

---

## 5.6 Ten Progressive Worked Numerical Examples

### Example 5.1: Classical Cliff Drop
**Problem:** A geological survey team drops a dense lead marker into a deep canyon from the edge of a cliff. The marker strikes the canyon floor $t = 4.20\text{ seconds}$ later. Neglecting air resistance and using $g = 9.80\text{ m/s}^2$:
1. Calculate the depth of the canyon.
2. Determine the impact velocity of the marker when it strikes the floor.

**Step 1:** Define coordinate system:
Let the cliff edge be origin $y_0 = 0$, with upward positive.
- $v_0 = 0\text{ m/s}$ (dropped from rest)
- $a = -g = -9.80\text{ m/s}^2$
- $t = 4.20\text{ seconds}$

**Step 2:** Calculate depth using Equation 3:
$$\Delta y = v_0 t - \frac{1}{2} g t^2 = 0 - \frac{1}{2}(9.80)(4.20^2) = -4.90(17.64) = -86.436\text{ meters}$$
The depth of the canyon is $86.44\text{ meters}$.

**Step 3:** Calculate impact velocity using Equation 1:
$$v = v_0 - g t = 0 - (9.80)(4.20) = -41.16\text{ m/s}$$
Convert to $\text{km/h}$:
$$|v| = 41.16 \times 3.6 \approx 148.18\text{ km/h}$$

**Conclusion:** The canyon is $86.44\text{ m}$ deep, and the marker hits at $41.16\text{ m/s}$ downward ($148.2\text{ km/h}$).

---

### Example 5.2: Vertical Flare Launch
**Problem:** A distress flare is fired straight upward from the deck of a ship ($y_0 = 0$) with an initial muzzle velocity of $v_0 = +49.0\text{ m/s}$.
1. How long does the flare take to reach its peak altitude?
2. What is the maximum altitude reached above the deck?
3. What is the flare's velocity at $t = 3.0\text{ seconds}$ and at $t = 7.0\text{ seconds}$?
4. When does the flare splash into the ocean at deck level?

**Step 1:** Time to peak altitude ($v = 0$):
$$v = v_0 - g t \implies 0 = 49.0 - 9.80 t \implies t_{\text{peak}} = \frac{49.0}{9.80} = 5.00\text{ seconds}$$

**Step 2:** Maximum altitude $H$:
$$H = \frac{v_0^2}{2g} = \frac{49.0^2}{2(9.80)} = \frac{2401.0}{19.60} = 122.50\text{ meters}$$

**Step 3:** Velocity at specific times:
- At $t = 3.0\text{ s}$ (Ascending phase):
  $$v(3.0) = 49.0 - (9.80)(3.0) = 49.0 - 29.4 = +19.60\text{ m/s} \quad (\text{moving upward})$$
- At $t = 7.0\text{ s}$ (Descending phase):
  $$v(7.0) = 49.0 - (9.80)(7.0) = 49.0 - 68.6 = -19.60\text{ m/s} \quad (\text{moving downward})$$
Notice the perfect symmetry: $2.0\text{ seconds}$ before peak, $v = +19.6\text{ m/s}$; $2.0\text{ seconds}$ after peak, $v = -19.6\text{ m/s}$!

**Step 4:** Splashdown time:
$$T = 2 t_{\text{peak}} = 2(5.00) = 10.00\text{ seconds}$$

---

### Example 5.3: Object Thrown Downward from a Height
**Problem:** A technician standing on an elevated catwalk $h = 45.0\text{ meters}$ above the ground accidentally throws a bolt straight **downward** with an initial speed of $v_0 = -12.0\text{ m/s}$.
1. Compute the impact speed of the bolt when it hits the ground.
2. How long does the bolt take to reach the ground?

**Step 1:** Identify parameters:
$y_0 = 45.0\text{ m}$, $y_{\text{ground}} = 0\text{ m} \implies \Delta y = -45.0\text{ m}$.
$v_0 = -12.0\text{ m/s}$ (thrown downward).
$a = -g = -9.80\text{ m/s}^2$.

**Step 2:** Compute impact velocity using Equation 4:
$$v^2 = v_0^2 - 2 g \Delta y = (-12.0)^2 - 2(9.80)(-45.0) = 144.0 + 882.0 = 1026.0$$
$$v = -\sqrt{1026.0} \approx -32.03\text{ m/s}$$

**Step 3:** Compute fall time:
Use Equation 1 ($v = v_0 - gt$):
$$-32.031 = -12.0 - 9.80 t \implies 9.80 t = 32.031 - 12.0 = 20.031$$
$$t = \frac{20.031}{9.80} \approx 2.04\text{ seconds}$$

---

### Example 5.4: Object Thrown Upward from a Cliff Edge
**Problem:** A climber at the top of a $h = 60.0\text{-meter}$ vertical cliff throws a stone straight upward with $v_0 = +20.0\text{ m/s}$. The stone rises, misses the edge of the cliff on its descent, and plunges all the way to the canyon floor below.
1. Find the stone's maximum height above the canyon floor.
2. What is the total time elapsed from launch until the stone hits the canyon floor?
3. What is the impact speed of the stone?

**Step 1:** Maximum height above cliff:
$$H_{\text{cliff}} = \frac{v_0^2}{2g} = \frac{20.0^2}{2(9.80)} = \frac{400.0}{19.60} \approx 20.41\text{ meters}$$
Total height above canyon floor:
$$Y_{\text{max}} = 60.0 + 20.41 = 80.41\text{ meters}$$

**Step 2:** Total time of flight:
Let the cliff edge be $y = 0$. The canyon floor is at coordinate $\Delta y = -60.0\text{ m}$.
Use Equation 3:
$$\Delta y = v_0 t - \frac{1}{2} g t^2 \implies -60.0 = 20.0 t - 4.90 t^2$$
Rearrange into standard quadratic form:
$$4.90 t^2 - 20.0 t - 60.0 = 0$$
Apply quadratic formula:
$$t = \frac{-(-20.0) \pm \sqrt{(-20.0)^2 - 4(4.90)(-60.0)}}{2(4.90)} = \frac{20.0 \pm \sqrt{400.0 + 1176.0}}{9.80} = \frac{20.0 \pm \sqrt{1576.0}}{9.80}$$
$$\sqrt{1576.0} \approx 39.699$$
$$t = \frac{20.0 + 39.699}{9.80} = \frac{59.699}{9.80} \approx 6.09\text{ seconds}$$

**Step 3:** Impact velocity:
$$v = v_0 - g t = 20.0 - (9.80)(6.0917) = 20.0 - 59.70 = -39.70\text{ m/s}$$
*(Verification using Eq 4: $v^2 = 20^2 - 2(9.8)(-60) = 400 + 1176 = 1576 \implies v = -\sqrt{1576} \approx -39.70\text{ m/s}$)*.

---

### Example 5.5: Human Reaction Time Ruler-Drop Experiment
**Problem:** In a biology laboratory, a student tests their physical reaction time. A partner holds a vertical $30\text{-cm}$ metric ruler directly between the student's thumb and index finger. The partner drops the ruler without warning from rest ($v_0 = 0$). The student clamps their fingers as fast as possible, catching the ruler at the $d = 18.5\text{-cm}$ mark ($0.185\text{ m}$). Calculate the student's neurological reaction time.

**Step 1:** Set up parameters:
$v_0 = 0\text{ m/s}$, $h = 0.185\text{ m}$, $g = 9.80\text{ m/s}^2$.

**Step 2:** Apply the free-fall drop equation:
$$h = \frac{1}{2} g t^2 \implies t^2 = \frac{2h}{g} \implies t = \sqrt{\frac{2h}{g}}$$

**Step 3:** Substitute values:
$$t = \sqrt{\frac{2(0.185\text{ m})}{9.80\text{ m/s}^2}} = \sqrt{\frac{0.370}{9.80}} = \sqrt{0.037755} \approx 0.1943\text{ seconds}$$

**Conclusion:** The student's reaction time is approximately $0.194\text{ seconds}$ ($194\text{ milliseconds}$).

---

### Example 5.6: The Acoustic Well-Drop Problem
**Problem:** A researcher drops a heavy stone into an abandoned vertical mine shaft. Exactly $T = 3.50\text{ seconds}$ after releasing the stone, the researcher hears the sound of the stone striking the water at the bottom.
The speed of sound in the air inside the shaft is $v_s = 340.0\text{ m/s}$.
Calculate the true depth $h$ of the shaft.

**Step 1:** Decompose total time into two distinct physical phases:
1. Phase 1 (Stone falls distance $h$ under gravity):
   $$h = \frac{1}{2} g t_1^2 \implies t_1 = \sqrt{\frac{2h}{g}}$$
2. Phase 2 (Sound wave travels back up distance $h$ at constant speed $v_s$):
   $$t_2 = \frac{h}{v_s}$$

**Step 2:** Formulate total time equation:
$$t_1 + t_2 = T \implies \sqrt{\frac{2h}{g}} + \frac{h}{v_s} = 3.50$$

**Step 3:** Solve the non-linear equation by making a substitution:
Let $u = \sqrt{h}$, which implies $h = u^2$:
$$\sqrt{\frac{2}{9.80}} u + \frac{u^2}{340.0} = 3.50$$
$$\sqrt{0.20408} u + \frac{1}{340.0} u^2 = 3.50$$
$$0.45175 u + 0.0029412 u^2 = 3.50$$
Rearrange into standard quadratic form:
$$0.0029412 u^2 + 0.45175 u - 3.50 = 0$$

**Step 4:** Solve for $u$:
$$u = \frac{-0.45175 + \sqrt{0.45175^2 - 4(0.0029412)(-3.50)}}{2(0.0029412)}$$
$$\text{Discriminant} = 0.20408 + 0.04118 = 0.24526 \implies \sqrt{0.24526} \approx 0.49524$$
$$u = \frac{-0.45175 + 0.49524}{0.0058824} = \frac{0.04349}{0.0058824} \approx 7.3932$$

**Step 5:** Compute depth $h = u^2$:
$$h = (7.3932)^2 \approx 54.66\text{ meters}$$

**Step 6:** Verification check:
- Fall time of stone: $t_1 = \sqrt{\frac{2(54.66)}{9.80}} = \sqrt{11.155} \approx 3.340\text{ s}$.
- Return time of sound: $t_2 = \frac{54.66}{340.0} \approx 0.161\text{ s}$.
- Total time: $t_1 + t_2 = 3.340 + 0.161 = 3.501\text{ s}$ (Matches!).

---

### Example 5.7: Simultaneous Dropped vs Thrown Projectiles
**Problem:** At $t = 0$:
- Ball $A$ is dropped from rest ($v_{0A} = 0$) from the roof of an $80.0\text{-meter}$ building.
- Ball $B$ is simultaneously projected straight upward from ground level ($y_0 = 0$) directly beneath Ball $A$ with $v_{0B} = +40.0\text{ m/s}$.
1. At what time $t$ do the two balls pass each other?
2. At what height above the ground does the crossing occur?
3. What are their velocities at the instant of passing?

**Step 1:** Write position equations for both balls taking ground as $y = 0$:
$$y_A(t) = 80.0 + 0 - \frac{1}{2} g t^2 = 80.0 - 4.90 t^2$$
$$y_B(t) = 0 + 40.0 t - \frac{1}{2} g t^2 = 40.0 t - 4.90 t^2$$

**Step 2:** Set positions equal for intersection ($y_A = y_B$):
$$80.0 - 4.90 t^2 = 40.0 t - 4.90 t^2$$
Notice the beauty of physics: **the $-4.90 t^2$ gravity terms cancel out completely!**
Because both objects experience identical gravitational acceleration, their relative acceleration is zero!
$$80.0 = 40.0 t \implies t = \frac{80.0}{40.0} = 2.00\text{ seconds}$$

**Step 3:** Calculate crossing height:
$$y_{\text{cross}} = y_A(2.00) = 80.0 - 4.90(2.00^2) = 80.0 - 19.60 = 60.40\text{ meters}$$
*(Verification using Ball B: $40.0(2.00) - 4.90(4.00) = 80.0 - 19.60 = 60.40\text{ m}$)*.

**Step 4:** Velocities at crossing:
$$v_A(2.00) = 0 - (9.80)(2.00) = -19.60\text{ m/s} \quad (\text{falling})$$
$$v_B(2.00) = 40.0 - (9.80)(2.00) = +20.40\text{ m/s} \quad (\text{rising})$$

---

### Example 5.8: Lunar Jump Kinematics
**Problem:** An astronaut in full EVA space suit can jump vertically on Earth ($g_\oplus = 9.80\text{ m/s}^2$) to a peak height of $h_\oplus = 0.50\text{ meters}$.
Assuming the astronaut's legs generate the exact same takeoff velocity $v_0$ on the Moon ($g_{\text{moon}} = 1.62\text{ m/s}^2$):
1. What was the astronaut's takeoff velocity $v_0$?
2. What maximum height $h_{\text{moon}}$ will the astronaut reach on the Moon?
3. How long does the lunar jump last (hang time) compared to Earth?

**Step 1:** Calculate takeoff velocity on Earth:
$$v^2 = v_0^2 - 2 g_\oplus h_\oplus \implies 0 = v_0^2 - 2(9.80)(0.50) = v_0^2 - 9.80 \implies v_0 = \sqrt{9.80} \approx 3.130\text{ m/s}$$

**Step 2:** Maximum height on the Moon:
$$h_{\text{moon}} = \frac{v_0^2}{2 g_{\text{moon}}} = \frac{9.80}{2(1.62)} = \frac{9.80}{3.24} \approx 3.025\text{ meters}$$
The astronaut leaps over $3\text{ meters}$ high ($6\times$ higher than on Earth!).

**Step 3:** Hang time comparison:
- Earth hang time: $T_\oplus = \frac{2v_0}{g_\oplus} = \frac{2(3.130)}{9.80} \approx 0.639\text{ seconds}$.
- Lunar hang time: $T_{\text{moon}} = \frac{2v_0}{g_{\text{moon}}} = \frac{2(3.130)}{1.62} \approx 3.864\text{ seconds}$.
The lunar leap floats for nearly four full seconds!

---

### Example 5.9: Passing a Window of Known Height
**Problem:** An observer looking out a vertical window of height $w = 2.00\text{ meters}$ observes a falling flowerpot flash past the window. The pot takes $\Delta t = 0.150\text{ seconds}$ to travel from the top of the window frame to the bottom of the window frame. From what height above the top of the window was the pot dropped from rest?

**Step 1:** Analyze the motion across the window:
Let $v_{\text{top}}$ be the velocity of the pot as it enters the top of the window.
Distance covered across window: $\Delta y = 2.00\text{ m}$.
Time elapsed: $\Delta t = 0.150\text{ s}$.
Use Equation 3 (taking downward as positive for local convenience):
$$\Delta y = v_{\text{top}} \Delta t + \frac{1}{2} g (\Delta t)^2$$
$$2.00 = v_{\text{top}}(0.150) + \frac{1}{2}(9.80)(0.150^2) = 0.150 v_{\text{top}} + 4.90(0.0225) = 0.150 v_{\text{top}} + 0.11025$$
$$0.150 v_{\text{top}} = 2.00 - 0.11025 = 1.88975$$
$$v_{\text{top}} = \frac{1.88975}{0.150} \approx 12.598\text{ m/s}$$

**Step 2:** Relate $v_{\text{top}}$ to the drop height $H$ above the window:
The pot started from rest ($v_0 = 0$) and fell height $H$ to reach $v_{\text{top}}$:
$$v_{\text{top}}^2 = 0^2 + 2 g H \implies H = \frac{v_{\text{top}}^2}{2g}$$
$$H = \frac{12.598^2}{2(9.80)} = \frac{158.717}{19.60} \approx 8.10\text{ meters}$$

**Conclusion:** The flowerpot was dropped from a height of $8.10\text{ meters}$ above the top of the window.

---

### Example 5.10: Rocket Ascending with Thrust then Free Falling
**Problem:** A multi-stage sounding rocket is launched vertically from ground level ($y_0 = 0$) at $t = 0$. Its solid rocket motor fires for $t_1 = 10.0\text{ seconds}$, providing a net upward acceleration of $a_{\text{engine}} = +15.0\text{ m/s}^2$. At $t = 10.0\text{ s}$, the motor burns out, and the rocket coasts freely upward under gravity ($g = 9.80\text{ m/s}^2$).
1. What is the altitude and velocity of the rocket at motor burnout?
2. What maximum peak altitude does the rocket achieve?
3. What is the total time elapsed from launch until the rocket crashes back to Earth?

**Step 1:** Powered burn phase ($t \in [0, 10.0\text{ s}]$):
- Burnout velocity:
  $$v_1 = v_0 + a_{\text{engine}} t_1 = 0 + (15.0)(10.0) = 150.0\text{ m/s}$$
- Burnout altitude:
  $$y_1 = \frac{1}{2} a_{\text{engine}} t_1^2 = \frac{1}{2}(15.0)(10.0^2) = 7.5(100.0) = 750.0\text{ meters}$$

**Step 2:** Coasting upward phase (from burnout to peak):
- Coasting height gained:
  $$\Delta y_{\text{coast}} = \frac{v_1^2}{2g} = \frac{150.0^2}{2(9.80)} = \frac{22500.0}{19.60} \approx 1147.96\text{ meters}$$
- Peak altitude above ground:
  $$Y_{\text{max}} = y_1 + \Delta y_{\text{coast}} = 750.0 + 1147.96 = 1897.96\text{ meters} \approx 1.90\text{ km}$$
- Coasting time to peak:
  $$t_{\text{coast}} = \frac{v_1}{g} = \frac{150.0}{9.80} \approx 15.31\text{ seconds}$$

**Step 3:** Free fall from peak to ground:
The rocket falls from rest ($v = 0$) at $Y_{\text{max}} = 1897.96\text{ m}$:
$$t_{\text{fall}} = \sqrt{\frac{2 Y_{\text{max}}}{g}} = \sqrt{\frac{2(1897.96)}{9.80}} = \sqrt{\frac{3795.92}{9.80}} = \sqrt{387.339} \approx 19.68\text{ seconds}$$

**Step 4:** Total mission duration:
$$T_{\text{total}} = t_{\text{burn}} + t_{\text{coast}} + t_{\text{fall}} = 10.00 + 15.31 + 19.68 = 44.99\text{ seconds} \approx 45.0\text{ seconds}$$

---

## 5.7 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Basic Free Fall Drops (Foundational)
- **Exercise 5.1:** A stone is dropped from a bridge and strikes the water below $2.50\text{ seconds}$ later. Calculate the height of the bridge above the water and the impact velocity ($g = 9.80\text{ m/s}^2$).
- **Exercise 5.2:** A coin is dropped into an elevator shaft and hits the bottom at a speed of $28.0\text{ m/s}$. How far did the coin fall?

### Tier 2: Vertical Tosses and Time Symmetry
- **Exercise 5.3:** A baseball is hit vertically upward and is caught by the catcher at the same height $6.00\text{ seconds}$ later. What was the ball's initial velocity, and what maximum height did it reach?
- **Exercise 5.4:** A projectile is launched straight upward at $35.0\text{ m/s}$. Find its height and velocity at $t = 2.00\text{ seconds}$ and at $t = 5.00\text{ seconds}$.

### Tier 3: Off-Elevation Drops and Throws
- **Exercise 5.5:** A ball is thrown straight down from the roof of a $70.0\text{-meter}$ building at $8.00\text{ m/s}$. How long does it take to strike the ground?
- **Exercise 5.6:** A ball is thrown straight up from the edge of the same $70.0\text{-meter}$ building at $8.00\text{ m/s}$. How long does it take to strike the ground below?

### Tier 4: Planetary Gravitation & Acoustic Sound Delay
- **Exercise 5.7:** On Mars ($g_{\text{mars}} = 3.72\text{ m/s}^2$), an astronaut drops a probe from a cliff of height $40.0\text{ meters}$. How much longer does it take to fall on Mars compared to Earth?
- **Exercise 5.8:** A pebble dropped into a well produces a splash heard $2.40\text{ seconds}$ after release. Assuming sound speed is $343\text{ m/s}$ and $g = 9.80\text{ m/s}^2$, find the depth of the well.

### Tier 5: Complex Multi-Body Interceptions (Advanced)
- **Exercise 5.9:** Ball 1 is dropped from rest from height $H = 100\text{ meters}$. Exactly $1.00\text{ second}$ later, Ball 2 is thrown downward from the same height. What must be the initial downward velocity of Ball 2 so that both balls strike the ground at the exact same instant?
- **Exercise 5.10:** Prove that if an object is dropped from height $h$, it covers half of the total fall distance in the final $\approx 29.3\%$ of its total fall time ($t_{\text{half-dist}} = \frac{1}{\sqrt{2}} t_{\text{total}}$).

---

## 5.8 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 5.1
Stone dropped from bridge with $t = 2.50\text{ s}$:
1. Height of bridge:
$$h = \frac{1}{2} g t^2 = \frac{1}{2}(9.80)(2.50^2) = 4.90(6.25) = 30.625\text{ meters}$$
2. Impact velocity:
$$v = -g t = -(9.80)(2.50) = -24.50\text{ m/s}$$
**Final Answer:** Height $= 30.63\text{ meters}$; Impact velocity $= -24.50\text{ m/s}$ downward.

---

### Solution to Exercise 5.2
Coin impact speed $v = 28.0\text{ m/s}$:
Use $v^2 = 2gh$:
$$28.0^2 = 2(9.80) h \implies 784.0 = 19.60 h \implies h = \frac{784.0}{19.60} = 40.0\text{ meters}$$
**Final Answer:** Fall distance $= 40.0\text{ meters}$.

---

### Solution to Exercise 5.3
Baseball caught after total time $T = 6.00\text{ s}$:
1. Time to peak: $t_{\text{peak}} = \frac{T}{2} = 3.00\text{ seconds}$.
2. Initial velocity:
$$v_0 = g t_{\text{peak}} = (9.80)(3.00) = 29.40\text{ m/s}$$
3. Maximum height:
$$H = \frac{v_0^2}{2g} = \frac{29.40^2}{2(9.80)} = \frac{864.36}{19.60} = 44.10\text{ meters}$$
**Final Answer:** Initial velocity $= 29.40\text{ m/s}$; Maximum height $= 44.10\text{ meters}$.

---

### Solution to Exercise 5.4
Vertical toss with $v_0 = 35.0\text{ m/s}$:
1. At $t = 2.00\text{ s}$:
$$y(2.00) = (35.0)(2.00) - \frac{1}{2}(9.80)(2.00^2) = 70.0 - 4.90(4.0) = 70.0 - 19.6 = 50.40\text{ meters}$$
$$v(2.00) = 35.0 - (9.80)(2.00) = 35.0 - 19.6 = +15.40\text{ m/s}$$
2. At $t = 5.00\text{ s}$:
$$y(5.00) = (35.0)(5.00) - \frac{1}{2}(9.80)(5.00^2) = 175.0 - 4.90(25.0) = 175.0 - 122.5 = 52.50\text{ meters}$$
$$v(5.00) = 35.0 - (9.80)(5.00) = 35.0 - 49.0 = -14.00\text{ m/s}$$
**Final Answer:** At $t = 2.00\text{ s}$: $y = 50.40\text{ m}, v = +15.40\text{ m/s}$; At $t = 5.00\text{ s}$: $y = 52.50\text{ m}, v = -14.00\text{ m/s}$.

---

### Solution to Exercise 5.5
Thrown downward from $70.0\text{ m}$ with $v_0 = -8.00\text{ m/s}$:
$$\Delta y = v_0 t - \frac{1}{2} g t^2 \implies -70.0 = -8.00 t - 4.90 t^2$$
$$4.90 t^2 + 8.00 t - 70.0 = 0$$
Apply quadratic formula:
$$t = \frac{-8.00 + \sqrt{8.00^2 - 4(4.90)(-70.0)}}{2(4.90)} = \frac{-8.00 + \sqrt{64.0 + 1372.0}}{9.80} = \frac{-8.00 + \sqrt{1436.0}}{9.80}$$
$$\sqrt{1436.0} \approx 37.8946 \implies t = \frac{-8.00 + 37.8946}{9.80} = \frac{29.8946}{9.80} \approx 3.05\text{ seconds}$$
**Final Answer:** $t \approx 3.05\text{ seconds}$.

---

### Solution to Exercise 5.6
Thrown upward from $70.0\text{ m}$ with $v_0 = +8.00\text{ m/s}$:
$$-70.0 = +8.00 t - 4.90 t^2 \implies 4.90 t^2 - 8.00 t - 70.0 = 0$$
$$t = \frac{+8.00 + \sqrt{64.0 + 1372.0}}{9.80} = \frac{8.00 + 37.8946}{9.80} = \frac{45.8946}{9.80} \approx 4.68\text{ seconds}$$
**Final Answer:** $t \approx 4.68\text{ seconds}$.

---

### Solution to Exercise 5.7
Fall time from $40.0\text{ m}$ on Earth vs Mars:
- Earth: $t_\oplus = \sqrt{\frac{2(40.0)}{9.80}} = \sqrt{8.1633} \approx 2.857\text{ seconds}$.
- Mars: $t_{\text{mars}} = \sqrt{\frac{2(40.0)}{3.72}} = \sqrt{21.5054} \approx 4.637\text{ seconds}$.
- Difference:
$$\Delta t = 4.637 - 2.857 = 1.78\text{ seconds}$$
**Final Answer:** The fall on Mars takes $1.78\text{ seconds}$ longer.

---

### Solution to Exercise 5.8
Pebble in well heard after $T = 2.40\text{ s}$ ($v_s = 343\text{ m/s}$):
$$\sqrt{\frac{2h}{9.80}} + \frac{h}{343} = 2.40$$
Let $u = \sqrt{h}$:
$$0.45175 u + 0.0029155 u^2 - 2.40 = 0$$
$$u = \frac{-0.45175 + \sqrt{0.45175^2 - 4(0.0029155)(-2.40)}}{2(0.0029155)} = \frac{-0.45175 + \sqrt{0.20408 + 0.027989}}{0.005831}$$
$$\sqrt{0.232069} \approx 0.481735$$
$$u = \frac{0.029985}{0.005831} \approx 5.1423 \implies h = u^2 = (5.1423)^2 \approx 26.44\text{ meters}$$
**Final Answer:** Well depth is approximately $26.44\text{ meters}$.

---

### Solution to Exercise 5.9
Ball 1 dropped from $100\text{ m}$, Ball 2 thrown $1\text{ s}$ later to land together:
1. Fall time of Ball 1:
$$t_1 = \sqrt{\frac{2(100.0)}{9.80}} = \sqrt{20.408} \approx 4.5175\text{ seconds}$$
2. Ball 2 has $1.00\text{ s}$ less time:
$$t_2 = t_1 - 1.00 = 4.5175 - 1.00 = 3.5175\text{ seconds}$$
3. Ball 2 must cover $100.0\text{ m}$ in $3.5175\text{ s}$:
$$100.0 = v_{02} t_2 + \frac{1}{2} g t_2^2$$
$$100.0 = v_{02}(3.5175) + 4.90(3.5175^2) = 3.5175 v_{02} + 4.90(12.373) = 3.5175 v_{02} + 60.628$$
$$3.5175 v_{02} = 100.0 - 60.628 = 39.372 \implies v_{02} = \frac{39.372}{3.5175} \approx 11.19\text{ m/s}$$
**Final Answer:** Initial downward velocity must be $11.19\text{ m/s}$ (or $-11.19\text{ m/s}$).

---

### Solution to Exercise 5.10
Prove an object covers half fall distance in final $29.3\%$ of time:
1. Total fall time from height $h$:
$$t_{\text{total}} = \sqrt{\frac{2h}{g}}$$
2. Time to fall first half of distance ($h/2$):
$$t_{\text{first-half}} = \sqrt{\frac{2(h/2)}{g}} = \sqrt{\frac{h}{g}} = \frac{1}{\sqrt{2}} \sqrt{\frac{2h}{g}} = \frac{1}{\sqrt{2}} t_{\text{total}} \approx 0.7071 t_{\text{total}}$$
3. Time spent falling the second half of distance:
$$t_{\text{second-half}} = t_{\text{total}} - t_{\text{first-half}} = \left(1 - \frac{1}{\sqrt{2}}\right) t_{\text{total}} = (1 - 0.7071) t_{\text{total}} = 0.2929 t_{\text{total}} \approx 29.3\% \quad \blacksquare$$
**Final Answer:** Proved: The second half of distance takes $(1 - 1/\sqrt{2}) \approx 29.3\%$ of total time.


---

# Chapter 6: Kinematics in Two Dimensions â€” Vector Independence and the Planar Realm

> *"A bead sliding along a straight wire experiences only one degree of freedom; it can advance or retreat. But release that bead onto a vast, friction-free table, and space expands into infinite directions. To track motion in two dimensions is to realize that the horizontal and vertical worlds coexist without interference â€” two parallel stories running simultaneously on orthogonal axes."*

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


---

# CHAPTER 07: Projectile Motion & Parabolic Trajectories

> "A projectile which moves with a motion compounded of two motions, one uniform and horizontal, the other naturally accelerated and vertical, describes a semi-parabola."
> â€” **Galileo Galilei**, *Dialogues Concerning Two New Sciences* (1638)

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

In Chapter 06, we established Galileoâ€™s foundational principle of orthogonal kinematic independence: motion along perpendicular spatial dimensions occurs with zero cross-talk, cross-coupling, or mutual interference. Projectile motion is the quintessential physical realization of this theorem.

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

Parametric equations $\big(x(t), y(t)\big)$ describe *when* the projectile arrives at a given point. To understand the geometric shape of the path traced out in spaceâ€”the *trajectory*â€”we must eliminate the scalar time parameter $t$.

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
At the highest point of the trajectoryâ€”the apex or apogeeâ€”the projectile is momentarily moving purely horizontally. Its vertical velocity must vanish identically:
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


---

# CHAPTER 08: Asymmetric Launches, Inclines, & Inverse Ballistic Targeting

> "To hit a mark on an elevated terrace or across a falling ravine, the gunner cannot rely on the simple symmetries of the level plain. Nature demands that the curvature of the earth and the slope of the hill be woven directly into the geometry of the shot."
> â€” **Tartaglia**, *Nova Scientia* (1537)

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


---

# CHAPTER 09: Relative Motion & Galilean Transformations

> "Shut yourself up with some friend in the main cabin below decks on some large ship, and have with you there some flies, butterflies, and other small flying animals. Have a large bowl of water with some fish in it; hang up a bottle that empties drop by drop into a wide vessel beneath it. With the ship standing still, observe carefully how the little animals fly with equal speed to all sides of the cabin. The fish swim indifferently in all directions; the drops fall into the vessel beneath... When you have observed all these things, have the ship proceed with any speed you like, so long as the motion is uniform and not fluctuating this way and that. You will discover not the least change in all the effects named, nor could you tell from any of them whether the ship was moving or standing still."
> â€” **Galileo Galilei**, *Dialogue Concerning the Two Chief World Systems* (1632)

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

Every statement in kinematics concerning position, displacement, or velocity is fundamentally meaningless unless an observerâ€”a **reference frame**â€”is explicitly specified.
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


---

# CHAPTER 10: Circular Motion & Centripetal Acceleration

> "Whenever a body moves along a curved path, there must be some cause that continuously bends its motion away from the straight rectilinear path that inertia would otherwise preserve."
> â€” **Christiaan Huygens**, *Horologium Oscillatorium* (1673)

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

To a beginner, acceleration is synonymous with "stepping on the gas pedal"â€”increasing speed. However, velocity is a **vector**, possessing both a magnitude (scalar speed $v = |\vec{v}|$) and a spatial direction (unit heading vector $\hat{u}_v$):
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


---

# CHAPTER 11: Calculus-Based Kinematics & Aerodynamic Drag

> "The resistance of fluids, which in slow motions is proportional to the velocity, and in swift motions to the square of the velocity, transforms the pure conic sections of geometry into the distorted curves of physical reality."
> â€” **Sir Isaac Newton**, *Philosophiae Naturalis Principia Mathematica* (1687)

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

In Chapter 06 and Chapter 07, we celebrated Galileoâ€™s theorem of orthogonal independence: horizontal motion ($a_x = 0$) and vertical motion ($a_y = -g$) evolved as completely uncoupled systems.

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

The next state is computed via Simpsonâ€™s weighted average:
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


---

# CHAPTER 12: Production TypeScript Kinematics Engine & Civilizational Grand Gauntlet

> "What we have grasped by pure thought and mathematical deduction must now be forged into executable computational algorithms. In the sovereign civilization, theory and code are one: the equation that predicts the trajectory of a star is identical to the machine instruction that guides the craft."
> â€” *The Sovereign Engineering Codex*

---

### Learning Objectives
After mastering this capstone chapter, the sovereign student will be able to:
1. Architect and implement a production-grade, zero-dependency, strictly typed TypeScript simulation engine (`KinematicsEngine`) capable of solving both analytical and numerical kinematic problems.
2. Encapsulate 2D vector kinematics, Galilean frame transformations, relative navigation, and circular curvature tracking into robust object-oriented software patterns.
3. Implement a high-accuracy 4th-Order Runge-Kutta (RK4) differential equation solver for coupled non-linear ballistic trajectories with quadratic aerodynamic drag.
4. Construct an automated inverse targeting solver that resolves dual low/high ballistic firing angles and tests reachability against the Parabola of Safety envelope.
5. Conquer the **Civilizational Grand Gauntlet**: 10 comprehensive, multi-stage capstone physics problems spanning every concept from Class 6 foundations to undergraduate mechanics, complete with unabridged mathematical derivations and step-by-step numerical solutions.

---

## 12.1 The Architectural Vision of the Kinematics Engine

Throughout the first eleven chapters of this treatise, we explored the mathematical and physical foundations of motion: from Galileoâ€™s reference frames and 1D acceleration to 2D vector calculus, parabolic ballistics, inclined planes, relative Galilean transformations, Frenet-Serret curvature, and calculus-based aerodynamic drag.

In modern aerospace guidance, autonomous robotics, defense engineering, and game physics engines, these analytical principles are translated directly into software. 

The `KinematicsEngine` is designed around four core architectural pillars:
1. **Mathematical Purity:** Zero external libraries or runtime dependencies. All vector algebra, trigonometric inversions, root-finding, and calculus integration are implemented from first principles using standard ECMAScript math.
2. **Strict Type Safety:** Exhaustive TypeScript interfaces for spatial coordinates, kinematic vectors, targeting solutions, and simulation steps, eliminating runtime type errors.
3. **Dual Analytical & Numerical Modality:** Closed-form exact equations are used where analytical solutions exist (vacuum trajectories, incline range, relative velocity), while the 4th-order Runge-Kutta (RK4) integrator is deployed where non-linear drag couples the equations of motion.
4. **Defensive Validation:** Comprehensive boundary checking protects against non-physical inputs (negative gravity, imaginary roots, zero radii, division by zero).

```
                      +---------------------------------------+
                      |           KinematicsEngine            |
                      +---------------------------------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                |                                |
         v                                v                                v
+------------------+            +-------------------+            +-------------------+
| Analytical Core  |            |  Targeting Solver |            |   RK4 Simulator   |
| - 1D Equations   |            | - Dual Angle Root |            | - Quadratic Drag  |
| - Level/Cliff R  |            | - Parabola Safety |            | - Time-Stepping   |
| - Incline Range  |            | - Line-of-Sight   |            | - Trajectory Path |
| - Relative Motion|            | - CBDR Collision  |            | - Terminal Speed  |
+------------------+            +-------------------+            +-------------------+
```

---

## 12.2 Production-Grade TypeScript Source Code

Below is the complete, unabridged production implementation of the `KinematicsEngine`. It is fully typed and ready to run in any modern Node.js, Deno, Bun, or browser environment.

```typescript
/**
 * @file KinematicsEngine.ts
 * @description Sovereign 1D & 2D Kinematics and Ballistic Simulation Engine
 * @version 3.0.0
 * @license MIT
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface KinematicState1D {
  position: number;
  velocity: number;
  acceleration: number;
}

export interface ProjectileVacuumResult {
  initialSpeed: number;
  launchAngleDeg: number;
  timeToApex: number;
  totalFlightTime: number;
  maxHeight: number;
  horizontalRange: number;
  impactVelocity: Vector2D;
}

export interface TargetingSolution {
  isReachable: boolean;
  maxReachableHeightAtTarget: number;
  lowAngleDeg?: number;
  highAngleDeg?: number;
  lowAngleFlightTime?: number;
  highAngleFlightTime?: number;
}

export interface InclineSolution {
  slopeAngleDeg: number;
  launchAngleDeg: number;
  optimalLaunchAngleDeg: number;
  flightTime: number;
  rangeAlongIncline: number;
  maxRangeAlongIncline: number;
  impactCoords: Vector2D;
}

export interface RelativeMotionSolution {
  relativeInitialPosition: Vector2D;
  relativeVelocity: Vector2D;
  timeOfClosestApproach: number;
  distanceOfClosestApproach: number;
  isCBDRCollision: boolean;
}

export interface CurvatureState {
  speed: number;
  tangentialAcceleration: number;
  centripetalAcceleration: number;
  totalAcceleration: number;
  radiusOfCurvature: number;
}

export interface SimulationTrajectoryPoint {
  time: number;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  speed: number;
}

export class KinematicsEngine {
  public static readonly DEFAULT_GRAVITY = 9.80665; // Standard Earth gravity (m/s^2)

  /**
   * Solve 1D constant acceleration kinematics for final position and velocity.
   */
  public static solve1D(x0: number, v0: number, a: number, t: number): KinematicState1D {
    if (t < 0) {
      throw new RangeError("Elapsed time t cannot be negative.");
    }
    const velocity = v0 + a * t;
    const position = x0 + v0 * t + 0.5 * a * t * t;
    return { position, velocity, acceleration: a };
  }

  /**
   * Analytical vacuum projectile motion over flat or cliff terrain.
   */
  public static solveVacuumProjectile(
    v0: number,
    angleDeg: number,
    initialHeight: number = 0,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): ProjectileVacuumResult {
    if (v0 < 0) throw new RangeError("Initial speed v0 cannot be negative.");
    if (initialHeight < 0) throw new RangeError("Initial height cannot be negative.");
    if (g <= 0) throw new RangeError("Gravity g must be strictly positive.");

    const thetaRad = (angleDeg * Math.PI) / 180.0;
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);

    const timeToApex = v0y > 0 ? v0y / g : 0;
    const apexHeight = initialHeight + (v0y > 0 ? (v0y * v0y) / (2 * g) : 0);

    // Asymmetric flight time formula: y(T) = h + v0y*T - 0.5*g*T^2 = 0
    const discriminant = v0y * v0y + 2 * g * initialHeight;
    const totalFlightTime = (v0y + Math.sqrt(discriminant)) / g;

    const horizontalRange = v0x * totalFlightTime;

    const impactVx = v0x;
    const impactVy = v0y - g * totalFlightTime;

    return {
      initialSpeed: v0,
      launchAngleDeg: angleDeg,
      timeToApex,
      totalFlightTime,
      maxHeight: apexHeight,
      horizontalRange,
      impactVelocity: { x: impactVx, y: impactVy }
    };
  }

  /**
   * Inverse Ballistic Targeting Solver: Given target (X, Y) and muzzle speed v0,
   * calculates low and high launch angles and checks the Parabola of Safety.
   */
  public static solveInverseTargeting(
    targetX: number,
    targetY: number,
    v0: number,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): TargetingSolution {
    if (targetX <= 0) throw new RangeError("Target X coordinate must be positive.");
    if (v0 <= 0) throw new RangeError("Muzzle velocity v0 must be positive.");

    const v0Sq = v0 * v0;
    const v0Quad = v0Sq * v0Sq;

    // Safety parabola envelope ceiling at targetX: Y_envelope = v0^2/(2g) - g*X^2/(2v0^2)
    const maxReachableHeight = v0Sq / (2 * g) - (g * targetX * targetX) / (2 * v0Sq);

    // Quadratic discriminant: Delta = v0^4 - 2*g*Y*v0^2 - g^2*X^2
    const discriminant = v0Quad - 2 * g * targetY * v0Sq - g * g * targetX * targetX;

    if (discriminant < 0) {
      return {
        isReachable: false,
        maxReachableHeightAtTarget: maxReachableHeight
      };
    }

    const sqrtDelta = Math.sqrt(discriminant);
    const tanLow = (v0Sq - sqrtDelta) / (g * targetX);
    const tanHigh = (v0Sq + sqrtDelta) / (g * targetX);

    const lowAngleRad = Math.atan(tanLow);
    const highAngleRad = Math.atan(tanHigh);

    const lowAngleDeg = (lowAngleRad * 180.0) / Math.PI;
    const highAngleDeg = (highAngleRad * 180.0) / Math.PI;

    const tLow = targetX / (v0 * Math.cos(lowAngleRad));
    const tHigh = targetX / (v0 * Math.cos(highAngleRad));

    return {
      isReachable: true,
      maxReachableHeightAtTarget: maxReachableHeight,
      lowAngleDeg,
      highAngleDeg,
      lowAngleFlightTime: tLow,
      highAngleFlightTime: tHigh
    };
  }

  /**
   * Ballistic trajectory across an inclined slope of angle alpha.
   */
  public static solveInclineBallistics(
    v0: number,
    launchAngleDeg: number,
    slopeAngleDeg: number,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): InclineSolution {
    if (launchAngleDeg <= slopeAngleDeg) {
      throw new Error("Launch angle must be strictly greater than the slope angle.");
    }

    const theta = (launchAngleDeg * Math.PI) / 180.0;
    const alpha = (slopeAngleDeg * Math.PI) / 180.0;

    // Rotated frame time of flight: T = 2*v0*sin(theta - alpha) / (g*cos(alpha))
    const flightTime = (2 * v0 * Math.sin(theta - alpha)) / (g * Math.cos(alpha));

    // Universal Incline Range Formula:
    // d = v0^2 / (g*cos^2(alpha)) * [ sin(2*theta - alpha) - sin(alpha) ]
    const cosAlpha = Math.cos(alpha);
    const rangeAlongIncline =
      ((v0 * v0) / (g * cosAlpha * cosAlpha)) *
      (Math.sin(2 * theta - alpha) - Math.sin(alpha));

    // Optimal launch angle: theta* = 45 deg + alpha / 2
    const optimalAngleDeg = 45.0 + slopeAngleDeg / 2.0;

    // Max range at optimal angle: d_max = v0^2 / (g * (1 + sin(alpha)))
    const maxRange = (v0 * v0) / (g * (1 + Math.sin(alpha)));

    const impactX = rangeAlongIncline * Math.cos(alpha);
    const impactY = rangeAlongIncline * Math.sin(alpha);

    return {
      slopeAngleDeg,
      launchAngleDeg,
      optimalLaunchAngleDeg: optimalAngleDeg,
      flightTime,
      rangeAlongIncline,
      maxRangeAlongIncline: maxRange,
      impactCoords: { x: impactX, y: impactY }
    };
  }

  /**
   * Relative Motion & Constant Bearing Decreasing Range (CBDR) Collision Solver.
   */
  public static solveRelativeMotion(
    r10: Vector2D,
    v1: Vector2D,
    r20: Vector2D,
    v2: Vector2D
  ): RelativeMotionSolution {
    // Relative position r_rel = r2 - r1
    const rx = r20.x - r10.x;
    const ry = r20.y - r10.y;

    // Relative velocity v_rel = v2 - v1
    const vx = v2.x - v1.x;
    const vy = v2.y - v1.y;

    const vRelSq = vx * vx + vy * vy;
    if (vRelSq === 0) {
      const initialDist = Math.sqrt(rx * rx + ry * ry);
      return {
        relativeInitialPosition: { x: rx, y: ry },
        relativeVelocity: { x: 0, y: 0 },
        timeOfClosestApproach: 0,
        distanceOfClosestApproach: initialDist,
        isCBDRCollision: initialDist < 1e-4
      };
    }

    // Dot product r0_rel . v_rel
    const rDotV = rx * vx + ry * vy;

    // Time of closest approach: t_min = - (r0 . v) / |v|^2
    const tMin = -rDotV / vRelSq;

    let closestDist: number;
    if (tMin <= 0) {
      // Craft are diverging; closest distance was at t = 0
      closestDist = Math.sqrt(rx * rx + ry * ry);
    } else {
      const closestX = rx + vx * tMin;
      const closestY = ry + vy * tMin;
      closestDist = Math.sqrt(closestX * closestX + closestY * closestY);
    }

    const isCBDR = tMin > 0 && closestDist < 1e-3;

    return {
      relativeInitialPosition: { x: rx, y: ry },
      relativeVelocity: { x: vx, y: vy },
      timeOfClosestApproach: Math.max(0, tMin),
      distanceOfClosestApproach: closestDist,
      isCBDRCollision: isCBDR
    };
  }

  /**
   * Frenet-Serret Curvature and Acceleration Decomposition.
   */
  public static computeCurvatureState(
    velocity: Vector2D,
    acceleration: Vector2D
  ): CurvatureState {
    const vSq = velocity.x * velocity.x + velocity.y * velocity.y;
    const speed = Math.sqrt(vSq);

    if (speed < 1e-9) {
      const totalAcc = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y);
      return {
        speed: 0,
        tangentialAcceleration: totalAcc,
        centripetalAcceleration: 0,
        totalAcceleration: totalAcc,
        radiusOfCurvature: Infinity
      };
    }

    // Tangential unit vector: u_t = v / |v|
    // Tangential acceleration: a_t = a . u_t = (a_x*v_x + a_y*v_y) / speed
    const aTangential = (acceleration.x * velocity.x + acceleration.y * velocity.y) / speed;

    // 2D Cross product magnitude: |v x a| = |v_x*a_y - v_y*a_x|
    const crossProduct = Math.abs(velocity.x * acceleration.y - velocity.y * acceleration.x);

    // Centripetal / normal acceleration: a_n = |v x a| / speed
    const aCentripetal = crossProduct / speed;

    const totalAcceleration = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y);

    // Radius of curvature: rho = speed^2 / a_n = speed^3 / |v x a|
    const radiusOfCurvature = aCentripetal > 1e-9 ? (speed * speed) / aCentripetal : Infinity;

    return {
      speed,
      tangentialAcceleration: aTangential,
      centripetalAcceleration: aCentripetal,
      totalAcceleration,
      radiusOfCurvature
    };
  }

  /**
   * 4th-Order Runge-Kutta (RK4) Numerical Integrator for 2D Ballistics with Drag.
   * Acceleration: a = [-c * v * vx, -g - c * v * vy]
   */
  public static simulateRK4WithDrag(
    v0: number,
    angleDeg: number,
    dragCoeffPerMeter: number,
    initialHeight: number = 0,
    dt: number = 0.01,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): SimulationTrajectoryPoint[] {
    const thetaRad = (angleDeg * Math.PI) / 180.0;
    let x = 0.0;
    let y = initialHeight;
    let vx = v0 * Math.cos(thetaRad);
    let vy = v0 * Math.sin(thetaRad);
    let t = 0.0;

    const trajectory: SimulationTrajectoryPoint[] = [];

    const getDerivatives = (vxIn: number, vyIn: number) => {
      const currentSpeed = Math.sqrt(vxIn * vxIn + vyIn * vyIn);
      const ax = -dragCoeffPerMeter * currentSpeed * vxIn;
      const ay = -g - dragCoeffPerMeter * currentSpeed * vyIn;
      return { ax, ay };
    };

    // Initial state
    const initialDeriv = getDerivatives(vx, vy);
    trajectory.push({
      time: t,
      position: { x, y },
      velocity: { x: vx, y: vy },
      acceleration: { x: initialDeriv.ax, y: initialDeriv.ay },
      speed: Math.sqrt(vx * vx + vy * vy)
    });

    while (y >= 0.0 && t < 1000.0) {
      // Stage 1
      const k1 = getDerivatives(vx, vy);

      // Stage 2
      const vx_k2 = vx + 0.5 * dt * k1.ax;
      const vy_k2 = vy + 0.5 * dt * k1.ay;
      const k2 = getDerivatives(vx_k2, vy_k2);

      // Stage 3
      const vx_k3 = vx + 0.5 * dt * k2.ax;
      const vy_k3 = vy + 0.5 * dt * k2.ay;
      const k3 = getDerivatives(vx_k3, vy_k3);

      // Stage 4
      const vx_k4 = vx + dt * k3.ax;
      const vy_k4 = vy + dt * k3.ay;
      const k4 = getDerivatives(vx_k4, vy_k4);

      // Weighted acceleration updates
      const axEff = (k1.ax + 2 * k2.ax + 2 * k3.ax + k4.ax) / 6.0;
      const ayEff = (k1.ay + 2 * k2.ay + 2 * k3.ay + k4.ay) / 6.0;

      // Position update using velocity midpoint
      const vxAvg = (vx + vx_k4) * 0.5;
      const vyAvg = (vy + vy_k4) * 0.5;

      x += vxAvg * dt;
      y += vyAvg * dt;
      vx += axEff * dt;
      vy += ayEff * dt;
      t += dt;

      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      trajectory.push({
        time: t,
        position: { x, y: Math.max(0, y) },
        velocity: { x: vx, y: vy },
        acceleration: { x: axEff, y: ayEff },
        speed: currentSpeed
      });
    }

    return trajectory;
  }
}
```

---

## 12.3 The Civilizational Grand Gauntlet: Ten Capstone Problems

Below are the 10 Civilizational Grand Gauntlet problems. Every problem is accompanied by a complete, unabridged step-by-step arithmetic derivation with full units and physical sanity checks.

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Gauntlet 1: Autonomous Maglev Braking with Jerk and Drag
**Problem:** An experimental maglev train traveling at $v_0 = 100.0\,\text{m/s}$ activates a two-phase emergency braking procedure:
- **Phase 1 (Jerk-Limited Deceleration):** For the first $t_1 = 4.00\,\text{s}$, the deceleration increases linearly from zero with constant jerk $j = -0.750\,\text{m/s}^3$ ($a(t) = -0.750 t$).
- **Phase 2 (Linear Drag Braking):** At $t = 4.00\,\text{s}$, aerodynamic flaps and eddy brakes deploy, producing a drag deceleration $a(v) = -0.0800 v\,\text{s}^{-1}$.
Calculate the total distance traversed by the train from the initiation of braking until its speed drops to $v_f = 5.00\,\text{m/s}$.

#### Solution
**Step 1: Kinematics of Phase 1 ($0 \le t \le 4.00\,\text{s}$)**
$$a(t) = -0.750 t\,\text{m/s}^2$$
$$v(t) = v_0 + \int_0^t -0.750 \tau\,d\tau = 100.0 - 0.375 t^2\,\text{m/s}$$
At $t_1 = 4.00\,\text{s}$:
$$v_1 = v(4.00) = 100.0 - 0.375(4.00)^2 = 100.0 - 0.375(16.0) = 100.0 - 6.00 = 94.00\,\text{m/s}$$

Distance traversed in Phase 1:
$$x_1 = \int_0^{4.00} (100.0 - 0.375 \tau^2)\,d\tau = \left[ 100.0 \tau - 0.125 \tau^3 \right]_0^{4.00} = 100.0(4.00) - 0.125(64.0) = 400.0 - 8.00 = 392.00\,\text{m}$$

**Step 2: Kinematics of Phase 2 ($v_1 = 94.00\,\text{m/s} \to v_f = 5.00\,\text{m/s}$)**
The acceleration is $a(v) = -k v$ with $k = 0.0800\,\text{s}^{-1}$.
Using $v \frac{dv}{dx} = -k v \implies dv = -k\,dx$:
$$\int_{v_1}^{v_f} dv' = -k \int_0^{x_2} dx' \implies v_f - v_1 = -k x_2$$
$$x_2 = \frac{v_1 - v_f}{k} = \frac{94.00\,\text{m/s} - 5.00\,\text{m/s}}{0.0800\,\text{s}^{-1}} = \frac{89.00}{0.0800} = 1112.50\,\text{m}$$

**Step 3: Total braking distance**
$$x_{\text{total}} = x_1 + x_2 = 392.00\,\text{m} + 1112.50\,\text{m} = 1504.50\,\text{m} \approx 1.50\,\text{km}$$

---

### Gauntlet 2: The Two-Stage Sounding Rocket Ascent & Coast
**Problem:** A meteorological sounding rocket launches vertically from rest from sea level.
- **Powered Ascent:** The motor burns for $t_b = 25.0\,\text{s}$, producing a net upward acceleration $a_{\text{net}} = +14.0\,\text{m/s}^2$ (including gravity).
- **Free-Flight Coast:** At $t_b = 25.0\,\text{s}$, the motor shuts down and the rocket coasts upward under gravity ($g = 9.80\,\text{m/s}^2$).
1. What is the burnout altitude $y_b$ and burnout speed $v_b$?
2. What is the maximum peak altitude $Y_{\text{max}}$ reached by the rocket?
3. What is the total time elapsed from launch until the rocket impacts the ocean?

#### Solution
**Step 1: Powered phase ($t = 0 \to 25.0\,\text{s}$)**
$$v_b = a_{\text{net}} t_b = 14.0\,\text{m/s}^2 \times 25.0\,\text{s} = 350.0\,\text{m/s}$$
$$y_b = \frac{1}{2} a_{\text{net}} t_b^2 = 0.5 \times 14.0 \times (25.0)^2 = 7.0 \times 625.0 = 4375.0\,\text{m}$$

**Step 2: Coasting phase to apex**
During coasting, $a = -g = -9.80\,\text{m/s}^2$.
$$t_{\text{coast}} = \frac{v_b}{g} = \frac{350.0\,\text{m/s}}{9.80\,\text{m/s}^2} = 35.714\,\text{s}$$
Coasting distance:
$$h_{\text{coast}} = \frac{v_b^2}{2g} = \frac{(350.0)^2}{2 \times 9.80} = \frac{122500.0}{19.60} = 6250.0\,\text{m}$$
Maximum altitude:
$$Y_{\text{max}} = y_b + h_{\text{coast}} = 4375.0\,\text{m} + 6250.0\,\text{m} = 10625.0\,\text{m} \approx 10.63\,\text{km}$$

**Step 3: Descent from apex to ocean**
Free fall from $Y_{\text{max}} = 10625.0\,\text{m}$:
$$Y_{\text{max}} = \frac{1}{2} g t_{\text{fall}}^2 \implies t_{\text{fall}} = \sqrt{\frac{2 \times 10625.0}{9.80}} = \sqrt{\frac{21250.0}{9.80}} = \sqrt{2168.367} = 46.566\,\text{s}$$

Total flight time:
$$T_{\text{total}} = t_b + t_{\text{coast}} + t_{\text{fall}} = 25.000 + 35.714 + 46.566 = 107.28\,\text{s} \approx 1\,\text{min}\,47.3\,\text{s}$$

---

### Gauntlet 3: Inverse Targeting Over an Intermediate Mountain Ridge
**Problem:** A mortar battery at $(0,0)$ must strike an enemy redoubt located at $(X_{\text{target}}, Y_{\text{target}}) = (1800.0\,\text{m}, 120.0\,\text{m})$. An intervening mountain ridge of height $H_{\text{ridge}} = 350.0\,\text{m}$ is located at $X_{\text{ridge}} = 800.0\,\text{m}$. The mortar muzzle speed is $v_0 = 160.0\,\text{m/s}$.
1. Find both the low-angle and high-angle firing solutions.
2. Determine which solution safely clears the mountain ridge.
3. Compute the ridge clearance margin for the viable trajectory.

#### Solution
**Step 1: Targeting solutions**
$$v_0 = 160.0\,\text{m/s} \implies v_0^2 = 25600.0\,\text{m}^2/\text{s}^2$$
$$k = \frac{g X_{\text{target}}^2}{2 v_0^2} = \frac{9.80 \times (1800.0)^2}{2 \times 25600.0} = \frac{9.80 \times 3240000}{51200} = \frac{31752000}{51200} = 620.15625\,\text{m}$$
$$Y + k = 120.0 + 620.156 = 740.156\,\text{m}$$
$$\Delta = X^2 - 4 k (Y + k) = (1800.0)^2 - 4(620.15625)(740.15625) = 3240000 - 2480.625 \times 740.15625 = 3240000 - 1836050.2 = 1403949.8\,\text{m}^2$$
$$\sqrt{\Delta} = \sqrt{1403949.8} = 1184.8839\,\text{m}$$

Low Angle:
$$\tan\theta_{\text{low}} = \frac{1800.0 - 1184.8839}{2 \times 620.15625} = \frac{615.1161}{1240.3125} = 0.495936 \implies \theta_{\text{low}} = 26.378^\circ \approx 26.4^\circ$$
High Angle:
$$\tan\theta_{\text{high}} = \frac{1800.0 + 1184.8839}{1240.3125} = \frac{2984.8839}{1240.3125} = 2.406558 \implies \theta_{\text{high}} = 67.436^\circ \approx 67.4^\circ$$

**Step 2: Trajectory height at ridge ($X = 800.0\,\text{m}$)**
Trajectory equation: $y(X) = X \tan\theta - \frac{g X^2}{2 v_0^2} (1 + \tan^2\theta)$.
$$\frac{g X^2}{2 v_0^2} = \frac{9.80 \times (800.0)^2}{2 \times 25600.0} = \frac{9.80 \times 640000}{51200} = \frac{6272000}{51200} = 122.50\,\text{m}$$

For Low Angle ($\tan\theta = 0.495936, 1 + \tan^2\theta = 1 + 0.24595 = 1.24595$):
$$y_{\text{low}}(800) = 800.0(0.495936) - 122.50(1.24595) = 396.75 - 152.63 = 244.12\,\text{m}$$
Since $y_{\text{low}}(800) = 244.12\,\text{m} < 350.0\,\text{m}$, **the low-angle shot impacts the mountain ridge and fails!**

For High Angle ($\tan\theta = 2.406558, 1 + \tan^2\theta = 1 + 5.79152 = 6.79152$):
$$y_{\text{high}}(800) = 800.0(2.406558) - 122.50(6.79152) = 1925.25 - 831.96 = 1093.29\,\text{m}$$
Since $y_{\text{high}}(800) = 1093.29\,\text{m} > 350.0\,\text{m}$, the high-angle shot soars far above the ridge!

**Step 3: Clearance margin**
$$\text{Margin} = 1093.29\,\text{m} - 350.0\,\text{m} = +743.29\,\text{m}$$

---

### Gauntlet 4: Incline Intercept with Moving Downhill Target
**Problem:** A defensive laser/projectile cannon at the base of a ski slope ($\alpha = 20.0^\circ$ incline) launches an interceptor with muzzle velocity $v_0 = 70.0\,\text{m/s}$ at angle $\theta = 50.0^\circ$ above the horizontal. At the instant of launch ($t = 0$), a robotic skier located at distance $D_0 = 350.0\,\text{m}$ up the slope skims down the slope toward the launcher with constant speed $u = 12.0\,\text{m/s}$.
1. Find the flight time of the interceptor before hitting the incline surface.
2. Determine where on the slope the interceptor strikes.
3. Determine whether the interceptor strikes the moving skier (calculate miss distance along the slope).

#### Solution
**Step 1: Flight time to incline surface**
Using the rotated coordinate system:
$$\beta = \theta - \alpha = 50.0^\circ - 20.0^\circ = 30.0^\circ$$
$$a_{y'} = g \cos\alpha = 9.80 \cos(20.0^\circ) = 9.80 \times 0.939693 = 9.2090\,\text{m/s}^2$$
$$v_{0y'} = v_0 \sin\beta = 70.0 \sin(30.0^\circ) = 35.00\,\text{m/s}$$
$$T = \frac{2 v_{0y'}}{a_{y'}} = \frac{2 \times 35.00}{9.2090} = 7.6013\,\text{s} \approx 7.60\,\text{s}$$

**Step 2: Landing position of projectile along incline ($d_p$)**
$$v_{0x'} = v_0 \cos\beta = 70.0 \cos(30.0^\circ) = 70.0 \times 0.866025 = 60.6218\,\text{m/s}$$
$$a_{x'} = g \sin\alpha = 9.80 \sin(20.0^\circ) = 9.80 \times 0.342020 = 3.3518\,\text{m/s}^2$$
$$d_p = v_{0x'} T - \frac{1}{2} a_{x'} T^2 = 60.6218(7.6013) - 0.5(3.3518)(7.6013)^2 = 460.805 - 1.6759(57.7798) = 460.805 - 96.833 = 363.97\,\text{m}$$

**Step 3: Position of skier at $t = T$**
The skier moves downhill toward the origin from $D_0 = 350.0\,\text{m}$ at $u = 12.0\,\text{m/s}$:
$$d_s(T) = D_0 - u T = 350.0 - 12.0(7.6013) = 350.0 - 91.216 = 258.78\,\text{m}$$

Miss distance:
$$\Delta d = d_p - d_s = 363.97\,\text{m} - 258.78\,\text{m} = +105.19\,\text{m}$$
The projectile overshoots the skier by $105.2\,\text{m}$.

---

### Gauntlet 5: Three-Body Maritime CBDR Intercept
**Problem:** At $t = 0$:
- Vessel A is at $(0, 0)$ steaming due East at $v_A = 12.0\,\text{knots}$.
- Vessel B is at $(8.00\,\text{NM}, 6.00\,\text{NM})$ steaming due South at $v_B = 16.0\,\text{knots}$.
1. Compute the relative position and velocity vectors of Vessel B relative to Vessel A.
2. Determine the time of closest approach $t_{\text{min}}$ and the minimum miss distance $D_{\text{min}}$.
3. Does Vessel B satisfy the CBDR collision condition?

#### Solution
**Step 1: Relative vectors**
$$\vec{r}_{0,\text{rel}} = \vec{r}_B - \vec{r}_A = 8.00\,\hat{i} + 6.00\,\hat{j}\,\text{NM}$$
$$\vec{v}_A = 12.0\,\hat{i} + 0\,\hat{j}\,\text{knots}$$
$$\vec{v}_B = 0\,\hat{i} - 16.0\,\hat{j}\,\text{knots}$$
$$\vec{v}_{\text{rel}} = \vec{v}_B - \vec{v}_A = -12.0\,\hat{i} - 16.0\,\hat{j}\,\text{knots}$$

**Step 2: Closest approach**
$$\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}} = (8.00 \times -12.0) + (6.00 \times -16.0) = -96.0 - 96.0 = -192.0\,\text{NM}^2/\text{hr}$$
$$|\vec{v}_{\text{rel}}|^2 = (-12.0)^2 + (-16.0)^2 = 144.0 + 256.0 = 400.0\,\text{knots}^2$$
$$t_{\text{min}} = -\frac{\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}}}{|\vec{v}_{\text{rel}}|^2} = -\frac{-192.0}{400.0} = 0.480\,\text{hours} = 28.8\,\text{minutes}$$

Relative position at $t = 0.480\,\text{hr}$:
$$\vec{r}_{\text{rel}}(0.480) = [8.00 - 12.0(0.480)]\,\hat{i} + [6.00 - 16.0(0.480)]\,\hat{j} = (8.00 - 5.76)\,\hat{i} + (6.00 - 7.68)\,\hat{j} = 2.24\,\hat{i} - 1.68\,\hat{j}\,\text{NM}$$
$$D_{\text{min}} = \sqrt{(2.24)^2 + (-1.68)^2} = \sqrt{5.0176 + 2.8224} = \sqrt{7.8400} = 2.80\,\text{NM}$$

**Step 3: CBDR Assessment**
Since $D_{\text{min}} = 2.80\,\text{NM} > 0$, the vessels will not collide. The relative velocity vector does not point directly antiparallel to $\vec{r}_{0,\text{rel}}$ ($8/6 = 1.33 \ne 12/16 = 0.75$).

---

### Gauntlet 6: Frenet-Serret Curvature of a Hypersonic Re-entry Trajectory
**Problem:** A spacecraft re-entering the upper atmosphere follows a 2D descent path parameterized by:
$$x(t) = 3000.0 t, \quad y(t) = 80000.0 e^{-0.0150 t} \quad (\text{meters, for } t \ge 0)$$
At $t = 40.0\,\text{s}$, determine:
1. The velocity vector $\vec{v}$ and instantaneous speed.
2. The acceleration vector $\vec{a}$.
3. The tangential and normal components of acceleration ($a_t, a_n$).
4. The instantaneous radius of curvature $\rho$.

#### Solution
**Step 1: Velocity at $t = 40.0\,\text{s}$**
$$v_x(t) = 3000.0\,\text{m/s} \implies v_x(40) = 3000.0\,\text{m/s}$$
$$v_y(t) = \frac{d}{dt}\left(80000.0 e^{-0.0150 t}\right) = -1200.0 e^{-0.0150 t}$$
At $t = 40.0\,\text{s}$:
$$-0.0150 \times 40.0 = -0.600 \implies e^{-0.600} = 0.548812$$
$$v_y(40) = -1200.0 \times 0.548812 = -658.574\,\text{m/s}$$
Speed:
$$v = \sqrt{(3000.0)^2 + (-658.574)^2} = \sqrt{9000000 + 433720} = \sqrt{9433720} = 3071.44\,\text{m/s}$$

**Step 2: Acceleration at $t = 40.0\,\text{s}$**
$$a_x(t) = 0\,\text{m/s}^2$$
$$a_y(t) = \frac{d}{dt}\left(-1200.0 e^{-0.0150 t}\right) = +18.00 e^{-0.0150 t}$$
$$a_y(40) = 18.00 \times 0.548812 = +9.8786\,\text{m/s}^2$$
$$\vec{a} = 0\,\hat{i} + 9.8786\,\hat{j}\,\text{m/s}^2$$

**Step 3: Tangential and normal acceleration**
$$a_t = \frac{\vec{a} \cdot \vec{v}}{v} = \frac{0(3000.0) + (9.8786 \times -658.574)}{3071.44} = \frac{-6505.79}{3071.44} = -2.118\,\text{m/s}^2$$
Cross product:
$$|\vec{v} \times \vec{a}| = |v_x a_y - v_y a_x| = |3000.0 \times 9.8786 - (-658.574 \times 0)| = 29635.8\,\text{m}^2/\text{s}^3$$
$$a_n = \frac{|\vec{v} \times \vec{a}|}{v} = \frac{29635.8}{3071.44} = 9.6488\,\text{m/s}^2 \approx 9.65\,\text{m/s}^2$$

**Step 4: Radius of curvature**
$$\rho = \frac{v^2}{a_n} = \frac{(3071.44)^2}{9.6488} = \frac{9433744}{9.6488} = 977,712\,\text{m} \approx 977.7\,\text{km}$$

---

### Gauntlet 7: Railgun Launch Through Stratified Atmosphere
**Problem:** An electromagnetic hypervelocity projectile of mass $m = 5.00\,\text{kg}$ is launched vertically upward at $v_0 = 2000.0\,\text{m/s}$. The atmospheric density decays exponentially with altitude: $\rho(y) = \rho_0 e^{-y / H_{\text{scale}}}$ with $\rho_0 = 1.20\,\text{kg/m}^3$ and $H_{\text{scale}} = 8000.0\,\text{m}$. The quadratic drag parameter is $c(y) = c_0 e^{-y / H_{\text{scale}}}$ with $c_0 = 5.00 \times 10^{-5}\,\text{m}^{-1}$.
Assuming the projectile exits the dense lower atmosphere into space before reversing direction, write the non-linear differential equation and compute the speed loss $\Delta v$ across the first $y = 1000.0\,\text{m}$ interval using the average density approximation.

#### Solution
**Step 1: Differential equation**
$$v \frac{dv}{dy} = -g - c_0 e^{-y / H_{\text{scale}}} v^2$$

**Step 2: Mean drag parameter over first $1000\,\text{m}$**
At $y = 0$: $c = 5.00 \times 10^{-5}\,\text{m}^{-1}$.
At $y = 1000\,\text{m}$: $e^{-1000 / 8000} = e^{-0.125} = 0.8825 \implies c(1000) = 4.41 \times 10^{-5}\,\text{m}^{-1}$.
$$\bar{c} \approx \frac{5.00 + 4.41}{2} \times 10^{-5} = 4.705 \times 10^{-5}\,\text{m}^{-1}$$

**Step 3: Speed loss calculation**
Since $g \ll \bar{c} v^2$ at $2000\,\text{m/s}$ ($\bar{c} v^2 = 4.705 \times 10^{-5} \times 4 \times 10^6 = 188.2\,\text{m/s}^2 \gg 9.8$):
$$v \frac{dv}{dy} \approx -\bar{c} v^2 \implies \frac{dv}{v} = -\bar{c}\,dy$$
$$\ln\left(\frac{v_1}{v_0}\right) = -\bar{c} \Delta y = -4.705 \times 10^{-5} \times 1000.0 = -0.04705$$
$$v_1 = v_0 e^{-0.04705} = 2000.0 \times 0.95404 = 1908.08\,\text{m/s}$$
$$\Delta v = 2000.0 - 1908.08 = 91.92\,\text{m/s}$$

---

### Gauntlet 8: Acoustic Well-Depth Problem with 2D Wind Drift
**Problem:** A stone is dropped from rest into a deep vertical ventilation shaft. A horizontal crosswind inside the shaft blows with constant velocity $u = 3.00\,\text{m/s}$. The total time elapsed between releasing the stone and hearing the sound of impact is $T_{\text{total}} = 5.40\,\text{s}$. Speed of sound in air is $v_s = 340.0\,\text{m/s}$.
1. Calculate the exact vertical depth $h$ of the shaft.
2. Determine the horizontal displacement of the stone at impact.

#### Solution
**Step 1: Vertical depth equation**
Let $t_1$ be fall time and $t_2$ be acoustic return time:
$$t_1 + t_2 = T_{\text{total}} = 5.40\,\text{s}$$
$$h = \frac{1}{2} g t_1^2 = 4.90 t_1^2$$
$$t_2 = \frac{h}{v_s} = \frac{4.90 t_1^2}{340.0} = 0.0144118 t_1^2$$

Substitute into the time sum:
$$0.0144118 t_1^2 + t_1 - 5.40 = 0$$
Using the quadratic formula:
$$t_1 = \frac{-1.00 + \sqrt{1.00^2 - 4(0.0144118)(-5.40)}}{2(0.0144118)} = \frac{-1.00 + \sqrt{1.00 + 0.311295}}{0.0288235} = \frac{-1.00 + \sqrt{1.311295}}{0.0288235} = \frac{-1.00 + 1.145118}{0.0288235} = \frac{0.145118}{0.0288235} = 5.0347\,\text{s}$$

Vertical depth:
$$h = 4.90 (5.0347)^2 = 4.90 \times 25.3483 = 124.21\,\text{m}$$

Check acoustic return time:
$$t_2 = \frac{124.21}{340.0} = 0.3653\,\text{s}$$
$$t_1 + t_2 = 5.0347 + 0.3653 = 5.400\,\text{s}$$. Exact match.

**Step 2: Horizontal displacement**
$$x = u t_1 = 3.00\,\text{m/s} \times 5.0347\,\text{s} = 15.10\,\text{m}$$

---

### Gauntlet 9: High-Precision RK4 Ballistics with Quadratic Drag
**Problem:** An artillery shell is fired at $v_0 = 300.0\,\text{m/s}$ at $\theta = 45.0^\circ$ through air with $c = 0.00010\,\text{m}^{-1}$.
1. What is the theoretical vacuum range $R_{\text{vac}}$?
2. Set up the coupled RK4 differential equations.
3. Compute the velocity vector at $t = 1.00\,\text{s}$ using RK4 with $\Delta t = 1.00\,\text{s}$.

#### Solution
**Step 1: Vacuum range**
$$R_{\text{vac}} = \frac{v_0^2 \sin(2\theta)}{g} = \frac{(300.0)^2 \sin(90.0^\circ)}{9.80} = \frac{90000.0}{9.80} = 9183.67\,\text{m} \approx 9.18\,\text{km}$$

**Step 2: Coupled equations**
$$v_{0x} = v_{0y} = 300.0 \cos(45^\circ) = 212.132\,\text{m/s}$$
$$\frac{dv_x}{dt} = -0.00010 \sqrt{v_x^2 + v_y^2}\,v_x$$
$$\frac{dv_y}{dt} = -9.80 - 0.00010 \sqrt{v_x^2 + v_y^2}\,v_y$$

**Step 3: RK4 step with $\Delta t = 1.00\,\text{s}$**
Stage 1:
$$v = 300.0\,\text{m/s}$$
$$k_{1,x} = -0.00010 \times 300.0 \times 212.132 = -6.3640\,\text{m/s}^2$$
$$k_{1,y} = -9.80 - 6.3640 = -16.1640\,\text{m/s}^2$$

Stage 2:
$$v_{x,2} = 212.132 + 0.5(-6.3640) = 212.132 - 3.182 = 208.950\,\text{m/s}$$
$$v_{y,2} = 212.132 + 0.5(-16.1640) = 212.132 - 8.082 = 204.050\,\text{m/s}$$
$$v_2 = \sqrt{(208.950)^2 + (204.050)^2} = \sqrt{43660.1 + 41636.4} = \sqrt{85296.5} = 292.056\,\text{m/s}$$
$$k_{2,x} = -0.00010 \times 292.056 \times 208.950 = -6.1025\,\text{m/s}^2$$
$$k_{2,y} = -9.80 - (0.00010 \times 292.056 \times 204.050) = -9.80 - 5.9594 = -15.7594\,\text{m/s}^2$$

Stage 3:
$$v_{x,3} = 212.132 + 0.5(-6.1025) = 209.081\,\text{m/s}$$
$$v_{y,3} = 212.132 + 0.5(-15.7594) = 204.252\,\text{m/s}$$
$$v_3 = \sqrt{(209.081)^2 + (204.252)^2} = \sqrt{43714.9 + 41718.9} = \sqrt{85433.8} = 292.291\,\text{m/s}$$
$$k_{3,x} = -0.00010 \times 292.291 \times 209.081 = -6.1112\,\text{m/s}^2$$
$$k_{3,y} = -9.80 - (0.00010 \times 292.291 \times 204.252) = -9.80 - 5.9701 = -15.7701\,\text{m/s}^2$$

Stage 4:
$$v_{x,4} = 212.132 + 1.0(-6.1112) = 206.021\,\text{m/s}$$
$$v_{y,4} = 212.132 + 1.0(-15.7701) = 196.362\,\text{m/s}$$
$$v_4 = \sqrt{(206.021)^2 + (196.362)^2} = \sqrt{42444.7 + 38558.0} = \sqrt{81002.7} = 284.610\,\text{m/s}$$
$$k_{4,x} = -0.00010 \times 284.610 \times 206.021 = -5.8636\,\text{m/s}^2$$
$$k_{4,y} = -9.80 - (0.00010 \times 284.610 \times 196.362) = -9.80 - 5.5886 = -15.3886\,\text{m/s}^2$$

Weighted acceleration updates:
$$k_{x,\text{eff}} = \frac{1}{6} \left[ -6.3640 + 2(-6.1025) + 2(-6.1112) - 5.8636 \right] = \frac{1}{6} \left[ -36.6550 \right] = -6.1092\,\text{m/s}^2$$
$$k_{y,\text{eff}} = \frac{1}{6} \left[ -16.1640 + 2(-15.7594) + 2(-15.7701) - 15.3886 \right] = \frac{1}{6} \left[ -94.6116 \right] = -15.7686\,\text{m/s}^2$$

Velocity at $t = 1.00\,\text{s}$:
$$v_x(1.00) = 212.132 - 6.1092(1.00) = 206.02\,\text{m/s}$$
$$v_y(1.00) = 212.132 - 15.7686(1.00) = 196.36\,\text{m/s}$$

---

### Gauntlet 10: Multi-Body Orbital Hyperbolic Flyby Kinematics
**Problem:** A deep space reconnaissance probe performs an unpowered planetary flyby. In the planetocentric reference frame, the probe's trajectory is a hyperbola:
$$r(\theta) = \frac{p}{1 + e \cos\theta}$$
with semi-latus rectum $p = 1.80 \times 10^7\,\text{m}$ and eccentricity $e = 1.50$.
At periapsis ($\theta = 0^\circ$), the probe passes at its minimum altitude with speed $v_{\text{peri}} = 12000.0\,\text{m/s}$.
1. Compute the periapsis radius $r_{\text{peri}}$.
2. Using the Frenet-Serret osculating curvature relation, compute the probe's centripetal acceleration at periapsis.
3. Compute the gravitational acceleration $g_{\text{peri}} = \mu / r_{\text{peri}}^2$ and verify that $a_c = g_{\text{peri}}$.

#### Solution
**Step 1: Periapsis radius**
At $\theta = 0^\circ$:
$$r_{\text{peri}} = \frac{p}{1 + e \cos(0^\circ)} = \frac{p}{1 + e} = \frac{1.80 \times 10^7\,\text{m}}{1 + 1.50} = \frac{1.80 \times 10^7}{2.50} = 7.20 \times 10^6\,\text{m} = 7200.0\,\text{km}$$

**Step 2: Radius of curvature at periapsis**
For any conic section in polar form $r = \frac{p}{1 + e \cos\theta}$, the radius of curvature at the periapsis vertex is identically equal to the semi-latus rectum $p$:
$$\rho_{\text{peri}} = p = 1.80 \times 10^7\,\text{m}$$

Centripetal acceleration:
$$a_c = \frac{v_{\text{peri}}^2}{\rho_{\text{peri}}} = \frac{(12000.0\,\text{m/s})^2}{1.80 \times 10^7\,\text{m}} = \frac{1.44 \times 10^8}{1.80 \times 10^7} = 8.00\,\text{m/s}^2$$

**Step 3: Verification with orbital mechanics**
In celestial mechanics, the semi-latus rectum satisfies $p = \frac{h^2}{\mu}$, where $h$ is specific angular momentum:
$$h = r_{\text{peri}} v_{\text{peri}} = (7.20 \times 10^6) \times (1.20 \times 10^4) = 8.64 \times 10^{10}\,\text{m}^2/\text{s}$$
$$\mu = \frac{h^2}{p} = \frac{(8.64 \times 10^{10})^2}{1.80 \times 10^7} = \frac{7.46496 \times 10^{21}}{1.80 \times 10^7} = 4.1472 \times 10^{14}\,\text{m}^3/\text{s}^2$$

The gravitational acceleration at periapsis is:
$$g_{\text{peri}} = \frac{\mu}{r_{\text{peri}}^2} = \frac{4.1472 \times 10^{14}}{(7.20 \times 10^6)^2} = \frac{4.1472 \times 10^{14}}{5.184 \times 10^{13}} = 8.00\,\text{m/s}^2$$

Notice the magnificent harmony:
$$a_c \equiv g_{\text{peri}} = 8.00\,\text{m/s}^2$$
Pure differential kinematics and Newtonâ€™s celestial gravitation merge in complete, unbreakable unity.

