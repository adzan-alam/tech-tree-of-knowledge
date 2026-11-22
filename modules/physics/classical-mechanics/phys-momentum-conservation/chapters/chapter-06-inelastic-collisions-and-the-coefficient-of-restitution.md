# Chapter 06: Inelastic Collisions & The Coefficient of Restitution — Energy Dissipation, Zeno Bouncing, and General Kinematics

> *"Between the frictionless ideal of elastic rebound and the cold stagnation of complete coalescence lies the true domain of physical matter. The coefficient of restitution is the universal metric of mechanical imperfection, quantifying how much of motion's vitality is surrendered to atomic thermal chaos."*

---

## 6.1 The Spectrum of Collisions

In Chapter 05, we examined the pristine realm of perfectly elastic collisions, where mechanical kinetic energy is conserved without loss. While ideal elasticity provides deep theoretical insight, the vast majority of terrestrial interactions are **inelastic**: mechanical kinetic energy is not conserved, but is partially or completely transformed into internal deformation work, micro-fracturing, acoustic emissions, and thermal heat.

Classical mechanics classifies all collisions along a continuous thermodynamic spectrum parameterized by the **Coefficient of Restitution** ($e$):

```
+---------------------------------------------------------------------------------------------------------+
|                                  THE COLLISION CONTINUUM SPECTRUM                                       |
+--------------------------+-----------------------+------------------------------------------------------+
| Regime                   | Restitution e         | Physical Characteristics                             |
+--------------------------+-----------------------+------------------------------------------------------+
| 1. Super-Elastic         | e > 1.0               | Explosive release of stored potential energy (K_f > K_i)|
| 2. Perfectly Elastic     | e = 1.0               | 100% mechanical kinetic energy conserved (ΔK = 0)    |
| 3. Partially Inelastic   | 0.0 < e < 1.0         | Everyday real-world impacts (0 < ΔK_loss < K_int)    |
| 4. Completely Inelastic  | e = 0.0               | Bodies stick together; maximum possible energy loss   |
+--------------------------+-----------------------+------------------------------------------------------+
```

1. **Super-Elastic / Explosive ($e > 1.0$):** Occurs when a compressed spring unlatches, a chemical explosive detonates, or a pre-stressed brittle glass (like a Prince Rupert’s Drop) shatters upon contact. The departing bodies separate with a relative speed *greater* than their approach speed, powered by internal energy stores.
2. **Perfectly Elastic ($e = 1.0$):** Zero mechanical energy loss. Separation speed equals approach speed.
3. **Partially Inelastic ($0 < e < 1.0$):** The general rule of macroscopic nature. Some kinetic energy is permanently dissipated into thermal vibrations of atomic lattices.
4. **Completely Inelastic ($e = 0.0$):** The colliding bodies coalesce, stick together, and move forward as a single unified mass with common velocity $\vec{v}_f = \vec{V}_{\text{CM}}$.

---

## 6.2 Newton’s Empirical Restitution Hypothesis

In 1687, Isaac Newton conducted exhaustive experimental investigations into collision dynamics using colliding pendulum spheres of varied materials: glass, steel, wood, cork, and wet clay.

Newton discovered an empirical relationship that remains the foundation of impact engineering today:
> *For any two given materials, the relative speed of separation after an impact is directly proportional to the relative speed of approach before the impact, independent of the masses of the colliding bodies.*

Mathematically, the **Coefficient of Restitution** ($e$) is defined as:

$$e \equiv -\frac{v_{2f} - v_{1f}}{v_{2i} - v_{1i}} = \frac{|v_{2f} - v_{1f}|}{|v_{2i} - v_{1i}|} = \frac{\text{Relative Speed of Separation}}{\text{Relative Speed of Approach}}$$

```
       Approach Phase (Pre-Impact):
           v1i --->                <--- v2i
         ( m1 )                  ( m2 )
         Relative Approach Speed = |v2i - v1i|

       Separation Phase (Post-Impact):
       <--- v1f                    v2f --->
         ( m1 )                  ( m2 )
         Relative Separation Speed = |v2f - v1f| = e * |v2i - v1i|
```

### Typical Restitution Coefficients at Moderate Speeds
- Hardened Bearing Steel on Steel: $e \approx 0.92 - 0.96$
- Glass on Glass: $e \approx 0.90 - 0.94$
- Billiard Ball (Phenolic Resin) on Billiard Ball: $e \approx 0.88 - 0.92$
- Superball (Polybutadiene Rubber): $e \approx 0.85 - 0.90$
- Hardwood on Hardwood: $e \approx 0.50 - 0.65$
- Baseball on Ash Wood Bat: $e \approx 0.40 - 0.55$
- Automobile Sheet Metal on Metal (Crash): $e \approx 0.05 - 0.15$
- Modeling Clay or Wet Putty: $e \equiv 0.00$

*(Note: In modern contact mechanics, $e$ is not strictly a constant; at extreme hypervelocities, severe localized plastic yielding causes $e$ to decrease with increasing impact speed).*

---

## 6.3 General 1D Velocity Solutions Parameterized by $e$

Let us solve the general one-dimensional collision problem for arbitrary masses $m_1, m_2$, arbitrary initial velocities $v_{1i}, v_{2i}$, and an arbitrary restitution coefficient $e \in [0, 1]$.

We have two fundamental linear algebraic equations:
1. **Conservation of Linear Momentum:**
   $$m_1 v_{1f} + m_2 v_{2f} = m_1 v_{1i} + m_2 v_{2i} \qquad \text{(Eq. 6.1)}$$
2. **Newton's Restitution Law:**
   $$v_{2f} - v_{1f} = e (v_{1i} - v_{2i}) \implies v_{2f} = v_{1f} + e (v_{1i} - v_{2i}) \qquad \text{(Eq. 6.2)}$$

