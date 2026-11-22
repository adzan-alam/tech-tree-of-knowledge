# Chapter 01: The Quantity of Motion & The Momentum Axiom — From Descartes' Fallacy to the Vector Invariant

> *"There exists in all matter a quantity of motion that nature never creates nor destroys, but transfers from body to body in proportional exchange. Yet this motion is not a blind scalar magnitude; it is a directed arrow whose vector sum across an isolated universe remains eternally conserved."*

---

## 1.1 The Layman's Intuition: The Two Faces of Inertia in Motion

Imagine standing upon a smooth, frozen lake. A friend stands fifty paces away and gently rolls a light table-tennis ball toward you across the ice at a brisk walking speed of $2.0\,\text{m/s}$. When the ball reaches you, you extend your index finger. The ball taps your skin and comes to a complete rest. You feel almost nothing; the force required to halt the ball is so infinitesimal that your nervous system barely registers it.

Now imagine the exact same scenario, but instead of a table-tennis ball, your friend rolls a massive solid cast-iron bowling ball ($m = 7.0\,\text{kg}$) across the ice toward you at the exact same speed: $2.0\,\text{m/s}$. If you attempt to stop the bowling ball by sticking out your index finger, the impact will snap your knuckle bones and sprain your wrist. To stop the bowling ball, you must brace both boots against the ice, lean your entire body weight backward, and exert a strenuous muscular effort over several feet.

Now consider a third scenario: suppose the table-tennis ball from the first test is loaded into a pneumatic compressed-gas cannon and fired at you, not at $2.0\,\text{m/s}$, but at supersonic velocity: $600\,\text{m/s}$. A plastic ball weighing barely three grams moving at this speed carries enough destructive force to punch clean through a wooden door and inflict fatal trauma.

What physical property unites these three scenarios?
- In the first test, the ball was moving at moderate speed, but had negligible mass. It was trivial to stop.
- In the second test, the speed was identical ($2.0\,\text{m/s}$), but the mass was three thousand times larger. It was dangerous.
- In the third test, the mass was microscopic ($0.0027\,\text{kg}$), but the speed was three hundred times larger. It was deadly.

Physical intuition screams that the "unwillingness of an object to be brought to rest" depends neither on mass alone nor on velocity alone, but on the **multiplicative combination of both**. An object in motion possesses an innate dynamic quantity that scales directly with how massive it is and how rapidly it is traveling. In classical mechanics, this foundational property is termed **Linear Momentum** ($\vec{p}$).

---

## 1.2 The Historical Crisis: Descartes’ Scalar Fallacy and the 1668 Royal Society Challenge

The journey to define momentum was one of the most contentious battles in the history of science. In the mid-seventeenth century, the French philosopher and mathematician René Descartes formulated what he believed to be a universal conservation law of nature. In his 1644 treatise *Principia Philosophiae*, Descartes postulated that God, in the original creation of the universe, had infused the cosmos with a fixed, invariant quantity of motion (*quantitas motus*), which could neither be created nor destroyed:

$$Q_{\text{Descartes}} = \sum_{i} m_i |v_i|$$

Notice the fatal flaw in Descartes’ formulation: he defined the quantity of motion as the sum of the products of mass and **scalar speed** ($|v|$), completely discarding direction!

```
Descartes' Flawed Model (Scalar):
  Body A (1 kg) ---> (+5 m/s)      (<--- -5 m/s) Body B (1 kg)
  Total Quantity of Motion = (1 * 5) + (1 * 5) = 10 units.

After Head-On Elastic Rebound:
  Body A (<--- -5 m/s)              (+5 m/s --->) Body B
  Total Quantity of Motion = (1 * 5) + (1 * 5) = 10 units.
  (Appears to work!)

The Collapse of Descartes' Model (Asymmetric Collision):
  A (2 kg, +3 m/s) collides with stationary B (1 kg, 0 m/s).
  Descartes' rules predicted impossible rebounds that violated experimental reality!
```

Because Descartes treated momentum as an unsigned positive scalar, his collision rules yielded absurd, unphysical paradoxes. When an object bounced off a rigid wall and reversed its direction from $+v$ to $-v$, Descartes argued that its quantity of motion had remained unchanged ($m|v| = m|-v|$), implying that reversing a body’s trajectory requires zero dynamic effort!

### The Royal Society Challenge of 1668
By the late 1660s, the confusion surrounding impact mechanics had become an intellectual embarrassment to European natural philosophy. In November 1668, the newly founded Royal Society of London issued an open international challenge to the scientific community: *establish the true, mathematically rigorous laws governing the collision and impact of bodies*.

Three titans responded with independent mathematical treatises within months of one another:
1. **John Wallis** (November 1668): Introduced the concept of momentum as an algebraic signed quantity in one dimension. Wallis recognized that velocities in opposing directions must carry opposing signs ($+v$ and $-v$), proving that when two equal inelastic bodies collide head-on, their motion does not persist, but cancels out completely to zero!
2. **Sir Christopher Wren** (January 1669): Conducted precision experiments using bifilar-suspended pendulums, demonstrating that for elastic bodies, the relative speed of separation equals the relative speed of approach.
3. **Christiaan Huygens** (January 1669): Delivered the masterpiece of collision theory. Huygens utilized a brilliant Galilean relativity thought-experiment: he analyzed colliding spheres from the perspective of an observer standing on a canal boat moving at constant speed. Huygens proved beyond doubt that:
   - Momentum is a **directed vector quantity**.
   - The velocity of the **Center of Mass** of any isolated system remains strictly constant before, during, and after impact.
   - Mechanical kinetic energy ($\sum m v^2$) is uniquely conserved in hard (elastic) collisions, whereas momentum ($\sum m \vec{v}$) is conserved across **all** collisions without exception!

When Isaac Newton synthesized mechanics in his *Principia* (1687), he adopted the Wallis-Huygens vector formulation as his fundamental Definition II:
> *"The quantity of motion is the measure of the same, arising from the velocity and quantity of matter conjointly."*

---

## 1.3 The Mathematical Axiom of Linear Momentum

