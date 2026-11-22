# Chapter 03: Conservation of Momentum in Isolated Systems — Recoil Mechanics, Fragmentation, and Component Invariance

> *"In the grand ledger of the cosmos, linear momentum is a conserved currency. A closed physical system may shatter, ignite, or collide; its constituent particles may trade velocities in violent exchange; yet its total vector momentum remains immutably frozen in time."*

---

## 3.1 The Sacred Conservation Principle and Newton's Third Law

In Chapter 01, we established that when a physical system is shielded from external forces ($\sum \vec{F}_{\text{ext}} = \vec{0}$), its total linear momentum $\vec{P}_{\text{total}}$ is strictly invariant. It is essential to recognize that **the conservation of linear momentum is the direct mathematical child of Newton’s Third Law of Motion**.

Consider two isolated interacting bodies, $m_1$ and $m_2$, moving through deep space with velocities $\vec{v}_1$ and $\vec{v}_2$. They exert forces on one another—perhaps through gravitational attraction, electrostatic repulsion, a stretched elastic cord, or direct physical impact.

```
                  +F_12                                  -F_21 = +F_12
       [ Body 1 ] <---===== Interaction Force =====---> [ Body 2 ]
        (mass m1)           F_12 = -F_21 (Lex III)       (mass m2)
```

Applying Newton’s Second Law to each body independently:

$$\frac{d\vec{p}_1}{dt} = \vec{F}_{2 \to 1}$$

$$\frac{d\vec{p}_2}{dt} = \vec{F}_{1 \to 2}$$

Now sum the two equations:

$$\frac{d\vec{p}_1}{dt} + \frac{d\vec{p}_2}{dt} = \frac{d}{dt}\left( \vec{p}_1 + \vec{p}_2 \right) = \vec{F}_{2 \to 1} + \vec{F}_{1 \to 2}$$

By Newton’s Third Law (Lex III), the force exerted by Body 2 on Body 1 is strictly equal in magnitude and opposite in direction to the force exerted by Body 1 on Body 2:

$$\vec{F}_{2 \to 1} = -\vec{F}_{1 \to 2} \implies \vec{F}_{2 \to 1} + \vec{F}_{1 \to 2} \equiv \vec{0}$$

Consequently:

$$\frac{d}{dt}\left( \vec{p}_1 + \vec{p}_2 \right) = \vec{0} \implies \vec{p}_1(t) + \vec{p}_2(t) = \text{constant}$$

This mathematical derivation holds for any arbitrary number of bodies $N$. For any closed, isolated system:

$$\vec{P}_{\text{total}} = \sum_{i=1}^N m_i \vec{v}_i = \text{constant}$$

The total momentum before an interaction must identically match the total momentum after the interaction:

$$\sum_{i=1}^N m_i \vec{v}_{i,\text{initial}} = \sum_{i=1}^N m_i \vec{v}_{i,\text{final}}$$

---

## 3.2 The Physics of Recoil: Firearms, Rockets, and Planetary Backlash

The most immediate and striking consequence of momentum conservation in a system initially at rest is **Recoil**.

Consider a rifle of mass $M$ loaded with a bullet of mass $m$. Initially, the rifle and bullet are at complete rest on a frictionless bench:

$$\vec{P}_{\text{initial}} = \vec{0}$$

When the trigger is pulled, expanding propellant gases exert an internal pressure force between the breech of the rifle and the base of the bullet. Because the expanding gas is entirely internal to the system:

$$\vec{P}_{\text{final}} = M \vec{V}_{\text{recoil}} + m \vec{v}_{\text{bullet}} = \vec{P}_{\text{initial}} = \vec{0}$$

Solving for the rifle’s recoil velocity:

$$\vec{V}_{\text{recoil}} = -\frac{m}{M} \vec{v}_{\text{bullet}}$$

1. **Directional Inversion:** The negative sign indicates that the rifle must inevitably lurch backward in the exact opposite direction to the bullet's departure.
2. **Mass Ratio Scaling:** The recoil speed is scaled down by the ratio of masses:
   $$V_{\text{recoil}} = \left(\frac{m}{M}\right) v_{\text{bullet}}$$
   If a $0.010\,\text{kg}$ bullet is fired from a $4.0\,\text{kg}$ rifle ($M/m = 400$) at $800\,\text{m/s}$, the rifle recoils at $V_{\text{recoil}} = 800 / 400 = 2.0\,\text{m/s}$.

```
                 P_initial = 0 (System at Rest)
                 +---------------------------------------+
                 | [ Rifle M ]       * Bullet m          |
                 +---------------------------------------+

                 P_final = M * V_recoil + m * v_bullet = 0
       <--- V_recoil                                 v_bullet --->
       [ Rifle M ]                                   * Bullet m
       Momentum: -M * V_recoil                       Momentum: +m * v_bullet
```

### The Kinetic Energy Asymmetry Paradox
A classic question arises: *If the rifle and the bullet receive equal and opposite quantities of linear momentum ($|p_{\text{rifle}}| = |p_{\text{bullet}}|$), why does the bullet kill its target while the rifle merely delivers a firm shove to the shooter’s shoulder?*

The answer lies in the fundamental difference between **momentum** ($p \propto v$) and **kinetic energy** ($K \propto v^2$).

Recall from Chapter 01 (Example 1.5) that kinetic energy can be expressed directly in terms of momentum:

$$K = \frac{p^2}{2m}$$

Because the magnitude of momentum $p$ is identical for both bodies ($p_{\text{rifle}} = p_{\text{bullet}} = p$):

$$K_{\text{bullet}} = \frac{p^2}{2m}, \qquad K_{\text{rifle}} = \frac{p^2}{2M}$$

Take the ratio of their kinetic energies:

$$\frac{K_{\text{rifle}}}{K_{\text{bullet}}} = \frac{\frac{p^2}{2M}}{\frac{p^2}{2m}} = \frac{m}{M}$$

$$\frac{K_{\text{rifle}}}{K_{\text{bullet}}} = \frac{m}{M} \ll 1$$

**The Recoil Energy Partition Theorem:**
> *When two bodies push apart from rest under internal forces, the chemical energy of the propellant is partitioned in inverse proportion to their masses. The lighter body carries away the vast majority of the kinetic energy ($K \propto 1/m$).*