Substitute Eq. 6.2 into Eq. 6.1:

$$m_1 v_{1f} + m_2 \left[ v_{1f} + e (v_{1i} - v_{2i}) \right] = m_1 v_{1i} + m_2 v_{2i}$$

$$(m_1 + m_2) v_{1f} + e m_2 v_{1i} - e m_2 v_{2i} = m_1 v_{1i} + m_2 v_{2i}$$

$$(m_1 + m_2) v_{1f} = (m_1 - e m_2) v_{1i} + m_2 (1 + e) v_{2i}$$

Dividing by $(m_1 + m_2)$:

$$v_{1f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1i} + \frac{(1 + e)m_2}{m_1 + m_2} v_{2i} \qquad \text{(Eq. 6.3)}$$

By symmetry (swapping indices $1 \leftrightarrow 2$):

$$v_{2f} = \frac{(1 + e)m_1}{m_1 + m_2} v_{1i} + \frac{m_2 - e m_1}{m_1 + m_2} v_{2i} \qquad \text{(Eq. 6.4)}$$

### Center-of-Mass Formulation (The Elegant Form)
Notice what happens if we express Eqs. 6.3 and 6.4 in terms of the Center of Mass velocity $V_{\text{CM}} = \frac{m_1 v_{1i} + m_2 v_{2i}}{m_1 + m_2}$:

$$v_{1f} = V_{\text{CM}} - e(v_{1i} - V_{\text{CM}})$$

$$v_{2f} = V_{\text{CM}} - e(v_{2i} - V_{\text{CM}})$$

In the Center-of-Mass reference frame ($u'_i = v_i - V_{\text{CM}}$):

$$u'_{1f} = -e \, u'_{1i}$$

$$u'_{2f} = -e \, u'_{2i}$$

**The Center-of-Mass Inelastic Rule:**
> *In the Center-of-Mass frame, every collision is simply a directional reversal scaled by the factor $e$!*
- At $e = 1$ (elastic): $u'_f = -u'_i$ (full mirror reflection).
- At $e = 0$ (completely inelastic): $u'_f = 0$ (both bodies come to complete rest at the center of mass!).

---

## 6.4 Proof of Maximum Kinetic Energy Dissipation at $e = 0$

How much kinetic energy is dissipated during an inelastic collision?

Using Koenig’s Theorem from Chapter 04:

$$K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}} = \frac{1}{2} M_{\text{total}} V_{\text{CM}}^2 + \frac{1}{2} \mu v_{\text{rel}}^2$$

where $\mu = \frac{m_1 m_2}{m_1 + m_2}$ is the reduced mass, and $v_{\text{rel}} = |v_{1i} - v_{2i}|$.

Because linear momentum is conserved in an isolated collision, $V_{\text{CM}}$ is strictly constant:

$$K_{\text{CM, final}} = K_{\text{CM, initial}} = \frac{1}{2} M_{\text{total}} V_{\text{CM}}^2$$

Therefore, all changes in kinetic energy are confined entirely to the internal term $K_{\text{int}}$:

$$\Delta K_{\text{loss}} = K_{\text{lab, initial}} - K_{\text{lab, final}} = K_{\text{int, initial}} - K_{\text{int, final}}$$

Initial internal kinetic energy:

$$K_{\text{int, initial}} = \frac{1}{2} \mu v_{\text{rel, init}}^2$$

Final internal kinetic energy:

$$K_{\text{int, final}} = \frac{1}{2} \mu v_{\text{rel, final}}^2 = \frac{1}{2} \mu (e \, v_{\text{rel, init}})^2 = e^2 \left( \frac{1}{2} \mu v_{\text{rel, init}}^2 \right) = e^2 K_{\text{int, initial}}$$

Subtracting:

$$\Delta K_{\text{loss}} = K_{\text{int, initial}} - e^2 K_{\text{int, initial}} = K_{\text{int, initial}} (1 - e^2)$$

$$\Delta K_{\text{loss}} = \frac{1}{2} \left(\frac{m_1 m_2}{m_1 + m_2}\right) (v_{1i} - v_{2i})^2 \left( 1 - e^2 \right)$$

### Analysis of the Energy Dissipation Law
1. **Perfect Elasticity ($e = 1$):**
   $$1 - e^2 = 1 - 1 = 0 \implies \Delta K_{\text{loss}} \equiv 0$$
   Zero mechanical energy is lost.
2. **General Inelasticity ($0 < e < 1$):**
   A fraction $(1 - e^2)$ of the internal kinetic energy is dissipated into heat.
3. **Completely Inelastic ($e = 0$):**
   $$1 - e^2 = 1 - 0 = 1 \implies \Delta K_{\text{loss}} = K_{\text{int, initial}} = \frac{1}{2} \mu (v_{1i} - v_{2i})^2$$
   **One hundred percent** of the internal kinetic energy is destroyed!

**The Maximum Dissipation Theorem:**
> *A completely inelastic collision ($e = 0$) dissipates the maximum possible amount of kinetic energy permitted by the laws of physics. The remaining energy $K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2$ cannot be eliminated because doing so would violate the conservation of linear momentum.*

---

## 6.5 The Bouncing Ball: Zeno’s Infinite Sequence in Finite Time

Consider a ball dropped from initial height $h_0$ above a massive rigid floor ($M_{\text{floor}} \to \infty$) with coefficient of restitution $e < 1$. Take $g$ as uniform gravitational acceleration.

```
       Drop Height h0
          *
          |  Fall: t0 = sqrt(2h0/g)
          |  Impact speed: v0 = sqrt(2gh0)
          v
       ========= Floor ==========================================
          ^
          |  Rebound speed: v1 = e * v0
          |  Rebound height: h1 = e^2 * h0
          *  Apex 1
```

