# Chapter 9: The Physical Hierarchy of Motion — Position, Velocity, Acceleration, Jerk, and Snap

> *"To the human eye, an elevator that suddenly starts moving feels uncomfortable, but one that starts with an instantaneous jerk can cause physical injury. Physics and engineering cannot stop at acceleration; they must climb the infinite ladder of time derivatives to tame forces, mechanical wear, and physiological comfort."*

---

## 9.1 The Kinematic Ladder

In physics simulation and classical mechanics, differential calculus is the native language of motion. If we record the position of a body in space as a function of time $t$, each successive derivative reveals a deeper layer of physical reality:

| Derivative Order | Mathematical Notation | Common Physical Name | Metric Units (SI) | Physical Significance |
| :---: | :---: | :--- | :---: | :--- |
| **0** | $s(t)$ or $\vec{r}(t)$ | **Position (Displacement)** | $\text{m}$ | Where the object is located in space. |
| **1** | $v(t) = \dot{s} = \frac{ds}{dt}$ | **Velocity** | $\text{m/s}$ | Rate at which position changes; direction of motion. |
| **2** | $a(t) = \ddot{s} = \frac{dv}{dt} = \frac{d^2s}{dt^2}$ | **Acceleration** | $\text{m/s}^2$ | Rate at which velocity changes; proportional to Net Force ($F = ma$). |
| **3** | $j(t) = \dddot{s} = \frac{da}{dt} = \frac{d^3s}{dt^3}$ | **Jerk (Jolt)** | $\text{m/s}^3$ | Rate at which acceleration changes; rate of change of force on human passengers and structures. |
| **4** | $s_4(t) = s^{(4)} = \frac{dj}{dt} = \frac{d^4s}{dt^4}$ | **Snap (Jounce)** | $\text{m/s}^4$ | Rate of change of jerk; critical in aerospace guidance, drone gimbal paths, and CNC tool wear. |
| **5** | $c(t) = s^{(5)} = \frac{ds_4}{dt}$ | **Crackle** | $\text{m/s}^5$ | Higher-order trajectory smoothing. |
| **6** | $p(t) = s^{(6)} = \frac{dc}{dt}$ | **Pop** | $\text{m/s}^6$ | Precision trajectory smoothing. |

In this chapter, we will master the interplay among these derivatives and formulate the mathematical criteria governing realistic, smooth physical motion in simulation and engineering.

---

## 9.2 Velocity vs. Speed: The Critical Distinction

In common conversation, people use "speed" and "velocity" interchangeably. In mathematics and physics, they are fundamentally different:

1. **Velocity ($v(t)$)** is a **signed scalar** in one dimension (or a vector in multiple dimensions).
   - $v(t) > 0$ means the body is moving in the **positive direction** (e.g., rightward, upward, forward).
   - $v(t) < 0$ means the body is moving in the **negative direction** (e.g., leftward, downward, reverse).
   - $v(t) = 0$ means the body is **momentarily at rest** (stationary or at a turning point).

2. **Speed ($|v(t)|$)** is the **absolute magnitude** of velocity:
   $$\text{Speed} = |v(t)| = \left|\frac{ds}{dt}\right| \ge 0$$
   Speed is never negative. A car traveling in reverse at $-25\text{ m/s}$ has a speed of $+25\text{ m/s}$.

---

## 9.3 The Diagnostic Test: Speeding Up vs. Slowing Down

One of the most persistent misconceptions among engineering and physics students is that:
- *"Positive acceleration always means speeding up."* $\mathbf{(FALSE)}$
- *"Negative acceleration always means slowing down."* $\mathbf{(FALSE)}$

To see why this is false, consider a vehicle moving in reverse with velocity $v = -20\text{ m/s}$. If the driver presses the accelerator in reverse, the acceleration is $a = -4\text{ m/s}^2$. 
One second later, the velocity becomes:
$$v = -20 + (-4)(1) = -24\text{ m/s}$$
The speed was $20\text{ m/s}$; now the speed is $24\text{ m/s}$. The vehicle **sped up**, even though the acceleration was strictly negative!