In our rifle example ($m = 0.010\,\text{kg}$, $M = 4.0\,\text{kg}$, $m/M = 1/400$):
- Bullet kinetic energy: $K_{\text{bullet}} = \frac{1}{2}(0.010)(800)^2 = 3200\,\text{J}$.
- Rifle kinetic energy: $K_{\text{rifle}} = \frac{1}{2}(4.0)(2.0)^2 = 8.0\,\text{J}$.
- Ratio: $\frac{8.0}{3200} = \frac{1}{400} = 0.25\%$.

The bullet absorbs **$99.75\%$ of the explosive energy**, while the rifle absorbs barely **$0.25\%$**! This extreme energy asymmetry explains why firearms are lethally effective while remaining safe for the marksman.

### Planetary Recoil
What happens when you jump upward off the ground with velocity $v_{\text{human}} = 3.0\,\text{m/s}$?
By momentum conservation, the entire planet Earth ($M_E \approx 5.972 \times 10^{24}\,\text{kg}$) must recoil downward!
If your mass is $m = 70.0\,\text{kg}$:

$$V_{\text{Earth}} = -\frac{m}{M_E} v_{\text{human}} = -\frac{70.0\,\text{kg}}{5.972 \times 10^{24}\,\text{kg}} (3.0\,\text{m/s}) \approx -3.5 \times 10^{-23}\,\text{m/s}$$

Earth recoils by a distance on the order of $10^{-23}\,\text{meters}$ (sub-atomic fraction of a proton radius), completely unmeasurable, but mathematically absolute.

---

## 3.3 Explosions, Fragmentation, and Radioactive Recoil

In an explosive event—whether a geological volcano, a fragmented military mortar shell, or an alpha-decaying heavy atomic nucleus—an internal potential energy source (chemical, thermal, or nuclear) detonates, expelling fragments in multiple directions.

```
       Before Blast: Parent Mass M at velocity V0
       ( * ) ---> P_init = M * V0

       After Blast: Fragments m1, m2, m3
                   p1 ^
                     /  * (m1, v1)
                    /
                   * -----> p2 (m2, v2)
                    \
                     \  * (m3, v3)
                   p3 v
       Vector Balance: P_init = p1 + p2 + p3
```

Because the explosion is generated purely by internal chemical or nuclear forces, the vector sum of all fragment momenta must identically equal the initial momentum of the parent body:

$$\vec{P}_{\text{parent}} = \sum_{k=1}^N m_k \vec{v}_k$$

### Alpha Decay and Nuclear Recoil
In nuclear physics, when an unstable radium nucleus ($^{226}\text{Ra}$) undergoes alpha decay at rest:

$$^{226}\text{Ra} \longrightarrow \, ^{222}\text{Rn} + \, \alpha \, (^{4}\text{He})$$

The alpha particle ($m_\alpha \approx 4\,\text{u}$) and the radon daughter nucleus ($m_{\text{Rn}} \approx 222\,\text{u}$) must fly apart in diametrically opposite directions with equal and opposite momenta:

$$\vec{p}_\alpha + \vec{p}_{\text{Rn}} = \vec{0} \implies p_\alpha = p_{\text{Rn}}$$

The kinetic energy ratio:

$$\frac{K_{\text{Rn}}}{K_\alpha} = \frac{m_\alpha}{m_{\text{Rn}}} = \frac{4}{222} \approx 0.018$$

The lightweight alpha particle carries away over $98.2\%$ of the total nuclear $Q$-value energy!

---

## 3.4 Component-Wise Conservation: The Orthogonal Decoupling Principle

A common misconception among physics students is the belief that momentum conservation is an "all-or-nothing" rule: that if an external force acts on a system, momentum conservation cannot be used.

**This assumption is completely false.** Because momentum is a **vector equation**:

$$\frac{d\vec{P}}{dt} = \sum \vec{F}_{\text{ext}} \iff \begin{cases} \frac{dP_x}{dt} = \sum F_{\text{ext}, x} \\ \frac{dP_y}{dt} = \sum F_{\text{ext}, y} \\ \frac{dP_z}{dt} = \sum F_{\text{ext}, z} \end{cases}$$

The Cartesian coordinate axes are completely decoupled.
**The Orthogonal Component Theorem:**
> *If the net external force along a specific spatial axis is zero ($\sum F_{\text{ext}, x} = 0$), the total linear momentum along that specific axis ($P_x$) is strictly conserved, even if massive external forces act along the orthogonal axes ($y$ and $z$)*!

```
Case 1: Projectile Exploding in Mid-Air
   - Vertical Axis (Y): Gravity acts continuously (F_ext,y = -Mg != 0).
     Py(t) is NOT conserved; it decreases by -Mg * dt.
   - Horizontal Axis (X): Air resistance is negligible (F_ext,x = 0).
     Px is STRICTLY CONSERVED before, during, and after the explosion!

Case 2: Man Walking on a Boat in Water
   - Vertical Axis (Y): Gravity and buoyant water force cancel (N_buoyant = Mg).
   - Horizontal Axis (X): Water provides zero horizontal shear friction (F_ext,x = 0).
     Px is STRICTLY CONSERVED; as the man walks forward, the boat recoils backward!
```

---

## 3.5 Spacewalk EVA Dynamics and Non-Aerodynamic Propulsion

In the hard vacuum of outer space, there is no atmosphere to push against. An astronaut stranded fifty meters from their spacecraft during an Extravehicular Activity (EVA) with a failed tether cannot "swim" or "paddle" back to the airlock.

To move, the astronaut must exploit linear momentum conservation:
1. **Throwing Equipment:** If the astronaut holds a heavy wrench of mass $m_{\text{wrench}} = 2.0\,\text{kg}$ and throws it directly away from the spacecraft with speed $v = 15.0\,\text{m/s}$:
   $$p_{\text{wrench}} = m_{\text{wrench}} v = (2.0\,\text{kg})(15.0\,\text{m/s}) = +30.0\,\text{kg}\cdot\text{m/s}$$
   By momentum conservation ($P_{\text{total}} = 0$):
   $$p_{\text{astronaut}} = -30.0\,\text{kg}\cdot\text{m/s}$$
   If the astronaut + spacesuit mass is $M = 100.0\,\text{kg}$:
   $$V_{\text{astronaut}} = \frac{-30.0\,\text{kg}\cdot\text{m/s}}{100.0\,\text{kg}} = -0.300\,\text{m/s}$$
   The astronaut will drift safely back toward the spacecraft at $0.30\,\text{m/s}$, reaching the airlock in less than three minutes.