In modern vector mechanics, the **Linear Momentum** $\vec{p}$ of a particle of invariant mass $m$ translating with velocity $\vec{v}$ is defined as the vector product:

$$\vec{p} \equiv m \vec{v}$$

### Dimensional Analysis and Units
1. **SI System:**
   $$[\vec{p}] = [\text{mass}] \times [\text{length}] \times [\text{time}]^{-1} = \text{kg} \cdot \text{m/s} = \text{N} \cdot \text{s}$$
   One Newton-second ($1\,\text{N}\cdot\text{s}$) is precisely the momentum imparted to a body by a constant force of one Newton acting continuously for one second.
2. **CGS System:**
   $$\text{g} \cdot \text{cm/s} = \text{dyne} \cdot \text{s} = 10^{-5}\,\text{kg} \cdot 10^{-2}\,\text{m/s} = 10^{-7}\,\text{kg}\cdot\text{m/s}$$
3. **Natural / Planck Scale:**
   In quantum gravity, the **Planck Momentum** represents the maximum momentum scale of fundamental particles:
   $$p_P = \sqrt{\frac{\hbar c^3}{G}} \approx 6.52485\,\text{kg} \cdot \text{m/s}$$
   Remarkably, the fundamental Planck momentum is on the order of macroscopic human scales—roughly equivalent to a cricket ball bowled at $45\,\text{m/s}$!

```
                  ^ +Y
                  |                   p = m * v
                  |                  /
                  |                 /  (Vector colinear with velocity)
                  |                /
                  |               * Particle (mass m, velocity v)
                  |              /
                  |             /
                  +------------+-------------------------> +X
```

### Essential Vector Properties of Momentum
1. **Colinearity:** Because mass $m > 0$ is a strictly positive scalar invariant, the momentum vector $\vec{p}$ is **strictly parallel and colinear** with the instantaneous velocity vector $\vec{v}$ at all times:
   $$\hat{p} = \frac{\vec{p}}{\|\vec{p}\|} = \frac{m\vec{v}}{m\|\vec{v}\|} = \hat{v}$$
2. **Superposition:** For an assembly of $N$ discrete particles, the total linear momentum of the system is the **vector sum** of individual particle momenta:
   $$\vec{P}_{\text{total}} = \sum_{i=1}^N \vec{p}_i = \sum_{i=1}^N m_i \vec{v}_i$$
   In Cartesian components:
   $$P_x = \sum_{i=1}^N m_i v_{ix}, \quad P_y = \sum_{i=1}^N m_i v_{iy}, \quad P_z = \sum_{i=1}^N m_i v_{iz}$$

---

## 1.4 Newton’s Second Law in Momentum Flux Formulation

In elementary coursework, Newton’s Second Law is routinely introduced as $\vec{F} = m\vec{a}$. However, this is a restricted special case valid only when mass is strictly constant ($dm/dt \equiv 0$).

In the *Principia*, Newton formulated Lex II in terms of the rate of change of the quantity of motion:

$$\vec{F}_{\text{net}} = \frac{d\vec{p}}{dt}$$

Expand this time derivative using the product rule of differential calculus:

$$\vec{F}_{\text{net}} = \frac{d}{dt}(m \vec{v}) = m \frac{d\vec{v}}{dt} + \vec{v} \frac{dm}{dt} = m \vec{a} + \vec{v} \frac{dm}{dt}$$

- **Constant Mass Regime ($dm/dt = 0$):** The second term vanishes identically, recovering the familiar $\vec{F}_{\text{net}} = m\vec{a}$.
- **Variable Mass / Relativistic Regime ($dm/dt \ne 0$):** In rocketry, continuous mass accretion, or relativistic dynamics where relativistic mass increases as $v \to c$, $\vec{F} = d\vec{p}/dt$ remains universally valid while $\vec{F} = m\vec{a}$ fails catastrophically!

```
                        NEWTON'S SECOND LAW (LEX II)
                                F_net = dp/dt
                                     |
                 +-------------------+-------------------+
                 |                                       |
          Constant Mass (dm/dt = 0)               Variable Mass (dm/dt != 0)
             F_net = m * a                         F_net = m*a + v_rel * (dm/dt)
          (Classical Mechanics)                 (Rocketry / Continuum Mechanics)
```

---

## 1.5 The Principle of System Isolation and Internal vs. External Forces