### The Exact Mathematical Criterion
Consider the rate of change of speed squared ($v^2$):

$$\frac{d}{dt}\left[ (v(t))^2 \right] = 2 v(t) \cdot \frac{dv}{dt} = 2 v(t) a(t)$$

Since speed is $|v| = \sqrt{v^2}$, speed is strictly increasing whenever $v^2$ is increasing:

$$\mathbf{v(t) \cdot a(t) > 0 \iff \text{The body is SPEEDING UP}}$$
$$\mathbf{v(t) \cdot a(t) < 0 \iff \text{The body is SLOWING DOWN}}$$

```
                       Velocity > 0                   Velocity < 0
               (Moving Right / Forward)        (Moving Left / Reverse)
             +------------------------------+------------------------------+
Acceleration |       v > 0, a > 0           |         v < 0, a > 0         |
    > 0      |        SPEEDING UP           |         SLOWING DOWN         |
             +------------------------------+------------------------------+
Acceleration |       v > 0, a < 0           |         v < 0, a < 0         |
    < 0      |        SLOWING DOWN          |         SPEEDING UP          |
             +------------------------------+------------------------------+
```

Summary rule:
- **Same signs** ($v$ and $a$ both positive, or both negative) $\implies$ **SPEEDING UP**.
- **Opposite signs** ($v$ positive and $a$ negative, or vice versa) $\implies$ **SLOWING DOWN**.

---

## 9.4 Why Jerk and Snap Matter in the Physical World

According to Newton's Second Law:

$$F_{\text{net}} = m \cdot a$$

If acceleration $a(t)$ changes discontinuously (for example, stepping instantly from $0\text{ m/s}^2$ to $3\text{ m/s}^2$), the force applied to the object must also jump discontinuously.
Differentiating Newton's law with respect to time (assuming constant mass $m$):

$$\frac{dF}{dt} = m \cdot \frac{da}{dt} = m \cdot j(t)$$

The time derivative of force is directly proportional to **jerk**.

### Physiological Impact on Humans
The human vestibular system (the semicircular canals and otoliths in the inner ear) detects acceleration. When acceleration is constant, our muscles can contract to maintain posture. But when acceleration changes rapidly (high jerk), our muscles cannot adjust instantaneously, causing the head to snap backward or forward (whiplash) and provoking acute motion sickness.
- **Passenger Elevators:** International safety codes (ISO 18738) limit passenger elevator jerk to $|j| \le 1.0\text{ to }1.5\text{ m/s}^3$.
- **High-Speed Rail:** Railway transitions use clothoid curves so centrifugal acceleration ramps linearly rather than abruptly.
- **Drone Gimbals and Robotics:** Infinite jerk (step changes in acceleration) causes mechanical shudder, gears to strip, and camera footage to vibrate. High-end motion planners use **S-curve trajectories** that enforce continuous acceleration with bounded snap.

```
       Acceleration Profile                 Jerk Profile (d/dt of a)
       a ^                                  j ^
         |      .-------.                     |   +---+
         |     /         \                    |   |   |
         |    /           \                   |---+   +---+-------+---> t
         |   /             \                  |               |   |
         +--+---------------+---> t           |               +---+
            Ramp-up  Ramp-down                Finite Jerk (Comfortable)
```

---

## 9.5 Ten Progressive Worked Numerical Examples

### Example 9.1: Comprehensive Motion Diagnostic
**Problem:** A robotic test vehicle moves along a straight rail. Its position in meters over time $t \ge 0$ is given by:
$$s(t) = t^3 - 6t^2 + 9t + 4$$
1. Find formulas for velocity $v(t)$, acceleration $a(t)$, and jerk $j(t)$.
2. Determine all times when the vehicle is momentarily at rest.
3. Determine all intervals when the vehicle is moving forward vs backward.
4. Calculate the position, velocity, and acceleration at $t = 4$ seconds.