2. **Cold-Gas Thrusters (SAFER Backpack):** High-pressure gaseous nitrogen is vented through microscopic supersonic nozzles. The mass of ejected gas carrying momentum $\dot{m} v_{\text{ex}}$ provides the reactive thrust force:
   $$\vec{F}_{\text{thrust}} = -\vec{v}_{\text{ex}} \frac{dm}{dt}$$

---

## 3.6 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 3.1: Heavy Artillery Recoil and Hydraulic Damper
**Problem:** A mobile howitzer artillery system has total carriage and cannon barrel mass $M = 14,000\,\text{kg}$. It fires a high-explosive projectile of mass $m = 42.0\,\text{kg}$ horizontally with muzzle velocity $v_b = 820.0\,\text{m/s}$.
1. Compute the free recoil velocity $V_{\text{recoil}}$ of the artillery carriage immediately after firing (before ground spade friction acts).
2. Calculate the kinetic energy of the fired projectile and the recoil kinetic energy of the artillery carriage.
3. If the cannon barrel is mounted on a hydraulic recoil damper that brings the barrel to rest over a buffer stroke distance $d = 0.850\,\text{m}$, compute the average retarding force $F_{\text{damper}}$ exerted by the hydraulic cylinders.

**Solution:**
- **Step 1: Recoil velocity**
  From momentum conservation ($P_{\text{total}} = 0$):
  $$M V_{\text{recoil}} + m v_b = 0 \implies V_{\text{recoil}} = -\frac{m}{M} v_b$$
  $$V_{\text{recoil}} = -\frac{42.0\,\text{kg}}{14,000\,\text{kg}} (820.0\,\text{m/s}) = -(0.00300)(820.0\,\text{m/s}) = -2.460\,\text{m/s}$$
  The artillery carriage recoils at $2.46\,\text{m/s}$.

- **Step 2: Kinetic energy partition**
  - Projectile kinetic energy:
    $$K_{\text{proj}} = \frac{1}{2} m v_b^2 = \frac{1}{2}(42.0\,\text{kg})(820.0\,\text{m/s})^2 = 21.0 \times 672,400 = 14,120,400\,\text{J} = 14.12\,\text{MJ}$$
  - Carriage recoil kinetic energy:
    $$K_{\text{recoil}} = \frac{1}{2} M V_{\text{recoil}}^2 = \frac{1}{2}(14,000\,\text{kg})(2.460\,\text{m/s})^2 = 7000 \times 6.0516 = 42,361\,\text{J} = 42.36\,\text{kJ}$$
  *Notice:* $\frac{K_{\text{recoil}}}{K_{\text{proj}}} = \frac{42,361}{14,120,400} = 0.00300 = \frac{m}{M}$. Exact match!

- **Step 3: Average hydraulic damper force**
  By the Work-Energy Theorem:
  $$W_{\text{damper}} = F_{\text{damper}} \cdot d = K_{\text{recoil}}$$
  $$F_{\text{damper}} = \frac{K_{\text{recoil}}}{d} = \frac{42,361\,\text{J}}{0.850\,\text{m}} = 49,836.5\,\text{N} \approx 49.84\,\text{kN}$$
  The hydraulic system absorbs the blast energy with an average force of nearly $50\,\text{kN}$.

---

### Example 3.2: 2D Mid-Air Fireworks Fragmentation
**Problem:** A stationary aerial fireworks shell of mass $M = 3.60\,\text{kg}$ explodes at its apex, breaking into three distinct fragments:
- Fragment 1: $m_1 = 1.00\,\text{kg}$, traveling due North ($+y$) at $v_1 = 60.0\,\text{m/s}$.
- Fragment 2: $m_2 = 1.40\,\text{kg}$, traveling due East ($+x$) at $v_2 = 45.0\,\text{m/s}$.
1. Find the mass $m_3$ of Fragment 3.
2. Determine the Cartesian velocity components $(v_{3x}, v_{3y})$ and total speed $v_3$ of Fragment 3.
3. Compute the heading angle $\theta_3$ of Fragment 3.

**Solution:**
- **Step 1: Mass of Fragment 3**
  $$m_3 = M - m_1 - m_2 = 3.60 - 1.00 - 1.40 = 1.20\,\text{kg}$$

- **Step 2: Momentum vector balance**
  Since the parent shell was stationary at apex:
  $$\vec{P}_{\text{init}} = \vec{0}$$
  $$\vec{p}_1 = m_1 \vec{v}_1 = (1.00\,\text{kg})(+60.0\,\hat{j}\,\text{m/s}) = +60.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  $$\vec{p}_2 = m_2 \vec{v}_2 = (1.40\,\text{kg})(+45.0\,\hat{i}\,\text{m/s}) = +63.0\,\hat{i}\,\text{kg}\cdot\text{m/s}$$
  By momentum conservation:
  $$\vec{p}_1 + \vec{p}_2 + \vec{p}_3 = \vec{0} \implies \vec{p}_3 = -(\vec{p}_1 + \vec{p}_2) = -63.0\,\hat{i} - 60.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  Velocity of Fragment 3:
  $$v_{3x} = \frac{-63.0\,\text{kg}\cdot\text{m/s}}{1.20\,\text{kg}} = -52.50\,\text{m/s}$$
  $$v_{3y} = \frac{-60.0\,\text{kg}\cdot\text{m/s}}{1.20\,\text{kg}} = -50.00\,\text{m/s}$$
  $$\vec{v}_3 = -52.50\,\hat{i} - 50.00\,\hat{j}\,\text{m/s}$$
  Scalar speed:
  $$v_3 = \sqrt{(-52.50)^2 + (-50.00)^2} = \sqrt{2756.25 + 2500.00} = \sqrt{5256.25} = 72.50\,\text{m/s}$$

- **Step 3: Heading angle**
  $$\theta_3 = 180^\circ + \arctan\left(\frac{-50.00}{-52.50}\right) = 180^\circ + \arctan(0.95238) = 180^\circ + 43.60^\circ = 223.60^\circ$$
  Fragment 3 flies South-West at $72.5\,\text{m/s}$ ($43.6^\circ$ south of west).

---

### Example 3.3: Man Walking on a Frictionless Flatboat
**Problem:** A man of mass $m = 80.0\,\text{kg}$ stands at the stern (rear) of a flatboat of mass $M = 320.0\,\text{kg}$ and length $L = 6.00\,\text{m}$. The boat is initially at rest in calm, frictionless water. The man walks from the stern to the bow (front) of the boat.
1. Determine the distance $\Delta x_{\text{boat}}$ the boat moves relative to the water.
2. Determine the net displacement $\Delta x_{\text{man}}$ of the man relative to the water.