Consider an arbitrary collection of $N$ interacting particles. Let us categorize every force acting on particle $i$ into two mutually exclusive sets:
1. **Internal Forces ($\vec{F}_{ij}$):** The force exerted on particle $i$ by another particle $j$ *inside* the system (e.g., interatomic bonds, electrostatic attractions, gravitational pull between bodies, contact collision normal forces).
2. **External Forces ($\vec{F}_{i,\text{ext}}$):** The force exerted on particle $i$ by an agent *outside* the system boundary (e.g., Earth's gravity acting on the system, ambient air drag, magnetic fields from external coils).

Newton's Second Law for particle $i$:

$$\frac{d\vec{p}_i}{dt} = \vec{F}_{i,\text{ext}} + \sum_{j \ne i}^N \vec{F}_{ij}$$

Now take the time derivative of the total momentum of the entire system:

$$\frac{d\vec{P}_{\text{total}}}{dt} = \sum_{i=1}^N \frac{d\vec{p}_i}{dt} = \sum_{i=1}^N \vec{F}_{i,\text{ext}} + \sum_{i=1}^N \sum_{j \ne i}^N \vec{F}_{ij}$$

Let us analyze the double summation of internal forces:

$$\sum_{i=1}^N \sum_{j \ne i}^N \vec{F}_{ij} = \sum_{1 \le i < j \le N} \left( \vec{F}_{ij} + \vec{F}_{ji} \right)$$

By **Newton’s Third Law (Lex III)**, every internal interaction between particle $i$ and particle $j$ forms an action-reaction pair that is equal in magnitude and opposite in direction:

$$\vec{F}_{ij} = -\vec{F}_{ji} \implies \vec{F}_{ij} + \vec{F}_{ji} \equiv \vec{0}$$

Therefore, the internal forces **cancel identically in pairs across the entire system**:

$$\sum_{i=1}^N \sum_{j \ne i}^N \vec{F}_{ij} \equiv \vec{0}$$

This yields the fundamental equation of composite system dynamics:

$$\frac{d\vec{P}_{\text{total}}}{dt} = \sum_{i=1}^N \vec{F}_{i,\text{ext}} = \vec{F}_{\text{net, ext}}$$

**The Law of Conservation of Linear Momentum:**
> *If the net external force acting on a system of bodies is zero ($\vec{F}_{\text{net, ext}} = \vec{0}$), the total linear momentum of the system remains strictly invariant in time:*
> $$\vec{F}_{\text{net, ext}} = \vec{0} \implies \frac{d\vec{P}_{\text{total}}}{dt} = \vec{0} \implies \vec{P}_{\text{total}} = \text{constant}$$

No internal interaction—no matter how violent, chemical, nuclear, or catastrophic (whether internal springs releasing, fireworks exploding, or atoms fusing)—can ever alter the total linear momentum of an isolated system by even a single micron-Newton-second!

---

## 1.6 Worked Numerical Examples (10 Progressive Scenarios)

The following 10 worked examples progress methodically from single-particle definitions to multi-body vector balances.

---

### Example 1.1: Fundamental Momentum Comparison
**Problem:** Compare the linear momentum magnitudes of three distinct physical objects:
1. An electron ($m_e = 9.109 \times 10^{-31}\,\text{kg}$) moving in a cathode-ray tube at $v_1 = 3.00 \times 10^7\,\text{m/s}$ ($10\%$ the speed of light).
2. A rifle bullet ($m_b = 0.0120\,\text{kg}$) fired at muzzle velocity $v_2 = 850.0\,\text{m/s}$.
3. A cargo supertanker ($M_t = 2.50 \times 10^8\,\text{kg}$) drifting into dock at a glacial speed of $v_3 = 0.0400\,\text{m/s}$ ($4.0\,\text{cm/s}$).

**Solution:**
- **Step 1: Electron momentum**
  $$p_e = m_e v_1 = (9.109 \times 10^{-31}\,\text{kg})(3.00 \times 10^7\,\text{m/s}) = 2.733 \times 10^{-23}\,\text{kg}\cdot\text{m/s}$$

- **Step 2: Bullet momentum**
  $$p_b = m_b v_2 = (0.0120\,\text{kg})(850.0\,\text{m/s}) = 10.20\,\text{kg}\cdot\text{m/s}$$

- **Step 3: Supertanker momentum**
  $$p_t = M_t v_3 = (2.50 \times 10^8\,\text{kg})(0.0400\,\text{m/s}) = 1.00 \times 10^7\,\text{kg}\cdot\text{m/s}$$

- **Comparison:**
  $$\frac{p_t}{p_b} = \frac{1.00 \times 10^7}{10.20} \approx 980,392$$
  The drifting tanker carries nearly one million times more momentum than a high-powered rifle bullet, illustrating how overwhelming mass dominates modest velocity!

---

### Example 1.2: Vector Momentum Decomposition in 2D
**Problem:** A robotic automated guided vehicle (AGV) of mass $m = 120.0\,\text{kg}$ navigates a warehouse floor with velocity vector $\vec{v} = 3.50\,\hat{i} - 2.80\,\hat{j}\,\text{m/s}$.
1. Calculate the Cartesian components of its momentum vector ($p_x, p_y$).
2. Compute the scalar magnitude $\|\vec{p}\|$.
3. Determine the directional heading angle $\theta$ relative to the $+x$ axis.

**Solution:**
- **Step 1: Component calculation**
  $$p_x = m v_x = (120.0\,\text{kg})(+3.50\,\text{m/s}) = +420.0\,\text{kg}\cdot\text{m/s}$$
  $$p_y = m v_y = (120.0\,\text{kg})(-2.80\,\text{m/s}) = -336.0\,\text{kg}\cdot\text{m/s}$$
  $$\vec{p} = 420.0\,\hat{i} - 336.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$

- **Step 2: Momentum magnitude**
  $$\|\vec{p}\| = \sqrt{p_x^2 + p_y^2} = \sqrt{(420.0)^2 + (-336.0)^2} = \sqrt{176,400 + 112,896} = \sqrt{289,296} = 537.86\,\text{kg}\cdot\text{m/s}$$
  *Sanity Check:*
  $$v = \sqrt{3.50^2 + (-2.80)^2} = \sqrt{12.25 + 7.84} = \sqrt{20.09} = 4.4822\,\text{m/s}$$
  $$p = m v = (120.0)(4.4822) = 537.86\,\text{kg}\cdot\text{m/s}$$. Perfect agreement.

- **Step 3: Heading angle**
  $$\theta = \arctan\left(\frac{p_y}{p_x}\right) = \arctan\left(\frac{-336.0}{420.0}\right) = \arctan(-0.800) = -38.66^\circ$$
  The AGV translates at $38.66^\circ$ south of east.

---

### Example 1.3: Total Momentum of a Multi-Particle System
**Problem:** Three particles move in the $xy$-plane:
- Particle 1: $m_1 = 2.00\,\text{kg}$ at $\vec{v}_1 = (4.00\,\hat{i} + 3.00\,\hat{j})\,\text{m/s}$.
- Particle 2: $m_2 = 3.50\,\text{kg}$ at $\vec{v}_2 = (-2.00\,\hat{i} + 6.00\,\hat{j})\,\text{m/s}$.
- Particle 3: $m_3 = 1.50\,\text{kg}$ at $\vec{v}_3 = (-5.00\,\hat{i} - 8.00\,\hat{j})\,\text{m/s}$.
1. Compute the total momentum vector $\vec{P}_{\text{total}}$.
2. Determine the velocity of the center of mass $\vec{V}_{\text{CM}}$.

**Solution:**
- **Step 1: Individual momentum vectors**
  $$\vec{p}_1 = m_1 \vec{v}_1 = 2.00(4.00\,\hat{i} + 3.00\,\hat{j}) = 8.00\,\hat{i} + 6.00\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  $$\vec{p}_2 = m_2 \vec{v}_2 = 3.50(-2.00\,\hat{i} + 6.00\,\hat{j}) = -7.00\,\hat{i} + 21.00\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  $$\vec{p}_3 = m_3 \vec{v}_3 = 1.50(-5.00\,\hat{i} - 8.00\,\hat{j}) = -7.50\,\hat{i} - 12.00\,\hat{j}\,\text{kg}\cdot\text{m/s}$$

- **Step 2: Vector summation**
  $$P_x = 8.00 - 7.00 - 7.50 = -6.50\,\text{kg}\cdot\text{m/s}$$
  $$P_y = 6.00 + 21.00 - 12.00 = +15.00\,\text{kg}\cdot\text{m/s}$$
  $$\vec{P}_{\text{total}} = -6.50\,\hat{i} + 15.00\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  Magnitude:
  $$\|\vec{P}_{\text{total}}\| = \sqrt{(-6.50)^2 + 15.00^2} = \sqrt{42.25 + 225.00} = \sqrt{267.25} = 16.348\,\text{kg}\cdot\text{m/s}$$

- **Step 3: Center of mass velocity**
  $$M_{\text{total}} = m_1 + m_2 + m_3 = 2.00 + 3.50 + 1.50 = 7.00\,\text{kg}$$
  $$\vec{V}_{\text{CM}} = \frac{\vec{P}_{\text{total}}}{M_{\text{total}}} = \frac{-6.50\,\hat{i} + 15.00\,\hat{j}}{7.00} = -0.9286\,\hat{i} + 2.1429\,\hat{j}\,\text{m/s}$$

---

### Example 1.4: Newton’s Second Law in Momentum Derivative Form
**Problem:** The linear momentum of an experimental rocket sled along a straight track is measured as a function of time:
$$p(t) = 50.0 t^3 - 120.0 t^2 + 400.0\,\text{kg}\cdot\text{m/s}$$
1. Find the instantaneous net force $F_{\text{net}}(t)$ acting on the sled.
2. Calculate the net force at $t = 1.00\,\text{s}$ and $t = 3.00\,\text{s}$.
3. At what time $t > 0$ is the net force zero?

**Solution:**
- **Step 1: Differentiate momentum with respect to time**
  $$F_{\text{net}}(t) = \frac{dp}{dt} = \frac{d}{dt}\left( 50.0 t^3 - 120.0 t^2 + 400.0 \right) = 150.0 t^2 - 240.0 t\,\text{N}$$

- **Step 2: Force evaluation**
  - At $t = 1.00\,\text{s}$:
    $$F_{\text{net}}(1.00) = 150.0(1.00)^2 - 240.0(1.00) = 150.0 - 240.0 = -90.0\,\text{N}$$
    (A net braking force of $90.0\,\text{N}$).
  - At $t = 3.00\,\text{s}$:
    $$F_{\text{net}}(3.00) = 150.0(3.00)^2 - 240.0(3.00) = 150.0(9.00) - 720.0 = 1350.0 - 720.0 = +630.0\,\text{N}$$

- **Step 3: Time when net force vanishes**
  $$150.0 t^2 - 240.0 t = 0 \implies t(150.0 t - 240.0) = 0$$
  For $t > 0$:
  $$150.0 t = 240.0 \implies t = \frac{240.0}{150.0} = 1.60\,\text{s}$$

---

### Example 1.5: Kinetic Energy Expressed in Terms of Momentum
**Problem:**
1. Derive the mathematical relation expressing kinetic energy $K$ directly in terms of momentum magnitude $p$ and mass $m$.
2. A sports car of mass $m_1 = 1200\,\text{kg}$ and a loaded semi-trailer truck of mass $m_2 = 24,000\,\text{kg}$ have the **exact same linear momentum** $p = 72,000\,\text{kg}\cdot\text{m/s}$. Compute the kinetic energy of both vehicles. Which has more energy, and by what factor?

**Solution:**
- **Step 1: Derivation**
  $$K = \frac{1}{2} m v^2$$
  Since $p = m v \implies v = \frac{p}{m}$:
  $$K = \frac{1}{2} m \left(\frac{p}{m}\right)^2 = \frac{1}{2} m \frac{p^2}{m^2} = \frac{p^2}{2m}$$

- **Step 2: Numerical evaluation**
  $$p^2 = (72,000\,\text{kg}\cdot\text{m/s})^2 = 5,184,000,000\,\text{kg}^2\cdot\text{m}^2/\text{s}^2$$
  - For the sports car ($m_1 = 1200\,\text{kg}$):
    $$K_1 = \frac{p^2}{2 m_1} = \frac{5,184,000,000}{2(1200)} = \frac{5,184,000,000}{2400} = 2,160,000\,\text{J} = 2.16\,\text{MJ}$$
  - For the heavy truck ($m_2 = 24,000\,\text{kg}$):
    $$K_2 = \frac{p^2}{2 m_2} = \frac{5,184,000,000}{2(24,000)} = \frac{5,184,000,000}{48,000} = 108,000\,\text{J} = 0.108\,\text{MJ}$$

- **Step 3: Comparison**
  $$\frac{K_1}{K_2} = \frac{m_2}{m_1} = \frac{24,000\,\text{kg}}{1200\,\text{kg}} = 20.0$$
  The sports car possesses **20 times more kinetic energy** than the truck!
  *Profound Insight:* When two bodies share identical momentum, the lighter body carries proportionally greater kinetic energy ($K \propto 1/m$).

---

### Example 1.6: Momentum of a Relativistic Particle
**Problem:** In special relativity, momentum is given by $\vec{p} = \gamma m_0 \vec{v}$, where $\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}$ is the Lorentz factor and $m_0$ is rest mass.
A proton ($m_0 = 1.673 \times 10^{-27}\,\text{kg}$) is accelerated in the Large Hadron Collider to $v = 0.99990\,c$, where $c = 2.998 \times 10^8\,\text{m/s}$.
1. Calculate the Lorentz factor $\gamma$.
2. Compute the true relativistic momentum $p_{\text{rel}}$.
3. Compute the classical Newtonian momentum $p_{\text{class}} = m_0 v$ and determine the percentage error incurred by classical mechanics.

