# Chapter 08: Variable-Mass Systems and Rocket Propulsion

> "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever."  
> — Konstantin Eduardovich Tsiolkovsky (1911)

---

## 1. The Variable-Mass Dilemma: The Trap of $F = d(mv)/dt$

Throughout elementary physics, students are introduced to Newton's Second Law in two seemingly interchangeable forms:
$$\vec{F} = m\vec{a} \quad \text{and} \quad \vec{F} = \frac{d\vec{p}}{dt}$$

When mass $m$ is constant, both formulations agree identically because $\frac{d}{dt}(m\vec{v}) = m\frac{d\vec{v}}{dt} = m\vec{a}$. However, when the mass of a system changes dynamically over time ($dm/dt \ne 0$)—such as a rocket ejecting fiery exhaust, a falling raindrop accreting vapor, a sandhopper pouring gravel onto a moving conveyor belt, or an ablative heat shield vaporizing during atmospheric reentry—applying the product rule blindly:
$$\vec{F}_{\text{ext}} \stackrel{?}{=} m\frac{d\vec{v}}{dt} + \vec{v}\frac{dm}{dt} \quad \text{\textbf{(CATASTROPHIC ERROR)}}$$
leads to a fatal physical fallacy.

### 1.1 Why the Naive Product Rule Violates Galilean Relativity

To see why the naive formula is fatally flawed, suppose an astronaut in deep space throws a ball forward while drifting at constant velocity $\vec{v}$. In the astronaut's rest frame ($S$), $\vec{v} = 0$, so according to the formula, no mysterious phantom force appears. 