### 1. Kinematics of Consecutive Bounces
- **Impact 0:** The ball strikes the floor with speed $v_0 = \sqrt{2gh_0}$.
- **Rebound 1:** The ball departs upward with speed $v_1 = e v_0 = e \sqrt{2gh_0}$.
  The maximum height reached on the first rebound is:
  $$h_1 = \frac{v_1^2}{2g} = \frac{e^2 (2gh_0)}{2g} = e^2 h_0$$
- **Impact 1:** The ball falls from $h_1$, hitting the floor again at speed $v_1 = e v_0$.
- **Rebound 2:** Departs at $v_2 = e v_1 = e^2 v_0$.
  Rebound height:
  $$h_2 = \frac{v_2^2}{2g} = e^4 h_0$$
- **General Bounce $n$:**
  $$v_n = e^n v_0$$
  $$h_n = e^{2n} h_0$$

The rebound heights form a descending geometric sequence with common ratio $r = e^2 < 1$.

### 2. Total Cumulative Distance Fallen and Rebounded
The total distance $D_{\text{total}}$ traversed by the ball before coming to rest includes the initial drop $h_0$ plus the round-trip (up and down) for all subsequent bounces:

$$D_{\text{total}} = h_0 + 2 h_1 + 2 h_2 + 2 h_3 + \dots = h_0 + 2 \sum_{n=1}^\infty h_n = h_0 + 2 h_0 \sum_{n=1}^\infty (e^2)^n$$

Recall the infinite geometric series formula $\sum_{n=1}^\infty r^n = \frac{r}{1 - r}$ for $|r| < 1$:

$$D_{\text{total}} = h_0 \left[ 1 + 2 \left( \frac{e^2}{1 - e^2} \right) \right] = h_0 \left[ \frac{1 - e^2 + 2e^2}{1 - e^2} \right]$$

$$D_{\text{total}} = h_0 \left( \frac{1 + e^2}{1 - e^2} \right)$$

### 3. Total Time to Come to Rest (Zeno's Mechanical Paradox)
Let $t_0$ be the initial drop time from $h_0$:

$$t_0 = \sqrt{\frac{2h_0}{g}} = \frac{v_0}{g}$$

Each subsequent bounce $n$ consists of an ascent to $h_n$ and descent back to the floor, taking total duration:

$$\Delta t_n = 2 \left( \frac{v_n}{g} \right) = 2 \left( \frac{e^n v_0}{g} \right) = 2 e^n t_0$$

The total time $T_{\text{total}}$ to complete **infinitely many bounces** is:

$$T_{\text{total}} = t_0 + \sum_{n=1}^\infty \Delta t_n = t_0 + 2 t_0 \sum_{n=1}^\infty e^n = t_0 \left[ 1 + 2 \left( \frac{e}{1 - e} \right) \right] = t_0 \left[ \frac{1 - e + 2e}{1 - e} \right]$$

$$T_{\text{total}} = t_0 \left( \frac{1 + e}{1 - e} \right) = \sqrt{\frac{2h_0}{g}} \left( \frac{1 + e}{1 - e} \right)$$

**Zeno’s Bouncing Resolution:**
> *Although the ball executes an infinite count of bounces ($N \to \infty$), the time interval between successive bounces shrinks exponentially as $e^n$. Because the geometric series converges, the infinite sequence of bounces completes in a strictly finite, predictable number of seconds!*

For example, if a rubber ball with $e = 0.70$ is dropped from $h_0 = 1.0\,\text{m}$ ($t_0 = 0.45\,\text{s}$):
$$T_{\text{total}} = 0.45 \times \frac{1 + 0.70}{1 - 0.70} = 0.45 \times \frac{1.70}{0.30} = 0.45 \times 5.67 = 2.55\,\text{seconds}$$
After exactly $2.55$ seconds, all infinite bounces have elapsed, and the ball rests motionless on the floor.

---

## 6.6 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 6.1: Determining Coefficient of Restitution from Rebound Height
**Problem:** A basketball is dropped from rest from a height $h_0 = 1.80\,\text{m}$ onto a hardwood gymnasium floor. High-speed video shows that it rebounds to a peak height $h_1 = 1.15\,\text{m}$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the coefficient of restitution $e$.
2. Calculate the height of the second rebound $h_2$.
3. Compute the percentage of mechanical kinetic energy lost on the first bounce.

**Solution:**
- **Step 1: Coefficient of restitution**
  $$h_1 = e^2 h_0 \implies e = \sqrt{\frac{h_1}{h_0}} = \sqrt{\frac{1.15\,\text{m}}{1.80\,\text{m}}} = \sqrt{0.63889} = 0.7993 \approx 0.800$$

- **Step 2: Second rebound height**
  $$h_2 = e^2 h_1 = (0.63889)(1.15\,\text{m}) = 0.7347\,\text{m} = 73.5\,\text{cm}$$
  *Check via $h_0$:* $h_2 = e^4 h_0 = (0.7993)^4 (1.80) = (0.40818)(1.80) = 0.7347\,\text{m}$.

- **Step 3: Energy loss percentage**
  $$\text{Energy Loss} = 1 - e^2 = 1 - 0.63889 = 0.36111 \implies 36.11\%$$
  The basketball dissipates $36.1\%$ of its energy on each impact.

---