**Solution:**
- **Step 1: Center of mass invariance**
  Because no external horizontal forces act on the (man + boat) system (frictionless water):
  $$\sum F_{\text{ext}, x} = 0 \implies \Delta X_{\text{CM}} = 0$$
  Let $x_m$ and $x_b$ be the positions of the man and the boat's center of mass relative to the water:
  $$M \Delta x_b + m \Delta x_m = 0$$

- **Step 2: Kinematic relative constraint**
  The man walks the entire length $L$ of the boat. His displacement relative to the boat is $+L$:
  $$\Delta x_m = \Delta x_b + L$$
  Substitute this into the center of mass equation:
  $$M \Delta x_b + m(\Delta x_b + L) = 0$$
  $$(M + m)\Delta x_b + m L = 0$$
  $$\Delta x_b = -\frac{m}{M + m} L$$

- **Step 3: Numerical calculation**
  $$\Delta x_b = -\frac{80.0\,\text{kg}}{320.0\,\text{kg} + 80.0\,\text{kg}} (6.00\,\text{m}) = -\frac{80.0}{400.0}(6.00\,\text{m}) = -0.200 \times 6.00 = -1.200\,\text{m}$$
  The boat recoils backward by $1.20\,\text{m}$.
  The man's displacement relative to the water:
  $$\Delta x_m = \Delta x_b + L = -1.200\,\text{m} + 6.00\,\text{m} = +4.800\,\text{m}$$
  *Verification:* $M \Delta x_b + m \Delta x_m = 320(-1.20) + 80(+4.80) = -384 + 384 = 0$. Exact match!

---

### Example 3.4: Spacewalk Astronaut Nitrogen Gas Thruster
**Problem:** An astronaut of total mass $M = 110.0\,\text{kg}$ (including spacesuit and life-support pack) is floating at rest relative to the space station. To translate toward the airlock, they fire a cold-gas thruster that ejects nitrogen at exhaust speed $v_{\text{ex}} = 750.0\,\text{m/s}$. The thruster operates for $\Delta t = 2.50\,\text{s}$ with a mass flow rate $\dot{m} = 0.0800\,\text{kg/s}$.
1. Calculate the total mass of nitrogen gas ejected.
2. Determine the total thrust impulse delivered.
3. Compute the astronaut's final velocity relative to the space station.

**Solution:**
- **Step 1: Nitrogen mass ejected**
  $$\Delta m = \dot{m} \Delta t = (0.0800\,\text{kg/s})(2.50\,\text{s}) = 0.200\,\text{kg}$$

- **Step 2: Thrust impulse**
  $$J = \Delta m \cdot v_{\text{ex}} = (0.200\,\text{kg})(750.0\,\text{m/s}) = 150.0\,\text{N}\cdot\text{s}$$
  Thrust force:
  $$F_{\text{thrust}} = \frac{J}{\Delta t} = \frac{150.0\,\text{N}\cdot\text{s}}{2.50\,\text{s}} = 60.0\,\text{N}$$

- **Step 3: Final astronaut velocity**
  Remaining mass of astronaut:
  $$M_f = M - \Delta m = 110.0 - 0.200 = 109.8\,\text{kg}$$
  By momentum conservation:
  $$V_{\text{final}} = \frac{J}{M_f} = \frac{150.0\,\text{N}\cdot\text{s}}{109.8\,\text{kg}} = 1.366\,\text{m/s}$$
  The astronaut cruises toward the airlock at $1.37\,\text{m/s}$.

---

### Example 3.5: Alpha Decay Nuclear Recoil Dynamics
**Problem:** A stationary Polonium-210 nucleus ($^{210}\text{Po}$, atomic mass $m_{\text{Po}} = 209.98287\,\text{u}$) undergoes spontaneous alpha decay into Lead-206 ($^{206}\text{Pb}$, mass $m_{\text{Pb}} = 205.97447\,\text{u}$) and an alpha particle ($^{4}\text{He}$, mass $m_\alpha = 4.00151\,\text{u}$). The total nuclear decay energy released is $Q = 5.407\,\text{MeV} = 8.663 \times 10^{-13}\,\text{J}$.
Taking $1\,\text{u} = 1.66054 \times 10^{-27}\,\text{kg}$:
1. Compute the kinetic energy $K_\alpha$ of the alpha particle in $\text{MeV}$.
2. Compute the recoil kinetic energy $K_{\text{Pb}}$ of the lead nucleus in $\text{keV}$.
3. Calculate the recoil speed $v_{\text{Pb}}$ of the daughter lead nucleus.

**Solution:**
- **Step 1: Alpha particle kinetic energy**
  From Section 3.2:
  $$K_\alpha = Q \left( \frac{m_{\text{Pb}}}{m_\alpha + m_{\text{Pb}}} \right) = (5.407\,\text{MeV})\left( \frac{205.974}{4.002 + 205.974} \right) = (5.407)\left( \frac{205.974}{209.976} \right)$$
  $$K_\alpha = (5.407\,\text{MeV})(0.98094) = 5.3040\,\text{MeV}$$

- **Step 2: Lead daughter recoil energy**
  $$K_{\text{Pb}} = Q - K_\alpha = 5.407 - 5.3040 = 0.1030\,\text{MeV} = 103.0\,\text{keV}$$
  $$K_{\text{Pb}} = 103.0 \times 10^3 \times (1.6022 \times 10^{-19}\,\text{J}) = 1.650 \times 10^{-14}\,\text{J}$$

- **Step 3: Recoil speed of lead nucleus**
  Mass of lead nucleus:
  $$M_{\text{Pb}} = 205.974 \times (1.66054 \times 10^{-27}\,\text{kg}) = 3.4203 \times 10^{-25}\,\text{kg}$$
  $$K_{\text{Pb}} = \frac{1}{2} M_{\text{Pb}} v_{\text{Pb}}^2 \implies v_{\text{Pb}} = \sqrt{\frac{2 K_{\text{Pb}}}{M_{\text{Pb}}}}$$
  $$v_{\text{Pb}} = \sqrt{\frac{2(1.650 \times 10^{-14}\,\text{J})}{3.4203 \times 10^{-25}\,\text{kg}}} = \sqrt{9.6483 \times 10^{10}} = 310,617\,\text{m/s} \approx 310.6\,\text{km/s}$$
  The recoiling lead atom rips through surrounding crystal lattices at over $310\,\text{km/s}$, producing radiation damage tracks!