**Solution:**
- **Step 1: Lorentz factor $\gamma$**
  $$\frac{v}{c} = 0.99990 \implies \left(\frac{v}{c}\right)^2 = (0.99990)^2 = 0.99980001$$
  $$1 - \frac{v^2}{c^2} = 1 - 0.99980001 = 0.00019999$$
  $$\gamma = \frac{1}{\sqrt{0.00019999}} = \frac{1}{0.0141418} = 70.712$$

- **Step 2: Relativistic momentum**
  $$v = 0.99990 \times (2.998 \times 10^8\,\text{m/s}) = 2.9977 \times 10^8\,\text{m/s}$$
  $$p_{\text{rel}} = \gamma m_0 v = (70.712)(1.673 \times 10^{-27}\,\text{kg})(2.9977 \times 10^8\,\text{m/s}) = 3.546 \times 10^{-17}\,\text{kg}\cdot\text{m/s}$$

- **Step 3: Classical momentum and error**
  $$p_{\text{class}} = m_0 v = (1.673 \times 10^{-27})(2.9977 \times 10^8) = 5.015 \times 10^{-19}\,\text{kg}\cdot\text{m/s}$$
  $$\frac{p_{\text{rel}}}{p_{\text{class}}} = \gamma \approx 70.71$$
  Classical mechanics underestimates the proton's momentum by a factor of over **70** (an error of $6971\%$)!