### Example 6.2: Partially Inelastic Glider Collision
**Problem:** Glider 1 ($m_1 = 0.800\,\text{kg}$) moves at $v_{1i} = +3.50\,\text{m/s}$ along an air track and collides with Glider 2 ($m_2 = 1.200\,\text{kg}$) moving in the same direction at $v_{2i} = +1.00\,\text{m/s}$. The bumpers have a coefficient of restitution $e = 0.600$.
1. Compute the final velocities $v_{1f}$ and $v_{2f}$.
2. Verify Newton's restitution formula.
3. Calculate the thermal energy dissipated by the bumpers.

**Solution:**
- **Step 1: Velocity calculation**
  $$m_1 + m_2 = 0.800 + 1.200 = 2.000\,\text{kg}$$
  - For Glider 1:
    $$v_{1f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1i} + \frac{(1 + e)m_2}{m_1 + m_2} v_{2i}$$
    $$m_1 - e m_2 = 0.800 - (0.600)(1.200) = 0.800 - 0.720 = +0.080\,\text{kg}$$
    $$(1 + e)m_2 = (1.600)(1.200) = 1.920\,\text{kg}$$
    $$v_{1f} = \frac{0.080}{2.000}(+3.50) + \frac{1.920}{2.000}(+1.00) = 0.040(3.50) + 0.960(1.00) = 0.140 + 0.960 = +1.100\,\text{m/s}$$
  - For Glider 2:
    $$v_{2f} = \frac{(1 + e)m_1}{m_1 + m_2} v_{1i} + \frac{m_2 - e m_1}{m_1 + m_2} v_{2i}$$
    $$(1 + e)m_1 = (1.600)(0.800) = 1.280\,\text{kg}$$
    $$m_2 - e m_1 = 1.200 - (0.600)(0.800) = 1.200 - 0.480 = +0.720\,\text{kg}$$
    $$v_{2f} = \frac{1.280}{2.000}(+3.50) + \frac{0.720}{2.000}(+1.00) = 0.640(3.50) + 0.360(1.00) = 2.240 + 0.360 = +2.600\,\text{m/s}$$

- **Step 2: Restitution check**
  $$v_{2f} - v_{1f} = 2.600 - 1.100 = +1.500\,\text{m/s}$$
  $$v_{1i} - v_{2i} = 3.500 - 1.000 = +2.500\,\text{m/s}$$
  $$\frac{v_{2f} - v_{1f}}{v_{1i} - v_{2i}} = \frac{1.500}{2.500} = 0.600 \equiv e$$. Flawless!

- **Step 3: Thermal energy dissipated**
  Reduced mass:
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(0.800)(1.200)}{2.000} = 0.480\,\text{kg}$$
  $$v_{\text{rel, init}} = 3.50 - 1.00 = 2.50\,\text{m/s}$$
  $$\Delta K_{\text{loss}} = \frac{1}{2} \mu v_{\text{rel, init}}^2 (1 - e^2) = \frac{1}{2}(0.480\,\text{kg})(2.50\,\text{m/s})^2 (1 - 0.600^2)$$
  $$\Delta K_{\text{loss}} = 0.240 \times 6.25 \times (1 - 0.360) = 1.500 \times 0.640 = 0.960\,\text{J}$$
  $0.960$ Joules of kinetic energy was dissipated.

---

### Example 6.3: Completely Inelastic Car Crash
**Problem:** Sedan A ($m_1 = 1400\,\text{kg}$) travels East ($+x$) at $v_1 = 20.0\,\text{m/s}$. Sedan B ($m_2 = 1800\,\text{kg}$) travels West ($-x$) at $v_2 = -15.0\,\text{m/s}$. They collide head-on and crumple together, locking bumpers ($e = 0$).
1. Determine the common velocity $v_f$ of the wreckage immediately after impact.
2. Calculate the total kinetic energy before and after the crash.
3. Compute the energy dissipated in structural crumpling.

**Solution:**
- **Step 1: Common post-crash velocity**
  $$v_f = V_{\text{CM}} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \frac{(1400\,\text{kg})(+20.0\,\text{m/s}) + (1800\,\text{kg})(-15.0\,\text{m/s})}{1400 + 1800\,\text{kg}}$$
  $$v_f = \frac{28,000 - 27,000}{3200\,\text{kg}} = \frac{+1000.0\,\text{kg}\cdot\text{m/s}}{3200\,\text{kg}} = +0.3125\,\text{m/s}$$
  The wreckage drifts slowly East at $0.313\,\text{m/s}$.

- **Step 2: Kinetic energy calculations**
  - Initial energy:
    $$K_{1i} = \frac{1}{2}(1400)(20.0)^2 = 700 \times 400 = 280,000\,\text{J}$$
    $$K_{2i} = \frac{1}{2}(1800)(-15.0)^2 = 900 \times 225 = 202,500\,\text{J}$$
    $$K_{\text{init}} = 280,000 + 202,500 = 482,500\,\text{J} = 482.5\,\text{kJ}$$
  - Final kinetic energy:
    $$K_{\text{final}} = \frac{1}{2}(m_1 + m_2) v_f^2 = \frac{1}{2}(3200\,\text{kg})(0.3125\,\text{m/s})^2 = 1600 \times 0.097656 = 156.25\,\text{J} = 0.156\,\text{kJ}$$

- **Step 3: Energy dissipated**
  $$\Delta K_{\text{loss}} = 482,500\,\text{J} - 156.25\,\text{J} = 482,343.75\,\text{J} \approx 482.34\,\text{kJ}$$
  $$\text{Percentage Dissipated} = \frac{482,344}{482,500} \times 100\% = 99.968\%!$$
  Essentially $100\%$ of the vehicular kinetic energy was converted into structural destruction and thermal heat!

---

