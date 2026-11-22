# Chapter 5: Free Fall and Gravitational Acceleration — Galileo's Revolution

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
