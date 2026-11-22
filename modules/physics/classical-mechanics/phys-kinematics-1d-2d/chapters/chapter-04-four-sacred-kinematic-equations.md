# Chapter 4: The Four Sacred Kinematic Equations (Constant Acceleration)

> *"In the vast, turbulent complexity of the universe, there exists a special sanctuary of mathematical perfection: motion under constant acceleration. When acceleration remains rock-steady, the sprawling machinery of calculus crystallizes into four algebraic equations of immense predictive power — enabling us to target lunar landers, design aircraft carrier catapults, and engineer highway safety zones with absolute precision."*

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
       v_0 -+-----------*.-'        |                 = Displacement Δx
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