### Example 6.4: Total Cumulative Bouncing Distance and Settling Time
**Problem:** A superball of mass $m = 0.080\,\text{kg}$ with restitution coefficient $e = 0.850$ is dropped from a balcony height $h_0 = 3.00\,\text{m}$ onto a rigid concrete sidewalk. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the time $t_0$ of the initial drop.
2. Determine the total vertical distance $D_{\text{total}}$ traversed by the ball before coming to rest.
3. Determine the total time $T_{\text{total}}$ elapsed until the infinite bouncing sequence ceases.

**Solution:**
- **Step 1: Initial drop time**
  $$t_0 = \sqrt{\frac{2 h_0}{g}} = \sqrt{\frac{2(3.00\,\text{m})}{9.81\,\text{m/s}^2}} = \sqrt{0.61162} = 0.78206\,\text{s}$$

- **Step 2: Total cumulative distance**
  $$e^2 = (0.850)^2 = 0.7225$$
  $$D_{\text{total}} = h_0 \left(\frac{1 + e^2}{1 - e^2}\right) = (3.00\,\text{m}) \left(\frac{1 + 0.7225}{1 - 0.7225}\right) = (3.00)\left(\frac{1.7225}{0.2775}\right) = 3.00 \times 6.2072 = 18.622\,\text{m}$$
  The ball travels over $18.6\,\text{meters}$ vertically!

- **Step 3: Total settling time**
  $$T_{\text{total}} = t_0 \left(\frac{1 + e}{1 - e}\right) = (0.78206\,\text{s}) \left(\frac{1 + 0.850}{1 - 0.850}\right) = (0.78206)\left(\frac{1.850}{0.150}\right) = 0.78206 \times 12.3333 = 9.6454\,\text{s}$$
  All infinite bounces complete in $9.65$ seconds.

---

### Example 6.5: Super-Elastic Spring-Loaded Ejection ($e > 1$)
**Problem:** Two gliders are placed on an air track: Glider 1 ($m_1 = 1.50\,\text{kg}$) moves right at $v_{1i} = +2.00\,\text{m/s}$; Glider 2 ($m_2 = 1.00\,\text{kg}$) is stationary ($v_{2i} = 0$). Between them is a pre-compressed explosive spring latch that releases during contact, adding $\Delta E = 15.0\,\text{J}$ of mechanical energy to the system.
1. Compute the effective coefficient of restitution $e$.
2. Calculate the post-separation velocities $v_{1f}$ and $v_{2f}$.

**Solution:**
- **Step 1: Effective coefficient of restitution**
  Initial relative speed: $v_{\text{rel, init}} = 2.00 - 0 = 2.00\,\text{m/s}$.
  Initial internal kinetic energy:
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(1.50)(1.00)}{2.50} = 0.600\,\text{kg}$$
  $$K_{\text{int, init}} = \frac{1}{2} \mu v_{\text{rel, init}}^2 = \frac{1}{2}(0.600\,\text{kg})(2.00\,\text{m/s})^2 = 0.300 \times 4.00 = 1.200\,\text{J}$$
  The spring releases $\Delta E = 15.0\,\text{J}$. The new internal kinetic energy is:
  $$K_{\text{int, final}} = K_{\text{int, init}} + \Delta E = 1.200 + 15.0 = 16.200\,\text{J}$$
  From Section 6.4:
  $$K_{\text{int, final}} = e^2 K_{\text{int, init}} \implies e^2 = \frac{K_{\text{int, final}}}{K_{\text{int, init}}} = \frac{16.200\,\text{J}}{1.200\,\text{J}} = 13.50$$
  $$e = \sqrt{13.50} = 3.6742 > 1.0 \quad (\text{Super-Elastic!})$$

- **Step 2: Final velocities**
  Center of mass velocity:
  $$V_{\text{CM}} = \frac{m_1 v_{1i} + m_2 v_{2i}}{m_1 + m_2} = \frac{(1.50)(2.00) + 0}{2.50} = \frac{3.00}{2.50} = 1.200\,\text{m/s}$$
  Using the Center-of-Mass formula ($v_f = V_{\text{CM}} - e(v_i - V_{\text{CM}})$):
  - For Glider 1:
    $$v_{1f} = 1.200 - (3.6742)(2.00 - 1.200) = 1.200 - (3.6742)(0.800) = 1.200 - 2.9394 = -1.739\,\text{m/s}$$
  - For Glider 2:
    $$v_{2f} = 1.200 - (3.6742)(0 - 1.200) = 1.200 - (3.6742)(-1.200) = 1.200 + 4.4090 = +5.609\,\text{m/s}$$
  *Check relative speed:* $v_{2f} - v_{1f} = 5.609 - (-1.739) = 7.348\,\text{m/s} = e \times 2.00 = 3.674 \times 2.00 = 7.348\,\text{m/s}$. Verified!

---

### Example 6.6: Ballistic Impact into a Heavy Sandbox on Wheels
**Problem:** A bullet of mass $m = 0.0150\,\text{kg}$ fired at $v_0 = 720.0\,\text{m/s}$ strikes a sandbox of mass $M = 45.0\,\text{kg}$ mounted on frictionless wheels on a horizontal track. The bullet embeds into the sand ($e = 0$).
1. Compute the final speed $V$ of the sandbox.
2. Determine the time-averaged retarding force $F_{\text{avg}}$ exerted on the bullet if it penetrates distance $d = 0.180\,\text{m}$ ($18.0\,\text{cm}$) into the sand.

**Solution:**
- **Step 1: Final speed**
  $$V = \frac{m v_0}{M + m} = \frac{(0.0150\,\text{kg})(720.0\,\text{m/s})}{45.0 + 0.0150\,\text{kg}} = \frac{10.80\,\text{kg}\cdot\text{m/s}}{45.015\,\text{kg}} = 0.2399\,\text{m/s} \approx 0.240\,\text{m/s}$$