---

### Example 1.7: Momentum Transferred by a Continuous Sand Flow
**Problem:** Dry silica sand drops vertically from a stationary hopper at a continuous mass flow rate of $R = \frac{dm}{dt} = 15.0\,\text{kg/s}$ onto a horizontal conveyor belt moving at constant speed $v_{\text{belt}} = 2.50\,\text{m/s}$.
1. Calculate the rate at which horizontal momentum must be imparted to the falling sand.
2. What horizontal force $F_{\text{drive}}$ must the conveyor belt motor exert purely to maintain constant belt velocity?
3. Compute the power expended by the motor, and compare it to the rate of increase of kinetic energy of the sand.

**Solution:**
- **Step 1: Rate of horizontal momentum transfer**
  The sand hits the belt with zero horizontal velocity ($v_{x,\text{init}} = 0$).
  It is accelerated to $v_{x,\text{final}} = v_{\text{belt}} = 2.50\,\text{m/s}$.
  $$\frac{dp_x}{dt} = \left(\frac{dm}{dt}\right) v_{\text{belt}} = (15.0\,\text{kg/s})(2.50\,\text{m/s}) = 37.5\,\text{kg}\cdot\text{m/s}^2 = 37.5\,\text{N}$$

- **Step 2: Required motor force**
  By Newton's Second Law ($\vec{F} = d\vec{p}/dt$):
  $$F_{\text{drive}} = \frac{dp_x}{dt} = 37.5\,\text{N}$$

- **Step 3: Power comparison**
  - Motor mechanical power:
    $$P_{\text{motor}} = F_{\text{drive}} \cdot v_{\text{belt}} = (37.5\,\text{N})(2.50\,\text{m/s}) = 93.75\,\text{W}$$
  - Rate of increase of sand kinetic energy:
    $$\frac{dK}{dt} = \frac{d}{dt}\left(\frac{1}{2} m v_{\text{belt}}^2\right) = \frac{1}{2}\left(\frac{dm}{dt}\right) v_{\text{belt}}^2 = \frac{1}{2}(15.0)(2.50)^2 = 0.5 \times 15.0 \times 6.25 = 46.875\,\text{W}$$
  *The Mystery of the Missing Energy:*
  $$P_{\text{motor}} = 93.75\,\text{W} = 2 \times \frac{dK}{dt}$$
  Why does the motor supply twice as much power as the sand gains in kinetic energy?
  The remaining $50\%$ ($46.875\,\text{W}$) is dissipated as **frictional heat** at the impact interface as the stationary falling sand grains slip against the moving belt before matching its speed!

---

### Example 1.8: Firefighter Hose Reaction Force
**Problem:** A fire hose nozzle of diameter $d = 0.0650\,\text{m}$ discharges water ($\rho = 1000\,\text{kg/m}^3$) at a volumetric flow rate of $Q = 0.0800\,\text{m}^3/\text{s}$.
1. Calculate the exit velocity $v_{\text{exit}}$ of the water jet.
2. Determine the mass flow rate $\dot{m}$.
3. Calculate the horizontal recoil force $F_{\text{recoil}}$ that the firefighter team must exert to hold the nozzle stationary.

**Solution:**
- **Step 1: Exit velocity**
  Nozzle cross-sectional area:
  $$A = \frac{\pi d^2}{4} = \frac{\pi (0.0650\,\text{m})^2}{4} = \frac{\pi(0.004225)}{4} = 0.0033183\,\text{m}^2$$
  Exit speed:
  $$v_{\text{exit}} = \frac{Q}{A} = \frac{0.0800\,\text{m}^3/\text{s}}{0.0033183\,\text{m}^2} = 24.109\,\text{m/s}$$

- **Step 2: Mass flow rate**
  $$\dot{m} = \rho Q = (1000\,\text{kg/m}^3)(0.0800\,\text{m}^3/\text{s}) = 80.0\,\text{kg/s}$$

- **Step 3: Recoil force**
  The nozzle ejects momentum forward at rate:
  $$\frac{dp}{dt} = \dot{m} v_{\text{exit}} = (80.0\,\text{kg/s})(24.109\,\text{m/s}) = 1928.7\,\text{N}$$
  By Newton’s Third Law, the water jet pushes backward on the nozzle with $1928.7\,\text{N}$.
  $$F_{\text{recoil}} = 1929\,\text{N} \approx 434\,\text{lbf}$$
  This formidable force requires three to four firefighters bracing against the ground to maintain control!

---