---

### Example 3.6: Moving Railcar with Dropped Sand
**Problem:** An open flat railroad hopper car of mass $M_0 = 12,000\,\text{kg}$ rolls frictionlessly along a horizontal track at $v_0 = 8.00\,\text{m/s}$. A chute above the track drops a static load of $m_s = 4000\,\text{kg}$ of gravel vertically into the moving car.
1. Determine the final velocity $v_1$ of the hopper car after the gravel is loaded.
2. A drain plug at the bottom of the hopper car is then opened, allowing the $4000\,\text{kg}$ of gravel to leak straight down through a floor hole onto the track. What is the velocity $v_2$ of the empty car after the gravel has drained?

**Solution:**
- **Step 1: Loading phase**
  Along the horizontal direction, no external forces act ($\sum F_{\text{ext}, x} = 0$).
  The dropped sand initially has zero horizontal momentum:
  $$P_{\text{init}} = M_0 v_0 = (12,000\,\text{kg})(8.00\,\text{m/s}) = 96,000\,\text{kg}\cdot\text{m/s}$$
  After loading:
  $$P_{\text{final}} = (M_0 + m_s) v_1 = 96,000\,\text{kg}\cdot\text{m/s}$$
  $$v_1 = \frac{M_0 v_0}{M_0 + m_s} = \frac{96,000\,\text{kg}\cdot\text{m/s}}{12,000 + 4000\,\text{kg}} = \frac{96,000}{16,000} = 6.00\,\text{m/s}$$
  The car slows down to $6.00\,\text{m/s}$.

- **Step 2: Draining phase (The Conceptual Trap)**
  As each grain of sand falls through the floor hole, it leaves the car traveling horizontally at the **exact same speed as the car**: $v_{\text{sand}, x} = v_1 = 6.00\,\text{m/s}$.
  Because the leaking sand carries away its own horizontal momentum at rate $\left(\frac{dm}{dt}\right) v_1$, it exerts **zero horizontal force** on the car!
  $$v_2 = v_1 = 6.00\,\text{m/s}$$
  **Critical Physical Insight:** Dropping stationary mass into a moving body slows it down; but leaking mass out of a moving body **does not speed it up**! The speed remains strictly $6.00\,\text{m/s}$.

---

### Example 3.7: Sliding Block Down a Movable Wedge on Ice
**Problem:** A smooth, frictionless triangular wedge of mass $M = 6.00\,\text{kg}$ with incline angle $\theta = 45.0^\circ$ rests on a frictionless frozen lake. A small block of mass $m = 2.00\,\text{kg}$ is released from rest at the top of the wedge, which has vertical height $h = 1.80\,\text{m}$. Take $g = 9.81\,\text{m/s}^2$.
1. Using horizontal momentum conservation, derive the relationship between the horizontal velocity of the block $v_{bx}$ and the wedge $V_W$.
2. Compute the final velocities of both bodies when the block reaches the bottom of the wedge.

**Solution:**
- **Step 1: Horizontal momentum conservation**
  Because the lake surface is frictionless, $\sum F_{\text{ext}, x} = 0$:
  $$P_x = M V_W + m v_{bx} = 0 \implies v_{bx} = -\frac{M}{m} V_W$$
  Taking the wedge moving to the left ($V_W < 0$, or let $V = |V_W|$ directed leftward), the block moves rightward with:
  $$v_{bx} = \frac{M}{m} V = \frac{6.00}{2.00} V = 3.00 V$$

- **Step 2: Kinematic wedge constraint**
  In the reference frame of the wedge (which translates leftward at speed $V$), the block's relative horizontal speed is:
  $$v_{\text{rel}, x} = v_{bx} - (-V) = v_{bx} + V = 3.00 V + V = 4.00 V$$
  Because the block slides down an incline of angle $\theta = 45.0^\circ$:
  $$\tan(45.0^\circ) = 1.00 = \frac{|v_{by}|}{v_{\text{rel}, x}} \implies |v_{by}| = v_{\text{rel}, x} = 4.00 V$$
  Total speed squared of the block in the laboratory frame:
  $$v_b^2 = v_{bx}^2 + v_{by}^2 = (3.00 V)^2 + (4.00 V)^2 = 9.00 V^2 + 16.00 V^2 = 25.00 V^2$$

- **Step 3: Energy conservation**
  Initial potential energy = Final kinetic energy:
  $$m g h = \frac{1}{2} M V^2 + \frac{1}{2} m v_b^2$$
  Substitute values:
  $$(2.00\,\text{kg})(9.81\,\text{m/s}^2)(1.80\,\text{m}) = \frac{1}{2}(6.00) V^2 + \frac{1}{2}(2.00)(25.00 V^2)$$
  $$35.316\,\text{J} = 3.00 V^2 + 25.00 V^2 = 28.00 V^2$$
  $$V^2 = \frac{35.316}{28.00} = 1.26129\,\text{m}^2/\text{s}^2 \implies V = 1.123\,\text{m/s}$$
  - Velocity of wedge: $V_W = 1.123\,\text{m/s}$ (to the left).
  - Velocity of block:
    $$v_{bx} = 3.00(1.123) = +3.369\,\text{m/s} \quad (\text{rightward})$$
    $$v_{by} = -4.00(1.123) = -4.492\,\text{m/s} \quad (\text{downward})$$
    $$v_b = \sqrt{3.369^2 + (-4.492)^2} = \sqrt{11.350 + 20.178} = \sqrt{31.528} = 5.615\,\text{m/s}$$

---

### Example 3.8: 3D Asymmetric Fragmentation of an Orbital Satellite
**Problem:** A defunct military surveillance satellite of total mass $M = 450.0\,\text{kg}$ is coasting along the $+x$ axis in low Earth orbit at orbital speed $\vec{V}_0 = +7600.0\,\hat{i}\,\text{m/s}$. A pressurized fuel tank ruptures, blowing the satellite into three fragments:
- Fragment 1: $m_1 = 150.0\,\text{kg}$, $\vec{v}_1 = (7400.0\,\hat{i} + 250.0\,\hat{j} - 100.0\,\hat{k})\,\text{m/s}$.
- Fragment 2: $m_2 = 200.0\,\text{kg}$, $\vec{v}_2 = (7800.0\,\hat{i} - 150.0\,\hat{j} + 80.0\,\hat{k})\,\text{m/s}$.
Determine the 3D velocity vector $\vec{v}_3$ of Fragment 3 ($m_3 = 100.0\,\text{kg}$).

