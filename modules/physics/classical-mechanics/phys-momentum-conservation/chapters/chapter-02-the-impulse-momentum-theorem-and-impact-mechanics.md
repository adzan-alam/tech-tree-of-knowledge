# Chapter 02: The Impulse-Momentum Theorem & Impact Mechanics — Force-Time Integrals, Peak Loads, and Crash Attenuation

> *"Force is what occurs in the infinitesimal instant; impulse is the accumulated legacy of force operating across the passage of time. To survive an impact is not to eliminate momentum, but to stretch time so that the merciless peak of force is flattened into endurance."*

---

## 2.1 The Microsecond Anatomy of an Impact

Consider a tennis ball striking a concrete wall at $35\,\text{m/s}$ ($126\,\text{km/h}$). To human eyesight, the rebound appears instantaneous: the yellow sphere touches the surface and bounces away in a single imperceptible flicker.

Yet if we observe this collision with a ultra-high-speed stroboscopic camera operating at $100,000$ frames per second, the illusion of instantaneousness evaporates. An impact is revealed as a complex, continuous thermodynamic and elastodynamic process spanning several milliseconds:
1. **$t = 0.0\,\text{ms}$ (Initial Touchdown):** The outer fuzz of the ball makes initial geometric contact with the rigid wall. Velocity is still $35\,\text{m/s}$ toward the wall; contact force is zero.
2. **$t = 0.0 - 2.5\,\text{ms}$ (Compression Phase):** The hollow rubber shell flattens against the wall like a squashed hemisphere. The internal air pressure spikes. As the rubber deforms, it exerts an escalating electrostatic normal repulsion against the wall. The wall exerts an equal and opposite normal force on the ball, decelerating its center of mass.
3. **$t = 2.5\,\text{ms}$ (Maximum Deformation / Turning Point):** The center-of-mass velocity drops momentarily to zero ($v = 0$). Deformation reaches its maximum; stored elastic potential energy peaks; the contact force achieves a staggering maximum **peak force** $F_{\max} > 1500\,\text{N}$!
4. **$t = 2.5 - 5.0\,\text{ms}$ (Restitution Phase):** The compressed rubber shell snaps back toward its spherical resting shape, pushing against the wall and accelerating the center of mass away from the surface.
5. **$t = 5.0\,\text{ms}$ (Separation):** The ball leaves the wall with rebound velocity $-30\,\text{m/s}$. The collision is over. Total elapsed time: $\Delta t = 5.0\,\text{ms} = 0.0050\,\text{s}$.

```
      Contact Force F(t) [N]
          ^
   F_max -+               Peak Force (Maximum Deformation)
          |                     *
          |                    / \
          |                   /   \
          |                  /     \      Area under curve = Impulse J = Δp
          |                 /       \
   F_avg -+ - - - - - - - -+---------+ - - - - - Time-Averaged Force
          |               /|         |\
          |              / |         | \
        0 +-------------+--+---------+--+------------------------> Time t [ms]
                        0     2.5       5.0 (Total Duration Δt)
```

How do we relate the fluctuating, highly non-linear force profile $F(t)$ over this $5\,\text{ms}$ window to the macroscopic change in the ball’s motion? The answer is the **Impulse-Momentum Theorem**.

---

## 2.2 Mathematical Derivation of the Impulse-Momentum Theorem

We begin with Newton’s Second Law in momentum derivative form:

$$\vec{F}_{\text{net}}(t) = \frac{d\vec{p}}{dt}$$

Multiply both sides by the differential time element $dt$:

$$\vec{F}_{\text{net}}(t) \, dt = d\vec{p}$$

Now integrate both sides over a finite time interval spanning from initial time $t_1$ to final time $t_2$:

$$\int_{t_1}^{t_2} \vec{F}_{\text{net}}(t) \, dt = \int_{\vec{p}(t_1)}^{\vec{p}(t_2)} d\vec{p}$$

The integral on the left-hand side is formally defined as the **Linear Impulse** $\vec{J}$ (or $\vec{I}$) delivered by the net force:

$$\vec{J} \equiv \int_{t_1}^{t_2} \vec{F}_{\text{net}}(t) \, dt$$

The integral on the right-hand side evaluates by the Fundamental Theorem of Calculus:

$$\int_{\vec{p}(t_1)}^{\vec{p}(t_2)} d\vec{p} = \vec{p}(t_2) - \vec{p}(t_1) = \Delta\vec{p}$$

Equating both sides yields the sacred **Impulse-Momentum Theorem**:

$$\vec{J} = \Delta\vec{p} = m\vec{v}_2 - m\vec{v}_1$$

### Geometric Interpretation: Area Under the Force-Time Curve
In a one-dimensional system, impulse is the exact **definite integral** of the force function with respect to time:

$$J = \int_{t_1}^{t_2} F(t) \, dt = \text{Area under the } F(t) \text{ curve between } t_1 \text{ and } t_2$$

No matter how erratic, jagged, or non-linear the force profile $F(t)$ may be, the total area enclosed between the curve and the time axis is identically equal to the net change in momentum $\Delta p$.

---

## 2.3 The Time-Averaged Force and Geometric Waveforms

In many physical impacts, measuring the microsecond instantaneous force curve $F(t)$ requires piezoelectric load cells and laser Doppler vibrometry. For engineering analysis, we often define the **Time-Averaged Force** $\vec{F}_{\text{avg}}$:

$$\vec{F}_{\text{avg}} \equiv \frac{1}{\Delta t} \int_{t_1}^{t_2} \vec{F}(t) \, dt = \frac{\vec{J}}{\Delta t} = \frac{\Delta\vec{p}}{\Delta t}$$

where $\Delta t = t_2 - t_1$.

The time-averaged force represents the constant, uniform rectangular force that, if exerted over the same time duration $\Delta t$, would deliver the exact same total impulse $\vec{J}$ and produce the exact same change in momentum $\Delta\vec{p}$:

$$\vec{J} = \vec{F}_{\text{avg}} \Delta t$$