### Example 1.9: Exploding Projectile in Mid-Air
**Problem:** An artillery shell of mass $M = 18.0\,\text{kg}$ is tracking through the air. At the exact apex of its parabolic trajectory, when it has zero vertical velocity and a purely horizontal velocity $\vec{v}_0 = +150.0\,\hat{i}\,\text{m/s}$, an internal charge detonates, splitting the shell into two fragments:
- Fragment 1 ($m_1 = 6.00\,\text{kg}$) is observed immediately after the blast traveling vertically upward at $\vec{v}_1 = +80.0\,\hat{j}\,\text{m/s}$.
1. Determine the velocity vector $\vec{v}_2$ of Fragment 2 ($m_2 = 12.0\,\text{kg}$) immediately after the explosion.
2. Compute the scalar speed and trajectory angle of Fragment 2.
3. Calculate the chemical energy released by the internal explosion that was converted into mechanical kinetic energy.

**Solution:**
- **Step 1: Momentum conservation vector balance**
  Because the explosion is an internal interaction ($\Delta t \approx 0$, so gravity impulse is negligible during the blast):
  $$\vec{P}_{\text{init}} = M \vec{v}_0 = (18.0\,\text{kg})(150.0\,\hat{i}\,\text{m/s}) = 2700.0\,\hat{i}\,\text{kg}\cdot\text{m/s}$$
  After explosion:
  $$\vec{p}_1 = m_1 \vec{v}_1 = (6.00\,\text{kg})(+80.0\,\hat{j}\,\text{m/s}) = +480.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  By conservation of momentum:
  $$\vec{P}_{\text{init}} = \vec{p}_1 + \vec{p}_2 \implies \vec{p}_2 = \vec{P}_{\text{init}} - \vec{p}_1$$
  $$\vec{p}_2 = 2700.0\,\hat{i} - 480.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
  Velocity of Fragment 2:
  $$\vec{v}_2 = \frac{\vec{p}_2}{m_2} = \frac{2700.0\,\hat{i} - 480.0\,\hat{j}}{12.0\,\text{kg}} = +225.0\,\hat{i} - 40.0\,\hat{j}\,\text{m/s}$$

- **Step 2: Speed and angle of Fragment 2**
  $$v_2 = \sqrt{225.0^2 + (-40.0)^2} = \sqrt{50,625 + 1600} = \sqrt{52,225} = 228.53\,\text{m/s}$$
  $$\theta_2 = \arctan\left(\frac{-40.0}{225.0}\right) = \arctan(-0.17778) = -10.08^\circ \quad (\text{below horizontal})$$

- **Step 3: Kinetic energy calculation**
  - Initial kinetic energy:
    $$K_{\text{init}} = \frac{1}{2} M v_0^2 = \frac{1}{2}(18.0\,\text{kg})(150.0\,\text{m/s})^2 = 9.0 \times 22,500 = 202,500\,\text{J}$$
  - Final kinetic energy:
    $$K_{1f} = \frac{1}{2} m_1 v_1^2 = \frac{1}{2}(6.00\,\text{kg})(80.0\,\text{m/s})^2 = 3.0 \times 6400 = 19,200\,\text{J}$$
    $$K_{2f} = \frac{1}{2} m_2 v_2^2 = \frac{1}{2}(12.0\,\text{kg})(52,225\,\text{m}^2/\text{s}^2) = 6.0 \times 52,225 = 313,350\,\text{J}$$
    $$K_{\text{final}} = K_{1f} + K_{2f} = 19,200 + 313,350 = 332,550\,\text{J}$$
  - Energy added by explosion:
    $$\Delta E_{\text{blast}} = K_{\text{final}} - K_{\text{init}} = 332,550 - 202,500 = 130,050\,\text{J} = 130.05\,\text{kJ}$$

---

### Example 1.10: Solar Radiation Pressure and Photon Momentum
**Problem:** Quantum electrodynamics and Maxwell’s electromagnetism establish that light carries linear momentum despite photons possessing zero rest mass:
$$p = \frac{E}{c}$$
The solar irradiance at Earth's orbit is $S = 1361\,\text{W/m}^2$. A solar sail spacecraft deploys a perfectly reflecting aluminum sail of area $A = 50,000\,\text{m}^2$ perpendicular to the Sun's rays.
1. Compute the momentum delivered per second by the reflected photons.
2. Determine the radiation pressure force $F_{\text{rad}}$ exerted on the sail.
3. If the total spacecraft mass is $m = 250\,\text{kg}$, calculate its solar sail acceleration.

**Solution:**
- **Step 1: Total solar power intercepted**
  $$P_{\text{incident}} = S \cdot A = (1361\,\text{W/m}^2)(50,000\,\text{m}^2) = 68,050,000\,\text{W} = 68.05\,\text{MW}$$

- **Step 2: Radiation pressure force (Double momentum reflection)**
  Each incident photon carries momentum $p = E/c$. Upon specular reflection, its momentum reverses from $+p$ to $-p$, delivering a momentum impulse of:
  $$\Delta p = 2p = \frac{2E}{c}$$
  The net force exerted on a perfectly reflecting sail is:
  $$F_{\text{rad}} = \frac{2 P_{\text{incident}}}{c} = \frac{2(68,050,000\,\text{W})}{2.998 \times 10^8\,\text{m/s}} = \frac{136,100,000}{2.998 \times 10^8} = 0.4540\,\text{N}$$

- **Step 3: Spacecraft acceleration**
  $$a = \frac{F_{\text{rad}}}{m} = \frac{0.4540\,\text{N}}{250\,\text{kg}} = 0.001816\,\text{m/s}^2 = 1.816\,\text{mm/s}^2$$
  *Cumulative Impact:* While $1.8\,\text{mm/s}^2$ seems tiny, acting continuously for one year ($3.15 \times 10^7\,\text{seconds}$) without consuming a single drop of fuel:
  $$\Delta v = a \Delta t = (0.001816)(3.1536 \times 10^7) \approx 57,270\,\text{m/s} = 57.3\,\text{km/s}$$
  The spacecraft achieves interplanetary cruise velocity solely from photon momentum!

---

## 1.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 1.8.