**Solution:**
- **Step 1: Total initial momentum vector**
  $$\vec{P}_{\text{init}} = M \vec{V}_0 = (450.0\,\text{kg})(7600.0\,\hat{i}\,\text{m/s}) = 3,420,000.0\,\hat{i}\,\text{kg}\cdot\text{m/s}$$
  $$P_{x,\text{init}} = 3,420,000.0, \quad P_{y,\text{init}} = 0.0, \quad P_{z,\text{init}} = 0.0$$

- **Step 2: Momentum of fragments 1 and 2**
  - For Fragment 1:
    $$p_{1x} = 150.0 \times 7400.0 = 1,110,000.0\,\text{kg}\cdot\text{m/s}$$
    $$p_{1y} = 150.0 \times 250.0 = +37,500.0\,\text{kg}\cdot\text{m/s}$$
    $$p_{1z} = 150.0 \times (-100.0) = -15,000.0\,\text{kg}\cdot\text{m/s}$$
  - For Fragment 2:
    $$p_{2x} = 200.0 \times 7800.0 = 1,560,000.0\,\text{kg}\cdot\text{m/s}$$
    $$p_{2y} = 200.0 \times (-150.0) = -30,000.0\,\text{kg}\cdot\text{m/s}$$
    $$p_{2z} = 200.0 \times 80.0 = +16,000.0\,\text{kg}\cdot\text{m/s}$$

- **Step 3: Solve for Fragment 3 components**
  - X-component:
    $$p_{3x} = P_{x,\text{init}} - p_{1x} - p_{2x} = 3,420,000.0 - 1,110,000.0 - 1,560,000.0 = 750,000.0\,\text{kg}\cdot\text{m/s}$$
    $$v_{3x} = \frac{750,000.0\,\text{kg}\cdot\text{m/s}}{100.0\,\text{kg}} = +7500.0\,\text{m/s}$$
  - Y-component:
    $$p_{3y} = 0 - p_{1y} - p_{2y} = 0 - 37,500.0 - (-30,000.0) = -7,500.0\,\text{kg}\cdot\text{m/s}$$
    $$v_{3y} = \frac{-7,500.0\,\text{kg}\cdot\text{m/s}}{100.0\,\text{kg}} = -75.0\,\text{m/s}$$
  - Z-component:
    $$p_{3z} = 0 - p_{1z} - p_{2z} = 0 - (-15,000.0) - 16,000.0 = -1,000.0\,\text{kg}\cdot\text{m/s}$$
    $$v_{3z} = \frac{-1,000.0\,\text{kg}\cdot\text{m/s}}{100.0\,\text{kg}} = -10.0\,\text{m/s}$$

$$\vec{v}_3 = 7500.0\,\hat{i} - 75.0\,\hat{j} - 10.0\,\hat{k}\,\text{m/s}$$

---

### Example 3.9: Recoil with Linear Friction on a Rough Floor
**Problem:** A spring-loaded cannon of mass $M = 25.0\,\text{kg}$ sits on a rough wooden laboratory floor ($\mu_k = 0.350$). It launches a projectile of mass $m = 0.500\,\text{kg}$ horizontally with launch speed $v_0 = 40.0\,\text{m/s}$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the recoil velocity $V_0$ of the cannon immediately after the launch spring disengages ($\Delta t \approx 0$).
2. Determine the time $t_{\text{stop}}$ and distance $d_{\text{recoil}}$ the cannon slides across the floor before coming to rest.

**Solution:**
- **Step 1: Recoil velocity via impulsive approximation**
  During the rapid launch disengagement, horizontal friction is negligible compared to the spring force:
  $$M V_0 + m v_0 = 0 \implies V_0 = -\frac{m}{M} v_0 = -\frac{0.500\,\text{kg}}{25.0\,\text{kg}} (40.0\,\text{m/s}) = -0.800\,\text{m/s}$$

- **Step 2: Deceleration due to Coulomb friction**
  Once moving, the only horizontal force acting on the cannon is kinetic friction:
  $$f_k = \mu_k M g = (0.350)(25.0\,\text{kg})(9.81\,\text{m/s}^2) = 85.8375\,\text{N}$$
  $$a_{\text{stop}} = -\mu_k g = -(0.350)(9.81\,\text{m/s}^2) = -3.4335\,\text{m/s}^2$$
  Time to stop:
  $$t_{\text{stop}} = \frac{|V_0|}{|a_{\text{stop}}|} = \frac{0.800\,\text{m/s}}{3.4335\,\text{m/s}^2} = 0.2330\,\text{s}$$
  Sliding distance:
  $$d_{\text{recoil}} = \frac{V_0^2}{2 |a_{\text{stop}}|} = \frac{(0.800\,\text{m/s})^2}{2(3.4335\,\text{m/s}^2)} = \frac{0.640}{6.867} = 0.0932\,\text{m} = 9.32\,\text{cm}$$

---

### Example 3.10: Two Ice Skaters Pushing Apart
**Problem:** Two figure skaters, Anna ($m_A = 50.0\,\text{kg}$) and Boris ($m_B = 80.0\,\text{kg}$), stand facing each other at rest on a frictionless ice sheet. Anna pushes Boris away with a constant force $F = 120.0\,\text{N}$ for a duration $\Delta t = 0.600\,\text{s}$.
1. Verify momentum conservation by calculating the impulse delivered to both skaters.
2. Determine their final speeds $v_A$ and $v_B$.
3. Compute the total distance $D$ separating the two skaters at $t = 2.00\,\text{s}$ after they first begin pushing.

**Solution:**
- **Step 1: Impulses delivered**
  By Newton’s Third Law:
  - Force on Boris: $+F = +120.0\,\text{N}$
    $$J_B = (+120.0\,\text{N})(0.600\,\text{s}) = +72.0\,\text{N}\cdot\text{s}$$
  - Force on Anna: $-F = -120.0\,\text{N}$
    $$J_A = (-120.0\,\text{N})(0.600\,\text{s}) = -72.0\,\text{N}\cdot\text{s}$$
  $$J_A + J_B = 0 \implies \vec{P}_{\text{total}} \equiv \vec{0}$$