- **Step 2: Average stopping force**
  The relative work done by the sand stopping the bullet over penetration depth $d = 0.180\,\text{m}$ dissipates the internal kinetic energy:
  $$F_{\text{avg}} \cdot d = K_{\text{int}} \approx \frac{1}{2} m v_0^2 = \frac{1}{2}(0.0150\,\text{kg})(720.0\,\text{m/s})^2 = 0.0075 \times 518,400 = 3888.0\,\text{J}$$
  $$F_{\text{avg}} = \frac{3888.0\,\text{J}}{0.180\,\text{m}} = 21,600\,\text{N} = 21.60\,\text{kN}$$
  The sand exerts an average force of $21.6\,\text{kN}$ on the bullet.

---

### Example 6.7: Consecutive Elastic-Inelastic Pendulum Impact
**Problem:** Pendulum bob A ($m_1 = 0.500\,\text{kg}$) is released from height $h = 0.800\,\text{m}$ and collides with stationary bob B ($m_2 = 1.000\,\text{kg}$) with restitution $e = 0.500$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the impact speed of bob A.
2. Compute the speeds of both bobs immediately after impact.
3. Calculate the maximum rebound height of bob B.

**Solution:**
- **Step 1: Impact speed**
  $$v_{1i} = \sqrt{2 g h} = \sqrt{2(9.81\,\text{m/s}^2)(0.800\,\text{m})} = \sqrt{15.696} = 3.9618\,\text{m/s}$$

- **Step 2: Post-collision velocities**
  $$m_1 + m_2 = 0.500 + 1.000 = 1.500\,\text{kg}$$
  - For Bob A:
    $$v_{1f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1i} = \frac{0.500 - (0.500)(1.000)}{1.500}(3.9618) = \frac{0.500 - 0.500}{1.500}(3.9618) = 0.00\,\text{m/s}!$$
    Remarkably, Bob A stops dead in its tracks!
  - For Bob B:
    $$v_{2f} = \frac{(1 + e)m_1}{m_1 + m_2} v_{1i} = \frac{(1 + 0.500)(0.500)}{1.500}(3.9618) = \frac{0.750}{1.500}(3.9618) = 0.500(3.9618) = +1.9809\,\text{m/s}$$

- **Step 3: Rebound height of Bob B**
  $$h_B' = \frac{v_{2f}^2}{2g} = \frac{(1.9809\,\text{m/s})^2}{2(9.81\,\text{m/s}^2)} = \frac{3.924}{19.62} = 0.2000\,\text{m} = \frac{h}{4}$$
  Bob B swings upward to a height of $0.200\,\text{m}$ ($20.0\,\text{cm}$).

---

### Example 6.8: Two-Cart Inelastic Capture with Internal Damper
**Problem:** Cart 1 of mass $m_1 = 4.00\,\text{kg}$ rolls at $v_{1i} = +5.00\,\text{m/s}$ toward Cart 2 ($m_2 = 6.00\,\text{kg}$) moving at $v_{2i} = +1.00\,\text{m/s}$. A mechanical latch captures Cart 2.
1. Find the final speed $v_f$ of the coupled pair.
2. If the capture is cushioned by a dashpot damper of stroke length $s = 0.100\,\text{m}$, calculate the average damping force $F_{\text{damper}}$ exerted during coupling.

**Solution:**
- **Step 1: Coupled speed**
  $$v_f = \frac{m_1 v_{1i} + m_2 v_{2i}}{m_1 + m_2} = \frac{(4.00)(5.00) + (6.00)(1.00)}{4.00 + 6.00} = \frac{20.0 + 6.00}{10.00} = +2.600\,\text{m/s}$$

- **Step 2: Damper force**
  The energy absorbed by the damper is the internal kinetic energy:
  $$\mu = \frac{(4.00)(6.00)}{10.00} = 2.400\,\text{kg}$$
  $$v_{\text{rel}} = 5.00 - 1.00 = 4.00\,\text{m/s}$$
  $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(2.400\,\text{kg})(4.00\,\text{m/s})^2 = 1.200 \times 16.0 = 19.20\,\text{J}$$
  Average force:
  $$F_{\text{damper}} = \frac{K_{\text{int}}}{s} = \frac{19.20\,\text{J}}{0.100\,\text{m}} = 192.0\,\text{N}$$

---

### Example 6.9: Target Recoil with Inelastic Scattering
**Problem:** In a materials testing lab, a steel sphere of mass $m_1 = 1.00\,\text{kg}$ traveling at $v_0 = 10.0\,\text{m/s}$ strikes a stationary composite target of mass $m_2 = 2.00\,\text{kg}$. The restitution coefficient is measured to be $e = 0.400$.
1. Compute the velocities of both masses after the collision.
2. Determine the ratio of the target's final kinetic energy to the projectile's initial kinetic energy.

**Solution:**
- **Step 1: Velocities**
  $$m_1 + m_2 = 3.00\,\text{kg}$$
  $$v_{1f} = \frac{m_1 - e m_2}{m_1 + m_2} v_0 = \frac{1.00 - (0.400)(2.00)}{3.00}(10.0) = \frac{1.00 - 0.800}{3.00}(10.0) = \frac{0.200}{3.00}(10.0) = +0.6667\,\text{m/s}$$
  $$v_{2f} = \frac{(1 + e)m_1}{m_1 + m_2} v_0 = \frac{(1 + 0.400)(1.00)}{3.00}(10.0) = \frac{1.400}{3.00}(10.0) = +4.6667\,\text{m/s}$$