```
   (A) Triangular Profile              (B) Half-Sine Profile               (C) Rectangular Equivalent
          ^                                   ^                                   ^
   F_max -+         *                  F_max -+       .---.                F_avg -+---------------+
          |        / \                        |     .'     '.                     |               |
          |       /   \                       |    /         \                    |               |
          |      /     \                      |   /           \                   |               |
        0 +-----+-------+-----> t           0 +--+-------------+---> t          0 +---------------+-----> t
          0        Δt                         0        Δt                         0        Δt
      F_max = 2 * F_avg                   F_max = (π/2) * F_avg                  Area = F_avg * Δt
```

### Relating Peak Force ($F_{\max}$) to Average Force ($F_{\text{avg}}$)
Real physical impacts never exert a flat rectangular force; they ramp up to a pronounced maximum $F_{\max}$ and decay back to zero. The ratio of peak force to average force depends on the collision profile:

1. **Triangular Waveform (Linear Elastic Compression & Restitution):**
   $$J = \text{Area} = \frac{1}{2} F_{\max} \Delta t$$
   Equating to $J = F_{\text{avg}} \Delta t$:
   $$\frac{1}{2} F_{\max} \Delta t = F_{\text{avg}} \Delta t \implies F_{\max} = 2 F_{\text{avg}}$$
   The maximum peak force is **twice** the time-averaged force!

2. **Half-Sine Waveform (Hertzian Contact Mechanics):**
   $$F(t) = F_{\max} \sin\left(\frac{\pi t}{\Delta t}\right), \quad 0 \le t \le \Delta t$$
   $$J = \int_0^{\Delta t} F_{\max} \sin\left(\frac{\pi t}{\Delta t}\right) dt = F_{\max} \left[ -\frac{\Delta t}{\pi} \cos\left(\frac{\pi t}{\Delta t}\right) \right]_0^{\Delta t} = F_{\max} \frac{\Delta t}{\pi} (1 - (-1)) = \frac{2}{\pi} F_{\max} \Delta t$$
   Equating to $F_{\text{avg}} \Delta t$:
   $$\frac{2}{\pi} F_{\max} = F_{\text{avg}} \implies F_{\max} = \frac{\pi}{2} F_{\text{avg}} \approx 1.5708 F_{\text{avg}}$$
   The peak force is approximately **$57\%$ higher** than the time-averaged force.

---

## 2.4 The Mechanics of Survival: Impact Attenuation Engineering

The Impulse-Momentum Theorem encapsulates the foundational equation of crash safety, athletic protection, and packaging engineering:

$$\vec{F}_{\text{avg}} = \frac{\Delta\vec{p}}{\Delta t}$$

Consider an automobile of mass $m = 1500\,\text{kg}$ traveling at $v_0 = 25.0\,\text{m/s}$ ($90.0\,\text{km/h}$) that collides head-on with an immovable reinforced concrete bridge abutment. In every scenario, the car and its occupants must be brought to rest ($v_f = 0$):

$$\Delta p = m(0 - v_0) = (1500\,\text{kg})(-25.0\,\text{m/s}) = -37,500\,\text{kg}\cdot\text{m/s}$$

The required change in momentum $\Delta p$ is **absolutely fixed by the laws of physics**. Nature demands an impulse of $-37,500\,\text{N}\cdot\text{s}$. However, human engineering has absolute freedom over how that impulse is distributed across time!

```
Case A: Unbelted Passenger striking rigid steel dashboard
   Impact Duration: Δt = 0.005 s (5 ms)
   F_avg = 37,500 / 0.005 = 7,500,000 N (7.5 MegaNewtons!)
   Deceleration = 5,000 m/s^2 ≈ 510 g  --> Instantaneous Fatal Crush

Case B: Modern Crumple Zone + Pre-tensioned Seatbelt + Expanding Airbag
   Impact Duration: Δt = 0.120 s (120 ms)
   F_avg = 37,500 / 0.120 = 312,500 N (Across entire vehicle chassis)
   Deceleration on occupant = 208 m/s^2 ≈ 21 g  --> Fully Survivable!
```

### The Life-Saving Multiplier: Extending $\Delta t$
By elongating the collision duration from $5\,\text{milliseconds}$ to $120\,\text{milliseconds}$ (a factor of 24), the average force exerted on the vehicle structure and passenger anatomy is **slashed by $95.8\%$**!

The same universal principle governs:
- **Airbags:** Deflate progressively through calibrated exhaust vents as the passenger's chest strikes them, absorbing work over $80-100\,\text{ms}$ rather than the $5\,\text{ms}$ of a bare steering wheel.
- **Boxing Gloves:** The foam padding compresses over $15\,\text{ms}$, whereas bare knuckles deliver impact over $< 2\,\text{ms}$, reducing peak skull deceleration by a factor of 8.
- **Bungee Cords:** Stretches over several seconds, ensuring the jumper experiences gentle decelerations of $1.5-2.0\,g$ rather than snapping a rigid hemp rope.
- **Gymnastics Crash Mats:** Low-density polyurethane foam displaces air slowly through porous open cells, extending landing duration $\Delta t$.

---

## 2.5 The Impulsive Approximation: Dominance Over Non-Impulsive Fields

In many mechanical interactions—such as a bat striking a baseball, an explosive artillery shell fragmenting, or two billiard balls colliding—the collision duration $\Delta t$ is extremely brief ($\Delta t \sim 10^{-4}$ to $10^{-3}\,\text{s}$).