### Tier 1: Foundational Momentum Calculations
- **Exercise 1.1:** A hockey puck of mass $0.160\,\text{kg}$ travels at $42.0\,\text{m/s}$. Compute its momentum in $\text{kg}\cdot\text{m/s}$ and in $\text{g}\cdot\text{cm/s}$.
- **Exercise 1.2:** A $75.0\,\text{kg}$ sprinter running at $10.5\,\text{m/s}$ and a $1200\,\text{kg}$ compact car moving at $v_c$ have the same momentum. Compute $v_c$.

### Tier 2: 2D Vector Components & Momentum Ratios
- **Exercise 1.3:** An object of mass $m = 4.00\,\text{kg}$ has momentum $\vec{p} = -16.0\,\hat{i} + 30.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$. Find its velocity vector, speed, and heading angle.
- **Exercise 1.4:** A proton ($m_p = 1.67 \times 10^{-27}\,\text{kg}$) and an alpha particle ($m_\alpha = 6.64 \times 10^{-27}\,\text{kg}$) have identical kinetic energy. Find the ratio of their momenta $p_\alpha / p_p$.

### Tier 3: Time-Varying Momentum & Force Flux
- **Exercise 1.5:** The momentum of a test body is given by $\vec{p}(t) = (4.0 t^2 - 6.0 t)\,\hat{i} + (3.0 t + 8.0)\,\hat{j}\,\text{kg}\cdot\text{m/s}$. Calculate the magnitude of the net force acting on the body at $t = 2.00\,\text{s}$.
- **Exercise 1.6:** Gravel drops vertically at $20.0\,\text{kg/s}$ onto a flatbed train car moving at $5.00\,\text{m/s}$. Find the horizontal retarding force exerted on the locomotive.

### Tier 4: Internal Fragmentation & Multi-Particle Superposition
- **Exercise 1.7:** A stationary firework shell of mass $M = 0.900\,\text{kg}$ detonates into three equal pieces ($0.300\,\text{kg}$ each). Fragment A flies East at $40.0\,\text{m/s}$; Fragment B flies North at $30.0\,\text{m/s}$. Find the velocity vector and speed of Fragment C.
- **Exercise 1.8:** A machine gun fires $600$ rounds per minute. Each bullet has mass $m = 0.0150\,\text{kg}$ and exit speed $v = 800.0\,\text{m/s}$. Calculate the average recoil force exerted on the mounting tripod.

### Tier 5: Relativistic & Continuum Momentum Mechanics
- **Exercise 1.9:** A cosmic ray electron travels at $v = 0.990\,c$. What is the ratio of its relativistic momentum to its classical Newtonian momentum?
- **Exercise 1.10:** A heavy chain of length $L = 2.00\,\text{m}$ and mass $M = 4.00\,\text{kg}$ is held vertically by its top link with its bottom link touching a scale. It is released from rest. Derive the force registered by the scale as a function of the fallen distance $y$, and find the scale reading at the instant the last link lands ($g = 9.81\,\text{m/s}^2$).

---

## 1.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 1.1
- **Given:** $m = 0.160\,\text{kg}$, $v = 42.0\,\text{m/s}$.
- **Step 1: SI Momentum**
  $$p = m v = (0.160\,\text{kg})(42.0\,\text{m/s}) = 6.72\,\text{kg}\cdot\text{m/s}$$
- **Step 2: Convert to CGS units**
  $$1\,\text{kg}\cdot\text{m/s} = 10^5\,\text{g}\cdot\text{cm/s}$$
  $$p_{\text{CGS}} = 6.72 \times 10^5\,\text{g}\cdot\text{cm/s} = 672,000\,\text{g}\cdot\text{cm/s}$$

---

### Solution 1.2
- **Given:** $m_s = 75.0\,\text{kg}$, $v_s = 10.5\,\text{m/s}$, $m_c = 1200\,\text{kg}$.
- **Step 1: Sprinter momentum**
  $$p = m_s v_s = (75.0\,\text{kg})(10.5\,\text{m/s}) = 787.5\,\text{kg}\cdot\text{m/s}$$
- **Step 2: Car velocity**
  $$v_c = \frac{p}{m_c} = \frac{787.5\,\text{kg}\cdot\text{m/s}}{1200\,\text{kg}} = 0.65625\,\text{m/s} \approx 0.656\,\text{m/s} = 2.36\,\text{km/h}$$

---

### Solution 1.3
- **Given:** $m = 4.00\,\text{kg}$, $\vec{p} = -16.0\,\hat{i} + 30.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$.
- **Step 1: Velocity vector**
  $$\vec{v} = \frac{\vec{p}}{m} = \frac{-16.0\,\hat{i} + 30.0\,\hat{j}}{4.00} = -4.00\,\hat{i} + 7.50\,\hat{j}\,\text{m/s}$$
- **Step 2: Speed**
  $$v = \sqrt{(-4.00)^2 + 7.50^2} = \sqrt{16.00 + 56.25} = \sqrt{72.25} = 8.50\,\text{m/s}$$
- **Step 3: Heading angle**
  $$\theta = \arctan\left(\frac{7.50}{-4.00}\right) = \arctan(-1.875) = 180^\circ - 61.93^\circ = 118.07^\circ \quad (\text{NW quadrant})$$

---

### Solution 1.4
- **Given:** $K_p = K_\alpha$, $m_p = 1.67 \times 10^{-27}\,\text{kg}$, $m_\alpha = 6.64 \times 10^{-27}\,\text{kg}$.
- **Step 1: Momentum-energy relation**
  $$K = \frac{p^2}{2m} \implies p = \sqrt{2mK}$$
- **Step 2: Ratio of momenta**
  $$\frac{p_\alpha}{p_p} = \frac{\sqrt{2 m_\alpha K}}{\sqrt{2 m_p K}} = \sqrt{\frac{m_\alpha}{m_p}} = \sqrt{\frac{6.64 \times 10^{-27}}{1.67 \times 10^{-27}}} = \sqrt{3.976} \approx 1.994 \approx 2.00$$
  The alpha particle carries twice the momentum of the proton.