**Step 1:** Successive differentiation:
$$v(t) = s'(t) = 3t^2 - 12t + 9$$
$$a(t) = v'(t) = 6t - 12$$
$$j(t) = a'(t) = 6\text{ m/s}^3 \quad (\text{constant jerk})$$

**Step 2:** Find when the vehicle is at rest ($v(t) = 0$):
$$3t^2 - 12t + 9 = 0 \implies 3(t^2 - 4t + 3) = 0 \implies 3(t - 1)(t - 3) = 0$$
The vehicle is momentarily at rest at $t = 1\text{ s}$ and $t = 3\text{ s}$.

**Step 3:** Direction of motion:
- For $t \in [0, 1)$: $v(0.5) = 3(0.5 - 1)(0.5 - 3) = 3(-0.5)(-2.5) = +3.75 > 0$ $\implies$ Moving **forward**.
- For $t \in (1, 3)$: $v(2) = 3(2 - 1)(2 - 3) = 3(1)(-1) = -3 < 0$ $\implies$ Moving **backward**.
- For $t \in (3, \infty)$: $v(4) = 3(4 - 1)(4 - 3) = 3(3)(1) = +9 > 0$ $\implies$ Moving **forward**.

**Step 4:** Evaluate state at $t = 4\text{ s}$:
$$s(4) = 4^3 - 6(4^2) + 9(4) + 4 = 64 - 96 + 36 + 4 = 8\text{ m}$$
$$v(4) = 3(4^2) - 12(4) + 9 = 48 - 48 + 9 = 9\text{ m/s}$$
$$a(4) = 6(4) - 12 = 24 - 12 = 12\text{ m/s}^2$$

---

### Example 9.2: Speeding Up vs Slowing Down Interval Analysis
**Problem:** For the robotic vehicle in Example 9.1 ($s(t) = t^3 - 6t^2 + 9t + 4$), determine the exact time intervals when the vehicle is **speeding up** and when it is **slowing down**.

**Step 1:** List the critical zeros of $v(t)$ and $a(t)$:
- $v(t) = 3(t - 1)(t - 3) = 0 \implies t = 1, t = 3$
- $a(t) = 6(t - 2) = 0 \implies t = 2$

These three points divide the time domain $t \ge 0$ into four intervals:
1. $t \in (0, 1)$
2. $t \in (1, 2)$
3. $t \in (2, 3)$
4. $t \in (3, \infty)$

**Step 2:** Test the signs in each interval:

| Interval | Test $t$ | $v(t)$ Sign | $a(t)$ Sign | $v(t) \cdot a(t)$ Product | Motion State |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **$(0, 1)$** | $t = 0.5$ | $v(0.5) > 0$ | $a(0.5) = 6(0.5) - 12 = -9 < 0$ | **Negative** ($-$) | **SLOWING DOWN** |
| **$(1, 2)$** | $t = 1.5$ | $v(1.5) < 0$ | $a(1.5) = 6(1.5) - 12 = -3 < 0$ | **Positive** ($+$) | **SPEEDING UP** |
| **$(2, 3)$** | $t = 2.5$ | $v(2.5) < 0$ | $a(2.5) = 6(2.5) - 12 = +3 > 0$ | **Negative** ($-$) | **SLOWING DOWN** |
| **$(3, \infty)$** | $t = 4.0$ | $v(4) > 0$ | $a(4) = 6(4) - 12 = +12 > 0$ | **Positive** ($+$) | **SPEEDING UP** |

**Conclusion:**
- The vehicle is **speeding up** on $t \in (1, 2) \cup (3, \infty)$.
- The vehicle is **slowing down** on $t \in (0, 1) \cup (2, 3)$.

---

### Example 9.3: Maglev S-Curve Jerk and Snap Limits
**Problem:** A magnetic levitation train starts from rest at $t = 0$ along a trajectory programmed by $s(t) = \frac{1}{20}t^5 - \frac{1}{4}t^4 + \frac{1}{3}t^3$ meters for $0 \le t \le 3$.
1. Compute the jerk $j(t)$ and snap $s_4(t)$.
2. Find the maximum jerk experienced by the passengers during this interval.