However, in a frame ($S'$) moving at relative velocity $-\vec{u}_0$, the astronaut has velocity $\vec{v}' = \vec{u}_0 \ne 0$. If the naive formula were true:
$$\vec{F}' = m\vec{a}' + \vec{u}_0 \frac{dm}{dt} \ne \vec{F}$$

This would mean the *net external force* acting on a body depends on the arbitrary inertial reference frame of the observer! But Galilean relativity demands that real physical forces (gravity, tension, pressure, electromagnetism) and accelerations are **frame-invariant**. 

Newton's formulation $\vec{F}_{\text{ext}} = d\vec{P}/dt$ applies strictly to a **closed system containing a fixed set of material particles**. To model open systems where mass crosses the system boundaries, we must track the momentum of both the primary body and the ejected or accreted mass.

---

## 2. Derivation of Meshchersky's Variable-Mass Equation of Motion

In 1897, the Russian mathematician and mechanician Ivan Vsevolodovich Meshchersky published the definitive equation of motion for bodies of continuously varying mass.

```
Time t:
+-------------------+
|      Mass m       | ----> Velocity v(t)
+-------------------+
Total Momentum P(t) = m v

Time t + dt:
+-------------+               +----+
|  Mass m+dm  | --> v + dv    | -dm| ----> Absolute velocity v_e
+-------------+               +----+
(Note: dm < 0)               (Ejected mass)
Total Momentum P(t + dt) = (m + dm)(v + dv) + (-dm) v_e
```

### 2.1 Control Volume Momentum Balance

Consider a rocket whose mass at time $t$ is $m(t)$ and whose velocity relative to an inertial reference frame is $\vec{v}(t)$.
1. **Momentum at time $t$:**
   $$\vec{P}(t) = m\vec{v}$$

2. **State at time $t + \Delta t$:**
   During the infinitesimal interval $\Delta t$, the rocket ejects mass $\Delta m_{\text{eject}} > 0$. The mass of the rocket changes by $\Delta m = -\Delta m_{\text{eject}} < 0$.
   - The rocket now has mass $m + \Delta m$ and velocity $\vec{v} + \Delta\vec{v}$.
   - The ejected exhaust has mass $-\Delta m$ and moves with absolute inertial velocity $\vec{v}_e$.
   
   The total momentum of the closed universe containing both the rocket and the expelled propellant is:
   $$\vec{P}(t + \Delta t) = (m + \Delta m)(\vec{v} + \Delta\vec{v}) + (-\Delta m)\vec{v}_e$$

3. **Expand and Retain First-Order Differentials:**
   $$\vec{P}(t + \Delta t) = m\vec{v} + m\,\Delta\vec{v} + \Delta m\,\vec{v} + \Delta m\,\Delta\vec{v} - \Delta m\,\vec{v}_e$$
   Dropping the second-order term $\Delta m\,\Delta\vec{v} \approx 0$:
   $$\vec{P}(t + \Delta t) - \vec{P}(t) = m\,\Delta\vec{v} + (\vec{v} - \vec{v}_e)\Delta m$$

4. **Relative Velocity Definition:**
   Define the **relative velocity of the exhaust** with respect to the rocket:
   $$\vec{v}_{\text{rel}} = \vec{v}_e - \vec{v} \implies \vec{v} - \vec{v}_e = -\vec{v}_{\text{rel}}$$
   Therefore:
   $$\Delta\vec{P} = m\,\Delta\vec{v} - \vec{v}_{\text{rel}}\,\Delta m$$

5. **Apply Newton's Second Law for the Closed System:**
   $$\vec{F}_{\text{ext}} = \lim_{\Delta t \to 0} \frac{\Delta\vec{P}}{\Delta t} = m\frac{d\vec{v}}{dt} - \vec{v}_{\text{rel}}\frac{dm}{dt}$$

Rearranging gives **Meshchersky's Fundamental Equation of Motion**:

$$m\frac{d\vec{v}}{dt} = \vec{F}_{\text{ext}} + \vec{v}_{\text{rel}}\frac{dm}{dt}$$

### 2.2 Physical Meaning of the Thrust Term

The term:
$$\vec{F}_{\text{thrust}} \equiv \vec{v}_{\text{rel}}\frac{dm}{dt}$$
is the **thrust force**.
- For a rocket expelling propellant backwards at relative speed $v_{\text{ex}}$:
  $$\vec{v}_{\text{rel}} = -v_{\text{ex}}\hat{u}_v$$
  Since mass is decreasing, $\frac{dm}{dt} < 0$.
  $$\vec{F}_{\text{thrust}} = (-v_{\text{ex}}\hat{u}_v)\left(\frac{dm}{dt}\right) = v_{\text{ex}} \left|\frac{dm}{dt}\right| \hat{u}_v$$
  The negative exhaust velocity and negative mass rate multiply to yield a **strictly positive forward thrust**!
- Because $\vec{v}_{\text{rel}}$ is measured strictly relative to the rocket, $\vec{F}_{\text{thrust}}$ is Galilean frame-invariant!

---

## 3. The Tsiolkovsky Rocket Equation: The Tyranny of the Exponential

In 1903, Konstantin Tsiolkovsky published *"The Exploration of Cosmic Space by Means of Reaction Devices"*, establishing the foundational law of spaceflight.

### 3.1 Ideal Rocket Flight in Vacuum ($\vec{F}_{\text{ext}} = 0$)

In deep space far from gravitational wells and atmospheric drag, $\vec{F}_{\text{ext}} = \vec{0}$. Meshchersky's 1D equation simplifies to:
$$m \frac{dv}{dt} = -v_{\text{ex}} \frac{dm}{dt}$$

Multiplying by $dt$ gives the differential relationship between velocity increment and fuel consumption:
$$dv = -v_{\text{ex}} \frac{dm}{m}$$

Integrating from initial mass $m_0$ (fuel + structure + payload) at speed $v_0 = 0$, to burnout mass $m_f$ (dry structure + payload) at final speed $v_f$:
$$\int_0^{\Delta v} dv = -v_{\text{ex}} \int_{m_0}^{m_f} \frac{dm}{m}$$
$$\Delta v = -v_{\text{ex}} [\ln(m_f) - \ln(m_0)] = v_{\text{ex}} [\ln(m_0) - \ln(m_f)]$$

$$\mathbf{\Delta v = v_{\text{ex}} \ln\left(\frac{m_0}{m_f}\right)}$$

### 3.2 The Mass Ratio and the "Tyranny"

Define the **Mass Ratio**:
$$R_m \equiv \frac{m_0}{m_f} \ge 1$$

Inverting Tsiolkovsky's equation yields the initial launch mass required to achieve a target velocity $\Delta v$:
$$m_0 = m_f \exp\left(\frac{\Delta v}{v_{\text{ex}}}\right)$$

This exponential dependence is known to aerospace engineers as the **Tyranny of the Rocket Equation**:
- To achieve $\Delta v = v_{\text{ex}}$: $R_m = e^1 \approx 2.72 \implies \text{propellant is } 63.2\%\text{ of launch mass}$.
- To achieve $\Delta v = 2 v_{\text{ex}}$: $R_m = e^2 \approx 7.39 \implies \text{propellant is } 86.5\%\text{ of launch mass}$.
- To achieve $\Delta v = 3 v_{\text{ex}}$: $R_m = e^3 \approx 20.09 \implies \text{propellant is } 95.0\%\text{ of launch mass}$.
- To achieve $\Delta v = 4 v_{\text{ex}}$: $R_m = e^4 \approx 54.60 \implies \text{propellant is } 98.2\%\text{ of launch mass}$.

Because low-Earth orbit requires $\Delta v \approx 9.4\text{ km/s}$ (including gravity/drag losses) and typical chemical rocket exhaust speeds are $v_{\text{ex}} \approx 3.0\text{ to }4.4\text{ km/s}$, an orbital chemical rocket must be over **$90\%$ to $95\%$ pure fuel by weight**!

### 3.3 Specific Impulse ($I_{\text{sp}}$)

Rocket engine efficiency is internationally cataloged using **Specific Impulse** ($I_{\text{sp}}$), defined as the thrust produced per unit weight of propellant consumed per second at sea level:
$$I_{\text{sp}} \equiv \frac{F_{\text{thrust}}}{\dot{m} g_0} = \frac{v_{\text{ex}} \dot{m}}{\dot{m} g_0} = \frac{v_{\text{ex}}}{g_0}$$
where $g_0 = 9.80665\text{ m/s}^2$ is standard Earth gravity.

Therefore:
$$v_{\text{ex}} = I_{\text{sp}} g_0$$

The Tsiolkovsky equation in terms of $I_{\text{sp}}$ is:
$$\Delta v = I_{\text{sp}} g_0 \ln\left(\frac{m_0}{m_f}\right)$$

| Propulsion Technology | Propellant | Typical $I_{\text{sp}}$ (s) | Effective $v_{\text{ex}}$ (m/s) |
|---|---|---|---|
| Solid Rocket Motor | APCP | $250 - 280$ | $2,450 - 2,750$ |
| Liquid Hydrocarbon | Kerosene / LOX (RP-1) | $300 - 330$ | $2,940 - 3,240$ |
| Liquid Methane | $\text{CH}_4$ / LOX | $350 - 380$ | $3,430 - 3,730$ |
| Hydrolox | $\text{LH}_2$ / LOX | $430 - 460$ | $4,220 - 4,510$ |
| Gridded Ion Engine | Xenon (Electrostatic) | $3,000 - 5,000$ | $29,400 - 49,000$ |

---

## 4. Vertical Ascent: Gravity Losses and Aerodynamic Drag

When launching from a planetary surface, two external forces oppose the motion: gravity $\vec{F}_g = -m g\hat{k}$ and aerodynamic drag $\vec{F}_d = -\frac{1}{2}\rho v^2 C_d A\hat{k}$.

Meshchersky's vertical equation of motion is:
$$m \frac{dv}{dt} = v_{\text{ex}} \left(-\frac{dm}{dt}\right) - m g - F_d(v, z)$$

Dividing by $m$ and integrating over the burn time from $t = 0$ to $t = t_b$:
$$v(t_b) = \int_0^{t_b} \frac{v_{\text{ex}}}{m}\left(-\frac{dm}{dt}\right) dt - \int_0^{t_b} g\,dt - \int_0^{t_b} \frac{F_d}{m}\,dt$$

$$\mathbf{v(t_b) = v_{\text{ex}}\ln\left(\frac{m_0}{m_f}\right) - \Delta v_{\text{grav}} - \Delta v_{\text{drag}}}$$

### 4.1 The Gravity Loss Penalty

Assuming constant gravity $g$, the **gravity loss** is:
$$\Delta v_{\text{grav}} = g\,t_b$$

This reveals a profound design trade-off:
- If a rocket burns its fuel slowly over a long time $t_b$ (low thrust-to-weight ratio $T/W$), the gravity loss $g\,t_b$ accumulates enormously, bleeding away precious velocity.
- To minimize gravity loss, a rocket should burn its propellant as rapidly as possible (short $t_b$, high $T/W$).
- However, excessively rapid burning through the dense lower atmosphere generates catastrophic aerodynamic drag losses and structural g-force loads. Orbital launch profiles optimize this compromise through gravity turns and throttle profiling (Max-Q management).

---

## 5. Multi-Stage Rocketry: Breaking the Mass Ratio Barrier

A single-stage-to-orbit (SSTO) rocket carrying its empty propellant tanks and heavy engines all the way to orbit faces extreme material limitations. The structural mass fraction $\epsilon = m_{\text{structure}} / (m_{\text{structure}} + m_{\text{fuel}})$ of modern aerospace alloys is typically $0.05 \text{ to } 0.10$.

### 5.1 Serial Staging Architecture

By dividing the vehicle into $N$ autonomous stages and jettisoning empty tanks and engines once spent, the payload of stage 1 becomes the entire rocket for stage 2.

```
+---------------+
|    Payload    |
+---------------+
|    Stage 3    |
+---------------+
|    Stage 2    |
+---------------+
|    Stage 1    |  <-- Highest thrust, fires first, dropped when empty
+---------------+
```

For an $N$-stage rocket where each stage $i$ has exhaust velocity $v_{\text{ex}, i}$, initial mass $m_{0, i}$, and burnout mass $m_{f, i}$ (before staging):
$$\mathbf{\Delta v_{\text{total}} = \sum_{i=1}^N \Delta v_i = \sum_{i=1}^N v_{\text{ex}, i} \ln\left(\frac{m_{0, i}}{m_{f, i}}\right)}$$

Because the natural logarithms sum together, multi-staging multiplies effective mass ratios, enabling humanity to reach escape velocity ($11.2\text{ km/s}$) and explore the solar system!

---

## 6. Mass Accretion: Continuous Ingestion Dynamics

Meshchersky's equation applies with equal elegance to systems that **gain** mass over time ($dm/dt > 0$).

### 6.1 The Hopper and Conveyor Belt Paradox

Consider a conveyor belt moving horizontally at constant speed $v_0$. Sand is continuously dropped vertically from a stationary hopper onto the belt at a constant mass rate $\sigma = \frac{dm}{dt}$.

```
               Hopper
               |  |
               v  v  (Sand drops vertically: v_e = 0)
        +-----------------------------> v0
     ======================================  Conveyor Belt
```

1. **Relative Velocity:**
   The incoming sand has zero horizontal velocity ($v_{ex} = 0$). Relative to the belt:
   $$v_{\text{rel}} = v_{ex} - v_0 = 0 - v_0 = -v_0$$
2. **Horizontal Force Required:**
   Since the belt moves at constant speed, $dv/dt = 0$:
   $$m(0) = F_{\text{ext}} + (-v_0)\frac{dm}{dt} \implies F_{\text{ext}} = v_0 \frac{dm}{dt} = \sigma v_0$$
   A driving motor must exert a constant force $F = \sigma v_0$ just to keep the belt moving!
3. **The 50% Thermodynamic Dissipation Rule:**
   - Power delivered by the motor:
     $$P_{\text{motor}} = F_{\text{ext}} v_0 = (\sigma v_0) v_0 = \sigma v_0^2$$
   - Rate of kinetic energy delivered to the sand:
     $$\frac{dK}{dt} = \frac{d}{dt}\left(\frac{1}{2} m v_0^2\right) = \frac{1}{2}\frac{dm}{dt} v_0^2 = \frac{1}{2} \sigma v_0^2$$
   - Power dissipated as heat through friction:
     $$P_{\text{friction}} = P_{\text{motor}} - \frac{dK}{dt} = \sigma v_0^2 - \frac{1}{2}\sigma v_0^2 = \frac{1}{2}\sigma v_0^2$$
   
**Fundamental Theorem:** *Whenever mass is continuously accelerated from rest to speed $v_0$ by an inelastic contact process (such as a conveyor belt, water scoop, or interstellar dust collector), exactly $50\%$ of the mechanical work done is inevitably converted into thermal energy through friction, regardless of the coefficient of friction!*

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 8.1: Basic Tsiolkovsky $\Delta v$ Calculation in Vacuum
*A deep-space probe has a total initial mass $m_0 = 4,500\text{ kg}$, which includes $3,000\text{ kg}$ of hydrazine propellant. Its thruster produces an exhaust velocity $v_{\text{ex}} = 3,100\text{ m/s}$. The probe fires in deep space until all fuel is consumed. Calculate: (a) the burnout mass $m_f$, (b) the mass ratio $R_m$, (c) the total change in velocity $\Delta v$, and (d) the percentage of initial mass that was propellant.*

#### Solution
1. **Given:**
   - $m_0 = 4,500\text{ kg}$
   - $m_{\text{fuel}} = 3,000\text{ kg}$
   - $v_{\text{ex}} = 3,100\text{ m/s}$
2. **Part (a): Burnout Mass:**
   $$m_f = m_0 - m_{\text{fuel}} = 4,500 - 3,000 = \mathbf{1,500\text{ kg}}$$
3. **Part (b): Mass Ratio:**
   $$R_m = \frac{m_0}{m_f} = \frac{4,500}{1,500} = \mathbf{3.000}$$
4. **Part (c): Velocity Increment:**
   $$\Delta v = v_{\text{ex}} \ln(R_m) = 3,100 \times \ln(3.000) = 3,100 \times 1.098612 \approx \mathbf{3,405.7\text{ m/s} \approx 3.41\text{ km/s}}$$
5. **Part (d): Propellant Percentage:**
   $$\% \text{fuel} = \frac{3,000}{4,500} \times 100\% = \mathbf{66.7\%}$$

---

### Worked Example 8.2: Specific Impulse and Burn Time
*A upper-stage rocket engine generates a constant thrust of $F_{\text{thrust}} = 65.0\text{ kN}$ with a specific impulse $I_{\text{sp}} = 450\text{ s}$. The initial mass of the stage is $m_0 = 18,000\text{ kg}$, and the dry burnout mass is $m_f = 2,500\text{ kg}$. (Take $g_0 = 9.80665\text{ m/s}^2$). Compute: (a) the effective exhaust velocity $v_{\text{ex}}$, (b) the propellant mass flow rate $\dot{m}$, (c) the total burn time $t_b$, and (d) the ideal vacuum $\Delta v$.*

#### Solution
1. **Part (a): Effective Exhaust Velocity:**
   $$v_{\text{ex}} = I_{\text{sp}} g_0 = 450 \times 9.80665 = \mathbf{4,412.99\text{ m/s} \approx 4,413\text{ m/s}}$$
2. **Part (b): Propellant Flow Rate:**
   $$F_{\text{thrust}} = \dot{m} v_{\text{ex}} \implies \dot{m} = \frac{F_{\text{thrust}}}{v_{\text{ex}}} = \frac{65,000\text{ N}}{4,412.99\text{ m/s}} \approx \mathbf{14.729\text{ kg/s}}$$
3. **Part (c): Total Burn Time:**
   - Propellant mass consumed: $m_{\text{fuel}} = m_0 - m_f = 18,000 - 2,500 = 15,500\text{ kg}$.
   $$t_b = \frac{m_{\text{fuel}}}{\dot{m}} = \frac{15,500\text{ kg}}{14.729\text{ kg/s}} \approx \mathbf{1,052.3\text{ s} \approx 17.54\text{ minutes}}$$
4. **Part (d): Ideal $\Delta v$:**
   $$R_m = \frac{18,000}{2,500} = 7.200$$
   $$\Delta v = v_{\text{ex}} \ln(R_m) = 4,412.99 \times \ln(7.200) = 4,412.99 \times 1.97408 \approx \mathbf{8,711.6\text{ m/s} \approx 8.71\text{ km/s}}$$

---

### Worked Example 8.3: Vertical Launch with Gravity Losses
*A sounding rocket of total launch mass $m_0 = 500\text{ kg}$ is fired vertically from rest. Its motor expels propellant at a constant rate $\dot{m} = 8.00\text{ kg/s}$ with an exhaust velocity $v_{\text{ex}} = 2,200\text{ m/s}$. The rocket carries $360\text{ kg}$ of fuel. Assuming constant $g = 9.80\text{ m/s}^2$ and neglecting air drag: (a) find the initial thrust and initial acceleration, (b) find the acceleration just before burnout, (c) determine the burnout time $t_b$, and (d) calculate the burnout velocity including gravity loss.*

#### Solution
1. **Given:**
   - $m_0 = 500\text{ kg}$, $m_{\text{fuel}} = 360\text{ kg} \implies m_f = 140\text{ kg}$
   - $\dot{m} = 8.00\text{ kg/s}$, $v_{\text{ex}} = 2,200\text{ m/s}$
   - $g = 9.80\text{ m/s}^2$
2. **Thrust Force:**
   $$F_{\text{thrust}} = \dot{m} v_{\text{ex}} = 8.00 \times 2,200 = 17,600\text{ N} = 17.6\text{ kN}$$
3. **Part (a): Initial Acceleration ($t = 0$):**
   $$a(0) = \frac{F_{\text{thrust}} - m_0 g}{m_0} = \frac{17,600 - (500)(9.80)}{500} = \frac{17,600 - 4,900}{500} = \frac{12,700}{500} = \mathbf{25.4\text{ m/s}^2}$$
4. **Part (b): Burnout Acceleration ($t = t_b$):**
   - Mass is now $m_f = 140\text{ kg}$.
   $$a(t_b) = \frac{F_{\text{thrust}} - m_f g}{m_f} = \frac{17,600 - (140)(9.80)}{140} = \frac{17,600 - 1,372}{140} = \frac{16,228}{140} \approx \mathbf{115.9\text{ m/s}^2}$$
   (Acceleration increases by more than a factor of 4.5 as the vehicle lightens!)
5. **Part (c): Burn Time:**
   $$t_b = \frac{m_{\text{fuel}}}{\dot{m}} = \frac{360}{8.00} = \mathbf{45.0\text{ s}}$$
6. **Part (d): Burnout Velocity:**
   - Ideal vacuum $\Delta v$:
     $$\Delta v_{\text{ideal}} = v_{\text{ex}} \ln\left(\frac{m_0}{m_f}\right) = 2,200 \times \ln\left(\frac{500}{140}\right) = 2,200 \times \ln(3.5714) = 2,200 \times 1.272966 \approx 2,800.5\text{ m/s}$$
   - Gravity loss:
     $$\Delta v_{\text{grav}} = g t_b = 9.80 \times 45.0 = 441.0\text{ m/s}$$
   - Actual burnout velocity:
     $$v(t_b) = \Delta v_{\text{ideal}} - \Delta v_{\text{grav}} = 2,800.5 - 441.0 = \mathbf{2,359.5\text{ m/s} \approx 2.36\text{ km/s}}$$

---

### Worked Example 8.4: Two-Stage Orbital Rocket Velocity Comparison
*Compare a single-stage rocket against a two-stage rocket, both having total launch mass $m_{\text{total}} = 100,000\text{ kg}$, both carrying payload $m_{\text{payload}} = 2,000\text{ kg}$, and all engines having $v_{\text{ex}} = 3,200\text{ m/s}$. Every stage has a structural fraction $\epsilon = 0.080$ (meaning structural dry mass is $8\%$ of that stage's propellant+structure mass). (a) For the single-stage rocket, find burnout mass and $\Delta v$. (b) For the two-stage rocket, assume Stage 1 has total mass $80,000\text{ kg}$ and Stage 2 has total mass $18,000\text{ kg}$ (with $2,000\text{ kg}$ payload). Find the total $\Delta v$.*

#### Solution
1. **Part (a): Single-Stage Rocket:**
   - Total mass $m_0 = 100,000\text{ kg}$.
   - Let $M_1 = m_0 - m_{\text{payload}} = 98,000\text{ kg}$ (fuel + structure).
   - Structural mass: $m_{\text{struct}} = 0.080 \times 98,000 = 7,840\text{ kg}$.
   - Fuel mass: $m_{\text{fuel}} = 98,000 - 7,840 = 90,160\text{ kg}$.
   - Dry burnout mass: $m_f = m_{\text{struct}} + m_{\text{payload}} = 7,840 + 2,000 = 9,840\text{ kg}$.
   - Velocity gain:
     $$\Delta v_{\text{single}} = 3,200 \ln\left(\frac{100,000}{9,840}\right) = 3,200 \ln(10.1626) = 3,200 \times 2.3187 \approx \mathbf{7,419.8\text{ m/s}}$$
     (Fails to reach low Earth orbit of $9.4\text{ km/s}$).
2. **Part (b): Two-Stage Rocket:**
   - **Stage 1:**
     - Stage 1 wet mass $M_1 = 80,000\text{ kg}$.
     - Stage 1 structure $m_{s1} = 0.080 \times 80,000 = 6,400\text{ kg}$.
     - Initial total mass $m_{0, 1} = 100,000\text{ kg}$.
     - Mass at Stage 1 burnout (before drop):
       $$m_{f, 1} = m_{0, 1} - m_{\text{fuel, 1}} = 100,000 - (80,000 - 6,400) = 100,000 - 73,600 = 26,400\text{ kg}$$
     - Velocity gain Stage 1:
       $$\Delta v_1 = 3,200 \ln\left(\frac{100,000}{26,400}\right) = 3,200 \ln(3.78788) = 3,200 \times 1.3318 \approx 4,261.7\text{ m/s}$$
   - **Staging:** Stage 1 structure ($6,400\text{ kg}$) is jettisoned.
     - New initial mass for Stage 2:
       $$m_{0, 2} = m_{f, 1} - m_{s1} = 26,400 - 6,400 = 20,000\text{ kg}$$
       (Which matches Stage 2 total mass $18,000\text{ kg} + 2,000\text{ kg}$ payload).
   - **Stage 2:**
     - Stage 2 structure: $m_{s2} = 0.080 \times 18,000 = 1,440\text{ kg}$.
     - Stage 2 fuel: $m_{\text{fuel, 2}} = 18,000 - 1,440 = 16,560\text{ kg}$.
     - Mass at Stage 2 burnout:
       $$m_{f, 2} = m_{s2} + m_{\text{payload}} = 1,440 + 2,000 = 3,440\text{ kg}$$
     - Velocity gain Stage 2:
       $$\Delta v_2 = 3,200 \ln\left(\frac{20,000}{3,440}\right) = 3,200 \ln(5.81395) = 3,200 \times 1.7603 \approx 5,632.9\text{ m/s}$$
3. **Total Velocity Gain:**
   $$\Delta v_{\text{total}} = \Delta v_1 + \Delta v_2 = 4,261.7 + 5,632.9 = \mathbf{9,894.6\text{ m/s} \approx 9.89\text{ km/s}}$$
4. **Comparison:**
   By shedding the useless $6,400\text{ kg}$ deadweight of Stage 1 tanks, the two-stage vehicle achieved an additional **$2,475\text{ m/s}$**, surpassing orbital velocity requirements with ease!

---

### Worked Example 8.5: Conveyor Belt Sand Deposition
*A conveyor belt runs horizontally at a steady speed of $v_0 = 2.50\text{ m/s}$. Dry sand falls vertically onto the belt from a chute at a steady rate of $\sigma = 40.0\text{ kg/s}$. Determine: (a) the horizontal force the motor must apply to maintain constant speed, (b) the power output of the motor, (c) the rate at which kinetic energy is imparted to the sand, and (d) the rate of thermal heat dissipation due to friction.*

#### Solution
1. **Part (a): Motor Force:**
   - Sand enters with horizontal velocity $v_x = 0$.
   - Relative exhaust/intake speed along motion: $v_{\text{rel}} = 0 - v_0 = -2.50\text{ m/s}$.
   - Mass growth rate: $dm/dt = +\sigma = +40.0\text{ kg/s}$.
   - For constant speed $dv/dt = 0$:
     $$F_{\text{ext}} = v_0 \frac{dm}{dt} = 2.50 \times 40.0 = \mathbf{100.0\text{ N}}$$
2. **Part (b): Mechanical Power of Motor:**
   $$P_{\text{motor}} = F_{\text{ext}} v_0 = 100.0 \times 2.50 = \mathbf{250.0\text{ W}}$$
3. **Part (c): Rate of Kinetic Energy Increase of Sand:**
   $$\frac{dK}{dt} = \frac{1}{2} \left(\frac{dm}{dt}\right) v_0^2 = \frac{1}{2} (40.0) (2.50)^2 = 20.0 \times 6.25 = \mathbf{125.0\text{ W}}$$
4. **Part (d): Thermal Dissipation Rate:**
   $$P_{\text{thermal}} = P_{\text{motor}} - \frac{dK}{dt} = 250.0 - 125.0 = \mathbf{125.0\text{ W}}$$
   (Exactly half the electrical work done by the motor is dissipated as frictional heat at the sand-belt boundary).

---

### Worked Example 8.6: Relativistic Ion Engine Fuel Efficiency
*A deep-space ion propulsion thruster on an interplanetary probe exhausts ionized xenon gas with an effective exhaust velocity $v_{\text{ex}} = 35.0\text{ km/s}$ ($I_{\text{sp}} \approx 3,569\text{ s}$). The probe has an initial wet mass $m_0 = 1,200\text{ kg}$ and requires a total velocity change $\Delta v = 7.00\text{ km/s}$. (a) Calculate the mass of xenon propellant required. (b) Compare this with the propellant mass that would be required by a standard chemical thruster with $v_{\text{ex}} = 3.50\text{ km/s}$.*

#### Solution
1. **Given:**
   - $m_0 = 1,200\text{ kg}$
   - $\Delta v = 7.00\text{ km/s} = 7,000\text{ m/s}$
2. **Part (a): Ion Engine ($v_{\text{ex}} = 35,000\text{ m/s}$):**
   - Mass ratio:
     $$R_m = \exp\left(\frac{\Delta v}{v_{\text{ex}}}\right) = \exp\left(\frac{7,000}{35,000}\right) = \exp(0.200) \approx 1.2214$$
   - Final dry mass:
     $$m_f = \frac{m_0}{R_m} = \frac{1,200}{1.2214} \approx 982.5\text{ kg}$$
   - Propellant required:
     $$m_{\text{fuel}} = m_0 - m_f = 1,200 - 982.5 = \mathbf{217.5\text{ kg}}$$
3. **Part (b): Chemical Engine ($v_{\text{ex}} = 3,500\text{ m/s}$):**
   - Mass ratio:
     $$R_m = \exp\left(\frac{7,000}{3,500}\right) = \exp(2.000) \approx 7.3891$$
   - Final dry mass:
     $$m_f = \frac{1,200}{7.3891} \approx 162.4\text{ kg}$$
   - Propellant required:
     $$m_{\text{fuel}} = 1,200 - 162.4 = \mathbf{1,037.6\text{ kg}}$$
4. **Conclusion:**
   The chemical engine would require $1,037.6\text{ kg}$ of fuel (leaving only $162\text{ kg}$ for spacecraft structure and scientific instruments), whereas the ion thruster accomplishes the identical mission with merely $217.5\text{ kg}$ of propellant!

---

### Worked Example 8.7: Falling Raindrop Accretion Dynamics
*A spherical raindrop of initial radius $r_0$ falls from rest through a stationary mist/cloud. As it falls, it sweeps up all water droplets in its cross-sectional path $\pi r^2$. Assuming the mist has uniform density $\rho_m$ and water has liquid density $\rho_w$, derive the differential equation for velocity $v$ and radius $r$, and show that after falling a long distance, its acceleration approaches a constant fraction of $g$.*

#### Solution
1. **Rate of Mass Accretion:**
   - In time $dt$, the drop sweeps a volume $dV = \pi r^2 (v\,dt)$.
   - Mass swept: $dm = \rho_m \pi r^2 v\,dt \implies \frac{dm}{dt} = \rho_m \pi r^2 v$.
   - Raindrop mass: $m = \frac{4}{3} \pi r^3 \rho_w \implies \frac{dm}{dt} = 4\pi r^2 \rho_w \frac{dr}{dt}$.
   - Equating:
     $$4\pi r^2 \rho_w \frac{dr}{dt} = \rho_m \pi r^2 v \implies \frac{dr}{dt} = \frac{\rho_m}{4\rho_w} v$$
   - Chain rule with height fallen $z$ ($dz = v\,dt$):
     $$\frac{dr}{dz} = \frac{\rho_m}{4\rho_w} = \text{constant} \implies r(z) = r_0 + k z$$
2. **Meshchersky Equation for Accreting Raindrop:**
   - Droplets are initially at rest in cloud $\implies v_{\text{rel}} = 0 - v = -v$.
   - Meshchersky:
     $$m \frac{dv}{dt} = m g + (-v)\frac{dm}{dt} \implies m \frac{dv}{dt} + v \frac{dm}{dt} = m g \implies \frac{d}{dt}(m v) = m g$$
     (Here, because accreted mass enters from rest, $\frac{d(mv)}{dt} = F_{\text{ext}}$ is valid!)
3. **Substitute $m(t)$ and Solve for Acceleration:**
   - Assume power-law solution $v = a_{\text{eff}} t$:
     $$r(t) = r_0 + \beta t^2 \implies m(t) \propto t^6 \text{ for large } t$$
   - Using $v \frac{dv}{dz} = \frac{1}{2} \frac{d(v^2)}{dz}$:
     $$m^2 v^2 = \int 2 m^2 g\,dz$$
   - For $m(z) \propto z^3$:
     $$v^2(z) = \frac{2g}{z^6} \int_0^z z'^6 dz' = \frac{2g}{z^6} \frac{z^7}{7} = \frac{2}{7} g z$$
   - Differentiating $v^2 = 2 a_{\text{eff}} z$:
     $$2 a_{\text{eff}} = \frac{2}{7} g \implies \mathbf{a_{\text{eff}} = \frac{1}{7} g \approx 0.143 g}$$
   - The drop accelerates steadily at exactly one-seventh of free-fall gravity!

---

### Worked Example 8.8: Freight Car with Leaking Water
*A railroad tank car of initial total mass $M_0 = 40,000\text{ kg}$ is rolling along a straight, level, frictionless track with initial speed $v_0 = 10.0\text{ m/s}$. Water begins leaking vertically out of a drain hole in the bottom at a steady rate of $\lambda = 50.0\text{ kg/s}$. Find: (a) the speed of the tank car after $200\text{ seconds}$, and (b) the horizontal force exerted on the car by the leaking water.*

#### Solution
1. **Analyze Relative Exhaust Velocity:**
   - The water drips straight down through the hole.
   - At the instant it detaches from the car, it possesses the identical forward horizontal velocity as the car: $v_{e, x} = v$.
   - Relative horizontal exhaust velocity:
     $$v_{\text{rel}, x} = v_{e, x} - v = v - v = 0$$
2. **Apply Meshchersky's Equation:**
   $$m \frac{dv}{dt} = F_{\text{ext}} + v_{\text{rel}, x} \frac{dm}{dt}$$
   - Frictionless track $\implies F_{\text{ext}} = 0$.
   - $v_{\text{rel}, x} = 0$.
   - Therefore:
     $$m \frac{dv}{dt} = 0 \implies \mathbf{\frac{dv}{dt} = 0 \implies v(t) = v_0 = 10.0\text{ m/s}}$$
3. **Conclusion:**
   - Part (a): The speed of the tank car after $200\text{ s}$ remains **strictly $10.0\text{ m/s}$**!
   - Part (b): The leaking water exerts **zero horizontal force** on the car!
4. **Physical Insight:**
   Mass is leaving the system carrying its own horizontal momentum with it ($dp_{\text{lost}} = v\,dm$). Therefore, the velocity of the remaining mass does not change at all. (Contrast this with sand dropped onto a belt, which enters with zero horizontal velocity and thus retards the vehicle).

---

### Worked Example 8.9: Hovering Rocket Condition and Throttle Profile
*A lunar lander of initial mass $m_0 = 10,000\text{ kg}$ descends toward the Moon's surface (where lunar gravity is $g_m = 1.62\text{ m/s}^2$). The lander's engine has exhaust velocity $v_{\text{ex}} = 3,000\text{ m/s}$. To perform a final terrain scan, the lander enters a stationary hover ($v = 0, dv/dt = 0$). (a) Find the initial propellant consumption rate $\dot{m}_0$ required to hover. (b) Find the mass $m(t)$ as a function of time during hover, and (c) determine how long the lander can hover if it has $2,000\text{ kg}$ of fuel reserved for the hover phase.*

#### Solution
1. **Hover Condition ($a = 0$):**
   $$F_{\text{thrust}} = m(t) g_m \implies v_{\text{ex}} \left(-\frac{dm}{dt}\right) = m(t) g_m$$
2. **Part (a): Initial Propellant Consumption Rate:**
   $$\dot{m}_0 = \frac{m_0 g_m}{v_{\text{ex}}} = \frac{10,000 \times 1.62}{3,000} = \frac{16,200}{3,000} = \mathbf{5.40\text{ kg/s}}$$
3. **Part (b): Mass as a Function of Time:**
   $$\frac{dm}{m} = -\frac{g_m}{v_{\text{ex}}} dt \implies \int_{m_0}^{m(t)} \frac{dm}{m} = -\frac{g_m}{v_{\text{ex}}} \int_0^t dt$$
   $$\ln\left(\frac{m(t)}{m_0}\right) = -\frac{g_m}{v_{\text{ex}}} t$$
   $$\mathbf{m(t) = m_0 \exp\left(-\frac{g_m}{v_{\text{ex}}} t\right)}$$
4. **Part (c): Maximum Hover Time for $2,000\text{ kg}$ Fuel:**
   - Final mass at end of hover: $m_f = 10,000 - 2,000 = 8,000\text{ kg}$.
   $$8,000 = 10,000 \exp\left(-\frac{1.62}{3,000} t_{\text{hover}}\right)$$
   $$0.800 = \exp(-0.000540\,t_{\text{hover}})$$
   $$\ln(0.800) = -0.223144 = -0.000540\,t_{\text{hover}}$$
   $$t_{\text{hover}} = \frac{0.223144}{0.000540} \approx \mathbf{413.2\text{ s} \approx 6.89\text{ minutes}}$$

---

### Worked Example 8.10: Uncoiling Chain Lifted from Floor
*A flexible, uniform heavy chain of total length $L = 5.00\text{ m}$ and total mass $M = 10.0\text{ kg}$ lies coiled in a heap on the floor. A crane lifts one end vertically at a constant speed $v_0 = 3.00\text{ m/s}$. (a) Find the tension force $T(y)$ exerted by the crane as a function of the height $y$ of the lifted end ($0 \le y \le L$). (b) Calculate the maximum tension experienced during the lift. (Take $g = 9.80\text{ m/s}^2$).*

#### Solution
1. **Identify System and Variable Mass:**
   - Linear mass density: $\mu = \frac{M}{L} = \frac{10.0\text{ kg}}{5.00\text{ m}} = 2.00\text{ kg/m}$.
   - At height $y$, the length of suspended chain is $y$, and its mass is $m(y) = \mu y$.
   - Rate of mass entering motion:
     $$\frac{dm}{dt} = \mu \frac{dy}{dt} = \mu v_0$$
2. **Apply Meshchersky Equation to Suspended Chain:**
   - Uncoiling links are snatched from rest ($v_{\text{link}} = 0$) into the upward stream ($v_0$).
   - Relative velocity of added links: $v_{\text{rel}} = 0 - v_0 = -v_0$.
   - External forces on suspended chain: Tension $T$ upward, gravity $-m(y)g$ downward.
   - Equation of motion:
     $$m \frac{dv}{dt} = T - m(y)g + v_{\text{rel}}\frac{dm}{dt}$$
   - Since $v = v_0 = \text{constant}$, $dv/dt = 0$:
     $$0 = T - \mu y g + (-v_0)(\mu v_0)$$
     $$\mathbf{T(y) = \mu y g + \mu v_0^2}$$
3. **Physical Decomposition of Tension:**
   - Static weight term: $W(y) = \mu y g$ (weight of chain currently hanging in air).
   - Dynamic impulsive term: $F_{\text{impulse}} = \mu v_0^2$ (continuous momentum transfer rate needed to accelerate resting links to speed $v_0$).
4. **Part (b): Numerical Maximum Tension at $y = L = 5.00\text{ m}$:**
   - Static weight: $W_{\max} = (2.00)(5.00)(9.80) = 98.0\text{ N}$.
   - Dynamic momentum rate: $F_{\text{impulse}} = (2.00)(3.00)^2 = 2.00 \times 9.00 = 18.0\text{ N}$.
   - Maximum Tension:
     $$T_{\max} = 98.0 + 18.0 = \mathbf{116.0\text{ N}}$$

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 8.1:** Why does an astronaut throwing a wrench in space experience acceleration, whereas a flatbed railcar losing loose sand through a hole in its floor experiences no change in speed?  
**Exercise 8.2:** Explain why an electric ion thruster with very low thrust ($< 1\text{ N}$) can propel a spacecraft to much higher final speeds than a massive chemical rocket motor generating millions of Newtons of thrust.

### Tier 2: Quantitative Mechanics
**Exercise 8.3:** A satellite of dry mass $m_f = 600\text{ kg}$ requires a total $\Delta v = 1,800\text{ m/s}$ for orbital station-keeping over its 15-year lifetime. If its chemical thrusters have $I_{\text{sp}} = 310\text{ s}$, calculate the required initial wet mass $m_0$ and the mass of propellant that must be loaded at launch.  
**Exercise 8.4:** A rocket sled of initial mass $m_0 = 800\text{ kg}$ is accelerated from rest along a horizontal frictionless track by a solid rocket motor that expels $30.0\text{ kg/s}$ of exhaust at $v_{\text{ex}} = 2,400\text{ m/s}$. The motor burns for $t_b = 12.0\text{ s}$. Find: (a) the thrust force, (b) the burnout mass, and (c) the speed at burnout.

### Tier 3: Multi-Stage Dynamics
**Exercise 8.5:** A two-stage sounding rocket has total launch mass $m_0 = 3,000\text{ kg}$. Stage 1 has propellant mass $1,800\text{ kg}$ and dry structure $300\text{ kg}$. Stage 2 has propellant mass $650\text{ kg}$, dry structure $100\text{ kg}$, and payload $150\text{ kg}$. Both stages have $v_{\text{ex}} = 2,600\text{ m/s}$. Neglecting gravity and drag, compute the final speed achieved by the payload starting from rest.  
**Exercise 8.6:** A vertical test rocket launches from Earth with initial thrust-to-weight ratio $(T/W)_0 = 1.80$. The motor has constant exhaust velocity $v_{\text{ex}} = 2,500\text{ m/s}$ and burns for $t_b = 60.0\text{ s}$. Assuming uniform $g = 9.80\text{ m/s}^2$ and neglecting air drag, calculate: (a) the propellant mass fraction $m_{\text{fuel}} / m_0$, and (b) the final burnout velocity.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 8.7:** A snowball of mass $M_0$ rolls down a snow-covered hill of slope $\theta$. As it rolls, it accretes snow at a rate proportional to its speed: $dm/dt = \alpha v$, where $\alpha$ is a constant. Assuming the accreted snow is initially at rest, find the terminal velocity of the snowball.  
**Exercise 8.8:** An open railway car of mass $M_0$ rolls frictionlessly along a horizontal track at initial speed $v_0$. A torrential downpour begins, depositing rain vertically into the car at a constant mass rate $R = dm/dt$. Derive an exact expression for the car's velocity $v(t)$ as a function of time.

### Tier 5: Olympiad / Research Challenge
**Exercise 8.9:** A heavy flexible rope of mass $M$ and length $L$ hangs vertically with its bottom end just touching a scale. The rope is released from rest from its top end. Find the reading on the scale as a function of the distance $x$ through which the top of the rope has fallen ($0 \le x \le L$), and show that at the exact instant the top end strikes the scale, the scale reads exactly **three times the total static weight of the rope**!  
**Exercise 8.10:** Derivation of the Optimal Staging Ratio: Consider an $N$-stage rocket with identical exhaust velocities $v_{\text{ex}}$ and identical structural fractions $\epsilon$ for every stage. Prove that to maximize the final payload velocity $\Delta v_{\text{total}}$ for a given total mass ratio, all $N$ stages must have **identical individual mass ratios** $R_{m, i} = R_m^{1/N}$, and determine the optimal payload fraction $\lambda^*$.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 8.1
The crucial distinction lies in the **relative velocity of the mass crossing the boundary**:
1. When an astronaut throws a wrench forward at relative velocity $\vec{v}_{\text{rel}} \ne 0$, the thrown wrench carries momentum away from the astronaut in the forward direction. By conservation of momentum (Meshchersky thrust $\vec{F}_{\text{thrust}} = \vec{v}_{\text{rel}} \dot{m}$), the astronaut accelerates backward.
2. In contrast, when water or sand drains vertically out of a flatbed railcar moving horizontally at speed $v$, the exiting mass leaves with horizontal velocity equal to $v$. Therefore, relative to the railcar, $v_{\text{rel}, x} = v_{\text{exit}, x} - v = v - v = 0$. Because $\vec{v}_{\text{rel}} = 0$, the thrust force is identically zero ($\vec{F}_{\text{thrust}} = 0$). The remaining mass continues rolling at the same speed $v$.

---

### Solution to Exercise 8.2
By Tsiolkovsky's equation $\Delta v = v_{\text{ex}} \ln(m_0 / m_f)$, the ultimate velocity a spacecraft can achieve is directly proportional to the **exhaust velocity** $v_{\text{ex}}$ (or specific impulse $I_{\text{sp}}$). Chemical rockets have high thrust because they burn massive amounts of propellant per second ($\dot{m}$ is huge), but their exhaust velocity is fundamentally limited by chemical bond energies ($v_{\text{ex}} \le 4,500\text{ m/s}$). Ion thrusters use electrostatic fields to accelerate ions to colossal exhaust velocities ($v_{\text{ex}} \ge 35,000\text{ to } 50,000\text{ m/s}$). Even though their thrust is tiny, they can burn continuously for months in deep space, yielding a massive $\Delta v$ while consuming a minuscule fraction of propellant mass.

---

### Solution to Exercise 8.3
1. **Given:**
   - $m_f = 600\text{ kg}$
   - $\Delta v = 1,800\text{ m/s}$
   - $I_{\text{sp}} = 310\text{ s} \implies v_{\text{ex}} = I_{\text{sp}} g_0 = 310 \times 9.80665 \approx 3,040.06\text{ m/s}$
2. **Compute Mass Ratio:**
   $$R_m = \exp\left(\frac{\Delta v}{v_{\text{ex}}}\right) = \exp\left(\frac{1,800}{3,040.06}\right) = \exp(0.59209) \approx 1.80777$$
3. **Compute Initial Wet Mass:**
   $$m_0 = m_f R_m = 600 \times 1.80777 \approx \mathbf{1,084.7\text{ kg}}$$
4. **Propellant Mass:**
   $$m_{\text{fuel}} = m_0 - m_f = 1,084.7 - 600 = \mathbf{484.7\text{ kg}}$$

---

### Solution to Exercise 8.4
1. **Part (a): Thrust Force:**
   $$F_{\text{thrust}} = \dot{m} v_{\text{ex}} = 30.0 \times 2,400 = \mathbf{72,000\text{ N} = 72.0\text{ kN}}$$
2. **Part (b): Burnout Mass:**
   - Propellant consumed: $m_{\text{fuel}} = \dot{m} t_b = 30.0 \times 12.0 = 360.0\text{ kg}$.
   $$m_f = m_0 - m_{\text{fuel}} = 800.0 - 360.0 = \mathbf{440.0\text{ kg}}$$
3. **Part (c): Speed at Burnout:**
   - Horizontal frictionless track $\implies F_{\text{ext}} = 0$.
   $$v(t_b) = v_{\text{ex}} \ln\left(\frac{m_0}{m_f}\right) = 2,400 \ln\left(\frac{800}{440}\right) = 2,400 \ln(1.81818) = 2,400 \times 0.597837 \approx \mathbf{1,434.8\text{ m/s}}$$

---

### Solution to Exercise 8.5
1. **Stage 1 Flight:**
   - Total initial mass: $m_{0, 1} = 3,000\text{ kg}$.
   - Stage 1 propellant: $1,800\text{ kg}$.
   - Mass at Stage 1 burnout: $m_{f, 1} = 3,000 - 1,800 = 1,200\text{ kg}$.
   $$\Delta v_1 = 2,600 \ln\left(\frac{3,000}{1,200}\right) = 2,600 \ln(2.500) = 2,600 \times 0.91629 \approx 2,382.4\text{ m/s}$$
2. **Staging:**
   - Stage 1 dry structure ($300\text{ kg}$) is discarded.
   - Stage 2 initial mass: $m_{0, 2} = 1,200 - 300 = 900\text{ kg}$.
     (Check: Stage 2 prop $650$ + struct $100$ + payload $150 = 900\text{ kg}$).
3. **Stage 2 Flight:**
   - Mass at Stage 2 burnout: $m_{f, 2} = 100 + 150 = 250\text{ kg}$.
   $$\Delta v_2 = 2,600 \ln\left(\frac{900}{250}\right) = 2,600 \ln(3.600) = 2,600 \times 1.28093 \approx 3,330.4\text{ m/s}$$
4. **Total Velocity:**
   $$v_{\text{final}} = \Delta v_1 + \Delta v_2 = 2,382.4 + 3,330.4 = \mathbf{5,712.8\text{ m/s} \approx 5.71\text{ km/s}}$$

---

### Solution to Exercise 8.6
1. **Given:**
   - $(T/W)_0 = \frac{F_{\text{thrust}}}{m_0 g} = 1.80 \implies F_{\text{thrust}} = 1.80 m_0 g$.
   - $F_{\text{thrust}} = \dot{m} v_{\text{ex}} \implies \dot{m} = \frac{1.80 m_0 g}{v_{\text{ex}}}$.
2. **Part (a): Propellant Mass Fraction:**
   - Total fuel burned in $t_b = 60.0\text{ s}$:
     $$m_{\text{fuel}} = \dot{m} t_b = \frac{1.80 m_0 g t_b}{v_{\text{ex}}}$$
     $$\frac{m_{\text{fuel}}}{m_0} = \frac{1.80 \times 9.80 \times 60.0}{2,500} = \frac{1,058.4}{2,500} = \mathbf{0.42336 = 42.3\%}$$
3. **Part (b): Burnout Velocity:**
   - Final mass ratio:
     $$\frac{m_f}{m_0} = 1 - 0.42336 = 0.57664 \implies R_m = \frac{1}{0.57664} \approx 1.73418$$
   - Ideal velocity:
     $$\Delta v_{\text{ideal}} = 2,500 \ln(1.73418) = 2,500 \times 0.55054 \approx 1,376.3\text{ m/s}$$
   - Gravity loss:
     $$\Delta v_{\text{grav}} = g t_b = 9.80 \times 60.0 = 588.0\text{ m/s}$$
   - Actual velocity:
     $$v(t_b) = 1,376.3 - 588.0 = \mathbf{788.3\text{ m/s}}$$

---

### Solution to Exercise 8.7
1. **Set Up Meshchersky Equation:**
   - Along slope $\theta$: gravity component is $+m g \sin\theta$.
   - Accreted snow enters from rest $\implies v_{\text{rel}} = -v$.
   - $m \frac{dv}{dt} = m g \sin\theta + (-v)\left(\frac{dm}{dt}\right)$.
2. **Terminal Velocity Condition ($dv/dt = 0$):**
   $$0 = m g \sin\theta - v_{\text{term}} \left(\frac{dm}{dt}\right)$$
3. **Substitute $dm/dt = \alpha v$:**
   $$m g \sin\theta = v_{\text{term}} (\alpha v_{\text{term}}) = \alpha v_{\text{term}}^2$$
   $$\mathbf{v_{\text{term}} = \sqrt{\frac{m g \sin\theta}{\alpha}}}$$

---

### Solution to Exercise 8.8
1. **Dynamics of Rain Ingestion:**
   - Rain falls vertically $\implies v_{\text{rel}, x} = 0 - v = -v$.
   - Frictionless track $\implies F_{\text{ext}, x} = 0$.
   - Meshchersky:
     $$m(t) \frac{dv}{dt} = 0 + (-v)\frac{dm}{dt} \implies m(t) \frac{dv}{dt} + v \frac{dm}{dt} = 0 \implies \frac{d}{dt}(m v) = 0$$
2. **Linear Momentum is Strictly Conserved:**
   $$m(t) v(t) = M_0 v_0 = \text{constant}$$
3. **Mass as Function of Time:**
   $$m(t) = M_0 + R t$$
4. **Velocity Profile:**
   $$\mathbf{v(t) = \frac{M_0 v_0}{M_0 + R t} = \frac{v_0}{1 + \frac{R}{M_0} t}}$$

---

### Solution to Exercise 8.9
1. **Kinematics of Falling Top End:**
   - Free-fall from rest under gravity $g$:
     $$v(x) = \sqrt{2gx}$$
2. **Two Contributions to Scale Force $F_{\text{scale}}$:**
   - **Contribution 1: Static Weight of Coiled Rope on Scale:**
     Length on scale is $x \implies W_{\text{static}} = \mu x g$, where $\mu = M/L$.
   - **Contribution 2: Dynamic Impulsive Impact Force:**
     Chain elements strike the scale at speed $v(x)$ and come to rest immediately ($v_f = 0$).
     $$F_{\text{impulse}} = \frac{dp}{dt} = v \frac{dm}{dt} = v \left(\mu \frac{dx}{dt}\right) = \mu v^2$$
3. **Substitute $v^2 = 2gx$ into Impulsive Force:**
   $$F_{\text{impulse}} = \mu (2gx) = 2 \mu x g$$
4. **Total Reading on Scale:**
   $$F_{\text{total}}(x) = W_{\text{static}} + F_{\text{impulse}} = \mu x g + 2\mu x g = \mathbf{3 \mu x g}$$
5. **Evaluation at Instant Top Strikes Scale ($x = L$):**
   $$F_{\text{total}}(L) = 3 \mu L g = 3 M g$$
   The scale registers exactly **$3$ times the total weight of the rope**!

---

### Solution to Exercise 8.10
1. **Total Velocity Expression:**
   $$\Delta v_{\text{total}} = \sum_{i=1}^N v_{\text{ex}} \ln(R_{m, i}) = v_{\text{ex}} \ln\left(\prod_{i=1}^N R_{m, i}\right)$$
2. **Optimization:**
   - Let total payload ratio be $\Lambda = \prod_{i=1}^N \lambda_i$.
   - To maximize a product of variables $\prod R_{m, i}$ subject to fixed structural fraction $\epsilon$, symmetry of the logarithmic derivative requires that each term must be equal:
     $$R_{m, 1} = R_{m, 2} = \dots = R_{m, N} = R_m^{1/N}$$
3. **Optimum Velocity:**
   $$\mathbf{\Delta v_{\text{total}} = N v_{\text{ex}} \ln\left(R_{m, i}\right)}$$
   This proves that identical mass ratios per stage achieve the absolute theoretical maximum payload injection velocity.