- **Step 2: Final speeds at separation ($t = 0.600\,\text{s}$)**
  $$v_B = \frac{J_B}{m_B} = \frac{+72.0\,\text{N}\cdot\text{s}}{80.0\,\text{kg}} = +0.900\,\text{m/s}$$
  $$v_A = \frac{J_A}{m_A} = \frac{-72.0\,\text{N}\cdot\text{s}}{50.0\,\text{kg}} = -1.440\,\text{m/s}$$

- **Step 3: Separation distance at $t = 2.00\,\text{s}$**
  The push lasts $\Delta t_1 = 0.600\,\text{s}$. The remaining coasting time is $\Delta t_2 = 2.00 - 0.600 = 1.400\,\text{s}$.
  - During the push ($0 \le t \le 0.600\,\text{s}$):
    $$d_{B1} = \frac{1}{2} a_B \Delta t_1^2 = \frac{1}{2} v_B \Delta t_1 = 0.5 \times 0.900 \times 0.600 = 0.270\,\text{m}$$
    $$d_{A1} = \frac{1}{2} |v_A| \Delta t_1 = 0.5 \times 1.440 \times 0.600 = 0.432\,\text{m}$$
  - During coasting ($0.600 \le t \le 2.000\,\text{s}$):
    $$d_{B2} = v_B \Delta t_2 = (0.900\,\text{m/s})(1.400\,\text{s}) = 1.260\,\text{m}$$
    $$d_{A2} = |v_A| \Delta t_2 = (1.440\,\text{m/s})(1.400\,\text{s}) = 2.016\,\text{m}$$
  - Total separation distance:
    $$D = (d_{B1} + d_{B2}) + (d_{A1} + d_{A2}) = (0.270 + 1.260) + (0.432 + 2.016) = 1.530 + 2.448 = 3.978\,\text{m}$$
  The skaters are separated by $3.98\,\text{m}$.

---

## 3.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 3.8.

### Tier 1: Recoil Fundamentals
- **Exercise 3.1:** A cannon of mass $1200\,\text{kg}$ fires an $8.00\,\text{kg}$ shell at $450.0\,\text{m/s}$. Compute the recoil velocity.
- **Exercise 3.2:** A $65.0\,\text{kg}$ astronaut in deep space throws a $3.50\,\text{kg}$ camera at $12.0\,\text{m/s}$. Find the astronaut's recoil speed.

### Tier 2: 2D Explosions & Splitting
- **Exercise 3.3:** A stationary bomb explodes into two pieces of mass $2.50\,\text{kg}$ and $5.00\,\text{kg}$. If the lighter piece moves at $80.0\,\text{m/s}$, compute the speed and kinetic energy of the heavier piece.
- **Exercise 3.4:** An object of mass $5.00\,\text{kg}$ moving at $10.0\,\text{m/s}$ along $+x$ splits into two parts: $m_1 = 2.00\,\text{kg}$ moving along $+y$ at $15.0\,\text{m/s}$. Find the velocity vector of $m_2 = 3.00\,\text{kg}$.

### Tier 3: Movable Platforms & Relative Constraints
- **Exercise 3.5:** A boy of mass $45.0\,\text{kg}$ runs at $4.00\,\text{m/s}$ and jumps onto a stationary $15.0\,\text{kg}$ skateboard on a smooth floor. What is their combined rolling speed?
- **Exercise 3.6:** A flat railway trolley of mass $250\,\text{kg}$ moves at $5.00\,\text{m/s}$. A man of mass $80.0\,\text{kg}$ jumps off the trolley such that his horizontal velocity relative to the ground is zero. What is the trolley's final speed?

### Tier 4: Energy Partitioning & Gun Dynamics
- **Exercise 3.7:** A rifle fires a $0.0150\,\text{kg}$ bullet with $3600\,\text{J}$ of kinetic energy. If the rifle mass is $4.50\,\text{kg}$, compute the rifle's recoil kinetic energy.
- **Exercise 3.8:** A nuclear nucleus at rest emits a gamma photon of energy $E_\gamma = 2.50\,\text{MeV}$ ($p = E_\gamma / c$). If the nucleus has atomic mass $M = 56.0\,\text{u}$, calculate its recoil kinetic energy.

### Tier 5: Continuum Accretion & Relativistic Decay
- **Exercise 3.9:** A cart of mass $M = 50.0\,\text{kg}$ moves on a track with speed $v_0 = 6.00\,\text{m/s}$ in a rainstorm. Rain falls vertically, accumulating in the cart at a rate of $\dot{m} = 0.500\,\text{kg/s}$. Write the equation for $v(t)$ and find the speed after $t = 60.0\,\text{s}$.
- **Exercise 3.10:** A neutral pion ($\pi^0$, rest mass $m_0 = 135.0\,\text{MeV}/c^2$) moving at $v = 0.800\,c$ decays into two photons flying forward and backward along the line of flight. Determine the energies of both photons.

---

## 3.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 3.1
- **Given:** $M = 1200\,\text{kg}$, $m = 8.00\,\text{kg}$, $v = 450.0\,\text{m/s}$.
- **Step 1: Recoil velocity**
  $$V_{\text{recoil}} = -\frac{m}{M} v = -\frac{8.00\,\text{kg}}{1200\,\text{kg}} (450.0\,\text{m/s}) = -\frac{3600}{1200} = -3.00\,\text{m/s}$$

---

### Solution 3.2
- **Given:** $M = 65.0\,\text{kg}$, $m = 3.50\,\text{kg}$, $v = 12.0\,\text{m/s}$.
- **Step 1: Recoil speed**
  $$V_{\text{recoil}} = \frac{m}{M} v = \frac{3.50\,\text{kg}}{65.0\,\text{kg}} (12.0\,\text{m/s}) = \frac{42.0}{65.0} = 0.646\,\text{m/s}$$

---

### Solution 3.3
- **Given:** $m_1 = 2.50\,\text{kg}$, $v_1 = 80.0\,\text{m/s}$, $m_2 = 5.00\,\text{kg}$.
- **Step 1: Speed of $m_2$**
  $$m_1 v_1 = m_2 v_2 \implies v_2 = \frac{m_1}{m_2} v_1 = \frac{2.50}{5.00} (80.0) = 40.0\,\text{m/s}$$
- **Step 2: Kinetic energy of $m_2$**
  $$K_2 = \frac{1}{2} m_2 v_2^2 = \frac{1}{2}(5.00\,\text{kg})(40.0\,\text{m/s})^2 = 2.50 \times 1600 = 4000\,\text{J} = 4.00\,\text{kJ}$$

---