**Step 1:** Differentiate successively:
$$v(t) = s'(t) = \frac{5}{20}t^4 - t^3 + t^2 = \frac{1}{4}t^4 - t^3 + t^2$$
$$a(t) = v'(t) = t^3 - 3t^2 + 2t$$
$$j(t) = a'(t) = 3t^2 - 6t + 2$$
$$s_4(t) = j'(t) = 6t - 6$$

**Step 2:** Find the critical points of jerk $j(t)$:
Set $j'(t) = s_4(t) = 0$:
$$6t - 6 = 0 \implies t = 1\text{ s}$$

**Step 3:** Evaluate jerk at the critical point and boundary endpoints ($t = 0, 1, 3$):
- At $t = 0$: $j(0) = 3(0)^2 - 6(0) + 2 = +2.0\text{ m/s}^3$
- At $t = 1$: $j(1) = 3(1)^2 - 6(1) + 2 = 3 - 6 + 2 = -1.0\text{ m/s}^3$
- At $t = 3$: $j(3) = 3(3^2) - 6(3) + 2 = 27 - 18 + 2 = +11.0\text{ m/s}^3$

**Step 4:** Determine maximum jerk magnitude:
The maximum magnitude is $|j(3)| = 11.0\text{ m/s}^3$.

---

### Example 9.4: Sounding Rocket Apogee and Acceleration
**Problem:** A weather research rocket is launched vertically. Its altitude in meters while the booster burns is modeled by:
$$y(t) = 150t + 20t^2 - \frac{1}{3}t^3 \quad (\text{for } 0 \le t \le 30\text{ s})$$
1. Determine its velocity function $v(t)$ and acceleration function $a(t)$.
2. At what instant does the rocket achieve its maximum velocity?
3. What is that maximum velocity?

**Step 1:** Successive derivatives:
$$v(t) = y'(t) = 150 + 40t - t^2$$
$$a(t) = v'(t) = 40 - 2t$$

**Step 2:** Maximum velocity occurs when the rate of change of velocity (acceleration) is zero:
$$a(t) = 0 \implies 40 - 2t = 0 \implies 2t = 40 \implies t = 20\text{ s}$$

**Step 3:** Confirm maximum using the second derivative test:
$$v''(t) = a'(t) = -2 < 0 \implies \text{Concave down (Maximum verified)}$$

**Step 4:** Calculate maximum velocity at $t = 20\text{ s}$:
$$v(20) = 150 + 40(20) - (20)^2 = 150 + 800 - 400 = 550\text{ m/s}$$

**Conclusion:** The rocket achieves its peak velocity of $550\text{ m/s}$ (Mach $1.6$) at $t = 20$ seconds.

---

### Example 9.5: Drone Camera Gimbal Snap Evaluation
**Problem:** A quadcopter drone executes an evasive tilt maneuver with pitch angle $\theta(t) = 2t^5 - 5t^4 + 10$ radians for $t \in [0, 2]$. Calculate the pitch snap $\theta^{(4)}(t)$ at $t = 1.5$ seconds.