---

### Solution 1.5
- **Given:** $\vec{p}(t) = (4.0 t^2 - 6.0 t)\,\hat{i} + (3.0 t + 8.0)\,\hat{j}$.
- **Step 1: Differentiate to find force**
  $$\vec{F}(t) = \frac{d\vec{p}}{dt} = (8.0 t - 6.0)\,\hat{i} + 3.0\,\hat{j}\,\text{N}$$
- **Step 2: Evaluate at $t = 2.00\,\text{s}$**
  $$F_x = 8.0(2.00) - 6.0 = 16.0 - 6.0 = 10.0\,\text{N}$$
  $$F_y = 3.0\,\text{N}$$
  $$\vec{F}(2.00) = 10.0\,\hat{i} + 3.0\,\hat{j}\,\text{N}$$
  $$\|\vec{F}\| = \sqrt{10.0^2 + 3.0^2} = \sqrt{100.0 + 9.0} = \sqrt{109.0} = 10.44\,\text{N}$$

---

### Solution 1.6
- **Given:** $\frac{dm}{dt} = 20.0\,\text{kg/s}$, $v = 5.00\,\text{m/s}$.
- **Step 1: Force calculation**
  $$F = \left(\frac{dm}{dt}\right) v = (20.0\,\text{kg/s})(5.00\,\text{m/s}) = 100.0\,\text{N}$$
  The locomotive must exert $100.0\,\text{N}$ of additional traction to maintain speed.

---

### Solution 1.7
- **Given:** $M = 0.900\,\text{kg}$, $m_A = m_B = m_C = 0.300\,\text{kg}$. Stationary initial state ($\vec{P}_{\text{init}} = \vec{0}$).
- **Step 1: Momentum of fragments A and B**
  $$\vec{p}_A = (0.300\,\text{kg})(+40.0\,\hat{i}\,\text{m/s}) = +12.0\,\hat{i}\,\text{kg}\cdot\text{m/s}$$
  $$\vec{p}_B = (0.300\,\text{kg})(+30.0\,\hat{j}\,\text{m/s}) = +9.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
- **Step 2: Solve for $\vec{p}_C$**
  $$\vec{P}_{\text{init}} = \vec{p}_A + \vec{p}_B + \vec{p}_C = \vec{0} \implies \vec{p}_C = -(\vec{p}_A + \vec{p}_B) = -12.0\,\hat{i} - 9.0\,\hat{j}\,\text{kg}\cdot\text{m/s}$$
- **Step 3: Velocity of fragment C**
  $$\vec{v}_C = \frac{\vec{p}_C}{m_C} = \frac{-12.0\,\hat{i} - 9.0\,\hat{j}}{0.300\,\text{kg}} = -40.0\,\hat{i} - 30.0\,\hat{j}\,\text{m/s}$$
  $$v_C = \sqrt{(-40.0)^2 + (-30.0)^2} = \sqrt{1600 + 900} = \sqrt{2500} = 50.0\,\text{m/s}$$
  Fragment C flies South-West ($216.87^\circ$) at $50.0\,\text{m/s}$.

---

### Solution 1.8
- **Given:** Rate = 600 rounds/min = $10.0\,\text{rounds/s}$. $m = 0.0150\,\text{kg}$, $v = 800.0\,\text{m/s}$.
- **Step 1: Mass flow rate**
  $$\dot{m} = (10.0\,\text{bullets/s})(0.0150\,\text{kg}) = 0.150\,\text{kg/s}$$
- **Step 2: Average recoil force**
  $$F_{\text{avg}} = \dot{m} v = (0.150\,\text{kg/s})(800.0\,\text{m/s}) = 120.0\,\text{N} \approx 27.0\,\text{lbf}$$

---

### Solution 1.9
- **Given:** $v = 0.990\,c$.
- **Step 1: Lorentz factor**
  $$\gamma = \frac{1}{\sqrt{1 - 0.990^2}} = \frac{1}{\sqrt{1 - 0.9801}} = \frac{1}{\sqrt{0.0199}} = \frac{1}{0.141067} = 7.0888$$
- **Step 2: Ratio of momenta**
  $$\frac{p_{\text{rel}}}{p_{\text{class}}} = \frac{\gamma m_0 v}{m_0 v} = \gamma = 7.09$$
  The relativistic momentum is $7.09$ times greater than the classical prediction.

---

### Solution 1.10
- **Given:** Uniform chain of length $L = 2.00\,\text{m}$, mass $M = 4.00\,\text{kg}$, linear density $\lambda = M/L = 2.00\,\text{kg/m}$.
- **Step 1: Analyze components of the scale reading**
  When a length $y$ of the chain has fallen:
  1. **Static weight of the chain already resting on the pan:**
     $$W(y) = (\lambda y) g$$
  2. **Dynamic impact force of links being brought to rest:**
     A link hitting the pan has fallen distance $y$ in free fall, so its speed is $v = \sqrt{2gy}$.
     The mass flow rate hitting the pan is $\frac{dm}{dt} = \lambda v = \lambda \sqrt{2gy}$.
     The rate of momentum destruction (downward force on scale) is:
     $$F_{\text{impact}} = \left(\frac{dm}{dt}\right) v = (\lambda v) v = \lambda v^2 = \lambda(2gy) = 2\lambda g y$$
- **Step 2: Total instantaneous scale force**
  $$F_{\text{scale}}(y) = W(y) + F_{\text{impact}} = \lambda g y + 2\lambda g y = 3\lambda g y$$
  *Remarkable Theorem:* At every instant during the fall, the scale reading is **three times the weight of the chain resting on it**!
- **Step 3: Force at the instant the last link lands ($y = L$)**
  $$F_{\text{scale}}(L) = 3 \lambda g L = 3 M g = 3(4.00\,\text{kg})(9.81\,\text{m/s}^2) = 3(39.24\,\text{N}) = 117.72\,\text{N}$$
  The scale momentarily registers **three times the total weight of the chain** ($117.7\,\text{N}$) before immediately dropping back down to static weight ($39.24\,\text{N}$) once all links come to rest!