### Solution 3.4
- **Given:** $M = 5.00\,\text{kg}$, $\vec{v}_0 = 10.0\,\hat{i}\,\text{m/s}$. $m_1 = 2.00\,\text{kg}$, $\vec{v}_1 = 15.0\,\hat{j}\,\text{m/s}$. $m_2 = 3.00\,\text{kg}$.
- **Step 1: Initial momentum**
  $$\vec{P}_{\text{init}} = (5.00)(10.0\,\hat{i}) = 50.0\,\hat{i}\,\text{kg}\cdot\text{m/s}$$
- **Step 2: Momentum of $m_1$**
  $$\vec{p}_1 = (2.00)(15.0\,\hat{j}) = 30.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
- **Step 3: Solve for $\vec{v}_2$**
  $$\vec{p}_2 = \vec{P}_{\text{init}} - \vec{p}_1 = 50.0\,\hat{i} - 30.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  $$\vec{v}_2 = \frac{\vec{p}_2}{m_2} = \frac{50.0\,\hat{i} - 30.0\,\hat{j}}{3.00} = 16.67\,\hat{i} - 10.00\,\hat{j}\,\text{m/s}$$

---

### Solution 3.5
- **Given:** $m = 45.0\,\text{kg}$, $v_0 = 4.00\,\text{m/s}$, $M = 15.0\,\text{kg}$.
- **Step 1: Inelastic momentum conservation**
  $$m v_0 = (m + M) v_f$$
  $$v_f = \frac{m v_0}{m + M} = \frac{(45.0\,\text{kg})(4.00\,\text{m/s})}{45.0 + 15.0\,\text{kg}} = \frac{180.0}{60.0} = 3.00\,\text{m/s}$$

---

### Solution 3.6
- **Given:** $M = 250\,\text{kg}$, $m = 80.0\,\text{kg}$, $v_0 = 5.00\,\text{m/s}$, man lands with $v_{\text{man}} = 0$.
- **Step 1: Initial momentum**
  $$P_{\text{init}} = (M + m) v_0 = (250 + 80.0)(5.00) = (330)(5.00) = 1650\,\text{kg}\cdot\text{m/s}$$
- **Step 2: Final trolley speed**
  $$P_{\text{final}} = M v_f + m(0) = 250 v_f$$
  $$v_f = \frac{1650\,\text{kg}\cdot\text{m/s}}{250\,\text{kg}} = 6.60\,\text{m/s}$$

---

### Solution 3.7
- **Given:** $m = 0.0150\,\text{kg}$, $K_{\text{bullet}} = 3600\,\text{J}$, $M = 4.50\,\text{kg}$.
- **Step 1: Energy partition ratio**
  $$\frac{K_{\text{rifle}}}{K_{\text{bullet}}} = \frac{m}{M} = \frac{0.0150\,\text{kg}}{4.50\,\text{kg}} = \frac{1}{300}$$
- **Step 2: Rifle recoil energy**
  $$K_{\text{rifle}} = \frac{K_{\text{bullet}}}{300} = \frac{3600\,\text{J}}{300} = 12.0\,\text{J}$$

---

### Solution 3.8
- **Given:** $E_\gamma = 2.50\,\text{MeV} = 4.0055 \times 10^{-13}\,\text{J}$, $M = 56.0\,\text{u} = 56.0 \times 1.6605 \times 10^{-27} = 9.299 \times 10^{-26}\,\text{kg}$.
- **Step 1: Photon momentum**
  $$p = \frac{E_\gamma}{c} = \frac{4.0055 \times 10^{-13}\,\text{J}}{2.998 \times 10^8\,\text{m/s}} = 1.336 \times 10^{-21}\,\text{kg}\cdot\text{m/s}$$
- **Step 2: Recoil kinetic energy**
  $$K_{\text{recoil}} = \frac{p^2}{2M} = \frac{(1.336 \times 10^{-21})^2}{2(9.299 \times 10^{-26})} = \frac{1.785 \times 10^{-42}}{1.8598 \times 10^{-25}} = 9.598 \times 10^{-18}\,\text{J} \approx 59.9\,\text{eV}$$

---

### Solution 3.9
- **Given:** $M_0 = 50.0\,\text{kg}$, $v_0 = 6.00\,\text{m/s}$, $\dot{m} = 0.500\,\text{kg/s}$.
- **Step 1: Momentum conservation equation**
  $$P_x(t) = (M_0 + \dot{m} t) v(t) = M_0 v_0 = \text{constant}$$
  $$v(t) = \frac{M_0 v_0}{M_0 + \dot{m} t}$$
- **Step 2: Speed at $t = 60.0\,\text{s}$**
  $$M(60) = 50.0 + 0.500(60.0) = 50.0 + 30.0 = 80.0\,\text{kg}$$
  $$v(60) = \frac{(50.0\,\text{kg})(6.00\,\text{m/s})}{80.0\,\text{kg}} = \frac{300.0}{80.0} = 3.75\,\text{m/s}$$

---

### Solution 3.10
- **Given:** $m_0 = 135.0\,\text{MeV}/c^2$, $v = 0.800\,c$.
- **Step 1: Relativistic parameters**
  $$\gamma = \frac{1}{\sqrt{1 - 0.800^2}} = \frac{1}{0.600} = \frac{5}{3} \approx 1.6667$$
  Total pion energy:
  $$E_{\text{pion}} = \gamma m_0 c^2 = \left(\frac{5}{3}\right)(135.0\,\text{MeV}) = 225.0\,\text{MeV}$$
  Total pion momentum:
  $$p_{\text{pion}} c = \gamma m_0 v c = \left(\frac{5}{3}\right)(135.0)(0.800) = 180.0\,\text{MeV}$$
- **Step 2: Photons flying forward ($E_1$) and backward ($E_2$)**
  $$E_1 + E_2 = E_{\text{pion}} = 225.0\,\text{MeV}$$
  $$p_1 c - p_2 c = E_1 - E_2 = p_{\text{pion}} c = 180.0\,\text{MeV}$$
  Adding equations:
  $$2 E_1 = 225.0 + 180.0 = 405.0\,\text{MeV} \implies E_1 = 202.5\,\text{MeV}$$
  Subtracting:
  $$2 E_2 = 225.0 - 180.0 = 45.0\,\text{MeV} \implies E_2 = 22.5\,\text{MeV}$$
  The forward Doppler-shifted photon carries $202.5\,\text{MeV}$; the backward photon carries $22.5\,\text{MeV}$.