**Step 1:** Differentiate four times:
- 1st: $\theta'(t) = 10t^4 - 20t^3$
- 2nd: $\theta''(t) = 40t^3 - 60t^2$
- 3rd: $\theta'''(t) = 120t^2 - 120t$
- 4th (Snap): $\theta^{(4)}(t) = 240t - 120$

**Step 2:** Evaluate at $t = 1.5$ seconds:
$$\theta^{(4)}(1.5) = 240(1.5) - 120 = 360 - 120 = 240\text{ rad/s}^4$$

---

### Example 9.6: Deceleration and Stopping Distance of an Autonomous Haulage Truck
**Problem:** An autonomous mining truck traveling at $v_0 = 30\text{ m/s}$ detects an obstacle and engages continuous emergency braking such that its position from brake onset is:
$$s(t) = 30t - 2.5t^2$$
1. How long does it take for the truck to come to a complete stop?
2. What is the total stopping distance?
3. What is the constant deceleration rate?

**Step 1:** Compute velocity:
$$v(t) = s'(t) = 30 - 5t$$

**Step 2:** The truck comes to a stop when $v(t) = 0$:
$$30 - 5t = 0 \implies 5t = 30 \implies t = 6\text{ seconds}$$

**Step 3:** Compute stopping distance by evaluating $s(6)$:
$$s(6) = 30(6) - 2.5(6^2) = 180 - 2.5(36) = 180 - 90 = 90\text{ meters}$$

**Step 4:** Compute acceleration:
$$a(t) = v'(t) = -5\text{ m/s}^2$$
The truck decelerates at a constant rate of $5\text{ m/s}^2$ ($0.51 g$).

---

### Example 9.7: Higher Derivatives of Harmonic Simple Motion
**Problem:** A vibrating beam sensor measures displacement $x(t) = 4\cos(3t)$ mm. Determine formulas for $v(t), a(t), j(t)$, and express $a(t)$ and $j(t)$ directly in terms of position $x(t)$ and velocity $v(t)$.

**Step 1:** Compute derivatives:
- $v(t) = x'(t) = 4(-\sin(3t) \cdot 3) = -12\sin(3t)$
- $a(t) = v'(t) = -12(\cos(3t) \cdot 3) = -36\cos(3t)$
- $j(t) = a'(t) = -36(-\sin(3t) \cdot 3) = +108\sin(3t)$

**Step 2:** Express in terms of $x(t)$ and $v(t)$:
Notice that $a(t) = -36\cos(3t) = -9 \cdot [4\cos(3t)] = -9 x(t) = -\omega^2 x(t)$ (with $\omega = 3$).
Notice that $j(t) = 108\sin(3t) = -9 \cdot [-12\sin(3t)] = -9 v(t) = -\omega^2 v(t)$.

**Conclusion:** For harmonic motion of frequency $\omega$, acceleration is $-\omega^2 \cdot \text{position}$, and jerk is $-\omega^2 \cdot \text{velocity}$!

---

### Example 9.8: Reversing Direction and Turning Points
**Problem:** A particle moves along a straight coordinate axis with $s(t) = \frac{1}{3}t^3 - 4t^2 + 12t$ meters for $t \ge 0$.
1. Find all instants when the particle changes its direction of motion.
2. Find the positions of these turning points.

**Step 1:** Direction changes occur when velocity $v(t)$ passes through zero and changes sign.
$$v(t) = s'(t) = t^2 - 8t + 12 = (t - 2)(t - 6)$$

**Step 2:** Set $v(t) = 0 \implies t = 2\text{ s}$ and $t = 6\text{ s}$.

**Step 3:** Verify sign changes:
- For $t < 2$: $(t-2)(t-6) = (-)(-) = + \implies v > 0$ (Moving right)
- For $2 < t < 6$: $(+)(-) = - \implies v < 0$ (Moving left)
- For $t > 6$: $(+)(+) = + \implies v > 0$ (Moving right)
Both $t = 2$ and $t = 6$ are genuine turning points where direction reverses!

**Step 4:** Evaluate positions:
- At $t = 2$: $s(2) = \frac{1}{3}(8) - 4(4) + 12(2) = \frac{8}{3} - 16 + 24 = \frac{8}{3} + 8 = \frac{32}{3} \approx 10.67\text{ m}$.
- At $t = 6$: $s(6) = \frac{1}{3}(216) - 4(36) + 12(6) = 72 - 144 + 72 = 0\text{ m}$.

---

### Example 9.9: High-Speed Passenger Elevator Safety Verification
**Problem:** A skyscraper elevator ascends from ground level to the observation deck according to the velocity profile:
$$v(t) = \begin{cases} 0.5t^2, & 0 \le t \le 2 \\ 2.0, & 2 < t \le 18 \\ 2.0 - 0.25(t - 18)^2, & 18 < t \le 20 \end{cases}$$
in meters per second. Calculate the jerk at $t = 1.0\text{ s}$ and verify whether it exceeds the comfort limit of $1.5\text{ m/s}^3$.

**Step 1:** In the launch phase ($0 \le t \le 2$), $v(t) = 0.5t^2$.
**Step 2:** Acceleration:
$$a(t) = v'(t) = \frac{d}{dt}[0.5t^2] = 1.0t\text{ m/s}^2$$
**Step 3:** Jerk:
$$j(t) = a'(t) = \frac{d}{dt}[1.0t] = 1.0\text{ m/s}^3$$
**Step 4:** Verify safety threshold:
At $t = 1.0\text{ s}$, $j(1.0) = 1.0\text{ m/s}^3$.
Since $1.0\text{ m/s}^3 \le 1.5\text{ m/s}^3$, the motion is well within passenger comfort standards.

---

### Example 9.10: 2D Parametric Vector Kinematics
**Problem:** In a 2D physics simulation, a drone's horizontal and vertical coordinates evolve as:
$$\vec{r}(t) = \langle x(t), y(t) \rangle = \langle 3t^2 - 4t, \ 2t^3 - 6t \rangle\text{ meters}$$
1. Find the velocity vector $\vec{v}(t)$ and acceleration vector $\vec{a}(t)$ at $t = 2$ seconds.
2. Calculate the scalar speed $|\vec{v}(2)|$ at $t = 2$ seconds.

**Step 1:** Differentiate each component independently with respect to time:
$$\vec{v}(t) = \langle x'(t), y'(t) \rangle = \langle 6t - 4, \ 6t^2 - 6 \rangle$$
$$\vec{a}(t) = \langle x''(t), y''(t) \rangle = \langle 6, \ 12t \rangle$$

**Step 2:** Evaluate at $t = 2\text{ s}$:
$$\vec{v}(2) = \langle 6(2) - 4, \ 6(2^2) - 6 \rangle = \langle 12 - 4, \ 24 - 6 \rangle = \langle 8, 18 \rangle\text{ m/s}$$
$$\vec{a}(2) = \langle 6, \ 12(2) \rangle = \langle 6, 24 \rangle\text{ m/s}^2$$

**Step 3:** Compute scalar speed $|\vec{v}(2)|$ using the Pythagorean theorem:
$$|\vec{v}(2)| = \sqrt{v_x^2 + v_y^2} = \sqrt{8^2 + 18^2} = \sqrt{64 + 324} = \sqrt{388} \approx 19.70\text{ m/s}$$

**Conclusion:** At $t = 2\text{ s}$, the drone travels with a scalar speed of $19.70\text{ m/s}$ along vector direction $\langle 8, 18 \rangle\text{ m/s}$.

---

## 9.6 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Polynomial Derivatives of Motion
- **Exercise 9.1:** A particle's position is $s(t) = 4t^3 - 9t^2 + 6t - 15$. Find expressions for $v(t)$, $a(t)$, and $j(t)$.
- **Exercise 9.2:** For the particle in Exercise 9.1, find the velocity and acceleration at $t = 2$ seconds.

### Tier 2: Stationary Points and Turning Analysis
- **Exercise 9.3:** A drone moves along a line with position $s(t) = 2t^3 - 24t + 10$ meters ($t \ge 0$). Find when the drone stops and its position at that moment.
- **Exercise 9.4:** Determine whether the drone in Exercise 9.3 is speeding up or slowing down at $t = 1$ second.

### Tier 3: Rocket and Gravitational Flight
- **Exercise 9.5:** A flare is fired upward from a cliff: $h(t) = -4.9t^2 + 98t + 100$ meters. Find the maximum height reached and the time it takes to reach it.
- **Exercise 9.6:** For the flare in Exercise 9.5, calculate its impact velocity when it hits the water at ground level ($h = 0$).

### Tier 4: Higher-Order Derivative Diagnostics
- **Exercise 9.7:** Given $s(t) = \frac{1}{6}t^6 - \frac{1}{2}t^4$, compute the snap $s^{(4)}(t)$ at $t = 2$ seconds.
- **Exercise 9.8:** A robotic arm moves with angle $\theta(t) = 5\sin(4t)$ radians. Find the maximum angular jerk $|j_{\text{max}}|$.

### Tier 5: 2D Parametric Simulator Kinematics
- **Exercise 9.9:** A particle in a 2D physics engine follows $\vec{r}(t) = \langle 4\cos(2t), \ 4\sin(2t) \rangle$. Show that the acceleration vector $\vec{a}(t)$ is always pointing directly toward the origin and compute the constant scalar speed.
- **Exercise 9.10:** A high-speed train stops with position $s(t) = 60t - 2t^2 - \frac{1}{6}t^3$ for $t \ge 0$. Find the instant $t$ when the train comes to rest and evaluate whether jerk is non-zero at that moment.

---

## 9.7 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 9.1
For $s(t) = 4t^3 - 9t^2 + 6t - 15$:
1. $v(t) = s'(t) = 12t^2 - 18t + 6$.
2. $a(t) = v'(t) = 24t - 18$.
3. $j(t) = a'(t) = 24$.
**Final Answer:** $v(t) = 12t^2 - 18t + 6$, $a(t) = 24t - 18$, $j(t) = 24\text{ m/s}^3$.

---

### Solution to Exercise 9.2
Evaluate state at $t = 2$:
1. $v(2) = 12(2^2) - 18(2) + 6 = 12(4) - 36 + 6 = 48 - 36 + 6 = 18\text{ m/s}$.
2. $a(2) = 24(2) - 18 = 48 - 18 = 30\text{ m/s}^2$.
**Final Answer:** $v(2) = 18\text{ m/s}$, $a(2) = 30\text{ m/s}^2$.

---

### Solution to Exercise 9.3
For $s(t) = 2t^3 - 24t + 10$ ($t \ge 0$):
1. $v(t) = s'(t) = 6t^2 - 24$.
2. Set $v(t) = 0 \implies 6t^2 = 24 \implies t^2 = 4 \implies t = 2\text{ s}$ (since $t \ge 0$).
3. Position at $t = 2$:
$$s(2) = 2(2^3) - 24(2) + 10 = 2(8) - 48 + 10 = 16 - 48 + 10 = -22\text{ m}$$
**Final Answer:** Stops at $t = 2$ seconds at position $s = -22$ meters.

---

### Solution to Exercise 9.4
Test speeding up vs slowing down at $t = 1$:
1. $v(1) = 6(1^2) - 24 = 6 - 24 = -18\text{ m/s}$ ($v < 0$, moving backward).
2. $a(t) = 12t \implies a(1) = 12(1) = +12\text{ m/s}^2$ ($a > 0$).
3. $v(1) \cdot a(1) = (-18)(+12) = -216 < 0$.
Because signs are opposite, the drone is slowing down.
**Final Answer:** Slowing down.

---

### Solution to Exercise 9.5
For $h(t) = -4.9t^2 + 98t + 100$:
1. $v(t) = h'(t) = -9.8t + 98$.
2. Maximum height occurs when $v(t) = 0$:
$$-9.8t + 98 = 0 \implies 9.8t = 98 \implies t = 10\text{ seconds}$$
3. Maximum height:
$$h(10) = -4.9(10^2) + 98(10) + 100 = -490 + 980 + 100 = 590\text{ meters}$$
**Final Answer:** Maximum height is $590$ meters at $t = 10$ seconds.

---

### Solution to Exercise 9.6
Find impact velocity at $h = 0$:
1. Solve $-4.9t^2 + 98t + 100 = 0 \implies 4.9t^2 - 98t - 100 = 0$.
Using quadratic formula:
$$t = \frac{98 \pm \sqrt{(-98)^2 - 4(4.9)(-100)}}{2(4.9)} = \frac{98 \pm \sqrt{9604 + 1960}}{9.8} = \frac{98 \pm \sqrt{11564}}{9.8}$$
$$\sqrt{11564} \approx 107.536 \implies t = \frac{98 + 107.536}{9.8} = \frac{205.536}{9.8} \approx 20.973\text{ s}$$
2. Evaluate velocity at $t \approx 20.973$:
$$v(20.973) = -9.8(20.973) + 98 \approx -205.536 + 98 = -107.54\text{ m/s}$$
**Final Answer:** Impact velocity is $\approx -107.54\text{ m/s}$ (speed of $\approx 107.54\text{ m/s}$ downward).

---

### Solution to Exercise 9.7
For $s(t) = \frac{1}{6}t^6 - \frac{1}{2}t^4$:
- $s'(t) = t^5 - 2t^3$
- $s''(t) = 5t^4 - 6t^2$
- $s'''(t) = 20t^3 - 12t$
- $s^{(4)}(t) = 60t^2 - 12$
Evaluate at $t = 2$:
$$s^{(4)}(2) = 60(2^2) - 12 = 60(4) - 12 = 240 - 12 = 228\text{ m/s}^4$$
**Final Answer:** $228\text{ m/s}^4$.