- **Step 2: Energy transfer ratio**
  $$K_{1i} = \frac{1}{2}(1.00)(10.0)^2 = 50.0\,\text{J}$$
  $$K_{2f} = \frac{1}{2} m_2 v_{2f}^2 = \frac{1}{2}(2.00\,\text{kg})(4.6667\,\text{m/s})^2 = 21.778\,\text{J}$$
  $$\frac{K_{2f}}{K_{1i}} = \frac{21.778}{50.0} = 0.4356 \implies 43.56\%$$

---

### Example 6.10: Critical Restitution for Complete Projectile Arrest
**Problem:** Body 1 of mass $m_1$ moving at $v_{1i}$ strikes stationary Body 2 of mass $m_2$ ($v_{2i} = 0$).
1. Derive the condition relating $m_1, m_2$, and $e$ such that Body 1 comes to a **complete dead stop** immediately after the collision ($v_{1f} = 0$).
2. If $m_1 = 3.00\,\text{kg}$ and $m_2 = 5.00\,\text{kg}$, what must the coefficient of restitution $e^*$ be to completely halt Body 1?
3. What is the physical constraint on the mass ratio $m_1 / m_2$ for this dead-stop condition to be physically realizable?

**Solution:**
- **Step 1: Dead-stop condition**
  From Eq. 6.3 with $v_{2i} = 0$:
  $$v_{1f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1i}$$
  Setting $v_{1f} = 0$:
  $$m_1 - e m_2 = 0 \implies e^* = \frac{m_1}{m_2}$$

- **Step 2: Numerical evaluation**
  For $m_1 = 3.00\,\text{kg}$ and $m_2 = 5.00\,\text{kg}$:
  $$e^* = \frac{3.00\,\text{kg}}{5.00\,\text{kg}} = 0.600$$
  If the collision has $e = 0.600$, the incoming $3\,\text{kg}$ mass halts completely!

- **Step 3: Physical realizability constraint**
  Because the coefficient of restitution for non-explosive passive collisions must satisfy $0 \le e \le 1$:
  $$e^* = \frac{m_1}{m_2} \le 1.00 \implies m_1 \le m_2$$
  **Theorem:** A projectile can be brought to a complete dead stop in a 1D passive collision **only if its mass is less than or equal to the target mass** ($m_1 \le m_2$). If $m_1 > m_2$, $e^*$ would exceed 1, which is impossible without internal pyrotechnic energy!

---

## 6.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 6.8.

### Tier 1: Restitution Definitions & Bounces
- **Exercise 6.1:** A ball dropped from $2.00\,\text{m}$ rebounds to $1.28\,\text{m}$. Compute the restitution coefficient $e$.
- **Exercise 6.2:** Two clay spheres of mass $1.50\,\text{kg}$ ($v_1 = +4.00\,\text{m/s}$) and $2.50\,\text{kg}$ ($v_2 = -2.00\,\text{m/s}$) collide completely inelastically ($e = 0$). Find the final velocity.

### Tier 2: Partially Inelastic Velocity Calculations
- **Exercise 6.3:** A $2.00\,\text{kg}$ block moving at $6.00\,\text{m/s}$ strikes a stationary $4.00\,\text{kg}$ block with $e = 0.500$. Find the final velocities of both blocks.
- **Exercise 6.4:** In Exercise 6.3, compute the initial and final kinetic energies and determine the energy lost.

### Tier 3: Bouncing Series & Zeno Limits
- **Exercise 6.5:** A tennis ball with $e = 0.750$ is dropped from $h_0 = 2.50\,\text{m}$. Find the total distance it travels before coming to rest ($g = 9.81\,\text{m/s}^2$).
- **Exercise 6.6:** In Exercise 6.5, calculate the total time until all bounces cease.

### Tier 4: Energy Loss & Critical Conditions
- **Exercise 6.7:** A bullet of mass $0.010\,\text{kg}$ traveling at $500.0\,\text{m/s}$ embeds in a $2.00\,\text{kg}$ block of wood. What percentage of the initial kinetic energy is converted into heat?
- **Exercise 6.8:** A ball of mass $m_1 = 2.00\,\text{kg}$ strikes a stationary mass $m_2 = 8.00\,\text{kg}$. What restitution coefficient $e$ causes $m_1$ to stop completely?

### Tier 5: Multi-Stage Dissipation & Super-Elasticity
- **Exercise 6.9:** Two identical carts ($m = 1.00\,\text{kg}$) collide with a spring latch that releases $8.00\,\text{J}$ of energy during contact. If the carts approached with relative speed $2.00\,\text{m/s}$, compute the effective restitution $e$.
- **Exercise 6.10:** A heavy steel ball is dropped from height $H$ onto a massive plate that is vibrating vertically with frequency $f$ and amplitude $A$. Show that for $e < 1$, chaotic bouncing or subharmonic resonance occurs.

---

## 6.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 6.1
- **Given:** $h_0 = 2.00\,\text{m}$, $h_1 = 1.28\,\text{m}$.
- **Step 1: Restitution formula**
  $$e = \sqrt{\frac{h_1}{h_0}} = \sqrt{\frac{1.28}{2.00}} = \sqrt{0.640} = 0.800$$

---

### Solution 6.2
- **Given:** $m_1 = 1.50\,\text{kg}$, $v_1 = +4.00\,\text{m/s}$, $m_2 = 2.50\,\text{kg}$, $v_2 = -2.00\,\text{m/s}$, $e = 0$.
- **Step 1: Completely inelastic velocity**
  $$v_f = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \frac{(1.50)(+4.00) + (2.50)(-2.00)}{1.50 + 2.50} = \frac{6.00 - 5.00}{4.00} = \frac{+1.00}{4.00} = +0.250\,\text{m/s}$$

---