During this brief window, external non-impulsive forces (such as Earth's gravitational pull $\vec{F}_g = m\vec{g}$ or surface Coulomb friction $\vec{f} = \mu N$) continue to act on the bodies. However, let us evaluate the impulse delivered by gravity during the collision:

$$\vec{J}_{\text{gravity}} = \int_0^{\Delta t} m\vec{g} \, dt = m\vec{g} \Delta t$$

If $m = 0.145\,\text{kg}$ and $\Delta t = 0.0007\,\text{s}$ ($0.7\,\text{ms}$):

$$J_{\text{gravity}} = (0.145\,\text{kg})(9.81\,\text{m/s}^2)(0.0007\,\text{s}) \approx 0.0010\,\text{N}\cdot\text{s}$$

Meanwhile, the contact force between the baseball bat and the ball reaches peak forces exceeding $20,000\,\text{N}$, delivering an impact impulse:

$$J_{\text{contact}} = \Delta p \approx (0.145\,\text{kg})(40\,\text{m/s} - (-40\,\text{m/s})) = 11.6\,\text{N}\cdot\text{s}$$

Comparing the two impulses:

$$\frac{J_{\text{contact}}}{J_{\text{gravity}}} = \frac{11.6}{0.0010} \approx 11,600$$

The contact impulse is over **ten thousand times larger** than the gravitational impulse!

**The Impulsive Approximation Rule:**
> *During the microsecond duration of a collision or blast ($\Delta t \to 0$), all finite non-impulsive external forces (gravity, aerodynamic drag, sliding friction) may be completely neglected. Linear momentum is conserved with near-perfect precision across the collision interface.*

---

## 2.6 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 2.1: Baseball Bat Impact Dynamics
**Problem:** A baseball of mass $m = 0.145\,\text{kg}$ approaches home plate horizontally with velocity $\vec{v}_1 = -42.0\,\hat{i}\,\text{m/s}$. A batter strikes the ball, sending it straight back toward the pitcher at $\vec{v}_2 = +50.0\,\hat{i}\,\text{m/s}$. High-speed optical tracking indicates the bat-ball contact lasts $\Delta t = 0.800\,\text{ms} = 8.00 \times 10^{-4}\,\text{s}$.
1. Compute the change in momentum $\Delta\vec{p}$ of the baseball.
2. Calculate the horizontal impulse $\vec{J}$ delivered by the bat.
3. Determine the time-averaged contact force $F_{\text{avg}}$.
4. Assuming a triangular contact force profile, calculate the peak contact force $F_{\max}$.

**Solution:**
- **Step 1: Change in momentum**
  $$\Delta\vec{p} = m(\vec{v}_2 - \vec{v}_1) = (0.145\,\text{kg})\left[ +50.0\,\hat{i} - (-42.0\,\hat{i})\,\text{m/s} \right]$$
  $$\Delta\vec{p} = (0.145\,\text{kg})(+92.0\,\hat{i}\,\text{m/s}) = +13.34\,\hat{i}\,\text{kg}\cdot\text{m/s}$$

- **Step 2: Impulse**
  $$\vec{J} = \Delta\vec{p} = +13.34\,\hat{i}\,\text{N}\cdot\text{s}$$

- **Step 3: Time-averaged contact force**
  $$F_{\text{avg}} = \frac{J}{\Delta t} = \frac{13.34\,\text{N}\cdot\text{s}}{8.00 \times 10^{-4}\,\text{s}} = 16,675\,\text{N} \approx 16.68\,\text{kN}$$
  In imperial units: $16.68\,\text{kN} \approx 3750\,\text{lbf}$ (nearly two tons of force!).

- **Step 4: Peak contact force for triangular profile**
  $$F_{\max} = 2 F_{\text{avg}} = 2(16,675\,\text{N}) = 33,350\,\text{N} \approx 33.35\,\text{kN}$$

---

### Example 2.2: Time-Dependent Half-Sine Force Pulse
**Problem:** A mechanical forging hammer delivers a vertical compressive force pulse to an aluminum billet described by a half-sine wave:
$$F(t) = F_{\max} \sin\left(\frac{\pi t}{\tau}\right), \quad 0 \le t \le \tau$$
with peak force $F_{\max} = 250,000\,\text{N}$ ($250\,\text{kN}$) and pulse duration $\tau = 0.0120\,\text{s}$ ($12.0\,\text{ms}$).
1. Calculate the total impulse $J$ delivered to the billet.
2. Determine the time-averaged force $F_{\text{avg}}$.
3. If the forging hammer head has mass $m = 400.0\,\text{kg}$ and was initially moving downward at $v_0 = 8.50\,\text{m/s}$, find its velocity $v_f$ immediately after the strike.

**Solution:**
- **Step 1: Total impulse calculation**
  $$J = \int_0^\tau F(t) \, dt = \frac{2}{\pi} F_{\max} \tau = \frac{2}{\pi}(250,000\,\text{N})(0.0120\,\text{s}) = \frac{2}{\pi}(3000.0) = \frac{6000.0}{\pi} = 1909.86\,\text{N}\cdot\text{s}$$

- **Step 2: Time-averaged force**
  $$F_{\text{avg}} = \frac{J}{\tau} = \frac{1909.86\,\text{N}\cdot\text{s}}{0.0120\,\text{s}} = 159,155\,\text{N} \approx 159.2\,\text{kN}$$
  *Check:* $F_{\max} / F_{\text{avg}} = 250,000 / 159,155 = 1.5708 = \pi/2$. Verified.

- **Step 3: Hammer rebound velocity**
  Taking downward as positive ($v_0 = +8.50\,\text{m/s}$):
  The upward normal force from the billet exerts an upward impulse ($J = -1909.86\,\text{N}\cdot\text{s}$).
  $$J = m(v_f - v_0) \implies v_f = v_0 + \frac{J}{m} = +8.50\,\text{m/s} + \frac{-1909.86\,\text{N}\cdot\text{s}}{400.0\,\text{kg}}$$
  $$v_f = 8.50 - 4.7747 = +3.725\,\text{m/s}$$
  The hammer slows to $3.73\,\text{m/s}$ downward (or if $J > m v_0$, it would rebound upward).

---

### Example 2.3: Automotive Crumple Zone Optimization
**Problem:** A crash-test dummy of mass $m = 75.0\,\text{kg}$ is strapped into a vehicle traveling at $v_0 = 16.67\,\text{m/s}$ ($60.0\,\text{km/h}$).
1. **Unprotected Crash:** If the vehicle is an unyielding rigid frame with zero crumpling, the dummy stops against the dashboard over distance $d_1 = 0.0400\,\text{m}$ ($4.0\,\text{cm}$). Compute the stopping time $\Delta t_1$, average deceleration $a_1$, and average force $F_1$.
2. **Crumple Zone + Airbag:** With an engineered crumple zone of $d_2 = 0.750\,\text{m}$ and an airbag, compute the new stopping time $\Delta t_2$, average deceleration $a_2$ (in g's), and average force $F_2$.

**Solution:**
- **Step 1: Unprotected rigid crash ($d_1 = 0.0400\,\text{m}$)**
  Assuming uniform deceleration:
  $$v^2 = v_0^2 + 2 a_1 d_1 = 0 \implies a_1 = -\frac{v_0^2}{2 d_1} = -\frac{(16.67\,\text{m/s})^2}{2(0.0400\,\text{m})} = -\frac{277.89}{0.0800} = -3473.6\,\text{m/s}^2$$
  In g's:
  $$\text{g's} = \frac{3473.6}{9.81} \approx 354\,g \quad (\text{instantly fatal})$$
  Stopping time:
  $$\Delta t_1 = \frac{2 d_1}{v_0} = \frac{2(0.0400)}{16.67} = 0.00480\,\text{s} = 4.80\,\text{ms}$$
  Average force:
  $$F_1 = m |a_1| = (75.0\,\text{kg})(3473.6\,\text{m/s}^2) = 260,520\,\text{N} \approx 260.5\,\text{kN}$$

- **Step 2: Protected crash ($d_2 = 0.750\,\text{m}$)**
  $$a_2 = -\frac{v_0^2}{2 d_2} = -\frac{277.89}{2(0.750)} = -\frac{277.89}{1.500} = -185.26\,\text{m/s}^2$$
  In g's:
  $$\text{g's} = \frac{185.26}{9.81} \approx 18.89\,g \quad (\text{humanly survivable})$$
  Stopping time:
  $$\Delta t_2 = \frac{2 d_2}{v_0} = \frac{2(0.750)}{16.67} = 0.0900\,\text{s} = 90.0\,\text{ms}$$
  Average force:
  $$F_2 = m |a_2| = (75.0\,\text{kg})(185.26\,\text{m/s}^2) = 13,895\,\text{N} \approx 13.90\,\text{kN}$$
  *Comparison:* Crumpling reduces the impact load by a factor of $\frac{260.5}{13.9} = \mathbf{18.75}$!

---

### Example 2.4: 2D Oblique Rebound from a Smooth Wall
**Problem:** A soccer ball of mass $m = 0.430\,\text{kg}$ strikes a vertical wall at incident angle $\theta_1 = 35.0^\circ$ to the normal with speed $v_1 = 22.0\,\text{m/s}$. It rebounds elastically with identical speed $v_2 = 22.0\,\text{m/s}$ at reflection angle $\theta_2 = 35.0^\circ$. The contact lasts $\Delta t = 0.0140\,\text{s}$.
1. Set up coordinate axes and write the initial and final velocity vectors.
2. Compute the vector components of impulse $\vec{J} = (J_x, J_y)$.
3. Calculate the magnitude and direction of the average contact force $\vec{F}_{\text{avg}}$.

**Solution:**
- **Step 1: Coordinate setup**
  Let the wall lie along the $y$-axis (surface normal pointing into $+x$).
  - Initial velocity (moving toward wall, into $-x$ and $+y$):
    $$v_{1x} = -v_1 \cos\theta_1 = -22.0 \cos(35.0^\circ) = -22.0(0.81915) = -18.021\,\text{m/s}$$
    $$v_{1y} = +v_1 \sin\theta_1 = +22.0 \sin(35.0^\circ) = +22.0(0.57358) = +12.619\,\text{m/s}$$
    $$\vec{v}_1 = -18.021\,\hat{i} + 12.619\,\hat{j}\,\text{m/s}$$
  - Final velocity (rebounding away from wall, into $+x$ and $+y$):
    $$v_{2x} = +v_2 \cos\theta_2 = +18.021\,\text{m/s}$$
    $$v_{2y} = +v_2 \sin\theta_2 = +12.619\,\text{m/s}$$
    $$\vec{v}_2 = +18.021\,\hat{i} + 12.619\,\hat{j}\,\text{m/s}$$

- **Step 2: Vector impulse**
  $$\Delta v_x = v_{2x} - v_{1x} = +18.021 - (-18.021) = +36.042\,\text{m/s}$$
  $$\Delta v_y = v_{2y} - v_{1y} = +12.619 - (+12.619) = 0.0\,\text{m/s}$$
  $$J_x = m \Delta v_x = (0.430\,\text{kg})(+36.042\,\text{m/s}) = +15.498\,\text{N}\cdot\text{s}$$
  $$J_y = m \Delta v_y = 0.0\,\text{N}\cdot\text{s}$$
  $$\vec{J} = +15.50\,\hat{i}\,\text{N}\cdot\text{s}$$
  *Physical Insight:* Because the wall is frictionless, tangential momentum is strictly conserved ($J_y = 0$). All impulse acts purely normal to the wall.

- **Step 3: Average force**
  $$\vec{F}_{\text{avg}} = \frac{\vec{J}}{\Delta t} = \frac{+15.498\,\hat{i}\,\text{N}\cdot\text{s}}{0.0140\,\text{s}} = +1107.0\,\hat{i}\,\text{N}$$
  The wall exerts a normal outward force of $1.11\,\text{kN}$.

---

### Example 2.5: Water Jet Cleansing and Continuous Impulse
**Problem:** A high-pressure industrial hydro-demolition washer blasts a continuous horizontal jet of water ($\rho = 1000\,\text{kg/m}^3$) against a flat concrete wall. The nozzle diameter is $d = 0.0150\,\text{m}$ ($1.50\,\text{cm}$) and the exit speed is $v = 140.0\,\text{m/s}$. Upon striking the wall, the water splashes symmetrically sideways parallel to the wall, shedding all forward normal velocity ($v_{xf} = 0$).
1. Calculate the mass flow rate $\dot{m}$.
2. Compute the momentum delivered to the wall per second.
3. Determine the continuous thrust force $F_{\text{impact}}$ exerted on the concrete wall.

**Solution:**
- **Step 1: Mass flow rate**
  Cross-sectional area:
  $$A = \frac{\pi d^2}{4} = \frac{\pi (0.0150\,\text{m})^2}{4} = \frac{\pi(0.000225)}{4} = 1.7671 \times 10^{-4}\,\text{m}^2$$
  Volumetric flow rate:
  $$Q = A v = (1.7671 \times 10^{-4}\,\text{m}^2)(140.0\,\text{m/s}) = 0.02474\,\text{m}^3/\text{s}$$
  Mass flow rate:
  $$\dot{m} = \rho Q = (1000\,\text{kg/m}^3)(0.02474\,\text{m}^3/\text{s}) = 24.74\,\text{kg/s}$$

- **Step 2: Momentum rate of destruction**
  In time interval $\Delta t$, mass $\Delta m = \dot{m} \Delta t$ loses forward speed $v$:
  $$\Delta p_x = \Delta m (0 - v) = -(\dot{m} \Delta t) v$$
  $$\frac{dp_x}{dt} = -\dot{m} v = -(24.74\,\text{kg/s})(140.0\,\text{m/s}) = -3463.6\,\text{N}$$

- **Step 3: Impact force on the wall**
  By Newton’s Third Law, the force exerted on the wall is equal and opposite to the deceleration force on the water:
  $$F_{\text{impact}} = \dot{m} v = \rho A v^2 = (1000)(1.7671 \times 10^{-4})(140.0)^2 = (0.17671)(19,600) = 3463.5\,\text{N} \approx 3.46\,\text{kN}$$
  The continuous force equals nearly $780\,\text{lbf}$, capable of fracturing deteriorated concrete!

---

### Example 2.6: The Ballistic Pendulum
**Problem:** In a forensic laboratory, a wooden block of mass $M = 4.980\,\text{kg}$ hangs suspended by two light cords of length $L = 2.00\,\text{m}$. A rifle bullet of mass $m = 0.0200\,\text{kg}$ ($20.0\,\text{g}$) is fired horizontally into the block and embeds itself inside. Following the impact, the pendulum swings upward, its center of mass rising to a maximum vertical height $h = 0.125\,\text{m}$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the velocity $V$ of the combined (block + bullet) system immediately after the collision.
2. Compute the original muzzle speed $v_0$ of the bullet.
3. Calculate the fraction of initial mechanical kinetic energy lost during the embedding process.

**Solution:**
- **Step 1: Velocity of block immediately after impact**
  During the upward swing (after the impact is completed), mechanical energy is conserved:
  $$\frac{1}{2} (M + m) V^2 = (M + m) g h \implies V = \sqrt{2gh}$$
  $$V = \sqrt{2(9.81\,\text{m/s}^2)(0.125\,\text{m})} = \sqrt{2.4525} = 1.5660\,\text{m/s}$$

- **Step 2: Bullet muzzle speed from momentum conservation**
  During the collision ($\Delta t \approx 0$), horizontal momentum is conserved under the impulsive approximation:
  $$m v_0 = (M + m) V$$
  $$M + m = 4.980 + 0.0200 = 5.000\,\text{kg}$$
  $$v_0 = \frac{M + m}{m} V = \frac{5.000\,\text{kg}}{0.0200\,\text{kg}} (1.5660\,\text{m/s}) = 250 \times 1.5660 = 391.50\,\text{m/s}$$
  The bullet had a muzzle speed of $391.5\,\text{m/s}$.

- **Step 3: Kinetic energy loss**
  - Initial bullet kinetic energy:
    $$K_{\text{init}} = \frac{1}{2} m v_0^2 = \frac{1}{2}(0.0200\,\text{kg})(391.50\,\text{m/s})^2 = 0.0100 \times 153,272.25 = 1532.72\,\text{J}$$
  - Combined kinetic energy immediately after impact:
    $$K_{\text{final}} = \frac{1}{2} (M + m) V^2 = \frac{1}{2}(5.000\,\text{kg})(1.5660\,\text{m/s})^2 = 2.50 \times 2.4525 = 6.13\,\text{J}$$
  - Fraction lost:
    $$\Delta K_{\text{loss}} = 1532.72 - 6.13 = 1526.59\,\text{J}$$
    $$\text{Fraction Lost} = \frac{1526.59}{1532.72} = 0.9960 \implies 99.60\%!$$
  Over $99.6\%$ of the bullet's kinetic energy was irrevocably converted into heat and wood splintering during the inelastic impact!

---

### Example 2.7: Bungee Jumper Deceleration and Cable Impulse
**Problem:** A bungee jumper of mass $m = 70.0\,\text{kg}$ falls from a bridge. After falling in free fall for $h_1 = 20.0\,\text{m}$, the elastic bungee cord begins to stretch. The cord decelerates the jumper to a momentary stop at a maximum stretch distance $h_2 = 15.0\,\text{m}$ below the un-stretched length. The deceleration phase lasts $\Delta t = 1.40\,\text{s}$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the speed $v_1$ of the jumper at the instant the cord starts to stretch.
2. Determine the net upward impulse $J_{\text{net}}$ required to bring the jumper to rest.
3. Compute the total upward impulse $J_{\text{cord}}$ delivered by the elastic cord, and the time-averaged cord tension $T_{\text{avg}}$.

**Solution:**
- **Step 1: Free-fall speed**
  $$v_1 = \sqrt{2 g h_1} = \sqrt{2(9.81\,\text{m/s}^2)(20.0\,\text{m})} = \sqrt{392.4} = 19.809\,\text{m/s} \quad (\text{downward})$$

- **Step 2: Net impulse**
  Taking upward as positive:
  Initial velocity: $v_1 = -19.809\,\text{m/s}$. Final velocity: $v_2 = 0$.
  $$\Delta p = m(v_2 - v_1) = (70.0\,\text{kg})[0 - (-19.809\,\text{m/s})] = +1386.6\,\text{kg}\cdot\text{m/s}$$
  $$J_{\text{net}} = +1386.6\,\text{N}\cdot\text{s}$$

- **Step 3: Cord impulse and average tension**
  During the deceleration phase $\Delta t = 1.40\,\text{s}$, gravity continuously exerts a downward force $mg$:
  $$J_{\text{gravity}} = -mg \Delta t = -(70.0\,\text{kg})(9.81\,\text{m/s}^2)(1.40\,\text{s}) = -961.38\,\text{N}\cdot\text{s}$$
  Net impulse is the sum of cord impulse and gravity impulse:
  $$J_{\text{net}} = J_{\text{cord}} + J_{\text{gravity}} \implies J_{\text{cord}} = J_{\text{net}} - J_{\text{gravity}}$$
  $$J_{\text{cord}} = +1386.63 - (-961.38) = +2348.01\,\text{N}\cdot\text{s}$$
  Time-averaged cord tension:
  $$T_{\text{avg}} = \frac{J_{\text{cord}}}{\Delta t} = \frac{2348.01\,\text{N}\cdot\text{s}}{1.40\,\text{s}} = 1677.15\,\text{N}$$
  In units of body weight:
  $$\frac{T_{\text{avg}}}{mg} = \frac{1677.15}{(70.0)(9.81)} = \frac{1677.15}{686.7} = 2.44\,g$$
  The jumper experiences a comfortable average tension of $2.44$ times their body weight.

---

### Example 2.8: Karate Strike Impact Force
**Problem:** In a martial arts demonstration, a karate black belt’s fist of effective arm mass $m = 1.20\,\text{kg}$ strikes a concrete paver block at velocity $v_0 = 11.0\,\text{m/s}$. The hand comes to rest inside the paver over an impact duration of $\Delta t = 4.00\,\text{ms} = 0.00400\,\text{s}$.
1. Compute the impulse delivered to the block.
2. Determine the time-averaged force $F_{\text{avg}}$.
3. If the force profile is triangular ($F_{\max} = 2 F_{\text{avg}}$), compute $F_{\max}$. Compare this to the fracture threshold of a human metacarpal bone ($\sim 4000\,\text{N}$).

**Solution:**
- **Step 1: Impulse**
  $$J = \Delta p = m(0 - v_0) = (1.20\,\text{kg})(11.0\,\text{m/s}) = 13.20\,\text{N}\cdot\text{s}$$

- **Step 2: Time-averaged force**
  $$F_{\text{avg}} = \frac{J}{\Delta t} = \frac{13.20\,\text{N}\cdot\text{s}}{0.00400\,\text{s}} = 3300.0\,\text{N}$$

- **Step 3: Peak force**
  $$F_{\max} = 2 F_{\text{avg}} = 2(3300.0\,\text{N}) = 6600.0\,\text{N} = 6.60\,\text{kN}$$
  *Biomechanical Analysis:* The peak force of $6600\,\text{N}$ significantly exceeds the $4000\,\text{N}$ static fracture limit of bone! The practitioner avoids bone fracture only through conditioned micro-callus bone density remodeling (Wolff's Law) and dynamic load distribution across the fibrous carpal tunnel ligament complex.

---

### Example 2.9: Explosive Bolt Stage Separation
**Problem:** A spacecraft orbital stage of mass $M_1 = 3200\,\text{kg}$ and a payload capsule of mass $M_2 = 800\,\text{kg}$ are coasting together in deep space at $v_0 = 7500.0\,\text{m/s}$. Four pyrotechnic explosive separation bolts detonate simultaneously, delivering a total axial separation impulse of $J = 2400.0\,\text{N}\cdot\text{s}$ between the two bodies.
1. Determine the post-separation velocities $v_1$ and $v_2$.
2. Calculate the relative separation velocity $v_{\text{rel}} = v_2 - v_1$.
3. Compute the mechanical kinetic energy added to the system by the pyrotechnic blast.

**Solution:**
- **Step 1: Post-separation velocities**
  The explosive bolts exert equal and opposite impulses:
  - On the forward payload capsule $M_2$: $+J = +2400.0\,\text{N}\cdot\text{s}$.
    $$v_2 = v_0 + \frac{J}{M_2} = 7500.0\,\text{m/s} + \frac{2400.0\,\text{N}\cdot\text{s}}{800\,\text{kg}} = 7500.0 + 3.00 = 7503.0\,\text{m/s}$$
  - On the trailing booster stage $M_1$: $-J = -2400.0\,\text{N}\cdot\text{s}$.
    $$v_1 = v_0 - \frac{J}{M_1} = 7500.0\,\text{m/s} - \frac{2400.0\,\text{N}\cdot\text{s}}{3200\,\text{kg}} = 7500.0 - 0.750 = 7499.25\,\text{m/s}$$

- **Step 2: Relative separation speed**
  $$v_{\text{rel}} = v_2 - v_1 = 7503.0 - 7499.25 = 3.75\,\text{m/s}$$
  *Notice:* $v_{\text{rel}} = J \left(\frac{1}{M_1} + \frac{1}{M_2}\right) = 2400\left(\frac{1}{3200} + \frac{1}{800}\right) = 2400(0.0003125 + 0.00125) = 2400(0.0015625) = 3.75\,\text{m/s}$.

- **Step 3: Energy added by pyrotechnic charge**
  In the initial state:
  $$K_{\text{init}} = \frac{1}{2}(M_1 + M_2) v_0^2 = \frac{1}{2}(4000)(7500)^2 = 2000 \times 56,250,000 = 112,500,000,000\,\text{J}$$
  Using the reduced mass relation for impulse release:
  $$\Delta K_{\text{blast}} = \frac{J^2}{2\mu}, \quad \text{where } \mu = \frac{M_1 M_2}{M_1 + M_2} = \frac{(3200)(800)}{4000} = 640.0\,\text{kg}$$
  $$\Delta K_{\text{blast}} = \frac{(2400.0\,\text{N}\cdot\text{s})^2}{2(640.0\,\text{kg})} = \frac{5,760,000}{1280.0} = 4500.0\,\text{J} = 4.50\,\text{kJ}$$

---

### Example 2.10: Variable Rocket Thrust Impulse Integration
**Problem:** A sounding rocket engine produces a time-varying thrust profile:
$$T(t) = T_0 \left[ 1 - \left(\frac{t}{\tau}\right)^2 \right], \quad 0 \le t \le \tau$$
with peak initial thrust $T_0 = 18,000\,\text{N}$ and burn duration $\tau = 5.00\,\text{s}$.
1. Derive the formula for total thrust impulse $J_{\text{thrust}}$ and calculate its numerical value.
2. Determine the time-averaged thrust $T_{\text{avg}}$.
3. If the rocket has an initial total mass $m = 250\,\text{kg}$ and ejects fuel at rate $\frac{dm}{dt} = -12.0\,\text{kg/s}$ in deep space (zero gravity), calculate its final burnout speed $v_f$ from rest.

**Solution:**
- **Step 1: Thrust impulse integral**
  $$J_{\text{thrust}} = \int_0^\tau T(t) \, dt = T_0 \int_0^\tau \left(1 - \frac{t^2}{\tau^2}\right) dt = T_0 \left[ t - \frac{t^3}{3\tau^2} \right]_0^\tau = T_0 \left( \tau - \frac{\tau}{3} \right) = \frac{2}{3} T_0 \tau$$
  Numerical calculation:
  $$J_{\text{thrust}} = \frac{2}{3}(18,000\,\text{N})(5.00\,\text{s}) = \frac{2}{3}(90,000) = 60,000\,\text{N}\cdot\text{s}$$

- **Step 2: Time-averaged thrust**
  $$T_{\text{avg}} = \frac{J_{\text{thrust}}}{\tau} = \frac{60,000\,\text{N}\cdot\text{s}}{5.00\,\text{s}} = 12,000\,\text{N} = \frac{2}{3} T_0$$

- **Step 3: Burnout speed**
  Final mass at burnout:
  $$m_f = m_0 - \left|\frac{dm}{dt}\right| \tau = 250\,\text{kg} - (12.0\,\text{kg/s})(5.00\,\text{s}) = 250 - 60 = 190.0\,\text{kg}$$
  Effective exhaust velocity $v_{\text{ex}}$:
  $$T_{\text{avg}} = \dot{m} v_{\text{ex}} \implies v_{\text{ex}} = \frac{J_{\text{thrust}}}{\Delta m} = \frac{60,000\,\text{N}\cdot\text{s}}{60.0\,\text{kg}} = 1000.0\,\text{m/s}$$
  By the Tsiolkovsky rocket equation:
  $$v_f = v_{\text{ex}} \ln\left(\frac{m_0}{m_f}\right) = (1000.0\,\text{m/s}) \ln\left(\frac{250.0}{190.0}\right) = 1000.0 \times \ln(1.31579) = 1000.0 \times 0.27444 = 274.44\,\text{m/s}$$

---

## 2.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 2.8.

### Tier 1: Foundational Impulse Arithmetic
- **Exercise 2.1:** A soccer player kicks a stationary $0.450\,\text{kg}$ ball, giving it a speed of $24.0\,\text{m/s}$. The foot contact lasts $0.0150\,\text{s}$. Find the impulse delivered and the average force exerted.
- **Exercise 2.2:** A constant braking force of $1200\,\text{N}$ acts on an $800\,\text{kg}$ car for $3.50\,\text{s}$. Compute the change in velocity $\Delta v$.

### Tier 2: Triangular and Piecewise Pulses
- **Exercise 2.3:** A pile driver delivers an impulse modeled as a triangle of base $\Delta t = 0.020\,\text{s}$ and peak force $F_{\max} = 150\,\text{kN}$. Compute the total impulse delivered to the piling.
- **Exercise 2.4:** A $0.050\,\text{kg}$ tennis ball moving at $30.0\,\text{m/s}$ rebounds from a racket at $35.0\,\text{m/s}$ in the exact opposite direction. If contact lasts $0.0050\,\text{s}$, find the average force.

### Tier 3: 2D Angled Wall Impacts
- **Exercise 2.5:** A $0.200\,\text{kg}$ billiard ball strikes a cushion at $45.0^\circ$ with speed $5.00\,\text{m/s}$ and bounces off specularly ($45.0^\circ$ reflection, $5.00\,\text{m/s}$). Compute the vector impulse $\vec{J}$ delivered by the cushion.
- **Exercise 2.6:** A water hose directs a jet ($2.00\,\text{kg/s}$ at $15.0\,\text{m/s}$) at a flat vertical wall at a $30.0^\circ$ angle to the normal. Assuming the water flows away along the wall, find the normal force on the wall.

### Tier 4: Attenuation & Biomechanics
- **Exercise 2.7:** A stunt performer of mass $70.0\,\text{kg}$ falls from a building, reaching $18.0\,\text{m/s}$ before landing on an air-bag mattress. If the maximum deceleration the body can safely sustain is $8.0\,g$, what is the minimum mattress compression distance?
- **Exercise 2.8:** A golf club head ($m = 0.200\,\text{kg}$) moving at $45.0\,\text{m/s}$ strikes a stationary golf ball ($m = 0.0450\,\text{kg}$). The ball departs at $65.0\,\text{m/s}$. Compute the impulse on the ball and the post-impact speed of the club head.

### Tier 5: Continuum & Time-Varying Force Fields
- **Exercise 2.9:** An electromagnetic railgun applies a time-decaying force pulse $F(t) = F_0 e^{-t/\tau}$ to a $0.0250\,\text{kg}$ projectile from $t = 0$ to $t \to \infty$, where $F_0 = 50,000\,\text{N}$ and $\tau = 0.00200\,\text{s}$. Calculate the exit velocity from rest.
- **Exercise 2.10:** Rain falls vertically at $12.0\,\text{m/s}$ onto a flat horizontal roof of area $80.0\,\text{m}^2$ at a rate of $4.00 \times 10^{-4}\,\text{m}^3/(\text{s}\cdot\text{m}^2)$. Assuming all raindrops splash without bouncing, compute the downward dynamic impact force exerted on the roof ($\rho = 1000\,\text{kg/m}^3$).

---

## 2.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 2.1
- **Given:** $m = 0.450\,\text{kg}$, $v_0 = 0$, $v_f = 24.0\,\text{m/s}$, $\Delta t = 0.0150\,\text{s}$.
- **Step 1: Impulse**
  $$J = \Delta p = m(v_f - v_0) = (0.450\,\text{kg})(24.0\,\text{m/s}) = 10.80\,\text{N}\cdot\text{s}$$
- **Step 2: Average force**
  $$F_{\text{avg}} = \frac{J}{\Delta t} = \frac{10.80\,\text{N}\cdot\text{s}}{0.0150\,\text{s}} = 720.0\,\text{N}$$

---

### Solution 2.2
- **Given:** $F = -1200\,\text{N}$, $m = 800\,\text{kg}$, $\Delta t = 3.50\,\text{s}$.
- **Step 1: Total impulse**
  $$J = F \Delta t = (-1200\,\text{N})(3.50\,\text{s}) = -4200\,\text{N}\cdot\text{s}$$
- **Step 2: Change in velocity**
  $$\Delta v = \frac{J}{m} = \frac{-4200\,\text{N}\cdot\text{s}}{800\,\text{kg}} = -5.25\,\text{m/s}$$

---

### Solution 2.3
- **Given:** Triangular pulse, $\Delta t = 0.020\,\text{s}$, $F_{\max} = 150,000\,\text{N}$.
- **Step 1: Impulse formula for triangle**
  $$J = \frac{1}{2} F_{\max} \Delta t = 0.5 \times (150,000\,\text{N}) \times (0.020\,\text{s}) = 1500.0\,\text{N}\cdot\text{s}$$

---

### Solution 2.4
- **Given:** $m = 0.050\,\text{kg}$, $v_1 = -30.0\,\text{m/s}$, $v_2 = +35.0\,\text{m/s}$, $\Delta t = 0.0050\,\text{s}$.
- **Step 1: Change in momentum**
  $$\Delta p = m(v_2 - v_1) = (0.050\,\text{kg})[+35.0 - (-30.0)\,\text{m/s}] = (0.050)(65.0) = 3.25\,\text{N}\cdot\text{s}$$
- **Step 2: Average force**
  $$F_{\text{avg}} = \frac{\Delta p}{\Delta t} = \frac{3.25\,\text{N}\cdot\text{s}}{0.0050\,\text{s}} = 650.0\,\text{N}$$

---

### Solution 2.5
- **Given:** $m = 0.200\,\text{kg}$, incident at $45.0^\circ$ with $v = 5.00\,\text{m/s}$.
- **Step 1: Coordinate components**
  Let the cushion lie along the $y$-axis (normal is $+x$):
  $$v_{1x} = -5.00\cos(45^\circ) = -3.5355\,\text{m/s}, \quad v_{1y} = +5.00\sin(45^\circ) = +3.5355\,\text{m/s}$$
  $$v_{2x} = +3.5355\,\text{m/s}, \quad v_{2y} = +3.5355\,\text{m/s}$$
- **Step 2: Change in momentum**
  $$\Delta p_x = m(v_{2x} - v_{1x}) = (0.200)[+3.5355 - (-3.5355)] = (0.200)(7.0711) = +1.414\,\text{N}\cdot\text{s}$$
  $$\Delta p_y = 0.0\,\text{N}\cdot\text{s}$$
  $$\vec{J} = +1.414\,\hat{i}\,\text{N}\cdot\text{s} \quad (\text{perpendicular to the cushion})$$

---

### Solution 2.6
- **Given:** $\dot{m} = 2.00\,\text{kg/s}$, $v = 15.0\,\text{m/s}$, $\theta = 30.0^\circ$ to normal.
- **Step 1: Normal component of incident velocity**
  $$v_n = v \cos(30.0^\circ) = 15.0 \times 0.86603 = 12.99\,\text{m/s}$$
- **Step 2: Normal impact force**
  Since the water leaves along the wall, normal velocity after impact is zero:
  $$F_n = \dot{m} v_n = (2.00\,\text{kg/s})(12.99\,\text{m/s}) = 25.98\,\text{N} \approx 26.0\,\text{N}$$

---

### Solution 2.7
- **Given:** $m = 70.0\,\text{kg}$, $v_0 = 18.0\,\text{m/s}$, $a_{\max} = 8.0\,g = 8.0 \times 9.81 = 78.48\,\text{m/s}^2$.
- **Step 1: Kinematic stopping distance**
  $$v^2 = v_0^2 - 2 a d = 0 \implies d_{\min} = \frac{v_0^2}{2 a_{\max}} = \frac{(18.0\,\text{m/s})^2}{2(78.48\,\text{m/s}^2)} = \frac{324.0}{156.96} = 2.064\,\text{m}$$
  The air-bag must compress by at least $2.06\,\text{m}$ to keep decelerations below $8\,g$.

---

### Solution 2.8
- **Given:** $m_{\text{club}} = 0.200\,\text{kg}$, $v_{c0} = 45.0\,\text{m/s}$, $m_{\text{ball}} = 0.0450\,\text{kg}$, $v_{b0} = 0$, $v_{bf} = 65.0\,\text{m/s}$.
- **Step 1: Impulse on ball**
  $$J = m_{\text{ball}} (v_{bf} - 0) = (0.0450\,\text{kg})(65.0\,\text{m/s}) = 2.925\,\text{N}\cdot\text{s}$$
- **Step 2: Post-impact club speed**
  By Newton’s Third Law, the club experiences an impulse $-J$:
  $$v_{cf} = v_{c0} - \frac{J}{m_{\text{club}}} = 45.0\,\text{m/s} - \frac{2.925\,\text{N}\cdot\text{s}}{0.200\,\text{kg}} = 45.0 - 14.625 = 30.375\,\text{m/s}$$
  The club slows from $45.0\,\text{m/s}$ to $30.4\,\text{m/s}$.

---

### Solution 2.9
- **Given:** $m = 0.0250\,\text{kg}$, $F(t) = F_0 e^{-t/\tau}$ with $F_0 = 50,000\,\text{N}$, $\tau = 0.00200\,\text{s}$.
- **Step 1: Integrate force for total impulse**
  $$J = \int_0^\infty F_0 e^{-t/\tau} \, dt = F_0 \left[ -\tau e^{-t/\tau} \right]_0^\infty = F_0 \tau (0 - (-1)) = F_0 \tau$$
  $$J = (50,000\,\text{N})(0.00200\,\text{s}) = 100.0\,\text{N}\cdot\text{s}$$
- **Step 2: Exit velocity**
  $$v_f = \frac{J}{m} = \frac{100.0\,\text{N}\cdot\text{s}}{0.0250\,\text{kg}} = 4000.0\,\text{m/s} = 4.00\,\text{km/s}$$

---

### Solution 2.10
- **Given:** Roof area $A = 80.0\,\text{m}^2$, rain rate $r = 4.00 \times 10^{-4}\,\text{m}^3/(\text{s}\cdot\text{m}^2)$, speed $v = 12.0\,\text{m/s}$, $\rho = 1000\,\text{kg/m}^3$.
- **Step 1: Total mass flow rate**
  $$\dot{m} = \rho A r = (1000\,\text{kg/m}^3)(80.0\,\text{m}^2)(4.00 \times 10^{-4}\,\text{m/s}) = 32.0\,\text{kg/s}$$
- **Step 2: Dynamic impact force**
  The downward momentum rate brought to rest:
  $$F_{\text{impact}} = \dot{m} v = (32.0\,\text{kg/s})(12.0\,\text{m/s}) = 384.0\,\text{N}$$
  The falling rain exerts a continuous downward dynamic force of $384\,\text{N}$ on the roof.