---

### Solution to Exercise 9.8
For $\theta(t) = 5\sin(4t)$:
1. $\omega(t) = \theta'(t) = 5(4\cos(4t)) = 20\cos(4t)$.
2. $\alpha(t) = \theta''(t) = 20(-4\sin(4t)) = -80\sin(4t)$.
3. $j(t) = \theta'''(t) = -80(4\cos(4t)) = -320\cos(4t)$.
4. The maximum magnitude of cosine is $1$, so $|j_{\text{max}}| = 320\text{ rad/s}^3$.
**Final Answer:** $320\text{ rad/s}^3$.

---

### Solution to Exercise 9.9
For $\vec{r}(t) = \langle 4\cos(2t), 4\sin(2t) \rangle$:
1. Velocity:
$$\vec{v}(t) = \langle -8\sin(2t), 8\cos(2t) \rangle$$
2. Scalar speed:
$$|\vec{v}(t)| = \sqrt{(-8\sin(2t))^2 + (8\cos(2t))^2} = \sqrt{64\sin^2(2t) + 64\cos^2(2t)} = \sqrt{64(1)} = 8\text{ m/s} \quad (\text{Constant!})$$
3. Acceleration:
$$\vec{a}(t) = \langle -16\cos(2t), -16\sin(2t) \rangle = -4 \cdot \langle 4\cos(2t), 4\sin(2t) \rangle = -4 \vec{r}(t)$$
Because $\vec{a}(t) = -4\vec{r}(t)$, the acceleration is directed strictly toward the origin with magnitude $|\vec{a}| = 16\text{ m/s}^2 = \frac{v^2}{r} = \frac{8^2}{4} = \frac{64}{4} = 16$. $\blacksquare$
**Final Answer:** Acceleration is centripetal ($\vec{a}(t) = -4\vec{r}(t)$), and speed is constant at $8\text{ m/s}$.

---

### Solution to Exercise 9.10
For $s(t) = 60t - 2t^2 - \frac{1}{6}t^3$:
1. $v(t) = 60 - 4t - \frac{1}{2}t^2$.
2. Set $v(t) = 0 \implies \frac{1}{2}t^2 + 4t - 60 = 0 \implies t^2 + 8t - 120 = 0$.
3. Factor: $(t + 20)(t - 6) = 0 \implies t = 6\text{ seconds}$ (since $t \ge 0$).
4. Compute jerk $j(t)$:
- $a(t) = v'(t) = -4 - t$
- $j(t) = a'(t) = -1\text{ m/s}^3$
At $t = 6\text{ s}$, $j(6) = -1\text{ m/s}^3 \neq 0$.
**Final Answer:** Train stops at $t = 6$ seconds; jerk is non-zero ($j = -1\text{ m/s}^3$).