### Solution 6.3
- **Given:** $m_1 = 2.00\,\text{kg}$, $v_{1i} = 6.00\,\text{m/s}$, $m_2 = 4.00\,\text{kg}$, $v_{2i} = 0$, $e = 0.500$.
- **Step 1: Velocity formulas**
  $$m_1 + m_2 = 6.00\,\text{kg}$$
  $$v_{1f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1i} = \frac{2.00 - (0.500)(4.00)}{6.00}(6.00) = \frac{2.00 - 2.00}{6.00}(6.00) = 0.00\,\text{m/s}$$
  $$v_{2f} = \frac{(1 + e)m_1}{m_1 + m_2} v_{1i} = \frac{(1.500)(2.00)}{6.00}(6.00) = +3.00\,\text{m/s}$$
  Block 1 stops dead ($v_{1f} = 0$); Block 2 moves forward at $+3.00\,\text{m/s}$.

---

### Solution 6.4
- **Given:** Data from Exercise 6.3.
- **Step 1: Initial kinetic energy**
  $$K_{\text{init}} = \frac{1}{2} m_1 v_{1i}^2 = \frac{1}{2}(2.00\,\text{kg})(6.00\,\text{m/s})^2 = 36.0\,\text{J}$$
- **Step 2: Final kinetic energy**
  $$K_{\text{final}} = \frac{1}{2} m_2 v_{2f}^2 = \frac{1}{2}(4.00\,\text{kg})(3.00\,\text{m/s})^2 = 2.00 \times 9.00 = 18.0\,\text{J}$$
- **Step 3: Energy lost**
  $$\Delta K_{\text{loss}} = 36.0 - 18.0 = 18.0\,\text{J} \implies 50.0\% \text{ loss}$$

---

### Solution 6.5
- **Given:** $h_0 = 2.50\,\text{m}$, $e = 0.750$.
- **Step 1: Cumulative distance formula**
  $$e^2 = 0.750^2 = 0.5625$$
  $$D_{\text{total}} = h_0 \left(\frac{1 + e^2}{1 - e^2}\right) = (2.50\,\text{m})\left(\frac{1 + 0.5625}{1 - 0.5625}\right) = (2.50)\left(\frac{1.5625}{0.4375}\right) = 2.50 \times 3.5714 = 8.929\,\text{m}$$

---

### Solution 6.6
- **Given:** Data from Exercise 6.5, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Initial drop time**
  $$t_0 = \sqrt{\frac{2 h_0}{g}} = \sqrt{\frac{2(2.50)}{9.81}} = \sqrt{0.50968} = 0.7139\,\text{s}$$
- **Step 2: Total time**
  $$T_{\text{total}} = t_0 \left(\frac{1 + e}{1 - e}\right) = (0.7139\,\text{s})\left(\frac{1 + 0.750}{1 - 0.750}\right) = (0.7139)\left(\frac{1.750}{0.250}\right) = 0.7139 \times 7.00 = 4.997\,\text{s} \approx 5.00\,\text{s}$$

---

### Solution 6.7
- **Given:** $m = 0.010\,\text{kg}$, $v_0 = 500.0\,\text{m/s}$, $M = 2.00\,\text{kg}$, $e = 0$.
- **Step 1: Percentage of energy lost**
  For completely inelastic collisions into stationary targets:
  $$\text{Fraction Retained} = \frac{K_{\text{final}}}{K_{\text{init}}} = \frac{m}{m + M} = \frac{0.010}{0.010 + 2.00} = \frac{0.010}{2.010} = 0.004975 \implies 0.498\%$$
  $$\text{Percentage Converted to Heat} = 100\% - 0.498\% = 99.50\%$$

---

### Solution 6.8
- **Given:** $m_1 = 2.00\,\text{kg}$, $m_2 = 8.00\,\text{kg}$, $v_{1f} = 0$.
- **Step 1: Restitution condition**
  $$e = \frac{m_1}{m_2} = \frac{2.00\,\text{kg}}{8.00\,\text{kg}} = 0.250$$

---

### Solution 6.9
- **Given:** $m_1 = m_2 = 1.00\,\text{kg}$, $v_{\text{rel, init}} = 2.00\,\text{m/s}$, $\Delta E = 8.00\,\text{J}$.
- **Step 1: Reduced mass & initial internal energy**
  $$\mu = \frac{(1.00)(1.00)}{2.00} = 0.500\,\text{kg}$$
  $$K_{\text{int, init}} = \frac{1}{2} \mu v_{\text{rel, init}}^2 = \frac{1}{2}(0.500\,\text{kg})(2.00\,\text{m/s})^2 = 0.250 \times 4.00 = 1.00\,\text{J}$$
- **Step 2: Effective restitution**
  $$K_{\text{int, final}} = 1.00 + 8.00 = 9.00\,\text{J}$$
  $$e = \sqrt{\frac{K_{\text{int, final}}}{K_{\text{int, init}}}} = \sqrt{\frac{9.00}{1.00}} = \sqrt{9.00} = 3.00$$

---

### Solution 6.10
- **Proof:**
  Let the plate move as $y_p(t) = A \sin(2\pi f t)$.
  At each impact $k$ occurring at time $t_k$, the plate velocity is $v_p(t_k) = 2\pi f A \cos(2\pi f t_k)$.
  The relative rebound speed is $v_{k, \text{rebound}} - v_p(t_k) = -e(v_{k, \text{incident}} - v_p(t_k))$.
  Because the phase $2\pi f t_k$ depends non-linearly on the previous flight time $T_k = 2 v_{k, \text{rebound}} / g$, the iteration mapping $t_{k+1} = t_k + T_k$ forms a discrete non-linear circle map (the Fermi-Ulam-Pikovsky model). For $e < 1$, the Lyapunov exponent becomes positive above critical driving acceleration $4\pi^2 f^2 A > g$, driving the system through period-doubling bifurcations into deterministic chaos.
